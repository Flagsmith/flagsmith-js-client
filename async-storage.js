/**
 * Copyright (c) 2015-present, Nicolas Gallagher.
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule AsyncStorage
 * @flow
 */
define(["require", "exports", "deep-assign"], function (require, exports, deep_assign_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var mergeLocalStorageItem = function (key, value) {
        var oldValue = window.localStorage.getItem(key);
        var oldObject = JSON.parse(oldValue);
        var newObject = JSON.parse(value);
        var nextValue = JSON.stringify(deep_assign_1.default({}, oldObject, newObject));
        window.localStorage.setItem(key, nextValue);
    };
    var createPromise = function (getValue, callback) {
        return new Promise(function (resolve, reject) {
            try {
                var value = getValue();
                if (callback) {
                    callback(null, value);
                }
                resolve(value);
            }
            catch (err) {
                if (callback) {
                    callback(err);
                }
                reject(err);
            }
        });
    };
    var createPromiseAll = function (promises, callback, processResult) {
        return Promise.all(promises).then(function (result) {
            var value = processResult ? processResult(result) : null;
            callback && callback(null, value);
            return Promise.resolve(value);
        }, function (errors) {
            callback && callback(errors);
            return Promise.reject(errors);
        });
    };
    var AsyncStorage = /** @class */ (function () {
        function AsyncStorage() {
        }
        /**
         * Erases *all* AsyncStorage for the domain.
         */
        AsyncStorage.clear = function (callback) {
            return createPromise(function () {
                window.localStorage.clear();
            }, callback);
        };
        /**
         * Gets *all* keys known to the app, for all callers, libraries, etc.
         */
        AsyncStorage.getAllKeys = function (callback) {
            return createPromise(function () {
                var numberOfKeys = window.localStorage.length;
                var keys = [];
                for (var i = 0; i < numberOfKeys; i += 1) {
                    var key = window.localStorage.key(i);
                    keys.push(key);
                }
                return keys;
            }, callback);
        };
        /**
         * Fetches `key` value.
         */
        AsyncStorage.getItem = function (key, callback) {
            return createPromise(function () {
                return window.localStorage.getItem(key);
            }, callback);
        };
        /**
         * multiGet resolves to an array of key-value pair arrays that matches the
         * input format of multiSet.
         *
         *   multiGet(['k1', 'k2']) -> [['k1', 'val1'], ['k2', 'val2']]
         */
        AsyncStorage.multiGet = function (keys, callback) {
            var promises = keys.map(function (key) { return AsyncStorage.getItem(key); });
            var processResult = function (result) { return result.map(function (value, i) { return [keys[i], value]; }); };
            return createPromiseAll(promises, callback, processResult);
        };
        /**
         * Sets `value` for `key`.
         */
        AsyncStorage.setItem = function (key, value, callback) {
            return createPromise(function () {
                window.localStorage.setItem(key, value);
            }, callback);
        };
        /**
         * Takes an array of key-value array pairs.
         *   multiSet([['k1', 'val1'], ['k2', 'val2']])
         */
        AsyncStorage.multiSet = function (keyValuePairs, callback) {
            var promises = keyValuePairs.map(function (item) { return AsyncStorage.setItem(item[0], item[1]); });
            return createPromiseAll(promises, callback);
        };
        /**
         * Merges existing value with input value, assuming they are stringified JSON.
         */
        AsyncStorage.mergeItem = function (key, value, callback) {
            return createPromise(function () {
                mergeLocalStorageItem(key, value);
            }, callback);
        };
        /**
         * Takes an array of key-value array pairs and merges them with existing
         * values, assuming they are stringified JSON.
         *
         *   multiMerge([['k1', 'val1'], ['k2', 'val2']])
         */
        AsyncStorage.multiMerge = function (keyValuePairs, callback) {
            var promises = keyValuePairs.map(function (item) { return AsyncStorage.mergeItem(item[0], item[1]); });
            return createPromiseAll(promises, callback);
        };
        /**
         * Removes a `key`
         */
        AsyncStorage.removeItem = function (key, callback) {
            return createPromise(function () {
                return window.localStorage.removeItem(key);
            }, callback);
        };
        /**
         * Delete all the keys in the `keys` array.
         */
        AsyncStorage.multiRemove = function (keys, callback) {
            var promises = keys.map(function (key) { return AsyncStorage.removeItem(key); });
            return createPromiseAll(promises, callback);
        };
        return AsyncStorage;
    }());
    module.exports = AsyncStorage;
});
