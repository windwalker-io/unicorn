import { n as removeData, t as data } from "./data.js";
import { c as module, d as selectOne, o as html, u as selectAll } from "./dom.js";
import { t as AlertAdapter } from "./alert-adapter.js";
import { n as useStack } from "./useStack.js";
import { a as nextTick } from "./helper.js";
import { i as useImport, n as useCssImport } from "./loader.js";
//#region src/service/animate.ts
function animateTo(element, styles, options = {}) {
	element = selectOne(element);
	const currentStyles = window.getComputedStyle(element);
	const transitions = {};
	for (const name in styles) {
		const value = styles[name];
		transitions[name] = Array.isArray(value) ? value : [currentStyles.getPropertyValue(name), value];
	}
	if (typeof options === "number") options = { duration: options };
	options = Object.assign({
		duration: 400,
		easing: "linear",
		fill: "both"
	}, options);
	const animation = element.animate(transitions, options);
	animation.addEventListener("finish", () => {
		for (const name in styles) {
			const value = styles[name];
			element.style.setProperty(name, Array.isArray(value) ? value[value.length - 1] : value);
		}
		animation.cancel();
	});
	return animation;
}
//#endregion
//#region ../../../../node_modules/@lyrasoft/ts-toolkit/src/generic/promise.ts
function promiseWithResolvers() {
	let resolve;
	let reject;
	return {
		promise: new Promise((rs, rj) => {
			resolve = rs;
			reject = rj;
		}),
		resolve,
		reject
	};
}
//#endregion
//#region src/service/ui.ts
var ui;
AlertAdapter.alert = (title, text = "", type = "info") => {
	if (text) title += " | " + text;
	window.alert(title);
	return Promise.resolve();
};
AlertAdapter.confirm = (message, text = "", type = "info") => {
	message = message || "Are you sure?";
	if (text) message += " | " + text;
	return new Promise((resolve) => {
		resolve(window.confirm(message));
	});
};
AlertAdapter.notify = async (title, text, type = "log") => {
	if (text) title += " | " + text;
	return ui.theme?.renderMessage(title, type) ?? (() => null);
};
AlertAdapter.clearNotifies = async () => {
	ui.theme?.clearMessages();
};
AlertAdapter.confirmText = () => "OK";
AlertAdapter.cancelText = () => "Cancel";
AlertAdapter.deleteText = () => "Delete";
function useAlertAdapter(config) {
	if (config) Object.assign(AlertAdapter, config);
	return AlertAdapter;
}
function useUI(instance) {
	if (instance) ui = instance;
	return ui ??= new UnicornUI();
}
function useUITheme(theme) {
	const ui = useUI();
	if (ui.theme && !theme) return ui.theme;
	if (typeof theme === "function") theme = new theme();
	ui.installTheme(theme);
	return ui.theme;
}
var UnicornUI = class {
	theme;
	static get defaultOptions() {
		return { messageSelector: ".message-wrap" };
	}
	installTheme(theme) {
		this.theme = theme;
	}
};
var prepares = [];
var { promise: alpineLoaded, resolve: alpineResolve } = /* @__PURE__ */ promiseWithResolvers();
async function loadAlpine(callback) {
	if (callback && !window.Alpine) prepares.push(callback);
	const { default: Alpine } = await useImport("@alpinejs");
	if (!window.Alpine) {
		await Promise.all(prepares.map((callback) => Promise.resolve(callback(Alpine))));
		Alpine.start();
		window.Alpine = Alpine;
		alpineResolve(Alpine);
	} else if (callback) await callback(Alpine);
	return Alpine;
}
async function initAlpineComponent(directive) {
	const Alpine = await alpineLoaded;
	await nextTick();
	selectAll(`[${directive}]`, (el) => {
		const code = el.getAttribute(directive) || "";
		el.removeAttribute(directive);
		Alpine.mutateDom(() => {
			el.setAttribute("x-data", code);
		});
		Alpine.initTree(el);
	});
}
/**
* Before Alpine init
*/
async function prepareAlpine(callback) {
	if (window.Alpine) await callback(window.Alpine);
	else prepares.push(callback);
}
async function prepareAlpineDefer(callback) {
	await alpineLoaded;
	await callback(window.Alpine);
}
/**
* Render Messages.
*/
function renderMessage(messages, type = "info") {
	return ui.theme?.renderMessage(messages, type);
}
/**
* Clear messages.
*/
function clearMessages() {
	ui.theme?.clearMessages();
}
async function mark(selector, keyword = "", options = {}) {
	const modules = await useImport("@vendor/mark.js/dist/mark.min.js");
	if (selector != null) new Mark(selector).mark(keyword, options);
	return modules;
}
async function slideUp(target, duration = 300) {
	const ele = selectOne(target);
	if (!ele) return Promise.resolve();
	ele.style.overflow = "hidden";
	const animation = animateTo(ele, {
		height: 0,
		paddingTop: 0,
		paddingBottom: 0
	}, {
		duration,
		easing: "ease-out"
	});
	data(ele, "animation.sliding.up", true);
	const r = await animation.finished;
	if (!data(ele, "animation.sliding.down")) ele.style.display = "none";
	removeData(ele, "animation.sliding.up");
	return r;
}
function slideDown(target, duration = 300, display = "block") {
	const ele = selectOne(target);
	if (!ele) return Promise.resolve();
	data(ele, "animation.sliding.down", true);
	ele.style.display = display;
	ele.style.overflow = "hidden";
	let maxHeight = 0;
	for (const child of Array.from(ele.children)) maxHeight = Math.max(child.offsetHeight, maxHeight);
	const animation = animateTo(ele, { height: [0, maxHeight + "px"] }, {
		duration,
		easing: "ease-out"
	});
	animation.addEventListener("finish", () => {
		ele.style.height = "";
		if (!data(ele, "animation.sliding.up")) ele.style.overflow = "visible";
		removeData(ele, "animation.sliding.down");
	});
	return animation.finished;
}
/**
* slideToggle
*/
function slideToggle(target, duration = 500, display = "block") {
	const ele = selectOne(target);
	if (!ele) return Promise.resolve();
	if (window.getComputedStyle(ele).display === "none") return slideDown(ele, duration, display);
	else return slideUp(ele, duration);
}
async function fadeOut(selector, duration = 500) {
	const el = selectOne(selector);
	if (!el) return;
	const p = await animateTo(el, { opacity: 0 }, {
		duration,
		easing: "ease-out"
	}).finished;
	el.style.display = "none";
	return p;
}
async function fadeIn(selector, duration = 500, display = "block") {
	const el = selectOne(selector);
	if (!el) return;
	el.style.display = "";
	if (window.getComputedStyle(el).display !== display) el.style.display = display;
	return animateTo(el, { opacity: 1 }, {
		duration,
		easing: "ease-out"
	}).finished;
}
async function highlight(selector, color = "#ffff99", duration = 600) {
	const ele = selectOne(selector);
	if (!ele) return;
	duration /= 2;
	const bg = window.getComputedStyle(ele).backgroundColor;
	await animateTo(ele, { backgroundColor: color }, { duration }).finished;
	return animateTo(ele, { backgroundColor: bg }, { duration });
}
/**
* Color Picker.
*/
async function useColorPicker(selector, options = {}) {
	if (options?.theme === "dark") useCssImport("@spectrum/spectrum-dark.min.css");
	else if (!options?.theme) useCssImport("@spectrum/spectrum.min.css");
	const m = await useImport("@spectrum");
	if (typeof options.locale === "string") {
		let ls = options.locale.split("-").map((l) => l.toLowerCase());
		if (ls[0] === ls[1]) ls = [ls];
		ls = ls.join("-");
		try {
			await useImport(`@spectrum/i18n/${ls}.js`);
		} catch (e) {
			console.warn(`Unable to load Spectrum locale "${ls}" (${options.locale})`);
		}
	}
	if (selector) return module(selector, "spectrum", (ele) => Spectrum.getInstance(ele, options));
	return m;
}
function useDisableOnSubmit(formSelector = "#admin-form", buttonSelector = "", options = {}) {
	buttonSelector = buttonSelector || [
		"#admin-toolbar button",
		"#admin-toolbar a",
		formSelector + " .disable-on-submit",
		formSelector + " .js-dos",
		formSelector + " [data-dos]"
	].join(",");
	const iconSelector = options.iconSelector || [
		"[class*=\"fa-\"]",
		"[data-spin]",
		"[data-spinner]"
	].join(",");
	const event = options.event || "submit";
	const spinnerClass = options.spinnerClass || "spinner-border spinner-border-sm";
	const loadingClass = options.loadingCass || "is-uni-loading";
	selectAll(buttonSelector, (button) => {
		button.addEventListener("click", (e) => {
			button.dataset.clicked = "1";
			setTimeout(() => {
				delete button.dataset.clicked;
			}, 1500);
		});
	});
	const form = selectOne(formSelector);
	form?.addEventListener(event, (e) => {
		setTimeout(() => {
			if (!form.checkValidity()) return;
			selectAll(buttonSelector, (button) => {
				button.style.pointerEvents = "none";
				button.setAttribute("disabled", "disabled");
				button.classList.add("disabled");
				if (button.dataset.clicked) makeButtonLoading(button);
			});
			if (e instanceof SubmitEvent && e.submitter) makeButtonLoading(e.submitter);
		}, 0);
	});
	function makeButtonLoading(button) {
		let icon = button.querySelector(iconSelector);
		button.classList.add(loadingClass);
		if (icon) {
			const i = html("<i></i>");
			icon.parentNode?.replaceChild(i, icon);
			i.setAttribute("class", spinnerClass);
		}
	}
}
function useDisableIfStackNotEmpty(buttonSelector = "[data-task=save]", stackName = "uploading") {
	useStack(stackName).observe((stack, length) => {
		for (const button of selectAll(buttonSelector)) if (length > 0) {
			button.setAttribute("disabled", "disabled");
			button.classList.add("disabled");
		} else {
			button.removeAttribute("disabled");
			button.classList.remove("disabled");
		}
	});
}
/**
* Keep alive.
*/
function useKeepAlive(url, time = 6e4) {
	const aliveHandle = window.setInterval(() => fetch(url), time);
	return () => {
		clearInterval(aliveHandle);
	};
}
/**
* Vue component field.
*/
async function useVueComponentField(selector, value, options = {}) {
	const m = await useImport("@unicorn/field/vue-component-field.js");
	if (selector) m.VueComponentField.init(selector, value, options);
	return m;
}
//#endregion
export { promiseWithResolvers as C, useVueComponentField as S, useDisableIfStackNotEmpty as _, highlight as a, useUI as b, mark as c, renderMessage as d, slideDown as f, useColorPicker as g, useAlertAdapter as h, fadeOut as i, prepareAlpine as l, slideUp as m, clearMessages as n, initAlpineComponent as o, slideToggle as p, fadeIn as r, loadAlpine as s, UnicornUI as t, prepareAlpineDefer as u, useDisableOnSubmit as v, animateTo as w, useUITheme as x, useKeepAlive as y };

//# sourceMappingURL=ui.js.map