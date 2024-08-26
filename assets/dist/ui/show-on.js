!function(t,e){if("object"==typeof exports&&"object"==typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var r=e();for(var n in r)("object"==typeof exports?exports:t)[n]=r[n]}}(self,(()=>(()=>{"use strict";var t={};(t=>{void 0!==a&&a.toStringTag&&Object.defineProperty(t,a.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})})(t);const e=function(t,e){for(var r=-1,n=null==t?0:t.length;++r<n&&!1!==e(t[r],r,t););return t},r=function(t,e,r){for(var n=-1,o=Object(t),i=r(t),u=i.length;u--;){var a=i[++n];if(!1===e(o[a],a,o))break}return t},n="object"==typeof global&&global&&global.Object===Object&&global;var o="object"==typeof self&&self&&self.Object===Object&&self;const i=n||o||Function("return this")();var a=i.Symbol;const c=a;var l=Object.prototype,s=l.hasOwnProperty,f=l.toString,p=c?c.toStringTag:void 0;var h=Object.prototype.toString;var y=c?c.toStringTag:void 0;const d=function(t){return null==t?void 0===t?"[object Undefined]":"[object Null]":y&&y in Object(t)?function(t){var e=s.call(t,p),r=t[p];try{t[p]=void 0;var n=!0}catch(t){}var o=f.call(t);return n&&(e?t[p]=r:delete t[p]),o}(t):function(t){return h.call(t)}(t)},v=function(t){return null!=t&&"object"==typeof t},b=function(t){return v(t)&&"[object Arguments]"==d(t)};var _=Object.prototype,g=_.hasOwnProperty,j=_.propertyIsEnumerable;const O=b(function(){return arguments}())?b:function(t){return v(t)&&g.call(t,"callee")&&!j.call(t,"callee")},m=Array.isArray;var A="object"==typeof exports&&exports&&!exports.nodeType&&exports,S=A&&"object"==typeof module&&module&&!module.nodeType&&module,x=S&&S.exports===A?i.Buffer:void 0;const w=(x?x.isBuffer:void 0)||function(){return!1};var k=/^(?:0|[1-9]\d*)$/;const P=function(t,e){var r=typeof t;return!!(e=null==e?9007199254740991:e)&&("number"==r||"symbol"!=r&&k.test(t))&&t>-1&&t%1==0&&t<e},T=function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=9007199254740991};var z={};z["[object Float32Array]"]=z["[object Float64Array]"]=z["[object Int8Array]"]=z["[object Int16Array]"]=z["[object Int32Array]"]=z["[object Uint8Array]"]=z["[object Uint8ClampedArray]"]=z["[object Uint16Array]"]=z["[object Uint32Array]"]=!0,z["[object Arguments]"]=z["[object Array]"]=z["[object ArrayBuffer]"]=z["[object Boolean]"]=z["[object DataView]"]=z["[object Date]"]=z["[object Error]"]=z["[object Function]"]=z["[object Map]"]=z["[object Number]"]=z["[object Object]"]=z["[object RegExp]"]=z["[object Set]"]=z["[object String]"]=z["[object WeakMap]"]=!1;const F=function(t){return function(e){return t(e)}};var $="object"==typeof exports&&exports&&!exports.nodeType&&exports,M=$&&"object"==typeof module&&module&&!module.nodeType&&module,q=M&&M.exports===$&&n.process,D=function(){try{return M&&M.require&&M.require("util").types||q&&q.binding&&q.binding("util")}catch(t){}}(),I=D&&D.isTypedArray;const E=I?F(I):function(t){return v(t)&&T(t.length)&&!!z[d(t)]};var C=Object.prototype.hasOwnProperty;const N=function(t,e){var r=m(t),n=!r&&O(t),o=!r&&!n&&w(t),i=!r&&!n&&!o&&E(t),u=r||n||o||i,a=u?function(t,e){for(var r=-1,n=Array(t);++r<t;)n[r]=e(r);return n}(t.length,String):[],c=a.length;for(var l in t)!e&&!C.call(t,l)||u&&("length"==l||o&&("offset"==l||"parent"==l)||i&&("buffer"==l||"byteLength"==l||"byteOffset"==l)||P(l,c))||a.push(l);return a};var U=Object.prototype;const B=(V=Object.keys,L=Object,function(t){return V(L(t))});var V,L,R=Object.prototype.hasOwnProperty;const G=function(t){if(r=(e=t)&&e.constructor,e!==("function"==typeof r&&r.prototype||U))return B(t);var e,r,n=[];for(var o in Object(t))R.call(t,o)&&"constructor"!=o&&n.push(o);return n},J=function(t){var e=typeof t;return null!=t&&("object"==e||"function"==e)},W=function(t){if(!J(t))return!1;var e=d(t);return"[object Function]"==e||"[object GeneratorFunction]"==e||"[object AsyncFunction]"==e||"[object Proxy]"==e},H=function(t){return null!=t&&T(t.length)&&!W(t)},K=function(t){return H(t)?N(t):G(t)},Q=function(t,e){if(null==t)return t;if(!H(t))return function(t,e){return t&&r(t,e,K)}(t,e);for(var n=t.length,o=-1,i=Object(t);++o<n&&!1!==e(i[o],o,i););return t},X=function(t){return t},Y=function(t,r){return(m(t)?e:Q)(t,"function"==typeof(n=r)?n:X);var n},Z=i["__core-js_shared__"];var tt,et=(tt=/[^.]+$/.exec(Z&&Z.keys&&Z.keys.IE_PROTO||""))?"Symbol(src)_1."+tt:"";var rt=Function.prototype.toString;var nt=/^\[object .+?Constructor\]$/,ot=Function.prototype,it=Object.prototype,ut=ot.toString,at=it.hasOwnProperty,ct=RegExp("^"+ut.call(at).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");const lt=function(t){return!(!J(t)||function(t){return!!et&&et in t}(t))&&(W(t)?ct:nt).test(function(t){if(null!=t){try{return rt.call(t)}catch(t){}try{return t+""}catch(t){}}return""}(t))},st=function(t,e){var r=function(t,e){return null==t?void 0:t[e]}(t,e);return lt(r)?r:void 0},ft=st(Object,"create");var pt=Object.prototype.hasOwnProperty;var ht=Object.prototype.hasOwnProperty;function yt(t){var e=-1,r=null==t?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}yt.prototype.clear=function(){this.__data__=ft?ft(null):{},this.size=0},yt.prototype.delete=function(t){var e=this.has(t)&&delete this.__data__[t];return this.size-=e?1:0,e},yt.prototype.get=function(t){var e=this.__data__;if(ft){var r=e[t];return"__lodash_hash_undefined__"===r?void 0:r}return pt.call(e,t)?e[t]:void 0},yt.prototype.has=function(t){var e=this.__data__;return ft?void 0!==e[t]:ht.call(e,t)},yt.prototype.set=function(t,e){var r=this.__data__;return this.size+=this.has(t)?0:1,r[t]=ft&&void 0===e?"__lodash_hash_undefined__":e,this};const dt=yt,vt=function(t,e){for(var r=t.length;r--;)if((n=t[r][0])===(o=e)||n!=n&&o!=o)return r;var n,o;return-1};var bt=Array.prototype.splice;function _t(t){var e=-1,r=null==t?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}_t.prototype.clear=function(){this.__data__=[],this.size=0},_t.prototype.delete=function(t){var e=this.__data__,r=vt(e,t);return!(r<0||(r==e.length-1?e.pop():bt.call(e,r,1),--this.size,0))},_t.prototype.get=function(t){var e=this.__data__,r=vt(e,t);return r<0?void 0:e[r][1]},_t.prototype.has=function(t){return vt(this.__data__,t)>-1},_t.prototype.set=function(t,e){var r=this.__data__,n=vt(r,t);return n<0?(++this.size,r.push([t,e])):r[n][1]=e,this};const gt=_t,jt=st(i,"Map"),Ot=function(t,e){var r,n,o=t.__data__;return("string"==(n=typeof(r=e))||"number"==n||"symbol"==n||"boolean"==n?"__proto__"!==r:null===r)?o["string"==typeof e?"string":"hash"]:o.map};function mt(t){var e=-1,r=null==t?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}mt.prototype.clear=function(){this.size=0,this.__data__={hash:new dt,map:new(jt||gt),string:new dt}},mt.prototype.delete=function(t){var e=Ot(this,t).delete(t);return this.size-=e?1:0,e},mt.prototype.get=function(t){return Ot(this,t).get(t)},mt.prototype.has=function(t){return Ot(this,t).has(t)},mt.prototype.set=function(t,e){var r=Ot(this,t),n=r.size;return r.set(t,e),this.size+=r.size==n?0:1,this};const At=mt;function St(t){var e=-1,r=null==t?0:t.length;for(this.__data__=new At;++e<r;)this.add(t[e])}St.prototype.add=St.prototype.push=function(t){return this.__data__.set(t,"__lodash_hash_undefined__"),this},St.prototype.has=function(t){return this.__data__.has(t)};const xt=St,wt=function(t){return t!=t},kt=function(t,e){return!(null==t||!t.length)&&function(t,e,r){return e==e?function(t,e,r){for(var n=r-1,o=t.length;++n<o;)if(t[n]===e)return n;return-1}(t,e,r):function(t,e,r,n){for(var o=t.length,i=r+(n?1:-1);n?i--:++i<o;)if(e(t[i],i,t))return i;return-1}(t,wt,r)}(t,e,0)>-1},Pt=function(t,e,r){for(var n=-1,o=null==t?0:t.length;++n<o;)if(r(e,t[n]))return!0;return!1},Tt=function(t,e){return t.has(e)},zt=function(t,e,r,n){var o=-1,i=kt,u=!0,a=t.length,c=[],l=e.length;if(!a)return c;r&&(e=function(t,e){for(var r=-1,n=null==t?0:t.length,o=Array(n);++r<n;)o[r]=e(t[r],r,t);return o}(e,F(r))),n?(i=Pt,u=!1):e.length>=200&&(i=Tt,u=!1,e=new xt(e));t:for(;++o<a;){var s=t[o],f=null==r?s:r(s);if(s=n||0!==s?s:0,u&&f==f){for(var p=l;p--;)if(e[p]===f)continue t;c.push(s)}else i(e,f,n)||c.push(s)}return c},Ft=function(t,e){for(var r=-1,n=e.length,o=t.length;++r<n;)t[o+r]=e[r];return t};var $t=c?c.isConcatSpreadable:void 0;const Mt=function(t){return m(t)||O(t)||!!($t&&t&&t[$t])},qt=function t(e,r,n,o,i){var u=-1,a=e.length;for(n||(n=Mt),i||(i=[]);++u<a;){var c=e[u];r>0&&n(c)?r>1?t(c,r-1,n,o,i):Ft(i,c):o||(i[i.length]=c)}return i};var Dt=Math.max;const It=function(){try{var t=st(Object,"defineProperty");return t({},"",{}),t}catch(t){}}(),Et=It?function(t,e){return It(t,"toString",{configurable:!0,enumerable:!1,value:(r=e,function(){return r}),writable:!0});var r}:X;var Ct=Date.now;const Nt=function(t){var e=0,r=0;return function(){var n=Ct(),o=16-(n-r);if(r=n,o>0){if(++e>=800)return arguments[0]}else e=0;return t.apply(void 0,arguments)}}(Et),Ut=function(t){return v(t)&&H(t)},Bt=function(t,e){return Nt(function(t,e,r){return e=Dt(void 0===e?t.length-1:e,0),function(){for(var n=arguments,o=-1,i=Dt(n.length-e,0),u=Array(i);++o<i;)u[o]=n[e+o];o=-1;for(var a=Array(e+1);++o<e;)a[o]=n[o];return a[e]=r(u),function(t,e,r){switch(r.length){case 0:return t.call(e);case 1:return t.call(e,r[0]);case 2:return t.call(e,r[0],r[1]);case 3:return t.call(e,r[0],r[1],r[2])}return t.apply(e,r)}(t,this,a)}}(t,void 0,X),t+"")}((function(t,e){return Ut(t)?zt(t,qt(e,1,Ut,!0)):[]}));class Vt{el=null;input=null;conditions={};targets={};readonly=!1;initialDisplay=null;constructor(t,e){this.el=t,this.input=this.el.querySelector(this.el.dataset.inputSelector||"[data-field-input]"),this.conditions=e,this.init()}init(){this.initialDisplay=window.getComputedStyle(this.el).display||"block",Y(this.conditions,((t,e)=>{const r=u.selectOne(e);let n;this.input&&(this.readonly=this.input.hasAttribute("readonly")),n="DIV"===r.nodeName?r.querySelectorAll("input, select, textarea"):[r],u.selectAll(n,(e=>{e.addEventListener("change",(()=>{this.updateShowState(r,t)}))})),this.updateShowState(r,t,1)}))}updateShowState(t,e,r=300){const n=this.isValueMatched(t,e);n?u.$ui.fadeIn(this.el,r,this.initialDisplay):u.$ui.fadeOut(this.el,r),this.input&&(n?this.input.removeAttribute("readonly"):this.input.setAttribute("readonly","readonly"))}isValueMatched(t,e){let r=null;switch(this.nodeType(t)){case"input":case"textarea":r=t.value;break;case"select":r=t.multiple?u.selectAll(t.querySelectorAll("option")).filter((t=>t.selected)).map((t=>t.value)):t.value;break;case"checkbox":r=t.checked?t.value:null;break;case"radio":r=t.querySelector("input[type=radio]:checked")?.value}return Array.isArray(e)?Array.isArray(r)?0===Bt(e,r).length:-1!==e.indexOf(r):Array.isArray(r)?-1!==r.indexOf(e):e==r}nodeType(t){var e=t.nodeName.toLowerCase(),r=t.type;return"select"===e?"select":"textarea"===e?"textarea":"input"===e?"checkbox"===r?"checkbox":"input":"div"===e&&t.querySelector("input[type=radio]")?"radio":void 0}}return u.directive("show-on",{mounted(t,{value:e}){u.module(t,"show.on",(t=>new Vt(t,JSON.parse(e))))}}),t})()));
//# sourceMappingURL=main.js.map