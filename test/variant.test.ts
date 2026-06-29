import { getFlagsmith, testIdentity } from './test-constants';
import { FLAG_EXPOSURE_EVENT } from '../event-processor';

const eventsUrl = 'https://events.test/';

// Identity payload where one flag carries a multivariate `variant` key, one is
// in the control bucket, and one is a plain (non-variant) flag.
const identityWithVariant = {
    identifier: testIdentity,
    traits: [],
    flags: [
        {
            feature: { id: 1, name: 'experiment', type: 'MULTIVARIATE' },
            enabled: true,
            feature_state_value: 'variant_value',
            variant: 'variant_a',
        },
        {
            feature: { id: 2, name: 'control_experiment', type: 'MULTIVARIATE' },
            enabled: true,
            feature_state_value: 'control_value',
            variant: 'control',
        },
        {
            feature: { id: 3, name: 'font_size', type: 'STANDARD' },
            enabled: true,
            feature_state_value: 16,
        },
        {
            feature: { id: 4, name: 'empty_variant', type: 'MULTIVARIATE' },
            enabled: true,
            feature_state_value: 'value',
            variant: '',
        },
        {
            feature: { id: 5, name: 'empty_value_experiment', type: 'MULTIVARIATE' },
            enabled: true,
            feature_state_value: '',
            variant: 'variant_b',
        },
    ],
};

async function initWithVariants() {
    const { flagsmith, initConfig, mockFetch } = getFlagsmith({
        enableEvents: true,
        eventProcessorConfig: { eventsApiUrl: eventsUrl, flushInterval: 60000 },
        identity: testIdentity,
    });
    // Replace the identity endpoint response with one that carries variant keys.
    mockFetch.mockImplementation(async (url: string) => {
        if (url.includes('/v1/events')) {
            return { status: 202, text: () => Promise.resolve('') };
        }
        if (url.includes('analytics/flags')) {
            return { status: 200, text: () => Promise.resolve('{}') };
        }
        if (url.includes('/identities/')) {
            return { status: 200, text: () => Promise.resolve(JSON.stringify(identityWithVariant)) };
        }
        throw new Error('Please mock the call to ' + url);
    });
    await flagsmith.init(initConfig);
    return { flagsmith, mockFetch };
}

describe('variant key', () => {
    test('surfaces the variant key, "control" bucket, and omits it for plain flags', async () => {
        const { flagsmith } = await initWithVariants();
        const flags = flagsmith.getAllFlags();
        expect(flags.experiment).toEqual(
            expect.objectContaining({ enabled: true, value: 'variant_value', variant: 'variant_a' })
        );
        expect(flags.control_experiment.variant).toBe('control');
        expect(flags.font_size.variant).toBeUndefined();
    });

    test('getExperimentFlag uses the variant as the exposure value and skips flags without one', async () => {
        const { flagsmith, mockFetch } = await initWithVariants();

        flagsmith.getExperimentFlag('experiment');
        flagsmith.getExperimentFlag('control_experiment');
        flagsmith.getExperimentFlag('font_size');
        await flagsmith.flushEvents();

        const [, opts] = mockFetch.mock.calls.find(([url]) => url.includes('/v1/events'))!;
        const exposures = JSON.parse(opts.body).events.filter((e: any) => e.event === FLAG_EXPOSURE_EVENT);
        expect(exposures).toEqual([
            expect.objectContaining({ feature_name: 'experiment', value: 'variant_a' }),
            expect.objectContaining({ feature_name: 'control_experiment', value: 'control' }),
        ]);
    });

    test('treats an empty-string variant as absent and records no exposure for it', async () => {
        const { flagsmith, mockFetch } = await initWithVariants();

        expect(flagsmith.getAllFlags().empty_variant.variant).toBeUndefined();

        flagsmith.getExperimentFlag('empty_variant');
        await flagsmith.flushEvents();
        expect(mockFetch.mock.calls.find(([url]) => url.includes('/v1/events'))).toBeUndefined();
    });

    test('surfaces the variant and records an exposure when the flag value is an empty string', async () => {
        const { flagsmith, mockFetch } = await initWithVariants();

        expect(flagsmith.getAllFlags().empty_value_experiment).toEqual(
            expect.objectContaining({ enabled: true, value: '', variant: 'variant_b' })
        );

        flagsmith.getExperimentFlag('empty_value_experiment');
        await flagsmith.flushEvents();

        const [, opts] = mockFetch.mock.calls.find(([url]) => url.includes('/v1/events'))!;
        const exposures = JSON.parse(opts.body).events.filter((e: any) => e.event === FLAG_EXPOSURE_EVENT);
        expect(exposures).toEqual([
            expect.objectContaining({ feature_name: 'empty_value_experiment', value: 'variant_b' }),
        ]);
    });
});
