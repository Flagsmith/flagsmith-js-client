import { getFlagsmith, environmentID, testIdentity } from './test-constants';
import { FLAG_EXPOSURE_EVENT } from '../event-processor';

const eventsUrl = 'https://events.test/';

function eventsConfig(extra: any = {}) {
    return {
        enableEvents: true,
        eventProcessorConfig: { eventsApiUrl: eventsUrl, flushInterval: 60000 },
        ...extra,
    };
}

function eventCalls(mockFetch: jest.Mock) {
    return mockFetch.mock.calls.filter(([url]: [string]) => url.includes('/v1/events'));
}

describe('events gate', () => {
    test('trackEvent throws when events are not enabled', async () => {
        const { flagsmith, initConfig } = getFlagsmith();
        await flagsmith.init(initConfig);
        expect(() => flagsmith.trackEvent('purchase')).toThrow(/events must be enabled/i);
    });

    test('trackExposureEvent and getExperimentFlag throw when not enabled', async () => {
        const { flagsmith, initConfig } = getFlagsmith();
        await flagsmith.init(initConfig);
        expect(() => flagsmith.trackExposureEvent('f')).toThrow(/events must be enabled/i);
        expect(() => flagsmith.getExperimentFlag('f')).toThrow(/events must be enabled/i);
    });

    test('eventProcessorConfig without enableEvents throws at init', async () => {
        const { flagsmith, initConfig } = getFlagsmith({
            eventProcessorConfig: { eventsApiUrl: eventsUrl },
        });
        await expect(flagsmith.init(initConfig)).rejects.toThrow(/requires enableEvents/i);
    });

    test('trackEvent rejects reserved $-prefixed event names', async () => {
        const { flagsmith, initConfig } = getFlagsmith({
            enableEvents: true,
            eventProcessorConfig: { eventsApiUrl: 'https://events.test/', flushInterval: 60000 },
        });
        await flagsmith.init(initConfig);
        expect(() => flagsmith.trackEvent('$custom')).toThrow(/reserved/i);
    });
});

describe('trackEvent', () => {
    test('sends a custom event with correct wire shape and headers', async () => {
        const { flagsmith, initConfig, mockFetch } = getFlagsmith(eventsConfig({ identity: testIdentity }));
        await flagsmith.init(initConfig);

        flagsmith.trackEvent('purchase', { value: 99.5, metadata: { source: 'web' } });
        await flagsmith.flushEvents();

        const calls = eventCalls(mockFetch);
        expect(calls).toHaveLength(1);
        const [url, opts] = calls[0];
        expect(url).toBe('https://events.test/v1/events');
        expect(opts.headers['X-Environment-Key']).toBe(environmentID);
        const event = JSON.parse(opts.body).events[0];
        expect(event).toEqual(expect.objectContaining({
            event: 'purchase',
            feature_name: null,
            identifier: testIdentity,
            value: '99.5',
        }));
        expect(event.metadata).toEqual(expect.objectContaining({ source: 'web' }));
    });

    test('defaults identifier and traits to the current context', async () => {
        const { flagsmith, initConfig, mockFetch } = getFlagsmith(eventsConfig({ identity: testIdentity }));
        await flagsmith.init(initConfig);

        flagsmith.trackEvent('purchase');
        await flagsmith.flushEvents();

        const event = JSON.parse(eventCalls(mockFetch)[0][1].body).events[0];
        expect(event.identifier).toBe(testIdentity);
        expect(event).toHaveProperty('traits');
    });

    test('explicit identifier overrides the current context', async () => {
        const { flagsmith, initConfig, mockFetch } = getFlagsmith(eventsConfig({ identity: testIdentity }));
        await flagsmith.init(initConfig);

        flagsmith.trackEvent('purchase', { identifier: 'other_user' });
        await flagsmith.flushEvents();

        const event = JSON.parse(eventCalls(mockFetch)[0][1].body).events[0];
        expect(event.identifier).toBe('other_user');
    });
});

describe('getExperimentFlag', () => {
    test('returns the flag and fires one $flag_exposure when identified and source is SERVER', async () => {
        const { flagsmith, initConfig, mockFetch } = getFlagsmith(eventsConfig({ identity: testIdentity }));
        await flagsmith.init(initConfig); // fetches identity flags -> source SERVER

        const flag = flagsmith.getExperimentFlag('font_size');
        expect(flag).toEqual(expect.objectContaining({ enabled: true, value: 16 }));

        await flagsmith.flushEvents();
        const events = JSON.parse(eventCalls(mockFetch)[0][1].body).events;
        const exposures = events.filter((e: any) => e.event === FLAG_EXPOSURE_EVENT);
        expect(exposures).toHaveLength(1);
        expect(exposures[0]).toEqual(expect.objectContaining({
            feature_name: 'font_size',
            identifier: testIdentity,
            value: '16',
        }));
    });

    test('skips exposure when there is no identity, still returns the flag', async () => {
        const { flagsmith, initConfig, mockFetch } = getFlagsmith(eventsConfig());
        await flagsmith.init(initConfig); // anonymous, env flags -> source SERVER, no identity

        const flag = flagsmith.getExperimentFlag('font_size');
        expect(flag).toEqual(expect.objectContaining({ enabled: true, value: 16 }));

        await flagsmith.flushEvents();
        expect(eventCalls(mockFetch)).toHaveLength(0);
    });

    test('skips exposure for default flags (identified but source !== SERVER)', async () => {
        const { flagsmith, initConfig, mockFetch } = getFlagsmith(eventsConfig({
            identity: testIdentity,
            preventFetch: true,
            defaultFlags: { font_size: { enabled: true, value: 12 } },
        }));
        await flagsmith.init(initConfig); // no fetch -> source DEFAULT_FLAGS

        const flag = flagsmith.getExperimentFlag('font_size');
        expect(flag).toEqual(expect.objectContaining({ value: 12 }));

        await flagsmith.flushEvents();
        expect(eventCalls(mockFetch)).toHaveLength(0);
    });

    test('skips exposure and returns null for an absent feature', async () => {
        const { flagsmith, initConfig, mockFetch } = getFlagsmith(eventsConfig({ identity: testIdentity }));
        await flagsmith.init(initConfig);

        expect(flagsmith.getExperimentFlag('does_not_exist')).toBeNull();
        await flagsmith.flushEvents();
        expect(eventCalls(mockFetch)).toHaveLength(0);
    });

    test('repeated calls collapse to a single exposure within the window', async () => {
        const { flagsmith, initConfig, mockFetch } = getFlagsmith(eventsConfig({ identity: testIdentity }));
        await flagsmith.init(initConfig);

        flagsmith.getExperimentFlag('font_size');
        flagsmith.getExperimentFlag('font_size');
        flagsmith.getExperimentFlag('font_size');

        await flagsmith.flushEvents();
        const events = JSON.parse(eventCalls(mockFetch)[0][1].body).events;
        expect(events.filter((e: any) => e.event === FLAG_EXPOSURE_EVENT)).toHaveLength(1);
    });
});
