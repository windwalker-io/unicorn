!function(t,e){if("object"==typeof exports&&"object"==typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var i=e();for(var r in i)("object"==typeof exports?exports:t)[r]=i[r]}}(self,(()=>(()=>{"use strict";var t={d:(e,i)=>{for(var r in i)t.o(i,r)&&!t.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:i[r]})},o:(t,e)=>Object.prototype.hasOwnProperty.call(t,e),r:t=>{void 0!==l&&l.toStringTag&&Object.defineProperty(t,l.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}},e={};t.r(e),t.d(e,{UnicornFieldValidation:()=>ue,UnicornFormValidation:()=>le});const i=function(t,e,i){switch(i.length){case 0:return t.call(e);case 1:return t.call(e,i[0]);case 2:return t.call(e,i[0],i[1]);case 3:return t.call(e,i[0],i[1],i[2])}return t.apply(e,i)},r=function(t){return t};var n=Math.max;const o="object"==typeof global&&global&&global.Object===Object&&global;var s="object"==typeof self&&self&&self.Object===Object&&self;const a=o||s||Function("return this")();var l=a.Symbol;const c=l;var d=Object.prototype,p=d.hasOwnProperty,h=d.toString,f=c?c.toStringTag:void 0;var v=Object.prototype.toString;var y=c?c.toStringTag:void 0;const b=function(t){return null==t?void 0===t?"[object Undefined]":"[object Null]":y&&y in Object(t)?function(t){var e=p.call(t,f),i=t[f];try{t[f]=void 0;var r=!0}catch(t){}var n=h.call(t);return r&&(e?t[f]=i:delete t[f]),n}(t):function(t){return v.call(t)}(t)},g=function(t){var e=typeof t;return null!=t&&("object"==e||"function"==e)},m=function(t){if(!g(t))return!1;var e=b(t);return"[object Function]"==e||"[object GeneratorFunction]"==e||"[object AsyncFunction]"==e||"[object Proxy]"==e},_=a["__core-js_shared__"];var $,j=($=/[^.]+$/.exec(_&&_.keys&&_.keys.IE_PROTO||""))?"Symbol(src)_1."+$:"";var O=Function.prototype.toString;var C=/^\[object .+?Constructor\]$/,A=Function.prototype,S=Object.prototype,w=A.toString,V=S.hasOwnProperty,F=RegExp("^"+w.call(V).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");const k=function(t){return!(!g(t)||(e=t,j&&j in e))&&(m(t)?F:C).test(function(t){if(null!=t){try{return O.call(t)}catch(t){}try{return t+""}catch(t){}}return""}(t));var e},E=function(t,e){var i=function(t,e){return null==t?void 0:t[e]}(t,e);return k(i)?i:void 0},x=function(){try{var t=E(Object,"defineProperty");return t({},"",{}),t}catch(t){}}(),z=x?function(t,e){return x(t,"toString",{configurable:!0,enumerable:!1,value:(i=e,function(){return i}),writable:!0});var i}:r;var P=Date.now;const I=(M=z,T=0,L=0,function(){var t=P(),e=16-(t-L);if(L=t,e>0){if(++T>=800)return arguments[0]}else T=0;return M.apply(void 0,arguments)});var M,T,L;const R=function(t,e){return I(function(t,e,r){return e=n(void 0===e?t.length-1:e,0),function(){for(var o=arguments,s=-1,a=n(o.length-e,0),l=Array(a);++s<a;)l[s]=o[e+s];s=-1;for(var u=Array(e+1);++s<e;)u[s]=o[s];return u[e]=r(l),i(t,this,u)}}(t,e,r),t+"")},q=function(t,e){return t===e||t!=t&&e!=e},N=function(t,e){for(var i=t.length;i--;)if(q(t[i][0],e))return i;return-1};var B=Array.prototype.splice;function U(t){var e=-1,i=null==t?0:t.length;for(this.clear();++e<i;){var r=t[e];this.set(r[0],r[1])}}U.prototype.clear=function(){this.__data__=[],this.size=0},U.prototype.delete=function(t){var e=this.__data__,i=N(e,t);return!(i<0||(i==e.length-1?e.pop():B.call(e,i,1),--this.size,0))},U.prototype.get=function(t){var e=this.__data__,i=N(e,t);return i<0?void 0:e[i][1]},U.prototype.has=function(t){return N(this.__data__,t)>-1},U.prototype.set=function(t,e){var i=this.__data__,r=N(i,t);return r<0?(++this.size,i.push([t,e])):i[r][1]=e,this};const D=U,W=E(a,"Map"),J=E(Object,"create");var Z=Object.prototype.hasOwnProperty;var H=Object.prototype.hasOwnProperty;function G(t){var e=-1,i=null==t?0:t.length;for(this.clear();++e<i;){var r=t[e];this.set(r[0],r[1])}}G.prototype.clear=function(){this.__data__=J?J(null):{},this.size=0},G.prototype.delete=function(t){var e=this.has(t)&&delete this.__data__[t];return this.size-=e?1:0,e},G.prototype.get=function(t){var e=this.__data__;if(J){var i=e[t];return"__lodash_hash_undefined__"===i?void 0:i}return Z.call(e,t)?e[t]:void 0},G.prototype.has=function(t){var e=this.__data__;return J?void 0!==e[t]:H.call(e,t)},G.prototype.set=function(t,e){var i=this.__data__;return this.size+=this.has(t)?0:1,i[t]=J&&void 0===e?"__lodash_hash_undefined__":e,this};const X=G,Y=function(t,e){var i,r,n=t.__data__;return("string"==(r=typeof(i=e))||"number"==r||"symbol"==r||"boolean"==r?"__proto__"!==i:null===i)?n["string"==typeof e?"string":"hash"]:n.map};function K(t){var e=-1,i=null==t?0:t.length;for(this.clear();++e<i;){var r=t[e];this.set(r[0],r[1])}}K.prototype.clear=function(){this.size=0,this.__data__={hash:new X,map:new(W||D),string:new X}},K.prototype.delete=function(t){var e=Y(this,t).delete(t);return this.size-=e?1:0,e},K.prototype.get=function(t){return Y(this,t).get(t)},K.prototype.has=function(t){return Y(this,t).has(t)},K.prototype.set=function(t,e){var i=Y(this,t),r=i.size;return i.set(t,e),this.size+=i.size==r?0:1,this};const Q=K;function tt(t){var e=this.__data__=new D(t);this.size=e.size}tt.prototype.clear=function(){this.__data__=new D,this.size=0},tt.prototype.delete=function(t){var e=this.__data__,i=e.delete(t);return this.size=e.size,i},tt.prototype.get=function(t){return this.__data__.get(t)},tt.prototype.has=function(t){return this.__data__.has(t)},tt.prototype.set=function(t,e){var i=this.__data__;if(i instanceof D){var r=i.__data__;if(!W||r.length<199)return r.push([t,e]),this.size=++i.size,this;i=this.__data__=new Q(r)}return i.set(t,e),this.size=i.size,this};const et=tt,it=function(t,e,i){"__proto__"==e&&x?x(t,e,{configurable:!0,enumerable:!0,value:i,writable:!0}):t[e]=i},rt=function(t,e,i){(void 0!==i&&!q(t[e],i)||void 0===i&&!(e in t))&&it(t,e,i)},nt=function(t,e,i){for(var r=-1,n=Object(t),o=i(t),s=o.length;s--;){var a=o[++r];if(!1===e(n[a],a,n))break}return t};var ot="object"==typeof exports&&exports&&!exports.nodeType&&exports,st=ot&&"object"==typeof module&&module&&!module.nodeType&&module,at=st&&st.exports===ot?a.Buffer:void 0,lt=at?at.allocUnsafe:void 0;const ut=a.Uint8Array,ct=function(t,e){var i,r,n=e?(i=t.buffer,r=new i.constructor(i.byteLength),new ut(r).set(new ut(i)),r):t.buffer;return new t.constructor(n,t.byteOffset,t.length)};var dt=Object.create;const pt=function(){function t(){}return function(e){if(!g(e))return{};if(dt)return dt(e);t.prototype=e;var i=new t;return t.prototype=void 0,i}}(),ht=function(t,e){return function(i){return t(e(i))}}(Object.getPrototypeOf,Object);var ft=Object.prototype;const vt=function(t){var e=t&&t.constructor;return t===("function"==typeof e&&e.prototype||ft)},yt=function(t){return null!=t&&"object"==typeof t},bt=function(t){return yt(t)&&"[object Arguments]"==b(t)};var gt=Object.prototype,mt=gt.hasOwnProperty,_t=gt.propertyIsEnumerable;const $t=bt(function(){return arguments}())?bt:function(t){return yt(t)&&mt.call(t,"callee")&&!_t.call(t,"callee")},jt=Array.isArray,Ot=function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=9007199254740991},Ct=function(t){return null!=t&&Ot(t.length)&&!m(t)};var At="object"==typeof exports&&exports&&!exports.nodeType&&exports,St=At&&"object"==typeof module&&module&&!module.nodeType&&module,wt=St&&St.exports===At?a.Buffer:void 0;const Vt=(wt?wt.isBuffer:void 0)||function(){return!1};var Ft=Function.prototype,kt=Object.prototype,Et=Ft.toString,xt=kt.hasOwnProperty,zt=Et.call(Object);var Pt={};Pt["[object Float32Array]"]=Pt["[object Float64Array]"]=Pt["[object Int8Array]"]=Pt["[object Int16Array]"]=Pt["[object Int32Array]"]=Pt["[object Uint8Array]"]=Pt["[object Uint8ClampedArray]"]=Pt["[object Uint16Array]"]=Pt["[object Uint32Array]"]=!0,Pt["[object Arguments]"]=Pt["[object Array]"]=Pt["[object ArrayBuffer]"]=Pt["[object Boolean]"]=Pt["[object DataView]"]=Pt["[object Date]"]=Pt["[object Error]"]=Pt["[object Function]"]=Pt["[object Map]"]=Pt["[object Number]"]=Pt["[object Object]"]=Pt["[object RegExp]"]=Pt["[object Set]"]=Pt["[object String]"]=Pt["[object WeakMap]"]=!1;var It="object"==typeof exports&&exports&&!exports.nodeType&&exports,Mt=It&&"object"==typeof module&&module&&!module.nodeType&&module,Tt=Mt&&Mt.exports===It&&o.process,Lt=function(){try{return Mt&&Mt.require&&Mt.require("util").types||Tt&&Tt.binding&&Tt.binding("util")}catch(t){}}(),Rt=Lt&&Lt.isTypedArray;const qt=Rt?function(t){return function(e){return t(e)}}(Rt):function(t){return yt(t)&&Ot(t.length)&&!!Pt[b(t)]},Nt=function(t,e){if(("constructor"!==e||"function"!=typeof t[e])&&"__proto__"!=e)return t[e]};var Bt=Object.prototype.hasOwnProperty;const Ut=function(t,e,i){var r=t[e];Bt.call(t,e)&&q(r,i)&&(void 0!==i||e in t)||it(t,e,i)};var Dt=/^(?:0|[1-9]\d*)$/;const Wt=function(t,e){var i=typeof t;return!!(e=null==e?9007199254740991:e)&&("number"==i||"symbol"!=i&&Dt.test(t))&&t>-1&&t%1==0&&t<e};var Jt=Object.prototype.hasOwnProperty;const Zt=function(t,e){var i=jt(t),r=!i&&$t(t),n=!i&&!r&&Vt(t),o=!i&&!r&&!n&&qt(t),s=i||r||n||o,a=s?function(t,e){for(var i=-1,r=Array(t);++i<t;)r[i]=e(i);return r}(t.length,String):[],l=a.length;for(var u in t)!e&&!Jt.call(t,u)||s&&("length"==u||n&&("offset"==u||"parent"==u)||o&&("buffer"==u||"byteLength"==u||"byteOffset"==u)||Wt(u,l))||a.push(u);return a};var Ht=Object.prototype.hasOwnProperty;const Gt=function(t){if(!g(t))return function(t){var e=[];if(null!=t)for(var i in Object(t))e.push(i);return e}(t);var e=vt(t),i=[];for(var r in t)("constructor"!=r||!e&&Ht.call(t,r))&&i.push(r);return i},Xt=function(t){return Ct(t)?Zt(t,!0):Gt(t)},Yt=function(t){return function(t,e,i,r){var n=!i;i||(i={});for(var o=-1,s=e.length;++o<s;){var a=e[o],l=r?r(i[a],t[a],a,i,t):void 0;void 0===l&&(l=t[a]),n?it(i,a,l):Ut(i,a,l)}return i}(t,Xt(t))},Kt=function(t,e,i,r,n,o,s){var a,l=Nt(t,i),u=Nt(e,i),c=s.get(u);if(c)rt(t,i,c);else{var d=o?o(l,u,i+"",t,e,s):void 0,p=void 0===d;if(p){var h=jt(u),f=!h&&Vt(u),v=!h&&!f&&qt(u);d=u,h||f||v?jt(l)?d=l:yt(a=l)&&Ct(a)?d=function(t,e){var i=-1,r=t.length;for(e||(e=Array(r));++i<r;)e[i]=t[i];return e}(l):f?(p=!1,d=function(t,e){if(e)return t.slice();var i=t.length,r=lt?lt(i):new t.constructor(i);return t.copy(r),r}(u,!0)):v?(p=!1,d=ct(u,!0)):d=[]:function(t){if(!yt(t)||"[object Object]"!=b(t))return!1;var e=ht(t);if(null===e)return!0;var i=xt.call(e,"constructor")&&e.constructor;return"function"==typeof i&&i instanceof i&&Et.call(i)==zt}(u)||$t(u)?(d=l,$t(l)?d=Yt(l):g(l)&&!m(l)||(d=function(t){return"function"!=typeof t.constructor||vt(t)?{}:pt(ht(t))}(u))):p=!1}p&&(s.set(u,d),n(d,u,r,o,s),s.delete(u)),rt(t,i,d)}},Qt=function t(e,i,r,n,o){e!==i&&nt(i,(function(s,a){if(o||(o=new et),g(s))Kt(e,i,a,r,t,n,o);else{var l=n?n(Nt(e,a),s,a+"",e,i,o):void 0;void 0===l&&(l=s),rt(e,a,l)}}),Xt)},te=function t(e,i,r,n,o,s){return g(e)&&g(i)&&(s.set(i,e),Qt(e,i,void 0,t,s),s.delete(i)),e},ee=(ie=function(t,e,i,r){Qt(t,e,i,r)},R((function(t,e){var i=-1,r=e.length,n=r>1?e[r-1]:void 0,o=r>2?e[2]:void 0;for(n=ie.length>3&&"function"==typeof n?(r--,n):void 0,o&&function(t,e,i){if(!g(i))return!1;var r=typeof e;return!!("number"==r?Ct(i)&&Wt(e,i.length):"string"==r&&e in i)&&q(i[e],t)}(e[0],e[1],o)&&(n=r<3?void 0:n,r=1),t=Object(t);++i<r;){var s=e[i];s&&ie(t,s,i,n)}return t})));var ie;const re=R((function(t){return t.push(void 0,te),i(ee,void 0,t)}));function ne(t,e,i){return e in t?Object.defineProperty(t,e,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[e]=i,t}const oe={},se={scroll:!1,scrollOffset:-100,enabled:!0,fieldSelector:null,validatedClass:null},ae={formSelector:"[uni-form-validate]",errorSelector:"[data-field-error]",selector:"input[data-field-input], select[data-field-input], textarea[data-field-input]",validClass:"is-valid",invalidClass:"is-invalid",events:["change"],errorMessageClass:"invalid-tooltip",inputOptions:!1,inputOptionsWrapperSelector:"div[data-field-input]",inputOptionsSelector:"[data-input-option]"};class le{constructor(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};ne(this,"presetFields",[]),ne(this,"validators",{}),ne(this,"$form",void 0),this.$form=u.selectOne(t),this.setOptions(e),this.registerDefaultValidators(),this.init()}setOptions(t){this.options=re({},t,se)}get scrollEnabled(){return!0===this.options.scroll}get scrollOffset(){return Number(this.options.scrollOffset||-100)}get fieldSelector(){return this.options.fieldSelector||"input, select, textarea"}get validatedClass(){return this.options.validatedClass||"was-validated"}init(){"FORM"===this.$form.tagName&&(this.$form.setAttribute("novalidate",!0),this.$form.addEventListener("submit",(t=>!(this.options.enabled&&!this.validateAll()&&(t.stopImmediatePropagation(),t.stopPropagation(),t.preventDefault(),1))),!1)),this.prepareFields(this.findDOMFields()),this.prepareFields(this.presetFields)}findDOMFields(){return u.selectAll(this.$form.querySelectorAll(this.fieldSelector))}prepareFields(t){return t.forEach((t=>{this.prepareFieldWrapper(t)})),Promise.resolve()}prepareFieldWrapper(t){if(-1!==["INPUT","SELECT","TEXTAREA"].indexOf(t.tagName)){let e=t.closest("[uni-field-validate]");return e||(e=t.closest("[data-input-container]")||t.parentNode,e.setAttribute("uni-field-validate","{}")),e}return t}findFields(){let t=!(arguments.length>0&&void 0!==arguments[0])||arguments[0],e=this.findDOMFields();return t&&e.push(...this.presetFields),e=e.map((t=>this.prepareFieldWrapper(t))),e.filter((t=>null!=t))}getFieldComponent(t){return u.getBoundedInstance(t,"field.validation")}validateAll(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;this.markFormAsUnvalidated(),t=t||this.findFields();let e=null;return t.forEach((t=>{const i=this.getFieldComponent(t);i&&(i.checkValidity()||e||(e=t))})),this.markFormAsValidated(),e&&this.scrollEnabled&&this.scrollTo(e),null===e}async validateAllAsync(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;this.markFormAsUnvalidated(),t=t||this.findFields();let e=null;const i=[];return t.forEach((t=>{const r=this.getFieldComponent(t);r&&i.push(r.checkValidityAsync().then((i=>{i||e||(e=t)})))})),await Promise.all(i),this.markFormAsValidated(),e&&this.scrollEnabled&&this.scrollTo(e),null===e}scrollTo(t){const e=this.scrollOffset,i=t.getBoundingClientRect().top+window.pageYOffset+e;window.scrollTo({top:i,behavior:"smooth"})}markFormAsValidated(){this.$form&&this.$form.classList.add(this.validatedClass)}markFormAsUnvalidated(){this.$form&&this.$form.classList.remove(this.validatedClass)}addField(t){return this.presetFields.push(t),this.prepareFieldWrapper(t),this}registerDefaultValidators(){for(let t in oe)this.addValidator(t,oe[t])}addValidator(t,e){let i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return i=i||{},this.validators[t]={handler:e,options:i},this}static addGlobalValidator(t,e){let i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return i=i||{},this.globalValidators[t]={handler:e,options:i},this}}ne(le,"globalValidators",{}),ne(le,"is","uni-form-validate");class ue{constructor(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};ne(this,"$input",void 0),this.el=t,this.options=re({},e,ae),this.init()}get $form(){return this.getForm()}get errorSelector(){return this.options.errorSelector}get selector(){return this.options.selector}get validClass(){return this.options.validClass}get invalidClass(){return this.options.invalidClass}get isVisible(){return!!(this.el.offsetWidth||this.el.offsetHeight||this.el.getClientRects().length)}get isInputOptions(){return Boolean(this.options.inputOptions)}selectInput(){let t=this.selector;this.options.inputOptions&&(t+=", "+this.options.inputOptionsWrapperSelector);let e=this.el.querySelector(t);return e||(e=this.el.querySelector("input, select, textarea")),this.$input=e}init(){this.selectInput(),this.bindEvents(),this.prepareWrapper(),this.isInputOptions&&(this.$input.validationMessage="",this.$input.setCustomValidity=t=>{this.$input.validationMessage=String(t)},this.$input.checkValidity=()=>this.checkInputOptionsValidity())}bindEvents(){this.$input&&(this.$input.addEventListener("invalid",(t=>{this.showInvalidResponse()})),this.options.events.forEach((t=>{this.$input.addEventListener(t,(()=>{this.checkValidity()}))})))}prepareWrapper(){var t,e;null!==(t=this.el.querySelector(this.errorSelector))&&void 0!==t&&null!==(e=t.classList)&&void 0!==e&&e.contains("invalid-tooltip")&&"static"===window.getComputedStyle(this.el).position&&(this.el.style.position="relative")}checkValidity(){if(!this.$input)return!0;if(this.$input.hasAttribute("readonly"))return!0;this.$input.setCustomValidity("");let t=this.$input.checkValidity();return t&&this.$form&&(t=this.runCustomValidity()),this.$input.checkValidity(),this.updateValidClass(t),t}runCustomValidity(){const t=(this.$input.getAttribute("data-validate")||"").split("|");let e=!0;if(""!==this.$input.value&&t.length){if(!this.checkCustomDataAttributeValidity())return!1;for(const i of t){const[t,r]=this.getValidator(i)||[null,{}];if(!t)continue;Object.assign(r,t.options);let n=t.handler(this.$input.value,this.$input,r,this);if(n instanceof Promise||"object"==typeof n&&n.then)n.then((e=>{this.handleAsyncCustomResult(e,t)}));else if(!this.handleCustomResult(n,t)){e=!1;break}}}return e}async checkValidityAsync(){if(!this.$input)return!0;if(this.$input.hasAttribute("readonly"))return!0;this.$input.setCustomValidity("");let t=this.$input.checkValidity();return t&&this.$form&&(t=await this.runCustomValidityAsync()),this.updateValidClass(t),t}async runCustomValidityAsync(){const t=(this.$input.getAttribute("data-validate")||"").split("|"),e=[],i=[];if(""!==this.$input.value&&t.length){if(!this.checkCustomDataAttributeValidity())return!1;for(const r of t){const[t,n]=this.getValidator(r)||[null,{}];t&&(Object.assign(n,t.options),i.push(Promise.resolve(t.handler(this.$input.value,this.$input,n,this)).then((i=>{e.push(this.handleAsyncCustomResult(i,t))}))))}}await Promise.all(i);for(const t of e)if(!1===t)return!1;return!0}checkCustomDataAttributeValidity(){const t=this.$input.dataset.validationFail;return this.handleCustomResult(t)}checkInputOptionsValidity(){const t=this.$input.querySelectorAll(this.options.inputOptionsSelector);let e=!0;for(const i of t){const t=i.querySelector("input");if(e=e&&t.checked,e)break}const i=document.createElement("input");i.required=!0,e&&(i.value="placeholder"),i.checkValidity(),this.$input.validationMessage=i.validationMessage,this.$input.validity=i.validity;for(const e of t)e.querySelector("input").setCustomValidity(i.validationMessage);return e||this.$input.dispatchEvent(new CustomEvent("invalid")),e}updateValidClass(t){this.$input.classList.remove(this.invalidClass),this.$input.classList.remove(this.validClass),this.el.classList.remove(this.invalidClass),this.el.classList.remove(this.validClass),t?(this.$input.classList.add(this.validClass),this.el.classList.add(this.validClass)):(this.$input.classList.add(this.invalidClass),this.el.classList.add(this.invalidClass))}getFormValidation(t){return u.getBoundedInstance(t,"form.validation")}getValidator(t){const e=t.match(/(?<type>\w+)(\((?<params>.*)\))*/);if(!e)return null;const i=e.groups.type||"",r=e.groups.params||"",n=this.getFormValidation(this.$form),o=n.validators[i]||n.constructor.globalValidators[i];if(!o)return null;const s=r.matchAll(/(?<key>\w+)(\s?[=:]\s?(?<value>\w+))?/g),a={};for(const t of s)a[t.groups.key]=(l=t.groups.value,isNaN(Number(l))?"null"===l?null:"true"===l||"false"===l||l:Number(l));var l;return[o,a]}handleCustomResult(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;return"string"==typeof t?(this.$input.setCustomValidity(t),t=""===t):void 0===t&&(t=!0),t?this.$input.setCustomValidity(""):e&&this.raiseCustomErrorState(e),t}handleAsyncCustomResult(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;return t=this.handleCustomResult(t,e),this.$input.checkValidity(),this.updateValidClass(t),t}raiseCustomErrorState(t){let e;""===this.$input.validationMessage&&(e=t.options.notice,"function"==typeof e&&(e=e(this.$input,this)),null!=e&&this.$input.setCustomValidity(e)),""===this.$input.validationMessage&&this.$input.setCustomValidity(u.__("unicorn.message.validation.custom.error"))}showInvalidResponse(){const t=this.$input.validity;let e=this.$input.validationMessage;for(let i in t)if(!0===t[i]&&this.$input.dataset[i+"Message"]){e=this.$input.dataset[i+"Message"];break}if(!this.isVisible){var i;let t=null===(i=this.findLabel())||void 0===i?void 0:i.textContent;t||(t=this.$input.name),u.addMessage(`Field: ${t} - ${e}`,"warning")}let r=this.el.querySelector(this.errorSelector);r||(r=this.createHelpElement(),this.el.appendChild(r),this.prepareWrapper()),r.textContent=e}createHelpElement(){const t=this.options.errorMessageClass,e=this.parseSelector(this.errorSelector),i=u.html(`<div class="${t}"></div>`);return i.classList.add(...e.classes),e.attrs.forEach((t=>{i.setAttribute(t[0],t[1]||"")})),e.ids.forEach((t=>{i.id=t})),i}parseSelector(t){const e={tags:[],classes:[],ids:[],attrs:[]};return t.split(/(?=\.)|(?=#)|(?=\[)/).forEach((function(t){switch(t[0]){case"#":e.ids.push(t.slice(1));break;case".":e.classes.push(t.slice(1));break;case"[":e.attrs.push(t.slice(1,-1).split("="));break;default:e.tags.push(t)}})),e}clearInvalidResponse(){this.el.querySelector(this.errorSelector).textContent=""}getForm(){return this.el.closest(this.options.formSelector||"[uni-form-validate]")}findLabel(){const t=this.$input.id,e=this.$input.closest("[data-field-wrapper]");let i=null;return e&&(i=e.querySelector("[data-field-label]")),i||(i=document.querySelector(`label[for="${t}"]`)),i}}return ne(ue,"is","uni-field-validate"),oe.username=function(t,e){return!new RegExp("[<|>|\"|'|%|;|(|)|&]","i").test(t)},oe.numeric=function(t,e){return/^(\d|-)?(\d|,)*\.?\d*$/.test(t)},oe.email=function(t,e){return t=punycode.toASCII(t),/^[a-zA-Z0-9.!#$%&â€™*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(t)},oe.url=function(t,e){return/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i.test(t)},oe.alnum=function(t,e){return/^[a-zA-Z0-9]*$/.test(t)},oe.color=function(t,e){return/^#(?:[0-9a-f]{3}){1,2}$/.test(t)},oe.creditcard=function(t,e){return/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6011[0-9]{12}|622((12[6-9]|1[3-9][0-9])|([2-8][0-9][0-9])|(9(([0-1][0-9])|(2[0-5]))))[0-9]{10}|64[4-9][0-9]{13}|65[0-9]{14}|3(?:0[0-5]|[68][0-9])[0-9]{11}|3[47][0-9]{13})*$/.test(t)},oe.ip=function(t,e){return/^((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))*$/.test(t)},oe["password-confirm"]=function(t,e){const i=e.dataset.confirmTarget;if(!i)throw new Error('Validator: "password-confirm" must add "data-confirm-target" attribute.');return document.querySelector(i).value===t},u.directive("form-validate",{mounted(t,e){u.getBoundedInstance(t,"form.validation",(t=>new le(t,JSON.parse(e.value||"{}"))))},updated(t,e){u.getBoundedInstance(t,"form.validation").setOptions(JSON.parse(e.value||"{}"))}}),u.directive("field-validate",{mounted(t,e){u.getBoundedInstance(t,"field.validation",(t=>new ue(t,JSON.parse(e.value||"{}"))))},updated(t,e){u.getBoundedInstance(t,"field.validation").options=JSON.parse(e.value||"{}")}}),e})()));
//# sourceMappingURL=validation-components.js.map