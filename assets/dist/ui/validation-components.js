(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.UVC = {}));
}(this, (function (exports) { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }

  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;

    _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !_isNativeFunction(Class)) return Class;

      if (typeof Class !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }

      if (typeof _cache !== "undefined") {
        if (_cache.has(Class)) return _cache.get(Class);

        _cache.set(Class, Wrapper);
      }

      function Wrapper() {
        return _construct(Class, arguments, _getPrototypeOf(this).constructor);
      }

      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class);
    };

    return _wrapNativeSuper(Class);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  /**
   * Part of starter project.
   *
   * @copyright  Copyright (C) 2021 __ORGANIZATION__.
   * @license    __LICENSE__
   */

  /**
   * Default handlers
   *
   * @type {Object}
   */
  var handlers = {};
  /**
   * UnicornFormValidateElement
   */

  var UnicornFormValidateElement = /*#__PURE__*/function (_HTMLElement) {
    _inherits(UnicornFormValidateElement, _HTMLElement);

    var _super = _createSuper(UnicornFormValidateElement);

    function UnicornFormValidateElement() {
      var _this;

      _classCallCheck(this, UnicornFormValidateElement);

      _this = _super.call(this);

      _defineProperty(_assertThisInitialized(_this), "presetFields", []);

      _defineProperty(_assertThisInitialized(_this), "validators", {});

      _defineProperty(_assertThisInitialized(_this), "$form", void 0);

      _this.registerDefaultValidators();

      return _this;
    }

    _createClass(UnicornFormValidateElement, [{
      key: "scrollEnabled",
      get: function get() {
        var scroll = this.getAttribute('scroll');
        return scroll != null && scroll !== 'false';
      }
    }, {
      key: "scrollOffset",
      get: function get() {
        return Number(this.getAttribute('scroll-offset') || -100);
      }
    }, {
      key: "fieldSelector",
      get: function get() {
        return this.getAttribute('field-selector') || 'uni-field-validate';
      }
    }, {
      key: "validatedClass",
      get: function get() {
        return this.getAttribute('validated-class') || 'was-validated';
      }
    }, {
      key: "connectedCallback",
      value: function connectedCallback() {
        var _this2 = this;

        this.$form = this.querySelector('form');

        if (this.$form) {
          this.$form.setAttribute('novalidate', true);
          this.$form.addEventListener('submit', function (event) {
            if (!_this2.validateAll()) {
              event.stopImmediatePropagation(); // Stop following events

              event.stopPropagation();
              event.preventDefault();
              return false;
            }

            return true;
          }, false);
        }
      }
    }, {
      key: "findFields",
      value: function findFields() {
        var containsPresets = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        var inputs = u.selectAll(this.$form.querySelectorAll(this.fieldSelector));

        if (containsPresets) {
          inputs.push.apply(inputs, _toConsumableArray(this.presetFields));
        }

        return inputs;
      }
    }, {
      key: "validateAll",
      value: function validateAll() {
        var fields = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        this.markFormAsUnvalidated();
        fields = fields || this.findFields();
        var firstFail = null;
        fields.forEach(function (field) {
          var result = field.checkValidity();

          if (!result && !firstFail) {
            firstFail = field;
          }
        });
        this.markFormAsValidated();

        if (firstFail && this.scrollEnabled) {
          this.scrollTo(firstFail);
        }

        return firstFail === null;
      }
    }, {
      key: "scrollTo",
      value: function scrollTo(element) {
        var offset = this.scrollOffset;
        var elementPosition = element.getBoundingClientRect().top;
        var offsetPosition = elementPosition + window.pageYOffset + offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, {
      key: "markFormAsValidated",
      value: function markFormAsValidated() {
        if (!this.$form) {
          return;
        }

        this.$form.classList.add(this.validatedClass);
      }
    }, {
      key: "markFormAsUnvalidated",
      value: function markFormAsUnvalidated() {
        if (!this.$form) {
          return;
        }

        this.$form.classList.remove(this.validatedClass);
      }
    }, {
      key: "addField",
      value: function addField(field) {
        this.presetFields.push(field);
        return this;
      }
    }, {
      key: "registerDefaultValidators",
      value: function registerDefaultValidators() {
        for (var name in handlers) {
          if (handlers.hasOwnProperty(name)) {
            this.addValidator(name, handlers[name]);
          }
        }
      }
      /**
       * Add validator handler.
       *
       * @param name
       * @param validator
       * @param options
       * @returns {UnicornFormValidateElement}
       */

    }, {
      key: "addValidator",
      value: function addValidator(name, validator, options) {
        options = options || {};
        this.validators[name] = {
          handler: validator,
          options: options
        };
        return this;
      }
    }]);

    return UnicornFormValidateElement;
  }( /*#__PURE__*/_wrapNativeSuper(HTMLElement));
  /**
   * UnicornFieldValidateElement
   */

  _defineProperty(UnicornFormValidateElement, "is", 'uni-form-validate');

  var UnicornFieldValidateElement = /*#__PURE__*/function (_HTMLElement2) {
    _inherits(UnicornFieldValidateElement, _HTMLElement2);

    var _super2 = _createSuper(UnicornFieldValidateElement);

    function UnicornFieldValidateElement() {
      var _this3;

      _classCallCheck(this, UnicornFieldValidateElement);

      _this3 = _super2.call(this);

      _defineProperty(_assertThisInitialized(_this3), "$input", void 0);

      return _this3;
    }

    _createClass(UnicornFieldValidateElement, [{
      key: "attributeChangedCallback",
      value: function attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
          case 'selector':
            this.selectInput();
            break;
        }
      }
    }, {
      key: "$form",
      get: function get() {
        return this.getForm();
      }
    }, {
      key: "errorSelector",
      get: function get() {
        return this.getAttribute('error-selector') || '[data-field-error]';
      }
    }, {
      key: "selector",
      get: function get() {
        return this.getAttribute('selector') || 'input, select, textarea';
      }
    }, {
      key: "validClass",
      get: function get() {
        return this.getAttribute('valid-class') || 'is-valid';
      }
    }, {
      key: "invalidClass",
      get: function get() {
        return this.getAttribute('invalid-class') || 'is-invalid';
      }
    }, {
      key: "selectInput",
      value: function selectInput() {
        return this.$input = this.querySelector(this.selector);
      }
    }, {
      key: "connectedCallback",
      value: function connectedCallback() {
        var _this$querySelector, _this$querySelector$c;

        this.selectInput();
        this.bindEvents();

        if ((_this$querySelector = this.querySelector(this.errorSelector)) !== null && _this$querySelector !== void 0 && (_this$querySelector$c = _this$querySelector.classList) !== null && _this$querySelector$c !== void 0 && _this$querySelector$c.contains('invalid-tooltip')) {
          if (window.getComputedStyle(this).position === 'static') {
            this.style.position = 'relative';
          }
        }
      }
    }, {
      key: "bindEvents",
      value: function bindEvents() {
        var _this4 = this;

        this.$input.addEventListener('invalid', function (e) {
          _this4.showInvalidResponse();
        });
        var events = this.attributes['events'] || 'change';
        events.split(',').map(function (e) {
          return e.trim();
        }).filter(function (e) {
          return e !== '';
        }).forEach(function (eventName) {
          _this4.$input.addEventListener(eventName, function () {
            _this4.checkValidity();
          });
        });
      }
    }, {
      key: "checkValidity",
      value: function checkValidity() {
        this.$input.classList.remove(this.invalidClass);
        this.$input.classList.remove(this.validClass);
        this.$input.setCustomValidity('');

        if (this.$form) {
          this.runCustomValidity();
        }

        var valid = this.$input.checkValidity();

        if (valid) {
          this.$input.classList.add(this.validClass);
        } else {
          this.$input.classList.add(this.invalidClass);
        }

        return valid;
      }
    }, {
      key: "runCustomValidity",
      value: function runCustomValidity() {
        // Check custom validity
        var validates = (this.$input.getAttribute('data-validate') || '').split('|');
        var help;
        var result = true;

        if (this.$input.value !== '' && validates.length) {
          for (var i in validates) {
            var validator = this.$form.validators[validates[i]];

            if (validator && !validator.handler(this.$input.value, this.$input)) {
              help = validator.options.notice;

              if (typeof help === 'function') {
                help = help(this.$input, this);
              }

              if (help != null) {
                this.$input.setCustomValidity(help);
              }

              if (this.$input.validationMessage === '') {
                this.$input.setCustomValidity('Value type mismatch');
              }

              result = false;
              break;
            }
          }
        }

        return result;
      }
    }, {
      key: "showInvalidResponse",
      value: function showInvalidResponse() {
        var $help = this.querySelector(this.errorSelector);
        $help.textContent = this.$input.validationMessage;
      }
    }, {
      key: "clearInvalidResponse",
      value: function clearInvalidResponse() {
        var $help = this.querySelector(this.errorSelector);
        $help.textContent = '';
      }
    }, {
      key: "getForm",
      value: function getForm() {
        return this.closest(this.attributes['form-selector'] || 'uni-form-validate');
      }
    }], [{
      key: "observedAttributes",
      get: function get() {
        return ['selector'];
      }
    }]);

    return UnicornFieldValidateElement;
  }( /*#__PURE__*/_wrapNativeSuper(HTMLElement));

  _defineProperty(UnicornFieldValidateElement, "is", 'uni-field-validate');

  handlers.username = function (value, element) {
    var regex = new RegExp("[\<|\>|\"|\'|\%|\;|\(|\)|\&]", "i");
    return !regex.test(value);
  };

  handlers.numeric = function (value, element) {
    var regex = /^(\d|-)?(\d|,)*\.?\d*$/;
    return regex.test(value);
  };

  handlers.email = function (value, element) {
    value = punycode.toASCII(value);
    var regex = /^[a-zA-Z0-9.!#$%&â€™*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return regex.test(value);
  };

  handlers.url = function (value, element) {
    var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;
    return regex.test(value);
  };

  handlers.alnum = function (value, element) {
    var regex = /^[a-zA-Z0-9]*$/;
    return regex.test(value);
  };

  handlers.color = function (value, element) {
    var regex = /^#(?:[0-9a-f]{3}){1,2}$/;
    return regex.test(value);
  };
  /**
   * @see  http://www.virtuosimedia.com/dev/php/37-tested-php-perl-and-javascript-regular-expressions
   */


  handlers.creditcard = function (value, element) {
    var regex = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6011[0-9]{12}|622((12[6-9]|1[3-9][0-9])|([2-8][0-9][0-9])|(9(([0-1][0-9])|(2[0-5]))))[0-9]{10}|64[4-9][0-9]{13}|65[0-9]{14}|3(?:0[0-5]|[68][0-9])[0-9]{11}|3[47][0-9]{13})*$/;
    return regex.test(value);
  };

  handlers.ip = function (value, element) {
    var regex = /^((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))*$/;
    return regex.test(value);
  };

  handlers['password-confirm'] = function (value, element) {
    var selector = element.attr('data-confirm-target');
    var target = $(selector);
    return target.val() === value;
  };

  customElements.define(UnicornFormValidateElement.is, UnicornFormValidateElement);
  customElements.define(UnicornFieldValidateElement.is, UnicornFieldValidateElement);

  exports.UnicornFieldValidateElement = UnicornFieldValidateElement;
  exports.UnicornFormValidateElement = UnicornFormValidateElement;

  Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFyZ2V0LmpzIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdW5pY29ybi91aS92YWxpZGF0aW9uLWNvbXBvbmVudHMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQYXJ0IG9mIHN0YXJ0ZXIgcHJvamVjdC5cbiAqXG4gKiBAY29weXJpZ2h0ICBDb3B5cmlnaHQgKEMpIDIwMjEgX19PUkdBTklaQVRJT05fXy5cbiAqIEBsaWNlbnNlICAgIF9fTElDRU5TRV9fXG4gKi9cblxuLyoqXG4gKiBEZWZhdWx0IGhhbmRsZXJzXG4gKlxuICogQHR5cGUge09iamVjdH1cbiAqL1xuY29uc3QgaGFuZGxlcnMgPSB7fTtcblxuLyoqXG4gKiBVbmljb3JuRm9ybVZhbGlkYXRlRWxlbWVudFxuICovXG5leHBvcnQgY2xhc3MgVW5pY29ybkZvcm1WYWxpZGF0ZUVsZW1lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gIHByZXNldEZpZWxkcyA9IFtdO1xuICB2YWxpZGF0b3JzID0ge307XG4gICRmb3JtO1xuXG4gIHN0YXRpYyBpcyA9ICd1bmktZm9ybS12YWxpZGF0ZSc7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMucmVnaXN0ZXJEZWZhdWx0VmFsaWRhdG9ycygpO1xuICB9XG5cbiAgZ2V0IHNjcm9sbEVuYWJsZWQoKSB7XG4gICAgY29uc3Qgc2Nyb2xsID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ3Njcm9sbCcpO1xuXG4gICAgcmV0dXJuIHNjcm9sbCAhPSBudWxsICYmIHNjcm9sbCAhPT0gJ2ZhbHNlJztcbiAgfVxuXG4gIGdldCBzY3JvbGxPZmZzZXQoKSB7XG4gICAgcmV0dXJuIE51bWJlcih0aGlzLmdldEF0dHJpYnV0ZSgnc2Nyb2xsLW9mZnNldCcpIHx8IC0xMDApO1xuICB9XG5cbiAgZ2V0IGZpZWxkU2VsZWN0b3IoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKCdmaWVsZC1zZWxlY3RvcicpIHx8ICd1bmktZmllbGQtdmFsaWRhdGUnO1xuICB9XG5cbiAgZ2V0IHZhbGlkYXRlZENsYXNzKCkge1xuICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZSgndmFsaWRhdGVkLWNsYXNzJykgfHwgJ3dhcy12YWxpZGF0ZWQnO1xuICB9XG5cbiAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgdGhpcy4kZm9ybSA9IHRoaXMucXVlcnlTZWxlY3RvcignZm9ybScpO1xuICAgIFxuICAgIGlmICh0aGlzLiRmb3JtKSB7XG4gICAgICB0aGlzLiRmb3JtLnNldEF0dHJpYnV0ZSgnbm92YWxpZGF0ZScsIHRydWUpO1xuICAgICAgdGhpcy4kZm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLnZhbGlkYXRlQWxsKCkpIHtcbiAgICAgICAgICBldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTsgLy8gU3RvcCBmb2xsb3dpbmcgZXZlbnRzXG4gICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSwgZmFsc2UpO1xuICAgIH1cbiAgfVxuXG4gIGZpbmRGaWVsZHMoY29udGFpbnNQcmVzZXRzID0gdHJ1ZSkge1xuICAgIGNvbnN0IGlucHV0cyA9IHUuc2VsZWN0QWxsKHRoaXMuJGZvcm0ucXVlcnlTZWxlY3RvckFsbCh0aGlzLmZpZWxkU2VsZWN0b3IpKTtcblxuICAgIGlmIChjb250YWluc1ByZXNldHMpIHtcbiAgICAgIGlucHV0cy5wdXNoKC4uLnRoaXMucHJlc2V0RmllbGRzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaW5wdXRzO1xuICB9XG5cbiAgdmFsaWRhdGVBbGwoZmllbGRzID0gbnVsbCkge1xuICAgIHRoaXMubWFya0Zvcm1Bc1VudmFsaWRhdGVkKCk7XG5cbiAgICBmaWVsZHMgPSBmaWVsZHMgfHwgdGhpcy5maW5kRmllbGRzKCk7XG4gICAgbGV0IGZpcnN0RmFpbCA9IG51bGw7XG5cbiAgICBmaWVsZHMuZm9yRWFjaCgoZmllbGQpID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGZpZWxkLmNoZWNrVmFsaWRpdHkoKTtcblxuICAgICAgaWYgKCFyZXN1bHQgJiYgIWZpcnN0RmFpbCkge1xuICAgICAgICBmaXJzdEZhaWwgPSBmaWVsZDtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMubWFya0Zvcm1Bc1ZhbGlkYXRlZCgpO1xuXG4gICAgaWYgKGZpcnN0RmFpbCAmJiB0aGlzLnNjcm9sbEVuYWJsZWQpIHtcbiAgICAgIHRoaXMuc2Nyb2xsVG8oZmlyc3RGYWlsKVxuICAgIH1cblxuICAgIHJldHVybiBmaXJzdEZhaWwgPT09IG51bGw7XG4gIH1cblxuICBzY3JvbGxUbyhlbGVtZW50KSB7XG4gICAgY29uc3Qgb2Zmc2V0ID0gdGhpcy5zY3JvbGxPZmZzZXQ7XG4gICAgY29uc3QgZWxlbWVudFBvc2l0aW9uID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3A7XG4gICAgY29uc3Qgb2Zmc2V0UG9zaXRpb24gPSBlbGVtZW50UG9zaXRpb24gKyB3aW5kb3cucGFnZVlPZmZzZXQgKyBvZmZzZXQ7XG5cbiAgICB3aW5kb3cuc2Nyb2xsVG8oe1xuICAgICAgdG9wOiBvZmZzZXRQb3NpdGlvbixcbiAgICAgIGJlaGF2aW9yOiAnc21vb3RoJ1xuICAgIH0pO1xuICB9XG5cbiAgbWFya0Zvcm1Bc1ZhbGlkYXRlZCgpIHtcbiAgICBpZiAoIXRoaXMuJGZvcm0pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLiRmb3JtLmNsYXNzTGlzdC5hZGQodGhpcy52YWxpZGF0ZWRDbGFzcyk7XG4gIH1cblxuICBtYXJrRm9ybUFzVW52YWxpZGF0ZWQoKSB7XG4gICAgaWYgKCF0aGlzLiRmb3JtKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy4kZm9ybS5jbGFzc0xpc3QucmVtb3ZlKHRoaXMudmFsaWRhdGVkQ2xhc3MpO1xuICB9XG5cbiAgYWRkRmllbGQoZmllbGQpIHtcbiAgICB0aGlzLnByZXNldEZpZWxkcy5wdXNoKGZpZWxkKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJlZ2lzdGVyRGVmYXVsdFZhbGlkYXRvcnMoKSB7XG4gICAgZm9yIChsZXQgbmFtZSBpbiBoYW5kbGVycykge1xuICAgICAgaWYgKGhhbmRsZXJzLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICAgIHRoaXMuYWRkVmFsaWRhdG9yKG5hbWUsIGhhbmRsZXJzW25hbWVdKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkIHZhbGlkYXRvciBoYW5kbGVyLlxuICAgKlxuICAgKiBAcGFyYW0gbmFtZVxuICAgKiBAcGFyYW0gdmFsaWRhdG9yXG4gICAqIEBwYXJhbSBvcHRpb25zXG4gICAqIEByZXR1cm5zIHtVbmljb3JuRm9ybVZhbGlkYXRlRWxlbWVudH1cbiAgICovXG4gIGFkZFZhbGlkYXRvcihuYW1lLCB2YWxpZGF0b3IsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHRoaXMudmFsaWRhdG9yc1tuYW1lXSA9IHtcbiAgICAgIGhhbmRsZXI6IHZhbGlkYXRvcixcbiAgICAgIG9wdGlvbnM6IG9wdGlvbnNcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cblxuLyoqXG4gKiBVbmljb3JuRmllbGRWYWxpZGF0ZUVsZW1lbnRcbiAqL1xuZXhwb3J0IGNsYXNzIFVuaWNvcm5GaWVsZFZhbGlkYXRlRWxlbWVudCBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgJGlucHV0O1xuXG4gIHN0YXRpYyBpcyA9ICd1bmktZmllbGQtdmFsaWRhdGUnO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBzdGF0aWMgZ2V0IG9ic2VydmVkQXR0cmlidXRlcygpIHtcbiAgICByZXR1cm4gW1xuICAgICAgJ3NlbGVjdG9yJyxcbiAgICBdXG4gIH1cblxuICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlKSB7XG4gICAgc3dpdGNoIChuYW1lKSB7XG4gICAgICBjYXNlICdzZWxlY3Rvcic6XG4gICAgICAgIHRoaXMuc2VsZWN0SW5wdXQoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgZ2V0ICRmb3JtKCkge1xuICAgIHJldHVybiB0aGlzLmdldEZvcm0oKTtcbiAgfVxuXG4gIGdldCBlcnJvclNlbGVjdG9yKCkge1xuICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZSgnZXJyb3Itc2VsZWN0b3InKSB8fCAnW2RhdGEtZmllbGQtZXJyb3JdJztcbiAgfVxuXG4gIGdldCBzZWxlY3RvcigpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoJ3NlbGVjdG9yJykgfHwgJ2lucHV0LCBzZWxlY3QsIHRleHRhcmVhJztcbiAgfVxuXG4gIGdldCB2YWxpZENsYXNzKCkge1xuICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZSgndmFsaWQtY2xhc3MnKSB8fCAnaXMtdmFsaWQnO1xuICB9XG5cbiAgZ2V0IGludmFsaWRDbGFzcygpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoJ2ludmFsaWQtY2xhc3MnKSB8fCAnaXMtaW52YWxpZCc7XG4gIH1cblxuICBzZWxlY3RJbnB1dCgpIHtcbiAgICByZXR1cm4gdGhpcy4kaW5wdXQgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IodGhpcy5zZWxlY3Rvcik7XG4gIH1cblxuICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICB0aGlzLnNlbGVjdElucHV0KCk7XG5cbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcblxuICAgIGlmICh0aGlzLnF1ZXJ5U2VsZWN0b3IodGhpcy5lcnJvclNlbGVjdG9yKT8uY2xhc3NMaXN0Py5jb250YWlucygnaW52YWxpZC10b29sdGlwJykpIHtcbiAgICAgIGlmICh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzKS5wb3NpdGlvbiA9PT0gJ3N0YXRpYycpIHtcbiAgICAgICAgdGhpcy5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYmluZEV2ZW50cygpIHtcbiAgICB0aGlzLiRpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnZhbGlkJywgKGUpID0+IHtcbiAgICAgIHRoaXMuc2hvd0ludmFsaWRSZXNwb25zZSgpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgZXZlbnRzID0gdGhpcy5hdHRyaWJ1dGVzWydldmVudHMnXSB8fCAnY2hhbmdlJztcblxuICAgIGV2ZW50cy5zcGxpdCgnLCcpXG4gICAgICAubWFwKGUgPT4gZS50cmltKCkpXG4gICAgICAuZmlsdGVyKGUgPT4gZSAhPT0gJycpXG4gICAgICAuZm9yRWFjaCgoZXZlbnROYW1lKSA9PiB7XG4gICAgICAgIHRoaXMuJGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5jaGVja1ZhbGlkaXR5KCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gIH1cblxuICBjaGVja1ZhbGlkaXR5KCkge1xuICAgIHRoaXMuJGlucHV0LmNsYXNzTGlzdC5yZW1vdmUodGhpcy5pbnZhbGlkQ2xhc3MpO1xuICAgIHRoaXMuJGlucHV0LmNsYXNzTGlzdC5yZW1vdmUodGhpcy52YWxpZENsYXNzKTtcblxuICAgIHRoaXMuJGlucHV0LnNldEN1c3RvbVZhbGlkaXR5KCcnKTtcblxuICAgIGlmICh0aGlzLiRmb3JtKSB7XG4gICAgICB0aGlzLnJ1bkN1c3RvbVZhbGlkaXR5KCk7XG4gICAgfVxuXG4gICAgY29uc3QgdmFsaWQgPSB0aGlzLiRpbnB1dC5jaGVja1ZhbGlkaXR5KCk7XG5cbiAgICBpZiAodmFsaWQpIHtcbiAgICAgIHRoaXMuJGlucHV0LmNsYXNzTGlzdC5hZGQodGhpcy52YWxpZENsYXNzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy4kaW5wdXQuY2xhc3NMaXN0LmFkZCh0aGlzLmludmFsaWRDbGFzcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbGlkO1xuICB9XG5cbiAgcnVuQ3VzdG9tVmFsaWRpdHkoKSB7XG4gICAgLy8gQ2hlY2sgY3VzdG9tIHZhbGlkaXR5XG4gICAgY29uc3QgdmFsaWRhdGVzID0gKHRoaXMuJGlucHV0LmdldEF0dHJpYnV0ZSgnZGF0YS12YWxpZGF0ZScpIHx8ICcnKS5zcGxpdCgnfCcpO1xuICAgIGxldCBoZWxwO1xuICAgIGxldCByZXN1bHQgPSB0cnVlO1xuXG4gICAgaWYgKHRoaXMuJGlucHV0LnZhbHVlICE9PSAnJyAmJiB2YWxpZGF0ZXMubGVuZ3RoKSB7XG4gICAgICBmb3IgKGxldCBpIGluIHZhbGlkYXRlcykge1xuICAgICAgICBjb25zdCB2YWxpZGF0b3IgPSB0aGlzLiRmb3JtLnZhbGlkYXRvcnNbdmFsaWRhdGVzW2ldXTtcbiAgICAgICAgaWYgKHZhbGlkYXRvciAmJiAhdmFsaWRhdG9yLmhhbmRsZXIodGhpcy4kaW5wdXQudmFsdWUsIHRoaXMuJGlucHV0KSkge1xuICAgICAgICAgIGhlbHAgPSB2YWxpZGF0b3Iub3B0aW9ucy5ub3RpY2U7XG5cbiAgICAgICAgICBpZiAodHlwZW9mIGhlbHAgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGhlbHAgPSBoZWxwKHRoaXMuJGlucHV0LCB0aGlzKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoaGVscCAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLiRpbnB1dC5zZXRDdXN0b21WYWxpZGl0eShoZWxwKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodGhpcy4kaW5wdXQudmFsaWRhdGlvbk1lc3NhZ2UgPT09ICcnKSB7XG4gICAgICAgICAgICB0aGlzLiRpbnB1dC5zZXRDdXN0b21WYWxpZGl0eSgnVmFsdWUgdHlwZSBtaXNtYXRjaCcpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlc3VsdCA9IGZhbHNlO1xuXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgc2hvd0ludmFsaWRSZXNwb25zZSgpIHtcbiAgICBjb25zdCAkaGVscCA9IHRoaXMucXVlcnlTZWxlY3Rvcih0aGlzLmVycm9yU2VsZWN0b3IpO1xuXG4gICAgJGhlbHAudGV4dENvbnRlbnQgPSB0aGlzLiRpbnB1dC52YWxpZGF0aW9uTWVzc2FnZTtcbiAgfVxuXG4gIGNsZWFySW52YWxpZFJlc3BvbnNlKCkge1xuICAgIGNvbnN0ICRoZWxwID0gdGhpcy5xdWVyeVNlbGVjdG9yKHRoaXMuZXJyb3JTZWxlY3Rvcik7XG5cbiAgICAkaGVscC50ZXh0Q29udGVudCA9ICcnO1xuICB9XG5cbiAgZ2V0Rm9ybSgpIHtcbiAgICByZXR1cm4gdGhpcy5jbG9zZXN0KHRoaXMuYXR0cmlidXRlc1snZm9ybS1zZWxlY3RvciddIHx8ICd1bmktZm9ybS12YWxpZGF0ZScpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNhbWVsVG8oc3RyLCBzZXApIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCBgJDEke3NlcH0kMmApLnRvTG93ZXJDYXNlKCk7XG59XG5cbmhhbmRsZXJzLnVzZXJuYW1lID0gZnVuY3Rpb24odmFsdWUsIGVsZW1lbnQpIHtcbiAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKFwiW1xcPHxcXD58XFxcInxcXCd8XFwlfFxcO3xcXCh8XFwpfFxcJl1cIiwgXCJpXCIpO1xuICByZXR1cm4gIXJlZ2V4LnRlc3QodmFsdWUpO1xufTtcblxuaGFuZGxlcnMubnVtZXJpYyA9IGZ1bmN0aW9uKHZhbHVlLCBlbGVtZW50KSB7XG4gIGNvbnN0IHJlZ2V4ID0gL14oXFxkfC0pPyhcXGR8LCkqXFwuP1xcZCokLztcbiAgcmV0dXJuIHJlZ2V4LnRlc3QodmFsdWUpO1xufTtcblxuaGFuZGxlcnMuZW1haWwgPSBmdW5jdGlvbih2YWx1ZSwgZWxlbWVudCkge1xuICB2YWx1ZSA9IHB1bnljb2RlLnRvQVNDSUkodmFsdWUpO1xuICBjb25zdCByZWdleCA9IC9eW2EtekEtWjAtOS4hIyQlJsOi4oKs4oSiKitcXC89P15fYHt8fX4tXStAW2EtekEtWjAtOS1dKyg/OlxcLlthLXpBLVowLTktXSspKiQvO1xuICByZXR1cm4gcmVnZXgudGVzdCh2YWx1ZSk7XG59O1xuXG5oYW5kbGVycy51cmwgPSBmdW5jdGlvbih2YWx1ZSwgZWxlbWVudCkge1xuICBjb25zdCByZWdleCA9IC9eKD86KD86aHR0cHM/fGZ0cCk6XFwvXFwvKSg/OlxcUysoPzo6XFxTKik/QCk/KD86KD8hMTAoPzpcXC5cXGR7MSwzfSl7M30pKD8hMTI3KD86XFwuXFxkezEsM30pezN9KSg/ITE2OVxcLjI1NCg/OlxcLlxcZHsxLDN9KXsyfSkoPyExOTJcXC4xNjgoPzpcXC5cXGR7MSwzfSl7Mn0pKD8hMTcyXFwuKD86MVs2LTldfDJcXGR8M1swLTFdKSg/OlxcLlxcZHsxLDN9KXsyfSkoPzpbMS05XVxcZD98MVxcZFxcZHwyWzAxXVxcZHwyMlswLTNdKSg/OlxcLig/OjE/XFxkezEsMn18MlswLTRdXFxkfDI1WzAtNV0pKXsyfSg/OlxcLig/OlsxLTldXFxkP3wxXFxkXFxkfDJbMC00XVxcZHwyNVswLTRdKSl8KD86KD86W2EtelxcdTAwYTEtXFx1ZmZmZjAtOV0rLT8pKlthLXpcXHUwMGExLVxcdWZmZmYwLTldKykoPzpcXC4oPzpbYS16XFx1MDBhMS1cXHVmZmZmMC05XSstPykqW2EtelxcdTAwYTEtXFx1ZmZmZjAtOV0rKSooPzpcXC4oPzpbYS16XFx1MDBhMS1cXHVmZmZmXXsyLH0pKSkoPzo6XFxkezIsNX0pPyg/OlxcL1teXFxzXSopPyQvaTtcbiAgcmV0dXJuIHJlZ2V4LnRlc3QodmFsdWUpO1xufTtcblxuaGFuZGxlcnMuYWxudW0gPSBmdW5jdGlvbih2YWx1ZSwgZWxlbWVudCkge1xuICBjb25zdCByZWdleCA9IC9eW2EtekEtWjAtOV0qJC87XG4gIHJldHVybiByZWdleC50ZXN0KHZhbHVlKTtcbn07XG5cbmhhbmRsZXJzLmNvbG9yID0gZnVuY3Rpb24odmFsdWUsIGVsZW1lbnQpIHtcbiAgY29uc3QgcmVnZXggPSAvXiMoPzpbMC05YS1mXXszfSl7MSwyfSQvO1xuICByZXR1cm4gcmVnZXgudGVzdCh2YWx1ZSk7XG59O1xuXG4vKipcbiAqIEBzZWUgIGh0dHA6Ly93d3cudmlydHVvc2ltZWRpYS5jb20vZGV2L3BocC8zNy10ZXN0ZWQtcGhwLXBlcmwtYW5kLWphdmFzY3JpcHQtcmVndWxhci1leHByZXNzaW9uc1xuICovXG5oYW5kbGVycy5jcmVkaXRjYXJkID0gZnVuY3Rpb24odmFsdWUsIGVsZW1lbnQpIHtcbiAgY29uc3QgcmVnZXggPSAvXig/OjRbMC05XXsxMn0oPzpbMC05XXszfSk/fDVbMS01XVswLTldezE0fXw2MDExWzAtOV17MTJ9fDYyMigoMTJbNi05XXwxWzMtOV1bMC05XSl8KFsyLThdWzAtOV1bMC05XSl8KDkoKFswLTFdWzAtOV0pfCgyWzAtNV0pKSkpWzAtOV17MTB9fDY0WzQtOV1bMC05XXsxM318NjVbMC05XXsxNH18Myg/OjBbMC01XXxbNjhdWzAtOV0pWzAtOV17MTF9fDNbNDddWzAtOV17MTN9KSokLztcbiAgcmV0dXJuIHJlZ2V4LnRlc3QodmFsdWUpO1xufTtcblxuaGFuZGxlcnMuaXAgPSBmdW5jdGlvbih2YWx1ZSwgZWxlbWVudCkge1xuICBjb25zdCByZWdleCA9IC9eKCg/Oig/OjI1WzAtNV18MlswLTRdWzAtOV18WzAxXT9bMC05XVswLTldPylcXC4pezN9KD86MjVbMC01XXwyWzAtNF1bMC05XXxbMDFdP1swLTldWzAtOV0/KSkqJC87XG4gIHJldHVybiByZWdleC50ZXN0KHZhbHVlKTtcbn07XG5cbmhhbmRsZXJzWydwYXNzd29yZC1jb25maXJtJ10gPSBmdW5jdGlvbiAodmFsdWUsIGVsZW1lbnQpIHtcbiAgY29uc3Qgc2VsZWN0b3IgPSBlbGVtZW50LmF0dHIoJ2RhdGEtY29uZmlybS10YXJnZXQnKTtcbiAgY29uc3QgdGFyZ2V0ID0gJChzZWxlY3Rvcik7XG5cbiAgcmV0dXJuIHRhcmdldC52YWwoKSA9PT0gdmFsdWU7XG59O1xuXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoVW5pY29ybkZvcm1WYWxpZGF0ZUVsZW1lbnQuaXMsIFVuaWNvcm5Gb3JtVmFsaWRhdGVFbGVtZW50KTtcbmN1c3RvbUVsZW1lbnRzLmRlZmluZShVbmljb3JuRmllbGRWYWxpZGF0ZUVsZW1lbnQuaXMsIFVuaWNvcm5GaWVsZFZhbGlkYXRlRWxlbWVudCk7XG4iXSwibmFtZXMiOlsiaGFuZGxlcnMiLCJVbmljb3JuRm9ybVZhbGlkYXRlRWxlbWVudCIsInJlZ2lzdGVyRGVmYXVsdFZhbGlkYXRvcnMiLCJzY3JvbGwiLCJnZXRBdHRyaWJ1dGUiLCJOdW1iZXIiLCIkZm9ybSIsInF1ZXJ5U2VsZWN0b3IiLCJzZXRBdHRyaWJ1dGUiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJ2YWxpZGF0ZUFsbCIsInN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbiIsInN0b3BQcm9wYWdhdGlvbiIsInByZXZlbnREZWZhdWx0IiwiY29udGFpbnNQcmVzZXRzIiwiaW5wdXRzIiwidSIsInNlbGVjdEFsbCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJmaWVsZFNlbGVjdG9yIiwicHVzaCIsInByZXNldEZpZWxkcyIsImZpZWxkcyIsIm1hcmtGb3JtQXNVbnZhbGlkYXRlZCIsImZpbmRGaWVsZHMiLCJmaXJzdEZhaWwiLCJmb3JFYWNoIiwiZmllbGQiLCJyZXN1bHQiLCJjaGVja1ZhbGlkaXR5IiwibWFya0Zvcm1Bc1ZhbGlkYXRlZCIsInNjcm9sbEVuYWJsZWQiLCJzY3JvbGxUbyIsImVsZW1lbnQiLCJvZmZzZXQiLCJzY3JvbGxPZmZzZXQiLCJlbGVtZW50UG9zaXRpb24iLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJ0b3AiLCJvZmZzZXRQb3NpdGlvbiIsIndpbmRvdyIsInBhZ2VZT2Zmc2V0IiwiYmVoYXZpb3IiLCJjbGFzc0xpc3QiLCJhZGQiLCJ2YWxpZGF0ZWRDbGFzcyIsInJlbW92ZSIsIm5hbWUiLCJoYXNPd25Qcm9wZXJ0eSIsImFkZFZhbGlkYXRvciIsInZhbGlkYXRvciIsIm9wdGlvbnMiLCJ2YWxpZGF0b3JzIiwiaGFuZGxlciIsIkhUTUxFbGVtZW50IiwiVW5pY29ybkZpZWxkVmFsaWRhdGVFbGVtZW50Iiwib2xkVmFsdWUiLCJuZXdWYWx1ZSIsInNlbGVjdElucHV0IiwiZ2V0Rm9ybSIsIiRpbnB1dCIsInNlbGVjdG9yIiwiYmluZEV2ZW50cyIsImVycm9yU2VsZWN0b3IiLCJjb250YWlucyIsImdldENvbXB1dGVkU3R5bGUiLCJwb3NpdGlvbiIsInN0eWxlIiwiZSIsInNob3dJbnZhbGlkUmVzcG9uc2UiLCJldmVudHMiLCJhdHRyaWJ1dGVzIiwic3BsaXQiLCJtYXAiLCJ0cmltIiwiZmlsdGVyIiwiZXZlbnROYW1lIiwiaW52YWxpZENsYXNzIiwidmFsaWRDbGFzcyIsInNldEN1c3RvbVZhbGlkaXR5IiwicnVuQ3VzdG9tVmFsaWRpdHkiLCJ2YWxpZCIsInZhbGlkYXRlcyIsImhlbHAiLCJ2YWx1ZSIsImxlbmd0aCIsImkiLCJub3RpY2UiLCJ2YWxpZGF0aW9uTWVzc2FnZSIsIiRoZWxwIiwidGV4dENvbnRlbnQiLCJjbG9zZXN0IiwidXNlcm5hbWUiLCJyZWdleCIsIlJlZ0V4cCIsInRlc3QiLCJudW1lcmljIiwiZW1haWwiLCJwdW55Y29kZSIsInRvQVNDSUkiLCJ1cmwiLCJhbG51bSIsImNvbG9yIiwiY3JlZGl0Y2FyZCIsImlwIiwiYXR0ciIsInRhcmdldCIsIiQiLCJ2YWwiLCJjdXN0b21FbGVtZW50cyIsImRlZmluZSIsImlzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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