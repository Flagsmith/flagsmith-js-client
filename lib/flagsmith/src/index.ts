import { IFlagsmith } from './types';

import fetch from "unfetch"
// @ts-expect-error
import AsyncStorage from "@callstack/async-storage";
import core, { LikeFetch } from './flagsmith-core';
import EventSource from 'reconnecting-eventsource'
// @ts-expect-error
const _fetch = fetch as LikeFetch
const flagsmith = core({AsyncStorage, fetch:_fetch, eventSource:EventSource});
if (typeof window !== "undefined") {
    // @ts-expect-error, some people wish to use flagsmith globally
    window.flagsmith = flagsmith;
}
export default flagsmith;
export const createFlagsmithInstance = ():IFlagsmith=>{
    return core({AsyncStorage, fetch:_fetch, eventSource:EventSource})
}
