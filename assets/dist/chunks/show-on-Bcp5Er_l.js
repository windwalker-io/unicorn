import { f as useUniDirective, o as module, i as selectOne, p as selectAll, q as fadeIn, r as fadeOut } from "./unicorn-DuXOh8pQ.js";
import { a as arrayPush, M as MapCache } from "./_arrayPush-Ym4XMK2x.js";
import { S as Symbol$1, i as isArray, a as isArguments, b as isObjectLike, c as isArrayLike } from "./isArguments-D7k1ciaJ.js";
import { b as baseRest } from "./_baseRest-CLQ7Kw-5.js";
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length, index = fromIndex + -1;
  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}
function baseIsNaN(value) {
  return value !== value;
}
function strictIndexOf(array, value, fromIndex) {
  var index = fromIndex - 1, length = array.length;
  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}
function baseIndexOf(array, value, fromIndex) {
  return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
}
function arrayIncludes(array, value) {
  var length = array == null ? 0 : array.length;
  return !!length && baseIndexOf(array, value, 0) > -1;
}
var spreadableSymbol = Symbol$1 ? /* @__PURE__ */ (() => Symbol$1.isConcatSpreadable)() : void 0;
function isFlattenable(value) {
  return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
}
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1, length = array.length;
  predicate || (predicate = isFlattenable);
  result || (result = []);
  while (++index < length) {
    var value = array[index];
    if (predicate(value)) {
      {
        arrayPush(result, value);
      }
    }
  }
  return result;
}
var HASH_UNDEFINED = "__lodash_hash_undefined__";
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}
function setCacheHas(value) {
  return this.__data__.has(value);
}
function SetCache(values) {
  var index = -1, length = values == null ? 0 : values.length;
  this.__data__ = new MapCache();
  while (++index < length) {
    this.add(values[index]);
  }
}
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;
function cacheHas(cache, key) {
  return cache.has(key);
}
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}
var LARGE_ARRAY_SIZE = 200;
function baseDifference(array, values, iteratee, comparator) {
  var index = -1, includes = arrayIncludes, isCommon = true, length = array.length, result = [], valuesLength = values.length;
  if (!length) {
    return result;
  }
  if (values.length >= LARGE_ARRAY_SIZE) {
    includes = cacheHas;
    isCommon = false;
    values = new SetCache(values);
  }
  outer:
    while (++index < length) {
      var value = array[index], computed = value;
      value = value !== 0 ? value : 0;
      if (isCommon && computed === computed) {
        var valuesIndex = valuesLength;
        while (valuesIndex--) {
          if (values[valuesIndex] === computed) {
            continue outer;
          }
        }
        result.push(value);
      } else if (!includes(values, computed, comparator)) {
        result.push(value);
      }
    }
  return result;
}
var difference = /* @__PURE__ */ baseRest(function(array, values) {
  return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject)) : [];
});
class ShowOn {
  el = null;
  input = null;
  conditions = {};
  targets = {};
  readonly = false;
  initialDisplay = null;
  constructor(el, conditions) {
    this.el = el;
    this.input = this.el.querySelector(
      this.el.dataset.inputSelector || "[data-field-input]"
    );
    this.conditions = conditions;
    this.init();
  }
  init() {
    this.initialDisplay = window.getComputedStyle(this.el).display || "block";
    for (const selector in this.conditions) {
      const value = this.conditions[selector];
      const target = selectOne(selector);
      if (this.input) {
        this.readonly = this.input.hasAttribute("readonly");
      }
      let listenTarget;
      if (target.nodeName === "DIV") {
        listenTarget = Array.from(target.querySelectorAll("input, select, textarea"));
      } else {
        listenTarget = [target];
      }
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
    if (matched) {
      setTimeout(() => {
        fadeIn(this.el, duration, this.initialDisplay);
      }, duration + 30);
    } else {
      fadeOut(this.el, duration);
    }
    if (this.input) {
      if (matched) {
        this.input.removeAttribute("readonly");
      } else {
        this.input.setAttribute("readonly", "readonly");
      }
    }
  }
  isValueMatched(target, value) {
    let targetValue = null;
    const type = this.nodeType(target);
    switch (type) {
      case "input":
      case "textarea":
        targetValue = target.value;
        break;
      case "select":
        if (!target.multiple) {
          targetValue = target.value;
        } else {
          targetValue = selectAll(target.querySelectorAll("option")).filter((option) => option.selected).map((option) => option.value);
        }
        break;
      case "checkbox":
        targetValue = target.checked ? target.value : null;
        break;
      case "radio":
        targetValue = target.querySelector("input[type=radio]:checked")?.value;
        break;
    }
    if (Array.isArray(value)) {
      if (Array.isArray(targetValue)) {
        return difference(value, targetValue).length === 0;
      }
      return value.indexOf(targetValue) !== -1;
    }
    if (targetValue && Array.isArray(targetValue)) {
      return targetValue.indexOf(value) !== -1;
    }
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
    if (node === "select") {
      return "select";
    }
    if (node === "textarea") {
      return "textarea";
    }
    if (node === "input") {
      if (type === "checkbox") {
        return "checkbox";
      }
      return "input";
    }
    if (node === "div") {
      if (el.querySelector("input[type=radio]")) {
        return "radio";
      }
    }
    return;
  }
}
const ready = /* @__PURE__ */ useUniDirective("show-on", {
  mounted(el, { value }) {
    module(el, "show.on", (el2) => {
      return new ShowOn(el2, JSON.parse(value));
    });
  }
});
export {
  ShowOn,
  ready
};
