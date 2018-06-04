import {AsyncStorage} from 'react-native';
const bt = require('./bullet-train-core');
module.exports = bt({AsyncStorage, fetch: window.fetch});