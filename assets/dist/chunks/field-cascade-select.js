import { n as __toESM, t as __commonJSMin } from "./chunk.js";
import { t as mergeDeep } from "./arr.js";
import { c as module } from "./dom.js";
import { o as initAlpineComponent, u as prepareAlpineDefer } from "./ui.js";
import { i as uid } from "./crypto.js";
import { useHttpClient } from "../unicorn.js";
//#region ../../../../node_modules/@rubenbimmel/alpine-class-component/dist/alpineComponent.js
var require_alpineComponent = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var AlpineComponent = class {};
	exports.default = AlpineComponent;
}));
//#endregion
//#region ../../../../node_modules/@rubenbimmel/alpine-class-component/dist/decorators/component.js
var require_component = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	function Component(component) {
		return function(...args) {
			let instance = new component(...args);
			const proto = component.prototype;
			let data = {};
			Object.getOwnPropertyNames(proto).forEach(function(key) {
				if (key === "constructor") return;
				const descriptor = Object.getOwnPropertyDescriptor(proto, key);
				if (descriptor.value !== void 0) {
					if (typeof descriptor.value === "function") data[key] = descriptor.value;
				} else if (descriptor.get || descriptor.set) Object.defineProperty(data, key, {
					get: descriptor.get,
					set: descriptor.set
				});
			});
			return Object.assign(data, instance);
		};
	}
	exports.default = Component;
}));
//#endregion
//#region \0@oxc-project+runtime@0.124.0/helpers/decorateMetadata.js
var import_alpineComponent = /* @__PURE__ */ __toESM(/* @__PURE__ */ require_alpineComponent(), 1);
var import_component = /* @__PURE__ */ __toESM(/* @__PURE__ */ require_component(), 1);
function __decorateMetadata(k, v) {
	if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
//#endregion
//#region \0@oxc-project+runtime@0.124.0/helpers/decorate.js
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
//#endregion
//#region src/module/field-cascade-select.ts
var _ref;
var defaultOptions = {
	id: "",
	selected: "",
	path: [],
	ignoreSelf: null,
	placeholder: "- Select -",
	placeholders: [],
	ajaxUrl: "",
	ajaxValueField: "value",
	source: [],
	labels: [],
	labelWidth: "col-md-3",
	fieldWidth: "col",
	readonly: false,
	disabled: false,
	valueField: "id",
	textField: "title",
	horizontal: null,
	horizontalColWidth: null,
	defaultValue: "",
	onSelectInit: () => {},
	onChange: () => {},
	onValueInit: () => {}
};
var FieldCascadeSelect = class FieldCascadeSelect extends import_alpineComponent.default {
	options;
	el;
	canModify = false;
	lists = [];
	ajaxUrl = "";
	values = [];
	constructor(options = {}) {
		super();
		this.options = mergeDeep({}, defaultOptions, options);
		this.options.id = this.options.id || "cascade-select-" + uid();
	}
	init() {
		this.canModify = !this.options.readonly && !this.options.disabled;
		this.ajaxUrl = this.options.ajaxUrl;
		this.values = this.options.path.slice().map(String);
		let values = this.options.path.slice();
		if (values.length === 0) values = [null];
		else values.unshift(null);
		let promise = Promise.resolve();
		let lastValue = null;
		values.forEach((v, i) => {
			promise = promise.then(() => {
				return this.loadItems(v, i).then((list) => {
					if (list.length > 0) this.lists.push(list);
				});
			});
			lastValue = v;
		});
		this.el = this.$el;
		module(this.$el, "cascade.select", () => this);
		this.valueInit(this.$el, lastValue, values);
	}
	getLabel(i) {
		return this.options.labels[i] || `Level ${i + 1}`;
	}
	getId(i) {
		return `${this.options.id}__level-${i}`;
	}
	getListValue(i) {
		return this.values[i] || "";
	}
	isSelected(i, item) {
		return String(this.getListValue(i)) === String(item[this.options.valueField]);
	}
	getFinalValue() {
		const values = this.values.slice();
		if (values.length === 0) return this.options.defaultValue;
		const v = values.filter((v) => v != null).filter((v) => v !== "").pop();
		if (v == void 0) return this.options.defaultValue;
		return v;
	}
	getLevel() {
		return this.values.length;
	}
	async onChange(i, event) {
		const el = event.target;
		this.values[i] = el.value;
		this.options.onChange(event);
		event.stopPropagation();
		const changeEvent = new CustomEvent("change", { detail: {
			el,
			component: this,
			value: el.value,
			path: this.values
		} });
		this.el?.dispatchEvent(changeEvent);
		if (el.value === "") {
			this.lists.splice(i + 1);
			this.values.splice(i + 1);
			return;
		}
		let list = await this.loadItems(el.value, i);
		this.lists.splice(i + 1);
		this.values.splice(i + 1);
		if (list.length > 0) this.lists.push(list);
	}
	async loadItems(parentId, i) {
		if (this.ajaxUrl) return await (await (await useHttpClient()).get(this.ajaxUrl, { params: {
			[this.options.ajaxValueField]: parentId,
			self: this.options.ignoreSelf || null
		} })).data.data;
		if (parentId) return Promise.resolve(this.handleSourceItems(this.findFromList(this.lists[i - 1] || [], parentId)?.children || []));
		return Promise.resolve(this.handleSourceItems(this.options.source));
	}
	valueInit($select, value, path) {
		const event = new CustomEvent("value.init", { detail: {
			el: $select,
			component: this,
			value,
			path
		} });
		this.options.onSelectInit(event);
		this.$el.dispatchEvent(event);
	}
	selectInit($select) {
		const event = new CustomEvent("select.init", { detail: {
			el: $select,
			component: this
		} });
		this.options.onSelectInit(event);
		this.$el.dispatchEvent(event);
	}
	handleSourceItems(items) {
		return items.map((item) => {
			return {
				[this.options.valueField]: item.value[this.options.valueField],
				[this.options.textField]: item.value[this.options.textField],
				children: item.children
			};
		}).filter((item) => {
			if (this.options.ignoreSelf) return item[this.options.valueField] != this.options.ignoreSelf;
			return item;
		});
	}
	findFromList(items, value) {
		return items.filter((item) => item[this.options.valueField] == value).shift();
	}
	getPlaceholder(i) {
		if (this.options.placeholders[i]) return this.options.placeholders[i];
		return this.options.placeholder;
	}
};
FieldCascadeSelect = /* @__PURE__ */ __decorate([import_component.default, /* @__PURE__ */ __decorateMetadata("design:paramtypes", [typeof (_ref = typeof Partial !== "undefined" && Partial) === "function" ? _ref : Object])], FieldCascadeSelect);
async function init() {
	await prepareAlpineDefer(() => {
		Alpine.data("CascadeSelect", (options) => new FieldCascadeSelect(options));
	});
	await initAlpineComponent("data-cascade-select");
}
var ready = /* @__PURE__ */ init();
//#endregion
export { ready };

//# sourceMappingURL=field-cascade-select.js.map