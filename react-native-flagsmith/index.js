(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["react-native-flagsmith"] = {}));
})(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    }

    // do not edit .js files directly - edit src/index.jst



    var fastDeepEqual = function equal(a, b) {
      if (a === b) return true;

      if (a && b && typeof a == 'object' && typeof b == 'object') {
        if (a.constructor !== b.constructor) return false;

        var length, i, keys;
        if (Array.isArray(a)) {
          length = a.length;
          if (length != b.length) return false;
          for (i = length; i-- !== 0;)
            if (!equal(a[i], b[i])) return false;
          return true;
        }



        if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
        if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
        if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();

        keys = Object.keys(a);
        length = keys.length;
        if (length !== Object.keys(b).length) return false;

        for (i = length; i-- !== 0;)
          if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

        for (i = length; i-- !== 0;) {
          var key = keys[i];

          if (!equal(a[key], b[key])) return false;
        }

        return true;
      }

      // true if both NaN, false otherwise
      return a!==a && b!==b;
    };

    var global = typeof global != "undefined" ? global : typeof window != 'undefined' ? window : {};
    var _fetch;
    var AsyncStorage;
    var FLAGSMITH_KEY = "BULLET_TRAIN_DB";
    var FLAGSMITH_EVENT = "BULLET_TRAIN_EVENT";
    var defaultAPI = 'https://edge.api.flagsmith.com/api/v1/';
    var initError = function (caller) {
        return "Attempted to " + caller + " a user before calling flagsmith.init. Call flagsmith.init first, if you wish to prevent it sending a request for flags, call init with preventFetch:true.";
    };
    var Flagsmith = /** @class */ (function () {
        function class_1(props) {
            var _this = this;
            this.getJSON = function (url, method, body) {
                var _a = _this, environmentID = _a.environmentID, headers = _a.headers;
                var options = {
                    method: method || 'GET',
                    body: body,
                    headers: {
                        'x-environment-key': environmentID
                    }
                };
                if (method && method !== "GET")
                    options.headers['Content-Type'] = 'application/json; charset=utf-8';
                if (headers) {
                    Object.assign(options.headers, headers);
                }
                return _fetch(url, options)
                    .then(function (res) {
                    return res.text()
                        .then(function (text) {
                        var err = text;
                        try {
                            err = JSON.parse(text);
                        }
                        catch (e) { }
                        return res.ok ? err : Promise.reject(err);
                    });
                });
            };
            this.getFlags = function (resolve, reject) {
                var _a = _this, onChange = _a.onChange, onError = _a.onError, identity = _a.identity, api = _a.api;
                var resolved = false;
                _this.log("Get Flags");
                var handleResponse = function (_a) {
                    var features = _a.flags, traits = _a.traits;
                    if (identity) {
                        _this.withTraits = false;
                    }
                    // Handle server response
                    var flags = {};
                    var userTraits = {};
                    features = features || [];
                    traits = traits || [];
                    features.forEach(function (feature) {
                        flags[feature.feature.name.toLowerCase().replace(/ /g, '_')] = {
                            id: feature.feature.id,
                            enabled: feature.enabled,
                            value: feature.feature_state_value
                        };
                    });
                    traits.forEach(function (trait) {
                        userTraits[trait.trait_key.toLowerCase().replace(/ /g, '_')] = trait.trait_value;
                    });
                    _this.oldFlags = __assign({}, _this.flags);
                    var flagsEqual = fastDeepEqual(_this.flags, flags);
                    var traitsEqual = fastDeepEqual(_this.traits, userTraits);
                    _this.flags = flags;
                    _this.traits = userTraits;
                    _this.updateStorage();
                    if (_this.dtrum) {
                        var traits_1 = {
                            javaDouble: {},
                            date: {},
                            shortString: {},
                            javaLongOrObject: {}
                        };
                        Object.keys(_this.flags).map(function (key) {
                            setDynatraceValue(traits_1, "flagsmith_value_" + key, _this.getValue(key));
                            setDynatraceValue(traits_1, "flagsmith_enabled_" + key, _this.hasFeature(key));
                        });
                        Object.keys(_this.traits).map(function (key) {
                            setDynatraceValue(traits_1, "flagsmith_trait_" + key, _this.getTrait(key));
                        });
                        _this.log("Sending javaLongOrObject traits to dynatrace", traits_1.javaLongOrObject);
                        _this.log("Sending date traits to dynatrace", traits_1.date);
                        _this.log("Sending shortString traits to dynatrace", traits_1.shortString);
                        _this.log("Sending javaDouble to dynatrace", traits_1.javaDouble);
                        _this.dtrum.sendSessionProperties(traits_1.javaLongOrObject, traits_1.date, traits_1.shortString, traits_1.javaDouble);
                    }
                    if (_this.trigger) {
                        _this.trigger();
                    }
                    if (onChange) {
                        onChange(_this.oldFlags, {
                            isFromServer: true,
                            flagsChanged: !flagsEqual,
                            traitsChanged: !traitsEqual
                        });
                    }
                };
                if (identity) {
                    return Promise.all([
                        _this.withTraits ?
                            _this.getJSON(api + 'identities/', "POST", JSON.stringify({
                                "identifier": identity,
                                traits: Object.keys(_this.withTraits).map(function (k) { return ({
                                    "trait_key": k,
                                    "trait_value": _this.withTraits[k]
                                }); })
                            })) :
                            _this.getJSON(api + 'identities/?identifier=' + encodeURIComponent(identity)),
                    ])
                        .then(function (res) {
                        // @ts-ignore
                        _this.withTraits = false;
                        handleResponse(res[0]);
                        if (resolve && !resolved) {
                            resolved = true;
                            resolve();
                        }
                    })["catch"](function (_a) {
                        var message = _a.message;
                        onError && onError({ message: message });
                    });
                }
                else {
                    return Promise.all([
                        _this.getJSON(api + "flags/")
                    ])
                        .then(function (res) {
                        // @ts-ignore
                        handleResponse({ flags: res[0] });
                        if (resolve && !resolved) {
                            resolved = true;
                            resolve();
                        }
                    })["catch"](function (err) {
                        if (reject && !resolved) {
                            resolved = true;
                            reject(err);
                        }
                        onError && onError(err);
                    });
                }
            };
            this.analyticsFlags = function () {
                var api = _this.api;
                if (Object.getOwnPropertyNames(_this.evaluationEvent).length !== 0) {
                    return _this.getJSON(api + 'analytics/flags/', 'POST', JSON.stringify(_this.evaluationEvent))
                        .then(function (res) {
                        var state = _this.getState();
                        _this.setState(__assign(__assign({}, state), { evaluationEvent: {} }));
                        _this.updateEventStorage();
                    })["catch"](function (err) {
                        _this.log("Exception fetching evaluationEvent", err);
                    });
                }
            };
            this.analyticsInterval = null;
            this.api = null;
            this.cacheFlags = null;
            this.ts = null;
            this.enableAnalytics = null;
            this.enableLogs = null;
            this.environmentID = null;
            this.evaluationEvent = null;
            this.flags = null;
            this.getFlagInterval = null;
            this.headers = null;
            this.initialised = null;
            this.oldFlags = null;
            this.onChange = null;
            this.onError = null;
            this.trigger = null;
            this.identity = null;
            this.ticks = null;
            this.timer = null;
            this.traits = null;
            this.dtrum = null;
            this.withTraits = null;
            this.cacheOptions = { ttl: 0, skipAPI: false };
            this.evaluateFlag = function (key) {
                if (_this.enableAnalytics) {
                    if (!_this.evaluationEvent)
                        return;
                    if (_this.evaluationEvent[key] === undefined) {
                        _this.evaluationEvent[key] = 0;
                    }
                    _this.evaluationEvent[key] += 1;
                }
                _this.updateEventStorage();
            };
            this.getValue = function (key) {
                var flag = _this.flags && _this.flags[key.toLowerCase().replace(/ /g, '_')];
                var res = null;
                if (flag) {
                    res = flag.value;
                }
                _this.evaluateFlag(key);
                //todo record check for value
                return res;
            };
            this.getTrait = function (key) {
                var trait = _this.traits && _this.traits[key.toLowerCase().replace(/ /g, '_')];
                return trait;
            };
            this.setTrait = function (key, trait_value) {
                var _a = _this, getJSON = _a.getJSON, identity = _a.identity, api = _a.api;
                if (!api) {
                    console.error(initError("setTrait"));
                    return;
                }
                var traits = {};
                traits[key] = trait_value;
                if (!_this.identity) {
                    _this.withTraits = __assign(__assign({}, (_this.withTraits || {})), traits);
                    _this.log("Set trait prior to identifying", _this.withTraits);
                    return;
                }
                var body = {
                    "identity": {
                        "identifier": identity
                    },
                    "trait_key": key,
                    "trait_value": trait_value
                };
                return getJSON("".concat(api, "traits/"), 'POST', JSON.stringify(body))
                    .then(function () {
                    if (_this.initialised) {
                        _this.getFlags();
                    }
                });
            };
            this.setTraits = function (traits) {
                var _a = _this; _a.getJSON; var identity = _a.identity, api = _a.api;
                if (!api) {
                    console.error(initError("setTraits"));
                    return;
                }
                if (!traits || typeof traits !== 'object') {
                    console.error("Expected object for flagsmith.setTraits");
                }
                if (!_this.identity) {
                    _this.withTraits = __assign(__assign({}, (_this.withTraits || {})), traits);
                    _this.log("Set traits prior to identifying", _this.withTraits);
                    return;
                }
                return _this.getJSON(api + 'identities/', "POST", JSON.stringify({
                    "identifier": identity,
                    traits: Object.keys(traits).map(function (k) { return ({
                        "trait_key": k,
                        "trait_value": traits[k]
                    }); })
                })).then(function () {
                    if (_this.initialised) {
                        _this.getFlags();
                    }
                });
            };
            this.hasFeature = function (key) {
                var flag = _this.flags && _this.flags[key.toLowerCase().replace(/ /g, '_')];
                var res = false;
                if (flag && flag.enabled) {
                    res = true;
                }
                _this.evaluateFlag(key);
                //todo record check for feature
                return res;
            };
            if (props.fetch) {
                _fetch = props.fetch;
            }
            else {
                _fetch = typeof fetch !== 'undefined' ? fetch : global.fetch;
            }
            AsyncStorage = props.AsyncStorage;
        }
        class_1.prototype.init = function (_a) {
            var _this = this;
            var environmentID = _a.environmentID, _b = _a.api, api = _b === void 0 ? defaultAPI : _b, headers = _a.headers, onChange = _a.onChange, cacheFlags = _a.cacheFlags, onError = _a.onError, defaultFlags = _a.defaultFlags, preventFetch = _a.preventFetch, enableLogs = _a.enableLogs, enableDynatrace = _a.enableDynatrace, enableAnalytics = _a.enableAnalytics, _AsyncStorage = _a.AsyncStorage, identity = _a.identity, traits = _a.traits, _trigger = _a._trigger, state = _a.state, cacheOptions = _a.cacheOptions, angularHttpClient = _a.angularHttpClient;
            return new Promise(function (resolve, reject) {
                _this.environmentID = environmentID;
                _this.api = api;
                _this.headers = headers;
                _this.getFlagInterval = null;
                _this.analyticsInterval = null;
                _this.onChange = onChange;
                _this.trigger = _trigger;
                _this.onError = onError;
                _this.identity = identity;
                _this.withTraits = traits;
                _this.enableLogs = enableLogs;
                _this.cacheOptions = cacheOptions ? { skipAPI: !!cacheOptions.skipAPI, ttl: cacheOptions.ttl || 0 } : _this.cacheOptions;
                _this.enableAnalytics = enableAnalytics ? enableAnalytics : false;
                _this.flags = Object.assign({}, defaultFlags) || {};
                _this.initialised = true;
                _this.ticks = 10000;
                _this.log("Initialising with properties", {
                    environmentID: environmentID,
                    api: api,
                    headers: headers,
                    onChange: onChange,
                    cacheFlags: cacheFlags,
                    onError: onError,
                    defaultFlags: defaultFlags,
                    preventFetch: preventFetch,
                    enableLogs: enableLogs,
                    enableAnalytics: enableAnalytics,
                    AsyncStorage: AsyncStorage,
                    identity: identity,
                    traits: traits,
                    _trigger: _trigger,
                    state: state,
                    angularHttpClient: angularHttpClient
                }, _this);
                _this.timer = _this.enableLogs ? new Date().valueOf() : null;
                if (_AsyncStorage) {
                    AsyncStorage = _AsyncStorage;
                }
                _this.cacheFlags = typeof AsyncStorage !== 'undefined' && cacheFlags;
                _this.setState(state);
                if (!environmentID) {
                    reject('Please specify a environment id');
                    throw ('Please specify a environment id');
                }
                if (enableDynatrace) {
                    // @ts-ignore
                    if (typeof dtrum === 'undefined') {
                        console.error("You have attempted to enable dynatrace but dtrum is undefined, please check you have the Dynatrace RUM JavaScript API installed.");
                    }
                    else {
                        // @ts-ignore
                        _this.dtrum = dtrum;
                    }
                }
                if (angularHttpClient) {
                    _fetch = function (url, params) {
                        var headers = params.headers, method = params.method, body = params.body;
                        return new Promise(function (resolve) {
                            switch (method) {
                                case "GET": {
                                    return angularHttpClient.get(url, {
                                        headers: headers
                                    }).subscribe(function (v) {
                                        resolve({
                                            ok: 1,
                                            text: function () { return Promise.resolve(v); }
                                        });
                                    });
                                }
                                case "POST": {
                                    return angularHttpClient.post(url, body, {
                                        headers: headers
                                    }).subscribe(function (v) {
                                        resolve({
                                            ok: 1,
                                            text: function () { return Promise.resolve(v); }
                                        });
                                    });
                                }
                                case "PUT": {
                                    return angularHttpClient.post(url, body, {
                                        headers: headers
                                    }).subscribe(function (v) {
                                        resolve({
                                            ok: 1,
                                            text: function () { return Promise.resolve(v); }
                                        });
                                    });
                                }
                            }
                        });
                    };
                }
                if (AsyncStorage && typeof window !== 'undefined') {
                    AsyncStorage.getItem(FLAGSMITH_EVENT)
                        .then(function (res) {
                        if (res) {
                            try {
                                _this.evaluationEvent = JSON.parse(res);
                            }
                            catch (e) {
                                _this.evaluationEvent = {};
                            }
                        }
                        else {
                            _this.evaluationEvent = {};
                        }
                        _this.analyticsInterval = setInterval(_this.analyticsFlags, _this.ticks);
                        return true;
                    });
                }
                if (_this.enableAnalytics) {
                    if (_this.analyticsInterval) {
                        clearInterval(_this.analyticsInterval);
                    }
                    if (AsyncStorage && typeof window !== 'undefined') {
                        AsyncStorage.getItem(FLAGSMITH_EVENT, function (err, res) {
                            if (res) {
                                var json = JSON.parse(res);
                                if (json) {
                                    state = _this.getState();
                                    _this.log("Retrieved events from cache", res);
                                    _this.setState(__assign(__assign({}, state), { evaluationEvent: json }));
                                }
                            }
                            return true;
                        });
                    }
                }
                //If the user specified default flags emit a changed event immediately
                if (cacheFlags) {
                    if (AsyncStorage && typeof window !== 'undefined') {
                        AsyncStorage.getItem(FLAGSMITH_KEY, function (err, res) {
                            if (res) {
                                try {
                                    var json = JSON.parse(res);
                                    var cachePopulated = false;
                                    if (json && json.api === _this.api && json.environmentID === _this.environmentID) {
                                        var setState = true;
                                        if (_this.cacheOptions.ttl) {
                                            if (!json.ts || (new Date().valueOf() - json.ts > _this.cacheOptions.ttl)) {
                                                if (json.ts) {
                                                    _this.log("Ignoring cache, timestamp is too old ts:" + json.ts + " ttl: " + _this.cacheOptions.ttl + " time elapsed since cache: " + (new Date().valueOf() - json.ts) + "ms");
                                                    setState = false;
                                                }
                                            }
                                        }
                                        if (setState) {
                                            cachePopulated = true;
                                            _this.setState(json);
                                            _this.log("Retrieved flags from cache", json);
                                        }
                                    }
                                    if (_this.flags) { // retrieved flags from local storage
                                        if (_this.trigger) {
                                            _this.trigger();
                                        }
                                        if (_this.onChange) {
                                            _this.onChange(null, { isFromServer: false });
                                        }
                                        _this.oldFlags = _this.flags;
                                        resolve(true);
                                        if (_this.cacheOptions.skipAPI && cachePopulated) {
                                            _this.log("Skipping API, using cache");
                                        }
                                        if (!preventFetch && (!_this.cacheOptions.skipAPI || !cachePopulated)) {
                                            _this.getFlags();
                                        }
                                    }
                                    else {
                                        if (!preventFetch) {
                                            _this.getFlags(resolve, reject);
                                        }
                                        else {
                                            resolve(true);
                                        }
                                    }
                                }
                                catch (e) {
                                    _this.log("Exception fetching cached logs", e);
                                }
                            }
                            else {
                                if (!preventFetch) {
                                    _this.getFlags(resolve, reject);
                                }
                                else {
                                    if (defaultFlags) {
                                        if (_this.trigger) {
                                            _this.trigger();
                                        }
                                        if (_this.onChange) {
                                            _this.onChange(null, { isFromServer: false });
                                        }
                                    }
                                    resolve(true);
                                }
                            }
                            return true;
                        });
                    }
                }
                else if (!preventFetch) {
                    _this.getFlags(resolve, reject);
                }
                else {
                    if (defaultFlags) {
                        if (_this.trigger) {
                            _this.trigger();
                        }
                        if (_this.onChange) {
                            _this.onChange(null, { isFromServer: false });
                        }
                    }
                    resolve(true);
                }
            })["catch"](function (error) { return onError && onError(error); });
        };
        class_1.prototype.getAllFlags = function () {
            return this.flags;
        };
        class_1.prototype.identify = function (userId, traits) {
            this.identity = userId;
            this.log("Identify: " + this.identity);
            if (traits) {
                this.withTraits = __assign(__assign({}, (this.withTraits || {})), traits);
            }
            if (this.initialised) {
                return this.getFlags();
            }
            return Promise.resolve();
        };
        class_1.prototype.getState = function () {
            return {
                api: this.api,
                environmentID: this.environmentID,
                flags: this.flags,
                identity: this.identity,
                ts: this.ts,
                traits: this.traits,
                evaluationEvent: this.evaluationEvent
            };
        };
        class_1.prototype.setState = function (state) {
            if (state) {
                this.initialised = true;
                this.api = state.api || this.api || defaultAPI;
                this.environmentID = state.environmentID || this.environmentID;
                this.flags = state.flags || this.flags;
                this.identity = state.identity || this.identity;
                this.traits = state.traits || this.traits;
                this.evaluationEvent = state.evaluationEvent || this.evaluationEvent;
            }
        };
        class_1.prototype.log = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (this.enableLogs) {
                console.log.apply(this, __spreadArray(["FLAGSMITH:", new Date().valueOf() - this.timer, "ms"], args, true));
            }
        };
        class_1.prototype.updateStorage = function () {
            if (this.cacheFlags) {
                this.ts = new Date().valueOf();
                var state = JSON.stringify(this.getState());
                this.log("Setting storage", state);
                AsyncStorage.setItem(FLAGSMITH_KEY, state);
            }
        };
        class_1.prototype.updateEventStorage = function () {
            if (this.enableAnalytics) {
                var events = JSON.stringify(this.getState().evaluationEvent);
                this.log("Setting event storage", events);
                AsyncStorage.setItem(FLAGSMITH_EVENT, events);
            }
        };
        class_1.prototype.logout = function () {
            this.identity = null;
            this.traits = null;
            if (this.initialised) {
                return this.getFlags();
            }
            return Promise.resolve();
        };
        class_1.prototype.startListening = function (ticks) {
            if (ticks === void 0) { ticks = 1000; }
            if (this.getFlagInterval) {
                clearInterval(this.getFlagInterval);
            }
            this.getFlagInterval = setInterval(this.getFlags, ticks);
        };
        class_1.prototype.stopListening = function () {
            clearInterval(this.getFlagInterval);
            this.getFlagInterval = null;
        };
        class_1.prototype.getSegments = function () {
            // noop for now
            // return this.segments;
        };
        return class_1;
    }());
    function core (_a) {
        var fetch = _a.fetch, AsyncStorage = _a.AsyncStorage;
        return new Flagsmith({ fetch: fetch, AsyncStorage: AsyncStorage });
    }
    // transforms any trait to match sendSessionProperties
    // https://www.dynatrace.com/support/doc/javascriptapi/interfaces/dtrum_types.DtrumApi.html#addActionProperties
    var setDynatraceValue = function (obj, trait, value) {
        var key = 'shortString';
        var convertToString = true;
        if (typeof value === 'number') {
            key = 'javaDouble';
            convertToString = false;
        }
        obj[key] = obj[key] || {};
        obj[key][trait] = convertToString ? value + "" : value;
    };

    var index_reactNative = core({});
    const createFlagsmithInstance = ()=>{
        return core({})
    };

    exports.createFlagsmithInstance = createFlagsmithInstance;
    exports["default"] = index_reactNative;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.js.map
