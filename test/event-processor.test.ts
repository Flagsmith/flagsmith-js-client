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

    test('retries once then drops; buffer stays untouched by a failing batch', async () => {
        const mockFetch = jest.fn(async () => ({ status: 500, text: async () => 'err' }));
        const processor = new EventProcessor({
            environmentKey: 'env_key_1',
            fetch: mockFetch as any,
            flushInterval: 60000,
            retryBackoffMs: 0,
        });
        processor.trackEvent({ event: 'a', identifier: null, value: null, traits: null, metadata: null });
        await processor.flush();

        // 1 initial + 1 retry = 2 attempts, then dropped
        expect(mockFetch).toHaveBeenCalledTimes(2);
        // buffer was drained on flush and a failed batch never re-enters it
        // @ts-ignore test access
        expect(processor.buffer).toHaveLength(0);

        // processor keeps working: a new event buffers and flushes normally
        const okFetch = jest.fn(async () => ({ status: 202, text: async () => '' }));
        // @ts-ignore swap fetch for the recovery assertion
        processor.fetch = okFetch;
        processor.trackEvent({ event: 'b', identifier: null, value: null, traits: null, metadata: null });
        await processor.flush();
        expect(okFetch).toHaveBeenCalledTimes(1);
    });
});
