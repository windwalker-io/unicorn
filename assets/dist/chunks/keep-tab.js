import { t as mergeDeep } from "./arr.js";
import { c as module, d as selectOne, u as selectAll } from "./dom.js";
import { t as sleep } from "./timing.js";
import { useUniDirective } from "../unicorn.js";
import { Tab } from "bootstrap";
//#region src/bootstrap/keep-tab.ts
var defaultOptions = {
	tabItemSelector: "[data-toggle=tab],[data-bs-toggle=tab],[data-toggle=pill],[data-bs-toggle=pill]",
	delay: 0
};
var KeepTab = class {
	$element;
	tabButtons;
	storageKey = "";
	options;
	constructor(selector, options = {}) {
		options = mergeDeep({}, defaultOptions, options);
		let uid;
		if (typeof selector === "object") uid = options.uid || selector.id;
		else uid = selector;
		const $element = this.$element = selectOne(selector);
		if (!$element) {
			console.warn(`[KeepTab] Element ${selector} not found.`);
			return;
		}
		this.options = options;
		this.$element = $element;
		this.tabButtons = $element.querySelectorAll(this.options.tabItemSelector);
		this.init(uid);
	}
	async init(uid) {
		this.storageKey = "tab-href-" + await this.hashCode(location.href + ":" + uid);
		this.bindEvents();
		await sleep(this.options.delay || 0);
		this.switchTab();
	}
	bindEvents() {
		[].forEach.call(this.tabButtons, (button) => {
			button.addEventListener("click", () => {
				window.localStorage.setItem(this.storageKey, this.getButtonHref(button));
			});
		});
	}
	getButtonHref(button) {
		return button.dataset.bsTarget || button.dataset.target || button.href;
	}
	findTabButtonByHref(href) {
		return selectAll(this.options.tabItemSelector).filter((button) => {
			if (button.href === href) return true;
			if (button.dataset.bsTarget === href) return true;
			return button.dataset.target === href;
		}).shift();
	}
	activateTab(href) {
		const tabTrigger = this.findTabButtonByHref(href);
		if (tabTrigger) {
			if (tabTrigger?.getAttribute("disabled") != null || tabTrigger.classList.contains("disabled")) return;
			Tab.getOrCreateInstance(tabTrigger).show();
		}
	}
	hasTab(href) {
		return this.findTabButtonByHref(href) != null;
	}
	/**
	* Switch tab.
	*
	* @returns {boolean}
	*/
	switchTab() {
		if (localStorage.getItem(this.storageKey)) {
			if (!this.hasTab(localStorage.getItem(this.storageKey) || "")) {
				localStorage.removeItem(this.storageKey);
				return true;
			}
			const tabhref = localStorage.getItem(this.storageKey) || "";
			this.activateTab(tabhref);
		}
	}
	/**
	* Hash code.
	*/
	async hashCode(text) {
		const msgBuffer = new TextEncoder().encode(text);
		const hashBuffer = await globalThis.crypto.subtle.digest("SHA-256", msgBuffer);
		return Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
	}
};
var ready = /* @__PURE__ */ useUniDirective("keeptab", { mounted(el, { value }) {
	const options = JSON.parse(value || "{}");
	module(el, "uni.keeptab", () => new KeepTab(el, options));
} });
//#endregion
export { KeepTab, ready };

//# sourceMappingURL=keep-tab.js.map