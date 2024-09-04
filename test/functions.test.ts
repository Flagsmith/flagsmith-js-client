// Sample test
import { defaultState, getFlagsmith, getStateToCheck, identityState } from './test-constants';

describe.only('Flagsmith.functions', () => {

    beforeEach(() => {
        // Avoid mocks, but if you need to add them here
    });
    test('should use a fallback when the feature is undefined', async () => {
        const onChange = jest.fn()
        const {flagsmith,initConfig, AsyncStorage,mockFetch} = getFlagsmith({onChange})
        await flagsmith.init(initConfig);

        expect(flagsmith.getValue("deleted_feature",{fallback:"foo"})).toBe("foo");
        expect(flagsmith.hasFeature("deleted_feature",{fallback:true})).toBe(true);
        expect(flagsmith.hasFeature("deleted_feature",{fallback:false})).toBe(false);
        expect(flagsmith.hasFeature("font_size",{fallback:false})).toBe(true);
        expect(flagsmith.getValue("font_size",{fallback:100})).toBe(16);
        expect(flagsmith.getValue("font_size")).toBe(16);
        expect(flagsmith.hasFeature("font_size")).toBe(true);
    })
});
