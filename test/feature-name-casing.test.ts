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

describe('feature name casing', () => {
    test('exposes the original feature name on each flag', async () => {
        const { flagsmith } = await initWithMixedCaseFlags();
        expect(flagsmith.getAllFlags()).toEqual({
            myfeatureflag: { id: 1, name: 'MyFeatureFlag', enabled: true, value: 'on' },
            another_flag: { id: 2, name: 'another_flag', enabled: false, value: null },
        });
    });

    test('lookups still resolve regardless of the casing the caller uses', async () => {
        const { flagsmith } = await initWithMixedCaseFlags();
        expect(flagsmith.getValue('MyFeatureFlag')).toBe('on');
        expect(flagsmith.getValue('myfeatureflag')).toBe('on');
        expect(flagsmith.hasFeature('MYFEATUREFLAG')).toBe(true);
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
