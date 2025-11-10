import angularFetch from '../utils/angular-fetch';
import { createFlagsmithInstance } from '../lib/flagsmith';
import MockAsyncStorage from './mocks/async-storage-mock';
import { environmentID } from './test-constants';
import { promises as fs } from 'fs';

describe('Angular HttpClient Fetch Adapter', () => {
    it('should return response with status property', async () => {
        const mockAngularHttpClient = {
            get: jest.fn().mockReturnValue({
                subscribe: (onSuccess: any, onError: any) => {
                    onSuccess({
                        status: 200,
                        body: JSON.stringify({ flags: [] }),
                        headers: { get: (name: string) => null }
                    });
                }
            })
        };

        const fetchAdapter = angularFetch(mockAngularHttpClient);
        const response: any = await fetchAdapter('https://api.example.com/flags', {
            headers: { 'Content-Type': 'application/json' },
            method: 'GET',
            body: ''
        });

        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);
    });

    it('should handle errors with status property and proper error messages', async () => {
        const mockAngularHttpClient = {
            get: jest.fn().mockReturnValue({
                subscribe: (onSuccess: any, onError: any) => {
                    onError({
                        status: 401,
                        error: 'Unauthorized',
                        headers: { get: (name: string) => null }
                    });
                }
            })
        };

        const fetchAdapter = angularFetch(mockAngularHttpClient);
        const response: any = await fetchAdapter('https://api.example.com/flags', {
            headers: { 'Content-Type': 'application/json' },
            method: 'GET',
            body: ''
        });

        expect(response.status).toBe(401);
        expect(response.ok).toBe(false);

        const errorText = await response.text();
        expect(errorText).toBe('Unauthorized');
    });

    it('should initialize Flagsmith successfully with Angular HttpClient', async () => {
        const mockAngularHttpClient = {
            get: jest.fn().mockReturnValue({
                subscribe: async (onSuccess: any) => {
                    const body = await fs.readFile('./test/data/flags.json', 'utf8');
                    onSuccess({
                        status: 200,
                        body,
                        headers: { get: (name: string) => null }
                    });
                }
            })
        };

        const flagsmith = createFlagsmithInstance();
        const fetchAdapter = angularFetch(mockAngularHttpClient);
        const AsyncStorage = new MockAsyncStorage();

        // @ts-ignore
        flagsmith.canUseStorage = true;

        await expect(
            flagsmith.init({
                evaluationContext: { environment: { apiKey: environmentID } },
                fetch: fetchAdapter,
                AsyncStorage
            })
        ).resolves.not.toThrow();

        expect(flagsmith.hasFeature('hero')).toBe(true);
    });
});
