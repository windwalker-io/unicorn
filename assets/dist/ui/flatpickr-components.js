!function(t,e){if("object"==typeof exports&&"object"==typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var i=e();for(var o in i)("object"==typeof exports?exports:t)[o]=i[o]}}(self,(()=>(()=>{class t extends HTMLElement{static get is(){return"uni-flatpickr"}constructor(){var t,e,i,o;super(),t=this,i=void 0,(e="symbol"==typeof(o=function(t,e){if("object"!=typeof t||!t)return t;var i=t[Symbol.toPrimitive];if(void 0!==i){var o=i.call(t,"string");if("object"!=typeof o)return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(e="instance"))?o:String(o))in t?Object.defineProperty(t,e,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[e]=i}get selector(){return this.getAttribute("selector")||"input"}get locale(){return this.getAttribute("locale")||""}getOptions(){const t={},e=["selector"];return this.getAttributeNames().forEach((i=>{-1===e.indexOf(i)&&(t[i]=this.getAttribute(i))})),t}connectedCallback(){var t;const e=JSON.parse(this.getAttribute("options"))||{};this.handleOptions(e).then((t=>{this.instance=flatpickr(this.querySelector(this.selector),t)})),null===(t=this.querySelector("[data-toggle]"))||void 0===t||t.addEventListener("click",(()=>{setTimeout((()=>{this.querySelector("[data-input]").focus()}),0)}))}handleOptions(t){const e=[];return t.monthSelect&&e.push(u.import("@flatpickr/plugins/monthSelect/index.js"),u.importCSS("@flatpickr/plugins/monthSelect/style.css")),this.locale&&e.push(u.import(`@flatpickr/l10n/${this.locale}.js`)),e.length>0?Promise.all(e).then((e=>(t.monthSelect&&(t.plugins=t.plugins||[],"boolean"==typeof t.monthSelect&&(t.monthSelect={shorthand:!0,dateFormat:"Y-m",altFormat:"Y-m"}),t.plugins.push(new monthSelectPlugin(t.monthSelect))),this.locale&&(t.locale=this.locale.replace(/-/,"_")),t))):Promise.resolve(t)}getInstance(){return this.instance}}return Promise.all([u.import("@flatpickr/flatpickr.js"),u.import("@flatpickr/flatpickr.css")]).then((e=>{const i=e[1].default;document.adoptedStyleSheets=[...document.adoptedStyleSheets,i],u.defineCustomElement(t.is,t)})),{}})()));
//# sourceMappingURL=flatpickr-components.js.map