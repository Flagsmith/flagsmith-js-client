import AsyncStorage from "@callstack/async-storage";
import fetch from 'isomorphic-unfetch';
const bt = require('./bullet-train-core');
const bulletTrain = bt({AsyncStorage, fetch});
global.bulletTrain = bulletTrain;
module.exports = bulletTrain;
