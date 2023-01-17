import {
    IFlags,
    IFlagsmith,
    GetValueOptions,
    IFlagsmithResponse,
    IInitConfig,
    IState,
    ITraits,
    IFlagsmithTrait,
} from './types';
export type LikeFetch = (input: Partial<RequestInfo>, init?: Partial<RequestInit>) => Promise<Partial<Response>>
let _fetch: LikeFetch;
type RequestOptions = {
    method: "GET"|"PUT"|"DELETE"|"POST",
    headers: Record<string, string>
    body?:string
}
type DynatraceObject = {
    "javaLongOrObject": Record<string, number>,
    "date": Record<string, Date>,
    "shortString": Record<string, string>,
    "javaDouble": Record<string, number>,
}
type AsyncStorageType = {
    getItem: (key:string, cb?:(err:string|null, res:string|null)=>void)=>Promise<string|null>
    setItem: (key:string, value: string)=>Promise<string|null>
} | null
let AsyncStorage: AsyncStorageType = null;
const FLAGSMITH_KEY = "BULLET_TRAIN_DB";
const FLAGSMITH_EVENT = "BULLET_TRAIN_EVENT";
const defaultAPI = 'https://edge.api.flagsmith.com/api/v1/';
// @ts-ignore
import deepEqual from 'fast-deep-equal';
let eventSource:typeof EventSource;
const initError = function (caller:string) {
    return "Attempted to " + caller + " a user before calling flagsmith.init. Call flagsmith.init first, if you wish to prevent it sending a request for flags, call init with preventFetch:true."
}

type Config= {browserlessStorage?:boolean, fetch?:LikeFetch, AsyncStorage?:AsyncStorageType, eventSource?:any};

