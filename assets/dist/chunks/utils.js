import { c as renderSlotFragments, l as createContext, s as Slot } from "./Avatar.js";
import { g as isClient, i as unrefElement, n as defaultWindow } from "./dist.js";
import { computed, defineComponent, getCurrentInstance, h, inject, markRaw, nextTick, onMounted, onUnmounted, onUpdated, provide, reactive, ref, renderSlot, shallowReactive, shallowRef, toRefs, triggerRef, watch, watchEffect } from "vue";
//#region ../../../../node_modules/reka-ui/dist/shared/getActiveElement.js
function getActiveElement() {
	let activeElement = document.activeElement;
	if (activeElement == null) return null;
	while (activeElement != null && activeElement.shadowRoot != null && activeElement.shadowRoot.activeElement != null) activeElement = activeElement.shadowRoot.activeElement;
	return activeElement;
}
//#endregion
//#region ../../../../node_modules/reka-ui/dist/shared/isHTMLElement.js
function isHTMLElement(node) {
	if (typeof window === "undefined" || typeof node !== "object" || node === null) return false;
	const ownerWindow = node.ownerDocument?.defaultView ?? window;
	return node instanceof HTMLElement || node instanceof ownerWindow.HTMLElement;
}
//#endregion
//#region ../../../../node_modules/reka-ui/dist/shared/useForwardExpose.js
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
//#endregion
//#region ../../../../node_modules/reka-ui/dist/shared/useStateMachine.js
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
//#endregion
//#region ../../../../node_modules/reka-ui/dist/Presence/usePresence.js
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
//#endregion
//#region ../../../../node_modules/reka-ui/dist/Presence/Presence.js
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
//#endregion
//#region ../../../../node_modules/reka-ui/dist/Primitive/usePrimitiveElement.js
function usePrimitiveElement() {
	const primitiveElement = ref();
	return {
		primitiveElement,
		currentElement: computed(() => ["#text", "#comment"].includes(primitiveElement.value?.$el.nodeName) ? primitiveElement.value?.$el.nextElementSibling : unrefElement(primitiveElement))
	};
}
//#endregion
//#region ../../../../node_modules/reka-ui/dist/Collection/Collection.js
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
//#endregion
//#region ../../../../node_modules/reka-ui/dist/Toast/createToastManager.js
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
//#endregion
//#region ../../../../node_modules/reka-ui/dist/Toast/useToastStore.js
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
//#endregion
//#region ../../../../node_modules/reka-ui/dist/Toast/ToastProvider.js
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
//#endregion
//#region ../../../../node_modules/reka-ui/dist/Toast/utils.js
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
//#endregion
export { VIEWPORT_PAUSE as a, handleAndDispatchCustomEvent as c, injectToastProviderContext as d, useCollection as f, getActiveElement as g, useForwardExpose as h, TOAST_SWIPE_START as i, isDeltaInDirection as l, Presence_default as m, TOAST_SWIPE_END as n, VIEWPORT_RESUME as o, usePrimitiveElement as p, TOAST_SWIPE_MOVE as r, getAnnounceTextContent as s, TOAST_SWIPE_CANCEL as t, ToastProvider_default as u };

//# sourceMappingURL=utils.js.map