/*! For license information please see vue-drag-uploader.js.LICENSE.txt */
(()=>{var e={441:(e,r,t)=>{"use strict";t.r(r),t.d(r,{default:()=>s});var n=t(221),o=t.n(n),a=t(758),i=t.n(a)()(o());i.push([e.id,".vue-drag-uploader{display:flex;flex-wrap:wrap;padding:15px 5px 5px 15px;border:1px dotted #999;border-radius:4px;cursor:pointer;color:#999;min-height:250px}.vue-drag-uploader--readonly{border:1px solid #999}.vue-drag-uploader--ondrag{border:1px dotted #666;background-color:rgba(0,0,0,.05);color:#666}.vue-drag-uploader__draggable-wrapper,.vue-drag-uploader__transition-wrapper{display:flex;flex-wrap:wrap}.vue-drag-uploader__item{width:155px;height:155px;border:1px solid rgba(0,0,0,.25);border-radius:3px;cursor:pointer;margin-right:15px;margin-bottom:15px}.vue-drag-uploader .add-button{display:flex;align-items:center;text-align:center;transition:background-color .5s}.vue-drag-uploader .add-button:hover{background-color:rgba(0,0,0,.05)}.vue-drag-uploader .add-button__body{margin:0 auto}.vue-drag-uploader .add-button__icon{margin-bottom:10px}.vue-drag-uploader .add-button__text{font-size:14px}.vue-drag-uploader .preview-img{position:relative;cursor:pointer;padding:1px}.vue-drag-uploader .preview-img>*{position:absolute}.vue-drag-uploader .preview-img:hover .error-message__message{display:block;padding:10px}.vue-drag-uploader .preview-img__body{left:0;top:0;width:100%;height:100%;background:rgba(0,0,0,0) no-repeat center center;background-size:cover}.vue-drag-uploader .preview-img__title{margin:0 auto}.vue-drag-uploader .preview-img__overlay{display:flex;align-items:center;left:0;top:0;bottom:0;right:0;background-color:rgba(0,0,0,.35);opacity:0;transition:opacity .5s}.vue-drag-uploader .preview-img__overlay:hover{opacity:1}.vue-drag-uploader .preview-img__remove-icon{position:absolute;top:5px;right:5px;color:#fff;opacity:.75;transition:opacity .5s}.vue-drag-uploader .preview-img__remove-icon:hover{opacity:1}.vue-drag-uploader .preview-img__progress{height:5px;background-color:rgba(255,255,255,.8);width:100%;bottom:0;left:0}.vue-drag-uploader .preview-img__progress-bar{background-color:var(--bs-primary, #007bff);width:0;height:100%}.vue-drag-uploader .error-message{width:100%;background-color:#dc3545;color:#fff;font-size:14px;word-break:break-all;top:calc(100% - 26px);min-height:26px}.vue-drag-uploader .error-message__notice{display:inline-block;padding:3px;text-align:center;width:100%}.vue-drag-uploader .error-message__message{display:none}","",{version:3,sources:["webpack://./scss/field/vue-drag-uploader.scss"],names:[],mappings:"AAKA,mBACE,YAAA,CACA,cAAA,CACA,yBAAA,CACA,sBAAA,CACA,iBAAA,CACA,cAAA,CACA,UAAA,CACA,gBAAA,CAEA,6BACE,qBAAA,CAGF,2BACE,sBAAA,CACA,gCAAA,CACA,UAAA,CAGF,6EAEE,YAAA,CACA,cAAA,CAGF,yBACE,WA9BQ,CA+BR,YA9BS,CA+BT,gCAAA,CACA,iBAAA,CACA,cAAA,CACA,iBAAA,CACA,kBAAA,CAGF,+BACE,YAAA,CACA,kBAAA,CACA,iBAAA,CACA,+BAAA,CAEA,qCACE,gCAAA,CAGF,qCACE,aAAA,CAGF,qCACE,kBAAA,CAGF,qCACE,cAAA,CAIJ,gCACE,iBAAA,CACA,cAAA,CACA,WAAA,CAEA,kCACE,iBAAA,CAKE,8DACE,aAAA,CACA,YAAA,CAKN,sCACE,MAAA,CACA,KAAA,CACA,UAAA,CACA,WAAA,CACA,gDAAA,CACA,qBAAA,CAGF,uCACE,aAAA,CAGF,yCACE,YAAA,CACA,kBAAA,CACA,MAAA,CACA,KAAA,CACA,QAAA,CACA,OAAA,CACA,gCAAA,CACA,SAAA,CACA,sBAAA,CAEA,+CACE,SAAA,CAIJ,6CACE,iBAAA,CACA,OAAA,CACA,SAAA,CACA,UAAA,CACA,WAAA,CACA,sBAAA,CAEA,mDACE,SAAA,CAIJ,0CACE,UAAA,CACA,qCAAA,CACA,UAAA,CACA,QAAA,CACA,MAAA,CAGF,8CACE,2CAAA,CACA,OAAA,CACA,WAAA,CAIJ,kCACE,UAAA,CACA,wBAAA,CACA,UAAA,CACA,cAAA,CACA,oBAAA,CACA,qBAAA,CACA,eAAA,CAEA,0CACE,oBAAA,CACA,WAAA,CACA,iBAAA,CACA,UAAA,CAGF,2CACE,YAAA",sourcesContent:["// Part of ke file.\r\n\r\n$img-width: 155px !default;\r\n$img-height: 155px !default;\r\n\r\n.vue-drag-uploader {\r\n  display: flex;\r\n  flex-wrap: wrap;\r\n  padding: 15px 5px 5px 15px;\r\n  border: 1px dotted #999;\r\n  border-radius: 4px;\r\n  cursor: pointer;\r\n  color: #999;\r\n  min-height: 250px;\r\n\r\n  &--readonly {\r\n    border: 1px solid #999;\r\n  }\r\n\r\n  &--ondrag {\r\n    border: 1px dotted #666;\r\n    background-color: rgba(0, 0, 0, .05);\r\n    color: #666;\r\n  }\r\n\r\n  &__draggable-wrapper,\r\n  &__transition-wrapper {\r\n    display: flex;\r\n    flex-wrap: wrap;\r\n  }\r\n\r\n  &__item {\r\n    width: $img-width;\r\n    height: $img-height;\r\n    border: 1px solid rgba(0, 0, 0, .25);\r\n    border-radius: 3px;\r\n    cursor: pointer;\r\n    margin-right: 15px;\r\n    margin-bottom: 15px;\r\n  }\r\n\r\n  .add-button {\r\n    display: flex;\r\n    align-items: center;\r\n    text-align: center;\r\n    transition: background-color .5s;\r\n\r\n    &:hover {\r\n      background-color: rgba(0, 0, 0, .05);\r\n    }\r\n\r\n    &__body {\r\n      margin: 0 auto;\r\n    }\r\n\r\n    &__icon {\r\n      margin-bottom: 10px;\r\n    }\r\n\r\n    &__text {\r\n      font-size: 14px;\r\n    }\r\n  }\r\n\r\n  .preview-img {\r\n    position: relative;\r\n    cursor: pointer;\r\n    padding: 1px;\r\n\r\n    > * {\r\n      position: absolute;\r\n    }\r\n\r\n    &:hover {\r\n      .error-message {\r\n        &__message {\r\n          display: block;\r\n          padding: 10px;\r\n        }\r\n      }\r\n    }\r\n\r\n    &__body {\r\n      left: 0;\r\n      top: 0;\r\n      width: 100%;\r\n      height: 100%;\r\n      background: transparent no-repeat center center;\r\n      background-size: cover;\r\n    }\r\n\r\n    &__title {\r\n      margin: 0 auto;\r\n    }\r\n\r\n    &__overlay {\r\n      display: flex;\r\n      align-items: center;\r\n      left: 0;\r\n      top: 0;\r\n      bottom: 0;\r\n      right: 0;\r\n      background-color: rgba(0, 0, 0, .35);\r\n      opacity: 0;\r\n      transition: opacity .5s;\r\n\r\n      &:hover {\r\n        opacity: 1;\r\n      }\r\n    }\r\n\r\n    &__remove-icon {\r\n      position: absolute;\r\n      top: 5px;\r\n      right: 5px;\r\n      color: white;\r\n      opacity: .75;\r\n      transition: opacity .5s;\r\n\r\n      &:hover {\r\n        opacity: 1;\r\n      }\r\n    }\r\n\r\n    &__progress {\r\n      height: 5px;\r\n      background-color: rgba(255, 255, 255, .8);\r\n      width: 100%;\r\n      bottom: 0;\r\n      left: 0;\r\n    }\r\n\r\n    &__progress-bar {\r\n      background-color: var(--bs-primary, #007bff);\r\n      width: 0;\r\n      height: 100%;\r\n    }\r\n  }\r\n\r\n  .error-message {\r\n    width: 100%;\r\n    background-color: #dc3545;\r\n    color: white;\r\n    font-size: 14px;\r\n    word-break: break-all;\r\n    top: calc(100% - 26px);\r\n    min-height: 26px;\r\n\r\n    &__notice {\r\n      display: inline-block;\r\n      padding: 3px;\r\n      text-align: center;\r\n      width: 100%;\r\n    }\r\n\r\n    &__message {\r\n      display: none;\r\n    }\r\n  }\r\n}\r\n"],sourceRoot:""}]);const s=i},758:e=>{"use strict";e.exports=function(e){var r=[];return r.toString=function(){return this.map((function(r){var t="",n=void 0!==r[5];return r[4]&&(t+="@supports (".concat(r[4],") {")),r[2]&&(t+="@media ".concat(r[2]," {")),n&&(t+="@layer".concat(r[5].length>0?" ".concat(r[5]):""," {")),t+=e(r),n&&(t+="}"),r[2]&&(t+="}"),r[4]&&(t+="}"),t})).join("")},r.i=function(e,t,n,o,a){"string"==typeof e&&(e=[[null,e,void 0]]);var i={};if(n)for(var s=0;s<this.length;s++){var l=this[s][0];null!=l&&(i[l]=!0)}for(var d=0;d<e.length;d++){var u=[].concat(e[d]);n&&i[u[0]]||(void 0!==a&&(void 0===u[5]||(u[1]="@layer".concat(u[5].length>0?" ".concat(u[5]):""," {").concat(u[1],"}")),u[5]=a),t&&(u[2]?(u[1]="@media ".concat(u[2]," {").concat(u[1],"}"),u[2]=t):u[2]=t),o&&(u[4]?(u[1]="@supports (".concat(u[4],") {").concat(u[1],"}"),u[4]=o):u[4]="".concat(o)),r.push(u))}},r}},221:e=>{"use strict";e.exports=function(e){var r=e[1],t=e[3];if(!t)return r;if("function"==typeof btoa){var n=btoa(unescape(encodeURIComponent(JSON.stringify(t)))),o="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(n),a="/*# ".concat(o," */");return[r].concat([a]).join("\n")}return[r].join("\n")}},789:(e,r)=>{"use strict";r.Z=(e,r)=>{const t=e.__vccOpts||e;for(const[e,n]of r)t[e]=n;return t}},373:(e,r,t)=>{var n=t(441);n.__esModule&&(n=n.default),"string"==typeof n&&(n=[[e.id,n,""]]),n.locals&&(e.exports=n.locals),(0,t(840).Z)("4b61d991",n,!0,{})},840:(e,r,t)=>{"use strict";function n(e,r){for(var t=[],n={},o=0;o<r.length;o++){var a=r[o],i=a[0],s={id:e+":"+o,css:a[1],media:a[2],sourceMap:a[3]};n[i]?n[i].parts.push(s):t.push(n[i]={id:i,parts:[s]})}return t}t.d(r,{Z:()=>m});var o="undefined"!=typeof document;if("undefined"!=typeof DEBUG&&DEBUG&&!o)throw new Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.");var a={},i=o&&(document.head||document.getElementsByTagName("head")[0]),s=null,l=0,d=!1,u=function(){},p=null,c="data-vue-ssr-id",A="undefined"!=typeof navigator&&/msie [6-9]\b/.test(navigator.userAgent.toLowerCase());function m(e,r,t,o){d=t,p=o||{};var i=n(e,r);return g(i),function(r){for(var t=[],o=0;o<i.length;o++){var s=i[o];(l=a[s.id]).refs--,t.push(l)}for(r?g(i=n(e,r)):i=[],o=0;o<t.length;o++){var l;if(0===(l=t[o]).refs){for(var d=0;d<l.parts.length;d++)l.parts[d]();delete a[l.id]}}}}function g(e){for(var r=0;r<e.length;r++){var t=e[r],n=a[t.id];if(n){n.refs++;for(var o=0;o<n.parts.length;o++)n.parts[o](t.parts[o]);for(;o<t.parts.length;o++)n.parts.push(h(t.parts[o]));n.parts.length>t.parts.length&&(n.parts.length=t.parts.length)}else{var i=[];for(o=0;o<t.parts.length;o++)i.push(h(t.parts[o]));a[t.id]={id:t.id,refs:1,parts:i}}}}function f(){var e=document.createElement("style");return e.type="text/css",i.appendChild(e),e}function h(e){var r,t,n=document.querySelector("style["+c+'~="'+e.id+'"]');if(n){if(d)return u;n.parentNode.removeChild(n)}if(A){var o=l++;n=s||(s=f()),r=b.bind(null,n,o,!1),t=b.bind(null,n,o,!0)}else n=f(),r=y.bind(null,n),t=function(){n.parentNode.removeChild(n)};return r(e),function(n){if(n){if(n.css===e.css&&n.media===e.media&&n.sourceMap===e.sourceMap)return;r(e=n)}else t()}}var v,C=(v=[],function(e,r){return v[e]=r,v.filter(Boolean).join("\n")});function b(e,r,t,n){var o=t?"":n.css;if(e.styleSheet)e.styleSheet.cssText=C(r,o);else{var a=document.createTextNode(o),i=e.childNodes;i[r]&&e.removeChild(i[r]),i.length?e.insertBefore(a,i[r]):e.appendChild(a)}}function y(e,r){var t=r.css,n=r.media,o=r.sourceMap;if(n&&e.setAttribute("media",n),p.ssrId&&e.setAttribute(c,r.id),o&&(t+="\n/*# sourceURL="+o.sources[0]+" */",t+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(o))))+" */"),e.styleSheet)e.styleSheet.cssText=t;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(t))}}}},r={};function t(n){var o=r[n];if(void 0!==o)return o.exports;var a=r[n]={id:n,exports:{}};return e[n](a,a.exports,t),a.exports}t.n=e=>{var r=e&&e.__esModule?()=>e.default:()=>e;return t.d(r,{a:r}),r},t.d=(e,r)=>{for(var n in r)t.o(r,n)&&!t.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:r[n]})},t.o=(e,r)=>Object.prototype.hasOwnProperty.call(e,r),t.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{"use strict";const e=Vue,r={class:"vue-drag-uploader__wrapper"},n={class:"add-button__body"},o=(0,e.createElementVNode)("div",{class:"add-button__icon"},[(0,e.createElementVNode)("span",{class:"fa fa-upload fa-2x"})],-1),a={class:"add-button__text"};t(373);const i={key:1,class:"preview-img__body d-flex justify-content-center align-items-center"},s={class:"text-center"},l={style:{"word-break":"break-word"}},d={class:"preview-img__overlay"},p={key:2,class:"preview-img__progress"},c=(0,e.createElementVNode)("span",{class:"error-message__notice"},"Upload fail",-1),A={class:"error-message__message"};function m(e,r,t){return(r=function(e){var r=function(e,r){if("object"!=typeof e||null===e)return e;var t=e[Symbol.toPrimitive];if(void 0!==t){var n=t.call(e,"string");if("object"!=typeof n)return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==typeof r?r:String(r)}(r))in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}m(class{static install(e){let r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};const t=e.$queue=new this(e,r);e.queue=t.get.bind(t)}constructor(e){let r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};m(this,"queues",{}),this.app=e,this.$options=r}create(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;if(null==name)throw new Error("Please provide a name.");return new g(e)}get(e){let r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;if(null==e)throw new Error("Please provide a name.");return this.queues[e]||(this.queues[e]=this.create(r)),this.queues[e]}set(e,r){if(null==e)throw new Error("Please provide a name.");return this.queues[e]=r,this}remove(e){return delete this.queues[e],this}all(){return this.queues}},"is","queue");class g{constructor(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;m(this,"items",[]),m(this,"maxRunning",1),m(this,"currentRunning",0),m(this,"running",!1),m(this,"observers",[]),this.maxRunning=e}push(e){const r=new Promise(((r,t)=>{this.items.push((()=>Promise.resolve(e()).then(r)))}));return this.run(),r}run(){this.running||(this.running=!0),this.pop()}pop(){const e=this.items.shift();return e?this.currentRunning>=this.maxRunning?(this.items.unshift(e),Promise.resolve()):(this.currentRunning++,this.notice(),e().then((e=>(this.endPop(),e))).catch((e=>(this.endPop(),Promise.reject(e))))):(this.running=!1,Promise.resolve())}endPop(){this.currentRunning--,this.notice(),this.pop()}clear(){return this.items=[],this.notice(),this}isEmpty(){return 0===this.items.length}get length(){return this.items.length}peek(){return this.items}observe(e){let r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return this.observers.push({handler:e,once:r.once||!1}),()=>{this.off(e)}}once(e){let r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return r.once=!0,this.observe(e,r)}onEnd(e){return this.observe(((r,t,n)=>{0===t&&0===n&&e(r,t,n)}))}notice(){return this.observers.forEach((e=>{e.handler(this,this.length,this.currentRunning)})),this.observers=this.observers.filter((e=>!0!==e.once)),this}off(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:void 0;return void 0===e?(this.observers=[],this):(this.observers=this.observers.filter((r=>r.handler!==e)),this)}}let f;f=window.swal=window.swal||function(e){alert(e+" / "+(arguments.length>1&&void 0!==arguments[1]?arguments[1]:null))};const h="completed",v={},{ref:C,reactive:b,computed:y,watch:x,toRefs:w,onMounted:_}=e,k={name:"vue-drag-uploader-item",props:{item:Object,i:Number,initState:String,uploadUrl:String,size:Number,isReadonly:Boolean,queueName:{type:String,default:"uploading"},maxConcurrent:[String,Number]},setup(e,r){let{emit:t}=r;const n=b({state:h,progress:0,messages:{error:""}});function o(){n.state="uploading";const r=(new Date).valueOf(),o=new FormData;return o.append("file",e.item.file),e.item.title=e.item.title||e.item.file.name,t("upload-start",r),u.$http.post(e.uploadUrl,o,{onUploadProgress:e=>{e.lengthComputable&&(n.progress=e.loaded/e.total,t("upload-progress",r,n.progress))}}).then((r=>{n.state=h,e.item.url=r.data.data.url,e.item.download_url=r.data.data.download_url,i.value&&(e.item.thumb_url=r.data.data.thumb_url||r.data.data.url)})).catch((e=>{console.error(e),n.state="fail",n.messages.error=e.message||xhr.responseJSON.message})).finally((()=>{e.item.file=null,t("upload-end",r)}))}n.state=e.initState,e.initState,_((()=>{if("new"===e.initState){const r=new FileReader;r.onload=r=>{e.item.thumb_url=r.target.result},r.readAsDataURL(e.item.file);const t=function(e){let r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:2;return v[e]=v[e]||new g(r),v[e]}(e.queueName,Number(e.maxConcurrent)||2);t.push((()=>o()))}}));const a=y((()=>e.item.file?e.item.file.name:e.item.title?e.item.title:e.item.url.split("/").pop())),i=y((()=>function(e){const r=e.split(".").pop().split("?").shift();return-1!==["png","jpeg","jpg","gif","bmp","webp"].indexOf(r.toLowerCase())}(e.item.file?e.item.file.name:e.item.url))),s=y((()=>({pdf:"fas fa-file-pdf text-danger",xls:"fas fa-file-excel text-success",xlsx:"fas fa-file-excel text-success",doc:"fas fa-file-word text-primary",docx:"fas fa-file-word text-primary",ppt:"fas fa-file-powerpoint text-warning",pptx:"fas fa-file-powerpoint text-warning",zip:"fas fa-file-archive text-dark","7z":"fas fa-file-archive text-dark",rar:"fas fa-file-archive text-dark",mp4:"fas fa-file-video text-dark",avi:"fas fa-file-video text-dark",flv:"fas fa-file-video text-dark",mov:"fas fa-file-video text-dark",ogg:"fas fa-file-video text-dark",webm:"fas fa-file-video text-dark",mpg:"fas fa-file-video text-dark",mp3:"fas fa-file-audio text-dark",acc:"fas fa-file-audio text-dark",wav:"fas fa-file-audio text-dark"}[(e.item.file?e.item.file.name.split(".").pop():e.item.url.split(".").pop()).toLowerCase()]||"fas fa-file")));return{...w(n),upload:o,deleteSelf:function(){e.isReadonly||t("delete",e.item)},onClick:function(r){t("item-click",e.item,e.i,r)},isImage:i,icon:s,fileName:a}}};var E=t(789);const S=(0,E.Z)(k,[["render",function(r,t,n,o,a,u){return(0,e.openBlock)(),(0,e.createElementBlock)("div",{class:"vue-drag-uploader__item preview-img",style:(0,e.normalizeStyle)({width:n.size?n.size+"px":null,height:n.size?n.size+"px":null}),onClick:t[2]||(t[2]=function(){return o.onClick&&o.onClick(...arguments)})},[(0,e.renderSlot)(r.$slots,"it",{item:n.item},(()=>[o.isImage?((0,e.openBlock)(),(0,e.createElementBlock)("div",{key:0,class:"preview-img__body",style:(0,e.normalizeStyle)({"background-image":"url("+(n.item.thumb_url||n.item.url)+")"})},null,4)):(0,e.createCommentVNode)("",!0),(0,e.createTextVNode)(),o.isImage?(0,e.createCommentVNode)("",!0):((0,e.openBlock)(),(0,e.createElementBlock)("div",i,[(0,e.createElementVNode)("div",s,[(0,e.createElementVNode)("div",null,[(0,e.createElementVNode)("span",{class:(0,e.normalizeClass)([o.icon,"fa-3x"])},null,2)]),(0,e.createTextVNode)(),(0,e.createElementVNode)("div",l,(0,e.toDisplayString)(o.fileName),1)])])),(0,e.createTextVNode)(),(0,e.createElementVNode)("div",d,[n.isReadonly?(0,e.createCommentVNode)("",!0):((0,e.openBlock)(),(0,e.createElementBlock)("span",{key:0,class:"preview-img__remove-icon fa fa-times",onClick:t[0]||(t[0]=(0,e.withModifiers)((e=>o.deleteSelf()),["stop","prevent"]))})),(0,e.createTextVNode)(),(0,e.renderSlot)(r.$slots,"extra",{item:n.item})]),(0,e.createTextVNode)(),"uploading"===r.state?((0,e.openBlock)(),(0,e.createElementBlock)("div",p,[(0,e.createElementVNode)("div",{class:"preview-img__progress-bar",style:(0,e.normalizeStyle)({width:100*r.progress+"%"})},null,4)])):(0,e.createCommentVNode)("",!0),(0,e.createTextVNode)(),"fail"===r.state?((0,e.openBlock)(),(0,e.createElementBlock)("div",{key:3,class:"preview-img__error-message error-message",onClick:t[1]||(t[1]=(0,e.withModifiers)((()=>{}),["stop","prevent"]))},[c,(0,e.createTextVNode)(),(0,e.createElementVNode)("span",A,(0,e.toDisplayString)(r.messages.error),1)])):(0,e.createCommentVNode)("",!0)]))],4)}]]),{ref:B,reactive:N,toRefs:V,onMounted:U,computed:P,watch:R}=e,z={name:"vue-drag-uploader",components:{VueDragUploaderItem:S},props:{id:String,url:String,modelValue:{type:Array,default:()=>[]},maxFiles:[String,Number],maxConcurrent:[String,Number],thumbSize:Number,placeholder:String,accept:{type:String,default:""},disabled:{default:!1},readonly:{default:!1}},setup(e,r){let{emit:t}=r;const n=B(null),o=N({items:[],uploadQueue:{}}),a=P((()=>e.modelValue));function i(){const e=new Date;return e.getTime()+"."+e.getMilliseconds()+"."+Math.random()}function s(e){Array.prototype.forEach.call(e,l),Array.prototype.forEach.call(e,(e=>{if(l(e),!p.value)return;const r={id:"",key:i(),url:"",thumb_url:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",uploadState:"new",file:e,title:"",alt:"",description:""};o.items.push(r)}))}function l(e){const r=A.value,t=e.name.split(".").pop();if(r.length){let n=!1;if(r.forEach((r=>{n||(-1!==r.indexOf("/")?d(r,e.type)&&(n=!0):r.toLowerCase()===t.toLowerCase()&&(n=!0))})),!n)throw f(u.__("unicorn.field.file.drag.message.unaccepted.files"),u.__("unicorn.field.file.drag.message.unaccepted.files.desc",r.join(", ")),"warning"),new Error("Not accepted file ext")}}function d(e,r){const t=e.split("/"),n=r.split("/");return"*"===t[1]?t[0]===n[0]:e===r}U((()=>{!function(e,r){e.value.addEventListener("dragover",(e=>{e.stopPropagation(),e.preventDefault(),e.currentTarget.classList.add("vue-drag-uploader--ondrag")})),e.value.addEventListener("dragleave",(e=>{e.stopPropagation(),e.preventDefault(),e.currentTarget.classList.remove("vue-drag-uploader--ondrag")})),e.value.addEventListener("drop",(e=>{e.stopPropagation(),e.preventDefault(),e.currentTarget.classList.remove("vue-drag-uploader--ondrag");const t=e.dataTransfer.items,n=[],o=e=>{const r=[];if(a.length,e.isDirectory){const t=e.createReader();r.push(new Promise((e=>{const r=[];t.readEntries((t=>{t.forEach((e=>{r.push(o(e))})),Promise.all(r).then(e)}))})))}else r.push(new Promise((r=>{e.file((e=>{n.push(e),r(e)}))})));return Promise.all(r)},a=[],i=[];Array.prototype.forEach.call(t,(e=>{e.webkitGetAsEntry()&&i.push(o(e.webkitGetAsEntry()))})),i.length&&Promise.all(i).then((e=>{r(n)}))}))}(n,s)})),e.modelValue.map((e=>{e.key=e.key||i(),e.uploadState=h})),o.items.push(...e.modelValue),null!=e.maxFiles&&e.maxFiles<o.items.length&&o.items.splice(e.maxFiles);const p=P((()=>(null==e.maxFiles||o.items.length<e.maxFiles)&&!m.value)),c=P((()=>(Object.keys(o.uploadQueue),Object.keys(o.uploadQueue).length>0))),A=P((()=>(Array.isArray(e.accept)?e.accept:e.accept.split(",")).map((e=>e.trim())).filter((e=>e.length>0)).map((e=>-1===e.indexOf("/")&&"."===e[0]?e.substr(1):e)))),m=P((()=>e.disabled||e.readonly));return R(a,(e=>{e.map((e=>{e.key=e.key||i()})),JSON.stringify(e)!==JSON.stringify(o.items)&&(o.items=e)}),{deep:!0}),R((()=>o.items),(e=>{t("update:modelValue",e)}),{deep:!0}),R(c,(e=>{t(e?"uploading":"uploaded")})),{el:n,...V(o),clickAdd:function(){const r=document.createElement("INPUT");r.setAttribute("id","luna-multi-uploader-selector"),r.setAttribute("type","file"),r.setAttribute("accept",e.accept),r.setAttribute("multiple",!0),r.style.display="none",r.addEventListener("change",(e=>{s(e.target.files),r.remove()})),r.addEventListener("change",(e=>{r.remove()})),document.body.appendChild(r),r.dispatchEvent(new MouseEvent("click",{view:window,bubbles:!0,cancelable:!0}))},getKey:i,uploadFiles:s,checkFile:l,compareMimeType:d,deleteItem:function(e){t("delete-item",e),o.items=o.items.filter((r=>r.key!==e.key))},uploadStart:function(e){o.uploadQueue[e]=0},uploadEnd:function(e){delete o.uploadQueue[e]},uploadProgress:function(e,r){o.uploadQueue[e]=r},itemClick:function(e,r,n){t("item-click",e,r,n)},canUpload:p,uploading:c,acceptedTypes:A,isReadonly:m}}},T=(0,E.Z)(z,[["render",function(t,i,s,l,d,u){const p=(0,e.resolveComponent)("vue-drag-uploader-item"),c=(0,e.resolveComponent)("draggable");return(0,e.openBlock)(),(0,e.createElementBlock)("div",{ref:"el",class:(0,e.normalizeClass)(["vue-drag-uploader",{"vue-drag-uploader--readonly":l.isReadonly}])},[(0,e.createElementVNode)("div",r,[(0,e.createVNode)(c,(0,e.mergeProps)({modelValue:t.items,"onUpdate:modelValue":i[1]||(i[1]=e=>t.items=e),class:"vue-drag-uploader__draggable-wrapper"},{draggable:".preview-img",animation:300},{disabled:l.isReadonly,onSort:i[2]||(i[2]=e=>t.$emit("reorder",e)),"item-key":"key"}),{item:(0,e.withCtx)((r=>{let{element:n,index:o}=r;return[((0,e.openBlock)(),(0,e.createBlock)(p,{item:n,i:o,"init-state":n.uploadState,key:n.key,ref:n.key,"upload-url":s.url,size:s.thumbSize,"is-readonly":l.isReadonly,"queue-name":s.id,"max-concurrent":s.maxConcurrent,onDelete:l.deleteItem,onUploadStart:l.uploadStart,onUploadEnd:l.uploadEnd,onUploadProgress:l.uploadProgress,onItemClick:l.itemClick,style:{"animation-duration":".3s"}},{extra:(0,e.withCtx)((()=>[(0,e.renderSlot)(t.$slots,"extra",{item:n,i:o,url:s.url,maxFiles:s.maxFiles,thumbSize:s.thumbSize,filesLimited:s.maxFiles})])),_:2},1032,["item","i","init-state","upload-url","size","is-readonly","queue-name","max-concurrent","onDelete","onUploadStart","onUploadEnd","onUploadProgress","onItemClick"]))]})),footer:(0,e.withCtx)((()=>[l.canUpload?((0,e.openBlock)(),(0,e.createElementBlock)("div",{class:"vue-drag-uploader__item add-button",key:"empty",onClick:i[0]||(i[0]=e=>l.clickAdd()),style:(0,e.normalizeStyle)({width:s.thumbSize?s.thumbSize+"px":null,height:s.thumbSize?s.thumbSize+"px":null})},[(0,e.createElementVNode)("div",n,[o,(0,e.createTextVNode)(),(0,e.createElementVNode)("div",a,(0,e.toDisplayString)(s.placeholder),1)])],4)):(0,e.createCommentVNode)("",!0)])),_:3},16,["modelValue","disabled"])])],2)}]]),F=T;window.VueDragUploader=F})()})();
//# sourceMappingURL=vue-drag-uploader.js.map