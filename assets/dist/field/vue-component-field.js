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
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/modules/field/vue-component-field.js":
/*!**************************************************!*\
  !*** ./src/modules/field/vue-component-field.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"VueComponentField\": () => (/* binding */ VueComponentField)\n/* harmony export */ });\nclass VueComponentField {\n  static async init(selector) {\n    let value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;\n    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};\n    const {\n      createApp,\n      ref,\n      reactive,\n      toRefs,\n      onMounted,\n      getCurrentInstance\n    } = Vue;\n    options = u.defaultsDeep({}, options, {\n      init: null,\n      json: false\n    });\n    let app = createApp({\n      setup(props, _ref) {\n        let {\n          emit\n        } = _ref;\n        const state = reactive({\n          value\n        });\n        const mainInput = ref(null);\n        const elPlaceholder = ref(null);\n        let storeInput;\n        onMounted(() => {\n          var _elPlaceholder$value, _elPlaceholder$value$;\n          storeInput = (_elPlaceholder$value = elPlaceholder.value) === null || _elPlaceholder$value === void 0 ? void 0 : (_elPlaceholder$value$ = _elPlaceholder$value.closest('[data-field-wrapper]')) === null || _elPlaceholder$value$ === void 0 ? void 0 : _elPlaceholder$value$.querySelector('[data-field-input]');\n        });\n        function onChange(e) {\n          emit('change', e);\n          if (storeInput) {\n            storeInput.value = options.json ? JSON.stringify(e) : e;\n            storeInput.dispatchEvent(new CustomEvent('change'));\n          }\n        }\n        function onInput(e) {\n          emit('input', e);\n          if (storeInput) {\n            storeInput.value = options.json ? JSON.stringify(e) : e;\n            storeInput.dispatchEvent(new CustomEvent('input'));\n          }\n        }\n        function onInvalid(e) {\n          var _storeInput;\n          emit('invalid', e);\n          (_storeInput = storeInput) === null || _storeInput === void 0 ? void 0 : _storeInput.dispatchEvent(new CustomEvent('invalid'));\n        }\n        return {\n          ...toRefs(state),\n          elPlaceholder,\n          mainInput,\n          onChange,\n          onInput,\n          onInvalid\n        };\n      }\n    });\n    if (options.init) {\n      app = (await options.init(app)) || app;\n    }\n    app.mount(selector);\n  }\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy9maWVsZC92dWUtY29tcG9uZW50LWZpZWxkLmpzLmpzIiwibWFwcGluZ3MiOiI7Ozs7QUFPQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Ad2luZHdhbGtlci1pby91bmljb3JuLy4vc3JjL21vZHVsZXMvZmllbGQvdnVlLWNvbXBvbmVudC1maWVsZC5qcz9iNTk5Il0sInNvdXJjZXNDb250ZW50IjpbIiAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgIFxuICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgIFxuXG5leHBvcnQgY2xhc3MgVnVlQ29tcG9uZW50RmllbGQge1xuICBzdGF0aWMgYXN5bmMgaW5pdChzZWxlY3RvciwgdmFsdWUgPSBudWxsLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCB7IGNyZWF0ZUFwcCwgcmVmLCByZWFjdGl2ZSwgdG9SZWZzLCBvbk1vdW50ZWQsIGdldEN1cnJlbnRJbnN0YW5jZSB9ID0gVnVlO1xuXG4gICAgb3B0aW9ucyA9IHUuZGVmYXVsdHNEZWVwKHt9LCBvcHRpb25zLCB7XG4gICAgICBpbml0OiBudWxsLFxuICAgICAganNvbjogZmFsc2UsXG4gICAgfSk7XG5cbiAgICBsZXQgYXBwID0gY3JlYXRlQXBwKHtcbiAgICAgIHNldHVwKHByb3BzLCB7IGVtaXQgfSkge1xuICAgICAgICBjb25zdCBzdGF0ZSA9IHJlYWN0aXZlKHtcbiAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IG1haW5JbnB1dCA9IHJlZihudWxsKTtcbiAgICAgICAgY29uc3QgZWxQbGFjZWhvbGRlciA9IHJlZihudWxsKTtcbiAgICAgICAgbGV0IHN0b3JlSW5wdXQ7XG5cbiAgICAgICAgb25Nb3VudGVkKCgpID0+IHtcbiAgICAgICAgICBzdG9yZUlucHV0ID0gZWxQbGFjZWhvbGRlci52YWx1ZT8uY2xvc2VzdCgnW2RhdGEtZmllbGQtd3JhcHBlcl0nKT8ucXVlcnlTZWxlY3RvcignW2RhdGEtZmllbGQtaW5wdXRdJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZ1bmN0aW9uIG9uQ2hhbmdlKGUpIHtcbiAgICAgICAgICBlbWl0KCdjaGFuZ2UnLCBlKTtcblxuICAgICAgICAgIGlmIChzdG9yZUlucHV0KSB7XG4gICAgICAgICAgICBzdG9yZUlucHV0LnZhbHVlID0gb3B0aW9ucy5qc29uID8gSlNPTi5zdHJpbmdpZnkoZSkgOiBlO1xuICAgICAgICAgICAgc3RvcmVJbnB1dC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnY2hhbmdlJykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIG9uSW5wdXQoZSkge1xuICAgICAgICAgIGVtaXQoJ2lucHV0JywgZSk7XG5cbiAgICAgICAgICBpZiAoc3RvcmVJbnB1dCkge1xuICAgICAgICAgICAgc3RvcmVJbnB1dC52YWx1ZSA9IG9wdGlvbnMuanNvbiA/IEpTT04uc3RyaW5naWZ5KGUpIDogZTtcbiAgICAgICAgICAgIHN0b3JlSW5wdXQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2lucHV0JykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIG9uSW52YWxpZChlKSB7XG4gICAgICAgICAgZW1pdCgnaW52YWxpZCcsIGUpO1xuXG4gICAgICAgICAgc3RvcmVJbnB1dD8uZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2ludmFsaWQnKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLnRvUmVmcyhzdGF0ZSksXG4gICAgICAgICAgZWxQbGFjZWhvbGRlcixcbiAgICAgICAgICBtYWluSW5wdXQsXG5cbiAgICAgICAgICBvbkNoYW5nZSxcbiAgICAgICAgICBvbklucHV0LFxuICAgICAgICAgIG9uSW52YWxpZCxcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKG9wdGlvbnMuaW5pdCkge1xuICAgICAgYXBwID0gKGF3YWl0IG9wdGlvbnMuaW5pdChhcHApKSB8fCBhcHA7XG4gICAgfVxuXG4gICAgYXBwLm1vdW50KHNlbGVjdG9yKTtcbiAgfVxufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/modules/field/vue-component-field.js\n");

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