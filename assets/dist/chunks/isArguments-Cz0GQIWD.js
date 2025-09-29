var freeGlobal = typeof global == "object" && global && /* @__PURE__ */ (() => global.Object)() === Object && global;
var freeSelf = typeof self == "object" && self && /* @__PURE__ */ (() => self.Object)() === Object && self;
var root = freeGlobal || freeSelf || /* @__PURE__ */ Function("return this")();
var Symbol$1 = /* @__PURE__ */ (() => root.Symbol)();
var objectProto$3 = /* @__PURE__ */ (() => Object.prototype)();
var hasOwnProperty$2 = /* @__PURE__ */ (() => objectProto$3.hasOwnProperty)();
var nativeObjectToString$1 = /* @__PURE__ */ (() => objectProto$3.toString)();
var symToStringTag$1 = Symbol$1 ? /* @__PURE__ */ (() => Symbol$1.toStringTag)() : void 0;
function getRawTag(value) {
  var isOwn = hasOwnProperty$2.call(value, symToStringTag$1), tag = value[symToStringTag$1];
  try {
    value[symToStringTag$1] = void 0;
    var unmasked = true;
  } catch (e) {
  }
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
var objectProto$2 = /* @__PURE__ */ (() => Object.prototype)();
var nativeObjectToString = /* @__PURE__ */ (() => objectProto$2.toString)();
function objectToString(value) {
  return nativeObjectToString.call(value);
}
var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
var symToStringTag = Symbol$1 ? /* @__PURE__ */ (() => Symbol$1.toStringTag)() : void 0;
function baseGetTag(value) {
  if (value == null) {
    return value === void 0 ? undefinedTag : nullTag;
  }
  return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}
function isObjectLike(value) {
  return value != null && typeof value == "object";
}
var isArray = /* @__PURE__ */ (() => Array.isArray)();
function isObject(value) {
  var type = typeof value;
  return value != null && (type == "object" || type == "function");
}
var asyncTag = "[object AsyncFunction]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", proxyTag = "[object Proxy]";
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}
var coreJsData = /* @__PURE__ */ (() => root["__core-js_shared__"])();
var maskSrcKey = /* @__PURE__ */ (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
  return uid ? "Symbol(src)_1." + uid : "";
})();
function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}
var funcProto$1 = /* @__PURE__ */ (() => Function.prototype)();
var funcToString$1 = /* @__PURE__ */ (() => funcProto$1.toString)();
function toSource(func) {
  if (func != null) {
    try {
      return funcToString$1.call(func);
    } catch (e) {
    }
    try {
      return func + "";
    } catch (e) {
    }
  }
  return "";
}
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
var reIsHostCtor = /^\[object .+?Constructor\]$/;
var funcProto = /* @__PURE__ */ (() => Function.prototype)(), objectProto$1 = /* @__PURE__ */ (() => Object.prototype)();
var funcToString = /* @__PURE__ */ (() => funcProto.toString)();
var hasOwnProperty$1 = /* @__PURE__ */ (() => objectProto$1.hasOwnProperty)();
var reIsNative = /* @__PURE__ */ RegExp(
  "^" + /* @__PURE__ */ funcToString.call(hasOwnProperty$1).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}
function getValue(object, key) {
  return object == null ? void 0 : object[key];
}
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : void 0;
}
var defineProperty = /* @__PURE__ */ (function() {
  try {
    var func = getNative(Object, "defineProperty");
    func({}, "", {});
    return func;
  } catch (e) {
  }
})();
function eq(value, other) {
  return value === other || value !== value && other !== other;
}
var MAX_SAFE_INTEGER = 9007199254740991;
function isLength(value) {
  return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}
var argsTag = "[object Arguments]";
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}
var objectProto = /* @__PURE__ */ (() => Object.prototype)();
var hasOwnProperty = /* @__PURE__ */ (() => objectProto.hasOwnProperty)();
var propertyIsEnumerable = /* @__PURE__ */ (() => objectProto.propertyIsEnumerable)();
var isArguments = /* @__PURE__ */ baseIsArguments(/* @__PURE__ */ (function() {
  return arguments;
})()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
};
export {
  Symbol$1 as S,
  isArray as a,
  baseGetTag as b,
  isObject as c,
  isArrayLike as d,
  eq as e,
  defineProperty as f,
  getNative as g,
  isLength as h,
  isObjectLike as i,
  freeGlobal as j,
  isArguments as k,
  root as r,
  toSource as t
};
