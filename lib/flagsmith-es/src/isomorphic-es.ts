// @ts-expect-error
import AsyncStorage from "@callstack/async-storage";
import {IFlagsmith} from "./types";
// @ts-expect-error
import eventSource from 'reconnecting-eventsource'

import core from './flagsmith-core'

const flagsmith: IFlagsmith = core({AsyncStorage, eventSource});

export default flagsmith;

export const createFlagsmithInstance = (): IFlagsmith => {
    return core({ AsyncStorage, eventSource })
}
