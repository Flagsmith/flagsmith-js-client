import { SDK_VERSION } from './utils/version';
import { ensureTrailingSlash } from './utils/ensureTrailingSlash';
import { LikeFetch } from './flagsmith-core';
import { IFlagsmithValue } from './types';

export const FLAG_EXPOSURE_EVENT = '$flag_exposure';
export const DEFAULT_EVENTS_API_URL = 'https://events.api.flagsmith.com/';
const DEFAULT_MAX_BUFFER = 1000;
const DEFAULT_FLUSH_INTERVAL = 10000;
const DEFAULT_RETRY_BACKOFF_MS = 1000;
const DEFAULT_REQUEST_TIMEOUT_MS = 3000;
const MAX_ATTEMPTS = 3;
const TRANSIENT_STATUSES = [408, 429, 502, 503, 504];

export interface IEvent {
    event: string;
    feature_name: string | null;
    identifier: string | null;
    value: string | null;
    traits: Record<string, IFlagsmithValue> | null;
    metadata: Record<string, unknown> | null;
    timestamp: number;
}

export interface EventProcessorOptions {
    environmentKey: string;
    fetch: LikeFetch;
    eventsApiUrl?: string;
    maxBuffer?: number;
    flushInterval?: number;
    log?: (...args: any[]) => void;
    retryBackoffMs?: number;
    requestTimeoutMs?: number;
}

interface EventArgs {
    identifier: string | null;
    value: IFlagsmithValue;
    traits: Record<string, IFlagsmithValue> | null;
    metadata: Record<string, unknown> | null;
}

interface TrackEventArgs extends EventArgs {
    event: string;
}

interface TrackExposureArgs extends EventArgs {
    featureName: string;
}

/**
 * How a request to the events API ended:
 * - transient: retried; a batch whose attempts all end this way is kept for the next flush.
 * - server_error: retried; a batch whose last attempt ends this way is dropped.
 * - rejected: dropped at once.
 * - unauthorised: the environment key was refused, so event tracking stops.
 */
type SendOutcome = 'delivered' | 'transient' | 'server_error' | 'rejected' | 'unauthorised';

export class EventProcessor {
    private endpoint: string;
    private environmentKey: string;
    private fetch: LikeFetch;
    private log: (...args: any[]) => void;
    private maxBuffer: number;
    private flushInterval: number;
    private retryBackoffMs: number;
    private requestTimeoutMs: number;
    private buffer: IEvent[] = [];
    private dedupeKeys: Map<string, number> = new Map(); // buffered copies of each exposure
    private timer: ReturnType<typeof setInterval> | null = null;
    // The batch being sent, resolving to whether it was kept for the next flush.
    private sending: Promise<boolean> | null = null;
    private held = false; // a kept batch waits for the next flush rather than a full buffer
    private disabled = false; // the events API refused the environment key
    private closed = false;
    private abortRequest: (() => void) | null = null;

    constructor(opts: EventProcessorOptions) {
        const url = ensureTrailingSlash(opts.eventsApiUrl || DEFAULT_EVENTS_API_URL);
        this.endpoint = `${url}v1/events`;
        this.environmentKey = opts.environmentKey;
        this.fetch = opts.fetch;
        this.log = opts.log || (() => {});
        this.maxBuffer = Math.max(1, opts.maxBuffer ?? DEFAULT_MAX_BUFFER);
        this.flushInterval = opts.flushInterval ?? DEFAULT_FLUSH_INTERVAL;
        this.retryBackoffMs = opts.retryBackoffMs ?? DEFAULT_RETRY_BACKOFF_MS;
        this.requestTimeoutMs = opts.requestTimeoutMs ?? DEFAULT_REQUEST_TIMEOUT_MS;
    }

    trackEvent(args: TrackEventArgs) {
        this.bufferEvent(args.event, null, args.identifier, args.value, args.traits, args.metadata, false);
    }

