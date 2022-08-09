export interface IFlagsmithFeature {
    enabled: boolean;
    value?: string | number | boolean;
}

export declare type IFlagsmithTrait = string | number | boolean;

/*
    example: {hero:{enabled:true, value:"blue"}, myCoolFeature:{enabled:true}}
*/
export type IFlags<F extends string = string> = Record<F, IFlagsmithFeature>;

/*
    example: {favourite_color: "blue", age: 21}
*/
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
    ttl?: number;// how long to persist the cache in ms (defaults to 0 which is infinite)
    /*
    If this is true and there's cache available, it will skip hitting the API as if preventFetch was true
    Note: this is just for flagsmith.init(), Calls to identify, getFlags etc will still hit the API regardless
    */
    skipAPI?: boolean;
};

export interface IInitConfig<F extends string = string, T extends string = string> {
    AsyncStorage?: any; // an AsyncStorage implementation
    api?: string; // the api you wish to use, important if self hosting
    cacheFlags?: boolean // whether to local storage flags, needs AsyncStorage defined
    cacheOptions?: ICacheOptions // A ttl in ms (default to 0 which is infinite) and option to skip hitting the API in flagsmith.init if there's cache available.
    defaultFlags?: Partial<IFlags<F>>; // Default flags to provide { font_size: { enabled: true, value: 12 } }
    fetch?: any // A Custom fetch implementation. Note: this has to resolve with the same types as standard fetch
    enableAnalytics?: boolean // Enable sending flag analytics for getValue and hasFeature evaluations.
    enableDynatrace?: boolean // Enables the Dynatrace RUM integration
    enableLogs?: boolean // whether to enable logs
    angularHttpClient?: any // an angular http client to support ssr
    environmentID: string // your Flagsmith environment id
    headers?: object // pass custom headers for flagsmith api calls
    identity?: string // Initialise with a given identity
    traits?: ITraits<T>; // Initialise with a given set of traits
    onChange?: (previousFlags: IFlags<F>, params: IRetrieveInfo) => void; // triggered when the flags are retrieved
    onError?: (res: {
        message: string;
    }) => void; // triggered if there was an api error
    preventFetch?: boolean // whether to prevent fetching flags on init
    state?: IState // set a predefined state, useful for isomorphic applications
    _trigger?: ()=>void // Used internally, this function will callback separately to onChange whenever flags are updated
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
    /**
     * Used internally, this is the cache options provided in flagsmith.init
     */
    cacheOptions: {
        ttl: number;
        skipAPI: boolean;
    };
}
