System.register([],(function(e,t){function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function l(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}return{setters:[],execute:function(){e("CheckboxesMultiSelect",function(){function e(t){var i=this,s=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};n(this,e),l(this,"defaultOptions",{duration:100,inputSelector:"input[type=checkbox][data-role=grid-checkbox]"}),this.$element=u.selectOne(t),this.options=Object.assign({},this.defaultOptions,s),this.boxes=this.$element.querySelectorAll(this.options.inputSelector),this.last=!1,u.selectAll(this.boxes,(function(e){e.addEventListener("click",(function(t){i.select(e,t)}))}))}var t,s,c;return t=e,c=[{key:"handle",value:function(e){var t=this,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return u.selectAll(e,(function(e){return new t(e,n)}))}}],(s=[{key:"select",value:function(e,t){var n=this;if(this.last){if(t.shiftKey){var i=[].indexOf.call(this.boxes,e),l=[].indexOf.call(this.boxes,this.last),s=[].slice.call(this.boxes,Math.min(i,l),Math.max(i,l)+1);[].forEach.call(s,(function(e,t){e.checked=n.last.checked}))}this.last=e}else this.last=e}}])&&i(t.prototype,s),c&&i(t,c),Object.defineProperty(t,"prototype",{writable:!1}),e}())}}}));
//# sourceMappingURL=checkboxes-multi-select.js.map
