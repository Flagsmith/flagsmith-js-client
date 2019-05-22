(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react-native"));
	else if(typeof define === 'function' && define.amd)
		define(["react-native"], factory);
	else if(typeof exports === 'object')
		exports["bullet-train"] = factory(require("react-native"));
	else
		root["bullet-train"] = factory(root["react-native"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE_react_native__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.react-native.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./bullet-train-core.js":
/*!******************************!*\
  !*** ./bullet-train-core.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bulletTrainRulesEngine = __webpack_require__(/*! bullet-train-rules-engine */ "./node_modules/bullet-train-rules-engine/lib/index.js");

var _bulletTrainRulesEngine2 = _interopRequireDefault(_bulletTrainRulesEngine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fetch = void 0;
var AsyncStorage = void 0;
var BULLET_TRAIN_KEY = "BULLET_TRAIN_DB";

var BulletTrain = function () {
    function BulletTrain(props) {
        var _this = this;

        _classCallCheck(this, BulletTrain);

        this.getJSON = function (url, method, body) {
            var environmentID = _this.environmentID;

            var options = {
                method: method || 'GET',
                body: body,
                headers: {
                    'x-environment-key': environmentID
                }
            };
            if (method !== "GET") options.headers['Content-Type'] = 'application/json; charset=utf-8';

            return fetch(url + '?format=json', options).then(function (res) {
                return res.json();
            });
        };

        this.getFlags = function () {
            var onChange = _this.onChange,
                onError = _this.onError,
                identity = _this.identity,
                api = _this.api,
                disableCache = _this.disableCache;


            var handleResponse = function handleResponse(_ref, segments) {
                var features = _ref.flags,
                    traits = _ref.traits;

                // Handle server response
                var flags = {};
                var userTraits = {};
                var userSegments = {};
                features = features || [];
                traits = traits || [];
                features.forEach(function (feature) {
                    flags[feature.feature.name.toLowerCase().replace(/ /g, '_')] = {
                        enabled: feature.enabled,
                        value: feature.feature_state_value
                    };
                });
                traits.forEach(function (trait) {
                    userTraits[trait.trait_key.toLowerCase().replace(/ /g, '_')] = trait.trait_value;
                });
                _this.oldFlags = flags;
                _this.flags = flags;
                _this.traits = userTraits;
                if (segments) {
                    if (!_this.segments) {
                        segments = segments.map(function (s) {
                            return _extends({}, s, { rules: JSON.parse(s.rules) });
                        });
                        _this.segments = segments;
                    }
                    Promise.all(_this.segments.map(function (segment) {
                        return (0, _bulletTrainRulesEngine2.default)(userTraits, segment.rules).then(function (res) {
                            userSegments[segment.name] = res.result;
                        });
                    })).then(function () {
                        _this.userSegments = userSegments;
                        if (!disableCache) {
                            AsyncStorage.setItem(BULLET_TRAIN_KEY, JSON.stringify(_this.flags));
                        }
                        onChange && onChange(_this.oldFlags, { isFromServer: true });
                    });
                } else {
                    if (!disableCache) {
                        AsyncStorage.setItem(BULLET_TRAIN_KEY, JSON.stringify(_this.flags));
                    }
                    onChange && onChange(_this.oldFlags, { isFromServer: true });
                }
            };

            if (identity) {
                return Promise.all([_this.getJSON(api + 'identities/' + identity + '/'), _this.segments ? Promise.resolve(_this.segments) : _this.getJSON(api + 'segments/')]).then(function (res) {
                    handleResponse(res[0], res[1]);
                }).catch(function (_ref2) {
                    var message = _ref2.message;

                    onError && onError({ message: message });
                });
            } else {
                return Promise.all([_this.getJSON(api + "flags/")]).then(function (res) {
                    handleResponse({ flags: res[0] }, null);
                }).catch(function (_ref3) {
                    var message = _ref3.message;

                    onError && onError({ message: message });
                });
            }
        };

        this.getValue = function (key) {
            var flag = _this.flags && _this.flags[key];
            var res = null;
            if (flag) {
                res = flag.value;
            }
            //todo record check for value

            return res;
        };

        this.getTrait = function (key) {
            var trait = _this.traits && _this.traits[key];
            return trait;
        };

        this.getSegments = function () {
            return _this.userSegments;
        };

        this.segment = function (id) {
            return _this.userSegments && _this.userSegments[id];
        };

        this.setTrait = function (key, trait_value) {
            var getJSON = _this.getJSON,
                identity = _this.identity,
                api = _this.api;


            return getJSON(api + 'identities/' + identity + '/traits/' + encodeURIComponent(key), 'POST', JSON.stringify({ trait_value: trait_value })).then(_this.getFlags);
        };

        this.hasFeature = function (key) {
            var flag = _this.flags && _this.flags[key];
            var res = false;
            if (flag && flag.enabled) {
                res = true;
            }
            //todo record check for feature

            return res;
        };

        fetch = props.fetch;
        AsyncStorage = props.AsyncStorage;
    }

    _createClass(BulletTrain, [{
        key: 'init',
        value: function init(_ref4) {
            var _this2 = this;

            var environmentID = _ref4.environmentID,
                _ref4$api = _ref4.api,
                api = _ref4$api === undefined ? 'https://api.bullet-train.io/api/v1/' : _ref4$api,
                onChange = _ref4.onChange,
                disableCache = _ref4.disableCache,
                onError = _ref4.onError,
                defaultFlags = _ref4.defaultFlags;


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
                    _this2.flags = res ? JSON.parse(res) : defaultFlags;
                    if (_this2.flags) {
                        onChange(null, { isFromServer: false });
                    }
                    _this2.getFlags();
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
            if (this.initialised && !this.interval) this.getFlags();
        }
    }, {
        key: 'logout',
        value: function logout() {
            this.identity = null;
            if (this.initialised && !this.interval) this.getFlags();
        }
    }, {
        key: 'startListening',
        value: function startListening() {
            var ticks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1000;

            if (this.interval) {
                return;
            }
            this.interval = setInterval(this.getFlags, ticks);
        }
    }, {
        key: 'stopListening',
        value: function stopListening() {
            clearInterval(this.interval);
        }
    }]);

    return BulletTrain;
}();

module.exports = function (_ref5) {
    var fetch = _ref5.fetch,
        AsyncStorage = _ref5.AsyncStorage;

    return new BulletTrain({ fetch: fetch, AsyncStorage: AsyncStorage });
};

/***/ }),

/***/ "./index.react-native.js":
/*!*******************************!*\
  !*** ./index.react-native.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _reactNative = __webpack_require__(/*! react-native */ "react-native");

