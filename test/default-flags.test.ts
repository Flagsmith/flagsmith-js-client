// Sample test
import { defaultState, defaultStateAlt, getFlagsmith, getStateToCheck } from './test-constants';
import { IFlags } from '../types';

describe('Default Flags', () => {

    beforeEach(() => {
        // Avoid mocks, but if you need to add them here
    });
    test('should error and not hit the API when preventFetch is true without default flags', async () => {
        const onChange = jest.fn();
        const { flagsmith, initConfig, AsyncStorage, mockFetch } = getFlagsmith({ onChange, preventFetch: true });
        await flagsmith.init(initConfig)

        expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
        expect(mockFetch).toHaveBeenCalledTimes(0);
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(
            null,
            { 'flagsChanged': null, 'isFromServer': false, 'traitsChanged': null },
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
    test.only('should return accurate changed flags', async () => {
        const onChange = jest.fn();
        const defaultFlags: IFlags = {
            string_value:{id:1,enabled:true,value:"test"},
            numeric_value:{id:2,enabled:true,value:1},
            boolean_value:{id:3,enabled:true,value:true},
            unchanged_string_value:{id:4,enabled:true,value:"test"},
            unchanged_numeric_value:{id:5,enabled:true,value:1},
            unchanged_boolean_value:{id:6,enabled:true,value:null},
        }
        const itemsToRemove:IFlags = {
            string_value_remove:{id:7,enabled:true,value:"test"},
            numeric_value_remove:{id:8,enabled:true,value:1},
            boolean_value_remove:{id:9,enabled:true,value:true},
        }
        const { flagsmith, initConfig, AsyncStorage, mockFetch } = getFlagsmith({
            onChange,
            preventFetch: true,
            cacheFlags: true,
            defaultFlags: {...defaultFlags, ...itemsToRemove},
        });
        await AsyncStorage.setItem('BULLET_TRAIN_DB', JSON.stringify({
            ...defaultState,
            flags: {
                ...defaultFlags,
                string_value:{...defaultFlags.string_value, value:"test2"},
                numeric_value:{...defaultFlags.numeric_value,value:2},
                boolean_value:{...defaultFlags.boolean_value,enabled:false},
                new_string_value:{...defaultFlags.string_value},
                new_numeric_value:{...defaultFlags.numeric_value},
                new_boolean_value:{...defaultFlags.boolean_value},
            }
        }));
        await flagsmith.init(initConfig);

        expect(AsyncStorage.getItem).toHaveBeenCalledTimes(2);
        expect(mockFetch).toHaveBeenCalledTimes(0);
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(
            null,
            { 'flagsChanged': expect.arrayContaining([
                "string_value",
                "numeric_value",
                "boolean_value",
                "new_string_value",
                "new_numeric_value",
                "new_boolean_value",
                ].concat(Object.keys(itemsToRemove))), 'isFromServer': false, 'traitsChanged': null },
            {
                'error': null,
                'isFetching': false,
                'isLoading': false,
                'source': 'CACHE',
            },
        );
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
            { 'flagsChanged': Object.keys(defaultState.flags), 'isFromServer': false, 'traitsChanged': null },
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
            { 'flagsChanged': Object.keys(defaultState.flags).concat(Object.keys(defaultStateAlt.flags)), 'isFromServer': true, 'traitsChanged': null },
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
            { 'flagsChanged': Object.keys(defaultState.flags), 'isFromServer': false, 'traitsChanged': null },
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
            { 'flagsChanged': null, 'isFromServer': true, 'traitsChanged': null },
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
