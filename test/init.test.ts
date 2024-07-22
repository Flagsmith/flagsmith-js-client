// Sample test
import { defaultState, getFlagsmith, getStateToCheck, identityState } from './test-constants';
import { promises as fs } from 'fs'

describe('Flagsmith.init', () => {

    beforeEach(() => {
        // Avoid mocks, but if you need to add them here
    });
    test('should initialize with expected values', async () => {
        const onChange = jest.fn()
        const {flagsmith,initConfig, AsyncStorage,mockFetch} = getFlagsmith({onChange})
        await flagsmith.init(initConfig);

        expect(flagsmith.environmentID).toBe(initConfig.environmentID);
        expect(flagsmith.api).toBe('https://edge.api.flagsmith.com/api/v1/'); // Assuming defaultAPI is globally defined
        expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(
            {},
            {"flagsChanged": Object.keys(defaultState.flags), "isFromServer": true, "traitsChanged": null},
            {"error": null, "isFetching": false, "isLoading": false, "source": "SERVER"}
        );
        expect(getStateToCheck(flagsmith.getState())).toEqual(defaultState)
    });
    test('should initialize with identity', async () => {
        const onChange = jest.fn()
        const {flagsmith,initConfig, AsyncStorage,mockFetch} = getFlagsmith({onChange, identity:"test_identity"})
        await flagsmith.init(initConfig);

        expect(flagsmith.environmentID).toBe(initConfig.environmentID);
        expect(flagsmith.api).toBe('https://edge.api.flagsmith.com/api/v1/'); // Assuming defaultAPI is globally defined
        expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(
            {},
            {"flagsChanged": Object.keys(defaultState.flags), "isFromServer": true, "traitsChanged": expect.arrayContaining(Object.keys(identityState.traits))},
            {"error": null, "isFetching": false, "isLoading": false, "source": "SERVER"}
        );
        expect(getStateToCheck(flagsmith.getState())).toEqual(identityState)
    });
    test('should initialize with identity and traits', async () => {
        const onChange = jest.fn()
        const {flagsmith,initConfig, AsyncStorage,mockFetch} = getFlagsmith({onChange, identity:"test_identity_with_traits", traits:{number_trait:1, string_trait:"Example"}})
        //@ts-ignore
        mockFetch.mockResolvedValueOnce({status: 200, text: () => fs.readFile('./test/data/identities_test_identity.json')})

        await flagsmith.init(initConfig);

        expect(flagsmith.environmentID).toBe(initConfig.environmentID);
        expect(flagsmith.api).toBe('https://edge.api.flagsmith.com/api/v1/'); // Assuming defaultAPI is globally defined
        expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(
            {},
            {"flagsChanged": Object.keys(defaultState.flags), "isFromServer": true, "traitsChanged": ["number_trait","string_trait"]},
            {"error": null, "isFetching": false, "isLoading": false, "source": "SERVER"}
        );
        expect(getStateToCheck(flagsmith.getState())).toEqual({
            ...identityState,
            identity: 'test_identity_with_traits'
        })
    });
    test('should reject initialize with identity no key', async () => {
        const onChange = jest.fn()
        const {flagsmith,initConfig} = getFlagsmith({onChange, environmentID:""})
        await expect(flagsmith.init(initConfig)).rejects.toThrow(Error);
    });
    test('should reject initialize with identity bad key', async () => {
        const onChange = jest.fn()
        const {flagsmith,initConfig,mockFetch} = getFlagsmith({onChange, environmentID:"bad"})
        //@ts-ignore
        mockFetch.mockResolvedValueOnce(async () => { return {status: 404} })
        await expect(flagsmith.init(initConfig)).rejects.toThrow(Error);
    });
    test('identifying with new identity should not carry over previous traits for different identity', async () => {
        const onChange = jest.fn()
        const identityA = `test_identity_a`
        const identityB = `test_identity_b`
        const {flagsmith,initConfig,mockFetch} = getFlagsmith({onChange, identity:identityA, traits: {a:`example`}})
        //@ts-ignore
        mockFetch.mockResolvedValueOnce({status: 200, text: () => fs.readFile('./test/data/identities_test_identity_a.json')})
        await flagsmith.init(initConfig);
        expect(flagsmith.getTrait("a")).toEqual(`example`)
        //@ts-ignore
        mockFetch.mockResolvedValueOnce({status: 200, text: () => fs.readFile('./test/data/identities_test_identity_b.json')})
        await flagsmith.identify(identityB)
        expect(flagsmith.getTrait("a")).toEqual(undefined)
        //@ts-ignore
        mockFetch.mockResolvedValueOnce({status: 200, text: () => fs.readFile('./test/data/identities_test_identity_a.json')})
        await flagsmith.identify(identityA)
        expect(flagsmith.getTrait("a")).toEqual(`example`)
        //@ts-ignore
        mockFetch.mockResolvedValueOnce({status: 200, text: () => fs.readFile('./test/data/identities_test_identity_b.json')})
        await flagsmith.identify(identityB)
        expect(flagsmith.getTrait("a")).toEqual(undefined)
    });
});
