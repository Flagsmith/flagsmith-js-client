import { removeSemverSuffix } from '../segments/util.js';

export function getCastingFunction(
    traitType: 'boolean' | 'string' | 'number' | 'semver' | any
): CallableFunction {
    switch (traitType) {
        case 'boolean':
            return (x: any) => !['False', 'false'].includes(x);
        case 'number':
            return (x: any) => parseFloat(x);
        case 'semver':
            return (x: any) => removeSemverSuffix(x);
        default:
            return (x: any) => String(x);
    }
}
