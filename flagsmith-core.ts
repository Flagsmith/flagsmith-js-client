import {IFlagsmith, IInitConfig} from "./types";
var global = typeof global != "undefined" ? global: typeof window != 'undefined' ? window : {}
let _fetch: typeof global.fetch;
let AsyncStorage;
const FLAGSMITH_KEY = "BULLET_TRAIN_DB";
const FLAGSMITH_EVENT = "BULLET_TRAIN_EVENT";
const defaultAPI = 'https://edge.api.flagsmith.com/api/v1/';
import deepEqual from 'fast-deep-equal';

const initError = function (caller) {
    return "Attempted to " + caller + " a user before calling flagsmith.init. Call flagsmith.init first, if you wish to prevent it sending a request for flags, call init with preventFetch:true."
}

const Flagsmith = class {

    constructor(props) {
        if (props.fetch) {
            _fetch = props.fetch;
        } else {
            _fetch = typeof fetch !== 'undefined'? fetch : global.fetch;
        }
        AsyncStorage = props.AsyncStorage;
    }

    getJSON = (url:string, method?:"GET"|"POST"|"PUT", body?:BodyInit) => {
        const { environmentID, headers } = this;
        const options = {
            method: method || 'GET',
            body,
            headers: {
                'x-environment-key': environmentID
            }
        };
        if (method && method !== "GET")
            options.headers['Content-Type'] = 'application/json; charset=utf-8'

        if (headers) {
            Object.assign(options.headers, headers)
        }
        return _fetch(url, options)
            .then(res => {
                return res.text()
                    .then((text) => {
                        let err = text;
                        try {
                            err = JSON.parse(text);
                        } catch (e) {}
                        return res.ok ? err : Promise.reject(err);
                    })
            })
    };

    getFlags = (resolve?:(v?:any)=>any, reject?:(v?:any)=>any) => {
        const { onChange, onError, identity, api } = this;
        let resolved = false;
        const handleResponse = ({ flags: features, traits }) => {
            if (identity) {
                this.withTraits = false;
            }
            // Handle server response
            let flags = {};
            let userTraits = {};
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
                let traits: {
                    "javaLongOrObject": Record<string, number>,
                    "date": Record<string, Date>,
                    "shortString": Record<string, string>,
                    "javaDouble": Record<string, number>,
                } = {
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
                this.dtrum.sendSessionProperties(
                    traits.javaLongOrObject, traits.date, traits.shortString, traits.javaDouble
                )
            }
            if(this.trigger) {
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
                            "trait_value": this.withTraits[k]
                        }))
                    })):
                this.getJSON(api + 'identities/?identifier=' + encodeURIComponent(identity)),
            ])
                .then((res) => {
                    // @ts-ignore
                    this.withTraits = false
                    handleResponse(res[0])
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
                    // @ts-ignore
                    handleResponse({ flags: res[0] })
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
        if (Object.getOwnPropertyNames(this.evaluationEvent).length !== 0) {
            return this.getJSON(api + 'analytics/flags/', 'POST', JSON.stringify(this.evaluationEvent))
                .then((res) => {
                    const state = this.getState();
                    this.setState({
                        ...state,
                        evaluationEvent: {},
                    });
                    this.updateEventStorage();
                }).catch((err) => {
                    this.log("Exception fetching evaluationEvent", err);
                });
        }
    };

    analyticsInterval= null
    api= null
    cacheFlags= null
    enableAnalytics= null
    enableLogs= null
    environmentID= null
    evaluationEvent= null
    flags= null
    getFlagInterval= null
    headers= null
    initialised= null
    oldFlags= null
    onChange= null
    onError= null
    trigger= null
    identity= null
    ticks= null
    timer= null
    traits= null
    dtrum= null
    withTraits= null

    init({
        environmentID,
        api = defaultAPI,
        headers,
        onChange,
        cacheFlags,
        onError,
        defaultFlags,
        preventFetch,
        enableLogs,
        enableDynatrace,
        enableAnalytics,
        AsyncStorage: _AsyncStorage,
        identity,
        traits,
        _trigger,
        state,
        angularHttpClient,
         }: IInitConfig) {

        return new Promise((resolve, reject) => {
            this.environmentID = environmentID;
            this.api = api;
            this.headers = headers;
            this.getFlagInterval = null;
            this.analyticsInterval = null;
            this.onChange = onChange;
            this.trigger = _trigger;
            this.onError = onError;
            this.identity = identity;
            this.withTraits = traits;
            this.enableLogs = enableLogs;
            this.enableAnalytics = enableAnalytics ? enableAnalytics : false;
            this.flags = Object.assign({}, defaultFlags) || {};
            this.initialised = true;
            this.ticks = 10000;

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
            this.cacheFlags = typeof AsyncStorage !== 'undefined' && cacheFlags;
            this.setState(state)
            if (!environmentID) {
                reject('Please specify a environment id')
                throw ('Please specify a environment id');
            }

            if (enableDynatrace) {
                // @ts-ignore
                if (typeof dtrum === 'undefined') {
                    console.error("You have attempted to enable dynatrace but dtrum is undefined, please check you have the Dynatrace RUM JavaScript API installed.")
                } else {
                    // @ts-ignore
                    this.dtrum = dtrum;
                }
            }

            if(angularHttpClient) {
                _fetch = (url: string, params: { headers: Record<string, string>, method: "GET" | "POST" | "PUT", body: string }) => {
                    const {headers, method, body} = params
                    return new Promise((resolve) => {
                        switch (method) {
                            case "GET": {
                                return angularHttpClient.get(url, {
                                    headers,
                                }).subscribe((v) => {
                                    resolve({
                                        ok: 1,
                                        text: () => Promise.resolve(v)
                                    })
                                })
                            }
                            case "POST": {
                                return angularHttpClient.post(url, body, {
                                    headers,
                                }).subscribe((v) => {
                                    resolve({
                                        ok: 1,
                                        text: () => Promise.resolve(v)
                                    })
                                })
                            }
                            case "PUT": {
                                return angularHttpClient.post(url, body, {
                                    headers,
                                }).subscribe((v) => {
                                    resolve({
                                        ok: 1,
                                        text: () => Promise.resolve(v)
                                    })
                                })
                            }
                        }
                    })
                }
            }

            if (AsyncStorage && typeof window!=='undefined') {
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
                        this.analyticsInterval = setInterval(this.analyticsFlags, this.ticks);
                        return true
                    })
            }


            if (this.enableAnalytics) {
                if (this.analyticsInterval) {
                    clearInterval(this.analyticsInterval);
                }

                if (AsyncStorage && typeof window!=='undefined') {
                    AsyncStorage.getItem(FLAGSMITH_EVENT, (err, res) => {
                        if (res) {
                            var json = JSON.parse(res);
                            if (json) {
                                state = this.getState();
                                this.log("Retrieved events from cache", res);
                                this.setState({
                                    ...state,
                                    evaluationEvent: json,
                                });
                            }
                        }
                        return true
                    });
                }

            }

            //If the user specified default flags emit a changed event immediately
            if (cacheFlags) {
                if (AsyncStorage && typeof window!=='undefined') {
                    AsyncStorage.getItem(FLAGSMITH_KEY, (err, res) => {
                        if (res) {
                            try {
                                var json = JSON.parse(res);
                                if (json && json.api === this.api && json.environmentID === this.environmentID) {
                                    this.setState(json);
                                    this.log("Retrieved flags from cache", json);
                                }

                                if (this.flags) { // retrieved flags from local storage
                                    if(this.trigger) {
                                        this.trigger()
                                    }
                                    if (this.onChange) {
                                        this.onChange(null, { isFromServer: false });
                                    }
                                    this.oldFlags = this.flags;
                                    resolve(true);
                                    if (!preventFetch) {
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
                                        this.trigger()
                                    }
                                    if (this.onChange) {
                                        this.onChange(null, { isFromServer: false });
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
                        this.trigger()
                    }
                    if (this.onChange) {
                        this.onChange(null, { isFromServer: false });
                    }
                }
                resolve(true);
            }
        })
        .catch(error => onError && onError(error));
    }

    getAllFlags() {
        return this.flags;
    }

    identify(userId, traits) {
        this.identity = userId;
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
            traits: this.traits,
            evaluationEvent: this.evaluationEvent,
        }
    }

    setState(state) {
        if (state) {
            this.initialised = true;
            this.api = state.api || this.api || defaultAPI;
            this.environmentID = state.environmentID || this.environmentID;
            this.flags = state.flags || this.flags;
            this.identity = state.identity || this.identity;
            this.traits = state.traits || this.traits;
            this.evaluationEvent = state.evaluationEvent || this.evaluationEvent;
        }
    }

    log(...args) {
        if (this.enableLogs) {
            console.log.apply(this, ["FLAGSMITH:", new Date().valueOf() - this.timer, "ms", ...args]);
        }
    }

    updateStorage() {
        if (this.cacheFlags) {
            const state = JSON.stringify(this.getState());
            this.log("Setting storage", state);
            AsyncStorage.setItem(FLAGSMITH_KEY, state);
        }
    }

    updateEventStorage() {
        if (this.enableAnalytics) {
            const events = JSON.stringify(this.getState().evaluationEvent);
            this.log("Setting event storage", events);
            AsyncStorage.setItem(FLAGSMITH_EVENT, events);
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
        clearInterval(this.getFlagInterval);
        this.getFlagInterval = null;
    }

    getSegments() {
        // noop for now
        // return this.segments;
    }

    evaluateFlag = (key) => {
        if (this.enableAnalytics) {
            if (!this.evaluationEvent) return;
            if (this.evaluationEvent[key] === undefined) {
                this.evaluationEvent[key] = 0;
            }
            this.evaluationEvent[key] += 1;
        }
        this.updateEventStorage();
    }

    getValue = (key) => {
        const flag = this.flags && this.flags[key.toLowerCase().replace(/ /g, '_')];
        let res = null;
        if (flag) {
            res = flag.value;
        }
        this.evaluateFlag(key);

        //todo record check for value

        return res;
    }

    getTrait = (key) => {
        const trait = this.traits && this.traits[key.toLowerCase().replace(/ /g, '_')];
        return trait;
    }

    setTrait = (key, trait_value) => {
        const { getJSON, identity, api } = this;

        if (!api) {
            console.error(initError("setTrait"))
            return
        }
        const traits = {}
        traits[key] = trait_value
        if (!this.identity) {

            this.withTraits = {
                ...(this.withTraits||{}),
                ...traits
            };
            this.log("Set trait prior to identifying", this.withTraits);

            return
        }


        const body = {
            "identity": {
                "identifier": identity
            },
            "trait_key": key,
            "trait_value": trait_value
        }

        return getJSON(`${api}traits/`, 'POST', JSON.stringify(body))
            .then(() => {
                if (this.initialised) {
                    this.getFlags()
                }
            })
    };

    setTraits = (traits) => {
        const { getJSON, identity, api } = this;

        if (!api) {
            console.error(initError("setTraits"))
            return
        }

        if (!traits || typeof traits !== 'object') {
            console.error("Expected object for flagsmith.setTraits");
        }

        if (!this.identity) {
            this.withTraits = {
                ...(this.withTraits||{}),
                ...traits
            };

            this.log("Set traits prior to identifying", this.withTraits);
            return
        }

        return this.getJSON(api + 'identities/', "POST", JSON.stringify({
            "identifier": identity,
            traits: Object.keys(traits).map((k)=>({
                "trait_key":k,
                "trait_value": traits[k]
            }))
        })).then(() => {
            if (this.initialised) {
                this.getFlags()
            }
        })

    };

    hasFeature = (key) => {
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

type Config= {fetch?:any, AsyncStorage?:any};

export default function ({ fetch, AsyncStorage }:Config):IFlagsmith {
    return new Flagsmith({ fetch, AsyncStorage }) as IFlagsmith;
};

// transforms any trait to match sendSessionProperties
// https://www.dynatrace.com/support/doc/javascriptapi/interfaces/dtrum_types.DtrumApi.html#addActionProperties
const setDynatraceValue = function (obj, trait, value) {
    let key = 'shortString'
    let convertToString = true
    if (typeof value === 'number') {
        key = 'javaDouble'
        convertToString = false
    }
    obj[key] = obj[key] || {}
    obj[key][trait] = convertToString ? value+"":value
}
