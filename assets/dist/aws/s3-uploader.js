!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.S3Uploader=e():t.S3Uploader=e()}(window,(function(){return function(t){var e={};function r(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)r.d(n,o,function(e){return t[e]}.bind(null,o));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=7)}([function(t,e,r){"use strict";var n=r(1),o="object"==typeof self&&self&&self.Object===Object&&self,i=n.a||o||Function("return this")();e.a=i},function(t,e,r){"use strict";(function(t){var r="object"==typeof t&&t&&t.Object===Object&&t;e.a=r}).call(this,r(8))},function(t,e,r){"use strict";(function(t){var n=r(0),o=r(5),i="object"==typeof exports&&exports&&!exports.nodeType&&exports,u=i&&"object"==typeof t&&t&&!t.nodeType&&t,a=u&&u.exports===i?n.a.Buffer:void 0,c=(a?a.isBuffer:void 0)||o.a;e.a=c}).call(this,r(3)(t))},function(t,e){t.exports=function(t){if(!t.webpackPolyfill){var e=Object.create(t);e.children||(e.children=[]),Object.defineProperty(e,"loaded",{enumerable:!0,get:function(){return e.l}}),Object.defineProperty(e,"id",{enumerable:!0,get:function(){return e.i}}),Object.defineProperty(e,"exports",{enumerable:!0}),e.webpackPolyfill=1}return e}},function(t,e,r){"use strict";(function(t){var n=r(1),o="object"==typeof exports&&exports&&!exports.nodeType&&exports,i=o&&"object"==typeof t&&t&&!t.nodeType&&t,u=i&&i.exports===o&&n.a.process,a=function(){try{var t=i&&i.require&&i.require("util").types;return t||u&&u.binding&&u.binding("util")}catch(t){}}();e.a=a}).call(this,r(3)(t))},function(t,e,r){"use strict";e.a=function(){return!1}},function(t,e,r){"use strict";(function(t){var n=r(0),o="object"==typeof exports&&exports&&!exports.nodeType&&exports,i=o&&"object"==typeof t&&t&&!t.nodeType&&t,u=i&&i.exports===o?n.a.Buffer:void 0,a=u?u.allocUnsafe:void 0;e.a=function(t,e){if(e)return t.slice();var r=t.length,n=a?a(r):new t.constructor(r);return t.copy(n),n}}).call(this,r(3)(t))},function(t,e,r){t.exports=r(9)},function(t,e){var r;r=function(){return this}();try{r=r||new Function("return this")()}catch(t){"object"==typeof window&&(r=window)}t.exports=r},function(t,e,r){"use strict";r.r(e),r.d(e,"getInstance",(function(){return Me})),r.d(e,"get",(function(){return $e})),r.d(e,"destroy",(function(){return Xe}));var n=function(t,e,r){switch(r.length){case 0:return t.call(e);case 1:return t.call(e,r[0]);case 2:return t.call(e,r[0],r[1]);case 3:return t.call(e,r[0],r[1],r[2])}return t.apply(e,r)};var o=function(t){return t},i=Math.max;var a=function(t,e,r){return e=i(void 0===e?t.length-1:e,0),function(){for(var o=arguments,u=-1,a=i(o.length-e,0),c=Array(a);++u<a;)c[u]=o[e+u];u=-1;for(var f=Array(e+1);++u<e;)f[u]=o[u];return f[e]=r(c),n(t,this,f)}};var c=function(t){return function(){return t}},f=r(0),s=f.a.Symbol,l=Object.prototype,p=l.hasOwnProperty,v=l.toString,y=s?s.toStringTag:void 0;var h=function(t){var e=p.call(t,y),r=t[y];try{t[y]=void 0;var n=!0}catch(t){}var o=v.call(t);return n&&(e?t[y]=r:delete t[y]),o},b=Object.prototype.toString;var d=function(t){return b.call(t)},_=s?s.toStringTag:void 0;var j=function(t){return null==t?void 0===t?"[object Undefined]":"[object Null]":_&&_ in Object(t)?h(t):d(t)};var g=function(t){var e=typeof t;return null!=t&&("object"==e||"function"==e)};var O,m=function(t){if(!g(t))return!1;var e=j(t);return"[object Function]"==e||"[object GeneratorFunction]"==e||"[object AsyncFunction]"==e||"[object Proxy]"==e},w=f.a["__core-js_shared__"],x=(O=/[^.]+$/.exec(w&&w.keys&&w.keys.IE_PROTO||""))?"Symbol(src)_1."+O:"";var P=function(t){return!!x&&x in t},S=Function.prototype.toString;var A=function(t){if(null!=t){try{return S.call(t)}catch(t){}try{return t+""}catch(t){}}return""},z=/^\[object .+?Constructor\]$/,T=Function.prototype,k=Object.prototype,F=T.toString,C=k.hasOwnProperty,U=RegExp("^"+F.call(C).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");var R=function(t){return!(!g(t)||P(t))&&(m(t)?U:z).test(A(t))};var E=function(t,e){return null==t?void 0:t[e]};var B=function(t,e){var r=E(t,e);return R(r)?r:void 0},D=function(){try{var t=B(Object,"defineProperty");return t({},"",{}),t}catch(t){}}(),I=D?function(t,e){return D(t,"toString",{configurable:!0,enumerable:!1,value:c(e),writable:!0})}:o,M=Date.now;var $=function(t){var e=0,r=0;return function(){var n=M(),o=16-(n-r);if(r=n,o>0){if(++e>=800)return arguments[0]}else e=0;return t.apply(void 0,arguments)}}(I);var X=function(t,e){return $(a(t,e,o),t+"")};var q=function(){this.__data__=[],this.size=0};var H=function(t,e){return t===e||t!=t&&e!=e};var L=function(t,e){for(var r=t.length;r--;)if(H(t[r][0],e))return r;return-1},N=Array.prototype.splice;var G=function(t){var e=this.__data__,r=L(e,t);return!(r<0)&&(r==e.length-1?e.pop():N.call(e,r,1),--this.size,!0)};var V=function(t){var e=this.__data__,r=L(e,t);return r<0?void 0:e[r][1]};var W=function(t){return L(this.__data__,t)>-1};var J=function(t,e){var r=this.__data__,n=L(r,t);return n<0?(++this.size,r.push([t,e])):r[n][1]=e,this};function K(t){var e=-1,r=null==t?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}K.prototype.clear=q,K.prototype.delete=G,K.prototype.get=V,K.prototype.has=W,K.prototype.set=J;var Q=K;var Y=function(){this.__data__=new Q,this.size=0};var Z=function(t){var e=this.__data__,r=e.delete(t);return this.size=e.size,r};var tt=function(t){return this.__data__.get(t)};var et=function(t){return this.__data__.has(t)},rt=B(f.a,"Map"),nt=B(Object,"create");var ot=function(){this.__data__=nt?nt(null):{},this.size=0};var it=function(t){var e=this.has(t)&&delete this.__data__[t];return this.size-=e?1:0,e},ut=Object.prototype.hasOwnProperty;var at=function(t){var e=this.__data__;if(nt){var r=e[t];return"__lodash_hash_undefined__"===r?void 0:r}return ut.call(e,t)?e[t]:void 0},ct=Object.prototype.hasOwnProperty;var ft=function(t){var e=this.__data__;return nt?void 0!==e[t]:ct.call(e,t)};var st=function(t,e){var r=this.__data__;return this.size+=this.has(t)?0:1,r[t]=nt&&void 0===e?"__lodash_hash_undefined__":e,this};function lt(t){var e=-1,r=null==t?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}lt.prototype.clear=ot,lt.prototype.delete=it,lt.prototype.get=at,lt.prototype.has=ft,lt.prototype.set=st;var pt=lt;var vt=function(){this.size=0,this.__data__={hash:new pt,map:new(rt||Q),string:new pt}};var yt=function(t){var e=typeof t;return"string"==e||"number"==e||"symbol"==e||"boolean"==e?"__proto__"!==t:null===t};var ht=function(t,e){var r=t.__data__;return yt(e)?r["string"==typeof e?"string":"hash"]:r.map};var bt=function(t){var e=ht(this,t).delete(t);return this.size-=e?1:0,e};var dt=function(t){return ht(this,t).get(t)};var _t=function(t){return ht(this,t).has(t)};var jt=function(t,e){var r=ht(this,t),n=r.size;return r.set(t,e),this.size+=r.size==n?0:1,this};function gt(t){var e=-1,r=null==t?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}gt.prototype.clear=vt,gt.prototype.delete=bt,gt.prototype.get=dt,gt.prototype.has=_t,gt.prototype.set=jt;var Ot=gt;var mt=function(t,e){var r=this.__data__;if(r instanceof Q){var n=r.__data__;if(!rt||n.length<199)return n.push([t,e]),this.size=++r.size,this;r=this.__data__=new Ot(n)}return r.set(t,e),this.size=r.size,this};function wt(t){var e=this.__data__=new Q(t);this.size=e.size}wt.prototype.clear=Y,wt.prototype.delete=Z,wt.prototype.get=tt,wt.prototype.has=et,wt.prototype.set=mt;var xt=wt;var Pt=function(t,e,r){"__proto__"==e&&D?D(t,e,{configurable:!0,enumerable:!0,value:r,writable:!0}):t[e]=r};var St=function(t,e,r){(void 0!==r&&!H(t[e],r)||void 0===r&&!(e in t))&&Pt(t,e,r)};var At=function(t){return function(e,r,n){for(var o=-1,i=Object(e),u=n(e),a=u.length;a--;){var c=u[t?a:++o];if(!1===r(i[c],c,i))break}return e}}(),zt=r(6),Tt=f.a.Uint8Array;var kt=function(t){var e=new t.constructor(t.byteLength);return new Tt(e).set(new Tt(t)),e};var Ft=function(t,e){var r=e?kt(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.length)};var Ct=function(t,e){var r=-1,n=t.length;for(e||(e=Array(n));++r<n;)e[r]=t[r];return e},Ut=Object.create,Rt=function(){function t(){}return function(e){if(!g(e))return{};if(Ut)return Ut(e);t.prototype=e;var r=new t;return t.prototype=void 0,r}}();var Et=function(t,e){return function(r){return t(e(r))}}(Object.getPrototypeOf,Object),Bt=Object.prototype;var Dt=function(t){var e=t&&t.constructor;return t===("function"==typeof e&&e.prototype||Bt)};var It=function(t){return"function"!=typeof t.constructor||Dt(t)?{}:Rt(Et(t))};var Mt=function(t){return null!=t&&"object"==typeof t};var $t=function(t){return Mt(t)&&"[object Arguments]"==j(t)},Xt=Object.prototype,qt=Xt.hasOwnProperty,Ht=Xt.propertyIsEnumerable,Lt=$t(function(){return arguments}())?$t:function(t){return Mt(t)&&qt.call(t,"callee")&&!Ht.call(t,"callee")},Nt=Array.isArray;var Gt=function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=9007199254740991};var Vt=function(t){return null!=t&&Gt(t.length)&&!m(t)};var Wt=function(t){return Mt(t)&&Vt(t)},Jt=r(2),Kt=Function.prototype,Qt=Object.prototype,Yt=Kt.toString,Zt=Qt.hasOwnProperty,te=Yt.call(Object);var ee=function(t){if(!Mt(t)||"[object Object]"!=j(t))return!1;var e=Et(t);if(null===e)return!0;var r=Zt.call(e,"constructor")&&e.constructor;return"function"==typeof r&&r instanceof r&&Yt.call(r)==te},re={};re["[object Float32Array]"]=re["[object Float64Array]"]=re["[object Int8Array]"]=re["[object Int16Array]"]=re["[object Int32Array]"]=re["[object Uint8Array]"]=re["[object Uint8ClampedArray]"]=re["[object Uint16Array]"]=re["[object Uint32Array]"]=!0,re["[object Arguments]"]=re["[object Array]"]=re["[object ArrayBuffer]"]=re["[object Boolean]"]=re["[object DataView]"]=re["[object Date]"]=re["[object Error]"]=re["[object Function]"]=re["[object Map]"]=re["[object Number]"]=re["[object Object]"]=re["[object RegExp]"]=re["[object Set]"]=re["[object String]"]=re["[object WeakMap]"]=!1;var ne=function(t){return Mt(t)&&Gt(t.length)&&!!re[j(t)]};var oe=function(t){return function(e){return t(e)}},ie=r(4),ue=ie.a&&ie.a.isTypedArray,ae=ue?oe(ue):ne;var ce=function(t,e){if(("constructor"!==e||"function"!=typeof t[e])&&"__proto__"!=e)return t[e]},fe=Object.prototype.hasOwnProperty;var se=function(t,e,r){var n=t[e];fe.call(t,e)&&H(n,r)&&(void 0!==r||e in t)||Pt(t,e,r)};var le=function(t,e,r,n){var o=!r;r||(r={});for(var i=-1,u=e.length;++i<u;){var a=e[i],c=n?n(r[a],t[a],a,r,t):void 0;void 0===c&&(c=t[a]),o?Pt(r,a,c):se(r,a,c)}return r};var pe=function(t,e){for(var r=-1,n=Array(t);++r<t;)n[r]=e(r);return n},ve=/^(?:0|[1-9]\d*)$/;var ye=function(t,e){var r=typeof t;return!!(e=null==e?9007199254740991:e)&&("number"==r||"symbol"!=r&&ve.test(t))&&t>-1&&t%1==0&&t<e},he=Object.prototype.hasOwnProperty;var be=function(t,e){var r=Nt(t),n=!r&&Lt(t),o=!r&&!n&&Object(Jt.a)(t),i=!r&&!n&&!o&&ae(t),u=r||n||o||i,a=u?pe(t.length,String):[],c=a.length;for(var f in t)!e&&!he.call(t,f)||u&&("length"==f||o&&("offset"==f||"parent"==f)||i&&("buffer"==f||"byteLength"==f||"byteOffset"==f)||ye(f,c))||a.push(f);return a};var de=function(t){var e=[];if(null!=t)for(var r in Object(t))e.push(r);return e},_e=Object.prototype.hasOwnProperty;var je=function(t){if(!g(t))return de(t);var e=Dt(t),r=[];for(var n in t)("constructor"!=n||!e&&_e.call(t,n))&&r.push(n);return r};var ge=function(t){return Vt(t)?be(t,!0):je(t)};var Oe=function(t){return le(t,ge(t))};var me=function(t,e,r,n,o,i,u){var a=ce(t,r),c=ce(e,r),f=u.get(c);if(f)St(t,r,f);else{var s=i?i(a,c,r+"",t,e,u):void 0,l=void 0===s;if(l){var p=Nt(c),v=!p&&Object(Jt.a)(c),y=!p&&!v&&ae(c);s=c,p||v||y?Nt(a)?s=a:Wt(a)?s=Ct(a):v?(l=!1,s=Object(zt.a)(c,!0)):y?(l=!1,s=Ft(c,!0)):s=[]:ee(c)||Lt(c)?(s=a,Lt(a)?s=Oe(a):g(a)&&!m(a)||(s=It(c))):l=!1}l&&(u.set(c,s),o(s,c,n,i,u),u.delete(c)),St(t,r,s)}};var we=function t(e,r,n,o,i){e!==r&&At(r,(function(u,a){if(i||(i=new xt),g(u))me(e,r,a,n,t,o,i);else{var c=o?o(ce(e,a),u,a+"",e,r,i):void 0;void 0===c&&(c=u),St(e,a,c)}}),ge)};var xe=function t(e,r,n,o,i,u){return g(e)&&g(r)&&(u.set(r,e),we(e,r,void 0,t,u),u.delete(r)),e};var Pe=function(t,e,r){if(!g(r))return!1;var n=typeof e;return!!("number"==n?Vt(r)&&ye(e,r.length):"string"==n&&e in r)&&H(r[e],t)};var Se=function(t){return X((function(e,r){var n=-1,o=r.length,i=o>1?r[o-1]:void 0,u=o>2?r[2]:void 0;for(i=t.length>3&&"function"==typeof i?(o--,i):void 0,u&&Pe(r[0],r[1],u)&&(i=o<3?void 0:i,o=1),e=Object(e);++n<o;){var a=r[n];a&&t(e,a,n,i)}return e}))}((function(t,e,r,n){we(t,e,r,n)})),Ae=X((function(t){return t.push(void 0,xe),n(Se,void 0,t)}));function ze(t){return(ze="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function Te(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function ke(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function Fe(t,e){if(e&&("object"===ze(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t)}function Ce(t){return(Ce=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function Ue(t,e,r){return(Ue=Re()?Reflect.construct:function(t,e,r){var n=[null];n.push.apply(n,e);var o=new(Function.bind.apply(t,n));return r&&Ee(o,r.prototype),o}).apply(null,arguments)}function Re(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}function Ee(t,e){return(Ee=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}
/**
 * Part of datavideo project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */var Be={},De={},Ie={};function Me(t){if(!Be[t]){for(var e=arguments.length,r=new Array(e>1?e-1:0),n=1;n<e;n++)r[n-1]=arguments[n];Be[t]=Ue(Ne,[t].concat(r)),Ie[t]&&(Ie[t](Be[t]),delete Ie[t])}return Be[t]}function $e(t){return Be[t]?Promise.resolve(Be[t]):(De[t]||(De[t]=new Promise((function(e){Ie[t]=e}))),De[t])}function Xe(t){delete Be[t]}var qe,He,Le,Ne=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&Ee(t,e)}(c,t);var e,r,n,o,i,a=(e=c,r=Re(),function(){var t,n=Ce(e);if(r){var o=Ce(this).constructor;t=Reflect.construct(n,arguments,o)}else t=n.apply(this,arguments);return Fe(this,t)});function c(t){var e,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return Te(this,c),(e=a.call(this)).name=t,e.options=Ae({},r,e.constructor.defaultOptions),e}return n=c,i=[{key:"trimSlashes",value:function(t){return t.replace(/^\/+|\/+$/g,"")}}],(o=[{key:"upload",value:function(t,e){var r=this,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},o=new FormData,i=Ae({},this.options.formInputs);for(var a in"string"==typeof t&&(t=new Blob([t],{type:n["Content-Type"]||"text/plain"})),(t instanceof Blob||t instanceof File)&&(n["Content-Type"]=n["Content-Type"]||t.type),n.filename&&(n["Content-Disposition"]="attachment; filename*=UTF-8''"+encodeURIComponent(n.filename)),n.key=this.constructor.trimSlashes(this.options.subfolder)+"/"+this.constructor.trimSlashes(e),n.key=this.constructor.trimSlashes(n.key),n["Content-Type"]=n["Content-Type"]||null,n["Content-Disposition"]=n["Content-Disposition"]||null,i)o.set(a,i[a]);for(var c=0,f=Object.keys(this.options.starts_with);c<f.length;c++){var s=f[c];n[s]&&o.set(s,n[s])}return o.append("file",t),this.trigger("start",o),u.$http.post(this.options.endpoint,o,{onUploadProgress:function(t){r.trigger("upload-progress",t),t.lengthComputable&&r.trigger("progress",t.loaded/t.total,t)}}).then((function(t){var n=r.options.viewerHost+"/"+r.constructor.trimSlashes(e);return r.trigger("success",n,t),t})).finally((function(){r.trigger("end")}))}}])&&ke(n.prototype,o),i&&ke(n,i),c}(Unicorn.EventMixin(function(){return function t(){Te(this,t)}}()));Le={endpoint:"",subfolder:"",viewerHost:"",starts_with:[],formInputs:{acl:"",bucket:"",key:"",Policy:"","X-Amz-Algorithm":"","X-Amz-Credential":"","X-Amz-Date":"","X-Amz-Signature":""}},(He="defaultOptions")in(qe=Ne)?Object.defineProperty(qe,He,{value:Le,enumerable:!0,configurable:!0,writable:!0}):qe[He]=Le}])}));
//# sourceMappingURL=s3-uploader.js.map