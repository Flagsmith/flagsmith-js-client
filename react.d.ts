import React, { FC } from 'react';
import { IFlagsmith, IFlagsmithTrait, IFlagsmithFeature, IState, LoadingState } from './types';
export * from './types';
export declare const FlagsmithContext: React.Context<IFlagsmith>;
export declare type FlagsmithContextType<F extends string = string, T extends string = string> = {
    flagsmith: IFlagsmith<F, T>;
    options?: Parameters<IFlagsmith<F, T>['init']>[0];
    serverState?: IState;
    children: React.ReactNode;
};
type UseFlagsReturn<
    F extends string | Record<string, any>,
    T extends string
> = F extends string
    ? {
    [K in F]: IFlagsmithFeature;
} & {
    [K in T]: IFlagsmithTrait;
}
    : {
    [K in keyof F]: IFlagsmithFeature<F[K]>;
} & {
    [K in T]: IFlagsmithTrait;
};
export declare const FlagsmithProvider: FC<FlagsmithContextType>;
export declare function useFlags<
    F extends string | Record<string, any>,
    T extends string = string
>(_flags: readonly (F | keyof F)[], _traits?: readonly T[]): UseFlagsReturn<F, T>;
export declare const useFlagsmith: <F extends string | Record<string, any>,
    T extends string = string>() => IFlagsmith<F, T>;
export declare const useFlagsmithLoading: () => LoadingState | undefined;
