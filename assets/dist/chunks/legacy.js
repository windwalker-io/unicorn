import { a as h, c as module, d as selectOne, i as getBoundedInstanceList, n as domready, o as html, r as getBoundedInstance, t as delegate, u as selectAll } from "./dom.js";
import { _ as useDisableIfStackNotEmpty, a as highlight, c as mark, d as renderMessage, f as slideDown, g as useColorPicker, i as fadeOut, l as prepareAlpine, m as slideUp, n as clearMessages, o as initAlpineComponent, p as slideToggle, r as fadeIn, s as loadAlpine, v as useDisableOnSubmit, w as animateTo, y as useKeepAlive } from "./ui.js";
import { a as simpleNotify, i as simpleConfirm, r as simpleAlert, t as clearNotifies } from "./alert.js";
import { i as uid, r as tid } from "./crypto.js";
import { n as useQueue } from "./useQueue.js";
import { n as useStack } from "./useStack.js";
import { o as throttle, r as isDebug, t as debounce } from "./helper.js";
import { i as require_sprintf, t as __ } from "./lang.js";
import { o as route } from "./router.js";
import { addGlobalValidator, base64UrlDecode, base64UrlEncode, serial, useAssetUri, useBs5ButtonRadio, useBs5KeepTab, useBs5Tooltip, useCheckboxesMultiSelect, useFieldValidationInstance, useForm, useFormAsync, useFormValidation, useFormValidationInstance, useGrid, useGridAsync, useHttpClient, useSystemUri, useTomSelect, useUniDirective } from "../unicorn.js";
import { Modal } from "bootstrap";
//#region ../../../../node_modules/@lyrasoft/ts-toolkit/src/generic/number.ts
function numberFormat(number, decimals = 0, decPoint = ".", thousandsSep = ",") {
	number = Number(number);
	const str = number.toFixed(decimals ? decimals : 0).toString().split(".");
	const parts = [];
	for (var i = str[0].length; i > 0; i -= 3) parts.unshift(str[0].substring(Math.max(0, i - 3), i));
	str[0] = parts.join(thousandsSep ? thousandsSep : ",");
	return str.join(decPoint ? decPoint : ".");
}
//#endregion
//#region src/legacy/loader.ts
var import_sprintf = /* @__PURE__ */ require_sprintf();
var imports = {};
var LegacyLoader = class {
	static install(app) {
		const loader = app.$loader = new this(app);
		app.import = loader.import.bind(loader);
		app.importSync = loader.importSync.bind(loader);
		app.importCSS = loader.importCSS.bind(loader);
		app.minFileName = loader.minFileName.bind(loader);
		app.afterImported = loader.afterImported.bind(loader);
	}
	constructor(app) {
		this.app = app;
	}
	doImport(src) {
		return S.import(src);
	}
	/**
	* Import modules or scripts.
	*/
	import(...src) {
		if (src.length === 1) return this.doImport(src[0]);
		const promises = [];
		src.forEach((link) => {
			promises.push(link instanceof Promise ? link : this.doImport(link));
		});
		return Promise.all(promises);
	}
	/**
	* Import sync.
	*/
	importSync(...src) {
		let promise = Promise.resolve();
		let url;
		const modules = [];
		while (url = src.shift()) {
			if (!Array.isArray(url)) url = [url];
			const target = url;
			promise = promise.then(() => this.import(...target).then((m) => {
				modules.push(m);
				return modules;
			}));
		}
		return promise;
	}
	/**
	* Import CSS files.
	*/
	async importCSS(...src) {
		let modules = await this.import(...src);
		if (!Array.isArray(modules)) modules = [modules];
		const styles = modules.map((module) => module.default);
		document.adoptedStyleSheets = [...document.adoptedStyleSheets, ...styles];
	}
	minFileName(fileName) {
		const segments = fileName.split(".");
		const ext = segments.pop();
		if (isDebug()) return segments.join(".") + ".min." + ext;
		return fileName;
	}
	asImported(name) {
		if (!imports[name]) imports[name] = {
			promise: Promise.resolve(),
			resolve: void 0
		};
		else imports[name]?.resolve?.();
	}
	/**
	* Add after import hook for some url or id.
	*/
	afterImported(name, callback) {
		if (!imports[name]) {
			let r;
			imports[name] = { promise: new Promise((resolve) => {
				r = resolve;
			}) };
			imports[name].resolve = r;
		}
		imports[name].promise.then(callback);
		return imports[name].promise;
	}
};
//#endregion
//#region src/legacy/legacy.ts
async function useLegacyMethods(app) {
	const http = await useHttpClient();
	app.use(LegacyLoader);
	handleUri(app);
	handlerHelper(app);
	handleCrypto(app);
	app.__ = __;
	app.trans = __;
	app.route = route;
	app.$http = http;
	app.directive = useUniDirective;
	app.animate = animateTo;
	app.$animation = { to: animateTo };
	app.addMessage = renderMessage;
	app.clearMessages = clearMessages;
	app.notify = simpleNotify;
	app.clearNotifies = clearNotifies;
	app.loadAlpine = loadAlpine;
	app.initAlpine = initAlpineComponent;
	app.beforeAlpineInit = prepareAlpine;
	app.prepareAlpine = prepareAlpine;
	handleUI(app);
	await handleFormGrid(app);
	app.formValidation = useFormValidation;
	app.$validation = {
		get: useFormValidationInstance,
		getField: useFieldValidationInstance,
		addGlobalValidator,
		import: () => useFormValidation()
	};
	app.stack = useStack;
	app.queue = useQueue;
}
function handleCrypto(app) {
	app.base64Encode = base64UrlEncode;
	app.base64Decode = base64UrlDecode;
	app.uid = uid;
	app.tid = tid;
	app.serial = serial;
}
function handleUri(app) {
	app.uri = useSystemUri;
	app.asset = useAssetUri;
}
function handlerHelper(app) {
	app.domready = domready;
	app.selectOne = selectOne;
	app.selectAll = selectAll;
	app.each = selectAll;
	app.getBoundedInstance = getBoundedInstance;
	app.getBoundedInstanceList = getBoundedInstanceList;
	app.module = module;
	app.h = h;
	app.html = html;
	app.delegate = delegate;
	app.debounce = debounce;
	app.throttle = throttle;
	app.isDebug = isDebug;
	app.confirm = simpleConfirm;
	app.alert = simpleAlert;
	app.numberFormat = numberFormat;
	app.sprintf = import_sprintf.sprintf;
	app.vsprintf = import_sprintf.vsprintf;
}
function handleUI(app) {
	app.$ui ??= {};
	app.$ui.addMessage = renderMessage;
	app.$ui.clearMessages = clearMessages;
	app.$ui.notify = simpleNotify;
	app.$ui.clearNotifies = clearNotifies;
	app.$ui.loadAlpine = loadAlpine;
	app.$ui.initAlpine = initAlpineComponent;
	app.$ui.beforeAlpineInit = prepareAlpine;
	app.$ui.prepareAlpine = prepareAlpine;
	app.$ui.mark = mark;
	app.$ui.tomSelect = useTomSelect;
	app.$ui.slideUp = slideUp;
	app.$ui.slideDown = slideDown;
	app.$ui.slideToggle = slideToggle;
	app.$ui.fadeOut = fadeOut;
	app.$ui.fadeIn = fadeIn;
	app.$ui.highlight = highlight;
	app.$ui.colorPicker = useColorPicker;
	app.$ui.disableOnSubmit = useDisableOnSubmit;
	app.$ui.disableIfStackNotEmpty = useDisableIfStackNotEmpty;
	app.$ui.checkboxesMultiSelect = useCheckboxesMultiSelect;
	app.$ui.keepAlive = useKeepAlive;
	app.$ui.bootstrap = {
		tooltip: useBs5Tooltip,
		buttonRadio: useBs5ButtonRadio,
		keepTab: useBs5KeepTab,
		modal: (selector, config) => {
			return module(selector, "bs.modal", (el) => Modal.getOrCreateInstance(el, config));
		}
	};
}
async function handleFormGrid(app) {
	await useFormAsync();
	await useGridAsync();
	app.form = useForm;
	app.grid = useGrid;
}
//#endregion
export { useLegacyMethods };

//# sourceMappingURL=legacy.js.map