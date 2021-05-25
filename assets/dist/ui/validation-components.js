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

/***/ "./src/unicorn/ui/validation-components.js":
/*!*************************************************!*\
  !*** ./src/unicorn/ui/validation-components.js ***!
  \*************************************************/
/*! exports provided: UnicornFormValidateElement, UnicornFieldValidateElement */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"UnicornFormValidateElement\", function() { return UnicornFormValidateElement; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"UnicornFieldValidateElement\", function() { return UnicornFieldValidateElement; });\nfunction _typeof(obj) { \"@babel/helpers - typeof\"; if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }\n\nfunction _nonIterableSpread() { throw new TypeError(\"Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); }\n\nfunction _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === \"string\") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === \"Object\" && o.constructor) n = o.constructor.name; if (n === \"Map\" || n === \"Set\") return Array.from(o); if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }\n\nfunction _iterableToArray(iter) { if (typeof Symbol !== \"undefined\" && Symbol.iterator in Object(iter)) return Array.from(iter); }\n\nfunction _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }\n\nfunction _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _wrapNativeSuper(Class) { var _cache = typeof Map === \"function\" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== \"function\") { throw new TypeError(\"Super expression must either be null or a function\"); } if (typeof _cache !== \"undefined\") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }\n\nfunction _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }\n\nfunction _isNativeReflectConstruct() { if (typeof Reflect === \"undefined\" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === \"function\") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }\n\nfunction _isNativeFunction(fn) { return Function.toString.call(fn).indexOf(\"[native code]\") !== -1; }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\nvar handlers = {};\nvar UnicornFormValidateElement = /*#__PURE__*/function (_HTMLElement) {\n  _inherits(UnicornFormValidateElement, _HTMLElement);\n\n  var _super = _createSuper(UnicornFormValidateElement);\n\n  function UnicornFormValidateElement() {\n    var _this;\n\n    _classCallCheck(this, UnicornFormValidateElement);\n\n    _this = _super.call(this);\n\n    _defineProperty(_assertThisInitialized(_this), \"presetFields\", []);\n\n    _defineProperty(_assertThisInitialized(_this), \"validators\", {});\n\n    _defineProperty(_assertThisInitialized(_this), \"$form\", void 0);\n\n    _this.registerDefaultValidators();\n\n    return _this;\n  }\n\n  _createClass(UnicornFormValidateElement, [{\n    key: \"scrollEnabled\",\n    get: function get() {\n      var scroll = this.getAttribute('scroll');\n      return scroll != null && scroll !== 'false';\n    }\n  }, {\n    key: \"scrollOffset\",\n    get: function get() {\n      return Number(this.getAttribute('scroll-offset') || -100);\n    }\n  }, {\n    key: \"fieldSelector\",\n    get: function get() {\n      return this.getAttribute('field-selector') || 'uni-field-validate';\n    }\n  }, {\n    key: \"validatedClass\",\n    get: function get() {\n      return this.getAttribute('validated-class') || 'was-validated';\n    }\n  }, {\n    key: \"connectedCallback\",\n    value: function connectedCallback() {\n      var _this2 = this;\n\n      this.$form = this.querySelector('form');\n\n      if (this.$form) {\n        this.$form.setAttribute('novalidate', true);\n        this.$form.addEventListener('submit', function (event) {\n          if (!_this2.validateAll()) {\n            event.stopImmediatePropagation();\n            event.stopPropagation();\n            event.preventDefault();\n            return false;\n          }\n\n          return true;\n        }, false);\n      }\n    }\n  }, {\n    key: \"findFields\",\n    value: function findFields() {\n      var containsPresets = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;\n      var inputs = u.selectAll(this.$form.querySelectorAll(this.fieldSelector));\n\n      if (containsPresets) {\n        inputs.push.apply(inputs, _toConsumableArray(this.presetFields));\n      }\n\n      return inputs;\n    }\n  }, {\n    key: \"validateAll\",\n    value: function validateAll() {\n      var fields = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;\n      this.markFormAsUnvalidated();\n      fields = fields || this.findFields();\n      var firstFail = null;\n      fields.forEach(function (field) {\n        var result = field.checkValidity();\n\n        if (!result && !firstFail) {\n          firstFail = field;\n        }\n      });\n      this.markFormAsValidated();\n\n      if (firstFail && this.scrollEnabled) {\n        this.scrollTo(firstFail);\n      }\n\n      return firstFail === null;\n    }\n  }, {\n    key: \"scrollTo\",\n    value: function scrollTo(element) {\n      var offset = this.scrollOffset;\n      var elementPosition = element.getBoundingClientRect().top;\n      var offsetPosition = elementPosition + window.pageYOffset + offset;\n      window.scrollTo({\n        top: offsetPosition,\n        behavior: 'smooth'\n      });\n    }\n  }, {\n    key: \"markFormAsValidated\",\n    value: function markFormAsValidated() {\n      if (!this.$form) {\n        return;\n      }\n\n      this.$form.classList.add(this.validatedClass);\n    }\n  }, {\n    key: \"markFormAsUnvalidated\",\n    value: function markFormAsUnvalidated() {\n      if (!this.$form) {\n        return;\n      }\n\n      this.$form.classList.remove(this.validatedClass);\n    }\n  }, {\n    key: \"addField\",\n    value: function addField(field) {\n      this.presetFields.push(field);\n      return this;\n    }\n  }, {\n    key: \"registerDefaultValidators\",\n    value: function registerDefaultValidators() {\n      for (var name in handlers) {\n        if (handlers.hasOwnProperty(name)) {\n          this.addValidator(name, handlers[name]);\n        }\n      }\n    }\n  }, {\n    key: \"addValidator\",\n    value: function addValidator(name, validator, options) {\n      options = options || {};\n      this.validators[name] = {\n        handler: validator,\n        options: options\n      };\n      return this;\n    }\n  }]);\n\n  return UnicornFormValidateElement;\n}( /*#__PURE__*/_wrapNativeSuper(HTMLElement));\n\n_defineProperty(UnicornFormValidateElement, \"is\", 'uni-form-validate');\n\nvar UnicornFieldValidateElement = /*#__PURE__*/function (_HTMLElement2) {\n  _inherits(UnicornFieldValidateElement, _HTMLElement2);\n\n  var _super2 = _createSuper(UnicornFieldValidateElement);\n\n  function UnicornFieldValidateElement() {\n    var _this3;\n\n    _classCallCheck(this, UnicornFieldValidateElement);\n\n    _this3 = _super2.call(this);\n\n    _defineProperty(_assertThisInitialized(_this3), \"$input\", void 0);\n\n    return _this3;\n  }\n\n  _createClass(UnicornFieldValidateElement, [{\n    key: \"attributeChangedCallback\",\n    value: function attributeChangedCallback(name, oldValue, newValue) {\n      switch (name) {\n        case 'selector':\n          this.selectInput();\n          break;\n      }\n    }\n  }, {\n    key: \"$form\",\n    get: function get() {\n      return this.getForm();\n    }\n  }, {\n    key: \"errorSelector\",\n    get: function get() {\n      return this.getAttribute('error-selector') || '[data-field-error]';\n    }\n  }, {\n    key: \"selector\",\n    get: function get() {\n      return this.getAttribute('selector') || 'input, select, textarea';\n    }\n  }, {\n    key: \"validClass\",\n    get: function get() {\n      return this.getAttribute('valid-class') || 'is-valid';\n    }\n  }, {\n    key: \"invalidClass\",\n    get: function get() {\n      return this.getAttribute('invalid-class') || 'is-invalid';\n    }\n  }, {\n    key: \"selectInput\",\n    value: function selectInput() {\n      return this.$input = this.querySelector(this.selector);\n    }\n  }, {\n    key: \"connectedCallback\",\n    value: function connectedCallback() {\n      var _this$querySelector, _this$querySelector$c;\n\n      this.selectInput();\n      this.bindEvents();\n\n      if ((_this$querySelector = this.querySelector(this.errorSelector)) !== null && _this$querySelector !== void 0 && (_this$querySelector$c = _this$querySelector.classList) !== null && _this$querySelector$c !== void 0 && _this$querySelector$c.contains('invalid-tooltip')) {\n        if (window.getComputedStyle(this).position === 'static') {\n          this.style.position = 'relative';\n        }\n      }\n    }\n  }, {\n    key: \"bindEvents\",\n    value: function bindEvents() {\n      var _this4 = this;\n\n      this.$input.addEventListener('invalid', function (e) {\n        _this4.showInvalidResponse();\n      });\n      var events = this.attributes['events'] || 'change';\n      events.split(',').map(function (e) {\n        return e.trim();\n      }).filter(function (e) {\n        return e !== '';\n      }).forEach(function (eventName) {\n        _this4.$input.addEventListener(eventName, function () {\n          _this4.checkValidity();\n        });\n      });\n    }\n  }, {\n    key: \"checkValidity\",\n    value: function checkValidity() {\n      this.$input.classList.remove(this.invalidClass);\n      this.$input.classList.remove(this.validClass);\n      this.$input.setCustomValidity('');\n\n      if (this.$form) {\n        this.runCustomValidity();\n      }\n\n      var valid = this.$input.checkValidity();\n\n      if (valid) {\n        this.$input.classList.add(this.validClass);\n      } else {\n        this.$input.classList.add(this.invalidClass);\n      }\n\n      return valid;\n    }\n  }, {\n    key: \"runCustomValidity\",\n    value: function runCustomValidity() {\n      var validates = (this.$input.getAttribute('data-validate') || '').split('|');\n      var help;\n      var result = true;\n\n      if (this.$input.value !== '' && validates.length) {\n        for (var i in validates) {\n          var validator = this.$form.validators[validates[i]];\n\n          if (validator && !validator.handler(this.$input.value, this.$input)) {\n            help = validator.options.notice;\n\n            if (typeof help === 'function') {\n              help = help(this.$input, this);\n            }\n\n            if (help != null) {\n              this.$input.setCustomValidity(help);\n            }\n\n            if (this.$input.validationMessage === '') {\n              this.$input.setCustomValidity('Value type mismatch');\n            }\n\n            result = false;\n            break;\n          }\n        }\n      }\n\n      return result;\n    }\n  }, {\n    key: \"showInvalidResponse\",\n    value: function showInvalidResponse() {\n      var $help = this.querySelector(this.errorSelector);\n      $help.textContent = this.$input.validationMessage;\n    }\n  }, {\n    key: \"clearInvalidResponse\",\n    value: function clearInvalidResponse() {\n      var $help = this.querySelector(this.errorSelector);\n      $help.textContent = '';\n    }\n  }, {\n    key: \"getForm\",\n    value: function getForm() {\n      return this.closest(this.attributes['form-selector'] || 'uni-form-validate');\n    }\n  }], [{\n    key: \"observedAttributes\",\n    get: function get() {\n      return ['selector'];\n    }\n  }]);\n\n  return UnicornFieldValidateElement;\n}( /*#__PURE__*/_wrapNativeSuper(HTMLElement));\n\n_defineProperty(UnicornFieldValidateElement, \"is\", 'uni-field-validate');\n\nfunction camelTo(str, sep) {\n  return str.replace(/([a-z])([A-Z])/g, \"$1\".concat(sep, \"$2\")).toLowerCase();\n}\n\nhandlers.username = function (value, element) {\n  var regex = new RegExp(\"[\\<|\\>|\\\"|\\'|\\%|\\;|\\(|\\)|\\&]\", \"i\");\n  return !regex.test(value);\n};\n\nhandlers.numeric = function (value, element) {\n  var regex = /^(\\d|-)?(\\d|,)*\\.?\\d*$/;\n  return regex.test(value);\n};\n\nhandlers.email = function (value, element) {\n  value = punycode.toASCII(value);\n  var regex = /^[a-zA-Z0-9.!#$%&â€™*+\\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$/;\n  return regex.test(value);\n};\n\nhandlers.url = function (value, element) {\n  var regex = /^(?:(?:https?|ftp):\\/\\/)(?:\\S+(?::\\S*)?@)?(?:(?!10(?:\\.\\d{1,3}){3})(?!127(?:\\.\\d{1,3}){3})(?!169\\.254(?:\\.\\d{1,3}){2})(?!192\\.168(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))(?::\\d{2,5})?(?:\\/[^\\s]*)?$/i;\n  return regex.test(value);\n};\n\nhandlers.alnum = function (value, element) {\n  var regex = /^[a-zA-Z0-9]*$/;\n  return regex.test(value);\n};\n\nhandlers.color = function (value, element) {\n  var regex = /^#(?:[0-9a-f]{3}){1,2}$/;\n  return regex.test(value);\n};\n\nhandlers.creditcard = function (value, element) {\n  var regex = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6011[0-9]{12}|622((12[6-9]|1[3-9][0-9])|([2-8][0-9][0-9])|(9(([0-1][0-9])|(2[0-5]))))[0-9]{10}|64[4-9][0-9]{13}|65[0-9]{14}|3(?:0[0-5]|[68][0-9])[0-9]{11}|3[47][0-9]{13})*$/;\n  return regex.test(value);\n};\n\nhandlers.ip = function (value, element) {\n  var regex = /^((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))*$/;\n  return regex.test(value);\n};\n\nhandlers['password-confirm'] = function (value, element) {\n  var selector = element.attr('data-confirm-target');\n  var target = $(selector);\n  return target.val() === value;\n};\n\ncustomElements.define(UnicornFormValidateElement.is, UnicornFormValidateElement);\ncustomElements.define(UnicornFieldValidateElement.is, UnicornFieldValidateElement);\n\n//# sourceURL=webpack:///./src/unicorn/ui/validation-components.js?");

/***/ }),

/***/ 0:
/*!*******************************************************!*\
  !*** multi ./src/unicorn/ui/validation-components.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__(/*! /Applications/XAMPP/xamppfiles/htdocs/windwalker/starter/vendor/windwalker/unicorn/assets/src/unicorn/ui/validation-components.js */\"./src/unicorn/ui/validation-components.js\");\n\n\n//# sourceURL=webpack:///multi_./src/unicorn/ui/validation-components.js?");

/***/ })

/******/ });
});