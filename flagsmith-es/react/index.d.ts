import React, { FC } from 'react';
import { IFlagsmith, IFlagsmithTrait, IFlagsmithFeature, IState } from '../types';
export declare const FlagsmithContext: React.Context<IFlagsmith>;
export declare type FlagsmithContextType = {
    flagsmith: IFlagsmith;
    options?: Parameters<IFlagsmith['init']>[0];
    serverState?: IState;
    children: React.ReactElement[] | React.ReactElement;
};
export declare const FlagsmithProvider: FC<FlagsmithContextType>;
export declare function useFlags<F extends string, T extends string>(_flags: readonly F[], _traits?: readonly T[]): {
    [K in F]: IFlagsmithFeature;
} & {
    [K in T]: IFlagsmithTrait;
};
export declare const useFlagsmith: () => IFlagsmith;
