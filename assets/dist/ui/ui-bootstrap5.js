/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
System.register([], function(__WEBPACK_DYNAMIC_EXPORT__, __system_context__) {


	return {

		execute: function() {
			__WEBPACK_DYNAMIC_EXPORT__(
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/modules/ui/ui-bootstrap5.js":
/*!*****************************************!*\
  !*** ./src/modules/ui/ui-bootstrap5.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   UIBootstrap5: () => (/* binding */ UIBootstrap5)\n/* harmony export */ });\nclass UIBootstrap5 {\n  static install(app) {\n    app.$ui.bootstrap = new this(app.$ui);\n    app.$ui.theme = new this(app.$ui);\n  }\n  constructor(ui) {\n    this.ui = ui;\n    this.app = ui.app;\n  }\n  renderMessage(messages) {\n    let type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'info';\n    if (!Array.isArray(messages)) {\n      messages = [messages];\n    }\n    let text = '';\n    messages.forEach(msg => {\n      text += `<div class=\"\">${msg}</div>`;\n    });\n    const html = this.app.html(`<div class=\"alert alert-${type} alert-dismissible fade show\" role=\"alert\">\n  ${text}\n  <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"alert\" aria-label=\"Close\"></button>\n</div>`);\n    const container = this.app.selectOne('.c-messages-container');\n    if (container) {\n      container.appendChild(html);\n    }\n  }\n  clearMessages() {\n    const container = this.app.selectOne('.c-messages-container');\n    if (container) {\n      container.innerHTML = '';\n    }\n  }\n  tooltip() {\n    let selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-bs-toggle=\"tooltip\"]';\n    let config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n    return this.app.module(selector, 'bs.tooltip', ele => this.getOrCreateInstance(bootstrap.Tooltip, ele, config));\n  }\n  modal(selector) {\n    let config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n    return this.app.module(selector, 'bs.modal', ele => this.getOrCreateInstance(bootstrap.Modal, ele, config));\n  }\n  collapse() {\n    let selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-bs-toggle=collapse]';\n    let config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n    return this.app.module(selector, 'bs.collapse', ele => this.getOrCreateInstance(bootstrap.Collapse, ele, config));\n  }\n  offcanvas() {\n    let selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-bs-toggle=\"offcanvas\"]';\n    let config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n    return this.app.module(selector, 'bs.offcanvas', ele => this.getOrCreateInstance(bootstrap.Offcanvas, ele, config));\n  }\n  popover() {\n    let selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-bs-toggle=\"popover\"]';\n    let config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n    return this.app.module(selector, 'bs.popover', ele => this.getOrCreateInstance(bootstrap.Popover, ele, config));\n  }\n  scrollspy() {\n    let selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-bs-spy=\"scroll\"]';\n    let config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n    return this.app.module(selector, 'bs.scrollspy', ele => this.getOrCreateInstance(bootstrap.Scrollspy, ele, config));\n  }\n  tab() {\n    let selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-bs-toggle=\"tab\"]';\n    let config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n    return this.app.module(selector, 'bs.tab', ele => this.getOrCreateInstance(bootstrap.Tab, ele, config));\n  }\n  toast() {\n    let selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-bs-toggle=\"toast\"]';\n    let config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n    return this.app.module(selector, 'bs.toast', ele => this.getOrCreateInstance(bootstrap.Toast, ele, config));\n  }\n  keepTab() {\n    let selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;\n    let config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n    return this.app.import('@unicorn/bootstrap/keep-tab.js').then(m => {\n      if (selector) {\n        return new m.LoadTab(selector, config);\n      }\n      return m;\n    });\n  }\n  buttonRadio() {\n    let selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;\n    let config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n    return this.app.import('@unicorn/bootstrap/button-radio.js').then(m => {\n      if (selector) {\n        return m.ButtonRadio.handle(selector, config);\n      }\n      return m;\n    });\n  }\n  getMajorVersion(module) {\n    return Number(module.VERSION.split('.').shift());\n  }\n  getOrCreateInstance(module, ele, config) {\n    if (this.getMajorVersion(module) <= 4) {\n      return new module(ele, config);\n    } else {\n      return module.getOrCreateInstance(ele, config);\n    }\n  }\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy91aS91aS1ib290c3RyYXA1LmpzIiwibWFwcGluZ3MiOiI7Ozs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFRQTtBQUFBO0FBQUE7QUFDQTtBQUtBO0FBTUE7QUFBQTtBQUNBO0FBS0E7QUFNQTtBQUFBO0FBQUE7QUFDQTtBQUtBO0FBTUE7QUFBQTtBQUFBO0FBQ0E7QUFLQTtBQU1BO0FBQUE7QUFBQTtBQUNBO0FBS0E7QUFNQTtBQUFBO0FBQUE7QUFDQTtBQUtBO0FBTUE7QUFBQTtBQUFBO0FBQ0E7QUFLQTtBQU1BO0FBQUE7QUFBQTtBQUNBO0FBS0E7QUFNQTtBQUFBO0FBQUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQU1BO0FBQUE7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL0B3aW5kd2Fsa2VyLWlvL3VuaWNvcm4vLi9zcmMvbW9kdWxlcy91aS91aS1ib290c3RyYXA1LmpzPzczYmMiXSwic291cmNlc0NvbnRlbnQiOlsiXG5leHBvcnQgY2xhc3MgVUlCb290c3RyYXA1IHtcbiAgc3RhdGljIGluc3RhbGwoYXBwKSB7XG4gICAgYXBwLiR1aS5ib290c3RyYXAgPSBuZXcgdGhpcyhhcHAuJHVpKTtcbiAgICBhcHAuJHVpLnRoZW1lID0gbmV3IHRoaXMoYXBwLiR1aSk7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcih1aSkge1xuICAgIHRoaXMudWkgPSB1aTtcbiAgICB0aGlzLmFwcCA9IHVpLmFwcDtcbiAgfVxuXG4gIHJlbmRlck1lc3NhZ2UobWVzc2FnZXMsIHR5cGUgPSAnaW5mbycpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkobWVzc2FnZXMpKSB7XG4gICAgICBtZXNzYWdlcyA9IFsgbWVzc2FnZXMgXTtcbiAgICB9XG5cbiAgICBsZXQgdGV4dCA9ICcnO1xuXG4gICAgbWVzc2FnZXMuZm9yRWFjaCgobXNnKSA9PiB7XG4gICAgICB0ZXh0ICs9IGA8ZGl2IGNsYXNzPVwiXCI+JHttc2d9PC9kaXY+YDtcbiAgICB9KTtcblxuICAgIGNvbnN0IGh0bWwgPSB0aGlzLmFwcC5odG1sKGA8ZGl2IGNsYXNzPVwiYWxlcnQgYWxlcnQtJHt0eXBlfSBhbGVydC1kaXNtaXNzaWJsZSBmYWRlIHNob3dcIiByb2xlPVwiYWxlcnRcIj5cbiAgJHt0ZXh0fVxuICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0bi1jbG9zZVwiIGRhdGEtYnMtZGlzbWlzcz1cImFsZXJ0XCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+PC9idXR0b24+XG48L2Rpdj5gKTtcblxuICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuYXBwLnNlbGVjdE9uZSgnLmMtbWVzc2FnZXMtY29udGFpbmVyJyk7XG5cbiAgICBpZiAoY29udGFpbmVyKSB7XG4gICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoaHRtbCk7XG4gICAgfVxuICB9XG5cbiAgY2xlYXJNZXNzYWdlcygpIHtcbiAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLmFwcC5zZWxlY3RPbmUoJy5jLW1lc3NhZ2VzLWNvbnRhaW5lcicpO1xuXG4gICAgaWYgKGNvbnRhaW5lcikge1xuICAgICAgY29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuICAgIH1cbiAgfVxuXG4gICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgIFxuICB0b29sdGlwKHNlbGVjdG9yID0gJ1tkYXRhLWJzLXRvZ2dsZT1cInRvb2x0aXBcIl0nLCBjb25maWcgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLmFwcC5tb2R1bGUoXG4gICAgICBzZWxlY3RvcixcbiAgICAgICdicy50b29sdGlwJyxcbiAgICAgIChlbGUpID0+IHRoaXMuZ2V0T3JDcmVhdGVJbnN0YW5jZShib290c3RyYXAuVG9vbHRpcCwgZWxlLCBjb25maWcpXG4gICAgKTtcbiAgfVxuXG4gICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgIFxuICBtb2RhbChzZWxlY3RvciwgY29uZmlnID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5hcHAubW9kdWxlKFxuICAgICAgc2VsZWN0b3IsXG4gICAgICAnYnMubW9kYWwnLFxuICAgICAgKGVsZSkgPT4gdGhpcy5nZXRPckNyZWF0ZUluc3RhbmNlKGJvb3RzdHJhcC5Nb2RhbCwgZWxlLCBjb25maWcpXG4gICAgKTtcbiAgfVxuXG4gICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICBcbiAgY29sbGFwc2Uoc2VsZWN0b3IgPSAnW2RhdGEtYnMtdG9nZ2xlPWNvbGxhcHNlXScsIGNvbmZpZyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwLm1vZHVsZShcbiAgICAgIHNlbGVjdG9yLFxuICAgICAgJ2JzLmNvbGxhcHNlJyxcbiAgICAgIChlbGUpID0+IHRoaXMuZ2V0T3JDcmVhdGVJbnN0YW5jZShib290c3RyYXAuQ29sbGFwc2UsIGVsZSwgY29uZmlnKVxuICAgICk7XG4gIH1cblxuICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgXG4gIG9mZmNhbnZhcyhzZWxlY3RvciA9ICdbZGF0YS1icy10b2dnbGU9XCJvZmZjYW52YXNcIl0nLCBjb25maWcgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLmFwcC5tb2R1bGUoXG4gICAgICBzZWxlY3RvcixcbiAgICAgICdicy5vZmZjYW52YXMnLFxuICAgICAgKGVsZSkgPT4gdGhpcy5nZXRPckNyZWF0ZUluc3RhbmNlKGJvb3RzdHJhcC5PZmZjYW52YXMsIGVsZSwgY29uZmlnKVxuICAgICk7XG4gIH1cblxuICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgXG4gIHBvcG92ZXIoc2VsZWN0b3IgPSAnW2RhdGEtYnMtdG9nZ2xlPVwicG9wb3ZlclwiXScsIGNvbmZpZyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwLm1vZHVsZShcbiAgICAgIHNlbGVjdG9yLFxuICAgICAgJ2JzLnBvcG92ZXInLFxuICAgICAgKGVsZSkgPT4gdGhpcy5nZXRPckNyZWF0ZUluc3RhbmNlKGJvb3RzdHJhcC5Qb3BvdmVyLCBlbGUsIGNvbmZpZylcbiAgICApO1xuICB9XG5cbiAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgIFxuICBzY3JvbGxzcHkoc2VsZWN0b3IgPSAnW2RhdGEtYnMtc3B5PVwic2Nyb2xsXCJdJywgY29uZmlnID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5hcHAubW9kdWxlKFxuICAgICAgc2VsZWN0b3IsXG4gICAgICAnYnMuc2Nyb2xsc3B5JyxcbiAgICAgIChlbGUpID0+IHRoaXMuZ2V0T3JDcmVhdGVJbnN0YW5jZShib290c3RyYXAuU2Nyb2xsc3B5LCBlbGUsIGNvbmZpZylcbiAgICApO1xuICB9XG5cbiAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgIFxuICB0YWIoc2VsZWN0b3IgPSAnW2RhdGEtYnMtdG9nZ2xlPVwidGFiXCJdJywgY29uZmlnID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5hcHAubW9kdWxlKFxuICAgICAgc2VsZWN0b3IsXG4gICAgICAnYnMudGFiJyxcbiAgICAgIChlbGUpID0+IHRoaXMuZ2V0T3JDcmVhdGVJbnN0YW5jZShib290c3RyYXAuVGFiLCBlbGUsIGNvbmZpZylcbiAgICApO1xuICB9XG5cbiAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgIFxuICB0b2FzdChzZWxlY3RvciA9ICdbZGF0YS1icy10b2dnbGU9XCJ0b2FzdFwiXScsIGNvbmZpZyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwLm1vZHVsZShcbiAgICAgIHNlbGVjdG9yLFxuICAgICAgJ2JzLnRvYXN0JyxcbiAgICAgIChlbGUpID0+IHRoaXMuZ2V0T3JDcmVhdGVJbnN0YW5jZShib290c3RyYXAuVG9hc3QsIGVsZSwgY29uZmlnKVxuICAgICk7XG4gIH1cblxuICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICBcbiAga2VlcFRhYihzZWxlY3RvciA9IG51bGwsIGNvbmZpZyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwLmltcG9ydCgnQHVuaWNvcm4vYm9vdHN0cmFwL2tlZXAtdGFiLmpzJylcbiAgICAgIC50aGVuKChtKSA9PiB7XG4gICAgICAgIGlmIChzZWxlY3Rvcikge1xuICAgICAgICAgIHJldHVybiBuZXcgbS5Mb2FkVGFiKHNlbGVjdG9yLCBjb25maWcpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG07XG4gICAgICB9KTtcbiAgfVxuXG4gICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgIFxuICBidXR0b25SYWRpbyhzZWxlY3RvciA9IG51bGwsIGNvbmZpZyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwLmltcG9ydCgnQHVuaWNvcm4vYm9vdHN0cmFwL2J1dHRvbi1yYWRpby5qcycpXG4gICAgICAudGhlbigobSkgPT4ge1xuICAgICAgICBpZiAoc2VsZWN0b3IpIHtcbiAgICAgICAgICByZXR1cm4gbS5CdXR0b25SYWRpby5oYW5kbGUoc2VsZWN0b3IsIGNvbmZpZyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbTtcbiAgICAgIH0pO1xuICB9XG5cbiAgZ2V0TWFqb3JWZXJzaW9uKG1vZHVsZSkge1xuICAgIHJldHVybiBOdW1iZXIobW9kdWxlLlZFUlNJT04uc3BsaXQoJy4nKS5zaGlmdCgpKTtcbiAgfVxuXG4gIGdldE9yQ3JlYXRlSW5zdGFuY2UobW9kdWxlLCBlbGUsIGNvbmZpZykge1xuICAgIGlmICh0aGlzLmdldE1ham9yVmVyc2lvbihtb2R1bGUpIDw9IDQpIHtcbiAgICAgIHJldHVybiBuZXcgbW9kdWxlKGVsZSwgY29uZmlnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG1vZHVsZS5nZXRPckNyZWF0ZUluc3RhbmNlKGVsZSwgY29uZmlnKTtcbiAgICB9XG4gIH1cbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/modules/ui/ui-bootstrap5.js\n");

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
/******/ 	__webpack_modules__["./src/modules/ui/ui-bootstrap5.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()

			);
		}
	};
});