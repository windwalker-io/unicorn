System.register([],(function(t,e){function i(t,e,i){var s;return(e="symbol"==typeof(s=function(t,e){if("object"!=typeof t||!t)return t;var i=t[Symbol.toPrimitive];if(void 0!==i){var s=i.call(t,e||"default");if("object"!=typeof s)return s;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===e?String:Number)(t)}(e,"string"))?s:String(s))in t?Object.defineProperty(t,e,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[e]=i,t}return t("CheckboxesMultiSelect",void 0),{setters:[],execute:function(){t("CheckboxesMultiSelect",class{static handle(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return u.selectAll(t,(t=>new this(t,e)))}constructor(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};i(this,"defaultOptions",{duration:100,inputSelector:"input[type=checkbox][data-role=grid-checkbox]"}),this.$element=u.selectOne(t),this.options=Object.assign({},this.defaultOptions,e),this.boxes=this.$element.querySelectorAll(this.options.inputSelector),this.last=!1,u.selectAll(this.boxes,(t=>{t.addEventListener("click",(e=>{this.select(t,e)}))}))}select(t,e){if(this.last){if(e.shiftKey){const e=[].indexOf.call(this.boxes,t),i=[].indexOf.call(this.boxes,this.last),s=[].slice.call(this.boxes,Math.min(e,i),Math.max(e,i)+1);[].forEach.call(s,((t,e)=>{t.checked=this.last.checked}))}this.last=t}else this.last=t}})}}}));
//# sourceMappingURL=checkboxes-multi-select.js.map
