import { a as eq, d as isObjectLike, f as baseGetTag, h as freeGlobal, i as isLength, m as root, n as isArguments, o as defineProperty, r as isArrayLike, t as baseUnary, u as isArray } from "./_baseUnary.js";
//#region ../../../../node_modules/lodash-es/_arrayEach.js
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
	var index = -1, length = array == null ? 0 : array.length;
	while (++index < length) if (iteratee(array[index], index, array) === false) break;
	return array;
}
//#endregion
//#region ../../../../node_modules/lodash-es/_isIndex.js
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;
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
	var type = typeof value;
	length = length == null ? MAX_SAFE_INTEGER : length;
	return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
}
//#endregion
//#region ../../../../node_modules/lodash-es/_baseAssignValue.js
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
	if (key == "__proto__" && defineProperty) defineProperty(object, key, {
		"configurable": true,
		"enumerable": true,
		"value": value,
		"writable": true
	});
	else object[key] = value;
}
//#endregion
//#region ../../../../node_modules/lodash-es/_assignValue.js
/** Used to check objects for own properties. */
var hasOwnProperty$2 = Object.prototype.hasOwnProperty;
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
	if (!(hasOwnProperty$2.call(object, key) && eq(objValue, value)) || value === void 0 && !(key in object)) baseAssignValue(object, key, value);
}
//#endregion
//#region ../../../../node_modules/lodash-es/_copyObject.js
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
	var index = -1, length = props.length;
	while (++index < length) {
		var key = props[index];
		var newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0;
		if (newValue === void 0) newValue = source[key];
		if (isNew) baseAssignValue(object, key, newValue);
		else assignValue(object, key, newValue);
	}
	return object;
}
//#endregion
//#region ../../../../node_modules/lodash-es/_isPrototype.js
/** Used for built-in method references. */
var objectProto = Object.prototype;
/**
* Checks if `value` is likely a prototype object.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
*/
function isPrototype(value) {
	var Ctor = value && value.constructor;
	return value === (typeof Ctor == "function" && Ctor.prototype || objectProto);
}
//#endregion
//#region ../../../../node_modules/lodash-es/_baseTimes.js
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
	var index = -1, result = Array(n);
	while (++index < n) result[index] = iteratee(index);
	return result;
}
//#endregion
//#region ../../../../node_modules/lodash-es/stubFalse.js
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
//#endregion
//#region ../../../../node_modules/lodash-es/isBuffer.js
/** Detect free variable `exports`. */
var freeExports$1 = typeof exports == "object" && exports && !exports.nodeType && exports;
/** Detect free variable `module`. */
var freeModule$1 = freeExports$1 && typeof module == "object" && module && !module.nodeType && module;
/** Built-in value references. */
var Buffer = freeModule$1 && freeModule$1.exports === freeExports$1 ? root.Buffer : void 0;
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
var isBuffer = (Buffer ? Buffer.isBuffer : void 0) || stubFalse;
//#endregion
//#region ../../../../node_modules/lodash-es/_baseIsTypedArray.js
/** `Object#toString` result references. */
var argsTag = "[object Arguments]", arrayTag = "[object Array]", boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", funcTag = "[object Function]", mapTag = "[object Map]", numberTag = "[object Number]", objectTag = "[object Object]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", weakMapTag = "[object WeakMap]";
var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
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
//#endregion
//#region ../../../../node_modules/lodash-es/_nodeUtil.js
/** Detect free variable `exports`. */
var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
/** Detect free variable `process` from Node.js. */
var freeProcess = freeModule && freeModule.exports === freeExports && freeGlobal.process;
/** Used to access faster Node.js helpers. */
var nodeUtil = /* @__PURE__ */ function() {
	try {
		var types = freeModule && freeModule.require && freeModule.require("util").types;
		if (types) return types;
		return freeProcess && freeProcess.binding && freeProcess.binding("util");
	} catch (e) {}
}();
//#endregion
//#region ../../../../node_modules/lodash-es/isTypedArray.js
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
var isTypedArray = nodeIsTypedArray ? /* @__PURE__ */ baseUnary(nodeIsTypedArray) : baseIsTypedArray;
//#endregion
//#region ../../../../node_modules/lodash-es/_arrayLikeKeys.js
/** Used to check objects for own properties. */
var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
/**
* Creates an array of the enumerable property names of the array-like `value`.
*
* @private
* @param {*} value The value to query.
* @param {boolean} inherited Specify returning inherited property names.
* @returns {Array} Returns the array of property names.
*/
function arrayLikeKeys(value, inherited) {
	var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
	for (var key in value) if ((inherited || hasOwnProperty$1.call(value, key)) && !(skipIndexes && (key == "length" || isBuff && (key == "offset" || key == "parent") || isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || isIndex(key, length)))) result.push(key);
	return result;
}
//#endregion
//#region ../../../../node_modules/lodash-es/_overArg.js
/**
* Creates a unary function that invokes `func` with its argument transformed.
*
* @private
* @param {Function} func The function to wrap.
* @param {Function} transform The argument transform.
* @returns {Function} Returns the new function.
*/
function overArg(func, transform) {
	return function(arg) {
		return func(transform(arg));
	};
}
//#endregion
//#region ../../../../node_modules/lodash-es/_nativeKeys.js
var nativeKeys = /* @__PURE__ */ overArg(Object.keys, Object);
//#endregion
//#region ../../../../node_modules/lodash-es/_baseKeys.js
/** Used to check objects for own properties. */
var hasOwnProperty = Object.prototype.hasOwnProperty;
/**
* The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
*
* @private
* @param {Object} object The object to query.
* @returns {Array} Returns the array of property names.
*/
function baseKeys(object) {
	if (!isPrototype(object)) return nativeKeys(object);
	var result = [];
	for (var key in Object(object)) if (hasOwnProperty.call(object, key) && key != "constructor") result.push(key);
	return result;
}
//#endregion
//#region ../../../../node_modules/lodash-es/keys.js
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
//#endregion
//#region ../../../../node_modules/lodash-es/_getPrototype.js
/** Built-in value references. */
var getPrototype = /* @__PURE__ */ overArg(Object.getPrototypeOf, Object);
//#endregion
export { isBuffer as a, assignValue as c, nodeUtil as i, isIndex as l, keys as n, isPrototype as o, arrayLikeKeys as r, copyObject as s, getPrototype as t, arrayEach as u };

//# sourceMappingURL=_getPrototype.js.map