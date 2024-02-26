/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["VueComponentField"] = factory();
	else
		root["VueComponentField"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/modules/field/vue-component-field.js":
/*!**************************************************!*\
  !*** ./src/modules/field/vue-component-field.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   VueComponentField: () => (/* binding */ VueComponentField)\n/* harmony export */ });\nclass VueComponentField {\n  static async init(selector) {\n    let value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;\n    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};\n    const {\n      createApp,\n      ref,\n      reactive,\n      toRefs,\n      onMounted\n    } = Vue;\n    options = u.defaultsDeep({}, options, {\n      init: null,\n      json: false\n    });\n    let app = createApp({\n      setup(props, _ref) {\n        let {\n          emit\n        } = _ref;\n        const state = reactive({\n          value\n        });\n        const mainInput = ref(null);\n        const elPlaceholder = ref(null);\n        let storeInput;\n        onMounted(() => {\n          var _elPlaceholder$value, _elPlaceholder$value$;\n          storeInput = (_elPlaceholder$value = elPlaceholder.value) === null || _elPlaceholder$value === void 0 ? void 0 : (_elPlaceholder$value$ = _elPlaceholder$value.closest('[data-field-wrapper]')) === null || _elPlaceholder$value$ === void 0 ? void 0 : _elPlaceholder$value$.querySelector('[data-field-input]');\n        });\n        function onChange(e) {\n          emit('change', e);\n          if (storeInput) {\n            storeInput.value = options.json ? JSON.stringify(e) : e;\n            storeInput.dispatchEvent(new CustomEvent('change'));\n          }\n        }\n        function onInput(e) {\n          emit('input', e);\n          if (storeInput) {\n            storeInput.value = options.json ? JSON.stringify(e) : e;\n            storeInput.dispatchEvent(new CustomEvent('input'));\n          }\n        }\n        function onInvalid(e) {\n          var _storeInput;\n          emit('invalid', e);\n          (_storeInput = storeInput) === null || _storeInput === void 0 ? void 0 : _storeInput.dispatchEvent(new CustomEvent('invalid'));\n        }\n        function callGlobal(funcName) {\n          return function () {\n            return window[funcName](...arguments);\n          };\n        }\n        function unicornEvent(eventName) {\n          return function () {\n            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {\n              args[_key] = arguments[_key];\n            }\n            return u.trigger(eventName, ...args);\n          };\n        }\n        return {\n          ...toRefs(state),\n          elPlaceholder,\n          mainInput,\n          onChange,\n          onInput,\n          onInvalid,\n          callGlobal,\n          unicornEvent\n        };\n      }\n    });\n    if (options.init) {\n      app = (await options.init(app)) || app;\n    }\n    app.mount(selector);\n  }\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy9maWVsZC92dWUtY29tcG9uZW50LWZpZWxkLmpzIiwibWFwcGluZ3MiOiI7Ozs7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vVnVlQ29tcG9uZW50RmllbGQvLi9zcmMvbW9kdWxlcy9maWVsZC92dWUtY29tcG9uZW50LWZpZWxkLmpzP2I1OTkiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIFZ1ZUNvbXBvbmVudEZpZWxkIHtcbiAgc3RhdGljIGFzeW5jIGluaXQoc2VsZWN0b3IsIHZhbHVlID0gbnVsbCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgeyBjcmVhdGVBcHAsIHJlZiwgcmVhY3RpdmUsIHRvUmVmcywgb25Nb3VudGVkIH0gPSBWdWU7XG5cbiAgICBvcHRpb25zID0gdS5kZWZhdWx0c0RlZXAoe30sIG9wdGlvbnMsIHtcbiAgICAgIGluaXQ6IG51bGwsXG4gICAgICBqc29uOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIGxldCBhcHAgPSBjcmVhdGVBcHAoe1xuICAgICAgc2V0dXAocHJvcHMsIHsgZW1pdCB9KSB7XG4gICAgICAgIGNvbnN0IHN0YXRlID0gcmVhY3RpdmUoe1xuICAgICAgICAgIHZhbHVlLFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgbWFpbklucHV0ID0gcmVmKG51bGwpO1xuICAgICAgICBjb25zdCBlbFBsYWNlaG9sZGVyID0gcmVmKG51bGwpO1xuICAgICAgICBsZXQgc3RvcmVJbnB1dDtcblxuICAgICAgICBvbk1vdW50ZWQoKCkgPT4ge1xuICAgICAgICAgIHN0b3JlSW5wdXQgPSBlbFBsYWNlaG9sZGVyLnZhbHVlPy5jbG9zZXN0KCdbZGF0YS1maWVsZC13cmFwcGVyXScpPy5xdWVyeVNlbGVjdG9yKCdbZGF0YS1maWVsZC1pbnB1dF0nKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZnVuY3Rpb24gb25DaGFuZ2UoZSkge1xuICAgICAgICAgIGVtaXQoJ2NoYW5nZScsIGUpO1xuXG4gICAgICAgICAgaWYgKHN0b3JlSW5wdXQpIHtcbiAgICAgICAgICAgIHN0b3JlSW5wdXQudmFsdWUgPSBvcHRpb25zLmpzb24gPyBKU09OLnN0cmluZ2lmeShlKSA6IGU7XG4gICAgICAgICAgICBzdG9yZUlucHV0LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdjaGFuZ2UnKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gb25JbnB1dChlKSB7XG4gICAgICAgICAgZW1pdCgnaW5wdXQnLCBlKTtcblxuICAgICAgICAgIGlmIChzdG9yZUlucHV0KSB7XG4gICAgICAgICAgICBzdG9yZUlucHV0LnZhbHVlID0gb3B0aW9ucy5qc29uID8gSlNPTi5zdHJpbmdpZnkoZSkgOiBlO1xuICAgICAgICAgICAgc3RvcmVJbnB1dC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnaW5wdXQnKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gb25JbnZhbGlkKGUpIHtcbiAgICAgICAgICBlbWl0KCdpbnZhbGlkJywgZSk7XG5cbiAgICAgICAgICBzdG9yZUlucHV0Py5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnaW52YWxpZCcpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNhbGxHbG9iYWwoZnVuY05hbWUpIHtcbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIHJldHVybiB3aW5kb3dbZnVuY05hbWVdKC4uLmFyZ3MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHVuaWNvcm5FdmVudChldmVudE5hbWUpIHtcbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIHJldHVybiB1LnRyaWdnZXIoZXZlbnROYW1lLCAuLi5hcmdzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLnRvUmVmcyhzdGF0ZSksXG4gICAgICAgICAgZWxQbGFjZWhvbGRlcixcbiAgICAgICAgICBtYWluSW5wdXQsXG5cbiAgICAgICAgICBvbkNoYW5nZSxcbiAgICAgICAgICBvbklucHV0LFxuICAgICAgICAgIG9uSW52YWxpZCxcbiAgICAgICAgICBjYWxsR2xvYmFsLFxuICAgICAgICAgIHVuaWNvcm5FdmVudCxcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKG9wdGlvbnMuaW5pdCkge1xuICAgICAgYXBwID0gKGF3YWl0IG9wdGlvbnMuaW5pdChhcHApKSB8fCBhcHA7XG4gICAgfVxuXG4gICAgYXBwLm1vdW50KHNlbGVjdG9yKTtcbiAgfVxufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/modules/field/vue-component-field.js\n");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval-source-map devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/modules/field/vue-component-field.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});