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
		exports["IframeModal"] = factory();
	else
		root["IframeModal"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/modules/ui/iframe-modal.ts":
/*!****************************************!*\
  !*** ./src/modules/ui/iframe-modal.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   IFrameModal: () => (/* binding */ IFrameModal)\n/* harmony export */ });\n/// <reference types=\"../../../types/index\" />\nclass IFrameModal extends HTMLElement {\n    static is = 'uni-iframe-modal';\n    options;\n    modalElement;\n    modal;\n    iframe;\n    template() {\n        return `\n<div class=\"modal fade c-unicorn-iframe-modal\" id=\"${this.getModalId()}\"\n    data-iframe-modal>\n    <div class=\"modal-dialog ${this.options?.size || 'modal-xl'}\">\n        <div class=\"modal-content\">\n            <div class=\"modal-body\">\n                <iframe class=\"c-unicorn-iframe-modal__iframe\" width=\"100%\" src=\"\" frameborder=\"0\"></iframe>\n            </div>\n        </div>\n    </div>\n</div>`;\n    }\n    get selector() {\n        return this.getAttribute('selector') || '[data-iframe-modal]';\n    }\n    connectedCallback() {\n        this.options = JSON.parse(this.getAttribute('options') || '{}');\n        if (!this.innerHTML.trim()) {\n            this.innerHTML = this.template();\n        }\n        this.modalElement = this.querySelector(this.selector);\n        this.modal = u.$ui.bootstrap.modal(this.modalElement);\n        this.iframe = this.modalElement.querySelector('iframe');\n        // @ts-ignore\n        this.iframe.modalLink = () => {\n            return this;\n        };\n        this.bindEvents();\n    }\n    bindEvents() {\n        this.modalElement.addEventListener('hidden.bs.modal', () => {\n            this.iframe.src = '';\n        });\n    }\n    open(href, options = {}) {\n        options = u.defaultsDeep(options, this.options, {\n            height: null,\n            resize: false,\n            size: 'modal-lg',\n        });\n        if (options.resize) {\n            let onload;\n            this.iframe.addEventListener('load', onload = () => {\n                this.resize(this.iframe);\n                this.iframe.removeEventListener('load', onload);\n            });\n        }\n        else {\n            this.iframe.style.height = options.height || '500px';\n        }\n        if (options.size != null) {\n            const dialog = this.modalElement.querySelector('.modal-dialog');\n            dialog.classList.remove('modal-lg', 'modal-xl', 'modal-sm', 'modal-xs');\n            dialog.classList.add(options.size);\n        }\n        this.iframe.src = href;\n        this.modal.show();\n    }\n    close() {\n        this.modal.hide();\n        this.iframe.src = '';\n    }\n    resize(iframe) {\n        setTimeout(() => {\n            let height = iframe.contentWindow.document.documentElement.scrollHeight;\n            height += 30;\n            if (height < 500) {\n                height = 500;\n            }\n            iframe.style.height = height + 'px';\n        }, 30);\n    }\n    getModalId() {\n        return this.options?.id || this.id + '__modal';\n    }\n}\nu.defineCustomElement(IFrameModal.is, IFrameModal);\nu.directive('modal-link', {\n    mounted(el, binding) {\n        let options = {};\n        options.height = el.dataset.height;\n        options.resize = el.dataset.resize;\n        options.size = el.dataset.size;\n        const target = binding.value;\n        el.style.pointerEvents = null;\n        el.addEventListener('click', (e) => {\n            e.preventDefault();\n            e.stopPropagation();\n            const im = document.querySelector(target);\n            if (!im) {\n                return;\n            }\n            if ('src' in el) {\n                im.open(el.src, options);\n            }\n            else if ('href' in el) {\n                im.open(el.href, options);\n            }\n        });\n    }\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy91aS9pZnJhbWUtbW9kYWwudHMiLCJtYXBwaW5ncyI6Ijs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLi9zcmMvbW9kdWxlcy91aS9pZnJhbWUtbW9kYWwudHMvLi9zcmMvbW9kdWxlcy91aS9pZnJhbWUtbW9kYWwudHM/MmEzOSJdLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gPHJlZmVyZW5jZSB0eXBlcz1cIi4uLy4uLy4uL3R5cGVzL2luZGV4XCIgLz5cbmV4cG9ydCBjbGFzcyBJRnJhbWVNb2RhbCBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgICBzdGF0aWMgaXMgPSAndW5pLWlmcmFtZS1tb2RhbCc7XG4gICAgb3B0aW9ucztcbiAgICBtb2RhbEVsZW1lbnQ7XG4gICAgbW9kYWw7XG4gICAgaWZyYW1lO1xuICAgIHRlbXBsYXRlKCkge1xuICAgICAgICByZXR1cm4gYFxuPGRpdiBjbGFzcz1cIm1vZGFsIGZhZGUgYy11bmljb3JuLWlmcmFtZS1tb2RhbFwiIGlkPVwiJHt0aGlzLmdldE1vZGFsSWQoKX1cIlxuICAgIGRhdGEtaWZyYW1lLW1vZGFsPlxuICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1kaWFsb2cgJHt0aGlzLm9wdGlvbnM/LnNpemUgfHwgJ21vZGFsLXhsJ31cIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5XCI+XG4gICAgICAgICAgICAgICAgPGlmcmFtZSBjbGFzcz1cImMtdW5pY29ybi1pZnJhbWUtbW9kYWxfX2lmcmFtZVwiIHdpZHRoPVwiMTAwJVwiIHNyYz1cIlwiIGZyYW1lYm9yZGVyPVwiMFwiPjwvaWZyYW1lPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuPC9kaXY+YDtcbiAgICB9XG4gICAgZ2V0IHNlbGVjdG9yKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoJ3NlbGVjdG9yJykgfHwgJ1tkYXRhLWlmcmFtZS1tb2RhbF0nO1xuICAgIH1cbiAgICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gSlNPTi5wYXJzZSh0aGlzLmdldEF0dHJpYnV0ZSgnb3B0aW9ucycpIHx8ICd7fScpO1xuICAgICAgICBpZiAoIXRoaXMuaW5uZXJIVE1MLnRyaW0oKSkge1xuICAgICAgICAgICAgdGhpcy5pbm5lckhUTUwgPSB0aGlzLnRlbXBsYXRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tb2RhbEVsZW1lbnQgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IodGhpcy5zZWxlY3Rvcik7XG4gICAgICAgIHRoaXMubW9kYWwgPSB1LiR1aS5ib290c3RyYXAubW9kYWwodGhpcy5tb2RhbEVsZW1lbnQpO1xuICAgICAgICB0aGlzLmlmcmFtZSA9IHRoaXMubW9kYWxFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lmcmFtZScpO1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHRoaXMuaWZyYW1lLm1vZGFsTGluayA9ICgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgICB9XG4gICAgYmluZEV2ZW50cygpIHtcbiAgICAgICAgdGhpcy5tb2RhbEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignaGlkZGVuLmJzLm1vZGFsJywgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5pZnJhbWUuc3JjID0gJyc7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBvcGVuKGhyZWYsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICBvcHRpb25zID0gdS5kZWZhdWx0c0RlZXAob3B0aW9ucywgdGhpcy5vcHRpb25zLCB7XG4gICAgICAgICAgICBoZWlnaHQ6IG51bGwsXG4gICAgICAgICAgICByZXNpemU6IGZhbHNlLFxuICAgICAgICAgICAgc2l6ZTogJ21vZGFsLWxnJyxcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChvcHRpb25zLnJlc2l6ZSkge1xuICAgICAgICAgICAgbGV0IG9ubG9hZDtcbiAgICAgICAgICAgIHRoaXMuaWZyYW1lLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBvbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXNpemUodGhpcy5pZnJhbWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuaWZyYW1lLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBvbmxvYWQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmlmcmFtZS5zdHlsZS5oZWlnaHQgPSBvcHRpb25zLmhlaWdodCB8fCAnNTAwcHgnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLnNpemUgIT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc3QgZGlhbG9nID0gdGhpcy5tb2RhbEVsZW1lbnQucXVlcnlTZWxlY3RvcignLm1vZGFsLWRpYWxvZycpO1xuICAgICAgICAgICAgZGlhbG9nLmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLWxnJywgJ21vZGFsLXhsJywgJ21vZGFsLXNtJywgJ21vZGFsLXhzJyk7XG4gICAgICAgICAgICBkaWFsb2cuY2xhc3NMaXN0LmFkZChvcHRpb25zLnNpemUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaWZyYW1lLnNyYyA9IGhyZWY7XG4gICAgICAgIHRoaXMubW9kYWwuc2hvdygpO1xuICAgIH1cbiAgICBjbG9zZSgpIHtcbiAgICAgICAgdGhpcy5tb2RhbC5oaWRlKCk7XG4gICAgICAgIHRoaXMuaWZyYW1lLnNyYyA9ICcnO1xuICAgIH1cbiAgICByZXNpemUoaWZyYW1lKSB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGhlaWdodCA9IGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxIZWlnaHQ7XG4gICAgICAgICAgICBoZWlnaHQgKz0gMzA7XG4gICAgICAgICAgICBpZiAoaGVpZ2h0IDwgNTAwKSB7XG4gICAgICAgICAgICAgICAgaGVpZ2h0ID0gNTAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWZyYW1lLnN0eWxlLmhlaWdodCA9IGhlaWdodCArICdweCc7XG4gICAgICAgIH0sIDMwKTtcbiAgICB9XG4gICAgZ2V0TW9kYWxJZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucz8uaWQgfHwgdGhpcy5pZCArICdfX21vZGFsJztcbiAgICB9XG59XG51LmRlZmluZUN1c3RvbUVsZW1lbnQoSUZyYW1lTW9kYWwuaXMsIElGcmFtZU1vZGFsKTtcbnUuZGlyZWN0aXZlKCdtb2RhbC1saW5rJywge1xuICAgIG1vdW50ZWQoZWwsIGJpbmRpbmcpIHtcbiAgICAgICAgbGV0IG9wdGlvbnMgPSB7fTtcbiAgICAgICAgb3B0aW9ucy5oZWlnaHQgPSBlbC5kYXRhc2V0LmhlaWdodDtcbiAgICAgICAgb3B0aW9ucy5yZXNpemUgPSBlbC5kYXRhc2V0LnJlc2l6ZTtcbiAgICAgICAgb3B0aW9ucy5zaXplID0gZWwuZGF0YXNldC5zaXplO1xuICAgICAgICBjb25zdCB0YXJnZXQgPSBiaW5kaW5nLnZhbHVlO1xuICAgICAgICBlbC5zdHlsZS5wb2ludGVyRXZlbnRzID0gbnVsbDtcbiAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGNvbnN0IGltID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuICAgICAgICAgICAgaWYgKCFpbSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgnc3JjJyBpbiBlbCkge1xuICAgICAgICAgICAgICAgIGltLm9wZW4oZWwuc3JjLCBvcHRpb25zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKCdocmVmJyBpbiBlbCkge1xuICAgICAgICAgICAgICAgIGltLm9wZW4oZWwuaHJlZiwgb3B0aW9ucyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/modules/ui/iframe-modal.ts\n");

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
/******/ 	__webpack_modules__["./src/modules/ui/iframe-modal.ts"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});