import { IFlagsmithFeature } from '../types';
export declare function useFlags<P extends string>(_flags: readonly P[]): {
    [K in P]: IFlagsmithFeature;
};
