(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ListDependent = factory());
}(this, (function () { 'use strict';

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

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = (typeof global === "undefined" ? "undefined" : _typeof(global)) == 'object' && global && global.Object === Object && global;

  /** Detect free variable `self`. */

  var freeSelf = (typeof self === "undefined" ? "undefined" : _typeof(self)) == 'object' && self && self.Object === Object && self;
  /** Used as a reference to the global object. */

  var root = freeGlobal || freeSelf || Function('return this')();

  /** Built-in value references. */

  var _Symbol = root.Symbol;

  /** Used for built-in method references. */

  var objectProto$a = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty$8 = objectProto$a.hasOwnProperty;
  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */

  var nativeObjectToString$1 = objectProto$a.toString;
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
    var isOwn = hasOwnProperty$8.call(value, symToStringTag$1),
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
  var objectProto$9 = Object.prototype;
  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */

  var nativeObjectToString = objectProto$9.toString;
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
      objectProto$8 = Object.prototype;
  /** Used to resolve the decompiled source of functions. */

  var funcToString$1 = funcProto$1.toString;
  /** Used to check objects for own properties. */

  var hasOwnProperty$7 = objectProto$8.hasOwnProperty;
  /** Used to detect if a method is native. */

  var reIsNative = RegExp('^' + funcToString$1.call(hasOwnProperty$7).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
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

  var objectProto$7 = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty$6 = objectProto$7.hasOwnProperty;
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

    if (!(hasOwnProperty$6.call(object, key) && eq(objValue, value)) || value === undefined && !(key in object)) {
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
  var objectProto$6 = Object.prototype;
  /**
   * Checks if `value` is likely a prototype object.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
   */

  function isPrototype(value) {
    var Ctor = value && value.constructor,
        proto = typeof Ctor == 'function' && Ctor.prototype || objectProto$6;
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

  var objectProto$5 = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty$5 = objectProto$5.hasOwnProperty;
  /** Built-in value references. */

  var propertyIsEnumerable = objectProto$5.propertyIsEnumerable;
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
    return isObjectLike(value) && hasOwnProperty$5.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
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

  var objectProto$4 = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty$4 = objectProto$4.hasOwnProperty;
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
      if ((inherited || hasOwnProperty$4.call(value, key)) && !(skipIndexes && ( // Safari 9 has enumerable `arguments.length` in strict mode.
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

  var Map = getNative(root, 'Map');

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
      'map': new (Map || ListCache)(),
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

      if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
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

  var nope = function nope(value, ele, dep) {};
  /**
   * Class init.
   * @param {jQuery}        $element
   * @param {jQuery|string} dependent
   * @param {Object}        options
   * @constructor
   */


  var ListDependent = /*#__PURE__*/function () {
    function ListDependent(element, dependent, options) {
      _classCallCheck(this, ListDependent);

      _defineProperty(this, "$xhr", null);

      this.element = element;
      this.options = defaultsDeep({}, options, this.constructor.defaultOptions);
      this.dependent = this.constructor.select(dependent);
      this.bindEvents();

      if (this.options.initial_load) {
        this.changeList(this.dependent.val(), true);
      }
    }
    /**
     * Bind events.
     */


    _createClass(ListDependent, [{
      key: "bindEvents",
      value: function bindEvents() {
        var _this = this;

        this.dependent.addEventListener('change', function (event) {
          var _this$constructor$sel;

          _this.changeList((_this$constructor$sel = _this.constructor.select(event.currentTarget)) === null || _this$constructor$sel === void 0 ? void 0 : _this$constructor$sel.value);
        });
      }
      /**
       * Update the list elements.
       *
       * @param {*}    value
       * @param {bool} initial
       */

    }, {
      key: "changeList",
      value: function changeList(value) {
        var initial = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        value = value || this.dependent.val(); // Empty mark

        if (value === '') {
          value = this.options.empty_mark;
        }

        if (this.options.ajax.url) {
          this.ajaxUpdate(value);
        } else if (this.options.source) {
          this.sourceUpdate(value, initial);
        }
      }
      /**
       * Update list by source.
       *
       * @param {string} value
       * @param {bool}   initial
       */

    }, {
      key: "sourceUpdate",
      value: function sourceUpdate(value) {
        var initial = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var source = this.options.source;
        this.beforeHook(value, this.element, this.dependent);

        if (source[value]) {
          this.updateListElements(source[value]);
        } else {
          this.updateListElements([]);

          if (!initial && value !== '' && parseInt(value) !== 0) {
            console.log('List for value: ' + value + ' not found.');
          }
        }

        this.afterHook(value, this.element, this.dependent);
      }
      /**
       * Do ajax.
       *
       * @param {string} value
       */

    }, {
      key: "ajaxUpdate",
      value: function ajaxUpdate(value) {
        var _this2 = this;

        var data = {};
        data[this.options.ajax.value_field] = value;
        this.beforeHook(value, this.element, this.dependent);

        if (this.$xhr) {
          this.$xhr.abort();
          this.$xhr = null;
        }

        this.$xhr = u.$http.get(this.options.ajax.url, data).then(function (response) {
          if (response.success) {
            _this2.updateListElements(response.data);
          } else {
            console.error(response.message);
          }
        }).fail(function (err) {
          console.error(err);
        }).always(function () {
          _this2.afterHook(value, _this2.element, _this2.dependent);

          _this2.$xhr = null;
        });
      }
      /**
       * Update list elements.
       *
       * @param {Array} items
       */

    }, {
      key: "updateListElements",
      value: function updateListElements(items) {
        var _this3 = this;

        var self = this;
        var textField = this.options.text_field;
        var valueField = this.options.value_field;
        self.element.empty();

        if (this.options.first_option) {
          items.unshift({});
          items[0][textField] = this.options.first_option[textField];
          items[0][valueField] = this.options.first_option[valueField];
        }

        $.each(items, function (i, item) {
          if (Array.isArray(item)) {
            var group = $("<optgroup label=\"".concat(i, "\"></optgroup>"));
            $.each(item, function (k, child) {
              _this3.appendOptionTo({
                value: child[valueField],
                text: child[textField],
                attributes: child.attributes
              }, group);
            });

            _this3.element.append(group);

            return;
          }

          _this3.appendOptionTo({
            value: item[valueField],
            text: item[textField],
            attributes: item.attributes
          }, _this3.element);
        });
        this.element.trigger('chosen:updated');
        this.element.trigger('change');
      }
    }, {
      key: "appendOptionTo",
      value: function appendOptionTo(item, parent) {
        var value = item.value;
        var option = $('<option>' + item.text + '</option>');
        option.attr('value', value);

        if (item.attributes) {
          $.each(item.attributes, function (index, val) {
            option.attr(index, val);
          });
        }

        if (this.isSelected(value)) {
          option.attr('selected', 'selected');
        }

        parent.append(option);
      }
    }, {
      key: "isSelected",
      value: function isSelected(value) {
        var defaultValues = ''; // Convert all types to array

        if (Array.isArray(this.options.default_value)) {
          defaultValues = this.options.default_value;
        } else if (this.options.default_value && _typeof(this.options.default_value) === 'object') {
          defaultValues = Object.keys(this.options.default_value);
        } else {
          defaultValues = [this.options.default_value];
        }

        return defaultValues.indexOf(value) !== -1;
      }
      /**
       * Before hook.
       *
       * @param {string} value
       * @param {jQuery} element
       * @param {jQuery} dependent
       * @returns {*}
       */

    }, {
      key: "beforeHook",
      value: function beforeHook(value, element, dependent) {
        var before = this.options.hooks.before_request;
        return before.call(this, value, element, dependent);
      }
      /**
       * After hook.
       *
       * @param {string} value
       * @param {jQuery} element
       * @param {jQuery} dependent
       * @returns {*}
       */

    }, {
      key: "afterHook",
      value: function afterHook(value, element, dependent) {
        var after = this.options.hooks.after_request;
        return after.call(this, value, element, dependent);
      }
    }], [{
      key: "defaultOptions",
      get: function get() {
        return {
          ajax: {
            url: null,
            value_field: 'value'
          },
          source: null,
          text_field: 'title',
          value_field: 'id',
          first_option: null,
          default_value: null,
          initial_load: true,
          empty_mark: '__EMPTY__',
          hooks: {
            before_request: nope,
            after_request: nope
          }
        };
      }
    }, {
      key: "select",
      value: function select(element) {
        return typeof element === 'string' ? document.querySelector(element) : element;
      }
    }]);

    return ListDependent;
  }();

  return ListDependent;

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFyZ2V0LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19mcmVlR2xvYmFsLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fcm9vdC5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX1N5bWJvbC5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2dldFJhd1RhZy5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX29iamVjdFRvU3RyaW5nLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYmFzZUdldFRhZy5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvaXNPYmplY3RMaWtlLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9pc0FycmF5LmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9pc09iamVjdC5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvaWRlbnRpdHkuanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL2lzRnVuY3Rpb24uanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19jb3JlSnNEYXRhLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9faXNNYXNrZWQuanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL190b1NvdXJjZS5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Jhc2VJc05hdGl2ZS5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2dldFZhbHVlLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fZ2V0TmF0aXZlLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYmFzZUNyZWF0ZS5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2FwcGx5LmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fY29weUFycmF5LmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fc2hvcnRPdXQuanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL2NvbnN0YW50LmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fZGVmaW5lUHJvcGVydHkuanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19iYXNlU2V0VG9TdHJpbmcuanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19zZXRUb1N0cmluZy5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2lzSW5kZXguanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19iYXNlQXNzaWduVmFsdWUuanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL2VxLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYXNzaWduVmFsdWUuanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19jb3B5T2JqZWN0LmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fb3ZlclJlc3QuanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19iYXNlUmVzdC5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvaXNMZW5ndGguanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL2lzQXJyYXlMaWtlLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9faXNJdGVyYXRlZUNhbGwuanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19jcmVhdGVBc3NpZ25lci5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2lzUHJvdG90eXBlLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYmFzZVRpbWVzLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYmFzZUlzQXJndW1lbnRzLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9pc0FyZ3VtZW50cy5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvc3R1YkZhbHNlLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9pc0J1ZmZlci5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Jhc2VJc1R5cGVkQXJyYXkuanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19iYXNlVW5hcnkuanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19ub2RlVXRpbC5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvaXNUeXBlZEFycmF5LmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYXJyYXlMaWtlS2V5cy5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX292ZXJBcmcuanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19uYXRpdmVLZXlzSW4uanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19iYXNlS2V5c0luLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9rZXlzSW4uanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19uYXRpdmVDcmVhdGUuanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19oYXNoQ2xlYXIuanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19oYXNoRGVsZXRlLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9faGFzaEdldC5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2hhc2hIYXMuanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19oYXNoU2V0LmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fSGFzaC5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2xpc3RDYWNoZUNsZWFyLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYXNzb2NJbmRleE9mLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fbGlzdENhY2hlRGVsZXRlLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fbGlzdENhY2hlR2V0LmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fbGlzdENhY2hlSGFzLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fbGlzdENhY2hlU2V0LmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fTGlzdENhY2hlLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fTWFwLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fbWFwQ2FjaGVDbGVhci5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2lzS2V5YWJsZS5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2dldE1hcERhdGEuanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19tYXBDYWNoZURlbGV0ZS5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX21hcENhY2hlR2V0LmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fbWFwQ2FjaGVIYXMuanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19tYXBDYWNoZVNldC5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX01hcENhY2hlLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fZ2V0UHJvdG90eXBlLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9pc1BsYWluT2JqZWN0LmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fc3RhY2tDbGVhci5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX3N0YWNrRGVsZXRlLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fc3RhY2tHZXQuanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19zdGFja0hhcy5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX3N0YWNrU2V0LmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fU3RhY2suanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19jbG9uZUJ1ZmZlci5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX1VpbnQ4QXJyYXkuanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19jbG9uZUFycmF5QnVmZmVyLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fY2xvbmVUeXBlZEFycmF5LmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9faW5pdENsb25lT2JqZWN0LmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fY3JlYXRlQmFzZUZvci5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Jhc2VGb3IuanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19hc3NpZ25NZXJnZVZhbHVlLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9pc0FycmF5TGlrZU9iamVjdC5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX3NhZmVHZXQuanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL3RvUGxhaW5PYmplY3QuanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19iYXNlTWVyZ2VEZWVwLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fYmFzZU1lcmdlLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fY3VzdG9tRGVmYXVsdHNNZXJnZS5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvbWVyZ2VXaXRoLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9kZWZhdWx0c0RlZXAuanMiLCIuLi8uLi9zcmMvdW5pY29ybi91aS9saXN0LWRlcGVuZGVudC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCAmJiBnbG9iYWwuT2JqZWN0ID09PSBPYmplY3QgJiYgZ2xvYmFsO1xuXG5leHBvcnQgZGVmYXVsdCBmcmVlR2xvYmFsO1xuIiwiaW1wb3J0IGZyZWVHbG9iYWwgZnJvbSAnLi9fZnJlZUdsb2JhbC5qcyc7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG52YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcblxuLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG52YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxuZXhwb3J0IGRlZmF1bHQgcm9vdDtcbiIsImltcG9ydCByb290IGZyb20gJy4vX3Jvb3QuanMnO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBTeW1ib2wgPSByb290LlN5bWJvbDtcblxuZXhwb3J0IGRlZmF1bHQgU3ltYm9sO1xuIiwiaW1wb3J0IFN5bWJvbCBmcm9tICcuL19TeW1ib2wuanMnO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3ltVG9TdHJpbmdUYWcgPSBTeW1ib2wgPyBTeW1ib2wudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlR2V0VGFnYCB3aGljaCBpZ25vcmVzIGBTeW1ib2wudG9TdHJpbmdUYWdgIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSByYXcgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gZ2V0UmF3VGFnKHZhbHVlKSB7XG4gIHZhciBpc093biA9IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIHN5bVRvU3RyaW5nVGFnKSxcbiAgICAgIHRhZyA9IHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcblxuICB0cnkge1xuICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHVuZGVmaW5lZDtcbiAgICB2YXIgdW5tYXNrZWQgPSB0cnVlO1xuICB9IGNhdGNoIChlKSB7fVxuXG4gIHZhciByZXN1bHQgPSBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgaWYgKHVubWFza2VkKSB7XG4gICAgaWYgKGlzT3duKSB7XG4gICAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB0YWc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldFJhd1RhZztcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBuYXRpdmVPYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcgdXNpbmcgYE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgY29udmVydGVkIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBvYmplY3RUb1N0cmluZztcbiIsImltcG9ydCBTeW1ib2wgZnJvbSAnLi9fU3ltYm9sLmpzJztcbmltcG9ydCBnZXRSYXdUYWcgZnJvbSAnLi9fZ2V0UmF3VGFnLmpzJztcbmltcG9ydCBvYmplY3RUb1N0cmluZyBmcm9tICcuL19vYmplY3RUb1N0cmluZy5qcyc7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBudWxsVGFnID0gJ1tvYmplY3QgTnVsbF0nLFxuICAgIHVuZGVmaW5lZFRhZyA9ICdbb2JqZWN0IFVuZGVmaW5lZF0nO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1Ub1N0cmluZ1RhZyA9IFN5bWJvbCA/IFN5bWJvbC50b1N0cmluZ1RhZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0VGFnYCB3aXRob3V0IGZhbGxiYWNrcyBmb3IgYnVnZ3kgZW52aXJvbm1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGJhc2VHZXRUYWcodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZFRhZyA6IG51bGxUYWc7XG4gIH1cbiAgcmV0dXJuIChzeW1Ub1N0cmluZ1RhZyAmJiBzeW1Ub1N0cmluZ1RhZyBpbiBPYmplY3QodmFsdWUpKVxuICAgID8gZ2V0UmF3VGFnKHZhbHVlKVxuICAgIDogb2JqZWN0VG9TdHJpbmcodmFsdWUpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBiYXNlR2V0VGFnO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzT2JqZWN0TGlrZTtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhbiBgQXJyYXlgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXkoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXkoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheSgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xuXG5leHBvcnQgZGVmYXVsdCBpc0FycmF5O1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGVcbiAqIFtsYW5ndWFnZSB0eXBlXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtZWNtYXNjcmlwdC1sYW5ndWFnZS10eXBlcylcbiAqIG9mIGBPYmplY3RgLiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzT2JqZWN0O1xuIiwiLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIHRoZSBmaXJzdCBhcmd1bWVudCBpdCByZWNlaXZlcy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHBhcmFtIHsqfSB2YWx1ZSBBbnkgdmFsdWUuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyBgdmFsdWVgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IDEgfTtcbiAqXG4gKiBjb25zb2xlLmxvZyhfLmlkZW50aXR5KG9iamVjdCkgPT09IG9iamVjdCk7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGlkZW50aXR5KHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaWRlbnRpdHk7XG4iLCJpbXBvcnQgYmFzZUdldFRhZyBmcm9tICcuL19iYXNlR2V0VGFnLmpzJztcbmltcG9ydCBpc09iamVjdCBmcm9tICcuL2lzT2JqZWN0LmpzJztcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFzeW5jVGFnID0gJ1tvYmplY3QgQXN5bmNGdW5jdGlvbl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIGdlblRhZyA9ICdbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXScsXG4gICAgcHJveHlUYWcgPSAnW29iamVjdCBQcm94eV0nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgRnVuY3Rpb25gIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGZ1bmN0aW9uLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNGdW5jdGlvbihfKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oL2FiYy8pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyBUaGUgdXNlIG9mIGBPYmplY3QjdG9TdHJpbmdgIGF2b2lkcyBpc3N1ZXMgd2l0aCB0aGUgYHR5cGVvZmAgb3BlcmF0b3JcbiAgLy8gaW4gU2FmYXJpIDkgd2hpY2ggcmV0dXJucyAnb2JqZWN0JyBmb3IgdHlwZWQgYXJyYXlzIGFuZCBvdGhlciBjb25zdHJ1Y3RvcnMuXG4gIHZhciB0YWcgPSBiYXNlR2V0VGFnKHZhbHVlKTtcbiAgcmV0dXJuIHRhZyA9PSBmdW5jVGFnIHx8IHRhZyA9PSBnZW5UYWcgfHwgdGFnID09IGFzeW5jVGFnIHx8IHRhZyA9PSBwcm94eVRhZztcbn1cblxuZXhwb3J0IGRlZmF1bHQgaXNGdW5jdGlvbjtcbiIsImltcG9ydCByb290IGZyb20gJy4vX3Jvb3QuanMnO1xuXG4vKiogVXNlZCB0byBkZXRlY3Qgb3ZlcnJlYWNoaW5nIGNvcmUtanMgc2hpbXMuICovXG52YXIgY29yZUpzRGF0YSA9IHJvb3RbJ19fY29yZS1qc19zaGFyZWRfXyddO1xuXG5leHBvcnQgZGVmYXVsdCBjb3JlSnNEYXRhO1xuIiwiaW1wb3J0IGNvcmVKc0RhdGEgZnJvbSAnLi9fY29yZUpzRGF0YS5qcyc7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBtZXRob2RzIG1hc3F1ZXJhZGluZyBhcyBuYXRpdmUuICovXG52YXIgbWFza1NyY0tleSA9IChmdW5jdGlvbigpIHtcbiAgdmFyIHVpZCA9IC9bXi5dKyQvLmV4ZWMoY29yZUpzRGF0YSAmJiBjb3JlSnNEYXRhLmtleXMgJiYgY29yZUpzRGF0YS5rZXlzLklFX1BST1RPIHx8ICcnKTtcbiAgcmV0dXJuIHVpZCA/ICgnU3ltYm9sKHNyYylfMS4nICsgdWlkKSA6ICcnO1xufSgpKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYGZ1bmNgIGhhcyBpdHMgc291cmNlIG1hc2tlZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYGZ1bmNgIGlzIG1hc2tlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc01hc2tlZChmdW5jKSB7XG4gIHJldHVybiAhIW1hc2tTcmNLZXkgJiYgKG1hc2tTcmNLZXkgaW4gZnVuYyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzTWFza2VkO1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGZ1bmNQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZ1bmNUb1N0cmluZyA9IGZ1bmNQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgZnVuY2AgdG8gaXRzIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc291cmNlIGNvZGUuXG4gKi9cbmZ1bmN0aW9uIHRvU291cmNlKGZ1bmMpIHtcbiAgaWYgKGZ1bmMgIT0gbnVsbCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gZnVuY1RvU3RyaW5nLmNhbGwoZnVuYyk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIChmdW5jICsgJycpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuXG5leHBvcnQgZGVmYXVsdCB0b1NvdXJjZTtcbiIsImltcG9ydCBpc0Z1bmN0aW9uIGZyb20gJy4vaXNGdW5jdGlvbi5qcyc7XG5pbXBvcnQgaXNNYXNrZWQgZnJvbSAnLi9faXNNYXNrZWQuanMnO1xuaW1wb3J0IGlzT2JqZWN0IGZyb20gJy4vaXNPYmplY3QuanMnO1xuaW1wb3J0IHRvU291cmNlIGZyb20gJy4vX3RvU291cmNlLmpzJztcblxuLyoqXG4gKiBVc2VkIHRvIG1hdGNoIGBSZWdFeHBgXG4gKiBbc3ludGF4IGNoYXJhY3RlcnNdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXBhdHRlcm5zKS5cbiAqL1xudmFyIHJlUmVnRXhwQ2hhciA9IC9bXFxcXF4kLiorPygpW1xcXXt9fF0vZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGhvc3QgY29uc3RydWN0b3JzIChTYWZhcmkpLiAqL1xudmFyIHJlSXNIb3N0Q3RvciA9IC9eXFxbb2JqZWN0IC4rP0NvbnN0cnVjdG9yXFxdJC87XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBmdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGUsXG4gICAgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byByZXNvbHZlIHRoZSBkZWNvbXBpbGVkIHNvdXJjZSBvZiBmdW5jdGlvbnMuICovXG52YXIgZnVuY1RvU3RyaW5nID0gZnVuY1Byb3RvLnRvU3RyaW5nO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaWYgYSBtZXRob2QgaXMgbmF0aXZlLiAqL1xudmFyIHJlSXNOYXRpdmUgPSBSZWdFeHAoJ14nICtcbiAgZnVuY1RvU3RyaW5nLmNhbGwoaGFzT3duUHJvcGVydHkpLnJlcGxhY2UocmVSZWdFeHBDaGFyLCAnXFxcXCQmJylcbiAgLnJlcGxhY2UoL2hhc093blByb3BlcnR5fChmdW5jdGlvbikuKj8oPz1cXFxcXFwoKXwgZm9yIC4rPyg/PVxcXFxcXF0pL2csICckMS4qPycpICsgJyQnXG4pO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzTmF0aXZlYCB3aXRob3V0IGJhZCBzaGltIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIG5hdGl2ZSBmdW5jdGlvbixcbiAqICBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc05hdGl2ZSh2YWx1ZSkge1xuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSB8fCBpc01hc2tlZCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHBhdHRlcm4gPSBpc0Z1bmN0aW9uKHZhbHVlKSA/IHJlSXNOYXRpdmUgOiByZUlzSG9zdEN0b3I7XG4gIHJldHVybiBwYXR0ZXJuLnRlc3QodG9Tb3VyY2UodmFsdWUpKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYmFzZUlzTmF0aXZlO1xuIiwiLyoqXG4gKiBHZXRzIHRoZSB2YWx1ZSBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBwcm9wZXJ0eSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gZ2V0VmFsdWUob2JqZWN0LCBrZXkpIHtcbiAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldFZhbHVlO1xuIiwiaW1wb3J0IGJhc2VJc05hdGl2ZSBmcm9tICcuL19iYXNlSXNOYXRpdmUuanMnO1xuaW1wb3J0IGdldFZhbHVlIGZyb20gJy4vX2dldFZhbHVlLmpzJztcblxuLyoqXG4gKiBHZXRzIHRoZSBuYXRpdmUgZnVuY3Rpb24gYXQgYGtleWAgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgbWV0aG9kIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBmdW5jdGlvbiBpZiBpdCdzIG5hdGl2ZSwgZWxzZSBgdW5kZWZpbmVkYC5cbiAqL1xuZnVuY3Rpb24gZ2V0TmF0aXZlKG9iamVjdCwga2V5KSB7XG4gIHZhciB2YWx1ZSA9IGdldFZhbHVlKG9iamVjdCwga2V5KTtcbiAgcmV0dXJuIGJhc2VJc05hdGl2ZSh2YWx1ZSkgPyB2YWx1ZSA6IHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0TmF0aXZlO1xuIiwiaW1wb3J0IGlzT2JqZWN0IGZyb20gJy4vaXNPYmplY3QuanMnO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RDcmVhdGUgPSBPYmplY3QuY3JlYXRlO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmNyZWF0ZWAgd2l0aG91dCBzdXBwb3J0IGZvciBhc3NpZ25pbmdcbiAqIHByb3BlcnRpZXMgdG8gdGhlIGNyZWF0ZWQgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gcHJvdG8gVGhlIG9iamVjdCB0byBpbmhlcml0IGZyb20uXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBuZXcgb2JqZWN0LlxuICovXG52YXIgYmFzZUNyZWF0ZSA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gb2JqZWN0KCkge31cbiAgcmV0dXJuIGZ1bmN0aW9uKHByb3RvKSB7XG4gICAgaWYgKCFpc09iamVjdChwcm90bykpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gICAgaWYgKG9iamVjdENyZWF0ZSkge1xuICAgICAgcmV0dXJuIG9iamVjdENyZWF0ZShwcm90byk7XG4gICAgfVxuICAgIG9iamVjdC5wcm90b3R5cGUgPSBwcm90bztcbiAgICB2YXIgcmVzdWx0ID0gbmV3IG9iamVjdDtcbiAgICBvYmplY3QucHJvdG90eXBlID0gdW5kZWZpbmVkO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59KCkpO1xuXG5leHBvcnQgZGVmYXVsdCBiYXNlQ3JlYXRlO1xuIiwiLyoqXG4gKiBBIGZhc3RlciBhbHRlcm5hdGl2ZSB0byBgRnVuY3Rpb24jYXBwbHlgLCB0aGlzIGZ1bmN0aW9uIGludm9rZXMgYGZ1bmNgXG4gKiB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBvZiBgdGhpc0FyZ2AgYW5kIHRoZSBhcmd1bWVudHMgb2YgYGFyZ3NgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBpbnZva2UuXG4gKiBAcGFyYW0geyp9IHRoaXNBcmcgVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBmdW5jYC5cbiAqIEBwYXJhbSB7QXJyYXl9IGFyZ3MgVGhlIGFyZ3VtZW50cyB0byBpbnZva2UgYGZ1bmNgIHdpdGguXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcmVzdWx0IG9mIGBmdW5jYC5cbiAqL1xuZnVuY3Rpb24gYXBwbHkoZnVuYywgdGhpc0FyZywgYXJncykge1xuICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgY2FzZSAwOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcpO1xuICAgIGNhc2UgMTogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhcmdzWzBdKTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pO1xuICB9XG4gIHJldHVybiBmdW5jLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBhcHBseTtcbiIsIi8qKlxuICogQ29waWVzIHRoZSB2YWx1ZXMgb2YgYHNvdXJjZWAgdG8gYGFycmF5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gc291cmNlIFRoZSBhcnJheSB0byBjb3B5IHZhbHVlcyBmcm9tLlxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5PVtdXSBUaGUgYXJyYXkgdG8gY29weSB2YWx1ZXMgdG8uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gY29weUFycmF5KHNvdXJjZSwgYXJyYXkpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBzb3VyY2UubGVuZ3RoO1xuXG4gIGFycmF5IHx8IChhcnJheSA9IEFycmF5KGxlbmd0aCkpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGFycmF5W2luZGV4XSA9IHNvdXJjZVtpbmRleF07XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjb3B5QXJyYXk7XG4iLCIvKiogVXNlZCB0byBkZXRlY3QgaG90IGZ1bmN0aW9ucyBieSBudW1iZXIgb2YgY2FsbHMgd2l0aGluIGEgc3BhbiBvZiBtaWxsaXNlY29uZHMuICovXG52YXIgSE9UX0NPVU5UID0gODAwLFxuICAgIEhPVF9TUEFOID0gMTY7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVOb3cgPSBEYXRlLm5vdztcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCdsbCBzaG9ydCBvdXQgYW5kIGludm9rZSBgaWRlbnRpdHlgIGluc3RlYWRcbiAqIG9mIGBmdW5jYCB3aGVuIGl0J3MgY2FsbGVkIGBIT1RfQ09VTlRgIG9yIG1vcmUgdGltZXMgaW4gYEhPVF9TUEFOYFxuICogbWlsbGlzZWNvbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byByZXN0cmljdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHNob3J0YWJsZSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gc2hvcnRPdXQoZnVuYykge1xuICB2YXIgY291bnQgPSAwLFxuICAgICAgbGFzdENhbGxlZCA9IDA7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBzdGFtcCA9IG5hdGl2ZU5vdygpLFxuICAgICAgICByZW1haW5pbmcgPSBIT1RfU1BBTiAtIChzdGFtcCAtIGxhc3RDYWxsZWQpO1xuXG4gICAgbGFzdENhbGxlZCA9IHN0YW1wO1xuICAgIGlmIChyZW1haW5pbmcgPiAwKSB7XG4gICAgICBpZiAoKytjb3VudCA+PSBIT1RfQ09VTlQpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3VtZW50c1swXTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY291bnQgPSAwO1xuICAgIH1cbiAgICByZXR1cm4gZnVuYy5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IHNob3J0T3V0O1xuIiwiLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGB2YWx1ZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAyLjQuMFxuICogQGNhdGVnb3J5IFV0aWxcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHJldHVybiBmcm9tIHRoZSBuZXcgZnVuY3Rpb24uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBjb25zdGFudCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdHMgPSBfLnRpbWVzKDIsIF8uY29uc3RhbnQoeyAnYSc6IDEgfSkpO1xuICpcbiAqIGNvbnNvbGUubG9nKG9iamVjdHMpO1xuICogLy8gPT4gW3sgJ2EnOiAxIH0sIHsgJ2EnOiAxIH1dXG4gKlxuICogY29uc29sZS5sb2cob2JqZWN0c1swXSA9PT0gb2JqZWN0c1sxXSk7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGNvbnN0YW50KHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvbnN0YW50O1xuIiwiaW1wb3J0IGdldE5hdGl2ZSBmcm9tICcuL19nZXROYXRpdmUuanMnO1xuXG52YXIgZGVmaW5lUHJvcGVydHkgPSAoZnVuY3Rpb24oKSB7XG4gIHRyeSB7XG4gICAgdmFyIGZ1bmMgPSBnZXROYXRpdmUoT2JqZWN0LCAnZGVmaW5lUHJvcGVydHknKTtcbiAgICBmdW5jKHt9LCAnJywge30pO1xuICAgIHJldHVybiBmdW5jO1xuICB9IGNhdGNoIChlKSB7fVxufSgpKTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lUHJvcGVydHk7XG4iLCJpbXBvcnQgY29uc3RhbnQgZnJvbSAnLi9jb25zdGFudC5qcyc7XG5pbXBvcnQgZGVmaW5lUHJvcGVydHkgZnJvbSAnLi9fZGVmaW5lUHJvcGVydHkuanMnO1xuaW1wb3J0IGlkZW50aXR5IGZyb20gJy4vaWRlbnRpdHkuanMnO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBzZXRUb1N0cmluZ2Agd2l0aG91dCBzdXBwb3J0IGZvciBob3QgbG9vcCBzaG9ydGluZy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gc3RyaW5nIFRoZSBgdG9TdHJpbmdgIHJlc3VsdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyBgZnVuY2AuXG4gKi9cbnZhciBiYXNlU2V0VG9TdHJpbmcgPSAhZGVmaW5lUHJvcGVydHkgPyBpZGVudGl0eSA6IGZ1bmN0aW9uKGZ1bmMsIHN0cmluZykge1xuICByZXR1cm4gZGVmaW5lUHJvcGVydHkoZnVuYywgJ3RvU3RyaW5nJywge1xuICAgICdjb25maWd1cmFibGUnOiB0cnVlLFxuICAgICdlbnVtZXJhYmxlJzogZmFsc2UsXG4gICAgJ3ZhbHVlJzogY29uc3RhbnQoc3RyaW5nKSxcbiAgICAnd3JpdGFibGUnOiB0cnVlXG4gIH0pO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgYmFzZVNldFRvU3RyaW5nO1xuIiwiaW1wb3J0IGJhc2VTZXRUb1N0cmluZyBmcm9tICcuL19iYXNlU2V0VG9TdHJpbmcuanMnO1xuaW1wb3J0IHNob3J0T3V0IGZyb20gJy4vX3Nob3J0T3V0LmpzJztcblxuLyoqXG4gKiBTZXRzIHRoZSBgdG9TdHJpbmdgIG1ldGhvZCBvZiBgZnVuY2AgdG8gcmV0dXJuIGBzdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdHJpbmcgVGhlIGB0b1N0cmluZ2AgcmVzdWx0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIGBmdW5jYC5cbiAqL1xudmFyIHNldFRvU3RyaW5nID0gc2hvcnRPdXQoYmFzZVNldFRvU3RyaW5nKTtcblxuZXhwb3J0IGRlZmF1bHQgc2V0VG9TdHJpbmc7XG4iLCIvKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IHVuc2lnbmVkIGludGVnZXIgdmFsdWVzLiAqL1xudmFyIHJlSXNVaW50ID0gL14oPzowfFsxLTldXFxkKikkLztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgaW5kZXguXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHBhcmFtIHtudW1iZXJ9IFtsZW5ndGg9TUFYX1NBRkVfSU5URUdFUl0gVGhlIHVwcGVyIGJvdW5kcyBvZiBhIHZhbGlkIGluZGV4LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBpbmRleCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0luZGV4KHZhbHVlLCBsZW5ndGgpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIGxlbmd0aCA9IGxlbmd0aCA9PSBudWxsID8gTUFYX1NBRkVfSU5URUdFUiA6IGxlbmd0aDtcblxuICByZXR1cm4gISFsZW5ndGggJiZcbiAgICAodHlwZSA9PSAnbnVtYmVyJyB8fFxuICAgICAgKHR5cGUgIT0gJ3N5bWJvbCcgJiYgcmVJc1VpbnQudGVzdCh2YWx1ZSkpKSAmJlxuICAgICAgICAodmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8IGxlbmd0aCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzSW5kZXg7XG4iLCJpbXBvcnQgZGVmaW5lUHJvcGVydHkgZnJvbSAnLi9fZGVmaW5lUHJvcGVydHkuanMnO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBhc3NpZ25WYWx1ZWAgYW5kIGBhc3NpZ25NZXJnZVZhbHVlYCB3aXRob3V0XG4gKiB2YWx1ZSBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGFzc2lnbi5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGFzc2lnbi5cbiAqL1xuZnVuY3Rpb24gYmFzZUFzc2lnblZhbHVlKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICBpZiAoa2V5ID09ICdfX3Byb3RvX18nICYmIGRlZmluZVByb3BlcnR5KSB7XG4gICAgZGVmaW5lUHJvcGVydHkob2JqZWN0LCBrZXksIHtcbiAgICAgICdjb25maWd1cmFibGUnOiB0cnVlLFxuICAgICAgJ2VudW1lcmFibGUnOiB0cnVlLFxuICAgICAgJ3ZhbHVlJzogdmFsdWUsXG4gICAgICAnd3JpdGFibGUnOiB0cnVlXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBiYXNlQXNzaWduVmFsdWU7XG4iLCIvKipcbiAqIFBlcmZvcm1zIGFcbiAqIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG4gKiBjb21wYXJpc29uIGJldHdlZW4gdHdvIHZhbHVlcyB0byBkZXRlcm1pbmUgaWYgdGhleSBhcmUgZXF1aXZhbGVudC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Kn0gb3RoZXIgVGhlIG90aGVyIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IDEgfTtcbiAqIHZhciBvdGhlciA9IHsgJ2EnOiAxIH07XG4gKlxuICogXy5lcShvYmplY3QsIG9iamVjdCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5lcShvYmplY3QsIG90aGVyKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5lcSgnYScsICdhJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5lcSgnYScsIE9iamVjdCgnYScpKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5lcShOYU4sIE5hTik7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGVxKHZhbHVlLCBvdGhlcikge1xuICByZXR1cm4gdmFsdWUgPT09IG90aGVyIHx8ICh2YWx1ZSAhPT0gdmFsdWUgJiYgb3RoZXIgIT09IG90aGVyKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZXE7XG4iLCJpbXBvcnQgYmFzZUFzc2lnblZhbHVlIGZyb20gJy4vX2Jhc2VBc3NpZ25WYWx1ZS5qcyc7XG5pbXBvcnQgZXEgZnJvbSAnLi9lcS5qcyc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQXNzaWducyBgdmFsdWVgIHRvIGBrZXlgIG9mIGBvYmplY3RgIGlmIHRoZSBleGlzdGluZyB2YWx1ZSBpcyBub3QgZXF1aXZhbGVudFxuICogdXNpbmcgW2BTYW1lVmFsdWVaZXJvYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtc2FtZXZhbHVlemVybylcbiAqIGZvciBlcXVhbGl0eSBjb21wYXJpc29ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gYXNzaWduLlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gYXNzaWduLlxuICovXG5mdW5jdGlvbiBhc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgdmFyIG9ialZhbHVlID0gb2JqZWN0W2tleV07XG4gIGlmICghKGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpICYmIGVxKG9ialZhbHVlLCB2YWx1ZSkpIHx8XG4gICAgICAodmFsdWUgPT09IHVuZGVmaW5lZCAmJiAhKGtleSBpbiBvYmplY3QpKSkge1xuICAgIGJhc2VBc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgdmFsdWUpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzc2lnblZhbHVlO1xuIiwiaW1wb3J0IGFzc2lnblZhbHVlIGZyb20gJy4vX2Fzc2lnblZhbHVlLmpzJztcbmltcG9ydCBiYXNlQXNzaWduVmFsdWUgZnJvbSAnLi9fYmFzZUFzc2lnblZhbHVlLmpzJztcblxuLyoqXG4gKiBDb3BpZXMgcHJvcGVydGllcyBvZiBgc291cmNlYCB0byBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyBmcm9tLlxuICogQHBhcmFtIHtBcnJheX0gcHJvcHMgVGhlIHByb3BlcnR5IGlkZW50aWZpZXJzIHRvIGNvcHkuXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdD17fV0gVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgdG8uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb3BpZWQgdmFsdWVzLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gY29weU9iamVjdChzb3VyY2UsIHByb3BzLCBvYmplY3QsIGN1c3RvbWl6ZXIpIHtcbiAgdmFyIGlzTmV3ID0gIW9iamVjdDtcbiAgb2JqZWN0IHx8IChvYmplY3QgPSB7fSk7XG5cbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIga2V5ID0gcHJvcHNbaW5kZXhdO1xuXG4gICAgdmFyIG5ld1ZhbHVlID0gY3VzdG9taXplclxuICAgICAgPyBjdXN0b21pemVyKG9iamVjdFtrZXldLCBzb3VyY2Vba2V5XSwga2V5LCBvYmplY3QsIHNvdXJjZSlcbiAgICAgIDogdW5kZWZpbmVkO1xuXG4gICAgaWYgKG5ld1ZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG5ld1ZhbHVlID0gc291cmNlW2tleV07XG4gICAgfVxuICAgIGlmIChpc05ldykge1xuICAgICAgYmFzZUFzc2lnblZhbHVlKG9iamVjdCwga2V5LCBuZXdWYWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFzc2lnblZhbHVlKG9iamVjdCwga2V5LCBuZXdWYWx1ZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBvYmplY3Q7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvcHlPYmplY3Q7XG4iLCJpbXBvcnQgYXBwbHkgZnJvbSAnLi9fYXBwbHkuanMnO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXg7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlUmVzdGAgd2hpY2ggdHJhbnNmb3JtcyB0aGUgcmVzdCBhcnJheS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYXBwbHkgYSByZXN0IHBhcmFtZXRlciB0by5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9ZnVuYy5sZW5ndGgtMV0gVGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSByZXN0IHBhcmFtZXRlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHRyYW5zZm9ybSBUaGUgcmVzdCBhcnJheSB0cmFuc2Zvcm0uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gb3ZlclJlc3QoZnVuYywgc3RhcnQsIHRyYW5zZm9ybSkge1xuICBzdGFydCA9IG5hdGl2ZU1heChzdGFydCA9PT0gdW5kZWZpbmVkID8gKGZ1bmMubGVuZ3RoIC0gMSkgOiBzdGFydCwgMCk7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gbmF0aXZlTWF4KGFyZ3MubGVuZ3RoIC0gc3RhcnQsIDApLFxuICAgICAgICBhcnJheSA9IEFycmF5KGxlbmd0aCk7XG5cbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgYXJyYXlbaW5kZXhdID0gYXJnc1tzdGFydCArIGluZGV4XTtcbiAgICB9XG4gICAgaW5kZXggPSAtMTtcbiAgICB2YXIgb3RoZXJBcmdzID0gQXJyYXkoc3RhcnQgKyAxKTtcbiAgICB3aGlsZSAoKytpbmRleCA8IHN0YXJ0KSB7XG4gICAgICBvdGhlckFyZ3NbaW5kZXhdID0gYXJnc1tpbmRleF07XG4gICAgfVxuICAgIG90aGVyQXJnc1tzdGFydF0gPSB0cmFuc2Zvcm0oYXJyYXkpO1xuICAgIHJldHVybiBhcHBseShmdW5jLCB0aGlzLCBvdGhlckFyZ3MpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBvdmVyUmVzdDtcbiIsImltcG9ydCBpZGVudGl0eSBmcm9tICcuL2lkZW50aXR5LmpzJztcbmltcG9ydCBvdmVyUmVzdCBmcm9tICcuL19vdmVyUmVzdC5qcyc7XG5pbXBvcnQgc2V0VG9TdHJpbmcgZnJvbSAnLi9fc2V0VG9TdHJpbmcuanMnO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnJlc3RgIHdoaWNoIGRvZXNuJ3QgdmFsaWRhdGUgb3IgY29lcmNlIGFyZ3VtZW50cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYXBwbHkgYSByZXN0IHBhcmFtZXRlciB0by5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9ZnVuYy5sZW5ndGgtMV0gVGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSByZXN0IHBhcmFtZXRlci5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlUmVzdChmdW5jLCBzdGFydCkge1xuICByZXR1cm4gc2V0VG9TdHJpbmcob3ZlclJlc3QoZnVuYywgc3RhcnQsIGlkZW50aXR5KSwgZnVuYyArICcnKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYmFzZVJlc3Q7XG4iLCIvKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBpcyBsb29zZWx5IGJhc2VkIG9uXG4gKiBbYFRvTGVuZ3RoYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtdG9sZW5ndGgpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgbGVuZ3RoLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNMZW5ndGgoMyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0xlbmd0aChOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aChJbmZpbml0eSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNMZW5ndGgoJzMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTGVuZ3RoKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiZcbiAgICB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDw9IE1BWF9TQUZFX0lOVEVHRVI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzTGVuZ3RoO1xuIiwiaW1wb3J0IGlzRnVuY3Rpb24gZnJvbSAnLi9pc0Z1bmN0aW9uLmpzJztcbmltcG9ydCBpc0xlbmd0aCBmcm9tICcuL2lzTGVuZ3RoLmpzJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLiBBIHZhbHVlIGlzIGNvbnNpZGVyZWQgYXJyYXktbGlrZSBpZiBpdCdzXG4gKiBub3QgYSBmdW5jdGlvbiBhbmQgaGFzIGEgYHZhbHVlLmxlbmd0aGAgdGhhdCdzIGFuIGludGVnZXIgZ3JlYXRlciB0aGFuIG9yXG4gKiBlcXVhbCB0byBgMGAgYW5kIGxlc3MgdGhhbiBvciBlcXVhbCB0byBgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZSgnYWJjJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUxpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgaXNMZW5ndGgodmFsdWUubGVuZ3RoKSAmJiAhaXNGdW5jdGlvbih2YWx1ZSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzQXJyYXlMaWtlO1xuIiwiaW1wb3J0IGVxIGZyb20gJy4vZXEuanMnO1xuaW1wb3J0IGlzQXJyYXlMaWtlIGZyb20gJy4vaXNBcnJheUxpa2UuanMnO1xuaW1wb3J0IGlzSW5kZXggZnJvbSAnLi9faXNJbmRleC5qcyc7XG5pbXBvcnQgaXNPYmplY3QgZnJvbSAnLi9pc09iamVjdC5qcyc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBhcmd1bWVudHMgYXJlIGZyb20gYW4gaXRlcmF0ZWUgY2FsbC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIHZhbHVlIGFyZ3VtZW50LlxuICogQHBhcmFtIHsqfSBpbmRleCBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIGluZGV4IG9yIGtleSBhcmd1bWVudC5cbiAqIEBwYXJhbSB7Kn0gb2JqZWN0IFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgb2JqZWN0IGFyZ3VtZW50LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBhcmd1bWVudHMgYXJlIGZyb20gYW4gaXRlcmF0ZWUgY2FsbCxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSXRlcmF0ZWVDYWxsKHZhbHVlLCBpbmRleCwgb2JqZWN0KSB7XG4gIGlmICghaXNPYmplY3Qob2JqZWN0KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgdHlwZSA9IHR5cGVvZiBpbmRleDtcbiAgaWYgKHR5cGUgPT0gJ251bWJlcidcbiAgICAgICAgPyAoaXNBcnJheUxpa2Uob2JqZWN0KSAmJiBpc0luZGV4KGluZGV4LCBvYmplY3QubGVuZ3RoKSlcbiAgICAgICAgOiAodHlwZSA9PSAnc3RyaW5nJyAmJiBpbmRleCBpbiBvYmplY3QpXG4gICAgICApIHtcbiAgICByZXR1cm4gZXEob2JqZWN0W2luZGV4XSwgdmFsdWUpO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaXNJdGVyYXRlZUNhbGw7XG4iLCJpbXBvcnQgYmFzZVJlc3QgZnJvbSAnLi9fYmFzZVJlc3QuanMnO1xuaW1wb3J0IGlzSXRlcmF0ZWVDYWxsIGZyb20gJy4vX2lzSXRlcmF0ZWVDYWxsLmpzJztcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gbGlrZSBgXy5hc3NpZ25gLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBhc3NpZ25lciBUaGUgZnVuY3Rpb24gdG8gYXNzaWduIHZhbHVlcy5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGFzc2lnbmVyIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVBc3NpZ25lcihhc3NpZ25lcikge1xuICByZXR1cm4gYmFzZVJlc3QoZnVuY3Rpb24ob2JqZWN0LCBzb3VyY2VzKSB7XG4gICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgIGxlbmd0aCA9IHNvdXJjZXMubGVuZ3RoLFxuICAgICAgICBjdXN0b21pemVyID0gbGVuZ3RoID4gMSA/IHNvdXJjZXNbbGVuZ3RoIC0gMV0gOiB1bmRlZmluZWQsXG4gICAgICAgIGd1YXJkID0gbGVuZ3RoID4gMiA/IHNvdXJjZXNbMl0gOiB1bmRlZmluZWQ7XG5cbiAgICBjdXN0b21pemVyID0gKGFzc2lnbmVyLmxlbmd0aCA+IDMgJiYgdHlwZW9mIGN1c3RvbWl6ZXIgPT0gJ2Z1bmN0aW9uJylcbiAgICAgID8gKGxlbmd0aC0tLCBjdXN0b21pemVyKVxuICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgICBpZiAoZ3VhcmQgJiYgaXNJdGVyYXRlZUNhbGwoc291cmNlc1swXSwgc291cmNlc1sxXSwgZ3VhcmQpKSB7XG4gICAgICBjdXN0b21pemVyID0gbGVuZ3RoIDwgMyA/IHVuZGVmaW5lZCA6IGN1c3RvbWl6ZXI7XG4gICAgICBsZW5ndGggPSAxO1xuICAgIH1cbiAgICBvYmplY3QgPSBPYmplY3Qob2JqZWN0KTtcbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgdmFyIHNvdXJjZSA9IHNvdXJjZXNbaW5kZXhdO1xuICAgICAgaWYgKHNvdXJjZSkge1xuICAgICAgICBhc3NpZ25lcihvYmplY3QsIHNvdXJjZSwgaW5kZXgsIGN1c3RvbWl6ZXIpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0O1xuICB9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlQXNzaWduZXI7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGxpa2VseSBhIHByb3RvdHlwZSBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBwcm90b3R5cGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNQcm90b3R5cGUodmFsdWUpIHtcbiAgdmFyIEN0b3IgPSB2YWx1ZSAmJiB2YWx1ZS5jb25zdHJ1Y3RvcixcbiAgICAgIHByb3RvID0gKHR5cGVvZiBDdG9yID09ICdmdW5jdGlvbicgJiYgQ3Rvci5wcm90b3R5cGUpIHx8IG9iamVjdFByb3RvO1xuXG4gIHJldHVybiB2YWx1ZSA9PT0gcHJvdG87XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzUHJvdG90eXBlO1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy50aW1lc2Agd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzXG4gKiBvciBtYXggYXJyYXkgbGVuZ3RoIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IG4gVGhlIG51bWJlciBvZiB0aW1lcyB0byBpbnZva2UgYGl0ZXJhdGVlYC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHJlc3VsdHMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VUaW1lcyhuLCBpdGVyYXRlZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IEFycmF5KG4pO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbikge1xuICAgIHJlc3VsdFtpbmRleF0gPSBpdGVyYXRlZShpbmRleCk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYmFzZVRpbWVzO1xuIiwiaW1wb3J0IGJhc2VHZXRUYWcgZnJvbSAnLi9fYmFzZUdldFRhZy5qcyc7XG5pbXBvcnQgaXNPYmplY3RMaWtlIGZyb20gJy4vaXNPYmplY3RMaWtlLmpzJztcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJztcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc0FyZ3VtZW50c2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LFxuICovXG5mdW5jdGlvbiBiYXNlSXNBcmd1bWVudHModmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgYmFzZUdldFRhZyh2YWx1ZSkgPT0gYXJnc1RhZztcbn1cblxuZXhwb3J0IGRlZmF1bHQgYmFzZUlzQXJndW1lbnRzO1xuIiwiaW1wb3J0IGJhc2VJc0FyZ3VtZW50cyBmcm9tICcuL19iYXNlSXNBcmd1bWVudHMuanMnO1xuaW1wb3J0IGlzT2JqZWN0TGlrZSBmcm9tICcuL2lzT2JqZWN0TGlrZS5qcyc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHByb3BlcnR5SXNFbnVtZXJhYmxlID0gb2JqZWN0UHJvdG8ucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGFuIGBhcmd1bWVudHNgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FyZ3VtZW50cyA9IGJhc2VJc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA/IGJhc2VJc0FyZ3VtZW50cyA6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsICdjYWxsZWUnKSAmJlxuICAgICFwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHZhbHVlLCAnY2FsbGVlJyk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBpc0FyZ3VtZW50cztcbiIsIi8qKlxuICogVGhpcyBtZXRob2QgcmV0dXJucyBgZmFsc2VgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4xMy4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50aW1lcygyLCBfLnN0dWJGYWxzZSk7XG4gKiAvLyA9PiBbZmFsc2UsIGZhbHNlXVxuICovXG5mdW5jdGlvbiBzdHViRmFsc2UoKSB7XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgc3R1YkZhbHNlO1xuIiwiaW1wb3J0IHJvb3QgZnJvbSAnLi9fcm9vdC5qcyc7XG5pbXBvcnQgc3R1YkZhbHNlIGZyb20gJy4vc3R1YkZhbHNlLmpzJztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbnZhciBmcmVlRXhwb3J0cyA9IHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnICYmIGV4cG9ydHMgJiYgIWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xudmFyIGZyZWVNb2R1bGUgPSBmcmVlRXhwb3J0cyAmJiB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuLyoqIERldGVjdCB0aGUgcG9wdWxhciBDb21tb25KUyBleHRlbnNpb24gYG1vZHVsZS5leHBvcnRzYC4gKi9cbnZhciBtb2R1bGVFeHBvcnRzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBCdWZmZXIgPSBtb2R1bGVFeHBvcnRzID8gcm9vdC5CdWZmZXIgOiB1bmRlZmluZWQ7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVJc0J1ZmZlciA9IEJ1ZmZlciA/IEJ1ZmZlci5pc0J1ZmZlciA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIGJ1ZmZlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMy4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGJ1ZmZlciwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQnVmZmVyKG5ldyBCdWZmZXIoMikpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNCdWZmZXIobmV3IFVpbnQ4QXJyYXkoMikpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQnVmZmVyID0gbmF0aXZlSXNCdWZmZXIgfHwgc3R1YkZhbHNlO1xuXG5leHBvcnQgZGVmYXVsdCBpc0J1ZmZlcjtcbiIsImltcG9ydCBiYXNlR2V0VGFnIGZyb20gJy4vX2Jhc2VHZXRUYWcuanMnO1xuaW1wb3J0IGlzTGVuZ3RoIGZyb20gJy4vaXNMZW5ndGguanMnO1xuaW1wb3J0IGlzT2JqZWN0TGlrZSBmcm9tICcuL2lzT2JqZWN0TGlrZS5qcyc7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXScsXG4gICAgYXJyYXlUYWcgPSAnW29iamVjdCBBcnJheV0nLFxuICAgIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBlcnJvclRhZyA9ICdbb2JqZWN0IEVycm9yXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgbnVtYmVyVGFnID0gJ1tvYmplY3QgTnVtYmVyXScsXG4gICAgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XScsXG4gICAgcmVnZXhwVGFnID0gJ1tvYmplY3QgUmVnRXhwXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XScsXG4gICAgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXScsXG4gICAgd2Vha01hcFRhZyA9ICdbb2JqZWN0IFdlYWtNYXBdJztcblxudmFyIGFycmF5QnVmZmVyVGFnID0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJyxcbiAgICBkYXRhVmlld1RhZyA9ICdbb2JqZWN0IERhdGFWaWV3XScsXG4gICAgZmxvYXQzMlRhZyA9ICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgIGZsb2F0NjRUYWcgPSAnW29iamVjdCBGbG9hdDY0QXJyYXldJyxcbiAgICBpbnQ4VGFnID0gJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgaW50MTZUYWcgPSAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgaW50MzJUYWcgPSAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgdWludDhUYWcgPSAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgdWludDhDbGFtcGVkVGFnID0gJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICB1aW50MTZUYWcgPSAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgIHVpbnQzMlRhZyA9ICdbb2JqZWN0IFVpbnQzMkFycmF5XSc7XG5cbi8qKiBVc2VkIHRvIGlkZW50aWZ5IGB0b1N0cmluZ1RhZ2AgdmFsdWVzIG9mIHR5cGVkIGFycmF5cy4gKi9cbnZhciB0eXBlZEFycmF5VGFncyA9IHt9O1xudHlwZWRBcnJheVRhZ3NbZmxvYXQzMlRhZ10gPSB0eXBlZEFycmF5VGFnc1tmbG9hdDY0VGFnXSA9XG50eXBlZEFycmF5VGFnc1tpbnQ4VGFnXSA9IHR5cGVkQXJyYXlUYWdzW2ludDE2VGFnXSA9XG50eXBlZEFycmF5VGFnc1tpbnQzMlRhZ10gPSB0eXBlZEFycmF5VGFnc1t1aW50OFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbdWludDhDbGFtcGVkVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3VpbnQxNlRhZ10gPVxudHlwZWRBcnJheVRhZ3NbdWludDMyVGFnXSA9IHRydWU7XG50eXBlZEFycmF5VGFnc1thcmdzVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2FycmF5VGFnXSA9XG50eXBlZEFycmF5VGFnc1thcnJheUJ1ZmZlclRhZ10gPSB0eXBlZEFycmF5VGFnc1tib29sVGFnXSA9XG50eXBlZEFycmF5VGFnc1tkYXRhVmlld1RhZ10gPSB0eXBlZEFycmF5VGFnc1tkYXRlVGFnXSA9XG50eXBlZEFycmF5VGFnc1tlcnJvclRhZ10gPSB0eXBlZEFycmF5VGFnc1tmdW5jVGFnXSA9XG50eXBlZEFycmF5VGFnc1ttYXBUYWddID0gdHlwZWRBcnJheVRhZ3NbbnVtYmVyVGFnXSA9XG50eXBlZEFycmF5VGFnc1tvYmplY3RUYWddID0gdHlwZWRBcnJheVRhZ3NbcmVnZXhwVGFnXSA9XG50eXBlZEFycmF5VGFnc1tzZXRUYWddID0gdHlwZWRBcnJheVRhZ3Nbc3RyaW5nVGFnXSA9XG50eXBlZEFycmF5VGFnc1t3ZWFrTWFwVGFnXSA9IGZhbHNlO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzVHlwZWRBcnJheWAgd2l0aG91dCBOb2RlLmpzIG9wdGltaXphdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB0eXBlZCBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNUeXBlZEFycmF5KHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmXG4gICAgaXNMZW5ndGgodmFsdWUubGVuZ3RoKSAmJiAhIXR5cGVkQXJyYXlUYWdzW2Jhc2VHZXRUYWcodmFsdWUpXTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYmFzZUlzVHlwZWRBcnJheTtcbiIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udW5hcnlgIHdpdGhvdXQgc3VwcG9ydCBmb3Igc3RvcmluZyBtZXRhZGF0YS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY2FwIGFyZ3VtZW50cyBmb3IuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBjYXBwZWQgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VVbmFyeShmdW5jKSB7XG4gIHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiBmdW5jKHZhbHVlKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYmFzZVVuYXJ5O1xuIiwiaW1wb3J0IGZyZWVHbG9iYWwgZnJvbSAnLi9fZnJlZUdsb2JhbC5qcyc7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG52YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbnZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbi8qKiBEZXRlY3QgdGhlIHBvcHVsYXIgQ29tbW9uSlMgZXh0ZW5zaW9uIGBtb2R1bGUuZXhwb3J0c2AuICovXG52YXIgbW9kdWxlRXhwb3J0cyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5leHBvcnRzID09PSBmcmVlRXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBwcm9jZXNzYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZVByb2Nlc3MgPSBtb2R1bGVFeHBvcnRzICYmIGZyZWVHbG9iYWwucHJvY2VzcztcblxuLyoqIFVzZWQgdG8gYWNjZXNzIGZhc3RlciBOb2RlLmpzIGhlbHBlcnMuICovXG52YXIgbm9kZVV0aWwgPSAoZnVuY3Rpb24oKSB7XG4gIHRyeSB7XG4gICAgLy8gVXNlIGB1dGlsLnR5cGVzYCBmb3IgTm9kZS5qcyAxMCsuXG4gICAgdmFyIHR5cGVzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLnJlcXVpcmUgJiYgZnJlZU1vZHVsZS5yZXF1aXJlKCd1dGlsJykudHlwZXM7XG5cbiAgICBpZiAodHlwZXMpIHtcbiAgICAgIHJldHVybiB0eXBlcztcbiAgICB9XG5cbiAgICAvLyBMZWdhY3kgYHByb2Nlc3MuYmluZGluZygndXRpbCcpYCBmb3IgTm9kZS5qcyA8IDEwLlxuICAgIHJldHVybiBmcmVlUHJvY2VzcyAmJiBmcmVlUHJvY2Vzcy5iaW5kaW5nICYmIGZyZWVQcm9jZXNzLmJpbmRpbmcoJ3V0aWwnKTtcbiAgfSBjYXRjaCAoZSkge31cbn0oKSk7XG5cbmV4cG9ydCBkZWZhdWx0IG5vZGVVdGlsO1xuIiwiaW1wb3J0IGJhc2VJc1R5cGVkQXJyYXkgZnJvbSAnLi9fYmFzZUlzVHlwZWRBcnJheS5qcyc7XG5pbXBvcnQgYmFzZVVuYXJ5IGZyb20gJy4vX2Jhc2VVbmFyeS5qcyc7XG5pbXBvcnQgbm9kZVV0aWwgZnJvbSAnLi9fbm9kZVV0aWwuanMnO1xuXG4vKiBOb2RlLmpzIGhlbHBlciByZWZlcmVuY2VzLiAqL1xudmFyIG5vZGVJc1R5cGVkQXJyYXkgPSBub2RlVXRpbCAmJiBub2RlVXRpbC5pc1R5cGVkQXJyYXk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIHR5cGVkIGFycmF5LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdHlwZWQgYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1R5cGVkQXJyYXkobmV3IFVpbnQ4QXJyYXkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNUeXBlZEFycmF5KFtdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc1R5cGVkQXJyYXkgPSBub2RlSXNUeXBlZEFycmF5ID8gYmFzZVVuYXJ5KG5vZGVJc1R5cGVkQXJyYXkpIDogYmFzZUlzVHlwZWRBcnJheTtcblxuZXhwb3J0IGRlZmF1bHQgaXNUeXBlZEFycmF5O1xuIiwiaW1wb3J0IGJhc2VUaW1lcyBmcm9tICcuL19iYXNlVGltZXMuanMnO1xuaW1wb3J0IGlzQXJndW1lbnRzIGZyb20gJy4vaXNBcmd1bWVudHMuanMnO1xuaW1wb3J0IGlzQXJyYXkgZnJvbSAnLi9pc0FycmF5LmpzJztcbmltcG9ydCBpc0J1ZmZlciBmcm9tICcuL2lzQnVmZmVyLmpzJztcbmltcG9ydCBpc0luZGV4IGZyb20gJy4vX2lzSW5kZXguanMnO1xuaW1wb3J0IGlzVHlwZWRBcnJheSBmcm9tICcuL2lzVHlwZWRBcnJheS5qcyc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiB0aGUgYXJyYXktbGlrZSBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaW5oZXJpdGVkIFNwZWNpZnkgcmV0dXJuaW5nIGluaGVyaXRlZCBwcm9wZXJ0eSBuYW1lcy5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGFycmF5TGlrZUtleXModmFsdWUsIGluaGVyaXRlZCkge1xuICB2YXIgaXNBcnIgPSBpc0FycmF5KHZhbHVlKSxcbiAgICAgIGlzQXJnID0gIWlzQXJyICYmIGlzQXJndW1lbnRzKHZhbHVlKSxcbiAgICAgIGlzQnVmZiA9ICFpc0FyciAmJiAhaXNBcmcgJiYgaXNCdWZmZXIodmFsdWUpLFxuICAgICAgaXNUeXBlID0gIWlzQXJyICYmICFpc0FyZyAmJiAhaXNCdWZmICYmIGlzVHlwZWRBcnJheSh2YWx1ZSksXG4gICAgICBza2lwSW5kZXhlcyA9IGlzQXJyIHx8IGlzQXJnIHx8IGlzQnVmZiB8fCBpc1R5cGUsXG4gICAgICByZXN1bHQgPSBza2lwSW5kZXhlcyA/IGJhc2VUaW1lcyh2YWx1ZS5sZW5ndGgsIFN0cmluZykgOiBbXSxcbiAgICAgIGxlbmd0aCA9IHJlc3VsdC5sZW5ndGg7XG5cbiAgZm9yICh2YXIga2V5IGluIHZhbHVlKSB7XG4gICAgaWYgKChpbmhlcml0ZWQgfHwgaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwga2V5KSkgJiZcbiAgICAgICAgIShza2lwSW5kZXhlcyAmJiAoXG4gICAgICAgICAgIC8vIFNhZmFyaSA5IGhhcyBlbnVtZXJhYmxlIGBhcmd1bWVudHMubGVuZ3RoYCBpbiBzdHJpY3QgbW9kZS5cbiAgICAgICAgICAga2V5ID09ICdsZW5ndGgnIHx8XG4gICAgICAgICAgIC8vIE5vZGUuanMgMC4xMCBoYXMgZW51bWVyYWJsZSBub24taW5kZXggcHJvcGVydGllcyBvbiBidWZmZXJzLlxuICAgICAgICAgICAoaXNCdWZmICYmIChrZXkgPT0gJ29mZnNldCcgfHwga2V5ID09ICdwYXJlbnQnKSkgfHxcbiAgICAgICAgICAgLy8gUGhhbnRvbUpTIDIgaGFzIGVudW1lcmFibGUgbm9uLWluZGV4IHByb3BlcnRpZXMgb24gdHlwZWQgYXJyYXlzLlxuICAgICAgICAgICAoaXNUeXBlICYmIChrZXkgPT0gJ2J1ZmZlcicgfHwga2V5ID09ICdieXRlTGVuZ3RoJyB8fCBrZXkgPT0gJ2J5dGVPZmZzZXQnKSkgfHxcbiAgICAgICAgICAgLy8gU2tpcCBpbmRleCBwcm9wZXJ0aWVzLlxuICAgICAgICAgICBpc0luZGV4KGtleSwgbGVuZ3RoKVxuICAgICAgICApKSkge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXJyYXlMaWtlS2V5cztcbiIsIi8qKlxuICogQ3JlYXRlcyBhIHVuYXJ5IGZ1bmN0aW9uIHRoYXQgaW52b2tlcyBgZnVuY2Agd2l0aCBpdHMgYXJndW1lbnQgdHJhbnNmb3JtZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHdyYXAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSB0cmFuc2Zvcm0gVGhlIGFyZ3VtZW50IHRyYW5zZm9ybS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBvdmVyQXJnKGZ1bmMsIHRyYW5zZm9ybSkge1xuICByZXR1cm4gZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIGZ1bmModHJhbnNmb3JtKGFyZykpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBvdmVyQXJnO1xuIiwiLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIGxpa2VcbiAqIFtgT2JqZWN0LmtleXNgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3Qua2V5cylcbiAqIGV4Y2VwdCB0aGF0IGl0IGluY2x1ZGVzIGluaGVyaXRlZCBlbnVtZXJhYmxlIHByb3BlcnRpZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIG5hdGl2ZUtleXNJbihvYmplY3QpIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBpZiAob2JqZWN0ICE9IG51bGwpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gT2JqZWN0KG9iamVjdCkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5hdGl2ZUtleXNJbjtcbiIsImltcG9ydCBpc09iamVjdCBmcm9tICcuL2lzT2JqZWN0LmpzJztcbmltcG9ydCBpc1Byb3RvdHlwZSBmcm9tICcuL19pc1Byb3RvdHlwZS5qcyc7XG5pbXBvcnQgbmF0aXZlS2V5c0luIGZyb20gJy4vX25hdGl2ZUtleXNJbi5qcyc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ua2V5c0luYCB3aGljaCBkb2Vzbid0IHRyZWF0IHNwYXJzZSBhcnJheXMgYXMgZGVuc2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VLZXlzSW4ob2JqZWN0KSB7XG4gIGlmICghaXNPYmplY3Qob2JqZWN0KSkge1xuICAgIHJldHVybiBuYXRpdmVLZXlzSW4ob2JqZWN0KTtcbiAgfVxuICB2YXIgaXNQcm90byA9IGlzUHJvdG90eXBlKG9iamVjdCksXG4gICAgICByZXN1bHQgPSBbXTtcblxuICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgaWYgKCEoa2V5ID09ICdjb25zdHJ1Y3RvcicgJiYgKGlzUHJvdG8gfHwgIWhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpKSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGJhc2VLZXlzSW47XG4iLCJpbXBvcnQgYXJyYXlMaWtlS2V5cyBmcm9tICcuL19hcnJheUxpa2VLZXlzLmpzJztcbmltcG9ydCBiYXNlS2V5c0luIGZyb20gJy4vX2Jhc2VLZXlzSW4uanMnO1xuaW1wb3J0IGlzQXJyYXlMaWtlIGZyb20gJy4vaXNBcnJheUxpa2UuanMnO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBhbmQgaW5oZXJpdGVkIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIE5vbi1vYmplY3QgdmFsdWVzIGFyZSBjb2VyY2VkIHRvIG9iamVjdHMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy5rZXlzSW4obmV3IEZvbyk7XG4gKiAvLyA9PiBbJ2EnLCAnYicsICdjJ10gKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAqL1xuZnVuY3Rpb24ga2V5c0luKG9iamVjdCkge1xuICByZXR1cm4gaXNBcnJheUxpa2Uob2JqZWN0KSA/IGFycmF5TGlrZUtleXMob2JqZWN0LCB0cnVlKSA6IGJhc2VLZXlzSW4ob2JqZWN0KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQga2V5c0luO1xuIiwiaW1wb3J0IGdldE5hdGl2ZSBmcm9tICcuL19nZXROYXRpdmUuanMnO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgbmF0aXZlQ3JlYXRlID0gZ2V0TmF0aXZlKE9iamVjdCwgJ2NyZWF0ZScpO1xuXG5leHBvcnQgZGVmYXVsdCBuYXRpdmVDcmVhdGU7XG4iLCJpbXBvcnQgbmF0aXZlQ3JlYXRlIGZyb20gJy4vX25hdGl2ZUNyZWF0ZS5qcyc7XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgaGFzaC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKi9cbmZ1bmN0aW9uIGhhc2hDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IG5hdGl2ZUNyZWF0ZSA/IG5hdGl2ZUNyZWF0ZShudWxsKSA6IHt9O1xuICB0aGlzLnNpemUgPSAwO1xufVxuXG5leHBvcnQgZGVmYXVsdCBoYXNoQ2xlYXI7XG4iLCIvKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBoYXNoLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge09iamVjdH0gaGFzaCBUaGUgaGFzaCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzaERlbGV0ZShrZXkpIHtcbiAgdmFyIHJlc3VsdCA9IHRoaXMuaGFzKGtleSkgJiYgZGVsZXRlIHRoaXMuX19kYXRhX19ba2V5XTtcbiAgdGhpcy5zaXplIC09IHJlc3VsdCA/IDEgOiAwO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBoYXNoRGVsZXRlO1xuIiwiaW1wb3J0IG5hdGl2ZUNyZWF0ZSBmcm9tICcuL19uYXRpdmVDcmVhdGUuanMnO1xuXG4vKiogVXNlZCB0byBzdGFuZC1pbiBmb3IgYHVuZGVmaW5lZGAgaGFzaCB2YWx1ZXMuICovXG52YXIgSEFTSF9VTkRFRklORUQgPSAnX19sb2Rhc2hfaGFzaF91bmRlZmluZWRfXyc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogR2V0cyB0aGUgaGFzaCB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBoYXNoR2V0KGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIGlmIChuYXRpdmVDcmVhdGUpIHtcbiAgICB2YXIgcmVzdWx0ID0gZGF0YVtrZXldO1xuICAgIHJldHVybiByZXN1bHQgPT09IEhBU0hfVU5ERUZJTkVEID8gdW5kZWZpbmVkIDogcmVzdWx0O1xuICB9XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGEsIGtleSkgPyBkYXRhW2tleV0gOiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGhhc2hHZXQ7XG4iLCJpbXBvcnQgbmF0aXZlQ3JlYXRlIGZyb20gJy4vX25hdGl2ZUNyZWF0ZS5qcyc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgaGFzaCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzaEhhcyhrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICByZXR1cm4gbmF0aXZlQ3JlYXRlID8gKGRhdGFba2V5XSAhPT0gdW5kZWZpbmVkKSA6IGhhc093blByb3BlcnR5LmNhbGwoZGF0YSwga2V5KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaGFzaEhhcztcbiIsImltcG9ydCBuYXRpdmVDcmVhdGUgZnJvbSAnLi9fbmF0aXZlQ3JlYXRlLmpzJztcblxuLyoqIFVzZWQgdG8gc3RhbmQtaW4gZm9yIGB1bmRlZmluZWRgIGhhc2ggdmFsdWVzLiAqL1xudmFyIEhBU0hfVU5ERUZJTkVEID0gJ19fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX18nO1xuXG4vKipcbiAqIFNldHMgdGhlIGhhc2ggYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBoYXNoIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBoYXNoU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICB0aGlzLnNpemUgKz0gdGhpcy5oYXMoa2V5KSA/IDAgOiAxO1xuICBkYXRhW2tleV0gPSAobmF0aXZlQ3JlYXRlICYmIHZhbHVlID09PSB1bmRlZmluZWQpID8gSEFTSF9VTkRFRklORUQgOiB2YWx1ZTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGhhc2hTZXQ7XG4iLCJpbXBvcnQgaGFzaENsZWFyIGZyb20gJy4vX2hhc2hDbGVhci5qcyc7XG5pbXBvcnQgaGFzaERlbGV0ZSBmcm9tICcuL19oYXNoRGVsZXRlLmpzJztcbmltcG9ydCBoYXNoR2V0IGZyb20gJy4vX2hhc2hHZXQuanMnO1xuaW1wb3J0IGhhc2hIYXMgZnJvbSAnLi9faGFzaEhhcy5qcyc7XG5pbXBvcnQgaGFzaFNldCBmcm9tICcuL19oYXNoU2V0LmpzJztcblxuLyoqXG4gKiBDcmVhdGVzIGEgaGFzaCBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIEhhc2goZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPT0gbnVsbCA/IDAgOiBlbnRyaWVzLmxlbmd0aDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgSGFzaGAuXG5IYXNoLnByb3RvdHlwZS5jbGVhciA9IGhhc2hDbGVhcjtcbkhhc2gucHJvdG90eXBlWydkZWxldGUnXSA9IGhhc2hEZWxldGU7XG5IYXNoLnByb3RvdHlwZS5nZXQgPSBoYXNoR2V0O1xuSGFzaC5wcm90b3R5cGUuaGFzID0gaGFzaEhhcztcbkhhc2gucHJvdG90eXBlLnNldCA9IGhhc2hTZXQ7XG5cbmV4cG9ydCBkZWZhdWx0IEhhc2g7XG4iLCIvKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIGxpc3QgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUNsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0gW107XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGxpc3RDYWNoZUNsZWFyO1xuIiwiaW1wb3J0IGVxIGZyb20gJy4vZXEuanMnO1xuXG4vKipcbiAqIEdldHMgdGhlIGluZGV4IGF0IHdoaWNoIHRoZSBga2V5YCBpcyBmb3VuZCBpbiBgYXJyYXlgIG9mIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0geyp9IGtleSBUaGUga2V5IHRvIHNlYXJjaCBmb3IuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuICovXG5mdW5jdGlvbiBhc3NvY0luZGV4T2YoYXJyYXksIGtleSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICBpZiAoZXEoYXJyYXlbbGVuZ3RoXVswXSwga2V5KSkge1xuICAgICAgcmV0dXJuIGxlbmd0aDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG5leHBvcnQgZGVmYXVsdCBhc3NvY0luZGV4T2Y7XG4iLCJpbXBvcnQgYXNzb2NJbmRleE9mIGZyb20gJy4vX2Fzc29jSW5kZXhPZi5qcyc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBhcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzcGxpY2UgPSBhcnJheVByb3RvLnNwbGljZTtcblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgbGlzdCBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlRGVsZXRlKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIGlmIChpbmRleCA8IDApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIGxhc3RJbmRleCA9IGRhdGEubGVuZ3RoIC0gMTtcbiAgaWYgKGluZGV4ID09IGxhc3RJbmRleCkge1xuICAgIGRhdGEucG9wKCk7XG4gIH0gZWxzZSB7XG4gICAgc3BsaWNlLmNhbGwoZGF0YSwgaW5kZXgsIDEpO1xuICB9XG4gIC0tdGhpcy5zaXplO1xuICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbGlzdENhY2hlRGVsZXRlO1xuIiwiaW1wb3J0IGFzc29jSW5kZXhPZiBmcm9tICcuL19hc3NvY0luZGV4T2YuanMnO1xuXG4vKipcbiAqIEdldHMgdGhlIGxpc3QgY2FjaGUgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVHZXQoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgcmV0dXJuIGluZGV4IDwgMCA/IHVuZGVmaW5lZCA6IGRhdGFbaW5kZXhdWzFdO1xufVxuXG5leHBvcnQgZGVmYXVsdCBsaXN0Q2FjaGVHZXQ7XG4iLCJpbXBvcnQgYXNzb2NJbmRleE9mIGZyb20gJy4vX2Fzc29jSW5kZXhPZi5qcyc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgbGlzdCBjYWNoZSB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVIYXMoa2V5KSB7XG4gIHJldHVybiBhc3NvY0luZGV4T2YodGhpcy5fX2RhdGFfXywga2V5KSA+IC0xO1xufVxuXG5leHBvcnQgZGVmYXVsdCBsaXN0Q2FjaGVIYXM7XG4iLCJpbXBvcnQgYXNzb2NJbmRleE9mIGZyb20gJy4vX2Fzc29jSW5kZXhPZi5qcyc7XG5cbi8qKlxuICogU2V0cyB0aGUgbGlzdCBjYWNoZSBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbGlzdCBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICBpZiAoaW5kZXggPCAwKSB7XG4gICAgKyt0aGlzLnNpemU7XG4gICAgZGF0YS5wdXNoKFtrZXksIHZhbHVlXSk7XG4gIH0gZWxzZSB7XG4gICAgZGF0YVtpbmRleF1bMV0gPSB2YWx1ZTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn1cblxuZXhwb3J0IGRlZmF1bHQgbGlzdENhY2hlU2V0O1xuIiwiaW1wb3J0IGxpc3RDYWNoZUNsZWFyIGZyb20gJy4vX2xpc3RDYWNoZUNsZWFyLmpzJztcbmltcG9ydCBsaXN0Q2FjaGVEZWxldGUgZnJvbSAnLi9fbGlzdENhY2hlRGVsZXRlLmpzJztcbmltcG9ydCBsaXN0Q2FjaGVHZXQgZnJvbSAnLi9fbGlzdENhY2hlR2V0LmpzJztcbmltcG9ydCBsaXN0Q2FjaGVIYXMgZnJvbSAnLi9fbGlzdENhY2hlSGFzLmpzJztcbmltcG9ydCBsaXN0Q2FjaGVTZXQgZnJvbSAnLi9fbGlzdENhY2hlU2V0LmpzJztcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGxpc3QgY2FjaGUgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBMaXN0Q2FjaGUoZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPT0gbnVsbCA/IDAgOiBlbnRyaWVzLmxlbmd0aDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgTGlzdENhY2hlYC5cbkxpc3RDYWNoZS5wcm90b3R5cGUuY2xlYXIgPSBsaXN0Q2FjaGVDbGVhcjtcbkxpc3RDYWNoZS5wcm90b3R5cGVbJ2RlbGV0ZSddID0gbGlzdENhY2hlRGVsZXRlO1xuTGlzdENhY2hlLnByb3RvdHlwZS5nZXQgPSBsaXN0Q2FjaGVHZXQ7XG5MaXN0Q2FjaGUucHJvdG90eXBlLmhhcyA9IGxpc3RDYWNoZUhhcztcbkxpc3RDYWNoZS5wcm90b3R5cGUuc2V0ID0gbGlzdENhY2hlU2V0O1xuXG5leHBvcnQgZGVmYXVsdCBMaXN0Q2FjaGU7XG4iLCJpbXBvcnQgZ2V0TmF0aXZlIGZyb20gJy4vX2dldE5hdGl2ZS5qcyc7XG5pbXBvcnQgcm9vdCBmcm9tICcuL19yb290LmpzJztcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIE1hcCA9IGdldE5hdGl2ZShyb290LCAnTWFwJyk7XG5cbmV4cG9ydCBkZWZhdWx0IE1hcDtcbiIsImltcG9ydCBIYXNoIGZyb20gJy4vX0hhc2guanMnO1xuaW1wb3J0IExpc3RDYWNoZSBmcm9tICcuL19MaXN0Q2FjaGUuanMnO1xuaW1wb3J0IE1hcCBmcm9tICcuL19NYXAuanMnO1xuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIG1hcC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUNsZWFyKCkge1xuICB0aGlzLnNpemUgPSAwO1xuICB0aGlzLl9fZGF0YV9fID0ge1xuICAgICdoYXNoJzogbmV3IEhhc2gsXG4gICAgJ21hcCc6IG5ldyAoTWFwIHx8IExpc3RDYWNoZSksXG4gICAgJ3N0cmluZyc6IG5ldyBIYXNoXG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IG1hcENhY2hlQ2xlYXI7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHN1aXRhYmxlIGZvciB1c2UgYXMgdW5pcXVlIG9iamVjdCBrZXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgc3VpdGFibGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNLZXlhYmxlKHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gKHR5cGUgPT0gJ3N0cmluZycgfHwgdHlwZSA9PSAnbnVtYmVyJyB8fCB0eXBlID09ICdzeW1ib2wnIHx8IHR5cGUgPT0gJ2Jvb2xlYW4nKVxuICAgID8gKHZhbHVlICE9PSAnX19wcm90b19fJylcbiAgICA6ICh2YWx1ZSA9PT0gbnVsbCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzS2V5YWJsZTtcbiIsImltcG9ydCBpc0tleWFibGUgZnJvbSAnLi9faXNLZXlhYmxlLmpzJztcblxuLyoqXG4gKiBHZXRzIHRoZSBkYXRhIGZvciBgbWFwYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG1hcCBUaGUgbWFwIHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUgcmVmZXJlbmNlIGtleS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBtYXAgZGF0YS5cbiAqL1xuZnVuY3Rpb24gZ2V0TWFwRGF0YShtYXAsIGtleSkge1xuICB2YXIgZGF0YSA9IG1hcC5fX2RhdGFfXztcbiAgcmV0dXJuIGlzS2V5YWJsZShrZXkpXG4gICAgPyBkYXRhW3R5cGVvZiBrZXkgPT0gJ3N0cmluZycgPyAnc3RyaW5nJyA6ICdoYXNoJ11cbiAgICA6IGRhdGEubWFwO1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRNYXBEYXRhO1xuIiwiaW1wb3J0IGdldE1hcERhdGEgZnJvbSAnLi9fZ2V0TWFwRGF0YS5qcyc7XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIG1hcC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZURlbGV0ZShrZXkpIHtcbiAgdmFyIHJlc3VsdCA9IGdldE1hcERhdGEodGhpcywga2V5KVsnZGVsZXRlJ10oa2V5KTtcbiAgdGhpcy5zaXplIC09IHJlc3VsdCA/IDEgOiAwO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBtYXBDYWNoZURlbGV0ZTtcbiIsImltcG9ydCBnZXRNYXBEYXRhIGZyb20gJy4vX2dldE1hcERhdGEuanMnO1xuXG4vKipcbiAqIEdldHMgdGhlIG1hcCB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVHZXQoa2V5KSB7XG4gIHJldHVybiBnZXRNYXBEYXRhKHRoaXMsIGtleSkuZ2V0KGtleSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG1hcENhY2hlR2V0O1xuIiwiaW1wb3J0IGdldE1hcERhdGEgZnJvbSAnLi9fZ2V0TWFwRGF0YS5qcyc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgbWFwIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVIYXMoa2V5KSB7XG4gIHJldHVybiBnZXRNYXBEYXRhKHRoaXMsIGtleSkuaGFzKGtleSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG1hcENhY2hlSGFzO1xuIiwiaW1wb3J0IGdldE1hcERhdGEgZnJvbSAnLi9fZ2V0TWFwRGF0YS5qcyc7XG5cbi8qKlxuICogU2V0cyB0aGUgbWFwIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG1hcCBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IGdldE1hcERhdGEodGhpcywga2V5KSxcbiAgICAgIHNpemUgPSBkYXRhLnNpemU7XG5cbiAgZGF0YS5zZXQoa2V5LCB2YWx1ZSk7XG4gIHRoaXMuc2l6ZSArPSBkYXRhLnNpemUgPT0gc2l6ZSA/IDAgOiAxO1xuICByZXR1cm4gdGhpcztcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWFwQ2FjaGVTZXQ7XG4iLCJpbXBvcnQgbWFwQ2FjaGVDbGVhciBmcm9tICcuL19tYXBDYWNoZUNsZWFyLmpzJztcbmltcG9ydCBtYXBDYWNoZURlbGV0ZSBmcm9tICcuL19tYXBDYWNoZURlbGV0ZS5qcyc7XG5pbXBvcnQgbWFwQ2FjaGVHZXQgZnJvbSAnLi9fbWFwQ2FjaGVHZXQuanMnO1xuaW1wb3J0IG1hcENhY2hlSGFzIGZyb20gJy4vX21hcENhY2hlSGFzLmpzJztcbmltcG9ydCBtYXBDYWNoZVNldCBmcm9tICcuL19tYXBDYWNoZVNldC5qcyc7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG1hcCBjYWNoZSBvYmplY3QgdG8gc3RvcmUga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBNYXBDYWNoZShlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBNYXBDYWNoZWAuXG5NYXBDYWNoZS5wcm90b3R5cGUuY2xlYXIgPSBtYXBDYWNoZUNsZWFyO1xuTWFwQ2FjaGUucHJvdG90eXBlWydkZWxldGUnXSA9IG1hcENhY2hlRGVsZXRlO1xuTWFwQ2FjaGUucHJvdG90eXBlLmdldCA9IG1hcENhY2hlR2V0O1xuTWFwQ2FjaGUucHJvdG90eXBlLmhhcyA9IG1hcENhY2hlSGFzO1xuTWFwQ2FjaGUucHJvdG90eXBlLnNldCA9IG1hcENhY2hlU2V0O1xuXG5leHBvcnQgZGVmYXVsdCBNYXBDYWNoZTtcbiIsImltcG9ydCBvdmVyQXJnIGZyb20gJy4vX292ZXJBcmcuanMnO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBnZXRQcm90b3R5cGUgPSBvdmVyQXJnKE9iamVjdC5nZXRQcm90b3R5cGVPZiwgT2JqZWN0KTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0UHJvdG90eXBlO1xuIiwiaW1wb3J0IGJhc2VHZXRUYWcgZnJvbSAnLi9fYmFzZUdldFRhZy5qcyc7XG5pbXBvcnQgZ2V0UHJvdG90eXBlIGZyb20gJy4vX2dldFByb3RvdHlwZS5qcyc7XG5pbXBvcnQgaXNPYmplY3RMaWtlIGZyb20gJy4vaXNPYmplY3RMaWtlLmpzJztcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlLFxuICAgIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZ1bmNUb1N0cmluZyA9IGZ1bmNQcm90by50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqIFVzZWQgdG8gaW5mZXIgdGhlIGBPYmplY3RgIGNvbnN0cnVjdG9yLiAqL1xudmFyIG9iamVjdEN0b3JTdHJpbmcgPSBmdW5jVG9TdHJpbmcuY2FsbChPYmplY3QpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgcGxhaW4gb2JqZWN0LCB0aGF0IGlzLCBhbiBvYmplY3QgY3JlYXRlZCBieSB0aGVcbiAqIGBPYmplY3RgIGNvbnN0cnVjdG9yIG9yIG9uZSB3aXRoIGEgYFtbUHJvdG90eXBlXV1gIG9mIGBudWxsYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuOC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHBsYWluIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiB9XG4gKlxuICogXy5pc1BsYWluT2JqZWN0KG5ldyBGb28pO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzUGxhaW5PYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc1BsYWluT2JqZWN0KHsgJ3gnOiAwLCAneSc6IDAgfSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1BsYWluT2JqZWN0KE9iamVjdC5jcmVhdGUobnVsbCkpO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBpc1BsYWluT2JqZWN0KHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3RMaWtlKHZhbHVlKSB8fCBiYXNlR2V0VGFnKHZhbHVlKSAhPSBvYmplY3RUYWcpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHByb3RvID0gZ2V0UHJvdG90eXBlKHZhbHVlKTtcbiAgaWYgKHByb3RvID09PSBudWxsKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgdmFyIEN0b3IgPSBoYXNPd25Qcm9wZXJ0eS5jYWxsKHByb3RvLCAnY29uc3RydWN0b3InKSAmJiBwcm90by5jb25zdHJ1Y3RvcjtcbiAgcmV0dXJuIHR5cGVvZiBDdG9yID09ICdmdW5jdGlvbicgJiYgQ3RvciBpbnN0YW5jZW9mIEN0b3IgJiZcbiAgICBmdW5jVG9TdHJpbmcuY2FsbChDdG9yKSA9PSBvYmplY3RDdG9yU3RyaW5nO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpc1BsYWluT2JqZWN0O1xuIiwiaW1wb3J0IExpc3RDYWNoZSBmcm9tICcuL19MaXN0Q2FjaGUuanMnO1xuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIHN0YWNrLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIFN0YWNrXG4gKi9cbmZ1bmN0aW9uIHN0YWNrQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBuZXcgTGlzdENhY2hlO1xuICB0aGlzLnNpemUgPSAwO1xufVxuXG5leHBvcnQgZGVmYXVsdCBzdGFja0NsZWFyO1xuIiwiLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgc3RhY2suXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gc3RhY2tEZWxldGUoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIHJlc3VsdCA9IGRhdGFbJ2RlbGV0ZSddKGtleSk7XG5cbiAgdGhpcy5zaXplID0gZGF0YS5zaXplO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBzdGFja0RlbGV0ZTtcbiIsIi8qKlxuICogR2V0cyB0aGUgc3RhY2sgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrR2V0KGtleSkge1xuICByZXR1cm4gdGhpcy5fX2RhdGFfXy5nZXQoa2V5KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgc3RhY2tHZXQ7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBhIHN0YWNrIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gc3RhY2tIYXMoa2V5KSB7XG4gIHJldHVybiB0aGlzLl9fZGF0YV9fLmhhcyhrZXkpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBzdGFja0hhcztcbiIsImltcG9ydCBMaXN0Q2FjaGUgZnJvbSAnLi9fTGlzdENhY2hlLmpzJztcbmltcG9ydCBNYXAgZnJvbSAnLi9fTWFwLmpzJztcbmltcG9ydCBNYXBDYWNoZSBmcm9tICcuL19NYXBDYWNoZS5qcyc7XG5cbi8qKiBVc2VkIGFzIHRoZSBzaXplIHRvIGVuYWJsZSBsYXJnZSBhcnJheSBvcHRpbWl6YXRpb25zLiAqL1xudmFyIExBUkdFX0FSUkFZX1NJWkUgPSAyMDA7XG5cbi8qKlxuICogU2V0cyB0aGUgc3RhY2sgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgc3RhY2sgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICBpZiAoZGF0YSBpbnN0YW5jZW9mIExpc3RDYWNoZSkge1xuICAgIHZhciBwYWlycyA9IGRhdGEuX19kYXRhX187XG4gICAgaWYgKCFNYXAgfHwgKHBhaXJzLmxlbmd0aCA8IExBUkdFX0FSUkFZX1NJWkUgLSAxKSkge1xuICAgICAgcGFpcnMucHVzaChba2V5LCB2YWx1ZV0pO1xuICAgICAgdGhpcy5zaXplID0gKytkYXRhLnNpemU7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgZGF0YSA9IHRoaXMuX19kYXRhX18gPSBuZXcgTWFwQ2FjaGUocGFpcnMpO1xuICB9XG4gIGRhdGEuc2V0KGtleSwgdmFsdWUpO1xuICB0aGlzLnNpemUgPSBkYXRhLnNpemU7XG4gIHJldHVybiB0aGlzO1xufVxuXG5leHBvcnQgZGVmYXVsdCBzdGFja1NldDtcbiIsImltcG9ydCBMaXN0Q2FjaGUgZnJvbSAnLi9fTGlzdENhY2hlLmpzJztcbmltcG9ydCBzdGFja0NsZWFyIGZyb20gJy4vX3N0YWNrQ2xlYXIuanMnO1xuaW1wb3J0IHN0YWNrRGVsZXRlIGZyb20gJy4vX3N0YWNrRGVsZXRlLmpzJztcbmltcG9ydCBzdGFja0dldCBmcm9tICcuL19zdGFja0dldC5qcyc7XG5pbXBvcnQgc3RhY2tIYXMgZnJvbSAnLi9fc3RhY2tIYXMuanMnO1xuaW1wb3J0IHN0YWNrU2V0IGZyb20gJy4vX3N0YWNrU2V0LmpzJztcblxuLyoqXG4gKiBDcmVhdGVzIGEgc3RhY2sgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gU3RhY2soZW50cmllcykge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18gPSBuZXcgTGlzdENhY2hlKGVudHJpZXMpO1xuICB0aGlzLnNpemUgPSBkYXRhLnNpemU7XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBTdGFja2AuXG5TdGFjay5wcm90b3R5cGUuY2xlYXIgPSBzdGFja0NsZWFyO1xuU3RhY2sucHJvdG90eXBlWydkZWxldGUnXSA9IHN0YWNrRGVsZXRlO1xuU3RhY2sucHJvdG90eXBlLmdldCA9IHN0YWNrR2V0O1xuU3RhY2sucHJvdG90eXBlLmhhcyA9IHN0YWNrSGFzO1xuU3RhY2sucHJvdG90eXBlLnNldCA9IHN0YWNrU2V0O1xuXG5leHBvcnQgZGVmYXVsdCBTdGFjaztcbiIsImltcG9ydCByb290IGZyb20gJy4vX3Jvb3QuanMnO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGV4cG9ydHNgLiAqL1xudmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSAmJiBleHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAuICovXG52YXIgZnJlZU1vZHVsZSA9IGZyZWVFeHBvcnRzICYmIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlICYmICFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xuXG4vKiogRGV0ZWN0IHRoZSBwb3B1bGFyIENvbW1vbkpTIGV4dGVuc2lvbiBgbW9kdWxlLmV4cG9ydHNgLiAqL1xudmFyIG1vZHVsZUV4cG9ydHMgPSBmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUuZXhwb3J0cyA9PT0gZnJlZUV4cG9ydHM7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIEJ1ZmZlciA9IG1vZHVsZUV4cG9ydHMgPyByb290LkJ1ZmZlciA6IHVuZGVmaW5lZCxcbiAgICBhbGxvY1Vuc2FmZSA9IEJ1ZmZlciA/IEJ1ZmZlci5hbGxvY1Vuc2FmZSA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgIGBidWZmZXJgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0J1ZmZlcn0gYnVmZmVyIFRoZSBidWZmZXIgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXBdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuICogQHJldHVybnMge0J1ZmZlcn0gUmV0dXJucyB0aGUgY2xvbmVkIGJ1ZmZlci5cbiAqL1xuZnVuY3Rpb24gY2xvbmVCdWZmZXIoYnVmZmVyLCBpc0RlZXApIHtcbiAgaWYgKGlzRGVlcCkge1xuICAgIHJldHVybiBidWZmZXIuc2xpY2UoKTtcbiAgfVxuICB2YXIgbGVuZ3RoID0gYnVmZmVyLmxlbmd0aCxcbiAgICAgIHJlc3VsdCA9IGFsbG9jVW5zYWZlID8gYWxsb2NVbnNhZmUobGVuZ3RoKSA6IG5ldyBidWZmZXIuY29uc3RydWN0b3IobGVuZ3RoKTtcblxuICBidWZmZXIuY29weShyZXN1bHQpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbG9uZUJ1ZmZlcjtcbiIsImltcG9ydCByb290IGZyb20gJy4vX3Jvb3QuanMnO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBVaW50OEFycmF5ID0gcm9vdC5VaW50OEFycmF5O1xuXG5leHBvcnQgZGVmYXVsdCBVaW50OEFycmF5O1xuIiwiaW1wb3J0IFVpbnQ4QXJyYXkgZnJvbSAnLi9fVWludDhBcnJheS5qcyc7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIGBhcnJheUJ1ZmZlcmAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXlCdWZmZXJ9IGFycmF5QnVmZmVyIFRoZSBhcnJheSBidWZmZXIgdG8gY2xvbmUuXG4gKiBAcmV0dXJucyB7QXJyYXlCdWZmZXJ9IFJldHVybnMgdGhlIGNsb25lZCBhcnJheSBidWZmZXIuXG4gKi9cbmZ1bmN0aW9uIGNsb25lQXJyYXlCdWZmZXIoYXJyYXlCdWZmZXIpIHtcbiAgdmFyIHJlc3VsdCA9IG5ldyBhcnJheUJ1ZmZlci5jb25zdHJ1Y3RvcihhcnJheUJ1ZmZlci5ieXRlTGVuZ3RoKTtcbiAgbmV3IFVpbnQ4QXJyYXkocmVzdWx0KS5zZXQobmV3IFVpbnQ4QXJyYXkoYXJyYXlCdWZmZXIpKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xvbmVBcnJheUJ1ZmZlcjtcbiIsImltcG9ydCBjbG9uZUFycmF5QnVmZmVyIGZyb20gJy4vX2Nsb25lQXJyYXlCdWZmZXIuanMnO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgdHlwZWRBcnJheWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSB0eXBlZEFycmF5IFRoZSB0eXBlZCBhcnJheSB0byBjbG9uZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGVlcF0gU3BlY2lmeSBhIGRlZXAgY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjbG9uZWQgdHlwZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGNsb25lVHlwZWRBcnJheSh0eXBlZEFycmF5LCBpc0RlZXApIHtcbiAgdmFyIGJ1ZmZlciA9IGlzRGVlcCA/IGNsb25lQXJyYXlCdWZmZXIodHlwZWRBcnJheS5idWZmZXIpIDogdHlwZWRBcnJheS5idWZmZXI7XG4gIHJldHVybiBuZXcgdHlwZWRBcnJheS5jb25zdHJ1Y3RvcihidWZmZXIsIHR5cGVkQXJyYXkuYnl0ZU9mZnNldCwgdHlwZWRBcnJheS5sZW5ndGgpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbG9uZVR5cGVkQXJyYXk7XG4iLCJpbXBvcnQgYmFzZUNyZWF0ZSBmcm9tICcuL19iYXNlQ3JlYXRlLmpzJztcbmltcG9ydCBnZXRQcm90b3R5cGUgZnJvbSAnLi9fZ2V0UHJvdG90eXBlLmpzJztcbmltcG9ydCBpc1Byb3RvdHlwZSBmcm9tICcuL19pc1Byb3RvdHlwZS5qcyc7XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgYW4gb2JqZWN0IGNsb25lLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBpbml0aWFsaXplZCBjbG9uZS5cbiAqL1xuZnVuY3Rpb24gaW5pdENsb25lT2JqZWN0KG9iamVjdCkge1xuICByZXR1cm4gKHR5cGVvZiBvYmplY3QuY29uc3RydWN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNQcm90b3R5cGUob2JqZWN0KSlcbiAgICA/IGJhc2VDcmVhdGUoZ2V0UHJvdG90eXBlKG9iamVjdCkpXG4gICAgOiB7fTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaW5pdENsb25lT2JqZWN0O1xuIiwiLyoqXG4gKiBDcmVhdGVzIGEgYmFzZSBmdW5jdGlvbiBmb3IgbWV0aG9kcyBsaWtlIGBfLmZvckluYCBhbmQgYF8uZm9yT3duYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtib29sZWFufSBbZnJvbVJpZ2h0XSBTcGVjaWZ5IGl0ZXJhdGluZyBmcm9tIHJpZ2h0IHRvIGxlZnQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBiYXNlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVCYXNlRm9yKGZyb21SaWdodCkge1xuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0LCBpdGVyYXRlZSwga2V5c0Z1bmMpIHtcbiAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgaXRlcmFibGUgPSBPYmplY3Qob2JqZWN0KSxcbiAgICAgICAgcHJvcHMgPSBrZXlzRnVuYyhvYmplY3QpLFxuICAgICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG5cbiAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgIHZhciBrZXkgPSBwcm9wc1tmcm9tUmlnaHQgPyBsZW5ndGggOiArK2luZGV4XTtcbiAgICAgIGlmIChpdGVyYXRlZShpdGVyYWJsZVtrZXldLCBrZXksIGl0ZXJhYmxlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmplY3Q7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUJhc2VGb3I7XG4iLCJpbXBvcnQgY3JlYXRlQmFzZUZvciBmcm9tICcuL19jcmVhdGVCYXNlRm9yLmpzJztcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgYmFzZUZvck93bmAgd2hpY2ggaXRlcmF0ZXMgb3ZlciBgb2JqZWN0YFxuICogcHJvcGVydGllcyByZXR1cm5lZCBieSBga2V5c0Z1bmNgIGFuZCBpbnZva2VzIGBpdGVyYXRlZWAgZm9yIGVhY2ggcHJvcGVydHkuXG4gKiBJdGVyYXRlZSBmdW5jdGlvbnMgbWF5IGV4aXQgaXRlcmF0aW9uIGVhcmx5IGJ5IGV4cGxpY2l0bHkgcmV0dXJuaW5nIGBmYWxzZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHBhcmFtIHtGdW5jdGlvbn0ga2V5c0Z1bmMgVGhlIGZ1bmN0aW9uIHRvIGdldCB0aGUga2V5cyBvZiBgb2JqZWN0YC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbnZhciBiYXNlRm9yID0gY3JlYXRlQmFzZUZvcigpO1xuXG5leHBvcnQgZGVmYXVsdCBiYXNlRm9yO1xuIiwiaW1wb3J0IGJhc2VBc3NpZ25WYWx1ZSBmcm9tICcuL19iYXNlQXNzaWduVmFsdWUuanMnO1xuaW1wb3J0IGVxIGZyb20gJy4vZXEuanMnO1xuXG4vKipcbiAqIFRoaXMgZnVuY3Rpb24gaXMgbGlrZSBgYXNzaWduVmFsdWVgIGV4Y2VwdCB0aGF0IGl0IGRvZXNuJ3QgYXNzaWduXG4gKiBgdW5kZWZpbmVkYCB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGFzc2lnbi5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGFzc2lnbi5cbiAqL1xuZnVuY3Rpb24gYXNzaWduTWVyZ2VWYWx1ZShvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgaWYgKCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmICFlcShvYmplY3Rba2V5XSwgdmFsdWUpKSB8fFxuICAgICAgKHZhbHVlID09PSB1bmRlZmluZWQgJiYgIShrZXkgaW4gb2JqZWN0KSkpIHtcbiAgICBiYXNlQXNzaWduVmFsdWUob2JqZWN0LCBrZXksIHZhbHVlKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBhc3NpZ25NZXJnZVZhbHVlO1xuIiwiaW1wb3J0IGlzQXJyYXlMaWtlIGZyb20gJy4vaXNBcnJheUxpa2UuanMnO1xuaW1wb3J0IGlzT2JqZWN0TGlrZSBmcm9tICcuL2lzT2JqZWN0TGlrZS5qcyc7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5pc0FycmF5TGlrZWAgZXhjZXB0IHRoYXQgaXQgYWxzbyBjaGVja3MgaWYgYHZhbHVlYFxuICogaXMgYW4gb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGFycmF5LWxpa2Ugb2JqZWN0LFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5TGlrZU9iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2VPYmplY3QoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZU9iamVjdCgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheUxpa2VPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlT2JqZWN0KHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGlzQXJyYXlMaWtlKHZhbHVlKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaXNBcnJheUxpa2VPYmplY3Q7XG4iLCIvKipcbiAqIEdldHMgdGhlIHZhbHVlIGF0IGBrZXlgLCB1bmxlc3MgYGtleWAgaXMgXCJfX3Byb3RvX19cIiBvciBcImNvbnN0cnVjdG9yXCIuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHByb3BlcnR5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBzYWZlR2V0KG9iamVjdCwga2V5KSB7XG4gIGlmIChrZXkgPT09ICdjb25zdHJ1Y3RvcicgJiYgdHlwZW9mIG9iamVjdFtrZXldID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGtleSA9PSAnX19wcm90b19fJykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHJldHVybiBvYmplY3Rba2V5XTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgc2FmZUdldDtcbiIsImltcG9ydCBjb3B5T2JqZWN0IGZyb20gJy4vX2NvcHlPYmplY3QuanMnO1xuaW1wb3J0IGtleXNJbiBmcm9tICcuL2tleXNJbi5qcyc7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHBsYWluIG9iamVjdCBmbGF0dGVuaW5nIGluaGVyaXRlZCBlbnVtZXJhYmxlIHN0cmluZ1xuICoga2V5ZWQgcHJvcGVydGllcyBvZiBgdmFsdWVgIHRvIG93biBwcm9wZXJ0aWVzIG9mIHRoZSBwbGFpbiBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgcGxhaW4gb2JqZWN0LlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmFzc2lnbih7ICdhJzogMSB9LCBuZXcgRm9vKTtcbiAqIC8vID0+IHsgJ2EnOiAxLCAnYic6IDIgfVxuICpcbiAqIF8uYXNzaWduKHsgJ2EnOiAxIH0sIF8udG9QbGFpbk9iamVjdChuZXcgRm9vKSk7XG4gKiAvLyA9PiB7ICdhJzogMSwgJ2InOiAyLCAnYyc6IDMgfVxuICovXG5mdW5jdGlvbiB0b1BsYWluT2JqZWN0KHZhbHVlKSB7XG4gIHJldHVybiBjb3B5T2JqZWN0KHZhbHVlLCBrZXlzSW4odmFsdWUpKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdG9QbGFpbk9iamVjdDtcbiIsImltcG9ydCBhc3NpZ25NZXJnZVZhbHVlIGZyb20gJy4vX2Fzc2lnbk1lcmdlVmFsdWUuanMnO1xuaW1wb3J0IGNsb25lQnVmZmVyIGZyb20gJy4vX2Nsb25lQnVmZmVyLmpzJztcbmltcG9ydCBjbG9uZVR5cGVkQXJyYXkgZnJvbSAnLi9fY2xvbmVUeXBlZEFycmF5LmpzJztcbmltcG9ydCBjb3B5QXJyYXkgZnJvbSAnLi9fY29weUFycmF5LmpzJztcbmltcG9ydCBpbml0Q2xvbmVPYmplY3QgZnJvbSAnLi9faW5pdENsb25lT2JqZWN0LmpzJztcbmltcG9ydCBpc0FyZ3VtZW50cyBmcm9tICcuL2lzQXJndW1lbnRzLmpzJztcbmltcG9ydCBpc0FycmF5IGZyb20gJy4vaXNBcnJheS5qcyc7XG5pbXBvcnQgaXNBcnJheUxpa2VPYmplY3QgZnJvbSAnLi9pc0FycmF5TGlrZU9iamVjdC5qcyc7XG5pbXBvcnQgaXNCdWZmZXIgZnJvbSAnLi9pc0J1ZmZlci5qcyc7XG5pbXBvcnQgaXNGdW5jdGlvbiBmcm9tICcuL2lzRnVuY3Rpb24uanMnO1xuaW1wb3J0IGlzT2JqZWN0IGZyb20gJy4vaXNPYmplY3QuanMnO1xuaW1wb3J0IGlzUGxhaW5PYmplY3QgZnJvbSAnLi9pc1BsYWluT2JqZWN0LmpzJztcbmltcG9ydCBpc1R5cGVkQXJyYXkgZnJvbSAnLi9pc1R5cGVkQXJyYXkuanMnO1xuaW1wb3J0IHNhZmVHZXQgZnJvbSAnLi9fc2FmZUdldC5qcyc7XG5pbXBvcnQgdG9QbGFpbk9iamVjdCBmcm9tICcuL3RvUGxhaW5PYmplY3QuanMnO1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZU1lcmdlYCBmb3IgYXJyYXlzIGFuZCBvYmplY3RzIHdoaWNoIHBlcmZvcm1zXG4gKiBkZWVwIG1lcmdlcyBhbmQgdHJhY2tzIHRyYXZlcnNlZCBvYmplY3RzIGVuYWJsaW5nIG9iamVjdHMgd2l0aCBjaXJjdWxhclxuICogcmVmZXJlbmNlcyB0byBiZSBtZXJnZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIHNvdXJjZSBvYmplY3QuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIG1lcmdlLlxuICogQHBhcmFtIHtudW1iZXJ9IHNyY0luZGV4IFRoZSBpbmRleCBvZiBgc291cmNlYC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IG1lcmdlRnVuYyBUaGUgZnVuY3Rpb24gdG8gbWVyZ2UgdmFsdWVzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgYXNzaWduZWQgdmFsdWVzLlxuICogQHBhcmFtIHtPYmplY3R9IFtzdGFja10gVHJhY2tzIHRyYXZlcnNlZCBzb3VyY2UgdmFsdWVzIGFuZCB0aGVpciBtZXJnZWRcbiAqICBjb3VudGVycGFydHMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VNZXJnZURlZXAob2JqZWN0LCBzb3VyY2UsIGtleSwgc3JjSW5kZXgsIG1lcmdlRnVuYywgY3VzdG9taXplciwgc3RhY2spIHtcbiAgdmFyIG9ialZhbHVlID0gc2FmZUdldChvYmplY3QsIGtleSksXG4gICAgICBzcmNWYWx1ZSA9IHNhZmVHZXQoc291cmNlLCBrZXkpLFxuICAgICAgc3RhY2tlZCA9IHN0YWNrLmdldChzcmNWYWx1ZSk7XG5cbiAgaWYgKHN0YWNrZWQpIHtcbiAgICBhc3NpZ25NZXJnZVZhbHVlKG9iamVjdCwga2V5LCBzdGFja2VkKTtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIG5ld1ZhbHVlID0gY3VzdG9taXplclxuICAgID8gY3VzdG9taXplcihvYmpWYWx1ZSwgc3JjVmFsdWUsIChrZXkgKyAnJyksIG9iamVjdCwgc291cmNlLCBzdGFjaylcbiAgICA6IHVuZGVmaW5lZDtcblxuICB2YXIgaXNDb21tb24gPSBuZXdWYWx1ZSA9PT0gdW5kZWZpbmVkO1xuXG4gIGlmIChpc0NvbW1vbikge1xuICAgIHZhciBpc0FyciA9IGlzQXJyYXkoc3JjVmFsdWUpLFxuICAgICAgICBpc0J1ZmYgPSAhaXNBcnIgJiYgaXNCdWZmZXIoc3JjVmFsdWUpLFxuICAgICAgICBpc1R5cGVkID0gIWlzQXJyICYmICFpc0J1ZmYgJiYgaXNUeXBlZEFycmF5KHNyY1ZhbHVlKTtcblxuICAgIG5ld1ZhbHVlID0gc3JjVmFsdWU7XG4gICAgaWYgKGlzQXJyIHx8IGlzQnVmZiB8fCBpc1R5cGVkKSB7XG4gICAgICBpZiAoaXNBcnJheShvYmpWYWx1ZSkpIHtcbiAgICAgICAgbmV3VmFsdWUgPSBvYmpWYWx1ZTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKGlzQXJyYXlMaWtlT2JqZWN0KG9ialZhbHVlKSkge1xuICAgICAgICBuZXdWYWx1ZSA9IGNvcHlBcnJheShvYmpWYWx1ZSk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChpc0J1ZmYpIHtcbiAgICAgICAgaXNDb21tb24gPSBmYWxzZTtcbiAgICAgICAgbmV3VmFsdWUgPSBjbG9uZUJ1ZmZlcihzcmNWYWx1ZSwgdHJ1ZSk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChpc1R5cGVkKSB7XG4gICAgICAgIGlzQ29tbW9uID0gZmFsc2U7XG4gICAgICAgIG5ld1ZhbHVlID0gY2xvbmVUeXBlZEFycmF5KHNyY1ZhbHVlLCB0cnVlKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBuZXdWYWx1ZSA9IFtdO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChpc1BsYWluT2JqZWN0KHNyY1ZhbHVlKSB8fCBpc0FyZ3VtZW50cyhzcmNWYWx1ZSkpIHtcbiAgICAgIG5ld1ZhbHVlID0gb2JqVmFsdWU7XG4gICAgICBpZiAoaXNBcmd1bWVudHMob2JqVmFsdWUpKSB7XG4gICAgICAgIG5ld1ZhbHVlID0gdG9QbGFpbk9iamVjdChvYmpWYWx1ZSk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmICghaXNPYmplY3Qob2JqVmFsdWUpIHx8IGlzRnVuY3Rpb24ob2JqVmFsdWUpKSB7XG4gICAgICAgIG5ld1ZhbHVlID0gaW5pdENsb25lT2JqZWN0KHNyY1ZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBpc0NvbW1vbiA9IGZhbHNlO1xuICAgIH1cbiAgfVxuICBpZiAoaXNDb21tb24pIHtcbiAgICAvLyBSZWN1cnNpdmVseSBtZXJnZSBvYmplY3RzIGFuZCBhcnJheXMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICBzdGFjay5zZXQoc3JjVmFsdWUsIG5ld1ZhbHVlKTtcbiAgICBtZXJnZUZ1bmMobmV3VmFsdWUsIHNyY1ZhbHVlLCBzcmNJbmRleCwgY3VzdG9taXplciwgc3RhY2spO1xuICAgIHN0YWNrWydkZWxldGUnXShzcmNWYWx1ZSk7XG4gIH1cbiAgYXNzaWduTWVyZ2VWYWx1ZShvYmplY3QsIGtleSwgbmV3VmFsdWUpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBiYXNlTWVyZ2VEZWVwO1xuIiwiaW1wb3J0IFN0YWNrIGZyb20gJy4vX1N0YWNrLmpzJztcbmltcG9ydCBhc3NpZ25NZXJnZVZhbHVlIGZyb20gJy4vX2Fzc2lnbk1lcmdlVmFsdWUuanMnO1xuaW1wb3J0IGJhc2VGb3IgZnJvbSAnLi9fYmFzZUZvci5qcyc7XG5pbXBvcnQgYmFzZU1lcmdlRGVlcCBmcm9tICcuL19iYXNlTWVyZ2VEZWVwLmpzJztcbmltcG9ydCBpc09iamVjdCBmcm9tICcuL2lzT2JqZWN0LmpzJztcbmltcG9ydCBrZXlzSW4gZnJvbSAnLi9rZXlzSW4uanMnO1xuaW1wb3J0IHNhZmVHZXQgZnJvbSAnLi9fc2FmZUdldC5qcyc7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ubWVyZ2VgIHdpdGhvdXQgc3VwcG9ydCBmb3IgbXVsdGlwbGUgc291cmNlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgc291cmNlIG9iamVjdC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBzcmNJbmRleCBUaGUgaW5kZXggb2YgYHNvdXJjZWAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBtZXJnZWQgdmFsdWVzLlxuICogQHBhcmFtIHtPYmplY3R9IFtzdGFja10gVHJhY2tzIHRyYXZlcnNlZCBzb3VyY2UgdmFsdWVzIGFuZCB0aGVpciBtZXJnZWRcbiAqICBjb3VudGVycGFydHMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VNZXJnZShvYmplY3QsIHNvdXJjZSwgc3JjSW5kZXgsIGN1c3RvbWl6ZXIsIHN0YWNrKSB7XG4gIGlmIChvYmplY3QgPT09IHNvdXJjZSkge1xuICAgIHJldHVybjtcbiAgfVxuICBiYXNlRm9yKHNvdXJjZSwgZnVuY3Rpb24oc3JjVmFsdWUsIGtleSkge1xuICAgIHN0YWNrIHx8IChzdGFjayA9IG5ldyBTdGFjayk7XG4gICAgaWYgKGlzT2JqZWN0KHNyY1ZhbHVlKSkge1xuICAgICAgYmFzZU1lcmdlRGVlcChvYmplY3QsIHNvdXJjZSwga2V5LCBzcmNJbmRleCwgYmFzZU1lcmdlLCBjdXN0b21pemVyLCBzdGFjayk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFyIG5ld1ZhbHVlID0gY3VzdG9taXplclxuICAgICAgICA/IGN1c3RvbWl6ZXIoc2FmZUdldChvYmplY3QsIGtleSksIHNyY1ZhbHVlLCAoa2V5ICsgJycpLCBvYmplY3QsIHNvdXJjZSwgc3RhY2spXG4gICAgICAgIDogdW5kZWZpbmVkO1xuXG4gICAgICBpZiAobmV3VmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBuZXdWYWx1ZSA9IHNyY1ZhbHVlO1xuICAgICAgfVxuICAgICAgYXNzaWduTWVyZ2VWYWx1ZShvYmplY3QsIGtleSwgbmV3VmFsdWUpO1xuICAgIH1cbiAgfSwga2V5c0luKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYmFzZU1lcmdlO1xuIiwiaW1wb3J0IGJhc2VNZXJnZSBmcm9tICcuL19iYXNlTWVyZ2UuanMnO1xuaW1wb3J0IGlzT2JqZWN0IGZyb20gJy4vaXNPYmplY3QuanMnO1xuXG4vKipcbiAqIFVzZWQgYnkgYF8uZGVmYXVsdHNEZWVwYCB0byBjdXN0b21pemUgaXRzIGBfLm1lcmdlYCB1c2UgdG8gbWVyZ2Ugc291cmNlXG4gKiBvYmplY3RzIGludG8gZGVzdGluYXRpb24gb2JqZWN0cyB0aGF0IGFyZSBwYXNzZWQgdGhydS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSBvYmpWYWx1ZSBUaGUgZGVzdGluYXRpb24gdmFsdWUuXG4gKiBAcGFyYW0geyp9IHNyY1ZhbHVlIFRoZSBzb3VyY2UgdmFsdWUuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIG1lcmdlLlxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgcGFyZW50IG9iamVjdCBvZiBgb2JqVmFsdWVgLlxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgcGFyZW50IG9iamVjdCBvZiBgc3JjVmFsdWVgLlxuICogQHBhcmFtIHtPYmplY3R9IFtzdGFja10gVHJhY2tzIHRyYXZlcnNlZCBzb3VyY2UgdmFsdWVzIGFuZCB0aGVpciBtZXJnZWRcbiAqICBjb3VudGVycGFydHMuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgdmFsdWUgdG8gYXNzaWduLlxuICovXG5mdW5jdGlvbiBjdXN0b21EZWZhdWx0c01lcmdlKG9ialZhbHVlLCBzcmNWYWx1ZSwga2V5LCBvYmplY3QsIHNvdXJjZSwgc3RhY2spIHtcbiAgaWYgKGlzT2JqZWN0KG9ialZhbHVlKSAmJiBpc09iamVjdChzcmNWYWx1ZSkpIHtcbiAgICAvLyBSZWN1cnNpdmVseSBtZXJnZSBvYmplY3RzIGFuZCBhcnJheXMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICBzdGFjay5zZXQoc3JjVmFsdWUsIG9ialZhbHVlKTtcbiAgICBiYXNlTWVyZ2Uob2JqVmFsdWUsIHNyY1ZhbHVlLCB1bmRlZmluZWQsIGN1c3RvbURlZmF1bHRzTWVyZ2UsIHN0YWNrKTtcbiAgICBzdGFja1snZGVsZXRlJ10oc3JjVmFsdWUpO1xuICB9XG4gIHJldHVybiBvYmpWYWx1ZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3VzdG9tRGVmYXVsdHNNZXJnZTtcbiIsImltcG9ydCBiYXNlTWVyZ2UgZnJvbSAnLi9fYmFzZU1lcmdlLmpzJztcbmltcG9ydCBjcmVhdGVBc3NpZ25lciBmcm9tICcuL19jcmVhdGVBc3NpZ25lci5qcyc7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5tZXJnZWAgZXhjZXB0IHRoYXQgaXQgYWNjZXB0cyBgY3VzdG9taXplcmAgd2hpY2hcbiAqIGlzIGludm9rZWQgdG8gcHJvZHVjZSB0aGUgbWVyZ2VkIHZhbHVlcyBvZiB0aGUgZGVzdGluYXRpb24gYW5kIHNvdXJjZVxuICogcHJvcGVydGllcy4gSWYgYGN1c3RvbWl6ZXJgIHJldHVybnMgYHVuZGVmaW5lZGAsIG1lcmdpbmcgaXMgaGFuZGxlZCBieSB0aGVcbiAqIG1ldGhvZCBpbnN0ZWFkLiBUaGUgYGN1c3RvbWl6ZXJgIGlzIGludm9rZWQgd2l0aCBzaXggYXJndW1lbnRzOlxuICogKG9ialZhbHVlLCBzcmNWYWx1ZSwga2V5LCBvYmplY3QsIHNvdXJjZSwgc3RhY2spLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBtdXRhdGVzIGBvYmplY3RgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7Li4uT2JqZWN0fSBzb3VyY2VzIFRoZSBzb3VyY2Ugb2JqZWN0cy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGN1c3RvbWl6ZXIgVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBhc3NpZ25lZCB2YWx1ZXMuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBjdXN0b21pemVyKG9ialZhbHVlLCBzcmNWYWx1ZSkge1xuICogICBpZiAoXy5pc0FycmF5KG9ialZhbHVlKSkge1xuICogICAgIHJldHVybiBvYmpWYWx1ZS5jb25jYXQoc3JjVmFsdWUpO1xuICogICB9XG4gKiB9XG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiBbMV0sICdiJzogWzJdIH07XG4gKiB2YXIgb3RoZXIgPSB7ICdhJzogWzNdLCAnYic6IFs0XSB9O1xuICpcbiAqIF8ubWVyZ2VXaXRoKG9iamVjdCwgb3RoZXIsIGN1c3RvbWl6ZXIpO1xuICogLy8gPT4geyAnYSc6IFsxLCAzXSwgJ2InOiBbMiwgNF0gfVxuICovXG52YXIgbWVyZ2VXaXRoID0gY3JlYXRlQXNzaWduZXIoZnVuY3Rpb24ob2JqZWN0LCBzb3VyY2UsIHNyY0luZGV4LCBjdXN0b21pemVyKSB7XG4gIGJhc2VNZXJnZShvYmplY3QsIHNvdXJjZSwgc3JjSW5kZXgsIGN1c3RvbWl6ZXIpO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IG1lcmdlV2l0aDtcbiIsImltcG9ydCBhcHBseSBmcm9tICcuL19hcHBseS5qcyc7XG5pbXBvcnQgYmFzZVJlc3QgZnJvbSAnLi9fYmFzZVJlc3QuanMnO1xuaW1wb3J0IGN1c3RvbURlZmF1bHRzTWVyZ2UgZnJvbSAnLi9fY3VzdG9tRGVmYXVsdHNNZXJnZS5qcyc7XG5pbXBvcnQgbWVyZ2VXaXRoIGZyb20gJy4vbWVyZ2VXaXRoLmpzJztcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLmRlZmF1bHRzYCBleGNlcHQgdGhhdCBpdCByZWN1cnNpdmVseSBhc3NpZ25zXG4gKiBkZWZhdWx0IHByb3BlcnRpZXMuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIG11dGF0ZXMgYG9iamVjdGAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjEwLjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7Li4uT2JqZWN0fSBbc291cmNlc10gVGhlIHNvdXJjZSBvYmplY3RzLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqIEBzZWUgXy5kZWZhdWx0c1xuICogQGV4YW1wbGVcbiAqXG4gKiBfLmRlZmF1bHRzRGVlcCh7ICdhJzogeyAnYic6IDIgfSB9LCB7ICdhJzogeyAnYic6IDEsICdjJzogMyB9IH0pO1xuICogLy8gPT4geyAnYSc6IHsgJ2InOiAyLCAnYyc6IDMgfSB9XG4gKi9cbnZhciBkZWZhdWx0c0RlZXAgPSBiYXNlUmVzdChmdW5jdGlvbihhcmdzKSB7XG4gIGFyZ3MucHVzaCh1bmRlZmluZWQsIGN1c3RvbURlZmF1bHRzTWVyZ2UpO1xuICByZXR1cm4gYXBwbHkobWVyZ2VXaXRoLCB1bmRlZmluZWQsIGFyZ3MpO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmF1bHRzRGVlcDtcbiIsIi8qKlxuICogUGFydCBvZiBzdGFydGVyIHByb2plY3QuXG4gKlxuICogQGNvcHlyaWdodCAgQ29weXJpZ2h0IChDKSAyMDIxIF9fT1JHQU5JWkFUSU9OX18uXG4gKiBAbGljZW5zZSAgICBfX0xJQ0VOU0VfX1xuICovXG5cbi8vIFRPRE86IFRoaXMgbW9kdWxlIG5vdCBjb21wbGV0ZWQgeWV0IGZvciA0LnhcbmltcG9ydCB7IGRlZmF1bHRzRGVlcCB9IGZyb20gJ2xvZGFzaC1lcyc7XG5cbmNvbnN0IG5vcGUgPSAodmFsdWUsIGVsZSwgZGVwKSA9PiB7XG59O1xuXG4vKipcbiAqIENsYXNzIGluaXQuXG4gKiBAcGFyYW0ge2pRdWVyeX0gICAgICAgICRlbGVtZW50XG4gKiBAcGFyYW0ge2pRdWVyeXxzdHJpbmd9IGRlcGVuZGVudFxuICogQHBhcmFtIHtPYmplY3R9ICAgICAgICBvcHRpb25zXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGlzdERlcGVuZGVudCB7XG4gICR4aHIgPSBudWxsO1xuXG4gIHN0YXRpYyBnZXQgZGVmYXVsdE9wdGlvbnMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFqYXg6IHtcbiAgICAgICAgdXJsOiBudWxsLFxuICAgICAgICB2YWx1ZV9maWVsZDogJ3ZhbHVlJ1xuICAgICAgfSxcbiAgICAgIHNvdXJjZTogbnVsbCxcbiAgICAgIHRleHRfZmllbGQ6ICd0aXRsZScsXG4gICAgICB2YWx1ZV9maWVsZDogJ2lkJyxcbiAgICAgIGZpcnN0X29wdGlvbjogbnVsbCxcbiAgICAgIGRlZmF1bHRfdmFsdWU6IG51bGwsXG4gICAgICBpbml0aWFsX2xvYWQ6IHRydWUsXG4gICAgICBlbXB0eV9tYXJrOiAnX19FTVBUWV9fJyxcbiAgICAgIGhvb2tzOiB7XG4gICAgICAgIGJlZm9yZV9yZXF1ZXN0OiBub3BlLFxuICAgICAgICBhZnRlcl9yZXF1ZXN0OiBub3BlXG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHN0YXRpYyBzZWxlY3QoZWxlbWVudCkge1xuICAgIHJldHVybiB0eXBlb2YgZWxlbWVudCA9PT0gJ3N0cmluZycgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsZW1lbnQpIDogZWxlbWVudDtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQsIGRlcGVuZGVudCwgb3B0aW9ucykge1xuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgdGhpcy5vcHRpb25zID0gZGVmYXVsdHNEZWVwKHt9LCBvcHRpb25zLCB0aGlzLmNvbnN0cnVjdG9yLmRlZmF1bHRPcHRpb25zKTtcbiAgICB0aGlzLmRlcGVuZGVudCA9IHRoaXMuY29uc3RydWN0b3Iuc2VsZWN0KGRlcGVuZGVudCk7XG5cbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuaW5pdGlhbF9sb2FkKSB7XG4gICAgICB0aGlzLmNoYW5nZUxpc3QodGhpcy5kZXBlbmRlbnQudmFsKCksIHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBCaW5kIGV2ZW50cy5cbiAgICovXG4gIGJpbmRFdmVudHMoKSB7XG4gICAgdGhpcy5kZXBlbmRlbnQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGV2ZW50KSA9PiB7XG4gICAgICB0aGlzLmNoYW5nZUxpc3QodGhpcy5jb25zdHJ1Y3Rvci5zZWxlY3QoZXZlbnQuY3VycmVudFRhcmdldCk/LnZhbHVlKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdGhlIGxpc3QgZWxlbWVudHMuXG4gICAqXG4gICAqIEBwYXJhbSB7Kn0gICAgdmFsdWVcbiAgICogQHBhcmFtIHtib29sfSBpbml0aWFsXG4gICAqL1xuICBjaGFuZ2VMaXN0KHZhbHVlLCBpbml0aWFsID0gbnVsbCkge1xuICAgIHZhbHVlID0gdmFsdWUgfHwgdGhpcy5kZXBlbmRlbnQudmFsKCk7XG5cbiAgICAvLyBFbXB0eSBtYXJrXG4gICAgaWYgKHZhbHVlID09PSAnJykge1xuICAgICAgdmFsdWUgPSB0aGlzLm9wdGlvbnMuZW1wdHlfbWFyaztcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmFqYXgudXJsKSB7XG4gICAgICB0aGlzLmFqYXhVcGRhdGUodmFsdWUpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLnNvdXJjZSkge1xuICAgICAgdGhpcy5zb3VyY2VVcGRhdGUodmFsdWUsIGluaXRpYWwpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgbGlzdCBieSBzb3VyY2UuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxuICAgKiBAcGFyYW0ge2Jvb2x9ICAgaW5pdGlhbFxuICAgKi9cbiAgc291cmNlVXBkYXRlKHZhbHVlLCBpbml0aWFsID0gbnVsbCkge1xuICAgIGNvbnN0IHNvdXJjZSA9IHRoaXMub3B0aW9ucy5zb3VyY2U7XG5cbiAgICB0aGlzLmJlZm9yZUhvb2sodmFsdWUsIHRoaXMuZWxlbWVudCwgdGhpcy5kZXBlbmRlbnQpO1xuXG4gICAgaWYgKHNvdXJjZVt2YWx1ZV0pIHtcbiAgICAgIHRoaXMudXBkYXRlTGlzdEVsZW1lbnRzKHNvdXJjZVt2YWx1ZV0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnVwZGF0ZUxpc3RFbGVtZW50cyhbXSk7XG5cbiAgICAgIGlmICghaW5pdGlhbCAmJiB2YWx1ZSAhPT0gJycgJiYgcGFyc2VJbnQodmFsdWUpICE9PSAwKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdMaXN0IGZvciB2YWx1ZTogJyArIHZhbHVlICsgJyBub3QgZm91bmQuJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5hZnRlckhvb2sodmFsdWUsIHRoaXMuZWxlbWVudCwgdGhpcy5kZXBlbmRlbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIERvIGFqYXguXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxuICAgKi9cbiAgYWpheFVwZGF0ZSh2YWx1ZSkge1xuICAgIGNvbnN0IGRhdGEgPSB7fTtcbiAgICBkYXRhW3RoaXMub3B0aW9ucy5hamF4LnZhbHVlX2ZpZWxkXSA9IHZhbHVlO1xuXG4gICAgdGhpcy5iZWZvcmVIb29rKHZhbHVlLCB0aGlzLmVsZW1lbnQsIHRoaXMuZGVwZW5kZW50KTtcblxuICAgIGlmICh0aGlzLiR4aHIpIHtcbiAgICAgIHRoaXMuJHhoci5hYm9ydCgpO1xuICAgICAgdGhpcy4keGhyID0gbnVsbDtcbiAgICB9XG5cbiAgICB0aGlzLiR4aHIgPSB1LiRodHRwLmdldCh0aGlzLm9wdGlvbnMuYWpheC51cmwsIGRhdGEpXG4gICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZUxpc3RFbGVtZW50cyhyZXNwb25zZS5kYXRhKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKHJlc3BvbnNlLm1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICB9KS5mYWlsKGVyciA9PiB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgIH0pLmFsd2F5cygoKSA9PiB7XG4gICAgICAgIHRoaXMuYWZ0ZXJIb29rKHZhbHVlLCB0aGlzLmVsZW1lbnQsIHRoaXMuZGVwZW5kZW50KTtcbiAgICAgICAgdGhpcy4keGhyID0gbnVsbDtcbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBsaXN0IGVsZW1lbnRzLlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5fSBpdGVtc1xuICAgKi9cbiAgdXBkYXRlTGlzdEVsZW1lbnRzKGl0ZW1zKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3QgdGV4dEZpZWxkID0gdGhpcy5vcHRpb25zLnRleHRfZmllbGQ7XG4gICAgY29uc3QgdmFsdWVGaWVsZCA9IHRoaXMub3B0aW9ucy52YWx1ZV9maWVsZDtcbiAgICBzZWxmLmVsZW1lbnQuZW1wdHkoKTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuZmlyc3Rfb3B0aW9uKSB7XG4gICAgICBpdGVtcy51bnNoaWZ0KHt9KTtcbiAgICAgIGl0ZW1zWzBdW3RleHRGaWVsZF0gPSB0aGlzLm9wdGlvbnMuZmlyc3Rfb3B0aW9uW3RleHRGaWVsZF07XG4gICAgICBpdGVtc1swXVt2YWx1ZUZpZWxkXSA9IHRoaXMub3B0aW9ucy5maXJzdF9vcHRpb25bdmFsdWVGaWVsZF07XG4gICAgfVxuXG4gICAgJC5lYWNoKGl0ZW1zLCAoaSwgaXRlbSkgPT4ge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaXRlbSkpIHtcbiAgICAgICAgY29uc3QgZ3JvdXAgPSAkKGA8b3B0Z3JvdXAgbGFiZWw9XCIke2l9XCI+PC9vcHRncm91cD5gKTtcblxuICAgICAgICAkLmVhY2goaXRlbSwgKGssIGNoaWxkKSA9PiB7XG4gICAgICAgICAgdGhpcy5hcHBlbmRPcHRpb25Ubyh7XG4gICAgICAgICAgICB2YWx1ZTogY2hpbGRbdmFsdWVGaWVsZF0sXG4gICAgICAgICAgICB0ZXh0OiBjaGlsZFt0ZXh0RmllbGRdLFxuICAgICAgICAgICAgYXR0cmlidXRlczogY2hpbGQuYXR0cmlidXRlcyxcbiAgICAgICAgICB9LCBncm91cCk7XG4gICAgICAgIH0pXG5cbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZChncm91cCk7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmFwcGVuZE9wdGlvblRvKHtcbiAgICAgICAgdmFsdWU6IGl0ZW1bdmFsdWVGaWVsZF0sXG4gICAgICAgIHRleHQ6IGl0ZW1bdGV4dEZpZWxkXSxcbiAgICAgICAgYXR0cmlidXRlczogaXRlbS5hdHRyaWJ1dGVzLFxuICAgICAgfSwgdGhpcy5lbGVtZW50KTtcbiAgICB9KTtcblxuICAgIHRoaXMuZWxlbWVudC50cmlnZ2VyKCdjaG9zZW46dXBkYXRlZCcpO1xuICAgIHRoaXMuZWxlbWVudC50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgfVxuXG4gIGFwcGVuZE9wdGlvblRvKGl0ZW0sIHBhcmVudCkge1xuICAgIGNvbnN0IHZhbHVlID0gaXRlbS52YWx1ZTtcbiAgICBjb25zdCBvcHRpb24gPSAkKCc8b3B0aW9uPicgKyBpdGVtLnRleHQgKyAnPC9vcHRpb24+Jyk7XG4gICAgb3B0aW9uLmF0dHIoJ3ZhbHVlJywgdmFsdWUpO1xuXG4gICAgaWYgKGl0ZW0uYXR0cmlidXRlcykge1xuICAgICAgJC5lYWNoKGl0ZW0uYXR0cmlidXRlcywgKGluZGV4LCB2YWwpID0+IHtcbiAgICAgICAgb3B0aW9uLmF0dHIoaW5kZXgsIHZhbCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pc1NlbGVjdGVkKHZhbHVlKSkge1xuICAgICAgb3B0aW9uLmF0dHIoJ3NlbGVjdGVkJywgJ3NlbGVjdGVkJyk7XG4gICAgfVxuXG4gICAgcGFyZW50LmFwcGVuZChvcHRpb24pO1xuICB9XG5cbiAgaXNTZWxlY3RlZCh2YWx1ZSkge1xuICAgIGxldCBkZWZhdWx0VmFsdWVzID0gJyc7XG5cbiAgICAvLyBDb252ZXJ0IGFsbCB0eXBlcyB0byBhcnJheVxuICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMub3B0aW9ucy5kZWZhdWx0X3ZhbHVlKSkge1xuICAgICAgZGVmYXVsdFZhbHVlcyA9IHRoaXMub3B0aW9ucy5kZWZhdWx0X3ZhbHVlO1xuICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLmRlZmF1bHRfdmFsdWUgJiYgdHlwZW9mIHRoaXMub3B0aW9ucy5kZWZhdWx0X3ZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgZGVmYXVsdFZhbHVlcyA9IE9iamVjdC5rZXlzKHRoaXMub3B0aW9ucy5kZWZhdWx0X3ZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVmYXVsdFZhbHVlcyA9IFt0aGlzLm9wdGlvbnMuZGVmYXVsdF92YWx1ZV07XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlZmF1bHRWYWx1ZXMuaW5kZXhPZih2YWx1ZSkgIT09IC0xO1xuICB9XG5cbiAgLyoqXG4gICAqIEJlZm9yZSBob29rLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcbiAgICogQHBhcmFtIHtqUXVlcnl9IGVsZW1lbnRcbiAgICogQHBhcmFtIHtqUXVlcnl9IGRlcGVuZGVudFxuICAgKiBAcmV0dXJucyB7Kn1cbiAgICovXG4gIGJlZm9yZUhvb2sodmFsdWUsIGVsZW1lbnQsIGRlcGVuZGVudCkge1xuICAgIGNvbnN0IGJlZm9yZSA9IHRoaXMub3B0aW9ucy5ob29rcy5iZWZvcmVfcmVxdWVzdDtcblxuICAgIHJldHVybiBiZWZvcmUuY2FsbCh0aGlzLCB2YWx1ZSwgZWxlbWVudCwgZGVwZW5kZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZnRlciBob29rLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcbiAgICogQHBhcmFtIHtqUXVlcnl9IGVsZW1lbnRcbiAgICogQHBhcmFtIHtqUXVlcnl9IGRlcGVuZGVudFxuICAgKiBAcmV0dXJucyB7Kn1cbiAgICovXG4gIGFmdGVySG9vayh2YWx1ZSwgZWxlbWVudCwgZGVwZW5kZW50KSB7XG4gICAgY29uc3QgYWZ0ZXIgPSB0aGlzLm9wdGlvbnMuaG9va3MuYWZ0ZXJfcmVxdWVzdDtcblxuICAgIHJldHVybiBhZnRlci5jYWxsKHRoaXMsIHZhbHVlLCBlbGVtZW50LCBkZXBlbmRlbnQpO1xuICB9XG59XG4iXSwibmFtZXMiOlsiZnJlZUdsb2JhbCIsImdsb2JhbCIsIk9iamVjdCIsImZyZWVTZWxmIiwic2VsZiIsInJvb3QiLCJGdW5jdGlvbiIsIlN5bWJvbCIsIm9iamVjdFByb3RvIiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJuYXRpdmVPYmplY3RUb1N0cmluZyIsInRvU3RyaW5nIiwic3ltVG9TdHJpbmdUYWciLCJ0b1N0cmluZ1RhZyIsInVuZGVmaW5lZCIsImdldFJhd1RhZyIsInZhbHVlIiwiaXNPd24iLCJjYWxsIiwidGFnIiwidW5tYXNrZWQiLCJlIiwicmVzdWx0Iiwib2JqZWN0VG9TdHJpbmciLCJudWxsVGFnIiwidW5kZWZpbmVkVGFnIiwiYmFzZUdldFRhZyIsImlzT2JqZWN0TGlrZSIsImlzQXJyYXkiLCJBcnJheSIsImlzT2JqZWN0IiwidHlwZSIsImlkZW50aXR5IiwiYXN5bmNUYWciLCJmdW5jVGFnIiwiZ2VuVGFnIiwicHJveHlUYWciLCJpc0Z1bmN0aW9uIiwiY29yZUpzRGF0YSIsIm1hc2tTcmNLZXkiLCJ1aWQiLCJleGVjIiwia2V5cyIsIklFX1BST1RPIiwiaXNNYXNrZWQiLCJmdW5jIiwiZnVuY1Byb3RvIiwiZnVuY1RvU3RyaW5nIiwidG9Tb3VyY2UiLCJyZVJlZ0V4cENoYXIiLCJyZUlzSG9zdEN0b3IiLCJyZUlzTmF0aXZlIiwiUmVnRXhwIiwicmVwbGFjZSIsImJhc2VJc05hdGl2ZSIsInBhdHRlcm4iLCJ0ZXN0IiwiZ2V0VmFsdWUiLCJvYmplY3QiLCJrZXkiLCJnZXROYXRpdmUiLCJvYmplY3RDcmVhdGUiLCJjcmVhdGUiLCJiYXNlQ3JlYXRlIiwicHJvdG8iLCJhcHBseSIsInRoaXNBcmciLCJhcmdzIiwibGVuZ3RoIiwiY29weUFycmF5Iiwic291cmNlIiwiYXJyYXkiLCJpbmRleCIsIkhPVF9DT1VOVCIsIkhPVF9TUEFOIiwibmF0aXZlTm93IiwiRGF0ZSIsIm5vdyIsInNob3J0T3V0IiwiY291bnQiLCJsYXN0Q2FsbGVkIiwic3RhbXAiLCJyZW1haW5pbmciLCJhcmd1bWVudHMiLCJjb25zdGFudCIsImRlZmluZVByb3BlcnR5IiwiYmFzZVNldFRvU3RyaW5nIiwic3RyaW5nIiwic2V0VG9TdHJpbmciLCJNQVhfU0FGRV9JTlRFR0VSIiwicmVJc1VpbnQiLCJpc0luZGV4IiwiYmFzZUFzc2lnblZhbHVlIiwiZXEiLCJvdGhlciIsImFzc2lnblZhbHVlIiwib2JqVmFsdWUiLCJjb3B5T2JqZWN0IiwicHJvcHMiLCJjdXN0b21pemVyIiwiaXNOZXciLCJuZXdWYWx1ZSIsIm5hdGl2ZU1heCIsIk1hdGgiLCJtYXgiLCJvdmVyUmVzdCIsInN0YXJ0IiwidHJhbnNmb3JtIiwib3RoZXJBcmdzIiwiYmFzZVJlc3QiLCJpc0xlbmd0aCIsImlzQXJyYXlMaWtlIiwiaXNJdGVyYXRlZUNhbGwiLCJjcmVhdGVBc3NpZ25lciIsImFzc2lnbmVyIiwic291cmNlcyIsImd1YXJkIiwiaXNQcm90b3R5cGUiLCJDdG9yIiwiY29uc3RydWN0b3IiLCJiYXNlVGltZXMiLCJuIiwiaXRlcmF0ZWUiLCJhcmdzVGFnIiwiYmFzZUlzQXJndW1lbnRzIiwicHJvcGVydHlJc0VudW1lcmFibGUiLCJpc0FyZ3VtZW50cyIsInN0dWJGYWxzZSIsImZyZWVFeHBvcnRzIiwiZXhwb3J0cyIsIm5vZGVUeXBlIiwiZnJlZU1vZHVsZSIsIm1vZHVsZSIsIm1vZHVsZUV4cG9ydHMiLCJCdWZmZXIiLCJuYXRpdmVJc0J1ZmZlciIsImlzQnVmZmVyIiwiYXJyYXlUYWciLCJib29sVGFnIiwiZGF0ZVRhZyIsImVycm9yVGFnIiwibWFwVGFnIiwibnVtYmVyVGFnIiwib2JqZWN0VGFnIiwicmVnZXhwVGFnIiwic2V0VGFnIiwic3RyaW5nVGFnIiwid2Vha01hcFRhZyIsImFycmF5QnVmZmVyVGFnIiwiZGF0YVZpZXdUYWciLCJmbG9hdDMyVGFnIiwiZmxvYXQ2NFRhZyIsImludDhUYWciLCJpbnQxNlRhZyIsImludDMyVGFnIiwidWludDhUYWciLCJ1aW50OENsYW1wZWRUYWciLCJ1aW50MTZUYWciLCJ1aW50MzJUYWciLCJ0eXBlZEFycmF5VGFncyIsImJhc2VJc1R5cGVkQXJyYXkiLCJiYXNlVW5hcnkiLCJmcmVlUHJvY2VzcyIsInByb2Nlc3MiLCJub2RlVXRpbCIsInR5cGVzIiwicmVxdWlyZSIsImJpbmRpbmciLCJub2RlSXNUeXBlZEFycmF5IiwiaXNUeXBlZEFycmF5IiwiYXJyYXlMaWtlS2V5cyIsImluaGVyaXRlZCIsImlzQXJyIiwiaXNBcmciLCJpc0J1ZmYiLCJpc1R5cGUiLCJza2lwSW5kZXhlcyIsIlN0cmluZyIsInB1c2giLCJvdmVyQXJnIiwiYXJnIiwibmF0aXZlS2V5c0luIiwiYmFzZUtleXNJbiIsImlzUHJvdG8iLCJrZXlzSW4iLCJuYXRpdmVDcmVhdGUiLCJoYXNoQ2xlYXIiLCJfX2RhdGFfXyIsInNpemUiLCJoYXNoRGVsZXRlIiwiaGFzIiwiSEFTSF9VTkRFRklORUQiLCJoYXNoR2V0IiwiZGF0YSIsImhhc2hIYXMiLCJoYXNoU2V0IiwiSGFzaCIsImVudHJpZXMiLCJjbGVhciIsImVudHJ5Iiwic2V0IiwiZ2V0IiwibGlzdENhY2hlQ2xlYXIiLCJhc3NvY0luZGV4T2YiLCJhcnJheVByb3RvIiwic3BsaWNlIiwibGlzdENhY2hlRGVsZXRlIiwibGFzdEluZGV4IiwicG9wIiwibGlzdENhY2hlR2V0IiwibGlzdENhY2hlSGFzIiwibGlzdENhY2hlU2V0IiwiTGlzdENhY2hlIiwiTWFwIiwibWFwQ2FjaGVDbGVhciIsImlzS2V5YWJsZSIsImdldE1hcERhdGEiLCJtYXAiLCJtYXBDYWNoZURlbGV0ZSIsIm1hcENhY2hlR2V0IiwibWFwQ2FjaGVIYXMiLCJtYXBDYWNoZVNldCIsIk1hcENhY2hlIiwiZ2V0UHJvdG90eXBlIiwiZ2V0UHJvdG90eXBlT2YiLCJvYmplY3RDdG9yU3RyaW5nIiwiaXNQbGFpbk9iamVjdCIsInN0YWNrQ2xlYXIiLCJzdGFja0RlbGV0ZSIsInN0YWNrR2V0Iiwic3RhY2tIYXMiLCJMQVJHRV9BUlJBWV9TSVpFIiwic3RhY2tTZXQiLCJwYWlycyIsIlN0YWNrIiwiYWxsb2NVbnNhZmUiLCJjbG9uZUJ1ZmZlciIsImJ1ZmZlciIsImlzRGVlcCIsInNsaWNlIiwiY29weSIsIlVpbnQ4QXJyYXkiLCJjbG9uZUFycmF5QnVmZmVyIiwiYXJyYXlCdWZmZXIiLCJieXRlTGVuZ3RoIiwiY2xvbmVUeXBlZEFycmF5IiwidHlwZWRBcnJheSIsImJ5dGVPZmZzZXQiLCJpbml0Q2xvbmVPYmplY3QiLCJjcmVhdGVCYXNlRm9yIiwiZnJvbVJpZ2h0Iiwia2V5c0Z1bmMiLCJpdGVyYWJsZSIsImJhc2VGb3IiLCJhc3NpZ25NZXJnZVZhbHVlIiwiaXNBcnJheUxpa2VPYmplY3QiLCJzYWZlR2V0IiwidG9QbGFpbk9iamVjdCIsImJhc2VNZXJnZURlZXAiLCJzcmNJbmRleCIsIm1lcmdlRnVuYyIsInN0YWNrIiwic3JjVmFsdWUiLCJzdGFja2VkIiwiaXNDb21tb24iLCJpc1R5cGVkIiwiYmFzZU1lcmdlIiwiY3VzdG9tRGVmYXVsdHNNZXJnZSIsIm1lcmdlV2l0aCIsImRlZmF1bHRzRGVlcCIsIm5vcGUiLCJlbGUiLCJkZXAiLCJMaXN0RGVwZW5kZW50IiwiZWxlbWVudCIsImRlcGVuZGVudCIsIm9wdGlvbnMiLCJkZWZhdWx0T3B0aW9ucyIsInNlbGVjdCIsImJpbmRFdmVudHMiLCJpbml0aWFsX2xvYWQiLCJjaGFuZ2VMaXN0IiwidmFsIiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2ZW50IiwiY3VycmVudFRhcmdldCIsImluaXRpYWwiLCJlbXB0eV9tYXJrIiwiYWpheCIsInVybCIsImFqYXhVcGRhdGUiLCJzb3VyY2VVcGRhdGUiLCJiZWZvcmVIb29rIiwidXBkYXRlTGlzdEVsZW1lbnRzIiwicGFyc2VJbnQiLCJjb25zb2xlIiwibG9nIiwiYWZ0ZXJIb29rIiwidmFsdWVfZmllbGQiLCIkeGhyIiwiYWJvcnQiLCJ1IiwiJGh0dHAiLCJ0aGVuIiwicmVzcG9uc2UiLCJzdWNjZXNzIiwiZXJyb3IiLCJtZXNzYWdlIiwiZmFpbCIsImVyciIsImFsd2F5cyIsIml0ZW1zIiwidGV4dEZpZWxkIiwidGV4dF9maWVsZCIsInZhbHVlRmllbGQiLCJlbXB0eSIsImZpcnN0X29wdGlvbiIsInVuc2hpZnQiLCIkIiwiZWFjaCIsImkiLCJpdGVtIiwiZ3JvdXAiLCJrIiwiY2hpbGQiLCJhcHBlbmRPcHRpb25UbyIsInRleHQiLCJhdHRyaWJ1dGVzIiwiYXBwZW5kIiwidHJpZ2dlciIsInBhcmVudCIsIm9wdGlvbiIsImF0dHIiLCJpc1NlbGVjdGVkIiwiZGVmYXVsdFZhbHVlcyIsImRlZmF1bHRfdmFsdWUiLCJpbmRleE9mIiwiYmVmb3JlIiwiaG9va3MiLCJiZWZvcmVfcmVxdWVzdCIsImFmdGVyIiwiYWZ0ZXJfcmVxdWVzdCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFBQTtFQUNBLElBQUlBLFVBQVUsR0FBRyxRQUFPQyxNQUFQLHlDQUFPQSxNQUFQLE1BQWlCLFFBQWpCLElBQTZCQSxNQUE3QixJQUF1Q0EsTUFBTSxDQUFDQyxNQUFQLEtBQWtCQSxNQUF6RCxJQUFtRUQsTUFBcEY7O0VDQ0E7O0VBQ0EsSUFBSUUsUUFBUSxHQUFHLFFB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