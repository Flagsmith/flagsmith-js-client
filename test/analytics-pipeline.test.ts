import { getFlagsmith, delay, environmentID, testIdentity } from './test-constants';
import { promises as fs } from 'fs';

const pipelineUrl = 'http://localhost:8080/';

function mockFetchWithPipeline(mockFetch: jest.Mock) {
    mockFetch.mockImplementation(async (url: string) => {
        if (url.includes('v1/analytics/batch')) {
            return { status: 202, text: () => Promise.resolve('') };
        }
        if (url.includes('analytics/flags')) {
            return { status: 200, text: () => Promise.resolve('{}') };
        }
        if (url.includes('identities')) {
            return { status: 200, text: () => fs.readFile(`./test/data/identities_${testIdentity}.json`, 'utf8') };
        }
        if (url.includes('flags')) {
            return { status: 200, text: () => fs.readFile('./test/data/flags.json', 'utf8') };
        }
        throw new Error('Unmocked URL: ' + url);
    });
}

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
                flushInterval: 100,
            },
        });
        mockFetchWithPipeline(mockFetch);
        await flagsmith.init(initConfig);

        flagsmith.getValue('font_size');
        flagsmith.hasFeature('hero');

        await delay(150);

        const calls = getPipelineCalls(mockFetch);
        expect(calls).toHaveLength(1);

        const body = JSON.parse(calls[0][1].body);
        expect(body.sdk_version).toBe('11.0.0');
        expect(body.environment_key).toBe(environmentID);
        expect(body.events).toHaveLength(2);

        const valueEvent = body.events[0];
        expect(valueEvent.type).toBe('VALUE');
        expect(valueEvent.flag_key).toBe('font_size');
        expect(valueEvent.value).toBe(16);
        expect(valueEvent.identity_id).toBeNull();
        expect(valueEvent.timestamp).toBeGreaterThan(0);
        expect(valueEvent.custom).toEqual({ id: 6149, enabled: true, value: 16 });

        const enabledEvent = body.events[1];
        expect(enabledEvent.type).toBe('ENABLED');
        expect(enabledEvent.flag_key).toBe('hero');
        expect(enabledEvent.value).toBe(true);

        const headers = calls[0][1].headers;
        expect(headers['X-Environment-Key']).toBe(environmentID);
        expect(headers['Content-Type']).toBe('application/json; charset=utf-8');
        expect(headers['Flagsmith-SDK-User-Agent']).toMatch(/^flagsmith-js-sdk\//);
    });

    test('should include identity and full traits when identified', async () => {
        const { flagsmith, initConfig, mockFetch } = getFlagsmith({
            evaluationAnalyticsConfig: {
                analyticsServerUrl: pipelineUrl,
                flushInterval: 100,
            },
            identity: testIdentity,
        });
        mockFetchWithPipeline(mockFetch);
        await flagsmith.init(initConfig);

        flagsmith.getValue('hero');

        await delay(150);

        const calls = getPipelineCalls(mockFetch);
        const event = JSON.parse(calls[0][1].body).events[0];

        expect(event.identity_id).toBe(testIdentity);
        expect(event.traits).toEqual({
            number_trait: { value: 1 },
            string_trait: { value: 'Example' },
        });
    });

    test('should cap buffer at maxBuffer and skip events when skipAnalytics is used', async () => {
        const { flagsmith, initConfig, mockFetch } = getFlagsmith({
            evaluationAnalyticsConfig: {
                analyticsServerUrl: pipelineUrl,
                maxBuffer: 3,
                flushInterval: 60000,
            },
        });
        mockFetchWithPipeline(mockFetch);
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

        // @ts-ignore
        expect(flagsmith.pipelineEvents).toHaveLength(3);
        // @ts-ignore
        expect(flagsmith.pipelineEvents[0].flag_key).toBe('json_value');
        // @ts-ignore
        expect(flagsmith.pipelineEvents[2].flag_key).toBe('off_value');
    });

    test('should re-queue on failure and coexist with standard analytics', async () => {
        const { flagsmith, initConfig, mockFetch } = getFlagsmith({
            enableAnalytics: true,
            evaluationAnalyticsConfig: {
                analyticsServerUrl: pipelineUrl,
                flushInterval: 60000,
            },
        });

        mockFetch.mockImplementation(async (url: string) => {
            if (url.includes('v1/analytics/batch')) {
                return { status: 500, text: () => Promise.resolve('Server Error') };
            }
            if (url.includes('analytics/flags')) {
                return { status: 200, text: () => Promise.resolve('{}') };
            }
            if (url.includes('flags')) {
                return { status: 200, text: () => fs.readFile('./test/data/flags.json', 'utf8') };
            }
            throw new Error('Unmocked URL: ' + url);
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
        expect(flagsmith.pipelineEvents[0].flag_key).toBe('hero');
    });
});
