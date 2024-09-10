// Sample test
import { getFlagsmith, testIdentity } from './test-constants';

describe('Analytics', () => {

    beforeEach(() => {
        // Avoid mocks, but if you need to add them here
    });
    test('should track analytics when trackEvent is called', async () => {
        const onChange = jest.fn();
        const { flagsmith, initConfig, mockFetch } = getFlagsmith({
            cacheFlags: true,
            identity: testIdentity,
            enableAnalytics: true,
            onChange,
        });
        await flagsmith.init(initConfig);
        await flagsmith.trackEvent('checkout');
        flagsmith.getValue("font_size")
        flagsmith.hasFeature("off_value")
        flagsmith.hasFeature("off_value")
        expect(mockFetch).toHaveBeenCalledWith(
            `${flagsmith.api.replace('/v1/', '/v2/')}analytics/flags/`,
            {
                method: 'POST',
                body: JSON.stringify({
                    'evaluations': [{
                        'feature_name': 'font_size',
                        'identity_identifier': testIdentity,
                        'count': 1,
                        'enabled_when_evaluated': true,
                    },{
                        'feature_name': 'off_value',
                        'identity_identifier': testIdentity,
                        'count': 2,
                        'enabled_when_evaluated': false,
                    }],
                }),
                cache: 'no-cache',
                headers: {
                    'x-environment-key': flagsmith.environmentID,
                    'Content-Type': 'application/json; charset=utf-8',
                },
            },
        );

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

    });

});
