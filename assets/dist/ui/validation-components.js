!function(t,e){if("object"==typeof exports&&"object"==typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n=e();for(var r in n)("object"==typeof exports?exports:t)[r]=n[r]}}(window,(function(){return function(t){var e={};function n(r){if(e[r])return e[r].exports;var i=e[r]={i:r,l:!1,exports:{}};return t[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)n.d(r,i,function(e){return t[e]}.bind(null,i));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=0)}([function(t,e,n){t.exports=n(1)},function(t,e,n){"use strict";function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function i(t){return function(t){if(Array.isArray(t))return o(t)}(t)||function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||function(t,e){if(!t)return;if("string"==typeof t)return o(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return o(t,e)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function o(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function a(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function s(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function l(t,e,n){return e&&s(t.prototype,e),n&&s(t,n),t}function c(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&m(t,e)}function f(t){var e=y();return function(){var n,r=b(t);if(e){var i=b(this).constructor;n=Reflect.construct(r,arguments,i)}else n=r.apply(this,arguments);return d(this,n)}}function d(t,e){return!e||"object"!==r(e)&&"function"!=typeof e?p(t):e}function p(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function h(t){var e="function"==typeof Map?new Map:void 0;return(h=function(t){if(null===t||(n=t,-1===Function.toString.call(n).indexOf("[native code]")))return t;var n;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==e){if(e.has(t))return e.get(t);e.set(t,r)}function r(){return v(t,arguments,b(this).constructor)}return r.prototype=Object.create(t.prototype,{constructor:{value:r,enumerable:!1,writable:!0,configurable:!0}}),m(r,t)})(t)}function v(t,e,n){return(v=y()?Reflect.construct:function(t,e,n){var r=[null];r.push.apply(r,e);var i=new(Function.bind.apply(t,r));return n&&m(i,n.prototype),i}).apply(null,arguments)}function y(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}function m(t,e){return(m=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function b(t){return(b=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function g(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}n.r(e),n.d(e,"UnicornFormValidateElement",(function(){return S})),n.d(e,"UnicornFieldValidateElement",(function(){return w}));var k={},S=function(t){c(n,t);var e=f(n);function n(){var t;return a(this,n),g(p(t=e.call(this)),"presetFields",[]),g(p(t),"validators",{}),g(p(t),"$form",void 0),t.registerDefaultValidators(),t}return l(n,[{key:"scrollEnabled",get:function(){var t=this.getAttribute("scroll");return null!=t&&"false"!==t}},{key:"scrollOffset",get:function(){return Number(this.getAttribute("scroll-offset")||-100)}},{key:"fieldSelector",get:function(){return this.getAttribute("field-selector")||"uni-field-validate"}},{key:"validatedClass",get:function(){return this.getAttribute("validated-class")||"was-validated"}},{key:"connectedCallback",value:function(){var t=this;this.$form=this.querySelector("form"),this.$form&&(this.$form.setAttribute("novalidate",!0),this.$form.addEventListener("submit",(function(e){return!!t.validateAll()||(e.stopImmediatePropagation(),e.stopPropagation(),e.preventDefault(),!1)}),!1))}},{key:"findFields",value:function(){var t=!(arguments.length>0&&void 0!==arguments[0])||arguments[0],e=u.selectAll(this.$form.querySelectorAll(this.fieldSelector));return t&&e.push.apply(e,i(this.presetFields)),e}},{key:"validateAll",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;this.markFormAsUnvalidated(),t=t||this.findFields();var e=null;return t.forEach((function(t){t.checkValidity()||e||(e=t)})),this.markFormAsValidated(),e&&this.scrollEnabled&&this.scrollTo(e),null===e}},{key:"scrollTo",value:function(t){var e=this.scrollOffset,n=t.getBoundingClientRect().top+window.pageYOffset+e;window.scrollTo({top:n,behavior:"smooth"})}},{key:"markFormAsValidated",value:function(){this.$form&&this.$form.classList.add(this.validatedClass)}},{key:"markFormAsUnvalidated",value:function(){this.$form&&this.$form.classList.remove(this.validatedClass)}},{key:"addField",value:function(t){return this.presetFields.push(t),this}},{key:"registerDefaultValidators",value:function(){for(var t in k)k.hasOwnProperty(t)&&this.addValidator(t,k[t])}},{key:"addValidator",value:function(t,e,n){return n=n||{},this.validators[t]={handler:e,options:n},this}}]),n}(h(HTMLElement));g(S,"is","uni-form-validate");var w=function(t){c(n,t);var e=f(n);function n(){var t;return a(this,n),g(p(t=e.call(this)),"$input",void 0),t}return l(n,[{key:"attributeChangedCallback",value:function(t,e,n){switch(t){case"selector":this.selectInput()}}},{key:"$form",get:function(){return this.getForm()}},{key:"errorSelector",get:function(){return this.getAttribute("error-selector")||"[data-field-error]"}},{key:"selector",get:function(){return this.getAttribute("selector")||"input, select, textarea"}},{key:"validClass",get:function(){return this.getAttribute("valid-class")||"is-valid"}},{key:"invalidClass",get:function(){return this.getAttribute("invalid-class")||"is-invalid"}},{key:"selectInput",value:function(){return this.$input=this.querySelector(this.selector)}},{key:"connectedCallback",value:function(){var t,e;this.selectInput(),this.bindEvents(),null!==(t=this.querySelector(this.errorSelector))&&void 0!==t&&null!==(e=t.classList)&&void 0!==e&&e.contains("invalid-tooltip")&&"static"===window.getComputedStyle(this).position&&(this.style.position="relative")}},{key:"bindEvents",value:function(){var t=this;this.$input.addEventListener("invalid",(function(e){t.showInvalidResponse()})),(this.attributes.events||"change").split(",").map((function(t){return t.trim()})).filter((function(t){return""!==t})).forEach((function(e){t.$input.addEventListener(e,(function(){t.checkValidity()}))}))}},{key:"checkValidity",value:function(){this.$input.classList.remove(this.invalidClass),this.$input.classList.remove(this.validClass),this.$input.setCustomValidity(""),this.$form&&this.runCustomValidity();var t=this.$input.checkValidity();return t?this.$input.classList.add(this.validClass):this.$input.classList.add(this.invalidClass),t}},{key:"runCustomValidity",value:function(){var t,e=(this.$input.getAttribute("data-validate")||"").split("|"),n=!0;if(""!==this.$input.value&&e.length)for(var r in e){var i=this.$form.validators[e[r]];if(i&&!i.handler(this.$input.value,this.$input)){"function"==typeof(t=i.options.notice)&&(t=t(this.$input,this)),null!=t&&this.$input.setCustomValidity(t),""===this.$input.validationMessage&&this.$input.setCustomValidity("Value type mismatch"),n=!1;break}}return n}},{key:"showInvalidResponse",value:function(){this.querySelector(this.errorSelector).textContent=this.$input.validationMessage}},{key:"clearInvalidResponse",value:function(){this.querySelector(this.errorSelector).textContent=""}},{key:"getForm",value:function(){return this.closest(this.attributes["form-selector"]||"uni-form-validate")}}],[{key:"observedAttributes",get:function(){return["selector"]}}]),n}(h(HTMLElement));g(w,"is","uni-field-validate"),k.username=function(t,e){return!new RegExp("[<|>|\"|'|%|;|(|)|&]","i").test(t)},k.numeric=function(t,e){return/^(\d|-)?(\d|,)*\.?\d*$/.test(t)},k.email=function(t,e){t=punycode.toASCII(t);return/^[a-zA-Z0-9.!#$%&â€™*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(t)},k.url=function(t,e){return/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i.test(t)},k.alnum=function(t,e){return/^[a-zA-Z0-9]*$/.test(t)},k.color=function(t,e){return/^#(?:[0-9a-f]{3}){1,2}$/.test(t)},k.creditcard=function(t,e){return/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6011[0-9]{12}|622((12[6-9]|1[3-9][0-9])|([2-8][0-9][0-9])|(9(([0-1][0-9])|(2[0-5]))))[0-9]{10}|64[4-9][0-9]{13}|65[0-9]{14}|3(?:0[0-5]|[68][0-9])[0-9]{11}|3[47][0-9]{13})*$/.test(t)},k.ip=function(t,e){return/^((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))*$/.test(t)},k["password-confirm"]=function(t,e){var n=e.attr("data-confirm-target");return $(n).val()===t},customElements.define(S.is,S),customElements.define(w.is,w)}])}));