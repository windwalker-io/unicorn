import { a as useComponentProps, i as tv, o as Primitive, r as Icon_default, s as Slot, t as Avatar_default } from "./Avatar.js";
import { h as createSharedComposable, w as useDebounceFn } from "./dist.js";
import { t as defu } from "./defu.js";
import { i as useAppConfig } from "./iconify.js";
import { t as en_default } from "./en.js";
import { a as mergeClasses, o as omit, t as get } from "./utils2.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper.js";
import { camelize, computed, createBlock, createCommentVNode, createElementBlock, createVNode, defineComponent, getCurrentInstance, getCurrentScope, guardReactiveProps, inject, isRef, mergeProps, normalizeClass, normalizeProps, onScopeDispose, openBlock, provide, ref, renderSlot, toDisplayString, toHandlerKey, toRef, toValue, unref, useSlots, withCtx } from "vue";
//#region ../../../../node_modules/reka-ui/dist/shared/useEmitAsProps.js
/**
* The `useEmitAsProps` function is a TypeScript utility that converts emitted events into props for a
* Vue component.
*
* @template Name - The event name string union type.
* @template Fn - The emit function type.
*
* @param emit - The `emit` parameter is a function that is used to emit events from a component. It
*
* takes two parameters: `name` which is the name of the event to be emitted, and `...args` which are
* the arguments to be passed along with the event.
* @returns The function `useEmitAsProps` returns an object that maps event names to functions that
* call the `emit` function with the corresponding event name and arguments.
*/
function useEmitAsProps(emit) {
	const vm = getCurrentInstance();
	const events = vm?.type.emits;
	const result = {};
	if (!events?.length) console.warn(`No emitted event found. Please check component: ${vm?.type.__name}`);
	events?.forEach((ev) => {
		result[toHandlerKey(camelize(ev))] = (...arg) => emit(ev, ...arg);
	});
	return result;
}
//#endregion
//#region ../../../../node_modules/reka-ui/dist/VisuallyHidden/VisuallyHidden.js
var VisuallyHidden_default = /*@__PURE__*/ defineComponent({
	__name: "VisuallyHidden",
	props: {
		feature: {
			type: String,
			required: false,
			default: "focusable"
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "span"
		}
	},
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Primitive), {
				as: __props.as,
				"as-child": __props.asChild,
				"aria-hidden": __props.feature === "fully-hidden" ? "true" : void 0,
				"data-hidden": __props.feature === "fully-hidden" ? "" : void 0,
				tabindex: __props.feature === "fully-hidden" ? "-1" : void 0,
				style: {
					position: "absolute",
					border: 0,
					width: "1px",
					height: "1px",
					padding: 0,
					margin: "-1px",
					overflow: "hidden",
					clip: "rect(0, 0, 0, 0)",
					clipPath: "inset(50%)",
					whiteSpace: "nowrap",
					wordWrap: "normal",
					top: "-1px",
					left: "-1px"
				}
			}, {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 8, [
				"as",
				"as-child",
				"aria-hidden",
				"data-hidden",
				"tabindex"
			]);
		};
	}
});
var PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
var PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
var PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
function hasProtocol(inputString, opts = {}) {
	if (typeof opts === "boolean") opts = { acceptRelative: opts };
	if (opts.strict) return PROTOCOL_STRICT_REGEX.test(inputString);
	return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
//#endregion
//#region ../../../../node_modules/@nuxt/ui/dist/runtime/utils/locale.js
function buildTranslator(locale) {
	return (path, option) => translate(path, option, unref(locale));
}
function translate(path, option, locale) {
	return get(locale, `messages.${path}`, path).replace(/\{(\w+)\}/g, (_, key) => `${option?.[key] ?? `{${key}}`}`);
}
function buildLocaleContext(locale) {
	return {
		lang: computed(() => unref(locale).name),
		code: computed(() => unref(locale).code),
		dir: computed(() => unref(locale).dir),
		locale: isRef(locale) ? locale : ref(locale),
		t: buildTranslator(locale)
	};
}
//#endregion
//#region ../../../../node_modules/@nuxt/ui/dist/runtime/composables/useLocale.js
var localeContextInjectionKey = /*@__PURE__*/ Symbol.for("nuxt-ui.locale-context");
var _useLocale = (localeOverrides) => {
	const locale = localeOverrides || toRef(inject(localeContextInjectionKey, en_default));
	return buildLocaleContext(computed(() => locale.value || en_default));
};
var useLocale = /*@__PURE__*/ createSharedComposable(_useLocale);
//#endregion
//#region ../../../../node_modules/@nuxt/ui/dist/runtime/composables/useFormField.js
var formOptionsInjectionKey = /*@__PURE__*/ Symbol("nuxt-ui.form-options");
var formBusInjectionKey = /*@__PURE__*/ Symbol("nuxt-ui.form-events");
var formFieldInjectionKey = /*@__PURE__*/ Symbol("nuxt-ui.form-field");
var inputIdInjectionKey = /*@__PURE__*/ Symbol("nuxt-ui.input-id");
var formLoadingInjectionKey = /*@__PURE__*/ Symbol("nuxt-ui.form-loading");
function useFormField(props, opts) {
	const formOptions = inject(formOptionsInjectionKey, void 0);
	const formBus = inject(formBusInjectionKey, void 0);
	const formField = inject(formFieldInjectionKey, void 0);
	const inputId = inject(inputIdInjectionKey, void 0);
	provide(formFieldInjectionKey, void 0);
	if (formField && inputId) {
		if (opts?.bind === false) inputId.value = void 0;
		else if (props?.id) inputId.value = props?.id;
	}
	function emitFormEvent(type, name, flags) {
		if (formBus && formField && name) formBus.emit({
			type,
			name,
			...flags
		});
	}
	function emitFormBlur() {
		emitFormEvent("blur", formField?.value.name);
	}
	function emitFormFocus() {
		emitFormEvent("focus", formField?.value.name);
	}
	function emitFormChange() {
		emitFormEvent("change", formField?.value.name);
	}
	let disposed = false;
	if (getCurrentScope()) onScopeDispose(() => {
		disposed = true;
	});
	const validateInput = useDebounceFn(() => {
		if (disposed) return;
		emitFormEvent("input", formField?.value.name, {
			eager: !opts?.deferInputValidation || formField?.value.eagerValidation,
			track: false
		});
	}, formField?.value.validateOnInputDelay ?? formOptions?.value.validateOnInputDelay ?? 0);
	function emitFormInput() {
		emitFormEvent("input", formField?.value.name, { validate: false });
		return validateInput();
	}
	return {
		id: computed(() => props?.id ?? inputId?.value),
		labelId: computed(() => formField?.value.labelId),
		name: computed(() => props?.name ?? formField?.value.name),
		size: computed(() => props?.size ?? formField?.value.size),
		color: computed(() => formField?.value.error ? "error" : props?.color),
		highlight: computed(() => formField?.value.error ? true : props?.highlight || void 0),
		disabled: computed(() => formOptions?.value.disabled || props?.disabled || void 0),
		emitFormBlur,
		emitFormInput,
		emitFormChange,
		emitFormFocus,
		ariaAttrs: computed(() => {
			if (!formField?.value) return;
			const descriptiveAttrs = [
				"error",
				"hint",
				"description",
				"help"
			].filter((type) => formField?.value?.[type]).map((type) => `${formField?.value.ariaId}-${type}`) || [];
			const attrs = { "aria-invalid": !!formField?.value.error };
			if (descriptiveAttrs.length > 0) attrs["aria-describedby"] = descriptiveAttrs.join(" ");
			return attrs;
		})
	};
}
//#endregion
//#region ../../../../node_modules/@nuxt/ui/dist/runtime/composables/useForwardProps.js
function useForwardProps(source, emits) {
	const emitAsProps = emits ? useEmitAsProps(emits) : {};
	return computed(() => {
		const src = unref(source);
		const out = { ...emitAsProps };
		for (const key in src) {
			const value = src[key];
			if (value !== void 0) out[key] = value;
		}
		return out;
	});
}
//#endregion
//#region ../../../../node_modules/@nuxt/ui/dist/runtime/composables/useComponentIcons.js
function useComponentIcons(componentProps) {
	const appConfig = useAppConfig();
	const props = computed(() => toValue(componentProps));
	const isLeading = computed(() => props.value.icon && props.value.leading || props.value.icon && !props.value.trailing || props.value.loading && !props.value.trailing || !!props.value.leadingIcon);
	return {
		isLeading,
		isTrailing: computed(() => props.value.icon && props.value.trailing || props.value.loading && props.value.trailing && !isLeading.value || !!props.value.trailingIcon && props.value.trailing !== false),
		leadingIconName: computed(() => {
			if (props.value.loading) return props.value.loadingIcon || appConfig.ui.icons.loading;
			return props.value.leadingIcon || props.value.icon;
		}),
		trailingIconName: computed(() => {
			if (props.value.loading && !isLeading.value) return props.value.loadingIcon || appConfig.ui.icons.loading;
			return props.value.trailingIcon || props.value.icon;
		})
	};
}
//#endregion
//#region ../../../../node_modules/@nuxt/ui/dist/runtime/composables/useFieldGroup.js
var fieldGroupInjectionKey = /*@__PURE__*/ Symbol("nuxt-ui.field-group");
function useFieldGroup(props) {
	const fieldGroup = inject(fieldGroupInjectionKey, void 0);
	return {
		orientation: computed(() => fieldGroup?.value.orientation),
		size: computed(() => props?.size ?? fieldGroup?.value.size)
	};
}
var FieldGroupReset = /*@__PURE__*/ defineComponent({
	name: "FieldGroupReset",
	setup(_, { slots }) {
		provide(fieldGroupInjectionKey, computed(() => ({
			size: void 0,
			orientation: void 0
		})));
		return () => slots.default?.();
	}
});
//#endregion
//#region ../../../../node_modules/@nuxt/ui/dist/runtime/utils/link.js
var linkKeySet = /*@__PURE__*/ new Set([
	"active",
	"activeClass",
	"ariaCurrentValue",
	"as",
	"disabled",
	"download",
	"exact",
	"exactActiveClass",
	"exactHash",
	"exactQuery",
	"external",
	"form",
	"formaction",
	"formenctype",
	"formmethod",
	"formnovalidate",
	"formtarget",
	"href",
	"hreflang",
	"inactiveClass",
	"locale",
	"media",
	"noPrefetch",
	"noRel",
	"onClick",
	"ping",
	"prefetch",
	"prefetchOn",
	"prefetchedClass",
	"referrerpolicy",
	"rel",
	"replace",
	"target",
	"title",
	"to",
	"trailingSlash",
	"type",
	"viewTransition"
]);
function pickLinkProps(link) {
	const picked = {};
	for (const key of Object.keys(link)) if (linkKeySet.has(key) || key.startsWith("aria-") || key.startsWith("data-")) picked[key] = link[key];
	return picked;
}
//#endregion
//#region ../../../../node_modules/@nuxt/ui/dist/runtime/components/LinkBase.vue
var _sfc_main$2 = {
	__name: "LinkBase",
	props: {
		as: {
			type: String,
			required: false,
			default: "button"
		},
		type: {
			type: String,
			required: false,
			default: "button"
		},
		disabled: {
			type: Boolean,
			required: false
		},
		onClick: {
			type: [Function, Array],
			required: false
		},
		href: {
			type: [String, null],
			required: false
		},
		navigate: {
			type: Function,
			required: false
		},
		target: {
			type: [
				String,
				Object,
				null
			],
			required: false
		},
		rel: {
			type: [
				String,
				Object,
				null
			],
			required: false
		},
		active: {
			type: Boolean,
			required: false
		},
		isExternal: {
			type: Boolean,
			required: false
		}
	},
	setup(__props, { expose: __expose }) {
		__expose();
		const props = __props;
		function onClickWrapper(e) {
			if (props.disabled) {
				e.stopPropagation();
				e.preventDefault();
				return;
			}
			const results = [];
			if (props.onClick) for (const onClick of Array.isArray(props.onClick) ? props.onClick : [props.onClick]) results.push(onClick(e));
			if (props.href && props.navigate && !props.isExternal) props.navigate(e);
			return Promise.all(results);
		}
		const __returned__ = {
			props,
			onClickWrapper,
			get Primitive() {
				return Primitive;
			}
		};
		Object.defineProperty(__returned__, "__isScriptSetup", {
			enumerable: false,
			value: true
		});
		return __returned__;
	}
};
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
	return openBlock(), createBlock($setup["Primitive"], mergeProps($props.href ? {
		"as": "a",
		"href": $props.disabled ? void 0 : $props.href,
		"aria-disabled": $props.disabled ? "true" : void 0,
		"role": $props.disabled ? "link" : void 0,
		"tabindex": $props.disabled ? -1 : void 0
	} : $props.as === "button" ? {
		as: $props.as,
		type: $props.type,
		disabled: $props.disabled
	} : { as: $props.as }, {
		rel: $props.rel,
		target: $props.target,
		onClick: $setup.onClickWrapper
	}), {
		default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
		_: 3
	}, 16, ["rel", "target"]);
}
var LinkBase_default = /*@__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$2, [["render", _sfc_render$2], ["__file", "LinkBase.vue"]]);
//#endregion
//#region virtual:nuxt-ui-templates/ui/link.ts
var link_default = {
	"base": "outline-primary/25 focus-visible:outline-3 rounded-md",
	"variants": {
		"active": {
			"true": "text-primary",
			"false": "text-muted"
		},
		"disabled": { "true": "cursor-not-allowed opacity-75" }
	},
	"compoundVariants": [{
		"active": false,
		"disabled": false,
		"class": ["hover:text-default", "transition-colors"]
	}]
};
//#endregion
//#region ../../../../node_modules/@nuxt/ui/dist/runtime/vue/overrides/none/Link.vue
var _sfc_main$1 = /*@__PURE__*/ Object.assign({ inheritAttrs: false }, {
	__name: "Link",
	props: {
		as: {
			type: null,
			required: false,
			default: "button"
		},
		type: {
			type: null,
			required: false,
			default: "button"
		},
		disabled: {
			type: Boolean,
			required: false
		},
		active: {
			type: Boolean,
			required: false,
			default: void 0
		},
		exact: {
			type: Boolean,
			required: false
		},
		exactQuery: {
			type: [Boolean, String],
			required: false
		},
		exactHash: {
			type: Boolean,
			required: false
		},
		inactiveClass: {
			type: String,
			required: false
		},
		activeClass: {
			type: String,
			required: false
		},
		ariaCurrentValue: {
			type: String,
			required: false,
			default: "page"
		},
		custom: {
			type: Boolean,
			required: false
		},
		raw: {
			type: Boolean,
			required: false
		},
		class: {
			type: null,
			required: false
		},
		to: {
			type: String,
			required: false
		},
		href: {
			type: String,
			required: false
		},
		external: {
			type: Boolean,
			required: false
		},
		target: {
			type: [
				String,
				Object,
				null
			],
			required: false
		},
		rel: {
			type: [
				String,
				Object,
				null
			],
			required: false
		},
		noRel: {
			type: Boolean,
			required: false
		}
	},
	setup(__props, { expose: __expose }) {
		__expose();
		const props = __props;
		const appConfig = useAppConfig();
		const ui = computed(() => tv({
			extend: link_default,
			...defu({ variants: { active: {
				true: mergeClasses(appConfig.ui?.link?.variants?.active?.true, props.activeClass),
				false: mergeClasses(appConfig.ui?.link?.variants?.active?.false, props.inactiveClass)
			} } }, appConfig.ui?.link || {})
		}));
		const href = computed(() => props.to ?? props.href);
		const isExternal = computed(() => {
			if (props.target === "_blank") return true;
			if (props.external) return true;
			if (!href.value) return false;
			return hasProtocol(href.value, { acceptRelative: true });
		});
		const hasTarget = computed(() => !!props.target && props.target !== "_self");
		const isLinkActive = computed(() => {
			if (props.active !== void 0) return props.active;
			return false;
		});
		const linkClass = computed(() => {
			const active = isLinkActive.value;
			if (props.raw) return [props.class, active ? props.activeClass : props.inactiveClass];
			return ui.value({
				class: props.class,
				active,
				disabled: props.disabled
			});
		});
		const rel = computed(() => {
			if (props.noRel) return null;
			if (props.rel !== void 0) return props.rel || null;
			if (isExternal.value || hasTarget.value) return "noopener noreferrer";
			return null;
		});
		const handleNavigation = inject("nuxtui:router", void 0);
		const __returned__ = {
			props,
			appConfig,
			ui,
			href,
			isExternal,
			hasTarget,
			isLinkActive,
			linkClass,
			rel,
			handleNavigation,
			navigate: handleNavigation ? (e) => {
				handleNavigation(e, {
					href: href.value || "",
					external: isExternal.value,
					target: props.target || (isExternal.value ? "_blank" : void 0)
				});
			} : void 0,
			get theme() {
				return link_default;
			},
			computed,
			inject,
			get defu() {
				return defu;
			},
			get Slot() {
				return Slot;
			},
			get hasProtocol() {
				return hasProtocol;
			},
			get useAppConfig() {
				return useAppConfig;
			},
			get mergeClasses() {
				return mergeClasses;
			},
			get tv() {
				return tv;
			},
			ULinkBase: LinkBase_default
		};
		Object.defineProperty(__returned__, "__isScriptSetup", {
			enumerable: false,
			value: true
		});
		return __returned__;
	}
});
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
	return $props.custom ? (openBlock(), createBlock($setup["Slot"], { key: 0 }, {
		default: withCtx(() => [renderSlot(_ctx.$slots, "default", normalizeProps(guardReactiveProps({
			..._ctx.$attrs,
			as: $props.as,
			type: $props.type,
			disabled: $props.disabled,
			href: $setup.href,
			navigate: $setup.navigate,
			rel: $setup.rel,
			target: $props.target || ($setup.isExternal ? "_blank" : void 0),
			isExternal: $setup.isExternal,
			active: $setup.isLinkActive
		})))]),
		_: 3
	})) : (openBlock(), createBlock($setup["ULinkBase"], mergeProps({ key: 1 }, {
		..._ctx.$attrs,
		as: $props.as,
		type: $props.type,
		disabled: $props.disabled,
		href: $setup.href,
		navigate: $setup.navigate,
		rel: $setup.rel,
		target: $props.target || ($setup.isExternal ? "_blank" : void 0),
		isExternal: $setup.isExternal
	}, { class: $setup.linkClass }), {
		default: withCtx(() => [renderSlot(_ctx.$slots, "default", { active: $setup.isLinkActive })]),
		_: 3
	}, 16, ["class"]));
}
var Link_default = /*@__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$1, [["render", _sfc_render$1], ["__file", "Link.vue"]]);
//#endregion
//#region virtual:nuxt-ui-templates/ui/button.ts
var button_default = {
	"slots": {
		"base": ["rounded-md font-medium inline-flex items-center disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:opacity-75", "transition-colors"],
		"label": "truncate",
		"leadingIcon": "shrink-0",
		"leadingAvatar": "shrink-0",
		"leadingAvatarSize": "",
		"trailingIcon": "shrink-0"
	},
	"variants": {
		"fieldGroup": {
			"horizontal": "not-only:first:rounded-e-none not-only:last:rounded-s-none not-last:not-first:rounded-none focus-visible:z-[1]",
			"vertical": "not-only:first:rounded-b-none not-only:last:rounded-t-none not-last:not-first:rounded-none focus-visible:z-[1]"
		},
		"color": {
			"primary": "",
			"secondary": "",
			"success": "",
			"info": "",
			"warning": "",
			"error": "",
			"neutral": ""
		},
		"variant": {
			"solid": "",
			"outline": "",
			"soft": "",
			"subtle": "",
			"ghost": "",
			"link": ""
		},
		"size": {
			"xs": {
				"base": "px-2 py-1 text-xs gap-1",
				"leadingIcon": "size-4",
				"leadingAvatarSize": "3xs",
				"trailingIcon": "size-4"
			},
			"sm": {
				"base": "px-2.5 py-1.5 text-xs gap-1.5",
				"leadingIcon": "size-4",
				"leadingAvatarSize": "3xs",
				"trailingIcon": "size-4"
			},
			"md": {
				"base": "px-2.5 py-1.5 text-sm gap-1.5",
				"leadingIcon": "size-5",
				"leadingAvatarSize": "2xs",
				"trailingIcon": "size-5"
			},
			"lg": {
				"base": "px-3 py-2 text-sm gap-2",
				"leadingIcon": "size-5",
				"leadingAvatarSize": "2xs",
				"trailingIcon": "size-5"
			},
			"xl": {
				"base": "px-3 py-2 text-base gap-2",
				"leadingIcon": "size-6",
				"leadingAvatarSize": "xs",
				"trailingIcon": "size-6"
			}
		},
		"block": { "true": {
			"base": "w-full justify-center",
			"trailingIcon": "ms-auto"
		} },
		"square": { "true": "" },
		"leading": { "true": "" },
		"trailing": { "true": "" },
		"loading": { "true": "" },
		"active": {
			"true": { "base": "" },
			"false": { "base": "" }
		}
	},
	"compoundVariants": [
		{
			"color": "primary",
			"variant": "solid",
			"class": "text-inverted bg-primary hover:bg-primary/75 active:bg-primary/75 disabled:bg-primary aria-disabled:bg-primary outline-primary/25 focus-visible:outline-3"
		},
		{
			"color": "secondary",
			"variant": "solid",
			"class": "text-inverted bg-secondary hover:bg-secondary/75 active:bg-secondary/75 disabled:bg-secondary aria-disabled:bg-secondary outline-secondary/25 focus-visible:outline-3"
		},
		{
			"color": "success",
			"variant": "solid",
			"class": "text-inverted bg-success hover:bg-success/75 active:bg-success/75 disabled:bg-success aria-disabled:bg-success outline-success/25 focus-visible:outline-3"
		},
		{
			"color": "info",
			"variant": "solid",
			"class": "text-inverted bg-info hover:bg-info/75 active:bg-info/75 disabled:bg-info aria-disabled:bg-info outline-info/25 focus-visible:outline-3"
		},
		{
			"color": "warning",
			"variant": "solid",
			"class": "text-inverted bg-warning hover:bg-warning/75 active:bg-warning/75 disabled:bg-warning aria-disabled:bg-warning outline-warning/25 focus-visible:outline-3"
		},
		{
			"color": "error",
			"variant": "solid",
			"class": "text-inverted bg-error hover:bg-error/75 active:bg-error/75 disabled:bg-error aria-disabled:bg-error outline-error/25 focus-visible:outline-3"
		},
		{
			"color": "primary",
			"variant": "outline",
			"class": "ring ring-inset ring-primary/50 text-primary hover:bg-primary/10 active:bg-primary/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent outline-primary/25 focus-visible:outline-3 focus-visible:ring-primary"
		},
		{
			"color": "secondary",
			"variant": "outline",
			"class": "ring ring-inset ring-secondary/50 text-secondary hover:bg-secondary/10 active:bg-secondary/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent outline-secondary/25 focus-visible:outline-3 focus-visible:ring-secondary"
		},
		{
			"color": "success",
			"variant": "outline",
			"class": "ring ring-inset ring-success/50 text-success hover:bg-success/10 active:bg-success/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent outline-success/25 focus-visible:outline-3 focus-visible:ring-success"
		},
		{
			"color": "info",
			"variant": "outline",
			"class": "ring ring-inset ring-info/50 text-info hover:bg-info/10 active:bg-info/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent outline-info/25 focus-visible:outline-3 focus-visible:ring-info"
		},
		{
			"color": "warning",
			"variant": "outline",
			"class": "ring ring-inset ring-warning/50 text-warning hover:bg-warning/10 active:bg-warning/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent outline-warning/25 focus-visible:outline-3 focus-visible:ring-warning"
		},
		{
			"color": "error",
			"variant": "outline",
			"class": "ring ring-inset ring-error/50 text-error hover:bg-error/10 active:bg-error/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent outline-error/25 focus-visible:outline-3 focus-visible:ring-error"
		},
		{
			"color": "primary",
			"variant": "soft",
			"class": "text-primary bg-primary/10 hover:bg-primary/15 active:bg-primary/15 outline-primary/25 focus-visible:outline-3 disabled:bg-primary/10 aria-disabled:bg-primary/10"
		},
		{
			"color": "secondary",
			"variant": "soft",
			"class": "text-secondary bg-secondary/10 hover:bg-secondary/15 active:bg-secondary/15 outline-secondary/25 focus-visible:outline-3 disabled:bg-secondary/10 aria-disabled:bg-secondary/10"
		},
		{
			"color": "success",
			"variant": "soft",
			"class": "text-success bg-success/10 hover:bg-success/15 active:bg-success/15 outline-success/25 focus-visible:outline-3 disabled:bg-success/10 aria-disabled:bg-success/10"
		},
		{
			"color": "info",
			"variant": "soft",
			"class": "text-info bg-info/10 hover:bg-info/15 active:bg-info/15 outline-info/25 focus-visible:outline-3 disabled:bg-info/10 aria-disabled:bg-info/10"
		},
		{
			"color": "warning",
			"variant": "soft",
			"class": "text-warning bg-warning/10 hover:bg-warning/15 active:bg-warning/15 outline-warning/25 focus-visible:outline-3 disabled:bg-warning/10 aria-disabled:bg-warning/10"
		},
		{
			"color": "error",
			"variant": "soft",
			"class": "text-error bg-error/10 hover:bg-error/15 active:bg-error/15 outline-error/25 focus-visible:outline-3 disabled:bg-error/10 aria-disabled:bg-error/10"
		},
		{
			"color": "primary",
			"variant": "subtle",
			"class": "text-primary ring ring-inset ring-primary/25 bg-primary/10 hover:bg-primary/15 active:bg-primary/15 disabled:bg-primary/10 aria-disabled:bg-primary/10 outline-primary/25 focus-visible:outline-3 focus-visible:ring-primary"
		},
		{
			"color": "secondary",
			"variant": "subtle",
			"class": "text-secondary ring ring-inset ring-secondary/25 bg-secondary/10 hover:bg-secondary/15 active:bg-secondary/15 disabled:bg-secondary/10 aria-disabled:bg-secondary/10 outline-secondary/25 focus-visible:outline-3 focus-visible:ring-secondary"
		},
		{
			"color": "success",
			"variant": "subtle",
			"class": "text-success ring ring-inset ring-success/25 bg-success/10 hover:bg-success/15 active:bg-success/15 disabled:bg-success/10 aria-disabled:bg-success/10 outline-success/25 focus-visible:outline-3 focus-visible:ring-success"
		},
		{
			"color": "info",
			"variant": "subtle",
			"class": "text-info ring ring-inset ring-info/25 bg-info/10 hover:bg-info/15 active:bg-info/15 disabled:bg-info/10 aria-disabled:bg-info/10 outline-info/25 focus-visible:outline-3 focus-visible:ring-info"
		},
		{
			"color": "warning",
			"variant": "subtle",
			"class": "text-warning ring ring-inset ring-warning/25 bg-warning/10 hover:bg-warning/15 active:bg-warning/15 disabled:bg-warning/10 aria-disabled:bg-warning/10 outline-warning/25 focus-visible:outline-3 focus-visible:ring-warning"
		},
		{
			"color": "error",
			"variant": "subtle",
			"class": "text-error ring ring-inset ring-error/25 bg-error/10 hover:bg-error/15 active:bg-error/15 disabled:bg-error/10 aria-disabled:bg-error/10 outline-error/25 focus-visible:outline-3 focus-visible:ring-error"
		},
		{
			"color": "primary",
			"variant": "ghost",
			"class": "text-primary hover:bg-primary/10 active:bg-primary/10 outline-primary/25 focus-visible:outline-3 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent"
		},
		{
			"color": "secondary",
			"variant": "ghost",
			"class": "text-secondary hover:bg-secondary/10 active:bg-secondary/10 outline-secondary/25 focus-visible:outline-3 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent"
		},
		{
			"color": "success",
			"variant": "ghost",
			"class": "text-success hover:bg-success/10 active:bg-success/10 outline-success/25 focus-visible:outline-3 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent"
		},
		{
			"color": "info",
			"variant": "ghost",
			"class": "text-info hover:bg-info/10 active:bg-info/10 outline-info/25 focus-visible:outline-3 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent"
		},
		{
			"color": "warning",
			"variant": "ghost",
			"class": "text-warning hover:bg-warning/10 active:bg-warning/10 outline-warning/25 focus-visible:outline-3 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent"
		},
		{
			"color": "error",
			"variant": "ghost",
			"class": "text-error hover:bg-error/10 active:bg-error/10 outline-error/25 focus-visible:outline-3 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent"
		},
		{
			"color": "primary",
			"variant": "link",
			"class": "text-primary hover:text-primary/75 active:text-primary/75 disabled:text-primary aria-disabled:text-primary outline-primary/25 focus-visible:outline-3"
		},
		{
			"color": "secondary",
			"variant": "link",
			"class": "text-secondary hover:text-secondary/75 active:text-secondary/75 disabled:text-secondary aria-disabled:text-secondary outline-secondary/25 focus-visible:outline-3"
		},
		{
			"color": "success",
			"variant": "link",
			"class": "text-success hover:text-success/75 active:text-success/75 disabled:text-success aria-disabled:text-success outline-success/25 focus-visible:outline-3"
		},
		{
			"color": "info",
			"variant": "link",
			"class": "text-info hover:text-info/75 active:text-info/75 disabled:text-info aria-disabled:text-info outline-info/25 focus-visible:outline-3"
		},
		{
			"color": "warning",
			"variant": "link",
			"class": "text-warning hover:text-warning/75 active:text-warning/75 disabled:text-warning aria-disabled:text-warning outline-warning/25 focus-visible:outline-3"
		},
		{
			"color": "error",
			"variant": "link",
			"class": "text-error hover:text-error/75 active:text-error/75 disabled:text-error aria-disabled:text-error outline-error/25 focus-visible:outline-3"
		},
		{
			"color": "neutral",
			"variant": "solid",
			"class": "text-inverted bg-inverted hover:bg-inverted/90 active:bg-inverted/90 disabled:bg-inverted aria-disabled:bg-inverted outline-inverted/25 focus-visible:outline-3"
		},
		{
			"color": "neutral",
			"variant": "outline",
			"class": "ring ring-inset ring-accented text-default bg-default hover:bg-elevated active:bg-elevated disabled:bg-default aria-disabled:bg-default outline-inverted/25 focus-visible:outline-3 focus-visible:ring-inverted"
		},
		{
			"color": "neutral",
			"variant": "soft",
			"class": "text-default bg-elevated hover:bg-accented/75 active:bg-accented/75 outline-inverted/25 focus-visible:outline-3 disabled:bg-elevated aria-disabled:bg-elevated"
		},
		{
			"color": "neutral",
			"variant": "subtle",
			"class": "ring ring-inset ring-accented text-default bg-elevated hover:bg-accented/75 active:bg-accented/75 disabled:bg-elevated aria-disabled:bg-elevated outline-inverted/25 focus-visible:outline-3 focus-visible:ring-inverted"
		},
		{
			"color": "neutral",
			"variant": "ghost",
			"class": "text-default hover:bg-elevated active:bg-elevated outline-inverted/25 focus-visible:outline-3 hover:disabled:bg-transparent dark:hover:disabled:bg-transparent hover:aria-disabled:bg-transparent dark:hover:aria-disabled:bg-transparent"
		},
		{
			"color": "neutral",
			"variant": "link",
			"class": "text-muted hover:text-default active:text-default disabled:text-muted aria-disabled:text-muted outline-inverted/25 focus-visible:outline-3"
		},
		{
			"size": "xs",
			"square": true,
			"class": "p-1"
		},
		{
			"size": "sm",
			"square": true,
			"class": "p-1.5"
		},
		{
			"size": "md",
			"square": true,
			"class": "p-1.5"
		},
		{
			"size": "lg",
			"square": true,
			"class": "p-2"
		},
		{
			"size": "xl",
			"square": true,
			"class": "p-2"
		},
		{
			"loading": true,
			"leading": true,
			"class": { "leadingIcon": "animate-spin" }
		},
		{
			"loading": true,
			"leading": false,
			"trailing": true,
			"class": { "trailingIcon": "animate-spin" }
		}
	],
	"defaultVariants": {
		"color": "primary",
		"variant": "solid",
		"size": "md"
	}
};
//#endregion
//#region ../../../../node_modules/@nuxt/ui/dist/runtime/components/Button.vue
var _sfc_main = {
	__name: "Button",
	props: {
		label: {
			type: String,
			required: false
		},
		color: {
			type: null,
			required: false
		},
		activeColor: {
			type: null,
			required: false
		},
		variant: {
			type: null,
			required: false
		},
		activeVariant: {
			type: null,
			required: false
		},
		size: {
			type: null,
			required: false
		},
		square: {
			type: Boolean,
			required: false
		},
		block: {
			type: Boolean,
			required: false
		},
		loadingAuto: {
			type: Boolean,
			required: false
		},
		onClick: {
			type: [Function, Array],
			required: false
		},
		class: {
			type: null,
			required: false
		},
		ui: {
			type: Object,
			required: false
		},
		icon: {
			type: null,
			required: false
		},
		avatar: {
			type: Object,
			required: false
		},
		leading: {
			type: Boolean,
			required: false
		},
		leadingIcon: {
			type: null,
			required: false
		},
		trailing: {
			type: Boolean,
			required: false
		},
		trailingIcon: {
			type: null,
			required: false
		},
		loading: {
			type: Boolean,
			required: false
		},
		loadingIcon: {
			type: null,
			required: false
		},
		as: {
			type: null,
			required: false
		},
		type: {
			type: null,
			required: false
		},
		disabled: {
			type: Boolean,
			required: false
		},
		active: {
			type: Boolean,
			required: false
		},
		exact: {
			type: Boolean,
			required: false
		},
		exactQuery: {
			type: [Boolean, String],
			required: false
		},
		exactHash: {
			type: Boolean,
			required: false
		},
		inactiveClass: {
			type: String,
			required: false
		},
		locale: {
			type: [Boolean, String],
			required: false
		},
		to: {
			type: null,
			required: false
		},
		href: {
			type: null,
			required: false
		},
		external: {
			type: Boolean,
			required: false
		},
		target: {
			type: [
				String,
				Object,
				null
			],
			required: false
		},
		rel: {
			type: [
				String,
				Object,
				null
			],
			required: false
		},
		noRel: {
			type: Boolean,
			required: false
		},
		prefetchedClass: {
			type: String,
			required: false
		},
		prefetch: {
			type: Boolean,
			required: false
		},
		prefetchOn: {
			type: [String, Object],
			required: false
		},
		noPrefetch: {
			type: Boolean,
			required: false
		},
		trailingSlash: {
			type: String,
			required: false
		},
		activeClass: {
			type: String,
			required: false
		},
		exactActiveClass: {
			type: String,
			required: false
		},
		ariaCurrentValue: {
			type: String,
			required: false
		},
		viewTransition: {
			type: Boolean,
			required: false
		},
		replace: {
			type: Boolean,
			required: false
		}
	},
	setup(__props, { expose: __expose }) {
		__expose();
		const _props = __props;
		const slots = useSlots();
		const props = useComponentProps("button", _props);
		const appConfig = useAppConfig();
		const { orientation, size: buttonSize } = useFieldGroup(_props);
		const linkProps = useForwardProps(computed(() => pickLinkProps(props)));
		const forwardedLinkProps = computed(() => omit(linkProps.value, [
			"type",
			"disabled",
			"onClick"
		]));
		const loadingAutoState = ref(false);
		const formLoading = inject(formLoadingInjectionKey, void 0);
		async function onClickWrapper(event) {
			loadingAutoState.value = true;
			const callbacks = Array.isArray(props.onClick) ? props.onClick : [props.onClick];
			try {
				await Promise.all(callbacks.map((fn) => fn?.(event)));
			} finally {
				loadingAutoState.value = false;
			}
		}
		const isLoading = computed(() => {
			return props.loading || props.loadingAuto && (loadingAutoState.value || formLoading?.value && props.type === "submit");
		});
		const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(computed(() => ({
			icon: props.icon,
			leading: props.leading,
			leadingIcon: props.leadingIcon,
			trailing: props.trailing,
			trailingIcon: props.trailingIcon,
			loading: isLoading.value,
			loadingIcon: props.loadingIcon
		})));
		const __returned__ = {
			_props,
			slots,
			props,
			appConfig,
			orientation,
			buttonSize,
			linkProps,
			forwardedLinkProps,
			loadingAutoState,
			formLoading,
			onClickWrapper,
			isLoading,
			isLeading,
			isTrailing,
			leadingIconName,
			trailingIconName,
			ui: computed(() => tv({
				extend: button_default,
				...defu({ variants: { active: {
					true: { base: mergeClasses(appConfig.ui?.button?.variants?.active?.true?.base, props.activeClass) },
					false: { base: mergeClasses(appConfig.ui?.button?.variants?.active?.false?.base, props.inactiveClass) }
				} } }, appConfig.ui?.button || {})
			})({
				color: props.color,
				variant: props.variant,
				size: buttonSize.value ?? props.size,
				loading: isLoading.value,
				block: props.block,
				square: props.square || !slots.default && !props.label,
				leading: isLeading.value,
				trailing: isTrailing.value,
				fieldGroup: orientation.value
			})),
			get theme() {
				return button_default;
			},
			computed,
			ref,
			inject,
			get defu() {
				return defu;
			},
			get useAppConfig() {
				return useAppConfig;
			},
			get useComponentProps() {
				return useComponentProps;
			},
			get useForwardProps() {
				return useForwardProps;
			},
			get useComponentIcons() {
				return useComponentIcons;
			},
			get useFieldGroup() {
				return useFieldGroup;
			},
			get formLoadingInjectionKey() {
				return formLoadingInjectionKey;
			},
			get omit() {
				return omit;
			},
			get mergeClasses() {
				return mergeClasses;
			},
			get tv() {
				return tv;
			},
			get pickLinkProps() {
				return pickLinkProps;
			},
			UIcon: Icon_default,
			UAvatar: Avatar_default,
			ULink: Link_default,
			ULinkBase: LinkBase_default
		};
		Object.defineProperty(__returned__, "__isScriptSetup", {
			enumerable: false,
			value: true
		});
		return __returned__;
	}
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
	return openBlock(), createBlock($setup["ULink"], mergeProps({
		type: $setup.props.type,
		disabled: $setup.props.disabled || $setup.isLoading
	}, $setup.forwardedLinkProps, { custom: "" }), {
		default: withCtx(({ active, ...slotProps }) => [createVNode($setup["ULinkBase"], mergeProps({ "data-slot": "base" }, slotProps, {
			class: $setup.ui.base({
				class: [$setup.props.ui?.base, $setup.props.class],
				active,
				...active && $setup.props.activeVariant ? { variant: $setup.props.activeVariant } : {},
				...active && $setup.props.activeColor ? { color: $setup.props.activeColor } : {}
			}),
			onClick: $setup.onClickWrapper
		}), {
			default: withCtx(() => [
				renderSlot(_ctx.$slots, "leading", { ui: $setup.ui }, () => [$setup.isLeading && $setup.leadingIconName ? (openBlock(), createBlock($setup["UIcon"], {
					key: 0,
					name: $setup.leadingIconName,
					"data-slot": "leadingIcon",
					class: normalizeClass($setup.ui.leadingIcon({
						class: $setup.props.ui?.leadingIcon,
						active
					}))
				}, null, 8, ["name", "class"])) : !!$setup.props.avatar ? (openBlock(), createBlock($setup["UAvatar"], mergeProps({
					key: 1,
					size: $setup.props.ui?.leadingAvatarSize || $setup.ui.leadingAvatarSize()
				}, $setup.props.avatar, {
					"data-slot": "leadingAvatar",
					class: $setup.ui.leadingAvatar({
						class: $setup.props.ui?.leadingAvatar,
						active
					})
				}), null, 16, ["size", "class"])) : createCommentVNode("", true)]),
				renderSlot(_ctx.$slots, "default", { ui: $setup.ui }, () => [$setup.props.label !== void 0 && $setup.props.label !== null ? (openBlock(), createElementBlock("span", {
					key: 0,
					"data-slot": "label",
					class: normalizeClass($setup.ui.label({
						class: $setup.props.ui?.label,
						active
					}))
				}, toDisplayString($setup.props.label), 3)) : createCommentVNode("", true)]),
				renderSlot(_ctx.$slots, "trailing", { ui: $setup.ui }, () => [$setup.isTrailing && $setup.trailingIconName ? (openBlock(), createBlock($setup["UIcon"], {
					key: 0,
					name: $setup.trailingIconName,
					"data-slot": "trailingIcon",
					class: normalizeClass($setup.ui.trailingIcon({
						class: $setup.props.ui?.trailingIcon,
						active
					}))
				}, null, 8, ["name", "class"])) : createCommentVNode("", true)])
			]),
			_: 2
		}, 1040, ["class"])]),
		_: 3
	}, 16, ["type", "disabled"]);
}
var Button_default = /*@__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["render", _sfc_render], ["__file", "Button.vue"]]);
//#endregion
export { FieldGroupReset as a, useForwardProps as c, useLocale as d, VisuallyHidden_default as f, pickLinkProps as i, useFormField as l, Link_default as n, useFieldGroup as o, useEmitAsProps as p, LinkBase_default as r, useComponentIcons as s, Button_default as t, localeContextInjectionKey as u };

//# sourceMappingURL=Button.js.map