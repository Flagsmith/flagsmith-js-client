import { IFlagsmith } from './types';
export declare type LikeFetch = (input: Partial<RequestInfo>, init?: Partial<RequestInit>) => Promise<Partial<Response>>;
declare type AsyncStorageType = {
    getItem: (key: string, cb?: (err: string | null, res: string | null) => void) => Promise<string | null>;
    setItem: (key: string, value: string) => Promise<string | null>;
    deleteItem: (key: string) => Promise<string | null>;
} | null;
declare type Config = {
    fetch?: LikeFetch;
    AsyncStorage?: AsyncStorageType;
    eventSource?: any;
};
export default function ({ fetch, AsyncStorage, eventSource }: Config): IFlagsmith;
export {};
