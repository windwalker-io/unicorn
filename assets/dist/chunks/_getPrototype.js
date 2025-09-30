import { f as defineProperty, e as eq, r as root, i as isObjectLike, h as isLength, b as baseGetTag, j as freeGlobal, k as isArguments, a as isArray, d as isArrayLike } from "./isArguments.js";
var MAX_SAFE_INTEGER = 9007199254740991;
var reIsUint = /^(?:0|[1-9]\d*)$/;
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
}
function baseAssignValue(object, key, value) {
  if (key == "__proto__" && defineProperty) {
    defineProperty(object, key, {
      "configurable": true,
      "enumerable": true,
      "value": value,
      "writable": true
    });
  } else {
    object[key] = value;
  }
}
var objectProto$3 = /* @__PURE__ */ (() => Object.prototype)();
var hasOwnProperty$2 = /* @__PURE__ */ (() => objectProto$3.hasOwnProperty)();
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty$2.call(object, key) && eq(objValue, value)) || value === void 0 && !(key in object)) {
    baseAssignValue(object, key, value);
  }
}
var objectProto$2 = /* @__PURE__ */ (() => Object.prototype)();
function isPrototype(value) {
  var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto$2;
  return value === proto;
}
function baseTimes(n, iteratee) {
  var index = -1, result = Array(n);
  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}
function stubFalse() {
  return false;
}
var freeExports$1 = typeof exports == "object" && exports && !/* @__PURE__ */ (() => exports.nodeType)() && exports;
var freeModule$1 = freeExports$1 && typeof module == "object" && module && !/* @__PURE__ */ (() => module.nodeType)() && module;
var moduleExports$1 = freeModule$1 && /* @__PURE__ */ (() => freeModule$1.exports)() === freeExports$1;
var Buffer = moduleExports$1 ? /* @__PURE__ */ (() => root.Buffer)() : void 0;
var nativeIsBuffer = Buffer ? /* @__PURE__ */ (() => Buffer.isBuffer)() : void 0;
var isBuffer = nativeIsBuffer || stubFalse;
var argsTag = "[object Arguments]", arrayTag = "[object Array]", boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", funcTag = "[object Function]", mapTag = "[object Map]", numberTag = "[object Number]", objectTag = "[object Object]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", weakMapTag = "[object WeakMap]";
var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
function baseIsTypedArray(value) {
  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}
var freeExports = typeof exports == "object" && exports && !/* @__PURE__ */ (() => exports.nodeType)() && exports;
var freeModule = freeExports && typeof module == "object" && module && !/* @__PURE__ */ (() => module.nodeType)() && module;
var moduleExports = freeModule && /* @__PURE__ */ (() => freeModule.exports)() === freeExports;
var freeProcess = moduleExports && /* @__PURE__ */ (() => freeGlobal.process)();
var nodeUtil = /* @__PURE__ */ (function() {
  try {
    var types = freeModule && freeModule.require && freeModule.require("util").types;
    if (types) {
      return types;
    }
    return freeProcess && freeProcess.binding && freeProcess.binding("util");
  } catch (e) {
  }
})();
var nodeIsTypedArray = nodeUtil && /* @__PURE__ */ (() => nodeUtil.isTypedArray)();
var isTypedArray = nodeIsTypedArray ? /* @__PURE__ */ baseUnary(nodeIsTypedArray) : baseIsTypedArray;
var objectProto$1 = /* @__PURE__ */ (() => Object.prototype)();
var hasOwnProperty$1 = /* @__PURE__ */ (() => objectProto$1.hasOwnProperty)();
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
  for (var key in value) {
    if ((inherited || hasOwnProperty$1.call(value, key)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
    (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
    isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
    isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}
var nativeKeys = /* @__PURE__ */ overArg(/* @__PURE__ */ (() => Object.keys)(), Object);
var objectProto = /* @__PURE__ */ (() => Object.prototype)();
var hasOwnProperty = /* @__PURE__ */ (() => objectProto.hasOwnProperty)();
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != "constructor") {
      result.push(key);
    }
  }
  return result;
}
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}
var getPrototype = /* @__PURE__ */ overArg(/* @__PURE__ */ (() => Object.getPrototypeOf)(), Object);
export {
  assignValue as a,
  baseAssignValue as b,
  isPrototype as c,
  arrayLikeKeys as d,
  baseUnary as e,
  isBuffer as f,
  getPrototype as g,
  isIndex as i,
  keys as k,
  nodeUtil as n
};
//# sourceMappingURL=_getPrototype.js.map
