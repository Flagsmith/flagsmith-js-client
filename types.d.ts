import { EvaluationContext, IdentityEvaluationContext, TraitEvaluationContext } from "./evaluation-context";

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

export interface ClientIdentityEvaluationContext extends Omit<IdentityEvaluationContext, "traits"> {
    traits?:     null | ITraits;
}
export interface ClientEvaluationContext extends Omit<EvaluationContext, "identity"> {
    identity?: null | ClientIdentityEvaluationContext;
}

export declare type GetValueOptions<T = Array<any> | object> = {
    skipAnalytics?: boolean
    json?: boolean
    fallback?: T
}

export declare type HasFeatureOptions = {
    skipAnalytics?: boolean
    fallback?: boolean
} | boolean


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
    storageKey?: string;
    loadStale?: boolean;
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
    evaluationContext?: ClientEvaluationContext;
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
    environmentID?: string;
    headers?: object;
    identity?: IIdentity;
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
    setContext: (context: ClientEvaluationContext) => Promise<void>;
    /**
     * Merge current evaluation context with the provided one. Refresh the flags.
     */
    updateContext: (context: ClientEvaluationContext) => Promise<void>;
    /**
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
     * */
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
     * Returns whether a feature is enabled, or a fallback value if it does not exist.
     * @param {HasFeatureOptions} [optionsOrSkipAnalytics=false] If `true`, will not track analytics for this flag
     * evaluation. Using a boolean for this parameter is deprecated - use `{ skipAnalytics: true }` instead.
     * @param [optionsOrSkipAnalytics.fallback=false] Returns this value if the feature does not exist.
     * @param [optionsOrSkipAnalytics.skipAnalytics=false] If `true`, do not track analytics for this feature evaluation.
     * @example
     * flagsmith.hasFeature("power_user_feature")
     * @example
     * flagsmith.hasFeature("enabled_by_default_feature", { fallback: true })
     */
    hasFeature: (key: F, optionsOrSkipAnalytics?: HasFeatureOptions) => boolean;

    /**
     * Returns the value of a feature, or a fallback value.
     * @param [options.json=false] Deserialise the feature value using `JSON.parse` and return the result or `options.fallback`.
     * @param [options.fallback=null] Return this value in any of these cases:
     * * The feature does not exist.
     * * The feature has no value.
     * * `options.json` is `true` and the feature's value is not valid JSON.
     * @param [options.skipAnalytics=false] If `true`, do not track analytics for this feature evaluation.
     * @param [skipAnalytics=false] Deprecated - use `options.skipAnalytics` instead.
     * @example
     * flagsmith.getValue("remote_config") // "{\"hello\":\"world\"}"
     * flagsmith.getValue("remote_config", { json: true }) // { hello: "world" }
     * @example
     * flagsmith.getValue("font_size") // "12px"
     * flagsmith.getValue("font_size", { json: true, fallback: "8px" }) // "8px"
     */
    getValue<T = IFlagsmithValue>(key: F, options?: GetValueOptions<T>, skipAnalytics?: boolean): IFlagsmithValue<T>;

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
     * */
    setTrait: (key: T, value: IFlagsmithTrait) => Promise<void>;
    /**
     * Set a key value set of traits for a given user, triggers a call to get flags
     */
    setTraits: (traits: ITraits) => Promise<void>;
    /**
     * The stored identity of the user
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
        loadStale: boolean;
    };
    /**
     * Used internally, this is the api provided in flagsmith.init, defaults to our production API
     */
    api: string
}

export {};
