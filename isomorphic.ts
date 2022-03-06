import AsyncStorage from "@callstack/async-storage";
const core = require('./flagsmith-core');
const flagsmith = core({AsyncStorage});
if (typeof window !== "undefined") {
    // @ts-ignore
    window.flagsmith = flagsmith;
}
export default flagsmith;
