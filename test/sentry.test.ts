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
        const addFeatureFlag = jest.fn();
        const integration = { addFeatureFlag };
        const client = {
            getIntegrationByName: jest.fn().mockReturnValue(integration),
        };
        await flagsmith.init({...initConfig, sentryClient: client});
        flagsmith.hasFeature("zero")
        flagsmith.hasFeature("hero")
        expect(addFeatureFlag).toHaveBeenCalledWith('zero', false);
        expect(addFeatureFlag).toHaveBeenCalledWith('hero', true);
    });
});
