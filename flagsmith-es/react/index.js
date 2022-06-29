import React, { createContext, useRef, useContext, useState, useCallback, useEffect, useMemo } from 'react';

/*! *****************************************************************************
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

function Eventjs() {
    var e = {};
    var r = this;
    for (var t = 0; t < arguments.length; t++) {
        var n = arguments[t];
        switch (typeof n) {
            case "string":
                e[n] = [];
                break;
            case "object":
                r = n;
                break;
            default:
                throw new TypeError("Eventjs() only accepts string and object parameters");
        }
    }
    if (r === this && !(this instanceof Eventjs)) {
        throw new ReferenceError('Eventjs is not called with "new" keyword and no parameter of type object is passed to it');
    }
    function s(r) {
        if (typeof r !== "string" || !e[r]) {
            throw new ReferenceError("The event name does not exist in this event manager: " + r);
        }
        return true;
    }
    r.on = function (r) {
        s(r);
        for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            if (e[r].indexOf(n) === -1) {
                e[r].push(n);
            }
        }
        return this;
    };
    r.off = function (t) {
        switch (arguments.length) {
            case 0:
                for (var n in e) {
                    if (e.hasOwnProperty(n)) {
                        r.off(n);
                    }
                }
                break;
            case 1:
                s(t);
                e[t].length = 0;
                break;
            default:
                s(t);
                for (var a = 1; a < arguments.length; a++) {
                    var i = arguments[a];
                    var o = e[t].indexOf(i);
                    if (o !== -1) {
                        e[t].splice(o, 1);
                    }
                }
                break;
        }
        return this;
    };
    r.trigger = function (t) {
        s(t);
        var n = [];
        for (var a = 1; a < arguments.length; a++) {
            n.push(arguments[a]);
        }
        var i = e[t];
        var o = [];
        for (var f = 0; f < i.length; f++) {
            var u = i[f];
            try {
                u.apply(r, n);
            }
            catch (c) {
                o.push({ listener: u, error: c });
            }
        }
        if (o.length > 0) {
            throw o;
        }
        return this;
    };
    return r;
}
// @ts-ignore
var events = new Eventjs('event');
var FlagsmithContext = createContext(null);
var FlagsmithProvider = function (_a) {
    var flagsmith = _a.flagsmith, options = _a.options, serverState = _a.serverState, children = _a.children;
    var firstRenderRef = useRef(true);
    // @ts-ignore
    if (serverState && !flagsmith.initialised) {
        // @ts-ignore
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
                    events.trigger('event');
                } }));
        }
        else {
            // @ts-ignore
            flagsmith.trigger = function () { return events.trigger('event'); };
        }
    }
    return (React.createElement(FlagsmithContext.Provider, { value: flagsmith }, children));
};
var useConstant = function (value) {
    var ref = useRef(value);
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
    var flags = useConstant(flagsAsArray(_flags));
    var traits = useConstant(flagsAsArray(_traits));
    var flagsmith = useContext(FlagsmithContext);
    var _a = useState(getRenderKey(flagsmith, flags)), renderKey = _a[0], setRenderKey = _a[1];
    var renderRef = useRef(renderKey);
    var eventListener = useCallback(function () {
        var newRenderKey = getRenderKey(flagsmith, flags, traits);
        if (newRenderKey !== renderRef.current) {
            renderRef.current = newRenderKey;
            setRenderKey(newRenderKey);
        }
    }, []);
    useEffect(function () {
        events.on('event', eventListener);
        return function () {
            events.off('event', eventListener);
        };
    }, []);
    var res = useMemo(function () {
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
var useFlagsmith = function () {
    var context = useContext(FlagsmithContext);
    if (!context) {
        throw new Error('useFlagsmith must be used with in a FlagsmithProvider');
    }
    return context;
};

export { FlagsmithContext, FlagsmithProvider, useFlags, useFlagsmith };
//# sourceMappingURL=index.js.map
