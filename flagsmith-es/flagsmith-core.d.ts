import { IFlagsmith } from "./types";
declare type Config = {
    fetch?: any;
    AsyncStorage?: any;
    eventSource?: any;
};
export default function ({ fetch, AsyncStorage, eventSource }: Config): IFlagsmith;
export {};
