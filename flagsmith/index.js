!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).flagsmith={})}(this,(function(t){"use strict";function e(t,e){return e=e||{},new Promise((function(n,r){var i=new XMLHttpRequest,a=[],o=[],s={},u=function(){return{ok:2==(i.status/100|0),statusText:i.statusText,status:i.status,url:i.responseURL,text:function(){return Promise.resolve(i.responseText)},json:function(){return Promise.resolve(i.responseText).then(JSON.parse)},blob:function(){return Promise.resolve(new Blob([i.response]))},clone:u,headers:{keys:function(){return a},entries:function(){return o},get:function(t){return s[t.toLowerCase()]},has:function(t){return t.toLowerCase()in s}}}};for(var l in i.open(e.method||"get",t,!0),i.onload=function(){i.getAllResponseHeaders().replace(/^(.*?):[^\S\n]*([\s\S]*?)$/gm,(function(t,e,n){a.push(e=e.toLowerCase()),o.push([e,n]),s[e]=s[e]?s[e]+","+n:n})),n(u())},i.onerror=r,i.withCredentials="include"==e.credentials,e.headers)i.setRequestHeader(l,e.headers[l]);i.send(e.body||null)}))}var n="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},r={},i={exports:{}};!function(t,e){var r="__lodash_hash_undefined__",i=9007199254740991,a="[object Arguments]",o="[object Function]",s="[object Object]",u=/^\[object .+?Constructor\]$/,l=/^(?:0|[1-9]\d*)$/,c={};c["[object Float32Array]"]=c["[object Float64Array]"]=c["[object Int8Array]"]=c["[object Int16Array]"]=c["[object Int32Array]"]=c["[object Uint8Array]"]=c["[object Uint8ClampedArray]"]=c["[object Uint16Array]"]=c["[object Uint32Array]"]=!0,c[a]=c["[object Array]"]=c["[object ArrayBuffer]"]=c["[object Boolean]"]=c["[object DataView]"]=c["[object Date]"]=c["[object Error]"]=c[o]=c["[object Map]"]=c["[object Number]"]=c[s]=c["[object RegExp]"]=c["[object Set]"]=c["[object String]"]=c["[object WeakMap]"]=!1;var f="object"==typeof n&&n&&n.Object===Object&&n,h="object"==typeof self&&self&&self.Object===Object&&self,g=f||h||Function("return this")(),v=e&&!e.nodeType&&e,p=v&&t&&!t.nodeType&&t,d=p&&p.exports===v,y=d&&f.process,b=function(){try{var t=p&&p.require&&p.require("util").types;return t||y&&y.binding&&y.binding("util")}catch(t){}}(),_=b&&b.isTypedArray;function m(t,e,n){switch(n.length){case 0:return t.call(e);case 1:return t.call(e,n[0]);case 2:return t.call(e,n[0],n[1]);case 3:return t.call(e,n[0],n[1],n[2])}return t.apply(e,n)}var O,S,w,j=Array.prototype,I=Function.prototype,A=Object.prototype,F=g["__core-js_shared__"],T=I.toString,E=A.hasOwnProperty,P=(O=/[^.]+$/.exec(F&&F.keys&&F.keys.IE_PROTO||""))?"Symbol(src)_1."+O:"",k=A.toString,C=T.call(Object),L=RegExp("^"+T.call(E).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),N=d?g.Buffer:void 0,D=g.Symbol,x=g.Uint8Array,J=N?N.allocUnsafe:void 0,z=(S=Object.getPrototypeOf,w=Object,function(t){return S(w(t))}),R=Object.create,U=A.propertyIsEnumerable,M=j.splice,G=D?D.toStringTag:void 0,B=function(){try{var t=pt(Object,"defineProperty");return t({},"",{}),t}catch(t){}}(),$=N?N.isBuffer:void 0,q=Math.max,H=Date.now,V=pt(g,"Map"),K=pt(Object,"create"),W=function(){function t(){}return function(e){if(!Ft(e))return{};if(R)return R(e);t.prototype=e;var n=new t;return t.prototype=void 0,n}}();function X(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1])}}function Y(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1])}}function Q(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1])}}function Z(t){var e=this.__data__=new Y(t);this.size=e.size}function tt(t,e){var n=St(t),r=!n&&Ot(t),i=!n&&!r&&jt(t),a=!n&&!r&&!i&&Et(t),o=n||r||i||a,s=o?function(t,e){for(var n=-1,r=Array(t);++n<t;)r[n]=e(n);return r}(t.length,String):[],u=s.length;for(var l in t)!e&&!E.call(t,l)||o&&("length"==l||i&&("offset"==l||"parent"==l)||a&&("buffer"==l||"byteLength"==l||"byteOffset"==l)||dt(l,u))||s.push(l);return s}function et(t,e,n){(void 0!==n&&!mt(t[e],n)||void 0===n&&!(e in t))&&it(t,e,n)}function nt(t,e,n){var r=t[e];E.call(t,e)&&mt(r,n)&&(void 0!==n||e in t)||it(t,e,n)}function rt(t,e){for(var n=t.length;n--;)if(mt(t[n][0],e))return n;return-1}function it(t,e,n){"__proto__"==e&&B?B(t,e,{configurable:!0,enumerable:!0,value:n,writable:!0}):t[e]=n}X.prototype.clear=function(){this.__data__=K?K(null):{},this.size=0},X.prototype.delete=function(t){var e=this.has(t)&&delete this.__data__[t];return this.size-=e?1:0,e},X.prototype.get=function(t){var e=this.__data__;if(K){var n=e[t];return n===r?void 0:n}return E.call(e,t)?e[t]:void 0},X.prototype.has=function(t){var e=this.__data__;return K?void 0!==e[t]:E.call(e,t)},X.prototype.set=function(t,e){var n=this.__data__;return this.size+=this.has(t)?0:1,n[t]=K&&void 0===e?r:e,this},Y.prototype.clear=function(){this.__data__=[],this.size=0},Y.prototype.delete=function(t){var e=this.__data__,n=rt(e,t);return!(n<0)&&(n==e.length-1?e.pop():M.call(e,n,1),--this.size,!0)},Y.prototype.get=function(t){var e=this.__data__,n=rt(e,t);return n<0?void 0:e[n][1]},Y.prototype.has=function(t){return rt(this.__data__,t)>-1},Y.prototype.set=function(t,e){var n=this.__data__,r=rt(n,t);return r<0?(++this.size,n.push([t,e])):n[r][1]=e,this},Q.prototype.clear=function(){this.size=0,this.__data__={hash:new X,map:new(V||Y),string:new X}},Q.prototype.delete=function(t){var e=vt(this,t).delete(t);return this.size-=e?1:0,e},Q.prototype.get=function(t){return vt(this,t).get(t)},Q.prototype.has=function(t){return vt(this,t).has(t)},Q.prototype.set=function(t,e){var n=vt(this,t),r=n.size;return n.set(t,e),this.size+=n.size==r?0:1,this},Z.prototype.clear=function(){this.__data__=new Y,this.size=0},Z.prototype.delete=function(t){var e=this.__data__,n=e.delete(t);return this.size=e.size,n},Z.prototype.get=function(t){return this.__data__.get(t)},Z.prototype.has=function(t){return this.__data__.has(t)},Z.prototype.set=function(t,e){var n=this.__data__;if(n instanceof Y){var r=n.__data__;if(!V||r.length<199)return r.push([t,e]),this.size=++n.size,this;n=this.__data__=new Q(r)}return n.set(t,e),this.size=n.size,this};var at,ot=function(t,e,n){for(var r=-1,i=Object(t),a=n(t),o=a.length;o--;){var s=a[at?o:++r];if(!1===e(i[s],s,i))break}return t};function st(t){return null==t?void 0===t?"[object Undefined]":"[object Null]":G&&G in Object(t)?function(t){var e=E.call(t,G),n=t[G];try{t[G]=void 0;var r=!0}catch(t){}var i=k.call(t);r&&(e?t[G]=n:delete t[G]);return i}(t):function(t){return k.call(t)}(t)}function ut(t){return Tt(t)&&st(t)==a}function lt(t){return!(!Ft(t)||function(t){return!!P&&P in t}(t))&&(It(t)?L:u).test(function(t){if(null!=t){try{return T.call(t)}catch(t){}try{return t+""}catch(t){}}return""}(t))}function ct(t){if(!Ft(t))return function(t){var e=[];if(null!=t)for(var n in Object(t))e.push(n);return e}(t);var e=yt(t),n=[];for(var r in t)("constructor"!=r||!e&&E.call(t,r))&&n.push(r);return n}function ft(t,e,n,r,i){t!==e&&ot(e,(function(a,o){if(i||(i=new Z),Ft(a))!function(t,e,n,r,i,a,o){var u=bt(t,n),l=bt(e,n),c=o.get(l);if(c)return void et(t,n,c);var f=a?a(u,l,n+"",t,e,o):void 0,h=void 0===f;if(h){var g=St(l),v=!g&&jt(l),p=!g&&!v&&Et(l);f=l,g||v||p?St(u)?f=u:Tt(m=u)&&wt(m)?f=function(t,e){var n=-1,r=t.length;e||(e=Array(r));for(;++n<r;)e[n]=t[n];return e}(u):v?(h=!1,f=function(t,e){if(e)return t.slice();var n=t.length,r=J?J(n):new t.constructor(n);return t.copy(r),r}(l,!0)):p?(h=!1,d=l,y=!0?(b=d.buffer,_=new b.constructor(b.byteLength),new x(_).set(new x(b)),_):d.buffer,f=new d.constructor(y,d.byteOffset,d.length)):f=[]:function(t){if(!Tt(t)||st(t)!=s)return!1;var e=z(t);if(null===e)return!0;var n=E.call(e,"constructor")&&e.constructor;return"function"==typeof n&&n instanceof n&&T.call(n)==C}(l)||Ot(l)?(f=u,Ot(u)?f=function(t){return function(t,e,n,r){var i=!n;n||(n={});var a=-1,o=e.length;for(;++a<o;){var s=e[a],u=r?r(n[s],t[s],s,n,t):void 0;void 0===u&&(u=t[s]),i?it(n,s,u):nt(n,s,u)}return n}(t,Pt(t))}(u):Ft(u)&&!It(u)||(f=function(t){return"function"!=typeof t.constructor||yt(t)?{}:W(z(t))}(l))):h=!1}var d,y,b,_;var m;h&&(o.set(l,f),i(f,l,r,a,o),o.delete(l));et(t,n,f)}(t,e,o,n,ft,r,i);else{var u=r?r(bt(t,o),a,o+"",t,e,i):void 0;void 0===u&&(u=a),et(t,o,u)}}),Pt)}function ht(t,e){return _t(function(t,e,n){return e=q(void 0===e?t.length-1:e,0),function(){for(var r=arguments,i=-1,a=q(r.length-e,0),o=Array(a);++i<a;)o[i]=r[e+i];i=-1;for(var s=Array(e+1);++i<e;)s[i]=r[i];return s[e]=n(o),m(t,this,s)}}(t,e,Lt),t+"")}var gt=B?function(t,e){return B(t,"toString",{configurable:!0,enumerable:!1,value:(n=e,function(){return n}),writable:!0});var n}:Lt;function vt(t,e){var n,r,i=t.__data__;return("string"==(r=typeof(n=e))||"number"==r||"symbol"==r||"boolean"==r?"__proto__"!==n:null===n)?i["string"==typeof e?"string":"hash"]:i.map}function pt(t,e){var n=function(t,e){return null==t?void 0:t[e]}(t,e);return lt(n)?n:void 0}function dt(t,e){var n=typeof t;return!!(e=null==e?i:e)&&("number"==n||"symbol"!=n&&l.test(t))&&t>-1&&t%1==0&&t<e}function yt(t){var e=t&&t.constructor;return t===("function"==typeof e&&e.prototype||A)}function bt(t,e){if(("constructor"!==e||"function"!=typeof t[e])&&"__proto__"!=e)return t[e]}var _t=function(t){var e=0,n=0;return function(){var r=H(),i=16-(r-n);if(n=r,i>0){if(++e>=800)return arguments[0]}else e=0;return t.apply(void 0,arguments)}}(gt);function mt(t,e){return t===e||t!=t&&e!=e}var Ot=ut(function(){return arguments}())?ut:function(t){return Tt(t)&&E.call(t,"callee")&&!U.call(t,"callee")},St=Array.isArray;function wt(t){return null!=t&&At(t.length)&&!It(t)}var jt=$||function(){return!1};function It(t){if(!Ft(t))return!1;var e=st(t);return e==o||"[object GeneratorFunction]"==e||"[object AsyncFunction]"==e||"[object Proxy]"==e}function At(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=i}function Ft(t){var e=typeof t;return null!=t&&("object"==e||"function"==e)}function Tt(t){return null!=t&&"object"==typeof t}var Et=_?function(t){return function(e){return t(e)}}(_):function(t){return Tt(t)&&At(t.length)&&!!c[st(t)]};function Pt(t){return wt(t)?tt(t,!0):ct(t)}var kt,Ct=(kt=function(t,e,n){ft(t,e,n)},ht((function(t,e){var n=-1,r=e.length,i=r>1?e[r-1]:void 0,a=r>2?e[2]:void 0;for(i=kt.length>3&&"function"==typeof i?(r--,i):void 0,a&&function(t,e,n){if(!Ft(n))return!1;var r=typeof e;return!!("number"==r?wt(n)&&dt(e,n.length):"string"==r&&e in n)&&mt(n[e],t)}(e[0],e[1],a)&&(i=r<3?void 0:i,r=1),t=Object(t);++n<r;){var o=e[n];o&&kt(t,o,n,i)}return t})));function Lt(t){return t}t.exports=Ct}(i,i.exports),Object.defineProperty(r,"__esModule",{value:!0});var a,o=function(t,e){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return function(t,e){var n=[],r=!0,i=!1,a=void 0;try{for(var o,s=t[Symbol.iterator]();!(r=(o=s.next()).done)&&(n.push(o.value),!e||n.length!==e);r=!0);}catch(t){i=!0,a=t}finally{try{!r&&s.return&&s.return()}finally{if(i)throw a}}return n}(t,e);throw new TypeError("Invalid attempt to destructure non-iterable instance")},s=(a=i.exports)&&a.__esModule?a:{default:a};var u={getItem:function(t,e){return u.multiGet([t]).then((function(t){return t[0][1]})).then((function(t){return e&&e(null,t),t})).catch((function(t){return e&&e(t,null),t}))},setItem:function(t,e,n){return u.multiSet([[t,e]]).then((function(t){return n&&n(null,t),t})).catch((function(t){return n&&n(t,null),t}))},getAllKeys:function(t){return Promise.resolve(Object.keys(localStorage)).then((function(e){return t&&t(null,e),e})).catch((function(e){return t&&t(e,null),e}))},removeItem:function(t,e){return u.multiRemove([t]).then((function(){e&&e(null)})).catch((function(t){e&&e(t,null)}))},clear:function(){return new Promise((function(t){window.localStorage.clear(),t()}))},mergeItem:function(t,e){return u.multiMerge([[t,e]])},multiGet:function(t){return new Promise((function(e){e(t.reduce((function(t,e){return t.concat([[e,localStorage.getItem(e)]])}),[]))}))},multiSet:function(t){return new Promise((function(e,n){var r=[];return t.forEach((function(t){var e=o(t,2),n=e[0],i=e[1];try{localStorage.setItem(n,i)}catch(t){r.push(t)}})),r.length>0?n(r):e()}))},multiMerge:function(t){return new Promise((function(e,n){var r=[];return t.forEach((function(t){var e=o(t,2),n=e[0],i=e[1],a=localStorage.getItem(n);if(a)try{localStorage.setItem(n,JSON.stringify((0,s.default)(JSON.parse(a),JSON.parse(i))))}catch(t){r.push(t)}})),r.length>0?n(r):e()}))},multiRemove:function(t){return new Promise((function(e){t.forEach((function(t){return window.localStorage.removeItem(t)})),e()}))},flushGetRequests:function(){console.warn("AsyncStorage.flushGetRequests: Not supported on `web`")}},l=r.default=u,c=function(){return c=Object.assign||function(t){for(var e,n=1,r=arguments.length;n<r;n++)for(var i in e=arguments[n])Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t},c.apply(this,arguments)};function f(t,e,n){if(n||2===arguments.length)for(var r,i=0,a=e.length;i<a;i++)!r&&i in e||(r||(r=Array.prototype.slice.call(e,0,i)),r[i]=e[i]);return t.concat(r||Array.prototype.slice.call(e))}var h,g,v=function t(e,n){if(e===n)return!0;if(e&&n&&"object"==typeof e&&"object"==typeof n){if(e.constructor!==n.constructor)return!1;var r,i,a;if(Array.isArray(e)){if((r=e.length)!=n.length)return!1;for(i=r;0!=i--;)if(!t(e[i],n[i]))return!1;return!0}if(e.constructor===RegExp)return e.source===n.source&&e.flags===n.flags;if(e.valueOf!==Object.prototype.valueOf)return e.valueOf()===n.valueOf();if(e.toString!==Object.prototype.toString)return e.toString()===n.toString();if((r=(a=Object.keys(e)).length)!==Object.keys(n).length)return!1;for(i=r;0!=i--;)if(!Object.prototype.hasOwnProperty.call(n,a[i]))return!1;for(i=r;0!=i--;){var o=a[i];if(!t(e[o],n[o]))return!1}return!0}return e!=e&&n!=n},p=void 0!==p?p:"undefined"!=typeof window?window:{},d="BULLET_TRAIN_DB",y="BULLET_TRAIN_EVENT",b="https://edge.api.flagsmith.com/api/v1/",_=function(t){return"Attempted to "+t+" a user before calling flagsmith.init. Call flagsmith.init first, if you wish to prevent it sending a request for flags, call init with preventFetch:true."},m=function(){function t(t){var e=this;this.getJSON=function(t,n,r){var i=e,a=i.environmentID,o=i.headers,s={method:n||"GET",body:r,headers:{"x-environment-key":a}};return n&&"GET"!==n&&(s.headers["Content-Type"]="application/json; charset=utf-8"),o&&Object.assign(s.headers,o),h(t,s).then((function(r){return e.log("Fetch response: "+r.status+" "+(n||"GET")+0+t),r.text().then((function(t){var e=t;try{e=JSON.parse(t)}catch(t){}return r.ok?e:Promise.reject(e)}))})).catch((function(t){e.log("Fetch error: "+t)}))},this.getFlags=function(t,n){var r=e,i=r.onChange,a=r.onError,o=r.identity,s=r.api,u=!1;e.log("Get Flags");var l=function(t){var n=t.flags,r=t.traits;o&&(e.withTraits=!1);var a={},s={};r=r||[],(n=n||[]).forEach((function(t){a[t.feature.name.toLowerCase().replace(/ /g,"_")]={id:t.feature.id,enabled:t.enabled,value:t.feature_state_value}})),r.forEach((function(t){s[t.trait_key.toLowerCase().replace(/ /g,"_")]=t.trait_value})),e.oldFlags=c({},e.flags);var u=v(e.flags,a),l=v(e.traits,s);if(e.flags=a,e.traits=s,e.updateStorage(),e.dtrum){var f={javaDouble:{},date:{},shortString:{},javaLongOrObject:{}};Object.keys(e.flags).map((function(t){S(f,"flagsmith_value_"+t,e.getValue(t)),S(f,"flagsmith_enabled_"+t,e.hasFeature(t))})),Object.keys(e.traits).map((function(t){S(f,"flagsmith_trait_"+t,e.getTrait(t))})),e.log("Sending javaLongOrObject traits to dynatrace",f.javaLongOrObject),e.log("Sending date traits to dynatrace",f.date),e.log("Sending shortString traits to dynatrace",f.shortString),e.log("Sending javaDouble to dynatrace",f.javaDouble),e.dtrum.sendSessionProperties(f.javaLongOrObject,f.date,f.shortString,f.javaDouble)}e.trigger&&e.trigger(),i&&i(e.oldFlags,{isFromServer:!0,flagsChanged:!u,traitsChanged:!l})};return o?Promise.all([e.withTraits?e.getJSON(s+"identities/","POST",JSON.stringify({identifier:o,traits:Object.keys(e.withTraits).map((function(t){return{trait_key:t,trait_value:e.withTraits[t]}}))})):e.getJSON(s+"identities/?identifier="+encodeURIComponent(o))]).then((function(n){e.withTraits=!1,l(n[0]),t&&!u&&(u=!0,t())})).catch((function(t){var e=t.message;a&&a({message:e})})):Promise.all([e.getJSON(s+"flags/")]).then((function(e){l({flags:e[0],traits:null}),t&&!u&&(u=!0,t())})).catch((function(t){n&&!u&&(u=!0,n(t)),a&&a(t)}))},this.analyticsFlags=function(){var t=e.api;if(0!==Object.getOwnPropertyNames(e.evaluationEvent).length)return e.getJSON(t+"analytics/flags/","POST",JSON.stringify(e.evaluationEvent)).then((function(t){var n=e.getState();e.setState(c(c({},n),{evaluationEvent:{}})),e.updateEventStorage()})).catch((function(t){e.log("Exception fetching evaluationEvent",t)}))},this.analyticsInterval=null,this.api=null,this.cacheFlags=null,this.ts=null,this.enableAnalytics=null,this.enableLogs=null,this.environmentID=null,this.evaluationEvent=null,this.flags=null,this.getFlagInterval=null,this.headers=null,this.initialised=null,this.oldFlags=null,this.onChange=null,this.onError=null,this.trigger=null,this.identity=null,this.ticks=null,this.timer=null,this.traits=null,this.dtrum=null,this.withTraits=null,this.cacheOptions={ttl:0,skipAPI:!1},this.evaluateFlag=function(t){if(e.enableAnalytics){if(!e.evaluationEvent)return;void 0===e.evaluationEvent[t]&&(e.evaluationEvent[t]=0),e.evaluationEvent[t]+=1}e.updateEventStorage()},this.getValue=function(t){var n=e.flags&&e.flags[t.toLowerCase().replace(/ /g,"_")],r=null;return n&&(r=n.value),e.evaluateFlag(t),r},this.getTrait=function(t){return e.traits&&e.traits[t.toLowerCase().replace(/ /g,"_")]},this.setTrait=function(t,n){var r=e,i=r.getJSON,a=r.identity,o=r.api;if(o){var s={};if(s[t]=n,!e.identity)return e.withTraits=c(c({},e.withTraits||{}),s),void e.log("Set trait prior to identifying",e.withTraits);var u={identity:{identifier:a},trait_key:t,trait_value:n};return i("".concat(o,"traits/"),"POST",JSON.stringify(u)).then((function(){e.initialised&&e.getFlags()}))}console.error(_("setTrait"))},this.setTraits=function(t){var n=e;n.getJSON;var r=n.identity,i=n.api;if(i)return t&&"object"==typeof t||console.error("Expected object for flagsmith.setTraits"),e.identity?e.getJSON(i+"identities/","POST",JSON.stringify({identifier:r,traits:Object.keys(t).map((function(e){return{trait_key:e,trait_value:t[e]}}))})).then((function(){e.initialised&&e.getFlags()})):(e.withTraits=c(c({},e.withTraits||{}),t),void e.log("Set traits prior to identifying",e.withTraits));console.error(_("setTraits"))},this.hasFeature=function(t){var n=e.flags&&e.flags[t.toLowerCase().replace(/ /g,"_")],r=!1;return n&&n.enabled&&(r=!0),e.evaluateFlag(t),r},h=t.fetch?t.fetch:"undefined"!=typeof fetch?fetch:p.fetch,g=t.AsyncStorage}return t.prototype.init=function(t){var e=this,n=t.environmentID,r=t.api,i=void 0===r?b:r,a=t.headers,o=t.onChange,s=t.cacheFlags,u=t.onError,l=t.defaultFlags,f=t.fetch,v=t.preventFetch,p=t.enableLogs,_=t.enableDynatrace,m=t.enableAnalytics,O=t.AsyncStorage,S=t.identity,w=t.traits,j=t._trigger,I=t.state,A=t.cacheOptions,F=t.angularHttpClient;return new Promise((function(t,r){if(e.environmentID=n,e.api=i,e.headers=a,e.getFlagInterval=null,e.analyticsInterval=null,e.onChange=o,e.trigger=j,e.onError=u,e.identity=S,e.withTraits=w,e.enableLogs=p,e.cacheOptions=A?{skipAPI:!!A.skipAPI,ttl:A.ttl||0}:e.cacheOptions,!e.cacheOptions.ttl&&e.cacheOptions.skipAPI&&console.warn("Flagsmith: you have set a cache ttl of 0 and are skipping API calls, this means the API will not be hit unless you clear local storage."),f&&(h=f),e.enableAnalytics=m||!1,e.flags=Object.assign({},l)||{},e.initialised=!0,e.ticks=1e4,e.log("Initialising with properties",{environmentID:n,api:i,headers:a,onChange:o,cacheFlags:s,onError:u,defaultFlags:l,preventFetch:v,enableLogs:p,enableAnalytics:m,AsyncStorage:g,identity:S,traits:w,_trigger:j,state:I,angularHttpClient:F},e),e.timer=e.enableLogs?(new Date).valueOf():null,O&&(g=O),e.cacheFlags=void 0!==g&&s,e.setState(I),!n)throw r("Please specify a environment id"),"Please specify a environment id";_&&("undefined"==typeof dtrum?console.error("You have attempted to enable dynatrace but dtrum is undefined, please check you have the Dynatrace RUM JavaScript API installed."):e.dtrum=dtrum),F&&(h=function(t,e){var n=e.headers,r=e.method,i=e.body;return new Promise((function(e){switch(r){case"GET":return F.get(t,{headers:n}).subscribe((function(t){e({ok:1,text:function(){return Promise.resolve(t)}})}));case"POST":case"PUT":return F.post(t,i,{headers:n}).subscribe((function(t){e({ok:1,text:function(){return Promise.resolve(t)}})}))}}))}),g&&"undefined"!=typeof window&&g.getItem(y).then((function(t){if(t)try{e.evaluationEvent=JSON.parse(t)}catch(t){e.evaluationEvent={}}else e.evaluationEvent={};return e.analyticsInterval=setInterval(e.analyticsFlags,e.ticks),!0})),e.enableAnalytics&&(e.analyticsInterval&&clearInterval(e.analyticsInterval),g&&"undefined"!=typeof window&&g.getItem(y,(function(t,n){if(n){var r=JSON.parse(n);r&&(I=e.getState(),e.log("Retrieved events from cache",n),e.setState(c(c({},I),{evaluationEvent:r})))}return!0}))),s?g&&"undefined"!=typeof window&&g.getItem(d,(function(n,i){if(i)try{var a=JSON.parse(i),o=!1;if(a&&a.api===e.api&&a.environmentID===e.environmentID){var s=!0;e.cacheOptions.ttl&&(!a.ts||(new Date).valueOf()-a.ts>e.cacheOptions.ttl)&&a.ts&&(e.log("Ignoring cache, timestamp is too old ts:"+a.ts+" ttl: "+e.cacheOptions.ttl+" time elapsed since cache: "+((new Date).valueOf()-a.ts)+"ms"),s=!1),s&&(o=!0,e.setState(a),e.log("Retrieved flags from cache",a))}e.flags?(e.trigger&&e.trigger(),e.onChange&&e.onChange(null,{isFromServer:!1}),e.oldFlags=e.flags,t(!0),e.cacheOptions.skipAPI&&o&&e.log("Skipping API, using cache"),v||e.cacheOptions.skipAPI&&o||e.getFlags()):v?t(!0):e.getFlags(t,r)}catch(t){e.log("Exception fetching cached logs",t)}else v?(l&&(e.trigger&&e.trigger(),e.onChange&&e.onChange(null,{isFromServer:!1})),t(!0)):e.getFlags(t,r);return!0})):v?(l&&(e.trigger&&e.trigger(),e.onChange&&e.onChange(null,{isFromServer:!1})),t(!0)):e.getFlags(t,r)})).catch((function(t){return u&&u(t)}))},t.prototype.getAllFlags=function(){return this.flags},t.prototype.identify=function(t,e){return this.identity=t,this.log("Identify: "+this.identity),e&&(this.withTraits=c(c({},this.withTraits||{}),e)),this.initialised?this.getFlags():Promise.resolve()},t.prototype.getState=function(){return{api:this.api,environmentID:this.environmentID,flags:this.flags,identity:this.identity,ts:this.ts,traits:this.traits,evaluationEvent:this.evaluationEvent}},t.prototype.setState=function(t){t&&(this.initialised=!0,this.api=t.api||this.api||b,this.environmentID=t.environmentID||this.environmentID,this.flags=t.flags||this.flags,this.identity=t.identity||this.identity,this.traits=t.traits||this.traits,this.evaluationEvent=t.evaluationEvent||this.evaluationEvent)},t.prototype.log=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];this.enableLogs&&console.log.apply(this,f(["FLAGSMITH:",(new Date).valueOf()-this.timer,"ms"],t,!0))},t.prototype.updateStorage=function(){if(this.cacheFlags){this.ts=(new Date).valueOf();var t=JSON.stringify(this.getState());this.log("Setting storage",t),g.setItem(d,t)}},t.prototype.updateEventStorage=function(){if(this.enableAnalytics){var t=JSON.stringify(this.getState().evaluationEvent);this.log("Setting event storage",t),g.setItem(y,t)}},t.prototype.logout=function(){return this.identity=null,this.traits=null,this.initialised?this.getFlags():Promise.resolve()},t.prototype.startListening=function(t){void 0===t&&(t=1e3),this.getFlagInterval&&clearInterval(this.getFlagInterval),this.getFlagInterval=setInterval(this.getFlags,t)},t.prototype.stopListening=function(){clearInterval(this.getFlagInterval),this.getFlagInterval=null},t.prototype.getSegments=function(){},t}();function O(t){var e=t.fetch,n=t.AsyncStorage;return new m({fetch:e,AsyncStorage:n})}var S=function(t,e,n){var r="shortString",i=!0;"number"==typeof n&&(r="javaDouble",i=!1),t[r]=t[r]||{},t[r][e]=i?n+"":n},w=O({AsyncStorage:l,fetch:e});"undefined"!=typeof window&&(window.flagsmith=w);t.createFlagsmithInstance=function(){return O({AsyncStorage:l,fetch:e})},t.default=w,Object.defineProperty(t,"__esModule",{value:!0})}));
//# sourceMappingURL=index.js.map
