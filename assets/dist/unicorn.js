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
   * Used by `_.defaultsDeep` to customize its `_.merge` use to merge source
   * objects into destination objects that are passed thru.
   *
   * @private
   * @param {*} objValue The destination value.
   * @param {*} srcValue The source value.
   * @param {string} key The key of the property to merge.
   * @param {Object} object The parent object of `objValue`.
   * @param {Object} source The parent object of `srcValue`.
   * @param {Object} [stack] Tracks traversed source values and their merged
   *  counterparts.
   * @returns {*} Returns the value to assign.
   */

  function customDefaultsMerge(objValue, srcValue, key, object, source, stack) {
    if (isObject(objValue) && isObject(srcValue)) {
      // Recursively merge objects and arrays (susceptible to call stack limits).
      stack.set(srcValue, objValue);
      baseMerge(objValue, srcValue, undefined, customDefaultsMerge, stack);
      stack['delete'](srcValue);
    }

    return objValue;
  }

  /**
   * This method is like `_.merge` except that it accepts `customizer` which
   * is invoked to produce the merged values of the destination and source
   * properties. If `customizer` returns `undefined`, merging is handled by the
   * method instead. The `customizer` is invoked with six arguments:
   * (objValue, srcValue, key, object, source, stack).
   *
   * **Note:** This method mutates `object`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Object
   * @param {Object} object The destination object.
   * @param {...Object} sources The source objects.
   * @param {Function} customizer The function to customize assigned values.
   * @returns {Object} Returns `object`.
   * @example
   *
   * function customizer(objValue, srcValue) {
   *   if (_.isArray(objValue)) {
   *     return objValue.concat(srcValue);
   *   }
   * }
   *
   * var object = { 'a': [1], 'b': [2] };
   * var other = { 'a': [3], 'b': [4] };
   *
   * _.mergeWith(object, other, customizer);
   * // => { 'a': [1, 3], 'b': [2, 4] }
   */

  var mergeWith = createAssigner(function (object, source, srcIndex, customizer) {
    baseMerge(object, source, srcIndex, customizer);
  });

  /**
   * This method is like `_.defaults` except that it recursively assigns
   * default properties.
   *
   * **Note:** This method mutates `object`.
   *
   * @static
   * @memberOf _
   * @since 3.10.0
   * @category Object
   * @param {Object} object The destination object.
   * @param {...Object} [sources] The source objects.
   * @returns {Object} Returns `object`.
   * @see _.defaults
   * @example
   *
   * _.defaultsDeep({ 'a': { 'b': 2 } }, { 'a': { 'b': 1, 'c': 3 } });
   * // => { 'a': { 'b': 2, 'c': 3 } }
   */

  var defaultsDeep = baseRest(function (args) {
    args.push(undefined, customDefaultsMerge);
    return apply(mergeWith, undefined, args);
  });

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

  var UnicornTinymce = /*#__PURE__*/function () {
    function UnicornTinymce(ui) {
      _classCallCheck(this, UnicornTinymce);

      _defineProperty(this, "instances", {});

      this.ui = ui;
      this.app = ui.app;
    }

    _createClass(UnicornTinymce, [{
      key: "loadTinymce",
      value: function loadTinymce() {
        return this.app["import"]('@tinymce');
      }
    }, {
      key: "init",
      value: function init(selector) {
        var _this = this;

        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        return this.loadTinymce().then(function () {
          return _this.instances[selector] = new TinymceEditor(selector, options, _this.app);
        });
      }
    }, {
      key: "get",
      value: function get(selector) {
        return this.instances[selector];
      }
    }], [{
      key: "install",
      value: function install(app) {
        app.$ui.tinymce = new this(app.$ui);
      }
    }]);

    return UnicornTinymce;
  }();
  var TinymceEditor = /*#__PURE__*/function () {
    function TinymceEditor(selector, options, app) {
      var _this2 = this;

      _classCallCheck(this, TinymceEditor);

      this.app = app;
      options.selector = selector;
      this.selector = selector;
      this.element = app.selectOne(selector);
      this.options = defaultsDeep({}, this.prepareOptions(options));
      tinymce.init(this.options).then(function (editor) {
        _this2.editor = editor[0];
      });
    }

    _createClass(TinymceEditor, [{
      key: "getEditor",
      value: function getEditor() {
        return this.editor;
      }
    }, {
      key: "prepareOptions",
      value: function prepareOptions(options) {
        var _this3 = this;

        var defaults = {};

        if (options.images_upload_url) {
          defaults.paste_data_images = true;
          defaults.remove_script_host = false;
          defaults.relative_urls = false;

          defaults.images_upload_handler = function () {
            return _this3.imageUploadHandler.apply(_this3, arguments);
          };
        }

        defaults.setup = function (editor) {
          editor.on('change', function () {
            tinymce.triggerSave();
          });
        };

        return defaultsDeep({}, options, defaults);
      }
    }, {
      key: "insert",
      value: function insert(text) {
        return this.editor.insertContent(text);
      }
    }, {
      key: "getValue",
      value: function getValue() {
        return this.editor.getContent();
      }
    }, {
      key: "setValue",
      value: function setValue(text) {
        return this.editor.setContent(text);
      }
    }, {
      key: "imageUploadHandler",
      value: function imageUploadHandler(blobInfo, success, failure) {
        var element = this.element;
        element.dispatchEvent(new CustomEvent('upload-start'));
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.open('POST', this.options.images_upload_url);
        xhr.addEventListener('load', function () {
          element.dispatchEvent(new CustomEvent('upload-complete'));

          if (xhr.status !== 200 && xhr.status !== 204) {
            failure('HTTP Error: ' + decodeURIComponent(xhr.statusText));
            element.dispatchEvent(new CustomEvent('upload-error'));
            return;
          }

          var json = JSON.parse(xhr.responseText);

          if (!json || typeof json.data.url !== 'string') {
            failure('Invalid JSON: ' + xhr.responseText);
            console.error('Invalid JSON: ' + xhr.responseText);
            element.dispatchEvent(new CustomEvent('upload-error'));
            return;
          }

          success(json.data.url);
          element.dispatchEvent(new CustomEvent('upload-success'));
        });
        var formData = new FormData();
        formData.append('file', blobInfo.blob(), blobInfo.filename());
        xhr.send(formData);
      }
    }]);

    return TinymceEditor;
  }();

  _defineProperty(TinymceEditor, "defaultOptions", {});

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
  u.use(UnicornTinymce);
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFyZ2V0LmpzIiwic291cmNlcyI6WyIuLi9zcmMvdW5pY29ybi9taXh3aXRoLmpzIiwiLi4vc3JjL3VuaWNvcm4vZXZlbnRzLmpzIiwiLi4vc3JjL3VuaWNvcm4vcGx1Z2luL3ZhbGlkYXRpb24uanMiLCIuLi9zcmMvdW5pY29ybi91aS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2ZyZWVHbG9iYWwuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19yb290LmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fU3ltYm9sLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fZ2V0UmF3VGFnLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fb2JqZWN0VG9TdHJpbmcuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19iYXNlR2V0VGFnLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9pc09iamVjdExpa2UuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL2lzQXJyYXkuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL2lzT2JqZWN0LmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9pZGVudGl0eS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvaXNGdW5jdGlvbi5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2NvcmVKc0RhdGEuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19pc01hc2tlZC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX3RvU291cmNlLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYmFzZUlzTmF0aXZlLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fZ2V0VmFsdWUuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19nZXROYXRpdmUuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19iYXNlQ3JlYXRlLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYXBwbHkuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19jb3B5QXJyYXkuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19zaG9ydE91dC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvY29uc3RhbnQuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19kZWZpbmVQcm9wZXJ0eS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Jhc2VTZXRUb1N0cmluZy5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX3NldFRvU3RyaW5nLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYXJyYXlFYWNoLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9faXNJbmRleC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Jhc2VBc3NpZ25WYWx1ZS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvZXEuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19hc3NpZ25WYWx1ZS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2NvcHlPYmplY3QuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19vdmVyUmVzdC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Jhc2VSZXN0LmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9pc0xlbmd0aC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvaXNBcnJheUxpa2UuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19pc0l0ZXJhdGVlQ2FsbC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2NyZWF0ZUFzc2lnbmVyLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9faXNQcm90b3R5cGUuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19iYXNlVGltZXMuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19iYXNlSXNBcmd1bWVudHMuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL2lzQXJndW1lbnRzLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9zdHViRmFsc2UuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL2lzQnVmZmVyLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYmFzZUlzVHlwZWRBcnJheS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Jhc2VVbmFyeS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX25vZGVVdGlsLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9pc1R5cGVkQXJyYXkuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19hcnJheUxpa2VLZXlzLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fb3ZlckFyZy5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX25hdGl2ZUtleXMuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19iYXNlS2V5cy5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMva2V5cy5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX25hdGl2ZUtleXNJbi5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Jhc2VLZXlzSW4uanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL2tleXNJbi5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX25hdGl2ZUNyZWF0ZS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2hhc2hDbGVhci5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2hhc2hEZWxldGUuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19oYXNoR2V0LmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9faGFzaEhhcy5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2hhc2hTZXQuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19IYXNoLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fbGlzdENhY2hlQ2xlYXIuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19hc3NvY0luZGV4T2YuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19saXN0Q2FjaGVEZWxldGUuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19saXN0Q2FjaGVHZXQuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19saXN0Q2FjaGVIYXMuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19saXN0Q2FjaGVTZXQuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19MaXN0Q2FjaGUuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19NYXAuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19tYXBDYWNoZUNsZWFyLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9faXNLZXlhYmxlLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fZ2V0TWFwRGF0YS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX21hcENhY2hlRGVsZXRlLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fbWFwQ2FjaGVHZXQuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19tYXBDYWNoZUhhcy5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX21hcENhY2hlU2V0LmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fTWFwQ2FjaGUuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19nZXRQcm90b3R5cGUuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL2lzUGxhaW5PYmplY3QuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19zdGFja0NsZWFyLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fc3RhY2tEZWxldGUuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19zdGFja0dldC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX3N0YWNrSGFzLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fc3RhY2tTZXQuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19TdGFjay5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Nsb25lQnVmZmVyLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fVWludDhBcnJheS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Nsb25lQXJyYXlCdWZmZXIuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19jbG9uZVR5cGVkQXJyYXkuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19pbml0Q2xvbmVPYmplY3QuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19jcmVhdGVCYXNlRm9yLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYmFzZUZvci5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Jhc2VGb3JPd24uanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19jcmVhdGVCYXNlRWFjaC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Jhc2VFYWNoLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYXNzaWduTWVyZ2VWYWx1ZS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvaXNBcnJheUxpa2VPYmplY3QuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19zYWZlR2V0LmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy90b1BsYWluT2JqZWN0LmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYmFzZU1lcmdlRGVlcC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Jhc2VNZXJnZS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2N1c3RvbURlZmF1bHRzTWVyZ2UuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL21lcmdlV2l0aC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvZGVmYXVsdHNEZWVwLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fY2FzdEZ1bmN0aW9uLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9mb3JFYWNoLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9tZXJnZS5qcyIsIi4uL3NyYy91bmljb3JuL3V0aWxpdGllcy5qcyIsIi4uL3NyYy91bmljb3JuL3BsdWdpbi9ncmlkLmpzIiwiLi4vc3JjL3VuaWNvcm4vcGx1Z2luL2Zvcm0uanMiLCIuLi9zcmMvdW5pY29ybi9wbHVnaW4vdGlueW1jZS5qcyIsIi4uL3NyYy91bmljb3JuL2xvYWRlci5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zcHJpbnRmLWpzL3NyYy9zcHJpbnRmLmpzIiwiLi4vc3JjL3VuaWNvcm4vaGVscGVyLmpzIiwiLi4vc3JjL3VuaWNvcm4vaHR0cC5qcyIsIi4uL3NyYy91bmljb3JuL2FwcC5qcyIsIi4uL3NyYy91bmljb3JuL3VuaWNvcm4uanMiXSwic291cmNlc0NvbnRlbnQiOlsiXG4vKipcbiAqIFBhcnQgb2YgcGhvZW5peCBwcm9qZWN0LlxuICpcbiAqIE1vZGlmaWVkIHZlcnNpb24gb2YgbWl4d2l0aC5qcy4gQHNlZSBodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vanVzdGluZmFnbmFuaS9taXh3aXRoLmpzL1xuICpcbiAqIEBjb3B5cmlnaHQgIENvcHlyaWdodCAoQykgMjAxOSAke09SR0FOSVpBVElPTn0uXG4gKiBAbGljZW5zZSAgICBfX0xJQ0VOU0VfX1xuICovXG5cbi8vIHVzZWQgYnkgYXBwbHkoKSBhbmQgaXNBcHBsaWNhdGlvbk9mKClcbmNvbnN0IF9hcHBsaWVkTWl4aW4gPSAnX19taXh3aXRoX2FwcGxpZWRNaXhpbic7XG5cbi8qKlxuICogQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBzdWJjbGFzcyBvZiBpdHMgYXJndW1lbnQuXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IE0gPSAoc3VwZXJjbGFzcykgPT4gY2xhc3MgZXh0ZW5kcyBzdXBlcmNsYXNzIHtcbiAqICAgZ2V0TWVzc2FnZSgpIHtcbiAqICAgICByZXR1cm4gXCJIZWxsb1wiO1xuICogICB9XG4gKiB9XG4gKlxuICogQHR5cGVkZWYge0Z1bmN0aW9ufSBNaXhpbkZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdXBlcmNsYXNzXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gQSBzdWJjbGFzcyBvZiBgc3VwZXJjbGFzc2BcbiAqL1xuXG4vKipcbiAqIEFwcGxpZXMgYG1peGluYCB0byBgc3VwZXJjbGFzc2AuXG4gKlxuICogYGFwcGx5YCBzdG9yZXMgYSByZWZlcmVuY2UgZnJvbSB0aGUgbWl4aW4gYXBwbGljYXRpb24gdG8gdGhlIHVud3JhcHBlZCBtaXhpblxuICogdG8gbWFrZSBgaXNBcHBsaWNhdGlvbk9mYCBhbmQgYGhhc01peGluYCB3b3JrLlxuICpcbiAqIFRoaXMgZnVuY3Rpb24gaXMgdXNlZnVsbCBmb3IgbWl4aW4gd3JhcHBlcnMgdGhhdCB3YW50IHRvIGF1dG9tYXRpY2FsbHkgZW5hYmxlXG4gKiB7QGxpbmsgaGFzTWl4aW59IHN1cHBvcnQuXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IEFwcGxpZXIgPSAobWl4aW4pID0+IHdyYXAobWl4aW4sIChzdXBlcmNsYXNzKSA9PiBhcHBseShzdXBlcmNsYXNzLCBtaXhpbikpO1xuICpcbiAqIC8vIE0gbm93IHdvcmtzIHdpdGggYGhhc01peGluYCBhbmQgYGlzQXBwbGljYXRpb25PZmBcbiAqIGNvbnN0IE0gPSBBcHBsaWVyKChzdXBlcmNsYXNzKSA9PiBjbGFzcyBleHRlbmRzIHN1cGVyY2xhc3Mge30pO1xuICpcbiAqIGNsYXNzIEMgZXh0ZW5kcyBNKE9iamVjdCkge31cbiAqIGxldCBpID0gbmV3IEMoKTtcbiAqIGhhc01peGluKGksIE0pOyAvLyB0cnVlXG4gKlxuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdXBlcmNsYXNzIEEgY2xhc3Mgb3IgY29uc3RydWN0b3IgZnVuY3Rpb25cbiAqIEBwYXJhbSB7TWl4aW5GdW5jdGlvbn0gbWl4aW4gVGhlIG1peGluIHRvIGFwcGx5XG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gQSBzdWJjbGFzcyBvZiBgc3VwZXJjbGFzc2AgcHJvZHVjZWQgYnkgYG1peGluYFxuICovXG5jb25zdCBhcHBseSA9IChzdXBlcmNsYXNzLCBtaXhpbikgPT4ge1xuICBsZXQgYXBwbGljYXRpb24gPSBtaXhpbihzdXBlcmNsYXNzKTtcbiAgYXBwbGljYXRpb24ucHJvdG90eXBlW19hcHBsaWVkTWl4aW5dID0gdW53cmFwKG1peGluKTtcbiAgcmV0dXJuIGFwcGxpY2F0aW9uO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIGB0cnVlYCBpZmYgYHByb3RvYCBpcyBhIHByb3RvdHlwZSBjcmVhdGVkIGJ5IHRoZSBhcHBsaWNhdGlvbiBvZlxuICogYG1peGluYCB0byBhIHN1cGVyY2xhc3MuXG4gKlxuICogYGlzQXBwbGljYXRpb25PZmAgd29ya3MgYnkgY2hlY2tpbmcgdGhhdCBgcHJvdG9gIGhhcyBhIHJlZmVyZW5jZSB0byBgbWl4aW5gXG4gKiBhcyBjcmVhdGVkIGJ5IGBhcHBseWAuXG4gKlxuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge09iamVjdH0gcHJvdG8gQSBwcm90b3R5cGUgb2JqZWN0IGNyZWF0ZWQgYnkge0BsaW5rIGFwcGx5fS5cbiAqIEBwYXJhbSB7TWl4aW5GdW5jdGlvbn0gbWl4aW4gQSBtaXhpbiBmdW5jdGlvbiB1c2VkIHdpdGgge0BsaW5rIGFwcGx5fS5cbiAqIEByZXR1cm4ge2Jvb2xlYW59IHdoZXRoZXIgYHByb3RvYCBpcyBhIHByb3RvdHlwZSBjcmVhdGVkIGJ5IHRoZSBhcHBsaWNhdGlvbiBvZlxuICogYG1peGluYCB0byBhIHN1cGVyY2xhc3NcbiAqL1xuY29uc3QgaXNBcHBsaWNhdGlvbk9mID0gKHByb3RvLCBtaXhpbikgPT5cbiAgcHJvdG8uaGFzT3duUHJvcGVydHkoX2FwcGxpZWRNaXhpbikgJiYgcHJvdG9bX2FwcGxpZWRNaXhpbl0gPT09IHVud3JhcChtaXhpbik7XG5cbi8qKlxuICogUmV0dXJucyBgdHJ1ZWAgaWZmIGBvYCBoYXMgYW4gYXBwbGljYXRpb24gb2YgYG1peGluYCBvbiBpdHMgcHJvdG90eXBlXG4gKiBjaGFpbi5cbiAqXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7T2JqZWN0fSBvIEFuIG9iamVjdFxuICogQHBhcmFtIHtNaXhpbkZ1bmN0aW9ufSBtaXhpbiBBIG1peGluIGFwcGxpZWQgd2l0aCB7QGxpbmsgYXBwbHl9XG4gKiBAcmV0dXJuIHtib29sZWFufSB3aGV0aGVyIGBvYCBoYXMgYW4gYXBwbGljYXRpb24gb2YgYG1peGluYCBvbiBpdHMgcHJvdG90eXBlXG4gKiBjaGFpblxuICovXG5jb25zdCBoYXNNaXhpbiA9IChvLCBtaXhpbikgPT4ge1xuICB3aGlsZSAobyAhPSBudWxsKSB7XG4gICAgaWYgKGlzQXBwbGljYXRpb25PZihvLCBtaXhpbikpIHJldHVybiB0cnVlO1xuICAgIG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yobyk7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5cbi8vIHVzZWQgYnkgd3JhcCgpIGFuZCB1bndyYXAoKVxuY29uc3QgX3dyYXBwZWRNaXhpbiA9ICdfX21peHdpdGhfd3JhcHBlZE1peGluJztcblxuLyoqXG4gKiBTZXRzIHVwIHRoZSBmdW5jdGlvbiBgbWl4aW5gIHRvIGJlIHdyYXBwZWQgYnkgdGhlIGZ1bmN0aW9uIGB3cmFwcGVyYCwgd2hpbGVcbiAqIGFsbG93aW5nIHByb3BlcnRpZXMgb24gYG1peGluYCB0byBiZSBhdmFpbGFibGUgdmlhIGB3cmFwcGVyYCwgYW5kIGFsbG93aW5nXG4gKiBgd3JhcHBlcmAgdG8gYmUgdW53cmFwcGVkIHRvIGdldCB0byB0aGUgb3JpZ2luYWwgZnVuY3Rpb24uXG4gKlxuICogYHdyYXBgIGRvZXMgdHdvIHRoaW5nczpcbiAqICAgMS4gU2V0cyB0aGUgcHJvdG90eXBlIG9mIGBtaXhpbmAgdG8gYHdyYXBwZXJgIHNvIHRoYXQgcHJvcGVydGllcyBzZXQgb25cbiAqICAgICAgYG1peGluYCBpbmhlcml0ZWQgYnkgYHdyYXBwZXJgLlxuICogICAyLiBTZXRzIGEgc3BlY2lhbCBwcm9wZXJ0eSBvbiBgbWl4aW5gIHRoYXQgcG9pbnRzIGJhY2sgdG8gYG1peGluYCBzbyB0aGF0XG4gKiAgICAgIGl0IGNhbiBiZSByZXRyZWl2ZWQgZnJvbSBgd3JhcHBlcmBcbiAqXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7TWl4aW5GdW5jdGlvbn0gbWl4aW4gQSBtaXhpbiBmdW5jdGlvblxuICogQHBhcmFtIHtNaXhpbkZ1bmN0aW9ufSB3cmFwcGVyIEEgZnVuY3Rpb24gdGhhdCB3cmFwcyB7QGxpbmsgbWl4aW59XG4gKiBAcmV0dXJuIHtNaXhpbkZ1bmN0aW9ufSBgd3JhcHBlcmBcbiAqL1xuY29uc3Qgd3JhcCA9IChtaXhpbiwgd3JhcHBlcikgPT4ge1xuICBPYmplY3Quc2V0UHJvdG90eXBlT2Yod3JhcHBlciwgbWl4aW4pO1xuICBpZiAoIW1peGluW193cmFwcGVkTWl4aW5dKSB7XG4gICAgbWl4aW5bX3dyYXBwZWRNaXhpbl0gPSBtaXhpbjtcbiAgfVxuICByZXR1cm4gd3JhcHBlcjtcbn07XG5cbi8qKlxuICogVW53cmFwcyB0aGUgZnVuY3Rpb24gYHdyYXBwZXJgIHRvIHJldHVybiB0aGUgb3JpZ2luYWwgZnVuY3Rpb24gd3JhcHBlZCBieVxuICogb25lIG9yIG1vcmUgY2FsbHMgdG8gYHdyYXBgLiBSZXR1cm5zIGB3cmFwcGVyYCBpZiBpdCdzIG5vdCBhIHdyYXBwZWRcbiAqIGZ1bmN0aW9uLlxuICpcbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtNaXhpbkZ1bmN0aW9ufSB3cmFwcGVyIEEgd3JhcHBlZCBtaXhpbiBwcm9kdWNlZCBieSB7QGxpbmsgd3JhcH1cbiAqIEByZXR1cm4ge01peGluRnVuY3Rpb259IFRoZSBvcmlnaW5hbGx5IHdyYXBwZWQgbWl4aW5cbiAqL1xuY29uc3QgdW53cmFwID0gKHdyYXBwZXIpID0+IHdyYXBwZXJbX3dyYXBwZWRNaXhpbl0gfHwgd3JhcHBlcjtcblxuY29uc3QgX2NhY2hlZEFwcGxpY2F0aW9ucyA9ICdfX21peHdpdGhfY2FjaGVkQXBwbGljYXRpb25zJztcblxuLyoqXG4gKiBEZWNvcmF0ZXMgYG1peGluYCBzbyB0aGF0IGl0IGNhY2hlcyBpdHMgYXBwbGljYXRpb25zLiBXaGVuIGFwcGxpZWQgbXVsdGlwbGVcbiAqIHRpbWVzIHRvIHRoZSBzYW1lIHN1cGVyY2xhc3MsIGBtaXhpbmAgd2lsbCBvbmx5IGNyZWF0ZSBvbmUgc3ViY2xhc3MsIG1lbW9pemVcbiAqIGl0IGFuZCByZXR1cm4gaXQgZm9yIGVhY2ggYXBwbGljYXRpb24uXG4gKlxuICogTm90ZTogSWYgYG1peGluYCBzb21laG93IHN0b3JlcyBwcm9wZXJ0aWVzIGl0cyBjbGFzc2VzIGNvbnN0cnVjdG9yIChzdGF0aWNcbiAqIHByb3BlcnRpZXMpLCBvciBvbiBpdHMgY2xhc3NlcyBwcm90b3R5cGUsIGl0IHdpbGwgYmUgc2hhcmVkIGFjcm9zcyBhbGxcbiAqIGFwcGxpY2F0aW9ucyBvZiBgbWl4aW5gIHRvIGEgc3VwZXIgY2xhc3MuIEl0J3MgcmVjY29tZW5kZWQgdGhhdCBgbWl4aW5gIG9ubHlcbiAqIGFjY2VzcyBpbnN0YW5jZSBzdGF0ZS5cbiAqXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7TWl4aW5GdW5jdGlvbn0gbWl4aW4gVGhlIG1peGluIHRvIHdyYXAgd2l0aCBjYWNoaW5nIGJlaGF2aW9yXG4gKiBAcmV0dXJuIHtNaXhpbkZ1bmN0aW9ufSBhIG5ldyBtaXhpbiBmdW5jdGlvblxuICovXG5jb25zdCBDYWNoZWQgPSAobWl4aW4pID0+IHdyYXAobWl4aW4sIChzdXBlcmNsYXNzKSA9PiB7XG4gIC8vIEdldCBvciBjcmVhdGUgYSBzeW1ib2wgdXNlZCB0byBsb29rIHVwIGEgcHJldmlvdXMgYXBwbGljYXRpb24gb2YgbWl4aW5cbiAgLy8gdG8gdGhlIGNsYXNzLiBUaGlzIHN5bWJvbCBpcyB1bmlxdWUgcGVyIG1peGluIGRlZmluaXRpb24sIHNvIGEgY2xhc3Mgd2lsbCBoYXZlIE5cbiAgLy8gYXBwbGljYXRpb25SZWZzIGlmIGl0IGhhcyBoYWQgTiBtaXhpbnMgYXBwbGllZCB0byBpdC4gQSBtaXhpbiB3aWxsIGhhdmVcbiAgLy8gZXhhY3RseSBvbmUgX2NhY2hlZEFwcGxpY2F0aW9uUmVmIHVzZWQgdG8gc3RvcmUgaXRzIGFwcGxpY2F0aW9ucy5cblxuICBsZXQgY2FjaGVkQXBwbGljYXRpb25zID0gc3VwZXJjbGFzc1tfY2FjaGVkQXBwbGljYXRpb25zXTtcbiAgaWYgKCFjYWNoZWRBcHBsaWNhdGlvbnMpIHtcbiAgICBjYWNoZWRBcHBsaWNhdGlvbnMgPSBzdXBlcmNsYXNzW19jYWNoZWRBcHBsaWNhdGlvbnNdID0gbmV3IE1hcCgpO1xuICB9XG5cbiAgbGV0IGFwcGxpY2F0aW9uID0gY2FjaGVkQXBwbGljYXRpb25zLmdldChtaXhpbik7XG4gIGlmICghYXBwbGljYXRpb24pIHtcbiAgICBhcHBsaWNhdGlvbiA9IG1peGluKHN1cGVyY2xhc3MpO1xuICAgIGNhY2hlZEFwcGxpY2F0aW9ucy5zZXQobWl4aW4sIGFwcGxpY2F0aW9uKTtcbiAgfVxuXG4gIHJldHVybiBhcHBsaWNhdGlvbjtcbn0pO1xuXG4vKipcbiAqIERlY29yYXRlcyBgbWl4aW5gIHNvIHRoYXQgaXQgb25seSBhcHBsaWVzIGlmIGl0J3Mgbm90IGFscmVhZHkgb24gdGhlXG4gKiBwcm90b3R5cGUgY2hhaW4uXG4gKlxuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge01peGluRnVuY3Rpb259IG1peGluIFRoZSBtaXhpbiB0byB3cmFwIHdpdGggZGVkdXBsaWNhdGlvbiBiZWhhdmlvclxuICogQHJldHVybiB7TWl4aW5GdW5jdGlvbn0gYSBuZXcgbWl4aW4gZnVuY3Rpb25cbiAqL1xuY29uc3QgRGVEdXBlID0gKG1peGluKSA9PiB3cmFwKG1peGluLCAoc3VwZXJjbGFzcykgPT5cbiAgKGhhc01peGluKHN1cGVyY2xhc3MucHJvdG90eXBlLCBtaXhpbikpXG4gICAgPyBzdXBlcmNsYXNzXG4gICAgOiBtaXhpbihzdXBlcmNsYXNzKSk7XG5cbi8qKlxuICogQWRkcyBbU3ltYm9sLmhhc0luc3RhbmNlXSAoRVMyMDE1IGN1c3RvbSBpbnN0YW5jZW9mIHN1cHBvcnQpIHRvIGBtaXhpbmAuXG4gKlxuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge01peGluRnVuY3Rpb259IG1peGluIFRoZSBtaXhpbiB0byBhZGQgW1N5bWJvbC5oYXNJbnN0YW5jZV0gdG9cbiAqIEByZXR1cm4ge01peGluRnVuY3Rpb259IHRoZSBnaXZlbiBtaXhpbiBmdW5jdGlvblxuICovXG5jb25zdCBIYXNJbnN0YW5jZSA9IChtaXhpbikgPT4ge1xuICBpZiAoU3ltYm9sICYmIFN5bWJvbC5oYXNJbnN0YW5jZSAmJiAhbWl4aW5bU3ltYm9sLmhhc0luc3RhbmNlXSkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtaXhpbiwgU3ltYm9sLmhhc0luc3RhbmNlLCB7XG4gICAgICB2YWx1ZShvKSB7XG4gICAgICAgIHJldHVybiBoYXNNaXhpbihvLCBtaXhpbik7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG4gIHJldHVybiBtaXhpbjtcbn07XG5cbi8qKlxuICogQSBiYXNpYyBtaXhpbiBkZWNvcmF0b3IgdGhhdCBhcHBsaWVzIHRoZSBtaXhpbiB3aXRoIHtAbGluayBhcHBseX0gc28gdGhhdCBpdFxuICogY2FuIGJlIHVzZWQgd2l0aCB7QGxpbmsgaXNBcHBsaWNhdGlvbk9mfSwge0BsaW5rIGhhc01peGlufSBhbmQgdGhlIG90aGVyXG4gKiBtaXhpbiBkZWNvcmF0b3IgZnVuY3Rpb25zLlxuICpcbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtNaXhpbkZ1bmN0aW9ufSBtaXhpbiBUaGUgbWl4aW4gdG8gd3JhcFxuICogQHJldHVybiB7TWl4aW5GdW5jdGlvbn0gYSBuZXcgbWl4aW4gZnVuY3Rpb25cbiAqL1xuY29uc3QgQmFyZU1peGluID0gKG1peGluKSA9PiB3cmFwKG1peGluLCAocykgPT4gYXBwbHkocywgbWl4aW4pKTtcblxuLyoqXG4gKiBEZWNvcmF0ZXMgYSBtaXhpbiBmdW5jdGlvbiB0byBhZGQgZGVkdXBsaWNhdGlvbiwgYXBwbGljYXRpb24gY2FjaGluZyBhbmRcbiAqIGluc3RhbmNlb2Ygc3VwcG9ydC5cbiAqXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7TWl4aW5GdW5jdGlvbn0gbWl4aW4gVGhlIG1peGluIHRvIHdyYXBcbiAqIEByZXR1cm4ge01peGluRnVuY3Rpb259IGEgbmV3IG1peGluIGZ1bmN0aW9uXG4gKi9cbmV4cG9ydCBjb25zdCBNaXhpbiA9IChtaXhpbikgPT4gRGVEdXBlKENhY2hlZChCYXJlTWl4aW4obWl4aW4pKSk7XG5cbi8qKlxuICogQSBmbHVlbnQgaW50ZXJmYWNlIHRvIGFwcGx5IGEgbGlzdCBvZiBtaXhpbnMgdG8gYSBzdXBlcmNsYXNzLlxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNsYXNzIFggZXh0ZW5kcyBtaXgoT2JqZWN0KS53aXRoKEEsIEIsIEMpIHt9XG4gKiBgYGBcbiAqXG4gKiBUaGUgbWl4aW5zIGFyZSBhcHBsaWVkIGluIG9yZGVyIHRvIHRoZSBzdXBlcmNsYXNzLCBzbyB0aGUgcHJvdG90eXBlIGNoYWluXG4gKiB3aWxsIGJlOiBYLT5DJy0+QictPkEnLT5PYmplY3QuXG4gKlxuICogVGhpcyBpcyBwdXJlbHkgYSBjb252ZW5pZW5jZSBmdW5jdGlvbi4gVGhlIGFib3ZlIGV4YW1wbGUgaXMgZXF1aXZhbGVudCB0bzpcbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjbGFzcyBYIGV4dGVuZHMgQyhCKEEoT2JqZWN0KSkpIHt9XG4gKiBgYGBcbiAqXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtzdXBlcmNsYXNzPU9iamVjdF1cbiAqIEByZXR1cm4ge01peGluQnVpbGRlcn1cbiAqL1xuZXhwb3J0IGNvbnN0IG1peCA9IChzdXBlcmNsYXNzKSA9PiBuZXcgTWl4aW5CdWlsZGVyKHN1cGVyY2xhc3MpO1xuXG5jbGFzcyBNaXhpbkJ1aWxkZXIge1xuXG4gIGNvbnN0cnVjdG9yKHN1cGVyY2xhc3MpIHtcbiAgICB0aGlzLnN1cGVyY2xhc3MgPSBzdXBlcmNsYXNzIHx8IGNsYXNzIHt9O1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGxpZXMgYG1peGluc2AgaW4gb3JkZXIgdG8gdGhlIHN1cGVyY2xhc3MgZ2l2ZW4gdG8gYG1peCgpYC5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheS48TWl4aW4+fSBtaXhpbnNcbiAgICogQHJldHVybiB7RnVuY3Rpb259IGEgc3ViY2xhc3Mgb2YgYHN1cGVyY2xhc3NgIHdpdGggYG1peGluc2AgYXBwbGllZFxuICAgKi9cbiAgd2l0aCguLi5taXhpbnMpIHtcbiAgICByZXR1cm4gbWl4aW5zLnJlZHVjZSgoYywgbSkgPT4gbShjKSwgdGhpcy5zdXBlcmNsYXNzKTtcbiAgfVxufVxuXG4vLyBQb2x5ZmlsbCBGb3IgSUVcbi8vIEBzZWUgaHR0cHM6Ly9qdWVqaW4uaW0vcG9zdC81ZDg4N2E5YzUxODgyNTA5NGIzNGY0MWRcbihmdW5jdGlvbigpIHtcbiAgT2JqZWN0LnNldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8ICh7X19wcm90b19fOiBbXX0gaW5zdGFuY2VvZiBBcnJheSA/IHNldFByb3RvT2YgOiBtaXhpblByb3BlcnRpZXMpO1xuXG4gIGZ1bmN0aW9uIHNldFByb3RvT2Yob2JqLCBwcm90bykge1xuICAgIG9iai5fX3Byb3RvX18gPSBwcm90bztcbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAgZnVuY3Rpb24gbWl4aW5Qcm9wZXJ0aWVzKG9iaiwgcHJvdG8pIHtcbiAgICBmb3IgKGNvbnN0IHByb3AgaW4gcHJvdG8pIHtcbiAgICAgIGlmICghb2JqLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgIG9ialtwcm9wXSA9IHByb3RvW3Byb3BdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqO1xuICB9XG59KSgpO1xuIiwiLyoqXG4gKiBQYXJ0IG9mIGVhcnRoIHByb2plY3QuXG4gKlxuICogQGNvcHlyaWdodCAgQ29weXJpZ2h0IChDKSAyMDE5ICR7T1JHQU5JWkFUSU9OfS5cbiAqIEBsaWNlbnNlICAgIF9fTElDRU5TRV9fXG4gKi9cblxuaW1wb3J0IHsgTWl4aW4gfSBmcm9tICcuL21peHdpdGguanMnO1xuXG5leHBvcnQgY29uc3QgRXZlbnRNaXhpbiA9IE1peGluKGZ1bmN0aW9uIChzdXBlcmNsYXNzKSB7XG4gIHJldHVybiBjbGFzcyBleHRlbmRzIHN1cGVyY2xhc3Mge1xuICAgIF9saXN0ZW5lcnMgPSB7fTtcblxuICAgIG9uKGV2ZW50LCBoYW5kbGVyKSB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShldmVudCkpIHtcbiAgICAgICAgZXZlbnQuZm9yRWFjaChlID0+IHRoaXMub24oZSwgaGFuZGxlcikpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX2xpc3RlbmVyc1tldmVudF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLl9saXN0ZW5lcnNbZXZlbnRdID0gW107XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2xpc3RlbmVyc1tldmVudF0ucHVzaChoYW5kbGVyKTtcblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgb25jZShldmVudCwgaGFuZGxlcikge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZXZlbnQpKSB7XG4gICAgICAgIGV2ZW50LmZvckVhY2goZSA9PiB0aGlzLm9uY2UoZSwgaGFuZGxlcikpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgaGFuZGxlci5fb25jZSA9IHRydWU7XG5cbiAgICAgIHRoaXMub24oZXZlbnQsIGhhbmRsZXIpO1xuICAgIH1cblxuICAgIG9mZihldmVudCwgY2FsbGJhY2sgPSBudWxsKSB7XG4gICAgICBpZiAoY2FsbGJhY2sgIT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5fbGlzdGVuZXJzW2V2ZW50XSA9IHRoaXMubGlzdGVuZXJzKGV2ZW50KS5maWx0ZXIoKGxpc3RlbmVyKSA9PiBsaXN0ZW5lciAhPT0gY2FsbGJhY2spO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgZGVsZXRlIHRoaXMuX2xpc3RlbmVyc1tldmVudF07XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHRyaWdnZXIoZXZlbnQsIC4uLmFyZ3MpIHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGV2ZW50KSkge1xuICAgICAgICBldmVudC5mb3JFYWNoKGUgPT4gdGhpcy50cmlnZ2VyKGUpKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubGlzdGVuZXJzKGV2ZW50KS5mb3JFYWNoKGxpc3RlbmVyID0+IHtcbiAgICAgICAgbGlzdGVuZXIoLi4uYXJncyk7XG4gICAgICB9KTtcblxuICAgICAgLy8gUmVtb3ZlIG9uY2VcbiAgICAgIHRoaXMuX2xpc3RlbmVyc1tldmVudF0gPSB0aGlzLmxpc3RlbmVycyhldmVudCkuZmlsdGVyKChsaXN0ZW5lcikgPT4gbGlzdGVuZXIuX29uY2UgIT09IHRydWUpO1xuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBsaXN0ZW5lcnMoZXZlbnQpIHtcbiAgICAgIGlmICh0eXBlb2YgZXZlbnQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgZ2V0IGxpc3RlbmVycyBldmVudCBuYW1lIHNob3VsZCBvbmx5IHVzZSBzdHJpbmcuYCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLl9saXN0ZW5lcnNbZXZlbnRdID09PSB1bmRlZmluZWQgPyBbXSA6IHRoaXMuX2xpc3RlbmVyc1tldmVudF07XG4gICAgfVxuICB9O1xufSk7XG5cbmV4cG9ydCBjbGFzcyBFdmVudEJ1cyBleHRlbmRzIEV2ZW50TWl4aW4oY2xhc3Mge30pIHt9XG4iLCIvKipcbiAqIFBhcnQgb2Ygc3RhcnRlciBwcm9qZWN0LlxuICpcbiAqIEBjb3B5cmlnaHQgIENvcHlyaWdodCAoQykgMjAyMSBfX09SR0FOSVpBVElPTl9fLlxuICogQGxpY2Vuc2UgICAgX19MSUNFTlNFX19cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVbmljb3JuVmFsaWRhdGlvbiB7XG4gIHN0YXRpYyBpbnN0YWxsKGFwcCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgYXBwLmZvcm1WYWxpZGF0aW9uID0gKHNlbGVjdG9yID0gJ3VuaS1mb3JtLXZhbGlkYXRlJykgPT4ge1xuICAgICAgYXBwLmltcG9ydCgnQHVuaWNvcm4vdWkvdmFsaWRhdGlvbi1jb21wb25lbnRzLmpzJyk7XG5cbiAgICAgIHJldHVybiBhcHAuc2VsZWN0T25lKHNlbGVjdG9yKTtcbiAgICB9O1xuICB9XG59XG5cblxuIiwiLyoqXG4gKiBQYXJ0IG9mIHN0YXJ0ZXIgcHJvamVjdC5cbiAqXG4gKiBAY29weXJpZ2h0ICBDb3B5cmlnaHQgKEMpIDIwMjEgX19PUkdBTklaQVRJT05fXy5cbiAqIEBsaWNlbnNlICAgIF9fTElDRU5TRV9fXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVW5pY29yblVJIHtcbiAgdGhlbWU7XG5cbiAgc3RhdGljIGdldCBpcygpIHsgcmV0dXJuICd1aSc7IH1cblxuICBzdGF0aWMgaW5zdGFsbChhcHAsIG9wdGlvbnMgPSB7fSkge1xuICAgIC8vIERpc2FibGUgQWxwaW5lIGF1dG8gbG9hZC5cbiAgICB3aW5kb3cuZGVmZXJMb2FkaW5nQWxwaW5lID0gKCkgPT4ge307XG5cbiAgICBjb25zdCB1aSA9IGFwcC4kdWkgPSBuZXcgdGhpcyhhcHApO1xuICAgIGFwcC5hZGRNZXNzYWdlID0gdWkucmVuZGVyTWVzc2FnZTtcblxuICAgIGFwcC5sb2FkQWxwaW5lID0gdWkubG9hZEFscGluZS5iaW5kKHVpKTtcbiAgICBhcHAubG9hZFNwcnVjZSA9IHVpLmxvYWRTcHJ1Y2UuYmluZCh1aSk7XG4gICAgYXBwLmluaXRBbHBpbmUgPSB1aS5pbml0QWxwaW5lLmJpbmQodWkpO1xuICAgIGFwcC5zdGFydEFscGluZSA9IHVpLnN0YXJ0QWxwaW5lLmJpbmQodWkpO1xuICAgIGFwcC5zdGFydEFscGluZVNwcnVjZSA9IHVpLnN0YXJ0QWxwaW5lU3BydWNlLmJpbmQodWkpO1xuICAgIGFwcC5pbml0QWxwaW5lU3BydWNlID0gdWkuaW5pdEFscGluZVNwcnVjZS5iaW5kKHVpKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXQgZGVmYXVsdE9wdGlvbnMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1lc3NhZ2VTZWxlY3RvcjogJy5tZXNzYWdlLXdyYXAnLFxuICAgIH07XG4gIH1cblxuICBpbnN0YWxsVGhlbWUodGhlbWUpIHtcbiAgICB0aGlzLnRoZW1lID0gdGhlbWU7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihhcHApIHtcbiAgICB0aGlzLmFwcCA9IGFwcDtcbiAgICB0aGlzLmFsaXZlSGFuZGxlID0gbnVsbDtcbiAgfVxuXG4gIHJlbmRlck1lc3NhZ2UobWVzc2FnZXMsIHR5cGUgPSAnaW5mbycpIHtcbiAgICAvL1xuICB9XG5cbiAgbG9hZEFscGluZSgpIHtcbiAgICByZXR1cm4gdGhpcy5hcHAuaW1wb3J0KCdAYWxwaW5lanMnKTtcbiAgfVxuXG4gIGxvYWRTcHJ1Y2UoKSB7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKFtcbiAgICAgIHRoaXMubG9hZEFscGluZSgpLFxuICAgICAgdGhpcy5hcHAuaW1wb3J0KCdAc3BydWNlJylcbiAgICBdKTtcbiAgfVxuXG4gIGluaXRBbHBpbmUoc2VsZWN0b3IpIHtcbiAgICByZXR1cm4gdGhpcy5sb2FkQWxwaW5lKCkudGhlbigoKSA9PiB7XG4gICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5hcHAuc2VsZWN0T25lKHNlbGVjdG9yKTtcbiAgICAgIEFscGluZS5pbml0aWFsaXplQ29tcG9uZW50KGVsZW1lbnQpO1xuICAgIH0pO1xuICB9XG5cbiAgc3RhcnRBbHBpbmUoKSB7XG4gICAgcmV0dXJuIHRoaXMubG9hZEFscGluZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgaWYgKFNwcnVjZSkge1xuICAgICAgICBTcHJ1Y2Uuc3RhcnQoKTtcbiAgICAgIH1cblxuICAgICAgQWxwaW5lLnN0YXJ0KCk7XG4gICAgfSk7XG4gIH1cblxuICBzdGFydEFscGluZVNwcnVjZSgpIHtcbiAgICByZXR1cm4gdGhpcy5sb2FkU3BydWNlKCkudGhlbigoKSA9PiB7XG4gICAgICBBbHBpbmUuc3RhcnQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGluaXRBbHBpbmVTcHJ1Y2Uoc2VsZWN0b3IpIHtcbiAgICByZXR1cm4gdGhpcy5sb2FkU3BydWNlKCkudGhlbigoKSA9PiB7XG4gICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5hcHAuc2VsZWN0T25lKHNlbGVjdG9yKTtcbiAgICAgIEFscGluZS5pbml0aWFsaXplQ29tcG9uZW50KGVsZW1lbnQpO1xuICAgIH0pO1xuICB9XG5cbiAgZmxhdHBpY2tyKCkge1xuICAgIHJldHVybiB0aGlzLmFwcC5pbXBvcnQoJ0B1bmljb3JuL3VpL2ZsYXRwaWNrci1jb21wb25lbnRzLmpzJyk7XG4gIH1cblxuICBsaXN0RGVwZW5kZW50KCkge1xuICAgIHJldHVybiB0aGlzLmFwcC5pbXBvcnQoJ0B1bmljb3JuL3VpL2xpc3QtZGVwZW5kZW50LmpzJyk7XG4gIH1cbn1cbiIsIi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsICYmIGdsb2JhbC5PYmplY3QgPT09IE9iamVjdCAmJiBnbG9iYWw7XG5cbmV4cG9ydCBkZWZhdWx0IGZyZWVHbG9iYWw7XG4iLCJpbXBvcnQgZnJlZUdsb2JhbCBmcm9tICcuL19mcmVlR2xvYmFsLmpzJztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBzZWxmYC4gKi9cbnZhciBmcmVlU2VsZiA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYgJiYgc2VsZi5PYmplY3QgPT09IE9iamVjdCAmJiBzZWxmO1xuXG4vKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbnZhciByb290ID0gZnJlZUdsb2JhbCB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG5leHBvcnQgZGVmYXVsdCByb290O1xuIiwiaW1wb3J0IHJvb3QgZnJvbSAnLi9fcm9vdC5qcyc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIFN5bWJvbCA9IHJvb3QuU3ltYm9sO1xuXG5leHBvcnQgZGVmYXVsdCBTeW1ib2w7XG4iLCJpbXBvcnQgU3ltYm9sIGZyb20gJy4vX1N5bWJvbC5qcyc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBuYXRpdmVPYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1Ub1N0cmluZ1RhZyA9IFN5bWJvbCA/IFN5bWJvbC50b1N0cmluZ1RhZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VHZXRUYWdgIHdoaWNoIGlnbm9yZXMgYFN5bWJvbC50b1N0cmluZ1RhZ2AgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHJhdyBgdG9TdHJpbmdUYWdgLlxuICovXG5mdW5jdGlvbiBnZXRSYXdUYWcodmFsdWUpIHtcbiAgdmFyIGlzT3duID0gaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgc3ltVG9TdHJpbmdUYWcpLFxuICAgICAgdGFnID0gdmFsdWVbc3ltVG9TdHJpbmdUYWddO1xuXG4gIHRyeSB7XG4gICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdW5kZWZpbmVkO1xuICAgIHZhciB1bm1hc2tlZCA9IHRydWU7XG4gIH0gY2F0Y2ggKGUpIHt9XG5cbiAgdmFyIHJlc3VsdCA9IG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICBpZiAodW5tYXNrZWQpIHtcbiAgICBpZiAoaXNPd24pIHtcbiAgICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHRhZztcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0UmF3VGFnO1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyB1c2luZyBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG9iamVjdFRvU3RyaW5nO1xuIiwiaW1wb3J0IFN5bWJvbCBmcm9tICcuL19TeW1ib2wuanMnO1xuaW1wb3J0IGdldFJhd1RhZyBmcm9tICcuL19nZXRSYXdUYWcuanMnO1xuaW1wb3J0IG9iamVjdFRvU3RyaW5nIGZyb20gJy4vX29iamVjdFRvU3RyaW5nLmpzJztcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG51bGxUYWcgPSAnW29iamVjdCBOdWxsXScsXG4gICAgdW5kZWZpbmVkVGFnID0gJ1tvYmplY3QgVW5kZWZpbmVkXSc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHN5bVRvU3RyaW5nVGFnID0gU3ltYm9sID8gU3ltYm9sLnRvU3RyaW5nVGFnIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBnZXRUYWdgIHdpdGhvdXQgZmFsbGJhY2tzIGZvciBidWdneSBlbnZpcm9ubWVudHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUdldFRhZyh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkVGFnIDogbnVsbFRhZztcbiAgfVxuICByZXR1cm4gKHN5bVRvU3RyaW5nVGFnICYmIHN5bVRvU3RyaW5nVGFnIGluIE9iamVjdCh2YWx1ZSkpXG4gICAgPyBnZXRSYXdUYWcodmFsdWUpXG4gICAgOiBvYmplY3RUb1N0cmluZyh2YWx1ZSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGJhc2VHZXRUYWc7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLiBBIHZhbHVlIGlzIG9iamVjdC1saWtlIGlmIGl0J3Mgbm90IGBudWxsYFxuICogYW5kIGhhcyBhIGB0eXBlb2ZgIHJlc3VsdCBvZiBcIm9iamVjdFwiLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxuZXhwb3J0IGRlZmF1bHQgaXNPYmplY3RMaWtlO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGFuIGBBcnJheWAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG5cbmV4cG9ydCBkZWZhdWx0IGlzQXJyYXk7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZVxuICogW2xhbmd1YWdlIHR5cGVdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzKVxuICogb2YgYE9iamVjdGAuIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChfLm5vb3ApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaXNPYmplY3Q7XG4iLCIvKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgdGhlIGZpcnN0IGFyZ3VtZW50IGl0IHJlY2VpdmVzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcGFyYW0geyp9IHZhbHVlIEFueSB2YWx1ZS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIGB2YWx1ZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSB9O1xuICpcbiAqIGNvbnNvbGUubG9nKF8uaWRlbnRpdHkob2JqZWN0KSA9PT0gb2JqZWN0KTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gaWRlbnRpdHkodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpZGVudGl0eTtcbiIsImltcG9ydCBiYXNlR2V0VGFnIGZyb20gJy4vX2Jhc2VHZXRUYWcuanMnO1xuaW1wb3J0IGlzT2JqZWN0IGZyb20gJy4vaXNPYmplY3QuanMnO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXN5bmNUYWcgPSAnW29iamVjdCBBc3luY0Z1bmN0aW9uXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgZ2VuVGFnID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJyxcbiAgICBwcm94eVRhZyA9ICdbb2JqZWN0IFByb3h5XSc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBGdW5jdGlvbmAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgZnVuY3Rpb24sIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0Z1bmN0aW9uKF8pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNGdW5jdGlvbigvYWJjLyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vIFRoZSB1c2Ugb2YgYE9iamVjdCN0b1N0cmluZ2AgYXZvaWRzIGlzc3VlcyB3aXRoIHRoZSBgdHlwZW9mYCBvcGVyYXRvclxuICAvLyBpbiBTYWZhcmkgOSB3aGljaCByZXR1cm5zICdvYmplY3QnIGZvciB0eXBlZCBhcnJheXMgYW5kIG90aGVyIGNvbnN0cnVjdG9ycy5cbiAgdmFyIHRhZyA9IGJhc2VHZXRUYWcodmFsdWUpO1xuICByZXR1cm4gdGFnID09IGZ1bmNUYWcgfHwgdGFnID09IGdlblRhZyB8fCB0YWcgPT0gYXN5bmNUYWcgfHwgdGFnID09IHByb3h5VGFnO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpc0Z1bmN0aW9uO1xuIiwiaW1wb3J0IHJvb3QgZnJvbSAnLi9fcm9vdC5qcyc7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBvdmVycmVhY2hpbmcgY29yZS1qcyBzaGltcy4gKi9cbnZhciBjb3JlSnNEYXRhID0gcm9vdFsnX19jb3JlLWpzX3NoYXJlZF9fJ107XG5cbmV4cG9ydCBkZWZhdWx0IGNvcmVKc0RhdGE7XG4iLCJpbXBvcnQgY29yZUpzRGF0YSBmcm9tICcuL19jb3JlSnNEYXRhLmpzJztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG1ldGhvZHMgbWFzcXVlcmFkaW5nIGFzIG5hdGl2ZS4gKi9cbnZhciBtYXNrU3JjS2V5ID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgdWlkID0gL1teLl0rJC8uZXhlYyhjb3JlSnNEYXRhICYmIGNvcmVKc0RhdGEua2V5cyAmJiBjb3JlSnNEYXRhLmtleXMuSUVfUFJPVE8gfHwgJycpO1xuICByZXR1cm4gdWlkID8gKCdTeW1ib2woc3JjKV8xLicgKyB1aWQpIDogJyc7XG59KCkpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgZnVuY2AgaGFzIGl0cyBzb3VyY2UgbWFza2VkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgZnVuY2AgaXMgbWFza2VkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzTWFza2VkKGZ1bmMpIHtcbiAgcmV0dXJuICEhbWFza1NyY0tleSAmJiAobWFza1NyY0tleSBpbiBmdW5jKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaXNNYXNrZWQ7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byByZXNvbHZlIHRoZSBkZWNvbXBpbGVkIHNvdXJjZSBvZiBmdW5jdGlvbnMuICovXG52YXIgZnVuY1RvU3RyaW5nID0gZnVuY1Byb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENvbnZlcnRzIGBmdW5jYCB0byBpdHMgc291cmNlIGNvZGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBzb3VyY2UgY29kZS5cbiAqL1xuZnVuY3Rpb24gdG9Tb3VyY2UoZnVuYykge1xuICBpZiAoZnVuYyAhPSBudWxsKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBmdW5jVG9TdHJpbmcuY2FsbChmdW5jKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gKGZ1bmMgKyAnJyk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHRvU291cmNlO1xuIiwiaW1wb3J0IGlzRnVuY3Rpb24gZnJvbSAnLi9pc0Z1bmN0aW9uLmpzJztcbmltcG9ydCBpc01hc2tlZCBmcm9tICcuL19pc01hc2tlZC5qcyc7XG5pbXBvcnQgaXNPYmplY3QgZnJvbSAnLi9pc09iamVjdC5qcyc7XG5pbXBvcnQgdG9Tb3VyY2UgZnJvbSAnLi9fdG9Tb3VyY2UuanMnO1xuXG4vKipcbiAqIFVzZWQgdG8gbWF0Y2ggYFJlZ0V4cGBcbiAqIFtzeW50YXggY2hhcmFjdGVyc10oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtcGF0dGVybnMpLlxuICovXG52YXIgcmVSZWdFeHBDaGFyID0gL1tcXFxcXiQuKis/KClbXFxde318XS9nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaG9zdCBjb25zdHJ1Y3RvcnMgKFNhZmFyaSkuICovXG52YXIgcmVJc0hvc3RDdG9yID0gL15cXFtvYmplY3QgLis/Q29uc3RydWN0b3JcXF0kLztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGZ1bmNQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZSxcbiAgICBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmdW5jVG9TdHJpbmcgPSBmdW5jUHJvdG8udG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBpZiBhIG1ldGhvZCBpcyBuYXRpdmUuICovXG52YXIgcmVJc05hdGl2ZSA9IFJlZ0V4cCgnXicgK1xuICBmdW5jVG9TdHJpbmcuY2FsbChoYXNPd25Qcm9wZXJ0eSkucmVwbGFjZShyZVJlZ0V4cENoYXIsICdcXFxcJCYnKVxuICAucmVwbGFjZSgvaGFzT3duUHJvcGVydHl8KGZ1bmN0aW9uKS4qPyg/PVxcXFxcXCgpfCBmb3IgLis/KD89XFxcXFxcXSkvZywgJyQxLio/JykgKyAnJCdcbik7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNOYXRpdmVgIHdpdGhvdXQgYmFkIHNoaW0gY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgbmF0aXZlIGZ1bmN0aW9uLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzTmF0aXZlKHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3QodmFsdWUpIHx8IGlzTWFza2VkKHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgcGF0dGVybiA9IGlzRnVuY3Rpb24odmFsdWUpID8gcmVJc05hdGl2ZSA6IHJlSXNIb3N0Q3RvcjtcbiAgcmV0dXJuIHBhdHRlcm4udGVzdCh0b1NvdXJjZSh2YWx1ZSkpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBiYXNlSXNOYXRpdmU7XG4iLCIvKipcbiAqIEdldHMgdGhlIHZhbHVlIGF0IGBrZXlgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHByb3BlcnR5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBnZXRWYWx1ZShvYmplY3QsIGtleSkge1xuICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3Rba2V5XTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0VmFsdWU7XG4iLCJpbXBvcnQgYmFzZUlzTmF0aXZlIGZyb20gJy4vX2Jhc2VJc05hdGl2ZS5qcyc7XG5pbXBvcnQgZ2V0VmFsdWUgZnJvbSAnLi9fZ2V0VmFsdWUuanMnO1xuXG4vKipcbiAqIEdldHMgdGhlIG5hdGl2ZSBmdW5jdGlvbiBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBtZXRob2QgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGZ1bmN0aW9uIGlmIGl0J3MgbmF0aXZlLCBlbHNlIGB1bmRlZmluZWRgLlxuICovXG5mdW5jdGlvbiBnZXROYXRpdmUob2JqZWN0LCBrZXkpIHtcbiAgdmFyIHZhbHVlID0gZ2V0VmFsdWUob2JqZWN0LCBrZXkpO1xuICByZXR1cm4gYmFzZUlzTmF0aXZlKHZhbHVlKSA/IHZhbHVlIDogdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXROYXRpdmU7XG4iLCJpbXBvcnQgaXNPYmplY3QgZnJvbSAnLi9pc09iamVjdC5qcyc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdENyZWF0ZSA9IE9iamVjdC5jcmVhdGU7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uY3JlYXRlYCB3aXRob3V0IHN1cHBvcnQgZm9yIGFzc2lnbmluZ1xuICogcHJvcGVydGllcyB0byB0aGUgY3JlYXRlZCBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBwcm90byBUaGUgb2JqZWN0IHRvIGluaGVyaXQgZnJvbS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5ldyBvYmplY3QuXG4gKi9cbnZhciBiYXNlQ3JlYXRlID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBvYmplY3QoKSB7fVxuICByZXR1cm4gZnVuY3Rpb24ocHJvdG8pIHtcbiAgICBpZiAoIWlzT2JqZWN0KHByb3RvKSkge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgICBpZiAob2JqZWN0Q3JlYXRlKSB7XG4gICAgICByZXR1cm4gb2JqZWN0Q3JlYXRlKHByb3RvKTtcbiAgICB9XG4gICAgb2JqZWN0LnByb3RvdHlwZSA9IHByb3RvO1xuICAgIHZhciByZXN1bHQgPSBuZXcgb2JqZWN0O1xuICAgIG9iamVjdC5wcm90b3R5cGUgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn0oKSk7XG5cbmV4cG9ydCBkZWZhdWx0IGJhc2VDcmVhdGU7XG4iLCIvKipcbiAqIEEgZmFzdGVyIGFsdGVybmF0aXZlIHRvIGBGdW5jdGlvbiNhcHBseWAsIHRoaXMgZnVuY3Rpb24gaW52b2tlcyBgZnVuY2BcbiAqIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIGB0aGlzQXJnYCBhbmQgdGhlIGFyZ3VtZW50cyBvZiBgYXJnc2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGludm9rZS5cbiAqIEBwYXJhbSB7Kn0gdGhpc0FyZyBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGZ1bmNgLlxuICogQHBhcmFtIHtBcnJheX0gYXJncyBUaGUgYXJndW1lbnRzIHRvIGludm9rZSBgZnVuY2Agd2l0aC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSByZXN1bHQgb2YgYGZ1bmNgLlxuICovXG5mdW5jdGlvbiBhcHBseShmdW5jLCB0aGlzQXJnLCBhcmdzKSB7XG4gIHN3aXRjaCAoYXJncy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZyk7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIGFyZ3NbMF0pO1xuICAgIGNhc2UgMjogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG4gIH1cbiAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFwcGx5O1xuIiwiLyoqXG4gKiBDb3BpZXMgdGhlIHZhbHVlcyBvZiBgc291cmNlYCB0byBgYXJyYXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBzb3VyY2UgVGhlIGFycmF5IHRvIGNvcHkgdmFsdWVzIGZyb20uXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXk9W11dIFRoZSBhcnJheSB0byBjb3B5IHZhbHVlcyB0by5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBjb3B5QXJyYXkoc291cmNlLCBhcnJheSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHNvdXJjZS5sZW5ndGg7XG5cbiAgYXJyYXkgfHwgKGFycmF5ID0gQXJyYXkobGVuZ3RoKSk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgYXJyYXlbaW5kZXhdID0gc291cmNlW2luZGV4XTtcbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvcHlBcnJheTtcbiIsIi8qKiBVc2VkIHRvIGRldGVjdCBob3QgZnVuY3Rpb25zIGJ5IG51bWJlciBvZiBjYWxscyB3aXRoaW4gYSBzcGFuIG9mIG1pbGxpc2Vjb25kcy4gKi9cbnZhciBIT1RfQ09VTlQgPSA4MDAsXG4gICAgSE9UX1NQQU4gPSAxNjtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU5vdyA9IERhdGUubm93O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0J2xsIHNob3J0IG91dCBhbmQgaW52b2tlIGBpZGVudGl0eWAgaW5zdGVhZFxuICogb2YgYGZ1bmNgIHdoZW4gaXQncyBjYWxsZWQgYEhPVF9DT1VOVGAgb3IgbW9yZSB0aW1lcyBpbiBgSE9UX1NQQU5gXG4gKiBtaWxsaXNlY29uZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHJlc3RyaWN0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgc2hvcnRhYmxlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBzaG9ydE91dChmdW5jKSB7XG4gIHZhciBjb3VudCA9IDAsXG4gICAgICBsYXN0Q2FsbGVkID0gMDtcblxuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN0YW1wID0gbmF0aXZlTm93KCksXG4gICAgICAgIHJlbWFpbmluZyA9IEhPVF9TUEFOIC0gKHN0YW1wIC0gbGFzdENhbGxlZCk7XG5cbiAgICBsYXN0Q2FsbGVkID0gc3RhbXA7XG4gICAgaWYgKHJlbWFpbmluZyA+IDApIHtcbiAgICAgIGlmICgrK2NvdW50ID49IEhPVF9DT1VOVCkge1xuICAgICAgICByZXR1cm4gYXJndW1lbnRzWzBdO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb3VudCA9IDA7XG4gICAgfVxuICAgIHJldHVybiBmdW5jLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgc2hvcnRPdXQ7XG4iLCIvKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYHZhbHVlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDIuNC4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcmV0dXJuIGZyb20gdGhlIG5ldyBmdW5jdGlvbi5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGNvbnN0YW50IGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0cyA9IF8udGltZXMoMiwgXy5jb25zdGFudCh7ICdhJzogMSB9KSk7XG4gKlxuICogY29uc29sZS5sb2cob2JqZWN0cyk7XG4gKiAvLyA9PiBbeyAnYSc6IDEgfSwgeyAnYSc6IDEgfV1cbiAqXG4gKiBjb25zb2xlLmxvZyhvYmplY3RzWzBdID09PSBvYmplY3RzWzFdKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gY29uc3RhbnQodmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY29uc3RhbnQ7XG4iLCJpbXBvcnQgZ2V0TmF0aXZlIGZyb20gJy4vX2dldE5hdGl2ZS5qcyc7XG5cbnZhciBkZWZpbmVQcm9wZXJ0eSA9IChmdW5jdGlvbigpIHtcbiAgdHJ5IHtcbiAgICB2YXIgZnVuYyA9IGdldE5hdGl2ZShPYmplY3QsICdkZWZpbmVQcm9wZXJ0eScpO1xuICAgIGZ1bmMoe30sICcnLCB7fSk7XG4gICAgcmV0dXJuIGZ1bmM7XG4gIH0gY2F0Y2ggKGUpIHt9XG59KCkpO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVQcm9wZXJ0eTtcbiIsImltcG9ydCBjb25zdGFudCBmcm9tICcuL2NvbnN0YW50LmpzJztcbmltcG9ydCBkZWZpbmVQcm9wZXJ0eSBmcm9tICcuL19kZWZpbmVQcm9wZXJ0eS5qcyc7XG5pbXBvcnQgaWRlbnRpdHkgZnJvbSAnLi9pZGVudGl0eS5qcyc7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYHNldFRvU3RyaW5nYCB3aXRob3V0IHN1cHBvcnQgZm9yIGhvdCBsb29wIHNob3J0aW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdHJpbmcgVGhlIGB0b1N0cmluZ2AgcmVzdWx0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIGBmdW5jYC5cbiAqL1xudmFyIGJhc2VTZXRUb1N0cmluZyA9ICFkZWZpbmVQcm9wZXJ0eSA/IGlkZW50aXR5IDogZnVuY3Rpb24oZnVuYywgc3RyaW5nKSB7XG4gIHJldHVybiBkZWZpbmVQcm9wZXJ0eShmdW5jLCAndG9TdHJpbmcnLCB7XG4gICAgJ2NvbmZpZ3VyYWJsZSc6IHRydWUsXG4gICAgJ2VudW1lcmFibGUnOiBmYWxzZSxcbiAgICAndmFsdWUnOiBjb25zdGFudChzdHJpbmcpLFxuICAgICd3cml0YWJsZSc6IHRydWVcbiAgfSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBiYXNlU2V0VG9TdHJpbmc7XG4iLCJpbXBvcnQgYmFzZVNldFRvU3RyaW5nIGZyb20gJy4vX2Jhc2VTZXRUb1N0cmluZy5qcyc7XG5pbXBvcnQgc2hvcnRPdXQgZnJvbSAnLi9fc2hvcnRPdXQuanMnO1xuXG4vKipcbiAqIFNldHMgdGhlIGB0b1N0cmluZ2AgbWV0aG9kIG9mIGBmdW5jYCB0byByZXR1cm4gYHN0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHN0cmluZyBUaGUgYHRvU3RyaW5nYCByZXN1bHQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgYGZ1bmNgLlxuICovXG52YXIgc2V0VG9TdHJpbmcgPSBzaG9ydE91dChiYXNlU2V0VG9TdHJpbmcpO1xuXG5leHBvcnQgZGVmYXVsdCBzZXRUb1N0cmluZztcbiIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmZvckVhY2hgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvclxuICogaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5XSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBhcnJheUVhY2goYXJyYXksIGl0ZXJhdGVlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBpZiAoaXRlcmF0ZWUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpID09PSBmYWxzZSkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXJyYXlFYWNoO1xuIiwiLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCB1bnNpZ25lZCBpbnRlZ2VyIHZhbHVlcy4gKi9cbnZhciByZUlzVWludCA9IC9eKD86MHxbMS05XVxcZCopJC87XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGluZGV4LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbGVuZ3RoPU1BWF9TQUZFX0lOVEVHRVJdIFRoZSB1cHBlciBib3VuZHMgb2YgYSB2YWxpZCBpbmRleC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgaW5kZXgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJbmRleCh2YWx1ZSwgbGVuZ3RoKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICBsZW5ndGggPSBsZW5ndGggPT0gbnVsbCA/IE1BWF9TQUZFX0lOVEVHRVIgOiBsZW5ndGg7XG5cbiAgcmV0dXJuICEhbGVuZ3RoICYmXG4gICAgKHR5cGUgPT0gJ251bWJlcicgfHxcbiAgICAgICh0eXBlICE9ICdzeW1ib2wnICYmIHJlSXNVaW50LnRlc3QodmFsdWUpKSkgJiZcbiAgICAgICAgKHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPCBsZW5ndGgpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpc0luZGV4O1xuIiwiaW1wb3J0IGRlZmluZVByb3BlcnR5IGZyb20gJy4vX2RlZmluZVByb3BlcnR5LmpzJztcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgYXNzaWduVmFsdWVgIGFuZCBgYXNzaWduTWVyZ2VWYWx1ZWAgd2l0aG91dFxuICogdmFsdWUgY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBhc3NpZ24uXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBhc3NpZ24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VBc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgaWYgKGtleSA9PSAnX19wcm90b19fJyAmJiBkZWZpbmVQcm9wZXJ0eSkge1xuICAgIGRlZmluZVByb3BlcnR5KG9iamVjdCwga2V5LCB7XG4gICAgICAnY29uZmlndXJhYmxlJzogdHJ1ZSxcbiAgICAgICdlbnVtZXJhYmxlJzogdHJ1ZSxcbiAgICAgICd2YWx1ZSc6IHZhbHVlLFxuICAgICAgJ3dyaXRhYmxlJzogdHJ1ZVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgYmFzZUFzc2lnblZhbHVlO1xuIiwiLyoqXG4gKiBQZXJmb3JtcyBhXG4gKiBbYFNhbWVWYWx1ZVplcm9gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1zYW1ldmFsdWV6ZXJvKVxuICogY29tcGFyaXNvbiBiZXR3ZWVuIHR3byB2YWx1ZXMgdG8gZGV0ZXJtaW5lIGlmIHRoZXkgYXJlIGVxdWl2YWxlbnQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0geyp9IG90aGVyIFRoZSBvdGhlciB2YWx1ZSB0byBjb21wYXJlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxIH07XG4gKiB2YXIgb3RoZXIgPSB7ICdhJzogMSB9O1xuICpcbiAqIF8uZXEob2JqZWN0LCBvYmplY3QpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uZXEob2JqZWN0LCBvdGhlcik7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uZXEoJ2EnLCAnYScpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uZXEoJ2EnLCBPYmplY3QoJ2EnKSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uZXEoTmFOLCBOYU4pO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBlcSh2YWx1ZSwgb3RoZXIpIHtcbiAgcmV0dXJuIHZhbHVlID09PSBvdGhlciB8fCAodmFsdWUgIT09IHZhbHVlICYmIG90aGVyICE9PSBvdGhlcik7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGVxO1xuIiwiaW1wb3J0IGJhc2VBc3NpZ25WYWx1ZSBmcm9tICcuL19iYXNlQXNzaWduVmFsdWUuanMnO1xuaW1wb3J0IGVxIGZyb20gJy4vZXEuanMnO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEFzc2lnbnMgYHZhbHVlYCB0byBga2V5YCBvZiBgb2JqZWN0YCBpZiB0aGUgZXhpc3RpbmcgdmFsdWUgaXMgbm90IGVxdWl2YWxlbnRcbiAqIHVzaW5nIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG4gKiBmb3IgZXF1YWxpdHkgY29tcGFyaXNvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGFzc2lnbi5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGFzc2lnbi5cbiAqL1xuZnVuY3Rpb24gYXNzaWduVmFsdWUob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIHZhciBvYmpWYWx1ZSA9IG9iamVjdFtrZXldO1xuICBpZiAoIShoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSAmJiBlcShvYmpWYWx1ZSwgdmFsdWUpKSB8fFxuICAgICAgKHZhbHVlID09PSB1bmRlZmluZWQgJiYgIShrZXkgaW4gb2JqZWN0KSkpIHtcbiAgICBiYXNlQXNzaWduVmFsdWUob2JqZWN0LCBrZXksIHZhbHVlKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBhc3NpZ25WYWx1ZTtcbiIsImltcG9ydCBhc3NpZ25WYWx1ZSBmcm9tICcuL19hc3NpZ25WYWx1ZS5qcyc7XG5pbXBvcnQgYmFzZUFzc2lnblZhbHVlIGZyb20gJy4vX2Jhc2VBc3NpZ25WYWx1ZS5qcyc7XG5cbi8qKlxuICogQ29waWVzIHByb3BlcnRpZXMgb2YgYHNvdXJjZWAgdG8gYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgZnJvbS5cbiAqIEBwYXJhbSB7QXJyYXl9IHByb3BzIFRoZSBwcm9wZXJ0eSBpZGVudGlmaWVycyB0byBjb3B5LlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3Q9e31dIFRoZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIHRvLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29waWVkIHZhbHVlcy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGNvcHlPYmplY3Qoc291cmNlLCBwcm9wcywgb2JqZWN0LCBjdXN0b21pemVyKSB7XG4gIHZhciBpc05ldyA9ICFvYmplY3Q7XG4gIG9iamVjdCB8fCAob2JqZWN0ID0ge30pO1xuXG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGtleSA9IHByb3BzW2luZGV4XTtcblxuICAgIHZhciBuZXdWYWx1ZSA9IGN1c3RvbWl6ZXJcbiAgICAgID8gY3VzdG9taXplcihvYmplY3Rba2V5XSwgc291cmNlW2tleV0sIGtleSwgb2JqZWN0LCBzb3VyY2UpXG4gICAgICA6IHVuZGVmaW5lZDtcblxuICAgIGlmIChuZXdWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBuZXdWYWx1ZSA9IHNvdXJjZVtrZXldO1xuICAgIH1cbiAgICBpZiAoaXNOZXcpIHtcbiAgICAgIGJhc2VBc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgbmV3VmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgbmV3VmFsdWUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gb2JqZWN0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjb3B5T2JqZWN0O1xuIiwiaW1wb3J0IGFwcGx5IGZyb20gJy4vX2FwcGx5LmpzJztcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU1heCA9IE1hdGgubWF4O1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZVJlc3RgIHdoaWNoIHRyYW5zZm9ybXMgdGhlIHJlc3QgYXJyYXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGFwcGx5IGEgcmVzdCBwYXJhbWV0ZXIgdG8uXG4gKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0PWZ1bmMubGVuZ3RoLTFdIFRoZSBzdGFydCBwb3NpdGlvbiBvZiB0aGUgcmVzdCBwYXJhbWV0ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSB0cmFuc2Zvcm0gVGhlIHJlc3QgYXJyYXkgdHJhbnNmb3JtLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIG92ZXJSZXN0KGZ1bmMsIHN0YXJ0LCB0cmFuc2Zvcm0pIHtcbiAgc3RhcnQgPSBuYXRpdmVNYXgoc3RhcnQgPT09IHVuZGVmaW5lZCA/IChmdW5jLmxlbmd0aCAtIDEpIDogc3RhcnQsIDApO1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICAgIGluZGV4ID0gLTEsXG4gICAgICAgIGxlbmd0aCA9IG5hdGl2ZU1heChhcmdzLmxlbmd0aCAtIHN0YXJ0LCAwKSxcbiAgICAgICAgYXJyYXkgPSBBcnJheShsZW5ndGgpO1xuXG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIGFycmF5W2luZGV4XSA9IGFyZ3Nbc3RhcnQgKyBpbmRleF07XG4gICAgfVxuICAgIGluZGV4ID0gLTE7XG4gICAgdmFyIG90aGVyQXJncyA9IEFycmF5KHN0YXJ0ICsgMSk7XG4gICAgd2hpbGUgKCsraW5kZXggPCBzdGFydCkge1xuICAgICAgb3RoZXJBcmdzW2luZGV4XSA9IGFyZ3NbaW5kZXhdO1xuICAgIH1cbiAgICBvdGhlckFyZ3Nbc3RhcnRdID0gdHJhbnNmb3JtKGFycmF5KTtcbiAgICByZXR1cm4gYXBwbHkoZnVuYywgdGhpcywgb3RoZXJBcmdzKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgb3ZlclJlc3Q7XG4iLCJpbXBvcnQgaWRlbnRpdHkgZnJvbSAnLi9pZGVudGl0eS5qcyc7XG5pbXBvcnQgb3ZlclJlc3QgZnJvbSAnLi9fb3ZlclJlc3QuanMnO1xuaW1wb3J0IHNldFRvU3RyaW5nIGZyb20gJy4vX3NldFRvU3RyaW5nLmpzJztcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5yZXN0YCB3aGljaCBkb2Vzbid0IHZhbGlkYXRlIG9yIGNvZXJjZSBhcmd1bWVudHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGFwcGx5IGEgcmVzdCBwYXJhbWV0ZXIgdG8uXG4gKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0PWZ1bmMubGVuZ3RoLTFdIFRoZSBzdGFydCBwb3NpdGlvbiBvZiB0aGUgcmVzdCBwYXJhbWV0ZXIuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVJlc3QoZnVuYywgc3RhcnQpIHtcbiAgcmV0dXJuIHNldFRvU3RyaW5nKG92ZXJSZXN0KGZ1bmMsIHN0YXJ0LCBpZGVudGl0eSksIGZ1bmMgKyAnJyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGJhc2VSZXN0O1xuIiwiLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGxlbmd0aC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgbG9vc2VseSBiYXNlZCBvblxuICogW2BUb0xlbmd0aGBdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXRvbGVuZ3RoKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGxlbmd0aCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzTGVuZ3RoKDMpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNMZW5ndGgoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNMZW5ndGgoSW5maW5pdHkpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKCczJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0xlbmd0aCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInICYmXG4gICAgdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpc0xlbmd0aDtcbiIsImltcG9ydCBpc0Z1bmN0aW9uIGZyb20gJy4vaXNGdW5jdGlvbi5qcyc7XG5pbXBvcnQgaXNMZW5ndGggZnJvbSAnLi9pc0xlbmd0aC5qcyc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZS4gQSB2YWx1ZSBpcyBjb25zaWRlcmVkIGFycmF5LWxpa2UgaWYgaXQnc1xuICogbm90IGEgZnVuY3Rpb24gYW5kIGhhcyBhIGB2YWx1ZS5sZW5ndGhgIHRoYXQncyBhbiBpbnRlZ2VyIGdyZWF0ZXIgdGhhbiBvclxuICogZXF1YWwgdG8gYDBgIGFuZCBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gYE51bWJlci5NQVhfU0FGRV9JTlRFR0VSYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoJ2FiYycpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgIWlzRnVuY3Rpb24odmFsdWUpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpc0FycmF5TGlrZTtcbiIsImltcG9ydCBlcSBmcm9tICcuL2VxLmpzJztcbmltcG9ydCBpc0FycmF5TGlrZSBmcm9tICcuL2lzQXJyYXlMaWtlLmpzJztcbmltcG9ydCBpc0luZGV4IGZyb20gJy4vX2lzSW5kZXguanMnO1xuaW1wb3J0IGlzT2JqZWN0IGZyb20gJy4vaXNPYmplY3QuanMnO1xuXG4vKipcbiAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gYXJndW1lbnRzIGFyZSBmcm9tIGFuIGl0ZXJhdGVlIGNhbGwuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHBvdGVudGlhbCBpdGVyYXRlZSB2YWx1ZSBhcmd1bWVudC5cbiAqIEBwYXJhbSB7Kn0gaW5kZXggVGhlIHBvdGVudGlhbCBpdGVyYXRlZSBpbmRleCBvciBrZXkgYXJndW1lbnQuXG4gKiBAcGFyYW0geyp9IG9iamVjdCBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIG9iamVjdCBhcmd1bWVudC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYXJndW1lbnRzIGFyZSBmcm9tIGFuIGl0ZXJhdGVlIGNhbGwsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0l0ZXJhdGVlQ2FsbCh2YWx1ZSwgaW5kZXgsIG9iamVjdCkge1xuICBpZiAoIWlzT2JqZWN0KG9iamVjdCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHR5cGUgPSB0eXBlb2YgaW5kZXg7XG4gIGlmICh0eXBlID09ICdudW1iZXInXG4gICAgICAgID8gKGlzQXJyYXlMaWtlKG9iamVjdCkgJiYgaXNJbmRleChpbmRleCwgb2JqZWN0Lmxlbmd0aCkpXG4gICAgICAgIDogKHR5cGUgPT0gJ3N0cmluZycgJiYgaW5kZXggaW4gb2JqZWN0KVxuICAgICAgKSB7XG4gICAgcmV0dXJuIGVxKG9iamVjdFtpbmRleF0sIHZhbHVlKTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzSXRlcmF0ZWVDYWxsO1xuIiwiaW1wb3J0IGJhc2VSZXN0IGZyb20gJy4vX2Jhc2VSZXN0LmpzJztcbmltcG9ydCBpc0l0ZXJhdGVlQ2FsbCBmcm9tICcuL19pc0l0ZXJhdGVlQ2FsbC5qcyc7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIGxpa2UgYF8uYXNzaWduYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gYXNzaWduZXIgVGhlIGZ1bmN0aW9uIHRvIGFzc2lnbiB2YWx1ZXMuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBhc3NpZ25lciBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQXNzaWduZXIoYXNzaWduZXIpIHtcbiAgcmV0dXJuIGJhc2VSZXN0KGZ1bmN0aW9uKG9iamVjdCwgc291cmNlcykge1xuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICBsZW5ndGggPSBzb3VyY2VzLmxlbmd0aCxcbiAgICAgICAgY3VzdG9taXplciA9IGxlbmd0aCA+IDEgPyBzb3VyY2VzW2xlbmd0aCAtIDFdIDogdW5kZWZpbmVkLFxuICAgICAgICBndWFyZCA9IGxlbmd0aCA+IDIgPyBzb3VyY2VzWzJdIDogdW5kZWZpbmVkO1xuXG4gICAgY3VzdG9taXplciA9IChhc3NpZ25lci5sZW5ndGggPiAzICYmIHR5cGVvZiBjdXN0b21pemVyID09ICdmdW5jdGlvbicpXG4gICAgICA/IChsZW5ndGgtLSwgY3VzdG9taXplcilcbiAgICAgIDogdW5kZWZpbmVkO1xuXG4gICAgaWYgKGd1YXJkICYmIGlzSXRlcmF0ZWVDYWxsKHNvdXJjZXNbMF0sIHNvdXJjZXNbMV0sIGd1YXJkKSkge1xuICAgICAgY3VzdG9taXplciA9IGxlbmd0aCA8IDMgPyB1bmRlZmluZWQgOiBjdXN0b21pemVyO1xuICAgICAgbGVuZ3RoID0gMTtcbiAgICB9XG4gICAgb2JqZWN0ID0gT2JqZWN0KG9iamVjdCk7XG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIHZhciBzb3VyY2UgPSBzb3VyY2VzW2luZGV4XTtcbiAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgYXNzaWduZXIob2JqZWN0LCBzb3VyY2UsIGluZGV4LCBjdXN0b21pemVyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUFzc2lnbmVyO1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBsaWtlbHkgYSBwcm90b3R5cGUgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgcHJvdG90eXBlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzUHJvdG90eXBlKHZhbHVlKSB7XG4gIHZhciBDdG9yID0gdmFsdWUgJiYgdmFsdWUuY29uc3RydWN0b3IsXG4gICAgICBwcm90byA9ICh0eXBlb2YgQ3RvciA9PSAnZnVuY3Rpb24nICYmIEN0b3IucHJvdG90eXBlKSB8fCBvYmplY3RQcm90bztcblxuICByZXR1cm4gdmFsdWUgPT09IHByb3RvO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpc1Byb3RvdHlwZTtcbiIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udGltZXNgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kc1xuICogb3IgbWF4IGFycmF5IGxlbmd0aCBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBuIFRoZSBudW1iZXIgb2YgdGltZXMgdG8gaW52b2tlIGBpdGVyYXRlZWAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiByZXN1bHRzLlxuICovXG5mdW5jdGlvbiBiYXNlVGltZXMobiwgaXRlcmF0ZWUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBBcnJheShuKTtcblxuICB3aGlsZSAoKytpbmRleCA8IG4pIHtcbiAgICByZXN1bHRbaW5kZXhdID0gaXRlcmF0ZWUoaW5kZXgpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGJhc2VUaW1lcztcbiIsImltcG9ydCBiYXNlR2V0VGFnIGZyb20gJy4vX2Jhc2VHZXRUYWcuanMnO1xuaW1wb3J0IGlzT2JqZWN0TGlrZSBmcm9tICcuL2lzT2JqZWN0TGlrZS5qcyc7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXSc7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNBcmd1bWVudHNgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGBhcmd1bWVudHNgIG9iamVjdCxcbiAqL1xuZnVuY3Rpb24gYmFzZUlzQXJndW1lbnRzKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGJhc2VHZXRUYWcodmFsdWUpID09IGFyZ3NUYWc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGJhc2VJc0FyZ3VtZW50cztcbiIsImltcG9ydCBiYXNlSXNBcmd1bWVudHMgZnJvbSAnLi9fYmFzZUlzQXJndW1lbnRzLmpzJztcbmltcG9ydCBpc09iamVjdExpa2UgZnJvbSAnLi9pc09iamVjdExpa2UuanMnO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IG9iamVjdFByb3RvLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGxpa2VseSBhbiBgYXJndW1lbnRzYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcmd1bWVudHMgPSBiYXNlSXNBcmd1bWVudHMoZnVuY3Rpb24oKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPyBiYXNlSXNBcmd1bWVudHMgOiBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCAnY2FsbGVlJykgJiZcbiAgICAhcHJvcGVydHlJc0VudW1lcmFibGUuY2FsbCh2YWx1ZSwgJ2NhbGxlZScpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgaXNBcmd1bWVudHM7XG4iLCIvKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgYGZhbHNlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMTMuMFxuICogQGNhdGVnb3J5IFV0aWxcbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udGltZXMoMiwgXy5zdHViRmFsc2UpO1xuICogLy8gPT4gW2ZhbHNlLCBmYWxzZV1cbiAqL1xuZnVuY3Rpb24gc3R1YkZhbHNlKCkge1xuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHN0dWJGYWxzZTtcbiIsImltcG9ydCByb290IGZyb20gJy4vX3Jvb3QuanMnO1xuaW1wb3J0IHN0dWJGYWxzZSBmcm9tICcuL3N0dWJGYWxzZS5qcyc7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG52YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbnZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbi8qKiBEZXRlY3QgdGhlIHBvcHVsYXIgQ29tbW9uSlMgZXh0ZW5zaW9uIGBtb2R1bGUuZXhwb3J0c2AuICovXG52YXIgbW9kdWxlRXhwb3J0cyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5leHBvcnRzID09PSBmcmVlRXhwb3J0cztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgQnVmZmVyID0gbW9kdWxlRXhwb3J0cyA/IHJvb3QuQnVmZmVyIDogdW5kZWZpbmVkO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlSXNCdWZmZXIgPSBCdWZmZXIgPyBCdWZmZXIuaXNCdWZmZXIgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBidWZmZXIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjMuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBidWZmZXIsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0J1ZmZlcihuZXcgQnVmZmVyKDIpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQnVmZmVyKG5ldyBVaW50OEFycmF5KDIpKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0J1ZmZlciA9IG5hdGl2ZUlzQnVmZmVyIHx8IHN0dWJGYWxzZTtcblxuZXhwb3J0IGRlZmF1bHQgaXNCdWZmZXI7XG4iLCJpbXBvcnQgYmFzZUdldFRhZyBmcm9tICcuL19iYXNlR2V0VGFnLmpzJztcbmltcG9ydCBpc0xlbmd0aCBmcm9tICcuL2lzTGVuZ3RoLmpzJztcbmltcG9ydCBpc09iamVjdExpa2UgZnJvbSAnLi9pc09iamVjdExpa2UuanMnO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nLFxuICAgIGFycmF5VGFnID0gJ1tvYmplY3QgQXJyYXldJyxcbiAgICBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgZXJyb3JUYWcgPSAnW29iamVjdCBFcnJvcl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nLFxuICAgIHdlYWtNYXBUYWcgPSAnW29iamVjdCBXZWFrTWFwXSc7XG5cbnZhciBhcnJheUJ1ZmZlclRhZyA9ICdbb2JqZWN0IEFycmF5QnVmZmVyXScsXG4gICAgZGF0YVZpZXdUYWcgPSAnW29iamVjdCBEYXRhVmlld10nLFxuICAgIGZsb2F0MzJUYWcgPSAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICBmbG9hdDY0VGFnID0gJ1tvYmplY3QgRmxvYXQ2NEFycmF5XScsXG4gICAgaW50OFRhZyA9ICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgIGludDE2VGFnID0gJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgIGludDMyVGFnID0gJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgIHVpbnQ4VGFnID0gJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgIHVpbnQ4Q2xhbXBlZFRhZyA9ICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgdWludDE2VGFnID0gJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICB1aW50MzJUYWcgPSAnW29iamVjdCBVaW50MzJBcnJheV0nO1xuXG4vKiogVXNlZCB0byBpZGVudGlmeSBgdG9TdHJpbmdUYWdgIHZhbHVlcyBvZiB0eXBlZCBhcnJheXMuICovXG52YXIgdHlwZWRBcnJheVRhZ3MgPSB7fTtcbnR5cGVkQXJyYXlUYWdzW2Zsb2F0MzJUYWddID0gdHlwZWRBcnJheVRhZ3NbZmxvYXQ2NFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbaW50OFRhZ10gPSB0eXBlZEFycmF5VGFnc1tpbnQxNlRhZ10gPVxudHlwZWRBcnJheVRhZ3NbaW50MzJUYWddID0gdHlwZWRBcnJheVRhZ3NbdWludDhUYWddID1cbnR5cGVkQXJyYXlUYWdzW3VpbnQ4Q2xhbXBlZFRhZ10gPSB0eXBlZEFycmF5VGFnc1t1aW50MTZUYWddID1cbnR5cGVkQXJyYXlUYWdzW3VpbnQzMlRhZ10gPSB0cnVlO1xudHlwZWRBcnJheVRhZ3NbYXJnc1RhZ10gPSB0eXBlZEFycmF5VGFnc1thcnJheVRhZ10gPVxudHlwZWRBcnJheVRhZ3NbYXJyYXlCdWZmZXJUYWddID0gdHlwZWRBcnJheVRhZ3NbYm9vbFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbZGF0YVZpZXdUYWddID0gdHlwZWRBcnJheVRhZ3NbZGF0ZVRhZ10gPVxudHlwZWRBcnJheVRhZ3NbZXJyb3JUYWddID0gdHlwZWRBcnJheVRhZ3NbZnVuY1RhZ10gPVxudHlwZWRBcnJheVRhZ3NbbWFwVGFnXSA9IHR5cGVkQXJyYXlUYWdzW251bWJlclRhZ10gPVxudHlwZWRBcnJheVRhZ3Nbb2JqZWN0VGFnXSA9IHR5cGVkQXJyYXlUYWdzW3JlZ2V4cFRhZ10gPVxudHlwZWRBcnJheVRhZ3Nbc2V0VGFnXSA9IHR5cGVkQXJyYXlUYWdzW3N0cmluZ1RhZ10gPVxudHlwZWRBcnJheVRhZ3Nbd2Vha01hcFRhZ10gPSBmYWxzZTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc1R5cGVkQXJyYXlgIHdpdGhvdXQgTm9kZS5qcyBvcHRpbWl6YXRpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdHlwZWQgYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzVHlwZWRBcnJheSh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJlxuICAgIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgISF0eXBlZEFycmF5VGFnc1tiYXNlR2V0VGFnKHZhbHVlKV07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGJhc2VJc1R5cGVkQXJyYXk7XG4iLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnVuYXJ5YCB3aXRob3V0IHN1cHBvcnQgZm9yIHN0b3JpbmcgbWV0YWRhdGEuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNhcCBhcmd1bWVudHMgZm9yLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgY2FwcGVkIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlVW5hcnkoZnVuYykge1xuICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gZnVuYyh2YWx1ZSk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGJhc2VVbmFyeTtcbiIsImltcG9ydCBmcmVlR2xvYmFsIGZyb20gJy4vX2ZyZWVHbG9iYWwuanMnO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGV4cG9ydHNgLiAqL1xudmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSAmJiBleHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAuICovXG52YXIgZnJlZU1vZHVsZSA9IGZyZWVFeHBvcnRzICYmIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlICYmICFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xuXG4vKiogRGV0ZWN0IHRoZSBwb3B1bGFyIENvbW1vbkpTIGV4dGVuc2lvbiBgbW9kdWxlLmV4cG9ydHNgLiAqL1xudmFyIG1vZHVsZUV4cG9ydHMgPSBmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUuZXhwb3J0cyA9PT0gZnJlZUV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgcHJvY2Vzc2AgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVQcm9jZXNzID0gbW9kdWxlRXhwb3J0cyAmJiBmcmVlR2xvYmFsLnByb2Nlc3M7XG5cbi8qKiBVc2VkIHRvIGFjY2VzcyBmYXN0ZXIgTm9kZS5qcyBoZWxwZXJzLiAqL1xudmFyIG5vZGVVdGlsID0gKGZ1bmN0aW9uKCkge1xuICB0cnkge1xuICAgIC8vIFVzZSBgdXRpbC50eXBlc2AgZm9yIE5vZGUuanMgMTArLlxuICAgIHZhciB0eXBlcyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5yZXF1aXJlICYmIGZyZWVNb2R1bGUucmVxdWlyZSgndXRpbCcpLnR5cGVzO1xuXG4gICAgaWYgKHR5cGVzKSB7XG4gICAgICByZXR1cm4gdHlwZXM7XG4gICAgfVxuXG4gICAgLy8gTGVnYWN5IGBwcm9jZXNzLmJpbmRpbmcoJ3V0aWwnKWAgZm9yIE5vZGUuanMgPCAxMC5cbiAgICByZXR1cm4gZnJlZVByb2Nlc3MgJiYgZnJlZVByb2Nlc3MuYmluZGluZyAmJiBmcmVlUHJvY2Vzcy5iaW5kaW5nKCd1dGlsJyk7XG4gIH0gY2F0Y2ggKGUpIHt9XG59KCkpO1xuXG5leHBvcnQgZGVmYXVsdCBub2RlVXRpbDtcbiIsImltcG9ydCBiYXNlSXNUeXBlZEFycmF5IGZyb20gJy4vX2Jhc2VJc1R5cGVkQXJyYXkuanMnO1xuaW1wb3J0IGJhc2VVbmFyeSBmcm9tICcuL19iYXNlVW5hcnkuanMnO1xuaW1wb3J0IG5vZGVVdGlsIGZyb20gJy4vX25vZGVVdGlsLmpzJztcblxuLyogTm9kZS5qcyBoZWxwZXIgcmVmZXJlbmNlcy4gKi9cbnZhciBub2RlSXNUeXBlZEFycmF5ID0gbm9kZVV0aWwgJiYgbm9kZVV0aWwuaXNUeXBlZEFycmF5O1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSB0eXBlZCBhcnJheS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHR5cGVkIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNUeXBlZEFycmF5KG5ldyBVaW50OEFycmF5KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzVHlwZWRBcnJheShbXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNUeXBlZEFycmF5ID0gbm9kZUlzVHlwZWRBcnJheSA/IGJhc2VVbmFyeShub2RlSXNUeXBlZEFycmF5KSA6IGJhc2VJc1R5cGVkQXJyYXk7XG5cbmV4cG9ydCBkZWZhdWx0IGlzVHlwZWRBcnJheTtcbiIsImltcG9ydCBiYXNlVGltZXMgZnJvbSAnLi9fYmFzZVRpbWVzLmpzJztcbmltcG9ydCBpc0FyZ3VtZW50cyBmcm9tICcuL2lzQXJndW1lbnRzLmpzJztcbmltcG9ydCBpc0FycmF5IGZyb20gJy4vaXNBcnJheS5qcyc7XG5pbXBvcnQgaXNCdWZmZXIgZnJvbSAnLi9pc0J1ZmZlci5qcyc7XG5pbXBvcnQgaXNJbmRleCBmcm9tICcuL19pc0luZGV4LmpzJztcbmltcG9ydCBpc1R5cGVkQXJyYXkgZnJvbSAnLi9pc1R5cGVkQXJyYXkuanMnO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgdGhlIGFycmF5LWxpa2UgYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGluaGVyaXRlZCBTcGVjaWZ5IHJldHVybmluZyBpbmhlcml0ZWQgcHJvcGVydHkgbmFtZXMuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBhcnJheUxpa2VLZXlzKHZhbHVlLCBpbmhlcml0ZWQpIHtcbiAgdmFyIGlzQXJyID0gaXNBcnJheSh2YWx1ZSksXG4gICAgICBpc0FyZyA9ICFpc0FyciAmJiBpc0FyZ3VtZW50cyh2YWx1ZSksXG4gICAgICBpc0J1ZmYgPSAhaXNBcnIgJiYgIWlzQXJnICYmIGlzQnVmZmVyKHZhbHVlKSxcbiAgICAgIGlzVHlwZSA9ICFpc0FyciAmJiAhaXNBcmcgJiYgIWlzQnVmZiAmJiBpc1R5cGVkQXJyYXkodmFsdWUpLFxuICAgICAgc2tpcEluZGV4ZXMgPSBpc0FyciB8fCBpc0FyZyB8fCBpc0J1ZmYgfHwgaXNUeXBlLFxuICAgICAgcmVzdWx0ID0gc2tpcEluZGV4ZXMgPyBiYXNlVGltZXModmFsdWUubGVuZ3RoLCBTdHJpbmcpIDogW10sXG4gICAgICBsZW5ndGggPSByZXN1bHQubGVuZ3RoO1xuXG4gIGZvciAodmFyIGtleSBpbiB2YWx1ZSkge1xuICAgIGlmICgoaW5oZXJpdGVkIHx8IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGtleSkpICYmXG4gICAgICAgICEoc2tpcEluZGV4ZXMgJiYgKFxuICAgICAgICAgICAvLyBTYWZhcmkgOSBoYXMgZW51bWVyYWJsZSBgYXJndW1lbnRzLmxlbmd0aGAgaW4gc3RyaWN0IG1vZGUuXG4gICAgICAgICAgIGtleSA9PSAnbGVuZ3RoJyB8fFxuICAgICAgICAgICAvLyBOb2RlLmpzIDAuMTAgaGFzIGVudW1lcmFibGUgbm9uLWluZGV4IHByb3BlcnRpZXMgb24gYnVmZmVycy5cbiAgICAgICAgICAgKGlzQnVmZiAmJiAoa2V5ID09ICdvZmZzZXQnIHx8IGtleSA9PSAncGFyZW50JykpIHx8XG4gICAgICAgICAgIC8vIFBoYW50b21KUyAyIGhhcyBlbnVtZXJhYmxlIG5vbi1pbmRleCBwcm9wZXJ0aWVzIG9uIHR5cGVkIGFycmF5cy5cbiAgICAgICAgICAgKGlzVHlwZSAmJiAoa2V5ID09ICdidWZmZXInIHx8IGtleSA9PSAnYnl0ZUxlbmd0aCcgfHwga2V5ID09ICdieXRlT2Zmc2V0JykpIHx8XG4gICAgICAgICAgIC8vIFNraXAgaW5kZXggcHJvcGVydGllcy5cbiAgICAgICAgICAgaXNJbmRleChrZXksIGxlbmd0aClcbiAgICAgICAgKSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFycmF5TGlrZUtleXM7XG4iLCIvKipcbiAqIENyZWF0ZXMgYSB1bmFyeSBmdW5jdGlvbiB0aGF0IGludm9rZXMgYGZ1bmNgIHdpdGggaXRzIGFyZ3VtZW50IHRyYW5zZm9ybWVkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byB3cmFwLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gdHJhbnNmb3JtIFRoZSBhcmd1bWVudCB0cmFuc2Zvcm0uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gb3ZlckFyZyhmdW5jLCB0cmFuc2Zvcm0pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiBmdW5jKHRyYW5zZm9ybShhcmcpKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgb3ZlckFyZztcbiIsImltcG9ydCBvdmVyQXJnIGZyb20gJy4vX292ZXJBcmcuanMnO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlS2V5cyA9IG92ZXJBcmcoT2JqZWN0LmtleXMsIE9iamVjdCk7XG5cbmV4cG9ydCBkZWZhdWx0IG5hdGl2ZUtleXM7XG4iLCJpbXBvcnQgaXNQcm90b3R5cGUgZnJvbSAnLi9faXNQcm90b3R5cGUuanMnO1xuaW1wb3J0IG5hdGl2ZUtleXMgZnJvbSAnLi9fbmF0aXZlS2V5cy5qcyc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ua2V5c2Agd2hpY2ggZG9lc24ndCB0cmVhdCBzcGFyc2UgYXJyYXlzIGFzIGRlbnNlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBiYXNlS2V5cyhvYmplY3QpIHtcbiAgaWYgKCFpc1Byb3RvdHlwZShvYmplY3QpKSB7XG4gICAgcmV0dXJuIG5hdGl2ZUtleXMob2JqZWN0KTtcbiAgfVxuICB2YXIgcmVzdWx0ID0gW107XG4gIGZvciAodmFyIGtleSBpbiBPYmplY3Qob2JqZWN0KSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSAmJiBrZXkgIT0gJ2NvbnN0cnVjdG9yJykge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYmFzZUtleXM7XG4iLCJpbXBvcnQgYXJyYXlMaWtlS2V5cyBmcm9tICcuL19hcnJheUxpa2VLZXlzLmpzJztcbmltcG9ydCBiYXNlS2V5cyBmcm9tICcuL19iYXNlS2V5cy5qcyc7XG5pbXBvcnQgaXNBcnJheUxpa2UgZnJvbSAnLi9pc0FycmF5TGlrZS5qcyc7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIE5vbi1vYmplY3QgdmFsdWVzIGFyZSBjb2VyY2VkIHRvIG9iamVjdHMuIFNlZSB0aGVcbiAqIFtFUyBzcGVjXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3Qua2V5cylcbiAqIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy5rZXlzKG5ldyBGb28pO1xuICogLy8gPT4gWydhJywgJ2InXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICpcbiAqIF8ua2V5cygnaGknKTtcbiAqIC8vID0+IFsnMCcsICcxJ11cbiAqL1xuZnVuY3Rpb24ga2V5cyhvYmplY3QpIHtcbiAgcmV0dXJuIGlzQXJyYXlMaWtlKG9iamVjdCkgPyBhcnJheUxpa2VLZXlzKG9iamVjdCkgOiBiYXNlS2V5cyhvYmplY3QpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBrZXlzO1xuIiwiLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIGxpa2VcbiAqIFtgT2JqZWN0LmtleXNgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3Qua2V5cylcbiAqIGV4Y2VwdCB0aGF0IGl0IGluY2x1ZGVzIGluaGVyaXRlZCBlbnVtZXJhYmxlIHByb3BlcnRpZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIG5hdGl2ZUtleXNJbihvYmplY3QpIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBpZiAob2JqZWN0ICE9IG51bGwpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gT2JqZWN0KG9iamVjdCkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5hdGl2ZUtleXNJbjtcbiIsImltcG9ydCBpc09iamVjdCBmcm9tICcuL2lzT2JqZWN0LmpzJztcbmltcG9ydCBpc1Byb3RvdHlwZSBmcm9tICcuL19pc1Byb3RvdHlwZS5qcyc7XG5pbXBvcnQgbmF0aXZlS2V5c0luIGZyb20gJy4vX25hdGl2ZUtleXNJbi5qcyc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ua2V5c0luYCB3aGljaCBkb2Vzbid0IHRyZWF0IHNwYXJzZSBhcnJheXMgYXMgZGVuc2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VLZXlzSW4ob2JqZWN0KSB7XG4gIGlmICghaXNPYmplY3Qob2JqZWN0KSkge1xuICAgIHJldHVybiBuYXRpdmVLZXlzSW4ob2JqZWN0KTtcbiAgfVxuICB2YXIgaXNQcm90byA9IGlzUHJvdG90eXBlKG9iamVjdCksXG4gICAgICByZXN1bHQgPSBbXTtcblxuICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgaWYgKCEoa2V5ID09ICdjb25zdHJ1Y3RvcicgJiYgKGlzUHJvdG8gfHwgIWhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpKSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGJhc2VLZXlzSW47XG4iLCJpbXBvcnQgYXJyYXlMaWtlS2V5cyBmcm9tICcuL19hcnJheUxpa2VLZXlzLmpzJztcbmltcG9ydCBiYXNlS2V5c0luIGZyb20gJy4vX2Jhc2VLZXlzSW4uanMnO1xuaW1wb3J0IGlzQXJyYXlMaWtlIGZyb20gJy4vaXNBcnJheUxpa2UuanMnO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBhbmQgaW5oZXJpdGVkIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIE5vbi1vYmplY3QgdmFsdWVzIGFyZSBjb2VyY2VkIHRvIG9iamVjdHMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy5rZXlzSW4obmV3IEZvbyk7XG4gKiAvLyA9PiBbJ2EnLCAnYicsICdjJ10gKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAqL1xuZnVuY3Rpb24ga2V5c0luKG9iamVjdCkge1xuICByZXR1cm4gaXNBcnJheUxpa2Uob2JqZWN0KSA/IGFycmF5TGlrZUtleXMob2JqZWN0LCB0cnVlKSA6IGJhc2VLZXlzSW4ob2JqZWN0KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQga2V5c0luO1xuIiwiaW1wb3J0IGdldE5hdGl2ZSBmcm9tICcuL19nZXROYXRpdmUuanMnO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgbmF0aXZlQ3JlYXRlID0gZ2V0TmF0aXZlKE9iamVjdCwgJ2NyZWF0ZScpO1xuXG5leHBvcnQgZGVmYXVsdCBuYXRpdmVDcmVhdGU7XG4iLCJpbXBvcnQgbmF0aXZlQ3JlYXRlIGZyb20gJy4vX25hdGl2ZUNyZWF0ZS5qcyc7XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgaGFzaC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKi9cbmZ1bmN0aW9uIGhhc2hDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IG5hdGl2ZUNyZWF0ZSA/IG5hdGl2ZUNyZWF0ZShudWxsKSA6IHt9O1xuICB0aGlzLnNpemUgPSAwO1xufVxuXG5leHBvcnQgZGVmYXVsdCBoYXNoQ2xlYXI7XG4iLCIvKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBoYXNoLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge09iamVjdH0gaGFzaCBUaGUgaGFzaCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzaERlbGV0ZShrZXkpIHtcbiAgdmFyIHJlc3VsdCA9IHRoaXMuaGFzKGtleSkgJiYgZGVsZXRlIHRoaXMuX19kYXRhX19ba2V5XTtcbiAgdGhpcy5zaXplIC09IHJlc3VsdCA/IDEgOiAwO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBoYXNoRGVsZXRlO1xuIiwiaW1wb3J0IG5hdGl2ZUNyZWF0ZSBmcm9tICcuL19uYXRpdmVDcmVhdGUuanMnO1xuXG4vKiogVXNlZCB0byBzdGFuZC1pbiBmb3IgYHVuZGVmaW5lZGAgaGFzaCB2YWx1ZXMuICovXG52YXIgSEFTSF9VTkRFRklORUQgPSAnX19sb2Rhc2hfaGFzaF91bmRlZmluZWRfXyc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogR2V0cyB0aGUgaGFzaCB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBoYXNoR2V0KGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIGlmIChuYXRpdmVDcmVhdGUpIHtcbiAgICB2YXIgcmVzdWx0ID0gZGF0YVtrZXldO1xuICAgIHJldHVybiByZXN1bHQgPT09IEhBU0hfVU5ERUZJTkVEID8gdW5kZWZpbmVkIDogcmVzdWx0O1xuICB9XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGEsIGtleSkgPyBkYXRhW2tleV0gOiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGhhc2hHZXQ7XG4iLCJpbXBvcnQgbmF0aXZlQ3JlYXRlIGZyb20gJy4vX25hdGl2ZUNyZWF0ZS5qcyc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgaGFzaCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzaEhhcyhrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICByZXR1cm4gbmF0aXZlQ3JlYXRlID8gKGRhdGFba2V5XSAhPT0gdW5kZWZpbmVkKSA6IGhhc093blByb3BlcnR5LmNhbGwoZGF0YSwga2V5KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaGFzaEhhcztcbiIsImltcG9ydCBuYXRpdmVDcmVhdGUgZnJvbSAnLi9fbmF0aXZlQ3JlYXRlLmpzJztcblxuLyoqIFVzZWQgdG8gc3RhbmQtaW4gZm9yIGB1bmRlZmluZWRgIGhhc2ggdmFsdWVzLiAqL1xudmFyIEhBU0hfVU5ERUZJTkVEID0gJ19fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX18nO1xuXG4vKipcbiAqIFNldHMgdGhlIGhhc2ggYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBoYXNoIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBoYXNoU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICB0aGlzLnNpemUgKz0gdGhpcy5oYXMoa2V5KSA/IDAgOiAxO1xuICBkYXRhW2tleV0gPSAobmF0aXZlQ3JlYXRlICYmIHZhbHVlID09PSB1bmRlZmluZWQpID8gSEFTSF9VTkRFRklORUQgOiB2YWx1ZTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGhhc2hTZXQ7XG4iLCJpbXBvcnQgaGFzaENsZWFyIGZyb20gJy4vX2hhc2hDbGVhci5qcyc7XG5pbXBvcnQgaGFzaERlbGV0ZSBmcm9tICcuL19oYXNoRGVsZXRlLmpzJztcbmltcG9ydCBoYXNoR2V0IGZyb20gJy4vX2hhc2hHZXQuanMnO1xuaW1wb3J0IGhhc2hIYXMgZnJvbSAnLi9faGFzaEhhcy5qcyc7XG5pbXBvcnQgaGFzaFNldCBmcm9tICcuL19oYXNoU2V0LmpzJztcblxuLyoqXG4gKiBDcmVhdGVzIGEgaGFzaCBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIEhhc2goZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPT0gbnVsbCA/IDAgOiBlbnRyaWVzLmxlbmd0aDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgSGFzaGAuXG5IYXNoLnByb3RvdHlwZS5jbGVhciA9IGhhc2hDbGVhcjtcbkhhc2gucHJvdG90eXBlWydkZWxldGUnXSA9IGhhc2hEZWxldGU7XG5IYXNoLnByb3RvdHlwZS5nZXQgPSBoYXNoR2V0O1xuSGFzaC5wcm90b3R5cGUuaGFzID0gaGFzaEhhcztcbkhhc2gucHJvdG90eXBlLnNldCA9IGhhc2hTZXQ7XG5cbmV4cG9ydCBkZWZhdWx0IEhhc2g7XG4iLCIvKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIGxpc3QgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUNsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0gW107XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGxpc3RDYWNoZUNsZWFyO1xuIiwiaW1wb3J0IGVxIGZyb20gJy4vZXEuanMnO1xuXG4vKipcbiAqIEdldHMgdGhlIGluZGV4IGF0IHdoaWNoIHRoZSBga2V5YCBpcyBmb3VuZCBpbiBgYXJyYXlgIG9mIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0geyp9IGtleSBUaGUga2V5IHRvIHNlYXJjaCBmb3IuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuICovXG5mdW5jdGlvbiBhc3NvY0luZGV4T2YoYXJyYXksIGtleSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICBpZiAoZXEoYXJyYXlbbGVuZ3RoXVswXSwga2V5KSkge1xuICAgICAgcmV0dXJuIGxlbmd0aDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG5leHBvcnQgZGVmYXVsdCBhc3NvY0luZGV4T2Y7XG4iLCJpbXBvcnQgYXNzb2NJbmRleE9mIGZyb20gJy4vX2Fzc29jSW5kZXhPZi5qcyc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBhcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzcGxpY2UgPSBhcnJheVByb3RvLnNwbGljZTtcblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgbGlzdCBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlRGVsZXRlKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIGlmIChpbmRleCA8IDApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIGxhc3RJbmRleCA9IGRhdGEubGVuZ3RoIC0gMTtcbiAgaWYgKGluZGV4ID09IGxhc3RJbmRleCkge1xuICAgIGRhdGEucG9wKCk7XG4gIH0gZWxzZSB7XG4gICAgc3BsaWNlLmNhbGwoZGF0YSwgaW5kZXgsIDEpO1xuICB9XG4gIC0tdGhpcy5zaXplO1xuICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbGlzdENhY2hlRGVsZXRlO1xuIiwiaW1wb3J0IGFzc29jSW5kZXhPZiBmcm9tICcuL19hc3NvY0luZGV4T2YuanMnO1xuXG4vKipcbiAqIEdldHMgdGhlIGxpc3QgY2FjaGUgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVHZXQoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgcmV0dXJuIGluZGV4IDwgMCA/IHVuZGVmaW5lZCA6IGRhdGFbaW5kZXhdWzFdO1xufVxuXG5leHBvcnQgZGVmYXVsdCBsaXN0Q2FjaGVHZXQ7XG4iLCJpbXBvcnQgYXNzb2NJbmRleE9mIGZyb20gJy4vX2Fzc29jSW5kZXhPZi5qcyc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgbGlzdCBjYWNoZSB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVIYXMoa2V5KSB7XG4gIHJldHVybiBhc3NvY0luZGV4T2YodGhpcy5fX2RhdGFfXywga2V5KSA+IC0xO1xufVxuXG5leHBvcnQgZGVmYXVsdCBsaXN0Q2FjaGVIYXM7XG4iLCJpbXBvcnQgYXNzb2NJbmRleE9mIGZyb20gJy4vX2Fzc29jSW5kZXhPZi5qcyc7XG5cbi8qKlxuICogU2V0cyB0aGUgbGlzdCBjYWNoZSBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbGlzdCBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICBpZiAoaW5kZXggPCAwKSB7XG4gICAgKyt0aGlzLnNpemU7XG4gICAgZGF0YS5wdXNoKFtrZXksIHZhbHVlXSk7XG4gIH0gZWxzZSB7XG4gICAgZGF0YVtpbmRleF1bMV0gPSB2YWx1ZTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn1cblxuZXhwb3J0IGRlZmF1bHQgbGlzdENhY2hlU2V0O1xuIiwiaW1wb3J0IGxpc3RDYWNoZUNsZWFyIGZyb20gJy4vX2xpc3RDYWNoZUNsZWFyLmpzJztcbmltcG9ydCBsaXN0Q2FjaGVEZWxldGUgZnJvbSAnLi9fbGlzdENhY2hlRGVsZXRlLmpzJztcbmltcG9ydCBsaXN0Q2FjaGVHZXQgZnJvbSAnLi9fbGlzdENhY2hlR2V0LmpzJztcbmltcG9ydCBsaXN0Q2FjaGVIYXMgZnJvbSAnLi9fbGlzdENhY2hlSGFzLmpzJztcbmltcG9ydCBsaXN0Q2FjaGVTZXQgZnJvbSAnLi9fbGlzdENhY2hlU2V0LmpzJztcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGxpc3QgY2FjaGUgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBMaXN0Q2FjaGUoZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPT0gbnVsbCA/IDAgOiBlbnRyaWVzLmxlbmd0aDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgTGlzdENhY2hlYC5cbkxpc3RDYWNoZS5wcm90b3R5cGUuY2xlYXIgPSBsaXN0Q2FjaGVDbGVhcjtcbkxpc3RDYWNoZS5wcm90b3R5cGVbJ2RlbGV0ZSddID0gbGlzdENhY2hlRGVsZXRlO1xuTGlzdENhY2hlLnByb3RvdHlwZS5nZXQgPSBsaXN0Q2FjaGVHZXQ7XG5MaXN0Q2FjaGUucHJvdG90eXBlLmhhcyA9IGxpc3RDYWNoZUhhcztcbkxpc3RDYWNoZS5wcm90b3R5cGUuc2V0ID0gbGlzdENhY2hlU2V0O1xuXG5leHBvcnQgZGVmYXVsdCBMaXN0Q2FjaGU7XG4iLCJpbXBvcnQgZ2V0TmF0aXZlIGZyb20gJy4vX2dldE5hdGl2ZS5qcyc7XG5pbXBvcnQgcm9vdCBmcm9tICcuL19yb290LmpzJztcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIE1hcCA9IGdldE5hdGl2ZShyb290LCAnTWFwJyk7XG5cbmV4cG9ydCBkZWZhdWx0IE1hcDtcbiIsImltcG9ydCBIYXNoIGZyb20gJy4vX0hhc2guanMnO1xuaW1wb3J0IExpc3RDYWNoZSBmcm9tICcuL19MaXN0Q2FjaGUuanMnO1xuaW1wb3J0IE1hcCBmcm9tICcuL19NYXAuanMnO1xuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIG1hcC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUNsZWFyKCkge1xuICB0aGlzLnNpemUgPSAwO1xuICB0aGlzLl9fZGF0YV9fID0ge1xuICAgICdoYXNoJzogbmV3IEhhc2gsXG4gICAgJ21hcCc6IG5ldyAoTWFwIHx8IExpc3RDYWNoZSksXG4gICAgJ3N0cmluZyc6IG5ldyBIYXNoXG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IG1hcENhY2hlQ2xlYXI7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHN1aXRhYmxlIGZvciB1c2UgYXMgdW5pcXVlIG9iamVjdCBrZXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgc3VpdGFibGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNLZXlhYmxlKHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gKHR5cGUgPT0gJ3N0cmluZycgfHwgdHlwZSA9PSAnbnVtYmVyJyB8fCB0eXBlID09ICdzeW1ib2wnIHx8IHR5cGUgPT0gJ2Jvb2xlYW4nKVxuICAgID8gKHZhbHVlICE9PSAnX19wcm90b19fJylcbiAgICA6ICh2YWx1ZSA9PT0gbnVsbCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzS2V5YWJsZTtcbiIsImltcG9ydCBpc0tleWFibGUgZnJvbSAnLi9faXNLZXlhYmxlLmpzJztcblxuLyoqXG4gKiBHZXRzIHRoZSBkYXRhIGZvciBgbWFwYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG1hcCBUaGUgbWFwIHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUgcmVmZXJlbmNlIGtleS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBtYXAgZGF0YS5cbiAqL1xuZnVuY3Rpb24gZ2V0TWFwRGF0YShtYXAsIGtleSkge1xuICB2YXIgZGF0YSA9IG1hcC5fX2RhdGFfXztcbiAgcmV0dXJuIGlzS2V5YWJsZShrZXkpXG4gICAgPyBkYXRhW3R5cGVvZiBrZXkgPT0gJ3N0cmluZycgPyAnc3RyaW5nJyA6ICdoYXNoJ11cbiAgICA6IGRhdGEubWFwO1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRNYXBEYXRhO1xuIiwiaW1wb3J0IGdldE1hcERhdGEgZnJvbSAnLi9fZ2V0TWFwRGF0YS5qcyc7XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIG1hcC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZURlbGV0ZShrZXkpIHtcbiAgdmFyIHJlc3VsdCA9IGdldE1hcERhdGEodGhpcywga2V5KVsnZGVsZXRlJ10oa2V5KTtcbiAgdGhpcy5zaXplIC09IHJlc3VsdCA/IDEgOiAwO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBtYXBDYWNoZURlbGV0ZTtcbiIsImltcG9ydCBnZXRNYXBEYXRhIGZyb20gJy4vX2dldE1hcERhdGEuanMnO1xuXG4vKipcbiAqIEdldHMgdGhlIG1hcCB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVHZXQoa2V5KSB7XG4gIHJldHVybiBnZXRNYXBEYXRhKHRoaXMsIGtleSkuZ2V0KGtleSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG1hcENhY2hlR2V0O1xuIiwiaW1wb3J0IGdldE1hcERhdGEgZnJvbSAnLi9fZ2V0TWFwRGF0YS5qcyc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgbWFwIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVIYXMoa2V5KSB7XG4gIHJldHVybiBnZXRNYXBEYXRhKHRoaXMsIGtleSkuaGFzKGtleSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG1hcENhY2hlSGFzO1xuIiwiaW1wb3J0IGdldE1hcERhdGEgZnJvbSAnLi9fZ2V0TWFwRGF0YS5qcyc7XG5cbi8qKlxuICogU2V0cyB0aGUgbWFwIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG1hcCBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IGdldE1hcERhdGEodGhpcywga2V5KSxcbiAgICAgIHNpemUgPSBkYXRhLnNpemU7XG5cbiAgZGF0YS5zZXQoa2V5LCB2YWx1ZSk7XG4gIHRoaXMuc2l6ZSArPSBkYXRhLnNpemUgPT0gc2l6ZSA/IDAgOiAxO1xuICByZXR1cm4gdGhpcztcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWFwQ2FjaGVTZXQ7XG4iLCJpbXBvcnQgbWFwQ2FjaGVDbGVhciBmcm9tICcuL19tYXBDYWNoZUNsZWFyLmpzJztcbmltcG9ydCBtYXBDYWNoZURlbGV0ZSBmcm9tICcuL19tYXBDYWNoZURlbGV0ZS5qcyc7XG5pbXBvcnQgbWFwQ2FjaGVHZXQgZnJvbSAnLi9fbWFwQ2FjaGVHZXQuanMnO1xuaW1wb3J0IG1hcENhY2hlSGFzIGZyb20gJy4vX21hcENhY2hlSGFzLmpzJztcbmltcG9ydCBtYXBDYWNoZVNldCBmcm9tICcuL19tYXBDYWNoZVNldC5qcyc7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG1hcCBjYWNoZSBvYmplY3QgdG8gc3RvcmUga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBNYXBDYWNoZShlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBNYXBDYWNoZWAuXG5NYXBDYWNoZS5wcm90b3R5cGUuY2xlYXIgPSBtYXBDYWNoZUNsZWFyO1xuTWFwQ2FjaGUucHJvdG90eXBlWydkZWxldGUnXSA9IG1hcENhY2hlRGVsZXRlO1xuTWFwQ2FjaGUucHJvdG90eXBlLmdldCA9IG1hcENhY2hlR2V0O1xuTWFwQ2FjaGUucHJvdG90eXBlLmhhcyA9IG1hcENhY2hlSGFzO1xuTWFwQ2FjaGUucHJvdG90eXBlLnNldCA9IG1hcENhY2hlU2V0O1xuXG5leHBvcnQgZGVmYXVsdCBNYXBDYWNoZTtcbiIsImltcG9ydCBvdmVyQXJnIGZyb20gJy4vX292ZXJBcmcuanMnO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBnZXRQcm90b3R5cGUgPSBvdmVyQXJnKE9iamVjdC5nZXRQcm90b3R5cGVPZiwgT2JqZWN0KTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0UHJvdG90eXBlO1xuIiwiaW1wb3J0IGJhc2VHZXRUYWcgZnJvbSAnLi9fYmFzZUdldFRhZy5qcyc7XG5pbXBvcnQgZ2V0UHJvdG90eXBlIGZyb20gJy4vX2dldFByb3RvdHlwZS5qcyc7XG5pbXBvcnQgaXNPYmplY3RMaWtlIGZyb20gJy4vaXNPYmplY3RMaWtlLmpzJztcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlLFxuICAgIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZ1bmNUb1N0cmluZyA9IGZ1bmNQcm90by50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqIFVzZWQgdG8gaW5mZXIgdGhlIGBPYmplY3RgIGNvbnN0cnVjdG9yLiAqL1xudmFyIG9iamVjdEN0b3JTdHJpbmcgPSBmdW5jVG9TdHJpbmcuY2FsbChPYmplY3QpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgcGxhaW4gb2JqZWN0LCB0aGF0IGlzLCBhbiBvYmplY3QgY3JlYXRlZCBieSB0aGVcbiAqIGBPYmplY3RgIGNvbnN0cnVjdG9yIG9yIG9uZSB3aXRoIGEgYFtbUHJvdG90eXBlXV1gIG9mIGBudWxsYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuOC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHBsYWluIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiB9XG4gKlxuICogXy5pc1BsYWluT2JqZWN0KG5ldyBGb28pO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzUGxhaW5PYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc1BsYWluT2JqZWN0KHsgJ3gnOiAwLCAneSc6IDAgfSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1BsYWluT2JqZWN0KE9iamVjdC5jcmVhdGUobnVsbCkpO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBpc1BsYWluT2JqZWN0KHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3RMaWtlKHZhbHVlKSB8fCBiYXNlR2V0VGFnKHZhbHVlKSAhPSBvYmplY3RUYWcpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHByb3RvID0gZ2V0UHJvdG90eXBlKHZhbHVlKTtcbiAgaWYgKHByb3RvID09PSBudWxsKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgdmFyIEN0b3IgPSBoYXNPd25Qcm9wZXJ0eS5jYWxsKHByb3RvLCAnY29uc3RydWN0b3InKSAmJiBwcm90by5jb25zdHJ1Y3RvcjtcbiAgcmV0dXJuIHR5cGVvZiBDdG9yID09ICdmdW5jdGlvbicgJiYgQ3RvciBpbnN0YW5jZW9mIEN0b3IgJiZcbiAgICBmdW5jVG9TdHJpbmcuY2FsbChDdG9yKSA9PSBvYmplY3RDdG9yU3RyaW5nO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpc1BsYWluT2JqZWN0O1xuIiwiaW1wb3J0IExpc3RDYWNoZSBmcm9tICcuL19MaXN0Q2FjaGUuanMnO1xuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIHN0YWNrLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIFN0YWNrXG4gKi9cbmZ1bmN0aW9uIHN0YWNrQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBuZXcgTGlzdENhY2hlO1xuICB0aGlzLnNpemUgPSAwO1xufVxuXG5leHBvcnQgZGVmYXVsdCBzdGFja0NsZWFyO1xuIiwiLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgc3RhY2suXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gc3RhY2tEZWxldGUoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIHJlc3VsdCA9IGRhdGFbJ2RlbGV0ZSddKGtleSk7XG5cbiAgdGhpcy5zaXplID0gZGF0YS5zaXplO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBzdGFja0RlbGV0ZTtcbiIsIi8qKlxuICogR2V0cyB0aGUgc3RhY2sgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrR2V0KGtleSkge1xuICByZXR1cm4gdGhpcy5fX2RhdGFfXy5nZXQoa2V5KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgc3RhY2tHZXQ7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBhIHN0YWNrIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gc3RhY2tIYXMoa2V5KSB7XG4gIHJldHVybiB0aGlzLl9fZGF0YV9fLmhhcyhrZXkpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBzdGFja0hhcztcbiIsImltcG9ydCBMaXN0Q2FjaGUgZnJvbSAnLi9fTGlzdENhY2hlLmpzJztcbmltcG9ydCBNYXAgZnJvbSAnLi9fTWFwLmpzJztcbmltcG9ydCBNYXBDYWNoZSBmcm9tICcuL19NYXBDYWNoZS5qcyc7XG5cbi8qKiBVc2VkIGFzIHRoZSBzaXplIHRvIGVuYWJsZSBsYXJnZSBhcnJheSBvcHRpbWl6YXRpb25zLiAqL1xudmFyIExBUkdFX0FSUkFZX1NJWkUgPSAyMDA7XG5cbi8qKlxuICogU2V0cyB0aGUgc3RhY2sgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgc3RhY2sgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICBpZiAoZGF0YSBpbnN0YW5jZW9mIExpc3RDYWNoZSkge1xuICAgIHZhciBwYWlycyA9IGRhdGEuX19kYXRhX187XG4gICAgaWYgKCFNYXAgfHwgKHBhaXJzLmxlbmd0aCA8IExBUkdFX0FSUkFZX1NJWkUgLSAxKSkge1xuICAgICAgcGFpcnMucHVzaChba2V5LCB2YWx1ZV0pO1xuICAgICAgdGhpcy5zaXplID0gKytkYXRhLnNpemU7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgZGF0YSA9IHRoaXMuX19kYXRhX18gPSBuZXcgTWFwQ2FjaGUocGFpcnMpO1xuICB9XG4gIGRhdGEuc2V0KGtleSwgdmFsdWUpO1xuICB0aGlzLnNpemUgPSBkYXRhLnNpemU7XG4gIHJldHVybiB0aGlzO1xufVxuXG5leHBvcnQgZGVmYXVsdCBzdGFja1NldDtcbiIsImltcG9ydCBMaXN0Q2FjaGUgZnJvbSAnLi9fTGlzdENhY2hlLmpzJztcbmltcG9ydCBzdGFja0NsZWFyIGZyb20gJy4vX3N0YWNrQ2xlYXIuanMnO1xuaW1wb3J0IHN0YWNrRGVsZXRlIGZyb20gJy4vX3N0YWNrRGVsZXRlLmpzJztcbmltcG9ydCBzdGFja0dldCBmcm9tICcuL19zdGFja0dldC5qcyc7XG5pbXBvcnQgc3RhY2tIYXMgZnJvbSAnLi9fc3RhY2tIYXMuanMnO1xuaW1wb3J0IHN0YWNrU2V0IGZyb20gJy4vX3N0YWNrU2V0LmpzJztcblxuLyoqXG4gKiBDcmVhdGVzIGEgc3RhY2sgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gU3RhY2soZW50cmllcykge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18gPSBuZXcgTGlzdENhY2hlKGVudHJpZXMpO1xuICB0aGlzLnNpemUgPSBkYXRhLnNpemU7XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBTdGFja2AuXG5TdGFjay5wcm90b3R5cGUuY2xlYXIgPSBzdGFja0NsZWFyO1xuU3RhY2sucHJvdG90eXBlWydkZWxldGUnXSA9IHN0YWNrRGVsZXRlO1xuU3RhY2sucHJvdG90eXBlLmdldCA9IHN0YWNrR2V0O1xuU3RhY2sucHJvdG90eXBlLmhhcyA9IHN0YWNrSGFzO1xuU3RhY2sucHJvdG90eXBlLnNldCA9IHN0YWNrU2V0O1xuXG5leHBvcnQgZGVmYXVsdCBTdGFjaztcbiIsImltcG9ydCByb290IGZyb20gJy4vX3Jvb3QuanMnO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGV4cG9ydHNgLiAqL1xudmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSAmJiBleHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAuICovXG52YXIgZnJlZU1vZHVsZSA9IGZyZWVFeHBvcnRzICYmIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlICYmICFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xuXG4vKiogRGV0ZWN0IHRoZSBwb3B1bGFyIENvbW1vbkpTIGV4dGVuc2lvbiBgbW9kdWxlLmV4cG9ydHNgLiAqL1xudmFyIG1vZHVsZUV4cG9ydHMgPSBmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUuZXhwb3J0cyA9PT0gZnJlZUV4cG9ydHM7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIEJ1ZmZlciA9IG1vZHVsZUV4cG9ydHMgPyByb290LkJ1ZmZlciA6IHVuZGVmaW5lZCxcbiAgICBhbGxvY1Vuc2FmZSA9IEJ1ZmZlciA/IEJ1ZmZlci5hbGxvY1Vuc2FmZSA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgIGBidWZmZXJgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0J1ZmZlcn0gYnVmZmVyIFRoZSBidWZmZXIgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXBdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuICogQHJldHVybnMge0J1ZmZlcn0gUmV0dXJucyB0aGUgY2xvbmVkIGJ1ZmZlci5cbiAqL1xuZnVuY3Rpb24gY2xvbmVCdWZmZXIoYnVmZmVyLCBpc0RlZXApIHtcbiAgaWYgKGlzRGVlcCkge1xuICAgIHJldHVybiBidWZmZXIuc2xpY2UoKTtcbiAgfVxuICB2YXIgbGVuZ3RoID0gYnVmZmVyLmxlbmd0aCxcbiAgICAgIHJlc3VsdCA9IGFsbG9jVW5zYWZlID8gYWxsb2NVbnNhZmUobGVuZ3RoKSA6IG5ldyBidWZmZXIuY29uc3RydWN0b3IobGVuZ3RoKTtcblxuICBidWZmZXIuY29weShyZXN1bHQpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbG9uZUJ1ZmZlcjtcbiIsImltcG9ydCByb290IGZyb20gJy4vX3Jvb3QuanMnO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBVaW50OEFycmF5ID0gcm9vdC5VaW50OEFycmF5O1xuXG5leHBvcnQgZGVmYXVsdCBVaW50OEFycmF5O1xuIiwiaW1wb3J0IFVpbnQ4QXJyYXkgZnJvbSAnLi9fVWludDhBcnJheS5qcyc7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIGBhcnJheUJ1ZmZlcmAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXlCdWZmZXJ9IGFycmF5QnVmZmVyIFRoZSBhcnJheSBidWZmZXIgdG8gY2xvbmUuXG4gKiBAcmV0dXJucyB7QXJyYXlCdWZmZXJ9IFJldHVybnMgdGhlIGNsb25lZCBhcnJheSBidWZmZXIuXG4gKi9cbmZ1bmN0aW9uIGNsb25lQXJyYXlCdWZmZXIoYXJyYXlCdWZmZXIpIHtcbiAgdmFyIHJlc3VsdCA9IG5ldyBhcnJheUJ1ZmZlci5jb25zdHJ1Y3RvcihhcnJheUJ1ZmZlci5ieXRlTGVuZ3RoKTtcbiAgbmV3IFVpbnQ4QXJyYXkocmVzdWx0KS5zZXQobmV3IFVpbnQ4QXJyYXkoYXJyYXlCdWZmZXIpKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xvbmVBcnJheUJ1ZmZlcjtcbiIsImltcG9ydCBjbG9uZUFycmF5QnVmZmVyIGZyb20gJy4vX2Nsb25lQXJyYXlCdWZmZXIuanMnO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgdHlwZWRBcnJheWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSB0eXBlZEFycmF5IFRoZSB0eXBlZCBhcnJheSB0byBjbG9uZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGVlcF0gU3BlY2lmeSBhIGRlZXAgY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjbG9uZWQgdHlwZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGNsb25lVHlwZWRBcnJheSh0eXBlZEFycmF5LCBpc0RlZXApIHtcbiAgdmFyIGJ1ZmZlciA9IGlzRGVlcCA/IGNsb25lQXJyYXlCdWZmZXIodHlwZWRBcnJheS5idWZmZXIpIDogdHlwZWRBcnJheS5idWZmZXI7XG4gIHJldHVybiBuZXcgdHlwZWRBcnJheS5jb25zdHJ1Y3RvcihidWZmZXIsIHR5cGVkQXJyYXkuYnl0ZU9mZnNldCwgdHlwZWRBcnJheS5sZW5ndGgpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbG9uZVR5cGVkQXJyYXk7XG4iLCJpbXBvcnQgYmFzZUNyZWF0ZSBmcm9tICcuL19iYXNlQ3JlYXRlLmpzJztcbmltcG9ydCBnZXRQcm90b3R5cGUgZnJvbSAnLi9fZ2V0UHJvdG90eXBlLmpzJztcbmltcG9ydCBpc1Byb3RvdHlwZSBmcm9tICcuL19pc1Byb3RvdHlwZS5qcyc7XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgYW4gb2JqZWN0IGNsb25lLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBpbml0aWFsaXplZCBjbG9uZS5cbiAqL1xuZnVuY3Rpb24gaW5pdENsb25lT2JqZWN0KG9iamVjdCkge1xuICByZXR1cm4gKHR5cGVvZiBvYmplY3QuY29uc3RydWN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNQcm90b3R5cGUob2JqZWN0KSlcbiAgICA/IGJhc2VDcmVhdGUoZ2V0UHJvdG90eXBlKG9iamVjdCkpXG4gICAgOiB7fTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaW5pdENsb25lT2JqZWN0O1xuIiwiLyoqXG4gKiBDcmVhdGVzIGEgYmFzZSBmdW5jdGlvbiBmb3IgbWV0aG9kcyBsaWtlIGBfLmZvckluYCBhbmQgYF8uZm9yT3duYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtib29sZWFufSBbZnJvbVJpZ2h0XSBTcGVjaWZ5IGl0ZXJhdGluZyBmcm9tIHJpZ2h0IHRvIGxlZnQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBiYXNlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVCYXNlRm9yKGZyb21SaWdodCkge1xuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0LCBpdGVyYXRlZSwga2V5c0Z1bmMpIHtcbiAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgaXRlcmFibGUgPSBPYmplY3Qob2JqZWN0KSxcbiAgICAgICAgcHJvcHMgPSBrZXlzRnVuYyhvYmplY3QpLFxuICAgICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG5cbiAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgIHZhciBrZXkgPSBwcm9wc1tmcm9tUmlnaHQgPyBsZW5ndGggOiArK2luZGV4XTtcbiAgICAgIGlmIChpdGVyYXRlZShpdGVyYWJsZVtrZXldLCBrZXksIGl0ZXJhYmxlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmplY3Q7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUJhc2VGb3I7XG4iLCJpbXBvcnQgY3JlYXRlQmFzZUZvciBmcm9tICcuL19jcmVhdGVCYXNlRm9yLmpzJztcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgYmFzZUZvck93bmAgd2hpY2ggaXRlcmF0ZXMgb3ZlciBgb2JqZWN0YFxuICogcHJvcGVydGllcyByZXR1cm5lZCBieSBga2V5c0Z1bmNgIGFuZCBpbnZva2VzIGBpdGVyYXRlZWAgZm9yIGVhY2ggcHJvcGVydHkuXG4gKiBJdGVyYXRlZSBmdW5jdGlvbnMgbWF5IGV4aXQgaXRlcmF0aW9uIGVhcmx5IGJ5IGV4cGxpY2l0bHkgcmV0dXJuaW5nIGBmYWxzZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHBhcmFtIHtGdW5jdGlvbn0ga2V5c0Z1bmMgVGhlIGZ1bmN0aW9uIHRvIGdldCB0aGUga2V5cyBvZiBgb2JqZWN0YC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbnZhciBiYXNlRm9yID0gY3JlYXRlQmFzZUZvcigpO1xuXG5leHBvcnQgZGVmYXVsdCBiYXNlRm9yO1xuIiwiaW1wb3J0IGJhc2VGb3IgZnJvbSAnLi9fYmFzZUZvci5qcyc7XG5pbXBvcnQga2V5cyBmcm9tICcuL2tleXMuanMnO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmZvck93bmAgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VGb3JPd24ob2JqZWN0LCBpdGVyYXRlZSkge1xuICByZXR1cm4gb2JqZWN0ICYmIGJhc2VGb3Iob2JqZWN0LCBpdGVyYXRlZSwga2V5cyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGJhc2VGb3JPd247XG4iLCJpbXBvcnQgaXNBcnJheUxpa2UgZnJvbSAnLi9pc0FycmF5TGlrZS5qcyc7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGBiYXNlRWFjaGAgb3IgYGJhc2VFYWNoUmlnaHRgIGZ1bmN0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlYWNoRnVuYyBUaGUgZnVuY3Rpb24gdG8gaXRlcmF0ZSBvdmVyIGEgY29sbGVjdGlvbi5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Zyb21SaWdodF0gU3BlY2lmeSBpdGVyYXRpbmcgZnJvbSByaWdodCB0byBsZWZ0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYmFzZSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQmFzZUVhY2goZWFjaEZ1bmMsIGZyb21SaWdodCkge1xuICByZXR1cm4gZnVuY3Rpb24oY29sbGVjdGlvbiwgaXRlcmF0ZWUpIHtcbiAgICBpZiAoY29sbGVjdGlvbiA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgICB9XG4gICAgaWYgKCFpc0FycmF5TGlrZShjb2xsZWN0aW9uKSkge1xuICAgICAgcmV0dXJuIGVhY2hGdW5jKGNvbGxlY3Rpb24sIGl0ZXJhdGVlKTtcbiAgICB9XG4gICAgdmFyIGxlbmd0aCA9IGNvbGxlY3Rpb24ubGVuZ3RoLFxuICAgICAgICBpbmRleCA9IGZyb21SaWdodCA/IGxlbmd0aCA6IC0xLFxuICAgICAgICBpdGVyYWJsZSA9IE9iamVjdChjb2xsZWN0aW9uKTtcblxuICAgIHdoaWxlICgoZnJvbVJpZ2h0ID8gaW5kZXgtLSA6ICsraW5kZXggPCBsZW5ndGgpKSB7XG4gICAgICBpZiAoaXRlcmF0ZWUoaXRlcmFibGVbaW5kZXhdLCBpbmRleCwgaXRlcmFibGUpID09PSBmYWxzZSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUJhc2VFYWNoO1xuIiwiaW1wb3J0IGJhc2VGb3JPd24gZnJvbSAnLi9fYmFzZUZvck93bi5qcyc7XG5pbXBvcnQgY3JlYXRlQmFzZUVhY2ggZnJvbSAnLi9fY3JlYXRlQmFzZUVhY2guanMnO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmZvckVhY2hgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheXxPYmplY3R9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheXxPYmplY3R9IFJldHVybnMgYGNvbGxlY3Rpb25gLlxuICovXG52YXIgYmFzZUVhY2ggPSBjcmVhdGVCYXNlRWFjaChiYXNlRm9yT3duKTtcblxuZXhwb3J0IGRlZmF1bHQgYmFzZUVhY2g7XG4iLCJpbXBvcnQgYmFzZUFzc2lnblZhbHVlIGZyb20gJy4vX2Jhc2VBc3NpZ25WYWx1ZS5qcyc7XG5pbXBvcnQgZXEgZnJvbSAnLi9lcS5qcyc7XG5cbi8qKlxuICogVGhpcyBmdW5jdGlvbiBpcyBsaWtlIGBhc3NpZ25WYWx1ZWAgZXhjZXB0IHRoYXQgaXQgZG9lc24ndCBhc3NpZ25cbiAqIGB1bmRlZmluZWRgIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gYXNzaWduLlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gYXNzaWduLlxuICovXG5mdW5jdGlvbiBhc3NpZ25NZXJnZVZhbHVlKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICBpZiAoKHZhbHVlICE9PSB1bmRlZmluZWQgJiYgIWVxKG9iamVjdFtrZXldLCB2YWx1ZSkpIHx8XG4gICAgICAodmFsdWUgPT09IHVuZGVmaW5lZCAmJiAhKGtleSBpbiBvYmplY3QpKSkge1xuICAgIGJhc2VBc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgdmFsdWUpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzc2lnbk1lcmdlVmFsdWU7XG4iLCJpbXBvcnQgaXNBcnJheUxpa2UgZnJvbSAnLi9pc0FycmF5TGlrZS5qcyc7XG5pbXBvcnQgaXNPYmplY3RMaWtlIGZyb20gJy4vaXNPYmplY3RMaWtlLmpzJztcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLmlzQXJyYXlMaWtlYCBleGNlcHQgdGhhdCBpdCBhbHNvIGNoZWNrcyBpZiBgdmFsdWVgXG4gKiBpcyBhbiBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYXJyYXktbGlrZSBvYmplY3QsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZU9iamVjdChkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlT2JqZWN0KCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5TGlrZU9iamVjdChfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUxpa2VPYmplY3QodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgaXNBcnJheUxpa2UodmFsdWUpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpc0FycmF5TGlrZU9iamVjdDtcbiIsIi8qKlxuICogR2V0cyB0aGUgdmFsdWUgYXQgYGtleWAsIHVubGVzcyBga2V5YCBpcyBcIl9fcHJvdG9fX1wiIG9yIFwiY29uc3RydWN0b3JcIi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcHJvcGVydHkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIHNhZmVHZXQob2JqZWN0LCBrZXkpIHtcbiAgaWYgKGtleSA9PT0gJ2NvbnN0cnVjdG9yJyAmJiB0eXBlb2Ygb2JqZWN0W2tleV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoa2V5ID09ICdfX3Byb3RvX18nKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcmV0dXJuIG9iamVjdFtrZXldO1xufVxuXG5leHBvcnQgZGVmYXVsdCBzYWZlR2V0O1xuIiwiaW1wb3J0IGNvcHlPYmplY3QgZnJvbSAnLi9fY29weU9iamVjdC5qcyc7XG5pbXBvcnQga2V5c0luIGZyb20gJy4va2V5c0luLmpzJztcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgcGxhaW4gb2JqZWN0IGZsYXR0ZW5pbmcgaW5oZXJpdGVkIGVudW1lcmFibGUgc3RyaW5nXG4gKiBrZXllZCBwcm9wZXJ0aWVzIG9mIGB2YWx1ZWAgdG8gb3duIHByb3BlcnRpZXMgb2YgdGhlIHBsYWluIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBwbGFpbiBvYmplY3QuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5iID0gMjtcbiAqIH1cbiAqXG4gKiBGb28ucHJvdG90eXBlLmMgPSAzO1xuICpcbiAqIF8uYXNzaWduKHsgJ2EnOiAxIH0sIG5ldyBGb28pO1xuICogLy8gPT4geyAnYSc6IDEsICdiJzogMiB9XG4gKlxuICogXy5hc3NpZ24oeyAnYSc6IDEgfSwgXy50b1BsYWluT2JqZWN0KG5ldyBGb28pKTtcbiAqIC8vID0+IHsgJ2EnOiAxLCAnYic6IDIsICdjJzogMyB9XG4gKi9cbmZ1bmN0aW9uIHRvUGxhaW5PYmplY3QodmFsdWUpIHtcbiAgcmV0dXJuIGNvcHlPYmplY3QodmFsdWUsIGtleXNJbih2YWx1ZSkpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB0b1BsYWluT2JqZWN0O1xuIiwiaW1wb3J0IGFzc2lnbk1lcmdlVmFsdWUgZnJvbSAnLi9fYXNzaWduTWVyZ2VWYWx1ZS5qcyc7XG5pbXBvcnQgY2xvbmVCdWZmZXIgZnJvbSAnLi9fY2xvbmVCdWZmZXIuanMnO1xuaW1wb3J0IGNsb25lVHlwZWRBcnJheSBmcm9tICcuL19jbG9uZVR5cGVkQXJyYXkuanMnO1xuaW1wb3J0IGNvcHlBcnJheSBmcm9tICcuL19jb3B5QXJyYXkuanMnO1xuaW1wb3J0IGluaXRDbG9uZU9iamVjdCBmcm9tICcuL19pbml0Q2xvbmVPYmplY3QuanMnO1xuaW1wb3J0IGlzQXJndW1lbnRzIGZyb20gJy4vaXNBcmd1bWVudHMuanMnO1xuaW1wb3J0IGlzQXJyYXkgZnJvbSAnLi9pc0FycmF5LmpzJztcbmltcG9ydCBpc0FycmF5TGlrZU9iamVjdCBmcm9tICcuL2lzQXJyYXlMaWtlT2JqZWN0LmpzJztcbmltcG9ydCBpc0J1ZmZlciBmcm9tICcuL2lzQnVmZmVyLmpzJztcbmltcG9ydCBpc0Z1bmN0aW9uIGZyb20gJy4vaXNGdW5jdGlvbi5qcyc7XG5pbXBvcnQgaXNPYmplY3QgZnJvbSAnLi9pc09iamVjdC5qcyc7XG5pbXBvcnQgaXNQbGFpbk9iamVjdCBmcm9tICcuL2lzUGxhaW5PYmplY3QuanMnO1xuaW1wb3J0IGlzVHlwZWRBcnJheSBmcm9tICcuL2lzVHlwZWRBcnJheS5qcyc7XG5pbXBvcnQgc2FmZUdldCBmcm9tICcuL19zYWZlR2V0LmpzJztcbmltcG9ydCB0b1BsYWluT2JqZWN0IGZyb20gJy4vdG9QbGFpbk9iamVjdC5qcyc7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlTWVyZ2VgIGZvciBhcnJheXMgYW5kIG9iamVjdHMgd2hpY2ggcGVyZm9ybXNcbiAqIGRlZXAgbWVyZ2VzIGFuZCB0cmFja3MgdHJhdmVyc2VkIG9iamVjdHMgZW5hYmxpbmcgb2JqZWN0cyB3aXRoIGNpcmN1bGFyXG4gKiByZWZlcmVuY2VzIHRvIGJlIG1lcmdlZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgc291cmNlIG9iamVjdC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gbWVyZ2UuXG4gKiBAcGFyYW0ge251bWJlcn0gc3JjSW5kZXggVGhlIGluZGV4IG9mIGBzb3VyY2VgLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gbWVyZ2VGdW5jIFRoZSBmdW5jdGlvbiB0byBtZXJnZSB2YWx1ZXMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBhc3NpZ25lZCB2YWx1ZXMuXG4gKiBAcGFyYW0ge09iamVjdH0gW3N0YWNrXSBUcmFja3MgdHJhdmVyc2VkIHNvdXJjZSB2YWx1ZXMgYW5kIHRoZWlyIG1lcmdlZFxuICogIGNvdW50ZXJwYXJ0cy5cbiAqL1xuZnVuY3Rpb24gYmFzZU1lcmdlRGVlcChvYmplY3QsIHNvdXJjZSwga2V5LCBzcmNJbmRleCwgbWVyZ2VGdW5jLCBjdXN0b21pemVyLCBzdGFjaykge1xuICB2YXIgb2JqVmFsdWUgPSBzYWZlR2V0KG9iamVjdCwga2V5KSxcbiAgICAgIHNyY1ZhbHVlID0gc2FmZUdldChzb3VyY2UsIGtleSksXG4gICAgICBzdGFja2VkID0gc3RhY2suZ2V0KHNyY1ZhbHVlKTtcblxuICBpZiAoc3RhY2tlZCkge1xuICAgIGFzc2lnbk1lcmdlVmFsdWUob2JqZWN0LCBrZXksIHN0YWNrZWQpO1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgbmV3VmFsdWUgPSBjdXN0b21pemVyXG4gICAgPyBjdXN0b21pemVyKG9ialZhbHVlLCBzcmNWYWx1ZSwgKGtleSArICcnKSwgb2JqZWN0LCBzb3VyY2UsIHN0YWNrKVxuICAgIDogdW5kZWZpbmVkO1xuXG4gIHZhciBpc0NvbW1vbiA9IG5ld1ZhbHVlID09PSB1bmRlZmluZWQ7XG5cbiAgaWYgKGlzQ29tbW9uKSB7XG4gICAgdmFyIGlzQXJyID0gaXNBcnJheShzcmNWYWx1ZSksXG4gICAgICAgIGlzQnVmZiA9ICFpc0FyciAmJiBpc0J1ZmZlcihzcmNWYWx1ZSksXG4gICAgICAgIGlzVHlwZWQgPSAhaXNBcnIgJiYgIWlzQnVmZiAmJiBpc1R5cGVkQXJyYXkoc3JjVmFsdWUpO1xuXG4gICAgbmV3VmFsdWUgPSBzcmNWYWx1ZTtcbiAgICBpZiAoaXNBcnIgfHwgaXNCdWZmIHx8IGlzVHlwZWQpIHtcbiAgICAgIGlmIChpc0FycmF5KG9ialZhbHVlKSkge1xuICAgICAgICBuZXdWYWx1ZSA9IG9ialZhbHVlO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoaXNBcnJheUxpa2VPYmplY3Qob2JqVmFsdWUpKSB7XG4gICAgICAgIG5ld1ZhbHVlID0gY29weUFycmF5KG9ialZhbHVlKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKGlzQnVmZikge1xuICAgICAgICBpc0NvbW1vbiA9IGZhbHNlO1xuICAgICAgICBuZXdWYWx1ZSA9IGNsb25lQnVmZmVyKHNyY1ZhbHVlLCB0cnVlKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKGlzVHlwZWQpIHtcbiAgICAgICAgaXNDb21tb24gPSBmYWxzZTtcbiAgICAgICAgbmV3VmFsdWUgPSBjbG9uZVR5cGVkQXJyYXkoc3JjVmFsdWUsIHRydWUpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIG5ld1ZhbHVlID0gW107XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzUGxhaW5PYmplY3Qoc3JjVmFsdWUpIHx8IGlzQXJndW1lbnRzKHNyY1ZhbHVlKSkge1xuICAgICAgbmV3VmFsdWUgPSBvYmpWYWx1ZTtcbiAgICAgIGlmIChpc0FyZ3VtZW50cyhvYmpWYWx1ZSkpIHtcbiAgICAgICAgbmV3VmFsdWUgPSB0b1BsYWluT2JqZWN0KG9ialZhbHVlKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKCFpc09iamVjdChvYmpWYWx1ZSkgfHwgaXNGdW5jdGlvbihvYmpWYWx1ZSkpIHtcbiAgICAgICAgbmV3VmFsdWUgPSBpbml0Q2xvbmVPYmplY3Qoc3JjVmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGlzQ29tbW9uID0gZmFsc2U7XG4gICAgfVxuICB9XG4gIGlmIChpc0NvbW1vbikge1xuICAgIC8vIFJlY3Vyc2l2ZWx5IG1lcmdlIG9iamVjdHMgYW5kIGFycmF5cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgIHN0YWNrLnNldChzcmNWYWx1ZSwgbmV3VmFsdWUpO1xuICAgIG1lcmdlRnVuYyhuZXdWYWx1ZSwgc3JjVmFsdWUsIHNyY0luZGV4LCBjdXN0b21pemVyLCBzdGFjayk7XG4gICAgc3RhY2tbJ2RlbGV0ZSddKHNyY1ZhbHVlKTtcbiAgfVxuICBhc3NpZ25NZXJnZVZhbHVlKG9iamVjdCwga2V5LCBuZXdWYWx1ZSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGJhc2VNZXJnZURlZXA7XG4iLCJpbXBvcnQgU3RhY2sgZnJvbSAnLi9fU3RhY2suanMnO1xuaW1wb3J0IGFzc2lnbk1lcmdlVmFsdWUgZnJvbSAnLi9fYXNzaWduTWVyZ2VWYWx1ZS5qcyc7XG5pbXBvcnQgYmFzZUZvciBmcm9tICcuL19iYXNlRm9yLmpzJztcbmltcG9ydCBiYXNlTWVyZ2VEZWVwIGZyb20gJy4vX2Jhc2VNZXJnZURlZXAuanMnO1xuaW1wb3J0IGlzT2JqZWN0IGZyb20gJy4vaXNPYmplY3QuanMnO1xuaW1wb3J0IGtleXNJbiBmcm9tICcuL2tleXNJbi5qcyc7XG5pbXBvcnQgc2FmZUdldCBmcm9tICcuL19zYWZlR2V0LmpzJztcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5tZXJnZWAgd2l0aG91dCBzdXBwb3J0IGZvciBtdWx0aXBsZSBzb3VyY2VzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHBhcmFtIHtudW1iZXJ9IHNyY0luZGV4IFRoZSBpbmRleCBvZiBgc291cmNlYC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIG1lcmdlZCB2YWx1ZXMuXG4gKiBAcGFyYW0ge09iamVjdH0gW3N0YWNrXSBUcmFja3MgdHJhdmVyc2VkIHNvdXJjZSB2YWx1ZXMgYW5kIHRoZWlyIG1lcmdlZFxuICogIGNvdW50ZXJwYXJ0cy5cbiAqL1xuZnVuY3Rpb24gYmFzZU1lcmdlKG9iamVjdCwgc291cmNlLCBzcmNJbmRleCwgY3VzdG9taXplciwgc3RhY2spIHtcbiAgaWYgKG9iamVjdCA9PT0gc291cmNlKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGJhc2VGb3Ioc291cmNlLCBmdW5jdGlvbihzcmNWYWx1ZSwga2V5KSB7XG4gICAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcbiAgICBpZiAoaXNPYmplY3Qoc3JjVmFsdWUpKSB7XG4gICAgICBiYXNlTWVyZ2VEZWVwKG9iamVjdCwgc291cmNlLCBrZXksIHNyY0luZGV4LCBiYXNlTWVyZ2UsIGN1c3RvbWl6ZXIsIHN0YWNrKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXIgbmV3VmFsdWUgPSBjdXN0b21pemVyXG4gICAgICAgID8gY3VzdG9taXplcihzYWZlR2V0KG9iamVjdCwga2V5KSwgc3JjVmFsdWUsIChrZXkgKyAnJyksIG9iamVjdCwgc291cmNlLCBzdGFjaylcbiAgICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgICAgIGlmIChuZXdWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG5ld1ZhbHVlID0gc3JjVmFsdWU7XG4gICAgICB9XG4gICAgICBhc3NpZ25NZXJnZVZhbHVlKG9iamVjdCwga2V5LCBuZXdWYWx1ZSk7XG4gICAgfVxuICB9LCBrZXlzSW4pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBiYXNlTWVyZ2U7XG4iLCJpbXBvcnQgYmFzZU1lcmdlIGZyb20gJy4vX2Jhc2VNZXJnZS5qcyc7XG5pbXBvcnQgaXNPYmplY3QgZnJvbSAnLi9pc09iamVjdC5qcyc7XG5cbi8qKlxuICogVXNlZCBieSBgXy5kZWZhdWx0c0RlZXBgIHRvIGN1c3RvbWl6ZSBpdHMgYF8ubWVyZ2VgIHVzZSB0byBtZXJnZSBzb3VyY2VcbiAqIG9iamVjdHMgaW50byBkZXN0aW5hdGlvbiBvYmplY3RzIHRoYXQgYXJlIHBhc3NlZCB0aHJ1LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IG9ialZhbHVlIFRoZSBkZXN0aW5hdGlvbiB2YWx1ZS5cbiAqIEBwYXJhbSB7Kn0gc3JjVmFsdWUgVGhlIHNvdXJjZSB2YWx1ZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gbWVyZ2UuXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBwYXJlbnQgb2JqZWN0IG9mIGBvYmpWYWx1ZWAuXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBwYXJlbnQgb2JqZWN0IG9mIGBzcmNWYWx1ZWAuXG4gKiBAcGFyYW0ge09iamVjdH0gW3N0YWNrXSBUcmFja3MgdHJhdmVyc2VkIHNvdXJjZSB2YWx1ZXMgYW5kIHRoZWlyIG1lcmdlZFxuICogIGNvdW50ZXJwYXJ0cy5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSB2YWx1ZSB0byBhc3NpZ24uXG4gKi9cbmZ1bmN0aW9uIGN1c3RvbURlZmF1bHRzTWVyZ2Uob2JqVmFsdWUsIHNyY1ZhbHVlLCBrZXksIG9iamVjdCwgc291cmNlLCBzdGFjaykge1xuICBpZiAoaXNPYmplY3Qob2JqVmFsdWUpICYmIGlzT2JqZWN0KHNyY1ZhbHVlKSkge1xuICAgIC8vIFJlY3Vyc2l2ZWx5IG1lcmdlIG9iamVjdHMgYW5kIGFycmF5cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgIHN0YWNrLnNldChzcmNWYWx1ZSwgb2JqVmFsdWUpO1xuICAgIGJhc2VNZXJnZShvYmpWYWx1ZSwgc3JjVmFsdWUsIHVuZGVmaW5lZCwgY3VzdG9tRGVmYXVsdHNNZXJnZSwgc3RhY2spO1xuICAgIHN0YWNrWydkZWxldGUnXShzcmNWYWx1ZSk7XG4gIH1cbiAgcmV0dXJuIG9ialZhbHVlO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjdXN0b21EZWZhdWx0c01lcmdlO1xuIiwiaW1wb3J0IGJhc2VNZXJnZSBmcm9tICcuL19iYXNlTWVyZ2UuanMnO1xuaW1wb3J0IGNyZWF0ZUFzc2lnbmVyIGZyb20gJy4vX2NyZWF0ZUFzc2lnbmVyLmpzJztcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLm1lcmdlYCBleGNlcHQgdGhhdCBpdCBhY2NlcHRzIGBjdXN0b21pemVyYCB3aGljaFxuICogaXMgaW52b2tlZCB0byBwcm9kdWNlIHRoZSBtZXJnZWQgdmFsdWVzIG9mIHRoZSBkZXN0aW5hdGlvbiBhbmQgc291cmNlXG4gKiBwcm9wZXJ0aWVzLiBJZiBgY3VzdG9taXplcmAgcmV0dXJucyBgdW5kZWZpbmVkYCwgbWVyZ2luZyBpcyBoYW5kbGVkIGJ5IHRoZVxuICogbWV0aG9kIGluc3RlYWQuIFRoZSBgY3VzdG9taXplcmAgaXMgaW52b2tlZCB3aXRoIHNpeCBhcmd1bWVudHM6XG4gKiAob2JqVmFsdWUsIHNyY1ZhbHVlLCBrZXksIG9iamVjdCwgc291cmNlLCBzdGFjaykuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIG11dGF0ZXMgYG9iamVjdGAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHsuLi5PYmplY3R9IHNvdXJjZXMgVGhlIHNvdXJjZSBvYmplY3RzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGFzc2lnbmVkIHZhbHVlcy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIGN1c3RvbWl6ZXIob2JqVmFsdWUsIHNyY1ZhbHVlKSB7XG4gKiAgIGlmIChfLmlzQXJyYXkob2JqVmFsdWUpKSB7XG4gKiAgICAgcmV0dXJuIG9ialZhbHVlLmNvbmNhdChzcmNWYWx1ZSk7XG4gKiAgIH1cbiAqIH1cbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IFsxXSwgJ2InOiBbMl0gfTtcbiAqIHZhciBvdGhlciA9IHsgJ2EnOiBbM10sICdiJzogWzRdIH07XG4gKlxuICogXy5tZXJnZVdpdGgob2JqZWN0LCBvdGhlciwgY3VzdG9taXplcik7XG4gKiAvLyA9PiB7ICdhJzogWzEsIDNdLCAnYic6IFsyLCA0XSB9XG4gKi9cbnZhciBtZXJnZVdpdGggPSBjcmVhdGVBc3NpZ25lcihmdW5jdGlvbihvYmplY3QsIHNvdXJjZSwgc3JjSW5kZXgsIGN1c3RvbWl6ZXIpIHtcbiAgYmFzZU1lcmdlKG9iamVjdCwgc291cmNlLCBzcmNJbmRleCwgY3VzdG9taXplcik7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgbWVyZ2VXaXRoO1xuIiwiaW1wb3J0IGFwcGx5IGZyb20gJy4vX2FwcGx5LmpzJztcbmltcG9ydCBiYXNlUmVzdCBmcm9tICcuL19iYXNlUmVzdC5qcyc7XG5pbXBvcnQgY3VzdG9tRGVmYXVsdHNNZXJnZSBmcm9tICcuL19jdXN0b21EZWZhdWx0c01lcmdlLmpzJztcbmltcG9ydCBtZXJnZVdpdGggZnJvbSAnLi9tZXJnZVdpdGguanMnO1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8uZGVmYXVsdHNgIGV4Y2VwdCB0aGF0IGl0IHJlY3Vyc2l2ZWx5IGFzc2lnbnNcbiAqIGRlZmF1bHQgcHJvcGVydGllcy5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgbXV0YXRlcyBgb2JqZWN0YC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMTAuMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHsuLi5PYmplY3R9IFtzb3VyY2VzXSBUaGUgc291cmNlIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICogQHNlZSBfLmRlZmF1bHRzXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZGVmYXVsdHNEZWVwKHsgJ2EnOiB7ICdiJzogMiB9IH0sIHsgJ2EnOiB7ICdiJzogMSwgJ2MnOiAzIH0gfSk7XG4gKiAvLyA9PiB7ICdhJzogeyAnYic6IDIsICdjJzogMyB9IH1cbiAqL1xudmFyIGRlZmF1bHRzRGVlcCA9IGJhc2VSZXN0KGZ1bmN0aW9uKGFyZ3MpIHtcbiAgYXJncy5wdXNoKHVuZGVmaW5lZCwgY3VzdG9tRGVmYXVsdHNNZXJnZSk7XG4gIHJldHVybiBhcHBseShtZXJnZVdpdGgsIHVuZGVmaW5lZCwgYXJncyk7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmYXVsdHNEZWVwO1xuIiwiaW1wb3J0IGlkZW50aXR5IGZyb20gJy4vaWRlbnRpdHkuanMnO1xuXG4vKipcbiAqIENhc3RzIGB2YWx1ZWAgdG8gYGlkZW50aXR5YCBpZiBpdCdzIG5vdCBhIGZ1bmN0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBpbnNwZWN0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIGNhc3QgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNhc3RGdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdmdW5jdGlvbicgPyB2YWx1ZSA6IGlkZW50aXR5O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjYXN0RnVuY3Rpb247XG4iLCJpbXBvcnQgYXJyYXlFYWNoIGZyb20gJy4vX2FycmF5RWFjaC5qcyc7XG5pbXBvcnQgYmFzZUVhY2ggZnJvbSAnLi9fYmFzZUVhY2guanMnO1xuaW1wb3J0IGNhc3RGdW5jdGlvbiBmcm9tICcuL19jYXN0RnVuY3Rpb24uanMnO1xuaW1wb3J0IGlzQXJyYXkgZnJvbSAnLi9pc0FycmF5LmpzJztcblxuLyoqXG4gKiBJdGVyYXRlcyBvdmVyIGVsZW1lbnRzIG9mIGBjb2xsZWN0aW9uYCBhbmQgaW52b2tlcyBgaXRlcmF0ZWVgIGZvciBlYWNoIGVsZW1lbnQuXG4gKiBUaGUgaXRlcmF0ZWUgaXMgaW52b2tlZCB3aXRoIHRocmVlIGFyZ3VtZW50czogKHZhbHVlLCBpbmRleHxrZXksIGNvbGxlY3Rpb24pLlxuICogSXRlcmF0ZWUgZnVuY3Rpb25zIG1heSBleGl0IGl0ZXJhdGlvbiBlYXJseSBieSBleHBsaWNpdGx5IHJldHVybmluZyBgZmFsc2VgLlxuICpcbiAqICoqTm90ZToqKiBBcyB3aXRoIG90aGVyIFwiQ29sbGVjdGlvbnNcIiBtZXRob2RzLCBvYmplY3RzIHdpdGggYSBcImxlbmd0aFwiXG4gKiBwcm9wZXJ0eSBhcmUgaXRlcmF0ZWQgbGlrZSBhcnJheXMuIFRvIGF2b2lkIHRoaXMgYmVoYXZpb3IgdXNlIGBfLmZvckluYFxuICogb3IgYF8uZm9yT3duYCBmb3Igb2JqZWN0IGl0ZXJhdGlvbi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAYWxpYXMgZWFjaFxuICogQGNhdGVnb3J5IENvbGxlY3Rpb25cbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtpdGVyYXRlZT1fLmlkZW50aXR5XSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fE9iamVjdH0gUmV0dXJucyBgY29sbGVjdGlvbmAuXG4gKiBAc2VlIF8uZm9yRWFjaFJpZ2h0XG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZm9yRWFjaChbMSwgMl0sIGZ1bmN0aW9uKHZhbHVlKSB7XG4gKiAgIGNvbnNvbGUubG9nKHZhbHVlKTtcbiAqIH0pO1xuICogLy8gPT4gTG9ncyBgMWAgdGhlbiBgMmAuXG4gKlxuICogXy5mb3JFYWNoKHsgJ2EnOiAxLCAnYic6IDIgfSwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICogICBjb25zb2xlLmxvZyhrZXkpO1xuICogfSk7XG4gKiAvLyA9PiBMb2dzICdhJyB0aGVuICdiJyAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKS5cbiAqL1xuZnVuY3Rpb24gZm9yRWFjaChjb2xsZWN0aW9uLCBpdGVyYXRlZSkge1xuICB2YXIgZnVuYyA9IGlzQXJyYXkoY29sbGVjdGlvbikgPyBhcnJheUVhY2ggOiBiYXNlRWFjaDtcbiAgcmV0dXJuIGZ1bmMoY29sbGVjdGlvbiwgY2FzdEZ1bmN0aW9uKGl0ZXJhdGVlKSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZvckVhY2g7XG4iLCJpbXBvcnQgYmFzZU1lcmdlIGZyb20gJy4vX2Jhc2VNZXJnZS5qcyc7XG5pbXBvcnQgY3JlYXRlQXNzaWduZXIgZnJvbSAnLi9fY3JlYXRlQXNzaWduZXIuanMnO1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8uYXNzaWduYCBleGNlcHQgdGhhdCBpdCByZWN1cnNpdmVseSBtZXJnZXMgb3duIGFuZFxuICogaW5oZXJpdGVkIGVudW1lcmFibGUgc3RyaW5nIGtleWVkIHByb3BlcnRpZXMgb2Ygc291cmNlIG9iamVjdHMgaW50byB0aGVcbiAqIGRlc3RpbmF0aW9uIG9iamVjdC4gU291cmNlIHByb3BlcnRpZXMgdGhhdCByZXNvbHZlIHRvIGB1bmRlZmluZWRgIGFyZVxuICogc2tpcHBlZCBpZiBhIGRlc3RpbmF0aW9uIHZhbHVlIGV4aXN0cy4gQXJyYXkgYW5kIHBsYWluIG9iamVjdCBwcm9wZXJ0aWVzXG4gKiBhcmUgbWVyZ2VkIHJlY3Vyc2l2ZWx5LiBPdGhlciBvYmplY3RzIGFuZCB2YWx1ZSB0eXBlcyBhcmUgb3ZlcnJpZGRlbiBieVxuICogYXNzaWdubWVudC4gU291cmNlIG9iamVjdHMgYXJlIGFwcGxpZWQgZnJvbSBsZWZ0IHRvIHJpZ2h0LiBTdWJzZXF1ZW50XG4gKiBzb3VyY2VzIG92ZXJ3cml0ZSBwcm9wZXJ0eSBhc3NpZ25tZW50cyBvZiBwcmV2aW91cyBzb3VyY2VzLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBtdXRhdGVzIGBvYmplY3RgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC41LjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7Li4uT2JqZWN0fSBbc291cmNlc10gVGhlIHNvdXJjZSBvYmplY3RzLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHtcbiAqICAgJ2EnOiBbeyAnYic6IDIgfSwgeyAnZCc6IDQgfV1cbiAqIH07XG4gKlxuICogdmFyIG90aGVyID0ge1xuICogICAnYSc6IFt7ICdjJzogMyB9LCB7ICdlJzogNSB9XVxuICogfTtcbiAqXG4gKiBfLm1lcmdlKG9iamVjdCwgb3RoZXIpO1xuICogLy8gPT4geyAnYSc6IFt7ICdiJzogMiwgJ2MnOiAzIH0sIHsgJ2QnOiA0LCAnZSc6IDUgfV0gfVxuICovXG52YXIgbWVyZ2UgPSBjcmVhdGVBc3NpZ25lcihmdW5jdGlvbihvYmplY3QsIHNvdXJjZSwgc3JjSW5kZXgpIHtcbiAgYmFzZU1lcmdlKG9iamVjdCwgc291cmNlLCBzcmNJbmRleCk7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgbWVyZ2U7XG4iLCIvKipcclxuICogUGFydCBvZiBzdGFydGVyIHByb2plY3QuXHJcbiAqXHJcbiAqIEBjb3B5cmlnaHQgIENvcHlyaWdodCAoQykgMjAyMSBfX09SR0FOSVpBVElPTl9fLlxyXG4gKiBAbGljZW5zZSAgICBfX0xJQ0VOU0VfX1xyXG4gKi9cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXREYXRhKGVsZW1lbnQsIG5hbWUpIHtcclxuICBwcmVwYXJlRGF0YShlbGVtZW50KTtcclxuICByZXR1cm4gZWxlbWVudC5fX3VuaWNvcm5bbmFtZV07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXREYXRhKGVsZW1lbnQsIG5hbWUsIHZhbHVlKSB7XHJcbiAgcHJlcGFyZURhdGEoZWxlbWVudCk7XHJcbiAgZWxlbWVudC5fX3VuaWNvcm5bbmFtZV0gPSB2YWx1ZTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRlZkRhdGEoZWxlbWVudCwgbmFtZSwgZGVmQ2FsbGJhY2spIHtcclxuICBwcmVwYXJlRGF0YShlbGVtZW50KTtcclxuICBlbGVtZW50Ll9fdW5pY29ybltuYW1lXSA9IGVsZW1lbnQuX191bmljb3JuW25hbWVdIHx8IGRlZkNhbGxiYWNrKCk7XHJcblxyXG4gIHJldHVybiBlbGVtZW50Ll9fdW5pY29ybltuYW1lXTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHByZXBhcmVEYXRhKGVsZW1lbnQpIHtcclxuICBpZiAoIWVsZW1lbnQpIHtcclxuICAgIHJldHVybiBlbGVtZW50O1xyXG4gIH1cclxuXHJcbiAgZWxlbWVudC5fX3VuaWNvcm4gPSBlbGVtZW50Ll9fdW5pY29ybiB8fCB7fTtcclxuICByZXR1cm4gZWxlbWVudDtcclxufVxyXG4iLCIvKipcclxuICogUGFydCBvZiBVbmljb3JuIHByb2plY3QuXHJcbiAqXHJcbiAqIEBjb3B5cmlnaHQgIENvcHlyaWdodCAoQykgMjAxNiBMWVJBU09GVC4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuICogQGxpY2Vuc2UgICAgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAyIG9yIGxhdGVyLlxyXG4gKi9cclxuXHJcbmltcG9ydCB7IG1lcmdlIH0gZnJvbSAnbG9kYXNoLWVzJztcclxuaW1wb3J0IHsgZGVmRGF0YSB9IGZyb20gJy4uL3V0aWxpdGllcy5qcyc7XHJcblxyXG4vKipcclxuICogVW5pY29ybkdyaWRcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFVuaWNvcm5HcmlkIHtcclxuICBzdGF0aWMgZ2V0IGlzKCkgeyByZXR1cm4gJ2dyaWQnOyB9XHJcblxyXG4gIHN0YXRpYyBpbnN0YWxsKGFwcCwgb3B0aW9ucyA9IHt9KSB7XHJcbiAgICBhcHAuZ3JpZCA9IChlbGUsIG9wdGlvbnMgPSB7fSkgPT4ge1xyXG4gICAgICBjb25zdCBzZWxlY3RvciA9IHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogbnVsbDtcclxuICAgICAgZWxlID0gYXBwLnNlbGVjdE9uZShlbGUpO1xyXG5cclxuICAgICAgcmV0dXJuIGRlZkRhdGEoXHJcbiAgICAgICAgZWxlLFxyXG4gICAgICAgICdncmlkLnBsdWdpbicsXHJcbiAgICAgICAgKCkgPT4gbmV3IFVuaWNvcm5HcmlkRWxlbWVudChzZWxlY3RvciwgZWxlLCBvcHRpb25zLCBhcHApXHJcbiAgICAgICk7XHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuY2xhc3MgVW5pY29ybkdyaWRFbGVtZW50IHtcclxuICBvcmRlcmluZyA9ICcnO1xyXG5cclxuICBzdGF0aWMgZ2V0IGRlZmF1bHRPcHRpb25zKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgLy9cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbnN0cnVjdG9yKHNlbGVjdG9yLCBlbGVtZW50LCBvcHRpb25zLCBhcHApIHtcclxuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICB0aGlzLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmNvbnN0cnVjdG9yLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcclxuICAgIHRoaXMuYXBwID0gYXBwO1xyXG4gICAgdGhpcy5mb3JtID0gYXBwLmZvcm0oc2VsZWN0b3IgfHwgZWxlbWVudCk7XHJcblxyXG4gICAgaWYgKCF0aGlzLmZvcm0pIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmljb3JuR3JpZCBpcyBkZXBlbmRlbnQgb24gVW5pY29ybkZvcm0nKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnRzKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTdGFydCB0aGlzIG9iamVjdCBhbmQgZXZlbnRzLlxyXG4gICAqL1xyXG4gIHJlZ2lzdGVyRXZlbnRzKCkge1xyXG4gICAgLy8gdGhpcy5zZWFyY2hDbGVhckJ1dHRvbi5jbGljaygoKSA9PiB7XHJcbiAgICAvLyAgIHRoaXMuc2VhcmNoQ29udGFpbmVyLmZpbmQoJ2lucHV0LCB0ZXh0YXJlYSwgc2VsZWN0JykudmFsKCcnKTtcclxuICAgIC8vICAgdGhpcy5maWx0ZXJDb250YWluZXIuZmluZCgnaW5wdXQsIHRleHRhcmVhLCBzZWxlY3QnKS52YWwoJycpO1xyXG4gICAgLy9cclxuICAgIC8vICAgdGhpcy5mb3JtLnN1Ym1pdCgpO1xyXG4gICAgLy8gfSk7XHJcbiAgICAvL1xyXG4gICAgLy8gdGhpcy5maWx0ZXJCdXR0b24uY2xpY2soZXZlbnQgPT4ge1xyXG4gICAgLy8gICB0aGlzLnRvZ2dsZUZpbHRlcigpO1xyXG4gICAgLy8gICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIC8vICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIC8vIH0pO1xyXG4gICAgLy9cclxuICAgIC8vIHRoaXMuc29ydEJ1dHRvbnMuY2xpY2soZXZlbnQgPT4ge1xyXG4gICAgLy8gICBzZWxmLnNvcnQoZXZlbnQuY3VycmVudFRhcmdldCwgZXZlbnQpO1xyXG4gICAgLy8gfSk7XHJcbiAgfVxyXG5cclxuICAvLyByZWdpc3RlckN1c3RvbUVsZW1lbnRzKCkge1xyXG4gIC8vICAgcmV0dXJuIGFwcC5pbXBvcnQoJ0B1bmljb3JuL3VpL2dyaWQtY29tcG9uZW50cy5qcycpO1xyXG4gIC8vIH1cclxuXHJcbiAgaW5pdENvbXBvbmVudChzdG9yZSA9ICdncmlkJywgY3VzdG9tID0ge30pIHtcclxuICAgIHRoaXMub3JkZXJpbmcgPSB0aGlzLmVsZW1lbnQuZGF0YXNldC5vcmRlcmluZztcclxuXHJcbiAgICBpZiAoIXRoaXMub3JkZXJpbmcudG9Mb3dlckNhc2UoKS5lbmRzV2l0aCgnIGFzYycpXHJcbiAgICAgICYmICF0aGlzLm9yZGVyaW5nLnRvTG93ZXJDYXNlKCkuZW5kc1dpdGgoJyBkZXNjJykpIHtcclxuICAgICAgdGhpcy5vcmRlcmluZyArPSAnIEFTQyc7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuYXBwLmxvYWRTcHJ1Y2UoKVxyXG4gICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgU3BydWNlLnN0b3JlKHN0b3JlLCB0aGlzLnVzZVN0YXRlKGN1c3RvbSkpO1xyXG4gICAgICAgIC8vIHRoaXMucmVnaXN0ZXJDdXN0b21FbGVtZW50cygpO1xyXG4gICAgICAgIHRoaXMuYXBwLnN0YXJ0QWxwaW5lKCk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXNlU3RhdGUoY3VzdG9tID0ge30pIHtcclxuICAgIHJldHVybiBtZXJnZShcclxuICAgICAgdGhpcyxcclxuICAgICAgY3VzdG9tXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgc2VuZEZpbHRlcigkZXZlbnQpIHtcclxuICAgIGlmICgkZXZlbnQpIHtcclxuICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5mb3JtLnB1dCgpO1xyXG4gIH1cclxuXHJcbiAgY2xlYXJGaWx0ZXJzKGVsZW1lbnQpIHtcclxuICAgIGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQsIHRleHRhcmVhLCBzZWxlY3QnKS5mb3JFYWNoKChlbGUpID0+IHtcclxuICAgICAgZWxlLnZhbHVlID0gJyc7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmZvcm0ucHV0KCk7XHJcbiAgfVxyXG5cclxuICBzb3J0KCRlbCkge1xyXG4gICAgY29uc3QgZGlyID0gdGhpcy5nZXREaXJlY3Rpb24oJGVsKTtcclxuXHJcbiAgICBjb25zdCBmaWVsZCA9ICRlbC5kYXRhc2V0LmZpZWxkO1xyXG4gICAgbGV0IGFzYyA9ICRlbC5kYXRhc2V0LmFzYztcclxuICAgIGxldCBkZXNjID0gJGVsLmRhdGFzZXQuZGVzYztcclxuXHJcbiAgICBpZiAoZmllbGQpIHtcclxuICAgICAgYXNjID0gZmllbGQgKyAnIEFTQyc7XHJcbiAgICAgIGRlc2MgPSBmaWVsZCArICcgREVTQyc7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGRpciA9PT0gJ0FTQycpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuc29ydEJ5KGRlc2MpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLnNvcnRCeShhc2MpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU29ydCB0d28gaXRlbXMuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gb3JkZXJpbmdcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAqL1xyXG4gIHNvcnRCeShvcmRlcmluZykge1xyXG4gICAgbGV0IG9yZGVyaW5nSW5wdXQgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1saXN0X29yZGVyaW5nXScpO1xyXG5cclxuICAgIGlmICghb3JkZXJpbmdJbnB1dCkge1xyXG4gICAgICBvcmRlcmluZ0lucHV0ID0gdGhpcy5hcHAuaCgnaW5wdXQnLCB7IG5hbWU6ICdsaXN0X29yZGVyaW5nJywgdHlwZTogJ2hpZGRlbicsIHZhbHVlOiAnJyB9KTtcclxuXHJcbiAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChvcmRlcmluZ0lucHV0KTtcclxuICAgIH1cclxuXHJcbiAgICBvcmRlcmluZ0lucHV0LnZhbHVlID0gb3JkZXJpbmc7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuZm9ybS5wdXQoKTtcclxuICB9XHJcblxyXG4gIGlzU29ydEFjdGl2ZSgkZWwpIHtcclxuICAgIHJldHVybiB0aGlzLmdldERpcmVjdGlvbigkZWwpICE9IG51bGw7XHJcbiAgfVxyXG5cclxuICBnZXREaXJlY3Rpb24oJGVsKSB7XHJcbiAgICBjb25zdCBmaWVsZCA9ICRlbC5kYXRhc2V0LmZpZWxkO1xyXG4gICAgbGV0IGFzYyA9ICRlbC5kYXRhc2V0LmFzYztcclxuICAgIGxldCBkZXNjID0gJGVsLmRhdGFzZXQuZGVzYztcclxuXHJcbiAgICBpZiAoZmllbGQpIHtcclxuICAgICAgYXNjID0gZmllbGQgKyAnIEFTQyc7XHJcbiAgICAgIGRlc2MgPSBmaWVsZCArICcgREVTQyc7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMub3JkZXJpbmdFcXVhbHMoYXNjLCB0aGlzLm9yZGVyaW5nKSkge1xyXG4gICAgICByZXR1cm4gJ0FTQyc7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMub3JkZXJpbmdFcXVhbHMoZGVzYywgdGhpcy5vcmRlcmluZykpIHtcclxuICAgICAgcmV0dXJuICdERVNDJztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIG9yZGVyaW5nRXF1YWxzKGEsIGIpIHtcclxuICAgIGEgPSBhLnJlcGxhY2UoL1xccysvZywgJyAnKS50cmltKCkudG9Mb3dlckNhc2UoKTtcclxuICAgIGIgPSBiLnJlcGxhY2UoL1xccysvZywgJyAnKS50cmltKCkudG9Mb3dlckNhc2UoKTtcclxuXHJcbiAgICByZXR1cm4gYSA9PT0gYjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENoZWNrIGEgcm93J3MgY2hlY2tib3guXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge251bWJlcn0gIHJvd1xyXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gdmFsdWVcclxuICAgKi9cclxuICBjaGVja1Jvdyhyb3csIHZhbHVlID0gdHJ1ZSkge1xyXG4gICAgY29uc3QgY2ggPSB0aGlzLmZvcm0uZmluZCgnaW5wdXQuZ3JpZC1jaGVja2JveFtkYXRhLXJvdy1udW1iZXI9JyArIHJvdyArICddJyk7XHJcblxyXG4gICAgaWYgKCFjaC5sZW5ndGgpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDaGVja2JveCBvZiByb3c6ICcgKyByb3cgKyAnIG5vdCBmb3VuZC4nKTtcclxuICAgIH1cclxuXHJcbiAgICBjaFswXS5jaGVja2VkID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBVcGRhdGUgYSByb3cuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IHJvd1xyXG4gICAqIEBwYXJhbSAge3N0cmluZ30gdXJsXHJcbiAgICogQHBhcmFtICB7T2JqZWN0fSBxdWVyaWVzXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgKi9cclxuICB1cGRhdGVSb3cocm93LCB1cmwsIHF1ZXJpZXMpIHtcclxuICAgIHRoaXMudG9nZ2xlQWxsKGZhbHNlKTtcclxuXHJcbiAgICB0aGlzLmNoZWNrUm93KHJvdyk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuY29yZS5wYXRjaCh1cmwsIHF1ZXJpZXMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVXBkYXRlIGEgcm93IHdpdGggYmF0Y2ggdGFzay5cclxuICAgKlxyXG4gICAqIEBwYXJhbSAge3N0cmluZ30gdGFza1xyXG4gICAqIEBwYXJhbSAge251bWJlcn0gcm93XHJcbiAgICogQHBhcmFtICB7c3RyaW5nfSB1cmxcclxuICAgKiBAcGFyYW0gIHtPYmplY3R9IHF1ZXJpZXNcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAqL1xyXG4gIGRvVGFzayh0YXNrLCByb3csIHVybCwgcXVlcmllcykge1xyXG4gICAgcXVlcmllcyA9IHF1ZXJpZXMgfHwge307XHJcblxyXG4gICAgcXVlcmllcy50YXNrID0gdGFzaztcclxuXHJcbiAgICByZXR1cm4gdGhpcy51cGRhdGVSb3cocm93LCB1cmwsIHF1ZXJpZXMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQmF0Y2ggdXBkYXRlIGl0ZW1zLlxyXG4gICAqXHJcbiAgICogQHBhcmFtICB7c3RyaW5nfSB0YXNrXHJcbiAgICogQHBhcmFtICB7c3RyaW5nfSB1cmxcclxuICAgKiBAcGFyYW0gIHtPYmplY3R9IHF1ZXJpZXNcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAqL1xyXG4gIGJhdGNoKHRhc2ssIHVybCwgcXVlcmllcykge1xyXG4gICAgcXVlcmllcyA9IHF1ZXJpZXMgfHwge307XHJcblxyXG4gICAgcXVlcmllcy50YXNrID0gdGFzaztcclxuXHJcbiAgICByZXR1cm4gdGhpcy5jb3JlLnBhdGNoKHVybCwgcXVlcmllcyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDb3B5IGEgcm93LlxyXG4gICAqXHJcbiAgICogQHBhcmFtICB7bnVtYmVyfSByb3dcclxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHVybFxyXG4gICAqIEBwYXJhbSAge09iamVjdH0gcXVlcmllc1xyXG4gICAqXHJcbiAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICovXHJcbiAgY29weVJvdyhyb3csIHVybCwgcXVlcmllcykge1xyXG4gICAgdGhpcy50b2dnbGVBbGwoZmFsc2UpO1xyXG5cclxuICAgIHRoaXMuY2hlY2tSb3cocm93KTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5jb3JlLnBvc3QodXJsLCBxdWVyaWVzKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIERlbGV0ZSBjaGVja2VkIGl0ZW1zLlxyXG4gICAqXHJcbiAgICogQHBhcmFtICB7c3RyaW5nfSBtZXNzYWdlXHJcbiAgICogQHBhcmFtICB7c3RyaW5nfSB1cmxcclxuICAgKiBAcGFyYW0gIHtPYmplY3R9IHF1ZXJpZXNcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAqL1xyXG4gIGRlbGV0ZUxpc3QobWVzc2FnZSwgdXJsLCBxdWVyaWVzKSB7XHJcbiAgICBtZXNzYWdlID0gbWVzc2FnZSA9PSBudWxsID8gdGhpcy5hcHAuX18oJ3VuaWNvcm4ubWVzc2FnZS5kZWxldGUuY29uZmlybScpIDogbWVzc2FnZTtcclxuXHJcbiAgICBpZiAobWVzc2FnZSAhPT0gZmFsc2UpIHtcclxuICAgICAgdGhpcy5hcHAuY29uZmlybShtZXNzYWdlLCBpc0NvbmZpcm0gPT4ge1xyXG4gICAgICAgIGlmIChpc0NvbmZpcm0pIHtcclxuICAgICAgICAgIHRoaXMuY29yZVsnZGVsZXRlJ10odXJsLCBxdWVyaWVzKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5jb3JlWydkZWxldGUnXSh1cmwsIHF1ZXJpZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRGVsZXRlIGFuIGl0bWUuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IHJvd1xyXG4gICAqIEBwYXJhbSAge3N0cmluZ30gbXNnXHJcbiAgICogQHBhcmFtICB7c3RyaW5nfSB1cmxcclxuICAgKiBAcGFyYW0gIHtPYmplY3R9IHF1ZXJpZXNcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAqL1xyXG4gIGRlbGV0ZVJvdyhyb3csIG1zZywgdXJsLCBxdWVyaWVzKSB7XHJcbiAgICBtc2cgPSBtc2cgfHwgdGhpcy5hcHAuX18oJ3VuaWNvcm4ubWVzc2FnZS5kZWxldGUuY29uZmlybScpO1xyXG5cclxuICAgIHRoaXMuYXBwLmNvbmZpcm0obXNnLCBpc0NvbmZpcm0gPT4ge1xyXG4gICAgICBpZiAoaXNDb25maXJtKSB7XHJcbiAgICAgICAgdGhpcy50b2dnbGVBbGwoZmFsc2UpO1xyXG5cclxuICAgICAgICB0aGlzLmNoZWNrUm93KHJvdyk7XHJcblxyXG4gICAgICAgIHRoaXMuZGVsZXRlTGlzdChmYWxzZSwgdXJsLCBxdWVyaWVzKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUb2dnbGUgYWxsIGNoZWNrYm94ZXMuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gIHtib29sZWFufSAgICAgICAgICB2YWx1ZSAgICAgQ2hlY2tlZCBvciB1bmNoZWNrZWQuXHJcbiAgICovXHJcbiAgdG9nZ2xlQWxsKHZhbHVlKSB7XHJcbiAgICB0aGlzLmFwcC5zZWxlY3RBbGwoXHJcbiAgICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFtkYXRhLXJvbGU9Z3JpZC1jaGVja2JveF1bdHlwZT1jaGVja2JveF0nKVxyXG4gICAgKVxyXG4gICAgICAubWFwKChpbnB1dCkgPT4ge1xyXG4gICAgICAgIGlucHV0LmNoZWNrZWQgPSB2YWx1ZTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDb3VudCBjaGVja2VkIGNoZWNrYm94ZXMuXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyB7aW50fVxyXG4gICAqL1xyXG4gIGNvdW50Q2hlY2tlZCgpIHtcclxuICAgIHJldHVybiB0aGlzLmdldENoZWNrZWQoKS5sZW5ndGg7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgQ2hlY2tlZCBib3hlcy5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHtFbGVtZW50W119XHJcbiAgICovXHJcbiAgZ2V0Q2hlY2tlZCgpIHtcclxuICAgIHJldHVybiB0aGlzLmFwcC5zZWxlY3RBbGwoXHJcbiAgICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFtkYXRhLXJvbGU9Z3JpZC1jaGVja2JveF1bdHlwZT1jaGVja2JveF0nKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFZhbGlkYXRlIHRoZXJlIGhhcyBvbmUgb3IgbW9yZSBjaGVja2VkIGJveGVzLlxyXG4gICAqXHJcbiAgICogQHBhcmFtICAge3N0cmluZ30gIG1zZ1xyXG4gICAqIEBwYXJhbSAgIHtFdmVudH0gICBldmVudFxyXG4gICAqXHJcbiAgICogQHJldHVybnMge1VuaWNvcm5HcmlkRWxlbWVudH1cclxuICAgKi9cclxuICBoYXNDaGVja2VkKG1zZywgZXZlbnQpIHtcclxuICAgIG1zZyA9IG1zZyB8fCBVbmljb3JuLlRyYW5zbGF0b3IudHJhbnNsYXRlKCd1bmljb3JuLm1lc3NhZ2UuZ3JpZC5jaGVja2VkJyk7XHJcblxyXG4gICAgaWYgKCF0aGlzLmNvdW50Q2hlY2tlZCgpKSB7XHJcbiAgICAgIGFsZXJ0KG1zZyk7XHJcblxyXG4gICAgICAvLyBJZiB5b3Ugc2VuZCBldmVudCBvYmplY3QgYXMgc2Vjb25kIGFyZ3VtZW50LCB3ZSB3aWxsIHN0b3AgYWxsIGFjdGlvbnMuXHJcbiAgICAgIGlmIChldmVudCkge1xyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVvcmRlciBhbGwuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gICB7c3RyaW5nfSAgdXJsXHJcbiAgICogQHBhcmFtICAge09iamVjdH0gIHF1ZXJpZXNcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAqL1xyXG4gIHJlb3JkZXJBbGwodXJsLCBxdWVyaWVzKSB7XHJcbiAgICBjb25zdCBzZWxmID0gdGhpcztcclxuICAgIGNvbnN0IG9yaWdpbiA9IHRoaXMuZm9ybS5maW5kKCdpbnB1dFtuYW1lPW9yaWdpbl9vcmRlcmluZ10nKTtcclxuXHJcbiAgICAvLyBJZiBvcmlnaW4gZXhpc3RzLCB3ZSBkaWZmIHRoZW0gYW5kIG9ubHkgc2VuZCBjaGFuZ2VkIGdyb3VwLlxyXG4gICAgaWYgKG9yaWdpbi5sZW5ndGgpIHtcclxuICAgICAgY29uc3Qgb3JpZ2luT3JkZXJpbmcgPSBvcmlnaW4udmFsKCkuc3BsaXQoJywnKTtcclxuICAgICAgY29uc3QgaW5wdXRzID0gdGhpcy5mb3JtLmZpbmQoJy5vcmRlcmluZy1jb250cm9sIGlucHV0Jyk7XHJcblxyXG4gICAgICB0aGlzLnRvZ2dsZUFsbCgpO1xyXG5cclxuICAgICAgaW5wdXRzLmVhY2goZnVuY3Rpb24oaSkge1xyXG4gICAgICAgIGNvbnN0ICR0aGlzID0gJCh0aGlzKTtcclxuXHJcbiAgICAgICAgaWYgKCR0aGlzLnZhbCgpICE9PSBvcmlnaW5PcmRlcmluZ1tpXSkge1xyXG4gICAgICAgICAgLy8gQ2hlY2sgc2VsZlxyXG4gICAgICAgICAgc2VsZi5jaGVja1JvdygkdGhpcy5hdHRyKCdkYXRhLW9yZGVyLXJvdycpKTtcclxuXHJcbiAgICAgICAgICBjb25zdCB0ciA9ICR0aGlzLnBhcmVudHMoJ3RyJyk7XHJcbiAgICAgICAgICBjb25zdCBncm91cCA9IHRyLmF0dHIoJ2RhdGEtb3JkZXItZ3JvdXAnKTtcclxuXHJcbiAgICAgICAgICAvLyBDaGVjayBzYW1lIGdyb3VwIGJveGVzXHJcbiAgICAgICAgICBpZiAoZ3JvdXAgIT09ICcnKSB7XHJcbiAgICAgICAgICAgIHRyLnNpYmxpbmdzKCdbZGF0YS1vcmRlci1ncm91cD0nICsgZ3JvdXAgKyAnXScpXHJcbiAgICAgICAgICAgICAgLmZpbmQoJ2lucHV0LmdyaWQtY2hlY2tib3gnKVxyXG4gICAgICAgICAgICAgIC5wcm9wKCdjaGVja2VkJywgdHJ1ZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5iYXRjaCgncmVvcmRlcicsIHVybCwgcXVlcmllcyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZW9yZGVyIGl0ZW1zLlxyXG4gICAqXHJcbiAgICogQHBhcmFtICB7aW50fSAgICAgcm93XHJcbiAgICogQHBhcmFtICB7aW50fSAgICAgZGVsdGFcclxuICAgKiBAcGFyYW0gIHtzdHJpbmd9ICB1cmxcclxuICAgKiBAcGFyYW0gIHtPYmplY3R9ICBxdWVyaWVzXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgKi9cclxuICByZW9yZGVyKHJvdywgZGVsdGEsIHVybCwgcXVlcmllcykge1xyXG4gICAgcXVlcmllcyA9IHF1ZXJpZXMgfHwge307XHJcbiAgICBxdWVyaWVzLmRlbHRhID0gZGVsdGE7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuZG9UYXNrKCdyZW9yZGVyJywgcm93LCB1cmwsIHF1ZXJpZXMpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaXNTb3J0QWN0aXZlKCRlbCkge1xyXG4gIGxldCBmaWVsZCA9ICRlbC5kYXRhc2V0LmZpZWxkO1xyXG4gIGxldCBkZXNjID0gJGVsLmRhdGFzZXQuZGVzYztcclxuICBsZXQgYXNjID0gJGVsLmRhdGFzZXQuYXNjO1xyXG4gIFxyXG4gIGRlc2MgPSBkZXNjIHx8IGAke2ZpZWxkfSBERVNDYDtcclxuICBhc2MgPSBhc2MgfHwgYCR7ZmllbGR9IEFTQ2A7XHJcblxyXG4gIGNvbnN0IG9yZGVyaW5nID0gdGhpcy5ncmlkLmVsZW1lbnQuZGF0YXNldC5vcmRlcmluZztcclxuICBjb25zb2xlLmxvZyhvcmRlcmluZywgYXNjLCBkZXNjKTtcclxuICByZXR1cm4gb3JkZXJpbmcgPT09IGFzYyB8fCBvcmRlcmluZyA9PT0gZGVzYztcclxufVxyXG4iLCIvKipcclxuICogUGFydCBvZiBzdGFydGVyIHByb2plY3QuXHJcbiAqXHJcbiAqIEBjb3B5cmlnaHQgIENvcHlyaWdodCAoQykgMjAyMSBfX09SR0FOSVpBVElPTl9fLlxyXG4gKiBAbGljZW5zZSAgICBfX0xJQ0VOU0VfX1xyXG4gKi9cclxuXHJcbmltcG9ydCB7IGRlZkRhdGEgfSBmcm9tICcuLi91dGlsaXRpZXMuanMnO1xyXG5pbXBvcnQgeyBlYWNoLCBtZXJnZSB9IGZyb20gJ2xvZGFzaC1lcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVbmljb3JuRm9ybSB7XHJcbiAgc3RhdGljIGdldCBpcygpIHtcclxuICAgIHJldHVybiAnZm9ybSc7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgaW5zdGFsbChhcHAsIG9wdGlvbnMgPSB7fSkge1xyXG4gICAgYXBwLmZvcm0gPSAoZWxlLCBvcHRpb25zID0ge30pID0+IHtcclxuICAgICAgY29uc3Qgc2VsZWN0b3IgPSB0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IG51bGw7XHJcbiAgICAgIGVsZSA9IGFwcC5zZWxlY3RPbmUoZWxlKTtcclxuXHJcbiAgICAgIHJldHVybiBkZWZEYXRhKFxyXG4gICAgICAgIGVsZSxcclxuICAgICAgICAnZm9ybS5wbHVnaW4nLFxyXG4gICAgICAgICgpID0+IG5ldyBVbmljb3JuRm9ybUVsZW1lbnQoc2VsZWN0b3IsIGVsZSwgb3B0aW9ucywgYXBwKVxyXG4gICAgICApO1xyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbmNsYXNzIFVuaWNvcm5Gb3JtRWxlbWVudCB7XHJcbiAgLyoqXHJcbiAgICogQ29uc3RydWN0b3IuXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9ICAgICAgc2VsZWN0b3JcclxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSAkZm9ybVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSAgICAgIG9wdGlvbnNcclxuICAgKiBAcGFyYW0ge1VuaWNvcm5BcHB9ICBhcHBcclxuICAgKi9cclxuICBjb25zdHJ1Y3RvcihzZWxlY3RvciwgJGZvcm0sIG9wdGlvbnMsIGFwcCkge1xyXG4gICAgdGhpcy5hcHAgPSBhcHA7XHJcblxyXG4gICAgLy8gSWYgZm9ybSBub3QgZm91bmQsIGNyZWF0ZSBvbmVcclxuICAgIGlmICghJGZvcm0pIHtcclxuICAgICAgJGZvcm0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb3JtJyk7XHJcblxyXG4gICAgICBpZiAoc2VsZWN0b3IuaW5kZXhPZignIycpID09PSAwKSB7XHJcbiAgICAgICAgJGZvcm0uc2V0QXR0cmlidXRlKCdpZCcsIHNlbGVjdG9yLnN1YnN0cigxKSk7XHJcbiAgICAgICAgJGZvcm0uc2V0QXR0cmlidXRlKCduYW1lJywgc2VsZWN0b3Iuc3Vic3RyKDEpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgJGZvcm0uc2V0QXR0cmlidXRlKCdtZXRob2QnLCAncG9zdCcpO1xyXG4gICAgICAkZm9ybS5zZXRBdHRyaWJ1dGUoJ2VuY3R5cGUnLCAnbXVsdGlwYXJ0L2Zvcm0tZGF0YScpO1xyXG4gICAgICAkZm9ybS5zZXRBdHRyaWJ1dGUoJ25vdmFsaWRhdGUnLCAndHJ1ZScpO1xyXG4gICAgICAkZm9ybS5zZXRBdHRyaWJ1dGUoJ2FjdGlvbicsIGFwcC5kYXRhKCd1bmljb3JuLnVyaScpWydmdWxsJ10pO1xyXG4gICAgICAkZm9ybS5zZXRBdHRyaWJ1dGUoJ2Rpc3BsYXknLCAnbm9uZScpO1xyXG5cclxuICAgICAgY29uc3QgY3NyZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XHJcbiAgICAgIGNzcmYuc2V0QXR0cmlidXRlKCduYW1lJywgYXBwLmRhdGEoJ2NzcmYtdG9rZW4nKSk7XHJcblxyXG4gICAgICAkZm9ybS5hcHBlbmRDaGlsZChjc3JmKTtcclxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCgkZm9ybSk7XHJcbiAgICB9XHJcblxyXG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oIHt9LCB0aGlzLmNvbnN0cnVjdG9yLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcclxuXHJcbiAgICB0aGlzLmVsZW1lbnQgPSAkZm9ybTtcclxuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XHJcblxyXG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XHJcbiAgfVxyXG5cclxuICBiaW5kRXZlbnRzKCkge1xyXG4gICAgLy8gaWYgKHRoaXMuZm9ybS5hdHRyKCdkYXRhLXRvb2xiYXInKSkge1xyXG4gICAgLy8gICAkKHRoaXMuZm9ybS5hdHRyKCdkYXRhLXRvb2xiYXInKSkuZmluZCgnKltkYXRhLWFjdGlvbl0nKS5vbignY2xpY2snLCAoZSkgPT4ge1xyXG4gICAgLy8gICAgIHRoaXMuZm9ybS50cmlnZ2VyKCd1bmljb3JuLnN1Ym1pdCcsIGUuY3VycmVudFRhcmdldCk7XHJcbiAgICAvLyAgIH0pO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIC8vIHRoaXMuZm9ybS5vbigndW5pY29ybi5zdWJtaXQnLCAoZSwgYnV0dG9uKSA9PiB7XHJcbiAgICAvLyAgIGNvbnN0ICRidXR0b24gPSAkKGJ1dHRvbik7XHJcbiAgICAvLyAgIGNvbnN0IGFjdGlvbiA9ICRidXR0b24uYXR0cignZGF0YS1hY3Rpb24nKTtcclxuICAgIC8vICAgY29uc3QgdGFyZ2V0ID0gJGJ1dHRvbi5hdHRyKCdkYXRhLXRhcmdldCcpIHx8IG51bGw7XHJcbiAgICAvLyAgIGNvbnN0IHF1ZXJ5ID0gJGJ1dHRvbi5kYXRhKCdxdWVyeScpIHx8IHt9O1xyXG4gICAgLy8gICBxdWVyeVsndGFzayddID0gJGJ1dHRvbi5hdHRyKCdkYXRhLXRhc2snKSB8fCBudWxsO1xyXG4gICAgLy9cclxuICAgIC8vICAgdGhpc1thY3Rpb25dKHRhcmdldCwgcXVlcnkpO1xyXG4gICAgLy8gfSk7XHJcbiAgfVxyXG5cclxuICBpbml0Q29tcG9uZW50KHN0b3JlID0gJ2Zvcm0nLCBjdXN0b20gPSB7fSkge1xyXG4gICAgcmV0dXJuIHRoaXMuYXBwLmxvYWRTcHJ1Y2UoKVxyXG4gICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgU3BydWNlLnN0b3JlKHN0b3JlLCB0aGlzLnVzZVN0YXRlKGN1c3RvbSkpO1xyXG4gICAgICAgIC8vIHRoaXMucmVnaXN0ZXJDdXN0b21FbGVtZW50cygpO1xyXG4gICAgICAgIHRoaXMuYXBwLnN0YXJ0QWxwaW5lKCk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXNlU3RhdGUoY3VzdG9tID0ge30pIHtcclxuICAgIHJldHVybiBtZXJnZShcclxuICAgICAgdGhpcyxcclxuICAgICAgY3VzdG9tXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTWFrZSBhIHJlcXVlc3QuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHVybFxyXG4gICAqIEBwYXJhbSAge09iamVjdH0gcXVlcmllc1xyXG4gICAqIEBwYXJhbSAge3N0cmluZ30gbWV0aG9kXHJcbiAgICogQHBhcmFtICB7c3RyaW5nfSBjdXN0b21NZXRob2RcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAqL1xyXG4gIHN1Ym1pdCh1cmwsIHF1ZXJpZXMsIG1ldGhvZCwgY3VzdG9tTWV0aG9kKSB7XHJcbiAgICBjb25zdCBmb3JtID0gdGhpcy5lbGVtZW50O1xyXG5cclxuICAgIGlmIChjdXN0b21NZXRob2QpIHtcclxuICAgICAgbGV0IG1ldGhvZElucHV0ID0gZm9ybS5xdWVyeVNlbGVjdG9yKCdpbnB1dFtuYW1lPVwiX21ldGhvZFwiXScpO1xyXG5cclxuICAgICAgaWYgKCFtZXRob2RJbnB1dCkge1xyXG4gICAgICAgIG1ldGhvZElucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcclxuICAgICAgICBtZXRob2RJbnB1dC5zZXRBdHRyaWJ1dGUoJ25hbWUnLCAnX21ldGhvZCcpO1xyXG4gICAgICAgIG1ldGhvZElucHV0LnNldEF0dHJpYnV0ZSgndHlwZScsICdoaWRkZW4nKTtcclxuXHJcbiAgICAgICAgZm9ybS5hcHBlbmRDaGlsZChtZXRob2RJbnB1dCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG1ldGhvZElucHV0LnZhbHVlID0gY3VzdG9tTWV0aG9kO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFNldCBxdWVyaWVzIGludG8gZm9ybS5cclxuICAgIGlmIChxdWVyaWVzKSB7XHJcbiAgICAgIGxldCBpbnB1dDtcclxuXHJcbiAgICAgIGNvbnN0IGZsYXR0ZWQgPSB0aGlzLmNvbnN0cnVjdG9yLmZsYXR0ZW5PYmplY3QocXVlcmllcyk7XHJcblxyXG4gICAgICBlYWNoKGZsYXR0ZWQsICh2YWx1ZSwga2V5KSA9PiB7XHJcbiAgICAgICAgY29uc3QgZmllbGROYW1lID0gdGhpcy5jb25zdHJ1Y3Rvci5idWlsZEZpZWxkTmFtZShrZXkpO1xyXG4gICAgICAgIGlucHV0ID0gZm9ybS5xdWVyeVNlbGVjdG9yKGBpbnB1dFtuYW1lPVwiJHtmaWVsZE5hbWV9XCJdYCk7XHJcblxyXG4gICAgICAgIGlmICghaW5wdXQpIHtcclxuICAgICAgICAgIGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcclxuICAgICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZSgnbmFtZScsIGZpZWxkTmFtZSk7XHJcbiAgICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnaGlkZGVuJyk7XHJcblxyXG4gICAgICAgICAgZm9ybS5hcHBlbmRDaGlsZChpbnB1dCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbnB1dC52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodXJsKSB7XHJcbiAgICAgIGZvcm0uc2V0QXR0cmlidXRlKCdhY3Rpb24nLCB1cmwpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChtZXRob2QpIHtcclxuICAgICAgZm9ybS5zZXRBdHRyaWJ1dGUoJ21ldGhvZCcsIG1ldGhvZCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ3JlYXRlIGEgc3VibWl0IGJ1dHRvbiB0aGF0IGNhbiBmaXJlIGBzdWJtaXRgIGV2ZW50XHJcbiAgICBsZXQgc3VibWl0QnV0dG9uID0gZm9ybS5xdWVyeVNlbGVjdG9yKGBidXR0b25bdHlwZT1zdWJtaXRdW2RhdGEtc3VibWl0XWApO1xyXG5cclxuICAgIGlmICghc3VibWl0QnV0dG9uKSB7XHJcbiAgICAgIHN1Ym1pdEJ1dHRvbiA9IHRoaXMuYXBwLmgoJ2J1dHRvbicsIHsgdHlwZTogJ3N1Ym1pdCcgfSwgJ0dPJyk7XHJcbiAgICAgIHN1Ym1pdEJ1dHRvbi5kYXRhc2V0LnN1Ym1pdCA9IHRydWU7XHJcbiAgICAgIHN1Ym1pdEJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICBmb3JtLmFwcGVuZENoaWxkKHN1Ym1pdEJ1dHRvbik7XHJcbiAgICB9XHJcblxyXG4gICAgc3VibWl0QnV0dG9uLmNsaWNrKCk7XHJcblxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNYWtlIGEgR0VUIHJlcXVlc3QuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHVybFxyXG4gICAqIEBwYXJhbSAge09iamVjdH0gcXVlcmllc1xyXG4gICAqIEBwYXJhbSAge3N0cmluZ30gY3VzdG9tTWV0aG9kXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgKi9cclxuICBnZXQodXJsLCBxdWVyaWVzLCBjdXN0b21NZXRob2QpIHtcclxuICAgIHJldHVybiB0aGlzLnN1Ym1pdCh1cmwsIHF1ZXJpZXMsICdHRVQnLCBjdXN0b21NZXRob2QpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUG9zdCBmb3JtLlxyXG4gICAqXHJcbiAgICogQHBhcmFtICB7c3RyaW5nfSB1cmxcclxuICAgKiBAcGFyYW0gIHtPYmplY3R9IHF1ZXJpZXNcclxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IGN1c3RvbU1ldGhvZFxyXG4gICAqXHJcbiAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICovXHJcbiAgcG9zdCh1cmwsIHF1ZXJpZXMsIGN1c3RvbU1ldGhvZCkge1xyXG4gICAgY3VzdG9tTWV0aG9kID0gY3VzdG9tTWV0aG9kIHx8ICdQT1NUJztcclxuXHJcbiAgICByZXR1cm4gdGhpcy5zdWJtaXQodXJsLCBxdWVyaWVzLCAnUE9TVCcsIGN1c3RvbU1ldGhvZCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNYWtlIGEgUFVUIHJlcXVlc3QuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHVybFxyXG4gICAqIEBwYXJhbSAge09iamVjdH0gcXVlcmllc1xyXG4gICAqXHJcbiAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICovXHJcbiAgcHV0KHVybCwgcXVlcmllcykge1xyXG4gICAgcmV0dXJuIHRoaXMucG9zdCh1cmwsIHF1ZXJpZXMsICdQVVQnKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE1ha2UgYSBQQVRDSCByZXF1ZXN0LlxyXG4gICAqXHJcbiAgICogQHBhcmFtICB7c3RyaW5nfSB1cmxcclxuICAgKiBAcGFyYW0gIHtPYmplY3R9IHF1ZXJpZXNcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAqL1xyXG4gIHBhdGNoKHVybCwgcXVlcmllcykge1xyXG4gICAgcmV0dXJuIHRoaXMucG9zdCh1cmwsIHF1ZXJpZXMsICdQQVRDSCcpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTWFrZSBhIERFTEVURSByZXF1ZXN0LlxyXG4gICAqXHJcbiAgICogQHBhcmFtICB7c3RyaW5nfSB1cmxcclxuICAgKiBAcGFyYW0gIHtPYmplY3R9IHF1ZXJpZXNcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAqL1xyXG4gIGRlbGV0ZSh1cmwsIHF1ZXJpZXMpIHtcclxuICAgIHJldHVybiB0aGlzLnBvc3QodXJsLCBxdWVyaWVzLCAnREVMRVRFJyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBAc2VlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS81MzczOTc5MlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iXHJcbiAgICogQHJldHVybnMge09iamVjdH1cclxuICAgKi9cclxuICBzdGF0aWMgZmxhdHRlbk9iamVjdChvYikge1xyXG4gICAgY29uc3QgdG9SZXR1cm4gPSB7fTtcclxuXHJcbiAgICBmb3IgKGxldCBpIGluIG9iKSB7XHJcbiAgICAgIGlmICghb2IuaGFzT3duUHJvcGVydHkoaSkpIHtcclxuICAgICAgICBjb250aW51ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCh0eXBlb2Ygb2JbaV0pID09PSAnb2JqZWN0JyAmJiBvYltpXSAhPSBudWxsKSB7XHJcbiAgICAgICAgY29uc3QgZmxhdE9iamVjdCA9IHRoaXMuZmxhdHRlbk9iamVjdChvYltpXSk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IHggaW4gZmxhdE9iamVjdCkge1xyXG4gICAgICAgICAgaWYgKCFmbGF0T2JqZWN0Lmhhc093blByb3BlcnR5KHgpKSB7XHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHRvUmV0dXJuW2kgKyAnLycgKyB4XSA9IGZsYXRPYmplY3RbeF07XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRvUmV0dXJuW2ldID0gb2JbaV07XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0b1JldHVybjtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBidWlsZEZpZWxkTmFtZShmaWVsZCkge1xyXG4gICAgY29uc3QgbmFtZXMgPSBmaWVsZC5zcGxpdCgnLycpO1xyXG5cclxuICAgIGNvbnN0IGZpcnN0ID0gbmFtZXMuc2hpZnQoKTtcclxuXHJcbiAgICByZXR1cm4gZmlyc3QgKyBuYW1lcy5tYXAobmFtZSA9PiBgWyR7bmFtZX1dYCkuam9pbignJyk7XHJcbiAgfVxyXG59XHJcbiIsIi8qKlxyXG4gKiBQYXJ0IG9mIHN0YXJ0ZXIgcHJvamVjdC5cclxuICpcclxuICogQGNvcHlyaWdodCAgQ29weXJpZ2h0IChDKSAyMDIxIF9fT1JHQU5JWkFUSU9OX18uXHJcbiAqIEBsaWNlbnNlICAgIF9fTElDRU5TRV9fXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgZGVmYXVsdHNEZWVwIH0gZnJvbSAnbG9kYXNoLWVzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFVuaWNvcm5UaW55bWNlIHtcclxuICBpbnN0YW5jZXMgPSB7fTtcclxuXHJcbiAgc3RhdGljIGluc3RhbGwoYXBwKSB7XHJcbiAgICBhcHAuJHVpLnRpbnltY2UgPSBuZXcgdGhpcyhhcHAuJHVpKTtcclxuICB9XHJcblxyXG4gIGNvbnN0cnVjdG9yKHVpKSB7XHJcbiAgICB0aGlzLnVpID0gdWk7XHJcbiAgICB0aGlzLmFwcCA9IHVpLmFwcDtcclxuICB9XHJcblxyXG4gIGxvYWRUaW55bWNlKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuYXBwLmltcG9ydCgnQHRpbnltY2UnKTtcclxuICB9XHJcblxyXG4gIGluaXQoc2VsZWN0b3IsIG9wdGlvbnMgPSB7fSkge1xyXG4gICAgcmV0dXJuIHRoaXMubG9hZFRpbnltY2UoKS50aGVuKCgpID0+IHtcclxuICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2VzW3NlbGVjdG9yXSA9IG5ldyBUaW55bWNlRWRpdG9yKHNlbGVjdG9yLCBvcHRpb25zLCB0aGlzLmFwcCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldChzZWxlY3Rvcikge1xyXG4gICAgcmV0dXJuIHRoaXMuaW5zdGFuY2VzW3NlbGVjdG9yXTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUaW55bWNlRWRpdG9yIHtcclxuICBzdGF0aWMgZGVmYXVsdE9wdGlvbnMgPSB7XHJcblxyXG4gIH07XHJcblxyXG4gIGNvbnN0cnVjdG9yKHNlbGVjdG9yLCBvcHRpb25zLCBhcHApIHtcclxuICAgIHRoaXMuYXBwID0gYXBwO1xyXG4gICAgb3B0aW9ucy5zZWxlY3RvciA9IHNlbGVjdG9yO1xyXG5cclxuICAgIHRoaXMuc2VsZWN0b3IgPSBzZWxlY3RvcjtcclxuICAgIHRoaXMuZWxlbWVudCA9IGFwcC5zZWxlY3RPbmUoc2VsZWN0b3IpO1xyXG4gICAgdGhpcy5vcHRpb25zID0gZGVmYXVsdHNEZWVwKHt9LCB0aGlzLnByZXBhcmVPcHRpb25zKG9wdGlvbnMpKTtcclxuXHJcbiAgICB0aW55bWNlLmluaXQodGhpcy5vcHRpb25zKS50aGVuKChlZGl0b3IpID0+IHtcclxuICAgICAgdGhpcy5lZGl0b3IgPSBlZGl0b3JbMF07XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldEVkaXRvcigpIHtcclxuICAgIHJldHVybiB0aGlzLmVkaXRvcjtcclxuICB9XHJcblxyXG4gIHByZXBhcmVPcHRpb25zKG9wdGlvbnMpIHtcclxuICAgIGNvbnN0IGRlZmF1bHRzID0ge307XHJcblxyXG4gICAgaWYgKG9wdGlvbnMuaW1hZ2VzX3VwbG9hZF91cmwpIHtcclxuICAgICAgZGVmYXVsdHMucGFzdGVfZGF0YV9pbWFnZXMgPSB0cnVlO1xyXG4gICAgICBkZWZhdWx0cy5yZW1vdmVfc2NyaXB0X2hvc3QgPSBmYWxzZTtcclxuICAgICAgZGVmYXVsdHMucmVsYXRpdmVfdXJscyA9IGZhbHNlO1xyXG5cclxuICAgICAgZGVmYXVsdHMuaW1hZ2VzX3VwbG9hZF9oYW5kbGVyID0gKC4uLmFyZ3MpID0+IHRoaXMuaW1hZ2VVcGxvYWRIYW5kbGVyKC4uLmFyZ3MpO1xyXG4gICAgfVxyXG5cclxuICAgIGRlZmF1bHRzLnNldHVwID0gKGVkaXRvcikgPT4ge1xyXG4gICAgICBlZGl0b3Iub24oJ2NoYW5nZScsICgpID0+IHtcclxuICAgICAgICB0aW55bWNlLnRyaWdnZXJTYXZlKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gZGVmYXVsdHNEZWVwKHt9LCBvcHRpb25zLCBkZWZhdWx0cyk7XHJcbiAgfVxyXG5cclxuICBpbnNlcnQodGV4dCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZWRpdG9yLmluc2VydENvbnRlbnQodGV4dCk7XHJcbiAgfVxyXG5cclxuICBnZXRWYWx1ZSgpIHtcclxuICAgIHJldHVybiB0aGlzLmVkaXRvci5nZXRDb250ZW50KCk7XHJcbiAgfVxyXG5cclxuICBzZXRWYWx1ZSh0ZXh0KSB7XHJcbiAgICByZXR1cm4gdGhpcy5lZGl0b3Iuc2V0Q29udGVudCh0ZXh0KTtcclxuICB9XHJcblxyXG4gIGltYWdlVXBsb2FkSGFuZGxlcihibG9iSW5mbywgc3VjY2VzcywgZmFpbHVyZSkge1xyXG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZWxlbWVudDtcclxuXHJcbiAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCd1cGxvYWQtc3RhcnQnKSk7XHJcblxyXG4gICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gZmFsc2U7XHJcbiAgICB4aHIub3BlbignUE9TVCcsIHRoaXMub3B0aW9ucy5pbWFnZXNfdXBsb2FkX3VybCk7XHJcbiAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgndXBsb2FkLWNvbXBsZXRlJykpO1xyXG5cclxuICAgICAgaWYgKHhoci5zdGF0dXMgIT09IDIwMCAmJiB4aHIuc3RhdHVzICE9PSAyMDQpIHtcclxuICAgICAgICBmYWlsdXJlKCdIVFRQIEVycm9yOiAnICsgZGVjb2RlVVJJQ29tcG9uZW50KHhoci5zdGF0dXNUZXh0KSk7XHJcbiAgICAgICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgndXBsb2FkLWVycm9yJykpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QganNvbiA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XHJcblxyXG4gICAgICBpZiAoIWpzb24gfHwgdHlwZW9mIGpzb24uZGF0YS51cmwgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgZmFpbHVyZSgnSW52YWxpZCBKU09OOiAnICsgeGhyLnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcignSW52YWxpZCBKU09OOiAnICsgeGhyLnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgndXBsb2FkLWVycm9yJykpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgc3VjY2Vzcyhqc29uLmRhdGEudXJsKTtcclxuXHJcbiAgICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3VwbG9hZC1zdWNjZXNzJykpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcclxuICAgIGZvcm1EYXRhLmFwcGVuZCgnZmlsZScsIGJsb2JJbmZvLmJsb2IoKSwgYmxvYkluZm8uZmlsZW5hbWUoKSk7XHJcblxyXG4gICAgeGhyLnNlbmQoZm9ybURhdGEpO1xyXG4gIH1cclxufVxyXG4iLCIvKipcbiAqIFBhcnQgb2Ygc3RhcnRlciBwcm9qZWN0LlxuICpcbiAqIEBjb3B5cmlnaHQgIENvcHlyaWdodCAoQykgMjAyMSBfX09SR0FOSVpBVElPTl9fLlxuICogQGxpY2Vuc2UgICAgX19MSUNFTlNFX19cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVbmljb3JuTG9hZGVyIHtcbiAgc3RhdGljIGluc3RhbGwoYXBwKSB7XG4gICAgYXBwLmltcG9ydCA9IHRoaXMuaW1wb3J0O1xuICB9XG5cbiAgc3RhdGljIGltcG9ydChzcmMpIHtcbiAgICBjb25zdCBzID0gd2luZG93LlN5c3RlbTtcblxuICAgIHJldHVybiBzLmltcG9ydChzcmMpO1xuICB9XG59XG4iLCIvKiBnbG9iYWwgd2luZG93LCBleHBvcnRzLCBkZWZpbmUgKi9cblxuIWZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0J1xuXG4gICAgdmFyIHJlID0ge1xuICAgICAgICBub3Rfc3RyaW5nOiAvW15zXS8sXG4gICAgICAgIG5vdF9ib29sOiAvW150XS8sXG4gICAgICAgIG5vdF90eXBlOiAvW15UXS8sXG4gICAgICAgIG5vdF9wcmltaXRpdmU6IC9bXnZdLyxcbiAgICAgICAgbnVtYmVyOiAvW2RpZWZnXS8sXG4gICAgICAgIG51bWVyaWNfYXJnOiAvW2JjZGllZmd1eFhdLyxcbiAgICAgICAganNvbjogL1tqXS8sXG4gICAgICAgIG5vdF9qc29uOiAvW15qXS8sXG4gICAgICAgIHRleHQ6IC9eW15cXHgyNV0rLyxcbiAgICAgICAgbW9kdWxvOiAvXlxceDI1ezJ9LyxcbiAgICAgICAgcGxhY2Vob2xkZXI6IC9eXFx4MjUoPzooWzEtOV1cXGQqKVxcJHxcXCgoW14pXSspXFwpKT8oXFwrKT8oMHwnW14kXSk/KC0pPyhcXGQrKT8oPzpcXC4oXFxkKykpPyhbYi1naWpvc3RUdXZ4WF0pLyxcbiAgICAgICAga2V5OiAvXihbYS16X11bYS16X1xcZF0qKS9pLFxuICAgICAgICBrZXlfYWNjZXNzOiAvXlxcLihbYS16X11bYS16X1xcZF0qKS9pLFxuICAgICAgICBpbmRleF9hY2Nlc3M6IC9eXFxbKFxcZCspXFxdLyxcbiAgICAgICAgc2lnbjogL15bKy1dL1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNwcmludGYoa2V5KSB7XG4gICAgICAgIC8vIGBhcmd1bWVudHNgIGlzIG5vdCBhbiBhcnJheSwgYnV0IHNob3VsZCBiZSBmaW5lIGZvciB0aGlzIGNhbGxcbiAgICAgICAgcmV0dXJuIHNwcmludGZfZm9ybWF0KHNwcmludGZfcGFyc2Uoa2V5KSwgYXJndW1lbnRzKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZzcHJpbnRmKGZtdCwgYXJndikge1xuICAgICAgICByZXR1cm4gc3ByaW50Zi5hcHBseShudWxsLCBbZm10XS5jb25jYXQoYXJndiB8fCBbXSkpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3ByaW50Zl9mb3JtYXQocGFyc2VfdHJlZSwgYXJndikge1xuICAgICAgICB2YXIgY3Vyc29yID0gMSwgdHJlZV9sZW5ndGggPSBwYXJzZV90cmVlLmxlbmd0aCwgYXJnLCBvdXRwdXQgPSAnJywgaSwgaywgcGgsIHBhZCwgcGFkX2NoYXJhY3RlciwgcGFkX2xlbmd0aCwgaXNfcG9zaXRpdmUsIHNpZ25cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRyZWVfbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcGFyc2VfdHJlZVtpXSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gcGFyc2VfdHJlZVtpXVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIHBhcnNlX3RyZWVbaV0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgcGggPSBwYXJzZV90cmVlW2ldIC8vIGNvbnZlbmllbmNlIHB1cnBvc2VzIG9ubHlcbiAgICAgICAgICAgICAgICBpZiAocGgua2V5cykgeyAvLyBrZXl3b3JkIGFyZ3VtZW50XG4gICAgICAgICAgICAgICAgICAgIGFyZyA9IGFyZ3ZbY3Vyc29yXVxuICAgICAgICAgICAgICAgICAgICBmb3IgKGsgPSAwOyBrIDwgcGgua2V5cy5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFyZyA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3Ioc3ByaW50ZignW3NwcmludGZdIENhbm5vdCBhY2Nlc3MgcHJvcGVydHkgXCIlc1wiIG9mIHVuZGVmaW5lZCB2YWx1ZSBcIiVzXCInLCBwaC5rZXlzW2tdLCBwaC5rZXlzW2stMV0pKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJnW3BoLmtleXNba11dXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocGgucGFyYW1fbm8pIHsgLy8gcG9zaXRpb25hbCBhcmd1bWVudCAoZXhwbGljaXQpXG4gICAgICAgICAgICAgICAgICAgIGFyZyA9IGFyZ3ZbcGgucGFyYW1fbm9dXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgeyAvLyBwb3NpdGlvbmFsIGFyZ3VtZW50IChpbXBsaWNpdClcbiAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJndltjdXJzb3IrK11cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocmUubm90X3R5cGUudGVzdChwaC50eXBlKSAmJiByZS5ub3RfcHJpbWl0aXZlLnRlc3QocGgudHlwZSkgJiYgYXJnIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJnKClcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocmUubnVtZXJpY19hcmcudGVzdChwaC50eXBlKSAmJiAodHlwZW9mIGFyZyAhPT0gJ251bWJlcicgJiYgaXNOYU4oYXJnKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihzcHJpbnRmKCdbc3ByaW50Zl0gZXhwZWN0aW5nIG51bWJlciBidXQgZm91bmQgJVQnLCBhcmcpKVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChyZS5udW1iZXIudGVzdChwaC50eXBlKSkge1xuICAgICAgICAgICAgICAgICAgICBpc19wb3NpdGl2ZSA9IGFyZyA+PSAwXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc3dpdGNoIChwaC50eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2InOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gcGFyc2VJbnQoYXJnLCAxMCkudG9TdHJpbmcoMilcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2MnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gU3RyaW5nLmZyb21DaGFyQ29kZShwYXJzZUludChhcmcsIDEwKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2QnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlICdpJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IHBhcnNlSW50KGFyZywgMTApXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdqJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IEpTT04uc3RyaW5naWZ5KGFyZywgbnVsbCwgcGgud2lkdGggPyBwYXJzZUludChwaC53aWR0aCkgOiAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnZSc6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBwaC5wcmVjaXNpb24gPyBwYXJzZUZsb2F0KGFyZykudG9FeHBvbmVudGlhbChwaC5wcmVjaXNpb24pIDogcGFyc2VGbG9hdChhcmcpLnRvRXhwb25lbnRpYWwoKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnZic6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBwaC5wcmVjaXNpb24gPyBwYXJzZUZsb2F0KGFyZykudG9GaXhlZChwaC5wcmVjaXNpb24pIDogcGFyc2VGbG9hdChhcmcpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdnJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IHBoLnByZWNpc2lvbiA/IFN0cmluZyhOdW1iZXIoYXJnLnRvUHJlY2lzaW9uKHBoLnByZWNpc2lvbikpKSA6IHBhcnNlRmxvYXQoYXJnKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnbyc6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSAocGFyc2VJbnQoYXJnLCAxMCkgPj4+IDApLnRvU3RyaW5nKDgpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdzJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IFN0cmluZyhhcmcpXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSAocGgucHJlY2lzaW9uID8gYXJnLnN1YnN0cmluZygwLCBwaC5wcmVjaXNpb24pIDogYXJnKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAndCc6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBTdHJpbmcoISFhcmcpXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSAocGgucHJlY2lzaW9uID8gYXJnLnN1YnN0cmluZygwLCBwaC5wcmVjaXNpb24pIDogYXJnKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnVCc6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJnKS5zbGljZSg4LCAtMSkudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gKHBoLnByZWNpc2lvbiA/IGFyZy5zdWJzdHJpbmcoMCwgcGgucHJlY2lzaW9uKSA6IGFyZylcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3UnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gcGFyc2VJbnQoYXJnLCAxMCkgPj4+IDBcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3YnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJnLnZhbHVlT2YoKVxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gKHBoLnByZWNpc2lvbiA/IGFyZy5zdWJzdHJpbmcoMCwgcGgucHJlY2lzaW9uKSA6IGFyZylcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3gnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gKHBhcnNlSW50KGFyZywgMTApID4+PiAwKS50b1N0cmluZygxNilcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ1gnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gKHBhcnNlSW50KGFyZywgMTApID4+PiAwKS50b1N0cmluZygxNikudG9VcHBlckNhc2UoKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJlLmpzb24udGVzdChwaC50eXBlKSkge1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXQgKz0gYXJnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmUubnVtYmVyLnRlc3QocGgudHlwZSkgJiYgKCFpc19wb3NpdGl2ZSB8fCBwaC5zaWduKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2lnbiA9IGlzX3Bvc2l0aXZlID8gJysnIDogJy0nXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBhcmcudG9TdHJpbmcoKS5yZXBsYWNlKHJlLnNpZ24sICcnKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2lnbiA9ICcnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcGFkX2NoYXJhY3RlciA9IHBoLnBhZF9jaGFyID8gcGgucGFkX2NoYXIgPT09ICcwJyA/ICcwJyA6IHBoLnBhZF9jaGFyLmNoYXJBdCgxKSA6ICcgJ1xuICAgICAgICAgICAgICAgICAgICBwYWRfbGVuZ3RoID0gcGgud2lkdGggLSAoc2lnbiArIGFyZykubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgIHBhZCA9IHBoLndpZHRoID8gKHBhZF9sZW5ndGggPiAwID8gcGFkX2NoYXJhY3Rlci5yZXBlYXQocGFkX2xlbmd0aCkgOiAnJykgOiAnJ1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXQgKz0gcGguYWxpZ24gPyBzaWduICsgYXJnICsgcGFkIDogKHBhZF9jaGFyYWN0ZXIgPT09ICcwJyA/IHNpZ24gKyBwYWQgKyBhcmcgOiBwYWQgKyBzaWduICsgYXJnKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0cHV0XG4gICAgfVxuXG4gICAgdmFyIHNwcmludGZfY2FjaGUgPSBPYmplY3QuY3JlYXRlKG51bGwpXG5cbiAgICBmdW5jdGlvbiBzcHJpbnRmX3BhcnNlKGZtdCkge1xuICAgICAgICBpZiAoc3ByaW50Zl9jYWNoZVtmbXRdKSB7XG4gICAgICAgICAgICByZXR1cm4gc3ByaW50Zl9jYWNoZVtmbXRdXG4gICAgICAgIH1cblxuICAgICAgICB2YXIgX2ZtdCA9IGZtdCwgbWF0Y2gsIHBhcnNlX3RyZWUgPSBbXSwgYXJnX25hbWVzID0gMFxuICAgICAgICB3aGlsZSAoX2ZtdCkge1xuICAgICAgICAgICAgaWYgKChtYXRjaCA9IHJlLnRleHQuZXhlYyhfZm10KSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBwYXJzZV90cmVlLnB1c2gobWF0Y2hbMF0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICgobWF0Y2ggPSByZS5tb2R1bG8uZXhlYyhfZm10KSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBwYXJzZV90cmVlLnB1c2goJyUnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoKG1hdGNoID0gcmUucGxhY2Vob2xkZXIuZXhlYyhfZm10KSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2hbMl0pIHtcbiAgICAgICAgICAgICAgICAgICAgYXJnX25hbWVzIHw9IDFcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZpZWxkX2xpc3QgPSBbXSwgcmVwbGFjZW1lbnRfZmllbGQgPSBtYXRjaFsyXSwgZmllbGRfbWF0Y2ggPSBbXVxuICAgICAgICAgICAgICAgICAgICBpZiAoKGZpZWxkX21hdGNoID0gcmUua2V5LmV4ZWMocmVwbGFjZW1lbnRfZmllbGQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRfbGlzdC5wdXNoKGZpZWxkX21hdGNoWzFdKVxuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKChyZXBsYWNlbWVudF9maWVsZCA9IHJlcGxhY2VtZW50X2ZpZWxkLnN1YnN0cmluZyhmaWVsZF9tYXRjaFswXS5sZW5ndGgpKSAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGZpZWxkX21hdGNoID0gcmUua2V5X2FjY2Vzcy5leGVjKHJlcGxhY2VtZW50X2ZpZWxkKSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRfbGlzdC5wdXNoKGZpZWxkX21hdGNoWzFdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICgoZmllbGRfbWF0Y2ggPSByZS5pbmRleF9hY2Nlc3MuZXhlYyhyZXBsYWNlbWVudF9maWVsZCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkX2xpc3QucHVzaChmaWVsZF9tYXRjaFsxXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcignW3NwcmludGZdIGZhaWxlZCB0byBwYXJzZSBuYW1lZCBhcmd1bWVudCBrZXknKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcignW3NwcmludGZdIGZhaWxlZCB0byBwYXJzZSBuYW1lZCBhcmd1bWVudCBrZXknKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG1hdGNoWzJdID0gZmllbGRfbGlzdFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYXJnX25hbWVzIHw9IDJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGFyZ19uYW1lcyA9PT0gMykge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1tzcHJpbnRmXSBtaXhpbmcgcG9zaXRpb25hbCBhbmQgbmFtZWQgcGxhY2Vob2xkZXJzIGlzIG5vdCAoeWV0KSBzdXBwb3J0ZWQnKVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHBhcnNlX3RyZWUucHVzaChcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI6IG1hdGNoWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1fbm86ICAgIG1hdGNoWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAga2V5czogICAgICAgIG1hdGNoWzJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2lnbjogICAgICAgIG1hdGNoWzNdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFkX2NoYXI6ICAgIG1hdGNoWzRdLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWxpZ246ICAgICAgIG1hdGNoWzVdLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICAgICAgIG1hdGNoWzZdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJlY2lzaW9uOiAgIG1hdGNoWzddLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogICAgICAgIG1hdGNoWzhdXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoJ1tzcHJpbnRmXSB1bmV4cGVjdGVkIHBsYWNlaG9sZGVyJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF9mbXQgPSBfZm10LnN1YnN0cmluZyhtYXRjaFswXS5sZW5ndGgpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNwcmludGZfY2FjaGVbZm10XSA9IHBhcnNlX3RyZWVcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBleHBvcnQgdG8gZWl0aGVyIGJyb3dzZXIgb3Igbm9kZS5qc1xuICAgICAqL1xuICAgIC8qIGVzbGludC1kaXNhYmxlIHF1b3RlLXByb3BzICovXG4gICAgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBleHBvcnRzWydzcHJpbnRmJ10gPSBzcHJpbnRmXG4gICAgICAgIGV4cG9ydHNbJ3ZzcHJpbnRmJ10gPSB2c3ByaW50ZlxuICAgIH1cbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgd2luZG93WydzcHJpbnRmJ10gPSBzcHJpbnRmXG4gICAgICAgIHdpbmRvd1sndnNwcmludGYnXSA9IHZzcHJpbnRmXG5cbiAgICAgICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lWydhbWQnXSkge1xuICAgICAgICAgICAgZGVmaW5lKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICdzcHJpbnRmJzogc3ByaW50ZixcbiAgICAgICAgICAgICAgICAgICAgJ3ZzcHJpbnRmJzogdnNwcmludGZcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qIGVzbGludC1lbmFibGUgcXVvdGUtcHJvcHMgKi9cbn0oKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuIiwiLyoqXG4gKiBQYXJ0IG9mIHVuaWNvcm4gcHJvamVjdC5cbiAqXG4gKiBAY29weXJpZ2h0ICBDb3B5cmlnaHQgKEMpIDIwMTggJHtPUkdBTklaQVRJT059LlxuICogQGxpY2Vuc2UgICAgX19MSUNFTlNFX19cbiAqL1xuXG5pbXBvcnQgeyBwcmVwYXJlRGF0YSB9IGZyb20gJy4vdXRpbGl0aWVzLmpzJztcbmltcG9ydCAnc3ByaW50Zi1qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFVuaWNvcm5IZWxwZXIge1xuICBzdGF0aWMgZ2V0IGlzKCkgeyByZXR1cm4gJ2hlbHBlcic7IH1cblxuICBzdGF0aWMgaW5zdGFsbChhcHAsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGhlbHBlciA9IGFwcC4kaGVscGVyID0gbmV3IHRoaXMoYXBwKTtcblxuICAgIGFwcC5zZWxlY3RPbmUgPSBoZWxwZXIuc2VsZWN0T25lLmJpbmQoaGVscGVyKTtcbiAgICBhcHAuc2VsZWN0QWxsID0gaGVscGVyLnNlbGVjdEFsbDtcbiAgICBhcHAuaCA9IGhlbHBlci5oO1xuICAgIGFwcC4kZ2V0ID0gaGVscGVyLiRnZXQ7XG4gICAgYXBwLiRzZXQgPSBoZWxwZXIuJHNldDtcbiAgICBhcHAuaXNEZWJ1ZyA9IGhlbHBlci5pc0RlYnVnLmJpbmQoaGVscGVyKTtcbiAgICBhcHAuY29uZmlybSA9IGhlbHBlci5jb25maXJtLmJpbmQoaGVscGVyKTtcbiAgICBhcHAua2VlcEFsaXZlID0gaGVscGVyLmtlZXBBbGl2ZS5iaW5kKGhlbHBlcik7XG4gICAgYXBwLnN0b3BLZWVwQWxpdmUgPSBoZWxwZXIuc3RvcEtlZXBBbGl2ZTtcbiAgICBhcHAuaXNOdWxsRGF0ZSA9IGhlbHBlci5pc051bGxEYXRlLmJpbmQoaGVscGVyKTtcbiAgICBhcHAuZ2V0TnVsbERhdGUgPSBoZWxwZXIuZ2V0TnVsbERhdGUuYmluZChoZWxwZXIpO1xuICAgIGFwcC5udW1iZXJGb3JtYXQgPSBoZWxwZXIubnVtYmVyRm9ybWF0O1xuICAgIGFwcC5zcHJpbnRmID0gc3ByaW50ZjtcbiAgICBhcHAudnNwcmludGYgPSB2c3ByaW50ZjtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGFwcCkge1xuICAgIHRoaXMuYXBwID0gYXBwO1xuICAgIHRoaXMuYWxpdmVIYW5kbGUgPSBudWxsO1xuICB9XG5cbiAgc2VsZWN0T25lKGVsZSkge1xuICAgaWYgKHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnKSB7XG4gICAgIGVsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWxlKTtcbiAgIH1cblxuICAgcmV0dXJuIHByZXBhcmVEYXRhKGVsZSk7XG4gIH1cblxuICBzZWxlY3RBbGwoZWxlLCBjYWxsYmFjaykge1xuICAgIGlmICh0eXBlb2YgZWxlID09PSAnc3RyaW5nJykge1xuICAgICAgZWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChlbGUpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdFNldCA9IFtdLnNsaWNlLmNhbGwoZWxlKTtcblxuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgcmV0dXJuIHJlc3VsdFNldC5tYXAoY2FsbGJhY2spO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHRTZXQ7XG4gIH1cblxuICBoKGVsZW1lbnQsIGF0dHJzID0ge30sIGNvbnRlbnQgPSBudWxsKSB7XG4gICAgY29uc3QgZWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChlbGVtZW50KTtcblxuICAgIGZvciAobGV0IGkgaW4gYXR0cnMpIHtcbiAgICAgIGNvbnN0IHYgPSBhdHRyc1tpXTtcblxuICAgICAgZWxlLnNldEF0dHJpYnV0ZShpLCB2KTtcbiAgICB9XG5cbiAgICBpZiAoY29udGVudCAhPT0gbnVsbCkge1xuICAgICAgZWxlLmlubmVySFRNTCA9IGNvbnRlbnQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVsZTtcbiAgfVxuXG4gIGdldChvYmosIHBhdGgpIHtcbiAgICBjb25zdCBrZXlzID0gQXJyYXkuaXNBcnJheShwYXRoKSA/IHBhdGggOiBwYXRoLnNwbGl0KCcuJyk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGtleSA9IGtleXNbaV07XG5cbiAgICAgIGlmICghb2JqIHx8ICFvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBvYmogPSB1bmRlZmluZWQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBvYmogPSBvYmpba2V5XTtcbiAgICB9XG5cbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAgc2V0KG9iaiwgcGF0aCwgdmFsdWUpIHtcbiAgICBjb25zdCBrZXlzID0gQXJyYXkuaXNBcnJheShwYXRoKSA/IHBhdGggOiBwYXRoLnNwbGl0KCcuJyk7XG4gICAgbGV0IGk7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwga2V5cy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgIGNvbnN0IGtleSA9IGtleXNbaV07XG5cbiAgICAgIGlmICghb2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgb2JqW2tleV0gPSB7fTtcbiAgICAgIH1cblxuICAgICAgb2JqID0gb2JqW2tleV07XG4gICAgfVxuXG4gICAgb2JqW2tleXNbaV1dID0gdmFsdWU7XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBpc0RlYnVnKCkge1xuICAgIHJldHVybiBCb29sZWFuKHRoaXMuYXBwLmRhdGEoJ3dpbmR3YWxrZXIuZGVidWcnKSk7XG4gIH1cblxuICAvKipcbiAgICogQ29uZmlybSBwb3B1cC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9ICAgbWVzc2FnZVxuICAgKlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKi9cbiAgY29uZmlybShtZXNzYWdlKSB7XG4gICAgbWVzc2FnZSA9IG1lc3NhZ2UgfHwgJ0FyZSB5b3Ugc3VyZT8nO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICByZXNvbHZlKGNvbmZpcm0obWVzc2FnZSkpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gbG9hZFNjcmlwdCh1cmxzLCBhdXRvQ29udmVydCA9IHRydWUpIHtcbiAgLy8gICBpZiAodHlwZW9mIHVybHMgPT09ICdzdHJpbmcnKSB7XG4gIC8vICAgICB1cmxzID0gW3VybHNdO1xuICAvLyAgIH1cbiAgLy9cbiAgLy8gICBjb25zdCBwcm9taXNlcyA9IFtdO1xuICAvLyAgIGNvbnN0IGRhdGEgPSB7fTtcbiAgLy8gICBjb25zdCBlbmRzV2l0aCA9IChzdHIsIHN1ZmZpeCkgPT4gc3RyLmluZGV4T2Yoc3VmZml4LCBzdHIubGVuZ3RoIC0gc3VmZml4Lmxlbmd0aCkgPj0gMDtcbiAgLy8gICBkYXRhW3RoaXMuYXBwLmFzc2V0KCd2ZXJzaW9uJyldID0gJzEnO1xuICAvL1xuICAvLyAgIHVybHMuZm9yRWFjaCh1cmwgPT4ge1xuICAvLyAgICAgY29uc3QgZXh0ID0gdXJsLnNwbGl0KCcuJykucG9wKCk7XG4gIC8vICAgICBsZXQgbG9hZFVyaSA9IHVybDtcbiAgLy9cbiAgLy8gICAgIGlmIChhdXRvQ29udmVydCkge1xuICAvLyAgICAgICBsZXQgYXNzZXRGaWxlLCBhc3NldE1pbkZpbGU7XG4gIC8vXG4gIC8vICAgICAgIGlmIChlbmRzV2l0aCh1cmwsICcubWluLicgKyBleHQpKSB7XG4gIC8vICAgICAgICAgYXNzZXRNaW5GaWxlID0gdXJsO1xuICAvLyAgICAgICAgIGFzc2V0RmlsZSA9IHVybC5zbGljZSgwLCAtYC5taW4uJHtleHR9YC5sZW5ndGgpICsgJy4nICsgZXh0O1xuICAvLyAgICAgICB9IGVsc2Uge1xuICAvLyAgICAgICAgIGFzc2V0RmlsZSA9IHVybDtcbiAgLy8gICAgICAgICBhc3NldE1pbkZpbGUgPSB1cmwuc2xpY2UoMCwgLWAuJHtleHR9YC5sZW5ndGgpICsgJy5taW4uJyArIGV4dDtcbiAgLy8gICAgICAgfVxuICAvL1xuICAvLyAgICAgICBsb2FkVXJpID0gdGhpcy5hcHAuZGF0YSgnd2luZHdhbGtlci5kZWJ1ZycpID8gYXNzZXRGaWxlIDogYXNzZXRNaW5GaWxlO1xuICAvLyAgICAgfVxuICAvL1xuICAvLyAgICAgcHJvbWlzZXMucHVzaChcbiAgLy8gICAgICAgJC5nZXRTY3JpcHQoe1xuICAvLyAgICAgICAgIHVybDogdGhpcy5hZGRVcmlCYXNlKGxvYWRVcmkpLFxuICAvLyAgICAgICAgIGNhY2hlOiB0cnVlLFxuICAvLyAgICAgICAgIGRhdGFcbiAgLy8gICAgICAgfSlcbiAgLy8gICAgICk7XG4gIC8vICAgfSk7XG4gIC8vXG4gIC8vICAgcmV0dXJuICQud2hlbiguLi5wcm9taXNlcyk7XG4gIC8vIH1cblxuICBhZGRVcmlCYXNlKHVyaSwgdHlwZSA9ICdwYXRoJykge1xuICAgIGlmICh1cmkuc3Vic3RyKDAsIDIpID09PSAnL1xcLycgfHwgdXJpLnN1YnN0cigwLCA0KSA9PT0gJ2h0dHAnKSB7XG4gICAgICByZXR1cm4gdXJpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmFwcC5hc3NldCh0eXBlKSArICcvJyArIHVyaTtcbiAgfVxuXG4gIC8qKlxuICAgKiBOb3RpZnkgaW5mb3JtYXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfEFycmF5fSBtZXNzYWdlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICB0eXBlXG4gICAqIEByZXR1cm5zIHsqfVxuICAgKi9cbiAgLy8gbm90aWZ5KG1lc3NhZ2UsIHR5cGUgPSAnaW5mbycpIHtcbiAgLy8gICByZXR1cm4gdGhpcy5hcHAuYWRkTWVzc2FnZShtZXNzYWdlLCB0eXBlKTtcbiAgLy8gfVxuXG4gIC8qKlxuICAgKiBLZWVwIGFsaXZlLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn1cbiAgICovXG4gIGtlZXBBbGl2ZSh1cmwsIHRpbWUgPSA2MDAwMCkge1xuICAgIHJldHVybiB0aGlzLmFsaXZlSGFuZGxlID0gd2luZG93LnNldEludGVydmFsKCgpID0+IGZldGNoKHVybCksIHRpbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0b3Aga2VlcCBhbGl2ZVxuICAgKi9cbiAgc3RvcEtlZXBBbGl2ZSgpIHtcbiAgICBjbGVhckludGVydmFsKHRoaXMuYWxpdmVIYW5kbGUpO1xuXG4gICAgdGhpcy5hbGl2ZUhhbmRsZSA9ICBudWxsO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogSXMgTlVMTCBkYXRlIGZyb20gZGVmYXVsdCBTUUwuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBkYXRlXG4gICAqL1xuICBpc051bGxEYXRlKGRhdGUpIHtcbiAgICByZXR1cm4gWycwMDAwLTAwLTAwIDAwOjAwOjAwJywgdGhpcy5nZXROdWxsRGF0ZSgpXS5pbmRleE9mKGRhdGUpICE9PSAtMTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgTlVMTCBkYXRlIGZyb20gZGVmYXVsdCBTUUwuXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICBnZXROdWxsRGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5hcHAuZGF0YSgndW5pY29ybi5kYXRlJylbJ2VtcHR5J107XG4gIH1cblxuICAvKipcbiAgICogTnVtYmVyIGZvcm1hdCBsaWtlIHBocCBmdW5jdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd8bnVtYmVyfSBudW1iZXJcbiAgICogQHBhcmFtIHtudW1iZXJ9ICAgICAgICBkZWNpbWFsc1xuICAgKiBAcGFyYW0ge3N0cmluZ30gICAgICAgIGRlY1BvaW50XG4gICAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgdGhvdXNhbmRzU2VwXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICBudW1iZXJGb3JtYXQobnVtYmVyLCBkZWNpbWFscyA9IDAsIGRlY1BvaW50ID0gJy4nLCB0aG91c2FuZHNTZXAgPSAnLCcpIHtcbiAgICBkZWNpbWFscyA9IGRlY2ltYWxzIHx8IDA7XG4gICAgbnVtYmVyID0gcGFyc2VGbG9hdChudW1iZXIpO1xuXG4gICAgbGV0IHJvdW5kZWROdW1iZXIgPSBNYXRoLnJvdW5kKE1hdGguYWJzKG51bWJlcikgKiAoJzFlJyArIGRlY2ltYWxzKSkgKyAnJztcbiAgICBsZXQgbnVtYmVyc1N0cmluZyA9IGRlY2ltYWxzID8gcm91bmRlZE51bWJlci5zbGljZSgwLCBkZWNpbWFscyAqIC0xKSA6IHJvdW5kZWROdW1iZXI7XG4gICAgbGV0IGRlY2ltYWxzU3RyaW5nID0gZGVjaW1hbHMgPyByb3VuZGVkTnVtYmVyLnNsaWNlKGRlY2ltYWxzICogLTEpIDogJyc7XG4gICAgbGV0IGZvcm1hdHRlZE51bWJlciA9IFwiXCI7XG5cbiAgICB3aGlsZSAobnVtYmVyc1N0cmluZy5sZW5ndGggPiAzKSB7XG4gICAgICBmb3JtYXR0ZWROdW1iZXIgKz0gdGhvdXNhbmRzU2VwICsgbnVtYmVyc1N0cmluZy5zbGljZSgtMyk7XG4gICAgICBudW1iZXJzU3RyaW5nID0gbnVtYmVyc1N0cmluZy5zbGljZSgwLCAtMyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChudW1iZXIgPCAwID8gJy0nIDogJycpICsgbnVtYmVyc1N0cmluZyArIGZvcm1hdHRlZE51bWJlciArIChkZWNpbWFsc1N0cmluZyA/IChkZWNQb2ludCArIGRlY2ltYWxzU3RyaW5nKSA6ICcnKTtcbiAgfVxufVxuIiwiLyoqXG4gKiBQYXJ0IG9mIFVuaWNvcm4gcHJvamVjdC5cbiAqXG4gKiBAY29weXJpZ2h0ICBDb3B5cmlnaHQgKEMpIDIwMTYgTFlSQVNPRlQuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBAbGljZW5zZSAgICBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDIgb3IgbGF0ZXIuXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVW5pY29ybkh0dHAge1xuICBnbG9iYWxBeGlvcztcbiAgYXhpb3M7XG5cbiAgc3RhdGljIGdldCBpcygpIHsgcmV0dXJuICdodHRwJzsgfVxuXG4gIHN0YXRpYyBpbnN0YWxsKGFwcCwgb3B0aW9ucykge1xuICAgIGFwcC4kaHR0cCA9IG5ldyB0aGlzKGFwcCk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihhcHApIHtcbiAgICB0aGlzLmFwcCA9IGFwcDtcblxuICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgY3VzdG9tTWV0aG9kOiBmYWxzZSxcbiAgICB9O1xuXG4gICAgdGhpcy5kYXRhID0ge307XG4gIH1cblxuICBnZXQgZ2V0U2VsZigpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGNyZWF0ZUh0dHAoKSB7XG4gICAgaWYgKCF0aGlzLmdsb2JhbEF4aW9zKSB7XG4gICAgICB0aGlzLmdsb2JhbEF4aW9zID0gdGhpcy5hcHAuaW1wb3J0KCdAYXhpb3MnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5nbG9iYWxBeGlvcy50aGVuKChheGlvcykgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuYXhpb3MgPSBheGlvcy5jcmVhdGUodGhpcy5vcHRpb25zLmF4aW9zIHx8IHt9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldEh0dHAoKSB7XG4gICAgaWYgKHRoaXMuYXhpb3MpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5heGlvcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuY3JlYXRlSHR0cCgpLnRoZW4oKGF4aW9zKSA9PiB0aGlzLmF4aW9zID0gYXhpb3MpO1xuICB9XG5cbiAgcHJlcGFyZUF4aW9zKGF4aW9zKSB7XG4gICAgYXhpb3MuaW50ZXJjZXB0b3JzLnJlcXVlc3QudXNlKGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICAgIGNvbmZpZy5oZWFkZXJzWydYLUNTUkYtVG9rZW4nXSA9IHRoaXMuYXBwLmRhdGEoJ2NzcmYtdG9rZW4nKTtcblxuICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICB9KTtcbiAgfVxuXG4gIHJlcXVlc3RNaWRkbGV3YXJlKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0SHR0cCgpLnRoZW4oYXhpb3MgPT4gYXhpb3MuaW50ZXJjZXB0b3JzLnJlcXVlc3QudXNlKGNhbGxiYWNrKSk7XG4gIH1cblxuICByZXNwb25zZU1pZGRsZXdhcmUoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5nZXRIdHRwKCkudGhlbihheGlvcyA9PiBheGlvcy5pbnRlcmNlcHRvcnMucmVzcG9uc2UudXNlKGNhbGxiYWNrKSk7XG4gIH1cblxuICByZWFkeSgpIHtcbiAgICBzdXBlci5yZWFkeSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSBHRVQgcmVxdWVzdC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVybFxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKlxuICAgKiBAcmV0dXJucyB7QXhpb3NSZXNwb25zZX1cbiAgICovXG4gIGdldCh1cmwsIG9wdGlvbnMgPSB7fSkge1xuICAgIG9wdGlvbnMudXJsID0gdXJsO1xuICAgIG9wdGlvbnMubWV0aG9kID0gJ0dFVCc7XG5cbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSBQT1NUIHJlcXVlc3QuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cmxcbiAgICogQHBhcmFtIHtPYmplY3R8c3RyaW5nfSBkYXRhXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqXG4gICAqIEByZXR1cm5zIHtBeGlvc1Jlc3BvbnNlfVxuICAgKi9cbiAgcG9zdCh1cmwsIGRhdGEsIG9wdGlvbnMgPSB7fSkge1xuICAgIG9wdGlvbnMudXJsID0gdXJsO1xuICAgIG9wdGlvbnMubWV0aG9kID0gJ1BPU1QnO1xuICAgIG9wdGlvbnMuZGF0YSA9IGRhdGE7XG5cbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSBQVVQgcmVxdWVzdC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVybFxuICAgKiBAcGFyYW0ge09iamVjdHxzdHJpbmd9IGRhdGFcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICpcbiAgICogQHJldHVybnMge0F4aW9zUmVzcG9uc2V9XG4gICAqL1xuICBwdXQodXJsLCBkYXRhLCBvcHRpb25zID0ge30pIHtcbiAgICBvcHRpb25zLnVybCA9IHVybDtcbiAgICBvcHRpb25zLm1ldGhvZCA9ICdQVVQnO1xuICAgIG9wdGlvbnMuZGF0YSA9IGRhdGE7XG5cbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSBQQVRDSCByZXF1ZXN0LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsXG4gICAqIEBwYXJhbSB7T2JqZWN0fHN0cmluZ30gZGF0YVxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKlxuICAgKiBAcmV0dXJucyB7QXhpb3NSZXNwb25zZX1cbiAgICovXG4gIHBhdGNoKHVybCwgZGF0YSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgb3B0aW9ucy51cmwgPSB1cmw7XG4gICAgb3B0aW9ucy5tZXRob2QgPSAnUEFUQ0gnO1xuICAgIG9wdGlvbnMuZGF0YSA9IGRhdGE7XG5cbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSBERUxFVEUgcmVxdWVzdC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVybFxuICAgKiBAcGFyYW0ge09iamVjdHxzdHJpbmd9IGRhdGFcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICpcbiAgICogQHJldHVybnMge0F4aW9zUmVzcG9uc2V9XG4gICAqL1xuICAnZGVsZXRlJyh1cmwsIGRhdGEsIG9wdGlvbnMgPSB7fSkge1xuICAgIG9wdGlvbnMudXJsID0gdXJsO1xuICAgIG9wdGlvbnMubWV0aG9kID0gJ0RFTEVURSc7XG4gICAgb3B0aW9ucy5kYXRhID0gZGF0YTtcblxuICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZCBhIEhFQUQgcmVxdWVzdC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVybFxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKlxuICAgKiBAcmV0dXJucyB7QXhpb3NSZXNwb25zZX1cbiAgICovXG4gIGhlYWQodXJsLCBvcHRpb25zID0ge30pIHtcbiAgICBvcHRpb25zLnVybCA9IHVybDtcbiAgICBvcHRpb25zLm1ldGhvZCA9ICdIRUFEJztcblxuICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZCBhIE9QVElPTlMgcmVxdWVzdC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVybFxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKlxuICAgKiBAcmV0dXJucyB7QXhpb3NSZXNwb25zZX1cbiAgICovXG4gIG9wdGlvbnModXJsLCBvcHRpb25zID0ge30pIHtcbiAgICBvcHRpb25zLnVybCA9IHVybDtcbiAgICBvcHRpb25zLm1ldGhvZCA9ICdPUFRJT05TJztcblxuICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZCByZXF1ZXN0LlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxBeGlvc1Jlc3BvbnNlPn1cbiAgICovXG4gIHJlcXVlc3Qob3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLmdldEh0dHAoKS50aGVuKGF4aW9zID0+IHtcbiAgICAgIHJldHVybiBheGlvcyhvcHRpb25zKTtcbiAgICB9KTtcbiAgICAvLyBsZXQgcmVxT3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgLy8gbGV0IHJlcVVybCA9IHVybDtcbiAgICAvLyBsZXQgcmVxSGVhZGVycyA9IGhlYWRlcnM7XG4gICAgLy9cbiAgICAvLyBpZiAodHlwZW9mIHJlcVVybCA9PT0gJ29iamVjdCcpIHtcbiAgICAvLyAgIHJlcU9wdGlvbnMgPSByZXFVcmw7XG4gICAgLy8gICByZXFVcmwgPSByZXFPcHRpb25zLnVybDtcbiAgICAvLyB9XG4gICAgLy9cbiAgICAvLyBjb25zdCBpc0Zvcm1EYXRhID0gZGF0YSBpbnN0YW5jZW9mIEZvcm1EYXRhO1xuICAgIC8vXG4gICAgLy8gaWYgKGlzRm9ybURhdGEpIHtcbiAgICAvLyAgIHJlcU9wdGlvbnMucHJvY2Vzc0RhdGEgPSBmYWxzZTtcbiAgICAvLyAgIHJlcU9wdGlvbnMuY29udGVudFR5cGUgPSBmYWxzZTtcbiAgICAvLyB9XG4gICAgLy9cbiAgICAvLyBpZiAodHlwZW9mIHJlcU9wdGlvbnMuZGF0YVR5cGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgLy8gICByZXFPcHRpb25zLmRhdGFUeXBlID0gJ2pzb24nO1xuICAgIC8vIH1cbiAgICAvL1xuICAgIC8vIHJlcU9wdGlvbnMuZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJyB8fCBpc0Zvcm1EYXRhXG4gICAgLy8gICA/IGRhdGFcbiAgICAvLyAgIDogJC5leHRlbmQodHJ1ZSwge30sIHRoaXMuZGF0YSwgcmVxT3B0aW9ucy5kYXRhLCBkYXRhKTtcbiAgICAvL1xuICAgIC8vIHJlcU9wdGlvbnMudHlwZSA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpIHx8ICdHRVQnO1xuICAgIC8vIGNvbnN0IHsgdHlwZSB9ID0gcmVxT3B0aW9ucztcbiAgICAvL1xuICAgIC8vIGlmIChbJ1BPU1QnLCAnR0VUJ10uaW5kZXhPZihyZXFPcHRpb25zLnR5cGUpID09PSAtMSAmJiB0aGlzLmNvbmZpZy5jdXN0b21NZXRob2QpIHtcbiAgICAvLyAgIHJlcUhlYWRlcnNbJ1gtSFRUUC1NZXRob2QtT3ZlcnJpZGUnXSA9IHJlcU9wdGlvbnMudHlwZTtcbiAgICAvLyAgIHJlcU9wdGlvbnMuZGF0YS5fbWV0aG9kID0gcmVxT3B0aW9ucy50eXBlO1xuICAgIC8vICAgcmVxT3B0aW9ucy50eXBlID0gJ1BPU1QnO1xuICAgIC8vIH1cbiAgICAvL1xuICAgIC8vIHJlcU9wdGlvbnMuaGVhZGVycyA9ICQuZXh0ZW5kKFxuICAgIC8vICAgdHJ1ZSxcbiAgICAvLyAgIHt9LFxuICAgIC8vICAgdGhpcy5oZWFkZXJzLl9nbG9iYWwsXG4gICAgLy8gICB0aGlzLmhlYWRlcnNbdHlwZV0sXG4gICAgLy8gICByZXFPcHRpb25zLmhlYWRlcnMsXG4gICAgLy8gICByZXFIZWFkZXJzLFxuICAgIC8vICk7XG4gICAgLy9cbiAgICAvLyByZXR1cm4gdGhpcy4kLmFqYXgocmVxVXJsLCByZXFPcHRpb25zKVxuICAgIC8vICAgLmZhaWwoKHhociwgZXJyb3IpID0+IHtcbiAgICAvLyAgICAgaWYgKGVycm9yID09PSAncGFyc2VyZXJyb3InKSB7XG4gICAgLy8gICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgLy8gICAgICAgeGhyLnN0YXR1c1RleHQgPSAnVW5hYmxlIHRvIHBhcnNlIGRhdGEuJztcbiAgICAvLyAgICAgfSBlbHNlIHtcbiAgICAvLyAgICAgICB4aHIuc3RhdHVzVGV4dCA9IGRlY29kZVVSSUNvbXBvbmVudCh4aHIuc3RhdHVzVGV4dCk7XG4gICAgLy8gICAgIH1cbiAgICAvLyAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCBjdXN0b20gbWV0aG9kIHdpdGggX21ldGhvZCBwYXJhbWV0ZXIuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIHdpbGwgcmV0dXJuIGEgY2xvbmUgb2YgdGhpcyBvYmplY3QgdG8gaGVscCB1cyBzZW5kIHJlcXVlc3Qgb25jZS5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2U8dGhpcz59XG4gICAqL1xuICBjdXN0b21NZXRob2QodXNlSGVhZGVyID0gdHJ1ZSkge1xuICAgIGNvbnN0IGNsb25lID0gdGhpcztcbiAgICBjbG9uZS5heGlvcyA9IG51bGw7XG5cbiAgICByZXR1cm4gY2xvbmUucmVxdWVzdE1pZGRsZXdhcmUoKGNvbmZpZykgPT4ge1xuICAgICAgaWYgKHVzZUhlYWRlcikge1xuICAgICAgICBjb25maWcuaGVhZGVyc1snWC1IVFRQLU1ldGhvZC1PdmVycmlkZSddID0gY29uZmlnO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgY29uZmlnLmRhdGEgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGNvbmZpZy5kYXRhWydfbWV0aG9kJ10gPSBjb25maWcubWV0aG9kO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgY29uZmlnLmRhdGEgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGlmIChjb25maWcuZGF0YS5pbmNsdWRlcygnPycpKSB7XG4gICAgICAgICAgY29uZmlnLmRhdGEgKz0gJyZfbWV0aG9kPScgKyBjb25maWcubWV0aG9kO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbmZpZy5kYXRhICs9ICc/X21ldGhvZD0nICsgY29uZmlnLm1ldGhvZDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25maWcubWV0aG9kID0gJ1BPU1QnO1xuXG4gICAgICByZXR1cm4gY29uZmlnO1xuICAgIH0pLnRoZW4oKCkgPT4gY2xvbmUpO1xuICB9XG59XG4iLCIvKipcclxuICogUGFydCBvZiBzdGFydGVyIHByb2plY3QuXHJcbiAqXHJcbiAqIEBjb3B5cmlnaHQgIENvcHlyaWdodCAoQykgMjAyMSBfX09SR0FOSVpBVElPTl9fLlxyXG4gKiBAbGljZW5zZSAgICBfX0xJQ0VOU0VfX1xyXG4gKi9cclxuXHJcbmltcG9ydCB7IEV2ZW50TWl4aW4gfSBmcm9tICcuL2V2ZW50cy5qcyc7XHJcbmltcG9ydCB7IG1peCB9IGZyb20gJy4vbWl4d2l0aC5qcyc7XHJcbmltcG9ydCB7IG1lcmdlIH0gZnJvbSAnbG9kYXNoLWVzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFVuaWNvcm5BcHAgZXh0ZW5kcyBtaXgoY2xhc3Mge30pLndpdGgoRXZlbnRNaXhpbikge1xyXG4gIHBsdWdpbnMgPSB7fTtcclxuICBfbGlzdGVuZXJzID0ge307XHJcbiAgd2FpdHMgPSBbXTtcclxuXHJcbiAgLyoqXHJcbiAgICogRGVmYXVsdCBvcHRpb25zLlxyXG4gICAqIEByZXR1cm5zIHtPYmplY3R9XHJcbiAgICovXHJcbiAgc3RhdGljIGdldCBkZWZhdWx0T3B0aW9ucygpIHtcclxuICAgIHJldHVybiB7fTtcclxuICB9XHJcblxyXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xyXG4gICAgc3VwZXIoKTtcclxuICAgIHRoaXMub3B0aW9ucyA9IG1lcmdlKHt9LCB0aGlzLmNvbnN0cnVjdG9yLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcclxuXHJcbiAgICAvLyBXYWl0IGRvbSByZWFkeVxyXG4gICAgdGhpcy53YWl0KChyZXNvbHZlKSA9PiB7XHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCByZXNvbHZlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIFJlYWR5XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xyXG4gICAgICB0aGlzLmNvbXBsZXRlZCgpLnRoZW4oKCkgPT4gdGhpcy50cmlnZ2VyKCdsb2FkZWQnKSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVzZShwbHVnaW4sIG9wdGlvbnMgPSB7fSkge1xyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkocGx1Z2luKSkge1xyXG4gICAgICBwbHVnaW4uZm9yRWFjaChwID0+IHRoaXMudXNlKHApKTtcclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gaWYgKHBsdWdpbi5pcyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAvLyAgIHRocm93IG5ldyBFcnJvcihgUGx1Z2luOiAke3BsdWdpbi5uYW1lfSBtdXN0IGluc3RhbmNlIG9mIDogJHtQbHVnaW4ubmFtZX1gKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICBwbHVnaW4uaW5zdGFsbCh0aGlzLCBvcHRpb25zKTtcclxuXHJcbiAgICB0aGlzLnRyaWdnZXIoJ3BsdWdpbi5pbnN0YWxsZWQnLCBwbHVnaW4pO1xyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgZGV0YWNoKHBsdWdpbikge1xyXG4gICAgaWYgKHBsdWdpbi51bmluc3RhbGwpIHtcclxuICAgICAgcGx1Z2luLnVuaW5zdGFsbCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnRyaWdnZXIoJ3BsdWdpbi51bmluc3RhbGxlZCcsIHBsdWdpbik7XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICB0YXAodmFsdWUsIGNhbGxiYWNrKSB7XHJcbiAgICBjYWxsYmFjayh2YWx1ZSk7XHJcblxyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgLy8gdHJpZ2dlcihldmVudCwgLi4uYXJncykge1xyXG4gIC8vICAgcmV0dXJuIHRoaXMudGFwKHN1cGVyLnRyaWdnZXIoZXZlbnQsIC4uLmFyZ3MpLCAoKSA9PiB7XHJcbiAgLy8gICAgIGlmICh0aGlzLmRhdGEoJ3dpbmR3YWxrZXIuZGVidWcnKSkge1xyXG4gIC8vICAgICAgIGNvbnNvbGUuZGVidWcoYFtVbmljb3JuIEV2ZW50XSAke2V2ZW50fWAsIGFyZ3MsIHRoaXMubGlzdGVuZXJzKGV2ZW50KSk7XHJcbiAgLy8gICAgIH1cclxuICAvLyAgIH0pO1xyXG4gIC8vIH1cclxuXHJcbiAgZGF0YShuYW1lLCB2YWx1ZSkge1xyXG4gICAgdGhpcy50cmlnZ2VyKCd1bmljb3JuLmRhdGEnLCBuYW1lLCB2YWx1ZSk7XHJcblxyXG4gICAgZG9jdW1lbnQuX191bmljb3JuID0gZG9jdW1lbnQuX191bmljb3JuIHx8IHt9O1xyXG5cclxuICAgIGlmIChuYW1lID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgcmV0dXJuIGRvY3VtZW50Ll9fdW5pY29ybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBjb25zdCByZXMgPSBkb2N1bWVudC5fX3VuaWNvcm5bbmFtZV07XHJcblxyXG4gICAgICB0aGlzLnRyaWdnZXIoJ3VuaWNvcm4uZGF0YS5nZXQnLCBuYW1lLCByZXMpO1xyXG5cclxuICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxuXHJcbiAgICBkb2N1bWVudC5fX3VuaWNvcm5bbmFtZV0gPSB2YWx1ZTtcclxuXHJcbiAgICB0aGlzLnRyaWdnZXIoJ3VuaWNvcm4uZGF0YS5zZXQnLCBuYW1lLCB2YWx1ZSk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICByZW1vdmVEYXRhKG5hbWUpIHtcclxuICAgIGRvY3VtZW50Ll9fdW5pY29ybiA9IGRvY3VtZW50Ll9fdW5pY29ybiB8fCB7fTtcclxuXHJcbiAgICBkZWxldGUgZG9jdW1lbnQuX191bmljb3JuW25hbWVdO1xyXG5cclxuICAgICQoZG9jdW1lbnQpLnJlbW92ZURhdGEobmFtZSk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICB1cmkodHlwZSkge1xyXG4gICAgcmV0dXJuIHRoaXMuZGF0YSgndW5pY29ybi51cmknKVt0eXBlXTtcclxuICB9XHJcblxyXG4gIGFzc2V0KHR5cGUpIHtcclxuICAgIHJldHVybiB0aGlzLnVyaSgnYXNzZXQnKVt0eXBlXTtcclxuICB9XHJcblxyXG4gIHdhaXQoY2FsbGJhY2spIHtcclxuICAgIGNvbnN0IHAgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGNvbnN0IHByb21pc2UgPSBjYWxsYmFjayhyZXNvbHZlLCByZWplY3QpO1xyXG5cclxuICAgICAgaWYgKHByb21pc2UgJiYgJ3RoZW4nIGluIHByb21pc2UpIHtcclxuICAgICAgICBwcm9taXNlLnRoZW4ocmVzb2x2ZSkuY2F0Y2gocmVqZWN0KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy53YWl0cy5wdXNoKHApO1xyXG5cclxuICAgIHJldHVybiBwO1xyXG4gIH1cclxuXHJcbiAgY29tcGxldGVkKCkge1xyXG4gICAgY29uc3QgcHJvbWlzZSA9IFByb21pc2UuYWxsKHRoaXMud2FpdHMpO1xyXG5cclxuICAgIHRoaXMud2FpdHMgPSBbXTtcclxuXHJcbiAgICByZXR1cm4gcHJvbWlzZTtcclxuICB9XHJcbn1cclxuIiwiLyoqXG4gKiBQYXJ0IG9mIHN0YXJ0ZXIgcHJvamVjdC5cbiAqXG4gKiBAY29weXJpZ2h0ICBDb3B5cmlnaHQgKEMpIDIwMjEgX19PUkdBTklaQVRJT05fXy5cbiAqIEBsaWNlbnNlICAgIF9fTElDRU5TRV9fXG4gKi9cblxuZXhwb3J0ICogZnJvbSAnLi9ldmVudHMuanMnO1xuZXhwb3J0ICogZnJvbSAnLi9taXh3aXRoLmpzJztcblxuaW1wb3J0IFVuaWNvcm5WYWxpZGF0aW9uIGZyb20gJy4vcGx1Z2luL3ZhbGlkYXRpb24uanMnO1xuaW1wb3J0IFVuaWNvcm5VSSBmcm9tICcuL3VpLmpzJztcbmltcG9ydCBVbmljb3JuR3JpZCBmcm9tICcuL3BsdWdpbi9ncmlkLmpzJztcbmltcG9ydCBVbmljb3JuRm9ybSBmcm9tICcuL3BsdWdpbi9mb3JtLmpzJztcbmltcG9ydCBVbmljb3JuVGlueW1jZSBmcm9tICcuL3BsdWdpbi90aW55bWNlLmpzJztcbmltcG9ydCBVbmljb3JuTG9hZGVyIGZyb20gJy4vbG9hZGVyLmpzJztcbmltcG9ydCBVbmljb3JuSGVscGVyIGZyb20gJy4vaGVscGVyLmpzJztcbmltcG9ydCBVbmljb3JuSHR0cCBmcm9tICcuL2h0dHAuanMnO1xuaW1wb3J0IFVuaWNvcm5BcHAgZnJvbSAnLi9hcHAuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBoZWxwZXIgfSBmcm9tICcuL2hlbHBlci5qcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVBcHAob3B0aW9ucyA9IHt9KSB7XG4gIHJldHVybiBuZXcgVW5pY29ybkFwcChvcHRpb25zKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5vQ29uZmxpY3QoKSB7XG4gIGNvbnN0IHVuaSA9IHdpbmRvdy51O1xuXG4gIGRlbGV0ZSB3aW5kb3cudTtcblxuICByZXR1cm4gdW5pO1xufVxuXG5jb25zdCB1ID0gY3JlYXRlQXBwKCk7XG5cbnUudXNlKFVuaWNvcm5Mb2FkZXIpO1xudS51c2UoVW5pY29ybkhlbHBlcik7XG51LnVzZShVbmljb3JuSHR0cCk7XG51LnVzZShVbmljb3JuVUkpO1xudS51c2UoVW5pY29ybkZvcm0pO1xudS51c2UoVW5pY29ybkdyaWQpO1xudS51c2UoVW5pY29yblZhbGlkYXRpb24pO1xudS51c2UoVW5pY29yblRpbnltY2UpO1xuXG53aW5kb3cudSA9IHU7XG4iXSwibmFtZXMiOlsiX2FwcGxpZWRNaXhpbiIsImFwcGx5Iiwic3VwZXJjbGFzcyIsIm1peGluIiwiYXBwbGljYXRpb24iLCJwcm90b3R5cGUiLCJ1bndyYXAiLCJpc0FwcGxpY2F0aW9uT2YiLCJwcm90byIsImhhc093blByb3BlcnR5IiwiaGFzTWl4aW4iLCJvIiwiT2JqZWN0IiwiZ2V0UHJvdG90eXBlT2YiLCJfd3JhcHBlZE1peGluIiwid3JhcCIsIndyYXBwZXIiLCJzZXRQcm90b3R5cGVPZiIsIl9jYWNoZWRBcHBsaWNhdGlvbnMiLCJDYWNoZWQiLCJjYWNoZWRBcHBsaWNhdGlvbnMiLCJNYXAiLCJnZXQiLCJzZXQiLCJEZUR1cGUiLCJCYXJlTWl4aW4iLCJzIiwiTWl4aW4iLCJtaXgiLCJNaXhpbkJ1aWxkZXIiLCJtaXhpbnMiLCJyZWR1Y2UiLCJjIiwibSIsIl9fcHJvdG9fXyIsIkFycmF5Iiwic2V0UHJvdG9PZiIsIm1peGluUHJvcGVydGllcyIsIm9iaiIsInByb3AiLCJFdmVudE1peGluIiwiZXZlbnQiLCJoYW5kbGVyIiwiaXNBcnJheSIsImZvckVhY2giLCJlIiwib24iLCJfbGlzdGVuZXJzIiwidW5kZWZpbmVkIiwicHVzaCIsIm9uY2UiLCJfb25jZSIsImNhbGxiYWNrIiwibGlzdGVuZXJzIiwiZmlsdGVyIiwibGlzdGVuZXIiLCJhcmdzIiwidHJpZ2dlciIsIkVycm9yIiwiRXZlbnRCdXMiLCJVbmljb3JuVmFsaWRhdGlvbiIsImFwcCIsImZvcm1WYWxpZGF0aW9uIiwic2VsZWN0b3IiLCJzZWxlY3RPbmUiLCJVbmljb3JuVUkiLCJhbGl2ZUhhbmRsZSIsInRoZW1lIiwibWVzc2FnZXMiLCJQcm9taXNlIiwiYWxsIiwibG9hZEFscGluZSIsInRoZW4iLCJlbGVtZW50IiwiQWxwaW5lIiwiaW5pdGlhbGl6ZUNvbXBvbmVudCIsIlNwcnVjZSIsInN0YXJ0IiwibG9hZFNwcnVjZSIsIndpbmRvdyIsImRlZmVyTG9hZGluZ0FscGluZSIsInVpIiwiJHVpIiwiYWRkTWVzc2FnZSIsInJlbmRlck1lc3NhZ2UiLCJiaW5kIiwiaW5pdEFscGluZSIsInN0YXJ0QWxwaW5lIiwic3RhcnRBbHBpbmVTcHJ1Y2UiLCJpbml0QWxwaW5lU3BydWNlIiwibWVzc2FnZVNlbGVjdG9yIiwiZnJlZUdsb2JhbCIsImdsb2JhbCIsImZyZWVTZWxmIiwic2VsZiIsInJvb3QiLCJGdW5jdGlvbiIsIlN5bWJvbCIsIm9iamVjdFByb3RvIiwibmF0aXZlT2JqZWN0VG9TdHJpbmciLCJ0b1N0cmluZyIsInN5bVRvU3RyaW5nVGFnIiwidG9TdHJpbmdUYWciLCJnZXRSYXdUYWciLCJ2YWx1ZSIsImlzT3duIiwiY2FsbCIsInRhZyIsInVubWFza2VkIiwicmVzdWx0Iiwib2JqZWN0VG9TdHJpbmciLCJudWxsVGFnIiwidW5kZWZpbmVkVGFnIiwiYmFzZUdldFRhZyIsImlzT2JqZWN0TGlrZSIsImlzT2JqZWN0IiwidHlwZSIsImlkZW50aXR5IiwiYXN5bmNUYWciLCJmdW5jVGFnIiwiZ2VuVGFnIiwicHJveHlUYWciLCJpc0Z1bmN0aW9uIiwiY29yZUpzRGF0YSIsIm1hc2tTcmNLZXkiLCJ1aWQiLCJleGVjIiwia2V5cyIsIklFX1BST1RPIiwiaXNNYXNrZWQiLCJmdW5jIiwiZnVuY1Byb3RvIiwiZnVuY1RvU3RyaW5nIiwidG9Tb3VyY2UiLCJyZVJlZ0V4cENoYXIiLCJyZUlzSG9zdEN0b3IiLCJyZUlzTmF0aXZlIiwiUmVnRXhwIiwicmVwbGFjZSIsImJhc2VJc05hdGl2ZSIsInBhdHRlcm4iLCJ0ZXN0IiwiZ2V0VmFsdWUiLCJvYmplY3QiLCJrZXkiLCJnZXROYXRpdmUiLCJvYmplY3RDcmVhdGUiLCJjcmVhdGUiLCJiYXNlQ3JlYXRlIiwidGhpc0FyZyIsImxlbmd0aCIsImNvcHlBcnJheSIsInNvdXJjZSIsImFycmF5IiwiaW5kZXgiLCJIT1RfQ09VTlQiLCJIT1RfU1BBTiIsIm5hdGl2ZU5vdyIsIkRhdGUiLCJub3ciLCJzaG9ydE91dCIsImNvdW50IiwibGFzdENhbGxlZCIsInN0YW1wIiwicmVtYWluaW5nIiwiYXJndW1lbnRzIiwiY29uc3RhbnQiLCJkZWZpbmVQcm9wZXJ0eSIsImJhc2VTZXRUb1N0cmluZyIsInN0cmluZyIsInNldFRvU3RyaW5nIiwiYXJyYXlFYWNoIiwiaXRlcmF0ZWUiLCJNQVhfU0FGRV9JTlRFR0VSIiwicmVJc1VpbnQiLCJpc0luZGV4IiwiYmFzZUFzc2lnblZhbHVlIiwiZXEiLCJvdGhlciIsImFzc2lnblZhbHVlIiwib2JqVmFsdWUiLCJjb3B5T2JqZWN0IiwicHJvcHMiLCJjdXN0b21pemVyIiwiaXNOZXciLCJuZXdWYWx1ZSIsIm5hdGl2ZU1heCIsIk1hdGgiLCJtYXgiLCJvdmVyUmVzdCIsInRyYW5zZm9ybSIsIm90aGVyQXJncyIsImJhc2VSZXN0IiwiaXNMZW5ndGgiLCJpc0FycmF5TGlrZSIsImlzSXRlcmF0ZWVDYWxsIiwiY3JlYXRlQXNzaWduZXIiLCJhc3NpZ25lciIsInNvdXJjZXMiLCJndWFyZCIsImlzUHJvdG90eXBlIiwiQ3RvciIsImNvbnN0cnVjdG9yIiwiYmFzZVRpbWVzIiwibiIsImFyZ3NUYWciLCJiYXNlSXNBcmd1bWVudHMiLCJwcm9wZXJ0eUlzRW51bWVyYWJsZSIsImlzQXJndW1lbnRzIiwic3R1YkZhbHNlIiwiZnJlZUV4cG9ydHMiLCJleHBvcnRzIiwibm9kZVR5cGUiLCJmcmVlTW9kdWxlIiwibW9kdWxlIiwibW9kdWxlRXhwb3J0cyIsIkJ1ZmZlciIsIm5hdGl2ZUlzQnVmZmVyIiwiaXNCdWZmZXIiLCJhcnJheVRhZyIsImJvb2xUYWciLCJkYXRlVGFnIiwiZXJyb3JUYWciLCJtYXBUYWciLCJudW1iZXJUYWciLCJvYmplY3RUYWciLCJyZWdleHBUYWciLCJzZXRUYWciLCJzdHJpbmdUYWciLCJ3ZWFrTWFwVGFnIiwiYXJyYXlCdWZmZXJUYWciLCJkYXRhVmlld1RhZyIsImZsb2F0MzJUYWciLCJmbG9hdDY0VGFnIiwiaW50OFRhZyIsImludDE2VGFnIiwiaW50MzJUYWciLCJ1aW50OFRhZyIsInVpbnQ4Q2xhbXBlZFRhZyIsInVpbnQxNlRhZyIsInVpbnQzMlRhZyIsInR5cGVkQXJyYXlUYWdzIiwiYmFzZUlzVHlwZWRBcnJheSIsImJhc2VVbmFyeSIsImZyZWVQcm9jZXNzIiwicHJvY2VzcyIsIm5vZGVVdGlsIiwidHlwZXMiLCJyZXF1aXJlIiwiYmluZGluZyIsIm5vZGVJc1R5cGVkQXJyYXkiLCJpc1R5cGVkQXJyYXkiLCJhcnJheUxpa2VLZXlzIiwiaW5oZXJpdGVkIiwiaXNBcnIiLCJpc0FyZyIsImlzQnVmZiIsImlzVHlwZSIsInNraXBJbmRleGVzIiwiU3RyaW5nIiwib3ZlckFyZyIsImFyZyIsIm5hdGl2ZUtleXMiLCJiYXNlS2V5cyIsIm5hdGl2ZUtleXNJbiIsImJhc2VLZXlzSW4iLCJpc1Byb3RvIiwia2V5c0luIiwibmF0aXZlQ3JlYXRlIiwiaGFzaENsZWFyIiwiX19kYXRhX18iLCJzaXplIiwiaGFzaERlbGV0ZSIsImhhcyIsIkhBU0hfVU5ERUZJTkVEIiwiaGFzaEdldCIsImRhdGEiLCJoYXNoSGFzIiwiaGFzaFNldCIsIkhhc2giLCJlbnRyaWVzIiwiY2xlYXIiLCJlbnRyeSIsImxpc3RDYWNoZUNsZWFyIiwiYXNzb2NJbmRleE9mIiwiYXJyYXlQcm90byIsInNwbGljZSIsImxpc3RDYWNoZURlbGV0ZSIsImxhc3RJbmRleCIsInBvcCIsImxpc3RDYWNoZUdldCIsImxpc3RDYWNoZUhhcyIsImxpc3RDYWNoZVNldCIsIkxpc3RDYWNoZSIsIm1hcENhY2hlQ2xlYXIiLCJpc0tleWFibGUiLCJnZXRNYXBEYXRhIiwibWFwIiwibWFwQ2FjaGVEZWxldGUiLCJtYXBDYWNoZUdldCIsIm1hcENhY2hlSGFzIiwibWFwQ2FjaGVTZXQiLCJNYXBDYWNoZSIsImdldFByb3RvdHlwZSIsIm9iamVjdEN0b3JTdHJpbmciLCJpc1BsYWluT2JqZWN0Iiwic3RhY2tDbGVhciIsInN0YWNrRGVsZXRlIiwic3RhY2tHZXQiLCJzdGFja0hhcyIsIkxBUkdFX0FSUkFZX1NJWkUiLCJzdGFja1NldCIsInBhaXJzIiwiU3RhY2siLCJhbGxvY1Vuc2FmZSIsImNsb25lQnVmZmVyIiwiYnVmZmVyIiwiaXNEZWVwIiwic2xpY2UiLCJjb3B5IiwiVWludDhBcnJheSIsImNsb25lQXJyYXlCdWZmZXIiLCJhcnJheUJ1ZmZlciIsImJ5dGVMZW5ndGgiLCJjbG9uZVR5cGVkQXJyYXkiLCJ0eXBlZEFycmF5IiwiYnl0ZU9mZnNldCIsImluaXRDbG9uZU9iamVjdCIsImNyZWF0ZUJhc2VGb3IiLCJmcm9tUmlnaHQiLCJrZXlzRnVuYyIsIml0ZXJhYmxlIiwiYmFzZUZvciIsImJhc2VGb3JPd24iLCJjcmVhdGVCYXNlRWFjaCIsImVhY2hGdW5jIiwiY29sbGVjdGlvbiIsImJhc2VFYWNoIiwiYXNzaWduTWVyZ2VWYWx1ZSIsImlzQXJyYXlMaWtlT2JqZWN0Iiwic2FmZUdldCIsInRvUGxhaW5PYmplY3QiLCJiYXNlTWVyZ2VEZWVwIiwic3JjSW5kZXgiLCJtZXJnZUZ1bmMiLCJzdGFjayIsInNyY1ZhbHVlIiwic3RhY2tlZCIsImlzQ29tbW9uIiwiaXNUeXBlZCIsImJhc2VNZXJnZSIsImN1c3RvbURlZmF1bHRzTWVyZ2UiLCJtZXJnZVdpdGgiLCJkZWZhdWx0c0RlZXAiLCJjYXN0RnVuY3Rpb24iLCJtZXJnZSIsImRlZkRhdGEiLCJuYW1lIiwiZGVmQ2FsbGJhY2siLCJwcmVwYXJlRGF0YSIsIl9fdW5pY29ybiIsIlVuaWNvcm5HcmlkIiwiZ3JpZCIsImVsZSIsIm9wdGlvbnMiLCJVbmljb3JuR3JpZEVsZW1lbnQiLCJhc3NpZ24iLCJkZWZhdWx0T3B0aW9ucyIsImZvcm0iLCJyZWdpc3RlckV2ZW50cyIsInN0b3JlIiwiY3VzdG9tIiwib3JkZXJpbmciLCJkYXRhc2V0IiwidG9Mb3dlckNhc2UiLCJlbmRzV2l0aCIsInVzZVN0YXRlIiwiJGV2ZW50IiwicHJldmVudERlZmF1bHQiLCJwdXQiLCJxdWVyeVNlbGVjdG9yQWxsIiwiJGVsIiwiZGlyIiwiZ2V0RGlyZWN0aW9uIiwiZmllbGQiLCJhc2MiLCJkZXNjIiwic29ydEJ5Iiwib3JkZXJpbmdJbnB1dCIsInF1ZXJ5U2VsZWN0b3IiLCJoIiwiYXBwZW5kQ2hpbGQiLCJvcmRlcmluZ0VxdWFscyIsImEiLCJiIiwidHJpbSIsInJvdyIsImNoIiwiZmluZCIsImNoZWNrZWQiLCJ1cmwiLCJxdWVyaWVzIiwidG9nZ2xlQWxsIiwiY2hlY2tSb3ciLCJjb3JlIiwicGF0Y2giLCJ0YXNrIiwidXBkYXRlUm93IiwicG9zdCIsIm1lc3NhZ2UiLCJfXyIsImNvbmZpcm0iLCJpc0NvbmZpcm0iLCJtc2ciLCJkZWxldGVMaXN0Iiwic2VsZWN0QWxsIiwiaW5wdXQiLCJnZXRDaGVja2VkIiwiVW5pY29ybiIsIlRyYW5zbGF0b3IiLCJ0cmFuc2xhdGUiLCJjb3VudENoZWNrZWQiLCJhbGVydCIsInN0b3BQcm9wYWdhdGlvbiIsIm9yaWdpbiIsIm9yaWdpbk9yZGVyaW5nIiwidmFsIiwic3BsaXQiLCJpbnB1dHMiLCJlYWNoIiwiaSIsIiR0aGlzIiwiJCIsImF0dHIiLCJ0ciIsInBhcmVudHMiLCJncm91cCIsInNpYmxpbmdzIiwiYmF0Y2giLCJkZWx0YSIsImRvVGFzayIsIlVuaWNvcm5Gb3JtIiwiVW5pY29ybkZvcm1FbGVtZW50IiwiJGZvcm0iLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJpbmRleE9mIiwic2V0QXR0cmlidXRlIiwic3Vic3RyIiwiY3NyZiIsImJvZHkiLCJiaW5kRXZlbnRzIiwibWV0aG9kIiwiY3VzdG9tTWV0aG9kIiwibWV0aG9kSW5wdXQiLCJmbGF0dGVkIiwiZmxhdHRlbk9iamVjdCIsImZpZWxkTmFtZSIsImJ1aWxkRmllbGROYW1lIiwic3VibWl0QnV0dG9uIiwic3VibWl0Iiwic3R5bGUiLCJkaXNwbGF5IiwiY2xpY2siLCJvYiIsInRvUmV0dXJuIiwiZmxhdE9iamVjdCIsIngiLCJuYW1lcyIsImZpcnN0Iiwic2hpZnQiLCJqb2luIiwiVW5pY29yblRpbnltY2UiLCJsb2FkVGlueW1jZSIsImluc3RhbmNlcyIsIlRpbnltY2VFZGl0b3IiLCJ0aW55bWNlIiwicHJlcGFyZU9wdGlvbnMiLCJpbml0IiwiZWRpdG9yIiwiZGVmYXVsdHMiLCJpbWFnZXNfdXBsb2FkX3VybCIsInBhc3RlX2RhdGFfaW1hZ2VzIiwicmVtb3ZlX3NjcmlwdF9ob3N0IiwicmVsYXRpdmVfdXJscyIsImltYWdlc191cGxvYWRfaGFuZGxlciIsImltYWdlVXBsb2FkSGFuZGxlciIsInNldHVwIiwidHJpZ2dlclNhdmUiLCJ0ZXh0IiwiaW5zZXJ0Q29udGVudCIsImdldENvbnRlbnQiLCJzZXRDb250ZW50IiwiYmxvYkluZm8iLCJzdWNjZXNzIiwiZmFpbHVyZSIsImRpc3BhdGNoRXZlbnQiLCJDdXN0b21FdmVudCIsInhociIsIlhNTEh0dHBSZXF1ZXN0Iiwid2l0aENyZWRlbnRpYWxzIiwib3BlbiIsImFkZEV2ZW50TGlzdGVuZXIiLCJzdGF0dXMiLCJkZWNvZGVVUklDb21wb25lbnQiLCJzdGF0dXNUZXh0IiwianNvbiIsIkpTT04iLCJwYXJzZSIsInJlc3BvbnNlVGV4dCIsImNvbnNvbGUiLCJlcnJvciIsImZvcm1EYXRhIiwiRm9ybURhdGEiLCJhcHBlbmQiLCJibG9iIiwiZmlsZW5hbWUiLCJzZW5kIiwiVW5pY29ybkxvYWRlciIsInNyYyIsIlN5c3RlbSIsInJlIiwibm90X3N0cmluZyIsIm5vdF9ib29sIiwibm90X3R5cGUiLCJub3RfcHJpbWl0aXZlIiwibnVtYmVyIiwibnVtZXJpY19hcmciLCJub3RfanNvbiIsIm1vZHVsbyIsInBsYWNlaG9sZGVyIiwia2V5X2FjY2VzcyIsImluZGV4X2FjY2VzcyIsInNpZ24iLCJzcHJpbnRmIiwic3ByaW50Zl9mb3JtYXQiLCJzcHJpbnRmX3BhcnNlIiwidnNwcmludGYiLCJmbXQiLCJhcmd2IiwiY29uY2F0IiwicGFyc2VfdHJlZSIsImN1cnNvciIsInRyZWVfbGVuZ3RoIiwib3V0cHV0IiwiayIsInBoIiwicGFkIiwicGFkX2NoYXJhY3RlciIsInBhZF9sZW5ndGgiLCJpc19wb3NpdGl2ZSIsInBhcmFtX25vIiwiaXNOYU4iLCJUeXBlRXJyb3IiLCJwYXJzZUludCIsImZyb21DaGFyQ29kZSIsInN0cmluZ2lmeSIsIndpZHRoIiwicHJlY2lzaW9uIiwicGFyc2VGbG9hdCIsInRvRXhwb25lbnRpYWwiLCJ0b0ZpeGVkIiwiTnVtYmVyIiwidG9QcmVjaXNpb24iLCJzdWJzdHJpbmciLCJ2YWx1ZU9mIiwidG9VcHBlckNhc2UiLCJwYWRfY2hhciIsImNoYXJBdCIsInJlcGVhdCIsImFsaWduIiwic3ByaW50Zl9jYWNoZSIsIl9mbXQiLCJtYXRjaCIsImFyZ19uYW1lcyIsImZpZWxkX2xpc3QiLCJyZXBsYWNlbWVudF9maWVsZCIsImZpZWxkX21hdGNoIiwiU3ludGF4RXJyb3IiLCJkZWZpbmUiLCJVbmljb3JuSGVscGVyIiwicmVzdWx0U2V0IiwiYXR0cnMiLCJjb250ZW50IiwidiIsImlubmVySFRNTCIsInBhdGgiLCJCb29sZWFuIiwicmVzb2x2ZSIsInVyaSIsImFzc2V0IiwidGltZSIsInNldEludGVydmFsIiwiZmV0Y2giLCJjbGVhckludGVydmFsIiwiZGF0ZSIsImdldE51bGxEYXRlIiwiZGVjaW1hbHMiLCJkZWNQb2ludCIsInRob3VzYW5kc1NlcCIsInJvdW5kZWROdW1iZXIiLCJyb3VuZCIsImFicyIsIm51bWJlcnNTdHJpbmciLCJkZWNpbWFsc1N0cmluZyIsImZvcm1hdHRlZE51bWJlciIsImhlbHBlciIsIiRoZWxwZXIiLCIkZ2V0IiwiJHNldCIsImlzRGVidWciLCJrZWVwQWxpdmUiLCJzdG9wS2VlcEFsaXZlIiwiaXNOdWxsRGF0ZSIsIm51bWJlckZvcm1hdCIsIlVuaWNvcm5IdHRwIiwiY29uZmlnIiwiZ2xvYmFsQXhpb3MiLCJheGlvcyIsImNyZWF0ZUh0dHAiLCJpbnRlcmNlcHRvcnMiLCJyZXF1ZXN0IiwidXNlIiwiaGVhZGVycyIsImdldEh0dHAiLCJyZXNwb25zZSIsInVzZUhlYWRlciIsImNsb25lIiwicmVxdWVzdE1pZGRsZXdhcmUiLCJpbmNsdWRlcyIsIiRodHRwIiwiVW5pY29ybkFwcCIsIndhaXQiLCJjb21wbGV0ZWQiLCJwbHVnaW4iLCJwIiwiaW5zdGFsbCIsInVuaW5zdGFsbCIsInJlcyIsInJlbW92ZURhdGEiLCJyZWplY3QiLCJwcm9taXNlIiwid2FpdHMiLCJjcmVhdGVBcHAiLCJub0NvbmZsaWN0IiwidW5pIiwidSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBQ0E7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