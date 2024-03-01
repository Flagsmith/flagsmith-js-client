// Sample test
import { defaultState, getFlagsmith, getStateToCheck } from './test-constants';

describe('Flagsmith.init', () => {

    beforeEach(() => {
        // Avoid mocks, but if you need to add them here
    });
    test('should check cache but not call onChange when empty', async () => {
        // Set up the configuration
        const onChange = jest.fn()
        const {flagsmith,initConfig, AsyncStorage,mockFetch} = getFlagsmith({
            cacheFlags: true,
            onChange
        })
        expect(mockFetch).toHaveBeenCalledTimes(0);
        await flagsmith.init(initConfig);
        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledTimes(1);
    });
    test('should set cache after init', async () => {
        // Set up the configuration
        const onChange = jest.fn()
        const {flagsmith,initConfig, AsyncStorage,mockFetch} = getFlagsmith({
            cacheFlags: true,
            onChange
        })
        await flagsmith.init(initConfig);
        const cache = await AsyncStorage.getItem("BULLET_TRAIN_DB")
        expect(getStateToCheck(JSON.parse(`${cache}`))).toEqual(defaultState)
    });
    test('should call onChange with cache', async () => {
        // Set up the configuration
        const onChange = jest.fn()

        const {flagsmith,initConfig, AsyncStorage,mockFetch} = getFlagsmith({
            cacheFlags: true,
            onChange,
        })
        await AsyncStorage.setItem("BULLET_TRAIN_DB", JSON.stringify(defaultState) )
        await flagsmith.init(initConfig);
        console.log(flagsmith.getAllFlags())
        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledTimes(2);
    });

});
