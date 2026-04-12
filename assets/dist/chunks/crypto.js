//#region ../../../../node_modules/@lyrasoft/ts-toolkit/src/generic/env.ts
function isNode() {
	return typeof window === "undefined";
}
//#endregion
//#region ../../../../node_modules/@lyrasoft/ts-toolkit/src/generic/crypto.ts
function uid(prefix = "", timebase = false) {
	if (timebase) return prefix + ((performance?.timeOrigin ? Math.round(performance.timeOrigin) : performance.timing.navigationStart) * 1e5 + performance.now() * 100).toString(12) + randomBytesString(4);
	return prefix + randomBytesString(12);
}
function tid(prefix = "") {
	return uid(prefix, true);
}
function randomBytesString(size = 12) {
	if (!isNode() && !globalThis.crypto) return String(Math.floor(Math.random() * size ** 10));
	return Array.from(randomBytes(size)).map((x) => x.toString(16).padStart(2, "0")).join("");
}
function randomBytes(size = 12) {
	const arr = new Uint8Array(size);
	globalThis.crypto.getRandomValues(arr);
	return arr;
}
//#endregion
export { uid as i, randomBytesString as n, tid as r, randomBytes as t };

//# sourceMappingURL=crypto.js.map