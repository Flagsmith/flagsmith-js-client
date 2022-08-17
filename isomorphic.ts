import AsyncStorage from "@callstack/async-storage";
import {IFlagsmith} from "./types";
import core from './flagsmith-core'

import eventSource from 'reconnecting-eventsource'

const flagsmith: IFlagsmith = core({AsyncStorage, eventSource});

if (typeof window !== "undefined") {
    // @ts-ignore
    window.flagsmith = flagsmith;
}
export default flagsmith;
export const createFlagsmithInstance = (): IFlagsmith => {
    return core({
        AsyncStorage,
        eventSource
    })
}
