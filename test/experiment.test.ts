import { getFlagsmith, testIdentity } from './test-constants';
import { FLAG_EXPOSURE_EVENT } from '../event-processor';

const identityWithExperiments = {
    identifier: testIdentity,
    traits: [],
    flags: [
        {
            feature: { id: 1, name: 'checkout_cta', type: 'MULTIVARIATE' },
            enabled: true,
            feature_state_value: 'buy-now',
            variant: 'treatment-a',
            metadata: { experiment: { id: 42, name: 'New checkout CTA', in_experiment: true } },
        },
        {
            feature: { id: 2, name: 'not_enrolled', type: 'MULTIVARIATE' },
            enabled: true,
            feature_state_value: 'control_value',
            variant: 'control',
            metadata: { experiment: { id: 43, name: 'Not enrolled experiment', in_experiment: false } },
        },
        {
            feature: { id: 3, name: 'legacy_variant', type: 'MULTIVARIATE' },
            enabled: true,
            feature_state_value: 'legacy_value',
            variant: 'control',
        },
    ],
};

async function initWithExperiments() {
    const { flagsmith, initConfig, mockFetch } = getFlagsmith({
        identity: testIdentity,
        enableEvents: true,
        eventProcessorConfig: { eventsApiUrl: 'https://events.test/', flushInterval: 60000 },
    });
    mockFetch.mockImplementation(async (url: string) => {
        if (url.includes('/v1/events')) {
            return { status: 202, text: () => Promise.resolve('') };
        }
        if (url.includes('/identities/')) {
            return { status: 200, text: () => Promise.resolve(JSON.stringify(identityWithExperiments)) };
        }
        throw new Error('Please mock the call to ' + url);
    });
    await flagsmith.init(initConfig);
    return { flagsmith, mockFetch };
}

function exposures(mockFetch: jest.Mock) {
    return mockFetch.mock.calls
        .filter(([url]: [string]) => url.includes('/v1/events'))
        .flatMap(([, opts]: [string, any]) =>
            JSON.parse(opts.body).events.filter((e: any) => e.event === FLAG_EXPOSURE_EVENT)
        );
}

describe('experiment metadata', () => {
    test('maps metadata.experiment onto the flag, undefined when absent', async () => {
        const { flagsmith } = await initWithExperiments();
        const flags = flagsmith.getAllFlags();

        expect(flags.checkout_cta.experiment).toEqual({ id: 42, name: 'New checkout CTA', inExperiment: true });
        expect(flags.not_enrolled.experiment).toEqual({ id: 43, name: 'Not enrolled experiment', inExperiment: false });
        expect(flags.legacy_variant.experiment).toBeUndefined();
    });

    test('getExperimentFlag records an exposure only when enrolled, with the experiment id', async () => {
        const { flagsmith, mockFetch } = await initWithExperiments();

        flagsmith.getExperimentFlag('checkout_cta');
        expect(flagsmith.getExperimentFlag('not_enrolled')?.variant).toBe('control');
        expect(flagsmith.getExperimentFlag('legacy_variant')?.variant).toBe('control');
        await flagsmith.flushEvents();

        expect(exposures(mockFetch)).toEqual([
            expect.objectContaining({
                feature_name: 'checkout_cta',
                value: 'treatment-a',
                metadata: expect.objectContaining({ experiment_id: 42 }),
            }),
        ]);
    });
});
