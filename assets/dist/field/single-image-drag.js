!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var n=t();for(var r in n)("object"==typeof exports?exports:e)[r]=n[r]}}(self,(()=>(()=>{"use strict";var e={818:(e,t,n)=>{n.d(t,{Z:()=>s});var r=n(221),i=n.n(r),o=n(758),a=n.n(o)()(i());a.push([e.id,".c-sid-default__left-col{width:30%;margin-right:15px;justify-content:center}.c-sid-default__left-col img{max-height:250px}.c-sid-default__right-col{overflow:hidden}.c-sid-default__dragarea{font-weight:bold;text-align:center;padding:9% 0;color:#ccc;border:2px dashed #ccc;border-radius:7px;cursor:default}.c-sid-default__dragarea.hover{color:#333;border-color:#333;background-color:#f9f9f9}.c-sid-default__img-loader{display:flex;justify-content:center;align-items:center;width:100%;height:180px}.c-sid-default__size-info{margin-top:5px;font-size:13px}.c-sid-default__remove{margin-left:5px}.c-sid-default__modal .btn{position:relative}.c-sid-modal .modal-body{position:relative}.c-sid-modal__content{position:relative;z-index:3}.c-sid-modal__loading{position:absolute;left:0;right:0;top:0;bottom:0;display:flex;justify-content:center;align-items:center;z-index:1}\n","",{version:3,sources:["webpack://./scss/field/single-image-drag.scss"],names:[],mappings:"AAGE,yBACE,SAAU,CACV,iBAAkB,CAClB,sBAAuB,CACxB,6BAGC,gBAAiB,CAClB,0BAGC,eAAgB,CACjB,yBAGC,gBAAiB,CACjB,iBAAkB,CAClB,YAAa,CACb,UAAW,CACX,sBAAuB,CACvB,iBAAkB,CAClB,cAAe,CAPhB,+BAUG,UAAW,CACX,iBAAkB,CAClB,wBAAyB,CAC1B,2BAID,YAAa,CACb,sBAAuB,CACvB,kBAAmB,CACnB,UAAW,CACX,YAAa,CACd,0BAGC,cAAe,CACf,cAAe,CAChB,uBAGC,eAAgB,CACjB,2BAGC,iBAAkB,CACnB,yBAKC,iBAAkB,CACnB,sBAGC,iBAAkB,CAClB,SAAU,CACX,sBAGC,iBAAkB,CAClB,MAAO,CACP,OAAQ,CACR,KAAM,CACN,QAAS,CACT,YAAa,CACb,sBAAuB,CACvB,kBAAmB,CACnB,SAAU",sourcesContent:["// Part of starter file.\r\n\r\n.c-sid-default {\r\n  &__left-col {\r\n    width: 30%;\r\n    margin-right: 15px;\r\n    justify-content: center;\r\n  }\r\n\r\n  &__left-col img {\r\n    max-height: 250px;\r\n  }\r\n\r\n  &__right-col {\r\n    overflow: hidden;\r\n  }\r\n\r\n  &__dragarea {\r\n    font-weight: bold;\r\n    text-align: center;\r\n    padding: 9% 0;\r\n    color: #ccc;\r\n    border: 2px dashed #ccc;\r\n    border-radius: 7px;\r\n    cursor: default;\r\n\r\n    &.hover {\r\n      color: #333;\r\n      border-color: #333;\r\n      background-color: #f9f9f9;\r\n    }\r\n  }\r\n\r\n  &__img-loader {\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n    width: 100%;\r\n    height: 180px;\r\n  }\r\n\r\n  &__size-info {\r\n    margin-top: 5px;\r\n    font-size: 13px;\r\n  }\r\n\r\n  &__remove {\r\n    margin-left: 5px;\r\n  }\r\n\r\n  &__modal .btn {\r\n    position: relative;\r\n  }\r\n}\r\n\r\n.c-sid-modal {\r\n  .modal-body {\r\n    position: relative;\r\n  }\r\n\r\n  &__content {\r\n    position: relative;\r\n    z-index: 3;\r\n  }\r\n\r\n  &__loading {\r\n    position: absolute;\r\n    left: 0;\r\n    right: 0;\r\n    top: 0;\r\n    bottom: 0;\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n    z-index: 1;\r\n  }\r\n\r\n  &__img-container {\r\n\r\n  }\r\n}\r\n"],sourceRoot:""}]);const s=a},758:e=>{e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n="",r=void 0!==t[5];return t[4]&&(n+="@supports (".concat(t[4],") {")),t[2]&&(n+="@media ".concat(t[2]," {")),r&&(n+="@layer".concat(t[5].length>0?" ".concat(t[5]):""," {")),n+=e(t),r&&(n+="}"),t[2]&&(n+="}"),t[4]&&(n+="}"),n})).join("")},t.i=function(e,n,r,i,o){"string"==typeof e&&(e=[[null,e,void 0]]);var a={};if(r)for(var s=0;s<this.length;s++){var c=this[s][0];null!=c&&(a[c]=!0)}for(var l=0;l<e.length;l++){var u=[].concat(e[l]);r&&a[u[0]]||(void 0!==o&&(void 0===u[5]||(u[1]="@layer".concat(u[5].length>0?" ".concat(u[5]):""," {").concat(u[1],"}")),u[5]=o),n&&(u[2]?(u[1]="@media ".concat(u[2]," {").concat(u[1],"}"),u[2]=n):u[2]=n),i&&(u[4]?(u[1]="@supports (".concat(u[4],") {").concat(u[1],"}"),u[4]=i):u[4]="".concat(i)),t.push(u))}},t}},221:e=>{e.exports=function(e){var t=e[1],n=e[3];if(!n)return t;if("function"==typeof btoa){var r=btoa(unescape(encodeURIComponent(JSON.stringify(n)))),i="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(r),o="/*# ".concat(i," */"),a=n.sources.map((function(e){return"/*# sourceURL=".concat(n.sourceRoot||"").concat(e," */")}));return[t].concat(a).concat([o]).join("\n")}return[t].join("\n")}},278:(e,t,n)=>{var r,i=function(){var e={};return function(t){if(void 0===e[t]){var n=document.querySelector(t);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(e){n=null}e[t]=n}return e[t]}}(),o=[];function a(e){for(var t=-1,n=0;n<o.length;n++)if(o[n].identifier===e){t=n;break}return t}function s(e,t){for(var n={},r=[],i=0;i<e.length;i++){var s=e[i],c=t.base?s[0]+t.base:s[0],l=n[c]||0,u="".concat(c," ").concat(l);n[c]=l+1;var d=a(u),p={css:s[1],media:s[2],sourceMap:s[3]};-1!==d?(o[d].references++,o[d].updater(p)):o.push({identifier:u,updater:v(p,t),references:1}),r.push(u)}return r}function c(e){var t=document.createElement("style"),r=e.attributes||{};if(void 0===r.nonce){var o=n.nc;o&&(r.nonce=o)}if(Object.keys(r).forEach((function(e){t.setAttribute(e,r[e])})),"function"==typeof e.insert)e.insert(t);else{var a=i(e.insert||"head");if(!a)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");a.appendChild(t)}return t}var l,u=(l=[],function(e,t){return l[e]=t,l.filter(Boolean).join("\n")});function d(e,t,n,r){var i=n?"":r.media?"@media ".concat(r.media," {").concat(r.css,"}"):r.css;if(e.styleSheet)e.styleSheet.cssText=u(t,i);else{var o=document.createTextNode(i),a=e.childNodes;a[t]&&e.removeChild(a[t]),a.length?e.insertBefore(o,a[t]):e.appendChild(o)}}function p(e,t,n){var r=n.css,i=n.media,o=n.sourceMap;if(i?e.setAttribute("media",i):e.removeAttribute("media"),o&&"undefined"!=typeof btoa&&(r+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(o))))," */")),e.styleSheet)e.styleSheet.cssText=r;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(r))}}var f=null,h=0;function v(e,t){var n,r,i;if(t.singleton){var o=h++;n=f||(f=c(t)),r=d.bind(null,n,o,!1),i=d.bind(null,n,o,!0)}else n=c(t),r=p.bind(null,n,t),i=function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(n)};return r(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;r(e=t)}else i()}}e.exports=function(e,t){(t=t||{}).singleton||"boolean"==typeof t.singleton||(t.singleton=(void 0===r&&(r=Boolean(window&&document&&document.all&&!window.atob)),r));var n=s(e=e||[],t);return function(e){if(e=e||[],"[object Array]"===Object.prototype.toString.call(e)){for(var r=0;r<n.length;r++){var i=a(n[r]);o[i].references--}for(var c=s(e,t),l=0;l<n.length;l++){var u=a(n[l]);0===o[u].references&&(o[u].updater(),o.splice(u,1))}n=c}}}}},t={};function n(r){var i=t[r];if(void 0!==i)return i.exports;var o=t[r]={id:r,exports:{}};return e[r](o,o.exports,n),o.exports}n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.nc=void 0;var r={};return(()=>{n.r(r);var e=n(278),t=n.n(e),i=n(818);function o(e){return o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},o(e)}function a(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function s(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function c(e,t){if(t&&("object"===o(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return l(e)}function l(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function d(e){var t="function"==typeof Map?new Map:void 0;return d=function(e){if(null===e||(n=e,-1===Function.toString.call(n).indexOf("[native code]")))return e;var n;if("function"!=typeof e)throw new TypeError("Super expression must either be null or a function");if(void 0!==t){if(t.has(e))return t.get(e);t.set(e,r)}function r(){return p(e,arguments,v(this).constructor)}return r.prototype=Object.create(e.prototype,{constructor:{value:r,enumerable:!1,writable:!0,configurable:!0}}),h(r,e)},d(e)}function p(e,t,n){return p=f()?Reflect.construct:function(e,t,n){var r=[null];r.push.apply(r,t);var i=new(Function.bind.apply(e,r));return n&&h(i,n.prototype),i},p.apply(null,arguments)}function f(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}function h(e,t){return h=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},h(e,t)}function v(e){return v=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},v(e)}function m(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}t()(i.Z,{insert:"head",singleton:!1}),i.Z.locals;var g=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&h(e,t)}(a,e);var t,n,r,i,o=(t=a,n=f(),function(){var e,r=v(t);if(n){var i=v(this).constructor;e=Reflect.construct(r,arguments,i)}else e=r.apply(this,arguments);return c(this,e)});function a(){var e;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,a),m(l(e=o.call(this)),"currentImage",""),m(l(e),"currentFile",void 0),m(l(e),"lastZoom",0),m(l(e),"valueBackup",""),e}return r=a,i=[{key:"connectedCallback",value:function(){var e=this;this.options=JSON.parse(this.getAttribute("options")||"{}"),this.valueInput=this.querySelector("[data-field-input]"),this.fileInput=this.querySelector("[data-sid=file]"),this.selectButton=this.querySelector("[data-sid=select]"),this.pasteButton=this.querySelector("[data-sid=paste]"),this.dragarea=this.querySelector("[data-sid=dragarea]"),this.previewImage=this.querySelector("[data-sid=preview]"),this.removeCheckbox=this.querySelector("[data-sid=remove]"),this.modalElement=document.querySelector(this.options.modalTarget),this.modal=u.$ui.bootstrap.modal(this.modalElement),this.cropContainer=this.modalElement.querySelector('[data-sid="crop-container"]'),this.savebutton=this.modalElement.querySelector("[data-sid=save-button]"),this.modalToolbarButtons=this.modalElement.querySelectorAll("[data-sid-toolbar]");var t=function(){e.getCropper().replace(e.currentImage),e.cropContainer.style.visibility="",e.currentImage=null};bootstrap.Modal.VERSION.startsWith("5")?this.modalElement.addEventListener("shown.bs.modal",t.bind(this)):$(this.modalElement).on("shown.bs.modal",t.bind(this)),this.savebutton.addEventListener("click",(function(){e.saveCropped(),e.modal.hide()})),this.bindEvents(),this.style.visibility=""}},{key:"bindEvents",value:function(){var e=this;this.dragarea.addEventListener("dragover",(function(t){t.stopPropagation(),t.preventDefault(),e.dragarea.classList.add("hover")})),this.dragarea.addEventListener("dragleave",(function(t){t.stopPropagation(),t.preventDefault(),e.dragarea.classList.remove("hover")})),this.dragarea.addEventListener("drop",(function(t){t.stopPropagation(),t.preventDefault(),e.dragarea.classList.remove("hover");var n=t.target.files||t.dataTransfer.files;e.handleFileSelect(n[0])})),this.selectButton.addEventListener("click",(function(){var t=document.createElement("input");t.setAttribute("type","file"),t.setAttribute("accept",e.getInputAccept()),t.style.display="none",t.addEventListener("change",(function(n){e.handleFileSelect(t.files[0]),t.remove()})),document.body.appendChild(t),t.click()})),this.pasteButton.addEventListener("click",(function(){navigator.clipboard.read().then((function(t){var n=t[0].types;if(0!==n.length){var r=(n=n.slice().sort())[0];t[0].getType(r).then((function(t){console.log(t),e.handleFileSelect(new File([t],"image.png",{type:r}))}))}else e.alert("This browser unable to get clipboard data.")}))})),this.removeCheckbox.addEventListener("click",(function(){e.removeCheckbox.checked?(e.valueBackup=e.valueInput.value,e.valueInput.value=""):(e.valueBackup=e.valueInput,e.valueInput.value=e.valueBackup)})),u.selectAll(this.modalToolbarButtons,(function(t){t.addEventListener("click",(function(n){e.toolbarClicked(t,n)}))}))}},{key:"getInputAccept",value:function(){var e=this.options.accept;return Array.isArray(e)&&(e=e.join(",")),e}},{key:"handleFileSelect",value:function(e){var t=this;if(this.checkFile(e)){if(this.options.crop){var n=new FileReader;return n.addEventListener("load",(function(n){t.cropContainer.style.visibility="hidden",t.currentImage=n.target.result,t.currentFile=e,t.modal.show()})),void n.readAsDataURL(e)}this.saveImage(e)}}},{key:"saveCropped",value:function(){var e=this;this.getCropper().getCroppedCanvas({width:this.options.width,height:this.options.height,imageSmoothingEnabled:!0}).toBlob((function(t){var n=new File([t],e.currentFile.name,{type:"image/png"});e.saveImage(n)}),"image/png")}},{key:"getCropper",value:function(){var e=this;return this.cropper=this.cropper||new Cropper(e.cropContainer.querySelector("img"),{aspectRatio:e.options.width/e.options.height,autoCropArea:1,viewMode:1,dragMode:"move",cropBoxMovable:!1,cropBoxResizable:!1,ready:function(e){}})}},{key:"toolbarClicked",value:function(e,t){var n=this.getCropper(),r=n.getData();switch(e.dataset.sidToolbar){case"zoom-in":n.zoom(.1);break;case"zoom-out":n.zoom(-.1);break;case"rotate-left":n.rotate(-90);break;case"rotate-right":n.rotate(90);break;case"scale-x":n.scaleX(-r.scaleX);break;case"scale-y":n.scaleY(-r.scaleY)}}},{key:"checkFile",value:function(e){var t=this,n=["image/jpeg","image/png","image/webp","image/avif","image/gif"];if("string"==typeof(n=this.options.accept||n)&&(n=n.split(",").map((function(e){return e.trim()}))),!n.length)return!0;var r=!1;return n.forEach((function(n){r=-1!==n.indexOf("/")?r||t.compareMimeType(n,e.type):r||n===e.extname})),!!r||(this.alert(u.__("unicorn.field.sid.message.invalid.image.title"),u.__("unicorn.field.sid.message.invalid.image.desc"),"error"),!1)}},{key:"compareMimeType",value:function(e,t){var n=e.split("/"),r=t.split("/");return"*"===n[1]?n[0]===r[0]:e===t}},{key:"checkSize",value:function(e){try{if(null!==this.options.max_width&&this.options.max_width<e.width)throw new Error(u.__("unicorn.field.sid.message.invalid.size.max.width",this.options.max_width));if(null!==this.options.min_width&&this.options.min_width>e.width)throw new Error(u.__("unicorn.field.sid.message.invalid.size.min.width",this.options.min_width));if(null!==this.options.max_height&&this.options.max_height<e.height)throw new Error(u.__("unicorn.field.sid.message.invalid.size.max.height",this.options.max_height));if(null!==this.options.min_height&&this.options.min_height>e.height)throw new Error(u.__("unicorn.field.sid.message.invalid.size.min.height",this.options.min_height))}catch(e){return this.alert(u.__("unicorn.field.sid.message.invalid.size.title"),e.message,"error"),!1}return!0}},{key:"alert",value:function(e){function t(t){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}((function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"info",r=window.swal||window.alert;return window.swal?r(e,t,n):(t&&(e+=" - "+t),alert(e),Promise.resolve())}))},{key:"saveImage",value:function(e){var t=this;if(this.options.ajax_url){var n=this.querySelector("[data-sid=file-uploading]");return this.previewImage.src="",this.previewImage.style.display="none",n.style.display="flex",void this.uploadImage(e).then((function(e){t.storeValue(e.data.data.url,e.data.data.url)})).catch((function(e){console.error(e),t.alert(e.message)})).then((function(){n.style.display="none"}))}var r=new DataTransfer;r.items.add(e),this.fileInput.files=r.files,this.fileInput.dispatchEvent(new CustomEvent("change")),this.fileInput.dispatchEvent(new CustomEvent("input")),this.storeValue(null,URL.createObjectURL(e))}},{key:"uploadImage",value:function(e){var t=new FormData;return t.append("file",e),u.$http.post(this.options.ajax_url,t,{headers:{"Content-Type":"multipart/form-data"}})}},{key:"storeValue",value:function(e,t){this.previewImage.src=t,this.previewImage.style.display="inline-block",this.removeCheckbox.checked=!1,e&&(this.valueInput.value=e),this.previewImage.dispatchEvent(new CustomEvent("change")),this.valueInput.dispatchEvent(new CustomEvent("change"))}}],i&&s(r.prototype,i),Object.defineProperty(r,"prototype",{writable:!1}),a}(d(HTMLElement));m(g,"is","uni-sid"),Promise.all([u.import("@cropperjs/cropper.min.js"),u.import("@cropperjs/cropper.css")]).then((function(e){var t,n=e[1].default;document.adoptedStyleSheets=[].concat(function(e){if(Array.isArray(e))return a(e)}(t=document.adoptedStyleSheets)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(t)||function(e,t){if(e){if("string"==typeof e)return a(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?a(e,t):void 0}}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}(),[n])})),u.defineCustomElement(g.is,g)})(),r})()));
//# sourceMappingURL=single-image-drag.js.map