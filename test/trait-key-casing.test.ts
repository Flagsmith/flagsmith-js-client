import { delay, FLAGSMITH_KEY, getFlagsmith, identityState, testIdentity } from './test-constants';

const identityWithCamelCaseTraits = {
    identifier: testIdentity,
    traits: [
        { trait_key: 'appVersion', trait_value: '2.15.1' },
        { trait_key: 'my trait', trait_value: 'spaced' },
    ],
    flags: [
        {
            feature: { id: 1, name: 'font_size', type: 'STANDARD' },
            enabled: true,
            feature_state_value: 16,
        },
    ],
};

async function initWithIdentityTraits(responseTraits = identityWithCamelCaseTraits.traits) {
    const { flagsmith, initConfig, mockFetch } = getFlagsmith({ identity: testIdentity });
    mockFetch.mockImplementation(async (url: string) => {
        if (url.includes('analytics/flags')) {
            return { status: 200, text: () => Promise.resolve('{}') };
        }
        if (url.includes('/identities/')) {
            return {
                status: 200,
                text: () => Promise.resolve(JSON.stringify({ ...identityWithCamelCaseTraits, traits: responseTraits })),
            };
        }
        throw new Error('Please mock the call to ' + url);
    });
    await flagsmith.init(initConfig);
    return { flagsmith, mockFetch };
}

describe('trait key casing', () => {
    test('preserves the original casing of trait keys returned by the API', async () => {
        const { flagsmith } = await initWithIdentityTraits();
        expect(flagsmith.getAllTraits()).toEqual({
            appVersion: '2.15.1',
            my_trait: 'spaced',
        });
    });

    test('getTrait matches exactly and falls back to case-insensitive lookup', async () => {
        const { flagsmith } = await initWithIdentityTraits();
        expect(flagsmith.getTrait('appVersion')).toBe('2.15.1');
        expect(flagsmith.getTrait('appversion')).toBe('2.15.1');
        expect(flagsmith.getTrait('APPVERSION')).toBe('2.15.1');
        expect(flagsmith.getTrait('my trait')).toBe('spaced');
        expect(flagsmith.getTrait('my_trait')).toBe('spaced');
        expect(flagsmith.getTrait('unknown')).toBeUndefined();
    });

    test('keeps keys differing only by case as distinct traits', async () => {
        const { flagsmith } = await initWithIdentityTraits([
            { trait_key: 'appVersion', trait_value: '2.16.1' },
            { trait_key: 'appversion', trait_value: '2.15.1' },
        ]);
        expect(flagsmith.getTrait('appVersion')).toBe('2.16.1');
        expect(flagsmith.getTrait('appversion')).toBe('2.15.1');
        expect(flagsmith.getTrait('APPVERSION')).toBe('2.16.1');
    });

    test('does not re-send lowercased traits cached by a previous SDK version', async () => {
        const { flagsmith, initConfig, mockFetch, AsyncStorage } = getFlagsmith({
            cacheFlags: true,
            identity: testIdentity,
        });
        await AsyncStorage.setItem(
            FLAGSMITH_KEY,
            JSON.stringify({
                ...identityState,
                evaluationContext: {
                    ...identityState.evaluationContext,
                    identity: {
                        identifier: testIdentity,
                        traits: { appversion: { value: '2.15.1' } },
                    },
                },
            }),
        );
        mockFetch.mockImplementation(async (url: string) => {
            if (url.includes('analytics/flags')) {
                return { status: 200, text: () => Promise.resolve('{}') };
            }
            if (url.includes('/identities/')) {
                return {
                    status: 200,
                    text: () =>
                        Promise.resolve(
                            JSON.stringify({
                                identifier: testIdentity,
                                traits: [{ trait_key: 'appVersion', trait_value: '2.15.1' }],
                                flags: identityWithCamelCaseTraits.flags,
                            }),
                        ),
                };
            }
            throw new Error('Please mock the call to ' + url);
        });
        await flagsmith.init(initConfig);
        await delay(50);
        await flagsmith.setTrait('otherTrait', 'x');
        const sentKeys = mockFetch.mock.calls
            .filter(([url, options]) => url.endsWith('/identities/') && options?.method === 'POST')
            .flatMap(([, options]) => JSON.parse(options.body).traits.map((t: { trait_key: string }) => t.trait_key));
        expect(sentKeys).toContain('appVersion');
        expect(sentKeys).not.toContain('appversion');
    });

    test('re-sends trait keys to the API with their original casing', async () => {
        const { flagsmith, mockFetch } = await initWithIdentityTraits();
        mockFetch.mockClear();
        await flagsmith.setTrait('otherTrait', 'x');
        const postCall = mockFetch.mock.calls.find(
            ([url, options]) => url.endsWith('/identities/') && options?.method === 'POST',
        );
        expect(postCall).toBeTruthy();
        const body = JSON.parse(postCall![1].body);
        expect(body.traits).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ trait_key: 'appVersion', trait_value: '2.15.1' }),
                expect.objectContaining({ trait_key: 'my_trait', trait_value: 'spaced' }),
                expect.objectContaining({ trait_key: 'otherTrait', trait_value: 'x' }),
            ]),
        );
        expect(body.traits.map((t: { trait_key: string }) => t.trait_key)).not.toContain('appversion');
    });
});
