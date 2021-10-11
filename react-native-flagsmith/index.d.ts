export interface IBulletTrainFeature {
    enabled: boolean
    value?: string
}

export interface IFlags {
    [key: string]: IBulletTrainFeature
}

export interface ITraits {
    [key: string]: string
}

export interface IUserIdentity {
    flags: IBulletTrainFeature
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

declare class IFlagsmith {
    /**
     * Initialise the sdk against a particular environment
     */
    init:(config: {
        environmentID: string // your Bullet Train environment id
        api?: string // the api you wish to use, important if self hosting
        AsyncStorage?: any // an AsyncStorage implementation
        cacheFlags?: boolean // whether to local storage flags, needs AsyncStorage defined
        preventFetch?: boolean // whether to prevent fetching flags on init
        enableAnalytics?: boolean // Enable sending flag analytics for getValue and hasFeature evaluations.
        enableLogs?: boolean // whether to enable logs
        onChange?: (previousFlags:IFlags, params:IRetrieveInfo)=> void // triggered when the flags are retrieved
        state?: IState // set a predefined state, useful for isomorphic applications
        onError?: (res:{message:string}) => void // triggered if there was an api error
        defaultFlags?: IFlags //
    }) => Promise<void>

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
    identify:(userId:string, traits?: Record<string, string|number|boolean>,) => Promise<null>

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
     * Increments the value of a numeric trait by a given amount (can be negative number)
     */
    incrementTrait:(
        key:string,
        incrementBy:number
    )=> Promise<null>

}
declare module 'react-native-flagsmith' {
    // @ts-ignore
    export default new IFlagsmith()
    export function createFlagsmithInstance (): IFlagsmith
}
