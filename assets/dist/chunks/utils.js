import { t as defu } from "./defu.js";
// ../../../../node_modules/@nuxt/ui/dist/runtime/utils/index.js
function pick(data, keys) {
	const result = {};
	for (const key of keys) result[key] = data[key];
	return result;
}
function omit(data, keys) {
	const result = { ...data };
	for (const key of keys) delete result[key];
	return result;
}
function get(object, path, defaultValue) {
	const keys = typeof path === "string" ? path.split(".") : path;
	let result = object;
	for (const key of keys) {
		if (result === void 0 || result === null) return defaultValue;
		result = result[key];
	}
	return result !== void 0 ? result : defaultValue;
}
function looseToNumber(val) {
	const n = Number.parseFloat(val);
	return Number.isNaN(n) ? val : n;
}
function isEmpty(value) {
	if (value == null) return true;
	if (typeof value === "boolean" || typeof value === "number") return false;
	if (typeof value === "string") return value.trim().length === 0;
	if (Array.isArray(value)) return value.length === 0;
	if (value instanceof Map || value instanceof Set) return value.size === 0;
	if (value instanceof Date || value instanceof RegExp || typeof value === "function") return false;
	if (typeof value === "object") {
		for (const _ in value) if (Object.prototype.hasOwnProperty.call(value, _)) return false;
		return true;
	}
	return false;
}
function isArrayOfArray(item) {
	return Array.isArray(item[0]);
}
function mergeClasses(appConfigClass, propClass) {
	if (!appConfigClass && !propClass) return "";
	return [...Array.isArray(appConfigClass) ? appConfigClass : [appConfigClass], propClass].filter(Boolean);
}
function transformUI(ui, uiProp) {
	return Object.entries(ui).reduce((acc, [key, value]) => {
		acc[key] = typeof value === "function" ? value({ class: uiProp?.[key] }) : value;
		return acc;
	}, { ...uiProp || {} });
}
function resolveAs(as, defaults) {
	if (typeof as === "string" || typeof as === "function" || typeof as?.render === "function" || typeof as?.setup === "function") return {
		...defaults,
		root: as
	};
	return defu(as, defaults);
}
export { mergeClasses as a, resolveAs as c, looseToNumber as i, transformUI as l, isArrayOfArray as n, omit as o, isEmpty as r, pick as s, get as t };

//# sourceMappingURL=utils.js.map