import { getCurrentInstance, getCurrentScope, hasInjectionContext, inject, isRef, onActivated, onBeforeUnmount, onDeactivated, onScopeDispose, ref, toValue, watchEffect } from "vue";
// ../../../../node_modules/hookable/dist/index.mjs
function flatHooks(configHooks, hooks = {}, parentName) {
	for (const key in configHooks) {
		const subHook = configHooks[key];
		const name = parentName ? `${parentName}:${key}` : key;
		if (typeof subHook === "object" && subHook !== null) flatHooks(subHook, hooks, name);
		else if (typeof subHook === "function") hooks[name] = subHook;
	}
	return hooks;
}
var createTask = /*@__PURE__*/ (() => {
	if (console.createTask) return console.createTask;
	const defaultTask = { run: (fn) => fn() };
	return () => defaultTask;
})();
function callHooks(hooks, args, startIndex, task) {
	for (let i = startIndex; i < hooks.length; i += 1) try {
		const result = task ? task.run(() => hooks[i](...args)) : hooks[i](...args);
		if (result && typeof result.then === "function") return Promise.resolve(result).then(() => callHooks(hooks, args, i + 1, task));
	} catch (error) {
		return Promise.reject(error);
	}
}
function serialTaskCaller(hooks, args, name) {
	if (hooks.length > 0) return callHooks(hooks, args, 0, createTask(name));
}
function parallelTaskCaller(hooks, args, name) {
	if (hooks.length > 0) {
		const task = createTask(name);
		return Promise.all(hooks.map((hook) => task.run(() => hook(...args))));
	}
}
function callEachWith(callbacks, arg0) {
	for (const callback of [...callbacks]) callback(arg0);
}
var Hookable = class {
	_hooks;
	_before;
	_after;
	_deprecatedHooks;
	_deprecatedMessages;
	constructor() {
		this._hooks = {};
		this._before = void 0;
		this._after = void 0;
		this._deprecatedMessages = void 0;
		this._deprecatedHooks = {};
		this.hook = this.hook.bind(this);
		this.callHook = this.callHook.bind(this);
		this.callHookWith = this.callHookWith.bind(this);
	}
	hook(name, function_, options = {}) {
		if (!name || typeof function_ !== "function") return () => {};
		const originalName = name;
		let dep;
		while (this._deprecatedHooks[name]) {
			dep = this._deprecatedHooks[name];
			name = dep.to;
		}
		if (dep && !options.allowDeprecated) {
			let message = dep.message;
			if (!message) message = `${originalName} hook has been deprecated` + (dep.to ? `, please use ${dep.to}` : "");
			if (!this._deprecatedMessages) this._deprecatedMessages = /* @__PURE__ */ new Set();
			if (!this._deprecatedMessages.has(message)) {
				console.warn(message);
				this._deprecatedMessages.add(message);
			}
		}
		if (!function_.name) try {
			Object.defineProperty(function_, "name", {
				get: () => "_" + name.replace(/\W+/g, "_") + "_hook_cb",
				configurable: true
			});
		} catch {}
		this._hooks[name] = this._hooks[name] || [];
		this._hooks[name].push(function_);
		return () => {
			if (function_) {
				this.removeHook(name, function_);
				function_ = void 0;
			}
		};
	}
	hookOnce(name, function_) {
		let _unreg;
		let _function = (...arguments_) => {
			if (typeof _unreg === "function") _unreg();
			_unreg = void 0;
			_function = void 0;
			return function_(...arguments_);
		};
		_unreg = this.hook(name, _function);
		return _unreg;
	}
	removeHook(name, function_) {
		const hooks = this._hooks[name];
		if (hooks) {
			const index = hooks.indexOf(function_);
			if (index !== -1) hooks.splice(index, 1);
			if (hooks.length === 0) this._hooks[name] = void 0;
		}
	}
	clearHook(name) {
		this._hooks[name] = void 0;
	}
	deprecateHook(name, deprecated) {
		this._deprecatedHooks[name] = typeof deprecated === "string" ? { to: deprecated } : deprecated;
		const _hooks = this._hooks[name] || [];
		this._hooks[name] = void 0;
		for (const hook of _hooks) this.hook(name, hook);
	}
	deprecateHooks(deprecatedHooks) {
		for (const name in deprecatedHooks) this.deprecateHook(name, deprecatedHooks[name]);
	}
	addHooks(configHooks) {
		const hooks = flatHooks(configHooks);
		const removeFns = Object.keys(hooks).map((key) => this.hook(key, hooks[key]));
		return () => {
			for (const unreg of removeFns) unreg();
			removeFns.length = 0;
		};
	}
	removeHooks(configHooks) {
		const hooks = flatHooks(configHooks);
		for (const key in hooks) this.removeHook(key, hooks[key]);
	}
	removeAllHooks() {
		this._hooks = {};
	}
	callHook(name, ...args) {
		return this.callHookWith(serialTaskCaller, name, args);
	}
	callHookParallel(name, ...args) {
		return this.callHookWith(parallelTaskCaller, name, args);
	}
	callHookWith(caller, name, args) {
		const event = this._before || this._after ? {
			name,
			args,
			context: {}
		} : void 0;
		if (this._before) callEachWith(this._before, event);
		const result = caller(this._hooks[name] ? [...this._hooks[name]] : [], args, name);
		if (result instanceof Promise) return result.finally(() => {
			if (this._after && event) callEachWith(this._after, event);
		});
		if (this._after && event) callEachWith(this._after, event);
		return result;
	}
	beforeEach(function_) {
		this._before = this._before || [];
		this._before.push(function_);
		return () => {
			if (this._before !== void 0) {
				const index = this._before.indexOf(function_);
				if (index !== -1) this._before.splice(index, 1);
			}
		};
	}
	afterEach(function_) {
		this._after = this._after || [];
		this._after.push(function_);
		return () => {
			if (this._after !== void 0) {
				const index = this._after.indexOf(function_);
				if (index !== -1) this._after.splice(index, 1);
			}
		};
	}
};
function createHooks$1() {
	return new Hookable();
}
var HookableCore = class {
	_hooks;
	constructor() {
		this._hooks = {};
	}
	hook(name, fn) {
		if (!name || typeof fn !== "function") return () => {};
		this._hooks[name] = this._hooks[name] || [];
		this._hooks[name].push(fn);
		return () => {
			if (fn) {
				this.removeHook(name, fn);
				fn = void 0;
			}
		};
	}
	removeHook(name, function_) {
		const hooks = this._hooks[name];
		if (hooks) {
			const index = hooks.indexOf(function_);
			if (index !== -1) hooks.splice(index, 1);
			if (hooks.length === 0) this._hooks[name] = void 0;
		}
	}
	callHook(name, ...args) {
		const hooks = this._hooks[name];
		if (!hooks || hooks.length === 0) return;
		return callHooks(hooks.slice(), args, 0);
	}
};
// ../../../../node_modules/unhead/dist/shared/unhead.CGPOfp5O.mjs
var DupeableTags = /*@__PURE__*/ new Set([
	"link",
	"style",
	"script",
	"noscript"
]);
var TagsWithInnerContent = /*@__PURE__*/ new Set([
	"title",
	"titleTemplate",
	"script",
	"style",
	"noscript"
]);
var HasElementTags = /*@__PURE__*/ new Set([
	"base",
	"meta",
	"link",
	"style",
	"script",
	"noscript"
]);
var ValidHeadTags = /*@__PURE__*/ new Set([
	"title",
	"base",
	"htmlAttrs",
	"bodyAttrs",
	"meta",
	"link",
	"style",
	"script",
	"noscript"
]);
var UniqueTags = /*@__PURE__*/ new Set([
	"base",
	"title",
	"titleTemplate",
	"bodyAttrs",
	"htmlAttrs",
	"templateParams"
]);
var TagConfigKeys = /*@__PURE__*/ new Set([
	"key",
	"tagPosition",
	"tagPriority",
	"tagDuplicateStrategy",
	"innerHTML",
	"textContent",
	"processTemplateParams"
]);
var UsesMergeStrategy = /*@__PURE__*/ new Set([
	"templateParams",
	"htmlAttrs",
	"bodyAttrs"
]);
var MetaTagsArrayable = /*@__PURE__*/ new Set([
	"theme-color",
	"google-site-verification",
	"author",
	"og:locale:alternate",
	"og:image",
	"og:video",
	"og:audio",
	"article:author",
	"article:tag",
	"book:author",
	"book:tag",
	"twitter:image"
]);
var TagPriorityAliases = {
	critical: -8,
	high: -1,
	low: 2
};
var hasContent = (value) => typeof value === "number" ? Number.isFinite(value) : value;
// @__NO_SIDE_EFFECTS__
function isUnsafeKey(key) {
	return key === "__proto__" || key === "constructor" || key === "prototype";
}
// ../../../../node_modules/unhead/dist/shared/unhead.Bm4Y6XQI.mjs
function createHooks(hooks) {
	const instance = new HookableCore();
	for (const key in hooks || {}) instance.hook(key, hooks[key]);
	return instance;
}
function callHook(head, hook, ctx) {
	if (!(head.hooks?._hooks?.[hook])?.length) return;
	return head.hooks?.callHook(hook, ctx);
}
// ../../../../node_modules/unhead/dist/shared/unhead.DJuZwX9c.mjs
var META_NOREWRITE_RE = /^(?:viewport|description|keywords|robots)$/;
var META_KEY_ATTRS = [
	"name",
	"property",
	"http-equiv"
];
function isMetaArrayDupeKey(v) {
	const i = v.indexOf(":");
	if (i === -1) return false;
	const key = v.slice(i + 1);
	return MetaTagsArrayable.has(key) || key.startsWith("og:image:") || key.startsWith("og:video:") || key.startsWith("og:audio:") || key.startsWith("twitter:image:");
}
function dedupeKey(tag) {
	const { props, tag: t, key } = tag;
	if (UniqueTags.has(t)) return t;
	if (t === "link") {
		if (props.rel === "canonical") return "canonical";
		if (props.rel === "alternate" && props.hreflang) return `alternate:${props.hreflang}`;
	}
	if (props.charset) return "charset";
	if (t === "meta") for (const n of META_KEY_ATTRS) {
		const v = props[n];
		if (v !== void 0) return `meta:${v}${(typeof v !== "string" || !v.includes(":")) && !META_NOREWRITE_RE.test(v) && key ? `:key:${key}` : ""}`;
	}
	if (key) return `${t}:key:${key}`;
	if (props.id) return `${t}:id:${props.id}`;
	if (t === "link" && props.rel && props.href) return `link:${props.rel}:${props.href}`;
	return TagsWithInnerContent.has(t) && (tag.textContent || tag.innerHTML) ? `${t}:content:${tag.textContent || tag.innerHTML}` : void 0;
}
function hashTag(tag) {
	const identity = tag._h || tag._d || tag.textContent || tag.innerHTML;
	if (identity) return String(identity);
	const keys = Object.keys(tag.props).sort();
	let hash = `${tag.tag}:`;
	let separator = "";
	for (const key of keys) {
		hash += `${separator}${key}:${String(tag.props[key])}`;
		separator = ",";
	}
	return hash;
}
function walkResolver(val, resolve, key) {
	if (key === "_resolver") return val;
	if (typeof val === "function" && (!key || key !== "titleTemplate" && !key.startsWith("on"))) val = val();
	const v = resolve ? resolve(key, val) : val;
	if (Array.isArray(v)) {
		let out;
		for (let i = 0; i < v.length; i++) {
			const r = walkResolver(v[i], resolve);
			if (out) out[i] = r;
			else if (r !== v[i]) {
				out = v.slice(0, i);
				out[i] = r;
			}
		}
		return out || v;
	}
	if (v?.constructor === Object) {
		let next;
		for (const k in v) {
			const unsafe = /* @__PURE__ */ isUnsafeKey(k);
			const r = unsafe ? void 0 : walkResolver(v[k], resolve, k);
			if (!next && (unsafe || r !== v[k])) {
				next = {};
				for (const pk in v) {
					if (pk === k) break;
					next[pk] = v[pk];
				}
			}
			if (next && !unsafe) next[k] = r;
		}
		return next || v;
	}
	return v;
}
var INVALID_ATTR_NAME_RE = /[\s"'<>/=\x00-\x1F\x7F]/;
function normalizeStyleClassProps(key, value) {
	const isStyle = key === "style";
	const store = isStyle ? /* @__PURE__ */ new Map() : /* @__PURE__ */ new Set();
	const add = (v) => {
		if (!v) return;
		if (isStyle) {
			const i = v.indexOf(":");
			i > 0 && store.set(v.slice(0, i).trim(), v.slice(i + 1).trim());
		} else v.split(" ").forEach((c) => c && store.add(c));
	};
	if (typeof value === "string") (isStyle ? value.split(";") : [value]).forEach(add);
	else if (Array.isArray(value)) value.forEach(add);
	else if (value && typeof value === "object") for (const k in value) {
		const v = value[k];
		v && v !== "false" && (isStyle ? store.set(k.trim(), String(v)) : add(k));
	}
	return store;
}
function normalizeProps$1(tag, input) {
	tag.props = tag.props || {};
	if (!input) return tag;
	if (tag.tag === "templateParams") {
		tag.props = input;
		return tag;
	}
	const isHtmlTag = HasElementTags.has(tag.tag) || tag.tag === "htmlAttrs" || tag.tag === "bodyAttrs";
	for (const prop in input) {
		if (/* @__PURE__ */ isUnsafeKey(prop)) continue;
		const isData = prop.startsWith("data-");
		const isHtmlAttr = isHtmlTag && !TagConfigKeys.has(prop);
		const key = isHtmlAttr && !isData ? prop.toLowerCase() : prop;
		if (isHtmlAttr && (!key || INVALID_ATTR_NAME_RE.test(key))) continue;
		const value = input[prop];
		if (value === null) tag.props[key] = null;
		else if (prop === "class" || prop === "style") tag.props[prop] = normalizeStyleClassProps(prop, value);
		else if (TagConfigKeys.has(prop)) {
			if ((prop === "textContent" || prop === "innerHTML") && typeof value === "object") {
				const type = input.type || "application/json";
				if (type.endsWith("json") || type === "speculationrules" || type === "importmap") {
					tag.props.type = type;
					tag[prop] = JSON.stringify(value);
				}
			} else tag[prop] = value;
		} else if (value !== void 0) {
			const str = String(value);
			const isMeta = tag.tag === "meta" && key === "content";
			tag.props[key] = str === "true" || str === "" ? isData || isMeta ? str : true : !value && isData && str === "false" ? "false" : value;
		}
	}
	return tag;
}
function resolveHeadInput(input, propResolvers) {
	let resolve;
	if (propResolvers.length) {
		resolve = (key, val) => {
			for (let i = 0; i < propResolvers.length; i++) val = propResolvers[i](key, val);
			return val;
		};
		input = resolve(void 0, input);
	}
	return walkResolver(input, resolve);
}
function normalizeTag(tagName, _input) {
	const tag = normalizeProps$1({
		tag: tagName,
		props: {}
	}, typeof _input === "object" && typeof _input !== "function" ? _input : { [tagName === "script" || tagName === "noscript" || tagName === "style" ? "innerHTML" : "textContent"]: _input });
	if (tag.key && DupeableTags.has(tag.tag)) tag.props["data-hid"] = tag._h = tag.key;
	if (tag.tag === "script" && typeof tag.innerHTML === "object") {
		tag.innerHTML = JSON.stringify(tag.innerHTML);
		tag.props.type = tag.props.type || "application/json";
	}
	if (Array.isArray(tag.props.content)) {
		const tags = [];
		for (const content of tag.props.content) tags.push({
			...tag,
			props: {
				...tag.props,
				content
			}
		});
		return tags;
	}
	return tag;
}
function pushNormalizedTag(tags, tag) {
	if (Array.isArray(tag)) for (const t of tag) tags.push(t);
	else tags.push(tag);
}
function normalizeEntryToTags(input, propResolvers) {
	if (!input) return [];
	if (typeof input === "function") input = input();
	input = resolveHeadInput(input, propResolvers);
	const tags = [];
	for (const key in input) {
		const value = input[key];
		if (value !== void 0) {
			if (Array.isArray(value)) for (const v of value) pushNormalizedTag(tags, normalizeTag(key, v));
			else pushNormalizedTag(tags, normalizeTag(key, value));
		}
	}
	return tags;
}
var LT_RE = /</g;
var SCRIPT_END_RE = /<\/script/g;
var sortTags = (a, b) => a._w === b._w ? a._p - b._p : a._w - b._w;
var DEFAULT_TAG_WEIGHT = () => 100;
function isEmptyProps(props) {
	for (const _ in props) return false;
	return true;
}
var TAG_MUTATING_HOOK_RE = /^tags:|:render/;
function syncEntryHookCache(head, hooks) {
	const count = (hooks["entries:resolve"]?.length || 0) + (hooks["entries:normalize"]?.length || 0);
	if (head._h !== count) {
		head._h = count;
		for (const entry of head.entries.values()) delete entry._tags;
	}
}
function cloneTagsInPlace(tags) {
	for (let i = 0; i < tags.length; i++) {
		const t = tags[i];
		const props = { ...t.props };
		if (props.class instanceof Set) props.class = new Set(props.class);
		if (props.style instanceof Map) props.style = new Map(props.style);
		tags[i] = {
			...t,
			props
		};
	}
}
function valuesToTags(ctx, sortFlatMeta) {
	const tags = ctx.tags;
	let w = 0;
	for (const value of ctx.tagMap.values()) if (Array.isArray(value)) for (const tag of value) tags[w++] = tag;
	else tags[w++] = value;
	tags.length = w;
	if (sortFlatMeta) tags.sort(sortTags);
}
function dedupeTags(ctx) {
	let hasFlatMeta = false;
	for (const next of ctx.tags.sort(sortTags)) {
		const k = next._d || hashTag(next);
		if (!k) continue;
		const prev = ctx.tagMap.get(k);
		if (!prev) {
			ctx.tagMap.set(k, next);
			continue;
		}
		if ((next.tagDuplicateStrategy || (UsesMergeStrategy.has(next.tag) ? "merge" : null) || (next.key && next.key === prev.key ? "merge" : null)) === "merge") {
			const props = { ...prev.props };
			for (const p in next.props) props[p] = p === "style" ? new Map([...prev.props.style || /* @__PURE__ */ new Map(), ...next.props[p]]) : p === "class" ? /* @__PURE__ */ new Set([...prev.props.class || [], ...next.props[p]]) : next.props[p];
			ctx.tagMap.set(k, {
				...next,
				props
			});
		} else if (next._p >> 10 === prev._p >> 10 && next.tag === "meta" && isMetaArrayDupeKey(k)) {
			ctx.tagMap.set(k, Object.assign([...Array.isArray(prev) ? prev : [prev], next], next));
			hasFlatMeta = true;
		} else if (next._w === prev._w ? next._p > prev._p : next._w < prev._w) ctx.tagMap.set(k, next);
	}
	return hasFlatMeta;
}
function resolveTitleTemplate(ctx, head) {
	const title = ctx.tagMap.get("title");
	const tpl = ctx.tagMap.get("titleTemplate");
	head._title = title?.textContent;
	if (!tpl) return;
	const fn = tpl.textContent;
	head._titleTemplate = fn;
	if (!fn) return;
	let v = typeof fn === "function" ? fn(title?.textContent) : fn;
	if (typeof v === "string" && !head.plugins.has("template-params")) v = v.replace("%s", title?.textContent || "");
	if (title) v === null ? ctx.tagMap.delete("title") : ctx.tagMap.set("title", {
		...title,
		textContent: v
	});
	else ctx.tagMap.set("titleTemplate", {
		...tpl,
		tag: "title",
		textContent: v
	});
}
function sanitizeTagsInPlace(tags) {
	let w = 0;
	for (let t of tags) {
		const { innerHTML, tag, props } = t;
		if (!ValidHeadTags.has(tag) || isEmptyProps(props) && !hasContent(innerHTML) && !hasContent(t.textContent)) continue;
		if (tag === "meta") {
			if (!hasContent(props.content) && !props["http-equiv"] && !props.charset) continue;
		}
		if (tag === "script" && (innerHTML || t.textContent)) {
			const type = String(props.type);
			const isJsonLike = type.endsWith("json") || type === "importmap" || type === "speculationrules";
			const escape = (content) => isJsonLike ? (typeof content === "string" ? content : JSON.stringify(content)).replace(LT_RE, "\\u003C") : typeof content === "string" ? content.replace(SCRIPT_END_RE, "<\\/script") : content;
			t = { ...t };
			if (innerHTML) t.innerHTML = escape(innerHTML);
			if (t.textContent) t.textContent = escape(t.textContent);
			t._d = dedupeKey(t);
		}
		tags[w++] = t;
	}
	tags.length = w;
	return tags;
}
function resolveTags(head, options) {
	const weightFn = options?.tagWeight ?? head.resolvedOptions._tagWeight ?? DEFAULT_TAG_WEIGHT;
	const ctx = {
		tagMap: /* @__PURE__ */ new Map(),
		tags: []
	};
	const hooks = head.hooks?._hooks || {};
	syncEntryHookCache(head, hooks);
	for (const e of head.entries.values()) if (e._pending !== void 0) {
		e.input = e._pending;
		delete e._pending;
		delete e._tags;
		delete e._precomputedTags;
	}
	let entries;
	if (hooks["entries:resolve"]?.length || hooks["entries:normalize"]?.length) {
		entries = [...head.entries.values()];
		if (hooks["entries:resolve"]?.length) callHook(head, "entries:resolve", {
			entries,
			...ctx
		});
	}
	syncEntryHookCache(head, hooks);
	for (const e of entries || head.entries.values()) {
		let tags = e._tags;
		if (!tags) {
			if (e._precomputedTags && weightFn === head.resolvedOptions._tagWeight && !hooks["entries:normalize"]?.length && !hooks["entries:resolve"]?.length && (!e.options || isEmptyProps(e.options))) tags = e._precomputedTags;
			else {
				tags = normalizeEntryToTags(e.input, head.resolvedOptions.propResolvers || []);
				if (e.options && !isEmptyProps(e.options)) for (const t of tags) Object.assign(t, e.options);
				if (hooks["entries:normalize"]?.length) {
					const normalizeCtx = {
						tags,
						entry: e
					};
					callHook(head, "entries:normalize", normalizeCtx);
					tags = normalizeCtx.tags;
				}
				for (let i = 0; i < tags.length; i++) {
					const t = tags[i];
					t._w = weightFn(t);
					t._p = (e._i << 10) + i;
					t._d = dedupeKey(t);
					if (!t._d) t._h = hashTag(t);
				}
				e._tags = tags;
			}
		}
		ctx.tags.push(...tags);
	}
	for (const name in hooks) if (hooks[name]?.length && TAG_MUTATING_HOOK_RE.test(name)) {
		cloneTagsInPlace(ctx.tags);
		break;
	}
	const hasFlatMeta = dedupeTags(ctx);
	resolveTitleTemplate(ctx, head);
	valuesToTags(ctx, hasFlatMeta);
	callHook(head, "tags:beforeResolve", ctx);
	callHook(head, "tags:resolve", ctx);
	callHook(head, "tags:afterResolve", ctx);
	return sanitizeTagsInPlace(ctx.tags);
}
// ../../../../node_modules/@unhead/vue/dist/shared/vue.DKb5ZKVl.mjs
var headSymbol = "usehead";
// @__NO_SIDE_EFFECTS__
function injectHead() {
	if (hasInjectionContext()) {
		const instance = inject(headSymbol);
		if (instance) return instance;
	}
	throw new Error("useHead() was called without provide context, ensure you call it through the setup() function.");
}
// @__NO_SIDE_EFFECTS__
function vueInstall(head) {
	return { install(app) {
		app.config.globalProperties.$unhead = head;
		app.config.globalProperties.$head = head;
		app.provide(headSymbol, head);
	} }.install;
}
// ../../../../node_modules/@unhead/vue/dist/shared/vue.D2XR8FqS.mjs
var VueResolver = /*@__PURE__*/ Object.assign((_, value) => isRef(value) ? toValue(value) : value, { _static: true });
// ../../../../node_modules/@unhead/vue/dist/shared/vue.CXwiCT15.mjs
function useHead(input, options = {}) {
	const head = options.head || /* @__PURE__ */ injectHead();
	return head.ssr ? head.push(input || {}, options) : clientUseHead(head, input, options);
}
function clientUseHead(head, input, options = {}) {
	const scope = getCurrentScope();
	if (scope && !scope.active) return {
		patch() {},
		dispose() {},
		_i: -1
	};
	const deactivated = ref(false);
	if (options.onRendered && scope) {
		const _onRendered = options.onRendered;
		options = {
			...options,
			onRendered: (ctx) => scope.run(() => _onRendered(ctx))
		};
	}
	let entry;
	watchEffect(() => {
		const i = deactivated.value ? {} : walkResolver(input, VueResolver);
		if (entry) entry.patch(i);
		else entry = head.push(i, options);
	});
	if (getCurrentInstance()) {
		onBeforeUnmount(() => {
			entry.dispose();
		});
		onDeactivated(() => {
			deactivated.value = true;
		});
		onActivated(() => {
			deactivated.value = false;
		});
	} else if (scope) onScopeDispose(() => entry.dispose());
	return entry;
}
// ../../../../node_modules/@nuxt/ui/dist/runtime/vue/stubs/base.js
var state = {};
var useState = (key, init) => {
	if (state[key]) return state[key];
	const value = ref(init());
	state[key] = value;
	return value;
};
var hooks = /*@__PURE__*/ createHooks$1();
function useNuxtApp() {
	return {
		isHydrating: true,
		payload: { serverRendered: false },
		hooks,
		hook: hooks.hook
	};
}
function defineNuxtPlugin(plugin) {
	return { install(app) {
		app.runWithContext(() => plugin({ vueApp: app }));
	} };
}
export { injectHead as a, hashTag as c, resolveTags as d, callHook as f, TagPriorityAliases as h, useHead as i, isMetaArrayDupeKey as l, HasElementTags as m, useNuxtApp as n, vueInstall as o, createHooks as p, useState as r, dedupeKey as s, defineNuxtPlugin as t, normalizeProps$1 as u };

//# sourceMappingURL=base.js.map