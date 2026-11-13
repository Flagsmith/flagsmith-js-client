import { IInitConfig } from '../types';
import { getFlagsmith } from './test-constants';

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
    return { flagsmith, mockFetch };
}

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
});
