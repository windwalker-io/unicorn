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
		exports["UIBootstrap5"] = factory();
	else
		root["UIBootstrap5"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/modules/ui/ui-bootstrap5.ts":
/*!*****************************************!*\
  !*** ./src/modules/ui/ui-bootstrap5.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   UIBootstrap5: () => (/* binding */ UIBootstrap5)\n/* harmony export */ });\nclass UIBootstrap5 {\n    app;\n    ui;\n    static install(app) {\n        app.$ui.bootstrap = new this(app, app.$ui);\n        app.$ui.theme = app.$ui.bootstrap;\n    }\n    constructor(app, ui) {\n        this.app = app;\n        this.ui = ui;\n        //\n    }\n    get $helper() {\n        return this.app.inject('$helper');\n    }\n    get $loader() {\n        return this.app.inject('$loader');\n    }\n    renderMessage(messages, type = 'info') {\n        if (!Array.isArray(messages)) {\n            messages = [messages];\n        }\n        let text = '';\n        messages.forEach((msg) => {\n            text += `<div class=\"\">${msg}</div>`;\n        });\n        const html = this.$helper.html(`<div class=\"alert alert-${type} alert-dismissible fade show\" role=\"alert\">\n  ${text}\n  <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"alert\" aria-label=\"Close\"></button>\n</div>`);\n        const container = this.$helper.selectOne('.c-messages-container');\n        if (container) {\n            container.appendChild(html);\n        }\n    }\n    clearMessages() {\n        const container = this.$helper.selectOne('.c-messages-container');\n        if (container) {\n            container.innerHTML = '';\n        }\n    }\n    /**\n     * @see https://getbootstrap.com/docs/5.0/components/tooltips/#example-enable-tooltips-everywhere\n     */\n    tooltip(selector = '[data-bs-toggle=\"tooltip\"]', config = {}) {\n        return this.$helper.module(selector, 'bs.tooltip', (ele) => this.getOrCreateInstance(bootstrap.Tooltip, ele, config));\n    }\n    /**\n     * @param {string|Element} selector\n     * @param {object} config\n     */\n    modal(selector, config = {}) {\n        return this.$helper.module(selector, 'bs.modal', (ele) => this.getOrCreateInstance(bootstrap.Modal, ele, config));\n    }\n    collapse(selector = '[data-bs-toggle=collapse]', config = {}) {\n        return this.$helper.module(selector, 'bs.collapse', (ele) => this.getOrCreateInstance(bootstrap.Collapse, ele, config));\n    }\n    offcanvas(selector = '[data-bs-toggle=\"offcanvas\"]', config = {}) {\n        return this.$helper.module(selector, 'bs.offcanvas', (ele) => this.getOrCreateInstance(bootstrap.Offcanvas, ele, config));\n    }\n    popover(selector = '[data-bs-toggle=\"popover\"]', config = {}) {\n        return this.$helper.module(selector, 'bs.popover', (ele) => this.getOrCreateInstance(bootstrap.Popover, ele, config));\n    }\n    scrollspy(selector = '[data-bs-spy=\"scroll\"]', config = {}) {\n        return this.$helper.module(selector, 'bs.scrollspy', (ele) => this.getOrCreateInstance(bootstrap.ScrollSpy, ele, config));\n    }\n    tab(selector = '[data-bs-toggle=\"tab\"]', config = {}) {\n        return this.$helper.module(selector, 'bs.tab', (ele) => this.getOrCreateInstance(bootstrap.Tab, ele, config));\n    }\n    toast(selector = '[data-bs-toggle=\"toast\"]', config = {}) {\n        return this.$helper.module(selector, 'bs.toast', (ele) => this.getOrCreateInstance(bootstrap.Toast, ele, config));\n    }\n    keepTab(selector, config = {}) {\n        return this.$loader.import('@unicorn/bootstrap/keep-tab.js')\n            .then((m) => {\n            if (selector) {\n                return new m.LoadTab(selector, config);\n            }\n            return m;\n        });\n    }\n    async buttonRadio(selector, config = {}) {\n        let m = await this.$loader.import('@unicorn/bootstrap/button-radio.js');\n        if (selector) {\n            return m.ButtonRadio.handle(selector, config);\n        }\n        return m;\n    }\n    getMajorVersion(module) {\n        return Number(module.VERSION.split('.').shift());\n    }\n    getOrCreateInstance(module, ele, config = {}) {\n        if (this.getMajorVersion(module) <= 4) {\n            return new module(ele, config);\n        }\n        else {\n            return module.getOrCreateInstance(ele, config);\n        }\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy91aS91aS1ib290c3RyYXA1LnRzIiwibWFwcGluZ3MiOiI7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovLy4vc3JjL21vZHVsZXMvdWkvdWktYm9vdHN0cmFwNS50cy8uL3NyYy9tb2R1bGVzL3VpL3VpLWJvb3RzdHJhcDUudHM/ZTA2ZCJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgVUlCb290c3RyYXA1IHtcbiAgICBhcHA7XG4gICAgdWk7XG4gICAgc3RhdGljIGluc3RhbGwoYXBwKSB7XG4gICAgICAgIGFwcC4kdWkuYm9vdHN0cmFwID0gbmV3IHRoaXMoYXBwLCBhcHAuJHVpKTtcbiAgICAgICAgYXBwLiR1aS50aGVtZSA9IGFwcC4kdWkuYm9vdHN0cmFwO1xuICAgIH1cbiAgICBjb25zdHJ1Y3RvcihhcHAsIHVpKSB7XG4gICAgICAgIHRoaXMuYXBwID0gYXBwO1xuICAgICAgICB0aGlzLnVpID0gdWk7XG4gICAgICAgIC8vXG4gICAgfVxuICAgIGdldCAkaGVscGVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hcHAuaW5qZWN0KCckaGVscGVyJyk7XG4gICAgfVxuICAgIGdldCAkbG9hZGVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hcHAuaW5qZWN0KCckbG9hZGVyJyk7XG4gICAgfVxuICAgIHJlbmRlck1lc3NhZ2UobWVzc2FnZXMsIHR5cGUgPSAnaW5mbycpIHtcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KG1lc3NhZ2VzKSkge1xuICAgICAgICAgICAgbWVzc2FnZXMgPSBbbWVzc2FnZXNdO1xuICAgICAgICB9XG4gICAgICAgIGxldCB0ZXh0ID0gJyc7XG4gICAgICAgIG1lc3NhZ2VzLmZvckVhY2goKG1zZykgPT4ge1xuICAgICAgICAgICAgdGV4dCArPSBgPGRpdiBjbGFzcz1cIlwiPiR7bXNnfTwvZGl2PmA7XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBodG1sID0gdGhpcy4kaGVscGVyLmh0bWwoYDxkaXYgY2xhc3M9XCJhbGVydCBhbGVydC0ke3R5cGV9IGFsZXJ0LWRpc21pc3NpYmxlIGZhZGUgc2hvd1wiIHJvbGU9XCJhbGVydFwiPlxuICAke3RleHR9XG4gIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuLWNsb3NlXCIgZGF0YS1icy1kaXNtaXNzPVwiYWxlcnRcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj48L2J1dHRvbj5cbjwvZGl2PmApO1xuICAgICAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLiRoZWxwZXIuc2VsZWN0T25lKCcuYy1tZXNzYWdlcy1jb250YWluZXInKTtcbiAgICAgICAgaWYgKGNvbnRhaW5lcikge1xuICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGh0bWwpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNsZWFyTWVzc2FnZXMoKSB7XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuJGhlbHBlci5zZWxlY3RPbmUoJy5jLW1lc3NhZ2VzLWNvbnRhaW5lcicpO1xuICAgICAgICBpZiAoY29udGFpbmVyKSB7XG4gICAgICAgICAgICBjb250YWluZXIuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogQHNlZSBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy81LjAvY29tcG9uZW50cy90b29sdGlwcy8jZXhhbXBsZS1lbmFibGUtdG9vbHRpcHMtZXZlcnl3aGVyZVxuICAgICAqL1xuICAgIHRvb2x0aXAoc2VsZWN0b3IgPSAnW2RhdGEtYnMtdG9nZ2xlPVwidG9vbHRpcFwiXScsIGNvbmZpZyA9IHt9KSB7XG4gICAgICAgIHJldHVybiB0aGlzLiRoZWxwZXIubW9kdWxlKHNlbGVjdG9yLCAnYnMudG9vbHRpcCcsIChlbGUpID0+IHRoaXMuZ2V0T3JDcmVhdGVJbnN0YW5jZShib290c3RyYXAuVG9vbHRpcCwgZWxlLCBjb25maWcpKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtzdHJpbmd8RWxlbWVudH0gc2VsZWN0b3JcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gY29uZmlnXG4gICAgICovXG4gICAgbW9kYWwoc2VsZWN0b3IsIGNvbmZpZyA9IHt9KSB7XG4gICAgICAgIHJldHVybiB0aGlzLiRoZWxwZXIubW9kdWxlKHNlbGVjdG9yLCAnYnMubW9kYWwnLCAoZWxlKSA9PiB0aGlzLmdldE9yQ3JlYXRlSW5zdGFuY2UoYm9vdHN0cmFwLk1vZGFsLCBlbGUsIGNvbmZpZykpO1xuICAgIH1cbiAgICBjb2xsYXBzZShzZWxlY3RvciA9ICdbZGF0YS1icy10b2dnbGU9Y29sbGFwc2VdJywgY29uZmlnID0ge30pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuJGhlbHBlci5tb2R1bGUoc2VsZWN0b3IsICdicy5jb2xsYXBzZScsIChlbGUpID0+IHRoaXMuZ2V0T3JDcmVhdGVJbnN0YW5jZShib290c3RyYXAuQ29sbGFwc2UsIGVsZSwgY29uZmlnKSk7XG4gICAgfVxuICAgIG9mZmNhbnZhcyhzZWxlY3RvciA9ICdbZGF0YS1icy10b2dnbGU9XCJvZmZjYW52YXNcIl0nLCBjb25maWcgPSB7fSkge1xuICAgICAgICByZXR1cm4gdGhpcy4kaGVscGVyLm1vZHVsZShzZWxlY3RvciwgJ2JzLm9mZmNhbnZhcycsIChlbGUpID0+IHRoaXMuZ2V0T3JDcmVhdGVJbnN0YW5jZShib290c3RyYXAuT2ZmY2FudmFzLCBlbGUsIGNvbmZpZykpO1xuICAgIH1cbiAgICBwb3BvdmVyKHNlbGVjdG9yID0gJ1tkYXRhLWJzLXRvZ2dsZT1cInBvcG92ZXJcIl0nLCBjb25maWcgPSB7fSkge1xuICAgICAgICByZXR1cm4gdGhpcy4kaGVscGVyLm1vZHVsZShzZWxlY3RvciwgJ2JzLnBvcG92ZXInLCAoZWxlKSA9PiB0aGlzLmdldE9yQ3JlYXRlSW5zdGFuY2UoYm9vdHN0cmFwLlBvcG92ZXIsIGVsZSwgY29uZmlnKSk7XG4gICAgfVxuICAgIHNjcm9sbHNweShzZWxlY3RvciA9ICdbZGF0YS1icy1zcHk9XCJzY3JvbGxcIl0nLCBjb25maWcgPSB7fSkge1xuICAgICAgICByZXR1cm4gdGhpcy4kaGVscGVyLm1vZHVsZShzZWxlY3RvciwgJ2JzLnNjcm9sbHNweScsIChlbGUpID0+IHRoaXMuZ2V0T3JDcmVhdGVJbnN0YW5jZShib290c3RyYXAuU2Nyb2xsU3B5LCBlbGUsIGNvbmZpZykpO1xuICAgIH1cbiAgICB0YWIoc2VsZWN0b3IgPSAnW2RhdGEtYnMtdG9nZ2xlPVwidGFiXCJdJywgY29uZmlnID0ge30pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuJGhlbHBlci5tb2R1bGUoc2VsZWN0b3IsICdicy50YWInLCAoZWxlKSA9PiB0aGlzLmdldE9yQ3JlYXRlSW5zdGFuY2UoYm9vdHN0cmFwLlRhYiwgZWxlLCBjb25maWcpKTtcbiAgICB9XG4gICAgdG9hc3Qoc2VsZWN0b3IgPSAnW2RhdGEtYnMtdG9nZ2xlPVwidG9hc3RcIl0nLCBjb25maWcgPSB7fSkge1xuICAgICAgICByZXR1cm4gdGhpcy4kaGVscGVyLm1vZHVsZShzZWxlY3RvciwgJ2JzLnRvYXN0JywgKGVsZSkgPT4gdGhpcy5nZXRPckNyZWF0ZUluc3RhbmNlKGJvb3RzdHJhcC5Ub2FzdCwgZWxlLCBjb25maWcpKTtcbiAgICB9XG4gICAga2VlcFRhYihzZWxlY3RvciwgY29uZmlnID0ge30pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuJGxvYWRlci5pbXBvcnQoJ0B1bmljb3JuL2Jvb3RzdHJhcC9rZWVwLXRhYi5qcycpXG4gICAgICAgICAgICAudGhlbigobSkgPT4ge1xuICAgICAgICAgICAgaWYgKHNlbGVjdG9yKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBtLkxvYWRUYWIoc2VsZWN0b3IsIGNvbmZpZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGFzeW5jIGJ1dHRvblJhZGlvKHNlbGVjdG9yLCBjb25maWcgPSB7fSkge1xuICAgICAgICBsZXQgbSA9IGF3YWl0IHRoaXMuJGxvYWRlci5pbXBvcnQoJ0B1bmljb3JuL2Jvb3RzdHJhcC9idXR0b24tcmFkaW8uanMnKTtcbiAgICAgICAgaWYgKHNlbGVjdG9yKSB7XG4gICAgICAgICAgICByZXR1cm4gbS5CdXR0b25SYWRpby5oYW5kbGUoc2VsZWN0b3IsIGNvbmZpZyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG07XG4gICAgfVxuICAgIGdldE1ham9yVmVyc2lvbihtb2R1bGUpIHtcbiAgICAgICAgcmV0dXJuIE51bWJlcihtb2R1bGUuVkVSU0lPTi5zcGxpdCgnLicpLnNoaWZ0KCkpO1xuICAgIH1cbiAgICBnZXRPckNyZWF0ZUluc3RhbmNlKG1vZHVsZSwgZWxlLCBjb25maWcgPSB7fSkge1xuICAgICAgICBpZiAodGhpcy5nZXRNYWpvclZlcnNpb24obW9kdWxlKSA8PSA0KSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IG1vZHVsZShlbGUsIGNvbmZpZyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbW9kdWxlLmdldE9yQ3JlYXRlSW5zdGFuY2UoZWxlLCBjb25maWcpO1xuICAgICAgICB9XG4gICAgfVxufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/modules/ui/ui-bootstrap5.ts\n");

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
/******/ 	__webpack_modules__["./src/modules/ui/ui-bootstrap5.ts"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});