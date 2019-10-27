import AsyncStorage from "@callstack/async-storage";
require('whatwg-fetch');
const bt = require('./bullet-train-core');
const bulletTrain = bt({AsyncStorage, fetch: global.fetch});
global.bulletTrain = bulletTrain;
module.exports = bulletTrain;
