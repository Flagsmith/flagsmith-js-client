(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
    typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["flagsmith/react"] = {}, global.React));
})(this, (function (exports, React) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

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

    var tinyEmitter = {exports: {}};

    function E () {
      // Keep this empty so it's easier to inherit from
      // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
    }

    E.prototype = {
      on: function (name, callback, ctx) {
        var e = this.e || (this.e = {});

        (e[name] || (e[name] = [])).push({
          fn: callback,
          ctx: ctx
        });

        return this;
      },

      once: function (name, callback, ctx) {
        var self = this;
        function listener () {
          self.off(name, listener);
          callback.apply(ctx, arguments);
        }
        listener._ = callback;
        return this.on(name, listener, ctx);
      },

      emit: function (name) {
        var data = [].slice.call(arguments, 1);
        var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
        var i = 0;
        var len = evtArr.length;

        for (i; i < len; i++) {
          evtArr[i].fn.apply(evtArr[i].ctx, data);
        }

        return this;
      },

      off: function (name, callback) {
        var e = this.e || (this.e = {});
        var evts = e[name];
        var liveEvents = [];

        if (evts && callback) {
          for (var i = 0, len = evts.length; i < len; i++) {
            if (evts[i].fn !== callback && evts[i].fn._ !== callback)
              liveEvents.push(evts[i]);
          }
        }

        // Remove event from queue to prevent memory leak
        // Suggested by https://github.com/lazd
        // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

        (liveEvents.length)
          ? e[name] = liveEvents
          : delete e[name];

        return this;
      }
    };

    tinyEmitter.exports = E;
    tinyEmitter.exports.TinyEmitter = E;

    var Emitter = tinyEmitter.exports;

    var events = new Emitter.TinyEmitter();
    var FlagsmithContext = React.createContext(null);
    var FlagsmithProvider = function (_a) {
        var flagsmith = _a.flagsmith, options = _a.options, serverState = _a.serverState, children = _a.children;
        var firstRenderRef = React.useRef(true);
        flagsmith === null || flagsmith === void 0 ? void 0 : flagsmith.trigger = function () {
            flagsmith.log("React - trigger event received");
            events.emit('event');
        };
        if (serverState && !flagsmith.initialised) {
            flagsmith.setState(serverState);
        }
        if (firstRenderRef.current) {
            firstRenderRef.current = false;
            if (options) {
                flagsmith.init(__assign(__assign({}, options), { onChange: function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        if (options.onChange) {
                            options.onChange.apply(options, args);
                        }
                        events.emit('event');
                    } }));
            }
        }
        return (React__default["default"].createElement(FlagsmithContext.Provider, { value: flagsmith }, children));
    };
    var useConstant = function (value) {
        var ref = React.useRef(value);
        if (!ref.current) {
            ref.current = value;
        }
        return ref.current;
    };
    var flagsAsArray = function (_flags) {
        if (typeof _flags === 'string') {
            return [_flags];
        }
        else if (typeof _flags === 'object') {
            // eslint-disable-next-line no-prototype-builtins
            if (_flags.hasOwnProperty('length')) {
                return _flags;
            }
        }
        throw new Error('Flagsmith: please supply an array of strings or a single string of flag keys to useFlags');
    };
    var getRenderKey = function (flagsmith, flags, traits) {
        if (traits === void 0) { traits = []; }
        return flags
            .map(function (k) {
            return "".concat(flagsmith.getValue(k)).concat(flagsmith.hasFeature(k));
        }).concat(traits.map(function (t) { return ("".concat(flagsmith.getTrait(t))); }))
            .join(',');
    };
    function useFlags(_flags, _traits) {
        if (_traits === void 0) { _traits = []; }
        var firstRender = React.useRef(true);
        var flags = useConstant(flagsAsArray(_flags));
        var traits = useConstant(flagsAsArray(_traits));
        var flagsmith = React.useContext(FlagsmithContext);
        var _a = React.useState(getRenderKey(flagsmith, flags)), renderKey = _a[0], setRenderKey = _a[1];
        var renderRef = React.useRef(renderKey);
        var eventListener = React.useCallback(function () {
            flagsmith === null || flagsmith === void 0 ? void 0 : flagsmith.log("React - Event listener triggered");
            var newRenderKey = getRenderKey(flagsmith, flags, traits);
            if (newRenderKey !== renderRef.current) {
                renderRef.current = newRenderKey;
                setRenderKey(newRenderKey);
            }
        }, []);
        if (firstRender.current) {
            firstRender.current = false;
            flagsmith === null || flagsmith === void 0 ? void 0 : flagsmith.log("React - Initialising event listeners");
            events.on('event', eventListener);
        }
        React.useEffect(function () {
            return function () {
                events.off('event', eventListener);
            };
        });
        var res = React.useMemo(function () {
            flagsmith === null || flagsmith === void 0 ? void 0 : flagsmith.log("React - Render key has changed");
            var res = {};
            flags.map(function (k) {
                res[k] = {
                    enabled: flagsmith.hasFeature(k),
                    value: flagsmith.getValue(k)
                };
            }).concat(traits === null || traits === void 0 ? void 0 : traits.map(function (v) {
                res[v] = flagsmith.getTrait(v);
            }));
            return res;
        }, [renderKey]);
        return res;
    }
    function useFlagsmith() {
        var context = React.useContext(FlagsmithContext);
        if (!context) {
            throw new Error('useFlagsmith must be used with in a FlagsmithProvider');
        }
        return context;
    }

    exports.FlagsmithContext = FlagsmithContext;
    exports.FlagsmithProvider = FlagsmithProvider;
    exports.useFlags = useFlags;
    exports.useFlagsmith = useFlagsmith;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=react.js.map
