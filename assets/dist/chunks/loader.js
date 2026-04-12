import { s as injectCssToDocument } from "./dom.js";
//#region src/service/loader.ts
async function useScriptImport(src, attrs = {}) {
	if (typeof src === "function") src = (await src()).default;
	const script = document.createElement("script");
	script.src = resolveUrl(src);
	for (const key in attrs) script.setAttribute(key, attrs[key]);
	return new Promise((resolve, reject) => {
		script.onload = () => {
			resolve();
			document.body.removeChild(script);
		};
		script.onerror = (e) => {
			reject(e);
			document.body.removeChild(script);
		};
		document.body.appendChild(script);
	});
}
function doImport(src) {
	return import(
		/* @vite-ignore */
		src
);
}
async function useImport(...src) {
	if (src.length === 1) return doImport(src[0]);
	const promises = [];
	src.forEach((link) => {
		promises.push(link instanceof Promise ? link : doImport(link));
	});
	return Promise.all(promises);
}
async function useSeriesImport(...src) {
	const modules = [];
	for (const source of src) {
		if (Array.isArray(source)) {
			const m = await useImport(...source);
			modules.push(m);
			continue;
		}
		const m = await useImport(source);
		modules.push(m);
	}
	return modules;
}
async function useCssIncludes(...hrefs) {
	const promises = hrefs.map((href) => {
		return new Promise((resolve, reject) => {
			resolveSource(href).then((href) => {
				href = resolveUrl(href);
				const link = document.createElement("link");
				link.rel = "stylesheet";
				link.href = href;
				link.onload = () => resolve();
				link.onerror = (e) => reject(e);
				document.head.appendChild(link);
			});
		});
	});
	return Promise.all(promises);
}
var importedSheets = {};
async function useCssImport(...hrefs) {
	return injectCssToDocument(...(await Promise.all(hrefs.map((href) => {
		return new Promise((resolve) => {
			resolveSource(href).then((href) => {
				href = resolveUrl(href);
				if (!importedSheets[href]) importedSheets[href] = simulateCssImport(href);
				resolve(importedSheets[href]);
			});
		});
	}))).map((module) => module.default));
}
async function simulateCssImport(href) {
	const response = await fetch(href);
	if (!response.ok) throw new Error(`Failed to load CSS: ${href}`);
	const cssText = await response.text();
	const sheet = new CSSStyleSheet();
	await sheet.replace(cssText);
	return { default: sheet };
}
var importMap;
function parseImportMap() {
	const importMapScript = document.querySelector("script[type=\"importmap\"]");
	if (importMapScript) try {
		return JSON.parse(importMapScript.textContent || "{}").imports || {};
	} catch (e) {
		console.error("Failed to parse import map:", e);
	}
	return {};
}
function resolveUrl(specifier) {
	importMap ??= parseImportMap();
	for (const [prefix, target] of Object.entries(importMap)) if (specifier === prefix) return target;
	for (const [prefix, target] of Object.entries(importMap)) if (specifier.startsWith(prefix)) return specifier.replace(prefix, target);
	return specifier;
}
async function resolveSource(src) {
	if (typeof src === "function") return (await src()).default;
	return src;
}
//#endregion
export { useScriptImport as a, useImport as i, useCssImport as n, useSeriesImport as o, useCssIncludes as r, doImport as t };

//# sourceMappingURL=loader.js.map