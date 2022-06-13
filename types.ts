// Deprecated
export interface IBulletTrainFeature {
    enabled: boolean
    value?: string|number|boolean
}

export interface IFlagsmithFeature extends IBulletTrainFeature {}
export type IFlagsmithTrait = string|number|boolean
export interface IFlags {
    [key: string]: IFlagsmithFeature
}

export interface ITraits {
    [key: string]: IFlagsmithTrait
}

export interface IUserIdentity {
    flags: IFlagsmithFeature
    traits: ITraits
}
export interface IRetrieveInfo {
    isFromServer: boolean
    flagsChanged: boolean
    traitsChanged: boolean
}
export interface IState {
    api: string
    environmentID: string
    flags?: IFlags
    identity?: string
    traits: ITraits
}

export interface IInitConfig {
    AsyncStorage?: any // an AsyncStorage implementation
    api?: string // the api you wish to use, important if self hosting
    cacheFlags?: boolean // whether to local storage flags, needs AsyncStorage defined
    defaultFlags?: IFlags //
    dtrum?: any // Instance of RUM JavaScript API
    enableAnalytics?: boolean // Enable sending flag analytics for getValue and hasFeature evaluations.
    enableLogs?: boolean // whether to enable logs
    angularHttpClient?: any // an angular http client to support ssr
    environmentID: string // your Flagsmith environment id
    headers?: object // pass custom headers for flagsmith api calls
    identity?: string // Initialise with a given identity
    traits?: ITraits // Initialise with a given set of traits
    onChange?: (previousFlags:IFlags, params:IRetrieveInfo)=> void // triggered when the flags are retrieved
    onError?: (res:{message:string}) => void // triggered if there was an api error
    preventFetch?: boolean // whether to prevent fetching flags on init
    state?: IState // set a predefined state, useful for isomorphic applications
    _trigger?: ()=>void // Used internally, this function will callback separately to onChange whenever flags are updated
}
export interface IFlagsmith {
    /**
     * Initialise the sdk against a particular environment
     */
    init:(config: IInitConfig) => Promise<void>

    /**
     * Trigger a manual fetch of the environment features
     */
    getFlags:()=> Promise<null>

    /**
     * Returns the current flags
     */
    getAllFlags:()=> IFlags

    /**
     * Identify user, triggers a call to get flags if flagsmith.init has been called
     */
    identify:(userId:string, traits?: Record<string, string|number|boolean>,) => Promise<void>

    /**
     * Retrieves the current state of flagsmith
     */
    getState:()=> IState

    /**
     * Clears the identity, triggers a call to getFlags
     */
    logout:()=> Promise<null>

    /**
     * Polls the flagsmith API, specify interval in ms
     */
    startListening:(interval?:number)=> void

    /**
     * Stops polling
     */
    stopListening:()=> void

    /**
     * Get the whether a flag is enabled e.g. flagsmith.hasFeature("powerUserFeature")
     */
    hasFeature:(key: string)=> boolean

    /**
     * Get the value of a particular remote config e.g. flagsmith.getValue("font_size")
     */
    getValue:(key: string) => string|number|boolean

    /**
     * Get the value of a particular trait for the identified user
     */
    getTrait:(key: string) => string|number|boolean

    /**
     * Set a specific trait for a given user id, triggers a call to get flags
     */
    setTrait:(
        key: string,
        value: string|number|boolean
    )=> Promise<null>

    /**
     * Set a key value set of traits for a given user, triggers a call to get flags
     */
    setTraits:(
        traits: Record<string, string|number|boolean>,
    )=> Promise<null>

    /**
     * The stored identity of the user
     */
    identity?:string

    /**
     * Whether the flagsmith SDK is initialised
     */
    initialised?:boolean

    /**
     * Used internally, this function will callback separately to onChange whenever flags are updated
     */
    trigger?:()=>{}
}
