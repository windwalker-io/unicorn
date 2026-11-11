import { n as Mixin, t as EventMixin } from "./chunks/events.js";
import { n as removeData, t as data } from "./chunks/data.js";
import { a as h, c as module, d as selectOne, i as getBoundedInstanceList, l as removeBoundedInstance, n as domready, o as html, r as getBoundedInstance, s as injectCssToDocument, t as delegate, u as selectAll } from "./chunks/dom.js";
import { a as nextTick, c as wait, i as isError, n as forceArray, o as sleep, r as isDebug, s as throttle, t as debounce } from "./chunks/helper.js";
import { t as mergeDeep } from "./chunks/arr.js";
import { n as trans, r as useLang, t as __ } from "./chunks/lang.js";
import { a as parseQuery, i as hasRoute, n as addRoute, o as route, r as buildQuery, t as addQuery } from "./chunks/router.js";
import { AlertAdapter, clearNotifies, deleteConfirm, promiseWithResolvers, queue, randomBytes, randomBytesString, simpleAlert, simpleConfirm, simpleNotify, stack, tid, uid } from "@lyrasoft/ts-toolkit/generic";
// src/service/animate.ts
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
// src/service/crypto.ts
function base64UrlEncode(string) {
	return btoa(String(string)).replace(/\+/, "-").replace(/* @__PURE__ */ new RegExp("\\/"), "_").replace(/=+$/, "");
}
/**
* Base64 URL decode
*/
function base64UrlDecode(string) {
	return atob(String(string).replace(/-/, "+").replace(/_/, "/"));
}
var globalSerial = 1;
function serial() {
	return globalSerial++;
}
// src/service/dom-watcher.ts
function watchAttributes(el, callback) {
	return new AttributeMutationObserver(el, callback);
}
var AttributeMutationObserver = class {
	element;
	callback;
	observer;
	watches = {};
	constructor(element, callback) {
		this.element = element;
		this.callback = callback;
		this.element = element;
		this.observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) if (mutation.type === "attributes") {
				const attrName = mutation.attributeName;
				const target = mutation.target;
				const value = target.getAttribute(attrName);
				this.callback?.(target, attrName, value, mutation.oldValue);
				if (this.watches[attrName]) for (const watch of this.watches[attrName]) watch(target, value, mutation.oldValue);
			}
		});
		this.observe();
	}
	watch(name, callback) {
		this.watches[name] ??= [];
		this.watches[name].push(callback);
		return () => {
			this.watches[name] = this.watches[name].filter((fn) => fn !== callback);
		};
	}
	observe() {
		this.observer.observe(this.element, {
			attributes: true,
			attributeOldValue: true
		});
	}
	disconnect() {
		this.observer.disconnect();
	}
};
// src/service/loader.ts
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
	const styles = (await Promise.all(hrefs.map((href) => {
		return new Promise((resolve) => {
			resolveSource(href).then((href) => {
				href = resolveUrl(href);
				if (!importedSheets[href]) importedSheets[href] = simulateCssImport(href);
				resolve(importedSheets[href]);
			});
		});
	}))).map((module) => module.default);
	return injectCssToDocument(...styles);
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
// src/composable/useUIBootstrap5.ts
async function useUIBootstrap5(install = false, pushToGlobal = false) {
	const { UIBootstrap5 } = await import("./chunks/ui-bootstrap5.js");
	const theme = UIBootstrap5.get();
	if (install) {
		useUITheme(theme);
		if (pushToGlobal) theme.pushBootstrapToGlobal();
	}
	return theme;
}
async function useBs5Tooltip(selector = "[data-bs-toggle=\"tooltip\"]", config = {}) {
	return (await useUIBootstrap5()).tooltip(selector, config);
}
var useBs5KeepTab = async (selector, options = {}) => {
	return (await useUIBootstrap5()).keepTab(selector, options);
};
var useBs5ButtonRadio = async (selector, options = {}) => {
	return (await useUIBootstrap5()).buttonRadio(selector, options);
};
// src/composable/useBsModalAlert.ts
var currentOpenedModals = {};
var defaultOptions = { buttons: ["OK"] };
async function useBsModalAlert(id, options) {
	const { bootstrap: { Modal } } = await useUIBootstrap5();
	let modalElement = void 0;
	if (typeof id !== "string" && !(id instanceof HTMLElement)) {
		options = id;
		id = "uni-modal-alert";
		modalElement = document.getElementById(id);
	} else modalElement = typeof id === "string" ? document.getElementById(id) : id;
	if (!modalElement) {
		modalElement = html(`<div id="${id}" class="uni-modal-alert modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-body text-center p-4"></div>
      <div class="modal-footer"></div>
    </div>
  </div>
</div>`);
		document.body.appendChild(modalElement);
	}
	const bsModal = Modal.getOrCreateInstance(modalElement, options);
	modalElement.addEventListener("show.bs.modal", () => {
		currentOpenedModals[modalElement.id] = instance;
	});
	modalElement.addEventListener("hidden.bs.modal", () => {
		delete currentOpenedModals[modalElement.id];
	});
	const instance = {
		show: async (title, text, icon, options) => {
			if (typeof title === "string") {
				options = options || {};
				options.title = title;
				options.text = text;
				options.icon = icon;
			} else options = title;
			await closeCurrentOpened(modalElement);
			return new Promise((resolve) => {
				prepareModalElement(modalElement, resolve, options);
				bsModal.show(options?.relatedTarget);
			});
		},
		hide: () => {
			bsModal.hide();
		},
		dispose: () => {
			bsModal.dispose();
		},
		toggle: (relatedTarget) => {
			bsModal.toggle(relatedTarget);
		},
		destroy: () => {
			bsModal.dispose();
			modalElement.remove();
		},
		instance: bsModal,
		el: modalElement,
		on: (event, handler) => {
			modalElement.addEventListener(event, handler);
			return () => {
				modalElement.removeEventListener(event, handler);
			};
		},
		off: (event, handler) => {
			modalElement.removeEventListener(event, handler);
		}
	};
	return instance;
}
async function closeCurrentOpened(modalElement) {
	return new Promise((resolve) => {
		let currentOpenedModal = currentOpenedModals[modalElement.id];
		if (!currentOpenedModal) {
			resolve();
			return;
		}
		currentOpenedModal.el.addEventListener("hidden.bs.modal", () => {
			resolve();
		}, { once: true });
		currentOpenedModal.hide();
	});
}
async function prepareModalElement(modalElement, handler, options) {
	options = Object.assign({}, defaultOptions, options || {});
	let header = options.header;
	const content = options.content;
	modalElement.querySelector(".modal-header")?.remove();
	modalElement.querySelector(".modal-body").innerHTML = "";
	modalElement.querySelector(".modal-footer").innerHTML = "";
	modalElement.querySelector(".modal-dialog")?.classList.remove("modal-sm", "modal-lg", "modal-xl", "modal-xxl");
	if (header) {
		if (typeof header === "string") header = `<div class="modal-header">
        <h5 class="modal-title">${header}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>`;
		header = await anyToElement(header);
		modalElement.querySelector(".modal-header")?.remove();
		modalElement.querySelector(".modal-content").insertAdjacentElement("afterbegin", header);
	}
	if (content) {
		let contentElement = await anyToElement(content);
		modalElement.querySelector(".modal-body").appendChild(contentElement);
	} else {
		const title = options.title;
		const text = options.text;
		let icon = options.icon;
		if (icon) {
			if (typeof icon === "string") icon = `<div class="uni-modal-alert__icon text-center mb-3"><span class="${icon}" style="font-size: 64px;"></span></div>`;
			icon = await anyToElement(icon);
			modalElement.querySelector(".modal-body").appendChild(icon);
		}
		if (title) {
			const titleEl = html(`<h4 class="uni-modal-alert__title">${title}</h4>`);
			modalElement.querySelector(".modal-body").appendChild(titleEl);
		}
		if (text) {
			const textEl = html(`<div class="uni-modal-alert__text">${text}</div>`);
			modalElement.querySelector(".modal-body").appendChild(textEl);
		}
	}
	const buttons = options.buttons;
	const { resolve: resolveClosed, promise: valueSelected } = promiseWithResolvers();
	for (const i in buttons) {
		const button = buttons[i];
		const buttonElement = createButton(button, handler, buttons.length === 1 || buttons.length === 2 && Number(i) === 1);
		modalElement.querySelector(".modal-footer").appendChild(await buttonElement);
	}
	if (options.size) modalElement.querySelector(".modal-dialog").classList.add(`modal-${options.size}`);
	if (options.configure) modalElement = options.configure(modalElement) ?? modalElement;
	let isUserDismiss = false;
	let clickListener;
	let keydownListener;
	modalElement.addEventListener("click", clickListener = (e) => {
		const target = e.target;
		if (target.matches(".modal") && target.dataset.bsBackdrop !== "static") isUserDismiss = true;
	}, { capture: true });
	modalElement.addEventListener("keydown", keydownListener = (e) => {
		if (e.key === "Escape") isUserDismiss = true;
	}, { capture: true });
	modalElement.addEventListener("hide.bs.modal", (e) => {
		if (isUserDismiss) handler(void 0);
		modalElement.removeEventListener("click", clickListener);
		modalElement.removeEventListener("keydown", keydownListener);
	}, { once: true });
	return modalElement;
}
async function anyToElement(content) {
	if (typeof content === "function") return content();
	return typeof content === "string" ? html(content) : content;
}
async function createButton(buttonOption, handler, isConfirm) {
	if (typeof buttonOption === "function") return await buttonOption();
	if (typeof buttonOption === "string") buttonOption = {
		text: buttonOption,
		value: isConfirm ?? false,
		class: isConfirm ? "btn btn-primary is-confirm" : "btn btn-outline-secondary",
		styles: isConfirm ? { width: "150px" } : {},
		dismiss: true
	};
	let button;
	if (buttonOption instanceof HTMLElement) button = buttonOption;
	else {
		const { text, class: className = "btn btn-secondary", attrs = {}, styles = {}, dismiss = true, value, href, target, onClick } = buttonOption;
		const tag = href ? "a" : "button";
		const el = document.createElement(tag);
		if (el instanceof HTMLAnchorElement) {
			el.href = href;
			el.target = target || "_self";
		}
		if (el instanceof HTMLButtonElement) el.type = "button";
		el.setAttribute("class", className);
		for (let attr in attrs) el.setAttribute(attr, attrs[attr]);
		for (let style in styles) el.style[style] = styles[style];
		if (dismiss) el.setAttribute("data-bs-dismiss", "modal");
		if (typeof text === "string") el.textContent = text;
		else if (typeof text === "function") text(el);
		el.addEventListener("click", (e) => {
			onClick?.(value, e);
			handler(value);
		});
		button = el;
	}
	return button;
}
// src/composable/useCheckboxesMultiSelect.ts
async function useCheckboxesMultiSelect(selector, options = {}) {
	const m = await import("./chunks/checkboxes-multi-select.js");
	if (selector) m.CheckboxesMultiSelect.handle(selector, options);
	return m;
}
// src/composable/useFieldCascadeSelect.ts
async function useFieldCascadeSelect() {
	const module = await import("./chunks/field-cascade-select.js");
	await module.ready;
	return module;
}
// src/composable/useFieldFileDrag.ts
async function useFieldFileDrag() {
	const module = await import("./chunks/field-file-drag.js");
	await module.ready;
	return module;
}
// src/composable/useFieldFlatpickr.ts
function useFieldFlatpickr() {
	return import("./chunks/field-flatpickr.js");
}
// src/composable/useFieldModalSelect.ts
function useFieldModalSelect() {
	return import("./chunks/field-modal-select.js");
}
// src/composable/useFieldModalTree.ts
function useFieldModalTree() {
	return import("./chunks/field-modal-tree.js");
}
// src/composable/useFieldRepeatable.ts
async function useFieldRepeatable() {
	const module = await import("./chunks/field-repeatable.js");
	await module.ready;
	return module;
}
// src/composable/useFieldSingleImageDrag.ts
async function useFieldSingleImageDrag() {
	const module = await import("./chunks/field-single-image-drag.js");
	await module.ready;
	return module;
}
// src/composable/useForm.ts
var formElement;
function useFormAsync(ele, options = {}) {
	const promise = import("./chunks/form.js").then(({ UnicornFormElement }) => {
		formElement ??= UnicornFormElement;
		return useForm(ele, options);
	});
	return new Proxy({}, { get(target, prop) {
		return (...args) => {
			if (prop === "then" || prop === "catch") return promise[prop].apply(promise, args);
			return promise.then((form) => {
				const p = form[prop];
				if (typeof p === "function") return p.apply(form, args);
				return p;
			});
		};
	} });
}
function useForm(ele, options = {}) {
	if (!formElement) throw new Error("Form module is not loaded. Please use useFormAsync() to load the module before using useForm().");
	if (ele == null) return new formElement(void 0, void 0, options);
	let selector = void 0;
	let el = void 0;
	if (typeof ele === "string") {
		selector = ele;
		el = selectOne(ele) ?? void 0;
	} else el = ele;
	if (!el) return new formElement(selector, el, options);
	return module(el, "unicorn.form", () => new formElement(selector, el, options));
}
async function useFormComponent(ele, options = {}) {
	const form = await useFormAsync(ele, options);
	await form?.initComponent();
	return form;
}
async function useFormSubmit(...args) {
	let options = {};
	if (args.length === 1 && typeof args[0] === "object") options = args[0];
	else if (typeof args[0] === "string" && typeof args[1] === "string") {
		options.method = args[0];
		options.url = args[1];
		options.data = args[2] ?? {};
		options = {
			...options,
			...args[3] ?? {}
		};
	} else if (typeof args[0] === "string") {
		options.url = args[0];
		options.data = args[1] ?? {};
		options = {
			...options,
			...args[2] ?? {}
		};
	}
	return (await useFormAsync(options.form))[options.method?.toLowerCase() || "post"](options.url, options.data);
}
// src/composable/useGrid.ts
var gridElement;
async function useGridAsync(ele, options = {}) {
	await useFormAsync();
	const { UnicornGridElement } = await import("./chunks/grid.js");
	gridElement ??= UnicornGridElement;
	if (!ele) return null;
	return useGrid(ele, options);
}
function useGrid(ele, options = {}) {
	const selector = typeof ele === "string" ? ele : "";
	const element = selectOne(ele);
	if (!element) throw new Error("Element is empty");
	const form = useForm(selector || element);
	if (!form) throw new Error("UnicornGrid is depends on UnicornForm");
	return module(element, "grid.plugin", () => new gridElement(selector, element, form, options));
}
async function useGridComponent(ele, options = {}) {
	const grid = await useGridAsync(ele, options);
	await grid?.initComponent();
	return grid;
}
// src/composable/useHttp.ts
function useHttpClient(config) {
	const promise = import("./chunks/http-client.js").then(({ createHttpClient }) => {
		return createHttpClient(config);
	});
	const data = {
		request: (options) => {
			return promise.then((client) => client.request(options));
		},
		get: (url, options) => {
			return promise.then((client) => client.get(url, options));
		},
		post: (url, data, options) => {
			return promise.then((client) => client.post(url, data, options));
		},
		put: (url, data, options) => {
			return promise.then((client) => client.put(url, data, options));
		},
		patch: (url, data, options) => {
			return promise.then((client) => client.patch(url, data, options));
		},
		delete: (url, data, options) => {
			return promise.then((client) => client.delete(url, data, options));
		},
		head: (url, options) => {
			return promise.then((client) => client.head(url, options));
		},
		options: (url, options) => {
			return promise.then((client) => client.options(url, options));
		},
		isAxiosError(payload) {
			if (payload == null) return false;
			return typeof payload === "object" && payload.isAxiosError === true;
		},
		isCancel(value) {
			return !!(value && value.__CANCEL__);
		},
		http: promise
	};
	Object.assign(data, {
		then: promise.then.bind(promise),
		catch: promise.catch.bind(promise)
	});
	return data;
}
// src/composable/useIframeModal.ts
async function useIframeModal() {
	const module = await import("./chunks/iframe-modal.js");
	await module.ready;
	return module;
}
// src/composable/useListDependent.ts
async function useListDependent(element, dependent, options = {}) {
	const module = await import("./chunks/list-dependent.js");
	await module.ready;
	if (element) {
		const { ListDependent } = module;
		return ListDependent.handle(element, dependent ?? void 0, options);
	}
	return module;
}
// src/composable/useQueue.ts
var queues = {};
function useQueue(name = "default", maxRunning = 1) {
	return queues[name] ??= createQueue(maxRunning);
}
function createQueue(maxRunning = 1) {
	return queue(maxRunning);
}
// src/composable/useS3Uploader.ts
async function useS3Uploader(name, options = {}) {
	const module = await import("./chunks/s3-uploader.js");
	if (!name) return module;
	const { get } = module;
	return get(name, options);
}
async function useS3MultipartUploader(options) {
	const module = await import("./chunks/s3-multipart-uploader.js");
	if (options != null) return new module.S3MultipartUploader(options);
	return module;
}
// src/composable/useShowOn.ts
async function useShowOn() {
	const module = await import("./chunks/show-on.js");
	await module.ready;
	return module;
}
// src/composable/useStack.ts
var stacks = {};
function useStack(name = "default", store = []) {
	return stacks[name] ??= createStack(store);
}
function createStack(store = []) {
	return stack(store);
}
// src/composable/useTomSelect.ts
/**
* @see https://tom-select.js.org/
*/
async function useTomSelect(selector, options = {}, theme = "bootstrap5") {
	const [m] = await wait(useImport("@vendor/tom-select/dist/js/tom-select.complete.min.js"), useCssImport(`@vendor/tom-select/dist/css/tom-select.${theme}.min.css`));
	if (selector) module(selector, "tom.select", (ele) => {
		options = mergeDeep({
			allowEmptyOption: true,
			maxOptions: null,
			plugins: {
				caret_position: {},
				clear_button: {}
			}
		}, options);
		if (ele.multiple) options.plugins.remove_button = {};
		else options.plugins.dropdown_input = {};
		class UnicornTomSelect extends TomSelect {
			syncOptionsWithoutKeepSelected() {
				const oldValue = ele.value;
				this.clear();
				this.clearOptions();
				this.sync();
				if (ele.value !== oldValue) this.setValue(ele.querySelector(`option[value="${oldValue}"]`)?.value ?? ele.querySelector("option")?.value ?? "", true);
			}
		}
		const t = new UnicornTomSelect(ele, options);
		ele.addEventListener("list:updated", () => {
			t.syncOptionsWithoutKeepSelected();
		});
		return t;
	});
	return m;
}
// src/composable/useTinymce.ts
async function useTinymce(selector, options = {}) {
	const module = await import("./chunks/tinymce.js");
	if (selector) return module.get(selector, options);
	return module;
}
async function useTinymceHook(handler) {
	const { addHook } = await import("./chunks/tinymce.js");
	return addHook(handler);
}
// src/composable/useNuxtEditor.ts
async function useNuxtEditor(selector, options = {}) {
	const module = await import("./chunks/nuxt-editor.js");
	if (selector) return module.get(selector, options);
	return module;
}
// src/composable/useUniDirective.ts
var instances = {};
async function useWebDirective(name = "unicorn", options = {}) {
	if (options === false) {
		delete instances[name];
		return;
	}
	return instances[name] ??= await createWebDirective(Object.assign({}, options, { prefix: "uni-" }));
}
async function useUniDirective(name, handler, wdInstance = "unicorn") {
	(typeof wdInstance === "string" ? await useWebDirective(wdInstance) : wdInstance).register(name, handler);
}
async function createWebDirective(options = {}) {
	const WebDirective = (await import("web-directive")).default;
	const wd = new WebDirective(options);
	wd.listen();
	return wd;
}
// src/composable/useValidation.ts
async function useFormValidation(selector) {
	const module = await import("./chunks/validation.js");
	await module.ready;
	if (!selector) return module;
	return useFormValidationInstance(selector);
}
function useFormValidationInstance(selector) {
	return getBoundedInstance(selector, "form.validation");
}
function useFieldValidationInstance(selector) {
	return getBoundedInstance(selector, "field.validation");
}
async function addGlobalValidator(name, validator, options = {}) {
	const { UnicornFormValidation } = await useFormValidation();
	UnicornFormValidation.addGlobalValidator(name, validator, options);
}
// src/service/ui.ts
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
var { promise: alpineLoaded, resolve: alpineResolve } = /*@__PURE__*/ promiseWithResolvers();
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
// src/service/uri.ts
function useSystemUri(type, path) {
	const uri = UnicornSystemUri.get();
	if (type) return uri[type](path);
	return uri;
}
function useAssetUri(type, path) {
	const asset = UnicornAssetUri.get();
	if (type) return asset[type](path);
	return asset;
}
function uri(type) {
	return data("unicorn.uri")[type];
}
function asset(type) {
	return uri("asset")[type];
}
function addUriBase(uri, type = "path") {
	if (uri.substring(0, 2) === "//" || uri.substring(0, 4) === "http") return uri;
	return asset(type) + "/" + uri;
}
var UnicornSystemUri = class extends URL {
	static instance;
	static get() {
		return this.instance ??= new this(uri("full"));
	}
	path(path = "") {
		return uri("path") + path;
	}
	root(path = "") {
		return uri("root") + path;
	}
	current() {
		return uri("current") || "";
	}
	full() {
		return uri("full") || "";
	}
	route() {
		return uri("route") || "";
	}
	script() {
		return uri("script") || "";
	}
	routeWithQuery() {
		const route = this.route();
		const query = this.searchParams.toString();
		return query ? `${route}?${query}` : route;
	}
	routeAndQuery() {
		return [this.route(), this.searchParams.toString()];
	}
};
var UnicornAssetUri = class {
	static instance;
	static get() {
		return this.instance ??= new this();
	}
	path(path = "") {
		return asset("path") + path;
	}
	root(path = "") {
		return asset("root") + path;
	}
};
// src/utilities/base.ts
function removeCloak() {
	if (globalThis.document == null) return;
	selectAll("[uni-cloak]", (el) => el.removeAttribute("uni-cloak"));
}
// src/app.ts
var UnicornApp = class extends (/*@__PURE__*/ Mixin(EventMixin)) {
	registry = /* @__PURE__ */ new Map();
	plugins = /* @__PURE__ */ new Map();
	waits = [];
	options;
	defaultOptions = {};
	domready = domready;
	data = data;
	constructor(options = {}) {
		super();
		this.options = Object.assign({}, this.defaultOptions, options);
		if (typeof document !== "undefined") {
			this.wait((resolve) => {
				document.addEventListener("DOMContentLoaded", () => resolve());
			});
			document.addEventListener("DOMContentLoaded", () => {
				this.completed().then(() => this.trigger("loaded"));
			});
		}
	}
	use(plugin, options = {}) {
		if (Array.isArray(plugin)) {
			plugin.forEach((p) => this.use(p));
			return this;
		}
		plugin?.install?.(this, options);
		this.trigger("plugin.installed", plugin);
		this.plugins.set(plugin, plugin);
		return this;
	}
	detach(plugin) {
		if (plugin.uninstall) plugin.uninstall(this);
		this.trigger("plugin.uninstalled", plugin);
		return this;
	}
	inject(id, def) {
		if (!this.registry.has(id)) {
			if (def !== void 0) return def;
			throw new Error(`Injectable: "${id.name ?? id}" not found.`);
		}
		return this.registry.get(id);
	}
	provide(id, value) {
		this.registry.set(id, value);
		return this;
	}
	wait(callback) {
		const p = new Promise((resolve, reject) => {
			const promise = callback(resolve, reject);
			if (promise && "then" in promise) promise.then(resolve).catch(reject);
		});
		this.waits.push(p);
		return p;
	}
	completed() {
		const promise = Promise.all(this.waits);
		this.waits = [];
		return promise;
	}
	macro(name, prop) {
		if (this[name]) throw new Error(`Macro: ${name} already exists.`);
		this[name] = prop;
		return this;
	}
};
// src/polyfill/form-request-submit.ts
function formRequestSubmit(prototype) {
	if (typeof prototype.requestSubmit == "function") return;
	prototype.requestSubmit = function(submitter) {
		if (submitter) {
			validateSubmitter(submitter, this);
			submitter.click();
		} else {
			submitter = document.createElement("input");
			submitter.type = "submit";
			submitter.hidden = true;
			this.appendChild(submitter);
			submitter.click();
			this.removeChild(submitter);
		}
	};
	function validateSubmitter(submitter, form) {
		submitter instanceof HTMLElement || raise(TypeError, "parameter 1 is not of type 'HTMLElement'");
		submitter.type == "submit" || raise(TypeError, "The specified element is not a submit button");
		submitter.form == form || raise(DOMException, "The specified element is not owned by this form element", "NotFoundError");
	}
	function raise(errorConstructor, message, name) {
		throw new errorConstructor("Failed to execute 'requestSubmit' on 'HTMLFormElement': " + message + ".", name);
	}
}
// src/polyfill/index.ts
function polyfill() {
	if (typeof window !== "undefined") formRequestSubmit(HTMLFormElement.prototype);
}
// src/composable/useFieldMultiUploader.ts
async function useFieldMultiUploader() {
	const module = await import("./chunks/field-multi-uploader.js");
	await module.ready;
	return module;
}
// src/plugin/php-adapter.ts
function useUnicornPhpAdapter(app) {
	app ??= useUnicorn();
	app.use(UnicornPhpAdapter);
	return app.$ui;
}
var methods = {
	repeatable: useFieldRepeatable,
	flatpickr: useFieldFlatpickr,
	fileDrag: useFieldFileDrag,
	modalField: useFieldModalSelect,
	cascadeSelect: useFieldCascadeSelect,
	sid: useFieldSingleImageDrag,
	tinymce: { init: useTinymce },
	nuxtEditor: { init: useNuxtEditor },
	s3Uploader: useS3Uploader,
	iframeModal: useIframeModal,
	initShowOn: useShowOn,
	modalTree: useFieldModalTree,
	multiUploader: useFieldMultiUploader,
	tomSelect: useTomSelect,
	listDependent: useListDependent,
	bootstrap: {
		tooltip: useBs5Tooltip,
		buttonRadio: useBs5ButtonRadio,
		keepTab: useBs5KeepTab
	}
};
var UnicornPhpAdapter = class {
	static install(app) {
		if (app.$ui) app.$ui = {
			...app.$ui,
			...methods
		};
		else app.$ui = methods;
	}
};
// src/unicorn.ts
var app;
function createUnicorn() {
	polyfill();
	removeCloak();
	return app = new UnicornApp();
}
function createUnicornWithPlugins() {
	return createUnicorn();
}
function useUnicorn(instance) {
	if (instance) app = instance;
	return app ??= createUnicorn();
}
var useInject = (id, def) => {
	return useUnicorn().inject(id, def);
};
function pushUnicornToGlobal(app) {
	window.u = app ?? useUnicorn();
}
function useMacro(name, prop) {
	const app = useUnicorn();
	if (typeof name === "string") app.macro(name, prop);
	else for (const k in name) app.macro(k, name[k]);
	return app;
}
async function useLegacy(app) {
	app ??= useUnicorn();
	pushUnicornToGlobal(app);
	const { useLegacyMethods } = await import("./chunks/legacy.js");
	await useLegacyMethods(app);
	return app;
}
export { AttributeMutationObserver, EventMixin, UnicornAssetUri, UnicornPhpAdapter, UnicornSystemUri, UnicornUI, __, addGlobalValidator, addQuery, addRoute, addUriBase, animateTo, base64UrlDecode, base64UrlEncode, buildQuery, clearMessages, clearNotifies, createQueue, createStack, createUnicorn, createUnicornWithPlugins, data, debounce, delegate, deleteConfirm, doImport, domready, fadeIn, fadeOut, forceArray, getBoundedInstance, getBoundedInstanceList, h, hasRoute, highlight, html, initAlpineComponent, injectCssToDocument, isDebug, isError, loadAlpine, mark, module, nextTick, parseQuery, prepareAlpine, prepareAlpineDefer, pushUnicornToGlobal, randomBytes, randomBytesString, removeBoundedInstance, removeData, renderMessage, route, selectAll, selectOne, serial, simpleAlert, simpleConfirm, simpleNotify, sleep, slideDown, slideToggle, slideUp, throttle, tid, trans, uid, useAlertAdapter, useAssetUri, useBs5ButtonRadio, useBs5KeepTab, useBs5Tooltip, useBsModalAlert, useCheckboxesMultiSelect, useColorPicker, useCssImport, useCssIncludes, useDisableIfStackNotEmpty, useDisableOnSubmit, useFieldCascadeSelect, useFieldFileDrag, useFieldFlatpickr, useFieldModalSelect, useFieldModalTree, useFieldRepeatable, useFieldSingleImageDrag, useFieldValidationInstance, useForm, useFormAsync, useFormComponent, useFormSubmit, useFormValidation, useFormValidationInstance, useGrid, useGridAsync, useGridComponent, useHttpClient, useIframeModal, useImport, useInject, useKeepAlive, useLang, useLegacy, useListDependent, useMacro, useNuxtEditor, useQueue, useS3MultipartUploader, useS3Uploader, useScriptImport, useSeriesImport, useShowOn, useStack, useSystemUri, useTinymce, useTinymceHook, useTomSelect, useUI, useUIBootstrap5, useUITheme, useUniDirective, useUnicorn, useUnicornPhpAdapter, useVueComponentField, useWebDirective, wait, watchAttributes };

//# sourceMappingURL=unicorn.js.map