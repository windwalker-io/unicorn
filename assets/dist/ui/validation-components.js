!function(t,e){if("object"==typeof exports&&"object"==typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var r=e();for(var n in r)("object"==typeof exports?exports:t)[n]=r[n]}}(window,(function(){return function(t){var e={};function r(n){if(e[n])return e[n].exports;var i=e[n]={i:n,l:!1,exports:{}};return t[n].call(i.exports,i,i.exports,r),i.l=!0,i.exports}return r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)r.d(n,i,function(e){return t[e]}.bind(null,i));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=7)}([function(t,e,r){"use strict";var n=r(1),i="object"==typeof self&&self&&self.Object===Object&&self,o=n.a||i||Function("return this")();e.a=o},function(t,e,r){"use strict";(function(t){var r="object"==typeof t&&t&&t.Object===Object&&t;e.a=r}).call(this,r(8))},function(t,e,r){"use strict";(function(t){var n=r(0),i=r(5),o="object"==typeof exports&&exports&&!exports.nodeType&&exports,a=o&&"object"==typeof t&&t&&!t.nodeType&&t,u=a&&a.exports===o?n.a.Buffer:void 0,s=(u?u.isBuffer:void 0)||i.a;e.a=s}).call(this,r(3)(t))},function(t,e){t.exports=function(t){if(!t.webpackPolyfill){var e=Object.create(t);e.children||(e.children=[]),Object.defineProperty(e,"loaded",{enumerable:!0,get:function(){return e.l}}),Object.defineProperty(e,"id",{enumerable:!0,get:function(){return e.i}}),Object.defineProperty(e,"exports",{enumerable:!0}),e.webpackPolyfill=1}return e}},function(t,e,r){"use strict";(function(t){var n=r(1),i="object"==typeof exports&&exports&&!exports.nodeType&&exports,o=i&&"object"==typeof t&&t&&!t.nodeType&&t,a=o&&o.exports===i&&n.a.process,u=function(){try{var t=o&&o.require&&o.require("util").types;return t||a&&a.binding&&a.binding("util")}catch(t){}}();e.a=u}).call(this,r(3)(t))},function(t,e,r){"use strict";e.a=function(){return!1}},function(t,e,r){"use strict";(function(t){var n=r(0),i="object"==typeof exports&&exports&&!exports.nodeType&&exports,o=i&&"object"==typeof t&&t&&!t.nodeType&&t,a=o&&o.exports===i?n.a.Buffer:void 0,u=a?a.allocUnsafe:void 0;e.a=function(t,e){if(e)return t.slice();var r=t.length,n=u?u(r):new t.constructor(r);return t.copy(n),n}}).call(this,r(3)(t))},function(t,e,r){t.exports=r(9)},function(t,e){var r;r=function(){return this}();try{r=r||new Function("return this")()}catch(t){"object"==typeof window&&(r=window)}t.exports=r},function(t,e,r){"use strict";r.r(e),r.d(e,"UnicornFormValidation",(function(){return Me}));var n=function(t,e,r){switch(r.length){case 0:return t.call(e);case 1:return t.call(e,r[0]);case 2:return t.call(e,r[0],r[1]);case 3:return t.call(e,r[0],r[1],r[2])}return t.apply(e,r)};var i=function(t){return t},o=Math.max;var a=function(t,e,r){return e=o(void 0===e?t.length-1:e,0),function(){for(var i=arguments,a=-1,u=o(i.length-e,0),s=Array(u);++a<u;)s[a]=i[e+a];a=-1;for(var c=Array(e+1);++a<e;)c[a]=i[a];return c[e]=r(s),n(t,this,c)}};var s=function(t){return function(){return t}},c=r(0),l=c.a.Symbol,f=Object.prototype,p=f.hasOwnProperty,d=f.toString,v=l?l.toStringTag:void 0;var h=function(t){var e=p.call(t,v),r=t[v];try{t[v]=void 0;var n=!0}catch(t){}var i=d.call(t);return n&&(e?t[v]=r:delete t[v]),i},y=Object.prototype.toString;var b=function(t){return y.call(t)},g=l?l.toStringTag:void 0;var _=function(t){return null==t?void 0===t?"[object Undefined]":"[object Null]":g&&g in Object(t)?h(t):b(t)};var m=function(t){var e=typeof t;return null!=t&&("object"==e||"function"==e)};var j,O=function(t){if(!m(t))return!1;var e=_(t);return"[object Function]"==e||"[object GeneratorFunction]"==e||"[object AsyncFunction]"==e||"[object Proxy]"==e},w=c.a["__core-js_shared__"],k=(j=/[^.]+$/.exec(w&&w.keys&&w.keys.IE_PROTO||""))?"Symbol(src)_1."+j:"";var S=function(t){return!!k&&k in t},A=Function.prototype.toString;var x=function(t){if(null!=t){try{return A.call(t)}catch(t){}try{return t+""}catch(t){}}return""},F=/^\[object .+?Constructor\]$/,C=Function.prototype,P=Object.prototype,z=C.toString,E=P.hasOwnProperty,I=RegExp("^"+z.call(E).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");var T=function(t){return!(!m(t)||S(t))&&(O(t)?I:F).test(x(t))};var V=function(t,e){return null==t?void 0:t[e]};var M=function(t,e){var r=V(t,e);return T(r)?r:void 0},L=function(){try{var t=M(Object,"defineProperty");return t({},"",{}),t}catch(t){}}(),B=L?function(t,e){return L(t,"toString",{configurable:!0,enumerable:!1,value:s(e),writable:!0})}:i,U=Date.now;var R=function(t){var e=0,r=0;return function(){var n=U(),i=16-(n-r);if(r=n,i>0){if(++e>=800)return arguments[0]}else e=0;return t.apply(void 0,arguments)}}(B);var N=function(t,e){return R(a(t,e,i),t+"")};var q=function(){this.__data__=[],this.size=0};var D=function(t,e){return t===e||t!=t&&e!=e};var W=function(t,e){for(var r=t.length;r--;)if(D(t[r][0],e))return r;return-1},J=Array.prototype.splice;var Z=function(t){var e=this.__data__,r=W(e,t);return!(r<0)&&(r==e.length-1?e.pop():J.call(e,r,1),--this.size,!0)};var H=function(t){var e=this.__data__,r=W(e,t);return r<0?void 0:e[r][1]};var G=function(t){return W(this.__data__,t)>-1};var X=function(t,e){var r=this.__data__,n=W(r,t);return n<0?(++this.size,r.push([t,e])):r[n][1]=e,this};function Y(t){var e=-1,r=null==t?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}Y.prototype.clear=q,Y.prototype.delete=Z,Y.prototype.get=H,Y.prototype.has=G,Y.prototype.set=X;var K=Y;var Q=function(){this.__data__=new K,this.size=0};var tt=function(t){var e=this.__data__,r=e.delete(t);return this.size=e.size,r};var et=function(t){return this.__data__.get(t)};var rt=function(t){return this.__data__.has(t)},nt=M(c.a,"Map"),it=M(Object,"create");var ot=function(){this.__data__=it?it(null):{},this.size=0};var at=function(t){var e=this.has(t)&&delete this.__data__[t];return this.size-=e?1:0,e},ut=Object.prototype.hasOwnProperty;var st=function(t){var e=this.__data__;if(it){var r=e[t];return"__lodash_hash_undefined__"===r?void 0:r}return ut.call(e,t)?e[t]:void 0},ct=Object.prototype.hasOwnProperty;var lt=function(t){var e=this.__data__;return it?void 0!==e[t]:ct.call(e,t)};var ft=function(t,e){var r=this.__data__;return this.size+=this.has(t)?0:1,r[t]=it&&void 0===e?"__lodash_hash_undefined__":e,this};function pt(t){var e=-1,r=null==t?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}pt.prototype.clear=ot,pt.prototype.delete=at,pt.prototype.get=st,pt.prototype.has=lt,pt.prototype.set=ft;var dt=pt;var vt=function(){this.size=0,this.__data__={hash:new dt,map:new(nt||K),string:new dt}};var ht=function(t){var e=typeof t;return"string"==e||"number"==e||"symbol"==e||"boolean"==e?"__proto__"!==t:null===t};var yt=function(t,e){var r=t.__data__;return ht(e)?r["string"==typeof e?"string":"hash"]:r.map};var bt=function(t){var e=yt(this,t).delete(t);return this.size-=e?1:0,e};var gt=function(t){return yt(this,t).get(t)};var _t=function(t){return yt(this,t).has(t)};var mt=function(t,e){var r=yt(this,t),n=r.size;return r.set(t,e),this.size+=r.size==n?0:1,this};function jt(t){var e=-1,r=null==t?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}jt.prototype.clear=vt,jt.prototype.delete=bt,jt.prototype.get=gt,jt.prototype.has=_t,jt.prototype.set=mt;var Ot=jt;var wt=function(t,e){var r=this.__data__;if(r instanceof K){var n=r.__data__;if(!nt||n.length<199)return n.push([t,e]),this.size=++r.size,this;r=this.__data__=new Ot(n)}return r.set(t,e),this.size=r.size,this};function $t(t){var e=this.__data__=new K(t);this.size=e.size}$t.prototype.clear=Q,$t.prototype.delete=tt,$t.prototype.get=et,$t.prototype.has=rt,$t.prototype.set=wt;var kt=$t;var St=function(t,e,r){"__proto__"==e&&L?L(t,e,{configurable:!0,enumerable:!0,value:r,writable:!0}):t[e]=r};var At=function(t,e,r){(void 0!==r&&!D(t[e],r)||void 0===r&&!(e in t))&&St(t,e,r)};var xt=function(t){return function(e,r,n){for(var i=-1,o=Object(e),a=n(e),u=a.length;u--;){var s=a[t?u:++i];if(!1===r(o[s],s,o))break}return e}}(),Ft=r(6),Ct=c.a.Uint8Array;var Pt=function(t){var e=new t.constructor(t.byteLength);return new Ct(e).set(new Ct(t)),e};var zt=function(t,e){var r=e?Pt(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.length)};var Et=function(t,e){var r=-1,n=t.length;for(e||(e=Array(n));++r<n;)e[r]=t[r];return e},It=Object.create,Tt=function(){function t(){}return function(e){if(!m(e))return{};if(It)return It(e);t.prototype=e;var r=new t;return t.prototype=void 0,r}}();var Vt=function(t,e){return function(r){return t(e(r))}}(Object.getPrototypeOf,Object),Mt=Object.prototype;var Lt=function(t){var e=t&&t.constructor;return t===("function"==typeof e&&e.prototype||Mt)};var Bt=function(t){return"function"!=typeof t.constructor||Lt(t)?{}:Tt(Vt(t))};var Ut=function(t){return null!=t&&"object"==typeof t};var Rt=function(t){return Ut(t)&&"[object Arguments]"==_(t)},Nt=Object.prototype,qt=Nt.hasOwnProperty,Dt=Nt.propertyIsEnumerable,Wt=Rt(function(){return arguments}())?Rt:function(t){return Ut(t)&&qt.call(t,"callee")&&!Dt.call(t,"callee")},Jt=Array.isArray;var Zt=function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=9007199254740991};var Ht=function(t){return null!=t&&Zt(t.length)&&!O(t)};var Gt=function(t){return Ut(t)&&Ht(t)},Xt=r(2),Yt=Function.prototype,Kt=Object.prototype,Qt=Yt.toString,te=Kt.hasOwnProperty,ee=Qt.call(Object);var re=function(t){if(!Ut(t)||"[object Object]"!=_(t))return!1;var e=Vt(t);if(null===e)return!0;var r=te.call(e,"constructor")&&e.constructor;return"function"==typeof r&&r instanceof r&&Qt.call(r)==ee},ne={};ne["[object Float32Array]"]=ne["[object Float64Array]"]=ne["[object Int8Array]"]=ne["[object Int16Array]"]=ne["[object Int32Array]"]=ne["[object Uint8Array]"]=ne["[object Uint8ClampedArray]"]=ne["[object Uint16Array]"]=ne["[object Uint32Array]"]=!0,ne["[object Arguments]"]=ne["[object Array]"]=ne["[object ArrayBuffer]"]=ne["[object Boolean]"]=ne["[object DataView]"]=ne["[object Date]"]=ne["[object Error]"]=ne["[object Function]"]=ne["[object Map]"]=ne["[object Number]"]=ne["[object Object]"]=ne["[object RegExp]"]=ne["[object Set]"]=ne["[object String]"]=ne["[object WeakMap]"]=!1;var ie=function(t){return Ut(t)&&Zt(t.length)&&!!ne[_(t)]};var oe=function(t){return function(e){return t(e)}},ae=r(4),ue=ae.a&&ae.a.isTypedArray,se=ue?oe(ue):ie;var ce=function(t,e){if(("constructor"!==e||"function"!=typeof t[e])&&"__proto__"!=e)return t[e]},le=Object.prototype.hasOwnProperty;var fe=function(t,e,r){var n=t[e];le.call(t,e)&&D(n,r)&&(void 0!==r||e in t)||St(t,e,r)};var pe=function(t,e,r,n){var i=!r;r||(r={});for(var o=-1,a=e.length;++o<a;){var u=e[o],s=n?n(r[u],t[u],u,r,t):void 0;void 0===s&&(s=t[u]),i?St(r,u,s):fe(r,u,s)}return r};var de=function(t,e){for(var r=-1,n=Array(t);++r<t;)n[r]=e(r);return n},ve=/^(?:0|[1-9]\d*)$/;var he=function(t,e){var r=typeof t;return!!(e=null==e?9007199254740991:e)&&("number"==r||"symbol"!=r&&ve.test(t))&&t>-1&&t%1==0&&t<e},ye=Object.prototype.hasOwnProperty;var be=function(t,e){var r=Jt(t),n=!r&&Wt(t),i=!r&&!n&&Object(Xt.a)(t),o=!r&&!n&&!i&&se(t),a=r||n||i||o,u=a?de(t.length,String):[],s=u.length;for(var c in t)!e&&!ye.call(t,c)||a&&("length"==c||i&&("offset"==c||"parent"==c)||o&&("buffer"==c||"byteLength"==c||"byteOffset"==c)||he(c,s))||u.push(c);return u};var ge=function(t){var e=[];if(null!=t)for(var r in Object(t))e.push(r);return e},_e=Object.prototype.hasOwnProperty;var me=function(t){if(!m(t))return ge(t);var e=Lt(t),r=[];for(var n in t)("constructor"!=n||!e&&_e.call(t,n))&&r.push(n);return r};var je=function(t){return Ht(t)?be(t,!0):me(t)};var Oe=function(t){return pe(t,je(t))};var we=function(t,e,r,n,i,o,a){var u=ce(t,r),s=ce(e,r),c=a.get(s);if(c)At(t,r,c);else{var l=o?o(u,s,r+"",t,e,a):void 0,f=void 0===l;if(f){var p=Jt(s),d=!p&&Object(Xt.a)(s),v=!p&&!d&&se(s);l=s,p||d||v?Jt(u)?l=u:Gt(u)?l=Et(u):d?(f=!1,l=Object(Ft.a)(s,!0)):v?(f=!1,l=zt(s,!0)):l=[]:re(s)||Wt(s)?(l=u,Wt(u)?l=Oe(u):m(u)&&!O(u)||(l=Bt(s))):f=!1}f&&(a.set(s,l),i(l,s,n,o,a),a.delete(s)),At(t,r,l)}};var $e=function t(e,r,n,i,o){e!==r&&xt(r,(function(a,u){if(o||(o=new kt),m(a))we(e,r,u,n,t,i,o);else{var s=i?i(ce(e,u),a,u+"",e,r,o):void 0;void 0===s&&(s=a),At(e,u,s)}}),je)};var ke=function t(e,r,n,i,o,a){return m(e)&&m(r)&&(a.set(r,e),$e(e,r,void 0,t,a),a.delete(r)),e};var Se=function(t,e,r){if(!m(r))return!1;var n=typeof e;return!!("number"==n?Ht(r)&&he(e,r.length):"string"==n&&e in r)&&D(r[e],t)};var Ae=function(t){return N((function(e,r){var n=-1,i=r.length,o=i>1?r[i-1]:void 0,a=i>2?r[2]:void 0;for(o=t.length>3&&"function"==typeof o?(i--,o):void 0,a&&Se(r[0],r[1],a)&&(o=i<3?void 0:o,i=1),e=Object(e);++n<i;){var u=r[n];u&&t(e,u,n,o)}return e}))}((function(t,e,r,n){$e(t,e,r,n)})),xe=N((function(t){return t.push(void 0,ke),n(Ae,void 0,t)}));function Fe(t){return function(t){if(Array.isArray(t))return Ce(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||function(t,e){if(!t)return;if("string"==typeof t)return Ce(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);"Object"===r&&t.constructor&&(r=t.constructor.name);if("Map"===r||"Set"===r)return Array.from(t);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return Ce(t,e)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function Ce(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function Pe(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function ze(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function Ee(t,e,r){return e&&ze(t.prototype,e),r&&ze(t,r),t}function Ie(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}var Te={},Ve={scroll:!1,scrollOffset:-100,enabled:!0,fieldSelector:null,validatedClass:null},Me=function(){function t(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};Pe(this,t),Ie(this,"presetFields",[]),Ie(this,"validators",{}),Ie(this,"$form",void 0),this.$form=u.selectOne(e),this.setOptions(r),this.registerDefaultValidators(),this.init()}return Ee(t,[{key:"setOptions",value:function(t){this.options=xe(t,Ve)}},{key:"scrollEnabled",get:function(){return!0===this.options.scroll}},{key:"scrollOffset",get:function(){return Number(this.options.scrollOffset||-100)}},{key:"fieldSelector",get:function(){return this.options.fieldSelector||"input, select, textarea"}},{key:"validatedClass",get:function(){return this.options.validatedClass||"was-validated"}},{key:"init",value:function(){var t=this;"FORM"===this.$form.tagName&&(this.$form.setAttribute("novalidate",!0),this.$form.addEventListener("submit",(function(e){return!(t.options.enabled&&!t.validateAll())||(e.stopImmediatePropagation(),e.stopPropagation(),e.preventDefault(),!1)}),!1)),this.prepareFields(this.findDOMFields()),this.prepareFields(this.presetFields)}},{key:"findDOMFields",value:function(){return u.selectAll(this.$form.querySelectorAll(this.fieldSelector))}},{key:"prepareFields",value:function(t){var e=this;return t=t.forEach((function(t){e.prepareFieldWrapper(t)})),Promise.resolve()}},{key:"prepareFieldWrapper",value:function(t){if(-1!==["INPUT","SELECT","TEXTAREA"].indexOf(t.tagName)){var e=t.closest(".form-group, [uni-field-validate]");return e&&!e.getAttribute("uni-field-validate")&&e.setAttribute("uni-field-validate","{}"),e}return t}},{key:"findFields",value:function(){var t,e=this,r=!(arguments.length>0&&void 0!==arguments[0])||arguments[0],n=this.findDOMFields();r&&(t=n).push.apply(t,Fe(this.presetFields));return(n=n.map((function(t){return e.prepareFieldWrapper(t)}))).filter((function(t){return null!=t}))}},{key:"validateAll",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;this.markFormAsUnvalidated(),t=t||this.findFields();var e=null;return t.forEach((function(t){var r=u.getBoundedInstance(t,"field.validation");r&&(r.checkValidity()||e||(e=t))})),this.markFormAsValidated(),e&&this.scrollEnabled&&this.scrollTo(e),null===e}},{key:"scrollTo",value:function(t){var e=this.scrollOffset,r=t.getBoundingClientRect().top+window.pageYOffset+e;window.scrollTo({top:r,behavior:"smooth"})}},{key:"markFormAsValidated",value:function(){this.$form&&this.$form.classList.add(this.validatedClass)}},{key:"markFormAsUnvalidated",value:function(){this.$form&&this.$form.classList.remove(this.validatedClass)}},{key:"addField",value:function(t){return this.presetFields.push(t),this.prepareFieldWrapper(t),this}},{key:"registerDefaultValidators",value:function(){for(var t in Te)Te.hasOwnProperty(t)&&this.addValidator(t,Te[t])}},{key:"addValidator",value:function(t,e,r){return r=r||{},this.validators[t]={handler:e,options:r},this}}]),t}();Ie(Me,"is","uni-form-validate");var Le=function(){function t(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};Pe(this,t),Ie(this,"$input",void 0),this.el=e,this.options=r,this.init()}return Ee(t,[{key:"$form",get:function(){return this.getForm()}},{key:"errorSelector",get:function(){return this.options.errorSelector||"[data-field-error]"}},{key:"selector",get:function(){return this.options.selector||"input, select, textarea"}},{key:"validClass",get:function(){return this.options.validClass||"is-valid"}},{key:"invalidClass",get:function(){return this.options.invalidClass||"is-invalid"}},{key:"isVisible",get:function(){return!!(this.el.offsetWidth||this.el.offsetHeight||this.el.getClientRects().length)}},{key:"selectInput",value:function(){return this.$input=this.el.querySelector(this.selector)}},{key:"init",value:function(){this.selectInput(),this.bindEvents(),this.prepareWrapper()}},{key:"bindEvents",value:function(){var t=this;this.$input&&(this.$input.addEventListener("invalid",(function(e){t.showInvalidResponse()})),(this.options.events||["change"]).forEach((function(e){t.$input.addEventListener(e,(function(){t.checkValidity()}))})))}},{key:"prepareWrapper",value:function(){var t,e;null!==(t=this.el.querySelector(this.errorSelector))&&void 0!==t&&null!==(e=t.classList)&&void 0!==e&&e.contains("invalid-tooltip")&&"static"===window.getComputedStyle(this.el).position&&(this.el.style.position="relative")}},{key:"checkValidity",value:function(){if(!this.$input)return!0;if(this.$input.hasAttribute("readonly"))return!0;this.$input.classList.remove(this.invalidClass),this.$input.classList.remove(this.validClass),this.$input.setCustomValidity(""),this.$form&&this.runCustomValidity();var t=this.$input.checkValidity();return t?this.$input.classList.add(this.validClass):this.$input.classList.add(this.invalidClass),t}},{key:"runCustomValidity",value:function(){var t,e=(this.$input.getAttribute("data-validate")||"").split("|"),r=!0,n=u.getBoundedInstance(this.$form,"form.validation");if(""!==this.$input.value&&e.length)for(var i in e){var o=n.validators[e[i]];if(o&&!o.handler(this.$input.value,this.$input)){"function"==typeof(t=o.options.notice)&&(t=t(this.$input,this)),null!=t&&this.$input.setCustomValidity(t),""===this.$input.validationMessage&&this.$input.setCustomValidity("Value type mismatch"),r=!1;break}}return r}},{key:"showInvalidResponse",value:function(){if(!this.isVisible){var t,e=null===(t=this.findLabel())||void 0===t?void 0:t.textContent;e||(e=this.$input.name),u.addMessage("Field: ".concat(e," - ").concat(this.$input.validationMessage),"warning")}var r=this.el.querySelector(this.errorSelector);r||(r=this.createHelpElement(),this.el.appendChild(r),this.prepareWrapper()),r.textContent=this.$input.validationMessage}},{key:"createHelpElement",value:function(){var t,e=this.options.errorMessageClass||"invalid-tooltip",r=this.parseSelector(this.errorSelector),n=u.html('<div class="'.concat(e,'"></div>'));return(t=n.classList).add.apply(t,Fe(r.classes)),r.attrs.forEach((function(t){n.setAttribute(t[0],t[1]||"")})),r.ids.forEach((function(t){n.id=t})),n}},{key:"parseSelector",value:function(t){var e={tags:[],classes:[],ids:[],attrs:[]};return t.split(/(?=\.)|(?=#)|(?=\[)/).forEach((function(t){switch(t[0]){case"#":e.ids.push(t.slice(1));break;case".":e.classes.push(t.slice(1));break;case"[":e.attrs.push(t.slice(1,-1).split("="));break;default:e.tags.push(t)}})),e}},{key:"clearInvalidResponse",value:function(){this.el.querySelector(this.errorSelector).textContent=""}},{key:"getForm",value:function(){return this.el.closest(this.options.formSelector||"[uni-form-validate]")}},{key:"findLabel",value:function(){var t=this.$input.id,e=this.$input.closest("[data-field-wrapper]"),r=null;return e&&(r=e.querySelector("[data-field-label]")),r||(r=document.querySelector('label[for="'.concat(t,'"]'))),r}}]),t}();Ie(Le,"is","uni-field-validate"),u.directive("form-validate",{mounted:function(t,e){u.getBoundedInstance(t,"form.validation",(function(t){return new Me(t,JSON.parse(e.value||"{}"))}))},updated:function(t,e){u.getBoundedInstance(t,"form.validation").setOptions(JSON.parse(e.value||"{}"))}}),u.directive("field-validate",{mounted:function(t,e){u.getBoundedInstance(t,"field.validation",(function(t){return new Le(t,JSON.parse(e.value||"{}"))}))},updated:function(t,e){u.getBoundedInstance(t,"field.validation").options=JSON.parse(e.value||"{}")}}),Te.username=function(t,e){return!new RegExp("[<|>|\"|'|%|;|(|)|&]","i").test(t)},Te.numeric=function(t,e){return/^(\d|-)?(\d|,)*\.?\d*$/.test(t)},Te.email=function(t,e){t=punycode.toASCII(t);return/^[a-zA-Z0-9.!#$%&â€™*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(t)},Te.url=function(t,e){return/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i.test(t)},Te.alnum=function(t,e){return/^[a-zA-Z0-9]*$/.test(t)},Te.color=function(t,e){return/^#(?:[0-9a-f]{3}){1,2}$/.test(t)},Te.creditcard=function(t,e){return/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6011[0-9]{12}|622((12[6-9]|1[3-9][0-9])|([2-8][0-9][0-9])|(9(([0-1][0-9])|(2[0-5]))))[0-9]{10}|64[4-9][0-9]{13}|65[0-9]{14}|3(?:0[0-5]|[68][0-9])[0-9]{11}|3[47][0-9]{13})*$/.test(t)},Te.ip=function(t,e){return/^((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))*$/.test(t)},Te["password-confirm"]=function(t,e){var r=e.attr("data-confirm-target");return $(r).val()===t}}])}));
//# sourceMappingURL=validation-components.js.map