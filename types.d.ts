import { EvaluationContext, TraitEvaluationContext } from "./evaluation-context";

type IFlagsmithValue<T = string | number | boolean | null> = T

export type DynatraceObject = {
    "javaLongOrObject": Record<string, number>,
    "date": Record<string, Date>,
    "shortString": Record<string, string>,
    "javaDouble": Record<string, number>,
}
export interface IFlagsmithFeature {
    id?: number;
    enabled: boolean;
    value?: IFlagsmithValue;
}

export declare type IFlagsmithTrait = IFlagsmithValue | TraitEvaluationContext;
export declare type IFlags<F extends string = string> = Record<F, IFlagsmithFeature>;
export declare type ITraits<T extends string = string> = Record<T, IFlagsmithTrait>;
export declare type Traits<T extends string = string> = Record<T, TraitEvaluationContext | null>;

export declare type GetValueOptions<T = Array<any> | object> = {
    json?: boolean;
    fallback?: T
}


export declare type IIdentity<T = string> = T;

export interface IRetrieveInfo {
    isFromServer: boolean;
    flagsChanged: string[] | null;
    traitsChanged: string[] | null;
}

export interface IState<F extends string = string> {
    api: string;
    flags?: IFlags<F>;
    evaluationContext?: EvaluationContext;
    evaluationEvent?: Record<string, Record<string, number>> | null;
    ts?: number;
}

declare type ICacheOptions = {
    ttl?: number;
    skipAPI?: boolean;
};

export declare type IDatadogRum = {
    trackTraits: boolean
    client: {
        setUser: (newUser: {
            [x: string]: unknown
        }) => void;
        getUser: () => {
            [x: string]: unknown
        };
        [extraProps: string]: any
    }
}

export declare enum FlagSource {
    "NONE" = "NONE",
    "DEFAULT_FLAGS" = "DEFAULT_FLAGS",
    "CACHE" = "CACHE",
    "SERVER" = "SERVER",
}

export declare type LoadingState = {
    error: Error | null, // Current error, resets on next attempt to fetch flags
    isFetching: boolean, // Whether there is a current request to fetch server flags
    isLoading: boolean,  // Whether any flag data exists
    source: FlagSource //Indicates freshness of flags
}

export type OnChange<F extends string = string> = (previousFlags: IFlags<F> | null, params: IRetrieveInfo, loadingState:LoadingState) => void
export interface IInitConfig<F extends string = string, T extends string = string> {
    AsyncStorage?: any;
    api?: string;
    evaluationContext: EvaluationContext;
    cacheFlags?: boolean;
    cacheOptions?: ICacheOptions;
    datadogRum?: IDatadogRum;
    defaultFlags?: IFlags<F>;
    fetch?: any;
    realtime?: boolean;
    eventSourceUrl?: string;
    enableAnalytics?: boolean;
    enableDynatrace?: boolean;
    enableLogs?: boolean;
    angularHttpClient?: any;
    /**
     * @deprecated in favour of `evaluationContext.environment.apiKey`.
     */
    environmentID?: string;
    headers?: object;
    /**
    * @deprecated in favour of `evaluationContext.identity`.
    */
    identity?: IIdentity;
    /**
    * @deprecated in favour of `evaluationContext.identity.traits`.
    */
    traits?: ITraits<T>;
    onChange?: OnChange<F>;
    onError?: (err: Error) => void;
    preventFetch?: boolean;
    state?: IState;
    _trigger?: () => void;
    _triggerLoadingState?: () => void;
}

export interface IFlagsmithResponse {
    identifier?: string,
    traits?: {
        trait_key: string;
        trait_value: IFlagsmithValue;
        transient?: boolean;
    }[];
    flags?: {
        enabled: boolean;
        feature_state_value: IFlagsmithValue;
        feature: {
            id: number;
            name: string;
        };
    }[];
}

export interface IFlagsmith<F extends string = string, T extends string = string> {
    /**
     * Initialise the sdk against a particular environment
     */
    init: (config: IInitConfig<F, T>) => Promise<void>;
    /**
     * Set evaluation context. Refresh the flags.
     */
    setContext: (context: EvaluationContext) => Promise<void>;
    /**
     * Get current context.
     */
    getContext: () => EvaluationContext;
    /**
     * Trigger a manual fetch of the environment features
     */
    getFlags: () => Promise<void>;
    /**
     * Returns the current flags
     */
    getAllFlags: () => IFlags<F>;
    /**
     * Identify user, triggers a call to get flags if `flagsmith.init` has been called
     * @deprecated in favour of `setContext`.
     */
    identify: (userId: string, traits?: Record<T, IFlagsmithValue>) => Promise<void>;
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
    logout: () => Promise<void>;
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
    getValue<T = IFlagsmithValue>(key: F, options?: GetValueOptions<T>): IFlagsmithValue<T>;

    /**
     * Get the value of a particular trait for the identified user
     */
    getTrait: (key: T) => IFlagsmithValue;
    /**
     * Get the values of all traits for the identified user
     */
    getAllTraits: () => Record<string, IFlagsmithValue>;
    /**
     * Set a specific trait for a given user id, triggers a call to get flags
     * @deprecated in favour of `setContext`.
    */
    setTrait: (key: T, value: IFlagsmithValue) => Promise<void>;
    /**
     * Set a key value set of traits for a given user, triggers a call to get flags
     * @deprecated in favour of `setContext`.
     */
    setTraits: (traits: Record<T, IFlagsmithValue>) => Promise<void>;
    /**
     * The stored identity of the user
     * @deprecated in favour of `getContext()?.identity?.identifier`
     */
    identity?: IIdentity;
    /**
     * Whether the flagsmith SDK is initialised
     */
    initialised?: boolean;

    /**
     * Returns ths current loading state
     */
    loadingState?: LoadingState;

    /**
     * Used internally, this function will callback separately to onChange whenever flags are updated
     */
    _trigger?: () => void;
    /**
     * Used internally, this function will trigger the useFlagsmithLoading hook when loading state changes
     */
    _triggerLoadingState?: () => void;
    /**
     * Used internally, this is the cache options provided in flagsmith.init
     */
    cacheOptions: {
        ttl: number;
        skipAPI: boolean;
    };
    /**
     * Used internally, this is the api provided in flagsmith.init, defaults to our production API
     */
    api: string
}

export {};
