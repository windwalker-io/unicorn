function t(e){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(e)}function e(t){return function(t){if(Array.isArray(t))return n(t)}(t)||function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||function(t,e){if(!t)return;if("string"==typeof t)return n(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);"Object"===r&&t.constructor&&(r=t.constructor.name);if("Map"===r||"Set"===r)return Array.from(t);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return n(t,e)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function n(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function r(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function o(e,n){return!n||"object"!==t(n)&&"function"!=typeof n?i(e):n}function i(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function c(t){var e="function"==typeof Map?new Map:void 0;return(c=function(t){if(null===t||(n=t,-1===Function.toString.call(n).indexOf("[native code]")))return t;var n;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==e){if(e.has(t))return e.get(t);e.set(t,r)}function r(){return u(t,arguments,f(this).constructor)}return r.prototype=Object.create(t.prototype,{constructor:{value:r,enumerable:!1,writable:!0,configurable:!0}}),l(r,t)})(t)}function u(t,e,n){return(u=a()?Reflect.construct:function(t,e,n){var r=[null];r.push.apply(r,e);var o=new(Function.bind.apply(t,r));return n&&l(o,n.prototype),o}).apply(null,arguments)}function a(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}function l(t,e){return(l=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function f(t){return(f=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var s=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&l(t,e)}(h,c(HTMLElement));var n,u,s,p,y,m=(n=h,u=a(),function(){var t,e=f(n);if(u){var r=f(this).constructor;t=Reflect.construct(e,arguments,r)}else t=e.apply(this,arguments);return o(this,t)});function h(){var t,e,n,r;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,h),t=m.call(this),e=i(t),r=void 0,(n="instance")in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,t}return s=h,y=[{key:"is",get:function(){return"uni-flatpickr"}}],(p=[{key:"selector",get:function(){return this.getAttribute("selector")||"input"}},{key:"getOptions",value:function(){var t=this,e={},n=["selector"];return this.getAttributeNames().forEach((function(r){-1===n.indexOf(r)&&(e[r]=t.getAttribute(r))})),e}},{key:"connectedCallback",value:function(){var t=this,e=JSON.parse(this.getAttribute("options"));this.handleOptions(e).then((function(e){t.instance=flatpickr(t.querySelector(t.selector),e)}))}},{key:"handleOptions",value:function(t){return t.monthSelect?Promise.all([System.import("@flatpickr/plugins/monthSelect/index.js?61efccdaf4ca04c4a8af578b"),System.import("@flatpickr/plugins/monthSelect/style.css")]).then((function(n){var r=n[1].default;return document.adoptedStyleSheets=[].concat(e(document.adoptedStyleSheets),[r]),t.plugins=t.plugins||[],"boolean"==typeof t.monthSelect&&(t.monthSelect={shorthand:!0,dateFormat:"Y-m",altFormat:"Y-m"}),t.plugins.push(new monthSelectPlugin(t.monthSelect)),t})):Promise.resolve(t)}},{key:"getInstance",value:function(){return this.instance}}])&&r(s.prototype,p),y&&r(s,y),h}();Promise.all([System.import("@flatpickr/flatpickr.js?61efccdaf4ca04c4a8af578b"),System.import("@flatpickr/flatpickr.css")]).then((function(t){var n=t[1].default;document.adoptedStyleSheets=[].concat(e(document.adoptedStyleSheets),[n]),customElements.define(s.is,s)}));
//# sourceMappingURL=flatpickr-components.js.map
