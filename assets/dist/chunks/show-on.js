import { c as module, d as selectOne, u as selectAll } from "./dom.js";
import { i as fadeOut, r as fadeIn } from "./ui.js";
import { d as isObjectLike, n as isArguments, p as Symbol, r as isArrayLike, t as baseUnary, u as isArray } from "./_baseUnary.js";
import { r as arrayMap, t as baseRest } from "./_baseRest.js";
import { n as MapCache, t as arrayPush } from "./_arrayPush.js";
import { useUniDirective } from "../unicorn.js";
//#region ../../../../node_modules/lodash-es/_baseFindIndex.js
/**
* The base implementation of `_.findIndex` and `_.findLastIndex` without
* support for iteratee shorthands.
*
* @private
* @param {Array} array The array to inspect.
* @param {Function} predicate The function invoked per iteration.
* @param {number} fromIndex The index to search from.
* @param {boolean} [fromRight] Specify iterating from right to left.
* @returns {number} Returns the index of the matched value, else `-1`.
*/
function baseFindIndex(array, predicate, fromIndex, fromRight) {
	var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
	while (fromRight ? index-- : ++index < length) if (predicate(array[index], index, array)) return index;
	return -1;
}
//#endregion
//#region ../../../../node_modules/lodash-es/_baseIsNaN.js
/**
* The base implementation of `_.isNaN` without support for number objects.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
*/
function baseIsNaN(value) {
	return value !== value;
}
//#endregion
//#region ../../../../node_modules/lodash-es/_strictIndexOf.js
/**
* A specialized version of `_.indexOf` which performs strict equality
* comparisons of values, i.e. `===`.
*
* @private
* @param {Array} array The array to inspect.
* @param {*} value The value to search for.
* @param {number} fromIndex The index to search from.
* @returns {number} Returns the index of the matched value, else `-1`.
*/
function strictIndexOf(array, value, fromIndex) {
	var index = fromIndex - 1, length = array.length;
	while (++index < length) if (array[index] === value) return index;
	return -1;
}
//#endregion
//#region ../../../../node_modules/lodash-es/_baseIndexOf.js
/**
* The base implementation of `_.indexOf` without `fromIndex` bounds checks.
*
* @private
* @param {Array} array The array to inspect.
* @param {*} value The value to search for.
* @param {number} fromIndex The index to search from.
* @returns {number} Returns the index of the matched value, else `-1`.
*/
function baseIndexOf(array, value, fromIndex) {
	return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
}
//#endregion
//#region ../../../../node_modules/lodash-es/_arrayIncludes.js
/**
* A specialized version of `_.includes` for arrays without support for
* specifying an index to search from.
*
* @private
* @param {Array} [array] The array to inspect.
* @param {*} target The value to search for.
* @returns {boolean} Returns `true` if `target` is found, else `false`.
*/
function arrayIncludes(array, value) {
	return !!(array == null ? 0 : array.length) && baseIndexOf(array, value, 0) > -1;
}
//#endregion
//#region ../../../../node_modules/lodash-es/_isFlattenable.js
/** Built-in value references. */
var spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : void 0;
/**
* Checks if `value` is a flattenable `arguments` object or array.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
*/
function isFlattenable(value) {
	return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
}
//#endregion
//#region ../../../../node_modules/lodash-es/_baseFlatten.js
/**
* The base implementation of `_.flatten` with support for restricting flattening.
*
* @private
* @param {Array} array The array to flatten.
* @param {number} depth The maximum recursion depth.
* @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
* @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
* @param {Array} [result=[]] The initial result value.
* @returns {Array} Returns the new flattened array.
*/
function baseFlatten(array, depth, predicate, isStrict, result) {
	var index = -1, length = array.length;
	predicate || (predicate = isFlattenable);
	result || (result = []);
	while (++index < length) {
		var value = array[index];
		if (depth > 0 && predicate(value)) if (depth > 1) baseFlatten(value, depth - 1, predicate, isStrict, result);
		else arrayPush(result, value);
		else if (!isStrict) result[result.length] = value;
	}
	return result;
}
//#endregion
//#region ../../../../node_modules/lodash-es/_setCacheAdd.js
/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = "__lodash_hash_undefined__";
/**
* Adds `value` to the array cache.
*
* @private
* @name add
* @memberOf SetCache
* @alias push
* @param {*} value The value to cache.
* @returns {Object} Returns the cache instance.
*/
function setCacheAdd(value) {
	this.__data__.set(value, HASH_UNDEFINED);
	return this;
}
//#endregion
//#region ../../../../node_modules/lodash-es/_setCacheHas.js
/**
* Checks if `value` is in the array cache.
*
* @private
* @name has
* @memberOf SetCache
* @param {*} value The value to search for.
* @returns {boolean} Returns `true` if `value` is found, else `false`.
*/
function setCacheHas(value) {
	return this.__data__.has(value);
}
//#endregion
//#region ../../../../node_modules/lodash-es/_SetCache.js
/**
*
* Creates an array cache object to store unique values.
*
* @private
* @constructor
* @param {Array} [values] The values to cache.
*/
function SetCache(values) {
	var index = -1, length = values == null ? 0 : values.length;
	this.__data__ = new MapCache();
	while (++index < length) this.add(values[index]);
}
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;
//#endregion
//#region ../../../../node_modules/lodash-es/_cacheHas.js
/**
* Checks if a `cache` value for `key` exists.
*
* @private
* @param {Object} cache The cache to query.
* @param {string} key The key of the entry to check.
* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
*/
function cacheHas(cache, key) {
	return cache.has(key);
}
//#endregion
//#region ../../../../node_modules/lodash-es/isArrayLikeObject.js
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
//#endregion
//#region ../../../../node_modules/lodash-es/_arrayIncludesWith.js
/**
* This function is like `arrayIncludes` except that it accepts a comparator.
*
* @private
* @param {Array} [array] The array to inspect.
* @param {*} target The value to search for.
* @param {Function} comparator The comparator invoked per element.
* @returns {boolean} Returns `true` if `target` is found, else `false`.
*/
function arrayIncludesWith(array, value, comparator) {
	var index = -1, length = array == null ? 0 : array.length;
	while (++index < length) if (comparator(value, array[index])) return true;
	return false;
}
//#endregion
//#region ../../../../node_modules/lodash-es/_baseDifference.js
/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;
/**
* The base implementation of methods like `_.difference` without support
* for excluding multiple arrays or iteratee shorthands.
*
* @private
* @param {Array} array The array to inspect.
* @param {Array} values The values to exclude.
* @param {Function} [iteratee] The iteratee invoked per element.
* @param {Function} [comparator] The comparator invoked per element.
* @returns {Array} Returns the new array of filtered values.
*/
function baseDifference(array, values, iteratee, comparator) {
	var index = -1, includes = arrayIncludes, isCommon = true, length = array.length, result = [], valuesLength = values.length;
	if (!length) return result;
	if (iteratee) values = arrayMap(values, baseUnary(iteratee));
	if (comparator) {
		includes = arrayIncludesWith;
		isCommon = false;
	} else if (values.length >= LARGE_ARRAY_SIZE) {
		includes = cacheHas;
		isCommon = false;
		values = new SetCache(values);
	}
	outer: while (++index < length) {
		var value = array[index], computed = iteratee == null ? value : iteratee(value);
		value = comparator || value !== 0 ? value : 0;
		if (isCommon && computed === computed) {
			var valuesIndex = valuesLength;
			while (valuesIndex--) if (values[valuesIndex] === computed) continue outer;
			result.push(value);
		} else if (!includes(values, computed, comparator)) result.push(value);
	}
	return result;
}
//#endregion
//#region ../../../../node_modules/lodash-es/difference.js
/**
* Creates an array of `array` values not included in the other given arrays
* using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
* for equality comparisons. The order and references of result values are
* determined by the first array.
*
* **Note:** Unlike `_.pullAll`, this method returns a new array.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Array
* @param {Array} array The array to inspect.
* @param {...Array} [values] The values to exclude.
* @returns {Array} Returns the new array of filtered values.
* @see _.without, _.xor
* @example
*
* _.difference([2, 1], [2, 3]);
* // => [1]
*/
var difference = /* @__PURE__ */ baseRest(function(array, values) {
	return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true)) : [];
});
//#endregion
//#region src/module/show-on.ts
var ShowOn = class {
	el;
	input;
	conditions = {};
	targets = {};
	defaultReadonly = null;
	initialDisplay;
	constructor(el, conditions) {
		this.el = el;
		this.input = this.el.querySelector(this.el.dataset.inputSelector || "[data-field-input]");
		this.conditions = conditions;
		this.init();
	}
	init() {
		this.initialDisplay = window.getComputedStyle(this.el).display || "block";
		for (const selector in this.conditions) {
			const value = this.conditions[selector];
			const target = selectOne(selector);
			if (this.input) this.defaultReadonly = this.input.hasAttribute("readonly");
			let listenTarget;
			if (target.nodeName === "DIV") listenTarget = Array.from(target.querySelectorAll("input, select, textarea"));
			else listenTarget = [target];
			selectAll(listenTarget, (ele) => {
				ele.addEventListener("change", () => {
					this.updateShowState(target, value);
				});
			});
			this.updateShowState(target, value, 1);
		}
	}
	updateShowState(target, value, duration = 300) {
		const matched = this.isValueMatched(target, value);
		if (matched) setTimeout(() => {
			fadeIn(this.el, duration, this.initialDisplay);
		}, duration);
		else {
			if (this.input) this.defaultReadonly ??= this.input.hasAttribute("readonly");
			fadeOut(this.el, duration);
		}
		if (this.input) if (matched) {
			if (!this.defaultReadonly) this.input.removeAttribute("readonly");
			this.defaultReadonly = null;
		} else this.input.setAttribute("readonly", "readonly");
	}
	isValueMatched(target, value) {
		let targetValue = null;
		switch (this.nodeType(target)) {
			case "input":
			case "textarea":
				targetValue = target.value;
				break;
			case "select":
				if (!target.multiple) targetValue = target.value;
				else targetValue = selectAll(target.querySelectorAll("option")).filter((option) => option.selected).map((option) => option.value);
				break;
			case "checkbox":
				targetValue = target.checked ? target.value : [null, false];
				break;
			case "radio":
				targetValue = target.querySelector("input[type=radio]:checked")?.value;
				break;
		}
		if (Array.isArray(value)) {
			if (Array.isArray(targetValue)) return difference(value, targetValue).length === 0;
			return value.indexOf(targetValue) !== -1;
		}
		if (targetValue && Array.isArray(targetValue)) return targetValue.indexOf(value) !== -1;
		return value == targetValue;
	}
	/**
	* @see https://github.com/nickjackson/val/blob/master/index.js#L55
	* @param el
	* @returns {string}
	*/
	nodeType(el) {
		var node = el.nodeName.toLowerCase();
		var type = el.type;
		if (node === "select") return "select";
		if (node === "textarea") return "textarea";
		if (node === "input") {
			if (type === "checkbox") return "checkbox";
			return "input";
		}
		if (node === "div") {
			if (el.querySelector("input[type=radio]")) return "radio";
		}
		return "input";
	}
};
var ready = /* @__PURE__ */ useUniDirective("show-on", { mounted(el, { value }) {
	module(el, "show.on", (el) => {
		return new ShowOn(el, JSON.parse(value));
	});
} });
//#endregion
export { ShowOn, ready };

//# sourceMappingURL=show-on.js.map