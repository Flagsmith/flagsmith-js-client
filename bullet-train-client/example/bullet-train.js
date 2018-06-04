(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["bullet-train"] = factory();
	else
		root["bullet-train"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./async-storage.js":
/*!**************************!*\
  !*** ./async-storage.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! deep-assign */ "./node_modules/deep-assign/index.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, deep_assign_1) {
    "use strict";

    Object.defineProperty(exports, "__esModule", { value: true });
    var mergeLocalStorageItem = function mergeLocalStorageItem(key, value) {
        var oldValue = window.localStorage.getItem(key);
        var oldObject = JSON.parse(oldValue);
        var newObject = JSON.parse(value);
        var nextValue = JSON.stringify(deep_assign_1.default({}, oldObject, newObject));
        window.localStorage.setItem(key, nextValue);
    };
    var createPromise = function createPromise(getValue, callback) {
        return new Promise(function (resolve, reject) {
            try {
                var value = getValue();
                if (callback) {
                    callback(null, value);
                }
                resolve(value);
            } catch (err) {
                if (callback) {
                    callback(err);
                }
                reject(err);
            }
        });
    };
    var createPromiseAll = function createPromiseAll(promises, callback, processResult) {
        return Promise.all(promises).then(function (result) {
            var value = processResult ? processResult(result) : null;
            callback && callback(null, value);
            return Promise.resolve(value);
        }, function (errors) {
            callback && callback(errors);
            return Promise.reject(errors);
        });
    };
    var AsyncStorage = /** @class */function () {
        function AsyncStorage() {}
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
            var promises = keys.map(function (key) {
                return AsyncStorage.getItem(key);
            });
            var processResult = function processResult(result) {
                return result.map(function (value, i) {
                    return [keys[i], value];
                });
            };
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
            var promises = keyValuePairs.map(function (item) {
                return AsyncStorage.setItem(item[0], item[1]);
            });
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
            var promises = keyValuePairs.map(function (item) {
                return AsyncStorage.mergeItem(item[0], item[1]);
            });
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
            var promises = keys.map(function (key) {
                return AsyncStorage.removeItem(key);
            });
            return createPromiseAll(promises, callback);
        };
        return AsyncStorage;
    }();
    module.exports = AsyncStorage;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./bullet-train-core.js":
/*!******************************!*\
  !*** ./bullet-train-core.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fetch = void 0;
var AsyncStorage = void 0;
var BULLET_TRAIN_KEY = "BULLET_TRAIN_DB";

var getJSON = function getJSON(url, method) {
    var _flagger = flagger,
        environmentID = _flagger.environmentID;

    console.log(url, environmentID);
    return fetch(url + '?format=json', {
        method: method || 'GET',
        headers: {
            'x-environment-key': environmentID
        }
    }).then(function (res) {
        return res.json();
    });
};

var getFlags = function getFlags() {
    var _flagger2 = flagger,
        onChange = _flagger2.onChange,
        onError = _flagger2.onError,
        identity = _flagger2.identity,
        api = _flagger2.api,
        disableCache = _flagger2.disableCache;


    var handleResponse = function handleResponse(res) {
        // Handle server response
        var flags = {};
        res.forEach(function (feature) {
            flags[feature.feature.name.toLowerCase().replace(/ /g, '_')] = {
                enabled: feature.enabled,
                value: feature.value
            };
        });
        flagger.oldFlags = flags;
        flagger.flags = flags;
        if (!disableCache) {
            AsyncStorage.setItem(BULLET_TRAIN_KEY, JSON.stringify(flagger.flags));
        }
        onChange && onChange(flagger.oldFlags, { isFromServer: true });
    };

    if (identity) {
        return getJSON(api + 'flags/' + identity).then(function (res) {
            handleResponse(res);
        }).catch(function (_ref) {
            var message = _ref.message;

            onError && onError({ message: message });
        });
    } else {
        return getJSON(api + "flags/").then(function (res) {
            handleResponse(res);
        }).catch(function (_ref2) {
            var message = _ref2.message;

            onError && onError({ message: message });
        });
    }
};

var BulletTrain = function () {
    function BulletTrain(props) {
        _classCallCheck(this, BulletTrain);

        fetch = props.fetch;
        AsyncStorage = props.AsyncStorage;
    }

    _createClass(BulletTrain, [{
        key: 'init',
        value: function init(_ref3) {
            var environmentID = _ref3.environmentID,
                _ref3$api = _ref3.api,
                api = _ref3$api === undefined ? 'https://bullet-train-api-dev.dokku1.solidstategroup.com/api/v1/' : _ref3$api,
                onChange = _ref3.onChange,
                disableCache = _ref3.disableCache,
                onError = _ref3.onError,
                defaultFlags = _ref3.defaultFlags;


            this.environmentID = environmentID;
            this.api = api;
            this.interval = null;
            this.disableCache = disableCache;
            this.onChange = onChange;
            this.onError = onError;
            this.flags = Object.assign({}, defaultFlags) || {};
            this.initialised = true;

            if (!environmentID) {
                throw 'Please specify a environment id';
            }
            if (!onChange) {
                throw 'Please specify an onChange event';
            }

            //If the user specified default flags emit a changed event immediately

            if (!disableCache) {
                AsyncStorage.getItem(BULLET_TRAIN_KEY, function (err, res) {
                    flagger.flags = res ? JSON.parse(res) : defaultFlags;
                    if (flagger.flags) {
                        onChange(null, { isFromServer: false });
                    }
                    getFlags();
                });
            }
        }
    }, {
        key: 'getAllFlags',
        value: function getAllFlags() {
            return this.flags;
        }
    }, {
        key: 'identify',
        value: function identify(userId) {
            this.identity = userId;
            if (this.initialised && !this.interval) getFlags();
        }
    }, {
        key: 'logout',
        value: function logout() {
            this.identity = null;
            if (this.initialised && !this.interval) getFlags();
        }
    }, {
        key: 'startListening',
        value: function startListening() {
            var ticks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1000;

            if (this.interval) {
                return;
            }
            this.interval = setInterval(getFlags, ticks);
        }
    }, {
        key: 'stopListening',
        value: function stopListening() {
            clearInterval(this.interval);
        }
    }, {
        key: 'getValue',
        value: function getValue(key) {
            var flag = this.flags[key];
            var res = null;
            if (flag && flag.enabled) {
                res = flag.value;
            }
            //todo record check for value

            return res;
        }
    }, {
        key: 'hasFeature',
        value: function hasFeature(key) {
            var flag = this.flags[key];
            var res = false;
            if (flag && flag.enabled) {
                res = true;
            }
            //todo record check for feature

            return res;
        }
    }]);

    return BulletTrain;
}();

module.exports = function (_ref4) {
    var fetch = _ref4.fetch,
        AsyncStorage = _ref4.AsyncStorage;

    return new BulletTrain({ fetch: fetch, AsyncStorage: AsyncStorage });
};

/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _asyncStorage = __webpack_require__(/*! ./async-storage */ "./async-storage.js");

