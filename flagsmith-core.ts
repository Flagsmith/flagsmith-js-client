import {
    ClientEvaluationContext,
    DynatraceObject,
    GetValueOptions,
    HasFeatureOptions,
    IDatadogRum,
    IFlags,
    IFlagsmith,
    IFlagsmithResponse,
    IFlagsmithTrait,
    IInitConfig,
    IState,
    ITraits,
    LoadingState,
    OnChange,
    Traits,
} from './types';
// @ts-ignore
import deepEqual from 'fast-deep-equal';
import { AsyncStorageType } from './utils/async-storage';
import getChanges from './utils/get-changes';
import angularFetch from './utils/angular-fetch';
import setDynatraceValue from './utils/set-dynatrace-value';
import { EvaluationContext } from './evaluation-context';
import { isTraitEvaluationContext, toEvaluationContext, toTraitEvaluationContextObject } from './utils/types';
import { ensureTrailingSlash } from './utils/ensureTrailingSlash';

enum FlagSource {
    "NONE" = "NONE",
    "DEFAULT_FLAGS" = "DEFAULT_FLAGS",
    "CACHE" = "CACHE",
    "SERVER" = "SERVER",
}

export type LikeFetch = (input: Partial<RequestInfo>, init?: Partial<RequestInit>) => Promise<Partial<Response>>
let _fetch: LikeFetch;

type RequestOptions = {
    method: "GET"|"PUT"|"DELETE"|"POST",
    headers: Record<string, string>
    body?: string
}

let AsyncStorage: AsyncStorageType = null;
const DEFAULT_FLAGSMITH_KEY = "FLAGSMITH_DB";
const DEFAULT_FLAGSMITH_EVENT = "FLAGSMITH_EVENT";
let FlagsmithEvent = DEFAULT_FLAGSMITH_EVENT;
const defaultAPI = 'https://edge.api.flagsmith.com/api/v1/';
let eventSource: typeof EventSource;
const initError = function(caller: string) {
    return "Attempted to " + caller + " a user before calling flagsmith.init. Call flagsmith.init first, if you wish to prevent it sending a request for flags, call init with preventFetch:true."
}

type Config = { browserlessStorage?: boolean, fetch?: LikeFetch, AsyncStorage?: AsyncStorageType, eventSource?: any };

const FLAGSMITH_CONFIG_ANALYTICS_KEY = "flagsmith_value_";
const FLAGSMITH_FLAG_ANALYTICS_KEY = "flagsmith_enabled_";
const FLAGSMITH_TRAIT_ANALYTICS_KEY = "flagsmith_trait_";