var bt = __webpack_require__(/*! ./bullet-train-core */ "./bullet-train-core.js");
module.exports = bt({ AsyncStorage: _reactNative.AsyncStorage, fetch: window.fetch });

/***/ }),

/***/ "./node_modules/bullet-train-rules-engine/lib/index.js":
/*!*************************************************************!*\
  !*** ./node_modules/bullet-train-rules-engine/lib/index.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

!function(e,n){ true?module.exports=n():undefined}(window,function(){return function(e){var n={};function r(t){if(n[t])return n[t].exports;var u=n[t]={i:t,l:!1,exports:{}};return e[t].call(u.exports,u,u.exports,r),u.l=!0,u.exports}return r.m=e,r.c=n,r.d=function(e,n,t){r.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,n){if(1&n&&(e=r(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(r.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var u in e)r.d(t,u,function(n){return e[n]}.bind(null,u));return t},r.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(n,"a",n),n},r.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},r.p="",r(r.s=1)}([function(e,n,r){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=function e(n,r,t){r=Array.isArray(r)?r:r.split(".");n=n[r[0]];if(n&&r.length>1)return e(n,r.slice(1));return void 0===n?t:n}},function(e,n,r){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=function(e,n){return y(e,{all:{rules:n}},["all"]).then(function(e){return{result:e.all.result,rules:e.all.rules}})};var t=function(e){return e&&e.__esModule?e:{default:e}}(r(0));var u=function(e){0},o="EQUAL",l="NOT_EQUAL",a="GREATER_THAN",c="GREATER_THAN_INCLUSIVE",i="LESS_THAN",f="LESS_THAN_INCLUSIVE",s="CONTAINS",d="NOT_CONTAINS",p="REGEX",y=function e(n,r,y){return u(0),new Promise(function(v,b){var _=y[y.length-1],E=(0,t.default)(r,y);if("all"===_||"any"===_||"none"===_)return Promise.all(E.rules.map(function(t,u){var o=["rules",u];return t.any?o=o.concat(["any"]):t.all?o=o.concat(["all"]):t.none&&(o=o.concat(["none"])),e(n,r,y.concat(o))})).then(function(e){var n=void 0;return"all"===_?n=!e.includes(!1):"any"===_?n=e.includes(!0):"none"===_&&(n=!e.includes(!0)),E.result=!!n,1===y.length&&v(r),v(n)});var O=!!function(e,n){var r=n.property,y=n.operator,v=n.value;u();var b=(0,t.default)(e,r);switch(y){case o:return b===v;case l:return b!==v;case a:return b>v;case c:return b>=v;case i:return b<v;case f:return b<=v;case s:return b&&(b+"").includes(v);case d:return!b||!(b+"").includes(v);case p:return b&&new RegExp(v).test(b);default:return console.error("Invalid operator"),!1}}(n,E);return E.result=O,v(O)})}}])});
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "react-native":
/*!*******************************!*\
  !*** external "react-native" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_react_native__;

/***/ })

/******/ });
});
//# sourceMappingURL=bullet-train.js.map