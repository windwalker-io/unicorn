!function(t,e){if("object"==typeof exports&&"object"==typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n=e();for(var r in n)("object"==typeof exports?exports:t)[r]=n[r]}}(self,(function(){return(()=>{function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(e)}function e(t){return function(t){if(Array.isArray(t))return n(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||function(t,e){if(t){if("string"==typeof t)return n(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?n(t,e):void 0}}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function n(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function r(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function o(e,n){if(n&&("object"===t(n)||"function"==typeof n))return n;if(void 0!==n)throw new TypeError("Derived constructors may only return object or undefined");return i(e)}function i(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function c(t){var e="function"==typeof Map?new Map:void 0;return c=function(t){if(null===t||(n=t,-1===Function.toString.call(n).indexOf("[native code]")))return t;var n;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==e){if(e.has(t))return e.get(t);e.set(t,r)}function r(){return l(t,arguments,p(this).constructor)}return r.prototype=Object.create(t.prototype,{constructor:{value:r,enumerable:!1,writable:!0,configurable:!0}}),a(r,t)},c(t)}function l(t,e,n){return l=f()?Reflect.construct:function(t,e,n){var r=[null];r.push.apply(r,e);var o=new(Function.bind.apply(t,r));return n&&a(o,n.prototype),o},l.apply(null,arguments)}function f(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}function a(t,e){return a=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},a(t,e)}function p(t){return p=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},p(t)}var s=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&a(t,e)}(d,t);var n,c,l,s,y,b=(n=d,c=f(),function(){var t,e=p(n);if(c){var r=p(this).constructor;t=Reflect.construct(e,arguments,r)}else t=e.apply(this,arguments);return o(this,t)});function d(){var t,e,n,r;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,d),r=void 0,(n="instance")in(e=i(t=b.call(this)))?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,t}return l=d,y=[{key:"is",get:function(){return"uni-flatpickr"}}],(s=[{key:"selector",get:function(){return this.getAttribute("selector")||"input"}},{key:"getOptions",value:function(){var t=this,e={},n=["selector"];return this.getAttributeNames().forEach((function(r){-1===n.indexOf(r)&&(e[r]=t.getAttribute(r))})),e}},{key:"connectedCallback",value:function(){var t=this,e=JSON.parse(this.getAttribute("options"));this.handleOptions(e).then((function(e){t.instance=flatpickr(t.querySelector(t.selector),e)}))}},{key:"handleOptions",value:function(t){return t.monthSelect?Promise.all([u.import("@flatpickr/plugins/monthSelect/index.js"),u.import("@flatpickr/plugins/monthSelect/style.css")]).then((function(n){var r=n[1].default;return document.adoptedStyleSheets=[].concat(e(document.adoptedStyleSheets),[r]),t.plugins=t.plugins||[],"boolean"==typeof t.monthSelect&&(t.monthSelect={shorthand:!0,dateFormat:"Y-m",altFormat:"Y-m"}),t.plugins.push(new monthSelectPlugin(t.monthSelect)),t})):Promise.resolve(t)}},{key:"getInstance",value:function(){return this.instance}}])&&r(l.prototype,s),y&&r(l,y),Object.defineProperty(l,"prototype",{writable:!1}),d}(c(HTMLElement));return Promise.all([u.import("@flatpickr/flatpickr.js"),u.import("@flatpickr/flatpickr.css")]).then((function(t){var n=t[1].default;document.adoptedStyleSheets=[].concat(e(document.adoptedStyleSheets),[n]),u.defineCustomElement(s.is,s)})),{}})()}));
//# sourceMappingURL=flatpickr-components.js.map