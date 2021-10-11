!function (e, t) {
  if ("object" == typeof exports && "object" == typeof module) module.exports = t();else if ("function" == typeof define && define.amd) define([], t);else {
    var r = t();

    for (var n in r) ("object" == typeof exports ? exports : e)[n] = r[n];
  }
}(this, function () {
  return function (e) {
    var t = {};

    function r(n) {
      if (t[n]) return t[n].exports;
      var o = t[n] = {
        i: n,
        l: !1,
        exports: {}
      };
      return e[n].call(o.exports, o, o.exports, r), o.l = !0, o.exports;
    }

    return r.m = e, r.c = t, r.d = function (e, t, n) {
      r.o(e, t) || Object.defineProperty(e, t, {
        enumerable: !0,
        get: n
      });
    }, r.r = function (e) {
      "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
        value: "Module"
      }), Object.defineProperty(e, "__esModule", {
        value: !0
      });
    }, r.t = function (e, t) {
      if (1 & t && (e = r(e)), 8 & t) return e;
      if (4 & t && "object" == typeof e && e && e.__esModule) return e;
      var n = Object.create(null);
      if (r.r(n), Object.defineProperty(n, "default", {
        enumerable: !0,
        value: e
      }), 2 & t && "string" != typeof e) for (var o in e) r.d(n, o, function (t) {
        return e[t];
      }.bind(null, o));
      return n;
    }, r.n = function (e) {
      var t = e && e.__esModule ? function () {
        return e.default;
      } : function () {
        return e;
      };
      return r.d(t, "a", t), t;
    }, r.o = function (e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }, r.p = "", r(r.s = 6);
  }([function (e, t) {
    e.exports = require("stream");
  }, function (e, t) {
    e.exports = require("zlib");
  }, function (e, t) {
    e.exports = require("url");
  }, function (e, t) {
    e.exports = require("http");
  }, function (e, t) {
    e.exports = require("https");
  }, function (e, t, r) {
    "use strict";

    Object.defineProperty(t, "__esModule", {
      value: !0
    });

    var n,
        o = function (e, t) {
      if (Array.isArray(e)) return e;
      if (Symbol.iterator in Object(e)) return function (e, t) {
        var r = [],
            n = !0,
            o = !1,
            i = void 0;

        try {
          for (var a, s = e[Symbol.iterator](); !(n = (a = s.next()).done) && (r.push(a.value), !t || r.length !== t); n = !0);
        } catch (e) {
          o = !0, i = e;
        } finally {
          try {
            !n && s.return && s.return();
          } finally {
            if (o) throw i;
          }
        }

        return r;
      }(e, t);
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    },
        i = r(9),
        a = (n = i) && n.__esModule ? n : {
      default: n
    };

    var s = {
      getItem: function (e, t) {
        return s.multiGet([e]).then(function (e) {
          return e[0][1];
        }).then(function (e) {
          return t && t(null, e), e;
        }).catch(function (e) {
          return t && t(e, null), e;
        });
      },
      setItem: function (e, t, r) {
        return s.multiSet([[e, t]]).then(function (e) {
          return r && r(null, e), e;
        }).catch(function (e) {
          return r && r(e, null), e;
        });
      },
      getAllKeys: function (e) {
        return Promise.resolve(Object.keys(localStorage)).then(function (t) {
          return e && e(null, t), t;
        }).catch(function (t) {
          return e && e(t, null), t;
        });
      },
      removeItem: function (e, t) {
        return s.multiRemove([e]).then(function () {
          t && t(null);
        }).catch(function (e) {
          t && t(e, null);
        });
      },
      clear: function () {
        return new Promise(function (e) {
          window.localStorage.clear(), e();
        });
      },
      mergeItem: function (e, t) {
        return s.multiMerge([[e, t]]);
      },
      multiGet: function (e) {
        return new Promise(function (t) {
          t(e.reduce(function (e, t) {
            return e.concat([[t, localStorage.getItem(t)]]);
          }, []));
        });
      },
      multiSet: function (e) {
        return new Promise(function (t, r) {
          var n = [];
          return e.forEach(function (e) {
            var t = o(e, 2),
                r = t[0],
                i = t[1];

            try {
              localStorage.setItem(r, i);
            } catch (e) {
              n.push(e);
            }
          }), n.length > 0 ? r(n) : t();
        });
      },
      multiMerge: function (e) {
        return new Promise(function (t, r) {
          var n = [];
          return e.forEach(function (e) {
            var t = o(e, 2),
                r = t[0],
                i = t[1],
                s = localStorage.getItem(r);
            if (s) try {
              localStorage.setItem(r, JSON.stringify((0, a.default)(JSON.parse(s), JSON.parse(i))));
            } catch (e) {
              n.push(e);
            }
          }), n.length > 0 ? r(n) : t();
        });
      },
      multiRemove: function (e) {
        return new Promise(function (t) {
          e.forEach(function (e) {
            return window.localStorage.removeItem(e);
          }), t();
        });
      },
      flushGetRequests: function () {
        console.warn("AsyncStorage.flushGetRequests: Not supported on `web`");
      }
    };
    t.default = s;
  }, function (e, t, r) {
    "use strict";

    r.r(t);
    var n = r(5),
        o = r.n(n),
        i = r(7).default;
    "undefined" == typeof window && (i = r(8).default);
    var a = r(11)({
      AsyncStorage: o.a,
      fetch: i
    });
    "undefined" != typeof window && (window.flagsmith = a), t.default = a;
  }, function (e, t, r) {
    "use strict";

    r.r(t), t.default = function (e, t) {
      return t = t || {}, new Promise(function (r, n) {
        var o = new XMLHttpRequest(),
            i = [],
            a = [],
            s = {},
            u = function () {
          return {
            ok: 2 == (o.status / 100 | 0),
            statusText: o.statusText,
            status: o.status,
            url: o.responseURL,
            text: function () {
              return Promise.resolve(o.responseText);
            },
            json: function () {
              return Promise.resolve(JSON.parse(o.responseText));
            },
            blob: function () {
              return Promise.resolve(new Blob([o.response]));
            },
            clone: u,
            headers: {
              keys: function () {
                return i;
              },
              entries: function () {
                return a;
              },
              get: function (e) {
                return s[e.toLowerCase()];
              },
              has: function (e) {
                return e.toLowerCase() in s;
              }
            }
          };
        };

        for (var c in o.open(t.method || "get", e, !0), o.onload = function () {
          o.getAllResponseHeaders().replace(/^(.*?):[^\S\n]*([\s\S]*?)$/gm, function (e, t, r) {
            i.push(t = t.toLowerCase()), a.push([t, r]), s[t] = s[t] ? s[t] + "," + r : r;
          }), r(u());
        }, o.onerror = n, o.withCredentials = "include" == t.credentials, t.headers) o.setRequestHeader(c, t.headers[c]);

        o.send(t.body || null);
      });
    };
  }, function (e, t, r) {
    "use strict";

    r.r(t), r.d(t, "Headers", function () {
      return A;
    }), r.d(t, "Request", function () {
      return J;
    }), r.d(t, "Response", function () {
      return $;
    }), r.d(t, "FetchError", function () {
      return h;
    });
    var n = r(0),
        o = r(3),
        i = r(2),
        a = r(4),
        s = r(1);
    const u = n.Readable,
          c = Symbol("buffer"),
          l = Symbol("type");

    class f {
      constructor() {
        this[l] = "";
        const e = arguments[0],
              t = arguments[1],
              r = [];
        let n = 0;

        if (e) {
          const t = e,
                o = Number(t.length);

          for (let e = 0; e < o; e++) {
            const o = t[e];
            let i;
            n += (i = o instanceof Buffer ? o : ArrayBuffer.isView(o) ? Buffer.from(o.buffer, o.byteOffset, o.byteLength) : o instanceof ArrayBuffer ? Buffer.from(o) : o instanceof f ? o[c] : Buffer.from("string" == typeof o ? o : String(o))).length, r.push(i);
          }
        }

        this[c] = Buffer.concat(r);
        let o = t && void 0 !== t.type && String(t.type).toLowerCase();
        o && !/[^\u0020-\u007E]/.test(o) && (this[l] = o);
      }

      get size() {
        return this[c].length;
      }

      get type() {
        return this[l];
      }

      text() {
        return Promise.resolve(this[c].toString());
      }

      arrayBuffer() {
        const e = this[c],
              t = e.buffer.slice(e.byteOffset, e.byteOffset + e.byteLength);
        return Promise.resolve(t);
      }

      stream() {
        const e = new u();
        return e._read = function () {}, e.push(this[c]), e.push(null), e;
      }

      toString() {
        return "[object Blob]";
      }

      slice() {
        const e = this.size,
              t = arguments[0],
              r = arguments[1];
        let n, o;
        n = void 0 === t ? 0 : t < 0 ? Math.max(e + t, 0) : Math.min(t, e), o = void 0 === r ? e : r < 0 ? Math.max(e + r, 0) : Math.min(r, e);
        const i = Math.max(o - n, 0),
              a = this[c].slice(n, n + i),
              s = new f([], {
          type: arguments[2]
        });
        return s[c] = a, s;
      }

    }

    function h(e, t, r) {
      Error.call(this, e), this.message = e, this.type = t, r && (this.code = this.errno = r.code), Error.captureStackTrace(this, this.constructor);
    }

    let p;
    Object.defineProperties(f.prototype, {
      size: {
        enumerable: !0
      },
      type: {
        enumerable: !0
      },
      slice: {
        enumerable: !0
      }
    }), Object.defineProperty(f.prototype, Symbol.toStringTag, {
      value: "Blob",
      writable: !1,
      enumerable: !1,
      configurable: !0
    }), h.prototype = Object.create(Error.prototype), h.prototype.constructor = h, h.prototype.name = "FetchError";

    try {
      p = require("encoding").convert;
    } catch (e) {}

    const d = Symbol("Body internals"),
          y = n.PassThrough;

    function g(e) {
      var t = this,
          r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          o = r.size;
      let i = void 0 === o ? 0 : o;
      var a = r.timeout;
      let s = void 0 === a ? 0 : a;
      null == e ? e = null : v(e) ? e = Buffer.from(e.toString()) : m(e) || Buffer.isBuffer(e) || ("[object ArrayBuffer]" === Object.prototype.toString.call(e) ? e = Buffer.from(e) : ArrayBuffer.isView(e) ? e = Buffer.from(e.buffer, e.byteOffset, e.byteLength) : e instanceof n || (e = Buffer.from(String(e)))), this[d] = {
        body: e,
        disturbed: !1,
        error: null
      }, this.size = i, this.timeout = s, e instanceof n && e.on("error", function (e) {
        const r = "AbortError" === e.name ? e : new h(`Invalid response body while trying to fetch ${t.url}: ${e.message}`, "system", e);
        t[d].error = r;
      });
    }

    function b() {
      var e = this;
      if (this[d].disturbed) return g.Promise.reject(new TypeError(`body used already for: ${this.url}`));
      if (this[d].disturbed = !0, this[d].error) return g.Promise.reject(this[d].error);
      let t = this.body;
      if (null === t) return g.Promise.resolve(Buffer.alloc(0));
      if (m(t) && (t = t.stream()), Buffer.isBuffer(t)) return g.Promise.resolve(t);
      if (!(t instanceof n)) return g.Promise.resolve(Buffer.alloc(0));
      let r = [],
          o = 0,
          i = !1;
      return new g.Promise(function (n, a) {
        let s;
        e.timeout && (s = setTimeout(function () {
          i = !0, a(new h(`Response timeout while trying to fetch ${e.url} (over ${e.timeout}ms)`, "body-timeout"));
        }, e.timeout)), t.on("error", function (t) {
          "AbortError" === t.name ? (i = !0, a(t)) : a(new h(`Invalid response body while trying to fetch ${e.url}: ${t.message}`, "system", t));
        }), t.on("data", function (t) {
          if (!i && null !== t) {
            if (e.size && o + t.length > e.size) return i = !0, void a(new h(`content size at ${e.url} over limit: ${e.size}`, "max-size"));
            o += t.length, r.push(t);
          }
        }), t.on("end", function () {
          if (!i) {
            clearTimeout(s);

            try {
              n(Buffer.concat(r, o));
            } catch (t) {
              a(new h(`Could not create Buffer from response body for ${e.url}: ${t.message}`, "system", t));
            }
          }
        });
      });
    }

    function v(e) {
      return "object" == typeof e && "function" == typeof e.append && "function" == typeof e.delete && "function" == typeof e.get && "function" == typeof e.getAll && "function" == typeof e.has && "function" == typeof e.set && ("URLSearchParams" === e.constructor.name || "[object URLSearchParams]" === Object.prototype.toString.call(e) || "function" == typeof e.sort);
    }

    function m(e) {
      return "object" == typeof e && "function" == typeof e.arrayBuffer && "string" == typeof e.type && "function" == typeof e.stream && "function" == typeof e.constructor && "string" == typeof e.constructor.name && /^(Blob|File)$/.test(e.constructor.name) && /^(Blob|File)$/.test(e[Symbol.toStringTag]);
    }

    function w(e) {
      let t,
          r,
          o = e.body;
      if (e.bodyUsed) throw new Error("cannot clone body after it is used");
      return o instanceof n && "function" != typeof o.getBoundary && (t = new y(), r = new y(), o.pipe(t), o.pipe(r), e[d].body = t, o = r), o;
    }

    function _(e) {
      return null === e ? null : "string" == typeof e ? "text/plain;charset=UTF-8" : v(e) ? "application/x-www-form-urlencoded;charset=UTF-8" : m(e) ? e.type || null : Buffer.isBuffer(e) ? null : "[object ArrayBuffer]" === Object.prototype.toString.call(e) ? null : ArrayBuffer.isView(e) ? null : "function" == typeof e.getBoundary ? `multipart/form-data;boundary=${e.getBoundary()}` : e instanceof n ? null : "text/plain;charset=UTF-8";
    }

    function S(e) {
      const t = e.body;
      return null === t ? 0 : m(t) ? t.size : Buffer.isBuffer(t) ? t.length : t && "function" == typeof t.getLengthSync && (t._lengthRetrievers && 0 == t._lengthRetrievers.length || t.hasKnownLength && t.hasKnownLength()) ? t.getLengthSync() : null;
    }

    g.prototype = {
      get body() {
        return this[d].body;
      },

      get bodyUsed() {
        return this[d].disturbed;
      },

      arrayBuffer() {
        return b.call(this).then(function (e) {
          return e.buffer.slice(e.byteOffset, e.byteOffset + e.byteLength);
        });
      },

      blob() {
        let e = this.headers && this.headers.get("content-type") || "";
        return b.call(this).then(function (t) {
          return Object.assign(new f([], {
            type: e.toLowerCase()
          }), {
            [c]: t
          });
        });
      },

      json() {
        var e = this;
        return b.call(this).then(function (t) {
          try {
            return JSON.parse(t.toString());
          } catch (t) {
            return g.Promise.reject(new h(`invalid json response body at ${e.url} reason: ${t.message}`, "invalid-json"));
          }
        });
      },

      text() {
        return b.call(this).then(function (e) {
          return e.toString();
        });
      },

      buffer() {
        return b.call(this);
      },

      textConverted() {
        var e = this;
        return b.call(this).then(function (t) {
          return function (e, t) {
            if ("function" != typeof p) throw new Error("The package `encoding` must be installed to use the textConverted() function");
            const r = t.get("content-type");
            let n,
                o,
                i = "utf-8";
            r && (n = /charset=([^;]*)/i.exec(r));
            o = e.slice(0, 1024).toString(), !n && o && (n = /<meta.+?charset=(['"])(.+?)\1/i.exec(o));
            !n && o && ((n = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(o)) || (n = /<meta[\s]+?content=(['"])(.+?)\1[\s]+?http-equiv=(['"])content-type\3/i.exec(o)) && n.pop(), n && (n = /charset=(.*)/i.exec(n.pop())));
            !n && o && (n = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(o));
            n && ("gb2312" !== (i = n.pop()) && "gbk" !== i || (i = "gb18030"));
            return p(e, "UTF-8", i).toString();
          }(t, e.headers);
        });
      }

    }, Object.defineProperties(g.prototype, {
      body: {
        enumerable: !0
      },
      bodyUsed: {
        enumerable: !0
      },
      arrayBuffer: {
        enumerable: !0
      },
      blob: {
        enumerable: !0
      },
      json: {
        enumerable: !0
      },
      text: {
        enumerable: !0
      }
    }), g.mixIn = function (e) {
      for (const t of Object.getOwnPropertyNames(g.prototype)) if (!(t in e)) {
        const r = Object.getOwnPropertyDescriptor(g.prototype, t);
        Object.defineProperty(e, t, r);
      }
    }, g.Promise = global.Promise;
    const j = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/,
          O = /[^\t\x20-\x7e\x80-\xff]/;

    function T(e) {
      if (e = `${e}`, j.test(e) || "" === e) throw new TypeError(`${e} is not a legal HTTP header name`);
    }

    function E(e) {
      if (e = `${e}`, O.test(e)) throw new TypeError(`${e} is not a legal HTTP header value`);
    }

    function P(e, t) {
      t = t.toLowerCase();

      for (const r in e) if (r.toLowerCase() === t) return r;
    }

    const x = Symbol("map");

    class A {
      constructor() {
        let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : void 0;

        if (this[x] = Object.create(null), e instanceof A) {
          const t = e.raw(),
                r = Object.keys(t);

          for (const e of r) for (const r of t[e]) this.append(e, r);
        } else if (null == e) ;else {
          if ("object" != typeof e) throw new TypeError("Provided initializer must be an object");
          {
            const t = e[Symbol.iterator];

            if (null != t) {
              if ("function" != typeof t) throw new TypeError("Header pairs must be iterable");
              const r = [];

              for (const t of e) {
                if ("object" != typeof t || "function" != typeof t[Symbol.iterator]) throw new TypeError("Each header pair must be iterable");
                r.push(Array.from(t));
              }

              for (const e of r) {
                if (2 !== e.length) throw new TypeError("Each header pair must be a name/value tuple");
                this.append(e[0], e[1]);
              }
            } else for (const t of Object.keys(e)) {
              const r = e[t];
              this.append(t, r);
            }
          }
        }
      }

      get(e) {
        T(e = `${e}`);
        const t = P(this[x], e);
        return void 0 === t ? null : this[x][t].join(", ");
      }

      forEach(e) {
        let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : void 0,
            r = I(this),
            n = 0;

        for (; n < r.length;) {
          var o = r[n];
          const i = o[0],
                a = o[1];
          e.call(t, a, i, this), r = I(this), n++;
        }
      }

      set(e, t) {
        t = `${t}`, T(e = `${e}`), E(t);
        const r = P(this[x], e);
        this[x][void 0 !== r ? r : e] = [t];
      }

      append(e, t) {
        t = `${t}`, T(e = `${e}`), E(t);
        const r = P(this[x], e);
        void 0 !== r ? this[x][r].push(t) : this[x][e] = [t];
      }

      has(e) {
        return T(e = `${e}`), void 0 !== P(this[x], e);
      }

      delete(e) {
        T(e = `${e}`);
        const t = P(this[x], e);
        void 0 !== t && delete this[x][t];
      }

      raw() {
        return this[x];
      }

      keys() {
        return F(this, "key");
      }

      values() {
        return F(this, "value");
      }

      [Symbol.iterator]() {
        return F(this, "key+value");
      }

    }

    function I(e) {
      let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "key+value";
      return Object.keys(e[x]).sort().map("key" === t ? function (e) {
        return e.toLowerCase();
      } : "value" === t ? function (t) {
        return e[x][t].join(", ");
      } : function (t) {
        return [t.toLowerCase(), e[x][t].join(", ")];
      });
    }

    A.prototype.entries = A.prototype[Symbol.iterator], Object.defineProperty(A.prototype, Symbol.toStringTag, {
      value: "Headers",
      writable: !1,
      enumerable: !1,
      configurable: !0
    }), Object.defineProperties(A.prototype, {
      get: {
        enumerable: !0
      },
      forEach: {
        enumerable: !0
      },
      set: {
        enumerable: !0
      },
      append: {
        enumerable: !0
      },
      has: {
        enumerable: !0
      },
      delete: {
        enumerable: !0
      },
      keys: {
        enumerable: !0
      },
      values: {
        enumerable: !0
      },
      entries: {
        enumerable: !0
      }
    });
    const k = Symbol("internal");

    function F(e, t) {
      const r = Object.create(L);
      return r[k] = {
        target: e,
        kind: t,
        index: 0
      }, r;
    }

    const L = Object.setPrototypeOf({
      next() {
        if (!this || Object.getPrototypeOf(this) !== L) throw new TypeError("Value of `this` is not a HeadersIterator");
        var e = this[k];
        const t = e.target,
              r = e.kind,
              n = e.index,
              o = I(t, r);
        return n >= o.length ? {
          value: void 0,
          done: !0
        } : (this[k].index = n + 1, {
          value: o[n],
          done: !1
        });
      }

    }, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));

    function C(e) {
      const t = Object.assign({
        __proto__: null
      }, e[x]),
            r = P(e[x], "Host");
      return void 0 !== r && (t[r] = t[r][0]), t;
    }

    Object.defineProperty(L, Symbol.toStringTag, {
      value: "HeadersIterator",
      writable: !1,
      enumerable: !1,
      configurable: !0
    });
    const B = Symbol("Response internals"),
          z = o.STATUS_CODES;

    class $ {
      constructor() {
        let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null,
            t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        g.call(this, e, t);
        const r = t.status || 200,
              n = new A(t.headers);

        if (null != e && !n.has("Content-Type")) {
          const t = _(e);

          t && n.append("Content-Type", t);
        }

        this[B] = {
          url: t.url,
          status: r,
          statusText: t.statusText || z[r],
          headers: n,
          counter: t.counter
        };
      }

      get url() {
        return this[B].url || "";
      }

      get status() {
        return this[B].status;
      }

      get ok() {
        return this[B].status >= 200 && this[B].status < 300;
      }

      get redirected() {
        return this[B].counter > 0;
      }

      get statusText() {
        return this[B].statusText;
      }

      get headers() {
        return this[B].headers;
      }

      clone() {
        return new $(w(this), {
          url: this.url,
          status: this.status,
          statusText: this.statusText,
          headers: this.headers,
          ok: this.ok,
          redirected: this.redirected
        });
      }

    }

    g.mixIn($.prototype), Object.defineProperties($.prototype, {
      url: {
        enumerable: !0
      },
      status: {
        enumerable: !0
      },
      ok: {
        enumerable: !0
      },
      redirected: {
        enumerable: !0
      },
      statusText: {
        enumerable: !0
      },
      headers: {
        enumerable: !0
      },
      clone: {
        enumerable: !0
      }
    }), Object.defineProperty($.prototype, Symbol.toStringTag, {
      value: "Response",
      writable: !1,
      enumerable: !1,
      configurable: !0
    });
    const R = Symbol("Request internals"),
          N = i.parse,
          U = i.format,
          D = "destroy" in n.Readable.prototype;

    function q(e) {
      return "object" == typeof e && "object" == typeof e[R];
    }

    class J {
      constructor(e) {
        let t,
            r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        q(e) ? t = N(e.url) : (t = e && e.href ? N(e.href) : N(`${e}`), e = {});
        let n = r.method || e.method || "GET";
        if (n = n.toUpperCase(), (null != r.body || q(e) && null !== e.body) && ("GET" === n || "HEAD" === n)) throw new TypeError("Request with GET/HEAD method cannot have body");
        let o = null != r.body ? r.body : q(e) && null !== e.body ? w(e) : null;
        g.call(this, o, {
          timeout: r.timeout || e.timeout || 0,
          size: r.size || e.size || 0
        });
        const i = new A(r.headers || e.headers || {});

        if (null != o && !i.has("Content-Type")) {
          const e = _(o);

          e && i.append("Content-Type", e);
        }

        let a = q(e) ? e.signal : null;
        if ("signal" in r && (a = r.signal), null != a && !function (e) {
          const t = e && "object" == typeof e && Object.getPrototypeOf(e);
          return !(!t || "AbortSignal" !== t.constructor.name);
        }(a)) throw new TypeError("Expected signal to be an instanceof AbortSignal");
        this[R] = {
          method: n,
          redirect: r.redirect || e.redirect || "follow",
          headers: i,
          parsedURL: t,
          signal: a
        }, this.follow = void 0 !== r.follow ? r.follow : void 0 !== e.follow ? e.follow : 20, this.compress = void 0 !== r.compress ? r.compress : void 0 === e.compress || e.compress, this.counter = r.counter || e.counter || 0, this.agent = r.agent || e.agent;
      }

      get method() {
        return this[R].method;
      }

      get url() {
        return U(this[R].parsedURL);
      }

      get headers() {
        return this[R].headers;
      }

      get redirect() {
        return this[R].redirect;
      }

      get signal() {
        return this[R].signal;
      }

      clone() {
        return new J(this);
      }

    }

    function M(e) {
      Error.call(this, e), this.type = "aborted", this.message = e, Error.captureStackTrace(this, this.constructor);
    }

    g.mixIn(J.prototype), Object.defineProperty(J.prototype, Symbol.toStringTag, {
      value: "Request",
      writable: !1,
      enumerable: !1,
      configurable: !0
    }), Object.defineProperties(J.prototype, {
      method: {
        enumerable: !0
      },
      url: {
        enumerable: !0
      },
      headers: {
        enumerable: !0
      },
      redirect: {
        enumerable: !0
      },
      clone: {
        enumerable: !0
      },
      signal: {
        enumerable: !0
      }
    }), M.prototype = Object.create(Error.prototype), M.prototype.constructor = M, M.prototype.name = "AbortError";
    const H = n.PassThrough,
          G = i.resolve;

    function V(e, t) {
      if (!V.Promise) throw new Error("native promise missing, set fetch.Promise to your favorite alternative");
      return g.Promise = V.Promise, new V.Promise(function (r, i) {
        const u = new J(e, t),
              c = function (e) {
          const t = e[R].parsedURL,
                r = new A(e[R].headers);
          if (r.has("Accept") || r.set("Accept", "*/*"), !t.protocol || !t.hostname) throw new TypeError("Only absolute URLs are supported");
          if (!/^https?:$/.test(t.protocol)) throw new TypeError("Only HTTP(S) protocols are supported");
          if (e.signal && e.body instanceof n.Readable && !D) throw new Error("Cancellation of streamed requests with AbortSignal is not supported in node < 8");
          let o = null;

          if (null == e.body && /^(POST|PUT)$/i.test(e.method) && (o = "0"), null != e.body) {
            const t = S(e);
            "number" == typeof t && (o = String(t));
          }

          o && r.set("Content-Length", o), r.has("User-Agent") || r.set("User-Agent", "node-fetch/1.0 (+https://github.com/bitinn/node-fetch)"), e.compress && !r.has("Accept-Encoding") && r.set("Accept-Encoding", "gzip,deflate");
          let i = e.agent;
          return "function" == typeof i && (i = i(t)), r.has("Connection") || i || r.set("Connection", "close"), Object.assign({}, t, {
            method: e.method,
            headers: C(r),
            agent: i
          });
        }(u),
              l = ("https:" === c.protocol ? a : o).request,
              f = u.signal;

        let p = null;

        const d = function () {
          let e = new M("The user aborted a request.");
          i(e), u.body && u.body instanceof n.Readable && u.body.destroy(e), p && p.body && p.body.emit("error", e);
        };

        if (f && f.aborted) return void d();

        const y = function () {
          d(), v();
        },
              g = l(c);

        let b;

        function v() {
          g.abort(), f && f.removeEventListener("abort", y), clearTimeout(b);
        }

        f && f.addEventListener("abort", y), u.timeout && g.once("socket", function (e) {
          b = setTimeout(function () {
            i(new h(`network timeout at: ${u.url}`, "request-timeout")), v();
          }, u.timeout);
        }), g.on("error", function (e) {
          i(new h(`request to ${u.url} failed, reason: ${e.message}`, "system", e)), v();
        }), g.on("response", function (e) {
          clearTimeout(b);

          const t = function (e) {
            const t = new A();

            for (const r of Object.keys(e)) if (!j.test(r)) if (Array.isArray(e[r])) for (const n of e[r]) O.test(n) || (void 0 === t[x][r] ? t[x][r] = [n] : t[x][r].push(n));else O.test(e[r]) || (t[x][r] = [e[r]]);

            return t;
          }(e.headers);

          if (V.isRedirect(e.statusCode)) {
            const n = t.get("Location"),
                  o = null === n ? null : G(u.url, n);

            switch (u.redirect) {
              case "error":
                return i(new h(`uri requested responds with a redirect, redirect mode is set to error: ${u.url}`, "no-redirect")), void v();

              case "manual":
                if (null !== o) try {
                  t.set("Location", o);
                } catch (e) {
                  i(e);
                }
                break;

              case "follow":
                if (null === o) break;
                if (u.counter >= u.follow) return i(new h(`maximum redirect reached at: ${u.url}`, "max-redirect")), void v();
                const n = {
                  headers: new A(u.headers),
                  follow: u.follow,
                  counter: u.counter + 1,
                  agent: u.agent,
                  compress: u.compress,
                  method: u.method,
                  body: u.body,
                  signal: u.signal,
                  timeout: u.timeout,
                  size: u.size
                };
                return 303 !== e.statusCode && u.body && null === S(u) ? (i(new h("Cannot follow redirect with body being a readable stream", "unsupported-redirect")), void v()) : (303 !== e.statusCode && (301 !== e.statusCode && 302 !== e.statusCode || "POST" !== u.method) || (n.method = "GET", n.body = void 0, n.headers.delete("content-length")), r(V(new J(o, n))), void v());
            }
          }

          e.once("end", function () {
            f && f.removeEventListener("abort", y);
          });
          let n = e.pipe(new H());
          const o = {
            url: u.url,
            status: e.statusCode,
            statusText: e.statusMessage,
            headers: t,
            size: u.size,
            timeout: u.timeout,
            counter: u.counter
          },
                a = t.get("Content-Encoding");
          if (!u.compress || "HEAD" === u.method || null === a || 204 === e.statusCode || 304 === e.statusCode) return p = new $(n, o), void r(p);
          const c = {
            flush: s.Z_SYNC_FLUSH,
            finishFlush: s.Z_SYNC_FLUSH
          };
          if ("gzip" == a || "x-gzip" == a) return n = n.pipe(s.createGunzip(c)), p = new $(n, o), void r(p);

          if ("deflate" != a && "x-deflate" != a) {
            if ("br" == a && "function" == typeof s.createBrotliDecompress) return n = n.pipe(s.createBrotliDecompress()), p = new $(n, o), void r(p);
            p = new $(n, o), r(p);
          } else {
            e.pipe(new H()).once("data", function (e) {
              n = 8 == (15 & e[0]) ? n.pipe(s.createInflate()) : n.pipe(s.createInflateRaw()), p = new $(n, o), r(p);
            });
          }
        }), function (e, t) {
          const r = t.body;
          null === r ? e.end() : m(r) ? r.stream().pipe(e) : Buffer.isBuffer(r) ? (e.write(r), e.end()) : r.pipe(e);
        }(g, u);
      });
    }

    V.isRedirect = function (e) {
      return 301 === e || 302 === e || 303 === e || 307 === e || 308 === e;
    }, V.Promise = global.Promise, t.default = V;
  }, function (e, t, r) {
    (function (e) {
      var r = 200,
          n = "__lodash_hash_undefined__",
          o = 800,
          i = 16,
          a = 9007199254740991,
          s = "[object Arguments]",
          u = "[object AsyncFunction]",
          c = "[object Function]",
          l = "[object GeneratorFunction]",
          f = "[object Null]",
          h = "[object Object]",
          p = "[object Proxy]",
          d = "[object Undefined]",
          y = /^\[object .+?Constructor\]$/,
          g = /^(?:0|[1-9]\d*)$/,
          b = {};
      b["[object Float32Array]"] = b["[object Float64Array]"] = b["[object Int8Array]"] = b["[object Int16Array]"] = b["[object Int32Array]"] = b["[object Uint8Array]"] = b["[object Uint8ClampedArray]"] = b["[object Uint16Array]"] = b["[object Uint32Array]"] = !0, b[s] = b["[object Array]"] = b["[object ArrayBuffer]"] = b["[object Boolean]"] = b["[object DataView]"] = b["[object Date]"] = b["[object Error]"] = b[c] = b["[object Map]"] = b["[object Number]"] = b[h] = b["[object RegExp]"] = b["[object Set]"] = b["[object String]"] = b["[object WeakMap]"] = !1;

      var v = "object" == typeof global && global && global.Object === Object && global,
          m = "object" == typeof self && self && self.Object === Object && self,
          w = v || m || Function("return this")(),
          _ = t && !t.nodeType && t,
          S = _ && "object" == typeof e && e && !e.nodeType && e,
          j = S && S.exports === _,
          O = j && v.process,
          T = function () {
        try {
          var e = S && S.require && S.require("util").types;

          return e || O && O.binding && O.binding("util");
        } catch (e) {}
      }(),
          E = T && T.isTypedArray;

      function P(e, t, r) {
        switch (r.length) {
          case 0:
            return e.call(t);

          case 1:
            return e.call(t, r[0]);

          case 2:
            return e.call(t, r[0], r[1]);

          case 3:
            return e.call(t, r[0], r[1], r[2]);
        }

        return e.apply(t, r);
      }

      var x,
          A,
          I,
          k = Array.prototype,
          F = Function.prototype,
          L = Object.prototype,
          C = w["__core-js_shared__"],
          B = F.toString,
          z = L.hasOwnProperty,
          $ = (x = /[^.]+$/.exec(C && C.keys && C.keys.IE_PROTO || "")) ? "Symbol(src)_1." + x : "",
          R = L.toString,
          N = B.call(Object),
          U = RegExp("^" + B.call(z).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"),
          D = j ? w.Buffer : void 0,
          q = w.Symbol,
          J = w.Uint8Array,
          M = D ? D.allocUnsafe : void 0,
          H = (A = Object.getPrototypeOf, I = Object, function (e) {
        return A(I(e));
      }),
          G = Object.create,
          V = L.propertyIsEnumerable,
          K = k.splice,
          Z = q ? q.toStringTag : void 0,
          Y = function () {
        try {
          var e = _e(Object, "defineProperty");

          return e({}, "", {}), e;
        } catch (e) {}
      }(),
          W = D ? D.isBuffer : void 0,
          X = Math.max,
          Q = Date.now,
          ee = _e(w, "Map"),
          te = _e(Object, "create"),
          re = function () {
        function e() {}

        return function (t) {
          if (!Le(t)) return {};
          if (G) return G(t);
          e.prototype = t;
          var r = new e();
          return e.prototype = void 0, r;
        };
      }();

      function ne(e) {
        var t = -1,
            r = null == e ? 0 : e.length;

        for (this.clear(); ++t < r;) {
          var n = e[t];
          this.set(n[0], n[1]);
        }
      }

      function oe(e) {
        var t = -1,
            r = null == e ? 0 : e.length;

        for (this.clear(); ++t < r;) {
          var n = e[t];
          this.set(n[0], n[1]);
        }
      }

      function ie(e) {
        var t = -1,
            r = null == e ? 0 : e.length;

        for (this.clear(); ++t < r;) {
          var n = e[t];
          this.set(n[0], n[1]);
        }
      }

      function ae(e) {
        var t = this.__data__ = new oe(e);
        this.size = t.size;
      }

      function se(e, t) {
        var r = xe(e),
            n = !r && Pe(e),
            o = !r && !n && Ie(e),
            i = !r && !n && !o && Be(e),
            a = r || n || o || i,
            s = a ? function (e, t) {
          for (var r = -1, n = Array(e); ++r < e;) n[r] = t(r);

          return n;
        }(e.length, String) : [],
            u = s.length;

        for (var c in e) !t && !z.call(e, c) || a && ("length" == c || o && ("offset" == c || "parent" == c) || i && ("buffer" == c || "byteLength" == c || "byteOffset" == c) || Se(c, u)) || s.push(c);

        return s;
      }

      function ue(e, t, r) {
        (void 0 === r || Ee(e[t], r)) && (void 0 !== r || t in e) || fe(e, t, r);
      }

      function ce(e, t, r) {
        var n = e[t];
        z.call(e, t) && Ee(n, r) && (void 0 !== r || t in e) || fe(e, t, r);
      }

      function le(e, t) {
        for (var r = e.length; r--;) if (Ee(e[r][0], t)) return r;

        return -1;
      }

      function fe(e, t, r) {
        "__proto__" == t && Y ? Y(e, t, {
          configurable: !0,
          enumerable: !0,
          value: r,
          writable: !0
        }) : e[t] = r;
      }

      ne.prototype.clear = function () {
        this.__data__ = te ? te(null) : {}, this.size = 0;
      }, ne.prototype.delete = function (e) {
        var t = this.has(e) && delete this.__data__[e];
        return this.size -= t ? 1 : 0, t;
      }, ne.prototype.get = function (e) {
        var t = this.__data__;

        if (te) {
          var r = t[e];
          return r === n ? void 0 : r;
        }

        return z.call(t, e) ? t[e] : void 0;
      }, ne.prototype.has = function (e) {
        var t = this.__data__;
        return te ? void 0 !== t[e] : z.call(t, e);
      }, ne.prototype.set = function (e, t) {
        var r = this.__data__;
        return this.size += this.has(e) ? 0 : 1, r[e] = te && void 0 === t ? n : t, this;
      }, oe.prototype.clear = function () {
        this.__data__ = [], this.size = 0;
      }, oe.prototype.delete = function (e) {
        var t = this.__data__,
            r = le(t, e);
        return !(r < 0) && (r == t.length - 1 ? t.pop() : K.call(t, r, 1), --this.size, !0);
      }, oe.prototype.get = function (e) {
        var t = this.__data__,
            r = le(t, e);
        return r < 0 ? void 0 : t[r][1];
      }, oe.prototype.has = function (e) {
        return le(this.__data__, e) > -1;
      }, oe.prototype.set = function (e, t) {
        var r = this.__data__,
            n = le(r, e);
        return n < 0 ? (++this.size, r.push([e, t])) : r[n][1] = t, this;
      }, ie.prototype.clear = function () {
        this.size = 0, this.__data__ = {
          hash: new ne(),
          map: new (ee || oe)(),
          string: new ne()
        };
      }, ie.prototype.delete = function (e) {
        var t = we(this, e).delete(e);
        return this.size -= t ? 1 : 0, t;
      }, ie.prototype.get = function (e) {
        return we(this, e).get(e);
      }, ie.prototype.has = function (e) {
        return we(this, e).has(e);
      }, ie.prototype.set = function (e, t) {
        var r = we(this, e),
            n = r.size;
        return r.set(e, t), this.size += r.size == n ? 0 : 1, this;
      }, ae.prototype.clear = function () {
        this.__data__ = new oe(), this.size = 0;
      }, ae.prototype.delete = function (e) {
        var t = this.__data__,
            r = t.delete(e);
        return this.size = t.size, r;
      }, ae.prototype.get = function (e) {
        return this.__data__.get(e);
      }, ae.prototype.has = function (e) {
        return this.__data__.has(e);
      }, ae.prototype.set = function (e, t) {
        var n = this.__data__;

        if (n instanceof oe) {
          var o = n.__data__;
          if (!ee || o.length < r - 1) return o.push([e, t]), this.size = ++n.size, this;
          n = this.__data__ = new ie(o);
        }

        return n.set(e, t), this.size = n.size, this;
      };

      var he,
          pe = function (e, t, r) {
        for (var n = -1, o = Object(e), i = r(e), a = i.length; a--;) {
          var s = i[he ? a : ++n];
          if (!1 === t(o[s], s, o)) break;
        }

        return e;
      };

      function de(e) {
        return null == e ? void 0 === e ? d : f : Z && Z in Object(e) ? function (e) {
          var t = z.call(e, Z),
              r = e[Z];

          try {
            e[Z] = void 0;
            var n = !0;
          } catch (e) {}

          var o = R.call(e);
          n && (t ? e[Z] = r : delete e[Z]);
          return o;
        }(e) : function (e) {
          return R.call(e);
        }(e);
      }

      function ye(e) {
        return Ce(e) && de(e) == s;
      }

      function ge(e) {
        return !(!Le(e) || function (e) {
          return !!$ && $ in e;
        }(e)) && (ke(e) ? U : y).test(function (e) {
          if (null != e) {
            try {
              return B.call(e);
            } catch (e) {}

            try {
              return e + "";
            } catch (e) {}
          }

          return "";
        }(e));
      }

      function be(e) {
        if (!Le(e)) return function (e) {
          var t = [];
          if (null != e) for (var r in Object(e)) t.push(r);
          return t;
        }(e);
        var t = je(e),
            r = [];

        for (var n in e) ("constructor" != n || !t && z.call(e, n)) && r.push(n);

        return r;
      }

      function ve(e, t, r, n, o) {
        e !== t && pe(t, function (i, a) {
          if (o || (o = new ae()), Le(i)) !function (e, t, r, n, o, i, a) {
            var s = Oe(e, r),
                u = Oe(t, r),
                c = a.get(u);
            if (c) return void ue(e, r, c);
            var l = i ? i(s, u, r + "", e, t, a) : void 0,
                f = void 0 === l;

            if (f) {
              var p = xe(u),
                  d = !p && Ie(u),
                  y = !p && !d && Be(u);
              l = u, p || d || y ? xe(s) ? l = s : Ce(w = s) && Ae(w) ? l = function (e, t) {
                var r = -1,
                    n = e.length;
                t || (t = Array(n));

                for (; ++r < n;) t[r] = e[r];

                return t;
              }(s) : d ? (f = !1, l = function (e, t) {
                if (t) return e.slice();
                var r = e.length,
                    n = M ? M(r) : new e.constructor(r);
                return e.copy(n), n;
              }(u, !0)) : y ? (f = !1, g = u, b = !0 ? (v = g.buffer, m = new v.constructor(v.byteLength), new J(m).set(new J(v)), m) : g.buffer, l = new g.constructor(b, g.byteOffset, g.length)) : l = [] : function (e) {
                if (!Ce(e) || de(e) != h) return !1;
                var t = H(e);
                if (null === t) return !0;
                var r = z.call(t, "constructor") && t.constructor;
                return "function" == typeof r && r instanceof r && B.call(r) == N;
              }(u) || Pe(u) ? (l = s, Pe(s) ? l = function (e) {
                return function (e, t, r, n) {
                  var o = !r;
                  r || (r = {});
                  var i = -1,
                      a = t.length;

                  for (; ++i < a;) {
                    var s = t[i],
                        u = n ? n(r[s], e[s], s, r, e) : void 0;
                    void 0 === u && (u = e[s]), o ? fe(r, s, u) : ce(r, s, u);
                  }

                  return r;
                }(e, ze(e));
              }(s) : Le(s) && !ke(s) || (l = function (e) {
                return "function" != typeof e.constructor || je(e) ? {} : re(H(e));
              }(u))) : f = !1;
            }

            var g, b, v, m;
            var w;
            f && (a.set(u, l), o(l, u, n, i, a), a.delete(u));
            ue(e, r, l);
          }(e, t, a, r, ve, n, o);else {
            var s = n ? n(Oe(e, a), i, a + "", e, t, o) : void 0;
            void 0 === s && (s = i), ue(e, a, s);
          }
        }, ze);
      }

      function me(e, t) {
        return Te(function (e, t, r) {
          return t = X(void 0 === t ? e.length - 1 : t, 0), function () {
            for (var n = arguments, o = -1, i = X(n.length - t, 0), a = Array(i); ++o < i;) a[o] = n[t + o];

            o = -1;

            for (var s = Array(t + 1); ++o < t;) s[o] = n[o];

            return s[t] = r(a), P(e, this, s);
          };
        }(e, t, Ne), e + "");
      }

      function we(e, t) {
        var r,
            n,
            o = e.__data__;
        return ("string" == (n = typeof (r = t)) || "number" == n || "symbol" == n || "boolean" == n ? "__proto__" !== r : null === r) ? o["string" == typeof t ? "string" : "hash"] : o.map;
      }

      function _e(e, t) {
        var r = function (e, t) {
          return null == e ? void 0 : e[t];
        }(e, t);

        return ge(r) ? r : void 0;
      }

      function Se(e, t) {
        var r = typeof e;
        return !!(t = null == t ? a : t) && ("number" == r || "symbol" != r && g.test(e)) && e > -1 && e % 1 == 0 && e < t;
      }

      function je(e) {
        var t = e && e.constructor;
        return e === ("function" == typeof t && t.prototype || L);
      }

      function Oe(e, t) {
        if (("constructor" !== t || "function" != typeof e[t]) && "__proto__" != t) return e[t];
      }

      var Te = function (e) {
        var t = 0,
            r = 0;
        return function () {
          var n = Q(),
              a = i - (n - r);

          if (r = n, a > 0) {
            if (++t >= o) return arguments[0];
          } else t = 0;

          return e.apply(void 0, arguments);
        };
      }(Y ? function (e, t) {
        return Y(e, "toString", {
          configurable: !0,
          enumerable: !1,
          value: (r = t, function () {
            return r;
          }),
          writable: !0
        });
        var r;
      } : Ne);

      function Ee(e, t) {
        return e === t || e != e && t != t;
      }

      var Pe = ye(function () {
        return arguments;
      }()) ? ye : function (e) {
        return Ce(e) && z.call(e, "callee") && !V.call(e, "callee");
      },
          xe = Array.isArray;

      function Ae(e) {
        return null != e && Fe(e.length) && !ke(e);
      }

      var Ie = W || function () {
        return !1;
      };

      function ke(e) {
        if (!Le(e)) return !1;
        var t = de(e);
        return t == c || t == l || t == u || t == p;
      }

      function Fe(e) {
        return "number" == typeof e && e > -1 && e % 1 == 0 && e <= a;
      }

      function Le(e) {
        var t = typeof e;
        return null != e && ("object" == t || "function" == t);
      }

      function Ce(e) {
        return null != e && "object" == typeof e;
      }

      var Be = E ? function (e) {
        return function (t) {
          return e(t);
        };
      }(E) : function (e) {
        return Ce(e) && Fe(e.length) && !!b[de(e)];
      };

      function ze(e) {
        return Ae(e) ? se(e, !0) : be(e);
      }

      var $e,
          Re = ($e = function (e, t, r) {
        ve(e, t, r);
      }, me(function (e, t) {
        var r = -1,
            n = t.length,
            o = n > 1 ? t[n - 1] : void 0,
            i = n > 2 ? t[2] : void 0;

        for (o = $e.length > 3 && "function" == typeof o ? (n--, o) : void 0, i && function (e, t, r) {
          if (!Le(r)) return !1;
          var n = typeof t;
          return !!("number" == n ? Ae(r) && Se(t, r.length) : "string" == n && (t in r)) && Ee(r[t], e);
        }(t[0], t[1], i) && (o = n < 3 ? void 0 : o, n = 1), e = Object(e); ++r < n;) {
          var a = t[r];
          a && $e(e, a, r, o);
        }

        return e;
      }));

      function Ne(e) {
        return e;
      }

      e.exports = Re;
    }).call(this, r(10)(e));
  }, function (e, t) {
    e.exports = function (e) {
      return e.webpackPolyfill || (e.deprecate = function () {}, e.paths = [], e.children || (e.children = []), Object.defineProperty(e, "loaded", {
        enumerable: !0,
        get: function () {
          return e.l;
        }
      }), Object.defineProperty(e, "id", {
        enumerable: !0,
        get: function () {
          return e.i;
        }
      }), e.webpackPolyfill = 1), e;
    };
  }, function (e, t, r) {
    function n(e) {
      return (n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
        return typeof e;
      } : function (e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
      })(e);
    }

    function o(e, t) {
      var r = Object.keys(e);

      if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter(function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })), r.push.apply(r, n);
      }

      return r;
    }

    function i(e) {
      for (var t, r = 1; r < arguments.length; r++) t = null == arguments[r] ? {} : arguments[r], r % 2 ? o(t, !0).forEach(function (r) {
        s(e, r, t[r]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : o(t).forEach(function (r) {
        Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
      });

      return e;
    }

    function a(e, t) {
      for (var r, n = 0; n < t.length; n++) (r = t[n]).enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
    }

    function s(e, t, r) {
      return t in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
      }) : e[t] = r, e;
    }

    var u,
        c,
        l = "https://api.flagsmith.com/api/v1/",
        f = r(12),
        h = function (e) {
      return "Attempted to " + e + " a user before calling flagsmith.init. Call flagsmith.init first, if you wish to prevent it sending a request for flags, call init with preventFetch:true.";
    },
        p = function () {
      function e(t) {
        var r = this;
        (function (e, t) {
          if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
        })(this, e), s(this, "getJSON", function (e, t, n) {
          var o = r.environmentID,
              i = r.headers,
              a = {
            method: t || "GET",
            body: n,
            headers: {
              "x-environment-key": o
            }
          };
          return t && "GET" !== t && (a.headers["Content-Type"] = "application/json; charset=utf-8"), i && Object.assign(a.headers, i), u(e, a).then(function (e) {
            return e.text().then(function (t) {
              var r = t;

              try {
                r = JSON.parse(t);
              } catch (e) {}

              return e.ok ? r : Promise.reject(r);
            });
          });
        }), s(this, "getFlags", function (e, t) {
          var n = r.onChange,
              o = r.onError,
              a = r.identity,
              s = r.api,
              u = (r.disableCache, !1),
              c = function (e, t) {
            var o = e.flags,
                a = e.traits;
            r.withTraits = !1;
            var s = {},
                u = {};

            if (a = a || [], (o = o || []).forEach(function (e) {
              s[e.feature.name.toLowerCase().replace(/ /g, "_")] = {
                id: e.feature.id,
                enabled: e.enabled,
                value: e.feature_state_value
              };
            }), a.forEach(function (e) {
              u[e.trait_key.toLowerCase().replace(/ /g, "_")] = e.trait_value;
            }), r.oldFlags = i({}, r.flags), t) {
              var c = {};
              t.map(function (e) {
                c[e.name] = e;
              }), r.segments = c;
            }

            var l = f(r.flags, s),
                h = f(r.traits, u);
            r.flags = s, r.traits = u, r.updateStorage(), n && n(r.oldFlags, {
              isFromServer: !0,
              flagsChanged: !l,
              traitsChanged: !h
            });
          };

          return a ? Promise.all([r.withTraits ? r.getJSON(s + "identities/", "POST", JSON.stringify({
            identifier: a,
            traits: Object.keys(r.withTraits).map(function (e) {
              return {
                trait_key: e,
                trait_value: r.withTraits[e]
              };
            })
          })) : r.getJSON(s + "identities/?identifier=" + encodeURIComponent(a))]).then(function (e) {
            c(e[0], e[1]);
          }).catch(function (e) {
            var t = e.message;
            o && o({
              message: t
            });
          }) : Promise.all([r.getJSON(s + "flags/")]).then(function (t) {
            c({
              flags: t[0]
            }, null), e && !u && (u = !0, e());
          }).catch(function (e) {
            t && !u && (u = !0, t(e)), o && o(e);
          });
        }), s(this, "analyticsFlags", function () {
          var e = r.api;
          if (0 !== Object.getOwnPropertyNames(r.evaluationEvent).length) return r.getJSON(e + "analytics/flags/", "POST", JSON.stringify(r.evaluationEvent)).then(function () {
            state = r.getState(), r.setState(i({}, state, {
              evaluationEvent: {}
            })), r.updateEventStorage();
          }).catch(function (e) {
            r.log("Exception fetching evaluationEvent", e);
          });
        }), s(this, "evaluateFlag", function (e) {
          if (r.enableAnalytics) {
            if (!r.evaluationEvent) return;
            void 0 === r.evaluationEvent[e] && (r.evaluationEvent[e] = 0), r.evaluationEvent[e] += 1;
          }

          r.updateEventStorage();
        }), s(this, "getValue", function (e) {
          var t = r.flags && r.flags[e.toLowerCase().replace(/ /g, "_")],
              n = null;
          return t && (n = t.value), r.evaluateFlag(e), n;
        }), s(this, "getTrait", function (e) {
          return r.traits && r.traits[e.toLowerCase().replace(/ /g, "_")];
        }), s(this, "setTrait", function (e, t) {
          var n = r.getJSON,
              o = r.identity,
              i = r.api;
          if (i) return n("".concat(i, "traits/"), "POST", JSON.stringify({
            identity: {
              identifier: o
            },
            trait_key: e,
            trait_value: t
          })).then(function () {
            r.initialised && r.getFlags();
          });
          console.error(h("setTrait"));
        }), s(this, "setTraits", function (e) {
          var t = r.getJSON,
              o = r.identity,
              i = r.api;

          if (i) {
            e && "object" === n(e) || console.error("Expected object for flagsmith.setTraits");
            var a = Object.keys(e).map(function (t) {
              return {
                identity: {
                  identifier: o
                },
                trait_key: t,
                trait_value: e[t]
              };
            });
            return t("".concat(i, "traits/bulk/"), "PUT", JSON.stringify(a)).then(function () {
              r.initialised && r.getFlags();
            });
          }

          console.error(h("setTraits"));
        }), s(this, "incrementTrait", function (e, t) {
          var n = r.getJSON,
              o = r.identity,
              i = r.api;
          return n("".concat(i, "traits/increment-value/"), "POST", JSON.stringify({
            trait_key: e,
            increment_by: t,
            identifier: o
          })).then(r.getFlags);
        }), s(this, "hasFeature", function (e) {
          var t = r.flags && r.flags[e.toLowerCase().replace(/ /g, "_")],
              n = !1;
          return t && t.enabled && (n = !0), r.evaluateFlag(e), n;
        }), u = t.fetch ? t.fetch : global.fetch, c = t.AsyncStorage;
      }

      return function (e, t, r) {
        t && a(e.prototype, t), r && a(e, r);
      }(e, [{
        key: "init",
        value: function (e) {
          var t = this,
              r = e.environmentID,
              n = e.api,
              o = void 0 === n ? l : n,
              a = e.headers,
              s = e.onChange,
              u = e.cacheFlags,
              f = e.onError,
              h = e.defaultFlags,
              p = e.preventFetch,
              d = e.enableLogs,
              y = e.enableAnalytics,
              g = e.AsyncStorage,
              b = e.state;
          return new Promise(function (e, n) {
            if (t.environmentID = r, t.api = o, t.headers = a, t.getFlagInterval = null, t.analyticsInterval = null, t.onChange = s, t.onError = f, t.enableLogs = d, t.enableAnalytics = !!y && y, t.flags = Object.assign({}, h) || {}, t.initialised = !0, t.ticks = 1e4, t.timer = t.enableLogs ? new Date().valueOf() : null, g && (c = g), t.cacheFlags = void 0 !== c && u, t.setState(b), !r) throw n("Please specify a environment id"), "Please specify a environment id";
            c.getItem("BULLET_TRAIN_EVENT").then(function (e) {
              if (e) try {
                t.evaluationEvent = JSON.parse(e);
              } catch (e) {
                t.evaluationEvent = {};
              } else t.evaluationEvent = {};
              t.analyticsInterval = setInterval(t.analyticsFlags, t.ticks);
            }), t.enableAnalytics && (t.analyticsInterval && clearInterval(t.analyticsInterval), c.getItem("BULLET_TRAIN_EVENT", function (e, r) {
              if (r) {
                var n = JSON.parse(r);
                n && (b = t.getState(), t.log("Retrieved events from cache", r), t.setState(i({}, b, {
                  evaluationEvent: n
                })));
              }
            })), u ? c.getItem("BULLET_TRAIN_DB", function (r, o) {
              if (o) try {
                var i = JSON.parse(o);
                i && i.api === t.api && i.environmentID === t.environmentID && (t.setState(i), t.log("Retrieved flags from cache", i)), t.flags ? (t.onChange && t.onChange(null, {
                  isFromServer: !1
                }), t.oldFlags = t.flags, e(), !p && t.getFlags(Promise.resolve, Promise.reject)) : p ? e() : t.getFlags(e, n);
              } catch (e) {
                t.log("Exception fetching cached logs", e);
              } else p ? (h && t.onChange(null, {
                isFromServer: !1
              }), e()) : t.getFlags(e, n);
            }) : p ? (h && t.onChange(null, {
              isFromServer: !1
            }), e()) : t.getFlags(e, n);
          }).catch(function (e) {
            return f(e);
          });
        }
      }, {
        key: "getAllFlags",
        value: function () {
          return this.flags;
        }
      }, {
        key: "identify",
        value: function (e, t) {
          return this.identity = e, t && (this.withTraits = t), this.initialised && !this.getFlagInterval ? this.getFlags() : Promise.resolve();
        }
      }, {
        key: "getState",
        value: function () {
          return {
            api: this.api,
            environmentID: this.environmentID,
            flags: this.flags,
            identity: this.identity,
            segments: this.segments,
            traits: this.traits,
            evaluationEvent: this.evaluationEvent
          };
        }
      }, {
        key: "setState",
        value: function (e) {
          e && (this.initialised = !0, this.api = e.api || this.api || l, this.environmentID = e.environmentID || this.environmentID, this.flags = e.flags || this.flags, this.identity = e.identity || this.identity, this.segments = e.segments || this.segments, this.traits = e.traits || this.traits, this.evaluationEvent = e.evaluationEvent || this.evaluationEvent);
        }
      }, {
        key: "log",
        value: function () {
          if (this.enableLogs) {
            for (var e = arguments.length, t = Array(e), r = 0; r < e; r++) t[r] = arguments[r];

            console.log.apply(this, ["FLAGSMITH:", new Date().valueOf() - this.timer, "ms"].concat(t));
          }
        }
      }, {
        key: "updateStorage",
        value: function () {
          if (this.cacheFlags) {
            var e = JSON.stringify(this.getState());
            this.log("Setting storage", e), c.setItem("BULLET_TRAIN_DB", e);
          }
        }
      }, {
        key: "updateEventStorage",
        value: function () {
          if (this.enableAnalytics) {
            var e = JSON.stringify(this.getState().evaluationEvent);
            this.log("Setting event storage", e), c.setItem("BULLET_TRAIN_EVENT", e);
          }
        }
      }, {
        key: "logout",
        value: function () {
          return this.identity = null, this.segments = null, this.traits = null, this.initialised && !this.getFlagInterval ? this.getFlags() : Promise.resolve();
        }
      }, {
        key: "startListening",
        value: function () {
          var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 1e3;
          this.getFlagInterval && clearInterval(this.getFlagInterval), this.getFlagInterval = setInterval(this.getFlags, e);
        }
      }, {
        key: "stopListening",
        value: function () {
          clearInterval(this.getFlagInterval), this.getFlagInterval = null;
        }
      }, {
        key: "getSegments",
        value: function () {}
      }]), e;
    }();

    e.exports = function (e) {
      var t = e.fetch,
          r = e.AsyncStorage;
      return new p({
        fetch: t,
        AsyncStorage: r
      });
    };
  }, function (e, t, r) {
    "use strict";

    e.exports = function e(t, r) {
      if (t === r) return !0;

      if (t && r && "object" == typeof t && "object" == typeof r) {
        if (t.constructor !== r.constructor) return !1;
        var n, o, i;

        if (Array.isArray(t)) {
          if ((n = t.length) != r.length) return !1;

          for (o = n; 0 != o--;) if (!e(t[o], r[o])) return !1;

          return !0;
        }

        if (t.constructor === RegExp) return t.source === r.source && t.flags === r.flags;
        if (t.valueOf !== Object.prototype.valueOf) return t.valueOf() === r.valueOf();
        if (t.toString !== Object.prototype.toString) return t.toString() === r.toString();
        if ((n = (i = Object.keys(t)).length) !== Object.keys(r).length) return !1;

        for (o = n; 0 != o--;) if (!Object.prototype.hasOwnProperty.call(r, i[o])) return !1;

        for (o = n; 0 != o--;) {
          var a = i[o];
          if (!e(t[a], r[a])) return !1;
        }

        return !0;
      }

      return t != t && r != r;
    };
  }]);
});
