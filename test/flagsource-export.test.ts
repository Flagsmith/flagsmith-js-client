import { FlagSource } from '../index';
import { FlagSource as FlagSourceIso } from '../isomorphic';

describe('FlagSource Export', () => {

    test('should export FlagSource enum with all values', () => {
        expect(FlagSource).toBeDefined();
        expect(FlagSource.NONE).toBe('NONE');
        expect(FlagSource.DEFAULT_FLAGS).toBe('DEFAULT_FLAGS');
        expect(FlagSource.CACHE).toBe('CACHE');
        expect(FlagSource.SERVER).toBe('SERVER');
    });

    test('should be usable in runtime value comparisons', () => {
        const source = 'NONE' as string;

        expect(source === FlagSource.NONE).toBe(true);
        expect(source === FlagSource.CACHE).toBe(false);

        const mySource: FlagSource = FlagSource.NONE;
        expect(mySource).toBe('NONE');
    });

    test('should export FlagSource from all entry points', () => {
        expect(FlagSourceIso).toBeDefined();
        expect(FlagSourceIso.NONE).toBe('NONE');
        expect(FlagSource.NONE).toBe(FlagSourceIso.NONE);
    });
});
