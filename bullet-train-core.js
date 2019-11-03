let fetch;
let AsyncStorage;
const BULLET_TRAIN_KEY = "BULLET_TRAIN_DB";
const defaultAPI = 'https://api.bullet-train.io/api/v1/';
const BulletTrain = class {

    constructor(props) {
        if (props.fetch) {
            fetch = props.fetch;
        } else {
            fetch = global.fetch;
        }
        AsyncStorage = props.AsyncStorage;
    }

    getJSON = (url, method, body) => {
        const { environmentID } = this;
        const options = {
            method: method || 'GET',
            body,
            headers: {
                'x-environment-key': environmentID
            }
        };
        if (method !== "GET")
            options.headers['Content-Type'] = 'application/json; charset=utf-8'
        return fetch(url, options)
            .then(res => res.json());
    };

    getFlags = (resolve,reject) => {
        const { onChange, onError, identity, api, disableCache } = this;
        let resolved = false;
        const handleResponse = ({ flags: features, traits }, segments) => {
            // Handle server response
            let flags = {};
            let userTraits = {};
            features = features||[];
            traits = traits||[];
            features.forEach(feature => {
                flags[feature.feature.name.toLowerCase().replace(/ /g, '_')] = {
                    enabled: feature.enabled,
                    value: feature.feature_state_value
                };
            });
            traits.forEach(trait => {
                userTraits[trait.trait_key.toLowerCase().replace(/ /g, '_')] = trait.trait_value
            });
            this.oldFlags = flags;
            this.flags = flags;
            this.traits = userTraits;
            if (segments) {
                let userSegments = {};
                segments.map((s)=>{
                    userSegments[s.name] = s;
                });
                this.segments = userSegments;
            }
            if (onChange) {
                onChange(this.oldFlags, { isFromServer: true });
            }
        };

        if (identity) {
            return Promise.all([
                this.getJSON(api + 'identities/?identifier=' + encodeURIComponent(identity)),
            ])
                .then((res) => {
                    handleResponse(res[0],res[1])
                }).catch(({ message }) => {
                    onError && onError({ message })
                });
        } else {
            return Promise.all([
                this.getJSON(api + "flags/")
            ])
                .then((res) => {
                    handleResponse({flags: res[0]},null)
                    console.log("GOT RESPONSE FROM BULLET TRAIN")
                    if (resolve && !resolved) {
                        resolved = true;
                        resolve();
                    }
                }).catch(({ message }) => {
                    if (reject && !resolved) {
                        resolved = true;
                        reject(message);
                    }
                    onError && onError({ message })
                });
        }
    };

    init({
             environmentID,
             api = defaultAPI,
             onChange,
             disableCache,
             onError,
             defaultFlags,
             state
         }) {

        console.log("Initialising");
        return new Promise((resolve, reject)=>{
            this.environmentID = environmentID;
            this.api = api;
            this.interval = null;
            this.disableCache = disableCache;
            this.onChange = onChange;
            this.onError = onError;
            this.flags = Object.assign({}, defaultFlags) || {};
            this.initialised = true;
            this.setState(state)
            if (!environmentID) {
                reject('Please specify a environment id')
                throw('Please specify a environment id');
            }

            //If the user specified default flags emit a changed event immediately

            if (!disableCache) {
                AsyncStorage.getItem(BULLET_TRAIN_KEY, (err, res) => {
                    this.flags = res ? JSON.parse(res) : defaultFlags;
                    if (this.flags && this.onChange) {
                        this.onChange(null, { isFromServer: false });
                    }
                    this.getFlags(resolve, reject);
                });
            }
        })
    }

    getAllFlags() {
        return this.flags;
    }

    identify(userId) {
        this.identity = userId;
        if (this.initialised && !this.interval)
            this.getFlags();
    }

    getState() {
        return {
            api: this.api,
            environmentID: this.environmentID,
            flags: this.flags,
            identity: this.identity,
            segments: this.segments,
            traits: this.traits,
        }
    }

    setState(state) {
        if (state) {
                this.initialised = true;
                this.api = state.api || this.api  || defaultAPI;
                this.environmentID = state.environmentID || this.environmentID ;
                this.flags = state.flags || this.flags;
                this.identity = state.identity || this.identity;
                this.segments = state.segments || this.segments;
                this.traits = state.traits || this.traits;
        }
    }

    logout() {
        this.identity = null;
        this.segments = null;
        this.traits = null;
        if (this.initialised && !this.interval) {
            this.getFlags();
        }
    }

    startListening(ticks = 1000) {
        if (this.interval) {
            return;
        }
        this.interval = setInterval(this.getFlags, ticks);
    }

    getSegments() {
        // noop for now
        // return this.segments;
    }

    stopListening() {
        clearInterval(this.interval);
    }

    getValue = (key) => {
        const flag = this.flags && this.flags[key];
        let res = null;
        if (flag) {
            res = flag.value;
        }
        //todo record check for value

        return res;
    }

    getTrait = (key) => {
        const trait = this.traits && this.traits[key];
        return trait;
    }

    setTrait = (key, trait_value) => {
        const { getJSON, identity, api } = this;

        const body = {
            "identity": {
                "identifier": identity
            },
            "trait_key": key,
            "trait_value": trait_value
        }

        return getJSON(`${api}traits/`, 'POST', JSON.stringify(body))
            .then(this.getFlags)
    };

    incrementTrait = (trait_key, increment_by) => {
        const { getJSON, identity, api } = this;
        return getJSON(`${api}traits/increment-value/`, 'POST', JSON.stringify({ trait_key, increment_by, identifier:identity }))
            .then(this.getFlags)
    };

    hasFeature = (key) => {
        const flag = this.flags && this.flags[key];
        let res = false;
        if (flag && flag.enabled) {
            res = true;
        }
        //todo record check for feature

        return res;
    }

};

module.exports = function ({ fetch, AsyncStorage }) {
    return new BulletTrain({ fetch, AsyncStorage });
};


