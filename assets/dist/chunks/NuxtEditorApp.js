import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper.js";
import { i as toBackground, n as createColorMenu, r as resolveColors } from "./nuxt-editor.js";
import { Fragment, createBlock, createCommentVNode, createElementBlock, createElementVNode, createVNode, defineComponent, mergeProps, normalizeClass, normalizeStyle, onBeforeUnmount, onMounted, openBlock, ref, withCtx, withModifiers } from "vue";
import UApp from "@nuxt/ui/components/App.vue";
import UEditor from "@nuxt/ui/components/Editor.vue";
import UButton from "@nuxt/ui/components/Button.vue";
import UDropdownMenu from "@nuxt/ui/components/DropdownMenu.vue";
import UEditorDragHandle from "@nuxt/ui/components/EditorDragHandle.vue";
import UEditorToolbar from "@nuxt/ui/components/EditorToolbar.vue";
import UEditorSuggestionMenu from "@nuxt/ui/components/EditorSuggestionMenu.vue";
import UTooltip from "@nuxt/ui/components/Tooltip.vue";
import UInput from "@nuxt/ui/components/Input.vue";
import USeparator from "@nuxt/ui/components/Separator.vue";
import UPopover from "@nuxt/ui/components/Popover.vue";
import UIcon from "@nuxt/ui/components/Icon.vue";
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
			UButton,
			UDropdownMenu,
			UEditorDragHandle
		};
		Object.defineProperty(__returned__, "__isScriptSetup", {
			enumerable: false,
			value: true
		});
		return __returned__;
	}
});
// src/vue/components/NuxtEditor/EditorDragHandle.vue
function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
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
var EditorDragHandle_default = /*@__PURE__*/ _plugin_vue_export_helper_default(EditorDragHandle_vue_vue_type_script_setup_true_lang_default, [["render", _sfc_render$6], ["__file", "EditorDragHandle.vue"]]);
// src/composable/nuxt-editor/useBubbleVisibility.ts
function useBubbleVisibility() {
	const text = ({ editor, view, state }) => view.hasFocus() && !state.selection.empty && !editor.isActive("image") && !editor.isActive("imageUpload") && !editor.isActive("codeBlock");
	const link = ({ editor, view, state }) => (view.hasFocus() || !!view.dom.getRootNode().activeElement?.closest("[data-link-bar]")) && state.selection.empty && editor.isActive("link");
	const image = ({ editor, view }) => editor.isActive("image") && view.hasFocus();
	return {
		text,
		link,
		image
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
			UButton,
			UDropdownMenu,
			UTooltip
		};
		Object.defineProperty(__returned__, "__isScriptSetup", {
			enumerable: false,
			value: true
		});
		return __returned__;
	}
});
// src/vue/components/NuxtEditor/ColorsDropdown.vue
function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
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
var ColorsDropdown_default = /*@__PURE__*/ _plugin_vue_export_helper_default(ColorsDropdown_vue_vue_type_script_setup_true_lang_default, [["render", _sfc_render$5], ["__file", "ColorsDropdown.vue"]]);
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
			open,
			onFocusIn,
			onKeydown,
			UButton,
			UInput,
			USeparator
		};
		Object.defineProperty(__returned__, "__isScriptSetup", {
			enumerable: false,
			value: true
		});
		return __returned__;
	}
});
// src/vue/components/NuxtEditor/LinkBar.vue
var _hoisted_1$2 = { class: "flex items-center mr-0.5" };
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
	return openBlock(), createBlock($setup["UInput"], {
		modelValue: $setup.url,
		"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.url = $event),
		"data-link-bar": "",
		type: "url",
		variant: "none",
		placeholder: "Paste a link...",
		class: "min-w-72",
		onFocusin: $setup.onFocusIn,
		onKeydown: $setup.onKeydown
	}, {
		default: withCtx(() => [createElementVNode("div", _hoisted_1$2, [
			createVNode($setup["UButton"], {
				icon: "i-lucide-corner-down-left",
				title: "Apply link",
				color: "neutral",
				variant: "ghost",
				size: "sm",
				onClick: $setup.apply
			}),
			createVNode($setup["USeparator"], {
				orientation: "vertical",
				class: "h-6 mx-1"
			}),
			createVNode($setup["UButton"], {
				icon: "i-lucide-external-link",
				title: "Open in new window",
				color: "neutral",
				variant: "ghost",
				size: "sm",
				onClick: $setup.open
			}),
			createVNode($setup["UButton"], {
				icon: "i-lucide-trash",
				title: "Remove link",
				color: "neutral",
				variant: "ghost",
				size: "sm",
				onClick: $setup.remove
			})
		])]),
		_: 1
	}, 8, ["modelValue"]);
}
var LinkBar_default = /*@__PURE__*/ _plugin_vue_export_helper_default(LinkBar_vue_vue_type_script_setup_true_lang_default, [["render", _sfc_render$4], ["__file", "LinkBar.vue"]]);
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
			UButton,
			UInput,
			UPopover,
			USeparator,
			UTooltip
		};
		Object.defineProperty(__returned__, "__isScriptSetup", {
			enumerable: false,
			value: true
		});
		return __returned__;
	}
});
// src/vue/components/NuxtEditor/LinkPopover.vue
var _hoisted_1$1 = { class: "flex items-center mr-0.5" };
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
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
			placeholder: "Paste a link...",
			onFocusin: $setup.onFocusIn,
			onKeydown: $setup.onKeydown
		}, {
			default: withCtx(() => [createElementVNode("div", _hoisted_1$1, [
				createVNode($setup["UButton"], {
					icon: "i-lucide-corner-down-left",
					title: "Apply link",
					color: "neutral",
					variant: "ghost",
					size: "sm",
					disabled: !$setup.url && !$props.editor.isActive("link"),
					onClick: $setup.setLink
				}, null, 8, ["disabled"]),
				createVNode($setup["USeparator"], {
					orientation: "vertical",
					class: "h-6 mx-1"
				}),
				createVNode($setup["UButton"], {
					icon: "i-lucide-external-link",
					title: "Open in new window",
					color: "neutral",
					variant: "ghost",
					size: "sm",
					disabled: !$setup.url && !$props.editor.isActive("link"),
					onClick: $setup.openLink
				}, null, 8, ["disabled"]),
				createVNode($setup["UButton"], {
					icon: "i-lucide-trash",
					title: "Remove link",
					color: "neutral",
					variant: "ghost",
					size: "sm",
					disabled: !$setup.url && !$props.editor.isActive("link"),
					onClick: $setup.removeLink
				}, null, 8, ["disabled"])
			])]),
			_: 1
		}, 8, ["modelValue"])]),
		default: withCtx(() => [createVNode($setup["UTooltip"], { text: "Link" }, {
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
		})]),
		_: 1
	}, 8, ["open"]);
}
var LinkPopover_default = /*@__PURE__*/ _plugin_vue_export_helper_default(LinkPopover_vue_vue_type_script_setup_true_lang_default, [["render", _sfc_render$3], ["__file", "LinkPopover.vue"]]);
// src/vue/components/NuxtEditor/EditorToolbars.vue?vue&type=script&setup=true&lang.ts
var EditorToolbars_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "EditorToolbars",
	props: {
		editor: {},
		fixedItems: {},
		textItems: {},
		imageItems: {},
		slashItems: {}
	},
	setup(__props, { expose: __expose }) {
		__expose();
		const props = __props;
		const shouldShow = useBubbleVisibility();
		const linkBarItems = [[{ slot: "linkbar" }]];
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
			menuTick,
			colorMenu,
			UEditorToolbar,
			UEditorSuggestionMenu,
			ColorsDropdown: ColorsDropdown_default,
			LinkBar: LinkBar_default,
			LinkPopover: LinkPopover_default
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
			key: 3,
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
			UIcon,
			UDropdownMenu
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
			UApp,
			UEditor,
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
			placeholder: "Write, type '/' for commands...",
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
					"image-items": $props.items.image(editor),
					"slash-items": $props.items.slash(editor)
				}, null, 8, [
					"editor",
					"fixed-items",
					"text-items",
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
			"editable"
		])]),
		_: 1
	}, 8, ["locale", "portal"]);
}
var NuxtEditorApp_default = /*@__PURE__*/ _plugin_vue_export_helper_default(NuxtEditorApp_vue_vue_type_script_setup_true_lang_default, [["render", _sfc_render], ["__file", "NuxtEditorApp.vue"]]);
export { NuxtEditorApp_default as default };

//# sourceMappingURL=NuxtEditorApp.js.map