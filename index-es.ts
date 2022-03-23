import { IFlagsmith } from './types';

import fetch from "unfetch"
import AsyncStorage from "@callstack/async-storage";
import core from './flagsmith-core'
const flagsmith = core({AsyncStorage, fetch});

export default flagsmith;
export const createFlagsmithInstance = ():IFlagsmith=>{
    return core({AsyncStorage, fetch})
}
