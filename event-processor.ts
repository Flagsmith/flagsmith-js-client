import { SDK_VERSION } from './utils/version';
import { ensureTrailingSlash } from './utils/ensureTrailingSlash';
import { LikeFetch } from './flagsmith-core';
import { IFlagsmithValue } from './types';

export const FLAG_EXPOSURE_EVENT = '$flag_exposure';
export const DEFAULT_EVENTS_API_URL = 'https://events.api.flagsmith.com/';
const DEFAULT_MAX_BUFFER = 1000;
const DEFAULT_FLUSH_INTERVAL = 10000;
const DEFAULT_RETRY_BACKOFF_MS = 1000;

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

export class EventProcessor {
    private endpoint: string;
    private environmentKey: string;
    private fetch: LikeFetch;
    private log: (...args: any[]) => void;
    private maxBuffer: number;
    private flushInterval: number;
    private retryBackoffMs: number;
    private buffer: IEvent[] = [];
    private dedupeKeys: Set<string> = new Set();
    private timer: ReturnType<typeof setInterval> | null = null;

    constructor(opts: EventProcessorOptions) {
        const url = ensureTrailingSlash(opts.eventsApiUrl || DEFAULT_EVENTS_API_URL);
        this.endpoint = `${url}v1/events`;
        this.environmentKey = opts.environmentKey;
        this.fetch = opts.fetch;
        this.log = opts.log || (() => {});
        this.maxBuffer = opts.maxBuffer ?? DEFAULT_MAX_BUFFER;
        this.flushInterval = opts.flushInterval ?? DEFAULT_FLUSH_INTERVAL;
        this.retryBackoffMs = opts.retryBackoffMs ?? DEFAULT_RETRY_BACKOFF_MS;
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
        const stringValue = value != null ? String(value) : null;
        if (dedupe) {
            const key = JSON.stringify([event, feature_name, identifier, stringValue]);
            if (this.dedupeKeys.has(key)) return;
            this.dedupeKeys.add(key);
        }
        this.buffer.push({
            event,
            feature_name,
            identifier,
            value: stringValue,
            traits,
            metadata: { ...(metadata || {}), sdk_version: SDK_VERSION },
            timestamp: Date.now(),
        });
        if (this.buffer.length >= this.maxBuffer) {
            this.flush();
        }
    }

    flush = async (): Promise<void> => {
        if (!this.buffer.length) return;
        const events = this.buffer;
        this.buffer = [];
        this.dedupeKeys.clear();
        await this.postBatch(events, 0);
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
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        // Best-effort, fire-and-forget: this flush is not awaited, so on rapid
        // re-init buffered events may be lost. Callers needing a guarantee
        // (SSR/teardown) should await flushEvents() instead.
        this.flush();
    }

    private postBatch = async (events: IEvent[], attempt: number): Promise<void> => {
        try {
            const res = await this.fetch(this.endpoint, {
                method: 'POST',
                body: JSON.stringify({ events }),
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'X-Environment-Key': this.environmentKey,
                    ...(SDK_VERSION ? { 'Flagsmith-SDK-User-Agent': `flagsmith-js-sdk/${SDK_VERSION}` } : {}),
                },
            });
            if (!res.status || res.status < 200 || res.status >= 300) {
                throw new Error(`Events: unexpected status ${res.status}`);
            }
            this.log('Events: flush successful');
        } catch (err) {
            if (attempt < 1) {
                this.log('Events: flush failed, retrying', err);
                await new Promise<void>((resolve) => {
                    const t = setTimeout(resolve, this.retryBackoffMs);
                    t?.unref?.();
                });
                return this.postBatch(events, attempt + 1);
            }
            this.log('Events: flush failed, dropping batch', err);
        }
    };
}
