import {
    DynatraceObject,
    GetValueOptions,
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
} from './types';
// @ts-ignore
import deepEqual from 'fast-deep-equal';
import { AsyncStorageType } from './utils/async-storage';
import getChanges from './utils/get-changes';
import angularFetch from './utils/angular-fetch';
import setDynatraceValue from './utils/set-dynatrace-value';

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
const FLAGSMITH_KEY = "BULLET_TRAIN_DB";
const FLAGSMITH_EVENT = "BULLET_TRAIN_EVENT";
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

    _getFlags = () => {
        const { identity, api } = this;
        this.log("Get Flags")
        this.isLoading = true;

        if (!this.loadingState.isFetching) {
            this.setLoadingState({
                ...this.loadingState,
                isFetching: true
            })
        }
        const handleResponse = (response: IFlagsmithResponse | null) => {
            if(!response) {
                return // getJSON returned null due to request/response mismatch
            }
            let { flags: features, traits }: IFlagsmithResponse = response
            this.isLoading = false;
            if (identity) {
                this.withTraits = null;
            }
            // Handle server response
            const flags: IFlags = {};
            const userTraits: ITraits = {};
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
                userTraits[trait.trait_key.toLowerCase().replace(/ /g, '_')] = trait.trait_value
            });

            this.oldFlags = { ...this.flags };
            const flagsChanged = getChanges(this.oldFlags, flags);
            const traitsChanged = getChanges(this.withTraits, userTraits);
            this.flags = flags;
            this.traits = userTraits;
            this.updateStorage();
            this.initializing = false;
            this._onChange(this.oldFlags, {
                isFromServer: true,
                flagsChanged,
                traitsChanged
            }, this._loadedState(null, FlagSource.SERVER));

            if (this.datadogRum) {
                try {
                    if (this.datadogRum!.trackTraits) {
                        const traits: Parameters<IDatadogRum["client"]["setUser"]>["0"] = {};
                        Object.keys(this.traits).map((key) => {
                            traits[FLAGSMITH_TRAIT_ANALYTICS_KEY + key] = this.getTrait(key);
                        });
                        const datadogRumData = {
                            ...this.datadogRum.client.getUser(),
                            id: this.datadogRum.client.getUser().id || this.identity,
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
                        setDynatraceValue(traits, FLAGSMITH_CONFIG_ANALYTICS_KEY + key, this.getValue(key, {}, true))
                        setDynatraceValue(traits, FLAGSMITH_FLAG_ANALYTICS_KEY + key, this.hasFeature(key, true))
                    })
                    Object.keys(this.traits).map((key) => {
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

        if (identity) {
            return Promise.all([
                this.withTraits ?
                    this.getJSON(api + 'identities/', "POST", JSON.stringify({
                        "identifier": identity,
                        traits: Object.keys(this.withTraits).map((k) => ({
                            "trait_key":k,
                            "trait_value": this.withTraits![k]
                        })).filter((v) => {
                            if (typeof v.trait_value === 'undefined') {
                                this.log("Warning - attempted to set an undefined trait value for key", v.trait_key)
                                return false
                            }
                            return true
                        })
                    })) :
                    this.getJSON(api + 'identities/?identifier=' + encodeURIComponent(identity)),
            ])
                .then((res) => {
                    this.withTraits = null
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

    getFlags = () => {
        if(this.initializing) {
            const flags = new Promise(() => {
                const interval = setInterval(async (resolve) => {
                    if (this.initialised && !this.initializing) {
                        clearInterval(interval)
                        return this._getFlags().then(resolve)
                    }
                }, 3000)
            })
            return flags
        }
        if (!this.initialised || this.initializing) {
            return Promise.resolve();
        }
        return this._getFlags()
    }

    analyticsFlags = () => {
        const { api } = this;

        if (!this.evaluationEvent || !this.evaluationEvent[this.environmentID]) {
            return
        }

        if (this.evaluationEvent && Object.getOwnPropertyNames(this.evaluationEvent).length !== 0 && Object.getOwnPropertyNames(this.evaluationEvent[this.environmentID]).length !== 0) {
            return this.getJSON(api + 'analytics/flags/', 'POST', JSON.stringify(this.evaluationEvent[this.environmentID]))
                .then((res) => {
                    const state = this.getState();
                    if (!this.evaluationEvent) {
                        this.evaluationEvent = {}
                    }
                    this.evaluationEvent[this.environmentID] = {}
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
    ts: number|null= null
    enableAnalytics= false
    enableLogs= false
    environmentID = ""
    evaluationEvent: Record<string, Record<string, number>> | null= null
    flags:IFlags|null= null
    getFlagInterval: NodeJS.Timer|null= null
    headers?: object | null= null
    initialised= false
    initializing= true
    oldFlags:IFlags|null= null
    onChange:IInitConfig['onChange']|null= null
    onError:IInitConfig['onError']|null = null
    identity?: string|null= null
    ticks: number|null= null
    timer: number|null= null
    traits:ITraits|null= null
    dtrum= null
    withTraits?: ITraits|null= null
    cacheOptions = {ttl:0, skipAPI: false}
    async init(config: IInitConfig) {
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
            this.environmentID = environmentID;
            this.api = api;
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
            this.identity = identity;
            this.withTraits = traits;
            this.enableLogs = enableLogs || false;
            this.cacheOptions = cacheOptions ? { skipAPI: !!cacheOptions.skipAPI, ttl: cacheOptions.ttl || 0 } : this.cacheOptions;
            if (!this.cacheOptions.ttl && this.cacheOptions.skipAPI) {
                console.warn("Flagsmith: you have set a cache ttl of 0 and are skipping API calls, this means the API will not be hit unless you clear local storage.")
            }
            if (fetchImplementation) {
                _fetch = fetchImplementation;
            }
            this.enableAnalytics = enableAnalytics ? enableAnalytics : false;
            this.flags = Object.assign({}, defaultFlags) || {};
            this.traits = Object.assign({}, traits) || {};
            this.datadogRum = datadogRum || null;
            this.initialised = true;
            this.ticks = 10000;
            this.timer = this.enableLogs ? new Date().valueOf() : null;
            this.cacheFlags = typeof AsyncStorage !== 'undefined' && !!cacheFlags;
            if (_AsyncStorage) {
                AsyncStorage = _AsyncStorage;
            }
            if (realtime && typeof window !== 'undefined') {
                this.setupRealtime(eventSourceUrl, environmentID);
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

            if (!environmentID) {
                throw new Error('Please specify a environment id');
            }

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
                AsyncStorage.getItem(FLAGSMITH_EVENT)
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
                    AsyncStorage.getItem(FLAGSMITH_EVENT, (err, res) => {
                        if (res) {
                            const json = JSON.parse(res);
                            if (json[this.environmentID]) {
                                    const state = this.getState();
                                    this.log("Retrieved events from cache", res);
                                this.setState({
                                    ...state,
                                    evaluationEvent: json[this.environmentID],
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
                                const json = JSON.parse(res);
                                let cachePopulated = false;
                                if (json && json.api === this.api && json.environmentID === this.environmentID) {
                                    let setState = true;
                                    if (this.identity && (json.identity !== this.identity)) {
                                        this.log("Ignoring cache,  identity has changed from " + json.identity + " to " + this.identity )
                                        setState = false;
                                    }
                                    if (this.cacheOptions.ttl) {
                                        if (!json.ts || (new Date().valueOf() - json.ts > this.cacheOptions.ttl)) {
                                            if (json.ts) {
                                                this.log("Ignoring cache, timestamp is too old ts:" + json.ts + " ttl: " + this.cacheOptions.ttl + " time elapsed since cache: " + (new Date().valueOf()-json.ts)+"ms")
                                                setState = false;
                                            }
                                        }
                                    }
                                    if (setState) {
                                        cachePopulated = true;
                                        traitsChanged = getChanges(this.traits, json.traits)
                                        flagsChanged = getChanges(this.flags, json.flags)
                                        this.setState(json);
                                        this.log("Retrieved flags from cache", json);
                                    }
                                }

                                if (cachePopulated) { // retrieved flags from local storage
                                    const shouldFetchFlags = !preventFetch && (!this.cacheOptions.skipAPI||!cachePopulated)
                                    this._onChange(null,
                                        { isFromServer: false, flagsChanged, traitsChanged },
                                        this._loadedState(null, FlagSource.CACHE, shouldFetchFlags)
                                    );
                                    this.oldFlags = this.flags;
                                    if (this.cacheOptions.skipAPI && cachePopulated) {
                                        this.log("Skipping API, using cache")
                                    }
                                    if (shouldFetchFlags) {
                                        // We want to resolve init since we have cached flags
                                        this._getFlags();
                                    }
                                } else {
                                    if (!preventFetch) {
                                        await this._getFlags();
                                    }
                                }
                            } catch (e) {
                                this.log("Exception fetching cached logs", e);
                            }
                        } else {
                            if (!preventFetch) {
                                await this._getFlags();
                            } else {
                                if (defaultFlags) {
                                    this._onChange(null,
                                        { isFromServer: false, flagsChanged: getChanges({}, this.flags), traitsChanged: getChanges({}, this.traits) },
                                        this._loadedState(null, FlagSource.DEFAULT_FLAGS),
                                    );
                                } else if (this.flags) { // flags exist due to set state being called e.g. from nextJS serverState
                                    this._onChange(null,
                                        { isFromServer: false, flagsChanged: getChanges({}, this.flags), traitsChanged: getChanges({}, this.traits) },
                                        this._loadedState(null, FlagSource.DEFAULT_FLAGS),
                                    );
                                } else {
                                    throw new Error(WRONG_FLAGSMITH_CONFIG);
                                }
                            }
                        }
                    };
                    try {
                        const res = AsyncStorage.getItemSync? AsyncStorage.getItemSync(FLAGSMITH_KEY) : await AsyncStorage.getItem(FLAGSMITH_KEY);
                        await onRetrievedStorage(null, res)
                    } catch (e) {}
                }
            } else if (!preventFetch) {
                await this._getFlags();
            } else {
                if (defaultFlags) {
                    this._onChange(null, { isFromServer: false, flagsChanged: getChanges({}, defaultFlags), traitsChanged: getChanges({}, traits) }, this._loadedState(null, FlagSource.DEFAULT_FLAGS));
                } else if (this.flags) {
                    let error = null;
                    if (Object.keys(this.flags).length === 0) {
                        error = WRONG_FLAGSMITH_CONFIG;
                    }
                    this._onChange(null, { isFromServer: false, flagsChanged: getChanges({}, this.flags), traitsChanged: getChanges({}, traits) }, this._loadedState(error, FlagSource.DEFAULT_FLAGS));
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

    private _loadedState(error: any = null, source: FlagSource, isFetching = false) {
        return {
            error,
            isFetching,
            isLoading: false,
            source
        }
    }

    getAllFlags() {
        if(this.initialised) {
            if(this.initializing) {
                const flags = new Promise((resolve) => {
                    const interval = setInterval(() => {
                        if (this.initialised && !this.initializing) {
                            clearInterval(interval)
                            return resolve(true)
                        }
                    }, 3000)
                })
                return flags.then(() => {return this.flags})
            } else {
                return this.flags;
            }
        }    
    }

    identify(userId: string, traits?: ITraits) {
        if(this.identity && this.identity !== userId) {
            // clear out old traits when switching identity
            this.withTraits = {}
        }
        this.identity = userId;
        this.log("Identify: " + this.identity)

        if (traits) {
            this.withTraits = {
                ...(this.withTraits || {}),
                ...traits
            };
        }
        if (this.initialised && !this.initializing) {
            return this._getFlags();
        }
        return Promise.resolve();
    }

    getState() {
        return {
            api: this.api,
            environmentID: this.environmentID,
            flags: this.flags,
            identity: this.identity,
            ts: this.ts,
            traits: this.traits,
            evaluationEvent: this.evaluationEvent,
        } as IState
    }

    setState(state: IState) {
        if (state) {
            this.initialised = true;
            this.api = state.api || this.api || defaultAPI;
            this.environmentID = state.environmentID || this.environmentID;
            this.flags = state.flags || this.flags;
            this.identity = state.identity || this.identity;
            this.traits = state.traits || this.traits;
            this.withTraits = {
                ...(this.withTraits || {}),
                ...this.traits,
            };
            this.evaluationEvent = state.evaluationEvent || this.evaluationEvent;
            this.log("setState called", this)
        }
    }

    logout() {
        this.identity = null;
        this.traits = {};
        if (this.initialised && !this.initializing) {
            return this._getFlags();
        }
        return Promise.resolve();
    }

    startListening(ticks = 1000) {
        if (this.getFlagInterval) {
            clearInterval(this.getFlagInterval);
        }
        this.getFlagInterval = setInterval(this._getFlags, ticks);
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

        if (!skipAnalytics) {
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
        const trait = this.traits && this.traits[key.toLowerCase().replace(/ /g, '_')];
        return trait;
    }

    getAllTraits = () => {
        return this.traits
    }

    setTrait = (key: string, trait_value: IFlagsmithTrait) => {
        const { api } = this;

        if (!api) {
            return
        }
        const traits: ITraits<string> = {};
        traits[key] = trait_value;
        return this.setTraits(traits)
    };

    setTraits = (traits: ITraits) => {

        if (!this.api) {
            console.error(initError("setTraits"))
            return
        }

        if (!traits || typeof traits !== 'object') {
            console.error("Expected object for flagsmith.setTraits");
        }

        this.withTraits = {
            ...(this.withTraits || {}),
            ...traits
        };

        if (!this.identity) {
            this.log("Set traits prior to identifying", this.withTraits);
            return
        }
        if (this.initialised && !this.initializing) {
            return this._getFlags()
        }
    };

    hasFeature = (key: string, skipAnalytics?: boolean) => {
        const flag = this.flags && this.flags[key.toLowerCase().replace(/ /g, '_')];
        let res = false;
        if (flag && flag.enabled) {
            res = true;
        }
        if (!skipAnalytics) {
            this.evaluateFlag(key, "ENABLED");
        }

        return res;
    };

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
            AsyncStorage!.setItem(FLAGSMITH_KEY, state);
        }
    }

    private getJSON = (url: string, method?: 'GET' | 'POST' | 'PUT', body?: string) => {
        const { environmentID, headers } = this;
        const options: RequestOptions = {
            method: method || 'GET',
            body,
            // @ts-ignore next-js overrides fetch
            cache: 'no-cache',
            headers: {
                'x-environment-key': `${environmentID}`,
            },
        };
        if (method && method !== 'GET')
            options.headers['Content-Type'] = 'application/json; charset=utf-8';

        if (headers) {
            Object.assign(options.headers, headers);
        }

        if (!_fetch) {
            console.error('Flagsmith: fetch is undefined, please specify a fetch implementation into flagsmith.init to support SSR.');
        }

        const requestedIdentity = `${this.identity}`;
        return _fetch(url, options)
            .then(res => {
                const newIdentity = `${this.identity}`;
                if (requestedIdentity !== newIdentity) {
                    this.log(`Received response with identity miss-match, ignoring response. Requested: ${requestedIdentity}, Current: ${newIdentity}`);
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
            AsyncStorage!.setItem(FLAGSMITH_EVENT, events);
        }
    }

    private evaluateFlag = (key: string, method: 'VALUE' | 'ENABLED') => {
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
            if (!this.evaluationEvent) return;
            if (!this.evaluationEvent[this.environmentID]) {
                this.evaluationEvent[this.environmentID] = {};
            }
            if (this.evaluationEvent[this.environmentID][key] === undefined) {
                this.evaluationEvent[this.environmentID][key] = 0;
            }
            this.evaluationEvent[this.environmentID][key] += 1;
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
                        this._getFlags();
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
