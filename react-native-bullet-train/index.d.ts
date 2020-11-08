declare module 'react-native-flagsmith' {
    /**
     * Initialise the sdk against a particular environment
     */
    export function init(config: {
        environmentID: string // your Bullet Train environment id
        api?: string // the api you wish to use, important if self hosting
        AsyncStorage?: any // an AsyncStorage implementation
        cacheFlags?: boolean // whether to local storage flags, needs AsyncStorage defined
        preventFetch?: boolean // whether to prevent fetching flags on init
        enableLogs?: boolean // whether to enable logs
        onChange?: (flags:IFlags, params:IRetrieveInfo)=> void // triggered when the flags are retrieved
        state?: IState // set a predefined state, useful for isomorphic applications
        onError?: (res:{message:string}) => void // triggered if there was an api error
        defaultFlags?: IFlags //
    }): Promise<void>

    /**
     * Trigger a manual fetch of the environment features
     */
    export function getFlags(): Promise<IFlags>

    /**
     * Returns the current flags
     */
    export function getAllFlags(): IFlags

    /**
     * Identify user, triggers a call to get flags if flagsmith.init has been called
     */
    export function identify(userId:string): Promise<IFlags|undefined>

    /**
     * Retrieves the current state of flagsmith
     */
    export function getState(): IState

    /**
     * Clears the identity, triggers a call to getFlags
     */
    export function logout(): Promise<IFlags>

    /**
     * Polls the flagsmith API, specify interval in ms
     */
    export function startListening(interval?:number): void

    /**
     * Stops polling
     */
    export function stopListening(): void

    /**
     * Get the whether a flag is enabled e.g. flagsmith.hasFeature("powerUserFeature")
     */
    export function hasFeature(key: string): boolean

    /**
     * Get the value of a particular remote config e.g. flagsmith.getValue("font_size")
     */
    export function getValue(key: string): string|number|boolean

    /**
     * Get the value of a particular trait for the identified user
     */
    export function getTrait(key: string): string|number|boolean

    /**
     * Trigger a manual fetch of the environment features for a given user id
     */
    export function getFlagsForUser(userId: string): Promise<IFlags>

    /**
     * Trigger a manual fetch of both the environment features and users' traits for a given user id
     */
    export function getUserIdentity(userId: string): Promise<IUserIdentity>

    /**
     * Trigger a manual fetch of a specific trait for a given user id
     */
    export function getTrait(userId: string, key: string): Promise<ITraits>

    /**
     * Set a specific trait for a given user id, triggers a call to get flags
     */
    export function setTrait(
        key: string,
        value: string|number|boolean
    ): Promise<IFlags>

    /**
     * Set a key value set of traits for a given user, triggers a call to get flags
     */
    export function setTraits(
        traits: Record<string, string|number|boolean>,
    ): Promise<IFlags>

    /**
     * Increments the value of a numeric trait by a given amount (can be negative number)
     */
    export function incrementTrait(
        key:string,
        incrementBy:number
    ): Promise<IFlags>

    export interface IFeature {
        enabled: boolean
        value?: string
    }

    export interface IFlags {
        [key: string]: IFeature
    }

    export interface ITraits {
        [key: string]: string
    }

    export interface IUserIdentity {
        flags: IFeature
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
}
