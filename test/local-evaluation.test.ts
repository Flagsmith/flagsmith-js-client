import { getFlagsmith } from './test-constants';
import { promises as fs } from 'fs';

describe('Local Evaluation', () => {
    let mockEnvironmentDocument: any;

    beforeEach(async () => {
        // Load the environment document fixture from the Node.js SDK
        const envDocPath = './node_modules/flagsmith-nodejs/tests/sdk/data/environment.json';
        const envDocText = await fs.readFile(envDocPath, 'utf8');
        mockEnvironmentDocument = JSON.parse(envDocText);
    });

    test('should initialize with preloaded environment document', async () => {
        const { flagsmith, initConfig } = getFlagsmith({
            enableLocalEvaluation: true,
            environmentDocument: mockEnvironmentDocument,
        });

        await flagsmith.init(initConfig);

        expect((flagsmith as any).useLocalEvaluation).toBe(true);
        expect((flagsmith as any).environmentDocument).toEqual(mockEnvironmentDocument);
    });

    test('should evaluate flags locally without API calls', async () => {
        const onChange = jest.fn();
        const { flagsmith, initConfig, mockFetch } = getFlagsmith({
            enableLocalEvaluation: true,
            environmentDocument: mockEnvironmentDocument,
            onChange,
        });

        await flagsmith.init(initConfig);

        // Init should not make any fetch calls with preloaded document
        expect(mockFetch).toHaveBeenCalledTimes(0);

        // Get flags should evaluate locally
        await flagsmith.getFlags();

        // Still no API calls
        expect(mockFetch).toHaveBeenCalledTimes(0);

        // Should have flags from local evaluation
        expect((flagsmith as any).flags).toBeDefined();
        expect(Object.keys((flagsmith as any).flags).length).toBeGreaterThan(0);
    });

    test('should evaluate flags for environment without identity', async () => {
        const onChange = jest.fn();
        const { flagsmith, initConfig } = getFlagsmith({
            enableLocalEvaluation: true,
            environmentDocument: mockEnvironmentDocument,
            onChange,
        });

        await flagsmith.init(initConfig);
        await flagsmith.getFlags();

        // Should have the 'some_feature' flag from environment document
        expect((flagsmith as any).flags['some_feature']).toBeDefined();
        expect((flagsmith as any).flags['some_feature'].enabled).toBe(true);
        expect((flagsmith as any).flags['some_feature'].value).toBe('some-value');
    });

    test('should handle identity context in local evaluation', async () => {
        const onChange = jest.fn();
        const { flagsmith, initConfig } = getFlagsmith({
            enableLocalEvaluation: true,
            environmentDocument: mockEnvironmentDocument,
            onChange,
        });

        await flagsmith.init(initConfig);

        // Identify a user
        await flagsmith.identify('test-user', { age: 25 } as any);

        // Should have evaluated flags with identity context
        expect((flagsmith as any).flags).toBeDefined();
        expect(Object.keys((flagsmith as any).flags).length).toBeGreaterThan(0);
    });

    test('should fetch environment document if not preloaded', async () => {
        const onChange = jest.fn();
        const { flagsmith, initConfig, mockFetch } = getFlagsmith({
            enableLocalEvaluation: true,
            serverAPIKey: 'ser.test_key',
            onChange,
        });

        // Mock the environment document fetch
        mockFetch.mockResolvedValueOnce({
            status: 200,
            text: () => Promise.resolve(JSON.stringify(mockEnvironmentDocument)),
        });

        await flagsmith.init(initConfig);

        // Should have fetched the environment document
        expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('environment-document'),
            expect.objectContaining({
                method: 'GET',
                headers: expect.objectContaining({
                    'X-Environment-Key': 'ser.test_key',
                }),
            })
        );

        expect((flagsmith as any).environmentDocument).toEqual(mockEnvironmentDocument);
    });

    test('should handle errors during local evaluation gracefully', async () => {
        const onError = jest.fn();
        const { flagsmith, initConfig } = getFlagsmith({
            enableLocalEvaluation: true,
            // Invalid document - missing required fields
            environmentDocument: { invalid: true },
            onError,
        });

        await flagsmith.init(initConfig);

        // Should catch and handle errors
        await expect(flagsmith.getFlags()).rejects.toThrow();
        expect(onError).toHaveBeenCalled();
    });

    test('should lazy load engine modules when local evaluation is enabled', async () => {
        const { flagsmith, initConfig } = getFlagsmith({
            enableLocalEvaluation: true,
            environmentDocument: mockEnvironmentDocument,
        });

        // Init should trigger lazy load
        await flagsmith.init(initConfig);

        // Engine should now be available
        expect((flagsmith as any).useLocalEvaluation).toBe(true);

        // And local evaluation should work
        await flagsmith.getFlags();
        const flags = flagsmith.getAllFlags();
        expect(flags).toBeDefined();
        expect(Object.keys(flags).length).toBeGreaterThan(0);
    });

    test('should not use local evaluation when disabled', async () => {
        const { flagsmith, initConfig, mockFetch } = getFlagsmith({
            enableLocalEvaluation: false,
        });

        mockFetch.mockResolvedValueOnce({
            status: 200,
            text: () => fs.readFile('./test/data/flags.json', 'utf8'),
        });

        await flagsmith.init(initConfig);

        // Should use remote evaluation and make API call
        expect(mockFetch).toHaveBeenCalled();
        expect((flagsmith as any).useLocalEvaluation).toBe(false);
    });
});
