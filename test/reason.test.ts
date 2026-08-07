import { getFlagsmith, testIdentity } from './test-constants';

// Environment and identity payloads where some flags carry the engine's
// evaluation `reason` and one is served by an API that predates the field.
const environmentFlags = [
    {
        feature: { id: 1, name: 'font_size', type: 'STANDARD' },
        enabled: true,
        feature_state_value: 16,
        reason: 'DEFAULT',
    },
    {
        feature: { id: 2, name: 'no_reason', type: 'STANDARD' },
        enabled: true,
        feature_state_value: 'value',
    },
];

const identityWithReasons = {
    identifier: testIdentity,
    traits: [],
    flags: [
        {
            feature: { id: 1, name: 'font_size', type: 'STANDARD' },
            enabled: true,
            feature_state_value: 24,
            reason: 'TARGETING_MATCH; segment=power_users',
        },
        {
            feature: { id: 3, name: 'experiment', type: 'MULTIVARIATE' },
            enabled: true,
            feature_state_value: 'variant_value',
            variant: 'variant_a',
            reason: 'SPLIT; weight=30.0',
        },
    ],
};

async function initWithReasons(config: Parameters<typeof getFlagsmith>[0] = {}) {
    const { flagsmith, initConfig, mockFetch } = getFlagsmith(config);
    mockFetch.mockImplementation(async (url: string) => {
        if (url.includes('analytics/flags')) {
            return { status: 200, text: () => Promise.resolve('{}') };
        }
        if (url.includes('/identities/')) {
            return { status: 200, text: () => Promise.resolve(JSON.stringify(identityWithReasons)) };
        }
        if (url.includes('/flags/')) {
            return { status: 200, text: () => Promise.resolve(JSON.stringify(environmentFlags)) };
        }
        throw new Error('Please mock the call to ' + url);
    });
    await flagsmith.init(initConfig);
    return { flagsmith };
}

describe('evaluation reason', () => {
    test('surfaces the reason from environment flags and omits it when absent', async () => {
        const { flagsmith } = await initWithReasons();
        const flags = flagsmith.getAllFlags();
        expect(flags.font_size).toEqual(expect.objectContaining({ enabled: true, value: 16, reason: 'DEFAULT' }));
        expect(flags.no_reason.reason).toBeUndefined();
    });

    test('surfaces the reason from identity flags alongside the variant', async () => {
        const { flagsmith } = await initWithReasons({ identity: testIdentity });
        const flags = flagsmith.getAllFlags();
        expect(flags.font_size.reason).toBe('TARGETING_MATCH; segment=power_users');
        expect(flags.experiment).toEqual(
            expect.objectContaining({ variant: 'variant_a', reason: 'SPLIT; weight=30.0' })
        );
    });
});
