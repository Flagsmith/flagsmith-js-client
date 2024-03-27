import { IFlagsmith } from './types';

import fetch from "unfetch"
import AsyncStorage from "./async-storage";
import core, { LikeFetch } from './flagsmith-core';
// @ts-ignore
globalThis.FlagsmithEventSource = typeof EventSource!== "undefined"? EventSource: null;
import _EventSource from 'reconnecting-eventsource'
// @ts-expect-error
const _fetch = fetch as LikeFetch

const flagsmith = core({AsyncStorage, fetch:_fetch, eventSource:_EventSource});

export default flagsmith;
export const createFlagsmithInstance = ():IFlagsmith=>{
    return core({AsyncStorage, fetch:_fetch, eventSource:_EventSource})
}
