import { EventProcessor, FLAG_EXPOSURE_EVENT } from '../event-processor';
import { SDK_VERSION } from '../utils/version';

function makeProcessor(overrides: any = {}) {
    const mockFetch = jest.fn(async () => ({ status: 202, text: async () => '' }));
    const processor = new EventProcessor({
        environmentKey: 'env_key_1',
        fetch: mockFetch as any,
        flushInterval: 60000,
        ...overrides,
    });
    return { processor, mockFetch };
}

describe('EventProcessor dedupe', () => {
    test('collapses identical exposures within a window', () => {
        const { processor } = makeProcessor();
        const args = { featureName: 'dark_mode', identifier: 'u1', value: 'control', traits: null, metadata: null };
        processor.trackExposureEvent(args);
        processor.trackExposureEvent(args);
        processor.trackExposureEvent(args);
        // @ts-ignore test access
        expect(processor.buffer).toHaveLength(1);
    });

    test('keeps exposures with distinct value', () => {
        const { processor } = makeProcessor();
        processor.trackExposureEvent({ featureName: 'dark_mode', identifier: 'u1', value: 'control', traits: null, metadata: null });
        processor.trackExposureEvent({ featureName: 'dark_mode', identifier: 'u1', value: 'variant', traits: null, metadata: null });
        // @ts-ignore test access
        expect(processor.buffer).toHaveLength(2);
    });

    test('keeps exposures with distinct experiment_id', () => {
        const { processor } = makeProcessor();
        processor.trackExposureEvent({ featureName: 'dark_mode', identifier: 'u1', value: 'control', traits: null, metadata: { experiment_id: 42 } });
        processor.trackExposureEvent({ featureName: 'dark_mode', identifier: 'u1', value: 'control', traits: null, metadata: { experiment_id: 43 } });
        processor.trackExposureEvent({ featureName: 'dark_mode', identifier: 'u1', value: 'control', traits: null, metadata: { experiment_id: 43 } });
        // @ts-ignore test access
        expect(processor.buffer).toHaveLength(2);
    });

    test('never dedupes custom events', () => {
        const { processor } = makeProcessor();
        const args = { event: 'purchase', identifier: 'u1', value: 99, traits: null, metadata: null };
        processor.trackEvent(args);
        processor.trackEvent(args);
        // @ts-ignore test access
        expect(processor.buffer).toHaveLength(2);
    });
});

describe('EventProcessor buffering', () => {
    test('trackEvent buffers a custom event in wire shape', () => {
        const { processor } = makeProcessor();
        processor.trackEvent({
            event: 'purchase',
            identifier: 'user_42',
            value: 99.5,
            traits: { plan: 'premium' },
            metadata: { source: 'web' },
        });
        // @ts-ignore test access
        const buf = processor.buffer;
        expect(buf).toHaveLength(1);
        expect(buf[0]).toEqual(expect.objectContaining({
            event: 'purchase',
            feature_name: null,
            identifier: 'user_42',
            value: '99.5',
            traits: { plan: 'premium' },
        }));
        expect(buf[0].metadata).toEqual(expect.objectContaining({ source: 'web', sdk_version: SDK_VERSION }));
        expect(buf[0].timestamp).toEqual(expect.any(Number));
    });

    test('trackExposureEvent buffers a $flag_exposure with feature_name', () => {
        const { processor } = makeProcessor();
        processor.trackExposureEvent({
            featureName: 'dark_mode',
            identifier: 'user_42',
            value: 'control',
            traits: null,
            metadata: null,
        });
        // @ts-ignore test access
        const buf = processor.buffer;
        expect(buf[0]).toEqual(expect.objectContaining({
            event: FLAG_EXPOSURE_EVENT,
            feature_name: 'dark_mode',
            value: 'control',
            traits: null,
        }));
        expect(buf[0].metadata).toEqual(expect.objectContaining({ sdk_version: SDK_VERSION }));
    });
});

