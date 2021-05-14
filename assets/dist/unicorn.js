(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Unicorn = {}));
}(this, (function (exports) { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

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

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  /**
   * Part of phoenix project.
   *
   * Modified version of mixwith.js. @see https://raw.githubusercontent.com/justinfagnani/mixwith.js/
   *
   * @copyright  Copyright (C) 2019 ${ORGANIZATION}.
   * @license    __LICENSE__
   */
  // used by apply() and isApplicationOf()
  var _appliedMixin = '__mixwith_appliedMixin';
  /**
   * A function that returns a subclass of its argument.
   *
   * @example
   * const M = (superclass) => class extends superclass {
   *   getMessage() {
   *     return "Hello";
   *   }
   * }
   *
   * @typedef {Function} MixinFunction
   * @param {Function} superclass
   * @return {Function} A subclass of `superclass`
   */

  /**
   * Applies `mixin` to `superclass`.
   *
   * `apply` stores a reference from the mixin application to the unwrapped mixin
   * to make `isApplicationOf` and `hasMixin` work.
   *
   * This function is usefull for mixin wrappers that want to automatically enable
   * {@link hasMixin} support.
   *
   * @example
   * const Applier = (mixin) => wrap(mixin, (superclass) => apply(superclass, mixin));
   *
   * // M now works with `hasMixin` and `isApplicationOf`
   * const M = Applier((superclass) => class extends superclass {});
   *
   * class C extends M(Object) {}
   * let i = new C();
   * hasMixin(i, M); // true
   *
   * @function
   * @param {Function} superclass A class or constructor function
   * @param {MixinFunction} mixin The mixin to apply
   * @return {Function} A subclass of `superclass` produced by `mixin`
   */

  var apply$1 = function apply(superclass, mixin) {
    var application = mixin(superclass);
    application.prototype[_appliedMixin] = unwrap(mixin);
    return application;
  };
  /**
   * Returns `true` iff `proto` is a prototype created by the application of
   * `mixin` to a superclass.
   *
   * `isApplicationOf` works by checking that `proto` has a reference to `mixin`
   * as created by `apply`.
   *
   * @function
   * @param {Object} proto A prototype object created by {@link apply}.
   * @param {MixinFunction} mixin A mixin function used with {@link apply}.
   * @return {boolean} whether `proto` is a prototype created by the application of
   * `mixin` to a superclass
   */


  var isApplicationOf = function isApplicationOf(proto, mixin) {
    return proto.hasOwnProperty(_appliedMixin) && proto[_appliedMixin] === unwrap(mixin);
  };
  /**
   * Returns `true` iff `o` has an application of `mixin` on its prototype
   * chain.
   *
   * @function
   * @param {Object} o An object
   * @param {MixinFunction} mixin A mixin applied with {@link apply}
   * @return {boolean} whether `o` has an application of `mixin` on its prototype
   * chain
   */


  var hasMixin = function hasMixin(o, mixin) {
    while (o != null) {
      if (isApplicationOf(o, mixin)) return true;
      o = Object.getPrototypeOf(o);
    }

    return false;
  }; // used by wrap() and unwrap()


  var _wrappedMixin = '__mixwith_wrappedMixin';
  /**
   * Sets up the function `mixin` to be wrapped by the function `wrapper`, while
   * allowing properties on `mixin` to be available via `wrapper`, and allowing
   * `wrapper` to be unwrapped to get to the original function.
   *
   * `wrap` does two things:
   *   1. Sets the prototype of `mixin` to `wrapper` so that properties set on
   *      `mixin` inherited by `wrapper`.
   *   2. Sets a special property on `mixin` that points back to `mixin` so that
   *      it can be retreived from `wrapper`
   *
   * @function
   * @param {MixinFunction} mixin A mixin function
   * @param {MixinFunction} wrapper A function that wraps {@link mixin}
   * @return {MixinFunction} `wrapper`
   */

  var wrap = function wrap(mixin, wrapper) {
    Object.setPrototypeOf(wrapper, mixin);

    if (!mixin[_wrappedMixin]) {
      mixin[_wrappedMixin] = mixin;
    }

    return wrapper;
  };
  /**
   * Unwraps the function `wrapper` to return the original function wrapped by
   * one or more calls to `wrap`. Returns `wrapper` if it's not a wrapped
   * function.
   *
   * @function
   * @param {MixinFunction} wrapper A wrapped mixin produced by {@link wrap}
   * @return {MixinFunction} The originally wrapped mixin
   */


  var unwrap = function unwrap(wrapper) {
    return wrapper[_wrappedMixin] || wrapper;
  };

  var _cachedApplications = '__mixwith_cachedApplications';
  /**
   * Decorates `mixin` so that it caches its applications. When applied multiple
   * times to the same superclass, `mixin` will only create one subclass, memoize
   * it and return it for each application.
   *
   * Note: If `mixin` somehow stores properties its classes constructor (static
   * properties), or on its classes prototype, it will be shared across all
   * applications of `mixin` to a super class. It's reccomended that `mixin` only
   * access instance state.
   *
   * @function
   * @param {MixinFunction} mixin The mixin to wrap with caching behavior
   * @return {MixinFunction} a new mixin function
   */

  var Cached = function Cached(mixin) {
    return wrap(mixin, function (superclass) {
      // Get or create a symbol used to look up a previous application of mixin
      // to the class. This symbol is unique per mixin definition, so a class will have N
      // applicationRefs if it has had N mixins applied to it. A mixin will have
      // exactly one _cachedApplicationRef used to store its applications.
      var cachedApplications = superclass[_cachedApplications];

      if (!cachedApplications) {
        cachedApplications = superclass[_cachedApplications] = new Map();
      }

      var application = cachedApplications.get(mixin);

      if (!application) {
        application = mixin(superclass);
        cachedApplications.set(mixin, application);
      }

      return application;
    });
  };
  /**
   * Decorates `mixin` so that it only applies if it's not already on the
   * prototype chain.
   *
   * @function
   * @param {MixinFunction} mixin The mixin to wrap with deduplication behavior
   * @return {MixinFunction} a new mixin function
   */


  var DeDupe = function DeDupe(mixin) {
    return wrap(mixin, function (superclass) {
      return hasMixin(superclass.prototype, mixin) ? superclass : mixin(superclass);
    });
  };
  /**
   * A basic mixin decorator that applies the mixin with {@link apply} so that it
   * can be used with {@link isApplicationOf}, {@link hasMixin} and the other
   * mixin decorator functions.
   *
   * @function
   * @param {MixinFunction} mixin The mixin to wrap
   * @return {MixinFunction} a new mixin function
   */


  var BareMixin = function BareMixin(mixin) {
    return wrap(mixin, function (s) {
      return apply$1(s, mixin);
    });
  };
  /**
   * Decorates a mixin function to add deduplication, application caching and
   * instanceof support.
   *
   * @function
   * @param {MixinFunction} mixin The mixin to wrap
   * @return {MixinFunction} a new mixin function
   */


  var Mixin = function Mixin(mixin) {
    return DeDupe(Cached(BareMixin(mixin)));
  };
  /**
   * A fluent interface to apply a list of mixins to a superclass.
   *
   * ```javascript
   * class X extends mix(Object).with(A, B, C) {}
   * ```
   *
   * The mixins are applied in order to the superclass, so the prototype chain
   * will be: X->C'->B'->A'->Object.
   *
   * This is purely a convenience function. The above example is equivalent to:
   *
   * ```javascript
   * class X extends C(B(A(Object))) {}
   * ```
   *
   * @function
   * @param {Function} [superclass=Object]
   * @return {MixinBuilder}
   */

  var mix = function mix(superclass) {
    return new MixinBuilder(superclass);
  };

  var MixinBuilder = /*#__PURE__*/function () {
    function MixinBuilder(superclass) {
      _classCallCheck(this, MixinBuilder);

      this.superclass = superclass || /*#__PURE__*/function () {
        function _class() {
          _classCallCheck(this, _class);
        }

        return _class;
      }();
    }
    /**
     * Applies `mixins` in order to the superclass given to `mix()`.
     *
     * @param {Array.<Mixin>} mixins
     * @return {Function} a subclass of `superclass` with `mixins` applied
     */


    _createClass(MixinBuilder, [{
      key: "with",
      value: function _with() {
        for (var _len = arguments.length, mixins = new Array(_len), _key = 0; _key < _len; _key++) {
          mixins[_key] = arguments[_key];
        }

        return mixins.reduce(function (c, m) {
          return m(c);
        }, this.superclass);
      }
    }]);

    return MixinBuilder;
  }(); // Polyfill For IE
  // @see https://juejin.im/post/5d887a9c518825094b34f41d


  (function () {
    Object.setPrototypeOf = Object.setPrototypeOf || ({
      __proto__: []
    } instanceof Array ? setProtoOf : mixinProperties);

    function setProtoOf(obj, proto) {
      obj.__proto__ = proto;
      return obj;
    }

    function mixinProperties(obj, proto) {
      for (var prop in proto) {
        if (!obj.hasOwnProperty(prop)) {
          obj[prop] = proto[prop];
        }
      }

      return obj;
    }
  })();

  var EventMixin = Mixin(function (superclass) {
    return /*#__PURE__*/function (_superclass) {
      _inherits(_class2, _superclass);

      var _super = _createSuper(_class2);

      function _class2() {
        var _this;

        _classCallCheck(this, _class2);

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        _this = _super.call.apply(_super, [this].concat(args));

        _defineProperty(_assertThisInitialized(_this), "_listeners", {});

        return _this;
      }

      _createClass(_class2, [{
        key: "on",
        value: function on(event, handler) {
          var _this2 = this;

          if (Array.isArray(event)) {
            event.forEach(function (e) {
              return _this2.on(e, handler);
            });
            return this;
          }

          if (this._listeners[event] === undefined) {
            this._listeners[event] = [];
          }

          this._listeners[event].push(handler);

          return this;
        }
      }, {
        key: "once",
        value: function once(event, handler) {
          var _this3 = this;

          if (Array.isArray(event)) {
            event.forEach(function (e) {
              return _this3.once(e, handler);
            });
            return this;
          }

          handler._once = true;
          this.on(event, handler);
        }
      }, {
        key: "off",
        value: function off(event) {
          var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

          if (callback !== null) {
            this._listeners[event] = this.listeners(event).filter(function (listener) {
              return listener !== callback;
            });
            return this;
          }

          delete this._listeners[event];
          return this;
        }
      }, {
        key: "trigger",
        value: function trigger(event) {
          var _this4 = this;

          for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            args[_key2 - 1] = arguments[_key2];
          }

          if (Array.isArray(event)) {
            event.forEach(function (e) {
              return _this4.trigger(e);
            });
            return this;
          }

          this.listeners(event).forEach(function (listener) {
            listener.apply(void 0, args);
          }); // Remove once

          this._listeners[event] = this.listeners(event).filter(function (listener) {
            return listener._once !== true;
          });
          return this;
        }
      }, {
        key: "listeners",
        value: function listeners(event) {
          if (typeof event !== 'string') {
            throw new Error("get listeners event name should only use string.");
          }

          return this._listeners[event] === undefined ? [] : this._listeners[event];
        }
      }]);

      return _class2;
    }(superclass);
  });
  var EventBus = /*#__PURE__*/function (_EventMixin) {
    _inherits(EventBus, _EventMixin);

    var _super2 = _createSuper(EventBus);

    function EventBus() {
      _classCallCheck(this, EventBus);

      return _super2.apply(this, arguments);
    }

    return EventBus;
  }(EventMixin( /*#__PURE__*/function () {
    function _class3() {
      _classCallCheck(this, _class3);
    }

    return _class3;
  }()));

  /**
   * Part of starter project.
   *
   * @copyright  Copyright (C) 2021 __ORGANIZATION__.
   * @license    __LICENSE__
   */
  var UnicornValidation = /*#__PURE__*/function () {
    function UnicornValidation() {
      _classCallCheck(this, UnicornValidation);
    }

    _createClass(UnicornValidation, null, [{
      key: "install",
      value: function install(app) {

        app.formValidation = function () {
          var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'uni-form-validate';
          app["import"]('@unicorn/ui/validation-components.js');
          return app.selectOne(selector);
        };
      }
    }]);

    return UnicornValidation;
  }();

  /**
   * Part of starter project.
   *
   * @copyright  Copyright (C) 2021 __ORGANIZATION__.
   * @license    __LICENSE__
   */
  var UnicornUI = /*#__PURE__*/function () {
    function UnicornUI(app) {
      _classCallCheck(this, UnicornUI);

      _defineProperty(this, "theme", void 0);

      this.app = app;
      this.aliveHandle = null;
    }

    _createClass(UnicornUI, [{
      key: "installTheme",
      value: function installTheme(theme) {
        this.theme = theme;
      }
    }, {
      key: "renderMessage",
      value: function renderMessage(messages) {//
      }
    }, {
      key: "loadAlpine",
      value: function loadAlpine() {
        return this.app["import"]('@alpinejs');
      }
    }, {
      key: "loadSpruce",
      value: function loadSpruce() {
        return Promise.all([this.loadAlpine(), this.app["import"]('@spruce')]);
      }
    }, {
      key: "initAlpine",
      value: function initAlpine(selector) {
        var _this = this;

        return this.loadAlpine().then(function () {
          var element = _this.app.selectOne(selector);

          Alpine.initializeComponent(element);
        });
      }
    }, {
      key: "startAlpine",
      value: function startAlpine() {
        return this.loadAlpine().then(function () {
          if (Spruce) {
            Spruce.start();
          }

          Alpine.start();
        });
      }
    }, {
      key: "startAlpineSpruce",
      value: function startAlpineSpruce() {
        return this.loadSpruce().then(function () {
          Alpine.start();
        });
      }
    }, {
      key: "initAlpineSpruce",
      value: function initAlpineSpruce(selector) {
        var _this2 = this;

        return this.loadSpruce().then(function () {
          var element = _this2.app.selectOne(selector);

          Alpine.initializeComponent(element);
        });
      }
    }, {
      key: "flatpickr",
      value: function flatpickr() {
        return this.app["import"]('@unicorn/ui/flatpickr-components.js');
      }
    }, {
      key: "listDependent",
      value: function listDependent() {
        return this.app["import"]('@unicorn/ui/list-dependent.js');
      }
    }], [{
      key: "is",
      get: function get() {
        return 'ui';
      }
    }, {
      key: "install",
      value: function install(app) {

        // Disable Alpine auto load.
        window.deferLoadingAlpine = function () {};

        var ui = app.$ui = new this(app);
        app.addMessage = ui.renderMessage;
        app.loadAlpine = ui.loadAlpine.bind(ui);
        app.loadSpruce = ui.loadSpruce.bind(ui);
        app.initAlpine = ui.initAlpine.bind(ui);
        app.startAlpine = ui.startAlpine.bind(ui);
        app.startAlpineSpruce = ui.startAlpineSpruce.bind(ui);
        app.initAlpineSpruce = ui.initAlpineSpruce.bind(ui);
      }
    }, {
      key: "defaultOptions",
      get: function get() {
        return {
          messageSelector: '.message-wrap'
        };
      }
    }]);

    return UnicornUI;
  }();

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = (typeof global === "undefined" ? "undefined" : _typeof(global)) == 'object' && global && global.Object === Object && global;

  /** Detect free variable `self`. */

  var freeSelf = (typeof self === "undefined" ? "undefined" : _typeof(self)) == 'object' && self && self.Object === Object && self;
  /** Used as a reference to the global object. */

  var root = freeGlobal || freeSelf || Function('return this')();

  /** Built-in value references. */

  var _Symbol = root.Symbol;

  /** Used for built-in method references. */

  var objectProto$b = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty$9 = objectProto$b.hasOwnProperty;
  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */

  var nativeObjectToString$1 = objectProto$b.toString;
  /** Built-in value references. */

  var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;
  /**
   * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the raw `toStringTag`.
   */

  function getRawTag(value) {
    var isOwn = hasOwnProperty$9.call(value, symToStringTag$1),
        tag = value[symToStringTag$1];

    try {
      value[symToStringTag$1] = undefined;
      var unmasked = true;
    } catch (e) {}

    var result = nativeObjectToString$1.call(value);

    if (unmasked) {
      if (isOwn) {
        value[symToStringTag$1] = tag;
      } else {
        delete value[symToStringTag$1];
      }
    }

    return result;
  }

  /** Used for built-in method references. */
  var objectProto$a = Object.prototype;
  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */

  var nativeObjectToString = objectProto$a.toString;
  /**
   * Converts `value` to a string using `Object.prototype.toString`.
   *
   * @private
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   */

  function objectToString(value) {
    return nativeObjectToString.call(value);
  }

  /** `Object#toString` result references. */

  var nullTag = '[object Null]',
      undefinedTag = '[object Undefined]';
  /** Built-in value references. */

  var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;
  /**
   * The base implementation of `getTag` without fallbacks for buggy environments.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */

  function baseGetTag(value) {
    if (value == null) {
      return value === undefined ? undefinedTag : nullTag;
    }

    return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
  }

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */
  function isObjectLike(value) {
    return value != null && _typeof(value) == 'object';
  }

  /**
   * Checks if `value` is classified as an `Array` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array, else `false`.
   * @example
   *
   * _.isArray([1, 2, 3]);
   * // => true
   *
   * _.isArray(document.body.children);
   * // => false
   *
   * _.isArray('abc');
   * // => false
   *
   * _.isArray(_.noop);
   * // => false
   */
  var isArray = Array.isArray;

  /**
   * Checks if `value` is the
   * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(_.noop);
   * // => true
   *
   * _.isObject(null);
   * // => false
   */
  function isObject(value) {
    var type = _typeof(value);

    return value != null && (type == 'object' || type == 'function');
  }

  /**
   * This method returns the first argument it receives.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Util
   * @param {*} value Any value.
   * @returns {*} Returns `value`.
   * @example
   *
   * var object = { 'a': 1 };
   *
   * console.log(_.identity(object) === object);
   * // => true
   */
  function identity(value) {
    return value;
  }

  /** `Object#toString` result references. */

  var asyncTag = '[object AsyncFunction]',
      funcTag$1 = '[object Function]',
      genTag = '[object GeneratorFunction]',
      proxyTag = '[object Proxy]';
  /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a function, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   *
   * _.isFunction(/abc/);
   * // => false
   */

  function isFunction(value) {
    if (!isObject(value)) {
      return false;
    } // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 9 which returns 'object' for typed arrays and other constructors.


    var tag = baseGetTag(value);
    return tag == funcTag$1 || tag == genTag || tag == asyncTag || tag == proxyTag;
  }

  /** Used to detect overreaching core-js shims. */

  var coreJsData = root['__core-js_shared__'];

  /** Used to detect methods masquerading as native. */

  var maskSrcKey = function () {
    var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
    return uid ? 'Symbol(src)_1.' + uid : '';
  }();
  /**
   * Checks if `func` has its source masked.
   *
   * @private
   * @param {Function} func The function to check.
   * @returns {boolean} Returns `true` if `func` is masked, else `false`.
   */


  function isMasked(func) {
    return !!maskSrcKey && maskSrcKey in func;
  }

  /** Used for built-in method references. */
  var funcProto$2 = Function.prototype;
  /** Used to resolve the decompiled source of functions. */

  var funcToString$2 = funcProto$2.toString;
  /**
   * Converts `func` to its source code.
   *
   * @private
   * @param {Function} func The function to convert.
   * @returns {string} Returns the source code.
   */

  function toSource(func) {
    if (func != null) {
      try {
        return funcToString$2.call(func);
      } catch (e) {}

      try {
        return func + '';
      } catch (e) {}
    }

    return '';
  }

  /**
   * Used to match `RegExp`
   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
   */

  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
  /** Used to detect host constructors (Safari). */

  var reIsHostCtor = /^\[object .+?Constructor\]$/;
  /** Used for built-in method references. */

  var funcProto$1 = Function.prototype,
      objectProto$9 = Object.prototype;
  /** Used to resolve the decompiled source of functions. */

  var funcToString$1 = funcProto$1.toString;
  /** Used to check objects for own properties. */

  var hasOwnProperty$8 = objectProto$9.hasOwnProperty;
  /** Used to detect if a method is native. */

  var reIsNative = RegExp('^' + funcToString$1.call(hasOwnProperty$8).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
  /**
   * The base implementation of `_.isNative` without bad shim checks.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a native function,
   *  else `false`.
   */

  function baseIsNative(value) {
    if (!isObject(value) || isMasked(value)) {
      return false;
    }

    var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }

  /**
   * Gets the value at `key` of `object`.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */
  function getValue(object, key) {
    return object == null ? undefined : object[key];
  }

  /**
   * Gets the native function at `key` of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {string} key The key of the method to get.
   * @returns {*} Returns the function if it's native, else `undefined`.
   */

  function getNative(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : undefined;
  }

  /** Built-in value references. */

  var objectCreate = Object.create;
  /**
   * The base implementation of `_.create` without support for assigning
   * properties to the created object.
   *
   * @private
   * @param {Object} proto The object to inherit from.
   * @returns {Object} Returns the new object.
   */

  var baseCreate = function () {
    function object() {}

    return function (proto) {
      if (!isObject(proto)) {
        return {};
      }

      if (objectCreate) {
        return objectCreate(proto);
      }

      object.prototype = proto;
      var result = new object();
      object.prototype = undefined;
      return result;
    };
  }();

  /**
   * A faster alternative to `Function#apply`, this function invokes `func`
   * with the `this` binding of `thisArg` and the arguments of `args`.
   *
   * @private
   * @param {Function} func The function to invoke.
   * @param {*} thisArg The `this` binding of `func`.
   * @param {Array} args The arguments to invoke `func` with.
   * @returns {*} Returns the result of `func`.
   */
  function apply(func, thisArg, args) {
    switch (args.length) {
      case 0:
        return func.call(thisArg);

      case 1:
        return func.call(thisArg, args[0]);

      case 2:
        return func.call(thisArg, args[0], args[1]);

      case 3:
        return func.call(thisArg, args[0], args[1], args[2]);
    }

    return func.apply(thisArg, args);
  }

  /**
   * Copies the values of `source` to `array`.
   *
   * @private
   * @param {Array} source The array to copy values from.
   * @param {Array} [array=[]] The array to copy values to.
   * @returns {Array} Returns `array`.
   */
  function copyArray(source, array) {
    var index = -1,
        length = source.length;
    array || (array = Array(length));

    while (++index < length) {
      array[index] = source[index];
    }

    return array;
  }

  /** Used to detect hot functions by number of calls within a span of milliseconds. */
  var HOT_COUNT = 800,
      HOT_SPAN = 16;
  /* Built-in method references for those with the same name as other `lodash` methods. */

  var nativeNow = Date.now;
  /**
   * Creates a function that'll short out and invoke `identity` instead
   * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
   * milliseconds.
   *
   * @private
   * @param {Function} func The function to restrict.
   * @returns {Function} Returns the new shortable function.
   */

  function shortOut(func) {
    var count = 0,
        lastCalled = 0;
    return function () {
      var stamp = nativeNow(),
          remaining = HOT_SPAN - (stamp - lastCalled);
      lastCalled = stamp;

      if (remaining > 0) {
        if (++count >= HOT_COUNT) {
          return arguments[0];
        }
      } else {
        count = 0;
      }

      return func.apply(undefined, arguments);
    };
  }

  /**
   * Creates a function that returns `value`.
   *
   * @static
   * @memberOf _
   * @since 2.4.0
   * @category Util
   * @param {*} value The value to return from the new function.
   * @returns {Function} Returns the new constant function.
   * @example
   *
   * var objects = _.times(2, _.constant({ 'a': 1 }));
   *
   * console.log(objects);
   * // => [{ 'a': 1 }, { 'a': 1 }]
   *
   * console.log(objects[0] === objects[1]);
   * // => true
   */
  function constant(value) {
    return function () {
      return value;
    };
  }

  var defineProperty = function () {
    try {
      var func = getNative(Object, 'defineProperty');
      func({}, '', {});
      return func;
    } catch (e) {}
  }();

  /**
   * The base implementation of `setToString` without support for hot loop shorting.
   *
   * @private
   * @param {Function} func The function to modify.
   * @param {Function} string The `toString` result.
   * @returns {Function} Returns `func`.
   */

  var baseSetToString = !defineProperty ? identity : function (func, string) {
    return defineProperty(func, 'toString', {
      'configurable': true,
      'enumerable': false,
      'value': constant(string),
      'writable': true
    });
  };

  /**
   * Sets the `toString` method of `func` to return `string`.
   *
   * @private
   * @param {Function} func The function to modify.
   * @param {Function} string The `toString` result.
   * @returns {Function} Returns `func`.
   */

  var setToString = shortOut(baseSetToString);

  /**
   * A specialized version of `_.forEach` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */
  function arrayEach(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }

    return array;
  }

  /** Used as references for various `Number` constants. */
  var MAX_SAFE_INTEGER$1 = 9007199254740991;
  /** Used to detect unsigned integer values. */

  var reIsUint = /^(?:0|[1-9]\d*)$/;
  /**
   * Checks if `value` is a valid array-like index.
   *
   * @private
   * @param {*} value The value to check.
   * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
   * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
   */

  function isIndex(value, length) {
    var type = _typeof(value);

    length = length == null ? MAX_SAFE_INTEGER$1 : length;
    return !!length && (type == 'number' || type != 'symbol' && reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
  }

  /**
   * The base implementation of `assignValue` and `assignMergeValue` without
   * value checks.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {string} key The key of the property to assign.
   * @param {*} value The value to assign.
   */

  function baseAssignValue(object, key, value) {
    if (key == '__proto__' && defineProperty) {
      defineProperty(object, key, {
        'configurable': true,
        'enumerable': true,
        'value': value,
        'writable': true
      });
    } else {
      object[key] = value;
    }
  }

  /**
   * Performs a
   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * comparison between two values to determine if they are equivalent.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   * @example
   *
   * var object = { 'a': 1 };
   * var other = { 'a': 1 };
   *
   * _.eq(object, object);
   * // => true
   *
   * _.eq(object, other);
   * // => false
   *
   * _.eq('a', 'a');
   * // => true
   *
   * _.eq('a', Object('a'));
   * // => false
   *
   * _.eq(NaN, NaN);
   * // => true
   */
  function eq(value, other) {
    return value === other || value !== value && other !== other;
  }

  /** Used for built-in method references. */

  var objectProto$8 = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty$7 = objectProto$8.hasOwnProperty;
  /**
   * Assigns `value` to `key` of `object` if the existing value is not equivalent
   * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * for equality comparisons.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {string} key The key of the property to assign.
   * @param {*} value The value to assign.
   */

  function assignValue(object, key, value) {
    var objValue = object[key];

    if (!(hasOwnProperty$7.call(object, key) && eq(objValue, value)) || value === undefined && !(key in object)) {
      baseAssignValue(object, key, value);
    }
  }

  /**
   * Copies properties of `source` to `object`.
   *
   * @private
   * @param {Object} source The object to copy properties from.
   * @param {Array} props The property identifiers to copy.
   * @param {Object} [object={}] The object to copy properties to.
   * @param {Function} [customizer] The function to customize copied values.
   * @returns {Object} Returns `object`.
   */

  function copyObject(source, props, object, customizer) {
    var isNew = !object;
    object || (object = {});
    var index = -1,
        length = props.length;

    while (++index < length) {
      var key = props[index];
      var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined;

      if (newValue === undefined) {
        newValue = source[key];
      }

      if (isNew) {
        baseAssignValue(object, key, newValue);
      } else {
        assignValue(object, key, newValue);
      }
    }

    return object;
  }

  /* Built-in method references for those with the same name as other `lodash` methods. */

  var nativeMax = Math.max;
  /**
   * A specialized version of `baseRest` which transforms the rest array.
   *
   * @private
   * @param {Function} func The function to apply a rest parameter to.
   * @param {number} [start=func.length-1] The start position of the rest parameter.
   * @param {Function} transform The rest array transform.
   * @returns {Function} Returns the new function.
   */

  function overRest(func, start, transform) {
    start = nativeMax(start === undefined ? func.length - 1 : start, 0);
    return function () {
      var args = arguments,
          index = -1,
          length = nativeMax(args.length - start, 0),
          array = Array(length);

      while (++index < length) {
        array[index] = args[start + index];
      }

      index = -1;
      var otherArgs = Array(start + 1);

      while (++index < start) {
        otherArgs[index] = args[index];
      }

      otherArgs[start] = transform(array);
      return apply(func, this, otherArgs);
    };
  }

  /**
   * The base implementation of `_.rest` which doesn't validate or coerce arguments.
   *
   * @private
   * @param {Function} func The function to apply a rest parameter to.
   * @param {number} [start=func.length-1] The start position of the rest parameter.
   * @returns {Function} Returns the new function.
   */

  function baseRest(func, start) {
    return setToString(overRest(func, start, identity), func + '');
  }

  /** Used as references for various `Number` constants. */
  var MAX_SAFE_INTEGER = 9007199254740991;
  /**
   * Checks if `value` is a valid array-like length.
   *
   * **Note:** This method is loosely based on
   * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
   * @example
   *
   * _.isLength(3);
   * // => true
   *
   * _.isLength(Number.MIN_VALUE);
   * // => false
   *
   * _.isLength(Infinity);
   * // => false
   *
   * _.isLength('3');
   * // => false
   */

  function isLength(value) {
    return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  }

  /**
   * Checks if `value` is array-like. A value is considered array-like if it's
   * not a function and has a `value.length` that's an integer greater than or
   * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
   * @example
   *
   * _.isArrayLike([1, 2, 3]);
   * // => true
   *
   * _.isArrayLike(document.body.children);
   * // => true
   *
   * _.isArrayLike('abc');
   * // => true
   *
   * _.isArrayLike(_.noop);
   * // => false
   */

  function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
  }

  /**
   * Checks if the given arguments are from an iteratee call.
   *
   * @private
   * @param {*} value The potential iteratee value argument.
   * @param {*} index The potential iteratee index or key argument.
   * @param {*} object The potential iteratee object argument.
   * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
   *  else `false`.
   */

  function isIterateeCall(value, index, object) {
    if (!isObject(object)) {
      return false;
    }

    var type = _typeof(index);

    if (type == 'number' ? isArrayLike(object) && isIndex(index, object.length) : type == 'string' && index in object) {
      return eq(object[index], value);
    }

    return false;
  }

  /**
   * Creates a function like `_.assign`.
   *
   * @private
   * @param {Function} assigner The function to assign values.
   * @returns {Function} Returns the new assigner function.
   */

  function createAssigner(assigner) {
    return baseRest(function (object, sources) {
      var index = -1,
          length = sources.length,
          customizer = length > 1 ? sources[length - 1] : undefined,
          guard = length > 2 ? sources[2] : undefined;
      customizer = assigner.length > 3 && typeof customizer == 'function' ? (length--, customizer) : undefined;

      if (guard && isIterateeCall(sources[0], sources[1], guard)) {
        customizer = length < 3 ? undefined : customizer;
        length = 1;
      }

      object = Object(object);

      while (++index < length) {
        var source = sources[index];

        if (source) {
          assigner(object, source, index, customizer);
        }
      }

      return object;
    });
  }

  /** Used for built-in method references. */
  var objectProto$7 = Object.prototype;
  /**
   * Checks if `value` is likely a prototype object.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
   */

  function isPrototype(value) {
    var Ctor = value && value.constructor,
        proto = typeof Ctor == 'function' && Ctor.prototype || objectProto$7;
    return value === proto;
  }

  /**
   * The base implementation of `_.times` without support for iteratee shorthands
   * or max array length checks.
   *
   * @private
   * @param {number} n The number of times to invoke `iteratee`.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the array of results.
   */
  function baseTimes(n, iteratee) {
    var index = -1,
        result = Array(n);

    while (++index < n) {
      result[index] = iteratee(index);
    }

    return result;
  }

  /** `Object#toString` result references. */

  var argsTag$1 = '[object Arguments]';
  /**
   * The base implementation of `_.isArguments`.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   */

  function baseIsArguments(value) {
    return isObjectLike(value) && baseGetTag(value) == argsTag$1;
  }

  /** Used for built-in method references. */

  var objectProto$6 = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty$6 = objectProto$6.hasOwnProperty;
  /** Built-in value references. */

  var propertyIsEnumerable = objectProto$6.propertyIsEnumerable;
  /**
   * Checks if `value` is likely an `arguments` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   *  else `false`.
   * @example
   *
   * _.isArguments(function() { return arguments; }());
   * // => true
   *
   * _.isArguments([1, 2, 3]);
   * // => false
   */

  var isArguments = baseIsArguments(function () {
    return arguments;
  }()) ? baseIsArguments : function (value) {
    return isObjectLike(value) && hasOwnProperty$6.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
  };

  /**
   * This method returns `false`.
   *
   * @static
   * @memberOf _
   * @since 4.13.0
   * @category Util
   * @returns {boolean} Returns `false`.
   * @example
   *
   * _.times(2, _.stubFalse);
   * // => [false, false]
   */
  function stubFalse() {
    return false;
  }

  /** Detect free variable `exports`. */

  var freeExports$2 = (typeof exports === "undefined" ? "undefined" : _typeof(exports)) == 'object' && exports && !exports.nodeType && exports;
  /** Detect free variable `module`. */

  var freeModule$2 = freeExports$2 && (typeof module === "undefined" ? "undefined" : _typeof(module)) == 'object' && module && !module.nodeType && module;
  /** Detect the popular CommonJS extension `module.exports`. */

  var moduleExports$2 = freeModule$2 && freeModule$2.exports === freeExports$2;
  /** Built-in value references. */

  var Buffer$1 = moduleExports$2 ? root.Buffer : undefined;
  /* Built-in method references for those with the same name as other `lodash` methods. */

  var nativeIsBuffer = Buffer$1 ? Buffer$1.isBuffer : undefined;
  /**
   * Checks if `value` is a buffer.
   *
   * @static
   * @memberOf _
   * @since 4.3.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
   * @example
   *
   * _.isBuffer(new Buffer(2));
   * // => true
   *
   * _.isBuffer(new Uint8Array(2));
   * // => false
   */

  var isBuffer = nativeIsBuffer || stubFalse;

  /** `Object#toString` result references. */

  var argsTag = '[object Arguments]',
      arrayTag = '[object Array]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      errorTag = '[object Error]',
      funcTag = '[object Function]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      objectTag$1 = '[object Object]',
      regexpTag = '[object RegExp]',
      setTag = '[object Set]',
      stringTag = '[object String]',
      weakMapTag = '[object WeakMap]';
  var arrayBufferTag = '[object ArrayBuffer]',
      dataViewTag = '[object DataView]',
      float32Tag = '[object Float32Array]',
      float64Tag = '[object Float64Array]',
      int8Tag = '[object Int8Array]',
      int16Tag = '[object Int16Array]',
      int32Tag = '[object Int32Array]',
      uint8Tag = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag = '[object Uint16Array]',
      uint32Tag = '[object Uint32Array]';
  /** Used to identify `toStringTag` values of typed arrays. */

  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag$1] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
  /**
   * The base implementation of `_.isTypedArray` without Node.js optimizations.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
   */

  function baseIsTypedArray(value) {
    return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
  }

  /**
   * The base implementation of `_.unary` without support for storing metadata.
   *
   * @private
   * @param {Function} func The function to cap arguments for.
   * @returns {Function} Returns the new capped function.
   */
  function baseUnary(func) {
    return function (value) {
      return func(value);
    };
  }

  /** Detect free variable `exports`. */

  var freeExports$1 = (typeof exports === "undefined" ? "undefined" : _typeof(exports)) == 'object' && exports && !exports.nodeType && exports;
  /** Detect free variable `module`. */

  var freeModule$1 = freeExports$1 && (typeof module === "undefined" ? "undefined" : _typeof(module)) == 'object' && module && !module.nodeType && module;
  /** Detect the popular CommonJS extension `module.exports`. */

  var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;
  /** Detect free variable `process` from Node.js. */

  var freeProcess = moduleExports$1 && freeGlobal.process;
  /** Used to access faster Node.js helpers. */

  var nodeUtil = function () {
    try {
      // Use `util.types` for Node.js 10+.
      var types = freeModule$1 && freeModule$1.require && freeModule$1.require('util').types;

      if (types) {
        return types;
      } // Legacy `process.binding('util')` for Node.js < 10.


      return freeProcess && freeProcess.binding && freeProcess.binding('util');
    } catch (e) {}
  }();

  /* Node.js helper references. */

  var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
  /**
   * Checks if `value` is classified as a typed array.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
   * @example
   *
   * _.isTypedArray(new Uint8Array);
   * // => true
   *
   * _.isTypedArray([]);
   * // => false
   */

  var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

  /** Used for built-in method references. */

  var objectProto$5 = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty$5 = objectProto$5.hasOwnProperty;
  /**
   * Creates an array of the enumerable property names of the array-like `value`.
   *
   * @private
   * @param {*} value The value to query.
   * @param {boolean} inherited Specify returning inherited property names.
   * @returns {Array} Returns the array of property names.
   */

  function arrayLikeKeys(value, inherited) {
    var isArr = isArray(value),
        isArg = !isArr && isArguments(value),
        isBuff = !isArr && !isArg && isBuffer(value),
        isType = !isArr && !isArg && !isBuff && isTypedArray(value),
        skipIndexes = isArr || isArg || isBuff || isType,
        result = skipIndexes ? baseTimes(value.length, String) : [],
        length = result.length;

    for (var key in value) {
      if ((inherited || hasOwnProperty$5.call(value, key)) && !(skipIndexes && ( // Safari 9 has enumerable `arguments.length` in strict mode.
      key == 'length' || // Node.js 0.10 has enumerable non-index properties on buffers.
      isBuff && (key == 'offset' || key == 'parent') || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset') || // Skip index properties.
      isIndex(key, length)))) {
        result.push(key);
      }
    }

    return result;
  }

  /**
   * Creates a unary function that invokes `func` with its argument transformed.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {Function} transform The argument transform.
   * @returns {Function} Returns the new function.
   */
  function overArg(func, transform) {
    return function (arg) {
      return func(transform(arg));
    };
  }

  /* Built-in method references for those with the same name as other `lodash` methods. */

  var nativeKeys = overArg(Object.keys, Object);

  /** Used for built-in method references. */

  var objectProto$4 = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty$4 = objectProto$4.hasOwnProperty;
  /**
   * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */

  function baseKeys(object) {
    if (!isPrototype(object)) {
      return nativeKeys(object);
    }

    var result = [];

    for (var key in Object(object)) {
      if (hasOwnProperty$4.call(object, key) && key != 'constructor') {
        result.push(key);
      }
    }

    return result;
  }

  /**
   * Creates an array of the own enumerable property names of `object`.
   *
   * **Note:** Non-object values are coerced to objects. See the
   * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
   * for more details.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.keys(new Foo);
   * // => ['a', 'b'] (iteration order is not guaranteed)
   *
   * _.keys('hi');
   * // => ['0', '1']
   */

  function keys(object) {
    return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
  }

  /**
   * This function is like
   * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
   * except that it includes inherited enumerable properties.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */
  function nativeKeysIn(object) {
    var result = [];

    if (object != null) {
      for (var key in Object(object)) {
        result.push(key);
      }
    }

    return result;
  }

  /** Used for built-in method references. */

  var objectProto$3 = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty$3 = objectProto$3.hasOwnProperty;
  /**
   * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */

  function baseKeysIn(object) {
    if (!isObject(object)) {
      return nativeKeysIn(object);
    }

    var isProto = isPrototype(object),
        result = [];

    for (var key in object) {
      if (!(key == 'constructor' && (isProto || !hasOwnProperty$3.call(object, key)))) {
        result.push(key);
      }
    }

    return result;
  }

  /**
   * Creates an array of the own and inherited enumerable property names of `object`.
   *
   * **Note:** Non-object values are coerced to objects.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Object
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.keysIn(new Foo);
   * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
   */

  function keysIn(object) {
    return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
  }

  /* Built-in method references that are verified to be native. */

  var nativeCreate = getNative(Object, 'create');

  /**
   * Removes all key-value entries from the hash.
   *
   * @private
   * @name clear
   * @memberOf Hash
   */

  function hashClear() {
    this.__data__ = nativeCreate ? nativeCreate(null) : {};
    this.size = 0;
  }

  /**
   * Removes `key` and its value from the hash.
   *
   * @private
   * @name delete
   * @memberOf Hash
   * @param {Object} hash The hash to modify.
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function hashDelete(key) {
    var result = this.has(key) && delete this.__data__[key];
    this.size -= result ? 1 : 0;
    return result;
  }

  /** Used to stand-in for `undefined` hash values. */

  var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';
  /** Used for built-in method references. */

  var objectProto$2 = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty$2 = objectProto$2.hasOwnProperty;
  /**
   * Gets the hash value for `key`.
   *
   * @private
   * @name get
   * @memberOf Hash
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */

  function hashGet(key) {
    var data = this.__data__;

    if (nativeCreate) {
      var result = data[key];
      return result === HASH_UNDEFINED$1 ? undefined : result;
    }

    return hasOwnProperty$2.call(data, key) ? data[key] : undefined;
  }

  /** Used for built-in method references. */

  var objectProto$1 = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty$1 = objectProto$1.hasOwnProperty;
  /**
   * Checks if a hash value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Hash
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */

  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate ? data[key] !== undefined : hasOwnProperty$1.call(data, key);
  }

  /** Used to stand-in for `undefined` hash values. */

  var HASH_UNDEFINED = '__lodash_hash_undefined__';
  /**
   * Sets the hash `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Hash
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the hash instance.
   */

  function hashSet(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED : value;
    return this;
  }

  /**
   * Creates a hash object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */

  function Hash(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;
    this.clear();

    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  } // Add methods to `Hash`.


  Hash.prototype.clear = hashClear;
  Hash.prototype['delete'] = hashDelete;
  Hash.prototype.get = hashGet;
  Hash.prototype.has = hashHas;
  Hash.prototype.set = hashSet;

  /**
   * Removes all key-value entries from the list cache.
   *
   * @private
   * @name clear
   * @memberOf ListCache
   */
  function listCacheClear() {
    this.__data__ = [];
    this.size = 0;
  }

  /**
   * Gets the index at which the `key` is found in `array` of key-value pairs.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} key The key to search for.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */

  function assocIndexOf(array, key) {
    var length = array.length;

    while (length--) {
      if (eq(array[length][0], key)) {
        return length;
      }
    }

    return -1;
  }

  /** Used for built-in method references. */

  var arrayProto = Array.prototype;
  /** Built-in value references. */

  var splice = arrayProto.splice;
  /**
   * Removes `key` and its value from the list cache.
   *
   * @private
   * @name delete
   * @memberOf ListCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */

  function listCacheDelete(key) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    if (index < 0) {
      return false;
    }

    var lastIndex = data.length - 1;

    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }

    --this.size;
    return true;
  }

  /**
   * Gets the list cache value for `key`.
   *
   * @private
   * @name get
   * @memberOf ListCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */

  function listCacheGet(key) {
    var data = this.__data__,
        index = assocIndexOf(data, key);
    return index < 0 ? undefined : data[index][1];
  }

  /**
   * Checks if a list cache value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf ListCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */

  function listCacheHas(key) {
    return assocIndexOf(this.__data__, key) > -1;
  }

  /**
   * Sets the list cache `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf ListCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the list cache instance.
   */

  function listCacheSet(key, value) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    if (index < 0) {
      ++this.size;
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }

    return this;
  }

  /**
   * Creates an list cache object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */

  function ListCache(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;
    this.clear();

    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  } // Add methods to `ListCache`.


  ListCache.prototype.clear = listCacheClear;
  ListCache.prototype['delete'] = listCacheDelete;
  ListCache.prototype.get = listCacheGet;
  ListCache.prototype.has = listCacheHas;
  ListCache.prototype.set = listCacheSet;

  /* Built-in method references that are verified to be native. */

  var Map$1 = getNative(root, 'Map');

  /**
   * Removes all key-value entries from the map.
   *
   * @private
   * @name clear
   * @memberOf MapCache
   */

  function mapCacheClear() {
    this.size = 0;
    this.__data__ = {
      'hash': new Hash(),
      'map': new (Map$1 || ListCache)(),
      'string': new Hash()
    };
  }

  /**
   * Checks if `value` is suitable for use as unique object key.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
   */
  function isKeyable(value) {
    var type = _typeof(value);

    return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean' ? value !== '__proto__' : value === null;
  }

  /**
   * Gets the data for `map`.
   *
   * @private
   * @param {Object} map The map to query.
   * @param {string} key The reference key.
   * @returns {*} Returns the map data.
   */

  function getMapData(map, key) {
    var data = map.__data__;
    return isKeyable(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
  }

  /**
   * Removes `key` and its value from the map.
   *
   * @private
   * @name delete
   * @memberOf MapCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */

  function mapCacheDelete(key) {
    var result = getMapData(this, key)['delete'](key);
    this.size -= result ? 1 : 0;
    return result;
  }

  /**
   * Gets the map value for `key`.
   *
   * @private
   * @name get
   * @memberOf MapCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */

  function mapCacheGet(key) {
    return getMapData(this, key).get(key);
  }

  /**
   * Checks if a map value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf MapCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */

  function mapCacheHas(key) {
    return getMapData(this, key).has(key);
  }

  /**
   * Sets the map `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf MapCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the map cache instance.
   */

  function mapCacheSet(key, value) {
    var data = getMapData(this, key),
        size = data.size;
    data.set(key, value);
    this.size += data.size == size ? 0 : 1;
    return this;
  }

  /**
   * Creates a map cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */

  function MapCache(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;
    this.clear();

    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  } // Add methods to `MapCache`.


  MapCache.prototype.clear = mapCacheClear;
  MapCache.prototype['delete'] = mapCacheDelete;
  MapCache.prototype.get = mapCacheGet;
  MapCache.prototype.has = mapCacheHas;
  MapCache.prototype.set = mapCacheSet;

  /** Built-in value references. */

  var getPrototype = overArg(Object.getPrototypeOf, Object);

  /** `Object#toString` result references. */

  var objectTag = '[object Object]';
  /** Used for built-in method references. */

  var funcProto = Function.prototype,
      objectProto = Object.prototype;
  /** Used to resolve the decompiled source of functions. */

  var funcToString = funcProto.toString;
  /** Used to check objects for own properties. */

  var hasOwnProperty = objectProto.hasOwnProperty;
  /** Used to infer the `Object` constructor. */

  var objectCtorString = funcToString.call(Object);
  /**
   * Checks if `value` is a plain object, that is, an object created by the
   * `Object` constructor or one with a `[[Prototype]]` of `null`.
   *
   * @static
   * @memberOf _
   * @since 0.8.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   * }
   *
   * _.isPlainObject(new Foo);
   * // => false
   *
   * _.isPlainObject([1, 2, 3]);
   * // => false
   *
   * _.isPlainObject({ 'x': 0, 'y': 0 });
   * // => true
   *
   * _.isPlainObject(Object.create(null));
   * // => true
   */

  function isPlainObject(value) {
    if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
      return false;
    }

    var proto = getPrototype(value);

    if (proto === null) {
      return true;
    }

    var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
    return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
  }

  /**
   * Removes all key-value entries from the stack.
   *
   * @private
   * @name clear
   * @memberOf Stack
   */

  function stackClear() {
    this.__data__ = new ListCache();
    this.size = 0;
  }

  /**
   * Removes `key` and its value from the stack.
   *
   * @private
   * @name delete
   * @memberOf Stack
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function stackDelete(key) {
    var data = this.__data__,
        result = data['delete'](key);
    this.size = data.size;
    return result;
  }

  /**
   * Gets the stack value for `key`.
   *
   * @private
   * @name get
   * @memberOf Stack
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function stackGet(key) {
    return this.__data__.get(key);
  }

  /**
   * Checks if a stack value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Stack
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function stackHas(key) {
    return this.__data__.has(key);
  }

  /** Used as the size to enable large array optimizations. */

  var LARGE_ARRAY_SIZE = 200;
  /**
   * Sets the stack `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Stack
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the stack cache instance.
   */

  function stackSet(key, value) {
    var data = this.__data__;

    if (data instanceof ListCache) {
      var pairs = data.__data__;

      if (!Map$1 || pairs.length < LARGE_ARRAY_SIZE - 1) {
        pairs.push([key, value]);
        this.size = ++data.size;
        return this;
      }

      data = this.__data__ = new MapCache(pairs);
    }

    data.set(key, value);
    this.size = data.size;
    return this;
  }

  /**
   * Creates a stack cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */

  function Stack(entries) {
    var data = this.__data__ = new ListCache(entries);
    this.size = data.size;
  } // Add methods to `Stack`.


  Stack.prototype.clear = stackClear;
  Stack.prototype['delete'] = stackDelete;
  Stack.prototype.get = stackGet;
  Stack.prototype.has = stackHas;
  Stack.prototype.set = stackSet;

  /** Detect free variable `exports`. */

  var freeExports = (typeof exports === "undefined" ? "undefined" : _typeof(exports)) == 'object' && exports && !exports.nodeType && exports;
  /** Detect free variable `module`. */

  var freeModule = freeExports && (typeof module === "undefined" ? "undefined" : _typeof(module)) == 'object' && module && !module.nodeType && module;
  /** Detect the popular CommonJS extension `module.exports`. */

  var moduleExports = freeModule && freeModule.exports === freeExports;
  /** Built-in value references. */

  var Buffer = moduleExports ? root.Buffer : undefined,
      allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;
  /**
   * Creates a clone of  `buffer`.
   *
   * @private
   * @param {Buffer} buffer The buffer to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Buffer} Returns the cloned buffer.
   */

  function cloneBuffer(buffer, isDeep) {
    if (isDeep) {
      return buffer.slice();
    }

    var length = buffer.length,
        result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
    buffer.copy(result);
    return result;
  }

  /** Built-in value references. */

  var Uint8Array = root.Uint8Array;

  /**
   * Creates a clone of `arrayBuffer`.
   *
   * @private
   * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
   * @returns {ArrayBuffer} Returns the cloned array buffer.
   */

  function cloneArrayBuffer(arrayBuffer) {
    var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
    new Uint8Array(result).set(new Uint8Array(arrayBuffer));
    return result;
  }

  /**
   * Creates a clone of `typedArray`.
   *
   * @private
   * @param {Object} typedArray The typed array to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Object} Returns the cloned typed array.
   */

  function cloneTypedArray(typedArray, isDeep) {
    var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
    return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
  }

  /**
   * Initializes an object clone.
   *
   * @private
   * @param {Object} object The object to clone.
   * @returns {Object} Returns the initialized clone.
   */

  function initCloneObject(object) {
    return typeof object.constructor == 'function' && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
  }

  /**
   * Creates a base function for methods like `_.forIn` and `_.forOwn`.
   *
   * @private
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {Function} Returns the new base function.
   */
  function createBaseFor(fromRight) {
    return function (object, iteratee, keysFunc) {
      var index = -1,
          iterable = Object(object),
          props = keysFunc(object),
          length = props.length;

      while (length--) {
        var key = props[fromRight ? length : ++index];

        if (iteratee(iterable[key], key, iterable) === false) {
          break;
        }
      }

      return object;
    };
  }

  /**
   * The base implementation of `baseForOwn` which iterates over `object`
   * properties returned by `keysFunc` and invokes `iteratee` for each property.
   * Iteratee functions may exit iteration early by explicitly returning `false`.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {Function} keysFunc The function to get the keys of `object`.
   * @returns {Object} Returns `object`.
   */

  var baseFor = createBaseFor();

  /**
   * The base implementation of `_.forOwn` without support for iteratee shorthands.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Object} Returns `object`.
   */

  function baseForOwn(object, iteratee) {
    return object && baseFor(object, iteratee, keys);
  }

  /**
   * Creates a `baseEach` or `baseEachRight` function.
   *
   * @private
   * @param {Function} eachFunc The function to iterate over a collection.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {Function} Returns the new base function.
   */

  function createBaseEach(eachFunc, fromRight) {
    return function (collection, iteratee) {
      if (collection == null) {
        return collection;
      }

      if (!isArrayLike(collection)) {
        return eachFunc(collection, iteratee);
      }

      var length = collection.length,
          index = fromRight ? length : -1,
          iterable = Object(collection);

      while (fromRight ? index-- : ++index < length) {
        if (iteratee(iterable[index], index, iterable) === false) {
          break;
        }
      }

      return collection;
    };
  }

  /**
   * The base implementation of `_.forEach` without support for iteratee shorthands.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array|Object} Returns `collection`.
   */

  var baseEach = createBaseEach(baseForOwn);

  /**
   * This function is like `assignValue` except that it doesn't assign
   * `undefined` values.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {string} key The key of the property to assign.
   * @param {*} value The value to assign.
   */

  function assignMergeValue(object, key, value) {
    if (value !== undefined && !eq(object[key], value) || value === undefined && !(key in object)) {
      baseAssignValue(object, key, value);
    }
  }

  /**
   * This method is like `_.isArrayLike` except that it also checks if `value`
   * is an object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array-like object,
   *  else `false`.
   * @example
   *
   * _.isArrayLikeObject([1, 2, 3]);
   * // => true
   *
   * _.isArrayLikeObject(document.body.children);
   * // => true
   *
   * _.isArrayLikeObject('abc');
   * // => false
   *
   * _.isArrayLikeObject(_.noop);
   * // => false
   */

  function isArrayLikeObject(value) {
    return isObjectLike(value) && isArrayLike(value);
  }

  /**
   * Gets the value at `key`, unless `key` is "__proto__" or "constructor".
   *
   * @private
   * @param {Object} object The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */
  function safeGet(object, key) {
    if (key === 'constructor' && typeof object[key] === 'function') {
      return;
    }

    if (key == '__proto__') {
      return;
    }

    return object[key];
  }

  /**
   * Converts `value` to a plain object flattening inherited enumerable string
   * keyed properties of `value` to own properties of the plain object.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {Object} Returns the converted plain object.
   * @example
   *
   * function Foo() {
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.assign({ 'a': 1 }, new Foo);
   * // => { 'a': 1, 'b': 2 }
   *
   * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
   * // => { 'a': 1, 'b': 2, 'c': 3 }
   */

  function toPlainObject(value) {
    return copyObject(value, keysIn(value));
  }

  /**
   * A specialized version of `baseMerge` for arrays and objects which performs
   * deep merges and tracks traversed objects enabling objects with circular
   * references to be merged.
   *
   * @private
   * @param {Object} object The destination object.
   * @param {Object} source The source object.
   * @param {string} key The key of the value to merge.
   * @param {number} srcIndex The index of `source`.
   * @param {Function} mergeFunc The function to merge values.
   * @param {Function} [customizer] The function to customize assigned values.
   * @param {Object} [stack] Tracks traversed source values and their merged
   *  counterparts.
   */

  function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
    var objValue = safeGet(object, key),
        srcValue = safeGet(source, key),
        stacked = stack.get(srcValue);

    if (stacked) {
      assignMergeValue(object, key, stacked);
      return;
    }

    var newValue = customizer ? customizer(objValue, srcValue, key + '', object, source, stack) : undefined;
    var isCommon = newValue === undefined;

    if (isCommon) {
      var isArr = isArray(srcValue),
          isBuff = !isArr && isBuffer(srcValue),
          isTyped = !isArr && !isBuff && isTypedArray(srcValue);
      newValue = srcValue;

      if (isArr || isBuff || isTyped) {
        if (isArray(objValue)) {
          newValue = objValue;
        } else if (isArrayLikeObject(objValue)) {
          newValue = copyArray(objValue);
        } else if (isBuff) {
          isCommon = false;
          newValue = cloneBuffer(srcValue, true);
        } else if (isTyped) {
          isCommon = false;
          newValue = cloneTypedArray(srcValue, true);
        } else {
          newValue = [];
        }
      } else if (isPlainObject(srcValue) || isArguments(srcValue)) {
        newValue = objValue;

        if (isArguments(objValue)) {
          newValue = toPlainObject(objValue);
        } else if (!isObject(objValue) || isFunction(objValue)) {
          newValue = initCloneObject(srcValue);
        }
      } else {
        isCommon = false;
      }
    }

    if (isCommon) {
      // Recursively merge objects and arrays (susceptible to call stack limits).
      stack.set(srcValue, newValue);
      mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
      stack['delete'](srcValue);
    }

    assignMergeValue(object, key, newValue);
  }

  /**
   * The base implementation of `_.merge` without support for multiple sources.
   *
   * @private
   * @param {Object} object The destination object.
   * @param {Object} source The source object.
   * @param {number} srcIndex The index of `source`.
   * @param {Function} [customizer] The function to customize merged values.
   * @param {Object} [stack] Tracks traversed source values and their merged
   *  counterparts.
   */

  function baseMerge(object, source, srcIndex, customizer, stack) {
    if (object === source) {
      return;
    }

    baseFor(source, function (srcValue, key) {
      stack || (stack = new Stack());

      if (isObject(srcValue)) {
        baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
      } else {
        var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + '', object, source, stack) : undefined;

        if (newValue === undefined) {
          newValue = srcValue;
        }

        assignMergeValue(object, key, newValue);
      }
    }, keysIn);
  }

  /**
   * Casts `value` to `identity` if it's not a function.
   *
   * @private
   * @param {*} value The value to inspect.
   * @returns {Function} Returns cast function.
   */

  function castFunction(value) {
    return typeof value == 'function' ? value : identity;
  }

  /**
   * Iterates over elements of `collection` and invokes `iteratee` for each element.
   * The iteratee is invoked with three arguments: (value, index|key, collection).
   * Iteratee functions may exit iteration early by explicitly returning `false`.
   *
   * **Note:** As with other "Collections" methods, objects with a "length"
   * property are iterated like arrays. To avoid this behavior use `_.forIn`
   * or `_.forOwn` for object iteration.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @alias each
   * @category Collection
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} [iteratee=_.identity] The function invoked per iteration.
   * @returns {Array|Object} Returns `collection`.
   * @see _.forEachRight
   * @example
   *
   * _.forEach([1, 2], function(value) {
   *   console.log(value);
   * });
   * // => Logs `1` then `2`.
   *
   * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
   *   console.log(key);
   * });
   * // => Logs 'a' then 'b' (iteration order is not guaranteed).
   */

  function forEach(collection, iteratee) {
    var func = isArray(collection) ? arrayEach : baseEach;
    return func(collection, castFunction(iteratee));
  }

  /**
   * This method is like `_.assign` except that it recursively merges own and
   * inherited enumerable string keyed properties of source objects into the
   * destination object. Source properties that resolve to `undefined` are
   * skipped if a destination value exists. Array and plain object properties
   * are merged recursively. Other objects and value types are overridden by
   * assignment. Source objects are applied from left to right. Subsequent
   * sources overwrite property assignments of previous sources.
   *
   * **Note:** This method mutates `object`.
   *
   * @static
   * @memberOf _
   * @since 0.5.0
   * @category Object
   * @param {Object} object The destination object.
   * @param {...Object} [sources] The source objects.
   * @returns {Object} Returns `object`.
   * @example
   *
   * var object = {
   *   'a': [{ 'b': 2 }, { 'd': 4 }]
   * };
   *
   * var other = {
   *   'a': [{ 'c': 3 }, { 'e': 5 }]
   * };
   *
   * _.merge(object, other);
   * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
   */

  var merge = createAssigner(function (object, source, srcIndex) {
    baseMerge(object, source, srcIndex);
  });

  /**
   * Part of starter project.
   *
   * @copyright  Copyright (C) 2021 __ORGANIZATION__.
   * @license    __LICENSE__
   */
  function defData(element, name, defCallback) {
    prepareData(element);
    element.__unicorn[name] = element.__unicorn[name] || defCallback();
    return element.__unicorn[name];
  }
  function prepareData(element) {
    if (!element) {
      return element;
    }

    element.__unicorn = element.__unicorn || {};
    return element;
  }

  /**
   * UnicornGrid
   */

  var UnicornGrid = /*#__PURE__*/function () {
    function UnicornGrid() {
      _classCallCheck(this, UnicornGrid);
    }

    _createClass(UnicornGrid, null, [{
      key: "is",
      get: function get() {
        return 'grid';
      }
    }, {
      key: "install",
      value: function install(app) {

        app.grid = function (ele) {
          var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          var selector = typeof ele === 'string' ? ele : null;
          ele = app.selectOne(ele);
          return defData(ele, 'grid.plugin', function () {
            return new UnicornGridElement(selector, ele, options, app);
          });
        };
      }
    }]);

    return UnicornGrid;
  }();

  var UnicornGridElement = /*#__PURE__*/function () {
    function UnicornGridElement(selector, element, options, app) {
      _classCallCheck(this, UnicornGridElement);

      _defineProperty(this, "ordering", '');

      this.element = element;
      this.options = Object.assign({}, this.constructor.defaultOptions, options);
      this.app = app;
      this.form = app.form(selector || element);

      if (!this.form) {
        throw new Error('UnicornGrid is dependent on UnicornForm');
      }

      this.registerEvents();
    }
    /**
     * Start this object and events.
     */


    _createClass(UnicornGridElement, [{
      key: "registerEvents",
      value: function registerEvents() {// this.searchClearButton.click(() => {
        //   this.searchContainer.find('input, textarea, select').val('');
        //   this.filterContainer.find('input, textarea, select').val('');
        //
        //   this.form.submit();
        // });
        //
        // this.filterButton.click(event => {
        //   this.toggleFilter();
        //   event.stopPropagation();
        //   event.preventDefault();
        // });
        //
        // this.sortButtons.click(event => {
        //   self.sort(event.currentTarget, event);
        // });
      } // registerCustomElements() {
      //   return app.import('@unicorn/ui/grid-components.js');
      // }

    }, {
      key: "initComponent",
      value: function initComponent() {
        var _this = this;

        var store = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'grid';
        var custom = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        this.ordering = this.element.dataset.ordering;

        if (!this.ordering.toLowerCase().endsWith(' asc') && !this.ordering.toLowerCase().endsWith(' desc')) {
          this.ordering += ' ASC';
        }

        return this.app.loadSpruce().then(function () {
          Spruce.store(store, _this.useState(custom)); // this.registerCustomElements();

          _this.app.startAlpine();
        });
      }
    }, {
      key: "useState",
      value: function useState() {
        var custom = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        return merge(this, custom);
      }
    }, {
      key: "sendFilter",
      value: function sendFilter($event) {
        if ($event) {
          $event.preventDefault();
        }

        this.form.put();
      }
    }, {
      key: "clearFilters",
      value: function clearFilters(element) {
        element.querySelectorAll('input, textarea, select').forEach(function (ele) {
          ele.value = '';
        });
        this.form.put();
      }
    }, {
      key: "sort",
      value: function sort($el) {
        var dir = this.getDirection($el);
        var field = $el.dataset.field;
        var asc = $el.dataset.asc;
        var desc = $el.dataset.desc;

        if (field) {
          asc = field + ' ASC';
          desc = field + ' DESC';
        }

        if (dir === 'ASC') {
          return this.sortBy(desc);
        }

        return this.sortBy(asc);
      }
      /**
       * Sort two items.
       *
       * @param {string} ordering
       *
       * @returns {boolean}
       */

    }, {
      key: "sortBy",
      value: function sortBy(ordering) {
        var orderingInput = this.element.querySelector('input[name=list_ordering]');

        if (!orderingInput) {
          orderingInput = this.app.h('input', {
            name: 'list_ordering',
            type: 'hidden',
            value: ''
          });
          this.element.appendChild(orderingInput);
        }

        orderingInput.value = ordering;
        return this.form.put();
      }
    }, {
      key: "isSortActive",
      value: function isSortActive($el) {
        return this.getDirection($el) != null;
      }
    }, {
      key: "getDirection",
      value: function getDirection($el) {
        var field = $el.dataset.field;
        var asc = $el.dataset.asc;
        var desc = $el.dataset.desc;

        if (field) {
          asc = field + ' ASC';
          desc = field + ' DESC';
        }

        if (this.orderingEquals(asc, this.ordering)) {
          return 'ASC';
        } else if (this.orderingEquals(desc, this.ordering)) {
          return 'DESC';
        }

        return null;
      }
    }, {
      key: "orderingEquals",
      value: function orderingEquals(a, b) {
        a = a.replace(/\s+/g, ' ').trim().toLowerCase();
        b = b.replace(/\s+/g, ' ').trim().toLowerCase();
        return a === b;
      }
      /**
       * Check a row's checkbox.
       *
       * @param {number}  row
       * @param {boolean} value
       */

    }, {
      key: "checkRow",
      value: function checkRow(row) {
        var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        var ch = this.form.find('input.grid-checkbox[data-row-number=' + row + ']');

        if (!ch.length) {
          throw new Error('Checkbox of row: ' + row + ' not found.');
        }

        ch[0].checked = value;
      }
      /**
       * Update a row.
       *
       * @param  {number} row
       * @param  {string} url
       * @param  {Object} queries
       *
       * @returns {boolean}
       */

    }, {
      key: "updateRow",
      value: function updateRow(row, url, queries) {
        this.toggleAll(false);
        this.checkRow(row);
        return this.core.patch(url, queries);
      }
      /**
       * Update a row with batch task.
       *
       * @param  {string} task
       * @param  {number} row
       * @param  {string} url
       * @param  {Object} queries
       *
       * @returns {boolean}
       */

    }, {
      key: "doTask",
      value: function doTask(task, row, url, queries) {
        queries = queries || {};
        queries.task = task;
        return this.updateRow(row, url, queries);
      }
      /**
       * Batch update items.
       *
       * @param  {string} task
       * @param  {string} url
       * @param  {Object} queries
       *
       * @returns {boolean}
       */

    }, {
      key: "batch",
      value: function batch(task, url, queries) {
        queries = queries || {};
        queries.task = task;
        return this.core.patch(url, queries);
      }
      /**
       * Copy a row.
       *
       * @param  {number} row
       * @param  {string} url
       * @param  {Object} queries
       *
       * @returns {boolean}
       */

    }, {
      key: "copyRow",
      value: function copyRow(row, url, queries) {
        this.toggleAll(false);
        this.checkRow(row);
        return this.core.post(url, queries);
      }
      /**
       * Delete checked items.
       *
       * @param  {string} message
       * @param  {string} url
       * @param  {Object} queries
       *
       * @returns {boolean}
       */

    }, {
      key: "deleteList",
      value: function deleteList(message, url, queries) {
        var _this2 = this;

        message = message == null ? this.app.__('unicorn.message.delete.confirm') : message;

        if (message !== false) {
          this.app.confirm(message, function (isConfirm) {
            if (isConfirm) {
              _this2.core['delete'](url, queries);
            }
          });
        } else {
          this.core['delete'](url, queries);
        }

        return true;
      }
      /**
       * Delete an itme.
       *
       * @param  {number} row
       * @param  {string} msg
       * @param  {string} url
       * @param  {Object} queries
       *
       * @returns {boolean}
       */

    }, {
      key: "deleteRow",
      value: function deleteRow(row, msg, url, queries) {
        var _this3 = this;

        msg = msg || this.app.__('unicorn.message.delete.confirm');
        this.app.confirm(msg, function (isConfirm) {
          if (isConfirm) {
            _this3.toggleAll(false);

            _this3.checkRow(row);

            _this3.deleteList(false, url, queries);
          }
        });
        return true;
      }
      /**
       * Toggle all checkboxes.
       *
       * @param  {boolean}          value     Checked or unchecked.
       */

    }, {
      key: "toggleAll",
      value: function toggleAll(value) {
        this.app.selectAll(this.element.querySelectorAll('input[data-role=grid-checkbox][type=checkbox]')).map(function (input) {
          input.checked = value;
        });
        return this;
      }
      /**
       * Count checked checkboxes.
       *
       * @returns {int}
       */

    }, {
      key: "countChecked",
      value: function countChecked() {
        return this.getChecked().length;
      }
      /**
       * Get Checked boxes.
       *
       * @returns {Element[]}
       */

    }, {
      key: "getChecked",
      value: function getChecked() {
        return this.app.selectAll(this.element.querySelectorAll('input[data-role=grid-checkbox][type=checkbox]'));
      }
      /**
       * Validate there has one or more checked boxes.
       *
       * @param   {string}  msg
       * @param   {Event}   event
       *
       * @returns {UnicornGridElement}
       */

    }, {
      key: "hasChecked",
      value: function hasChecked(msg, event) {
        msg = msg || Unicorn.Translator.translate('unicorn.message.grid.checked');

        if (!this.countChecked()) {
          alert(msg); // If you send event object as second argument, we will stop all actions.

          if (event) {
            event.stopPropagation();
            event.preventDefault();
          }

          throw new Error(msg);
        }

        return this;
      }
      /**
       * Reorder all.
       *
       * @param   {string}  url
       * @param   {Object}  queries
       *
       * @returns {boolean}
       */

    }, {
      key: "reorderAll",
      value: function reorderAll(url, queries) {
        var self = this;
        var origin = this.form.find('input[name=origin_ordering]'); // If origin exists, we diff them and only send changed group.

        if (origin.length) {
          var originOrdering = origin.val().split(',');
          var inputs = this.form.find('.ordering-control input');
          this.toggleAll();
          inputs.each(function (i) {
            var $this = $(this);

            if ($this.val() !== originOrdering[i]) {
              // Check self
              self.checkRow($this.attr('data-order-row'));
              var tr = $this.parents('tr');
              var group = tr.attr('data-order-group'); // Check same group boxes

              if (group !== '') {
                tr.siblings('[data-order-group=' + group + ']').find('input.grid-checkbox').prop('checked', true);
              }
            }
          });
        }

        return this.batch('reorder', url, queries);
      }
      /**
       * Reorder items.
       *
       * @param  {int}     row
       * @param  {int}     delta
       * @param  {string}  url
       * @param  {Object}  queries
       *
       * @returns {boolean}
       */

    }, {
      key: "reorder",
      value: function reorder(row, delta, url, queries) {
        queries = queries || {};
        queries.delta = delta;
        return this.doTask('reorder', row, url, queries);
      }
    }], [{
      key: "defaultOptions",
      get: function get() {
        return {//
        };
      }
    }]);

    return UnicornGridElement;
  }();

  var UnicornForm = /*#__PURE__*/function () {
    function UnicornForm() {
      _classCallCheck(this, UnicornForm);
    }

    _createClass(UnicornForm, null, [{
      key: "is",
      get: function get() {
        return 'form';
      }
    }, {
      key: "install",
      value: function install(app) {

        app.form = function (ele) {
          var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          var selector = typeof ele === 'string' ? ele : null;
          ele = app.selectOne(ele);
          return defData(ele, 'form.plugin', function () {
            return new UnicornFormElement(selector, ele, options, app);
          });
        };
      }
    }]);

    return UnicornForm;
  }();

  var UnicornFormElement = /*#__PURE__*/function () {
    /**
     * Constructor.
     * @param {string}      selector
     * @param {HTMLElement} $form
     * @param {Object}      options
     * @param {UnicornApp}  app
     */
    function UnicornFormElement(selector, $form, options, app) {
      _classCallCheck(this, UnicornFormElement);

      this.app = app; // If form not found, create one

      if (!$form) {
        $form = document.createElement('form');

        if (selector.indexOf('#') === 0) {
          $form.setAttribute('id', selector.substr(1));
          $form.setAttribute('name', selector.substr(1));
        }

        $form.setAttribute('method', 'post');
        $form.setAttribute('enctype', 'multipart/form-data');
        $form.setAttribute('novalidate', 'true');
        $form.setAttribute('action', app.data('unicorn.uri')['full']);
        $form.setAttribute('display', 'none');
        var csrf = document.createElement('input');
        csrf.setAttribute('name', app.data('csrf-token'));
        $form.appendChild(csrf);
        document.body.appendChild($form);
      }

      options = Object.assign({}, this.constructor.defaultOptions, options);
      this.element = $form;
      this.options = options;
      this.bindEvents();
    }

    _createClass(UnicornFormElement, [{
      key: "bindEvents",
      value: function bindEvents() {// if (this.form.attr('data-toolbar')) {
        //   $(this.form.attr('data-toolbar')).find('*[data-action]').on('click', (e) => {
        //     this.form.trigger('unicorn.submit', e.currentTarget);
        //   });
        // }
        // this.form.on('unicorn.submit', (e, button) => {
        //   const $button = $(button);
        //   const action = $button.attr('data-action');
        //   const target = $button.attr('data-target') || null;
        //   const query = $button.data('query') || {};
        //   query['task'] = $button.attr('data-task') || null;
        //
        //   this[action](target, query);
        // });
      }
    }, {
      key: "initComponent",
      value: function initComponent() {
        var _this = this;

        var store = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'form';
        var custom = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        return this.app.loadSpruce().then(function () {
          Spruce.store(store, _this.useState(custom)); // this.registerCustomElements();

          _this.app.startAlpine();
        });
      }
    }, {
      key: "useState",
      value: function useState() {
        var custom = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        return merge(this, custom);
      }
      /**
       * Make a request.
       *
       * @param  {string} url
       * @param  {Object} queries
       * @param  {string} method
       * @param  {string} customMethod
       *
       * @returns {boolean}
       */

    }, {
      key: "submit",
      value: function submit(url, queries, method, customMethod) {
        var _this2 = this;

        var form = this.element;

        if (customMethod) {
          var methodInput = form.querySelector('input[name="_method"]');

          if (!methodInput) {
            methodInput = document.createElement('input');
            methodInput.setAttribute('name', '_method');
            methodInput.setAttribute('type', 'hidden');
            form.appendChild(methodInput);
          }

          methodInput.value = customMethod;
        } // Set queries into form.


        if (queries) {
          var input;
          var flatted = this.constructor.flattenObject(queries);
          forEach(flatted, function (value, key) {
            var fieldName = _this2.constructor.buildFieldName(key);

            input = form.querySelector("input[name=\"".concat(fieldName, "\"]"));

            if (!input) {
              input = document.createElement('input');
              input.setAttribute('name', fieldName);
              input.setAttribute('type', 'hidden');
              form.appendChild(input);
            }

            input.value = value;
          });
        }

        if (url) {
          form.setAttribute('action', url);
        }

        if (method) {
          form.setAttribute('method', method);
        } // Create a submit button that can fire `submit` event


        var submitButton = form.querySelector("button[type=submit][data-submit]");

        if (!submitButton) {
          submitButton = this.app.h('button', {
            type: 'submit'
          }, 'GO');
          submitButton.dataset.submit = true;
          submitButton.style.display = 'none';
          form.appendChild(submitButton);
        }

        submitButton.click();
        return true;
      }
      /**
       * Make a GET request.
       *
       * @param  {string} url
       * @param  {Object} queries
       * @param  {string} customMethod
       *
       * @returns {boolean}
       */

    }, {
      key: "get",
      value: function get(url, queries, customMethod) {
        return this.submit(url, queries, 'GET', customMethod);
      }
      /**
       * Post form.
       *
       * @param  {string} url
       * @param  {Object} queries
       * @param  {string} customMethod
       *
       * @returns {boolean}
       */

    }, {
      key: "post",
      value: function post(url, queries, customMethod) {
        customMethod = customMethod || 'POST';
        return this.submit(url, queries, 'POST', customMethod);
      }
      /**
       * Make a PUT request.
       *
       * @param  {string} url
       * @param  {Object} queries
       *
       * @returns {boolean}
       */

    }, {
      key: "put",
      value: function put(url, queries) {
        return this.post(url, queries, 'PUT');
      }
      /**
       * Make a PATCH request.
       *
       * @param  {string} url
       * @param  {Object} queries
       *
       * @returns {boolean}
       */

    }, {
      key: "patch",
      value: function patch(url, queries) {
        return this.post(url, queries, 'PATCH');
      }
      /**
       * Make a DELETE request.
       *
       * @param  {string} url
       * @param  {Object} queries
       *
       * @returns {boolean}
       */

    }, {
      key: "delete",
      value: function _delete(url, queries) {
        return this.post(url, queries, 'DELETE');
      }
      /**
       * @see https://stackoverflow.com/a/53739792
       *
       * @param {Object} ob
       * @returns {Object}
       */

    }], [{
      key: "flattenObject",
      value: function flattenObject(ob) {
        var toReturn = {};

        for (var i in ob) {
          if (!ob.hasOwnProperty(i)) {
            continue;
          }

          if (_typeof(ob[i]) === 'object' && ob[i] != null) {
            var flatObject = this.flattenObject(ob[i]);

            for (var x in flatObject) {
              if (!flatObject.hasOwnProperty(x)) {
                continue;
              }

              toReturn[i + '/' + x] = flatObject[x];
            }
          } else {
            toReturn[i] = ob[i];
          }
        }

        return toReturn;
      }
    }, {
      key: "buildFieldName",
      value: function buildFieldName(field) {
        var names = field.split('/');
        var first = names.shift();
        return first + names.map(function (name) {
          return "[".concat(name, "]");
        }).join('');
      }
    }]);

    return UnicornFormElement;
  }();

  /**
   * Part of starter project.
   *
   * @copyright  Copyright (C) 2021 __ORGANIZATION__.
   * @license    __LICENSE__
   */
  var UnicornLoader = /*#__PURE__*/function () {
    function UnicornLoader() {
      _classCallCheck(this, UnicornLoader);
    }

    _createClass(UnicornLoader, null, [{
      key: "install",
      value: function install(app) {
        app["import"] = this["import"];
      }
    }, {
      key: "import",
      value: function _import(src) {
        var s = window.System;
        return s["import"](src);
      }
    }]);

    return UnicornLoader;
  }();

  /* global window, exports, define */
  !function () {

    var re = {
      not_string: /[^s]/,
      not_bool: /[^t]/,
      not_type: /[^T]/,
      not_primitive: /[^v]/,
      number: /[diefg]/,
      numeric_arg: /[bcdiefguxX]/,
      json: /[j]/,
      not_json: /[^j]/,
      text: /^[^\x25]+/,
      modulo: /^\x25{2}/,
      placeholder: /^\x25(?:([1-9]\d*)\$|\(([^)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijostTuvxX])/,
      key: /^([a-z_][a-z_\d]*)/i,
      key_access: /^\.([a-z_][a-z_\d]*)/i,
      index_access: /^\[(\d+)\]/,
      sign: /^[+-]/
    };

    function sprintf(key) {
      // `arguments` is not an array, but should be fine for this call
      return sprintf_format(sprintf_parse(key), arguments);
    }

    function vsprintf(fmt, argv) {
      return sprintf.apply(null, [fmt].concat(argv || []));
    }

    function sprintf_format(parse_tree, argv) {
      var cursor = 1,
          tree_length = parse_tree.length,
          arg,
          output = '',
          i,
          k,
          ph,
          pad,
          pad_character,
          pad_length,
          is_positive,
          sign;

      for (i = 0; i < tree_length; i++) {
        if (typeof parse_tree[i] === 'string') {
          output += parse_tree[i];
        } else if (_typeof(parse_tree[i]) === 'object') {
          ph = parse_tree[i]; // convenience purposes only

          if (ph.keys) {
            // keyword argument
            arg = argv[cursor];

            for (k = 0; k < ph.keys.length; k++) {
              if (arg == undefined) {
                throw new Error(sprintf('[sprintf] Cannot access property "%s" of undefined value "%s"', ph.keys[k], ph.keys[k - 1]));
              }

              arg = arg[ph.keys[k]];
            }
          } else if (ph.param_no) {
            // positional argument (explicit)
            arg = argv[ph.param_no];
          } else {
            // positional argument (implicit)
            arg = argv[cursor++];
          }

          if (re.not_type.test(ph.type) && re.not_primitive.test(ph.type) && arg instanceof Function) {
            arg = arg();
          }

          if (re.numeric_arg.test(ph.type) && typeof arg !== 'number' && isNaN(arg)) {
            throw new TypeError(sprintf('[sprintf] expecting number but found %T', arg));
          }

          if (re.number.test(ph.type)) {
            is_positive = arg >= 0;
          }

          switch (ph.type) {
            case 'b':
              arg = parseInt(arg, 10).toString(2);
              break;

            case 'c':
              arg = String.fromCharCode(parseInt(arg, 10));
              break;

            case 'd':
            case 'i':
              arg = parseInt(arg, 10);
              break;

            case 'j':
              arg = JSON.stringify(arg, null, ph.width ? parseInt(ph.width) : 0);
              break;

            case 'e':
              arg = ph.precision ? parseFloat(arg).toExponential(ph.precision) : parseFloat(arg).toExponential();
              break;

            case 'f':
              arg = ph.precision ? parseFloat(arg).toFixed(ph.precision) : parseFloat(arg);
              break;

            case 'g':
              arg = ph.precision ? String(Number(arg.toPrecision(ph.precision))) : parseFloat(arg);
              break;

            case 'o':
              arg = (parseInt(arg, 10) >>> 0).toString(8);
              break;

            case 's':
              arg = String(arg);
              arg = ph.precision ? arg.substring(0, ph.precision) : arg;
              break;

            case 't':
              arg = String(!!arg);
              arg = ph.precision ? arg.substring(0, ph.precision) : arg;
              break;

            case 'T':
              arg = Object.prototype.toString.call(arg).slice(8, -1).toLowerCase();
              arg = ph.precision ? arg.substring(0, ph.precision) : arg;
              break;

            case 'u':
              arg = parseInt(arg, 10) >>> 0;
              break;

            case 'v':
              arg = arg.valueOf();
              arg = ph.precision ? arg.substring(0, ph.precision) : arg;
              break;

            case 'x':
              arg = (parseInt(arg, 10) >>> 0).toString(16);
              break;

            case 'X':
              arg = (parseInt(arg, 10) >>> 0).toString(16).toUpperCase();
              break;
          }

          if (re.json.test(ph.type)) {
            output += arg;
          } else {
            if (re.number.test(ph.type) && (!is_positive || ph.sign)) {
              sign = is_positive ? '+' : '-';
              arg = arg.toString().replace(re.sign, '');
            } else {
              sign = '';
            }

            pad_character = ph.pad_char ? ph.pad_char === '0' ? '0' : ph.pad_char.charAt(1) : ' ';
            pad_length = ph.width - (sign + arg).length;
            pad = ph.width ? pad_length > 0 ? pad_character.repeat(pad_length) : '' : '';
            output += ph.align ? sign + arg + pad : pad_character === '0' ? sign + pad + arg : pad + sign + arg;
          }
        }
      }

      return output;
    }

    var sprintf_cache = Object.create(null);

    function sprintf_parse(fmt) {
      if (sprintf_cache[fmt]) {
        return sprintf_cache[fmt];
      }

      var _fmt = fmt,
          match,
          parse_tree = [],
          arg_names = 0;

      while (_fmt) {
        if ((match = re.text.exec(_fmt)) !== null) {
          parse_tree.push(match[0]);
        } else if ((match = re.modulo.exec(_fmt)) !== null) {
          parse_tree.push('%');
        } else if ((match = re.placeholder.exec(_fmt)) !== null) {
          if (match[2]) {
            arg_names |= 1;
            var field_list = [],
                replacement_field = match[2],
                field_match = [];

            if ((field_match = re.key.exec(replacement_field)) !== null) {
              field_list.push(field_match[1]);

              while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
                if ((field_match = re.key_access.exec(replacement_field)) !== null) {
                  field_list.push(field_match[1]);
                } else if ((field_match = re.index_access.exec(replacement_field)) !== null) {
                  field_list.push(field_match[1]);
                } else {
                  throw new SyntaxError('[sprintf] failed to parse named argument key');
                }
              }
            } else {
              throw new SyntaxError('[sprintf] failed to parse named argument key');
            }

            match[2] = field_list;
          } else {
            arg_names |= 2;
          }

          if (arg_names === 3) {
            throw new Error('[sprintf] mixing positional and named placeholders is not (yet) supported');
          }

          parse_tree.push({
            placeholder: match[0],
            param_no: match[1],
            keys: match[2],
            sign: match[3],
            pad_char: match[4],
            align: match[5],
            width: match[6],
            precision: match[7],
            type: match[8]
          });
        } else {
          throw new SyntaxError('[sprintf] unexpected placeholder');
        }

        _fmt = _fmt.substring(match[0].length);
      }

      return sprintf_cache[fmt] = parse_tree;
    }
    /**
     * export to either browser or node.js
     */

    /* eslint-disable quote-props */


    if (typeof exports !== 'undefined') {
      exports['sprintf'] = sprintf;
      exports['vsprintf'] = vsprintf;
    }

    if (typeof window !== 'undefined') {
      window['sprintf'] = sprintf;
      window['vsprintf'] = vsprintf;

      if (typeof define === 'function' && define['amd']) {
        define(function () {
          return {
            'sprintf': sprintf,
            'vsprintf': vsprintf
          };
        });
      }
    }
    /* eslint-enable quote-props */

  }(); // eslint-disable-line

  var UnicornHelper = /*#__PURE__*/function () {
    function UnicornHelper(app) {
      _classCallCheck(this, UnicornHelper);

      this.app = app;
      this.aliveHandle = null;
    }

    _createClass(UnicornHelper, [{
      key: "selectOne",
      value: function selectOne(ele) {
        if (typeof ele === 'string') {
          ele = document.querySelector(ele);
        }

        return prepareData(ele);
      }
    }, {
      key: "selectAll",
      value: function selectAll(ele, callback) {
        if (typeof ele === 'string') {
          ele = document.querySelectorAll(ele);
        }

        var resultSet = [].slice.call(ele);

        if (callback) {
          return resultSet.map(callback);
        }

        return resultSet;
      }
    }, {
      key: "h",
      value: function h(element) {
        var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var content = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        var ele = document.createElement(element);

        for (var i in attrs) {
          var v = attrs[i];
          ele.setAttribute(i, v);
        }

        if (content !== null) {
          ele.innerHTML = content;
        }

        return ele;
      }
    }, {
      key: "get",
      value: function get(obj, path) {
        var keys = Array.isArray(path) ? path : path.split('.');

        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];

          if (!obj || !obj.hasOwnProperty(key)) {
            obj = undefined;
            break;
          }

          obj = obj[key];
        }

        return obj;
      }
    }, {
      key: "set",
      value: function set(obj, path, value) {
        var keys = Array.isArray(path) ? path : path.split('.');
        var i;

        for (i = 0; i < keys.length - 1; i++) {
          var key = keys[i];

          if (!obj.hasOwnProperty(key)) {
            obj[key] = {};
          }

          obj = obj[key];
        }

        obj[keys[i]] = value;
        return value;
      }
    }, {
      key: "isDebug",
      value: function isDebug() {
        return Boolean(this.app.data('windwalker.debug'));
      }
      /**
       * Confirm popup.
       *
       * @param {string}   message
       *
       * @return {Promise}
       */

    }, {
      key: "confirm",
      value: function (_confirm) {
        function confirm(_x) {
          return _confirm.apply(this, arguments);
        }

        confirm.toString = function () {
          return _confirm.toString();
        };

        return confirm;
      }(function (message) {
        message = message || 'Are you sure?';
        return new Promise(function (resolve) {
          resolve(confirm(message));
        });
      } // loadScript(urls, autoConvert = true) {
      //   if (typeof urls === 'string') {
      //     urls = [urls];
      //   }
      //
      //   const promises = [];
      //   const data = {};
      //   const endsWith = (str, suffix) => str.indexOf(suffix, str.length - suffix.length) >= 0;
      //   data[this.app.asset('version')] = '1';
      //
      //   urls.forEach(url => {
      //     const ext = url.split('.').pop();
      //     let loadUri = url;
      //
      //     if (autoConvert) {
      //       let assetFile, assetMinFile;
      //
      //       if (endsWith(url, '.min.' + ext)) {
      //         assetMinFile = url;
      //         assetFile = url.slice(0, -`.min.${ext}`.length) + '.' + ext;
      //       } else {
      //         assetFile = url;
      //         assetMinFile = url.slice(0, -`.${ext}`.length) + '.min.' + ext;
      //       }
      //
      //       loadUri = this.app.data('windwalker.debug') ? assetFile : assetMinFile;
      //     }
      //
      //     promises.push(
      //       $.getScript({
      //         url: this.addUriBase(loadUri),
      //         cache: true,
      //         data
      //       })
      //     );
      //   });
      //
      //   return $.when(...promises);
      // }
      )
    }, {
      key: "addUriBase",
      value: function addUriBase(uri) {
        var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'path';

        if (uri.substr(0, 2) === '/\/' || uri.substr(0, 4) === 'http') {
          return uri;
        }

        return this.app.asset(type) + '/' + uri;
      }
      /**
       * Notify information.
       * @param {string|Array} message
       * @param {string}       type
       * @returns {*}
       */
      // notify(message, type = 'info') {
      //   return this.app.addMessage(message, type);
      // }

      /**
       * Keep alive.
       *
       * @param {string} url
       * @param {Number} time
       *
       * @return {number}
       */

    }, {
      key: "keepAlive",
      value: function keepAlive(url) {
        var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 60000;
        return this.aliveHandle = window.setInterval(function () {
          return fetch(url);
        }, time);
      }
      /**
       * Stop keep alive
       */

    }, {
      key: "stopKeepAlive",
      value: function stopKeepAlive() {
        clearInterval(this.aliveHandle);
        this.aliveHandle = null;
        return this;
      }
      /**
       * Is NULL date from default SQL.
       *
       * @param {string} date
       */

    }, {
      key: "isNullDate",
      value: function isNullDate(date) {
        return ['0000-00-00 00:00:00', this.getNullDate()].indexOf(date) !== -1;
      }
      /**
       * Get NULL date from default SQL.
       *
       * @returns {string}
       */

    }, {
      key: "getNullDate",
      value: function getNullDate() {
        return this.app.data('unicorn.date')['empty'];
      }
      /**
       * Number format like php function.
       *
       * @param {string|number} number
       * @param {number}        decimals
       * @param {string}        decPoint
       * @param {string}        thousandsSep
       * @returns {string}
       */

    }, {
      key: "numberFormat",
      value: function numberFormat(number) {
        var decimals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var decPoint = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '.';
        var thousandsSep = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ',';
        decimals = decimals || 0;
        number = parseFloat(number);
        var roundedNumber = Math.round(Math.abs(number) * ('1e' + decimals)) + '';
        var numbersString = decimals ? roundedNumber.slice(0, decimals * -1) : roundedNumber;
        var decimalsString = decimals ? roundedNumber.slice(decimals * -1) : '';
        var formattedNumber = "";

        while (numbersString.length > 3) {
          formattedNumber += thousandsSep + numbersString.slice(-3);
          numbersString = numbersString.slice(0, -3);
        }

        return (number < 0 ? '-' : '') + numbersString + formattedNumber + (decimalsString ? decPoint + decimalsString : '');
      }
    }], [{
      key: "is",
      get: function get() {
        return 'helper';
      }
    }, {
      key: "install",
      value: function install(app) {
        var helper = app.$helper = new this(app);
        app.selectOne = helper.selectOne.bind(helper);
        app.selectAll = helper.selectAll;
        app.h = helper.h;
        app.$get = helper.$get;
        app.$set = helper.$set;
        app.isDebug = helper.isDebug.bind(helper);
        app.confirm = helper.confirm.bind(helper);
        app.keepAlive = helper.keepAlive.bind(helper);
        app.stopKeepAlive = helper.stopKeepAlive;
        app.isNullDate = helper.isNullDate.bind(helper);
        app.getNullDate = helper.getNullDate.bind(helper);
        app.numberFormat = helper.numberFormat;
        app.sprintf = sprintf;
        app.vsprintf = vsprintf;
      }
    }]);

    return UnicornHelper;
  }();

  /**
   * Part of Unicorn project.
   *
   * @copyright  Copyright (C) 2016 LYRASOFT. All rights reserved.
   * @license    GNU General Public License version 2 or later.
   */
  var UnicornHttp = /*#__PURE__*/function () {
    function UnicornHttp(app) {
      _classCallCheck(this, UnicornHttp);

      _defineProperty(this, "globalAxios", void 0);

      _defineProperty(this, "axios", void 0);

      this.app = app;
      this.config = {
        customMethod: false
      };
      this.data = {};
    }

    _createClass(UnicornHttp, [{
      key: "getSelf",
      get: function get() {
        return this;
      }
    }, {
      key: "createHttp",
      value: function createHttp() {
        var _this = this;

        if (!this.globalAxios) {
          this.globalAxios = this.app["import"]('@axios');
        }

        return this.globalAxios.then(function (axios) {
          return _this.axios = axios.create(_this.options.axios || {});
        });
      }
    }, {
      key: "getHttp",
      value: function getHttp() {
        var _this2 = this;

        if (this.axios) {
          return Promise.resolve(this.axios);
        }

        return this.createHttp().then(function (axios) {
          return _this2.axios = axios;
        });
      }
    }, {
      key: "prepareAxios",
      value: function prepareAxios(axios) {
        axios.interceptors.request.use(function (config) {
          config.headers['X-CSRF-Token'] = this.app.data('csrf-token');
          return config;
        });
      }
    }, {
      key: "requestMiddleware",
      value: function requestMiddleware(callback) {
        return this.getHttp().then(function (axios) {
          return axios.interceptors.request.use(callback);
        });
      }
    }, {
      key: "responseMiddleware",
      value: function responseMiddleware(callback) {
        return this.getHttp().then(function (axios) {
          return axios.interceptors.response.use(callback);
        });
      }
    }, {
      key: "ready",
      value: function ready() {
        _get(_getPrototypeOf(UnicornHttp.prototype), "ready", this).call(this);
      }
      /**
       * Send a GET request.
       *
       * @param {string} url
       * @param {Object} options
       *
       * @returns {AxiosResponse}
       */

    }, {
      key: "get",
      value: function get(url) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        options.url = url;
        options.method = 'GET';
        return this.request(options);
      }
      /**
       * Send a POST request.
       *
       * @param {string} url
       * @param {Object|string} data
       * @param {Object} options
       *
       * @returns {AxiosResponse}
       */

    }, {
      key: "post",
      value: function post(url, data) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        options.url = url;
        options.method = 'POST';
        options.data = data;
        return this.request(options);
      }
      /**
       * Send a PUT request.
       *
       * @param {string} url
       * @param {Object|string} data
       * @param {Object} options
       *
       * @returns {AxiosResponse}
       */

    }, {
      key: "put",
      value: function put(url, data) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        options.url = url;
        options.method = 'PUT';
        options.data = data;
        return this.request(options);
      }
      /**
       * Send a PATCH request.
       *
       * @param {string} url
       * @param {Object|string} data
       * @param {Object} options
       *
       * @returns {AxiosResponse}
       */

    }, {
      key: "patch",
      value: function patch(url, data) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        options.url = url;
        options.method = 'PATCH';
        options.data = data;
        return this.request(options);
      }
      /**
       * Send a DELETE request.
       *
       * @param {string} url
       * @param {Object|string} data
       * @param {Object} options
       *
       * @returns {AxiosResponse}
       */

    }, {
      key: 'delete',
      value: function _delete(url, data) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        options.url = url;
        options.method = 'DELETE';
        options.data = data;
        return this.request(options);
      }
      /**
       * Send a HEAD request.
       *
       * @param {string} url
       * @param {Object} options
       *
       * @returns {AxiosResponse}
       */

    }, {
      key: "head",
      value: function head(url) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        options.url = url;
        options.method = 'HEAD';
        return this.request(options);
      }
      /**
       * Send a OPTIONS request.
       *
       * @param {string} url
       * @param {Object} options
       *
       * @returns {AxiosResponse}
       */

    }, {
      key: "options",
      value: function options(url) {
        var _options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _options.url = url;
        _options.method = 'OPTIONS';
        return this.request(_options);
      }
      /**
       * Send request.
       *
       * @param {Object} options
       *
       * @returns {Promise<AxiosResponse>}
       */

    }, {
      key: "request",
      value: function request(options) {
        return this.getHttp().then(function (axios) {
          return axios(options);
        }); // let reqOptions = options;
        // let reqUrl = url;
        // let reqHeaders = headers;
        //
        // if (typeof reqUrl === 'object') {
        //   reqOptions = reqUrl;
        //   reqUrl = reqOptions.url;
        // }
        //
        // const isFormData = data instanceof FormData;
        //
        // if (isFormData) {
        //   reqOptions.processData = false;
        //   reqOptions.contentType = false;
        // }
        //
        // if (typeof reqOptions.dataType === 'undefined') {
        //   reqOptions.dataType = 'json';
        // }
        //
        // reqOptions.data = typeof data === 'string' || isFormData
        //   ? data
        //   : $.extend(true, {}, this.data, reqOptions.data, data);
        //
        // reqOptions.type = method.toUpperCase() || 'GET';
        // const { type } = reqOptions;
        //
        // if (['POST', 'GET'].indexOf(reqOptions.type) === -1 && this.config.customMethod) {
        //   reqHeaders['X-HTTP-Method-Override'] = reqOptions.type;
        //   reqOptions.data._method = reqOptions.type;
        //   reqOptions.type = 'POST';
        // }
        //
        // reqOptions.headers = $.extend(
        //   true,
        //   {},
        //   this.headers._global,
        //   this.headers[type],
        //   reqOptions.headers,
        //   reqHeaders,
        // );
        //
        // return this.$.ajax(reqUrl, reqOptions)
        //   .fail((xhr, error) => {
        //     if (error === 'parsererror') {
        //       // eslint-disable-next-line no-param-reassign
        //       xhr.statusText = 'Unable to parse data.';
        //     } else {
        //       xhr.statusText = decodeURIComponent(xhr.statusText);
        //     }
        //   });
      }
      /**
       * Set custom method with _method parameter.
       *
       * This method will return a clone of this object to help us send request once.
       *
       * @returns {Promise<this>}
       */

    }, {
      key: "customMethod",
      value: function customMethod() {
        var useHeader = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        var clone = this;
        clone.axios = null;
        return clone.requestMiddleware(function (config) {
          if (useHeader) {
            config.headers['X-HTTP-Method-Override'] = config;
          } else if (_typeof(config.data) === 'object') {
            config.data['_method'] = config.method;
          } else if (typeof config.data === 'string') {
            if (config.data.includes('?')) {
              config.data += '&_method=' + config.method;
            } else {
              config.data += '?_method=' + config.method;
            }
          }

          config.method = 'POST';
          return config;
        }).then(function () {
          return clone;
        });
      }
    }], [{
      key: "is",
      get: function get() {
        return 'http';
      }
    }, {
      key: "install",
      value: function install(app, options) {
        app.$http = new this(app);
      }
    }]);

    return UnicornHttp;
  }();

  var UnicornApp = /*#__PURE__*/function (_mix$with) {
    _inherits(UnicornApp, _mix$with);

    var _super = _createSuper(UnicornApp);

    function UnicornApp() {
      var _this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, UnicornApp);

      _this = _super.call(this);

      _defineProperty(_assertThisInitialized(_this), "plugins", {});

      _defineProperty(_assertThisInitialized(_this), "_listeners", {});

      _defineProperty(_assertThisInitialized(_this), "waits", []);

      _this.options = merge({}, _this.constructor.defaultOptions, options); // Wait dom ready

      _this.wait(function (resolve) {
        document.addEventListener('DOMContentLoaded', resolve);
      }); // Ready


      document.addEventListener('DOMContentLoaded', function () {
        _this.completed().then(function () {
          return _this.trigger('loaded');
        });
      });
      return _this;
    }

    _createClass(UnicornApp, [{
      key: "use",
      value: function use(plugin) {
        var _this2 = this;

        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        if (Array.isArray(plugin)) {
          plugin.forEach(function (p) {
            return _this2.use(p);
          });
          return this;
        } // if (plugin.is === undefined) {
        //   throw new Error(`Plugin: ${plugin.name} must instance of : ${Plugin.name}`);
        // }


        plugin.install(this, options);
        this.trigger('plugin.installed', plugin);
        return this;
      }
    }, {
      key: "detach",
      value: function detach(plugin) {
        if (plugin.uninstall) {
          plugin.uninstall(this);
        }

        this.trigger('plugin.uninstalled', plugin);
        return this;
      }
    }, {
      key: "tap",
      value: function tap(value, callback) {
        callback(value);
        return value;
      } // trigger(event, ...args) {
      //   return this.tap(super.trigger(event, ...args), () => {
      //     if (this.data('windwalker.debug')) {
      //       console.debug(`[Unicorn Event] ${event}`, args, this.listeners(event));
      //     }
      //   });
      // }

    }, {
      key: "data",
      value: function data(name, value) {
        this.trigger('unicorn.data', name, value);
        document.__unicorn = document.__unicorn || {};

        if (name === undefined) {
          return document.__unicorn;
        }

        if (value === undefined) {
          var res = document.__unicorn[name];
          this.trigger('unicorn.data.get', name, res);
          return res;
        }

        document.__unicorn[name] = value;
        this.trigger('unicorn.data.set', name, value);
        return this;
      }
    }, {
      key: "removeData",
      value: function removeData(name) {
        document.__unicorn = document.__unicorn || {};
        delete document.__unicorn[name];
        $(document).removeData(name);
        return this;
      }
    }, {
      key: "uri",
      value: function uri(type) {
        return this.data('unicorn.uri')[type];
      }
    }, {
      key: "asset",
      value: function asset(type) {
        return this.uri('asset')[type];
      }
    }, {
      key: "wait",
      value: function wait(callback) {
        var p = new Promise(function (resolve, reject) {
          var promise = callback(resolve, reject);

          if (promise && 'then' in promise) {
            promise.then(resolve)["catch"](reject);
          }
        });
        this.waits.push(p);
        return p;
      }
    }, {
      key: "completed",
      value: function completed() {
        var promise = Promise.all(this.waits);
        this.waits = [];
        return promise;
      }
    }], [{
      key: "defaultOptions",
      get:
      /**
       * Default options.
       * @returns {Object}
       */
      function get() {
        return {};
      }
    }]);

    return UnicornApp;
  }(mix( /*#__PURE__*/function () {
    function _class() {
      _classCallCheck(this, _class);
    }

    return _class;
  }())["with"](EventMixin));

  /**
   * Part of starter project.
   *
   * @copyright  Copyright (C) 2021 __ORGANIZATION__.
   * @license    __LICENSE__
   */
  function createApp() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return new UnicornApp(options);
  }
  function noConflict() {
    var uni = window.u;
    delete window.u;
    return uni;
  }
  var u = createApp();
  u.use(UnicornLoader);
  u.use(UnicornHelper);
  u.use(UnicornHttp);
  u.use(UnicornUI);
  u.use(UnicornForm);
  u.use(UnicornGrid);
  u.use(UnicornValidation);
  window.u = u;

  exports.EventBus = EventBus;
  exports.EventMixin = EventMixin;
  exports.Mixin = Mixin;
  exports.createApp = createApp;
  exports.helper = UnicornHelper;
  exports.mix = mix;
  exports.noConflict = noConflict;

  Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFyZ2V0LmpzIiwic291cmNlcyI6WyIuLi9zcmMvdW5pY29ybi9taXh3aXRoLmpzIiwiLi4vc3JjL3VuaWNvcm4vZXZlbnRzLmpzIiwiLi4vc3JjL3VuaWNvcm4vcGx1Z2luL3ZhbGlkYXRpb24uanMiLCIuLi9zcmMvdW5pY29ybi91aS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2ZyZWVHbG9iYWwuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19yb290LmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fU3ltYm9sLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fZ2V0UmF3VGFnLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fb2JqZWN0VG9TdHJpbmcuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19iYXNlR2V0VGFnLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9pc09iamVjdExpa2UuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL2lzQXJyYXkuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL2lzT2JqZWN0LmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9pZGVudGl0eS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvaXNGdW5jdGlvbi5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2NvcmVKc0RhdGEuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19pc01hc2tlZC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX3RvU291cmNlLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYmFzZUlzTmF0aXZlLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fZ2V0VmFsdWUuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19nZXROYXRpdmUuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19iYXNlQ3JlYXRlLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYXBwbHkuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19jb3B5QXJyYXkuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19zaG9ydE91dC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvY29uc3RhbnQuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19kZWZpbmVQcm9wZXJ0eS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Jhc2VTZXRUb1N0cmluZy5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX3NldFRvU3RyaW5nLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYXJyYXlFYWNoLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9faXNJbmRleC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Jhc2VBc3NpZ25WYWx1ZS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvZXEuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19hc3NpZ25WYWx1ZS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2NvcHlPYmplY3QuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19vdmVyUmVzdC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Jhc2VSZXN0LmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9pc0xlbmd0aC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvaXNBcnJheUxpa2UuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19pc0l0ZXJhdGVlQ2FsbC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2NyZWF0ZUFzc2lnbmVyLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9faXNQcm90b3R5cGUuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19iYXNlVGltZXMuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19iYXNlSXNBcmd1bWVudHMuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL2lzQXJndW1lbnRzLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9zdHViRmFsc2UuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL2lzQnVmZmVyLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYmFzZUlzVHlwZWRBcnJheS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Jhc2VVbmFyeS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX25vZGVVdGlsLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9pc1R5cGVkQXJyYXkuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19hcnJheUxpa2VLZXlzLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fb3ZlckFyZy5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX25hdGl2ZUtleXMuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19iYXNlS2V5cy5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMva2V5cy5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX25hdGl2ZUtleXNJbi5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Jhc2VLZXlzSW4uanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL2tleXNJbi5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX25hdGl2ZUNyZWF0ZS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2hhc2hDbGVhci5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2hhc2hEZWxldGUuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19oYXNoR2V0LmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9faGFzaEhhcy5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2hhc2hTZXQuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19IYXNoLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fbGlzdENhY2hlQ2xlYXIuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19hc3NvY0luZGV4T2YuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19saXN0Q2FjaGVEZWxldGUuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19saXN0Q2FjaGVHZXQuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19saXN0Q2FjaGVIYXMuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19saXN0Q2FjaGVTZXQuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19MaXN0Q2FjaGUuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19NYXAuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19tYXBDYWNoZUNsZWFyLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9faXNLZXlhYmxlLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fZ2V0TWFwRGF0YS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX21hcENhY2hlRGVsZXRlLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fbWFwQ2FjaGVHZXQuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19tYXBDYWNoZUhhcy5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX21hcENhY2hlU2V0LmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fTWFwQ2FjaGUuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19nZXRQcm90b3R5cGUuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL2lzUGxhaW5PYmplY3QuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19zdGFja0NsZWFyLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fc3RhY2tEZWxldGUuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19zdGFja0dldC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX3N0YWNrSGFzLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fc3RhY2tTZXQuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19TdGFjay5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Nsb25lQnVmZmVyLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fVWludDhBcnJheS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Nsb25lQXJyYXlCdWZmZXIuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19jbG9uZVR5cGVkQXJyYXkuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19pbml0Q2xvbmVPYmplY3QuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19jcmVhdGVCYXNlRm9yLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYmFzZUZvci5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Jhc2VGb3JPd24uanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19jcmVhdGVCYXNlRWFjaC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Jhc2VFYWNoLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYXNzaWduTWVyZ2VWYWx1ZS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvaXNBcnJheUxpa2VPYmplY3QuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19zYWZlR2V0LmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy90b1BsYWluT2JqZWN0LmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYmFzZU1lcmdlRGVlcC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Jhc2VNZXJnZS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Nhc3RGdW5jdGlvbi5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvZm9yRWFjaC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvbWVyZ2UuanMiLCIuLi9zcmMvdW5pY29ybi91dGlsaXRpZXMuanMiLCIuLi9zcmMvdW5pY29ybi9wbHVnaW4vZ3JpZC5qcyIsIi4uL3NyYy91bmljb3JuL3BsdWdpbi9mb3JtLmpzIiwiLi4vc3JjL3VuaWNvcm4vbG9hZGVyLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3NwcmludGYtanMvc3JjL3NwcmludGYuanMiLCIuLi9zcmMvdW5pY29ybi9oZWxwZXIuanMiLCIuLi9zcmMvdW5pY29ybi9odHRwLmpzIiwiLi4vc3JjL3VuaWNvcm4vYXBwLmpzIiwiLi4vc3JjL3VuaWNvcm4vdW5pY29ybi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qKlxuICogUGFydCBvZiBwaG9lbml4IHByb2plY3QuXG4gKlxuICogTW9kaWZpZWQgdmVyc2lvbiBvZiBtaXh3aXRoLmpzLiBAc2VlIGh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9qdXN0aW5mYWduYW5pL21peHdpdGguanMvXG4gKlxuICogQGNvcHlyaWdodCAgQ29weXJpZ2h0IChDKSAyMDE5ICR7T1JHQU5JWkFUSU9OfS5cbiAqIEBsaWNlbnNlICAgIF9fTElDRU5TRV9fXG4gKi9cblxuLy8gdXNlZCBieSBhcHBseSgpIGFuZCBpc0FwcGxpY2F0aW9uT2YoKVxuY29uc3QgX2FwcGxpZWRNaXhpbiA9ICdfX21peHdpdGhfYXBwbGllZE1peGluJztcblxuLyoqXG4gKiBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHN1YmNsYXNzIG9mIGl0cyBhcmd1bWVudC5cbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3QgTSA9IChzdXBlcmNsYXNzKSA9PiBjbGFzcyBleHRlbmRzIHN1cGVyY2xhc3Mge1xuICogICBnZXRNZXNzYWdlKCkge1xuICogICAgIHJldHVybiBcIkhlbGxvXCI7XG4gKiAgIH1cbiAqIH1cbiAqXG4gKiBAdHlwZWRlZiB7RnVuY3Rpb259IE1peGluRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHN1cGVyY2xhc3NcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBBIHN1YmNsYXNzIG9mIGBzdXBlcmNsYXNzYFxuICovXG5cbi8qKlxuICogQXBwbGllcyBgbWl4aW5gIHRvIGBzdXBlcmNsYXNzYC5cbiAqXG4gKiBgYXBwbHlgIHN0b3JlcyBhIHJlZmVyZW5jZSBmcm9tIHRoZSBtaXhpbiBhcHBsaWNhdGlvbiB0byB0aGUgdW53cmFwcGVkIG1peGluXG4gKiB0byBtYWtlIGBpc0FwcGxpY2F0aW9uT2ZgIGFuZCBgaGFzTWl4aW5gIHdvcmsuXG4gKlxuICogVGhpcyBmdW5jdGlvbiBpcyB1c2VmdWxsIGZvciBtaXhpbiB3cmFwcGVycyB0aGF0IHdhbnQgdG8gYXV0b21hdGljYWxseSBlbmFibGVcbiAqIHtAbGluayBoYXNNaXhpbn0gc3VwcG9ydC5cbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3QgQXBwbGllciA9IChtaXhpbikgPT4gd3JhcChtaXhpbiwgKHN1cGVyY2xhc3MpID0+IGFwcGx5KHN1cGVyY2xhc3MsIG1peGluKSk7XG4gKlxuICogLy8gTSBub3cgd29ya3Mgd2l0aCBgaGFzTWl4aW5gIGFuZCBgaXNBcHBsaWNhdGlvbk9mYFxuICogY29uc3QgTSA9IEFwcGxpZXIoKHN1cGVyY2xhc3MpID0+IGNsYXNzIGV4dGVuZHMgc3VwZXJjbGFzcyB7fSk7XG4gKlxuICogY2xhc3MgQyBleHRlbmRzIE0oT2JqZWN0KSB7fVxuICogbGV0IGkgPSBuZXcgQygpO1xuICogaGFzTWl4aW4oaSwgTSk7IC8vIHRydWVcbiAqXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHN1cGVyY2xhc3MgQSBjbGFzcyBvciBjb25zdHJ1Y3RvciBmdW5jdGlvblxuICogQHBhcmFtIHtNaXhpbkZ1bmN0aW9ufSBtaXhpbiBUaGUgbWl4aW4gdG8gYXBwbHlcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBBIHN1YmNsYXNzIG9mIGBzdXBlcmNsYXNzYCBwcm9kdWNlZCBieSBgbWl4aW5gXG4gKi9cbmNvbnN0IGFwcGx5ID0gKHN1cGVyY2xhc3MsIG1peGluKSA9PiB7XG4gIGxldCBhcHBsaWNhdGlvbiA9IG1peGluKHN1cGVyY2xhc3MpO1xuICBhcHBsaWNhdGlvbi5wcm90b3R5cGVbX2FwcGxpZWRNaXhpbl0gPSB1bndyYXAobWl4aW4pO1xuICByZXR1cm4gYXBwbGljYXRpb247XG59O1xuXG4vKipcbiAqIFJldHVybnMgYHRydWVgIGlmZiBgcHJvdG9gIGlzIGEgcHJvdG90eXBlIGNyZWF0ZWQgYnkgdGhlIGFwcGxpY2F0aW9uIG9mXG4gKiBgbWl4aW5gIHRvIGEgc3VwZXJjbGFzcy5cbiAqXG4gKiBgaXNBcHBsaWNhdGlvbk9mYCB3b3JrcyBieSBjaGVja2luZyB0aGF0IGBwcm90b2AgaGFzIGEgcmVmZXJlbmNlIHRvIGBtaXhpbmBcbiAqIGFzIGNyZWF0ZWQgYnkgYGFwcGx5YC5cbiAqXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7T2JqZWN0fSBwcm90byBBIHByb3RvdHlwZSBvYmplY3QgY3JlYXRlZCBieSB7QGxpbmsgYXBwbHl9LlxuICogQHBhcmFtIHtNaXhpbkZ1bmN0aW9ufSBtaXhpbiBBIG1peGluIGZ1bmN0aW9uIHVzZWQgd2l0aCB7QGxpbmsgYXBwbHl9LlxuICogQHJldHVybiB7Ym9vbGVhbn0gd2hldGhlciBgcHJvdG9gIGlzIGEgcHJvdG90eXBlIGNyZWF0ZWQgYnkgdGhlIGFwcGxpY2F0aW9uIG9mXG4gKiBgbWl4aW5gIHRvIGEgc3VwZXJjbGFzc1xuICovXG5jb25zdCBpc0FwcGxpY2F0aW9uT2YgPSAocHJvdG8sIG1peGluKSA9PlxuICBwcm90by5oYXNPd25Qcm9wZXJ0eShfYXBwbGllZE1peGluKSAmJiBwcm90b1tfYXBwbGllZE1peGluXSA9PT0gdW53cmFwKG1peGluKTtcblxuLyoqXG4gKiBSZXR1cm5zIGB0cnVlYCBpZmYgYG9gIGhhcyBhbiBhcHBsaWNhdGlvbiBvZiBgbWl4aW5gIG9uIGl0cyBwcm90b3R5cGVcbiAqIGNoYWluLlxuICpcbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtPYmplY3R9IG8gQW4gb2JqZWN0XG4gKiBAcGFyYW0ge01peGluRnVuY3Rpb259IG1peGluIEEgbWl4aW4gYXBwbGllZCB3aXRoIHtAbGluayBhcHBseX1cbiAqIEByZXR1cm4ge2Jvb2xlYW59IHdoZXRoZXIgYG9gIGhhcyBhbiBhcHBsaWNhdGlvbiBvZiBgbWl4aW5gIG9uIGl0cyBwcm90b3R5cGVcbiAqIGNoYWluXG4gKi9cbmNvbnN0IGhhc01peGluID0gKG8sIG1peGluKSA9PiB7XG4gIHdoaWxlIChvICE9IG51bGwpIHtcbiAgICBpZiAoaXNBcHBsaWNhdGlvbk9mKG8sIG1peGluKSkgcmV0dXJuIHRydWU7XG4gICAgbyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvKTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cblxuLy8gdXNlZCBieSB3cmFwKCkgYW5kIHVud3JhcCgpXG5jb25zdCBfd3JhcHBlZE1peGluID0gJ19fbWl4d2l0aF93cmFwcGVkTWl4aW4nO1xuXG4vKipcbiAqIFNldHMgdXAgdGhlIGZ1bmN0aW9uIGBtaXhpbmAgdG8gYmUgd3JhcHBlZCBieSB0aGUgZnVuY3Rpb24gYHdyYXBwZXJgLCB3aGlsZVxuICogYWxsb3dpbmcgcHJvcGVydGllcyBvbiBgbWl4aW5gIHRvIGJlIGF2YWlsYWJsZSB2aWEgYHdyYXBwZXJgLCBhbmQgYWxsb3dpbmdcbiAqIGB3cmFwcGVyYCB0byBiZSB1bndyYXBwZWQgdG8gZ2V0IHRvIHRoZSBvcmlnaW5hbCBmdW5jdGlvbi5cbiAqXG4gKiBgd3JhcGAgZG9lcyB0d28gdGhpbmdzOlxuICogICAxLiBTZXRzIHRoZSBwcm90b3R5cGUgb2YgYG1peGluYCB0byBgd3JhcHBlcmAgc28gdGhhdCBwcm9wZXJ0aWVzIHNldCBvblxuICogICAgICBgbWl4aW5gIGluaGVyaXRlZCBieSBgd3JhcHBlcmAuXG4gKiAgIDIuIFNldHMgYSBzcGVjaWFsIHByb3BlcnR5IG9uIGBtaXhpbmAgdGhhdCBwb2ludHMgYmFjayB0byBgbWl4aW5gIHNvIHRoYXRcbiAqICAgICAgaXQgY2FuIGJlIHJldHJlaXZlZCBmcm9tIGB3cmFwcGVyYFxuICpcbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtNaXhpbkZ1bmN0aW9ufSBtaXhpbiBBIG1peGluIGZ1bmN0aW9uXG4gKiBAcGFyYW0ge01peGluRnVuY3Rpb259IHdyYXBwZXIgQSBmdW5jdGlvbiB0aGF0IHdyYXBzIHtAbGluayBtaXhpbn1cbiAqIEByZXR1cm4ge01peGluRnVuY3Rpb259IGB3cmFwcGVyYFxuICovXG5jb25zdCB3cmFwID0gKG1peGluLCB3cmFwcGVyKSA9PiB7XG4gIE9iamVjdC5zZXRQcm90b3R5cGVPZih3cmFwcGVyLCBtaXhpbik7XG4gIGlmICghbWl4aW5bX3dyYXBwZWRNaXhpbl0pIHtcbiAgICBtaXhpbltfd3JhcHBlZE1peGluXSA9IG1peGluO1xuICB9XG4gIHJldHVybiB3cmFwcGVyO1xufTtcblxuLyoqXG4gKiBVbndyYXBzIHRoZSBmdW5jdGlvbiBgd3JhcHBlcmAgdG8gcmV0dXJuIHRoZSBvcmlnaW5hbCBmdW5jdGlvbiB3cmFwcGVkIGJ5XG4gKiBvbmUgb3IgbW9yZSBjYWxscyB0byBgd3JhcGAuIFJldHVybnMgYHdyYXBwZXJgIGlmIGl0J3Mgbm90IGEgd3JhcHBlZFxuICogZnVuY3Rpb24uXG4gKlxuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge01peGluRnVuY3Rpb259IHdyYXBwZXIgQSB3cmFwcGVkIG1peGluIHByb2R1Y2VkIGJ5IHtAbGluayB3cmFwfVxuICogQHJldHVybiB7TWl4aW5GdW5jdGlvbn0gVGhlIG9yaWdpbmFsbHkgd3JhcHBlZCBtaXhpblxuICovXG5jb25zdCB1bndyYXAgPSAod3JhcHBlcikgPT4gd3JhcHBlcltfd3JhcHBlZE1peGluXSB8fCB3cmFwcGVyO1xuXG5jb25zdCBfY2FjaGVkQXBwbGljYXRpb25zID0gJ19fbWl4d2l0aF9jYWNoZWRBcHBsaWNhdGlvbnMnO1xuXG4vKipcbiAqIERlY29yYXRlcyBgbWl4aW5gIHNvIHRoYXQgaXQgY2FjaGVzIGl0cyBhcHBsaWNhdGlvbnMuIFdoZW4gYXBwbGllZCBtdWx0aXBsZVxuICogdGltZXMgdG8gdGhlIHNhbWUgc3VwZXJjbGFzcywgYG1peGluYCB3aWxsIG9ubHkgY3JlYXRlIG9uZSBzdWJjbGFzcywgbWVtb2l6ZVxuICogaXQgYW5kIHJldHVybiBpdCBmb3IgZWFjaCBhcHBsaWNhdGlvbi5cbiAqXG4gKiBOb3RlOiBJZiBgbWl4aW5gIHNvbWVob3cgc3RvcmVzIHByb3BlcnRpZXMgaXRzIGNsYXNzZXMgY29uc3RydWN0b3IgKHN0YXRpY1xuICogcHJvcGVydGllcyksIG9yIG9uIGl0cyBjbGFzc2VzIHByb3RvdHlwZSwgaXQgd2lsbCBiZSBzaGFyZWQgYWNyb3NzIGFsbFxuICogYXBwbGljYXRpb25zIG9mIGBtaXhpbmAgdG8gYSBzdXBlciBjbGFzcy4gSXQncyByZWNjb21lbmRlZCB0aGF0IGBtaXhpbmAgb25seVxuICogYWNjZXNzIGluc3RhbmNlIHN0YXRlLlxuICpcbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtNaXhpbkZ1bmN0aW9ufSBtaXhpbiBUaGUgbWl4aW4gdG8gd3JhcCB3aXRoIGNhY2hpbmcgYmVoYXZpb3JcbiAqIEByZXR1cm4ge01peGluRnVuY3Rpb259IGEgbmV3IG1peGluIGZ1bmN0aW9uXG4gKi9cbmNvbnN0IENhY2hlZCA9IChtaXhpbikgPT4gd3JhcChtaXhpbiwgKHN1cGVyY2xhc3MpID0+IHtcbiAgLy8gR2V0IG9yIGNyZWF0ZSBhIHN5bWJvbCB1c2VkIHRvIGxvb2sgdXAgYSBwcmV2aW91cyBhcHBsaWNhdGlvbiBvZiBtaXhpblxuICAvLyB0byB0aGUgY2xhc3MuIFRoaXMgc3ltYm9sIGlzIHVuaXF1ZSBwZXIgbWl4aW4gZGVmaW5pdGlvbiwgc28gYSBjbGFzcyB3aWxsIGhhdmUgTlxuICAvLyBhcHBsaWNhdGlvblJlZnMgaWYgaXQgaGFzIGhhZCBOIG1peGlucyBhcHBsaWVkIHRvIGl0LiBBIG1peGluIHdpbGwgaGF2ZVxuICAvLyBleGFjdGx5IG9uZSBfY2FjaGVkQXBwbGljYXRpb25SZWYgdXNlZCB0byBzdG9yZSBpdHMgYXBwbGljYXRpb25zLlxuXG4gIGxldCBjYWNoZWRBcHBsaWNhdGlvbnMgPSBzdXBlcmNsYXNzW19jYWNoZWRBcHBsaWNhdGlvbnNdO1xuICBpZiAoIWNhY2hlZEFwcGxpY2F0aW9ucykge1xuICAgIGNhY2hlZEFwcGxpY2F0aW9ucyA9IHN1cGVyY2xhc3NbX2NhY2hlZEFwcGxpY2F0aW9uc10gPSBuZXcgTWFwKCk7XG4gIH1cblxuICBsZXQgYXBwbGljYXRpb24gPSBjYWNoZWRBcHBsaWNhdGlvbnMuZ2V0KG1peGluKTtcbiAgaWYgKCFhcHBsaWNhdGlvbikge1xuICAgIGFwcGxpY2F0aW9uID0gbWl4aW4oc3VwZXJjbGFzcyk7XG4gICAgY2FjaGVkQXBwbGljYXRpb25zLnNldChtaXhpbiwgYXBwbGljYXRpb24pO1xuICB9XG5cbiAgcmV0dXJuIGFwcGxpY2F0aW9uO1xufSk7XG5cbi8qKlxuICogRGVjb3JhdGVzIGBtaXhpbmAgc28gdGhhdCBpdCBvbmx5IGFwcGxpZXMgaWYgaXQncyBub3QgYWxyZWFkeSBvbiB0aGVcbiAqIHByb3RvdHlwZSBjaGFpbi5cbiAqXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7TWl4aW5GdW5jdGlvbn0gbWl4aW4gVGhlIG1peGluIHRvIHdyYXAgd2l0aCBkZWR1cGxpY2F0aW9uIGJlaGF2aW9yXG4gKiBAcmV0dXJuIHtNaXhpbkZ1bmN0aW9ufSBhIG5ldyBtaXhpbiBmdW5jdGlvblxuICovXG5jb25zdCBEZUR1cGUgPSAobWl4aW4pID0+IHdyYXAobWl4aW4sIChzdXBlcmNsYXNzKSA9PlxuICAoaGFzTWl4aW4oc3VwZXJjbGFzcy5wcm90b3R5cGUsIG1peGluKSlcbiAgICA/IHN1cGVyY2xhc3NcbiAgICA6IG1peGluKHN1cGVyY2xhc3MpKTtcblxuLyoqXG4gKiBBZGRzIFtTeW1ib2wuaGFzSW5zdGFuY2VdIChFUzIwMTUgY3VzdG9tIGluc3RhbmNlb2Ygc3VwcG9ydCkgdG8gYG1peGluYC5cbiAqXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7TWl4aW5GdW5jdGlvbn0gbWl4aW4gVGhlIG1peGluIHRvIGFkZCBbU3ltYm9sLmhhc0luc3RhbmNlXSB0b1xuICogQHJldHVybiB7TWl4aW5GdW5jdGlvbn0gdGhlIGdpdmVuIG1peGluIGZ1bmN0aW9uXG4gKi9cbmNvbnN0IEhhc0luc3RhbmNlID0gKG1peGluKSA9PiB7XG4gIGlmIChTeW1ib2wgJiYgU3ltYm9sLmhhc0luc3RhbmNlICYmICFtaXhpbltTeW1ib2wuaGFzSW5zdGFuY2VdKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG1peGluLCBTeW1ib2wuaGFzSW5zdGFuY2UsIHtcbiAgICAgIHZhbHVlKG8pIHtcbiAgICAgICAgcmV0dXJuIGhhc01peGluKG8sIG1peGluKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIG1peGluO1xufTtcblxuLyoqXG4gKiBBIGJhc2ljIG1peGluIGRlY29yYXRvciB0aGF0IGFwcGxpZXMgdGhlIG1peGluIHdpdGgge0BsaW5rIGFwcGx5fSBzbyB0aGF0IGl0XG4gKiBjYW4gYmUgdXNlZCB3aXRoIHtAbGluayBpc0FwcGxpY2F0aW9uT2Z9LCB7QGxpbmsgaGFzTWl4aW59IGFuZCB0aGUgb3RoZXJcbiAqIG1peGluIGRlY29yYXRvciBmdW5jdGlvbnMuXG4gKlxuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge01peGluRnVuY3Rpb259IG1peGluIFRoZSBtaXhpbiB0byB3cmFwXG4gKiBAcmV0dXJuIHtNaXhpbkZ1bmN0aW9ufSBhIG5ldyBtaXhpbiBmdW5jdGlvblxuICovXG5jb25zdCBCYXJlTWl4aW4gPSAobWl4aW4pID0+IHdyYXAobWl4aW4sIChzKSA9PiBhcHBseShzLCBtaXhpbikpO1xuXG4vKipcbiAqIERlY29yYXRlcyBhIG1peGluIGZ1bmN0aW9uIHRvIGFkZCBkZWR1cGxpY2F0aW9uLCBhcHBsaWNhdGlvbiBjYWNoaW5nIGFuZFxuICogaW5zdGFuY2VvZiBzdXBwb3J0LlxuICpcbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtNaXhpbkZ1bmN0aW9ufSBtaXhpbiBUaGUgbWl4aW4gdG8gd3JhcFxuICogQHJldHVybiB7TWl4aW5GdW5jdGlvbn0gYSBuZXcgbWl4aW4gZnVuY3Rpb25cbiAqL1xuZXhwb3J0IGNvbnN0IE1peGluID0gKG1peGluKSA9PiBEZUR1cGUoQ2FjaGVkKEJhcmVNaXhpbihtaXhpbikpKTtcblxuLyoqXG4gKiBBIGZsdWVudCBpbnRlcmZhY2UgdG8gYXBwbHkgYSBsaXN0IG9mIG1peGlucyB0byBhIHN1cGVyY2xhc3MuXG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogY2xhc3MgWCBleHRlbmRzIG1peChPYmplY3QpLndpdGgoQSwgQiwgQykge31cbiAqIGBgYFxuICpcbiAqIFRoZSBtaXhpbnMgYXJlIGFwcGxpZWQgaW4gb3JkZXIgdG8gdGhlIHN1cGVyY2xhc3MsIHNvIHRoZSBwcm90b3R5cGUgY2hhaW5cbiAqIHdpbGwgYmU6IFgtPkMnLT5CJy0+QSctPk9iamVjdC5cbiAqXG4gKiBUaGlzIGlzIHB1cmVseSBhIGNvbnZlbmllbmNlIGZ1bmN0aW9uLiBUaGUgYWJvdmUgZXhhbXBsZSBpcyBlcXVpdmFsZW50IHRvOlxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNsYXNzIFggZXh0ZW5kcyBDKEIoQShPYmplY3QpKSkge31cbiAqIGBgYFxuICpcbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gW3N1cGVyY2xhc3M9T2JqZWN0XVxuICogQHJldHVybiB7TWl4aW5CdWlsZGVyfVxuICovXG5leHBvcnQgY29uc3QgbWl4ID0gKHN1cGVyY2xhc3MpID0+IG5ldyBNaXhpbkJ1aWxkZXIoc3VwZXJjbGFzcyk7XG5cbmNsYXNzIE1peGluQnVpbGRlciB7XG5cbiAgY29uc3RydWN0b3Ioc3VwZXJjbGFzcykge1xuICAgIHRoaXMuc3VwZXJjbGFzcyA9IHN1cGVyY2xhc3MgfHwgY2xhc3Mge307XG4gIH1cblxuICAvKipcbiAgICogQXBwbGllcyBgbWl4aW5zYCBpbiBvcmRlciB0byB0aGUgc3VwZXJjbGFzcyBnaXZlbiB0byBgbWl4KClgLlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5LjxNaXhpbj59IG1peGluc1xuICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gYSBzdWJjbGFzcyBvZiBgc3VwZXJjbGFzc2Agd2l0aCBgbWl4aW5zYCBhcHBsaWVkXG4gICAqL1xuICB3aXRoKC4uLm1peGlucykge1xuICAgIHJldHVybiBtaXhpbnMucmVkdWNlKChjLCBtKSA9PiBtKGMpLCB0aGlzLnN1cGVyY2xhc3MpO1xuICB9XG59XG5cbi8vIFBvbHlmaWxsIEZvciBJRVxuLy8gQHNlZSBodHRwczovL2p1ZWppbi5pbS9wb3N0LzVkODg3YTljNTE4ODI1MDk0YjM0ZjQxZFxuKGZ1bmN0aW9uKCkge1xuICBPYmplY3Quc2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgKHtfX3Byb3RvX186IFtdfSBpbnN0YW5jZW9mIEFycmF5ID8gc2V0UHJvdG9PZiA6IG1peGluUHJvcGVydGllcyk7XG5cbiAgZnVuY3Rpb24gc2V0UHJvdG9PZihvYmosIHByb3RvKSB7XG4gICAgb2JqLl9fcHJvdG9fXyA9IHByb3RvO1xuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICBmdW5jdGlvbiBtaXhpblByb3BlcnRpZXMob2JqLCBwcm90bykge1xuICAgIGZvciAoY29uc3QgcHJvcCBpbiBwcm90bykge1xuICAgICAgaWYgKCFvYmouaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgb2JqW3Byb3BdID0gcHJvdG9bcHJvcF07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG4gIH1cbn0pKCk7XG4iLCIvKipcbiAqIFBhcnQgb2YgZWFydGggcHJvamVjdC5cbiAqXG4gKiBAY29weXJpZ2h0ICBDb3B5cmlnaHQgKEMpIDIwMTkgJHtPUkdBTklaQVRJT059LlxuICogQGxpY2Vuc2UgICAgX19MSUNFTlNFX19cbiAqL1xuXG5pbXBvcnQgeyBNaXhpbiB9IGZyb20gJy4vbWl4d2l0aC5qcyc7XG5cbmV4cG9ydCBjb25zdCBFdmVudE1peGluID0gTWl4aW4oZnVuY3Rpb24gKHN1cGVyY2xhc3MpIHtcbiAgcmV0dXJuIGNsYXNzIGV4dGVuZHMgc3VwZXJjbGFzcyB7XG4gICAgX2xpc3RlbmVycyA9IHt9O1xuXG4gICAgb24oZXZlbnQsIGhhbmRsZXIpIHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGV2ZW50KSkge1xuICAgICAgICBldmVudC5mb3JFYWNoKGUgPT4gdGhpcy5vbihlLCBoYW5kbGVyKSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fbGlzdGVuZXJzW2V2ZW50XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuX2xpc3RlbmVyc1tldmVudF0gPSBbXTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fbGlzdGVuZXJzW2V2ZW50XS5wdXNoKGhhbmRsZXIpO1xuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvbmNlKGV2ZW50LCBoYW5kbGVyKSB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShldmVudCkpIHtcbiAgICAgICAgZXZlbnQuZm9yRWFjaChlID0+IHRoaXMub25jZShlLCBoYW5kbGVyKSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICBoYW5kbGVyLl9vbmNlID0gdHJ1ZTtcblxuICAgICAgdGhpcy5vbihldmVudCwgaGFuZGxlcik7XG4gICAgfVxuXG4gICAgb2ZmKGV2ZW50LCBjYWxsYmFjayA9IG51bGwpIHtcbiAgICAgIGlmIChjYWxsYmFjayAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9saXN0ZW5lcnNbZXZlbnRdID0gdGhpcy5saXN0ZW5lcnMoZXZlbnQpLmZpbHRlcigobGlzdGVuZXIpID0+IGxpc3RlbmVyICE9PSBjYWxsYmFjayk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICBkZWxldGUgdGhpcy5fbGlzdGVuZXJzW2V2ZW50XTtcblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdHJpZ2dlcihldmVudCwgLi4uYXJncykge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZXZlbnQpKSB7XG4gICAgICAgIGV2ZW50LmZvckVhY2goZSA9PiB0aGlzLnRyaWdnZXIoZSkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgdGhpcy5saXN0ZW5lcnMoZXZlbnQpLmZvckVhY2gobGlzdGVuZXIgPT4ge1xuICAgICAgICBsaXN0ZW5lciguLi5hcmdzKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBSZW1vdmUgb25jZVxuICAgICAgdGhpcy5fbGlzdGVuZXJzW2V2ZW50XSA9IHRoaXMubGlzdGVuZXJzKGV2ZW50KS5maWx0ZXIoKGxpc3RlbmVyKSA9PiBsaXN0ZW5lci5fb25jZSAhPT0gdHJ1ZSk7XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGxpc3RlbmVycyhldmVudCkge1xuICAgICAgaWYgKHR5cGVvZiBldmVudCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBnZXQgbGlzdGVuZXJzIGV2ZW50IG5hbWUgc2hvdWxkIG9ubHkgdXNlIHN0cmluZy5gKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuX2xpc3RlbmVyc1tldmVudF0gPT09IHVuZGVmaW5lZCA/IFtdIDogdGhpcy5fbGlzdGVuZXJzW2V2ZW50XTtcbiAgICB9XG4gIH07XG59KTtcblxuZXhwb3J0IGNsYXNzIEV2ZW50QnVzIGV4dGVuZHMgRXZlbnRNaXhpbihjbGFzcyB7fSkge31cbiIsIi8qKlxuICogUGFydCBvZiBzdGFydGVyIHByb2plY3QuXG4gKlxuICogQGNvcHlyaWdodCAgQ29weXJpZ2h0IChDKSAyMDIxIF9fT1JHQU5JWkFUSU9OX18uXG4gKiBAbGljZW5zZSAgICBfX0xJQ0VOU0VfX1xuICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFVuaWNvcm5WYWxpZGF0aW9uIHtcbiAgc3RhdGljIGluc3RhbGwoYXBwLCBvcHRpb25zID0ge30pIHtcbiAgICBhcHAuZm9ybVZhbGlkYXRpb24gPSAoc2VsZWN0b3IgPSAndW5pLWZvcm0tdmFsaWRhdGUnKSA9PiB7XG4gICAgICBhcHAuaW1wb3J0KCdAdW5pY29ybi91aS92YWxpZGF0aW9uLWNvbXBvbmVudHMuanMnKTtcblxuICAgICAgcmV0dXJuIGFwcC5zZWxlY3RPbmUoc2VsZWN0b3IpO1xuICAgIH07XG4gIH1cbn1cblxuXG4iLCIvKipcbiAqIFBhcnQgb2Ygc3RhcnRlciBwcm9qZWN0LlxuICpcbiAqIEBjb3B5cmlnaHQgIENvcHlyaWdodCAoQykgMjAyMSBfX09SR0FOSVpBVElPTl9fLlxuICogQGxpY2Vuc2UgICAgX19MSUNFTlNFX19cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVbmljb3JuVUkge1xuICB0aGVtZTtcblxuICBzdGF0aWMgZ2V0IGlzKCkgeyByZXR1cm4gJ3VpJzsgfVxuXG4gIHN0YXRpYyBpbnN0YWxsKGFwcCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgLy8gRGlzYWJsZSBBbHBpbmUgYXV0byBsb2FkLlxuICAgIHdpbmRvdy5kZWZlckxvYWRpbmdBbHBpbmUgPSAoKSA9PiB7fTtcblxuICAgIGNvbnN0IHVpID0gYXBwLiR1aSA9IG5ldyB0aGlzKGFwcCk7XG4gICAgYXBwLmFkZE1lc3NhZ2UgPSB1aS5yZW5kZXJNZXNzYWdlO1xuXG4gICAgYXBwLmxvYWRBbHBpbmUgPSB1aS5sb2FkQWxwaW5lLmJpbmQodWkpO1xuICAgIGFwcC5sb2FkU3BydWNlID0gdWkubG9hZFNwcnVjZS5iaW5kKHVpKTtcbiAgICBhcHAuaW5pdEFscGluZSA9IHVpLmluaXRBbHBpbmUuYmluZCh1aSk7XG4gICAgYXBwLnN0YXJ0QWxwaW5lID0gdWkuc3RhcnRBbHBpbmUuYmluZCh1aSk7XG4gICAgYXBwLnN0YXJ0QWxwaW5lU3BydWNlID0gdWkuc3RhcnRBbHBpbmVTcHJ1Y2UuYmluZCh1aSk7XG4gICAgYXBwLmluaXRBbHBpbmVTcHJ1Y2UgPSB1aS5pbml0QWxwaW5lU3BydWNlLmJpbmQodWkpO1xuICB9XG5cbiAgc3RhdGljIGdldCBkZWZhdWx0T3B0aW9ucygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbWVzc2FnZVNlbGVjdG9yOiAnLm1lc3NhZ2Utd3JhcCcsXG4gICAgfTtcbiAgfVxuXG4gIGluc3RhbGxUaGVtZSh0aGVtZSkge1xuICAgIHRoaXMudGhlbWUgPSB0aGVtZTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGFwcCkge1xuICAgIHRoaXMuYXBwID0gYXBwO1xuICAgIHRoaXMuYWxpdmVIYW5kbGUgPSBudWxsO1xuICB9XG5cbiAgcmVuZGVyTWVzc2FnZShtZXNzYWdlcywgdHlwZSA9ICdpbmZvJykge1xuICAgIC8vXG4gIH1cblxuICBsb2FkQWxwaW5lKCkge1xuICAgIHJldHVybiB0aGlzLmFwcC5pbXBvcnQoJ0BhbHBpbmVqcycpO1xuICB9XG5cbiAgbG9hZFNwcnVjZSgpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoW1xuICAgICAgdGhpcy5sb2FkQWxwaW5lKCksXG4gICAgICB0aGlzLmFwcC5pbXBvcnQoJ0BzcHJ1Y2UnKVxuICAgIF0pO1xuICB9XG5cbiAgaW5pdEFscGluZShzZWxlY3Rvcikge1xuICAgIHJldHVybiB0aGlzLmxvYWRBbHBpbmUoKS50aGVuKCgpID0+IHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmFwcC5zZWxlY3RPbmUoc2VsZWN0b3IpO1xuICAgICAgQWxwaW5lLmluaXRpYWxpemVDb21wb25lbnQoZWxlbWVudCk7XG4gICAgfSk7XG4gIH1cblxuICBzdGFydEFscGluZSgpIHtcbiAgICByZXR1cm4gdGhpcy5sb2FkQWxwaW5lKCkudGhlbigoKSA9PiB7XG4gICAgICBpZiAoU3BydWNlKSB7XG4gICAgICAgIFNwcnVjZS5zdGFydCgpO1xuICAgICAgfVxuXG4gICAgICBBbHBpbmUuc3RhcnQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXJ0QWxwaW5lU3BydWNlKCkge1xuICAgIHJldHVybiB0aGlzLmxvYWRTcHJ1Y2UoKS50aGVuKCgpID0+IHtcbiAgICAgIEFscGluZS5zdGFydCgpO1xuICAgIH0pO1xuICB9XG5cbiAgaW5pdEFscGluZVNwcnVjZShzZWxlY3Rvcikge1xuICAgIHJldHVybiB0aGlzLmxvYWRTcHJ1Y2UoKS50aGVuKCgpID0+IHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmFwcC5zZWxlY3RPbmUoc2VsZWN0b3IpO1xuICAgICAgQWxwaW5lLmluaXRpYWxpemVDb21wb25lbnQoZWxlbWVudCk7XG4gICAgfSk7XG4gIH1cblxuICBmbGF0cGlja3IoKSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwLmltcG9ydCgnQHVuaWNvcm4vdWkvZmxhdHBpY2tyLWNvbXBvbmVudHMuanMnKTtcbiAgfVxuXG4gIGxpc3REZXBlbmRlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwLmltcG9ydCgnQHVuaWNvcm4vdWkvbGlzdC1kZXBlbmRlbnQuanMnKTtcbiAgfVxufVxuIiwiLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwgJiYgZ2xvYmFsLk9iamVjdCA9PT0gT2JqZWN0ICYmIGdsb2JhbDtcblxuZXhwb3J0IGRlZmF1bHQgZnJlZUdsb2JhbDtcbiIsImltcG9ydCBmcmVlR2xvYmFsIGZyb20gJy4vX2ZyZWVHbG9iYWwuanMnO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHNlbGZgLiAqL1xudmFyIGZyZWVTZWxmID0gdHlwZW9mIHNlbGYgPT0gJ29iamVjdCcgJiYgc2VsZiAmJiBzZWxmLk9iamVjdCA9PT0gT2JqZWN0ICYmIHNlbGY7XG5cbi8qKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0LiAqL1xudmFyIHJvb3QgPSBmcmVlR2xvYmFsIHx8IGZyZWVTZWxmIHx8IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cbmV4cG9ydCBkZWZhdWx0IHJvb3Q7XG4iLCJpbXBvcnQgcm9vdCBmcm9tICcuL19yb290LmpzJztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgU3ltYm9sID0gcm9vdC5TeW1ib2w7XG5cbmV4cG9ydCBkZWZhdWx0IFN5bWJvbDtcbiIsImltcG9ydCBTeW1ib2wgZnJvbSAnLi9fU3ltYm9sLmpzJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHN5bVRvU3RyaW5nVGFnID0gU3ltYm9sID8gU3ltYm9sLnRvU3RyaW5nVGFnIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUdldFRhZ2Agd2hpY2ggaWdub3JlcyBgU3ltYm9sLnRvU3RyaW5nVGFnYCB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgcmF3IGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGdldFJhd1RhZyh2YWx1ZSkge1xuICB2YXIgaXNPd24gPSBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBzeW1Ub1N0cmluZ1RhZyksXG4gICAgICB0YWcgPSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG5cbiAgdHJ5IHtcbiAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB1bmRlZmluZWQ7XG4gICAgdmFyIHVubWFza2VkID0gdHJ1ZTtcbiAgfSBjYXRjaCAoZSkge31cblxuICB2YXIgcmVzdWx0ID0gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIGlmICh1bm1hc2tlZCkge1xuICAgIGlmIChpc093bikge1xuICAgICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdGFnO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgdmFsdWVbc3ltVG9TdHJpbmdUYWddO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRSYXdUYWc7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nIHVzaW5nIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgb2JqZWN0VG9TdHJpbmc7XG4iLCJpbXBvcnQgU3ltYm9sIGZyb20gJy4vX1N5bWJvbC5qcyc7XG5pbXBvcnQgZ2V0UmF3VGFnIGZyb20gJy4vX2dldFJhd1RhZy5qcyc7XG5pbXBvcnQgb2JqZWN0VG9TdHJpbmcgZnJvbSAnLi9fb2JqZWN0VG9TdHJpbmcuanMnO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgbnVsbFRhZyA9ICdbb2JqZWN0IE51bGxdJyxcbiAgICB1bmRlZmluZWRUYWcgPSAnW29iamVjdCBVbmRlZmluZWRdJztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3ltVG9TdHJpbmdUYWcgPSBTeW1ib2wgPyBTeW1ib2wudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGdldFRhZ2Agd2l0aG91dCBmYWxsYmFja3MgZm9yIGJ1Z2d5IGVudmlyb25tZW50cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBgdG9TdHJpbmdUYWdgLlxuICovXG5mdW5jdGlvbiBiYXNlR2V0VGFnKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWRUYWcgOiBudWxsVGFnO1xuICB9XG4gIHJldHVybiAoc3ltVG9TdHJpbmdUYWcgJiYgc3ltVG9TdHJpbmdUYWcgaW4gT2JqZWN0KHZhbHVlKSlcbiAgICA/IGdldFJhd1RhZyh2YWx1ZSlcbiAgICA6IG9iamVjdFRvU3RyaW5nKHZhbHVlKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYmFzZUdldFRhZztcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdExpa2Uoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpc09iamVjdExpa2U7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYW4gYEFycmF5YCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5KGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXkoJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXkoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcblxuZXhwb3J0IGRlZmF1bHQgaXNBcnJheTtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlXG4gKiBbbGFuZ3VhZ2UgdHlwZV0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLWVjbWFzY3JpcHQtbGFuZ3VhZ2UtdHlwZXMpXG4gKiBvZiBgT2JqZWN0YC4gKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpc09iamVjdDtcbiIsIi8qKlxuICogVGhpcyBtZXRob2QgcmV0dXJucyB0aGUgZmlyc3QgYXJndW1lbnQgaXQgcmVjZWl2ZXMuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IFV0aWxcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgQW55IHZhbHVlLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgYHZhbHVlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxIH07XG4gKlxuICogY29uc29sZS5sb2coXy5pZGVudGl0eShvYmplY3QpID09PSBvYmplY3QpO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBpZGVudGl0eSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWU7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlkZW50aXR5O1xuIiwiaW1wb3J0IGJhc2VHZXRUYWcgZnJvbSAnLi9fYmFzZUdldFRhZy5qcyc7XG5pbXBvcnQgaXNPYmplY3QgZnJvbSAnLi9pc09iamVjdC5qcyc7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhc3luY1RhZyA9ICdbb2JqZWN0IEFzeW5jRnVuY3Rpb25dJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBnZW5UYWcgPSAnW29iamVjdCBHZW5lcmF0b3JGdW5jdGlvbl0nLFxuICAgIHByb3h5VGFnID0gJ1tvYmplY3QgUHJveHldJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYEZ1bmN0aW9uYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBmdW5jdGlvbiwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oXyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0Z1bmN0aW9uKC9hYmMvKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8gVGhlIHVzZSBvZiBgT2JqZWN0I3RvU3RyaW5nYCBhdm9pZHMgaXNzdWVzIHdpdGggdGhlIGB0eXBlb2ZgIG9wZXJhdG9yXG4gIC8vIGluIFNhZmFyaSA5IHdoaWNoIHJldHVybnMgJ29iamVjdCcgZm9yIHR5cGVkIGFycmF5cyBhbmQgb3RoZXIgY29uc3RydWN0b3JzLlxuICB2YXIgdGFnID0gYmFzZUdldFRhZyh2YWx1ZSk7XG4gIHJldHVybiB0YWcgPT0gZnVuY1RhZyB8fCB0YWcgPT0gZ2VuVGFnIHx8IHRhZyA9PSBhc3luY1RhZyB8fCB0YWcgPT0gcHJveHlUYWc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzRnVuY3Rpb247XG4iLCJpbXBvcnQgcm9vdCBmcm9tICcuL19yb290LmpzJztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG92ZXJyZWFjaGluZyBjb3JlLWpzIHNoaW1zLiAqL1xudmFyIGNvcmVKc0RhdGEgPSByb290WydfX2NvcmUtanNfc2hhcmVkX18nXTtcblxuZXhwb3J0IGRlZmF1bHQgY29yZUpzRGF0YTtcbiIsImltcG9ydCBjb3JlSnNEYXRhIGZyb20gJy4vX2NvcmVKc0RhdGEuanMnO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgbWV0aG9kcyBtYXNxdWVyYWRpbmcgYXMgbmF0aXZlLiAqL1xudmFyIG1hc2tTcmNLZXkgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciB1aWQgPSAvW14uXSskLy5leGVjKGNvcmVKc0RhdGEgJiYgY29yZUpzRGF0YS5rZXlzICYmIGNvcmVKc0RhdGEua2V5cy5JRV9QUk9UTyB8fCAnJyk7XG4gIHJldHVybiB1aWQgPyAoJ1N5bWJvbChzcmMpXzEuJyArIHVpZCkgOiAnJztcbn0oKSk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGBmdW5jYCBoYXMgaXRzIHNvdXJjZSBtYXNrZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBmdW5jYCBpcyBtYXNrZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNNYXNrZWQoZnVuYykge1xuICByZXR1cm4gISFtYXNrU3JjS2V5ICYmIChtYXNrU3JjS2V5IGluIGZ1bmMpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpc01hc2tlZDtcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBmdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmdW5jVG9TdHJpbmcgPSBmdW5jUHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ29udmVydHMgYGZ1bmNgIHRvIGl0cyBzb3VyY2UgY29kZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHNvdXJjZSBjb2RlLlxuICovXG5mdW5jdGlvbiB0b1NvdXJjZShmdW5jKSB7XG4gIGlmIChmdW5jICE9IG51bGwpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGZ1bmNUb1N0cmluZy5jYWxsKGZ1bmMpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAoZnVuYyArICcnKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICB9XG4gIHJldHVybiAnJztcbn1cblxuZXhwb3J0IGRlZmF1bHQgdG9Tb3VyY2U7XG4iLCJpbXBvcnQgaXNGdW5jdGlvbiBmcm9tICcuL2lzRnVuY3Rpb24uanMnO1xuaW1wb3J0IGlzTWFza2VkIGZyb20gJy4vX2lzTWFza2VkLmpzJztcbmltcG9ydCBpc09iamVjdCBmcm9tICcuL2lzT2JqZWN0LmpzJztcbmltcG9ydCB0b1NvdXJjZSBmcm9tICcuL190b1NvdXJjZS5qcyc7XG5cbi8qKlxuICogVXNlZCB0byBtYXRjaCBgUmVnRXhwYFxuICogW3N5bnRheCBjaGFyYWN0ZXJzXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1wYXR0ZXJucykuXG4gKi9cbnZhciByZVJlZ0V4cENoYXIgPSAvW1xcXFxeJC4qKz8oKVtcXF17fXxdL2c7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBob3N0IGNvbnN0cnVjdG9ycyAoU2FmYXJpKS4gKi9cbnZhciByZUlzSG9zdEN0b3IgPSAvXlxcW29iamVjdCAuKz9Db25zdHJ1Y3RvclxcXSQvO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlLFxuICAgIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZ1bmNUb1N0cmluZyA9IGZ1bmNQcm90by50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGlmIGEgbWV0aG9kIGlzIG5hdGl2ZS4gKi9cbnZhciByZUlzTmF0aXZlID0gUmVnRXhwKCdeJyArXG4gIGZ1bmNUb1N0cmluZy5jYWxsKGhhc093blByb3BlcnR5KS5yZXBsYWNlKHJlUmVnRXhwQ2hhciwgJ1xcXFwkJicpXG4gIC5yZXBsYWNlKC9oYXNPd25Qcm9wZXJ0eXwoZnVuY3Rpb24pLio/KD89XFxcXFxcKCl8IGZvciAuKz8oPz1cXFxcXFxdKS9nLCAnJDEuKj8nKSArICckJ1xuKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc05hdGl2ZWAgd2l0aG91dCBiYWQgc2hpbSBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24sXG4gKiAgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNOYXRpdmUodmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkgfHwgaXNNYXNrZWQodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBwYXR0ZXJuID0gaXNGdW5jdGlvbih2YWx1ZSkgPyByZUlzTmF0aXZlIDogcmVJc0hvc3RDdG9yO1xuICByZXR1cm4gcGF0dGVybi50ZXN0KHRvU291cmNlKHZhbHVlKSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGJhc2VJc05hdGl2ZTtcbiIsIi8qKlxuICogR2V0cyB0aGUgdmFsdWUgYXQgYGtleWAgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcHJvcGVydHkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGdldFZhbHVlKG9iamVjdCwga2V5KSB7XG4gIHJldHVybiBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9iamVjdFtrZXldO1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRWYWx1ZTtcbiIsImltcG9ydCBiYXNlSXNOYXRpdmUgZnJvbSAnLi9fYmFzZUlzTmF0aXZlLmpzJztcbmltcG9ydCBnZXRWYWx1ZSBmcm9tICcuL19nZXRWYWx1ZS5qcyc7XG5cbi8qKlxuICogR2V0cyB0aGUgbmF0aXZlIGZ1bmN0aW9uIGF0IGBrZXlgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIG1ldGhvZCB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZnVuY3Rpb24gaWYgaXQncyBuYXRpdmUsIGVsc2UgYHVuZGVmaW5lZGAuXG4gKi9cbmZ1bmN0aW9uIGdldE5hdGl2ZShvYmplY3QsIGtleSkge1xuICB2YXIgdmFsdWUgPSBnZXRWYWx1ZShvYmplY3QsIGtleSk7XG4gIHJldHVybiBiYXNlSXNOYXRpdmUodmFsdWUpID8gdmFsdWUgOiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldE5hdGl2ZTtcbiIsImltcG9ydCBpc09iamVjdCBmcm9tICcuL2lzT2JqZWN0LmpzJztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0Q3JlYXRlID0gT2JqZWN0LmNyZWF0ZTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5jcmVhdGVgIHdpdGhvdXQgc3VwcG9ydCBmb3IgYXNzaWduaW5nXG4gKiBwcm9wZXJ0aWVzIHRvIHRoZSBjcmVhdGVkIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHByb3RvIFRoZSBvYmplY3QgdG8gaW5oZXJpdCBmcm9tLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbmV3IG9iamVjdC5cbiAqL1xudmFyIGJhc2VDcmVhdGUgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIG9iamVjdCgpIHt9XG4gIHJldHVybiBmdW5jdGlvbihwcm90bykge1xuICAgIGlmICghaXNPYmplY3QocHJvdG8pKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICAgIGlmIChvYmplY3RDcmVhdGUpIHtcbiAgICAgIHJldHVybiBvYmplY3RDcmVhdGUocHJvdG8pO1xuICAgIH1cbiAgICBvYmplY3QucHJvdG90eXBlID0gcHJvdG87XG4gICAgdmFyIHJlc3VsdCA9IG5ldyBvYmplY3Q7XG4gICAgb2JqZWN0LnByb3RvdHlwZSA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufSgpKTtcblxuZXhwb3J0IGRlZmF1bHQgYmFzZUNyZWF0ZTtcbiIsIi8qKlxuICogQSBmYXN0ZXIgYWx0ZXJuYXRpdmUgdG8gYEZ1bmN0aW9uI2FwcGx5YCwgdGhpcyBmdW5jdGlvbiBpbnZva2VzIGBmdW5jYFxuICogd2l0aCB0aGUgYHRoaXNgIGJpbmRpbmcgb2YgYHRoaXNBcmdgIGFuZCB0aGUgYXJndW1lbnRzIG9mIGBhcmdzYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gaW52b2tlLlxuICogQHBhcmFtIHsqfSB0aGlzQXJnIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgZnVuY2AuXG4gKiBAcGFyYW0ge0FycmF5fSBhcmdzIFRoZSBhcmd1bWVudHMgdG8gaW52b2tlIGBmdW5jYCB3aXRoLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHJlc3VsdCBvZiBgZnVuY2AuXG4gKi9cbmZ1bmN0aW9uIGFwcGx5KGZ1bmMsIHRoaXNBcmcsIGFyZ3MpIHtcbiAgc3dpdGNoIChhcmdzLmxlbmd0aCkge1xuICAgIGNhc2UgMDogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnKTtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYXJnc1swXSk7XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgfVxuICByZXR1cm4gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXBwbHk7XG4iLCIvKipcbiAqIENvcGllcyB0aGUgdmFsdWVzIG9mIGBzb3VyY2VgIHRvIGBhcnJheWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IHNvdXJjZSBUaGUgYXJyYXkgdG8gY29weSB2YWx1ZXMgZnJvbS5cbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheT1bXV0gVGhlIGFycmF5IHRvIGNvcHkgdmFsdWVzIHRvLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKi9cbmZ1bmN0aW9uIGNvcHlBcnJheShzb3VyY2UsIGFycmF5KSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gc291cmNlLmxlbmd0aDtcblxuICBhcnJheSB8fCAoYXJyYXkgPSBBcnJheShsZW5ndGgpKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBhcnJheVtpbmRleF0gPSBzb3VyY2VbaW5kZXhdO1xuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY29weUFycmF5O1xuIiwiLyoqIFVzZWQgdG8gZGV0ZWN0IGhvdCBmdW5jdGlvbnMgYnkgbnVtYmVyIG9mIGNhbGxzIHdpdGhpbiBhIHNwYW4gb2YgbWlsbGlzZWNvbmRzLiAqL1xudmFyIEhPVF9DT1VOVCA9IDgwMCxcbiAgICBIT1RfU1BBTiA9IDE2O1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTm93ID0gRGF0ZS5ub3c7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQnbGwgc2hvcnQgb3V0IGFuZCBpbnZva2UgYGlkZW50aXR5YCBpbnN0ZWFkXG4gKiBvZiBgZnVuY2Agd2hlbiBpdCdzIGNhbGxlZCBgSE9UX0NPVU5UYCBvciBtb3JlIHRpbWVzIGluIGBIT1RfU1BBTmBcbiAqIG1pbGxpc2Vjb25kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gcmVzdHJpY3QuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBzaG9ydGFibGUgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIHNob3J0T3V0KGZ1bmMpIHtcbiAgdmFyIGNvdW50ID0gMCxcbiAgICAgIGxhc3RDYWxsZWQgPSAwO1xuXG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgc3RhbXAgPSBuYXRpdmVOb3coKSxcbiAgICAgICAgcmVtYWluaW5nID0gSE9UX1NQQU4gLSAoc3RhbXAgLSBsYXN0Q2FsbGVkKTtcblxuICAgIGxhc3RDYWxsZWQgPSBzdGFtcDtcbiAgICBpZiAocmVtYWluaW5nID4gMCkge1xuICAgICAgaWYgKCsrY291bnQgPj0gSE9UX0NPVU5UKSB7XG4gICAgICAgIHJldHVybiBhcmd1bWVudHNbMF07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvdW50ID0gMDtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmMuYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBzaG9ydE91dDtcbiIsIi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBgdmFsdWVgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi40LjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byByZXR1cm4gZnJvbSB0aGUgbmV3IGZ1bmN0aW9uLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgY29uc3RhbnQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3RzID0gXy50aW1lcygyLCBfLmNvbnN0YW50KHsgJ2EnOiAxIH0pKTtcbiAqXG4gKiBjb25zb2xlLmxvZyhvYmplY3RzKTtcbiAqIC8vID0+IFt7ICdhJzogMSB9LCB7ICdhJzogMSB9XVxuICpcbiAqIGNvbnNvbGUubG9nKG9iamVjdHNbMF0gPT09IG9iamVjdHNbMV0pO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBjb25zdGFudCh2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjb25zdGFudDtcbiIsImltcG9ydCBnZXROYXRpdmUgZnJvbSAnLi9fZ2V0TmF0aXZlLmpzJztcblxudmFyIGRlZmluZVByb3BlcnR5ID0gKGZ1bmN0aW9uKCkge1xuICB0cnkge1xuICAgIHZhciBmdW5jID0gZ2V0TmF0aXZlKE9iamVjdCwgJ2RlZmluZVByb3BlcnR5Jyk7XG4gICAgZnVuYyh7fSwgJycsIHt9KTtcbiAgICByZXR1cm4gZnVuYztcbiAgfSBjYXRjaCAoZSkge31cbn0oKSk7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZVByb3BlcnR5O1xuIiwiaW1wb3J0IGNvbnN0YW50IGZyb20gJy4vY29uc3RhbnQuanMnO1xuaW1wb3J0IGRlZmluZVByb3BlcnR5IGZyb20gJy4vX2RlZmluZVByb3BlcnR5LmpzJztcbmltcG9ydCBpZGVudGl0eSBmcm9tICcuL2lkZW50aXR5LmpzJztcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgc2V0VG9TdHJpbmdgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaG90IGxvb3Agc2hvcnRpbmcuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHN0cmluZyBUaGUgYHRvU3RyaW5nYCByZXN1bHQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgYGZ1bmNgLlxuICovXG52YXIgYmFzZVNldFRvU3RyaW5nID0gIWRlZmluZVByb3BlcnR5ID8gaWRlbnRpdHkgOiBmdW5jdGlvbihmdW5jLCBzdHJpbmcpIHtcbiAgcmV0dXJuIGRlZmluZVByb3BlcnR5KGZ1bmMsICd0b1N0cmluZycsIHtcbiAgICAnY29uZmlndXJhYmxlJzogdHJ1ZSxcbiAgICAnZW51bWVyYWJsZSc6IGZhbHNlLFxuICAgICd2YWx1ZSc6IGNvbnN0YW50KHN0cmluZyksXG4gICAgJ3dyaXRhYmxlJzogdHJ1ZVxuICB9KTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGJhc2VTZXRUb1N0cmluZztcbiIsImltcG9ydCBiYXNlU2V0VG9TdHJpbmcgZnJvbSAnLi9fYmFzZVNldFRvU3RyaW5nLmpzJztcbmltcG9ydCBzaG9ydE91dCBmcm9tICcuL19zaG9ydE91dC5qcyc7XG5cbi8qKlxuICogU2V0cyB0aGUgYHRvU3RyaW5nYCBtZXRob2Qgb2YgYGZ1bmNgIHRvIHJldHVybiBgc3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gc3RyaW5nIFRoZSBgdG9TdHJpbmdgIHJlc3VsdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyBgZnVuY2AuXG4gKi9cbnZhciBzZXRUb1N0cmluZyA9IHNob3J0T3V0KGJhc2VTZXRUb1N0cmluZyk7XG5cbmV4cG9ydCBkZWZhdWx0IHNldFRvU3RyaW5nO1xuIiwiLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8uZm9yRWFjaGAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yXG4gKiBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKi9cbmZ1bmN0aW9uIGFycmF5RWFjaChhcnJheSwgaXRlcmF0ZWUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGlmIChpdGVyYXRlZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkgPT09IGZhbHNlKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG5leHBvcnQgZGVmYXVsdCBhcnJheUVhY2g7XG4iLCIvKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IHVuc2lnbmVkIGludGVnZXIgdmFsdWVzLiAqL1xudmFyIHJlSXNVaW50ID0gL14oPzowfFsxLTldXFxkKikkLztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgaW5kZXguXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHBhcmFtIHtudW1iZXJ9IFtsZW5ndGg9TUFYX1NBRkVfSU5URUdFUl0gVGhlIHVwcGVyIGJvdW5kcyBvZiBhIHZhbGlkIGluZGV4LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBpbmRleCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0luZGV4KHZhbHVlLCBsZW5ndGgpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIGxlbmd0aCA9IGxlbmd0aCA9PSBudWxsID8gTUFYX1NBRkVfSU5URUdFUiA6IGxlbmd0aDtcblxuICByZXR1cm4gISFsZW5ndGggJiZcbiAgICAodHlwZSA9PSAnbnVtYmVyJyB8fFxuICAgICAgKHR5cGUgIT0gJ3N5bWJvbCcgJiYgcmVJc1VpbnQudGVzdCh2YWx1ZSkpKSAmJlxuICAgICAgICAodmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8IGxlbmd0aCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzSW5kZXg7XG4iLCJpbXBvcnQgZGVmaW5lUHJvcGVydHkgZnJvbSAnLi9fZGVmaW5lUHJvcGVydHkuanMnO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBhc3NpZ25WYWx1ZWAgYW5kIGBhc3NpZ25NZXJnZVZhbHVlYCB3aXRob3V0XG4gKiB2YWx1ZSBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGFzc2lnbi5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGFzc2lnbi5cbiAqL1xuZnVuY3Rpb24gYmFzZUFzc2lnblZhbHVlKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICBpZiAoa2V5ID09ICdfX3Byb3RvX18nICYmIGRlZmluZVByb3BlcnR5KSB7XG4gICAgZGVmaW5lUHJvcGVydHkob2JqZWN0LCBrZXksIHtcbiAgICAgICdjb25maWd1cmFibGUnOiB0cnVlLFxuICAgICAgJ2VudW1lcmFibGUnOiB0cnVlLFxuICAgICAgJ3ZhbHVlJzogdmFsdWUsXG4gICAgICAnd3JpdGFibGUnOiB0cnVlXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBiYXNlQXNzaWduVmFsdWU7XG4iLCIvKipcbiAqIFBlcmZvcm1zIGFcbiAqIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG4gKiBjb21wYXJpc29uIGJldHdlZW4gdHdvIHZhbHVlcyB0byBkZXRlcm1pbmUgaWYgdGhleSBhcmUgZXF1aXZhbGVudC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Kn0gb3RoZXIgVGhlIG90aGVyIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IDEgfTtcbiAqIHZhciBvdGhlciA9IHsgJ2EnOiAxIH07XG4gKlxuICogXy5lcShvYmplY3QsIG9iamVjdCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5lcShvYmplY3QsIG90aGVyKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5lcSgnYScsICdhJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5lcSgnYScsIE9iamVjdCgnYScpKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5lcShOYU4sIE5hTik7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGVxKHZhbHVlLCBvdGhlcikge1xuICByZXR1cm4gdmFsdWUgPT09IG90aGVyIHx8ICh2YWx1ZSAhPT0gdmFsdWUgJiYgb3RoZXIgIT09IG90aGVyKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZXE7XG4iLCJpbXBvcnQgYmFzZUFzc2lnblZhbHVlIGZyb20gJy4vX2Jhc2VBc3NpZ25WYWx1ZS5qcyc7XG5pbXBvcnQgZXEgZnJvbSAnLi9lcS5qcyc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQXNzaWducyBgdmFsdWVgIHRvIGBrZXlgIG9mIGBvYmplY3RgIGlmIHRoZSBleGlzdGluZyB2YWx1ZSBpcyBub3QgZXF1aXZhbGVudFxuICogdXNpbmcgW2BTYW1lVmFsdWVaZXJvYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtc2FtZXZhbHVlemVybylcbiAqIGZvciBlcXVhbGl0eSBjb21wYXJpc29ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gYXNzaWduLlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gYXNzaWduLlxuICovXG5mdW5jdGlvbiBhc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgdmFyIG9ialZhbHVlID0gb2JqZWN0W2tleV07XG4gIGlmICghKGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpICYmIGVxKG9ialZhbHVlLCB2YWx1ZSkpIHx8XG4gICAgICAodmFsdWUgPT09IHVuZGVmaW5lZCAmJiAhKGtleSBpbiBvYmplY3QpKSkge1xuICAgIGJhc2VBc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgdmFsdWUpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzc2lnblZhbHVlO1xuIiwiaW1wb3J0IGFzc2lnblZhbHVlIGZyb20gJy4vX2Fzc2lnblZhbHVlLmpzJztcbmltcG9ydCBiYXNlQXNzaWduVmFsdWUgZnJvbSAnLi9fYmFzZUFzc2lnblZhbHVlLmpzJztcblxuLyoqXG4gKiBDb3BpZXMgcHJvcGVydGllcyBvZiBgc291cmNlYCB0byBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyBmcm9tLlxuICogQHBhcmFtIHtBcnJheX0gcHJvcHMgVGhlIHByb3BlcnR5IGlkZW50aWZpZXJzIHRvIGNvcHkuXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdD17fV0gVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgdG8uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb3BpZWQgdmFsdWVzLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gY29weU9iamVjdChzb3VyY2UsIHByb3BzLCBvYmplY3QsIGN1c3RvbWl6ZXIpIHtcbiAgdmFyIGlzTmV3ID0gIW9iamVjdDtcbiAgb2JqZWN0IHx8IChvYmplY3QgPSB7fSk7XG5cbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIga2V5ID0gcHJvcHNbaW5kZXhdO1xuXG4gICAgdmFyIG5ld1ZhbHVlID0gY3VzdG9taXplclxuICAgICAgPyBjdXN0b21pemVyKG9iamVjdFtrZXldLCBzb3VyY2Vba2V5XSwga2V5LCBvYmplY3QsIHNvdXJjZSlcbiAgICAgIDogdW5kZWZpbmVkO1xuXG4gICAgaWYgKG5ld1ZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG5ld1ZhbHVlID0gc291cmNlW2tleV07XG4gICAgfVxuICAgIGlmIChpc05ldykge1xuICAgICAgYmFzZUFzc2lnblZhbHVlKG9iamVjdCwga2V5LCBuZXdWYWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFzc2lnblZhbHVlKG9iamVjdCwga2V5LCBuZXdWYWx1ZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBvYmplY3Q7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvcHlPYmplY3Q7XG4iLCJpbXBvcnQgYXBwbHkgZnJvbSAnLi9fYXBwbHkuanMnO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXg7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlUmVzdGAgd2hpY2ggdHJhbnNmb3JtcyB0aGUgcmVzdCBhcnJheS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYXBwbHkgYSByZXN0IHBhcmFtZXRlciB0by5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9ZnVuYy5sZW5ndGgtMV0gVGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSByZXN0IHBhcmFtZXRlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHRyYW5zZm9ybSBUaGUgcmVzdCBhcnJheSB0cmFuc2Zvcm0uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gb3ZlclJlc3QoZnVuYywgc3RhcnQsIHRyYW5zZm9ybSkge1xuICBzdGFydCA9IG5hdGl2ZU1heChzdGFydCA9PT0gdW5kZWZpbmVkID8gKGZ1bmMubGVuZ3RoIC0gMSkgOiBzdGFydCwgMCk7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gbmF0aXZlTWF4KGFyZ3MubGVuZ3RoIC0gc3RhcnQsIDApLFxuICAgICAgICBhcnJheSA9IEFycmF5KGxlbmd0aCk7XG5cbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgYXJyYXlbaW5kZXhdID0gYXJnc1tzdGFydCArIGluZGV4XTtcbiAgICB9XG4gICAgaW5kZXggPSAtMTtcbiAgICB2YXIgb3RoZXJBcmdzID0gQXJyYXkoc3RhcnQgKyAxKTtcbiAgICB3aGlsZSAoKytpbmRleCA8IHN0YXJ0KSB7XG4gICAgICBvdGhlckFyZ3NbaW5kZXhdID0gYXJnc1tpbmRleF07XG4gICAgfVxuICAgIG90aGVyQXJnc1tzdGFydF0gPSB0cmFuc2Zvcm0oYXJyYXkpO1xuICAgIHJldHVybiBhcHBseShmdW5jLCB0aGlzLCBvdGhlckFyZ3MpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBvdmVyUmVzdDtcbiIsImltcG9ydCBpZGVudGl0eSBmcm9tICcuL2lkZW50aXR5LmpzJztcbmltcG9ydCBvdmVyUmVzdCBmcm9tICcuL19vdmVyUmVzdC5qcyc7XG5pbXBvcnQgc2V0VG9TdHJpbmcgZnJvbSAnLi9fc2V0VG9TdHJpbmcuanMnO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnJlc3RgIHdoaWNoIGRvZXNuJ3QgdmFsaWRhdGUgb3IgY29lcmNlIGFyZ3VtZW50cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYXBwbHkgYSByZXN0IHBhcmFtZXRlciB0by5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9ZnVuYy5sZW5ndGgtMV0gVGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSByZXN0IHBhcmFtZXRlci5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlUmVzdChmdW5jLCBzdGFydCkge1xuICByZXR1cm4gc2V0VG9TdHJpbmcob3ZlclJlc3QoZnVuYywgc3RhcnQsIGlkZW50aXR5KSwgZnVuYyArICcnKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYmFzZVJlc3Q7XG4iLCIvKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBpcyBsb29zZWx5IGJhc2VkIG9uXG4gKiBbYFRvTGVuZ3RoYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtdG9sZW5ndGgpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgbGVuZ3RoLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNMZW5ndGgoMyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0xlbmd0aChOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aChJbmZpbml0eSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNMZW5ndGgoJzMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTGVuZ3RoKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiZcbiAgICB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDw9IE1BWF9TQUZFX0lOVEVHRVI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzTGVuZ3RoO1xuIiwiaW1wb3J0IGlzRnVuY3Rpb24gZnJvbSAnLi9pc0Z1bmN0aW9uLmpzJztcbmltcG9ydCBpc0xlbmd0aCBmcm9tICcuL2lzTGVuZ3RoLmpzJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLiBBIHZhbHVlIGlzIGNvbnNpZGVyZWQgYXJyYXktbGlrZSBpZiBpdCdzXG4gKiBub3QgYSBmdW5jdGlvbiBhbmQgaGFzIGEgYHZhbHVlLmxlbmd0aGAgdGhhdCdzIGFuIGludGVnZXIgZ3JlYXRlciB0aGFuIG9yXG4gKiBlcXVhbCB0byBgMGAgYW5kIGxlc3MgdGhhbiBvciBlcXVhbCB0byBgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZSgnYWJjJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUxpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgaXNMZW5ndGgodmFsdWUubGVuZ3RoKSAmJiAhaXNGdW5jdGlvbih2YWx1ZSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzQXJyYXlMaWtlO1xuIiwiaW1wb3J0IGVxIGZyb20gJy4vZXEuanMnO1xuaW1wb3J0IGlzQXJyYXlMaWtlIGZyb20gJy4vaXNBcnJheUxpa2UuanMnO1xuaW1wb3J0IGlzSW5kZXggZnJvbSAnLi9faXNJbmRleC5qcyc7XG5pbXBvcnQgaXNPYmplY3QgZnJvbSAnLi9pc09iamVjdC5qcyc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBhcmd1bWVudHMgYXJlIGZyb20gYW4gaXRlcmF0ZWUgY2FsbC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIHZhbHVlIGFyZ3VtZW50LlxuICogQHBhcmFtIHsqfSBpbmRleCBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIGluZGV4IG9yIGtleSBhcmd1bWVudC5cbiAqIEBwYXJhbSB7Kn0gb2JqZWN0IFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgb2JqZWN0IGFyZ3VtZW50LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBhcmd1bWVudHMgYXJlIGZyb20gYW4gaXRlcmF0ZWUgY2FsbCxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSXRlcmF0ZWVDYWxsKHZhbHVlLCBpbmRleCwgb2JqZWN0KSB7XG4gIGlmICghaXNPYmplY3Qob2JqZWN0KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgdHlwZSA9IHR5cGVvZiBpbmRleDtcbiAgaWYgKHR5cGUgPT0gJ251bWJlcidcbiAgICAgICAgPyAoaXNBcnJheUxpa2Uob2JqZWN0KSAmJiBpc0luZGV4KGluZGV4LCBvYmplY3QubGVuZ3RoKSlcbiAgICAgICAgOiAodHlwZSA9PSAnc3RyaW5nJyAmJiBpbmRleCBpbiBvYmplY3QpXG4gICAgICApIHtcbiAgICByZXR1cm4gZXEob2JqZWN0W2luZGV4XSwgdmFsdWUpO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaXNJdGVyYXRlZUNhbGw7XG4iLCJpbXBvcnQgYmFzZVJlc3QgZnJvbSAnLi9fYmFzZVJlc3QuanMnO1xuaW1wb3J0IGlzSXRlcmF0ZWVDYWxsIGZyb20gJy4vX2lzSXRlcmF0ZWVDYWxsLmpzJztcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gbGlrZSBgXy5hc3NpZ25gLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBhc3NpZ25lciBUaGUgZnVuY3Rpb24gdG8gYXNzaWduIHZhbHVlcy5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGFzc2lnbmVyIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVBc3NpZ25lcihhc3NpZ25lcikge1xuICByZXR1cm4gYmFzZVJlc3QoZnVuY3Rpb24ob2JqZWN0LCBzb3VyY2VzKSB7XG4gICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgIGxlbmd0aCA9IHNvdXJjZXMubGVuZ3RoLFxuICAgICAgICBjdXN0b21pemVyID0gbGVuZ3RoID4gMSA/IHNvdXJjZXNbbGVuZ3RoIC0gMV0gOiB1bmRlZmluZWQsXG4gICAgICAgIGd1YXJkID0gbGVuZ3RoID4gMiA/IHNvdXJjZXNbMl0gOiB1bmRlZmluZWQ7XG5cbiAgICBjdXN0b21pemVyID0gKGFzc2lnbmVyLmxlbmd0aCA+IDMgJiYgdHlwZW9mIGN1c3RvbWl6ZXIgPT0gJ2Z1bmN0aW9uJylcbiAgICAgID8gKGxlbmd0aC0tLCBjdXN0b21pemVyKVxuICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgICBpZiAoZ3VhcmQgJiYgaXNJdGVyYXRlZUNhbGwoc291cmNlc1swXSwgc291cmNlc1sxXSwgZ3VhcmQpKSB7XG4gICAgICBjdXN0b21pemVyID0gbGVuZ3RoIDwgMyA/IHVuZGVmaW5lZCA6IGN1c3RvbWl6ZXI7XG4gICAgICBsZW5ndGggPSAxO1xuICAgIH1cbiAgICBvYmplY3QgPSBPYmplY3Qob2JqZWN0KTtcbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgdmFyIHNvdXJjZSA9IHNvdXJjZXNbaW5kZXhdO1xuICAgICAgaWYgKHNvdXJjZSkge1xuICAgICAgICBhc3NpZ25lcihvYmplY3QsIHNvdXJjZSwgaW5kZXgsIGN1c3RvbWl6ZXIpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0O1xuICB9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlQXNzaWduZXI7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGxpa2VseSBhIHByb3RvdHlwZSBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBwcm90b3R5cGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNQcm90b3R5cGUodmFsdWUpIHtcbiAgdmFyIEN0b3IgPSB2YWx1ZSAmJiB2YWx1ZS5jb25zdHJ1Y3RvcixcbiAgICAgIHByb3RvID0gKHR5cGVvZiBDdG9yID09ICdmdW5jdGlvbicgJiYgQ3Rvci5wcm90b3R5cGUpIHx8IG9iamVjdFByb3RvO1xuXG4gIHJldHVybiB2YWx1ZSA9PT0gcHJvdG87XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzUHJvdG90eXBlO1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy50aW1lc2Agd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzXG4gKiBvciBtYXggYXJyYXkgbGVuZ3RoIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IG4gVGhlIG51bWJlciBvZiB0aW1lcyB0byBpbnZva2UgYGl0ZXJhdGVlYC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHJlc3VsdHMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VUaW1lcyhuLCBpdGVyYXRlZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IEFycmF5KG4pO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbikge1xuICAgIHJlc3VsdFtpbmRleF0gPSBpdGVyYXRlZShpbmRleCk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYmFzZVRpbWVzO1xuIiwiaW1wb3J0IGJhc2VHZXRUYWcgZnJvbSAnLi9fYmFzZUdldFRhZy5qcyc7XG5pbXBvcnQgaXNPYmplY3RMaWtlIGZyb20gJy4vaXNPYmplY3RMaWtlLmpzJztcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJztcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc0FyZ3VtZW50c2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LFxuICovXG5mdW5jdGlvbiBiYXNlSXNBcmd1bWVudHModmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgYmFzZUdldFRhZyh2YWx1ZSkgPT0gYXJnc1RhZztcbn1cblxuZXhwb3J0IGRlZmF1bHQgYmFzZUlzQXJndW1lbnRzO1xuIiwiaW1wb3J0IGJhc2VJc0FyZ3VtZW50cyBmcm9tICcuL19iYXNlSXNBcmd1bWVudHMuanMnO1xuaW1wb3J0IGlzT2JqZWN0TGlrZSBmcm9tICcuL2lzT2JqZWN0TGlrZS5qcyc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHByb3BlcnR5SXNFbnVtZXJhYmxlID0gb2JqZWN0UHJvdG8ucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGFuIGBhcmd1bWVudHNgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FyZ3VtZW50cyA9IGJhc2VJc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA/IGJhc2VJc0FyZ3VtZW50cyA6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsICdjYWxsZWUnKSAmJlxuICAgICFwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHZhbHVlLCAnY2FsbGVlJyk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBpc0FyZ3VtZW50cztcbiIsIi8qKlxuICogVGhpcyBtZXRob2QgcmV0dXJucyBgZmFsc2VgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4xMy4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50aW1lcygyLCBfLnN0dWJGYWxzZSk7XG4gKiAvLyA9PiBbZmFsc2UsIGZhbHNlXVxuICovXG5mdW5jdGlvbiBzdHViRmFsc2UoKSB7XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgc3R1YkZhbHNlO1xuIiwiaW1wb3J0IHJvb3QgZnJvbSAnLi9fcm9vdC5qcyc7XG5pbXBvcnQgc3R1YkZhbHNlIGZyb20gJy4vc3R1YkZhbHNlLmpzJztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbnZhciBmcmVlRXhwb3J0cyA9IHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnICYmIGV4cG9ydHMgJiYgIWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xudmFyIGZyZWVNb2R1bGUgPSBmcmVlRXhwb3J0cyAmJiB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuLyoqIERldGVjdCB0aGUgcG9wdWxhciBDb21tb25KUyBleHRlbnNpb24gYG1vZHVsZS5leHBvcnRzYC4gKi9cbnZhciBtb2R1bGVFeHBvcnRzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBCdWZmZXIgPSBtb2R1bGVFeHBvcnRzID8gcm9vdC5CdWZmZXIgOiB1bmRlZmluZWQ7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVJc0J1ZmZlciA9IEJ1ZmZlciA/IEJ1ZmZlci5pc0J1ZmZlciA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIGJ1ZmZlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMy4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGJ1ZmZlciwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQnVmZmVyKG5ldyBCdWZmZXIoMikpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNCdWZmZXIobmV3IFVpbnQ4QXJyYXkoMikpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQnVmZmVyID0gbmF0aXZlSXNCdWZmZXIgfHwgc3R1YkZhbHNlO1xuXG5leHBvcnQgZGVmYXVsdCBpc0J1ZmZlcjtcbiIsImltcG9ydCBiYXNlR2V0VGFnIGZyb20gJy4vX2Jhc2VHZXRUYWcuanMnO1xuaW1wb3J0IGlzTGVuZ3RoIGZyb20gJy4vaXNMZW5ndGguanMnO1xuaW1wb3J0IGlzT2JqZWN0TGlrZSBmcm9tICcuL2lzT2JqZWN0TGlrZS5qcyc7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXScsXG4gICAgYXJyYXlUYWcgPSAnW29iamVjdCBBcnJheV0nLFxuICAgIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBlcnJvclRhZyA9ICdbb2JqZWN0IEVycm9yXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgbnVtYmVyVGFnID0gJ1tvYmplY3QgTnVtYmVyXScsXG4gICAgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XScsXG4gICAgcmVnZXhwVGFnID0gJ1tvYmplY3QgUmVnRXhwXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XScsXG4gICAgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXScsXG4gICAgd2Vha01hcFRhZyA9ICdbb2JqZWN0IFdlYWtNYXBdJztcblxudmFyIGFycmF5QnVmZmVyVGFnID0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJyxcbiAgICBkYXRhVmlld1RhZyA9ICdbb2JqZWN0IERhdGFWaWV3XScsXG4gICAgZmxvYXQzMlRhZyA9ICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgIGZsb2F0NjRUYWcgPSAnW29iamVjdCBGbG9hdDY0QXJyYXldJyxcbiAgICBpbnQ4VGFnID0gJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgaW50MTZUYWcgPSAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgaW50MzJUYWcgPSAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgdWludDhUYWcgPSAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgdWludDhDbGFtcGVkVGFnID0gJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICB1aW50MTZUYWcgPSAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgIHVpbnQzMlRhZyA9ICdbb2JqZWN0IFVpbnQzMkFycmF5XSc7XG5cbi8qKiBVc2VkIHRvIGlkZW50aWZ5IGB0b1N0cmluZ1RhZ2AgdmFsdWVzIG9mIHR5cGVkIGFycmF5cy4gKi9cbnZhciB0eXBlZEFycmF5VGFncyA9IHt9O1xudHlwZWRBcnJheVRhZ3NbZmxvYXQzMlRhZ10gPSB0eXBlZEFycmF5VGFnc1tmbG9hdDY0VGFnXSA9XG50eXBlZEFycmF5VGFnc1tpbnQ4VGFnXSA9IHR5cGVkQXJyYXlUYWdzW2ludDE2VGFnXSA9XG50eXBlZEFycmF5VGFnc1tpbnQzMlRhZ10gPSB0eXBlZEFycmF5VGFnc1t1aW50OFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbdWludDhDbGFtcGVkVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3VpbnQxNlRhZ10gPVxudHlwZWRBcnJheVRhZ3NbdWludDMyVGFnXSA9IHRydWU7XG50eXBlZEFycmF5VGFnc1thcmdzVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2FycmF5VGFnXSA9XG50eXBlZEFycmF5VGFnc1thcnJheUJ1ZmZlclRhZ10gPSB0eXBlZEFycmF5VGFnc1tib29sVGFnXSA9XG50eXBlZEFycmF5VGFnc1tkYXRhVmlld1RhZ10gPSB0eXBlZEFycmF5VGFnc1tkYXRlVGFnXSA9XG50eXBlZEFycmF5VGFnc1tlcnJvclRhZ10gPSB0eXBlZEFycmF5VGFnc1tmdW5jVGFnXSA9XG50eXBlZEFycmF5VGFnc1ttYXBUYWddID0gdHlwZWRBcnJheVRhZ3NbbnVtYmVyVGFnXSA9XG50eXBlZEFycmF5VGFnc1tvYmplY3RUYWddID0gdHlwZWRBcnJheVRhZ3NbcmVnZXhwVGFnXSA9XG50eXBlZEFycmF5VGFnc1tzZXRUYWddID0gdHlwZWRBcnJheVRhZ3Nbc3RyaW5nVGFnXSA9XG50eXBlZEFycmF5VGFnc1t3ZWFrTWFwVGFnXSA9IGZhbHNlO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzVHlwZWRBcnJheWAgd2l0aG91dCBOb2RlLmpzIG9wdGltaXphdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB0eXBlZCBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNUeXBlZEFycmF5KHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmXG4gICAgaXNMZW5ndGgodmFsdWUubGVuZ3RoKSAmJiAhIXR5cGVkQXJyYXlUYWdzW2Jhc2VHZXRUYWcodmFsdWUpXTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYmFzZUlzVHlwZWRBcnJheTtcbiIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udW5hcnlgIHdpdGhvdXQgc3VwcG9ydCBmb3Igc3RvcmluZyBtZXRhZGF0YS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY2FwIGFyZ3VtZW50cyBmb3IuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBjYXBwZWQgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VVbmFyeShmdW5jKSB7XG4gIHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiBmdW5jKHZhbHVlKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYmFzZVVuYXJ5O1xuIiwiaW1wb3J0IGZyZWVHbG9iYWwgZnJvbSAnLi9fZnJlZUdsb2JhbC5qcyc7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG52YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbnZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbi8qKiBEZXRlY3QgdGhlIHBvcHVsYXIgQ29tbW9uSlMgZXh0ZW5zaW9uIGBtb2R1bGUuZXhwb3J0c2AuICovXG52YXIgbW9kdWxlRXhwb3J0cyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5leHBvcnRzID09PSBmcmVlRXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBwcm9jZXNzYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZVByb2Nlc3MgPSBtb2R1bGVFeHBvcnRzICYmIGZyZWVHbG9iYWwucHJvY2VzcztcblxuLyoqIFVzZWQgdG8gYWNjZXNzIGZhc3RlciBOb2RlLmpzIGhlbHBlcnMuICovXG52YXIgbm9kZVV0aWwgPSAoZnVuY3Rpb24oKSB7XG4gIHRyeSB7XG4gICAgLy8gVXNlIGB1dGlsLnR5cGVzYCBmb3IgTm9kZS5qcyAxMCsuXG4gICAgdmFyIHR5cGVzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLnJlcXVpcmUgJiYgZnJlZU1vZHVsZS5yZXF1aXJlKCd1dGlsJykudHlwZXM7XG5cbiAgICBpZiAodHlwZXMpIHtcbiAgICAgIHJldHVybiB0eXBlcztcbiAgICB9XG5cbiAgICAvLyBMZWdhY3kgYHByb2Nlc3MuYmluZGluZygndXRpbCcpYCBmb3IgTm9kZS5qcyA8IDEwLlxuICAgIHJldHVybiBmcmVlUHJvY2VzcyAmJiBmcmVlUHJvY2Vzcy5iaW5kaW5nICYmIGZyZWVQcm9jZXNzLmJpbmRpbmcoJ3V0aWwnKTtcbiAgfSBjYXRjaCAoZSkge31cbn0oKSk7XG5cbmV4cG9ydCBkZWZhdWx0IG5vZGVVdGlsO1xuIiwiaW1wb3J0IGJhc2VJc1R5cGVkQXJyYXkgZnJvbSAnLi9fYmFzZUlzVHlwZWRBcnJheS5qcyc7XG5pbXBvcnQgYmFzZVVuYXJ5IGZyb20gJy4vX2Jhc2VVbmFyeS5qcyc7XG5pbXBvcnQgbm9kZVV0aWwgZnJvbSAnLi9fbm9kZVV0aWwuanMnO1xuXG4vKiBOb2RlLmpzIGhlbHBlciByZWZlcmVuY2VzLiAqL1xudmFyIG5vZGVJc1R5cGVkQXJyYXkgPSBub2RlVXRpbCAmJiBub2RlVXRpbC5pc1R5cGVkQXJyYXk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIHR5cGVkIGFycmF5LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdHlwZWQgYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1R5cGVkQXJyYXkobmV3IFVpbnQ4QXJyYXkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNUeXBlZEFycmF5KFtdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc1R5cGVkQXJyYXkgPSBub2RlSXNUeXBlZEFycmF5ID8gYmFzZVVuYXJ5KG5vZGVJc1R5cGVkQXJyYXkpIDogYmFzZUlzVHlwZWRBcnJheTtcblxuZXhwb3J0IGRlZmF1bHQgaXNUeXBlZEFycmF5O1xuIiwiaW1wb3J0IGJhc2VUaW1lcyBmcm9tICcuL19iYXNlVGltZXMuanMnO1xuaW1wb3J0IGlzQXJndW1lbnRzIGZyb20gJy4vaXNBcmd1bWVudHMuanMnO1xuaW1wb3J0IGlzQXJyYXkgZnJvbSAnLi9pc0FycmF5LmpzJztcbmltcG9ydCBpc0J1ZmZlciBmcm9tICcuL2lzQnVmZmVyLmpzJztcbmltcG9ydCBpc0luZGV4IGZyb20gJy4vX2lzSW5kZXguanMnO1xuaW1wb3J0IGlzVHlwZWRBcnJheSBmcm9tICcuL2lzVHlwZWRBcnJheS5qcyc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiB0aGUgYXJyYXktbGlrZSBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaW5oZXJpdGVkIFNwZWNpZnkgcmV0dXJuaW5nIGluaGVyaXRlZCBwcm9wZXJ0eSBuYW1lcy5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGFycmF5TGlrZUtleXModmFsdWUsIGluaGVyaXRlZCkge1xuICB2YXIgaXNBcnIgPSBpc0FycmF5KHZhbHVlKSxcbiAgICAgIGlzQXJnID0gIWlzQXJyICYmIGlzQXJndW1lbnRzKHZhbHVlKSxcbiAgICAgIGlzQnVmZiA9ICFpc0FyciAmJiAhaXNBcmcgJiYgaXNCdWZmZXIodmFsdWUpLFxuICAgICAgaXNUeXBlID0gIWlzQXJyICYmICFpc0FyZyAmJiAhaXNCdWZmICYmIGlzVHlwZWRBcnJheSh2YWx1ZSksXG4gICAgICBza2lwSW5kZXhlcyA9IGlzQXJyIHx8IGlzQXJnIHx8IGlzQnVmZiB8fCBpc1R5cGUsXG4gICAgICByZXN1bHQgPSBza2lwSW5kZXhlcyA/IGJhc2VUaW1lcyh2YWx1ZS5sZW5ndGgsIFN0cmluZykgOiBbXSxcbiAgICAgIGxlbmd0aCA9IHJlc3VsdC5sZW5ndGg7XG5cbiAgZm9yICh2YXIga2V5IGluIHZhbHVlKSB7XG4gICAgaWYgKChpbmhlcml0ZWQgfHwgaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwga2V5KSkgJiZcbiAgICAgICAgIShza2lwSW5kZXhlcyAmJiAoXG4gICAgICAgICAgIC8vIFNhZmFyaSA5IGhhcyBlbnVtZXJhYmxlIGBhcmd1bWVudHMubGVuZ3RoYCBpbiBzdHJpY3QgbW9kZS5cbiAgICAgICAgICAga2V5ID09ICdsZW5ndGgnIHx8XG4gICAgICAgICAgIC8vIE5vZGUuanMgMC4xMCBoYXMgZW51bWVyYWJsZSBub24taW5kZXggcHJvcGVydGllcyBvbiBidWZmZXJzLlxuICAgICAgICAgICAoaXNCdWZmICYmIChrZXkgPT0gJ29mZnNldCcgfHwga2V5ID09ICdwYXJlbnQnKSkgfHxcbiAgICAgICAgICAgLy8gUGhhbnRvbUpTIDIgaGFzIGVudW1lcmFibGUgbm9uLWluZGV4IHByb3BlcnRpZXMgb24gdHlwZWQgYXJyYXlzLlxuICAgICAgICAgICAoaXNUeXBlICYmIChrZXkgPT0gJ2J1ZmZlcicgfHwga2V5ID09ICdieXRlTGVuZ3RoJyB8fCBrZXkgPT0gJ2J5dGVPZmZzZXQnKSkgfHxcbiAgICAgICAgICAgLy8gU2tpcCBpbmRleCBwcm9wZXJ0aWVzLlxuICAgICAgICAgICBpc0luZGV4KGtleSwgbGVuZ3RoKVxuICAgICAgICApKSkge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXJyYXlMaWtlS2V5cztcbiIsIi8qKlxuICogQ3JlYXRlcyBhIHVuYXJ5IGZ1bmN0aW9uIHRoYXQgaW52b2tlcyBgZnVuY2Agd2l0aCBpdHMgYXJndW1lbnQgdHJhbnNmb3JtZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHdyYXAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSB0cmFuc2Zvcm0gVGhlIGFyZ3VtZW50IHRyYW5zZm9ybS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBvdmVyQXJnKGZ1bmMsIHRyYW5zZm9ybSkge1xuICByZXR1cm4gZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIGZ1bmModHJhbnNmb3JtKGFyZykpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBvdmVyQXJnO1xuIiwiaW1wb3J0IG92ZXJBcmcgZnJvbSAnLi9fb3ZlckFyZy5qcyc7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVLZXlzID0gb3ZlckFyZyhPYmplY3Qua2V5cywgT2JqZWN0KTtcblxuZXhwb3J0IGRlZmF1bHQgbmF0aXZlS2V5cztcbiIsImltcG9ydCBpc1Byb3RvdHlwZSBmcm9tICcuL19pc1Byb3RvdHlwZS5qcyc7XG5pbXBvcnQgbmF0aXZlS2V5cyBmcm9tICcuL19uYXRpdmVLZXlzLmpzJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5rZXlzYCB3aGljaCBkb2Vzbid0IHRyZWF0IHNwYXJzZSBhcnJheXMgYXMgZGVuc2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VLZXlzKG9iamVjdCkge1xuICBpZiAoIWlzUHJvdG90eXBlKG9iamVjdCkpIHtcbiAgICByZXR1cm4gbmF0aXZlS2V5cyhvYmplY3QpO1xuICB9XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIE9iamVjdChvYmplY3QpKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpICYmIGtleSAhPSAnY29uc3RydWN0b3InKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBiYXNlS2V5cztcbiIsImltcG9ydCBhcnJheUxpa2VLZXlzIGZyb20gJy4vX2FycmF5TGlrZUtleXMuanMnO1xuaW1wb3J0IGJhc2VLZXlzIGZyb20gJy4vX2Jhc2VLZXlzLmpzJztcbmltcG9ydCBpc0FycmF5TGlrZSBmcm9tICcuL2lzQXJyYXlMaWtlLmpzJztcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogTm9uLW9iamVjdCB2YWx1ZXMgYXJlIGNvZXJjZWQgdG8gb2JqZWN0cy4gU2VlIHRoZVxuICogW0VTIHNwZWNdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5rZXlzKVxuICogZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmtleXMobmV3IEZvbyk7XG4gKiAvLyA9PiBbJ2EnLCAnYiddIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gKlxuICogXy5rZXlzKCdoaScpO1xuICogLy8gPT4gWycwJywgJzEnXVxuICovXG5mdW5jdGlvbiBrZXlzKG9iamVjdCkge1xuICByZXR1cm4gaXNBcnJheUxpa2Uob2JqZWN0KSA/IGFycmF5TGlrZUtleXMob2JqZWN0KSA6IGJhc2VLZXlzKG9iamVjdCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGtleXM7XG4iLCIvKipcbiAqIFRoaXMgZnVuY3Rpb24gaXMgbGlrZVxuICogW2BPYmplY3Qua2V5c2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5rZXlzKVxuICogZXhjZXB0IHRoYXQgaXQgaW5jbHVkZXMgaW5oZXJpdGVkIGVudW1lcmFibGUgcHJvcGVydGllcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gbmF0aXZlS2V5c0luKG9iamVjdCkge1xuICB2YXIgcmVzdWx0ID0gW107XG4gIGlmIChvYmplY3QgIT0gbnVsbCkge1xuICAgIGZvciAodmFyIGtleSBpbiBPYmplY3Qob2JqZWN0KSkge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbmF0aXZlS2V5c0luO1xuIiwiaW1wb3J0IGlzT2JqZWN0IGZyb20gJy4vaXNPYmplY3QuanMnO1xuaW1wb3J0IGlzUHJvdG90eXBlIGZyb20gJy4vX2lzUHJvdG90eXBlLmpzJztcbmltcG9ydCBuYXRpdmVLZXlzSW4gZnJvbSAnLi9fbmF0aXZlS2V5c0luLmpzJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5rZXlzSW5gIHdoaWNoIGRvZXNuJ3QgdHJlYXQgc3BhcnNlIGFycmF5cyBhcyBkZW5zZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gYmFzZUtleXNJbihvYmplY3QpIHtcbiAgaWYgKCFpc09iamVjdChvYmplY3QpKSB7XG4gICAgcmV0dXJuIG5hdGl2ZUtleXNJbihvYmplY3QpO1xuICB9XG4gIHZhciBpc1Byb3RvID0gaXNQcm90b3R5cGUob2JqZWN0KSxcbiAgICAgIHJlc3VsdCA9IFtdO1xuXG4gIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICBpZiAoIShrZXkgPT0gJ2NvbnN0cnVjdG9yJyAmJiAoaXNQcm90byB8fCAhaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkpKSkge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYmFzZUtleXNJbjtcbiIsImltcG9ydCBhcnJheUxpa2VLZXlzIGZyb20gJy4vX2FycmF5TGlrZUtleXMuanMnO1xuaW1wb3J0IGJhc2VLZXlzSW4gZnJvbSAnLi9fYmFzZUtleXNJbi5qcyc7XG5pbXBvcnQgaXNBcnJheUxpa2UgZnJvbSAnLi9pc0FycmF5TGlrZS5qcyc7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGFuZCBpbmhlcml0ZWQgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogTm9uLW9iamVjdCB2YWx1ZXMgYXJlIGNvZXJjZWQgdG8gb2JqZWN0cy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmtleXNJbihuZXcgRm9vKTtcbiAqIC8vID0+IFsnYScsICdiJywgJ2MnXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICovXG5mdW5jdGlvbiBrZXlzSW4ob2JqZWN0KSB7XG4gIHJldHVybiBpc0FycmF5TGlrZShvYmplY3QpID8gYXJyYXlMaWtlS2V5cyhvYmplY3QsIHRydWUpIDogYmFzZUtleXNJbihvYmplY3QpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBrZXlzSW47XG4iLCJpbXBvcnQgZ2V0TmF0aXZlIGZyb20gJy4vX2dldE5hdGl2ZS5qcyc7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBuYXRpdmVDcmVhdGUgPSBnZXROYXRpdmUoT2JqZWN0LCAnY3JlYXRlJyk7XG5cbmV4cG9ydCBkZWZhdWx0IG5hdGl2ZUNyZWF0ZTtcbiIsImltcG9ydCBuYXRpdmVDcmVhdGUgZnJvbSAnLi9fbmF0aXZlQ3JlYXRlLmpzJztcblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBoYXNoLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIEhhc2hcbiAqL1xuZnVuY3Rpb24gaGFzaENsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0gbmF0aXZlQ3JlYXRlID8gbmF0aXZlQ3JlYXRlKG51bGwpIDoge307XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGhhc2hDbGVhcjtcbiIsIi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIGhhc2guXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7T2JqZWN0fSBoYXNoIFRoZSBoYXNoIHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBoYXNoRGVsZXRlKGtleSkge1xuICB2YXIgcmVzdWx0ID0gdGhpcy5oYXMoa2V5KSAmJiBkZWxldGUgdGhpcy5fX2RhdGFfX1trZXldO1xuICB0aGlzLnNpemUgLT0gcmVzdWx0ID8gMSA6IDA7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGhhc2hEZWxldGU7XG4iLCJpbXBvcnQgbmF0aXZlQ3JlYXRlIGZyb20gJy4vX25hdGl2ZUNyZWF0ZS5qcyc7XG5cbi8qKiBVc2VkIHRvIHN0YW5kLWluIGZvciBgdW5kZWZpbmVkYCBoYXNoIHZhbHVlcy4gKi9cbnZhciBIQVNIX1VOREVGSU5FRCA9ICdfX2xvZGFzaF9oYXNoX3VuZGVmaW5lZF9fJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBHZXRzIHRoZSBoYXNoIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGhhc2hHZXQoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgaWYgKG5hdGl2ZUNyZWF0ZSkge1xuICAgIHZhciByZXN1bHQgPSBkYXRhW2tleV07XG4gICAgcmV0dXJuIHJlc3VsdCA9PT0gSEFTSF9VTkRFRklORUQgPyB1bmRlZmluZWQgOiByZXN1bHQ7XG4gIH1cbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoZGF0YSwga2V5KSA/IGRhdGFba2V5XSA6IHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaGFzaEdldDtcbiIsImltcG9ydCBuYXRpdmVDcmVhdGUgZnJvbSAnLi9fbmF0aXZlQ3JlYXRlLmpzJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYSBoYXNoIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBoYXNoSGFzKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIHJldHVybiBuYXRpdmVDcmVhdGUgPyAoZGF0YVtrZXldICE9PSB1bmRlZmluZWQpIDogaGFzT3duUHJvcGVydHkuY2FsbChkYXRhLCBrZXkpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBoYXNoSGFzO1xuIiwiaW1wb3J0IG5hdGl2ZUNyZWF0ZSBmcm9tICcuL19uYXRpdmVDcmVhdGUuanMnO1xuXG4vKiogVXNlZCB0byBzdGFuZC1pbiBmb3IgYHVuZGVmaW5lZGAgaGFzaCB2YWx1ZXMuICovXG52YXIgSEFTSF9VTkRFRklORUQgPSAnX19sb2Rhc2hfaGFzaF91bmRlZmluZWRfXyc7XG5cbi8qKlxuICogU2V0cyB0aGUgaGFzaCBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGhhc2ggaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIGhhc2hTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIHRoaXMuc2l6ZSArPSB0aGlzLmhhcyhrZXkpID8gMCA6IDE7XG4gIGRhdGFba2V5XSA9IChuYXRpdmVDcmVhdGUgJiYgdmFsdWUgPT09IHVuZGVmaW5lZCkgPyBIQVNIX1VOREVGSU5FRCA6IHZhbHVlO1xuICByZXR1cm4gdGhpcztcbn1cblxuZXhwb3J0IGRlZmF1bHQgaGFzaFNldDtcbiIsImltcG9ydCBoYXNoQ2xlYXIgZnJvbSAnLi9faGFzaENsZWFyLmpzJztcbmltcG9ydCBoYXNoRGVsZXRlIGZyb20gJy4vX2hhc2hEZWxldGUuanMnO1xuaW1wb3J0IGhhc2hHZXQgZnJvbSAnLi9faGFzaEdldC5qcyc7XG5pbXBvcnQgaGFzaEhhcyBmcm9tICcuL19oYXNoSGFzLmpzJztcbmltcG9ydCBoYXNoU2V0IGZyb20gJy4vX2hhc2hTZXQuanMnO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBoYXNoIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gSGFzaChlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBIYXNoYC5cbkhhc2gucHJvdG90eXBlLmNsZWFyID0gaGFzaENsZWFyO1xuSGFzaC5wcm90b3R5cGVbJ2RlbGV0ZSddID0gaGFzaERlbGV0ZTtcbkhhc2gucHJvdG90eXBlLmdldCA9IGhhc2hHZXQ7XG5IYXNoLnByb3RvdHlwZS5oYXMgPSBoYXNoSGFzO1xuSGFzaC5wcm90b3R5cGUuc2V0ID0gaGFzaFNldDtcblxuZXhwb3J0IGRlZmF1bHQgSGFzaDtcbiIsIi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgbGlzdCBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBbXTtcbiAgdGhpcy5zaXplID0gMDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbGlzdENhY2hlQ2xlYXI7XG4iLCJpbXBvcnQgZXEgZnJvbSAnLi9lcS5qcyc7XG5cbi8qKlxuICogR2V0cyB0aGUgaW5kZXggYXQgd2hpY2ggdGhlIGBrZXlgIGlzIGZvdW5kIGluIGBhcnJheWAgb2Yga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Kn0ga2V5IFRoZSBrZXkgdG8gc2VhcmNoIGZvci5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG4gKi9cbmZ1bmN0aW9uIGFzc29jSW5kZXhPZihhcnJheSwga2V5KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG4gIHdoaWxlIChsZW5ndGgtLSkge1xuICAgIGlmIChlcShhcnJheVtsZW5ndGhdWzBdLCBrZXkpKSB7XG4gICAgICByZXR1cm4gbGVuZ3RoO1xuICAgIH1cbiAgfVxuICByZXR1cm4gLTE7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzc29jSW5kZXhPZjtcbiIsImltcG9ydCBhc3NvY0luZGV4T2YgZnJvbSAnLi9fYXNzb2NJbmRleE9mLmpzJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHNwbGljZSA9IGFycmF5UHJvdG8uc3BsaWNlO1xuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBsaXN0IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVEZWxldGUoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgaWYgKGluZGV4IDwgMCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgbGFzdEluZGV4ID0gZGF0YS5sZW5ndGggLSAxO1xuICBpZiAoaW5kZXggPT0gbGFzdEluZGV4KSB7XG4gICAgZGF0YS5wb3AoKTtcbiAgfSBlbHNlIHtcbiAgICBzcGxpY2UuY2FsbChkYXRhLCBpbmRleCwgMSk7XG4gIH1cbiAgLS10aGlzLnNpemU7XG4gIHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgZGVmYXVsdCBsaXN0Q2FjaGVEZWxldGU7XG4iLCJpbXBvcnQgYXNzb2NJbmRleE9mIGZyb20gJy4vX2Fzc29jSW5kZXhPZi5qcyc7XG5cbi8qKlxuICogR2V0cyB0aGUgbGlzdCBjYWNoZSB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUdldChrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICByZXR1cm4gaW5kZXggPCAwID8gdW5kZWZpbmVkIDogZGF0YVtpbmRleF1bMV07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGxpc3RDYWNoZUdldDtcbiIsImltcG9ydCBhc3NvY0luZGV4T2YgZnJvbSAnLi9fYXNzb2NJbmRleE9mLmpzJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYSBsaXN0IGNhY2hlIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUhhcyhrZXkpIHtcbiAgcmV0dXJuIGFzc29jSW5kZXhPZih0aGlzLl9fZGF0YV9fLCBrZXkpID4gLTE7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGxpc3RDYWNoZUhhcztcbiIsImltcG9ydCBhc3NvY0luZGV4T2YgZnJvbSAnLi9fYXNzb2NJbmRleE9mLmpzJztcblxuLyoqXG4gKiBTZXRzIHRoZSBsaXN0IGNhY2hlIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBsaXN0IGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIGlmIChpbmRleCA8IDApIHtcbiAgICArK3RoaXMuc2l6ZTtcbiAgICBkYXRhLnB1c2goW2tleSwgdmFsdWVdKTtcbiAgfSBlbHNlIHtcbiAgICBkYXRhW2luZGV4XVsxXSA9IHZhbHVlO1xuICB9XG4gIHJldHVybiB0aGlzO1xufVxuXG5leHBvcnQgZGVmYXVsdCBsaXN0Q2FjaGVTZXQ7XG4iLCJpbXBvcnQgbGlzdENhY2hlQ2xlYXIgZnJvbSAnLi9fbGlzdENhY2hlQ2xlYXIuanMnO1xuaW1wb3J0IGxpc3RDYWNoZURlbGV0ZSBmcm9tICcuL19saXN0Q2FjaGVEZWxldGUuanMnO1xuaW1wb3J0IGxpc3RDYWNoZUdldCBmcm9tICcuL19saXN0Q2FjaGVHZXQuanMnO1xuaW1wb3J0IGxpc3RDYWNoZUhhcyBmcm9tICcuL19saXN0Q2FjaGVIYXMuanMnO1xuaW1wb3J0IGxpc3RDYWNoZVNldCBmcm9tICcuL19saXN0Q2FjaGVTZXQuanMnO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gbGlzdCBjYWNoZSBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIExpc3RDYWNoZShlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBMaXN0Q2FjaGVgLlxuTGlzdENhY2hlLnByb3RvdHlwZS5jbGVhciA9IGxpc3RDYWNoZUNsZWFyO1xuTGlzdENhY2hlLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBsaXN0Q2FjaGVEZWxldGU7XG5MaXN0Q2FjaGUucHJvdG90eXBlLmdldCA9IGxpc3RDYWNoZUdldDtcbkxpc3RDYWNoZS5wcm90b3R5cGUuaGFzID0gbGlzdENhY2hlSGFzO1xuTGlzdENhY2hlLnByb3RvdHlwZS5zZXQgPSBsaXN0Q2FjaGVTZXQ7XG5cbmV4cG9ydCBkZWZhdWx0IExpc3RDYWNoZTtcbiIsImltcG9ydCBnZXROYXRpdmUgZnJvbSAnLi9fZ2V0TmF0aXZlLmpzJztcbmltcG9ydCByb290IGZyb20gJy4vX3Jvb3QuanMnO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgTWFwID0gZ2V0TmF0aXZlKHJvb3QsICdNYXAnKTtcblxuZXhwb3J0IGRlZmF1bHQgTWFwO1xuIiwiaW1wb3J0IEhhc2ggZnJvbSAnLi9fSGFzaC5qcyc7XG5pbXBvcnQgTGlzdENhY2hlIGZyb20gJy4vX0xpc3RDYWNoZS5qcyc7XG5pbXBvcnQgTWFwIGZyb20gJy4vX01hcC5qcyc7XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgbWFwLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlQ2xlYXIoKSB7XG4gIHRoaXMuc2l6ZSA9IDA7XG4gIHRoaXMuX19kYXRhX18gPSB7XG4gICAgJ2hhc2gnOiBuZXcgSGFzaCxcbiAgICAnbWFwJzogbmV3IChNYXAgfHwgTGlzdENhY2hlKSxcbiAgICAnc3RyaW5nJzogbmV3IEhhc2hcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWFwQ2FjaGVDbGVhcjtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgc3VpdGFibGUgZm9yIHVzZSBhcyB1bmlxdWUgb2JqZWN0IGtleS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBzdWl0YWJsZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0tleWFibGUodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiAodHlwZSA9PSAnc3RyaW5nJyB8fCB0eXBlID09ICdudW1iZXInIHx8IHR5cGUgPT0gJ3N5bWJvbCcgfHwgdHlwZSA9PSAnYm9vbGVhbicpXG4gICAgPyAodmFsdWUgIT09ICdfX3Byb3RvX18nKVxuICAgIDogKHZhbHVlID09PSBudWxsKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaXNLZXlhYmxlO1xuIiwiaW1wb3J0IGlzS2V5YWJsZSBmcm9tICcuL19pc0tleWFibGUuanMnO1xuXG4vKipcbiAqIEdldHMgdGhlIGRhdGEgZm9yIGBtYXBgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gbWFwIFRoZSBtYXAgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSByZWZlcmVuY2Uga2V5LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIG1hcCBkYXRhLlxuICovXG5mdW5jdGlvbiBnZXRNYXBEYXRhKG1hcCwga2V5KSB7XG4gIHZhciBkYXRhID0gbWFwLl9fZGF0YV9fO1xuICByZXR1cm4gaXNLZXlhYmxlKGtleSlcbiAgICA/IGRhdGFbdHlwZW9mIGtleSA9PSAnc3RyaW5nJyA/ICdzdHJpbmcnIDogJ2hhc2gnXVxuICAgIDogZGF0YS5tYXA7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldE1hcERhdGE7XG4iLCJpbXBvcnQgZ2V0TWFwRGF0YSBmcm9tICcuL19nZXRNYXBEYXRhLmpzJztcblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgbWFwLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlRGVsZXRlKGtleSkge1xuICB2YXIgcmVzdWx0ID0gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpWydkZWxldGUnXShrZXkpO1xuICB0aGlzLnNpemUgLT0gcmVzdWx0ID8gMSA6IDA7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG1hcENhY2hlRGVsZXRlO1xuIiwiaW1wb3J0IGdldE1hcERhdGEgZnJvbSAnLi9fZ2V0TWFwRGF0YS5qcyc7XG5cbi8qKlxuICogR2V0cyB0aGUgbWFwIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUdldChrZXkpIHtcbiAgcmV0dXJuIGdldE1hcERhdGEodGhpcywga2V5KS5nZXQoa2V5KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWFwQ2FjaGVHZXQ7XG4iLCJpbXBvcnQgZ2V0TWFwRGF0YSBmcm9tICcuL19nZXRNYXBEYXRhLmpzJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYSBtYXAgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUhhcyhrZXkpIHtcbiAgcmV0dXJuIGdldE1hcERhdGEodGhpcywga2V5KS5oYXMoa2V5KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWFwQ2FjaGVIYXM7XG4iLCJpbXBvcnQgZ2V0TWFwRGF0YSBmcm9tICcuL19nZXRNYXBEYXRhLmpzJztcblxuLyoqXG4gKiBTZXRzIHRoZSBtYXAgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbWFwIGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZVNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpLFxuICAgICAgc2l6ZSA9IGRhdGEuc2l6ZTtcblxuICBkYXRhLnNldChrZXksIHZhbHVlKTtcbiAgdGhpcy5zaXplICs9IGRhdGEuc2l6ZSA9PSBzaXplID8gMCA6IDE7XG4gIHJldHVybiB0aGlzO1xufVxuXG5leHBvcnQgZGVmYXVsdCBtYXBDYWNoZVNldDtcbiIsImltcG9ydCBtYXBDYWNoZUNsZWFyIGZyb20gJy4vX21hcENhY2hlQ2xlYXIuanMnO1xuaW1wb3J0IG1hcENhY2hlRGVsZXRlIGZyb20gJy4vX21hcENhY2hlRGVsZXRlLmpzJztcbmltcG9ydCBtYXBDYWNoZUdldCBmcm9tICcuL19tYXBDYWNoZUdldC5qcyc7XG5pbXBvcnQgbWFwQ2FjaGVIYXMgZnJvbSAnLi9fbWFwQ2FjaGVIYXMuanMnO1xuaW1wb3J0IG1hcENhY2hlU2V0IGZyb20gJy4vX21hcENhY2hlU2V0LmpzJztcblxuLyoqXG4gKiBDcmVhdGVzIGEgbWFwIGNhY2hlIG9iamVjdCB0byBzdG9yZSBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIE1hcENhY2hlKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID09IG51bGwgPyAwIDogZW50cmllcy5sZW5ndGg7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYE1hcENhY2hlYC5cbk1hcENhY2hlLnByb3RvdHlwZS5jbGVhciA9IG1hcENhY2hlQ2xlYXI7XG5NYXBDYWNoZS5wcm90b3R5cGVbJ2RlbGV0ZSddID0gbWFwQ2FjaGVEZWxldGU7XG5NYXBDYWNoZS5wcm90b3R5cGUuZ2V0ID0gbWFwQ2FjaGVHZXQ7XG5NYXBDYWNoZS5wcm90b3R5cGUuaGFzID0gbWFwQ2FjaGVIYXM7XG5NYXBDYWNoZS5wcm90b3R5cGUuc2V0ID0gbWFwQ2FjaGVTZXQ7XG5cbmV4cG9ydCBkZWZhdWx0IE1hcENhY2hlO1xuIiwiaW1wb3J0IG92ZXJBcmcgZnJvbSAnLi9fb3ZlckFyZy5qcyc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIGdldFByb3RvdHlwZSA9IG92ZXJBcmcoT2JqZWN0LmdldFByb3RvdHlwZU9mLCBPYmplY3QpO1xuXG5leHBvcnQgZGVmYXVsdCBnZXRQcm90b3R5cGU7XG4iLCJpbXBvcnQgYmFzZUdldFRhZyBmcm9tICcuL19iYXNlR2V0VGFnLmpzJztcbmltcG9ydCBnZXRQcm90b3R5cGUgZnJvbSAnLi9fZ2V0UHJvdG90eXBlLmpzJztcbmltcG9ydCBpc09iamVjdExpa2UgZnJvbSAnLi9pc09iamVjdExpa2UuanMnO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XSc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBmdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGUsXG4gICAgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byByZXNvbHZlIHRoZSBkZWNvbXBpbGVkIHNvdXJjZSBvZiBmdW5jdGlvbnMuICovXG52YXIgZnVuY1RvU3RyaW5nID0gZnVuY1Byb3RvLnRvU3RyaW5nO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKiogVXNlZCB0byBpbmZlciB0aGUgYE9iamVjdGAgY29uc3RydWN0b3IuICovXG52YXIgb2JqZWN0Q3RvclN0cmluZyA9IGZ1bmNUb1N0cmluZy5jYWxsKE9iamVjdCk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBwbGFpbiBvYmplY3QsIHRoYXQgaXMsIGFuIG9iamVjdCBjcmVhdGVkIGJ5IHRoZVxuICogYE9iamVjdGAgY29uc3RydWN0b3Igb3Igb25lIHdpdGggYSBgW1tQcm90b3R5cGVdXWAgb2YgYG51bGxgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC44LjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgcGxhaW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5hID0gMTtcbiAqIH1cbiAqXG4gKiBfLmlzUGxhaW5PYmplY3QobmV3IEZvbyk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNQbGFpbk9iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzUGxhaW5PYmplY3QoeyAneCc6IDAsICd5JzogMCB9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzUGxhaW5PYmplY3QoT2JqZWN0LmNyZWF0ZShudWxsKSk7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGlzUGxhaW5PYmplY3QodmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdExpa2UodmFsdWUpIHx8IGJhc2VHZXRUYWcodmFsdWUpICE9IG9iamVjdFRhZykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgcHJvdG8gPSBnZXRQcm90b3R5cGUodmFsdWUpO1xuICBpZiAocHJvdG8gPT09IG51bGwpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICB2YXIgQ3RvciA9IGhhc093blByb3BlcnR5LmNhbGwocHJvdG8sICdjb25zdHJ1Y3RvcicpICYmIHByb3RvLmNvbnN0cnVjdG9yO1xuICByZXR1cm4gdHlwZW9mIEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBDdG9yIGluc3RhbmNlb2YgQ3RvciAmJlxuICAgIGZ1bmNUb1N0cmluZy5jYWxsKEN0b3IpID09IG9iamVjdEN0b3JTdHJpbmc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzUGxhaW5PYmplY3Q7XG4iLCJpbXBvcnQgTGlzdENhY2hlIGZyb20gJy4vX0xpc3RDYWNoZS5qcyc7XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgc3RhY2suXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqL1xuZnVuY3Rpb24gc3RhY2tDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IG5ldyBMaXN0Q2FjaGU7XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHN0YWNrQ2xlYXI7XG4iLCIvKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBzdGFjay5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBzdGFja0RlbGV0ZShrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgcmVzdWx0ID0gZGF0YVsnZGVsZXRlJ10oa2V5KTtcblxuICB0aGlzLnNpemUgPSBkYXRhLnNpemU7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHN0YWNrRGVsZXRlO1xuIiwiLyoqXG4gKiBHZXRzIHRoZSBzdGFjayB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gc3RhY2tHZXQoa2V5KSB7XG4gIHJldHVybiB0aGlzLl9fZGF0YV9fLmdldChrZXkpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBzdGFja0dldDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGEgc3RhY2sgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBzdGFja0hhcyhrZXkpIHtcbiAgcmV0dXJuIHRoaXMuX19kYXRhX18uaGFzKGtleSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHN0YWNrSGFzO1xuIiwiaW1wb3J0IExpc3RDYWNoZSBmcm9tICcuL19MaXN0Q2FjaGUuanMnO1xuaW1wb3J0IE1hcCBmcm9tICcuL19NYXAuanMnO1xuaW1wb3J0IE1hcENhY2hlIGZyb20gJy4vX01hcENhY2hlLmpzJztcblxuLyoqIFVzZWQgYXMgdGhlIHNpemUgdG8gZW5hYmxlIGxhcmdlIGFycmF5IG9wdGltaXphdGlvbnMuICovXG52YXIgTEFSR0VfQVJSQVlfU0laRSA9IDIwMDtcblxuLyoqXG4gKiBTZXRzIHRoZSBzdGFjayBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBzdGFjayBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gc3RhY2tTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIGlmIChkYXRhIGluc3RhbmNlb2YgTGlzdENhY2hlKSB7XG4gICAgdmFyIHBhaXJzID0gZGF0YS5fX2RhdGFfXztcbiAgICBpZiAoIU1hcCB8fCAocGFpcnMubGVuZ3RoIDwgTEFSR0VfQVJSQVlfU0laRSAtIDEpKSB7XG4gICAgICBwYWlycy5wdXNoKFtrZXksIHZhbHVlXSk7XG4gICAgICB0aGlzLnNpemUgPSArK2RhdGEuc2l6ZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBkYXRhID0gdGhpcy5fX2RhdGFfXyA9IG5ldyBNYXBDYWNoZShwYWlycyk7XG4gIH1cbiAgZGF0YS5zZXQoa2V5LCB2YWx1ZSk7XG4gIHRoaXMuc2l6ZSA9IGRhdGEuc2l6ZTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHN0YWNrU2V0O1xuIiwiaW1wb3J0IExpc3RDYWNoZSBmcm9tICcuL19MaXN0Q2FjaGUuanMnO1xuaW1wb3J0IHN0YWNrQ2xlYXIgZnJvbSAnLi9fc3RhY2tDbGVhci5qcyc7XG5pbXBvcnQgc3RhY2tEZWxldGUgZnJvbSAnLi9fc3RhY2tEZWxldGUuanMnO1xuaW1wb3J0IHN0YWNrR2V0IGZyb20gJy4vX3N0YWNrR2V0LmpzJztcbmltcG9ydCBzdGFja0hhcyBmcm9tICcuL19zdGFja0hhcy5qcyc7XG5pbXBvcnQgc3RhY2tTZXQgZnJvbSAnLi9fc3RhY2tTZXQuanMnO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBzdGFjayBjYWNoZSBvYmplY3QgdG8gc3RvcmUga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBTdGFjayhlbnRyaWVzKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyA9IG5ldyBMaXN0Q2FjaGUoZW50cmllcyk7XG4gIHRoaXMuc2l6ZSA9IGRhdGEuc2l6ZTtcbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYFN0YWNrYC5cblN0YWNrLnByb3RvdHlwZS5jbGVhciA9IHN0YWNrQ2xlYXI7XG5TdGFjay5wcm90b3R5cGVbJ2RlbGV0ZSddID0gc3RhY2tEZWxldGU7XG5TdGFjay5wcm90b3R5cGUuZ2V0ID0gc3RhY2tHZXQ7XG5TdGFjay5wcm90b3R5cGUuaGFzID0gc3RhY2tIYXM7XG5TdGFjay5wcm90b3R5cGUuc2V0ID0gc3RhY2tTZXQ7XG5cbmV4cG9ydCBkZWZhdWx0IFN0YWNrO1xuIiwiaW1wb3J0IHJvb3QgZnJvbSAnLi9fcm9vdC5qcyc7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG52YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbnZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbi8qKiBEZXRlY3QgdGhlIHBvcHVsYXIgQ29tbW9uSlMgZXh0ZW5zaW9uIGBtb2R1bGUuZXhwb3J0c2AuICovXG52YXIgbW9kdWxlRXhwb3J0cyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5leHBvcnRzID09PSBmcmVlRXhwb3J0cztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgQnVmZmVyID0gbW9kdWxlRXhwb3J0cyA/IHJvb3QuQnVmZmVyIDogdW5kZWZpbmVkLFxuICAgIGFsbG9jVW5zYWZlID0gQnVmZmVyID8gQnVmZmVyLmFsbG9jVW5zYWZlIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiAgYGJ1ZmZlcmAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QnVmZmVyfSBidWZmZXIgVGhlIGJ1ZmZlciB0byBjbG9uZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGVlcF0gU3BlY2lmeSBhIGRlZXAgY2xvbmUuXG4gKiBAcmV0dXJucyB7QnVmZmVyfSBSZXR1cm5zIHRoZSBjbG9uZWQgYnVmZmVyLlxuICovXG5mdW5jdGlvbiBjbG9uZUJ1ZmZlcihidWZmZXIsIGlzRGVlcCkge1xuICBpZiAoaXNEZWVwKSB7XG4gICAgcmV0dXJuIGJ1ZmZlci5zbGljZSgpO1xuICB9XG4gIHZhciBsZW5ndGggPSBidWZmZXIubGVuZ3RoLFxuICAgICAgcmVzdWx0ID0gYWxsb2NVbnNhZmUgPyBhbGxvY1Vuc2FmZShsZW5ndGgpIDogbmV3IGJ1ZmZlci5jb25zdHJ1Y3RvcihsZW5ndGgpO1xuXG4gIGJ1ZmZlci5jb3B5KHJlc3VsdCk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsb25lQnVmZmVyO1xuIiwiaW1wb3J0IHJvb3QgZnJvbSAnLi9fcm9vdC5qcyc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIFVpbnQ4QXJyYXkgPSByb290LlVpbnQ4QXJyYXk7XG5cbmV4cG9ydCBkZWZhdWx0IFVpbnQ4QXJyYXk7XG4iLCJpbXBvcnQgVWludDhBcnJheSBmcm9tICcuL19VaW50OEFycmF5LmpzJztcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgYGFycmF5QnVmZmVyYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheUJ1ZmZlcn0gYXJyYXlCdWZmZXIgVGhlIGFycmF5IGJ1ZmZlciB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHtBcnJheUJ1ZmZlcn0gUmV0dXJucyB0aGUgY2xvbmVkIGFycmF5IGJ1ZmZlci5cbiAqL1xuZnVuY3Rpb24gY2xvbmVBcnJheUJ1ZmZlcihhcnJheUJ1ZmZlcikge1xuICB2YXIgcmVzdWx0ID0gbmV3IGFycmF5QnVmZmVyLmNvbnN0cnVjdG9yKGFycmF5QnVmZmVyLmJ5dGVMZW5ndGgpO1xuICBuZXcgVWludDhBcnJheShyZXN1bHQpLnNldChuZXcgVWludDhBcnJheShhcnJheUJ1ZmZlcikpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbG9uZUFycmF5QnVmZmVyO1xuIiwiaW1wb3J0IGNsb25lQXJyYXlCdWZmZXIgZnJvbSAnLi9fY2xvbmVBcnJheUJ1ZmZlci5qcyc7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIGB0eXBlZEFycmF5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHR5cGVkQXJyYXkgVGhlIHR5cGVkIGFycmF5IHRvIGNsb25lLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNsb25lZCB0eXBlZCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gY2xvbmVUeXBlZEFycmF5KHR5cGVkQXJyYXksIGlzRGVlcCkge1xuICB2YXIgYnVmZmVyID0gaXNEZWVwID8gY2xvbmVBcnJheUJ1ZmZlcih0eXBlZEFycmF5LmJ1ZmZlcikgOiB0eXBlZEFycmF5LmJ1ZmZlcjtcbiAgcmV0dXJuIG5ldyB0eXBlZEFycmF5LmNvbnN0cnVjdG9yKGJ1ZmZlciwgdHlwZWRBcnJheS5ieXRlT2Zmc2V0LCB0eXBlZEFycmF5Lmxlbmd0aCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsb25lVHlwZWRBcnJheTtcbiIsImltcG9ydCBiYXNlQ3JlYXRlIGZyb20gJy4vX2Jhc2VDcmVhdGUuanMnO1xuaW1wb3J0IGdldFByb3RvdHlwZSBmcm9tICcuL19nZXRQcm90b3R5cGUuanMnO1xuaW1wb3J0IGlzUHJvdG90eXBlIGZyb20gJy4vX2lzUHJvdG90eXBlLmpzJztcblxuLyoqXG4gKiBJbml0aWFsaXplcyBhbiBvYmplY3QgY2xvbmUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGluaXRpYWxpemVkIGNsb25lLlxuICovXG5mdW5jdGlvbiBpbml0Q2xvbmVPYmplY3Qob2JqZWN0KSB7XG4gIHJldHVybiAodHlwZW9mIG9iamVjdC5jb25zdHJ1Y3RvciA9PSAnZnVuY3Rpb24nICYmICFpc1Byb3RvdHlwZShvYmplY3QpKVxuICAgID8gYmFzZUNyZWF0ZShnZXRQcm90b3R5cGUob2JqZWN0KSlcbiAgICA6IHt9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBpbml0Q2xvbmVPYmplY3Q7XG4iLCIvKipcbiAqIENyZWF0ZXMgYSBiYXNlIGZ1bmN0aW9uIGZvciBtZXRob2RzIGxpa2UgYF8uZm9ySW5gIGFuZCBgXy5mb3JPd25gLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtmcm9tUmlnaHRdIFNwZWNpZnkgaXRlcmF0aW5nIGZyb20gcmlnaHQgdG8gbGVmdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGJhc2UgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUJhc2VGb3IoZnJvbVJpZ2h0KSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QsIGl0ZXJhdGVlLCBrZXlzRnVuYykge1xuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICBpdGVyYWJsZSA9IE9iamVjdChvYmplY3QpLFxuICAgICAgICBwcm9wcyA9IGtleXNGdW5jKG9iamVjdCksXG4gICAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aDtcblxuICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgdmFyIGtleSA9IHByb3BzW2Zyb21SaWdodCA/IGxlbmd0aCA6ICsraW5kZXhdO1xuICAgICAgaWYgKGl0ZXJhdGVlKGl0ZXJhYmxlW2tleV0sIGtleSwgaXRlcmFibGUpID09PSBmYWxzZSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlQmFzZUZvcjtcbiIsImltcG9ydCBjcmVhdGVCYXNlRm9yIGZyb20gJy4vX2NyZWF0ZUJhc2VGb3IuanMnO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBiYXNlRm9yT3duYCB3aGljaCBpdGVyYXRlcyBvdmVyIGBvYmplY3RgXG4gKiBwcm9wZXJ0aWVzIHJldHVybmVkIGJ5IGBrZXlzRnVuY2AgYW5kIGludm9rZXMgYGl0ZXJhdGVlYCBmb3IgZWFjaCBwcm9wZXJ0eS5cbiAqIEl0ZXJhdGVlIGZ1bmN0aW9ucyBtYXkgZXhpdCBpdGVyYXRpb24gZWFybHkgYnkgZXhwbGljaXRseSByZXR1cm5pbmcgYGZhbHNlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBrZXlzRnVuYyBUaGUgZnVuY3Rpb24gdG8gZ2V0IHRoZSBrZXlzIG9mIGBvYmplY3RgLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xudmFyIGJhc2VGb3IgPSBjcmVhdGVCYXNlRm9yKCk7XG5cbmV4cG9ydCBkZWZhdWx0IGJhc2VGb3I7XG4iLCJpbXBvcnQgYmFzZUZvciBmcm9tICcuL19iYXNlRm9yLmpzJztcbmltcG9ydCBrZXlzIGZyb20gJy4va2V5cy5qcyc7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZm9yT3duYCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gYmFzZUZvck93bihvYmplY3QsIGl0ZXJhdGVlKSB7XG4gIHJldHVybiBvYmplY3QgJiYgYmFzZUZvcihvYmplY3QsIGl0ZXJhdGVlLCBrZXlzKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYmFzZUZvck93bjtcbiIsImltcG9ydCBpc0FycmF5TGlrZSBmcm9tICcuL2lzQXJyYXlMaWtlLmpzJztcblxuLyoqXG4gKiBDcmVhdGVzIGEgYGJhc2VFYWNoYCBvciBgYmFzZUVhY2hSaWdodGAgZnVuY3Rpb24uXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVhY2hGdW5jIFRoZSBmdW5jdGlvbiB0byBpdGVyYXRlIG92ZXIgYSBjb2xsZWN0aW9uLlxuICogQHBhcmFtIHtib29sZWFufSBbZnJvbVJpZ2h0XSBTcGVjaWZ5IGl0ZXJhdGluZyBmcm9tIHJpZ2h0IHRvIGxlZnQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBiYXNlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVCYXNlRWFjaChlYWNoRnVuYywgZnJvbVJpZ2h0KSB7XG4gIHJldHVybiBmdW5jdGlvbihjb2xsZWN0aW9uLCBpdGVyYXRlZSkge1xuICAgIGlmIChjb2xsZWN0aW9uID09IG51bGwpIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uO1xuICAgIH1cbiAgICBpZiAoIWlzQXJyYXlMaWtlKGNvbGxlY3Rpb24pKSB7XG4gICAgICByZXR1cm4gZWFjaEZ1bmMoY29sbGVjdGlvbiwgaXRlcmF0ZWUpO1xuICAgIH1cbiAgICB2YXIgbGVuZ3RoID0gY29sbGVjdGlvbi5sZW5ndGgsXG4gICAgICAgIGluZGV4ID0gZnJvbVJpZ2h0ID8gbGVuZ3RoIDogLTEsXG4gICAgICAgIGl0ZXJhYmxlID0gT2JqZWN0KGNvbGxlY3Rpb24pO1xuXG4gICAgd2hpbGUgKChmcm9tUmlnaHQgPyBpbmRleC0tIDogKytpbmRleCA8IGxlbmd0aCkpIHtcbiAgICAgIGlmIChpdGVyYXRlZShpdGVyYWJsZVtpbmRleF0sIGluZGV4LCBpdGVyYWJsZSkgPT09IGZhbHNlKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlQmFzZUVhY2g7XG4iLCJpbXBvcnQgYmFzZUZvck93biBmcm9tICcuL19iYXNlRm9yT3duLmpzJztcbmltcG9ydCBjcmVhdGVCYXNlRWFjaCBmcm9tICcuL19jcmVhdGVCYXNlRWFjaC5qcyc7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZm9yRWFjaGAgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fE9iamVjdH0gUmV0dXJucyBgY29sbGVjdGlvbmAuXG4gKi9cbnZhciBiYXNlRWFjaCA9IGNyZWF0ZUJhc2VFYWNoKGJhc2VGb3JPd24pO1xuXG5leHBvcnQgZGVmYXVsdCBiYXNlRWFjaDtcbiIsImltcG9ydCBiYXNlQXNzaWduVmFsdWUgZnJvbSAnLi9fYmFzZUFzc2lnblZhbHVlLmpzJztcbmltcG9ydCBlcSBmcm9tICcuL2VxLmpzJztcblxuLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIGxpa2UgYGFzc2lnblZhbHVlYCBleGNlcHQgdGhhdCBpdCBkb2Vzbid0IGFzc2lnblxuICogYHVuZGVmaW5lZGAgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBhc3NpZ24uXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBhc3NpZ24uXG4gKi9cbmZ1bmN0aW9uIGFzc2lnbk1lcmdlVmFsdWUob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIGlmICgodmFsdWUgIT09IHVuZGVmaW5lZCAmJiAhZXEob2JqZWN0W2tleV0sIHZhbHVlKSkgfHxcbiAgICAgICh2YWx1ZSA9PT0gdW5kZWZpbmVkICYmICEoa2V5IGluIG9iamVjdCkpKSB7XG4gICAgYmFzZUFzc2lnblZhbHVlKG9iamVjdCwga2V5LCB2YWx1ZSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgYXNzaWduTWVyZ2VWYWx1ZTtcbiIsImltcG9ydCBpc0FycmF5TGlrZSBmcm9tICcuL2lzQXJyYXlMaWtlLmpzJztcbmltcG9ydCBpc09iamVjdExpa2UgZnJvbSAnLi9pc09iamVjdExpa2UuanMnO1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8uaXNBcnJheUxpa2VgIGV4Y2VwdCB0aGF0IGl0IGFsc28gY2hlY2tzIGlmIGB2YWx1ZWBcbiAqIGlzIGFuIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBhcnJheS1saWtlIG9iamVjdCxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheUxpa2VPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlT2JqZWN0KGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2VPYmplY3QoJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXlMaWtlT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5TGlrZU9iamVjdCh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBpc0FycmF5TGlrZSh2YWx1ZSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzQXJyYXlMaWtlT2JqZWN0O1xuIiwiLyoqXG4gKiBHZXRzIHRoZSB2YWx1ZSBhdCBga2V5YCwgdW5sZXNzIGBrZXlgIGlzIFwiX19wcm90b19fXCIgb3IgXCJjb25zdHJ1Y3RvclwiLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBwcm9wZXJ0eSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gc2FmZUdldChvYmplY3QsIGtleSkge1xuICBpZiAoa2V5ID09PSAnY29uc3RydWN0b3InICYmIHR5cGVvZiBvYmplY3Rba2V5XSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChrZXkgPT0gJ19fcHJvdG9fXycpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICByZXR1cm4gb2JqZWN0W2tleV07XG59XG5cbmV4cG9ydCBkZWZhdWx0IHNhZmVHZXQ7XG4iLCJpbXBvcnQgY29weU9iamVjdCBmcm9tICcuL19jb3B5T2JqZWN0LmpzJztcbmltcG9ydCBrZXlzSW4gZnJvbSAnLi9rZXlzSW4uanMnO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBwbGFpbiBvYmplY3QgZmxhdHRlbmluZyBpbmhlcml0ZWQgZW51bWVyYWJsZSBzdHJpbmdcbiAqIGtleWVkIHByb3BlcnRpZXMgb2YgYHZhbHVlYCB0byBvd24gcHJvcGVydGllcyBvZiB0aGUgcGxhaW4gb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY29udmVydGVkIHBsYWluIG9iamVjdC5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy5hc3NpZ24oeyAnYSc6IDEgfSwgbmV3IEZvbyk7XG4gKiAvLyA9PiB7ICdhJzogMSwgJ2InOiAyIH1cbiAqXG4gKiBfLmFzc2lnbih7ICdhJzogMSB9LCBfLnRvUGxhaW5PYmplY3QobmV3IEZvbykpO1xuICogLy8gPT4geyAnYSc6IDEsICdiJzogMiwgJ2MnOiAzIH1cbiAqL1xuZnVuY3Rpb24gdG9QbGFpbk9iamVjdCh2YWx1ZSkge1xuICByZXR1cm4gY29weU9iamVjdCh2YWx1ZSwga2V5c0luKHZhbHVlKSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHRvUGxhaW5PYmplY3Q7XG4iLCJpbXBvcnQgYXNzaWduTWVyZ2VWYWx1ZSBmcm9tICcuL19hc3NpZ25NZXJnZVZhbHVlLmpzJztcbmltcG9ydCBjbG9uZUJ1ZmZlciBmcm9tICcuL19jbG9uZUJ1ZmZlci5qcyc7XG5pbXBvcnQgY2xvbmVUeXBlZEFycmF5IGZyb20gJy4vX2Nsb25lVHlwZWRBcnJheS5qcyc7XG5pbXBvcnQgY29weUFycmF5IGZyb20gJy4vX2NvcHlBcnJheS5qcyc7XG5pbXBvcnQgaW5pdENsb25lT2JqZWN0IGZyb20gJy4vX2luaXRDbG9uZU9iamVjdC5qcyc7XG5pbXBvcnQgaXNBcmd1bWVudHMgZnJvbSAnLi9pc0FyZ3VtZW50cy5qcyc7XG5pbXBvcnQgaXNBcnJheSBmcm9tICcuL2lzQXJyYXkuanMnO1xuaW1wb3J0IGlzQXJyYXlMaWtlT2JqZWN0IGZyb20gJy4vaXNBcnJheUxpa2VPYmplY3QuanMnO1xuaW1wb3J0IGlzQnVmZmVyIGZyb20gJy4vaXNCdWZmZXIuanMnO1xuaW1wb3J0IGlzRnVuY3Rpb24gZnJvbSAnLi9pc0Z1bmN0aW9uLmpzJztcbmltcG9ydCBpc09iamVjdCBmcm9tICcuL2lzT2JqZWN0LmpzJztcbmltcG9ydCBpc1BsYWluT2JqZWN0IGZyb20gJy4vaXNQbGFpbk9iamVjdC5qcyc7XG5pbXBvcnQgaXNUeXBlZEFycmF5IGZyb20gJy4vaXNUeXBlZEFycmF5LmpzJztcbmltcG9ydCBzYWZlR2V0IGZyb20gJy4vX3NhZmVHZXQuanMnO1xuaW1wb3J0IHRvUGxhaW5PYmplY3QgZnJvbSAnLi90b1BsYWluT2JqZWN0LmpzJztcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VNZXJnZWAgZm9yIGFycmF5cyBhbmQgb2JqZWN0cyB3aGljaCBwZXJmb3Jtc1xuICogZGVlcCBtZXJnZXMgYW5kIHRyYWNrcyB0cmF2ZXJzZWQgb2JqZWN0cyBlbmFibGluZyBvYmplY3RzIHdpdGggY2lyY3VsYXJcbiAqIHJlZmVyZW5jZXMgdG8gYmUgbWVyZ2VkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBtZXJnZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBzcmNJbmRleCBUaGUgaW5kZXggb2YgYHNvdXJjZWAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBtZXJnZUZ1bmMgVGhlIGZ1bmN0aW9uIHRvIG1lcmdlIHZhbHVlcy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGFzc2lnbmVkIHZhbHVlcy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbc3RhY2tdIFRyYWNrcyB0cmF2ZXJzZWQgc291cmNlIHZhbHVlcyBhbmQgdGhlaXIgbWVyZ2VkXG4gKiAgY291bnRlcnBhcnRzLlxuICovXG5mdW5jdGlvbiBiYXNlTWVyZ2VEZWVwKG9iamVjdCwgc291cmNlLCBrZXksIHNyY0luZGV4LCBtZXJnZUZ1bmMsIGN1c3RvbWl6ZXIsIHN0YWNrKSB7XG4gIHZhciBvYmpWYWx1ZSA9IHNhZmVHZXQob2JqZWN0LCBrZXkpLFxuICAgICAgc3JjVmFsdWUgPSBzYWZlR2V0KHNvdXJjZSwga2V5KSxcbiAgICAgIHN0YWNrZWQgPSBzdGFjay5nZXQoc3JjVmFsdWUpO1xuXG4gIGlmIChzdGFja2VkKSB7XG4gICAgYXNzaWduTWVyZ2VWYWx1ZShvYmplY3QsIGtleSwgc3RhY2tlZCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBuZXdWYWx1ZSA9IGN1c3RvbWl6ZXJcbiAgICA/IGN1c3RvbWl6ZXIob2JqVmFsdWUsIHNyY1ZhbHVlLCAoa2V5ICsgJycpLCBvYmplY3QsIHNvdXJjZSwgc3RhY2spXG4gICAgOiB1bmRlZmluZWQ7XG5cbiAgdmFyIGlzQ29tbW9uID0gbmV3VmFsdWUgPT09IHVuZGVmaW5lZDtcblxuICBpZiAoaXNDb21tb24pIHtcbiAgICB2YXIgaXNBcnIgPSBpc0FycmF5KHNyY1ZhbHVlKSxcbiAgICAgICAgaXNCdWZmID0gIWlzQXJyICYmIGlzQnVmZmVyKHNyY1ZhbHVlKSxcbiAgICAgICAgaXNUeXBlZCA9ICFpc0FyciAmJiAhaXNCdWZmICYmIGlzVHlwZWRBcnJheShzcmNWYWx1ZSk7XG5cbiAgICBuZXdWYWx1ZSA9IHNyY1ZhbHVlO1xuICAgIGlmIChpc0FyciB8fCBpc0J1ZmYgfHwgaXNUeXBlZCkge1xuICAgICAgaWYgKGlzQXJyYXkob2JqVmFsdWUpKSB7XG4gICAgICAgIG5ld1ZhbHVlID0gb2JqVmFsdWU7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChpc0FycmF5TGlrZU9iamVjdChvYmpWYWx1ZSkpIHtcbiAgICAgICAgbmV3VmFsdWUgPSBjb3B5QXJyYXkob2JqVmFsdWUpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoaXNCdWZmKSB7XG4gICAgICAgIGlzQ29tbW9uID0gZmFsc2U7XG4gICAgICAgIG5ld1ZhbHVlID0gY2xvbmVCdWZmZXIoc3JjVmFsdWUsIHRydWUpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoaXNUeXBlZCkge1xuICAgICAgICBpc0NvbW1vbiA9IGZhbHNlO1xuICAgICAgICBuZXdWYWx1ZSA9IGNsb25lVHlwZWRBcnJheShzcmNWYWx1ZSwgdHJ1ZSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgbmV3VmFsdWUgPSBbXTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoaXNQbGFpbk9iamVjdChzcmNWYWx1ZSkgfHwgaXNBcmd1bWVudHMoc3JjVmFsdWUpKSB7XG4gICAgICBuZXdWYWx1ZSA9IG9ialZhbHVlO1xuICAgICAgaWYgKGlzQXJndW1lbnRzKG9ialZhbHVlKSkge1xuICAgICAgICBuZXdWYWx1ZSA9IHRvUGxhaW5PYmplY3Qob2JqVmFsdWUpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoIWlzT2JqZWN0KG9ialZhbHVlKSB8fCBpc0Z1bmN0aW9uKG9ialZhbHVlKSkge1xuICAgICAgICBuZXdWYWx1ZSA9IGluaXRDbG9uZU9iamVjdChzcmNWYWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgaXNDb21tb24gPSBmYWxzZTtcbiAgICB9XG4gIH1cbiAgaWYgKGlzQ29tbW9uKSB7XG4gICAgLy8gUmVjdXJzaXZlbHkgbWVyZ2Ugb2JqZWN0cyBhbmQgYXJyYXlzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgc3RhY2suc2V0KHNyY1ZhbHVlLCBuZXdWYWx1ZSk7XG4gICAgbWVyZ2VGdW5jKG5ld1ZhbHVlLCBzcmNWYWx1ZSwgc3JjSW5kZXgsIGN1c3RvbWl6ZXIsIHN0YWNrKTtcbiAgICBzdGFja1snZGVsZXRlJ10oc3JjVmFsdWUpO1xuICB9XG4gIGFzc2lnbk1lcmdlVmFsdWUob2JqZWN0LCBrZXksIG5ld1ZhbHVlKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYmFzZU1lcmdlRGVlcDtcbiIsImltcG9ydCBTdGFjayBmcm9tICcuL19TdGFjay5qcyc7XG5pbXBvcnQgYXNzaWduTWVyZ2VWYWx1ZSBmcm9tICcuL19hc3NpZ25NZXJnZVZhbHVlLmpzJztcbmltcG9ydCBiYXNlRm9yIGZyb20gJy4vX2Jhc2VGb3IuanMnO1xuaW1wb3J0IGJhc2VNZXJnZURlZXAgZnJvbSAnLi9fYmFzZU1lcmdlRGVlcC5qcyc7XG5pbXBvcnQgaXNPYmplY3QgZnJvbSAnLi9pc09iamVjdC5qcyc7XG5pbXBvcnQga2V5c0luIGZyb20gJy4va2V5c0luLmpzJztcbmltcG9ydCBzYWZlR2V0IGZyb20gJy4vX3NhZmVHZXQuanMnO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLm1lcmdlYCB3aXRob3V0IHN1cHBvcnQgZm9yIG11bHRpcGxlIHNvdXJjZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIHNvdXJjZSBvYmplY3QuXG4gKiBAcGFyYW0ge251bWJlcn0gc3JjSW5kZXggVGhlIGluZGV4IG9mIGBzb3VyY2VgLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgbWVyZ2VkIHZhbHVlcy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbc3RhY2tdIFRyYWNrcyB0cmF2ZXJzZWQgc291cmNlIHZhbHVlcyBhbmQgdGhlaXIgbWVyZ2VkXG4gKiAgY291bnRlcnBhcnRzLlxuICovXG5mdW5jdGlvbiBiYXNlTWVyZ2Uob2JqZWN0LCBzb3VyY2UsIHNyY0luZGV4LCBjdXN0b21pemVyLCBzdGFjaykge1xuICBpZiAob2JqZWN0ID09PSBzb3VyY2UpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgYmFzZUZvcihzb3VyY2UsIGZ1bmN0aW9uKHNyY1ZhbHVlLCBrZXkpIHtcbiAgICBzdGFjayB8fCAoc3RhY2sgPSBuZXcgU3RhY2spO1xuICAgIGlmIChpc09iamVjdChzcmNWYWx1ZSkpIHtcbiAgICAgIGJhc2VNZXJnZURlZXAob2JqZWN0LCBzb3VyY2UsIGtleSwgc3JjSW5kZXgsIGJhc2VNZXJnZSwgY3VzdG9taXplciwgc3RhY2spO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhciBuZXdWYWx1ZSA9IGN1c3RvbWl6ZXJcbiAgICAgICAgPyBjdXN0b21pemVyKHNhZmVHZXQob2JqZWN0LCBrZXkpLCBzcmNWYWx1ZSwgKGtleSArICcnKSwgb2JqZWN0LCBzb3VyY2UsIHN0YWNrKVxuICAgICAgICA6IHVuZGVmaW5lZDtcblxuICAgICAgaWYgKG5ld1ZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbmV3VmFsdWUgPSBzcmNWYWx1ZTtcbiAgICAgIH1cbiAgICAgIGFzc2lnbk1lcmdlVmFsdWUob2JqZWN0LCBrZXksIG5ld1ZhbHVlKTtcbiAgICB9XG4gIH0sIGtleXNJbik7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGJhc2VNZXJnZTtcbiIsImltcG9ydCBpZGVudGl0eSBmcm9tICcuL2lkZW50aXR5LmpzJztcblxuLyoqXG4gKiBDYXN0cyBgdmFsdWVgIHRvIGBpZGVudGl0eWAgaWYgaXQncyBub3QgYSBmdW5jdGlvbi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gaW5zcGVjdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyBjYXN0IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjYXN0RnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnZnVuY3Rpb24nID8gdmFsdWUgOiBpZGVudGl0eTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2FzdEZ1bmN0aW9uO1xuIiwiaW1wb3J0IGFycmF5RWFjaCBmcm9tICcuL19hcnJheUVhY2guanMnO1xuaW1wb3J0IGJhc2VFYWNoIGZyb20gJy4vX2Jhc2VFYWNoLmpzJztcbmltcG9ydCBjYXN0RnVuY3Rpb24gZnJvbSAnLi9fY2FzdEZ1bmN0aW9uLmpzJztcbmltcG9ydCBpc0FycmF5IGZyb20gJy4vaXNBcnJheS5qcyc7XG5cbi8qKlxuICogSXRlcmF0ZXMgb3ZlciBlbGVtZW50cyBvZiBgY29sbGVjdGlvbmAgYW5kIGludm9rZXMgYGl0ZXJhdGVlYCBmb3IgZWFjaCBlbGVtZW50LlxuICogVGhlIGl0ZXJhdGVlIGlzIGludm9rZWQgd2l0aCB0aHJlZSBhcmd1bWVudHM6ICh2YWx1ZSwgaW5kZXh8a2V5LCBjb2xsZWN0aW9uKS5cbiAqIEl0ZXJhdGVlIGZ1bmN0aW9ucyBtYXkgZXhpdCBpdGVyYXRpb24gZWFybHkgYnkgZXhwbGljaXRseSByZXR1cm5pbmcgYGZhbHNlYC5cbiAqXG4gKiAqKk5vdGU6KiogQXMgd2l0aCBvdGhlciBcIkNvbGxlY3Rpb25zXCIgbWV0aG9kcywgb2JqZWN0cyB3aXRoIGEgXCJsZW5ndGhcIlxuICogcHJvcGVydHkgYXJlIGl0ZXJhdGVkIGxpa2UgYXJyYXlzLiBUbyBhdm9pZCB0aGlzIGJlaGF2aW9yIHVzZSBgXy5mb3JJbmBcbiAqIG9yIGBfLmZvck93bmAgZm9yIG9iamVjdCBpdGVyYXRpb24uXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGFsaWFzIGVhY2hcbiAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbaXRlcmF0ZWU9Xy5pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheXxPYmplY3R9IFJldHVybnMgYGNvbGxlY3Rpb25gLlxuICogQHNlZSBfLmZvckVhY2hSaWdodFxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmZvckVhY2goWzEsIDJdLCBmdW5jdGlvbih2YWx1ZSkge1xuICogICBjb25zb2xlLmxvZyh2YWx1ZSk7XG4gKiB9KTtcbiAqIC8vID0+IExvZ3MgYDFgIHRoZW4gYDJgLlxuICpcbiAqIF8uZm9yRWFjaCh7ICdhJzogMSwgJ2InOiAyIH0sIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAqICAgY29uc29sZS5sb2coa2V5KTtcbiAqIH0pO1xuICogLy8gPT4gTG9ncyAnYScgdGhlbiAnYicgKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZCkuXG4gKi9cbmZ1bmN0aW9uIGZvckVhY2goY29sbGVjdGlvbiwgaXRlcmF0ZWUpIHtcbiAgdmFyIGZ1bmMgPSBpc0FycmF5KGNvbGxlY3Rpb24pID8gYXJyYXlFYWNoIDogYmFzZUVhY2g7XG4gIHJldHVybiBmdW5jKGNvbGxlY3Rpb24sIGNhc3RGdW5jdGlvbihpdGVyYXRlZSkpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmb3JFYWNoO1xuIiwiaW1wb3J0IGJhc2VNZXJnZSBmcm9tICcuL19iYXNlTWVyZ2UuanMnO1xuaW1wb3J0IGNyZWF0ZUFzc2lnbmVyIGZyb20gJy4vX2NyZWF0ZUFzc2lnbmVyLmpzJztcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLmFzc2lnbmAgZXhjZXB0IHRoYXQgaXQgcmVjdXJzaXZlbHkgbWVyZ2VzIG93biBhbmRcbiAqIGluaGVyaXRlZCBlbnVtZXJhYmxlIHN0cmluZyBrZXllZCBwcm9wZXJ0aWVzIG9mIHNvdXJjZSBvYmplY3RzIGludG8gdGhlXG4gKiBkZXN0aW5hdGlvbiBvYmplY3QuIFNvdXJjZSBwcm9wZXJ0aWVzIHRoYXQgcmVzb2x2ZSB0byBgdW5kZWZpbmVkYCBhcmVcbiAqIHNraXBwZWQgaWYgYSBkZXN0aW5hdGlvbiB2YWx1ZSBleGlzdHMuIEFycmF5IGFuZCBwbGFpbiBvYmplY3QgcHJvcGVydGllc1xuICogYXJlIG1lcmdlZCByZWN1cnNpdmVseS4gT3RoZXIgb2JqZWN0cyBhbmQgdmFsdWUgdHlwZXMgYXJlIG92ZXJyaWRkZW4gYnlcbiAqIGFzc2lnbm1lbnQuIFNvdXJjZSBvYmplY3RzIGFyZSBhcHBsaWVkIGZyb20gbGVmdCB0byByaWdodC4gU3Vic2VxdWVudFxuICogc291cmNlcyBvdmVyd3JpdGUgcHJvcGVydHkgYXNzaWdubWVudHMgb2YgcHJldmlvdXMgc291cmNlcy5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgbXV0YXRlcyBgb2JqZWN0YC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuNS4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0gey4uLk9iamVjdH0gW3NvdXJjZXNdIFRoZSBzb3VyY2Ugb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7XG4gKiAgICdhJzogW3sgJ2InOiAyIH0sIHsgJ2QnOiA0IH1dXG4gKiB9O1xuICpcbiAqIHZhciBvdGhlciA9IHtcbiAqICAgJ2EnOiBbeyAnYyc6IDMgfSwgeyAnZSc6IDUgfV1cbiAqIH07XG4gKlxuICogXy5tZXJnZShvYmplY3QsIG90aGVyKTtcbiAqIC8vID0+IHsgJ2EnOiBbeyAnYic6IDIsICdjJzogMyB9LCB7ICdkJzogNCwgJ2UnOiA1IH1dIH1cbiAqL1xudmFyIG1lcmdlID0gY3JlYXRlQXNzaWduZXIoZnVuY3Rpb24ob2JqZWN0LCBzb3VyY2UsIHNyY0luZGV4KSB7XG4gIGJhc2VNZXJnZShvYmplY3QsIHNvdXJjZSwgc3JjSW5kZXgpO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IG1lcmdlO1xuIiwiLyoqXHJcbiAqIFBhcnQgb2Ygc3RhcnRlciBwcm9qZWN0LlxyXG4gKlxyXG4gKiBAY29weXJpZ2h0ICBDb3B5cmlnaHQgKEMpIDIwMjEgX19PUkdBTklaQVRJT05fXy5cclxuICogQGxpY2Vuc2UgICAgX19MSUNFTlNFX19cclxuICovXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGF0YShlbGVtZW50LCBuYW1lKSB7XHJcbiAgcHJlcGFyZURhdGEoZWxlbWVudCk7XHJcbiAgcmV0dXJuIGVsZW1lbnQuX191bmljb3JuW25hbWVdO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0RGF0YShlbGVtZW50LCBuYW1lLCB2YWx1ZSkge1xyXG4gIHByZXBhcmVEYXRhKGVsZW1lbnQpO1xyXG4gIGVsZW1lbnQuX191bmljb3JuW25hbWVdID0gdmFsdWU7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkZWZEYXRhKGVsZW1lbnQsIG5hbWUsIGRlZkNhbGxiYWNrKSB7XHJcbiAgcHJlcGFyZURhdGEoZWxlbWVudCk7XHJcbiAgZWxlbWVudC5fX3VuaWNvcm5bbmFtZV0gPSBlbGVtZW50Ll9fdW5pY29ybltuYW1lXSB8fCBkZWZDYWxsYmFjaygpO1xyXG5cclxuICByZXR1cm4gZWxlbWVudC5fX3VuaWNvcm5bbmFtZV07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwcmVwYXJlRGF0YShlbGVtZW50KSB7XHJcbiAgaWYgKCFlbGVtZW50KSB7XHJcbiAgICByZXR1cm4gZWxlbWVudDtcclxuICB9XHJcblxyXG4gIGVsZW1lbnQuX191bmljb3JuID0gZWxlbWVudC5fX3VuaWNvcm4gfHwge307XHJcbiAgcmV0dXJuIGVsZW1lbnQ7XHJcbn1cclxuIiwiLyoqXHJcbiAqIFBhcnQgb2YgVW5pY29ybiBwcm9qZWN0LlxyXG4gKlxyXG4gKiBAY29weXJpZ2h0ICBDb3B5cmlnaHQgKEMpIDIwMTYgTFlSQVNPRlQuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqIEBsaWNlbnNlICAgIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMiBvciBsYXRlci5cclxuICovXHJcblxyXG5pbXBvcnQgeyBtZXJnZSB9IGZyb20gJ2xvZGFzaC1lcyc7XHJcbmltcG9ydCB7IGRlZkRhdGEgfSBmcm9tICcuLi91dGlsaXRpZXMuanMnO1xyXG5cclxuLyoqXHJcbiAqIFVuaWNvcm5HcmlkXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVbmljb3JuR3JpZCB7XHJcbiAgc3RhdGljIGdldCBpcygpIHsgcmV0dXJuICdncmlkJzsgfVxyXG5cclxuICBzdGF0aWMgaW5zdGFsbChhcHAsIG9wdGlvbnMgPSB7fSkge1xyXG4gICAgYXBwLmdyaWQgPSAoZWxlLCBvcHRpb25zID0ge30pID0+IHtcclxuICAgICAgY29uc3Qgc2VsZWN0b3IgPSB0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IG51bGw7XHJcbiAgICAgIGVsZSA9IGFwcC5zZWxlY3RPbmUoZWxlKTtcclxuXHJcbiAgICAgIHJldHVybiBkZWZEYXRhKFxyXG4gICAgICAgIGVsZSxcclxuICAgICAgICAnZ3JpZC5wbHVnaW4nLFxyXG4gICAgICAgICgpID0+IG5ldyBVbmljb3JuR3JpZEVsZW1lbnQoc2VsZWN0b3IsIGVsZSwgb3B0aW9ucywgYXBwKVxyXG4gICAgICApO1xyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbmNsYXNzIFVuaWNvcm5HcmlkRWxlbWVudCB7XHJcbiAgb3JkZXJpbmcgPSAnJztcclxuXHJcbiAgc3RhdGljIGdldCBkZWZhdWx0T3B0aW9ucygpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIC8vXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3RvcihzZWxlY3RvciwgZWxlbWVudCwgb3B0aW9ucywgYXBwKSB7XHJcbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xyXG4gICAgdGhpcy5vcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5jb25zdHJ1Y3Rvci5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XHJcbiAgICB0aGlzLmFwcCA9IGFwcDtcclxuICAgIHRoaXMuZm9ybSA9IGFwcC5mb3JtKHNlbGVjdG9yIHx8IGVsZW1lbnQpO1xyXG5cclxuICAgIGlmICghdGhpcy5mb3JtKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5pY29ybkdyaWQgaXMgZGVwZW5kZW50IG9uIFVuaWNvcm5Gb3JtJyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5yZWdpc3RlckV2ZW50cygpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU3RhcnQgdGhpcyBvYmplY3QgYW5kIGV2ZW50cy5cclxuICAgKi9cclxuICByZWdpc3RlckV2ZW50cygpIHtcclxuICAgIC8vIHRoaXMuc2VhcmNoQ2xlYXJCdXR0b24uY2xpY2soKCkgPT4ge1xyXG4gICAgLy8gICB0aGlzLnNlYXJjaENvbnRhaW5lci5maW5kKCdpbnB1dCwgdGV4dGFyZWEsIHNlbGVjdCcpLnZhbCgnJyk7XHJcbiAgICAvLyAgIHRoaXMuZmlsdGVyQ29udGFpbmVyLmZpbmQoJ2lucHV0LCB0ZXh0YXJlYSwgc2VsZWN0JykudmFsKCcnKTtcclxuICAgIC8vXHJcbiAgICAvLyAgIHRoaXMuZm9ybS5zdWJtaXQoKTtcclxuICAgIC8vIH0pO1xyXG4gICAgLy9cclxuICAgIC8vIHRoaXMuZmlsdGVyQnV0dG9uLmNsaWNrKGV2ZW50ID0+IHtcclxuICAgIC8vICAgdGhpcy50b2dnbGVGaWx0ZXIoKTtcclxuICAgIC8vICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAvLyAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAvLyB9KTtcclxuICAgIC8vXHJcbiAgICAvLyB0aGlzLnNvcnRCdXR0b25zLmNsaWNrKGV2ZW50ID0+IHtcclxuICAgIC8vICAgc2VsZi5zb3J0KGV2ZW50LmN1cnJlbnRUYXJnZXQsIGV2ZW50KTtcclxuICAgIC8vIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gcmVnaXN0ZXJDdXN0b21FbGVtZW50cygpIHtcclxuICAvLyAgIHJldHVybiBhcHAuaW1wb3J0KCdAdW5pY29ybi91aS9ncmlkLWNvbXBvbmVudHMuanMnKTtcclxuICAvLyB9XHJcblxyXG4gIGluaXRDb21wb25lbnQoc3RvcmUgPSAnZ3JpZCcsIGN1c3RvbSA9IHt9KSB7XHJcbiAgICB0aGlzLm9yZGVyaW5nID0gdGhpcy5lbGVtZW50LmRhdGFzZXQub3JkZXJpbmc7XHJcblxyXG4gICAgaWYgKCF0aGlzLm9yZGVyaW5nLnRvTG93ZXJDYXNlKCkuZW5kc1dpdGgoJyBhc2MnKVxyXG4gICAgICAmJiAhdGhpcy5vcmRlcmluZy50b0xvd2VyQ2FzZSgpLmVuZHNXaXRoKCcgZGVzYycpKSB7XHJcbiAgICAgIHRoaXMub3JkZXJpbmcgKz0gJyBBU0MnO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLmFwcC5sb2FkU3BydWNlKClcclxuICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIFNwcnVjZS5zdG9yZShzdG9yZSwgdGhpcy51c2VTdGF0ZShjdXN0b20pKTtcclxuICAgICAgICAvLyB0aGlzLnJlZ2lzdGVyQ3VzdG9tRWxlbWVudHMoKTtcclxuICAgICAgICB0aGlzLmFwcC5zdGFydEFscGluZSgpO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIHVzZVN0YXRlKGN1c3RvbSA9IHt9KSB7XHJcbiAgICByZXR1cm4gbWVyZ2UoXHJcbiAgICAgIHRoaXMsXHJcbiAgICAgIGN1c3RvbVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHNlbmRGaWx0ZXIoJGV2ZW50KSB7XHJcbiAgICBpZiAoJGV2ZW50KSB7XHJcbiAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZm9ybS5wdXQoKTtcclxuICB9XHJcblxyXG4gIGNsZWFyRmlsdGVycyhlbGVtZW50KSB7XHJcbiAgICBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0LCB0ZXh0YXJlYSwgc2VsZWN0JykuZm9yRWFjaCgoZWxlKSA9PiB7XHJcbiAgICAgIGVsZS52YWx1ZSA9ICcnO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5mb3JtLnB1dCgpO1xyXG4gIH1cclxuXHJcbiAgc29ydCgkZWwpIHtcclxuICAgIGNvbnN0IGRpciA9IHRoaXMuZ2V0RGlyZWN0aW9uKCRlbCk7XHJcblxyXG4gICAgY29uc3QgZmllbGQgPSAkZWwuZGF0YXNldC5maWVsZDtcclxuICAgIGxldCBhc2MgPSAkZWwuZGF0YXNldC5hc2M7XHJcbiAgICBsZXQgZGVzYyA9ICRlbC5kYXRhc2V0LmRlc2M7XHJcblxyXG4gICAgaWYgKGZpZWxkKSB7XHJcbiAgICAgIGFzYyA9IGZpZWxkICsgJyBBU0MnO1xyXG4gICAgICBkZXNjID0gZmllbGQgKyAnIERFU0MnO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChkaXIgPT09ICdBU0MnKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnNvcnRCeShkZXNjKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5zb3J0QnkoYXNjKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNvcnQgdHdvIGl0ZW1zLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IG9yZGVyaW5nXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgKi9cclxuICBzb3J0Qnkob3JkZXJpbmcpIHtcclxuICAgIGxldCBvcmRlcmluZ0lucHV0ID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9bGlzdF9vcmRlcmluZ10nKTtcclxuXHJcbiAgICBpZiAoIW9yZGVyaW5nSW5wdXQpIHtcclxuICAgICAgb3JkZXJpbmdJbnB1dCA9IHRoaXMuYXBwLmgoJ2lucHV0JywgeyBuYW1lOiAnbGlzdF9vcmRlcmluZycsIHR5cGU6ICdoaWRkZW4nLCB2YWx1ZTogJycgfSk7XHJcblxyXG4gICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQob3JkZXJpbmdJbnB1dCk7XHJcbiAgICB9XHJcblxyXG4gICAgb3JkZXJpbmdJbnB1dC52YWx1ZSA9IG9yZGVyaW5nO1xyXG5cclxuICAgIHJldHVybiB0aGlzLmZvcm0ucHV0KCk7XHJcbiAgfVxyXG5cclxuICBpc1NvcnRBY3RpdmUoJGVsKSB7XHJcbiAgICByZXR1cm4gdGhpcy5nZXREaXJlY3Rpb24oJGVsKSAhPSBudWxsO1xyXG4gIH1cclxuXHJcbiAgZ2V0RGlyZWN0aW9uKCRlbCkge1xyXG4gICAgY29uc3QgZmllbGQgPSAkZWwuZGF0YXNldC5maWVsZDtcclxuICAgIGxldCBhc2MgPSAkZWwuZGF0YXNldC5hc2M7XHJcbiAgICBsZXQgZGVzYyA9ICRlbC5kYXRhc2V0LmRlc2M7XHJcblxyXG4gICAgaWYgKGZpZWxkKSB7XHJcbiAgICAgIGFzYyA9IGZpZWxkICsgJyBBU0MnO1xyXG4gICAgICBkZXNjID0gZmllbGQgKyAnIERFU0MnO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLm9yZGVyaW5nRXF1YWxzKGFzYywgdGhpcy5vcmRlcmluZykpIHtcclxuICAgICAgcmV0dXJuICdBU0MnO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLm9yZGVyaW5nRXF1YWxzKGRlc2MsIHRoaXMub3JkZXJpbmcpKSB7XHJcbiAgICAgIHJldHVybiAnREVTQyc7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuICBvcmRlcmluZ0VxdWFscyhhLCBiKSB7XHJcbiAgICBhID0gYS5yZXBsYWNlKC9cXHMrL2csICcgJykudHJpbSgpLnRvTG93ZXJDYXNlKCk7XHJcbiAgICBiID0gYi5yZXBsYWNlKC9cXHMrL2csICcgJykudHJpbSgpLnRvTG93ZXJDYXNlKCk7XHJcblxyXG4gICAgcmV0dXJuIGEgPT09IGI7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDaGVjayBhIHJvdydzIGNoZWNrYm94LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9ICByb3dcclxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHZhbHVlXHJcbiAgICovXHJcbiAgY2hlY2tSb3cocm93LCB2YWx1ZSA9IHRydWUpIHtcclxuICAgIGNvbnN0IGNoID0gdGhpcy5mb3JtLmZpbmQoJ2lucHV0LmdyaWQtY2hlY2tib3hbZGF0YS1yb3ctbnVtYmVyPScgKyByb3cgKyAnXScpO1xyXG5cclxuICAgIGlmICghY2gubGVuZ3RoKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2hlY2tib3ggb2Ygcm93OiAnICsgcm93ICsgJyBub3QgZm91bmQuJyk7XHJcbiAgICB9XHJcblxyXG4gICAgY2hbMF0uY2hlY2tlZCA9IHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVXBkYXRlIGEgcm93LlxyXG4gICAqXHJcbiAgICogQHBhcmFtICB7bnVtYmVyfSByb3dcclxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHVybFxyXG4gICAqIEBwYXJhbSAge09iamVjdH0gcXVlcmllc1xyXG4gICAqXHJcbiAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICovXHJcbiAgdXBkYXRlUm93KHJvdywgdXJsLCBxdWVyaWVzKSB7XHJcbiAgICB0aGlzLnRvZ2dsZUFsbChmYWxzZSk7XHJcblxyXG4gICAgdGhpcy5jaGVja1Jvdyhyb3cpO1xyXG5cclxuICAgIHJldHVybiB0aGlzLmNvcmUucGF0Y2godXJsLCBxdWVyaWVzKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFVwZGF0ZSBhIHJvdyB3aXRoIGJhdGNoIHRhc2suXHJcbiAgICpcclxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHRhc2tcclxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IHJvd1xyXG4gICAqIEBwYXJhbSAge3N0cmluZ30gdXJsXHJcbiAgICogQHBhcmFtICB7T2JqZWN0fSBxdWVyaWVzXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgKi9cclxuICBkb1Rhc2sodGFzaywgcm93LCB1cmwsIHF1ZXJpZXMpIHtcclxuICAgIHF1ZXJpZXMgPSBxdWVyaWVzIHx8IHt9O1xyXG5cclxuICAgIHF1ZXJpZXMudGFzayA9IHRhc2s7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMudXBkYXRlUm93KHJvdywgdXJsLCBxdWVyaWVzKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEJhdGNoIHVwZGF0ZSBpdGVtcy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSAge3N0cmluZ30gdGFza1xyXG4gICAqIEBwYXJhbSAge3N0cmluZ30gdXJsXHJcbiAgICogQHBhcmFtICB7T2JqZWN0fSBxdWVyaWVzXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgKi9cclxuICBiYXRjaCh0YXNrLCB1cmwsIHF1ZXJpZXMpIHtcclxuICAgIHF1ZXJpZXMgPSBxdWVyaWVzIHx8IHt9O1xyXG5cclxuICAgIHF1ZXJpZXMudGFzayA9IHRhc2s7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuY29yZS5wYXRjaCh1cmwsIHF1ZXJpZXMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ29weSBhIHJvdy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSAge251bWJlcn0gcm93XHJcbiAgICogQHBhcmFtICB7c3RyaW5nfSB1cmxcclxuICAgKiBAcGFyYW0gIHtPYmplY3R9IHF1ZXJpZXNcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAqL1xyXG4gIGNvcHlSb3cocm93LCB1cmwsIHF1ZXJpZXMpIHtcclxuICAgIHRoaXMudG9nZ2xlQWxsKGZhbHNlKTtcclxuXHJcbiAgICB0aGlzLmNoZWNrUm93KHJvdyk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuY29yZS5wb3N0KHVybCwgcXVlcmllcyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBEZWxldGUgY2hlY2tlZCBpdGVtcy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSAge3N0cmluZ30gbWVzc2FnZVxyXG4gICAqIEBwYXJhbSAge3N0cmluZ30gdXJsXHJcbiAgICogQHBhcmFtICB7T2JqZWN0fSBxdWVyaWVzXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgKi9cclxuICBkZWxldGVMaXN0KG1lc3NhZ2UsIHVybCwgcXVlcmllcykge1xyXG4gICAgbWVzc2FnZSA9IG1lc3NhZ2UgPT0gbnVsbCA/IHRoaXMuYXBwLl9fKCd1bmljb3JuLm1lc3NhZ2UuZGVsZXRlLmNvbmZpcm0nKSA6IG1lc3NhZ2U7XHJcblxyXG4gICAgaWYgKG1lc3NhZ2UgIT09IGZhbHNlKSB7XHJcbiAgICAgIHRoaXMuYXBwLmNvbmZpcm0obWVzc2FnZSwgaXNDb25maXJtID0+IHtcclxuICAgICAgICBpZiAoaXNDb25maXJtKSB7XHJcbiAgICAgICAgICB0aGlzLmNvcmVbJ2RlbGV0ZSddKHVybCwgcXVlcmllcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuY29yZVsnZGVsZXRlJ10odXJsLCBxdWVyaWVzKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIERlbGV0ZSBhbiBpdG1lLlxyXG4gICAqXHJcbiAgICogQHBhcmFtICB7bnVtYmVyfSByb3dcclxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IG1zZ1xyXG4gICAqIEBwYXJhbSAge3N0cmluZ30gdXJsXHJcbiAgICogQHBhcmFtICB7T2JqZWN0fSBxdWVyaWVzXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgKi9cclxuICBkZWxldGVSb3cocm93LCBtc2csIHVybCwgcXVlcmllcykge1xyXG4gICAgbXNnID0gbXNnIHx8IHRoaXMuYXBwLl9fKCd1bmljb3JuLm1lc3NhZ2UuZGVsZXRlLmNvbmZpcm0nKTtcclxuXHJcbiAgICB0aGlzLmFwcC5jb25maXJtKG1zZywgaXNDb25maXJtID0+IHtcclxuICAgICAgaWYgKGlzQ29uZmlybSkge1xyXG4gICAgICAgIHRoaXMudG9nZ2xlQWxsKGZhbHNlKTtcclxuXHJcbiAgICAgICAgdGhpcy5jaGVja1Jvdyhyb3cpO1xyXG5cclxuICAgICAgICB0aGlzLmRlbGV0ZUxpc3QoZmFsc2UsIHVybCwgcXVlcmllcyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVG9nZ2xlIGFsbCBjaGVja2JveGVzLlxyXG4gICAqXHJcbiAgICogQHBhcmFtICB7Ym9vbGVhbn0gICAgICAgICAgdmFsdWUgICAgIENoZWNrZWQgb3IgdW5jaGVja2VkLlxyXG4gICAqL1xyXG4gIHRvZ2dsZUFsbCh2YWx1ZSkge1xyXG4gICAgdGhpcy5hcHAuc2VsZWN0QWxsKFxyXG4gICAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbZGF0YS1yb2xlPWdyaWQtY2hlY2tib3hdW3R5cGU9Y2hlY2tib3hdJylcclxuICAgIClcclxuICAgICAgLm1hcCgoaW5wdXQpID0+IHtcclxuICAgICAgICBpbnB1dC5jaGVja2VkID0gdmFsdWU7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ291bnQgY2hlY2tlZCBjaGVja2JveGVzLlxyXG4gICAqXHJcbiAgICogQHJldHVybnMge2ludH1cclxuICAgKi9cclxuICBjb3VudENoZWNrZWQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5nZXRDaGVja2VkKCkubGVuZ3RoO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IENoZWNrZWQgYm94ZXMuXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyB7RWxlbWVudFtdfVxyXG4gICAqL1xyXG4gIGdldENoZWNrZWQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5hcHAuc2VsZWN0QWxsKFxyXG4gICAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbZGF0YS1yb2xlPWdyaWQtY2hlY2tib3hdW3R5cGU9Y2hlY2tib3hdJylcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBWYWxpZGF0ZSB0aGVyZSBoYXMgb25lIG9yIG1vcmUgY2hlY2tlZCBib3hlcy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSAgIHtzdHJpbmd9ICBtc2dcclxuICAgKiBAcGFyYW0gICB7RXZlbnR9ICAgZXZlbnRcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHtVbmljb3JuR3JpZEVsZW1lbnR9XHJcbiAgICovXHJcbiAgaGFzQ2hlY2tlZChtc2csIGV2ZW50KSB7XHJcbiAgICBtc2cgPSBtc2cgfHwgVW5pY29ybi5UcmFuc2xhdG9yLnRyYW5zbGF0ZSgndW5pY29ybi5tZXNzYWdlLmdyaWQuY2hlY2tlZCcpO1xyXG5cclxuICAgIGlmICghdGhpcy5jb3VudENoZWNrZWQoKSkge1xyXG4gICAgICBhbGVydChtc2cpO1xyXG5cclxuICAgICAgLy8gSWYgeW91IHNlbmQgZXZlbnQgb2JqZWN0IGFzIHNlY29uZCBhcmd1bWVudCwgd2Ugd2lsbCBzdG9wIGFsbCBhY3Rpb25zLlxyXG4gICAgICBpZiAoZXZlbnQpIHtcclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlb3JkZXIgYWxsLlxyXG4gICAqXHJcbiAgICogQHBhcmFtICAge3N0cmluZ30gIHVybFxyXG4gICAqIEBwYXJhbSAgIHtPYmplY3R9ICBxdWVyaWVzXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgKi9cclxuICByZW9yZGVyQWxsKHVybCwgcXVlcmllcykge1xyXG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XHJcbiAgICBjb25zdCBvcmlnaW4gPSB0aGlzLmZvcm0uZmluZCgnaW5wdXRbbmFtZT1vcmlnaW5fb3JkZXJpbmddJyk7XHJcblxyXG4gICAgLy8gSWYgb3JpZ2luIGV4aXN0cywgd2UgZGlmZiB0aGVtIGFuZCBvbmx5IHNlbmQgY2hhbmdlZCBncm91cC5cclxuICAgIGlmIChvcmlnaW4ubGVuZ3RoKSB7XHJcbiAgICAgIGNvbnN0IG9yaWdpbk9yZGVyaW5nID0gb3JpZ2luLnZhbCgpLnNwbGl0KCcsJyk7XHJcbiAgICAgIGNvbnN0IGlucHV0cyA9IHRoaXMuZm9ybS5maW5kKCcub3JkZXJpbmctY29udHJvbCBpbnB1dCcpO1xyXG5cclxuICAgICAgdGhpcy50b2dnbGVBbGwoKTtcclxuXHJcbiAgICAgIGlucHV0cy5lYWNoKGZ1bmN0aW9uKGkpIHtcclxuICAgICAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XHJcblxyXG4gICAgICAgIGlmICgkdGhpcy52YWwoKSAhPT0gb3JpZ2luT3JkZXJpbmdbaV0pIHtcclxuICAgICAgICAgIC8vIENoZWNrIHNlbGZcclxuICAgICAgICAgIHNlbGYuY2hlY2tSb3coJHRoaXMuYXR0cignZGF0YS1vcmRlci1yb3cnKSk7XHJcblxyXG4gICAgICAgICAgY29uc3QgdHIgPSAkdGhpcy5wYXJlbnRzKCd0cicpO1xyXG4gICAgICAgICAgY29uc3QgZ3JvdXAgPSB0ci5hdHRyKCdkYXRhLW9yZGVyLWdyb3VwJyk7XHJcblxyXG4gICAgICAgICAgLy8gQ2hlY2sgc2FtZSBncm91cCBib3hlc1xyXG4gICAgICAgICAgaWYgKGdyb3VwICE9PSAnJykge1xyXG4gICAgICAgICAgICB0ci5zaWJsaW5ncygnW2RhdGEtb3JkZXItZ3JvdXA9JyArIGdyb3VwICsgJ10nKVxyXG4gICAgICAgICAgICAgIC5maW5kKCdpbnB1dC5ncmlkLWNoZWNrYm94JylcclxuICAgICAgICAgICAgICAucHJvcCgnY2hlY2tlZCcsIHRydWUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuYmF0Y2goJ3Jlb3JkZXInLCB1cmwsIHF1ZXJpZXMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVvcmRlciBpdGVtcy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSAge2ludH0gICAgIHJvd1xyXG4gICAqIEBwYXJhbSAge2ludH0gICAgIGRlbHRhXHJcbiAgICogQHBhcmFtICB7c3RyaW5nfSAgdXJsXHJcbiAgICogQHBhcmFtICB7T2JqZWN0fSAgcXVlcmllc1xyXG4gICAqXHJcbiAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICovXHJcbiAgcmVvcmRlcihyb3csIGRlbHRhLCB1cmwsIHF1ZXJpZXMpIHtcclxuICAgIHF1ZXJpZXMgPSBxdWVyaWVzIHx8IHt9O1xyXG4gICAgcXVlcmllcy5kZWx0YSA9IGRlbHRhO1xyXG5cclxuICAgIHJldHVybiB0aGlzLmRvVGFzaygncmVvcmRlcicsIHJvdywgdXJsLCBxdWVyaWVzKTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzU29ydEFjdGl2ZSgkZWwpIHtcclxuICBsZXQgZmllbGQgPSAkZWwuZGF0YXNldC5maWVsZDtcclxuICBsZXQgZGVzYyA9ICRlbC5kYXRhc2V0LmRlc2M7XHJcbiAgbGV0IGFzYyA9ICRlbC5kYXRhc2V0LmFzYztcclxuICBcclxuICBkZXNjID0gZGVzYyB8fCBgJHtmaWVsZH0gREVTQ2A7XHJcbiAgYXNjID0gYXNjIHx8IGAke2ZpZWxkfSBBU0NgO1xyXG5cclxuICBjb25zdCBvcmRlcmluZyA9IHRoaXMuZ3JpZC5lbGVtZW50LmRhdGFzZXQub3JkZXJpbmc7XHJcbiAgY29uc29sZS5sb2cob3JkZXJpbmcsIGFzYywgZGVzYyk7XHJcbiAgcmV0dXJuIG9yZGVyaW5nID09PSBhc2MgfHwgb3JkZXJpbmcgPT09IGRlc2M7XHJcbn1cclxuIiwiLyoqXHJcbiAqIFBhcnQgb2Ygc3RhcnRlciBwcm9qZWN0LlxyXG4gKlxyXG4gKiBAY29weXJpZ2h0ICBDb3B5cmlnaHQgKEMpIDIwMjEgX19PUkdBTklaQVRJT05fXy5cclxuICogQGxpY2Vuc2UgICAgX19MSUNFTlNFX19cclxuICovXHJcblxyXG5pbXBvcnQgeyBkZWZEYXRhIH0gZnJvbSAnLi4vdXRpbGl0aWVzLmpzJztcclxuaW1wb3J0IHsgZWFjaCwgbWVyZ2UgfSBmcm9tICdsb2Rhc2gtZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVW5pY29ybkZvcm0ge1xyXG4gIHN0YXRpYyBnZXQgaXMoKSB7XHJcbiAgICByZXR1cm4gJ2Zvcm0nO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGluc3RhbGwoYXBwLCBvcHRpb25zID0ge30pIHtcclxuICAgIGFwcC5mb3JtID0gKGVsZSwgb3B0aW9ucyA9IHt9KSA9PiB7XHJcbiAgICAgIGNvbnN0IHNlbGVjdG9yID0gdHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBudWxsO1xyXG4gICAgICBlbGUgPSBhcHAuc2VsZWN0T25lKGVsZSk7XHJcblxyXG4gICAgICByZXR1cm4gZGVmRGF0YShcclxuICAgICAgICBlbGUsXHJcbiAgICAgICAgJ2Zvcm0ucGx1Z2luJyxcclxuICAgICAgICAoKSA9PiBuZXcgVW5pY29ybkZvcm1FbGVtZW50KHNlbGVjdG9yLCBlbGUsIG9wdGlvbnMsIGFwcClcclxuICAgICAgKTtcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG5jbGFzcyBVbmljb3JuRm9ybUVsZW1lbnQge1xyXG4gIC8qKlxyXG4gICAqIENvbnN0cnVjdG9yLlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSAgICAgIHNlbGVjdG9yXHJcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gJGZvcm1cclxuICAgKiBAcGFyYW0ge09iamVjdH0gICAgICBvcHRpb25zXHJcbiAgICogQHBhcmFtIHtVbmljb3JuQXBwfSAgYXBwXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3Ioc2VsZWN0b3IsICRmb3JtLCBvcHRpb25zLCBhcHApIHtcclxuICAgIHRoaXMuYXBwID0gYXBwO1xyXG5cclxuICAgIC8vIElmIGZvcm0gbm90IGZvdW5kLCBjcmVhdGUgb25lXHJcbiAgICBpZiAoISRmb3JtKSB7XHJcbiAgICAgICRmb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9ybScpO1xyXG5cclxuICAgICAgaWYgKHNlbGVjdG9yLmluZGV4T2YoJyMnKSA9PT0gMCkge1xyXG4gICAgICAgICRmb3JtLnNldEF0dHJpYnV0ZSgnaWQnLCBzZWxlY3Rvci5zdWJzdHIoMSkpO1xyXG4gICAgICAgICRmb3JtLnNldEF0dHJpYnV0ZSgnbmFtZScsIHNlbGVjdG9yLnN1YnN0cigxKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICRmb3JtLnNldEF0dHJpYnV0ZSgnbWV0aG9kJywgJ3Bvc3QnKTtcclxuICAgICAgJGZvcm0uc2V0QXR0cmlidXRlKCdlbmN0eXBlJywgJ211bHRpcGFydC9mb3JtLWRhdGEnKTtcclxuICAgICAgJGZvcm0uc2V0QXR0cmlidXRlKCdub3ZhbGlkYXRlJywgJ3RydWUnKTtcclxuICAgICAgJGZvcm0uc2V0QXR0cmlidXRlKCdhY3Rpb24nLCBhcHAuZGF0YSgndW5pY29ybi51cmknKVsnZnVsbCddKTtcclxuICAgICAgJGZvcm0uc2V0QXR0cmlidXRlKCdkaXNwbGF5JywgJ25vbmUnKTtcclxuXHJcbiAgICAgIGNvbnN0IGNzcmYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xyXG4gICAgICBjc3JmLnNldEF0dHJpYnV0ZSgnbmFtZScsIGFwcC5kYXRhKCdjc3JmLXRva2VuJykpO1xyXG5cclxuICAgICAgJGZvcm0uYXBwZW5kQ2hpbGQoY3NyZik7XHJcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoJGZvcm0pO1xyXG4gICAgfVxyXG5cclxuICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKCB7fSwgdGhpcy5jb25zdHJ1Y3Rvci5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XHJcblxyXG4gICAgdGhpcy5lbGVtZW50ID0gJGZvcm07XHJcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xyXG5cclxuICAgIHRoaXMuYmluZEV2ZW50cygpO1xyXG4gIH1cclxuXHJcbiAgYmluZEV2ZW50cygpIHtcclxuICAgIC8vIGlmICh0aGlzLmZvcm0uYXR0cignZGF0YS10b29sYmFyJykpIHtcclxuICAgIC8vICAgJCh0aGlzLmZvcm0uYXR0cignZGF0YS10b29sYmFyJykpLmZpbmQoJypbZGF0YS1hY3Rpb25dJykub24oJ2NsaWNrJywgKGUpID0+IHtcclxuICAgIC8vICAgICB0aGlzLmZvcm0udHJpZ2dlcigndW5pY29ybi5zdWJtaXQnLCBlLmN1cnJlbnRUYXJnZXQpO1xyXG4gICAgLy8gICB9KTtcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyB0aGlzLmZvcm0ub24oJ3VuaWNvcm4uc3VibWl0JywgKGUsIGJ1dHRvbikgPT4ge1xyXG4gICAgLy8gICBjb25zdCAkYnV0dG9uID0gJChidXR0b24pO1xyXG4gICAgLy8gICBjb25zdCBhY3Rpb24gPSAkYnV0dG9uLmF0dHIoJ2RhdGEtYWN0aW9uJyk7XHJcbiAgICAvLyAgIGNvbnN0IHRhcmdldCA9ICRidXR0b24uYXR0cignZGF0YS10YXJnZXQnKSB8fCBudWxsO1xyXG4gICAgLy8gICBjb25zdCBxdWVyeSA9ICRidXR0b24uZGF0YSgncXVlcnknKSB8fCB7fTtcclxuICAgIC8vICAgcXVlcnlbJ3Rhc2snXSA9ICRidXR0b24uYXR0cignZGF0YS10YXNrJykgfHwgbnVsbDtcclxuICAgIC8vXHJcbiAgICAvLyAgIHRoaXNbYWN0aW9uXSh0YXJnZXQsIHF1ZXJ5KTtcclxuICAgIC8vIH0pO1xyXG4gIH1cclxuXHJcbiAgaW5pdENvbXBvbmVudChzdG9yZSA9ICdmb3JtJywgY3VzdG9tID0ge30pIHtcclxuICAgIHJldHVybiB0aGlzLmFwcC5sb2FkU3BydWNlKClcclxuICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIFNwcnVjZS5zdG9yZShzdG9yZSwgdGhpcy51c2VTdGF0ZShjdXN0b20pKTtcclxuICAgICAgICAvLyB0aGlzLnJlZ2lzdGVyQ3VzdG9tRWxlbWVudHMoKTtcclxuICAgICAgICB0aGlzLmFwcC5zdGFydEFscGluZSgpO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIHVzZVN0YXRlKGN1c3RvbSA9IHt9KSB7XHJcbiAgICByZXR1cm4gbWVyZ2UoXHJcbiAgICAgIHRoaXMsXHJcbiAgICAgIGN1c3RvbVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE1ha2UgYSByZXF1ZXN0LlxyXG4gICAqXHJcbiAgICogQHBhcmFtICB7c3RyaW5nfSB1cmxcclxuICAgKiBAcGFyYW0gIHtPYmplY3R9IHF1ZXJpZXNcclxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IG1ldGhvZFxyXG4gICAqIEBwYXJhbSAge3N0cmluZ30gY3VzdG9tTWV0aG9kXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgKi9cclxuICBzdWJtaXQodXJsLCBxdWVyaWVzLCBtZXRob2QsIGN1c3RvbU1ldGhvZCkge1xyXG4gICAgY29uc3QgZm9ybSA9IHRoaXMuZWxlbWVudDtcclxuXHJcbiAgICBpZiAoY3VzdG9tTWV0aG9kKSB7XHJcbiAgICAgIGxldCBtZXRob2RJbnB1dCA9IGZvcm0ucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cIl9tZXRob2RcIl0nKTtcclxuXHJcbiAgICAgIGlmICghbWV0aG9kSW5wdXQpIHtcclxuICAgICAgICBtZXRob2RJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XHJcbiAgICAgICAgbWV0aG9kSW5wdXQuc2V0QXR0cmlidXRlKCduYW1lJywgJ19tZXRob2QnKTtcclxuICAgICAgICBtZXRob2RJbnB1dC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnaGlkZGVuJyk7XHJcblxyXG4gICAgICAgIGZvcm0uYXBwZW5kQ2hpbGQobWV0aG9kSW5wdXQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBtZXRob2RJbnB1dC52YWx1ZSA9IGN1c3RvbU1ldGhvZDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBTZXQgcXVlcmllcyBpbnRvIGZvcm0uXHJcbiAgICBpZiAocXVlcmllcykge1xyXG4gICAgICBsZXQgaW5wdXQ7XHJcblxyXG4gICAgICBjb25zdCBmbGF0dGVkID0gdGhpcy5jb25zdHJ1Y3Rvci5mbGF0dGVuT2JqZWN0KHF1ZXJpZXMpO1xyXG5cclxuICAgICAgZWFjaChmbGF0dGVkLCAodmFsdWUsIGtleSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGZpZWxkTmFtZSA9IHRoaXMuY29uc3RydWN0b3IuYnVpbGRGaWVsZE5hbWUoa2V5KTtcclxuICAgICAgICBpbnB1dCA9IGZvcm0ucXVlcnlTZWxlY3RvcihgaW5wdXRbbmFtZT1cIiR7ZmllbGROYW1lfVwiXWApO1xyXG5cclxuICAgICAgICBpZiAoIWlucHV0KSB7XHJcbiAgICAgICAgICBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XHJcbiAgICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ25hbWUnLCBmaWVsZE5hbWUpO1xyXG4gICAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ2hpZGRlbicpO1xyXG5cclxuICAgICAgICAgIGZvcm0uYXBwZW5kQ2hpbGQoaW5wdXQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5wdXQudmFsdWUgPSB2YWx1ZTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHVybCkge1xyXG4gICAgICBmb3JtLnNldEF0dHJpYnV0ZSgnYWN0aW9uJywgdXJsKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAobWV0aG9kKSB7XHJcbiAgICAgIGZvcm0uc2V0QXR0cmlidXRlKCdtZXRob2QnLCBtZXRob2QpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENyZWF0ZSBhIHN1Ym1pdCBidXR0b24gdGhhdCBjYW4gZmlyZSBgc3VibWl0YCBldmVudFxyXG4gICAgbGV0IHN1Ym1pdEJ1dHRvbiA9IGZvcm0ucXVlcnlTZWxlY3RvcihgYnV0dG9uW3R5cGU9c3VibWl0XVtkYXRhLXN1Ym1pdF1gKTtcclxuXHJcbiAgICBpZiAoIXN1Ym1pdEJ1dHRvbikge1xyXG4gICAgICBzdWJtaXRCdXR0b24gPSB0aGlzLmFwcC5oKCdidXR0b24nLCB7IHR5cGU6ICdzdWJtaXQnIH0sICdHTycpO1xyXG4gICAgICBzdWJtaXRCdXR0b24uZGF0YXNldC5zdWJtaXQgPSB0cnVlO1xyXG4gICAgICBzdWJtaXRCdXR0b24uc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgZm9ybS5hcHBlbmRDaGlsZChzdWJtaXRCdXR0b24pO1xyXG4gICAgfVxyXG5cclxuICAgIHN1Ym1pdEJ1dHRvbi5jbGljaygpO1xyXG5cclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTWFrZSBhIEdFVCByZXF1ZXN0LlxyXG4gICAqXHJcbiAgICogQHBhcmFtICB7c3RyaW5nfSB1cmxcclxuICAgKiBAcGFyYW0gIHtPYmplY3R9IHF1ZXJpZXNcclxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IGN1c3RvbU1ldGhvZFxyXG4gICAqXHJcbiAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICovXHJcbiAgZ2V0KHVybCwgcXVlcmllcywgY3VzdG9tTWV0aG9kKSB7XHJcbiAgICByZXR1cm4gdGhpcy5zdWJtaXQodXJsLCBxdWVyaWVzLCAnR0VUJywgY3VzdG9tTWV0aG9kKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFBvc3QgZm9ybS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSAge3N0cmluZ30gdXJsXHJcbiAgICogQHBhcmFtICB7T2JqZWN0fSBxdWVyaWVzXHJcbiAgICogQHBhcmFtICB7c3RyaW5nfSBjdXN0b21NZXRob2RcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAqL1xyXG4gIHBvc3QodXJsLCBxdWVyaWVzLCBjdXN0b21NZXRob2QpIHtcclxuICAgIGN1c3RvbU1ldGhvZCA9IGN1c3RvbU1ldGhvZCB8fCAnUE9TVCc7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuc3VibWl0KHVybCwgcXVlcmllcywgJ1BPU1QnLCBjdXN0b21NZXRob2QpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTWFrZSBhIFBVVCByZXF1ZXN0LlxyXG4gICAqXHJcbiAgICogQHBhcmFtICB7c3RyaW5nfSB1cmxcclxuICAgKiBAcGFyYW0gIHtPYmplY3R9IHF1ZXJpZXNcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAqL1xyXG4gIHB1dCh1cmwsIHF1ZXJpZXMpIHtcclxuICAgIHJldHVybiB0aGlzLnBvc3QodXJsLCBxdWVyaWVzLCAnUFVUJyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNYWtlIGEgUEFUQ0ggcmVxdWVzdC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSAge3N0cmluZ30gdXJsXHJcbiAgICogQHBhcmFtICB7T2JqZWN0fSBxdWVyaWVzXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgKi9cclxuICBwYXRjaCh1cmwsIHF1ZXJpZXMpIHtcclxuICAgIHJldHVybiB0aGlzLnBvc3QodXJsLCBxdWVyaWVzLCAnUEFUQ0gnKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE1ha2UgYSBERUxFVEUgcmVxdWVzdC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSAge3N0cmluZ30gdXJsXHJcbiAgICogQHBhcmFtICB7T2JqZWN0fSBxdWVyaWVzXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgKi9cclxuICBkZWxldGUodXJsLCBxdWVyaWVzKSB7XHJcbiAgICByZXR1cm4gdGhpcy5wb3N0KHVybCwgcXVlcmllcywgJ0RFTEVURScpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQHNlZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNTM3Mzk3OTJcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYlxyXG4gICAqIEByZXR1cm5zIHtPYmplY3R9XHJcbiAgICovXHJcbiAgc3RhdGljIGZsYXR0ZW5PYmplY3Qob2IpIHtcclxuICAgIGNvbnN0IHRvUmV0dXJuID0ge307XHJcblxyXG4gICAgZm9yIChsZXQgaSBpbiBvYikge1xyXG4gICAgICBpZiAoIW9iLmhhc093blByb3BlcnR5KGkpKSB7XHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICgodHlwZW9mIG9iW2ldKSA9PT0gJ29iamVjdCcgJiYgb2JbaV0gIT0gbnVsbCkge1xyXG4gICAgICAgIGNvbnN0IGZsYXRPYmplY3QgPSB0aGlzLmZsYXR0ZW5PYmplY3Qob2JbaV0pO1xyXG5cclxuICAgICAgICBmb3IgKGxldCB4IGluIGZsYXRPYmplY3QpIHtcclxuICAgICAgICAgIGlmICghZmxhdE9iamVjdC5oYXNPd25Qcm9wZXJ0eSh4KSkge1xyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB0b1JldHVybltpICsgJy8nICsgeF0gPSBmbGF0T2JqZWN0W3hdO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0b1JldHVybltpXSA9IG9iW2ldO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdG9SZXR1cm47XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgYnVpbGRGaWVsZE5hbWUoZmllbGQpIHtcclxuICAgIGNvbnN0IG5hbWVzID0gZmllbGQuc3BsaXQoJy8nKTtcclxuXHJcbiAgICBjb25zdCBmaXJzdCA9IG5hbWVzLnNoaWZ0KCk7XHJcblxyXG4gICAgcmV0dXJuIGZpcnN0ICsgbmFtZXMubWFwKG5hbWUgPT4gYFske25hbWV9XWApLmpvaW4oJycpO1xyXG4gIH1cclxufVxyXG4iLCIvKipcbiAqIFBhcnQgb2Ygc3RhcnRlciBwcm9qZWN0LlxuICpcbiAqIEBjb3B5cmlnaHQgIENvcHlyaWdodCAoQykgMjAyMSBfX09SR0FOSVpBVElPTl9fLlxuICogQGxpY2Vuc2UgICAgX19MSUNFTlNFX19cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVbmljb3JuTG9hZGVyIHtcbiAgc3RhdGljIGluc3RhbGwoYXBwKSB7XG4gICAgYXBwLmltcG9ydCA9IHRoaXMuaW1wb3J0O1xuICB9XG5cbiAgc3RhdGljIGltcG9ydChzcmMpIHtcbiAgICBjb25zdCBzID0gd2luZG93LlN5c3RlbTtcblxuICAgIHJldHVybiBzLmltcG9ydChzcmMpO1xuICB9XG59XG4iLCIvKiBnbG9iYWwgd2luZG93LCBleHBvcnRzLCBkZWZpbmUgKi9cblxuIWZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0J1xuXG4gICAgdmFyIHJlID0ge1xuICAgICAgICBub3Rfc3RyaW5nOiAvW15zXS8sXG4gICAgICAgIG5vdF9ib29sOiAvW150XS8sXG4gICAgICAgIG5vdF90eXBlOiAvW15UXS8sXG4gICAgICAgIG5vdF9wcmltaXRpdmU6IC9bXnZdLyxcbiAgICAgICAgbnVtYmVyOiAvW2RpZWZnXS8sXG4gICAgICAgIG51bWVyaWNfYXJnOiAvW2JjZGllZmd1eFhdLyxcbiAgICAgICAganNvbjogL1tqXS8sXG4gICAgICAgIG5vdF9qc29uOiAvW15qXS8sXG4gICAgICAgIHRleHQ6IC9eW15cXHgyNV0rLyxcbiAgICAgICAgbW9kdWxvOiAvXlxceDI1ezJ9LyxcbiAgICAgICAgcGxhY2Vob2xkZXI6IC9eXFx4MjUoPzooWzEtOV1cXGQqKVxcJHxcXCgoW14pXSspXFwpKT8oXFwrKT8oMHwnW14kXSk/KC0pPyhcXGQrKT8oPzpcXC4oXFxkKykpPyhbYi1naWpvc3RUdXZ4WF0pLyxcbiAgICAgICAga2V5OiAvXihbYS16X11bYS16X1xcZF0qKS9pLFxuICAgICAgICBrZXlfYWNjZXNzOiAvXlxcLihbYS16X11bYS16X1xcZF0qKS9pLFxuICAgICAgICBpbmRleF9hY2Nlc3M6IC9eXFxbKFxcZCspXFxdLyxcbiAgICAgICAgc2lnbjogL15bKy1dL1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNwcmludGYoa2V5KSB7XG4gICAgICAgIC8vIGBhcmd1bWVudHNgIGlzIG5vdCBhbiBhcnJheSwgYnV0IHNob3VsZCBiZSBmaW5lIGZvciB0aGlzIGNhbGxcbiAgICAgICAgcmV0dXJuIHNwcmludGZfZm9ybWF0KHNwcmludGZfcGFyc2Uoa2V5KSwgYXJndW1lbnRzKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZzcHJpbnRmKGZtdCwgYXJndikge1xuICAgICAgICByZXR1cm4gc3ByaW50Zi5hcHBseShudWxsLCBbZm10XS5jb25jYXQoYXJndiB8fCBbXSkpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3ByaW50Zl9mb3JtYXQocGFyc2VfdHJlZSwgYXJndikge1xuICAgICAgICB2YXIgY3Vyc29yID0gMSwgdHJlZV9sZW5ndGggPSBwYXJzZV90cmVlLmxlbmd0aCwgYXJnLCBvdXRwdXQgPSAnJywgaSwgaywgcGgsIHBhZCwgcGFkX2NoYXJhY3RlciwgcGFkX2xlbmd0aCwgaXNfcG9zaXRpdmUsIHNpZ25cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRyZWVfbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcGFyc2VfdHJlZVtpXSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gcGFyc2VfdHJlZVtpXVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIHBhcnNlX3RyZWVbaV0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgcGggPSBwYXJzZV90cmVlW2ldIC8vIGNvbnZlbmllbmNlIHB1cnBvc2VzIG9ubHlcbiAgICAgICAgICAgICAgICBpZiAocGgua2V5cykgeyAvLyBrZXl3b3JkIGFyZ3VtZW50XG4gICAgICAgICAgICAgICAgICAgIGFyZyA9IGFyZ3ZbY3Vyc29yXVxuICAgICAgICAgICAgICAgICAgICBmb3IgKGsgPSAwOyBrIDwgcGgua2V5cy5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFyZyA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3Ioc3ByaW50ZignW3NwcmludGZdIENhbm5vdCBhY2Nlc3MgcHJvcGVydHkgXCIlc1wiIG9mIHVuZGVmaW5lZCB2YWx1ZSBcIiVzXCInLCBwaC5rZXlzW2tdLCBwaC5rZXlzW2stMV0pKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJnW3BoLmtleXNba11dXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocGgucGFyYW1fbm8pIHsgLy8gcG9zaXRpb25hbCBhcmd1bWVudCAoZXhwbGljaXQpXG4gICAgICAgICAgICAgICAgICAgIGFyZyA9IGFyZ3ZbcGgucGFyYW1fbm9dXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgeyAvLyBwb3NpdGlvbmFsIGFyZ3VtZW50IChpbXBsaWNpdClcbiAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJndltjdXJzb3IrK11cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocmUubm90X3R5cGUudGVzdChwaC50eXBlKSAmJiByZS5ub3RfcHJpbWl0aXZlLnRlc3QocGgudHlwZSkgJiYgYXJnIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJnKClcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocmUubnVtZXJpY19hcmcudGVzdChwaC50eXBlKSAmJiAodHlwZW9mIGFyZyAhPT0gJ251bWJlcicgJiYgaXNOYU4oYXJnKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihzcHJpbnRmKCdbc3ByaW50Zl0gZXhwZWN0aW5nIG51bWJlciBidXQgZm91bmQgJVQnLCBhcmcpKVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChyZS5udW1iZXIudGVzdChwaC50eXBlKSkge1xuICAgICAgICAgICAgICAgICAgICBpc19wb3NpdGl2ZSA9IGFyZyA+PSAwXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc3dpdGNoIChwaC50eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2InOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gcGFyc2VJbnQoYXJnLCAxMCkudG9TdHJpbmcoMilcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2MnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gU3RyaW5nLmZyb21DaGFyQ29kZShwYXJzZUludChhcmcsIDEwKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2QnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlICdpJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IHBhcnNlSW50KGFyZywgMTApXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdqJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IEpTT04uc3RyaW5naWZ5KGFyZywgbnVsbCwgcGgud2lkdGggPyBwYXJzZUludChwaC53aWR0aCkgOiAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnZSc6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBwaC5wcmVjaXNpb24gPyBwYXJzZUZsb2F0KGFyZykudG9FeHBvbmVudGlhbChwaC5wcmVjaXNpb24pIDogcGFyc2VGbG9hdChhcmcpLnRvRXhwb25lbnRpYWwoKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnZic6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBwaC5wcmVjaXNpb24gPyBwYXJzZUZsb2F0KGFyZykudG9GaXhlZChwaC5wcmVjaXNpb24pIDogcGFyc2VGbG9hdChhcmcpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdnJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IHBoLnByZWNpc2lvbiA/IFN0cmluZyhOdW1iZXIoYXJnLnRvUHJlY2lzaW9uKHBoLnByZWNpc2lvbikpKSA6IHBhcnNlRmxvYXQoYXJnKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnbyc6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSAocGFyc2VJbnQoYXJnLCAxMCkgPj4+IDApLnRvU3RyaW5nKDgpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdzJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IFN0cmluZyhhcmcpXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSAocGgucHJlY2lzaW9uID8gYXJnLnN1YnN0cmluZygwLCBwaC5wcmVjaXNpb24pIDogYXJnKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAndCc6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBTdHJpbmcoISFhcmcpXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSAocGgucHJlY2lzaW9uID8gYXJnLnN1YnN0cmluZygwLCBwaC5wcmVjaXNpb24pIDogYXJnKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnVCc6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJnKS5zbGljZSg4LCAtMSkudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gKHBoLnByZWNpc2lvbiA/IGFyZy5zdWJzdHJpbmcoMCwgcGgucHJlY2lzaW9uKSA6IGFyZylcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3UnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gcGFyc2VJbnQoYXJnLCAxMCkgPj4+IDBcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3YnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJnLnZhbHVlT2YoKVxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gKHBoLnByZWNpc2lvbiA/IGFyZy5zdWJzdHJpbmcoMCwgcGgucHJlY2lzaW9uKSA6IGFyZylcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3gnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gKHBhcnNlSW50KGFyZywgMTApID4+PiAwKS50b1N0cmluZygxNilcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ1gnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gKHBhcnNlSW50KGFyZywgMTApID4+PiAwKS50b1N0cmluZygxNikudG9VcHBlckNhc2UoKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJlLmpzb24udGVzdChwaC50eXBlKSkge1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXQgKz0gYXJnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmUubnVtYmVyLnRlc3QocGgudHlwZSkgJiYgKCFpc19wb3NpdGl2ZSB8fCBwaC5zaWduKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2lnbiA9IGlzX3Bvc2l0aXZlID8gJysnIDogJy0nXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBhcmcudG9TdHJpbmcoKS5yZXBsYWNlKHJlLnNpZ24sICcnKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2lnbiA9ICcnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcGFkX2NoYXJhY3RlciA9IHBoLnBhZF9jaGFyID8gcGgucGFkX2NoYXIgPT09ICcwJyA/ICcwJyA6IHBoLnBhZF9jaGFyLmNoYXJBdCgxKSA6ICcgJ1xuICAgICAgICAgICAgICAgICAgICBwYWRfbGVuZ3RoID0gcGgud2lkdGggLSAoc2lnbiArIGFyZykubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgIHBhZCA9IHBoLndpZHRoID8gKHBhZF9sZW5ndGggPiAwID8gcGFkX2NoYXJhY3Rlci5yZXBlYXQocGFkX2xlbmd0aCkgOiAnJykgOiAnJ1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXQgKz0gcGguYWxpZ24gPyBzaWduICsgYXJnICsgcGFkIDogKHBhZF9jaGFyYWN0ZXIgPT09ICcwJyA/IHNpZ24gKyBwYWQgKyBhcmcgOiBwYWQgKyBzaWduICsgYXJnKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0cHV0XG4gICAgfVxuXG4gICAgdmFyIHNwcmludGZfY2FjaGUgPSBPYmplY3QuY3JlYXRlKG51bGwpXG5cbiAgICBmdW5jdGlvbiBzcHJpbnRmX3BhcnNlKGZtdCkge1xuICAgICAgICBpZiAoc3ByaW50Zl9jYWNoZVtmbXRdKSB7XG4gICAgICAgICAgICByZXR1cm4gc3ByaW50Zl9jYWNoZVtmbXRdXG4gICAgICAgIH1cblxuICAgICAgICB2YXIgX2ZtdCA9IGZtdCwgbWF0Y2gsIHBhcnNlX3RyZWUgPSBbXSwgYXJnX25hbWVzID0gMFxuICAgICAgICB3aGlsZSAoX2ZtdCkge1xuICAgICAgICAgICAgaWYgKChtYXRjaCA9IHJlLnRleHQuZXhlYyhfZm10KSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBwYXJzZV90cmVlLnB1c2gobWF0Y2hbMF0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICgobWF0Y2ggPSByZS5tb2R1bG8uZXhlYyhfZm10KSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBwYXJzZV90cmVlLnB1c2goJyUnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoKG1hdGNoID0gcmUucGxhY2Vob2xkZXIuZXhlYyhfZm10KSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2hbMl0pIHtcbiAgICAgICAgICAgICAgICAgICAgYXJnX25hbWVzIHw9IDFcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZpZWxkX2xpc3QgPSBbXSwgcmVwbGFjZW1lbnRfZmllbGQgPSBtYXRjaFsyXSwgZmllbGRfbWF0Y2ggPSBbXVxuICAgICAgICAgICAgICAgICAgICBpZiAoKGZpZWxkX21hdGNoID0gcmUua2V5LmV4ZWMocmVwbGFjZW1lbnRfZmllbGQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRfbGlzdC5wdXNoKGZpZWxkX21hdGNoWzFdKVxuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKChyZXBsYWNlbWVudF9maWVsZCA9IHJlcGxhY2VtZW50X2ZpZWxkLnN1YnN0cmluZyhmaWVsZF9tYXRjaFswXS5sZW5ndGgpKSAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGZpZWxkX21hdGNoID0gcmUua2V5X2FjY2Vzcy5leGVjKHJlcGxhY2VtZW50X2ZpZWxkKSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRfbGlzdC5wdXNoKGZpZWxkX21hdGNoWzFdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICgoZmllbGRfbWF0Y2ggPSByZS5pbmRleF9hY2Nlc3MuZXhlYyhyZXBsYWNlbWVudF9maWVsZCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkX2xpc3QucHVzaChmaWVsZF9tYXRjaFsxXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcignW3NwcmludGZdIGZhaWxlZCB0byBwYXJzZSBuYW1lZCBhcmd1bWVudCBrZXknKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcignW3NwcmludGZdIGZhaWxlZCB0byBwYXJzZSBuYW1lZCBhcmd1bWVudCBrZXknKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG1hdGNoWzJdID0gZmllbGRfbGlzdFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYXJnX25hbWVzIHw9IDJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGFyZ19uYW1lcyA9PT0gMykge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1tzcHJpbnRmXSBtaXhpbmcgcG9zaXRpb25hbCBhbmQgbmFtZWQgcGxhY2Vob2xkZXJzIGlzIG5vdCAoeWV0KSBzdXBwb3J0ZWQnKVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHBhcnNlX3RyZWUucHVzaChcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI6IG1hdGNoWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1fbm86ICAgIG1hdGNoWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAga2V5czogICAgICAgIG1hdGNoWzJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2lnbjogICAgICAgIG1hdGNoWzNdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFkX2NoYXI6ICAgIG1hdGNoWzRdLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWxpZ246ICAgICAgIG1hdGNoWzVdLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICAgICAgIG1hdGNoWzZdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJlY2lzaW9uOiAgIG1hdGNoWzddLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogICAgICAgIG1hdGNoWzhdXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoJ1tzcHJpbnRmXSB1bmV4cGVjdGVkIHBsYWNlaG9sZGVyJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF9mbXQgPSBfZm10LnN1YnN0cmluZyhtYXRjaFswXS5sZW5ndGgpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNwcmludGZfY2FjaGVbZm10XSA9IHBhcnNlX3RyZWVcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBleHBvcnQgdG8gZWl0aGVyIGJyb3dzZXIgb3Igbm9kZS5qc1xuICAgICAqL1xuICAgIC8qIGVzbGludC1kaXNhYmxlIHF1b3RlLXByb3BzICovXG4gICAgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBleHBvcnRzWydzcHJpbnRmJ10gPSBzcHJpbnRmXG4gICAgICAgIGV4cG9ydHNbJ3ZzcHJpbnRmJ10gPSB2c3ByaW50ZlxuICAgIH1cbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgd2luZG93WydzcHJpbnRmJ10gPSBzcHJpbnRmXG4gICAgICAgIHdpbmRvd1sndnNwcmludGYnXSA9IHZzcHJpbnRmXG5cbiAgICAgICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lWydhbWQnXSkge1xuICAgICAgICAgICAgZGVmaW5lKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICdzcHJpbnRmJzogc3ByaW50ZixcbiAgICAgICAgICAgICAgICAgICAgJ3ZzcHJpbnRmJzogdnNwcmludGZcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qIGVzbGludC1lbmFibGUgcXVvdGUtcHJvcHMgKi9cbn0oKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuIiwiLyoqXG4gKiBQYXJ0IG9mIHVuaWNvcm4gcHJvamVjdC5cbiAqXG4gKiBAY29weXJpZ2h0ICBDb3B5cmlnaHQgKEMpIDIwMTggJHtPUkdBTklaQVRJT059LlxuICogQGxpY2Vuc2UgICAgX19MSUNFTlNFX19cbiAqL1xuXG5pbXBvcnQgeyBwcmVwYXJlRGF0YSB9IGZyb20gJy4vdXRpbGl0aWVzLmpzJztcbmltcG9ydCAnc3ByaW50Zi1qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFVuaWNvcm5IZWxwZXIge1xuICBzdGF0aWMgZ2V0IGlzKCkgeyByZXR1cm4gJ2hlbHBlcic7IH1cblxuICBzdGF0aWMgaW5zdGFsbChhcHAsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGhlbHBlciA9IGFwcC4kaGVscGVyID0gbmV3IHRoaXMoYXBwKTtcblxuICAgIGFwcC5zZWxlY3RPbmUgPSBoZWxwZXIuc2VsZWN0T25lLmJpbmQoaGVscGVyKTtcbiAgICBhcHAuc2VsZWN0QWxsID0gaGVscGVyLnNlbGVjdEFsbDtcbiAgICBhcHAuaCA9IGhlbHBlci5oO1xuICAgIGFwcC4kZ2V0ID0gaGVscGVyLiRnZXQ7XG4gICAgYXBwLiRzZXQgPSBoZWxwZXIuJHNldDtcbiAgICBhcHAuaXNEZWJ1ZyA9IGhlbHBlci5pc0RlYnVnLmJpbmQoaGVscGVyKTtcbiAgICBhcHAuY29uZmlybSA9IGhlbHBlci5jb25maXJtLmJpbmQoaGVscGVyKTtcbiAgICBhcHAua2VlcEFsaXZlID0gaGVscGVyLmtlZXBBbGl2ZS5iaW5kKGhlbHBlcik7XG4gICAgYXBwLnN0b3BLZWVwQWxpdmUgPSBoZWxwZXIuc3RvcEtlZXBBbGl2ZTtcbiAgICBhcHAuaXNOdWxsRGF0ZSA9IGhlbHBlci5pc051bGxEYXRlLmJpbmQoaGVscGVyKTtcbiAgICBhcHAuZ2V0TnVsbERhdGUgPSBoZWxwZXIuZ2V0TnVsbERhdGUuYmluZChoZWxwZXIpO1xuICAgIGFwcC5udW1iZXJGb3JtYXQgPSBoZWxwZXIubnVtYmVyRm9ybWF0O1xuICAgIGFwcC5zcHJpbnRmID0gc3ByaW50ZjtcbiAgICBhcHAudnNwcmludGYgPSB2c3ByaW50ZjtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGFwcCkge1xuICAgIHRoaXMuYXBwID0gYXBwO1xuICAgIHRoaXMuYWxpdmVIYW5kbGUgPSBudWxsO1xuICB9XG5cbiAgc2VsZWN0T25lKGVsZSkge1xuICAgaWYgKHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnKSB7XG4gICAgIGVsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWxlKTtcbiAgIH1cblxuICAgcmV0dXJuIHByZXBhcmVEYXRhKGVsZSk7XG4gIH1cblxuICBzZWxlY3RBbGwoZWxlLCBjYWxsYmFjaykge1xuICAgIGlmICh0eXBlb2YgZWxlID09PSAnc3RyaW5nJykge1xuICAgICAgZWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChlbGUpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdFNldCA9IFtdLnNsaWNlLmNhbGwoZWxlKTtcblxuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgcmV0dXJuIHJlc3VsdFNldC5tYXAoY2FsbGJhY2spO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHRTZXQ7XG4gIH1cblxuICBoKGVsZW1lbnQsIGF0dHJzID0ge30sIGNvbnRlbnQgPSBudWxsKSB7XG4gICAgY29uc3QgZWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChlbGVtZW50KTtcblxuICAgIGZvciAobGV0IGkgaW4gYXR0cnMpIHtcbiAgICAgIGNvbnN0IHYgPSBhdHRyc1tpXTtcblxuICAgICAgZWxlLnNldEF0dHJpYnV0ZShpLCB2KTtcbiAgICB9XG5cbiAgICBpZiAoY29udGVudCAhPT0gbnVsbCkge1xuICAgICAgZWxlLmlubmVySFRNTCA9IGNvbnRlbnQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVsZTtcbiAgfVxuXG4gIGdldChvYmosIHBhdGgpIHtcbiAgICBjb25zdCBrZXlzID0gQXJyYXkuaXNBcnJheShwYXRoKSA/IHBhdGggOiBwYXRoLnNwbGl0KCcuJyk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGtleSA9IGtleXNbaV07XG5cbiAgICAgIGlmICghb2JqIHx8ICFvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBvYmogPSB1bmRlZmluZWQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBvYmogPSBvYmpba2V5XTtcbiAgICB9XG5cbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAgc2V0KG9iaiwgcGF0aCwgdmFsdWUpIHtcbiAgICBjb25zdCBrZXlzID0gQXJyYXkuaXNBcnJheShwYXRoKSA/IHBhdGggOiBwYXRoLnNwbGl0KCcuJyk7XG4gICAgbGV0IGk7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwga2V5cy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgIGNvbnN0IGtleSA9IGtleXNbaV07XG5cbiAgICAgIGlmICghb2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgb2JqW2tleV0gPSB7fTtcbiAgICAgIH1cblxuICAgICAgb2JqID0gb2JqW2tleV07XG4gICAgfVxuXG4gICAgb2JqW2tleXNbaV1dID0gdmFsdWU7XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBpc0RlYnVnKCkge1xuICAgIHJldHVybiBCb29sZWFuKHRoaXMuYXBwLmRhdGEoJ3dpbmR3YWxrZXIuZGVidWcnKSk7XG4gIH1cblxuICAvKipcbiAgICogQ29uZmlybSBwb3B1cC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9ICAgbWVzc2FnZVxuICAgKlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKi9cbiAgY29uZmlybShtZXNzYWdlKSB7XG4gICAgbWVzc2FnZSA9IG1lc3NhZ2UgfHwgJ0FyZSB5b3Ugc3VyZT8nO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICByZXNvbHZlKGNvbmZpcm0obWVzc2FnZSkpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gbG9hZFNjcmlwdCh1cmxzLCBhdXRvQ29udmVydCA9IHRydWUpIHtcbiAgLy8gICBpZiAodHlwZW9mIHVybHMgPT09ICdzdHJpbmcnKSB7XG4gIC8vICAgICB1cmxzID0gW3VybHNdO1xuICAvLyAgIH1cbiAgLy9cbiAgLy8gICBjb25zdCBwcm9taXNlcyA9IFtdO1xuICAvLyAgIGNvbnN0IGRhdGEgPSB7fTtcbiAgLy8gICBjb25zdCBlbmRzV2l0aCA9IChzdHIsIHN1ZmZpeCkgPT4gc3RyLmluZGV4T2Yoc3VmZml4LCBzdHIubGVuZ3RoIC0gc3VmZml4Lmxlbmd0aCkgPj0gMDtcbiAgLy8gICBkYXRhW3RoaXMuYXBwLmFzc2V0KCd2ZXJzaW9uJyldID0gJzEnO1xuICAvL1xuICAvLyAgIHVybHMuZm9yRWFjaCh1cmwgPT4ge1xuICAvLyAgICAgY29uc3QgZXh0ID0gdXJsLnNwbGl0KCcuJykucG9wKCk7XG4gIC8vICAgICBsZXQgbG9hZFVyaSA9IHVybDtcbiAgLy9cbiAgLy8gICAgIGlmIChhdXRvQ29udmVydCkge1xuICAvLyAgICAgICBsZXQgYXNzZXRGaWxlLCBhc3NldE1pbkZpbGU7XG4gIC8vXG4gIC8vICAgICAgIGlmIChlbmRzV2l0aCh1cmwsICcubWluLicgKyBleHQpKSB7XG4gIC8vICAgICAgICAgYXNzZXRNaW5GaWxlID0gdXJsO1xuICAvLyAgICAgICAgIGFzc2V0RmlsZSA9IHVybC5zbGljZSgwLCAtYC5taW4uJHtleHR9YC5sZW5ndGgpICsgJy4nICsgZXh0O1xuICAvLyAgICAgICB9IGVsc2Uge1xuICAvLyAgICAgICAgIGFzc2V0RmlsZSA9IHVybDtcbiAgLy8gICAgICAgICBhc3NldE1pbkZpbGUgPSB1cmwuc2xpY2UoMCwgLWAuJHtleHR9YC5sZW5ndGgpICsgJy5taW4uJyArIGV4dDtcbiAgLy8gICAgICAgfVxuICAvL1xuICAvLyAgICAgICBsb2FkVXJpID0gdGhpcy5hcHAuZGF0YSgnd2luZHdhbGtlci5kZWJ1ZycpID8gYXNzZXRGaWxlIDogYXNzZXRNaW5GaWxlO1xuICAvLyAgICAgfVxuICAvL1xuICAvLyAgICAgcHJvbWlzZXMucHVzaChcbiAgLy8gICAgICAgJC5nZXRTY3JpcHQoe1xuICAvLyAgICAgICAgIHVybDogdGhpcy5hZGRVcmlCYXNlKGxvYWRVcmkpLFxuICAvLyAgICAgICAgIGNhY2hlOiB0cnVlLFxuICAvLyAgICAgICAgIGRhdGFcbiAgLy8gICAgICAgfSlcbiAgLy8gICAgICk7XG4gIC8vICAgfSk7XG4gIC8vXG4gIC8vICAgcmV0dXJuICQud2hlbiguLi5wcm9taXNlcyk7XG4gIC8vIH1cblxuICBhZGRVcmlCYXNlKHVyaSwgdHlwZSA9ICdwYXRoJykge1xuICAgIGlmICh1cmkuc3Vic3RyKDAsIDIpID09PSAnL1xcLycgfHwgdXJpLnN1YnN0cigwLCA0KSA9PT0gJ2h0dHAnKSB7XG4gICAgICByZXR1cm4gdXJpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmFwcC5hc3NldCh0eXBlKSArICcvJyArIHVyaTtcbiAgfVxuXG4gIC8qKlxuICAgKiBOb3RpZnkgaW5mb3JtYXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfEFycmF5fSBtZXNzYWdlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICB0eXBlXG4gICAqIEByZXR1cm5zIHsqfVxuICAgKi9cbiAgLy8gbm90aWZ5KG1lc3NhZ2UsIHR5cGUgPSAnaW5mbycpIHtcbiAgLy8gICByZXR1cm4gdGhpcy5hcHAuYWRkTWVzc2FnZShtZXNzYWdlLCB0eXBlKTtcbiAgLy8gfVxuXG4gIC8qKlxuICAgKiBLZWVwIGFsaXZlLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn1cbiAgICovXG4gIGtlZXBBbGl2ZSh1cmwsIHRpbWUgPSA2MDAwMCkge1xuICAgIHJldHVybiB0aGlzLmFsaXZlSGFuZGxlID0gd2luZG93LnNldEludGVydmFsKCgpID0+IGZldGNoKHVybCksIHRpbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0b3Aga2VlcCBhbGl2ZVxuICAgKi9cbiAgc3RvcEtlZXBBbGl2ZSgpIHtcbiAgICBjbGVhckludGVydmFsKHRoaXMuYWxpdmVIYW5kbGUpO1xuXG4gICAgdGhpcy5hbGl2ZUhhbmRsZSA9ICBudWxsO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogSXMgTlVMTCBkYXRlIGZyb20gZGVmYXVsdCBTUUwuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBkYXRlXG4gICAqL1xuICBpc051bGxEYXRlKGRhdGUpIHtcbiAgICByZXR1cm4gWycwMDAwLTAwLTAwIDAwOjAwOjAwJywgdGhpcy5nZXROdWxsRGF0ZSgpXS5pbmRleE9mKGRhdGUpICE9PSAtMTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgTlVMTCBkYXRlIGZyb20gZGVmYXVsdCBTUUwuXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICBnZXROdWxsRGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5hcHAuZGF0YSgndW5pY29ybi5kYXRlJylbJ2VtcHR5J107XG4gIH1cblxuICAvKipcbiAgICogTnVtYmVyIGZvcm1hdCBsaWtlIHBocCBmdW5jdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd8bnVtYmVyfSBudW1iZXJcbiAgICogQHBhcmFtIHtudW1iZXJ9ICAgICAgICBkZWNpbWFsc1xuICAgKiBAcGFyYW0ge3N0cmluZ30gICAgICAgIGRlY1BvaW50XG4gICAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgdGhvdXNhbmRzU2VwXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICBudW1iZXJGb3JtYXQobnVtYmVyLCBkZWNpbWFscyA9IDAsIGRlY1BvaW50ID0gJy4nLCB0aG91c2FuZHNTZXAgPSAnLCcpIHtcbiAgICBkZWNpbWFscyA9IGRlY2ltYWxzIHx8IDA7XG4gICAgbnVtYmVyID0gcGFyc2VGbG9hdChudW1iZXIpO1xuXG4gICAgbGV0IHJvdW5kZWROdW1iZXIgPSBNYXRoLnJvdW5kKE1hdGguYWJzKG51bWJlcikgKiAoJzFlJyArIGRlY2ltYWxzKSkgKyAnJztcbiAgICBsZXQgbnVtYmVyc1N0cmluZyA9IGRlY2ltYWxzID8gcm91bmRlZE51bWJlci5zbGljZSgwLCBkZWNpbWFscyAqIC0xKSA6IHJvdW5kZWROdW1iZXI7XG4gICAgbGV0IGRlY2ltYWxzU3RyaW5nID0gZGVjaW1hbHMgPyByb3VuZGVkTnVtYmVyLnNsaWNlKGRlY2ltYWxzICogLTEpIDogJyc7XG4gICAgbGV0IGZvcm1hdHRlZE51bWJlciA9IFwiXCI7XG5cbiAgICB3aGlsZSAobnVtYmVyc1N0cmluZy5sZW5ndGggPiAzKSB7XG4gICAgICBmb3JtYXR0ZWROdW1iZXIgKz0gdGhvdXNhbmRzU2VwICsgbnVtYmVyc1N0cmluZy5zbGljZSgtMyk7XG4gICAgICBudW1iZXJzU3RyaW5nID0gbnVtYmVyc1N0cmluZy5zbGljZSgwLCAtMyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChudW1iZXIgPCAwID8gJy0nIDogJycpICsgbnVtYmVyc1N0cmluZyArIGZvcm1hdHRlZE51bWJlciArIChkZWNpbWFsc1N0cmluZyA/IChkZWNQb2ludCArIGRlY2ltYWxzU3RyaW5nKSA6ICcnKTtcbiAgfVxufVxuIiwiLyoqXG4gKiBQYXJ0IG9mIFVuaWNvcm4gcHJvamVjdC5cbiAqXG4gKiBAY29weXJpZ2h0ICBDb3B5cmlnaHQgKEMpIDIwMTYgTFlSQVNPRlQuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBAbGljZW5zZSAgICBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDIgb3IgbGF0ZXIuXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVW5pY29ybkh0dHAge1xuICBnbG9iYWxBeGlvcztcbiAgYXhpb3M7XG5cbiAgc3RhdGljIGdldCBpcygpIHsgcmV0dXJuICdodHRwJzsgfVxuXG4gIHN0YXRpYyBpbnN0YWxsKGFwcCwgb3B0aW9ucykge1xuICAgIGFwcC4kaHR0cCA9IG5ldyB0aGlzKGFwcCk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihhcHApIHtcbiAgICB0aGlzLmFwcCA9IGFwcDtcblxuICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgY3VzdG9tTWV0aG9kOiBmYWxzZSxcbiAgICB9O1xuXG4gICAgdGhpcy5kYXRhID0ge307XG4gIH1cblxuICBnZXQgZ2V0U2VsZigpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGNyZWF0ZUh0dHAoKSB7XG4gICAgaWYgKCF0aGlzLmdsb2JhbEF4aW9zKSB7XG4gICAgICB0aGlzLmdsb2JhbEF4aW9zID0gdGhpcy5hcHAuaW1wb3J0KCdAYXhpb3MnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5nbG9iYWxBeGlvcy50aGVuKChheGlvcykgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuYXhpb3MgPSBheGlvcy5jcmVhdGUodGhpcy5vcHRpb25zLmF4aW9zIHx8IHt9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldEh0dHAoKSB7XG4gICAgaWYgKHRoaXMuYXhpb3MpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5heGlvcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuY3JlYXRlSHR0cCgpLnRoZW4oKGF4aW9zKSA9PiB0aGlzLmF4aW9zID0gYXhpb3MpO1xuICB9XG5cbiAgcHJlcGFyZUF4aW9zKGF4aW9zKSB7XG4gICAgYXhpb3MuaW50ZXJjZXB0b3JzLnJlcXVlc3QudXNlKGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICAgIGNvbmZpZy5oZWFkZXJzWydYLUNTUkYtVG9rZW4nXSA9IHRoaXMuYXBwLmRhdGEoJ2NzcmYtdG9rZW4nKTtcblxuICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICB9KTtcbiAgfVxuXG4gIHJlcXVlc3RNaWRkbGV3YXJlKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0SHR0cCgpLnRoZW4oYXhpb3MgPT4gYXhpb3MuaW50ZXJjZXB0b3JzLnJlcXVlc3QudXNlKGNhbGxiYWNrKSk7XG4gIH1cblxuICByZXNwb25zZU1pZGRsZXdhcmUoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5nZXRIdHRwKCkudGhlbihheGlvcyA9PiBheGlvcy5pbnRlcmNlcHRvcnMucmVzcG9uc2UudXNlKGNhbGxiYWNrKSk7XG4gIH1cblxuICByZWFkeSgpIHtcbiAgICBzdXBlci5yZWFkeSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSBHRVQgcmVxdWVzdC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVybFxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKlxuICAgKiBAcmV0dXJucyB7QXhpb3NSZXNwb25zZX1cbiAgICovXG4gIGdldCh1cmwsIG9wdGlvbnMgPSB7fSkge1xuICAgIG9wdGlvbnMudXJsID0gdXJsO1xuICAgIG9wdGlvbnMubWV0aG9kID0gJ0dFVCc7XG5cbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSBQT1NUIHJlcXVlc3QuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cmxcbiAgICogQHBhcmFtIHtPYmplY3R8c3RyaW5nfSBkYXRhXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqXG4gICAqIEByZXR1cm5zIHtBeGlvc1Jlc3BvbnNlfVxuICAgKi9cbiAgcG9zdCh1cmwsIGRhdGEsIG9wdGlvbnMgPSB7fSkge1xuICAgIG9wdGlvbnMudXJsID0gdXJsO1xuICAgIG9wdGlvbnMubWV0aG9kID0gJ1BPU1QnO1xuICAgIG9wdGlvbnMuZGF0YSA9IGRhdGE7XG5cbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSBQVVQgcmVxdWVzdC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVybFxuICAgKiBAcGFyYW0ge09iamVjdHxzdHJpbmd9IGRhdGFcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICpcbiAgICogQHJldHVybnMge0F4aW9zUmVzcG9uc2V9XG4gICAqL1xuICBwdXQodXJsLCBkYXRhLCBvcHRpb25zID0ge30pIHtcbiAgICBvcHRpb25zLnVybCA9IHVybDtcbiAgICBvcHRpb25zLm1ldGhvZCA9ICdQVVQnO1xuICAgIG9wdGlvbnMuZGF0YSA9IGRhdGE7XG5cbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSBQQVRDSCByZXF1ZXN0LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsXG4gICAqIEBwYXJhbSB7T2JqZWN0fHN0cmluZ30gZGF0YVxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKlxuICAgKiBAcmV0dXJucyB7QXhpb3NSZXNwb25zZX1cbiAgICovXG4gIHBhdGNoKHVybCwgZGF0YSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgb3B0aW9ucy51cmwgPSB1cmw7XG4gICAgb3B0aW9ucy5tZXRob2QgPSAnUEFUQ0gnO1xuICAgIG9wdGlvbnMuZGF0YSA9IGRhdGE7XG5cbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSBERUxFVEUgcmVxdWVzdC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVybFxuICAgKiBAcGFyYW0ge09iamVjdHxzdHJpbmd9IGRhdGFcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICpcbiAgICogQHJldHVybnMge0F4aW9zUmVzcG9uc2V9XG4gICAqL1xuICAnZGVsZXRlJyh1cmwsIGRhdGEsIG9wdGlvbnMgPSB7fSkge1xuICAgIG9wdGlvbnMudXJsID0gdXJsO1xuICAgIG9wdGlvbnMubWV0aG9kID0gJ0RFTEVURSc7XG4gICAgb3B0aW9ucy5kYXRhID0gZGF0YTtcblxuICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZCBhIEhFQUQgcmVxdWVzdC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVybFxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKlxuICAgKiBAcmV0dXJucyB7QXhpb3NSZXNwb25zZX1cbiAgICovXG4gIGhlYWQodXJsLCBvcHRpb25zID0ge30pIHtcbiAgICBvcHRpb25zLnVybCA9IHVybDtcbiAgICBvcHRpb25zLm1ldGhvZCA9ICdIRUFEJztcblxuICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZCBhIE9QVElPTlMgcmVxdWVzdC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVybFxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKlxuICAgKiBAcmV0dXJucyB7QXhpb3NSZXNwb25zZX1cbiAgICovXG4gIG9wdGlvbnModXJsLCBvcHRpb25zID0ge30pIHtcbiAgICBvcHRpb25zLnVybCA9IHVybDtcbiAgICBvcHRpb25zLm1ldGhvZCA9ICdPUFRJT05TJztcblxuICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZCByZXF1ZXN0LlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxBeGlvc1Jlc3BvbnNlPn1cbiAgICovXG4gIHJlcXVlc3Qob3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLmdldEh0dHAoKS50aGVuKGF4aW9zID0+IHtcbiAgICAgIHJldHVybiBheGlvcyhvcHRpb25zKTtcbiAgICB9KTtcbiAgICAvLyBsZXQgcmVxT3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgLy8gbGV0IHJlcVVybCA9IHVybDtcbiAgICAvLyBsZXQgcmVxSGVhZGVycyA9IGhlYWRlcnM7XG4gICAgLy9cbiAgICAvLyBpZiAodHlwZW9mIHJlcVVybCA9PT0gJ29iamVjdCcpIHtcbiAgICAvLyAgIHJlcU9wdGlvbnMgPSByZXFVcmw7XG4gICAgLy8gICByZXFVcmwgPSByZXFPcHRpb25zLnVybDtcbiAgICAvLyB9XG4gICAgLy9cbiAgICAvLyBjb25zdCBpc0Zvcm1EYXRhID0gZGF0YSBpbnN0YW5jZW9mIEZvcm1EYXRhO1xuICAgIC8vXG4gICAgLy8gaWYgKGlzRm9ybURhdGEpIHtcbiAgICAvLyAgIHJlcU9wdGlvbnMucHJvY2Vzc0RhdGEgPSBmYWxzZTtcbiAgICAvLyAgIHJlcU9wdGlvbnMuY29udGVudFR5cGUgPSBmYWxzZTtcbiAgICAvLyB9XG4gICAgLy9cbiAgICAvLyBpZiAodHlwZW9mIHJlcU9wdGlvbnMuZGF0YVR5cGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgLy8gICByZXFPcHRpb25zLmRhdGFUeXBlID0gJ2pzb24nO1xuICAgIC8vIH1cbiAgICAvL1xuICAgIC8vIHJlcU9wdGlvbnMuZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJyB8fCBpc0Zvcm1EYXRhXG4gICAgLy8gICA/IGRhdGFcbiAgICAvLyAgIDogJC5leHRlbmQodHJ1ZSwge30sIHRoaXMuZGF0YSwgcmVxT3B0aW9ucy5kYXRhLCBkYXRhKTtcbiAgICAvL1xuICAgIC8vIHJlcU9wdGlvbnMudHlwZSA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpIHx8ICdHRVQnO1xuICAgIC8vIGNvbnN0IHsgdHlwZSB9ID0gcmVxT3B0aW9ucztcbiAgICAvL1xuICAgIC8vIGlmIChbJ1BPU1QnLCAnR0VUJ10uaW5kZXhPZihyZXFPcHRpb25zLnR5cGUpID09PSAtMSAmJiB0aGlzLmNvbmZpZy5jdXN0b21NZXRob2QpIHtcbiAgICAvLyAgIHJlcUhlYWRlcnNbJ1gtSFRUUC1NZXRob2QtT3ZlcnJpZGUnXSA9IHJlcU9wdGlvbnMudHlwZTtcbiAgICAvLyAgIHJlcU9wdGlvbnMuZGF0YS5fbWV0aG9kID0gcmVxT3B0aW9ucy50eXBlO1xuICAgIC8vICAgcmVxT3B0aW9ucy50eXBlID0gJ1BPU1QnO1xuICAgIC8vIH1cbiAgICAvL1xuICAgIC8vIHJlcU9wdGlvbnMuaGVhZGVycyA9ICQuZXh0ZW5kKFxuICAgIC8vICAgdHJ1ZSxcbiAgICAvLyAgIHt9LFxuICAgIC8vICAgdGhpcy5oZWFkZXJzLl9nbG9iYWwsXG4gICAgLy8gICB0aGlzLmhlYWRlcnNbdHlwZV0sXG4gICAgLy8gICByZXFPcHRpb25zLmhlYWRlcnMsXG4gICAgLy8gICByZXFIZWFkZXJzLFxuICAgIC8vICk7XG4gICAgLy9cbiAgICAvLyByZXR1cm4gdGhpcy4kLmFqYXgocmVxVXJsLCByZXFPcHRpb25zKVxuICAgIC8vICAgLmZhaWwoKHhociwgZXJyb3IpID0+IHtcbiAgICAvLyAgICAgaWYgKGVycm9yID09PSAncGFyc2VyZXJyb3InKSB7XG4gICAgLy8gICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgLy8gICAgICAgeGhyLnN0YXR1c1RleHQgPSAnVW5hYmxlIHRvIHBhcnNlIGRhdGEuJztcbiAgICAvLyAgICAgfSBlbHNlIHtcbiAgICAvLyAgICAgICB4aHIuc3RhdHVzVGV4dCA9IGRlY29kZVVSSUNvbXBvbmVudCh4aHIuc3RhdHVzVGV4dCk7XG4gICAgLy8gICAgIH1cbiAgICAvLyAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCBjdXN0b20gbWV0aG9kIHdpdGggX21ldGhvZCBwYXJhbWV0ZXIuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIHdpbGwgcmV0dXJuIGEgY2xvbmUgb2YgdGhpcyBvYmplY3QgdG8gaGVscCB1cyBzZW5kIHJlcXVlc3Qgb25jZS5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2U8dGhpcz59XG4gICAqL1xuICBjdXN0b21NZXRob2QodXNlSGVhZGVyID0gdHJ1ZSkge1xuICAgIGNvbnN0IGNsb25lID0gdGhpcztcbiAgICBjbG9uZS5heGlvcyA9IG51bGw7XG5cbiAgICByZXR1cm4gY2xvbmUucmVxdWVzdE1pZGRsZXdhcmUoKGNvbmZpZykgPT4ge1xuICAgICAgaWYgKHVzZUhlYWRlcikge1xuICAgICAgICBjb25maWcuaGVhZGVyc1snWC1IVFRQLU1ldGhvZC1PdmVycmlkZSddID0gY29uZmlnO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgY29uZmlnLmRhdGEgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGNvbmZpZy5kYXRhWydfbWV0aG9kJ10gPSBjb25maWcubWV0aG9kO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgY29uZmlnLmRhdGEgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGlmIChjb25maWcuZGF0YS5pbmNsdWRlcygnPycpKSB7XG4gICAgICAgICAgY29uZmlnLmRhdGEgKz0gJyZfbWV0aG9kPScgKyBjb25maWcubWV0aG9kO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbmZpZy5kYXRhICs9ICc/X21ldGhvZD0nICsgY29uZmlnLm1ldGhvZDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25maWcubWV0aG9kID0gJ1BPU1QnO1xuXG4gICAgICByZXR1cm4gY29uZmlnO1xuICAgIH0pLnRoZW4oKCkgPT4gY2xvbmUpO1xuICB9XG59XG4iLCIvKipcclxuICogUGFydCBvZiBzdGFydGVyIHByb2plY3QuXHJcbiAqXHJcbiAqIEBjb3B5cmlnaHQgIENvcHlyaWdodCAoQykgMjAyMSBfX09SR0FOSVpBVElPTl9fLlxyXG4gKiBAbGljZW5zZSAgICBfX0xJQ0VOU0VfX1xyXG4gKi9cclxuXHJcbmltcG9ydCB7IEV2ZW50TWl4aW4gfSBmcm9tICcuL2V2ZW50cy5qcyc7XHJcbmltcG9ydCB7IG1peCB9IGZyb20gJy4vbWl4d2l0aC5qcyc7XHJcbmltcG9ydCB7IG1lcmdlIH0gZnJvbSAnbG9kYXNoLWVzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFVuaWNvcm5BcHAgZXh0ZW5kcyBtaXgoY2xhc3Mge30pLndpdGgoRXZlbnRNaXhpbikge1xyXG4gIHBsdWdpbnMgPSB7fTtcclxuICBfbGlzdGVuZXJzID0ge307XHJcbiAgd2FpdHMgPSBbXTtcclxuXHJcbiAgLyoqXHJcbiAgICogRGVmYXVsdCBvcHRpb25zLlxyXG4gICAqIEByZXR1cm5zIHtPYmplY3R9XHJcbiAgICovXHJcbiAgc3RhdGljIGdldCBkZWZhdWx0T3B0aW9ucygpIHtcclxuICAgIHJldHVybiB7fTtcclxuICB9XHJcblxyXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xyXG4gICAgc3VwZXIoKTtcclxuICAgIHRoaXMub3B0aW9ucyA9IG1lcmdlKHt9LCB0aGlzLmNvbnN0cnVjdG9yLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcclxuXHJcbiAgICAvLyBXYWl0IGRvbSByZWFkeVxyXG4gICAgdGhpcy53YWl0KChyZXNvbHZlKSA9PiB7XHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCByZXNvbHZlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIFJlYWR5XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xyXG4gICAgICB0aGlzLmNvbXBsZXRlZCgpLnRoZW4oKCkgPT4gdGhpcy50cmlnZ2VyKCdsb2FkZWQnKSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVzZShwbHVnaW4sIG9wdGlvbnMgPSB7fSkge1xyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkocGx1Z2luKSkge1xyXG4gICAgICBwbHVnaW4uZm9yRWFjaChwID0+IHRoaXMudXNlKHApKTtcclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gaWYgKHBsdWdpbi5pcyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAvLyAgIHRocm93IG5ldyBFcnJvcihgUGx1Z2luOiAke3BsdWdpbi5uYW1lfSBtdXN0IGluc3RhbmNlIG9mIDogJHtQbHVnaW4ubmFtZX1gKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICBwbHVnaW4uaW5zdGFsbCh0aGlzLCBvcHRpb25zKTtcclxuXHJcbiAgICB0aGlzLnRyaWdnZXIoJ3BsdWdpbi5pbnN0YWxsZWQnLCBwbHVnaW4pO1xyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgZGV0YWNoKHBsdWdpbikge1xyXG4gICAgaWYgKHBsdWdpbi51bmluc3RhbGwpIHtcclxuICAgICAgcGx1Z2luLnVuaW5zdGFsbCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnRyaWdnZXIoJ3BsdWdpbi51bmluc3RhbGxlZCcsIHBsdWdpbik7XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICB0YXAodmFsdWUsIGNhbGxiYWNrKSB7XHJcbiAgICBjYWxsYmFjayh2YWx1ZSk7XHJcblxyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgLy8gdHJpZ2dlcihldmVudCwgLi4uYXJncykge1xyXG4gIC8vICAgcmV0dXJuIHRoaXMudGFwKHN1cGVyLnRyaWdnZXIoZXZlbnQsIC4uLmFyZ3MpLCAoKSA9PiB7XHJcbiAgLy8gICAgIGlmICh0aGlzLmRhdGEoJ3dpbmR3YWxrZXIuZGVidWcnKSkge1xyXG4gIC8vICAgICAgIGNvbnNvbGUuZGVidWcoYFtVbmljb3JuIEV2ZW50XSAke2V2ZW50fWAsIGFyZ3MsIHRoaXMubGlzdGVuZXJzKGV2ZW50KSk7XHJcbiAgLy8gICAgIH1cclxuICAvLyAgIH0pO1xyXG4gIC8vIH1cclxuXHJcbiAgZGF0YShuYW1lLCB2YWx1ZSkge1xyXG4gICAgdGhpcy50cmlnZ2VyKCd1bmljb3JuLmRhdGEnLCBuYW1lLCB2YWx1ZSk7XHJcblxyXG4gICAgZG9jdW1lbnQuX191bmljb3JuID0gZG9jdW1lbnQuX191bmljb3JuIHx8IHt9O1xyXG5cclxuICAgIGlmIChuYW1lID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgcmV0dXJuIGRvY3VtZW50Ll9fdW5pY29ybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBjb25zdCByZXMgPSBkb2N1bWVudC5fX3VuaWNvcm5bbmFtZV07XHJcblxyXG4gICAgICB0aGlzLnRyaWdnZXIoJ3VuaWNvcm4uZGF0YS5nZXQnLCBuYW1lLCByZXMpO1xyXG5cclxuICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxuXHJcbiAgICBkb2N1bWVudC5fX3VuaWNvcm5bbmFtZV0gPSB2YWx1ZTtcclxuXHJcbiAgICB0aGlzLnRyaWdnZXIoJ3VuaWNvcm4uZGF0YS5zZXQnLCBuYW1lLCB2YWx1ZSk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICByZW1vdmVEYXRhKG5hbWUpIHtcclxuICAgIGRvY3VtZW50Ll9fdW5pY29ybiA9IGRvY3VtZW50Ll9fdW5pY29ybiB8fCB7fTtcclxuXHJcbiAgICBkZWxldGUgZG9jdW1lbnQuX191bmljb3JuW25hbWVdO1xyXG5cclxuICAgICQoZG9jdW1lbnQpLnJlbW92ZURhdGEobmFtZSk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICB1cmkodHlwZSkge1xyXG4gICAgcmV0dXJuIHRoaXMuZGF0YSgndW5pY29ybi51cmknKVt0eXBlXTtcclxuICB9XHJcblxyXG4gIGFzc2V0KHR5cGUpIHtcclxuICAgIHJldHVybiB0aGlzLnVyaSgnYXNzZXQnKVt0eXBlXTtcclxuICB9XHJcblxyXG4gIHdhaXQoY2FsbGJhY2spIHtcclxuICAgIGNvbnN0IHAgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGNvbnN0IHByb21pc2UgPSBjYWxsYmFjayhyZXNvbHZlLCByZWplY3QpO1xyXG5cclxuICAgICAgaWYgKHByb21pc2UgJiYgJ3RoZW4nIGluIHByb21pc2UpIHtcclxuICAgICAgICBwcm9taXNlLnRoZW4ocmVzb2x2ZSkuY2F0Y2gocmVqZWN0KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy53YWl0cy5wdXNoKHApO1xyXG5cclxuICAgIHJldHVybiBwO1xyXG4gIH1cclxuXHJcbiAgY29tcGxldGVkKCkge1xyXG4gICAgY29uc3QgcHJvbWlzZSA9IFByb21pc2UuYWxsKHRoaXMud2FpdHMpO1xyXG5cclxuICAgIHRoaXMud2FpdHMgPSBbXTtcclxuXHJcbiAgICByZXR1cm4gcHJvbWlzZTtcclxuICB9XHJcbn1cclxuIiwiLyoqXG4gKiBQYXJ0IG9mIHN0YXJ0ZXIgcHJvamVjdC5cbiAqXG4gKiBAY29weXJpZ2h0ICBDb3B5cmlnaHQgKEMpIDIwMjEgX19PUkdBTklaQVRJT05fXy5cbiAqIEBsaWNlbnNlICAgIF9fTElDRU5TRV9fXG4gKi9cblxuZXhwb3J0ICogZnJvbSAnLi9ldmVudHMuanMnO1xuZXhwb3J0ICogZnJvbSAnLi9taXh3aXRoLmpzJztcblxuaW1wb3J0IFVuaWNvcm5WYWxpZGF0aW9uIGZyb20gJy4vcGx1Z2luL3ZhbGlkYXRpb24uanMnO1xuaW1wb3J0IFVuaWNvcm5VSSBmcm9tICcuL3VpLmpzJztcbmltcG9ydCBVbmljb3JuR3JpZCBmcm9tICcuL3BsdWdpbi9ncmlkLmpzJztcbmltcG9ydCBVbmljb3JuRm9ybSBmcm9tICcuL3BsdWdpbi9mb3JtLmpzJztcbmltcG9ydCBVbmljb3JuTG9hZGVyIGZyb20gJy4vbG9hZGVyLmpzJztcbmltcG9ydCBVbmljb3JuSGVscGVyIGZyb20gJy4vaGVscGVyLmpzJztcbmltcG9ydCBVbmljb3JuSHR0cCBmcm9tICcuL2h0dHAuanMnO1xuaW1wb3J0IFVuaWNvcm5BcHAgZnJvbSAnLi9hcHAuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBoZWxwZXIgfSBmcm9tICcuL2hlbHBlci5qcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVBcHAob3B0aW9ucyA9IHt9KSB7XG4gIHJldHVybiBuZXcgVW5pY29ybkFwcChvcHRpb25zKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5vQ29uZmxpY3QoKSB7XG4gIGNvbnN0IHVuaSA9IHdpbmRvdy51O1xuXG4gIGRlbGV0ZSB3aW5kb3cudTtcblxuICByZXR1cm4gdW5pO1xufVxuXG5jb25zdCB1ID0gY3JlYXRlQXBwKCk7XG5cbnUudXNlKFVuaWNvcm5Mb2FkZXIpO1xudS51c2UoVW5pY29ybkhlbHBlcik7XG51LnVzZShVbmljb3JuSHR0cCk7XG51LnVzZShVbmljb3JuVUkpO1xudS51c2UoVW5pY29ybkZvcm0pO1xudS51c2UoVW5pY29ybkdyaWQpO1xudS51c2UoVW5pY29yblZhbGlkYXRpb24pO1xuXG53aW5kb3cudSA9IHU7XG4iXSwibmFtZXMiOlsiX2FwcGxpZWRNaXhpbiIsImFwcGx5Iiwic3VwZXJjbGFzcyIsIm1peGluIiwiYXBwbGljYXRpb24iLCJwcm90b3R5cGUiLCJ1bndyYXAiLCJpc0FwcGxpY2F0aW9uT2YiLCJwcm90byIsImhhc093blByb3BlcnR5IiwiaGFzTWl4aW4iLCJvIiwiT2JqZWN0IiwiZ2V0UHJvdG90eXBlT2YiLCJfd3JhcHBlZE1peGluIiwid3JhcCIsIndyYXBwZXIiLCJzZXRQcm90b3R5cGVPZiIsIl9jYWNoZWRBcHBsaWNhdGlvbnMiLCJDYWNoZWQiLCJjYWNoZWRBcHBsaWNhdGlvbnMiLCJNYXAiLCJnZXQiLCJzZXQiLCJEZUR1cGUiLCJCYXJlTWl4aW4iLCJzIiwiTWl4aW4iLCJtaXgiLCJNaXhpbkJ1aWxkZXIiLCJtaXhpbnMiLCJyZWR1Y2UiLCJjIiwibSIsIl9fcHJvdG9fXyIsIkFycmF5Iiwic2V0UHJvdG9PZiIsIm1peGluUHJvcGVydGllcyIsIm9iaiIsInByb3AiLCJFdmVudE1peGluIiwiZXZlbnQiLCJoYW5kbGVyIiwiaXNBcnJheSIsImZvckVhY2giLCJlIiwib24iLCJfbGlzdGVuZXJzIiwidW5kZWZpbmVkIiwicHVzaCIsIm9uY2UiLCJfb25jZSIsImNhbGxiYWNrIiwibGlzdGVuZXJzIiwiZmlsdGVyIiwibGlzdGVuZXIiLCJhcmdzIiwidHJpZ2dlciIsIkVycm9yIiwiRXZlbnRCdXMiLCJVbmljb3JuVmFsaWRhdGlvbiIsImFwcCIsImZvcm1WYWxpZGF0aW9uIiwic2VsZWN0b3IiLCJzZWxlY3RPbmUiLCJVbmljb3JuVUkiLCJhbGl2ZUhhbmRsZSIsInRoZW1lIiwibWVzc2FnZXMiLCJQcm9taXNlIiwiYWxsIiwibG9hZEFscGluZSIsInRoZW4iLCJlbGVtZW50IiwiQWxwaW5lIiwiaW5pdGlhbGl6ZUNvbXBvbmVudCIsIlNwcnVjZSIsInN0YXJ0IiwibG9hZFNwcnVjZSIsIndpbmRvdyIsImRlZmVyTG9hZGluZ0FscGluZSIsInVpIiwiJHVpIiwiYWRkTWVzc2FnZSIsInJlbmRlck1lc3NhZ2UiLCJiaW5kIiwiaW5pdEFscGluZSIsInN0YXJ0QWxwaW5lIiwic3RhcnRBbHBpbmVTcHJ1Y2UiLCJpbml0QWxwaW5lU3BydWNlIiwibWVzc2FnZVNlbGVjdG9yIiwiZnJlZUdsb2JhbCIsImdsb2JhbCIsImZyZWVTZWxmIiwic2VsZiIsInJvb3QiLCJGdW5jdGlvbiIsIlN5bWJvbCIsIm9iamVjdFByb3RvIiwibmF0aXZlT2JqZWN0VG9TdHJpbmciLCJ0b1N0cmluZyIsInN5bVRvU3RyaW5nVGFnIiwidG9TdHJpbmdUYWciLCJnZXRSYXdUYWciLCJ2YWx1ZSIsImlzT3duIiwiY2FsbCIsInRhZyIsInVubWFza2VkIiwicmVzdWx0Iiwib2JqZWN0VG9TdHJpbmciLCJudWxsVGFnIiwidW5kZWZpbmVkVGFnIiwiYmFzZUdldFRhZyIsImlzT2JqZWN0TGlrZSIsImlzT2JqZWN0IiwidHlwZSIsImlkZW50aXR5IiwiYXN5bmNUYWciLCJmdW5jVGFnIiwiZ2VuVGFnIiwicHJveHlUYWciLCJpc0Z1bmN0aW9uIiwiY29yZUpzRGF0YSIsIm1hc2tTcmNLZXkiLCJ1aWQiLCJleGVjIiwia2V5cyIsIklFX1BST1RPIiwiaXNNYXNrZWQiLCJmdW5jIiwiZnVuY1Byb3RvIiwiZnVuY1RvU3RyaW5nIiwidG9Tb3VyY2UiLCJyZVJlZ0V4cENoYXIiLCJyZUlzSG9zdEN0b3IiLCJyZUlzTmF0aXZlIiwiUmVnRXhwIiwicmVwbGFjZSIsImJhc2VJc05hdGl2ZSIsInBhdHRlcm4iLCJ0ZXN0IiwiZ2V0VmFsdWUiLCJvYmplY3QiLCJrZXkiLCJnZXROYXRpdmUiLCJvYmplY3RDcmVhdGUiLCJjcmVhdGUiLCJiYXNlQ3JlYXRlIiwidGhpc0FyZyIsImxlbmd0aCIsImNvcHlBcnJheSIsInNvdXJjZSIsImFycmF5IiwiaW5kZXgiLCJIT1RfQ09VTlQiLCJIT1RfU1BBTiIsIm5hdGl2ZU5vdyIsIkRhdGUiLCJub3ciLCJzaG9ydE91dCIsImNvdW50IiwibGFzdENhbGxlZCIsInN0YW1wIiwicmVtYWluaW5nIiwiYXJndW1lbnRzIiwiY29uc3RhbnQiLCJkZWZpbmVQcm9wZXJ0eSIsImJhc2VTZXRUb1N0cmluZyIsInN0cmluZyIsInNldFRvU3RyaW5nIiwiYXJyYXlFYWNoIiwiaXRlcmF0ZWUiLCJNQVhfU0FGRV9JTlRFR0VSIiwicmVJc1VpbnQiLCJpc0luZGV4IiwiYmFzZUFzc2lnblZhbHVlIiwiZXEiLCJvdGhlciIsImFzc2lnblZhbHVlIiwib2JqVmFsdWUiLCJjb3B5T2JqZWN0IiwicHJvcHMiLCJjdXN0b21pemVyIiwiaXNOZXciLCJuZXdWYWx1ZSIsIm5hdGl2ZU1heCIsIk1hdGgiLCJtYXgiLCJvdmVyUmVzdCIsInRyYW5zZm9ybSIsIm90aGVyQXJncyIsImJhc2VSZXN0IiwiaXNMZW5ndGgiLCJpc0FycmF5TGlrZSIsImlzSXRlcmF0ZWVDYWxsIiwiY3JlYXRlQXNzaWduZXIiLCJhc3NpZ25lciIsInNvdXJjZXMiLCJndWFyZCIsImlzUHJvdG90eXBlIiwiQ3RvciIsImNvbnN0cnVjdG9yIiwiYmFzZVRpbWVzIiwibiIsImFyZ3NUYWciLCJiYXNlSXNBcmd1bWVudHMiLCJwcm9wZXJ0eUlzRW51bWVyYWJsZSIsImlzQXJndW1lbnRzIiwic3R1YkZhbHNlIiwiZnJlZUV4cG9ydHMiLCJleHBvcnRzIiwibm9kZVR5cGUiLCJmcmVlTW9kdWxlIiwibW9kdWxlIiwibW9kdWxlRXhwb3J0cyIsIkJ1ZmZlciIsIm5hdGl2ZUlzQnVmZmVyIiwiaXNCdWZmZXIiLCJhcnJheVRhZyIsImJvb2xUYWciLCJkYXRlVGFnIiwiZXJyb3JUYWciLCJtYXBUYWciLCJudW1iZXJUYWciLCJvYmplY3RUYWciLCJyZWdleHBUYWciLCJzZXRUYWciLCJzdHJpbmdUYWciLCJ3ZWFrTWFwVGFnIiwiYXJyYXlCdWZmZXJUYWciLCJkYXRhVmlld1RhZyIsImZsb2F0MzJUYWciLCJmbG9hdDY0VGFnIiwiaW50OFRhZyIsImludDE2VGFnIiwiaW50MzJUYWciLCJ1aW50OFRhZyIsInVpbnQ4Q2xhbXBlZFRhZyIsInVpbnQxNlRhZyIsInVpbnQzMlRhZyIsInR5cGVkQXJyYXlUYWdzIiwiYmFzZUlzVHlwZWRBcnJheSIsImJhc2VVbmFyeSIsImZyZWVQcm9jZXNzIiwicHJvY2VzcyIsIm5vZGVVdGlsIiwidHlwZXMiLCJyZXF1aXJlIiwiYmluZGluZyIsIm5vZGVJc1R5cGVkQXJyYXkiLCJpc1R5cGVkQXJyYXkiLCJhcnJheUxpa2VLZXlzIiwiaW5oZXJpdGVkIiwiaXNBcnIiLCJpc0FyZyIsImlzQnVmZiIsImlzVHlwZSIsInNraXBJbmRleGVzIiwiU3RyaW5nIiwib3ZlckFyZyIsImFyZyIsIm5hdGl2ZUtleXMiLCJiYXNlS2V5cyIsIm5hdGl2ZUtleXNJbiIsImJhc2VLZXlzSW4iLCJpc1Byb3RvIiwia2V5c0luIiwibmF0aXZlQ3JlYXRlIiwiaGFzaENsZWFyIiwiX19kYXRhX18iLCJzaXplIiwiaGFzaERlbGV0ZSIsImhhcyIsIkhBU0hfVU5ERUZJTkVEIiwiaGFzaEdldCIsImRhdGEiLCJoYXNoSGFzIiwiaGFzaFNldCIsIkhhc2giLCJlbnRyaWVzIiwiY2xlYXIiLCJlbnRyeSIsImxpc3RDYWNoZUNsZWFyIiwiYXNzb2NJbmRleE9mIiwiYXJyYXlQcm90byIsInNwbGljZSIsImxpc3RDYWNoZURlbGV0ZSIsImxhc3RJbmRleCIsInBvcCIsImxpc3RDYWNoZUdldCIsImxpc3RDYWNoZUhhcyIsImxpc3RDYWNoZVNldCIsIkxpc3RDYWNoZSIsIm1hcENhY2hlQ2xlYXIiLCJpc0tleWFibGUiLCJnZXRNYXBEYXRhIiwibWFwIiwibWFwQ2FjaGVEZWxldGUiLCJtYXBDYWNoZUdldCIsIm1hcENhY2hlSGFzIiwibWFwQ2FjaGVTZXQiLCJNYXBDYWNoZSIsImdldFByb3RvdHlwZSIsIm9iamVjdEN0b3JTdHJpbmciLCJpc1BsYWluT2JqZWN0Iiwic3RhY2tDbGVhciIsInN0YWNrRGVsZXRlIiwic3RhY2tHZXQiLCJzdGFja0hhcyIsIkxBUkdFX0FSUkFZX1NJWkUiLCJzdGFja1NldCIsInBhaXJzIiwiU3RhY2siLCJhbGxvY1Vuc2FmZSIsImNsb25lQnVmZmVyIiwiYnVmZmVyIiwiaXNEZWVwIiwic2xpY2UiLCJjb3B5IiwiVWludDhBcnJheSIsImNsb25lQXJyYXlCdWZmZXIiLCJhcnJheUJ1ZmZlciIsImJ5dGVMZW5ndGgiLCJjbG9uZVR5cGVkQXJyYXkiLCJ0eXBlZEFycmF5IiwiYnl0ZU9mZnNldCIsImluaXRDbG9uZU9iamVjdCIsImNyZWF0ZUJhc2VGb3IiLCJmcm9tUmlnaHQiLCJrZXlzRnVuYyIsIml0ZXJhYmxlIiwiYmFzZUZvciIsImJhc2VGb3JPd24iLCJjcmVhdGVCYXNlRWFjaCIsImVhY2hGdW5jIiwiY29sbGVjdGlvbiIsImJhc2VFYWNoIiwiYXNzaWduTWVyZ2VWYWx1ZSIsImlzQXJyYXlMaWtlT2JqZWN0Iiwic2FmZUdldCIsInRvUGxhaW5PYmplY3QiLCJiYXNlTWVyZ2VEZWVwIiwic3JjSW5kZXgiLCJtZXJnZUZ1bmMiLCJzdGFjayIsInNyY1ZhbHVlIiwic3RhY2tlZCIsImlzQ29tbW9uIiwiaXNUeXBlZCIsImJhc2VNZXJnZSIsImNhc3RGdW5jdGlvbiIsIm1lcmdlIiwiZGVmRGF0YSIsIm5hbWUiLCJkZWZDYWxsYmFjayIsInByZXBhcmVEYXRhIiwiX191bmljb3JuIiwiVW5pY29ybkdyaWQiLCJncmlkIiwiZWxlIiwib3B0aW9ucyIsIlVuaWNvcm5HcmlkRWxlbWVudCIsImFzc2lnbiIsImRlZmF1bHRPcHRpb25zIiwiZm9ybSIsInJlZ2lzdGVyRXZlbnRzIiwic3RvcmUiLCJjdXN0b20iLCJvcmRlcmluZyIsImRhdGFzZXQiLCJ0b0xvd2VyQ2FzZSIsImVuZHNXaXRoIiwidXNlU3RhdGUiLCIkZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsInB1dCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCIkZWwiLCJkaXIiLCJnZXREaXJlY3Rpb24iLCJmaWVsZCIsImFzYyIsImRlc2MiLCJzb3J0QnkiLCJvcmRlcmluZ0lucHV0IiwicXVlcnlTZWxlY3RvciIsImgiLCJhcHBlbmRDaGlsZCIsIm9yZGVyaW5nRXF1YWxzIiwiYSIsImIiLCJ0cmltIiwicm93IiwiY2giLCJmaW5kIiwiY2hlY2tlZCIsInVybCIsInF1ZXJpZXMiLCJ0b2dnbGVBbGwiLCJjaGVja1JvdyIsImNvcmUiLCJwYXRjaCIsInRhc2siLCJ1cGRhdGVSb3ciLCJwb3N0IiwibWVzc2FnZSIsIl9fIiwiY29uZmlybSIsImlzQ29uZmlybSIsIm1zZyIsImRlbGV0ZUxpc3QiLCJzZWxlY3RBbGwiLCJpbnB1dCIsImdldENoZWNrZWQiLCJVbmljb3JuIiwiVHJhbnNsYXRvciIsInRyYW5zbGF0ZSIsImNvdW50Q2hlY2tlZCIsImFsZXJ0Iiwic3RvcFByb3BhZ2F0aW9uIiwib3JpZ2luIiwib3JpZ2luT3JkZXJpbmciLCJ2YWwiLCJzcGxpdCIsImlucHV0cyIsImVhY2giLCJpIiwiJHRoaXMiLCIkIiwiYXR0ciIsInRyIiwicGFyZW50cyIsImdyb3VwIiwic2libGluZ3MiLCJiYXRjaCIsImRlbHRhIiwiZG9UYXNrIiwiVW5pY29ybkZvcm0iLCJVbmljb3JuRm9ybUVsZW1lbnQiLCIkZm9ybSIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImluZGV4T2YiLCJzZXRBdHRyaWJ1dGUiLCJzdWJzdHIiLCJjc3JmIiwiYm9keSIsImJpbmRFdmVudHMiLCJtZXRob2QiLCJjdXN0b21NZXRob2QiLCJtZXRob2RJbnB1dCIsImZsYXR0ZWQiLCJmbGF0dGVuT2JqZWN0IiwiZmllbGROYW1lIiwiYnVpbGRGaWVsZE5hbWUiLCJzdWJtaXRCdXR0b24iLCJzdWJtaXQiLCJzdHlsZSIsImRpc3BsYXkiLCJjbGljayIsIm9iIiwidG9SZXR1cm4iLCJmbGF0T2JqZWN0IiwieCIsIm5hbWVzIiwiZmlyc3QiLCJzaGlmdCIsImpvaW4iLCJVbmljb3JuTG9hZGVyIiwic3JjIiwiU3lzdGVtIiwicmUiLCJub3Rfc3RyaW5nIiwibm90X2Jvb2wiLCJub3RfdHlwZSIsIm5vdF9wcmltaXRpdmUiLCJudW1iZXIiLCJudW1lcmljX2FyZyIsImpzb24iLCJub3RfanNvbiIsInRleHQiLCJtb2R1bG8iLCJwbGFjZWhvbGRlciIsImtleV9hY2Nlc3MiLCJpbmRleF9hY2Nlc3MiLCJzaWduIiwic3ByaW50ZiIsInNwcmludGZfZm9ybWF0Iiwic3ByaW50Zl9wYXJzZSIsInZzcHJpbnRmIiwiZm10IiwiYXJndiIsImNvbmNhdCIsInBhcnNlX3RyZWUiLCJjdXJzb3IiLCJ0cmVlX2xlbmd0aCIsIm91dHB1dCIsImsiLCJwaCIsInBhZCIsInBhZF9jaGFyYWN0ZXIiLCJwYWRfbGVuZ3RoIiwiaXNfcG9zaXRpdmUiLCJwYXJhbV9ubyIsImlzTmFOIiwiVHlwZUVycm9yIiwicGFyc2VJbnQiLCJmcm9tQ2hhckNvZGUiLCJKU09OIiwic3RyaW5naWZ5Iiwid2lkdGgiLCJwcmVjaXNpb24iLCJwYXJzZUZsb2F0IiwidG9FeHBvbmVudGlhbCIsInRvRml4ZWQiLCJOdW1iZXIiLCJ0b1ByZWNpc2lvbiIsInN1YnN0cmluZyIsInZhbHVlT2YiLCJ0b1VwcGVyQ2FzZSIsInBhZF9jaGFyIiwiY2hhckF0IiwicmVwZWF0IiwiYWxpZ24iLCJzcHJpbnRmX2NhY2hlIiwiX2ZtdCIsIm1hdGNoIiwiYXJnX25hbWVzIiwiZmllbGRfbGlzdCIsInJlcGxhY2VtZW50X2ZpZWxkIiwiZmllbGRfbWF0Y2giLCJTeW50YXhFcnJvciIsImRlZmluZSIsIlVuaWNvcm5IZWxwZXIiLCJyZXN1bHRTZXQiLCJhdHRycyIsImNvbnRlbnQiLCJ2IiwiaW5uZXJIVE1MIiwicGF0aCIsIkJvb2xlYW4iLCJyZXNvbHZlIiwidXJpIiwiYXNzZXQiLCJ0aW1lIiwic2V0SW50ZXJ2YWwiLCJmZXRjaCIsImNsZWFySW50ZXJ2YWwiLCJkYXRlIiwiZ2V0TnVsbERhdGUiLCJkZWNpbWFscyIsImRlY1BvaW50IiwidGhvdXNhbmRzU2VwIiwicm91bmRlZE51bWJlciIsInJvdW5kIiwiYWJzIiwibnVtYmVyc1N0cmluZyIsImRlY2ltYWxzU3RyaW5nIiwiZm9ybWF0dGVkTnVtYmVyIiwiaGVscGVyIiwiJGhlbHBlciIsIiRnZXQiLCIkc2V0IiwiaXNEZWJ1ZyIsImtlZXBBbGl2ZSIsInN0b3BLZWVwQWxpdmUiLCJpc051bGxEYXRlIiwibnVtYmVyRm9ybWF0IiwiVW5pY29ybkh0dHAiLCJjb25maWciLCJnbG9iYWxBeGlvcyIsImF4aW9zIiwiY3JlYXRlSHR0cCIsImludGVyY2VwdG9ycyIsInJlcXVlc3QiLCJ1c2UiLCJoZWFkZXJzIiwiZ2V0SHR0cCIsInJlc3BvbnNlIiwidXNlSGVhZGVyIiwiY2xvbmUiLCJyZXF1ZXN0TWlkZGxld2FyZSIsImluY2x1ZGVzIiwiJGh0dHAiLCJVbmljb3JuQXBwIiwid2FpdCIsImFkZEV2ZW50TGlzdGVuZXIiLCJjb21wbGV0ZWQiLCJwbHVnaW4iLCJwIiwiaW5zdGFsbCIsInVuaW5zdGFsbCIsInJlcyIsInJlbW92ZURhdGEiLCJyZWplY3QiLCJwcm9taXNlIiwid2FpdHMiLCJjcmVhdGVBcHAiLCJub0NvbmZsaWN0IiwidW5pIiwidSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUVBO0VBQ0EsSUFBTUEsYUFBYSxHQUFHLHdCQUF0QjtFQUVBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0VBRUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztFQUNBLElBQU1DLE9BQUssR0FBRyxTQUFSQSxLQUFRLENBQUNDLFVBQUQsRUFBYUMsS0FBYixFQUF1QjtFQUNuQyxNQUFJQyxXQUFXLEdBQUdELEtBQUssQ0FBQ0QsVUFBRCxDQUF2QjtFQUNBRSxFQUFBQSxXQUFXLENBQUNDLFNBQVosQ0FBc0JMLGFBQXRCLElBQXVDTSxNQUFNLENBQUNILEtBQUQsQ0FBN0M7RUFDQSxTQUFPQyxXQUFQO0VBQ0QsQ0FKRDtFQU1BO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOzs7RUFDQSxJQUFNRyxlQUFlLEdBQUcsU0FBbEJBLGVBQWtCLENBQUNDLEtBQUQsRUFBUUwsS0FBUjtFQUFBLFNBQ3RCSyxLQUFLLENBQUNDLGNBQU4sQ0FBcUJULGFBQXJCLEtBQXVDUSxLQUFLLENBQUNSLGFBQUQsQ0FBTCxLQUF5Qk0sTUFBTSxDQUFDSCxLQUFELENBRGhEO0VBQUEsQ0FBeEI7RUFHQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7O0VBQ0EsSUFBTU8sUUFBUSxHQUFHLFNBQVhBLFFBQVcsQ0FBQ0MsQ0FBRCxFQUFJUixLQUFKLEVBQWM7RUFDN0IsU0FBT1EsQ0FBQyxJQUFJLElBQVosRUFBa0I7RUFDaEIsUUFBSUosZUFBZSxDQUFDSSxDQUFELEVBQUlSLEtBQUosQ0FBbkIsRUFBK0IsT0FBTyxJQUFQO0VBQy9CUSxJQUFBQSxDQUFDLEdBQUdDLE1BQU0sQ0FBQ0MsY0FBUCxDQUFzQkYsQ0FBdEIsQ0FBSjtFQUNEOztFQUNELFNBQU8sS0FBUDtFQUNELENBTkQ7OztFQVVBLElBQU1HLGFBQWEsR0FBRyx3QkFBdEI7RUFFQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7RUFDQSxJQUFNQyxJQUFJLEdBQUcsU0FBUEEsSUFBTyxDQUFDWixLQUFELEVBQVFhLE9BQVIsRUFBb0I7RUFDL0JKLEVBQUFBLE1BQU0sQ0FBQ0ssY0FBUCxDQUFzQkQsT0FBdEIsRUFBK0JiLEtBQS9COztFQUNBLE1BQUksQ0FBQ0EsS0FBSyxDQUFDVyxhQUFELENBQVYsRUFBMkI7RUFDekJYLElBQUFBLEtBQUssQ0FBQ1csYUFBRCxDQUFMLEdBQXVCWCxLQUF2QjtFQUNEOztFQUNELFNBQU9hLE9BQVA7RUFDRCxDQU5EO0VBUUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOzs7RUFDQSxJQUFNVixNQUFNLEdBQUcsU0FBVEEsTUFBUyxDQUFDVSxPQUFEO0VBQUEsU0FBYUEsT0FBTyxDQUFDRixhQUFELENBQVAsSUFBMEJFLE9BQXZDO0VBQUEsQ0FBZjs7RUFFQSxJQUFNRSxtQkFBbUIsR0FBRyw4QkFBNUI7RUFFQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztFQUNBLElBQU1DLE1BQU0sR0FBRyxTQUFUQSxNQUFTLENBQUNoQixLQUFEO0VBQUEsU0FBV1ksSUFBSSxDQUFDWixLQUFELEVBQVEsVUFBQ0QsVUFBRCxFQUFnQjtFQUNwRDtFQUNBO0VBQ0E7RUFDQTtFQUVBLFFBQUlrQixrQkFBa0IsR0FBR2xCLFVBQVUsQ0FBQ2dCLG1CQUFELENBQW5DOztFQUNBLFFBQUksQ0FBQ0Usa0JBQUwsRUFBeUI7RUFDdkJBLE1BQUFBLGtCQUFrQixHQUFHbEIsVUFBVSxDQUFDZ0IsbUJBQUQsQ0FBVixHQUFrQyxJQUFJRyxHQUFKLEVBQXZEO0VBQ0Q7O0VBRUQsUUFBSWpCLFdBQVcsR0FBR2dCLGtCQUFrQixDQUFDRSxHQUFuQixDQUF1Qm5CLEtBQXZCLENBQWxCOztFQUNBLFFBQUksQ0FBQ0MsV0FBTCxFQUFrQjtFQUNoQkEsTUFBQUEsV0FBVyxHQUFHRCxLQUFLLENBQUNELFVBQUQsQ0FBbkI7RUFDQWtCLE1BQUFBLGtCQUFrQixDQUFDRyxHQUFuQixDQUF1QnBCLEtBQXZCLEVBQThCQyxXQUE5QjtFQUNEOztFQUVELFdBQU9BLFdBQVA7RUFDRCxHQWxCNkIsQ0FBZjtFQUFBLENBQWY7RUFvQkE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7O0VBQ0EsSUFBTW9CLE1BQU0sR0FBRyxTQUFUQSxNQUFTLENBQUNyQixLQUFEO0VBQUEsU0FBV1ksSUFBSSxDQUFDWixLQUFELEVBQVEsVUFBQ0QsVUFBRDtFQUFBLFdBQ25DUSxRQUFRLENBQUNSLFVBQVUsQ0FBQ0csU0FBWixFQUF1QkYsS0FBdkIsQ0FBVCxHQUNJRCxVQURKLEdBRUlDLEtBQUssQ0FBQ0QsVUFBRCxDQUgyQjtFQUFBLEdBQVIsQ0FBZjtFQUFBLENBQWY7RUF1QkE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOzs7RUFDQSxJQUFNdUIsU0FBUyxHQUFHLFNBQVpBLFNBQVksQ0FBQ3RCLEtBQUQ7RUFBQSxTQUFXWSxJQUFJLENBQUNaLEtBQUQsRUFBUSxVQUFDdUIsQ0FBRDtFQUFBLFdBQU96QixPQUFLLENBQUN5QixDQUFELEVBQUl2QixLQUFKLENBQVo7RUFBQSxHQUFSLENBQWY7RUFBQSxDQUFsQjtFQUVBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7OztNQUNhd0IsS0FBSyxHQUFHLFNBQVJBLEtBQVEsQ0FBQ3hCLEtBQUQ7RUFBQSxTQUFXcUIsTUFBTSxDQUFDTCxNQUFNLENBQUNNLFNBQVMsQ0FBQ3RCLEtBQUQsQ0FBVixDQUFQLENBQWpCO0VBQUE7RUFFckI7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7TUFDYXlCLEdBQUcsR0FBRyxTQUFOQSxHQUFNLENBQUMxQixVQUFEO0VBQUEsU0FBZ0IsSUFBSTJCLFlBQUosQ0FBaUIzQixVQUFqQixDQUFoQjtFQUFBOztNQUViMkI7RUFFSix3QkFBWTNCLFVBQVosRUFBd0I7RUFBQTs7RUFDdEIsU0FBS0EsVUFBTCxHQUFrQkEsVUFBVTtFQUFBO0VBQUE7RUFBQTs7RUFBQTtFQUFBLE9BQTVCO0VBQ0Q7RUFFRDtFQUNGO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7Ozs7O2FBQ0UsaUJBQWdCO0VBQUEsd0NBQVI0QixNQUFRO0VBQVJBLFFBQUFBLE1BQVE7RUFBQTs7RUFDZCxhQUFPQSxNQUFNLENBQUNDLE1BQVAsQ0FBYyxVQUFDQyxDQUFELEVBQUlDLENBQUo7RUFBQSxlQUFVQSxDQUFDLENBQUNELENBQUQsQ0FBWDtFQUFBLE9BQWQsRUFBOEIsS0FBSzlCLFVBQW5DLENBQVA7RUFDRDs7Ozs7RUFJSDs7O0VBQ0EsQ0FBQyxZQUFXO0VBQ1ZVLEVBQUFBLE1BQU0sQ0FBQ0ssY0FBUCxHQUF3QkwsTUFBTSxDQUFDSyxjQUFQLEtBQTBCO0VBQUNpQixJQUFBQSxTQUFTLEVBQUU7RUFBWixlQUEyQkMsS0FBM0IsR0FBbUNDLFVBQW5DLEdBQWdEQyxlQUExRSxDQUF4Qjs7RUFFQSxXQUFTRCxVQUFULENBQW9CRSxHQUFwQixFQUF5QjlCLEtBQXpCLEVBQWdDO0VBQzlCOEIsSUFBQUEsR0FBRyxDQUFDSixTQUFKLEdBQWdCMUIsS0FBaEI7RUFDQSxXQUFPOEIsR0FBUDtFQUNEOztFQUVELFdBQVNELGVBQVQsQ0FBeUJDLEdBQXpCLEVBQThCOUIsS0FBOUIsRUFBcUM7RUFDbkMsU0FBSyxJQUFNK0IsSUFBWCxJQUFtQi9CLEtBQW5CLEVBQTBCO0VBQ3hCLFVBQUksQ0FBQzhCLEdBQUcsQ0FBQzdCLGNBQUosQ0FBbUI4QixJQUFuQixDQUFMLEVBQStCO0VBQzdCRCxRQUFBQSxHQUFHLENBQUNDLElBQUQsQ0FBSCxHQUFZL0IsS0FBSyxDQUFDK0IsSUFBRCxDQUFqQjtFQUNEO0VBQ0Y7O0VBQ0QsV0FBT0QsR0FBUDtFQUNEO0VBQ0YsQ0FoQkQ7O01DM1BhRSxVQUFVLEdBQUdiLEtBQUssQ0FBQyxVQUFVekIsVUFBVixFQUFzQjtFQUNwRDtFQUFBOztFQUFBOztFQUFBO0VBQUE7O0VBQUE7O0VBQUE7RUFBQTtFQUFBOztFQUFBOztFQUFBLG1FQUNlLEVBRGY7O0VBQUE7RUFBQTs7RUFBQTtFQUFBO0VBQUEsYUFHRSxZQUFHdUMsS0FBSCxFQUFVQyxPQUFWLEVBQW1CO0VBQUE7O0VBQ2pCLFlBQUlQLEtBQUssQ0FBQ1EsT0FBTixDQUFjRixLQUFkLENBQUosRUFBMEI7RUFDeEJBLFVBQUFBLEtBQUssQ0FBQ0csT0FBTixDQUFjLFVBQUFDLENBQUM7RUFBQSxtQkFBSSxNQUFJLENBQUNDLEVBQUwsQ0FBUUQsQ0FBUixFQUFXSCxPQUFYLENBQUo7RUFBQSxXQUFmO0VBQ0EsaUJBQU8sSUFBUDtFQUNEOztFQUVELFlBQUksS0FBS0ssVUFBTCxDQUFnQk4sS0FBaEIsTUFBMkJPLFNBQS9CLEVBQTBDO0VBQ3hDLGVBQUtELFVBQUwsQ0FBZ0JOLEtBQWhCLElBQXlCLEVBQXpCO0VBQ0Q7O0VBRUQsYUFBS00sVUFBTCxDQUFnQk4sS0FBaEIsRUFBdUJRLElBQXZCLENBQTRCUCxPQUE1Qjs7RUFFQSxlQUFPLElBQVA7RUFDRDtFQWhCSDtFQUFBO0VBQUEsYUFrQkUsY0FBS0QsS0FBTCxFQUFZQyxPQUFaLEVBQXFCO0VBQUE7O0VBQ25CLFlBQUlQLEtBQUssQ0FBQ1EsT0FBTixDQUFjRixLQUFkLENBQUosRUFBMEI7RUFDeEJBLFVBQUFBLEtBQUssQ0FBQ0csT0FBTixDQUFjLFVBQUFDLENBQUM7RUFBQSxtQkFBSSxNQUFJLENBQUNLLElBQUwsQ0FBVUwsQ0FBVixFQUFhSCxPQUFiLENBQUo7RUFBQSxXQUFmO0VBQ0EsaUJBQU8sSUFBUDtFQUNEOztFQUVEQSxRQUFBQSxPQUFPLENBQUNTLEtBQVIsR0FBZ0IsSUFBaEI7RUFFQSxhQUFLTCxFQUFMLENBQVFMLEtBQVIsRUFBZUMsT0FBZjtFQUNEO0VBM0JIO0VBQUE7RUFBQSxhQTZCRSxhQUFJRCxLQUFKLEVBQTRCO0VBQUEsWUFBakJXLFFBQWlCLHVFQUFOLElBQU07O0VBQzFCLFlBQUlBLFFBQVEsS0FBSyxJQUFqQixFQUF1QjtFQUNyQixlQUFLTCxVQUFMLENBQWdCTixLQUFoQixJQUF5QixLQUFLWSxTQUFMLENBQWVaLEtBQWYsRUFBc0JhLE1BQXRCLENBQTZCLFVBQUNDLFFBQUQ7RUFBQSxtQkFBY0EsUUFBUSxLQUFLSCxRQUEzQjtFQUFBLFdBQTdCLENBQXpCO0VBQ0EsaUJBQU8sSUFBUDtFQUNEOztFQUVELGVBQU8sS0FBS0wsVUFBTCxDQUFnQk4sS0FBaEIsQ0FBUDtFQUVBLGVBQU8sSUFBUDtFQUNEO0VBdENIO0VBQUE7RUFBQSxhQXdDRSxpQkFBUUEsS0FBUixFQUF3QjtFQUFBOztFQUFBLDJDQUFOZSxJQUFNO0VBQU5BLFVBQUFBLElBQU07RUFBQTs7RUFDdEIsWUFBSXJCLEtBQUssQ0FBQ1EsT0FBTixDQUFjRixLQUFkLENBQUosRUFBMEI7RUFDeEJBLFVBQUFBLEtBQUssQ0FBQ0csT0FBTixDQUFjLFVBQUFDLENBQUM7RUFBQSxtQkFBSSxNQUFJLENBQUNZLE9BQUwsQ0FBYVosQ0FBYixDQUFKO0VBQUEsV0FBZjtFQUNBLGlCQUFPLElBQVA7RUFDRDs7RUFFRCxhQUFLUSxTQUFMLENBQWVaLEtBQWYsRUFBc0JHLE9BQXRCLENBQThCLFVBQUFXLFFBQVEsRUFBSTtFQUN4Q0EsVUFBQUEsUUFBUSxNQUFSLFNBQVlDLElBQVo7RUFDRCxTQUZELEVBTnNCOztFQVd0QixhQUFLVCxVQUFMLENBQWdCTixLQUFoQixJQUF5QixLQUFLWSxTQUFMLENBQWVaLEtBQWYsRUFBc0JhLE1BQXRCLENBQTZCLFVBQUNDLFFBQUQ7RUFBQSxpQkFBY0EsUUFBUSxDQUFDSixLQUFULEtBQW1CLElBQWpDO0VBQUEsU0FBN0IsQ0FBekI7RUFFQSxlQUFPLElBQVA7RUFDRDtFQXRESDtFQUFBO0VBQUEsYUF3REUsbUJBQVVWLEtBQVYsRUFBaUI7RUFDZixZQUFJLE9BQU9BLEtBQVAsS0FBaUIsUUFBckIsRUFBK0I7RUFDN0IsZ0JBQU0sSUFBSWlCLEtBQUosb0RBQU47RUFDRDs7RUFFRCxlQUFPLEtBQUtYLFVBQUwsQ0FBZ0JOLEtBQWhCLE1BQTJCTyxTQUEzQixHQUF1QyxFQUF2QyxHQUE0QyxLQUFLRCxVQUFMLENBQWdCTixLQUFoQixDQUFuRDtFQUNEO0VBOURIOztFQUFBO0VBQUEsSUFBcUJ2QyxVQUFyQjtFQWdFRCxDQWpFOEI7TUFtRWxCeUQsUUFBYjtFQUFBOztFQUFBOztFQUFBO0VBQUE7O0VBQUE7RUFBQTs7RUFBQTtFQUFBLEVBQThCbkIsVUFBVTtFQUFBO0VBQUE7RUFBQTs7RUFBQTtFQUFBLElBQXhDOztFQzVFQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7TUFFcUJvQjs7Ozs7OzthQUNuQixpQkFBZUMsR0FBZixFQUFrQzs7RUFDaENBLE1BQUFBLEdBQUcsQ0FBQ0MsY0FBSixHQUFxQixZQUFvQztFQUFBLFlBQW5DQyxRQUFtQyx1RUFBeEIsbUJBQXdCO0VBQ3ZERixRQUFBQSxHQUFHLFVBQUgsQ0FBVyxzQ0FBWDtFQUVBLGVBQU9BLEdBQUcsQ0FBQ0csU0FBSixDQUFjRCxRQUFkLENBQVA7RUFDRCxPQUpEO0VBS0Q7Ozs7OztFQ2RIO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtNQUVxQkU7RUE4Qm5CLHFCQUFZSixHQUFaLEVBQWlCO0VBQUE7O0VBQUE7O0VBQ2YsU0FBS0EsR0FBTCxHQUFXQSxHQUFYO0VBQ0EsU0FBS0ssV0FBTCxHQUFtQixJQUFuQjtFQUNEOzs7O2FBUEQsc0JBQWFDLEtBQWIsRUFBb0I7RUFDbEIsV0FBS0EsS0FBTCxHQUFhQSxLQUFiO0VBQ0Q7OzthQU9ELHVCQUFjQyxRQUFkLEVBQXVDO0VBRXRDOzs7YUFFRCxzQkFBYTtFQUNYLGFBQU8sS0FBS1AsR0FBTCxXQUFnQixXQUFoQixDQUFQO0VBQ0Q7OzthQUVELHNCQUFhO0VBQ1gsYUFBT1EsT0FBTyxDQUFDQyxHQUFSLENBQVksQ0FDakIsS0FBS0MsVUFBTCxFQURpQixFQUVqQixLQUFLVixHQUFMLFdBQWdCLFNBQWhCLENBRmlCLENBQVosQ0FBUDtFQUlEOzs7YUFFRCxvQkFBV0UsUUFBWCxFQUFxQjtFQUFBOztFQUNuQixhQUFPLEtBQUtRLFVBQUwsR0FBa0JDLElBQWxCLENBQXVCLFlBQU07RUFDbEMsWUFBTUMsT0FBTyxHQUFHLEtBQUksQ0FBQ1osR0FBTCxDQUFTRyxTQUFULENBQW1CRCxRQUFuQixDQUFoQjs7RUFDQVcsUUFBQUEsTUFBTSxDQUFDQyxtQkFBUCxDQUEyQkYsT0FBM0I7RUFDRCxPQUhNLENBQVA7RUFJRDs7O2FBRUQsdUJBQWM7RUFDWixhQUFPLEtBQUtGLFVBQUwsR0FBa0JDLElBQWxCLENBQXVCLFlBQU07RUFDbEMsWUFBSUksTUFBSixFQUFZO0VBQ1ZBLFVBQUFBLE1BQU0sQ0FBQ0MsS0FBUDtFQUNEOztFQUVESCxRQUFBQSxNQUFNLENBQUNHLEtBQVA7RUFDRCxPQU5NLENBQVA7RUFPRDs7O2FBRUQsNkJBQW9CO0VBQ2xCLGFBQU8sS0FBS0MsVUFBTCxHQUFrQk4sSUFBbEIsQ0FBdUIsWUFBTTtFQUNsQ0UsUUFBQUEsTUFBTSxDQUFDRyxLQUFQO0VBQ0QsT0FGTSxDQUFQO0VBR0Q7OzthQUVELDBCQUFpQmQsUUFBakIsRUFBMkI7RUFBQTs7RUFDekIsYUFBTyxLQUFLZSxVQUFMLEdBQWtCTixJQUFsQixDQUF1QixZQUFNO0VBQ2xDLFlBQU1DLE9BQU8sR0FBRyxNQUFJLENBQUNaLEdBQUwsQ0FBU0csU0FBVCxDQUFtQkQsUUFBbkIsQ0FBaEI7O0VBQ0FXLFFBQUFBLE1BQU0sQ0FBQ0MsbUJBQVAsQ0FBMkJGLE9BQTNCO0VBQ0QsT0FITSxDQUFQO0VBSUQ7OzthQUVELHFCQUFZO0VBQ1YsYUFBTyxLQUFLWixHQUFMLFdBQWdCLHFDQUFoQixDQUFQO0VBQ0Q7OzthQUVELHlCQUFnQjtFQUNkLGFBQU8sS0FBS0EsR0FBTCxXQUFnQiwrQkFBaEIsQ0FBUDtFQUNEOzs7V0FuRkQsZUFBZ0I7RUFBRSxhQUFPLElBQVA7RUFBYzs7O2FBRWhDLGlCQUFlQSxHQUFmLEVBQWtDOztFQUNoQztFQUNBa0IsTUFBQUEsTUFBTSxDQUFDQyxrQkFBUCxHQUE0QixZQUFNLEVBQWxDOztFQUVBLFVBQU1DLEVBQUUsR0FBR3BCLEdBQUcsQ0FBQ3FCLEdBQUosR0FBVSxJQUFJLElBQUosQ0FBU3JCLEdBQVQsQ0FBckI7RUFDQUEsTUFBQUEsR0FBRyxDQUFDc0IsVUFBSixHQUFpQkYsRUFBRSxDQUFDRyxhQUFwQjtFQUVBdkIsTUFBQUEsR0FBRyxDQUFDVSxVQUFKLEdBQWlCVSxFQUFFLENBQUNWLFVBQUgsQ0FBY2MsSUFBZCxDQUFtQkosRUFBbkIsQ0FBakI7RUFDQXBCLE1BQUFBLEdBQUcsQ0FBQ2lCLFVBQUosR0FBaUJHLEVBQUUsQ0FBQ0gsVUFBSCxDQUFjTyxJQUFkLENBQW1CSixFQUFuQixDQUFqQjtFQUNBcEIsTUFBQUEsR0FBRyxDQUFDeUIsVUFBSixHQUFpQkwsRUFBRSxDQUFDSyxVQUFILENBQWNELElBQWQsQ0FBbUJKLEVBQW5CLENBQWpCO0VBQ0FwQixNQUFBQSxHQUFHLENBQUMwQixXQUFKLEdBQWtCTixFQUFFLENBQUNNLFdBQUgsQ0FBZUYsSUFBZixDQUFvQkosRUFBcEIsQ0FBbEI7RUFDQXBCLE1BQUFBLEdBQUcsQ0FBQzJCLGlCQUFKLEdBQXdCUCxFQUFFLENBQUNPLGlCQUFILENBQXFCSCxJQUFyQixDQUEwQkosRUFBMUIsQ0FBeEI7RUFDQXBCLE1BQUFBLEdBQUcsQ0FBQzRCLGdCQUFKLEdBQXVCUixFQUFFLENBQUNRLGdCQUFILENBQW9CSixJQUFwQixDQUF5QkosRUFBekIsQ0FBdkI7RUFDRDs7O1dBRUQsZUFBNEI7RUFDMUIsYUFBTztFQUNMUyxRQUFBQSxlQUFlLEVBQUU7RUFEWixPQUFQO0VBR0Q7Ozs7OztFQy9CSDtFQUNBLElBQUlDLFVBQVUsR0FBRyxRQUFPQyxNQUFQLHlDQUFPQSxNQUFQLE1BQWlCLFFBQWpCLElBQTZCQSxNQUE3QixJQUF1Q0EsTUFBTSxDQUFDaEYsTUFBUCxLQUFrQkEsTUFBekQsSUFBbUVnRixNQUFwRjs7RUNDQTs7RUFDQSxJQUFJQyxRQUFRLEdBQUcsUUFBT0MsSUFBUCx5Q0FBT0EsSUFBUCxNQUFlLFFBQWYsSUFBMkJBLElBQTNCLElBQW1DQSxJQUFJLENBQUNsRixNQUFMLEtBQWdCQSxNQUFuRCxJQUE2RGtGLElBQTVFO0VBRUE7O0VBQ0EsSUFBSUMsSUFBSSxHQUFHSixVQUFVLElBQUlFLFFBQWQsSUFBMEJHLFFBQVEsQ0FBQyxhQUFELENBQVIsRUFBckM7O0VDSkE7O0VBQ0EsSUFBSUMsT0FBTSxHQUFHRixJQUFJLENBQUNFLE1BQWxCOztFQ0RBOztFQUNBLElBQUlDLGFBQVcsR0FBR3RGLE1BQU0sQ0FBQ1AsU0FBekI7RUFFQTs7RUFDQSxJQUFJSSxnQkFBYyxHQUFHeUYsYUFBVyxDQUFDekYsY0FBakM7RUFFQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztFQUNBLElBQUkwRixzQkFBb0IsR0FBR0QsYUFBVyxDQUFDRSxRQUF2QztFQUVBOztFQUNBLElBQUlDLGdCQUFjLEdBQUdKLE9BQU0sR0FBR0EsT0FBTSxDQUFDSyxXQUFWLEdBQXdCdEQsU0FBbkQ7RUFFQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7RUFDQSxTQUFTdUQsU0FBVCxDQUFtQkMsS0FBbkIsRUFBMEI7RUFDeEIsTUFBSUMsS0FBSyxHQUFHaEcsZ0JBQWMsQ0FBQ2lHLElBQWYsQ0FBb0JGLEtBQXBCLEVBQTJCSCxnQkFBM0IsQ0FBWjtFQUFBLE1BQ0lNLEdBQUcsR0FBR0gsS0FBSyxDQUFDSCxnQkFBRCxDQURmOztFQUdBLE1BQUk7RUFDRkcsSUFBQUEsS0FBSyxDQUFDSCxnQkFBRCxDQUFMLEdBQXdCckQsU0FBeEI7RUFDQSxRQUFJNEQsUUFBUSxHQUFHLElBQWY7RUFDRCxHQUhELENBR0UsT0FBTy9ELENBQVAsRUFBVTs7RUFFWixNQUFJZ0UsTUFBTSxHQUFHVixzQkFBb0IsQ0FBQ08sSUFBckIsQ0FBMEJGLEtBQTFCLENBQWI7O0VBQ0EsTUFBSUksUUFBSixFQUFjO0VBQ1osUUFBSUgsS0FBSixFQUFXO0VBQ1RELE1BQUFBLEtBQUssQ0FBQ0gsZ0JBQUQsQ0FBTCxHQUF3Qk0sR0FBeEI7RUFDRCxLQUZELE1BRU87RUFDTCxhQUFPSCxLQUFLLENBQUNILGdCQUFELENBQVo7RUFDRDtFQUNGOztFQUNELFNBQU9RLE1BQVA7RUFDRDs7RUMzQ0Q7RUFDQSxJQUFJWCxhQUFXLEdBQUd0RixNQUFNLENBQUNQLFNBQXpCO0VBRUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7RUFDQSxJQUFJOEYsb0JBQW9CLEdBQUdELGFBQVcsQ0FBQ0UsUUFBdkM7RUFFQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7RUFDQSxTQUFTVSxjQUFULENBQXdCTixLQUF4QixFQUErQjtFQUM3QixTQUFPTCxvQkFBb0IsQ0FBQ08sSUFBckIsQ0FBMEJGLEtBQTFCLENBQVA7RUFDRDs7RUNmRDs7RUFDQSxJQUFJTyxPQUFPLEdBQUcsZUFBZDtFQUFBLElBQ0lDLFlBQVksR0FBRyxvQkFEbkI7RUFHQTs7RUFDQSxJQUFJWCxjQUFjLEdBQUdKLE9BQU0sR0FBR0EsT0FBTSxDQUFDSyxXQUFWLEdBQXdCdEQsU0FBbkQ7RUFFQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7RUFDQSxTQUFTaUUsVUFBVCxDQUFvQlQsS0FBcEIsRUFBMkI7RUFDekIsTUFBSUEsS0FBSyxJQUFJLElBQWIsRUFBbUI7RUFDakIsV0FBT0EsS0FBSyxLQUFLeEQsU0FBVixHQUFzQmdFLFlBQXRCLEdBQXFDRCxPQUE1QztFQUNEOztFQUNELFNBQVFWLGNBQWMsSUFBSUEsY0FBYyxJQUFJekYsTUFBTSxDQUFDNEYsS0FBRCxDQUEzQyxHQUNIRCxTQUFTLENBQUNDLEtBQUQsQ0FETixHQUVITSxjQUFjLENBQUNOLEtBQUQsQ0FGbEI7RUFHRDs7RUN6QkQ7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsU0FBU1UsWUFBVCxDQUFzQlYsS0FBdEIsRUFBNkI7RUFDM0IsU0FBT0EsS0FBSyxJQUFJLElBQVQsSUFBaUIsUUFBT0EsS0FBUCxLQUFnQixRQUF4QztFQUNEOztFQzFCRDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsSUFBSTdELE9BQU8sR0FBR1IsS0FBSyxDQUFDUSxPQUFwQjs7RUN2QkE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxTQUFTd0UsUUFBVCxDQUFrQlgsS0FBbEIsRUFBeUI7RUFDdkIsTUFBSVksSUFBSSxXQUFVWixLQUFWLENBQVI7O0VBQ0EsU0FBT0EsS0FBSyxJQUFJLElBQVQsS0FBa0JZLElBQUksSUFBSSxRQUFSLElBQW9CQSxJQUFJLElBQUksVUFBOUMsQ0FBUDtFQUNEOztFQzVCRDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLFNBQVNDLFFBQVQsQ0FBa0JiLEtBQWxCLEVBQXlCO0VBQ3ZCLFNBQU9BLEtBQVA7RUFDRDs7RUNmRDs7RUFDQSxJQUFJYyxRQUFRLEdBQUcsd0JBQWY7RUFBQSxJQUNJQyxTQUFPLEdBQUcsbUJBRGQ7RUFBQSxJQUVJQyxNQUFNLEdBQUcsNEJBRmI7RUFBQSxJQUdJQyxRQUFRLEdBQUcsZ0JBSGY7RUFLQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztFQUNBLFNBQVNDLFVBQVQsQ0FBb0JsQixLQUFwQixFQUEyQjtFQUN6QixNQUFJLENBQUNXLFFBQVEsQ0FBQ1gsS0FBRCxDQUFiLEVBQXNCO0VBQ3BCLFdBQU8sS0FBUDtFQUNELEdBSHdCO0VBS3pCOzs7RUFDQSxNQUFJRyxHQUFHLEdBQUdNLFVBQVUsQ0FBQ1QsS0FBRCxDQUFwQjtFQUNBLFNBQU9HLEdBQUcsSUFBSVksU0FBUCxJQUFrQlosR0FBRyxJQUFJYSxNQUF6QixJQUFtQ2IsR0FBRyxJQUFJVyxRQUExQyxJQUFzRFgsR0FBRyxJQUFJYyxRQUFwRTtFQUNEOztFQ2hDRDs7RUFDQSxJQUFJRSxVQUFVLEdBQUc1QixJQUFJLENBQUMsb0JBQUQsQ0FBckI7O0VDREE7O0VBQ0EsSUFBSTZCLFVBQVUsR0FBSSxZQUFXO0VBQzNCLE1BQUlDLEdBQUcsR0FBRyxTQUFTQyxJQUFULENBQWNILFVBQVUsSUFBSUEsVUFBVSxDQUFDSSxJQUF6QixJQUFpQ0osVUFBVSxDQUFDSSxJQUFYLENBQWdCQyxRQUFqRCxJQUE2RCxFQUEzRSxDQUFWO0VBQ0EsU0FBT0gsR0FBRyxHQUFJLG1CQUFtQkEsR0FBdkIsR0FBOEIsRUFBeEM7RUFDRCxDQUhpQixFQUFsQjtFQUtBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOzs7RUFDQSxTQUFTSSxRQUFULENBQWtCQyxJQUFsQixFQUF3QjtFQUN0QixTQUFPLENBQUMsQ0FBQ04sVUFBRixJQUFpQkEsVUFBVSxJQUFJTSxJQUF0QztFQUNEOztFQ2pCRDtFQUNBLElBQUlDLFdBQVMsR0FBR25DLFFBQVEsQ0FBQzNGLFNBQXpCO0VBRUE7O0VBQ0EsSUFBSStILGNBQVksR0FBR0QsV0FBUyxDQUFDL0IsUUFBN0I7RUFFQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7RUFDQSxTQUFTaUMsUUFBVCxDQUFrQkgsSUFBbEIsRUFBd0I7RUFDdEIsTUFBSUEsSUFBSSxJQUFJLElBQVosRUFBa0I7RUFDaEIsUUFBSTtFQUNGLGFBQU9FLGNBQVksQ0FBQzFCLElBQWIsQ0FBa0J3QixJQUFsQixDQUFQO0VBQ0QsS0FGRCxDQUVFLE9BQU9yRixDQUFQLEVBQVU7O0VBQ1osUUFBSTtFQUNGLGFBQVFxRixJQUFJLEdBQUcsRUFBZjtFQUNELEtBRkQsQ0FFRSxPQUFPckYsQ0FBUCxFQUFVO0VBQ2I7O0VBQ0QsU0FBTyxFQUFQO0VBQ0Q7O0VDbEJEO0VBQ0E7RUFDQTtFQUNBOztFQUNBLElBQUl5RixZQUFZLEdBQUcscUJBQW5CO0VBRUE7O0VBQ0EsSUFBSUMsWUFBWSxHQUFHLDZCQUFuQjtFQUVBOztFQUNBLElBQUlKLFdBQVMsR0FBR25DLFFBQVEsQ0FBQzNGLFNBQXpCO0VBQUEsSUFDSTZGLGFBQVcsR0FBR3RGLE1BQU0sQ0FBQ1AsU0FEekI7RUFHQTs7RUFDQSxJQUFJK0gsY0FBWSxHQUFHRCxXQUFTLENBQUMvQixRQUE3QjtFQUVBOztFQUNBLElBQUkzRixnQkFBYyxHQUFHeUYsYUFBVyxDQUFDekYsY0FBakM7RUFFQTs7RUFDQSxJQUFJK0gsVUFBVSxHQUFHQyxNQUFNLENBQUMsTUFDdEJMLGNBQVksQ0FBQzFCLElBQWIsQ0FBa0JqRyxnQkFBbEIsRUFBa0NpSSxPQUFsQyxDQUEwQ0osWUFBMUMsRUFBd0QsTUFBeEQsRUFDQ0ksT0FERCxDQUNTLHdEQURULEVBQ21FLE9BRG5FLENBRHNCLEdBRXdELEdBRnpELENBQXZCO0VBS0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7RUFDQSxTQUFTQyxZQUFULENBQXNCbkMsS0FBdEIsRUFBNkI7RUFDM0IsTUFBSSxDQUFDVyxRQUFRLENBQUNYLEtBQUQsQ0FBVCxJQUFvQnlCLFFBQVEsQ0FBQ3pCLEtBQUQsQ0FBaEMsRUFBeUM7RUFDdkMsV0FBTyxLQUFQO0VBQ0Q7O0VBQ0QsTUFBSW9DLE9BQU8sR0FBR2xCLFVBQVUsQ0FBQ2xCLEtBQUQsQ0FBVixHQUFvQmdDLFVBQXBCLEdBQWlDRCxZQUEvQztFQUNBLFNBQU9LLE9BQU8sQ0FBQ0MsSUFBUixDQUFhUixRQUFRLENBQUM3QixLQUFELENBQXJCLENBQVA7RUFDRDs7RUM1Q0Q7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLFNBQVNzQyxRQUFULENBQWtCQyxNQUFsQixFQUEwQkMsR0FBMUIsRUFBK0I7RUFDN0IsU0FBT0QsTUFBTSxJQUFJLElBQVYsR0FBaUIvRixTQUFqQixHQUE2QitGLE1BQU0sQ0FBQ0MsR0FBRCxDQUExQztFQUNEOztFQ1BEO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0VBQ0EsU0FBU0MsU0FBVCxDQUFtQkYsTUFBbkIsRUFBMkJDLEdBQTNCLEVBQWdDO0VBQzlCLE1BQUl4QyxLQUFLLEdBQUdzQyxRQUFRLENBQUNDLE1BQUQsRUFBU0MsR0FBVCxDQUFwQjtFQUNBLFNBQU9MLFlBQVksQ0FBQ25DLEtBQUQsQ0FBWixHQUFzQkEsS0FBdEIsR0FBOEJ4RCxTQUFyQztFQUNEOztFQ1pEOztFQUNBLElBQUlrRyxZQUFZLEdBQUd0SSxNQUFNLENBQUN1SSxNQUExQjtFQUVBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0VBQ0EsSUFBSUMsVUFBVSxHQUFJLFlBQVc7RUFDM0IsV0FBU0wsTUFBVCxHQUFrQjs7RUFDbEIsU0FBTyxVQUFTdkksS0FBVCxFQUFnQjtFQUNyQixRQUFJLENBQUMyRyxRQUFRLENBQUMzRyxLQUFELENBQWIsRUFBc0I7RUFDcEIsYUFBTyxFQUFQO0VBQ0Q7O0VBQ0QsUUFBSTBJLFlBQUosRUFBa0I7RUFDaEIsYUFBT0EsWUFBWSxDQUFDMUksS0FBRCxDQUFuQjtFQUNEOztFQUNEdUksSUFBQUEsTUFBTSxDQUFDMUksU0FBUCxHQUFtQkcsS0FBbkI7RUFDQSxRQUFJcUcsTUFBTSxHQUFHLElBQUlrQyxNQUFKLEVBQWI7RUFDQUEsSUFBQUEsTUFBTSxDQUFDMUksU0FBUCxHQUFtQjJDLFNBQW5CO0VBQ0EsV0FBTzZELE1BQVA7RUFDRCxHQVhEO0VBWUQsQ0FkaUIsRUFBbEI7O0VDYkE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxTQUFTNUcsS0FBVCxDQUFlaUksSUFBZixFQUFxQm1CLE9BQXJCLEVBQThCN0YsSUFBOUIsRUFBb0M7RUFDbEMsVUFBUUEsSUFBSSxDQUFDOEYsTUFBYjtFQUNFLFNBQUssQ0FBTDtFQUFRLGFBQU9wQixJQUFJLENBQUN4QixJQUFMLENBQVUyQyxPQUFWLENBQVA7O0VBQ1IsU0FBSyxDQUFMO0VBQVEsYUFBT25CLElBQUksQ0FBQ3hCLElBQUwsQ0FBVTJDLE9BQVYsRUFBbUI3RixJQUFJLENBQUMsQ0FBRCxDQUF2QixDQUFQOztFQUNSLFNBQUssQ0FBTDtFQUFRLGFBQU8wRSxJQUFJLENBQUN4QixJQUFMLENBQVUyQyxPQUFWLEVBQW1CN0YsSUFBSSxDQUFDLENBQUQsQ0FBdkIsRUFBNEJBLElBQUksQ0FBQyxDQUFELENBQWhDLENBQVA7O0VBQ1IsU0FBSyxDQUFMO0VBQVEsYUFBTzBFLElBQUksQ0FBQ3hCLElBQUwsQ0FBVTJDLE9BQVYsRUFBbUI3RixJQUFJLENBQUMsQ0FBRCxDQUF2QixFQUE0QkEsSUFBSSxDQUFDLENBQUQsQ0FBaEMsRUFBcUNBLElBQUksQ0FBQyxDQUFELENBQXpDLENBQVA7RUFKVjs7RUFNQSxTQUFPMEUsSUFBSSxDQUFDakksS0FBTCxDQUFXb0osT0FBWCxFQUFvQjdGLElBQXBCLENBQVA7RUFDRDs7RUNsQkQ7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLFNBQVMrRixTQUFULENBQW1CQyxNQUFuQixFQUEyQkMsS0FBM0IsRUFBa0M7RUFDaEMsTUFBSUMsS0FBSyxHQUFHLENBQUMsQ0FBYjtFQUFBLE1BQ0lKLE1BQU0sR0FBR0UsTUFBTSxDQUFDRixNQURwQjtFQUdBRyxFQUFBQSxLQUFLLEtBQUtBLEtBQUssR0FBR3RILEtBQUssQ0FBQ21ILE1BQUQsQ0FBbEIsQ0FBTDs7RUFDQSxTQUFPLEVBQUVJLEtBQUYsR0FBVUosTUFBakIsRUFBeUI7RUFDdkJHLElBQUFBLEtBQUssQ0FBQ0MsS0FBRCxDQUFMLEdBQWVGLE1BQU0sQ0FBQ0UsS0FBRCxDQUFyQjtFQUNEOztFQUNELFNBQU9ELEtBQVA7RUFDRDs7RUNqQkQ7RUFDQSxJQUFJRSxTQUFTLEdBQUcsR0FBaEI7RUFBQSxJQUNJQyxRQUFRLEdBQUcsRUFEZjtFQUdBOztFQUNBLElBQUlDLFNBQVMsR0FBR0MsSUFBSSxDQUFDQyxHQUFyQjtFQUVBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7RUFDQSxTQUFTQyxRQUFULENBQWtCOUIsSUFBbEIsRUFBd0I7RUFDdEIsTUFBSStCLEtBQUssR0FBRyxDQUFaO0VBQUEsTUFDSUMsVUFBVSxHQUFHLENBRGpCO0VBR0EsU0FBTyxZQUFXO0VBQ2hCLFFBQUlDLEtBQUssR0FBR04sU0FBUyxFQUFyQjtFQUFBLFFBQ0lPLFNBQVMsR0FBR1IsUUFBUSxJQUFJTyxLQUFLLEdBQUdELFVBQVosQ0FEeEI7RUFHQUEsSUFBQUEsVUFBVSxHQUFHQyxLQUFiOztFQUNBLFFBQUlDLFNBQVMsR0FBRyxDQUFoQixFQUFtQjtFQUNqQixVQUFJLEVBQUVILEtBQUYsSUFBV04sU0FBZixFQUEwQjtFQUN4QixlQUFPVSxTQUFTLENBQUMsQ0FBRCxDQUFoQjtFQUNEO0VBQ0YsS0FKRCxNQUlPO0VBQ0xKLE1BQUFBLEtBQUssR0FBRyxDQUFSO0VBQ0Q7O0VBQ0QsV0FBTy9CLElBQUksQ0FBQ2pJLEtBQUwsQ0FBVytDLFNBQVgsRUFBc0JxSCxTQUF0QixDQUFQO0VBQ0QsR0FiRDtFQWNEOztFQ2xDRDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLFNBQVNDLFFBQVQsQ0FBa0I5RCxLQUFsQixFQUF5QjtFQUN2QixTQUFPLFlBQVc7RUFDaEIsV0FBT0EsS0FBUDtFQUNELEdBRkQ7RUFHRDs7RUNyQkQsSUFBSStELGNBQWMsR0FBSSxZQUFXO0VBQy9CLE1BQUk7RUFDRixRQUFJckMsSUFBSSxHQUFHZSxTQUFTLENBQUNySSxNQUFELEVBQVMsZ0JBQVQsQ0FBcEI7RUFDQXNILElBQUFBLElBQUksQ0FBQyxFQUFELEVBQUssRUFBTCxFQUFTLEVBQVQsQ0FBSjtFQUNBLFdBQU9BLElBQVA7RUFDRCxHQUpELENBSUUsT0FBT3JGLENBQVAsRUFBVTtFQUNiLENBTnFCLEVBQXRCOztFQ0VBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0VBQ0EsSUFBSTJILGVBQWUsR0FBRyxDQUFDRCxjQUFELEdBQWtCbEQsUUFBbEIsR0FBNkIsVUFBU2EsSUFBVCxFQUFldUMsTUFBZixFQUF1QjtFQUN4RSxTQUFPRixjQUFjLENBQUNyQyxJQUFELEVBQU8sVUFBUCxFQUFtQjtFQUN0QyxvQkFBZ0IsSUFEc0I7RUFFdEMsa0JBQWMsS0FGd0I7RUFHdEMsYUFBU29DLFFBQVEsQ0FBQ0csTUFBRCxDQUhxQjtFQUl0QyxnQkFBWTtFQUowQixHQUFuQixDQUFyQjtFQU1ELENBUEQ7O0VDVEE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7RUFDQSxJQUFJQyxXQUFXLEdBQUdWLFFBQVEsQ0FBQ1EsZUFBRCxDQUExQjs7RUNYQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxTQUFTRyxTQUFULENBQW1CbEIsS0FBbkIsRUFBMEJtQixRQUExQixFQUFvQztFQUNsQyxNQUFJbEIsS0FBSyxHQUFHLENBQUMsQ0FBYjtFQUFBLE1BQ0lKLE1BQU0sR0FBR0csS0FBSyxJQUFJLElBQVQsR0FBZ0IsQ0FBaEIsR0FBb0JBLEtBQUssQ0FBQ0gsTUFEdkM7O0VBR0EsU0FBTyxFQUFFSSxLQUFGLEdBQVVKLE1BQWpCLEVBQXlCO0VBQ3ZCLFFBQUlzQixRQUFRLENBQUNuQixLQUFLLENBQUNDLEtBQUQsQ0FBTixFQUFlQSxLQUFmLEVBQXNCRCxLQUF0QixDQUFSLEtBQXlDLEtBQTdDLEVBQW9EO0VBQ2xEO0VBQ0Q7RUFDRjs7RUFDRCxTQUFPQSxLQUFQO0VBQ0Q7O0VDbkJEO0VBQ0EsSUFBSW9CLGtCQUFnQixHQUFHLGdCQUF2QjtFQUVBOztFQUNBLElBQUlDLFFBQVEsR0FBRyxrQkFBZjtFQUVBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0VBQ0EsU0FBU0MsT0FBVCxDQUFpQnZFLEtBQWpCLEVBQXdCOEMsTUFBeEIsRUFBZ0M7RUFDOUIsTUFBSWxDLElBQUksV0FBVVosS0FBVixDQUFSOztFQUNBOEMsRUFBQUEsTUFBTSxHQUFHQSxNQUFNLElBQUksSUFBVixHQUFpQnVCLGtCQUFqQixHQUFvQ3ZCLE1BQTdDO0VBRUEsU0FBTyxDQUFDLENBQUNBLE1BQUYsS0FDSmxDLElBQUksSUFBSSxRQUFSLElBQ0VBLElBQUksSUFBSSxRQUFSLElBQW9CMEQsUUFBUSxDQUFDakMsSUFBVCxDQUFjckMsS0FBZCxDQUZsQixLQUdBQSxLQUFLLEdBQUcsQ0FBQyxDQUFULElBQWNBLEtBQUssR0FBRyxDQUFSLElBQWEsQ0FBM0IsSUFBZ0NBLEtBQUssR0FBRzhDLE1BSC9DO0VBSUQ7O0VDcEJEO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7RUFDQSxTQUFTMEIsZUFBVCxDQUF5QmpDLE1BQXpCLEVBQWlDQyxHQUFqQyxFQUFzQ3hDLEtBQXRDLEVBQTZDO0VBQzNDLE1BQUl3QyxHQUFHLElBQUksV0FBUCxJQUFzQnVCLGNBQTFCLEVBQTBDO0VBQ3hDQSxJQUFBQSxjQUFjLENBQUN4QixNQUFELEVBQVNDLEdBQVQsRUFBYztFQUMxQixzQkFBZ0IsSUFEVTtFQUUxQixvQkFBYyxJQUZZO0VBRzFCLGVBQVN4QyxLQUhpQjtFQUkxQixrQkFBWTtFQUpjLEtBQWQsQ0FBZDtFQU1ELEdBUEQsTUFPTztFQUNMdUMsSUFBQUEsTUFBTSxDQUFDQyxHQUFELENBQU4sR0FBY3hDLEtBQWQ7RUFDRDtFQUNGOztFQ3RCRDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsU0FBU3lFLEVBQVQsQ0FBWXpFLEtBQVosRUFBbUIwRSxLQUFuQixFQUEwQjtFQUN4QixTQUFPMUUsS0FBSyxLQUFLMEUsS0FBVixJQUFvQjFFLEtBQUssS0FBS0EsS0FBVixJQUFtQjBFLEtBQUssS0FBS0EsS0FBeEQ7RUFDRDs7RUMvQkQ7O0VBQ0EsSUFBSWhGLGFBQVcsR0FBR3RGLE1BQU0sQ0FBQ1AsU0FBekI7RUFFQTs7RUFDQSxJQUFJSSxnQkFBYyxHQUFHeUYsYUFBVyxDQUFDekYsY0FBakM7RUFFQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7RUFDQSxTQUFTMEssV0FBVCxDQUFxQnBDLE1BQXJCLEVBQTZCQyxHQUE3QixFQUFrQ3hDLEtBQWxDLEVBQXlDO0VBQ3ZDLE1BQUk0RSxRQUFRLEdBQUdyQyxNQUFNLENBQUNDLEdBQUQsQ0FBckI7O0VBQ0EsTUFBSSxFQUFFdkksZ0JBQWMsQ0FBQ2lHLElBQWYsQ0FBb0JxQyxNQUFwQixFQUE0QkMsR0FBNUIsS0FBb0NpQyxFQUFFLENBQUNHLFFBQUQsRUFBVzVFLEtBQVgsQ0FBeEMsS0FDQ0EsS0FBSyxLQUFLeEQsU0FBVixJQUF1QixFQUFFZ0csR0FBRyxJQUFJRCxNQUFULENBRDVCLEVBQytDO0VBQzdDaUMsSUFBQUEsZUFBZSxDQUFDakMsTUFBRCxFQUFTQyxHQUFULEVBQWN4QyxLQUFkLENBQWY7RUFDRDtFQUNGOztFQ3RCRDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7RUFDQSxTQUFTNkUsVUFBVCxDQUFvQjdCLE1BQXBCLEVBQTRCOEIsS0FBNUIsRUFBbUN2QyxNQUFuQyxFQUEyQ3dDLFVBQTNDLEVBQXVEO0VBQ3JELE1BQUlDLEtBQUssR0FBRyxDQUFDekMsTUFBYjtFQUNBQSxFQUFBQSxNQUFNLEtBQUtBLE1BQU0sR0FBRyxFQUFkLENBQU47RUFFQSxNQUFJVyxLQUFLLEdBQUcsQ0FBQyxDQUFiO0VBQUEsTUFDSUosTUFBTSxHQUFHZ0MsS0FBSyxDQUFDaEMsTUFEbkI7O0VBR0EsU0FBTyxFQUFFSSxLQUFGLEdBQVVKLE1BQWpCLEVBQXlCO0VBQ3ZCLFFBQUlOLEdBQUcsR0FBR3NDLEtBQUssQ0FBQzVCLEtBQUQsQ0FBZjtFQUVBLFFBQUkrQixRQUFRLEdBQUdGLFVBQVUsR0FDckJBLFVBQVUsQ0FBQ3hDLE1BQU0sQ0FBQ0MsR0FBRCxDQUFQLEVBQWNRLE1BQU0sQ0FBQ1IsR0FBRCxDQUFwQixFQUEyQkEsR0FBM0IsRUFBZ0NELE1BQWhDLEVBQXdDUyxNQUF4QyxDQURXLEdBRXJCeEcsU0FGSjs7RUFJQSxRQUFJeUksUUFBUSxLQUFLekksU0FBakIsRUFBNEI7RUFDMUJ5SSxNQUFBQSxRQUFRLEdBQUdqQyxNQUFNLENBQUNSLEdBQUQsQ0FBakI7RUFDRDs7RUFDRCxRQUFJd0MsS0FBSixFQUFXO0VBQ1RSLE1BQUFBLGVBQWUsQ0FBQ2pDLE1BQUQsRUFBU0MsR0FBVCxFQUFjeUMsUUFBZCxDQUFmO0VBQ0QsS0FGRCxNQUVPO0VBQ0xOLE1BQUFBLFdBQVcsQ0FBQ3BDLE1BQUQsRUFBU0MsR0FBVCxFQUFjeUMsUUFBZCxDQUFYO0VBQ0Q7RUFDRjs7RUFDRCxTQUFPMUMsTUFBUDtFQUNEOztFQ25DRDs7RUFDQSxJQUFJMkMsU0FBUyxHQUFHQyxJQUFJLENBQUNDLEdBQXJCO0VBRUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztFQUNBLFNBQVNDLFFBQVQsQ0FBa0IzRCxJQUFsQixFQUF3QnJELEtBQXhCLEVBQStCaUgsU0FBL0IsRUFBMEM7RUFDeENqSCxFQUFBQSxLQUFLLEdBQUc2RyxTQUFTLENBQUM3RyxLQUFLLEtBQUs3QixTQUFWLEdBQXVCa0YsSUFBSSxDQUFDb0IsTUFBTCxHQUFjLENBQXJDLEdBQTBDekUsS0FBM0MsRUFBa0QsQ0FBbEQsQ0FBakI7RUFDQSxTQUFPLFlBQVc7RUFDaEIsUUFBSXJCLElBQUksR0FBRzZHLFNBQVg7RUFBQSxRQUNJWCxLQUFLLEdBQUcsQ0FBQyxDQURiO0VBQUEsUUFFSUosTUFBTSxHQUFHb0MsU0FBUyxDQUFDbEksSUFBSSxDQUFDOEYsTUFBTCxHQUFjekUsS0FBZixFQUFzQixDQUF0QixDQUZ0QjtFQUFBLFFBR0k0RSxLQUFLLEdBQUd0SCxLQUFLLENBQUNtSCxNQUFELENBSGpCOztFQUtBLFdBQU8sRUFBRUksS0FBRixHQUFVSixNQUFqQixFQUF5QjtFQUN2QkcsTUFBQUEsS0FBSyxDQUFDQyxLQUFELENBQUwsR0FBZWxHLElBQUksQ0FBQ3FCLEtBQUssR0FBRzZFLEtBQVQsQ0FBbkI7RUFDRDs7RUFDREEsSUFBQUEsS0FBSyxHQUFHLENBQUMsQ0FBVDtFQUNBLFFBQUlxQyxTQUFTLEdBQUc1SixLQUFLLENBQUMwQyxLQUFLLEdBQUcsQ0FBVCxDQUFyQjs7RUFDQSxXQUFPLEVBQUU2RSxLQUFGLEdBQVU3RSxLQUFqQixFQUF3QjtFQUN0QmtILE1BQUFBLFNBQVMsQ0FBQ3JDLEtBQUQsQ0FBVCxHQUFtQmxHLElBQUksQ0FBQ2tHLEtBQUQsQ0FBdkI7RUFDRDs7RUFDRHFDLElBQUFBLFNBQVMsQ0FBQ2xILEtBQUQsQ0FBVCxHQUFtQmlILFNBQVMsQ0FBQ3JDLEtBQUQsQ0FBNUI7RUFDQSxXQUFPeEosS0FBSyxDQUFDaUksSUFBRCxFQUFPLElBQVAsRUFBYTZELFNBQWIsQ0FBWjtFQUNELEdBaEJEO0VBaUJEOztFQzdCRDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztFQUNBLFNBQVNDLFFBQVQsQ0FBa0I5RCxJQUFsQixFQUF3QnJELEtBQXhCLEVBQStCO0VBQzdCLFNBQU82RixXQUFXLENBQUNtQixRQUFRLENBQUMzRCxJQUFELEVBQU9yRCxLQUFQLEVBQWN3QyxRQUFkLENBQVQsRUFBa0NhLElBQUksR0FBRyxFQUF6QyxDQUFsQjtFQUNEOztFQ2REO0VBQ0EsSUFBSTJDLGdCQUFnQixHQUFHLGdCQUF2QjtFQUVBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0VBQ0EsU0FBU29CLFFBQVQsQ0FBa0J6RixLQUFsQixFQUF5QjtFQUN2QixTQUFPLE9BQU9BLEtBQVAsSUFBZ0IsUUFBaEIsSUFDTEEsS0FBSyxHQUFHLENBQUMsQ0FESixJQUNTQSxLQUFLLEdBQUcsQ0FBUixJQUFhLENBRHRCLElBQzJCQSxLQUFLLElBQUlxRSxnQkFEM0M7RUFFRDs7RUM3QkQ7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0VBQ0EsU0FBU3FCLFdBQVQsQ0FBcUIxRixLQUFyQixFQUE0QjtFQUMxQixTQUFPQSxLQUFLLElBQUksSUFBVCxJQUFpQnlGLFFBQVEsQ0FBQ3pGLEtBQUssQ0FBQzhDLE1BQVAsQ0FBekIsSUFBMkMsQ0FBQzVCLFVBQVUsQ0FBQ2xCLEtBQUQsQ0FBN0Q7RUFDRDs7RUN6QkQ7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0VBQ0EsU0FBUzJGLGNBQVQsQ0FBd0IzRixLQUF4QixFQUErQmtELEtBQS9CLEVBQXNDWCxNQUF0QyxFQUE4QztFQUM1QyxNQUFJLENBQUM1QixRQUFRLENBQUM0QixNQUFELENBQWIsRUFBdUI7RUFDckIsV0FBTyxLQUFQO0VBQ0Q7O0VBQ0QsTUFBSTNCLElBQUksV0FBVXNDLEtBQVYsQ0FBUjs7RUFDQSxNQUFJdEMsSUFBSSxJQUFJLFFBQVIsR0FDSzhFLFdBQVcsQ0FBQ25ELE1BQUQsQ0FBWCxJQUF1QmdDLE9BQU8sQ0FBQ3JCLEtBQUQsRUFBUVgsTUFBTSxDQUFDTyxNQUFmLENBRG5DLEdBRUtsQyxJQUFJLElBQUksUUFBUixJQUFvQnNDLEtBQUssSUFBSVgsTUFGdEMsRUFHTTtFQUNKLFdBQU9rQyxFQUFFLENBQUNsQyxNQUFNLENBQUNXLEtBQUQsQ0FBUCxFQUFnQmxELEtBQWhCLENBQVQ7RUFDRDs7RUFDRCxTQUFPLEtBQVA7RUFDRDs7RUN4QkQ7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0VBQ0EsU0FBUzRGLGNBQVQsQ0FBd0JDLFFBQXhCLEVBQWtDO0VBQ2hDLFNBQU9MLFFBQVEsQ0FBQyxVQUFTakQsTUFBVCxFQUFpQnVELE9BQWpCLEVBQTBCO0VBQ3hDLFFBQUk1QyxLQUFLLEdBQUcsQ0FBQyxDQUFiO0VBQUEsUUFDSUosTUFBTSxHQUFHZ0QsT0FBTyxDQUFDaEQsTUFEckI7RUFBQSxRQUVJaUMsVUFBVSxHQUFHakMsTUFBTSxHQUFHLENBQVQsR0FBYWdELE9BQU8sQ0FBQ2hELE1BQU0sR0FBRyxDQUFWLENBQXBCLEdBQW1DdEcsU0FGcEQ7RUFBQSxRQUdJdUosS0FBSyxHQUFHakQsTUFBTSxHQUFHLENBQVQsR0FBYWdELE9BQU8sQ0FBQyxDQUFELENBQXBCLEdBQTBCdEosU0FIdEM7RUFLQXVJLElBQUFBLFVBQVUsR0FBSWMsUUFBUSxDQUFDL0MsTUFBVCxHQUFrQixDQUFsQixJQUF1QixPQUFPaUMsVUFBUCxJQUFxQixVQUE3QyxJQUNSakMsTUFBTSxJQUFJaUMsVUFERixJQUVUdkksU0FGSjs7RUFJQSxRQUFJdUosS0FBSyxJQUFJSixjQUFjLENBQUNHLE9BQU8sQ0FBQyxDQUFELENBQVIsRUFBYUEsT0FBTyxDQUFDLENBQUQsQ0FBcEIsRUFBeUJDLEtBQXpCLENBQTNCLEVBQTREO0VBQzFEaEIsTUFBQUEsVUFBVSxHQUFHakMsTUFBTSxHQUFHLENBQVQsR0FBYXRHLFNBQWIsR0FBeUJ1SSxVQUF0QztFQUNBakMsTUFBQUEsTUFBTSxHQUFHLENBQVQ7RUFDRDs7RUFDRFAsSUFBQUEsTUFBTSxHQUFHbkksTUFBTSxDQUFDbUksTUFBRCxDQUFmOztFQUNBLFdBQU8sRUFBRVcsS0FBRixHQUFVSixNQUFqQixFQUF5QjtFQUN2QixVQUFJRSxNQUFNLEdBQUc4QyxPQUFPLENBQUM1QyxLQUFELENBQXBCOztFQUNBLFVBQUlGLE1BQUosRUFBWTtFQUNWNkMsUUFBQUEsUUFBUSxDQUFDdEQsTUFBRCxFQUFTUyxNQUFULEVBQWlCRSxLQUFqQixFQUF3QjZCLFVBQXhCLENBQVI7RUFDRDtFQUNGOztFQUNELFdBQU94QyxNQUFQO0VBQ0QsR0F0QmMsQ0FBZjtFQXVCRDs7RUNsQ0Q7RUFDQSxJQUFJN0MsYUFBVyxHQUFHdEYsTUFBTSxDQUFDUCxTQUF6QjtFQUVBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztFQUNBLFNBQVNtTSxXQUFULENBQXFCaEcsS0FBckIsRUFBNEI7RUFDMUIsTUFBSWlHLElBQUksR0FBR2pHLEtBQUssSUFBSUEsS0FBSyxDQUFDa0csV0FBMUI7RUFBQSxNQUNJbE0sS0FBSyxHQUFJLE9BQU9pTSxJQUFQLElBQWUsVUFBZixJQUE2QkEsSUFBSSxDQUFDcE0sU0FBbkMsSUFBaUQ2RixhQUQ3RDtFQUdBLFNBQU9NLEtBQUssS0FBS2hHLEtBQWpCO0VBQ0Q7O0VDZkQ7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsU0FBU21NLFNBQVQsQ0FBbUJDLENBQW5CLEVBQXNCaEMsUUFBdEIsRUFBZ0M7RUFDOUIsTUFBSWxCLEtBQUssR0FBRyxDQUFDLENBQWI7RUFBQSxNQUNJN0MsTUFBTSxHQUFHMUUsS0FBSyxDQUFDeUssQ0FBRCxDQURsQjs7RUFHQSxTQUFPLEVBQUVsRCxLQUFGLEdBQVVrRCxDQUFqQixFQUFvQjtFQUNsQi9GLElBQUFBLE1BQU0sQ0FBQzZDLEtBQUQsQ0FBTixHQUFnQmtCLFFBQVEsQ0FBQ2xCLEtBQUQsQ0FBeEI7RUFDRDs7RUFDRCxTQUFPN0MsTUFBUDtFQUNEOztFQ2REOztFQUNBLElBQUlnRyxTQUFPLEdBQUcsb0JBQWQ7RUFFQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7RUFDQSxTQUFTQyxlQUFULENBQXlCdEcsS0FBekIsRUFBZ0M7RUFDOUIsU0FBT1UsWUFBWSxDQUFDVixLQUFELENBQVosSUFBdUJTLFVBQVUsQ0FBQ1QsS0FBRCxDQUFWLElBQXFCcUcsU0FBbkQ7RUFDRDs7RUNaRDs7RUFDQSxJQUFJM0csYUFBVyxHQUFHdEYsTUFBTSxDQUFDUCxTQUF6QjtFQUVBOztFQUNBLElBQUlJLGdCQUFjLEdBQUd5RixhQUFXLENBQUN6RixjQUFqQztFQUVBOztFQUNBLElBQUlzTSxvQkFBb0IsR0FBRzdHLGFBQVcsQ0FBQzZHLG9CQUF2QztFQUVBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7RUFDQSxJQUFJQyxXQUFXLEdBQUdGLGVBQWUsQ0FBQyxZQUFXO0VBQUUsU0FBT3pDLFNBQVA7RUFBbUIsQ0FBaEMsRUFBRCxDQUFmLEdBQXNEeUMsZUFBdEQsR0FBd0UsVUFBU3RHLEtBQVQsRUFBZ0I7RUFDeEcsU0FBT1UsWUFBWSxDQUFDVixLQUFELENBQVosSUFBdUIvRixnQkFBYyxDQUFDaUcsSUFBZixDQUFvQkYsS0FBcEIsRUFBMkIsUUFBM0IsQ0FBdkIsSUFDTCxDQUFDdUcsb0JBQW9CLENBQUNyRyxJQUFyQixDQUEwQkYsS0FBMUIsRUFBaUMsUUFBakMsQ0FESDtFQUVELENBSEQ7O0VDOUJBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsU0FBU3lHLFNBQVQsR0FBcUI7RUFDbkIsU0FBTyxLQUFQO0VBQ0Q7O0VDWkQ7O0VBQ0EsSUFBSUMsYUFBVyxHQUFHLFFBQU9DLE9BQVAseUNBQU9BLE9BQVAsTUFBa0IsUUFBbEIsSUFBOEJBLE9BQTlCLElBQXlDLENBQUNBLE9BQU8sQ0FBQ0MsUUFBbEQsSUFBOERELE9BQWhGO0VBRUE7O0VBQ0EsSUFBSUUsWUFBVSxHQUFHSCxhQUFXLElBQUksUUFBT0ksTUFBUCx5Q0FBT0EsTUFBUCxNQUFpQixRQUFoQyxJQUE0Q0EsTUFBNUMsSUFBc0QsQ0FBQ0EsTUFBTSxDQUFDRixRQUE5RCxJQUEwRUUsTUFBM0Y7RUFFQTs7RUFDQSxJQUFJQyxlQUFhLEdBQUdGLFlBQVUsSUFBSUEsWUFBVSxDQUFDRixPQUFYLEtBQXVCRCxhQUF6RDtFQUVBOztFQUNBLElBQUlNLFFBQU0sR0FBR0QsZUFBYSxHQUFHeEgsSUFBSSxDQUFDeUgsTUFBUixHQUFpQnhLLFNBQTNDO0VBRUE7O0VBQ0EsSUFBSXlLLGNBQWMsR0FBR0QsUUFBTSxHQUFHQSxRQUFNLENBQUNFLFFBQVYsR0FBcUIxSyxTQUFoRDtFQUVBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0VBQ0EsSUFBSTBLLFFBQVEsR0FBR0QsY0FBYyxJQUFJUixTQUFqQzs7RUMvQkE7O0VBQ0EsSUFBSUosT0FBTyxHQUFHLG9CQUFkO0VBQUEsSUFDSWMsUUFBUSxHQUFHLGdCQURmO0VBQUEsSUFFSUMsT0FBTyxHQUFHLGtCQUZkO0VBQUEsSUFHSUMsT0FBTyxHQUFHLGVBSGQ7RUFBQSxJQUlJQyxRQUFRLEdBQUcsZ0JBSmY7RUFBQSxJQUtJdkcsT0FBTyxHQUFHLG1CQUxkO0VBQUEsSUFNSXdHLE1BQU0sR0FBRyxjQU5iO0VBQUEsSUFPSUMsU0FBUyxHQUFHLGlCQVBoQjtFQUFBLElBUUlDLFdBQVMsR0FBRyxpQkFSaEI7RUFBQSxJQVNJQyxTQUFTLEdBQUcsaUJBVGhCO0VBQUEsSUFVSUMsTUFBTSxHQUFHLGNBVmI7RUFBQSxJQVdJQyxTQUFTLEdBQUcsaUJBWGhCO0VBQUEsSUFZSUMsVUFBVSxHQUFHLGtCQVpqQjtFQWNBLElBQUlDLGNBQWMsR0FBRyxzQkFBckI7RUFBQSxJQUNJQyxXQUFXLEdBQUcsbUJBRGxCO0VBQUEsSUFFSUMsVUFBVSxHQUFHLHVCQUZqQjtFQUFBLElBR0lDLFVBQVUsR0FBRyx1QkFIakI7RUFBQSxJQUlJQyxPQUFPLEdBQUcsb0JBSmQ7RUFBQSxJQUtJQyxRQUFRLEdBQUcscUJBTGY7RUFBQSxJQU1JQyxRQUFRLEdBQUcscUJBTmY7RUFBQSxJQU9JQyxRQUFRLEdBQUcscUJBUGY7RUFBQSxJQVFJQyxlQUFlLEdBQUcsNEJBUnRCO0VBQUEsSUFTSUMsU0FBUyxHQUFHLHNCQVRoQjtFQUFBLElBVUlDLFNBQVMsR0FBRyxzQkFWaEI7RUFZQTs7RUFDQSxJQUFJQyxjQUFjLEdBQUcsRUFBckI7RUFDQUEsY0FBYyxDQUFDVCxVQUFELENBQWQsR0FBNkJTLGNBQWMsQ0FBQ1IsVUFBRCxDQUFkLEdBQzdCUSxjQUFjLENBQUNQLE9BQUQsQ0FBZCxHQUEwQk8sY0FBYyxDQUFDTixRQUFELENBQWQsR0FDMUJNLGNBQWMsQ0FBQ0wsUUFBRCxDQUFkLEdBQTJCSyxjQUFjLENBQUNKLFFBQUQsQ0FBZCxHQUMzQkksY0FBYyxDQUFDSCxlQUFELENBQWQsR0FBa0NHLGNBQWMsQ0FBQ0YsU0FBRCxDQUFkLEdBQ2xDRSxjQUFjLENBQUNELFNBQUQsQ0FBZCxHQUE0QixJQUo1QjtFQUtBQyxjQUFjLENBQUNwQyxPQUFELENBQWQsR0FBMEJvQyxjQUFjLENBQUN0QixRQUFELENBQWQsR0FDMUJzQixjQUFjLENBQUNYLGNBQUQsQ0FBZCxHQUFpQ1csY0FBYyxDQUFDckIsT0FBRCxDQUFkLEdBQ2pDcUIsY0FBYyxDQUFDVixXQUFELENBQWQsR0FBOEJVLGNBQWMsQ0FBQ3BCLE9BQUQsQ0FBZCxHQUM5Qm9CLGNBQWMsQ0FBQ25CLFFBQUQsQ0FBZCxHQUEyQm1CLGNBQWMsQ0FBQzFILE9BQUQsQ0FBZCxHQUMzQjBILGNBQWMsQ0FBQ2xCLE1BQUQsQ0FBZCxHQUF5QmtCLGNBQWMsQ0FBQ2pCLFNBQUQsQ0FBZCxHQUN6QmlCLGNBQWMsQ0FBQ2hCLFdBQUQsQ0FBZCxHQUE0QmdCLGNBQWMsQ0FBQ2YsU0FBRCxDQUFkLEdBQzVCZSxjQUFjLENBQUNkLE1BQUQsQ0FBZCxHQUF5QmMsY0FBYyxDQUFDYixTQUFELENBQWQsR0FDekJhLGNBQWMsQ0FBQ1osVUFBRCxDQUFkLEdBQTZCLEtBUDdCO0VBU0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0VBQ0EsU0FBU2EsZ0JBQVQsQ0FBMEIxSSxLQUExQixFQUFpQztFQUMvQixTQUFPVSxZQUFZLENBQUNWLEtBQUQsQ0FBWixJQUNMeUYsUUFBUSxDQUFDekYsS0FBSyxDQUFDOEMsTUFBUCxDQURILElBQ3FCLENBQUMsQ0FBQzJGLGNBQWMsQ0FBQ2hJLFVBQVUsQ0FBQ1QsS0FBRCxDQUFYLENBRDVDO0VBRUQ7O0VDekREO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsU0FBUzJJLFNBQVQsQ0FBbUJqSCxJQUFuQixFQUF5QjtFQUN2QixTQUFPLFVBQVMxQixLQUFULEVBQWdCO0VBQ3JCLFdBQU8wQixJQUFJLENBQUMxQixLQUFELENBQVg7RUFDRCxHQUZEO0VBR0Q7O0VDVEQ7O0VBQ0EsSUFBSTBHLGFBQVcsR0FBRyxRQUFPQyxPQUFQLHlDQUFPQSxPQUFQLE1BQWtCLFFBQWxCLElBQThCQSxPQUE5QixJQUF5QyxDQUFDQSxPQUFPLENBQUNDLFFBQWxELElBQThERCxPQUFoRjtFQUVBOztFQUNBLElBQUlFLFlBQVUsR0FBR0gsYUFBVyxJQUFJLFFBQU9JLE1BQVAseUNBQU9BLE1BQVAsTUFBaUIsUUFBaEMsSUFBNENBLE1BQTVDLElBQXNELENBQUNBLE1BQU0sQ0FBQ0YsUUFBOUQsSUFBMEVFLE1BQTNGO0VBRUE7O0VBQ0EsSUFBSUMsZUFBYSxHQUFHRixZQUFVLElBQUlBLFlBQVUsQ0FBQ0YsT0FBWCxLQUF1QkQsYUFBekQ7RUFFQTs7RUFDQSxJQUFJa0MsV0FBVyxHQUFHN0IsZUFBYSxJQUFJNUgsVUFBVSxDQUFDMEosT0FBOUM7RUFFQTs7RUFDQSxJQUFJQyxRQUFRLEdBQUksWUFBVztFQUN6QixNQUFJO0VBQ0Y7RUFDQSxRQUFJQyxLQUFLLEdBQUdsQyxZQUFVLElBQUlBLFlBQVUsQ0FBQ21DLE9BQXpCLElBQW9DbkMsWUFBVSxDQUFDbUMsT0FBWCxDQUFtQixNQUFuQixFQUEyQkQsS0FBM0U7O0VBRUEsUUFBSUEsS0FBSixFQUFXO0VBQ1QsYUFBT0EsS0FBUDtFQUNELEtBTkM7OztFQVNGLFdBQU9ILFdBQVcsSUFBSUEsV0FBVyxDQUFDSyxPQUEzQixJQUFzQ0wsV0FBVyxDQUFDSyxPQUFaLENBQW9CLE1BQXBCLENBQTdDO0VBQ0QsR0FWRCxDQVVFLE9BQU81TSxDQUFQLEVBQVU7RUFDYixDQVplLEVBQWhCOztFQ1hBOztFQUNBLElBQUk2TSxnQkFBZ0IsR0FBR0osUUFBUSxJQUFJQSxRQUFRLENBQUNLLFlBQTVDO0VBRUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7RUFDQSxJQUFJQSxZQUFZLEdBQUdELGdCQUFnQixHQUFHUCxTQUFTLENBQUNPLGdCQUFELENBQVosR0FBaUNSLGdCQUFwRTs7RUNqQkE7O0VBQ0EsSUFBSWhKLGFBQVcsR0FBR3RGLE1BQU0sQ0FBQ1AsU0FBekI7RUFFQTs7RUFDQSxJQUFJSSxnQkFBYyxHQUFHeUYsYUFBVyxDQUFDekYsY0FBakM7RUFFQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztFQUNBLFNBQVNtUCxhQUFULENBQXVCcEosS0FBdkIsRUFBOEJxSixTQUE5QixFQUF5QztFQUN2QyxNQUFJQyxLQUFLLEdBQUduTixPQUFPLENBQUM2RCxLQUFELENBQW5CO0VBQUEsTUFDSXVKLEtBQUssR0FBRyxDQUFDRCxLQUFELElBQVU5QyxXQUFXLENBQUN4RyxLQUFELENBRGpDO0VBQUEsTUFFSXdKLE1BQU0sR0FBRyxDQUFDRixLQUFELElBQVUsQ0FBQ0MsS0FBWCxJQUFvQnJDLFFBQVEsQ0FBQ2xILEtBQUQsQ0FGekM7RUFBQSxNQUdJeUosTUFBTSxHQUFHLENBQUNILEtBQUQsSUFBVSxDQUFDQyxLQUFYLElBQW9CLENBQUNDLE1BQXJCLElBQStCTCxZQUFZLENBQUNuSixLQUFELENBSHhEO0VBQUEsTUFJSTBKLFdBQVcsR0FBR0osS0FBSyxJQUFJQyxLQUFULElBQWtCQyxNQUFsQixJQUE0QkMsTUFKOUM7RUFBQSxNQUtJcEosTUFBTSxHQUFHcUosV0FBVyxHQUFHdkQsU0FBUyxDQUFDbkcsS0FBSyxDQUFDOEMsTUFBUCxFQUFlNkcsTUFBZixDQUFaLEdBQXFDLEVBTDdEO0VBQUEsTUFNSTdHLE1BQU0sR0FBR3pDLE1BQU0sQ0FBQ3lDLE1BTnBCOztFQVFBLE9BQUssSUFBSU4sR0FBVCxJQUFnQnhDLEtBQWhCLEVBQXVCO0VBQ3JCLFFBQUksQ0FBQ3FKLFNBQVMsSUFBSXBQLGdCQUFjLENBQUNpRyxJQUFmLENBQW9CRixLQUFwQixFQUEyQndDLEdBQTNCLENBQWQsS0FDQSxFQUFFa0gsV0FBVztFQUVWbEgsSUFBQUEsR0FBRyxJQUFJLFFBQVA7RUFFQ2dILElBQUFBLE1BQU0sS0FBS2hILEdBQUcsSUFBSSxRQUFQLElBQW1CQSxHQUFHLElBQUksUUFBL0IsQ0FGUDtFQUlDaUgsSUFBQUEsTUFBTSxLQUFLakgsR0FBRyxJQUFJLFFBQVAsSUFBbUJBLEdBQUcsSUFBSSxZQUExQixJQUEwQ0EsR0FBRyxJQUFJLFlBQXRELENBSlA7RUFNQStCLElBQUFBLE9BQU8sQ0FBQy9CLEdBQUQsRUFBTU0sTUFBTixDQVJHLENBQWIsQ0FESixFQVVRO0VBQ056QyxNQUFBQSxNQUFNLENBQUM1RCxJQUFQLENBQVkrRixHQUFaO0VBQ0Q7RUFDRjs7RUFDRCxTQUFPbkMsTUFBUDtFQUNEOztFQzlDRDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsU0FBU3VKLE9BQVQsQ0FBaUJsSSxJQUFqQixFQUF1QjRELFNBQXZCLEVBQWtDO0VBQ2hDLFNBQU8sVUFBU3VFLEdBQVQsRUFBYztFQUNuQixXQUFPbkksSUFBSSxDQUFDNEQsU0FBUyxDQUFDdUUsR0FBRCxDQUFWLENBQVg7RUFDRCxHQUZEO0VBR0Q7O0VDVkQ7O0VBQ0EsSUFBSUMsVUFBVSxHQUFHRixPQUFPLENBQUN4UCxNQUFNLENBQUNtSCxJQUFSLEVBQWNuSCxNQUFkLENBQXhCOztFQ0FBOztFQUNBLElBQUlzRixhQUFXLEdBQUd0RixNQUFNLENBQUNQLFNBQXpCO0VBRUE7O0VBQ0EsSUFBSUksZ0JBQWMsR0FBR3lGLGFBQVcsQ0FBQ3pGLGNBQWpDO0VBRUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0VBQ0EsU0FBUzhQLFFBQVQsQ0FBa0J4SCxNQUFsQixFQUEwQjtFQUN4QixNQUFJLENBQUN5RCxXQUFXLENBQUN6RCxNQUFELENBQWhCLEVBQTBCO0VBQ3hCLFdBQU91SCxVQUFVLENBQUN2SCxNQUFELENBQWpCO0VBQ0Q7O0VBQ0QsTUFBSWxDLE1BQU0sR0FBRyxFQUFiOztFQUNBLE9BQUssSUFBSW1DLEdBQVQsSUFBZ0JwSSxNQUFNLENBQUNtSSxNQUFELENBQXRCLEVBQWdDO0VBQzlCLFFBQUl0SSxnQkFBYyxDQUFDaUcsSUFBZixDQUFvQnFDLE1BQXBCLEVBQTRCQyxHQUE1QixLQUFvQ0EsR0FBRyxJQUFJLGFBQS9DLEVBQThEO0VBQzVEbkMsTUFBQUEsTUFBTSxDQUFDNUQsSUFBUCxDQUFZK0YsR0FBWjtFQUNEO0VBQ0Y7O0VBQ0QsU0FBT25DLE1BQVA7RUFDRDs7RUN2QkQ7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0VBQ0EsU0FBU2tCLElBQVQsQ0FBY2dCLE1BQWQsRUFBc0I7RUFDcEIsU0FBT21ELFdBQVcsQ0FBQ25ELE1BQUQsQ0FBWCxHQUFzQjZHLGFBQWEsQ0FBQzdHLE1BQUQsQ0FBbkMsR0FBOEN3SCxRQUFRLENBQUN4SCxNQUFELENBQTdEO0VBQ0Q7O0VDbENEO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLFNBQVN5SCxZQUFULENBQXNCekgsTUFBdEIsRUFBOEI7RUFDNUIsTUFBSWxDLE1BQU0sR0FBRyxFQUFiOztFQUNBLE1BQUlrQyxNQUFNLElBQUksSUFBZCxFQUFvQjtFQUNsQixTQUFLLElBQUlDLEdBQVQsSUFBZ0JwSSxNQUFNLENBQUNtSSxNQUFELENBQXRCLEVBQWdDO0VBQzlCbEMsTUFBQUEsTUFBTSxDQUFDNUQsSUFBUCxDQUFZK0YsR0FBWjtFQUNEO0VBQ0Y7O0VBQ0QsU0FBT25DLE1BQVA7RUFDRDs7RUNiRDs7RUFDQSxJQUFJWCxhQUFXLEdBQUd0RixNQUFNLENBQUNQLFNBQXpCO0VBRUE7O0VBQ0EsSUFBSUksZ0JBQWMsR0FBR3lGLGFBQVcsQ0FBQ3pGLGNBQWpDO0VBRUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0VBQ0EsU0FBU2dRLFVBQVQsQ0FBb0IxSCxNQUFwQixFQUE0QjtFQUMxQixNQUFJLENBQUM1QixRQUFRLENBQUM0QixNQUFELENBQWIsRUFBdUI7RUFDckIsV0FBT3lILFlBQVksQ0FBQ3pILE1BQUQsQ0FBbkI7RUFDRDs7RUFDRCxNQUFJMkgsT0FBTyxHQUFHbEUsV0FBVyxDQUFDekQsTUFBRCxDQUF6QjtFQUFBLE1BQ0lsQyxNQUFNLEdBQUcsRUFEYjs7RUFHQSxPQUFLLElBQUltQyxHQUFULElBQWdCRCxNQUFoQixFQUF3QjtFQUN0QixRQUFJLEVBQUVDLEdBQUcsSUFBSSxhQUFQLEtBQXlCMEgsT0FBTyxJQUFJLENBQUNqUSxnQkFBYyxDQUFDaUcsSUFBZixDQUFvQnFDLE1BQXBCLEVBQTRCQyxHQUE1QixDQUFyQyxDQUFGLENBQUosRUFBK0U7RUFDN0VuQyxNQUFBQSxNQUFNLENBQUM1RCxJQUFQLENBQVkrRixHQUFaO0VBQ0Q7RUFDRjs7RUFDRCxTQUFPbkMsTUFBUDtFQUNEOztFQzFCRDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztFQUNBLFNBQVM4SixNQUFULENBQWdCNUgsTUFBaEIsRUFBd0I7RUFDdEIsU0FBT21ELFdBQVcsQ0FBQ25ELE1BQUQsQ0FBWCxHQUFzQjZHLGFBQWEsQ0FBQzdHLE1BQUQsRUFBUyxJQUFULENBQW5DLEdBQW9EMEgsVUFBVSxDQUFDMUgsTUFBRCxDQUFyRTtFQUNEOztFQzNCRDs7RUFDQSxJQUFJNkgsWUFBWSxHQUFHM0gsU0FBUyxDQUFDckksTUFBRCxFQUFTLFFBQVQsQ0FBNUI7O0VDREE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0VBQ0EsU0FBU2lRLFNBQVQsR0FBcUI7RUFDbkIsT0FBS0MsUUFBTCxHQUFnQkYsWUFBWSxHQUFHQSxZQUFZLENBQUMsSUFBRCxDQUFmLEdBQXdCLEVBQXBEO0VBQ0EsT0FBS0csSUFBTCxHQUFZLENBQVo7RUFDRDs7RUNaRDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLFNBQVNDLFVBQVQsQ0FBb0JoSSxHQUFwQixFQUF5QjtFQUN2QixNQUFJbkMsTUFBTSxHQUFHLEtBQUtvSyxHQUFMLENBQVNqSSxHQUFULEtBQWlCLE9BQU8sS0FBSzhILFFBQUwsQ0FBYzlILEdBQWQsQ0FBckM7RUFDQSxPQUFLK0gsSUFBTCxJQUFhbEssTUFBTSxHQUFHLENBQUgsR0FBTyxDQUExQjtFQUNBLFNBQU9BLE1BQVA7RUFDRDs7RUNaRDs7RUFDQSxJQUFJcUssZ0JBQWMsR0FBRywyQkFBckI7RUFFQTs7RUFDQSxJQUFJaEwsYUFBVyxHQUFHdEYsTUFBTSxDQUFDUCxTQUF6QjtFQUVBOztFQUNBLElBQUlJLGdCQUFjLEdBQUd5RixhQUFXLENBQUN6RixjQUFqQztFQUVBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7RUFDQSxTQUFTMFEsT0FBVCxDQUFpQm5JLEdBQWpCLEVBQXNCO0VBQ3BCLE1BQUlvSSxJQUFJLEdBQUcsS0FBS04sUUFBaEI7O0VBQ0EsTUFBSUYsWUFBSixFQUFrQjtFQUNoQixRQUFJL0osTUFBTSxHQUFHdUssSUFBSSxDQUFDcEksR0FBRCxDQUFqQjtFQUNBLFdBQU9uQyxNQUFNLEtBQUtxSyxnQkFBWCxHQUE0QmxPLFNBQTVCLEdBQXdDNkQsTUFBL0M7RUFDRDs7RUFDRCxTQUFPcEcsZ0JBQWMsQ0FBQ2lHLElBQWYsQ0FBb0IwSyxJQUFwQixFQUEwQnBJLEdBQTFCLElBQWlDb0ksSUFBSSxDQUFDcEksR0FBRCxDQUFyQyxHQUE2Q2hHLFNBQXBEO0VBQ0Q7O0VDekJEOztFQUNBLElBQUlrRCxhQUFXLEdBQUd0RixNQUFNLENBQUNQLFNBQXpCO0VBRUE7O0VBQ0EsSUFBSUksZ0JBQWMsR0FBR3lGLGFBQVcsQ0FBQ3pGLGNBQWpDO0VBRUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztFQUNBLFNBQVM0USxPQUFULENBQWlCckksR0FBakIsRUFBc0I7RUFDcEIsTUFBSW9JLElBQUksR0FBRyxLQUFLTixRQUFoQjtFQUNBLFNBQU9GLFlBQVksR0FBSVEsSUFBSSxDQUFDcEksR0FBRCxDQUFKLEtBQWNoRyxTQUFsQixHQUErQnZDLGdCQUFjLENBQUNpRyxJQUFmLENBQW9CMEssSUFBcEIsRUFBMEJwSSxHQUExQixDQUFsRDtFQUNEOztFQ2xCRDs7RUFDQSxJQUFJa0ksY0FBYyxHQUFHLDJCQUFyQjtFQUVBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztFQUNBLFNBQVNJLE9BQVQsQ0FBaUJ0SSxHQUFqQixFQUFzQnhDLEtBQXRCLEVBQTZCO0VBQzNCLE1BQUk0SyxJQUFJLEdBQUcsS0FBS04sUUFBaEI7RUFDQSxPQUFLQyxJQUFMLElBQWEsS0FBS0UsR0FBTCxDQUFTakksR0FBVCxJQUFnQixDQUFoQixHQUFvQixDQUFqQztFQUNBb0ksRUFBQUEsSUFBSSxDQUFDcEksR0FBRCxDQUFKLEdBQWE0SCxZQUFZLElBQUlwSyxLQUFLLEtBQUt4RCxTQUEzQixHQUF3Q2tPLGNBQXhDLEdBQXlEMUssS0FBckU7RUFDQSxTQUFPLElBQVA7RUFDRDs7RUNkRDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7RUFDQSxTQUFTK0ssSUFBVCxDQUFjQyxPQUFkLEVBQXVCO0VBQ3JCLE1BQUk5SCxLQUFLLEdBQUcsQ0FBQyxDQUFiO0VBQUEsTUFDSUosTUFBTSxHQUFHa0ksT0FBTyxJQUFJLElBQVgsR0FBa0IsQ0FBbEIsR0FBc0JBLE9BQU8sQ0FBQ2xJLE1BRDNDO0VBR0EsT0FBS21JLEtBQUw7O0VBQ0EsU0FBTyxFQUFFL0gsS0FBRixHQUFVSixNQUFqQixFQUF5QjtFQUN2QixRQUFJb0ksS0FBSyxHQUFHRixPQUFPLENBQUM5SCxLQUFELENBQW5CO0VBQ0EsU0FBS25JLEdBQUwsQ0FBU21RLEtBQUssQ0FBQyxDQUFELENBQWQsRUFBbUJBLEtBQUssQ0FBQyxDQUFELENBQXhCO0VBQ0Q7RUFDRjs7O0VBR0RILElBQUksQ0FBQ2xSLFNBQUwsQ0FBZW9SLEtBQWYsR0FBdUJaLFNBQXZCO0VBQ0FVLElBQUksQ0FBQ2xSLFNBQUwsQ0FBZSxRQUFmLElBQTJCMlEsVUFBM0I7RUFDQU8sSUFBSSxDQUFDbFIsU0FBTCxDQUFlaUIsR0FBZixHQUFxQjZQLE9BQXJCO0VBQ0FJLElBQUksQ0FBQ2xSLFNBQUwsQ0FBZTRRLEdBQWYsR0FBcUJJLE9BQXJCO0VBQ0FFLElBQUksQ0FBQ2xSLFNBQUwsQ0FBZWtCLEdBQWYsR0FBcUIrUCxPQUFyQjs7RUM3QkE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxTQUFTSyxjQUFULEdBQTBCO0VBQ3hCLE9BQUtiLFFBQUwsR0FBZ0IsRUFBaEI7RUFDQSxPQUFLQyxJQUFMLEdBQVksQ0FBWjtFQUNEOztFQ1JEO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0VBQ0EsU0FBU2EsWUFBVCxDQUFzQm5JLEtBQXRCLEVBQTZCVCxHQUE3QixFQUFrQztFQUNoQyxNQUFJTSxNQUFNLEdBQUdHLEtBQUssQ0FBQ0gsTUFBbkI7O0VBQ0EsU0FBT0EsTUFBTSxFQUFiLEVBQWlCO0VBQ2YsUUFBSTJCLEVBQUUsQ0FBQ3hCLEtBQUssQ0FBQ0gsTUFBRCxDQUFMLENBQWMsQ0FBZCxDQUFELEVBQW1CTixHQUFuQixDQUFOLEVBQStCO0VBQzdCLGFBQU9NLE1BQVA7RUFDRDtFQUNGOztFQUNELFNBQU8sQ0FBQyxDQUFSO0VBQ0Q7O0VDaEJEOztFQUNBLElBQUl1SSxVQUFVLEdBQUcxUCxLQUFLLENBQUM5QixTQUF2QjtFQUVBOztFQUNBLElBQUl5UixNQUFNLEdBQUdELFVBQVUsQ0FBQ0MsTUFBeEI7RUFFQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0VBQ0EsU0FBU0MsZUFBVCxDQUF5Qi9JLEdBQXpCLEVBQThCO0VBQzVCLE1BQUlvSSxJQUFJLEdBQUcsS0FBS04sUUFBaEI7RUFBQSxNQUNJcEgsS0FBSyxHQUFHa0ksWUFBWSxDQUFDUixJQUFELEVBQU9wSSxHQUFQLENBRHhCOztFQUdBLE1BQUlVLEtBQUssR0FBRyxDQUFaLEVBQWU7RUFDYixXQUFPLEtBQVA7RUFDRDs7RUFDRCxNQUFJc0ksU0FBUyxHQUFHWixJQUFJLENBQUM5SCxNQUFMLEdBQWMsQ0FBOUI7O0VBQ0EsTUFBSUksS0FBSyxJQUFJc0ksU0FBYixFQUF3QjtFQUN0QlosSUFBQUEsSUFBSSxDQUFDYSxHQUFMO0VBQ0QsR0FGRCxNQUVPO0VBQ0xILElBQUFBLE1BQU0sQ0FBQ3BMLElBQVAsQ0FBWTBLLElBQVosRUFBa0IxSCxLQUFsQixFQUF5QixDQUF6QjtFQUNEOztFQUNELElBQUUsS0FBS3FILElBQVA7RUFDQSxTQUFPLElBQVA7RUFDRDs7RUM5QkQ7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztFQUNBLFNBQVNtQixZQUFULENBQXNCbEosR0FBdEIsRUFBMkI7RUFDekIsTUFBSW9JLElBQUksR0FBRyxLQUFLTixRQUFoQjtFQUFBLE1BQ0lwSCxLQUFLLEdBQUdrSSxZQUFZLENBQUNSLElBQUQsRUFBT3BJLEdBQVAsQ0FEeEI7RUFHQSxTQUFPVSxLQUFLLEdBQUcsQ0FBUixHQUFZMUcsU0FBWixHQUF3Qm9PLElBQUksQ0FBQzFILEtBQUQsQ0FBSixDQUFZLENBQVosQ0FBL0I7RUFDRDs7RUNkRDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0VBQ0EsU0FBU3lJLFlBQVQsQ0FBc0JuSixHQUF0QixFQUEyQjtFQUN6QixTQUFPNEksWUFBWSxDQUFDLEtBQUtkLFFBQU4sRUFBZ0I5SCxHQUFoQixDQUFaLEdBQW1DLENBQUMsQ0FBM0M7RUFDRDs7RUNYRDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7RUFDQSxTQUFTb0osWUFBVCxDQUFzQnBKLEdBQXRCLEVBQTJCeEMsS0FBM0IsRUFBa0M7RUFDaEMsTUFBSTRLLElBQUksR0FBRyxLQUFLTixRQUFoQjtFQUFBLE1BQ0lwSCxLQUFLLEdBQUdrSSxZQUFZLENBQUNSLElBQUQsRUFBT3BJLEdBQVAsQ0FEeEI7O0VBR0EsTUFBSVUsS0FBSyxHQUFHLENBQVosRUFBZTtFQUNiLE1BQUUsS0FBS3FILElBQVA7RUFDQUssSUFBQUEsSUFBSSxDQUFDbk8sSUFBTCxDQUFVLENBQUMrRixHQUFELEVBQU14QyxLQUFOLENBQVY7RUFDRCxHQUhELE1BR087RUFDTDRLLElBQUFBLElBQUksQ0FBQzFILEtBQUQsQ0FBSixDQUFZLENBQVosSUFBaUJsRCxLQUFqQjtFQUNEOztFQUNELFNBQU8sSUFBUDtFQUNEOztFQ2pCRDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7RUFDQSxTQUFTNkwsU0FBVCxDQUFtQmIsT0FBbkIsRUFBNEI7RUFDMUIsTUFBSTlILEtBQUssR0FBRyxDQUFDLENBQWI7RUFBQSxNQUNJSixNQUFNLEdBQUdrSSxPQUFPLElBQUksSUFBWCxHQUFrQixDQUFsQixHQUFzQkEsT0FBTyxDQUFDbEksTUFEM0M7RUFHQSxPQUFLbUksS0FBTDs7RUFDQSxTQUFPLEVBQUUvSCxLQUFGLEdBQVVKLE1BQWpCLEVBQXlCO0VBQ3ZCLFFBQUlvSSxLQUFLLEdBQUdGLE9BQU8sQ0FBQzlILEtBQUQsQ0FBbkI7RUFDQSxTQUFLbkksR0FBTCxDQUFTbVEsS0FBSyxDQUFDLENBQUQsQ0FBZCxFQUFtQkEsS0FBSyxDQUFDLENBQUQsQ0FBeEI7RUFDRDtFQUNGOzs7RUFHRFcsU0FBUyxDQUFDaFMsU0FBVixDQUFvQm9SLEtBQXBCLEdBQTRCRSxjQUE1QjtFQUNBVSxTQUFTLENBQUNoUyxTQUFWLENBQW9CLFFBQXBCLElBQWdDMFIsZUFBaEM7RUFDQU0sU0FBUyxDQUFDaFMsU0FBVixDQUFvQmlCLEdBQXBCLEdBQTBCNFEsWUFBMUI7RUFDQUcsU0FBUyxDQUFDaFMsU0FBVixDQUFvQjRRLEdBQXBCLEdBQTBCa0IsWUFBMUI7RUFDQUUsU0FBUyxDQUFDaFMsU0FBVixDQUFvQmtCLEdBQXBCLEdBQTBCNlEsWUFBMUI7O0VDMUJBOztFQUNBLElBQUkvUSxLQUFHLEdBQUc0SCxTQUFTLENBQUNsRCxJQUFELEVBQU8sS0FBUCxDQUFuQjs7RUNBQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7RUFDQSxTQUFTdU0sYUFBVCxHQUF5QjtFQUN2QixPQUFLdkIsSUFBTCxHQUFZLENBQVo7RUFDQSxPQUFLRCxRQUFMLEdBQWdCO0VBQ2QsWUFBUSxJQUFJUyxJQUFKLEVBRE07RUFFZCxXQUFPLEtBQUtsUSxLQUFHLElBQUlnUixTQUFaLEdBRk87RUFHZCxjQUFVLElBQUlkLElBQUo7RUFISSxHQUFoQjtFQUtEOztFQ2xCRDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLFNBQVNnQixTQUFULENBQW1CL0wsS0FBbkIsRUFBMEI7RUFDeEIsTUFBSVksSUFBSSxXQUFVWixLQUFWLENBQVI7O0VBQ0EsU0FBUVksSUFBSSxJQUFJLFFBQVIsSUFBb0JBLElBQUksSUFBSSxRQUE1QixJQUF3Q0EsSUFBSSxJQUFJLFFBQWhELElBQTREQSxJQUFJLElBQUksU0FBckUsR0FDRlosS0FBSyxLQUFLLFdBRFIsR0FFRkEsS0FBSyxLQUFLLElBRmY7RUFHRDs7RUNWRDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztFQUNBLFNBQVNnTSxVQUFULENBQW9CQyxHQUFwQixFQUF5QnpKLEdBQXpCLEVBQThCO0VBQzVCLE1BQUlvSSxJQUFJLEdBQUdxQixHQUFHLENBQUMzQixRQUFmO0VBQ0EsU0FBT3lCLFNBQVMsQ0FBQ3ZKLEdBQUQsQ0FBVCxHQUNIb0ksSUFBSSxDQUFDLE9BQU9wSSxHQUFQLElBQWMsUUFBZCxHQUF5QixRQUF6QixHQUFvQyxNQUFyQyxDQURELEdBRUhvSSxJQUFJLENBQUNxQixHQUZUO0VBR0Q7O0VDYkQ7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztFQUNBLFNBQVNDLGNBQVQsQ0FBd0IxSixHQUF4QixFQUE2QjtFQUMzQixNQUFJbkMsTUFBTSxHQUFHMkwsVUFBVSxDQUFDLElBQUQsRUFBT3hKLEdBQVAsQ0FBVixDQUFzQixRQUF0QixFQUFnQ0EsR0FBaEMsQ0FBYjtFQUNBLE9BQUsrSCxJQUFMLElBQWFsSyxNQUFNLEdBQUcsQ0FBSCxHQUFPLENBQTFCO0VBQ0EsU0FBT0EsTUFBUDtFQUNEOztFQ2JEO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7RUFDQSxTQUFTOEwsV0FBVCxDQUFxQjNKLEdBQXJCLEVBQTBCO0VBQ3hCLFNBQU93SixVQUFVLENBQUMsSUFBRCxFQUFPeEosR0FBUCxDQUFWLENBQXNCMUgsR0FBdEIsQ0FBMEIwSCxHQUExQixDQUFQO0VBQ0Q7O0VDWEQ7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztFQUNBLFNBQVM0SixXQUFULENBQXFCNUosR0FBckIsRUFBMEI7RUFDeEIsU0FBT3dKLFVBQVUsQ0FBQyxJQUFELEVBQU94SixHQUFQLENBQVYsQ0FBc0JpSSxHQUF0QixDQUEwQmpJLEdBQTFCLENBQVA7RUFDRDs7RUNYRDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7RUFDQSxTQUFTNkosV0FBVCxDQUFxQjdKLEdBQXJCLEVBQTBCeEMsS0FBMUIsRUFBaUM7RUFDL0IsTUFBSTRLLElBQUksR0FBR29CLFVBQVUsQ0FBQyxJQUFELEVBQU94SixHQUFQLENBQXJCO0VBQUEsTUFDSStILElBQUksR0FBR0ssSUFBSSxDQUFDTCxJQURoQjtFQUdBSyxFQUFBQSxJQUFJLENBQUM3UCxHQUFMLENBQVN5SCxHQUFULEVBQWN4QyxLQUFkO0VBQ0EsT0FBS3VLLElBQUwsSUFBYUssSUFBSSxDQUFDTCxJQUFMLElBQWFBLElBQWIsR0FBb0IsQ0FBcEIsR0FBd0IsQ0FBckM7RUFDQSxTQUFPLElBQVA7RUFDRDs7RUNiRDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7RUFDQSxTQUFTK0IsUUFBVCxDQUFrQnRCLE9BQWxCLEVBQTJCO0VBQ3pCLE1BQUk5SCxLQUFLLEdBQUcsQ0FBQyxDQUFiO0VBQUEsTUFDSUosTUFBTSxHQUFHa0ksT0FBTyxJQUFJLElBQVgsR0FBa0IsQ0FBbEIsR0FBc0JBLE9BQU8sQ0FBQ2xJLE1BRDNDO0VBR0EsT0FBS21JLEtBQUw7O0VBQ0EsU0FBTyxFQUFFL0gsS0FBRixHQUFVSixNQUFqQixFQUF5QjtFQUN2QixRQUFJb0ksS0FBSyxHQUFHRixPQUFPLENBQUM5SCxLQUFELENBQW5CO0VBQ0EsU0FBS25JLEdBQUwsQ0FBU21RLEtBQUssQ0FBQyxDQUFELENBQWQsRUFBbUJBLEtBQUssQ0FBQyxDQUFELENBQXhCO0VBQ0Q7RUFDRjs7O0VBR0RvQixRQUFRLENBQUN6UyxTQUFULENBQW1Cb1IsS0FBbkIsR0FBMkJhLGFBQTNCO0VBQ0FRLFFBQVEsQ0FBQ3pTLFNBQVQsQ0FBbUIsUUFBbkIsSUFBK0JxUyxjQUEvQjtFQUNBSSxRQUFRLENBQUN6UyxTQUFULENBQW1CaUIsR0FBbkIsR0FBeUJxUixXQUF6QjtFQUNBRyxRQUFRLENBQUN6UyxTQUFULENBQW1CNFEsR0FBbkIsR0FBeUIyQixXQUF6QjtFQUNBRSxRQUFRLENBQUN6UyxTQUFULENBQW1Ca0IsR0FBbkIsR0FBeUJzUixXQUF6Qjs7RUMzQkE7O0VBQ0EsSUFBSUUsWUFBWSxHQUFHM0MsT0FBTyxDQUFDeFAsTUFBTSxDQUFDQyxjQUFSLEVBQXdCRCxNQUF4QixDQUExQjs7RUNDQTs7RUFDQSxJQUFJcU4sU0FBUyxHQUFHLGlCQUFoQjtFQUVBOztFQUNBLElBQUk5RixTQUFTLEdBQUduQyxRQUFRLENBQUMzRixTQUF6QjtFQUFBLElBQ0k2RixXQUFXLEdBQUd0RixNQUFNLENBQUNQLFNBRHpCO0VBR0E7O0VBQ0EsSUFBSStILFlBQVksR0FBR0QsU0FBUyxDQUFDL0IsUUFBN0I7RUFFQTs7RUFDQSxJQUFJM0YsY0FBYyxHQUFHeUYsV0FBVyxDQUFDekYsY0FBakM7RUFFQTs7RUFDQSxJQUFJdVMsZ0JBQWdCLEdBQUc1SyxZQUFZLENBQUMxQixJQUFiLENBQWtCOUYsTUFBbEIsQ0FBdkI7RUFFQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7RUFDQSxTQUFTcVMsYUFBVCxDQUF1QnpNLEtBQXZCLEVBQThCO0VBQzVCLE1BQUksQ0FBQ1UsWUFBWSxDQUFDVixLQUFELENBQWIsSUFBd0JTLFVBQVUsQ0FBQ1QsS0FBRCxDQUFWLElBQXFCeUgsU0FBakQsRUFBNEQ7RUFDMUQsV0FBTyxLQUFQO0VBQ0Q7O0VBQ0QsTUFBSXpOLEtBQUssR0FBR3VTLFlBQVksQ0FBQ3ZNLEtBQUQsQ0FBeEI7O0VBQ0EsTUFBSWhHLEtBQUssS0FBSyxJQUFkLEVBQW9CO0VBQ2xCLFdBQU8sSUFBUDtFQUNEOztFQUNELE1BQUlpTSxJQUFJLEdBQUdoTSxjQUFjLENBQUNpRyxJQUFmLENBQW9CbEcsS0FBcEIsRUFBMkIsYUFBM0IsS0FBNkNBLEtBQUssQ0FBQ2tNLFdBQTlEO0VBQ0EsU0FBTyxPQUFPRCxJQUFQLElBQWUsVUFBZixJQUE2QkEsSUFBSSxZQUFZQSxJQUE3QyxJQUNMckUsWUFBWSxDQUFDMUIsSUFBYixDQUFrQitGLElBQWxCLEtBQTJCdUcsZ0JBRDdCO0VBRUQ7O0VDekREO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztFQUNBLFNBQVNFLFVBQVQsR0FBc0I7RUFDcEIsT0FBS3BDLFFBQUwsR0FBZ0IsSUFBSXVCLFNBQUosRUFBaEI7RUFDQSxPQUFLdEIsSUFBTCxHQUFZLENBQVo7RUFDRDs7RUNaRDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxTQUFTb0MsV0FBVCxDQUFxQm5LLEdBQXJCLEVBQTBCO0VBQ3hCLE1BQUlvSSxJQUFJLEdBQUcsS0FBS04sUUFBaEI7RUFBQSxNQUNJakssTUFBTSxHQUFHdUssSUFBSSxDQUFDLFFBQUQsQ0FBSixDQUFlcEksR0FBZixDQURiO0VBR0EsT0FBSytILElBQUwsR0FBWUssSUFBSSxDQUFDTCxJQUFqQjtFQUNBLFNBQU9sSyxNQUFQO0VBQ0Q7O0VDZkQ7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsU0FBU3VNLFFBQVQsQ0FBa0JwSyxHQUFsQixFQUF1QjtFQUNyQixTQUFPLEtBQUs4SCxRQUFMLENBQWN4UCxHQUFkLENBQWtCMEgsR0FBbEIsQ0FBUDtFQUNEOztFQ1hEO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLFNBQVNxSyxRQUFULENBQWtCckssR0FBbEIsRUFBdUI7RUFDckIsU0FBTyxLQUFLOEgsUUFBTCxDQUFjRyxHQUFkLENBQWtCakksR0FBbEIsQ0FBUDtFQUNEOztFQ1BEOztFQUNBLElBQUlzSyxnQkFBZ0IsR0FBRyxHQUF2QjtFQUVBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztFQUNBLFNBQVNDLFFBQVQsQ0FBa0J2SyxHQUFsQixFQUF1QnhDLEtBQXZCLEVBQThCO0VBQzVCLE1BQUk0SyxJQUFJLEdBQUcsS0FBS04sUUFBaEI7O0VBQ0EsTUFBSU0sSUFBSSxZQUFZaUIsU0FBcEIsRUFBK0I7RUFDN0IsUUFBSW1CLEtBQUssR0FBR3BDLElBQUksQ0FBQ04sUUFBakI7O0VBQ0EsUUFBSSxDQUFDelAsS0FBRCxJQUFTbVMsS0FBSyxDQUFDbEssTUFBTixHQUFlZ0ssZ0JBQWdCLEdBQUcsQ0FBL0MsRUFBbUQ7RUFDakRFLE1BQUFBLEtBQUssQ0FBQ3ZRLElBQU4sQ0FBVyxDQUFDK0YsR0FBRCxFQUFNeEMsS0FBTixDQUFYO0VBQ0EsV0FBS3VLLElBQUwsR0FBWSxFQUFFSyxJQUFJLENBQUNMLElBQW5CO0VBQ0EsYUFBTyxJQUFQO0VBQ0Q7O0VBQ0RLLElBQUFBLElBQUksR0FBRyxLQUFLTixRQUFMLEdBQWdCLElBQUlnQyxRQUFKLENBQWFVLEtBQWIsQ0FBdkI7RUFDRDs7RUFDRHBDLEVBQUFBLElBQUksQ0FBQzdQLEdBQUwsQ0FBU3lILEdBQVQsRUFBY3hDLEtBQWQ7RUFDQSxPQUFLdUssSUFBTCxHQUFZSyxJQUFJLENBQUNMLElBQWpCO0VBQ0EsU0FBTyxJQUFQO0VBQ0Q7O0VDeEJEO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztFQUNBLFNBQVMwQyxLQUFULENBQWVqQyxPQUFmLEVBQXdCO0VBQ3RCLE1BQUlKLElBQUksR0FBRyxLQUFLTixRQUFMLEdBQWdCLElBQUl1QixTQUFKLENBQWNiLE9BQWQsQ0FBM0I7RUFDQSxPQUFLVCxJQUFMLEdBQVlLLElBQUksQ0FBQ0wsSUFBakI7RUFDRDs7O0VBR0QwQyxLQUFLLENBQUNwVCxTQUFOLENBQWdCb1IsS0FBaEIsR0FBd0J5QixVQUF4QjtFQUNBTyxLQUFLLENBQUNwVCxTQUFOLENBQWdCLFFBQWhCLElBQTRCOFMsV0FBNUI7RUFDQU0sS0FBSyxDQUFDcFQsU0FBTixDQUFnQmlCLEdBQWhCLEdBQXNCOFIsUUFBdEI7RUFDQUssS0FBSyxDQUFDcFQsU0FBTixDQUFnQjRRLEdBQWhCLEdBQXNCb0MsUUFBdEI7RUFDQUksS0FBSyxDQUFDcFQsU0FBTixDQUFnQmtCLEdBQWhCLEdBQXNCZ1MsUUFBdEI7O0VDdEJBOztFQUNBLElBQUlyRyxXQUFXLEdBQUcsUUFBT0MsT0FBUCx5Q0FBT0EsT0FBUCxNQUFrQixRQUFsQixJQUE4QkEsT0FBOUIsSUFBeUMsQ0FBQ0EsT0FBTyxDQUFDQyxRQUFsRCxJQUE4REQsT0FBaEY7RUFFQTs7RUFDQSxJQUFJRSxVQUFVLEdBQUdILFdBQVcsSUFBSSxRQUFPSSxNQUFQLHlDQUFPQSxNQUFQLE1BQWlCLFFBQWhDLElBQTRDQSxNQUE1QyxJQUFzRCxDQUFDQSxNQUFNLENBQUNGLFFBQTlELElBQTBFRSxNQUEzRjtFQUVBOztFQUNBLElBQUlDLGFBQWEsR0FBR0YsVUFBVSxJQUFJQSxVQUFVLENBQUNGLE9BQVgsS0FBdUJELFdBQXpEO0VBRUE7O0VBQ0EsSUFBSU0sTUFBTSxHQUFHRCxhQUFhLEdBQUd4SCxJQUFJLENBQUN5SCxNQUFSLEdBQWlCeEssU0FBM0M7RUFBQSxJQUNJMFEsV0FBVyxHQUFHbEcsTUFBTSxHQUFHQSxNQUFNLENBQUNrRyxXQUFWLEdBQXdCMVEsU0FEaEQ7RUFHQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztFQUNBLFNBQVMyUSxXQUFULENBQXFCQyxNQUFyQixFQUE2QkMsTUFBN0IsRUFBcUM7RUFDbkMsTUFBSUEsTUFBSixFQUFZO0VBQ1YsV0FBT0QsTUFBTSxDQUFDRSxLQUFQLEVBQVA7RUFDRDs7RUFDRCxNQUFJeEssTUFBTSxHQUFHc0ssTUFBTSxDQUFDdEssTUFBcEI7RUFBQSxNQUNJekMsTUFBTSxHQUFHNk0sV0FBVyxHQUFHQSxXQUFXLENBQUNwSyxNQUFELENBQWQsR0FBeUIsSUFBSXNLLE1BQU0sQ0FBQ2xILFdBQVgsQ0FBdUJwRCxNQUF2QixDQURqRDtFQUdBc0ssRUFBQUEsTUFBTSxDQUFDRyxJQUFQLENBQVlsTixNQUFaO0VBQ0EsU0FBT0EsTUFBUDtFQUNEOztFQzlCRDs7RUFDQSxJQUFJbU4sVUFBVSxHQUFHak8sSUFBSSxDQUFDaU8sVUFBdEI7O0VDREE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0VBQ0EsU0FBU0MsZ0JBQVQsQ0FBMEJDLFdBQTFCLEVBQXVDO0VBQ3JDLE1BQUlyTixNQUFNLEdBQUcsSUFBSXFOLFdBQVcsQ0FBQ3hILFdBQWhCLENBQTRCd0gsV0FBVyxDQUFDQyxVQUF4QyxDQUFiO0VBQ0EsTUFBSUgsVUFBSixDQUFlbk4sTUFBZixFQUF1QnRGLEdBQXZCLENBQTJCLElBQUl5UyxVQUFKLENBQWVFLFdBQWYsQ0FBM0I7RUFDQSxTQUFPck4sTUFBUDtFQUNEOztFQ1hEO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0VBQ0EsU0FBU3VOLGVBQVQsQ0FBeUJDLFVBQXpCLEVBQXFDUixNQUFyQyxFQUE2QztFQUMzQyxNQUFJRCxNQUFNLEdBQUdDLE1BQU0sR0FBR0ksZ0JBQWdCLENBQUNJLFVBQVUsQ0FBQ1QsTUFBWixDQUFuQixHQUF5Q1MsVUFBVSxDQUFDVCxNQUF2RTtFQUNBLFNBQU8sSUFBSVMsVUFBVSxDQUFDM0gsV0FBZixDQUEyQmtILE1BQTNCLEVBQW1DUyxVQUFVLENBQUNDLFVBQTlDLEVBQTBERCxVQUFVLENBQUMvSyxNQUFyRSxDQUFQO0VBQ0Q7O0VDVEQ7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0VBQ0EsU0FBU2lMLGVBQVQsQ0FBeUJ4TCxNQUF6QixFQUFpQztFQUMvQixTQUFRLE9BQU9BLE1BQU0sQ0FBQzJELFdBQWQsSUFBNkIsVUFBN0IsSUFBMkMsQ0FBQ0YsV0FBVyxDQUFDekQsTUFBRCxDQUF4RCxHQUNISyxVQUFVLENBQUMySixZQUFZLENBQUNoSyxNQUFELENBQWIsQ0FEUCxHQUVILEVBRko7RUFHRDs7RUNmRDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLFNBQVN5TCxhQUFULENBQXVCQyxTQUF2QixFQUFrQztFQUNoQyxTQUFPLFVBQVMxTCxNQUFULEVBQWlCNkIsUUFBakIsRUFBMkI4SixRQUEzQixFQUFxQztFQUMxQyxRQUFJaEwsS0FBSyxHQUFHLENBQUMsQ0FBYjtFQUFBLFFBQ0lpTCxRQUFRLEdBQUcvVCxNQUFNLENBQUNtSSxNQUFELENBRHJCO0VBQUEsUUFFSXVDLEtBQUssR0FBR29KLFFBQVEsQ0FBQzNMLE1BQUQsQ0FGcEI7RUFBQSxRQUdJTyxNQUFNLEdBQUdnQyxLQUFLLENBQUNoQyxNQUhuQjs7RUFLQSxXQUFPQSxNQUFNLEVBQWIsRUFBaUI7RUFDZixVQUFJTixHQUFHLEdBQUdzQyxLQUFLLENBQUNtSixTQUFTLEdBQUduTCxNQUFILEdBQVksRUFBRUksS0FBeEIsQ0FBZjs7RUFDQSxVQUFJa0IsUUFBUSxDQUFDK0osUUFBUSxDQUFDM0wsR0FBRCxDQUFULEVBQWdCQSxHQUFoQixFQUFxQjJMLFFBQXJCLENBQVIsS0FBMkMsS0FBL0MsRUFBc0Q7RUFDcEQ7RUFDRDtFQUNGOztFQUNELFdBQU81TCxNQUFQO0VBQ0QsR0FiRDtFQWNEOztFQ3BCRDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztFQUNBLElBQUk2TCxPQUFPLEdBQUdKLGFBQWEsRUFBM0I7O0VDVkE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7RUFDQSxTQUFTSyxVQUFULENBQW9COUwsTUFBcEIsRUFBNEI2QixRQUE1QixFQUFzQztFQUNwQyxTQUFPN0IsTUFBTSxJQUFJNkwsT0FBTyxDQUFDN0wsTUFBRCxFQUFTNkIsUUFBVCxFQUFtQjdDLElBQW5CLENBQXhCO0VBQ0Q7O0VDWEQ7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7RUFDQSxTQUFTK00sY0FBVCxDQUF3QkMsUUFBeEIsRUFBa0NOLFNBQWxDLEVBQTZDO0VBQzNDLFNBQU8sVUFBU08sVUFBVCxFQUFxQnBLLFFBQXJCLEVBQStCO0VBQ3BDLFFBQUlvSyxVQUFVLElBQUksSUFBbEIsRUFBd0I7RUFDdEIsYUFBT0EsVUFBUDtFQUNEOztFQUNELFFBQUksQ0FBQzlJLFdBQVcsQ0FBQzhJLFVBQUQsQ0FBaEIsRUFBOEI7RUFDNUIsYUFBT0QsUUFBUSxDQUFDQyxVQUFELEVBQWFwSyxRQUFiLENBQWY7RUFDRDs7RUFDRCxRQUFJdEIsTUFBTSxHQUFHMEwsVUFBVSxDQUFDMUwsTUFBeEI7RUFBQSxRQUNJSSxLQUFLLEdBQUcrSyxTQUFTLEdBQUduTCxNQUFILEdBQVksQ0FBQyxDQURsQztFQUFBLFFBRUlxTCxRQUFRLEdBQUcvVCxNQUFNLENBQUNvVSxVQUFELENBRnJCOztFQUlBLFdBQVFQLFNBQVMsR0FBRy9LLEtBQUssRUFBUixHQUFhLEVBQUVBLEtBQUYsR0FBVUosTUFBeEMsRUFBaUQ7RUFDL0MsVUFBSXNCLFFBQVEsQ0FBQytKLFFBQVEsQ0FBQ2pMLEtBQUQsQ0FBVCxFQUFrQkEsS0FBbEIsRUFBeUJpTCxRQUF6QixDQUFSLEtBQStDLEtBQW5ELEVBQTBEO0VBQ3hEO0VBQ0Q7RUFDRjs7RUFDRCxXQUFPSyxVQUFQO0VBQ0QsR0FqQkQ7RUFrQkQ7O0VDMUJEO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0VBQ0EsSUFBSUMsUUFBUSxHQUFHSCxjQUFjLENBQUNELFVBQUQsQ0FBN0I7O0VDUkE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztFQUNBLFNBQVNLLGdCQUFULENBQTBCbk0sTUFBMUIsRUFBa0NDLEdBQWxDLEVBQXVDeEMsS0FBdkMsRUFBOEM7RUFDNUMsTUFBS0EsS0FBSyxLQUFLeEQsU0FBVixJQUF1QixDQUFDaUksRUFBRSxDQUFDbEMsTUFBTSxDQUFDQyxHQUFELENBQVAsRUFBY3hDLEtBQWQsQ0FBM0IsSUFDQ0EsS0FBSyxLQUFLeEQsU0FBVixJQUF1QixFQUFFZ0csR0FBRyxJQUFJRCxNQUFULENBRDVCLEVBQytDO0VBQzdDaUMsSUFBQUEsZUFBZSxDQUFDakMsTUFBRCxFQUFTQyxHQUFULEVBQWN4QyxLQUFkLENBQWY7RUFDRDtFQUNGOztFQ2REO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztFQUNBLFNBQVMyTyxpQkFBVCxDQUEyQjNPLEtBQTNCLEVBQWtDO0VBQ2hDLFNBQU9VLFlBQVksQ0FBQ1YsS0FBRCxDQUFaLElBQXVCMEYsV0FBVyxDQUFDMUYsS0FBRCxDQUF6QztFQUNEOztFQzlCRDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsU0FBUzRPLE9BQVQsQ0FBaUJyTSxNQUFqQixFQUF5QkMsR0FBekIsRUFBOEI7RUFDNUIsTUFBSUEsR0FBRyxLQUFLLGFBQVIsSUFBeUIsT0FBT0QsTUFBTSxDQUFDQyxHQUFELENBQWIsS0FBdUIsVUFBcEQsRUFBZ0U7RUFDOUQ7RUFDRDs7RUFFRCxNQUFJQSxHQUFHLElBQUksV0FBWCxFQUF3QjtFQUN0QjtFQUNEOztFQUVELFNBQU9ELE1BQU0sQ0FBQ0MsR0FBRCxDQUFiO0VBQ0Q7O0VDZkQ7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztFQUNBLFNBQVNxTSxhQUFULENBQXVCN08sS0FBdkIsRUFBOEI7RUFDNUIsU0FBTzZFLFVBQVUsQ0FBQzdFLEtBQUQsRUFBUW1LLE1BQU0sQ0FBQ25LLEtBQUQsQ0FBZCxDQUFqQjtFQUNEOztFQ2JEO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7RUFDQSxTQUFTOE8sYUFBVCxDQUF1QnZNLE1BQXZCLEVBQStCUyxNQUEvQixFQUF1Q1IsR0FBdkMsRUFBNEN1TSxRQUE1QyxFQUFzREMsU0FBdEQsRUFBaUVqSyxVQUFqRSxFQUE2RWtLLEtBQTdFLEVBQW9GO0VBQ2xGLE1BQUlySyxRQUFRLEdBQUdnSyxPQUFPLENBQUNyTSxNQUFELEVBQVNDLEdBQVQsQ0FBdEI7RUFBQSxNQUNJME0sUUFBUSxHQUFHTixPQUFPLENBQUM1TCxNQUFELEVBQVNSLEdBQVQsQ0FEdEI7RUFBQSxNQUVJMk0sT0FBTyxHQUFHRixLQUFLLENBQUNuVSxHQUFOLENBQVVvVSxRQUFWLENBRmQ7O0VBSUEsTUFBSUMsT0FBSixFQUFhO0VBQ1hULElBQUFBLGdCQUFnQixDQUFDbk0sTUFBRCxFQUFTQyxHQUFULEVBQWMyTSxPQUFkLENBQWhCO0VBQ0E7RUFDRDs7RUFDRCxNQUFJbEssUUFBUSxHQUFHRixVQUFVLEdBQ3JCQSxVQUFVLENBQUNILFFBQUQsRUFBV3NLLFFBQVgsRUFBc0IxTSxHQUFHLEdBQUcsRUFBNUIsRUFBaUNELE1BQWpDLEVBQXlDUyxNQUF6QyxFQUFpRGlNLEtBQWpELENBRFcsR0FFckJ6UyxTQUZKO0VBSUEsTUFBSTRTLFFBQVEsR0FBR25LLFFBQVEsS0FBS3pJLFNBQTVCOztFQUVBLE1BQUk0UyxRQUFKLEVBQWM7RUFDWixRQUFJOUYsS0FBSyxHQUFHbk4sT0FBTyxDQUFDK1MsUUFBRCxDQUFuQjtFQUFBLFFBQ0kxRixNQUFNLEdBQUcsQ0FBQ0YsS0FBRCxJQUFVcEMsUUFBUSxDQUFDZ0ksUUFBRCxDQUQvQjtFQUFBLFFBRUlHLE9BQU8sR0FBRyxDQUFDL0YsS0FBRCxJQUFVLENBQUNFLE1BQVgsSUFBcUJMLFlBQVksQ0FBQytGLFFBQUQsQ0FGL0M7RUFJQWpLLElBQUFBLFFBQVEsR0FBR2lLLFFBQVg7O0VBQ0EsUUFBSTVGLEtBQUssSUFBSUUsTUFBVCxJQUFtQjZGLE9BQXZCLEVBQWdDO0VBQzlCLFVBQUlsVCxPQUFPLENBQUN5SSxRQUFELENBQVgsRUFBdUI7RUFDckJLLFFBQUFBLFFBQVEsR0FBR0wsUUFBWDtFQUNELE9BRkQsTUFHSyxJQUFJK0osaUJBQWlCLENBQUMvSixRQUFELENBQXJCLEVBQWlDO0VBQ3BDSyxRQUFBQSxRQUFRLEdBQUdsQyxTQUFTLENBQUM2QixRQUFELENBQXBCO0VBQ0QsT0FGSSxNQUdBLElBQUk0RSxNQUFKLEVBQVk7RUFDZjRGLFFBQUFBLFFBQVEsR0FBRyxLQUFYO0VBQ0FuSyxRQUFBQSxRQUFRLEdBQUdrSSxXQUFXLENBQUMrQixRQUFELEVBQVcsSUFBWCxDQUF0QjtFQUNELE9BSEksTUFJQSxJQUFJRyxPQUFKLEVBQWE7RUFDaEJELFFBQUFBLFFBQVEsR0FBRyxLQUFYO0VBQ0FuSyxRQUFBQSxRQUFRLEdBQUcySSxlQUFlLENBQUNzQixRQUFELEVBQVcsSUFBWCxDQUExQjtFQUNELE9BSEksTUFJQTtFQUNIakssUUFBQUEsUUFBUSxHQUFHLEVBQVg7RUFDRDtFQUNGLEtBbEJELE1BbUJLLElBQUl3SCxhQUFhLENBQUN5QyxRQUFELENBQWIsSUFBMkIxSSxXQUFXLENBQUMwSSxRQUFELENBQTFDLEVBQXNEO0VBQ3pEakssTUFBQUEsUUFBUSxHQUFHTCxRQUFYOztFQUNBLFVBQUk0QixXQUFXLENBQUM1QixRQUFELENBQWYsRUFBMkI7RUFDekJLLFFBQUFBLFFBQVEsR0FBRzRKLGFBQWEsQ0FBQ2pLLFFBQUQsQ0FBeEI7RUFDRCxPQUZELE1BR0ssSUFBSSxDQUFDakUsUUFBUSxDQUFDaUUsUUFBRCxDQUFULElBQXVCMUQsVUFBVSxDQUFDMEQsUUFBRCxDQUFyQyxFQUFpRDtFQUNwREssUUFBQUEsUUFBUSxHQUFHOEksZUFBZSxDQUFDbUIsUUFBRCxDQUExQjtFQUNEO0VBQ0YsS0FSSSxNQVNBO0VBQ0hFLE1BQUFBLFFBQVEsR0FBRyxLQUFYO0VBQ0Q7RUFDRjs7RUFDRCxNQUFJQSxRQUFKLEVBQWM7RUFDWjtFQUNBSCxJQUFBQSxLQUFLLENBQUNsVSxHQUFOLENBQVVtVSxRQUFWLEVBQW9CakssUUFBcEI7RUFDQStKLElBQUFBLFNBQVMsQ0FBQy9KLFFBQUQsRUFBV2lLLFFBQVgsRUFBcUJILFFBQXJCLEVBQStCaEssVUFBL0IsRUFBMkNrSyxLQUEzQyxDQUFUO0VBQ0FBLElBQUFBLEtBQUssQ0FBQyxRQUFELENBQUwsQ0FBZ0JDLFFBQWhCO0VBQ0Q7O0VBQ0RSLEVBQUFBLGdCQUFnQixDQUFDbk0sTUFBRCxFQUFTQyxHQUFULEVBQWN5QyxRQUFkLENBQWhCO0VBQ0Q7O0VDbkZEO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0VBQ0EsU0FBU3FLLFNBQVQsQ0FBbUIvTSxNQUFuQixFQUEyQlMsTUFBM0IsRUFBbUMrTCxRQUFuQyxFQUE2Q2hLLFVBQTdDLEVBQXlEa0ssS0FBekQsRUFBZ0U7RUFDOUQsTUFBSTFNLE1BQU0sS0FBS1MsTUFBZixFQUF1QjtFQUNyQjtFQUNEOztFQUNEb0wsRUFBQUEsT0FBTyxDQUFDcEwsTUFBRCxFQUFTLFVBQVNrTSxRQUFULEVBQW1CMU0sR0FBbkIsRUFBd0I7RUFDdEN5TSxJQUFBQSxLQUFLLEtBQUtBLEtBQUssR0FBRyxJQUFJaEMsS0FBSixFQUFiLENBQUw7O0VBQ0EsUUFBSXRNLFFBQVEsQ0FBQ3VPLFFBQUQsQ0FBWixFQUF3QjtFQUN0QkosTUFBQUEsYUFBYSxDQUFDdk0sTUFBRCxFQUFTUyxNQUFULEVBQWlCUixHQUFqQixFQUFzQnVNLFFBQXRCLEVBQWdDTyxTQUFoQyxFQUEyQ3ZLLFVBQTNDLEVBQXVEa0ssS0FBdkQsQ0FBYjtFQUNELEtBRkQsTUFHSztFQUNILFVBQUloSyxRQUFRLEdBQUdGLFVBQVUsR0FDckJBLFVBQVUsQ0FBQzZKLE9BQU8sQ0FBQ3JNLE1BQUQsRUFBU0MsR0FBVCxDQUFSLEVBQXVCME0sUUFBdkIsRUFBa0MxTSxHQUFHLEdBQUcsRUFBeEMsRUFBNkNELE1BQTdDLEVBQXFEUyxNQUFyRCxFQUE2RGlNLEtBQTdELENBRFcsR0FFckJ6UyxTQUZKOztFQUlBLFVBQUl5SSxRQUFRLEtBQUt6SSxTQUFqQixFQUE0QjtFQUMxQnlJLFFBQUFBLFFBQVEsR0FBR2lLLFFBQVg7RUFDRDs7RUFDRFIsTUFBQUEsZ0JBQWdCLENBQUNuTSxNQUFELEVBQVNDLEdBQVQsRUFBY3lDLFFBQWQsQ0FBaEI7RUFDRDtFQUNGLEdBZk0sRUFlSmtGLE1BZkksQ0FBUDtFQWdCRDs7RUNyQ0Q7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0VBQ0EsU0FBU29GLFlBQVQsQ0FBc0J2UCxLQUF0QixFQUE2QjtFQUMzQixTQUFPLE9BQU9BLEtBQVAsSUFBZ0IsVUFBaEIsR0FBNkJBLEtBQTdCLEdBQXFDYSxRQUE1QztFQUNEOztFQ05EO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7RUFDQSxTQUFTekUsT0FBVCxDQUFpQm9TLFVBQWpCLEVBQTZCcEssUUFBN0IsRUFBdUM7RUFDckMsTUFBSTFDLElBQUksR0FBR3ZGLE9BQU8sQ0FBQ3FTLFVBQUQsQ0FBUCxHQUFzQnJLLFNBQXRCLEdBQWtDc0ssUUFBN0M7RUFDQSxTQUFPL00sSUFBSSxDQUFDOE0sVUFBRCxFQUFhZSxZQUFZLENBQUNuTCxRQUFELENBQXpCLENBQVg7RUFDRDs7RUNuQ0Q7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0VBQ0EsSUFBSW9MLEtBQUssR0FBRzVKLGNBQWMsQ0FBQyxVQUFTckQsTUFBVCxFQUFpQlMsTUFBakIsRUFBeUIrTCxRQUF6QixFQUFtQztFQUM1RE8sRUFBQUEsU0FBUyxDQUFDL00sTUFBRCxFQUFTUyxNQUFULEVBQWlCK0wsUUFBakIsQ0FBVDtFQUNELENBRnlCLENBQTFCOztFQ2xDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFZTyxTQUFTVSxPQUFULENBQWlCeFIsT0FBakIsRUFBMEJ5UixJQUExQixFQUFnQ0MsV0FBaEMsRUFBNkM7RUFDbERDLEVBQUFBLFdBQVcsQ0FBQzNSLE9BQUQsQ0FBWDtFQUNBQSxFQUFBQSxPQUFPLENBQUM0UixTQUFSLENBQWtCSCxJQUFsQixJQUEwQnpSLE9BQU8sQ0FBQzRSLFNBQVIsQ0FBa0JILElBQWxCLEtBQTJCQyxXQUFXLEVBQWhFO0VBRUEsU0FBTzFSLE9BQU8sQ0FBQzRSLFNBQVIsQ0FBa0JILElBQWxCLENBQVA7RUFDRDtFQUVNLFNBQVNFLFdBQVQsQ0FBcUIzUixPQUFyQixFQUE4QjtFQUNuQyxNQUFJLENBQUNBLE9BQUwsRUFBYztFQUNaLFdBQU9BLE9BQVA7RUFDRDs7RUFFREEsRUFBQUEsT0FBTyxDQUFDNFIsU0FBUixHQUFvQjVSLE9BQU8sQ0FBQzRSLFNBQVIsSUFBcUIsRUFBekM7RUFDQSxTQUFPNVIsT0FBUDtFQUNEOztFQ3JCRDtFQUNBO0VBQ0E7O01BQ3FCNlI7Ozs7Ozs7V0FDbkIsZUFBZ0I7RUFBRSxhQUFPLE1BQVA7RUFBZ0I7OzthQUVsQyxpQkFBZXpTLEdBQWYsRUFBa0M7O0VBQ2hDQSxNQUFBQSxHQUFHLENBQUMwUyxJQUFKLEdBQVcsVUFBQ0MsR0FBRCxFQUF1QjtFQUFBLFlBQWpCQyxPQUFpQix1RUFBUCxFQUFPO0VBQ2hDLFlBQU0xUyxRQUFRLEdBQUcsT0FBT3lTLEdBQVAsS0FBZSxRQUFmLEdBQTBCQSxHQUExQixHQUFnQyxJQUFqRDtFQUNBQSxRQUFBQSxHQUFHLEdBQUczUyxHQUFHLENBQUNHLFNBQUosQ0FBY3dTLEdBQWQsQ0FBTjtFQUVBLGVBQU9QLE9BQU8sQ0FDWk8sR0FEWSxFQUVaLGFBRlksRUFHWjtFQUFBLGlCQUFNLElBQUlFLGtCQUFKLENBQXVCM1MsUUFBdkIsRUFBaUN5UyxHQUFqQyxFQUFzQ0MsT0FBdEMsRUFBK0M1UyxHQUEvQyxDQUFOO0VBQUEsU0FIWSxDQUFkO0VBS0QsT0FURDtFQVVEOzs7Ozs7TUFHRzZTO0VBU0osOEJBQVkzUyxRQUFaLEVBQXNCVSxPQUF0QixFQUErQmdTLE9BQS9CLEVBQXdDNVMsR0FBeEMsRUFBNkM7RUFBQTs7RUFBQSxzQ0FSbEMsRUFRa0M7O0VBQzNDLFNBQUtZLE9BQUwsR0FBZUEsT0FBZjtFQUNBLFNBQUtnUyxPQUFMLEdBQWU3VixNQUFNLENBQUMrVixNQUFQLENBQWMsRUFBZCxFQUFrQixLQUFLakssV0FBTCxDQUFpQmtLLGNBQW5DLEVBQW1ESCxPQUFuRCxDQUFmO0VBQ0EsU0FBSzVTLEdBQUwsR0FBV0EsR0FBWDtFQUNBLFNBQUtnVCxJQUFMLEdBQVloVCxHQUFHLENBQUNnVCxJQUFKLENBQVM5UyxRQUFRLElBQUlVLE9BQXJCLENBQVo7O0VBRUEsUUFBSSxDQUFDLEtBQUtvUyxJQUFWLEVBQWdCO0VBQ2QsWUFBTSxJQUFJblQsS0FBSixDQUFVLHlDQUFWLENBQU47RUFDRDs7RUFFRCxTQUFLb1QsY0FBTDtFQUNEO0VBRUQ7RUFDRjtFQUNBOzs7OzthQUNFLDBCQUFpQjtFQUVmO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNEO0VBR0Q7RUFDQTs7OzthQUVBLHlCQUEyQztFQUFBOztFQUFBLFVBQTdCQyxLQUE2Qix1RUFBckIsTUFBcUI7RUFBQSxVQUFiQyxNQUFhLHVFQUFKLEVBQUk7RUFDekMsV0FBS0MsUUFBTCxHQUFnQixLQUFLeFMsT0FBTCxDQUFheVMsT0FBYixDQUFxQkQsUUFBckM7O0VBRUEsVUFBSSxDQUFDLEtBQUtBLFFBQUwsQ0FBY0UsV0FBZCxHQUE0QkMsUUFBNUIsQ0FBcUMsTUFBckMsQ0FBRCxJQUNDLENBQUMsS0FBS0gsUUFBTCxDQUFjRSxXQUFkLEdBQTRCQyxRQUE1QixDQUFxQyxPQUFyQyxDQUROLEVBQ3FEO0VBQ25ELGFBQUtILFFBQUwsSUFBaUIsTUFBakI7RUFDRDs7RUFFRCxhQUFPLEtBQUtwVCxHQUFMLENBQVNpQixVQUFULEdBQ0pOLElBREksQ0FDQyxZQUFNO0VBQ1ZJLFFBQUFBLE1BQU0sQ0FBQ21TLEtBQVAsQ0FBYUEsS0FBYixFQUFvQixLQUFJLENBQUNNLFFBQUwsQ0FBY0wsTUFBZCxDQUFwQixFQURVOztFQUdWLFFBQUEsS0FBSSxDQUFDblQsR0FBTCxDQUFTMEIsV0FBVDtFQUNELE9BTEksQ0FBUDtFQU1EOzs7YUFFRCxvQkFBc0I7RUFBQSxVQUFieVIsTUFBYSx1RUFBSixFQUFJO0VBQ3BCLGFBQU9oQixLQUFLLENBQ1YsSUFEVSxFQUVWZ0IsTUFGVSxDQUFaO0VBSUQ7OzthQUVELG9CQUFXTSxNQUFYLEVBQW1CO0VBQ2pCLFVBQUlBLE1BQUosRUFBWTtFQUNWQSxRQUFBQSxNQUFNLENBQUNDLGNBQVA7RUFDRDs7RUFFRCxXQUFLVixJQUFMLENBQVVXLEdBQVY7RUFDRDs7O2FBRUQsc0JBQWEvUyxPQUFiLEVBQXNCO0VBQ3BCQSxNQUFBQSxPQUFPLENBQUNnVCxnQkFBUixDQUF5Qix5QkFBekIsRUFBb0Q3VSxPQUFwRCxDQUE0RCxVQUFDNFQsR0FBRCxFQUFTO0VBQ25FQSxRQUFBQSxHQUFHLENBQUNoUSxLQUFKLEdBQVksRUFBWjtFQUNELE9BRkQ7RUFJQSxXQUFLcVEsSUFBTCxDQUFVVyxHQUFWO0VBQ0Q7OzthQUVELGNBQUtFLEdBQUwsRUFBVTtFQUNSLFVBQU1DLEdBQUcsR0FBRyxLQUFLQyxZQUFMLENBQWtCRixHQUFsQixDQUFaO0VBRUEsVUFBTUcsS0FBSyxHQUFHSCxHQUFHLENBQUNSLE9BQUosQ0FBWVcsS0FBMUI7RUFDQSxVQUFJQyxHQUFHLEdBQUdKLEdBQUcsQ0FBQ1IsT0FBSixDQUFZWSxHQUF0QjtFQUNBLFVBQUlDLElBQUksR0FBR0wsR0FBRyxDQUFDUixPQUFKLENBQVlhLElBQXZCOztFQUVBLFVBQUlGLEtBQUosRUFBVztFQUNUQyxRQUFBQSxHQUFHLEdBQUdELEtBQUssR0FBRyxNQUFkO0VBQ0FFLFFBQUFBLElBQUksR0FBR0YsS0FBSyxHQUFHLE9BQWY7RUFDRDs7RUFFRCxVQUFJRixHQUFHLEtBQUssS0FBWixFQUFtQjtFQUNqQixlQUFPLEtBQUtLLE1BQUwsQ0FBWUQsSUFBWixDQUFQO0VBQ0Q7O0VBRUQsYUFBTyxLQUFLQyxNQUFMLENBQVlGLEdBQVosQ0FBUDtFQUNEO0VBRUQ7RUFDRjtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7Ozs7YUFDRSxnQkFBT2IsUUFBUCxFQUFpQjtFQUNmLFVBQUlnQixhQUFhLEdBQUcsS0FBS3hULE9BQUwsQ0FBYXlULGFBQWIsQ0FBMkIsMkJBQTNCLENBQXBCOztFQUVBLFVBQUksQ0FBQ0QsYUFBTCxFQUFvQjtFQUNsQkEsUUFBQUEsYUFBYSxHQUFHLEtBQUtwVSxHQUFMLENBQVNzVSxDQUFULENBQVcsT0FBWCxFQUFvQjtFQUFFakMsVUFBQUEsSUFBSSxFQUFFLGVBQVI7RUFBeUI5TyxVQUFBQSxJQUFJLEVBQUUsUUFBL0I7RUFBeUNaLFVBQUFBLEtBQUssRUFBRTtFQUFoRCxTQUFwQixDQUFoQjtFQUVBLGFBQUsvQixPQUFMLENBQWEyVCxXQUFiLENBQXlCSCxhQUF6QjtFQUNEOztFQUVEQSxNQUFBQSxhQUFhLENBQUN6UixLQUFkLEdBQXNCeVEsUUFBdEI7RUFFQSxhQUFPLEtBQUtKLElBQUwsQ0FBVVcsR0FBVixFQUFQO0VBQ0Q7OzthQUVELHNCQUFhRSxHQUFiLEVBQWtCO0VBQ2hCLGFBQU8sS0FBS0UsWUFBTCxDQUFrQkYsR0FBbEIsS0FBMEIsSUFBakM7RUFDRDs7O2FBRUQsc0JBQWFBLEdBQWIsRUFBa0I7RUFDaEIsVUFBTUcsS0FBSyxHQUFHSCxHQUFHLENBQUNSLE9BQUosQ0FBWVcsS0FBMUI7RUFDQSxVQUFJQyxHQUFHLEdBQUdKLEdBQUcsQ0FBQ1IsT0FBSixDQUFZWSxHQUF0QjtFQUNBLFVBQUlDLElBQUksR0FBR0wsR0FBRyxDQUFDUixPQUFKLENBQVlhLElBQXZCOztFQUVBLFVBQUlGLEtBQUosRUFBVztFQUNUQyxRQUFBQSxHQUFHLEdBQUdELEtBQUssR0FBRyxNQUFkO0VBQ0FFLFFBQUFBLElBQUksR0FBR0YsS0FBSyxHQUFHLE9BQWY7RUFDRDs7RUFFRCxVQUFJLEtBQUtRLGNBQUwsQ0FBb0JQLEdBQXBCLEVBQXlCLEtBQUtiLFFBQTlCLENBQUosRUFBNkM7RUFDM0MsZUFBTyxLQUFQO0VBQ0QsT0FGRCxNQUVPLElBQUksS0FBS29CLGNBQUwsQ0FBb0JOLElBQXBCLEVBQTBCLEtBQUtkLFFBQS9CLENBQUosRUFBOEM7RUFDbkQsZUFBTyxNQUFQO0VBQ0Q7O0VBRUQsYUFBTyxJQUFQO0VBQ0Q7OzthQUVELHdCQUFlcUIsQ0FBZixFQUFrQkMsQ0FBbEIsRUFBcUI7RUFDbkJELE1BQUFBLENBQUMsR0FBR0EsQ0FBQyxDQUFDNVAsT0FBRixDQUFVLE1BQVYsRUFBa0IsR0FBbEIsRUFBdUI4UCxJQUF2QixHQUE4QnJCLFdBQTlCLEVBQUo7RUFDQW9CLE1BQUFBLENBQUMsR0FBR0EsQ0FBQyxDQUFDN1AsT0FBRixDQUFVLE1BQVYsRUFBa0IsR0FBbEIsRUFBdUI4UCxJQUF2QixHQUE4QnJCLFdBQTlCLEVBQUo7RUFFQSxhQUFPbUIsQ0FBQyxLQUFLQyxDQUFiO0VBQ0Q7RUFFRDtFQUNGO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7Ozs7YUFDRSxrQkFBU0UsR0FBVCxFQUE0QjtFQUFBLFVBQWRqUyxLQUFjLHVFQUFOLElBQU07RUFDMUIsVUFBTWtTLEVBQUUsR0FBRyxLQUFLN0IsSUFBTCxDQUFVOEIsSUFBVixDQUFlLHlDQUF5Q0YsR0FBekMsR0FBK0MsR0FBOUQsQ0FBWDs7RUFFQSxVQUFJLENBQUNDLEVBQUUsQ0FBQ3BQLE1BQVIsRUFBZ0I7RUFDZCxjQUFNLElBQUk1RixLQUFKLENBQVUsc0JBQXNCK1UsR0FBdEIsR0FBNEIsYUFBdEMsQ0FBTjtFQUNEOztFQUVEQyxNQUFBQSxFQUFFLENBQUMsQ0FBRCxDQUFGLENBQU1FLE9BQU4sR0FBZ0JwUyxLQUFoQjtFQUNEO0VBRUQ7RUFDRjtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOzs7O2FBQ0UsbUJBQVVpUyxHQUFWLEVBQWVJLEdBQWYsRUFBb0JDLE9BQXBCLEVBQTZCO0VBQzNCLFdBQUtDLFNBQUwsQ0FBZSxLQUFmO0VBRUEsV0FBS0MsUUFBTCxDQUFjUCxHQUFkO0VBRUEsYUFBTyxLQUFLUSxJQUFMLENBQVVDLEtBQVYsQ0FBZ0JMLEdBQWhCLEVBQXFCQyxPQUFyQixDQUFQO0VBQ0Q7RUFFRDtFQUNGO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7OzthQUNFLGdCQUFPSyxJQUFQLEVBQWFWLEdBQWIsRUFBa0JJLEdBQWxCLEVBQXVCQyxPQUF2QixFQUFnQztFQUM5QkEsTUFBQUEsT0FBTyxHQUFHQSxPQUFPLElBQUksRUFBckI7RUFFQUEsTUFBQUEsT0FBTyxDQUFDSyxJQUFSLEdBQWVBLElBQWY7RUFFQSxhQUFPLEtBQUtDLFNBQUwsQ0FBZVgsR0FBZixFQUFvQkksR0FBcEIsRUFBeUJDLE9BQXpCLENBQVA7RUFDRDtFQUVEO0VBQ0Y7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7OzthQUNFLGVBQU1LLElBQU4sRUFBWU4sR0FBWixFQUFpQkMsT0FBakIsRUFBMEI7RUFDeEJBLE1BQUFBLE9BQU8sR0FBR0EsT0FBTyxJQUFJLEVBQXJCO0VBRUFBLE1BQUFBLE9BQU8sQ0FBQ0ssSUFBUixHQUFlQSxJQUFmO0VBRUEsYUFBTyxLQUFLRixJQUFMLENBQVVDLEtBQVYsQ0FBZ0JMLEdBQWhCLEVBQXFCQyxPQUFyQixDQUFQO0VBQ0Q7RUFFRDtFQUNGO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7Ozs7YUFDRSxpQkFBUUwsR0FBUixFQUFhSSxHQUFiLEVBQWtCQyxPQUFsQixFQUEyQjtFQUN6QixXQUFLQyxTQUFMLENBQWUsS0FBZjtFQUVBLFdBQUtDLFFBQUwsQ0FBY1AsR0FBZDtFQUVBLGFBQU8sS0FBS1EsSUFBTCxDQUFVSSxJQUFWLENBQWVSLEdBQWYsRUFBb0JDLE9BQXBCLENBQVA7RUFDRDtFQUVEO0VBQ0Y7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7OzthQUNFLG9CQUFXUSxPQUFYLEVBQW9CVCxHQUFwQixFQUF5QkMsT0FBekIsRUFBa0M7RUFBQTs7RUFDaENRLE1BQUFBLE9BQU8sR0FBR0EsT0FBTyxJQUFJLElBQVgsR0FBa0IsS0FBS3pWLEdBQUwsQ0FBUzBWLEVBQVQsQ0FBWSxnQ0FBWixDQUFsQixHQUFrRUQsT0FBNUU7O0VBRUEsVUFBSUEsT0FBTyxLQUFLLEtBQWhCLEVBQXVCO0VBQ3JCLGFBQUt6VixHQUFMLENBQVMyVixPQUFULENBQWlCRixPQUFqQixFQUEwQixVQUFBRyxTQUFTLEVBQUk7RUFDckMsY0FBSUEsU0FBSixFQUFlO0VBQ2IsWUFBQSxNQUFJLENBQUNSLElBQUwsQ0FBVSxRQUFWLEVBQW9CSixHQUFwQixFQUF5QkMsT0FBekI7RUFDRDtFQUNGLFNBSkQ7RUFLRCxPQU5ELE1BTU87RUFDTCxhQUFLRyxJQUFMLENBQVUsUUFBVixFQUFvQkosR0FBcEIsRUFBeUJDLE9BQXpCO0VBQ0Q7O0VBRUQsYUFBTyxJQUFQO0VBQ0Q7RUFFRDtFQUNGO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7OzthQUNFLG1CQUFVTCxHQUFWLEVBQWVpQixHQUFmLEVBQW9CYixHQUFwQixFQUF5QkMsT0FBekIsRUFBa0M7RUFBQTs7RUFDaENZLE1BQUFBLEdBQUcsR0FBR0EsR0FBRyxJQUFJLEtBQUs3VixHQUFMLENBQVMwVixFQUFULENBQVksZ0NBQVosQ0FBYjtFQUVBLFdBQUsxVixHQUFMLENBQVMyVixPQUFULENBQWlCRSxHQUFqQixFQUFzQixVQUFBRCxTQUFTLEVBQUk7RUFDakMsWUFBSUEsU0FBSixFQUFlO0VBQ2IsVUFBQSxNQUFJLENBQUNWLFNBQUwsQ0FBZSxLQUFmOztFQUVBLFVBQUEsTUFBSSxDQUFDQyxRQUFMLENBQWNQLEdBQWQ7O0VBRUEsVUFBQSxNQUFJLENBQUNrQixVQUFMLENBQWdCLEtBQWhCLEVBQXVCZCxHQUF2QixFQUE0QkMsT0FBNUI7RUFDRDtFQUNGLE9BUkQ7RUFVQSxhQUFPLElBQVA7RUFDRDtFQUVEO0VBQ0Y7RUFDQTtFQUNBO0VBQ0E7Ozs7YUFDRSxtQkFBVXRTLEtBQVYsRUFBaUI7RUFDZixXQUFLM0MsR0FBTCxDQUFTK1YsU0FBVCxDQUNFLEtBQUtuVixPQUFMLENBQWFnVCxnQkFBYixDQUE4QiwrQ0FBOUIsQ0FERixFQUdHaEYsR0FISCxDQUdPLFVBQUNvSCxLQUFELEVBQVc7RUFDZEEsUUFBQUEsS0FBSyxDQUFDakIsT0FBTixHQUFnQnBTLEtBQWhCO0VBQ0QsT0FMSDtFQU9BLGFBQU8sSUFBUDtFQUNEO0VBRUQ7RUFDRjtFQUNBO0VBQ0E7RUFDQTs7OzthQUNFLHdCQUFlO0VBQ2IsYUFBTyxLQUFLc1QsVUFBTCxHQUFrQnhRLE1BQXpCO0VBQ0Q7RUFFRDtFQUNGO0VBQ0E7RUFDQTtFQUNBOzs7O2FBQ0Usc0JBQWE7RUFDWCxhQUFPLEtBQUt6RixHQUFMLENBQVMrVixTQUFULENBQ0wsS0FBS25WLE9BQUwsQ0FBYWdULGdCQUFiLENBQThCLCtDQUE5QixDQURLLENBQVA7RUFHRDtFQUVEO0VBQ0Y7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7Ozs7YUFDRSxvQkFBV2lDLEdBQVgsRUFBZ0JqWCxLQUFoQixFQUF1QjtFQUNyQmlYLE1BQUFBLEdBQUcsR0FBR0EsR0FBRyxJQUFJSyxPQUFPLENBQUNDLFVBQVIsQ0FBbUJDLFNBQW5CLENBQTZCLDhCQUE3QixDQUFiOztFQUVBLFVBQUksQ0FBQyxLQUFLQyxZQUFMLEVBQUwsRUFBMEI7RUFDeEJDLFFBQUFBLEtBQUssQ0FBQ1QsR0FBRCxDQUFMLENBRHdCOztFQUl4QixZQUFJalgsS0FBSixFQUFXO0VBQ1RBLFVBQUFBLEtBQUssQ0FBQzJYLGVBQU47RUFDQTNYLFVBQUFBLEtBQUssQ0FBQzhVLGNBQU47RUFDRDs7RUFFRCxjQUFNLElBQUk3VCxLQUFKLENBQVVnVyxHQUFWLENBQU47RUFDRDs7RUFFRCxhQUFPLElBQVA7RUFDRDtFQUVEO0VBQ0Y7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7Ozs7YUFDRSxvQkFBV2IsR0FBWCxFQUFnQkMsT0FBaEIsRUFBeUI7RUFDdkIsVUFBTWhULElBQUksR0FBRyxJQUFiO0VBQ0EsVUFBTXVVLE1BQU0sR0FBRyxLQUFLeEQsSUFBTCxDQUFVOEIsSUFBVixDQUFlLDZCQUFmLENBQWYsQ0FGdUI7O0VBS3ZCLFVBQUkwQixNQUFNLENBQUMvUSxNQUFYLEVBQW1CO0VBQ2pCLFlBQU1nUixjQUFjLEdBQUdELE1BQU0sQ0FBQ0UsR0FBUCxHQUFhQyxLQUFiLENBQW1CLEdBQW5CLENBQXZCO0VBQ0EsWUFBTUMsTUFBTSxHQUFHLEtBQUs1RCxJQUFMLENBQVU4QixJQUFWLENBQWUseUJBQWYsQ0FBZjtFQUVBLGFBQUtJLFNBQUw7RUFFQTBCLFFBQUFBLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLFVBQVNDLENBQVQsRUFBWTtFQUN0QixjQUFNQyxLQUFLLEdBQUdDLENBQUMsQ0FBQyxJQUFELENBQWY7O0VBRUEsY0FBSUQsS0FBSyxDQUFDTCxHQUFOLE9BQWdCRCxjQUFjLENBQUNLLENBQUQsQ0FBbEMsRUFBdUM7RUFDckM7RUFDQTdVLFlBQUFBLElBQUksQ0FBQ2tULFFBQUwsQ0FBYzRCLEtBQUssQ0FBQ0UsSUFBTixDQUFXLGdCQUFYLENBQWQ7RUFFQSxnQkFBTUMsRUFBRSxHQUFHSCxLQUFLLENBQUNJLE9BQU4sQ0FBYyxJQUFkLENBQVg7RUFDQSxnQkFBTUMsS0FBSyxHQUFHRixFQUFFLENBQUNELElBQUgsQ0FBUSxrQkFBUixDQUFkLENBTHFDOztFQVFyQyxnQkFBSUcsS0FBSyxLQUFLLEVBQWQsRUFBa0I7RUFDaEJGLGNBQUFBLEVBQUUsQ0FBQ0csUUFBSCxDQUFZLHVCQUF1QkQsS0FBdkIsR0FBK0IsR0FBM0MsRUFDR3RDLElBREgsQ0FDUSxxQkFEUixFQUVHcFcsSUFGSCxDQUVRLFNBRlIsRUFFbUIsSUFGbkI7RUFHRDtFQUNGO0VBQ0YsU0FqQkQ7RUFrQkQ7O0VBRUQsYUFBTyxLQUFLNFksS0FBTCxDQUFXLFNBQVgsRUFBc0J0QyxHQUF0QixFQUEyQkMsT0FBM0IsQ0FBUDtFQUNEO0VBRUQ7RUFDRjtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7Ozs7YUFDRSxpQkFBUUwsR0FBUixFQUFhMkMsS0FBYixFQUFvQnZDLEdBQXBCLEVBQXlCQyxPQUF6QixFQUFrQztFQUNoQ0EsTUFBQUEsT0FBTyxHQUFHQSxPQUFPLElBQUksRUFBckI7RUFDQUEsTUFBQUEsT0FBTyxDQUFDc0MsS0FBUixHQUFnQkEsS0FBaEI7RUFFQSxhQUFPLEtBQUtDLE1BQUwsQ0FBWSxTQUFaLEVBQXVCNUMsR0FBdkIsRUFBNEJJLEdBQTVCLEVBQWlDQyxPQUFqQyxDQUFQO0VBQ0Q7OztXQXpaRCxlQUE0QjtFQUMxQixhQUFPO0VBQUEsT0FBUDtFQUdEOzs7Ozs7TUMzQmtCd0M7Ozs7Ozs7V0FDbkIsZUFBZ0I7RUFDZCxhQUFPLE1BQVA7RUFDRDs7O2FBRUQsaUJBQWV6WCxHQUFmLEVBQWtDOztFQUNoQ0EsTUFBQUEsR0FBRyxDQUFDZ1QsSUFBSixHQUFXLFVBQUNMLEdBQUQsRUFBdUI7RUFBQSxZQUFqQkMsT0FBaUIsdUVBQVAsRUFBTztFQUNoQyxZQUFNMVMsUUFBUSxHQUFHLE9BQU95UyxHQUFQLEtBQWUsUUFBZixHQUEwQkEsR0FBMUIsR0FBZ0MsSUFBakQ7RUFDQUEsUUFBQUEsR0FBRyxHQUFHM1MsR0FBRyxDQUFDRyxTQUFKLENBQWN3UyxHQUFkLENBQU47RUFFQSxlQUFPUCxPQUFPLENBQ1pPLEdBRFksRUFFWixhQUZZLEVBR1o7RUFBQSxpQkFBTSxJQUFJK0Usa0JBQUosQ0FBdUJ4WCxRQUF2QixFQUFpQ3lTLEdBQWpDLEVBQXNDQyxPQUF0QyxFQUErQzVTLEdBQS9DLENBQU47RUFBQSxTQUhZLENBQWQ7RUFLRCxPQVREO0VBVUQ7Ozs7OztNQUdHMFg7RUFDSjtFQUNGO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNFLDhCQUFZeFgsUUFBWixFQUFzQnlYLEtBQXRCLEVBQTZCL0UsT0FBN0IsRUFBc0M1UyxHQUF0QyxFQUEyQztFQUFBOztFQUN6QyxTQUFLQSxHQUFMLEdBQVdBLEdBQVgsQ0FEeUM7O0VBSXpDLFFBQUksQ0FBQzJYLEtBQUwsRUFBWTtFQUNWQSxNQUFBQSxLQUFLLEdBQUdDLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QixNQUF2QixDQUFSOztFQUVBLFVBQUkzWCxRQUFRLENBQUM0WCxPQUFULENBQWlCLEdBQWpCLE1BQTBCLENBQTlCLEVBQWlDO0VBQy9CSCxRQUFBQSxLQUFLLENBQUNJLFlBQU4sQ0FBbUIsSUFBbkIsRUFBeUI3WCxRQUFRLENBQUM4WCxNQUFULENBQWdCLENBQWhCLENBQXpCO0VBQ0FMLFFBQUFBLEtBQUssQ0FBQ0ksWUFBTixDQUFtQixNQUFuQixFQUEyQjdYLFFBQVEsQ0FBQzhYLE1BQVQsQ0FBZ0IsQ0FBaEIsQ0FBM0I7RUFDRDs7RUFFREwsTUFBQUEsS0FBSyxDQUFDSSxZQUFOLENBQW1CLFFBQW5CLEVBQTZCLE1BQTdCO0VBQ0FKLE1BQUFBLEtBQUssQ0FBQ0ksWUFBTixDQUFtQixTQUFuQixFQUE4QixxQkFBOUI7RUFDQUosTUFBQUEsS0FBSyxDQUFDSSxZQUFOLENBQW1CLFlBQW5CLEVBQWlDLE1BQWpDO0VBQ0FKLE1BQUFBLEtBQUssQ0FBQ0ksWUFBTixDQUFtQixRQUFuQixFQUE2Qi9YLEdBQUcsQ0FBQ3VOLElBQUosQ0FBUyxhQUFULEVBQXdCLE1BQXhCLENBQTdCO0VBQ0FvSyxNQUFBQSxLQUFLLENBQUNJLFlBQU4sQ0FBbUIsU0FBbkIsRUFBOEIsTUFBOUI7RUFFQSxVQUFNRSxJQUFJLEdBQUdMLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QixPQUF2QixDQUFiO0VBQ0FJLE1BQUFBLElBQUksQ0FBQ0YsWUFBTCxDQUFrQixNQUFsQixFQUEwQi9YLEdBQUcsQ0FBQ3VOLElBQUosQ0FBUyxZQUFULENBQTFCO0VBRUFvSyxNQUFBQSxLQUFLLENBQUNwRCxXQUFOLENBQWtCMEQsSUFBbEI7RUFDQUwsTUFBQUEsUUFBUSxDQUFDTSxJQUFULENBQWMzRCxXQUFkLENBQTBCb0QsS0FBMUI7RUFDRDs7RUFFRC9FLElBQUFBLE9BQU8sR0FBRzdWLE1BQU0sQ0FBQytWLE1BQVAsQ0FBZSxFQUFmLEVBQW1CLEtBQUtqSyxXQUFMLENBQWlCa0ssY0FBcEMsRUFBb0RILE9BQXBELENBQVY7RUFFQSxTQUFLaFMsT0FBTCxHQUFlK1csS0FBZjtFQUNBLFNBQUsvRSxPQUFMLEdBQWVBLE9BQWY7RUFFQSxTQUFLdUYsVUFBTDtFQUNEOzs7O2FBRUQsc0JBQWE7RUFFWDtFQUNBO0VBQ0E7RUFDQTtFQUVBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNEOzs7YUFFRCx5QkFBMkM7RUFBQTs7RUFBQSxVQUE3QmpGLEtBQTZCLHVFQUFyQixNQUFxQjtFQUFBLFVBQWJDLE1BQWEsdUVBQUosRUFBSTtFQUN6QyxhQUFPLEtBQUtuVCxHQUFMLENBQVNpQixVQUFULEdBQ0pOLElBREksQ0FDQyxZQUFNO0VBQ1ZJLFFBQUFBLE1BQU0sQ0FBQ21TLEtBQVAsQ0FBYUEsS0FBYixFQUFvQixLQUFJLENBQUNNLFFBQUwsQ0FBY0wsTUFBZCxDQUFwQixFQURVOztFQUdWLFFBQUEsS0FBSSxDQUFDblQsR0FBTCxDQUFTMEIsV0FBVDtFQUNELE9BTEksQ0FBUDtFQU1EOzs7YUFFRCxvQkFBc0I7RUFBQSxVQUFieVIsTUFBYSx1RUFBSixFQUFJO0VBQ3BCLGFBQU9oQixLQUFLLENBQ1YsSUFEVSxFQUVWZ0IsTUFGVSxDQUFaO0VBSUQ7RUFFRDtFQUNGO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7OzthQUNFLGdCQUFPNkIsR0FBUCxFQUFZQyxPQUFaLEVBQXFCbUQsTUFBckIsRUFBNkJDLFlBQTdCLEVBQTJDO0VBQUE7O0VBQ3pDLFVBQU1yRixJQUFJLEdBQUcsS0FBS3BTLE9BQWxCOztFQUVBLFVBQUl5WCxZQUFKLEVBQWtCO0VBQ2hCLFlBQUlDLFdBQVcsR0FBR3RGLElBQUksQ0FBQ3FCLGFBQUwsQ0FBbUIsdUJBQW5CLENBQWxCOztFQUVBLFlBQUksQ0FBQ2lFLFdBQUwsRUFBa0I7RUFDaEJBLFVBQUFBLFdBQVcsR0FBR1YsUUFBUSxDQUFDQyxhQUFULENBQXVCLE9BQXZCLENBQWQ7RUFDQVMsVUFBQUEsV0FBVyxDQUFDUCxZQUFaLENBQXlCLE1BQXpCLEVBQWlDLFNBQWpDO0VBQ0FPLFVBQUFBLFdBQVcsQ0FBQ1AsWUFBWixDQUF5QixNQUF6QixFQUFpQyxRQUFqQztFQUVBL0UsVUFBQUEsSUFBSSxDQUFDdUIsV0FBTCxDQUFpQitELFdBQWpCO0VBQ0Q7O0VBRURBLFFBQUFBLFdBQVcsQ0FBQzNWLEtBQVosR0FBb0IwVixZQUFwQjtFQUNELE9BZndDOzs7RUFrQnpDLFVBQUlwRCxPQUFKLEVBQWE7RUFDWCxZQUFJZSxLQUFKO0VBRUEsWUFBTXVDLE9BQU8sR0FBRyxLQUFLMVAsV0FBTCxDQUFpQjJQLGFBQWpCLENBQStCdkQsT0FBL0IsQ0FBaEI7RUFFQTRCLFFBQUFBLE9BQUksQ0FBQzBCLE9BQUQsRUFBVSxVQUFDNVYsS0FBRCxFQUFRd0MsR0FBUixFQUFnQjtFQUM1QixjQUFNc1QsU0FBUyxHQUFHLE1BQUksQ0FBQzVQLFdBQUwsQ0FBaUI2UCxjQUFqQixDQUFnQ3ZULEdBQWhDLENBQWxCOztFQUNBNlEsVUFBQUEsS0FBSyxHQUFHaEQsSUFBSSxDQUFDcUIsYUFBTCx3QkFBa0NvRSxTQUFsQyxTQUFSOztFQUVBLGNBQUksQ0FBQ3pDLEtBQUwsRUFBWTtFQUNWQSxZQUFBQSxLQUFLLEdBQUc0QixRQUFRLENBQUNDLGFBQVQsQ0FBdUIsT0FBdkIsQ0FBUjtFQUNBN0IsWUFBQUEsS0FBSyxDQUFDK0IsWUFBTixDQUFtQixNQUFuQixFQUEyQlUsU0FBM0I7RUFDQXpDLFlBQUFBLEtBQUssQ0FBQytCLFlBQU4sQ0FBbUIsTUFBbkIsRUFBMkIsUUFBM0I7RUFFQS9FLFlBQUFBLElBQUksQ0FBQ3VCLFdBQUwsQ0FBaUJ5QixLQUFqQjtFQUNEOztFQUVEQSxVQUFBQSxLQUFLLENBQUNyVCxLQUFOLEdBQWNBLEtBQWQ7RUFDRCxTQWJHLENBQUo7RUFjRDs7RUFFRCxVQUFJcVMsR0FBSixFQUFTO0VBQ1BoQyxRQUFBQSxJQUFJLENBQUMrRSxZQUFMLENBQWtCLFFBQWxCLEVBQTRCL0MsR0FBNUI7RUFDRDs7RUFFRCxVQUFJb0QsTUFBSixFQUFZO0VBQ1ZwRixRQUFBQSxJQUFJLENBQUMrRSxZQUFMLENBQWtCLFFBQWxCLEVBQTRCSyxNQUE1QjtFQUNELE9BN0N3Qzs7O0VBZ0R6QyxVQUFJTyxZQUFZLEdBQUczRixJQUFJLENBQUNxQixhQUFMLG9DQUFuQjs7RUFFQSxVQUFJLENBQUNzRSxZQUFMLEVBQW1CO0VBQ2pCQSxRQUFBQSxZQUFZLEdBQUcsS0FBSzNZLEdBQUwsQ0FBU3NVLENBQVQsQ0FBVyxRQUFYLEVBQXFCO0VBQUUvUSxVQUFBQSxJQUFJLEVBQUU7RUFBUixTQUFyQixFQUF5QyxJQUF6QyxDQUFmO0VBQ0FvVixRQUFBQSxZQUFZLENBQUN0RixPQUFiLENBQXFCdUYsTUFBckIsR0FBOEIsSUFBOUI7RUFDQUQsUUFBQUEsWUFBWSxDQUFDRSxLQUFiLENBQW1CQyxPQUFuQixHQUE2QixNQUE3QjtFQUNBOUYsUUFBQUEsSUFBSSxDQUFDdUIsV0FBTCxDQUFpQm9FLFlBQWpCO0VBQ0Q7O0VBRURBLE1BQUFBLFlBQVksQ0FBQ0ksS0FBYjtFQUVBLGFBQU8sSUFBUDtFQUNEO0VBRUQ7RUFDRjtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOzs7O2FBQ0UsYUFBSS9ELEdBQUosRUFBU0MsT0FBVCxFQUFrQm9ELFlBQWxCLEVBQWdDO0VBQzlCLGFBQU8sS0FBS08sTUFBTCxDQUFZNUQsR0FBWixFQUFpQkMsT0FBakIsRUFBMEIsS0FBMUIsRUFBaUNvRCxZQUFqQyxDQUFQO0VBQ0Q7RUFFRDtFQUNGO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7Ozs7YUFDRSxjQUFLckQsR0FBTCxFQUFVQyxPQUFWLEVBQW1Cb0QsWUFBbkIsRUFBaUM7RUFDL0JBLE1BQUFBLFlBQVksR0FBR0EsWUFBWSxJQUFJLE1BQS9CO0VBRUEsYUFBTyxLQUFLTyxNQUFMLENBQVk1RCxHQUFaLEVBQWlCQyxPQUFqQixFQUEwQixNQUExQixFQUFrQ29ELFlBQWxDLENBQVA7RUFDRDtFQUVEO0VBQ0Y7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7Ozs7YUFDRSxhQUFJckQsR0FBSixFQUFTQyxPQUFULEVBQWtCO0VBQ2hCLGFBQU8sS0FBS08sSUFBTCxDQUFVUixHQUFWLEVBQWVDLE9BQWYsRUFBd0IsS0FBeEIsQ0FBUDtFQUNEO0VBRUQ7RUFDRjtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7OzthQUNFLGVBQU1ELEdBQU4sRUFBV0MsT0FBWCxFQUFvQjtFQUNsQixhQUFPLEtBQUtPLElBQUwsQ0FBVVIsR0FBVixFQUFlQyxPQUFmLEVBQXdCLE9BQXhCLENBQVA7RUFDRDtFQUVEO0VBQ0Y7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7Ozs7YUFDRSxpQkFBT0QsR0FBUCxFQUFZQyxPQUFaLEVBQXFCO0VBQ25CLGFBQU8sS0FBS08sSUFBTCxDQUFVUixHQUFWLEVBQWVDLE9BQWYsRUFBd0IsUUFBeEIsQ0FBUDtFQUNEO0VBRUQ7RUFDRjtFQUNBO0VBQ0E7RUFDQTtFQUNBOzs7O2FBQ0UsdUJBQXFCK0QsRUFBckIsRUFBeUI7RUFDdkIsVUFBTUMsUUFBUSxHQUFHLEVBQWpCOztFQUVBLFdBQUssSUFBSW5DLENBQVQsSUFBY2tDLEVBQWQsRUFBa0I7RUFDaEIsWUFBSSxDQUFDQSxFQUFFLENBQUNwYyxjQUFILENBQWtCa2EsQ0FBbEIsQ0FBTCxFQUEyQjtFQUN6QjtFQUNEOztFQUVELFlBQUksUUFBUWtDLEVBQUUsQ0FBQ2xDLENBQUQsQ0FBVixNQUFtQixRQUFuQixJQUErQmtDLEVBQUUsQ0FBQ2xDLENBQUQsQ0FBRixJQUFTLElBQTVDLEVBQWtEO0VBQ2hELGNBQU1vQyxVQUFVLEdBQUcsS0FBS1YsYUFBTCxDQUFtQlEsRUFBRSxDQUFDbEMsQ0FBRCxDQUFyQixDQUFuQjs7RUFFQSxlQUFLLElBQUlxQyxDQUFULElBQWNELFVBQWQsRUFBMEI7RUFDeEIsZ0JBQUksQ0FBQ0EsVUFBVSxDQUFDdGMsY0FBWCxDQUEwQnVjLENBQTFCLENBQUwsRUFBbUM7RUFDakM7RUFDRDs7RUFFREYsWUFBQUEsUUFBUSxDQUFDbkMsQ0FBQyxHQUFHLEdBQUosR0FBVXFDLENBQVgsQ0FBUixHQUF3QkQsVUFBVSxDQUFDQyxDQUFELENBQWxDO0VBQ0Q7RUFDRixTQVZELE1BVU87RUFDTEYsVUFBQUEsUUFBUSxDQUFDbkMsQ0FBRCxDQUFSLEdBQWNrQyxFQUFFLENBQUNsQyxDQUFELENBQWhCO0VBQ0Q7RUFDRjs7RUFDRCxhQUFPbUMsUUFBUDtFQUNEOzs7YUFFRCx3QkFBc0JqRixLQUF0QixFQUE2QjtFQUMzQixVQUFNb0YsS0FBSyxHQUFHcEYsS0FBSyxDQUFDMkMsS0FBTixDQUFZLEdBQVosQ0FBZDtFQUVBLFVBQU0wQyxLQUFLLEdBQUdELEtBQUssQ0FBQ0UsS0FBTixFQUFkO0VBRUEsYUFBT0QsS0FBSyxHQUFHRCxLQUFLLENBQUN4SyxHQUFOLENBQVUsVUFBQXlELElBQUk7RUFBQSwwQkFBUUEsSUFBUjtFQUFBLE9BQWQsRUFBK0JrSCxJQUEvQixDQUFvQyxFQUFwQyxDQUFmO0VBQ0Q7Ozs7OztFQ3JSSDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7TUFFcUJDOzs7Ozs7O2FBQ25CLGlCQUFleFosR0FBZixFQUFvQjtFQUNsQkEsTUFBQUEsR0FBRyxVQUFILEdBQWEsY0FBYjtFQUNEOzs7YUFFRCxpQkFBY3laLEdBQWQsRUFBbUI7RUFDakIsVUFBTTViLENBQUMsR0FBR3FELE1BQU0sQ0FBQ3dZLE1BQWpCO0VBRUEsYUFBTzdiLENBQUMsVUFBRCxDQUFTNGIsR0FBVCxDQUFQO0VBQ0Q7Ozs7OztFQ2hCSDtFQUVBLENBQUMsWUFBVzs7RUFHUixNQUFJRSxFQUFFLEdBQUc7RUFDTEMsSUFBQUEsVUFBVSxFQUFFLE1BRFA7RUFFTEMsSUFBQUEsUUFBUSxFQUFFLE1BRkw7RUFHTEMsSUFBQUEsUUFBUSxFQUFFLE1BSEw7RUFJTEMsSUFBQUEsYUFBYSxFQUFFLE1BSlY7RUFLTEMsSUFBQUEsTUFBTSxFQUFFLFNBTEg7RUFNTEMsSUFBQUEsV0FBVyxFQUFFLGNBTlI7RUFPTEMsSUFBQUEsSUFBSSxFQUFFLEtBUEQ7RUFRTEMsSUFBQUEsUUFBUSxFQUFFLE1BUkw7RUFTTEMsSUFBQUEsSUFBSSxFQUFFLFdBVEQ7RUFVTEMsSUFBQUEsTUFBTSxFQUFFLFVBVkg7RUFXTEMsSUFBQUEsV0FBVyxFQUFFLDBGQVhSO0VBWUxuVixJQUFBQSxHQUFHLEVBQUUscUJBWkE7RUFhTG9WLElBQUFBLFVBQVUsRUFBRSx1QkFiUDtFQWNMQyxJQUFBQSxZQUFZLEVBQUUsWUFkVDtFQWVMQyxJQUFBQSxJQUFJLEVBQUU7RUFmRCxHQUFUOztFQWtCQSxXQUFTQyxPQUFULENBQWlCdlYsR0FBakIsRUFBc0I7RUFDbEI7RUFDQSxXQUFPd1YsY0FBYyxDQUFDQyxhQUFhLENBQUN6VixHQUFELENBQWQsRUFBcUJxQixTQUFyQixDQUFyQjtFQUNIOztFQUVELFdBQVNxVSxRQUFULENBQWtCQyxHQUFsQixFQUF1QkMsSUFBdkIsRUFBNkI7RUFDekIsV0FBT0wsT0FBTyxDQUFDdGUsS0FBUixDQUFjLElBQWQsRUFBb0IsQ0FBQzBlLEdBQUQsRUFBTUUsTUFBTixDQUFhRCxJQUFJLElBQUksRUFBckIsQ0FBcEIsQ0FBUDtFQUNIOztFQUVELFdBQVNKLGNBQVQsQ0FBd0JNLFVBQXhCLEVBQW9DRixJQUFwQyxFQUEwQztFQUN0QyxRQUFJRyxNQUFNLEdBQUcsQ0FBYjtFQUFBLFFBQWdCQyxXQUFXLEdBQUdGLFVBQVUsQ0FBQ3hWLE1BQXpDO0VBQUEsUUFBaUQrRyxHQUFqRDtFQUFBLFFBQXNENE8sTUFBTSxHQUFHLEVBQS9EO0VBQUEsUUFBbUV0RSxDQUFuRTtFQUFBLFFBQXNFdUUsQ0FBdEU7RUFBQSxRQUF5RUMsRUFBekU7RUFBQSxRQUE2RUMsR0FBN0U7RUFBQSxRQUFrRkMsYUFBbEY7RUFBQSxRQUFpR0MsVUFBakc7RUFBQSxRQUE2R0MsV0FBN0c7RUFBQSxRQUEwSGpCLElBQTFIOztFQUNBLFNBQUszRCxDQUFDLEdBQUcsQ0FBVCxFQUFZQSxDQUFDLEdBQUdxRSxXQUFoQixFQUE2QnJFLENBQUMsRUFBOUIsRUFBa0M7RUFDOUIsVUFBSSxPQUFPbUUsVUFBVSxDQUFDbkUsQ0FBRCxDQUFqQixLQUF5QixRQUE3QixFQUF1QztFQUNuQ3NFLFFBQUFBLE1BQU0sSUFBSUgsVUFBVSxDQUFDbkUsQ0FBRCxDQUFwQjtFQUNILE9BRkQsTUFHSyxJQUFJLFFBQU9tRSxVQUFVLENBQUNuRSxDQUFELENBQWpCLE1BQXlCLFFBQTdCLEVBQXVDO0VBQ3hDd0UsUUFBQUEsRUFBRSxHQUFHTCxVQUFVLENBQUNuRSxDQUFELENBQWYsQ0FEd0M7O0VBRXhDLFlBQUl3RSxFQUFFLENBQUNwWCxJQUFQLEVBQWE7RUFBRTtFQUNYc0ksVUFBQUEsR0FBRyxHQUFHdU8sSUFBSSxDQUFDRyxNQUFELENBQVY7O0VBQ0EsZUFBS0csQ0FBQyxHQUFHLENBQVQsRUFBWUEsQ0FBQyxHQUFHQyxFQUFFLENBQUNwWCxJQUFILENBQVF1QixNQUF4QixFQUFnQzRWLENBQUMsRUFBakMsRUFBcUM7RUFDakMsZ0JBQUk3TyxHQUFHLElBQUlyTixTQUFYLEVBQXNCO0VBQ2xCLG9CQUFNLElBQUlVLEtBQUosQ0FBVTZhLE9BQU8sQ0FBQywrREFBRCxFQUFrRVksRUFBRSxDQUFDcFgsSUFBSCxDQUFRbVgsQ0FBUixDQUFsRSxFQUE4RUMsRUFBRSxDQUFDcFgsSUFBSCxDQUFRbVgsQ0FBQyxHQUFDLENBQVYsQ0FBOUUsQ0FBakIsQ0FBTjtFQUNIOztFQUNEN08sWUFBQUEsR0FBRyxHQUFHQSxHQUFHLENBQUM4TyxFQUFFLENBQUNwWCxJQUFILENBQVFtWCxDQUFSLENBQUQsQ0FBVDtFQUNIO0VBQ0osU0FSRCxNQVNLLElBQUlDLEVBQUUsQ0FBQ0ssUUFBUCxFQUFpQjtFQUFFO0VBQ3BCblAsVUFBQUEsR0FBRyxHQUFHdU8sSUFBSSxDQUFDTyxFQUFFLENBQUNLLFFBQUosQ0FBVjtFQUNILFNBRkksTUFHQTtFQUFFO0VBQ0huUCxVQUFBQSxHQUFHLEdBQUd1TyxJQUFJLENBQUNHLE1BQU0sRUFBUCxDQUFWO0VBQ0g7O0VBRUQsWUFBSXZCLEVBQUUsQ0FBQ0csUUFBSCxDQUFZOVUsSUFBWixDQUFpQnNXLEVBQUUsQ0FBQy9YLElBQXBCLEtBQTZCb1csRUFBRSxDQUFDSSxhQUFILENBQWlCL1UsSUFBakIsQ0FBc0JzVyxFQUFFLENBQUMvWCxJQUF6QixDQUE3QixJQUErRGlKLEdBQUcsWUFBWXJLLFFBQWxGLEVBQTRGO0VBQ3hGcUssVUFBQUEsR0FBRyxHQUFHQSxHQUFHLEVBQVQ7RUFDSDs7RUFFRCxZQUFJbU4sRUFBRSxDQUFDTSxXQUFILENBQWVqVixJQUFmLENBQW9Cc1csRUFBRSxDQUFDL1gsSUFBdkIsS0FBaUMsT0FBT2lKLEdBQVAsS0FBZSxRQUFmLElBQTJCb1AsS0FBSyxDQUFDcFAsR0FBRCxDQUFyRSxFQUE2RTtFQUN6RSxnQkFBTSxJQUFJcVAsU0FBSixDQUFjbkIsT0FBTyxDQUFDLHlDQUFELEVBQTRDbE8sR0FBNUMsQ0FBckIsQ0FBTjtFQUNIOztFQUVELFlBQUltTixFQUFFLENBQUNLLE1BQUgsQ0FBVWhWLElBQVYsQ0FBZXNXLEVBQUUsQ0FBQy9YLElBQWxCLENBQUosRUFBNkI7RUFDekJtWSxVQUFBQSxXQUFXLEdBQUdsUCxHQUFHLElBQUksQ0FBckI7RUFDSDs7RUFFRCxnQkFBUThPLEVBQUUsQ0FBQy9YLElBQVg7RUFDSSxlQUFLLEdBQUw7RUFDSWlKLFlBQUFBLEdBQUcsR0FBR3NQLFFBQVEsQ0FBQ3RQLEdBQUQsRUFBTSxFQUFOLENBQVIsQ0FBa0JqSyxRQUFsQixDQUEyQixDQUEzQixDQUFOO0VBQ0E7O0VBQ0osZUFBSyxHQUFMO0VBQ0lpSyxZQUFBQSxHQUFHLEdBQUdGLE1BQU0sQ0FBQ3lQLFlBQVAsQ0FBb0JELFFBQVEsQ0FBQ3RQLEdBQUQsRUFBTSxFQUFOLENBQTVCLENBQU47RUFDQTs7RUFDSixlQUFLLEdBQUw7RUFDQSxlQUFLLEdBQUw7RUFDSUEsWUFBQUEsR0FBRyxHQUFHc1AsUUFBUSxDQUFDdFAsR0FBRCxFQUFNLEVBQU4sQ0FBZDtFQUNBOztFQUNKLGVBQUssR0FBTDtFQUNJQSxZQUFBQSxHQUFHLEdBQUd3UCxJQUFJLENBQUNDLFNBQUwsQ0FBZXpQLEdBQWYsRUFBb0IsSUFBcEIsRUFBMEI4TyxFQUFFLENBQUNZLEtBQUgsR0FBV0osUUFBUSxDQUFDUixFQUFFLENBQUNZLEtBQUosQ0FBbkIsR0FBZ0MsQ0FBMUQsQ0FBTjtFQUNBOztFQUNKLGVBQUssR0FBTDtFQUNJMVAsWUFBQUEsR0FBRyxHQUFHOE8sRUFBRSxDQUFDYSxTQUFILEdBQWVDLFVBQVUsQ0FBQzVQLEdBQUQsQ0FBVixDQUFnQjZQLGFBQWhCLENBQThCZixFQUFFLENBQUNhLFNBQWpDLENBQWYsR0FBNkRDLFVBQVUsQ0FBQzVQLEdBQUQsQ0FBVixDQUFnQjZQLGFBQWhCLEVBQW5FO0VBQ0E7O0VBQ0osZUFBSyxHQUFMO0VBQ0k3UCxZQUFBQSxHQUFHLEdBQUc4TyxFQUFFLENBQUNhLFNBQUgsR0FBZUMsVUFBVSxDQUFDNVAsR0FBRCxDQUFWLENBQWdCOFAsT0FBaEIsQ0FBd0JoQixFQUFFLENBQUNhLFNBQTNCLENBQWYsR0FBdURDLFVBQVUsQ0FBQzVQLEdBQUQsQ0FBdkU7RUFDQTs7RUFDSixlQUFLLEdBQUw7RUFDSUEsWUFBQUEsR0FBRyxHQUFHOE8sRUFBRSxDQUFDYSxTQUFILEdBQWU3UCxNQUFNLENBQUNpUSxNQUFNLENBQUMvUCxHQUFHLENBQUNnUSxXQUFKLENBQWdCbEIsRUFBRSxDQUFDYSxTQUFuQixDQUFELENBQVAsQ0FBckIsR0FBK0RDLFVBQVUsQ0FBQzVQLEdBQUQsQ0FBL0U7RUFDQTs7RUFDSixlQUFLLEdBQUw7RUFDSUEsWUFBQUEsR0FBRyxHQUFHLENBQUNzUCxRQUFRLENBQUN0UCxHQUFELEVBQU0sRUFBTixDQUFSLEtBQXNCLENBQXZCLEVBQTBCakssUUFBMUIsQ0FBbUMsQ0FBbkMsQ0FBTjtFQUNBOztFQUNKLGVBQUssR0FBTDtFQUNJaUssWUFBQUEsR0FBRyxHQUFHRixNQUFNLENBQUNFLEdBQUQsQ0FBWjtFQUNBQSxZQUFBQSxHQUFHLEdBQUk4TyxFQUFFLENBQUNhLFNBQUgsR0FBZTNQLEdBQUcsQ0FBQ2lRLFNBQUosQ0FBYyxDQUFkLEVBQWlCbkIsRUFBRSxDQUFDYSxTQUFwQixDQUFmLEdBQWdEM1AsR0FBdkQ7RUFDQTs7RUFDSixlQUFLLEdBQUw7RUFDSUEsWUFBQUEsR0FBRyxHQUFHRixNQUFNLENBQUMsQ0FBQyxDQUFDRSxHQUFILENBQVo7RUFDQUEsWUFBQUEsR0FBRyxHQUFJOE8sRUFBRSxDQUFDYSxTQUFILEdBQWUzUCxHQUFHLENBQUNpUSxTQUFKLENBQWMsQ0FBZCxFQUFpQm5CLEVBQUUsQ0FBQ2EsU0FBcEIsQ0FBZixHQUFnRDNQLEdBQXZEO0VBQ0E7O0VBQ0osZUFBSyxHQUFMO0VBQ0lBLFlBQUFBLEdBQUcsR0FBR3pQLE1BQU0sQ0FBQ1AsU0FBUCxDQUFpQitGLFFBQWpCLENBQTBCTSxJQUExQixDQUErQjJKLEdBQS9CLEVBQW9DeUQsS0FBcEMsQ0FBMEMsQ0FBMUMsRUFBNkMsQ0FBQyxDQUE5QyxFQUFpRHFELFdBQWpELEVBQU47RUFDQTlHLFlBQUFBLEdBQUcsR0FBSThPLEVBQUUsQ0FBQ2EsU0FBSCxHQUFlM1AsR0FBRyxDQUFDaVEsU0FBSixDQUFjLENBQWQsRUFBaUJuQixFQUFFLENBQUNhLFNBQXBCLENBQWYsR0FBZ0QzUCxHQUF2RDtFQUNBOztFQUNKLGVBQUssR0FBTDtFQUNJQSxZQUFBQSxHQUFHLEdBQUdzUCxRQUFRLENBQUN0UCxHQUFELEVBQU0sRUFBTixDQUFSLEtBQXNCLENBQTVCO0VBQ0E7O0VBQ0osZUFBSyxHQUFMO0VBQ0lBLFlBQUFBLEdBQUcsR0FBR0EsR0FBRyxDQUFDa1EsT0FBSixFQUFOO0VBQ0FsUSxZQUFBQSxHQUFHLEdBQUk4TyxFQUFFLENBQUNhLFNBQUgsR0FBZTNQLEdBQUcsQ0FBQ2lRLFNBQUosQ0FBYyxDQUFkLEVBQWlCbkIsRUFBRSxDQUFDYSxTQUFwQixDQUFmLEdBQWdEM1AsR0FBdkQ7RUFDQTs7RUFDSixlQUFLLEdBQUw7RUFDSUEsWUFBQUEsR0FBRyxHQUFHLENBQUNzUCxRQUFRLENBQUN0UCxHQUFELEVBQU0sRUFBTixDQUFSLEtBQXNCLENBQXZCLEVBQTBCakssUUFBMUIsQ0FBbUMsRUFBbkMsQ0FBTjtFQUNBOztFQUNKLGVBQUssR0FBTDtFQUNJaUssWUFBQUEsR0FBRyxHQUFHLENBQUNzUCxRQUFRLENBQUN0UCxHQUFELEVBQU0sRUFBTixDQUFSLEtBQXNCLENBQXZCLEVBQTBCakssUUFBMUIsQ0FBbUMsRUFBbkMsRUFBdUNvYSxXQUF2QyxFQUFOO0VBQ0E7RUFsRFI7O0VBb0RBLFlBQUloRCxFQUFFLENBQUNPLElBQUgsQ0FBUWxWLElBQVIsQ0FBYXNXLEVBQUUsQ0FBQy9YLElBQWhCLENBQUosRUFBMkI7RUFDdkI2WCxVQUFBQSxNQUFNLElBQUk1TyxHQUFWO0VBQ0gsU0FGRCxNQUdLO0VBQ0QsY0FBSW1OLEVBQUUsQ0FBQ0ssTUFBSCxDQUFVaFYsSUFBVixDQUFlc1csRUFBRSxDQUFDL1gsSUFBbEIsTUFBNEIsQ0FBQ21ZLFdBQUQsSUFBZ0JKLEVBQUUsQ0FBQ2IsSUFBL0MsQ0FBSixFQUEwRDtFQUN0REEsWUFBQUEsSUFBSSxHQUFHaUIsV0FBVyxHQUFHLEdBQUgsR0FBUyxHQUEzQjtFQUNBbFAsWUFBQUEsR0FBRyxHQUFHQSxHQUFHLENBQUNqSyxRQUFKLEdBQWVzQyxPQUFmLENBQXVCOFUsRUFBRSxDQUFDYyxJQUExQixFQUFnQyxFQUFoQyxDQUFOO0VBQ0gsV0FIRCxNQUlLO0VBQ0RBLFlBQUFBLElBQUksR0FBRyxFQUFQO0VBQ0g7O0VBQ0RlLFVBQUFBLGFBQWEsR0FBR0YsRUFBRSxDQUFDc0IsUUFBSCxHQUFjdEIsRUFBRSxDQUFDc0IsUUFBSCxLQUFnQixHQUFoQixHQUFzQixHQUF0QixHQUE0QnRCLEVBQUUsQ0FBQ3NCLFFBQUgsQ0FBWUMsTUFBWixDQUFtQixDQUFuQixDQUExQyxHQUFrRSxHQUFsRjtFQUNBcEIsVUFBQUEsVUFBVSxHQUFHSCxFQUFFLENBQUNZLEtBQUgsR0FBVyxDQUFDekIsSUFBSSxHQUFHak8sR0FBUixFQUFhL0csTUFBckM7RUFDQThWLFVBQUFBLEdBQUcsR0FBR0QsRUFBRSxDQUFDWSxLQUFILEdBQVlULFVBQVUsR0FBRyxDQUFiLEdBQWlCRCxhQUFhLENBQUNzQixNQUFkLENBQXFCckIsVUFBckIsQ0FBakIsR0FBb0QsRUFBaEUsR0FBc0UsRUFBNUU7RUFDQUwsVUFBQUEsTUFBTSxJQUFJRSxFQUFFLENBQUN5QixLQUFILEdBQVd0QyxJQUFJLEdBQUdqTyxHQUFQLEdBQWErTyxHQUF4QixHQUErQkMsYUFBYSxLQUFLLEdBQWxCLEdBQXdCZixJQUFJLEdBQUdjLEdBQVAsR0FBYS9PLEdBQXJDLEdBQTJDK08sR0FBRyxHQUFHZCxJQUFOLEdBQWFqTyxHQUFqRztFQUNIO0VBQ0o7RUFDSjs7RUFDRCxXQUFPNE8sTUFBUDtFQUNIOztFQUVELE1BQUk0QixhQUFhLEdBQUdqZ0IsTUFBTSxDQUFDdUksTUFBUCxDQUFjLElBQWQsQ0FBcEI7O0VBRUEsV0FBU3NWLGFBQVQsQ0FBdUJFLEdBQXZCLEVBQTRCO0VBQ3hCLFFBQUlrQyxhQUFhLENBQUNsQyxHQUFELENBQWpCLEVBQXdCO0VBQ3BCLGFBQU9rQyxhQUFhLENBQUNsQyxHQUFELENBQXBCO0VBQ0g7O0VBRUQsUUFBSW1DLElBQUksR0FBR25DLEdBQVg7RUFBQSxRQUFnQm9DLEtBQWhCO0VBQUEsUUFBdUJqQyxVQUFVLEdBQUcsRUFBcEM7RUFBQSxRQUF3Q2tDLFNBQVMsR0FBRyxDQUFwRDs7RUFDQSxXQUFPRixJQUFQLEVBQWE7RUFDVCxVQUFJLENBQUNDLEtBQUssR0FBR3ZELEVBQUUsQ0FBQ1MsSUFBSCxDQUFRblcsSUFBUixDQUFhZ1osSUFBYixDQUFULE1BQWlDLElBQXJDLEVBQTJDO0VBQ3ZDaEMsUUFBQUEsVUFBVSxDQUFDN2IsSUFBWCxDQUFnQjhkLEtBQUssQ0FBQyxDQUFELENBQXJCO0VBQ0gsT0FGRCxNQUdLLElBQUksQ0FBQ0EsS0FBSyxHQUFHdkQsRUFBRSxDQUFDVSxNQUFILENBQVVwVyxJQUFWLENBQWVnWixJQUFmLENBQVQsTUFBbUMsSUFBdkMsRUFBNkM7RUFDOUNoQyxRQUFBQSxVQUFVLENBQUM3YixJQUFYLENBQWdCLEdBQWhCO0VBQ0gsT0FGSSxNQUdBLElBQUksQ0FBQzhkLEtBQUssR0FBR3ZELEVBQUUsQ0FBQ1csV0FBSCxDQUFlclcsSUFBZixDQUFvQmdaLElBQXBCLENBQVQsTUFBd0MsSUFBNUMsRUFBa0Q7RUFDbkQsWUFBSUMsS0FBSyxDQUFDLENBQUQsQ0FBVCxFQUFjO0VBQ1ZDLFVBQUFBLFNBQVMsSUFBSSxDQUFiO0VBQ0EsY0FBSUMsVUFBVSxHQUFHLEVBQWpCO0VBQUEsY0FBcUJDLGlCQUFpQixHQUFHSCxLQUFLLENBQUMsQ0FBRCxDQUE5QztFQUFBLGNBQW1ESSxXQUFXLEdBQUcsRUFBakU7O0VBQ0EsY0FBSSxDQUFDQSxXQUFXLEdBQUczRCxFQUFFLENBQUN4VSxHQUFILENBQU9sQixJQUFQLENBQVlvWixpQkFBWixDQUFmLE1BQW1ELElBQXZELEVBQTZEO0VBQ3pERCxZQUFBQSxVQUFVLENBQUNoZSxJQUFYLENBQWdCa2UsV0FBVyxDQUFDLENBQUQsQ0FBM0I7O0VBQ0EsbUJBQU8sQ0FBQ0QsaUJBQWlCLEdBQUdBLGlCQUFpQixDQUFDWixTQUFsQixDQUE0QmEsV0FBVyxDQUFDLENBQUQsQ0FBWCxDQUFlN1gsTUFBM0MsQ0FBckIsTUFBNkUsRUFBcEYsRUFBd0Y7RUFDcEYsa0JBQUksQ0FBQzZYLFdBQVcsR0FBRzNELEVBQUUsQ0FBQ1ksVUFBSCxDQUFjdFcsSUFBZCxDQUFtQm9aLGlCQUFuQixDQUFmLE1BQTBELElBQTlELEVBQW9FO0VBQ2hFRCxnQkFBQUEsVUFBVSxDQUFDaGUsSUFBWCxDQUFnQmtlLFdBQVcsQ0FBQyxDQUFELENBQTNCO0VBQ0gsZUFGRCxNQUdLLElBQUksQ0FBQ0EsV0FBVyxHQUFHM0QsRUFBRSxDQUFDYSxZQUFILENBQWdCdlcsSUFBaEIsQ0FBcUJvWixpQkFBckIsQ0FBZixNQUE0RCxJQUFoRSxFQUFzRTtFQUN2RUQsZ0JBQUFBLFVBQVUsQ0FBQ2hlLElBQVgsQ0FBZ0JrZSxXQUFXLENBQUMsQ0FBRCxDQUEzQjtFQUNILGVBRkksTUFHQTtFQUNELHNCQUFNLElBQUlDLFdBQUosQ0FBZ0IsOENBQWhCLENBQU47RUFDSDtFQUNKO0VBQ0osV0FiRCxNQWNLO0VBQ0Qsa0JBQU0sSUFBSUEsV0FBSixDQUFnQiw4Q0FBaEIsQ0FBTjtFQUNIOztFQUNETCxVQUFBQSxLQUFLLENBQUMsQ0FBRCxDQUFMLEdBQVdFLFVBQVg7RUFDSCxTQXJCRCxNQXNCSztFQUNERCxVQUFBQSxTQUFTLElBQUksQ0FBYjtFQUNIOztFQUNELFlBQUlBLFNBQVMsS0FBSyxDQUFsQixFQUFxQjtFQUNqQixnQkFBTSxJQUFJdGQsS0FBSixDQUFVLDJFQUFWLENBQU47RUFDSDs7RUFFRG9iLFFBQUFBLFVBQVUsQ0FBQzdiLElBQVgsQ0FDSTtFQUNJa2IsVUFBQUEsV0FBVyxFQUFFNEMsS0FBSyxDQUFDLENBQUQsQ0FEdEI7RUFFSXZCLFVBQUFBLFFBQVEsRUFBS3VCLEtBQUssQ0FBQyxDQUFELENBRnRCO0VBR0loWixVQUFBQSxJQUFJLEVBQVNnWixLQUFLLENBQUMsQ0FBRCxDQUh0QjtFQUlJekMsVUFBQUEsSUFBSSxFQUFTeUMsS0FBSyxDQUFDLENBQUQsQ0FKdEI7RUFLSU4sVUFBQUEsUUFBUSxFQUFLTSxLQUFLLENBQUMsQ0FBRCxDQUx0QjtFQU1JSCxVQUFBQSxLQUFLLEVBQVFHLEtBQUssQ0FBQyxDQUFELENBTnRCO0VBT0loQixVQUFBQSxLQUFLLEVBQVFnQixLQUFLLENBQUMsQ0FBRCxDQVB0QjtFQVFJZixVQUFBQSxTQUFTLEVBQUllLEtBQUssQ0FBQyxDQUFELENBUnRCO0VBU0kzWixVQUFBQSxJQUFJLEVBQVMyWixLQUFLLENBQUMsQ0FBRDtFQVR0QixTQURKO0VBYUgsT0EzQ0ksTUE0Q0E7RUFDRCxjQUFNLElBQUlLLFdBQUosQ0FBZ0Isa0NBQWhCLENBQU47RUFDSDs7RUFDRE4sTUFBQUEsSUFBSSxHQUFHQSxJQUFJLENBQUNSLFNBQUwsQ0FBZVMsS0FBSyxDQUFDLENBQUQsQ0FBTCxDQUFTelgsTUFBeEIsQ0FBUDtFQUNIOztFQUNELFdBQU91WCxhQUFhLENBQUNsQyxHQUFELENBQWIsR0FBcUJHLFVBQTVCO0VBQ0g7RUFFRDtFQUNKO0VBQ0E7O0VBQ0k7OztFQUNBLE1BQUksT0FBTzNSLE9BQVAsS0FBbUIsV0FBdkIsRUFBb0M7RUFDaENBLElBQUFBLE9BQU8sQ0FBQyxTQUFELENBQVAsR0FBcUJvUixPQUFyQjtFQUNBcFIsSUFBQUEsT0FBTyxDQUFDLFVBQUQsQ0FBUCxHQUFzQnVSLFFBQXRCO0VBQ0g7O0VBQ0QsTUFBSSxPQUFPM1osTUFBUCxLQUFrQixXQUF0QixFQUFtQztFQUMvQkEsSUFBQUEsTUFBTSxDQUFDLFNBQUQsQ0FBTixHQUFvQndaLE9BQXBCO0VBQ0F4WixJQUFBQSxNQUFNLENBQUMsVUFBRCxDQUFOLEdBQXFCMlosUUFBckI7O0VBRUEsUUFBSSxPQUFPMkMsTUFBUCxLQUFrQixVQUFsQixJQUFnQ0EsTUFBTSxDQUFDLEtBQUQsQ0FBMUMsRUFBbUQ7RUFDL0NBLE1BQUFBLE1BQU0sQ0FBQyxZQUFXO0VBQ2QsZUFBTztFQUNILHFCQUFXOUMsT0FEUjtFQUVILHNCQUFZRztFQUZULFNBQVA7RUFJSCxPQUxLLENBQU47RUFNSDtFQUNKO0VBQ0Q7O0VBQ0gsQ0FwT0EsRUFBRDs7TUNRcUI0QztFQXNCbkIseUJBQVl6ZCxHQUFaLEVBQWlCO0VBQUE7O0VBQ2YsU0FBS0EsR0FBTCxHQUFXQSxHQUFYO0VBQ0EsU0FBS0ssV0FBTCxHQUFtQixJQUFuQjtFQUNEOzs7O2FBRUQsbUJBQVVzUyxHQUFWLEVBQWU7RUFDZCxVQUFJLE9BQU9BLEdBQVAsS0FBZSxRQUFuQixFQUE2QjtFQUMzQkEsUUFBQUEsR0FBRyxHQUFHaUYsUUFBUSxDQUFDdkQsYUFBVCxDQUF1QjFCLEdBQXZCLENBQU47RUFDRDs7RUFFRCxhQUFPSixXQUFXLENBQUNJLEdBQUQsQ0FBbEI7RUFDQTs7O2FBRUQsbUJBQVVBLEdBQVYsRUFBZXBULFFBQWYsRUFBeUI7RUFDdkIsVUFBSSxPQUFPb1QsR0FBUCxLQUFlLFFBQW5CLEVBQTZCO0VBQzNCQSxRQUFBQSxHQUFHLEdBQUdpRixRQUFRLENBQUNoRSxnQkFBVCxDQUEwQmpCLEdBQTFCLENBQU47RUFDRDs7RUFFRCxVQUFNK0ssU0FBUyxHQUFHLEdBQUd6TixLQUFILENBQVNwTixJQUFULENBQWM4UCxHQUFkLENBQWxCOztFQUVBLFVBQUlwVCxRQUFKLEVBQWM7RUFDWixlQUFPbWUsU0FBUyxDQUFDOU8sR0FBVixDQUFjclAsUUFBZCxDQUFQO0VBQ0Q7O0VBRUQsYUFBT21lLFNBQVA7RUFDRDs7O2FBRUQsV0FBRTljLE9BQUYsRUFBdUM7RUFBQSxVQUE1QitjLEtBQTRCLHVFQUFwQixFQUFvQjtFQUFBLFVBQWhCQyxPQUFnQix1RUFBTixJQUFNO0VBQ3JDLFVBQU1qTCxHQUFHLEdBQUdpRixRQUFRLENBQUNDLGFBQVQsQ0FBdUJqWCxPQUF2QixDQUFaOztFQUVBLFdBQUssSUFBSWtXLENBQVQsSUFBYzZHLEtBQWQsRUFBcUI7RUFDbkIsWUFBTUUsQ0FBQyxHQUFHRixLQUFLLENBQUM3RyxDQUFELENBQWY7RUFFQW5FLFFBQUFBLEdBQUcsQ0FBQ29GLFlBQUosQ0FBaUJqQixDQUFqQixFQUFvQitHLENBQXBCO0VBQ0Q7O0VBRUQsVUFBSUQsT0FBTyxLQUFLLElBQWhCLEVBQXNCO0VBQ3BCakwsUUFBQUEsR0FBRyxDQUFDbUwsU0FBSixHQUFnQkYsT0FBaEI7RUFDRDs7RUFFRCxhQUFPakwsR0FBUDtFQUNEOzs7YUFFRCxhQUFJbFUsR0FBSixFQUFTc2YsSUFBVCxFQUFlO0VBQ2IsVUFBTTdaLElBQUksR0FBRzVGLEtBQUssQ0FBQ1EsT0FBTixDQUFjaWYsSUFBZCxJQUFzQkEsSUFBdEIsR0FBNkJBLElBQUksQ0FBQ3BILEtBQUwsQ0FBVyxHQUFYLENBQTFDOztFQUVBLFdBQUssSUFBSUcsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRzVTLElBQUksQ0FBQ3VCLE1BQXpCLEVBQWlDcVIsQ0FBQyxFQUFsQyxFQUFzQztFQUNwQyxZQUFNM1IsR0FBRyxHQUFHakIsSUFBSSxDQUFDNFMsQ0FBRCxDQUFoQjs7RUFFQSxZQUFJLENBQUNyWSxHQUFELElBQVEsQ0FBQ0EsR0FBRyxDQUFDN0IsY0FBSixDQUFtQnVJLEdBQW5CLENBQWIsRUFBc0M7RUFDcEMxRyxVQUFBQSxHQUFHLEdBQUdVLFNBQU47RUFDQTtFQUNEOztFQUVEVixRQUFBQSxHQUFHLEdBQUdBLEdBQUcsQ0FBQzBHLEdBQUQsQ0FBVDtFQUNEOztFQUVELGFBQU8xRyxHQUFQO0VBQ0Q7OzthQUVELGFBQUlBLEdBQUosRUFBU3NmLElBQVQsRUFBZXBiLEtBQWYsRUFBc0I7RUFDcEIsVUFBTXVCLElBQUksR0FBRzVGLEtBQUssQ0FBQ1EsT0FBTixDQUFjaWYsSUFBZCxJQUFzQkEsSUFBdEIsR0FBNkJBLElBQUksQ0FBQ3BILEtBQUwsQ0FBVyxHQUFYLENBQTFDO0VBQ0EsVUFBSUcsQ0FBSjs7RUFFQSxXQUFLQSxDQUFDLEdBQUcsQ0FBVCxFQUFZQSxDQUFDLEdBQUc1UyxJQUFJLENBQUN1QixNQUFMLEdBQWMsQ0FBOUIsRUFBaUNxUixDQUFDLEVBQWxDLEVBQXNDO0VBQ3BDLFlBQU0zUixHQUFHLEdBQUdqQixJQUFJLENBQUM0UyxDQUFELENBQWhCOztFQUVBLFlBQUksQ0FBQ3JZLEdBQUcsQ0FBQzdCLGNBQUosQ0FBbUJ1SSxHQUFuQixDQUFMLEVBQThCO0VBQzVCMUcsVUFBQUEsR0FBRyxDQUFDMEcsR0FBRCxDQUFILEdBQVcsRUFBWDtFQUNEOztFQUVEMUcsUUFBQUEsR0FBRyxHQUFHQSxHQUFHLENBQUMwRyxHQUFELENBQVQ7RUFDRDs7RUFFRDFHLE1BQUFBLEdBQUcsQ0FBQ3lGLElBQUksQ0FBQzRTLENBQUQsQ0FBTCxDQUFILEdBQWVuVSxLQUFmO0VBRUEsYUFBT0EsS0FBUDtFQUNEOzs7YUFFRCxtQkFBVTtFQUNSLGFBQU9xYixPQUFPLENBQUMsS0FBS2hlLEdBQUwsQ0FBU3VOLElBQVQsQ0FBYyxrQkFBZCxDQUFELENBQWQ7RUFDRDtFQUVEO0VBQ0Y7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOzs7Ozs7Ozs7Ozs7OztRQUNFLFVBQVFrSSxPQUFSLEVBQWlCO0VBQ2ZBLE1BQUFBLE9BQU8sR0FBR0EsT0FBTyxJQUFJLGVBQXJCO0VBRUEsYUFBTyxJQUFJalYsT0FBSixDQUFZLFVBQUN5ZCxPQUFELEVBQWE7RUFDOUJBLFFBQUFBLE9BQU8sQ0FBQ3RJLE9BQU8sQ0FBQ0YsT0FBRCxDQUFSLENBQVA7RUFDRCxPQUZNLENBQVA7RUFHRDtFQUdEO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7Ozs7YUFFQSxvQkFBV3lJLEdBQVgsRUFBK0I7RUFBQSxVQUFmM2EsSUFBZSx1RUFBUixNQUFROztFQUM3QixVQUFJMmEsR0FBRyxDQUFDbEcsTUFBSixDQUFXLENBQVgsRUFBYyxDQUFkLE1BQXFCLEtBQXJCLElBQThCa0csR0FBRyxDQUFDbEcsTUFBSixDQUFXLENBQVgsRUFBYyxDQUFkLE1BQXFCLE1BQXZELEVBQStEO0VBQzdELGVBQU9rRyxHQUFQO0VBQ0Q7O0VBRUQsYUFBTyxLQUFLbGUsR0FBTCxDQUFTbWUsS0FBVCxDQUFlNWEsSUFBZixJQUF1QixHQUF2QixHQUE2QjJhLEdBQXBDO0VBQ0Q7RUFFRDtFQUNGO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDRTtFQUNBO0VBQ0E7O0VBRUE7RUFDRjtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7OzthQUNFLG1CQUFVbEosR0FBVixFQUE2QjtFQUFBLFVBQWRvSixJQUFjLHVFQUFQLEtBQU87RUFDM0IsYUFBTyxLQUFLL2QsV0FBTCxHQUFtQmEsTUFBTSxDQUFDbWQsV0FBUCxDQUFtQjtFQUFBLGVBQU1DLEtBQUssQ0FBQ3RKLEdBQUQsQ0FBWDtFQUFBLE9BQW5CLEVBQXFDb0osSUFBckMsQ0FBMUI7RUFDRDtFQUVEO0VBQ0Y7RUFDQTs7OzthQUNFLHlCQUFnQjtFQUNkRyxNQUFBQSxhQUFhLENBQUMsS0FBS2xlLFdBQU4sQ0FBYjtFQUVBLFdBQUtBLFdBQUwsR0FBb0IsSUFBcEI7RUFFQSxhQUFPLElBQVA7RUFDRDtFQUVEO0VBQ0Y7RUFDQTtFQUNBO0VBQ0E7Ozs7YUFDRSxvQkFBV21lLElBQVgsRUFBaUI7RUFDZixhQUFPLENBQUMscUJBQUQsRUFBd0IsS0FBS0MsV0FBTCxFQUF4QixFQUE0QzNHLE9BQTVDLENBQW9EMEcsSUFBcEQsTUFBOEQsQ0FBQyxDQUF0RTtFQUNEO0VBRUQ7RUFDRjtFQUNBO0VBQ0E7RUFDQTs7OzthQUNFLHVCQUFjO0VBQ1osYUFBTyxLQUFLeGUsR0FBTCxDQUFTdU4sSUFBVCxDQUFjLGNBQWQsRUFBOEIsT0FBOUIsQ0FBUDtFQUNEO0VBRUQ7RUFDRjtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOzs7O2FBQ0Usc0JBQWF5TSxNQUFiLEVBQXVFO0VBQUEsVUFBbEQwRSxRQUFrRCx1RUFBdkMsQ0FBdUM7RUFBQSxVQUFwQ0MsUUFBb0MsdUVBQXpCLEdBQXlCO0VBQUEsVUFBcEJDLFlBQW9CLHVFQUFMLEdBQUs7RUFDckVGLE1BQUFBLFFBQVEsR0FBR0EsUUFBUSxJQUFJLENBQXZCO0VBQ0ExRSxNQUFBQSxNQUFNLEdBQUdvQyxVQUFVLENBQUNwQyxNQUFELENBQW5CO0VBRUEsVUFBSTZFLGFBQWEsR0FBRy9XLElBQUksQ0FBQ2dYLEtBQUwsQ0FBV2hYLElBQUksQ0FBQ2lYLEdBQUwsQ0FBUy9FLE1BQVQsS0FBb0IsT0FBTzBFLFFBQTNCLENBQVgsSUFBbUQsRUFBdkU7RUFDQSxVQUFJTSxhQUFhLEdBQUdOLFFBQVEsR0FBR0csYUFBYSxDQUFDNU8sS0FBZCxDQUFvQixDQUFwQixFQUF1QnlPLFFBQVEsR0FBRyxDQUFDLENBQW5DLENBQUgsR0FBMkNHLGFBQXZFO0VBQ0EsVUFBSUksY0FBYyxHQUFHUCxRQUFRLEdBQUdHLGFBQWEsQ0FBQzVPLEtBQWQsQ0FBb0J5TyxRQUFRLEdBQUcsQ0FBQyxDQUFoQyxDQUFILEdBQXdDLEVBQXJFO0VBQ0EsVUFBSVEsZUFBZSxHQUFHLEVBQXRCOztFQUVBLGFBQU9GLGFBQWEsQ0FBQ3ZaLE1BQWQsR0FBdUIsQ0FBOUIsRUFBaUM7RUFDL0J5WixRQUFBQSxlQUFlLElBQUlOLFlBQVksR0FBR0ksYUFBYSxDQUFDL08sS0FBZCxDQUFvQixDQUFDLENBQXJCLENBQWxDO0VBQ0ErTyxRQUFBQSxhQUFhLEdBQUdBLGFBQWEsQ0FBQy9PLEtBQWQsQ0FBb0IsQ0FBcEIsRUFBdUIsQ0FBQyxDQUF4QixDQUFoQjtFQUNEOztFQUVELGFBQU8sQ0FBQytKLE1BQU0sR0FBRyxDQUFULEdBQWEsR0FBYixHQUFtQixFQUFwQixJQUEwQmdGLGFBQTFCLEdBQTBDRSxlQUExQyxJQUE2REQsY0FBYyxHQUFJTixRQUFRLEdBQUdNLGNBQWYsR0FBaUMsRUFBNUcsQ0FBUDtFQUNEOzs7V0FsUEQsZUFBZ0I7RUFBRSxhQUFPLFFBQVA7RUFBa0I7OzthQUVwQyxpQkFBZWpmLEdBQWYsRUFBa0M7RUFDaEMsVUFBTW1mLE1BQU0sR0FBR25mLEdBQUcsQ0FBQ29mLE9BQUosR0FBYyxJQUFJLElBQUosQ0FBU3BmLEdBQVQsQ0FBN0I7RUFFQUEsTUFBQUEsR0FBRyxDQUFDRyxTQUFKLEdBQWdCZ2YsTUFBTSxDQUFDaGYsU0FBUCxDQUFpQnFCLElBQWpCLENBQXNCMmQsTUFBdEIsQ0FBaEI7RUFDQW5mLE1BQUFBLEdBQUcsQ0FBQytWLFNBQUosR0FBZ0JvSixNQUFNLENBQUNwSixTQUF2QjtFQUNBL1YsTUFBQUEsR0FBRyxDQUFDc1UsQ0FBSixHQUFRNkssTUFBTSxDQUFDN0ssQ0FBZjtFQUNBdFUsTUFBQUEsR0FBRyxDQUFDcWYsSUFBSixHQUFXRixNQUFNLENBQUNFLElBQWxCO0VBQ0FyZixNQUFBQSxHQUFHLENBQUNzZixJQUFKLEdBQVdILE1BQU0sQ0FBQ0csSUFBbEI7RUFDQXRmLE1BQUFBLEdBQUcsQ0FBQ3VmLE9BQUosR0FBY0osTUFBTSxDQUFDSSxPQUFQLENBQWUvZCxJQUFmLENBQW9CMmQsTUFBcEIsQ0FBZDtFQUNBbmYsTUFBQUEsR0FBRyxDQUFDMlYsT0FBSixHQUFjd0osTUFBTSxDQUFDeEosT0FBUCxDQUFlblUsSUFBZixDQUFvQjJkLE1BQXBCLENBQWQ7RUFDQW5mLE1BQUFBLEdBQUcsQ0FBQ3dmLFNBQUosR0FBZ0JMLE1BQU0sQ0FBQ0ssU0FBUCxDQUFpQmhlLElBQWpCLENBQXNCMmQsTUFBdEIsQ0FBaEI7RUFDQW5mLE1BQUFBLEdBQUcsQ0FBQ3lmLGFBQUosR0FBb0JOLE1BQU0sQ0FBQ00sYUFBM0I7RUFDQXpmLE1BQUFBLEdBQUcsQ0FBQzBmLFVBQUosR0FBaUJQLE1BQU0sQ0FBQ08sVUFBUCxDQUFrQmxlLElBQWxCLENBQXVCMmQsTUFBdkIsQ0FBakI7RUFDQW5mLE1BQUFBLEdBQUcsQ0FBQ3llLFdBQUosR0FBa0JVLE1BQU0sQ0FBQ1YsV0FBUCxDQUFtQmpkLElBQW5CLENBQXdCMmQsTUFBeEIsQ0FBbEI7RUFDQW5mLE1BQUFBLEdBQUcsQ0FBQzJmLFlBQUosR0FBbUJSLE1BQU0sQ0FBQ1EsWUFBMUI7RUFDQTNmLE1BQUFBLEdBQUcsQ0FBQzBhLE9BQUosR0FBY0EsT0FBZDtFQUNBMWEsTUFBQUEsR0FBRyxDQUFDNmEsUUFBSixHQUFlQSxRQUFmO0VBQ0Q7Ozs7OztFQzlCSDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7TUFFcUIrRTtFQVVuQix1QkFBWTVmLEdBQVosRUFBaUI7RUFBQTs7RUFBQTs7RUFBQTs7RUFDZixTQUFLQSxHQUFMLEdBQVdBLEdBQVg7RUFFQSxTQUFLNmYsTUFBTCxHQUFjO0VBQ1p4SCxNQUFBQSxZQUFZLEVBQUU7RUFERixLQUFkO0VBSUEsU0FBSzlLLElBQUwsR0FBWSxFQUFaO0VBQ0Q7Ozs7V0FFRCxlQUFjO0VBQ1osYUFBTyxJQUFQO0VBQ0Q7OzthQUVELHNCQUFhO0VBQUE7O0VBQ1gsVUFBSSxDQUFDLEtBQUt1UyxXQUFWLEVBQXVCO0VBQ3JCLGFBQUtBLFdBQUwsR0FBbUIsS0FBSzlmLEdBQUwsV0FBZ0IsUUFBaEIsQ0FBbkI7RUFDRDs7RUFFRCxhQUFPLEtBQUs4ZixXQUFMLENBQWlCbmYsSUFBakIsQ0FBc0IsVUFBQ29mLEtBQUQsRUFBVztFQUN0QyxlQUFPLEtBQUksQ0FBQ0EsS0FBTCxHQUFhQSxLQUFLLENBQUN6YSxNQUFOLENBQWEsS0FBSSxDQUFDc04sT0FBTCxDQUFhbU4sS0FBYixJQUFzQixFQUFuQyxDQUFwQjtFQUNELE9BRk0sQ0FBUDtFQUdEOzs7YUFFRCxtQkFBVTtFQUFBOztFQUNSLFVBQUksS0FBS0EsS0FBVCxFQUFnQjtFQUNkLGVBQU92ZixPQUFPLENBQUN5ZCxPQUFSLENBQWdCLEtBQUs4QixLQUFyQixDQUFQO0VBQ0Q7O0VBRUQsYUFBTyxLQUFLQyxVQUFMLEdBQWtCcmYsSUFBbEIsQ0FBdUIsVUFBQ29mLEtBQUQ7RUFBQSxlQUFXLE1BQUksQ0FBQ0EsS0FBTCxHQUFhQSxLQUF4QjtFQUFBLE9BQXZCLENBQVA7RUFDRDs7O2FBRUQsc0JBQWFBLEtBQWIsRUFBb0I7RUFDbEJBLE1BQUFBLEtBQUssQ0FBQ0UsWUFBTixDQUFtQkMsT0FBbkIsQ0FBMkJDLEdBQTNCLENBQStCLFVBQVVOLE1BQVYsRUFBa0I7RUFDL0NBLFFBQUFBLE1BQU0sQ0FBQ08sT0FBUCxDQUFlLGNBQWYsSUFBaUMsS0FBS3BnQixHQUFMLENBQVN1TixJQUFULENBQWMsWUFBZCxDQUFqQztFQUVBLGVBQU9zUyxNQUFQO0VBQ0QsT0FKRDtFQUtEOzs7YUFFRCwyQkFBa0J0Z0IsUUFBbEIsRUFBNEI7RUFDMUIsYUFBTyxLQUFLOGdCLE9BQUwsR0FBZTFmLElBQWYsQ0FBb0IsVUFBQW9mLEtBQUs7RUFBQSxlQUFJQSxLQUFLLENBQUNFLFlBQU4sQ0FBbUJDLE9BQW5CLENBQTJCQyxHQUEzQixDQUErQjVnQixRQUEvQixDQUFKO0VBQUEsT0FBekIsQ0FBUDtFQUNEOzs7YUFFRCw0QkFBbUJBLFFBQW5CLEVBQTZCO0VBQzNCLGFBQU8sS0FBSzhnQixPQUFMLEdBQWUxZixJQUFmLENBQW9CLFVBQUFvZixLQUFLO0VBQUEsZUFBSUEsS0FBSyxDQUFDRSxZQUFOLENBQW1CSyxRQUFuQixDQUE0QkgsR0FBNUIsQ0FBZ0M1Z0IsUUFBaEMsQ0FBSjtFQUFBLE9BQXpCLENBQVA7RUFDRDs7O2FBRUQsaUJBQVE7RUFDTjtFQUNEO0VBRUQ7RUFDRjtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7OzthQUNFLGFBQUl5VixHQUFKLEVBQXVCO0VBQUEsVUFBZHBDLE9BQWMsdUVBQUosRUFBSTtFQUNyQkEsTUFBQUEsT0FBTyxDQUFDb0MsR0FBUixHQUFjQSxHQUFkO0VBQ0FwQyxNQUFBQSxPQUFPLENBQUN3RixNQUFSLEdBQWlCLEtBQWpCO0VBRUEsYUFBTyxLQUFLOEgsT0FBTCxDQUFhdE4sT0FBYixDQUFQO0VBQ0Q7RUFFRDtFQUNGO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7Ozs7YUFDRSxjQUFLb0MsR0FBTCxFQUFVekgsSUFBVixFQUE4QjtFQUFBLFVBQWRxRixPQUFjLHVFQUFKLEVBQUk7RUFDNUJBLE1BQUFBLE9BQU8sQ0FBQ29DLEdBQVIsR0FBY0EsR0FBZDtFQUNBcEMsTUFBQUEsT0FBTyxDQUFDd0YsTUFBUixHQUFpQixNQUFqQjtFQUNBeEYsTUFBQUEsT0FBTyxDQUFDckYsSUFBUixHQUFlQSxJQUFmO0VBRUEsYUFBTyxLQUFLMlMsT0FBTCxDQUFhdE4sT0FBYixDQUFQO0VBQ0Q7RUFFRDtFQUNGO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7Ozs7YUFDRSxhQUFJb0MsR0FBSixFQUFTekgsSUFBVCxFQUE2QjtFQUFBLFVBQWRxRixPQUFjLHVFQUFKLEVBQUk7RUFDM0JBLE1BQUFBLE9BQU8sQ0FBQ29DLEdBQVIsR0FBY0EsR0FBZDtFQUNBcEMsTUFBQUEsT0FBTyxDQUFDd0YsTUFBUixHQUFpQixLQUFqQjtFQUNBeEYsTUFBQUEsT0FBTyxDQUFDckYsSUFBUixHQUFlQSxJQUFmO0VBRUEsYUFBTyxLQUFLMlMsT0FBTCxDQUFhdE4sT0FBYixDQUFQO0VBQ0Q7RUFFRDtFQUNGO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7Ozs7YUFDRSxlQUFNb0MsR0FBTixFQUFXekgsSUFBWCxFQUErQjtFQUFBLFVBQWRxRixPQUFjLHVFQUFKLEVBQUk7RUFDN0JBLE1BQUFBLE9BQU8sQ0FBQ29DLEdBQVIsR0FBY0EsR0FBZDtFQUNBcEMsTUFBQUEsT0FBTyxDQUFDd0YsTUFBUixHQUFpQixPQUFqQjtFQUNBeEYsTUFBQUEsT0FBTyxDQUFDckYsSUFBUixHQUFlQSxJQUFmO0VBRUEsYUFBTyxLQUFLMlMsT0FBTCxDQUFhdE4sT0FBYixDQUFQO0VBQ0Q7RUFFRDtFQUNGO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7OztXQUNFO2FBQUEsaUJBQVNvQyxHQUFULEVBQWN6SCxJQUFkLEVBQWtDO0VBQUEsVUFBZHFGLE9BQWMsdUVBQUosRUFBSTtFQUNoQ0EsTUFBQUEsT0FBTyxDQUFDb0MsR0FBUixHQUFjQSxHQUFkO0VBQ0FwQyxNQUFBQSxPQUFPLENBQUN3RixNQUFSLEdBQWlCLFFBQWpCO0VBQ0F4RixNQUFBQSxPQUFPLENBQUNyRixJQUFSLEdBQWVBLElBQWY7RUFFQSxhQUFPLEtBQUsyUyxPQUFMLENBQWF0TixPQUFiLENBQVA7RUFDRDtFQUVEO0VBQ0Y7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7Ozs7YUFDRSxjQUFLb0MsR0FBTCxFQUF3QjtFQUFBLFVBQWRwQyxPQUFjLHVFQUFKLEVBQUk7RUFDdEJBLE1BQUFBLE9BQU8sQ0FBQ29DLEdBQVIsR0FBY0EsR0FBZDtFQUNBcEMsTUFBQUEsT0FBTyxDQUFDd0YsTUFBUixHQUFpQixNQUFqQjtFQUVBLGFBQU8sS0FBSzhILE9BQUwsQ0FBYXROLE9BQWIsQ0FBUDtFQUNEO0VBRUQ7RUFDRjtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7OzthQUNFLGlCQUFRb0MsR0FBUixFQUEyQjtFQUFBLFVBQWRwQyxRQUFjLHVFQUFKLEVBQUk7O0VBQ3pCQSxNQUFBQSxRQUFPLENBQUNvQyxHQUFSLEdBQWNBLEdBQWQ7RUFDQXBDLE1BQUFBLFFBQU8sQ0FBQ3dGLE1BQVIsR0FBaUIsU0FBakI7RUFFQSxhQUFPLEtBQUs4SCxPQUFMLENBQWF0TixRQUFiLENBQVA7RUFDRDtFQUVEO0VBQ0Y7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOzs7O2FBQ0UsaUJBQVFBLE9BQVIsRUFBaUI7RUFDZixhQUFPLEtBQUt5TixPQUFMLEdBQWUxZixJQUFmLENBQW9CLFVBQUFvZixLQUFLLEVBQUk7RUFDbEMsZUFBT0EsS0FBSyxDQUFDbk4sT0FBRCxDQUFaO0VBQ0QsT0FGTSxDQUFQLENBRGU7RUFLZjtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0Q7RUFFRDtFQUNGO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7OzthQUNFLHdCQUErQjtFQUFBLFVBQWxCMk4sU0FBa0IsdUVBQU4sSUFBTTtFQUM3QixVQUFNQyxLQUFLLEdBQUcsSUFBZDtFQUNBQSxNQUFBQSxLQUFLLENBQUNULEtBQU4sR0FBYyxJQUFkO0VBRUEsYUFBT1MsS0FBSyxDQUFDQyxpQkFBTixDQUF3QixVQUFDWixNQUFELEVBQVk7RUFDekMsWUFBSVUsU0FBSixFQUFlO0VBQ2JWLFVBQUFBLE1BQU0sQ0FBQ08sT0FBUCxDQUFlLHdCQUFmLElBQTJDUCxNQUEzQztFQUNELFNBRkQsTUFFTyxJQUFJLFFBQU9BLE1BQU0sQ0FBQ3RTLElBQWQsTUFBdUIsUUFBM0IsRUFBcUM7RUFDMUNzUyxVQUFBQSxNQUFNLENBQUN0UyxJQUFQLENBQVksU0FBWixJQUF5QnNTLE1BQU0sQ0FBQ3pILE1BQWhDO0VBQ0QsU0FGTSxNQUVBLElBQUksT0FBT3lILE1BQU0sQ0FBQ3RTLElBQWQsS0FBdUIsUUFBM0IsRUFBcUM7RUFDMUMsY0FBSXNTLE1BQU0sQ0FBQ3RTLElBQVAsQ0FBWW1ULFFBQVosQ0FBcUIsR0FBckIsQ0FBSixFQUErQjtFQUM3QmIsWUFBQUEsTUFBTSxDQUFDdFMsSUFBUCxJQUFlLGNBQWNzUyxNQUFNLENBQUN6SCxNQUFwQztFQUNELFdBRkQsTUFFTztFQUNMeUgsWUFBQUEsTUFBTSxDQUFDdFMsSUFBUCxJQUFlLGNBQWNzUyxNQUFNLENBQUN6SCxNQUFwQztFQUNEO0VBQ0Y7O0VBRUR5SCxRQUFBQSxNQUFNLENBQUN6SCxNQUFQLEdBQWdCLE1BQWhCO0VBRUEsZUFBT3lILE1BQVA7RUFDRCxPQWhCTSxFQWdCSmxmLElBaEJJLENBZ0JDO0VBQUEsZUFBTTZmLEtBQU47RUFBQSxPQWhCRCxDQUFQO0VBaUJEOzs7V0F2UUQsZUFBZ0I7RUFBRSxhQUFPLE1BQVA7RUFBZ0I7OzthQUVsQyxpQkFBZXhnQixHQUFmLEVBQW9CNFMsT0FBcEIsRUFBNkI7RUFDM0I1UyxNQUFBQSxHQUFHLENBQUMyZ0IsS0FBSixHQUFZLElBQUksSUFBSixDQUFTM2dCLEdBQVQsQ0FBWjtFQUNEOzs7Ozs7TUNKa0I0Z0I7Ozs7O0VBYW5CLHdCQUEwQjtFQUFBOztFQUFBLFFBQWRoTyxPQUFjLHVFQUFKLEVBQUk7O0VBQUE7O0VBQ3hCOztFQUR3Qiw4REFaaEIsRUFZZ0I7O0VBQUEsaUVBWGIsRUFXYTs7RUFBQSw0REFWbEIsRUFVa0I7O0VBRXhCLFVBQUtBLE9BQUwsR0FBZVQsS0FBSyxDQUFDLEVBQUQsRUFBSyxNQUFLdEosV0FBTCxDQUFpQmtLLGNBQXRCLEVBQXNDSCxPQUF0QyxDQUFwQixDQUZ3Qjs7RUFLeEIsVUFBS2lPLElBQUwsQ0FBVSxVQUFDNUMsT0FBRCxFQUFhO0VBQ3JCckcsTUFBQUEsUUFBUSxDQUFDa0osZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDN0MsT0FBOUM7RUFDRCxLQUZELEVBTHdCOzs7RUFVeEJyRyxJQUFBQSxRQUFRLENBQUNrSixnQkFBVCxDQUEwQixrQkFBMUIsRUFBOEMsWUFBTTtFQUNsRCxZQUFLQyxTQUFMLEdBQWlCcGdCLElBQWpCLENBQXNCO0VBQUEsZUFBTSxNQUFLZixPQUFMLENBQWEsUUFBYixDQUFOO0VBQUEsT0FBdEI7RUFDRCxLQUZEO0VBVndCO0VBYXpCOzs7O2FBRUQsYUFBSW9oQixNQUFKLEVBQTBCO0VBQUE7O0VBQUEsVUFBZHBPLE9BQWMsdUVBQUosRUFBSTs7RUFDeEIsVUFBSXRVLEtBQUssQ0FBQ1EsT0FBTixDQUFja2lCLE1BQWQsQ0FBSixFQUEyQjtFQUN6QkEsUUFBQUEsTUFBTSxDQUFDamlCLE9BQVAsQ0FBZSxVQUFBa2lCLENBQUM7RUFBQSxpQkFBSSxNQUFJLENBQUNkLEdBQUwsQ0FBU2MsQ0FBVCxDQUFKO0VBQUEsU0FBaEI7RUFDQSxlQUFPLElBQVA7RUFDRCxPQUp1QjtFQU94QjtFQUNBOzs7RUFFQUQsTUFBQUEsTUFBTSxDQUFDRSxPQUFQLENBQWUsSUFBZixFQUFxQnRPLE9BQXJCO0VBRUEsV0FBS2hULE9BQUwsQ0FBYSxrQkFBYixFQUFpQ29oQixNQUFqQztFQUVBLGFBQU8sSUFBUDtFQUNEOzs7YUFFRCxnQkFBT0EsTUFBUCxFQUFlO0VBQ2IsVUFBSUEsTUFBTSxDQUFDRyxTQUFYLEVBQXNCO0VBQ3BCSCxRQUFBQSxNQUFNLENBQUNHLFNBQVAsQ0FBaUIsSUFBakI7RUFDRDs7RUFFRCxXQUFLdmhCLE9BQUwsQ0FBYSxvQkFBYixFQUFtQ29oQixNQUFuQztFQUVBLGFBQU8sSUFBUDtFQUNEOzs7YUFFRCxhQUFJcmUsS0FBSixFQUFXcEQsUUFBWCxFQUFxQjtFQUNuQkEsTUFBQUEsUUFBUSxDQUFDb0QsS0FBRCxDQUFSO0VBRUEsYUFBT0EsS0FBUDtFQUNEO0VBR0Q7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOzs7O2FBRUEsY0FBSzBQLElBQUwsRUFBVzFQLEtBQVgsRUFBa0I7RUFDaEIsV0FBSy9DLE9BQUwsQ0FBYSxjQUFiLEVBQTZCeVMsSUFBN0IsRUFBbUMxUCxLQUFuQztFQUVBaVYsTUFBQUEsUUFBUSxDQUFDcEYsU0FBVCxHQUFxQm9GLFFBQVEsQ0FBQ3BGLFNBQVQsSUFBc0IsRUFBM0M7O0VBRUEsVUFBSUgsSUFBSSxLQUFLbFQsU0FBYixFQUF3QjtFQUN0QixlQUFPeVksUUFBUSxDQUFDcEYsU0FBaEI7RUFDRDs7RUFFRCxVQUFJN1AsS0FBSyxLQUFLeEQsU0FBZCxFQUF5QjtFQUN2QixZQUFNaWlCLEdBQUcsR0FBR3hKLFFBQVEsQ0FBQ3BGLFNBQVQsQ0FBbUJILElBQW5CLENBQVo7RUFFQSxhQUFLelMsT0FBTCxDQUFhLGtCQUFiLEVBQWlDeVMsSUFBakMsRUFBdUMrTyxHQUF2QztFQUVBLGVBQU9BLEdBQVA7RUFDRDs7RUFFRHhKLE1BQUFBLFFBQVEsQ0FBQ3BGLFNBQVQsQ0FBbUJILElBQW5CLElBQTJCMVAsS0FBM0I7RUFFQSxXQUFLL0MsT0FBTCxDQUFhLGtCQUFiLEVBQWlDeVMsSUFBakMsRUFBdUMxUCxLQUF2QztFQUVBLGFBQU8sSUFBUDtFQUNEOzs7YUFFRCxvQkFBVzBQLElBQVgsRUFBaUI7RUFDZnVGLE1BQUFBLFFBQVEsQ0FBQ3BGLFNBQVQsR0FBcUJvRixRQUFRLENBQUNwRixTQUFULElBQXNCLEVBQTNDO0VBRUEsYUFBT29GLFFBQVEsQ0FBQ3BGLFNBQVQsQ0FBbUJILElBQW5CLENBQVA7RUFFQTJFLE1BQUFBLENBQUMsQ0FBQ1ksUUFBRCxDQUFELENBQVl5SixVQUFaLENBQXVCaFAsSUFBdkI7RUFFQSxhQUFPLElBQVA7RUFDRDs7O2FBRUQsYUFBSTlPLElBQUosRUFBVTtFQUNSLGFBQU8sS0FBS2dLLElBQUwsQ0FBVSxhQUFWLEVBQXlCaEssSUFBekIsQ0FBUDtFQUNEOzs7YUFFRCxlQUFNQSxJQUFOLEVBQVk7RUFDVixhQUFPLEtBQUsyYSxHQUFMLENBQVMsT0FBVCxFQUFrQjNhLElBQWxCLENBQVA7RUFDRDs7O2FBRUQsY0FBS2hFLFFBQUwsRUFBZTtFQUNiLFVBQU0waEIsQ0FBQyxHQUFHLElBQUl6Z0IsT0FBSixDQUFZLFVBQUN5ZCxPQUFELEVBQVVxRCxNQUFWLEVBQXFCO0VBQ3pDLFlBQU1DLE9BQU8sR0FBR2hpQixRQUFRLENBQUMwZSxPQUFELEVBQVVxRCxNQUFWLENBQXhCOztFQUVBLFlBQUlDLE9BQU8sSUFBSSxVQUFVQSxPQUF6QixFQUFrQztFQUNoQ0EsVUFBQUEsT0FBTyxDQUFDNWdCLElBQVIsQ0FBYXNkLE9BQWIsV0FBNEJxRCxNQUE1QjtFQUNEO0VBQ0YsT0FOUyxDQUFWO0VBUUEsV0FBS0UsS0FBTCxDQUFXcGlCLElBQVgsQ0FBZ0I2aEIsQ0FBaEI7RUFFQSxhQUFPQSxDQUFQO0VBQ0Q7OzthQUVELHFCQUFZO0VBQ1YsVUFBTU0sT0FBTyxHQUFHL2dCLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLEtBQUsrZ0IsS0FBakIsQ0FBaEI7RUFFQSxXQUFLQSxLQUFMLEdBQWEsRUFBYjtFQUVBLGFBQU9ELE9BQVA7RUFDRDs7OztFQTlIRDtFQUNGO0VBQ0E7RUFDQTtFQUNFLG1CQUE0QjtFQUMxQixhQUFPLEVBQVA7RUFDRDs7OztJQVhxQ3hqQixHQUFHO0VBQUE7RUFBQTtFQUFBOztFQUFBO0VBQUEsSUFBSCxTQUFtQlksVUFBbkI7O0VDWHhDO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQWVPLFNBQVM4aUIsU0FBVCxHQUFpQztFQUFBLE1BQWQ3TyxPQUFjLHVFQUFKLEVBQUk7RUFDdEMsU0FBTyxJQUFJZ08sVUFBSixDQUFlaE8sT0FBZixDQUFQO0VBQ0Q7RUFFTSxTQUFTOE8sVUFBVCxHQUFzQjtFQUMzQixNQUFNQyxHQUFHLEdBQUd6Z0IsTUFBTSxDQUFDMGdCLENBQW5CO0VBRUEsU0FBTzFnQixNQUFNLENBQUMwZ0IsQ0FBZDtFQUVBLFNBQU9ELEdBQVA7RUFDRDtFQUVELElBQU1DLENBQUMsR0FBR0gsU0FBUyxFQUFuQjtFQUVBRyxDQUFDLENBQUN6QixHQUFGLENBQU0zRyxhQUFOO0VBQ0FvSSxDQUFDLENBQUN6QixHQUFGLENBQU0xQyxhQUFOO0VBQ0FtRSxDQUFDLENBQUN6QixHQUFGLENBQU1QLFdBQU47RUFDQWdDLENBQUMsQ0FBQ3pCLEdBQUYsQ0FBTS9mLFNBQU47RUFDQXdoQixDQUFDLENBQUN6QixHQUFGLENBQU0xSSxXQUFOO0VBQ0FtSyxDQUFDLENBQUN6QixHQUFGLENBQU0xTixXQUFOO0VBQ0FtUCxDQUFDLENBQUN6QixHQUFGLENBQU1wZ0IsaUJBQU47RUFFQW1CLE1BQU0sQ0FBQzBnQixDQUFQLEdBQVdBLENBQVg7Ozs7Ozs7Ozs7Ozs7Ozs7In0=