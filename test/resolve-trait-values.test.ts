import { resolveTraitValues } from '../utils/types';

describe('resolveTraitValues', () => {
    test('resolves envelope traits to plain key/value', () => {
        const result = resolveTraitValues({
            plan: { value: 'premium' },
            age: { value: 42, transient: true },
        });
        expect(result).toEqual({ plan: 'premium', age: 42 });
    });

    test('passes through already-plain values', () => {
        expect(resolveTraitValues({ plan: 'premium' } as any)).toEqual({ plan: 'premium' });
    });

    test('returns null for empty object', () => {
        expect(resolveTraitValues({})).toBeNull();
    });

    test('returns null for null/undefined', () => {
        expect(resolveTraitValues(null)).toBeNull();
        expect(resolveTraitValues(undefined)).toBeNull();
    });

    test('drops null trait entries', () => {
        expect(resolveTraitValues({ a: { value: 1 }, b: null })).toEqual({ a: 1 });
    });
});
