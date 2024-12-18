// Sample test
import { waitFor } from '@testing-library/react';
import {defaultState, FLAGSMITH_KEY, getFlagsmith, getStateToCheck, identityState} from './test-constants';
import { promises as fs } from 'fs';

describe('Flagsmith.init', () => {
    beforeEach(() => {
        // Avoid mocks, but if you need to add them here
    });
    test('should initialize with expected values', async () => {
        const onChange = jest.fn();
        const { flagsmith, initConfig, AsyncStorage, mockFetch } = getFlagsmith({ onChange });
        await flagsmith.init(initConfig);

        expect(flagsmith.environmentID).toBe(initConfig.environmentID);
        expect(flagsmith.api).toBe('https://edge.api.flagsmith.com/api/v1/'); // Assuming defaultAPI is globally defined
        expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(
            {},
            { flagsChanged: Object.keys(defaultState.flags), isFromServer: true, traitsChanged: null },
            { error: null, isFetching: false, isLoading: false, source: 'SERVER' },
        );
        expect(getStateToCheck(flagsmith.getState())).toEqual(defaultState);
    });
    test('should initialize with identity', async () => {
        const onChange = jest.fn();
        const { flagsmith, initConfig, AsyncStorage, mockFetch } = getFlagsmith({
            onChange,
            identity: 'test_identity',
        });
        await flagsmith.init(initConfig);

        expect(flagsmith.environmentID).toBe(initConfig.environmentID);
        expect(flagsmith.api).toBe('https://edge.api.flagsmith.com/api/v1/'); // Assuming defaultAPI is globally defined
        expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(
            {},
            {
                flagsChanged: Object.keys(defaultState.flags),
                isFromServer: true,
                traitsChanged: expect.arrayContaining(Object.keys(identityState.evaluationContext.identity.traits)),
            },
            { error: null, isFetching: false, isLoading: false, source: 'SERVER' },
        );
        expect(getStateToCheck(flagsmith.getState())).toEqual(identityState);
    });
    test('should initialize with identity and traits', async () => {
        const onChange = jest.fn();
        const testIdentityWithTraits = `test_identity_with_traits`;
        const { flagsmith, initConfig, AsyncStorage, mockFetch } = getFlagsmith({
            onChange,
            identity: testIdentityWithTraits,
            traits: { number_trait: 1, string_trait: 'Example' },
        });
        mockFetch.mockResolvedValueOnce({
            status: 200,
            text: () => fs.readFile(`./test/data/identities_${testIdentityWithTraits}.json`, 'utf8'),
        });

        await flagsmith.init(initConfig);

        expect(flagsmith.environmentID).toBe(initConfig.environmentID);
        expect(flagsmith.api).toBe('https://edge.api.flagsmith.com/api/v1/'); // Assuming defaultAPI is globally defined
        expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(
            {},
            {
                flagsChanged: Object.keys(defaultState.flags),
                isFromServer: true,
                traitsChanged: ['number_trait', 'string_trait'],
            },
            { error: null, isFetching: false, isLoading: false, source: 'SERVER' },
        );
        expect(getStateToCheck(flagsmith.getState())).toEqual({
            ...identityState,
            evaluationContext: {
                ...identityState.evaluationContext,
                identity: {
                    ...identityState.evaluationContext.identity,
                    identifier: testIdentityWithTraits,
                },
            },
        });
    });
    test('should reject initialize with identity no key', async () => {
        const onChange = jest.fn();
        const { flagsmith, initConfig } = getFlagsmith({
            onChange,
            evaluationContext: { environment: { apiKey: '' } },
        });
        await expect(flagsmith.init(initConfig)).rejects.toThrow(Error);
    });
    test('should reject initialize with identity bad key', async () => {
        const onChange = jest.fn();
        const { flagsmith, initConfig, mockFetch } = getFlagsmith({ onChange, environmentID: 'bad' });
        mockFetch.mockResolvedValueOnce({ status: 404, text: async () => '' });
        await expect(flagsmith.init(initConfig)).rejects.toThrow(Error);
    });
    test('identifying with new identity should not carry over previous traits for different identity', async () => {
        const onChange = jest.fn();
        const identityA = `test_identity_a`;
        const identityB = `test_identity_b`;
        const { flagsmith, initConfig, mockFetch } = getFlagsmith({
            onChange,
            identity: identityA,
            traits: { a: `example` },
        });
        mockFetch.mockResolvedValueOnce({
            status: 200,
            text: () => fs.readFile(`./test/data/identities_${identityA}.json`, 'utf8'),
        });
        await flagsmith.init(initConfig);
        expect(flagsmith.getTrait('a')).toEqual(`example`);
        mockFetch.mockResolvedValueOnce({
            status: 200,
            text: () => fs.readFile(`./test/data/identities_${identityB}.json`, 'utf8'),
        });
        await flagsmith.identify(identityB);
        expect(flagsmith.getTrait('a')).toEqual(undefined);
        mockFetch.mockResolvedValueOnce({
            status: 200,
            text: () => fs.readFile(`./test/data/identities_${identityA}.json`, 'utf8'),
        });
        await flagsmith.identify(identityA);
        expect(flagsmith.getTrait('a')).toEqual(`example`);
        mockFetch.mockResolvedValueOnce({
            status: 200,
            text: () => fs.readFile(`./test/data/identities_${identityB}.json`, 'utf8'),
        });
        await flagsmith.identify(identityB);
        expect(flagsmith.getTrait('a')).toEqual(undefined);
    });
    test('identifying with transient identity should request the API correctly', async () => {
        const onChange = jest.fn();
        const testTransientIdentity = `test_transient_identity`;
        const evaluationContext = {
            identity: { identifier: testTransientIdentity, transient: true },
        };
        const { flagsmith, initConfig, mockFetch } = getFlagsmith({ onChange, evaluationContext });
        mockFetch.mockResolvedValueOnce({
            status: 200,
            text: () => fs.readFile(`./test/data/identities_${testTransientIdentity}.json`, 'utf8'),
        });
        await flagsmith.init(initConfig);
        expect(mockFetch).toHaveBeenCalledWith(
            `https://edge.api.flagsmith.com/api/v1/identities/?identifier=${testTransientIdentity}&transient=true`,
            expect.objectContaining({ method: 'GET' }),
        );
    });
    test('identifying with transient traits should request the API correctly', async () => {
        const onChange = jest.fn();
        const testIdentityWithTransientTraits = `test_identity_with_transient_traits`;
        const evaluationContext = {
            identity: {
                identifier: testIdentityWithTransientTraits,
                traits: {
                    number_trait: { value: 1 },
                    string_trait: { value: 'Example' },
                    transient_trait: { value: 'Example', transient: true },
                },
            },
        };
        const { flagsmith, initConfig, mockFetch } = getFlagsmith({ onChange, evaluationContext });
        mockFetch.mockResolvedValueOnce({
            status: 200,
            text: () => fs.readFile(`./test/data/identities_${testIdentityWithTransientTraits}.json`, 'utf8'),
        });
        await flagsmith.init(initConfig);
        expect(mockFetch).toHaveBeenCalledWith(
            'https://edge.api.flagsmith.com/api/v1/identities/',
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({
                    identifier: testIdentityWithTransientTraits,
                    traits: [
                        {
                            trait_key: 'number_trait',
                            trait_value: 1,
                        },
                        {
                            trait_key: 'string_trait',
                            trait_value: 'Example',
                        },
                        {
                            trait_key: 'transient_trait',
                            trait_value: 'Example',
                            transient: true,
                        },
                    ],
                }),
            }),
        );
    });
    test('should not reject but call onError, when the API cannot be reached with the cache populated', async () => {
        const onError = jest.fn();
        const { flagsmith, initConfig, AsyncStorage } = getFlagsmith({
            cacheFlags: true,
            fetch: async () => {
                return Promise.resolve({ text: () => Promise.resolve('Mocked fetch error'), ok: false, status: 401 });
            },
            onError,
        });
        await AsyncStorage.setItem(FLAGSMITH_KEY, JSON.stringify(defaultState));
        await flagsmith.init(initConfig);

        expect(getStateToCheck(flagsmith.getState())).toEqual(defaultState);

        await waitFor(() => {
            expect(onError).toHaveBeenCalledTimes(1);
        });
        expect(onError).toHaveBeenCalledWith(new Error('Mocked fetch error'));
    });
    test('should not reject when the API cannot be reached but default flags are set', async () => {
        const { flagsmith, initConfig } = getFlagsmith({
            defaultFlags: defaultState.flags,
            cacheFlags: true,
            fetch: async () => {
                return Promise.resolve({ text: () => Promise.resolve('Mocked fetch error'), ok: false, status: 401 });
            },
        });
        await flagsmith.init(initConfig);

        expect(getStateToCheck(flagsmith.getState())).toEqual(defaultState);
    });
    test('should not reject but call onError, when the identities/ API cannot be reached with the cache populated', async () => {
        const onError = jest.fn();
        const { flagsmith, initConfig, AsyncStorage } = getFlagsmith({
            evaluationContext: identityState.evaluationContext,
            cacheFlags: true,
            fetch: async () => {
                return Promise.resolve({ text: () => Promise.resolve('Mocked fetch error'), ok: false, status: 401 });
            },
            onError,
        });
        await AsyncStorage.setItem(FLAGSMITH_KEY, JSON.stringify(identityState));
        await flagsmith.init(initConfig);

        expect(getStateToCheck(flagsmith.getState())).toEqual(identityState);

        await waitFor(() => {
            expect(onError).toHaveBeenCalledTimes(1);
        });
        expect(onError).toHaveBeenCalledWith(new Error('Mocked fetch error'));
    });
});
