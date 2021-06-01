(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
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

/***/ "./src/modules/ui/flatpickr-components.js":
/*!************************************************!*\
  !*** ./src/modules/ui/flatpickr-components.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function _typeof(obj) { \"@babel/helpers - typeof\"; if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }\n\nfunction _nonIterableSpread() { throw new TypeError(\"Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); }\n\nfunction _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === \"string\") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === \"Object\" && o.constructor) n = o.constructor.name; if (n === \"Map\" || n === \"Set\") return Array.from(o); if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }\n\nfunction _iterableToArray(iter) { if (typeof Symbol !== \"undefined\" && Symbol.iterator in Object(iter)) return Array.from(iter); }\n\nfunction _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }\n\nfunction _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _wrapNativeSuper(Class) { var _cache = typeof Map === \"function\" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== \"function\") { throw new TypeError(\"Super expression must either be null or a function\"); } if (typeof _cache !== \"undefined\") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }\n\nfunction _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }\n\nfunction _isNativeReflectConstruct() { if (typeof Reflect === \"undefined\" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === \"function\") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }\n\nfunction _isNativeFunction(fn) { return Function.toString.call(fn).indexOf(\"[native code]\") !== -1; }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\nvar FlatpickrElement = /*#__PURE__*/function (_HTMLElement) {\n  _inherits(FlatpickrElement, _HTMLElement);\n\n  var _super = _createSuper(FlatpickrElement);\n\n  function FlatpickrElement() {\n    var _this;\n\n    _classCallCheck(this, FlatpickrElement);\n\n    _this = _super.call(this);\n\n    _defineProperty(_assertThisInitialized(_this), \"instance\", void 0);\n\n    return _this;\n  }\n\n  _createClass(FlatpickrElement, [{\n    key: \"selector\",\n    get: function get() {\n      return this.getAttribute('selector') || 'input';\n    }\n  }, {\n    key: \"getOptions\",\n    value: function getOptions() {\n      var _this2 = this;\n\n      var options = {};\n      var ignore = ['selector'];\n      this.getAttributeNames().forEach(function (name) {\n        if (ignore.indexOf(name) !== -1) {\n          return;\n        }\n\n        options[name] = _this2.getAttribute(name);\n      });\n      return options;\n    }\n  }, {\n    key: \"connectedCallback\",\n    value: function connectedCallback() {\n      var _this3 = this;\n\n      var options = JSON.parse(this.getAttribute('options'));\n      this.handleOptions(options).then(function (options) {\n        _this3.instance = flatpickr(_this3.querySelector(_this3.selector), options);\n      });\n    }\n  }, {\n    key: \"handleOptions\",\n    value: function handleOptions(options) {\n      if (options.monthSelect) {\n        return Promise.all([u[\"import\"]('@flatpickr/plugins/monthSelect/index.js'), u[\"import\"]('@flatpickr/plugins/monthSelect/style.css')]).then(function (modules) {\n          var styleSheet = modules[1][\"default\"];\n          document.adoptedStyleSheets = [].concat(_toConsumableArray(document.adoptedStyleSheets), [styleSheet]);\n          options.plugins = options.plugins || [];\n\n          if (typeof options.monthSelect === 'boolean') {\n            options.monthSelect = {\n              shorthand: true,\n              dateFormat: 'Y-m',\n              altFormat: 'Y-m'\n            };\n          }\n\n          options.plugins.push(new monthSelectPlugin(options.monthSelect));\n          return options;\n        });\n      }\n\n      return Promise.resolve(options);\n    }\n  }, {\n    key: \"getInstance\",\n    value: function getInstance() {\n      return this.instance;\n    }\n  }], [{\n    key: \"is\",\n    get: function get() {\n      return 'uni-flatpickr';\n    }\n  }]);\n\n  return FlatpickrElement;\n}( /*#__PURE__*/_wrapNativeSuper(HTMLElement));\n\nPromise.all([u[\"import\"]('@flatpickr/flatpickr.js'), u[\"import\"]('@flatpickr/flatpickr.css')]).then(function (modules) {\n  var styleSheet = modules[1][\"default\"];\n  document.adoptedStyleSheets = [].concat(_toConsumableArray(document.adoptedStyleSheets), [styleSheet]);\n  customElements.define(FlatpickrElement.is, FlatpickrElement);\n});\n\n//# sourceURL=webpack:///./src/modules/ui/flatpickr-components.js?");

/***/ }),

/***/ 0:
/*!******************************************************!*\
  !*** multi ./src/modules/ui/flatpickr-components.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__(/*! /Applications/XAMPP/xamppfiles/htdocs/windwalker/starter/vendor/windwalker/unicorn/assets/src/modules/ui/flatpickr-components.js */\"./src/modules/ui/flatpickr-components.js\");\n\n\n//# sourceURL=webpack:///multi_./src/modules/ui/flatpickr-components.js?");

/***/ })

/******/ });
});