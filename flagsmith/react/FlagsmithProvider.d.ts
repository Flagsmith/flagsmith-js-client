import { FC } from 'react';
import { IFlagsmith, IState } from '../';
export declare const FlagsmithContext: any;
export declare type FlagsmithContextType = {
    flagsmith: IFlagsmith;
    serverState?: IState;
    options: Parameters<IFlagsmith['init']>[0];
};
export declare const FlagsmithProvider: FC<FlagsmithContextType>;
export default FlagsmithProvider;