var _asyncStorage2 = _interopRequireDefault(_asyncStorage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

__webpack_require__(/*! whatwg-fetch */ "./node_modules/whatwg-fetch/fetch.js");
var bt = __webpack_require__(/*! ./bullet-train-core */ "./bullet-train-core.js");
module.exports = bt({ AsyncStorage: _asyncStorage2.default, fetch: window.fetch });

/***/ }),

/***/ "./node_modules/deep-assign/index.js":
/*!*******************************************!*\
  !*** ./node_modules/deep-assign/index.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var isObj = __webpack_require__(/*! is-obj */ "./node_modules/is-obj/index.js");
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Sources cannot be null or undefined');
	}

	return Object(val);
}

function assignKey(to, from, key) {
	var val = from[key];

	if (val === undefined || val === null) {
		return;
	}

	if (hasOwnProperty.call(to, key)) {
		if (to[key] === undefined || to[key] === null) {
			throw new TypeError('Cannot convert undefined or null to object (' + key + ')');
		}
	}

	if (!hasOwnProperty.call(to, key) || !isObj(val)) {
		to[key] = val;
	} else {
		to[key] = assign(Object(to[key]), from[key]);
	}
}

function assign(to, from) {
	if (to === from) {
		return to;
	}

	from = Object(from);

	for (var key in from) {
		if (hasOwnProperty.call(from, key)) {
			assignKey(to, from, key);
		}
	}

	if (Object.getOwnPropertySymbols) {
		var symbols = Object.getOwnPropertySymbols(from);

		for (var i = 0; i < symbols.length; i++) {
			if (propIsEnumerable.call(from, symbols[i])) {
				assignKey(to, from, symbols[i]);
			}
		}
	}

	return to;
}

module.exports = function deepAssign(target) {
	target = toObject(target);

	for (var s = 1; s < arguments.length; s++) {
		assign(target, arguments[s]);
	}

	return target;
};


/***/ }),

/***/ "./node_modules/is-obj/index.js":
/*!**************************************!*\
  !*** ./node_modules/is-obj/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function (x) {
	var type = typeof x;
	return x !== null && (type === 'object' || type === 'function');
};


/***/ }),

/***/ "./node_modules/whatwg-fetch/fetch.js":
/*!********************************************!*\
  !*** ./node_modules/whatwg-fetch/fetch.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob()
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ]

    var isDataView = function(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj)
    }

    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift()
        return {done: value === undefined, value: value}
      }
    }

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      }
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1])
      }, this)
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var oldValue = this.map[name]
    this.map[name] = oldValue ? oldValue+','+value : value
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    name = normalizeName(name)
    return this.has(name) ? this.map[name] : null
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value)
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this)
      }
    }
  }

  Headers.prototype.keys = function() {
    var items = []
    this.forEach(function(value, name) { items.push(name) })
    return iteratorFor(items)
  }

  Headers.prototype.values = function() {
    var items = []
    this.forEach(function(value) { items.push(value) })
    return iteratorFor(items)
  }

  Headers.prototype.entries = function() {
    var items = []
    this.forEach(function(value, name) { items.push([name, value]) })
    return iteratorFor(items)
  }

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsArrayBuffer(blob)
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsText(blob)
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf)
    var chars = new Array(view.length)

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i])
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength)
      view.set(new Uint8Array(buf))
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false

    this._initBody = function(body) {
      this._bodyInit = body
      if (!body) {
        this._bodyText = ''
      } else if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString()
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer)
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer])
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body)
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        }
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      }
    }

    this.text = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body && input._bodyInit != null) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = String(input)
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this, { body: this._bodyInit })
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers()
    // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
    // https://tools.ietf.org/html/rfc7230#section-3.2
    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ')
    preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':')
      var key = parts.shift().trim()
      if (key) {
        var value = parts.join(':').trim()
        headers.append(key, value)
      }
    })
    return headers
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = options.status === undefined ? 200 : options.status
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = 'statusText' in options ? options.statusText : 'OK'
    this.headers = new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers
  self.Request = Request
  self.Response = Response

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init)
      var xhr = new XMLHttpRequest()

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        }
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
        var body = 'response' in xhr ? xhr.response : xhr.responseText
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      } else if (request.credentials === 'omit') {
        xhr.withCredentials = false
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);


/***/ })

/******/ });
});
//# sourceMappingURL=bullet-train.js.map