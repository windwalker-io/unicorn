!function(e,n){if("object"==typeof exports&&"object"==typeof module)module.exports=n();else if("function"==typeof define&&define.amd)define([],n);else{var t=n();for(var i in t)("object"==typeof exports?exports:e)[i]=t[i]}}(self,(()=>(()=>{"use strict";var e={184:(e,n,t)=>{t.d(n,{Z:()=>l});var i=t(221),r=t.n(i),o=t(758),a=t.n(o)()(r());a.push([e.id,".c-file-drag{--bs-card-border-color: var(--bs-gray-400);overflow:hidden;border:1px solid var(--bs-card-border-color, #ddd)}.c-file-drag label{border:none}.c-file-drag-input{position:relative;display:inline-block;width:100%;min-height:100px;cursor:pointer}.c-file-drag-input input{position:relative;z-index:2;width:100%;margin:0;overflow:hidden;opacity:0;height:100%;cursor:pointer}.c-file-drag-input input.hover+label{background-color:#efefef}.c-file-drag-input input.is-invalid~.c-file-drag-input__label{border-color:var(--bs-danger)}.c-file-drag-input input:disabled{opacity:0;cursor:no-drop}.c-file-drag-input input:disabled+label{background-color:#eee;color:#999}.c-file-drag-input input:disabled+label button{display:none}.c-file-drag-input__label{position:absolute;top:0;bottom:0;left:0;right:0;z-index:1;padding:.375rem .75rem;color:#495057;background-color:#fff;border:1px solid var(--bs-gray-400);border-radius:.25rem;height:100%;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.5rem;transition:all .3s;cursor:pointer}.c-file-drag-input__label>span{display:inline-block;width:100%}.c-file-drag-input label::after{content:none !important}","",{version:3,sources:["webpack://./scss/field/file-drag.scss"],names:[],mappings:"AAAA,aACE,0CAAA,CAEA,eAAA,CACA,kDAAA,CAEA,mBACE,WAAA,CAIJ,mBACE,iBAAA,CACA,oBAAA,CACA,UAAA,CACA,gBAAA,CACA,cAAA,CAEA,yBACE,iBAAA,CACA,SAAA,CACA,UAAA,CACA,QAAA,CACA,eAAA,CACA,SAAA,CACA,WAAA,CACA,cAAA,CAEA,qCACE,wBAAA,CAGF,8DACE,6BAAA,CAGF,kCACE,SAAA,CACA,cAAA,CAEA,wCACE,qBAAA,CACA,UAAA,CAGF,+CACE,YAAA,CAKN,0BACE,iBAAA,CACA,KAAA,CACA,QAAA,CACA,MAAA,CACA,OAAA,CACA,SAAA,CACA,sBAAA,CACA,aAAA,CACA,qBAAA,CACA,mCAAA,CACA,oBAAA,CACA,WAAA,CACA,iBAAA,CACA,YAAA,CACA,qBAAA,CACA,kBAAA,CACA,sBAAA,CACA,SAAA,CACA,kBAAA,CACA,cAAA,CAEA,+BACE,oBAAA,CACA,UAAA,CAIJ,gCACE,uBAAA",sourcesContent:[".c-file-drag {\n  --bs-card-border-color: var(--bs-gray-400);\n\n  overflow: hidden;\n  border: 1px solid var(--bs-card-border-color, #ddd);\n\n  label {\n    border: none;\n  }\n}\n\n.c-file-drag-input {\n  position: relative;\n  display: inline-block;\n  width: 100%;\n  min-height: 100px;\n  cursor: pointer;\n\n  input {\n    position: relative;\n    z-index: 2;\n    width: 100%;\n    margin: 0;\n    overflow: hidden;\n    opacity: 0;\n    height: 100%;\n    cursor: pointer;\n\n    &.hover + label {\n      background-color: #efefef;\n    }\n\n    &.is-invalid ~ .c-file-drag-input__label {\n      border-color: var(--bs-danger);\n    }\n\n    &:disabled {\n      opacity: 0;\n      cursor: no-drop;\n\n      + label {\n        background-color: #eee;\n        color: #999;\n      }\n\n      + label button {\n        display: none;\n      }\n    }\n  }\n\n  &__label {\n    position: absolute;\n    top: 0;\n    bottom: 0;\n    left: 0;\n    right: 0;\n    z-index: 1;\n    padding: .375rem .75rem;\n    color: #495057;\n    background-color: #fff;\n    border: 1px solid var(--bs-gray-400);\n    border-radius: .25rem;\n    height: 100%;\n    text-align: center;\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    justify-content: center;\n    gap: .5rem;\n    transition: all .3s;\n    cursor: pointer;\n\n    > span {\n      display: inline-block;\n      width: 100%;\n    }\n  }\n\n  label::after {\n    content: none !important;\n  }\n\n  &__button {\n    //font-size: .85rem;\n    //padding: .25rem .5rem;\n\n    //--bs-btn-border-color: var(--bs-secondary);\n    //--bs-btn-color: var(--bs-secondary);\n  }\n}\n"],sourceRoot:""}]);const l=a},758:e=>{e.exports=function(e){var n=[];return n.toString=function(){return this.map((function(n){var t="",i=void 0!==n[5];return n[4]&&(t+="@supports (".concat(n[4],") {")),n[2]&&(t+="@media ".concat(n[2]," {")),i&&(t+="@layer".concat(n[5].length>0?" ".concat(n[5]):""," {")),t+=e(n),i&&(t+="}"),n[2]&&(t+="}"),n[4]&&(t+="}"),t})).join("")},n.i=function(e,t,i,r,o){"string"==typeof e&&(e=[[null,e,void 0]]);var a={};if(i)for(var l=0;l<this.length;l++){var s=this[l][0];null!=s&&(a[s]=!0)}for(var c=0;c<e.length;c++){var d=[].concat(e[c]);i&&a[d[0]]||(void 0!==o&&(void 0===d[5]||(d[1]="@layer".concat(d[5].length>0?" ".concat(d[5]):""," {").concat(d[1],"}")),d[5]=o),t&&(d[2]?(d[1]="@media ".concat(d[2]," {").concat(d[1],"}"),d[2]=t):d[2]=t),r&&(d[4]?(d[1]="@supports (".concat(d[4],") {").concat(d[1],"}"),d[4]=r):d[4]="".concat(r)),n.push(d))}},n}},221:e=>{e.exports=function(e){var n=e[1],t=e[3];if(!t)return n;if("function"==typeof btoa){var i=btoa(unescape(encodeURIComponent(JSON.stringify(t)))),r="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(i),o="/*# ".concat(r," */");return[n].concat([o]).join("\n")}return[n].join("\n")}},278:(e,n,t)=>{var i,r=function(){var e={};return function(n){if(void 0===e[n]){var t=document.querySelector(n);if(window.HTMLIFrameElement&&t instanceof window.HTMLIFrameElement)try{t=t.contentDocument.head}catch(e){t=null}e[n]=t}return e[n]}}(),o=[];function a(e){for(var n=-1,t=0;t<o.length;t++)if(o[t].identifier===e){n=t;break}return n}function l(e,n){for(var t={},i=[],r=0;r<e.length;r++){var l=e[r],s=n.base?l[0]+n.base:l[0],c=t[s]||0,d="".concat(s," ").concat(c);t[s]=c+1;var A=a(d),u={css:l[1],media:l[2],sourceMap:l[3]};-1!==A?(o[A].references++,o[A].updater(u)):o.push({identifier:d,updater:h(u,n),references:1}),i.push(d)}return i}function s(e){var n=document.createElement("style"),i=e.attributes||{};if(void 0===i.nonce){var o=t.nc;o&&(i.nonce=o)}if(Object.keys(i).forEach((function(e){n.setAttribute(e,i[e])})),"function"==typeof e.insert)e.insert(n);else{var a=r(e.insert||"head");if(!a)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");a.appendChild(n)}return n}var c,d=(c=[],function(e,n){return c[e]=n,c.filter(Boolean).join("\n")});function A(e,n,t,i){var r=t?"":i.media?"@media ".concat(i.media," {").concat(i.css,"}"):i.css;if(e.styleSheet)e.styleSheet.cssText=d(n,r);else{var o=document.createTextNode(r),a=e.childNodes;a[n]&&e.removeChild(a[n]),a.length?e.insertBefore(o,a[n]):e.appendChild(o)}}function u(e,n,t){var i=t.css,r=t.media,o=t.sourceMap;if(r?e.setAttribute("media",r):e.removeAttribute("media"),o&&"undefined"!=typeof btoa&&(i+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(o))))," */")),e.styleSheet)e.styleSheet.cssText=i;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(i))}}var p=null,f=0;function h(e,n){var t,i,r;if(n.singleton){var o=f++;t=p||(p=s(n)),i=A.bind(null,t,o,!1),r=A.bind(null,t,o,!0)}else t=s(n),i=u.bind(null,t,n),r=function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(t)};return i(e),function(n){if(n){if(n.css===e.css&&n.media===e.media&&n.sourceMap===e.sourceMap)return;i(e=n)}else r()}}e.exports=function(e,n){(n=n||{}).singleton||"boolean"==typeof n.singleton||(n.singleton=(void 0===i&&(i=Boolean(window&&document&&document.all&&!window.atob)),i));var t=l(e=e||[],n);return function(e){if(e=e||[],"[object Array]"===Object.prototype.toString.call(e)){for(var i=0;i<t.length;i++){var r=a(t[i]);o[r].references--}for(var s=l(e,n),c=0;c<t.length;c++){var d=a(t[c]);0===o[d].references&&(o[d].updater(),o.splice(d,1))}t=s}}}}},n={};function t(i){var r=n[i];if(void 0!==r)return r.exports;var o=n[i]={id:i,exports:{}};return e[i](o,o.exports,t),o.exports}t.n=e=>{var n=e&&e.__esModule?()=>e.default:()=>e;return t.d(n,{a:n}),n},t.d=(e,n)=>{for(var i in n)t.o(n,i)&&!t.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:n[i]})},t.o=(e,n)=>Object.prototype.hasOwnProperty.call(e,n),t.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.nc=void 0;var i={};return(()=>{t.r(i);var e=t(278),n=t.n(e),r=t(184);n()(r.Z,{insert:"head",singleton:!1}),r.Z.locals;const o={maxFiles:void 0,maxSize:void 0,placeholder:"",height:125};class a extends HTMLElement{static is="uni-file-drag";element;overlayLabel;button;options;get inputSelector(){return this.getAttribute("selector")||"input[type=file]"}get multiple(){return this.element.multiple}connectedCallback(){this.element=this.querySelector(this.inputSelector),this.prepareElements();const e=JSON.parse(this.getAttribute("options")||"{}")||{};this.element.readOnly&&(this.element.disabled=!0),this.options=u.defaultsDeep({},e,o),this.bindEvent(),this.style.visibility="",this.style.height=(this.options.height||100)+"px"}bindEvent(){this.element.addEventListener("dragover",(()=>{this.element.classList.add("hover")})),this.element.addEventListener("dragleave",(()=>{this.element.classList.remove("hover")})),this.element.addEventListener("drop",(()=>{this.element.classList.remove("hover")})),this.onChange(),this.element.addEventListener("change",(e=>{this.onChange(e)})),this.element.addEventListener("input",(e=>{this.onChange(e)}))}prepareElements(){0===this.children.length&&this.createElementsLayout(),this.overlayLabel=this.querySelector("[data-overlay-label]");let e=this.overlayLabel.querySelector("button");e||(e=document.createElement("button"),e.type="button",e.setAttribute("class","c-file-drag-input__button btn btn-success btn-sm px-2 py-1"),e.innerText=u.__("unicorn.field.file.drag.button.text"),this.overlayLabel.appendChild(e)),this.button=e}createElementsLayout(){this.id||="c-file-drag-"+u.uid();const e=this.id+"__input",n=u.__("unicorn.field.file.drag.button.text"),t=u.html(`<input id="${e}" type="file" name="file" />`),i=u.html(`<label class="px-3 c-file-drag-input__label"\n        data-overlay-label\n        for="${e}">\n        <span class="label-text d-block">\n            <span class="fa fa-upload"></span>\n        </span>\n        <button type="button" class="c-file-drag-input__button btn btn-success btn-sm px-2 py-1">\n            ${n}\n        </button>\n    </label>`);this.element=t,this.overlayLabel=i,this.appendChild(t),this.appendChild(i)}onChange(e){const n=this.element.files,t=this.options.maxFiles,i=this.options.maxSize;let r=this.options.placeholder;const o=(this.element.getAttribute("accept")||this.element.getAttribute("data-accepted")||"").split(",").map((e=>e.trim())).filter((e=>e.length>0)).map((e=>-1===e.indexOf("/")&&"."===e[0]?e.substr(1):e));let a;if(r||(r=this.multiple?u.__("unicorn.field.file.drag.placeholder.multiple"):u.__("unicorn.field.file.drag.placeholder.single")),t&&n.length>t)return this.alert(u.__("unicorn.field.file.drag.message.max.files",t),"","warning"),void e?.preventDefault();let l=0;if(Array.prototype.forEach.call(n,(e=>{this.checkFileType(o,e),l+=e.size})),i&&l/1024/1024>i)return this.alert(u.__("unicorn.field.file.drag.message.max.size",i<1?1024*i+"KB":i+"MB"),"","warning"),void e?.preventDefault();a=n.length>1?`<span class="fa fa-files fa-copy"></span> ${u.__("unicorn.field.file.drag.selected",n.length)}`:1===n.length?`<span class="fa fa-file"></span> ${n[0].name}`:`<span class="fa fa-upload"></span> ${r}`,this.overlayLabel.querySelector("span").innerHTML=a}checkFileType(e,n){const t=n.name.split(".").pop();if(e.length){let i=!1;if(e.forEach((e=>{i||(-1!==e.indexOf("/")?this.compareMimeType(e,n.type)&&(i=!0):e.toLowerCase()===t.toLowerCase()&&(i=!0))})),!i)throw this.alert(u.__("unicorn.field.file.drag.message.unaccepted.files"),u.__("unicorn.field.file.drag.message.unaccepted.files.desc",e.join(", ")),"warning"),new Error("Not accepted file ext")}}compareMimeType(e,n){const t=e.split("/"),i=n.split("/");return"*"===t[1]?t[0]===i[0]:e===n}alert(e,n="",t="info"){window.swal?window.swal(e,n,t):(n&&(e+=" - "+n),alert(e))}}u.defineCustomElement(a.is,a)})(),i})()));
//# sourceMappingURL=main.js.map