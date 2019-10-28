if(typeof global.self === "undefined")
{
    global.self = global;
}
import AsyncStorage from "@callstack/async-storage";
const bt = require('./bullet-train-core');
module.exports = bt({AsyncStorage});
