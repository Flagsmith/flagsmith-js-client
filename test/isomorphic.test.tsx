import flagsmithIsomorphic from '../lib/flagsmith/isomorphic';
import { getFlagsmith } from './test-constants';

describe('Flagsmith Isomorphic Import', () => {
    test('flagsmith is imported correctly', () => {
        const { initConfig } = getFlagsmith({});
        flagsmithIsomorphic.init(initConfig)
    })
})