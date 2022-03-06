import { IFlagsmithTrait, IFlagsmithFeature } from '../types';
export declare function useFlags<F extends string, T extends string>(_flags: readonly F[], _traits?: readonly T[]): {
    [K in F]: IFlagsmithFeature;
} & {
    [K in T]: IFlagsmithTrait;
};
