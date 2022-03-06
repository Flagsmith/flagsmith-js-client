import { FC } from 'react';
import { IFlagsmith, IState } from '../types';
export declare const FlagsmithContext: import("react").Context<IFlagsmith>;
export declare type FlagsmithContextType = {
    flagsmith: IFlagsmith;
    serverState?: IState;
    options: Parameters<IFlagsmith['init']>[0];
};
export declare const FlagsmithProvider: FC<FlagsmithContextType>;
export default FlagsmithProvider;