    trackExposureEvent(args: TrackExposureArgs) {
        this.bufferEvent(FLAG_EXPOSURE_EVENT, args.featureName, args.identifier, args.value, args.traits, args.metadata, true);
    }

    private bufferEvent(
        event: string,
        feature_name: string | null,
        identifier: string | null,
        value: IFlagsmithValue,
        traits: Record<string, IFlagsmithValue> | null,
        metadata: Record<string, unknown> | null,
        dedupe: boolean,
    ) {
        if (this.disabled || this.closed) return;
        const entry: IEvent = {
            event,
            feature_name,
            identifier,
            value: value != null ? String(value) : null,
            traits,
            metadata: { ...(metadata || {}), sdk_version: SDK_VERSION },
            timestamp: Date.now(),
        };
        try {
            JSON.stringify(entry);
        } catch (err) {
            this.log(`Events: dropped event "${event}", which cannot be serialised to JSON`, err);
            return;
        }
        if (dedupe) {
            if (this.dedupeKeys.has(this.dedupeKey(entry))) return;
            this.rememberExposure(entry);
        }
        this.buffer.push(entry);
        this.dropOverflow();
        this.flushIfFull();
    }

    private dedupeKey(entry: IEvent) {
        return JSON.stringify([entry.event, entry.feature_name, entry.identifier, entry.value, entry.metadata?.experiment_id ?? null]);
    }

    private rememberExposure(entry: IEvent) {
        const key = this.dedupeKey(entry);
        this.dedupeKeys.set(key, (this.dedupeKeys.get(key) ?? 0) + 1);
    }

    private forgetExposure(entry: IEvent) {
        const key = this.dedupeKey(entry);
        const copies = (this.dedupeKeys.get(key) ?? 0) - 1;
        if (copies > 0) this.dedupeKeys.set(key, copies);
        else this.dedupeKeys.delete(key);
    }

    private flushIfFull() {
        if (this.buffer.length >= this.maxBuffer && !this.held && !this.sending) {
            this.flush();
        }
    }

    /**
     * Sends the buffered events, waiting for any batch already in flight and for retries.
     * Never rejects. A batch still failing after its retries is kept, ahead of newer events.
     */
    flush = async (): Promise<void> => {
        this.held = false;
        while (this.sending) {
            if (await this.sending) return;
        }
        if (!this.buffer.length || this.disabled) return;
        const events = this.buffer;
        this.buffer = [];
        this.dedupeKeys.clear();
        this.sending = this.send(events).then((kept) => {
            this.sending = null;
            if (!kept) this.flushIfFull();
            return kept;
        });
        await this.sending;
    };

    /**
     * Stops the processor for good once it has sent the buffered events, or once `timeoutMs`
     * has passed, whichever comes first. Events still unsent by then are dropped.
     */
    close = async (timeoutMs: number): Promise<void> => {
        this.stopTimer();
        let deadline: ReturnType<typeof setTimeout> | undefined;
        await Promise.race([
            this.drain(),
            new Promise<void>((resolve) => {
                deadline = setTimeout(resolve, timeoutMs);
            }),
        ]);
        if (deadline) clearTimeout(deadline);
        this.closed = true;
        this.abortRequest?.();
        if (this.buffer.length) {
            this.log(`Events: closed with ${this.buffer.length} events unsent, dropping them`);
            this.buffer = [];
        }
    };

    start() {
        // stop() clears any existing timer and flushes; the flush is a no-op
        // when the buffer is empty, which is the usual case on (re)start.
        this.stop();
        if (this.flushInterval > 0) {
            this.timer = setInterval(this.flush, this.flushInterval);
            this.timer?.unref?.();
        }
    }

    stop() {
        this.stopTimer();
        // Best-effort, fire-and-forget: this flush is not awaited, so on rapid
        // re-init buffered events may be lost. Callers needing a guarantee
        // (SSR/teardown) should await flushEvents() or close() instead.
        this.flush();
    }

