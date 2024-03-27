import AsyncStorage from "./async-storage";
import {IFlagsmith} from "./types";
// @ts-expect-error
globalThis.FlagsmithEventSource = typeof EventSource !== 'undefined' ? EventSource : null;
import eventSource from 'reconnecting-eventsource'

import core from './flagsmith-core'

const flagsmith: IFlagsmith = core({
    AsyncStorage,
    eventSource: typeof window !=='undefined'?eventSource : null
});

export default flagsmith;

export const createFlagsmithInstance = (): IFlagsmith => {
    return core({
        AsyncStorage,
        eventSource: typeof window !=='undefined'?eventSource : null
    })
}
