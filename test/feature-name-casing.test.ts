import { IInitConfig } from '../types';
import { delay, getFlagsmith } from './test-constants';

const mixedCaseFlags = [
    {
        feature: { id: 1, name: 'MyFeatureFlag', type: 'STANDARD' },
        enabled: true,
        feature_state_value: 'on',
    },
    {
        feature: { id: 2, name: 'another_flag', type: 'STANDARD' },
        enabled: false,
        feature_state_value: null,
    },
];

const instances: any[] = [];

afterEach(() => {
    // enableAnalytics starts an interval that nothing public tears down.
    instances.forEach((flagsmith) => clearInterval(flagsmith.analyticsInterval));
    instances.length = 0;
});

async function initWithMixedCaseFlags(config: Partial<IInitConfig> = {}) {
    const { flagsmith, initConfig, mockFetch } = getFlagsmith(config);
    mockFetch.mockImplementation(async (url: string) => {
        if (url.includes('analytics/flags')) {
            return { status: 200, text: () => Promise.resolve('{}') };
        }
        if (url.includes('/flags/')) {
            return { status: 200, text: () => Promise.resolve(JSON.stringify(mixedCaseFlags)) };
        }
        throw new Error('Please mock the call to ' + url);
    });
    await flagsmith.init(initConfig);
    instances.push(flagsmith);
    return { flagsmith, mockFetch };
}

const postedAnalytics = (mockFetch: jest.Mock) => {
    const call = mockFetch.mock.calls.find(([url]: [string]) => url.includes('analytics/flags'));
    return call ? JSON.parse(call[1].body) : null;
};

const byName = (flags: Record<string, any>) =>
    Object.fromEntries(Object.entries(flags).map(([key, flag]) => [flag.name ?? key, flag]));

describe('feature name casing', () => {
    test('exposes the original feature name on each flag', async () => {
        const { flagsmith } = await initWithMixedCaseFlags();
        expect(flagsmith.getAllFlags()).toEqual({
            myfeatureflag: { id: 1, name: 'MyFeatureFlag', enabled: true, value: 'on' },
            another_flag: { id: 2, name: 'another_flag', enabled: false, value: null },
        });
    });

    test('getAllFlags can be re-keyed by original feature name', async () => {
        const { flagsmith } = await initWithMixedCaseFlags();
        const flagsByName = byName(flagsmith.getAllFlags());
        expect(Object.keys(flagsByName).sort()).toEqual(['MyFeatureFlag', 'another_flag']);
        expect(flagsByName.MyFeatureFlag.value).toBe('on');
    });

    test('lookups still resolve regardless of the casing the caller uses', async () => {
        const { flagsmith } = await initWithMixedCaseFlags();
        expect(flagsmith.getValue('MyFeatureFlag')).toBe('on');
        expect(flagsmith.getValue('myfeatureflag')).toBe('on');
        expect(flagsmith.hasFeature('MYFEATUREFLAG')).toBe(true);
    });

    test('falls back to the flag key when name is absent, as with defaultFlags', async () => {
        const { flagsmith, initConfig } = getFlagsmith({
            preventFetch: true,
            defaultFlags: { my_default: { enabled: true, value: 1 } },
        });
        await flagsmith.init(initConfig);
        expect(byName(flagsmith.getAllFlags()).my_default).toEqual({ enabled: true, value: 1 });
    });

    test('records analytics against the canonical feature name, whatever casing the caller used', async () => {
        const { flagsmith, mockFetch } = await initWithMixedCaseFlags({ enableAnalytics: true });
        await delay(1); // evaluationEvent is restored from storage asynchronously

        flagsmith.getValue('myfeatureflag');
        flagsmith.getValue('MyFeatureFlag');
        flagsmith.hasFeature('MYFEATUREFLAG');

        // @ts-ignore internal, normally driven by an interval
        await flagsmith.analyticsFlags();
        expect(postedAnalytics(mockFetch)).toEqual({ MyFeatureFlag: 3 });
    });

    test('buckets unknown flags under the normalised key rather than the caller casing', async () => {
        const { flagsmith, mockFetch } = await initWithMixedCaseFlags({ enableAnalytics: true });
        await delay(1);

        flagsmith.getValue('Does Not Exist');
        flagsmith.getValue('does_not_exist');

        // @ts-ignore internal, normally driven by an interval
        await flagsmith.analyticsFlags();
        expect(postedAnalytics(mockFetch)).toEqual({ does_not_exist: 2 });
    });
});
