import { getFlagsmith, environmentID, testIdentity } from './test-constants';
import { PipelineEventType } from '../lib/flagsmith';

const pipelineUrl = 'https://analytics.flagsmith.com/';

function getPipelineCalls(mockFetch: jest.Mock) {
    return mockFetch.mock.calls.filter(
        ([url]: [string]) => url.includes('v1/analytics/batch')
    );
}

describe('Pipeline Analytics', () => {
    test('should not send pipeline events when evaluationAnalyticsConfig is not set', async () => {
        const { flagsmith, initConfig, mockFetch } = getFlagsmith();
        await flagsmith.init(initConfig);

        flagsmith.getValue('hero');
        flagsmith.hasFeature('font_size');

        expect(getPipelineCalls(mockFetch)).toHaveLength(0);
        // @ts-ignore
        expect(flagsmith.pipelineEvents).toHaveLength(0);
    });

    test('should buffer events and flush with correct shape and headers', async () => {
        const { flagsmith, initConfig, mockFetch } = getFlagsmith({
            evaluationAnalyticsConfig: {
                analyticsServerUrl: pipelineUrl,
                flushInterval: 60000,
            },
        });
        await flagsmith.init(initConfig);

        flagsmith.getValue('font_size');
        flagsmith.hasFeature('hero');

        // @ts-ignore
        await flagsmith.flushPipelineAnalytics();

        const calls = getPipelineCalls(mockFetch);
        expect(calls).toHaveLength(1);

        const body = JSON.parse(calls[0][1].body);
        expect(body.environment_key).toBe(environmentID);
        expect(body.events).toHaveLength(2);

        const valueEvent = body.events[0];
        expect(valueEvent.event_id).toBe('font_size');
        expect(valueEvent.event_type).toBe('flag_evaluation');
        expect(valueEvent.value).toBe(16);
        expect(valueEvent.enabled).toBe(true);
        expect(valueEvent.identity_identifier).toBeNull();
        expect(valueEvent.evaluated_at).toBeDefined();
        expect(valueEvent.metadata).toEqual(expect.objectContaining({ id: 6149 }));

        const enabledEvent = body.events[1];
        expect(enabledEvent.event_id).toBe('hero');
        expect(enabledEvent.event_type).toBe('flag_evaluation');
        expect(enabledEvent.enabled).toBe(true);
        expect(enabledEvent.value).toBe(flagsmith.getValue('hero'));

        const headers = calls[0][1].headers;
        expect(headers['X-Environment-Key']).toBe(environmentID);
        expect(headers['Content-Type']).toBe('application/json; charset=utf-8');
        expect(headers['Flagsmith-SDK-User-Agent']).toMatch(/^flagsmith-js-sdk\//);
    });

    test('should include identity and full traits when identified', async () => {
        const { flagsmith, initConfig, mockFetch } = getFlagsmith({
            evaluationAnalyticsConfig: {
                analyticsServerUrl: pipelineUrl,
                flushInterval: 60000,
            },
            identity: testIdentity,
        });
        await flagsmith.init(initConfig);

        flagsmith.getValue('hero');

        // @ts-ignore
        await flagsmith.flushPipelineAnalytics();

        const calls = getPipelineCalls(mockFetch);
        const event = JSON.parse(calls[0][1].body).events[0];

        expect(event.identity_identifier).toBe(testIdentity);
        expect(event.traits).toEqual({
            number_trait: { value: 1 },
            string_trait: { value: 'Example' },
        });
    });

    test('should flush excess events when buffer exceeds maxBuffer and skip events when skipAnalytics is used', async () => {
        const { flagsmith, initConfig, mockFetch } = getFlagsmith({
            evaluationAnalyticsConfig: {
                analyticsServerUrl: pipelineUrl,
                maxBuffer: 3,
                flushInterval: 60000,
            },
        });
        await flagsmith.init(initConfig);

        flagsmith.getValue('hero', { skipAnalytics: true });
        flagsmith.hasFeature('font_size', { skipAnalytics: true });
        // @ts-ignore
        expect(flagsmith.pipelineEvents).toHaveLength(0);

        flagsmith.getValue('hero');
        flagsmith.getValue('font_size');
        flagsmith.getValue('json_value');
        flagsmith.getValue('number_value');
        flagsmith.getValue('off_value');

        const calls = mockFetch.mock.calls.filter(([url]: [string, any]) => url.includes('v1/analytics/batch'));
        expect(calls).toHaveLength(1);
        const flushedBatch = JSON.parse(calls[0][1].body).events;
        expect(flushedBatch).toHaveLength(3);
        expect(flushedBatch[0].event_id).toBe('hero');
        expect(flushedBatch[2].event_id).toBe('json_value');

        // @ts-ignore — remaining events kept for next flush
        expect(flagsmith.pipelineEvents).toHaveLength(2);
        // @ts-ignore
        expect(flagsmith.pipelineEvents[0].event_id).toBe('number_value');
    });

    test('should deduplicate repeated evaluations with same result per flush window', async () => {
        const { flagsmith, initConfig, mockFetch } = getFlagsmith({
            evaluationAnalyticsConfig: {
                analyticsServerUrl: pipelineUrl,
                flushInterval: 60000,
            },
            identity: testIdentity,
        });
        await flagsmith.init(initConfig);

        flagsmith.getValue('font_size');
        flagsmith.getValue('font_size');
        flagsmith.getValue('font_size');
        flagsmith.hasFeature('font_size');
        flagsmith.hasFeature('font_size');

        // @ts-ignore
        expect(flagsmith.pipelineEvents).toHaveLength(1);
        // @ts-ignore
        expect(flagsmith.pipelineEvents[0].event_id).toBe('font_size');

        // @ts-ignore
        await flagsmith.flushPipelineAnalytics();
        flagsmith.getValue('font_size');
        // @ts-ignore
        expect(flagsmith.pipelineEvents).toHaveLength(1);

        flagsmith.getValue('hero');
        // @ts-ignore
        expect(flagsmith.pipelineEvents).toHaveLength(2);
    });

    test('should record new event when evaluation result changes for same key', async () => {
        const { flagsmith, initConfig } = getFlagsmith({
            evaluationAnalyticsConfig: {
                analyticsServerUrl: pipelineUrl,
                flushInterval: 60000,
            },
        });
        await flagsmith.init(initConfig);

        flagsmith.getValue('font_size');
        // @ts-ignore
        expect(flagsmith.pipelineEvents).toHaveLength(1);

        flagsmith.getValue('font_size');
        // @ts-ignore
        expect(flagsmith.pipelineEvents).toHaveLength(1);

        await flagsmith.identify(testIdentity);
        flagsmith.getValue('font_size');
        // @ts-ignore
        expect(flagsmith.pipelineEvents).toHaveLength(2);
        // @ts-ignore
        expect(flagsmith.pipelineEvents[1].identity_identifier).toBe(testIdentity);
    });

    test('should re-queue on failure and coexist with standard analytics', async () => {
        const { flagsmith, initConfig, mockFetch } = getFlagsmith({
            enableAnalytics: true,
            evaluationAnalyticsConfig: {
                analyticsServerUrl: pipelineUrl,
                flushInterval: 60000,
            },
        });

        const original = mockFetch.getMockImplementation() as jest.Mock;
        mockFetch.mockImplementation(async (url: string, options: any) => {
            if (url.includes('v1/analytics/batch')) {
                return { status: 500, text: () => Promise.resolve('Server Error') };
            }
            return original(url, options);
        });

        await flagsmith.init(initConfig);

        flagsmith.getValue('hero');
        flagsmith.getValue('font_size');

        // @ts-ignore
        expect(flagsmith.evaluationEvent[environmentID]['hero']).toBe(1);
        // @ts-ignore
        expect(flagsmith.evaluationEvent[environmentID]['font_size']).toBe(1);

        // @ts-ignore
        expect(flagsmith.pipelineEvents).toHaveLength(2);

        // @ts-ignore
        await flagsmith.flushPipelineAnalytics();
        // @ts-ignore
        expect(flagsmith.pipelineEvents).toHaveLength(2);
        // @ts-ignore
        expect(flagsmith.pipelineEvents[0].event_id).toBe('hero');
    });
});

const defaultPipelineConfig = {
    evaluationAnalyticsConfig: {
        analyticsServerUrl: pipelineUrl,
        flushInterval: 60000,
    },
};

function getCustomEvents(flagsmith: any) {
    return flagsmith.pipelineEvents.filter((e: any) => e.event_type === PipelineEventType.CUSTOM_EVENT);
}

describe('trackEvent (custom events)', () => {
    test('sends custom_event with correct shape', async () => {
        const { flagsmith, initConfig, mockFetch } = getFlagsmith({
            ...defaultPipelineConfig,
            identity: testIdentity,
        });
        await flagsmith.init(initConfig);

        flagsmith.trackEvent('checkout', { item: 'shoes', price: 99 });
        // @ts-ignore
        await flagsmith.flushPipelineAnalytics();

        const calls = getPipelineCalls(mockFetch);
        expect(calls).toHaveLength(1);

        const event = JSON.parse(calls[0][1].body).events[0];
        expect(event).toEqual(expect.objectContaining({
            event_id: 'checkout',
            event_type: PipelineEventType.CUSTOM_EVENT,
            enabled: null,
            value: null,
            identity_identifier: testIdentity,
        }));
        expect(event.evaluated_at).toEqual(expect.any(Number));
        expect(event.metadata).toEqual(expect.objectContaining({ item: 'shoes', price: 99 }));
        expect(event.metadata.sdk_version).toBeDefined();
    });

    test('no-ops when evaluationAnalyticsConfig is not set', async () => {
        const { flagsmith, initConfig } = getFlagsmith();
        await flagsmith.init(initConfig);

        flagsmith.trackEvent('checkout');

        // @ts-ignore
        expect(flagsmith.pipelineEvents).toHaveLength(0);
    });

    test('no-ops when eventName is empty', async () => {
        const { flagsmith, initConfig } = getFlagsmith({
            ...defaultPipelineConfig,
            identity: testIdentity,
        });
        await flagsmith.init(initConfig);

        flagsmith.trackEvent('');

        // @ts-ignore
        expect(flagsmith.pipelineEvents).toHaveLength(0);
    });

    test('tracks events with null identity when not identified', async () => {
        const { flagsmith, initConfig, mockFetch } = getFlagsmith(defaultPipelineConfig);
        await flagsmith.init(initConfig);

        flagsmith.trackEvent('page_view', { page: '/home' });
        flagsmith.trackEvent('signup');

        const custom = getCustomEvents(flagsmith);
        expect(custom).toHaveLength(2);
        expect(custom[0].event_id).toBe('page_view');
        expect(custom[0].identity_identifier).toBeNull();
        expect(custom[0].metadata).toEqual(expect.objectContaining({ page: '/home' }));
        expect(custom[1].event_id).toBe('signup');
        expect(custom[1].identity_identifier).toBeNull();

        // @ts-ignore
        await flagsmith.flushPipelineAnalytics();
        const calls = getPipelineCalls(mockFetch);
        expect(calls).toHaveLength(1);
    });

    test('tracks events with identity after identify', async () => {
        const { flagsmith, initConfig } = getFlagsmith(defaultPipelineConfig);
        await flagsmith.init(initConfig);

        flagsmith.trackEvent('anonymous_action');
        await flagsmith.identify(testIdentity);
        flagsmith.trackEvent('identified_action');

        const custom = getCustomEvents(flagsmith);
        expect(custom).toHaveLength(2);
        expect(custom[0].identity_identifier).toBeNull();
        expect(custom[1].identity_identifier).toBe(testIdentity);
    });

    test('flushes immediately when flushInterval is 0', async () => {
        const { flagsmith, initConfig, mockFetch } = getFlagsmith({
            evaluationAnalyticsConfig: {
                analyticsServerUrl: pipelineUrl,
                flushInterval: 0,
            },
            identity: testIdentity,
        });
        await flagsmith.init(initConfig);

        flagsmith.trackEvent('instant_event');

        const calls = getPipelineCalls(mockFetch);
        expect(calls.length).toBeGreaterThanOrEqual(1);

        const allEvents = calls.flatMap(
            ([, opts]: [string, any]) => JSON.parse(opts.body).events
        );
        const custom = allEvents.filter((e: any) => e.event_type === PipelineEventType.CUSTOM_EVENT);
        expect(custom).toHaveLength(1);
        expect(custom[0].event_id).toBe('instant_event');
    });

    test('does not deduplicate - each call produces a distinct event', async () => {
        const { flagsmith, initConfig } = getFlagsmith({
            ...defaultPipelineConfig,
            identity: testIdentity,
        });
        await flagsmith.init(initConfig);

        flagsmith.trackEvent('click');
        flagsmith.trackEvent('click');
        flagsmith.trackEvent('click');

        expect(getCustomEvents(flagsmith)).toHaveLength(3);
    });

    test('tracks with null identity after logout', async () => {
        const { flagsmith, initConfig } = getFlagsmith(defaultPipelineConfig);
        await flagsmith.init(initConfig);

        await flagsmith.identify(testIdentity);
        flagsmith.trackEvent('while_identified');
        expect(getCustomEvents(flagsmith)[0].identity_identifier).toBe(testIdentity);

        await flagsmith.logout();

        flagsmith.trackEvent('after_logout');
        const custom = getCustomEvents(flagsmith);
        expect(custom[custom.length - 1].identity_identifier).toBeNull();
    });
});
