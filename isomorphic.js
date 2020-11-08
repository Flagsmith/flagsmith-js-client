let fetch = require("unfetch").default;
if (typeof window === 'undefined')  {
    fetch  = require('node-fetch').default;
}

import AsyncStorage from "@callstack/async-storage";
const bt = require('./flagsmith-core');
const bulletTrain = bt({AsyncStorage, fetch});
if (typeof window !== "undefined") {
    window.bulletTrain = bulletTrain;
}
export default bulletTrain;
