export interface IBulletTrainFeature {
    enabled: boolean;
    value?: string | number | boolean;
}
export interface IFlagsmithFeature extends IBulletTrainFeature {
}
export declare type IFlagsmithTrait = string | number | boolean;
export interface IFlags {
    [key: string]: IFlagsmithFeature;
}
export interface ITraits {
    [key: string]: IFlagsmithTrait;
}
export interface IUserIdentity {
    flags: IFlagsmithFeature;
    traits: ITraits;
}
export interface IRetrieveInfo {
    isFromServer: boolean;
    flagsChanged: boolean;
    traitsChanged: boolean;
}
export interface IState {
    api: string;
    environmentID: string;
    flags?: IFlags;
    identity?: string;
    traits: ITraits;
}
export interface IInitConfig {
    AsyncStorage?: any;
    api?: string;
    cacheFlags?: boolean;
    defaultFlags?: IFlags;
    enableAnalytics?: boolean;
    enableLogs?: boolean;
    environmentID: string;
    headers?: object;
    identity?: string;
    traits?: ITraits;
    onChange?: (previousFlags: IFlags, params: IRetrieveInfo) => void;
    onError?: (res: {
        message: string;
    }) => void;
    preventFetch?: boolean;
    state?: IState;
    _trigger?: () => void;
}
export interface IFlagsmith {
    /**
     * Initialise the sdk against a particular environment
     */
    init: (config: IInitConfig) => Promise<void>;
    /**
     * Trigger a manual fetch of the environment features
     */
    getFlags: () => Promise<null>;
    /**
     * Returns the current flags
     */
    getAllFlags: () => IFlags;
    /**
     * Identify user, triggers a call to get flags if flagsmith.init has been called
     */
    identify: (userId: string, traits?: Record<string, string | number | boolean>) => Promise<void>;
    /**
     * Retrieves the current state of flagsmith
     */
    getState: () => IState;
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
    hasFeature: (key: string) => boolean;
    /**
     * Get the value of a particular remote config e.g. flagsmith.getValue("font_size")
     */
    getValue: (key: string) => string | number | boolean;
    /**
     * Get the value of a particular trait for the identified user
     */
    getTrait: (key: string) => string | number | boolean;
    /**
     * Set a specific trait for a given user id, triggers a call to get flags
     */
    setTrait: (key: string, value: string | number | boolean) => Promise<null>;
    /**
     * Set a key value set of traits for a given user, triggers a call to get flags
     */
    setTraits: (traits: Record<string, string | number | boolean>) => Promise<null>;
    /**
     * Increments the value of a numeric trait by a given amount (can be negative number)
     */
    incrementTrait: (key: string, incrementBy: number) => Promise<null>;
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
}
