import { IFlagsmith } from './types';
declare const flagsmith: IFlagsmith;
export default flagsmith;
export * from './types';
export declare const createFlagsmithInstance: <
    F extends string = string,
    T extends string = string,
    >() => IFlagsmith<F, T>;
