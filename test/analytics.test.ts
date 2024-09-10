// Sample test
import { getFlagsmith, getMockFetchWithValue, testIdentity } from './test-constants';

describe.only('Analytics', () => {

    beforeEach(() => {
        jest.useFakeTimers(); // Mocked to allow time to pass for analytics flush
    });
    afterEach(() => {
        jest.useRealTimers();
    });
    test('should not attempt to track events when split testing is disabled', async () => {
        const { flagsmith } = getFlagsmith({
            cacheFlags: true,
            identity: testIdentity,
            enableAnalytics: true,
            splitTestingAnalytics: false, // Disable split testing
        });

        await expect(flagsmith.trackEvent("checkout"))
            .rejects.toThrow('This feature is only enabled for self-hosted customers using split testing.');
    });
    test('should track v1 analytics', async () => {
        const onChange = jest.fn();
        const fetchFn = getMockFetchWithValue({
            flags:[{feature:{name:"font_size"}, enabled: true}, {feature:{name:"off_value"}, enabled: false}],
        });
        const { flagsmith, initConfig, mockFetch } = getFlagsmith({
            cacheFlags: true,
            identity: testIdentity,
            enableAnalytics: true,
            onChange,
        }, fetchFn);
        await flagsmith.init(initConfig);
        flagsmith.getValue("font_size")
        flagsmith.hasFeature("off_value")
        flagsmith.hasFeature("off_value")
        jest.advanceTimersByTime(10000);
        expect(mockFetch).toHaveBeenCalledWith(
            `${flagsmith.api}analytics/flags/`,
            {
                method: 'POST',
                body: JSON.stringify({
                    font_size: 1,
                    off_value: 2,
                }),
                cache: 'no-cache',
                headers: {
                    'x-environment-key': flagsmith.environmentID,
                    'Content-Type': 'application/json; charset=utf-8',
                },
            },
        );
    });
    test('should track conversion events when trackEvent is called', async () => {
        const onChange = jest.fn();
        const fetchFn = getMockFetchWithValue({
            flags:[{feature:{name:"font_size"}, enabled: true}, {feature:{name:"off_value"}, enabled: false}],
        });
        const { flagsmith, initConfig, mockFetch } = getFlagsmith({
            cacheFlags: true,
            identity: testIdentity,
            enableAnalytics: true,
            splitTestingAnalytics: true,
            onChange,
        }, fetchFn);
        await flagsmith.init(initConfig);
        flagsmith.getValue("font_size")
        flagsmith.hasFeature("off_value")
        flagsmith.hasFeature("off_value")
        await flagsmith.trackEvent('checkout');

        expect(mockFetch).toHaveBeenCalledWith(
            `${flagsmith.api}split-testing/conversion-events/`,
            {
                method: 'POST',
                body: JSON.stringify({
                    identity_identifier: testIdentity,
                    type: 'checkout',
                }),
                cache: 'no-cache',
                headers: {
                    'x-environment-key': flagsmith.environmentID,
                    'Content-Type': 'application/json; charset=utf-8',
                },
            },
        );
        expect(mockFetch).toHaveBeenCalledWith(
            `${flagsmith.api.replace('/v1/', '/v2/')}analytics/flags/`,
            {
                method: 'POST',
                body: JSON.stringify({
                    "evaluations": [
                        {
                            "feature_name": "font_size",
                            "identity_identifier": "test_identity",
                            "count": 1,
                            "enabled_when_evaluated": true
                        },
                        {
                            "feature_name": "off_value",
                            "identity_identifier": "test_identity",
                            "count": 2,
                            "enabled_when_evaluated": false
                        }
                    ]
                }),
                cache: 'no-cache',
                headers: {
                    'x-environment-key': flagsmith.environmentID,
                    'Content-Type': 'application/json; charset=utf-8',
                },
            },
        );
    });
});
