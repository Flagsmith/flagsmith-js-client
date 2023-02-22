import { IFlagsmith } from './types';

import fetch from "unfetch"
// @ts-expect-error
import AsyncStorage from "@callstack/async-storage";
import core, { LikeFetch } from './flagsmith-core';
// @ts-expect-error

const _EventSource = typeof EventSource !=='undefined'? EventSource: null
const _fetch = fetch as LikeFetch
const flagsmith = core({AsyncStorage, fetch:_fetch, eventSource:_EventSource});
if (typeof window !== "undefined") {
    // @ts-expect-error, some people wish to use flagsmith globally
    window.flagsmith = flagsmith;
}
export default flagsmith;
export const createFlagsmithInstance = ():IFlagsmith=>{
    return core({AsyncStorage, fetch:_fetch, eventSource:_EventSource})
}
