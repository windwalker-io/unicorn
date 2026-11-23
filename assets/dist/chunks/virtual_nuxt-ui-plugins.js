import { a as useDark } from "./dist.js";
import { a as injectHead, c as hashTag, d as resolveTags, f as callHook, h as TagPriorityAliases, i as useHead, l as isMetaArrayDupeKey, m as HasElementTags, n as useNuxtApp, o as vueInstall, p as createHooks, s as dedupeKey, t as defineNuxtPlugin, u as normalizeProps$1 } from "./base.js";
import { i as useAppConfig, n as addIcon } from "./iconify.js";
import { computed } from "vue";
//#region ../../../../node_modules/unhead/dist/shared/unhead.D7HkBzZn.mjs
function registerPlugin(head, p) {
	if (typeof p === "function" && p.key && head.plugins.has(p.key)) return;
	const plugin = typeof p === "function" ? p(head) : p;
	const key = plugin.key || String(head.plugins.size + 1);
	if (!head.plugins.get(key)) {
		head.plugins.set(key, plugin);
		for (const k in plugin.hooks || {}) head.hooks?.hook(k, plugin.hooks[k]);
	}
}
// @__NO_SIDE_EFFECTS__
function createUnhead(renderer, resolvedOptions = {}) {
	const ssr = !resolvedOptions.document;
	const entries = /* @__PURE__ */ new Map();
	const head = {
		_entryCount: 1,
		_h: 0,
		plugins: /* @__PURE__ */ new Map(),
		resolvedOptions,
		ssr,
		entries,
		hooks: void 0,
		render: () => renderer(head),
		use: (p) => registerPlugin(head, p),
		push(input, _options) {
			const _i = _options?._index ?? head._entryCount++;
			const options = _options ? { ..._options } : {};
			delete options.head;
			delete options.onRendered;
			delete options._index;
			const entry = {
				_i,
				input,
				options
			};
			entries.set(_i, entry);
			return {
				_i,
				dispose() {
					entries.delete(_i);
				},
				patch(input2) {
					if (ssr) {
						entry.input = input2;
						delete entry._tags;
					} else entry._pending = input2;
					if (!entries.has(_i)) entries.set(_i, entry);
				}
			};
		}
	};
	resolvedOptions.init?.forEach((e) => e && head.push(e));
	return head;
}
//#endregion
//#region virtual:nuxt-ui-icons
var _initialized = false;
function init(addIcon) {
	if (_initialized) return;
	const collections = JSON.parse("[{\"prefix\":\"lucide\",\"icons\":{\"align-center\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M17 12H7m12 6H5M21 6H3\\\"/>\",\"hidden\":true},\"align-justify\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M3 12h18M3 18h18M3 6h18\\\"/>\",\"hidden\":true},\"align-left\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M15 12H3m14 6H3M21 6H3\\\"/>\",\"hidden\":true},\"align-right\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M21 12H9m12 6H7M21 6H3\\\"/>\",\"hidden\":true},\"align-vertical-justify-center\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><rect width=\\\"14\\\" height=\\\"6\\\" x=\\\"5\\\" y=\\\"16\\\" rx=\\\"2\\\"/><rect width=\\\"10\\\" height=\\\"6\\\" x=\\\"7\\\" y=\\\"2\\\" rx=\\\"2\\\"/><path d=\\\"M2 12h20\\\"/></g>\"},\"align-vertical-justify-end\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><rect width=\\\"14\\\" height=\\\"6\\\" x=\\\"5\\\" y=\\\"12\\\" rx=\\\"2\\\"/><rect width=\\\"10\\\" height=\\\"6\\\" x=\\\"7\\\" y=\\\"2\\\" rx=\\\"2\\\"/><path d=\\\"M2 22h20\\\"/></g>\"},\"align-vertical-justify-start\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><rect width=\\\"14\\\" height=\\\"6\\\" x=\\\"5\\\" y=\\\"16\\\" rx=\\\"2\\\"/><rect width=\\\"10\\\" height=\\\"6\\\" x=\\\"7\\\" y=\\\"6\\\" rx=\\\"2\\\"/><path d=\\\"M2 2h20\\\"/></g>\"},\"arrow-down\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M12 5v14m7-7l-7 7l-7-7\\\"/>\"},\"arrow-down-from-line\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M19 3H5m7 18V7m-6 8l6 6l6-6\\\"/>\"},\"arrow-left\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"m12 19l-7-7l7-7m7 7H5\\\"/>\"},\"arrow-left-from-line\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"m9 6l-6 6l6 6m-6-6h14m4 7V5\\\"/>\"},\"arrow-right\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M5 12h14m-7-7l7 7l-7 7\\\"/>\"},\"arrow-right-from-line\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M3 5v14m18-7H7m8 6l6-6l-6-6\\\"/>\"},\"arrow-up\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"m5 12l7-7l7 7m-7 7V5\\\"/>\"},\"arrow-up-from-line\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"m18 9l-6-6l-6 6m6-6v14m-7 4h14\\\"/>\"},\"arrow-up-right\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M7 7h10v10M7 17L17 7\\\"/>\"},\"ban\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><circle cx=\\\"12\\\" cy=\\\"12\\\" r=\\\"10\\\"/><path d=\\\"M4.929 4.929L19.07 19.071\\\"/></g>\"},\"baseline\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M4 20h16M6 16l6-12l6 12M8 12h8\\\"/>\"},\"bold\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8\\\"/>\"},\"check\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M20 6L9 17l-5-5\\\"/>\"},\"chevron-down\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"m6 9l6 6l6-6\\\"/>\"},\"chevron-left\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"m15 18l-6-6l6-6\\\"/>\"},\"chevron-right\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"m9 18l6-6l-6-6\\\"/>\"},\"chevron-up\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"m18 15l-6-6l-6 6\\\"/>\"},\"chevrons-left\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"m11 17l-5-5l5-5m7 10l-5-5l5-5\\\"/>\"},\"chevrons-right\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"m6 17l5-5l-5-5m7 10l5-5l-5-5\\\"/>\"},\"circle-alert\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><circle cx=\\\"12\\\" cy=\\\"12\\\" r=\\\"10\\\"/><path d=\\\"M12 8v4m0 4h.01\\\"/></g>\"},\"circle-check\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><circle cx=\\\"12\\\" cy=\\\"12\\\" r=\\\"10\\\"/><path d=\\\"m16 9l-5.5 5.5L8 12\\\"/></g>\"},\"circle-x\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><circle cx=\\\"12\\\" cy=\\\"12\\\" r=\\\"10\\\"/><path d=\\\"m15 9l-6 6m0-6l6 6\\\"/></g>\"},\"clipboard\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><rect width=\\\"8\\\" height=\\\"4\\\" x=\\\"8\\\" y=\\\"2\\\" rx=\\\"1\\\" ry=\\\"1\\\"/><path d=\\\"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2\\\"/></g>\"},\"code\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"m16 18l6-6l-6-6M8 6l-6 6l6 6\\\"/>\"},\"copy\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><rect width=\\\"14\\\" height=\\\"14\\\" x=\\\"8\\\" y=\\\"8\\\" rx=\\\"2\\\" ry=\\\"2\\\"/><path d=\\\"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2\\\"/></g>\"},\"copy-check\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><path d=\\\"m12 15l2 2l4-4\\\"/><rect width=\\\"14\\\" height=\\\"14\\\" x=\\\"8\\\" y=\\\"8\\\" rx=\\\"2\\\" ry=\\\"2\\\"/><path d=\\\"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2\\\"/></g>\"},\"copy-plus\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><path d=\\\"M15 12v6m-3-3h6\\\"/><rect width=\\\"14\\\" height=\\\"14\\\" x=\\\"8\\\" y=\\\"8\\\" rx=\\\"2\\\" ry=\\\"2\\\"/><path d=\\\"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2\\\"/></g>\"},\"corner-down-left\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><path d=\\\"M20 4v7a4 4 0 0 1-4 4H4\\\"/><path d=\\\"m9 10l-5 5l5 5\\\"/></g>\"},\"download\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><path d=\\\"M12 15V3m9 12v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\\\"/><path d=\\\"m7 10l5 5l5-5\\\"/></g>\"},\"ellipsis\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><circle cx=\\\"12\\\" cy=\\\"12\\\" r=\\\"1\\\"/><circle cx=\\\"19\\\" cy=\\\"12\\\" r=\\\"1\\\"/><circle cx=\\\"5\\\" cy=\\\"12\\\" r=\\\"1\\\"/></g>\"},\"ellipsis-vertical\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><circle cx=\\\"12\\\" cy=\\\"12\\\" r=\\\"1\\\"/><circle cx=\\\"12\\\" cy=\\\"5\\\" r=\\\"1\\\"/><circle cx=\\\"12\\\" cy=\\\"19\\\" r=\\\"1\\\"/></g>\"},\"external-link\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M15 3h6v6m-11 5L21 3m-3 10v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\\\"/>\"},\"eye\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><path d=\\\"M2.062 12.348a1 1 0 0 1 0-.696a10.75 10.75 0 0 1 19.876 0a1 1 0 0 1 0 .696a10.75 10.75 0 0 1-19.876 0\\\"/><circle cx=\\\"12\\\" cy=\\\"12\\\" r=\\\"3\\\"/></g>\"},\"eye-off\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><path d=\\\"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575a1 1 0 0 1 0 .696a10.8 10.8 0 0 1-1.444 2.49m-6.41-.679a3 3 0 0 1-4.242-4.242\\\"/><path d=\\\"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151a1 1 0 0 1 0-.696a10.75 10.75 0 0 1 4.446-5.143M2 2l20 20\\\"/></g>\"},\"file\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><path d=\\\"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z\\\"/><path d=\\\"M14 2v5a1 1 0 0 0 1 1h5\\\"/></g>\"},\"folder\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z\\\"/>\"},\"folder-open\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"m6 14l1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2\\\"/>\"},\"grip-vertical\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><circle cx=\\\"9\\\" cy=\\\"12\\\" r=\\\"1\\\"/><circle cx=\\\"9\\\" cy=\\\"5\\\" r=\\\"1\\\"/><circle cx=\\\"9\\\" cy=\\\"19\\\" r=\\\"1\\\"/><circle cx=\\\"15\\\" cy=\\\"12\\\" r=\\\"1\\\"/><circle cx=\\\"15\\\" cy=\\\"5\\\" r=\\\"1\\\"/><circle cx=\\\"15\\\" cy=\\\"19\\\" r=\\\"1\\\"/></g>\"},\"hash\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M4 9h16M4 15h16M10 3L8 21m8-18l-2 18\\\"/>\"},\"heading\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M6 12h12M6 20V4m12 16V4\\\"/>\",\"hidden\":true},\"heading-1\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M4 12h8m-8 6V6m8 12V6m5 6l3-2v8\\\"/>\"},\"heading-2\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M4 12h8m-8 6V6m8 12V6m9 12h-4c0-4 4-3 4-6c0-1.5-2-2.5-4-1\\\"/>\"},\"heading-3\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M4 12h8m-8 6V6m8 12V6m5.5 4.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2m-2 3.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2\\\"/>\"},\"heading-4\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M12 18V6m5 4v3a1 1 0 0 0 1 1h3m0-4v8M4 12h8m-8 6V6\\\"/>\"},\"highlighter\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><path d=\\\"m9 11l-6 6v3h9l3-3\\\"/><path d=\\\"m22 12l-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4\\\"/></g>\"},\"image\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><rect width=\\\"18\\\" height=\\\"18\\\" x=\\\"3\\\" y=\\\"3\\\" rx=\\\"2\\\" ry=\\\"2\\\"/><circle cx=\\\"9\\\" cy=\\\"9\\\" r=\\\"2\\\"/><path d=\\\"m21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21\\\"/></g>\"},\"info\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><circle cx=\\\"12\\\" cy=\\\"12\\\" r=\\\"10\\\"/><path d=\\\"M12 16v-4m0-4h.01\\\"/></g>\"},\"italic\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M19 4h-9m4 16H5M15 4L9 20\\\"/>\"},\"lightbulb\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M15 14c.2-1 .7-1.7 1.5-2.5c1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5c.7.7 1.3 1.5 1.5 2.5m0 4h6m-5 4h4\\\"/>\"},\"link\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><path d=\\\"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71\\\"/><path d=\\\"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\\\"/></g>\"},\"list\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M3 5h.01M3 12h.01M3 19h.01M8 5h13M8 12h13M8 19h13\\\"/>\"},\"list-ordered\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M11 5h10m-10 7h10m-10 7h10M4 4h1v5M4 9h2m.5 11H3.4c0-1 2.6-1.925 2.6-3.5a1.5 1.5 0 0 0-2.6-1.02\\\"/>\"},\"loader-circle\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M21 12a9 9 0 1 1-6.219-8.56\\\"/>\"},\"menu\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M4 5h16M4 12h16M4 19h16\\\"/>\"},\"minus\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M5 12h14\\\"/>\"},\"monitor\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><rect width=\\\"20\\\" height=\\\"14\\\" x=\\\"2\\\" y=\\\"3\\\" rx=\\\"2\\\"/><path d=\\\"M8 21h8m-4-4v4\\\"/></g>\"},\"moon\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401\\\"/>\"},\"move-down\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"m8 18l4 4l4-4M12 2v20\\\"/>\"},\"move-left\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"m6 8l-4 4l4 4m-4-4h20\\\"/>\"},\"move-right\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"m18 8l4 4l-4 4M2 12h20\\\"/>\"},\"move-up\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"m8 6l4-4l4 4m-4-4v20\\\"/>\"},\"paint-bucket\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M11 7L6 2m12.992 10H2.041m19.104 6.38A3.34 3.34 0 0 1 20 16.5a3.3 3.3 0 0 1-1.145 1.88c-.575.46-.855 1.02-.855 1.595A2 2 0 0 0 20 22a2 2 0 0 0 2-2.025c0-.58-.285-1.13-.855-1.595M8.5 4.5l2.148-2.148a1.205 1.205 0 0 1 1.704 0l7.296 7.296a1.205 1.205 0 0 1 0 1.704l-7.592 7.592a3.615 3.615 0 0 1-5.112 0l-3.888-3.888a3.615 3.615 0 0 1 0-5.112L5.67 7.33\\\"/>\"},\"panel-left-close\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><rect width=\\\"18\\\" height=\\\"18\\\" x=\\\"3\\\" y=\\\"3\\\" rx=\\\"2\\\"/><path d=\\\"M9 3v18m7-6l-3-3l3-3\\\"/></g>\"},\"panel-left-open\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><rect width=\\\"18\\\" height=\\\"18\\\" x=\\\"3\\\" y=\\\"3\\\" rx=\\\"2\\\"/><path d=\\\"M9 3v18m5-12l3 3l-3 3\\\"/></g>\"},\"pencil\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497zM15 5l4 4\\\"/>\"},\"plus\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M5 12h14m-7-7v14\\\"/>\"},\"redo\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><path d=\\\"M21 7v6h-6\\\"/><path d=\\\"M3 17a9 9 0 0 1 9-9a9 9 0 0 1 6 2.3l3 2.7\\\"/></g>\"},\"remove-formatting\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M4 7V4h16v3M5 20h6m2-16L8 20m7-5l5 5m0-5l-5 5\\\"/>\"},\"repeat-2\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><path d=\\\"m2 9l3-3l3 3\\\"/><path d=\\\"M13 18H7a2 2 0 0 1-2-2V6m17 9l-3 3l-3-3\\\"/><path d=\\\"M11 6h6a2 2 0 0 1 2 2v10\\\"/></g>\"},\"replace\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><path d=\\\"M14 4a1 1 0 0 1 1-1m0 7a1 1 0 0 1-1-1m7-5a1 1 0 0 0-1-1m1 6a1 1 0 0 1-1 1M3 7l3 3l3-3\\\"/><path d=\\\"M6 10V5a2 2 0 0 1 2-2h2\\\"/><rect width=\\\"7\\\" height=\\\"7\\\" x=\\\"3\\\" y=\\\"14\\\" rx=\\\"1\\\"/></g>\"},\"rotate-ccw\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><path d=\\\"M3 12a9 9 0 1 0 9-9a9.75 9.75 0 0 0-6.74 2.74L3 8\\\"/><path d=\\\"M3 3v5h5\\\"/></g>\"},\"search\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><path d=\\\"m21 21l-4.34-4.34\\\"/><circle cx=\\\"11\\\" cy=\\\"11\\\" r=\\\"8\\\"/></g>\"},\"separator-horizontal\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"m16 16l-4 4l-4-4m-5-4h18M8 8l4-4l4 4\\\"/>\"},\"square\":{\"width\":24,\"height\":24,\"body\":\"<rect width=\\\"18\\\" height=\\\"18\\\" x=\\\"3\\\" y=\\\"3\\\" fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" rx=\\\"2\\\"/>\"},\"square-code\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><path d=\\\"m10 9l-3 3l3 3m4 0l3-3l-3-3\\\"/><rect width=\\\"18\\\" height=\\\"18\\\" x=\\\"3\\\" y=\\\"3\\\" rx=\\\"2\\\"/></g>\"},\"star\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.12 2.12 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.12 2.12 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.12 2.12 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16z\\\"/>\"},\"strikethrough\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M16 4H9a3 3 0 0 0-2.83 4M14 12a4 4 0 0 1 0 8H6m-2-8h16\\\"/>\"},\"sun\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><circle cx=\\\"12\\\" cy=\\\"12\\\" r=\\\"4\\\"/><path d=\\\"M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41\\\"/></g>\"},\"table\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><path d=\\\"M12 3v18\\\"/><rect width=\\\"18\\\" height=\\\"18\\\" x=\\\"3\\\" y=\\\"3\\\" rx=\\\"2\\\"/><path d=\\\"M3 9h18M3 15h18\\\"/></g>\"},\"table-cells-merge\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><path d=\\\"M12 21v-6m0-6V3M3 15h18M3 9h18\\\"/><rect width=\\\"18\\\" height=\\\"18\\\" x=\\\"3\\\" y=\\\"3\\\" rx=\\\"2\\\"/></g>\"},\"table-cells-split\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><path d=\\\"M12 15V9m-9 6h18M3 9h18\\\"/><rect width=\\\"18\\\" height=\\\"18\\\" x=\\\"3\\\" y=\\\"3\\\" rx=\\\"2\\\"/></g>\"},\"table-columns-split\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M14 14v2m0 4v2m0-20v2m0 4v2M2 15h8M2 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H2M2 9h8m12 6h-4m4-12h-2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h2m0-12h-4M5 3v18\\\"/>\"},\"table-properties\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><path d=\\\"M15 3v18\\\"/><rect width=\\\"18\\\" height=\\\"18\\\" x=\\\"3\\\" y=\\\"3\\\" rx=\\\"2\\\"/><path d=\\\"M21 9H3m18 6H3\\\"/></g>\"},\"table-rows-split\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M14 10h2m-1 12v-8m0-12v4M2 10h2m16 0h2M3 19h18M3 22v-6a2 2 135 0 1 2-2h14a2 2 45 0 1 2 2v6M3 2v2a2 2 45 0 0 2 2h14a2 2 135 0 0 2-2V2M8 10h2M9 22v-8M9 2v4\\\"/>\"},\"text-quote\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M17 5H3m18 7H8m13 7H8m-5-7v7\\\"/>\"},\"trash\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M10 11v6m4-6v6m5-11v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\\\"/>\"},\"triangle-alert\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"m21.73 18l-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3M12 9v4m0 4h.01\\\"/>\"},\"type\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M12 4v16M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2M9 20h6\\\"/>\"},\"underline\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M6 4v6a6 6 0 0 0 12 0V4M4 20h16\\\"/>\"},\"undo\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><path d=\\\"M3 7v6h6\\\"/><path d=\\\"M21 17a9 9 0 0 0-9-9a9 9 0 0 0-6 2.3L3 13\\\"/></g>\"},\"unlink\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"m18.84 12.25l1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07a5.006 5.006 0 0 0-6.95 0l-1.72 1.71m-6.58 6.57l-1.71 1.71a5.004 5.004 0 0 0 .12 7.07a5.006 5.006 0 0 0 6.95 0l1.71-1.71M8 2v3M2 8h3m11 11v3m3-6h3\\\"/>\"},\"upload\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M12 3v12m5-7l-5-5l-5 5m14 7v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\\\"/>\"},\"video\":{\"width\":24,\"height\":24,\"body\":\"<g fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\"><path d=\\\"m16 13l5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5\\\"/><rect width=\\\"14\\\" height=\\\"12\\\" x=\\\"2\\\" y=\\\"6\\\" rx=\\\"2\\\"/></g>\"},\"x\":{\"width\":24,\"height\":24,\"body\":\"<path fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\" stroke-width=\\\"2\\\" d=\\\"M18 6L6 18M6 6l12 12\\\"/>\"}}}]");
	for (const collection of collections) for (const [name, data] of Object.entries(collection.icons)) addIcon(collection.prefix ? collection.prefix + ":" + name : name, data);
	_initialized = true;
}
//#endregion
//#region ../../../../node_modules/@nuxt/ui/dist/runtime/vue/plugins/icons.js
var icons_default = { install() {
	init((name, data) => {
		const colon = name.indexOf(":");
		if (colon !== -1 && name.slice(0, colon).includes("-")) addIcon(name.replace(":", "-"), data);
		return addIcon(name, data);
	});
} };
//#endregion
//#region ../../../../node_modules/unhead/dist/shared/unhead.C5Bksi2B.mjs
function createClientHeadAdapter(core, hooks, render) {
	const corePush = core.push;
	const head = core;
	head.ssr = false;
	head.hooks = hooks;
	head.dirty = !!head.dirty;
	head.use = (p) => registerPlugin(head, p);
	head.render = () => render(head);
	function notify() {
		hooks.callHook("entries:updated", head);
		if (!head._b) head.render();
	}
	head.invalidate = () => {
		for (const entry of head.entries.values()) delete entry._tags;
		head.dirty = true;
		notify();
	};
	head.push = (input, entryOptions) => {
		const unhook = entryOptions?.onRendered ? hooks.hook("dom:rendered", entryOptions.onRendered) : void 0;
		const active = corePush(input, entryOptions);
		const entry = core.entries.get(active._i);
		if (entry) entry._o = input;
		head.dirty = true;
		notify();
		return {
			_i: active._i,
			patch(input2) {
				active.patch(input2);
				head.dirty = true;
				notify();
			},
			dispose() {
				unhook?.();
				if (core.entries.has(active._i)) {
					active.dispose();
					head.invalidate();
				}
			}
		};
	};
	return head;
}
//#endregion
//#region ../../../../node_modules/unhead/dist/shared/unhead.DD4N5B4k.mjs
var WHITESPACE_RE = /\s+/;
// @__NO_SIDE_EFFECTS__
function createDomRenderer(options = {}) {
	return (head) => _renderDOMHead(head, options);
}
function hasPendingEntries(head) {
	for (const entry of head.entries.values()) if (entry._pending !== void 0) return true;
	return false;
}
function createDomState(head, dom) {
	const state = {
		_d: dom,
		_t: dom.title,
		_e: /* @__PURE__ */ new Map([["htmlAttrs", dom.documentElement], ["bodyAttrs", dom.body]]),
		_p: {},
		_s: {},
		_l: /* @__PURE__ */ new Map()
	};
	for (const entry of head.entries.values()) if (entry._o !== void 0) {
		const orig = entry._o;
		for (const t of ["bodyAttrs", "htmlAttrs"]) {
			const cls = orig[t]?.class;
			if (typeof cls === "string") {
				const $el = state._e.get(t);
				for (const c of cls.split(WHITESPACE_RE)) if (c) state._p[`${t}:attr:class:${c}`] = () => $el.classList.remove(c);
			}
		}
	}
	return state;
}
function _renderDOMHead(head, options = {}) {
	const dom = options.document || head.resolvedOptions.document;
	const activeState = head._dom;
	if (!dom || head._du || activeState && activeState._d === dom && !head.dirty && !hasPendingEntries(head)) return false;
	const defaultView = dom.defaultView;
	head._du = true;
	let didRender = false;
	try {
		let track = function(key, fn, fresh) {
			renderState._s[key] = !fresh && previous[key] || fn;
			delete previous[key];
		}, trackEvent = function(id, k, ev, source, $el, target) {
			const key = `${id}:event:${k}`;
			const prev = renderState._l.get(key);
			if (prev && prev[0] === target && prev[1] === ev && prev[2] === source) {
				track(key, prev[4]);
				return;
			}
			prev?.[4]();
			const dk = `data-${k}`;
			const handler = ((e) => source.call($el, e));
			const cleanup = () => {
				target.removeEventListener(ev, handler);
				if ($el.getAttribute(dk) === "") $el.removeAttribute(dk);
				if (renderState._l.get(key)?.[3] === handler) renderState._l.delete(key);
			};
			target.addEventListener(ev, handler);
			renderState._l.set(key, [
				target,
				ev,
				source,
				handler,
				cleanup
			]);
			$el.setAttribute(dk, "");
			track(key, cleanup, true);
		}, trackCtx = function({ id, $el, tag }) {
			renderState._e.set(id, $el);
			if (!tag.tag.endsWith("Attrs")) {
				const text = tag.textContent;
				if (text != null && text !== "") {
					if (text !== $el.textContent) $el.textContent = text;
					track(`${id}:text`, () => {
						if ($el.textContent === text) $el.textContent = "";
					}, true);
				}
				const html = tag.innerHTML;
				if (html != null && html !== "") {
					if (html !== $el.innerHTML) $el.innerHTML = html;
					track(`${id}:html`, () => {
						if ($el.innerHTML === html) $el.innerHTML = "";
					}, true);
				}
				const elKey = `${id}:el`;
				track(elKey, previous[elKey] || (() => {
					$el?.remove();
					renderState._e.delete(id);
				}));
			}
			for (const k in tag.props) {
				const v = tag.props[k];
				if (k[0] === "o" && k[1] === "n" && typeof v === "function") {
					const ev = k.slice(2);
					if ($el?.dataset?.[`${k}fired`]) v.call($el, new ((defaultView?.Event) || Event)(ev));
					trackEvent(id, k, ev, v, $el, tag.tag === "bodyAttrs" && defaultView ? defaultView : $el);
					continue;
				}
				const ck = `${id}:attr:${k}`;
				if (k === "class" && v) for (const c of v) {
					const key = `${ck}:${c}`;
					track(key, previous[key] || (() => $el.classList.remove(c)));
					if (!$el.classList.contains(c)) $el.classList.add(c);
				}
				else if (k === "style" && v) for (const [sk, sv] of v) {
					const key = `${ck}:${sk}`;
					track(key, previous[key] || (() => $el.style.removeProperty(sk)));
					$el.style.setProperty(sk, sv);
				}
				else if (v !== false && v !== null) {
					if ($el.getAttribute(k) !== v) $el.setAttribute(k, v === true ? "" : String(v));
					track(ck, previous[ck] || (() => $el.removeAttribute(k)));
				}
			}
		};
		const beforeRenderCtx = {
			shouldRender: true,
			tags: []
		};
		callHook(head, "dom:beforeRender", beforeRenderCtx);
		if (!beforeRenderCtx.shouldRender) return false;
		let state = activeState;
		if (state?._d !== dom) {
			if (state) {
				for (const k in state._s) state._s[k]();
				for (const k in state._p) state._p[k]();
				state._s = state._p = {};
				state._e.clear();
				state._l.clear();
			}
			state = void 0;
		}
		if (!state) state = createDomState(head, dom);
		else state._p = state._s;
		state._s = {};
		const renderState = state;
		const previous = renderState._p;
		const pending = [];
		const frag = {};
		head.dirty = false;
		const rawTags = resolveTags(head, options.tagWeight ? { tagWeight: options.tagWeight } : void 0);
		const tags = [];
		const dupeKeyCounter = {};
		for (const tag of rawTags) {
			const count = dupeKeyCounter[tag._d] || 0;
			const id = (count ? `${tag._d}:${count}` : tag._d) || tag._h;
			const ctx = {
				tag,
				id,
				shouldRender: true
			};
			if (tag.tag === "meta" && tag._d && isMetaArrayDupeKey(tag._d)) dupeKeyCounter[tag._d] = count + 1;
			tags.push(ctx);
			if (tag.tag === "title") {
				dom.title = tag.textContent;
				track("title:", () => dom.title = renderState._t);
				continue;
			}
			ctx.$el = renderState._e.get(id);
			if (ctx.$el) trackCtx(ctx);
			else if (HasElementTags.has(tag.tag)) pending.push(ctx);
		}
		if (pending.length) {
			const tracked = new Set(renderState._e.values());
			for (const el of [...dom.body.children, ...dom.head.children]) {
				const elTag = el.tagName.toLowerCase();
				if (!HasElementTags.has(elTag) || tracked.has(el)) continue;
				const props = { innerHTML: el.innerHTML };
				for (const n of el.getAttributeNames()) props[n] = el.getAttribute(n);
				const next = normalizeProps$1({
					tag: elTag,
					props: {}
				}, props);
				next.key = el.getAttribute("data-hid") || void 0;
				const dedupe = dedupeKey(next) || hashTag(next);
				let k = dedupe;
				let c = 1;
				while (renderState._e.has(k)) k = `${dedupe}:${c++}`;
				renderState._e.set(k, el);
			}
		}
		for (const ctx of pending) {
			const found = renderState._e.get(ctx.id);
			ctx.$el = found || dom.createElement(ctx.tag.tag);
			trackCtx(ctx);
			if (!found) (frag[ctx.tag.tagPosition || "head"] ??= dom.createDocumentFragment()).appendChild(ctx.$el);
		}
		if (frag.head) dom.head.appendChild(frag.head);
		if (frag.bodyOpen) dom.body.insertBefore(frag.bodyOpen, dom.body.firstChild);
		if (frag.bodyClose) dom.body.appendChild(frag.bodyClose);
		for (const k in previous) previous[k]();
		head._dom = renderState;
		didRender = true;
		callHook(head, "dom:rendered", { renders: tags });
	} catch (e) {
		head.dirty = true;
		throw e;
	} finally {
		head._du = false;
	}
	if (didRender && (head.dirty || hasPendingEntries(head))) _renderDOMHead(head, options);
	return didRender;
}
//#endregion
//#region ../../../../node_modules/unhead/dist/shared/unhead.CaeaMM5q.mjs
var tagWeight = (tag) => typeof tag.tagPriority === "number" ? tag.tagPriority : 100 + (TagPriorityAliases[tag.tagPriority] || 0);
function createHead$1(options = {}) {
	options.document = options.document || (typeof window !== "undefined" ? document : void 0);
	const renderer = options.render || /* @__PURE__ */ createDomRenderer({ document: options.document });
	const head = createClientHeadAdapter(/* @__PURE__ */ createUnhead(renderer, {
		document: options.document,
		propResolvers: options.propResolvers,
		_tagWeight: tagWeight,
		init: []
	}), createHooks(options.hooks), renderer);
	options.plugins?.forEach((p) => head.use(p));
	options.init?.forEach((e) => e && head.push(e));
	return head;
}
//#endregion
//#region ../../../../node_modules/@unhead/vue/dist/client.mjs
// @__NO_SIDE_EFFECTS__
function createHead(options = {}) {
	const domRenderer = /* @__PURE__ */ createDomRenderer();
	let head;
	let renderId = 0;
	const debouncedRenderer = () => {
		const id = ++renderId;
		setTimeout(() => {
			if (id === renderId) domRenderer(head);
		}, 0);
	};
	head = createHead$1({
		render: debouncedRenderer,
		...options
	});
	head.install = vueInstall(head);
	return head;
}
//#endregion
//#region ../../../../node_modules/@nuxt/ui/dist/runtime/vue/plugins/head.js
var head_default = { install(app) {
	if (app._context.provides.usehead) return;
	const head = /* @__PURE__ */ createHead();
	app.use(head);
} };
//#endregion
//#region ../../../../node_modules/@nuxt/ui/dist/runtime/vue/plugins/router.js
var router_default = { install(app, options) {
	if (options?.router && typeof options.router === "function") app.provide("nuxtui:router", options.router);
} };
//#endregion
//#region ../../../../node_modules/tailwindcss/dist/chunk-DCG7AFIE.mjs
var o = {
	inherit: "inherit",
	current: "currentcolor",
	transparent: "transparent",
	black: "#000",
	white: "#fff",
	slate: {
		50: "oklch(98.4% 0.003 247.858)",
		100: "oklch(96.8% 0.007 247.896)",
		200: "oklch(92.9% 0.013 255.508)",
		300: "oklch(86.9% 0.022 252.894)",
		400: "oklch(70.4% 0.04 256.788)",
		500: "oklch(55.4% 0.046 257.417)",
		600: "oklch(44.6% 0.043 257.281)",
		700: "oklch(37.2% 0.044 257.287)",
		800: "oklch(27.9% 0.041 260.031)",
		900: "oklch(20.8% 0.042 265.755)",
		950: "oklch(12.9% 0.042 264.695)"
	},
	gray: {
		50: "oklch(98.5% 0.002 247.839)",
		100: "oklch(96.7% 0.003 264.542)",
		200: "oklch(92.8% 0.006 264.531)",
		300: "oklch(87.2% 0.01 258.338)",
		400: "oklch(70.7% 0.022 261.325)",
		500: "oklch(55.1% 0.027 264.364)",
		600: "oklch(44.6% 0.03 256.802)",
		700: "oklch(37.3% 0.034 259.733)",
		800: "oklch(27.8% 0.033 256.848)",
		900: "oklch(21% 0.034 264.665)",
		950: "oklch(13% 0.028 261.692)"
	},
	zinc: {
		50: "oklch(98.5% 0 none)",
		100: "oklch(96.7% 0.001 286.375)",
		200: "oklch(92% 0.004 286.32)",
		300: "oklch(87.1% 0.006 286.286)",
		400: "oklch(70.5% 0.015 286.067)",
		500: "oklch(55.2% 0.016 285.938)",
		600: "oklch(44.2% 0.017 285.786)",
		700: "oklch(37% 0.013 285.805)",
		800: "oklch(27.4% 0.006 286.033)",
		900: "oklch(21% 0.006 285.885)",
		950: "oklch(14.1% 0.005 285.823)"
	},
	neutral: {
		50: "oklch(98.5% 0 none)",
		100: "oklch(97% 0 none)",
		200: "oklch(92.2% 0 none)",
		300: "oklch(87% 0 none)",
		400: "oklch(70.8% 0 none)",
		500: "oklch(55.6% 0 none)",
		600: "oklch(43.9% 0 none)",
		700: "oklch(37.1% 0 none)",
		800: "oklch(26.9% 0 none)",
		900: "oklch(20.5% 0 none)",
		950: "oklch(14.5% 0 none)"
	},
	stone: {
		50: "oklch(98.5% 0.001 106.423)",
		100: "oklch(97% 0.001 106.424)",
		200: "oklch(92.3% 0.003 48.717)",
		300: "oklch(86.9% 0.005 56.366)",
		400: "oklch(70.9% 0.01 56.259)",
		500: "oklch(55.3% 0.013 58.071)",
		600: "oklch(44.4% 0.011 73.639)",
		700: "oklch(37.4% 0.01 67.558)",
		800: "oklch(26.8% 0.007 34.298)",
		900: "oklch(21.6% 0.006 56.043)",
		950: "oklch(14.7% 0.004 49.25)"
	},
	mauve: {
		50: "oklch(98.5% 0 none)",
		100: "oklch(96% 0.003 325.6)",
		200: "oklch(92.2% 0.005 325.62)",
		300: "oklch(86.5% 0.012 325.68)",
		400: "oklch(71.1% 0.019 323.02)",
		500: "oklch(54.2% 0.034 322.5)",
		600: "oklch(43.5% 0.029 321.78)",
		700: "oklch(36.4% 0.029 323.89)",
		800: "oklch(26.3% 0.024 320.12)",
		900: "oklch(21.2% 0.019 322.12)",
		950: "oklch(14.5% 0.008 326)"
	},
	olive: {
		50: "oklch(98.8% 0.003 106.5)",
		100: "oklch(96.6% 0.005 106.5)",
		200: "oklch(93% 0.007 106.5)",
		300: "oklch(88% 0.011 106.6)",
		400: "oklch(73.7% 0.021 106.9)",
		500: "oklch(58% 0.031 107.3)",
		600: "oklch(46.6% 0.025 107.3)",
		700: "oklch(39.4% 0.023 107.4)",
		800: "oklch(28.6% 0.016 107.4)",
		900: "oklch(22.8% 0.013 107.4)",
		950: "oklch(15.3% 0.006 107.1)"
	},
	mist: {
		50: "oklch(98.7% 0.002 197.1)",
		100: "oklch(96.3% 0.002 197.1)",
		200: "oklch(92.5% 0.005 214.3)",
		300: "oklch(87.2% 0.007 219.6)",
		400: "oklch(72.3% 0.014 214.4)",
		500: "oklch(56% 0.021 213.5)",
		600: "oklch(45% 0.017 213.2)",
		700: "oklch(37.8% 0.015 216)",
		800: "oklch(27.5% 0.011 216.9)",
		900: "oklch(21.8% 0.008 223.9)",
		950: "oklch(14.8% 0.004 228.8)"
	},
	taupe: {
		50: "oklch(98.6% 0.002 67.8)",
		100: "oklch(96% 0.002 17.2)",
		200: "oklch(92.2% 0.005 34.3)",
		300: "oklch(86.8% 0.007 39.5)",
		400: "oklch(71.4% 0.014 41.2)",
		500: "oklch(54.7% 0.021 43.1)",
		600: "oklch(43.8% 0.017 39.3)",
		700: "oklch(36.7% 0.016 35.7)",
		800: "oklch(26.8% 0.011 36.5)",
		900: "oklch(21.4% 0.009 43.1)",
		950: "oklch(14.7% 0.004 49.3)"
	},
	red: {
		50: "oklch(97.1% 0.013 17.38)",
		100: "oklch(93.6% 0.032 17.717)",
		200: "oklch(88.5% 0.062 18.334)",
		300: "oklch(80.8% 0.114 19.571)",
		400: "oklch(70.4% 0.191 22.216)",
		500: "oklch(63.7% 0.237 25.331)",
		600: "oklch(57.7% 0.245 27.325)",
		700: "oklch(50.5% 0.213 27.518)",
		800: "oklch(44.4% 0.177 26.899)",
		900: "oklch(39.6% 0.141 25.723)",
		950: "oklch(25.8% 0.092 26.042)"
	},
	orange: {
		50: "oklch(98% 0.016 73.684)",
		100: "oklch(95.4% 0.038 75.164)",
		200: "oklch(90.1% 0.076 70.697)",
		300: "oklch(83.7% 0.128 66.29)",
		400: "oklch(75% 0.183 55.934)",
		500: "oklch(70.5% 0.213 47.604)",
		600: "oklch(64.6% 0.222 41.116)",
		700: "oklch(55.3% 0.195 38.402)",
		800: "oklch(47% 0.157 37.304)",
		900: "oklch(40.8% 0.123 38.172)",
		950: "oklch(26.6% 0.079 36.259)"
	},
	amber: {
		50: "oklch(98.7% 0.022 95.277)",
		100: "oklch(96.2% 0.059 95.617)",
		200: "oklch(92.4% 0.12 95.746)",
		300: "oklch(87.9% 0.169 91.605)",
		400: "oklch(82.8% 0.189 84.429)",
		500: "oklch(76.9% 0.188 70.08)",
		600: "oklch(66.6% 0.179 58.318)",
		700: "oklch(55.5% 0.163 48.998)",
		800: "oklch(47.3% 0.137 46.201)",
		900: "oklch(41.4% 0.112 45.904)",
		950: "oklch(27.9% 0.077 45.635)"
	},
	yellow: {
		50: "oklch(98.7% 0.026 102.212)",
		100: "oklch(97.3% 0.071 103.193)",
		200: "oklch(94.5% 0.129 101.54)",
		300: "oklch(90.5% 0.182 98.111)",
		400: "oklch(85.2% 0.199 91.936)",
		500: "oklch(79.5% 0.184 86.047)",
		600: "oklch(68.1% 0.162 75.834)",
		700: "oklch(55.4% 0.135 66.442)",
		800: "oklch(47.6% 0.114 61.907)",
		900: "oklch(42.1% 0.095 57.708)",
		950: "oklch(28.6% 0.066 53.813)"
	},
	lime: {
		50: "oklch(98.6% 0.031 120.757)",
		100: "oklch(96.7% 0.067 122.328)",
		200: "oklch(93.8% 0.127 124.321)",
		300: "oklch(89.7% 0.196 126.665)",
		400: "oklch(84.1% 0.238 128.85)",
		500: "oklch(76.8% 0.233 130.85)",
		600: "oklch(64.8% 0.2 131.684)",
		700: "oklch(53.2% 0.157 131.589)",
		800: "oklch(45.3% 0.124 130.933)",
		900: "oklch(40.5% 0.101 131.063)",
		950: "oklch(27.4% 0.072 132.109)"
	},
	green: {
		50: "oklch(98.2% 0.018 155.826)",
		100: "oklch(96.2% 0.044 156.743)",
		200: "oklch(92.5% 0.084 155.995)",
		300: "oklch(87.1% 0.15 154.449)",
		400: "oklch(79.2% 0.209 151.711)",
		500: "oklch(72.3% 0.219 149.579)",
		600: "oklch(62.7% 0.194 149.214)",
		700: "oklch(52.7% 0.154 150.069)",
		800: "oklch(44.8% 0.119 151.328)",
		900: "oklch(39.3% 0.095 152.535)",
		950: "oklch(26.6% 0.065 152.934)"
	},
	emerald: {
		50: "oklch(97.9% 0.021 166.113)",
		100: "oklch(95% 0.052 163.051)",
		200: "oklch(90.5% 0.093 164.15)",
		300: "oklch(84.5% 0.143 164.978)",
		400: "oklch(76.5% 0.177 163.223)",
		500: "oklch(69.6% 0.17 162.48)",
		600: "oklch(59.6% 0.145 163.225)",
		700: "oklch(50.8% 0.118 165.612)",
		800: "oklch(43.2% 0.095 166.913)",
		900: "oklch(37.8% 0.077 168.94)",
		950: "oklch(26.2% 0.051 172.552)"
	},
	teal: {
		50: "oklch(98.4% 0.014 180.72)",
		100: "oklch(95.3% 0.051 180.801)",
		200: "oklch(91% 0.096 180.426)",
		300: "oklch(85.5% 0.138 181.071)",
		400: "oklch(77.7% 0.152 181.912)",
		500: "oklch(70.4% 0.14 182.503)",
		600: "oklch(60% 0.118 184.704)",
		700: "oklch(51.1% 0.096 186.391)",
		800: "oklch(43.7% 0.078 188.216)",
		900: "oklch(38.6% 0.063 188.416)",
		950: "oklch(27.7% 0.046 192.524)"
	},
	cyan: {
		50: "oklch(98.4% 0.019 200.873)",
		100: "oklch(95.6% 0.045 203.388)",
		200: "oklch(91.7% 0.08 205.041)",
		300: "oklch(86.5% 0.127 207.078)",
		400: "oklch(78.9% 0.154 211.53)",
		500: "oklch(71.5% 0.143 215.221)",
		600: "oklch(60.9% 0.126 221.723)",
		700: "oklch(52% 0.105 223.128)",
		800: "oklch(45% 0.085 224.283)",
		900: "oklch(39.8% 0.07 227.392)",
		950: "oklch(30.2% 0.056 229.695)"
	},
	sky: {
		50: "oklch(97.7% 0.013 236.62)",
		100: "oklch(95.1% 0.026 236.824)",
		200: "oklch(90.1% 0.058 230.902)",
		300: "oklch(82.8% 0.111 230.318)",
		400: "oklch(74.6% 0.16 232.661)",
		500: "oklch(68.5% 0.169 237.323)",
		600: "oklch(58.8% 0.158 241.966)",
		700: "oklch(50% 0.134 242.749)",
		800: "oklch(44.3% 0.11 240.79)",
		900: "oklch(39.1% 0.09 240.876)",
		950: "oklch(29.3% 0.066 243.157)"
	},
	blue: {
		50: "oklch(97% 0.014 254.604)",
		100: "oklch(93.2% 0.032 255.585)",
		200: "oklch(88.2% 0.059 254.128)",
		300: "oklch(80.9% 0.105 251.813)",
		400: "oklch(70.7% 0.165 254.624)",
		500: "oklch(62.3% 0.214 259.815)",
		600: "oklch(54.6% 0.245 262.881)",
		700: "oklch(48.8% 0.243 264.376)",
		800: "oklch(42.4% 0.199 265.638)",
		900: "oklch(37.9% 0.146 265.522)",
		950: "oklch(28.2% 0.091 267.935)"
	},
	indigo: {
		50: "oklch(96.2% 0.018 272.314)",
		100: "oklch(93% 0.034 272.788)",
		200: "oklch(87% 0.065 274.039)",
		300: "oklch(78.5% 0.115 274.713)",
		400: "oklch(67.3% 0.182 276.935)",
		500: "oklch(58.5% 0.233 277.117)",
		600: "oklch(51.1% 0.262 276.966)",
		700: "oklch(45.7% 0.24 277.023)",
		800: "oklch(39.8% 0.195 277.366)",
		900: "oklch(35.9% 0.144 278.697)",
		950: "oklch(25.7% 0.09 281.288)"
	},
	violet: {
		50: "oklch(96.9% 0.016 293.756)",
		100: "oklch(94.3% 0.029 294.588)",
		200: "oklch(89.4% 0.057 293.283)",
		300: "oklch(81.1% 0.111 293.571)",
		400: "oklch(70.2% 0.183 293.541)",
		500: "oklch(60.6% 0.25 292.717)",
		600: "oklch(54.1% 0.281 293.009)",
		700: "oklch(49.1% 0.27 292.581)",
		800: "oklch(43.2% 0.232 292.759)",
		900: "oklch(38% 0.189 293.745)",
		950: "oklch(28.3% 0.141 291.089)"
	},
	purple: {
		50: "oklch(97.7% 0.014 308.299)",
		100: "oklch(94.6% 0.033 307.174)",
		200: "oklch(90.2% 0.063 306.703)",
		300: "oklch(82.7% 0.119 306.383)",
		400: "oklch(71.4% 0.203 305.504)",
		500: "oklch(62.7% 0.265 303.9)",
		600: "oklch(55.8% 0.288 302.321)",
		700: "oklch(49.6% 0.265 301.924)",
		800: "oklch(43.8% 0.218 303.724)",
		900: "oklch(38.1% 0.176 304.987)",
		950: "oklch(29.1% 0.149 302.717)"
	},
	fuchsia: {
		50: "oklch(97.7% 0.017 320.058)",
		100: "oklch(95.2% 0.037 318.852)",
		200: "oklch(90.3% 0.076 319.62)",
		300: "oklch(83.3% 0.145 321.434)",
		400: "oklch(74% 0.238 322.16)",
		500: "oklch(66.7% 0.295 322.15)",
		600: "oklch(59.1% 0.293 322.896)",
		700: "oklch(51.8% 0.253 323.949)",
		800: "oklch(45.2% 0.211 324.591)",
		900: "oklch(40.1% 0.17 325.612)",
		950: "oklch(29.3% 0.136 325.661)"
	},
	pink: {
		50: "oklch(97.1% 0.014 343.198)",
		100: "oklch(94.8% 0.028 342.258)",
		200: "oklch(89.9% 0.061 343.231)",
		300: "oklch(82.3% 0.12 346.018)",
		400: "oklch(71.8% 0.202 349.761)",
		500: "oklch(65.6% 0.241 354.308)",
		600: "oklch(59.2% 0.249 0.584)",
		700: "oklch(52.5% 0.223 3.958)",
		800: "oklch(45.9% 0.187 3.815)",
		900: "oklch(40.8% 0.153 2.432)",
		950: "oklch(28.4% 0.109 3.907)"
	},
	rose: {
		50: "oklch(96.9% 0.015 12.422)",
		100: "oklch(94.1% 0.03 12.58)",
		200: "oklch(89.2% 0.058 10.001)",
		300: "oklch(81% 0.117 11.638)",
		400: "oklch(71.2% 0.194 13.428)",
		500: "oklch(64.5% 0.246 16.439)",
		600: "oklch(58.6% 0.253 17.585)",
		700: "oklch(51.4% 0.222 16.935)",
		800: "oklch(45.5% 0.188 13.697)",
		900: "oklch(41% 0.159 10.272)",
		950: "oklch(27.1% 0.105 12.094)"
	}
};
//#endregion
//#region ../../../../node_modules/@nuxt/ui/dist/runtime/plugins/colors.js
var shades = [
	50,
	100,
	200,
	300,
	400,
	500,
	600,
	700,
	800,
	900,
	950
];
function getColor(color, shade) {
	if (color in o && typeof o[color] === "object" && shade in o[color]) return o[color][shade];
	return "";
}
function generateShades(key, value, prefix) {
	const prefixStr = prefix ? `${prefix}-` : "";
	return `${shades.map((shade) => `--ui-color-${key}-${shade}: var(--${prefixStr}color-${value === "neutral" ? "old-neutral" : value}-${shade}, ${getColor(value, shade)});`).join("\n  ")}`;
}
function generateColor(key, shade) {
	return `--ui-${key}: var(--ui-color-${key}-${shade});`;
}
function removeTemporaryColorsStyle() {
	document.querySelector("[data-nuxt-ui-colors]")?.remove();
}
var colors_default = /*@__PURE__*/ defineNuxtPlugin(() => {
	const appConfig = useAppConfig();
	const nuxtApp = useNuxtApp();
	const root = computed(() => {
		const { neutral, ...colors2 } = appConfig.ui.colors;
		const prefix = appConfig.ui.prefix;
		return `@layer theme {
  :root, :host {
  ${Object.entries(appConfig.ui.colors).map(([key, value]) => generateShades(key, value, prefix)).join("\n  ")}
  }
  :root, :host, .light {
  ${Object.keys(colors2).map((key) => generateColor(key, 500)).join("\n  ")}
  }
  .dark {
  ${Object.keys(colors2).map((key) => generateColor(key, 400)).join("\n  ")}
  }
}`;
	});
	const headData = { style: [{
		innerHTML: root,
		tagPriority: "critical",
		id: "nuxt-ui-colors"
	}] };
	if (nuxtApp.isHydrating && !nuxtApp.payload.serverRendered) {
		const style = document.createElement("style");
		style.innerHTML = root.value;
		style.setAttribute("data-nuxt-ui-colors", "");
		document.head.appendChild(style);
		const unhook = injectHead().hooks?.hook("dom:rendered", () => {
			removeTemporaryColorsStyle();
			unhook?.();
		});
	}
	useHead(headData);
});
//#endregion
//#region ../../../../node_modules/@nuxt/ui/dist/runtime/vue/plugins/color-mode.js
var color_mode_default = { install() {
	useDark();
} };
//#endregion
//#region virtual:nuxt-ui-plugins
var virtual_nuxt_ui_plugins_default = { install(app, pluginOptions = {}) {
	app.use(icons_default, pluginOptions);
	app.use(head_default, pluginOptions);
	app.use(router_default, pluginOptions);
	app.use(colors_default, pluginOptions);
	app.use(color_mode_default, pluginOptions);
} };
//#endregion
export { virtual_nuxt_ui_plugins_default as default };

//# sourceMappingURL=virtual_nuxt-ui-plugins.js.map