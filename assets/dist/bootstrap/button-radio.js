System.register([],(function(t,e){var n;function r(t){return function(t){if(Array.isArray(t))return a(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||function(t,e){if(!t)return;if("string"==typeof t)return a(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return a(t,e)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function a(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function s(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function o(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}return{setters:[],execute:function(){n={selector:".btn-group .radio",buttonClass:"btn",activeClass:"active",color:{default:"btn-default btn-outline-secondary",green:"btn-success",red:"btn-danger",blue:"btn-primary"}},t("ButtonRadio",function(){function t(e,a){var s=this;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),o(this,"wrapper",null),o(this,"radios",[]),o(this,"inputs",[]),o(this,"buttons",[]),o(this,"colors",[]),this.element=u.selectOne(e),this.options=a=u.defaultsDeep({},a,n);var l=null;l=null!=this.element.dataset.fieldInput?this.element:this.element.querySelector("[data-field-input]"),this.wrapper=l;var i=l.querySelector(".btn-group"),c=null!=i;i||(i=u.h("div",{class:"btn-group"})),this.radios=l.querySelectorAll(".radio"),this.radios.forEach((function(t){var e=s.prepareButton(t,c);c||i.appendChild(e)})),this.syncState(),l.insertBefore(i,l.firstChild),l.dispatchEvent(new Event("button-radio.loaded")),this.colors=r(new Set(this.colors))}var e,a,l;return e=t,a=[{key:"prepareButton",value:function(t){var e,n=this,a=arguments.length>1&&void 0!==arguments[1]&&arguments[1],s=this.options,o=t.querySelector("input"),l=t.querySelector("label"),i=null;a?(e=(i=this.wrapper.querySelector('[data-for="'.concat(o.id,'"]'))).classList).add.apply(e,r(this.parseClasses("".concat(s.buttonClass," ").concat(s.color.default)))):i=u.h("button",{type:"button",class:"".concat(s.buttonClass," ").concat(s.color.default),"data-value":o.value},"<span>".concat(l.innerHTML,"</span>")),u.$helper.set(i,"__unicorn.input",o),this.inputs.push(o),this.buttons.push(i),t.style.display="none";var c=o.dataset.colorClass;if(null==c){switch(o.value){case"":c=s.color.blue;break;case"0":c=s.color.red;break;default:c=s.color.green}o.dataset.colorClass=c}return this.colors.push(c),o.disabled&&i.classList.add("disabled"),o.getAttribute("readonly")&&i.classList.add("readonly"),i.addEventListener("click",(function(){o.getAttribute("disabled")||o.getAttribute("readonly")||!o.checked&&(n.inputs.forEach((function(t){t.checked=!1})),o.checked=!0,n.syncState(),o.dispatchEvent(new Event("change")),o.dispatchEvent(new Event("input")))})),i}},{key:"syncState",value:function(){var t=this,e=this.options;this.buttons.forEach((function(n){var a,s,o,l,i,c,d=u.$helper.get(n,"__unicorn.input");(a=n.classList).add.apply(a,r(t.parseClasses(e.color.default))),(s=n.classList).remove.apply(s,r(t.parseClasses(e.activeClass))),(o=n.classList).remove.apply(o,r(t.parseClasses.apply(t,r(t.colors)))),d.checked&&((l=n.classList).add.apply(l,r(t.parseClasses(e.activeClass))),(i=n.classList).add.apply(i,r(t.parseClasses(d.dataset.colorClass))),(c=n.classList).remove.apply(c,r(t.parseClasses(e.color.default))))}))}},{key:"parseClasses",value:function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];return(e=e.join(" ")).split(" ").filter((function(t){return""!==t}))}}],l=[{key:"handle",value:function(t){var e=this,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return u.getBoundedInstance(t,"button-radio",(function(t){return new e(t,n)}))}}],a&&s(e.prototype,a),l&&s(e,l),t}())}}}));
//# sourceMappingURL=button-radio.js.map
