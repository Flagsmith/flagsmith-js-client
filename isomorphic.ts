let fetch = require("unfetch").default;
if (typeof window === 'undefined')  {
    fetch  = require('node-fetch').default;
}

import AsyncStorage from "@callstack/async-storage";
const core = require('./flagsmith-core');
const flagsmith = core({AsyncStorage, fetch});
if (typeof window !== "undefined") {
    // @ts-ignore
    window.flagsmith = flagsmith;
}
export default flagsmith;
