// Sample test
import { defaultState, defaultStateAlt, getFlagsmith, getStateToCheck } from './test-constants';

describe('Flagsmith.init', () => {

    beforeEach(() => {
        // Avoid mocks, but if you need to add them here
    });
    test('should check cache but not call onChange when empty', async () => {
        const onChange = jest.fn()
        const {flagsmith,initConfig, mockFetch} = getFlagsmith({
            cacheFlags: true,
            onChange
        })
        expect(mockFetch).toHaveBeenCalledTimes(0);
        await flagsmith.init(initConfig);
        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledTimes(1);
    });
    test('should set cache after init', async () => {
        const onChange = jest.fn()
        const {flagsmith,initConfig, AsyncStorage,mockFetch} = getFlagsmith({
            cacheFlags: true,
            onChange
        })
        await flagsmith.init(initConfig);
        const cache = await AsyncStorage.getItem("BULLET_TRAIN_DB")
        expect(getStateToCheck(JSON.parse(`${cache}`))).toEqual(defaultState)
    });
    test('should call onChange with cache then eventually with an API response', async () => {
        let onChangeCount = 0;
        const onChangePromise = new Promise((resolve)=>{
            setInterval(()=>{
                if(onChangeCount===2) {
                    resolve(null)
                }
            },100)
        })
        const onChange = jest.fn(()=>{
            onChangeCount+=1
        })

        const {flagsmith,initConfig, AsyncStorage,mockFetch} = getFlagsmith({
            cacheFlags: true,
            onChange,
        })
        await AsyncStorage.setItem("BULLET_TRAIN_DB", JSON.stringify(defaultStateAlt) )
        await flagsmith.init(initConfig);

        // Flags retrieved from cache
        expect(getStateToCheck(flagsmith.getState())).toEqual(defaultStateAlt)
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(flagsmith.loadingState).toEqual( { error: null, isFetching: true, isLoading: false, source: 'CACHE' })

        //Flags retrieved from API
        await onChangePromise
        expect(onChange).toHaveBeenCalledTimes(2);
        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(flagsmith.loadingState).toEqual( { error: null, isFetching: false, isLoading: false, source: 'SERVER' })
        expect(getStateToCheck(flagsmith.getState())).toEqual(defaultState)
    });
    test('should ignore cache with different identity', async () => {
        const onChange = jest.fn()
        const {flagsmith,initConfig, AsyncStorage,mockFetch} = getFlagsmith({
            cacheFlags: true,
            identity:'test_identity',
            onChange,
        })
        await AsyncStorage.setItem("BULLET_TRAIN_DB", JSON.stringify({
            ...defaultStateAlt,
            identity: 'bad_identity'
        }) )
        await flagsmith.init(initConfig);
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(getStateToCheck(flagsmith.getState())).toEqual({
            ...defaultState,
            identity:'test_identity'
        })
    });
    test('should ignore cache with expired ttl', async () => {
        const onChange = jest.fn()
        const {flagsmith,initConfig, AsyncStorage,mockFetch} = getFlagsmith({
            cacheFlags: true,
            onChange,
            cacheOptions: {ttl: 1},
        })
        await AsyncStorage.setItem("BULLET_TRAIN_DB", JSON.stringify({
            ...defaultStateAlt,
            ts: new Date().valueOf() - 100
        }) )
        await flagsmith.init(initConfig);
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(getStateToCheck(flagsmith.getState())).toEqual({
            ...defaultState,
        })
    });

    test('should not ignore cache with valid ttl', async () => {
        const onChange = jest.fn()
        const {flagsmith,initConfig, AsyncStorage,mockFetch} = getFlagsmith({
            cacheFlags: true,
            onChange,
            cacheOptions: {ttl: 1000},
        })
        await AsyncStorage.setItem("BULLET_TRAIN_DB", JSON.stringify({
            ...defaultStateAlt,
            ts: new Date().valueOf()
        }) )
        await flagsmith.init(initConfig);
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(getStateToCheck(flagsmith.getState())).toEqual({
            ...defaultStateAlt,
        })
    });

    test('should not ignore cache when setting is disabled', async () => {
        const onChange = jest.fn()
        const {flagsmith,initConfig, AsyncStorage,mockFetch} = getFlagsmith({
            cacheFlags: false,
            onChange,
        })
        await AsyncStorage.setItem("BULLET_TRAIN_DB", JSON.stringify({
            ...defaultStateAlt,
            ts: new Date().valueOf()
        }) )
        await flagsmith.init(initConfig);
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(getStateToCheck(flagsmith.getState())).toEqual({
            ...defaultState,
        })
    });

    test('should not get flags from API when skipAPI is set', async () => {
        const onChange = jest.fn()
        const {flagsmith,initConfig, AsyncStorage,mockFetch} = getFlagsmith({
            cacheFlags: true,
            onChange,
            cacheOptions: {ttl: 1000, skipAPI:true},
        })
        await AsyncStorage.setItem("BULLET_TRAIN_DB", JSON.stringify({
            ...defaultStateAlt,
            ts: new Date().valueOf()
        }) )
        await flagsmith.init(initConfig);
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(mockFetch).toHaveBeenCalledTimes(0);
        expect(getStateToCheck(flagsmith.getState())).toEqual({
            ...defaultStateAlt,
        })
    });
    test('should validate flags are unchanged when fetched', async () => {
        const onChange = jest.fn();
        const { flagsmith, initConfig, AsyncStorage, mockFetch } = getFlagsmith({
            onChange,
            cacheFlags: true,
            preventFetch: true,
        });
        await AsyncStorage.setItem("BULLET_TRAIN_DB", JSON.stringify({
            ...defaultState
        }) )
        await flagsmith.init(initConfig);

        expect(AsyncStorage.getItem).toHaveBeenCalledTimes(2);
        expect(mockFetch).toHaveBeenCalledTimes(0);
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(
            null,
            { 'flagsChanged': true, 'isFromServer': false, 'traitsChanged': false },
            {
                'error': null,
                'isFetching': false,
                'isLoading': false,
                'source': 'CACHE',
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
    test('should validate flags are unchanged when fetched and default flags are provided', async () => {
        const onChange = jest.fn();
        const { flagsmith, initConfig, AsyncStorage, mockFetch } = getFlagsmith({
            onChange,
            cacheFlags: true,
            preventFetch: true,
            defaultFlags: defaultState.flags
        });
        await AsyncStorage.setItem("BULLET_TRAIN_DB", JSON.stringify({
            ...defaultState
        }) )
        await flagsmith.init(initConfig);

        expect(AsyncStorage.getItem).toHaveBeenCalledTimes(2);
        expect(mockFetch).toHaveBeenCalledTimes(0);
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(
            null,
            { 'flagsChanged': true, 'isFromServer': false, 'traitsChanged': false },
            {
                'error': null,
                'isFetching': false,
                'isLoading': false,
                'source': 'CACHE',
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
