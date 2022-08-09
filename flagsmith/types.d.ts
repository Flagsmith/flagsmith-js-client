export interface IFlagsmithFeature {
    enabled: boolean;
    value?: string | number | boolean;
}
export declare type IFlagsmithTrait = string | number | boolean;

export type IFlags<F extends string = string> = Record<F, IFlagsmithFeature>;

export type ITraits<T extends string = string> = Record<T, IFlagsmithTrait>;

export interface IRetrieveInfo {
    isFromServer: boolean;
    flagsChanged: boolean;
    traitsChanged: boolean;
}
export interface IState<F extends string = string, T extends string = string> {
    api: string;
    environmentID: string;
    flags?: IFlags<F>;
    identity?: string;
    traits: ITraits<T>;
}
declare type ICacheOptions = {
    ttl?: number;
    skipAPI?: boolean;
};
export interface IInitConfig<F extends string = string, T extends string = string> {
    AsyncStorage?: any;
    api?: string;
    cacheFlags?: boolean;
    cacheOptions?: ICacheOptions;
    defaultFlags?: Partial<IFlags<F>>;
    fetch?: any;
    enableAnalytics?: boolean;
    enableDynatrace?: boolean;
    enableLogs?: boolean;
    angularHttpClient?: any;
    environmentID: string;
    headers?: object;
    identity?: string;
    traits?: ITraits<T>;
    onChange?: (previousFlags: IFlags<F>, params: IRetrieveInfo) => void;
    onError?: (res: {
        message: string;
    }) => void;
    preventFetch?: boolean;
    state?: IState;
    _trigger?: () => void;
}
export interface IFlagsmith<F extends string = string, T extends string = string> {
    /**
     * Initialise the sdk against a particular environment
     */
    init: (config: IInitConfig<F, T>) => Promise<void>;
    /**
     * Trigger a manual fetch of the environment features
     */
    getFlags: () => Promise<null>;
    /**
     * Returns the current flags
     */
    getAllFlags: () => IFlags<F>;
    /**
     * Identify user, triggers a call to get flags if flagsmith.init has been called
     */
    identify: (userId: string, traits?: Record<string, string | number | boolean>) => Promise<void>;
    /**
     * Retrieves the current state of flagsmith
     */
    getState: () => IState;
    /**
     * Set the current state of flagsmith
     */
    setState: (state: IState) => void;
    /**
     * Clears the identity, triggers a call to getFlags
     */
    logout: () => Promise<null>;
    /**
     * Polls the flagsmith API, specify interval in ms
     */
    startListening: (interval?: number) => void;
    /**
     * Stops polling
     */
    stopListening: () => void;
    /**
     * Get the whether a flag is enabled e.g. flagsmith.hasFeature("powerUserFeature")
     */
    hasFeature: (key: F) => boolean;
    /**
     * Get the value of a particular remote config e.g. flagsmith.getValue("font_size")
     */
    getValue: (key: F) => string | number | boolean;
    /**
     * Get the value of a particular trait for the identified user
     */
    getTrait: (key: T) => string | number | boolean;
    /**
     * Set a specific trait for a given user id, triggers a call to get flags
     */
    setTrait: (key: T, value: string | number | boolean) => Promise<null>;
    /**
     * Set a key value set of traits for a given user, triggers a call to get flags
     */
    setTraits: (traits: Record<T, string | number | boolean>) => Promise<null>;
    /**
     * The stored identity of the user
     */
    identity?: string;
    /**
     * Whether the flagsmith SDK is initialised
     */
    initialised?: boolean;
    /**
     * Used internally, this function will callback separately to onChange whenever flags are updated
     */
    trigger?: () => {};
    cacheOptions: {
        ttl: number;
        skipAPI: boolean;
    };
}
export {};
