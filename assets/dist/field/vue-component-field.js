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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   VueComponentField: () => (/* binding */ VueComponentField)\n/* harmony export */ });\nclass VueComponentField {\n  static async init(selector) {\n    let value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;\n    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};\n    const {\n      createApp,\n      ref,\n      reactive,\n      toRefs,\n      onMounted\n    } = Vue;\n    options = u.defaultsDeep({}, options, {\n      init: null,\n      json: false\n    });\n    let app = createApp({\n      setup(props, _ref) {\n        let {\n          emit\n        } = _ref;\n        const state = reactive({\n          value\n        });\n        const mainInput = ref(null);\n        const elPlaceholder = ref(null);\n        let storeInput;\n        onMounted(() => {\n          var _elPlaceholder$value, _elPlaceholder$value$;\n          storeInput = (_elPlaceholder$value = elPlaceholder.value) === null || _elPlaceholder$value === void 0 ? void 0 : (_elPlaceholder$value$ = _elPlaceholder$value.closest('[data-field-wrapper]')) === null || _elPlaceholder$value$ === void 0 ? void 0 : _elPlaceholder$value$.querySelector('[data-field-input]');\n        });\n        function onChange(e) {\n          emit('change', e);\n          if (storeInput) {\n            storeInput.value = options.json ? JSON.stringify(e) : e;\n            storeInput.dispatchEvent(new CustomEvent('change'));\n          }\n        }\n        function onInput(e) {\n          emit('input', e);\n          if (storeInput) {\n            storeInput.value = options.json ? JSON.stringify(e) : e;\n            storeInput.dispatchEvent(new CustomEvent('input'));\n          }\n        }\n        function onInvalid(e) {\n          var _storeInput;\n          emit('invalid', e);\n          (_storeInput = storeInput) === null || _storeInput === void 0 ? void 0 : _storeInput.dispatchEvent(new CustomEvent('invalid'));\n        }\n        function callGlobal(funcName) {\n          return function () {\n            return window[funcName](...arguments);\n          };\n        }\n        function unicornEvent(eventName) {\n          return function () {\n            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {\n              args[_key] = arguments[_key];\n            }\n            return u.trigger(eventName, ...args);\n          };\n        }\n        return {\n          ...toRefs(state),\n          elPlaceholder,\n          mainInput,\n          onChange,\n          onInput,\n          onInvalid,\n          callGlobal,\n          unicornEvent\n        };\n      }\n    });\n    if (options.init) {\n      app = (await options.init(app)) || app;\n    }\n    app.mount(selector);\n  }\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy9maWVsZC92dWUtY29tcG9uZW50LWZpZWxkLmpzIiwibWFwcGluZ3MiOiI7Ozs7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vVnVlQ29tcG9uZW50RmllbGQvLi9zcmMvbW9kdWxlcy9maWVsZC92dWUtY29tcG9uZW50LWZpZWxkLmpzP2I1OTkiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIFZ1ZUNvbXBvbmVudEZpZWxkIHtcclxuICBzdGF0aWMgYXN5bmMgaW5pdChzZWxlY3RvciwgdmFsdWUgPSBudWxsLCBvcHRpb25zID0ge30pIHtcclxuICAgIGNvbnN0IHsgY3JlYXRlQXBwLCByZWYsIHJlYWN0aXZlLCB0b1JlZnMsIG9uTW91bnRlZCB9ID0gVnVlO1xyXG5cclxuICAgIG9wdGlvbnMgPSB1LmRlZmF1bHRzRGVlcCh7fSwgb3B0aW9ucywge1xyXG4gICAgICBpbml0OiBudWxsLFxyXG4gICAgICBqc29uOiBmYWxzZSxcclxuICAgIH0pO1xyXG5cclxuICAgIGxldCBhcHAgPSBjcmVhdGVBcHAoe1xyXG4gICAgICBzZXR1cChwcm9wcywgeyBlbWl0IH0pIHtcclxuICAgICAgICBjb25zdCBzdGF0ZSA9IHJlYWN0aXZlKHtcclxuICAgICAgICAgIHZhbHVlLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnN0IG1haW5JbnB1dCA9IHJlZihudWxsKTtcclxuICAgICAgICBjb25zdCBlbFBsYWNlaG9sZGVyID0gcmVmKG51bGwpO1xyXG4gICAgICAgIGxldCBzdG9yZUlucHV0O1xyXG5cclxuICAgICAgICBvbk1vdW50ZWQoKCkgPT4ge1xyXG4gICAgICAgICAgc3RvcmVJbnB1dCA9IGVsUGxhY2Vob2xkZXIudmFsdWU/LmNsb3Nlc3QoJ1tkYXRhLWZpZWxkLXdyYXBwZXJdJyk/LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWZpZWxkLWlucHV0XScpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBvbkNoYW5nZShlKSB7XHJcbiAgICAgICAgICBlbWl0KCdjaGFuZ2UnLCBlKTtcclxuXHJcbiAgICAgICAgICBpZiAoc3RvcmVJbnB1dCkge1xyXG4gICAgICAgICAgICBzdG9yZUlucHV0LnZhbHVlID0gb3B0aW9ucy5qc29uID8gSlNPTi5zdHJpbmdpZnkoZSkgOiBlO1xyXG4gICAgICAgICAgICBzdG9yZUlucHV0LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdjaGFuZ2UnKSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBvbklucHV0KGUpIHtcclxuICAgICAgICAgIGVtaXQoJ2lucHV0JywgZSk7XHJcblxyXG4gICAgICAgICAgaWYgKHN0b3JlSW5wdXQpIHtcclxuICAgICAgICAgICAgc3RvcmVJbnB1dC52YWx1ZSA9IG9wdGlvbnMuanNvbiA/IEpTT04uc3RyaW5naWZ5KGUpIDogZTtcclxuICAgICAgICAgICAgc3RvcmVJbnB1dC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnaW5wdXQnKSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBvbkludmFsaWQoZSkge1xyXG4gICAgICAgICAgZW1pdCgnaW52YWxpZCcsIGUpO1xyXG5cclxuICAgICAgICAgIHN0b3JlSW5wdXQ/LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdpbnZhbGlkJykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY2FsbEdsb2JhbChmdW5jTmFtZSkge1xyXG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICguLi5hcmdzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB3aW5kb3dbZnVuY05hbWVdKC4uLmFyZ3MpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdW5pY29ybkV2ZW50KGV2ZW50TmFtZSkge1xyXG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICguLi5hcmdzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB1LnRyaWdnZXIoZXZlbnROYW1lLCAuLi5hcmdzKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAuLi50b1JlZnMoc3RhdGUpLFxyXG4gICAgICAgICAgZWxQbGFjZWhvbGRlcixcclxuICAgICAgICAgIG1haW5JbnB1dCxcclxuXHJcbiAgICAgICAgICBvbkNoYW5nZSxcclxuICAgICAgICAgIG9uSW5wdXQsXHJcbiAgICAgICAgICBvbkludmFsaWQsXHJcbiAgICAgICAgICBjYWxsR2xvYmFsLFxyXG4gICAgICAgICAgdW5pY29ybkV2ZW50LFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKG9wdGlvbnMuaW5pdCkge1xyXG4gICAgICBhcHAgPSAoYXdhaXQgb3B0aW9ucy5pbml0KGFwcCkpIHx8IGFwcDtcclxuICAgIH1cclxuXHJcbiAgICBhcHAubW91bnQoc2VsZWN0b3IpO1xyXG4gIH1cclxufVxyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/modules/field/vue-component-field.js\n");

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