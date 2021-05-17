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
          return _this.instances[selector] = new TinymceEditor(selector, options);
        });
      }
    }, {
      key: "get",
      value: function get(selector) {
        this.instances[selector];
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
    function TinymceEditor(selector, options) {
      _classCallCheck(this, TinymceEditor);

      options.selector = selector;
      this.selector = selector;
      this.options = defaultsDeep({}, options, this.constructor.defaultOptions);
      var editor = tinymce.init(options);
      this.editor = editor;
    }

    _createClass(TinymceEditor, [{
      key: "getEditor",
      value: function getEditor() {
        return this.editor;
      }
    }, {
      key: "propareOptions",
      value: function propareOptions(options) {//
      }
    }, {
      key: "insert",
      value: function insert(text) {
        return this.editor.insertContent(text);
      }
    }, {
      key: "getValue",
      value: function getValue(text) {
        return this.editor.setContent(text);
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFyZ2V0LmpzIiwic291cmNlcyI6WyIuLi9zcmMvdW5pY29ybi9taXh3aXRoLmpzIiwiLi4vc3JjL3VuaWNvcm4vZXZlbnRzLmpzIiwiLi4vc3JjL3VuaWNvcm4vcGx1Z2luL3ZhbGlkYXRpb24uanMiLCIuLi9zcmMvdW5pY29ybi91aS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2ZyZWVHbG9iYWwuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19yb290LmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fU3ltYm9sLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fZ2V0UmF3VGFnLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fb2JqZWN0VG9TdHJpbmcuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19iYXNlR2V0VGFnLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9pc09iamVjdExpa2UuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL2lzQXJyYXkuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL2lzT2JqZWN0LmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9pZGVudGl0eS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvaXNGdW5jdGlvbi5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2NvcmVKc0RhdGEuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19pc01hc2tlZC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX3RvU291cmNlLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYmFzZUlzTmF0aXZlLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fZ2V0VmFsdWUuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19nZXROYXRpdmUuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19iYXNlQ3JlYXRlLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYXBwbHkuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19jb3B5QXJyYXkuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19zaG9ydE91dC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvY29uc3RhbnQuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19kZWZpbmVQcm9wZXJ0eS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Jhc2VTZXRUb1N0cmluZy5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX3NldFRvU3RyaW5nLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYXJyYXlFYWNoLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9faXNJbmRleC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Jhc2VBc3NpZ25WYWx1ZS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvZXEuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19hc3NpZ25WYWx1ZS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2NvcHlPYmplY3QuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19vdmVyUmVzdC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Jhc2VSZXN0LmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9pc0xlbmd0aC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvaXNBcnJheUxpa2UuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19pc0l0ZXJhdGVlQ2FsbC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2NyZWF0ZUFzc2lnbmVyLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9faXNQcm90b3R5cGUuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19iYXNlVGltZXMuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19iYXNlSXNBcmd1bWVudHMuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL2lzQXJndW1lbnRzLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9zdHViRmFsc2UuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL2lzQnVmZmVyLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYmFzZUlzVHlwZWRBcnJheS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Jhc2VVbmFyeS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX25vZGVVdGlsLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9pc1R5cGVkQXJyYXkuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19hcnJheUxpa2VLZXlzLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fb3ZlckFyZy5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX25hdGl2ZUtleXMuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19iYXNlS2V5cy5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMva2V5cy5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX25hdGl2ZUtleXNJbi5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Jhc2VLZXlzSW4uanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL2tleXNJbi5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX25hdGl2ZUNyZWF0ZS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2hhc2hDbGVhci5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2hhc2hEZWxldGUuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19oYXNoR2V0LmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9faGFzaEhhcy5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2hhc2hTZXQuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19IYXNoLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fbGlzdENhY2hlQ2xlYXIuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19hc3NvY0luZGV4T2YuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19saXN0Q2FjaGVEZWxldGUuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19saXN0Q2FjaGVHZXQuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19saXN0Q2FjaGVIYXMuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19saXN0Q2FjaGVTZXQuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19MaXN0Q2FjaGUuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19NYXAuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19tYXBDYWNoZUNsZWFyLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9faXNLZXlhYmxlLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fZ2V0TWFwRGF0YS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX21hcENhY2hlRGVsZXRlLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fbWFwQ2FjaGVHZXQuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19tYXBDYWNoZUhhcy5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX21hcENhY2hlU2V0LmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fTWFwQ2FjaGUuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19nZXRQcm90b3R5cGUuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL2lzUGxhaW5PYmplY3QuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19zdGFja0NsZWFyLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fc3RhY2tEZWxldGUuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19zdGFja0dldC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX3N0YWNrSGFzLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fc3RhY2tTZXQuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19TdGFjay5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Nsb25lQnVmZmVyLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fVWludDhBcnJheS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Nsb25lQXJyYXlCdWZmZXIuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19jbG9uZVR5cGVkQXJyYXkuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19pbml0Q2xvbmVPYmplY3QuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19jcmVhdGVCYXNlRm9yLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYmFzZUZvci5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Jhc2VGb3JPd24uanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19jcmVhdGVCYXNlRWFjaC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Jhc2VFYWNoLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYXNzaWduTWVyZ2VWYWx1ZS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvaXNBcnJheUxpa2VPYmplY3QuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19zYWZlR2V0LmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy90b1BsYWluT2JqZWN0LmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYmFzZU1lcmdlRGVlcC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Jhc2VNZXJnZS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2N1c3RvbURlZmF1bHRzTWVyZ2UuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL21lcmdlV2l0aC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvZGVmYXVsdHNEZWVwLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fY2FzdEZ1bmN0aW9uLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9mb3JFYWNoLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9tZXJnZS5qcyIsIi4uL3NyYy91bmljb3JuL3V0aWxpdGllcy5qcyIsIi4uL3NyYy91bmljb3JuL3BsdWdpbi9ncmlkLmpzIiwiLi4vc3JjL3VuaWNvcm4vcGx1Z2luL2Zvcm0uanMiLCIuLi9zcmMvdW5pY29ybi9wbHVnaW4vdGlueW1jZS5qcyIsIi4uL3NyYy91bmljb3JuL2xvYWRlci5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zcHJpbnRmLWpzL3NyYy9zcHJpbnRmLmpzIiwiLi4vc3JjL3VuaWNvcm4vaGVscGVyLmpzIiwiLi4vc3JjL3VuaWNvcm4vaHR0cC5qcyIsIi4uL3NyYy91bmljb3JuL2FwcC5qcyIsIi4uL3NyYy91bmljb3JuL3VuaWNvcm4uanMiXSwic291cmNlc0NvbnRlbnQiOlsiXG4vKipcbiAqIFBhcnQgb2YgcGhvZW5peCBwcm9qZWN0LlxuICpcbiAqIE1vZGlmaWVkIHZlcnNpb24gb2YgbWl4d2l0aC5qcy4gQHNlZSBodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vanVzdGluZmFnbmFuaS9taXh3aXRoLmpzL1xuICpcbiAqIEBjb3B5cmlnaHQgIENvcHlyaWdodCAoQykgMjAxOSAke09SR0FOSVpBVElPTn0uXG4gKiBAbGljZW5zZSAgICBfX0xJQ0VOU0VfX1xuICovXG5cbi8vIHVzZWQgYnkgYXBwbHkoKSBhbmQgaXNBcHBsaWNhdGlvbk9mKClcbmNvbnN0IF9hcHBsaWVkTWl4aW4gPSAnX19taXh3aXRoX2FwcGxpZWRNaXhpbic7XG5cbi8qKlxuICogQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBzdWJjbGFzcyBvZiBpdHMgYXJndW1lbnQuXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IE0gPSAoc3VwZXJjbGFzcykgPT4gY2xhc3MgZXh0ZW5kcyBzdXBlcmNsYXNzIHtcbiAqICAgZ2V0TWVzc2FnZSgpIHtcbiAqICAgICByZXR1cm4gXCJIZWxsb1wiO1xuICogICB9XG4gKiB9XG4gKlxuICogQHR5cGVkZWYge0Z1bmN0aW9ufSBNaXhpbkZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdXBlcmNsYXNzXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gQSBzdWJjbGFzcyBvZiBgc3VwZXJjbGFzc2BcbiAqL1xuXG4vKipcbiAqIEFwcGxpZXMgYG1peGluYCB0byBgc3VwZXJjbGFzc2AuXG4gKlxuICogYGFwcGx5YCBzdG9yZXMgYSByZWZlcmVuY2UgZnJvbSB0aGUgbWl4aW4gYXBwbGljYXRpb24gdG8gdGhlIHVud3JhcHBlZCBtaXhpblxuICogdG8gbWFrZSBgaXNBcHBsaWNhdGlvbk9mYCBhbmQgYGhhc01peGluYCB3b3JrLlxuICpcbiAqIFRoaXMgZnVuY3Rpb24gaXMgdXNlZnVsbCBmb3IgbWl4aW4gd3JhcHBlcnMgdGhhdCB3YW50IHRvIGF1dG9tYXRpY2FsbHkgZW5hYmxlXG4gKiB7QGxpbmsgaGFzTWl4aW59IHN1cHBvcnQuXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IEFwcGxpZXIgPSAobWl4aW4pID0+IHdyYXAobWl4aW4sIChzdXBlcmNsYXNzKSA9PiBhcHBseShzdXBlcmNsYXNzLCBtaXhpbikpO1xuICpcbiAqIC8vIE0gbm93IHdvcmtzIHdpdGggYGhhc01peGluYCBhbmQgYGlzQXBwbGljYXRpb25PZmBcbiAqIGNvbnN0IE0gPSBBcHBsaWVyKChzdXBlcmNsYXNzKSA9PiBjbGFzcyBleHRlbmRzIHN1cGVyY2xhc3Mge30pO1xuICpcbiAqIGNsYXNzIEMgZXh0ZW5kcyBNKE9iamVjdCkge31cbiAqIGxldCBpID0gbmV3IEMoKTtcbiAqIGhhc01peGluKGksIE0pOyAvLyB0cnVlXG4gKlxuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdXBlcmNsYXNzIEEgY2xhc3Mgb3IgY29uc3RydWN0b3IgZnVuY3Rpb25cbiAqIEBwYXJhbSB7TWl4aW5GdW5jdGlvbn0gbWl4aW4gVGhlIG1peGluIHRvIGFwcGx5XG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gQSBzdWJjbGFzcyBvZiBgc3VwZXJjbGFzc2AgcHJvZHVjZWQgYnkgYG1peGluYFxuICovXG5jb25zdCBhcHBseSA9IChzdXBlcmNsYXNzLCBtaXhpbikgPT4ge1xuICBsZXQgYXBwbGljYXRpb24gPSBtaXhpbihzdXBlcmNsYXNzKTtcbiAgYXBwbGljYXRpb24ucHJvdG90eXBlW19hcHBsaWVkTWl4aW5dID0gdW53cmFwKG1peGluKTtcbiAgcmV0dXJuIGFwcGxpY2F0aW9uO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIGB0cnVlYCBpZmYgYHByb3RvYCBpcyBhIHByb3RvdHlwZSBjcmVhdGVkIGJ5IHRoZSBhcHBsaWNhdGlvbiBvZlxuICogYG1peGluYCB0byBhIHN1cGVyY2xhc3MuXG4gKlxuICogYGlzQXBwbGljYXRpb25PZmAgd29ya3MgYnkgY2hlY2tpbmcgdGhhdCBgcHJvdG9gIGhhcyBhIHJlZmVyZW5jZSB0byBgbWl4aW5gXG4gKiBhcyBjcmVhdGVkIGJ5IGBhcHBseWAuXG4gKlxuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge09iamVjdH0gcHJvdG8gQSBwcm90b3R5cGUgb2JqZWN0IGNyZWF0ZWQgYnkge0BsaW5rIGFwcGx5fS5cbiAqIEBwYXJhbSB7TWl4aW5GdW5jdGlvbn0gbWl4aW4gQSBtaXhpbiBmdW5jdGlvbiB1c2VkIHdpdGgge0BsaW5rIGFwcGx5fS5cbiAqIEByZXR1cm4ge2Jvb2xlYW59IHdoZXRoZXIgYHByb3RvYCBpcyBhIHByb3RvdHlwZSBjcmVhdGVkIGJ5IHRoZSBhcHBsaWNhdGlvbiBvZlxuICogYG1peGluYCB0byBhIHN1cGVyY2xhc3NcbiAqL1xuY29uc3QgaXNBcHBsaWNhdGlvbk9mID0gKHByb3RvLCBtaXhpbikgPT5cbiAgcHJvdG8uaGFzT3duUHJvcGVydHkoX2FwcGxpZWRNaXhpbikgJiYgcHJvdG9bX2FwcGxpZWRNaXhpbl0gPT09IHVud3JhcChtaXhpbik7XG5cbi8qKlxuICogUmV0dXJucyBgdHJ1ZWAgaWZmIGBvYCBoYXMgYW4gYXBwbGljYXRpb24gb2YgYG1peGluYCBvbiBpdHMgcHJvdG90eXBlXG4gKiBjaGFpbi5cbiAqXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7T2JqZWN0fSBvIEFuIG9iamVjdFxuICogQHBhcmFtIHtNaXhpbkZ1bmN0aW9ufSBtaXhpbiBBIG1peGluIGFwcGxpZWQgd2l0aCB7QGxpbmsgYXBwbHl9XG4gKiBAcmV0dXJuIHtib29sZWFufSB3aGV0aGVyIGBvYCBoYXMgYW4gYXBwbGljYXRpb24gb2YgYG1peGluYCBvbiBpdHMgcHJvdG90eXBlXG4gKiBjaGFpblxuICovXG5jb25zdCBoYXNNaXhpbiA9IChvLCBtaXhpbikgPT4ge1xuICB3aGlsZSAobyAhPSBudWxsKSB7XG4gICAgaWYgKGlzQXBwbGljYXRpb25PZihvLCBtaXhpbikpIHJldHVybiB0cnVlO1xuICAgIG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yobyk7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5cbi8vIHVzZWQgYnkgd3JhcCgpIGFuZCB1bndyYXAoKVxuY29uc3QgX3dyYXBwZWRNaXhpbiA9ICdfX21peHdpdGhfd3JhcHBlZE1peGluJztcblxuLyoqXG4gKiBTZXRzIHVwIHRoZSBmdW5jdGlvbiBgbWl4aW5gIHRvIGJlIHdyYXBwZWQgYnkgdGhlIGZ1bmN0aW9uIGB3cmFwcGVyYCwgd2hpbGVcbiAqIGFsbG93aW5nIHByb3BlcnRpZXMgb24gYG1peGluYCB0byBiZSBhdmFpbGFibGUgdmlhIGB3cmFwcGVyYCwgYW5kIGFsbG93aW5nXG4gKiBgd3JhcHBlcmAgdG8gYmUgdW53cmFwcGVkIHRvIGdldCB0byB0aGUgb3JpZ2luYWwgZnVuY3Rpb24uXG4gKlxuICogYHdyYXBgIGRvZXMgdHdvIHRoaW5nczpcbiAqICAgMS4gU2V0cyB0aGUgcHJvdG90eXBlIG9mIGBtaXhpbmAgdG8gYHdyYXBwZXJgIHNvIHRoYXQgcHJvcGVydGllcyBzZXQgb25cbiAqICAgICAgYG1peGluYCBpbmhlcml0ZWQgYnkgYHdyYXBwZXJgLlxuICogICAyLiBTZXRzIGEgc3BlY2lhbCBwcm9wZXJ0eSBvbiBgbWl4aW5gIHRoYXQgcG9pbnRzIGJhY2sgdG8gYG1peGluYCBzbyB0aGF0XG4gKiAgICAgIGl0IGNhbiBiZSByZXRyZWl2ZWQgZnJvbSBgd3JhcHBlcmBcbiAqXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7TWl4aW5GdW5jdGlvbn0gbWl4aW4gQSBtaXhpbiBmdW5jdGlvblxuICogQHBhcmFtIHtNaXhpbkZ1bmN0aW9ufSB3cmFwcGVyIEEgZnVuY3Rpb24gdGhhdCB3cmFwcyB7QGxpbmsgbWl4aW59XG4gKiBAcmV0dXJuIHtNaXhpbkZ1bmN0aW9ufSBgd3JhcHBlcmBcbiAqL1xuY29uc3Qgd3JhcCA9IChtaXhpbiwgd3JhcHBlcikgPT4ge1xuICBPYmplY3Quc2V0UHJvdG90eXBlT2Yod3JhcHBlciwgbWl4aW4pO1xuICBpZiAoIW1peGluW193cmFwcGVkTWl4aW5dKSB7XG4gICAgbWl4aW5bX3dyYXBwZWRNaXhpbl0gPSBtaXhpbjtcbiAgfVxuICByZXR1cm4gd3JhcHBlcjtcbn07XG5cbi8qKlxuICogVW53cmFwcyB0aGUgZnVuY3Rpb24gYHdyYXBwZXJgIHRvIHJldHVybiB0aGUgb3JpZ2luYWwgZnVuY3Rpb24gd3JhcHBlZCBieVxuICogb25lIG9yIG1vcmUgY2FsbHMgdG8gYHdyYXBgLiBSZXR1cm5zIGB3cmFwcGVyYCBpZiBpdCdzIG5vdCBhIHdyYXBwZWRcbiAqIGZ1bmN0aW9uLlxuICpcbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtNaXhpbkZ1bmN0aW9ufSB3cmFwcGVyIEEgd3JhcHBlZCBtaXhpbiBwcm9kdWNlZCBieSB7QGxpbmsgd3JhcH1cbiAqIEByZXR1cm4ge01peGluRnVuY3Rpb259IFRoZSBvcmlnaW5hbGx5IHdyYXBwZWQgbWl4aW5cbiAqL1xuY29uc3QgdW53cmFwID0gKHdyYXBwZXIpID0+IHdyYXBwZXJbX3dyYXBwZWRNaXhpbl0gfHwgd3JhcHBlcjtcblxuY29uc3QgX2NhY2hlZEFwcGxpY2F0aW9ucyA9ICdfX21peHdpdGhfY2FjaGVkQXBwbGljYXRpb25zJztcblxuLyoqXG4gKiBEZWNvcmF0ZXMgYG1peGluYCBzbyB0aGF0IGl0IGNhY2hlcyBpdHMgYXBwbGljYXRpb25zLiBXaGVuIGFwcGxpZWQgbXVsdGlwbGVcbiAqIHRpbWVzIHRvIHRoZSBzYW1lIHN1cGVyY2xhc3MsIGBtaXhpbmAgd2lsbCBvbmx5IGNyZWF0ZSBvbmUgc3ViY2xhc3MsIG1lbW9pemVcbiAqIGl0IGFuZCByZXR1cm4gaXQgZm9yIGVhY2ggYXBwbGljYXRpb24uXG4gKlxuICogTm90ZTogSWYgYG1peGluYCBzb21laG93IHN0b3JlcyBwcm9wZXJ0aWVzIGl0cyBjbGFzc2VzIGNvbnN0cnVjdG9yIChzdGF0aWNcbiAqIHByb3BlcnRpZXMpLCBvciBvbiBpdHMgY2xhc3NlcyBwcm90b3R5cGUsIGl0IHdpbGwgYmUgc2hhcmVkIGFjcm9zcyBhbGxcbiAqIGFwcGxpY2F0aW9ucyBvZiBgbWl4aW5gIHRvIGEgc3VwZXIgY2xhc3MuIEl0J3MgcmVjY29tZW5kZWQgdGhhdCBgbWl4aW5gIG9ubHlcbiAqIGFjY2VzcyBpbnN0YW5jZSBzdGF0ZS5cbiAqXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7TWl4aW5GdW5jdGlvbn0gbWl4aW4gVGhlIG1peGluIHRvIHdyYXAgd2l0aCBjYWNoaW5nIGJlaGF2aW9yXG4gKiBAcmV0dXJuIHtNaXhpbkZ1bmN0aW9ufSBhIG5ldyBtaXhpbiBmdW5jdGlvblxuICovXG5jb25zdCBDYWNoZWQgPSAobWl4aW4pID0+IHdyYXAobWl4aW4sIChzdXBlcmNsYXNzKSA9PiB7XG4gIC8vIEdldCBvciBjcmVhdGUgYSBzeW1ib2wgdXNlZCB0byBsb29rIHVwIGEgcHJldmlvdXMgYXBwbGljYXRpb24gb2YgbWl4aW5cbiAgLy8gdG8gdGhlIGNsYXNzLiBUaGlzIHN5bWJvbCBpcyB1bmlxdWUgcGVyIG1peGluIGRlZmluaXRpb24sIHNvIGEgY2xhc3Mgd2lsbCBoYXZlIE5cbiAgLy8gYXBwbGljYXRpb25SZWZzIGlmIGl0IGhhcyBoYWQgTiBtaXhpbnMgYXBwbGllZCB0byBpdC4gQSBtaXhpbiB3aWxsIGhhdmVcbiAgLy8gZXhhY3RseSBvbmUgX2NhY2hlZEFwcGxpY2F0aW9uUmVmIHVzZWQgdG8gc3RvcmUgaXRzIGFwcGxpY2F0aW9ucy5cblxuICBsZXQgY2FjaGVkQXBwbGljYXRpb25zID0gc3VwZXJjbGFzc1tfY2FjaGVkQXBwbGljYXRpb25zXTtcbiAgaWYgKCFjYWNoZWRBcHBsaWNhdGlvbnMpIHtcbiAgICBjYWNoZWRBcHBsaWNhdGlvbnMgPSBzdXBlcmNsYXNzW19jYWNoZWRBcHBsaWNhdGlvbnNdID0gbmV3IE1hcCgpO1xuICB9XG5cbiAgbGV0IGFwcGxpY2F0aW9uID0gY2FjaGVkQXBwbGljYXRpb25zLmdldChtaXhpbik7XG4gIGlmICghYXBwbGljYXRpb24pIHtcbiAgICBhcHBsaWNhdGlvbiA9IG1peGluKHN1cGVyY2xhc3MpO1xuICAgIGNhY2hlZEFwcGxpY2F0aW9ucy5zZXQobWl4aW4sIGFwcGxpY2F0aW9uKTtcbiAgfVxuXG4gIHJldHVybiBhcHBsaWNhdGlvbjtcbn0pO1xuXG4vKipcbiAqIERlY29yYXRlcyBgbWl4aW5gIHNvIHRoYXQgaXQgb25seSBhcHBsaWVzIGlmIGl0J3Mgbm90IGFscmVhZHkgb24gdGhlXG4gKiBwcm90b3R5cGUgY2hhaW4uXG4gKlxuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge01peGluRnVuY3Rpb259IG1peGluIFRoZSBtaXhpbiB0byB3cmFwIHdpdGggZGVkdXBsaWNhdGlvbiBiZWhhdmlvclxuICogQHJldHVybiB7TWl4aW5GdW5jdGlvbn0gYSBuZXcgbWl4aW4gZnVuY3Rpb25cbiAqL1xuY29uc3QgRGVEdXBlID0gKG1peGluKSA9PiB3cmFwKG1peGluLCAoc3VwZXJjbGFzcykgPT5cbiAgKGhhc01peGluKHN1cGVyY2xhc3MucHJvdG90eXBlLCBtaXhpbikpXG4gICAgPyBzdXBlcmNsYXNzXG4gICAgOiBtaXhpbihzdXBlcmNsYXNzKSk7XG5cbi8qKlxuICogQWRkcyBbU3ltYm9sLmhhc0luc3RhbmNlXSAoRVMyMDE1IGN1c3RvbSBpbnN0YW5jZW9mIHN1cHBvcnQpIHRvIGBtaXhpbmAuXG4gKlxuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge01peGluRnVuY3Rpb259IG1peGluIFRoZSBtaXhpbiB0byBhZGQgW1N5bWJvbC5oYXNJbnN0YW5jZV0gdG9cbiAqIEByZXR1cm4ge01peGluRnVuY3Rpb259IHRoZSBnaXZlbiBtaXhpbiBmdW5jdGlvblxuICovXG5jb25zdCBIYXNJbnN0YW5jZSA9IChtaXhpbikgPT4ge1xuICBpZiAoU3ltYm9sICYmIFN5bWJvbC5oYXNJbnN0YW5jZSAmJiAhbWl4aW5bU3ltYm9sLmhhc0luc3RhbmNlXSkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtaXhpbiwgU3ltYm9sLmhhc0luc3RhbmNlLCB7XG4gICAgICB2YWx1ZShvKSB7XG4gICAgICAgIHJldHVybiBoYXNNaXhpbihvLCBtaXhpbik7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG4gIHJldHVybiBtaXhpbjtcbn07XG5cbi8qKlxuICogQSBiYXNpYyBtaXhpbiBkZWNvcmF0b3IgdGhhdCBhcHBsaWVzIHRoZSBtaXhpbiB3aXRoIHtAbGluayBhcHBseX0gc28gdGhhdCBpdFxuICogY2FuIGJlIHVzZWQgd2l0aCB7QGxpbmsgaXNBcHBsaWNhdGlvbk9mfSwge0BsaW5rIGhhc01peGlufSBhbmQgdGhlIG90aGVyXG4gKiBtaXhpbiBkZWNvcmF0b3IgZnVuY3Rpb25zLlxuICpcbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtNaXhpbkZ1bmN0aW9ufSBtaXhpbiBUaGUgbWl4aW4gdG8gd3JhcFxuICogQHJldHVybiB7TWl4aW5GdW5jdGlvbn0gYSBuZXcgbWl4aW4gZnVuY3Rpb25cbiAqL1xuY29uc3QgQmFyZU1peGluID0gKG1peGluKSA9PiB3cmFwKG1peGluLCAocykgPT4gYXBwbHkocywgbWl4aW4pKTtcblxuLyoqXG4gKiBEZWNvcmF0ZXMgYSBtaXhpbiBmdW5jdGlvbiB0byBhZGQgZGVkdXBsaWNhdGlvbiwgYXBwbGljYXRpb24gY2FjaGluZyBhbmRcbiAqIGluc3RhbmNlb2Ygc3VwcG9ydC5cbiAqXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7TWl4aW5GdW5jdGlvbn0gbWl4aW4gVGhlIG1peGluIHRvIHdyYXBcbiAqIEByZXR1cm4ge01peGluRnVuY3Rpb259IGEgbmV3IG1peGluIGZ1bmN0aW9uXG4gKi9cbmV4cG9ydCBjb25zdCBNaXhpbiA9IChtaXhpbikgPT4gRGVEdXBlKENhY2hlZChCYXJlTWl4aW4obWl4aW4pKSk7XG5cbi8qKlxuICogQSBmbHVlbnQgaW50ZXJmYWNlIHRvIGFwcGx5IGEgbGlzdCBvZiBtaXhpbnMgdG8gYSBzdXBlcmNsYXNzLlxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNsYXNzIFggZXh0ZW5kcyBtaXgoT2JqZWN0KS53aXRoKEEsIEIsIEMpIHt9XG4gKiBgYGBcbiAqXG4gKiBUaGUgbWl4aW5zIGFyZSBhcHBsaWVkIGluIG9yZGVyIHRvIHRoZSBzdXBlcmNsYXNzLCBzbyB0aGUgcHJvdG90eXBlIGNoYWluXG4gKiB3aWxsIGJlOiBYLT5DJy0+QictPkEnLT5PYmplY3QuXG4gKlxuICogVGhpcyBpcyBwdXJlbHkgYSBjb252ZW5pZW5jZSBmdW5jdGlvbi4gVGhlIGFib3ZlIGV4YW1wbGUgaXMgZXF1aXZhbGVudCB0bzpcbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjbGFzcyBYIGV4dGVuZHMgQyhCKEEoT2JqZWN0KSkpIHt9XG4gKiBgYGBcbiAqXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtzdXBlcmNsYXNzPU9iamVjdF1cbiAqIEByZXR1cm4ge01peGluQnVpbGRlcn1cbiAqL1xuZXhwb3J0IGNvbnN0IG1peCA9IChzdXBlcmNsYXNzKSA9PiBuZXcgTWl4aW5CdWlsZGVyKHN1cGVyY2xhc3MpO1xuXG5jbGFzcyBNaXhpbkJ1aWxkZXIge1xuXG4gIGNvbnN0cnVjdG9yKHN1cGVyY2xhc3MpIHtcbiAgICB0aGlzLnN1cGVyY2xhc3MgPSBzdXBlcmNsYXNzIHx8IGNsYXNzIHt9O1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGxpZXMgYG1peGluc2AgaW4gb3JkZXIgdG8gdGhlIHN1cGVyY2xhc3MgZ2l2ZW4gdG8gYG1peCgpYC5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheS48TWl4aW4+fSBtaXhpbnNcbiAgICogQHJldHVybiB7RnVuY3Rpb259IGEgc3ViY2xhc3Mgb2YgYHN1cGVyY2xhc3NgIHdpdGggYG1peGluc2AgYXBwbGllZFxuICAgKi9cbiAgd2l0aCguLi5taXhpbnMpIHtcbiAgICByZXR1cm4gbWl4aW5zLnJlZHVjZSgoYywgbSkgPT4gbShjKSwgdGhpcy5zdXBlcmNsYXNzKTtcbiAgfVxufVxuXG4vLyBQb2x5ZmlsbCBGb3IgSUVcbi8vIEBzZWUgaHR0cHM6Ly9qdWVqaW4uaW0vcG9zdC81ZDg4N2E5YzUxODgyNTA5NGIzNGY0MWRcbihmdW5jdGlvbigpIHtcbiAgT2JqZWN0LnNldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8ICh7X19wcm90b19fOiBbXX0gaW5zdGFuY2VvZiBBcnJheSA/IHNldFByb3RvT2YgOiBtaXhpblByb3BlcnRpZXMpO1xuXG4gIGZ1bmN0aW9uIHNldFByb3RvT2Yob2JqLCBwcm90bykge1xuICAgIG9iai5fX3Byb3RvX18gPSBwcm90bztcbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAgZnVuY3Rpb24gbWl4aW5Qcm9wZXJ0aWVzKG9iaiwgcHJvdG8pIHtcbiAgICBmb3IgKGNvbnN0IHByb3AgaW4gcHJvdG8pIHtcbiAgICAgIGlmICghb2JqLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgIG9ialtwcm9wXSA9IHByb3RvW3Byb3BdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqO1xuICB9XG59KSgpO1xuIiwiLyoqXG4gKiBQYXJ0IG9mIGVhcnRoIHByb2plY3QuXG4gKlxuICogQGNvcHlyaWdodCAgQ29weXJpZ2h0IChDKSAyMDE5ICR7T1JHQU5JWkFUSU9OfS5cbiAqIEBsaWNlbnNlICAgIF9fTElDRU5TRV9fXG4gKi9cblxuaW1wb3J0IHsgTWl4aW4gfSBmcm9tICcuL21peHdpdGguanMnO1xuXG5leHBvcnQgY29uc3QgRXZlbnRNaXhpbiA9IE1peGluKGZ1bmN0aW9uIChzdXBlcmNsYXNzKSB7XG4gIHJldHVybiBjbGFzcyBleHRlbmRzIHN1cGVyY2xhc3Mge1xuICAgIF9saXN0ZW5lcnMgPSB7fTtcblxuICAgIG9uKGV2ZW50LCBoYW5kbGVyKSB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShldmVudCkpIHtcbiAgICAgICAgZXZlbnQuZm9yRWFjaChlID0+IHRoaXMub24oZSwgaGFuZGxlcikpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX2xpc3RlbmVyc1tldmVudF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLl9saXN0ZW5lcnNbZXZlbnRdID0gW107XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2xpc3RlbmVyc1tldmVudF0ucHVzaChoYW5kbGVyKTtcblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgb25jZShldmVudCwgaGFuZGxlcikge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZXZlbnQpKSB7XG4gICAgICAgIGV2ZW50LmZvckVhY2goZSA9PiB0aGlzLm9uY2UoZSwgaGFuZGxlcikpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgaGFuZGxlci5fb25jZSA9IHRydWU7XG5cbiAgICAgIHRoaXMub24oZXZlbnQsIGhhbmRsZXIpO1xuICAgIH1cblxuICAgIG9mZihldmVudCwgY2FsbGJhY2sgPSBudWxsKSB7XG4gICAgICBpZiAoY2FsbGJhY2sgIT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5fbGlzdGVuZXJzW2V2ZW50XSA9IHRoaXMubGlzdGVuZXJzKGV2ZW50KS5maWx0ZXIoKGxpc3RlbmVyKSA9PiBsaXN0ZW5lciAhPT0gY2FsbGJhY2spO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgZGVsZXRlIHRoaXMuX2xpc3RlbmVyc1tldmVudF07XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHRyaWdnZXIoZXZlbnQsIC4uLmFyZ3MpIHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGV2ZW50KSkge1xuICAgICAgICBldmVudC5mb3JFYWNoKGUgPT4gdGhpcy50cmlnZ2VyKGUpKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubGlzdGVuZXJzKGV2ZW50KS5mb3JFYWNoKGxpc3RlbmVyID0+IHtcbiAgICAgICAgbGlzdGVuZXIoLi4uYXJncyk7XG4gICAgICB9KTtcblxuICAgICAgLy8gUmVtb3ZlIG9uY2VcbiAgICAgIHRoaXMuX2xpc3RlbmVyc1tldmVudF0gPSB0aGlzLmxpc3RlbmVycyhldmVudCkuZmlsdGVyKChsaXN0ZW5lcikgPT4gbGlzdGVuZXIuX29uY2UgIT09IHRydWUpO1xuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBsaXN0ZW5lcnMoZXZlbnQpIHtcbiAgICAgIGlmICh0eXBlb2YgZXZlbnQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgZ2V0IGxpc3RlbmVycyBldmVudCBuYW1lIHNob3VsZCBvbmx5IHVzZSBzdHJpbmcuYCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLl9saXN0ZW5lcnNbZXZlbnRdID09PSB1bmRlZmluZWQgPyBbXSA6IHRoaXMuX2xpc3RlbmVyc1tldmVudF07XG4gICAgfVxuICB9O1xufSk7XG5cbmV4cG9ydCBjbGFzcyBFdmVudEJ1cyBleHRlbmRzIEV2ZW50TWl4aW4oY2xhc3Mge30pIHt9XG4iLCIvKipcbiAqIFBhcnQgb2Ygc3RhcnRlciBwcm9qZWN0LlxuICpcbiAqIEBjb3B5cmlnaHQgIENvcHlyaWdodCAoQykgMjAyMSBfX09SR0FOSVpBVElPTl9fLlxuICogQGxpY2Vuc2UgICAgX19MSUNFTlNFX19cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVbmljb3JuVmFsaWRhdGlvbiB7XG4gIHN0YXRpYyBpbnN0YWxsKGFwcCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgYXBwLmZvcm1WYWxpZGF0aW9uID0gKHNlbGVjdG9yID0gJ3VuaS1mb3JtLXZhbGlkYXRlJykgPT4ge1xuICAgICAgYXBwLmltcG9ydCgnQHVuaWNvcm4vdWkvdmFsaWRhdGlvbi1jb21wb25lbnRzLmpzJyk7XG5cbiAgICAgIHJldHVybiBhcHAuc2VsZWN0T25lKHNlbGVjdG9yKTtcbiAgICB9O1xuICB9XG59XG5cblxuIiwiLyoqXG4gKiBQYXJ0IG9mIHN0YXJ0ZXIgcHJvamVjdC5cbiAqXG4gKiBAY29weXJpZ2h0ICBDb3B5cmlnaHQgKEMpIDIwMjEgX19PUkdBTklaQVRJT05fXy5cbiAqIEBsaWNlbnNlICAgIF9fTElDRU5TRV9fXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVW5pY29yblVJIHtcbiAgdGhlbWU7XG5cbiAgc3RhdGljIGdldCBpcygpIHsgcmV0dXJuICd1aSc7IH1cblxuICBzdGF0aWMgaW5zdGFsbChhcHAsIG9wdGlvbnMgPSB7fSkge1xuICAgIC8vIERpc2FibGUgQWxwaW5lIGF1dG8gbG9hZC5cbiAgICB3aW5kb3cuZGVmZXJMb2FkaW5nQWxwaW5lID0gKCkgPT4ge307XG5cbiAgICBjb25zdCB1aSA9IGFwcC4kdWkgPSBuZXcgdGhpcyhhcHApO1xuICAgIGFwcC5hZGRNZXNzYWdlID0gdWkucmVuZGVyTWVzc2FnZTtcblxuICAgIGFwcC5sb2FkQWxwaW5lID0gdWkubG9hZEFscGluZS5iaW5kKHVpKTtcbiAgICBhcHAubG9hZFNwcnVjZSA9IHVpLmxvYWRTcHJ1Y2UuYmluZCh1aSk7XG4gICAgYXBwLmluaXRBbHBpbmUgPSB1aS5pbml0QWxwaW5lLmJpbmQodWkpO1xuICAgIGFwcC5zdGFydEFscGluZSA9IHVpLnN0YXJ0QWxwaW5lLmJpbmQodWkpO1xuICAgIGFwcC5zdGFydEFscGluZVNwcnVjZSA9IHVpLnN0YXJ0QWxwaW5lU3BydWNlLmJpbmQodWkpO1xuICAgIGFwcC5pbml0QWxwaW5lU3BydWNlID0gdWkuaW5pdEFscGluZVNwcnVjZS5iaW5kKHVpKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXQgZGVmYXVsdE9wdGlvbnMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1lc3NhZ2VTZWxlY3RvcjogJy5tZXNzYWdlLXdyYXAnLFxuICAgIH07XG4gIH1cblxuICBpbnN0YWxsVGhlbWUodGhlbWUpIHtcbiAgICB0aGlzLnRoZW1lID0gdGhlbWU7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihhcHApIHtcbiAgICB0aGlzLmFwcCA9IGFwcDtcbiAgICB0aGlzLmFsaXZlSGFuZGxlID0gbnVsbDtcbiAgfVxuXG4gIHJlbmRlck1lc3NhZ2UobWVzc2FnZXMsIHR5cGUgPSAnaW5mbycpIHtcbiAgICAvL1xuICB9XG5cbiAgbG9hZEFscGluZSgpIHtcbiAgICByZXR1cm4gdGhpcy5hcHAuaW1wb3J0KCdAYWxwaW5lanMnKTtcbiAgfVxuXG4gIGxvYWRTcHJ1Y2UoKSB7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKFtcbiAgICAgIHRoaXMubG9hZEFscGluZSgpLFxuICAgICAgdGhpcy5hcHAuaW1wb3J0KCdAc3BydWNlJylcbiAgICBdKTtcbiAgfVxuXG4gIGluaXRBbHBpbmUoc2VsZWN0b3IpIHtcbiAgICByZXR1cm4gdGhpcy5sb2FkQWxwaW5lKCkudGhlbigoKSA9PiB7XG4gICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5hcHAuc2VsZWN0T25lKHNlbGVjdG9yKTtcbiAgICAgIEFscGluZS5pbml0aWFsaXplQ29tcG9uZW50KGVsZW1lbnQpO1xuICAgIH0pO1xuICB9XG5cbiAgc3RhcnRBbHBpbmUoKSB7XG4gICAgcmV0dXJuIHRoaXMubG9hZEFscGluZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgaWYgKFNwcnVjZSkge1xuICAgICAgICBTcHJ1Y2Uuc3RhcnQoKTtcbiAgICAgIH1cblxuICAgICAgQWxwaW5lLnN0YXJ0KCk7XG4gICAgfSk7XG4gIH1cblxuICBzdGFydEFscGluZVNwcnVjZSgpIHtcbiAgICByZXR1cm4gdGhpcy5sb2FkU3BydWNlKCkudGhlbigoKSA9PiB7XG4gICAgICBBbHBpbmUuc3RhcnQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGluaXRBbHBpbmVTcHJ1Y2Uoc2VsZWN0b3IpIHtcbiAgICByZXR1cm4gdGhpcy5sb2FkU3BydWNlKCkudGhlbigoKSA9PiB7XG4gICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5hcHAuc2VsZWN0T25lKHNlbGVjdG9yKTtcbiAgICAgIEFscGluZS5pbml0aWFsaXplQ29tcG9uZW50KGVsZW1lbnQpO1xuICAgIH0pO1xuICB9XG5cbiAgZmxhdHBpY2tyKCkge1xuICAgIHJldHVybiB0aGlzLmFwcC5pbXBvcnQoJ0B1bmljb3JuL3VpL2ZsYXRwaWNrci1jb21wb25lbnRzLmpzJyk7XG4gIH1cblxuICBsaXN0RGVwZW5kZW50KCkge1xuICAgIHJldHVybiB0aGlzLmFwcC5pbXBvcnQoJ0B1bmljb3JuL3VpL2xpc3QtZGVwZW5kZW50LmpzJyk7XG4gIH1cbn1cbiIsIi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsICYmIGdsb2JhbC5PYmplY3QgPT09IE9iamVjdCAmJiBnbG9iYWw7XG5cbmV4cG9ydCBkZWZhdWx0IGZyZWVHbG9iYWw7XG4iLCJpbXBvcnQgZnJlZUdsb2JhbCBmcm9tICcuL19mcmVlR2xvYmFsLmpzJztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBzZWxmYC4gKi9cbnZhciBmcmVlU2VsZiA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYgJiYgc2VsZi5PYmplY3QgPT09IE9iamVjdCAmJiBzZWxmO1xuXG4vKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbnZhciByb290ID0gZnJlZUdsb2JhbCB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG5leHBvcnQgZGVmYXVsdCByb290O1xuIiwiaW1wb3J0IHJvb3QgZnJvbSAnLi9fcm9vdC5qcyc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIFN5bWJvbCA9IHJvb3QuU3ltYm9sO1xuXG5leHBvcnQgZGVmYXVsdCBTeW1ib2w7XG4iLCJpbXBvcnQgU3ltYm9sIGZyb20gJy4vX1N5bWJvbC5qcyc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBuYXRpdmVPYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1Ub1N0cmluZ1RhZyA9IFN5bWJvbCA/IFN5bWJvbC50b1N0cmluZ1RhZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VHZXRUYWdgIHdoaWNoIGlnbm9yZXMgYFN5bWJvbC50b1N0cmluZ1RhZ2AgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHJhdyBgdG9TdHJpbmdUYWdgLlxuICovXG5mdW5jdGlvbiBnZXRSYXdUYWcodmFsdWUpIHtcbiAgdmFyIGlzT3duID0gaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgc3ltVG9TdHJpbmdUYWcpLFxuICAgICAgdGFnID0gdmFsdWVbc3ltVG9TdHJpbmdUYWddO1xuXG4gIHRyeSB7XG4gICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdW5kZWZpbmVkO1xuICAgIHZhciB1bm1hc2tlZCA9IHRydWU7XG4gIH0gY2F0Y2ggKGUpIHt9XG5cbiAgdmFyIHJlc3VsdCA9IG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICBpZiAodW5tYXNrZWQpIHtcbiAgICBpZiAoaXNPd24pIHtcbiAgICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHRhZztcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0UmF3VGFnO1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyB1c2luZyBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG9iamVjdFRvU3RyaW5nO1xuIiwiaW1wb3J0IFN5bWJvbCBmcm9tICcuL19TeW1ib2wuanMnO1xuaW1wb3J0IGdldFJhd1RhZyBmcm9tICcuL19nZXRSYXdUYWcuanMnO1xuaW1wb3J0IG9iamVjdFRvU3RyaW5nIGZyb20gJy4vX29iamVjdFRvU3RyaW5nLmpzJztcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG51bGxUYWcgPSAnW29iamVjdCBOdWxsXScsXG4gICAgdW5kZWZpbmVkVGFnID0gJ1tvYmplY3QgVW5kZWZpbmVkXSc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHN5bVRvU3RyaW5nVGFnID0gU3ltYm9sID8gU3ltYm9sLnRvU3RyaW5nVGFnIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBnZXRUYWdgIHdpdGhvdXQgZmFsbGJhY2tzIGZvciBidWdneSBlbnZpcm9ubWVudHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUdldFRhZyh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkVGFnIDogbnVsbFRhZztcbiAgfVxuICByZXR1cm4gKHN5bVRvU3RyaW5nVGFnICYmIHN5bVRvU3RyaW5nVGFnIGluIE9iamVjdCh2YWx1ZSkpXG4gICAgPyBnZXRSYXdUYWcodmFsdWUpXG4gICAgOiBvYmplY3RUb1N0cmluZyh2YWx1ZSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGJhc2VHZXRUYWc7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLiBBIHZhbHVlIGlzIG9iamVjdC1saWtlIGlmIGl0J3Mgbm90IGBudWxsYFxuICogYW5kIGhhcyBhIGB0eXBlb2ZgIHJlc3VsdCBvZiBcIm9iamVjdFwiLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxuZXhwb3J0IGRlZmF1bHQgaXNPYmplY3RMaWtlO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGFuIGBBcnJheWAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG5cbmV4cG9ydCBkZWZhdWx0IGlzQXJyYXk7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZVxuICogW2xhbmd1YWdlIHR5cGVdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzKVxuICogb2YgYE9iamVjdGAuIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChfLm5vb3ApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaXNPYmplY3Q7XG4iLCIvKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgdGhlIGZpcnN0IGFyZ3VtZW50IGl0IHJlY2VpdmVzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcGFyYW0geyp9IHZhbHVlIEFueSB2YWx1ZS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIGB2YWx1ZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSB9O1xuICpcbiAqIGNvbnNvbGUubG9nKF8uaWRlbnRpdHkob2JqZWN0KSA9PT0gb2JqZWN0KTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gaWRlbnRpdHkodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpZGVudGl0eTtcbiIsImltcG9ydCBiYXNlR2V0VGFnIGZyb20gJy4vX2Jhc2VHZXRUYWcuanMnO1xuaW1wb3J0IGlzT2JqZWN0IGZyb20gJy4vaXNPYmplY3QuanMnO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXN5bmNUYWcgPSAnW29iamVjdCBBc3luY0Z1bmN0aW9uXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgZ2VuVGFnID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJyxcbiAgICBwcm94eVRhZyA9ICdbb2JqZWN0IFByb3h5XSc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBGdW5jdGlvbmAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgZnVuY3Rpb24sIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0Z1bmN0aW9uKF8pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNGdW5jdGlvbigvYWJjLyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vIFRoZSB1c2Ugb2YgYE9iamVjdCN0b1N0cmluZ2AgYXZvaWRzIGlzc3VlcyB3aXRoIHRoZSBgdHlwZW9mYCBvcGVyYXRvclxuICAvLyBpbiBTYWZhcmkgOSB3aGljaCByZXR1cm5zICdvYmplY3QnIGZvciB0eXBlZCBhcnJheXMgYW5kIG90aGVyIGNvbnN0cnVjdG9ycy5cbiAgdmFyIHRhZyA9IGJhc2VHZXRUYWcodmFsdWUpO1xuICByZXR1cm4gdGFnID09IGZ1bmNUYWcgfHwgdGFnID09IGdlblRhZyB8fCB0YWcgPT0gYXN5bmNUYWcgfHwgdGFnID09IHByb3h5VGFnO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpc0Z1bmN0aW9uO1xuIiwiaW1wb3J0IHJvb3QgZnJvbSAnLi9fcm9vdC5qcyc7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBvdmVycmVhY2hpbmcgY29yZS1qcyBzaGltcy4gKi9cbnZhciBjb3JlSnNEYXRhID0gcm9vdFsnX19jb3JlLWpzX3NoYXJlZF9fJ107XG5cbmV4cG9ydCBkZWZhdWx0IGNvcmVKc0RhdGE7XG4iLCJpbXBvcnQgY29yZUpzRGF0YSBmcm9tICcuL19jb3JlSnNEYXRhLmpzJztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG1ldGhvZHMgbWFzcXVlcmFkaW5nIGFzIG5hdGl2ZS4gKi9cbnZhciBtYXNrU3JjS2V5ID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgdWlkID0gL1teLl0rJC8uZXhlYyhjb3JlSnNEYXRhICYmIGNvcmVKc0RhdGEua2V5cyAmJiBjb3JlSnNEYXRhLmtleXMuSUVfUFJPVE8gfHwgJycpO1xuICByZXR1cm4gdWlkID8gKCdTeW1ib2woc3JjKV8xLicgKyB1aWQpIDogJyc7XG59KCkpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgZnVuY2AgaGFzIGl0cyBzb3VyY2UgbWFza2VkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgZnVuY2AgaXMgbWFza2VkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzTWFza2VkKGZ1bmMpIHtcbiAgcmV0dXJuICEhbWFza1NyY0tleSAmJiAobWFza1NyY0tleSBpbiBmdW5jKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaXNNYXNrZWQ7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byByZXNvbHZlIHRoZSBkZWNvbXBpbGVkIHNvdXJjZSBvZiBmdW5jdGlvbnMuICovXG52YXIgZnVuY1RvU3RyaW5nID0gZnVuY1Byb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENvbnZlcnRzIGBmdW5jYCB0byBpdHMgc291cmNlIGNvZGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBzb3VyY2UgY29kZS5cbiAqL1xuZnVuY3Rpb24gdG9Tb3VyY2UoZnVuYykge1xuICBpZiAoZnVuYyAhPSBudWxsKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBmdW5jVG9TdHJpbmcuY2FsbChmdW5jKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gKGZ1bmMgKyAnJyk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHRvU291cmNlO1xuIiwiaW1wb3J0IGlzRnVuY3Rpb24gZnJvbSAnLi9pc0Z1bmN0aW9uLmpzJztcbmltcG9ydCBpc01hc2tlZCBmcm9tICcuL19pc01hc2tlZC5qcyc7XG5pbXBvcnQgaXNPYmplY3QgZnJvbSAnLi9pc09iamVjdC5qcyc7XG5pbXBvcnQgdG9Tb3VyY2UgZnJvbSAnLi9fdG9Tb3VyY2UuanMnO1xuXG4vKipcbiAqIFVzZWQgdG8gbWF0Y2ggYFJlZ0V4cGBcbiAqIFtzeW50YXggY2hhcmFjdGVyc10oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtcGF0dGVybnMpLlxuICovXG52YXIgcmVSZWdFeHBDaGFyID0gL1tcXFxcXiQuKis/KClbXFxde318XS9nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaG9zdCBjb25zdHJ1Y3RvcnMgKFNhZmFyaSkuICovXG52YXIgcmVJc0hvc3RDdG9yID0gL15cXFtvYmplY3QgLis/Q29uc3RydWN0b3JcXF0kLztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGZ1bmNQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZSxcbiAgICBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmdW5jVG9TdHJpbmcgPSBmdW5jUHJvdG8udG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBpZiBhIG1ldGhvZCBpcyBuYXRpdmUuICovXG52YXIgcmVJc05hdGl2ZSA9IFJlZ0V4cCgnXicgK1xuICBmdW5jVG9TdHJpbmcuY2FsbChoYXNPd25Qcm9wZXJ0eSkucmVwbGFjZShyZVJlZ0V4cENoYXIsICdcXFxcJCYnKVxuICAucmVwbGFjZSgvaGFzT3duUHJvcGVydHl8KGZ1bmN0aW9uKS4qPyg/PVxcXFxcXCgpfCBmb3IgLis/KD89XFxcXFxcXSkvZywgJyQxLio/JykgKyAnJCdcbik7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNOYXRpdmVgIHdpdGhvdXQgYmFkIHNoaW0gY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgbmF0aXZlIGZ1bmN0aW9uLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzTmF0aXZlKHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3QodmFsdWUpIHx8IGlzTWFza2VkKHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgcGF0dGVybiA9IGlzRnVuY3Rpb24odmFsdWUpID8gcmVJc05hdGl2ZSA6IHJlSXNIb3N0Q3RvcjtcbiAgcmV0dXJuIHBhdHRlcm4udGVzdCh0b1NvdXJjZSh2YWx1ZSkpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBiYXNlSXNOYXRpdmU7XG4iLCIvKipcbiAqIEdldHMgdGhlIHZhbHVlIGF0IGBrZXlgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHByb3BlcnR5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBnZXRWYWx1ZShvYmplY3QsIGtleSkge1xuICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3Rba2V5XTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0VmFsdWU7XG4iLCJpbXBvcnQgYmFzZUlzTmF0aXZlIGZyb20gJy4vX2Jhc2VJc05hdGl2ZS5qcyc7XG5pbXBvcnQgZ2V0VmFsdWUgZnJvbSAnLi9fZ2V0VmFsdWUuanMnO1xuXG4vKipcbiAqIEdldHMgdGhlIG5hdGl2ZSBmdW5jdGlvbiBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBtZXRob2QgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGZ1bmN0aW9uIGlmIGl0J3MgbmF0aXZlLCBlbHNlIGB1bmRlZmluZWRgLlxuICovXG5mdW5jdGlvbiBnZXROYXRpdmUob2JqZWN0LCBrZXkpIHtcbiAgdmFyIHZhbHVlID0gZ2V0VmFsdWUob2JqZWN0LCBrZXkpO1xuICByZXR1cm4gYmFzZUlzTmF0aXZlKHZhbHVlKSA/IHZhbHVlIDogdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXROYXRpdmU7XG4iLCJpbXBvcnQgaXNPYmplY3QgZnJvbSAnLi9pc09iamVjdC5qcyc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdENyZWF0ZSA9IE9iamVjdC5jcmVhdGU7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uY3JlYXRlYCB3aXRob3V0IHN1cHBvcnQgZm9yIGFzc2lnbmluZ1xuICogcHJvcGVydGllcyB0byB0aGUgY3JlYXRlZCBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBwcm90byBUaGUgb2JqZWN0IHRvIGluaGVyaXQgZnJvbS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5ldyBvYmplY3QuXG4gKi9cbnZhciBiYXNlQ3JlYXRlID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBvYmplY3QoKSB7fVxuICByZXR1cm4gZnVuY3Rpb24ocHJvdG8pIHtcbiAgICBpZiAoIWlzT2JqZWN0KHByb3RvKSkge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgICBpZiAob2JqZWN0Q3JlYXRlKSB7XG4gICAgICByZXR1cm4gb2JqZWN0Q3JlYXRlKHByb3RvKTtcbiAgICB9XG4gICAgb2JqZWN0LnByb3RvdHlwZSA9IHByb3RvO1xuICAgIHZhciByZXN1bHQgPSBuZXcgb2JqZWN0O1xuICAgIG9iamVjdC5wcm90b3R5cGUgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn0oKSk7XG5cbmV4cG9ydCBkZWZhdWx0IGJhc2VDcmVhdGU7XG4iLCIvKipcbiAqIEEgZmFzdGVyIGFsdGVybmF0aXZlIHRvIGBGdW5jdGlvbiNhcHBseWAsIHRoaXMgZnVuY3Rpb24gaW52b2tlcyBgZnVuY2BcbiAqIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIGB0aGlzQXJnYCBhbmQgdGhlIGFyZ3VtZW50cyBvZiBgYXJnc2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGludm9rZS5cbiAqIEBwYXJhbSB7Kn0gdGhpc0FyZyBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGZ1bmNgLlxuICogQHBhcmFtIHtBcnJheX0gYXJncyBUaGUgYXJndW1lbnRzIHRvIGludm9rZSBgZnVuY2Agd2l0aC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSByZXN1bHQgb2YgYGZ1bmNgLlxuICovXG5mdW5jdGlvbiBhcHBseShmdW5jLCB0aGlzQXJnLCBhcmdzKSB7XG4gIHN3aXRjaCAoYXJncy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZyk7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIGFyZ3NbMF0pO1xuICAgIGNhc2UgMjogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG4gIH1cbiAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFwcGx5O1xuIiwiLyoqXG4gKiBDb3BpZXMgdGhlIHZhbHVlcyBvZiBgc291cmNlYCB0byBgYXJyYXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBzb3VyY2UgVGhlIGFycmF5IHRvIGNvcHkgdmFsdWVzIGZyb20uXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXk9W11dIFRoZSBhcnJheSB0byBjb3B5IHZhbHVlcyB0by5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBjb3B5QXJyYXkoc291cmNlLCBhcnJheSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHNvdXJjZS5sZW5ndGg7XG5cbiAgYXJyYXkgfHwgKGFycmF5ID0gQXJyYXkobGVuZ3RoKSk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgYXJyYXlbaW5kZXhdID0gc291cmNlW2luZGV4XTtcbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvcHlBcnJheTtcbiIsIi8qKiBVc2VkIHRvIGRldGVjdCBob3QgZnVuY3Rpb25zIGJ5IG51bWJlciBvZiBjYWxscyB3aXRoaW4gYSBzcGFuIG9mIG1pbGxpc2Vjb25kcy4gKi9cbnZhciBIT1RfQ09VTlQgPSA4MDAsXG4gICAgSE9UX1NQQU4gPSAxNjtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU5vdyA9IERhdGUubm93O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0J2xsIHNob3J0IG91dCBhbmQgaW52b2tlIGBpZGVudGl0eWAgaW5zdGVhZFxuICogb2YgYGZ1bmNgIHdoZW4gaXQncyBjYWxsZWQgYEhPVF9DT1VOVGAgb3IgbW9yZSB0aW1lcyBpbiBgSE9UX1NQQU5gXG4gKiBtaWxsaXNlY29uZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHJlc3RyaWN0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgc2hvcnRhYmxlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBzaG9ydE91dChmdW5jKSB7XG4gIHZhciBjb3VudCA9IDAsXG4gICAgICBsYXN0Q2FsbGVkID0gMDtcblxuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN0YW1wID0gbmF0aXZlTm93KCksXG4gICAgICAgIHJlbWFpbmluZyA9IEhPVF9TUEFOIC0gKHN0YW1wIC0gbGFzdENhbGxlZCk7XG5cbiAgICBsYXN0Q2FsbGVkID0gc3RhbXA7XG4gICAgaWYgKHJlbWFpbmluZyA+IDApIHtcbiAgICAgIGlmICgrK2NvdW50ID49IEhPVF9DT1VOVCkge1xuICAgICAgICByZXR1cm4gYXJndW1lbnRzWzBdO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb3VudCA9IDA7XG4gICAgfVxuICAgIHJldHVybiBmdW5jLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgc2hvcnRPdXQ7XG4iLCIvKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYHZhbHVlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDIuNC4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcmV0dXJuIGZyb20gdGhlIG5ldyBmdW5jdGlvbi5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGNvbnN0YW50IGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0cyA9IF8udGltZXMoMiwgXy5jb25zdGFudCh7ICdhJzogMSB9KSk7XG4gKlxuICogY29uc29sZS5sb2cob2JqZWN0cyk7XG4gKiAvLyA9PiBbeyAnYSc6IDEgfSwgeyAnYSc6IDEgfV1cbiAqXG4gKiBjb25zb2xlLmxvZyhvYmplY3RzWzBdID09PSBvYmplY3RzWzFdKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gY29uc3RhbnQodmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY29uc3RhbnQ7XG4iLCJpbXBvcnQgZ2V0TmF0aXZlIGZyb20gJy4vX2dldE5hdGl2ZS5qcyc7XG5cbnZhciBkZWZpbmVQcm9wZXJ0eSA9IChmdW5jdGlvbigpIHtcbiAgdHJ5IHtcbiAgICB2YXIgZnVuYyA9IGdldE5hdGl2ZShPYmplY3QsICdkZWZpbmVQcm9wZXJ0eScpO1xuICAgIGZ1bmMoe30sICcnLCB7fSk7XG4gICAgcmV0dXJuIGZ1bmM7XG4gIH0gY2F0Y2ggKGUpIHt9XG59KCkpO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVQcm9wZXJ0eTtcbiIsImltcG9ydCBjb25zdGFudCBmcm9tICcuL2NvbnN0YW50LmpzJztcbmltcG9ydCBkZWZpbmVQcm9wZXJ0eSBmcm9tICcuL19kZWZpbmVQcm9wZXJ0eS5qcyc7XG5pbXBvcnQgaWRlbnRpdHkgZnJvbSAnLi9pZGVudGl0eS5qcyc7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYHNldFRvU3RyaW5nYCB3aXRob3V0IHN1cHBvcnQgZm9yIGhvdCBsb29wIHNob3J0aW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdHJpbmcgVGhlIGB0b1N0cmluZ2AgcmVzdWx0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIGBmdW5jYC5cbiAqL1xudmFyIGJhc2VTZXRUb1N0cmluZyA9ICFkZWZpbmVQcm9wZXJ0eSA/IGlkZW50aXR5IDogZnVuY3Rpb24oZnVuYywgc3RyaW5nKSB7XG4gIHJldHVybiBkZWZpbmVQcm9wZXJ0eShmdW5jLCAndG9TdHJpbmcnLCB7XG4gICAgJ2NvbmZpZ3VyYWJsZSc6IHRydWUsXG4gICAgJ2VudW1lcmFibGUnOiBmYWxzZSxcbiAgICAndmFsdWUnOiBjb25zdGFudChzdHJpbmcpLFxuICAgICd3cml0YWJsZSc6IHRydWVcbiAgfSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBiYXNlU2V0VG9TdHJpbmc7XG4iLCJpbXBvcnQgYmFzZVNldFRvU3RyaW5nIGZyb20gJy4vX2Jhc2VTZXRUb1N0cmluZy5qcyc7XG5pbXBvcnQgc2hvcnRPdXQgZnJvbSAnLi9fc2hvcnRPdXQuanMnO1xuXG4vKipcbiAqIFNldHMgdGhlIGB0b1N0cmluZ2AgbWV0aG9kIG9mIGBmdW5jYCB0byByZXR1cm4gYHN0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHN0cmluZyBUaGUgYHRvU3RyaW5nYCByZXN1bHQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgYGZ1bmNgLlxuICovXG52YXIgc2V0VG9TdHJpbmcgPSBzaG9ydE91dChiYXNlU2V0VG9TdHJpbmcpO1xuXG5leHBvcnQgZGVmYXVsdCBzZXRUb1N0cmluZztcbiIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmZvckVhY2hgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvclxuICogaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5XSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBhcnJheUVhY2goYXJyYXksIGl0ZXJhdGVlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBpZiAoaXRlcmF0ZWUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpID09PSBmYWxzZSkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXJyYXlFYWNoO1xuIiwiLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCB1bnNpZ25lZCBpbnRlZ2VyIHZhbHVlcy4gKi9cbnZhciByZUlzVWludCA9IC9eKD86MHxbMS05XVxcZCopJC87XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGluZGV4LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbGVuZ3RoPU1BWF9TQUZFX0lOVEVHRVJdIFRoZSB1cHBlciBib3VuZHMgb2YgYSB2YWxpZCBpbmRleC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgaW5kZXgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJbmRleCh2YWx1ZSwgbGVuZ3RoKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICBsZW5ndGggPSBsZW5ndGggPT0gbnVsbCA/IE1BWF9TQUZFX0lOVEVHRVIgOiBsZW5ndGg7XG5cbiAgcmV0dXJuICEhbGVuZ3RoICYmXG4gICAgKHR5cGUgPT0gJ251bWJlcicgfHxcbiAgICAgICh0eXBlICE9ICdzeW1ib2wnICYmIHJlSXNVaW50LnRlc3QodmFsdWUpKSkgJiZcbiAgICAgICAgKHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPCBsZW5ndGgpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpc0luZGV4O1xuIiwiaW1wb3J0IGRlZmluZVByb3BlcnR5IGZyb20gJy4vX2RlZmluZVByb3BlcnR5LmpzJztcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgYXNzaWduVmFsdWVgIGFuZCBgYXNzaWduTWVyZ2VWYWx1ZWAgd2l0aG91dFxuICogdmFsdWUgY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBhc3NpZ24uXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBhc3NpZ24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VBc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgaWYgKGtleSA9PSAnX19wcm90b19fJyAmJiBkZWZpbmVQcm9wZXJ0eSkge1xuICAgIGRlZmluZVByb3BlcnR5KG9iamVjdCwga2V5LCB7XG4gICAgICAnY29uZmlndXJhYmxlJzogdHJ1ZSxcbiAgICAgICdlbnVtZXJhYmxlJzogdHJ1ZSxcbiAgICAgICd2YWx1ZSc6IHZhbHVlLFxuICAgICAgJ3dyaXRhYmxlJzogdHJ1ZVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgYmFzZUFzc2lnblZhbHVlO1xuIiwiLyoqXG4gKiBQZXJmb3JtcyBhXG4gKiBbYFNhbWVWYWx1ZVplcm9gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1zYW1ldmFsdWV6ZXJvKVxuICogY29tcGFyaXNvbiBiZXR3ZWVuIHR3byB2YWx1ZXMgdG8gZGV0ZXJtaW5lIGlmIHRoZXkgYXJlIGVxdWl2YWxlbnQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0geyp9IG90aGVyIFRoZSBvdGhlciB2YWx1ZSB0byBjb21wYXJlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxIH07XG4gKiB2YXIgb3RoZXIgPSB7ICdhJzogMSB9O1xuICpcbiAqIF8uZXEob2JqZWN0LCBvYmplY3QpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uZXEob2JqZWN0LCBvdGhlcik7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uZXEoJ2EnLCAnYScpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uZXEoJ2EnLCBPYmplY3QoJ2EnKSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uZXEoTmFOLCBOYU4pO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBlcSh2YWx1ZSwgb3RoZXIpIHtcbiAgcmV0dXJuIHZhbHVlID09PSBvdGhlciB8fCAodmFsdWUgIT09IHZhbHVlICYmIG90aGVyICE9PSBvdGhlcik7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGVxO1xuIiwiaW1wb3J0IGJhc2VBc3NpZ25WYWx1ZSBmcm9tICcuL19iYXNlQXNzaWduVmFsdWUuanMnO1xuaW1wb3J0IGVxIGZyb20gJy4vZXEuanMnO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEFzc2lnbnMgYHZhbHVlYCB0byBga2V5YCBvZiBgb2JqZWN0YCBpZiB0aGUgZXhpc3RpbmcgdmFsdWUgaXMgbm90IGVxdWl2YWxlbnRcbiAqIHVzaW5nIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG4gKiBmb3IgZXF1YWxpdHkgY29tcGFyaXNvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGFzc2lnbi5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGFzc2lnbi5cbiAqL1xuZnVuY3Rpb24gYXNzaWduVmFsdWUob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIHZhciBvYmpWYWx1ZSA9IG9iamVjdFtrZXldO1xuICBpZiAoIShoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSAmJiBlcShvYmpWYWx1ZSwgdmFsdWUpKSB8fFxuICAgICAgKHZhbHVlID09PSB1bmRlZmluZWQgJiYgIShrZXkgaW4gb2JqZWN0KSkpIHtcbiAgICBiYXNlQXNzaWduVmFsdWUob2JqZWN0LCBrZXksIHZhbHVlKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBhc3NpZ25WYWx1ZTtcbiIsImltcG9ydCBhc3NpZ25WYWx1ZSBmcm9tICcuL19hc3NpZ25WYWx1ZS5qcyc7XG5pbXBvcnQgYmFzZUFzc2lnblZhbHVlIGZyb20gJy4vX2Jhc2VBc3NpZ25WYWx1ZS5qcyc7XG5cbi8qKlxuICogQ29waWVzIHByb3BlcnRpZXMgb2YgYHNvdXJjZWAgdG8gYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgZnJvbS5cbiAqIEBwYXJhbSB7QXJyYXl9IHByb3BzIFRoZSBwcm9wZXJ0eSBpZGVudGlmaWVycyB0byBjb3B5LlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3Q9e31dIFRoZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIHRvLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29waWVkIHZhbHVlcy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGNvcHlPYmplY3Qoc291cmNlLCBwcm9wcywgb2JqZWN0LCBjdXN0b21pemVyKSB7XG4gIHZhciBpc05ldyA9ICFvYmplY3Q7XG4gIG9iamVjdCB8fCAob2JqZWN0ID0ge30pO1xuXG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGtleSA9IHByb3BzW2luZGV4XTtcblxuICAgIHZhciBuZXdWYWx1ZSA9IGN1c3RvbWl6ZXJcbiAgICAgID8gY3VzdG9taXplcihvYmplY3Rba2V5XSwgc291cmNlW2tleV0sIGtleSwgb2JqZWN0LCBzb3VyY2UpXG4gICAgICA6IHVuZGVmaW5lZDtcblxuICAgIGlmIChuZXdWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBuZXdWYWx1ZSA9IHNvdXJjZVtrZXldO1xuICAgIH1cbiAgICBpZiAoaXNOZXcpIHtcbiAgICAgIGJhc2VBc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgbmV3VmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgbmV3VmFsdWUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gb2JqZWN0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjb3B5T2JqZWN0O1xuIiwiaW1wb3J0IGFwcGx5IGZyb20gJy4vX2FwcGx5LmpzJztcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU1heCA9IE1hdGgubWF4O1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZVJlc3RgIHdoaWNoIHRyYW5zZm9ybXMgdGhlIHJlc3QgYXJyYXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGFwcGx5IGEgcmVzdCBwYXJhbWV0ZXIgdG8uXG4gKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0PWZ1bmMubGVuZ3RoLTFdIFRoZSBzdGFydCBwb3NpdGlvbiBvZiB0aGUgcmVzdCBwYXJhbWV0ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSB0cmFuc2Zvcm0gVGhlIHJlc3QgYXJyYXkgdHJhbnNmb3JtLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIG92ZXJSZXN0KGZ1bmMsIHN0YXJ0LCB0cmFuc2Zvcm0pIHtcbiAgc3RhcnQgPSBuYXRpdmVNYXgoc3RhcnQgPT09IHVuZGVmaW5lZCA/IChmdW5jLmxlbmd0aCAtIDEpIDogc3RhcnQsIDApO1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICAgIGluZGV4ID0gLTEsXG4gICAgICAgIGxlbmd0aCA9IG5hdGl2ZU1heChhcmdzLmxlbmd0aCAtIHN0YXJ0LCAwKSxcbiAgICAgICAgYXJyYXkgPSBBcnJheShsZW5ndGgpO1xuXG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIGFycmF5W2luZGV4XSA9IGFyZ3Nbc3RhcnQgKyBpbmRleF07XG4gICAgfVxuICAgIGluZGV4ID0gLTE7XG4gICAgdmFyIG90aGVyQXJncyA9IEFycmF5KHN0YXJ0ICsgMSk7XG4gICAgd2hpbGUgKCsraW5kZXggPCBzdGFydCkge1xuICAgICAgb3RoZXJBcmdzW2luZGV4XSA9IGFyZ3NbaW5kZXhdO1xuICAgIH1cbiAgICBvdGhlckFyZ3Nbc3RhcnRdID0gdHJhbnNmb3JtKGFycmF5KTtcbiAgICByZXR1cm4gYXBwbHkoZnVuYywgdGhpcywgb3RoZXJBcmdzKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgb3ZlclJlc3Q7XG4iLCJpbXBvcnQgaWRlbnRpdHkgZnJvbSAnLi9pZGVudGl0eS5qcyc7XG5pbXBvcnQgb3ZlclJlc3QgZnJvbSAnLi9fb3ZlclJlc3QuanMnO1xuaW1wb3J0IHNldFRvU3RyaW5nIGZyb20gJy4vX3NldFRvU3RyaW5nLmpzJztcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5yZXN0YCB3aGljaCBkb2Vzbid0IHZhbGlkYXRlIG9yIGNvZXJjZSBhcmd1bWVudHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGFwcGx5IGEgcmVzdCBwYXJhbWV0ZXIgdG8uXG4gKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0PWZ1bmMubGVuZ3RoLTFdIFRoZSBzdGFydCBwb3NpdGlvbiBvZiB0aGUgcmVzdCBwYXJhbWV0ZXIuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVJlc3QoZnVuYywgc3RhcnQpIHtcbiAgcmV0dXJuIHNldFRvU3RyaW5nKG92ZXJSZXN0KGZ1bmMsIHN0YXJ0LCBpZGVudGl0eSksIGZ1bmMgKyAnJyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGJhc2VSZXN0O1xuIiwiLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGxlbmd0aC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgbG9vc2VseSBiYXNlZCBvblxuICogW2BUb0xlbmd0aGBdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXRvbGVuZ3RoKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGxlbmd0aCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzTGVuZ3RoKDMpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNMZW5ndGgoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNMZW5ndGgoSW5maW5pdHkpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKCczJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0xlbmd0aCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInICYmXG4gICAgdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpc0xlbmd0aDtcbiIsImltcG9ydCBpc0Z1bmN0aW9uIGZyb20gJy4vaXNGdW5jdGlvbi5qcyc7XG5pbXBvcnQgaXNMZW5ndGggZnJvbSAnLi9pc0xlbmd0aC5qcyc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZS4gQSB2YWx1ZSBpcyBjb25zaWRlcmVkIGFycmF5LWxpa2UgaWYgaXQnc1xuICogbm90IGEgZnVuY3Rpb24gYW5kIGhhcyBhIGB2YWx1ZS5sZW5ndGhgIHRoYXQncyBhbiBpbnRlZ2VyIGdyZWF0ZXIgdGhhbiBvclxuICogZXF1YWwgdG8gYDBgIGFuZCBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gYE51bWJlci5NQVhfU0FGRV9JTlRFR0VSYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoJ2FiYycpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgIWlzRnVuY3Rpb24odmFsdWUpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpc0FycmF5TGlrZTtcbiIsImltcG9ydCBlcSBmcm9tICcuL2VxLmpzJztcbmltcG9ydCBpc0FycmF5TGlrZSBmcm9tICcuL2lzQXJyYXlMaWtlLmpzJztcbmltcG9ydCBpc0luZGV4IGZyb20gJy4vX2lzSW5kZXguanMnO1xuaW1wb3J0IGlzT2JqZWN0IGZyb20gJy4vaXNPYmplY3QuanMnO1xuXG4vKipcbiAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gYXJndW1lbnRzIGFyZSBmcm9tIGFuIGl0ZXJhdGVlIGNhbGwuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHBvdGVudGlhbCBpdGVyYXRlZSB2YWx1ZSBhcmd1bWVudC5cbiAqIEBwYXJhbSB7Kn0gaW5kZXggVGhlIHBvdGVudGlhbCBpdGVyYXRlZSBpbmRleCBvciBrZXkgYXJndW1lbnQuXG4gKiBAcGFyYW0geyp9IG9iamVjdCBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIG9iamVjdCBhcmd1bWVudC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYXJndW1lbnRzIGFyZSBmcm9tIGFuIGl0ZXJhdGVlIGNhbGwsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0l0ZXJhdGVlQ2FsbCh2YWx1ZSwgaW5kZXgsIG9iamVjdCkge1xuICBpZiAoIWlzT2JqZWN0KG9iamVjdCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHR5cGUgPSB0eXBlb2YgaW5kZXg7XG4gIGlmICh0eXBlID09ICdudW1iZXInXG4gICAgICAgID8gKGlzQXJyYXlMaWtlKG9iamVjdCkgJiYgaXNJbmRleChpbmRleCwgb2JqZWN0Lmxlbmd0aCkpXG4gICAgICAgIDogKHR5cGUgPT0gJ3N0cmluZycgJiYgaW5kZXggaW4gb2JqZWN0KVxuICAgICAgKSB7XG4gICAgcmV0dXJuIGVxKG9iamVjdFtpbmRleF0sIHZhbHVlKTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzSXRlcmF0ZWVDYWxsO1xuIiwiaW1wb3J0IGJhc2VSZXN0IGZyb20gJy4vX2Jhc2VSZXN0LmpzJztcbmltcG9ydCBpc0l0ZXJhdGVlQ2FsbCBmcm9tICcuL19pc0l0ZXJhdGVlQ2FsbC5qcyc7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIGxpa2UgYF8uYXNzaWduYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gYXNzaWduZXIgVGhlIGZ1bmN0aW9uIHRvIGFzc2lnbiB2YWx1ZXMuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBhc3NpZ25lciBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQXNzaWduZXIoYXNzaWduZXIpIHtcbiAgcmV0dXJuIGJhc2VSZXN0KGZ1bmN0aW9uKG9iamVjdCwgc291cmNlcykge1xuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICBsZW5ndGggPSBzb3VyY2VzLmxlbmd0aCxcbiAgICAgICAgY3VzdG9taXplciA9IGxlbmd0aCA+IDEgPyBzb3VyY2VzW2xlbmd0aCAtIDFdIDogdW5kZWZpbmVkLFxuICAgICAgICBndWFyZCA9IGxlbmd0aCA+IDIgPyBzb3VyY2VzWzJdIDogdW5kZWZpbmVkO1xuXG4gICAgY3VzdG9taXplciA9IChhc3NpZ25lci5sZW5ndGggPiAzICYmIHR5cGVvZiBjdXN0b21pemVyID09ICdmdW5jdGlvbicpXG4gICAgICA/IChsZW5ndGgtLSwgY3VzdG9taXplcilcbiAgICAgIDogdW5kZWZpbmVkO1xuXG4gICAgaWYgKGd1YXJkICYmIGlzSXRlcmF0ZWVDYWxsKHNvdXJjZXNbMF0sIHNvdXJjZXNbMV0sIGd1YXJkKSkge1xuICAgICAgY3VzdG9taXplciA9IGxlbmd0aCA8IDMgPyB1bmRlZmluZWQgOiBjdXN0b21pemVyO1xuICAgICAgbGVuZ3RoID0gMTtcbiAgICB9XG4gICAgb2JqZWN0ID0gT2JqZWN0KG9iamVjdCk7XG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIHZhciBzb3VyY2UgPSBzb3VyY2VzW2luZGV4XTtcbiAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgYXNzaWduZXIob2JqZWN0LCBzb3VyY2UsIGluZGV4LCBjdXN0b21pemVyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUFzc2lnbmVyO1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBsaWtlbHkgYSBwcm90b3R5cGUgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgcHJvdG90eXBlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzUHJvdG90eXBlKHZhbHVlKSB7XG4gIHZhciBDdG9yID0gdmFsdWUgJiYgdmFsdWUuY29uc3RydWN0b3IsXG4gICAgICBwcm90byA9ICh0eXBlb2YgQ3RvciA9PSAnZnVuY3Rpb24nICYmIEN0b3IucHJvdG90eXBlKSB8fCBvYmplY3RQcm90bztcblxuICByZXR1cm4gdmFsdWUgPT09IHByb3RvO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpc1Byb3RvdHlwZTtcbiIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udGltZXNgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kc1xuICogb3IgbWF4IGFycmF5IGxlbmd0aCBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBuIFRoZSBudW1iZXIgb2YgdGltZXMgdG8gaW52b2tlIGBpdGVyYXRlZWAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiByZXN1bHRzLlxuICovXG5mdW5jdGlvbiBiYXNlVGltZXMobiwgaXRlcmF0ZWUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBBcnJheShuKTtcblxuICB3aGlsZSAoKytpbmRleCA8IG4pIHtcbiAgICByZXN1bHRbaW5kZXhdID0gaXRlcmF0ZWUoaW5kZXgpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGJhc2VUaW1lcztcbiIsImltcG9ydCBiYXNlR2V0VGFnIGZyb20gJy4vX2Jhc2VHZXRUYWcuanMnO1xuaW1wb3J0IGlzT2JqZWN0TGlrZSBmcm9tICcuL2lzT2JqZWN0TGlrZS5qcyc7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXSc7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNBcmd1bWVudHNgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGBhcmd1bWVudHNgIG9iamVjdCxcbiAqL1xuZnVuY3Rpb24gYmFzZUlzQXJndW1lbnRzKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGJhc2VHZXRUYWcodmFsdWUpID09IGFyZ3NUYWc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGJhc2VJc0FyZ3VtZW50cztcbiIsImltcG9ydCBiYXNlSXNBcmd1bWVudHMgZnJvbSAnLi9fYmFzZUlzQXJndW1lbnRzLmpzJztcbmltcG9ydCBpc09iamVjdExpa2UgZnJvbSAnLi9pc09iamVjdExpa2UuanMnO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IG9iamVjdFByb3RvLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGxpa2VseSBhbiBgYXJndW1lbnRzYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcmd1bWVudHMgPSBiYXNlSXNBcmd1bWVudHMoZnVuY3Rpb24oKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPyBiYXNlSXNBcmd1bWVudHMgOiBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCAnY2FsbGVlJykgJiZcbiAgICAhcHJvcGVydHlJc0VudW1lcmFibGUuY2FsbCh2YWx1ZSwgJ2NhbGxlZScpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgaXNBcmd1bWVudHM7XG4iLCIvKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgYGZhbHNlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMTMuMFxuICogQGNhdGVnb3J5IFV0aWxcbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udGltZXMoMiwgXy5zdHViRmFsc2UpO1xuICogLy8gPT4gW2ZhbHNlLCBmYWxzZV1cbiAqL1xuZnVuY3Rpb24gc3R1YkZhbHNlKCkge1xuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHN0dWJGYWxzZTtcbiIsImltcG9ydCByb290IGZyb20gJy4vX3Jvb3QuanMnO1xuaW1wb3J0IHN0dWJGYWxzZSBmcm9tICcuL3N0dWJGYWxzZS5qcyc7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG52YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbnZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbi8qKiBEZXRlY3QgdGhlIHBvcHVsYXIgQ29tbW9uSlMgZXh0ZW5zaW9uIGBtb2R1bGUuZXhwb3J0c2AuICovXG52YXIgbW9kdWxlRXhwb3J0cyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5leHBvcnRzID09PSBmcmVlRXhwb3J0cztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgQnVmZmVyID0gbW9kdWxlRXhwb3J0cyA/IHJvb3QuQnVmZmVyIDogdW5kZWZpbmVkO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlSXNCdWZmZXIgPSBCdWZmZXIgPyBCdWZmZXIuaXNCdWZmZXIgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBidWZmZXIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjMuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBidWZmZXIsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0J1ZmZlcihuZXcgQnVmZmVyKDIpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQnVmZmVyKG5ldyBVaW50OEFycmF5KDIpKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0J1ZmZlciA9IG5hdGl2ZUlzQnVmZmVyIHx8IHN0dWJGYWxzZTtcblxuZXhwb3J0IGRlZmF1bHQgaXNCdWZmZXI7XG4iLCJpbXBvcnQgYmFzZUdldFRhZyBmcm9tICcuL19iYXNlR2V0VGFnLmpzJztcbmltcG9ydCBpc0xlbmd0aCBmcm9tICcuL2lzTGVuZ3RoLmpzJztcbmltcG9ydCBpc09iamVjdExpa2UgZnJvbSAnLi9pc09iamVjdExpa2UuanMnO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nLFxuICAgIGFycmF5VGFnID0gJ1tvYmplY3QgQXJyYXldJyxcbiAgICBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgZXJyb3JUYWcgPSAnW29iamVjdCBFcnJvcl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nLFxuICAgIHdlYWtNYXBUYWcgPSAnW29iamVjdCBXZWFrTWFwXSc7XG5cbnZhciBhcnJheUJ1ZmZlclRhZyA9ICdbb2JqZWN0IEFycmF5QnVmZmVyXScsXG4gICAgZGF0YVZpZXdUYWcgPSAnW29iamVjdCBEYXRhVmlld10nLFxuICAgIGZsb2F0MzJUYWcgPSAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICBmbG9hdDY0VGFnID0gJ1tvYmplY3QgRmxvYXQ2NEFycmF5XScsXG4gICAgaW50OFRhZyA9ICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgIGludDE2VGFnID0gJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgIGludDMyVGFnID0gJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgIHVpbnQ4VGFnID0gJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgIHVpbnQ4Q2xhbXBlZFRhZyA9ICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgdWludDE2VGFnID0gJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICB1aW50MzJUYWcgPSAnW29iamVjdCBVaW50MzJBcnJheV0nO1xuXG4vKiogVXNlZCB0byBpZGVudGlmeSBgdG9TdHJpbmdUYWdgIHZhbHVlcyBvZiB0eXBlZCBhcnJheXMuICovXG52YXIgdHlwZWRBcnJheVRhZ3MgPSB7fTtcbnR5cGVkQXJyYXlUYWdzW2Zsb2F0MzJUYWddID0gdHlwZWRBcnJheVRhZ3NbZmxvYXQ2NFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbaW50OFRhZ10gPSB0eXBlZEFycmF5VGFnc1tpbnQxNlRhZ10gPVxudHlwZWRBcnJheVRhZ3NbaW50MzJUYWddID0gdHlwZWRBcnJheVRhZ3NbdWludDhUYWddID1cbnR5cGVkQXJyYXlUYWdzW3VpbnQ4Q2xhbXBlZFRhZ10gPSB0eXBlZEFycmF5VGFnc1t1aW50MTZUYWddID1cbnR5cGVkQXJyYXlUYWdzW3VpbnQzMlRhZ10gPSB0cnVlO1xudHlwZWRBcnJheVRhZ3NbYXJnc1RhZ10gPSB0eXBlZEFycmF5VGFnc1thcnJheVRhZ10gPVxudHlwZWRBcnJheVRhZ3NbYXJyYXlCdWZmZXJUYWddID0gdHlwZWRBcnJheVRhZ3NbYm9vbFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbZGF0YVZpZXdUYWddID0gdHlwZWRBcnJheVRhZ3NbZGF0ZVRhZ10gPVxudHlwZWRBcnJheVRhZ3NbZXJyb3JUYWddID0gdHlwZWRBcnJheVRhZ3NbZnVuY1RhZ10gPVxudHlwZWRBcnJheVRhZ3NbbWFwVGFnXSA9IHR5cGVkQXJyYXlUYWdzW251bWJlclRhZ10gPVxudHlwZWRBcnJheVRhZ3Nbb2JqZWN0VGFnXSA9IHR5cGVkQXJyYXlUYWdzW3JlZ2V4cFRhZ10gPVxudHlwZWRBcnJheVRhZ3Nbc2V0VGFnXSA9IHR5cGVkQXJyYXlUYWdzW3N0cmluZ1RhZ10gPVxudHlwZWRBcnJheVRhZ3Nbd2Vha01hcFRhZ10gPSBmYWxzZTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc1R5cGVkQXJyYXlgIHdpdGhvdXQgTm9kZS5qcyBvcHRpbWl6YXRpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdHlwZWQgYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzVHlwZWRBcnJheSh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJlxuICAgIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgISF0eXBlZEFycmF5VGFnc1tiYXNlR2V0VGFnKHZhbHVlKV07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGJhc2VJc1R5cGVkQXJyYXk7XG4iLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnVuYXJ5YCB3aXRob3V0IHN1cHBvcnQgZm9yIHN0b3JpbmcgbWV0YWRhdGEuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNhcCBhcmd1bWVudHMgZm9yLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgY2FwcGVkIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlVW5hcnkoZnVuYykge1xuICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gZnVuYyh2YWx1ZSk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGJhc2VVbmFyeTtcbiIsImltcG9ydCBmcmVlR2xvYmFsIGZyb20gJy4vX2ZyZWVHbG9iYWwuanMnO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGV4cG9ydHNgLiAqL1xudmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSAmJiBleHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAuICovXG52YXIgZnJlZU1vZHVsZSA9IGZyZWVFeHBvcnRzICYmIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlICYmICFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xuXG4vKiogRGV0ZWN0IHRoZSBwb3B1bGFyIENvbW1vbkpTIGV4dGVuc2lvbiBgbW9kdWxlLmV4cG9ydHNgLiAqL1xudmFyIG1vZHVsZUV4cG9ydHMgPSBmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUuZXhwb3J0cyA9PT0gZnJlZUV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgcHJvY2Vzc2AgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVQcm9jZXNzID0gbW9kdWxlRXhwb3J0cyAmJiBmcmVlR2xvYmFsLnByb2Nlc3M7XG5cbi8qKiBVc2VkIHRvIGFjY2VzcyBmYXN0ZXIgTm9kZS5qcyBoZWxwZXJzLiAqL1xudmFyIG5vZGVVdGlsID0gKGZ1bmN0aW9uKCkge1xuICB0cnkge1xuICAgIC8vIFVzZSBgdXRpbC50eXBlc2AgZm9yIE5vZGUuanMgMTArLlxuICAgIHZhciB0eXBlcyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5yZXF1aXJlICYmIGZyZWVNb2R1bGUucmVxdWlyZSgndXRpbCcpLnR5cGVzO1xuXG4gICAgaWYgKHR5cGVzKSB7XG4gICAgICByZXR1cm4gdHlwZXM7XG4gICAgfVxuXG4gICAgLy8gTGVnYWN5IGBwcm9jZXNzLmJpbmRpbmcoJ3V0aWwnKWAgZm9yIE5vZGUuanMgPCAxMC5cbiAgICByZXR1cm4gZnJlZVByb2Nlc3MgJiYgZnJlZVByb2Nlc3MuYmluZGluZyAmJiBmcmVlUHJvY2Vzcy5iaW5kaW5nKCd1dGlsJyk7XG4gIH0gY2F0Y2ggKGUpIHt9XG59KCkpO1xuXG5leHBvcnQgZGVmYXVsdCBub2RlVXRpbDtcbiIsImltcG9ydCBiYXNlSXNUeXBlZEFycmF5IGZyb20gJy4vX2Jhc2VJc1R5cGVkQXJyYXkuanMnO1xuaW1wb3J0IGJhc2VVbmFyeSBmcm9tICcuL19iYXNlVW5hcnkuanMnO1xuaW1wb3J0IG5vZGVVdGlsIGZyb20gJy4vX25vZGVVdGlsLmpzJztcblxuLyogTm9kZS5qcyBoZWxwZXIgcmVmZXJlbmNlcy4gKi9cbnZhciBub2RlSXNUeXBlZEFycmF5ID0gbm9kZVV0aWwgJiYgbm9kZVV0aWwuaXNUeXBlZEFycmF5O1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSB0eXBlZCBhcnJheS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHR5cGVkIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNUeXBlZEFycmF5KG5ldyBVaW50OEFycmF5KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzVHlwZWRBcnJheShbXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNUeXBlZEFycmF5ID0gbm9kZUlzVHlwZWRBcnJheSA/IGJhc2VVbmFyeShub2RlSXNUeXBlZEFycmF5KSA6IGJhc2VJc1R5cGVkQXJyYXk7XG5cbmV4cG9ydCBkZWZhdWx0IGlzVHlwZWRBcnJheTtcbiIsImltcG9ydCBiYXNlVGltZXMgZnJvbSAnLi9fYmFzZVRpbWVzLmpzJztcbmltcG9ydCBpc0FyZ3VtZW50cyBmcm9tICcuL2lzQXJndW1lbnRzLmpzJztcbmltcG9ydCBpc0FycmF5IGZyb20gJy4vaXNBcnJheS5qcyc7XG5pbXBvcnQgaXNCdWZmZXIgZnJvbSAnLi9pc0J1ZmZlci5qcyc7XG5pbXBvcnQgaXNJbmRleCBmcm9tICcuL19pc0luZGV4LmpzJztcbmltcG9ydCBpc1R5cGVkQXJyYXkgZnJvbSAnLi9pc1R5cGVkQXJyYXkuanMnO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgdGhlIGFycmF5LWxpa2UgYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGluaGVyaXRlZCBTcGVjaWZ5IHJldHVybmluZyBpbmhlcml0ZWQgcHJvcGVydHkgbmFtZXMuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBhcnJheUxpa2VLZXlzKHZhbHVlLCBpbmhlcml0ZWQpIHtcbiAgdmFyIGlzQXJyID0gaXNBcnJheSh2YWx1ZSksXG4gICAgICBpc0FyZyA9ICFpc0FyciAmJiBpc0FyZ3VtZW50cyh2YWx1ZSksXG4gICAgICBpc0J1ZmYgPSAhaXNBcnIgJiYgIWlzQXJnICYmIGlzQnVmZmVyKHZhbHVlKSxcbiAgICAgIGlzVHlwZSA9ICFpc0FyciAmJiAhaXNBcmcgJiYgIWlzQnVmZiAmJiBpc1R5cGVkQXJyYXkodmFsdWUpLFxuICAgICAgc2tpcEluZGV4ZXMgPSBpc0FyciB8fCBpc0FyZyB8fCBpc0J1ZmYgfHwgaXNUeXBlLFxuICAgICAgcmVzdWx0ID0gc2tpcEluZGV4ZXMgPyBiYXNlVGltZXModmFsdWUubGVuZ3RoLCBTdHJpbmcpIDogW10sXG4gICAgICBsZW5ndGggPSByZXN1bHQubGVuZ3RoO1xuXG4gIGZvciAodmFyIGtleSBpbiB2YWx1ZSkge1xuICAgIGlmICgoaW5oZXJpdGVkIHx8IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGtleSkpICYmXG4gICAgICAgICEoc2tpcEluZGV4ZXMgJiYgKFxuICAgICAgICAgICAvLyBTYWZhcmkgOSBoYXMgZW51bWVyYWJsZSBgYXJndW1lbnRzLmxlbmd0aGAgaW4gc3RyaWN0IG1vZGUuXG4gICAgICAgICAgIGtleSA9PSAnbGVuZ3RoJyB8fFxuICAgICAgICAgICAvLyBOb2RlLmpzIDAuMTAgaGFzIGVudW1lcmFibGUgbm9uLWluZGV4IHByb3BlcnRpZXMgb24gYnVmZmVycy5cbiAgICAgICAgICAgKGlzQnVmZiAmJiAoa2V5ID09ICdvZmZzZXQnIHx8IGtleSA9PSAncGFyZW50JykpIHx8XG4gICAgICAgICAgIC8vIFBoYW50b21KUyAyIGhhcyBlbnVtZXJhYmxlIG5vbi1pbmRleCBwcm9wZXJ0aWVzIG9uIHR5cGVkIGFycmF5cy5cbiAgICAgICAgICAgKGlzVHlwZSAmJiAoa2V5ID09ICdidWZmZXInIHx8IGtleSA9PSAnYnl0ZUxlbmd0aCcgfHwga2V5ID09ICdieXRlT2Zmc2V0JykpIHx8XG4gICAgICAgICAgIC8vIFNraXAgaW5kZXggcHJvcGVydGllcy5cbiAgICAgICAgICAgaXNJbmRleChrZXksIGxlbmd0aClcbiAgICAgICAgKSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFycmF5TGlrZUtleXM7XG4iLCIvKipcbiAqIENyZWF0ZXMgYSB1bmFyeSBmdW5jdGlvbiB0aGF0IGludm9rZXMgYGZ1bmNgIHdpdGggaXRzIGFyZ3VtZW50IHRyYW5zZm9ybWVkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byB3cmFwLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gdHJhbnNmb3JtIFRoZSBhcmd1bWVudCB0cmFuc2Zvcm0uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gb3ZlckFyZyhmdW5jLCB0cmFuc2Zvcm0pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiBmdW5jKHRyYW5zZm9ybShhcmcpKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgb3ZlckFyZztcbiIsImltcG9ydCBvdmVyQXJnIGZyb20gJy4vX292ZXJBcmcuanMnO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlS2V5cyA9IG92ZXJBcmcoT2JqZWN0LmtleXMsIE9iamVjdCk7XG5cbmV4cG9ydCBkZWZhdWx0IG5hdGl2ZUtleXM7XG4iLCJpbXBvcnQgaXNQcm90b3R5cGUgZnJvbSAnLi9faXNQcm90b3R5cGUuanMnO1xuaW1wb3J0IG5hdGl2ZUtleXMgZnJvbSAnLi9fbmF0aXZlS2V5cy5qcyc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ua2V5c2Agd2hpY2ggZG9lc24ndCB0cmVhdCBzcGFyc2UgYXJyYXlzIGFzIGRlbnNlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBiYXNlS2V5cyhvYmplY3QpIHtcbiAgaWYgKCFpc1Byb3RvdHlwZShvYmplY3QpKSB7XG4gICAgcmV0dXJuIG5hdGl2ZUtleXMob2JqZWN0KTtcbiAgfVxuICB2YXIgcmVzdWx0ID0gW107XG4gIGZvciAodmFyIGtleSBpbiBPYmplY3Qob2JqZWN0KSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSAmJiBrZXkgIT0gJ2NvbnN0cnVjdG9yJykge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYmFzZUtleXM7XG4iLCJpbXBvcnQgYXJyYXlMaWtlS2V5cyBmcm9tICcuL19hcnJheUxpa2VLZXlzLmpzJztcbmltcG9ydCBiYXNlS2V5cyBmcm9tICcuL19iYXNlS2V5cy5qcyc7XG5pbXBvcnQgaXNBcnJheUxpa2UgZnJvbSAnLi9pc0FycmF5TGlrZS5qcyc7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIE5vbi1vYmplY3QgdmFsdWVzIGFyZSBjb2VyY2VkIHRvIG9iamVjdHMuIFNlZSB0aGVcbiAqIFtFUyBzcGVjXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3Qua2V5cylcbiAqIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy5rZXlzKG5ldyBGb28pO1xuICogLy8gPT4gWydhJywgJ2InXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICpcbiAqIF8ua2V5cygnaGknKTtcbiAqIC8vID0+IFsnMCcsICcxJ11cbiAqL1xuZnVuY3Rpb24ga2V5cyhvYmplY3QpIHtcbiAgcmV0dXJuIGlzQXJyYXlMaWtlKG9iamVjdCkgPyBhcnJheUxpa2VLZXlzKG9iamVjdCkgOiBiYXNlS2V5cyhvYmplY3QpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBrZXlzO1xuIiwiLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIGxpa2VcbiAqIFtgT2JqZWN0LmtleXNgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3Qua2V5cylcbiAqIGV4Y2VwdCB0aGF0IGl0IGluY2x1ZGVzIGluaGVyaXRlZCBlbnVtZXJhYmxlIHByb3BlcnRpZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIG5hdGl2ZUtleXNJbihvYmplY3QpIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBpZiAob2JqZWN0ICE9IG51bGwpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gT2JqZWN0KG9iamVjdCkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5hdGl2ZUtleXNJbjtcbiIsImltcG9ydCBpc09iamVjdCBmcm9tICcuL2lzT2JqZWN0LmpzJztcbmltcG9ydCBpc1Byb3RvdHlwZSBmcm9tICcuL19pc1Byb3RvdHlwZS5qcyc7XG5pbXBvcnQgbmF0aXZlS2V5c0luIGZyb20gJy4vX25hdGl2ZUtleXNJbi5qcyc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ua2V5c0luYCB3aGljaCBkb2Vzbid0IHRyZWF0IHNwYXJzZSBhcnJheXMgYXMgZGVuc2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VLZXlzSW4ob2JqZWN0KSB7XG4gIGlmICghaXNPYmplY3Qob2JqZWN0KSkge1xuICAgIHJldHVybiBuYXRpdmVLZXlzSW4ob2JqZWN0KTtcbiAgfVxuICB2YXIgaXNQcm90byA9IGlzUHJvdG90eXBlKG9iamVjdCksXG4gICAgICByZXN1bHQgPSBbXTtcblxuICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgaWYgKCEoa2V5ID09ICdjb25zdHJ1Y3RvcicgJiYgKGlzUHJvdG8gfHwgIWhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpKSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGJhc2VLZXlzSW47XG4iLCJpbXBvcnQgYXJyYXlMaWtlS2V5cyBmcm9tICcuL19hcnJheUxpa2VLZXlzLmpzJztcbmltcG9ydCBiYXNlS2V5c0luIGZyb20gJy4vX2Jhc2VLZXlzSW4uanMnO1xuaW1wb3J0IGlzQXJyYXlMaWtlIGZyb20gJy4vaXNBcnJheUxpa2UuanMnO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBhbmQgaW5oZXJpdGVkIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIE5vbi1vYmplY3QgdmFsdWVzIGFyZSBjb2VyY2VkIHRvIG9iamVjdHMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy5rZXlzSW4obmV3IEZvbyk7XG4gKiAvLyA9PiBbJ2EnLCAnYicsICdjJ10gKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAqL1xuZnVuY3Rpb24ga2V5c0luKG9iamVjdCkge1xuICByZXR1cm4gaXNBcnJheUxpa2Uob2JqZWN0KSA/IGFycmF5TGlrZUtleXMob2JqZWN0LCB0cnVlKSA6IGJhc2VLZXlzSW4ob2JqZWN0KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQga2V5c0luO1xuIiwiaW1wb3J0IGdldE5hdGl2ZSBmcm9tICcuL19nZXROYXRpdmUuanMnO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgbmF0aXZlQ3JlYXRlID0gZ2V0TmF0aXZlKE9iamVjdCwgJ2NyZWF0ZScpO1xuXG5leHBvcnQgZGVmYXVsdCBuYXRpdmVDcmVhdGU7XG4iLCJpbXBvcnQgbmF0aXZlQ3JlYXRlIGZyb20gJy4vX25hdGl2ZUNyZWF0ZS5qcyc7XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgaGFzaC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKi9cbmZ1bmN0aW9uIGhhc2hDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IG5hdGl2ZUNyZWF0ZSA/IG5hdGl2ZUNyZWF0ZShudWxsKSA6IHt9O1xuICB0aGlzLnNpemUgPSAwO1xufVxuXG5leHBvcnQgZGVmYXVsdCBoYXNoQ2xlYXI7XG4iLCIvKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBoYXNoLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge09iamVjdH0gaGFzaCBUaGUgaGFzaCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzaERlbGV0ZShrZXkpIHtcbiAgdmFyIHJlc3VsdCA9IHRoaXMuaGFzKGtleSkgJiYgZGVsZXRlIHRoaXMuX19kYXRhX19ba2V5XTtcbiAgdGhpcy5zaXplIC09IHJlc3VsdCA/IDEgOiAwO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBoYXNoRGVsZXRlO1xuIiwiaW1wb3J0IG5hdGl2ZUNyZWF0ZSBmcm9tICcuL19uYXRpdmVDcmVhdGUuanMnO1xuXG4vKiogVXNlZCB0byBzdGFuZC1pbiBmb3IgYHVuZGVmaW5lZGAgaGFzaCB2YWx1ZXMuICovXG52YXIgSEFTSF9VTkRFRklORUQgPSAnX19sb2Rhc2hfaGFzaF91bmRlZmluZWRfXyc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogR2V0cyB0aGUgaGFzaCB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBoYXNoR2V0KGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIGlmIChuYXRpdmVDcmVhdGUpIHtcbiAgICB2YXIgcmVzdWx0ID0gZGF0YVtrZXldO1xuICAgIHJldHVybiByZXN1bHQgPT09IEhBU0hfVU5ERUZJTkVEID8gdW5kZWZpbmVkIDogcmVzdWx0O1xuICB9XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGEsIGtleSkgPyBkYXRhW2tleV0gOiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGhhc2hHZXQ7XG4iLCJpbXBvcnQgbmF0aXZlQ3JlYXRlIGZyb20gJy4vX25hdGl2ZUNyZWF0ZS5qcyc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgaGFzaCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzaEhhcyhrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICByZXR1cm4gbmF0aXZlQ3JlYXRlID8gKGRhdGFba2V5XSAhPT0gdW5kZWZpbmVkKSA6IGhhc093blByb3BlcnR5LmNhbGwoZGF0YSwga2V5KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaGFzaEhhcztcbiIsImltcG9ydCBuYXRpdmVDcmVhdGUgZnJvbSAnLi9fbmF0aXZlQ3JlYXRlLmpzJztcblxuLyoqIFVzZWQgdG8gc3RhbmQtaW4gZm9yIGB1bmRlZmluZWRgIGhhc2ggdmFsdWVzLiAqL1xudmFyIEhBU0hfVU5ERUZJTkVEID0gJ19fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX18nO1xuXG4vKipcbiAqIFNldHMgdGhlIGhhc2ggYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBoYXNoIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBoYXNoU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICB0aGlzLnNpemUgKz0gdGhpcy5oYXMoa2V5KSA/IDAgOiAxO1xuICBkYXRhW2tleV0gPSAobmF0aXZlQ3JlYXRlICYmIHZhbHVlID09PSB1bmRlZmluZWQpID8gSEFTSF9VTkRFRklORUQgOiB2YWx1ZTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGhhc2hTZXQ7XG4iLCJpbXBvcnQgaGFzaENsZWFyIGZyb20gJy4vX2hhc2hDbGVhci5qcyc7XG5pbXBvcnQgaGFzaERlbGV0ZSBmcm9tICcuL19oYXNoRGVsZXRlLmpzJztcbmltcG9ydCBoYXNoR2V0IGZyb20gJy4vX2hhc2hHZXQuanMnO1xuaW1wb3J0IGhhc2hIYXMgZnJvbSAnLi9faGFzaEhhcy5qcyc7XG5pbXBvcnQgaGFzaFNldCBmcm9tICcuL19oYXNoU2V0LmpzJztcblxuLyoqXG4gKiBDcmVhdGVzIGEgaGFzaCBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIEhhc2goZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPT0gbnVsbCA/IDAgOiBlbnRyaWVzLmxlbmd0aDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgSGFzaGAuXG5IYXNoLnByb3RvdHlwZS5jbGVhciA9IGhhc2hDbGVhcjtcbkhhc2gucHJvdG90eXBlWydkZWxldGUnXSA9IGhhc2hEZWxldGU7XG5IYXNoLnByb3RvdHlwZS5nZXQgPSBoYXNoR2V0O1xuSGFzaC5wcm90b3R5cGUuaGFzID0gaGFzaEhhcztcbkhhc2gucHJvdG90eXBlLnNldCA9IGhhc2hTZXQ7XG5cbmV4cG9ydCBkZWZhdWx0IEhhc2g7XG4iLCIvKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIGxpc3QgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUNsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0gW107XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGxpc3RDYWNoZUNsZWFyO1xuIiwiaW1wb3J0IGVxIGZyb20gJy4vZXEuanMnO1xuXG4vKipcbiAqIEdldHMgdGhlIGluZGV4IGF0IHdoaWNoIHRoZSBga2V5YCBpcyBmb3VuZCBpbiBgYXJyYXlgIG9mIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0geyp9IGtleSBUaGUga2V5IHRvIHNlYXJjaCBmb3IuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuICovXG5mdW5jdGlvbiBhc3NvY0luZGV4T2YoYXJyYXksIGtleSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICBpZiAoZXEoYXJyYXlbbGVuZ3RoXVswXSwga2V5KSkge1xuICAgICAgcmV0dXJuIGxlbmd0aDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG5leHBvcnQgZGVmYXVsdCBhc3NvY0luZGV4T2Y7XG4iLCJpbXBvcnQgYXNzb2NJbmRleE9mIGZyb20gJy4vX2Fzc29jSW5kZXhPZi5qcyc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBhcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzcGxpY2UgPSBhcnJheVByb3RvLnNwbGljZTtcblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgbGlzdCBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlRGVsZXRlKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIGlmIChpbmRleCA8IDApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIGxhc3RJbmRleCA9IGRhdGEubGVuZ3RoIC0gMTtcbiAgaWYgKGluZGV4ID09IGxhc3RJbmRleCkge1xuICAgIGRhdGEucG9wKCk7XG4gIH0gZWxzZSB7XG4gICAgc3BsaWNlLmNhbGwoZGF0YSwgaW5kZXgsIDEpO1xuICB9XG4gIC0tdGhpcy5zaXplO1xuICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbGlzdENhY2hlRGVsZXRlO1xuIiwiaW1wb3J0IGFzc29jSW5kZXhPZiBmcm9tICcuL19hc3NvY0luZGV4T2YuanMnO1xuXG4vKipcbiAqIEdldHMgdGhlIGxpc3QgY2FjaGUgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVHZXQoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgcmV0dXJuIGluZGV4IDwgMCA/IHVuZGVmaW5lZCA6IGRhdGFbaW5kZXhdWzFdO1xufVxuXG5leHBvcnQgZGVmYXVsdCBsaXN0Q2FjaGVHZXQ7XG4iLCJpbXBvcnQgYXNzb2NJbmRleE9mIGZyb20gJy4vX2Fzc29jSW5kZXhPZi5qcyc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgbGlzdCBjYWNoZSB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVIYXMoa2V5KSB7XG4gIHJldHVybiBhc3NvY0luZGV4T2YodGhpcy5fX2RhdGFfXywga2V5KSA+IC0xO1xufVxuXG5leHBvcnQgZGVmYXVsdCBsaXN0Q2FjaGVIYXM7XG4iLCJpbXBvcnQgYXNzb2NJbmRleE9mIGZyb20gJy4vX2Fzc29jSW5kZXhPZi5qcyc7XG5cbi8qKlxuICogU2V0cyB0aGUgbGlzdCBjYWNoZSBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbGlzdCBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICBpZiAoaW5kZXggPCAwKSB7XG4gICAgKyt0aGlzLnNpemU7XG4gICAgZGF0YS5wdXNoKFtrZXksIHZhbHVlXSk7XG4gIH0gZWxzZSB7XG4gICAgZGF0YVtpbmRleF1bMV0gPSB2YWx1ZTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn1cblxuZXhwb3J0IGRlZmF1bHQgbGlzdENhY2hlU2V0O1xuIiwiaW1wb3J0IGxpc3RDYWNoZUNsZWFyIGZyb20gJy4vX2xpc3RDYWNoZUNsZWFyLmpzJztcbmltcG9ydCBsaXN0Q2FjaGVEZWxldGUgZnJvbSAnLi9fbGlzdENhY2hlRGVsZXRlLmpzJztcbmltcG9ydCBsaXN0Q2FjaGVHZXQgZnJvbSAnLi9fbGlzdENhY2hlR2V0LmpzJztcbmltcG9ydCBsaXN0Q2FjaGVIYXMgZnJvbSAnLi9fbGlzdENhY2hlSGFzLmpzJztcbmltcG9ydCBsaXN0Q2FjaGVTZXQgZnJvbSAnLi9fbGlzdENhY2hlU2V0LmpzJztcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGxpc3QgY2FjaGUgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBMaXN0Q2FjaGUoZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPT0gbnVsbCA/IDAgOiBlbnRyaWVzLmxlbmd0aDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgTGlzdENhY2hlYC5cbkxpc3RDYWNoZS5wcm90b3R5cGUuY2xlYXIgPSBsaXN0Q2FjaGVDbGVhcjtcbkxpc3RDYWNoZS5wcm90b3R5cGVbJ2RlbGV0ZSddID0gbGlzdENhY2hlRGVsZXRlO1xuTGlzdENhY2hlLnByb3RvdHlwZS5nZXQgPSBsaXN0Q2FjaGVHZXQ7XG5MaXN0Q2FjaGUucHJvdG90eXBlLmhhcyA9IGxpc3RDYWNoZUhhcztcbkxpc3RDYWNoZS5wcm90b3R5cGUuc2V0ID0gbGlzdENhY2hlU2V0O1xuXG5leHBvcnQgZGVmYXVsdCBMaXN0Q2FjaGU7XG4iLCJpbXBvcnQgZ2V0TmF0aXZlIGZyb20gJy4vX2dldE5hdGl2ZS5qcyc7XG5pbXBvcnQgcm9vdCBmcm9tICcuL19yb290LmpzJztcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIE1hcCA9IGdldE5hdGl2ZShyb290LCAnTWFwJyk7XG5cbmV4cG9ydCBkZWZhdWx0IE1hcDtcbiIsImltcG9ydCBIYXNoIGZyb20gJy4vX0hhc2guanMnO1xuaW1wb3J0IExpc3RDYWNoZSBmcm9tICcuL19MaXN0Q2FjaGUuanMnO1xuaW1wb3J0IE1hcCBmcm9tICcuL19NYXAuanMnO1xuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIG1hcC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUNsZWFyKCkge1xuICB0aGlzLnNpemUgPSAwO1xuICB0aGlzLl9fZGF0YV9fID0ge1xuICAgICdoYXNoJzogbmV3IEhhc2gsXG4gICAgJ21hcCc6IG5ldyAoTWFwIHx8IExpc3RDYWNoZSksXG4gICAgJ3N0cmluZyc6IG5ldyBIYXNoXG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IG1hcENhY2hlQ2xlYXI7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHN1aXRhYmxlIGZvciB1c2UgYXMgdW5pcXVlIG9iamVjdCBrZXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgc3VpdGFibGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNLZXlhYmxlKHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gKHR5cGUgPT0gJ3N0cmluZycgfHwgdHlwZSA9PSAnbnVtYmVyJyB8fCB0eXBlID09ICdzeW1ib2wnIHx8IHR5cGUgPT0gJ2Jvb2xlYW4nKVxuICAgID8gKHZhbHVlICE9PSAnX19wcm90b19fJylcbiAgICA6ICh2YWx1ZSA9PT0gbnVsbCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzS2V5YWJsZTtcbiIsImltcG9ydCBpc0tleWFibGUgZnJvbSAnLi9faXNLZXlhYmxlLmpzJztcblxuLyoqXG4gKiBHZXRzIHRoZSBkYXRhIGZvciBgbWFwYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG1hcCBUaGUgbWFwIHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUgcmVmZXJlbmNlIGtleS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBtYXAgZGF0YS5cbiAqL1xuZnVuY3Rpb24gZ2V0TWFwRGF0YShtYXAsIGtleSkge1xuICB2YXIgZGF0YSA9IG1hcC5fX2RhdGFfXztcbiAgcmV0dXJuIGlzS2V5YWJsZShrZXkpXG4gICAgPyBkYXRhW3R5cGVvZiBrZXkgPT0gJ3N0cmluZycgPyAnc3RyaW5nJyA6ICdoYXNoJ11cbiAgICA6IGRhdGEubWFwO1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRNYXBEYXRhO1xuIiwiaW1wb3J0IGdldE1hcERhdGEgZnJvbSAnLi9fZ2V0TWFwRGF0YS5qcyc7XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIG1hcC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZURlbGV0ZShrZXkpIHtcbiAgdmFyIHJlc3VsdCA9IGdldE1hcERhdGEodGhpcywga2V5KVsnZGVsZXRlJ10oa2V5KTtcbiAgdGhpcy5zaXplIC09IHJlc3VsdCA/IDEgOiAwO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBtYXBDYWNoZURlbGV0ZTtcbiIsImltcG9ydCBnZXRNYXBEYXRhIGZyb20gJy4vX2dldE1hcERhdGEuanMnO1xuXG4vKipcbiAqIEdldHMgdGhlIG1hcCB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVHZXQoa2V5KSB7XG4gIHJldHVybiBnZXRNYXBEYXRhKHRoaXMsIGtleSkuZ2V0KGtleSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG1hcENhY2hlR2V0O1xuIiwiaW1wb3J0IGdldE1hcERhdGEgZnJvbSAnLi9fZ2V0TWFwRGF0YS5qcyc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgbWFwIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVIYXMoa2V5KSB7XG4gIHJldHVybiBnZXRNYXBEYXRhKHRoaXMsIGtleSkuaGFzKGtleSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG1hcENhY2hlSGFzO1xuIiwiaW1wb3J0IGdldE1hcERhdGEgZnJvbSAnLi9fZ2V0TWFwRGF0YS5qcyc7XG5cbi8qKlxuICogU2V0cyB0aGUgbWFwIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG1hcCBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IGdldE1hcERhdGEodGhpcywga2V5KSxcbiAgICAgIHNpemUgPSBkYXRhLnNpemU7XG5cbiAgZGF0YS5zZXQoa2V5LCB2YWx1ZSk7XG4gIHRoaXMuc2l6ZSArPSBkYXRhLnNpemUgPT0gc2l6ZSA/IDAgOiAxO1xuICByZXR1cm4gdGhpcztcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWFwQ2FjaGVTZXQ7XG4iLCJpbXBvcnQgbWFwQ2FjaGVDbGVhciBmcm9tICcuL19tYXBDYWNoZUNsZWFyLmpzJztcbmltcG9ydCBtYXBDYWNoZURlbGV0ZSBmcm9tICcuL19tYXBDYWNoZURlbGV0ZS5qcyc7XG5pbXBvcnQgbWFwQ2FjaGVHZXQgZnJvbSAnLi9fbWFwQ2FjaGVHZXQuanMnO1xuaW1wb3J0IG1hcENhY2hlSGFzIGZyb20gJy4vX21hcENhY2hlSGFzLmpzJztcbmltcG9ydCBtYXBDYWNoZVNldCBmcm9tICcuL19tYXBDYWNoZVNldC5qcyc7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG1hcCBjYWNoZSBvYmplY3QgdG8gc3RvcmUga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBNYXBDYWNoZShlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBNYXBDYWNoZWAuXG5NYXBDYWNoZS5wcm90b3R5cGUuY2xlYXIgPSBtYXBDYWNoZUNsZWFyO1xuTWFwQ2FjaGUucHJvdG90eXBlWydkZWxldGUnXSA9IG1hcENhY2hlRGVsZXRlO1xuTWFwQ2FjaGUucHJvdG90eXBlLmdldCA9IG1hcENhY2hlR2V0O1xuTWFwQ2FjaGUucHJvdG90eXBlLmhhcyA9IG1hcENhY2hlSGFzO1xuTWFwQ2FjaGUucHJvdG90eXBlLnNldCA9IG1hcENhY2hlU2V0O1xuXG5leHBvcnQgZGVmYXVsdCBNYXBDYWNoZTtcbiIsImltcG9ydCBvdmVyQXJnIGZyb20gJy4vX292ZXJBcmcuanMnO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBnZXRQcm90b3R5cGUgPSBvdmVyQXJnKE9iamVjdC5nZXRQcm90b3R5cGVPZiwgT2JqZWN0KTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0UHJvdG90eXBlO1xuIiwiaW1wb3J0IGJhc2VHZXRUYWcgZnJvbSAnLi9fYmFzZUdldFRhZy5qcyc7XG5pbXBvcnQgZ2V0UHJvdG90eXBlIGZyb20gJy4vX2dldFByb3RvdHlwZS5qcyc7XG5pbXBvcnQgaXNPYmplY3RMaWtlIGZyb20gJy4vaXNPYmplY3RMaWtlLmpzJztcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlLFxuICAgIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZ1bmNUb1N0cmluZyA9IGZ1bmNQcm90by50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqIFVzZWQgdG8gaW5mZXIgdGhlIGBPYmplY3RgIGNvbnN0cnVjdG9yLiAqL1xudmFyIG9iamVjdEN0b3JTdHJpbmcgPSBmdW5jVG9TdHJpbmcuY2FsbChPYmplY3QpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgcGxhaW4gb2JqZWN0LCB0aGF0IGlzLCBhbiBvYmplY3QgY3JlYXRlZCBieSB0aGVcbiAqIGBPYmplY3RgIGNvbnN0cnVjdG9yIG9yIG9uZSB3aXRoIGEgYFtbUHJvdG90eXBlXV1gIG9mIGBudWxsYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuOC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHBsYWluIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiB9XG4gKlxuICogXy5pc1BsYWluT2JqZWN0KG5ldyBGb28pO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzUGxhaW5PYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc1BsYWluT2JqZWN0KHsgJ3gnOiAwLCAneSc6IDAgfSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1BsYWluT2JqZWN0KE9iamVjdC5jcmVhdGUobnVsbCkpO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBpc1BsYWluT2JqZWN0KHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3RMaWtlKHZhbHVlKSB8fCBiYXNlR2V0VGFnKHZhbHVlKSAhPSBvYmplY3RUYWcpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHByb3RvID0gZ2V0UHJvdG90eXBlKHZhbHVlKTtcbiAgaWYgKHByb3RvID09PSBudWxsKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgdmFyIEN0b3IgPSBoYXNPd25Qcm9wZXJ0eS5jYWxsKHByb3RvLCAnY29uc3RydWN0b3InKSAmJiBwcm90by5jb25zdHJ1Y3RvcjtcbiAgcmV0dXJuIHR5cGVvZiBDdG9yID09ICdmdW5jdGlvbicgJiYgQ3RvciBpbnN0YW5jZW9mIEN0b3IgJiZcbiAgICBmdW5jVG9TdHJpbmcuY2FsbChDdG9yKSA9PSBvYmplY3RDdG9yU3RyaW5nO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpc1BsYWluT2JqZWN0O1xuIiwiaW1wb3J0IExpc3RDYWNoZSBmcm9tICcuL19MaXN0Q2FjaGUuanMnO1xuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIHN0YWNrLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIFN0YWNrXG4gKi9cbmZ1bmN0aW9uIHN0YWNrQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBuZXcgTGlzdENhY2hlO1xuICB0aGlzLnNpemUgPSAwO1xufVxuXG5leHBvcnQgZGVmYXVsdCBzdGFja0NsZWFyO1xuIiwiLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgc3RhY2suXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gc3RhY2tEZWxldGUoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIHJlc3VsdCA9IGRhdGFbJ2RlbGV0ZSddKGtleSk7XG5cbiAgdGhpcy5zaXplID0gZGF0YS5zaXplO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBzdGFja0RlbGV0ZTtcbiIsIi8qKlxuICogR2V0cyB0aGUgc3RhY2sgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrR2V0KGtleSkge1xuICByZXR1cm4gdGhpcy5fX2RhdGFfXy5nZXQoa2V5KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgc3RhY2tHZXQ7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBhIHN0YWNrIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gc3RhY2tIYXMoa2V5KSB7XG4gIHJldHVybiB0aGlzLl9fZGF0YV9fLmhhcyhrZXkpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBzdGFja0hhcztcbiIsImltcG9ydCBMaXN0Q2FjaGUgZnJvbSAnLi9fTGlzdENhY2hlLmpzJztcbmltcG9ydCBNYXAgZnJvbSAnLi9fTWFwLmpzJztcbmltcG9ydCBNYXBDYWNoZSBmcm9tICcuL19NYXBDYWNoZS5qcyc7XG5cbi8qKiBVc2VkIGFzIHRoZSBzaXplIHRvIGVuYWJsZSBsYXJnZSBhcnJheSBvcHRpbWl6YXRpb25zLiAqL1xudmFyIExBUkdFX0FSUkFZX1NJWkUgPSAyMDA7XG5cbi8qKlxuICogU2V0cyB0aGUgc3RhY2sgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgc3RhY2sgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICBpZiAoZGF0YSBpbnN0YW5jZW9mIExpc3RDYWNoZSkge1xuICAgIHZhciBwYWlycyA9IGRhdGEuX19kYXRhX187XG4gICAgaWYgKCFNYXAgfHwgKHBhaXJzLmxlbmd0aCA8IExBUkdFX0FSUkFZX1NJWkUgLSAxKSkge1xuICAgICAgcGFpcnMucHVzaChba2V5LCB2YWx1ZV0pO1xuICAgICAgdGhpcy5zaXplID0gKytkYXRhLnNpemU7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgZGF0YSA9IHRoaXMuX19kYXRhX18gPSBuZXcgTWFwQ2FjaGUocGFpcnMpO1xuICB9XG4gIGRhdGEuc2V0KGtleSwgdmFsdWUpO1xuICB0aGlzLnNpemUgPSBkYXRhLnNpemU7XG4gIHJldHVybiB0aGlzO1xufVxuXG5leHBvcnQgZGVmYXVsdCBzdGFja1NldDtcbiIsImltcG9ydCBMaXN0Q2FjaGUgZnJvbSAnLi9fTGlzdENhY2hlLmpzJztcbmltcG9ydCBzdGFja0NsZWFyIGZyb20gJy4vX3N0YWNrQ2xlYXIuanMnO1xuaW1wb3J0IHN0YWNrRGVsZXRlIGZyb20gJy4vX3N0YWNrRGVsZXRlLmpzJztcbmltcG9ydCBzdGFja0dldCBmcm9tICcuL19zdGFja0dldC5qcyc7XG5pbXBvcnQgc3RhY2tIYXMgZnJvbSAnLi9fc3RhY2tIYXMuanMnO1xuaW1wb3J0IHN0YWNrU2V0IGZyb20gJy4vX3N0YWNrU2V0LmpzJztcblxuLyoqXG4gKiBDcmVhdGVzIGEgc3RhY2sgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gU3RhY2soZW50cmllcykge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18gPSBuZXcgTGlzdENhY2hlKGVudHJpZXMpO1xuICB0aGlzLnNpemUgPSBkYXRhLnNpemU7XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBTdGFja2AuXG5TdGFjay5wcm90b3R5cGUuY2xlYXIgPSBzdGFja0NsZWFyO1xuU3RhY2sucHJvdG90eXBlWydkZWxldGUnXSA9IHN0YWNrRGVsZXRlO1xuU3RhY2sucHJvdG90eXBlLmdldCA9IHN0YWNrR2V0O1xuU3RhY2sucHJvdG90eXBlLmhhcyA9IHN0YWNrSGFzO1xuU3RhY2sucHJvdG90eXBlLnNldCA9IHN0YWNrU2V0O1xuXG5leHBvcnQgZGVmYXVsdCBTdGFjaztcbiIsImltcG9ydCByb290IGZyb20gJy4vX3Jvb3QuanMnO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGV4cG9ydHNgLiAqL1xudmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSAmJiBleHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAuICovXG52YXIgZnJlZU1vZHVsZSA9IGZyZWVFeHBvcnRzICYmIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlICYmICFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xuXG4vKiogRGV0ZWN0IHRoZSBwb3B1bGFyIENvbW1vbkpTIGV4dGVuc2lvbiBgbW9kdWxlLmV4cG9ydHNgLiAqL1xudmFyIG1vZHVsZUV4cG9ydHMgPSBmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUuZXhwb3J0cyA9PT0gZnJlZUV4cG9ydHM7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIEJ1ZmZlciA9IG1vZHVsZUV4cG9ydHMgPyByb290LkJ1ZmZlciA6IHVuZGVmaW5lZCxcbiAgICBhbGxvY1Vuc2FmZSA9IEJ1ZmZlciA/IEJ1ZmZlci5hbGxvY1Vuc2FmZSA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgIGBidWZmZXJgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0J1ZmZlcn0gYnVmZmVyIFRoZSBidWZmZXIgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXBdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuICogQHJldHVybnMge0J1ZmZlcn0gUmV0dXJucyB0aGUgY2xvbmVkIGJ1ZmZlci5cbiAqL1xuZnVuY3Rpb24gY2xvbmVCdWZmZXIoYnVmZmVyLCBpc0RlZXApIHtcbiAgaWYgKGlzRGVlcCkge1xuICAgIHJldHVybiBidWZmZXIuc2xpY2UoKTtcbiAgfVxuICB2YXIgbGVuZ3RoID0gYnVmZmVyLmxlbmd0aCxcbiAgICAgIHJlc3VsdCA9IGFsbG9jVW5zYWZlID8gYWxsb2NVbnNhZmUobGVuZ3RoKSA6IG5ldyBidWZmZXIuY29uc3RydWN0b3IobGVuZ3RoKTtcblxuICBidWZmZXIuY29weShyZXN1bHQpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbG9uZUJ1ZmZlcjtcbiIsImltcG9ydCByb290IGZyb20gJy4vX3Jvb3QuanMnO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBVaW50OEFycmF5ID0gcm9vdC5VaW50OEFycmF5O1xuXG5leHBvcnQgZGVmYXVsdCBVaW50OEFycmF5O1xuIiwiaW1wb3J0IFVpbnQ4QXJyYXkgZnJvbSAnLi9fVWludDhBcnJheS5qcyc7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIGBhcnJheUJ1ZmZlcmAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXlCdWZmZXJ9IGFycmF5QnVmZmVyIFRoZSBhcnJheSBidWZmZXIgdG8gY2xvbmUuXG4gKiBAcmV0dXJucyB7QXJyYXlCdWZmZXJ9IFJldHVybnMgdGhlIGNsb25lZCBhcnJheSBidWZmZXIuXG4gKi9cbmZ1bmN0aW9uIGNsb25lQXJyYXlCdWZmZXIoYXJyYXlCdWZmZXIpIHtcbiAgdmFyIHJlc3VsdCA9IG5ldyBhcnJheUJ1ZmZlci5jb25zdHJ1Y3RvcihhcnJheUJ1ZmZlci5ieXRlTGVuZ3RoKTtcbiAgbmV3IFVpbnQ4QXJyYXkocmVzdWx0KS5zZXQobmV3IFVpbnQ4QXJyYXkoYXJyYXlCdWZmZXIpKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xvbmVBcnJheUJ1ZmZlcjtcbiIsImltcG9ydCBjbG9uZUFycmF5QnVmZmVyIGZyb20gJy4vX2Nsb25lQXJyYXlCdWZmZXIuanMnO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgdHlwZWRBcnJheWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSB0eXBlZEFycmF5IFRoZSB0eXBlZCBhcnJheSB0byBjbG9uZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGVlcF0gU3BlY2lmeSBhIGRlZXAgY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjbG9uZWQgdHlwZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGNsb25lVHlwZWRBcnJheSh0eXBlZEFycmF5LCBpc0RlZXApIHtcbiAgdmFyIGJ1ZmZlciA9IGlzRGVlcCA/IGNsb25lQXJyYXlCdWZmZXIodHlwZWRBcnJheS5idWZmZXIpIDogdHlwZWRBcnJheS5idWZmZXI7XG4gIHJldHVybiBuZXcgdHlwZWRBcnJheS5jb25zdHJ1Y3RvcihidWZmZXIsIHR5cGVkQXJyYXkuYnl0ZU9mZnNldCwgdHlwZWRBcnJheS5sZW5ndGgpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbG9uZVR5cGVkQXJyYXk7XG4iLCJpbXBvcnQgYmFzZUNyZWF0ZSBmcm9tICcuL19iYXNlQ3JlYXRlLmpzJztcbmltcG9ydCBnZXRQcm90b3R5cGUgZnJvbSAnLi9fZ2V0UHJvdG90eXBlLmpzJztcbmltcG9ydCBpc1Byb3RvdHlwZSBmcm9tICcuL19pc1Byb3RvdHlwZS5qcyc7XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgYW4gb2JqZWN0IGNsb25lLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBpbml0aWFsaXplZCBjbG9uZS5cbiAqL1xuZnVuY3Rpb24gaW5pdENsb25lT2JqZWN0KG9iamVjdCkge1xuICByZXR1cm4gKHR5cGVvZiBvYmplY3QuY29uc3RydWN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNQcm90b3R5cGUob2JqZWN0KSlcbiAgICA/IGJhc2VDcmVhdGUoZ2V0UHJvdG90eXBlKG9iamVjdCkpXG4gICAgOiB7fTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaW5pdENsb25lT2JqZWN0O1xuIiwiLyoqXG4gKiBDcmVhdGVzIGEgYmFzZSBmdW5jdGlvbiBmb3IgbWV0aG9kcyBsaWtlIGBfLmZvckluYCBhbmQgYF8uZm9yT3duYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtib29sZWFufSBbZnJvbVJpZ2h0XSBTcGVjaWZ5IGl0ZXJhdGluZyBmcm9tIHJpZ2h0IHRvIGxlZnQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBiYXNlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVCYXNlRm9yKGZyb21SaWdodCkge1xuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0LCBpdGVyYXRlZSwga2V5c0Z1bmMpIHtcbiAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgaXRlcmFibGUgPSBPYmplY3Qob2JqZWN0KSxcbiAgICAgICAgcHJvcHMgPSBrZXlzRnVuYyhvYmplY3QpLFxuICAgICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG5cbiAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgIHZhciBrZXkgPSBwcm9wc1tmcm9tUmlnaHQgPyBsZW5ndGggOiArK2luZGV4XTtcbiAgICAgIGlmIChpdGVyYXRlZShpdGVyYWJsZVtrZXldLCBrZXksIGl0ZXJhYmxlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmplY3Q7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUJhc2VGb3I7XG4iLCJpbXBvcnQgY3JlYXRlQmFzZUZvciBmcm9tICcuL19jcmVhdGVCYXNlRm9yLmpzJztcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgYmFzZUZvck93bmAgd2hpY2ggaXRlcmF0ZXMgb3ZlciBgb2JqZWN0YFxuICogcHJvcGVydGllcyByZXR1cm5lZCBieSBga2V5c0Z1bmNgIGFuZCBpbnZva2VzIGBpdGVyYXRlZWAgZm9yIGVhY2ggcHJvcGVydHkuXG4gKiBJdGVyYXRlZSBmdW5jdGlvbnMgbWF5IGV4aXQgaXRlcmF0aW9uIGVhcmx5IGJ5IGV4cGxpY2l0bHkgcmV0dXJuaW5nIGBmYWxzZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHBhcmFtIHtGdW5jdGlvbn0ga2V5c0Z1bmMgVGhlIGZ1bmN0aW9uIHRvIGdldCB0aGUga2V5cyBvZiBgb2JqZWN0YC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbnZhciBiYXNlRm9yID0gY3JlYXRlQmFzZUZvcigpO1xuXG5leHBvcnQgZGVmYXVsdCBiYXNlRm9yO1xuIiwiaW1wb3J0IGJhc2VGb3IgZnJvbSAnLi9fYmFzZUZvci5qcyc7XG5pbXBvcnQga2V5cyBmcm9tICcuL2tleXMuanMnO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmZvck93bmAgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VGb3JPd24ob2JqZWN0LCBpdGVyYXRlZSkge1xuICByZXR1cm4gb2JqZWN0ICYmIGJhc2VGb3Iob2JqZWN0LCBpdGVyYXRlZSwga2V5cyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGJhc2VGb3JPd247XG4iLCJpbXBvcnQgaXNBcnJheUxpa2UgZnJvbSAnLi9pc0FycmF5TGlrZS5qcyc7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGBiYXNlRWFjaGAgb3IgYGJhc2VFYWNoUmlnaHRgIGZ1bmN0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlYWNoRnVuYyBUaGUgZnVuY3Rpb24gdG8gaXRlcmF0ZSBvdmVyIGEgY29sbGVjdGlvbi5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Zyb21SaWdodF0gU3BlY2lmeSBpdGVyYXRpbmcgZnJvbSByaWdodCB0byBsZWZ0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYmFzZSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQmFzZUVhY2goZWFjaEZ1bmMsIGZyb21SaWdodCkge1xuICByZXR1cm4gZnVuY3Rpb24oY29sbGVjdGlvbiwgaXRlcmF0ZWUpIHtcbiAgICBpZiAoY29sbGVjdGlvbiA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgICB9XG4gICAgaWYgKCFpc0FycmF5TGlrZShjb2xsZWN0aW9uKSkge1xuICAgICAgcmV0dXJuIGVhY2hGdW5jKGNvbGxlY3Rpb24sIGl0ZXJhdGVlKTtcbiAgICB9XG4gICAgdmFyIGxlbmd0aCA9IGNvbGxlY3Rpb24ubGVuZ3RoLFxuICAgICAgICBpbmRleCA9IGZyb21SaWdodCA/IGxlbmd0aCA6IC0xLFxuICAgICAgICBpdGVyYWJsZSA9IE9iamVjdChjb2xsZWN0aW9uKTtcblxuICAgIHdoaWxlICgoZnJvbVJpZ2h0ID8gaW5kZXgtLSA6ICsraW5kZXggPCBsZW5ndGgpKSB7XG4gICAgICBpZiAoaXRlcmF0ZWUoaXRlcmFibGVbaW5kZXhdLCBpbmRleCwgaXRlcmFibGUpID09PSBmYWxzZSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUJhc2VFYWNoO1xuIiwiaW1wb3J0IGJhc2VGb3JPd24gZnJvbSAnLi9fYmFzZUZvck93bi5qcyc7XG5pbXBvcnQgY3JlYXRlQmFzZUVhY2ggZnJvbSAnLi9fY3JlYXRlQmFzZUVhY2guanMnO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmZvckVhY2hgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheXxPYmplY3R9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheXxPYmplY3R9IFJldHVybnMgYGNvbGxlY3Rpb25gLlxuICovXG52YXIgYmFzZUVhY2ggPSBjcmVhdGVCYXNlRWFjaChiYXNlRm9yT3duKTtcblxuZXhwb3J0IGRlZmF1bHQgYmFzZUVhY2g7XG4iLCJpbXBvcnQgYmFzZUFzc2lnblZhbHVlIGZyb20gJy4vX2Jhc2VBc3NpZ25WYWx1ZS5qcyc7XG5pbXBvcnQgZXEgZnJvbSAnLi9lcS5qcyc7XG5cbi8qKlxuICogVGhpcyBmdW5jdGlvbiBpcyBsaWtlIGBhc3NpZ25WYWx1ZWAgZXhjZXB0IHRoYXQgaXQgZG9lc24ndCBhc3NpZ25cbiAqIGB1bmRlZmluZWRgIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gYXNzaWduLlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gYXNzaWduLlxuICovXG5mdW5jdGlvbiBhc3NpZ25NZXJnZVZhbHVlKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICBpZiAoKHZhbHVlICE9PSB1bmRlZmluZWQgJiYgIWVxKG9iamVjdFtrZXldLCB2YWx1ZSkpIHx8XG4gICAgICAodmFsdWUgPT09IHVuZGVmaW5lZCAmJiAhKGtleSBpbiBvYmplY3QpKSkge1xuICAgIGJhc2VBc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgdmFsdWUpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzc2lnbk1lcmdlVmFsdWU7XG4iLCJpbXBvcnQgaXNBcnJheUxpa2UgZnJvbSAnLi9pc0FycmF5TGlrZS5qcyc7XG5pbXBvcnQgaXNPYmplY3RMaWtlIGZyb20gJy4vaXNPYmplY3RMaWtlLmpzJztcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLmlzQXJyYXlMaWtlYCBleGNlcHQgdGhhdCBpdCBhbHNvIGNoZWNrcyBpZiBgdmFsdWVgXG4gKiBpcyBhbiBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYXJyYXktbGlrZSBvYmplY3QsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZU9iamVjdChkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlT2JqZWN0KCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5TGlrZU9iamVjdChfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUxpa2VPYmplY3QodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgaXNBcnJheUxpa2UodmFsdWUpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpc0FycmF5TGlrZU9iamVjdDtcbiIsIi8qKlxuICogR2V0cyB0aGUgdmFsdWUgYXQgYGtleWAsIHVubGVzcyBga2V5YCBpcyBcIl9fcHJvdG9fX1wiIG9yIFwiY29uc3RydWN0b3JcIi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcHJvcGVydHkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIHNhZmVHZXQob2JqZWN0LCBrZXkpIHtcbiAgaWYgKGtleSA9PT0gJ2NvbnN0cnVjdG9yJyAmJiB0eXBlb2Ygb2JqZWN0W2tleV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoa2V5ID09ICdfX3Byb3RvX18nKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcmV0dXJuIG9iamVjdFtrZXldO1xufVxuXG5leHBvcnQgZGVmYXVsdCBzYWZlR2V0O1xuIiwiaW1wb3J0IGNvcHlPYmplY3QgZnJvbSAnLi9fY29weU9iamVjdC5qcyc7XG5pbXBvcnQga2V5c0luIGZyb20gJy4va2V5c0luLmpzJztcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgcGxhaW4gb2JqZWN0IGZsYXR0ZW5pbmcgaW5oZXJpdGVkIGVudW1lcmFibGUgc3RyaW5nXG4gKiBrZXllZCBwcm9wZXJ0aWVzIG9mIGB2YWx1ZWAgdG8gb3duIHByb3BlcnRpZXMgb2YgdGhlIHBsYWluIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBwbGFpbiBvYmplY3QuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5iID0gMjtcbiAqIH1cbiAqXG4gKiBGb28ucHJvdG90eXBlLmMgPSAzO1xuICpcbiAqIF8uYXNzaWduKHsgJ2EnOiAxIH0sIG5ldyBGb28pO1xuICogLy8gPT4geyAnYSc6IDEsICdiJzogMiB9XG4gKlxuICogXy5hc3NpZ24oeyAnYSc6IDEgfSwgXy50b1BsYWluT2JqZWN0KG5ldyBGb28pKTtcbiAqIC8vID0+IHsgJ2EnOiAxLCAnYic6IDIsICdjJzogMyB9XG4gKi9cbmZ1bmN0aW9uIHRvUGxhaW5PYmplY3QodmFsdWUpIHtcbiAgcmV0dXJuIGNvcHlPYmplY3QodmFsdWUsIGtleXNJbih2YWx1ZSkpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB0b1BsYWluT2JqZWN0O1xuIiwiaW1wb3J0IGFzc2lnbk1lcmdlVmFsdWUgZnJvbSAnLi9fYXNzaWduTWVyZ2VWYWx1ZS5qcyc7XG5pbXBvcnQgY2xvbmVCdWZmZXIgZnJvbSAnLi9fY2xvbmVCdWZmZXIuanMnO1xuaW1wb3J0IGNsb25lVHlwZWRBcnJheSBmcm9tICcuL19jbG9uZVR5cGVkQXJyYXkuanMnO1xuaW1wb3J0IGNvcHlBcnJheSBmcm9tICcuL19jb3B5QXJyYXkuanMnO1xuaW1wb3J0IGluaXRDbG9uZU9iamVjdCBmcm9tICcuL19pbml0Q2xvbmVPYmplY3QuanMnO1xuaW1wb3J0IGlzQXJndW1lbnRzIGZyb20gJy4vaXNBcmd1bWVudHMuanMnO1xuaW1wb3J0IGlzQXJyYXkgZnJvbSAnLi9pc0FycmF5LmpzJztcbmltcG9ydCBpc0FycmF5TGlrZU9iamVjdCBmcm9tICcuL2lzQXJyYXlMaWtlT2JqZWN0LmpzJztcbmltcG9ydCBpc0J1ZmZlciBmcm9tICcuL2lzQnVmZmVyLmpzJztcbmltcG9ydCBpc0Z1bmN0aW9uIGZyb20gJy4vaXNGdW5jdGlvbi5qcyc7XG5pbXBvcnQgaXNPYmplY3QgZnJvbSAnLi9pc09iamVjdC5qcyc7XG5pbXBvcnQgaXNQbGFpbk9iamVjdCBmcm9tICcuL2lzUGxhaW5PYmplY3QuanMnO1xuaW1wb3J0IGlzVHlwZWRBcnJheSBmcm9tICcuL2lzVHlwZWRBcnJheS5qcyc7XG5pbXBvcnQgc2FmZUdldCBmcm9tICcuL19zYWZlR2V0LmpzJztcbmltcG9ydCB0b1BsYWluT2JqZWN0IGZyb20gJy4vdG9QbGFpbk9iamVjdC5qcyc7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlTWVyZ2VgIGZvciBhcnJheXMgYW5kIG9iamVjdHMgd2hpY2ggcGVyZm9ybXNcbiAqIGRlZXAgbWVyZ2VzIGFuZCB0cmFja3MgdHJhdmVyc2VkIG9iamVjdHMgZW5hYmxpbmcgb2JqZWN0cyB3aXRoIGNpcmN1bGFyXG4gKiByZWZlcmVuY2VzIHRvIGJlIG1lcmdlZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgc291cmNlIG9iamVjdC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gbWVyZ2UuXG4gKiBAcGFyYW0ge251bWJlcn0gc3JjSW5kZXggVGhlIGluZGV4IG9mIGBzb3VyY2VgLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gbWVyZ2VGdW5jIFRoZSBmdW5jdGlvbiB0byBtZXJnZSB2YWx1ZXMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBhc3NpZ25lZCB2YWx1ZXMuXG4gKiBAcGFyYW0ge09iamVjdH0gW3N0YWNrXSBUcmFja3MgdHJhdmVyc2VkIHNvdXJjZSB2YWx1ZXMgYW5kIHRoZWlyIG1lcmdlZFxuICogIGNvdW50ZXJwYXJ0cy5cbiAqL1xuZnVuY3Rpb24gYmFzZU1lcmdlRGVlcChvYmplY3QsIHNvdXJjZSwga2V5LCBzcmNJbmRleCwgbWVyZ2VGdW5jLCBjdXN0b21pemVyLCBzdGFjaykge1xuICB2YXIgb2JqVmFsdWUgPSBzYWZlR2V0KG9iamVjdCwga2V5KSxcbiAgICAgIHNyY1ZhbHVlID0gc2FmZUdldChzb3VyY2UsIGtleSksXG4gICAgICBzdGFja2VkID0gc3RhY2suZ2V0KHNyY1ZhbHVlKTtcblxuICBpZiAoc3RhY2tlZCkge1xuICAgIGFzc2lnbk1lcmdlVmFsdWUob2JqZWN0LCBrZXksIHN0YWNrZWQpO1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgbmV3VmFsdWUgPSBjdXN0b21pemVyXG4gICAgPyBjdXN0b21pemVyKG9ialZhbHVlLCBzcmNWYWx1ZSwgKGtleSArICcnKSwgb2JqZWN0LCBzb3VyY2UsIHN0YWNrKVxuICAgIDogdW5kZWZpbmVkO1xuXG4gIHZhciBpc0NvbW1vbiA9IG5ld1ZhbHVlID09PSB1bmRlZmluZWQ7XG5cbiAgaWYgKGlzQ29tbW9uKSB7XG4gICAgdmFyIGlzQXJyID0gaXNBcnJheShzcmNWYWx1ZSksXG4gICAgICAgIGlzQnVmZiA9ICFpc0FyciAmJiBpc0J1ZmZlcihzcmNWYWx1ZSksXG4gICAgICAgIGlzVHlwZWQgPSAhaXNBcnIgJiYgIWlzQnVmZiAmJiBpc1R5cGVkQXJyYXkoc3JjVmFsdWUpO1xuXG4gICAgbmV3VmFsdWUgPSBzcmNWYWx1ZTtcbiAgICBpZiAoaXNBcnIgfHwgaXNCdWZmIHx8IGlzVHlwZWQpIHtcbiAgICAgIGlmIChpc0FycmF5KG9ialZhbHVlKSkge1xuICAgICAgICBuZXdWYWx1ZSA9IG9ialZhbHVlO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoaXNBcnJheUxpa2VPYmplY3Qob2JqVmFsdWUpKSB7XG4gICAgICAgIG5ld1ZhbHVlID0gY29weUFycmF5KG9ialZhbHVlKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKGlzQnVmZikge1xuICAgICAgICBpc0NvbW1vbiA9IGZhbHNlO1xuICAgICAgICBuZXdWYWx1ZSA9IGNsb25lQnVmZmVyKHNyY1ZhbHVlLCB0cnVlKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKGlzVHlwZWQpIHtcbiAgICAgICAgaXNDb21tb24gPSBmYWxzZTtcbiAgICAgICAgbmV3VmFsdWUgPSBjbG9uZVR5cGVkQXJyYXkoc3JjVmFsdWUsIHRydWUpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIG5ld1ZhbHVlID0gW107XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzUGxhaW5PYmplY3Qoc3JjVmFsdWUpIHx8IGlzQXJndW1lbnRzKHNyY1ZhbHVlKSkge1xuICAgICAgbmV3VmFsdWUgPSBvYmpWYWx1ZTtcbiAgICAgIGlmIChpc0FyZ3VtZW50cyhvYmpWYWx1ZSkpIHtcbiAgICAgICAgbmV3VmFsdWUgPSB0b1BsYWluT2JqZWN0KG9ialZhbHVlKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKCFpc09iamVjdChvYmpWYWx1ZSkgfHwgaXNGdW5jdGlvbihvYmpWYWx1ZSkpIHtcbiAgICAgICAgbmV3VmFsdWUgPSBpbml0Q2xvbmVPYmplY3Qoc3JjVmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGlzQ29tbW9uID0gZmFsc2U7XG4gICAgfVxuICB9XG4gIGlmIChpc0NvbW1vbikge1xuICAgIC8vIFJlY3Vyc2l2ZWx5IG1lcmdlIG9iamVjdHMgYW5kIGFycmF5cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgIHN0YWNrLnNldChzcmNWYWx1ZSwgbmV3VmFsdWUpO1xuICAgIG1lcmdlRnVuYyhuZXdWYWx1ZSwgc3JjVmFsdWUsIHNyY0luZGV4LCBjdXN0b21pemVyLCBzdGFjayk7XG4gICAgc3RhY2tbJ2RlbGV0ZSddKHNyY1ZhbHVlKTtcbiAgfVxuICBhc3NpZ25NZXJnZVZhbHVlKG9iamVjdCwga2V5LCBuZXdWYWx1ZSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGJhc2VNZXJnZURlZXA7XG4iLCJpbXBvcnQgU3RhY2sgZnJvbSAnLi9fU3RhY2suanMnO1xuaW1wb3J0IGFzc2lnbk1lcmdlVmFsdWUgZnJvbSAnLi9fYXNzaWduTWVyZ2VWYWx1ZS5qcyc7XG5pbXBvcnQgYmFzZUZvciBmcm9tICcuL19iYXNlRm9yLmpzJztcbmltcG9ydCBiYXNlTWVyZ2VEZWVwIGZyb20gJy4vX2Jhc2VNZXJnZURlZXAuanMnO1xuaW1wb3J0IGlzT2JqZWN0IGZyb20gJy4vaXNPYmplY3QuanMnO1xuaW1wb3J0IGtleXNJbiBmcm9tICcuL2tleXNJbi5qcyc7XG5pbXBvcnQgc2FmZUdldCBmcm9tICcuL19zYWZlR2V0LmpzJztcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5tZXJnZWAgd2l0aG91dCBzdXBwb3J0IGZvciBtdWx0aXBsZSBzb3VyY2VzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHBhcmFtIHtudW1iZXJ9IHNyY0luZGV4IFRoZSBpbmRleCBvZiBgc291cmNlYC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIG1lcmdlZCB2YWx1ZXMuXG4gKiBAcGFyYW0ge09iamVjdH0gW3N0YWNrXSBUcmFja3MgdHJhdmVyc2VkIHNvdXJjZSB2YWx1ZXMgYW5kIHRoZWlyIG1lcmdlZFxuICogIGNvdW50ZXJwYXJ0cy5cbiAqL1xuZnVuY3Rpb24gYmFzZU1lcmdlKG9iamVjdCwgc291cmNlLCBzcmNJbmRleCwgY3VzdG9taXplciwgc3RhY2spIHtcbiAgaWYgKG9iamVjdCA9PT0gc291cmNlKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGJhc2VGb3Ioc291cmNlLCBmdW5jdGlvbihzcmNWYWx1ZSwga2V5KSB7XG4gICAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcbiAgICBpZiAoaXNPYmplY3Qoc3JjVmFsdWUpKSB7XG4gICAgICBiYXNlTWVyZ2VEZWVwKG9iamVjdCwgc291cmNlLCBrZXksIHNyY0luZGV4LCBiYXNlTWVyZ2UsIGN1c3RvbWl6ZXIsIHN0YWNrKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXIgbmV3VmFsdWUgPSBjdXN0b21pemVyXG4gICAgICAgID8gY3VzdG9taXplcihzYWZlR2V0KG9iamVjdCwga2V5KSwgc3JjVmFsdWUsIChrZXkgKyAnJyksIG9iamVjdCwgc291cmNlLCBzdGFjaylcbiAgICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgICAgIGlmIChuZXdWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG5ld1ZhbHVlID0gc3JjVmFsdWU7XG4gICAgICB9XG4gICAgICBhc3NpZ25NZXJnZVZhbHVlKG9iamVjdCwga2V5LCBuZXdWYWx1ZSk7XG4gICAgfVxuICB9LCBrZXlzSW4pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBiYXNlTWVyZ2U7XG4iLCJpbXBvcnQgYmFzZU1lcmdlIGZyb20gJy4vX2Jhc2VNZXJnZS5qcyc7XG5pbXBvcnQgaXNPYmplY3QgZnJvbSAnLi9pc09iamVjdC5qcyc7XG5cbi8qKlxuICogVXNlZCBieSBgXy5kZWZhdWx0c0RlZXBgIHRvIGN1c3RvbWl6ZSBpdHMgYF8ubWVyZ2VgIHVzZSB0byBtZXJnZSBzb3VyY2VcbiAqIG9iamVjdHMgaW50byBkZXN0aW5hdGlvbiBvYmplY3RzIHRoYXQgYXJlIHBhc3NlZCB0aHJ1LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IG9ialZhbHVlIFRoZSBkZXN0aW5hdGlvbiB2YWx1ZS5cbiAqIEBwYXJhbSB7Kn0gc3JjVmFsdWUgVGhlIHNvdXJjZSB2YWx1ZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gbWVyZ2UuXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBwYXJlbnQgb2JqZWN0IG9mIGBvYmpWYWx1ZWAuXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBwYXJlbnQgb2JqZWN0IG9mIGBzcmNWYWx1ZWAuXG4gKiBAcGFyYW0ge09iamVjdH0gW3N0YWNrXSBUcmFja3MgdHJhdmVyc2VkIHNvdXJjZSB2YWx1ZXMgYW5kIHRoZWlyIG1lcmdlZFxuICogIGNvdW50ZXJwYXJ0cy5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSB2YWx1ZSB0byBhc3NpZ24uXG4gKi9cbmZ1bmN0aW9uIGN1c3RvbURlZmF1bHRzTWVyZ2Uob2JqVmFsdWUsIHNyY1ZhbHVlLCBrZXksIG9iamVjdCwgc291cmNlLCBzdGFjaykge1xuICBpZiAoaXNPYmplY3Qob2JqVmFsdWUpICYmIGlzT2JqZWN0KHNyY1ZhbHVlKSkge1xuICAgIC8vIFJlY3Vyc2l2ZWx5IG1lcmdlIG9iamVjdHMgYW5kIGFycmF5cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgIHN0YWNrLnNldChzcmNWYWx1ZSwgb2JqVmFsdWUpO1xuICAgIGJhc2VNZXJnZShvYmpWYWx1ZSwgc3JjVmFsdWUsIHVuZGVmaW5lZCwgY3VzdG9tRGVmYXVsdHNNZXJnZSwgc3RhY2spO1xuICAgIHN0YWNrWydkZWxldGUnXShzcmNWYWx1ZSk7XG4gIH1cbiAgcmV0dXJuIG9ialZhbHVlO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjdXN0b21EZWZhdWx0c01lcmdlO1xuIiwiaW1wb3J0IGJhc2VNZXJnZSBmcm9tICcuL19iYXNlTWVyZ2UuanMnO1xuaW1wb3J0IGNyZWF0ZUFzc2lnbmVyIGZyb20gJy4vX2NyZWF0ZUFzc2lnbmVyLmpzJztcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLm1lcmdlYCBleGNlcHQgdGhhdCBpdCBhY2NlcHRzIGBjdXN0b21pemVyYCB3aGljaFxuICogaXMgaW52b2tlZCB0byBwcm9kdWNlIHRoZSBtZXJnZWQgdmFsdWVzIG9mIHRoZSBkZXN0aW5hdGlvbiBhbmQgc291cmNlXG4gKiBwcm9wZXJ0aWVzLiBJZiBgY3VzdG9taXplcmAgcmV0dXJucyBgdW5kZWZpbmVkYCwgbWVyZ2luZyBpcyBoYW5kbGVkIGJ5IHRoZVxuICogbWV0aG9kIGluc3RlYWQuIFRoZSBgY3VzdG9taXplcmAgaXMgaW52b2tlZCB3aXRoIHNpeCBhcmd1bWVudHM6XG4gKiAob2JqVmFsdWUsIHNyY1ZhbHVlLCBrZXksIG9iamVjdCwgc291cmNlLCBzdGFjaykuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIG11dGF0ZXMgYG9iamVjdGAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHsuLi5PYmplY3R9IHNvdXJjZXMgVGhlIHNvdXJjZSBvYmplY3RzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGFzc2lnbmVkIHZhbHVlcy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIGN1c3RvbWl6ZXIob2JqVmFsdWUsIHNyY1ZhbHVlKSB7XG4gKiAgIGlmIChfLmlzQXJyYXkob2JqVmFsdWUpKSB7XG4gKiAgICAgcmV0dXJuIG9ialZhbHVlLmNvbmNhdChzcmNWYWx1ZSk7XG4gKiAgIH1cbiAqIH1cbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IFsxXSwgJ2InOiBbMl0gfTtcbiAqIHZhciBvdGhlciA9IHsgJ2EnOiBbM10sICdiJzogWzRdIH07XG4gKlxuICogXy5tZXJnZVdpdGgob2JqZWN0LCBvdGhlciwgY3VzdG9taXplcik7XG4gKiAvLyA9PiB7ICdhJzogWzEsIDNdLCAnYic6IFsyLCA0XSB9XG4gKi9cbnZhciBtZXJnZVdpdGggPSBjcmVhdGVBc3NpZ25lcihmdW5jdGlvbihvYmplY3QsIHNvdXJjZSwgc3JjSW5kZXgsIGN1c3RvbWl6ZXIpIHtcbiAgYmFzZU1lcmdlKG9iamVjdCwgc291cmNlLCBzcmNJbmRleCwgY3VzdG9taXplcik7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgbWVyZ2VXaXRoO1xuIiwiaW1wb3J0IGFwcGx5IGZyb20gJy4vX2FwcGx5LmpzJztcbmltcG9ydCBiYXNlUmVzdCBmcm9tICcuL19iYXNlUmVzdC5qcyc7XG5pbXBvcnQgY3VzdG9tRGVmYXVsdHNNZXJnZSBmcm9tICcuL19jdXN0b21EZWZhdWx0c01lcmdlLmpzJztcbmltcG9ydCBtZXJnZVdpdGggZnJvbSAnLi9tZXJnZVdpdGguanMnO1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8uZGVmYXVsdHNgIGV4Y2VwdCB0aGF0IGl0IHJlY3Vyc2l2ZWx5IGFzc2lnbnNcbiAqIGRlZmF1bHQgcHJvcGVydGllcy5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgbXV0YXRlcyBgb2JqZWN0YC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMTAuMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHsuLi5PYmplY3R9IFtzb3VyY2VzXSBUaGUgc291cmNlIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICogQHNlZSBfLmRlZmF1bHRzXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZGVmYXVsdHNEZWVwKHsgJ2EnOiB7ICdiJzogMiB9IH0sIHsgJ2EnOiB7ICdiJzogMSwgJ2MnOiAzIH0gfSk7XG4gKiAvLyA9PiB7ICdhJzogeyAnYic6IDIsICdjJzogMyB9IH1cbiAqL1xudmFyIGRlZmF1bHRzRGVlcCA9IGJhc2VSZXN0KGZ1bmN0aW9uKGFyZ3MpIHtcbiAgYXJncy5wdXNoKHVuZGVmaW5lZCwgY3VzdG9tRGVmYXVsdHNNZXJnZSk7XG4gIHJldHVybiBhcHBseShtZXJnZVdpdGgsIHVuZGVmaW5lZCwgYXJncyk7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmYXVsdHNEZWVwO1xuIiwiaW1wb3J0IGlkZW50aXR5IGZyb20gJy4vaWRlbnRpdHkuanMnO1xuXG4vKipcbiAqIENhc3RzIGB2YWx1ZWAgdG8gYGlkZW50aXR5YCBpZiBpdCdzIG5vdCBhIGZ1bmN0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBpbnNwZWN0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIGNhc3QgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNhc3RGdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdmdW5jdGlvbicgPyB2YWx1ZSA6IGlkZW50aXR5O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjYXN0RnVuY3Rpb247XG4iLCJpbXBvcnQgYXJyYXlFYWNoIGZyb20gJy4vX2FycmF5RWFjaC5qcyc7XG5pbXBvcnQgYmFzZUVhY2ggZnJvbSAnLi9fYmFzZUVhY2guanMnO1xuaW1wb3J0IGNhc3RGdW5jdGlvbiBmcm9tICcuL19jYXN0RnVuY3Rpb24uanMnO1xuaW1wb3J0IGlzQXJyYXkgZnJvbSAnLi9pc0FycmF5LmpzJztcblxuLyoqXG4gKiBJdGVyYXRlcyBvdmVyIGVsZW1lbnRzIG9mIGBjb2xsZWN0aW9uYCBhbmQgaW52b2tlcyBgaXRlcmF0ZWVgIGZvciBlYWNoIGVsZW1lbnQuXG4gKiBUaGUgaXRlcmF0ZWUgaXMgaW52b2tlZCB3aXRoIHRocmVlIGFyZ3VtZW50czogKHZhbHVlLCBpbmRleHxrZXksIGNvbGxlY3Rpb24pLlxuICogSXRlcmF0ZWUgZnVuY3Rpb25zIG1heSBleGl0IGl0ZXJhdGlvbiBlYXJseSBieSBleHBsaWNpdGx5IHJldHVybmluZyBgZmFsc2VgLlxuICpcbiAqICoqTm90ZToqKiBBcyB3aXRoIG90aGVyIFwiQ29sbGVjdGlvbnNcIiBtZXRob2RzLCBvYmplY3RzIHdpdGggYSBcImxlbmd0aFwiXG4gKiBwcm9wZXJ0eSBhcmUgaXRlcmF0ZWQgbGlrZSBhcnJheXMuIFRvIGF2b2lkIHRoaXMgYmVoYXZpb3IgdXNlIGBfLmZvckluYFxuICogb3IgYF8uZm9yT3duYCBmb3Igb2JqZWN0IGl0ZXJhdGlvbi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAYWxpYXMgZWFjaFxuICogQGNhdGVnb3J5IENvbGxlY3Rpb25cbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtpdGVyYXRlZT1fLmlkZW50aXR5XSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fE9iamVjdH0gUmV0dXJucyBgY29sbGVjdGlvbmAuXG4gKiBAc2VlIF8uZm9yRWFjaFJpZ2h0XG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZm9yRWFjaChbMSwgMl0sIGZ1bmN0aW9uKHZhbHVlKSB7XG4gKiAgIGNvbnNvbGUubG9nKHZhbHVlKTtcbiAqIH0pO1xuICogLy8gPT4gTG9ncyBgMWAgdGhlbiBgMmAuXG4gKlxuICogXy5mb3JFYWNoKHsgJ2EnOiAxLCAnYic6IDIgfSwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICogICBjb25zb2xlLmxvZyhrZXkpO1xuICogfSk7XG4gKiAvLyA9PiBMb2dzICdhJyB0aGVuICdiJyAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKS5cbiAqL1xuZnVuY3Rpb24gZm9yRWFjaChjb2xsZWN0aW9uLCBpdGVyYXRlZSkge1xuICB2YXIgZnVuYyA9IGlzQXJyYXkoY29sbGVjdGlvbikgPyBhcnJheUVhY2ggOiBiYXNlRWFjaDtcbiAgcmV0dXJuIGZ1bmMoY29sbGVjdGlvbiwgY2FzdEZ1bmN0aW9uKGl0ZXJhdGVlKSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZvckVhY2g7XG4iLCJpbXBvcnQgYmFzZU1lcmdlIGZyb20gJy4vX2Jhc2VNZXJnZS5qcyc7XG5pbXBvcnQgY3JlYXRlQXNzaWduZXIgZnJvbSAnLi9fY3JlYXRlQXNzaWduZXIuanMnO1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8uYXNzaWduYCBleGNlcHQgdGhhdCBpdCByZWN1cnNpdmVseSBtZXJnZXMgb3duIGFuZFxuICogaW5oZXJpdGVkIGVudW1lcmFibGUgc3RyaW5nIGtleWVkIHByb3BlcnRpZXMgb2Ygc291cmNlIG9iamVjdHMgaW50byB0aGVcbiAqIGRlc3RpbmF0aW9uIG9iamVjdC4gU291cmNlIHByb3BlcnRpZXMgdGhhdCByZXNvbHZlIHRvIGB1bmRlZmluZWRgIGFyZVxuICogc2tpcHBlZCBpZiBhIGRlc3RpbmF0aW9uIHZhbHVlIGV4aXN0cy4gQXJyYXkgYW5kIHBsYWluIG9iamVjdCBwcm9wZXJ0aWVzXG4gKiBhcmUgbWVyZ2VkIHJlY3Vyc2l2ZWx5LiBPdGhlciBvYmplY3RzIGFuZCB2YWx1ZSB0eXBlcyBhcmUgb3ZlcnJpZGRlbiBieVxuICogYXNzaWdubWVudC4gU291cmNlIG9iamVjdHMgYXJlIGFwcGxpZWQgZnJvbSBsZWZ0IHRvIHJpZ2h0LiBTdWJzZXF1ZW50XG4gKiBzb3VyY2VzIG92ZXJ3cml0ZSBwcm9wZXJ0eSBhc3NpZ25tZW50cyBvZiBwcmV2aW91cyBzb3VyY2VzLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBtdXRhdGVzIGBvYmplY3RgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC41LjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7Li4uT2JqZWN0fSBbc291cmNlc10gVGhlIHNvdXJjZSBvYmplY3RzLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHtcbiAqICAgJ2EnOiBbeyAnYic6IDIgfSwgeyAnZCc6IDQgfV1cbiAqIH07XG4gKlxuICogdmFyIG90aGVyID0ge1xuICogICAnYSc6IFt7ICdjJzogMyB9LCB7ICdlJzogNSB9XVxuICogfTtcbiAqXG4gKiBfLm1lcmdlKG9iamVjdCwgb3RoZXIpO1xuICogLy8gPT4geyAnYSc6IFt7ICdiJzogMiwgJ2MnOiAzIH0sIHsgJ2QnOiA0LCAnZSc6IDUgfV0gfVxuICovXG52YXIgbWVyZ2UgPSBjcmVhdGVBc3NpZ25lcihmdW5jdGlvbihvYmplY3QsIHNvdXJjZSwgc3JjSW5kZXgpIHtcbiAgYmFzZU1lcmdlKG9iamVjdCwgc291cmNlLCBzcmNJbmRleCk7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgbWVyZ2U7XG4iLCIvKipcclxuICogUGFydCBvZiBzdGFydGVyIHByb2plY3QuXHJcbiAqXHJcbiAqIEBjb3B5cmlnaHQgIENvcHlyaWdodCAoQykgMjAyMSBfX09SR0FOSVpBVElPTl9fLlxyXG4gKiBAbGljZW5zZSAgICBfX0xJQ0VOU0VfX1xyXG4gKi9cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXREYXRhKGVsZW1lbnQsIG5hbWUpIHtcclxuICBwcmVwYXJlRGF0YShlbGVtZW50KTtcclxuICByZXR1cm4gZWxlbWVudC5fX3VuaWNvcm5bbmFtZV07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXREYXRhKGVsZW1lbnQsIG5hbWUsIHZhbHVlKSB7XHJcbiAgcHJlcGFyZURhdGEoZWxlbWVudCk7XHJcbiAgZWxlbWVudC5fX3VuaWNvcm5bbmFtZV0gPSB2YWx1ZTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRlZkRhdGEoZWxlbWVudCwgbmFtZSwgZGVmQ2FsbGJhY2spIHtcclxuICBwcmVwYXJlRGF0YShlbGVtZW50KTtcclxuICBlbGVtZW50Ll9fdW5pY29ybltuYW1lXSA9IGVsZW1lbnQuX191bmljb3JuW25hbWVdIHx8IGRlZkNhbGxiYWNrKCk7XHJcblxyXG4gIHJldHVybiBlbGVtZW50Ll9fdW5pY29ybltuYW1lXTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHByZXBhcmVEYXRhKGVsZW1lbnQpIHtcclxuICBpZiAoIWVsZW1lbnQpIHtcclxuICAgIHJldHVybiBlbGVtZW50O1xyXG4gIH1cclxuXHJcbiAgZWxlbWVudC5fX3VuaWNvcm4gPSBlbGVtZW50Ll9fdW5pY29ybiB8fCB7fTtcclxuICByZXR1cm4gZWxlbWVudDtcclxufVxyXG4iLCIvKipcclxuICogUGFydCBvZiBVbmljb3JuIHByb2plY3QuXHJcbiAqXHJcbiAqIEBjb3B5cmlnaHQgIENvcHlyaWdodCAoQykgMjAxNiBMWVJBU09GVC4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuICogQGxpY2Vuc2UgICAgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAyIG9yIGxhdGVyLlxyXG4gKi9cclxuXHJcbmltcG9ydCB7IG1lcmdlIH0gZnJvbSAnbG9kYXNoLWVzJztcclxuaW1wb3J0IHsgZGVmRGF0YSB9IGZyb20gJy4uL3V0aWxpdGllcy5qcyc7XHJcblxyXG4vKipcclxuICogVW5pY29ybkdyaWRcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFVuaWNvcm5HcmlkIHtcclxuICBzdGF0aWMgZ2V0IGlzKCkgeyByZXR1cm4gJ2dyaWQnOyB9XHJcblxyXG4gIHN0YXRpYyBpbnN0YWxsKGFwcCwgb3B0aW9ucyA9IHt9KSB7XHJcbiAgICBhcHAuZ3JpZCA9IChlbGUsIG9wdGlvbnMgPSB7fSkgPT4ge1xyXG4gICAgICBjb25zdCBzZWxlY3RvciA9IHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogbnVsbDtcclxuICAgICAgZWxlID0gYXBwLnNlbGVjdE9uZShlbGUpO1xyXG5cclxuICAgICAgcmV0dXJuIGRlZkRhdGEoXHJcbiAgICAgICAgZWxlLFxyXG4gICAgICAgICdncmlkLnBsdWdpbicsXHJcbiAgICAgICAgKCkgPT4gbmV3IFVuaWNvcm5HcmlkRWxlbWVudChzZWxlY3RvciwgZWxlLCBvcHRpb25zLCBhcHApXHJcbiAgICAgICk7XHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuY2xhc3MgVW5pY29ybkdyaWRFbGVtZW50IHtcclxuICBvcmRlcmluZyA9ICcnO1xyXG5cclxuICBzdGF0aWMgZ2V0IGRlZmF1bHRPcHRpb25zKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgLy9cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbnN0cnVjdG9yKHNlbGVjdG9yLCBlbGVtZW50LCBvcHRpb25zLCBhcHApIHtcclxuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICB0aGlzLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmNvbnN0cnVjdG9yLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcclxuICAgIHRoaXMuYXBwID0gYXBwO1xyXG4gICAgdGhpcy5mb3JtID0gYXBwLmZvcm0oc2VsZWN0b3IgfHwgZWxlbWVudCk7XHJcblxyXG4gICAgaWYgKCF0aGlzLmZvcm0pIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmljb3JuR3JpZCBpcyBkZXBlbmRlbnQgb24gVW5pY29ybkZvcm0nKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnRzKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTdGFydCB0aGlzIG9iamVjdCBhbmQgZXZlbnRzLlxyXG4gICAqL1xyXG4gIHJlZ2lzdGVyRXZlbnRzKCkge1xyXG4gICAgLy8gdGhpcy5zZWFyY2hDbGVhckJ1dHRvbi5jbGljaygoKSA9PiB7XHJcbiAgICAvLyAgIHRoaXMuc2VhcmNoQ29udGFpbmVyLmZpbmQoJ2lucHV0LCB0ZXh0YXJlYSwgc2VsZWN0JykudmFsKCcnKTtcclxuICAgIC8vICAgdGhpcy5maWx0ZXJDb250YWluZXIuZmluZCgnaW5wdXQsIHRleHRhcmVhLCBzZWxlY3QnKS52YWwoJycpO1xyXG4gICAgLy9cclxuICAgIC8vICAgdGhpcy5mb3JtLnN1Ym1pdCgpO1xyXG4gICAgLy8gfSk7XHJcbiAgICAvL1xyXG4gICAgLy8gdGhpcy5maWx0ZXJCdXR0b24uY2xpY2soZXZlbnQgPT4ge1xyXG4gICAgLy8gICB0aGlzLnRvZ2dsZUZpbHRlcigpO1xyXG4gICAgLy8gICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIC8vICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIC8vIH0pO1xyXG4gICAgLy9cclxuICAgIC8vIHRoaXMuc29ydEJ1dHRvbnMuY2xpY2soZXZlbnQgPT4ge1xyXG4gICAgLy8gICBzZWxmLnNvcnQoZXZlbnQuY3VycmVudFRhcmdldCwgZXZlbnQpO1xyXG4gICAgLy8gfSk7XHJcbiAgfVxyXG5cclxuICAvLyByZWdpc3RlckN1c3RvbUVsZW1lbnRzKCkge1xyXG4gIC8vICAgcmV0dXJuIGFwcC5pbXBvcnQoJ0B1bmljb3JuL3VpL2dyaWQtY29tcG9uZW50cy5qcycpO1xyXG4gIC8vIH1cclxuXHJcbiAgaW5pdENvbXBvbmVudChzdG9yZSA9ICdncmlkJywgY3VzdG9tID0ge30pIHtcclxuICAgIHRoaXMub3JkZXJpbmcgPSB0aGlzLmVsZW1lbnQuZGF0YXNldC5vcmRlcmluZztcclxuXHJcbiAgICBpZiAoIXRoaXMub3JkZXJpbmcudG9Mb3dlckNhc2UoKS5lbmRzV2l0aCgnIGFzYycpXHJcbiAgICAgICYmICF0aGlzLm9yZGVyaW5nLnRvTG93ZXJDYXNlKCkuZW5kc1dpdGgoJyBkZXNjJykpIHtcclxuICAgICAgdGhpcy5vcmRlcmluZyArPSAnIEFTQyc7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuYXBwLmxvYWRTcHJ1Y2UoKVxyXG4gICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgU3BydWNlLnN0b3JlKHN0b3JlLCB0aGlzLnVzZVN0YXRlKGN1c3RvbSkpO1xyXG4gICAgICAgIC8vIHRoaXMucmVnaXN0ZXJDdXN0b21FbGVtZW50cygpO1xyXG4gICAgICAgIHRoaXMuYXBwLnN0YXJ0QWxwaW5lKCk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXNlU3RhdGUoY3VzdG9tID0ge30pIHtcclxuICAgIHJldHVybiBtZXJnZShcclxuICAgICAgdGhpcyxcclxuICAgICAgY3VzdG9tXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgc2VuZEZpbHRlcigkZXZlbnQpIHtcclxuICAgIGlmICgkZXZlbnQpIHtcclxuICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5mb3JtLnB1dCgpO1xyXG4gIH1cclxuXHJcbiAgY2xlYXJGaWx0ZXJzKGVsZW1lbnQpIHtcclxuICAgIGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQsIHRleHRhcmVhLCBzZWxlY3QnKS5mb3JFYWNoKChlbGUpID0+IHtcclxuICAgICAgZWxlLnZhbHVlID0gJyc7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmZvcm0ucHV0KCk7XHJcbiAgfVxyXG5cclxuICBzb3J0KCRlbCkge1xyXG4gICAgY29uc3QgZGlyID0gdGhpcy5nZXREaXJlY3Rpb24oJGVsKTtcclxuXHJcbiAgICBjb25zdCBmaWVsZCA9ICRlbC5kYXRhc2V0LmZpZWxkO1xyXG4gICAgbGV0IGFzYyA9ICRlbC5kYXRhc2V0LmFzYztcclxuICAgIGxldCBkZXNjID0gJGVsLmRhdGFzZXQuZGVzYztcclxuXHJcbiAgICBpZiAoZmllbGQpIHtcclxuICAgICAgYXNjID0gZmllbGQgKyAnIEFTQyc7XHJcbiAgICAgIGRlc2MgPSBmaWVsZCArICcgREVTQyc7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGRpciA9PT0gJ0FTQycpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuc29ydEJ5KGRlc2MpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLnNvcnRCeShhc2MpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU29ydCB0d28gaXRlbXMuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gb3JkZXJpbmdcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAqL1xyXG4gIHNvcnRCeShvcmRlcmluZykge1xyXG4gICAgbGV0IG9yZGVyaW5nSW5wdXQgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1saXN0X29yZGVyaW5nXScpO1xyXG5cclxuICAgIGlmICghb3JkZXJpbmdJbnB1dCkge1xyXG4gICAgICBvcmRlcmluZ0lucHV0ID0gdGhpcy5hcHAuaCgnaW5wdXQnLCB7IG5hbWU6ICdsaXN0X29yZGVyaW5nJywgdHlwZTogJ2hpZGRlbicsIHZhbHVlOiAnJyB9KTtcclxuXHJcbiAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChvcmRlcmluZ0lucHV0KTtcclxuICAgIH1cclxuXHJcbiAgICBvcmRlcmluZ0lucHV0LnZhbHVlID0gb3JkZXJpbmc7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuZm9ybS5wdXQoKTtcclxuICB9XHJcblxyXG4gIGlzU29ydEFjdGl2ZSgkZWwpIHtcclxuICAgIHJldHVybiB0aGlzLmdldERpcmVjdGlvbigkZWwpICE9IG51bGw7XHJcbiAgfVxyXG5cclxuICBnZXREaXJlY3Rpb24oJGVsKSB7XHJcbiAgICBjb25zdCBmaWVsZCA9ICRlbC5kYXRhc2V0LmZpZWxkO1xyXG4gICAgbGV0IGFzYyA9ICRlbC5kYXRhc2V0LmFzYztcclxuICAgIGxldCBkZXNjID0gJGVsLmRhdGFzZXQuZGVzYztcclxuXHJcbiAgICBpZiAoZmllbGQpIHtcclxuICAgICAgYXNjID0gZmllbGQgKyAnIEFTQyc7XHJcbiAgICAgIGRlc2MgPSBmaWVsZCArICcgREVTQyc7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMub3JkZXJpbmdFcXVhbHMoYXNjLCB0aGlzLm9yZGVyaW5nKSkge1xyXG4gICAgICByZXR1cm4gJ0FTQyc7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMub3JkZXJpbmdFcXVhbHMoZGVzYywgdGhpcy5vcmRlcmluZykpIHtcclxuICAgICAgcmV0dXJuICdERVNDJztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIG9yZGVyaW5nRXF1YWxzKGEsIGIpIHtcclxuICAgIGEgPSBhLnJlcGxhY2UoL1xccysvZywgJyAnKS50cmltKCkudG9Mb3dlckNhc2UoKTtcclxuICAgIGIgPSBiLnJlcGxhY2UoL1xccysvZywgJyAnKS50cmltKCkudG9Mb3dlckNhc2UoKTtcclxuXHJcbiAgICByZXR1cm4gYSA9PT0gYjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENoZWNrIGEgcm93J3MgY2hlY2tib3guXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge251bWJlcn0gIHJvd1xyXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gdmFsdWVcclxuICAgKi9cclxuICBjaGVja1Jvdyhyb3csIHZhbHVlID0gdHJ1ZSkge1xyXG4gICAgY29uc3QgY2ggPSB0aGlzLmZvcm0uZmluZCgnaW5wdXQuZ3JpZC1jaGVja2JveFtkYXRhLXJvdy1udW1iZXI9JyArIHJvdyArICddJyk7XHJcblxyXG4gICAgaWYgKCFjaC5sZW5ndGgpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDaGVja2JveCBvZiByb3c6ICcgKyByb3cgKyAnIG5vdCBmb3VuZC4nKTtcclxuICAgIH1cclxuXHJcbiAgICBjaFswXS5jaGVja2VkID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBVcGRhdGUgYSByb3cuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IHJvd1xyXG4gICAqIEBwYXJhbSAge3N0cmluZ30gdXJsXHJcbiAgICogQHBhcmFtICB7T2JqZWN0fSBxdWVyaWVzXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgKi9cclxuICB1cGRhdGVSb3cocm93LCB1cmwsIHF1ZXJpZXMpIHtcclxuICAgIHRoaXMudG9nZ2xlQWxsKGZhbHNlKTtcclxuXHJcbiAgICB0aGlzLmNoZWNrUm93KHJvdyk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuY29yZS5wYXRjaCh1cmwsIHF1ZXJpZXMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVXBkYXRlIGEgcm93IHdpdGggYmF0Y2ggdGFzay5cclxuICAgKlxyXG4gICAqIEBwYXJhbSAge3N0cmluZ30gdGFza1xyXG4gICAqIEBwYXJhbSAge251bWJlcn0gcm93XHJcbiAgICogQHBhcmFtICB7c3RyaW5nfSB1cmxcclxuICAgKiBAcGFyYW0gIHtPYmplY3R9IHF1ZXJpZXNcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAqL1xyXG4gIGRvVGFzayh0YXNrLCByb3csIHVybCwgcXVlcmllcykge1xyXG4gICAgcXVlcmllcyA9IHF1ZXJpZXMgfHwge307XHJcblxyXG4gICAgcXVlcmllcy50YXNrID0gdGFzaztcclxuXHJcbiAgICByZXR1cm4gdGhpcy51cGRhdGVSb3cocm93LCB1cmwsIHF1ZXJpZXMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQmF0Y2ggdXBkYXRlIGl0ZW1zLlxyXG4gICAqXHJcbiAgICogQHBhcmFtICB7c3RyaW5nfSB0YXNrXHJcbiAgICogQHBhcmFtICB7c3RyaW5nfSB1cmxcclxuICAgKiBAcGFyYW0gIHtPYmplY3R9IHF1ZXJpZXNcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAqL1xyXG4gIGJhdGNoKHRhc2ssIHVybCwgcXVlcmllcykge1xyXG4gICAgcXVlcmllcyA9IHF1ZXJpZXMgfHwge307XHJcblxyXG4gICAgcXVlcmllcy50YXNrID0gdGFzaztcclxuXHJcbiAgICByZXR1cm4gdGhpcy5jb3JlLnBhdGNoKHVybCwgcXVlcmllcyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDb3B5IGEgcm93LlxyXG4gICAqXHJcbiAgICogQHBhcmFtICB7bnVtYmVyfSByb3dcclxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHVybFxyXG4gICAqIEBwYXJhbSAge09iamVjdH0gcXVlcmllc1xyXG4gICAqXHJcbiAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICovXHJcbiAgY29weVJvdyhyb3csIHVybCwgcXVlcmllcykge1xyXG4gICAgdGhpcy50b2dnbGVBbGwoZmFsc2UpO1xyXG5cclxuICAgIHRoaXMuY2hlY2tSb3cocm93KTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5jb3JlLnBvc3QodXJsLCBxdWVyaWVzKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIERlbGV0ZSBjaGVja2VkIGl0ZW1zLlxyXG4gICAqXHJcbiAgICogQHBhcmFtICB7c3RyaW5nfSBtZXNzYWdlXHJcbiAgICogQHBhcmFtICB7c3RyaW5nfSB1cmxcclxuICAgKiBAcGFyYW0gIHtPYmplY3R9IHF1ZXJpZXNcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAqL1xyXG4gIGRlbGV0ZUxpc3QobWVzc2FnZSwgdXJsLCBxdWVyaWVzKSB7XHJcbiAgICBtZXNzYWdlID0gbWVzc2FnZSA9PSBudWxsID8gdGhpcy5hcHAuX18oJ3VuaWNvcm4ubWVzc2FnZS5kZWxldGUuY29uZmlybScpIDogbWVzc2FnZTtcclxuXHJcbiAgICBpZiAobWVzc2FnZSAhPT0gZmFsc2UpIHtcclxuICAgICAgdGhpcy5hcHAuY29uZmlybShtZXNzYWdlLCBpc0NvbmZpcm0gPT4ge1xyXG4gICAgICAgIGlmIChpc0NvbmZpcm0pIHtcclxuICAgICAgICAgIHRoaXMuY29yZVsnZGVsZXRlJ10odXJsLCBxdWVyaWVzKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5jb3JlWydkZWxldGUnXSh1cmwsIHF1ZXJpZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRGVsZXRlIGFuIGl0bWUuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IHJvd1xyXG4gICAqIEBwYXJhbSAge3N0cmluZ30gbXNnXHJcbiAgICogQHBhcmFtICB7c3RyaW5nfSB1cmxcclxuICAgKiBAcGFyYW0gIHtPYmplY3R9IHF1ZXJpZXNcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAqL1xyXG4gIGRlbGV0ZVJvdyhyb3csIG1zZywgdXJsLCBxdWVyaWVzKSB7XHJcbiAgICBtc2cgPSBtc2cgfHwgdGhpcy5hcHAuX18oJ3VuaWNvcm4ubWVzc2FnZS5kZWxldGUuY29uZmlybScpO1xyXG5cclxuICAgIHRoaXMuYXBwLmNvbmZpcm0obXNnLCBpc0NvbmZpcm0gPT4ge1xyXG4gICAgICBpZiAoaXNDb25maXJtKSB7XHJcbiAgICAgICAgdGhpcy50b2dnbGVBbGwoZmFsc2UpO1xyXG5cclxuICAgICAgICB0aGlzLmNoZWNrUm93KHJvdyk7XHJcblxyXG4gICAgICAgIHRoaXMuZGVsZXRlTGlzdChmYWxzZSwgdXJsLCBxdWVyaWVzKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUb2dnbGUgYWxsIGNoZWNrYm94ZXMuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gIHtib29sZWFufSAgICAgICAgICB2YWx1ZSAgICAgQ2hlY2tlZCBvciB1bmNoZWNrZWQuXHJcbiAgICovXHJcbiAgdG9nZ2xlQWxsKHZhbHVlKSB7XHJcbiAgICB0aGlzLmFwcC5zZWxlY3RBbGwoXHJcbiAgICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFtkYXRhLXJvbGU9Z3JpZC1jaGVja2JveF1bdHlwZT1jaGVja2JveF0nKVxyXG4gICAgKVxyXG4gICAgICAubWFwKChpbnB1dCkgPT4ge1xyXG4gICAgICAgIGlucHV0LmNoZWNrZWQgPSB2YWx1ZTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDb3VudCBjaGVja2VkIGNoZWNrYm94ZXMuXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyB7aW50fVxyXG4gICAqL1xyXG4gIGNvdW50Q2hlY2tlZCgpIHtcclxuICAgIHJldHVybiB0aGlzLmdldENoZWNrZWQoKS5sZW5ndGg7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgQ2hlY2tlZCBib3hlcy5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHtFbGVtZW50W119XHJcbiAgICovXHJcbiAgZ2V0Q2hlY2tlZCgpIHtcclxuICAgIHJldHVybiB0aGlzLmFwcC5zZWxlY3RBbGwoXHJcbiAgICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFtkYXRhLXJvbGU9Z3JpZC1jaGVja2JveF1bdHlwZT1jaGVja2JveF0nKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFZhbGlkYXRlIHRoZXJlIGhhcyBvbmUgb3IgbW9yZSBjaGVja2VkIGJveGVzLlxyXG4gICAqXHJcbiAgICogQHBhcmFtICAge3N0cmluZ30gIG1zZ1xyXG4gICAqIEBwYXJhbSAgIHtFdmVudH0gICBldmVudFxyXG4gICAqXHJcbiAgICogQHJldHVybnMge1VuaWNvcm5HcmlkRWxlbWVudH1cclxuICAgKi9cclxuICBoYXNDaGVja2VkKG1zZywgZXZlbnQpIHtcclxuICAgIG1zZyA9IG1zZyB8fCBVbmljb3JuLlRyYW5zbGF0b3IudHJhbnNsYXRlKCd1bmljb3JuLm1lc3NhZ2UuZ3JpZC5jaGVja2VkJyk7XHJcblxyXG4gICAgaWYgKCF0aGlzLmNvdW50Q2hlY2tlZCgpKSB7XHJcbiAgICAgIGFsZXJ0KG1zZyk7XHJcblxyXG4gICAgICAvLyBJZiB5b3Ugc2VuZCBldmVudCBvYmplY3QgYXMgc2Vjb25kIGFyZ3VtZW50LCB3ZSB3aWxsIHN0b3AgYWxsIGFjdGlvbnMuXHJcbiAgICAgIGlmIChldmVudCkge1xyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVvcmRlciBhbGwuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gICB7c3RyaW5nfSAgdXJsXHJcbiAgICogQHBhcmFtICAge09iamVjdH0gIHF1ZXJpZXNcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAqL1xyXG4gIHJlb3JkZXJBbGwodXJsLCBxdWVyaWVzKSB7XHJcbiAgICBjb25zdCBzZWxmID0gdGhpcztcclxuICAgIGNvbnN0IG9yaWdpbiA9IHRoaXMuZm9ybS5maW5kKCdpbnB1dFtuYW1lPW9yaWdpbl9vcmRlcmluZ10nKTtcclxuXHJcbiAgICAvLyBJZiBvcmlnaW4gZXhpc3RzLCB3ZSBkaWZmIHRoZW0gYW5kIG9ubHkgc2VuZCBjaGFuZ2VkIGdyb3VwLlxyXG4gICAgaWYgKG9yaWdpbi5sZW5ndGgpIHtcclxuICAgICAgY29uc3Qgb3JpZ2luT3JkZXJpbmcgPSBvcmlnaW4udmFsKCkuc3BsaXQoJywnKTtcclxuICAgICAgY29uc3QgaW5wdXRzID0gdGhpcy5mb3JtLmZpbmQoJy5vcmRlcmluZy1jb250cm9sIGlucHV0Jyk7XHJcblxyXG4gICAgICB0aGlzLnRvZ2dsZUFsbCgpO1xyXG5cclxuICAgICAgaW5wdXRzLmVhY2goZnVuY3Rpb24oaSkge1xyXG4gICAgICAgIGNvbnN0ICR0aGlzID0gJCh0aGlzKTtcclxuXHJcbiAgICAgICAgaWYgKCR0aGlzLnZhbCgpICE9PSBvcmlnaW5PcmRlcmluZ1tpXSkge1xyXG4gICAgICAgICAgLy8gQ2hlY2sgc2VsZlxyXG4gICAgICAgICAgc2VsZi5jaGVja1JvdygkdGhpcy5hdHRyKCdkYXRhLW9yZGVyLXJvdycpKTtcclxuXHJcbiAgICAgICAgICBjb25zdCB0ciA9ICR0aGlzLnBhcmVudHMoJ3RyJyk7XHJcbiAgICAgICAgICBjb25zdCBncm91cCA9IHRyLmF0dHIoJ2RhdGEtb3JkZXItZ3JvdXAnKTtcclxuXHJcbiAgICAgICAgICAvLyBDaGVjayBzYW1lIGdyb3VwIGJveGVzXHJcbiAgICAgICAgICBpZiAoZ3JvdXAgIT09ICcnKSB7XHJcbiAgICAgICAgICAgIHRyLnNpYmxpbmdzKCdbZGF0YS1vcmRlci1ncm91cD0nICsgZ3JvdXAgKyAnXScpXHJcbiAgICAgICAgICAgICAgLmZpbmQoJ2lucHV0LmdyaWQtY2hlY2tib3gnKVxyXG4gICAgICAgICAgICAgIC5wcm9wKCdjaGVja2VkJywgdHJ1ZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5iYXRjaCgncmVvcmRlcicsIHVybCwgcXVlcmllcyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZW9yZGVyIGl0ZW1zLlxyXG4gICAqXHJcbiAgICogQHBhcmFtICB7aW50fSAgICAgcm93XHJcbiAgICogQHBhcmFtICB7aW50fSAgICAgZGVsdGFcclxuICAgKiBAcGFyYW0gIHtzdHJpbmd9ICB1cmxcclxuICAgKiBAcGFyYW0gIHtPYmplY3R9ICBxdWVyaWVzXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgKi9cclxuICByZW9yZGVyKHJvdywgZGVsdGEsIHVybCwgcXVlcmllcykge1xyXG4gICAgcXVlcmllcyA9IHF1ZXJpZXMgfHwge307XHJcbiAgICBxdWVyaWVzLmRlbHRhID0gZGVsdGE7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuZG9UYXNrKCdyZW9yZGVyJywgcm93LCB1cmwsIHF1ZXJpZXMpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaXNTb3J0QWN0aXZlKCRlbCkge1xyXG4gIGxldCBmaWVsZCA9ICRlbC5kYXRhc2V0LmZpZWxkO1xyXG4gIGxldCBkZXNjID0gJGVsLmRhdGFzZXQuZGVzYztcclxuICBsZXQgYXNjID0gJGVsLmRhdGFzZXQuYXNjO1xyXG4gIFxyXG4gIGRlc2MgPSBkZXNjIHx8IGAke2ZpZWxkfSBERVNDYDtcclxuICBhc2MgPSBhc2MgfHwgYCR7ZmllbGR9IEFTQ2A7XHJcblxyXG4gIGNvbnN0IG9yZGVyaW5nID0gdGhpcy5ncmlkLmVsZW1lbnQuZGF0YXNldC5vcmRlcmluZztcclxuICBjb25zb2xlLmxvZyhvcmRlcmluZywgYXNjLCBkZXNjKTtcclxuICByZXR1cm4gb3JkZXJpbmcgPT09IGFzYyB8fCBvcmRlcmluZyA9PT0gZGVzYztcclxufVxyXG4iLCIvKipcclxuICogUGFydCBvZiBzdGFydGVyIHByb2plY3QuXHJcbiAqXHJcbiAqIEBjb3B5cmlnaHQgIENvcHlyaWdodCAoQykgMjAyMSBfX09SR0FOSVpBVElPTl9fLlxyXG4gKiBAbGljZW5zZSAgICBfX0xJQ0VOU0VfX1xyXG4gKi9cclxuXHJcbmltcG9ydCB7IGRlZkRhdGEgfSBmcm9tICcuLi91dGlsaXRpZXMuanMnO1xyXG5pbXBvcnQgeyBlYWNoLCBtZXJnZSB9IGZyb20gJ2xvZGFzaC1lcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVbmljb3JuRm9ybSB7XHJcbiAgc3RhdGljIGdldCBpcygpIHtcclxuICAgIHJldHVybiAnZm9ybSc7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgaW5zdGFsbChhcHAsIG9wdGlvbnMgPSB7fSkge1xyXG4gICAgYXBwLmZvcm0gPSAoZWxlLCBvcHRpb25zID0ge30pID0+IHtcclxuICAgICAgY29uc3Qgc2VsZWN0b3IgPSB0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IG51bGw7XHJcbiAgICAgIGVsZSA9IGFwcC5zZWxlY3RPbmUoZWxlKTtcclxuXHJcbiAgICAgIHJldHVybiBkZWZEYXRhKFxyXG4gICAgICAgIGVsZSxcclxuICAgICAgICAnZm9ybS5wbHVnaW4nLFxyXG4gICAgICAgICgpID0+IG5ldyBVbmljb3JuRm9ybUVsZW1lbnQoc2VsZWN0b3IsIGVsZSwgb3B0aW9ucywgYXBwKVxyXG4gICAgICApO1xyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbmNsYXNzIFVuaWNvcm5Gb3JtRWxlbWVudCB7XHJcbiAgLyoqXHJcbiAgICogQ29uc3RydWN0b3IuXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9ICAgICAgc2VsZWN0b3JcclxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSAkZm9ybVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSAgICAgIG9wdGlvbnNcclxuICAgKiBAcGFyYW0ge1VuaWNvcm5BcHB9ICBhcHBcclxuICAgKi9cclxuICBjb25zdHJ1Y3RvcihzZWxlY3RvciwgJGZvcm0sIG9wdGlvbnMsIGFwcCkge1xyXG4gICAgdGhpcy5hcHAgPSBhcHA7XHJcblxyXG4gICAgLy8gSWYgZm9ybSBub3QgZm91bmQsIGNyZWF0ZSBvbmVcclxuICAgIGlmICghJGZvcm0pIHtcclxuICAgICAgJGZvcm0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb3JtJyk7XHJcblxyXG4gICAgICBpZiAoc2VsZWN0b3IuaW5kZXhPZignIycpID09PSAwKSB7XHJcbiAgICAgICAgJGZvcm0uc2V0QXR0cmlidXRlKCdpZCcsIHNlbGVjdG9yLnN1YnN0cigxKSk7XHJcbiAgICAgICAgJGZvcm0uc2V0QXR0cmlidXRlKCduYW1lJywgc2VsZWN0b3Iuc3Vic3RyKDEpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgJGZvcm0uc2V0QXR0cmlidXRlKCdtZXRob2QnLCAncG9zdCcpO1xyXG4gICAgICAkZm9ybS5zZXRBdHRyaWJ1dGUoJ2VuY3R5cGUnLCAnbXVsdGlwYXJ0L2Zvcm0tZGF0YScpO1xyXG4gICAgICAkZm9ybS5zZXRBdHRyaWJ1dGUoJ25vdmFsaWRhdGUnLCAndHJ1ZScpO1xyXG4gICAgICAkZm9ybS5zZXRBdHRyaWJ1dGUoJ2FjdGlvbicsIGFwcC5kYXRhKCd1bmljb3JuLnVyaScpWydmdWxsJ10pO1xyXG4gICAgICAkZm9ybS5zZXRBdHRyaWJ1dGUoJ2Rpc3BsYXknLCAnbm9uZScpO1xyXG5cclxuICAgICAgY29uc3QgY3NyZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XHJcbiAgICAgIGNzcmYuc2V0QXR0cmlidXRlKCduYW1lJywgYXBwLmRhdGEoJ2NzcmYtdG9rZW4nKSk7XHJcblxyXG4gICAgICAkZm9ybS5hcHBlbmRDaGlsZChjc3JmKTtcclxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCgkZm9ybSk7XHJcbiAgICB9XHJcblxyXG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oIHt9LCB0aGlzLmNvbnN0cnVjdG9yLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcclxuXHJcbiAgICB0aGlzLmVsZW1lbnQgPSAkZm9ybTtcclxuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XHJcblxyXG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XHJcbiAgfVxyXG5cclxuICBiaW5kRXZlbnRzKCkge1xyXG4gICAgLy8gaWYgKHRoaXMuZm9ybS5hdHRyKCdkYXRhLXRvb2xiYXInKSkge1xyXG4gICAgLy8gICAkKHRoaXMuZm9ybS5hdHRyKCdkYXRhLXRvb2xiYXInKSkuZmluZCgnKltkYXRhLWFjdGlvbl0nKS5vbignY2xpY2snLCAoZSkgPT4ge1xyXG4gICAgLy8gICAgIHRoaXMuZm9ybS50cmlnZ2VyKCd1bmljb3JuLnN1Ym1pdCcsIGUuY3VycmVudFRhcmdldCk7XHJcbiAgICAvLyAgIH0pO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIC8vIHRoaXMuZm9ybS5vbigndW5pY29ybi5zdWJtaXQnLCAoZSwgYnV0dG9uKSA9PiB7XHJcbiAgICAvLyAgIGNvbnN0ICRidXR0b24gPSAkKGJ1dHRvbik7XHJcbiAgICAvLyAgIGNvbnN0IGFjdGlvbiA9ICRidXR0b24uYXR0cignZGF0YS1hY3Rpb24nKTtcclxuICAgIC8vICAgY29uc3QgdGFyZ2V0ID0gJGJ1dHRvbi5hdHRyKCdkYXRhLXRhcmdldCcpIHx8IG51bGw7XHJcbiAgICAvLyAgIGNvbnN0IHF1ZXJ5ID0gJGJ1dHRvbi5kYXRhKCdxdWVyeScpIHx8IHt9O1xyXG4gICAgLy8gICBxdWVyeVsndGFzayddID0gJGJ1dHRvbi5hdHRyKCdkYXRhLXRhc2snKSB8fCBudWxsO1xyXG4gICAgLy9cclxuICAgIC8vICAgdGhpc1thY3Rpb25dKHRhcmdldCwgcXVlcnkpO1xyXG4gICAgLy8gfSk7XHJcbiAgfVxyXG5cclxuICBpbml0Q29tcG9uZW50KHN0b3JlID0gJ2Zvcm0nLCBjdXN0b20gPSB7fSkge1xyXG4gICAgcmV0dXJuIHRoaXMuYXBwLmxvYWRTcHJ1Y2UoKVxyXG4gICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgU3BydWNlLnN0b3JlKHN0b3JlLCB0aGlzLnVzZVN0YXRlKGN1c3RvbSkpO1xyXG4gICAgICAgIC8vIHRoaXMucmVnaXN0ZXJDdXN0b21FbGVtZW50cygpO1xyXG4gICAgICAgIHRoaXMuYXBwLnN0YXJ0QWxwaW5lKCk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXNlU3RhdGUoY3VzdG9tID0ge30pIHtcclxuICAgIHJldHVybiBtZXJnZShcclxuICAgICAgdGhpcyxcclxuICAgICAgY3VzdG9tXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTWFrZSBhIHJlcXVlc3QuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHVybFxyXG4gICAqIEBwYXJhbSAge09iamVjdH0gcXVlcmllc1xyXG4gICAqIEBwYXJhbSAge3N0cmluZ30gbWV0aG9kXHJcbiAgICogQHBhcmFtICB7c3RyaW5nfSBjdXN0b21NZXRob2RcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAqL1xyXG4gIHN1Ym1pdCh1cmwsIHF1ZXJpZXMsIG1ldGhvZCwgY3VzdG9tTWV0aG9kKSB7XHJcbiAgICBjb25zdCBmb3JtID0gdGhpcy5lbGVtZW50O1xyXG5cclxuICAgIGlmIChjdXN0b21NZXRob2QpIHtcclxuICAgICAgbGV0IG1ldGhvZElucHV0ID0gZm9ybS5xdWVyeVNlbGVjdG9yKCdpbnB1dFtuYW1lPVwiX21ldGhvZFwiXScpO1xyXG5cclxuICAgICAgaWYgKCFtZXRob2RJbnB1dCkge1xyXG4gICAgICAgIG1ldGhvZElucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcclxuICAgICAgICBtZXRob2RJbnB1dC5zZXRBdHRyaWJ1dGUoJ25hbWUnLCAnX21ldGhvZCcpO1xyXG4gICAgICAgIG1ldGhvZElucHV0LnNldEF0dHJpYnV0ZSgndHlwZScsICdoaWRkZW4nKTtcclxuXHJcbiAgICAgICAgZm9ybS5hcHBlbmRDaGlsZChtZXRob2RJbnB1dCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG1ldGhvZElucHV0LnZhbHVlID0gY3VzdG9tTWV0aG9kO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFNldCBxdWVyaWVzIGludG8gZm9ybS5cclxuICAgIGlmIChxdWVyaWVzKSB7XHJcbiAgICAgIGxldCBpbnB1dDtcclxuXHJcbiAgICAgIGNvbnN0IGZsYXR0ZWQgPSB0aGlzLmNvbnN0cnVjdG9yLmZsYXR0ZW5PYmplY3QocXVlcmllcyk7XHJcblxyXG4gICAgICBlYWNoKGZsYXR0ZWQsICh2YWx1ZSwga2V5KSA9PiB7XHJcbiAgICAgICAgY29uc3QgZmllbGROYW1lID0gdGhpcy5jb25zdHJ1Y3Rvci5idWlsZEZpZWxkTmFtZShrZXkpO1xyXG4gICAgICAgIGlucHV0ID0gZm9ybS5xdWVyeVNlbGVjdG9yKGBpbnB1dFtuYW1lPVwiJHtmaWVsZE5hbWV9XCJdYCk7XHJcblxyXG4gICAgICAgIGlmICghaW5wdXQpIHtcclxuICAgICAgICAgIGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcclxuICAgICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZSgnbmFtZScsIGZpZWxkTmFtZSk7XHJcbiAgICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnaGlkZGVuJyk7XHJcblxyXG4gICAgICAgICAgZm9ybS5hcHBlbmRDaGlsZChpbnB1dCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbnB1dC52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodXJsKSB7XHJcbiAgICAgIGZvcm0uc2V0QXR0cmlidXRlKCdhY3Rpb24nLCB1cmwpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChtZXRob2QpIHtcclxuICAgICAgZm9ybS5zZXRBdHRyaWJ1dGUoJ21ldGhvZCcsIG1ldGhvZCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ3JlYXRlIGEgc3VibWl0IGJ1dHRvbiB0aGF0IGNhbiBmaXJlIGBzdWJtaXRgIGV2ZW50XHJcbiAgICBsZXQgc3VibWl0QnV0dG9uID0gZm9ybS5xdWVyeVNlbGVjdG9yKGBidXR0b25bdHlwZT1zdWJtaXRdW2RhdGEtc3VibWl0XWApO1xyXG5cclxuICAgIGlmICghc3VibWl0QnV0dG9uKSB7XHJcbiAgICAgIHN1Ym1pdEJ1dHRvbiA9IHRoaXMuYXBwLmgoJ2J1dHRvbicsIHsgdHlwZTogJ3N1Ym1pdCcgfSwgJ0dPJyk7XHJcbiAgICAgIHN1Ym1pdEJ1dHRvbi5kYXRhc2V0LnN1Ym1pdCA9IHRydWU7XHJcbiAgICAgIHN1Ym1pdEJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICBmb3JtLmFwcGVuZENoaWxkKHN1Ym1pdEJ1dHRvbik7XHJcbiAgICB9XHJcblxyXG4gICAgc3VibWl0QnV0dG9uLmNsaWNrKCk7XHJcblxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNYWtlIGEgR0VUIHJlcXVlc3QuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHVybFxyXG4gICAqIEBwYXJhbSAge09iamVjdH0gcXVlcmllc1xyXG4gICAqIEBwYXJhbSAge3N0cmluZ30gY3VzdG9tTWV0aG9kXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgKi9cclxuICBnZXQodXJsLCBxdWVyaWVzLCBjdXN0b21NZXRob2QpIHtcclxuICAgIHJldHVybiB0aGlzLnN1Ym1pdCh1cmwsIHF1ZXJpZXMsICdHRVQnLCBjdXN0b21NZXRob2QpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUG9zdCBmb3JtLlxyXG4gICAqXHJcbiAgICogQHBhcmFtICB7c3RyaW5nfSB1cmxcclxuICAgKiBAcGFyYW0gIHtPYmplY3R9IHF1ZXJpZXNcclxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IGN1c3RvbU1ldGhvZFxyXG4gICAqXHJcbiAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICovXHJcbiAgcG9zdCh1cmwsIHF1ZXJpZXMsIGN1c3RvbU1ldGhvZCkge1xyXG4gICAgY3VzdG9tTWV0aG9kID0gY3VzdG9tTWV0aG9kIHx8ICdQT1NUJztcclxuXHJcbiAgICByZXR1cm4gdGhpcy5zdWJtaXQodXJsLCBxdWVyaWVzLCAnUE9TVCcsIGN1c3RvbU1ldGhvZCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNYWtlIGEgUFVUIHJlcXVlc3QuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHVybFxyXG4gICAqIEBwYXJhbSAge09iamVjdH0gcXVlcmllc1xyXG4gICAqXHJcbiAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICovXHJcbiAgcHV0KHVybCwgcXVlcmllcykge1xyXG4gICAgcmV0dXJuIHRoaXMucG9zdCh1cmwsIHF1ZXJpZXMsICdQVVQnKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE1ha2UgYSBQQVRDSCByZXF1ZXN0LlxyXG4gICAqXHJcbiAgICogQHBhcmFtICB7c3RyaW5nfSB1cmxcclxuICAgKiBAcGFyYW0gIHtPYmplY3R9IHF1ZXJpZXNcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAqL1xyXG4gIHBhdGNoKHVybCwgcXVlcmllcykge1xyXG4gICAgcmV0dXJuIHRoaXMucG9zdCh1cmwsIHF1ZXJpZXMsICdQQVRDSCcpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTWFrZSBhIERFTEVURSByZXF1ZXN0LlxyXG4gICAqXHJcbiAgICogQHBhcmFtICB7c3RyaW5nfSB1cmxcclxuICAgKiBAcGFyYW0gIHtPYmplY3R9IHF1ZXJpZXNcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAqL1xyXG4gIGRlbGV0ZSh1cmwsIHF1ZXJpZXMpIHtcclxuICAgIHJldHVybiB0aGlzLnBvc3QodXJsLCBxdWVyaWVzLCAnREVMRVRFJyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBAc2VlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS81MzczOTc5MlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iXHJcbiAgICogQHJldHVybnMge09iamVjdH1cclxuICAgKi9cclxuICBzdGF0aWMgZmxhdHRlbk9iamVjdChvYikge1xyXG4gICAgY29uc3QgdG9SZXR1cm4gPSB7fTtcclxuXHJcbiAgICBmb3IgKGxldCBpIGluIG9iKSB7XHJcbiAgICAgIGlmICghb2IuaGFzT3duUHJvcGVydHkoaSkpIHtcclxuICAgICAgICBjb250aW51ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCh0eXBlb2Ygb2JbaV0pID09PSAnb2JqZWN0JyAmJiBvYltpXSAhPSBudWxsKSB7XHJcbiAgICAgICAgY29uc3QgZmxhdE9iamVjdCA9IHRoaXMuZmxhdHRlbk9iamVjdChvYltpXSk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IHggaW4gZmxhdE9iamVjdCkge1xyXG4gICAgICAgICAgaWYgKCFmbGF0T2JqZWN0Lmhhc093blByb3BlcnR5KHgpKSB7XHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHRvUmV0dXJuW2kgKyAnLycgKyB4XSA9IGZsYXRPYmplY3RbeF07XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRvUmV0dXJuW2ldID0gb2JbaV07XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0b1JldHVybjtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBidWlsZEZpZWxkTmFtZShmaWVsZCkge1xyXG4gICAgY29uc3QgbmFtZXMgPSBmaWVsZC5zcGxpdCgnLycpO1xyXG5cclxuICAgIGNvbnN0IGZpcnN0ID0gbmFtZXMuc2hpZnQoKTtcclxuXHJcbiAgICByZXR1cm4gZmlyc3QgKyBuYW1lcy5tYXAobmFtZSA9PiBgWyR7bmFtZX1dYCkuam9pbignJyk7XHJcbiAgfVxyXG59XHJcbiIsIi8qKlxuICogUGFydCBvZiBzdGFydGVyIHByb2plY3QuXG4gKlxuICogQGNvcHlyaWdodCAgQ29weXJpZ2h0IChDKSAyMDIxIF9fT1JHQU5JWkFUSU9OX18uXG4gKiBAbGljZW5zZSAgICBfX0xJQ0VOU0VfX1xuICovXG5cbmltcG9ydCB7IGRlZmF1bHRzRGVlcCB9IGZyb20gJ2xvZGFzaC1lcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFVuaWNvcm5UaW55bWNlIHtcbiAgaW5zdGFuY2VzID0ge307XG5cbiAgc3RhdGljIGluc3RhbGwoYXBwKSB7XG4gICAgYXBwLiR1aS50aW55bWNlID0gbmV3IHRoaXMoYXBwLiR1aSk7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcih1aSkge1xuICAgIHRoaXMudWkgPSB1aTtcbiAgICB0aGlzLmFwcCA9IHVpLmFwcDtcbiAgfVxuXG4gIGxvYWRUaW55bWNlKCkge1xuICAgIHJldHVybiB0aGlzLmFwcC5pbXBvcnQoJ0B0aW55bWNlJyk7XG4gIH1cblxuICBpbml0KHNlbGVjdG9yLCBvcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5sb2FkVGlueW1jZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2VzW3NlbGVjdG9yXSA9IG5ldyBUaW55bWNlRWRpdG9yKHNlbGVjdG9yLCBvcHRpb25zKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldChzZWxlY3Rvcikge1xuICAgIHRoaXMuaW5zdGFuY2VzW3NlbGVjdG9yXTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVGlueW1jZUVkaXRvciB7XG4gIHN0YXRpYyBkZWZhdWx0T3B0aW9ucyA9IHtcblxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKHNlbGVjdG9yLCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucy5zZWxlY3RvciA9IHNlbGVjdG9yO1xuXG4gICAgdGhpcy5zZWxlY3RvciA9IHNlbGVjdG9yO1xuICAgIHRoaXMub3B0aW9ucyAgPSBkZWZhdWx0c0RlZXAoe30sIG9wdGlvbnMsIHRoaXMuY29uc3RydWN0b3IuZGVmYXVsdE9wdGlvbnMpO1xuXG4gICAgY29uc3QgZWRpdG9yID0gdGlueW1jZS5pbml0KG9wdGlvbnMpO1xuXG4gICAgdGhpcy5lZGl0b3IgPSBlZGl0b3I7XG4gIH1cblxuICBnZXRFZGl0b3IoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWRpdG9yO1xuICB9XG5cbiAgcHJvcGFyZU9wdGlvbnMob3B0aW9ucykge1xuICAgIC8vXG4gIH1cblxuICBpbnNlcnQodGV4dCkge1xuICAgIHJldHVybiB0aGlzLmVkaXRvci5pbnNlcnRDb250ZW50KHRleHQpO1xuICB9XG5cbiAgZ2V0VmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWRpdG9yLmdldENvbnRlbnQoKTtcbiAgfVxuXG4gIGdldFZhbHVlKHRleHQpIHtcbiAgICByZXR1cm4gdGhpcy5lZGl0b3Iuc2V0Q29udGVudCh0ZXh0KTtcbiAgfVxufVxuIiwiLyoqXG4gKiBQYXJ0IG9mIHN0YXJ0ZXIgcHJvamVjdC5cbiAqXG4gKiBAY29weXJpZ2h0ICBDb3B5cmlnaHQgKEMpIDIwMjEgX19PUkdBTklaQVRJT05fXy5cbiAqIEBsaWNlbnNlICAgIF9fTElDRU5TRV9fXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVW5pY29ybkxvYWRlciB7XG4gIHN0YXRpYyBpbnN0YWxsKGFwcCkge1xuICAgIGFwcC5pbXBvcnQgPSB0aGlzLmltcG9ydDtcbiAgfVxuXG4gIHN0YXRpYyBpbXBvcnQoc3JjKSB7XG4gICAgY29uc3QgcyA9IHdpbmRvdy5TeXN0ZW07XG5cbiAgICByZXR1cm4gcy5pbXBvcnQoc3JjKTtcbiAgfVxufVxuIiwiLyogZ2xvYmFsIHdpbmRvdywgZXhwb3J0cywgZGVmaW5lICovXG5cbiFmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCdcblxuICAgIHZhciByZSA9IHtcbiAgICAgICAgbm90X3N0cmluZzogL1tec10vLFxuICAgICAgICBub3RfYm9vbDogL1tedF0vLFxuICAgICAgICBub3RfdHlwZTogL1teVF0vLFxuICAgICAgICBub3RfcHJpbWl0aXZlOiAvW152XS8sXG4gICAgICAgIG51bWJlcjogL1tkaWVmZ10vLFxuICAgICAgICBudW1lcmljX2FyZzogL1tiY2RpZWZndXhYXS8sXG4gICAgICAgIGpzb246IC9bal0vLFxuICAgICAgICBub3RfanNvbjogL1teal0vLFxuICAgICAgICB0ZXh0OiAvXlteXFx4MjVdKy8sXG4gICAgICAgIG1vZHVsbzogL15cXHgyNXsyfS8sXG4gICAgICAgIHBsYWNlaG9sZGVyOiAvXlxceDI1KD86KFsxLTldXFxkKilcXCR8XFwoKFteKV0rKVxcKSk/KFxcKyk/KDB8J1teJF0pPygtKT8oXFxkKyk/KD86XFwuKFxcZCspKT8oW2ItZ2lqb3N0VHV2eFhdKS8sXG4gICAgICAgIGtleTogL14oW2Etel9dW2Etel9cXGRdKikvaSxcbiAgICAgICAga2V5X2FjY2VzczogL15cXC4oW2Etel9dW2Etel9cXGRdKikvaSxcbiAgICAgICAgaW5kZXhfYWNjZXNzOiAvXlxcWyhcXGQrKVxcXS8sXG4gICAgICAgIHNpZ246IC9eWystXS9cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzcHJpbnRmKGtleSkge1xuICAgICAgICAvLyBgYXJndW1lbnRzYCBpcyBub3QgYW4gYXJyYXksIGJ1dCBzaG91bGQgYmUgZmluZSBmb3IgdGhpcyBjYWxsXG4gICAgICAgIHJldHVybiBzcHJpbnRmX2Zvcm1hdChzcHJpbnRmX3BhcnNlKGtleSksIGFyZ3VtZW50cylcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB2c3ByaW50ZihmbXQsIGFyZ3YpIHtcbiAgICAgICAgcmV0dXJuIHNwcmludGYuYXBwbHkobnVsbCwgW2ZtdF0uY29uY2F0KGFyZ3YgfHwgW10pKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNwcmludGZfZm9ybWF0KHBhcnNlX3RyZWUsIGFyZ3YpIHtcbiAgICAgICAgdmFyIGN1cnNvciA9IDEsIHRyZWVfbGVuZ3RoID0gcGFyc2VfdHJlZS5sZW5ndGgsIGFyZywgb3V0cHV0ID0gJycsIGksIGssIHBoLCBwYWQsIHBhZF9jaGFyYWN0ZXIsIHBhZF9sZW5ndGgsIGlzX3Bvc2l0aXZlLCBzaWduXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0cmVlX2xlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHBhcnNlX3RyZWVbaV0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0ICs9IHBhcnNlX3RyZWVbaV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBwYXJzZV90cmVlW2ldID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIHBoID0gcGFyc2VfdHJlZVtpXSAvLyBjb252ZW5pZW5jZSBwdXJwb3NlcyBvbmx5XG4gICAgICAgICAgICAgICAgaWYgKHBoLmtleXMpIHsgLy8ga2V5d29yZCBhcmd1bWVudFxuICAgICAgICAgICAgICAgICAgICBhcmcgPSBhcmd2W2N1cnNvcl1cbiAgICAgICAgICAgICAgICAgICAgZm9yIChrID0gMDsgayA8IHBoLmtleXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhcmcgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHNwcmludGYoJ1tzcHJpbnRmXSBDYW5ub3QgYWNjZXNzIHByb3BlcnR5IFwiJXNcIiBvZiB1bmRlZmluZWQgdmFsdWUgXCIlc1wiJywgcGgua2V5c1trXSwgcGgua2V5c1trLTFdKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IGFyZ1twaC5rZXlzW2tdXVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBoLnBhcmFtX25vKSB7IC8vIHBvc2l0aW9uYWwgYXJndW1lbnQgKGV4cGxpY2l0KVxuICAgICAgICAgICAgICAgICAgICBhcmcgPSBhcmd2W3BoLnBhcmFtX25vXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHsgLy8gcG9zaXRpb25hbCBhcmd1bWVudCAoaW1wbGljaXQpXG4gICAgICAgICAgICAgICAgICAgIGFyZyA9IGFyZ3ZbY3Vyc29yKytdXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHJlLm5vdF90eXBlLnRlc3QocGgudHlwZSkgJiYgcmUubm90X3ByaW1pdGl2ZS50ZXN0KHBoLnR5cGUpICYmIGFyZyBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGFyZyA9IGFyZygpXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHJlLm51bWVyaWNfYXJnLnRlc3QocGgudHlwZSkgJiYgKHR5cGVvZiBhcmcgIT09ICdudW1iZXInICYmIGlzTmFOKGFyZykpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3Ioc3ByaW50ZignW3NwcmludGZdIGV4cGVjdGluZyBudW1iZXIgYnV0IGZvdW5kICVUJywgYXJnKSlcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocmUubnVtYmVyLnRlc3QocGgudHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNfcG9zaXRpdmUgPSBhcmcgPj0gMFxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHN3aXRjaCAocGgudHlwZSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdiJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IHBhcnNlSW50KGFyZywgMTApLnRvU3RyaW5nKDIpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdjJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IFN0cmluZy5mcm9tQ2hhckNvZGUocGFyc2VJbnQoYXJnLCAxMCkpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdkJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnaSc6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBwYXJzZUludChhcmcsIDEwKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnaic6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBKU09OLnN0cmluZ2lmeShhcmcsIG51bGwsIHBoLndpZHRoID8gcGFyc2VJbnQocGgud2lkdGgpIDogMClcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2UnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gcGgucHJlY2lzaW9uID8gcGFyc2VGbG9hdChhcmcpLnRvRXhwb25lbnRpYWwocGgucHJlY2lzaW9uKSA6IHBhcnNlRmxvYXQoYXJnKS50b0V4cG9uZW50aWFsKClcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2YnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gcGgucHJlY2lzaW9uID8gcGFyc2VGbG9hdChhcmcpLnRvRml4ZWQocGgucHJlY2lzaW9uKSA6IHBhcnNlRmxvYXQoYXJnKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnZyc6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBwaC5wcmVjaXNpb24gPyBTdHJpbmcoTnVtYmVyKGFyZy50b1ByZWNpc2lvbihwaC5wcmVjaXNpb24pKSkgOiBwYXJzZUZsb2F0KGFyZylcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ28nOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gKHBhcnNlSW50KGFyZywgMTApID4+PiAwKS50b1N0cmluZyg4KVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAncyc6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBTdHJpbmcoYXJnKVxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gKHBoLnByZWNpc2lvbiA/IGFyZy5zdWJzdHJpbmcoMCwgcGgucHJlY2lzaW9uKSA6IGFyZylcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3QnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gU3RyaW5nKCEhYXJnKVxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gKHBoLnByZWNpc2lvbiA/IGFyZy5zdWJzdHJpbmcoMCwgcGgucHJlY2lzaW9uKSA6IGFyZylcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ1QnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFyZykuc2xpY2UoOCwgLTEpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IChwaC5wcmVjaXNpb24gPyBhcmcuc3Vic3RyaW5nKDAsIHBoLnByZWNpc2lvbikgOiBhcmcpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICd1JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IHBhcnNlSW50KGFyZywgMTApID4+PiAwXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICd2JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IGFyZy52YWx1ZU9mKClcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IChwaC5wcmVjaXNpb24gPyBhcmcuc3Vic3RyaW5nKDAsIHBoLnByZWNpc2lvbikgOiBhcmcpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICd4JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IChwYXJzZUludChhcmcsIDEwKSA+Pj4gMCkudG9TdHJpbmcoMTYpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdYJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IChwYXJzZUludChhcmcsIDEwKSA+Pj4gMCkudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKClcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChyZS5qc29uLnRlc3QocGgudHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0ICs9IGFyZ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlLm51bWJlci50ZXN0KHBoLnR5cGUpICYmICghaXNfcG9zaXRpdmUgfHwgcGguc2lnbikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpZ24gPSBpc19wb3NpdGl2ZSA/ICcrJyA6ICctJ1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJnLnRvU3RyaW5nKCkucmVwbGFjZShyZS5zaWduLCAnJylcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpZ24gPSAnJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHBhZF9jaGFyYWN0ZXIgPSBwaC5wYWRfY2hhciA/IHBoLnBhZF9jaGFyID09PSAnMCcgPyAnMCcgOiBwaC5wYWRfY2hhci5jaGFyQXQoMSkgOiAnICdcbiAgICAgICAgICAgICAgICAgICAgcGFkX2xlbmd0aCA9IHBoLndpZHRoIC0gKHNpZ24gKyBhcmcpLmxlbmd0aFxuICAgICAgICAgICAgICAgICAgICBwYWQgPSBwaC53aWR0aCA/IChwYWRfbGVuZ3RoID4gMCA/IHBhZF9jaGFyYWN0ZXIucmVwZWF0KHBhZF9sZW5ndGgpIDogJycpIDogJydcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0ICs9IHBoLmFsaWduID8gc2lnbiArIGFyZyArIHBhZCA6IChwYWRfY2hhcmFjdGVyID09PSAnMCcgPyBzaWduICsgcGFkICsgYXJnIDogcGFkICsgc2lnbiArIGFyZylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dHB1dFxuICAgIH1cblxuICAgIHZhciBzcHJpbnRmX2NhY2hlID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuXG4gICAgZnVuY3Rpb24gc3ByaW50Zl9wYXJzZShmbXQpIHtcbiAgICAgICAgaWYgKHNwcmludGZfY2FjaGVbZm10XSkge1xuICAgICAgICAgICAgcmV0dXJuIHNwcmludGZfY2FjaGVbZm10XVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIF9mbXQgPSBmbXQsIG1hdGNoLCBwYXJzZV90cmVlID0gW10sIGFyZ19uYW1lcyA9IDBcbiAgICAgICAgd2hpbGUgKF9mbXQpIHtcbiAgICAgICAgICAgIGlmICgobWF0Y2ggPSByZS50ZXh0LmV4ZWMoX2ZtdCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcGFyc2VfdHJlZS5wdXNoKG1hdGNoWzBdKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoKG1hdGNoID0gcmUubW9kdWxvLmV4ZWMoX2ZtdCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcGFyc2VfdHJlZS5wdXNoKCclJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKChtYXRjaCA9IHJlLnBsYWNlaG9sZGVyLmV4ZWMoX2ZtdCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoWzJdKSB7XG4gICAgICAgICAgICAgICAgICAgIGFyZ19uYW1lcyB8PSAxXG4gICAgICAgICAgICAgICAgICAgIHZhciBmaWVsZF9saXN0ID0gW10sIHJlcGxhY2VtZW50X2ZpZWxkID0gbWF0Y2hbMl0sIGZpZWxkX21hdGNoID0gW11cbiAgICAgICAgICAgICAgICAgICAgaWYgKChmaWVsZF9tYXRjaCA9IHJlLmtleS5leGVjKHJlcGxhY2VtZW50X2ZpZWxkKSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkX2xpc3QucHVzaChmaWVsZF9tYXRjaFsxXSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlICgocmVwbGFjZW1lbnRfZmllbGQgPSByZXBsYWNlbWVudF9maWVsZC5zdWJzdHJpbmcoZmllbGRfbWF0Y2hbMF0ubGVuZ3RoKSkgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChmaWVsZF9tYXRjaCA9IHJlLmtleV9hY2Nlc3MuZXhlYyhyZXBsYWNlbWVudF9maWVsZCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkX2xpc3QucHVzaChmaWVsZF9tYXRjaFsxXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoKGZpZWxkX21hdGNoID0gcmUuaW5kZXhfYWNjZXNzLmV4ZWMocmVwbGFjZW1lbnRfZmllbGQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZF9saXN0LnB1c2goZmllbGRfbWF0Y2hbMV0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoJ1tzcHJpbnRmXSBmYWlsZWQgdG8gcGFyc2UgbmFtZWQgYXJndW1lbnQga2V5JylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoJ1tzcHJpbnRmXSBmYWlsZWQgdG8gcGFyc2UgbmFtZWQgYXJndW1lbnQga2V5JylcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBtYXRjaFsyXSA9IGZpZWxkX2xpc3RcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGFyZ19uYW1lcyB8PSAyXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChhcmdfbmFtZXMgPT09IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdbc3ByaW50Zl0gbWl4aW5nIHBvc2l0aW9uYWwgYW5kIG5hbWVkIHBsYWNlaG9sZGVycyBpcyBub3QgKHlldCkgc3VwcG9ydGVkJylcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBwYXJzZV90cmVlLnB1c2goXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiBtYXRjaFswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtX25vOiAgICBtYXRjaFsxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleXM6ICAgICAgICBtYXRjaFsyXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpZ246ICAgICAgICBtYXRjaFszXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZF9jaGFyOiAgICBtYXRjaFs0XSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsaWduOiAgICAgICBtYXRjaFs1XSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAgICAgICBtYXRjaFs2XSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZWNpc2lvbjogICBtYXRjaFs3XSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICAgICAgICBtYXRjaFs4XVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKCdbc3ByaW50Zl0gdW5leHBlY3RlZCBwbGFjZWhvbGRlcicpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfZm10ID0gX2ZtdC5zdWJzdHJpbmcobWF0Y2hbMF0ubGVuZ3RoKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzcHJpbnRmX2NhY2hlW2ZtdF0gPSBwYXJzZV90cmVlXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZXhwb3J0IHRvIGVpdGhlciBicm93c2VyIG9yIG5vZGUuanNcbiAgICAgKi9cbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBxdW90ZS1wcm9wcyAqL1xuICAgIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZXhwb3J0c1snc3ByaW50ZiddID0gc3ByaW50ZlxuICAgICAgICBleHBvcnRzWyd2c3ByaW50ZiddID0gdnNwcmludGZcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHdpbmRvd1snc3ByaW50ZiddID0gc3ByaW50ZlxuICAgICAgICB3aW5kb3dbJ3ZzcHJpbnRmJ10gPSB2c3ByaW50ZlxuXG4gICAgICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZVsnYW1kJ10pIHtcbiAgICAgICAgICAgIGRlZmluZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAnc3ByaW50Zic6IHNwcmludGYsXG4gICAgICAgICAgICAgICAgICAgICd2c3ByaW50Zic6IHZzcHJpbnRmXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKiBlc2xpbnQtZW5hYmxlIHF1b3RlLXByb3BzICovXG59KCk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiIsIi8qKlxuICogUGFydCBvZiB1bmljb3JuIHByb2plY3QuXG4gKlxuICogQGNvcHlyaWdodCAgQ29weXJpZ2h0IChDKSAyMDE4ICR7T1JHQU5JWkFUSU9OfS5cbiAqIEBsaWNlbnNlICAgIF9fTElDRU5TRV9fXG4gKi9cblxuaW1wb3J0IHsgcHJlcGFyZURhdGEgfSBmcm9tICcuL3V0aWxpdGllcy5qcyc7XG5pbXBvcnQgJ3NwcmludGYtanMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVbmljb3JuSGVscGVyIHtcbiAgc3RhdGljIGdldCBpcygpIHsgcmV0dXJuICdoZWxwZXInOyB9XG5cbiAgc3RhdGljIGluc3RhbGwoYXBwLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBoZWxwZXIgPSBhcHAuJGhlbHBlciA9IG5ldyB0aGlzKGFwcCk7XG5cbiAgICBhcHAuc2VsZWN0T25lID0gaGVscGVyLnNlbGVjdE9uZS5iaW5kKGhlbHBlcik7XG4gICAgYXBwLnNlbGVjdEFsbCA9IGhlbHBlci5zZWxlY3RBbGw7XG4gICAgYXBwLmggPSBoZWxwZXIuaDtcbiAgICBhcHAuJGdldCA9IGhlbHBlci4kZ2V0O1xuICAgIGFwcC4kc2V0ID0gaGVscGVyLiRzZXQ7XG4gICAgYXBwLmlzRGVidWcgPSBoZWxwZXIuaXNEZWJ1Zy5iaW5kKGhlbHBlcik7XG4gICAgYXBwLmNvbmZpcm0gPSBoZWxwZXIuY29uZmlybS5iaW5kKGhlbHBlcik7XG4gICAgYXBwLmtlZXBBbGl2ZSA9IGhlbHBlci5rZWVwQWxpdmUuYmluZChoZWxwZXIpO1xuICAgIGFwcC5zdG9wS2VlcEFsaXZlID0gaGVscGVyLnN0b3BLZWVwQWxpdmU7XG4gICAgYXBwLmlzTnVsbERhdGUgPSBoZWxwZXIuaXNOdWxsRGF0ZS5iaW5kKGhlbHBlcik7XG4gICAgYXBwLmdldE51bGxEYXRlID0gaGVscGVyLmdldE51bGxEYXRlLmJpbmQoaGVscGVyKTtcbiAgICBhcHAubnVtYmVyRm9ybWF0ID0gaGVscGVyLm51bWJlckZvcm1hdDtcbiAgICBhcHAuc3ByaW50ZiA9IHNwcmludGY7XG4gICAgYXBwLnZzcHJpbnRmID0gdnNwcmludGY7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihhcHApIHtcbiAgICB0aGlzLmFwcCA9IGFwcDtcbiAgICB0aGlzLmFsaXZlSGFuZGxlID0gbnVsbDtcbiAgfVxuXG4gIHNlbGVjdE9uZShlbGUpIHtcbiAgIGlmICh0eXBlb2YgZWxlID09PSAnc3RyaW5nJykge1xuICAgICBlbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsZSk7XG4gICB9XG5cbiAgIHJldHVybiBwcmVwYXJlRGF0YShlbGUpO1xuICB9XG5cbiAgc2VsZWN0QWxsKGVsZSwgY2FsbGJhY2spIHtcbiAgICBpZiAodHlwZW9mIGVsZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGVsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoZWxlKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHRTZXQgPSBbXS5zbGljZS5jYWxsKGVsZSk7XG5cbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIHJldHVybiByZXN1bHRTZXQubWFwKGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0U2V0O1xuICB9XG5cbiAgaChlbGVtZW50LCBhdHRycyA9IHt9LCBjb250ZW50ID0gbnVsbCkge1xuICAgIGNvbnN0IGVsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZWxlbWVudCk7XG5cbiAgICBmb3IgKGxldCBpIGluIGF0dHJzKSB7XG4gICAgICBjb25zdCB2ID0gYXR0cnNbaV07XG5cbiAgICAgIGVsZS5zZXRBdHRyaWJ1dGUoaSwgdik7XG4gICAgfVxuXG4gICAgaWYgKGNvbnRlbnQgIT09IG51bGwpIHtcbiAgICAgIGVsZS5pbm5lckhUTUwgPSBjb250ZW50O1xuICAgIH1cblxuICAgIHJldHVybiBlbGU7XG4gIH1cblxuICBnZXQob2JqLCBwYXRoKSB7XG4gICAgY29uc3Qga2V5cyA9IEFycmF5LmlzQXJyYXkocGF0aCkgPyBwYXRoIDogcGF0aC5zcGxpdCgnLicpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBrZXkgPSBrZXlzW2ldO1xuXG4gICAgICBpZiAoIW9iaiB8fCAhb2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgb2JqID0gdW5kZWZpbmVkO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgb2JqID0gb2JqW2tleV07XG4gICAgfVxuXG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIHNldChvYmosIHBhdGgsIHZhbHVlKSB7XG4gICAgY29uc3Qga2V5cyA9IEFycmF5LmlzQXJyYXkocGF0aCkgPyBwYXRoIDogcGF0aC5zcGxpdCgnLicpO1xuICAgIGxldCBpO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGtleXMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICBjb25zdCBrZXkgPSBrZXlzW2ldO1xuXG4gICAgICBpZiAoIW9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIG9ialtrZXldID0ge307XG4gICAgICB9XG5cbiAgICAgIG9iaiA9IG9ialtrZXldO1xuICAgIH1cblxuICAgIG9ialtrZXlzW2ldXSA9IHZhbHVlO1xuXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgaXNEZWJ1ZygpIHtcbiAgICByZXR1cm4gQm9vbGVhbih0aGlzLmFwcC5kYXRhKCd3aW5kd2Fsa2VyLmRlYnVnJykpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbmZpcm0gcG9wdXAuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSAgIG1lc3NhZ2VcbiAgICpcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICovXG4gIGNvbmZpcm0obWVzc2FnZSkge1xuICAgIG1lc3NhZ2UgPSBtZXNzYWdlIHx8ICdBcmUgeW91IHN1cmU/JztcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgcmVzb2x2ZShjb25maXJtKG1lc3NhZ2UpKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIGxvYWRTY3JpcHQodXJscywgYXV0b0NvbnZlcnQgPSB0cnVlKSB7XG4gIC8vICAgaWYgKHR5cGVvZiB1cmxzID09PSAnc3RyaW5nJykge1xuICAvLyAgICAgdXJscyA9IFt1cmxzXTtcbiAgLy8gICB9XG4gIC8vXG4gIC8vICAgY29uc3QgcHJvbWlzZXMgPSBbXTtcbiAgLy8gICBjb25zdCBkYXRhID0ge307XG4gIC8vICAgY29uc3QgZW5kc1dpdGggPSAoc3RyLCBzdWZmaXgpID0+IHN0ci5pbmRleE9mKHN1ZmZpeCwgc3RyLmxlbmd0aCAtIHN1ZmZpeC5sZW5ndGgpID49IDA7XG4gIC8vICAgZGF0YVt0aGlzLmFwcC5hc3NldCgndmVyc2lvbicpXSA9ICcxJztcbiAgLy9cbiAgLy8gICB1cmxzLmZvckVhY2godXJsID0+IHtcbiAgLy8gICAgIGNvbnN0IGV4dCA9IHVybC5zcGxpdCgnLicpLnBvcCgpO1xuICAvLyAgICAgbGV0IGxvYWRVcmkgPSB1cmw7XG4gIC8vXG4gIC8vICAgICBpZiAoYXV0b0NvbnZlcnQpIHtcbiAgLy8gICAgICAgbGV0IGFzc2V0RmlsZSwgYXNzZXRNaW5GaWxlO1xuICAvL1xuICAvLyAgICAgICBpZiAoZW5kc1dpdGgodXJsLCAnLm1pbi4nICsgZXh0KSkge1xuICAvLyAgICAgICAgIGFzc2V0TWluRmlsZSA9IHVybDtcbiAgLy8gICAgICAgICBhc3NldEZpbGUgPSB1cmwuc2xpY2UoMCwgLWAubWluLiR7ZXh0fWAubGVuZ3RoKSArICcuJyArIGV4dDtcbiAgLy8gICAgICAgfSBlbHNlIHtcbiAgLy8gICAgICAgICBhc3NldEZpbGUgPSB1cmw7XG4gIC8vICAgICAgICAgYXNzZXRNaW5GaWxlID0gdXJsLnNsaWNlKDAsIC1gLiR7ZXh0fWAubGVuZ3RoKSArICcubWluLicgKyBleHQ7XG4gIC8vICAgICAgIH1cbiAgLy9cbiAgLy8gICAgICAgbG9hZFVyaSA9IHRoaXMuYXBwLmRhdGEoJ3dpbmR3YWxrZXIuZGVidWcnKSA/IGFzc2V0RmlsZSA6IGFzc2V0TWluRmlsZTtcbiAgLy8gICAgIH1cbiAgLy9cbiAgLy8gICAgIHByb21pc2VzLnB1c2goXG4gIC8vICAgICAgICQuZ2V0U2NyaXB0KHtcbiAgLy8gICAgICAgICB1cmw6IHRoaXMuYWRkVXJpQmFzZShsb2FkVXJpKSxcbiAgLy8gICAgICAgICBjYWNoZTogdHJ1ZSxcbiAgLy8gICAgICAgICBkYXRhXG4gIC8vICAgICAgIH0pXG4gIC8vICAgICApO1xuICAvLyAgIH0pO1xuICAvL1xuICAvLyAgIHJldHVybiAkLndoZW4oLi4ucHJvbWlzZXMpO1xuICAvLyB9XG5cbiAgYWRkVXJpQmFzZSh1cmksIHR5cGUgPSAncGF0aCcpIHtcbiAgICBpZiAodXJpLnN1YnN0cigwLCAyKSA9PT0gJy9cXC8nIHx8IHVyaS5zdWJzdHIoMCwgNCkgPT09ICdodHRwJykge1xuICAgICAgcmV0dXJuIHVyaTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5hcHAuYXNzZXQodHlwZSkgKyAnLycgKyB1cmk7XG4gIH1cblxuICAvKipcbiAgICogTm90aWZ5IGluZm9ybWF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ3xBcnJheX0gbWVzc2FnZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gICAgICAgdHlwZVxuICAgKiBAcmV0dXJucyB7Kn1cbiAgICovXG4gIC8vIG5vdGlmeShtZXNzYWdlLCB0eXBlID0gJ2luZm8nKSB7XG4gIC8vICAgcmV0dXJuIHRoaXMuYXBwLmFkZE1lc3NhZ2UobWVzc2FnZSwgdHlwZSk7XG4gIC8vIH1cblxuICAvKipcbiAgICogS2VlcCBhbGl2ZS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVybFxuICAgKiBAcGFyYW0ge051bWJlcn0gdGltZVxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAqL1xuICBrZWVwQWxpdmUodXJsLCB0aW1lID0gNjAwMDApIHtcbiAgICByZXR1cm4gdGhpcy5hbGl2ZUhhbmRsZSA9IHdpbmRvdy5zZXRJbnRlcnZhbCgoKSA9PiBmZXRjaCh1cmwpLCB0aW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9wIGtlZXAgYWxpdmVcbiAgICovXG4gIHN0b3BLZWVwQWxpdmUoKSB7XG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLmFsaXZlSGFuZGxlKTtcblxuICAgIHRoaXMuYWxpdmVIYW5kbGUgPSAgbnVsbDtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIElzIE5VTEwgZGF0ZSBmcm9tIGRlZmF1bHQgU1FMLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZGF0ZVxuICAgKi9cbiAgaXNOdWxsRGF0ZShkYXRlKSB7XG4gICAgcmV0dXJuIFsnMDAwMC0wMC0wMCAwMDowMDowMCcsIHRoaXMuZ2V0TnVsbERhdGUoKV0uaW5kZXhPZihkYXRlKSAhPT0gLTE7XG4gIH1cblxuICAvKipcbiAgICogR2V0IE5VTEwgZGF0ZSBmcm9tIGRlZmF1bHQgU1FMLlxuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0TnVsbERhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwLmRhdGEoJ3VuaWNvcm4uZGF0ZScpWydlbXB0eSddO1xuICB9XG5cbiAgLyoqXG4gICAqIE51bWJlciBmb3JtYXQgbGlrZSBwaHAgZnVuY3Rpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfG51bWJlcn0gbnVtYmVyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSAgICAgICAgZGVjaW1hbHNcbiAgICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICBkZWNQb2ludFxuICAgKiBAcGFyYW0ge3N0cmluZ30gICAgICAgIHRob3VzYW5kc1NlcFxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cbiAgbnVtYmVyRm9ybWF0KG51bWJlciwgZGVjaW1hbHMgPSAwLCBkZWNQb2ludCA9ICcuJywgdGhvdXNhbmRzU2VwID0gJywnKSB7XG4gICAgZGVjaW1hbHMgPSBkZWNpbWFscyB8fCAwO1xuICAgIG51bWJlciA9IHBhcnNlRmxvYXQobnVtYmVyKTtcblxuICAgIGxldCByb3VuZGVkTnVtYmVyID0gTWF0aC5yb3VuZChNYXRoLmFicyhudW1iZXIpICogKCcxZScgKyBkZWNpbWFscykpICsgJyc7XG4gICAgbGV0IG51bWJlcnNTdHJpbmcgPSBkZWNpbWFscyA/IHJvdW5kZWROdW1iZXIuc2xpY2UoMCwgZGVjaW1hbHMgKiAtMSkgOiByb3VuZGVkTnVtYmVyO1xuICAgIGxldCBkZWNpbWFsc1N0cmluZyA9IGRlY2ltYWxzID8gcm91bmRlZE51bWJlci5zbGljZShkZWNpbWFscyAqIC0xKSA6ICcnO1xuICAgIGxldCBmb3JtYXR0ZWROdW1iZXIgPSBcIlwiO1xuXG4gICAgd2hpbGUgKG51bWJlcnNTdHJpbmcubGVuZ3RoID4gMykge1xuICAgICAgZm9ybWF0dGVkTnVtYmVyICs9IHRob3VzYW5kc1NlcCArIG51bWJlcnNTdHJpbmcuc2xpY2UoLTMpO1xuICAgICAgbnVtYmVyc1N0cmluZyA9IG51bWJlcnNTdHJpbmcuc2xpY2UoMCwgLTMpO1xuICAgIH1cblxuICAgIHJldHVybiAobnVtYmVyIDwgMCA/ICctJyA6ICcnKSArIG51bWJlcnNTdHJpbmcgKyBmb3JtYXR0ZWROdW1iZXIgKyAoZGVjaW1hbHNTdHJpbmcgPyAoZGVjUG9pbnQgKyBkZWNpbWFsc1N0cmluZykgOiAnJyk7XG4gIH1cbn1cbiIsIi8qKlxuICogUGFydCBvZiBVbmljb3JuIHByb2plY3QuXG4gKlxuICogQGNvcHlyaWdodCAgQ29weXJpZ2h0IChDKSAyMDE2IExZUkFTT0ZULiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogQGxpY2Vuc2UgICAgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAyIG9yIGxhdGVyLlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFVuaWNvcm5IdHRwIHtcbiAgZ2xvYmFsQXhpb3M7XG4gIGF4aW9zO1xuXG4gIHN0YXRpYyBnZXQgaXMoKSB7IHJldHVybiAnaHR0cCc7IH1cblxuICBzdGF0aWMgaW5zdGFsbChhcHAsIG9wdGlvbnMpIHtcbiAgICBhcHAuJGh0dHAgPSBuZXcgdGhpcyhhcHApO1xuICB9XG5cbiAgY29uc3RydWN0b3IoYXBwKSB7XG4gICAgdGhpcy5hcHAgPSBhcHA7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHtcbiAgICAgIGN1c3RvbU1ldGhvZDogZmFsc2UsXG4gICAgfTtcblxuICAgIHRoaXMuZGF0YSA9IHt9O1xuICB9XG5cbiAgZ2V0IGdldFNlbGYoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBjcmVhdGVIdHRwKCkge1xuICAgIGlmICghdGhpcy5nbG9iYWxBeGlvcykge1xuICAgICAgdGhpcy5nbG9iYWxBeGlvcyA9IHRoaXMuYXBwLmltcG9ydCgnQGF4aW9zJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZ2xvYmFsQXhpb3MudGhlbigoYXhpb3MpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmF4aW9zID0gYXhpb3MuY3JlYXRlKHRoaXMub3B0aW9ucy5heGlvcyB8fCB7fSk7XG4gICAgfSk7XG4gIH1cblxuICBnZXRIdHRwKCkge1xuICAgIGlmICh0aGlzLmF4aW9zKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuYXhpb3MpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmNyZWF0ZUh0dHAoKS50aGVuKChheGlvcykgPT4gdGhpcy5heGlvcyA9IGF4aW9zKTtcbiAgfVxuXG4gIHByZXBhcmVBeGlvcyhheGlvcykge1xuICAgIGF4aW9zLmludGVyY2VwdG9ycy5yZXF1ZXN0LnVzZShmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgICBjb25maWcuaGVhZGVyc1snWC1DU1JGLVRva2VuJ10gPSB0aGlzLmFwcC5kYXRhKCdjc3JmLXRva2VuJyk7XG5cbiAgICAgIHJldHVybiBjb25maWc7XG4gICAgfSk7XG4gIH1cblxuICByZXF1ZXN0TWlkZGxld2FyZShjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmdldEh0dHAoKS50aGVuKGF4aW9zID0+IGF4aW9zLmludGVyY2VwdG9ycy5yZXF1ZXN0LnVzZShjYWxsYmFjaykpO1xuICB9XG5cbiAgcmVzcG9uc2VNaWRkbGV3YXJlKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0SHR0cCgpLnRoZW4oYXhpb3MgPT4gYXhpb3MuaW50ZXJjZXB0b3JzLnJlc3BvbnNlLnVzZShjYWxsYmFjaykpO1xuICB9XG5cbiAgcmVhZHkoKSB7XG4gICAgc3VwZXIucmVhZHkoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIGEgR0VUIHJlcXVlc3QuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cmxcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICpcbiAgICogQHJldHVybnMge0F4aW9zUmVzcG9uc2V9XG4gICAqL1xuICBnZXQodXJsLCBvcHRpb25zID0ge30pIHtcbiAgICBvcHRpb25zLnVybCA9IHVybDtcbiAgICBvcHRpb25zLm1ldGhvZCA9ICdHRVQnO1xuXG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIGEgUE9TVCByZXF1ZXN0LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsXG4gICAqIEBwYXJhbSB7T2JqZWN0fHN0cmluZ30gZGF0YVxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKlxuICAgKiBAcmV0dXJucyB7QXhpb3NSZXNwb25zZX1cbiAgICovXG4gIHBvc3QodXJsLCBkYXRhLCBvcHRpb25zID0ge30pIHtcbiAgICBvcHRpb25zLnVybCA9IHVybDtcbiAgICBvcHRpb25zLm1ldGhvZCA9ICdQT1NUJztcbiAgICBvcHRpb25zLmRhdGEgPSBkYXRhO1xuXG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIGEgUFVUIHJlcXVlc3QuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cmxcbiAgICogQHBhcmFtIHtPYmplY3R8c3RyaW5nfSBkYXRhXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqXG4gICAqIEByZXR1cm5zIHtBeGlvc1Jlc3BvbnNlfVxuICAgKi9cbiAgcHV0KHVybCwgZGF0YSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgb3B0aW9ucy51cmwgPSB1cmw7XG4gICAgb3B0aW9ucy5tZXRob2QgPSAnUFVUJztcbiAgICBvcHRpb25zLmRhdGEgPSBkYXRhO1xuXG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIGEgUEFUQ0ggcmVxdWVzdC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVybFxuICAgKiBAcGFyYW0ge09iamVjdHxzdHJpbmd9IGRhdGFcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICpcbiAgICogQHJldHVybnMge0F4aW9zUmVzcG9uc2V9XG4gICAqL1xuICBwYXRjaCh1cmwsIGRhdGEsIG9wdGlvbnMgPSB7fSkge1xuICAgIG9wdGlvbnMudXJsID0gdXJsO1xuICAgIG9wdGlvbnMubWV0aG9kID0gJ1BBVENIJztcbiAgICBvcHRpb25zLmRhdGEgPSBkYXRhO1xuXG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIGEgREVMRVRFIHJlcXVlc3QuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cmxcbiAgICogQHBhcmFtIHtPYmplY3R8c3RyaW5nfSBkYXRhXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqXG4gICAqIEByZXR1cm5zIHtBeGlvc1Jlc3BvbnNlfVxuICAgKi9cbiAgJ2RlbGV0ZScodXJsLCBkYXRhLCBvcHRpb25zID0ge30pIHtcbiAgICBvcHRpb25zLnVybCA9IHVybDtcbiAgICBvcHRpb25zLm1ldGhvZCA9ICdERUxFVEUnO1xuICAgIG9wdGlvbnMuZGF0YSA9IGRhdGE7XG5cbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSBIRUFEIHJlcXVlc3QuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cmxcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICpcbiAgICogQHJldHVybnMge0F4aW9zUmVzcG9uc2V9XG4gICAqL1xuICBoZWFkKHVybCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgb3B0aW9ucy51cmwgPSB1cmw7XG4gICAgb3B0aW9ucy5tZXRob2QgPSAnSEVBRCc7XG5cbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSBPUFRJT05TIHJlcXVlc3QuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cmxcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICpcbiAgICogQHJldHVybnMge0F4aW9zUmVzcG9uc2V9XG4gICAqL1xuICBvcHRpb25zKHVybCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgb3B0aW9ucy51cmwgPSB1cmw7XG4gICAgb3B0aW9ucy5tZXRob2QgPSAnT1BUSU9OUyc7XG5cbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgcmVxdWVzdC5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2U8QXhpb3NSZXNwb25zZT59XG4gICAqL1xuICByZXF1ZXN0KG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRIdHRwKCkudGhlbihheGlvcyA9PiB7XG4gICAgICByZXR1cm4gYXhpb3Mob3B0aW9ucyk7XG4gICAgfSk7XG4gICAgLy8gbGV0IHJlcU9wdGlvbnMgPSBvcHRpb25zO1xuICAgIC8vIGxldCByZXFVcmwgPSB1cmw7XG4gICAgLy8gbGV0IHJlcUhlYWRlcnMgPSBoZWFkZXJzO1xuICAgIC8vXG4gICAgLy8gaWYgKHR5cGVvZiByZXFVcmwgPT09ICdvYmplY3QnKSB7XG4gICAgLy8gICByZXFPcHRpb25zID0gcmVxVXJsO1xuICAgIC8vICAgcmVxVXJsID0gcmVxT3B0aW9ucy51cmw7XG4gICAgLy8gfVxuICAgIC8vXG4gICAgLy8gY29uc3QgaXNGb3JtRGF0YSA9IGRhdGEgaW5zdGFuY2VvZiBGb3JtRGF0YTtcbiAgICAvL1xuICAgIC8vIGlmIChpc0Zvcm1EYXRhKSB7XG4gICAgLy8gICByZXFPcHRpb25zLnByb2Nlc3NEYXRhID0gZmFsc2U7XG4gICAgLy8gICByZXFPcHRpb25zLmNvbnRlbnRUeXBlID0gZmFsc2U7XG4gICAgLy8gfVxuICAgIC8vXG4gICAgLy8gaWYgKHR5cGVvZiByZXFPcHRpb25zLmRhdGFUeXBlID09PSAndW5kZWZpbmVkJykge1xuICAgIC8vICAgcmVxT3B0aW9ucy5kYXRhVHlwZSA9ICdqc29uJztcbiAgICAvLyB9XG4gICAgLy9cbiAgICAvLyByZXFPcHRpb25zLmRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycgfHwgaXNGb3JtRGF0YVxuICAgIC8vICAgPyBkYXRhXG4gICAgLy8gICA6ICQuZXh0ZW5kKHRydWUsIHt9LCB0aGlzLmRhdGEsIHJlcU9wdGlvbnMuZGF0YSwgZGF0YSk7XG4gICAgLy9cbiAgICAvLyByZXFPcHRpb25zLnR5cGUgPSBtZXRob2QudG9VcHBlckNhc2UoKSB8fCAnR0VUJztcbiAgICAvLyBjb25zdCB7IHR5cGUgfSA9IHJlcU9wdGlvbnM7XG4gICAgLy9cbiAgICAvLyBpZiAoWydQT1NUJywgJ0dFVCddLmluZGV4T2YocmVxT3B0aW9ucy50eXBlKSA9PT0gLTEgJiYgdGhpcy5jb25maWcuY3VzdG9tTWV0aG9kKSB7XG4gICAgLy8gICByZXFIZWFkZXJzWydYLUhUVFAtTWV0aG9kLU92ZXJyaWRlJ10gPSByZXFPcHRpb25zLnR5cGU7XG4gICAgLy8gICByZXFPcHRpb25zLmRhdGEuX21ldGhvZCA9IHJlcU9wdGlvbnMudHlwZTtcbiAgICAvLyAgIHJlcU9wdGlvbnMudHlwZSA9ICdQT1NUJztcbiAgICAvLyB9XG4gICAgLy9cbiAgICAvLyByZXFPcHRpb25zLmhlYWRlcnMgPSAkLmV4dGVuZChcbiAgICAvLyAgIHRydWUsXG4gICAgLy8gICB7fSxcbiAgICAvLyAgIHRoaXMuaGVhZGVycy5fZ2xvYmFsLFxuICAgIC8vICAgdGhpcy5oZWFkZXJzW3R5cGVdLFxuICAgIC8vICAgcmVxT3B0aW9ucy5oZWFkZXJzLFxuICAgIC8vICAgcmVxSGVhZGVycyxcbiAgICAvLyApO1xuICAgIC8vXG4gICAgLy8gcmV0dXJuIHRoaXMuJC5hamF4KHJlcVVybCwgcmVxT3B0aW9ucylcbiAgICAvLyAgIC5mYWlsKCh4aHIsIGVycm9yKSA9PiB7XG4gICAgLy8gICAgIGlmIChlcnJvciA9PT0gJ3BhcnNlcmVycm9yJykge1xuICAgIC8vICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgIC8vICAgICAgIHhoci5zdGF0dXNUZXh0ID0gJ1VuYWJsZSB0byBwYXJzZSBkYXRhLic7XG4gICAgLy8gICAgIH0gZWxzZSB7XG4gICAgLy8gICAgICAgeGhyLnN0YXR1c1RleHQgPSBkZWNvZGVVUklDb21wb25lbnQoeGhyLnN0YXR1c1RleHQpO1xuICAgIC8vICAgICB9XG4gICAgLy8gICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgY3VzdG9tIG1ldGhvZCB3aXRoIF9tZXRob2QgcGFyYW1ldGVyLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCB3aWxsIHJldHVybiBhIGNsb25lIG9mIHRoaXMgb2JqZWN0IHRvIGhlbHAgdXMgc2VuZCByZXF1ZXN0IG9uY2UuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPHRoaXM+fVxuICAgKi9cbiAgY3VzdG9tTWV0aG9kKHVzZUhlYWRlciA9IHRydWUpIHtcbiAgICBjb25zdCBjbG9uZSA9IHRoaXM7XG4gICAgY2xvbmUuYXhpb3MgPSBudWxsO1xuXG4gICAgcmV0dXJuIGNsb25lLnJlcXVlc3RNaWRkbGV3YXJlKChjb25maWcpID0+IHtcbiAgICAgIGlmICh1c2VIZWFkZXIpIHtcbiAgICAgICAgY29uZmlnLmhlYWRlcnNbJ1gtSFRUUC1NZXRob2QtT3ZlcnJpZGUnXSA9IGNvbmZpZztcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvbmZpZy5kYXRhID09PSAnb2JqZWN0Jykge1xuICAgICAgICBjb25maWcuZGF0YVsnX21ldGhvZCddID0gY29uZmlnLm1ldGhvZDtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvbmZpZy5kYXRhID09PSAnc3RyaW5nJykge1xuICAgICAgICBpZiAoY29uZmlnLmRhdGEuaW5jbHVkZXMoJz8nKSkge1xuICAgICAgICAgIGNvbmZpZy5kYXRhICs9ICcmX21ldGhvZD0nICsgY29uZmlnLm1ldGhvZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25maWcuZGF0YSArPSAnP19tZXRob2Q9JyArIGNvbmZpZy5tZXRob2Q7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uZmlnLm1ldGhvZCA9ICdQT1NUJztcblxuICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICB9KS50aGVuKCgpID0+IGNsb25lKTtcbiAgfVxufVxuIiwiLyoqXHJcbiAqIFBhcnQgb2Ygc3RhcnRlciBwcm9qZWN0LlxyXG4gKlxyXG4gKiBAY29weXJpZ2h0ICBDb3B5cmlnaHQgKEMpIDIwMjEgX19PUkdBTklaQVRJT05fXy5cclxuICogQGxpY2Vuc2UgICAgX19MSUNFTlNFX19cclxuICovXHJcblxyXG5pbXBvcnQgeyBFdmVudE1peGluIH0gZnJvbSAnLi9ldmVudHMuanMnO1xyXG5pbXBvcnQgeyBtaXggfSBmcm9tICcuL21peHdpdGguanMnO1xyXG5pbXBvcnQgeyBtZXJnZSB9IGZyb20gJ2xvZGFzaC1lcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVbmljb3JuQXBwIGV4dGVuZHMgbWl4KGNsYXNzIHt9KS53aXRoKEV2ZW50TWl4aW4pIHtcclxuICBwbHVnaW5zID0ge307XHJcbiAgX2xpc3RlbmVycyA9IHt9O1xyXG4gIHdhaXRzID0gW107XHJcblxyXG4gIC8qKlxyXG4gICAqIERlZmF1bHQgb3B0aW9ucy5cclxuICAgKiBAcmV0dXJucyB7T2JqZWN0fVxyXG4gICAqL1xyXG4gIHN0YXRpYyBnZXQgZGVmYXVsdE9wdGlvbnMoKSB7XHJcbiAgICByZXR1cm4ge307XHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgICB0aGlzLm9wdGlvbnMgPSBtZXJnZSh7fSwgdGhpcy5jb25zdHJ1Y3Rvci5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XHJcblxyXG4gICAgLy8gV2FpdCBkb20gcmVhZHlcclxuICAgIHRoaXMud2FpdCgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgcmVzb2x2ZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBSZWFkeVxyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcclxuICAgICAgdGhpcy5jb21wbGV0ZWQoKS50aGVuKCgpID0+IHRoaXMudHJpZ2dlcignbG9hZGVkJykpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB1c2UocGx1Z2luLCBvcHRpb25zID0ge30pIHtcclxuICAgIGlmIChBcnJheS5pc0FycmF5KHBsdWdpbikpIHtcclxuICAgICAgcGx1Z2luLmZvckVhY2gocCA9PiB0aGlzLnVzZShwKSk7XHJcbiAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGlmIChwbHVnaW4uaXMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgLy8gICB0aHJvdyBuZXcgRXJyb3IoYFBsdWdpbjogJHtwbHVnaW4ubmFtZX0gbXVzdCBpbnN0YW5jZSBvZiA6ICR7UGx1Z2luLm5hbWV9YCk7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgcGx1Z2luLmluc3RhbGwodGhpcywgb3B0aW9ucyk7XHJcblxyXG4gICAgdGhpcy50cmlnZ2VyKCdwbHVnaW4uaW5zdGFsbGVkJywgcGx1Z2luKTtcclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIGRldGFjaChwbHVnaW4pIHtcclxuICAgIGlmIChwbHVnaW4udW5pbnN0YWxsKSB7XHJcbiAgICAgIHBsdWdpbi51bmluc3RhbGwodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy50cmlnZ2VyKCdwbHVnaW4udW5pbnN0YWxsZWQnLCBwbHVnaW4pO1xyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgdGFwKHZhbHVlLCBjYWxsYmFjaykge1xyXG4gICAgY2FsbGJhY2sodmFsdWUpO1xyXG5cclxuICAgIHJldHVybiB2YWx1ZTtcclxuICB9XHJcblxyXG4gIC8vIHRyaWdnZXIoZXZlbnQsIC4uLmFyZ3MpIHtcclxuICAvLyAgIHJldHVybiB0aGlzLnRhcChzdXBlci50cmlnZ2VyKGV2ZW50LCAuLi5hcmdzKSwgKCkgPT4ge1xyXG4gIC8vICAgICBpZiAodGhpcy5kYXRhKCd3aW5kd2Fsa2VyLmRlYnVnJykpIHtcclxuICAvLyAgICAgICBjb25zb2xlLmRlYnVnKGBbVW5pY29ybiBFdmVudF0gJHtldmVudH1gLCBhcmdzLCB0aGlzLmxpc3RlbmVycyhldmVudCkpO1xyXG4gIC8vICAgICB9XHJcbiAgLy8gICB9KTtcclxuICAvLyB9XHJcblxyXG4gIGRhdGEobmFtZSwgdmFsdWUpIHtcclxuICAgIHRoaXMudHJpZ2dlcigndW5pY29ybi5kYXRhJywgbmFtZSwgdmFsdWUpO1xyXG5cclxuICAgIGRvY3VtZW50Ll9fdW5pY29ybiA9IGRvY3VtZW50Ll9fdW5pY29ybiB8fCB7fTtcclxuXHJcbiAgICBpZiAobmFtZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJldHVybiBkb2N1bWVudC5fX3VuaWNvcm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgY29uc3QgcmVzID0gZG9jdW1lbnQuX191bmljb3JuW25hbWVdO1xyXG5cclxuICAgICAgdGhpcy50cmlnZ2VyKCd1bmljb3JuLmRhdGEuZ2V0JywgbmFtZSwgcmVzKTtcclxuXHJcbiAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcblxyXG4gICAgZG9jdW1lbnQuX191bmljb3JuW25hbWVdID0gdmFsdWU7XHJcblxyXG4gICAgdGhpcy50cmlnZ2VyKCd1bmljb3JuLmRhdGEuc2V0JywgbmFtZSwgdmFsdWUpO1xyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgcmVtb3ZlRGF0YShuYW1lKSB7XHJcbiAgICBkb2N1bWVudC5fX3VuaWNvcm4gPSBkb2N1bWVudC5fX3VuaWNvcm4gfHwge307XHJcblxyXG4gICAgZGVsZXRlIGRvY3VtZW50Ll9fdW5pY29ybltuYW1lXTtcclxuXHJcbiAgICAkKGRvY3VtZW50KS5yZW1vdmVEYXRhKG5hbWUpO1xyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgdXJpKHR5cGUpIHtcclxuICAgIHJldHVybiB0aGlzLmRhdGEoJ3VuaWNvcm4udXJpJylbdHlwZV07XHJcbiAgfVxyXG5cclxuICBhc3NldCh0eXBlKSB7XHJcbiAgICByZXR1cm4gdGhpcy51cmkoJ2Fzc2V0JylbdHlwZV07XHJcbiAgfVxyXG5cclxuICB3YWl0KGNhbGxiYWNrKSB7XHJcbiAgICBjb25zdCBwID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBjb25zdCBwcm9taXNlID0gY2FsbGJhY2socmVzb2x2ZSwgcmVqZWN0KTtcclxuXHJcbiAgICAgIGlmIChwcm9taXNlICYmICd0aGVuJyBpbiBwcm9taXNlKSB7XHJcbiAgICAgICAgcHJvbWlzZS50aGVuKHJlc29sdmUpLmNhdGNoKHJlamVjdCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMud2FpdHMucHVzaChwKTtcclxuXHJcbiAgICByZXR1cm4gcDtcclxuICB9XHJcblxyXG4gIGNvbXBsZXRlZCgpIHtcclxuICAgIGNvbnN0IHByb21pc2UgPSBQcm9taXNlLmFsbCh0aGlzLndhaXRzKTtcclxuXHJcbiAgICB0aGlzLndhaXRzID0gW107XHJcblxyXG4gICAgcmV0dXJuIHByb21pc2U7XHJcbiAgfVxyXG59XHJcbiIsIi8qKlxuICogUGFydCBvZiBzdGFydGVyIHByb2plY3QuXG4gKlxuICogQGNvcHlyaWdodCAgQ29weXJpZ2h0IChDKSAyMDIxIF9fT1JHQU5JWkFUSU9OX18uXG4gKiBAbGljZW5zZSAgICBfX0xJQ0VOU0VfX1xuICovXG5cbmV4cG9ydCAqIGZyb20gJy4vZXZlbnRzLmpzJztcbmV4cG9ydCAqIGZyb20gJy4vbWl4d2l0aC5qcyc7XG5cbmltcG9ydCBVbmljb3JuVmFsaWRhdGlvbiBmcm9tICcuL3BsdWdpbi92YWxpZGF0aW9uLmpzJztcbmltcG9ydCBVbmljb3JuVUkgZnJvbSAnLi91aS5qcyc7XG5pbXBvcnQgVW5pY29ybkdyaWQgZnJvbSAnLi9wbHVnaW4vZ3JpZC5qcyc7XG5pbXBvcnQgVW5pY29ybkZvcm0gZnJvbSAnLi9wbHVnaW4vZm9ybS5qcyc7XG5pbXBvcnQgVW5pY29yblRpbnltY2UgZnJvbSAnLi9wbHVnaW4vdGlueW1jZS5qcyc7XG5pbXBvcnQgVW5pY29ybkxvYWRlciBmcm9tICcuL2xvYWRlci5qcyc7XG5pbXBvcnQgVW5pY29ybkhlbHBlciBmcm9tICcuL2hlbHBlci5qcyc7XG5pbXBvcnQgVW5pY29ybkh0dHAgZnJvbSAnLi9odHRwLmpzJztcbmltcG9ydCBVbmljb3JuQXBwIGZyb20gJy4vYXBwLmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgaGVscGVyIH0gZnJvbSAnLi9oZWxwZXIuanMnO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQXBwKG9wdGlvbnMgPSB7fSkge1xuICByZXR1cm4gbmV3IFVuaWNvcm5BcHAob3B0aW9ucyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBub0NvbmZsaWN0KCkge1xuICBjb25zdCB1bmkgPSB3aW5kb3cudTtcblxuICBkZWxldGUgd2luZG93LnU7XG5cbiAgcmV0dXJuIHVuaTtcbn1cblxuY29uc3QgdSA9IGNyZWF0ZUFwcCgpO1xuXG51LnVzZShVbmljb3JuTG9hZGVyKTtcbnUudXNlKFVuaWNvcm5IZWxwZXIpO1xudS51c2UoVW5pY29ybkh0dHApO1xudS51c2UoVW5pY29yblVJKTtcbnUudXNlKFVuaWNvcm5Gb3JtKTtcbnUudXNlKFVuaWNvcm5HcmlkKTtcbnUudXNlKFVuaWNvcm5WYWxpZGF0aW9uKTtcbnUudXNlKFVuaWNvcm5UaW55bWNlKTtcblxud2luZG93LnUgPSB1O1xuIl0sIm5hbWVzIjpbIl9hcHBsaWVkTWl4aW4iLCJhcHBseSIsInN1cGVyY2xhc3MiLCJtaXhpbiIsImFwcGxpY2F0aW9uIiwicHJvdG90eXBlIiwidW53cmFwIiwiaXNBcHBsaWNhdGlvbk9mIiwicHJvdG8iLCJoYXNPd25Qcm9wZXJ0eSIsImhhc01peGluIiwibyIsIk9iamVjdCIsImdldFByb3RvdHlwZU9mIiwiX3dyYXBwZWRNaXhpbiIsIndyYXAiLCJ3cmFwcGVyIiwic2V0UHJvdG90eXBlT2YiLCJfY2FjaGVkQXBwbGljYXRpb25zIiwiQ2FjaGVkIiwiY2FjaGVkQXBwbGljYXRpb25zIiwiTWFwIiwiZ2V0Iiwic2V0IiwiRGVEdXBlIiwiQmFyZU1peGluIiwicyIsIk1peGluIiwibWl4IiwiTWl4aW5CdWlsZGVyIiwibWl4aW5zIiwicmVkdWNlIiwiYyIsIm0iLCJfX3Byb3RvX18iLCJBcnJheSIsInNldFByb3RvT2YiLCJtaXhpblByb3BlcnRpZXMiLCJvYmoiLCJwcm9wIiwiRXZlbnRNaXhpbiIsImV2ZW50IiwiaGFuZGxlciIsImlzQXJyYXkiLCJmb3JFYWNoIiwiZSIsIm9uIiwiX2xpc3RlbmVycyIsInVuZGVmaW5lZCIsInB1c2giLCJvbmNlIiwiX29uY2UiLCJjYWxsYmFjayIsImxpc3RlbmVycyIsImZpbHRlciIsImxpc3RlbmVyIiwiYXJncyIsInRyaWdnZXIiLCJFcnJvciIsIkV2ZW50QnVzIiwiVW5pY29yblZhbGlkYXRpb24iLCJhcHAiLCJmb3JtVmFsaWRhdGlvbiIsInNlbGVjdG9yIiwic2VsZWN0T25lIiwiVW5pY29yblVJIiwiYWxpdmVIYW5kbGUiLCJ0aGVtZSIsIm1lc3NhZ2VzIiwiUHJvbWlzZSIsImFsbCIsImxvYWRBbHBpbmUiLCJ0aGVuIiwiZWxlbWVudCIsIkFscGluZSIsImluaXRpYWxpemVDb21wb25lbnQiLCJTcHJ1Y2UiLCJzdGFydCIsImxvYWRTcHJ1Y2UiLCJ3aW5kb3ciLCJkZWZlckxvYWRpbmdBbHBpbmUiLCJ1aSIsIiR1aSIsImFkZE1lc3NhZ2UiLCJyZW5kZXJNZXNzYWdlIiwiYmluZCIsImluaXRBbHBpbmUiLCJzdGFydEFscGluZSIsInN0YXJ0QWxwaW5lU3BydWNlIiwiaW5pdEFscGluZVNwcnVjZSIsIm1lc3NhZ2VTZWxlY3RvciIsImZyZWVHbG9iYWwiLCJnbG9iYWwiLCJmcmVlU2VsZiIsInNlbGYiLCJyb290IiwiRnVuY3Rpb24iLCJTeW1ib2wiLCJvYmplY3RQcm90byIsIm5hdGl2ZU9iamVjdFRvU3RyaW5nIiwidG9TdHJpbmciLCJzeW1Ub1N0cmluZ1RhZyIsInRvU3RyaW5nVGFnIiwiZ2V0UmF3VGFnIiwidmFsdWUiLCJpc093biIsImNhbGwiLCJ0YWciLCJ1bm1hc2tlZCIsInJlc3VsdCIsIm9iamVjdFRvU3RyaW5nIiwibnVsbFRhZyIsInVuZGVmaW5lZFRhZyIsImJhc2VHZXRUYWciLCJpc09iamVjdExpa2UiLCJpc09iamVjdCIsInR5cGUiLCJpZGVudGl0eSIsImFzeW5jVGFnIiwiZnVuY1RhZyIsImdlblRhZyIsInByb3h5VGFnIiwiaXNGdW5jdGlvbiIsImNvcmVKc0RhdGEiLCJtYXNrU3JjS2V5IiwidWlkIiwiZXhlYyIsImtleXMiLCJJRV9QUk9UTyIsImlzTWFza2VkIiwiZnVuYyIsImZ1bmNQcm90byIsImZ1bmNUb1N0cmluZyIsInRvU291cmNlIiwicmVSZWdFeHBDaGFyIiwicmVJc0hvc3RDdG9yIiwicmVJc05hdGl2ZSIsIlJlZ0V4cCIsInJlcGxhY2UiLCJiYXNlSXNOYXRpdmUiLCJwYXR0ZXJuIiwidGVzdCIsImdldFZhbHVlIiwib2JqZWN0Iiwia2V5IiwiZ2V0TmF0aXZlIiwib2JqZWN0Q3JlYXRlIiwiY3JlYXRlIiwiYmFzZUNyZWF0ZSIsInRoaXNBcmciLCJsZW5ndGgiLCJjb3B5QXJyYXkiLCJzb3VyY2UiLCJhcnJheSIsImluZGV4IiwiSE9UX0NPVU5UIiwiSE9UX1NQQU4iLCJuYXRpdmVOb3ciLCJEYXRlIiwibm93Iiwic2hvcnRPdXQiLCJjb3VudCIsImxhc3RDYWxsZWQiLCJzdGFtcCIsInJlbWFpbmluZyIsImFyZ3VtZW50cyIsImNvbnN0YW50IiwiZGVmaW5lUHJvcGVydHkiLCJiYXNlU2V0VG9TdHJpbmciLCJzdHJpbmciLCJzZXRUb1N0cmluZyIsImFycmF5RWFjaCIsIml0ZXJhdGVlIiwiTUFYX1NBRkVfSU5URUdFUiIsInJlSXNVaW50IiwiaXNJbmRleCIsImJhc2VBc3NpZ25WYWx1ZSIsImVxIiwib3RoZXIiLCJhc3NpZ25WYWx1ZSIsIm9ialZhbHVlIiwiY29weU9iamVjdCIsInByb3BzIiwiY3VzdG9taXplciIsImlzTmV3IiwibmV3VmFsdWUiLCJuYXRpdmVNYXgiLCJNYXRoIiwibWF4Iiwib3ZlclJlc3QiLCJ0cmFuc2Zvcm0iLCJvdGhlckFyZ3MiLCJiYXNlUmVzdCIsImlzTGVuZ3RoIiwiaXNBcnJheUxpa2UiLCJpc0l0ZXJhdGVlQ2FsbCIsImNyZWF0ZUFzc2lnbmVyIiwiYXNzaWduZXIiLCJzb3VyY2VzIiwiZ3VhcmQiLCJpc1Byb3RvdHlwZSIsIkN0b3IiLCJjb25zdHJ1Y3RvciIsImJhc2VUaW1lcyIsIm4iLCJhcmdzVGFnIiwiYmFzZUlzQXJndW1lbnRzIiwicHJvcGVydHlJc0VudW1lcmFibGUiLCJpc0FyZ3VtZW50cyIsInN0dWJGYWxzZSIsImZyZWVFeHBvcnRzIiwiZXhwb3J0cyIsIm5vZGVUeXBlIiwiZnJlZU1vZHVsZSIsIm1vZHVsZSIsIm1vZHVsZUV4cG9ydHMiLCJCdWZmZXIiLCJuYXRpdmVJc0J1ZmZlciIsImlzQnVmZmVyIiwiYXJyYXlUYWciLCJib29sVGFnIiwiZGF0ZVRhZyIsImVycm9yVGFnIiwibWFwVGFnIiwibnVtYmVyVGFnIiwib2JqZWN0VGFnIiwicmVnZXhwVGFnIiwic2V0VGFnIiwic3RyaW5nVGFnIiwid2Vha01hcFRhZyIsImFycmF5QnVmZmVyVGFnIiwiZGF0YVZpZXdUYWciLCJmbG9hdDMyVGFnIiwiZmxvYXQ2NFRhZyIsImludDhUYWciLCJpbnQxNlRhZyIsImludDMyVGFnIiwidWludDhUYWciLCJ1aW50OENsYW1wZWRUYWciLCJ1aW50MTZUYWciLCJ1aW50MzJUYWciLCJ0eXBlZEFycmF5VGFncyIsImJhc2VJc1R5cGVkQXJyYXkiLCJiYXNlVW5hcnkiLCJmcmVlUHJvY2VzcyIsInByb2Nlc3MiLCJub2RlVXRpbCIsInR5cGVzIiwicmVxdWlyZSIsImJpbmRpbmciLCJub2RlSXNUeXBlZEFycmF5IiwiaXNUeXBlZEFycmF5IiwiYXJyYXlMaWtlS2V5cyIsImluaGVyaXRlZCIsImlzQXJyIiwiaXNBcmciLCJpc0J1ZmYiLCJpc1R5cGUiLCJza2lwSW5kZXhlcyIsIlN0cmluZyIsIm92ZXJBcmciLCJhcmciLCJuYXRpdmVLZXlzIiwiYmFzZUtleXMiLCJuYXRpdmVLZXlzSW4iLCJiYXNlS2V5c0luIiwiaXNQcm90byIsImtleXNJbiIsIm5hdGl2ZUNyZWF0ZSIsImhhc2hDbGVhciIsIl9fZGF0YV9fIiwic2l6ZSIsImhhc2hEZWxldGUiLCJoYXMiLCJIQVNIX1VOREVGSU5FRCIsImhhc2hHZXQiLCJkYXRhIiwiaGFzaEhhcyIsImhhc2hTZXQiLCJIYXNoIiwiZW50cmllcyIsImNsZWFyIiwiZW50cnkiLCJsaXN0Q2FjaGVDbGVhciIsImFzc29jSW5kZXhPZiIsImFycmF5UHJvdG8iLCJzcGxpY2UiLCJsaXN0Q2FjaGVEZWxldGUiLCJsYXN0SW5kZXgiLCJwb3AiLCJsaXN0Q2FjaGVHZXQiLCJsaXN0Q2FjaGVIYXMiLCJsaXN0Q2FjaGVTZXQiLCJMaXN0Q2FjaGUiLCJtYXBDYWNoZUNsZWFyIiwiaXNLZXlhYmxlIiwiZ2V0TWFwRGF0YSIsIm1hcCIsIm1hcENhY2hlRGVsZXRlIiwibWFwQ2FjaGVHZXQiLCJtYXBDYWNoZUhhcyIsIm1hcENhY2hlU2V0IiwiTWFwQ2FjaGUiLCJnZXRQcm90b3R5cGUiLCJvYmplY3RDdG9yU3RyaW5nIiwiaXNQbGFpbk9iamVjdCIsInN0YWNrQ2xlYXIiLCJzdGFja0RlbGV0ZSIsInN0YWNrR2V0Iiwic3RhY2tIYXMiLCJMQVJHRV9BUlJBWV9TSVpFIiwic3RhY2tTZXQiLCJwYWlycyIsIlN0YWNrIiwiYWxsb2NVbnNhZmUiLCJjbG9uZUJ1ZmZlciIsImJ1ZmZlciIsImlzRGVlcCIsInNsaWNlIiwiY29weSIsIlVpbnQ4QXJyYXkiLCJjbG9uZUFycmF5QnVmZmVyIiwiYXJyYXlCdWZmZXIiLCJieXRlTGVuZ3RoIiwiY2xvbmVUeXBlZEFycmF5IiwidHlwZWRBcnJheSIsImJ5dGVPZmZzZXQiLCJpbml0Q2xvbmVPYmplY3QiLCJjcmVhdGVCYXNlRm9yIiwiZnJvbVJpZ2h0Iiwia2V5c0Z1bmMiLCJpdGVyYWJsZSIsImJhc2VGb3IiLCJiYXNlRm9yT3duIiwiY3JlYXRlQmFzZUVhY2giLCJlYWNoRnVuYyIsImNvbGxlY3Rpb24iLCJiYXNlRWFjaCIsImFzc2lnbk1lcmdlVmFsdWUiLCJpc0FycmF5TGlrZU9iamVjdCIsInNhZmVHZXQiLCJ0b1BsYWluT2JqZWN0IiwiYmFzZU1lcmdlRGVlcCIsInNyY0luZGV4IiwibWVyZ2VGdW5jIiwic3RhY2siLCJzcmNWYWx1ZSIsInN0YWNrZWQiLCJpc0NvbW1vbiIsImlzVHlwZWQiLCJiYXNlTWVyZ2UiLCJjdXN0b21EZWZhdWx0c01lcmdlIiwibWVyZ2VXaXRoIiwiZGVmYXVsdHNEZWVwIiwiY2FzdEZ1bmN0aW9uIiwibWVyZ2UiLCJkZWZEYXRhIiwibmFtZSIsImRlZkNhbGxiYWNrIiwicHJlcGFyZURhdGEiLCJfX3VuaWNvcm4iLCJVbmljb3JuR3JpZCIsImdyaWQiLCJlbGUiLCJvcHRpb25zIiwiVW5pY29ybkdyaWRFbGVtZW50IiwiYXNzaWduIiwiZGVmYXVsdE9wdGlvbnMiLCJmb3JtIiwicmVnaXN0ZXJFdmVudHMiLCJzdG9yZSIsImN1c3RvbSIsIm9yZGVyaW5nIiwiZGF0YXNldCIsInRvTG93ZXJDYXNlIiwiZW5kc1dpdGgiLCJ1c2VTdGF0ZSIsIiRldmVudCIsInByZXZlbnREZWZhdWx0IiwicHV0IiwicXVlcnlTZWxlY3RvckFsbCIsIiRlbCIsImRpciIsImdldERpcmVjdGlvbiIsImZpZWxkIiwiYXNjIiwiZGVzYyIsInNvcnRCeSIsIm9yZGVyaW5nSW5wdXQiLCJxdWVyeVNlbGVjdG9yIiwiaCIsImFwcGVuZENoaWxkIiwib3JkZXJpbmdFcXVhbHMiLCJhIiwiYiIsInRyaW0iLCJyb3ciLCJjaCIsImZpbmQiLCJjaGVja2VkIiwidXJsIiwicXVlcmllcyIsInRvZ2dsZUFsbCIsImNoZWNrUm93IiwiY29yZSIsInBhdGNoIiwidGFzayIsInVwZGF0ZVJvdyIsInBvc3QiLCJtZXNzYWdlIiwiX18iLCJjb25maXJtIiwiaXNDb25maXJtIiwibXNnIiwiZGVsZXRlTGlzdCIsInNlbGVjdEFsbCIsImlucHV0IiwiZ2V0Q2hlY2tlZCIsIlVuaWNvcm4iLCJUcmFuc2xhdG9yIiwidHJhbnNsYXRlIiwiY291bnRDaGVja2VkIiwiYWxlcnQiLCJzdG9wUHJvcGFnYXRpb24iLCJvcmlnaW4iLCJvcmlnaW5PcmRlcmluZyIsInZhbCIsInNwbGl0IiwiaW5wdXRzIiwiZWFjaCIsImkiLCIkdGhpcyIsIiQiLCJhdHRyIiwidHIiLCJwYXJlbnRzIiwiZ3JvdXAiLCJzaWJsaW5ncyIsImJhdGNoIiwiZGVsdGEiLCJkb1Rhc2siLCJVbmljb3JuRm9ybSIsIlVuaWNvcm5Gb3JtRWxlbWVudCIsIiRmb3JtIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaW5kZXhPZiIsInNldEF0dHJpYnV0ZSIsInN1YnN0ciIsImNzcmYiLCJib2R5IiwiYmluZEV2ZW50cyIsIm1ldGhvZCIsImN1c3RvbU1ldGhvZCIsIm1ldGhvZElucHV0IiwiZmxhdHRlZCIsImZsYXR0ZW5PYmplY3QiLCJmaWVsZE5hbWUiLCJidWlsZEZpZWxkTmFtZSIsInN1Ym1pdEJ1dHRvbiIsInN1Ym1pdCIsInN0eWxlIiwiZGlzcGxheSIsImNsaWNrIiwib2IiLCJ0b1JldHVybiIsImZsYXRPYmplY3QiLCJ4IiwibmFtZXMiLCJmaXJzdCIsInNoaWZ0Iiwiam9pbiIsIlVuaWNvcm5UaW55bWNlIiwibG9hZFRpbnltY2UiLCJpbnN0YW5jZXMiLCJUaW55bWNlRWRpdG9yIiwidGlueW1jZSIsImVkaXRvciIsImluaXQiLCJ0ZXh0IiwiaW5zZXJ0Q29udGVudCIsInNldENvbnRlbnQiLCJVbmljb3JuTG9hZGVyIiwic3JjIiwiU3lzdGVtIiwicmUiLCJub3Rfc3RyaW5nIiwibm90X2Jvb2wiLCJub3RfdHlwZSIsIm5vdF9wcmltaXRpdmUiLCJudW1iZXIiLCJudW1lcmljX2FyZyIsImpzb24iLCJub3RfanNvbiIsIm1vZHVsbyIsInBsYWNlaG9sZGVyIiwia2V5X2FjY2VzcyIsImluZGV4X2FjY2VzcyIsInNpZ24iLCJzcHJpbnRmIiwic3ByaW50Zl9mb3JtYXQiLCJzcHJpbnRmX3BhcnNlIiwidnNwcmludGYiLCJmbXQiLCJhcmd2IiwiY29uY2F0IiwicGFyc2VfdHJlZSIsImN1cnNvciIsInRyZWVfbGVuZ3RoIiwib3V0cHV0IiwiayIsInBoIiwicGFkIiwicGFkX2NoYXJhY3RlciIsInBhZF9sZW5ndGgiLCJpc19wb3NpdGl2ZSIsInBhcmFtX25vIiwiaXNOYU4iLCJUeXBlRXJyb3IiLCJwYXJzZUludCIsImZyb21DaGFyQ29kZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJ3aWR0aCIsInByZWNpc2lvbiIsInBhcnNlRmxvYXQiLCJ0b0V4cG9uZW50aWFsIiwidG9GaXhlZCIsIk51bWJlciIsInRvUHJlY2lzaW9uIiwic3Vic3RyaW5nIiwidmFsdWVPZiIsInRvVXBwZXJDYXNlIiwicGFkX2NoYXIiLCJjaGFyQXQiLCJyZXBlYXQiLCJhbGlnbiIsInNwcmludGZfY2FjaGUiLCJfZm10IiwibWF0Y2giLCJhcmdfbmFtZXMiLCJmaWVsZF9saXN0IiwicmVwbGFjZW1lbnRfZmllbGQiLCJmaWVsZF9tYXRjaCIsIlN5bnRheEVycm9yIiwiZGVmaW5lIiwiVW5pY29ybkhlbHBlciIsInJlc3VsdFNldCIsImF0dHJzIiwiY29udGVudCIsInYiLCJpbm5lckhUTUwiLCJwYXRoIiwiQm9vbGVhbiIsInJlc29sdmUiLCJ1cmkiLCJhc3NldCIsInRpbWUiLCJzZXRJbnRlcnZhbCIsImZldGNoIiwiY2xlYXJJbnRlcnZhbCIsImRhdGUiLCJnZXROdWxsRGF0ZSIsImRlY2ltYWxzIiwiZGVjUG9pbnQiLCJ0aG91c2FuZHNTZXAiLCJyb3VuZGVkTnVtYmVyIiwicm91bmQiLCJhYnMiLCJudW1iZXJzU3RyaW5nIiwiZGVjaW1hbHNTdHJpbmciLCJmb3JtYXR0ZWROdW1iZXIiLCJoZWxwZXIiLCIkaGVscGVyIiwiJGdldCIsIiRzZXQiLCJpc0RlYnVnIiwia2VlcEFsaXZlIiwic3RvcEtlZXBBbGl2ZSIsImlzTnVsbERhdGUiLCJudW1iZXJGb3JtYXQiLCJVbmljb3JuSHR0cCIsImNvbmZpZyIsImdsb2JhbEF4aW9zIiwiYXhpb3MiLCJjcmVhdGVIdHRwIiwiaW50ZXJjZXB0b3JzIiwicmVxdWVzdCIsInVzZSIsImhlYWRlcnMiLCJnZXRIdHRwIiwicmVzcG9uc2UiLCJ1c2VIZWFkZXIiLCJjbG9uZSIsInJlcXVlc3RNaWRkbGV3YXJlIiwiaW5jbHVkZXMiLCIkaHR0cCIsIlVuaWNvcm5BcHAiLCJ3YWl0IiwiYWRkRXZlbnRMaXN0ZW5lciIsImNvbXBsZXRlZCIsInBsdWdpbiIsInAiLCJpbnN0YWxsIiwidW5pbnN0YWxsIiwicmVzIiwicmVtb3ZlRGF0YSIsInJlamVjdCIsInByb21pc2UiLCJ3YWl0cyIsImNyZWF0ZUFwcCIsIm5vQ29uZmxpY3QiLCJ1bmkiLCJ1Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBRUE7RUFDQSxJQUFNQSxhQUFhLEdBQUcsd0JBQXRCO0VBRUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7RUFFQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0VBQ0EsSUFBTUMsT0FBSyxHQUFHLFNBQVJBLEtBQVEsQ0FBQ0MsVUFBRCxFQUFhQyxLQUFiLEVBQXVCO0VBQ25DLE1BQUlDLFdBQVcsR0FBR0QsS0FBSyxDQUFDRCxVQUFELENBQXZCO0VBQ0FFLEVBQUFBLFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkwsYUFBdEIsSUFBdUNNLE1BQU0sQ0FBQ0gsS0FBRCxDQUE3QztFQUNBLFNBQU9DLFdBQVA7RUFDRCxDQUpEO0VBTUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7OztFQUNBLElBQU1HLGVBQWUsR0FBRyxTQUFsQkEsZUFBa0IsQ0FBQ0MsS0FBRCxFQUFRTCxLQUFSO0VBQUEsU0FDdEJLLEtBQUssQ0FBQ0MsY0FBTixD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