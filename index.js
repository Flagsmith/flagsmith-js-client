import AsyncStorage from './async-storage';
require('whatwg-fetch');
const bt = require('./bullet-train-core');
const bulletTrain = bt({AsyncStorage, fetch: window.fetch});
window.bulletTrain = bulletTrain;
module.exports = bulletTrain;