import { n as removeData, r as defData } from "./data.js";
//#region src/service/dom.ts
/**
* @see https://stackoverflow.com/a/9899701
*/
function domready(callback) {
	let promise = new Promise((resolve) => {
		if (document.readyState === "complete" || document.readyState === "interactive") setTimeout(resolve, 0);
		else document.addEventListener("DOMContentLoaded", () => resolve());
	});
	if (callback) promise = promise.then(callback);
	return promise;
}
function selectOne(ele) {
	let r;
	if (typeof ele === "string") r = document.querySelector(ele);
	else r = ele;
	if (!r) return r;
	return r;
}
function selectAll(ele, callback = void 0) {
	if (typeof ele === "string") ele = document.querySelectorAll(ele);
	const resultSet = [].slice.call(ele);
	if (callback) return resultSet.map((el) => callback(el) || el);
	return resultSet;
}
function getBoundedInstance(selector, name, callback = () => null) {
	const element = typeof selector === "string" ? document.querySelector(selector) : selector;
	if (!element) return null;
	return defData(element, name, callback);
}
function getBoundedInstanceList(selector, name, callback = () => null) {
	const items = typeof selector === "string" ? document.querySelectorAll(selector) : selector;
	return Array.from(items).map((ele) => getBoundedInstance(ele, name, callback));
}
function removeBoundedInstance(selector, name) {
	const element = typeof selector === "string" ? document.querySelector(selector) : selector;
	if (element) removeData(element, name);
}
function module(ele, name, callback = () => null) {
	if (callback === false) {
		if (typeof ele === "string" || ele instanceof Element) {
			removeBoundedInstance(ele, name);
			return null;
		}
		Array.from(ele).forEach((el) => removeBoundedInstance(el, name));
		return null;
	}
	if (typeof ele === "string") return getBoundedInstanceList(ele, name, callback);
	if (ele instanceof HTMLElement) return getBoundedInstance(ele, name, callback);
	return getBoundedInstanceList(ele, name, callback);
}
function h(element, attrs = {}, content = void 0) {
	const ele = document.createElement(element);
	for (let i in attrs) {
		const v = attrs[i];
		ele.setAttribute(i, v);
	}
	if (content !== null) ele.innerHTML = content;
	return ele;
}
function html(html) {
	const div = document.createElement("div");
	div.innerHTML = html;
	return div.children[0];
}
/**
* Pure JS version of jQuery delegate()
*
* @see https://gist.github.com/iagobruno/4db2ed62dc40fa841bb9a5c7de92f5f8
*/
function delegate(wrapper, selector, eventName, callback) {
	if (typeof selector === "undefined" || selector === "") throw new Error("The provided selector is empty.");
	if (typeof callback === "undefined" || typeof callback !== "function") throw new Error("Please specify an callback.");
	const delegationSelectorsMap = {};
	const wrapperElement = selectOne(wrapper);
	wrapperElement?.addEventListener(eventName, function(event) {
		let element = event.target;
		let forceBreak = false;
		while (element && element !== wrapperElement) {
			for (const selector in delegationSelectorsMap) if (element.matches(selector)) {
				event.stopPropagation = function() {
					forceBreak = true;
				};
				Object.defineProperty(event, "currentTarget", { get() {
					return element;
				} });
				delegationSelectorsMap[selector].forEach(function(callback) {
					callback(event);
				});
			}
			if (forceBreak) break;
			element = element.parentElement;
		}
	});
	if (!delegationSelectorsMap[selector]) delegationSelectorsMap[selector] = [callback];
	else delegationSelectorsMap[selector].push(callback);
	return function unsubscribe() {
		if (!delegationSelectorsMap[selector]) return;
		if (delegationSelectorsMap[selector].length >= 2) delegationSelectorsMap[selector] = delegationSelectorsMap[selector].filter((cb) => cb !== callback);
		else delete delegationSelectorsMap[selector];
	};
}
async function injectCssToDocument(doc, ...css) {
	if (!(doc instanceof Document)) {
		css.push(doc);
		doc = document;
	}
	const promises = [];
	for (let cssItem of css) promises.push(new Promise((resolve, reject) => {
		if (cssItem instanceof CSSStyleSheet) resolve(cssItem);
		else if (typeof cssItem === "string") {
			const style = new CSSStyleSheet();
			style.replace(cssItem).then(() => resolve(style)).catch(reject);
		} else if (typeof cssItem === "function") cssItem().then(({ default: result }) => {
			const style = new CSSStyleSheet();
			style.replace(result).then(() => resolve(style)).catch(reject);
		}).catch(reject);
		else reject(/* @__PURE__ */ new Error("Invalid CSS source"));
	}));
	const styles = await Promise.all(promises);
	doc.adoptedStyleSheets = [...doc.adoptedStyleSheets, ...styles];
	return styles;
}
//#endregion
export { h as a, module as c, selectOne as d, getBoundedInstanceList as i, removeBoundedInstance as l, domready as n, html as o, getBoundedInstance as r, injectCssToDocument as s, delegate as t, selectAll as u };

//# sourceMappingURL=dom.js.map