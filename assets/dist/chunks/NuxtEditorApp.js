import { a as useComponentProps, c as renderSlotFragments, i as tv, l as createContext, o as Primitive, r as Icon_default, s as Slot, t as Avatar_default } from "./Avatar.js";
import { C as tryOnScopeDispose, E as useTimeoutFn, S as tryOnBeforeUnmount, _ as isIOS, b as refAutoReset, f as useVModel, g as isClient, h as createSharedComposable, i as unrefElement, l as useMounted, m as createGlobalState, n as defaultWindow, p as createEventHook, r as onKeyStroke, s as useEventListener, t as createReusableTemplate, v as reactiveOmit, x as syncRef, y as reactivePick } from "./dist.js";
import { a as FieldGroupReset, c as useForwardProps$1, d as useLocale, f as VisuallyHidden_default, i as pickLinkProps, l as useFormField, m as useEmitAsProps, n as Link_default, o as useFieldGroup, p as useForwardProps, r as LinkBase_default, s as useComponentIcons, t as Button_default, u as localeContextInjectionKey } from "./Button.js";
import { i as useAppConfig } from "./iconify.js";
import { i as useHead, r as useState } from "./base.js";
import { i as looseToNumber, l as transformUI, n as isArrayOfArray, o as omit, r as isEmpty, s as pick, t as get } from "./utils.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper.js";
import { t as en_default } from "./en.js";
import { t as defu } from "./defu.js";
import { a as autoUpdate, c as hide, d as shift, f as size, i as arrow$2, l as limitShift, m as isNode, n as createHandlers, o as computePosition, p as getNodeName, s as flip, t as buildFloatingUIMiddleware, u as offset } from "./editor.js";
import { n as trans } from "./lang.js";
import { a as resolveColors, i as createColorMenu, n as attrsOf, o as toBackground, r as parseEmbedInput } from "./nuxt-editor.js";
import * as vue from "vue";
import { Fragment, Teleport, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createSlots, createTextVNode, createVNode, defineAsyncComponent, defineComponent, getCurrentInstance, getCurrentScope, guardReactiveProps, h, inject, isRef, markRaw, mergeDefaults, mergeModels, mergeProps, nextTick, normalizeClass, normalizeProps, normalizeStyle, onBeforeMount, onBeforeUnmount, onMounted, onScopeDispose, onUnmounted, onUpdated, openBlock, provide, reactive, ref, renderList, renderSlot, resolveDynamicComponent, shallowReactive, shallowReadonly, shallowRef, toDisplayString, toHandlers, toRef, toRefs, toValue, triggerRef, unref, useAttrs, useId, useModel, useSlots, useTemplateRef, watch, watchEffect, watchPostEffect, watchSyncEffect, withCtx, withKeys, withMemo, withModifiers } from "vue";
import { mergeAttributes } from "@tiptap/core";
import Code from "@tiptap/extension-code";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Image from "@tiptap/extension-image";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import { Markdown } from "@tiptap/markdown";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, VueRenderer, useEditor } from "@tiptap/vue-3";
import DragHandle from "@tiptap/extension-drag-handle-vue-3";
import { BubbleMenu, FloatingMenu } from "@tiptap/vue-3/menus";
import Suggestion from "@tiptap/suggestion";
import { PluginKey } from "@tiptap/pm/state";
// ../../../../node_modules/reka-ui/dist/shared/getActiveElement.js
function getActiveElement() {
	let activeElement = document.activeElement;
	if (activeElement == null) return null;
	while (activeElement != null && activeElement.shadowRoot != null && activeElement.shadowRoot.activeElement != null) activeElement = activeElement.shadowRoot.activeElement;
	return activeElement;
}
// ../../../../node_modules/reka-ui/dist/shared/handleAndDispatchCustomEvent.js
function handleAndDispatchCustomEvent$1(name, handler, detail) {
	const target = detail.originalEvent.target;
	const event = new CustomEvent(name, {
		bubbles: false,
		cancelable: true,
		detail
	});
	if (handler) target.addEventListener(name, handler, { once: true });
	target.dispatchEvent(event);
}
// ../../../../node_modules/reka-ui/dist/shared/isHTMLElement.js
function isHTMLElement(node) {
	if (typeof window === "undefined" || typeof node !== "object" || node === null) return false;
	const ownerWindow = node.ownerDocument?.defaultView ?? window;
	return node instanceof HTMLElement || node instanceof ownerWindow.HTMLElement;
}
// ../../../../node_modules/reka-ui/dist/shared/useArrowNavigation.js
var ignoredElement = ["INPUT", "TEXTAREA"];
/**
* Allow arrow navigation for every html element with data-reka-collection-item tag
*
* @param e               Keyboard event
* @param currentElement  Event initiator element or any element that wants to handle the navigation
* @param parentElement   Parent element where contains all the collection items, this will collect every item to be used when nav
* @param options         further options
* @returns               the navigated html element or null if none
*/
function useArrowNavigation(e, currentElement, parentElement, options = {}) {
	if (!currentElement || options.enableIgnoredElement && ignoredElement.includes(currentElement.nodeName)) return null;
	const { arrowKeyOptions = "both", attributeName = "[data-reka-collection-item]", itemsArray = [], loop = true, dir = "ltr", preventScroll = true, focus = false } = options;
	const [right, left, up, down, home, end] = [
		e.key === "ArrowRight",
		e.key === "ArrowLeft",
		e.key === "ArrowUp",
		e.key === "ArrowDown",
		e.key === "Home",
		e.key === "End"
	];
	const goingVertical = up || down;
	const goingHorizontal = right || left;
	if (!home && !end && (!goingVertical && !goingHorizontal || arrowKeyOptions === "vertical" && goingHorizontal || arrowKeyOptions === "horizontal" && goingVertical)) return null;
	const allCollectionItems = parentElement ? Array.from(parentElement.querySelectorAll(attributeName)) : itemsArray;
	if (!allCollectionItems.length) return null;
	if (preventScroll) e.preventDefault();
	let item = null;
	if (goingHorizontal || goingVertical) item = findNextFocusableElement(allCollectionItems, currentElement, {
		goForward: goingVertical ? down : dir === "ltr" ? right : left,
		loop
	});
	else if (home) item = allCollectionItems.at(0) || null;
	else if (end) item = allCollectionItems.at(-1) || null;
	if (focus) item?.focus();
	return item;
}
/**
* Recursive function to find the next focusable element to avoid disabled elements
*
* @param elements Elements to navigate
* @param currentElement Current active element
* @param options
* @returns next focusable element
*/
function findNextFocusableElement(elements, currentElement, options, iterations = !elements.includes(currentElement) ? elements.length + 1 : elements.length) {
	if (--iterations === 0) return null;
	const index = elements.indexOf(currentElement);
	let newIndex;
	if (index === -1) newIndex = options.goForward ? 0 : elements.length - 1;
	else newIndex = options.goForward ? index + 1 : index - 1;
	if (!options.loop && (newIndex < 0 || newIndex >= elements.length)) return null;
	const candidate = elements[(newIndex + elements.length) % elements.length];
	if (!candidate) return null;
	if (candidate.hasAttribute("disabled") && candidate.getAttribute("disabled") !== "false") return findNextFocusableElement(elements, candidate, options, iterations);
	return candidate;
}
// ../../../../node_modules/reka-ui/dist/ConfigProvider/ConfigProvider.js
var [injectConfigProviderContext, provideConfigProviderContext] = /*@__PURE__*/ createContext("ConfigProvider");
var ConfigProvider_default = /*@__PURE__*/ defineComponent({
	inheritAttrs: false,
	__name: "ConfigProvider",
	props: {
		dir: {
			type: String,
			required: false,
			default: "ltr"
		},
		locale: {
			type: String,
			required: false,
			default: "en"
		},
		scrollBody: {
			type: [Boolean, Object],
			required: false,
			default: true
		},
		nonce: {
			type: String,
			required: false,
			default: void 0
		},
		teleportTo: {
			type: null,
			required: false,
			default: void 0
		},
		useId: {
			type: Function,
			required: false,
			default: void 0
		}
	},
	setup(__props) {
		const props = __props;
		const { dir, locale, scrollBody, nonce, teleportTo } = toRefs(props);
		provideConfigProviderContext({
			dir,
			locale,
			scrollBody,
			nonce,
			teleportTo,
			useId: props.useId
		});
		return (_ctx, _cache) => {
			return renderSlot(_ctx.$slots, "default");
		};
	}
});
// ../../../../node_modules/reka-ui/dist/shared/bodyPointerEvents.js
var locks = /*@__PURE__*/ new WeakMap();
/**
* Adds `owner` to the body `pointer-events` lock of `doc` and sets it to `none`.
* The first owner saves the body's current inline value.
*/
function acquireBodyPointerEvents(doc, owner) {
	let lock = locks.get(doc);
	if (!lock) {
		lock = {
			owners: /* @__PURE__ */ new Set(),
			original: doc.body.style.pointerEvents
		};
		locks.set(doc, lock);
	}
	lock.owners.add(owner);
	doc.body.style.pointerEvents = "none";
}
/**
* Removes `owner` from the lock of `doc`; the last owner out restores the saved
* value. Releasing an owner that never acquired is a no-op.
*/
function releaseBodyPointerEvents(doc, owner) {
	const lock = locks.get(doc);
	if (!lock?.owners.delete(owner)) return;
	if (lock.owners.size === 0) {
		locks.delete(doc);
		doc.body.style.pointerEvents = lock.original;
	}
}
// ../../../../node_modules/reka-ui/dist/shared/useBodyScrollLock.js
var pointerEventsOwner = /*@__PURE__*/ Symbol("useBodyScrollLock");
var useBodyLockStackCount = /*@__PURE__*/ createSharedComposable(() => {
	const map = ref(/* @__PURE__ */ new Map());
	const initialOverflow = ref();
	const locked = computed(() => {
		for (const value of map.value.values()) if (value) return true;
		return false;
	});
	const context = injectConfigProviderContext({ scrollBody: ref(true) });
	let stopTouchMoveListener = null;
	const resetBodyStyle = () => {
		document.body.style.paddingRight = "";
		document.body.style.marginRight = "";
		releaseBodyPointerEvents(document, pointerEventsOwner);
		document.documentElement.style.removeProperty("--scrollbar-width");
		document.body.style.overflow = initialOverflow.value ?? "";
		isIOS && stopTouchMoveListener?.();
		initialOverflow.value = void 0;
	};
	watch(locked, (val, oldVal) => {
		if (!isClient) return;
		if (!val) {
			if (oldVal) resetBodyStyle();
			return;
		}
		if (initialOverflow.value === void 0) initialOverflow.value = document.body.style.overflow;
		const verticalScrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
		const defaultConfig = {
			padding: verticalScrollbarWidth,
			margin: 0
		};
		const config = context.scrollBody?.value ? typeof context.scrollBody.value === "object" ? defu({
			padding: context.scrollBody.value.padding === true ? verticalScrollbarWidth : context.scrollBody.value.padding,
			margin: context.scrollBody.value.margin === true ? verticalScrollbarWidth : context.scrollBody.value.margin
		}, defaultConfig) : defaultConfig : {
			padding: 0,
			margin: 0
		};
		if (verticalScrollbarWidth > 0) {
			document.body.style.paddingRight = typeof config.padding === "number" ? `${config.padding}px` : String(config.padding);
			document.body.style.marginRight = typeof config.margin === "number" ? `${config.margin}px` : String(config.margin);
			document.documentElement.style.setProperty("--scrollbar-width", `${verticalScrollbarWidth}px`);
			document.body.style.overflow = "hidden";
		}
		if (isIOS) stopTouchMoveListener = useEventListener(document, "touchmove", (e) => preventDefault(e), { passive: false });
		nextTick(() => {
			if (!locked.value) return;
			acquireBodyPointerEvents(document, pointerEventsOwner);
			document.body.style.overflow = "hidden";
		});
	}, {
		immediate: true,
		flush: "sync"
	});
	return map;
});
function useBodyScrollLock(initialState) {
	const id = Math.random().toString(36).substring(2, 7);
	const map = useBodyLockStackCount();
	map.value.set(id, initialState ?? false);
	const locked = computed({
		get: () => map.value.get(id) ?? false,
		set: (value) => map.value.set(id, value)
	});
	tryOnBeforeUnmount(() => {
		map.value.delete(id);
	});
	return locked;
}
function checkOverflowScroll(ele) {
	const style = window.getComputedStyle(ele);
	if (style.overflowX === "scroll" || style.overflowY === "scroll" || style.overflowX === "auto" && ele.clientWidth < ele.scrollWidth || style.overflowY === "auto" && ele.clientHeight < ele.scrollHeight) return true;
	else {
		const parent = ele.parentNode;
		if (!(parent instanceof Element) || parent.tagName === "BODY") return false;
		return checkOverflowScroll(parent);
	}
}
function preventDefault(rawEvent) {
	const e = rawEvent || window.event;
	const _target = e.target;
	if (_target instanceof Element && checkOverflowScroll(_target)) return false;
	if (e.touches.length > 1) return true;
	if (e.preventDefault && e.cancelable) e.preventDefault();
	return false;
}
// ../../../../node_modules/reka-ui/dist/shared/useComposing.js
var imeScriptRE = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\p{Script=Bopomofo}]/u;
var androidRE = /android/i;
function isAndroid() {
	return typeof navigator !== "undefined" && androidRE.test(navigator.userAgent);
}
function useComposing(onEnd) {
	const isComposing = ref(false);
	const isImeComposition = ref(true);
	const sawImeScript = ref(false);
	const shouldDeferInput = computed(() => isComposing.value && isImeComposition.value);
	function handleCompositionStart() {
		isComposing.value = true;
		isImeComposition.value = true;
		sawImeScript.value = false;
	}
	function handleCompositionUpdate(event) {
		if (!event.data) return;
		if (imeScriptRE.test(event.data)) {
			isImeComposition.value = true;
			sawImeScript.value = true;
		} else if (isAndroid() && !sawImeScript.value) isImeComposition.value = false;
	}
	function handleCompositionEnd(event) {
		nextTick(() => {
			isComposing.value = false;
			onEnd?.(event);
		});
	}
	return {
		isComposing,
		shouldDeferInput,
		handleCompositionStart,
		handleCompositionUpdate,
		handleCompositionEnd
	};
}
// ../../../../node_modules/reka-ui/dist/shared/useDirection.js
/**
* The `useDirection` function provides a way to access the current direction in your application.
* @param {Ref<Direction | undefined>} [dir] - An optional ref containing the direction (ltr or rtl).
* @returns  computed value that combines with the resolved direction.
*/
function useDirection(dir) {
	const context = injectConfigProviderContext({ dir: ref("ltr") });
	return computed(() => dir?.value || context.dir?.value || "ltr");
}
// ../../../../node_modules/reka-ui/dist/shared/useFilter.js
/**
* Provides locale-aware string filtering functions.
* Uses `Intl.Collator` for comparison to ensure proper Unicode handling.
*
* @param options - Optional collator options to customize comparison behavior.
*   See [Intl.CollatorOptions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator/Collator#options) for details.
* @returns An object with methods to check if a string starts with, ends with, or contains a substring.
*
* @example
* const { startsWith, endsWith, contains } = useFilter();
*
* startsWith('hello', 'he'); // true
* endsWith('hello', 'lo'); // true
* contains('hello', 'ell'); // true
*/
function useFilter$1(options) {
	const computedOptions = computed(() => unref(options));
	const collator = computed(() => new Intl.Collator("en", {
		usage: "search",
		...computedOptions.value
	}));
	const startsWith = (string, substring) => {
		if (substring.length === 0) return true;
		string = string.normalize("NFC");
		substring = substring.normalize("NFC");
		return collator.value.compare(string.slice(0, substring.length), substring) === 0;
	};
	const endsWith = (string, substring) => {
		if (substring.length === 0) return true;
		string = string.normalize("NFC");
		substring = substring.normalize("NFC");
		return collator.value.compare(string.slice(-substring.length), substring) === 0;
	};
	const contains = (string, substring) => {
		if (substring.length === 0) return true;
		string = string.normalize("NFC");
		substring = substring.normalize("NFC");
		if (substring.length > string.length) return false;
		const compare = collator.value.compare;
		if (string.includes(substring)) return true;
		const sliceLen = substring.length;
		for (let scan = 0; scan + sliceLen <= string.length; scan++) if (compare(substring, string.slice(scan, scan + sliceLen)) === 0) return true;
		return false;
	};
	return {
		startsWith,
		endsWith,
		contains
	};
}
// ../../../../node_modules/reka-ui/dist/shared/useFocusGuards.js
/** Number of components which have requested interest to have focus guards */
var count$2 = 0;
/**
* Injects a pair of focus guards at the edges of the whole DOM tree
* to ensure `focusin` & `focusout` events can be caught consistently.
*/
function useFocusGuards() {
	watchEffect((cleanupFn) => {
		if (!isClient) return;
		const edgeGuards = document.querySelectorAll("[data-reka-focus-guard]");
		document.body.insertAdjacentElement("afterbegin", edgeGuards[0] ?? createFocusGuard());
		document.body.insertAdjacentElement("beforeend", edgeGuards[1] ?? createFocusGuard());
		count$2++;
		cleanupFn(() => {
			if (count$2 === 1) document.querySelectorAll("[data-reka-focus-guard]").forEach((node) => node.remove());
			count$2--;
		});
	});
}
function createFocusGuard() {
	const element = document.createElement("span");
	element.setAttribute("data-reka-focus-guard", "");
	element.tabIndex = 0;
	element.style.outline = "none";
	element.style.opacity = "0";
	element.style.position = "fixed";
	element.style.pointerEvents = "none";
	return element;
}
// ../../../../node_modules/reka-ui/dist/shared/useForwardExpose.js
function useForwardExpose() {
	const instance = getCurrentInstance();
	const currentRef = ref();
	const currentElement = computed(() => resolveCurrentElement());
	onUpdated(() => {
		if (currentElement.value !== resolveCurrentElement()) triggerRef(currentRef);
	});
	function resolveCurrentElement() {
		return currentRef.value && "$el" in currentRef.value && ["#text", "#comment"].includes(currentRef.value.$el.nodeName) ? currentRef.value.$el.nextElementSibling : unrefElement(currentRef);
	}
	const localExpose = Object.assign({}, instance.exposed);
	const ret = {};
	for (const key in instance.props) Object.defineProperty(ret, key, {
		enumerable: true,
		configurable: true,
		get: () => instance.props[key]
	});
	if (Object.keys(localExpose).length > 0) for (const key in localExpose) Object.defineProperty(ret, key, {
		enumerable: true,
		configurable: true,
		get: () => localExpose[key]
	});
	Object.defineProperty(ret, "$el", {
		enumerable: true,
		configurable: true,
		get: () => instance.vnode.el
	});
	instance.exposed = ret;
	function forwardRef(ref$1) {
		currentRef.value = ref$1;
		if (!ref$1) return;
		Object.defineProperty(ret, "$el", {
			enumerable: true,
			configurable: true,
			get: () => ref$1 instanceof Element ? ref$1 : ref$1.$el
		});
		if (!(ref$1 instanceof Element) && !Object.hasOwn(ref$1, "$el")) {
			const childExposed = ref$1.$.exposed;
			const merged = Object.assign({}, ret);
			for (const key in childExposed) Object.defineProperty(merged, key, {
				enumerable: true,
				configurable: true,
				get: () => childExposed[key]
			});
			instance.exposed = merged;
		}
	}
	return {
		forwardRef,
		currentRef,
		currentElement
	};
}
// ../../../../node_modules/reka-ui/dist/shared/useForwardPropsEmits.js
function useForwardPropsEmits(props, emit) {
	const parsedProps = useForwardProps(props);
	const emitsAsProps = emit ? useEmitAsProps(emit) : {};
	return computed(() => ({
		...parsedProps.value,
		...emitsAsProps
	}));
}
// ../../../../node_modules/reka-ui/dist/shared/useGraceArea.js
function useGraceArea(triggerElement, containerElement) {
	const isPointerInTransit = refAutoReset(false, 300);
	tryOnScopeDispose(() => {
		isPointerInTransit.value = false;
	});
	const pointerGraceArea = ref(null);
	const pointerExit = createEventHook();
	function handleRemoveGraceArea() {
		pointerGraceArea.value = null;
		isPointerInTransit.value = false;
	}
	function handleCreateGraceArea(event, hoverTarget) {
		if (!hoverTarget) return;
		const currentTarget = event.currentTarget;
		const exitPoint = {
			x: event.clientX,
			y: event.clientY
		};
		const paddedExitPoints = getPaddedExitPoints(exitPoint, getExitSideFromRect(exitPoint, currentTarget.getBoundingClientRect()), 1);
		const hoverTargetPoints = getPointsFromRect(hoverTarget.getBoundingClientRect());
		const graceArea = getHull([...paddedExitPoints, ...hoverTargetPoints]);
		pointerGraceArea.value = graceArea;
		isPointerInTransit.value = true;
	}
	watchEffect((cleanupFn) => {
		if (triggerElement.value && containerElement.value) {
			const trigger = triggerElement.value;
			const container = containerElement.value;
			const handleTriggerLeave = (event) => handleCreateGraceArea(event, container);
			const handleContentLeave = (event) => handleCreateGraceArea(event, trigger);
			trigger.addEventListener("pointerleave", handleTriggerLeave);
			container.addEventListener("pointerleave", handleContentLeave);
			cleanupFn(() => {
				trigger.removeEventListener("pointerleave", handleTriggerLeave);
				container.removeEventListener("pointerleave", handleContentLeave);
			});
		}
	});
	watchEffect((cleanupFn) => {
		if (pointerGraceArea.value) {
			const handleTrackPointerGrace = (event) => {
				if (!pointerGraceArea.value || !(event.target instanceof Element)) return;
				const target = event.target;
				const pointerPosition = {
					x: event.clientX,
					y: event.clientY
				};
				const hasEnteredTarget = triggerElement.value?.contains(target) || containerElement.value?.contains(target);
				const isPointerOutsideGraceArea = !isPointInPolygon$1(pointerPosition, pointerGraceArea.value);
				const isAnotherGraceAreaTrigger = !!target.closest("[data-grace-area-trigger]");
				if (hasEnteredTarget) handleRemoveGraceArea();
				else if (isPointerOutsideGraceArea || isAnotherGraceAreaTrigger) {
					handleRemoveGraceArea();
					pointerExit.trigger();
				}
			};
			const ownerDocument = triggerElement.value?.ownerDocument;
			ownerDocument?.addEventListener("pointermove", handleTrackPointerGrace);
			cleanupFn(() => ownerDocument?.removeEventListener("pointermove", handleTrackPointerGrace));
		}
	});
	return {
		isPointerInTransit,
		onPointerExit: pointerExit.on
	};
}
function getExitSideFromRect(point, rect) {
	const top = Math.abs(rect.top - point.y);
	const bottom = Math.abs(rect.bottom - point.y);
	const right = Math.abs(rect.right - point.x);
	const left = Math.abs(rect.left - point.x);
	switch (Math.min(top, bottom, right, left)) {
		case left: return "left";
		case right: return "right";
		case top: return "top";
		case bottom: return "bottom";
		default: throw new Error("unreachable");
	}
}
function getPaddedExitPoints(exitPoint, exitSide, padding = 5) {
	const paddedExitPoints = [];
	switch (exitSide) {
		case "top":
			paddedExitPoints.push({
				x: exitPoint.x - padding,
				y: exitPoint.y + padding
			}, {
				x: exitPoint.x + padding,
				y: exitPoint.y + padding
			});
			break;
		case "bottom":
			paddedExitPoints.push({
				x: exitPoint.x - padding,
				y: exitPoint.y - padding
			}, {
				x: exitPoint.x + padding,
				y: exitPoint.y - padding
			});
			break;
		case "left":
			paddedExitPoints.push({
				x: exitPoint.x + padding,
				y: exitPoint.y - padding
			}, {
				x: exitPoint.x + padding,
				y: exitPoint.y + padding
			});
			break;
		case "right": paddedExitPoints.push({
			x: exitPoint.x - padding,
			y: exitPoint.y - padding
		}, {
			x: exitPoint.x - padding,
			y: exitPoint.y + padding
		});
	}
	return paddedExitPoints;
}
function getPointsFromRect(rect) {
	const { top, right, bottom, left } = rect;
	return [
		{
			x: left,
			y: top
		},
		{
			x: right,
			y: top
		},
		{
			x: right,
			y: bottom
		},
		{
			x: left,
			y: bottom
		}
	];
}
function isPointInPolygon$1(point, polygon) {
	const { x, y } = point;
	let inside = false;
	for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
		const xi = polygon[i].x;
		const yi = polygon[i].y;
		const xj = polygon[j].x;
		const yj = polygon[j].y;
		if (yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
	}
	return inside;
}
function getHull(points) {
	const newPoints = points.slice();
	newPoints.sort((a, b) => {
		if (a.x < b.x) return -1;
		else if (a.x > b.x) return 1;
		else if (a.y < b.y) return -1;
		else if (a.y > b.y) return 1;
		else return 0;
	});
	return getHullPresorted(newPoints);
}
function getHullPresorted(points) {
	if (points.length <= 1) return points.slice();
	const upperHull = [];
	for (let i = 0; i < points.length; i++) {
		const p = points[i];
		while (upperHull.length >= 2) {
			const q = upperHull.at(-1);
			const r = upperHull[upperHull.length - 2];
			if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) upperHull.pop();
			else break;
		}
		upperHull.push(p);
	}
	upperHull.pop();
	const lowerHull = [];
	for (let i = points.length - 1; i >= 0; i--) {
		const p = points[i];
		while (lowerHull.length >= 2) {
			const q = lowerHull.at(-1);
			const r = lowerHull[lowerHull.length - 2];
			if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) lowerHull.pop();
			else break;
		}
		lowerHull.push(p);
	}
	lowerHull.pop();
	if (upperHull.length === 1 && lowerHull.length === 1 && upperHull[0].x === lowerHull[0].x && upperHull[0].y === lowerHull[0].y) return upperHull;
	else return upperHull.concat(lowerHull);
}
// ../../../../node_modules/aria-hidden/dist/es2015/index.js
var getDefaultParent = function(originalTarget) {
	if (typeof document === "undefined") return null;
	return (Array.isArray(originalTarget) ? originalTarget[0] : originalTarget).ownerDocument.body;
};
var counterMap = /*@__PURE__*/ new WeakMap();
var uncontrolledNodes = /*@__PURE__*/ new WeakMap();
var markerMap = {};
var lockCount = 0;
var unwrapHost = function(node) {
	return node && (node.host || unwrapHost(node.parentNode));
};
var correctTargets = function(parent, targets) {
	return targets.map(function(target) {
		if (parent.contains(target)) return target;
		var correctedTarget = unwrapHost(target);
		if (correctedTarget && parent.contains(correctedTarget)) return correctedTarget;
		console.error("aria-hidden", target, "in not contained inside", parent, ". Doing nothing");
		return null;
	}).filter(function(x) {
		return Boolean(x);
	});
};
/**
* Marks everything except given node(or nodes) as aria-hidden
* @param {Element | Element[]} originalTarget - elements to keep on the page
* @param [parentNode] - top element, defaults to document.body
* @param {String} [markerName] - a special attribute to mark every node
* @param {String} [controlAttribute] - html Attribute to control
* @return {Undo} undo command
*/
var applyAttributeToOthers = function(originalTarget, parentNode, markerName, controlAttribute) {
	var targets = correctTargets(parentNode, Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
	if (!markerMap[markerName]) markerMap[markerName] = /* @__PURE__ */ new WeakMap();
	var markerCounter = markerMap[markerName];
	var hiddenNodes = [];
	var elementsToKeep = /* @__PURE__ */ new Set();
	var elementsToStop = new Set(targets);
	var keep = function(el) {
		if (!el || elementsToKeep.has(el)) return;
		elementsToKeep.add(el);
		keep(el.parentNode);
	};
	targets.forEach(keep);
	var deep = function(parent) {
		if (!parent || elementsToStop.has(parent)) return;
		Array.prototype.forEach.call(parent.children, function(node) {
			if (elementsToKeep.has(node)) deep(node);
			else try {
				var attr = node.getAttribute(controlAttribute);
				var alreadyHidden = attr !== null && attr !== "false";
				var counterValue = (counterMap.get(node) || 0) + 1;
				var markerValue = (markerCounter.get(node) || 0) + 1;
				counterMap.set(node, counterValue);
				markerCounter.set(node, markerValue);
				hiddenNodes.push(node);
				if (counterValue === 1 && alreadyHidden) uncontrolledNodes.set(node, true);
				if (markerValue === 1) node.setAttribute(markerName, "true");
				if (!alreadyHidden) node.setAttribute(controlAttribute, "true");
			} catch (e) {
				console.error("aria-hidden: cannot operate on ", node, e);
			}
		});
	};
	deep(parentNode);
	elementsToKeep.clear();
	lockCount++;
	return function() {
		hiddenNodes.forEach(function(node) {
			var counterValue = counterMap.get(node) - 1;
			var markerValue = markerCounter.get(node) - 1;
			counterMap.set(node, counterValue);
			markerCounter.set(node, markerValue);
			if (!counterValue) {
				if (!uncontrolledNodes.has(node)) node.removeAttribute(controlAttribute);
				uncontrolledNodes.delete(node);
			}
			if (!markerValue) node.removeAttribute(markerName);
		});
		lockCount--;
		if (!lockCount) {
			counterMap = /* @__PURE__ */ new WeakMap();
			counterMap = /* @__PURE__ */ new WeakMap();
			uncontrolledNodes = /* @__PURE__ */ new WeakMap();
			markerMap = {};
		}
	};
};
/**
* Marks everything except given node(or nodes) as aria-hidden
* @param {Element | Element[]} originalTarget - elements to keep on the page
* @param [parentNode] - top element, defaults to document.body
* @param {String} [markerName] - a special attribute to mark every node
* @return {Undo} undo command
*/
var hideOthers = function(originalTarget, parentNode, markerName) {
	if (markerName === void 0) markerName = "data-aria-hidden";
	var targets = Array.from(Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
	var activeParentNode = parentNode || getDefaultParent(originalTarget);
	if (!activeParentNode) return function() {
		return null;
	};
	targets.push.apply(targets, Array.from(activeParentNode.querySelectorAll("[aria-live], script")));
	return applyAttributeToOthers(targets, activeParentNode, markerName, "aria-hidden");
};
// ../../../../node_modules/reka-ui/dist/shared/useHideOthers.js
/**
* The `useHideOthers` function is a TypeScript function that takes a target element reference and
* hides all other elements in ARIA when the target element is present, and restores the visibility of the
* hidden elements when the target element is removed.
* @param {MaybeElementRef} target - The `target` parameter is a reference to the element that you want
* to hide other elements when it is clicked or focused.
*/
function useHideOthers(target) {
	let undo;
	watch(() => unrefElement(target), (el) => {
		let isInsideClosedPopover = false;
		try {
			isInsideClosedPopover = !!el?.closest("[popover]:not(:popover-open)");
		} catch {}
		if (el && !isInsideClosedPopover) undo = hideOthers(el);
		else if (undo) undo();
	});
	onUnmounted(() => {
		if (undo) undo();
	});
}
// ../../../../node_modules/reka-ui/dist/shared/useId.js
var count$1 = 0;
/**
* The `useId` function generates a unique identifier using a provided deterministic ID,
* a configured `<ConfigProvider>` ID source, Vue's native `useId`, or a fallback counter.
* @param {string | null | undefined} [deterministicId] - The `useId` function you provided takes an
* optional parameter `deterministicId`, which can be a string, null, or undefined. If
* `deterministicId` is provided, the function will return it. Otherwise, it will generate an id using
* the configured ID source.
*/
function useId$1(deterministicId, prefix = "reka") {
	if (deterministicId) return deterministicId;
	let id;
	const configProviderContext = injectConfigProviderContext({ useId: void 0 });
	if (configProviderContext.useId) id = configProviderContext.useId();
	else if ("useId" in vue) id = vue.useId?.();
	else id = `${++count$1}`;
	return prefix ? `${prefix}-${id}` : id;
}
// ../../../../node_modules/reka-ui/dist/shared/useSize.js
function useSize(element) {
	const size = ref();
	const width = computed(() => size.value?.width ?? 0);
	const height = computed(() => size.value?.height ?? 0);
	let resizeObserver;
	onMounted(() => {
		const el = unrefElement(element);
		if (el) {
			size.value = {
				width: el.offsetWidth,
				height: el.offsetHeight
			};
			resizeObserver = new ResizeObserver((entries) => {
				if (!Array.isArray(entries)) return;
				if (!entries.length) return;
				const entry = entries[0];
				let width$1;
				let height$1;
				if ("borderBoxSize" in entry) {
					const borderSizeEntry = entry.borderBoxSize;
					const borderSize = Array.isArray(borderSizeEntry) ? borderSizeEntry[0] : borderSizeEntry;
					width$1 = borderSize.inlineSize;
					height$1 = borderSize.blockSize;
				} else {
					width$1 = el.offsetWidth;
					height$1 = el.offsetHeight;
				}
				size.value = {
					width: width$1,
					height: height$1
				};
			});
			resizeObserver.observe(el, { box: "border-box" });
		} else size.value = void 0;
	});
	onUnmounted(() => {
		resizeObserver?.disconnect();
		resizeObserver = void 0;
	});
	return {
		width,
		height
	};
}
// ../../../../node_modules/reka-ui/dist/shared/useStateMachine.js
/**
* The `useStateMachine` function is a TypeScript function that creates a state machine and returns the
* current state and a dispatch function to update the state based on events.
* @param initialState - The `initialState` parameter is the initial state of the state machine. It
* represents the starting point of the state machine's state.
* @param machine - The `machine` parameter is an object that represents a state machine. It should
* have keys that correspond to the possible states of the machine, and the values should be objects
* that represent the possible events and their corresponding next states.
* @returns The `useStateMachine` function returns an object with two properties: `state` and
* `dispatch`.
*/
function useStateMachine(initialState, machine) {
	const state = ref(initialState);
	function reducer(event) {
		return machine[state.value][event] ?? state.value;
	}
	const dispatch = (event) => {
		state.value = reducer(event);
	};
	return {
		state,
		dispatch
	};
}
// ../../../../node_modules/reka-ui/dist/shared/useTypeahead.js
function useTypeahead(callback) {
	const search = refAutoReset("", 1e3);
	const handleTypeaheadSearch = (key, items) => {
		search.value = search.value + key;
		if (callback) callback(key);
		else {
			const currentItem = getActiveElement();
			const itemsWithTextValue = items.map((item) => ({
				...item,
				textValue: item.value?.textValue ?? item.ref.textContent?.trim() ?? ""
			}));
			const currentMatch = itemsWithTextValue.find((item) => item.ref === currentItem);
			const nextMatch = getNextMatch(itemsWithTextValue.map((item) => item.textValue), search.value, currentMatch?.textValue);
			const newItem = itemsWithTextValue.find((item) => item.textValue === nextMatch);
			if (newItem) newItem.ref.focus();
			return newItem?.ref;
		}
	};
	const resetTypeahead = () => {
		search.value = "";
	};
	return {
		search,
		handleTypeaheadSearch,
		resetTypeahead
	};
}
/**
* Wraps an array around itself at a given start index
* Example: `wrapArray(['a', 'b', 'c', 'd'], 2) === ['c', 'd', 'a', 'b']`
*/
function wrapArray(array, startIndex) {
	return array.map((_, index) => array[(startIndex + index) % array.length]);
}
/**
* This is the "meat" of the typeahead matching logic. It takes in all the values,
* the search and the current match, and returns the next match (or `undefined`).
*
* We normalize the search because if a user has repeatedly pressed a character,
* we want the exact same behavior as if we only had that one character
* (ie. cycle through options starting with that character)
*
* We also reorder the values by wrapping the array around the current match.
* This is so we always look forward from the current match, and picking the first
* match will always be the correct one.
*
* Finally, if the normalized search is exactly one character, we exclude the
* current match from the values because otherwise it would be the first to match always
* and focus would never move. This is as opposed to the regular case, where we
* don't want focus to move if the current match still matches.
*/
function getNextMatch(values, search, currentMatch) {
	const normalizedSearch = search.length > 1 && Array.from(search).every((char) => char === search[0]) ? search[0] : search;
	const currentMatchIndex = currentMatch ? values.indexOf(currentMatch) : -1;
	let wrappedValues = wrapArray(values, Math.max(currentMatchIndex, 0));
	if (normalizedSearch.length === 1) wrappedValues = wrappedValues.filter((v) => v !== currentMatch);
	const nextMatch = wrappedValues.find((value) => value.toLowerCase().startsWith(normalizedSearch.toLowerCase()));
	return nextMatch !== currentMatch ? nextMatch : void 0;
}
// ../../../../node_modules/reka-ui/dist/Presence/usePresence.js
function usePresence(present, node) {
	const stylesRef = ref({});
	const prevAnimationNameRef = ref("none");
	const prevPresentRef = ref(present);
	const initialState = present.value ? "mounted" : "unmounted";
	let timeoutId;
	const ownerWindow = node.value?.ownerDocument.defaultView ?? defaultWindow;
	const { state, dispatch } = useStateMachine(initialState, {
		mounted: {
			UNMOUNT: "unmounted",
			ANIMATION_OUT: "unmountSuspended"
		},
		unmountSuspended: {
			MOUNT: "mounted",
			ANIMATION_END: "unmounted"
		},
		unmounted: { MOUNT: "mounted" }
	});
	const dispatchCustomEvent = (name) => {
		if (isClient) {
			const customEvent = new CustomEvent(name, {
				bubbles: false,
				cancelable: false
			});
			node.value?.dispatchEvent(customEvent);
		}
	};
	watch(present, async (currentPresent, prevPresent) => {
		const hasPresentChanged = prevPresent !== currentPresent;
		await nextTick();
		if (hasPresentChanged) {
			const prevAnimationName = prevAnimationNameRef.value;
			const currentAnimationName = getAnimationName(node.value);
			if (currentPresent) {
				dispatch("MOUNT");
				dispatchCustomEvent("enter");
				if (currentAnimationName === "none") dispatchCustomEvent("after-enter");
			} else if (currentAnimationName === "none" || currentAnimationName === "undefined" || stylesRef.value?.display === "none") {
				dispatch("UNMOUNT");
				dispatchCustomEvent("leave");
				dispatchCustomEvent("after-leave");
			} else if (prevPresent && prevAnimationName !== currentAnimationName) {
				dispatch("ANIMATION_OUT");
				dispatchCustomEvent("leave");
			} else {
				dispatch("UNMOUNT");
				dispatchCustomEvent("after-leave");
			}
		}
	}, { immediate: true });
	/**
	* Triggering an ANIMATION_OUT during an ANIMATION_IN will fire an `animationcancel`
	* event for ANIMATION_IN after we have entered `unmountSuspended` state. So, we
	* make sure we only trigger ANIMATION_END for the currently active animation.
	*/
	const handleAnimationEnd = (event) => {
		if (event.target !== node.value) return;
		const currentAnimationName = getAnimationName(node.value);
		const isCurrentAnimation = currentAnimationName.includes(CSS.escape(event.animationName));
		const directionName = state.value === "mounted" ? "enter" : "leave";
		if (isCurrentAnimation) {
			dispatchCustomEvent(`after-${directionName}`);
			dispatch("ANIMATION_END");
			if (!prevPresentRef.value) {
				const currentFillMode = node.value.style.animationFillMode;
				node.value.style.animationFillMode = "forwards";
				timeoutId = ownerWindow?.setTimeout(() => {
					if (node.value?.style.animationFillMode === "forwards") node.value.style.animationFillMode = currentFillMode;
				});
			}
		}
		if (currentAnimationName === "none") dispatch("ANIMATION_END");
	};
	const handleAnimationStart = (event) => {
		if (event.target === node.value) prevAnimationNameRef.value = getAnimationName(node.value);
	};
	const watcher = watch(node, (newNode, oldNode) => {
		if (newNode) {
			stylesRef.value = getComputedStyle(newNode);
			newNode.addEventListener("animationstart", handleAnimationStart);
			newNode.addEventListener("animationcancel", handleAnimationEnd);
			newNode.addEventListener("animationend", handleAnimationEnd);
		} else {
			dispatch("ANIMATION_END");
			if (timeoutId !== void 0) ownerWindow?.clearTimeout(timeoutId);
			oldNode?.removeEventListener("animationstart", handleAnimationStart);
			oldNode?.removeEventListener("animationcancel", handleAnimationEnd);
			oldNode?.removeEventListener("animationend", handleAnimationEnd);
		}
	}, { immediate: true });
	const stateWatcher = watch(state, () => {
		const currentAnimationName = getAnimationName(node.value);
		prevAnimationNameRef.value = state.value === "mounted" ? currentAnimationName : "none";
	});
	onUnmounted(() => {
		watcher();
		stateWatcher();
		if (node.value) {
			node.value.removeEventListener("animationstart", handleAnimationStart);
			node.value.removeEventListener("animationcancel", handleAnimationEnd);
			node.value.removeEventListener("animationend", handleAnimationEnd);
		}
		if (timeoutId !== void 0) ownerWindow?.clearTimeout(timeoutId);
	});
	return { isPresent: computed(() => ["mounted", "unmountSuspended"].includes(state.value)) };
}
function getAnimationName(node) {
	return node ? getComputedStyle(node).animationName || "none" : "none";
}
// ../../../../node_modules/reka-ui/dist/Presence/Presence.js
var Presence_default = /*@__PURE__*/ defineComponent({
	name: "Presence",
	props: {
		present: {
			type: Boolean,
			required: true
		},
		forceMount: { type: Boolean }
	},
	slots: {},
	setup(props, { slots, expose }) {
		const { present, forceMount } = toRefs(props);
		const node = ref();
		const { isPresent } = usePresence(present, node);
		expose({ present: isPresent });
		let children = slots.default({ present: isPresent.value });
		children = renderSlotFragments(children || []);
		const instance = getCurrentInstance();
		if (children && children?.length > 1) {
			const componentName = instance?.parent?.type.name ? `<${instance.parent.type.name} />` : "component";
			throw new Error([
				`Detected an invalid children for \`${componentName}\` for  \`Presence\` component.`,
				"",
				"Note: Presence works similarly to `v-if` directly, but it waits for animation/transition to finished before unmounting. So it expect only one direct child of valid VNode type.",
				"You can apply a few solutions:",
				["Provide a single child element so that `presence` directive attach correctly.", "Ensure the first child is an actual element instead of a raw text node or comment node."].map((line) => `  - ${line}`).join("\n")
			].join("\n"));
		}
		return () => {
			if (forceMount.value || present.value || isPresent.value) return h(slots.default({ present: isPresent.value })[0], { ref: (v) => {
				const el = unrefElement(v);
				if (typeof el?.hasAttribute === "undefined") return el;
				if (el?.hasAttribute("data-reka-popper-content-wrapper")) node.value = el.firstElementChild;
				else node.value = el;
				return el;
			} });
			else return null;
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Primitive/usePrimitiveElement.js
function usePrimitiveElement() {
	const primitiveElement = ref();
	return {
		primitiveElement,
		currentElement: computed(() => ["#text", "#comment"].includes(primitiveElement.value?.$el.nodeName) ? primitiveElement.value?.$el.nextElementSibling : unrefElement(primitiveElement))
	};
}
// ../../../../node_modules/reka-ui/dist/DismissableLayer/utils.js
var POINTER_DOWN_OUTSIDE = "dismissableLayer.pointerDownOutside";
var FOCUS_OUTSIDE = "dismissableLayer.focusOutside";
function isElement(node) {
	if (typeof node !== "object" || node === null) return false;
	const ownerWindow = node.ownerDocument?.defaultView;
	return typeof Element !== "undefined" && node instanceof Element || !!ownerWindow && node instanceof ownerWindow.Element;
}
function isLayerExist(layerElement, targetElement) {
	if (!isElement(targetElement)) return false;
	if (layerElement.contains(targetElement)) return true;
	const targetLayer = targetElement.closest("[data-dismissable-layer]");
	const mainLayer = layerElement.dataset.dismissableLayer === "" ? layerElement : layerElement.querySelector("[data-dismissable-layer]");
	const nodeList = Array.from(layerElement.ownerDocument.querySelectorAll("[data-dismissable-layer]"));
	if (targetLayer && (mainLayer === targetLayer || nodeList.indexOf(mainLayer) < nodeList.indexOf(targetLayer))) return true;
	else return false;
}
/**
* Listens for `pointerdown` outside a DOM subtree. We use `pointerdown` rather than `pointerup`
* to mimic layer dismissing behaviour present in OS.
* Returns props to pass to the node we want to check for outside events.
*/
function usePointerDownOutside(onPointerDownOutside, element, enabled = true) {
	const isPointerInsideDOMTree = ref(false);
	const handleClickRef = ref(() => {});
	watchEffect((cleanupFn) => {
		if (!isClient || !toValue(enabled)) return;
		const ownerDocument = element?.value?.ownerDocument ?? globalThis.document;
		const handlePointerDown = async (event) => {
			const target = event.target;
			if (!element?.value || !target) return;
			if (isLayerExist(element.value, target)) {
				ownerDocument.removeEventListener("click", handleClickRef.value);
				isPointerInsideDOMTree.value = false;
				return;
			}
			if (event.target && !isPointerInsideDOMTree.value) {
				const eventDetail = { originalEvent: event };
				function handleAndDispatchPointerDownOutsideEvent() {
					handleAndDispatchCustomEvent$1(POINTER_DOWN_OUTSIDE, onPointerDownOutside, eventDetail);
				}
				/**
				* On touch devices, we need to wait for a click event because browsers implement
				* a ~350ms delay between the time the user stops touching the display and when the
				* browser executes events. We need to ensure we don't reactivate pointer-events within
				* this timeframe otherwise the browser may execute events that should have been prevented.
				*
				* Additionally, this also lets us deal automatically with cancellations when a click event
				* isn't raised because the page was considered scrolled/drag-scrolled, long-pressed, etc.
				*
				* This is why we also continuously remove the previous listener, because we cannot be
				* certain that it was raised, and therefore cleaned-up.
				*/
				if (event.pointerType === "touch") {
					ownerDocument.removeEventListener("click", handleClickRef.value);
					handleClickRef.value = handleAndDispatchPointerDownOutsideEvent;
					ownerDocument.addEventListener("click", handleClickRef.value, { once: true });
				} else handleAndDispatchPointerDownOutsideEvent();
			} else ownerDocument.removeEventListener("click", handleClickRef.value);
			isPointerInsideDOMTree.value = false;
		};
		/**
		* if this hook executes in a component that mounts via a `pointerdown` event, the event
		* would bubble up to the document and trigger a `pointerDownOutside` event. We avoid
		* this by delaying the event listener registration on the document.
		* This is how the DOM works, ie:
		* ```
		* button.addEventListener('pointerdown', () => {
		*   console.log('I will log');
		*   document.addEventListener('pointerdown', () => {
		*     console.log('I will also log');
		*   })
		* });
		*/
		const timerId = window.setTimeout(() => {
			ownerDocument.addEventListener("pointerdown", handlePointerDown);
		}, 0);
		cleanupFn(() => {
			window.clearTimeout(timerId);
			ownerDocument.removeEventListener("pointerdown", handlePointerDown);
			ownerDocument.removeEventListener("click", handleClickRef.value);
		});
	});
	return { onPointerDownCapture: () => {
		if (!toValue(enabled)) return;
		isPointerInsideDOMTree.value = true;
	} };
}
/**
* Listens for when focus happens outside a DOM subtree.
* Returns props to pass to the root (node) of the subtree we want to check.
*/
function useFocusOutside(onFocusOutside, element, enabled = true) {
	const isFocusInsideDOMTree = ref(false);
	watchEffect((cleanupFn) => {
		if (!isClient || !toValue(enabled)) return;
		const ownerDocument = element?.value?.ownerDocument ?? globalThis.document;
		const handleFocus = async (event) => {
			if (!element?.value) return;
			await nextTick();
			await nextTick();
			const target = event.target;
			if (!element.value || !target || isLayerExist(element.value, target)) return;
			if (event.target && !isFocusInsideDOMTree.value) handleAndDispatchCustomEvent$1(FOCUS_OUTSIDE, onFocusOutside, { originalEvent: event });
		};
		ownerDocument.addEventListener("focusin", handleFocus);
		cleanupFn(() => ownerDocument.removeEventListener("focusin", handleFocus));
	});
	return {
		onFocusCapture: () => {
			if (!toValue(enabled)) return;
			isFocusInsideDOMTree.value = true;
		},
		onBlurCapture: () => {
			if (!toValue(enabled)) return;
			isFocusInsideDOMTree.value = false;
		}
	};
}
// ../../../../node_modules/reka-ui/dist/DismissableLayer/context.js
var context = /*@__PURE__*/ reactive({
	layersRoot: /*@__PURE__*/ new Set(),
	layersWithOutsidePointerEventsDisabled: /*@__PURE__*/ new Set(),
	branches: /*@__PURE__*/ new Set()
});
// ../../../../node_modules/reka-ui/dist/DismissableLayer/DismissableLayer.js
var DismissableLayer_default = /*@__PURE__*/ defineComponent({
	__name: "DismissableLayer",
	props: {
		disableOutsidePointerEvents: {
			type: Boolean,
			required: false,
			default: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		},
		present: {
			type: Boolean,
			required: false,
			default: true
		}
	},
	emits: [
		"escapeKeyDown",
		"pointerDownOutside",
		"focusOutside",
		"interactOutside",
		"dismiss"
	],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const { forwardRef, currentElement: layerElement } = useForwardExpose();
		const ownerDocument = computed(() => layerElement.value?.ownerDocument ?? globalThis.document);
		const layers = computed(() => context.layersRoot);
		const index = computed(() => {
			return layerElement.value ? Array.from(layers.value).indexOf(layerElement.value) : -1;
		});
		const isBodyPointerEventsDisabled = computed(() => {
			return context.layersWithOutsidePointerEventsDisabled.size > 0;
		});
		const isPointerEventsEnabled = computed(() => {
			const localLayers = Array.from(layers.value);
			const [highestLayerWithOutsidePointerEventsDisabled] = [...context.layersWithOutsidePointerEventsDisabled].slice(-1);
			const highestLayerWithOutsidePointerEventsDisabledIndex = localLayers.indexOf(highestLayerWithOutsidePointerEventsDisabled);
			return index.value >= highestLayerWithOutsidePointerEventsDisabledIndex;
		});
		const pointerDownOutside = usePointerDownOutside(async (event) => {
			const isPointerDownOnBranch = [...context.branches].some((branch) => branch?.contains(event.target));
			if (!props.present || !isPointerEventsEnabled.value || isPointerDownOnBranch) return;
			emits("pointerDownOutside", event);
			emits("interactOutside", event);
			await nextTick();
			if (!event.defaultPrevented) emits("dismiss");
		}, layerElement, () => props.present);
		const focusOutside = useFocusOutside((event) => {
			const isFocusInBranch = [...context.branches].some((branch) => branch?.contains(event.target));
			if (!props.present || isFocusInBranch) return;
			emits("focusOutside", event);
			emits("interactOutside", event);
			if (!event.defaultPrevented) emits("dismiss");
		}, layerElement);
		onKeyStroke("Escape", (event) => {
			if (!props.present) return;
			if (!(index.value === layers.value.size - 1)) return;
			emits("escapeKeyDown", event);
			if (!event.defaultPrevented) emits("dismiss");
		}, { target: () => ownerDocument.value?.defaultView ?? globalThis.window });
		watch([
			layerElement,
			() => props.disableOutsidePointerEvents,
			() => props.present
		], ([element, disableOutsidePointerEvents, present], _, onCleanup) => {
			if (!element || !present) return;
			if (disableOutsidePointerEvents) {
				const doc = element.ownerDocument;
				acquireBodyPointerEvents(doc, element);
				context.layersWithOutsidePointerEventsDisabled.add(element);
				onCleanup(() => {
					context.layersWithOutsidePointerEventsDisabled.delete(element);
					releaseBodyPointerEvents(doc, element);
				});
			}
		}, { immediate: true });
		watch([layerElement, () => props.present], ([element, present], _, onCleanup) => {
			if (!element || !present) return;
			layers.value.add(element);
			onCleanup(() => {
				layers.value.delete(element);
			});
		}, { immediate: true });
		watchEffect((cleanupFn) => {
			cleanupFn(() => {
				if (!layerElement.value) return;
				layers.value.delete(layerElement.value);
				context.layersWithOutsidePointerEventsDisabled.delete(layerElement.value);
			});
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Primitive), {
				ref: unref(forwardRef),
				"as-child": __props.asChild,
				as: __props.as,
				"data-dismissable-layer": "",
				style: normalizeStyle({ pointerEvents: isBodyPointerEventsDisabled.value ? isPointerEventsEnabled.value ? "auto" : "none" : void 0 }),
				onFocusCapture: unref(focusOutside).onFocusCapture,
				onBlurCapture: unref(focusOutside).onBlurCapture,
				onPointerdownCapture: unref(pointerDownOutside).onPointerDownCapture
			}, {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 8, [
				"as-child",
				"as",
				"style",
				"onFocusCapture",
				"onBlurCapture",
				"onPointerdownCapture"
			]);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/DismissableLayer/DismissableLayerBranch.js
var DismissableLayerBranch_default = /*@__PURE__*/ defineComponent({
	__name: "DismissableLayerBranch",
	props: {
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		const { forwardRef, currentElement } = useForwardExpose();
		let registeredElement = null;
		onMounted(() => {
			registeredElement = currentElement.value;
			if (registeredElement) context.branches.add(registeredElement);
		});
		onUnmounted(() => {
			if (registeredElement) {
				context.branches.delete(registeredElement);
				registeredElement = null;
			}
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Primitive), mergeProps({ ref: unref(forwardRef) }, props), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/FocusScope/stack.js
var useFocusStackState = /*@__PURE__*/ createGlobalState(() => {
	return ref([]);
});
function createFocusScopesStack() {
	/** A stack of focus scopes, with the active one at the top */
	const stack = useFocusStackState();
	return {
		add(focusScope) {
			const activeFocusScope = stack.value[0];
			if (focusScope !== activeFocusScope) activeFocusScope?.pause();
			stack.value = arrayRemove(stack.value, focusScope);
			stack.value.unshift(focusScope);
		},
		remove(focusScope) {
			stack.value = arrayRemove(stack.value, focusScope);
			stack.value[0]?.resume();
		}
	};
}
function arrayRemove(array, item) {
	const updatedArray = [...array];
	const index = updatedArray.indexOf(item);
	if (index !== -1) updatedArray.splice(index, 1);
	return updatedArray;
}
// ../../../../node_modules/reka-ui/dist/FocusScope/utils.js
var AUTOFOCUS_ON_MOUNT = "focusScope.autoFocusOnMount";
var AUTOFOCUS_ON_UNMOUNT = "focusScope.autoFocusOnUnmount";
var EVENT_OPTIONS$1 = {
	bubbles: false,
	cancelable: true
};
/** Like `Node.contains`, but crosses shadow boundaries by walking up through host elements. */
function containsComposed(container, node) {
	let current = node;
	while (current) {
		if (container.contains(current)) return true;
		current = current.getRootNode().host ?? null;
	}
	return false;
}
/**
* Attempts focusing the first element in a list of candidates.
* Stops when focus has actually moved.
*/
function focusFirst$2(candidates, { select = false } = {}) {
	const previouslyFocusedElement = getActiveElement();
	for (const candidate of candidates) {
		focus(candidate, { select });
		if (getActiveElement() !== previouslyFocusedElement) return true;
	}
}
/**
* Returns the first and last tabbable elements inside a container.
*/
function getTabbableEdges(container) {
	const candidates = getTabbableCandidates(container);
	return [findVisible(candidates, container), findVisible(candidates.reverse(), container)];
}
/**
* Returns a list of potential tabbable candidates.
*
* NOTE: This is only a close approximation. For example it doesn't take into account cases like when
* elements are not visible. This cannot be worked out easily by just reading a property, but rather
* necessitate runtime knowledge (computed styles, etc). We deal with these cases separately.
*
* See: https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker
* Credit: https://github.com/discord/focus-layers/blob/master/src/util/wrapFocus.tsx#L1
*/
function getTabbableCandidates(container) {
	const nodes = [];
	const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, { acceptNode: (node) => {
		const isHiddenInput = node.tagName === "INPUT" && node.type === "hidden";
		if (node.disabled || node.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP;
		return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
	} });
	while (walker.nextNode()) nodes.push(walker.currentNode);
	return nodes.sort((a, b) => {
		if (a.tabIndex === b.tabIndex) return 0;
		if (a.tabIndex === 0) return 1;
		if (b.tabIndex === 0) return -1;
		return a.tabIndex - b.tabIndex;
	});
}
/**
* Returns the first visible element in a list.
* NOTE: Only checks visibility up to the `container`.
*/
function findVisible(elements, container) {
	for (const element of elements) if (!isHidden(element, { upTo: container })) return element;
}
function isHidden(node, { upTo }) {
	if (getComputedStyle(node).visibility === "hidden") return true;
	while (node) {
		if (upTo !== void 0 && node === upTo) return false;
		if (getComputedStyle(node).display === "none") return true;
		node = node.parentElement;
	}
	return false;
}
function isSelectableInput(element) {
	return element instanceof HTMLInputElement && "select" in element;
}
function focus(element, { select = false } = {}) {
	if (element && element.focus) {
		const previouslyFocusedElement = getActiveElement();
		element.focus({ preventScroll: true });
		if (element !== previouslyFocusedElement && isSelectableInput(element) && select) element.select();
	}
}
// ../../../../node_modules/reka-ui/dist/FocusScope/FocusScope.js
var FocusScope_default = /*@__PURE__*/ defineComponent({
	__name: "FocusScope",
	props: {
		loop: {
			type: Boolean,
			required: false,
			default: false
		},
		trapped: {
			type: Boolean,
			required: false,
			default: false
		},
		present: {
			type: Boolean,
			required: false,
			default: true
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	emits: ["mountAutoFocus", "unmountAutoFocus"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const { currentRef, currentElement } = useForwardExpose();
		const lastFocusedElementRef = ref(null);
		const focusScopesStack = createFocusScopesStack();
		const focusScope = /*#__PURE__*/ reactive({
			paused: false,
			pause() {
				this.paused = true;
			},
			resume() {
				this.paused = false;
			}
		});
		watchEffect((cleanupFn) => {
			if (!isClient) return;
			const container = currentElement.value;
			if (!props.trapped) return;
			const ownerDocument = container?.ownerDocument ?? document;
			const root = container ? container.getRootNode() : ownerDocument;
			function handleFocusIn(event) {
				if (focusScope.paused || !container) return;
				const target = event.target;
				if (container.contains(target)) lastFocusedElementRef.value = target;
				else focus(lastFocusedElementRef.value, { select: true });
			}
			function handleFocusOut(event) {
				if (focusScope.paused || !container) return;
				const relatedTarget = event.relatedTarget;
				if (relatedTarget === null) return;
				if (!container.contains(relatedTarget)) focus(lastFocusedElementRef.value, { select: true });
			}
			function handleMutations(mutations) {
				const lastFocusedElement = lastFocusedElementRef.value;
				if (lastFocusedElement === null) return;
				if (!mutations.some((m) => m.removedNodes.length > 0)) return;
				const activeElement = getActiveElement();
				if (activeElement && container.contains(activeElement)) return;
				if (!container.contains(lastFocusedElement)) focus(container);
			}
			function handleDocumentFocusIn(event) {
				if (focusScope.paused || !container) return;
				const target = event.composedPath()[0];
				if (!containsComposed(container, target)) focus(lastFocusedElementRef.value, { select: true });
			}
			root.addEventListener("focusin", handleFocusIn);
			root.addEventListener("focusout", handleFocusOut);
			if (root !== ownerDocument) ownerDocument.addEventListener("focusin", handleDocumentFocusIn);
			const mutationObserver = new MutationObserver(handleMutations);
			if (container) mutationObserver.observe(container, {
				childList: true,
				subtree: true
			});
			cleanupFn(() => {
				root.removeEventListener("focusin", handleFocusIn);
				root.removeEventListener("focusout", handleFocusOut);
				if (root !== ownerDocument) ownerDocument.removeEventListener("focusin", handleDocumentFocusIn);
				mutationObserver.disconnect();
			});
		});
		function dispatchMountAutoFocus(container, previouslyFocusedElement) {
			const mountEvent = new CustomEvent(AUTOFOCUS_ON_MOUNT, EVENT_OPTIONS$1);
			const handleMountAutoFocus = (ev) => emits("mountAutoFocus", ev);
			container.addEventListener(AUTOFOCUS_ON_MOUNT, handleMountAutoFocus);
			container.dispatchEvent(mountEvent);
			container.removeEventListener(AUTOFOCUS_ON_MOUNT, handleMountAutoFocus);
			if (!mountEvent.defaultPrevented) {
				focusFirst$2(getTabbableCandidates(container), { select: true });
				if (getActiveElement() === previouslyFocusedElement) focus(container);
			}
		}
		watchEffect(async (cleanupFn) => {
			const container = currentElement.value;
			await nextTick();
			if (!container) return;
			if (props.present !== false) focusScopesStack.add(focusScope);
			const previouslyFocusedElement = getActiveElement();
			if (!container.contains(previouslyFocusedElement) && props.present !== false) dispatchMountAutoFocus(container, previouslyFocusedElement);
			cleanupFn(() => {
				const unmountEvent = new CustomEvent(AUTOFOCUS_ON_UNMOUNT, EVENT_OPTIONS$1);
				const unmountEventHandler = (ev) => {
					emits("unmountAutoFocus", ev);
				};
				container.addEventListener(AUTOFOCUS_ON_UNMOUNT, unmountEventHandler);
				container.dispatchEvent(unmountEvent);
				container.setAttribute("data-focus-scope-unmounting", "");
				setTimeout(() => {
					if (!unmountEvent.defaultPrevented) focus(previouslyFocusedElement ?? document.body, { select: true });
					container.removeEventListener(AUTOFOCUS_ON_UNMOUNT, unmountEventHandler);
					focusScopesStack.remove(focusScope);
					container.removeAttribute("data-focus-scope-unmounting");
				}, 0);
			});
		});
		watch(() => props.present, async (present, prevPresent) => {
			if (!isClient) return;
			if (present === false && prevPresent === true) {
				focusScopesStack.remove(focusScope);
				return;
			}
			if (present !== true || prevPresent !== false) return;
			focusScopesStack.add(focusScope);
			await nextTick();
			const container = currentElement.value;
			if (!container) return;
			const previouslyFocusedElement = getActiveElement();
			if (!container.contains(previouslyFocusedElement)) dispatchMountAutoFocus(container, previouslyFocusedElement);
		});
		function handleKeyDown(event) {
			if (!props.loop && !props.trapped) return;
			if (focusScope.paused) return;
			const isTabKey = event.key === "Tab" && !event.altKey && !event.ctrlKey && !event.metaKey;
			const focusedElement = getActiveElement();
			if (isTabKey && focusedElement) {
				const container = event.currentTarget;
				const [first, last] = getTabbableEdges(container);
				if (!(first && last)) {
					if (focusedElement === container) event.preventDefault();
				} else if (!event.shiftKey && focusedElement === last) {
					event.preventDefault();
					if (props.loop) focus(first, { select: true });
				} else if (event.shiftKey && focusedElement === first) {
					event.preventDefault();
					if (props.loop) focus(last, { select: true });
				}
			}
		}
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Primitive), {
				ref_key: "currentRef",
				ref: currentRef,
				tabindex: "-1",
				"as-child": __props.asChild,
				as: __props.as,
				onKeydown: handleKeyDown
			}, {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 8, ["as-child", "as"]);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Menu/utils.js
var ITEM_SELECT = "menu.itemSelect";
var SELECTION_KEYS = ["Enter", " "];
var FIRST_KEYS = [
	"ArrowDown",
	"PageUp",
	"Home"
];
var LAST_KEYS = [
	"ArrowUp",
	"PageDown",
	"End"
];
var FIRST_LAST_KEYS = /*@__PURE__*/ (() => [...FIRST_KEYS, ...LAST_KEYS])();
var SUB_OPEN_KEYS = {
	ltr: /*@__PURE__*/ (() => [...SELECTION_KEYS, "ArrowRight"])(),
	rtl: /*@__PURE__*/ (() => [...SELECTION_KEYS, "ArrowLeft"])()
};
var SUB_CLOSE_KEYS = {
	ltr: ["ArrowLeft"],
	rtl: ["ArrowRight"]
};
function getOpenState(open) {
	return open ? "open" : "closed";
}
function isIndeterminate(checked) {
	return checked === "indeterminate";
}
function getCheckedState(checked) {
	return isIndeterminate(checked) ? "indeterminate" : checked ? "checked" : "unchecked";
}
/**
* `entryFocus` is internal to the menu content wrappers (DropdownMenu, ContextMenu, Menubar),
* so drop a consumer's `@entry-focus` listener instead of letting it fall through to `MenuContent`.
*/
function omitEntryFocusListener(attrs) {
	const { onEntryFocus: _, onEntryFocusOnce: __, ...rest } = attrs;
	return rest;
}
function focusFirst$1(candidates) {
	const PREVIOUSLY_FOCUSED_ELEMENT = getActiveElement();
	for (const candidate of candidates) {
		if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
		candidate.focus();
		if (getActiveElement() !== PREVIOUSLY_FOCUSED_ELEMENT) return;
	}
}
function isPointInPolygon(point, polygon) {
	const { x, y } = point;
	let inside = false;
	for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
		const xi = polygon[i].x;
		const yi = polygon[i].y;
		const xj = polygon[j].x;
		const yj = polygon[j].y;
		if (yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
	}
	return inside;
}
function isPointerInGraceArea(event, area) {
	if (!area) return false;
	return isPointInPolygon({
		x: event.clientX,
		y: event.clientY
	}, area);
}
function isMouseEvent(event) {
	return event.pointerType === "mouse";
}
// ../../../../node_modules/reka-ui/dist/Teleport/Teleport.js
var Teleport_default = /*@__PURE__*/ defineComponent({
	__name: "Teleport",
	props: {
		to: {
			type: null,
			required: false
		},
		disabled: {
			type: Boolean,
			required: false
		},
		defer: {
			type: Boolean,
			required: false
		},
		forceMount: {
			type: Boolean,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		const configContext = injectConfigProviderContext({});
		const target = computed(() => props.to ?? configContext.teleportTo?.value ?? "body");
		const isMounted = useMounted();
		return (_ctx, _cache) => {
			return unref(isMounted) || __props.forceMount ? (openBlock(), createBlock(Teleport, {
				key: 0,
				to: target.value,
				disabled: __props.disabled,
				defer: __props.defer
			}, [renderSlot(_ctx.$slots, "default")], 8, [
				"to",
				"disabled",
				"defer"
			])) : createCommentVNode("v-if", true);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Collection/Collection.js
var ITEM_DATA_ATTR = "data-reka-collection-item";
function useCollection(options = {}) {
	const { key = "", isProvider = false } = options;
	const injectionKey = `${key}CollectionProvider`;
	let context;
	if (isProvider) {
		const itemMap = ref(/* @__PURE__ */ new Map());
		context = {
			collectionRef: ref(),
			itemMap
		};
		provide(injectionKey, context);
	} else context = inject(injectionKey);
	const getItem = (element, includeDisabledItem = false) => {
		if (!context.collectionRef.value) return void 0;
		const item = context.itemMap.value.get(element);
		return item && (includeDisabledItem || item.ref.dataset.disabled !== "") ? item : void 0;
	};
	const getItems = (includeDisabledItem = false) => {
		const collectionNode = context.collectionRef.value;
		if (!collectionNode) return [];
		const orderedNodes = Array.from(collectionNode.querySelectorAll(`[${ITEM_DATA_ATTR}]`));
		const orderMap = new Map(orderedNodes.map((node, index) => [node, index]));
		const orderedItems = Array.from(context.itemMap.value.values()).sort((a, b) => (orderMap.get(a.ref) ?? -1) - (orderMap.get(b.ref) ?? -1));
		if (includeDisabledItem) return orderedItems;
		else return orderedItems.filter((i) => i.ref.dataset.disabled !== "");
	};
	const CollectionSlot = /*#__PURE__*/ defineComponent({
		name: "CollectionSlot",
		inheritAttrs: false,
		setup(_, { slots, attrs }) {
			const { primitiveElement, currentElement } = usePrimitiveElement();
			watch(currentElement, () => {
				context.collectionRef.value = currentElement.value;
			});
			return () => h(Slot, {
				ref: primitiveElement,
				...attrs
			}, slots);
		}
	});
	const CollectionItem = /*#__PURE__*/ defineComponent({
		name: "CollectionItem",
		inheritAttrs: false,
		props: { value: { validator: () => true } },
		setup(props, { slots, attrs }) {
			const { primitiveElement, currentElement } = usePrimitiveElement();
			watchEffect((cleanupFn) => {
				if (currentElement.value) {
					const key$1 = markRaw(currentElement.value);
					context.itemMap.value.set(key$1, {
						ref: currentElement.value,
						value: props.value
					});
					cleanupFn(() => context.itemMap.value.delete(key$1));
				}
			});
			return () => h(Slot, {
				...attrs,
				[ITEM_DATA_ATTR]: "",
				ref: primitiveElement
			}, slots);
		}
	});
	return {
		getItems,
		getItem,
		reactiveItems: computed(() => Array.from(context.itemMap.value.values())),
		itemMapSize: computed(() => context.itemMap.value.size),
		CollectionSlot,
		CollectionItem
	};
}
// ../../../../node_modules/reka-ui/dist/RovingFocus/utils.js
var ENTRY_FOCUS = "rovingFocusGroup.onEntryFocus";
var EVENT_OPTIONS = {
	bubbles: false,
	cancelable: true
};
function focusFirst(candidates, preventScroll = false) {
	const PREVIOUSLY_FOCUSED_ELEMENT = getActiveElement();
	for (const candidate of candidates) {
		if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
		candidate.focus({ preventScroll });
		if (getActiveElement() !== PREVIOUSLY_FOCUSED_ELEMENT) return;
	}
}
// ../../../../node_modules/reka-ui/dist/Popper/PopperRoot.js
var [injectPopperRootContext, providePopperRootContext] = /*@__PURE__*/ createContext("PopperRoot");
var PopperRoot_default = /*@__PURE__*/ defineComponent({
	inheritAttrs: false,
	__name: "PopperRoot",
	setup(__props) {
		const anchor = ref();
		providePopperRootContext({
			anchor,
			onAnchorChange: (element) => anchor.value = element
		});
		return (_ctx, _cache) => {
			return renderSlot(_ctx.$slots, "default");
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Popper/PopperAnchor.js
var PopperAnchor_default = /*@__PURE__*/ defineComponent({
	__name: "PopperAnchor",
	props: {
		reference: {
			type: null,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		const { forwardRef, currentElement } = useForwardExpose();
		const rootContext = injectPopperRootContext();
		watchPostEffect(() => {
			rootContext.onAnchorChange(props.reference ?? currentElement.value);
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Primitive), {
				ref: unref(forwardRef),
				as: __props.as,
				"as-child": __props.asChild
			}, {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 8, ["as", "as-child"]);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/component/Arrow.js
var _hoisted_1$8 = {
	key: 0,
	d: "M0 0L6 6L12 0"
};
var _hoisted_2$2 = {
	key: 1,
	d: "M0 0L4.58579 4.58579C5.36683 5.36683 6.63316 5.36684 7.41421 4.58579L12 0"
};
var Arrow_default = /*@__PURE__*/ defineComponent({
	__name: "Arrow",
	props: {
		width: {
			type: Number,
			required: false,
			default: 10
		},
		height: {
			type: Number,
			required: false,
			default: 5
		},
		rounded: {
			type: Boolean,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "svg"
		}
	},
	setup(__props) {
		const props = __props;
		useForwardExpose();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Primitive), mergeProps(props, {
				width: __props.width,
				height: __props.height,
				viewBox: __props.asChild ? void 0 : "0 0 12 6",
				preserveAspectRatio: __props.asChild ? void 0 : "none"
			}), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default", {}, () => [!__props.rounded ? (openBlock(), createElementBlock("path", _hoisted_1$8)) : (openBlock(), createElementBlock("path", _hoisted_2$2))])]),
				_: 3
			}, 16, [
				"width",
				"height",
				"viewBox",
				"preserveAspectRatio"
			]);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Popper/utils.js
function isNotNull(value) {
	return value !== null;
}
function transformOrigin(options) {
	return {
		name: "transformOrigin",
		options,
		fn(data) {
			const { placement, rects, middlewareData } = data;
			const isArrowHidden = middlewareData.arrow?.centerOffset !== 0;
			const arrowWidth = isArrowHidden ? 0 : options.arrowWidth;
			const arrowHeight = isArrowHidden ? 0 : options.arrowHeight;
			const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
			const noArrowAlignX = {
				start: options.dir === "rtl" ? "100%" : "0%",
				center: "50%",
				end: options.dir === "rtl" ? "0%" : "100%"
			}[placedAlign];
			const noArrowAlignY = {
				start: "0%",
				center: "50%",
				end: "100%"
			}[placedAlign];
			const arrowXCenter = (middlewareData.arrow?.x ?? 0) + arrowWidth / 2;
			const arrowYCenter = (middlewareData.arrow?.y ?? 0) + arrowHeight / 2;
			let x = "";
			let y = "";
			if (placedSide === "bottom") {
				x = isArrowHidden ? noArrowAlignX : `${arrowXCenter}px`;
				y = `${-arrowHeight}px`;
			} else if (placedSide === "top") {
				x = isArrowHidden ? noArrowAlignX : `${arrowXCenter}px`;
				y = `${rects.floating.height + arrowHeight}px`;
			} else if (placedSide === "right") {
				x = `${-arrowHeight}px`;
				y = isArrowHidden ? noArrowAlignY : `${arrowYCenter}px`;
			} else if (placedSide === "left") {
				x = `${rects.floating.width + arrowHeight}px`;
				y = isArrowHidden ? noArrowAlignY : `${arrowYCenter}px`;
			}
			return { data: {
				x,
				y
			} };
		}
	};
}
function getSideAndAlignFromPlacement(placement) {
	const [side, align = "center"] = placement.split("-");
	return [side, align];
}
// ../../../../node_modules/@floating-ui/vue/dist/floating-ui.vue.mjs
function isComponentPublicInstance(target) {
	return target != null && typeof target === "object" && "$el" in target;
}
function unwrapElement(target) {
	if (isComponentPublicInstance(target)) {
		const element = target.$el;
		return isNode(element) && getNodeName(element) === "#comment" ? null : element;
	}
	return target;
}
/**
* Positions an inner element of the floating element such that it is centered to the reference element.
* @param options The arrow options.
* @see https://floating-ui.com/docs/arrow
*/
function arrow(options) {
	return {
		name: "arrow",
		options,
		fn(args) {
			const element = unwrapElement(toValue(options.element));
			if (element == null) return {};
			return arrow$2({
				element,
				padding: options.padding
			}).fn(args);
		}
	};
}
function getDPR(element) {
	if (typeof window === "undefined") return 1;
	return (element.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function roundByDPR(element, value) {
	const dpr = getDPR(element);
	return Math.round(value * dpr) / dpr;
}
/**
* Computes the `x` and `y` coordinates that will place the floating element next to a reference element when it is given a certain CSS positioning strategy.
* @param reference The reference template ref.
* @param floating The floating template ref.
* @param options The floating options.
* @see https://floating-ui.com/docs/vue
*/
function useFloating(reference, floating, options) {
	if (options === void 0) options = {};
	const whileElementsMountedOption = options.whileElementsMounted;
	const openOption = computed(() => {
		var _toValue;
		return (_toValue = toValue(options.open)) != null ? _toValue : true;
	});
	const middlewareOption = computed(() => toValue(options.middleware));
	const placementOption = computed(() => {
		var _toValue2;
		return (_toValue2 = toValue(options.placement)) != null ? _toValue2 : "bottom";
	});
	const strategyOption = computed(() => {
		var _toValue3;
		return (_toValue3 = toValue(options.strategy)) != null ? _toValue3 : "absolute";
	});
	const transformOption = computed(() => {
		var _toValue4;
		return (_toValue4 = toValue(options.transform)) != null ? _toValue4 : true;
	});
	const referenceElement = computed(() => unwrapElement(reference.value));
	const floatingElement = computed(() => unwrapElement(floating.value));
	const x = ref(0);
	const y = ref(0);
	const strategy = ref(strategyOption.value);
	const placement = ref(placementOption.value);
	const middlewareData = shallowRef({});
	const isPositioned = ref(false);
	const floatingStyles = computed(() => {
		const initialStyles = {
			position: strategy.value,
			left: "0",
			top: "0"
		};
		if (!floatingElement.value) return initialStyles;
		const xVal = roundByDPR(floatingElement.value, x.value);
		const yVal = roundByDPR(floatingElement.value, y.value);
		if (transformOption.value) return {
			...initialStyles,
			transform: "translate(" + xVal + "px, " + yVal + "px)",
			...getDPR(floatingElement.value) >= 1.5 && { willChange: "transform" }
		};
		return {
			position: strategy.value,
			left: xVal + "px",
			top: yVal + "px"
		};
	});
	let whileElementsMountedCleanup;
	function update() {
		if (referenceElement.value == null || floatingElement.value == null) return;
		const open = openOption.value;
		computePosition(referenceElement.value, floatingElement.value, {
			middleware: middlewareOption.value,
			placement: placementOption.value,
			strategy: strategyOption.value
		}).then((position) => {
			x.value = position.x;
			y.value = position.y;
			strategy.value = position.strategy;
			placement.value = position.placement;
			middlewareData.value = position.middlewareData;
			/**
			* The floating element's position may be recomputed while it's closed
			* but still mounted (such as when transitioning out). To ensure
			* `isPositioned` will be `false` initially on the next open, avoid
			* setting it to `true` when `open === false` (must be specified).
			*/
			isPositioned.value = open !== false;
		});
	}
	function cleanup() {
		if (typeof whileElementsMountedCleanup === "function") {
			whileElementsMountedCleanup();
			whileElementsMountedCleanup = void 0;
		}
	}
	function attach() {
		cleanup();
		if (whileElementsMountedOption === void 0) {
			update();
			return;
		}
		if (referenceElement.value != null && floatingElement.value != null) {
			whileElementsMountedCleanup = whileElementsMountedOption(referenceElement.value, floatingElement.value, update);
			return;
		}
	}
	function reset() {
		if (!openOption.value) isPositioned.value = false;
	}
	watch([
		middlewareOption,
		placementOption,
		strategyOption,
		openOption
	], update, { flush: "sync" });
	watch([referenceElement, floatingElement], attach, { flush: "sync" });
	watch(openOption, reset, { flush: "sync" });
	if (getCurrentScope()) onScopeDispose(cleanup);
	return {
		x: shallowReadonly(x),
		y: shallowReadonly(y),
		strategy: shallowReadonly(strategy),
		placement: shallowReadonly(placement),
		middlewareData: shallowReadonly(middlewareData),
		isPositioned: shallowReadonly(isPositioned),
		floatingStyles,
		update
	};
}
// ../../../../node_modules/reka-ui/dist/Popper/PopperContent.js
var _hoisted_1$7 = ["dir"];
var PopperContentPropsDefaultValue = {
	side: "bottom",
	sideOffset: 0,
	sideFlip: true,
	align: "center",
	alignOffset: 0,
	alignFlip: true,
	arrowPadding: 0,
	hideShiftedArrow: true,
	avoidCollisions: true,
	collisionBoundary: () => [],
	collisionPadding: 0,
	sticky: "partial",
	hideWhenDetached: false,
	positionStrategy: "fixed",
	updatePositionStrategy: "optimized",
	prioritizePosition: false
};
var [injectPopperContentContext, providePopperContentContext] = /*@__PURE__*/ createContext("PopperContent");
var PopperContent_default = /*@__PURE__*/ defineComponent({
	inheritAttrs: false,
	__name: "PopperContent",
	props: /*@__PURE__*/ mergeDefaults({
		memoDependencies: {
			type: Array,
			required: false
		},
		side: {
			type: null,
			required: false
		},
		sideOffset: {
			type: Number,
			required: false
		},
		sideFlip: {
			type: Boolean,
			required: false
		},
		align: {
			type: null,
			required: false
		},
		alignOffset: {
			type: Number,
			required: false
		},
		alignFlip: {
			type: Boolean,
			required: false
		},
		avoidCollisions: {
			type: Boolean,
			required: false
		},
		collisionBoundary: {
			type: null,
			required: false
		},
		collisionPadding: {
			type: [Number, Object],
			required: false
		},
		arrowPadding: {
			type: Number,
			required: false
		},
		hideShiftedArrow: {
			type: Boolean,
			required: false
		},
		sticky: {
			type: String,
			required: false
		},
		hideWhenDetached: {
			type: Boolean,
			required: false
		},
		positionStrategy: {
			type: String,
			required: false
		},
		updatePositionStrategy: {
			type: String,
			required: false
		},
		disableUpdateOnLayoutShift: {
			type: Boolean,
			required: false
		},
		prioritizePosition: {
			type: Boolean,
			required: false
		},
		reference: {
			type: null,
			required: false
		},
		dir: {
			type: String,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	}, /*@__PURE__*/ (() => ({ ...PopperContentPropsDefaultValue }))()),
	emits: ["placed"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const rootContext = injectPopperRootContext();
		const { forwardRef, currentElement: contentElement } = useForwardExpose();
		const dir = useDirection(computed(() => props.dir));
		const floatingRef = ref();
		const arrow$1 = ref();
		const { width: arrowWidth, height: arrowHeight } = useSize(arrow$1);
		const desiredPlacement = computed(() => props.side + (props.align !== "center" ? `-${props.align}` : ""));
		const collisionPadding = computed(() => {
			return typeof props.collisionPadding === "number" ? props.collisionPadding : {
				top: 0,
				right: 0,
				bottom: 0,
				left: 0,
				...props.collisionPadding
			};
		});
		const boundary = computed(() => {
			return Array.isArray(props.collisionBoundary) ? props.collisionBoundary : [props.collisionBoundary];
		});
		const detectOverflowOptions = computed(() => {
			return {
				padding: collisionPadding.value,
				boundary: boundary.value.filter(isNotNull),
				altBoundary: boundary.value.length > 0
			};
		});
		const flipOptions = computed(() => {
			return {
				mainAxis: props.sideFlip,
				crossAxis: props.alignFlip
			};
		});
		const computedMiddleware = computed(() => {
			return [
				offset({
					mainAxis: props.sideOffset + arrowHeight.value,
					alignmentAxis: props.alignOffset
				}),
				props.prioritizePosition && props.avoidCollisions && flip({
					...detectOverflowOptions.value,
					...flipOptions.value
				}),
				props.avoidCollisions && shift({
					mainAxis: true,
					crossAxis: !!props.prioritizePosition,
					limiter: props.sticky === "partial" ? limitShift() : void 0,
					...detectOverflowOptions.value
				}),
				!props.prioritizePosition && props.avoidCollisions && flip({
					...detectOverflowOptions.value,
					...flipOptions.value
				}),
				size({
					...detectOverflowOptions.value,
					apply: ({ elements, rects, availableWidth, availableHeight }) => {
						const { width: anchorWidth, height: anchorHeight } = rects.reference;
						const contentStyle = elements.floating.style;
						contentStyle.setProperty("--reka-popper-available-width", `${availableWidth}px`);
						contentStyle.setProperty("--reka-popper-available-height", `${availableHeight}px`);
						contentStyle.setProperty("--reka-popper-anchor-width", `${anchorWidth}px`);
						contentStyle.setProperty("--reka-popper-anchor-height", `${anchorHeight}px`);
					}
				}),
				arrow$1.value && arrow({
					element: arrow$1.value,
					padding: props.arrowPadding
				}),
				transformOrigin({
					arrowWidth: arrowWidth.value,
					arrowHeight: arrowHeight.value,
					dir: dir.value
				}),
				props.hideWhenDetached && hide({
					strategy: "referenceHidden",
					...detectOverflowOptions.value
				})
			];
		});
		const { floatingStyles, placement, isPositioned, middlewareData, update } = useFloating(computed(() => props.reference ?? rootContext.anchor.value), floatingRef, {
			strategy: props.positionStrategy,
			placement: desiredPlacement,
			whileElementsMounted: (...args) => {
				return autoUpdate(...args, {
					layoutShift: !props.disableUpdateOnLayoutShift,
					animationFrame: props.updatePositionStrategy === "always"
				});
			},
			middleware: computedMiddleware
		});
		const placedSide = computed(() => getSideAndAlignFromPlacement(placement.value)[0]);
		const placedAlign = computed(() => getSideAndAlignFromPlacement(placement.value)[1]);
		watchPostEffect(() => {
			if (isPositioned.value) emits("placed");
		});
		const shouldHideArrow = computed(() => {
			const cannotCenterArrow = middlewareData.value.arrow?.centerOffset !== 0;
			return props.hideShiftedArrow && cannotCenterArrow;
		});
		const contentZIndex = ref("");
		watchEffect(() => {
			if (contentElement.value) contentZIndex.value = window.getComputedStyle(contentElement.value).zIndex;
		});
		providePopperContentContext({
			placedSide,
			onArrowChange: (element) => arrow$1.value = element,
			arrowX: computed(() => middlewareData.value.arrow?.x ?? 0),
			arrowY: computed(() => middlewareData.value.arrow?.y ?? 0),
			shouldHideArrow
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				ref_key: "floatingRef",
				ref: floatingRef,
				"data-reka-popper-content-wrapper": "",
				dir: unref(dir),
				style: normalizeStyle({
					...unref(floatingStyles),
					transform: unref(isPositioned) ? unref(floatingStyles).transform : "translate(0, -200%)",
					minWidth: "max-content",
					zIndex: contentZIndex.value,
					["--reka-popper-transform-origin"]: [unref(middlewareData).transformOrigin?.x, unref(middlewareData).transformOrigin?.y].join(" "),
					...unref(middlewareData).hide?.referenceHidden && {
						visibility: "hidden",
						pointerEvents: "none"
					}
				})
			}, [props.memoDependencies ? withMemo([
				props.asChild,
				props.as,
				placedSide.value,
				placedAlign.value,
				unref(isPositioned),
				...Object.values(_ctx.$attrs),
				...props.memoDependencies
			], () => (openBlock(), createBlock(unref(Primitive), mergeProps({
				key: 0,
				ref: unref(forwardRef)
			}, _ctx.$attrs, {
				"as-child": props.asChild,
				as: props.as,
				"data-side": placedSide.value,
				"data-align": placedAlign.value,
				style: { animation: !unref(isPositioned) ? "none" : void 0 }
			}), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16, [
				"as-child",
				"as",
				"data-side",
				"data-align",
				"style"
			])), _cache, 0) : (openBlock(), createBlock(unref(Primitive), mergeProps({
				key: 1,
				ref: unref(forwardRef)
			}, _ctx.$attrs, {
				"as-child": props.asChild,
				as: props.as,
				"data-side": placedSide.value,
				"data-align": placedAlign.value,
				dir: unref(dir),
				style: { animation: !unref(isPositioned) ? "none" : void 0 }
			}), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16, [
				"as-child",
				"as",
				"data-side",
				"data-align",
				"dir",
				"style"
			]))], 12, _hoisted_1$7);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Popper/PopperArrow.js
var OPPOSITE_SIDE = {
	top: "bottom",
	right: "left",
	bottom: "top",
	left: "right"
};
var PopperArrow_default = /*@__PURE__*/ defineComponent({
	inheritAttrs: false,
	__name: "PopperArrow",
	props: {
		width: {
			type: Number,
			required: false
		},
		height: {
			type: Number,
			required: false
		},
		rounded: {
			type: Boolean,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "svg"
		}
	},
	setup(__props) {
		const { forwardRef } = useForwardExpose();
		const contentContext = injectPopperContentContext();
		const baseSide = computed(() => OPPOSITE_SIDE[contentContext.placedSide.value]);
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("span", {
				ref: (el) => {
					unref(contentContext).onArrowChange(el ?? void 0);
				},
				style: normalizeStyle({
					position: "absolute",
					left: unref(contentContext).arrowX?.value ? `${unref(contentContext).arrowX?.value}px` : void 0,
					top: unref(contentContext).arrowY?.value ? `${unref(contentContext).arrowY?.value}px` : void 0,
					[baseSide.value]: 0,
					transformOrigin: {
						top: "",
						right: "0 0",
						bottom: "center 0",
						left: "100% 0"
					}[unref(contentContext).placedSide.value],
					transform: {
						top: "translateY(100%)",
						right: "translateY(50%) rotate(90deg) translateX(-50%)",
						bottom: `rotate(180deg)`,
						left: "translateY(50%) rotate(-90deg) translateX(50%)"
					}[unref(contentContext).placedSide.value],
					visibility: unref(contentContext).shouldHideArrow.value ? "hidden" : void 0
				})
			}, [createVNode(Arrow_default, mergeProps(_ctx.$attrs, {
				ref: unref(forwardRef),
				style: { display: "block" },
				as: __props.as,
				"as-child": __props.asChild,
				rounded: __props.rounded,
				width: __props.width,
				height: __props.height
			}), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16, [
				"as",
				"as-child",
				"rounded",
				"width",
				"height"
			])], 4);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/RovingFocus/RovingFocusGroup.js
var [injectRovingFocusGroupContext, provideRovingFocusGroupContext] = /*@__PURE__*/ createContext("RovingFocusGroup");
var RovingFocusGroup_default = /*@__PURE__*/ defineComponent({
	__name: "RovingFocusGroup",
	props: {
		orientation: {
			type: String,
			required: false,
			default: void 0
		},
		dir: {
			type: String,
			required: false
		},
		loop: {
			type: Boolean,
			required: false,
			default: false
		},
		currentTabStopId: {
			type: [String, null],
			required: false
		},
		defaultCurrentTabStopId: {
			type: String,
			required: false
		},
		preventScrollOnEntryFocus: {
			type: Boolean,
			required: false,
			default: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	emits: ["entryFocus", "update:currentTabStopId"],
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const { loop, orientation, dir: propDir } = toRefs(props);
		const dir = useDirection(propDir);
		const currentTabStopId = useVModel(props, "currentTabStopId", emits, {
			defaultValue: props.defaultCurrentTabStopId,
			passive: props.currentTabStopId === void 0
		});
		const isTabbingBackOut = ref(false);
		const isClickFocus = ref(false);
		const focusableItemsCount = ref(0);
		const { getItems, CollectionSlot } = useCollection({ isProvider: true });
		function handleFocus(event) {
			const isKeyboardFocus = !isClickFocus.value;
			if (event.currentTarget && event.target === event.currentTarget && isKeyboardFocus && !isTabbingBackOut.value) {
				const entryFocusEvent = new CustomEvent(ENTRY_FOCUS, EVENT_OPTIONS);
				event.currentTarget.dispatchEvent(entryFocusEvent);
				emits("entryFocus", entryFocusEvent);
				if (!entryFocusEvent.defaultPrevented) {
					const items = getItems().map((i) => i.ref).filter((i) => i.dataset.disabled !== "");
					focusFirst([
						items.find((item) => item.getAttribute("data-active") === ""),
						items.find((item) => item.getAttribute("data-highlighted") === ""),
						items.find((item) => item.id === currentTabStopId.value),
						...items
					].filter(Boolean), props.preventScrollOnEntryFocus);
				}
			}
			isClickFocus.value = false;
		}
		function handleMouseUp() {
			setTimeout(() => {
				isClickFocus.value = false;
			}, 1);
		}
		__expose({ getItems });
		provideRovingFocusGroupContext({
			loop,
			dir,
			orientation,
			currentTabStopId,
			onItemFocus: (tabStopId) => {
				currentTabStopId.value = tabStopId;
			},
			onItemShiftTab: () => {
				isTabbingBackOut.value = true;
			},
			onFocusableItemAdd: () => {
				focusableItemsCount.value++;
			},
			onFocusableItemRemove: () => {
				focusableItemsCount.value--;
			}
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(CollectionSlot), null, {
				default: withCtx(() => [createVNode(unref(Primitive), {
					tabindex: isTabbingBackOut.value || focusableItemsCount.value === 0 ? -1 : 0,
					"data-orientation": unref(orientation),
					as: __props.as,
					"as-child": __props.asChild,
					dir: unref(dir),
					style: { "outline": "none" },
					onMousedown: _cache[0] || (_cache[0] = ($event) => isClickFocus.value = true),
					onMouseup: handleMouseUp,
					onFocus: handleFocus,
					onBlur: _cache[1] || (_cache[1] = ($event) => isTabbingBackOut.value = false)
				}, {
					default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
					_: 3
				}, 8, [
					"tabindex",
					"data-orientation",
					"as",
					"as-child",
					"dir"
				])]),
				_: 3
			});
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Menu/MenuAnchor.js
var MenuAnchor_default = /*@__PURE__*/ defineComponent({
	__name: "MenuAnchor",
	props: {
		reference: {
			type: null,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(PopperAnchor_default), normalizeProps(guardReactiveProps(props)), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Menu/MenuArrow.js
var MenuArrow_default = /*@__PURE__*/ defineComponent({
	__name: "MenuArrow",
	props: {
		width: {
			type: Number,
			required: false
		},
		height: {
			type: Number,
			required: false
		},
		rounded: {
			type: Boolean,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(PopperArrow_default), normalizeProps(guardReactiveProps(props)), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/shared/useIsUsingKeyboard.js
function useIsUsingKeyboardImpl() {
	const isUsingKeyboard = ref(false);
	onMounted(() => {
		useEventListener("keydown", () => {
			isUsingKeyboard.value = true;
		}, {
			capture: true,
			passive: true
		});
		useEventListener(["pointerdown", "pointermove"], () => {
			isUsingKeyboard.value = false;
		}, {
			capture: true,
			passive: true
		});
	});
	return isUsingKeyboard;
}
var useIsUsingKeyboard = /*@__PURE__*/ createSharedComposable(useIsUsingKeyboardImpl);
// ../../../../node_modules/reka-ui/dist/Menu/MenuRoot.js
var [injectMenuContext, provideMenuContext] = /*@__PURE__*/ createContext(["MenuRoot", "MenuSub"], "MenuContext");
var [injectMenuRootContext, provideMenuRootContext] = /*@__PURE__*/ createContext("MenuRoot");
var MenuRoot_default = /*@__PURE__*/ defineComponent({
	__name: "MenuRoot",
	props: {
		open: {
			type: Boolean,
			required: false,
			default: false
		},
		dir: {
			type: String,
			required: false
		},
		modal: {
			type: Boolean,
			required: false,
			default: true
		}
	},
	emits: ["update:open"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const { modal, dir: propDir } = toRefs(props);
		const dir = useDirection(propDir);
		const open = useVModel(props, "open", emits);
		const content = ref();
		const isUsingKeyboardRef = useIsUsingKeyboard();
		provideMenuContext({
			open,
			onOpenChange: (value) => {
				open.value = value;
			},
			content,
			onContentChange: (element) => {
				content.value = element;
			}
		});
		provideMenuRootContext({
			onClose: () => {
				open.value = false;
			},
			isUsingKeyboardRef,
			dir,
			modal
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(PopperRoot_default), null, {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			});
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Menu/MenuContentImpl.js
var [injectMenuContentContext, provideMenuContentContext] = /*@__PURE__*/ createContext("MenuContent");
var MenuContentImpl_default = /*@__PURE__*/ defineComponent({
	__name: "MenuContentImpl",
	props: /*@__PURE__*/ mergeDefaults({
		loop: {
			type: Boolean,
			required: false
		},
		disableOutsidePointerEvents: {
			type: Boolean,
			required: false
		},
		disableOutsideScroll: {
			type: Boolean,
			required: false
		},
		trapFocus: {
			type: Boolean,
			required: false
		},
		memoDependencies: {
			type: Array,
			required: false
		},
		side: {
			type: null,
			required: false
		},
		sideOffset: {
			type: Number,
			required: false
		},
		sideFlip: {
			type: Boolean,
			required: false
		},
		align: {
			type: null,
			required: false
		},
		alignOffset: {
			type: Number,
			required: false
		},
		alignFlip: {
			type: Boolean,
			required: false
		},
		avoidCollisions: {
			type: Boolean,
			required: false
		},
		collisionBoundary: {
			type: null,
			required: false
		},
		collisionPadding: {
			type: [Number, Object],
			required: false
		},
		arrowPadding: {
			type: Number,
			required: false
		},
		hideShiftedArrow: {
			type: Boolean,
			required: false
		},
		sticky: {
			type: String,
			required: false
		},
		hideWhenDetached: {
			type: Boolean,
			required: false
		},
		positionStrategy: {
			type: String,
			required: false
		},
		updatePositionStrategy: {
			type: String,
			required: false
		},
		disableUpdateOnLayoutShift: {
			type: Boolean,
			required: false
		},
		prioritizePosition: {
			type: Boolean,
			required: false
		},
		reference: {
			type: null,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	}, /*@__PURE__*/ (() => ({ ...PopperContentPropsDefaultValue }))()),
	emits: [
		"escapeKeyDown",
		"pointerDownOutside",
		"focusOutside",
		"interactOutside",
		"entryFocus",
		"openAutoFocus",
		"closeAutoFocus",
		"dismiss"
	],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const menuContext = injectMenuContext();
		const rootContext = injectMenuRootContext();
		const { trapFocus, disableOutsidePointerEvents, loop } = toRefs(props);
		useFocusGuards();
		useBodyScrollLock(disableOutsidePointerEvents.value);
		const searchRef = ref("");
		const timerRef = ref(0);
		const pointerGraceTimerRef = ref(0);
		const pointerGraceIntentRef = ref(null);
		const pointerDirRef = ref("right");
		const lastPointerXRef = ref(0);
		const currentItemId = ref(null);
		const rovingFocusGroupRef = ref();
		const { forwardRef, currentElement: contentElement } = useForwardExpose();
		const { handleTypeaheadSearch } = useTypeahead();
		const highlightedElement = ref();
		function onKeydownNavigation(event) {
			const el = useArrowNavigation(event, highlightedElement.value || getActiveElement(), contentElement.value, {
				loop: loop.value,
				arrowKeyOptions: "vertical",
				dir: rootContext?.dir.value,
				focus: false,
				attributeName: "[data-reka-collection-item]:not([data-disabled])"
			});
			if (el) {
				highlightedElement.value = el;
				el.scrollIntoView({ block: "nearest" });
			}
		}
		function onKeydownEnter() {
			if (highlightedElement.value) highlightedElement.value.click();
		}
		const filterElement = ref();
		const activeSubmenuContext = ref();
		watch(highlightedElement, (el) => {
			if (activeSubmenuContext.value && (el === void 0 || el !== activeSubmenuContext.value.trigger.value)) {
				if (el === void 0) return;
				activeSubmenuContext.value.onOpenChange(false);
				activeSubmenuContext.value = void 0;
			}
		});
		watch(contentElement, (el) => {
			menuContext.onContentChange(el);
		});
		onUnmounted(() => {
			window.clearTimeout(timerRef.value);
		});
		function isPointerMovingToSubmenu(event) {
			return pointerDirRef.value === pointerGraceIntentRef.value?.side && isPointerInGraceArea(event, pointerGraceIntentRef.value?.area);
		}
		async function handleMountAutoFocus(event) {
			emits("openAutoFocus", event);
			if (event.defaultPrevented) return;
			event.preventDefault();
			contentElement.value?.focus({ preventScroll: true });
		}
		function handleKeyDown(event) {
			if (event.defaultPrevented) return;
			const target = event.target;
			const isKeyDownInside = target.closest("[data-reka-menu-content]") === event.currentTarget;
			const isKeyDownInTextField = ["input", "textarea"].includes(target.tagName.toLowerCase());
			const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
			const isCharacterKey = event.key.length === 1;
			const el = useArrowNavigation(event, getActiveElement(), contentElement.value, {
				loop: loop.value,
				arrowKeyOptions: "vertical",
				dir: rootContext?.dir.value,
				focus: true,
				attributeName: "[data-reka-collection-item]:not([data-disabled])"
			});
			if (el) return el?.focus();
			if (event.code === "Space") return;
			const collectionItems = rovingFocusGroupRef.value?.getItems() ?? [];
			if (isKeyDownInside) {
				if (event.key === "Tab" && rootContext.modal.value) event.preventDefault();
				if (!isModifierKey && isCharacterKey && !isKeyDownInTextField) handleTypeaheadSearch(event.key, collectionItems);
			}
			if (event.target !== contentElement.value) return;
			if (!FIRST_LAST_KEYS.includes(event.key)) return;
			event.preventDefault();
			const candidateNodes = [...collectionItems.map((item) => item.ref)];
			if (LAST_KEYS.includes(event.key)) candidateNodes.reverse();
			focusFirst$1(candidateNodes);
		}
		function handleBlur(event) {
			if (!event?.currentTarget?.contains?.(event.target)) {
				window.clearTimeout(timerRef.value);
				searchRef.value = "";
			}
		}
		function handlePointerMove(event) {
			if (!isMouseEvent(event)) return;
			const target = event.target;
			const pointerXHasChanged = lastPointerXRef.value !== event.clientX;
			if ((event?.currentTarget)?.contains(target) && pointerXHasChanged) {
				const newDir = event.clientX > lastPointerXRef.value ? "right" : "left";
				pointerDirRef.value = newDir;
				lastPointerXRef.value = event.clientX;
			}
		}
		function handlePointerEnter(event) {
			if (!isMouseEvent(event)) return;
			if (filterElement.value) filterElement.value.focus();
		}
		provideMenuContentContext({
			onItemEnter: (event) => {
				if (isPointerMovingToSubmenu(event)) return true;
				else return false;
			},
			onItemLeave: (event) => {
				if (isPointerMovingToSubmenu(event)) return true;
				if (!["INPUT", "TEXTAREA"].includes(getActiveElement()?.tagName || "")) contentElement.value?.focus();
				currentItemId.value = null;
				return false;
			},
			onTriggerLeave: (event) => {
				if (isPointerMovingToSubmenu(event)) return true;
				else return false;
			},
			searchRef,
			highlightedElement,
			onKeydownNavigation,
			onKeydownEnter,
			filterElement,
			onFilterElementChange: (el) => {
				filterElement.value = el;
			},
			activeSubmenuContext,
			pointerGraceTimerRef,
			onPointerGraceIntentChange: (intent) => {
				pointerGraceIntentRef.value = intent;
			}
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(FocusScope_default), {
				"as-child": "",
				trapped: unref(trapFocus),
				onMountAutoFocus: handleMountAutoFocus,
				onUnmountAutoFocus: _cache[7] || (_cache[7] = ($event) => emits("closeAutoFocus", $event))
			}, {
				default: withCtx(() => [createVNode(unref(DismissableLayer_default), {
					"as-child": "",
					"disable-outside-pointer-events": unref(disableOutsidePointerEvents),
					onEscapeKeyDown: _cache[2] || (_cache[2] = ($event) => emits("escapeKeyDown", $event)),
					onPointerDownOutside: _cache[3] || (_cache[3] = ($event) => emits("pointerDownOutside", $event)),
					onFocusOutside: _cache[4] || (_cache[4] = ($event) => emits("focusOutside", $event)),
					onInteractOutside: _cache[5] || (_cache[5] = ($event) => emits("interactOutside", $event)),
					onDismiss: _cache[6] || (_cache[6] = ($event) => emits("dismiss"))
				}, {
					default: withCtx(() => [createVNode(unref(RovingFocusGroup_default), {
						ref_key: "rovingFocusGroupRef",
						ref: rovingFocusGroupRef,
						"current-tab-stop-id": currentItemId.value,
						"onUpdate:currentTabStopId": _cache[0] || (_cache[0] = ($event) => currentItemId.value = $event),
						"as-child": "",
						orientation: "vertical",
						dir: unref(rootContext).dir.value,
						loop: unref(loop),
						onEntryFocus: _cache[1] || (_cache[1] = (event) => {
							emits("entryFocus", event);
							if (!unref(rootContext).isUsingKeyboardRef.value) event.preventDefault();
						})
					}, {
						default: withCtx(() => [createVNode(unref(PopperContent_default), {
							ref: unref(forwardRef),
							role: "menu",
							as: __props.as,
							"as-child": __props.asChild,
							"aria-orientation": "vertical",
							"data-reka-menu-content": "",
							"data-state": unref(getOpenState)(unref(menuContext).open.value),
							dir: unref(rootContext).dir.value,
							side: __props.side,
							"side-offset": __props.sideOffset,
							align: __props.align,
							"align-offset": __props.alignOffset,
							"avoid-collisions": __props.avoidCollisions,
							"collision-boundary": __props.collisionBoundary,
							"collision-padding": __props.collisionPadding,
							"arrow-padding": __props.arrowPadding,
							"prioritize-position": __props.prioritizePosition,
							"position-strategy": __props.positionStrategy,
							"update-position-strategy": __props.updatePositionStrategy,
							sticky: __props.sticky,
							"hide-when-detached": __props.hideWhenDetached,
							reference: __props.reference,
							onKeydown: handleKeyDown,
							onBlur: handleBlur,
							onPointermove: handlePointerMove,
							onPointerenter: handlePointerEnter
						}, {
							default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
							_: 3
						}, 8, [
							"as",
							"as-child",
							"data-state",
							"dir",
							"side",
							"side-offset",
							"align",
							"align-offset",
							"avoid-collisions",
							"collision-boundary",
							"collision-padding",
							"arrow-padding",
							"prioritize-position",
							"position-strategy",
							"update-position-strategy",
							"sticky",
							"hide-when-detached",
							"reference"
						])]),
						_: 3
					}, 8, [
						"current-tab-stop-id",
						"dir",
						"loop"
					])]),
					_: 3
				}, 8, ["disable-outside-pointer-events"])]),
				_: 3
			}, 8, ["trapped"]);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Menu/MenuItemImpl.js
var MenuItemImpl_default = /*@__PURE__*/ defineComponent({
	inheritAttrs: false,
	__name: "MenuItemImpl",
	props: {
		disabled: {
			type: Boolean,
			required: false
		},
		textValue: {
			type: String,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		const contentContext = injectMenuContentContext();
		const { forwardRef, currentElement } = useForwardExpose();
		const { CollectionItem } = useCollection();
		const isFocused = ref(false);
		const isHighlighted = computed(() => isFocused.value || currentElement.value != null && contentContext.highlightedElement.value === currentElement.value);
		async function handlePointerMove(event) {
			if (event.defaultPrevented || !isMouseEvent(event)) return;
			if (props.disabled) contentContext.onItemLeave(event);
			else if (!contentContext.onItemEnter(event)) {
				const item = event.currentTarget;
				contentContext.highlightedElement.value = item;
				if (!["INPUT", "TEXTAREA"].includes(getActiveElement()?.tagName || "")) item.focus({ preventScroll: true });
			}
		}
		async function handlePointerLeave(event) {
			await nextTick();
			if (event.defaultPrevented) return;
			if (!isMouseEvent(event)) return;
			if (contentContext.highlightedElement.value !== currentElement.value) return;
			if (!contentContext.onItemLeave(event) && contentContext.highlightedElement.value === currentElement.value) contentContext.highlightedElement.value = void 0;
		}
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(CollectionItem), { value: { textValue: __props.textValue } }, {
				default: withCtx(() => [createVNode(unref(Primitive), mergeProps({
					ref: unref(forwardRef),
					role: "menuitem",
					tabindex: "-1"
				}, _ctx.$attrs, {
					as: __props.as,
					"as-child": __props.asChild,
					"aria-disabled": __props.disabled || void 0,
					"data-disabled": __props.disabled ? "" : void 0,
					"data-highlighted": isHighlighted.value ? "" : void 0,
					onPointermove: handlePointerMove,
					onPointerleave: handlePointerLeave,
					onFocus: _cache[0] || (_cache[0] = async (event) => {
						const item = event.currentTarget;
						await nextTick();
						if (event.defaultPrevented || __props.disabled) return;
						isFocused.value = true;
						unref(contentContext).highlightedElement.value = item;
					}),
					onBlur: _cache[1] || (_cache[1] = async (event) => {
						await nextTick();
						if (event.defaultPrevented) return;
						isFocused.value = false;
					})
				}), {
					default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
					_: 3
				}, 16, [
					"as",
					"as-child",
					"aria-disabled",
					"data-disabled",
					"data-highlighted"
				])]),
				_: 3
			}, 8, ["value"]);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Menu/MenuItem.js
var MenuItem_default = /*@__PURE__*/ defineComponent({
	__name: "MenuItem",
	props: {
		disabled: {
			type: Boolean,
			required: false
		},
		textValue: {
			type: String,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	emits: ["select"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const { forwardRef, currentElement } = useForwardExpose();
		const rootContext = injectMenuRootContext();
		const contentContext = injectMenuContentContext();
		const isPointerDownRef = ref(false);
		async function handleSelect() {
			const menuItem = currentElement.value;
			if (!props.disabled && menuItem) {
				const itemSelectEvent = new CustomEvent(ITEM_SELECT, {
					bubbles: true,
					cancelable: true
				});
				emits("select", itemSelectEvent);
				await nextTick();
				if (itemSelectEvent.defaultPrevented) isPointerDownRef.value = false;
				else rootContext.onClose();
			}
		}
		return (_ctx, _cache) => {
			return openBlock(), createBlock(MenuItemImpl_default, mergeProps(props, {
				ref: unref(forwardRef),
				onClick: handleSelect,
				onPointerdown: _cache[0] || (_cache[0] = () => {
					isPointerDownRef.value = true;
				}),
				onPointerup: _cache[1] || (_cache[1] = async (event) => {
					await nextTick();
					if (event.defaultPrevented) return;
					if (!isPointerDownRef.value) event.currentTarget?.click();
				}),
				onKeydown: _cache[2] || (_cache[2] = async (event) => {
					const isTypingAhead = unref(contentContext).searchRef.value !== "";
					if (__props.disabled || isTypingAhead && event.key === " ") return;
					if (unref(SELECTION_KEYS).includes(event.key)) {
						event.currentTarget?.click();
						/**
						* We prevent default browser behaviour for selection keys as they should trigger
						* a selection only:
						* - prevents space from scrolling the page.
						* - if keydown causes focus to move, prevents keydown from firing on the new target.
						*/
						event.preventDefault();
					}
				})
			}), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Menu/MenuItemIndicator.js
var [injectMenuItemIndicatorContext, provideMenuItemIndicatorContext] = /*@__PURE__*/ createContext(["MenuCheckboxItem", "MenuRadioItem"], "MenuItemIndicatorContext");
var MenuItemIndicator_default = /*@__PURE__*/ defineComponent({
	__name: "MenuItemIndicator",
	props: {
		forceMount: {
			type: Boolean,
			required: false
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
		const indicatorContext = injectMenuItemIndicatorContext({ modelValue: ref(false) });
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Presence_default), { present: __props.forceMount || unref(isIndeterminate)(unref(indicatorContext).modelValue.value) || unref(indicatorContext).modelValue.value === true }, {
				default: withCtx(() => [createVNode(unref(Primitive), {
					as: __props.as,
					"as-child": __props.asChild,
					"data-state": unref(getCheckedState)(unref(indicatorContext).modelValue.value)
				}, {
					default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
					_: 3
				}, 8, [
					"as",
					"as-child",
					"data-state"
				])]),
				_: 3
			}, 8, ["present"]);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Menu/MenuCheckboxItem.js
var MenuCheckboxItem_default = /*@__PURE__*/ defineComponent({
	__name: "MenuCheckboxItem",
	props: {
		modelValue: {
			type: [Boolean, String],
			required: false,
			default: false
		},
		disabled: {
			type: Boolean,
			required: false
		},
		textValue: {
			type: String,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	emits: ["select", "update:modelValue"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const delegatedProps = reactiveOmit(props, ["modelValue"]);
		const forwarded = useForwardProps(delegatedProps);
		const modelValue = useVModel(props, "modelValue", emits);
		provideMenuItemIndicatorContext({ modelValue });
		return (_ctx, _cache) => {
			return openBlock(), createBlock(MenuItem_default, mergeProps({ role: "menuitemcheckbox" }, unref(forwarded), {
				"aria-checked": unref(isIndeterminate)(unref(modelValue)) ? "mixed" : unref(modelValue),
				"data-state": unref(getCheckedState)(unref(modelValue)),
				onSelect: _cache[0] || (_cache[0] = async (event) => {
					emits("select", event);
					if (unref(isIndeterminate)(unref(modelValue))) modelValue.value = true;
					else modelValue.value = !unref(modelValue);
				})
			}), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default", {
					checked: unref(modelValue),
					modelValue: unref(modelValue)
				})]),
				_: 3
			}, 16, ["aria-checked", "data-state"]);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Menu/MenuRootContentModal.js
var MenuRootContentModal_default = /*@__PURE__*/ defineComponent({
	__name: "MenuRootContentModal",
	props: {
		loop: {
			type: Boolean,
			required: false
		},
		memoDependencies: {
			type: Array,
			required: false
		},
		side: {
			type: null,
			required: false
		},
		sideOffset: {
			type: Number,
			required: false
		},
		sideFlip: {
			type: Boolean,
			required: false
		},
		align: {
			type: null,
			required: false
		},
		alignOffset: {
			type: Number,
			required: false
		},
		alignFlip: {
			type: Boolean,
			required: false
		},
		avoidCollisions: {
			type: Boolean,
			required: false
		},
		collisionBoundary: {
			type: null,
			required: false
		},
		collisionPadding: {
			type: [Number, Object],
			required: false
		},
		arrowPadding: {
			type: Number,
			required: false
		},
		hideShiftedArrow: {
			type: Boolean,
			required: false
		},
		sticky: {
			type: String,
			required: false
		},
		hideWhenDetached: {
			type: Boolean,
			required: false
		},
		positionStrategy: {
			type: String,
			required: false
		},
		updatePositionStrategy: {
			type: String,
			required: false
		},
		disableUpdateOnLayoutShift: {
			type: Boolean,
			required: false
		},
		prioritizePosition: {
			type: Boolean,
			required: false
		},
		reference: {
			type: null,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	emits: [
		"escapeKeyDown",
		"pointerDownOutside",
		"focusOutside",
		"interactOutside",
		"entryFocus",
		"openAutoFocus",
		"closeAutoFocus"
	],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const forwarded = useForwardPropsEmits(props, emits);
		const menuContext = injectMenuContext();
		const { forwardRef, currentElement } = useForwardExpose();
		useHideOthers(currentElement);
		return (_ctx, _cache) => {
			return openBlock(), createBlock(MenuContentImpl_default, mergeProps(unref(forwarded), {
				ref: unref(forwardRef),
				"trap-focus": unref(menuContext).open.value,
				"disable-outside-pointer-events": unref(menuContext).open.value,
				"disable-outside-scroll": true,
				onDismiss: _cache[0] || (_cache[0] = ($event) => unref(menuContext).onOpenChange(false)),
				onFocusOutside: _cache[1] || (_cache[1] = withModifiers(($event) => emits("focusOutside", $event), ["prevent"]))
			}), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16, ["trap-focus", "disable-outside-pointer-events"]);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Menu/MenuRootContentNonModal.js
var MenuRootContentNonModal_default = /*@__PURE__*/ defineComponent({
	__name: "MenuRootContentNonModal",
	props: {
		loop: {
			type: Boolean,
			required: false
		},
		memoDependencies: {
			type: Array,
			required: false
		},
		side: {
			type: null,
			required: false
		},
		sideOffset: {
			type: Number,
			required: false
		},
		sideFlip: {
			type: Boolean,
			required: false
		},
		align: {
			type: null,
			required: false
		},
		alignOffset: {
			type: Number,
			required: false
		},
		alignFlip: {
			type: Boolean,
			required: false
		},
		avoidCollisions: {
			type: Boolean,
			required: false
		},
		collisionBoundary: {
			type: null,
			required: false
		},
		collisionPadding: {
			type: [Number, Object],
			required: false
		},
		arrowPadding: {
			type: Number,
			required: false
		},
		hideShiftedArrow: {
			type: Boolean,
			required: false
		},
		sticky: {
			type: String,
			required: false
		},
		hideWhenDetached: {
			type: Boolean,
			required: false
		},
		positionStrategy: {
			type: String,
			required: false
		},
		updatePositionStrategy: {
			type: String,
			required: false
		},
		disableUpdateOnLayoutShift: {
			type: Boolean,
			required: false
		},
		prioritizePosition: {
			type: Boolean,
			required: false
		},
		reference: {
			type: null,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	emits: [
		"escapeKeyDown",
		"pointerDownOutside",
		"focusOutside",
		"interactOutside",
		"entryFocus",
		"openAutoFocus",
		"closeAutoFocus"
	],
	setup(__props, { emit: __emit }) {
		const forwarded = useForwardPropsEmits(__props, __emit);
		const menuContext = injectMenuContext();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(MenuContentImpl_default, mergeProps(unref(forwarded), {
				"trap-focus": false,
				"disable-outside-pointer-events": false,
				"disable-outside-scroll": false,
				onDismiss: _cache[0] || (_cache[0] = ($event) => unref(menuContext).onOpenChange(false))
			}), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Menu/MenuContent.js
var MenuContent_default = /*@__PURE__*/ defineComponent({
	__name: "MenuContent",
	props: {
		forceMount: {
			type: Boolean,
			required: false
		},
		loop: {
			type: Boolean,
			required: false
		},
		memoDependencies: {
			type: Array,
			required: false
		},
		side: {
			type: null,
			required: false
		},
		sideOffset: {
			type: Number,
			required: false
		},
		sideFlip: {
			type: Boolean,
			required: false
		},
		align: {
			type: null,
			required: false
		},
		alignOffset: {
			type: Number,
			required: false
		},
		alignFlip: {
			type: Boolean,
			required: false
		},
		avoidCollisions: {
			type: Boolean,
			required: false
		},
		collisionBoundary: {
			type: null,
			required: false
		},
		collisionPadding: {
			type: [Number, Object],
			required: false
		},
		arrowPadding: {
			type: Number,
			required: false
		},
		hideShiftedArrow: {
			type: Boolean,
			required: false
		},
		sticky: {
			type: String,
			required: false
		},
		hideWhenDetached: {
			type: Boolean,
			required: false
		},
		positionStrategy: {
			type: String,
			required: false
		},
		updatePositionStrategy: {
			type: String,
			required: false
		},
		disableUpdateOnLayoutShift: {
			type: Boolean,
			required: false
		},
		prioritizePosition: {
			type: Boolean,
			required: false
		},
		reference: {
			type: null,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	emits: [
		"escapeKeyDown",
		"pointerDownOutside",
		"focusOutside",
		"interactOutside",
		"entryFocus",
		"openAutoFocus",
		"closeAutoFocus"
	],
	setup(__props, { emit: __emit }) {
		const forwarded = useForwardPropsEmits(__props, __emit);
		const menuContext = injectMenuContext();
		const rootContext = injectMenuRootContext();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Presence_default), { present: __props.forceMount || unref(menuContext).open.value }, {
				default: withCtx(() => [unref(rootContext).modal.value ? (openBlock(), createBlock(MenuRootContentModal_default, normalizeProps(mergeProps({ key: 0 }, {
					..._ctx.$attrs,
					...unref(forwarded)
				})), {
					default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
					_: 3
				}, 16)) : (openBlock(), createBlock(MenuRootContentNonModal_default, normalizeProps(mergeProps({ key: 1 }, {
					..._ctx.$attrs,
					...unref(forwarded)
				})), {
					default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
					_: 3
				}, 16))]),
				_: 3
			}, 8, ["present"]);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Menu/MenuGroup.js
var [injectMenuGroupContext, provideMenuGroupContext] = /*@__PURE__*/ createContext("MenuGroup");
var MenuGroup_default = /*@__PURE__*/ defineComponent({
	__name: "MenuGroup",
	props: {
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		const id = useId$1(void 0, "reka-menu-group");
		provideMenuGroupContext({ id });
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Primitive), mergeProps({ role: "group" }, props, { "aria-labelledby": unref(id) }), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16, ["aria-labelledby"]);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Menu/MenuLabel.js
var MenuLabel_default = /*@__PURE__*/ defineComponent({
	__name: "MenuLabel",
	props: {
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "div"
		}
	},
	setup(__props) {
		const props = __props;
		const groupContext = injectMenuGroupContext({ id: "" });
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Primitive), mergeProps(props, { id: unref(groupContext).id || void 0 }), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16, ["id"]);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Menu/MenuPortal.js
var MenuPortal_default = /*@__PURE__*/ defineComponent({
	__name: "MenuPortal",
	props: {
		to: {
			type: null,
			required: false
		},
		disabled: {
			type: Boolean,
			required: false
		},
		defer: {
			type: Boolean,
			required: false
		},
		forceMount: {
			type: Boolean,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Teleport_default), normalizeProps(guardReactiveProps(props)), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Menu/MenuSeparator.js
var MenuSeparator_default = /*@__PURE__*/ defineComponent({
	__name: "MenuSeparator",
	props: {
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Primitive), mergeProps(props, {
				role: "separator",
				"aria-orientation": "horizontal"
			}), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Menu/MenuSub.js
var [injectMenuSubContext, provideMenuSubContext] = /*@__PURE__*/ createContext("MenuSub");
var MenuSub_default = /*@__PURE__*/ defineComponent({
	__name: "MenuSub",
	props: { open: {
		type: Boolean,
		required: false,
		default: void 0
	} },
	emits: ["update:open"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const open = useVModel(props, "open", __emit, {
			defaultValue: false,
			passive: props.open === void 0
		});
		const parentMenuContext = injectMenuContext();
		const trigger = ref();
		const content = ref();
		watchEffect((cleanupFn) => {
			if (parentMenuContext?.open.value === false) open.value = false;
			cleanupFn(() => open.value = false);
		});
		provideMenuContext({
			open,
			onOpenChange: (value) => {
				open.value = value;
			},
			content,
			onContentChange: (element) => {
				content.value = element;
			}
		});
		provideMenuSubContext({
			triggerId: "",
			contentId: "",
			trigger,
			onTriggerChange: (element) => {
				trigger.value = element;
			}
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(PopperRoot_default), null, {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			});
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Menu/MenuSubContent.js
var MenuSubContent_default = /*@__PURE__*/ defineComponent({
	__name: "MenuSubContent",
	props: {
		forceMount: {
			type: Boolean,
			required: false
		},
		loop: {
			type: Boolean,
			required: false
		},
		memoDependencies: {
			type: Array,
			required: false
		},
		sideOffset: {
			type: Number,
			required: false
		},
		sideFlip: {
			type: Boolean,
			required: false
		},
		alignOffset: {
			type: Number,
			required: false
		},
		alignFlip: {
			type: Boolean,
			required: false
		},
		avoidCollisions: {
			type: Boolean,
			required: false
		},
		collisionBoundary: {
			type: null,
			required: false
		},
		collisionPadding: {
			type: [Number, Object],
			required: false
		},
		arrowPadding: {
			type: Number,
			required: false
		},
		hideShiftedArrow: {
			type: Boolean,
			required: false
		},
		sticky: {
			type: String,
			required: false
		},
		hideWhenDetached: {
			type: Boolean,
			required: false
		},
		positionStrategy: {
			type: String,
			required: false
		},
		updatePositionStrategy: {
			type: String,
			required: false
		},
		disableUpdateOnLayoutShift: {
			type: Boolean,
			required: false
		},
		prioritizePosition: {
			type: Boolean,
			required: false,
			default: true
		},
		reference: {
			type: null,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	emits: [
		"escapeKeyDown",
		"pointerDownOutside",
		"focusOutside",
		"interactOutside",
		"entryFocus",
		"openAutoFocus",
		"closeAutoFocus"
	],
	setup(__props, { emit: __emit }) {
		const forwarded = useForwardPropsEmits(__props, __emit);
		const menuContext = injectMenuContext();
		const rootContext = injectMenuRootContext();
		const menuSubContext = injectMenuSubContext();
		const parentContentContext = injectMenuContentContext();
		const { forwardRef, currentElement: subContentElement } = useForwardExpose();
		menuSubContext.contentId ||= useId$1(void 0, "reka-menu-sub-content");
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Presence_default), { present: __props.forceMount || unref(menuContext).open.value }, {
				default: withCtx(() => [createVNode(MenuContentImpl_default, mergeProps(unref(forwarded), {
					id: unref(menuSubContext).contentId,
					ref: unref(forwardRef),
					"aria-labelledby": unref(menuSubContext).triggerId,
					align: "start",
					side: unref(rootContext).dir.value === "rtl" ? "left" : "right",
					"disable-outside-pointer-events": false,
					"disable-outside-scroll": false,
					"trap-focus": false,
					onOpenAutoFocus: _cache[0] || (_cache[0] = withModifiers((event) => {
						if (unref(rootContext).isUsingKeyboardRef.value) unref(subContentElement)?.focus();
					}, ["prevent"])),
					onCloseAutoFocus: _cache[1] || (_cache[1] = withModifiers(() => {}, ["prevent"])),
					onFocusOutside: _cache[2] || (_cache[2] = (event) => {
						if (event.defaultPrevented) return;
						const isMovingToParentContent = unref(parentContentContext).filterElement.value?.contains(event.target);
						if (event.target !== unref(menuSubContext).trigger.value && !isMovingToParentContent) unref(menuContext).onOpenChange(false);
					}),
					onEscapeKeyDown: _cache[3] || (_cache[3] = (event) => {
						unref(rootContext).onClose();
						event.preventDefault();
					}),
					onKeydown: _cache[4] || (_cache[4] = (event) => {
						const isKeyDownInside = event.currentTarget?.contains(event.target);
						const isCloseKey = unref(SUB_CLOSE_KEYS)[unref(rootContext).dir.value].includes(event.key);
						if (isKeyDownInside && isCloseKey) {
							unref(menuContext).onOpenChange(false);
							if (unref(parentContentContext).filterElement.value) {
								unref(parentContentContext).filterElement.value.focus();
								unref(parentContentContext).highlightedElement.value = unref(menuSubContext).trigger.value;
								unref(menuSubContext).trigger.value?.scrollIntoView({ block: "nearest" });
							} else unref(menuSubContext).trigger.value?.focus();
							event.preventDefault();
						}
					})
				}), {
					default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
					_: 3
				}, 16, [
					"id",
					"aria-labelledby",
					"side"
				])]),
				_: 3
			}, 8, ["present"]);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Menu/MenuSubTrigger.js
var MenuSubTrigger_default = /*@__PURE__*/ defineComponent({
	__name: "MenuSubTrigger",
	props: {
		graceDuration: {
			type: Number,
			required: false,
			default: 300
		},
		disabled: {
			type: Boolean,
			required: false
		},
		textValue: {
			type: String,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		const itemProps = reactiveOmit(props, "graceDuration");
		const menuContext = injectMenuContext();
		const rootContext = injectMenuRootContext();
		const subContext = injectMenuSubContext();
		const contentContext = injectMenuContentContext();
		watch(menuContext.open, (open) => {
			if (open) contentContext.activeSubmenuContext.value = {
				onOpenChange: menuContext.onOpenChange,
				trigger: subContext.trigger
			};
			else if (contentContext.activeSubmenuContext.value?.trigger.value === subContext.trigger.value) contentContext.activeSubmenuContext.value = void 0;
		});
		const openTimerRef = ref(null);
		subContext.triggerId ||= useId$1(void 0, "reka-menu-sub-trigger");
		function clearOpenTimer() {
			if (openTimerRef.value) window.clearTimeout(openTimerRef.value);
			openTimerRef.value = null;
		}
		onUnmounted(() => {
			clearOpenTimer();
		});
		function handlePointerMove(event) {
			if (!isMouseEvent(event)) return;
			if (contentContext.onItemEnter(event)) return;
			if (!props.disabled && !menuContext.open.value && !openTimerRef.value) {
				contentContext.onPointerGraceIntentChange(null);
				openTimerRef.value = window.setTimeout(() => {
					menuContext.onOpenChange(true);
					clearOpenTimer();
				}, 100);
			}
		}
		async function handlePointerLeave(event) {
			if (!isMouseEvent(event)) return;
			clearOpenTimer();
			const contentRect = menuContext.content.value?.getBoundingClientRect();
			if (contentRect?.width) {
				const side = menuContext.content.value?.dataset.side;
				const rightSide = side === "right";
				const bleed = rightSide ? -5 : 5;
				const contentNearEdge = contentRect[rightSide ? "left" : "right"];
				const contentFarEdge = contentRect[rightSide ? "right" : "left"];
				contentContext.onPointerGraceIntentChange({
					area: [
						{
							x: event.clientX + bleed,
							y: event.clientY
						},
						{
							x: contentNearEdge,
							y: contentRect.top
						},
						{
							x: contentFarEdge,
							y: contentRect.top
						},
						{
							x: contentFarEdge,
							y: contentRect.bottom
						},
						{
							x: contentNearEdge,
							y: contentRect.bottom
						}
					],
					side
				});
				window.clearTimeout(contentContext.pointerGraceTimerRef.value);
				contentContext.pointerGraceTimerRef.value = window.setTimeout(() => contentContext.onPointerGraceIntentChange(null), props.graceDuration);
			} else {
				if (contentContext.onTriggerLeave(event)) return;
				contentContext.onPointerGraceIntentChange(null);
			}
		}
		async function handleKeyDown(event) {
			const isTypingAhead = contentContext.searchRef.value !== "";
			if (props.disabled || isTypingAhead && event.key === " ") return;
			if (SUB_OPEN_KEYS[rootContext.dir.value].includes(event.key)) {
				menuContext.onOpenChange(true);
				await nextTick();
				menuContext.content.value?.focus();
				event.preventDefault();
			}
		}
		return (_ctx, _cache) => {
			return openBlock(), createBlock(MenuAnchor_default, { "as-child": "" }, {
				default: withCtx(() => [createVNode(MenuItemImpl_default, mergeProps(unref(itemProps), {
					id: unref(subContext).triggerId,
					ref: (vnode) => {
						if (!vnode) return void 0;
						unref(subContext)?.onTriggerChange(vnode?.$el);
					},
					"aria-haspopup": "menu",
					"aria-expanded": unref(menuContext).open.value,
					"aria-controls": unref(subContext).contentId,
					"data-state": unref(getOpenState)(unref(menuContext).open.value),
					onClick: _cache[0] || (_cache[0] = async (event) => {
						if (props.disabled || event.defaultPrevented) return;
						/**
						* We manually focus because iOS Safari doesn't always focus on click (e.g. buttons)
						* and we rely heavily on `onFocusOutside` for submenus to close when switching
						* between separate submenus.
						*/
						event.currentTarget?.focus();
						if (!unref(menuContext).open.value) unref(menuContext).onOpenChange(true);
					}),
					onPointermove: handlePointerMove,
					onPointerleave: handlePointerLeave,
					onKeydown: handleKeyDown
				}), {
					default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
					_: 3
				}, 16, [
					"id",
					"aria-expanded",
					"aria-controls",
					"data-state"
				])]),
				_: 3
			});
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Popover/PopoverRoot.js
var [injectPopoverRootContext, providePopoverRootContext] = /*@__PURE__*/ createContext("PopoverRoot");
var PopoverRoot_default = /*@__PURE__*/ defineComponent({
	__name: "PopoverRoot",
	props: {
		defaultOpen: {
			type: Boolean,
			required: false,
			default: false
		},
		open: {
			type: Boolean,
			required: false,
			default: void 0
		},
		modal: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	emits: ["update:open"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const { modal } = toRefs(props);
		const open = useVModel(props, "open", emit, {
			defaultValue: props.defaultOpen,
			passive: props.open === void 0
		});
		providePopoverRootContext({
			contentId: "",
			triggerId: "",
			modal,
			open,
			onOpenChange: (value) => {
				open.value = value;
			},
			onOpenToggle: () => {
				open.value = !open.value;
			},
			triggerElement: ref(),
			hasCustomAnchor: ref(false)
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(PopperRoot_default), null, {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default", {
					open: unref(open),
					close: () => open.value = false
				})]),
				_: 3
			});
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Popover/PopoverAnchor.js
var PopoverAnchor_default = /*@__PURE__*/ defineComponent({
	__name: "PopoverAnchor",
	props: {
		reference: {
			type: null,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		useForwardExpose();
		const rootContext = injectPopoverRootContext();
		onBeforeMount(() => {
			rootContext.hasCustomAnchor.value = true;
		});
		onUnmounted(() => {
			rootContext.hasCustomAnchor.value = false;
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(PopperAnchor_default), normalizeProps(guardReactiveProps(props)), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Popover/PopoverArrow.js
var PopoverArrow_default = /*@__PURE__*/ defineComponent({
	__name: "PopoverArrow",
	props: {
		width: {
			type: Number,
			required: false,
			default: 10
		},
		height: {
			type: Number,
			required: false,
			default: 5
		},
		rounded: {
			type: Boolean,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "svg"
		}
	},
	setup(__props) {
		const props = __props;
		useForwardExpose();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(PopperArrow_default), normalizeProps(guardReactiveProps(props)), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Popover/PopoverContentImpl.js
var PopoverContentImpl_default = /*@__PURE__*/ defineComponent({
	__name: "PopoverContentImpl",
	props: {
		trapFocus: {
			type: Boolean,
			required: false
		},
		memoDependencies: {
			type: Array,
			required: false
		},
		side: {
			type: null,
			required: false
		},
		sideOffset: {
			type: Number,
			required: false
		},
		sideFlip: {
			type: Boolean,
			required: false
		},
		align: {
			type: null,
			required: false
		},
		alignOffset: {
			type: Number,
			required: false
		},
		alignFlip: {
			type: Boolean,
			required: false
		},
		avoidCollisions: {
			type: Boolean,
			required: false
		},
		collisionBoundary: {
			type: null,
			required: false
		},
		collisionPadding: {
			type: [Number, Object],
			required: false
		},
		arrowPadding: {
			type: Number,
			required: false
		},
		hideShiftedArrow: {
			type: Boolean,
			required: false
		},
		sticky: {
			type: String,
			required: false
		},
		hideWhenDetached: {
			type: Boolean,
			required: false
		},
		positionStrategy: {
			type: String,
			required: false
		},
		updatePositionStrategy: {
			type: String,
			required: false
		},
		disableUpdateOnLayoutShift: {
			type: Boolean,
			required: false
		},
		prioritizePosition: {
			type: Boolean,
			required: false
		},
		reference: {
			type: null,
			required: false
		},
		dir: {
			type: String,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		},
		disableOutsidePointerEvents: {
			type: Boolean,
			required: false
		}
	},
	emits: [
		"escapeKeyDown",
		"pointerDownOutside",
		"focusOutside",
		"interactOutside",
		"openAutoFocus",
		"closeAutoFocus"
	],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const forwarded = useForwardProps(reactiveOmit(props, "trapFocus", "disableOutsidePointerEvents"));
		const { forwardRef } = useForwardExpose();
		const rootContext = injectPopoverRootContext();
		useFocusGuards();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(FocusScope_default), {
				"as-child": "",
				loop: "",
				trapped: __props.trapFocus,
				onMountAutoFocus: _cache[5] || (_cache[5] = ($event) => emits("openAutoFocus", $event)),
				onUnmountAutoFocus: _cache[6] || (_cache[6] = ($event) => emits("closeAutoFocus", $event))
			}, {
				default: withCtx(() => [createVNode(unref(DismissableLayer_default), {
					"as-child": "",
					"disable-outside-pointer-events": __props.disableOutsidePointerEvents,
					onPointerDownOutside: _cache[0] || (_cache[0] = ($event) => emits("pointerDownOutside", $event)),
					onInteractOutside: _cache[1] || (_cache[1] = ($event) => emits("interactOutside", $event)),
					onEscapeKeyDown: _cache[2] || (_cache[2] = ($event) => emits("escapeKeyDown", $event)),
					onFocusOutside: _cache[3] || (_cache[3] = ($event) => emits("focusOutside", $event)),
					onDismiss: _cache[4] || (_cache[4] = ($event) => unref(rootContext).onOpenChange(false))
				}, {
					default: withCtx(() => [createVNode(unref(PopperContent_default), mergeProps(unref(forwarded), {
						id: unref(rootContext).contentId,
						ref: unref(forwardRef),
						"data-state": unref(rootContext).open.value ? "open" : "closed",
						"aria-labelledby": unref(rootContext).triggerId,
						style: {
							"--reka-popover-content-transform-origin": "var(--reka-popper-transform-origin)",
							"--reka-popover-content-available-width": "var(--reka-popper-available-width)",
							"--reka-popover-content-available-height": "var(--reka-popper-available-height)",
							"--reka-popover-trigger-width": "var(--reka-popper-anchor-width)",
							"--reka-popover-trigger-height": "var(--reka-popper-anchor-height)"
						},
						role: "dialog"
					}), {
						default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
						_: 3
					}, 16, [
						"id",
						"data-state",
						"aria-labelledby"
					])]),
					_: 3
				}, 8, ["disable-outside-pointer-events"])]),
				_: 3
			}, 8, ["trapped"]);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Popover/PopoverContentModal.js
var PopoverContentModal_default = /*@__PURE__*/ defineComponent({
	__name: "PopoverContentModal",
	props: {
		memoDependencies: {
			type: Array,
			required: false
		},
		side: {
			type: null,
			required: false
		},
		sideOffset: {
			type: Number,
			required: false
		},
		sideFlip: {
			type: Boolean,
			required: false
		},
		align: {
			type: null,
			required: false
		},
		alignOffset: {
			type: Number,
			required: false
		},
		alignFlip: {
			type: Boolean,
			required: false
		},
		avoidCollisions: {
			type: Boolean,
			required: false
		},
		collisionBoundary: {
			type: null,
			required: false
		},
		collisionPadding: {
			type: [Number, Object],
			required: false
		},
		arrowPadding: {
			type: Number,
			required: false
		},
		hideShiftedArrow: {
			type: Boolean,
			required: false
		},
		sticky: {
			type: String,
			required: false
		},
		hideWhenDetached: {
			type: Boolean,
			required: false
		},
		positionStrategy: {
			type: String,
			required: false
		},
		updatePositionStrategy: {
			type: String,
			required: false
		},
		disableUpdateOnLayoutShift: {
			type: Boolean,
			required: false
		},
		prioritizePosition: {
			type: Boolean,
			required: false
		},
		reference: {
			type: null,
			required: false
		},
		dir: {
			type: String,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		},
		disableOutsidePointerEvents: {
			type: Boolean,
			required: false
		}
	},
	emits: [
		"escapeKeyDown",
		"pointerDownOutside",
		"focusOutside",
		"interactOutside",
		"openAutoFocus",
		"closeAutoFocus"
	],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const rootContext = injectPopoverRootContext();
		const isRightClickOutsideRef = ref(false);
		useBodyScrollLock(true);
		const forwarded = useForwardPropsEmits(props, emits);
		const { forwardRef, currentElement } = useForwardExpose();
		useHideOthers(currentElement);
		return (_ctx, _cache) => {
			return openBlock(), createBlock(PopoverContentImpl_default, mergeProps(unref(forwarded), {
				ref: unref(forwardRef),
				"trap-focus": unref(rootContext).open.value,
				"disable-outside-pointer-events": "",
				onCloseAutoFocus: _cache[0] || (_cache[0] = withModifiers((event) => {
					emits("closeAutoFocus", event);
					if (!isRightClickOutsideRef.value) unref(rootContext).triggerElement.value?.focus();
				}, ["prevent"])),
				onPointerDownOutside: _cache[1] || (_cache[1] = (event) => {
					emits("pointerDownOutside", event);
					const originalEvent = event.detail.originalEvent;
					const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
					const isRightClick = originalEvent.button === 2 || ctrlLeftClick;
					isRightClickOutsideRef.value = isRightClick;
				}),
				onFocusOutside: _cache[2] || (_cache[2] = withModifiers(() => {}, ["prevent"]))
			}), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16, ["trap-focus"]);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Popover/PopoverContentNonModal.js
var PopoverContentNonModal_default = /*@__PURE__*/ defineComponent({
	__name: "PopoverContentNonModal",
	props: {
		memoDependencies: {
			type: Array,
			required: false
		},
		side: {
			type: null,
			required: false
		},
		sideOffset: {
			type: Number,
			required: false
		},
		sideFlip: {
			type: Boolean,
			required: false
		},
		align: {
			type: null,
			required: false
		},
		alignOffset: {
			type: Number,
			required: false
		},
		alignFlip: {
			type: Boolean,
			required: false
		},
		avoidCollisions: {
			type: Boolean,
			required: false
		},
		collisionBoundary: {
			type: null,
			required: false
		},
		collisionPadding: {
			type: [Number, Object],
			required: false
		},
		arrowPadding: {
			type: Number,
			required: false
		},
		hideShiftedArrow: {
			type: Boolean,
			required: false
		},
		sticky: {
			type: String,
			required: false
		},
		hideWhenDetached: {
			type: Boolean,
			required: false
		},
		positionStrategy: {
			type: String,
			required: false
		},
		updatePositionStrategy: {
			type: String,
			required: false
		},
		disableUpdateOnLayoutShift: {
			type: Boolean,
			required: false
		},
		prioritizePosition: {
			type: Boolean,
			required: false
		},
		reference: {
			type: null,
			required: false
		},
		dir: {
			type: String,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		},
		disableOutsidePointerEvents: {
			type: Boolean,
			required: false
		}
	},
	emits: [
		"escapeKeyDown",
		"pointerDownOutside",
		"focusOutside",
		"interactOutside",
		"openAutoFocus",
		"closeAutoFocus"
	],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const rootContext = injectPopoverRootContext();
		const hasInteractedOutsideRef = ref(false);
		const hasPointerDownOutsideRef = ref(false);
		const forwarded = useForwardPropsEmits(props, emits);
		return (_ctx, _cache) => {
			return openBlock(), createBlock(PopoverContentImpl_default, mergeProps(unref(forwarded), {
				"trap-focus": false,
				"disable-outside-pointer-events": false,
				onCloseAutoFocus: _cache[0] || (_cache[0] = (event) => {
					emits("closeAutoFocus", event);
					if (!event.defaultPrevented) {
						if (!hasInteractedOutsideRef.value) unref(rootContext).triggerElement.value?.focus();
						event.preventDefault();
					}
					hasInteractedOutsideRef.value = false;
					hasPointerDownOutsideRef.value = false;
				}),
				onInteractOutside: _cache[1] || (_cache[1] = async (event) => {
					emits("interactOutside", event);
					if (!event.defaultPrevented) {
						hasInteractedOutsideRef.value = true;
						if (event.detail.originalEvent.type === "pointerdown") hasPointerDownOutsideRef.value = true;
					}
					const target = event.target;
					if (unref(rootContext).triggerElement.value?.contains(target)) event.preventDefault();
					if (event.detail.originalEvent.type === "focusin" && hasPointerDownOutsideRef.value) event.preventDefault();
				})
			}), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Popover/PopoverContent.js
var PopoverContent_default = /*@__PURE__*/ defineComponent({
	__name: "PopoverContent",
	props: {
		forceMount: {
			type: Boolean,
			required: false
		},
		memoDependencies: {
			type: Array,
			required: false
		},
		side: {
			type: null,
			required: false
		},
		sideOffset: {
			type: Number,
			required: false
		},
		sideFlip: {
			type: Boolean,
			required: false
		},
		align: {
			type: null,
			required: false
		},
		alignOffset: {
			type: Number,
			required: false
		},
		alignFlip: {
			type: Boolean,
			required: false
		},
		avoidCollisions: {
			type: Boolean,
			required: false
		},
		collisionBoundary: {
			type: null,
			required: false
		},
		collisionPadding: {
			type: [Number, Object],
			required: false
		},
		arrowPadding: {
			type: Number,
			required: false
		},
		hideShiftedArrow: {
			type: Boolean,
			required: false
		},
		sticky: {
			type: String,
			required: false
		},
		hideWhenDetached: {
			type: Boolean,
			required: false
		},
		positionStrategy: {
			type: String,
			required: false
		},
		updatePositionStrategy: {
			type: String,
			required: false
		},
		disableUpdateOnLayoutShift: {
			type: Boolean,
			required: false
		},
		prioritizePosition: {
			type: Boolean,
			required: false
		},
		reference: {
			type: null,
			required: false
		},
		dir: {
			type: String,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		},
		disableOutsidePointerEvents: {
			type: Boolean,
			required: false
		}
	},
	emits: [
		"escapeKeyDown",
		"pointerDownOutside",
		"focusOutside",
		"interactOutside",
		"openAutoFocus",
		"closeAutoFocus"
	],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const rootContext = injectPopoverRootContext();
		const forwarded = useForwardPropsEmits(props, emits);
		const { forwardRef } = useForwardExpose();
		rootContext.contentId ||= useId$1(void 0, "reka-popover-content");
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Presence_default), { present: __props.forceMount || unref(rootContext).open.value }, {
				default: withCtx(() => [unref(rootContext).modal.value ? (openBlock(), createBlock(PopoverContentModal_default, mergeProps({ key: 0 }, unref(forwarded), { ref: unref(forwardRef) }), {
					default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
					_: 3
				}, 16)) : (openBlock(), createBlock(PopoverContentNonModal_default, mergeProps({ key: 1 }, unref(forwarded), { ref: unref(forwardRef) }), {
					default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
					_: 3
				}, 16))]),
				_: 3
			}, 8, ["present"]);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Popover/PopoverPortal.js
var PopoverPortal_default = /*@__PURE__*/ defineComponent({
	__name: "PopoverPortal",
	props: {
		to: {
			type: null,
			required: false
		},
		disabled: {
			type: Boolean,
			required: false
		},
		defer: {
			type: Boolean,
			required: false
		},
		forceMount: {
			type: Boolean,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Teleport_default), normalizeProps(guardReactiveProps(props)), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Popover/PopoverTrigger.js
var PopoverTrigger_default = /*@__PURE__*/ defineComponent({
	__name: "PopoverTrigger",
	props: {
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "button"
		}
	},
	setup(__props) {
		const props = __props;
		const rootContext = injectPopoverRootContext();
		const { forwardRef, currentElement: triggerElement } = useForwardExpose();
		rootContext.triggerId ||= useId$1(void 0, "reka-popover-trigger");
		rootContext.contentId ||= useId$1(void 0, "reka-popover-content");
		onMounted(() => {
			rootContext.triggerElement.value = triggerElement.value;
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(resolveDynamicComponent(unref(rootContext).hasCustomAnchor.value ? unref(Primitive) : unref(PopperAnchor_default)), { "as-child": "" }, {
				default: withCtx(() => [createVNode(unref(Primitive), {
					id: unref(rootContext).triggerId,
					ref: unref(forwardRef),
					type: __props.as === "button" ? "button" : void 0,
					"aria-haspopup": "dialog",
					"aria-expanded": unref(rootContext).open.value,
					"aria-controls": unref(rootContext).open.value ? unref(rootContext).contentId : void 0,
					"data-state": unref(rootContext).open.value ? "open" : "closed",
					as: __props.as,
					"as-child": props.asChild,
					onClick: unref(rootContext).onOpenToggle
				}, {
					default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
					_: 3
				}, 8, [
					"id",
					"type",
					"aria-expanded",
					"aria-controls",
					"data-state",
					"as",
					"as-child",
					"onClick"
				])]),
				_: 3
			});
		};
	}
});
// ../../../../node_modules/reka-ui/dist/DropdownMenu/DropdownMenuArrow.js
var DropdownMenuArrow_default = /*@__PURE__*/ defineComponent({
	__name: "DropdownMenuArrow",
	props: {
		width: {
			type: Number,
			required: false,
			default: 10
		},
		height: {
			type: Number,
			required: false,
			default: 5
		},
		rounded: {
			type: Boolean,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "svg"
		}
	},
	setup(__props) {
		const props = __props;
		useForwardExpose();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(MenuArrow_default), normalizeProps(guardReactiveProps(props)), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/DropdownMenu/DropdownMenuCheckboxItem.js
var DropdownMenuCheckboxItem_default = /*@__PURE__*/ defineComponent({
	__name: "DropdownMenuCheckboxItem",
	props: {
		modelValue: {
			type: [Boolean, String],
			required: false
		},
		disabled: {
			type: Boolean,
			required: false
		},
		textValue: {
			type: String,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	emits: ["select", "update:modelValue"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emitsAsProps = useEmitAsProps(__emit);
		useForwardExpose();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(MenuCheckboxItem_default), normalizeProps(guardReactiveProps({
				...props,
				...unref(emitsAsProps)
			})), {
				default: withCtx((slotProps) => [renderSlot(_ctx.$slots, "default", normalizeProps(guardReactiveProps(slotProps)))]),
				_: 3
			}, 16);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/DropdownMenu/DropdownMenuRoot.js
var [injectDropdownMenuRootContext, provideDropdownMenuRootContext] = /*@__PURE__*/ createContext("DropdownMenuRoot");
var DropdownMenuRoot_default = /*@__PURE__*/ defineComponent({
	__name: "DropdownMenuRoot",
	props: {
		defaultOpen: {
			type: Boolean,
			required: false
		},
		open: {
			type: Boolean,
			required: false,
			default: void 0
		},
		dir: {
			type: String,
			required: false
		},
		modal: {
			type: Boolean,
			required: false,
			default: true
		}
	},
	emits: ["update:open"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		useForwardExpose();
		const open = useVModel(props, "open", emit, {
			defaultValue: props.defaultOpen,
			passive: props.open === void 0
		});
		const triggerElement = ref();
		const { modal, dir: propDir } = toRefs(props);
		const dir = useDirection(propDir);
		provideDropdownMenuRootContext({
			open,
			onOpenChange: (value) => {
				open.value = value;
			},
			onOpenToggle: () => {
				open.value = !open.value;
			},
			triggerId: "",
			triggerElement,
			contentId: "",
			modal,
			dir
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(MenuRoot_default), {
				open: unref(open),
				"onUpdate:open": _cache[0] || (_cache[0] = ($event) => isRef(open) ? open.value = $event : null),
				dir: unref(dir),
				modal: unref(modal)
			}, {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default", { open: unref(open) })]),
				_: 3
			}, 8, [
				"open",
				"dir",
				"modal"
			]);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/DropdownMenu/DropdownMenuContent.js
var DropdownMenuContent_default$1 = /*@__PURE__*/ defineComponent({
	inheritAttrs: false,
	__name: "DropdownMenuContent",
	props: {
		forceMount: {
			type: Boolean,
			required: false
		},
		loop: {
			type: Boolean,
			required: false
		},
		memoDependencies: {
			type: Array,
			required: false
		},
		side: {
			type: null,
			required: false
		},
		sideOffset: {
			type: Number,
			required: false
		},
		sideFlip: {
			type: Boolean,
			required: false
		},
		align: {
			type: null,
			required: false
		},
		alignOffset: {
			type: Number,
			required: false
		},
		alignFlip: {
			type: Boolean,
			required: false
		},
		avoidCollisions: {
			type: Boolean,
			required: false
		},
		collisionBoundary: {
			type: null,
			required: false
		},
		collisionPadding: {
			type: [Number, Object],
			required: false
		},
		arrowPadding: {
			type: Number,
			required: false
		},
		hideShiftedArrow: {
			type: Boolean,
			required: false
		},
		sticky: {
			type: String,
			required: false
		},
		hideWhenDetached: {
			type: Boolean,
			required: false
		},
		positionStrategy: {
			type: String,
			required: false
		},
		updatePositionStrategy: {
			type: String,
			required: false
		},
		disableUpdateOnLayoutShift: {
			type: Boolean,
			required: false
		},
		prioritizePosition: {
			type: Boolean,
			required: false
		},
		reference: {
			type: null,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	emits: [
		"escapeKeyDown",
		"pointerDownOutside",
		"focusOutside",
		"interactOutside",
		"openAutoFocus",
		"closeAutoFocus"
	],
	setup(__props, { emit: __emit }) {
		const forwarded = useForwardPropsEmits(__props, __emit);
		useForwardExpose();
		const rootContext = injectDropdownMenuRootContext();
		const hasInteractedOutsideRef = ref(false);
		function handleCloseAutoFocus(event) {
			if (event.defaultPrevented) return;
			if (!hasInteractedOutsideRef.value) setTimeout(() => {
				rootContext.triggerElement.value?.focus();
			}, 0);
			hasInteractedOutsideRef.value = false;
			event.preventDefault();
		}
		rootContext.contentId ||= useId$1(void 0, "reka-dropdown-menu-content");
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(MenuContent_default), mergeProps({
				id: unref(rootContext).contentId,
				"aria-labelledby": unref(rootContext)?.triggerId,
				style: {
					"--reka-dropdown-menu-content-transform-origin": "var(--reka-popper-transform-origin)",
					"--reka-dropdown-menu-content-available-width": "var(--reka-popper-available-width)",
					"--reka-dropdown-menu-content-available-height": "var(--reka-popper-available-height)",
					"--reka-dropdown-menu-trigger-width": "var(--reka-popper-anchor-width)",
					"--reka-dropdown-menu-trigger-height": "var(--reka-popper-anchor-height)"
				}
			}, {
				...unref(forwarded),
				...unref(omitEntryFocusListener)(_ctx.$attrs)
			}, {
				onCloseAutoFocus: handleCloseAutoFocus,
				onInteractOutside: _cache[0] || (_cache[0] = (event) => {
					if (event.defaultPrevented) return;
					const originalEvent = event.detail.originalEvent;
					const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
					const isRightClick = originalEvent.button === 2 || ctrlLeftClick;
					if (!unref(rootContext).modal.value || isRightClick) hasInteractedOutsideRef.value = true;
					if (unref(rootContext).triggerElement.value?.contains(event.target)) event.preventDefault();
				})
			}), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16, ["id", "aria-labelledby"]);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/DropdownMenu/DropdownMenuFilter.js
var DropdownMenuFilter_default = /*@__PURE__*/ defineComponent({
	__name: "DropdownMenuFilter",
	props: {
		modelValue: {
			type: String,
			required: false
		},
		autoFocus: {
			type: Boolean,
			required: false
		},
		disabled: {
			type: Boolean,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "input"
		}
	},
	emits: ["update:modelValue"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const modelValue = useVModel(props, "modelValue", __emit, {
			defaultValue: "",
			passive: props.modelValue === void 0
		});
		const rootContext = injectMenuRootContext();
		const contentContext = injectMenuContentContext();
		const subContext = injectMenuSubContext(null);
		watch(modelValue, (v) => {
			contentContext.searchRef.value = v ?? "";
		}, { immediate: true });
		const { primitiveElement, currentElement } = usePrimitiveElement();
		const disabled = computed(() => props.disabled || false);
		const activedescendant = ref();
		watchSyncEffect(() => activedescendant.value = contentContext.highlightedElement.value?.id);
		onMounted(() => {
			contentContext.onFilterElementChange(currentElement.value);
			setTimeout(() => {
				if (props.autoFocus) {
					if (!!!subContext || rootContext.isUsingKeyboardRef.value) currentElement.value?.focus();
				}
			}, 1);
		});
		onUnmounted(() => {
			contentContext.onFilterElementChange(void 0);
			contentContext.searchRef.value = "";
		});
		const { isComposing, shouldDeferInput, handleCompositionStart, handleCompositionUpdate, handleCompositionEnd } = useComposing((event) => {
			const el = event.target;
			if (el) {
				modelValue.value = el.value;
				contentContext.searchRef.value = el.value;
			}
		});
		function handleInput(event) {
			if (disabled.value) return;
			if (shouldDeferInput.value) return;
			const target = event.target;
			modelValue.value = target.value;
			contentContext.searchRef.value = target.value;
		}
		function handleKeyDown(event) {
			if (disabled.value) return;
			if (isComposing.value) {
				event.stopPropagation();
				return;
			}
			if ([
				"ArrowDown",
				"ArrowUp",
				"Home",
				"End"
			].includes(event.key)) {
				event.preventDefault();
				contentContext.onKeydownNavigation(event);
			} else if (event.key === "Enter") {
				event.preventDefault();
				contentContext.onKeydownEnter(event);
			} else if (event.key === "Escape" && modelValue.value) {
				event.stopPropagation();
				modelValue.value = "";
				contentContext.searchRef.value = "";
			}
		}
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Primitive), {
				ref_key: "primitiveElement",
				ref: primitiveElement,
				as: __props.as,
				"as-child": __props.asChild,
				value: unref(modelValue),
				disabled: disabled.value ? "" : void 0,
				"data-disabled": disabled.value ? "" : void 0,
				"aria-disabled": disabled.value ? true : void 0,
				"aria-activedescendant": activedescendant.value,
				type: "text",
				role: "searchbox",
				onInput: handleInput,
				onKeydown: handleKeyDown,
				onCompositionstart: unref(handleCompositionStart),
				onCompositionupdate: unref(handleCompositionUpdate),
				onCompositionend: unref(handleCompositionEnd)
			}, {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default", { modelValue: unref(modelValue) })]),
				_: 3
			}, 8, [
				"as",
				"as-child",
				"value",
				"disabled",
				"data-disabled",
				"aria-disabled",
				"aria-activedescendant",
				"onCompositionstart",
				"onCompositionupdate",
				"onCompositionend"
			]);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/DropdownMenu/DropdownMenuGroup.js
var DropdownMenuGroup_default = /*@__PURE__*/ defineComponent({
	__name: "DropdownMenuGroup",
	props: {
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		useForwardExpose();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(MenuGroup_default), normalizeProps(guardReactiveProps(props)), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/DropdownMenu/DropdownMenuItem.js
var DropdownMenuItem_default = /*@__PURE__*/ defineComponent({
	__name: "DropdownMenuItem",
	props: {
		disabled: {
			type: Boolean,
			required: false
		},
		textValue: {
			type: String,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	emits: ["select"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emitsAsProps = useEmitAsProps(__emit);
		useForwardExpose();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(MenuItem_default), normalizeProps(guardReactiveProps({
				...props,
				...unref(emitsAsProps)
			})), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/DropdownMenu/DropdownMenuItemIndicator.js
var DropdownMenuItemIndicator_default = /*@__PURE__*/ defineComponent({
	__name: "DropdownMenuItemIndicator",
	props: {
		forceMount: {
			type: Boolean,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		useForwardExpose();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(MenuItemIndicator_default), normalizeProps(guardReactiveProps(props)), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/DropdownMenu/DropdownMenuLabel.js
var DropdownMenuLabel_default = /*@__PURE__*/ defineComponent({
	__name: "DropdownMenuLabel",
	props: {
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		useForwardExpose();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(MenuLabel_default), normalizeProps(guardReactiveProps(props)), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/DropdownMenu/DropdownMenuPortal.js
var DropdownMenuPortal_default = /*@__PURE__*/ defineComponent({
	__name: "DropdownMenuPortal",
	props: {
		to: {
			type: null,
			required: false
		},
		disabled: {
			type: Boolean,
			required: false
		},
		defer: {
			type: Boolean,
			required: false
		},
		forceMount: {
			type: Boolean,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(MenuPortal_default), normalizeProps(guardReactiveProps(props)), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/DropdownMenu/DropdownMenuSeparator.js
var DropdownMenuSeparator_default = /*@__PURE__*/ defineComponent({
	__name: "DropdownMenuSeparator",
	props: {
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		useForwardExpose();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(MenuSeparator_default), normalizeProps(guardReactiveProps(props)), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/DropdownMenu/DropdownMenuSub.js
var DropdownMenuSub_default = /*@__PURE__*/ defineComponent({
	__name: "DropdownMenuSub",
	props: {
		defaultOpen: {
			type: Boolean,
			required: false
		},
		open: {
			type: Boolean,
			required: false,
			default: void 0
		}
	},
	emits: ["update:open"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const open = useVModel(props, "open", __emit, {
			passive: props.open === void 0,
			defaultValue: props.defaultOpen ?? false
		});
		useForwardExpose();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(MenuSub_default), {
				open: unref(open),
				"onUpdate:open": _cache[0] || (_cache[0] = ($event) => isRef(open) ? open.value = $event : null)
			}, {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default", { open: unref(open) })]),
				_: 3
			}, 8, ["open"]);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/DropdownMenu/DropdownMenuSubContent.js
var DropdownMenuSubContent_default = /*@__PURE__*/ defineComponent({
	__name: "DropdownMenuSubContent",
	props: {
		forceMount: {
			type: Boolean,
			required: false
		},
		loop: {
			type: Boolean,
			required: false
		},
		memoDependencies: {
			type: Array,
			required: false
		},
		sideOffset: {
			type: Number,
			required: false
		},
		sideFlip: {
			type: Boolean,
			required: false
		},
		alignOffset: {
			type: Number,
			required: false
		},
		alignFlip: {
			type: Boolean,
			required: false
		},
		avoidCollisions: {
			type: Boolean,
			required: false
		},
		collisionBoundary: {
			type: null,
			required: false
		},
		collisionPadding: {
			type: [Number, Object],
			required: false
		},
		arrowPadding: {
			type: Number,
			required: false
		},
		hideShiftedArrow: {
			type: Boolean,
			required: false
		},
		sticky: {
			type: String,
			required: false
		},
		hideWhenDetached: {
			type: Boolean,
			required: false
		},
		positionStrategy: {
			type: String,
			required: false
		},
		updatePositionStrategy: {
			type: String,
			required: false
		},
		disableUpdateOnLayoutShift: {
			type: Boolean,
			required: false
		},
		prioritizePosition: {
			type: Boolean,
			required: false
		},
		reference: {
			type: null,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	emits: [
		"escapeKeyDown",
		"pointerDownOutside",
		"focusOutside",
		"interactOutside",
		"entryFocus",
		"openAutoFocus",
		"closeAutoFocus"
	],
	setup(__props, { emit: __emit }) {
		const forwarded = useForwardPropsEmits(__props, __emit);
		useForwardExpose();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(MenuSubContent_default), mergeProps(unref(forwarded), { style: {
				"--reka-dropdown-menu-content-transform-origin": "var(--reka-popper-transform-origin)",
				"--reka-dropdown-menu-content-available-width": "var(--reka-popper-available-width)",
				"--reka-dropdown-menu-content-available-height": "var(--reka-popper-available-height)",
				"--reka-dropdown-menu-trigger-width": "var(--reka-popper-anchor-width)",
				"--reka-dropdown-menu-trigger-height": "var(--reka-popper-anchor-height)"
			} }), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/DropdownMenu/DropdownMenuSubTrigger.js
var DropdownMenuSubTrigger_default = /*@__PURE__*/ defineComponent({
	__name: "DropdownMenuSubTrigger",
	props: {
		graceDuration: {
			type: Number,
			required: false
		},
		disabled: {
			type: Boolean,
			required: false
		},
		textValue: {
			type: String,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		useForwardExpose();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(MenuSubTrigger_default), normalizeProps(guardReactiveProps(props)), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/DropdownMenu/DropdownMenuTrigger.js
var DropdownMenuTrigger_default = /*@__PURE__*/ defineComponent({
	__name: "DropdownMenuTrigger",
	props: {
		disabled: {
			type: Boolean,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "button"
		}
	},
	setup(__props) {
		const props = __props;
		const rootContext = injectDropdownMenuRootContext();
		const { forwardRef, currentElement: triggerElement } = useForwardExpose();
		onMounted(() => {
			rootContext.triggerElement = triggerElement;
		});
		rootContext.triggerId ||= useId$1(void 0, "reka-dropdown-menu-trigger");
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(MenuAnchor_default), { "as-child": "" }, {
				default: withCtx(() => [createVNode(unref(Primitive), {
					id: unref(rootContext).triggerId,
					ref: unref(forwardRef),
					type: __props.as === "button" ? "button" : void 0,
					"as-child": props.asChild,
					as: __props.as,
					"aria-haspopup": "menu",
					"aria-expanded": unref(rootContext).open.value,
					"aria-controls": unref(rootContext).open.value ? unref(rootContext).contentId : void 0,
					"data-disabled": __props.disabled ? "" : void 0,
					disabled: __props.disabled,
					"data-state": unref(rootContext).open.value ? "open" : "closed",
					onClick: _cache[0] || (_cache[0] = async (event) => {
						if (event.defaultPrevented) return;
						if (!__props.disabled && event.button === 0 && event.ctrlKey === false) {
							unref(rootContext)?.onOpenToggle();
							await nextTick();
							if (unref(rootContext).open.value) event.preventDefault();
						}
					}),
					onKeydown: _cache[1] || (_cache[1] = withKeys((event) => {
						if (__props.disabled || event.defaultPrevented) return;
						if (["Enter", " "].includes(event.key)) unref(rootContext).onOpenToggle();
						if (event.key === "ArrowDown") unref(rootContext).onOpenChange(true);
						if ([
							"Enter",
							" ",
							"ArrowDown"
						].includes(event.key)) event.preventDefault();
					}, [
						"enter",
						"space",
						"arrow-down"
					]))
				}, {
					default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
					_: 3
				}, 8, [
					"id",
					"type",
					"as-child",
					"as",
					"aria-expanded",
					"aria-controls",
					"data-disabled",
					"disabled",
					"data-state"
				])]),
				_: 3
			});
		};
	}
});
// ../../../../node_modules/reka-ui/dist/HoverCard/HoverCardArrow.js
var HoverCardArrow_default = /*@__PURE__*/ defineComponent({
	__name: "HoverCardArrow",
	props: {
		width: {
			type: Number,
			required: false,
			default: 10
		},
		height: {
			type: Number,
			required: false,
			default: 5
		},
		rounded: {
			type: Boolean,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "svg"
		}
	},
	setup(__props) {
		const props = __props;
		useForwardExpose();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(PopperArrow_default), normalizeProps(guardReactiveProps(props)), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/HoverCard/HoverCardRoot.js
var [injectHoverCardRootContext, provideHoverCardRootContext] = /*@__PURE__*/ createContext("HoverCardRoot");
var HoverCardRoot_default = /*@__PURE__*/ defineComponent({
	__name: "HoverCardRoot",
	props: {
		defaultOpen: {
			type: Boolean,
			required: false,
			default: false
		},
		open: {
			type: Boolean,
			required: false,
			default: void 0
		},
		openDelay: {
			type: Number,
			required: false,
			default: 700
		},
		closeDelay: {
			type: Number,
			required: false,
			default: 300
		},
		enableTouch: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	emits: ["update:open"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const { openDelay, closeDelay, enableTouch } = toRefs(props);
		useForwardExpose();
		const open = useVModel(props, "open", emit, {
			defaultValue: props.defaultOpen,
			passive: props.open === void 0
		});
		const openTimerRef = ref(0);
		const closeTimerRef = ref(0);
		const hasSelectionRef = ref(false);
		const isPointerDownOnContentRef = ref(false);
		const isPointerInTransitRef = ref(false);
		const triggerElement = ref();
		function handleOpen() {
			clearTimeout(closeTimerRef.value);
			openTimerRef.value = window.setTimeout(() => open.value = true, openDelay.value);
		}
		function handleClose() {
			clearTimeout(openTimerRef.value);
			if (!hasSelectionRef.value && !isPointerDownOnContentRef.value) closeTimerRef.value = window.setTimeout(() => open.value = false, closeDelay.value);
		}
		function handleDismiss() {
			clearTimeout(openTimerRef.value);
			open.value = false;
		}
		provideHoverCardRootContext({
			open,
			onOpenChange(value) {
				open.value = value;
			},
			onOpen: handleOpen,
			onClose: handleClose,
			onDismiss: handleDismiss,
			hasSelectionRef,
			isPointerDownOnContentRef,
			isPointerInTransitRef,
			triggerElement,
			enableTouch
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(PopperRoot_default), null, {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default", { open: unref(open) })]),
				_: 3
			});
		};
	}
});
// ../../../../node_modules/reka-ui/dist/HoverCard/utils.js
function excludeTouch(eventHandler) {
	return (event) => event.pointerType === "touch" ? void 0 : eventHandler();
}
/**
* Returns a list of nodes that can be in the tab sequence.
* @see: https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker
*/
function getTabbableNodes(container) {
	const nodes = [];
	const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, { acceptNode: (node) => {
		return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
	} });
	while (walker.nextNode()) nodes.push(walker.currentNode);
	return nodes;
}
// ../../../../node_modules/reka-ui/dist/HoverCard/HoverCardContentImpl.js
var HoverCardContentImpl_default = /*@__PURE__*/ defineComponent({
	__name: "HoverCardContentImpl",
	props: {
		memoDependencies: {
			type: Array,
			required: false
		},
		side: {
			type: null,
			required: false
		},
		sideOffset: {
			type: Number,
			required: false
		},
		sideFlip: {
			type: Boolean,
			required: false
		},
		align: {
			type: null,
			required: false
		},
		alignOffset: {
			type: Number,
			required: false
		},
		alignFlip: {
			type: Boolean,
			required: false
		},
		avoidCollisions: {
			type: Boolean,
			required: false
		},
		collisionBoundary: {
			type: null,
			required: false
		},
		collisionPadding: {
			type: [Number, Object],
			required: false
		},
		arrowPadding: {
			type: Number,
			required: false
		},
		hideShiftedArrow: {
			type: Boolean,
			required: false
		},
		sticky: {
			type: String,
			required: false
		},
		hideWhenDetached: {
			type: Boolean,
			required: false
		},
		positionStrategy: {
			type: String,
			required: false
		},
		updatePositionStrategy: {
			type: String,
			required: false
		},
		disableUpdateOnLayoutShift: {
			type: Boolean,
			required: false
		},
		prioritizePosition: {
			type: Boolean,
			required: false
		},
		reference: {
			type: null,
			required: false
		},
		dir: {
			type: String,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	emits: [
		"escapeKeyDown",
		"pointerDownOutside",
		"focusOutside",
		"interactOutside"
	],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const forwarded = useForwardProps(props);
		const { forwardRef, currentElement: contentElement } = useForwardExpose();
		const rootContext = injectHoverCardRootContext();
		const { isPointerInTransit, onPointerExit } = useGraceArea(rootContext.triggerElement, contentElement);
		syncRef(rootContext.isPointerInTransitRef, isPointerInTransit, { direction: "rtl" });
		onPointerExit(() => {
			rootContext.onClose();
		});
		const containSelection = ref(false);
		let originalBodyUserSelect;
		watchEffect((cleanupFn) => {
			if (containSelection.value) {
				const body = document.body;
				originalBodyUserSelect = body.style.userSelect || body.style.webkitUserSelect;
				body.style.userSelect = "none";
				body.style.webkitUserSelect = "none";
				cleanupFn(() => {
					body.style.userSelect = originalBodyUserSelect;
					body.style.webkitUserSelect = originalBodyUserSelect;
				});
			}
		});
		function handlePointerUp() {
			containSelection.value = false;
			rootContext.isPointerDownOnContentRef.value = false;
			nextTick(() => {
				if (document.getSelection()?.toString() !== "") rootContext.hasSelectionRef.value = true;
			});
		}
		onMounted(() => {
			if (contentElement.value) {
				document.addEventListener("pointerup", handlePointerUp);
				getTabbableNodes(contentElement.value).forEach((tabbable) => tabbable.setAttribute("tabindex", "-1"));
			}
			useEventListener(window, "scroll", (event) => {
				if (event.target?.contains(rootContext.triggerElement.value)) rootContext.onDismiss();
			}, { capture: true });
		});
		onUnmounted(() => {
			document.removeEventListener("pointerup", handlePointerUp);
			rootContext.hasSelectionRef.value = false;
			rootContext.isPointerDownOnContentRef.value = false;
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(DismissableLayer_default), {
				"as-child": "",
				"disable-outside-pointer-events": false,
				onEscapeKeyDown: _cache[1] || (_cache[1] = ($event) => emits("escapeKeyDown", $event)),
				onPointerDownOutside: _cache[2] || (_cache[2] = ($event) => emits("pointerDownOutside", $event)),
				onFocusOutside: _cache[3] || (_cache[3] = withModifiers(($event) => emits("focusOutside", $event), ["prevent"])),
				onDismiss: unref(rootContext).onDismiss
			}, {
				default: withCtx(() => [createVNode(unref(PopperContent_default), mergeProps({
					...unref(forwarded),
					..._ctx.$attrs
				}, {
					ref: unref(forwardRef),
					"data-state": unref(rootContext).open.value ? "open" : "closed",
					style: {
						"userSelect": containSelection.value ? "text" : void 0,
						"WebkitUserSelect": containSelection.value ? "text" : void 0,
						"--reka-hover-card-content-transform-origin": "var(--reka-popper-transform-origin)",
						"--reka-hover-card-content-available-width": "var(--reka-popper-available-width)",
						"--reka-hover-card-content-available-height": "var(--reka-popper-available-height)",
						"--reka-hover-card-trigger-width": "var(--reka-popper-anchor-width)",
						"--reka-hover-card-trigger-height": "var(--reka-popper-anchor-height)"
					},
					onPointerdown: _cache[0] || (_cache[0] = (event) => {
						if (event.currentTarget.contains(event.target)) containSelection.value = true;
						unref(rootContext).hasSelectionRef.value = false;
						unref(rootContext).isPointerDownOnContentRef.value = true;
					})
				}), {
					default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
					_: 3
				}, 16, ["data-state", "style"])]),
				_: 3
			}, 8, ["onDismiss"]);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/HoverCard/HoverCardContent.js
var HoverCardContent_default = /*@__PURE__*/ defineComponent({
	__name: "HoverCardContent",
	props: {
		forceMount: {
			type: Boolean,
			required: false
		},
		memoDependencies: {
			type: Array,
			required: false
		},
		side: {
			type: null,
			required: false
		},
		sideOffset: {
			type: Number,
			required: false
		},
		sideFlip: {
			type: Boolean,
			required: false
		},
		align: {
			type: null,
			required: false
		},
		alignOffset: {
			type: Number,
			required: false
		},
		alignFlip: {
			type: Boolean,
			required: false
		},
		avoidCollisions: {
			type: Boolean,
			required: false
		},
		collisionBoundary: {
			type: null,
			required: false
		},
		collisionPadding: {
			type: [Number, Object],
			required: false
		},
		arrowPadding: {
			type: Number,
			required: false
		},
		hideShiftedArrow: {
			type: Boolean,
			required: false
		},
		sticky: {
			type: String,
			required: false
		},
		hideWhenDetached: {
			type: Boolean,
			required: false
		},
		positionStrategy: {
			type: String,
			required: false
		},
		updatePositionStrategy: {
			type: String,
			required: false
		},
		disableUpdateOnLayoutShift: {
			type: Boolean,
			required: false
		},
		prioritizePosition: {
			type: Boolean,
			required: false
		},
		reference: {
			type: null,
			required: false
		},
		dir: {
			type: String,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	emits: [
		"escapeKeyDown",
		"pointerDownOutside",
		"focusOutside",
		"interactOutside"
	],
	setup(__props, { emit: __emit }) {
		const forwarded = useForwardPropsEmits(__props, __emit);
		const { forwardRef } = useForwardExpose();
		const rootContext = injectHoverCardRootContext();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Presence_default), { present: __props.forceMount || unref(rootContext).open.value }, {
				default: withCtx(() => [createVNode(HoverCardContentImpl_default, mergeProps(unref(forwarded), {
					ref: unref(forwardRef),
					onPointerenter: _cache[0] || (_cache[0] = ($event) => unref(excludeTouch)(unref(rootContext).onOpen)($event))
				}), {
					default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
					_: 3
				}, 16)]),
				_: 3
			}, 8, ["present"]);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/HoverCard/HoverCardPortal.js
var HoverCardPortal_default = /*@__PURE__*/ defineComponent({
	__name: "HoverCardPortal",
	props: {
		to: {
			type: null,
			required: false
		},
		disabled: {
			type: Boolean,
			required: false
		},
		defer: {
			type: Boolean,
			required: false
		},
		forceMount: {
			type: Boolean,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Teleport_default), normalizeProps(guardReactiveProps(props)), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/HoverCard/HoverCardTrigger.js
var HoverCardTrigger_default = /*@__PURE__*/ defineComponent({
	__name: "HoverCardTrigger",
	props: {
		reference: {
			type: null,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "a"
		}
	},
	setup(__props) {
		const { forwardRef, currentElement } = useForwardExpose();
		const rootContext = injectHoverCardRootContext();
		rootContext.triggerElement = currentElement;
		function handleLeave() {
			setTimeout(() => {
				if (!rootContext.isPointerInTransitRef.value && !rootContext.open.value) rootContext.onClose();
			}, 0);
		}
		function handleTouch(event) {
			if (!rootContext.enableTouch.value || event.pointerType !== "touch") return;
			if (rootContext.open.value) rootContext.onDismiss();
			else rootContext.onOpenChange(true);
		}
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(PopperAnchor_default), {
				"as-child": "",
				reference: __props.reference
			}, {
				default: withCtx(() => [createVNode(unref(Primitive), {
					ref: unref(forwardRef),
					"as-child": __props.asChild,
					as: __props.as,
					"data-state": unref(rootContext).open.value ? "open" : "closed",
					"data-grace-area-trigger": "",
					onPointerenter: _cache[0] || (_cache[0] = ($event) => unref(excludeTouch)(unref(rootContext).onOpen)($event)),
					onPointerleave: _cache[1] || (_cache[1] = ($event) => unref(excludeTouch)(handleLeave)($event)),
					onPointerup: handleTouch,
					onFocus: _cache[2] || (_cache[2] = ($event) => unref(rootContext).onOpen()),
					onBlur: _cache[3] || (_cache[3] = ($event) => unref(rootContext).onClose())
				}, {
					default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
					_: 3
				}, 8, [
					"as-child",
					"as",
					"data-state"
				])]),
				_: 3
			}, 8, ["reference"]);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/component/BaseSeparator.js
var BaseSeparator_default = /*@__PURE__*/ defineComponent({
	__name: "BaseSeparator",
	props: {
		orientation: {
			type: String,
			required: false,
			default: "horizontal"
		},
		decorative: {
			type: Boolean,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		const ORIENTATIONS = ["horizontal", "vertical"];
		function isValidOrientation(orientation) {
			return ORIENTATIONS.includes(orientation);
		}
		const computedOrientation = computed(() => isValidOrientation(props.orientation) ? props.orientation : "horizontal");
		const ariaOrientation = computed(() => computedOrientation.value === "vertical" ? props.orientation : void 0);
		const semanticProps = computed(() => props.decorative ? { role: "none" } : {
			"aria-orientation": ariaOrientation.value,
			"role": "separator"
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Primitive), mergeProps({
				as: __props.as,
				"as-child": __props.asChild,
				"data-orientation": computedOrientation.value
			}, semanticProps.value), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16, [
				"as",
				"as-child",
				"data-orientation"
			]);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Separator/Separator.js
var Separator_default$1 = /*@__PURE__*/ defineComponent({
	__name: "Separator",
	props: {
		orientation: {
			type: String,
			required: false,
			default: "horizontal"
		},
		decorative: {
			type: Boolean,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		return (_ctx, _cache) => {
			return openBlock(), createBlock(BaseSeparator_default, normalizeProps(guardReactiveProps(props)), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Toast/createToastManager.js
var TOAST_MANAGER_SUBSCRIBE = /*@__PURE__*/ Symbol("ToastManagerSubscribe");
var count = 0;
function generateToastId() {
	count = (count + 1) % Number.MAX_SAFE_INTEGER;
	return `reka-toast-${count}`;
}
function resolvePromiseState(state, value) {
	const resolved = typeof state === "function" ? state(value) : state;
	return typeof resolved === "string" ? { description: resolved } : resolved;
}
function runToastPromise(promise, options, add, update) {
	const id = add({
		...typeof options.loading === "string" ? { description: options.loading } : options.loading,
		status: "loading"
	});
	return promise.then((value) => {
		update(id, {
			...resolvePromiseState(options.success, value),
			status: "success"
		});
		return value;
	}, (error) => {
		update(id, {
			...resolvePromiseState(options.error, error),
			status: "error"
		});
		throw error;
	});
}
// ../../../../node_modules/reka-ui/dist/Toast/useToastStore.js
function useToastStore() {
	const toasts = shallowRef([]);
	const restartKeys = /*#__PURE__*/ reactive(/* @__PURE__ */ new Map());
	function find(id) {
		return toasts.value.find((toast) => toast.id === id);
	}
	function replace(id, next) {
		toasts.value = toasts.value.map((toast) => toast.id === id ? next : toast);
	}
	function remove(id) {
		const toast = find(id);
		if (!toast || toast.open) return;
		toasts.value = toasts.value.filter((item) => item.id !== id);
		restartKeys.delete(id);
		toast.onRemove?.();
	}
	function add(options) {
		const id = options.id ?? generateToastId();
		const existing = find(id);
		if (existing?.open) {
			const { id: _id, ...updates } = options;
			replace(id, {
				...existing,
				...updates,
				updateKey: existing.updateKey + 1
			});
			restartKeys.set(id, (restartKeys.get(id) ?? 0) + 1);
			return id;
		}
		const rest = existing ? toasts.value.filter((toast) => toast.id !== id) : toasts.value;
		toasts.value = [{
			...options,
			id,
			open: true,
			updateKey: 0
		}, ...rest];
		return id;
	}
	function close(id) {
		const closing = toasts.value.filter((toast) => toast.open && (id === void 0 || toast.id === id));
		if (!closing.length) return;
		toasts.value = toasts.value.map((toast) => closing.includes(toast) ? {
			...toast,
			open: false
		} : toast);
		closing.forEach((toast) => toast.onClose?.());
	}
	function update(id, updates) {
		const prevToast = find(id);
		if (!prevToast?.open) return;
		const patch = typeof updates === "function" ? updates(prevToast) : updates;
		const current = find(id);
		if (!current?.open) return;
		replace(id, {
			...current,
			...patch,
			id,
			open: true,
			updateKey: current.updateKey + 1
		});
	}
	return {
		toasts,
		add,
		close,
		update,
		promise: (promise, options) => runToastPromise(promise, options, add, update),
		remove,
		getRestartKey: (id) => restartKeys.get(id) ?? 0
	};
}
// ../../../../node_modules/reka-ui/dist/Toast/ToastProvider.js
var [injectToastProviderContext, provideToastProviderContext] = /*@__PURE__*/ createContext("ToastProvider");
var ToastProvider_default = /*@__PURE__*/ defineComponent({
	inheritAttrs: false,
	__name: "ToastProvider",
	props: {
		label: {
			type: String,
			required: false,
			default: "Notification"
		},
		duration: {
			type: Number,
			required: false,
			default: 5e3
		},
		disableSwipe: {
			type: Boolean,
			required: false
		},
		swipeDirection: {
			type: String,
			required: false,
			default: "right"
		},
		swipeThreshold: {
			type: Number,
			required: false,
			default: 50
		},
		limit: {
			type: Number,
			required: false
		},
		toastManager: {
			type: Object,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		const { label, duration, disableSwipe, swipeDirection, swipeThreshold } = toRefs(props);
		useCollection({ isProvider: true });
		const viewport = ref();
		const toastCount = ref(0);
		const isFocusedToastEscapeKeyDownRef = ref(false);
		const isClosePausedRef = ref(false);
		const toastStore = useToastStore();
		onMounted(() => {
			watch(() => props.toastManager, (manager, _, onCleanup) => {
				if (!manager) return;
				onCleanup(manager[TOAST_MANAGER_SUBSCRIBE]((event) => {
					if (event.action === "add") toastStore.add(event.options);
					else if (event.action === "close") toastStore.close(event.id);
					else toastStore.update(event.id, event.updates);
				}));
			}, { immediate: true });
		});
		const entries = shallowReactive([]);
		let seq = 0;
		const stack = computed(() => {
			const ordered = [...entries].sort((a, b) => b.seq - a.seq);
			const states = /* @__PURE__ */ new Map();
			let visibleIndex = 0;
			let offsetY = 0;
			ordered.forEach((entry, index) => {
				const closing = !entry.open;
				states.set(entry, {
					index: closing ? index : visibleIndex,
					offsetY,
					limited: !closing && props.limit !== void 0 && visibleIndex >= props.limit
				});
				if (!closing) {
					offsetY += entry.height;
					visibleIndex++;
				}
			});
			return {
				ordered,
				states
			};
		});
		const hovering = ref(false);
		const focused = ref(false);
		if (props.label && typeof props.label === "string" && !props.label.trim()) throw new Error("Invalid prop `label` supplied to `ToastProvider`. Expected non-empty `string`.");
		provideToastProviderContext({
			label,
			duration,
			disableSwipe,
			swipeDirection,
			swipeThreshold,
			toastCount,
			viewport,
			onViewportChange(el) {
				viewport.value = el;
			},
			onToastAdd() {
				toastCount.value++;
			},
			onToastRemove() {
				toastCount.value--;
			},
			isFocusedToastEscapeKeyDownRef,
			isClosePausedRef,
			toastStore,
			hovering,
			focused,
			expanded: computed(() => hovering.value || focused.value),
			frontmostHeight: computed(() => stack.value.ordered.find((entry) => entry.open)?.height || void 0),
			closingCount: computed(() => entries.filter((entry) => !entry.open).length),
			registerToast(entry) {
				entry.seq = ++seq;
				entries.push(entry);
				return () => {
					const index = entries.indexOf(entry);
					if (index !== -1) entries.splice(index, 1);
				};
			},
			reopenToast(entry) {
				entry.seq = ++seq;
			},
			getToastStack(entry) {
				return stack.value.states.get(entry) ?? {
					index: 0,
					offsetY: 0,
					limited: false
				};
			}
		});
		return (_ctx, _cache) => {
			return renderSlot(_ctx.$slots, "default");
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Toast/utils.js
var TOAST_SWIPE_START = "toast.swipeStart";
var TOAST_SWIPE_MOVE = "toast.swipeMove";
var TOAST_SWIPE_CANCEL = "toast.swipeCancel";
var TOAST_SWIPE_END = "toast.swipeEnd";
var VIEWPORT_PAUSE = "toast.viewportPause";
var VIEWPORT_RESUME = "toast.viewportResume";
function handleAndDispatchCustomEvent(name, handler, detail) {
	const currentTarget = detail.originalEvent.currentTarget;
	const event = new CustomEvent(name, {
		bubbles: false,
		cancelable: true,
		detail
	});
	if (handler) currentTarget.addEventListener(name, handler, { once: true });
	currentTarget.dispatchEvent(event);
}
function isDeltaInDirection(delta, direction, threshold = 0) {
	const deltaX = Math.abs(delta.x);
	const deltaY = Math.abs(delta.y);
	const isDeltaX = deltaX > deltaY;
	if (direction === "left" || direction === "right") return isDeltaX && deltaX > threshold;
	else return !isDeltaX && deltaY > threshold;
}
function getAnnounceTextContent(container) {
	const textContent = [];
	Array.from(container.childNodes).forEach((node) => {
		if (node.nodeType === node.TEXT_NODE && node.textContent) textContent.push(node.textContent);
		if (isHTMLElement(node)) {
			const isHidden = node.ariaHidden || node.hidden || node.style.display === "none";
			const isExcluded = node.dataset.rekaToastAnnounceExclude === "";
			if (!isHidden) if (isExcluded) {
				const altText = node.dataset.rekaToastAnnounceAlt;
				if (altText) textContent.push(altText);
			} else textContent.push(...getAnnounceTextContent(node));
		}
	});
	return textContent;
}
// ../../../../node_modules/reka-ui/dist/Toast/ToastPortal.js
var ToastPortal_default = /*@__PURE__*/ defineComponent({
	__name: "ToastPortal",
	props: {
		to: {
			type: null,
			required: false
		},
		disabled: {
			type: Boolean,
			required: false
		},
		defer: {
			type: Boolean,
			required: false
		},
		forceMount: {
			type: Boolean,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Teleport_default), normalizeProps(guardReactiveProps(props)), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Toast/FocusProxy.js
var FocusProxy_default = /*@__PURE__*/ defineComponent({
	__name: "FocusProxy",
	emits: ["focusFromOutsideViewport"],
	setup(__props, { emit: __emit }) {
		const emits = __emit;
		const providerContext = injectToastProviderContext();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(VisuallyHidden_default), {
				tabindex: "0",
				style: { "position": "fixed" },
				onFocus: _cache[0] || (_cache[0] = (event) => {
					const prevFocusedElement = event.relatedTarget;
					if (!unref(providerContext).viewport.value?.contains(prevFocusedElement)) emits("focusFromOutsideViewport");
				})
			}, {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			});
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Toast/ToastViewport.js
var ToastViewport_default = /*@__PURE__*/ defineComponent({
	inheritAttrs: false,
	__name: "ToastViewport",
	props: {
		hotkey: {
			type: Array,
			required: false,
			default: () => ["F8"]
		},
		label: {
			type: [String, Function],
			required: false,
			default: "Notifications ({hotkey})"
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "ol"
		}
	},
	setup(__props) {
		const { hotkey, label } = toRefs(__props);
		const { forwardRef, currentElement } = useForwardExpose();
		const { CollectionSlot, getItems } = useCollection();
		const providerContext = injectToastProviderContext();
		const hasToasts = computed(() => providerContext.toastCount.value > 0);
		const headFocusProxyRef = ref();
		const tailFocusProxyRef = ref();
		const KEY_RE = /Key/g;
		const DIGIT_RE = /Digit/g;
		const hotkeyMessage = computed(() => hotkey.value.join("+").replace(KEY_RE, "").replace(DIGIT_RE, ""));
		onKeyStroke(hotkey.value, () => {
			currentElement.value.focus();
		});
		onMounted(() => {
			providerContext.onViewportChange(currentElement.value);
		});
		const pendingPointerLeave = ref(false);
		watch([pendingPointerLeave, providerContext.closingCount], ([pending, closingCount]) => {
			if (pending && closingCount === 0) {
				providerContext.hovering.value = false;
				pendingPointerLeave.value = false;
			}
		});
		watch(hasToasts, (value) => {
			if (!value) {
				providerContext.hovering.value = false;
				providerContext.focused.value = false;
				pendingPointerLeave.value = false;
			}
		});
		watchEffect((cleanupFn) => {
			const viewport = currentElement.value;
			if (hasToasts.value && viewport) {
				const handlePause = () => {
					if (!providerContext.isClosePausedRef.value) {
						const pauseEvent = new CustomEvent(VIEWPORT_PAUSE);
						viewport.dispatchEvent(pauseEvent);
						providerContext.isClosePausedRef.value = true;
					}
				};
				const handleResume = () => {
					if (providerContext.isClosePausedRef.value) {
						const resumeEvent = new CustomEvent(VIEWPORT_RESUME);
						viewport.dispatchEvent(resumeEvent);
						providerContext.isClosePausedRef.value = false;
					}
				};
				const handleFocusOutResume = (event) => {
					if (!viewport.contains(event.relatedTarget)) {
						providerContext.focused.value = false;
						handleResume();
					}
				};
				const handlePointerLeaveResume = () => {
					pendingPointerLeave.value = true;
					if (!viewport.contains(getActiveElement())) handleResume();
				};
				const handlePointerMoveExpand = () => {
					pendingPointerLeave.value = false;
					providerContext.hovering.value = true;
				};
				const handleFocusInExpand = () => {
					providerContext.focused.value = true;
				};
				const handleKeyDown = (event) => {
					const isMetaKey = event.altKey || event.ctrlKey || event.metaKey;
					if (event.key === "Tab" && !isMetaKey) {
						const focusedElement = getActiveElement();
						const isTabbingBackwards = event.shiftKey;
						if (event.target === viewport && isTabbingBackwards) {
							headFocusProxyRef.value?.focus();
							return;
						}
						const sortedCandidates = getSortedTabbableCandidates({ tabbingDirection: isTabbingBackwards ? "backwards" : "forwards" });
						const index = sortedCandidates.findIndex((candidate) => candidate === focusedElement);
						if (focusFirst$2(sortedCandidates.slice(index + 1))) event.preventDefault();
						else isTabbingBackwards ? headFocusProxyRef.value?.focus() : tailFocusProxyRef.value?.focus();
					}
				};
				viewport.addEventListener("focusin", handlePause);
				viewport.addEventListener("focusin", handleFocusInExpand);
				viewport.addEventListener("focusout", handleFocusOutResume);
				viewport.addEventListener("pointermove", handlePause);
				viewport.addEventListener("pointermove", handlePointerMoveExpand);
				viewport.addEventListener("pointerleave", handlePointerLeaveResume);
				viewport.addEventListener("keydown", handleKeyDown);
				window.addEventListener("blur", handlePause);
				window.addEventListener("focus", handleResume);
				cleanupFn(() => {
					viewport.removeEventListener("focusin", handlePause);
					viewport.removeEventListener("focusin", handleFocusInExpand);
					viewport.removeEventListener("focusout", handleFocusOutResume);
					viewport.removeEventListener("pointermove", handlePause);
					viewport.removeEventListener("pointermove", handlePointerMoveExpand);
					viewport.removeEventListener("pointerleave", handlePointerLeaveResume);
					viewport.removeEventListener("keydown", handleKeyDown);
					window.removeEventListener("blur", handlePause);
					window.removeEventListener("focus", handleResume);
				});
			}
		});
		function getSortedTabbableCandidates({ tabbingDirection }) {
			const tabbableCandidates = getItems().map((i) => i.ref).map((toastNode) => {
				const toastTabbableCandidates = [toastNode, ...getTabbableCandidates(toastNode)];
				return tabbingDirection === "forwards" ? toastTabbableCandidates : toastTabbableCandidates.reverse();
			});
			return (tabbingDirection === "forwards" ? tabbableCandidates.reverse() : tabbableCandidates).flat();
		}
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(DismissableLayerBranch_default), {
				role: "region",
				"aria-label": typeof unref(label) === "string" ? unref(label).replace("{hotkey}", hotkeyMessage.value) : unref(label)(hotkeyMessage.value),
				tabindex: "-1",
				style: normalizeStyle({ pointerEvents: hasToasts.value ? void 0 : "none" })
			}, {
				default: withCtx(() => [
					hasToasts.value ? (openBlock(), createBlock(FocusProxy_default, {
						key: 0,
						ref: (node) => {
							if (!node) return void 0;
							headFocusProxyRef.value = unref(unrefElement)(node);
						},
						onFocusFromOutsideViewport: _cache[0] || (_cache[0] = () => {
							const tabbableCandidates = getSortedTabbableCandidates({ tabbingDirection: "forwards" });
							unref(focusFirst$2)(tabbableCandidates);
						})
					}, null, 512)) : createCommentVNode("v-if", true),
					createVNode(unref(CollectionSlot), null, {
						default: withCtx(() => [createVNode(unref(Primitive), mergeProps({
							ref: unref(forwardRef),
							tabindex: "-1",
							as: __props.as,
							"as-child": __props.asChild,
							"data-expanded": unref(providerContext).expanded.value ? "" : void 0,
							style: { "--reka-toast-frontmost-height": unref(providerContext).frontmostHeight.value ? `${unref(providerContext).frontmostHeight.value}px` : void 0 }
						}, _ctx.$attrs), {
							default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
							_: 3
						}, 16, [
							"as",
							"as-child",
							"data-expanded",
							"style"
						])]),
						_: 3
					}),
					hasToasts.value ? (openBlock(), createBlock(FocusProxy_default, {
						key: 1,
						ref: (node) => {
							if (!node) return void 0;
							tailFocusProxyRef.value = unref(unrefElement)(node);
						},
						onFocusFromOutsideViewport: _cache[1] || (_cache[1] = () => {
							const tabbableCandidates = getSortedTabbableCandidates({ tabbingDirection: "backwards" });
							unref(focusFirst$2)(tabbableCandidates);
						})
					}, null, 512)) : createCommentVNode("v-if", true)
				]),
				_: 3
			}, 8, ["aria-label", "style"]);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Tooltip/TooltipArrow.js
var TooltipArrow_default = /*@__PURE__*/ defineComponent({
	__name: "TooltipArrow",
	props: {
		width: {
			type: Number,
			required: false,
			default: 10
		},
		height: {
			type: Number,
			required: false,
			default: 5
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "svg"
		}
	},
	setup(__props) {
		const props = __props;
		useForwardExpose();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(PopperArrow_default), normalizeProps(guardReactiveProps(props)), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Tooltip/TooltipProvider.js
var [injectTooltipProviderContext, provideTooltipProviderContext] = /*@__PURE__*/ createContext("TooltipProvider");
var TooltipProvider_default = /*@__PURE__*/ defineComponent({
	inheritAttrs: false,
	__name: "TooltipProvider",
	props: {
		delayDuration: {
			type: Number,
			required: false,
			default: 700
		},
		skipDelayDuration: {
			type: Number,
			required: false,
			default: 300
		},
		disableHoverableContent: {
			type: Boolean,
			required: false,
			default: false
		},
		disableClosingTrigger: {
			type: Boolean,
			required: false
		},
		disabled: {
			type: Boolean,
			required: false
		},
		ignoreNonKeyboardFocus: {
			type: Boolean,
			required: false,
			default: false
		},
		content: {
			type: Object,
			required: false
		}
	},
	setup(__props) {
		const { delayDuration, skipDelayDuration, disableHoverableContent, disableClosingTrigger, ignoreNonKeyboardFocus, disabled, content } = toRefs(__props);
		useForwardExpose();
		const isOpenDelayed = ref(true);
		const isPointerInTransitRef = ref(false);
		const { start: startTimer, stop: clearTimer } = useTimeoutFn(() => {
			isOpenDelayed.value = true;
		}, skipDelayDuration, { immediate: false });
		provideTooltipProviderContext({
			isOpenDelayed,
			delayDuration,
			onOpen() {
				clearTimer();
				isOpenDelayed.value = false;
			},
			onClose() {
				startTimer();
			},
			isPointerInTransitRef,
			disableHoverableContent,
			disableClosingTrigger,
			disabled,
			ignoreNonKeyboardFocus,
			content
		});
		return (_ctx, _cache) => {
			return renderSlot(_ctx.$slots, "default");
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Tooltip/utils.js
var TOOLTIP_OPEN = "tooltip.open";
// ../../../../node_modules/reka-ui/dist/Tooltip/TooltipRoot.js
var [injectTooltipRootContext, provideTooltipRootContext] = /*@__PURE__*/ createContext("TooltipRoot");
var TooltipRoot_default = /*@__PURE__*/ defineComponent({
	__name: "TooltipRoot",
	props: {
		defaultOpen: {
			type: Boolean,
			required: false,
			default: false
		},
		open: {
			type: Boolean,
			required: false,
			default: void 0
		},
		delayDuration: {
			type: Number,
			required: false,
			default: void 0
		},
		disableHoverableContent: {
			type: Boolean,
			required: false,
			default: void 0
		},
		disableClosingTrigger: {
			type: Boolean,
			required: false,
			default: void 0
		},
		disabled: {
			type: Boolean,
			required: false,
			default: void 0
		},
		ignoreNonKeyboardFocus: {
			type: Boolean,
			required: false,
			default: void 0
		}
	},
	emits: ["update:open"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		useForwardExpose();
		const providerContext = injectTooltipProviderContext();
		const disableHoverableContent = computed(() => props.disableHoverableContent ?? providerContext.disableHoverableContent.value);
		const disableClosingTrigger = computed(() => props.disableClosingTrigger ?? providerContext.disableClosingTrigger.value);
		const disableTooltip = computed(() => props.disabled ?? providerContext.disabled.value);
		const delayDuration = computed(() => props.delayDuration ?? providerContext.delayDuration.value);
		const ignoreNonKeyboardFocus = computed(() => props.ignoreNonKeyboardFocus ?? providerContext.ignoreNonKeyboardFocus.value);
		const open = useVModel(props, "open", emit, {
			defaultValue: props.defaultOpen,
			passive: props.open === void 0
		});
		watch(open, (isOpen) => {
			if (!providerContext.onClose) return;
			if (isOpen) {
				providerContext.onOpen();
				document.dispatchEvent(new CustomEvent(TOOLTIP_OPEN));
			} else providerContext.onClose();
		});
		const wasOpenDelayedRef = ref(false);
		const trigger = ref();
		const stateAttribute = computed(() => {
			if (!open.value) return "closed";
			return wasOpenDelayedRef.value ? "delayed-open" : "instant-open";
		});
		const { start: startTimer, stop: clearTimer } = useTimeoutFn(() => {
			wasOpenDelayedRef.value = true;
			open.value = true;
		}, delayDuration, { immediate: false });
		function handleOpen() {
			clearTimer();
			wasOpenDelayedRef.value = false;
			open.value = true;
		}
		function handleClose() {
			clearTimer();
			open.value = false;
		}
		function handleDelayedOpen() {
			startTimer();
		}
		provideTooltipRootContext({
			contentId: "",
			open,
			stateAttribute,
			trigger,
			onTriggerChange(el) {
				trigger.value = el;
			},
			onTriggerEnter() {
				if (providerContext.isOpenDelayed.value) handleDelayedOpen();
				else handleOpen();
			},
			onTriggerLeave() {
				if (disableHoverableContent.value) handleClose();
				else clearTimer();
			},
			onOpen: handleOpen,
			onClose: handleClose,
			disableHoverableContent,
			disableClosingTrigger,
			disabled: disableTooltip,
			ignoreNonKeyboardFocus
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(PopperRoot_default), null, {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default", { open: unref(open) })]),
				_: 3
			});
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Tooltip/TooltipContentImpl.js
var TooltipContentImpl_default = /*@__PURE__*/ defineComponent({
	__name: "TooltipContentImpl",
	props: {
		ariaLabel: {
			type: String,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false,
			default: void 0
		},
		as: {
			type: null,
			required: false
		},
		side: {
			type: null,
			required: false
		},
		sideOffset: {
			type: Number,
			required: false
		},
		align: {
			type: null,
			required: false
		},
		alignOffset: {
			type: Number,
			required: false
		},
		avoidCollisions: {
			type: Boolean,
			required: false,
			default: void 0
		},
		collisionBoundary: {
			type: null,
			required: false
		},
		collisionPadding: {
			type: [Number, Object],
			required: false
		},
		arrowPadding: {
			type: Number,
			required: false
		},
		sticky: {
			type: String,
			required: false
		},
		hideWhenDetached: {
			type: Boolean,
			required: false,
			default: void 0
		},
		positionStrategy: {
			type: String,
			required: false
		},
		updatePositionStrategy: {
			type: String,
			required: false
		}
	},
	emits: ["escapeKeyDown", "pointerDownOutside"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const rootContext = injectTooltipRootContext();
		const providerContext = injectTooltipProviderContext();
		const { forwardRef, currentElement } = useForwardExpose();
		const ariaLabel = computed(() => props.ariaLabel || currentElement.value?.textContent);
		const popperContentProps = computed(() => {
			const { ariaLabel: _, ...restProps } = props;
			return defu(restProps, providerContext.content.value ?? {}, {
				side: "top",
				sideOffset: 0,
				align: "center",
				avoidCollisions: true,
				collisionBoundary: [],
				collisionPadding: 0,
				arrowPadding: 0,
				sticky: "partial",
				hideWhenDetached: false
			});
		});
		onMounted(() => {
			useEventListener(window, "scroll", (event) => {
				if (event.target?.contains(rootContext.trigger.value)) rootContext.onClose();
			}, { capture: true });
			useEventListener(document, TOOLTIP_OPEN, rootContext.onClose);
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(DismissableLayer_default), {
				"as-child": "",
				"disable-outside-pointer-events": false,
				onEscapeKeyDown: _cache[0] || (_cache[0] = ($event) => emits("escapeKeyDown", $event)),
				onPointerDownOutside: _cache[1] || (_cache[1] = (event) => {
					if (unref(rootContext).disableClosingTrigger.value && unref(rootContext).trigger.value?.contains(event.target)) event.preventDefault();
					emits("pointerDownOutside", event);
				}),
				onFocusOutside: _cache[2] || (_cache[2] = withModifiers(() => {}, ["prevent"])),
				onDismiss: _cache[3] || (_cache[3] = ($event) => unref(rootContext).onClose())
			}, {
				default: withCtx(() => [createVNode(unref(PopperContent_default), mergeProps({
					ref: unref(forwardRef),
					"data-state": unref(rootContext).stateAttribute.value
				}, {
					..._ctx.$attrs,
					...popperContentProps.value
				}, { style: {
					"--reka-tooltip-content-transform-origin": "var(--reka-popper-transform-origin)",
					"--reka-tooltip-content-available-width": "var(--reka-popper-available-width)",
					"--reka-tooltip-content-available-height": "var(--reka-popper-available-height)",
					"--reka-tooltip-trigger-width": "var(--reka-popper-anchor-width)",
					"--reka-tooltip-trigger-height": "var(--reka-popper-anchor-height)"
				} }), {
					default: withCtx(() => [renderSlot(_ctx.$slots, "default"), createVNode(unref(VisuallyHidden_default), {
						id: unref(rootContext).contentId,
						role: "tooltip"
					}, {
						default: withCtx(() => [createTextVNode(toDisplayString(ariaLabel.value), 1)]),
						_: 1
					}, 8, ["id"])]),
					_: 3
				}, 16, ["data-state"])]),
				_: 3
			});
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Tooltip/TooltipContentHoverable.js
var TooltipContentHoverable_default = /*@__PURE__*/ defineComponent({
	__name: "TooltipContentHoverable",
	props: {
		ariaLabel: {
			type: String,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		},
		side: {
			type: null,
			required: false
		},
		sideOffset: {
			type: Number,
			required: false
		},
		align: {
			type: null,
			required: false
		},
		alignOffset: {
			type: Number,
			required: false
		},
		avoidCollisions: {
			type: Boolean,
			required: false
		},
		collisionBoundary: {
			type: null,
			required: false
		},
		collisionPadding: {
			type: [Number, Object],
			required: false
		},
		arrowPadding: {
			type: Number,
			required: false
		},
		sticky: {
			type: String,
			required: false
		},
		hideWhenDetached: {
			type: Boolean,
			required: false
		},
		positionStrategy: {
			type: String,
			required: false
		},
		updatePositionStrategy: {
			type: String,
			required: false
		}
	},
	setup(__props) {
		const forwardedProps = useForwardProps(__props);
		const { forwardRef, currentElement } = useForwardExpose();
		const { trigger, onClose } = injectTooltipRootContext();
		const providerContext = injectTooltipProviderContext();
		const { isPointerInTransit, onPointerExit } = useGraceArea(trigger, currentElement);
		providerContext.isPointerInTransitRef = isPointerInTransit;
		onPointerExit(() => {
			onClose();
		});
		useEventListener(currentElement, "pointermove", (event) => {
			const content = currentElement.value;
			if (!content || event.pointerType === "touch") return;
			if (content.ownerDocument.elementsFromPoint?.(event.clientX, event.clientY).some((el) => {
				if (content.contains(el)) return false;
				const coveredTrigger = el.closest("[data-grace-area-trigger]");
				return !!coveredTrigger && coveredTrigger !== trigger.value;
			})) onClose();
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(TooltipContentImpl_default, mergeProps({ ref: unref(forwardRef) }, unref(forwardedProps)), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Tooltip/TooltipContent.js
var TooltipContent_default = /*@__PURE__*/ defineComponent({
	__name: "TooltipContent",
	props: {
		forceMount: {
			type: Boolean,
			required: false
		},
		ariaLabel: {
			type: String,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		},
		side: {
			type: null,
			required: false
		},
		sideOffset: {
			type: Number,
			required: false
		},
		align: {
			type: null,
			required: false
		},
		alignOffset: {
			type: Number,
			required: false
		},
		avoidCollisions: {
			type: Boolean,
			required: false
		},
		collisionBoundary: {
			type: null,
			required: false
		},
		collisionPadding: {
			type: [Number, Object],
			required: false
		},
		arrowPadding: {
			type: Number,
			required: false
		},
		sticky: {
			type: String,
			required: false
		},
		hideWhenDetached: {
			type: Boolean,
			required: false
		},
		positionStrategy: {
			type: String,
			required: false
		},
		updatePositionStrategy: {
			type: String,
			required: false
		}
	},
	emits: ["escapeKeyDown", "pointerDownOutside"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const rootContext = injectTooltipRootContext();
		const forwarded = useForwardPropsEmits(props, emits);
		const { forwardRef } = useForwardExpose();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Presence_default), { present: __props.forceMount || unref(rootContext).open.value }, {
				default: withCtx(() => [(openBlock(), createBlock(resolveDynamicComponent(unref(rootContext).disableHoverableContent.value ? TooltipContentImpl_default : TooltipContentHoverable_default), mergeProps({ ref: unref(forwardRef) }, unref(forwarded)), {
					default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
					_: 3
				}, 16))]),
				_: 3
			}, 8, ["present"]);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Tooltip/TooltipPortal.js
var TooltipPortal_default = /*@__PURE__*/ defineComponent({
	__name: "TooltipPortal",
	props: {
		to: {
			type: null,
			required: false
		},
		disabled: {
			type: Boolean,
			required: false
		},
		defer: {
			type: Boolean,
			required: false
		},
		forceMount: {
			type: Boolean,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Teleport_default), normalizeProps(guardReactiveProps(props)), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Tooltip/TooltipTrigger.js
var TooltipTrigger_default = /*@__PURE__*/ defineComponent({
	__name: "TooltipTrigger",
	props: {
		reference: {
			type: null,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "button"
		}
	},
	setup(__props) {
		const props = __props;
		const rootContext = injectTooltipRootContext();
		const providerContext = injectTooltipProviderContext();
		rootContext.contentId ||= useId$1(void 0, "reka-tooltip-content");
		const { forwardRef, currentElement: triggerElement } = useForwardExpose();
		const isPointerDown = ref(false);
		const hasPointerMoveOpened = ref(false);
		const tooltipListeners = computed(() => {
			if (rootContext.disabled.value) return {};
			return {
				click: handleClick,
				focus: handleFocus,
				pointermove: handlePointerMove,
				pointerleave: handlePointerLeave,
				pointerdown: handlePointerDown,
				blur: handleBlur
			};
		});
		watch(triggerElement, (el) => {
			rootContext.onTriggerChange(el);
		}, { immediate: true });
		function handlePointerUp() {
			setTimeout(() => {
				isPointerDown.value = false;
			}, 1);
		}
		function handlePointerDown() {
			if (rootContext.open && !rootContext.disableClosingTrigger.value) rootContext.onClose();
			isPointerDown.value = true;
			document.addEventListener("pointerup", handlePointerUp, { once: true });
		}
		function handlePointerMove(event) {
			if (event.pointerType === "touch") return;
			if (!hasPointerMoveOpened.value && !providerContext.isPointerInTransitRef.value) {
				rootContext.onTriggerEnter();
				hasPointerMoveOpened.value = true;
			}
		}
		function handlePointerLeave() {
			rootContext.onTriggerLeave();
			hasPointerMoveOpened.value = false;
		}
		function handleFocus(event) {
			if (isPointerDown.value) return;
			if (rootContext.ignoreNonKeyboardFocus.value && !event.target.matches?.(":focus-visible")) return;
			rootContext.onOpen();
		}
		function handleBlur() {
			rootContext.onClose();
		}
		function handleClick() {
			if (!rootContext.disableClosingTrigger.value) rootContext.onClose();
		}
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(PopperAnchor_default), {
				"as-child": "",
				reference: __props.reference ?? unref(triggerElement)
			}, {
				default: withCtx(() => [createVNode(unref(Primitive), mergeProps({
					ref: unref(forwardRef),
					"aria-describedby": unref(rootContext).open.value ? unref(rootContext).contentId : void 0,
					"data-state": unref(rootContext).stateAttribute.value,
					as: __props.as,
					"as-child": props.asChild,
					"data-grace-area-trigger": ""
				}, toHandlers(tooltipListeners.value)), {
					default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
					_: 3
				}, 16, [
					"aria-describedby",
					"data-state",
					"as",
					"as-child"
				])]),
				_: 3
			}, 8, ["reference"]);
		};
	}
});
// ../../../../node_modules/@nuxt/ui/dist/runtime/composables/useKbd.js
var kbdKeysMap = {
	meta: "",
	ctrl: "",
	alt: "",
	win: "⊞",
	command: "⌘",
	shift: "⇧",
	control: "⌃",
	option: "⌥",
	enter: "↵",
	delete: "⌦",
	backspace: "⌫",
	escape: "Esc",
	tab: "⇥",
	capslock: "⇪",
	arrowup: "↑",
	arrowright: "→",
	arrowdown: "↓",
	arrowleft: "←",
	pageup: "⇞",
	pagedown: "⇟",
	home: "↖",
	end: "↘"
};
var kbdKeysPlatformMap = {
	meta: {
		macos: /*@__PURE__*/ (() => kbdKeysMap.command)(),
		other: "Ctrl"
	},
	ctrl: {
		macos: /*@__PURE__*/ (() => kbdKeysMap.control)(),
		other: "Ctrl"
	},
	alt: {
		macos: /*@__PURE__*/ (() => kbdKeysMap.option)(),
		other: "Alt"
	}
};
var _useKbd = () => {
	const macOS = computed(() => typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.match(/Macintosh;/));
	if (macOS.value) document.documentElement.classList.add("ui-macos");
	return { macOS };
};
var useSharedKbd = /*@__PURE__*/ createSharedComposable(_useKbd);
function useKbd() {
	const { macOS } = useSharedKbd();
	const mounted = getCurrentInstance() ? useMounted() : shallowRef(true);
	function getKbdKey(value) {
		if (!value) return;
		if ([
			"meta",
			"alt",
			"ctrl"
		].includes(value)) return mounted.value ? kbdKeysPlatformMap[value][macOS.value ? "macos" : "other"] : " ";
		return kbdKeysMap[value] || value;
	}
	return {
		macOS,
		getKbdKey
	};
}
// ../../../../node_modules/@nuxt/ui/dist/runtime/composables/usePortal.js
var portalTargetInjectionKey = /*@__PURE__*/ Symbol("nuxt-ui.portal-target");
function usePortal(portal) {
	const globalPortal = inject(portalTargetInjectionKey, void 0);
	const value = computed(() => portal.value === true ? globalPortal?.value : portal.value);
	const disabled = computed(() => typeof value.value === "boolean" ? !value.value : false);
	const to = computed(() => typeof value.value === "boolean" ? "body" : value.value);
	return computed(() => ({
		to: to.value,
		disabled: disabled.value
	}));
}
// ../../../../node_modules/@nuxt/ui/dist/runtime/composables/useToast.js
var toastMaxInjectionKey = /*@__PURE__*/ Symbol("nuxt-ui.toast-max");
var ANIMATION_DURATION = 200;
function useToast() {
	const toasts = useState("toasts", () => []);
	const max = inject(toastMaxInjectionKey, void 0);
	const running = ref(false);
	const queue = [];
	const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
	function mergeDuplicate(index, toast) {
		const existing = toasts.value[index];
		const now = Date.now();
		const animating = now - (existing._animatedAt || 0) < ANIMATION_DURATION;
		toasts.value[index] = {
			...existing,
			...toast,
			_duplicate: animating ? existing._duplicate : (existing._duplicate || 0) + 1,
			_animatedAt: animating ? existing._animatedAt : now
		};
	}
	async function processQueue() {
		if (running.value || queue.length === 0) return;
		running.value = true;
		while (queue.length > 0) {
			await nextTick();
			const toast = queue.shift();
			const maxValue = max?.value ?? 5;
			if (maxValue <= 0) {
				if (toasts.value.length) toasts.value = [];
				continue;
			}
			const existingIndex = toasts.value.findIndex((t) => t.id === toast.id);
			if (existingIndex !== -1) {
				mergeDuplicate(existingIndex, toast);
				continue;
			}
			toasts.value = [...toasts.value, {
				...toast,
				_animatedAt: Date.now()
			}].slice(-maxValue);
		}
		running.value = false;
	}
	function add(toast) {
		const body = {
			id: generateId(),
			open: true,
			...toast
		};
		const existingIndex = toasts.value.findIndex((t) => t.id === body.id);
		if (existingIndex !== -1) {
			mergeDuplicate(existingIndex, body);
			return body;
		}
		queue.push(body);
		processQueue();
		return body;
	}
	function update(id, toast) {
		const index = toasts.value.findIndex((t) => t.id === id);
		if (index !== -1) {
			toasts.value[index] = {
				...toasts.value[index],
				...toast,
				duration: toast.duration,
				open: true,
				_updated: true
			};
			nextTick(() => {
				const i = toasts.value.findIndex((t) => t.id === id);
				if (i !== -1 && toasts.value[i]._updated) toasts.value[i] = {
					...toasts.value[i],
					_updated: void 0
				};
			});
		}
	}
	function remove(id) {
		const index = toasts.value.findIndex((t) => t.id === id);
		if (index !== -1 && toasts.value[index]._updated) return;
		if (index !== -1) toasts.value[index] = {
			...toasts.value[index],
			open: false
		};
		setTimeout(() => {
			toasts.value = toasts.value.filter((t) => t.id !== id);
		}, 200);
	}
	function clear() {
		toasts.value = [];
	}
	return {
		toasts,
		add,
		update,
		remove,
		clear
	};
}
// ../../../../node_modules/@nuxt/ui/dist/runtime/utils/prefetch.js
function requestIdleCallback(callback) {
	if (typeof window === "undefined") return;
	if (typeof window.requestIdleCallback === "function") return window.requestIdleCallback(callback);
	return setTimeout(callback, 1);
}
function cancelIdleCallback(handle) {
	if (typeof window === "undefined" || handle === void 0) return;
	if (typeof window.cancelIdleCallback === "function") {
		window.cancelIdleCallback(handle);
		return;
	}
	clearTimeout(handle);
}
// virtual:nuxt-ui-templates/ui/toaster.ts
var toaster_default = {
	"slots": {
		"viewport": "fixed flex flex-col w-[calc(100%-2rem)] sm:w-96 z-[100] data-[expanded=true]:h-(--height) focus:outline-none",
		"base": "pointer-events-auto absolute inset-x-0 z-(--index) transform-(--transform) data-[collapsed=true]:data-[front=false]:h-(--front-height) data-[collapsed=true]:data-[front=false]:*:opacity-0 data-[front=false]:*:transition-opacity data-[front=false]:*:duration-100 data-[state=closed]:animate-[toast-closed_200ms_var(--ease-out)] data-[state=closed]:data-[collapsed=true]:data-[front=false]:animate-[toast-collapsed-closed_200ms_var(--ease-out)] motion-safe:data-[state=open]:data-[pulsing=odd]:animate-[toast-pulse-a_200ms_var(--ease-out)] motion-safe:data-[state=open]:data-[pulsing=even]:animate-[toast-pulse-b_200ms_var(--ease-out)] data-[swipe=move]:transition-none transition-[transform,translate,height] duration-200 ease-out motion-reduce:transition-none"
	},
	"variants": {
		"position": {
			"top-left": { "viewport": "left-4" },
			"top-center": { "viewport": "left-1/2 transform -translate-x-1/2" },
			"top-right": { "viewport": "right-4" },
			"bottom-left": { "viewport": "left-4" },
			"bottom-center": { "viewport": "left-1/2 transform -translate-x-1/2" },
			"bottom-right": { "viewport": "right-4" }
		},
		"swipeDirection": {
			"up": "data-[swipe=end]:animate-[toast-slide-up_200ms_var(--ease-out)]",
			"right": "data-[swipe=end]:animate-[toast-slide-right_200ms_var(--ease-out)]",
			"down": "data-[swipe=end]:animate-[toast-slide-down_200ms_var(--ease-out)]",
			"left": "data-[swipe=end]:animate-[toast-slide-left_200ms_var(--ease-out)]"
		}
	},
	"compoundVariants": [
		{
			"position": [
				"top-left",
				"top-center",
				"top-right"
			],
			"class": {
				"viewport": "top-4",
				"base": "top-0 data-[state=open]:animate-[toast-slide-in-from-top_200ms_var(--ease-out)]"
			}
		},
		{
			"position": [
				"bottom-left",
				"bottom-center",
				"bottom-right"
			],
			"class": {
				"viewport": "bottom-4",
				"base": "bottom-0 data-[state=open]:animate-[toast-slide-in-from-bottom_200ms_var(--ease-out)]"
			}
		},
		{
			"swipeDirection": ["left", "right"],
			"class": "data-[swipe=move]:translate-x-(--reka-toast-swipe-move-x) data-[swipe=end]:translate-x-(--reka-toast-swipe-end-x) data-[swipe=cancel]:translate-x-0"
		},
		{
			"swipeDirection": ["up", "down"],
			"class": "data-[swipe=move]:translate-y-(--reka-toast-swipe-move-y) data-[swipe=end]:translate-y-(--reka-toast-swipe-end-y) data-[swipe=cancel]:translate-y-0"
		}
	],
	"defaultVariants": { "position": "bottom-right" }
};
// ../../../../node_modules/@nuxt/ui/dist/runtime/components/Toaster.vue
var _sfc_main$13 = /*@__PURE__*/ Object.assign({ name: "Toaster" }, { inheritAttrs: false }, {
	props: {
		position: {
			type: null,
			required: false
		},
		expand: {
			type: Boolean,
			required: false,
			default: true
		},
		progress: {
			type: Boolean,
			required: false,
			default: true
		},
		portal: {
			type: [Boolean, String],
			required: false,
			skipCheck: true,
			default: true
		},
		max: {
			type: Number,
			required: false,
			default: 5
		},
		class: {
			type: null,
			required: false
		},
		ui: {
			type: Object,
			required: false
		},
		label: {
			type: String,
			required: false
		},
		duration: {
			type: Number,
			required: false,
			default: 5e3
		},
		disableSwipe: {
			type: Boolean,
			required: false
		},
		swipeThreshold: {
			type: Number,
			required: false
		}
	},
	setup(__props, { expose: __expose }) {
		__expose();
		const _props = __props;
		const props = useComponentProps("toaster", _props);
		const loadToast = () => import("./Toast.js");
		const UToast = defineAsyncComponent(loadToast);
		let idleId;
		onMounted(() => {
			idleId = requestIdleCallback(() => {
				loadToast().catch(() => {});
			});
		});
		onBeforeUnmount(() => {
			cancelIdleCallback(idleId);
		});
		const { toasts, remove } = useToast();
		const { t } = useLocale();
		const appConfig = useAppConfig();
		provide(toastMaxInjectionKey, toRef(() => props.max));
		const providerProps = useForwardProps$1(reactivePick(props, "duration", "swipeThreshold", "disableSwipe"));
		const portalProps = usePortal(toRef(() => props.portal));
		const swipeDirection = computed(() => {
			switch (props.position) {
				case "top-center": return "up";
				case "top-right":
				case "bottom-right": return "right";
				case "bottom-center": return "down";
				case "top-left":
				case "bottom-left": return "left";
			}
			return "right";
		});
		const ui = computed(() => tv({
			extend: toaster_default,
			...appConfig.ui?.toaster || {}
		})({
			position: props.position,
			swipeDirection: swipeDirection.value
		}));
		function onUpdateOpen(value, id) {
			if (value) return;
			remove(id);
		}
		const hovered = ref(false);
		const expanded = computed(() => props.expand || hovered.value);
		const refs = ref([]);
		const height = computed(() => refs.value.reduce((acc, { height: height2 }) => acc + height2 + 16, 0));
		const frontHeight = computed(() => refs.value[refs.value.length - 1]?.height || 0);
		function getOffset(index) {
			return refs.value.slice(index + 1).reduce((acc, { height: height2 }) => acc + height2 + 16, 0);
		}
		const __returned__ = {
			_props,
			props,
			loadToast,
			UToast,
			get idleId() {
				return idleId;
			},
			set idleId(v) {
				idleId = v;
			},
			toasts,
			remove,
			t,
			appConfig,
			providerProps,
			portalProps,
			swipeDirection,
			ui,
			onUpdateOpen,
			hovered,
			expanded,
			refs,
			height,
			frontHeight,
			getOffset,
			get theme() {
				return toaster_default;
			},
			ref,
			computed,
			defineAsyncComponent,
			toRef,
			provide,
			onMounted,
			onBeforeUnmount,
			get ToastProvider() {
				return ToastProvider_default;
			},
			get ToastViewport() {
				return ToastViewport_default;
			},
			get ToastPortal() {
				return ToastPortal_default;
			},
			get reactivePick() {
				return reactivePick;
			},
			get useAppConfig() {
				return useAppConfig;
			},
			get useComponentProps() {
				return useComponentProps;
			},
			get useForwardProps() {
				return useForwardProps$1;
			},
			get useLocale() {
				return useLocale;
			},
			get useToast() {
				return useToast;
			},
			get toastMaxInjectionKey() {
				return toastMaxInjectionKey;
			},
			get usePortal() {
				return usePortal;
			},
			get omit() {
				return omit;
			},
			get requestIdleCallback() {
				return requestIdleCallback;
			},
			get cancelIdleCallback() {
				return cancelIdleCallback;
			},
			get tv() {
				return tv;
			}
		};
		Object.defineProperty(__returned__, "__isScriptSetup", {
			enumerable: false,
			value: true
		});
		return __returned__;
	}
});
function _sfc_render$23(_ctx, _cache, $props, $setup, $data, $options) {
	return openBlock(), createBlock($setup["ToastProvider"], mergeProps({
		"swipe-direction": $setup.swipeDirection,
		label: $setup.props.label ?? $setup.t("toaster.label")
	}, $setup.providerProps), {
		default: withCtx(() => [
			renderSlot(_ctx.$slots, "default"),
			(openBlock(true), createElementBlock(Fragment, null, renderList($setup.toasts, (toast, index) => {
				return openBlock(), createBlock($setup["UToast"], mergeProps({
					key: toast.id,
					ref_for: true,
					ref: "refs",
					progress: $setup.props.progress
				}, { ref_for: true }, $setup.omit(toast, [
					"id",
					"close",
					"_duplicate",
					"_updated",
					"_animatedAt",
					"onClick"
				]), {
					close: toast.close,
					"data-collapsed": !$setup.expanded,
					"data-front": !$setup.expanded && index === $setup.toasts.length - 1,
					"data-pulsing": toast._duplicate ? toast._duplicate % 2 === 0 ? "even" : "odd" : void 0,
					style: {
						"--index": index - $setup.toasts.length + $setup.toasts.length,
						"--before": $setup.toasts.length - 1 - index,
						"--offset": $setup.getOffset(index),
						"--scale": $setup.expanded ? "1" : "calc(1 - var(--before) * var(--scale-factor))",
						"--translate": $setup.expanded ? "calc(var(--offset) * var(--translate-factor))" : "calc(var(--before) * var(--gap))",
						"--transform": "translateY(var(--translate)) scale(var(--scale))"
					},
					"data-slot": "base",
					class: $setup.ui.base({ class: [$setup.props.ui?.base, toast.onClick ? "cursor-pointer" : void 0] }),
					"onUpdate:open": ($event) => $setup.onUpdateOpen($event, toast.id),
					onClick: ($event) => toast.onClick && toast.onClick(toast)
				}), null, 16, [
					"progress",
					"close",
					"data-collapsed",
					"data-front",
					"data-pulsing",
					"style",
					"class",
					"onUpdate:open",
					"onClick"
				]);
			}), 128)),
			createVNode($setup["ToastPortal"], normalizeProps(guardReactiveProps($setup.portalProps)), {
				default: withCtx(() => [createVNode($setup["ToastViewport"], {
					label: $setup.t("toaster.viewport"),
					"data-expanded": $setup.expanded,
					"data-slot": "viewport",
					class: normalizeClass($setup.ui.viewport({ class: [$setup.props.ui?.viewport, $setup.props.class] })),
					style: normalizeStyle({
						"--scale-factor": "0.05",
						"--translate-factor": $setup.props.position?.startsWith("top") ? "1px" : "-1px",
						"--gap": $setup.props.position?.startsWith("top") ? "16px" : "-16px",
						"--front-height": `${$setup.frontHeight}px`,
						"--height": `${$setup.height}px`
					}),
					onMouseenter: _cache[0] || (_cache[0] = ($event) => $setup.hovered = true),
					onMouseleave: _cache[1] || (_cache[1] = ($event) => $setup.hovered = false)
				}, null, 8, [
					"label",
					"data-expanded",
					"class",
					"style"
				])]),
				_: 1
			}, 16)
		]),
		_: 3
	}, 16, ["swipe-direction", "label"]);
}
var Toaster_default = /*@__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$13, [["render", _sfc_render$23], ["__file", "Toaster.vue"]]);
// ../../../../node_modules/@nuxt/ui/dist/runtime/composables/useOverlay.js
function _useOverlay() {
	const overlays = shallowReactive([]);
	const create = (component, _options) => {
		const { props, defaultOpen, destroyOnClose } = _options || {};
		const options = reactive({
			id: Symbol(import.meta.dev ? "useOverlay" : ""),
			isOpen: !!defaultOpen,
			component: markRaw(component),
			isMounted: !!defaultOpen,
			destroyOnClose: !!destroyOnClose,
			originalProps: props || {},
			props: { ...props },
			resolvers: []
		});
		overlays.push(options);
		return {
			...options,
			open: (props2) => open(options.id, props2),
			close: (value) => close(options.id, value),
			patch: (props2) => patch(options.id, props2)
		};
	};
	const open = (id, props) => {
		const overlay = getOverlay(id);
		if (props) overlay.props = {
			...overlay.originalProps,
			...props
		};
		else overlay.props = { ...overlay.originalProps };
		overlay.isOpen = true;
		overlay.isMounted = true;
		const result = new Promise((resolve) => overlay.resolvers.push(resolve));
		return Object.assign(result, {
			id,
			isMounted: overlay.isMounted,
			isOpen: overlay.isOpen,
			result
		});
	};
	const close = (id, value) => {
		const overlay = getOverlay(id);
		overlay.isOpen = false;
		for (const resolve of overlay.resolvers.splice(0)) resolve(value);
	};
	const closeAll = () => {
		overlays.forEach((overlay) => close(overlay.id));
	};
	const unmount = (id) => {
		const overlay = getOverlay(id);
		overlay.isMounted = false;
		if (overlay.destroyOnClose) {
			const index = overlays.findIndex((overlay2) => overlay2.id === id);
			overlays.splice(index, 1);
		}
	};
	const patch = (id, props) => {
		const overlay = getOverlay(id);
		overlay.props = {
			...overlay.props,
			...props
		};
	};
	const getOverlay = (id) => {
		const overlay = overlays.find((overlay2) => overlay2.id === id);
		if (!overlay) throw new Error("Overlay not found");
		return overlay;
	};
	const isOpen = (id) => {
		return getOverlay(id).isOpen;
	};
	return {
		overlays,
		open,
		close,
		closeAll,
		create,
		patch,
		unmount,
		isOpen
	};
}
var useOverlay = /*@__PURE__*/ createSharedComposable(_useOverlay);
// ../../../../node_modules/@nuxt/ui/dist/runtime/components/OverlayProvider.vue
var _sfc_main$12 = {
	__name: "OverlayProvider",
	setup(__props, { expose: __expose }) {
		__expose();
		const { overlays, unmount, close } = useOverlay();
		const mountedOverlays = computed(() => overlays.filter((overlay) => overlay.isMounted));
		const onAfterLeave = (id) => {
			close(id);
			unmount(id);
		};
		const onClose = (id, value) => {
			close(id, value);
		};
		const __returned__ = {
			overlays,
			unmount,
			close,
			mountedOverlays,
			onAfterLeave,
			onClose,
			computed,
			get useOverlay() {
				return useOverlay;
			}
		};
		Object.defineProperty(__returned__, "__isScriptSetup", {
			enumerable: false,
			value: true
		});
		return __returned__;
	}
};
function _sfc_render$22(_ctx, _cache, $props, $setup, $data, $options) {
	return openBlock(true), createElementBlock(Fragment, null, renderList($setup.mountedOverlays, (overlay) => {
		return openBlock(), createBlock(resolveDynamicComponent(overlay.component), mergeProps({ key: overlay.id }, { ref_for: true }, overlay.props, {
			open: overlay.isOpen,
			"onUpdate:open": ($event) => overlay.isOpen = $event,
			onClose: (value) => $setup.onClose(overlay.id, value),
			"onAfter:leave": ($event) => $setup.onAfterLeave(overlay.id)
		}), null, 16, [
			"open",
			"onUpdate:open",
			"onClose",
			"onAfter:leave"
		]);
	}), 128);
}
var OverlayProvider_default = /*@__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$12, [["render", _sfc_render$22], ["__file", "OverlayProvider.vue"]]);
// ../../../../node_modules/@nuxt/ui/dist/runtime/components/App.vue
var _sfc_main$11 = /*@__PURE__*/ Object.assign({ name: "App" }, {
	props: {
		tooltip: {
			type: Object,
			required: false
		},
		toaster: {
			type: [Object, null],
			required: false
		},
		locale: {
			type: Object,
			required: false
		},
		portal: {
			type: [Boolean, String],
			required: false,
			skipCheck: true,
			default: "body"
		},
		dir: {
			type: String,
			required: false
		},
		scrollBody: {
			type: [Boolean, Object],
			required: false
		},
		nonce: {
			type: String,
			required: false
		}
	},
	setup(__props, { expose: __expose }) {
		__expose();
		const props = __props;
		const configProviderProps = useForwardProps(reactivePick(props, "scrollBody", "nonce"));
		const tooltipProps = toRef(() => props.tooltip);
		const toasterProps = toRef(() => props.toaster);
		const parentLocale = inject(localeContextInjectionKey, void 0);
		const locale = toRef(() => {
			const value = props.locale || parentLocale?.value;
			return props.dir ? {
				...value || en_default,
				dir: props.dir
			} : value;
		});
		provide(localeContextInjectionKey, locale);
		const portal = toRef(() => props.portal);
		provide(portalTargetInjectionKey, portal);
		const __returned__ = {
			props,
			configProviderProps,
			tooltipProps,
			toasterProps,
			parentLocale,
			locale,
			portal,
			toRef,
			useId,
			inject,
			provide,
			get ConfigProvider() {
				return ConfigProvider_default;
			},
			get TooltipProvider() {
				return TooltipProvider_default;
			},
			get useForwardProps() {
				return useForwardProps;
			},
			get reactivePick() {
				return reactivePick;
			},
			get localeContextInjectionKey() {
				return localeContextInjectionKey;
			},
			get portalTargetInjectionKey() {
				return portalTargetInjectionKey;
			},
			UToaster: Toaster_default,
			UOverlayProvider: OverlayProvider_default,
			get en() {
				return en_default;
			}
		};
		Object.defineProperty(__returned__, "__isScriptSetup", {
			enumerable: false,
			value: true
		});
		return __returned__;
	}
});
function _sfc_render$21(_ctx, _cache, $props, $setup, $data, $options) {
	return openBlock(), createBlock($setup["ConfigProvider"], mergeProps({
		"use-id": () => $setup.useId(),
		dir: $setup.props.dir || $setup.locale?.dir,
		locale: $setup.locale?.code
	}, $setup.configProviderProps), {
		default: withCtx(() => [createVNode($setup["TooltipProvider"], normalizeProps(guardReactiveProps($setup.tooltipProps)), {
			default: withCtx(() => [$props.toaster !== null ? (openBlock(), createBlock($setup["UToaster"], normalizeProps(mergeProps({ key: 0 }, $setup.toasterProps)), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16)) : renderSlot(_ctx.$slots, "default", {}, void 0, void 0, 1), createVNode($setup["UOverlayProvider"])]),
			_: 3
		}, 16)]),
		_: 3
	}, 16, [
		"use-id",
		"dir",
		"locale"
	]);
}
var App_default = /*@__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$11, [["render", _sfc_render$21], ["__file", "App.vue"]]);
// virtual:nuxt-ui-templates/ui/editor.ts
var editor_default = {
	"slots": {
		"root": "",
		"content": "relative size-full flex-1",
		"base": [
			"w-full outline-none *:my-5 *:first:mt-0 *:last:mb-0 sm:px-8 selection:bg-primary/20",
			"[&_p]:leading-7",
			"[&_a]:text-primary [&_a]:border-b [&_a]:border-transparent [&_a]:hover:border-primary [&_a]:focus-visible:border-transparent [&_a]:font-medium [&_a]:focus-visible:rounded-xs [&_a]:outline-primary/25 [&_a]:focus-visible:outline-3 [&_a:has(>code)]:focus-visible:outline-0",
			"[&_a]:transition-colors",
			"[&_a:has(>code)]:border-b-0 [&_a>code]:border-dashed [&_a>code]:outline-primary/25 [&_a:focus-visible>code]:outline-3 [&_a:hover>code]:border-primary [&_a:hover>code]:text-primary [&_a:focus-visible>code]:border-primary [&_a:focus-visible>code]:text-primary",
			"[&_a>code]:transition-colors",
			"[&_.mention]:text-primary [&_.mention]:font-medium",
			"[&_:is(h1,h2,h3,h4,h5,h6)]:text-highlighted [&_:is(h1,h2,h3,h4,h5,h6)]:font-bold",
			"[&_h1]:text-3xl",
			"[&_h2]:text-2xl",
			"[&_h3]:text-xl",
			"[&_h4]:text-lg",
			"[&_h5]:text-base",
			"[&_h6]:text-base",
			"[&_:is(h1,h2,h3,h4,h5,h6)>code]:border-dashed [&_:is(h1,h2,h3,h4,h5,h6)>code]:font-bold",
			"[&_h2>code]:text-xl/6",
			"[&_h3>code]:text-lg/5",
			"[&_blockquote]:border-s-4 [&_blockquote]:border-accented [&_blockquote]:ps-4 [&_blockquote]:italic",
			"[&_[data-type=horizontalRule]]:my-8 [&_[data-type=horizontalRule]]:py-2",
			"[&_hr]:border-t [&_hr]:border-default",
			"[&_pre]:text-sm/6 [&_pre]:border [&_pre]:border-muted [&_pre]:bg-muted [&_pre]:rounded-md [&_pre]:px-4 [&_pre]:py-3 [&_pre]:whitespace-pre-wrap [&_pre]:wrap-break-word [&_pre]:overflow-x-auto",
			"[&_pre_code]:p-0 [&_pre_code]:text-inherit [&_pre_code]:rounded-none [&_pre_code]:inline [&_pre_code]:border-0 [&_pre_code]:bg-transparent",
			"[&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_code]:font-mono [&_code]:font-medium [&_code]:rounded-md [&_code]:inline-block [&_code]:border [&_code]:border-muted [&_code]:text-highlighted [&_code]:bg-muted",
			"[&_:is(ul,ol)]:ps-6",
			"[&_ul]:list-disc [&_ul]:marker:text-(--ui-border-accented)",
			"[&_ol]:list-decimal [&_ol]:marker:text-muted",
			"[&_li]:my-1.5 [&_li]:ps-1.5",
			"[&_img]:rounded-md [&_img]:block [&_img]:max-w-full [&_img.ProseMirror-selectednode]:outline-2 [&_img.ProseMirror-selectednode]:outline-primary",
			"[&_.ProseMirror-selectednode:not(img):not(pre):not([data-node-view-wrapper])]:bg-primary/20"
		]
	},
	"variants": { "placeholderMode": {
		"firstLine": { "base": "[&_:is(p,h1,h2,h3,h4,h5,h6).is-editor-empty:first-child]:before:content-[attr(data-placeholder)] [&_:is(p,h1,h2,h3,h4,h5,h6).is-editor-empty:first-child]:before:text-dimmed [&_:is(p,h1,h2,h3,h4,h5,h6).is-editor-empty:first-child]:before:float-start [&_:is(p,h1,h2,h3,h4,h5,h6).is-editor-empty:first-child]:before:h-0 [&_:is(p,h1,h2,h3,h4,h5,h6).is-editor-empty:first-child]:before:pointer-events-none" },
		"everyLine": { "base": "[&_:is(p,h1,h2,h3,h4,h5,h6).is-empty]:before:content-[attr(data-placeholder)] [&_:is(p,h1,h2,h3,h4,h5,h6).is-empty]:before:text-dimmed [&_:is(p,h1,h2,h3,h4,h5,h6).is-empty]:before:float-start [&_:is(p,h1,h2,h3,h4,h5,h6).is-empty]:before:h-0 [&_:is(p,h1,h2,h3,h4,h5,h6).is-empty]:before:pointer-events-none" }
	} },
	"defaultVariants": { "placeholderMode": "everyLine" }
};
// ../../../../node_modules/@nuxt/ui/dist/runtime/components/Editor.vue
var _sfc_main$10 = /*@__PURE__*/ Object.assign({ inheritAttrs: false }, {
	__name: "Editor",
	props: {
		as: {
			type: null,
			required: false
		},
		modelValue: {
			type: null,
			required: false
		},
		contentType: {
			type: String,
			required: false
		},
		starterKit: {
			type: [Boolean, Object],
			required: false,
			default: true
		},
		placeholder: {
			type: [String, Object],
			required: false
		},
		markdown: {
			type: Object,
			required: false
		},
		image: {
			type: [Boolean, Object],
			required: false,
			default: true
		},
		mention: {
			type: [Boolean, Object],
			required: false,
			default: true
		},
		handlers: {
			type: null,
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
		extensions: {
			type: Array,
			required: false
		},
		injectCSS: {
			type: Boolean,
			required: false
		},
		injectNonce: {
			type: null,
			required: false
		},
		autofocus: {
			type: [
				String,
				Number,
				Boolean,
				null
			],
			required: false
		},
		editable: {
			type: Boolean,
			required: false
		},
		textDirection: {
			type: String,
			required: false
		},
		editorProps: {
			type: Object,
			required: false
		},
		parseOptions: {
			type: Object,
			required: false
		},
		coreExtensionOptions: {
			type: Object,
			required: false
		},
		enableInputRules: {
			type: [Array, Boolean],
			required: false
		},
		enablePasteRules: {
			type: [Array, Boolean],
			required: false
		},
		enableCoreExtensions: {
			type: [Boolean, Object],
			required: false
		},
		enableContentCheck: {
			type: Boolean,
			required: false
		},
		emitContentError: {
			type: Boolean,
			required: false
		},
		onBeforeCreate: {
			type: Function,
			required: false
		},
		onCreate: {
			type: Function,
			required: false
		},
		onMount: {
			type: Function,
			required: false
		},
		onUnmount: {
			type: Function,
			required: false
		},
		onContentError: {
			type: Function,
			required: false
		},
		onUpdate: {
			type: Function,
			required: false
		},
		onSelectionUpdate: {
			type: Function,
			required: false
		},
		onTransaction: {
			type: Function,
			required: false
		},
		onFocus: {
			type: Function,
			required: false
		},
		onBlur: {
			type: Function,
			required: false
		},
		onDestroy: {
			type: Function,
			required: false
		},
		onPaste: {
			type: Function,
			required: false
		},
		onDrop: {
			type: Function,
			required: false
		},
		onDelete: {
			type: Function,
			required: false
		},
		enableExtensionDispatchTransaction: {
			type: Boolean,
			required: false
		}
	},
	emits: ["update:modelValue"],
	setup(__props, { expose: __expose, emit: __emit }) {
		const _props = __props;
		const emits = __emit;
		const props = useComponentProps("editor", _props);
		const attrs = useAttrs();
		const appConfig = useAppConfig();
		const ui = computed(() => tv({
			extend: editor_default,
			...appConfig.ui?.editor || {}
		})({ placeholderMode: typeof props.placeholder === "object" ? props.placeholder.mode : void 0 }));
		const rootProps = useForwardProps$1(reactiveOmit(props, "starterKit", "extensions", "editorProps", "contentType", "class", "placeholder", "markdown", "image", "mention", "handlers"));
		const editorProps = computed(() => defu(props.editorProps, { attributes: {
			autocomplete: "off",
			autocorrect: "off",
			autocapitalize: "off",
			...omit(attrs, ["data-slot"]),
			class: ui.value.base({ class: props.ui?.base })
		} }));
		const contentType = computed(() => props.contentType || (typeof props.modelValue === "string" ? "html" : "json"));
		const starterKit = computed(() => {
			const options = typeof props.starterKit === "boolean" ? {} : props.starterKit ?? {};
			const plainText = props.starterKit === false ? {
				blockquote: false,
				bold: false,
				bulletList: false,
				code: false,
				codeBlock: false,
				dropcursor: false,
				gapcursor: false,
				heading: false,
				horizontalRule: false,
				italic: false,
				listItem: false,
				listKeymap: false,
				link: false,
				orderedList: false,
				strike: false,
				underline: false,
				trailingNode: false
			} : {};
			return defu(options, plainText, {
				code: false,
				horizontalRule: false,
				dropcursor: {
					color: "var(--ui-primary)",
					width: 2
				},
				link: { openOnClick: false }
			});
		});
		const placeholder = computed(() => {
			const { mode, ...rest } = (typeof props.placeholder === "string" ? { placeholder: props.placeholder } : props.placeholder) || {};
			return defu(rest, {
				showOnlyWhenEditable: false,
				showOnlyCurrent: true
			});
		});
		const markdown = computed(() => defu(props.markdown, { markedOptions: { gfm: true } }));
		const image = computed(() => typeof props.image === "boolean" ? {} : props.image);
		const mention = computed(() => defu(typeof props.mention === "boolean" ? {} : props.mention, {
			HTMLAttributes: { class: "mention" },
			renderText({ node }) {
				return `${node.attrs.mentionSuggestionChar ?? "@"}${node.attrs.label ?? node.attrs.id}`;
			},
			renderHTML({ options, node }) {
				return [
					"span",
					mergeAttributes({ "data-type": "mention" }, options.HTMLAttributes),
					`${node.attrs.mentionSuggestionChar ?? "@"}${node.attrs.label ?? node.attrs.id}`
				];
			}
		}));
		const extensions = computed(() => [
			contentType.value === "markdown" && Markdown.configure(markdown.value),
			StarterKit.configure(starterKit.value),
			props.starterKit !== false && Code.extend({ excludes: "code" }),
			props.starterKit !== false && HorizontalRule.extend({ renderHTML() {
				return [
					"div",
					mergeAttributes(this.options.HTMLAttributes, { "data-type": this.name }),
					["hr"]
				];
			} }),
			props.image !== false && Image.configure(image.value),
			props.mention !== false && Mention.configure(mention.value),
			props.placeholder && Placeholder.configure(placeholder.value),
			...props.extensions || []
		].filter((extension) => !!extension));
		const editor = useEditor({
			...rootProps.value,
			content: props.modelValue,
			contentType: contentType.value,
			extensions: extensions.value,
			editorProps: editorProps.value,
			onCreate: ({ editor: editor2 }) => {
				if (props.placeholder) editor2.view.dispatch(editor2.state.tr);
			},
			onUpdate: ({ editor: editor2, transaction, appendedTransactions }) => {
				if (!transaction.docChanged && !appendedTransactions.some((tr) => tr.docChanged)) return;
				let value;
				try {
					if (contentType.value === "html") value = editor2.getHTML();
					else if (contentType.value === "json") value = editor2.getJSON();
					else if (contentType.value === "markdown") value = editor2.getMarkdown();
				} catch (error) {
					value = editor2.getText();
				}
				emits("update:modelValue", value);
			}
		});
		watch(() => props.modelValue, (newVal) => {
			if (!editor.value || newVal == null) return;
			if ((contentType.value === "html" ? editor.value.getHTML() : contentType.value === "json" ? JSON.stringify(editor.value.getJSON()) : contentType.value === "markdown" ? editor.value.getMarkdown() : editor.value.getText()) !== (contentType.value === "json" && typeof newVal === "object" ? JSON.stringify(newVal) : String(newVal))) {
				const currentPos = editor.value.state.selection.from;
				editor.value.commands.setContent(newVal, { contentType: contentType.value });
				if (currentPos <= editor.value.state.doc.content.size) editor.value.commands.setTextSelection(currentPos);
			}
		});
		const handlers = computed(() => ({
			...createHandlers(),
			...props.handlers
		}));
		provide("editorHandlers", handlers);
		__expose({ editor });
		const __returned__ = {
			_props,
			emits,
			props,
			attrs,
			appConfig,
			ui,
			rootProps,
			editorProps,
			contentType,
			starterKit,
			placeholder,
			markdown,
			image,
			mention,
			extensions,
			editor,
			handlers,
			get theme() {
				return editor_default;
			},
			computed,
			provide,
			useAttrs,
			watch,
			get defu() {
				return defu;
			},
			get Primitive() {
				return Primitive;
			},
			get mergeAttributes() {
				return mergeAttributes;
			},
			get Code() {
				return Code;
			},
			get HorizontalRule() {
				return HorizontalRule;
			},
			get Image() {
				return Image;
			},
			get Mention() {
				return Mention;
			},
			get Placeholder() {
				return Placeholder;
			},
			get Markdown() {
				return Markdown;
			},
			get StarterKit() {
				return StarterKit;
			},
			get useEditor() {
				return useEditor;
			},
			get EditorContent() {
				return EditorContent;
			},
			get reactiveOmit() {
				return reactiveOmit;
			},
			get useAppConfig() {
				return useAppConfig;
			},
			get useComponentProps() {
				return useComponentProps;
			},
			get useForwardProps() {
				return useForwardProps$1;
			},
			get omit() {
				return omit;
			},
			get createHandlers() {
				return createHandlers;
			},
			get tv() {
				return tv;
			}
		};
		Object.defineProperty(__returned__, "__isScriptSetup", {
			enumerable: false,
			value: true
		});
		return __returned__;
	}
});
function _sfc_render$20(_ctx, _cache, $props, $setup, $data, $options) {
	return openBlock(), createBlock($setup["Primitive"], {
		as: $setup.props.as,
		"data-slot": _ctx.$attrs["data-slot"] ?? "root",
		class: normalizeClass($setup.ui.root({ class: [$setup.props.ui?.root, $setup.props.class] }))
	}, {
		default: withCtx(() => [$setup.editor ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [renderSlot(_ctx.$slots, "default", {
			editor: $setup.editor,
			handlers: $setup.handlers
		}), createVNode($setup["EditorContent"], {
			role: "presentation",
			editor: $setup.editor,
			"data-slot": "content",
			class: normalizeClass($setup.ui.content({ class: $setup.props.ui?.content }))
		}, null, 8, ["editor", "class"])], 64)) : createCommentVNode("", true)]),
		_: 3
	}, 8, [
		"as",
		"data-slot",
		"class"
	]);
}
var Editor_default = /*@__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$10, [["render", _sfc_render$20], ["__file", "Editor.vue"]]);
// src/composable/nuxt-editor/useLinkAutoSelect.ts
function useLinkAutoSelect() {
	function bind(editor) {
		editor.view.dom.addEventListener("mouseup", () => {
			let tries = 0;
			const tick = () => {
				if (!editor.state.selection.empty || !editor.isActive("link")) return;
				const el = editor.view.dom.getRootNode().querySelector("[data-link-bar] input") ?? document.querySelector("[data-link-bar] input");
				if (el) {
					el.focus();
					el.select();
				} else if (++tries < 15) setTimeout(tick, 50);
			};
			setTimeout(tick, 50);
		});
	}
	return { bind };
}
// ../../../../node_modules/@nuxt/ui/dist/runtime/composables/useFilter.js
function useFilter() {
	const { contains, startsWith } = useFilter$1({ sensitivity: "base" });
	function score(value, searchTerm) {
		if (!contains(value, searchTerm)) return null;
		if (contains(searchTerm, value)) return 0;
		if (startsWith(value, searchTerm)) return 1;
		return 2;
	}
	function scoreItem(item, searchTerm, fields) {
		if (typeof item !== "object" || item === null) return score(String(item), searchTerm);
		let bestScore = null;
		for (const field of fields) {
			const value = get(item, field);
			if (value == null) continue;
			const values = Array.isArray(value) ? value.map(String) : [String(value)];
			for (const v of values) {
				const s = score(v, searchTerm);
				if (s !== null && (bestScore === null || s < bestScore)) bestScore = s;
				if (bestScore === 0) return 0;
			}
		}
		return bestScore;
	}
	function filter(items, searchTerm, fields) {
		if (!searchTerm) return items;
		const scored = [];
		for (const item of items) {
			const s = scoreItem(item, searchTerm, fields);
			if (s !== null) scored.push({
				item,
				score: s
			});
		}
		scored.sort((a, b) => a.score - b.score);
		return scored.map(({ item }) => item);
	}
	function filterGroups(groups, searchTerm, options) {
		if (!searchTerm) return groups;
		return groups.map((group) => {
			const result = [];
			for (const item of group) {
				if (item === void 0 || item === null) continue;
				if (options.isStructural?.(item)) {
					result.push({
						item,
						score: -1
					});
					continue;
				}
				const s = scoreItem(item, searchTerm, options.fields);
				if (s !== null) result.push({
					item,
					score: s
				});
			}
			let start = 0;
			for (let i = 0; i <= result.length; i++) if (i === result.length || result[i].score === -1) {
				result.splice(start, i - start, ...result.slice(start, i).sort((a, b) => a.score - b.score));
				start = i + 1;
			}
			return result.map(({ item }) => item);
		}).filter((group) => group.some((item) => !options.isStructural?.(item)));
	}
	return {
		score,
		scoreItem,
		filter,
		filterGroups
	};
}
// virtual:nuxt-ui-templates/ui/input.ts
var input_default = {
	"slots": {
		"root": "relative inline-flex items-center",
		"base": ["w-full rounded-md border-0 appearance-none placeholder:text-dimmed disabled:cursor-not-allowed disabled:opacity-75", "transition-colors"],
		"leading": "absolute inset-y-0 start-0 flex items-center",
		"leadingIcon": "shrink-0 text-dimmed",
		"leadingAvatar": "shrink-0",
		"leadingAvatarSize": "",
		"trailing": "absolute inset-y-0 end-0 flex items-center",
		"trailingIcon": "shrink-0 text-dimmed"
	},
	"variants": {
		"fieldGroup": {
			"horizontal": {
				"root": "group has-focus-visible:z-[1]",
				"base": "group-not-only:group-first:rounded-e-none group-not-only:group-last:rounded-s-none group-not-last:group-not-first:rounded-none"
			},
			"vertical": {
				"root": "group has-focus-visible:z-[1]",
				"base": "group-not-only:group-first:rounded-b-none group-not-only:group-last:rounded-t-none group-not-last:group-not-first:rounded-none"
			}
		},
		"size": {
			"xs": {
				"base": "px-2 py-1 text-sm/4 gap-1",
				"leading": "ps-2",
				"trailing": "pe-2",
				"leadingIcon": "size-4",
				"leadingAvatarSize": "3xs",
				"trailingIcon": "size-4"
			},
			"sm": {
				"base": "px-2.5 py-1.5 text-sm/4 gap-1.5",
				"leading": "ps-2.5",
				"trailing": "pe-2.5",
				"leadingIcon": "size-4",
				"leadingAvatarSize": "3xs",
				"trailingIcon": "size-4"
			},
			"md": {
				"base": "px-2.5 py-1.5 text-base/5 gap-1.5",
				"leading": "ps-2.5",
				"trailing": "pe-2.5",
				"leadingIcon": "size-5",
				"leadingAvatarSize": "2xs",
				"trailingIcon": "size-5"
			},
			"lg": {
				"base": "px-3 py-2 text-base/5 gap-2",
				"leading": "ps-3",
				"trailing": "pe-3",
				"leadingIcon": "size-5",
				"leadingAvatarSize": "2xs",
				"trailingIcon": "size-5"
			},
			"xl": {
				"base": "px-3 py-2 text-base gap-2",
				"leading": "ps-3",
				"trailing": "pe-3",
				"leadingIcon": "size-6",
				"leadingAvatarSize": "xs",
				"trailingIcon": "size-6"
			}
		},
		"variant": {
			"outline": "text-highlighted bg-default ring ring-inset ring-accented",
			"soft": "text-highlighted bg-elevated/50 hover:bg-elevated focus:bg-elevated disabled:bg-elevated/50",
			"subtle": "text-highlighted bg-elevated ring ring-inset ring-accented",
			"ghost": "text-highlighted bg-transparent hover:bg-elevated focus:bg-elevated disabled:bg-transparent dark:disabled:bg-transparent",
			"none": "text-highlighted bg-transparent focus:outline-none"
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
		"leading": { "true": "" },
		"trailing": { "true": "" },
		"loading": { "true": "" },
		"highlight": { "true": "" },
		"fixed": { "false": "" },
		"type": { "file": "file:me-1.5 file:font-medium file:text-muted file:outline-none" }
	},
	"compoundVariants": [
		{
			"color": "primary",
			"variant": ["outline", "subtle"],
			"class": "outline-primary/25 focus-visible:outline-3 focus-visible:ring-primary"
		},
		{
			"color": "secondary",
			"variant": ["outline", "subtle"],
			"class": "outline-secondary/25 focus-visible:outline-3 focus-visible:ring-secondary"
		},
		{
			"color": "success",
			"variant": ["outline", "subtle"],
			"class": "outline-success/25 focus-visible:outline-3 focus-visible:ring-success"
		},
		{
			"color": "info",
			"variant": ["outline", "subtle"],
			"class": "outline-info/25 focus-visible:outline-3 focus-visible:ring-info"
		},
		{
			"color": "warning",
			"variant": ["outline", "subtle"],
			"class": "outline-warning/25 focus-visible:outline-3 focus-visible:ring-warning"
		},
		{
			"color": "error",
			"variant": ["outline", "subtle"],
			"class": "outline-error/25 focus-visible:outline-3 focus-visible:ring-error"
		},
		{
			"color": "primary",
			"variant": ["soft", "ghost"],
			"class": "outline-primary/25 focus-visible:outline-3"
		},
		{
			"color": "secondary",
			"variant": ["soft", "ghost"],
			"class": "outline-secondary/25 focus-visible:outline-3"
		},
		{
			"color": "success",
			"variant": ["soft", "ghost"],
			"class": "outline-success/25 focus-visible:outline-3"
		},
		{
			"color": "info",
			"variant": ["soft", "ghost"],
			"class": "outline-info/25 focus-visible:outline-3"
		},
		{
			"color": "warning",
			"variant": ["soft", "ghost"],
			"class": "outline-warning/25 focus-visible:outline-3"
		},
		{
			"color": "error",
			"variant": ["soft", "ghost"],
			"class": "outline-error/25 focus-visible:outline-3"
		},
		{
			"color": "primary",
			"highlight": true,
			"class": "ring ring-inset ring-primary"
		},
		{
			"color": "secondary",
			"highlight": true,
			"class": "ring ring-inset ring-secondary"
		},
		{
			"color": "success",
			"highlight": true,
			"class": "ring ring-inset ring-success"
		},
		{
			"color": "info",
			"highlight": true,
			"class": "ring ring-inset ring-info"
		},
		{
			"color": "warning",
			"highlight": true,
			"class": "ring ring-inset ring-warning"
		},
		{
			"color": "error",
			"highlight": true,
			"class": "ring ring-inset ring-error"
		},
		{
			"color": "neutral",
			"variant": ["outline", "subtle"],
			"class": "outline-inverted/25 focus-visible:outline-3 focus-visible:ring-inverted"
		},
		{
			"color": "neutral",
			"variant": ["soft", "ghost"],
			"class": "outline-inverted/25 focus-visible:outline-3"
		},
		{
			"color": "neutral",
			"highlight": true,
			"class": "ring ring-inset ring-inverted"
		},
		{
			"leading": true,
			"size": "xs",
			"class": "ps-7"
		},
		{
			"leading": true,
			"size": "sm",
			"class": "ps-8"
		},
		{
			"leading": true,
			"size": "md",
			"class": "ps-9"
		},
		{
			"leading": true,
			"size": "lg",
			"class": "ps-10"
		},
		{
			"leading": true,
			"size": "xl",
			"class": "ps-11"
		},
		{
			"trailing": true,
			"size": "xs",
			"class": "pe-7"
		},
		{
			"trailing": true,
			"size": "sm",
			"class": "pe-8"
		},
		{
			"trailing": true,
			"size": "md",
			"class": "pe-9"
		},
		{
			"trailing": true,
			"size": "lg",
			"class": "pe-10"
		},
		{
			"trailing": true,
			"size": "xl",
			"class": "pe-11"
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
		},
		{
			"fixed": false,
			"size": "xs",
			"class": "md:text-xs"
		},
		{
			"fixed": false,
			"size": "sm",
			"class": "md:text-xs"
		},
		{
			"fixed": false,
			"size": "md",
			"class": "md:text-sm"
		},
		{
			"fixed": false,
			"size": "lg",
			"class": "md:text-sm"
		}
	],
	"defaultVariants": {
		"size": "md",
		"color": "primary",
		"variant": "outline"
	}
};
// ../../../../node_modules/@nuxt/ui/dist/runtime/components/Input.vue
var _sfc_main$9 = /*@__PURE__*/ Object.assign({ inheritAttrs: false }, {
	__name: "Input",
	props: {
		as: {
			type: null,
			required: false
		},
		id: {
			type: String,
			required: false
		},
		name: {
			type: String,
			required: false
		},
		type: {
			type: null,
			required: false,
			default: "text"
		},
		placeholder: {
			type: String,
			required: false
		},
		color: {
			type: null,
			required: false
		},
		variant: {
			type: null,
			required: false
		},
		size: {
			type: null,
			required: false
		},
		required: {
			type: Boolean,
			required: false
		},
		autocomplete: {
			type: [String, Object],
			required: false,
			default: "off"
		},
		autofocus: {
			type: Boolean,
			required: false
		},
		autofocusDelay: {
			type: Number,
			required: false,
			default: 0
		},
		disabled: {
			type: Boolean,
			required: false
		},
		highlight: {
			type: Boolean,
			required: false
		},
		fixed: {
			type: Boolean,
			required: false
		},
		modelValue: {
			type: null,
			required: false
		},
		defaultValue: {
			type: null,
			required: false
		},
		modelModifiers: {
			type: null,
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
		}
	},
	emits: [
		"update:modelValue",
		"blur",
		"change"
	],
	setup(__props, { expose: __expose, emit: __emit }) {
		const _props = __props;
		const emits = __emit;
		const slots = useSlots();
		const props = useComponentProps("input", _props);
		const modelValue = useVModel(props, "modelValue", emits, { defaultValue: props.defaultValue });
		const appConfig = useAppConfig();
		const { emitFormBlur, emitFormInput, emitFormChange, size: formFieldSize, color: formFieldColor, id, name, highlight: formFieldHighlight, disabled: formFieldDisabled, emitFormFocus, ariaAttrs } = useFormField(_props, { deferInputValidation: true });
		const { orientation, size: fieldGroupSize } = useFieldGroup(_props);
		const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props);
		const color = computed(() => formFieldColor.value ?? props.color);
		const highlight = computed(() => formFieldHighlight.value ?? props.highlight);
		const size = computed(() => fieldGroupSize.value ?? formFieldSize.value ?? props.size);
		const disabled = computed(() => formFieldDisabled.value ?? props.disabled);
		const ui = computed(() => tv({
			extend: input_default,
			...appConfig.ui?.input || {}
		})({
			type: props.type,
			color: color.value,
			variant: props.variant,
			size: size.value,
			loading: props.loading,
			highlight: highlight.value,
			fixed: props.fixed,
			leading: isLeading.value || !!props.avatar || !!slots.leading,
			trailing: isTrailing.value || !!slots.trailing,
			fieldGroup: orientation.value
		}));
		const inputRef = useTemplateRef("inputRef");
		function updateInput(value) {
			if (props.modelModifiers?.trim && (typeof value === "string" || value === null || value === void 0)) value = value?.trim() ?? null;
			if (props.modelModifiers?.number || props.type === "number") value = looseToNumber(value);
			if (props.modelModifiers?.nullable && isEmpty(value)) value = null;
			if (props.modelModifiers?.optional && !props.modelModifiers?.nullable && value !== null && isEmpty(value)) value = void 0;
			modelValue.value = value;
			emitFormInput();
		}
		function onInput(event) {
			if (!props.modelModifiers?.lazy) updateInput(event.target.value);
		}
		function onChange(event) {
			const value = event.target.value;
			if (props.modelModifiers?.lazy) updateInput(value);
			if (props.modelModifiers?.trim) event.target.value = value.trim();
			emitFormChange();
			emits("change", event);
		}
		function onBlur(event) {
			emitFormBlur();
			emits("blur", event);
		}
		function autoFocus() {
			if (props.autofocus) inputRef.value?.focus();
		}
		let autofocusTimeoutId;
		onMounted(() => {
			autofocusTimeoutId = setTimeout(() => {
				autoFocus();
			}, props.autofocusDelay);
		});
		onScopeDispose(() => clearTimeout(autofocusTimeoutId));
		__expose({ inputRef });
		const __returned__ = {
			_props,
			emits,
			slots,
			props,
			modelValue,
			appConfig,
			emitFormBlur,
			emitFormInput,
			emitFormChange,
			formFieldSize,
			formFieldColor,
			id,
			name,
			formFieldHighlight,
			formFieldDisabled,
			emitFormFocus,
			ariaAttrs,
			orientation,
			fieldGroupSize,
			isLeading,
			isTrailing,
			leadingIconName,
			trailingIconName,
			color,
			highlight,
			size,
			disabled,
			ui,
			inputRef,
			updateInput,
			onInput,
			onChange,
			onBlur,
			autoFocus,
			get autofocusTimeoutId() {
				return autofocusTimeoutId;
			},
			set autofocusTimeoutId(v) {
				autofocusTimeoutId = v;
			},
			get theme() {
				return input_default;
			},
			useTemplateRef,
			computed,
			onMounted,
			onScopeDispose,
			get Primitive() {
				return Primitive;
			},
			get useVModel() {
				return useVModel;
			},
			get useAppConfig() {
				return useAppConfig;
			},
			get useComponentProps() {
				return useComponentProps;
			},
			get useFieldGroup() {
				return useFieldGroup;
			},
			get useComponentIcons() {
				return useComponentIcons;
			},
			get useFormField() {
				return useFormField;
			},
			get isEmpty() {
				return isEmpty;
			},
			get looseToNumber() {
				return looseToNumber;
			},
			get tv() {
				return tv;
			},
			UIcon: Icon_default,
			UAvatar: Avatar_default
		};
		Object.defineProperty(__returned__, "__isScriptSetup", {
			enumerable: false,
			value: true
		});
		return __returned__;
	}
});
var _hoisted_1$6 = [
	"id",
	"type",
	"value",
	"name",
	"placeholder",
	"disabled",
	"required",
	"autocomplete"
];
function _sfc_render$19(_ctx, _cache, $props, $setup, $data, $options) {
	return openBlock(), createBlock($setup["Primitive"], {
		as: $setup.props.as,
		"data-slot": _ctx.$attrs["data-slot"] ?? "root",
		class: normalizeClass($setup.ui.root({ class: [$setup.props.ui?.root, $setup.props.class] }))
	}, {
		default: withCtx(() => [
			createElementVNode("input", mergeProps({
				id: $setup.id,
				ref: "inputRef",
				type: $setup.props.type,
				value: $setup.modelValue,
				name: $setup.name,
				placeholder: $setup.props.placeholder,
				class: $setup.ui.base({ class: $setup.props.ui?.base }),
				disabled: $setup.disabled,
				required: $setup.props.required,
				autocomplete: $setup.props.autocomplete
			}, {
				..._ctx.$attrs,
				...$setup.ariaAttrs
			}, {
				"data-slot": "base",
				onInput: $setup.onInput,
				onBlur: $setup.onBlur,
				onChange: $setup.onChange,
				onFocus: _cache[0] || (_cache[0] = (...args) => $setup.emitFormFocus && $setup.emitFormFocus(...args))
			}), null, 16, _hoisted_1$6),
			renderSlot(_ctx.$slots, "default", { ui: $setup.ui }),
			$setup.isLeading || !!$setup.props.avatar || !!$setup.slots.leading ? (openBlock(), createElementBlock("span", {
				key: 0,
				"data-slot": "leading",
				class: normalizeClass($setup.ui.leading({ class: $setup.props.ui?.leading }))
			}, [renderSlot(_ctx.$slots, "leading", { ui: $setup.ui }, () => [$setup.isLeading && $setup.leadingIconName ? (openBlock(), createBlock($setup["UIcon"], {
				key: 0,
				name: $setup.leadingIconName,
				"data-slot": "leadingIcon",
				class: normalizeClass($setup.ui.leadingIcon({ class: $setup.props.ui?.leadingIcon }))
			}, null, 8, ["name", "class"])) : !!$setup.props.avatar ? (openBlock(), createBlock($setup["UAvatar"], mergeProps({
				key: 1,
				size: $setup.props.ui?.leadingAvatarSize || $setup.ui.leadingAvatarSize()
			}, $setup.props.avatar, {
				"data-slot": "leadingAvatar",
				class: $setup.ui.leadingAvatar({ class: $setup.props.ui?.leadingAvatar })
			}), null, 16, ["size", "class"])) : createCommentVNode("", true)])], 2)) : createCommentVNode("", true),
			$setup.isTrailing || !!$setup.slots.trailing ? (openBlock(), createElementBlock("span", {
				key: 1,
				"data-slot": "trailing",
				class: normalizeClass($setup.ui.trailing({ class: $setup.props.ui?.trailing }))
			}, [renderSlot(_ctx.$slots, "trailing", { ui: $setup.ui }, () => [$setup.trailingIconName ? (openBlock(), createBlock($setup["UIcon"], {
				key: 0,
				name: $setup.trailingIconName,
				"data-slot": "trailingIcon",
				class: normalizeClass($setup.ui.trailingIcon({
					class: $setup.props.ui?.trailingIcon,
					leading: $setup.isLeading
				}))
			}, null, 8, ["name", "class"])) : createCommentVNode("", true)])], 2)) : createCommentVNode("", true)
		]),
		_: 3
	}, 8, [
		"as",
		"data-slot",
		"class"
	]);
}
var Input_default = /*@__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$9, [["render", _sfc_render$19], ["__file", "Input.vue"]]);
// ../../../../node_modules/@nuxt/ui/dist/runtime/composables/usePrefix.js
function usePrefix() {
	const prefix = useAppConfig().ui?.prefix;
	return (classString) => {
		if (!prefix || !classString) return classString;
		return classString.split(/\s+/).filter(Boolean).map((cls) => `${prefix}:${cls}`).join(" ");
	};
}
// virtual:nuxt-ui-templates/ui/kbd.ts
var kbd_default = {
	"base": "inline-flex items-center justify-center px-1 rounded-sm font-medium font-sans uppercase",
	"variants": {
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
			"subtle": ""
		},
		"size": {
			"sm": "h-4 min-w-[16px] text-[10px]",
			"md": "h-5 min-w-[20px] text-[11px]",
			"lg": "h-6 min-w-[24px] text-[12px]"
		}
	},
	"compoundVariants": [
		{
			"color": "primary",
			"variant": "solid",
			"class": "text-inverted bg-primary"
		},
		{
			"color": "secondary",
			"variant": "solid",
			"class": "text-inverted bg-secondary"
		},
		{
			"color": "success",
			"variant": "solid",
			"class": "text-inverted bg-success"
		},
		{
			"color": "info",
			"variant": "solid",
			"class": "text-inverted bg-info"
		},
		{
			"color": "warning",
			"variant": "solid",
			"class": "text-inverted bg-warning"
		},
		{
			"color": "error",
			"variant": "solid",
			"class": "text-inverted bg-error"
		},
		{
			"color": "primary",
			"variant": "outline",
			"class": "ring ring-inset ring-primary/50 text-primary"
		},
		{
			"color": "secondary",
			"variant": "outline",
			"class": "ring ring-inset ring-secondary/50 text-secondary"
		},
		{
			"color": "success",
			"variant": "outline",
			"class": "ring ring-inset ring-success/50 text-success"
		},
		{
			"color": "info",
			"variant": "outline",
			"class": "ring ring-inset ring-info/50 text-info"
		},
		{
			"color": "warning",
			"variant": "outline",
			"class": "ring ring-inset ring-warning/50 text-warning"
		},
		{
			"color": "error",
			"variant": "outline",
			"class": "ring ring-inset ring-error/50 text-error"
		},
		{
			"color": "primary",
			"variant": "soft",
			"class": "text-primary bg-primary/10"
		},
		{
			"color": "secondary",
			"variant": "soft",
			"class": "text-secondary bg-secondary/10"
		},
		{
			"color": "success",
			"variant": "soft",
			"class": "text-success bg-success/10"
		},
		{
			"color": "info",
			"variant": "soft",
			"class": "text-info bg-info/10"
		},
		{
			"color": "warning",
			"variant": "soft",
			"class": "text-warning bg-warning/10"
		},
		{
			"color": "error",
			"variant": "soft",
			"class": "text-error bg-error/10"
		},
		{
			"color": "primary",
			"variant": "subtle",
			"class": "text-primary ring ring-inset ring-primary/25 bg-primary/10"
		},
		{
			"color": "secondary",
			"variant": "subtle",
			"class": "text-secondary ring ring-inset ring-secondary/25 bg-secondary/10"
		},
		{
			"color": "success",
			"variant": "subtle",
			"class": "text-success ring ring-inset ring-success/25 bg-success/10"
		},
		{
			"color": "info",
			"variant": "subtle",
			"class": "text-info ring ring-inset ring-info/25 bg-info/10"
		},
		{
			"color": "warning",
			"variant": "subtle",
			"class": "text-warning ring ring-inset ring-warning/25 bg-warning/10"
		},
		{
			"color": "error",
			"variant": "subtle",
			"class": "text-error ring ring-inset ring-error/25 bg-error/10"
		},
		{
			"color": "neutral",
			"variant": "solid",
			"class": "text-inverted bg-inverted"
		},
		{
			"color": "neutral",
			"variant": "outline",
			"class": "ring ring-inset ring-accented text-default bg-default"
		},
		{
			"color": "neutral",
			"variant": "soft",
			"class": "text-default bg-elevated"
		},
		{
			"color": "neutral",
			"variant": "subtle",
			"class": "ring ring-inset ring-accented text-default bg-elevated"
		}
	],
	"defaultVariants": {
		"variant": "outline",
		"color": "neutral",
		"size": "md"
	}
};
// ../../../../node_modules/@nuxt/ui/dist/runtime/components/Kbd.vue
var _sfc_main$8 = {
	__name: "Kbd",
	props: {
		as: {
			type: null,
			required: false,
			default: "kbd"
		},
		value: {
			type: null,
			required: false
		},
		color: {
			type: null,
			required: false
		},
		variant: {
			type: null,
			required: false
		},
		size: {
			type: null,
			required: false
		},
		class: {
			type: null,
			required: false
		},
		ui: {
			type: Object,
			required: false
		}
	},
	setup(__props, { expose: __expose }) {
		__expose();
		const _props = __props;
		const props = useComponentProps("kbd", _props);
		const { getKbdKey } = useKbd();
		const appConfig = useAppConfig();
		const __returned__ = {
			_props,
			props,
			getKbdKey,
			appConfig,
			prefix: usePrefix(),
			platformKey: computed(() => props.value && Object.hasOwn(kbdKeysPlatformMap, props.value) ? kbdKeysPlatformMap[props.value] : void 0),
			ui: computed(() => tv({
				extend: kbd_default,
				...appConfig.ui?.kbd || {}
			})),
			get theme() {
				return kbd_default;
			},
			computed,
			get Primitive() {
				return Primitive;
			},
			get useAppConfig() {
				return useAppConfig;
			},
			get useHead() {
				return useHead;
			},
			get useKbd() {
				return useKbd;
			},
			get kbdKeysPlatformMap() {
				return kbdKeysPlatformMap;
			},
			get useComponentProps() {
				return useComponentProps;
			},
			get usePrefix() {
				return usePrefix;
			},
			get tv() {
				return tv;
			}
		};
		Object.defineProperty(__returned__, "__isScriptSetup", {
			enumerable: false,
			value: true
		});
		return __returned__;
	}
};
function _sfc_render$18(_ctx, _cache, $props, $setup, $data, $options) {
	return openBlock(), createBlock($setup["Primitive"], {
		as: $setup.props.as,
		class: normalizeClass($setup.ui({
			class: [$setup.props.ui?.base, $setup.props.class],
			color: $setup.props.color,
			variant: $setup.props.variant,
			size: $setup.props.size
		}))
	}, {
		default: withCtx(() => [renderSlot(_ctx.$slots, "default", {}, () => [$setup.platformKey ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [createElementVNode("span", { class: normalizeClass($setup.prefix("hidden in-[.ui-macos]:inline")) }, toDisplayString($setup.platformKey.macos), 3), createElementVNode("span", { class: normalizeClass($setup.prefix("in-[.ui-macos]:hidden")) }, toDisplayString($setup.platformKey.other), 3)], 64)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [createTextVNode(toDisplayString($setup.getKbdKey($setup.props.value)), 1)], 64))])]),
		_: 3
	}, 8, ["as", "class"]);
}
var Kbd_default = /*@__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$8, [["render", _sfc_render$18], ["__file", "Kbd.vue"]]);
// ../../../../node_modules/@nuxt/ui/dist/runtime/components/DropdownMenuContent.vue
var _sfc_main$7 = {
	__name: "DropdownMenuContent",
	props: {
		items: {
			type: null,
			required: false
		},
		portal: {
			type: [Boolean, String],
			required: false,
			skipCheck: true
		},
		sub: {
			type: Boolean,
			required: false
		},
		labelKey: {
			type: null,
			required: true
		},
		descriptionKey: {
			type: null,
			required: true
		},
		checkedIcon: {
			type: null,
			required: false
		},
		loadingIcon: {
			type: null,
			required: false
		},
		externalIcon: {
			type: [Boolean, String],
			required: false,
			skipCheck: true
		},
		size: {
			type: null,
			required: false
		},
		filter: {
			type: [Boolean, Object],
			required: false
		},
		filterFields: {
			type: Array,
			required: false
		},
		ignoreFilter: {
			type: Boolean,
			required: false
		},
		searchTerm: {
			type: String,
			required: false
		},
		class: {
			type: null,
			required: false
		},
		ui: {
			type: Object,
			required: true
		},
		uiOverride: {
			type: Object,
			required: false
		},
		loop: {
			type: Boolean,
			required: false
		},
		memoDependencies: {
			type: Array,
			required: false
		},
		side: {
			type: null,
			required: false
		},
		sideOffset: {
			type: Number,
			required: false
		},
		sideFlip: {
			type: Boolean,
			required: false
		},
		align: {
			type: null,
			required: false
		},
		alignOffset: {
			type: Number,
			required: false
		},
		alignFlip: {
			type: Boolean,
			required: false
		},
		avoidCollisions: {
			type: Boolean,
			required: false
		},
		collisionBoundary: {
			type: null,
			required: false
		},
		collisionPadding: {
			type: [Number, Object],
			required: false
		},
		arrowPadding: {
			type: Number,
			required: false
		},
		hideShiftedArrow: {
			type: Boolean,
			required: false
		},
		sticky: {
			type: String,
			required: false
		},
		hideWhenDetached: {
			type: Boolean,
			required: false
		},
		positionStrategy: {
			type: String,
			required: false
		},
		updatePositionStrategy: {
			type: String,
			required: false
		},
		disableUpdateOnLayoutShift: {
			type: Boolean,
			required: false
		},
		prioritizePosition: {
			type: Boolean,
			required: false
		},
		reference: {
			type: null,
			required: false
		}
	},
	emits: [
		"update:searchTerm",
		"escapeKeyDown",
		"pointerDownOutside",
		"focusOutside",
		"interactOutside",
		"openAutoFocus",
		"closeAutoFocus"
	],
	setup(__props, { expose: __expose, emit: __emit }) {
		__expose();
		const DropdownMenu = {
			Portal: DropdownMenuPortal_default,
			Content: DropdownMenuContent_default$1,
			Item: DropdownMenuItem_default,
			Group: DropdownMenuGroup_default,
			Separator: DropdownMenuSeparator_default,
			CheckboxItem: DropdownMenuCheckboxItem_default,
			ItemIndicator: DropdownMenuItemIndicator_default,
			Label: DropdownMenuLabel_default,
			Sub: DropdownMenuSub_default,
			SubContent: DropdownMenuSubContent_default,
			SubTrigger: DropdownMenuSubTrigger_default,
			Filter: DropdownMenuFilter_default
		};
		const props = __props;
		const emits = __emit;
		const slots = useSlots();
		const { t, dir } = useLocale();
		const appConfig = useAppConfig();
		const { filterGroups } = useFilter();
		const _searchTerm = ref("");
		const searchTerm = computed({
			get: () => props.searchTerm ?? _searchTerm.value,
			set: (value) => {
				_searchTerm.value = value;
				emits("update:searchTerm", value);
			}
		});
		const inputProps = toRef(() => defu(props.filter, {
			placeholder: t("dropdownMenu.search"),
			variant: "none"
		}));
		const portalProps = usePortal(toRef(() => props.portal));
		const contentProps = useForwardPropsEmits(reactiveOmit(props, "sub", "items", "portal", "labelKey", "descriptionKey", "checkedIcon", "loadingIcon", "externalIcon", "size", "filter", "filterFields", "ignoreFilter", "searchTerm", "class", "ui", "uiOverride"), emits);
		const getProxySlots = () => omit(slots, ["default"]);
		const [DefineItemTemplate, ReuseItemTemplate] = createReusableTemplate();
		const childrenIcon = computed(() => dir.value === "rtl" ? appConfig.ui.icons.chevronLeft : appConfig.ui.icons.chevronRight);
		const groups = computed(() => {
			if (!props.items?.length) return [];
			return isArrayOfArray(props.items) ? props.items : [props.items];
		});
		const isStructuralItem = (item) => !!item.type && ["label", "separator"].includes(item.type);
		const filteredGroups = computed(() => {
			if (!props.filter || props.ignoreFilter || !searchTerm.value) return groups.value;
			const fields = Array.isArray(props.filterFields) && props.filterFields.length ? props.filterFields : [props.labelKey];
			return filterGroups(groups.value, searchTerm.value, {
				fields,
				isStructural: isStructuralItem
			});
		});
		const __returned__ = {
			DropdownMenu,
			props,
			emits,
			slots,
			t,
			dir,
			appConfig,
			filterGroups,
			_searchTerm,
			searchTerm,
			inputProps,
			portalProps,
			contentProps,
			getProxySlots,
			DefineItemTemplate,
			ReuseItemTemplate,
			childrenIcon,
			groups,
			isStructuralItem,
			filteredGroups,
			hasFilteredItems: computed(() => filteredGroups.value.some((group) => group.some((item) => !isStructuralItem(item)))),
			computed,
			ref,
			toRef,
			get defu() {
				return defu;
			},
			get DropdownMenuPortal() {
				return DropdownMenuPortal_default;
			},
			get DropdownMenuContent() {
				return DropdownMenuContent_default$1;
			},
			get RekaDropdownMenuItem() {
				return DropdownMenuItem_default;
			},
			get DropdownMenuGroup() {
				return DropdownMenuGroup_default;
			},
			get DropdownMenuSeparator() {
				return DropdownMenuSeparator_default;
			},
			get DropdownMenuCheckboxItem() {
				return DropdownMenuCheckboxItem_default;
			},
			get DropdownMenuItemIndicator() {
				return DropdownMenuItemIndicator_default;
			},
			get DropdownMenuLabel() {
				return DropdownMenuLabel_default;
			},
			get DropdownMenuSub() {
				return DropdownMenuSub_default;
			},
			get DropdownMenuSubContent() {
				return DropdownMenuSubContent_default;
			},
			get DropdownMenuSubTrigger() {
				return DropdownMenuSubTrigger_default;
			},
			get DropdownMenuFilter() {
				return DropdownMenuFilter_default;
			},
			get useForwardPropsEmits() {
				return useForwardPropsEmits;
			},
			get reactiveOmit() {
				return reactiveOmit;
			},
			get createReusableTemplate() {
				return createReusableTemplate;
			},
			get useAppConfig() {
				return useAppConfig;
			},
			get FieldGroupReset() {
				return FieldGroupReset;
			},
			get useFilter() {
				return useFilter;
			},
			get useLocale() {
				return useLocale;
			},
			get usePortal() {
				return usePortal;
			},
			get omit() {
				return omit;
			},
			get get() {
				return get;
			},
			get isArrayOfArray() {
				return isArrayOfArray;
			},
			get pickLinkProps() {
				return pickLinkProps;
			},
			ULinkBase: LinkBase_default,
			ULink: Link_default,
			UAvatar: Avatar_default,
			UIcon: Icon_default,
			UInput: Input_default,
			UKbd: Kbd_default,
			UDropdownMenuContent: DropdownMenuContent_default
		};
		Object.defineProperty(__returned__, "__isScriptSetup", {
			enumerable: false,
			value: true
		});
		return __returned__;
	}
};
function _sfc_render$17(_ctx, _cache, $props, $setup, $data, $options) {
	return openBlock(), createElementBlock(Fragment, null, [createVNode($setup["DefineItemTemplate"], null, {
		default: withCtx(({ item, active, index }) => [renderSlot(_ctx.$slots, item.slot || "item", {
			item,
			index,
			ui: $props.ui
		}, () => [
			renderSlot(_ctx.$slots, item.slot ? `${item.slot}-leading` : "item-leading", {
				item,
				active,
				index,
				ui: $props.ui
			}, () => [item.loading ? (openBlock(), createBlock($setup["UIcon"], {
				key: 0,
				name: $props.loadingIcon || $setup.appConfig.ui.icons.loading,
				"data-slot": "itemLeadingIcon",
				class: normalizeClass($props.ui.itemLeadingIcon({
					class: [$props.uiOverride?.itemLeadingIcon, item.ui?.itemLeadingIcon],
					color: item?.color,
					loading: true
				}))
			}, null, 8, ["name", "class"])) : item.icon ? (openBlock(), createBlock($setup["UIcon"], {
				key: 1,
				name: item.icon,
				"data-slot": "itemLeadingIcon",
				class: normalizeClass($props.ui.itemLeadingIcon({
					class: [$props.uiOverride?.itemLeadingIcon, item.ui?.itemLeadingIcon],
					color: item?.color,
					active
				}))
			}, null, 8, ["name", "class"])) : item.avatar ? (openBlock(), createBlock($setup["UAvatar"], mergeProps({
				key: 2,
				size: item.ui?.itemLeadingAvatarSize || $props.uiOverride?.itemLeadingAvatarSize || $props.ui.itemLeadingAvatarSize()
			}, item.avatar, {
				"data-slot": "itemLeadingAvatar",
				class: $props.ui.itemLeadingAvatar({
					class: [$props.uiOverride?.itemLeadingAvatar, item.ui?.itemLeadingAvatar],
					active
				})
			}), null, 16, ["size", "class"])) : createCommentVNode("", true)]),
			$setup.get(item, $setup.props.labelKey) || !!$setup.slots[item.slot ? `${item.slot}-label` : "item-label"] || $setup.get(item, $setup.props.descriptionKey) || !!$setup.slots[item.slot ? `${item.slot}-description` : "item-description"] ? (openBlock(), createElementBlock("span", {
				key: 0,
				"data-slot": "itemWrapper",
				class: normalizeClass($props.ui.itemWrapper({ class: [$props.uiOverride?.itemWrapper, item.ui?.itemWrapper] }))
			}, [createElementVNode("span", {
				"data-slot": "itemLabel",
				class: normalizeClass($props.ui.itemLabel({
					class: [$props.uiOverride?.itemLabel, item.ui?.itemLabel],
					active
				}))
			}, [renderSlot(_ctx.$slots, item.slot ? `${item.slot}-label` : "item-label", {
				item,
				active,
				index
			}, () => [createTextVNode(toDisplayString($setup.get(item, $setup.props.labelKey)), 1)]), item.target === "_blank" && $props.externalIcon !== false ? (openBlock(), createBlock($setup["UIcon"], {
				key: 0,
				name: typeof $props.externalIcon === "string" ? $props.externalIcon : $setup.appConfig.ui.icons.external,
				"data-slot": "itemLabelExternalIcon",
				class: normalizeClass($props.ui.itemLabelExternalIcon({
					class: [$props.uiOverride?.itemLabelExternalIcon, item.ui?.itemLabelExternalIcon],
					color: item?.color,
					active
				}))
			}, null, 8, ["name", "class"])) : createCommentVNode("", true)], 2), $setup.get(item, $setup.props.descriptionKey) || !!$setup.slots[item.slot ? `${item.slot}-description` : "item-description"] ? (openBlock(), createElementBlock("span", {
				key: 0,
				"data-slot": "itemDescription",
				class: normalizeClass($props.ui.itemDescription({ class: [$props.uiOverride?.itemDescription, item.ui?.itemDescription] }))
			}, [renderSlot(_ctx.$slots, item.slot ? `${item.slot}-description` : "item-description", {
				item,
				active,
				index
			}, () => [createTextVNode(toDisplayString($setup.get(item, $setup.props.descriptionKey)), 1)])], 2)) : createCommentVNode("", true)], 2)) : createCommentVNode("", true),
			createElementVNode("span", {
				"data-slot": "itemTrailing",
				class: normalizeClass($props.ui.itemTrailing({ class: [$props.uiOverride?.itemTrailing, item.ui?.itemTrailing] }))
			}, [renderSlot(_ctx.$slots, item.slot ? `${item.slot}-trailing` : "item-trailing", {
				item,
				active,
				index,
				ui: $props.ui
			}, () => [item.children?.length ? (openBlock(), createBlock($setup["UIcon"], {
				key: 0,
				name: $setup.childrenIcon,
				"data-slot": "itemTrailingIcon",
				class: normalizeClass($props.ui.itemTrailingIcon({
					class: [$props.uiOverride?.itemTrailingIcon, item.ui?.itemTrailingIcon],
					color: item?.color,
					active
				}))
			}, null, 8, ["name", "class"])) : item.kbds?.length ? (openBlock(), createElementBlock("span", {
				key: 1,
				"data-slot": "itemTrailingKbds",
				class: normalizeClass($props.ui.itemTrailingKbds({ class: [$props.uiOverride?.itemTrailingKbds, item.ui?.itemTrailingKbds] }))
			}, [(openBlock(true), createElementBlock(Fragment, null, renderList(item.kbds, (kbd, kbdIndex) => {
				return openBlock(), createBlock($setup["UKbd"], mergeProps({
					key: kbdIndex,
					size: item.ui?.itemTrailingKbdsSize || $props.uiOverride?.itemTrailingKbdsSize || $props.ui.itemTrailingKbdsSize()
				}, { ref_for: true }, typeof kbd === "string" ? { value: kbd } : kbd), null, 16, ["size"]);
			}), 128))], 2)) : createCommentVNode("", true)]), createVNode($setup["DropdownMenu"].ItemIndicator, { "as-child": "" }, {
				default: withCtx(() => [createVNode($setup["UIcon"], {
					name: $props.checkedIcon || $setup.appConfig.ui.icons.check,
					"data-slot": "itemTrailingIcon",
					class: normalizeClass($props.ui.itemTrailingIcon({
						class: [$props.uiOverride?.itemTrailingIcon, item.ui?.itemTrailingIcon],
						color: item?.color
					}))
				}, null, 8, ["name", "class"])]),
				_: 2
			}, 1024)], 2)
		])]),
		_: 3
	}), createVNode($setup["DropdownMenu"].Portal, normalizeProps(guardReactiveProps($setup.portalProps)), {
		default: withCtx(() => [createVNode($setup["FieldGroupReset"], null, {
			default: withCtx(() => [(openBlock(), createBlock(resolveDynamicComponent($props.sub ? $setup.DropdownMenu.SubContent : $setup.DropdownMenu.Content), mergeProps({
				"data-slot": "content",
				class: $props.ui.content({ class: [$props.uiOverride?.content, $setup.props.class] })
			}, $setup.contentProps), {
				default: withCtx(() => [
					!!$props.filter ? (openBlock(), createBlock($setup["DropdownMenu"].Filter, {
						key: 0,
						modelValue: $setup.searchTerm,
						"onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.searchTerm = $event),
						"as-child": ""
					}, {
						default: withCtx(() => [createVNode($setup["UInput"], mergeProps({
							autofocus: "",
							autocomplete: "off",
							size: $props.size
						}, $setup.inputProps, {
							"data-slot": "input",
							class: $props.ui.input({ class: $props.uiOverride?.input }),
							onChange: _cache[0] || (_cache[0] = withModifiers(() => {}, ["stop"]))
						}), null, 16, ["size", "class"])]),
						_: 1
					}, 8, ["modelValue"])) : createCommentVNode("", true),
					renderSlot(_ctx.$slots, "content-top", { sub: $props.sub ?? false }),
					!$setup.searchTerm || $setup.hasFilteredItems ? (openBlock(), createElementBlock("div", {
						key: 1,
						role: "presentation",
						"data-slot": "viewport",
						class: normalizeClass($props.ui.viewport({ class: $props.uiOverride?.viewport }))
					}, [(openBlock(true), createElementBlock(Fragment, null, renderList($setup.filteredGroups, (group, groupIndex) => {
						return openBlock(), createBlock($setup["DropdownMenu"].Group, {
							key: `group-${groupIndex}`,
							"data-slot": "group",
							class: normalizeClass($props.ui.group({ class: $props.uiOverride?.group }))
						}, {
							default: withCtx(() => [(openBlock(true), createElementBlock(Fragment, null, renderList(group, (item, index) => {
								return openBlock(), createElementBlock(Fragment, { key: `group-${groupIndex}-${index}` }, [item.type === "label" ? (openBlock(), createBlock($setup["DropdownMenu"].Label, {
									key: 0,
									"data-slot": "label",
									class: normalizeClass($props.ui.label({ class: [
										$props.uiOverride?.label,
										item.ui?.label,
										item.class
									] }))
								}, {
									default: withCtx(() => [createVNode($setup["ReuseItemTemplate"], {
										item,
										index
									}, null, 8, ["item", "index"])]),
									_: 2
								}, 1032, ["class"])) : item.type === "separator" ? (openBlock(), createBlock($setup["DropdownMenu"].Separator, {
									key: 1,
									"data-slot": "separator",
									class: normalizeClass($props.ui.separator({ class: [
										$props.uiOverride?.separator,
										item.ui?.separator,
										item.class
									] }))
								}, null, 8, ["class"])) : item?.children?.length ? (openBlock(), createBlock($setup["DropdownMenu"].Sub, {
									key: 2,
									open: item.open,
									"default-open": item.defaultOpen
								}, {
									default: withCtx(() => [createVNode($setup["DropdownMenu"].SubTrigger, {
										as: "button",
										type: "button",
										disabled: item.disabled,
										"text-value": $setup.get(item, $setup.props.labelKey),
										"data-slot": "item",
										class: normalizeClass($props.ui.item({
											class: [
												$props.uiOverride?.item,
												item.ui?.item,
												item.class
											],
											color: item?.color
										}))
									}, {
										default: withCtx(() => [createVNode($setup["ReuseItemTemplate"], {
											item,
											index
										}, null, 8, ["item", "index"])]),
										_: 2
									}, 1032, [
										"disabled",
										"text-value",
										"class"
									]), createVNode($setup["UDropdownMenuContent"], mergeProps({
										sub: "",
										class: item.ui?.content,
										ui: $props.ui,
										"ui-override": $props.uiOverride,
										portal: $props.portal,
										items: item.children,
										align: "start",
										"align-offset": -4,
										"side-offset": 3,
										"label-key": $props.labelKey,
										"description-key": $props.descriptionKey,
										"checked-icon": $props.checkedIcon,
										"loading-icon": $props.loadingIcon,
										"external-icon": $props.externalIcon,
										size: $props.size,
										filter: item.filter,
										"filter-fields": item.filterFields || $props.filterFields,
										"ignore-filter": item.ignoreFilter ?? $props.ignoreFilter
									}, { ref_for: true }, item.content), createSlots({ _: 2 }, [renderList($setup.getProxySlots(), (_, name) => {
										return {
											name,
											fn: withCtx((slotData) => [renderSlot(_ctx.$slots, name, mergeProps({ ref_for: true }, slotData))])
										};
									})]), 1040, [
										"class",
										"ui",
										"ui-override",
										"portal",
										"items",
										"label-key",
										"description-key",
										"checked-icon",
										"loading-icon",
										"external-icon",
										"size",
										"filter",
										"filter-fields",
										"ignore-filter"
									])]),
									_: 2
								}, 1032, ["open", "default-open"])) : item.type === "checkbox" ? (openBlock(), createBlock($setup["DropdownMenu"].CheckboxItem, {
									key: 3,
									"model-value": item.checked,
									disabled: item.disabled,
									"text-value": $setup.get(item, $setup.props.labelKey),
									"data-slot": "item",
									class: normalizeClass($props.ui.item({
										class: [
											$props.uiOverride?.item,
											item.ui?.item,
											item.class
										],
										color: item?.color
									})),
									"onUpdate:modelValue": item.onUpdateChecked,
									onSelect: item.onSelect
								}, {
									default: withCtx(() => [createVNode($setup["ReuseItemTemplate"], {
										item,
										index
									}, null, 8, ["item", "index"])]),
									_: 2
								}, 1032, [
									"model-value",
									"disabled",
									"text-value",
									"class",
									"onUpdate:modelValue",
									"onSelect"
								])) : (openBlock(), createBlock($setup["ULink"], mergeProps({
									key: 4,
									ref_for: true
								}, $setup.pickLinkProps(item), { custom: "" }), {
									default: withCtx(({ active, ...slotProps }) => [createVNode($setup["DropdownMenu"].Item, {
										"as-child": "",
										disabled: item.disabled,
										"text-value": $setup.get(item, $setup.props.labelKey),
										onSelect: item.onSelect
									}, {
										default: withCtx(() => [createVNode($setup["ULinkBase"], mergeProps({ ref_for: true }, slotProps, {
											"data-slot": "item",
											class: $props.ui.item({
												class: [
													$props.uiOverride?.item,
													item.ui?.item,
													item.class
												],
												color: item?.color,
												active
											})
										}), {
											default: withCtx(() => [createVNode($setup["ReuseItemTemplate"], {
												item,
												active,
												index
											}, null, 8, [
												"item",
												"active",
												"index"
											])]),
											_: 2
										}, 1040, ["class"])]),
										_: 2
									}, 1032, [
										"disabled",
										"text-value",
										"onSelect"
									])]),
									_: 2
								}, 1040))], 64);
							}), 128))]),
							_: 2
						}, 1032, ["class"]);
					}), 128))], 2)) : createCommentVNode("", true),
					$setup.searchTerm && !$setup.hasFilteredItems ? (openBlock(), createElementBlock("div", {
						key: 2,
						"data-slot": "empty",
						class: normalizeClass($props.ui.empty({ class: $props.uiOverride?.empty }))
					}, [renderSlot(_ctx.$slots, "empty", { searchTerm: $setup.searchTerm }, () => [createTextVNode(toDisplayString($setup.t("dropdownMenu.noMatch", { searchTerm: $setup.searchTerm })), 1)])], 2)) : createCommentVNode("", true),
					renderSlot(_ctx.$slots, "default"),
					renderSlot(_ctx.$slots, "content-bottom", { sub: $props.sub ?? false })
				]),
				_: 3
			}, 16, ["class"]))]),
			_: 3
		})]),
		_: 3
	}, 16)], 64);
}
var DropdownMenuContent_default = /*@__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$7, [["render", _sfc_render$17], ["__file", "DropdownMenuContent.vue"]]);
// virtual:nuxt-ui-templates/ui/dropdown-menu.ts
var dropdown_menu_default = {
	"slots": {
		"content": "min-w-32 max-h-(--reka-dropdown-menu-content-available-height) bg-default shadow-lg rounded-md ring ring-default overflow-hidden data-[state=open]:animate-[scale-in_100ms_var(--ease-out)] data-[state=closed]:animate-[scale-out_100ms_var(--ease-out)] origin-(--reka-dropdown-menu-content-transform-origin) flex flex-col",
		"input": "border-b border-default",
		"empty": "text-center text-muted",
		"viewport": "relative divide-y divide-default scroll-py-1 overflow-y-auto flex-1",
		"arrow": "fill-bg stroke-default",
		"group": "p-1 isolate",
		"label": "w-full flex items-center font-semibold text-highlighted",
		"separator": "-mx-1 my-1 h-px bg-border",
		"item": "group relative w-full flex items-start select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-md data-disabled:cursor-not-allowed data-disabled:opacity-75",
		"itemLeadingIcon": "shrink-0",
		"itemLeadingAvatar": "shrink-0",
		"itemLeadingAvatarSize": "",
		"itemTrailing": "ms-auto inline-flex gap-1.5 items-center",
		"itemTrailingIcon": "shrink-0",
		"itemTrailingKbds": "hidden lg:inline-flex items-center shrink-0",
		"itemTrailingKbdsSize": "",
		"itemWrapper": "flex-1 flex flex-col text-start min-w-0",
		"itemLabel": "truncate",
		"itemDescription": "truncate text-muted",
		"itemLabelExternalIcon": "inline-block size-3 align-top text-dimmed"
	},
	"variants": {
		"color": {
			"primary": "",
			"secondary": "",
			"success": "",
			"info": "",
			"warning": "",
			"error": "",
			"neutral": ""
		},
		"active": {
			"true": {
				"item": "text-highlighted before:bg-elevated",
				"itemLeadingIcon": "text-default"
			},
			"false": {
				"item": ["text-default data-highlighted:text-highlighted data-[state=open]:text-highlighted data-highlighted:before:bg-elevated/50 data-[state=open]:before:bg-elevated/50", "transition-colors before:transition-colors"],
				"itemLeadingIcon": ["text-dimmed group-data-highlighted:text-default group-data-[state=open]:text-default", "transition-colors"]
			}
		},
		"loading": { "true": { "itemLeadingIcon": "animate-spin" } },
		"size": {
			"xs": {
				"label": "p-1 text-xs gap-1",
				"item": "p-1 text-xs gap-1",
				"empty": "p-2 text-xs",
				"itemLeadingIcon": "size-4",
				"itemLeadingAvatarSize": "3xs",
				"itemTrailingIcon": "size-4",
				"itemTrailingKbds": "gap-0.5",
				"itemTrailingKbdsSize": "sm"
			},
			"sm": {
				"label": "p-1.5 text-xs gap-1.5",
				"item": "p-1.5 text-xs gap-1.5",
				"empty": "p-2.5 text-xs",
				"itemLeadingIcon": "size-4",
				"itemLeadingAvatarSize": "3xs",
				"itemTrailingIcon": "size-4",
				"itemTrailingKbds": "gap-0.5",
				"itemTrailingKbdsSize": "sm"
			},
			"md": {
				"label": "p-1.5 text-sm gap-1.5",
				"item": "p-1.5 text-sm gap-1.5",
				"empty": "p-2.5 text-sm",
				"itemLeadingIcon": "size-5",
				"itemLeadingAvatarSize": "2xs",
				"itemTrailingIcon": "size-5",
				"itemTrailingKbds": "gap-0.5",
				"itemTrailingKbdsSize": "md"
			},
			"lg": {
				"label": "p-2 text-sm gap-2",
				"item": "p-2 text-sm gap-2",
				"empty": "p-3 text-sm",
				"itemLeadingIcon": "size-5",
				"itemLeadingAvatarSize": "2xs",
				"itemTrailingIcon": "size-5",
				"itemTrailingKbds": "gap-1",
				"itemTrailingKbdsSize": "md"
			},
			"xl": {
				"label": "p-2 text-base gap-2",
				"item": "p-2 text-base gap-2",
				"empty": "p-3 text-base",
				"itemLeadingIcon": "size-6",
				"itemLeadingAvatarSize": "xs",
				"itemTrailingIcon": "size-6",
				"itemTrailingKbds": "gap-1",
				"itemTrailingKbdsSize": "lg"
			}
		}
	},
	"compoundVariants": [
		{
			"color": "primary",
			"active": false,
			"class": {
				"item": "text-primary data-highlighted:text-primary data-highlighted:before:bg-primary/10 data-[state=open]:before:bg-primary/10",
				"itemLeadingIcon": "text-primary/75 group-data-highlighted:text-primary group-data-[state=open]:text-primary"
			}
		},
		{
			"color": "secondary",
			"active": false,
			"class": {
				"item": "text-secondary data-highlighted:text-secondary data-highlighted:before:bg-secondary/10 data-[state=open]:before:bg-secondary/10",
				"itemLeadingIcon": "text-secondary/75 group-data-highlighted:text-secondary group-data-[state=open]:text-secondary"
			}
		},
		{
			"color": "success",
			"active": false,
			"class": {
				"item": "text-success data-highlighted:text-success data-highlighted:before:bg-success/10 data-[state=open]:before:bg-success/10",
				"itemLeadingIcon": "text-success/75 group-data-highlighted:text-success group-data-[state=open]:text-success"
			}
		},
		{
			"color": "info",
			"active": false,
			"class": {
				"item": "text-info data-highlighted:text-info data-highlighted:before:bg-info/10 data-[state=open]:before:bg-info/10",
				"itemLeadingIcon": "text-info/75 group-data-highlighted:text-info group-data-[state=open]:text-info"
			}
		},
		{
			"color": "warning",
			"active": false,
			"class": {
				"item": "text-warning data-highlighted:text-warning data-highlighted:before:bg-warning/10 data-[state=open]:before:bg-warning/10",
				"itemLeadingIcon": "text-warning/75 group-data-highlighted:text-warning group-data-[state=open]:text-warning"
			}
		},
		{
			"color": "error",
			"active": false,
			"class": {
				"item": "text-error data-highlighted:text-error data-highlighted:before:bg-error/10 data-[state=open]:before:bg-error/10",
				"itemLeadingIcon": "text-error/75 group-data-highlighted:text-error group-data-[state=open]:text-error"
			}
		},
		{
			"color": "primary",
			"active": true,
			"class": {
				"item": "text-primary before:bg-primary/10",
				"itemLeadingIcon": "text-primary"
			}
		},
		{
			"color": "secondary",
			"active": true,
			"class": {
				"item": "text-secondary before:bg-secondary/10",
				"itemLeadingIcon": "text-secondary"
			}
		},
		{
			"color": "success",
			"active": true,
			"class": {
				"item": "text-success before:bg-success/10",
				"itemLeadingIcon": "text-success"
			}
		},
		{
			"color": "info",
			"active": true,
			"class": {
				"item": "text-info before:bg-info/10",
				"itemLeadingIcon": "text-info"
			}
		},
		{
			"color": "warning",
			"active": true,
			"class": {
				"item": "text-warning before:bg-warning/10",
				"itemLeadingIcon": "text-warning"
			}
		},
		{
			"color": "error",
			"active": true,
			"class": {
				"item": "text-error before:bg-error/10",
				"itemLeadingIcon": "text-error"
			}
		}
	],
	"defaultVariants": { "size": "md" }
};
// ../../../../node_modules/@nuxt/ui/dist/runtime/components/DropdownMenu.vue
var _sfc_main$6 = {
	__name: "DropdownMenu",
	props: /*@__PURE__*/ mergeModels({
		size: {
			type: null,
			required: false
		},
		items: {
			type: null,
			required: false
		},
		checkedIcon: {
			type: null,
			required: false
		},
		loadingIcon: {
			type: null,
			required: false
		},
		externalIcon: {
			type: [Boolean, String],
			required: false,
			skipCheck: true,
			default: true
		},
		content: {
			type: Object,
			required: false
		},
		arrow: {
			type: [Boolean, Object],
			required: false
		},
		portal: {
			type: [Boolean, String],
			required: false,
			skipCheck: true,
			default: true
		},
		labelKey: {
			type: null,
			required: false,
			default: "label"
		},
		descriptionKey: {
			type: null,
			required: false,
			default: "description"
		},
		filter: {
			type: [Boolean, Object],
			required: false,
			default: false
		},
		filterFields: {
			type: Array,
			required: false
		},
		ignoreFilter: {
			type: Boolean,
			required: false,
			default: false
		},
		disabled: {
			type: Boolean,
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
		defaultOpen: {
			type: Boolean,
			required: false
		},
		open: {
			type: Boolean,
			required: false
		},
		modal: {
			type: Boolean,
			required: false,
			default: true
		}
	}, {
		"searchTerm": {
			type: String,
			default: ""
		},
		"searchTermModifiers": {}
	}),
	emits: /*@__PURE__*/ mergeModels(["update:open"], ["update:searchTerm"]),
	setup(__props, { expose: __expose, emit: __emit }) {
		__expose();
		const _props = __props;
		const emits = __emit;
		const slots = useSlots();
		const searchTerm = useModel(__props, "searchTerm", {
			type: String,
			default: ""
		});
		const props = useComponentProps("dropdownMenu", _props);
		const appConfig = useAppConfig();
		const rootProps = useForwardProps$1(reactivePick(props, "defaultOpen", "open", "modal"), emits);
		const contentProps = toRef(() => defu(props.content, {
			side: "bottom",
			sideOffset: 8,
			collisionPadding: 8
		}));
		const arrowProps = toRef(() => defu(props.arrow, { rounded: true }));
		const getProxySlots = () => omit(slots, ["default"]);
		const __returned__ = {
			_props,
			emits,
			slots,
			searchTerm,
			props,
			appConfig,
			rootProps,
			contentProps,
			arrowProps,
			getProxySlots,
			ui: computed(() => tv({
				extend: dropdown_menu_default,
				...appConfig.ui?.dropdownMenu || {}
			})({ size: props.size })),
			get theme() {
				return dropdown_menu_default;
			},
			computed,
			toRef,
			get defu() {
				return defu;
			},
			get DropdownMenuRoot() {
				return DropdownMenuRoot_default;
			},
			get DropdownMenuTrigger() {
				return DropdownMenuTrigger_default;
			},
			get DropdownMenuArrow() {
				return DropdownMenuArrow_default;
			},
			get reactivePick() {
				return reactivePick;
			},
			get useAppConfig() {
				return useAppConfig;
			},
			get useComponentProps() {
				return useComponentProps;
			},
			get useForwardProps() {
				return useForwardProps$1;
			},
			get omit() {
				return omit;
			},
			get tv() {
				return tv;
			},
			UDropdownMenuContent: DropdownMenuContent_default
		};
		Object.defineProperty(__returned__, "__isScriptSetup", {
			enumerable: false,
			value: true
		});
		return __returned__;
	}
};
function _sfc_render$16(_ctx, _cache, $props, $setup, $data, $options) {
	return openBlock(), createBlock($setup["DropdownMenuRoot"], normalizeProps(guardReactiveProps($setup.rootProps)), {
		default: withCtx(({ open }) => [!!$setup.slots.default ? (openBlock(), createBlock($setup["DropdownMenuTrigger"], {
			key: 0,
			"as-child": "",
			class: normalizeClass($setup.props.class),
			disabled: $setup.props.disabled
		}, {
			default: withCtx(() => [renderSlot(_ctx.$slots, "default", { open })]),
			_: 2
		}, 1032, ["class", "disabled"])) : createCommentVNode("", true), createVNode($setup["UDropdownMenuContent"], mergeProps({
			"search-term": $setup.searchTerm,
			"onUpdate:searchTerm": _cache[0] || (_cache[0] = ($event) => $setup.searchTerm = $event),
			class: $setup.ui.content({ class: [!$setup.slots.default && $setup.props.class, $setup.props.ui?.content] }),
			ui: $setup.ui,
			"ui-override": $setup.props.ui
		}, $setup.contentProps, {
			items: $setup.props.items,
			portal: $setup.props.portal,
			"label-key": $setup.props.labelKey,
			"description-key": $setup.props.descriptionKey,
			"checked-icon": $setup.props.checkedIcon,
			"loading-icon": $setup.props.loadingIcon,
			"external-icon": $setup.props.externalIcon,
			size: $setup.props.size,
			filter: $setup.props.filter,
			"filter-fields": $setup.props.filterFields,
			"ignore-filter": $setup.props.ignoreFilter
		}), createSlots({
			default: withCtx(() => [!!$setup.props.arrow ? (openBlock(), createBlock($setup["DropdownMenuArrow"], mergeProps({ key: 0 }, $setup.arrowProps, {
				"data-slot": "arrow",
				class: $setup.ui.arrow({ class: $setup.props.ui?.arrow })
			}), null, 16, ["class"])) : createCommentVNode("", true)]),
			_: 2
		}, [renderList($setup.getProxySlots(), (_, name) => {
			return {
				name,
				fn: withCtx((slotData) => [renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotData)))])
			};
		})]), 1040, [
			"search-term",
			"class",
			"ui",
			"ui-override",
			"items",
			"portal",
			"label-key",
			"description-key",
			"checked-icon",
			"loading-icon",
			"external-icon",
			"size",
			"filter",
			"filter-fields",
			"ignore-filter"
		])]),
		_: 3
	}, 16);
}
var DropdownMenu_default = /*@__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$6, [["render", _sfc_render$16], ["__file", "DropdownMenu.vue"]]);
// virtual:nuxt-ui-templates/ui/editor-drag-handle.ts
var editor_drag_handle_default = { "slots": {
	"root": "hidden sm:flex items-center justify-center transition-[top,left] duration-200 ease-out motion-reduce:transition-none",
	"handle": "cursor-grab px-1"
} };
// ../../../../node_modules/@nuxt/ui/dist/runtime/components/EditorDragHandle.vue
var _sfc_main$5 = /*@__PURE__*/ Object.assign({ inheritAttrs: false }, {
	__name: "EditorDragHandle",
	props: {
		icon: {
			type: null,
			required: false
		},
		color: {
			type: null,
			required: false,
			default: "neutral"
		},
		variant: {
			type: null,
			required: false,
			default: "ghost"
		},
		options: {
			type: Object,
			required: false
		},
		editor: {
			type: Object,
			required: true
		},
		ui: {
			type: Object,
			required: false
		},
		pluginKey: {
			type: [Object, String],
			required: false
		},
		nestedOptions: {
			type: Object,
			required: false
		},
		onElementDragStart: {
			type: Function,
			required: false
		},
		onElementDragEnd: {
			type: Function,
			required: false
		},
		getReferencedVirtualElement: {
			type: Function,
			required: false
		},
		dragImageProperties: {
			type: Array,
			required: false
		},
		nested: {
			type: [Boolean, Object],
			required: false
		},
		label: {
			type: String,
			required: false
		},
		activeColor: {
			type: null,
			required: false
		},
		activeVariant: {
			type: null,
			required: false
		},
		size: {
			type: null,
			required: false,
			default: "sm"
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
		exactActiveClass: {
			type: String,
			required: false
		},
		viewTransition: {
			type: Boolean,
			required: false
		}
	},
	emits: ["nodeChange", "hover"],
	setup(__props, { expose: __expose, emit: __emit }) {
		__expose();
		const _props = __props;
		const emit = __emit;
		const props = useComponentProps("editorDragHandle", _props);
		const dragHandleProps = useForwardProps$1(reactivePick(props, "pluginKey", "nested", "nestedOptions", "onElementDragEnd", "onElementDragStart", "getReferencedVirtualElement"));
		const buttonProps = useForwardProps$1(reactiveOmit(props, "icon", "options", "editor", "pluginKey", "nested", "nestedOptions", "onElementDragEnd", "onElementDragStart", "getReferencedVirtualElement", "class", "ui"));
		const appConfig = useAppConfig();
		const ui = computed(() => tv({
			extend: editor_drag_handle_default,
			...appConfig.ui?.editorDragHandle || {}
		})());
		const floatingUIOptions = computed(() => defu(props.options, {
			strategy: "absolute",
			placement: "left-start",
			offset: ({ rects }) => {
				const blockHeight = rects.reference.height;
				const handleHeight = rects.floating.height;
				if (blockHeight > 40) return {
					alignmentAxis: 0,
					mainAxis: 8
				};
				return {
					alignmentAxis: (blockHeight - handleHeight) / 2,
					mainAxis: 8
				};
			},
			flip: {},
			shift: {},
			size: false,
			autoPlacement: false,
			hide: false,
			inline: false
		}));
		const middleware = computed(() => buildFloatingUIMiddleware(floatingUIOptions.value));
		const computePositionConfig = computed(() => ({
			placement: floatingUIOptions.value.placement,
			strategy: floatingUIOptions.value.strategy,
			middleware: middleware.value
		}));
		const currentNodePos = ref();
		function onNodeChange({ pos }) {
			currentNodePos.value = pos;
			if (pos == null || pos < 0) return;
			const node = props.editor.state.doc.nodeAt(pos);
			if (node) emit("hover", {
				node: node.toJSON(),
				pos
			});
		}
		function onClick() {
			if (!props.editor) return;
			const pos = currentNodePos.value;
			if (pos == null || pos < 0) return;
			const node = props.editor.state.doc.nodeAt(pos);
			if (node) {
				const selectedNode = {
					node: node.toJSON(),
					pos
				};
				emit("nodeChange", selectedNode);
				props.editor.chain().setNodeSelection(pos).run();
				return selectedNode;
			}
		}
		const __returned__ = {
			_props,
			emit,
			props,
			dragHandleProps,
			buttonProps,
			appConfig,
			ui,
			floatingUIOptions,
			middleware,
			computePositionConfig,
			currentNodePos,
			onNodeChange,
			onClick,
			get theme() {
				return editor_drag_handle_default;
			},
			computed,
			ref,
			get DragHandle() {
				return DragHandle;
			},
			get reactiveOmit() {
				return reactiveOmit;
			},
			get reactivePick() {
				return reactivePick;
			},
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
				return useForwardProps$1;
			},
			get buildFloatingUIMiddleware() {
				return buildFloatingUIMiddleware;
			},
			get transformUI() {
				return transformUI;
			},
			get tv() {
				return tv;
			},
			UButton: Button_default
		};
		Object.defineProperty(__returned__, "__isScriptSetup", {
			enumerable: false,
			value: true
		});
		return __returned__;
	}
});
function _sfc_render$15(_ctx, _cache, $props, $setup, $data, $options) {
	return openBlock(), createBlock($setup["DragHandle"], mergeProps($setup.dragHandleProps, {
		"compute-position-config": $setup.computePositionConfig,
		editor: $setup.props.editor,
		"on-node-change": $setup.onNodeChange,
		"data-slot": _ctx.$attrs["data-slot"] ?? "root",
		class: $setup.ui.root({ class: [$setup.props.ui?.root, $setup.props.class] }),
		onClick: $setup.onClick
	}), {
		default: withCtx(() => [renderSlot(_ctx.$slots, "default", {
			ui: $setup.ui,
			onClick: $setup.onClick
		}, () => [createVNode($setup["UButton"], mergeProps({
			...$setup.buttonProps,
			icon: $setup.props.icon || $setup.appConfig.ui.icons.drag,
			..._ctx.$attrs
		}, {
			"data-slot": "handle",
			class: $setup.ui.handle({ class: [$setup.props.ui?.handle, $setup.props.class] }),
			ui: $setup.transformUI($setup.ui, $setup.props.ui)
		}), null, 16, ["class", "ui"])])]),
		_: 3
	}, 16, [
		"compute-position-config",
		"editor",
		"data-slot",
		"class"
	]);
}
var EditorDragHandle_default$1 = /*@__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$5, [["render", _sfc_render$15], ["__file", "EditorDragHandle.vue"]]);
// src/vue/components/NuxtEditor/EditorDragHandle.vue?vue&type=script&setup=true&lang.ts
var EditorDragHandle_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "EditorDragHandle",
	props: {
		editor: {},
		handlers: {},
		blockMenuItems: { type: Function }
	},
	emits: ["node-change"],
	setup(__props, { expose: __expose, emit: __emit }) {
		__expose();
		const props = __props;
		const emit = __emit;
		function addBlock(e, onClick) {
			e.stopPropagation();
			const selected = onClick();
			props.handlers.suggestion?.execute(props.editor, { pos: selected?.pos }).run();
		}
		function lockHandle(open) {
			props.editor.chain().setMeta("lockDragHandle", open).run();
		}
		const __returned__ = {
			props,
			emit,
			addBlock,
			lockHandle,
			UButton: Button_default,
			UDropdownMenu: DropdownMenu_default,
			UEditorDragHandle: EditorDragHandle_default$1
		};
		Object.defineProperty(__returned__, "__isScriptSetup", {
			enumerable: false,
			value: true
		});
		return __returned__;
	}
});
// src/vue/components/NuxtEditor/EditorDragHandle.vue
function _sfc_render$14(_ctx, _cache, $props, $setup, $data, $options) {
	return openBlock(), createBlock($setup["UEditorDragHandle"], {
		editor: $props.editor,
		onNodeChange: _cache[0] || (_cache[0] = ($event) => $setup.emit("node-change", $event))
	}, {
		default: withCtx(({ ui, onClick }) => [createVNode($setup["UButton"], {
			icon: "i-lucide-plus",
			color: "neutral",
			variant: "ghost",
			size: "sm",
			class: normalizeClass(ui.handle()),
			onClick: ($event) => $setup.addBlock($event, onClick)
		}, null, 8, ["class", "onClick"]), createVNode($setup["UDropdownMenu"], {
			modal: false,
			items: $props.blockMenuItems($props.editor),
			content: { side: "left" },
			ui: { content: "w-48" },
			"onUpdate:open": $setup.lockHandle
		}, {
			default: withCtx(({ open }) => [createVNode($setup["UButton"], {
				icon: "i-lucide-grip-vertical",
				color: "neutral",
				variant: "ghost",
				"active-variant": "soft",
				size: "sm",
				active: open,
				class: normalizeClass(ui.handle())
			}, null, 8, ["active", "class"])]),
			_: 2
		}, 1032, ["items"])]),
		_: 1
	}, 8, ["editor"]);
}
var EditorDragHandle_default = /*@__PURE__*/ _plugin_vue_export_helper_default(EditorDragHandle_vue_vue_type_script_setup_true_lang_default, [["render", _sfc_render$14], ["__file", "EditorDragHandle.vue"]]);
// virtual:nuxt-ui-templates/ui/tooltip.ts
var tooltip_default = { "slots": {
	"content": "flex items-center gap-1 bg-default text-highlighted shadow-sm rounded-sm ring ring-default h-6 px-2.5 py-1 text-xs select-none data-[state=delayed-open]:animate-[scale-in_100ms_var(--ease-out)] data-[state=closed]:animate-[scale-out_100ms_var(--ease-out)] origin-(--reka-tooltip-content-transform-origin) pointer-events-auto",
	"arrow": "fill-bg stroke-default",
	"text": "truncate",
	"kbds": "hidden lg:inline-flex items-center shrink-0 gap-0.5 not-first-of-type:before:content-['·'] not-first-of-type:before:me-0.5",
	"kbdsSize": "sm"
} };
// ../../../../node_modules/@nuxt/ui/dist/runtime/components/Tooltip.vue
var _sfc_main$4 = {
	__name: "Tooltip",
	props: {
		text: {
			type: String,
			required: false
		},
		kbds: {
			type: Array,
			required: false
		},
		content: {
			type: Object,
			required: false
		},
		arrow: {
			type: [Boolean, Object],
			required: false
		},
		portal: {
			type: [Boolean, String],
			required: false,
			skipCheck: true,
			default: true
		},
		reference: {
			type: null,
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
		defaultOpen: {
			type: Boolean,
			required: false
		},
		open: {
			type: Boolean,
			required: false
		},
		delayDuration: {
			type: Number,
			required: false
		},
		disableHoverableContent: {
			type: Boolean,
			required: false
		},
		disableClosingTrigger: {
			type: Boolean,
			required: false
		},
		disabled: {
			type: Boolean,
			required: false
		},
		ignoreNonKeyboardFocus: {
			type: Boolean,
			required: false
		}
	},
	emits: ["update:open"],
	setup(__props, { expose: __expose, emit: __emit }) {
		__expose();
		const _props = __props;
		const emits = __emit;
		const slots = useSlots();
		const props = useComponentProps("tooltip", _props);
		const appConfig = useAppConfig();
		const providerContext = injectTooltipProviderContext();
		const rootProps = useForwardProps$1(reactivePick(props, "defaultOpen", "open", "delayDuration", "disableHoverableContent", "disableClosingTrigger", "ignoreNonKeyboardFocus"), emits);
		const portalProps = usePortal(toRef(() => props.portal));
		const contentProps = toRef(() => defu(props.content, providerContext.content.value, {
			side: "bottom",
			sideOffset: 8,
			collisionPadding: 8
		}));
		const arrowProps = toRef(() => defu(props.arrow, { rounded: true }));
		const { getKbdKey } = useKbd();
		const __returned__ = {
			_props,
			emits,
			slots,
			props,
			appConfig,
			providerContext,
			rootProps,
			portalProps,
			contentProps,
			arrowProps,
			getKbdKey,
			ariaLabel: computed(() => {
				if (contentProps.value.ariaLabel || slots.content) return contentProps.value.ariaLabel;
				return [props.text, ...(props.kbds || []).map((kbd) => getKbdKey(typeof kbd === "object" ? kbd.value : kbd))].filter(Boolean).join(" ");
			}),
			ui: computed(() => tv({
				extend: tooltip_default,
				...appConfig.ui?.tooltip || {}
			})({ side: contentProps.value.side })),
			get theme() {
				return tooltip_default;
			},
			computed,
			toRef,
			get defu() {
				return defu;
			},
			get TooltipRoot() {
				return TooltipRoot_default;
			},
			get TooltipTrigger() {
				return TooltipTrigger_default;
			},
			get TooltipPortal() {
				return TooltipPortal_default;
			},
			get TooltipContent() {
				return TooltipContent_default;
			},
			get TooltipArrow() {
				return TooltipArrow_default;
			},
			get injectTooltipProviderContext() {
				return injectTooltipProviderContext;
			},
			get reactivePick() {
				return reactivePick;
			},
			get useAppConfig() {
				return useAppConfig;
			},
			get useKbd() {
				return useKbd;
			},
			get useComponentProps() {
				return useComponentProps;
			},
			get useForwardProps() {
				return useForwardProps$1;
			},
			get FieldGroupReset() {
				return FieldGroupReset;
			},
			get usePortal() {
				return usePortal;
			},
			get tv() {
				return tv;
			},
			UKbd: Kbd_default
		};
		Object.defineProperty(__returned__, "__isScriptSetup", {
			enumerable: false,
			value: true
		});
		return __returned__;
	}
};
function _sfc_render$13(_ctx, _cache, $props, $setup, $data, $options) {
	return openBlock(), createBlock($setup["TooltipRoot"], mergeProps($setup.rootProps, { disabled: !($setup.props.text || $setup.props.kbds?.length || !!$setup.slots.content) || $setup.props.disabled }), {
		default: withCtx(({ open }) => [!!$setup.slots.default || !!$setup.props.reference ? (openBlock(), createBlock($setup["TooltipTrigger"], mergeProps({ key: 0 }, _ctx.$attrs, {
			"as-child": "",
			reference: $setup.props.reference,
			class: $setup.props.class
		}), {
			default: withCtx(() => [renderSlot(_ctx.$slots, "default", { open })]),
			_: 2
		}, 1040, ["reference", "class"])) : createCommentVNode("", true), createVNode($setup["TooltipPortal"], normalizeProps(guardReactiveProps($setup.portalProps)), {
			default: withCtx(() => [createVNode($setup["FieldGroupReset"], null, {
				default: withCtx(() => [createVNode($setup["TooltipContent"], mergeProps($setup.contentProps, {
					"aria-label": $setup.ariaLabel,
					"data-slot": "content",
					class: $setup.ui.content({ class: [!$setup.slots.default && $setup.props.class, $setup.props.ui?.content] })
				}), {
					default: withCtx(() => [renderSlot(_ctx.$slots, "content", { ui: $setup.ui }, () => [$setup.props.text ? (openBlock(), createElementBlock("span", {
						key: 0,
						"data-slot": "text",
						class: normalizeClass($setup.ui.text({ class: $setup.props.ui?.text }))
					}, toDisplayString($setup.props.text), 3)) : createCommentVNode("", true), $setup.props.kbds?.length ? (openBlock(), createElementBlock("span", {
						key: 1,
						"data-slot": "kbds",
						class: normalizeClass($setup.ui.kbds({ class: $setup.props.ui?.kbds }))
					}, [(openBlock(true), createElementBlock(Fragment, null, renderList($setup.props.kbds, (kbd, index) => {
						return openBlock(), createBlock($setup["UKbd"], mergeProps({
							key: index,
							size: $setup.props.ui?.kbdsSize || $setup.ui.kbdsSize()
						}, { ref_for: true }, typeof kbd === "string" ? { value: kbd } : kbd), null, 16, ["size"]);
					}), 128))], 2)) : createCommentVNode("", true)]), !!$setup.props.arrow ? (openBlock(), createBlock($setup["TooltipArrow"], mergeProps({ key: 0 }, $setup.arrowProps, {
						"data-slot": "arrow",
						class: $setup.ui.arrow({ class: $setup.props.ui?.arrow })
					}), null, 16, ["class"])) : createCommentVNode("", true)]),
					_: 3
				}, 16, ["aria-label", "class"])]),
				_: 3
			})]),
			_: 3
		}, 16)]),
		_: 3
	}, 16, ["disabled"]);
}
var Tooltip_default = /*@__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$4, [["render", _sfc_render$13], ["__file", "Tooltip.vue"]]);
// virtual:nuxt-ui-templates/ui/editor-toolbar.ts
var editor_toolbar_default = {
	"slots": {
		"root": "focus:outline-none",
		"base": "flex items-stretch gap-1.5",
		"group": "flex items-center gap-0.5",
		"separator": "w-px self-stretch bg-border"
	},
	"variants": { "layout": {
		"bubble": { "base": "bg-default border border-default rounded-lg p-1" },
		"floating": { "base": "bg-default border border-default rounded-lg p-1" },
		"fixed": { "base": "" }
	} }
};
// ../../../../node_modules/@nuxt/ui/dist/runtime/components/EditorToolbar.vue
var _sfc_main$3 = /*@__PURE__*/ Object.assign({ inheritAttrs: false }, {
	__name: "EditorToolbar",
	props: {
		as: {
			type: null,
			required: false
		},
		color: {
			type: null,
			required: false,
			default: "neutral"
		},
		variant: {
			type: null,
			required: false,
			default: "ghost"
		},
		activeColor: {
			type: null,
			required: false,
			default: "primary"
		},
		activeVariant: {
			type: null,
			required: false,
			default: "soft"
		},
		size: {
			type: null,
			required: false,
			default: "sm"
		},
		items: {
			type: null,
			required: false
		},
		editor: {
			type: Object,
			required: true
		},
		class: {
			type: null,
			required: false
		},
		ui: {
			type: Object,
			required: false
		},
		layout: {
			type: String,
			required: false,
			default: "fixed"
		},
		pluginKey: {
			type: [Object, String],
			required: false
		},
		updateDelay: {
			type: Number,
			required: false
		},
		resizeDelay: {
			type: Number,
			required: false
		},
		shouldShow: {
			type: [Function, null],
			required: false
		},
		appendTo: {
			type: Function,
			required: false,
			skipCheck: true
		},
		getReferencedVirtualElement: {
			type: Function,
			required: false
		},
		options: {
			type: Object,
			required: false
		}
	},
	setup(__props, { expose: __expose }) {
		__expose();
		const _props = __props;
		const props = useComponentProps("editorToolbar", _props);
		const appConfig = useAppConfig();
		const handlers = inject("editorHandlers", computed(() => createHandlers()));
		const Component = computed(() => {
			return {
				bubble: BubbleMenu,
				floating: FloatingMenu,
				fixed: "template"
			}[props.layout];
		});
		const rootProps = useForwardProps$1(reactiveOmit(props, "as", "color", "variant", "activeColor", "activeVariant", "size", "items", "layout", "editor", "class", "ui"));
		const options = computed(() => defu(props.options, {
			offset: 8,
			shift: { padding: 8 }
		}));
		const ui = computed(() => tv({
			extend: editor_toolbar_default,
			...appConfig.ui?.editorToolbar || {}
		})({ layout: props.layout }));
		const groups = computed(() => props.items?.length ? isArrayOfArray(props.items) ? props.items : [props.items] : []);
		function isActive(item) {
			if (!props.editor?.isEditable) return false;
			if ("items" in item && item.items?.length) return item.items?.some((item2) => isActive(item2)) || false;
			if (!("kind" in item)) return item.active ?? false;
			return (handlers?.value?.[item.kind])?.isActive(props.editor, item) || false;
		}
		function isDisabled(item) {
			if (!props.editor?.isEditable) return true;
			if ("items" in item && item.items?.length) {
				const actionableItems = (isArrayOfArray(item.items) ? item.items.flat() : item.items).filter((item2) => item2.type !== "separator" && item2.type !== "label");
				if (actionableItems.length === 0) return true;
				return actionableItems.every((item2) => isDisabled(item2));
			}
			if (!("kind" in item)) return item.disabled ?? false;
			const handler = handlers?.value?.[item.kind];
			if (!handler) return false;
			if (handler.isDisabled?.(props.editor, item)) return true;
			return !handler.canExecute(props.editor, item);
		}
		function onClick(e, item) {
			if (!props.editor?.isEditable || isDisabled(item)) return;
			if ("items" in item || !("kind" in item)) {
				if ("onClick" in item) for (const onClick2 of Array.isArray(item.onClick) ? item.onClick : [item.onClick]) onClick2?.(e);
				return;
			}
			const handler = handlers?.value?.[item.kind];
			if (handler) handler.execute(props.editor, item).run();
		}
		function getActiveChildItem(item) {
			if (!item.items) return;
			return (isArrayOfArray(item.items) ? item.items.flat() : item.items).find((childItem) => {
				if (!("kind" in childItem)) return false;
				return isActive(childItem);
			});
		}
		function getButtonProps(item) {
			const baseProps = omit(item, [
				"kind",
				"mark",
				"align",
				"level",
				"href",
				"src",
				"pos",
				"items",
				"slot",
				"checkedIcon",
				"loadingIcon",
				"externalIcon",
				"content",
				"arrow",
				"portal",
				"modal",
				"tooltip",
				"onClick"
			]);
			if ("items" in item && item.items?.length) {
				const activeChild = getActiveChildItem(item);
				if (activeChild?.icon) baseProps.icon = activeChild.icon;
				if (activeChild?.label && baseProps.label !== void 0) baseProps.label = activeChild.label;
			}
			return defu(baseProps, {
				"aria-label": baseProps.label ? void 0 : item.tooltip?.text,
				"color": props.color,
				"activeColor": props.activeColor,
				"activeVariant": props.activeVariant,
				"variant": props.variant,
				"size": props.size
			});
		}
		function getDropdownProps(item) {
			const baseProps = pick(item, [
				"size",
				"checkedIcon",
				"loadingIcon",
				"externalIcon",
				"content",
				"arrow",
				"portal",
				"modal",
				"ui"
			]);
			return defu(baseProps, {
				modal: false,
				size: props.size
			});
		}
		function mapDropdownItem(item) {
			const children = "children" in item && Array.isArray(item.children) ? item.children.map(mapDropdownItem) : void 0;
			if (!("kind" in item)) return children ? {
				...item,
				children
			} : item;
			const editorToolbarItem = item;
			return {
				...editorToolbarItem,
				...children && { children },
				active: isActive(editorToolbarItem),
				disabled: isDisabled(editorToolbarItem),
				onSelect: (e) => onClick(e, editorToolbarItem)
			};
		}
		function getDropdownItems(item) {
			if (!item.items) return [];
			return isArrayOfArray(item.items) ? item.items.map((group) => group.map(mapDropdownItem)) : [item.items.map(mapDropdownItem)];
		}
		const __returned__ = {
			_props,
			props,
			appConfig,
			handlers,
			Component,
			rootProps,
			options,
			ui,
			groups,
			isActive,
			isDisabled,
			onClick,
			getActiveChildItem,
			getButtonProps,
			getDropdownProps,
			mapDropdownItem,
			getDropdownItems,
			get theme() {
				return editor_toolbar_default;
			},
			computed,
			inject,
			get Primitive() {
				return Primitive;
			},
			get Separator() {
				return Separator_default$1;
			},
			get defu() {
				return defu;
			},
			get BubbleMenu() {
				return BubbleMenu;
			},
			get FloatingMenu() {
				return FloatingMenu;
			},
			get reactiveOmit() {
				return reactiveOmit;
			},
			get useAppConfig() {
				return useAppConfig;
			},
			get useComponentProps() {
				return useComponentProps;
			},
			get useForwardProps() {
				return useForwardProps$1;
			},
			get isArrayOfArray() {
				return isArrayOfArray;
			},
			get pick() {
				return pick;
			},
			get omit() {
				return omit;
			},
			get createHandlers() {
				return createHandlers;
			},
			get tv() {
				return tv;
			},
			UButton: Button_default,
			UDropdownMenu: DropdownMenu_default,
			UTooltip: Tooltip_default
		};
		Object.defineProperty(__returned__, "__isScriptSetup", {
			enumerable: false,
			value: true
		});
		return __returned__;
	}
});
function _sfc_render$12(_ctx, _cache, $props, $setup, $data, $options) {
	return openBlock(), createBlock($setup["Primitive"], mergeProps({ as: $setup.Component }, $setup.Component !== "template" ? {
		editor: $setup.props.editor,
		tabindex: -1,
		class: $setup.ui.root({ class: $setup.props.ui?.root }),
		...$setup.rootProps,
		options: $setup.options,
		..._ctx.$attrs
	} : { ..._ctx.$attrs }), {
		default: withCtx(() => [createVNode($setup["Primitive"], {
			as: $setup.props.as,
			role: "toolbar",
			"data-slot": "base",
			class: normalizeClass($setup.ui.base({ class: [$setup.props.ui?.base, $setup.props.class] }))
		}, {
			default: withCtx(() => [(openBlock(true), createElementBlock(Fragment, null, renderList($setup.groups, (group, groupIndex) => {
				return openBlock(), createElementBlock(Fragment, { key: `group-${groupIndex}` }, [createElementVNode("div", {
					role: "group",
					"data-slot": "group",
					class: normalizeClass($setup.ui.group({ class: $setup.props.ui?.group }))
				}, [(openBlock(true), createElementBlock(Fragment, null, renderList(group, (item, index) => {
					return renderSlot(_ctx.$slots, item.slot || "item", {
						item,
						index,
						isActive: $setup.isActive,
						isDisabled: $setup.isDisabled,
						onClick: $setup.onClick
					}, () => ["items" in item && item.items?.length ? (openBlock(), createBlock($setup["UDropdownMenu"], mergeProps({
						key: 0,
						ref_for: true
					}, $setup.getDropdownProps(item), { items: $setup.getDropdownItems(item) }), {
						default: withCtx(() => [item.tooltip ? (openBlock(), createBlock($setup["UTooltip"], mergeProps({
							key: 0,
							disabled: $setup.isDisabled(item)
						}, { ref_for: true }, { ...item.tooltip || {} }), {
							default: withCtx(() => [createVNode($setup["UButton"], mergeProps({
								active: $setup.isActive(item),
								disabled: $setup.isDisabled(item)
							}, { ref_for: true }, $setup.getButtonProps(item), { onClick: ($event) => $setup.onClick($event, item) }), null, 16, [
								"active",
								"disabled",
								"onClick"
							])]),
							_: 2
						}, 1040, ["disabled"])) : (openBlock(), createBlock($setup["UButton"], mergeProps({
							key: 1,
							active: $setup.isActive(item),
							disabled: $setup.isDisabled(item)
						}, { ref_for: true }, $setup.getButtonProps(item), { onClick: ($event) => $setup.onClick($event, item) }), null, 16, [
							"active",
							"disabled",
							"onClick"
						]))]),
						_: 2
					}, 1040, ["items"])) : item.tooltip ? (openBlock(), createBlock($setup["UTooltip"], mergeProps({
						key: 1,
						disabled: $setup.isDisabled(item)
					}, { ref_for: true }, { ...item.tooltip || {} }), {
						default: withCtx(() => [createVNode($setup["UButton"], mergeProps({
							active: $setup.isActive(item),
							disabled: $setup.isDisabled(item)
						}, { ref_for: true }, $setup.getButtonProps(item), {
							ui: item.ui,
							onClick: ($event) => $setup.onClick($event, item)
						}), null, 16, [
							"active",
							"disabled",
							"ui",
							"onClick"
						])]),
						_: 2
					}, 1040, ["disabled"])) : (openBlock(), createBlock($setup["UButton"], mergeProps({
						key: 2,
						active: $setup.isActive(item),
						disabled: $setup.isDisabled(item)
					}, { ref_for: true }, $setup.getButtonProps(item), {
						ui: item.ui,
						onClick: ($event) => $setup.onClick($event, item)
					}), null, 16, [
						"active",
						"disabled",
						"ui",
						"onClick"
					]))], void 0, `group-${groupIndex}-${index}`);
				}), 128))], 2), groupIndex < $setup.groups.length - 1 ? (openBlock(), createBlock($setup["Separator"], {
					key: 0,
					"data-slot": "separator",
					class: normalizeClass($setup.ui.separator({ class: $setup.props.ui?.separator })),
					orientation: "vertical"
				}, null, 8, ["class"])) : createCommentVNode("", true)], 64);
			}), 128))]),
			_: 3
		}, 8, ["as", "class"])]),
		_: 3
	}, 16, ["as"]);
}
var EditorToolbar_default = /*@__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$3, [["render", _sfc_render$12], ["__file", "EditorToolbar.vue"]]);
// ../../../../node_modules/@nuxt/ui/dist/runtime/composables/useEditorMenu.js
function useEditorMenu(options) {
	const filteredItems = ref([]);
	const selectedIndex = ref(0);
	const menuState = ref("closed");
	const searchTerm = options.searchTerm ?? ref("");
	let renderer = null;
	let element = null;
	let handleMouseDown = null;
	let commandFn = null;
	let keyDownHandler = null;
	let globalKeyHandler = null;
	let blurHandler = null;
	let triggerClientRect = null;
	let handleHover = null;
	let scrollHandler = null;
	let stopItemsWatch = null;
	const { score } = useFilter();
	const cleanupMenu = () => {
		if (menuState.value === "closed") return;
		menuState.value = "closed";
		if (globalKeyHandler) {
			document.removeEventListener("keydown", globalKeyHandler, true);
			globalKeyHandler = null;
		}
		if (blurHandler) {
			options.editor.view.dom.removeEventListener("blur", blurHandler);
			blurHandler = null;
		}
		if (scrollHandler) {
			window.removeEventListener("scroll", scrollHandler, true);
			scrollHandler = null;
		}
		if (element && handleMouseDown) {
			element.removeEventListener("mousedown", handleMouseDown);
			handleMouseDown = null;
		}
		if (renderer) {
			renderer.destroy();
			renderer = null;
		}
		if (element) {
			element.remove();
			element = null;
		}
	};
	const filterFields = options.filterFields ?? ["label"];
	const defaultFilter = (items2, query) => {
		if (!query) return items2;
		const scored = [];
		for (const item of items2) {
			let bestScore = null;
			for (const field of filterFields) {
				const value = get(item, field);
				if (value == null) continue;
				const values = Array.isArray(value) ? value.map(String) : [String(value)];
				for (const v of values) {
					const normalized = v.replace(/[\s_-]/g, "");
					const s = Math.min(score(v, query) ?? 3, score(normalized, query) ?? 3);
					if (bestScore === null || s < bestScore) bestScore = s;
					if (bestScore === 0) break;
				}
				if (bestScore === 0) break;
			}
			if (bestScore !== null && bestScore < 3) scored.push({
				item,
				score: bestScore
			});
		}
		scored.sort((a, b) => a.score - b.score);
		return scored.map(({ item }) => item);
	};
	const filter = options.filter || defaultFilter;
	const limit = options.limit ?? 42;
	const pluginKeyInstance = typeof options.pluginKey === "string" ? new PluginKey(options.pluginKey) : options.pluginKey;
	const groups = computed(() => {
		const items2 = unref(options.items);
		return items2?.length ? isArrayOfArray(items2) ? items2 : [items2] : [];
	});
	const items = computed(() => groups.value.flatMap((group) => group));
	const filteredGroups = computed(() => {
		if (!filteredItems.value.length) return [];
		if (options.ignoreFilter) return [filteredItems.value];
		return groups.value.map((group) => {
			const filtered = group.filter((item) => filteredItems.value.includes(item));
			filtered.sort((a, b) => filteredItems.value.indexOf(a) - filteredItems.value.indexOf(b));
			return filtered;
		}).filter((group) => group.length > 0);
	});
	const selectableItems = computed(() => {
		return filteredItems.value.filter((item) => {
			return item.type !== "label" && item.type !== "separator";
		});
	});
	const floatingUIOptions = defu(options.options, {
		strategy: "absolute",
		placement: "bottom-start",
		offset: 8,
		flip: {},
		shift: { padding: 8 },
		size: false,
		autoPlacement: false,
		hide: false,
		inline: false
	});
	const middleware = buildFloatingUIMiddleware(floatingUIOptions);
	const updatePosition = (el) => {
		if (!triggerClientRect) return;
		const rect = triggerClientRect();
		if (!rect) return;
		computePosition({ getBoundingClientRect: () => rect }, el, {
			placement: floatingUIOptions.placement,
			strategy: floatingUIOptions.strategy,
			middleware
		}).then(({ x, y, strategy }) => {
			el.style.width = "max-content";
			el.style.position = strategy;
			el.style.top = "0";
			el.style.left = "0";
			el.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
		});
	};
	const showMenu = () => {
		menuState.value = "open";
		if (!globalKeyHandler) {
			globalKeyHandler = (e) => {
				if (keyDownHandler) {
					if (keyDownHandler({ event: e })) {
						e.preventDefault();
						e.stopPropagation();
					}
				}
			};
			document.addEventListener("keydown", globalKeyHandler, true);
		}
		if (!blurHandler) {
			blurHandler = () => {
				setTimeout(() => {
					if (menuState.value === "open") {
						const tr = options.editor.view.state.tr.setMeta(pluginKeyInstance, { exit: true });
						options.editor.view.dispatch(tr);
					}
				}, 0);
			};
			options.editor.view.dom.addEventListener("blur", blurHandler);
		}
		if (!scrollHandler) {
			scrollHandler = () => {
				if (element) updatePosition(element);
			};
			window.addEventListener("scroll", scrollHandler, true);
		}
		handleHover = (index) => {
			selectedIndex.value = index;
			if (renderer) renderer.updateProps({
				groups: filteredGroups.value,
				selectedIndex: index,
				onSelect: commandFn,
				onHover: handleHover,
				state: menuState.value
			});
		};
		renderer = new VueRenderer(MenuComponent, {
			props: {
				groups: filteredGroups.value,
				selectedIndex: selectedIndex.value,
				onSelect: commandFn,
				onHover: handleHover,
				state: menuState.value
			},
			editor: options.editor
		});
		element = document.createElement("div");
		element.style.position = floatingUIOptions.strategy;
		element.style.zIndex = "50";
		handleMouseDown = (e) => {
			e.preventDefault();
		};
		element.addEventListener("mousedown", handleMouseDown);
		((typeof options.appendTo === "function" ? options.appendTo() : options.appendTo) ?? options.editor.view.dom.parentElement)?.appendChild(element);
		if (renderer.element) element.appendChild(renderer.element);
		updatePosition(element);
	};
	if (options.ignoreFilter) stopItemsWatch = watch(() => unref(options.items), (newItems) => {
		if (!triggerClientRect) return;
		const normalizedItems = newItems?.length ? isArrayOfArray(newItems) ? newItems.flat() : newItems : [];
		filteredItems.value = normalizedItems.slice(0, limit);
		if (!filteredItems.value.length) {
			cleanupMenu();
			return;
		}
		if (selectedIndex.value >= selectableItems.value.length) selectedIndex.value = Math.max(0, selectableItems.value.length - 1);
		if (menuState.value === "closed" && filteredItems.value.length) {
			showMenu();
			return;
		}
		if (renderer) renderer.updateProps({
			groups: filteredGroups.value,
			selectedIndex: selectedIndex.value,
			onSelect: commandFn,
			onHover: handleHover,
			state: menuState.value
		});
		if (element) updatePosition(element);
	}, {
		deep: true,
		flush: "sync"
	});
	const MenuComponent = {
		props: {
			groups: {
				type: Array,
				required: true
			},
			selectedIndex: {
				type: Number,
				required: true
			},
			onSelect: {
				type: Function,
				required: true
			},
			onHover: {
				type: Function,
				required: true
			},
			state: {
				type: String,
				required: true
			}
		},
		setup(menuProps) {
			function handleClick(e, item, selectableIndex) {
				e.preventDefault();
				menuProps.onSelect(item, selectableIndex);
			}
			function handleMouseEnter(selectableIndex) {
				menuProps.onHover(selectableIndex);
			}
			return () => {
				const groupsData = menuProps.groups;
				const selectableIndexMap = /* @__PURE__ */ new Map();
				let selectableCounter = 0;
				for (const group of groupsData) for (const item of group) {
					const itemData = item;
					if (itemData.type !== "label" && itemData.type !== "separator") selectableIndexMap.set(item, selectableCounter++);
				}
				return h("div", {
					"class": options.ui.value.content(),
					"role": "listbox",
					"data-state": menuProps.state
				}, [h("div", {
					class: options.ui.value.viewport(),
					role: "presentation"
				}, groupsData.map((group, groupIndex) => h("div", {
					key: `group-${groupIndex}`,
					class: options.ui.value.group(),
					role: "group"
				}, group.map((item, itemInGroupIndex) => {
					const itemData = item;
					if (itemData.type === "label") return h("div", {
						key: `label-${groupIndex}-${itemInGroupIndex}`,
						class: options.ui.value.label({ class: itemData.class })
					}, options.renderItem(item, options.ui));
					if (itemData.type === "separator") return h("div", {
						key: `separator-${groupIndex}-${itemInGroupIndex}`,
						class: options.ui.value.separator({ class: itemData.class }),
						role: "separator"
					});
					const selectableIndex = selectableIndexMap.get(item);
					const isHighlighted = selectableIndex === menuProps.selectedIndex;
					return h("div", {
						"key": `item-${selectableIndex}`,
						"class": options.ui.value.item({
							class: itemData.class,
							active: false
						}),
						"role": "option",
						"aria-selected": isHighlighted,
						"data-highlighted": isHighlighted ? "" : void 0,
						"data-disabled": itemData.disabled ? "" : void 0,
						"onMousedown": (e) => handleClick(e, item, selectableIndex),
						"onMouseenter": () => handleMouseEnter(selectableIndex),
						"ref": (el) => {
							if (el && isHighlighted) el.scrollIntoView({
								block: "nearest",
								inline: "nearest"
							});
						}
					}, options.renderItem(item, options.ui));
				}))))]);
			};
		}
	};
	const plugin = Suggestion({
		...options.suggestion || {},
		pluginKey: pluginKeyInstance,
		editor: options.editor,
		char: options.char,
		items: ({ query: q }) => {
			searchTerm.value = q;
			if (options.ignoreFilter) return items.value.slice(0, limit);
			return filter(items.value, q).slice(0, limit);
		},
		command: ({ editor, range, props }) => {
			options.onSelect(editor, range, props);
		},
		render: () => {
			keyDownHandler = (props) => {
				const { event } = props;
				if (!renderer || !selectableItems.value.length) return false;
				if (event.key === "Escape") {
					cleanupMenu();
					return true;
				}
				if (event.key === "ArrowUp") {
					selectedIndex.value = (selectedIndex.value + selectableItems.value.length - 1) % selectableItems.value.length;
					renderer?.updateProps({
						groups: filteredGroups.value,
						selectedIndex: selectedIndex.value,
						onSelect: commandFn,
						onHover: handleHover,
						state: menuState.value
					});
					return true;
				}
				if (event.key === "ArrowDown") {
					selectedIndex.value = (selectedIndex.value + 1) % selectableItems.value.length;
					renderer?.updateProps({
						groups: filteredGroups.value,
						selectedIndex: selectedIndex.value,
						onSelect: commandFn,
						onHover: handleHover,
						state: menuState.value
					});
					return true;
				}
				if (event.key === "Enter" || event.key === "Tab") {
					const selectedItem = selectableItems.value[selectedIndex.value];
					if (selectedItem && commandFn) commandFn(selectedItem);
					return true;
				}
				return false;
			};
			return {
				onStart: (suggestionProps) => {
					selectedIndex.value = 0;
					commandFn = (item) => suggestionProps.command(item);
					triggerClientRect = suggestionProps.clientRect;
					if (suggestionProps.loading) return;
					filteredItems.value = options.ignoreFilter ? items.value.slice(0, limit) : suggestionProps.items;
					if (!filteredItems.value.length) return;
					showMenu();
				},
				onUpdate: (suggestionProps) => {
					commandFn = (item) => suggestionProps.command(item);
					if (suggestionProps.loading) return;
					filteredItems.value = options.ignoreFilter ? items.value.slice(0, limit) : suggestionProps.items;
					if (selectedIndex.value >= selectableItems.value.length) selectedIndex.value = Math.max(0, selectableItems.value.length - 1);
					if (!filteredItems.value.length) {
						cleanupMenu();
						return;
					}
					if (!renderer) showMenu();
					else renderer.updateProps({
						groups: filteredGroups.value,
						selectedIndex: selectedIndex.value,
						onSelect: commandFn,
						onHover: handleHover,
						state: menuState.value
					});
					if (element) updatePosition(element);
				},
				onKeyDown: keyDownHandler,
				onExit: () => {
					cleanupMenu();
					triggerClientRect = null;
					searchTerm.value = "";
				}
			};
		}
	});
	const destroy = () => {
		menuState.value = "closed";
		if (globalKeyHandler) {
			document.removeEventListener("keydown", globalKeyHandler, true);
			globalKeyHandler = null;
		}
		if (blurHandler) {
			options.editor.view.dom.removeEventListener("blur", blurHandler);
			blurHandler = null;
		}
		if (scrollHandler) {
			window.removeEventListener("scroll", scrollHandler, true);
			scrollHandler = null;
		}
		if (element && handleMouseDown) {
			element.removeEventListener("mousedown", handleMouseDown);
			handleMouseDown = null;
		}
		if (renderer) {
			renderer.destroy();
			renderer = null;
		}
		if (element) {
			element.remove();
			element = null;
		}
		if (stopItemsWatch) {
			stopItemsWatch();
			stopItemsWatch = null;
		}
	};
	return {
		plugin,
		destroy,
		filteredItems,
		searchTerm
	};
}
// virtual:nuxt-ui-templates/ui/editor-suggestion-menu.ts
var editor_suggestion_menu_default = {
	"slots": {
		"content": "min-w-48 max-w-60 max-h-96 bg-default shadow-lg rounded-md ring ring-default overflow-hidden data-[state=open]:animate-[scale-in_100ms_var(--ease-out)] data-[state=closed]:animate-[scale-out_100ms_var(--ease-out)] origin-(--reka-dropdown-menu-content-transform-origin) flex flex-col",
		"viewport": "relative divide-y divide-default scroll-py-1 overflow-y-auto flex-1",
		"group": "p-1 isolate",
		"label": "w-full flex items-center font-semibold text-highlighted",
		"separator": "-mx-1 my-1 h-px bg-border",
		"item": "group relative w-full flex items-start select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-md data-disabled:cursor-not-allowed data-disabled:opacity-75",
		"itemLeadingIcon": "shrink-0 flex items-center justify-center",
		"itemLeadingAvatar": "shrink-0",
		"itemLeadingAvatarSize": "",
		"itemWrapper": "flex-1 flex flex-col text-start min-w-0",
		"itemLabel": "truncate",
		"itemDescription": "truncate text-muted",
		"itemLabelExternalIcon": "inline-block size-3 align-top text-dimmed"
	},
	"variants": {
		"size": {
			"xs": {
				"label": "p-1 text-[10px]/3 gap-1",
				"item": "p-1 text-xs gap-1",
				"itemLeadingIcon": "size-4 text-sm",
				"itemLeadingAvatarSize": "3xs"
			},
			"sm": {
				"label": "p-1.5 text-[10px]/3 gap-1.5",
				"item": "p-1.5 text-xs gap-1.5",
				"itemLeadingIcon": "size-4 text-sm",
				"itemLeadingAvatarSize": "3xs"
			},
			"md": {
				"label": "p-1.5 text-xs gap-1.5",
				"item": "p-1.5 text-sm gap-1.5",
				"itemLeadingIcon": "size-5 text-base",
				"itemLeadingAvatarSize": "2xs"
			},
			"lg": {
				"label": "p-2 text-xs gap-2",
				"item": "p-2 text-sm gap-2",
				"itemLeadingIcon": "size-5 text-base",
				"itemLeadingAvatarSize": "2xs"
			},
			"xl": {
				"label": "p-2 text-sm gap-2",
				"item": "p-2 text-base gap-2",
				"itemLeadingIcon": "size-6 text-xl",
				"itemLeadingAvatarSize": "xs"
			}
		},
		"active": {
			"true": {
				"item": "text-highlighted before:bg-elevated/75",
				"itemLeadingIcon": "text-default"
			},
			"false": {
				"item": ["text-default data-highlighted:not-data-disabled:text-highlighted data-highlighted:not-data-disabled:before:bg-elevated/50", "transition-colors before:transition-colors"],
				"itemLeadingIcon": ["text-dimmed group-data-highlighted:not-group-data-disabled:text-default", "transition-colors"]
			}
		}
	},
	"defaultVariants": { "size": "md" }
};
// ../../../../node_modules/@nuxt/ui/dist/runtime/components/EditorSuggestionMenu.vue
var _sfc_main$2 = /*@__PURE__*/ Object.assign({ inheritAttrs: false }, {
	__name: "EditorSuggestionMenu",
	props: {
		size: {
			type: null,
			required: false
		},
		items: {
			type: Array,
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
		editor: {
			type: Object,
			required: false
		},
		char: {
			type: String,
			required: false,
			default: "/"
		},
		pluginKey: {
			type: String,
			required: false,
			default: "suggestionMenu"
		},
		filterFields: {
			type: Array,
			required: false
		},
		limit: {
			type: Number,
			required: false
		},
		options: {
			type: Object,
			required: false
		},
		suggestion: {
			type: Object,
			required: false
		},
		appendTo: {
			type: Function,
			required: false,
			skipCheck: true
		}
	},
	setup(__props, { expose: __expose }) {
		__expose();
		const props = __props;
		const appConfig = useAppConfig();
		const handlers = inject("editorHandlers", computed(() => createHandlers()));
		const ui = computed(() => tv({
			extend: editor_suggestion_menu_default,
			...appConfig.ui?.editorSuggestionMenu || {}
		})({ size: props.size }));
		let menu = null;
		onMounted(async () => {
			await nextTick();
			if (!props.editor || props.editor.isDestroyed) return;
			menu = useEditorMenu({
				editor: props.editor,
				char: props.char,
				pluginKey: props.pluginKey,
				items: toRef(() => props.items),
				filterFields: props.filterFields,
				limit: props.limit,
				options: props.options,
				suggestion: props.suggestion,
				appendTo: props.appendTo,
				ui,
				onSelect: (editor, range, item) => {
					if (item.type === "label" || item.type === "separator") return;
					editor.chain().focus().deleteRange(range).run();
					const handler = handlers?.value?.[item.kind];
					if (handler) handler.execute(editor, item).run();
				},
				renderItem: (item, styles) => {
					if (item.type === "label") return [h("span", {}, item.label)];
					return [item.icon ? h(Icon_default, {
						name: item.icon,
						class: styles.value.itemLeadingIcon()
					}) : null, h("span", { class: styles.value.itemWrapper() }, [h("span", { class: styles.value.itemLabel() }, item.label), item.description ? h("span", { class: styles.value.itemDescription() }, item.description) : null])];
				}
			});
			props.editor.registerPlugin(menu.plugin);
		});
		onBeforeUnmount(() => {
			if (menu) {
				menu.destroy();
				menu = null;
			}
			if (props.editor && !props.editor.isDestroyed) props.editor.unregisterPlugin(props.pluginKey);
		});
		const __returned__ = {
			props,
			appConfig,
			handlers,
			ui,
			get menu() {
				return menu;
			},
			set menu(v) {
				menu = v;
			},
			get theme() {
				return editor_suggestion_menu_default;
			},
			computed,
			h,
			inject,
			onMounted,
			onBeforeUnmount,
			nextTick,
			toRef,
			get useAppConfig() {
				return useAppConfig;
			},
			get useEditorMenu() {
				return useEditorMenu;
			},
			get createHandlers() {
				return createHandlers;
			},
			get tv() {
				return tv;
			},
			UIcon: Icon_default
		};
		Object.defineProperty(__returned__, "__isScriptSetup", {
			enumerable: false,
			value: true
		});
		return __returned__;
	}
});
function _sfc_render$11(_ctx, _cache, $props, $setup, $data, $options) {
	return openBlock(), createElementBlock("div");
}
var EditorSuggestionMenu_default = /*@__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$2, [["render", _sfc_render$11], ["__file", "EditorSuggestionMenu.vue"]]);
// src/composable/nuxt-editor/useBubbleVisibility.ts
function useBubbleVisibility() {
	const text = ({ editor, view, state }) => view.hasFocus() && !state.selection.empty && !editor.isActive("image") && !editor.isActive("imageUpload") && !editor.isActive("videoEmbed") && !editor.isActive("codeBlock");
	const link = ({ editor, view, state }) => (view.hasFocus() || !!view.dom.getRootNode().activeElement?.closest("[data-link-bar]")) && state.selection.empty && editor.isActive("link") && !editor.storage.videoEmbed?.key.getState(state);
	const image = ({ editor, view }) => editor.isActive("image") && view.hasFocus();
	const video = ({ editor, view }) => editor.isActive("videoEmbed") && !!editor.state.selection.node?.attrs.src && (view.hasFocus() || !!view.dom.getRootNode().activeElement?.closest("[data-video-source]"));
	const videoPrompt = ({ editor }) => !!editor.storage.videoEmbed?.key.getState(editor.state);
	return {
		text,
		link,
		image,
		video,
		videoPrompt
	};
}
// src/vue/components/NuxtEditor/ColorsDropdown.vue?vue&type=script&setup=true&lang.ts
var ColorsDropdown_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "ColorsDropdown",
	props: {
		items: {},
		icon: {},
		tooltip: {}
	},
	emits: ["open"],
	setup(__props, { expose: __expose, emit: __emit }) {
		__expose();
		const __returned__ = {
			emit: __emit,
			UButton: Button_default,
			UDropdownMenu: DropdownMenu_default,
			UTooltip: Tooltip_default
		};
		Object.defineProperty(__returned__, "__isScriptSetup", {
			enumerable: false,
			value: true
		});
		return __returned__;
	}
});
// src/vue/components/NuxtEditor/ColorsDropdown.vue
function _sfc_render$10(_ctx, _cache, $props, $setup, $data, $options) {
	return openBlock(), createBlock($setup["UDropdownMenu"], {
		modal: false,
		items: $props.items,
		content: { align: "start" },
		ui: { content: "w-48 max-h-72 overflow-y-auto" },
		"onUpdate:open": _cache[0] || (_cache[0] = (open) => open && $setup.emit("open"))
	}, {
		"swatch-leading": withCtx(({ item }) => [createElementVNode("span", {
			class: "size-4 shrink-0 rounded-full border border-default",
			style: normalizeStyle({ background: item.swatch })
		}, null, 4)]),
		"textSwatch-leading": withCtx(({ item }) => [createElementVNode("span", {
			class: "size-4 shrink-0 text-center text-sm font-bold leading-4",
			style: normalizeStyle({ color: item.swatch })
		}, "A", 4)]),
		default: withCtx(() => [createVNode($setup["UTooltip"], {
			text: $props.tooltip?.text,
			disabled: !$props.tooltip
		}, {
			default: withCtx(() => [createVNode($setup["UButton"], {
				icon: $props.icon,
				color: "neutral",
				variant: "ghost",
				size: "sm",
				"aria-label": $props.tooltip?.text
			}, null, 8, ["icon", "aria-label"])]),
			_: 1
		}, 8, ["text", "disabled"])]),
		_: 1
	}, 8, ["items"]);
}
var ColorsDropdown_default = /*@__PURE__*/ _plugin_vue_export_helper_default(ColorsDropdown_vue_vue_type_script_setup_true_lang_default, [["render", _sfc_render$10], ["__file", "ColorsDropdown.vue"]]);
// virtual:nuxt-ui-templates/ui/separator.ts
var separator_default = {
	"slots": {
		"root": "flex items-center text-center",
		"border": "",
		"container": "font-medium text-default flex",
		"icon": "shrink-0 size-5",
		"avatar": "shrink-0",
		"avatarSize": "2xs",
		"label": "text-sm"
	},
	"variants": {
		"color": {
			"primary": { "border": "border-primary" },
			"secondary": { "border": "border-secondary" },
			"success": { "border": "border-success" },
			"info": { "border": "border-info" },
			"warning": { "border": "border-warning" },
			"error": { "border": "border-error" },
			"neutral": { "border": "border-default" }
		},
		"orientation": {
			"horizontal": {
				"root": "w-full flex-row",
				"border": "w-full",
				"container": "whitespace-nowrap"
			},
			"vertical": {
				"root": "h-full flex-col",
				"border": "h-full",
				"container": ""
			}
		},
		"size": {
			"xs": "",
			"sm": "",
			"md": "",
			"lg": "",
			"xl": ""
		},
		"position": {
			"start": "",
			"center": "",
			"end": ""
		},
		"type": {
			"solid": { "border": "border-solid" },
			"dashed": { "border": "border-dashed" },
			"dotted": { "border": "border-dotted" }
		}
	},
	"compoundVariants": [
		{
			"orientation": "horizontal",
			"position": "start",
			"class": { "container": "me-3" }
		},
		{
			"orientation": "horizontal",
			"position": "center",
			"class": { "container": "mx-3" }
		},
		{
			"orientation": "horizontal",
			"position": "end",
			"class": { "container": "ms-3" }
		},
		{
			"orientation": "vertical",
			"position": "start",
			"class": { "container": "mb-2" }
		},
		{
			"orientation": "vertical",
			"position": "center",
			"class": { "container": "my-2" }
		},
		{
			"orientation": "vertical",
			"position": "end",
			"class": { "container": "mt-2" }
		},
		{
			"orientation": "horizontal",
			"size": "xs",
			"class": { "border": "border-t" }
		},
		{
			"orientation": "horizontal",
			"size": "sm",
			"class": { "border": "border-t-[2px]" }
		},
		{
			"orientation": "horizontal",
			"size": "md",
			"class": { "border": "border-t-[3px]" }
		},
		{
			"orientation": "horizontal",
			"size": "lg",
			"class": { "border": "border-t-[4px]" }
		},
		{
			"orientation": "horizontal",
			"size": "xl",
			"class": { "border": "border-t-[5px]" }
		},
		{
			"orientation": "vertical",
			"size": "xs",
			"class": { "border": "border-s" }
		},
		{
			"orientation": "vertical",
			"size": "sm",
			"class": { "border": "border-s-[2px]" }
		},
		{
			"orientation": "vertical",
			"size": "md",
			"class": { "border": "border-s-[3px]" }
		},
		{
			"orientation": "vertical",
			"size": "lg",
			"class": { "border": "border-s-[4px]" }
		},
		{
			"orientation": "vertical",
			"size": "xl",
			"class": { "border": "border-s-[5px]" }
		}
	],
	"defaultVariants": {
		"color": "neutral",
		"size": "xs",
		"type": "solid"
	}
};
// ../../../../node_modules/@nuxt/ui/dist/runtime/components/Separator.vue
var _sfc_main$1 = /*@__PURE__*/ Object.assign({ inheritAttrs: false }, {
	__name: "Separator",
	props: {
		as: {
			type: null,
			required: false
		},
		label: {
			type: String,
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
		color: {
			type: null,
			required: false
		},
		size: {
			type: null,
			required: false
		},
		type: {
			type: null,
			required: false
		},
		orientation: {
			type: null,
			required: false,
			default: "horizontal"
		},
		position: {
			type: null,
			required: false,
			default: "center"
		},
		class: {
			type: null,
			required: false
		},
		ui: {
			type: null,
			required: false
		},
		decorative: {
			type: Boolean,
			required: false
		}
	},
	setup(__props, { expose: __expose }) {
		__expose();
		const _props = __props;
		const slots = useSlots();
		const props = useComponentProps("separator", _props);
		const appConfig = useAppConfig();
		const rootProps = useForwardProps$1(reactivePick(props, "as", "decorative", "orientation"));
		const [DefineContainer, ReuseContainer] = createReusableTemplate();
		const __returned__ = {
			_props,
			slots,
			props,
			appConfig,
			rootProps,
			DefineContainer,
			ReuseContainer,
			hasContent: computed(() => !!(props.label || props.icon || props.avatar || slots.default)),
			ui: computed(() => tv({
				extend: separator_default,
				...appConfig.ui?.separator || {}
			})({
				color: props.color,
				orientation: props.orientation,
				size: props.size,
				position: props.position,
				type: props.type
			})),
			get theme() {
				return separator_default;
			},
			computed,
			get Separator() {
				return Separator_default$1;
			},
			get reactivePick() {
				return reactivePick;
			},
			get createReusableTemplate() {
				return createReusableTemplate;
			},
			get useAppConfig() {
				return useAppConfig;
			},
			get useComponentProps() {
				return useComponentProps;
			},
			get useForwardProps() {
				return useForwardProps$1;
			},
			get tv() {
				return tv;
			},
			UIcon: Icon_default,
			UAvatar: Avatar_default
		};
		Object.defineProperty(__returned__, "__isScriptSetup", {
			enumerable: false,
			value: true
		});
		return __returned__;
	}
});
function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
	return openBlock(), createElementBlock(Fragment, null, [createVNode($setup["DefineContainer"], null, {
		default: withCtx(() => [createElementVNode("div", {
			"data-slot": "container",
			class: normalizeClass($setup.ui.container({ class: $setup.props.ui?.container }))
		}, [renderSlot(_ctx.$slots, "default", { ui: $setup.ui }, () => [$setup.props.label ? (openBlock(), createElementBlock("span", {
			key: 0,
			"data-slot": "label",
			class: normalizeClass($setup.ui.label({ class: $setup.props.ui?.label }))
		}, toDisplayString($setup.props.label), 3)) : $setup.props.icon ? (openBlock(), createBlock($setup["UIcon"], {
			key: 1,
			name: $setup.props.icon,
			"data-slot": "icon",
			class: normalizeClass($setup.ui.icon({ class: $setup.props.ui?.icon }))
		}, null, 8, ["name", "class"])) : $setup.props.avatar ? (openBlock(), createBlock($setup["UAvatar"], mergeProps({
			key: 2,
			size: $setup.props.ui?.avatarSize || $setup.ui.avatarSize()
		}, $setup.props.avatar, {
			"data-slot": "avatar",
			class: $setup.ui.avatar({ class: $setup.props.ui?.avatar })
		}), null, 16, ["size", "class"])) : createCommentVNode("", true)])], 2)]),
		_: 3
	}), createVNode($setup["Separator"], mergeProps({ "data-slot": "root" }, {
		...$setup.rootProps,
		..._ctx.$attrs
	}, { class: $setup.ui.root({ class: [$setup.props.ui?.root, $setup.props.class] }) }), {
		default: withCtx(() => [
			$setup.hasContent && $setup.props.position === "start" ? (openBlock(), createBlock($setup["ReuseContainer"], { key: 0 })) : createCommentVNode("", true),
			createElementVNode("div", {
				"data-slot": "border",
				class: normalizeClass($setup.ui.border({ class: $setup.props.ui?.border }))
			}, null, 2),
			$setup.hasContent && $setup.props.position === "center" ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [createVNode($setup["ReuseContainer"]), createElementVNode("div", {
				"data-slot": "border",
				class: normalizeClass($setup.ui.border({ class: $setup.props.ui?.border }))
			}, null, 2)], 64)) : createCommentVNode("", true),
			$setup.hasContent && $setup.props.position === "end" ? (openBlock(), createBlock($setup["ReuseContainer"], { key: 2 })) : createCommentVNode("", true)
		]),
		_: 1
	}, 16, ["class"])], 64);
}
var Separator_default = /*@__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$1, [["render", _sfc_render$9], ["__file", "Separator.vue"]]);
// src/vue/components/NuxtEditor/LinkBar.vue?vue&type=script&setup=true&lang.ts
var LinkBar_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "LinkBar",
	props: { editor: {} },
	setup(__props, { expose: __expose }) {
		__expose();
		const props = __props;
		const url = ref("");
		const sync = () => {
			url.value = props.editor.getAttributes("link").href || "";
		};
		props.editor.on("selectionUpdate", sync);
		onBeforeUnmount(() => props.editor.off("selectionUpdate", sync));
		sync();
		function apply() {
			if (url.value) props.editor.chain().focus().extendMarkRange("link").setLink({ href: url.value }).run();
		}
		function remove() {
			props.editor.chain().focus().extendMarkRange("link").unsetLink().setMeta("preventAutolink", true).run();
		}
		const copied = ref(false);
		async function copy() {
			if (!url.value) return;
			await navigator.clipboard.writeText(url.value);
			copied.value = true;
			setTimeout(() => copied.value = false, 1500);
		}
		function open() {
			window.open(url.value, "_blank", "noopener,noreferrer");
		}
		function onFocusIn(e) {
			if (e.target instanceof HTMLInputElement) e.target.select();
		}
		function onKeydown(e) {
			if (e.key === "Enter") {
				e.preventDefault();
				apply();
			} else if (e.key === "Escape") props.editor.commands.focus();
		}
		const __returned__ = {
			props,
			url,
			sync,
			apply,
			remove,
			copied,
			copy,
			open,
			onFocusIn,
			onKeydown,
			UButton: Button_default,
			UInput: Input_default,
			USeparator: Separator_default,
			get trans() {
				return trans;
			}
		};
		Object.defineProperty(__returned__, "__isScriptSetup", {
			enumerable: false,
			value: true
		});
		return __returned__;
	}
});
// src/vue/components/NuxtEditor/LinkBar.vue
var _hoisted_1$5 = { class: "flex items-center mr-0.5" };
function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
	return openBlock(), createBlock($setup["UInput"], {
		modelValue: $setup.url,
		"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.url = $event),
		"data-link-bar": "",
		type: "url",
		variant: "none",
		placeholder: $setup.trans("unicorn.nuxt.editor.field.link.placeholder"),
		class: "min-w-72",
		onFocusin: $setup.onFocusIn,
		onKeydown: $setup.onKeydown
	}, {
		default: withCtx(() => [createElementVNode("div", _hoisted_1$5, [
			createVNode($setup["UButton"], {
				icon: "i-lucide-corner-down-left",
				title: $setup.trans("unicorn.nuxt.editor.action.apply.link"),
				color: "neutral",
				variant: "ghost",
				size: "sm",
				onClick: $setup.apply
			}, null, 8, ["title"]),
			createVNode($setup["USeparator"], {
				orientation: "vertical",
				class: "h-6 mx-1"
			}),
			createVNode($setup["UButton"], {
				icon: $setup.copied ? "i-lucide-check" : "i-lucide-copy",
				title: $setup.trans("unicorn.nuxt.editor.action.copy.link"),
				color: "neutral",
				variant: "ghost",
				size: "sm",
				onClick: $setup.copy
			}, null, 8, ["icon", "title"]),
			createVNode($setup["UButton"], {
				icon: "i-lucide-external-link",
				title: $setup.trans("unicorn.nuxt.editor.action.open.in.new.window"),
				color: "neutral",
				variant: "ghost",
				size: "sm",
				onClick: $setup.open
			}, null, 8, ["title"]),
			createVNode($setup["UButton"], {
				icon: "i-lucide-unlink",
				title: $setup.trans("unicorn.nuxt.editor.action.unlink"),
				color: "neutral",
				variant: "ghost",
				size: "sm",
				onClick: $setup.remove
			}, null, 8, ["title"])
		])]),
		_: 1
	}, 8, ["modelValue", "placeholder"]);
}
var LinkBar_default = /*@__PURE__*/ _plugin_vue_export_helper_default(LinkBar_vue_vue_type_script_setup_true_lang_default, [["render", _sfc_render$8], ["__file", "LinkBar.vue"]]);
// ../../../../node_modules/@nuxt/ui/dist/runtime/utils/overlay.js
function pointerDownOutside(e, options = {}) {
	const originalEvent = e.detail.originalEvent;
	const target = originalEvent.target;
	if (!target?.isConnected) {
		e.preventDefault();
		return;
	}
	if (options.scrollable) {
		if (originalEvent.offsetX > target.clientWidth || originalEvent.offsetY > target.clientHeight) e.preventDefault();
	}
}
// virtual:nuxt-ui-templates/ui/popover.ts
var popover_default = { "slots": {
	"content": "bg-default shadow-lg rounded-md ring ring-default data-[state=open]:animate-[scale-in_100ms_var(--ease-out)] data-[state=closed]:animate-[scale-out_100ms_var(--ease-out)] origin-(--reka-popover-content-transform-origin) focus:outline-none pointer-events-auto",
	"arrow": "fill-bg stroke-default"
} };
// ../../../../node_modules/@nuxt/ui/dist/runtime/components/Popover.vue
var _sfc_main = {
	__name: "Popover",
	props: {
		mode: {
			type: null,
			required: false,
			default: "click"
		},
		content: {
			type: Object,
			required: false
		},
		arrow: {
			type: [Boolean, Object],
			required: false
		},
		portal: {
			type: [Boolean, String],
			required: false,
			skipCheck: true,
			default: true
		},
		reference: {
			type: null,
			required: false
		},
		dismissible: {
			type: Boolean,
			required: false,
			default: true
		},
		class: {
			type: null,
			required: false
		},
		ui: {
			type: Object,
			required: false
		},
		defaultOpen: {
			type: Boolean,
			required: false
		},
		open: {
			type: Boolean,
			required: false
		},
		modal: {
			type: Boolean,
			required: false
		},
		openDelay: {
			type: Number,
			required: false,
			default: 0
		},
		closeDelay: {
			type: Number,
			required: false,
			default: 0
		},
		enableTouch: {
			type: Boolean,
			required: false
		}
	},
	emits: ["close:prevent", "update:open"],
	setup(__props, { expose: __expose, emit: __emit }) {
		__expose();
		const Popover = {
			Root: PopoverRoot_default,
			Trigger: PopoverTrigger_default,
			Portal: PopoverPortal_default,
			Content: PopoverContent_default,
			Arrow: PopoverArrow_default,
			Anchor: PopoverAnchor_default
		};
		const HoverCard = {
			Root: HoverCardRoot_default,
			Trigger: HoverCardTrigger_default,
			Portal: HoverCardPortal_default,
			Content: HoverCardContent_default,
			Arrow: HoverCardArrow_default
		};
		const _props = __props;
		const emits = __emit;
		const slots = useSlots();
		const props = useComponentProps("popover", _props);
		const appConfig = useAppConfig();
		const pick = props.mode === "hover" ? reactivePick(props, "defaultOpen", "open", "openDelay", "closeDelay", "enableTouch") : reactivePick(props, "defaultOpen", "open", "modal");
		const rootProps = useForwardProps$1(pick, emits);
		const portalProps = usePortal(toRef(() => props.portal));
		const contentProps = toRef(() => defu(props.content, {
			side: "bottom",
			sideOffset: 8,
			collisionPadding: 8
		}));
		const __returned__ = {
			Popover,
			HoverCard,
			_props,
			emits,
			slots,
			props,
			appConfig,
			pick,
			rootProps,
			portalProps,
			contentProps,
			contentEvents: computed(() => {
				if (!props.dismissible) return ["interactOutside", "escapeKeyDown"].reduce((acc, curr) => {
					acc[curr] = (e) => {
						e.preventDefault();
						emits("close:prevent");
					};
					return acc;
				}, {});
				return { pointerDownOutside };
			}),
			arrowProps: toRef(() => defu(props.arrow, { rounded: true })),
			ui: computed(() => tv({
				extend: popover_default,
				...appConfig.ui?.popover || {}
			})({ side: contentProps.value.side })),
			Component: computed(() => props.mode === "hover" ? HoverCard : Popover),
			get theme() {
				return popover_default;
			},
			computed,
			toRef,
			get defu() {
				return defu;
			},
			get useForwardProps() {
				return useForwardProps$1;
			},
			get PopoverRoot() {
				return PopoverRoot_default;
			},
			get PopoverTrigger() {
				return PopoverTrigger_default;
			},
			get PopoverPortal() {
				return PopoverPortal_default;
			},
			get PopoverContent() {
				return PopoverContent_default;
			},
			get PopoverArrow() {
				return PopoverArrow_default;
			},
			get PopoverAnchor() {
				return PopoverAnchor_default;
			},
			get HoverCardRoot() {
				return HoverCardRoot_default;
			},
			get HoverCardTrigger() {
				return HoverCardTrigger_default;
			},
			get HoverCardPortal() {
				return HoverCardPortal_default;
			},
			get HoverCardContent() {
				return HoverCardContent_default;
			},
			get HoverCardArrow() {
				return HoverCardArrow_default;
			},
			get reactivePick() {
				return reactivePick;
			},
			get useAppConfig() {
				return useAppConfig;
			},
			get useComponentProps() {
				return useComponentProps;
			},
			get FieldGroupReset() {
				return FieldGroupReset;
			},
			get usePortal() {
				return usePortal;
			},
			get pointerDownOutside() {
				return pointerDownOutside;
			},
			get tv() {
				return tv;
			}
		};
		Object.defineProperty(__returned__, "__isScriptSetup", {
			enumerable: false,
			value: true
		});
		return __returned__;
	}
};
function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
	return openBlock(), createBlock($setup["Component"].Root, normalizeProps(guardReactiveProps($setup.rootProps)), {
		default: withCtx(({ open, close }) => [
			!!$setup.slots.default ? (openBlock(), createBlock($setup["Component"].Trigger, {
				key: 0,
				"as-child": "",
				class: normalizeClass($setup.props.class)
			}, {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default", { open })]),
				_: 2
			}, 1032, ["class"])) : createCommentVNode("", true),
			"Anchor" in $setup.Component && !!$setup.slots.anchor ? (openBlock(), createBlock($setup["Component"].Anchor, {
				key: 1,
				"as-child": ""
			}, {
				default: withCtx(() => [renderSlot(_ctx.$slots, "anchor", normalizeProps(guardReactiveProps(close ? { close } : {})))]),
				_: 2
			}, 1024)) : createCommentVNode("", true),
			createVNode($setup["Component"].Portal, normalizeProps(guardReactiveProps($setup.portalProps)), {
				default: withCtx(() => [createVNode($setup["FieldGroupReset"], null, {
					default: withCtx(() => [createVNode($setup["Component"].Content, mergeProps($setup.contentProps, {
						reference: $setup.props.reference ?? $setup.props.content?.reference,
						"data-slot": "content",
						class: $setup.ui.content({ class: [!$setup.slots.default && $setup.props.class, $setup.props.ui?.content] })
					}, toHandlers($setup.contentEvents)), {
						default: withCtx(() => [renderSlot(_ctx.$slots, "content", normalizeProps(guardReactiveProps(close ? { close } : {}))), !!$setup.props.arrow ? (openBlock(), createBlock($setup["Component"].Arrow, mergeProps({ key: 0 }, $setup.arrowProps, {
							"data-slot": "arrow",
							class: $setup.ui.arrow({ class: $setup.props.ui?.arrow })
						}), null, 16, ["class"])) : createCommentVNode("", true)]),
						_: 2
					}, 1040, ["reference", "class"])]),
					_: 2
				}, 1024)]),
				_: 2
			}, 1040)
		]),
		_: 3
	}, 16);
}
var Popover_default = /*@__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["render", _sfc_render$7], ["__file", "Popover.vue"]]);
// src/vue/components/NuxtEditor/LinkPopover.vue?vue&type=script&setup=true&lang.ts
var LinkPopover_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "LinkPopover",
	props: { editor: {} },
	setup(__props, { expose: __expose }) {
		__expose();
		const props = __props;
		const open = ref(false);
		const url = ref("");
		const tick = ref(0);
		const syncUrl = () => {
			tick.value++;
			url.value = props.editor.getAttributes("link").href || "";
		};
		props.editor.on("transaction", syncUrl);
		onBeforeUnmount(() => props.editor.off("transaction", syncUrl));
		syncUrl();
		function setLink() {
			if (!url.value) return;
			const empty = props.editor.state.selection.empty;
			let chain = props.editor.chain().focus();
			if (props.editor.isActive("code") && !empty) chain = chain.extendMarkRange("code").setLink({ href: url.value });
			else {
				chain = chain.extendMarkRange("link").setLink({ href: url.value });
				if (empty) chain = chain.insertContent({
					type: "text",
					text: url.value
				});
			}
			chain.run();
			open.value = false;
		}
		function removeLink() {
			props.editor.chain().focus().extendMarkRange("link").unsetLink().setMeta("preventAutolink", true).run();
			url.value = "";
			open.value = false;
		}
		function openLink() {
			window.open(url.value, "_blank", "noopener,noreferrer");
		}
		function onFocusIn(e) {
			if (e.target instanceof HTMLInputElement) e.target.select();
		}
		function onKeydown(e) {
			if (e.key === "Enter") {
				e.preventDefault();
				setLink();
			}
		}
		const __returned__ = {
			props,
			open,
			url,
			tick,
			syncUrl,
			setLink,
			removeLink,
			openLink,
			onFocusIn,
			onKeydown,
			UButton: Button_default,
			UInput: Input_default,
			UPopover: Popover_default,
			USeparator: Separator_default,
			UTooltip: Tooltip_default,
			get trans() {
				return trans;
			}
		};
		Object.defineProperty(__returned__, "__isScriptSetup", {
			enumerable: false,
			value: true
		});
		return __returned__;
	}
});
// src/vue/components/NuxtEditor/LinkPopover.vue
var _hoisted_1$4 = { class: "flex items-center mr-0.5" };
function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
	return openBlock(), createBlock($setup["UPopover"], {
		open: $setup.open,
		"onUpdate:open": _cache[1] || (_cache[1] = ($event) => $setup.open = $event),
		ui: { content: "p-0.5" }
	}, {
		content: withCtx(() => [createVNode($setup["UInput"], {
			modelValue: $setup.url,
			"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.url = $event),
			autofocus: "",
			type: "url",
			variant: "none",
			placeholder: $setup.trans("unicorn.nuxt.editor.field.link.placeholder"),
			onFocusin: $setup.onFocusIn,
			onKeydown: $setup.onKeydown
		}, {
			default: withCtx(() => [createElementVNode("div", _hoisted_1$4, [
				createVNode($setup["UButton"], {
					icon: "i-lucide-corner-down-left",
					title: $setup.trans("unicorn.nuxt.editor.action.apply.link"),
					color: "neutral",
					variant: "ghost",
					size: "sm",
					disabled: !$setup.url && !$props.editor.isActive("link"),
					onClick: $setup.setLink
				}, null, 8, ["title", "disabled"]),
				createVNode($setup["USeparator"], {
					orientation: "vertical",
					class: "h-6 mx-1"
				}),
				createVNode($setup["UButton"], {
					icon: "i-lucide-external-link",
					title: $setup.trans("unicorn.nuxt.editor.action.open.in.new.window"),
					color: "neutral",
					variant: "ghost",
					size: "sm",
					disabled: !$setup.url && !$props.editor.isActive("link"),
					onClick: $setup.openLink
				}, null, 8, ["title", "disabled"]),
				createVNode($setup["UButton"], {
					icon: "i-lucide-unlink",
					title: $setup.trans("unicorn.nuxt.editor.action.unlink"),
					color: "neutral",
					variant: "ghost",
					size: "sm",
					disabled: !$setup.url && !$props.editor.isActive("link"),
					onClick: $setup.removeLink
				}, null, 8, ["title", "disabled"])
			])]),
			_: 1
		}, 8, ["modelValue", "placeholder"])]),
		default: withCtx(() => [createVNode($setup["UTooltip"], { text: $setup.trans("unicorn.nuxt.editor.action.link") }, {
			default: withCtx(() => [createVNode($setup["UButton"], {
				icon: "i-lucide-link",
				color: "neutral",
				"active-color": "primary",
				variant: "ghost",
				"active-variant": "soft",
				size: "sm",
				active: ($setup.tick, $props.editor.isActive("link")),
				disabled: ($setup.tick, !$props.editor.isEditable || $props.editor.state.selection.empty && !$props.editor.isActive("link"))
			}, null, 8, ["active", "disabled"])]),
			_: 1
		}, 8, ["text"])]),
		_: 1
	}, 8, ["open"]);
}
var LinkPopover_default = /*@__PURE__*/ _plugin_vue_export_helper_default(LinkPopover_vue_vue_type_script_setup_true_lang_default, [["render", _sfc_render$6], ["__file", "LinkPopover.vue"]]);
// src/vue/components/NuxtEditor/VideoPopover.vue?vue&type=script&setup=true&lang.ts
var VideoPopover_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "VideoPopover",
	props: { editor: {} },
	setup(__props, { expose: __expose }) {
		__expose();
		const props = __props;
		const open = ref(false);
		const url = ref("");
		const invalid = ref(false);
		function insert() {
			if (!parseEmbedInput(url.value)) {
				invalid.value = true;
				return;
			}
			props.editor.chain().focus().setVideoEmbed(url.value).run();
			url.value = "";
			invalid.value = false;
			open.value = false;
		}
		function onKeydown(e) {
			if (e.key === "Enter") {
				e.preventDefault();
				insert();
			}
		}
		const __returned__ = {
			props,
			open,
			url,
			invalid,
			insert,
			onKeydown,
			UButton: Button_default,
			UInput: Input_default,
			UPopover: Popover_default,
			UTooltip: Tooltip_default,
			get trans() {
				return trans;
			}
		};
		Object.defineProperty(__returned__, "__isScriptSetup", {
			enumerable: false,
			value: true
		});
		return __returned__;
	}
});
// src/vue/components/NuxtEditor/VideoPopover.vue
var _hoisted_1$3 = { class: "flex items-center mr-0.5" };
function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
	return openBlock(), createBlock($setup["UPopover"], {
		open: $setup.open,
		"onUpdate:open": _cache[2] || (_cache[2] = ($event) => $setup.open = $event),
		ui: { content: "p-0.5 w-[28rem] max-w-[90vw]" }
	}, {
		content: withCtx(() => [createVNode($setup["UInput"], {
			modelValue: $setup.url,
			"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.url = $event),
			autofocus: "",
			type: "url",
			variant: "none",
			class: "w-full",
			color: $setup.invalid ? "error" : void 0,
			placeholder: $setup.invalid ? $setup.trans("unicorn.nuxt.editor.message.video.unsupported") : $setup.trans("unicorn.nuxt.editor.field.video.placeholder"),
			onInput: _cache[1] || (_cache[1] = ($event) => $setup.invalid = false),
			onKeydown: $setup.onKeydown
		}, {
			default: withCtx(() => [createElementVNode("div", _hoisted_1$3, [createVNode($setup["UButton"], {
				icon: "i-lucide-corner-down-left",
				title: $setup.trans("unicorn.nuxt.editor.action.embed.video"),
				color: "neutral",
				variant: "ghost",
				size: "sm",
				disabled: !$setup.url,
				onClick: $setup.insert
			}, null, 8, ["title", "disabled"])])]),
			_: 1
		}, 8, [
			"modelValue",
			"color",
			"placeholder"
		])]),
		default: withCtx(() => [createVNode($setup["UTooltip"], { text: $setup.trans("unicorn.nuxt.editor.action.video") }, {
			default: withCtx(() => [createVNode($setup["UButton"], {
				icon: "i-lucide-video",
				color: "neutral",
				variant: "ghost",
				size: "sm",
				"aria-label": $setup.trans("unicorn.nuxt.editor.action.video"),
				disabled: !$props.editor.isEditable
			}, null, 8, ["aria-label", "disabled"])]),
			_: 1
		}, 8, ["text"])]),
		_: 1
	}, 8, ["open"]);
}
var VideoPopover_default = /*@__PURE__*/ _plugin_vue_export_helper_default(VideoPopover_vue_vue_type_script_setup_true_lang_default, [["render", _sfc_render$5], ["__file", "VideoPopover.vue"]]);
// src/vue/components/NuxtEditor/VideoSourcePopover.vue?vue&type=script&setup=true&lang.ts
var VideoSourcePopover_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "VideoSourcePopover",
	props: { editor: {} },
	setup(__props, { expose: __expose }) {
		__expose();
		const props = __props;
		const open = ref(false);
		const url = ref("");
		const invalid = ref(false);
		watch(open, (v) => {
			if (v) {
				url.value = props.editor.state.selection.node?.attrs.src || "";
				invalid.value = false;
			}
		});
		function apply() {
			const source = parseEmbedInput(url.value);
			const { selection } = props.editor.state;
			if (!source || !selection.node) {
				invalid.value = true;
				return;
			}
			const { state, view } = props.editor;
			view.dispatch(state.tr.setNodeMarkup(selection.from, void 0, attrsOf(source)));
			open.value = false;
			props.editor.commands.focus();
		}
		function onKeydown(e) {
			if (e.key === "Enter") {
				e.preventDefault();
				apply();
			}
		}
		function onFocusIn(e) {
			if (e.target instanceof HTMLInputElement) e.target.select();
		}
		const __returned__ = {
			props,
			open,
			url,
			invalid,
			apply,
			onKeydown,
			onFocusIn,
			UButton: Button_default,
			UInput: Input_default,
			UPopover: Popover_default,
			UTooltip: Tooltip_default,
			get trans() {
				return trans;
			}
		};
		Object.defineProperty(__returned__, "__isScriptSetup", {
			enumerable: false,
			value: true
		});
		return __returned__;
	}
});
// src/vue/components/NuxtEditor/VideoSourcePopover.vue
var _hoisted_1$2 = { "data-video-source": "" };
var _hoisted_2$1 = { class: "flex items-center mr-0.5" };
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
	return openBlock(), createBlock($setup["UPopover"], {
		open: $setup.open,
		"onUpdate:open": _cache[2] || (_cache[2] = ($event) => $setup.open = $event),
		ui: { content: "p-0.5 w-[28rem] max-w-[90vw]" }
	}, {
		content: withCtx(() => [createElementVNode("div", _hoisted_1$2, [createVNode($setup["UInput"], {
			modelValue: $setup.url,
			"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.url = $event),
			autofocus: "",
			type: "url",
			variant: "none",
			class: "w-full",
			color: $setup.invalid ? "error" : void 0,
			placeholder: $setup.invalid ? $setup.trans("unicorn.nuxt.editor.message.video.unsupported") : $setup.trans("unicorn.nuxt.editor.field.video.placeholder"),
			onInput: _cache[1] || (_cache[1] = ($event) => $setup.invalid = false),
			onFocusin: $setup.onFocusIn,
			onKeydown: $setup.onKeydown
		}, {
			default: withCtx(() => [createElementVNode("div", _hoisted_2$1, [createVNode($setup["UButton"], {
				icon: "i-lucide-corner-down-left",
				title: $setup.trans("unicorn.nuxt.editor.action.apply"),
				color: "neutral",
				variant: "ghost",
				size: "sm",
				disabled: !$setup.url,
				onClick: $setup.apply
			}, null, 8, ["title", "disabled"])])]),
			_: 1
		}, 8, [
			"modelValue",
			"color",
			"placeholder"
		])])]),
		default: withCtx(() => [createVNode($setup["UTooltip"], { text: $setup.trans("unicorn.nuxt.editor.action.change.source") }, {
			default: withCtx(() => [createVNode($setup["UButton"], {
				icon: "i-lucide-pencil",
				color: "neutral",
				variant: "ghost",
				size: "sm",
				"aria-label": $setup.trans("unicorn.nuxt.editor.action.change.source")
			}, null, 8, ["aria-label"])]),
			_: 1
		}, 8, ["text"])]),
		_: 1
	}, 8, ["open"]);
}
var VideoSourcePopover_default = /*@__PURE__*/ _plugin_vue_export_helper_default(VideoSourcePopover_vue_vue_type_script_setup_true_lang_default, [["render", _sfc_render$4], ["__file", "VideoSourcePopover.vue"]]);
// src/vue/components/NuxtEditor/VideoPastePrompt.vue?vue&type=script&setup=true&lang.ts
var VideoPastePrompt_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "VideoPastePrompt",
	props: { editor: {} },
	setup(__props, { expose: __expose }) {
		__expose();
		const props = __props;
		const state = () => {
			const ed = props.editor;
			return ed.storage.videoEmbed.key.getState(ed.state);
		};
		const clear = () => {
			const ed = props.editor;
			ed.view.dispatch(ed.state.tr.setMeta(ed.storage.videoEmbed.key, null));
		};
		function embed() {
			const prompt = state();
			const ed = props.editor;
			if (!prompt) return;
			const $pos = ed.state.doc.resolve(prompt.from);
			const type = ed.state.schema.nodes.videoEmbed;
			ed.view.dispatch(ed.state.tr.replaceWith($pos.before(), $pos.after(), type.create(attrsOf(prompt.source))));
			ed.commands.focus();
		}
		function dismiss() {
			clear();
			props.editor.commands.focus();
		}
		const __returned__ = {
			props,
			state,
			clear,
			embed,
			dismiss,
			UButton: Button_default,
			get trans() {
				return trans;
			}
		};
		Object.defineProperty(__returned__, "__isScriptSetup", {
			enumerable: false,
			value: true
		});
		return __returned__;
	}
});
// src/vue/components/NuxtEditor/VideoPastePrompt.vue
var _hoisted_1$1 = { class: "flex flex-col min-w-40 p-1" };
var _hoisted_2 = { class: "px-2 py-1 text-xs font-medium text-muted" };
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
	return openBlock(), createElementBlock("div", _hoisted_1$1, [
		createElementVNode("div", _hoisted_2, toDisplayString($setup.trans("unicorn.nuxt.editor.text.paste.as")), 1),
		createVNode($setup["UButton"], {
			icon: "i-lucide-video",
			label: $setup.trans("unicorn.nuxt.editor.action.embed"),
			color: "neutral",
			variant: "ghost",
			size: "sm",
			class: "justify-start",
			onClick: $setup.embed
		}, null, 8, ["label"]),
		createVNode($setup["UButton"], {
			icon: "i-lucide-link",
			label: $setup.trans("unicorn.nuxt.editor.action.link"),
			color: "neutral",
			variant: "ghost",
			size: "sm",
			class: "justify-start",
			onClick: $setup.dismiss
		}, null, 8, ["label"])
	]);
}
var VideoPastePrompt_default = /*@__PURE__*/ _plugin_vue_export_helper_default(VideoPastePrompt_vue_vue_type_script_setup_true_lang_default, [["render", _sfc_render$3], ["__file", "VideoPastePrompt.vue"]]);
// src/vue/components/NuxtEditor/EditorToolbars.vue?vue&type=script&setup=true&lang.ts
var EditorToolbars_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "EditorToolbars",
	props: {
		editor: {},
		fixedItems: {},
		textItems: {},
		videoItems: {},
		imageItems: {},
		slashItems: {}
	},
	setup(__props, { expose: __expose }) {
		__expose();
		const props = __props;
		const shouldShow = useBubbleVisibility();
		const linkBarItems = [[{ slot: "linkbar" }]];
		const videoPromptItems = [[{ slot: "videoprompt" }]];
		const menuTick = ref(0);
		const colorMenu = (item) => {
			menuTick.value;
			const ed = props.editor;
			return createColorMenu(resolveColors(item.colors), (kind, color) => {
				const chain = ed.chain().focus();
				if (kind === "text") (color ? chain.setColor(color) : chain.unsetColor()).run();
				else (color ? chain.setBackgroundColor(toBackground(color)) : chain.unsetBackgroundColor()).run();
			})[item.colorKind === "text" ? 0 : 1].children;
		};
		const __returned__ = {
			props,
			shouldShow,
			linkBarItems,
			videoPromptItems,
			menuTick,
			colorMenu,
			UEditorToolbar: EditorToolbar_default,
			UEditorSuggestionMenu: EditorSuggestionMenu_default,
			ColorsDropdown: ColorsDropdown_default,
			LinkBar: LinkBar_default,
			LinkPopover: LinkPopover_default,
			VideoPopover: VideoPopover_default,
			VideoSourcePopover: VideoSourcePopover_default,
			VideoPastePrompt: VideoPastePrompt_default
		};
		Object.defineProperty(__returned__, "__isScriptSetup", {
			enumerable: false,
			value: true
		});
		return __returned__;
	}
});
// src/vue/components/NuxtEditor/EditorToolbars.vue
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
	return openBlock(), createElementBlock(Fragment, null, [
		$props.fixedItems.length ? (openBlock(), createBlock($setup["UEditorToolbar"], {
			key: 0,
			editor: $props.editor,
			items: $props.fixedItems,
			class: "border-b border-default py-2 overflow-x-auto"
		}, {
			link: withCtx(() => [createVNode($setup["LinkPopover"], { editor: $props.editor }, null, 8, ["editor"])]),
			video: withCtx(() => [createVNode($setup["VideoPopover"], { editor: $props.editor }, null, 8, ["editor"])]),
			colors: withCtx(({ item }) => [createVNode($setup["ColorsDropdown"], {
				items: $setup.colorMenu(item),
				tooltip: item.tooltip,
				icon: item.icon,
				onOpen: _cache[0] || (_cache[0] = ($event) => $setup.menuTick++)
			}, null, 8, [
				"items",
				"tooltip",
				"icon"
			])]),
			_: 1
		}, 8, ["editor", "items"])) : createCommentVNode("", true),
		$props.slashItems.length ? (openBlock(), createBlock($setup["UEditorSuggestionMenu"], {
			key: 1,
			editor: $props.editor,
			items: $props.slashItems
		}, null, 8, ["editor", "items"])) : createCommentVNode("", true),
		$props.textItems.length ? (openBlock(), createBlock($setup["UEditorToolbar"], {
			key: 2,
			editor: $props.editor,
			items: $props.textItems,
			layout: "bubble",
			"should-show": $setup.shouldShow.text
		}, {
			link: withCtx(() => [createVNode($setup["LinkPopover"], { editor: $props.editor }, null, 8, ["editor"])]),
			colors: withCtx(({ item }) => [createVNode($setup["ColorsDropdown"], {
				items: $setup.colorMenu(item),
				tooltip: item.tooltip,
				icon: item.icon,
				onOpen: _cache[1] || (_cache[1] = ($event) => $setup.menuTick++)
			}, null, 8, [
				"items",
				"tooltip",
				"icon"
			])]),
			_: 1
		}, 8, [
			"editor",
			"items",
			"should-show"
		])) : createCommentVNode("", true),
		$props.videoItems.length ? (openBlock(), createBlock($setup["UEditorToolbar"], {
			key: 3,
			editor: $props.editor,
			items: $props.videoItems,
			layout: "bubble",
			"should-show": $setup.shouldShow.video
		}, {
			videosource: withCtx(() => [createVNode($setup["VideoSourcePopover"], { editor: $props.editor }, null, 8, ["editor"])]),
			_: 1
		}, 8, [
			"editor",
			"items",
			"should-show"
		])) : createCommentVNode("", true),
		createVNode($setup["UEditorToolbar"], {
			editor: $props.editor,
			items: $setup.videoPromptItems,
			layout: "bubble",
			"should-show": $setup.shouldShow.videoPrompt
		}, {
			videoprompt: withCtx(() => [createVNode($setup["VideoPastePrompt"], { editor: $props.editor }, null, 8, ["editor"])]),
			_: 1
		}, 8, ["editor", "should-show"]),
		createVNode($setup["UEditorToolbar"], {
			editor: $props.editor,
			items: $setup.linkBarItems,
			layout: "bubble",
			"should-show": $setup.shouldShow.link
		}, {
			linkbar: withCtx(() => [createVNode($setup["LinkBar"], { editor: $props.editor }, null, 8, ["editor"])]),
			_: 1
		}, 8, ["editor", "should-show"]),
		$props.imageItems.length ? (openBlock(), createBlock($setup["UEditorToolbar"], {
			key: 4,
			editor: $props.editor,
			items: $props.imageItems,
			layout: "bubble",
			"should-show": $setup.shouldShow.image
		}, null, 8, [
			"editor",
			"items",
			"should-show"
		])) : createCommentVNode("", true)
	], 64);
}
var EditorToolbars_default = /*@__PURE__*/ _plugin_vue_export_helper_default(EditorToolbars_vue_vue_type_script_setup_true_lang_default, [["render", _sfc_render$2], ["__file", "EditorToolbars.vue"]]);
// src/vue/components/NuxtEditor/TableHandle.vue?vue&type=script&setup=true&lang.ts
var TableHandle_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "TableHandle",
	props: {
		editor: {},
		menuItems: { type: Function }
	},
	setup(__props, { expose: __expose }) {
		__expose();
		const props = __props;
		const rects = ref(null);
		function update() {
			const { editor } = props;
			if (!editor || editor.isDestroyed || !editor.isEditable || !editor.isActive("table")) {
				rects.value = null;
				return;
			}
			const dom = editor.view.domAtPos(editor.state.selection.from).node;
			const cell = (dom instanceof Element ? dom : dom.parentElement)?.closest("td, th");
			const table = cell?.closest("table");
			rects.value = cell && table ? {
				cell: cell.getBoundingClientRect(),
				table: table.getBoundingClientRect()
			} : null;
		}
		onMounted(() => {
			props.editor.on("transaction", update);
			window.addEventListener("scroll", update, true);
			window.addEventListener("resize", update);
			update();
		});
		onBeforeUnmount(() => {
			props.editor.off("transaction", update);
			window.removeEventListener("scroll", update, true);
			window.removeEventListener("resize", update);
		});
		const __returned__ = {
			props,
			rects,
			update,
			UIcon: Icon_default,
			UDropdownMenu: DropdownMenu_default
		};
		Object.defineProperty(__returned__, "__isScriptSetup", {
			enumerable: false,
			value: true
		});
		return __returned__;
	}
});
// src/vue/components/NuxtEditor/TableHandle.vue
var _hoisted_1 = {
	key: 0,
	class: "nuxt-editor-table-handle",
	style: {
		"position": "fixed",
		"inset": "0",
		"pointer-events": "none",
		"z-index": "5"
	}
};
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
	return $setup.rects ? (openBlock(), createElementBlock("div", _hoisted_1, [
		createElementVNode("div", {
			class: "absolute box-border border-2 border-primary",
			style: normalizeStyle({
				top: `${$setup.rects.cell.top}px`,
				left: `${$setup.rects.cell.left}px`,
				width: `${$setup.rects.cell.width}px`,
				height: `${$setup.rects.cell.height}px`
			})
		}, null, 4),
		createVNode($setup["UDropdownMenu"], {
			modal: false,
			items: $props.menuItems($props.editor, "column"),
			content: {
				side: "bottom",
				align: "start"
			},
			ui: { content: "w-48 z-50 max-h-72 overflow-y-auto" }
		}, {
			"swatch-leading": withCtx(({ item }) => [createElementVNode("span", {
				class: "size-4 shrink-0 rounded-full border border-default",
				style: normalizeStyle({ background: item.swatch })
			}, null, 4)]),
			"textSwatch-leading": withCtx(({ item }) => [createElementVNode("span", {
				class: "size-4 shrink-0 text-center text-sm font-bold leading-4",
				style: normalizeStyle({ color: item.swatch })
			}, "A", 4)]),
			default: withCtx(() => [createElementVNode("button", {
				type: "button",
				class: "pointer-events-auto absolute flex items-center justify-center rounded-t bg-accented text-muted hover:bg-elevated cursor-pointer",
				style: normalizeStyle({
					top: `${$setup.rects.table.top - 16}px`,
					left: `${$setup.rects.cell.left}px`,
					width: `${$setup.rects.cell.width}px`,
					height: "16px"
				}),
				onMousedown: _cache[0] || (_cache[0] = withModifiers(() => {}, ["prevent"]))
			}, [createVNode($setup["UIcon"], {
				name: "i-lucide-ellipsis",
				class: "size-3.5"
			})], 36)]),
			_: 1
		}, 8, ["items"]),
		createVNode($setup["UDropdownMenu"], {
			modal: false,
			items: $props.menuItems($props.editor, "row"),
			content: {
				side: "right",
				align: "start"
			},
			ui: { content: "w-48 z-50 max-h-72 overflow-y-auto" }
		}, {
			"swatch-leading": withCtx(({ item }) => [createElementVNode("span", {
				class: "size-4 shrink-0 rounded-full border border-default",
				style: normalizeStyle({ background: item.swatch })
			}, null, 4)]),
			"textSwatch-leading": withCtx(({ item }) => [createElementVNode("span", {
				class: "size-4 shrink-0 text-center text-sm font-bold leading-4",
				style: normalizeStyle({ color: item.swatch })
			}, "A", 4)]),
			default: withCtx(() => [createElementVNode("button", {
				type: "button",
				class: "pointer-events-auto absolute flex items-center justify-center rounded-l bg-accented text-muted hover:bg-elevated cursor-pointer",
				style: normalizeStyle({
					top: `${$setup.rects.cell.top}px`,
					left: `${$setup.rects.table.left - 16}px`,
					width: "16px",
					height: `${$setup.rects.cell.height}px`
				}),
				onMousedown: _cache[1] || (_cache[1] = withModifiers(() => {}, ["prevent"]))
			}, [createVNode($setup["UIcon"], {
				name: "i-lucide-ellipsis",
				class: "size-3.5 rotate-90"
			})], 36)]),
			_: 1
		}, 8, ["items"]),
		createVNode($setup["UDropdownMenu"], {
			modal: false,
			items: $props.menuItems($props.editor, "cell"),
			content: {
				side: "bottom",
				align: "end"
			},
			ui: { content: "w-48 z-50 max-h-72 overflow-y-auto" }
		}, {
			"swatch-leading": withCtx(({ item }) => [createElementVNode("span", {
				class: "size-4 shrink-0 rounded-full border border-default",
				style: normalizeStyle({ background: item.swatch })
			}, null, 4)]),
			"textSwatch-leading": withCtx(({ item }) => [createElementVNode("span", {
				class: "size-4 shrink-0 text-center text-sm font-bold leading-4",
				style: normalizeStyle({ color: item.swatch })
			}, "A", 4)]),
			default: withCtx(() => [createElementVNode("button", {
				type: "button",
				class: "pointer-events-auto absolute flex size-4 items-center justify-center rounded-full bg-primary text-inverted cursor-pointer",
				style: normalizeStyle({
					top: `${$setup.rects.cell.top + $setup.rects.cell.height / 2 - 8}px`,
					left: `${$setup.rects.cell.right - 8}px`
				}),
				onMousedown: _cache[2] || (_cache[2] = withModifiers(() => {}, ["prevent"]))
			}, [createVNode($setup["UIcon"], {
				name: "i-lucide-ellipsis-vertical",
				class: "size-3"
			})], 36)]),
			_: 1
		}, 8, ["items"])
	])) : createCommentVNode("", true);
}
var TableHandle_default = /*@__PURE__*/ _plugin_vue_export_helper_default(TableHandle_vue_vue_type_script_setup_true_lang_default, [["render", _sfc_render$1], ["__file", "TableHandle.vue"]]);
// src/vue/components/NuxtEditor/NuxtEditorApp.vue?vue&type=script&setup=true&lang.ts
var NuxtEditorApp_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "NuxtEditorApp",
	props: {
		modelValue: {},
		format: {},
		editable: { type: Boolean },
		locale: {},
		portal: { type: [Boolean, String] },
		extensions: {},
		handlers: {},
		editorProps: {},
		items: {}
	},
	emits: [
		"update:modelValue",
		"create",
		"node-change"
	],
	setup(__props, { expose: __expose, emit: __emit }) {
		__expose();
		const emit = __emit;
		const linkAutoSelect = useLinkAutoSelect();
		function onCreate({ editor }) {
			linkAutoSelect.bind(editor);
			emit("create", editor);
		}
		const __returned__ = {
			emit,
			linkAutoSelect,
			onCreate,
			UApp: App_default,
			UEditor: Editor_default,
			get trans() {
				return trans;
			},
			EditorDragHandle: EditorDragHandle_default,
			EditorToolbars: EditorToolbars_default,
			TableHandle: TableHandle_default
		};
		Object.defineProperty(__returned__, "__isScriptSetup", {
			enumerable: false,
			value: true
		});
		return __returned__;
	}
});
// src/vue/components/NuxtEditor/NuxtEditorApp.vue
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
	return openBlock(), createBlock($setup["UApp"], {
		locale: $props.locale,
		portal: $props.portal
	}, {
		default: withCtx(() => [createVNode($setup["UEditor"], mergeProps({
			"model-value": $props.modelValue,
			"content-type": $props.format,
			handlers: $props.handlers,
			image: false,
			"starter-kit": { codeBlock: false },
			extensions: $props.extensions,
			placeholder: $setup.trans("unicorn.nuxt.editor.field.editor.placeholder"),
			editable: $props.editable,
			class: "w-full",
			ui: { base: "p-4 pl-16 sm:p-4 sm:pl-16 min-h-48 border border-default rounded-md" }
		}, $props.editorProps, {
			"onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.emit("update:modelValue", $event)),
			onCreate: $setup.onCreate
		}), {
			default: withCtx(({ editor, handlers: editorHandlers }) => [$props.editable ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
				createVNode($setup["EditorToolbars"], {
					editor,
					"fixed-items": $props.items.fixed(editor),
					"text-items": $props.items.text(editor),
					"video-items": $props.items.video(editor),
					"image-items": $props.items.image(editor),
					"slash-items": $props.items.slash(editor)
				}, null, 8, [
					"editor",
					"fixed-items",
					"text-items",
					"video-items",
					"image-items",
					"slash-items"
				]),
				createVNode($setup["TableHandle"], {
					editor,
					"menu-items": $props.items.tableMenu
				}, null, 8, ["editor", "menu-items"]),
				createVNode($setup["EditorDragHandle"], {
					editor,
					handlers: editorHandlers,
					"block-menu-items": $props.items.blockMenu,
					onNodeChange: _cache[0] || (_cache[0] = ($event) => $setup.emit("node-change", $event))
				}, null, 8, [
					"editor",
					"handlers",
					"block-menu-items"
				])
			], 64)) : createCommentVNode("", true)]),
			_: 1
		}, 16, [
			"model-value",
			"content-type",
			"handlers",
			"extensions",
			"placeholder",
			"editable"
		])]),
		_: 1
	}, 8, ["locale", "portal"]);
}
var NuxtEditorApp_default = /*@__PURE__*/ _plugin_vue_export_helper_default(NuxtEditorApp_vue_vue_type_script_setup_true_lang_default, [["render", _sfc_render], ["__file", "NuxtEditorApp.vue"]]);
export { VIEWPORT_PAUSE as a, handleAndDispatchCustomEvent as c, useCollection as d, NuxtEditorApp_default as default, Presence_default as f, TOAST_SWIPE_START as i, isDeltaInDirection as l, getActiveElement as m, TOAST_SWIPE_END as n, VIEWPORT_RESUME as o, useForwardExpose as p, TOAST_SWIPE_MOVE as r, getAnnounceTextContent as s, TOAST_SWIPE_CANCEL as t, injectToastProviderContext as u };

//# sourceMappingURL=NuxtEditorApp.js.map