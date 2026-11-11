import { a as VIEWPORT_PAUSE, c as handleAndDispatchCustomEvent, d as useCollection, f as Presence_default, l as isDeltaInDirection, m as getActiveElement, o as VIEWPORT_RESUME, p as useForwardExpose, s as getAnnounceTextContent, u as injectToastProviderContext } from "./NuxtEditorApp.js";
import { a as useComponentProps, i as tv, l as createContext, o as Primitive, r as Icon_default, t as Avatar_default } from "./Avatar.js";
import { c as useForwardProps, d as useLocale, f as VisuallyHidden_default, t as Button_default } from "./Button.js";
import { T as useTimeout, d as useResizeObserver, f as useVModel, g as isClient, r as onKeyStroke, u as useRafFn, y as reactivePick } from "./dist.js";
import { i as useAppConfig } from "./iconify.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper.js";
import { Fragment, Teleport, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, mergeProps, nextTick, normalizeClass, normalizeProps, normalizeStyle, onMounted, onScopeDispose, onUnmounted, openBlock, reactive, ref, renderList, renderSlot, resolveDynamicComponent, shallowRef, toDisplayString, toRef, unref, useSlots, useTemplateRef, watch, watchEffect, withCtx, withModifiers } from "vue";
// ../../../../node_modules/reka-ui/dist/shared/nullish.js
function isNullish(value) {
	return value === null || value === void 0;
}
// ../../../../node_modules/reka-ui/dist/Progress/ProgressRoot.js
var DEFAULT_MAX = 100;
var [injectProgressRootContext, provideProgressRootContext] = /*@__PURE__*/ createContext("ProgressRoot");
var isNumber = (v) => typeof v === "number";
function validateValue(value, max) {
	if (isNullish(value) || isNumber(value) && !Number.isNaN(value) && value <= max && value >= 0) return value;
	console.error(`Invalid prop \`value\` of value \`${value}\` supplied to \`ProgressRoot\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or ${DEFAULT_MAX} if no \`max\` prop is set)
  - \`null\`  or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`);
	return null;
}
function validateMax(max) {
	if (isNumber(max) && !Number.isNaN(max) && max > 0) return max;
	console.error(`Invalid prop \`max\` of value \`${max}\` supplied to \`ProgressRoot\`. Only numbers greater than 0 are valid max values. Defaulting to \`${DEFAULT_MAX}\`.`);
	return DEFAULT_MAX;
}
var ProgressRoot_default = /*@__PURE__*/ defineComponent({
	__name: "ProgressRoot",
	props: {
		modelValue: {
			type: [Number, null],
			required: false
		},
		max: {
			type: Number,
			required: false,
			default: DEFAULT_MAX
		},
		getValueLabel: {
			type: Function,
			required: false,
			default: (value, max) => isNumber(value) ? `${Math.round(value / max * DEFAULT_MAX)}%` : void 0
		},
		getValueText: {
			type: Function,
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
	emits: ["update:modelValue", "update:max"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		useForwardExpose();
		const modelValue = useVModel(props, "modelValue", emit, { passive: props.modelValue === void 0 });
		const max = useVModel(props, "max", emit, { passive: props.max === void 0 });
		watch(() => modelValue.value, async (value) => {
			const correctedValue = validateValue(value, props.max);
			if (correctedValue !== value) {
				await nextTick();
				modelValue.value = correctedValue;
			}
		}, { immediate: true });
		watch(() => props.max, (newMax) => {
			const correctedMax = validateMax(props.max);
			if (correctedMax !== newMax) max.value = correctedMax;
		}, { immediate: true });
		const progressState = computed(() => {
			if (isNullish(modelValue.value)) return "indeterminate";
			if (modelValue.value === max.value) return "complete";
			return "loading";
		});
		provideProgressRootContext({
			modelValue,
			max,
			progressState
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Primitive), {
				"as-child": __props.asChild,
				as: __props.as,
				"aria-valuemax": unref(max),
				"aria-valuemin": 0,
				"aria-valuenow": isNumber(unref(modelValue)) ? unref(modelValue) : void 0,
				"aria-valuetext": __props.getValueText?.(unref(modelValue), unref(max)),
				"aria-label": __props.getValueLabel(unref(modelValue), unref(max)),
				role: "progressbar",
				"data-state": progressState.value,
				"data-value": unref(modelValue) ?? void 0,
				"data-max": unref(max)
			}, {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default", { modelValue: unref(modelValue) })]),
				_: 3
			}, 8, [
				"as-child",
				"as",
				"aria-valuemax",
				"aria-valuenow",
				"aria-valuetext",
				"aria-label",
				"data-state",
				"data-value",
				"data-max"
			]);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Progress/ProgressIndicator.js
var ProgressIndicator_default = /*@__PURE__*/ defineComponent({
	__name: "ProgressIndicator",
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
		const rootContext = injectProgressRootContext();
		useForwardExpose();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Primitive), mergeProps(props, {
				"data-state": unref(rootContext).progressState.value,
				"data-value": unref(rootContext).modelValue?.value ?? void 0,
				"data-max": unref(rootContext).max.value
			}), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16, [
				"data-state",
				"data-value",
				"data-max"
			]);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Toast/ToastAnnounceExclude.js
var ToastAnnounceExclude_default = /*@__PURE__*/ defineComponent({
	__name: "ToastAnnounceExclude",
	props: {
		altText: {
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
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Primitive), {
				as: __props.as,
				"as-child": __props.asChild,
				"data-reka-toast-announce-exclude": "",
				"data-reka-toast-announce-alt": __props.altText || void 0
			}, {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 8, [
				"as",
				"as-child",
				"data-reka-toast-announce-alt"
			]);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Toast/ToastAnnounce.js
var ToastAnnounce_default = /*@__PURE__*/ defineComponent({
	__name: "ToastAnnounce",
	setup(__props) {
		const providerContext = injectToastProviderContext();
		const isAnnounced = useTimeout(1e3);
		const renderAnnounceText = ref(false);
		let raf1 = 0;
		let raf2 = 0;
		if (isClient) {
			raf1 = requestAnimationFrame(() => {
				raf2 = requestAnimationFrame(() => {
					renderAnnounceText.value = true;
				});
			});
			onScopeDispose(() => {
				cancelAnimationFrame(raf1);
				cancelAnimationFrame(raf2);
			});
		}
		return (_ctx, _cache) => {
			return unref(isAnnounced) || renderAnnounceText.value ? (openBlock(), createBlock(unref(VisuallyHidden_default), {
				key: 0,
				feature: "fully-hidden"
			}, {
				default: withCtx(() => [createTextVNode(toDisplayString(unref(providerContext).label.value) + " ", 1), renderSlot(_ctx.$slots, "default")]),
				_: 3
			})) : createCommentVNode("v-if", true);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Toast/ToastPositioner.js
var [injectToastPositionerContext, provideToastPositionerContext] = /*@__PURE__*/ createContext("ToastPositioner");
// ../../../../node_modules/reka-ui/dist/Toast/ToastRootImpl.js
var [injectToastRootContext, provideToastRootContext] = /*@__PURE__*/ createContext("ToastRoot");
var ToastRootImpl_default = /*@__PURE__*/ defineComponent({
	inheritAttrs: false,
	__name: "ToastRootImpl",
	props: {
		type: {
			type: String,
			required: false
		},
		open: {
			type: Boolean,
			required: false,
			default: false
		},
		duration: {
			type: Number,
			required: false
		},
		toast: {
			type: Object,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "li"
		}
	},
	emits: [
		"close",
		"escapeKeyDown",
		"pause",
		"resume",
		"swipeStart",
		"swipeMove",
		"swipeCancel",
		"swipeEnd"
	],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const { forwardRef, currentElement } = useForwardExpose();
		const { CollectionItem } = useCollection();
		const providerContext = injectToastProviderContext();
		const pointerStartRef = ref(null);
		const swipeDeltaRef = ref(null);
		const duration = computed(() => typeof props.duration === "number" ? props.duration : providerContext.duration.value);
		const closeTimerStartTimeRef = ref(0);
		const closeTimerRemainingTimeRef = ref(duration.value);
		const closeTimerRef = ref(0);
		const remainingTime = ref(duration.value);
		const remainingRaf = useRafFn(() => {
			const elapsedTime = Date.now() - closeTimerStartTimeRef.value;
			remainingTime.value = Math.max(closeTimerRemainingTimeRef.value - elapsedTime, 0);
		}, { fpsLimit: 60 });
		function startTimer(duration$1) {
			if (duration$1 <= 0 || duration$1 === Number.POSITIVE_INFINITY) return;
			if (!isClient) return;
			window.clearTimeout(closeTimerRef.value);
			closeTimerStartTimeRef.value = Date.now();
			closeTimerRef.value = window.setTimeout(handleClose, duration$1);
		}
		function handleClose(event) {
			const isNonPointerEvent = event?.pointerType === "";
			if (currentElement.value?.contains(getActiveElement()) && isNonPointerEvent) providerContext.viewport.value?.focus();
			if (isNonPointerEvent) providerContext.isClosePausedRef.value = false;
			emits("close");
		}
		const positionerContext = injectToastPositionerContext(null);
		const announceTextContent = shallowRef(null);
		watch([currentElement, () => props.toast?.updateKey], ([element]) => {
			announceTextContent.value = element ? getAnnounceTextContent(element) : null;
		}, {
			flush: "post",
			immediate: true
		});
		const stackEntry = /*#__PURE__*/ reactive({
			seq: 0,
			height: 0,
			open: props.open
		});
		const stack = computed(() => providerContext.getToastStack(stackEntry));
		function measureHeight() {
			const element = currentElement.value;
			if (!element) return;
			const previousHeight = element.style.height;
			element.style.height = "auto";
			stackEntry.height = element.offsetHeight;
			element.style.height = previousHeight;
		}
		useResizeObserver(currentElement, measureHeight);
		watch(() => props.toast?.updateKey, measureHeight, { flush: "post" });
		watch(() => props.open, (open, wasOpen) => {
			stackEntry.open = open;
			if (open && !wasOpen) providerContext.reopenToast(stackEntry);
		});
		if (props.type && !["foreground", "background"].includes(props.type)) throw new Error("Invalid prop `type` supplied to `Toast`. Expected `foreground | background`.");
		watchEffect((cleanupFn) => {
			const viewport = providerContext.viewport.value;
			if (viewport) {
				const handleResume = () => {
					startTimer(closeTimerRemainingTimeRef.value);
					remainingRaf.resume();
					emits("resume");
				};
				const handlePause = () => {
					const elapsedTime = Date.now() - closeTimerStartTimeRef.value;
					closeTimerRemainingTimeRef.value = closeTimerRemainingTimeRef.value - elapsedTime;
					window.clearTimeout(closeTimerRef.value);
					remainingRaf.pause();
					emits("pause");
				};
				viewport.addEventListener(VIEWPORT_PAUSE, handlePause);
				viewport.addEventListener(VIEWPORT_RESUME, handleResume);
				cleanupFn(() => {
					viewport.removeEventListener(VIEWPORT_PAUSE, handlePause);
					viewport.removeEventListener(VIEWPORT_RESUME, handleResume);
				});
			}
		});
		const restartKey = computed(() => props.toast ? providerContext.toastStore.getRestartKey(props.toast.id) : 0);
		watch([
			() => props.open,
			duration,
			restartKey
		], () => {
			closeTimerRemainingTimeRef.value = duration.value;
			if (props.open && !providerContext.isClosePausedRef.value) startTimer(duration.value);
		}, { immediate: true });
		onKeyStroke("Escape", (event) => {
			emits("escapeKeyDown", event);
			if (!event.defaultPrevented) {
				providerContext.isFocusedToastEscapeKeyDownRef.value = true;
				handleClose();
			}
		});
		let unregisterToast;
		onMounted(() => {
			providerContext.onToastAdd();
			unregisterToast = providerContext.registerToast(stackEntry);
			measureHeight();
		});
		onUnmounted(() => {
			providerContext.onToastRemove();
			unregisterToast?.();
		});
		provideToastRootContext({
			onClose: handleClose,
			toast: toRef(props, "toast")
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock(Fragment, null, [announceTextContent.value ? (openBlock(), createBlock(ToastAnnounce_default, {
				key: __props.toast?.updateKey ?? 0,
				role: "alert",
				"aria-live": __props.type === "foreground" ? "assertive" : "polite"
			}, {
				default: withCtx(() => [createCommentVNode("\n      Render each chunk as its own text node so screen readers get the\n      natural pause break between nodes (see comment in utils.ts).\n      Interpolating the array directly with `{{ announceTextContent }}`\n      would route through Vue's `toDisplayString`, which JSON-stringifies\n      arrays — the live region would then announce literal `[`, quotes\n      and commas instead of the toast title and description.\n    "), (openBlock(true), createElementBlock(Fragment, null, renderList(announceTextContent.value, (text, i) => {
					return openBlock(), createElementBlock(Fragment, { key: i }, [createTextVNode(toDisplayString(text), 1)], 64);
				}), 128))]),
				_: 1
			}, 8, ["aria-live"])) : createCommentVNode("v-if", true), unref(providerContext).viewport.value || unref(positionerContext) ? (openBlock(), createBlock(Teleport, {
				key: 1,
				to: unref(providerContext).viewport.value ?? "body",
				disabled: !!unref(positionerContext)
			}, [createVNode(unref(CollectionItem), null, {
				default: withCtx(() => [createVNode(unref(Primitive), mergeProps({
					ref: unref(forwardRef),
					tabindex: "0"
				}, _ctx.$attrs, {
					as: __props.as,
					"as-child": __props.asChild,
					"data-state": __props.open ? "open" : "closed",
					"data-swipe-direction": unref(providerContext).swipeDirection.value,
					"data-status": __props.toast?.status,
					"data-expanded": unref(providerContext).expanded.value ? "" : void 0,
					"data-limited": stack.value.limited ? "" : void 0,
					inert: stack.value.limited || void 0,
					style: {
						...unref(providerContext).disableSwipe.value ? void 0 : {
							userSelect: "none",
							touchAction: "none"
						},
						"--reka-toast-index": stack.value.index,
						"--reka-toast-offset-y": `${stack.value.offsetY}px`,
						"--reka-toast-height": stackEntry.height ? `${stackEntry.height}px` : void 0
					},
					onPointerdown: _cache[0] || (_cache[0] = withModifiers((event) => {
						if (unref(providerContext).disableSwipe.value) return;
						pointerStartRef.value = {
							x: event.clientX,
							y: event.clientY
						};
					}, ["left"])),
					onPointermove: _cache[1] || (_cache[1] = (event) => {
						if (unref(providerContext).disableSwipe.value || !pointerStartRef.value) return;
						const x = event.clientX - pointerStartRef.value.x;
						const y = event.clientY - pointerStartRef.value.y;
						const hasSwipeMoveStarted = Boolean(swipeDeltaRef.value);
						const isHorizontalSwipe = ["left", "right"].includes(unref(providerContext).swipeDirection.value);
						const clamp = ["left", "up"].includes(unref(providerContext).swipeDirection.value) ? Math.min : Math.max;
						const clampedX = isHorizontalSwipe ? clamp(0, x) : 0;
						const clampedY = !isHorizontalSwipe ? clamp(0, y) : 0;
						const moveStartBuffer = event.pointerType === "touch" ? 10 : 2;
						const delta = {
							x: clampedX,
							y: clampedY
						};
						const eventDetail = {
							originalEvent: event,
							delta
						};
						if (hasSwipeMoveStarted) {
							swipeDeltaRef.value = delta;
							unref(handleAndDispatchCustomEvent)(unref("toast.swipeMove"), (ev) => emits("swipeMove", ev), eventDetail);
						} else if (unref(isDeltaInDirection)(delta, unref(providerContext).swipeDirection.value, moveStartBuffer)) {
							swipeDeltaRef.value = delta;
							unref(handleAndDispatchCustomEvent)(unref("toast.swipeStart"), (ev) => emits("swipeStart", ev), eventDetail);
							event.target.setPointerCapture(event.pointerId);
						} else if (Math.abs(x) > moveStartBuffer || Math.abs(y) > moveStartBuffer) pointerStartRef.value = null;
					}),
					onPointerup: _cache[2] || (_cache[2] = (event) => {
						if (unref(providerContext).disableSwipe.value) return;
						const delta = swipeDeltaRef.value;
						const target = event.target;
						if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId);
						swipeDeltaRef.value = null;
						pointerStartRef.value = null;
						if (delta) {
							const toast = event.currentTarget;
							const eventDetail = {
								originalEvent: event,
								delta
							};
							if (unref(isDeltaInDirection)(delta, unref(providerContext).swipeDirection.value, unref(providerContext).swipeThreshold.value)) unref(handleAndDispatchCustomEvent)(unref("toast.swipeEnd"), (ev) => emits("swipeEnd", ev), eventDetail);
							else unref(handleAndDispatchCustomEvent)(unref("toast.swipeCancel"), (ev) => emits("swipeCancel", ev), eventDetail);
							toast?.addEventListener("click", (event$1) => event$1.preventDefault(), { once: true });
						}
					})
				}), {
					default: withCtx(() => [renderSlot(_ctx.$slots, "default", {
						remaining: remainingTime.value,
						duration: duration.value
					})]),
					_: 3
				}, 16, [
					"as",
					"as-child",
					"data-state",
					"data-swipe-direction",
					"data-status",
					"data-expanded",
					"data-limited",
					"inert",
					"style"
				])]),
				_: 3
			})], 8, ["to", "disabled"])) : createCommentVNode("v-if", true)], 64);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Toast/ToastAction.js
var ToastAction_default = /*@__PURE__*/ defineComponent({
	__name: "ToastAction",
	props: {
		altText: {
			type: String,
			required: false
		},
		closeOnClick: {
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
			required: false,
			default: "button"
		}
	},
	setup(__props) {
		const props = __props;
		const rootContext = injectToastRootContext();
		const { forwardRef } = useForwardExpose();
		const slots = useSlots();
		const actionProps = computed(() => rootContext.toast.value?.actionProps);
		const isRendered = computed(() => !!slots.default || !rootContext.toast.value || !!actionProps.value);
		const altText = computed(() => props.altText ?? actionProps.value?.altText);
		if (isRendered.value && !altText.value) throw new Error("Missing prop `altText` expected on `ToastAction`");
		function handleClick(event) {
			actionProps.value?.onClick?.(event);
			if (actionProps.value?.closeOnClick ?? props.closeOnClick) rootContext.onClose(event);
		}
		return (_ctx, _cache) => {
			return isRendered.value && altText.value ? (openBlock(), createBlock(ToastAnnounceExclude_default, {
				key: 0,
				"alt-text": altText.value,
				"as-child": ""
			}, {
				default: withCtx(() => [createVNode(unref(Primitive), {
					ref: unref(forwardRef),
					as: __props.as,
					"as-child": __props.asChild,
					type: __props.as === "button" ? "button" : void 0,
					onClick: handleClick
				}, {
					default: withCtx(() => [renderSlot(_ctx.$slots, "default", {}, () => [createTextVNode(toDisplayString(actionProps.value?.label), 1)])]),
					_: 3
				}, 8, [
					"as",
					"as-child",
					"type"
				])]),
				_: 3
			}, 8, ["alt-text"])) : createCommentVNode("v-if", true);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Toast/ToastClose.js
var ToastClose_default = /*@__PURE__*/ defineComponent({
	__name: "ToastClose",
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
		const rootContext = injectToastRootContext();
		const { forwardRef } = useForwardExpose();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(ToastAnnounceExclude_default, { "as-child": "" }, {
				default: withCtx(() => [createVNode(unref(Primitive), mergeProps(props, {
					ref: unref(forwardRef),
					type: __props.as === "button" ? "button" : void 0,
					onClick: unref(rootContext).onClose
				}), {
					default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
					_: 3
				}, 16, ["type", "onClick"])]),
				_: 3
			});
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Toast/ToastDescription.js
var ToastDescription_default = /*@__PURE__*/ defineComponent({
	__name: "ToastDescription",
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
		const rootContext = injectToastRootContext(null);
		return (_ctx, _cache) => {
			return _ctx.$slots.default || !unref(rootContext)?.toast.value || unref(rootContext).toast.value.description ? (openBlock(), createBlock(unref(Primitive), normalizeProps(mergeProps({ key: 0 }, props)), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default", {}, () => [createTextVNode(toDisplayString(unref(rootContext)?.toast.value?.description), 1)])]),
				_: 3
			}, 16)) : createCommentVNode("v-if", true);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Toast/ToastRoot.js
var ToastRoot_default = /*@__PURE__*/ defineComponent({
	__name: "ToastRoot",
	props: {
		defaultOpen: {
			type: Boolean,
			required: false,
			default: true
		},
		forceMount: {
			type: Boolean,
			required: false
		},
		type: {
			type: String,
			required: false,
			default: "foreground"
		},
		open: {
			type: Boolean,
			required: false,
			default: void 0
		},
		duration: {
			type: Number,
			required: false
		},
		toast: {
			type: Object,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "li"
		}
	},
	emits: [
		"escapeKeyDown",
		"pause",
		"resume",
		"swipeStart",
		"swipeMove",
		"swipeCancel",
		"swipeEnd",
		"update:open"
	],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const { forwardRef } = useForwardExpose();
		const open = useVModel(props, "open", emits, {
			defaultValue: props.defaultOpen,
			passive: props.open === void 0
		});
		const providerContext = injectToastProviderContext();
		const isOpen = computed(() => props.toast ? props.toast.open : open.value);
		const resolvedType = computed(() => props.toast?.type ?? props.type);
		const resolvedDuration = computed(() => props.toast?.status === "loading" ? Number.POSITIVE_INFINITY : props.toast?.duration ?? props.duration);
		function close() {
			if (props.toast) {
				providerContext.toastStore.close(props.toast.id);
				emits("update:open", false);
			} else open.value = false;
		}
		const isContentMounted = ref(false);
		watch([() => props.toast, isContentMounted], ([toast, mounted]) => {
			if (toast && !toast.open && !mounted) providerContext.toastStore.remove(toast.id);
		}, { immediate: true });
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Presence_default), { present: __props.forceMount || isOpen.value }, {
				default: withCtx(() => [createVNode(ToastRootImpl_default, mergeProps({
					ref: unref(forwardRef),
					open: isOpen.value,
					type: resolvedType.value,
					as: __props.as,
					"as-child": __props.asChild,
					duration: resolvedDuration.value,
					toast: __props.toast
				}, _ctx.$attrs, {
					onVnodeMounted: _cache[0] || (_cache[0] = ($event) => isContentMounted.value = true),
					onVnodeUnmounted: _cache[1] || (_cache[1] = ($event) => isContentMounted.value = false),
					onClose: close,
					onPause: _cache[2] || (_cache[2] = ($event) => emits("pause")),
					onResume: _cache[3] || (_cache[3] = ($event) => emits("resume")),
					onEscapeKeyDown: _cache[4] || (_cache[4] = ($event) => emits("escapeKeyDown", $event)),
					onSwipeStart: _cache[5] || (_cache[5] = (event) => {
						emits("swipeStart", event);
						if (!event.defaultPrevented) event.currentTarget.setAttribute("data-swipe", "start");
					}),
					onSwipeMove: _cache[6] || (_cache[6] = (event) => {
						emits("swipeMove", event);
						if (!event.defaultPrevented) {
							const { x, y } = event.detail.delta;
							const target = event.currentTarget;
							target.setAttribute("data-swipe", "move");
							target.style.setProperty("--reka-toast-swipe-move-x", `${x}px`);
							target.style.setProperty("--reka-toast-swipe-move-y", `${y}px`);
						}
					}),
					onSwipeCancel: _cache[7] || (_cache[7] = (event) => {
						emits("swipeCancel", event);
						if (!event.defaultPrevented) {
							const target = event.currentTarget;
							target.setAttribute("data-swipe", "cancel");
							target.style.removeProperty("--reka-toast-swipe-move-x");
							target.style.removeProperty("--reka-toast-swipe-move-y");
							target.style.removeProperty("--reka-toast-swipe-end-x");
							target.style.removeProperty("--reka-toast-swipe-end-y");
						}
					}),
					onSwipeEnd: _cache[8] || (_cache[8] = (event) => {
						emits("swipeEnd", event);
						if (!event.defaultPrevented) {
							const { x, y } = event.detail.delta;
							const target = event.currentTarget;
							target.setAttribute("data-swipe", "end");
							target.style.removeProperty("--reka-toast-swipe-move-x");
							target.style.removeProperty("--reka-toast-swipe-move-y");
							target.style.setProperty("--reka-toast-swipe-end-x", `${x}px`);
							target.style.setProperty("--reka-toast-swipe-end-y", `${y}px`);
							close();
						}
					})
				}), {
					default: withCtx(({ remaining, duration: _duration }) => [renderSlot(_ctx.$slots, "default", {
						remaining,
						duration: _duration,
						open: isOpen.value
					})]),
					_: 3
				}, 16, [
					"open",
					"type",
					"as",
					"as-child",
					"duration",
					"toast"
				])]),
				_: 3
			}, 8, ["present"]);
		};
	}
});
// ../../../../node_modules/reka-ui/dist/Toast/ToastTitle.js
var ToastTitle_default = /*@__PURE__*/ defineComponent({
	__name: "ToastTitle",
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
		const rootContext = injectToastRootContext(null);
		return (_ctx, _cache) => {
			return _ctx.$slots.default || !unref(rootContext)?.toast.value || unref(rootContext).toast.value.title ? (openBlock(), createBlock(unref(Primitive), normalizeProps(mergeProps({ key: 0 }, props)), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default", {}, () => [createTextVNode(toDisplayString(unref(rootContext)?.toast.value?.title), 1)])]),
				_: 3
			}, 16)) : createCommentVNode("v-if", true);
		};
	}
});
// virtual:nuxt-ui-templates/ui/progress.ts
var progress_default = {
	"slots": {
		"root": "gap-2",
		"base": "relative overflow-hidden rounded-full bg-accented",
		"indicator": "rounded-full size-full transition-transform duration-200 ease-out motion-reduce:transition-none motion-reduce:data-[state=indeterminate]:animate-pulse",
		"status": "flex text-dimmed duration-200 ease-out motion-reduce:transition-none",
		"steps": "grid items-end",
		"step": "truncate text-end row-start-1 col-start-1 transition-opacity ease-out"
	},
	"variants": {
		"animation": {
			"carousel": "",
			"carousel-inverse": "",
			"swing": "",
			"elastic": ""
		},
		"color": {
			"primary": {
				"indicator": "bg-primary",
				"steps": "text-primary"
			},
			"secondary": {
				"indicator": "bg-secondary",
				"steps": "text-secondary"
			},
			"success": {
				"indicator": "bg-success",
				"steps": "text-success"
			},
			"info": {
				"indicator": "bg-info",
				"steps": "text-info"
			},
			"warning": {
				"indicator": "bg-warning",
				"steps": "text-warning"
			},
			"error": {
				"indicator": "bg-error",
				"steps": "text-error"
			},
			"neutral": {
				"indicator": "bg-inverted",
				"steps": "text-highlighted"
			}
		},
		"size": {
			"2xs": {
				"status": "text-xs",
				"steps": "text-xs"
			},
			"xs": {
				"status": "text-xs",
				"steps": "text-xs"
			},
			"sm": {
				"status": "text-sm",
				"steps": "text-sm"
			},
			"md": {
				"status": "text-sm",
				"steps": "text-sm"
			},
			"lg": {
				"status": "text-sm",
				"steps": "text-sm"
			},
			"xl": {
				"status": "text-base",
				"steps": "text-base"
			},
			"2xl": {
				"status": "text-base",
				"steps": "text-base"
			}
		},
		"step": {
			"active": { "step": "opacity-100" },
			"first": { "step": "opacity-100 text-muted" },
			"other": { "step": "opacity-0" },
			"last": { "step": "" }
		},
		"orientation": {
			"horizontal": {
				"root": "w-full flex flex-col",
				"base": "w-full",
				"status": "flex-row items-center justify-end w-(--percent) min-w-fit transition-[width]"
			},
			"vertical": {
				"root": "h-full flex flex-row-reverse",
				"base": "h-full",
				"status": "flex-col justify-end h-(--percent) min-h-fit transition-[height]"
			}
		},
		"inverted": { "true": { "status": "self-end" } }
	},
	"compoundVariants": [
		{
			"inverted": true,
			"orientation": "horizontal",
			"class": {
				"step": "text-start",
				"status": "flex-row-reverse"
			}
		},
		{
			"inverted": true,
			"orientation": "vertical",
			"class": {
				"steps": "items-start",
				"status": "flex-col-reverse"
			}
		},
		{
			"orientation": "horizontal",
			"size": "2xs",
			"class": "h-px"
		},
		{
			"orientation": "horizontal",
			"size": "xs",
			"class": "h-0.5"
		},
		{
			"orientation": "horizontal",
			"size": "sm",
			"class": "h-1"
		},
		{
			"orientation": "horizontal",
			"size": "md",
			"class": "h-2"
		},
		{
			"orientation": "horizontal",
			"size": "lg",
			"class": "h-3"
		},
		{
			"orientation": "horizontal",
			"size": "xl",
			"class": "h-4"
		},
		{
			"orientation": "horizontal",
			"size": "2xl",
			"class": "h-5"
		},
		{
			"orientation": "vertical",
			"size": "2xs",
			"class": "w-px"
		},
		{
			"orientation": "vertical",
			"size": "xs",
			"class": "w-0.5"
		},
		{
			"orientation": "vertical",
			"size": "sm",
			"class": "w-1"
		},
		{
			"orientation": "vertical",
			"size": "md",
			"class": "w-2"
		},
		{
			"orientation": "vertical",
			"size": "lg",
			"class": "w-3"
		},
		{
			"orientation": "vertical",
			"size": "xl",
			"class": "w-4"
		},
		{
			"orientation": "vertical",
			"size": "2xl",
			"class": "w-5"
		},
		{
			"orientation": "horizontal",
			"animation": "carousel",
			"class": { "indicator": "motion-safe:data-[state=indeterminate]:animate-[carousel_2s_linear_infinite] motion-safe:data-[state=indeterminate]:rtl:animate-[carousel-rtl_2s_linear_infinite]" }
		},
		{
			"orientation": "vertical",
			"animation": "carousel",
			"class": { "indicator": "motion-safe:data-[state=indeterminate]:animate-[carousel-vertical_2s_linear_infinite]" }
		},
		{
			"orientation": "horizontal",
			"animation": "carousel-inverse",
			"class": { "indicator": "motion-safe:data-[state=indeterminate]:animate-[carousel-inverse_2s_linear_infinite] motion-safe:data-[state=indeterminate]:rtl:animate-[carousel-inverse-rtl_2s_linear_infinite]" }
		},
		{
			"orientation": "vertical",
			"animation": "carousel-inverse",
			"class": { "indicator": "motion-safe:data-[state=indeterminate]:animate-[carousel-inverse-vertical_2s_linear_infinite]" }
		},
		{
			"orientation": "horizontal",
			"animation": "swing",
			"class": { "indicator": "motion-safe:data-[state=indeterminate]:animate-[swing_2s_var(--ease-in-out)_infinite]" }
		},
		{
			"orientation": "vertical",
			"animation": "swing",
			"class": { "indicator": "motion-safe:data-[state=indeterminate]:animate-[swing-vertical_2s_var(--ease-in-out)_infinite]" }
		},
		{
			"orientation": "horizontal",
			"animation": "elastic",
			"class": { "indicator": "relative motion-safe:data-[state=indeterminate]:animate-[elastic_2s_var(--ease-in-out)_infinite]" }
		},
		{
			"orientation": "vertical",
			"animation": "elastic",
			"class": { "indicator": "relative motion-safe:data-[state=indeterminate]:animate-[elastic-vertical_2s_var(--ease-in-out)_infinite]" }
		}
	],
	"defaultVariants": {
		"animation": "carousel",
		"color": "primary",
		"size": "md"
	}
};
// ../../../../node_modules/@nuxt/ui/dist/runtime/components/Progress.vue
var _sfc_main$1 = {
	__name: "Progress",
	props: {
		as: {
			type: null,
			required: false
		},
		max: {
			type: [Number, Array],
			required: false
		},
		status: {
			type: Boolean,
			required: false
		},
		inverted: {
			type: Boolean,
			required: false,
			default: false
		},
		size: {
			type: null,
			required: false
		},
		color: {
			type: null,
			required: false
		},
		orientation: {
			type: null,
			required: false,
			default: "horizontal"
		},
		animation: {
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
		getValueLabel: {
			type: Function,
			required: false
		},
		getValueText: {
			type: Function,
			required: false
		},
		modelValue: {
			type: [Number, null],
			required: false,
			default: null
		}
	},
	emits: ["update:modelValue", "update:max"],
	setup(__props, { expose: __expose, emit: __emit }) {
		__expose();
		const _props = __props;
		const emits = __emit;
		const slots = useSlots();
		const props = useComponentProps("progress", _props);
		const { dir } = useLocale();
		const appConfig = useAppConfig();
		const rootProps = useForwardProps(reactivePick(props, "getValueLabel", "getValueText", "modelValue"), emits);
		const isIndeterminate = computed(() => rootProps.value.modelValue === null);
		const hasSteps = computed(() => Array.isArray(props.max));
		const realMax = computed(() => {
			if (isIndeterminate.value || !props.max) return;
			if (Array.isArray(props.max)) return props.max.length - 1;
			return Number(props.max);
		});
		const percent = computed(() => {
			if (isIndeterminate.value) return;
			switch (true) {
				case rootProps.value.modelValue < 0: return 0;
				case rootProps.value.modelValue > (realMax.value ?? 100): return 100;
				default: return Math.round(rootProps.value.modelValue / (realMax.value ?? 100) * 100);
			}
		});
		const indicatorStyle = computed(() => {
			if (percent.value === void 0) return;
			if (props.orientation === "vertical") return { transform: `translateY(${props.inverted ? "" : "-"}${100 - percent.value}%)` };
			else if (dir.value === "rtl") return { transform: `translateX(${props.inverted ? "-" : ""}${100 - percent.value}%)` };
			else return { transform: `translateX(${props.inverted ? "" : "-"}${100 - percent.value}%)` };
		});
		const statusStyle = computed(() => ({ "--percent": `${Math.max(percent.value ?? 0, 0)}%` }));
		function isActive(index) {
			return index === Number(props.modelValue);
		}
		function isFirst(index) {
			return index === 0;
		}
		function isLast(index) {
			return index === realMax.value;
		}
		function stepVariant(index) {
			index = Number(index);
			if (isActive(index) && !isFirst(index)) return "active";
			if (isFirst(index) && isActive(index)) return "first";
			if (isLast(index) && isActive(index)) return "last";
			return "other";
		}
		const ui = computed(() => tv({
			extend: progress_default,
			...appConfig.ui?.progress || {}
		})({
			animation: props.animation,
			size: props.size,
			color: props.color,
			orientation: props.orientation,
			inverted: props.inverted
		}));
		const themeColors = computed(() => Object.keys({
			...progress_default.variants?.color,
			...appConfig.ui?.progress?.variants?.color
		}));
		const __returned__ = {
			_props,
			emits,
			slots,
			props,
			dir,
			appConfig,
			rootProps,
			isIndeterminate,
			hasSteps,
			realMax,
			percent,
			indicatorStyle,
			statusStyle,
			isActive,
			isFirst,
			isLast,
			stepVariant,
			ui,
			themeColors,
			customColor: computed(() => props.color && !themeColors.value.includes(props.color) ? props.color : void 0),
			get theme() {
				return progress_default;
			},
			computed,
			get Primitive() {
				return Primitive;
			},
			get ProgressRoot() {
				return ProgressRoot_default;
			},
			get ProgressIndicator() {
				return ProgressIndicator_default;
			},
			get useForwardProps() {
				return useForwardProps;
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
			get useLocale() {
				return useLocale;
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
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
	return openBlock(), createBlock($setup["Primitive"], {
		as: $setup.props.as,
		"data-orientation": $setup.props.orientation,
		"data-slot": "root",
		class: normalizeClass($setup.ui.root({ class: [$setup.props.ui?.root, $setup.props.class] }))
	}, {
		default: withCtx(() => [
			!$setup.isIndeterminate && ($setup.props.status || !!$setup.slots.status) ? (openBlock(), createElementBlock("div", {
				key: 0,
				"data-slot": "status",
				class: normalizeClass($setup.ui.status({ class: $setup.props.ui?.status })),
				style: normalizeStyle($setup.statusStyle)
			}, [renderSlot(_ctx.$slots, "status", { percent: $setup.percent }, () => [createTextVNode(toDisplayString($setup.percent) + "% ", 1)])], 6)) : createCommentVNode("", true),
			createVNode($setup["ProgressRoot"], mergeProps($setup.rootProps, {
				max: $setup.realMax,
				"data-slot": "base",
				class: $setup.ui.base({ class: $setup.props.ui?.base }),
				style: { "transform": "translateZ(0)" }
			}), {
				default: withCtx(() => [createVNode($setup["ProgressIndicator"], {
					"data-slot": "indicator",
					class: normalizeClass($setup.ui.indicator({ class: $setup.props.ui?.indicator })),
					style: normalizeStyle([$setup.indicatorStyle, $setup.customColor ? { backgroundColor: $setup.customColor } : void 0])
				}, null, 8, ["class", "style"])]),
				_: 1
			}, 16, ["max", "class"]),
			$setup.hasSteps ? (openBlock(), createElementBlock("div", {
				key: 1,
				"data-slot": "steps",
				class: normalizeClass($setup.ui.steps({ class: $setup.props.ui?.steps })),
				style: normalizeStyle($setup.customColor ? { color: $setup.customColor } : void 0)
			}, [(openBlock(true), createElementBlock(Fragment, null, renderList($setup.props.max, (step, index) => {
				return openBlock(), createElementBlock("div", {
					key: index,
					"data-slot": "step",
					class: normalizeClass($setup.ui.step({
						class: $setup.props.ui?.step,
						step: $setup.stepVariant(index)
					}))
				}, [renderSlot(_ctx.$slots, `step-${index}`, { step }, () => [createTextVNode(toDisplayString(step), 1)])], 2);
			}), 128))], 6)) : createCommentVNode("", true)
		]),
		_: 3
	}, 8, [
		"as",
		"data-orientation",
		"class"
	]);
}
var Progress_default = /*@__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$1, [["render", _sfc_render$1], ["__file", "Progress.vue"]]);
// virtual:nuxt-ui-templates/ui/toast.ts
var toast_default = {
	"slots": {
		"root": "relative group overflow-hidden bg-default shadow-lg rounded-lg ring ring-default p-4 flex gap-2.5",
		"wrapper": "w-0 flex-1 flex flex-col",
		"title": "text-sm font-medium text-highlighted",
		"description": "text-sm text-muted",
		"icon": "shrink-0 size-5",
		"avatar": "shrink-0",
		"avatarSize": "2xl",
		"actions": "flex gap-1.5 shrink-0",
		"progress": "absolute inset-x-0 bottom-0",
		"close": "p-0"
	},
	"variants": {
		"color": {
			"primary": {
				"root": "outline-primary/25 focus-visible:outline-3 focus-visible:ring-primary",
				"icon": "text-primary"
			},
			"secondary": {
				"root": "outline-secondary/25 focus-visible:outline-3 focus-visible:ring-secondary",
				"icon": "text-secondary"
			},
			"success": {
				"root": "outline-success/25 focus-visible:outline-3 focus-visible:ring-success",
				"icon": "text-success"
			},
			"info": {
				"root": "outline-info/25 focus-visible:outline-3 focus-visible:ring-info",
				"icon": "text-info"
			},
			"warning": {
				"root": "outline-warning/25 focus-visible:outline-3 focus-visible:ring-warning",
				"icon": "text-warning"
			},
			"error": {
				"root": "outline-error/25 focus-visible:outline-3 focus-visible:ring-error",
				"icon": "text-error"
			},
			"neutral": {
				"root": "outline-inverted/25 focus-visible:outline-3 focus-visible:ring-inverted",
				"icon": "text-highlighted"
			}
		},
		"orientation": {
			"horizontal": {
				"root": "items-center",
				"actions": "items-center"
			},
			"vertical": {
				"root": "items-start",
				"actions": "items-start mt-2.5"
			}
		},
		"title": { "true": { "description": "mt-1" } }
	},
	"defaultVariants": { "color": "primary" }
};
// ../../../../node_modules/@nuxt/ui/dist/runtime/components/Toast.vue
var _sfc_main = {
	__name: "Toast",
	props: {
		as: {
			type: null,
			required: false
		},
		title: {
			type: [
				String,
				Object,
				Function
			],
			required: false
		},
		description: {
			type: [
				String,
				Object,
				Function
			],
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
		orientation: {
			type: null,
			required: false,
			default: "vertical"
		},
		close: {
			type: [Boolean, Object],
			required: false,
			default: true
		},
		closeIcon: {
			type: null,
			required: false
		},
		actions: {
			type: Array,
			required: false
		},
		duration: {
			type: Number,
			required: false
		},
		progress: {
			type: [Boolean, Object],
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
		type: {
			type: String,
			required: false
		}
	},
	emits: [
		"escapeKeyDown",
		"pause",
		"resume",
		"swipeStart",
		"swipeMove",
		"swipeCancel",
		"swipeEnd",
		"update:open"
	],
	setup(__props, { expose: __expose, emit: __emit }) {
		const _props = __props;
		const emits = __emit;
		const slots = useSlots();
		const props = useComponentProps("toast", _props);
		const { t } = useLocale();
		const appConfig = useAppConfig();
		const rootProps = useForwardProps(reactivePick(props, "as", "defaultOpen", "open", "duration", "type"), emits);
		const ui = computed(() => tv({
			extend: toast_default,
			...appConfig.ui?.toast || {}
		})({
			color: props.color,
			orientation: props.orientation,
			title: !!props.title || !!slots.title
		}));
		const rootRef = useTemplateRef("rootRef");
		const height = ref(0);
		onMounted(() => {
			if (!rootRef.value?.$el?.getBoundingClientRect) return;
			height.value = rootRef.value.$el.getBoundingClientRect().height;
		});
		__expose({ height });
		const __returned__ = {
			_props,
			emits,
			slots,
			props,
			t,
			appConfig,
			rootProps,
			ui,
			rootRef,
			height,
			get theme() {
				return toast_default;
			},
			ref,
			computed,
			onMounted,
			useTemplateRef,
			get ToastRoot() {
				return ToastRoot_default;
			},
			get ToastTitle() {
				return ToastTitle_default;
			},
			get ToastDescription() {
				return ToastDescription_default;
			},
			get ToastAction() {
				return ToastAction_default;
			},
			get ToastClose() {
				return ToastClose_default;
			},
			get useForwardProps() {
				return useForwardProps;
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
			get useLocale() {
				return useLocale;
			},
			get tv() {
				return tv;
			},
			UIcon: Icon_default,
			UAvatar: Avatar_default,
			UButton: Button_default,
			UProgress: Progress_default
		};
		Object.defineProperty(__returned__, "__isScriptSetup", {
			enumerable: false,
			value: true
		});
		return __returned__;
	}
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
	return openBlock(), createBlock($setup["ToastRoot"], mergeProps({ ref: "rootRef" }, $setup.rootProps, {
		"data-orientation": $setup.props.orientation,
		"data-slot": "root",
		class: $setup.ui.root({ class: [$setup.props.ui?.root, $setup.props.class] }),
		style: { "--height": $setup.height }
	}), {
		default: withCtx(({ remaining, duration: totalDuration, open }) => [
			renderSlot(_ctx.$slots, "leading", { ui: $setup.ui }, () => [$setup.props.avatar ? (openBlock(), createBlock($setup["UAvatar"], mergeProps({
				key: 0,
				size: $setup.props.ui?.avatarSize || $setup.ui.avatarSize()
			}, $setup.props.avatar, {
				"data-slot": "avatar",
				class: $setup.ui.avatar({ class: $setup.props.ui?.avatar })
			}), null, 16, ["size", "class"])) : $setup.props.icon ? (openBlock(), createBlock($setup["UIcon"], {
				key: 1,
				name: $setup.props.icon,
				"data-slot": "icon",
				class: normalizeClass($setup.ui.icon({ class: $setup.props.ui?.icon }))
			}, null, 8, ["name", "class"])) : createCommentVNode("", true)]),
			createElementVNode("div", {
				"data-slot": "wrapper",
				class: normalizeClass($setup.ui.wrapper({ class: $setup.props.ui?.wrapper }))
			}, [
				$setup.props.title || !!$setup.slots.title ? (openBlock(), createBlock($setup["ToastTitle"], {
					key: 0,
					"data-slot": "title",
					class: normalizeClass($setup.ui.title({ class: $setup.props.ui?.title }))
				}, {
					default: withCtx(() => [renderSlot(_ctx.$slots, "title", {}, () => [typeof $setup.props.title === "function" ? (openBlock(), createBlock(resolveDynamicComponent($setup.props.title()), { key: 0 })) : typeof $setup.props.title === "object" ? (openBlock(), createBlock(resolveDynamicComponent($setup.props.title), { key: 1 })) : (openBlock(), createElementBlock(Fragment, { key: 2 }, [createTextVNode(toDisplayString($setup.props.title), 1)], 64))])]),
					_: 3
				}, 8, ["class"])) : createCommentVNode("", true),
				$setup.props.description || !!$setup.slots.description ? (openBlock(), createBlock($setup["ToastDescription"], {
					key: 1,
					"data-slot": "description",
					class: normalizeClass($setup.ui.description({ class: $setup.props.ui?.description }))
				}, {
					default: withCtx(() => [renderSlot(_ctx.$slots, "description", {}, () => [typeof $setup.props.description === "function" ? (openBlock(), createBlock(resolveDynamicComponent($setup.props.description()), { key: 0 })) : typeof $setup.props.description === "object" ? (openBlock(), createBlock(resolveDynamicComponent($setup.props.description), { key: 1 })) : (openBlock(), createElementBlock(Fragment, { key: 2 }, [createTextVNode(toDisplayString($setup.props.description), 1)], 64))])]),
					_: 3
				}, 8, ["class"])) : createCommentVNode("", true),
				$setup.props.orientation === "vertical" && ($setup.props.actions?.length || !!$setup.slots.actions) ? (openBlock(), createElementBlock("div", {
					key: 2,
					"data-slot": "actions",
					class: normalizeClass($setup.ui.actions({ class: $setup.props.ui?.actions }))
				}, [renderSlot(_ctx.$slots, "actions", {}, () => [(openBlock(true), createElementBlock(Fragment, null, renderList($setup.props.actions, ({ closeOnClick, ...action }, index) => {
					return openBlock(), createBlock($setup["ToastAction"], {
						key: index,
						"alt-text": action.label || "Action",
						"close-on-click": closeOnClick,
						"as-child": "",
						onClick: _cache[0] || (_cache[0] = withModifiers(() => {}, ["stop"]))
					}, {
						default: withCtx(() => [createVNode($setup["UButton"], mergeProps({
							size: "xs",
							color: $setup.props.color
						}, { ref_for: true }, action), null, 16, ["color"])]),
						_: 2
					}, 1032, ["alt-text", "close-on-click"]);
				}), 128))])], 2)) : createCommentVNode("", true)
			], 2),
			$setup.props.orientation === "horizontal" && ($setup.props.actions?.length || !!$setup.slots.actions) || $setup.props.close ? (openBlock(), createElementBlock("div", {
				key: 0,
				"data-slot": "actions",
				class: normalizeClass($setup.ui.actions({
					class: $setup.props.ui?.actions,
					orientation: "horizontal"
				}))
			}, [$setup.props.orientation === "horizontal" && ($setup.props.actions?.length || !!$setup.slots.actions) ? renderSlot(_ctx.$slots, "actions", {}, () => [(openBlock(true), createElementBlock(Fragment, null, renderList($setup.props.actions, ({ closeOnClick, ...action }, index) => {
				return openBlock(), createBlock($setup["ToastAction"], {
					key: index,
					"alt-text": action.label || "Action",
					"close-on-click": closeOnClick,
					"as-child": "",
					onClick: _cache[1] || (_cache[1] = withModifiers(() => {}, ["stop"]))
				}, {
					default: withCtx(() => [createVNode($setup["UButton"], mergeProps({
						size: "xs",
						color: $setup.props.color
					}, { ref_for: true }, action), null, 16, ["color"])]),
					_: 2
				}, 1032, ["alt-text", "close-on-click"]);
			}), 128))], void 0, 0) : createCommentVNode("", true), $setup.props.close || !!$setup.slots.close ? (openBlock(), createBlock($setup["ToastClose"], {
				key: 1,
				"as-child": ""
			}, {
				default: withCtx(() => [renderSlot(_ctx.$slots, "close", { ui: $setup.ui }, () => [$setup.props.close ? (openBlock(), createBlock($setup["UButton"], mergeProps({
					key: 0,
					icon: $setup.props.closeIcon || $setup.appConfig.ui.icons.close,
					color: "neutral",
					variant: "link",
					"aria-label": $setup.t("toast.close")
				}, typeof $setup.props.close === "object" ? $setup.props.close : {}, {
					"data-slot": "close",
					class: $setup.ui.close({ class: $setup.props.ui?.close }),
					onClick: _cache[2] || (_cache[2] = withModifiers(() => {}, ["stop"]))
				}), null, 16, [
					"icon",
					"aria-label",
					"class"
				])) : createCommentVNode("", true)])]),
				_: 3
			})) : createCommentVNode("", true)], 2)) : createCommentVNode("", true),
			$setup.props.progress && open && remaining > 0 && totalDuration ? (openBlock(), createBlock($setup["UProgress"], mergeProps({
				key: 1,
				"model-value": remaining / totalDuration * 100,
				color: $setup.props.color
			}, typeof $setup.props.progress === "object" ? $setup.props.progress : {}, {
				size: "sm",
				"data-slot": "progress",
				class: $setup.ui.progress({ class: $setup.props.ui?.progress })
			}), null, 16, [
				"model-value",
				"color",
				"class"
			])) : createCommentVNode("", true)
		]),
		_: 3
	}, 16, [
		"data-orientation",
		"class",
		"style"
	]);
}
var Toast_default = /*@__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["render", _sfc_render], ["__file", "Toast.vue"]]);
export { Toast_default as default };

//# sourceMappingURL=Toast.js.map