const Flagsmith = class {
    eventSource:EventSource|null = null
    constructor(props: Config) {
        if (props.fetch) {
            _fetch = props.fetch as LikeFetch;
        } else {
            _fetch = (typeof fetch !== 'undefined'? fetch : global?.fetch) as LikeFetch;
        }

        this.canUseStorage = typeof window!=='undefined' || !!props.browserlessStorage;

        this.log("Constructing flagsmith instance " + props)
        if (props.eventSource) {
            eventSource = props.eventSource;
        }
        if (props.AsyncStorage) {
            AsyncStorage = props.AsyncStorage;
        }
    }

    getJSON = (url:string, method?:"GET"|"POST"|"PUT", body?:string) => {
        const { environmentID, headers } = this;
        const options: RequestOptions = {
            method: method || 'GET',
            body,
            headers: {
                'x-environment-key': `${environmentID}`
            }
        };
        if (method && method !== "GET")
            options.headers['Content-Type'] = 'application/json; charset=utf-8'

        if (headers) {
            Object.assign(options.headers, headers)
        }

        if (!_fetch) {
            console.error("Flagsmith: fetch is undefined, please specify a fetch implementation into flagsmith.init to support SSR.");
        }

        return _fetch(url, options)
            .then(res => {
                this.log("Fetch response: "+ res.status + " " + (method||"GET") +  + " " + url)
                return res.text!()
                    .then((text) => {
                        let err = text;
                        try {
                            err = JSON.parse(text);
                        } catch (e) {}
                        return res.status >= 200 && res.status ? err : Promise.reject(err);
                    })
            }).catch((e)=>{
                console.error("Flagsmith: Fetch error: " + e)
                throw new Error("Flagsmith: Fetch error:" + e)
            })
    };

    getFlags = (resolve?:(v?:any)=>any, reject?:(v?:any)=>any) => {
        const { onChange, onError, identity, api } = this;
        let resolved = false;
        this.log("Get Flags")
        const handleResponse = ({ flags: features, traits }:IFlagsmithResponse) => {
            if (identity) {
                this.withTraits = null;
            }
            // Handle server response
            let flags:IFlags = {};
            let userTraits: ITraits = {};
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
            this.oldFlags = {
                ...this.flags
            };
            const flagsEqual = deepEqual(this.flags, flags);
            const traitsEqual = deepEqual(this.traits, userTraits);
            this.flags = flags;
            this.traits = userTraits;
            this.updateStorage();
            if (this.dtrum) {
                let traits: DynatraceObject = {
                    javaDouble: {},
                    date: {},
                    shortString: {},
                    javaLongOrObject: {},
                }
                Object.keys(this.flags).map((key)=>{
                    setDynatraceValue(traits, "flagsmith_value_"+key, this.getValue(key) )
                    setDynatraceValue(traits, "flagsmith_enabled_"+key, this.hasFeature(key) )
                })
                Object.keys(this.traits).map((key)=>{
                    setDynatraceValue(traits, "flagsmith_trait_"+key, this.getTrait(key) )
                })
                this.log("Sending javaLongOrObject traits to dynatrace", traits.javaLongOrObject)
                this.log("Sending date traits to dynatrace", traits.date)
                this.log("Sending shortString traits to dynatrace", traits.shortString)
                this.log("Sending javaDouble to dynatrace", traits.javaDouble)
                // @ts-expect-error
                this.dtrum.sendSessionProperties(
                    traits.javaLongOrObject, traits.date, traits.shortString, traits.javaDouble
                )
            }
            if(this.trigger) {
                this.log("trigger called")
                this.trigger()
            }
            if (onChange) {
                onChange(this.oldFlags, {
                    isFromServer: true,
                    flagsChanged: !flagsEqual,
                    traitsChanged: !traitsEqual
                });
            }
        };

        if (identity) {
            return Promise.all([
                this.withTraits?
                    this.getJSON(api + 'identities/', "POST", JSON.stringify({
                        "identifier": identity,
                        traits: Object.keys(this.withTraits).map((k)=>({
                            "trait_key":k,
                            "trait_value": this.withTraits![k]
                        }))
                    })):
                this.getJSON(api + 'identities/?identifier=' + encodeURIComponent(identity)),
            ])
                .then((res) => {
                    this.withTraits = null
                    handleResponse(res[0] as IFlagsmithResponse)
                    if (resolve && !resolved) {
                        resolved = true;
                        resolve();
                    }
                }).catch(({ message }) => {
                    onError && onError({ message })
                });
        } else {
            return Promise.all([
                this.getJSON(api + "flags/")
            ])
                .then((res) => {
                    handleResponse({ flags: res[0] as IFlagsmithResponse['flags'], traits:undefined })
                    if (resolve && !resolved) {
                        resolved = true;
                        resolve();
                    }
                }).catch((err) => {
                    if (reject && !resolved) {
                        resolved = true;
                        reject(err);
                    }
                    onError && onError(err)
                });
        }
    };

    analyticsFlags = () => {
        const { api } = this;

        if (!this.evaluationEvent|| !this.evaluationEvent[this.environmentID]) {
            return
        }

        if (this.evaluationEvent && Object.getOwnPropertyNames(this.evaluationEvent).length !== 0 && Object.getOwnPropertyNames(this.evaluationEvent[this.environmentID]).length !== 0) {
            return this.getJSON(api + 'analytics/flags/', 'POST', JSON.stringify(this.evaluationEvent[this.environmentID]))
                .then((res) => {
                    const state = this.getState();
                    if(!this.evaluationEvent) {
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

    canUseStorage = false
    analyticsInterval: NodeJS.Timer | null= null
    api: string|null= null
    cacheFlags= false
    ts: number|null= null
    enableAnalytics= false
    enableLogs= false
    environmentID: string = ""
    evaluationEvent: Record<string, Record<string, number>> | null= null
    flags:IFlags|null= null
    getFlagInterval: NodeJS.Timer|null= null
    headers?: object | null= null
    initialised= false
    oldFlags:IFlags|null= null
    onChange:IInitConfig['onChange']|null= null
    onError:IInitConfig['onError']|null = null
    trigger?:(()=>void)|null= null
    identity?: string|null= null
    ticks: number|null= null
    timer: number|null= null
    traits:ITraits|null= null
    dtrum= null
    withTraits?: ITraits|null= null
    cacheOptions = {ttl:0, skipAPI: false}
    init({
        environmentID,
        api = defaultAPI,
        headers,
        onChange,
        cacheFlags,
        onError,
        defaultFlags,
        fetch:fetchImplementation,
        preventFetch,
        enableLogs,
        enableDynatrace,
        enableAnalytics,
        realtime,
        eventSourceUrl= "https://realtime.flagsmith.com/",
        AsyncStorage: _AsyncStorage,
        identity,
        traits,
        _trigger,
        state,
        cacheOptions,
        angularHttpClient,
         }: IInitConfig) {

        return new Promise((resolve, reject) => {
            this.environmentID = environmentID;
            this.api = api;
            this.headers = headers;
            this.getFlagInterval = null;
            this.analyticsInterval = null;
            this.onChange = onChange;
            this.trigger = _trigger || this.trigger;
            this.onError = onError;
            this.identity = identity;
            this.withTraits = traits;
            this.enableLogs = enableLogs|| false;
            this.cacheOptions = cacheOptions? {skipAPI: !!cacheOptions.skipAPI, ttl: cacheOptions.ttl || 0} : this.cacheOptions;
            if (!this.cacheOptions.ttl && this.cacheOptions.skipAPI) {
                console.warn("Flagsmith: you have set a cache ttl of 0 and are skipping API calls, this means the API will not be hit unless you clear local storage.")
            }
            if(fetchImplementation) {
                _fetch = fetchImplementation;
            }
            this.enableAnalytics = enableAnalytics ? enableAnalytics : false;
            this.flags = Object.assign({}, defaultFlags) || {};
            this.initialised = true;
            this.ticks = 10000;
            if (realtime && typeof window !== 'undefined') {
                const connectionUrl = eventSourceUrl + "sse/environments/" +  environmentID + "/stream";
                if(!eventSource) {
                    this.log("Error, EventSource is undefined");
                } else if (!this.eventSource) {
                    this.log("Creating event source with url " + connectionUrl)
                    this.eventSource = new eventSource(connectionUrl)
                    this.eventSource.addEventListener("environment_updated", (e)=>{
                        this.log("Received eventsource message")
                        this.getFlags()
                    })
                }
            }

            this.log("Initialising with properties",{
                environmentID,
                api,
                headers,
                onChange,
                cacheFlags,
                onError,
                defaultFlags,
                preventFetch,
                enableLogs,
                enableAnalytics,
                AsyncStorage,
                identity,
                traits,
                _trigger,
                state,
                angularHttpClient,
            }, this)

            this.timer = this.enableLogs ? new Date().valueOf() : null;
            if (_AsyncStorage) {
                AsyncStorage = _AsyncStorage;
            }
            this.cacheFlags = typeof AsyncStorage !== 'undefined' && !!cacheFlags;
            this.setState(state as IState)
            if (!environmentID) {
                reject('Please specify a environment id')
                throw ('Please specify a environment id');
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

            if(angularHttpClient) {
                // @ts-expect-error
                _fetch = (url: string, params: { headers: Record<string, string>, method: "GET" | "POST" | "PUT", body: string }) => {
                    const {headers, method, body} = params
                    return new Promise((resolve) => {
                        switch (method) {
                            case "GET": {
                                return angularHttpClient.get(url, {
                                    headers,
                                }).subscribe((v:string) => {
                                    resolve({
                                        ok: true,
                                        text: () => Promise.resolve(v)
                                    })
                                })
                            }
                            case "POST": {
                                return angularHttpClient.post(url, body, {
                                    headers,
                                }).subscribe((v:string) => {
                                    resolve({
                                        ok: true,
                                        text: () => Promise.resolve(v)
                                    })
                                })
                            }
                            case "PUT": {
                                return angularHttpClient.post(url, body, {
                                    headers,
                                }).subscribe((v:string) => {
                                    resolve({
                                        ok: true,
                                        text: () => Promise.resolve(v)
                                    })
                                })
                            }
                        }
                    })
                }
            }

            if (AsyncStorage && this.canUseStorage) {
                AsyncStorage.getItem(FLAGSMITH_EVENT)
                    .then((res)=>{
                        if (res){
                            try {
                                this.evaluationEvent = JSON.parse(res)

                            } catch (e){
                                this.evaluationEvent = {};
                            }
                        } else {
                            this.evaluationEvent = {};
                        }
                        this.analyticsInterval = setInterval(this.analyticsFlags, this.ticks!);
                        return true
                    })
            }


            if (this.enableAnalytics) {
                if (this.analyticsInterval) {
                    clearInterval(this.analyticsInterval);
                }

                if (AsyncStorage && this.canUseStorage) {
                    AsyncStorage.getItem(FLAGSMITH_EVENT, (err, res) => {
                        if (res) {
                            var json = JSON.parse(res);
                            if (json[this.environmentID]) {
                                state = this.getState();
                                this.log("Retrieved events from cache", res);
                                this.setState({
                                    ...state,
                                    evaluationEvent: json[this.environmentID],
                                });
                            }
                        }
                        return true
                    });
                }

            }

            //If the user specified default flags emit a changed event immediately
            if (cacheFlags) {
                if (AsyncStorage && this.canUseStorage) {
                    AsyncStorage.getItem(FLAGSMITH_KEY, (err, res) => {
                        if (res) {
                            try {
                                var json = JSON.parse(res);
                                let cachePopulated = false;
                                if (json && json.api === this.api && json.environmentID === this.environmentID) {
                                    let setState = true;
                                    if(this.identity && (json.identity!==this.identity)) {
                                        this.log("Ignoring cache,  identity has changed from " + json.identity + " to " + this.identity )
                                        setState = false;
                                    }
                                    if(this.cacheOptions.ttl){
                                        if (!json.ts || (new Date().valueOf() - json.ts > this.cacheOptions.ttl)) {
                                            if (json.ts) {
                                                this.log("Ignoring cache, timestamp is too old ts:" + json.ts + " ttl: " + this.cacheOptions.ttl + " time elapsed since cache: " + (new Date().valueOf()-json.ts)+"ms")
                                                setState = false;
                                            }
                                        }
                                    }
                                    if (setState) {
                                        cachePopulated = true;
                                        this.setState(json);
                                        this.log("Retrieved flags from cache", json);
                                    }
                                }

                                if (this.flags) { // retrieved flags from local storage

                                    if(this.trigger) {
                                        this.log("trigger called")
                                        this.trigger()
                                    }
                                    if (this.onChange) {
                                        this.log("onChange called")
                                        this.onChange(null, { isFromServer: false, flagsChanged: true, traitsChanged: !!this.traits });
                                    }
                                    this.oldFlags = this.flags;
                                    resolve(true);
                                    if (this.cacheOptions.skipAPI && cachePopulated) {
                                        this.log("Skipping API, using cache")
                                    }
                                    if (!preventFetch && (!this.cacheOptions.skipAPI||!cachePopulated)) {
                                        this.getFlags();
                                    }
                                } else {
                                    if (!preventFetch) {
                                        this.getFlags(resolve, reject);
                                    } else {
                                        resolve(true);
                                    }
                                }
                            } catch (e) {
                                this.log("Exception fetching cached logs", e);
                            }
                        } else {
                            if (!preventFetch) {
                                this.getFlags(resolve, reject)
                            } else {
                                if (defaultFlags) {
                                    if(this.trigger) {
                                        this.log("trigger called")
                                        this.trigger()
                                    }
                                    if (this.onChange) {
                                        this.log("onChange called")
                                        this.onChange(null, { isFromServer: false, flagsChanged: true, traitsChanged: !!this.traits });
                                    }
                                }
                                resolve(true);
                            }
                        }
                        return true
                    });
                }
            } else if (!preventFetch) {
                this.getFlags(resolve, reject);
            } else {
                if (defaultFlags) {
                    if(this.trigger) {
                        this.log("trigger called")
                        this.trigger()
                    }
                    if (this.onChange) {
                        this.log("onChange called")
                        this.onChange(null, { isFromServer: false, flagsChanged: true, traitsChanged:!!this.traits });
                    }
                }
                resolve(true);
            }
        })
        .catch(error => {
            this.log("Error during initialisation ", error)
            onError && onError(error)
        });
    }

    getAllFlags() {
        return this.flags;
    }

    identify(userId: string, traits?:ITraits) {
        this.identity = userId;
        this.log("Identify: " + this.identity)

        if(traits) {
            this.withTraits = {
                ...(this.withTraits||{}),
                ...traits
            };
        }
        if (this.initialised) {
            return this.getFlags();
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
            this.evaluationEvent = state.evaluationEvent || this.evaluationEvent;
            this.log("setState called", this)
        }
    }

    log(...args: (unknown)[]) {
        if (this.enableLogs) {
            console.log.apply(this, ["FLAGSMITH:", new Date().valueOf() - (this.timer||0), "ms", ...args]);
        }
    }

    updateStorage() {
        if (this.cacheFlags) {
            this.ts = new Date().valueOf()
            const state = JSON.stringify(this.getState());
            this.log("Setting storage", state);
            AsyncStorage!.setItem(FLAGSMITH_KEY, state);
        }
    }

    updateEventStorage() {
        if (this.enableAnalytics) {
            const events = JSON.stringify(this.getState().evaluationEvent);
            this.log("Setting event storage", events);
            AsyncStorage!.setItem(FLAGSMITH_EVENT, events);
        }
    }

    logout() {
        this.identity = null;
        this.traits = null;
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

    getSegments() {
        // noop for now
        // return this.segments;
    }

    evaluateFlag = (key:string) => {
        if (this.enableAnalytics) {
            if (!this.evaluationEvent) return;
            if(!this.evaluationEvent[this.environmentID]) {
                this.evaluationEvent[this.environmentID] = {};
            }
            if (this.evaluationEvent[this.environmentID][key] === undefined) {
                this.evaluationEvent[this.environmentID][key] = 0;
            }
            this.evaluationEvent[this.environmentID][key] += 1;
        }
        this.updateEventStorage();
    }

    getValue = (key:string, options?: GetValueOptions) => {
        const flag = this.flags && this.flags[key.toLowerCase().replace(/ /g, '_')];
        let res = null;
        if (flag) {
            res = flag.value;
        }

        this.evaluateFlag(key);

        if (options?.json) {
            try {
                if (res === null) {
                    this.log("Tried to parse null flag as JSON: " + key)
                    return options.fallback;
                }
                return JSON.parse(res as string)
            } catch (e) {
                return options.fallback
            }
        }
        //todo record check for value
        return res;
    }

    getTrait = (key:string) => {
        const trait = this.traits && this.traits[key.toLowerCase().replace(/ /g, '_')];
        return trait;
    }

    getAllTraits = () => {
        return this.traits
    }

    setTrait = (key:string, trait_value:IFlagsmithTrait) => {
        const { api } = this;

        if (!api) {
            console.error(initError("setTrait"))
            return
        }
        const traits:ITraits<string> = {};
        traits[key] = trait_value;
        return this.setTraits(traits)
    };

    setTraits = (traits:ITraits) => {

        if (!this.api) {
            console.error(initError("setTraits"))
            return
        }

        if (!traits || typeof traits !== 'object') {
            console.error("Expected object for flagsmith.setTraits");
        }

        this.withTraits = {
            ...(this.withTraits||{}),
            ...traits
        };

        if (!this.identity) {
            this.log("Set traits prior to identifying", this.withTraits);
            return
        }
        if (this.initialised) {
            return this.getFlags()
        }
    };

    hasFeature = (key:string) => {
        const flag = this.flags && this.flags[key.toLowerCase().replace(/ /g, '_')];
        let res = false;
        if (flag && flag.enabled) {
            res = true;
        }
        this.evaluateFlag(key);

        //todo record check for feature

        return res;
    }

};

export default function ({ fetch, browserlessStorage, AsyncStorage, eventSource }:Config):IFlagsmith {
    return new Flagsmith({ fetch, AsyncStorage, eventSource }) as IFlagsmith;
};

// transforms any trait to match sendSessionProperties
// https://www.dynatrace.com/support/doc/javascriptapi/interfaces/dtrum_types.DtrumApi.html#addActionProperties
const setDynatraceValue = function (obj: DynatraceObject, trait: string, value: string|number|boolean|null|undefined) {
    let key: keyof DynatraceObject= 'shortString'
    let convertToString = true
    if (typeof value === 'number') {
        key = 'javaDouble'
        convertToString = false
    }
    // @ts-expect-error
    obj[key] = obj[key] || {}
    // @ts-expect-error
    obj[key][trait] = convertToString ? value+"":value
}
