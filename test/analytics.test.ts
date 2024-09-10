// Sample test
import {
    defaultState,
    defaultStateAlt,
    getFlagsmith,
    getStateToCheck,
    identityState,
    testIdentity,
} from './test-constants';
import SyncStorageMock from './mocks/sync-storage-mock';

describe('Analytics', () => {

    beforeEach(() => {
        // Avoid mocks, but if you need to add them here
    });
    test('should check cache but not call onChange when empty', async () => {
        const onChange = jest.fn();
        const { flagsmith, initConfig, mockFetch } = getFlagsmith({
            cacheFlags: true,
            enableAnalytics: true,
            onChange,
        });
        await flagsmith.init(initConfig);

    });

});
