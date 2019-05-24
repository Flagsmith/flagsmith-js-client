import engine from 'bullet-train-rules-engine';

let fetch;
let AsyncStorage;
const BULLET_TRAIN_KEY = "BULLET_TRAIN_DB";

const BulletTrain = class {

    constructor(props) {
        fetch = props.fetch;
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

        return fetch(url + '?format=json', options)
            .then(res => res.json());
    };

    getFlags = () => {
        const { onChange, onError, identity, api, disableCache } = this;

        const handleResponse = ({ flags: features, traits }, segments) => {
            // Handle server response
            let flags = {};
            let userTraits = {};
            let userSegments = {};
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
                if (!this.segments) {
                    segments = segments.map((s)=>{
                        return {...s, rules:JSON.parse(s.rules)};
                    });
                    this.segments = segments;
                }
               Promise.all(this.segments.map((segment)=>{
                  return engine(userTraits, segment.rules)
                      .then((res)=>{
                          userSegments[segment.name] = res.result;
                      })
               }))
                   .then(()=>{
                       this.userSegments = userSegments;
                       if (!disableCache) {
                           AsyncStorage.setItem(BULLET_TRAIN_KEY, JSON.stringify(this.flags))
                       }
                       onChange && onChange(this.oldFlags, { isFromServer: true });
                   })
            } else {
                if (!disableCache) {
                    AsyncStorage.setItem(BULLET_TRAIN_KEY, JSON.stringify(this.flags))
                }
                onChange && onChange(this.oldFlags, { isFromServer: true });
            }
        };

        if (identity) {
            return Promise.all([
                this.getJSON(api + 'identities/' + encodeURIComponent(identity) + '/'),
                this.segments? Promise.resolve(this.segments):this.getJSON(api + 'segments/'),
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
                }).catch(({ message }) => {
                    onError && onError({ message })
                });
        }
    };

    init({
             environmentID,
             api = 'https://api.bullet-train.io/api/v1/',
             onChange,
             disableCache,
             onError,
             defaultFlags
         }) {

        this.environmentID = environmentID;
        this.api = api;
        this.interval = null;
        this.disableCache = disableCache;
        this.onChange = onChange;
        this.onError = onError;
        this.flags = Object.assign({}, defaultFlags) || {};
        this.initialised = true;

        if (!environmentID) {
            throw('Please specify a environment id');
        }
        if (!onChange) {
            throw('Please specify an onChange event');
        }

        //If the user specified default flags emit a changed event immediately

        if (!disableCache) {
            AsyncStorage.getItem(BULLET_TRAIN_KEY, (err, res) => {
                this.flags = res ? JSON.parse(res) : defaultFlags;
                if (this.flags) {
                    onChange(null, { isFromServer: false });
                }
                this.getFlags();
            });
        }
    }

    getAllFlags() {
        return this.flags;
    }

    identify(userId) {
        this.identity = userId;
        if (this.initialised && !this.interval)
            this.getFlags();
    }

    logout() {
        this.identity = null;
        if (this.initialised && !this.interval)
            this.getFlags();
    }

    startListening(ticks = 1000) {
        if (this.interval) {
            return;
        }
        this.interval = setInterval(this.getFlags, ticks);
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

    getSegments = () => {
        return this.userSegments;
    }

    segment = (id) => {
        return this.userSegments && this.userSegments[id];
    }

    setTrait = (key, trait_value) => {
        const { getJSON, identity, api } = this;

        return getJSON(`${api}identities/${encodeURIComponent(identity)}/traits/${encodeURIComponent(key)}`, 'POST', JSON.stringify({ trait_value }))
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


