// Sample test
import { defaultState, defaultStateAlt, getFlagsmith, getStateToCheck } from './test-constants';

describe('Flagsmith.init', () => {

    beforeEach(() => {
        // Avoid mocks, but if you need to add them here
    });
    test('should error and not hit the API when preventFetch is true without default flags', async () => {
        const onChange = jest.fn();
        const { flagsmith, initConfig, AsyncStorage, mockFetch } = getFlagsmith({ onChange, preventFetch: true });
        await flagsmith.init(initConfig);

        expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
        expect(mockFetch).toHaveBeenCalledTimes(0);
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(
            null,
            { 'flagsChanged': true, 'isFromServer': false, 'traitsChanged': false },
            {
                'error': 'Wrong Flagsmith Configuration: preventFetch is true and no defaulFlags provided',
                'isFetching': false,
                'isLoading': false,
                'source': 'DEFAULT_FLAGS',
            },
        );
        expect(getStateToCheck(flagsmith.getState())).toEqual({
            ...defaultState,
            flags: {},
        });
    });
    test('should call onChange with default flags', async () => {
        const onChange = jest.fn();
        const { flagsmith, initConfig, AsyncStorage, mockFetch } = getFlagsmith({
            onChange,
            preventFetch: true,
            defaultFlags: defaultState.flags,
        });
        await flagsmith.init(initConfig);

        expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
        expect(mockFetch).toHaveBeenCalledTimes(0);
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(
            null,
            { 'flagsChanged': true, 'isFromServer': false, 'traitsChanged': false },
            {
                'error': null,
                'isFetching': false,
                'isLoading': false,
                'source': 'DEFAULT_FLAGS',
            },
        );
        expect(getStateToCheck(flagsmith.getState())).toEqual({
            ...defaultState,
        });
    });
    test('should call onChange with API flags', async () => {
        const onChange = jest.fn();
        const { flagsmith, initConfig, AsyncStorage, mockFetch } = getFlagsmith({
            onChange,
            defaultFlags: defaultStateAlt.flags,
        });
        await flagsmith.init(initConfig);

        expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(
            defaultStateAlt.flags,
            { 'flagsChanged': true, 'isFromServer': true, 'traitsChanged': false },
            {
                'error': null,
                'isFetching': false,
                'isLoading': false,
                'source': 'SERVER',
            },
        );
        expect(getStateToCheck(flagsmith.getState())).toEqual({
            ...defaultState,
        });
    });
    test('should validate flags are unchanged when fetched', async () => {
        const onChange = jest.fn();
        const { flagsmith, initConfig, AsyncStorage, mockFetch } = getFlagsmith({
            onChange,
            preventFetch: true,
            defaultFlags: defaultState.flags,
        });
        await flagsmith.init(initConfig);

        expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
        expect(mockFetch).toHaveBeenCalledTimes(0);
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(
            null,
            { 'flagsChanged': true, 'isFromServer': false, 'traitsChanged': false },
            {
                'error': null,
                'isFetching': false,
                'isLoading': false,
                'source': 'DEFAULT_FLAGS',
            },
        );
        expect(getStateToCheck(flagsmith.getState())).toEqual({
            ...defaultState,
        });
        await flagsmith.getFlags()
        expect(onChange).toHaveBeenCalledTimes(2);

        expect(onChange).toHaveBeenCalledWith(
            defaultState.flags,
            { 'flagsChanged': false, 'isFromServer': true, 'traitsChanged': false },
            {
                'error': null,
                'isFetching': false,
                'isLoading': false,
                'source': 'SERVER',
            },
        );
        expect(getStateToCheck(flagsmith.getState())).toEqual({
            ...defaultState,
        });
    });
});
