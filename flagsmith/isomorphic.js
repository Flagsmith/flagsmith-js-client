!function (e, t) {
  if ("object" == typeof exports && "object" == typeof module) module.exports = t();else if ("function" == typeof define && define.amd) define([], t);else {
    var n = t();

    for (var r in n) ("object" == typeof exports ? exports : e)[r] = n[r];
  }
}(this, function () {
  return function (e) {
    var t = {};

    function n(r) {
      if (t[r]) return t[r].exports;
      var o = t[r] = {
        i: r,
        l: !1,
        exports: {}
      };
      return e[r].call(o.exports, o, o.exports, n), o.l = !0, o.exports;
    }

    return n.m = e, n.c = t, n.d = function (e, t, r) {
      n.o(e, t) || Object.defineProperty(e, t, {
        enumerable: !0,
        get: r
      });
    }, n.r = function (e) {
      "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
        value: "Module"
      }), Object.defineProperty(e, "__esModule", {
        value: !0
      });
    }, n.t = function (e, t) {
      if (1 & t && (e = n(e)), 8 & t) return e;
      if (4 & t && "object" == typeof e && e && e.__esModule) return e;
      var r = Object.create(null);
      if (n.r(r), Object.defineProperty(r, "default", {
        enumerable: !0,
        value: e
      }), 2 & t && "string" != typeof e) for (var o in e) n.d(r, o, function (t) {
        return e[t];
      }.bind(null, o));
      return r;
    }, n.n = function (e) {
      var t = e && e.__esModule ? function () {
        return e.default;
      } : function () {
        return e;
      };
      return n.d(t, "a", t), t;
    }, n.o = function (e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }, n.p = "", n(n.s = 6);
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
  }, function (e, t, n) {
    "use strict";

    Object.defineProperty(t, "__esModule", {
      value: !0
    });

    var r,
        o = function (e, t) {
      if (Array.isArray(e)) return e;
      if (Symbol.iterator in Object(e)) return function (e, t) {
        var n = [],
            r = !0,
            o = !1,
            i = void 0;

        try {
          for (var s, a = e[Symbol.iterator](); !(r = (s = a.next()).done) && (n.push(s.value), !t || n.length !== t); r = !0);
        } catch (e) {
          o = !0, i = e;
        } finally {
          try {
            !r && a.return && a.return();
          } finally {
            if (o) throw i;
          }
        }

        return n;
      }(e, t);
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    },
        i = n(9),
        s = (r = i) && r.__esModule ? r : {
      default: r
    };

    var a = {
      getItem: function (e, t) {
        return a.multiGet([e]).then(function (e) {
          return e[0][1];
        }).then(function (e) {
          return t && t(null, e), e;
        }).catch(function (e) {
          return t && t(e, null), e;
        });
      },
      setItem: function (e, t, n) {
        return a.multiSet([[e, t]]).then(function (e) {
          return n && n(null, e), e;
        }).catch(function (e) {
          return n && n(e, null), e;
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
        return a.multiRemove([e]).then(function () {
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
        return a.multiMerge([[e, t]]);
      },
      multiGet: function (e) {
        return new Promise(function (t) {
          t(e.reduce(function (e, t) {
            return e.concat([[t, localStorage.getItem(t)]]);
          }, []));
        });
      },
      multiSet: function (e) {
        return new Promise(function (t, n) {
          var r = [];
          return e.forEach(function (e) {
            var t = o(e, 2),
                n = t[0],
                i = t[1];

            try {
              localStorage.setItem(n, i);
            } catch (e) {
              r.push(e);
            }
          }), r.length > 0 ? n(r) : t();
        });
      },
      multiMerge: function (e) {
        return new Promise(function (t, n) {
          var r = [];
          return e.forEach(function (e) {
            var t = o(e, 2),
                n = t[0],
                i = t[1],
                a = localStorage.getItem(n);
            if (a) try {
              localStorage.setItem(n, JSON.stringify((0, s.default)(JSON.parse(a), JSON.parse(i))));
            } catch (e) {
              r.push(e);
            }
          }), r.length > 0 ? n(r) : t();
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
    t.default = a;
  }, function (e, t, n) {
    "use strict";

    n.r(t);
    var r = n(5),
        o = n.n(r),
        i = n(7).default;
    "undefined" == typeof window && (i = n(8).default);
    var s = n(11)({
      AsyncStorage: o.a,
      fetch: i
    });
    "undefined" != typeof window && (window.flagsmith = s), t.default = s;
  }, function (e, t, n) {
    "use strict";

    n.r(t), t.default = function (e, t) {
      return t = t || {}, new Promise(function (n, r) {
        var o = new XMLHttpRequest(),
            i = [],
            s = [],
            a = {},
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
                return s;
              },
              get: function (e) {
                return a[e.toLowerCase()];
              },
              has: function (e) {
                return e.toLowerCase() in a;
              }
            }
          };
        };

        for (var c in o.open(t.method || "get", e, !0), o.onload = function () {
          o.getAllResponseHeaders().replace(/^(.*?):[^\S\n]*([\s\S]*?)$/gm, function (e, t, n) {
            i.push(t = t.toLowerCase()), s.push([t, n]), a[t] = a[t] ? a[t] + "," + n : n;
          }), n(u());
        }, o.onerror = r, o.withCredentials = "include" == t.credentials, t.headers) o.setRequestHeader(c, t.headers[c]);

        o.send(t.body || null);
      });
    };
  }, function (e, t, n) {
    "use strict";

    n.r(t), n.d(t, "Headers", function () {
      return A;
    }), n.d(t, "Request", function () {
      return J;
    }), n.d(t, "Response", function () {
      return z;
    }), n.d(t, "FetchError", function () {
      return h;
    });
    var r = n(0),
        o = n(3),
        i = n(2),
        s = n(4),
        a = n(1);
    const u = r.Readable,
          c = Symbol("buffer"),
          l = Symbol("type");

    class f {
      constructor() {
        this[l] = "";
        const e = arguments[0],
              t = arguments[1],
              n = [];
        let r = 0;

        if (e) {
          const t = e,
                o = Number(t.length);

          for (let e = 0; e < o; e++) {
            const o = t[e];
            let i;
            r += (i = o instanceof Buffer ? o : ArrayBuffer.isView(o) ? Buffer.from(o.buffer, o.byteOffset, o.byteLength) : o instanceof ArrayBuffer ? Buffer.from(o) : o instanceof f ? o[c] : Buffer.from("string" == typeof o ? o : String(o))).length, n.push(i);
          }
        }

        this[c] = Buffer.concat(n);
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
              n = arguments[1];
        let r, o;
        r = void 0 === t ? 0 : t < 0 ? Math.max(e + t, 0) : Math.min(t, e), o = void 0 === n ? e : n < 0 ? Math.max(e + n, 0) : Math.min(n, e);
        const i = Math.max(o - r, 0),
              s = this[c].slice(r, r + i),
              a = new f([], {
          type: arguments[2]
        });
        return a[c] = s, a;
      }

    }

    function h(e, t, n) {
      Error.call(this, e), this.message = e, this.type = t, n && (this.code = this.errno = n.code), Error.captureStackTrace(this, this.constructor);
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
          y = r.PassThrough;

    function g(e) {
      var t = this,
          n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          o = n.size;
      let i = void 0 === o ? 0 : o;
      var s = n.timeout;
      let a = void 0 === s ? 0 : s;
      null == e ? e = null : v(e) ? e = Buffer.from(e.toString()) : m(e) || Buffer.isBuffer(e) || ("[object ArrayBuffer]" === Object.prototype.toString.call(e) ? e = Buffer.from(e) : ArrayBuffer.isView(e) ? e = Buffer.from(e.buffer, e.byteOffset, e.byteLength) : e instanceof r || (e = Buffer.from(String(e)))), this[d] = {
        body: e,
        disturbed: !1,
        error: null
      }, this.size = i, this.timeout = a, e instanceof r && e.on("error", function (e) {
        const n = "AbortError" === e.name ? e : new h(`Invalid response body while trying to fetch ${t.url}: ${e.message}`, "system", e);
        t[d].error = n;
      });
    }

    function b() {
      var e = this;
      if (this[d].disturbed) return g.Promise.reject(new TypeError(`body used already for: ${this.url}`));
      if (this[d].disturbed = !0, this[d].error) return g.Promise.reject(this[d].error);
      let t = this.body;
      if (null === t) return g.Promise.resolve(Buffer.alloc(0));
      if (m(t) && (t = t.stream()), Buffer.isBuffer(t)) return g.Promise.resolve(t);
      if (!(t instanceof r)) return g.Promise.resolve(Buffer.alloc(0));
      let n = [],
          o = 0,
          i = !1;
      return new g.Promise(function (r, s) {
        let a;
        e.timeout && (a = setTimeout(function () {
          i = !0, s(new h(`Response timeout while trying to fetch ${e.url} (over ${e.timeout}ms)`, "body-timeout"));
        }, e.timeout)), t.on("error", function (t) {
          "AbortError" === t.name ? (i = !0, s(t)) : s(new h(`Invalid response body while trying to fetch ${e.url}: ${t.message}`, "system", t));
        }), t.on("data", function (t) {
          if (!i && null !== t) {
            if (e.size && o + t.length > e.size) return i = !0, void s(new h(`content size at ${e.url} over limit: ${e.size}`, "max-size"));
            o += t.length, n.push(t);
          }
        }), t.on("end", function () {
          if (!i) {
            clearTimeout(a);

            try {
              r(Buffer.concat(n, o));
            } catch (t) {
              s(new h(`Could not create Buffer from response body for ${e.url}: ${t.message}`, "system", t));
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
          n,
          o = e.body;
      if (e.bodyUsed) throw new Error("cannot clone body after it is used");
      return o instanceof r && "function" != typeof o.getBoundary && (t = new y(), n = new y(), o.pipe(t), o.pipe(n), e[d].body = t, o = n), o;
    }

    function j(e) {
      return null === e ? null : "string" == typeof e ? "text/plain;charset=UTF-8" : v(e) ? "application/x-www-form-urlencoded;charset=UTF-8" : m(e) ? e.type || null : Buffer.isBuffer(e) ? null : "[object ArrayBuffer]" === Object.prototype.toString.call(e) ? null : ArrayBuffer.isView(e) ? null : "function" == typeof e.getBoundary ? `multipart/form-data;boundary=${e.getBoundary()}` : e instanceof r ? null : "text/plain;charset=UTF-8";
    }

    function _(e) {
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
            const n = t.get("content-type");
            let r,
                o,
                i = "utf-8";
            n && (r = /charset=([^;]*)/i.exec(n));
            o = e.slice(0, 1024).toString(), !r && o && (r = /<meta.+?charset=(['"])(.+?)\1/i.exec(o));
            !r && o && (r = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(o)) && (r = /charset=(.*)/i.exec(r.pop()));
            !r && o && (r = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(o));
            r && ("gb2312" !== (i = r.pop()) && "gbk" !== i || (i = "gb18030"));
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
        const n = Object.getOwnPropertyDescriptor(g.prototype, t);
        Object.defineProperty(e, t, n);
      }
    }, g.Promise = global.Promise;
    const S = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/,
          O = /[^\t\x20-\x7e\x80-\xff]/;

    function E(e) {
      if (e = `${e}`, S.test(e) || "" === e) throw new TypeError(`${e} is not a legal HTTP header name`);
    }

    function P(e) {
      if (e = `${e}`, O.test(e)) throw new TypeError(`${e} is not a legal HTTP header value`);
    }

    function T(e, t) {
      t = t.toLowerCase();

      for (const n in e) if (n.toLowerCase() === t) return n;
    }

    const x = Symbol("map");

    class A {
      constructor() {
        let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : void 0;

        if (this[x] = Object.create(null), e instanceof A) {
          const t = e.raw(),
                n = Object.keys(t);

          for (const e of n) for (const n of t[e]) this.append(e, n);
        } else if (null == e) ;else {
          if ("object" != typeof e) throw new TypeError("Provided initializer must be an object");
          {
            const t = e[Symbol.iterator];

            if (null != t) {
              if ("function" != typeof t) throw new TypeError("Header pairs must be iterable");
              const n = [];

              for (const t of e) {
                if ("object" != typeof t || "function" != typeof t[Symbol.iterator]) throw new TypeError("Each header pair must be iterable");
                n.push(Array.from(t));
              }

              for (const e of n) {
                if (2 !== e.length) throw new TypeError("Each header pair must be a name/value tuple");
                this.append(e[0], e[1]);
              }
            } else for (const t of Object.keys(e)) {
              const n = e[t];
              this.append(t, n);
            }
          }
        }
      }

      get(e) {
        E(e = `${e}`);
        const t = T(this[x], e);
        return void 0 === t ? null : this[x][t].join(", ");
      }

      forEach(e) {
        let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : void 0,
            n = k(this),
            r = 0;

        for (; r < n.length;) {
          var o = n[r];
          const i = o[0],
                s = o[1];
          e.call(t, s, i, this), n = k(this), r++;
        }
      }

      set(e, t) {
        t = `${t}`, E(e = `${e}`), P(t);
        const n = T(this[x], e);
        this[x][void 0 !== n ? n : e] = [t];
      }

      append(e, t) {
        t = `${t}`, E(e = `${e}`), P(t);
        const n = T(this[x], e);
        void 0 !== n ? this[x][n].push(t) : this[x][e] = [t];
      }

      has(e) {
        return E(e = `${e}`), void 0 !== T(this[x], e);
      }

      delete(e) {
        E(e = `${e}`);
        const t = T(this[x], e);
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

    function k(e) {
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
    const B = Symbol("internal");

    function F(e, t) {
      const n = Object.create(L);
      return n[B] = {
        target: e,
        kind: t,
        index: 0
      }, n;
    }

    const L = Object.setPrototypeOf({
      next() {
        if (!this || Object.getPrototypeOf(this) !== L) throw new TypeError("Value of `this` is not a HeadersIterator");
        var e = this[B];
        const t = e.target,
              n = e.kind,
              r = e.index,
              o = k(t, n);
        return r >= o.length ? {
          value: void 0,
          done: !0
        } : (this[B].index = r + 1, {
          value: o[r],
          done: !1
        });
      }

    }, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));

    function C(e) {
      const t = Object.assign({
        __proto__: null
      }, e[x]),
            n = T(e[x], "Host");
      return void 0 !== n && (t[n] = t[n][0]), t;
    }

    Object.defineProperty(L, Symbol.toStringTag, {
      value: "HeadersIterator",
      writable: !1,
      enumerable: !1,
      configurable: !0
    });
    const I = Symbol("Response internals"),
          $ = o.STATUS_CODES;

    class z {
      constructor() {
        let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null,
            t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        g.call(this, e, t);
        const n = t.status || 200,
              r = new A(t.headers);

        if (null != e && !r.has("Content-Type")) {
          const t = j(e);
          t && r.append("Content-Type", t);
        }

        this[I] = {
          url: t.url,
          status: n,
          statusText: t.statusText || $[n],
          headers: r,
          counter: t.counter
        };
      }

      get url() {
        return this[I].url || "";
      }

      get status() {
        return this[I].status;
      }

      get ok() {
        return this[I].status >= 200 && this[I].status < 300;
      }

      get redirected() {
        return this[I].counter > 0;
      }

      get statusText() {
        return this[I].statusText;
      }

      get headers() {
        return this[I].headers;
      }

      clone() {
        return new z(w(this), {
          url: this.url,
          status: this.status,
          statusText: this.statusText,
          headers: this.headers,
          ok: this.ok,
          redirected: this.redirected
        });
      }

    }

    g.mixIn(z.prototype), Object.defineProperties(z.prototype, {
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
    }), Object.defineProperty(z.prototype, Symbol.toStringTag, {
      value: "Response",
      writable: !1,
      enumerable: !1,
      configurable: !0
    });
    const R = Symbol("Request internals"),
          N = i.parse,
          U = i.format,
          D = "destroy" in r.Readable.prototype;

    function q(e) {
      return "object" == typeof e && "object" == typeof e[R];
    }

    class J {
      constructor(e) {
        let t,
            n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        q(e) ? t = N(e.url) : (t = e && e.href ? N(e.href) : N(`${e}`), e = {});
        let r = n.method || e.method || "GET";
        if (r = r.toUpperCase(), (null != n.body || q(e) && null !== e.body) && ("GET" === r || "HEAD" === r)) throw new TypeError("Request with GET/HEAD method cannot have body");
        let o = null != n.body ? n.body : q(e) && null !== e.body ? w(e) : null;
        g.call(this, o, {
          timeout: n.timeout || e.timeout || 0,
          size: n.size || e.size || 0
        });
        const i = new A(n.headers || e.headers || {});

        if (null != o && !i.has("Content-Type")) {
          const e = j(o);
          e && i.append("Content-Type", e);
        }

        let s = q(e) ? e.signal : null;
        if ("signal" in n && (s = n.signal), null != s && !function (e) {
          const t = e && "object" == typeof e && Object.getPrototypeOf(e);
          return !(!t || "AbortSignal" !== t.constructor.name);
        }(s)) throw new TypeError("Expected signal to be an instanceof AbortSignal");
        this[R] = {
          method: r,
          redirect: n.redirect || e.redirect || "follow",
          headers: i,
          parsedURL: t,
          signal: s
        }, this.follow = void 0 !== n.follow ? n.follow : void 0 !== e.follow ? e.follow : 20, this.compress = void 0 !== n.compress ? n.compress : void 0 === e.compress || e.compress, this.counter = n.counter || e.counter || 0, this.agent = n.agent || e.agent;
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
    const H = r.PassThrough,
          G = i.resolve;

    function V(e, t) {
      if (!V.Promise) throw new Error("native promise missing, set fetch.Promise to your favorite alternative");
      return g.Promise = V.Promise, new V.Promise(function (n, i) {
        const u = new J(e, t),
              c = function (e) {
          const t = e[R].parsedURL,
                n = new A(e[R].headers);
          if (n.has("Accept") || n.set("Accept", "*/*"), !t.protocol || !t.hostname) throw new TypeError("Only absolute URLs are supported");
          if (!/^https?:$/.test(t.protocol)) throw new TypeError("Only HTTP(S) protocols are supported");
          if (e.signal && e.body instanceof r.Readable && !D) throw new Error("Cancellation of streamed requests with AbortSignal is not supported in node < 8");
          let o = null;

          if (null == e.body && /^(POST|PUT)$/i.test(e.method) && (o = "0"), null != e.body) {
            const t = _(e);

            "number" == typeof t && (o = String(t));
          }

          o && n.set("Content-Length", o), n.has("User-Agent") || n.set("User-Agent", "node-fetch/1.0 (+https://github.com/bitinn/node-fetch)"), e.compress && !n.has("Accept-Encoding") && n.set("Accept-Encoding", "gzip,deflate");
          let i = e.agent;
          return "function" == typeof i && (i = i(t)), n.has("Connection") || i || n.set("Connection", "close"), Object.assign({}, t, {
            method: e.method,
            headers: C(n),
            agent: i
          });
        }(u),
              l = ("https:" === c.protocol ? s : o).request,
              f = u.signal;

        let p = null;

        const d = function () {
          let e = new M("The user aborted a request.");
          i(e), u.body && u.body instanceof r.Readable && u.body.destroy(e), p && p.body && p.body.emit("error", e);
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

            for (const n of Object.keys(e)) if (!S.test(n)) if (Array.isArray(e[n])) for (const r of e[n]) O.test(r) || (void 0 === t[x][n] ? t[x][n] = [r] : t[x][n].push(r));else O.test(e[n]) || (t[x][n] = [e[n]]);

            return t;
          }(e.headers);

          if (V.isRedirect(e.statusCode)) {
            const r = t.get("Location"),
                  o = null === r ? null : G(u.url, r);

            switch (u.redirect) {
              case "error":
                return i(new h(`redirect mode is set to error: ${u.url}`, "no-redirect")), void v();

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
                const r = {
                  headers: new A(u.headers),
                  follow: u.follow,
                  counter: u.counter + 1,
                  agent: u.agent,
                  compress: u.compress,
                  method: u.method,
                  body: u.body,
                  signal: u.signal,
                  timeout: u.timeout
                };
                return 303 !== e.statusCode && u.body && null === _(u) ? (i(new h("Cannot follow redirect with body being a readable stream", "unsupported-redirect")), void v()) : (303 !== e.statusCode && (301 !== e.statusCode && 302 !== e.statusCode || "POST" !== u.method) || (r.method = "GET", r.body = void 0, r.headers.delete("content-length")), n(V(new J(o, r))), void v());
            }
          }

          e.once("end", function () {
            f && f.removeEventListener("abort", y);
          });
          let r = e.pipe(new H());
          const o = {
            url: u.url,
            status: e.statusCode,
            statusText: e.statusMessage,
            headers: t,
            size: u.size,
            timeout: u.timeout,
            counter: u.counter
          },
                s = t.get("Content-Encoding");
          if (!u.compress || "HEAD" === u.method || null === s || 204 === e.statusCode || 304 === e.statusCode) return p = new z(r, o), void n(p);
          const c = {
            flush: a.Z_SYNC_FLUSH,
            finishFlush: a.Z_SYNC_FLUSH
          };
          if ("gzip" == s || "x-gzip" == s) return r = r.pipe(a.createGunzip(c)), p = new z(r, o), void n(p);

          if ("deflate" != s && "x-deflate" != s) {
            if ("br" == s && "function" == typeof a.createBrotliDecompress) return r = r.pipe(a.createBrotliDecompress()), p = new z(r, o), void n(p);
            p = new z(r, o), n(p);
          } else {
            e.pipe(new H()).once("data", function (e) {
              r = 8 == (15 & e[0]) ? r.pipe(a.createInflate()) : r.pipe(a.createInflateRaw()), p = new z(r, o), n(p);
            });
          }
        }), function (e, t) {
          const n = t.body;
          null === n ? e.end() : m(n) ? n.stream().pipe(e) : Buffer.isBuffer(n) ? (e.write(n), e.end()) : n.pipe(e);
        }(g, u);
      });
    }

    V.isRedirect = function (e) {
      return 301 === e || 302 === e || 303 === e || 307 === e || 308 === e;
    }, V.Promise = global.Promise, t.default = V;
  }, function (e, t, n) {
    (function (e) {
      var n = 200,
          r = "__lodash_hash_undefined__",
          o = 800,
          i = 16,
          s = 9007199254740991,
          a = "[object Arguments]",
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
      b["[object Float32Array]"] = b["[object Float64Array]"] = b["[object Int8Array]"] = b["[object Int16Array]"] = b["[object Int32Array]"] = b["[object Uint8Array]"] = b["[object Uint8ClampedArray]"] = b["[object Uint16Array]"] = b["[object Uint32Array]"] = !0, b[a] = b["[object Array]"] = b["[object ArrayBuffer]"] = b["[object Boolean]"] = b["[object DataView]"] = b["[object Date]"] = b["[object Error]"] = b[c] = b["[object Map]"] = b["[object Number]"] = b[h] = b["[object RegExp]"] = b["[object Set]"] = b["[object String]"] = b["[object WeakMap]"] = !1;

      var v = "object" == typeof global && global && global.Object === Object && global,
          m = "object" == typeof self && self && self.Object === Object && self,
          w = v || m || Function("return this")(),
          j = t && !t.nodeType && t,
          _ = j && "object" == typeof e && e && !e.nodeType && e,
          S = _ && _.exports === j,
          O = S && v.process,
          E = function () {
        try {
          var e = _ && _.require && _.require("util").types;

          return e || O && O.binding && O.binding("util");
        } catch (e) {}
      }(),
          P = E && E.isTypedArray;

      function T(e, t, n) {
        switch (n.length) {
          case 0:
            return e.call(t);

          case 1:
            return e.call(t, n[0]);

          case 2:
            return e.call(t, n[0], n[1]);

          case 3:
            return e.call(t, n[0], n[1], n[2]);
        }

        return e.apply(t, n);
      }

      var x,
          A,
          k,
          B = Array.prototype,
          F = Function.prototype,
          L = Object.prototype,
          C = w["__core-js_shared__"],
          I = F.toString,
          $ = L.hasOwnProperty,
          z = (x = /[^.]+$/.exec(C && C.keys && C.keys.IE_PROTO || "")) ? "Symbol(src)_1." + x : "",
          R = L.toString,
          N = I.call(Object),
          U = RegExp("^" + I.call($).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"),
          D = S ? w.Buffer : void 0,
          q = w.Symbol,
          J = w.Uint8Array,
          M = D ? D.allocUnsafe : void 0,
          H = (A = Object.getPrototypeOf, k = Object, function (e) {
        return A(k(e));
      }),
          G = Object.create,
          V = L.propertyIsEnumerable,
          K = B.splice,
          Z = q ? q.toStringTag : void 0,
          Y = function () {
        try {
          var e = je(Object, "defineProperty");
          return e({}, "", {}), e;
        } catch (e) {}
      }(),
          W = D ? D.isBuffer : void 0,
          X = Math.max,
          Q = Date.now,
          ee = je(w, "Map"),
          te = je(Object, "create"),
          ne = function () {
        function e() {}

        return function (t) {
          if (!Le(t)) return {};
          if (G) return G(t);
          e.prototype = t;
          var n = new e();
          return e.prototype = void 0, n;
        };
      }();

      function re(e) {
        var t = -1,
            n = null == e ? 0 : e.length;

        for (this.clear(); ++t < n;) {
          var r = e[t];
          this.set(r[0], r[1]);
        }
      }

      function oe(e) {
        var t = -1,
            n = null == e ? 0 : e.length;

        for (this.clear(); ++t < n;) {
          var r = e[t];
          this.set(r[0], r[1]);
        }
      }

      function ie(e) {
        var t = -1,
            n = null == e ? 0 : e.length;

        for (this.clear(); ++t < n;) {
          var r = e[t];
          this.set(r[0], r[1]);
        }
      }

      function se(e) {
        var t = this.__data__ = new oe(e);
        this.size = t.size;
      }

      function ae(e, t) {
        var n = xe(e),
            r = !n && Te(e),
            o = !n && !r && ke(e),
            i = !n && !r && !o && Ie(e),
            s = n || r || o || i,
            a = s ? function (e, t) {
          for (var n = -1, r = Array(e); ++n < e;) r[n] = t(n);

          return r;
        }(e.length, String) : [],
            u = a.length;

        for (var c in e) !t && !$.call(e, c) || s && ("length" == c || o && ("offset" == c || "parent" == c) || i && ("buffer" == c || "byteLength" == c || "byteOffset" == c) || _e(c, u)) || a.push(c);

        return a;
      }

      function ue(e, t, n) {
        (void 0 === n || Pe(e[t], n)) && (void 0 !== n || t in e) || fe(e, t, n);
      }

      function ce(e, t, n) {
        var r = e[t];
        $.call(e, t) && Pe(r, n) && (void 0 !== n || t in e) || fe(e, t, n);
      }

      function le(e, t) {
        for (var n = e.length; n--;) if (Pe(e[n][0], t)) return n;

        return -1;
      }

      function fe(e, t, n) {
        "__proto__" == t && Y ? Y(e, t, {
          configurable: !0,
          enumerable: !0,
          value: n,
          writable: !0
        }) : e[t] = n;
      }

      re.prototype.clear = function () {
        this.__data__ = te ? te(null) : {}, this.size = 0;
      }, re.prototype.delete = function (e) {
        var t = this.has(e) && delete this.__data__[e];
        return this.size -= t ? 1 : 0, t;
      }, re.prototype.get = function (e) {
        var t = this.__data__;

        if (te) {
          var n = t[e];
          return n === r ? void 0 : n;
        }

        return $.call(t, e) ? t[e] : void 0;
      }, re.prototype.has = function (e) {
        var t = this.__data__;
        return te ? void 0 !== t[e] : $.call(t, e);
      }, re.prototype.set = function (e, t) {
        var n = this.__data__;
        return this.size += this.has(e) ? 0 : 1, n[e] = te && void 0 === t ? r : t, this;
      }, oe.prototype.clear = function () {
        this.__data__ = [], this.size = 0;
      }, oe.prototype.delete = function (e) {
        var t = this.__data__,
            n = le(t, e);
        return !(n < 0) && (n == t.length - 1 ? t.pop() : K.call(t, n, 1), --this.size, !0);
      }, oe.prototype.get = function (e) {
        var t = this.__data__,
            n = le(t, e);
        return n < 0 ? void 0 : t[n][1];
      }, oe.prototype.has = function (e) {
        return le(this.__data__, e) > -1;
      }, oe.prototype.set = function (e, t) {
        var n = this.__data__,
            r = le(n, e);
        return r < 0 ? (++this.size, n.push([e, t])) : n[r][1] = t, this;
      }, ie.prototype.clear = function () {
        this.size = 0, this.__data__ = {
          hash: new re(),
          map: new (ee || oe)(),
          string: new re()
        };
      }, ie.prototype.delete = function (e) {
        var t = we(this, e).delete(e);
        return this.size -= t ? 1 : 0, t;
      }, ie.prototype.get = function (e) {
        return we(this, e).get(e);
      }, ie.prototype.has = function (e) {
        return we(this, e).has(e);
      }, ie.prototype.set = function (e, t) {
        var n = we(this, e),
            r = n.size;
        return n.set(e, t), this.size += n.size == r ? 0 : 1, this;
      }, se.prototype.clear = function () {
        this.__data__ = new oe(), this.size = 0;
      }, se.prototype.delete = function (e) {
        var t = this.__data__,
            n = t.delete(e);
        return this.size = t.size, n;
      }, se.prototype.get = function (e) {
        return this.__data__.get(e);
      }, se.prototype.has = function (e) {
        return this.__data__.has(e);
      }, se.prototype.set = function (e, t) {
        var r = this.__data__;

        if (r instanceof oe) {
          var o = r.__data__;
          if (!ee || o.length < n - 1) return o.push([e, t]), this.size = ++r.size, this;
          r = this.__data__ = new ie(o);
        }

        return r.set(e, t), this.size = r.size, this;
      };

      var he,
          pe = function (e, t, n) {
        for (var r = -1, o = Object(e), i = n(e), s = i.length; s--;) {
          var a = i[he ? s : ++r];
          if (!1 === t(o[a], a, o)) break;
        }

        return e;
      };

      function de(e) {
        return null == e ? void 0 === e ? d : f : Z && Z in Object(e) ? function (e) {
          var t = $.call(e, Z),
              n = e[Z];

          try {
            e[Z] = void 0;
            var r = !0;
          } catch (e) {}

          var o = R.call(e);
          r && (t ? e[Z] = n : delete e[Z]);
          return o;
        }(e) : function (e) {
          return R.call(e);
        }(e);
      }

      function ye(e) {
        return Ce(e) && de(e) == a;
      }

      function ge(e) {
        return !(!Le(e) || function (e) {
          return !!z && z in e;
        }(e)) && (Be(e) ? U : y).test(function (e) {
          if (null != e) {
            try {
              return I.call(e);
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
          if (null != e) for (var n in Object(e)) t.push(n);
          return t;
        }(e);
        var t = Se(e),
            n = [];

        for (var r in e) ("constructor" != r || !t && $.call(e, r)) && n.push(r);

        return n;
      }

      function ve(e, t, n, r, o) {
        e !== t && pe(t, function (i, s) {
          if (o || (o = new se()), Le(i)) !function (e, t, n, r, o, i, s) {
            var a = Oe(e, n),
                u = Oe(t, n),
                c = s.get(u);
            if (c) return void ue(e, n, c);
            var l = i ? i(a, u, n + "", e, t, s) : void 0,
                f = void 0 === l;

            if (f) {
              var p = xe(u),
                  d = !p && ke(u),
                  y = !p && !d && Ie(u);
              l = u, p || d || y ? xe(a) ? l = a : Ce(w = a) && Ae(w) ? l = function (e, t) {
                var n = -1,
                    r = e.length;
                t || (t = Array(r));

                for (; ++n < r;) t[n] = e[n];

                return t;
              }(a) : d ? (f = !1, l = function (e, t) {
                if (t) return e.slice();
                var n = e.length,
                    r = M ? M(n) : new e.constructor(n);
                return e.copy(r), r;
              }(u, !0)) : y ? (f = !1, g = u, b = !0 ? (v = g.buffer, m = new v.constructor(v.byteLength), new J(m).set(new J(v)), m) : g.buffer, l = new g.constructor(b, g.byteOffset, g.length)) : l = [] : function (e) {
                if (!Ce(e) || de(e) != h) return !1;
                var t = H(e);
                if (null === t) return !0;
                var n = $.call(t, "constructor") && t.constructor;
                return "function" == typeof n && n instanceof n && I.call(n) == N;
              }(u) || Te(u) ? (l = a, Te(a) ? l = function (e) {
                return function (e, t, n, r) {
                  var o = !n;
                  n || (n = {});
                  var i = -1,
                      s = t.length;

                  for (; ++i < s;) {
                    var a = t[i],
                        u = r ? r(n[a], e[a], a, n, e) : void 0;
                    void 0 === u && (u = e[a]), o ? fe(n, a, u) : ce(n, a, u);
                  }

                  return n;
                }(e, $e(e));
              }(a) : Le(a) && !Be(a) || (l = function (e) {
                return "function" != typeof e.constructor || Se(e) ? {} : ne(H(e));
              }(u))) : f = !1;
            }

            var g, b, v, m;
            var w;
            f && (s.set(u, l), o(l, u, r, i, s), s.delete(u));
            ue(e, n, l);
          }(e, t, s, n, ve, r, o);else {
            var a = r ? r(Oe(e, s), i, s + "", e, t, o) : void 0;
            void 0 === a && (a = i), ue(e, s, a);
          }
        }, $e);
      }

      function me(e, t) {
        return Ee(function (e, t, n) {
          return t = X(void 0 === t ? e.length - 1 : t, 0), function () {
            for (var r = arguments, o = -1, i = X(r.length - t, 0), s = Array(i); ++o < i;) s[o] = r[t + o];

            o = -1;

            for (var a = Array(t + 1); ++o < t;) a[o] = r[o];

            return a[t] = n(s), T(e, this, a);
          };
        }(e, t, Ne), e + "");
      }

      function we(e, t) {
        var n,
            r,
            o = e.__data__;
        return ("string" == (r = typeof (n = t)) || "number" == r || "symbol" == r || "boolean" == r ? "__proto__" !== n : null === n) ? o["string" == typeof t ? "string" : "hash"] : o.map;
      }

      function je(e, t) {
        var n = function (e, t) {
          return null == e ? void 0 : e[t];
        }(e, t);

        return ge(n) ? n : void 0;
      }

      function _e(e, t) {
        var n = typeof e;
        return !!(t = null == t ? s : t) && ("number" == n || "symbol" != n && g.test(e)) && e > -1 && e % 1 == 0 && e < t;
      }

      function Se(e) {
        var t = e && e.constructor;
        return e === ("function" == typeof t && t.prototype || L);
      }

      function Oe(e, t) {
        if (("constructor" !== t || "function" != typeof e[t]) && "__proto__" != t) return e[t];
      }

      var Ee = function (e) {
        var t = 0,
            n = 0;
        return function () {
          var r = Q(),
              s = i - (r - n);

          if (n = r, s > 0) {
            if (++t >= o) return arguments[0];
          } else t = 0;

          return e.apply(void 0, arguments);
        };
      }(Y ? function (e, t) {
        return Y(e, "toString", {
          configurable: !0,
          enumerable: !1,
          value: (n = t, function () {
            return n;
          }),
          writable: !0
        });
        var n;
      } : Ne);

      function Pe(e, t) {
        return e === t || e != e && t != t;
      }

      var Te = ye(function () {
        return arguments;
      }()) ? ye : function (e) {
        return Ce(e) && $.call(e, "callee") && !V.call(e, "callee");
      },
          xe = Array.isArray;

      function Ae(e) {
        return null != e && Fe(e.length) && !Be(e);
      }

      var ke = W || function () {
        return !1;
      };

      function Be(e) {
        if (!Le(e)) return !1;
        var t = de(e);
        return t == c || t == l || t == u || t == p;
      }

      function Fe(e) {
        return "number" == typeof e && e > -1 && e % 1 == 0 && e <= s;
      }

      function Le(e) {
        var t = typeof e;
        return null != e && ("object" == t || "function" == t);
      }

      function Ce(e) {
        return null != e && "object" == typeof e;
      }

      var Ie = P ? function (e) {
        return function (t) {
          return e(t);
        };
      }(P) : function (e) {
        return Ce(e) && Fe(e.length) && !!b[de(e)];
      };

      function $e(e) {
        return Ae(e) ? ae(e, !0) : be(e);
      }

      var ze,
          Re = (ze = function (e, t, n) {
        ve(e, t, n);
      }, me(function (e, t) {
        var n = -1,
            r = t.length,
            o = r > 1 ? t[r - 1] : void 0,
            i = r > 2 ? t[2] : void 0;

        for (o = ze.length > 3 && "function" == typeof o ? (r--, o) : void 0, i && function (e, t, n) {
          if (!Le(n)) return !1;
          var r = typeof t;
          return !!("number" == r ? Ae(n) && _e(t, n.length) : "string" == r && (t in n)) && Pe(n[t], e);
        }(t[0], t[1], i) && (o = r < 3 ? void 0 : o, r = 1), e = Object(e); ++n < r;) {
          var s = t[n];
          s && ze(e, s, n, o);
        }

        return e;
      }));

      function Ne(e) {
        return e;
      }

      e.exports = Re;
    }).call(this, n(10)(e));
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
  }, function (e, t, n) {
    function r(e) {
      return (r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
        return typeof e;
      } : function (e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
      })(e);
    }

    function o(e, t) {
      var n = Object.keys(e);

      if (Object.getOwnPropertySymbols) {
        var r = Object.getOwnPropertySymbols(e);
        t && (r = r.filter(function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })), n.push.apply(n, r);
      }

      return n;
    }

    function i(e) {
      for (var t, n = 1; n < arguments.length; n++) t = null == arguments[n] ? {} : arguments[n], n % 2 ? o(t, !0).forEach(function (n) {
        a(e, n, t[n]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : o(t).forEach(function (n) {
        Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(t, n));
      });

      return e;
    }

    function s(e, t) {
      for (var n, r = 0; r < t.length; r++) (n = t[r]).enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n);
    }

    function a(e, t, n) {
      return t in e ? Object.defineProperty(e, t, {
        value: n,
        enumerable: !0,
        configurable: !0,
        writable: !0
      }) : e[t] = n, e;
    }

    var u,
        c,
        l = "https://api.bullet-train.io/api/v1/",
        f = n(12),
        h = function (e) {
      return "Attempted to " + e + " a user before calling flagsmith.init. Call flagsmith.init first, if you wish to prevent it sending a request for flags, call init with preventFetch:true.";
    },
        p = function () {
      function e(t) {
        var n = this;
        (function (e, t) {
          if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
        })(this, e), a(this, "getJSON", function (e, t, r) {
          var o = {
            method: t || "GET",
            body: r,
            headers: {
              "x-environment-key": n.environmentID
            }
          };
          return "GET" !== t && (o.headers["Content-Type"] = "application/json; charset=utf-8"), u(e, o).then(function (e) {
            return e.text().then(function (t) {
              var n = t;

              try {
                n = JSON.parse(t);
              } catch (e) {}

              return e.ok ? n : Promise.reject(n);
            });
          });
        }), a(this, "getFlags", function (e, t) {
          var r = n.onChange,
              o = n.onError,
              s = n.identity,
              a = n.api,
              u = (n.disableCache, !1),
              c = function (e, t) {
            var o = e.flags,
                s = e.traits,
                a = {},
                u = {};

            if (s = s || [], (o = o || []).forEach(function (e) {
              a[e.feature.name.toLowerCase().replace(/ /g, "_")] = {
                id: e.feature.id,
                enabled: e.enabled,
                value: e.feature_state_value
              };
            }), s.forEach(function (e) {
              u[e.trait_key.toLowerCase().replace(/ /g, "_")] = e.trait_value;
            }), n.oldFlags = i({}, n.flags), t) {
              var c = {};
              t.map(function (e) {
                c[e.name] = e;
              }), n.segments = c;
            }

            var l = f(n.flags, a),
                h = f(n.traits, u);
            n.flags = a, n.traits = u, n.updateStorage(), r && r(n.oldFlags, {
              isFromServer: !0,
              flagsChanged: !l,
              traitsChanged: !h
            });
          };

          return s ? Promise.all([n.getJSON(a + "identities/?identifier=" + encodeURIComponent(s))]).then(function (e) {
            c(e[0], e[1]);
          }).catch(function (e) {
            var t = e.message;
            o && o({
              message: t
            });
          }) : Promise.all([n.getJSON(a + "flags/")]).then(function (t) {
            c({
              flags: t[0]
            }, null), e && !u && (u = !0, e());
          }).catch(function (e) {
            t && !u && (u = !0, t(e)), o && o(e);
          });
        }), a(this, "analyticsFlags", function () {
          var e = n.api;
          if (0 !== Object.getOwnPropertyNames(n.evaluationEvent).length) return n.getJSON(e + "analytics/flags/", "POST", JSON.stringify(n.evaluationEvent)).then(function () {
            state = n.getState(), n.setState(i({}, state, {
              evaluationEvent: {}
            })), n.updateEventStorage();
          }).catch(function (e) {
            n.log("Exception fetching evaluationEvent", e);
          });
        }), a(this, "evaluateFlag", function (e) {
          n.sendFlagEvaluationEvents && e && (void 0 === n.evaluationEvent[e.id] && (n.evaluationEvent[e.id] = 0), n.evaluationEvent[e.id] += 1), n.updateEventStorage();
        }), a(this, "getValue", function (e) {
          var t = n.flags && n.flags[e],
              r = null;
          return t && (r = t.value), n.evaluateFlag(n.flags[e]), r;
        }), a(this, "getTrait", function (e) {
          return n.traits && n.traits[e];
        }), a(this, "setTrait", function (e, t) {
          var r = n.getJSON,
              o = n.identity,
              i = n.api;
          if (i) return r("".concat(i, "traits/"), "POST", JSON.stringify({
            identity: {
              identifier: o
            },
            trait_key: e,
            trait_value: t
          })).then(function () {
            n.initialised && n.getFlags();
          });
          console.error(h("setTrait"));
        }), a(this, "setTraits", function (e) {
          var t = n.getJSON,
              o = n.identity,
              i = n.api;

          if (i) {
            e && "object" === r(e) || console.error("Expected object for flagsmith.setTraits");
            var s = Object.keys(e).map(function (t) {
              return {
                identity: {
                  identifier: o
                },
                trait_key: t,
                trait_value: e[t]
              };
            });
            return t("".concat(i, "traits/bulk/"), "PUT", JSON.stringify(s)).then(function () {
              n.initialised && n.getFlags();
            });
          }

          console.error(h("setTraits"));
        }), a(this, "incrementTrait", function (e, t) {
          var r = n.getJSON,
              o = n.identity,
              i = n.api;
          return r("".concat(i, "traits/increment-value/"), "POST", JSON.stringify({
            trait_key: e,
            increment_by: t,
            identifier: o
          })).then(n.getFlags);
        }), a(this, "hasFeature", function (e) {
          var t = n.flags && n.flags[e],
              r = !1;
          return t && t.enabled && (r = !0), n.evaluateFlag(n.flags[e]), r;
        }), u = t.fetch ? t.fetch : global.fetch, c = t.AsyncStorage;
      }

      return function (e, t, n) {
        t && s(e.prototype, t), n && s(e, n);
      }(e, [{
        key: "init",
        value: function (e) {
          var t = this,
              n = e.environmentID,
              r = e.api,
              o = void 0 === r ? l : r,
              s = e.onChange,
              a = e.cacheFlags,
              u = e.onError,
              f = e.defaultFlags,
              h = e.preventFetch,
              p = e.enableLogs,
              d = e.sendFlagEvaluationEvents,
              y = e.AsyncStorage,
              g = e.state;
          return new Promise(function (e, r) {
            if (t.environmentID = n, t.api = o, t.interval = [], t.onChange = s, t.onError = u, t.enableLogs = p, t.sendFlagEvaluationEvents = !!d && d, t.flags = Object.assign({}, f) || {}, t.initialised = !0, t.ticks = 1e4, t.evaluationEvent = {}, t.timer = t.enableLogs ? new Date().valueOf() : null, y && (c = y), t.cacheFlags = void 0 !== c && a, t.setState(g), !n) throw r("Please specify a environment id"), "Please specify a environment id";
            t.sendFlagEvaluationEvents && (t.interval.push(setInterval(t.analyticsFlags, t.ticks)), c.getItem("BULLET_TRAIN_EVENT", function (e, n) {
              if (n) {
                var r = JSON.parse(n);
                r && (g = t.getState(), t.log("Retrieved events from cache", n), t.setState(i({}, g, {
                  evaluationEvent: r
                })));
              }
            })), a ? c.getItem("BULLET_TRAIN_DB", function (n, o) {
              if (o) try {
                var i = JSON.parse(o);
                i && i.api === t.api && i.environmentID === t.environmentID && (t.setState(i), t.log("Retrieved flags from cache", i)), t.flags ? (t.onChange && t.onChange(null, {
                  isFromServer: !1
                }), t.oldFlags = t.flags, e(), !h && t.getFlags(Promise.resolve, Promise.reject)) : !h && t.getFlags(e, r);
              } catch (e) {
                t.log("Exception fetching cached logs", e);
              } else h || t.getFlags(e, r);
            }) : !h && t.getFlags(e, r);
          });
        }
      }, {
        key: "getAllFlags",
        value: function () {
          return this.flags;
        }
      }, {
        key: "identify",
        value: function (e) {
          return this.identity = e, this.initialised && !this.interval.length ? this.getFlags() : Promise.resolve();
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
            for (var e = arguments.length, t = Array(e), n = 0; n < e; n++) t[n] = arguments[n];

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
          if (this.sendFlagEvaluationEvents) {
            var e = JSON.stringify(this.getState().evaluationEvent);
            this.log("Setting event storage", e), c.setItem("BULLET_TRAIN_EVENT", e);
          }
        }
      }, {
        key: "logout",
        value: function () {
          this.identity = null, this.segments = null, this.traits = null, this.initialised && !this.interval.length && this.getFlags();
        }
      }, {
        key: "startListening",
        value: function () {
          var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 1e3;
          this.interval.length || this.interval.push(setInterval(this.getFlags, e));
        }
      }, {
        key: "getSegments",
        value: function () {}
      }, {
        key: "stopListening",
        value: function () {
          this.interval.forEach(function (e) {
            clearInterval(e);
          });
        }
      }]), e;
    }();

    e.exports = function (e) {
      var t = e.fetch,
          n = e.AsyncStorage;
      return new p({
        fetch: t,
        AsyncStorage: n
      });
    };
  }, function (e, t, n) {
    "use strict";

    e.exports = function e(t, n) {
      if (t === n) return !0;

      if (t && n && "object" == typeof t && "object" == typeof n) {
        if (t.constructor !== n.constructor) return !1;
        var r, o, i;

        if (Array.isArray(t)) {
          if ((r = t.length) != n.length) return !1;

          for (o = r; 0 != o--;) if (!e(t[o], n[o])) return !1;

          return !0;
        }

        if (t.constructor === RegExp) return t.source === n.source && t.flags === n.flags;
        if (t.valueOf !== Object.prototype.valueOf) return t.valueOf() === n.valueOf();
        if (t.toString !== Object.prototype.toString) return t.toString() === n.toString();
        if ((r = (i = Object.keys(t)).length) !== Object.keys(n).length) return !1;

        for (o = r; 0 != o--;) if (!Object.prototype.hasOwnProperty.call(n, i[o])) return !1;

        for (o = r; 0 != o--;) {
          var s = i[o];
          if (!e(t[s], n[s])) return !1;
        }

        return !0;
      }

      return t != t && n != n;
    };
  }]);
});
