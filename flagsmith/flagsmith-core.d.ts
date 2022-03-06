import { IFlagsmith } from "./types";
declare type Config = {
    fetch?: any;
    AsyncStorage?: any;
};
export default function ({ fetch, AsyncStorage }: Config): IFlagsmith;
export {};
