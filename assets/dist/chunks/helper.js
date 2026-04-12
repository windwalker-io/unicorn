import { t as data } from "./data.js";
//#region src/service/helper.ts
function forceArray(item) {
	if (Array.isArray(item)) return item;
	else return [item];
}
function debounce(handler, wait = 1) {
	let timer, result;
	return function(...args) {
		clearTimeout(timer);
		timer = setTimeout(() => result = handler.call(this, ...args), wait);
		return result;
	};
}
function throttle(handler, wait = 1) {
	let timer, result;
	return function(...args) {
		if (!timer) return result = handler.call(this, ...args);
		clearTimeout(timer);
		timer = setTimeout(() => timer = void 0, wait);
		return result;
	};
}
function isDebug() {
	return Boolean(data("windwalker.debug"));
}
function nextTick(callback) {
	return Promise.resolve().then(callback ?? (() => null));
}
function wait(...promisee) {
	return Promise.all(promisee);
}
function isError(e) {
	return e instanceof Error;
}
//#endregion
export { nextTick as a, isError as i, forceArray as n, throttle as o, isDebug as r, wait as s, debounce as t };

//# sourceMappingURL=helper.js.map