const Flagsmith = class {
    _trigger?:(()=>void)|null= null
    _triggerLoadingState?:(()=>void)|null= null
    timestamp: number|null = null
    isLoading = false
    eventSource:EventSource|null = null
    constructor(props: Config) {
        if (props.fetch) {
            _fetch = props.fetch as LikeFetch;
        } else {
            _fetch = (typeof fetch !== 'undefined' ? fetch : global?.fetch) as LikeFetch;
        }

        this.canUseStorage = typeof window !== 'undefined' || !!props.browserlessStorage;

        this.log("Constructing flagsmith instance " + props)
        if (props.eventSource) {
            eventSource = props.eventSource;
        }
        if (props.AsyncStorage) {
            AsyncStorage = props.AsyncStorage;
        }
    }

    getFlags = () => {
        const { api, evaluationContext } = this;
        this.log("Get Flags")
        this.isLoading = true;

        if (!this.loadingState.isFetching) {
            this.setLoadingState({
                ...this.loadingState,
                isFetching: true
            })
        }
        const previousIdentity = `${this.getContext().identity}`;
        const handleResponse = (response: IFlagsmithResponse | null) => {
            if(!response || previousIdentity !== `${this.getContext().identity}`) {
                return // getJSON returned null due to request/response mismatch
            }
            let { flags: features, traits }: IFlagsmithResponse = response
            const {identifier} = response
            this.isLoading = false;
            // Handle server response
            const flags: IFlags = {};
            const userTraits: Traits = {};
            features = features || [];
            traits = traits || [];
            features.forEach(feature => {
                flags[feature.feature.name.toLowerCase().replace(/ /g, '_')] = {
                    id: feature.feature.id,
                    enabled: feature.enabled,
                    value: feature.feature_state_value
                };
            });
            traits.forEach(trait => {
                userTraits[trait.trait_key.toLowerCase().replace(/ /g, '_')] = {
                    transient: trait.transient,
                    value: trait.trait_value,
                }
            });

            this.oldFlags = { ...this.flags };
            const flagsChanged = getChanges(this.oldFlags, flags);
            const traitsChanged = getChanges(this.evaluationContext.identity?.traits, userTraits);
            if (identifier || Object.keys(userTraits).length) {
                this.evaluationContext.identity = {
                    ...this.evaluationContext.identity,
                    traits: userTraits,
                };
                if (identifier) {
                    this.evaluationContext.identity.identifier = identifier;
                }
            }
            this.flags = flags;
            this.updateStorage();
            this._onChange(this.oldFlags, {
                isFromServer: true,
                flagsChanged,
                traitsChanged
            }, this._loadedState(null, FlagSource.SERVER));

            if (this.datadogRum) {
                try {
                    if (this.datadogRum!.trackTraits) {
                        const traits: Parameters<IDatadogRum["client"]["setUser"]>["0"] = {};
                        Object.keys(this.evaluationContext.identity?.traits || {}).map((key) => {
                            traits[FLAGSMITH_TRAIT_ANALYTICS_KEY + key] = this.getTrait(key);
                        });
                        const datadogRumData = {
                            ...this.datadogRum.client.getUser(),
                            id: this.datadogRum.client.getUser().id || this.evaluationContext.identity?.identifier,
                            ...traits,
                        };
                        this.log("Setting Datadog user", datadogRumData);
                        this.datadogRum.client.setUser(datadogRumData);
                    }
                } catch (e) {
                    console.error(e)
                }
            }

            if (this.dtrum) {
                try {
                    const traits: DynatraceObject = {
                        javaDouble: {},
                        date: {},
                        shortString: {},
                        javaLongOrObject: {},
                    }
                    Object.keys(this.flags).map((key) => {
                        setDynatraceValue(traits, FLAGSMITH_CONFIG_ANALYTICS_KEY + key, this.getValue(key, { skipAnalytics: true }))
                        setDynatraceValue(traits, FLAGSMITH_FLAG_ANALYTICS_KEY + key, this.hasFeature(key, { skipAnalytics: true }))
                    })
                    Object.keys(this.evaluationContext.identity?.traits || {}).map((key) => {
                        setDynatraceValue(traits, FLAGSMITH_TRAIT_ANALYTICS_KEY + key, this.getTrait(key))
                    })
                    this.log("Sending javaLongOrObject traits to dynatrace", traits.javaLongOrObject)
                    this.log("Sending date traits to dynatrace", traits.date)
                    this.log("Sending shortString traits to dynatrace", traits.shortString)
                    this.log("Sending javaDouble to dynatrace", traits.javaDouble)
                    // @ts-expect-error
                    this.dtrum.sendSessionProperties(
                        traits.javaLongOrObject, traits.date, traits.shortString, traits.javaDouble
                    )
                } catch (e) {
                    console.error(e)
                }
            }

        };

        if (evaluationContext.identity) {
            return Promise.all([
                (evaluationContext.identity.traits && Object.keys(evaluationContext.identity.traits).length) || !evaluationContext.identity.identifier ?
                    this.getJSON(api + 'identities/', "POST", JSON.stringify({
                        "identifier": evaluationContext.identity.identifier,
                        "transient": evaluationContext.identity.transient,
                        traits: Object.entries(evaluationContext.identity.traits!).map(([tKey, tContext]) => {
                            return {
                                trait_key: tKey,
                                trait_value: tContext?.value,
                                transient: tContext?.transient,
                            }
                        }).filter((v) => {
                            if (typeof v.trait_value === 'undefined') {
                                this.log("Warning - attempted to set an undefined trait value for key", v.trait_key)
                                return false
                            }
                            return true
                        })
                    })) :
                    this.getJSON(api + 'identities/?identifier=' + encodeURIComponent(evaluationContext.identity.identifier) + (evaluationContext.identity.transient ? '&transient=true' : '')),
            ])
                .then((res) => {
                    this.evaluationContext.identity = {...this.evaluationContext.identity, traits: {}}
                    return handleResponse(res?.[0] as IFlagsmithResponse | null)
                }).catch(({ message }) => {
                    const error = new Error(message)
                    return Promise.reject(error)
                });
        } else {
            return this.getJSON(api + "flags/")
                .then((res) => {
                    return handleResponse({ flags: res as IFlagsmithResponse['flags'], traits:undefined })
                })
        }
    };

    analyticsFlags = () => {
        const { api } = this;

        if (!this.evaluationEvent || !this.evaluationContext.environment || !this.evaluationEvent[this.evaluationContext.environment.apiKey]) {
            return
        }

        if (this.evaluationEvent && Object.getOwnPropertyNames(this.evaluationEvent).length !== 0 && Object.getOwnPropertyNames(this.evaluationEvent[this.evaluationContext.environment.apiKey]).length !== 0) {
            return this.getJSON(api + 'analytics/flags/', 'POST', JSON.stringify(this.evaluationEvent[this.evaluationContext.environment.apiKey]))
                .then((res) => {
                    if (!this.evaluationContext.environment) {
                        return;
                    }
                    const state = this.getState();
                    if (!this.evaluationEvent) {
                        this.evaluationEvent = {}
                    }
                    this.evaluationEvent[this.evaluationContext.environment.apiKey] = {}
                    this.setState({
                        ...state,
                        evaluationEvent: this.evaluationEvent,
                    });
                    this.updateEventStorage();
                }).catch((err) => {
                    this.log("Exception fetching evaluationEvent", err);
                });
        }
    };

    datadogRum: IDatadogRum | null = null;
    loadingState: LoadingState = {isLoading: true, isFetching: true, error: null, source: FlagSource.NONE}
    canUseStorage = false
    analyticsInterval: NodeJS.Timer | null= null
    api: string|null= null
    cacheFlags= false
    ts?: number
    enableAnalytics= false
    enableLogs= false
    evaluationContext: EvaluationContext= {}
    evaluationEvent: Record<string, Record<string, number>> | null= null
    flags:IFlags|null= null
    getFlagInterval: NodeJS.Timer|null= null
    headers?: object | null= null
    initialised= false
    oldFlags:IFlags|null= null
    onChange:IInitConfig['onChange']|null= null
    onError:IInitConfig['onError']|null = null
    ticks: number|null= null
    timer: number|null= null
    dtrum= null
    withTraits?: ITraits|null= null
    cacheOptions = {ttl:0, skipAPI: false, loadStale: false, storageKey: undefined as string|undefined}
    async init(config: IInitConfig) {
        const evaluationContext = toEvaluationContext(config.evaluationContext || this.evaluationContext);
        try {
            const {
                environmentID,
                api = defaultAPI,
                headers,
                onChange,
                cacheFlags,
                datadogRum,
                onError,
                defaultFlags,
                fetch: fetchImplementation,
                preventFetch,
                enableLogs,
                enableDynatrace,
                enableAnalytics,
                realtime,
                eventSourceUrl= "https://realtime.flagsmith.com/",
                AsyncStorage: _AsyncStorage,
                identity,
                traits,
                state,
                cacheOptions,
                angularHttpClient,
                _trigger,
                _triggerLoadingState,
            } = config;
            evaluationContext.environment = environmentID ? {apiKey: environmentID} : evaluationContext.environment;
            if (!evaluationContext.environment || !evaluationContext.environment.apiKey) {
                throw new Error('Please provide `evaluationContext.environment` with non-empty `apiKey`');
            }
            evaluationContext.identity = identity || traits ? {
                identifier: identity,
                traits: traits ? Object.fromEntries(
                    Object.entries(traits).map(
                        ([tKey, tValue]) => [tKey, {value: tValue}]
                    )
                ) : {},
            } : evaluationContext.identity;
            this.evaluationContext = evaluationContext;
            this.api = ensureTrailingSlash(api);
            this.headers = headers;
            this.getFlagInterval = null;
            this.analyticsInterval = null;
            this.onChange = onChange;
            const WRONG_FLAGSMITH_CONFIG = 'Wrong Flagsmith Configuration: preventFetch is true and no defaulFlags provided'
            this._trigger = _trigger || this._trigger;
            this._triggerLoadingState = _triggerLoadingState || this._triggerLoadingState;
            this.onError = (message: Error) => {
                this.setLoadingState({
                    ...this.loadingState,
                    isFetching: false,
                    isLoading: false,
                    error: message,
                });
                onError?.(message);
            };
            this.enableLogs = enableLogs || false;
            this.cacheOptions = cacheOptions ? { skipAPI: !!cacheOptions.skipAPI, ttl: cacheOptions.ttl || 0, storageKey:cacheOptions.storageKey, loadStale: !!cacheOptions.loadStale } : this.cacheOptions;
            if (!this.cacheOptions.ttl && this.cacheOptions.skipAPI) {
                console.warn("Flagsmith: you have set a cache ttl of 0 and are skipping API calls, this means the API will not be hit unless you clear local storage.")
            }
            if (fetchImplementation) {
                _fetch = fetchImplementation;
            }
            this.enableAnalytics = enableAnalytics ? enableAnalytics : false;
            this.flags = Object.assign({}, defaultFlags) || {};
            this.datadogRum = datadogRum || null;
            this.initialised = true;
            this.ticks = 10000;
            this.timer = this.enableLogs ? new Date().valueOf() : null;
            this.cacheFlags = typeof AsyncStorage !== 'undefined' && !!cacheFlags;

            FlagsmithEvent = DEFAULT_FLAGSMITH_EVENT + "_" + evaluationContext.environment.apiKey;

            if (_AsyncStorage) {
                AsyncStorage = _AsyncStorage;
            }
            if (realtime && typeof window !== 'undefined') {
                this.setupRealtime(eventSourceUrl, evaluationContext.environment.apiKey);
            }

            if (Object.keys(this.flags).length) {
                //Flags have been passed as part of SSR / default flags, update state silently for initial render
                this.loadingState = {
                    ...this.loadingState,
                    isLoading: false,
                    source: FlagSource.DEFAULT_FLAGS
                }
            }

            this.setState(state as IState);

            this.log('Initialising with properties', config, this);

            if (enableDynatrace) {
                // @ts-expect-error Dynatrace's dtrum is exposed to global scope
                if (typeof dtrum === 'undefined') {
                    console.error("You have attempted to enable dynatrace but dtrum is undefined, please check you have the Dynatrace RUM JavaScript API installed.")
                } else {
                    // @ts-expect-error Dynatrace's dtrum is exposed to global scope
                    this.dtrum = dtrum;
                }
            }

            if (angularHttpClient) {
                // @ts-expect-error
                _fetch = angularFetch(angularHttpClient);
            }

            if (AsyncStorage && this.canUseStorage) {
                AsyncStorage.getItem(FlagsmithEvent)
                    .then((res)=>{
                        try {
                            this.evaluationEvent = JSON.parse(res!) || {}
                        } catch (e) {
                            this.evaluationEvent = {};
                        }
                        this.analyticsInterval = setInterval(this.analyticsFlags, this.ticks!);
                    })
            }

            if (this.enableAnalytics) {
                if (this.analyticsInterval) {
                    clearInterval(this.analyticsInterval);
                }

                if (AsyncStorage && this.canUseStorage) {
                    AsyncStorage.getItem(FlagsmithEvent, (err, res) => {
                        if (res && this.evaluationContext.environment) {
                            const json = JSON.parse(res);
                            if (json[this.evaluationContext.environment.apiKey]) {
                                const state = this.getState();
                                this.log("Retrieved events from cache", res);
                                this.setState({
                                    ...state,
                                    evaluationEvent: json[this.evaluationContext.environment.apiKey],
                                });
                            }
                        }
                    });
                }
            }

            //If the user specified default flags emit a changed event immediately
            if (cacheFlags) {
                if (AsyncStorage && this.canUseStorage) {
                    const onRetrievedStorage = async (error: Error | null, res: string | null) => {
                        if (res) {
                            let flagsChanged = null
                            let traitsChanged = null
                            try {
                                const json = JSON.parse(res) as IState;
                                let cachePopulated = false;
                                let staleCachePopulated = false;
                                if (json && json.api === this.api && json.evaluationContext?.environment?.apiKey === this.evaluationContext.environment?.apiKey) {
                                    let setState = true;
                                    if (this.evaluationContext.identity && (json.evaluationContext?.identity?.identifier !== this.evaluationContext.identity.identifier)) {
                                        this.log("Ignoring cache, identity has changed from " + json.evaluationContext?.identity?.identifier + " to " + this.evaluationContext.identity.identifier )
                                        setState = false;
                                    }
                                    if (this.cacheOptions.ttl) {
                                        if (!json.ts || (new Date().valueOf() - json.ts > this.cacheOptions.ttl)) {
                                            if (json.ts && !this.cacheOptions.loadStale) {
                                                this.log("Ignoring cache, timestamp is too old ts:" + json.ts + " ttl: " + this.cacheOptions.ttl + " time elapsed since cache: " + (new Date().valueOf()-json.ts)+"ms")
                                                setState = false;
                                            }
                                            else if (json.ts && this.cacheOptions.loadStale) {
                                                this.log("Loading stale cache, timestamp ts:" + json.ts + " ttl: " + this.cacheOptions.ttl + " time elapsed since cache: " + (new Date().valueOf()-json.ts)+"ms")
                                                staleCachePopulated = true;
                                                setState = true;
                                            }
                                        }
                                    }
                                    if (setState) {
                                        cachePopulated = true;
                                        flagsChanged = getChanges(this.flags, json.flags)
                                        this.setState({
                                            ...json,
                                            evaluationContext: toEvaluationContext({
                                                ...json.evaluationContext,
                                                identity: json.evaluationContext?.identity ? {
                                                    ...json.evaluationContext?.identity,
                                                    traits: {
                                                        // Traits passed in flagsmith.init will overwrite server values
                                                        ...traits || {},
                                                    }
                                                } : undefined,
                                            })
                                        });
                                        this.log("Retrieved flags from cache", json);
                                    }
                                }

                                if (cachePopulated) { // retrieved flags from local storage
                                    // fetch the flags if the cache is stale, or if we're not skipping api on cache hits
                                    const shouldFetchFlags = !preventFetch && (!this.cacheOptions.skipAPI || staleCachePopulated)
                                    this._onChange(null,
                                        { isFromServer: false, flagsChanged, traitsChanged },
                                        this._loadedState(null, FlagSource.CACHE, shouldFetchFlags)
                                    );
                                    this.oldFlags = this.flags;
                                    if (this.cacheOptions.skipAPI && cachePopulated && !staleCachePopulated) {
                                        this.log("Skipping API, using cache")
                                    }
                                    if (shouldFetchFlags) {
                                        // We want to resolve init since we have cached flags

                                        this.getFlags().catch((error) => {
                                            this.onError?.(error)
                                        })
                                    }
                                } else {
                                    if (!preventFetch) {
                                        await this.getFlags();
                                    }
                                }
                            } catch (e) {
                                this.log("Exception fetching cached logs", e);
                            }
                        } else {
                            if (!preventFetch) {
                                await this.getFlags();
                            } else {
                                if (defaultFlags) {
                                    this._onChange(null,
                                        { isFromServer: false, flagsChanged: getChanges({}, this.flags), traitsChanged: getChanges({}, this.evaluationContext.identity?.traits) },
                                        this._loadedState(null, FlagSource.DEFAULT_FLAGS),
                                    );
                                } else if (this.flags) { // flags exist due to set state being called e.g. from nextJS serverState
                                    this._onChange(null,
                                        { isFromServer: false, flagsChanged: getChanges({}, this.flags), traitsChanged: getChanges({}, this.evaluationContext.identity?.traits) },
                                        this._loadedState(null, FlagSource.DEFAULT_FLAGS),
                                    );
                                } else {
                                    throw new Error(WRONG_FLAGSMITH_CONFIG);
                                }
                            }
                        }
                    };
                    try {
                        const res = AsyncStorage.getItemSync? AsyncStorage.getItemSync(this.getStorageKey()) : await AsyncStorage.getItem(this.getStorageKey());
                        await onRetrievedStorage(null, res)
                    } catch (e) {}
                }
            } else if (!preventFetch) {
                await this.getFlags();
            } else {
                if (defaultFlags) {
                    this._onChange(null, { isFromServer: false, flagsChanged: getChanges({}, defaultFlags), traitsChanged: getChanges({}, evaluationContext.identity?.traits) }, this._loadedState(null, FlagSource.DEFAULT_FLAGS));
                } else if (this.flags) {
                    let error = null;
                    if (Object.keys(this.flags).length === 0) {
                        error = WRONG_FLAGSMITH_CONFIG;
                    }
                    this._onChange(null, { isFromServer: false, flagsChanged: getChanges({}, this.flags), traitsChanged: getChanges({}, evaluationContext.identity?.traits) }, this._loadedState(error, FlagSource.DEFAULT_FLAGS));
                    if(error) {
                        throw new Error(error)
                    }
                }
            }
        } catch (error) {
            this.log('Error during initialisation ', error);
            const typedError = error instanceof Error ? error : new Error(`${error}`);
            this.onError?.(typedError);
            throw error;
        }
    }

    getAllFlags() {
        return this.flags;
    }

    identify(userId?: string | null, traits?: ITraits, transient?: boolean) {
        this.evaluationContext.identity = {
            identifier: userId,
            transient: transient,
            // clear out old traits when switching identity
            traits: this.evaluationContext.identity && this.evaluationContext.identity.identifier == userId ? this.evaluationContext.identity.traits : {}
        }
        this.evaluationContext.identity.identifier = userId;
        this.log("Identify: " + this.evaluationContext.identity.identifier)

        if (traits) {
            this.evaluationContext.identity.traits = Object.fromEntries(
                Object.entries(traits).map(
                    ([tKey, tValue]) => [tKey, isTraitEvaluationContext(tValue) ? tValue : {value: tValue}]
                )
            );
        }
        if (this.initialised) {
            return this.getFlags();
        }
        return Promise.resolve();
    }

    getState() {
        return {
            api: this.api,
            flags: this.flags,
            ts: this.ts,
            evaluationContext: this.evaluationContext,
            evaluationEvent: this.evaluationEvent,
        } as IState
    }

    setState(state: IState) {
        if (state) {
            this.initialised = true;
            this.api = state.api || this.api || defaultAPI;
            this.flags = state.flags || this.flags;
            this.evaluationContext = state.evaluationContext || this.evaluationContext,
            this.evaluationEvent = state.evaluationEvent || this.evaluationEvent;
            this.log("setState called", this)
        }
    }

    logout() {
        this.evaluationContext.identity = null;
        if (this.initialised) {
            return this.getFlags();
        }
        return Promise.resolve();
    }

    startListening(ticks = 1000) {
        if (this.getFlagInterval) {
            clearInterval(this.getFlagInterval);
        }
        this.getFlagInterval = setInterval(this.getFlags, ticks);
    }

    stopListening() {
        if (this.getFlagInterval) {
            clearInterval(this.getFlagInterval);
            this.getFlagInterval = null;
        }
    }

    getValue = (key: string, options?: GetValueOptions, skipAnalytics?: boolean) => {
        const flag = this.flags && this.flags[key.toLowerCase().replace(/ /g, '_')];
        let res = null;
        if (flag) {
            res = flag.value;
        }

        if (!options?.skipAnalytics && !skipAnalytics) {
            this.evaluateFlag(key, "VALUE");
        }

        if (res === null && typeof options?.fallback !== 'undefined') {
            return options.fallback;
        }

        if (options?.json) {
            try {
                if (res === null) {
                    this.log("Tried to parse null flag as JSON: " + key);
                    return null;
                }
                return JSON.parse(res as string);
            } catch (e) {
                return options.fallback;
            }
        }
        //todo record check for value
        return res;
    }

    getTrait = (key: string) => {
        return this.evaluationContext.identity?.traits && this.evaluationContext.identity.traits[key.toLowerCase().replace(/ /g, '_')]?.value;
    }

    getAllTraits = () => {
        return Object.fromEntries(
            Object.entries(this.evaluationContext.identity?.traits || {}).map(
                ([tKey, tContext]) => [tKey, tContext?.value]
            )
        );
    }

    setContext = (clientEvaluationContext: ClientEvaluationContext) => {
        const evaluationContext = toEvaluationContext(clientEvaluationContext);
        this.evaluationContext = {
            ...evaluationContext,
            environment: evaluationContext.environment || this.evaluationContext.environment,
        };

        if (this.initialised) {
            return this.getFlags();
        }

        return Promise.resolve();
    }

    getContext = () => {
        return this.evaluationContext;
    }

    updateContext = (evaluationContext: ClientEvaluationContext) => {
        return this.setContext({
            ...this.getContext(),
            ...evaluationContext,
        })
    }

    setTrait = (key: string, trait_value: IFlagsmithTrait) => {
        const { api } = this;

        if (!api) {
            return
        }

        return this.setContext({
            ...this.evaluationContext,
            identity: {
                ...this.evaluationContext.identity,
                traits: {
                    ...this.evaluationContext.identity?.traits,
                    ...toTraitEvaluationContextObject(Object.fromEntries(
                        [[key, trait_value]],
                    ))
                }
            }
        });
    };

    setTraits = (traits: ITraits) => {

        if (!this.api) {
            console.error(initError("setTraits"))
            return
        }

        return this.setContext({
            ...this.evaluationContext,
            identity: {
                ...this.evaluationContext.identity,
                traits: {
                    ...this.evaluationContext.identity?.traits,
                    ...Object.fromEntries(
                        Object.entries(traits).map(
                            (([tKey, tValue]) => [tKey, isTraitEvaluationContext(tValue) ? tValue : {value: tValue}])
                        )
                    )
                }
            }
        });
    };

    hasFeature = (key: string, options?: HasFeatureOptions) => {
        // Support legacy skipAnalytics boolean parameter
        const usingNewOptions = typeof options === 'object'
        const flag = this.flags && this.flags[key.toLowerCase().replace(/ /g, '_')];
        let res = false;
        if (!flag && usingNewOptions && typeof options.fallback !== 'undefined') {
            res = options?.fallback
        } else if (flag && flag.enabled) {
            res = true;
        }
        if ((usingNewOptions && !options.skipAnalytics) || !options) {
            this.evaluateFlag(key, "ENABLED");
        }

        return res;
    };

    private _loadedState(error: any = null, source: FlagSource, isFetching = false) {
        return {
            error,
            isFetching,
            isLoading: false,
            source
        }
    }

    private getStorageKey = ()=> {
        return this.cacheOptions?.storageKey || DEFAULT_FLAGSMITH_KEY + "_" + this.evaluationContext.environment?.apiKey
    }

    private log(...args: (unknown)[]) {
        if (this.enableLogs) {
            console.log.apply(this, ['FLAGSMITH:', new Date().valueOf() - (this.timer || 0), 'ms', ...args]);
        }
    }

    private updateStorage() {
        if (this.cacheFlags) {
            this.ts = new Date().valueOf();
            const state = JSON.stringify(this.getState());
            this.log('Setting storage', state);
            AsyncStorage!.setItem(this.getStorageKey(), state);
        }
    }

    private getJSON = (url: string, method?: 'GET' | 'POST' | 'PUT', body?: string) => {
        const { evaluationContext, headers } = this;
        const options: RequestOptions = {
            method: method || 'GET',
            body,
            // @ts-ignore next-js overrides fetch
            cache: 'no-cache',
            headers: {},
        };
        if (this.evaluationContext.environment)
            options.headers['X-Environment-Key'] = this.evaluationContext.environment.apiKey;
        if (method && method !== 'GET')
            options.headers['Content-Type'] = 'application/json; charset=utf-8';

        if (headers) {
            Object.assign(options.headers, headers);
        }

        if (!_fetch) {
            console.error('Flagsmith: fetch is undefined, please specify a fetch implementation into flagsmith.init to support SSR.');
        }

        const requestedIdentity = `${this.evaluationContext.identity?.identifier}`;
        return _fetch(url, options)
            .then(res => {
                const newIdentity = `${this.evaluationContext.identity?.identifier}`;
                if (requestedIdentity !== newIdentity) {
                    this.log(`Received response with identity mismatch, ignoring response. Requested: ${requestedIdentity}, Current: ${newIdentity}`);
                    return;
                }
                const lastUpdated = res.headers?.get('x-flagsmith-document-updated-at');
                if (lastUpdated) {
                    try {
                        const lastUpdatedFloat = parseFloat(lastUpdated);
                        if (isNaN(lastUpdatedFloat)) {
                            return Promise.reject('Failed to parse x-flagsmith-document-updated-at');
                        }
                        this.timestamp = lastUpdatedFloat;
                    } catch (e) {
                        this.log(e, 'Failed to parse x-flagsmith-document-updated-at', lastUpdated);
                    }
                }
                this.log('Fetch response: ' + res.status + ' ' + (method || 'GET') + +' ' + url);
                return res.text!()
                    .then((text) => {
                        let err = text;
                        try {
                            err = JSON.parse(text);
                        } catch (e) {}
                        if(!err && res.status) {
                            err = `API Response: ${res.status}`
                        }
                        return res.status && res.status >= 200 && res.status < 300 ? err : Promise.reject(new Error(err));
                    });
            });
    };

    private updateEventStorage() {
        if (this.enableAnalytics) {
            const events = JSON.stringify(this.getState().evaluationEvent);
            AsyncStorage!.setItem(FlagsmithEvent, events)
            .catch((e) => console.error("Flagsmith: Error setting item in async storage", e));
        }
    }

    private evaluateFlag =(key: string, method: 'VALUE' | 'ENABLED') => {
        if (this.datadogRum) {
            if (!this.datadogRum!.client!.addFeatureFlagEvaluation) {
                console.error('Flagsmith: Your datadog RUM client does not support the function addFeatureFlagEvaluation, please update it.');
            } else {
                if (method === 'VALUE') {
                    this.datadogRum!.client!.addFeatureFlagEvaluation(FLAGSMITH_CONFIG_ANALYTICS_KEY + key, this.getValue(key, {}, true));
                } else {
                    this.datadogRum!.client!.addFeatureFlagEvaluation(FLAGSMITH_FLAG_ANALYTICS_KEY + key, this.hasFeature(key, true));
                }
            }
        }

        if (this.enableAnalytics) {
            if (!this.evaluationEvent || !this.evaluationContext.environment) return;
            if (!this.evaluationEvent[this.evaluationContext.environment.apiKey]) {
                this.evaluationEvent[this.evaluationContext.environment.apiKey] = {};
            }
            if (this.evaluationEvent[this.evaluationContext.environment.apiKey][key] === undefined) {
                this.evaluationEvent[this.evaluationContext.environment.apiKey][key] = 0;
            }
            this.evaluationEvent[this.evaluationContext.environment.apiKey][key] += 1;
        }
        this.updateEventStorage();
    };

    private setLoadingState(loadingState: LoadingState) {
        if (!deepEqual(loadingState, this.loadingState)) {
            this.loadingState = { ...loadingState };
            this.log('Loading state changed', loadingState);
            this._triggerLoadingState?.();
        }
    }

    private _onChange: OnChange = (previousFlags, params, loadingState) => {
        this.setLoadingState(loadingState);
        this.onChange?.(previousFlags, params, this.loadingState);
        this._trigger?.();
    };

    private setupRealtime(eventSourceUrl: string, environmentID: string) {
        const connectionUrl = eventSourceUrl + 'sse/environments/' + environmentID + '/stream';
        if (!eventSource) {
            this.log('Error, EventSource is undefined');
        } else if (!this.eventSource) {
            this.log('Creating event source with url ' + connectionUrl);
            this.eventSource = new eventSource(connectionUrl);
            this.eventSource.addEventListener('environment_updated', (e) => {
                let updated_at;
                try {
                    const data = JSON.parse(e.data);
                    updated_at = data.updated_at;
                } catch (e) {
                    this.log('Could not parse sse event', e);
                }
                if (!updated_at) {
                    this.log('No updated_at received, fetching flags', e);
                } else if (!this.timestamp || updated_at > this.timestamp) {
                    if (this.isLoading) {
                        this.log('updated_at is new, but flags are loading', e.data, this.timestamp);
                    } else {
                        this.log('updated_at is new, fetching flags', e.data, this.timestamp);
                        this.getFlags();
                    }
                } else {
                    this.log('updated_at is outdated, skipping get flags', e.data, this.timestamp);
                }
            });
        }
    }
};

export default function({ fetch, AsyncStorage, eventSource }: Config): IFlagsmith {
    return new Flagsmith({ fetch, AsyncStorage, eventSource }) as IFlagsmith;
}
