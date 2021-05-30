function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */
var FlatpickrElement = /*#__PURE__*/function (_HTMLElement) {
  _inherits(FlatpickrElement, _HTMLElement);

  var _super = _createSuper(FlatpickrElement);

  function FlatpickrElement() {
    var _this;

    _classCallCheck(this, FlatpickrElement);

    _this = _super.call(this);

    _defineProperty(_assertThisInitialized(_this), "instance", void 0);

    return _this;
  }

  _createClass(FlatpickrElement, [{
    key: "selector",
    get: function get() {
      return this.getAttribute('selector') || 'input';
    } // todo: Currently not support single option attributes

  }, {
    key: "getOptions",
    value: function getOptions() {
      var _this2 = this;

      var options = {};
      var ignore = ['selector'];
      this.getAttributeNames().forEach(function (name) {
        if (ignore.indexOf(name) !== -1) {
          return;
        }

        options[name] = _this2.getAttribute(name);
      });
      return options;
    }
  }, {
    key: "connectedCallback",
    value: function connectedCallback() {
      var _this3 = this;

      var options = JSON.parse(this.getAttribute('options'));
      this.handleOptions(options).then(function (options) {
        _this3.instance = flatpickr(_this3.querySelector(_this3.selector), options);
      });
    }
  }, {
    key: "handleOptions",
    value: function handleOptions(options) {
      if (options.monthSelect) {
        return Promise.all([System["import"]('@flatpickr/plugins/monthSelect/index.js?dcffc8a3a09fd830ae43c569'), System["import"]('@flatpickr/plugins/monthSelect/style.css')]).then(function (modules) {
          var styleSheet = modules[1]["default"]; // A CSSStyleSheet object

          document.adoptedStyleSheets = [].concat(_toConsumableArray(document.adoptedStyleSheets), [styleSheet]);
          options.plugins = options.plugins || [];

          if (typeof options.monthSelect === 'boolean') {
            options.monthSelect = {
              shorthand: true,
              dateFormat: 'Y-m',
              altFormat: 'Y-m'
            };
          }

          options.plugins.push(new monthSelectPlugin(options.monthSelect));
          return options;
        });
      }

      return Promise.resolve(options);
    }
  }, {
    key: "getInstance",
    value: function getInstance() {
      return this.instance;
    }
  }], [{
    key: "is",
    get: function get() {
      return 'uni-flatpickr';
    }
  }]);

  return FlatpickrElement;
}( /*#__PURE__*/_wrapNativeSuper(HTMLElement));

Promise.all([System["import"]('@flatpickr/flatpickr.js?dcffc8a3a09fd830ae43c569'), System["import"]('@flatpickr/flatpickr.css')]).then(function (modules) {
  var styleSheet = modules[1]["default"]; // A CSSStyleSheet object

  document.adoptedStyleSheets = [].concat(_toConsumableArray(document.adoptedStyleSheets), [styleSheet]);
  customElements.define(FlatpickrElement.is, FlatpickrElement);
});
//# sourceMappingURL=flatpickr-components.js.map
