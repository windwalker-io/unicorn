import { o as defineProperty } from "./_baseUnary.js";
//#region ../../../../node_modules/lodash-es/_arrayMap.js
/**
* A specialized version of `_.map` for arrays without support for iteratee
* shorthands.
*
* @private
* @param {Array} [array] The array to iterate over.
* @param {Function} iteratee The function invoked per iteration.
* @returns {Array} Returns the new mapped array.
*/
function arrayMap(array, iteratee) {
	var index = -1, length = array == null ? 0 : array.length, result = Array(length);
	while (++index < length) result[index] = iteratee(array[index], index, array);
	return result;
}
//#endregion
//#region ../../../../node_modules/lodash-es/identity.js
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
//#endregion
//#region ../../../../node_modules/lodash-es/_apply.js
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
		case 0: return func.call(thisArg);
		case 1: return func.call(thisArg, args[0]);
		case 2: return func.call(thisArg, args[0], args[1]);
		case 3: return func.call(thisArg, args[0], args[1], args[2]);
	}
	return func.apply(thisArg, args);
}
//#endregion
//#region ../../../../node_modules/lodash-es/_shortOut.js
/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800, HOT_SPAN = 16;
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
	var count = 0, lastCalled = 0;
	return function() {
		var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
		lastCalled = stamp;
		if (remaining > 0) {
			if (++count >= HOT_COUNT) return arguments[0];
		} else count = 0;
		return func.apply(void 0, arguments);
	};
}
//#endregion
//#region ../../../../node_modules/lodash-es/constant.js
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
	return function() {
		return value;
	};
}
//#endregion
//#region ../../../../node_modules/lodash-es/_setToString.js
/**
* Sets the `toString` method of `func` to return `string`.
*
* @private
* @param {Function} func The function to modify.
* @param {Function} string The `toString` result.
* @returns {Function} Returns `func`.
*/
var setToString = /* @__PURE__ */ shortOut(!defineProperty ? identity : function(func, string) {
	return defineProperty(func, "toString", {
		"configurable": true,
		"enumerable": false,
		"value": constant(string),
		"writable": true
	});
});
//#endregion
//#region ../../../../node_modules/lodash-es/_overRest.js
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
	start = nativeMax(start === void 0 ? func.length - 1 : start, 0);
	return function() {
		var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array(length);
		while (++index < length) array[index] = args[start + index];
		index = -1;
		var otherArgs = Array(start + 1);
		while (++index < start) otherArgs[index] = args[index];
		otherArgs[start] = transform(array);
		return apply(func, this, otherArgs);
	};
}
//#endregion
//#region ../../../../node_modules/lodash-es/_baseRest.js
/**
* The base implementation of `_.rest` which doesn't validate or coerce arguments.
*
* @private
* @param {Function} func The function to apply a rest parameter to.
* @param {number} [start=func.length-1] The start position of the rest parameter.
* @returns {Function} Returns the new function.
*/
function baseRest(func, start) {
	return setToString(overRest(func, start, identity), func + "");
}
//#endregion
export { apply as n, arrayMap as r, baseRest as t };

//# sourceMappingURL=_baseRest.js.map