describe('EventProcessor flush', () => {
    test('drains buffer and POSTs to /v1/events with headers', async () => {
        const { processor, mockFetch } = makeProcessor({ eventsApiUrl: 'https://events.test/' });
        processor.trackEvent({ event: 'purchase', identifier: 'u1', value: 1, traits: null, metadata: null });
        await processor.flush();

        expect(mockFetch).toHaveBeenCalledTimes(1);
        const call = mockFetch.mock.calls[0] as unknown as [string, any];
        const [url, opts] = call;
        expect(url).toBe('https://events.test/v1/events');
        expect(opts.method).toBe('POST');
        expect(opts.headers['X-Environment-Key']).toBe('env_key_1');
        expect(opts.headers['Content-Type']).toBe('application/json; charset=utf-8');
        expect(opts.headers['Flagsmith-SDK-User-Agent']).toMatch(/^flagsmith-js-sdk\//);
        const body = JSON.parse(opts.body);
        expect(body).toEqual({ events: expect.any(Array) });
        expect(body.events).toHaveLength(1);

        // @ts-ignore test access — buffer emptied
        expect(processor.buffer).toHaveLength(0);
    });

    test('flush on empty buffer is a no-op', async () => {
        const { processor, mockFetch } = makeProcessor();
        await processor.flush();
        expect(mockFetch).not.toHaveBeenCalled();
    });

    test('flush clears the dedupe window', async () => {
        const { processor } = makeProcessor();
        const args = { featureName: 'f', identifier: 'u1', value: 'a', traits: null, metadata: null };
        processor.trackExposureEvent(args);
        await processor.flush();
        processor.trackExposureEvent(args); // same key, but window was cleared
        // @ts-ignore test access
        expect(processor.buffer).toHaveLength(1);
    });

    test('auto-flushes when buffer reaches maxBuffer', () => {
        const { processor, mockFetch } = makeProcessor({ maxBuffer: 2 });
        processor.trackEvent({ event: 'a', identifier: null, value: null, traits: null, metadata: null });
        expect(mockFetch).not.toHaveBeenCalled();
        processor.trackEvent({ event: 'b', identifier: null, value: null, traits: null, metadata: null });
        expect(mockFetch).toHaveBeenCalledTimes(1);
    });
});

describe('EventProcessor lifecycle and retry', () => {
    test('start arms a timer that flushes; stop clears it', () => {
        jest.useFakeTimers();
        try {
            const { processor, mockFetch } = makeProcessor({ flushInterval: 5000 });
            processor.start();
            processor.trackEvent({ event: 'a', identifier: null, value: null, traits: null, metadata: null });
            expect(mockFetch).not.toHaveBeenCalled();
            jest.advanceTimersByTime(5000);
            expect(mockFetch).toHaveBeenCalledTimes(1);
            processor.stop();
            processor.trackEvent({ event: 'b', identifier: null, value: null, traits: null, metadata: null });
            jest.advanceTimersByTime(5000);
            expect(mockFetch).toHaveBeenCalledTimes(1); // no further flush after stop
        } finally {
            jest.useRealTimers();
        }
    });

    test('stop flushes any buffered events', async () => {
        const { processor, mockFetch } = makeProcessor({ flushInterval: 60000 });
        processor.start();
        processor.trackEvent({ event: 'a', identifier: null, value: null, traits: null, metadata: null });
        expect(mockFetch).not.toHaveBeenCalled();
        processor.stop();
        await Promise.resolve();
        expect(mockFetch).toHaveBeenCalledTimes(1);
    });
});

function respondWith(...responses: (number | Error)[]) {
    return jest.fn(async () => {
        const response = responses.shift() ?? 202;
        if (response instanceof Error) throw response;
        return { status: response, text: async () => '' };
    });
}

function sentEvents(mockFetch: jest.Mock) {
    return mockFetch.mock.calls.map((call) => JSON.parse(call[1].body).events.map((e: any) => e.event));
}

function track(processor: EventProcessor, event: string) {
    processor.trackEvent({ event, identifier: 'user_123', value: null, traits: null, metadata: null });
}

describe('EventProcessor delivery', () => {
    test('a batch is retried until the events API accepts it', async () => {
        // Given
        const mockFetch = respondWith(503, new Error('ECONNRESET'), 202);
        const { processor } = makeProcessor({ fetch: mockFetch, retryBackoffMs: 0 });
        track(processor, 'checkout');

        // When
        await processor.flush();

        // Then
        expect(sentEvents(mockFetch)).toEqual([['checkout'], ['checkout'], ['checkout']]);
        // @ts-ignore test access
        expect(processor.buffer).toHaveLength(0);
    });

    test('retries back off with full jitter, doubling from the initial backoff', async () => {
        // Given
        const mockFetch = respondWith(503, 503, 202);
        const { processor } = makeProcessor({ fetch: mockFetch, retryBackoffMs: 10 });
        const random = jest.spyOn(Math, 'random').mockReturnValue(0.5);
        const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
        track(processor, 'checkout');

        // When
        await processor.flush();

        // Then
        const waits = setTimeoutSpy.mock.calls.map(([, ms]) => ms).filter((ms) => ms !== 3000);
        expect(waits).toEqual([5, 10]);
        random.mockRestore();
        setTimeoutSpy.mockRestore();
    });

    test('a request the events API does not answer is given up on and retried', async () => {
        // Given
        const signals: AbortSignal[] = [];
        const mockFetch = jest.fn((_url: string, init: any) => {
            signals.push(init.signal);
            if (signals.length > 1) return Promise.resolve({ status: 202 });
            return new Promise(() => undefined);
        });
        const { processor } = makeProcessor({ fetch: mockFetch, retryBackoffMs: 0, requestTimeoutMs: 20 });
        track(processor, 'checkout');

        // When
        await processor.flush();

        // Then
        expect(mockFetch).toHaveBeenCalledTimes(2);
        expect(signals[0].aborted).toBe(true);
        // @ts-ignore test access
        expect(processor.buffer).toHaveLength(0);
    });

    test('a batch that keeps failing is sent with the next flush, ahead of events tracked since', async () => {
        // Given
        const mockFetch = respondWith(503, 503, 503);
        const { processor } = makeProcessor({ fetch: mockFetch, retryBackoffMs: 0 });
        track(processor, 'add_to_cart');
        await processor.flush();
        track(processor, 'checkout');

        // When
        await processor.flush();

        // Then
        expect(sentEvents(mockFetch)).toEqual([
            ['add_to_cart'],
            ['add_to_cart'],
            ['add_to_cart'],
            ['add_to_cart', 'checkout'],
        ]);
    });

    test('a full buffer drops its oldest event', async () => {
        // Given
        const mockFetch = respondWith(503, 503, 503);
        const { processor } = makeProcessor({ fetch: mockFetch, retryBackoffMs: 0, maxBuffer: 2 });
        processor.start();
        track(processor, 'event_1');
        await processor.flush();
        track(processor, 'event_2');
        track(processor, 'event_3');

        // When
        await processor.flush();

        // Then
        expect(sentEvents(mockFetch)).toEqual([['event_1'], ['event_1'], ['event_1'], ['event_2', 'event_3']]);
        processor.stop();
    });

    test('a buffer of size 0 sends each event as soon as it is tracked', async () => {
        // Given
        const mockFetch = respondWith();
        const { processor } = makeProcessor({ fetch: mockFetch, maxBuffer: 0 });

        // When
        track(processor, 'checkout');
        await processor.flush();

        // Then
        expect(sentEvents(mockFetch)).toEqual([['checkout']]);
    });

    test('without a flush interval, a full buffer sends a batch kept during an outage', async () => {
        // Given
        const mockFetch = respondWith(503, 503, 503);
        const { processor } = makeProcessor({ fetch: mockFetch, retryBackoffMs: 0, maxBuffer: 2, flushInterval: 0 });
        processor.start();
        track(processor, 'event_1');
        track(processor, 'event_2');
        await processor.flush();

        // When
        track(processor, 'event_3');
        await new Promise((resolve) => setTimeout(resolve, 10));

        // Then
        expect(sentEvents(mockFetch)).toEqual([
            ['event_1', 'event_2'],
            ['event_1', 'event_2'],
            ['event_1', 'event_2'],
            ['event_2', 'event_3'],
        ]);
    });

    test('a buffer filled while a batch is in flight is sent once that batch is delivered', async () => {
        // Given
        let answer: () => void = () => undefined;
        const mockFetch = jest.fn()
            .mockImplementationOnce(() => new Promise((resolve) => { answer = () => resolve({ status: 202 }); }))
            .mockResolvedValue({ status: 202 });
        const { processor } = makeProcessor({ fetch: mockFetch, maxBuffer: 2 });
        track(processor, 'event_1');
        track(processor, 'event_2');
        track(processor, 'event_3');
        track(processor, 'event_4');

        // When
        answer();
        await new Promise((resolve) => setTimeout(resolve, 10));

        // Then
        expect(sentEvents(mockFetch)).toEqual([['event_1', 'event_2'], ['event_3', 'event_4']]);
    });

    test('an exposure evicted from a full buffer can be tracked again', async () => {
        // Given
        const { processor } = makeProcessor({ fetch: respondWith(503, 503, 503), retryBackoffMs: 0, maxBuffer: 2 });
        processor.start();
        const exposure = { featureName: 'banner', identifier: 'user_123', value: 'treatment', traits: null, metadata: null };
        track(processor, 'add_to_cart');
        await processor.flush();
        processor.trackExposureEvent(exposure);
        track(processor, 'checkout');
        track(processor, 'refund');

        // When
        processor.trackExposureEvent(exposure);

        // Then
        // @ts-ignore test access
        expect(processor.buffer.map((e) => e.event)).toEqual(['refund', FLAG_EXPOSURE_EVENT]);
        processor.stop();
    });

    test('an exposure tracked again while its first copy is in flight stays deduplicated after that copy is evicted', async () => {
        // Given
        const { processor } = makeProcessor({ fetch: respondWith(503, 503, 503), retryBackoffMs: 0, maxBuffer: 2 });
        processor.start();
        const exposure = { featureName: 'banner', identifier: 'user_123', value: 'treatment', traits: null, metadata: null };
        processor.trackExposureEvent(exposure);
        const failing = processor.flush();
        processor.trackExposureEvent(exposure);
        await failing;
        track(processor, 'checkout');

        // When
        processor.trackExposureEvent(exposure);

        // Then
        // @ts-ignore test access
        expect(processor.buffer.map((e) => e.event)).toEqual([FLAG_EXPOSURE_EVENT, 'checkout']);
        processor.stop();
    });

    test('an event that cannot be serialised is dropped when tracked', async () => {
        // Given
        const mockFetch = respondWith();
        const { processor } = makeProcessor({ fetch: mockFetch });
        const circular: Record<string, unknown> = {};
        circular.self = circular;

        // When
        processor.trackEvent({ event: 'bad', identifier: 'user_123', value: null, traits: null, metadata: circular });
        track(processor, 'checkout');
        await processor.flush();

        // Then
        expect(sentEvents(mockFetch)).toEqual([['checkout']]);
    });

    test('a batch that cannot be serialised is dropped without failing flush or close', async () => {
        // Given
        const mockFetch = respondWith();
        const { processor } = makeProcessor({ fetch: mockFetch });
        const metadata: Record<string, unknown> = {};
        processor.trackEvent({ event: 'bad', identifier: 'user_123', value: null, traits: null, metadata: { nested: metadata } });
        metadata.self = metadata;

        // When
        const flushed = processor.flush();
        track(processor, 'checkout');
        const closed = processor.close(1000);

        // Then
        await expect(flushed).resolves.toBeUndefined();
        await expect(closed).resolves.toBeUndefined();
        expect(sentEvents(mockFetch)).toEqual([['checkout']]);
    });

    test('a batch the events API rejects is dropped without retrying', async () => {
        // Given
        const mockFetch = respondWith(400);
        const { processor } = makeProcessor({ fetch: mockFetch, retryBackoffMs: 0 });
        track(processor, 'add_to_cart');
        await processor.flush();
        track(processor, 'checkout');

        // When
        await processor.flush();

        // Then
        expect(sentEvents(mockFetch)).toEqual([['add_to_cart'], ['checkout']]);
    });

    test('a batch whose last attempt gets a server error is dropped', async () => {
        // Given
        const mockFetch = respondWith(503, 503, 500);
        const { processor } = makeProcessor({ fetch: mockFetch, retryBackoffMs: 0 });
        track(processor, 'add_to_cart');
        await processor.flush();
        track(processor, 'checkout');

        // When
        await processor.flush();

        // Then
        expect(sentEvents(mockFetch)).toEqual([['add_to_cart'], ['add_to_cart'], ['add_to_cart'], ['checkout']]);
    });

    test('a batch whose last attempt fails otherwise is kept, after server errors', async () => {
        // Given
        const mockFetch = respondWith(500, 500, 503);
        const { processor } = makeProcessor({ fetch: mockFetch, retryBackoffMs: 0 });
        track(processor, 'add_to_cart');
        await processor.flush();
        track(processor, 'checkout');

        // When
        await processor.flush();

        // Then
        expect(sentEvents(mockFetch)).toEqual([
            ['add_to_cart'],
            ['add_to_cart'],
            ['add_to_cart'],
            ['add_to_cart', 'checkout'],
        ]);
    });

    test.each([401, 403])('an events API refusing the environment key with %i stops event tracking', async (status) => {
        // Given
        const mockFetch = respondWith(status);
        const { processor } = makeProcessor({ fetch: mockFetch, retryBackoffMs: 0 });
        track(processor, 'add_to_cart');
        await processor.flush();
        track(processor, 'checkout');

        // When
        await processor.flush();

        // Then
        expect(sentEvents(mockFetch)).toEqual([['add_to_cart']]);
        // @ts-ignore test access
        expect(processor.buffer).toHaveLength(0);
    });

    test('a flush waits for the batch in flight, sending one batch at a time', async () => {
        // Given
        let inFlight = 0;
        let mostInFlight = 0;
        const mockFetch = jest.fn(async () => {
            mostInFlight = Math.max(mostInFlight, ++inFlight);
            await new Promise((resolve) => setTimeout(resolve, 10));
            inFlight--;
            return { status: 202 };
        });
        const { processor } = makeProcessor({ fetch: mockFetch });
        track(processor, 'add_to_cart');
        const first = processor.flush();
        track(processor, 'checkout');

        // When
        await Promise.all([first, processor.flush()]);

        // Then
        expect(sentEvents(mockFetch)).toEqual([['add_to_cart'], ['checkout']]);
        expect(mostInFlight).toBe(1);
    });
});

describe('EventProcessor close', () => {
    test('closing sends the buffered events, retries included', async () => {
        // Given
        const mockFetch = respondWith(503);
        const { processor } = makeProcessor({ fetch: mockFetch, retryBackoffMs: 0 });
        track(processor, 'checkout');

        // When
        await processor.close(5000);

        // Then
        expect(sentEvents(mockFetch)).toEqual([['checkout'], ['checkout']]);
    });

    test('closing returns within its timeout when the events API does not answer', async () => {
        // Given
        const signals: AbortSignal[] = [];
        const mockFetch = jest.fn((_url: string, init: any) => {
            signals.push(init.signal);
            return new Promise(() => undefined);
        });
        const { processor } = makeProcessor({ fetch: mockFetch, requestTimeoutMs: 60000 });
        track(processor, 'checkout');
        const started = Date.now();

        // When
        await processor.close(50);

        // Then
        expect(Date.now() - started).toBeLessThan(1000);
        expect(signals[0].aborted).toBe(true);
        // @ts-ignore test access
        expect(processor.buffer).toHaveLength(0);
    });

    test('a closed processor tracks no more events', async () => {
        // Given
        const { processor, mockFetch } = makeProcessor();
        await processor.close(1000);

        // When
        track(processor, 'checkout');
        await processor.flush();

        // Then
        expect(mockFetch).not.toHaveBeenCalled();
    });
});
