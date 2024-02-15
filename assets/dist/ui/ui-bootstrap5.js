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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ UIBootstrap5)\n/* harmony export */ });\nclass UIBootstrap5 {\n    app;\n    ui;\n    static install(app) {\n        app.$ui.bootstrap = new this(app, app.$ui);\n        app.$ui.theme = app.$ui.bootstrap;\n    }\n    constructor(app, ui) {\n        this.app = app;\n        this.ui = ui;\n        //\n    }\n    get $helper() {\n        return this.app.inject('$helper');\n    }\n    get $loader() {\n        return this.app.inject('$loader');\n    }\n    renderMessage(messages, type = 'info') {\n        if (!Array.isArray(messages)) {\n            messages = [messages];\n        }\n        let text = '';\n        messages.forEach((msg) => {\n            text += `<div class=\"\">${msg}</div>`;\n        });\n        const html = this.$helper.html(`<div class=\"alert alert-${type} alert-dismissible fade show\" role=\"alert\">\n  ${text}\n  <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"alert\" aria-label=\"Close\"></button>\n</div>`);\n        const container = this.$helper.selectOne('.c-messages-container');\n        if (container) {\n            container.appendChild(html);\n        }\n    }\n    clearMessages() {\n        const container = this.$helper.selectOne('.c-messages-container');\n        if (container) {\n            container.innerHTML = '';\n        }\n    }\n    /**\n     * @see https://getbootstrap.com/docs/5.0/components/tooltips/#example-enable-tooltips-everywhere\n     */\n    tooltip(selector = '[data-bs-toggle=\"tooltip\"]', config = {}) {\n        return this.$helper.module(selector, 'bs.tooltip', (ele) => this.getOrCreateInstance(bootstrap.Tooltip, ele, config));\n    }\n    /**\n     * @param {string|Element} selector\n     * @param {object} config\n     */\n    modal(selector, config = {}) {\n        return this.$helper.module(selector, 'bs.modal', (ele) => this.getOrCreateInstance(bootstrap.Modal, ele, config));\n    }\n    collapse(selector = '[data-bs-toggle=collapse]', config = {}) {\n        return this.$helper.module(selector, 'bs.collapse', (ele) => this.getOrCreateInstance(bootstrap.Collapse, ele, config));\n    }\n    offcanvas(selector = '[data-bs-toggle=\"offcanvas\"]', config = {}) {\n        return this.$helper.module(selector, 'bs.offcanvas', (ele) => this.getOrCreateInstance(bootstrap.Offcanvas, ele, config));\n    }\n    popover(selector = '[data-bs-toggle=\"popover\"]', config = {}) {\n        return this.$helper.module(selector, 'bs.popover', (ele) => this.getOrCreateInstance(bootstrap.Popover, ele, config));\n    }\n    scrollspy(selector = '[data-bs-spy=\"scroll\"]', config = {}) {\n        return this.$helper.module(selector, 'bs.scrollspy', (ele) => this.getOrCreateInstance(bootstrap.ScrollSpy, ele, config));\n    }\n    tab(selector = '[data-bs-toggle=\"tab\"]', config = {}) {\n        return this.$helper.module(selector, 'bs.tab', (ele) => this.getOrCreateInstance(bootstrap.Tab, ele, config));\n    }\n    toast(selector = '[data-bs-toggle=\"toast\"]', config = {}) {\n        return this.$helper.module(selector, 'bs.toast', (ele) => this.getOrCreateInstance(bootstrap.Toast, ele, config));\n    }\n    keepTab(selector, config = {}) {\n        return this.$loader.import('@unicorn/bootstrap/keep-tab.js')\n            .then((m) => {\n            if (selector) {\n                return new m.LoadTab(selector, config);\n            }\n            return m;\n        });\n    }\n    async buttonRadio(selector, config = {}) {\n        let m = await this.$loader.import('@unicorn/bootstrap/button-radio.js');\n        if (selector) {\n            return m.ButtonRadio.handle(selector, config);\n        }\n        return m;\n    }\n    getMajorVersion(module) {\n        return Number(module.VERSION.split('.').shift());\n    }\n    getOrCreateInstance(module, ele, config = {}) {\n        if (this.getMajorVersion(module) <= 4) {\n            return new module(ele, config);\n        }\n        else {\n            return module.getOrCreateInstance(ele, config);\n        }\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy91aS91aS1ib290c3RyYXA1LnRzIiwibWFwcGluZ3MiOiI7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovLy4vc3JjL21vZHVsZXMvdWkvdWktYm9vdHN0cmFwNS50cy8uL3NyYy9tb2R1bGVzL3VpL3VpLWJvb3RzdHJhcDUudHM/M2YyYSJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBVSUJvb3RzdHJhcDUge1xuICAgIGFwcDtcbiAgICB1aTtcbiAgICBzdGF0aWMgaW5zdGFsbChhcHApIHtcbiAgICAgICAgYXBwLiR1aS5ib290c3RyYXAgPSBuZXcgdGhpcyhhcHAsIGFwcC4kdWkpO1xuICAgICAgICBhcHAuJHVpLnRoZW1lID0gYXBwLiR1aS5ib290c3RyYXA7XG4gICAgfVxuICAgIGNvbnN0cnVjdG9yKGFwcCwgdWkpIHtcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XG4gICAgICAgIHRoaXMudWkgPSB1aTtcbiAgICAgICAgLy9cbiAgICB9XG4gICAgZ2V0ICRoZWxwZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFwcC5pbmplY3QoJyRoZWxwZXInKTtcbiAgICB9XG4gICAgZ2V0ICRsb2FkZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFwcC5pbmplY3QoJyRsb2FkZXInKTtcbiAgICB9XG4gICAgcmVuZGVyTWVzc2FnZShtZXNzYWdlcywgdHlwZSA9ICdpbmZvJykge1xuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkobWVzc2FnZXMpKSB7XG4gICAgICAgICAgICBtZXNzYWdlcyA9IFttZXNzYWdlc107XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHRleHQgPSAnJztcbiAgICAgICAgbWVzc2FnZXMuZm9yRWFjaCgobXNnKSA9PiB7XG4gICAgICAgICAgICB0ZXh0ICs9IGA8ZGl2IGNsYXNzPVwiXCI+JHttc2d9PC9kaXY+YDtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGh0bWwgPSB0aGlzLiRoZWxwZXIuaHRtbChgPGRpdiBjbGFzcz1cImFsZXJ0IGFsZXJ0LSR7dHlwZX0gYWxlcnQtZGlzbWlzc2libGUgZmFkZSBzaG93XCIgcm9sZT1cImFsZXJ0XCI+XG4gICR7dGV4dH1cbiAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4tY2xvc2VcIiBkYXRhLWJzLWRpc21pc3M9XCJhbGVydFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPjwvYnV0dG9uPlxuPC9kaXY+YCk7XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuJGhlbHBlci5zZWxlY3RPbmUoJy5jLW1lc3NhZ2VzLWNvbnRhaW5lcicpO1xuICAgICAgICBpZiAoY29udGFpbmVyKSB7XG4gICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoaHRtbCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2xlYXJNZXNzYWdlcygpIHtcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gdGhpcy4kaGVscGVyLnNlbGVjdE9uZSgnLmMtbWVzc2FnZXMtY29udGFpbmVyJyk7XG4gICAgICAgIGlmIChjb250YWluZXIpIHtcbiAgICAgICAgICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBAc2VlIGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzUuMC9jb21wb25lbnRzL3Rvb2x0aXBzLyNleGFtcGxlLWVuYWJsZS10b29sdGlwcy1ldmVyeXdoZXJlXG4gICAgICovXG4gICAgdG9vbHRpcChzZWxlY3RvciA9ICdbZGF0YS1icy10b2dnbGU9XCJ0b29sdGlwXCJdJywgY29uZmlnID0ge30pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuJGhlbHBlci5tb2R1bGUoc2VsZWN0b3IsICdicy50b29sdGlwJywgKGVsZSkgPT4gdGhpcy5nZXRPckNyZWF0ZUluc3RhbmNlKGJvb3RzdHJhcC5Ub29sdGlwLCBlbGUsIGNvbmZpZykpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge3N0cmluZ3xFbGVtZW50fSBzZWxlY3RvclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBjb25maWdcbiAgICAgKi9cbiAgICBtb2RhbChzZWxlY3RvciwgY29uZmlnID0ge30pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuJGhlbHBlci5tb2R1bGUoc2VsZWN0b3IsICdicy5tb2RhbCcsIChlbGUpID0+IHRoaXMuZ2V0T3JDcmVhdGVJbnN0YW5jZShib290c3RyYXAuTW9kYWwsIGVsZSwgY29uZmlnKSk7XG4gICAgfVxuICAgIGNvbGxhcHNlKHNlbGVjdG9yID0gJ1tkYXRhLWJzLXRvZ2dsZT1jb2xsYXBzZV0nLCBjb25maWcgPSB7fSkge1xuICAgICAgICByZXR1cm4gdGhpcy4kaGVscGVyLm1vZHVsZShzZWxlY3RvciwgJ2JzLmNvbGxhcHNlJywgKGVsZSkgPT4gdGhpcy5nZXRPckNyZWF0ZUluc3RhbmNlKGJvb3RzdHJhcC5Db2xsYXBzZSwgZWxlLCBjb25maWcpKTtcbiAgICB9XG4gICAgb2ZmY2FudmFzKHNlbGVjdG9yID0gJ1tkYXRhLWJzLXRvZ2dsZT1cIm9mZmNhbnZhc1wiXScsIGNvbmZpZyA9IHt9KSB7XG4gICAgICAgIHJldHVybiB0aGlzLiRoZWxwZXIubW9kdWxlKHNlbGVjdG9yLCAnYnMub2ZmY2FudmFzJywgKGVsZSkgPT4gdGhpcy5nZXRPckNyZWF0ZUluc3RhbmNlKGJvb3RzdHJhcC5PZmZjYW52YXMsIGVsZSwgY29uZmlnKSk7XG4gICAgfVxuICAgIHBvcG92ZXIoc2VsZWN0b3IgPSAnW2RhdGEtYnMtdG9nZ2xlPVwicG9wb3ZlclwiXScsIGNvbmZpZyA9IHt9KSB7XG4gICAgICAgIHJldHVybiB0aGlzLiRoZWxwZXIubW9kdWxlKHNlbGVjdG9yLCAnYnMucG9wb3ZlcicsIChlbGUpID0+IHRoaXMuZ2V0T3JDcmVhdGVJbnN0YW5jZShib290c3RyYXAuUG9wb3ZlciwgZWxlLCBjb25maWcpKTtcbiAgICB9XG4gICAgc2Nyb2xsc3B5KHNlbGVjdG9yID0gJ1tkYXRhLWJzLXNweT1cInNjcm9sbFwiXScsIGNvbmZpZyA9IHt9KSB7XG4gICAgICAgIHJldHVybiB0aGlzLiRoZWxwZXIubW9kdWxlKHNlbGVjdG9yLCAnYnMuc2Nyb2xsc3B5JywgKGVsZSkgPT4gdGhpcy5nZXRPckNyZWF0ZUluc3RhbmNlKGJvb3RzdHJhcC5TY3JvbGxTcHksIGVsZSwgY29uZmlnKSk7XG4gICAgfVxuICAgIHRhYihzZWxlY3RvciA9ICdbZGF0YS1icy10b2dnbGU9XCJ0YWJcIl0nLCBjb25maWcgPSB7fSkge1xuICAgICAgICByZXR1cm4gdGhpcy4kaGVscGVyLm1vZHVsZShzZWxlY3RvciwgJ2JzLnRhYicsIChlbGUpID0+IHRoaXMuZ2V0T3JDcmVhdGVJbnN0YW5jZShib290c3RyYXAuVGFiLCBlbGUsIGNvbmZpZykpO1xuICAgIH1cbiAgICB0b2FzdChzZWxlY3RvciA9ICdbZGF0YS1icy10b2dnbGU9XCJ0b2FzdFwiXScsIGNvbmZpZyA9IHt9KSB7XG4gICAgICAgIHJldHVybiB0aGlzLiRoZWxwZXIubW9kdWxlKHNlbGVjdG9yLCAnYnMudG9hc3QnLCAoZWxlKSA9PiB0aGlzLmdldE9yQ3JlYXRlSW5zdGFuY2UoYm9vdHN0cmFwLlRvYXN0LCBlbGUsIGNvbmZpZykpO1xuICAgIH1cbiAgICBrZWVwVGFiKHNlbGVjdG9yLCBjb25maWcgPSB7fSkge1xuICAgICAgICByZXR1cm4gdGhpcy4kbG9hZGVyLmltcG9ydCgnQHVuaWNvcm4vYm9vdHN0cmFwL2tlZXAtdGFiLmpzJylcbiAgICAgICAgICAgIC50aGVuKChtKSA9PiB7XG4gICAgICAgICAgICBpZiAoc2VsZWN0b3IpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IG0uTG9hZFRhYihzZWxlY3RvciwgY29uZmlnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBtO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgYXN5bmMgYnV0dG9uUmFkaW8oc2VsZWN0b3IsIGNvbmZpZyA9IHt9KSB7XG4gICAgICAgIGxldCBtID0gYXdhaXQgdGhpcy4kbG9hZGVyLmltcG9ydCgnQHVuaWNvcm4vYm9vdHN0cmFwL2J1dHRvbi1yYWRpby5qcycpO1xuICAgICAgICBpZiAoc2VsZWN0b3IpIHtcbiAgICAgICAgICAgIHJldHVybiBtLkJ1dHRvblJhZGlvLmhhbmRsZShzZWxlY3RvciwgY29uZmlnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbTtcbiAgICB9XG4gICAgZ2V0TWFqb3JWZXJzaW9uKG1vZHVsZSkge1xuICAgICAgICByZXR1cm4gTnVtYmVyKG1vZHVsZS5WRVJTSU9OLnNwbGl0KCcuJykuc2hpZnQoKSk7XG4gICAgfVxuICAgIGdldE9yQ3JlYXRlSW5zdGFuY2UobW9kdWxlLCBlbGUsIGNvbmZpZyA9IHt9KSB7XG4gICAgICAgIGlmICh0aGlzLmdldE1ham9yVmVyc2lvbihtb2R1bGUpIDw9IDQpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgbW9kdWxlKGVsZSwgY29uZmlnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBtb2R1bGUuZ2V0T3JDcmVhdGVJbnN0YW5jZShlbGUsIGNvbmZpZyk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/modules/ui/ui-bootstrap5.ts\n");

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