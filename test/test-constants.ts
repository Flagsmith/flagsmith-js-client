import { IInitConfig, IState } from '../lib/flagsmith/types';
import MockAsyncStorage from './mocks/async-storage-mock';
import { createFlagsmithInstance } from '../lib/flagsmith';
import { promises as fs } from 'fs';
export const environmentID = 'QjgYur4LQTwe5HpvbvhpzK'; // Flagsmith Demo Projects
export const FLAGSMITH_KEY = 'FLAGSMITH_DB' + "_" + environmentID;
export const defaultState = {
    api: 'https://edge.api.flagsmith.com/api/v1/',
    evaluationContext: {
        environment: {apiKey: environmentID},
    },
    flags: {
        hero: {
            id: 1804,
            enabled: true,
            value: 'https://s3-us-west-2.amazonaws.com/com.uppercut.hero-images/assets/0466/comps/466_03314.jpg',
        },
        font_size: { id: 6149, enabled: true, value: 16 },
        json_value: { id: 80317, enabled: true, value: '{"title":"Hello World"}' },
        number_value: { id: 80318, enabled: true, value: 1 },
        off_value: { id: 80319, enabled: false, value: null },
    },
};

export const testIdentity = 'test_identity'
export const identityState = {
    api: 'https://edge.api.flagsmith.com/api/v1/',
    evaluationContext: {
        environment: {apiKey: environmentID},
        identity: {
            identifier: testIdentity,
            traits: {
                string_trait: {value: 'Example'},
                number_trait: {value: 1},
            }
        }
    },
    flags: {
        hero: {
            id: 1804,
            enabled: true,
            value: 'https://s3-us-west-2.amazonaws.com/com.uppercut.hero-images/assets/0466/comps/466_03314.jpg'
        },
        font_size: { id: 6149, enabled: true, value: 16 },
        json_value: { id: 80317, enabled: true, value: '{"title":"Hello World"}' },
        number_value: { id: 80318, enabled: true, value: 1 },
        off_value: { id: 80319, enabled: false, value: null },
    },
};
export const defaultStateAlt = {
    ...defaultState,
    flags: {
        'example': {
            'id': 1,
            'enabled': true,
            'value': 'a',
        },
    },
};

export function getStateToCheck(_state: IState) {
    const state = {
        ..._state,
    };
    delete state.evaluationEvent;
    // @ts-ignore internal property
    delete state.ts;
    return state;
}

export function getFlagsmith(config: Partial<IInitConfig> = {}, _mockFetch?:any) {
    const flagsmith = createFlagsmithInstance();
    const AsyncStorage = new MockAsyncStorage();
    const mockFetch = _mockFetch||jest.fn(async (url, options) => {
        switch (url) {
            case 'https://edge.api.flagsmith.com/api/v1/flags/':
                return {status: 200, text: () => fs.readFile('./test/data/flags.json', 'utf8')}
            case 'https://edge.api.flagsmith.com/api/v1/identities/?identifier=' + testIdentity:
                return {status: 200, text: () => fs.readFile(`./test/data/identities_${testIdentity}.json`, 'utf8')}
        }

        throw new Error('Please mock the call to ' + url)
    });

    //@ts-ignore, we want to test storage even though flagsmith thinks there is none
    flagsmith.canUseStorage = true;
    const initConfig: IInitConfig = {
        AsyncStorage,
        fetch: mockFetch,
        ...config,
    };
    initConfig.evaluationContext = {
        environment: {apiKey: environmentID},
        ...config?.evaluationContext,
    }
    return { flagsmith, initConfig, mockFetch, AsyncStorage };
}
export const delay = (ms:number) => new Promise((resolve) => setTimeout(resolve, ms));
export function getMockFetchWithValue(resolvedValue:object, status=200) {
    return jest.fn(() =>
        Promise.resolve({
            status,
            text: () => Promise.resolve(JSON.stringify(resolvedValue)), // Mock json() to return the mock response
            json: () => Promise.resolve(resolvedValue), // Mock json() to return the mock response
        })
    );
}
