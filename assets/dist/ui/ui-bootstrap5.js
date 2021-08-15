System.register([], function(__WEBPACK_DYNAMIC_EXPORT__) {

	return {

		execute: function() {
			__WEBPACK_DYNAMIC_EXPORT__(
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/modules/ui/ui-bootstrap5.js":
/*!*****************************************!*\
  !*** ./src/modules/ui/ui-bootstrap5.js ***!
  \*****************************************/
/*! exports provided: UIBootstrap5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"UIBootstrap5\", function() { return UIBootstrap5; });\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nvar UIBootstrap5 = /*#__PURE__*/function () {\n  function UIBootstrap5(ui) {\n    _classCallCheck(this, UIBootstrap5);\n\n    this.ui = ui;\n    this.app = ui.app;\n  }\n\n  _createClass(UIBootstrap5, [{\n    key: \"renderMessage\",\n    value: function renderMessage(messages) {\n      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'info';\n\n      if (!Array.isArray(messages)) {\n        messages = [messages];\n      }\n\n      var text = '';\n      messages.forEach(function (msg) {\n        text += \"<div class=\\\"\\\">\".concat(msg, \"</div>\");\n      });\n      var html = this.app.html(\"<div class=\\\"alert alert-\".concat(type, \" alert-dismissible fade show\\\" role=\\\"alert\\\">\\n  \").concat(text, \"\\n  <button type=\\\"button\\\" class=\\\"btn-close\\\" data-bs-dismiss=\\\"alert\\\" aria-label=\\\"Close\\\"></button>\\n</div>\"));\n      var container = this.app.selectOne('.c-messages-container');\n\n      if (container) {\n        container.appendChild(html);\n      }\n    }\n  }, {\n    key: \"clearMessages\",\n    value: function clearMessages() {\n      var container = this.app.selectOne('.c-messages-container');\n\n      if (container) {\n        container.innerHTML = '';\n      }\n    }\n  }, {\n    key: \"tooltip\",\n    value: function tooltip() {\n      var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-bs-toggle=\"tooltip\"]';\n      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n      var tooltipTriggerList = [].slice.call(document.querySelectorAll(selector));\n      return tooltipTriggerList.map(function (tooltipTriggerEl) {\n        return new bootstrap.Tooltip(tooltipTriggerEl, config);\n      });\n    }\n  }, {\n    key: \"modal\",\n    value: function modal(selector) {\n      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n      return this.app.getBoundedInstance(selector, 'bs.modal', function (element) {\n        return new bootstrap.Modal(element, config);\n      });\n    }\n  }, {\n    key: \"collapse\",\n    value: function collapse(seletor) {\n      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n      return this.app.getBoundedInstance(selector, 'bs.collapse', function (element) {\n        return new bootstrap.Collapse(element, config);\n      });\n    }\n  }, {\n    key: \"offcanvas\",\n    value: function offcanvas(seletor) {\n      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n      return this.app.getBoundedInstance(selector, 'bs.collapse', function (element) {\n        return new bootstrap.Offcanvas(element, config);\n      });\n    }\n  }, {\n    key: \"popover\",\n    value: function popover(seletor) {\n      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n      return this.app.getBoundedInstance(selector, 'bs.collapse', function (element) {\n        return new bootstrap.Popover(element, config);\n      });\n    }\n  }, {\n    key: \"scrollspy\",\n    value: function scrollspy(seletor) {\n      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n      return this.app.getBoundedInstance(selector, 'bs.collapse', function (element) {\n        return new bootstrap.ScrollSpy(element, config);\n      });\n    }\n  }, {\n    key: \"tab\",\n    value: function tab(selector) {\n      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n      return this.app.getBoundedInstance(selector, 'bs.collapse', function (element) {\n        return new bootstrap.Tab(element, config);\n      });\n    }\n  }, {\n    key: \"keepTab\",\n    value: function keepTab() {\n      var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;\n      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n      return this.app[\"import\"]('@unicorn/bootstrap/keep-tab.js').then(function (m) {\n        if (selector) {\n          return new LoadTab(selector, options);\n        }\n\n        return m;\n      });\n    }\n  }, {\n    key: \"toast\",\n    value: function toast(seletor) {\n      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n      return this.app.getBoundedInstance(selector, 'bs.collapse', function (element) {\n        return new bootstrap.Toast(element, config);\n      });\n    }\n  }], [{\n    key: \"install\",\n    value: function install(app) {\n      app.$ui.bootstrap = new this(app.$ui);\n      app.$ui.theme = new this(app.$ui);\n    }\n  }]);\n\n  return UIBootstrap5;\n}();//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy91aS91aS1ib290c3RyYXA1LmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL21vZHVsZXMvdWkvdWktYm9vdHN0cmFwNS5qcz85ZDViIl0sInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxuZXhwb3J0IHZhciBVSUJvb3RzdHJhcDUgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBVSUJvb3RzdHJhcDUodWkpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgVUlCb290c3RyYXA1KTtcblxuICAgIHRoaXMudWkgPSB1aTtcbiAgICB0aGlzLmFwcCA9IHVpLmFwcDtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhVSUJvb3RzdHJhcDUsIFt7XG4gICAga2V5OiBcInJlbmRlck1lc3NhZ2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVuZGVyTWVzc2FnZShtZXNzYWdlcykge1xuICAgICAgdmFyIHR5cGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6ICdpbmZvJztcblxuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KG1lc3NhZ2VzKSkge1xuICAgICAgICBtZXNzYWdlcyA9IFttZXNzYWdlc107XG4gICAgICB9XG5cbiAgICAgIHZhciB0ZXh0ID0gJyc7XG4gICAgICBtZXNzYWdlcy5mb3JFYWNoKGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgdGV4dCArPSBcIjxkaXYgY2xhc3M9XFxcIlxcXCI+XCIuY29uY2F0KG1zZywgXCI8L2Rpdj5cIik7XG4gICAgICB9KTtcbiAgICAgIHZhciBodG1sID0gdGhpcy5hcHAuaHRtbChcIjxkaXYgY2xhc3M9XFxcImFsZXJ0IGFsZXJ0LVwiLmNvbmNhdCh0eXBlLCBcIiBhbGVydC1kaXNtaXNzaWJsZSBmYWRlIHNob3dcXFwiIHJvbGU9XFxcImFsZXJ0XFxcIj5cXG4gIFwiKS5jb25jYXQodGV4dCwgXCJcXG4gIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwiYnRuLWNsb3NlXFxcIiBkYXRhLWJzLWRpc21pc3M9XFxcImFsZXJ0XFxcIiBhcmlhLWxhYmVsPVxcXCJDbG9zZVxcXCI+PC9idXR0b24+XFxuPC9kaXY+XCIpKTtcbiAgICAgIHZhciBjb250YWluZXIgPSB0aGlzLmFwcC5zZWxlY3RPbmUoJy5jLW1lc3NhZ2VzLWNvbnRhaW5lcicpO1xuXG4gICAgICBpZiAoY29udGFpbmVyKSB7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChodG1sKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiY2xlYXJNZXNzYWdlc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjbGVhck1lc3NhZ2VzKCkge1xuICAgICAgdmFyIGNvbnRhaW5lciA9IHRoaXMuYXBwLnNlbGVjdE9uZSgnLmMtbWVzc2FnZXMtY29udGFpbmVyJyk7XG5cbiAgICAgIGlmIChjb250YWluZXIpIHtcbiAgICAgICAgY29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ0b29sdGlwXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRvb2x0aXAoKSB7XG4gICAgICB2YXIgc2VsZWN0b3IgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6ICdbZGF0YS1icy10b2dnbGU9XCJ0b29sdGlwXCJdJztcbiAgICAgIHZhciBjb25maWcgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuICAgICAgdmFyIHRvb2x0aXBUcmlnZ2VyTGlzdCA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpO1xuICAgICAgcmV0dXJuIHRvb2x0aXBUcmlnZ2VyTGlzdC5tYXAoZnVuY3Rpb24gKHRvb2x0aXBUcmlnZ2VyRWwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBib290c3RyYXAuVG9vbHRpcCh0b29sdGlwVHJpZ2dlckVsLCBjb25maWcpO1xuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIm1vZGFsXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG1vZGFsKHNlbGVjdG9yKSB7XG4gICAgICB2YXIgY29uZmlnID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcbiAgICAgIHJldHVybiB0aGlzLmFwcC5nZXRCb3VuZGVkSW5zdGFuY2Uoc2VsZWN0b3IsICdicy5tb2RhbCcsIGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBuZXcgYm9vdHN0cmFwLk1vZGFsKGVsZW1lbnQsIGNvbmZpZyk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiY29sbGFwc2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY29sbGFwc2Uoc2VsZXRvcikge1xuICAgICAgdmFyIGNvbmZpZyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG4gICAgICByZXR1cm4gdGhpcy5hcHAuZ2V0Qm91bmRlZEluc3RhbmNlKHNlbGVjdG9yLCAnYnMuY29sbGFwc2UnLCBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gbmV3IGJvb3RzdHJhcC5Db2xsYXBzZShlbGVtZW50LCBjb25maWcpO1xuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIm9mZmNhbnZhc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBvZmZjYW52YXMoc2VsZXRvcikge1xuICAgICAgdmFyIGNvbmZpZyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG4gICAgICByZXR1cm4gdGhpcy5hcHAuZ2V0Qm91bmRlZEluc3RhbmNlKHNlbGVjdG9yLCAnYnMuY29sbGFwc2UnLCBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gbmV3IGJvb3RzdHJhcC5PZmZjYW52YXMoZWxlbWVudCwgY29uZmlnKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJwb3BvdmVyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHBvcG92ZXIoc2VsZXRvcikge1xuICAgICAgdmFyIGNvbmZpZyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG4gICAgICByZXR1cm4gdGhpcy5hcHAuZ2V0Qm91bmRlZEluc3RhbmNlKHNlbGVjdG9yLCAnYnMuY29sbGFwc2UnLCBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gbmV3IGJvb3RzdHJhcC5Qb3BvdmVyKGVsZW1lbnQsIGNvbmZpZyk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic2Nyb2xsc3B5XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNjcm9sbHNweShzZWxldG9yKSB7XG4gICAgICB2YXIgY29uZmlnID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcbiAgICAgIHJldHVybiB0aGlzLmFwcC5nZXRCb3VuZGVkSW5zdGFuY2Uoc2VsZWN0b3IsICdicy5jb2xsYXBzZScsIGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBuZXcgYm9vdHN0cmFwLlNjcm9sbFNweShlbGVtZW50LCBjb25maWcpO1xuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInRhYlwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0YWIoc2VsZWN0b3IpIHtcbiAgICAgIHZhciBjb25maWcgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuICAgICAgcmV0dXJuIHRoaXMuYXBwLmdldEJvdW5kZWRJbnN0YW5jZShzZWxlY3RvciwgJ2JzLmNvbGxhcHNlJywgZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBib290c3RyYXAuVGFiKGVsZW1lbnQsIGNvbmZpZyk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwia2VlcFRhYlwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBrZWVwVGFiKCkge1xuICAgICAgdmFyIHNlbGVjdG9yID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBudWxsO1xuICAgICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuICAgICAgcmV0dXJuIHRoaXMuYXBwW1wiaW1wb3J0XCJdKCdAdW5pY29ybi9ib290c3RyYXAva2VlcC10YWIuanMnKS50aGVuKGZ1bmN0aW9uIChtKSB7XG4gICAgICAgIGlmIChzZWxlY3Rvcikge1xuICAgICAgICAgIHJldHVybiBuZXcgTG9hZFRhYihzZWxlY3Rvciwgb3B0aW9ucyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ0b2FzdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0b2FzdChzZWxldG9yKSB7XG4gICAgICB2YXIgY29uZmlnID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcbiAgICAgIHJldHVybiB0aGlzLmFwcC5nZXRCb3VuZGVkSW5zdGFuY2Uoc2VsZWN0b3IsICdicy5jb2xsYXBzZScsIGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBuZXcgYm9vdHN0cmFwLlRvYXN0KGVsZW1lbnQsIGNvbmZpZyk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1dLCBbe1xuICAgIGtleTogXCJpbnN0YWxsXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGluc3RhbGwoYXBwKSB7XG4gICAgICBhcHAuJHVpLmJvb3RzdHJhcCA9IG5ldyB0aGlzKGFwcC4kdWkpO1xuICAgICAgYXBwLiR1aS50aGVtZSA9IG5ldyB0aGlzKGFwcC4kdWkpO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBVSUJvb3RzdHJhcDU7XG59KCk7Il0sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/modules/ui/ui-bootstrap5.js\n");

/***/ }),

/***/ 0:
/*!***********************************************!*\
  !*** multi ./src/modules/ui/ui-bootstrap5.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Applications/XAMPP/xamppfiles/htdocs/unicorn/vendor/windwalker/unicorn/assets/src/modules/ui/ui-bootstrap5.js */"./src/modules/ui/ui-bootstrap5.js");


/***/ })

/******/ })
			);
		}
	};
});