    private stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    private dropOverflow() {
        const overflow = this.buffer.length - this.maxBuffer;
        if (overflow > 0) {
            for (const evicted of this.buffer.splice(0, overflow)) {
                if (evicted.event === FLAG_EXPOSURE_EVENT) this.forgetExposure(evicted);
            }
            this.log(`Events: buffer full, dropped the ${overflow} oldest events`);
        }
    }

    private drain = async (): Promise<void> => {
        await this.flush();
        while (this.buffer.length && !this.disabled && !this.closed) {
            await this.flush();
        }
    };

    // Resolves to whether the batch was kept for the next flush.
    private send = async (events: IEvent[]): Promise<boolean> => {
        let body: string;
        try {
            body = JSON.stringify({ events });
        } catch (err) {
            this.log(`Events: dropped ${events.length} events, which cannot be serialised to JSON`, err);
            return false;
        }
        let outcome: SendOutcome;
        for (let attempt = 1; ; attempt++) {
            outcome = await this.attempt(body);
            const retryable = outcome === 'transient' || outcome === 'server_error';
            if (!retryable || attempt >= MAX_ATTEMPTS || this.closed) break;
            // Full jitter: any wait up to the backoff, which doubles with every retry.
            await this.sleep(Math.random() * this.retryBackoffMs * 2 ** (attempt - 1));
            if (this.closed) break;
        }
        switch (outcome) {
            case 'delivered':
                this.log('Events: flush successful');
                return false;
            case 'unauthorised':
                this.disable(events.length);
                return false;
            case 'transient':
                if (!this.closed && !this.disabled) {
                    events.filter((e) => e.event === FLAG_EXPOSURE_EVENT).forEach((e) => this.rememberExposure(e));
                    this.buffer = events.concat(this.buffer);
                    this.dropOverflow();
                    this.held = this.timer !== null; // without a timer, only the size trigger sends it again
                    this.log(`Events: flush failed, kept ${events.length} events for the next flush`);
                    return true;
                }
        }
        this.log(`Events: flush failed, dropped ${events.length} events`);
        return false;
    };

    private attempt = async (body: string): Promise<SendOutcome> => {
        const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
        let timeout: ReturnType<typeof setTimeout> | undefined;
        const abandon = new Promise<never>((_, reject) => {
            const giveUp = (reason: string) => {
                controller?.abort();
                reject(new Error(`Events: ${reason}`));
            };
            this.abortRequest = () => giveUp('request abandoned on close');
            timeout = setTimeout(() => giveUp(`no response within ${this.requestTimeoutMs}ms`), this.requestTimeoutMs);
        });
        try {
            const res = await Promise.race([
                this.fetch(this.endpoint, {
                    method: 'POST',
                    body,
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        'X-Environment-Key': this.environmentKey,
                        ...(SDK_VERSION ? { 'Flagsmith-SDK-User-Agent': `flagsmith-js-sdk/${SDK_VERSION}` } : {}),
                    },
                    ...(controller ? { signal: controller.signal } : {}),
                }),
                abandon,
            ]);
            const status = res.status || 0;
            if (status >= 200 && status < 300) return 'delivered';
            this.log(`Events: unexpected status ${status}`);
            if (status === 401 || status === 403) return 'unauthorised';
            if (TRANSIENT_STATUSES.includes(status)) return 'transient';
            return status >= 500 ? 'server_error' : 'rejected';
        } catch (err) {
            this.log('Events: request failed', err);
            return 'transient';
        } finally {
            if (timeout) clearTimeout(timeout);
            this.abortRequest = null;
        }
    };

    private disable(inFlight: number) {
        this.log(`Events: environment key refused, dropping ${inFlight + this.buffer.length} events and stopping event tracking`);
        this.disabled = true;
        this.buffer = [];
        this.dedupeKeys.clear();
        this.stopTimer();
    }

    private sleep(ms: number) {
        return new Promise<void>((resolve) => {
            const t = setTimeout(resolve, ms);
            t?.unref?.();
        });
    }
}
