// \0rolldown/runtime.js
var __create = /*@__PURE__*/ (() => Object.create)();
var __defProp = /*@__PURE__*/ (() => Object.defineProperty)();
var __getOwnPropDesc = /*@__PURE__*/ (() => Object.getOwnPropertyDescriptor)();
var __getOwnPropNames = /*@__PURE__*/ (() => Object.getOwnPropertyNames)();
var __getProtoOf = /*@__PURE__*/ (() => Object.getPrototypeOf)();
var __hasOwnProp = /*@__PURE__*/ (() => Object.prototype.hasOwnProperty)();
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod, mod.exports), cb = null), mod.exports);
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
export { __toESM as n, __commonJSMin as t };
