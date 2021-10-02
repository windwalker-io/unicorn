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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"UIBootstrap5\", function() { return UIBootstrap5; });\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nvar UIBootstrap5 = /*#__PURE__*/function () {\n  function UIBootstrap5(ui) {\n    _classCallCheck(this, UIBootstrap5);\n\n    this.ui = ui;\n    this.app = ui.app;\n  }\n\n  _createClass(UIBootstrap5, [{\n    key: \"renderMessage\",\n    value: function renderMessage(messages) {\n      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'info';\n\n      if (!Array.isArray(messages)) {\n        messages = [messages];\n      }\n\n      var text = '';\n      messages.forEach(function (msg) {\n        text += \"<div class=\\\"\\\">\".concat(msg, \"</div>\");\n      });\n      var html = this.app.html(\"<div class=\\\"alert alert-\".concat(type, \" alert-dismissible fade show\\\" role=\\\"alert\\\">\\n  \").concat(text, \"\\n  <button type=\\\"button\\\" class=\\\"btn-close\\\" data-bs-dismiss=\\\"alert\\\" aria-label=\\\"Close\\\"></button>\\n</div>\"));\n      var container = this.app.selectOne('.c-messages-container');\n\n      if (container) {\n        container.appendChild(html);\n      }\n    }\n  }, {\n    key: \"clearMessages\",\n    value: function clearMessages() {\n      var container = this.app.selectOne('.c-messages-container');\n\n      if (container) {\n        container.innerHTML = '';\n      }\n    }\n  }, {\n    key: \"tooltip\",\n    value: function tooltip() {\n      var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-bs-toggle=\"tooltip\"]';\n      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n      return this.app.getBoundedInstanceList(selector, 'bs.tooltip', function (ele) {\n        return new bootstrap.Tooltip(ele, config);\n      });\n    }\n  }, {\n    key: \"modal\",\n    value: function modal(selector) {\n      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n      return this.app.getBoundedInstance(selector, 'bs.modal', function (element) {\n        return new bootstrap.Modal(element, config);\n      });\n    }\n  }, {\n    key: \"collapse\",\n    value: function collapse() {\n      var seletor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-bs-toggle=collapse]';\n      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n      return this.app.getBoundedInstanceList(selector, 'bs.collapse', function (ele) {\n        return new bootstrap.Collapse(ele, config);\n      });\n    }\n  }, {\n    key: \"offcanvas\",\n    value: function offcanvas() {\n      var seletor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-bs-toggle=\"offcanvas\"]';\n      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n      return this.app.getBoundedInstanceList(selector, 'bs.offcanvas', function (ele) {\n        return new bootstrap.Offcanvas(ele, config);\n      });\n    }\n  }, {\n    key: \"popover\",\n    value: function popover() {\n      var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-bs-toggle=\"popover\"]';\n      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n      return this.app.getBoundedInstanceList(selector, 'bs.popover', function (ele) {\n        return new bootstrap.Popover(ele, config);\n      });\n    }\n  }, {\n    key: \"scrollspy\",\n    value: function scrollspy() {\n      var seletor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-bs-spy=\"scroll\"]';\n      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n      return this.app.getBoundedInstanceList(selector, 'bs.scrollspy', function (element) {\n        return new bootstrap.ScrollSpy(element, config);\n      });\n    }\n  }, {\n    key: \"tab\",\n    value: function tab() {\n      var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-bs-toggle=\"tab\"]';\n      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n      return this.app.getBoundedInstanceList(selector, 'bs.tab', function (element) {\n        return new bootstrap.Tab(element, config);\n      });\n    }\n  }, {\n    key: \"toast\",\n    value: function toast() {\n      var seletor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-bs-toggle=\"toast\"]';\n      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n      return this.app.getBoundedInstanceList(selector, 'bs.toast', function (element) {\n        return new bootstrap.Toast(element, config);\n      });\n    }\n  }, {\n    key: \"keepTab\",\n    value: function keepTab() {\n      var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;\n      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n      return this.app[\"import\"]('@unicorn/bootstrap/keep-tab.js').then(function (m) {\n        if (selector) {\n          return new m.LoadTab(selector, options);\n        }\n\n        return m;\n      });\n    }\n  }, {\n    key: \"buttonRadio\",\n    value: function buttonRadio() {\n      var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;\n      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n      return this.app[\"import\"]('@unicorn/bootstrap/button-radio.js').then(function (m) {\n        if (selector) {\n          return m.ButtonRadio.handle(selector, options);\n        }\n\n        return m;\n      });\n    }\n  }], [{\n    key: \"install\",\n    value: function install(app) {\n      app.$ui.bootstrap = new this(app.$ui);\n      app.$ui.theme = new this(app.$ui);\n    }\n  }]);\n\n  return UIBootstrap5;\n}();//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy91aS91aS1ib290c3RyYXA1LmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL21vZHVsZXMvdWkvdWktYm9vdHN0cmFwNS5qcz83M2JjIl0sInNvdXJjZXNDb250ZW50IjpbIiAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgXG5cbmV4cG9ydCBjbGFzcyBVSUJvb3RzdHJhcDUge1xuICBzdGF0aWMgaW5zdGFsbChhcHApIHtcbiAgICBhcHAuJHVpLmJvb3RzdHJhcCA9IG5ldyB0aGlzKGFwcC4kdWkpO1xuICAgIGFwcC4kdWkudGhlbWUgPSBuZXcgdGhpcyhhcHAuJHVpKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHVpKSB7XG4gICAgdGhpcy51aSA9IHVpO1xuICAgIHRoaXMuYXBwID0gdWkuYXBwO1xuICB9XG5cbiAgcmVuZGVyTWVzc2FnZShtZXNzYWdlcywgdHlwZSA9ICdpbmZvJykge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShtZXNzYWdlcykpIHtcbiAgICAgIG1lc3NhZ2VzID0gWyBtZXNzYWdlcyBdO1xuICAgIH1cblxuICAgIGxldCB0ZXh0ID0gJyc7XG5cbiAgICBtZXNzYWdlcy5mb3JFYWNoKChtc2cpID0+IHtcbiAgICAgIHRleHQgKz0gYDxkaXYgY2xhc3M9XCJcIj4ke21zZ308L2Rpdj5gO1xuICAgIH0pO1xuXG4gICAgY29uc3QgaHRtbCA9IHRoaXMuYXBwLmh0bWwoYDxkaXYgY2xhc3M9XCJhbGVydCBhbGVydC0ke3R5cGV9IGFsZXJ0LWRpc21pc3NpYmxlIGZhZGUgc2hvd1wiIHJvbGU9XCJhbGVydFwiPlxuICAke3RleHR9XG4gIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuLWNsb3NlXCIgZGF0YS1icy1kaXNtaXNzPVwiYWxlcnRcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj48L2J1dHRvbj5cbjwvZGl2PmApO1xuXG4gICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5hcHAuc2VsZWN0T25lKCcuYy1tZXNzYWdlcy1jb250YWluZXInKTtcblxuICAgIGlmIChjb250YWluZXIpIHtcbiAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChodG1sKTtcbiAgICB9XG4gIH1cblxuICBjbGVhck1lc3NhZ2VzKCkge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuYXBwLnNlbGVjdE9uZSgnLmMtbWVzc2FnZXMtY29udGFpbmVyJyk7XG5cbiAgICBpZiAoY29udGFpbmVyKSB7XG4gICAgICBjb250YWluZXIuaW5uZXJIVE1MID0gJyc7XG4gICAgfVxuICB9XG5cbiAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICBcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICBcbiAgICAgXG4gIHRvb2x0aXAoc2VsZWN0b3IgPSAnW2RhdGEtYnMtdG9nZ2xlPVwidG9vbHRpcFwiXScsIGNvbmZpZyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwLmdldEJvdW5kZWRJbnN0YW5jZUxpc3QoXG4gICAgICBzZWxlY3RvcixcbiAgICAgICdicy50b29sdGlwJyxcbiAgICAgIChlbGUpID0+IG5ldyBib290c3RyYXAuVG9vbHRpcChlbGUsIGNvbmZpZylcbiAgICApO1xuICB9XG5cbiAgbW9kYWwoc2VsZWN0b3IsIGNvbmZpZyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwLmdldEJvdW5kZWRJbnN0YW5jZShcbiAgICAgIHNlbGVjdG9yLFxuICAgICAgJ2JzLm1vZGFsJyxcbiAgICAgIChlbGVtZW50KSA9PiBuZXcgYm9vdHN0cmFwLk1vZGFsKGVsZW1lbnQsIGNvbmZpZylcbiAgICApO1xuICB9XG5cbiAgY29sbGFwc2Uoc2VsZXRvciA9ICdbZGF0YS1icy10b2dnbGU9Y29sbGFwc2VdJywgY29uZmlnID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5hcHAuZ2V0Qm91bmRlZEluc3RhbmNlTGlzdChcbiAgICAgIHNlbGVjdG9yLFxuICAgICAgJ2JzLmNvbGxhcHNlJyxcbiAgICAgIChlbGUpID0+IG5ldyBib290c3RyYXAuQ29sbGFwc2UoZWxlLCBjb25maWcpXG4gICAgKTtcbiAgfVxuXG4gIG9mZmNhbnZhcyhzZWxldG9yID0gJ1tkYXRhLWJzLXRvZ2dsZT1cIm9mZmNhbnZhc1wiXScsIGNvbmZpZyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwLmdldEJvdW5kZWRJbnN0YW5jZUxpc3QoXG4gICAgICBzZWxlY3RvcixcbiAgICAgICdicy5vZmZjYW52YXMnLFxuICAgICAgKGVsZSkgPT4gbmV3IGJvb3RzdHJhcC5PZmZjYW52YXMoZWxlLCBjb25maWcpXG4gICAgKTtcbiAgfVxuXG4gIHBvcG92ZXIoc2VsZWN0b3IgPSAnW2RhdGEtYnMtdG9nZ2xlPVwicG9wb3ZlclwiXScsIGNvbmZpZyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwLmdldEJvdW5kZWRJbnN0YW5jZUxpc3QoXG4gICAgICBzZWxlY3RvcixcbiAgICAgICdicy5wb3BvdmVyJyxcbiAgICAgIChlbGUpID0+IG5ldyBib290c3RyYXAuUG9wb3ZlcihlbGUsIGNvbmZpZylcbiAgICApO1xuICB9XG5cbiAgc2Nyb2xsc3B5KHNlbGV0b3IgPSAnW2RhdGEtYnMtc3B5PVwic2Nyb2xsXCJdJywgY29uZmlnID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5hcHAuZ2V0Qm91bmRlZEluc3RhbmNlTGlzdChcbiAgICAgIHNlbGVjdG9yLFxuICAgICAgJ2JzLnNjcm9sbHNweScsXG4gICAgICAoZWxlbWVudCkgPT4gbmV3IGJvb3RzdHJhcC5TY3JvbGxTcHkoZWxlbWVudCwgY29uZmlnKVxuICAgICk7XG4gIH1cblxuICB0YWIoc2VsZWN0b3IgPSAnW2RhdGEtYnMtdG9nZ2xlPVwidGFiXCJdJywgY29uZmlnID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5hcHAuZ2V0Qm91bmRlZEluc3RhbmNlTGlzdChcbiAgICAgIHNlbGVjdG9yLFxuICAgICAgJ2JzLnRhYicsXG4gICAgICAoZWxlbWVudCkgPT4gbmV3IGJvb3RzdHJhcC5UYWIoZWxlbWVudCwgY29uZmlnKVxuICAgICk7XG4gIH1cblxuICB0b2FzdChzZWxldG9yID0gJ1tkYXRhLWJzLXRvZ2dsZT1cInRvYXN0XCJdJywgY29uZmlnID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5hcHAuZ2V0Qm91bmRlZEluc3RhbmNlTGlzdChcbiAgICAgIHNlbGVjdG9yLFxuICAgICAgJ2JzLnRvYXN0JyxcbiAgICAgIChlbGVtZW50KSA9PiBuZXcgYm9vdHN0cmFwLlRvYXN0KGVsZW1lbnQsIGNvbmZpZylcbiAgICApO1xuICB9XG5cbiAga2VlcFRhYihzZWxlY3RvciA9IG51bGwsIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLmFwcC5pbXBvcnQoJ0B1bmljb3JuL2Jvb3RzdHJhcC9rZWVwLXRhYi5qcycpXG4gICAgICAudGhlbigobSkgPT4ge1xuICAgICAgICBpZiAoc2VsZWN0b3IpIHtcbiAgICAgICAgICByZXR1cm4gbmV3IG0uTG9hZFRhYihzZWxlY3Rvciwgb3B0aW9ucyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbTtcbiAgICAgIH0pO1xuICB9XG5cbiAgYnV0dG9uUmFkaW8oc2VsZWN0b3IgPSBudWxsLCBvcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5hcHAuaW1wb3J0KCdAdW5pY29ybi9ib290c3RyYXAvYnV0dG9uLXJhZGlvLmpzJylcbiAgICAgIC50aGVuKChtKSA9PiB7XG4gICAgICAgIGlmIChzZWxlY3Rvcikge1xuICAgICAgICAgIHJldHVybiBtLkJ1dHRvblJhZGlvLmhhbmRsZShzZWxlY3Rvciwgb3B0aW9ucyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbTtcbiAgICAgIH0pO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBT0E7QUFNQTtBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQVZBO0FBQUE7QUFBQTtBQVdBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFoQ0E7QUFBQTtBQUFBO0FBbUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXhDQTtBQUFBO0FBQUE7QUFnREE7QUFBQTtBQUNBO0FBR0E7QUFBQTtBQUVBO0FBdERBO0FBQUE7QUFBQTtBQXdEQTtBQUNBO0FBR0E7QUFBQTtBQUVBO0FBOURBO0FBQUE7QUFBQTtBQWdFQTtBQUFBO0FBQ0E7QUFHQTtBQUFBO0FBRUE7QUF0RUE7QUFBQTtBQUFBO0FBd0VBO0FBQUE7QUFDQTtBQUdBO0FBQUE7QUFFQTtBQTlFQTtBQUFBO0FBQUE7QUFnRkE7QUFBQTtBQUNBO0FBR0E7QUFBQTtBQUVBO0FBdEZBO0FBQUE7QUFBQTtBQXdGQTtBQUFBO0FBQ0E7QUFHQTtBQUFBO0FBRUE7QUE5RkE7QUFBQTtBQUFBO0FBZ0dBO0FBQUE7QUFDQTtBQUdBO0FBQUE7QUFFQTtBQXRHQTtBQUFBO0FBQUE7QUF3R0E7QUFBQTtBQUNBO0FBR0E7QUFBQTtBQUVBO0FBOUdBO0FBQUE7QUFBQTtBQWdIQTtBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXpIQTtBQUFBO0FBQUE7QUEySEE7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFwSUE7QUFBQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBSkE7QUFDQTtBQURBO0FBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/modules/ui/ui-bootstrap5.js\n");

/***/ }),

/***/ 0:
/*!***********************************************!*\
  !*** multi ./src/modules/ui/ui-bootstrap5.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Applications/XAMPP/xamppfiles/htdocs/earth/vendor/windwalker/unicorn/assets/src/modules/ui/ui-bootstrap5.js */"./src/modules/ui/ui-bootstrap5.js");


/***/ })

/******/ })
			);
		}
	};
});