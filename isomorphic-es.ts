import AsyncStorage from "@callstack/async-storage";
import {IFlagsmith} from "./types";
import core from './flagsmith-core'
const flagsmith: IFlagsmith = core({AsyncStorage});

export default flagsmith;
