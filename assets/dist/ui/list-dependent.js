!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.ListDependent=e():t.ListDependent=e()}(self,(function(){return(()=>{"use strict";var t={d:(e,n)=>{for(var r in n)t.o(n,r)&&!t.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:n[r]})},o:(t,e)=>Object.prototype.hasOwnProperty.call(t,e),r:t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}},e={};t.r(e),t.d(e,{ListDependent:()=>de});const n=function(t,e,n){switch(n.length){case 0:return t.call(e);case 1:return t.call(e,n[0]);case 2:return t.call(e,n[0],n[1]);case 3:return t.call(e,n[0],n[1],n[2])}return t.apply(e,n)},r=function(t){return t};var o=Math.max;const i="object"==typeof global&&global&&global.Object===Object&&global;var a="object"==typeof self&&self&&self.Object===Object&&self;const c=i||a||Function("return this")(),s=c.Symbol;var l=Object.prototype,f=l.hasOwnProperty,p=l.toString,h=s?s.toStringTag:void 0;var d=Object.prototype.toString;var v=s?s.toStringTag:void 0;const y=function(t){return null==t?void 0===t?"[object Undefined]":"[object Null]":v&&v in Object(t)?function(t){var e=f.call(t,h),n=t[h];try{t[h]=void 0;var r=!0}catch(t){}var o=p.call(t);return r&&(e?t[h]=n:delete t[h]),o}(t):function(t){return d.call(t)}(t)},b=function(t){var e=typeof t;return null!=t&&("object"==e||"function"==e)},_=function(t){if(!b(t))return!1;var e=y(t);return"[object Function]"==e||"[object GeneratorFunction]"==e||"[object AsyncFunction]"==e||"[object Proxy]"==e},j=c["__core-js_shared__"];var g,m=(g=/[^.]+$/.exec(j&&j.keys&&j.keys.IE_PROTO||""))?"Symbol(src)_1."+g:"";var O=Function.prototype.toString;var k=/^\[object .+?Constructor\]$/,w=Function.prototype,x=Object.prototype,A=w.toString,S=x.hasOwnProperty,T=RegExp("^"+A.call(S).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");const P=function(t){return!(!b(t)||(e=t,m&&m in e))&&(_(t)?T:k).test(function(t){if(null!=t){try{return O.call(t)}catch(t){}try{return t+""}catch(t){}}return""}(t));var e},z=function(t,e){var n=function(t,e){return null==t?void 0:t[e]}(t,e);return P(n)?n:void 0},E=function(){try{var t=z(Object,"defineProperty");return t({},"",{}),t}catch(t){}}(),L=E?function(t,e){return E(t,"toString",{configurable:!0,enumerable:!1,value:(n=e,function(){return n}),writable:!0});var n}:r;var U=Date.now;const F=(M=L,$=0,H=0,function(){var t=U(),e=16-(t-H);if(H=t,e>0){if(++$>=800)return arguments[0]}else $=0;return M.apply(void 0,arguments)});var M,$,H;const I=function(t,e){return F(function(t,e,r){return e=o(void 0===e?t.length-1:e,0),function(){for(var i=arguments,u=-1,a=o(i.length-e,0),c=Array(a);++u<a;)c[u]=i[e+u];u=-1;for(var s=Array(e+1);++u<e;)s[u]=i[u];return s[e]=r(c),n(t,this,s)}}(t,e,r),t+"")},q=function(t,e){return t===e||t!=t&&e!=e},B=function(t,e){for(var n=t.length;n--;)if(q(t[n][0],e))return n;return-1};var C=Array.prototype.splice;function D(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1])}}D.prototype.clear=function(){this.__data__=[],this.size=0},D.prototype.delete=function(t){var e=this.__data__,n=B(e,t);return!(n<0||(n==e.length-1?e.pop():C.call(e,n,1),--this.size,0))},D.prototype.get=function(t){var e=this.__data__,n=B(e,t);return n<0?void 0:e[n][1]},D.prototype.has=function(t){return B(this.__data__,t)>-1},D.prototype.set=function(t,e){var n=this.__data__,r=B(n,t);return r<0?(++this.size,n.push([t,e])):n[r][1]=e,this};const N=D,R=z(c,"Map"),J=z(Object,"create");var G=Object.prototype.hasOwnProperty;var V=Object.prototype.hasOwnProperty;function W(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1])}}W.prototype.clear=function(){this.__data__=J?J(null):{},this.size=0},W.prototype.delete=function(t){var e=this.has(t)&&delete this.__data__[t];return this.size-=e?1:0,e},W.prototype.get=function(t){var e=this.__data__;if(J){var n=e[t];return"__lodash_hash_undefined__"===n?void 0:n}return G.call(e,t)?e[t]:void 0},W.prototype.has=function(t){var e=this.__data__;return J?void 0!==e[t]:V.call(e,t)},W.prototype.set=function(t,e){var n=this.__data__;return this.size+=this.has(t)?0:1,n[t]=J&&void 0===e?"__lodash_hash_undefined__":e,this};const Y=W,K=function(t,e){var n,r,o=t.__data__;return("string"==(r=typeof(n=e))||"number"==r||"symbol"==r||"boolean"==r?"__proto__"!==n:null===n)?o["string"==typeof e?"string":"hash"]:o.map};function Q(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1])}}Q.prototype.clear=function(){this.size=0,this.__data__={hash:new Y,map:new(R||N),string:new Y}},Q.prototype.delete=function(t){var e=K(this,t).delete(t);return this.size-=e?1:0,e},Q.prototype.get=function(t){return K(this,t).get(t)},Q.prototype.has=function(t){return K(this,t).has(t)},Q.prototype.set=function(t,e){var n=K(this,t),r=n.size;return n.set(t,e),this.size+=n.size==r?0:1,this};const X=Q;function Z(t){var e=this.__data__=new N(t);this.size=e.size}Z.prototype.clear=function(){this.__data__=new N,this.size=0},Z.prototype.delete=function(t){var e=this.__data__,n=e.delete(t);return this.size=e.size,n},Z.prototype.get=function(t){return this.__data__.get(t)},Z.prototype.has=function(t){return this.__data__.has(t)},Z.prototype.set=function(t,e){var n=this.__data__;if(n instanceof N){var r=n.__data__;if(!R||r.length<199)return r.push([t,e]),this.size=++n.size,this;n=this.__data__=new X(r)}return n.set(t,e),this.size=n.size,this};const tt=Z,et=function(t,e,n){"__proto__"==e&&E?E(t,e,{configurable:!0,enumerable:!0,value:n,writable:!0}):t[e]=n},nt=function(t,e,n){(void 0!==n&&!q(t[e],n)||void 0===n&&!(e in t))&&et(t,e,n)},rt=function(t,e,n){for(var r=-1,o=Object(t),i=n(t),u=i.length;u--;){var a=i[++r];if(!1===e(o[a],a,o))break}return t};var ot="object"==typeof exports&&exports&&!exports.nodeType&&exports,it=ot&&"object"==typeof module&&module&&!module.nodeType&&module,ut=it&&it.exports===ot?c.Buffer:void 0,at=ut?ut.allocUnsafe:void 0;const ct=c.Uint8Array,st=function(t,e){var n,r,o=e?(n=t.buffer,r=new n.constructor(n.byteLength),new ct(r).set(new ct(n)),r):t.buffer;return new t.constructor(o,t.byteOffset,t.length)};var lt=Object.create;const ft=function(){function t(){}return function(e){if(!b(e))return{};if(lt)return lt(e);t.prototype=e;var n=new t;return t.prototype=void 0,n}}(),pt=function(t,e){return function(n){return t(e(n))}},ht=pt(Object.getPrototypeOf,Object);var dt=Object.prototype;const vt=function(t){var e=t&&t.constructor;return t===("function"==typeof e&&e.prototype||dt)},yt=function(t){return null!=t&&"object"==typeof t},bt=function(t){return yt(t)&&"[object Arguments]"==y(t)};var _t=Object.prototype,jt=_t.hasOwnProperty,gt=_t.propertyIsEnumerable,mt=bt(function(){return arguments}())?bt:function(t){return yt(t)&&jt.call(t,"callee")&&!gt.call(t,"callee")};const Ot=mt,kt=Array.isArray,wt=function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=9007199254740991},xt=function(t){return null!=t&&wt(t.length)&&!_(t)};var At="object"==typeof exports&&exports&&!exports.nodeType&&exports,St=At&&"object"==typeof module&&module&&!module.nodeType&&module,Tt=St&&St.exports===At?c.Buffer:void 0;const Pt=(Tt?Tt.isBuffer:void 0)||function(){return!1};var zt=Function.prototype,Et=Object.prototype,Lt=zt.toString,Ut=Et.hasOwnProperty,Ft=Lt.call(Object);var Mt={};Mt["[object Float32Array]"]=Mt["[object Float64Array]"]=Mt["[object Int8Array]"]=Mt["[object Int16Array]"]=Mt["[object Int32Array]"]=Mt["[object Uint8Array]"]=Mt["[object Uint8ClampedArray]"]=Mt["[object Uint16Array]"]=Mt["[object Uint32Array]"]=!0,Mt["[object Arguments]"]=Mt["[object Array]"]=Mt["[object ArrayBuffer]"]=Mt["[object Boolean]"]=Mt["[object DataView]"]=Mt["[object Date]"]=Mt["[object Error]"]=Mt["[object Function]"]=Mt["[object Map]"]=Mt["[object Number]"]=Mt["[object Object]"]=Mt["[object RegExp]"]=Mt["[object Set]"]=Mt["[object String]"]=Mt["[object WeakMap]"]=!1;var $t="object"==typeof exports&&exports&&!exports.nodeType&&exports,Ht=$t&&"object"==typeof module&&module&&!module.nodeType&&module,It=Ht&&Ht.exports===$t&&i.process,qt=function(){try{return Ht&&Ht.require&&Ht.require("util").types||It&&It.binding&&It.binding("util")}catch(t){}}(),Bt=qt&&qt.isTypedArray;const Ct=Bt?function(t){return function(e){return t(e)}}(Bt):function(t){return yt(t)&&wt(t.length)&&!!Mt[y(t)]},Dt=function(t,e){if(("constructor"!==e||"function"!=typeof t[e])&&"__proto__"!=e)return t[e]};var Nt=Object.prototype.hasOwnProperty;const Rt=function(t,e,n){var r=t[e];Nt.call(t,e)&&q(r,n)&&(void 0!==n||e in t)||et(t,e,n)};var Jt=/^(?:0|[1-9]\d*)$/;const Gt=function(t,e){var n=typeof t;return!!(e=null==e?9007199254740991:e)&&("number"==n||"symbol"!=n&&Jt.test(t))&&t>-1&&t%1==0&&t<e};var Vt=Object.prototype.hasOwnProperty;const Wt=function(t,e){var n=kt(t),r=!n&&Ot(t),o=!n&&!r&&Pt(t),i=!n&&!r&&!o&&Ct(t),u=n||r||o||i,a=u?function(t,e){for(var n=-1,r=Array(t);++n<t;)r[n]=e(n);return r}(t.length,String):[],c=a.length;for(var s in t)!e&&!Vt.call(t,s)||u&&("length"==s||o&&("offset"==s||"parent"==s)||i&&("buffer"==s||"byteLength"==s||"byteOffset"==s)||Gt(s,c))||a.push(s);return a};var Yt=Object.prototype.hasOwnProperty;const Kt=function(t){if(!b(t))return function(t){var e=[];if(null!=t)for(var n in Object(t))e.push(n);return e}(t);var e=vt(t),n=[];for(var r in t)("constructor"!=r||!e&&Yt.call(t,r))&&n.push(r);return n},Qt=function(t){return xt(t)?Wt(t,!0):Kt(t)},Xt=function(t){return function(t,e,n,r){var o=!n;n||(n={});for(var i=-1,u=e.length;++i<u;){var a=e[i],c=r?r(n[a],t[a],a,n,t):void 0;void 0===c&&(c=t[a]),o?et(n,a,c):Rt(n,a,c)}return n}(t,Qt(t))},Zt=function(t,e,n,r,o,i,u){var a,c=Dt(t,n),s=Dt(e,n),l=u.get(s);if(l)nt(t,n,l);else{var f=i?i(c,s,n+"",t,e,u):void 0,p=void 0===f;if(p){var h=kt(s),d=!h&&Pt(s),v=!h&&!d&&Ct(s);f=s,h||d||v?kt(c)?f=c:yt(a=c)&&xt(a)?f=function(t,e){var n=-1,r=t.length;for(e||(e=Array(r));++n<r;)e[n]=t[n];return e}(c):d?(p=!1,f=function(t,e){if(e)return t.slice();var n=t.length,r=at?at(n):new t.constructor(n);return t.copy(r),r}(s,!0)):v?(p=!1,f=st(s,!0)):f=[]:function(t){if(!yt(t)||"[object Object]"!=y(t))return!1;var e=ht(t);if(null===e)return!0;var n=Ut.call(e,"constructor")&&e.constructor;return"function"==typeof n&&n instanceof n&&Lt.call(n)==Ft}(s)||Ot(s)?(f=c,Ot(c)?f=Xt(c):b(c)&&!_(c)||(f=function(t){return"function"!=typeof t.constructor||vt(t)?{}:ft(ht(t))}(s))):p=!1}p&&(u.set(s,f),o(f,s,r,i,u),u.delete(s)),nt(t,n,f)}},te=function t(e,n,r,o,i){e!==n&&rt(n,(function(u,a){if(i||(i=new tt),b(u))Zt(e,n,a,r,t,o,i);else{var c=o?o(Dt(e,a),u,a+"",e,n,i):void 0;void 0===c&&(c=u),nt(e,a,c)}}),Qt)},ee=function t(e,n,r,o,i,u){return b(e)&&b(n)&&(u.set(n,e),te(e,n,void 0,t,u),u.delete(n)),e},ne=(re=function(t,e,n,r){te(t,e,n,r)},I((function(t,e){var n=-1,r=e.length,o=r>1?e[r-1]:void 0,i=r>2?e[2]:void 0;for(o=re.length>3&&"function"==typeof o?(r--,o):void 0,i&&function(t,e,n){if(!b(n))return!1;var r=typeof e;return!!("number"==r?xt(n)&&Gt(e,n.length):"string"==r&&e in n)&&q(n[e],t)}(e[0],e[1],i)&&(o=r<3?void 0:o,r=1),t=Object(t);++n<r;){var u=e[n];u&&re(t,u,n,o)}return t})));var re;const oe=I((function(t){return t.push(void 0,ee),n(ne,void 0,t)})),ie=function(t,e){for(var n=-1,r=null==t?0:t.length;++n<r&&!1!==e(t[n],n,t););return t},ue=pt(Object.keys,Object);var ae=Object.prototype.hasOwnProperty;const ce=function(t){return xt(t)?Wt(t):function(t){if(!vt(t))return ue(t);var e=[];for(var n in Object(t))ae.call(t,n)&&"constructor"!=n&&e.push(n);return e}(t)},se=function(t,e){if(null==t)return t;if(!xt(t))return function(t,e){return t&&rt(t,e,ce)}(t,e);for(var n=t.length,r=-1,o=Object(t);++r<n&&!1!==e(o[r],r,o););return t},le=function(t,e){return(kt(t)?ie:se)(t,"function"==typeof(n=e)?n:r);var n};function fe(t){return fe="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},fe(t)}function pe(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var he=function(t,e,n){},de=function(){function t(e,n,r){var o;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),(o="cancelToken")in this?Object.defineProperty(this,o,{value:null,enumerable:!0,configurable:!0,writable:!0}):this[o]=null,this.element=u.selectOne(e),this.setOptions(r),this.dependent=u.selectOne(n),this.bindEvents(),this.options.initial_load&&this.changeList(this.dependent.value,!0)}var e,n,r;return e=t,n=[{key:"setOptions",value:function(t){this.options=oe({},t,this.constructor.defaultOptions)}},{key:"bindEvents",value:function(){var t=this;this.dependent.addEventListener("change",(function(e){var n;t.changeList(null===(n=e.currentTarget)||void 0===n?void 0:n.value)}))}},{key:"changeList",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;""===(t=t||this.dependent.value)&&(t=this.options.empty_mark),this.options.ajax.url?this.ajaxUpdate(t):this.options.source&&this.sourceUpdate(t,e)}},{key:"sourceUpdate",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,n=this.options.source;this.beforeHook(t,this.element,this.dependent),n[t]?this.updateListElements(n[t]):(this.updateListElements([]),e||""===t||0===parseInt(t)||console.log("List for value: "+t+" not found.")),this.afterHook(t,this.element,this.dependent)}},{key:"ajaxUpdate",value:function(t){var e=this,n={};n[this.options.ajax.value_field]=t,this.beforeHook(t,this.element,this.dependent),this.cancelToken&&(this.cancelToken.cancel(),this.cancelToken=null),this.cancelToken={},u.$http.get(this.options.ajax.url,{params:n,cancelToken:this.cancelToken}).then((function(t){return t.data})).then((function(t){t.success?e.updateListElements(t.data):console.error(t.message)})).catch((function(t){console.error(t)})).finally((function(){e.afterHook(t,e.element,e.dependent),e.cancelToken=null}))}},{key:"updateListElements",value:function(t){var e=this,n=this.options.text_field,r=this.options.value_field;this.element.innerHTML="",this.options.first_option&&(t.unshift({}),t[0][n]=this.options.first_option[n],t[0][r]=this.options.first_option[r]),le(t,(function(t,o){if(Array.isArray(t)){var i=u.html('<optgroup label="'.concat(o,'"></optgroup>'));return le(t,(function(t,o){e.appendOptionTo({value:t[r],text:t[n],attributes:t.attributes},i)})),void e.element.appendChild(i)}e.appendOptionTo({value:t[r],text:t[n],attributes:t.attributes},e.element)})),this.element.dispatchEvent(new CustomEvent("change"))}},{key:"appendOptionTo",value:function(t,e){var n=t.value,r=u.html("<option>"+t.text+"</option>");r.setAttribute("value",n),t.attributes&&le(t.attributes,(function(t,e){r.setAttribute(e,t)})),this.isSelected(n)&&r.setAttribute("selected","selected"),e.appendChild(r)}},{key:"isSelected",value:function(t){return-1!==(Array.isArray(this.options.default_value)?this.options.default_value:this.options.default_value&&"object"===fe(this.options.default_value)?Object.keys(this.options.default_value):[this.options.default_value]).indexOf(t)}},{key:"beforeHook",value:function(t,e,n){return this.options.hooks.before_request.call(this,t,e,n)}},{key:"afterHook",value:function(t,e,n){return this.options.hooks.after_request.call(this,t,e,n)}}],r=[{key:"defaultOptions",get:function(){return{ajax:{url:null,value_field:"value"},source:null,text_field:"title",value_field:"id",first_option:null,default_value:null,initial_load:!0,empty_mark:"__EMPTY__",hooks:{before_request:he,after_request:he}}}},{key:"handle",value:function(t){var e=this,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return u.getBoundedInstance(t,"list-dependent",(function(){return new e(t,n,r)}))}}],n&&pe(e.prototype,n),r&&pe(e,r),Object.defineProperty(e,"prototype",{writable:!1}),t}();return u.directive("list-dependent",{mounted:function(t,e){var n=JSON.parse(e.value);de.handle(t,n.dependent,n)},updated:function(t,e){var n=JSON.parse(e.value);de.handle(t).setOptions(n)}}),e})()}));
//# sourceMappingURL=list-dependent.js.map