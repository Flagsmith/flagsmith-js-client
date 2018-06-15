let fetch;
let AsyncStorage;
const BULLET_TRAIN_KEY = "BULLET_TRAIN_DB";

const BulletTrain = class {

    constructor(props) {
        fetch = props.fetch;
        AsyncStorage = props.AsyncStorage;
    }

    getJSON = (url, method) => {
        const {environmentID} = this;
        console.log(url, environmentID)
        return fetch(url + '?format=json', {
            method: method || 'GET',
            headers: {
                'x-environment-key': environmentID
            }
        })
            .then(res => res.json());
    };

    getFlags = () => {
        const {onChange, onError, identity, api, disableCache} = this;

        const handleResponse = (res) => {
            // Handle server response
            let flags = {};
            res.forEach(feature => {
                flags[feature.feature.name.toLowerCase().replace(/ /g, '_')] = {
                    enabled: feature.enabled,
                    value: feature.feature_state_value
                };
            });
            this.oldFlags = flags;
            this.flags = flags;
            if (!disableCache) {
                AsyncStorage.setItem(BULLET_TRAIN_KEY, JSON.stringify(this.flags))
            }
            onChange && onChange(this.oldFlags, {isFromServer: true});
        };

        if (identity) {
            return this.getJSON(api + 'flags/' + identity)
                .then(res => {
                    handleResponse(res)
                }).catch(({message}) => {
                    onError && onError({message})
                });
        } else {
            return this.getJSON(api + "flags/")
                .then(res => {
                    handleResponse(res)
                }).catch(({message}) => {
                    onError && onError({message})
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
                    onChange(null, {isFromServer: false});
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

module.exports = function ({fetch, AsyncStorage}) {
    return new BulletTrain({fetch, AsyncStorage});
};


