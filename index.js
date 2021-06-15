let fetch = require("unfetch").default;
import AsyncStorage from "@callstack/async-storage";
const core = require('./flagsmith-core');
const flagsmith = core({AsyncStorage, fetch});
if (typeof window !== "undefined") {
    window.flagsmith = flagsmith;
}
export default flagsmith;
export const createFlagsmithInstance = ()=>{
    return core({AsyncStorage, fetch})
}
