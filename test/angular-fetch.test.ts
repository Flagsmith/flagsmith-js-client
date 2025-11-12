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

    it('should handle POST requests correctly', async () => {
        const mockAngularHttpClient = {
            post: jest.fn().mockReturnValue({
                subscribe: (onSuccess: any, onError: any) => {
                    onSuccess({
                        status: 201,
                        body: JSON.stringify({ success: true }),
                        headers: { get: (name: string) => null }
                    });
                }
            })
        };

        const fetchAdapter = angularFetch(mockAngularHttpClient);
        const response: any = await fetchAdapter('https://api.example.com/create', {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({ data: 'test' })
        });

        expect(mockAngularHttpClient.post).toHaveBeenCalledWith(
            'https://api.example.com/create',
            JSON.stringify({ data: 'test' }),
            { headers: { 'Content-Type': 'application/json' }, observe: 'response', responseType: 'text' }
        );
        expect(response.status).toBe(201);
        expect(response.ok).toBe(true);
    });

    it('should handle PUT requests correctly', async () => {
        const mockAngularHttpClient = {
            post: jest.fn().mockReturnValue({
                subscribe: (onSuccess: any, onError: any) => {
                    onSuccess({
                        status: 200,
                        body: JSON.stringify({ updated: true }),
                        headers: { get: (name: string) => null }
                    });
                }
            })
        };

        const fetchAdapter = angularFetch(mockAngularHttpClient);
        const response: any = await fetchAdapter('https://api.example.com/update', {
            headers: { 'Content-Type': 'application/json' },
            method: 'PUT',
            body: JSON.stringify({ data: 'updated' })
        });

        expect(mockAngularHttpClient.post).toHaveBeenCalledWith(
            'https://api.example.com/update',
            JSON.stringify({ data: 'updated' }),
            { headers: { 'Content-Type': 'application/json' }, observe: 'response', responseType: 'text' }
        );
        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);
    });

    it('should retrieve headers correctly', async () => {
        const mockAngularHttpClient = {
            get: jest.fn().mockReturnValue({
                subscribe: (onSuccess: any, onError: any) => {
                    onSuccess({
                        status: 200,
                        body: 'test',
                        headers: {
                            get: (name: string) => {
                                if (name === 'Content-Type') return 'application/json';
                                if (name === 'X-Custom-Header') return 'custom-value';
                                return null;
                            }
                        }
                    });
                }
            })
        };

        const fetchAdapter = angularFetch(mockAngularHttpClient);
        const response: any = await fetchAdapter('https://api.example.com/test', {
            headers: {},
            method: 'GET',
            body: ''
        });

        expect(response.headers.get('Content-Type')).toBe('application/json');
        expect(response.headers.get('X-Custom-Header')).toBe('custom-value');
        expect(response.headers.get('Non-Existent')).toBe(null);
    });

    it('should handle different error status codes correctly', async () => {
        const testCases = [
            { status: 400, expectedOk: false, description: 'Bad Request' },
            { status: 403, expectedOk: false, description: 'Forbidden' },
            { status: 404, expectedOk: false, description: 'Not Found' },
            { status: 500, expectedOk: false, description: 'Internal Server Error' },
            { status: 503, expectedOk: false, description: 'Service Unavailable' }
        ];

        for (const testCase of testCases) {
            const mockAngularHttpClient = {
                get: jest.fn().mockReturnValue({
                    subscribe: (_onSuccess: any, onError: any) => {
                        onError({
                            status: testCase.status,
                            error: testCase.description,
                            headers: { get: (_name: string) => null }
                        });
                    }
                })
            };

            const fetchAdapter = angularFetch(mockAngularHttpClient);
            const response: any = await fetchAdapter('https://api.example.com/test', {
                headers: {},
                method: 'GET',
                body: ''
            });

            expect(response.status).toBe(testCase.status);
            expect(response.ok).toBe(testCase.expectedOk);
            const errorText = await response.text();
            expect(errorText).toBe(testCase.description);
        }
    });

    it('should handle 3xx redirect status codes', async () => {
        const mockAngularHttpClient = {
            get: jest.fn().mockReturnValue({
                subscribe: (onSuccess: any, onError: any) => {
                    onSuccess({
                        status: 301,
                        body: 'Moved Permanently',
                        headers: { get: (name: string) => null }
                    });
                }
            })
        };

        const fetchAdapter = angularFetch(mockAngularHttpClient);
        const response: any = await fetchAdapter('https://api.example.com/redirect', {
            headers: {},
            method: 'GET',
            body: ''
        });

        expect(response.status).toBe(301);
        expect(response.ok).toBe(false); // 3xx should have ok: false
    });

    it('should use fallback status codes when status is missing', async () => {
        // Test success case without status
        const mockSuccessClient = {
            get: jest.fn().mockReturnValue({
                subscribe: (onSuccess: any, _onError: any) => {
                    onSuccess({
                        body: 'success',
                        headers: { get: (name: string) => null }
                    });
                }
            })
        };

        const fetchAdapter1 = angularFetch(mockSuccessClient);
        const response1: any = await fetchAdapter1('https://api.example.com/test', {
            headers: {},
            method: 'GET',
            body: ''
        });

        expect(response1.status).toBe(200); // Defaults to 200 for success
        expect(response1.ok).toBe(true);

        // Test error case without status
        const mockErrorClient = {
            get: jest.fn().mockReturnValue({
                subscribe: (_onSuccess: any, onError: any) => {
                    onError({
                        message: 'Network error',
                        headers: { get: (name: string) => null }
                    });
                }
            })
        };

        const fetchAdapter2 = angularFetch(mockErrorClient);
        const response2: any = await fetchAdapter2('https://api.example.com/test', {
            headers: {},
            method: 'GET',
            body: ''
        });

        expect(response2.status).toBe(500); // Defaults to 500 for errors
        expect(response2.ok).toBe(false);
    });

    it('should use fallback error messages when error and message are missing', async () => {
        const mockAngularHttpClient = {
            get: jest.fn().mockReturnValue({
                subscribe: (_onSuccess: any, onError: any) => {
                    onError({
                        status: 500,
                        headers: { get: (_name: string) => null }
                    });
                }
            })
        };

        const fetchAdapter = angularFetch(mockAngularHttpClient);
        const response: any = await fetchAdapter('https://api.example.com/test', {
            headers: {},
            method: 'GET',
            body: ''
        });

        const errorText = await response.text();
        expect(errorText).toBe(''); // Falls back to empty string
    });

    it('should handle unsupported HTTP methods with 405 status', async () => {
        const mockAngularHttpClient = {
            get: jest.fn(),
            post: jest.fn(),
            put: jest.fn()
        };

        const fetchAdapter = angularFetch(mockAngularHttpClient);
        const response: any = await fetchAdapter('https://api.example.com/test', {
            headers: {},
            method: 'DELETE' as any, // Using unsupported method
            body: ''
        });

        expect(response.status).toBe(405);
        expect(response.ok).toBe(false);
        const errorText = await response.text();
        expect(errorText).toContain('Unsupported method');
        expect(errorText).toContain('DELETE');
    });
});
