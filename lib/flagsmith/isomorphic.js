(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.isomorphic = {}));
})(this, (function (exports) { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	var lib = {};

	var lodash_merge = {exports: {}};

	/**
	 * Lodash (Custom Build) <https://lodash.com/>
	 * Build: `lodash modularize exports="npm" -o ./`
	 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
	 * Released under MIT license <https://lodash.com/license>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 */

	(function (module, exports) {
	/** Used as the size to enable large array optimizations. */
	var LARGE_ARRAY_SIZE = 200;

	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = '__lodash_hash_undefined__';

	/** Used to detect hot functions by number of calls within a span of milliseconds. */
	var HOT_COUNT = 800,
	    HOT_SPAN = 16;

	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;

	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    arrayTag = '[object Array]',
	    asyncTag = '[object AsyncFunction]',
	    boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    funcTag = '[object Function]',
	    genTag = '[object GeneratorFunction]',
	    mapTag = '[object Map]',
	    numberTag = '[object Number]',
	    nullTag = '[object Null]',
	    objectTag = '[object Object]',
	    proxyTag = '[object Proxy]',
	    regexpTag = '[object RegExp]',
	    setTag = '[object Set]',
	    stringTag = '[object String]',
	    undefinedTag = '[object Undefined]',
	    weakMapTag = '[object WeakMap]';

	var arrayBufferTag = '[object ArrayBuffer]',
	    dataViewTag = '[object DataView]',
	    float32Tag = '[object Float32Array]',
	    float64Tag = '[object Float64Array]',
	    int8Tag = '[object Int8Array]',
	    int16Tag = '[object Int16Array]',
	    int32Tag = '[object Int32Array]',
	    uint8Tag = '[object Uint8Array]',
	    uint8ClampedTag = '[object Uint8ClampedArray]',
	    uint16Tag = '[object Uint16Array]',
	    uint32Tag = '[object Uint32Array]';

	/**
	 * Used to match `RegExp`
	 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
	 */
	var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

	/** Used to detect host constructors (Safari). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;

	/** Used to detect unsigned integer values. */
	var reIsUint = /^(?:0|[1-9]\d*)$/;

	/** Used to identify `toStringTag` values of typed arrays. */
	var typedArrayTags = {};
	typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
	typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
	typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
	typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
	typedArrayTags[uint32Tag] = true;
	typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
	typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
	typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
	typedArrayTags[errorTag] = typedArrayTags[funcTag] =
	typedArrayTags[mapTag] = typedArrayTags[numberTag] =
	typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
	typedArrayTags[setTag] = typedArrayTags[stringTag] =
	typedArrayTags[weakMapTag] = false;

	/** Detect free variable `global` from Node.js. */
	var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

	/** Detect free variable `self`. */
	var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

	/** Used as a reference to the global object. */
	var root = freeGlobal || freeSelf || Function('return this')();

	/** Detect free variable `exports`. */
	var freeExports = exports && !exports.nodeType && exports;

	/** Detect free variable `module`. */
	var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;

	/** Detect free variable `process` from Node.js. */
	var freeProcess = moduleExports && freeGlobal.process;

	/** Used to access faster Node.js helpers. */
	var nodeUtil = (function() {
	  try {
	    // Use `util.types` for Node.js 10+.
	    var types = freeModule && freeModule.require && freeModule.require('util').types;

	    if (types) {
	      return types;
	    }

	    // Legacy `process.binding('util')` for Node.js < 10.
	    return freeProcess && freeProcess.binding && freeProcess.binding('util');
	  } catch (e) {}
	}());

	/* Node.js helper references. */
	var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

	/**
	 * A faster alternative to `Function#apply`, this function invokes `func`
	 * with the `this` binding of `thisArg` and the arguments of `args`.
	 *
	 * @private
	 * @param {Function} func The function to invoke.
	 * @param {*} thisArg The `this` binding of `func`.
	 * @param {Array} args The arguments to invoke `func` with.
	 * @returns {*} Returns the result of `func`.
	 */
	function apply(func, thisArg, args) {
	  switch (args.length) {
	    case 0: return func.call(thisArg);
	    case 1: return func.call(thisArg, args[0]);
	    case 2: return func.call(thisArg, args[0], args[1]);
	    case 3: return func.call(thisArg, args[0], args[1], args[2]);
	  }
	  return func.apply(thisArg, args);
	}

	/**
	 * The base implementation of `_.times` without support for iteratee shorthands
	 * or max array length checks.
	 *
	 * @private
	 * @param {number} n The number of times to invoke `iteratee`.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the array of results.
	 */
	function baseTimes(n, iteratee) {
	  var index = -1,
	      result = Array(n);

	  while (++index < n) {
	    result[index] = iteratee(index);
	  }
	  return result;
	}

	/**
	 * The base implementation of `_.unary` without support for storing metadata.
	 *
	 * @private
	 * @param {Function} func The function to cap arguments for.
	 * @returns {Function} Returns the new capped function.
	 */
	function baseUnary(func) {
	  return function(value) {
	    return func(value);
	  };
	}

	/**
	 * Gets the value at `key` of `object`.
	 *
	 * @private
	 * @param {Object} [object] The object to query.
	 * @param {string} key The key of the property to get.
	 * @returns {*} Returns the property value.
	 */
	function getValue(object, key) {
	  return object == null ? undefined : object[key];
	}

	/**
	 * Creates a unary function that invokes `func` with its argument transformed.
	 *
	 * @private
	 * @param {Function} func The function to wrap.
	 * @param {Function} transform The argument transform.
	 * @returns {Function} Returns the new function.
	 */
	function overArg(func, transform) {
	  return function(arg) {
	    return func(transform(arg));
	  };
	}

	/** Used for built-in method references. */
	var arrayProto = Array.prototype,
	    funcProto = Function.prototype,
	    objectProto = Object.prototype;

	/** Used to detect overreaching core-js shims. */
	var coreJsData = root['__core-js_shared__'];

	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/** Used to detect methods masquerading as native. */
	var maskSrcKey = (function() {
	  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
	  return uid ? ('Symbol(src)_1.' + uid) : '';
	}());

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString = objectProto.toString;

	/** Used to infer the `Object` constructor. */
	var objectCtorString = funcToString.call(Object);

	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);

	/** Built-in value references. */
	var Buffer = moduleExports ? root.Buffer : undefined,
	    Symbol = root.Symbol,
	    Uint8Array = root.Uint8Array,
	    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined,
	    getPrototype = overArg(Object.getPrototypeOf, Object),
	    objectCreate = Object.create,
	    propertyIsEnumerable = objectProto.propertyIsEnumerable,
	    splice = arrayProto.splice,
	    symToStringTag = Symbol ? Symbol.toStringTag : undefined;

	var defineProperty = (function() {
	  try {
	    var func = getNative(Object, 'defineProperty');
	    func({}, '', {});
	    return func;
	  } catch (e) {}
	}());

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
	    nativeMax = Math.max,
	    nativeNow = Date.now;

	/* Built-in method references that are verified to be native. */
	var Map = getNative(root, 'Map'),
	    nativeCreate = getNative(Object, 'create');

	/**
	 * The base implementation of `_.create` without support for assigning
	 * properties to the created object.
	 *
	 * @private
	 * @param {Object} proto The object to inherit from.
	 * @returns {Object} Returns the new object.
	 */
	var baseCreate = (function() {
	  function object() {}
	  return function(proto) {
	    if (!isObject(proto)) {
	      return {};
	    }
	    if (objectCreate) {
	      return objectCreate(proto);
	    }
	    object.prototype = proto;
	    var result = new object;
	    object.prototype = undefined;
	    return result;
	  };
	}());

	/**
	 * Creates a hash object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function Hash(entries) {
	  var index = -1,
	      length = entries == null ? 0 : entries.length;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	/**
	 * Removes all key-value entries from the hash.
	 *
	 * @private
	 * @name clear
	 * @memberOf Hash
	 */
	function hashClear() {
	  this.__data__ = nativeCreate ? nativeCreate(null) : {};
	  this.size = 0;
	}

	/**
	 * Removes `key` and its value from the hash.
	 *
	 * @private
	 * @name delete
	 * @memberOf Hash
	 * @param {Object} hash The hash to modify.
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function hashDelete(key) {
	  var result = this.has(key) && delete this.__data__[key];
	  this.size -= result ? 1 : 0;
	  return result;
	}

	/**
	 * Gets the hash value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf Hash
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function hashGet(key) {
	  var data = this.__data__;
	  if (nativeCreate) {
	    var result = data[key];
	    return result === HASH_UNDEFINED ? undefined : result;
	  }
	  return hasOwnProperty.call(data, key) ? data[key] : undefined;
	}

	/**
	 * Checks if a hash value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf Hash
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function hashHas(key) {
	  var data = this.__data__;
	  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
	}

	/**
	 * Sets the hash `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf Hash
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the hash instance.
	 */
	function hashSet(key, value) {
	  var data = this.__data__;
	  this.size += this.has(key) ? 0 : 1;
	  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
	  return this;
	}

	// Add methods to `Hash`.
	Hash.prototype.clear = hashClear;
	Hash.prototype['delete'] = hashDelete;
	Hash.prototype.get = hashGet;
	Hash.prototype.has = hashHas;
	Hash.prototype.set = hashSet;

	/**
	 * Creates an list cache object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function ListCache(entries) {
	  var index = -1,
	      length = entries == null ? 0 : entries.length;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	/**
	 * Removes all key-value entries from the list cache.
	 *
	 * @private
	 * @name clear
	 * @memberOf ListCache
	 */
	function listCacheClear() {
	  this.__data__ = [];
	  this.size = 0;
	}

	/**
	 * Removes `key` and its value from the list cache.
	 *
	 * @private
	 * @name delete
	 * @memberOf ListCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function listCacheDelete(key) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);

	  if (index < 0) {
	    return false;
	  }
	  var lastIndex = data.length - 1;
	  if (index == lastIndex) {
	    data.pop();
	  } else {
	    splice.call(data, index, 1);
	  }
	  --this.size;
	  return true;
	}

	/**
	 * Gets the list cache value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf ListCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function listCacheGet(key) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);

	  return index < 0 ? undefined : data[index][1];
	}

	/**
	 * Checks if a list cache value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf ListCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function listCacheHas(key) {
	  return assocIndexOf(this.__data__, key) > -1;
	}

	/**
	 * Sets the list cache `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf ListCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the list cache instance.
	 */
	function listCacheSet(key, value) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);

	  if (index < 0) {
	    ++this.size;
	    data.push([key, value]);
	  } else {
	    data[index][1] = value;
	  }
	  return this;
	}

	// Add methods to `ListCache`.
	ListCache.prototype.clear = listCacheClear;
	ListCache.prototype['delete'] = listCacheDelete;
	ListCache.prototype.get = listCacheGet;
	ListCache.prototype.has = listCacheHas;
	ListCache.prototype.set = listCacheSet;

	/**
	 * Creates a map cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function MapCache(entries) {
	  var index = -1,
	      length = entries == null ? 0 : entries.length;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	/**
	 * Removes all key-value entries from the map.
	 *
	 * @private
	 * @name clear
	 * @memberOf MapCache
	 */
	function mapCacheClear() {
	  this.size = 0;
	  this.__data__ = {
	    'hash': new Hash,
	    'map': new (Map || ListCache),
	    'string': new Hash
	  };
	}

	/**
	 * Removes `key` and its value from the map.
	 *
	 * @private
	 * @name delete
	 * @memberOf MapCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function mapCacheDelete(key) {
	  var result = getMapData(this, key)['delete'](key);
	  this.size -= result ? 1 : 0;
	  return result;
	}

	/**
	 * Gets the map value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf MapCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function mapCacheGet(key) {
	  return getMapData(this, key).get(key);
	}

	/**
	 * Checks if a map value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf MapCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function mapCacheHas(key) {
	  return getMapData(this, key).has(key);
	}

	/**
	 * Sets the map `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf MapCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the map cache instance.
	 */
	function mapCacheSet(key, value) {
	  var data = getMapData(this, key),
	      size = data.size;

	  data.set(key, value);
	  this.size += data.size == size ? 0 : 1;
	  return this;
	}

	// Add methods to `MapCache`.
	MapCache.prototype.clear = mapCacheClear;
	MapCache.prototype['delete'] = mapCacheDelete;
	MapCache.prototype.get = mapCacheGet;
	MapCache.prototype.has = mapCacheHas;
	MapCache.prototype.set = mapCacheSet;

	/**
	 * Creates a stack cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function Stack(entries) {
	  var data = this.__data__ = new ListCache(entries);
	  this.size = data.size;
	}

	/**
	 * Removes all key-value entries from the stack.
	 *
	 * @private
	 * @name clear
	 * @memberOf Stack
	 */
	function stackClear() {
	  this.__data__ = new ListCache;
	  this.size = 0;
	}

	/**
	 * Removes `key` and its value from the stack.
	 *
	 * @private
	 * @name delete
	 * @memberOf Stack
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function stackDelete(key) {
	  var data = this.__data__,
	      result = data['delete'](key);

	  this.size = data.size;
	  return result;
	}

	/**
	 * Gets the stack value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf Stack
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function stackGet(key) {
	  return this.__data__.get(key);
	}

	/**
	 * Checks if a stack value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf Stack
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function stackHas(key) {
	  return this.__data__.has(key);
	}

	/**
	 * Sets the stack `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf Stack
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the stack cache instance.
	 */
	function stackSet(key, value) {
	  var data = this.__data__;
	  if (data instanceof ListCache) {
	    var pairs = data.__data__;
	    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
	      pairs.push([key, value]);
	      this.size = ++data.size;
	      return this;
	    }
	    data = this.__data__ = new MapCache(pairs);
	  }
	  data.set(key, value);
	  this.size = data.size;
	  return this;
	}

	// Add methods to `Stack`.
	Stack.prototype.clear = stackClear;
	Stack.prototype['delete'] = stackDelete;
	Stack.prototype.get = stackGet;
	Stack.prototype.has = stackHas;
	Stack.prototype.set = stackSet;

	/**
	 * Creates an array of the enumerable property names of the array-like `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @param {boolean} inherited Specify returning inherited property names.
	 * @returns {Array} Returns the array of property names.
	 */
	function arrayLikeKeys(value, inherited) {
	  var isArr = isArray(value),
	      isArg = !isArr && isArguments(value),
	      isBuff = !isArr && !isArg && isBuffer(value),
	      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
	      skipIndexes = isArr || isArg || isBuff || isType,
	      result = skipIndexes ? baseTimes(value.length, String) : [],
	      length = result.length;

	  for (var key in value) {
	    if ((inherited || hasOwnProperty.call(value, key)) &&
	        !(skipIndexes && (
	           // Safari 9 has enumerable `arguments.length` in strict mode.
	           key == 'length' ||
	           // Node.js 0.10 has enumerable non-index properties on buffers.
	           (isBuff && (key == 'offset' || key == 'parent')) ||
	           // PhantomJS 2 has enumerable non-index properties on typed arrays.
	           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
	           // Skip index properties.
	           isIndex(key, length)
	        ))) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	/**
	 * This function is like `assignValue` except that it doesn't assign
	 * `undefined` values.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function assignMergeValue(object, key, value) {
	  if ((value !== undefined && !eq(object[key], value)) ||
	      (value === undefined && !(key in object))) {
	    baseAssignValue(object, key, value);
	  }
	}

	/**
	 * Assigns `value` to `key` of `object` if the existing value is not equivalent
	 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * for equality comparisons.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function assignValue(object, key, value) {
	  var objValue = object[key];
	  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
	      (value === undefined && !(key in object))) {
	    baseAssignValue(object, key, value);
	  }
	}

	/**
	 * Gets the index at which the `key` is found in `array` of key-value pairs.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} key The key to search for.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function assocIndexOf(array, key) {
	  var length = array.length;
	  while (length--) {
	    if (eq(array[length][0], key)) {
	      return length;
	    }
	  }
	  return -1;
	}

	/**
	 * The base implementation of `assignValue` and `assignMergeValue` without
	 * value checks.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function baseAssignValue(object, key, value) {
	  if (key == '__proto__' && defineProperty) {
	    defineProperty(object, key, {
	      'configurable': true,
	      'enumerable': true,
	      'value': value,
	      'writable': true
	    });
	  } else {
	    object[key] = value;
	  }
	}

	/**
	 * The base implementation of `baseForOwn` which iterates over `object`
	 * properties returned by `keysFunc` and invokes `iteratee` for each property.
	 * Iteratee functions may exit iteration early by explicitly returning `false`.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @param {Function} keysFunc The function to get the keys of `object`.
	 * @returns {Object} Returns `object`.
	 */
	var baseFor = createBaseFor();

	/**
	 * The base implementation of `getTag` without fallbacks for buggy environments.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	function baseGetTag(value) {
	  if (value == null) {
	    return value === undefined ? undefinedTag : nullTag;
	  }
	  return (symToStringTag && symToStringTag in Object(value))
	    ? getRawTag(value)
	    : objectToString(value);
	}

	/**
	 * The base implementation of `_.isArguments`.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
	 */
	function baseIsArguments(value) {
	  return isObjectLike(value) && baseGetTag(value) == argsTag;
	}

	/**
	 * The base implementation of `_.isNative` without bad shim checks.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function,
	 *  else `false`.
	 */
	function baseIsNative(value) {
	  if (!isObject(value) || isMasked(value)) {
	    return false;
	  }
	  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
	  return pattern.test(toSource(value));
	}

	/**
	 * The base implementation of `_.isTypedArray` without Node.js optimizations.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
	 */
	function baseIsTypedArray(value) {
	  return isObjectLike(value) &&
	    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
	}

	/**
	 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function baseKeysIn(object) {
	  if (!isObject(object)) {
	    return nativeKeysIn(object);
	  }
	  var isProto = isPrototype(object),
	      result = [];

	  for (var key in object) {
	    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	/**
	 * The base implementation of `_.merge` without support for multiple sources.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @param {number} srcIndex The index of `source`.
	 * @param {Function} [customizer] The function to customize merged values.
	 * @param {Object} [stack] Tracks traversed source values and their merged
	 *  counterparts.
	 */
	function baseMerge(object, source, srcIndex, customizer, stack) {
	  if (object === source) {
	    return;
	  }
	  baseFor(source, function(srcValue, key) {
	    stack || (stack = new Stack);
	    if (isObject(srcValue)) {
	      baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
	    }
	    else {
	      var newValue = customizer
	        ? customizer(safeGet(object, key), srcValue, (key + ''), object, source, stack)
	        : undefined;

	      if (newValue === undefined) {
	        newValue = srcValue;
	      }
	      assignMergeValue(object, key, newValue);
	    }
	  }, keysIn);
	}

	/**
	 * A specialized version of `baseMerge` for arrays and objects which performs
	 * deep merges and tracks traversed objects enabling objects with circular
	 * references to be merged.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @param {string} key The key of the value to merge.
	 * @param {number} srcIndex The index of `source`.
	 * @param {Function} mergeFunc The function to merge values.
	 * @param {Function} [customizer] The function to customize assigned values.
	 * @param {Object} [stack] Tracks traversed source values and their merged
	 *  counterparts.
	 */
	function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
	  var objValue = safeGet(object, key),
	      srcValue = safeGet(source, key),
	      stacked = stack.get(srcValue);

	  if (stacked) {
	    assignMergeValue(object, key, stacked);
	    return;
	  }
	  var newValue = customizer
	    ? customizer(objValue, srcValue, (key + ''), object, source, stack)
	    : undefined;

	  var isCommon = newValue === undefined;

	  if (isCommon) {
	    var isArr = isArray(srcValue),
	        isBuff = !isArr && isBuffer(srcValue),
	        isTyped = !isArr && !isBuff && isTypedArray(srcValue);

	    newValue = srcValue;
	    if (isArr || isBuff || isTyped) {
	      if (isArray(objValue)) {
	        newValue = objValue;
	      }
	      else if (isArrayLikeObject(objValue)) {
	        newValue = copyArray(objValue);
	      }
	      else if (isBuff) {
	        isCommon = false;
	        newValue = cloneBuffer(srcValue, true);
	      }
	      else if (isTyped) {
	        isCommon = false;
	        newValue = cloneTypedArray(srcValue, true);
	      }
	      else {
	        newValue = [];
	      }
	    }
	    else if (isPlainObject(srcValue) || isArguments(srcValue)) {
	      newValue = objValue;
	      if (isArguments(objValue)) {
	        newValue = toPlainObject(objValue);
	      }
	      else if (!isObject(objValue) || isFunction(objValue)) {
	        newValue = initCloneObject(srcValue);
	      }
	    }
	    else {
	      isCommon = false;
	    }
	  }
	  if (isCommon) {
	    // Recursively merge objects and arrays (susceptible to call stack limits).
	    stack.set(srcValue, newValue);
	    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
	    stack['delete'](srcValue);
	  }
	  assignMergeValue(object, key, newValue);
	}

	/**
	 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
	 *
	 * @private
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @returns {Function} Returns the new function.
	 */
	function baseRest(func, start) {
	  return setToString(overRest(func, start, identity), func + '');
	}

	/**
	 * The base implementation of `setToString` without support for hot loop shorting.
	 *
	 * @private
	 * @param {Function} func The function to modify.
	 * @param {Function} string The `toString` result.
	 * @returns {Function} Returns `func`.
	 */
	var baseSetToString = !defineProperty ? identity : function(func, string) {
	  return defineProperty(func, 'toString', {
	    'configurable': true,
	    'enumerable': false,
	    'value': constant(string),
	    'writable': true
	  });
	};

	/**
	 * Creates a clone of  `buffer`.
	 *
	 * @private
	 * @param {Buffer} buffer The buffer to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Buffer} Returns the cloned buffer.
	 */
	function cloneBuffer(buffer, isDeep) {
	  if (isDeep) {
	    return buffer.slice();
	  }
	  var length = buffer.length,
	      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

	  buffer.copy(result);
	  return result;
	}

	/**
	 * Creates a clone of `arrayBuffer`.
	 *
	 * @private
	 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
	 * @returns {ArrayBuffer} Returns the cloned array buffer.
	 */
	function cloneArrayBuffer(arrayBuffer) {
	  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
	  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
	  return result;
	}

	/**
	 * Creates a clone of `typedArray`.
	 *
	 * @private
	 * @param {Object} typedArray The typed array to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the cloned typed array.
	 */
	function cloneTypedArray(typedArray, isDeep) {
	  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
	  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
	}

	/**
	 * Copies the values of `source` to `array`.
	 *
	 * @private
	 * @param {Array} source The array to copy values from.
	 * @param {Array} [array=[]] The array to copy values to.
	 * @returns {Array} Returns `array`.
	 */
	function copyArray(source, array) {
	  var index = -1,
	      length = source.length;

	  array || (array = Array(length));
	  while (++index < length) {
	    array[index] = source[index];
	  }
	  return array;
	}

	/**
	 * Copies properties of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy properties from.
	 * @param {Array} props The property identifiers to copy.
	 * @param {Object} [object={}] The object to copy properties to.
	 * @param {Function} [customizer] The function to customize copied values.
	 * @returns {Object} Returns `object`.
	 */
	function copyObject(source, props, object, customizer) {
	  var isNew = !object;
	  object || (object = {});

	  var index = -1,
	      length = props.length;

	  while (++index < length) {
	    var key = props[index];

	    var newValue = customizer
	      ? customizer(object[key], source[key], key, object, source)
	      : undefined;

	    if (newValue === undefined) {
	      newValue = source[key];
	    }
	    if (isNew) {
	      baseAssignValue(object, key, newValue);
	    } else {
	      assignValue(object, key, newValue);
	    }
	  }
	  return object;
	}

	/**
	 * Creates a function like `_.assign`.
	 *
	 * @private
	 * @param {Function} assigner The function to assign values.
	 * @returns {Function} Returns the new assigner function.
	 */
	function createAssigner(assigner) {
	  return baseRest(function(object, sources) {
	    var index = -1,
	        length = sources.length,
	        customizer = length > 1 ? sources[length - 1] : undefined,
	        guard = length > 2 ? sources[2] : undefined;

	    customizer = (assigner.length > 3 && typeof customizer == 'function')
	      ? (length--, customizer)
	      : undefined;

	    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
	      customizer = length < 3 ? undefined : customizer;
	      length = 1;
	    }
	    object = Object(object);
	    while (++index < length) {
	      var source = sources[index];
	      if (source) {
	        assigner(object, source, index, customizer);
	      }
	    }
	    return object;
	  });
	}

	/**
	 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
	 *
	 * @private
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new base function.
	 */
	function createBaseFor(fromRight) {
	  return function(object, iteratee, keysFunc) {
	    var index = -1,
	        iterable = Object(object),
	        props = keysFunc(object),
	        length = props.length;

	    while (length--) {
	      var key = props[fromRight ? length : ++index];
	      if (iteratee(iterable[key], key, iterable) === false) {
	        break;
	      }
	    }
	    return object;
	  };
	}

	/**
	 * Gets the data for `map`.
	 *
	 * @private
	 * @param {Object} map The map to query.
	 * @param {string} key The reference key.
	 * @returns {*} Returns the map data.
	 */
	function getMapData(map, key) {
	  var data = map.__data__;
	  return isKeyable(key)
	    ? data[typeof key == 'string' ? 'string' : 'hash']
	    : data.map;
	}

	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = getValue(object, key);
	  return baseIsNative(value) ? value : undefined;
	}

	/**
	 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the raw `toStringTag`.
	 */
	function getRawTag(value) {
	  var isOwn = hasOwnProperty.call(value, symToStringTag),
	      tag = value[symToStringTag];

	  try {
	    value[symToStringTag] = undefined;
	    var unmasked = true;
	  } catch (e) {}

	  var result = nativeObjectToString.call(value);
	  if (unmasked) {
	    if (isOwn) {
	      value[symToStringTag] = tag;
	    } else {
	      delete value[symToStringTag];
	    }
	  }
	  return result;
	}

	/**
	 * Initializes an object clone.
	 *
	 * @private
	 * @param {Object} object The object to clone.
	 * @returns {Object} Returns the initialized clone.
	 */
	function initCloneObject(object) {
	  return (typeof object.constructor == 'function' && !isPrototype(object))
	    ? baseCreate(getPrototype(object))
	    : {};
	}

	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  var type = typeof value;
	  length = length == null ? MAX_SAFE_INTEGER : length;

	  return !!length &&
	    (type == 'number' ||
	      (type != 'symbol' && reIsUint.test(value))) &&
	        (value > -1 && value % 1 == 0 && value < length);
	}

	/**
	 * Checks if the given arguments are from an iteratee call.
	 *
	 * @private
	 * @param {*} value The potential iteratee value argument.
	 * @param {*} index The potential iteratee index or key argument.
	 * @param {*} object The potential iteratee object argument.
	 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
	 *  else `false`.
	 */
	function isIterateeCall(value, index, object) {
	  if (!isObject(object)) {
	    return false;
	  }
	  var type = typeof index;
	  if (type == 'number'
	        ? (isArrayLike(object) && isIndex(index, object.length))
	        : (type == 'string' && index in object)
	      ) {
	    return eq(object[index], value);
	  }
	  return false;
	}

	/**
	 * Checks if `value` is suitable for use as unique object key.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
	 */
	function isKeyable(value) {
	  var type = typeof value;
	  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
	    ? (value !== '__proto__')
	    : (value === null);
	}

	/**
	 * Checks if `func` has its source masked.
	 *
	 * @private
	 * @param {Function} func The function to check.
	 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
	 */
	function isMasked(func) {
	  return !!maskSrcKey && (maskSrcKey in func);
	}

	/**
	 * Checks if `value` is likely a prototype object.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
	 */
	function isPrototype(value) {
	  var Ctor = value && value.constructor,
	      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

	  return value === proto;
	}

	/**
	 * This function is like
	 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
	 * except that it includes inherited enumerable properties.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function nativeKeysIn(object) {
	  var result = [];
	  if (object != null) {
	    for (var key in Object(object)) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	/**
	 * Converts `value` to a string using `Object.prototype.toString`.
	 *
	 * @private
	 * @param {*} value The value to convert.
	 * @returns {string} Returns the converted string.
	 */
	function objectToString(value) {
	  return nativeObjectToString.call(value);
	}

	/**
	 * A specialized version of `baseRest` which transforms the rest array.
	 *
	 * @private
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @param {Function} transform The rest array transform.
	 * @returns {Function} Returns the new function.
	 */
	function overRest(func, start, transform) {
	  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
	  return function() {
	    var args = arguments,
	        index = -1,
	        length = nativeMax(args.length - start, 0),
	        array = Array(length);

	    while (++index < length) {
	      array[index] = args[start + index];
	    }
	    index = -1;
	    var otherArgs = Array(start + 1);
	    while (++index < start) {
	      otherArgs[index] = args[index];
	    }
	    otherArgs[start] = transform(array);
	    return apply(func, this, otherArgs);
	  };
	}

	/**
	 * Gets the value at `key`, unless `key` is "__proto__" or "constructor".
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the property to get.
	 * @returns {*} Returns the property value.
	 */
	function safeGet(object, key) {
	  if (key === 'constructor' && typeof object[key] === 'function') {
	    return;
	  }

	  if (key == '__proto__') {
	    return;
	  }

	  return object[key];
	}

	/**
	 * Sets the `toString` method of `func` to return `string`.
	 *
	 * @private
	 * @param {Function} func The function to modify.
	 * @param {Function} string The `toString` result.
	 * @returns {Function} Returns `func`.
	 */
	var setToString = shortOut(baseSetToString);

	/**
	 * Creates a function that'll short out and invoke `identity` instead
	 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
	 * milliseconds.
	 *
	 * @private
	 * @param {Function} func The function to restrict.
	 * @returns {Function} Returns the new shortable function.
	 */
	function shortOut(func) {
	  var count = 0,
	      lastCalled = 0;

	  return function() {
	    var stamp = nativeNow(),
	        remaining = HOT_SPAN - (stamp - lastCalled);

	    lastCalled = stamp;
	    if (remaining > 0) {
	      if (++count >= HOT_COUNT) {
	        return arguments[0];
	      }
	    } else {
	      count = 0;
	    }
	    return func.apply(undefined, arguments);
	  };
	}

	/**
	 * Converts `func` to its source code.
	 *
	 * @private
	 * @param {Function} func The function to convert.
	 * @returns {string} Returns the source code.
	 */
	function toSource(func) {
	  if (func != null) {
	    try {
	      return funcToString.call(func);
	    } catch (e) {}
	    try {
	      return (func + '');
	    } catch (e) {}
	  }
	  return '';
	}

	/**
	 * Performs a
	 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * comparison between two values to determine if they are equivalent.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 * @example
	 *
	 * var object = { 'a': 1 };
	 * var other = { 'a': 1 };
	 *
	 * _.eq(object, object);
	 * // => true
	 *
	 * _.eq(object, other);
	 * // => false
	 *
	 * _.eq('a', 'a');
	 * // => true
	 *
	 * _.eq('a', Object('a'));
	 * // => false
	 *
	 * _.eq(NaN, NaN);
	 * // => true
	 */
	function eq(value, other) {
	  return value === other || (value !== value && other !== other);
	}

	/**
	 * Checks if `value` is likely an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
	  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
	    !propertyIsEnumerable.call(value, 'callee');
	};

	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(document.body.children);
	 * // => false
	 *
	 * _.isArray('abc');
	 * // => false
	 *
	 * _.isArray(_.noop);
	 * // => false
	 */
	var isArray = Array.isArray;

	/**
	 * Checks if `value` is array-like. A value is considered array-like if it's
	 * not a function and has a `value.length` that's an integer greater than or
	 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 * @example
	 *
	 * _.isArrayLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLike(document.body.children);
	 * // => true
	 *
	 * _.isArrayLike('abc');
	 * // => true
	 *
	 * _.isArrayLike(_.noop);
	 * // => false
	 */
	function isArrayLike(value) {
	  return value != null && isLength(value.length) && !isFunction(value);
	}

	/**
	 * This method is like `_.isArrayLike` except that it also checks if `value`
	 * is an object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array-like object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArrayLikeObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLikeObject(document.body.children);
	 * // => true
	 *
	 * _.isArrayLikeObject('abc');
	 * // => false
	 *
	 * _.isArrayLikeObject(_.noop);
	 * // => false
	 */
	function isArrayLikeObject(value) {
	  return isObjectLike(value) && isArrayLike(value);
	}

	/**
	 * Checks if `value` is a buffer.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.3.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
	 * @example
	 *
	 * _.isBuffer(new Buffer(2));
	 * // => true
	 *
	 * _.isBuffer(new Uint8Array(2));
	 * // => false
	 */
	var isBuffer = nativeIsBuffer || stubFalse;

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  if (!isObject(value)) {
	    return false;
	  }
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in Safari 9 which returns 'object' for typed arrays and other constructors.
	  var tag = baseGetTag(value);
	  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
	}

	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This method is loosely based on
	 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 * @example
	 *
	 * _.isLength(3);
	 * // => true
	 *
	 * _.isLength(Number.MIN_VALUE);
	 * // => false
	 *
	 * _.isLength(Infinity);
	 * // => false
	 *
	 * _.isLength('3');
	 * // => false
	 */
	function isLength(value) {
	  return typeof value == 'number' &&
	    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}

	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
	  var type = typeof value;
	  return value != null && (type == 'object' || type == 'function');
	}

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return value != null && typeof value == 'object';
	}

	/**
	 * Checks if `value` is a plain object, that is, an object created by the
	 * `Object` constructor or one with a `[[Prototype]]` of `null`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.8.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 * }
	 *
	 * _.isPlainObject(new Foo);
	 * // => false
	 *
	 * _.isPlainObject([1, 2, 3]);
	 * // => false
	 *
	 * _.isPlainObject({ 'x': 0, 'y': 0 });
	 * // => true
	 *
	 * _.isPlainObject(Object.create(null));
	 * // => true
	 */
	function isPlainObject(value) {
	  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
	    return false;
	  }
	  var proto = getPrototype(value);
	  if (proto === null) {
	    return true;
	  }
	  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
	  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
	    funcToString.call(Ctor) == objectCtorString;
	}

	/**
	 * Checks if `value` is classified as a typed array.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
	 * @example
	 *
	 * _.isTypedArray(new Uint8Array);
	 * // => true
	 *
	 * _.isTypedArray([]);
	 * // => false
	 */
	var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

	/**
	 * Converts `value` to a plain object flattening inherited enumerable string
	 * keyed properties of `value` to own properties of the plain object.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {Object} Returns the converted plain object.
	 * @example
	 *
	 * function Foo() {
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.assign({ 'a': 1 }, new Foo);
	 * // => { 'a': 1, 'b': 2 }
	 *
	 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
	 * // => { 'a': 1, 'b': 2, 'c': 3 }
	 */
	function toPlainObject(value) {
	  return copyObject(value, keysIn(value));
	}

	/**
	 * Creates an array of the own and inherited enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keysIn(new Foo);
	 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
	 */
	function keysIn(object) {
	  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
	}

	/**
	 * This method is like `_.assign` except that it recursively merges own and
	 * inherited enumerable string keyed properties of source objects into the
	 * destination object. Source properties that resolve to `undefined` are
	 * skipped if a destination value exists. Array and plain object properties
	 * are merged recursively. Other objects and value types are overridden by
	 * assignment. Source objects are applied from left to right. Subsequent
	 * sources overwrite property assignments of previous sources.
	 *
	 * **Note:** This method mutates `object`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.5.0
	 * @category Object
	 * @param {Object} object The destination object.
	 * @param {...Object} [sources] The source objects.
	 * @returns {Object} Returns `object`.
	 * @example
	 *
	 * var object = {
	 *   'a': [{ 'b': 2 }, { 'd': 4 }]
	 * };
	 *
	 * var other = {
	 *   'a': [{ 'c': 3 }, { 'e': 5 }]
	 * };
	 *
	 * _.merge(object, other);
	 * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
	 */
	var merge = createAssigner(function(object, source, srcIndex) {
	  baseMerge(object, source, srcIndex);
	});

	/**
	 * Creates a function that returns `value`.
	 *
	 * @static
	 * @memberOf _
	 * @since 2.4.0
	 * @category Util
	 * @param {*} value The value to return from the new function.
	 * @returns {Function} Returns the new constant function.
	 * @example
	 *
	 * var objects = _.times(2, _.constant({ 'a': 1 }));
	 *
	 * console.log(objects);
	 * // => [{ 'a': 1 }, { 'a': 1 }]
	 *
	 * console.log(objects[0] === objects[1]);
	 * // => true
	 */
	function constant(value) {
	  return function() {
	    return value;
	  };
	}

	/**
	 * This method returns the first argument it receives.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Util
	 * @param {*} value Any value.
	 * @returns {*} Returns `value`.
	 * @example
	 *
	 * var object = { 'a': 1 };
	 *
	 * console.log(_.identity(object) === object);
	 * // => true
	 */
	function identity(value) {
	  return value;
	}

	/**
	 * This method returns `false`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.13.0
	 * @category Util
	 * @returns {boolean} Returns `false`.
	 * @example
	 *
	 * _.times(2, _.stubFalse);
	 * // => [false, false]
	 */
	function stubFalse() {
	  return false;
	}

	module.exports = merge;
	}(lodash_merge, lodash_merge.exports));

	Object.defineProperty(lib, "__esModule", {
	  value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * index.js
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * react-native-cross-platform-storage
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * Created by Mike Grabowski on 12/12/16.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * Copyright © 2016 Callstack.io. All rights reserved.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * 
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */

	var _lodash = lodash_merge.exports;

	var _lodash2 = _interopRequireDefault(_lodash);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var API = {
	  getItem: function getItem(key, cb) {
	    return API.multiGet([key]).then(function (values) {
	      return values[0][1];
	    }).then(function (data) {
	      cb && cb(null, data);
	      return data;
	    }).catch(function (err) {
	      cb && cb(err, null);
	      return err;
	    });
	  },
	  setItem: function setItem(key, value, cb) {
	    return API.multiSet([[key, value]]).then(function (data) {
	      cb && cb(null, data);
	      return data;
	    }).catch(function (err) {
	      cb && cb(err, null);
	      return err;
	    });
	  },
	  getAllKeys: function getAllKeys(cb) {
	    return Promise.resolve(Object.keys(localStorage)).then(function (data) {
	      cb && cb(null, data);
	      return data;
	    }).catch(function (err) {
	      cb && cb(err, null);
	      return err;
	    });
	  },
	  removeItem: function removeItem(key, cb) {
	    return API.multiRemove([key]).then(function () {
	      cb && cb(null);
	    }).catch(function (err) {
	      cb && cb(err, null);
	    });
	  },
	  clear: function clear() {
	    return new Promise(function (resolve) {
	      window.localStorage.clear();
	      resolve();
	    });
	  },
	  mergeItem: function mergeItem(key, value) {
	    return API.multiMerge([[key, value]]);
	  },
	  multiGet: function multiGet(keys) {
	    return new Promise(function (resolve) {
	      var keyValues = keys.reduce(function (acc, key) {
	        return acc.concat([[key, localStorage.getItem(key)]]);
	      }, []);
	      resolve(keyValues);
	    });
	  },
	  multiSet: function multiSet(kvPairs) {
	    return new Promise(function (resolve, reject) {
	      var errors = [];

	      kvPairs.forEach(function (_ref) {
	        var _ref2 = _slicedToArray(_ref, 2),
	            key = _ref2[0],
	            value = _ref2[1];

	        try {
	          localStorage.setItem(key, value);
	        } catch (error) {
	          errors.push(error);
	        }
	      });

	      return errors.length > 0 ? reject(errors) : resolve();
	    });
	  },
	  multiMerge: function multiMerge(kvPairs) {
	    return new Promise(function (resolve, reject) {
	      var errors = [];

	      kvPairs.forEach(function (_ref3) {
	        var _ref4 = _slicedToArray(_ref3, 2),
	            key = _ref4[0],
	            value = _ref4[1];

	        var rawValue = localStorage.getItem(key);

	        if (!rawValue) {
	          return;
	        }

	        try {
	          localStorage.setItem(key, JSON.stringify((0, _lodash2.default)(JSON.parse(rawValue), JSON.parse(value))));
	        } catch (error) {
	          errors.push(error);
	        }
	      });

	      return errors.length > 0 ? reject(errors) : resolve();
	    });
	  },
	  multiRemove: function multiRemove(keys) {
	    return new Promise(function (resolve) {
	      keys.forEach(function (key) {
	        return window.localStorage.removeItem(key);
	      });
	      resolve();
	    });
	  },
	  flushGetRequests: function flushGetRequests() {
	    // eslint-disable-next-line
	    console.warn('AsyncStorage.flushGetRequests: Not supported on `web`');
	  }
	};

	var _default = lib.default = API;

	/******************************************************************************
	Copyright (c) Microsoft Corporation.

	Permission to use, copy, modify, and/or distribute this software for any
	purpose with or without fee is hereby granted.

	THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
	REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
	AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
	INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
	LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
	OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
	PERFORMANCE OF THIS SOFTWARE.
	***************************************************************************** */

	var __assign = function() {
	    __assign = Object.assign || function __assign(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign.apply(this, arguments);
	};

	function __spreadArray$1(to, from, pack) {
	    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
	        if (ar || !(i in from)) {
	            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
	            ar[i] = from[i];
	        }
	    }
	    return to.concat(ar || Array.prototype.slice.call(from));
	}

	// do not edit .js files directly - edit src/index.jst



	var fastDeepEqual = function equal(a, b) {
	  if (a === b) return true;

	  if (a && b && typeof a == 'object' && typeof b == 'object') {
	    if (a.constructor !== b.constructor) return false;

	    var length, i, keys;
	    if (Array.isArray(a)) {
	      length = a.length;
	      if (length != b.length) return false;
	      for (i = length; i-- !== 0;)
	        if (!equal(a[i], b[i])) return false;
	      return true;
	    }



	    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
	    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
	    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();

	    keys = Object.keys(a);
	    length = keys.length;
	    if (length !== Object.keys(b).length) return false;

	    for (i = length; i-- !== 0;)
	      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

	    for (i = length; i-- !== 0;) {
	      var key = keys[i];

	      if (!equal(a[key], b[key])) return false;
	    }

	    return true;
	  }

	  // true if both NaN, false otherwise
	  return a!==a && b!==b;
	};

	var _fetch;
	var AsyncStorage = null;
	var FLAGSMITH_KEY = "BULLET_TRAIN_DB";
	var FLAGSMITH_EVENT = "BULLET_TRAIN_EVENT";
	var defaultAPI = 'https://edge.api.flagsmith.com/api/v1/';
	var eventSource;
	var initError = function (caller) {
	    return "Attempted to " + caller + " a user before calling flagsmith.init. Call flagsmith.init first, if you wish to prevent it sending a request for flags, call init with preventFetch:true.";
	};
	var Flagsmith = /** @class */ (function () {
	    function class_1(props) {
	        var _this = this;
	        this.eventSource = null;
	        this.getJSON = function (url, method, body) {
	            var _a = _this, environmentID = _a.environmentID, headers = _a.headers;
	            var options = {
	                method: method || 'GET',
	                body: body,
	                headers: {
	                    'x-environment-key': "".concat(environmentID)
	                }
	            };
	            if (method && method !== "GET")
	                options.headers['Content-Type'] = 'application/json; charset=utf-8';
	            if (headers) {
	                Object.assign(options.headers, headers);
	            }
	            if (!_fetch) {
	                console.error("Flagsmith: fetch is undefined, please specify a fetch implementation into flagsmith.init to support SSR.");
	            }
	            return _fetch(url, options)
	                .then(function (res) {
	                _this.log("Fetch response: " + res.status + " " + (method || "GET") + +" " + url);
	                return res.text()
	                    .then(function (text) {
	                    var err = text;
	                    try {
	                        err = JSON.parse(text);
	                    }
	                    catch (e) { }
	                    return res.status >= 200 && res.status ? err : Promise.reject(err);
	                });
	            })["catch"](function (e) {
	                console.error("Flagsmith: Fetch error: " + e);
	                throw new Error("Flagsmith: Fetch error:" + e);
	            });
	        };
	        this.getFlags = function (resolve, reject) {
	            var _a = _this, onChange = _a.onChange, onError = _a.onError, identity = _a.identity, api = _a.api;
	            var resolved = false;
	            _this.log("Get Flags");
	            var handleResponse = function (_a) {
	                var features = _a.flags, traits = _a.traits;
	                if (identity) {
	                    _this.withTraits = null;
	                }
	                // Handle server response
	                var flags = {};
	                var userTraits = {};
	                features = features || [];
	                traits = traits || [];
	                features.forEach(function (feature) {
	                    flags[feature.feature.name.toLowerCase().replace(/ /g, '_')] = {
	                        id: feature.feature.id,
	                        enabled: feature.enabled,
	                        value: feature.feature_state_value
	                    };
	                });
	                traits.forEach(function (trait) {
	                    userTraits[trait.trait_key.toLowerCase().replace(/ /g, '_')] = trait.trait_value;
	                });
	                _this.oldFlags = __assign({}, _this.flags);
	                var flagsEqual = fastDeepEqual(_this.flags, flags);
	                var traitsEqual = fastDeepEqual(_this.traits, userTraits);
	                _this.flags = flags;
	                _this.traits = userTraits;
	                _this.updateStorage();
	                if (_this.dtrum) {
	                    var traits_1 = {
	                        javaDouble: {},
	                        date: {},
	                        shortString: {},
	                        javaLongOrObject: {}
	                    };
	                    Object.keys(_this.flags).map(function (key) {
	                        setDynatraceValue(traits_1, "flagsmith_value_" + key, _this.getValue(key));
	                        setDynatraceValue(traits_1, "flagsmith_enabled_" + key, _this.hasFeature(key));
	                    });
	                    Object.keys(_this.traits).map(function (key) {
	                        setDynatraceValue(traits_1, "flagsmith_trait_" + key, _this.getTrait(key));
	                    });
	                    _this.log("Sending javaLongOrObject traits to dynatrace", traits_1.javaLongOrObject);
	                    _this.log("Sending date traits to dynatrace", traits_1.date);
	                    _this.log("Sending shortString traits to dynatrace", traits_1.shortString);
	                    _this.log("Sending javaDouble to dynatrace", traits_1.javaDouble);
	                    // @ts-expect-error
	                    _this.dtrum.sendSessionProperties(traits_1.javaLongOrObject, traits_1.date, traits_1.shortString, traits_1.javaDouble);
	                }
	                if (_this.trigger) {
	                    _this.trigger();
	                }
	                if (onChange) {
	                    onChange(_this.oldFlags, {
	                        isFromServer: true,
	                        flagsChanged: !flagsEqual,
	                        traitsChanged: !traitsEqual
	                    });
	                }
	            };
	            if (identity) {
	                return Promise.all([
	                    _this.withTraits ?
	                        _this.getJSON(api + 'identities/', "POST", JSON.stringify({
	                            "identifier": identity,
	                            traits: Object.keys(_this.withTraits).map(function (k) { return ({
	                                "trait_key": k,
	                                "trait_value": _this.withTraits[k]
	                            }); })
	                        })) :
	                        _this.getJSON(api + 'identities/?identifier=' + encodeURIComponent(identity)),
	                ])
	                    .then(function (res) {
	                    _this.withTraits = null;
	                    handleResponse(res[0]);
	                    if (resolve && !resolved) {
	                        resolved = true;
	                        resolve();
	                    }
	                })["catch"](function (_a) {
	                    var message = _a.message;
	                    onError && onError({ message: message });
	                });
	            }
	            else {
	                return Promise.all([
	                    _this.getJSON(api + "flags/")
	                ])
	                    .then(function (res) {
	                    handleResponse({ flags: res[0], traits: undefined });
	                    if (resolve && !resolved) {
	                        resolved = true;
	                        resolve();
	                    }
	                })["catch"](function (err) {
	                    if (reject && !resolved) {
	                        resolved = true;
	                        reject(err);
	                    }
	                    onError && onError(err);
	                });
	            }
	        };
	        this.analyticsFlags = function () {
	            var api = _this.api;
	            if (!_this.evaluationEvent || !_this.evaluationEvent[_this.environmentID]) {
	                return;
	            }
	            if (_this.evaluationEvent && Object.getOwnPropertyNames(_this.evaluationEvent).length !== 0 && Object.getOwnPropertyNames(_this.evaluationEvent[_this.environmentID]).length !== 0) {
	                return _this.getJSON(api + 'analytics/flags/', 'POST', JSON.stringify(_this.evaluationEvent[_this.environmentID]))
	                    .then(function (res) {
	                    var state = _this.getState();
	                    if (!_this.evaluationEvent) {
	                        _this.evaluationEvent = {};
	                    }
	                    _this.evaluationEvent[_this.environmentID] = {};
	                    _this.setState(__assign(__assign({}, state), { evaluationEvent: _this.evaluationEvent }));
	                    _this.updateEventStorage();
	                })["catch"](function (err) {
	                    _this.log("Exception fetching evaluationEvent", err);
	                });
	            }
	        };
	        this.canUseStorage = false;
	        this.analyticsInterval = null;
	        this.api = null;
	        this.cacheFlags = false;
	        this.ts = null;
	        this.enableAnalytics = false;
	        this.enableLogs = false;
	        this.environmentID = "";
	        this.evaluationEvent = null;
	        this.flags = null;
	        this.getFlagInterval = null;
	        this.headers = null;
	        this.initialised = false;
	        this.oldFlags = null;
	        this.onChange = null;
	        this.onError = null;
	        this.trigger = null;
	        this.identity = null;
	        this.ticks = null;
	        this.timer = null;
	        this.traits = null;
	        this.dtrum = null;
	        this.withTraits = null;
	        this.cacheOptions = { ttl: 0, skipAPI: false };
	        this.evaluateFlag = function (key) {
	            if (_this.enableAnalytics) {
	                if (!_this.evaluationEvent)
	                    return;
	                if (!_this.evaluationEvent[_this.environmentID]) {
	                    _this.evaluationEvent[_this.environmentID] = {};
	                }
	                if (_this.evaluationEvent[_this.environmentID][key] === undefined) {
	                    _this.evaluationEvent[_this.environmentID][key] = 0;
	                }
	                _this.evaluationEvent[_this.environmentID][key] += 1;
	            }
	            _this.updateEventStorage();
	        };
	        this.getValue = function (key, options) {
	            var flag = _this.flags && _this.flags[key.toLowerCase().replace(/ /g, '_')];
	            var res = null;
	            if (flag) {
	                res = flag.value;
	            }
	            _this.evaluateFlag(key);
	            if (options === null || options === void 0 ? void 0 : options.json) {
	                try {
	                    if (res === null) {
	                        _this.log("Tried to parse null flag as JSON: " + key);
	                        return options.fallback;
	                    }
	                    return JSON.parse(res);
	                }
	                catch (e) {
	                    return options.fallback;
	                }
	            }
	            //todo record check for value
	            return res;
	        };
	        this.getTrait = function (key) {
	            var trait = _this.traits && _this.traits[key.toLowerCase().replace(/ /g, '_')];
	            return trait;
	        };
	        this.setTrait = function (key, trait_value) {
	            var _a = _this, getJSON = _a.getJSON, identity = _a.identity, api = _a.api;
	            if (!api) {
	                console.error(initError("setTrait"));
	                return;
	            }
	            var traits = {};
	            traits[key] = trait_value;
	            if (!_this.identity) {
	                _this.withTraits = __assign(__assign({}, (_this.withTraits || {})), traits);
	                _this.log("Set trait prior to identifying", _this.withTraits);
	                return;
	            }
	            var body = {
	                "identity": {
	                    "identifier": identity
	                },
	                "trait_key": key,
	                "trait_value": trait_value
	            };
	            return getJSON("".concat(api, "traits/"), 'POST', JSON.stringify(body))
	                .then(function () {
	                if (_this.initialised) {
	                    _this.getFlags();
	                }
	            });
	        };
	        this.setTraits = function (traits) {
	            var _a = _this; _a.getJSON; var identity = _a.identity, api = _a.api;
	            if (!api) {
	                console.error(initError("setTraits"));
	                return;
	            }
	            if (!traits || typeof traits !== 'object') {
	                console.error("Expected object for flagsmith.setTraits");
	            }
	            if (!_this.identity) {
	                _this.withTraits = __assign(__assign({}, (_this.withTraits || {})), traits);
	                _this.log("Set traits prior to identifying", _this.withTraits);
	                return;
	            }
	            return _this.getJSON(api + 'identities/', "POST", JSON.stringify({
	                "identifier": identity,
	                traits: Object.keys(traits).map(function (k) { return ({
	                    "trait_key": k,
	                    "trait_value": traits[k]
	                }); })
	            })).then(function () {
	                if (_this.initialised) {
	                    _this.getFlags();
	                }
	            });
	        };
	        this.hasFeature = function (key) {
	            var flag = _this.flags && _this.flags[key.toLowerCase().replace(/ /g, '_')];
	            var res = false;
	            if (flag && flag.enabled) {
	                res = true;
	            }
	            _this.evaluateFlag(key);
	            //todo record check for feature
	            return res;
	        };
	        if (props.fetch) {
	            _fetch = props.fetch;
	        }
	        else {
	            _fetch = (typeof fetch !== 'undefined' ? fetch : global === null || global === void 0 ? void 0 : global.fetch);
	        }
	        this.canUseStorage = typeof window !== 'undefined' || !!props.browserlessStorage;
	        this.log("Constructing flagsmith instance " + props);
	        if (props.eventSource) {
	            eventSource = props.eventSource;
	        }
	        if (props.AsyncStorage) {
	            AsyncStorage = props.AsyncStorage;
	        }
	    }
	    class_1.prototype.init = function (_a) {
	        var _this = this;
	        var environmentID = _a.environmentID, _b = _a.api, api = _b === void 0 ? defaultAPI : _b, headers = _a.headers, onChange = _a.onChange, cacheFlags = _a.cacheFlags, onError = _a.onError, defaultFlags = _a.defaultFlags, fetchImplementation = _a.fetch, preventFetch = _a.preventFetch, enableLogs = _a.enableLogs, enableDynatrace = _a.enableDynatrace, enableAnalytics = _a.enableAnalytics, realtime = _a.realtime, _c = _a.eventSourceUrl, eventSourceUrl = _c === void 0 ? "https://realtime.flagsmith.com/" : _c, _AsyncStorage = _a.AsyncStorage, identity = _a.identity, traits = _a.traits, _trigger = _a._trigger, state = _a.state, cacheOptions = _a.cacheOptions, angularHttpClient = _a.angularHttpClient;
	        return new Promise(function (resolve, reject) {
	            _this.environmentID = environmentID;
	            _this.api = api;
	            _this.headers = headers;
	            _this.getFlagInterval = null;
	            _this.analyticsInterval = null;
	            _this.onChange = onChange;
	            _this.trigger = _trigger;
	            _this.onError = onError;
	            _this.identity = identity;
	            _this.withTraits = traits;
	            _this.enableLogs = enableLogs || false;
	            _this.cacheOptions = cacheOptions ? { skipAPI: !!cacheOptions.skipAPI, ttl: cacheOptions.ttl || 0 } : _this.cacheOptions;
	            if (!_this.cacheOptions.ttl && _this.cacheOptions.skipAPI) {
	                console.warn("Flagsmith: you have set a cache ttl of 0 and are skipping API calls, this means the API will not be hit unless you clear local storage.");
	            }
	            if (fetchImplementation) {
	                _fetch = fetchImplementation;
	            }
	            _this.enableAnalytics = enableAnalytics ? enableAnalytics : false;
	            _this.flags = Object.assign({}, defaultFlags) || {};
	            _this.initialised = true;
	            _this.ticks = 10000;
	            if (realtime && typeof window !== 'undefined') {
	                var connectionUrl = eventSourceUrl + "sse/environments/" + environmentID + "/stream";
	                if (!eventSource) {
	                    _this.log("Error, EventSource is undefined");
	                }
	                else if (!_this.eventSource) {
	                    _this.log("Creating event source with url " + connectionUrl);
	                    _this.eventSource = new eventSource(connectionUrl);
	                    _this.eventSource.addEventListener("environment_updated", function (e) {
	                        _this.log("Received eventsource message");
	                        _this.getFlags();
	                    });
	                }
	            }
	            _this.log("Initialising with properties", {
	                environmentID: environmentID,
	                api: api,
	                headers: headers,
	                onChange: onChange,
	                cacheFlags: cacheFlags,
	                onError: onError,
	                defaultFlags: defaultFlags,
	                preventFetch: preventFetch,
	                enableLogs: enableLogs,
	                enableAnalytics: enableAnalytics,
	                AsyncStorage: AsyncStorage,
	                identity: identity,
	                traits: traits,
	                _trigger: _trigger,
	                state: state,
	                angularHttpClient: angularHttpClient
	            }, _this);
	            _this.timer = _this.enableLogs ? new Date().valueOf() : null;
	            if (_AsyncStorage) {
	                AsyncStorage = _AsyncStorage;
	            }
	            _this.cacheFlags = typeof AsyncStorage !== 'undefined' && !!cacheFlags;
	            _this.setState(state);
	            if (!environmentID) {
	                reject('Please specify a environment id');
	                throw ('Please specify a environment id');
	            }
	            if (enableDynatrace) {
	                // @ts-expect-error Dynatrace's dtrum is exposed to global scope
	                if (typeof dtrum === 'undefined') {
	                    console.error("You have attempted to enable dynatrace but dtrum is undefined, please check you have the Dynatrace RUM JavaScript API installed.");
	                }
	                else {
	                    // @ts-expect-error Dynatrace's dtrum is exposed to global scope
	                    _this.dtrum = dtrum;
	                }
	            }
	            if (angularHttpClient) {
	                // @ts-expect-error
	                _fetch = function (url, params) {
	                    var headers = params.headers, method = params.method, body = params.body;
	                    return new Promise(function (resolve) {
	                        switch (method) {
	                            case "GET": {
	                                return angularHttpClient.get(url, {
	                                    headers: headers
	                                }).subscribe(function (v) {
	                                    resolve({
	                                        ok: true,
	                                        text: function () { return Promise.resolve(v); }
	                                    });
	                                });
	                            }
	                            case "POST": {
	                                return angularHttpClient.post(url, body, {
	                                    headers: headers
	                                }).subscribe(function (v) {
	                                    resolve({
	                                        ok: true,
	                                        text: function () { return Promise.resolve(v); }
	                                    });
	                                });
	                            }
	                            case "PUT": {
	                                return angularHttpClient.post(url, body, {
	                                    headers: headers
	                                }).subscribe(function (v) {
	                                    resolve({
	                                        ok: true,
	                                        text: function () { return Promise.resolve(v); }
	                                    });
	                                });
	                            }
	                        }
	                    });
	                };
	            }
	            if (AsyncStorage && _this.canUseStorage) {
	                AsyncStorage.getItem(FLAGSMITH_EVENT)
	                    .then(function (res) {
	                    if (res) {
	                        try {
	                            _this.evaluationEvent = JSON.parse(res);
	                        }
	                        catch (e) {
	                            _this.evaluationEvent = {};
	                        }
	                    }
	                    else {
	                        _this.evaluationEvent = {};
	                    }
	                    _this.analyticsInterval = setInterval(_this.analyticsFlags, _this.ticks);
	                    return true;
	                });
	            }
	            if (_this.enableAnalytics) {
	                if (_this.analyticsInterval) {
	                    clearInterval(_this.analyticsInterval);
	                }
	                if (AsyncStorage && _this.canUseStorage) {
	                    AsyncStorage.getItem(FLAGSMITH_EVENT, function (err, res) {
	                        if (res) {
	                            var json = JSON.parse(res);
	                            if (json[_this.environmentID]) {
	                                state = _this.getState();
	                                _this.log("Retrieved events from cache", res);
	                                _this.setState(__assign(__assign({}, state), { evaluationEvent: json[_this.environmentID] }));
	                            }
	                        }
	                        return true;
	                    });
	                }
	            }
	            //If the user specified default flags emit a changed event immediately
	            if (cacheFlags) {
	                if (AsyncStorage && _this.canUseStorage) {
	                    AsyncStorage.getItem(FLAGSMITH_KEY, function (err, res) {
	                        if (res) {
	                            try {
	                                var json = JSON.parse(res);
	                                var cachePopulated = false;
	                                if (json && json.api === _this.api && json.environmentID === _this.environmentID) {
	                                    var setState = true;
	                                    if (_this.cacheOptions.ttl) {
	                                        if (!json.ts || (new Date().valueOf() - json.ts > _this.cacheOptions.ttl)) {
	                                            if (json.ts) {
	                                                _this.log("Ignoring cache, timestamp is too old ts:" + json.ts + " ttl: " + _this.cacheOptions.ttl + " time elapsed since cache: " + (new Date().valueOf() - json.ts) + "ms");
	                                                setState = false;
	                                            }
	                                        }
	                                    }
	                                    if (setState) {
	                                        cachePopulated = true;
	                                        _this.setState(json);
	                                        _this.log("Retrieved flags from cache", json);
	                                    }
	                                }
	                                if (_this.flags) { // retrieved flags from local storage
	                                    if (_this.trigger) {
	                                        _this.trigger();
	                                    }
	                                    if (_this.onChange) {
	                                        _this.onChange(null, { isFromServer: false, flagsChanged: true, traitsChanged: !!_this.traits });
	                                    }
	                                    _this.oldFlags = _this.flags;
	                                    resolve(true);
	                                    if (_this.cacheOptions.skipAPI && cachePopulated) {
	                                        _this.log("Skipping API, using cache");
	                                    }
	                                    if (!preventFetch && (!_this.cacheOptions.skipAPI || !cachePopulated)) {
	                                        _this.getFlags();
	                                    }
	                                }
	                                else {
	                                    if (!preventFetch) {
	                                        _this.getFlags(resolve, reject);
	                                    }
	                                    else {
	                                        resolve(true);
	                                    }
	                                }
	                            }
	                            catch (e) {
	                                _this.log("Exception fetching cached logs", e);
	                            }
	                        }
	                        else {
	                            if (!preventFetch) {
	                                _this.getFlags(resolve, reject);
	                            }
	                            else {
	                                if (defaultFlags) {
	                                    if (_this.trigger) {
	                                        _this.trigger();
	                                    }
	                                    if (_this.onChange) {
	                                        _this.onChange(null, { isFromServer: false, flagsChanged: true, traitsChanged: !!_this.traits });
	                                    }
	                                }
	                                resolve(true);
	                            }
	                        }
	                        return true;
	                    });
	                }
	            }
	            else if (!preventFetch) {
	                _this.getFlags(resolve, reject);
	            }
	            else {
	                if (defaultFlags) {
	                    if (_this.trigger) {
	                        _this.trigger();
	                    }
	                    if (_this.onChange) {
	                        _this.onChange(null, { isFromServer: false, flagsChanged: true, traitsChanged: !!_this.traits });
	                    }
	                }
	                resolve(true);
	            }
	        })["catch"](function (error) {
	            _this.log("Error during initialisation ", error);
	            onError && onError(error);
	        });
	    };
	    class_1.prototype.getAllFlags = function () {
	        return this.flags;
	    };
	    class_1.prototype.identify = function (userId, traits) {
	        this.identity = userId;
	        this.log("Identify: " + this.identity);
	        if (traits) {
	            this.withTraits = __assign(__assign({}, (this.withTraits || {})), traits);
	        }
	        if (this.initialised) {
	            return this.getFlags();
	        }
	        return Promise.resolve();
	    };
	    class_1.prototype.getState = function () {
	        return {
	            api: this.api,
	            environmentID: this.environmentID,
	            flags: this.flags,
	            identity: this.identity,
	            ts: this.ts,
	            traits: this.traits,
	            evaluationEvent: this.evaluationEvent
	        };
	    };
	    class_1.prototype.setState = function (state) {
	        if (state) {
	            this.initialised = true;
	            this.api = state.api || this.api || defaultAPI;
	            this.environmentID = state.environmentID || this.environmentID;
	            this.flags = state.flags || this.flags;
	            this.identity = state.identity || this.identity;
	            this.traits = state.traits || this.traits;
	            this.evaluationEvent = state.evaluationEvent || this.evaluationEvent;
	        }
	    };
	    class_1.prototype.log = function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        if (this.enableLogs) {
	            console.log.apply(this, __spreadArray$1(["FLAGSMITH:", new Date().valueOf() - (this.timer || 0), "ms"], args, true));
	        }
	    };
	    class_1.prototype.updateStorage = function () {
	        if (this.cacheFlags) {
	            this.ts = new Date().valueOf();
	            var state = JSON.stringify(this.getState());
	            this.log("Setting storage", state);
	            AsyncStorage.setItem(FLAGSMITH_KEY, state);
	        }
	    };
	    class_1.prototype.updateEventStorage = function () {
	        if (this.enableAnalytics) {
	            var events = JSON.stringify(this.getState().evaluationEvent);
	            this.log("Setting event storage", events);
	            AsyncStorage.setItem(FLAGSMITH_EVENT, events);
	        }
	    };
	    class_1.prototype.logout = function () {
	        this.identity = null;
	        this.traits = null;
	        if (this.initialised) {
	            return this.getFlags();
	        }
	        return Promise.resolve();
	    };
	    class_1.prototype.startListening = function (ticks) {
	        if (ticks === void 0) { ticks = 1000; }
	        if (this.getFlagInterval) {
	            clearInterval(this.getFlagInterval);
	        }
	        this.getFlagInterval = setInterval(this.getFlags, ticks);
	    };
	    class_1.prototype.stopListening = function () {
	        if (this.getFlagInterval) {
	            clearInterval(this.getFlagInterval);
	            this.getFlagInterval = null;
	        }
	    };
	    class_1.prototype.getSegments = function () {
	        // noop for now
	        // return this.segments;
	    };
	    return class_1;
	}());
	function core (_a) {
	    var fetch = _a.fetch; _a.browserlessStorage; var AsyncStorage = _a.AsyncStorage, eventSource = _a.eventSource;
	    return new Flagsmith({ fetch: fetch, AsyncStorage: AsyncStorage, eventSource: eventSource });
	}
	// transforms any trait to match sendSessionProperties
	// https://www.dynatrace.com/support/doc/javascriptapi/interfaces/dtrum_types.DtrumApi.html#addActionProperties
	var setDynatraceValue = function (obj, trait, value) {
	    var key = 'shortString';
	    var convertToString = true;
	    if (typeof value === 'number') {
	        key = 'javaDouble';
	        convertToString = false;
	    }
	    // @ts-expect-error
	    obj[key] = obj[key] || {};
	    // @ts-expect-error
	    obj[key][trait] = convertToString ? value + "" : value;
	};

	// MIT License:
	//
	// Copyright (C) 2022 Fanout, Inc.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a copy
	// of this software and associated documentation files (the "Software"), to
	// deal in the Software without restriction, including without limitation the
	// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
	// sell copies of the Software, and to permit persons to whom the Software is
	// furnished to do so, subject to the following conditions:
	//
	// The above copyright notice and this permission notice shall be included in
	// all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
	// IN THE SOFTWARE.
	var __extends = (undefined && undefined.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        if (typeof b !== "function" && b !== null)
	            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	var __values = (undefined && undefined.__values) || function(o) {
	    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
	    if (m) return m.call(o);
	    if (o && typeof o.length === "number") return {
	        next: function () {
	            if (o && i >= o.length) o = void 0;
	            return { value: o && o[i++], done: !o };
	        }
	    };
	    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
	};
	var __read = (undefined && undefined.__read) || function (o, n) {
	    var m = typeof Symbol === "function" && o[Symbol.iterator];
	    if (!m) return o;
	    var i = m.call(o), r, ar = [], e;
	    try {
	        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
	    }
	    catch (error) { e = { error: error }; }
	    finally {
	        try {
	            if (r && !r.done && (m = i["return"])) m.call(i);
	        }
	        finally { if (e) throw e.error; }
	    }
	    return ar;
	};
	var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {
	    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
	        if (ar || !(i in from)) {
	            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
	            ar[i] = from[i];
	        }
	    }
	    return to.concat(ar || Array.prototype.slice.call(from));
	};
	var EventSourceNotAvailableError = /** @class */ (function (_super) {
	    __extends(EventSourceNotAvailableError, _super);
	    function EventSourceNotAvailableError() {
	        return _super.call(this, 'EventSource not available.\n' +
	            'Consider loading an EventSource polyfill and making it available globally as EventSource, ' +
	            'or passing one in as eventSourceClass to the ReconnectingEventSource constructor.') || this;
	    }
	    return EventSourceNotAvailableError;
	}(Error));
	var ReconnectingEventSource = /** @class */ (function () {
	    function ReconnectingEventSource(url, configuration) {
	        var _this = this;
	        this.CONNECTING = 0;
	        this.OPEN = 1;
	        this.CLOSED = 2;
	        this._configuration = configuration != null ? Object.assign({}, configuration) : undefined;
	        this.withCredentials = false;
	        this._eventSource = null;
	        this._lastEventId = null;
	        this._timer = null;
	        this._listeners = {
	            open: [],
	            error: [],
	            message: [],
	        };
	        this.url = url.toString();
	        this.readyState = this.CONNECTING;
	        this.max_retry_time = 3000;
	        this.eventSourceClass = globalThis.EventSource;
	        if (this._configuration != null) {
	            if (this._configuration.lastEventId) {
	                this._lastEventId = this._configuration.lastEventId;
	                delete this._configuration['lastEventId'];
	            }
	            if (this._configuration.max_retry_time) {
	                this.max_retry_time = this._configuration.max_retry_time;
	                delete this._configuration['max_retry_time'];
	            }
	            if (this._configuration.eventSourceClass) {
	                this.eventSourceClass = this._configuration.eventSourceClass;
	                delete this._configuration['eventSourceClass'];
	            }
	        }
	        if (this.eventSourceClass == null || typeof this.eventSourceClass !== 'function') {
	            throw new EventSourceNotAvailableError();
	        }
	        this._onevent_wrapped = function (event) { _this._onevent(event); };
	        this._start();
	    }
	    ReconnectingEventSource.prototype.dispatchEvent = function (event) {
	        throw new Error("Method not implemented.");
	    };
	    ReconnectingEventSource.prototype._start = function () {
	        var e_1, _a;
	        var _this = this;
	        var url = this.url;
	        if (this._lastEventId) {
	            if (url.indexOf('?') === -1) {
	                url += '?';
	            }
	            else {
	                url += '&';
	            }
	            url += 'lastEventId=' + encodeURIComponent(this._lastEventId);
	        }
	        this._eventSource = new this.eventSourceClass(url, this._configuration);
	        this._eventSource.onopen = function (event) { _this._onopen(event); };
	        this._eventSource.onerror = function (event) { _this._onerror(event); };
	        this._eventSource.onmessage = function (event) { _this.onmessage(event); };
	        try {
	            // apply listen types
	            for (var _b = __values(Object.keys(this._listeners)), _c = _b.next(); !_c.done; _c = _b.next()) {
	                var type = _c.value;
	                this._eventSource.addEventListener(type, this._onevent_wrapped);
	            }
	        }
	        catch (e_1_1) { e_1 = { error: e_1_1 }; }
	        finally {
	            try {
	                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
	            }
	            finally { if (e_1) throw e_1.error; }
	        }
	    };
	    ReconnectingEventSource.prototype._onopen = function (event) {
	        if (this.readyState === 0) {
	            this.readyState = 1;
	            this.onopen(event);
	        }
	    };
	    ReconnectingEventSource.prototype._onerror = function (event) {
	        var _this = this;
	        if (this.readyState === 1) {
	            this.readyState = 0;
	            this.onerror(event);
	        }
	        if (this._eventSource) {
	            if (this._eventSource.readyState === 2) {
	                // reconnect with new object
	                this._eventSource.close();
	                this._eventSource = null;
	                // reconnect after random timeout < max_retry_time
	                var timeout = Math.round(this.max_retry_time * Math.random());
	                this._timer = setTimeout(function () { return _this._start(); }, timeout);
	            }
	        }
	    };
	    ReconnectingEventSource.prototype._onevent = function (event) {
	        var e_2, _a;
	        if (event instanceof MessageEvent) {
	            this._lastEventId = event.lastEventId;
	        }
	        var listenersForType = this._listeners[event.type];
	        if (listenersForType != null) {
	            try {
	                // operate on a copy
	                for (var _b = __values(__spreadArray([], __read(listenersForType), false)), _c = _b.next(); !_c.done; _c = _b.next()) {
	                    var listener = _c.value;
	                    listener.call(this, event);
	                }
	            }
	            catch (e_2_1) { e_2 = { error: e_2_1 }; }
	            finally {
	                try {
	                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
	                }
	                finally { if (e_2) throw e_2.error; }
	            }
	        }
	        if (event.type === 'message') {
	            this.onmessage(event);
	        }
	    };
	    ReconnectingEventSource.prototype.onopen = function (event) {
	        // may be overridden
	    };
	    ReconnectingEventSource.prototype.onerror = function (event) {
	        // may be overridden
	    };
	    ReconnectingEventSource.prototype.onmessage = function (event) {
	        // may be overridden
	    };
	    ReconnectingEventSource.prototype.close = function () {
	        if (this._timer) {
	            clearTimeout(this._timer);
	            this._timer = null;
	        }
	        if (this._eventSource) {
	            this._eventSource.close();
	            this._eventSource = null;
	        }
	        this.readyState = 2;
	    };
	    ReconnectingEventSource.prototype.addEventListener = function (type, callback, options) {
	        // We don't support options at the moment
	        if (this._listeners[type] == null) {
	            this._listeners[type] = [];
	            if (this._eventSource != null) {
	                this._eventSource.addEventListener(type, this._onevent_wrapped);
	            }
	        }
	        var listenersForType = this._listeners[type];
	        if (!listenersForType.includes(callback)) {
	            this._listeners[type] = __spreadArray(__spreadArray([], __read(listenersForType), false), [callback], false);
	        }
	    };
	    ReconnectingEventSource.prototype.removeEventListener = function (type, callback, options) {
	        // We don't support options at the moment
	        var listenersForType = this._listeners[type];
	        this._listeners[type] = listenersForType.filter(function (l) { return l !== callback; });
	    };
	    return ReconnectingEventSource;
	}());

	// @ts-expect-error
	var flagsmith = core({ AsyncStorage: _default, eventSource: ReconnectingEventSource });
	if (typeof window !== "undefined") {
	    // @ts-ignore
	    window.flagsmith = flagsmith;
	}
	var createFlagsmithInstance = function () {
	    return core({
	        AsyncStorage: _default,
	        eventSource: ReconnectingEventSource
	    });
	};

	exports.createFlagsmithInstance = createFlagsmithInstance;
	exports["default"] = flagsmith;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=isomorphic.js.map
