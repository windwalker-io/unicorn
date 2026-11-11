import { a as useComponentProps, i as tv, o as Primitive, r as Icon_default, t as Avatar_default } from "./Avatar.js";
import { d as useLocale, f as VisuallyHidden_default, l as useFormField, t as Button_default } from "./Button.js";
import { c as useFileDialog, o as useDropZone, t as createReusableTemplate } from "./dist.js";
import { i as useAppConfig } from "./iconify.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper.js";
import { Fragment, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, createVNode, effectScope, mergeModels, mergeProps, normalizeClass, onMounted, openBlock, reactive, ref, renderList, renderSlot, resolveDynamicComponent, toDisplayString, toRef, toRefs, unref, useModel, useSlots, watch, withCtx, withKeys, withModifiers } from "vue";
// ../../../../node_modules/@nuxt/ui/dist/runtime/composables/useFileUpload.js
function isFileAccepted(file, accept) {
	const types = accept.split(",").map((type) => type.trim().toLowerCase()).filter(Boolean);
	if (!types.length) return true;
	const name = file.name.toLowerCase();
	const mime = file.type.toLowerCase();
	return types.some((type) => {
		if (type === "*" || type === "*/*") return true;
		if (type.startsWith(".")) return name.endsWith(type);
		if (type.endsWith("/*")) return mime.startsWith(type.slice(0, -1));
		return mime === type;
	});
}
function useFileUpload(options) {
	const { accept = "*", reset = false, multiple = false, dropzone = true, onUpdate, onReject } = options;
	const inputRef = ref();
	const dropzoneRef = ref();
	const onDrop = (files, fromDropZone = false) => {
		if (!files || files.length === 0) return;
		if (files instanceof FileList) files = Array.from(files);
		if (fromDropZone) {
			const rejected = [];
			files = files.filter((file) => {
				if (isFileAccepted(file, unref(accept))) return true;
				rejected.push(file);
				return false;
			});
			if (rejected.length) onReject?.(rejected);
			if (!files.length) return;
		}
		if (files.length > 1 && !unref(multiple)) files = [files[0]];
		if (fromDropZone && inputRef.value?.$el) try {
			const dt = new DataTransfer();
			files.forEach((file) => dt.items.add(file));
			inputRef.value.$el.files = dt.files;
		} catch (e) {
			console.warn("Could not sync files to input element:", e);
		}
		onUpdate(files);
	};
	const isDragging = ref(false);
	const fileDialog = reactive({ open: () => {} });
	function open() {
		fileDialog.open();
	}
	onMounted(() => {
		watch(() => unref(dropzone), (enabled, _, onCleanup) => {
			if (!enabled) return;
			const scope = effectScope();
			scope.run(() => {
				const { isOverDropZone } = useDropZone(dropzoneRef, { onDrop: (files) => onDrop(files, true) });
				watch(isOverDropZone, (value) => {
					isDragging.value = value;
				});
			});
			onCleanup(() => {
				scope.stop();
				isDragging.value = false;
			});
		}, { immediate: true });
		const { onChange, open: open2 } = useFileDialog({
			accept,
			multiple,
			input: computed(() => unref(inputRef)?.$el),
			reset
		});
		fileDialog.open = open2;
		onChange((fileList) => onDrop(fileList, false));
	});
	return {
		isDragging,
		open,
		inputRef,
		dropzoneRef
	};
}
// virtual:nuxt-ui-templates/ui/file-upload.ts
var file_upload_default = {
	"slots": {
		"root": "relative flex flex-col",
		"base": ["w-full flex-1 bg-default border border-default flex flex-col gap-2 items-stretch justify-center rounded-lg focus-visible:outline-3", "transition-[background] ease-out"],
		"wrapper": "flex flex-col items-center justify-center text-center",
		"icon": "shrink-0",
		"avatar": "shrink-0",
		"label": "font-medium text-default mt-2",
		"description": "text-muted mt-1",
		"actions": "flex flex-wrap gap-1.5 shrink-0 mt-4",
		"files": "",
		"file": "relative",
		"fileLeadingAvatar": "shrink-0",
		"fileWrapper": "flex flex-col min-w-0",
		"fileName": "text-default truncate",
		"fileSize": "text-muted truncate",
		"fileTrailingButton": ""
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
		"variant": {
			"area": {
				"wrapper": "px-4 py-3",
				"base": "p-4"
			},
			"button": {}
		},
		"size": {
			"xs": {
				"base": "text-xs",
				"icon": "size-4",
				"file": "text-xs px-2 py-1 gap-1",
				"fileWrapper": "flex-row gap-1"
			},
			"sm": {
				"base": "text-xs",
				"icon": "size-4",
				"file": "text-xs px-2.5 py-1.5 gap-1.5",
				"fileWrapper": "flex-row gap-1"
			},
			"md": {
				"base": "text-sm",
				"icon": "size-5",
				"file": "text-xs px-2.5 py-1.5 gap-1.5"
			},
			"lg": {
				"base": "text-sm",
				"icon": "size-5",
				"file": "text-sm px-3 py-2 gap-2",
				"fileSize": "text-xs"
			},
			"xl": {
				"base": "text-base",
				"icon": "size-6",
				"file": "text-sm px-3 py-2 gap-2"
			}
		},
		"layout": {
			"list": {
				"root": "gap-2 items-start",
				"files": "flex flex-col w-full gap-2",
				"file": "min-w-0 flex items-center border border-default rounded-md w-full",
				"fileTrailingButton": "ms-auto"
			},
			"grid": {
				"fileWrapper": "hidden",
				"fileLeadingAvatar": "size-full rounded-lg",
				"fileTrailingButton": "absolute -top-1.5 -end-1.5 p-0 rounded-full border-2 border-bg"
			}
		},
		"position": {
			"inside": "",
			"outside": ""
		},
		"dropzone": { "true": "border-dashed data-[dragging=true]:bg-elevated/25" },
		"interactive": { "true": "" },
		"highlight": { "true": "" },
		"multiple": { "true": "" },
		"disabled": { "true": "cursor-not-allowed opacity-75" }
	},
	"compoundVariants": [
		{
			"color": "primary",
			"class": "outline-primary/25 focus-visible:outline-3 focus-visible:border-primary"
		},
		{
			"color": "secondary",
			"class": "outline-secondary/25 focus-visible:outline-3 focus-visible:border-secondary"
		},
		{
			"color": "success",
			"class": "outline-success/25 focus-visible:outline-3 focus-visible:border-success"
		},
		{
			"color": "info",
			"class": "outline-info/25 focus-visible:outline-3 focus-visible:border-info"
		},
		{
			"color": "warning",
			"class": "outline-warning/25 focus-visible:outline-3 focus-visible:border-warning"
		},
		{
			"color": "error",
			"class": "outline-error/25 focus-visible:outline-3 focus-visible:border-error"
		},
		{
			"color": "primary",
			"highlight": true,
			"class": "border-primary"
		},
		{
			"color": "secondary",
			"highlight": true,
			"class": "border-secondary"
		},
		{
			"color": "success",
			"highlight": true,
			"class": "border-success"
		},
		{
			"color": "info",
			"highlight": true,
			"class": "border-info"
		},
		{
			"color": "warning",
			"highlight": true,
			"class": "border-warning"
		},
		{
			"color": "error",
			"highlight": true,
			"class": "border-error"
		},
		{
			"color": "neutral",
			"class": "outline-inverted/25 focus-visible:outline-3 focus-visible:border-inverted"
		},
		{
			"color": "neutral",
			"highlight": true,
			"class": "border-inverted"
		},
		{
			"size": "xs",
			"layout": "list",
			"class": { "fileTrailingButton": "-me-1" }
		},
		{
			"size": "sm",
			"layout": "list",
			"class": { "fileTrailingButton": "-me-1.5" }
		},
		{
			"size": "md",
			"layout": "list",
			"class": { "fileTrailingButton": "-me-1.5" }
		},
		{
			"size": "lg",
			"layout": "list",
			"class": { "fileTrailingButton": "-me-2" }
		},
		{
			"size": "xl",
			"layout": "list",
			"class": { "fileTrailingButton": "-me-2" }
		},
		{
			"variant": "button",
			"size": "xs",
			"class": { "base": "p-1" }
		},
		{
			"variant": "button",
			"size": "sm",
			"class": { "base": "p-1.5" }
		},
		{
			"variant": "button",
			"size": "md",
			"class": { "base": "p-1.5" }
		},
		{
			"variant": "button",
			"size": "lg",
			"class": { "base": "p-2" }
		},
		{
			"variant": "button",
			"size": "xl",
			"class": { "base": "p-2" }
		},
		{
			"layout": "grid",
			"multiple": true,
			"class": {
				"files": "grid grid-cols-2 md:grid-cols-3 gap-4 w-full",
				"file": "p-0 aspect-square"
			}
		},
		{
			"layout": "grid",
			"multiple": false,
			"class": { "file": "absolute inset-0 p-0" }
		},
		{
			"interactive": true,
			"disabled": false,
			"class": "hover:bg-elevated/25"
		}
	],
	"defaultVariants": {
		"color": "primary",
		"variant": "area",
		"size": "md"
	}
};
// ../../../../node_modules/@nuxt/ui/dist/runtime/components/FileUpload.vue
var _sfc_main = /*@__PURE__*/ Object.assign({ inheritAttrs: false }, {
	__name: "FileUpload",
	props: /*@__PURE__*/ mergeModels({
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
		icon: {
			type: [String, Boolean],
			required: false,
			skipCheck: true
		},
		label: {
			type: String,
			required: false
		},
		description: {
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
		layout: {
			type: null,
			required: false,
			default: "grid"
		},
		position: {
			type: null,
			required: false,
			default: "outside"
		},
		highlight: {
			type: Boolean,
			required: false
		},
		accept: {
			type: String,
			required: false,
			default: "*"
		},
		modelValue: {
			type: null,
			required: false
		},
		multiple: {
			type: Boolean,
			required: false,
			default: false
		},
		reset: {
			type: Boolean,
			required: false,
			default: false
		},
		dropzone: {
			type: Boolean,
			required: false,
			default: true
		},
		interactive: {
			type: Boolean,
			required: false,
			default: true
		},
		required: {
			type: Boolean,
			required: false
		},
		disabled: {
			type: Boolean,
			required: false
		},
		fileIcon: {
			type: null,
			required: false
		},
		fileImage: {
			type: Boolean,
			required: false,
			default: true
		},
		fileDelete: {
			type: [Boolean, Object],
			required: false,
			default: true
		},
		fileDeleteIcon: {
			type: null,
			required: false
		},
		preview: {
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
		}
	}, {
		"modelValue": { type: null },
		"modelModifiers": {}
	}),
	emits: /*@__PURE__*/ mergeModels(["change", "reject"], ["update:modelValue"]),
	setup(__props, { expose: __expose, emit: __emit }) {
		const _props = __props;
		const emits = __emit;
		const slots = useSlots();
		const modelValue = useModel(__props, "modelValue");
		const props = useComponentProps("fileUpload", _props);
		const appConfig = useAppConfig();
		const { t } = useLocale();
		const [DefineFilesTemplate, ReuseFilesTemplate] = createReusableTemplate();
		const { accept, multiple, reset } = toRefs(_props);
		const { isDragging, open, inputRef, dropzoneRef } = useFileUpload({
			accept,
			reset,
			multiple,
			dropzone: toRef(() => props.dropzone),
			onUpdate,
			onReject
		});
		const { emitFormInput, emitFormChange, id, name, size: formFieldSize, color: formFieldColor, highlight: formFieldHighlight, disabled: formFieldDisabled, ariaAttrs } = useFormField(_props);
		const color = computed(() => formFieldColor.value ?? props.color);
		const highlight = computed(() => formFieldHighlight.value ?? props.highlight);
		const size = computed(() => formFieldSize.value ?? props.size);
		const disabled = computed(() => formFieldDisabled.value ?? props.disabled);
		const variant = computed(() => props.multiple ? "area" : props.variant);
		const layout = computed(() => props.variant === "button" && !props.multiple ? "grid" : props.layout);
		const position = computed(() => {
			if (layout.value === "grid" && props.multiple) return "inside";
			if (variant.value === "button") return "outside";
			return props.position;
		});
		const ui = computed(() => tv({
			extend: file_upload_default,
			...appConfig.ui?.fileUpload || {}
		})({
			dropzone: props.dropzone,
			interactive: props.interactive,
			color: color.value,
			size: size.value,
			variant: variant.value,
			layout: layout.value,
			position: position.value,
			multiple: props.multiple,
			highlight: highlight.value,
			disabled: disabled.value
		}));
		function getFileAvatar(file) {
			return props.fileImage ? file.avatar : void 0;
		}
		function getFilePreview(file) {
			if (!props.fileImage) return void 0;
			if (file.avatar?.src) return file.avatar.src;
			if (!(file instanceof File)) return void 0;
			return URL.createObjectURL(file);
		}
		function formatFileSize(bytes) {
			if (bytes === void 0) return void 0;
			if (bytes === 0) return "0B";
			const k = 1024;
			const sizes = [
				"B",
				"KB",
				"MB",
				"GB"
			];
			const i = Math.floor(Math.log(bytes) / Math.log(k));
			const value = bytes / Math.pow(k, i);
			return `${i === 0 ? value.toString() : value.toFixed(0)}${sizes[i]}`;
		}
		function setModelValue(value) {
			modelValue.value = value;
		}
		function onUpdate(files, reset2 = false) {
			if (disabled.value) return;
			if (props.multiple) setModelValue([...reset2 ? [] : modelValue.value || [], ...files]);
			else setModelValue(files[0] ?? null);
			const event = new Event("change", { target: { value: modelValue.value } });
			emits("change", event);
			emitFormChange();
			emitFormInput();
		}
		function onReject(files) {
			if (disabled.value) return;
			emits("reject", files);
		}
		function removeFile(index) {
			if (!modelValue.value) return;
			if (!props.multiple || index === void 0) {
				onUpdate([], true);
				dropzoneRef.value?.focus();
				return;
			}
			const files = [...modelValue.value];
			files.splice(index, 1);
			onUpdate(files, true);
			dropzoneRef.value?.focus();
		}
		watch(modelValue, (newValue) => {
			if ((props.multiple ? !newValue?.length : !newValue) && inputRef.value?.$el) inputRef.value.$el.value = "";
		});
		__expose({
			inputRef: toRef(() => inputRef.value?.$el),
			dropzoneRef
		});
		const __returned__ = {
			_props,
			emits,
			slots,
			modelValue,
			props,
			appConfig,
			t,
			DefineFilesTemplate,
			ReuseFilesTemplate,
			accept,
			multiple,
			reset,
			isDragging,
			open,
			inputRef,
			dropzoneRef,
			emitFormInput,
			emitFormChange,
			id,
			name,
			formFieldSize,
			formFieldColor,
			formFieldHighlight,
			formFieldDisabled,
			ariaAttrs,
			color,
			highlight,
			size,
			disabled,
			variant,
			layout,
			position,
			ui,
			getFileAvatar,
			getFilePreview,
			formatFileSize,
			setModelValue,
			onUpdate,
			onReject,
			removeFile,
			get theme() {
				return file_upload_default;
			},
			computed,
			toRef,
			toRefs,
			watch,
			get Primitive() {
				return Primitive;
			},
			get VisuallyHidden() {
				return VisuallyHidden_default;
			},
			get createReusableTemplate() {
				return createReusableTemplate;
			},
			get useAppConfig() {
				return useAppConfig;
			},
			get useLocale() {
				return useLocale;
			},
			get useComponentProps() {
				return useComponentProps;
			},
			get useFormField() {
				return useFormField;
			},
			get useFileUpload() {
				return useFileUpload;
			},
			get tv() {
				return tv;
			},
			UAvatar: Avatar_default,
			UButton: Button_default,
			UIcon: Icon_default
		};
		Object.defineProperty(__returned__, "__isScriptSetup", {
			enumerable: false,
			value: true
		});
		return __returned__;
	}
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
	return openBlock(), createElementBlock(Fragment, null, [createVNode($setup["DefineFilesTemplate"], null, {
		default: withCtx(() => [$setup.props.preview && $setup.modelValue && (Array.isArray($setup.modelValue) ? $setup.modelValue.length : true) ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
			renderSlot(_ctx.$slots, "files-top", {
				files: $setup.modelValue,
				open: $setup.open,
				removeFile: $setup.removeFile
			}),
			createElementVNode("div", {
				"data-slot": "files",
				class: normalizeClass($setup.ui.files({ class: $setup.props.ui?.files }))
			}, [renderSlot(_ctx.$slots, "files", {
				files: $setup.modelValue,
				removeFile: $setup.removeFile
			}, () => [(openBlock(true), createElementBlock(Fragment, null, renderList(Array.isArray($setup.modelValue) ? $setup.modelValue : [$setup.modelValue], (file, index) => {
				return openBlock(), createElementBlock("div", {
					key: file.name,
					"data-slot": "file",
					class: normalizeClass($setup.ui.file({ class: $setup.props.ui?.file }))
				}, [renderSlot(_ctx.$slots, "file", {
					file,
					index,
					removeFile: $setup.removeFile
				}, () => [
					renderSlot(_ctx.$slots, "file-leading", {
						file,
						index,
						ui: $setup.ui
					}, () => [createVNode($setup["UAvatar"], mergeProps({
						as: { img: "img" },
						alt: file.name,
						icon: $setup.props.fileIcon || $setup.appConfig.ui.icons.file,
						size: $setup.size
					}, { ref_for: true }, $setup.getFileAvatar(file), {
						src: $setup.getFilePreview(file),
						"data-slot": "fileLeadingAvatar",
						class: $setup.ui.fileLeadingAvatar({ class: $setup.props.ui?.fileLeadingAvatar })
					}), null, 16, [
						"alt",
						"icon",
						"size",
						"src",
						"class"
					])]),
					createElementVNode("div", {
						"data-slot": "fileWrapper",
						class: normalizeClass($setup.ui.fileWrapper({ class: $setup.props.ui?.fileWrapper }))
					}, [createElementVNode("span", {
						"data-slot": "fileName",
						class: normalizeClass($setup.ui.fileName({ class: $setup.props.ui?.fileName }))
					}, [renderSlot(_ctx.$slots, "file-name", {
						file,
						index
					}, () => [createTextVNode(toDisplayString(file.name), 1)])], 2), createElementVNode("span", {
						"data-slot": "fileSize",
						class: normalizeClass($setup.ui.fileSize({ class: $setup.props.ui?.fileSize }))
					}, [renderSlot(_ctx.$slots, "file-size", {
						file,
						index
					}, () => [createTextVNode(toDisplayString($setup.formatFileSize(file.size)), 1)])], 2)], 2),
					renderSlot(_ctx.$slots, "file-trailing", {
						file,
						index,
						ui: $setup.ui,
						removeFile: $setup.removeFile
					}, () => [$setup.props.fileDelete ? (openBlock(), createBlock($setup["UButton"], mergeProps({
						key: 0,
						color: "neutral"
					}, { ref_for: true }, {
						...$setup.layout === "grid" ? {
							variant: "solid",
							size: "xs"
						} : {
							variant: "link",
							size: $setup.size
						},
						...typeof $setup.props.fileDelete === "object" ? $setup.props.fileDelete : void 0
					}, {
						"aria-label": $setup.t("fileUpload.removeFile", { filename: file.name }),
						"trailing-icon": $setup.props.fileDeleteIcon || $setup.appConfig.ui.icons.close,
						"data-slot": "fileTrailingButton",
						class: $setup.ui.fileTrailingButton({ class: $setup.props.ui?.fileTrailingButton }),
						onClick: withModifiers(($event) => $setup.removeFile(index), ["stop", "prevent"])
					}), null, 16, [
						"aria-label",
						"trailing-icon",
						"class",
						"onClick"
					])) : createCommentVNode("", true)])
				])], 2);
			}), 128))])], 2),
			renderSlot(_ctx.$slots, "files-bottom", {
				files: $setup.modelValue,
				open: $setup.open,
				removeFile: $setup.removeFile
			})
		], 64)) : createCommentVNode("", true)]),
		_: 3
	}), createVNode($setup["Primitive"], {
		as: $setup.props.as,
		"data-slot": _ctx.$attrs["data-slot"] ?? "root",
		class: normalizeClass($setup.ui.root({ class: [$setup.props.ui?.root, $setup.props.class] }))
	}, {
		default: withCtx(() => [renderSlot(_ctx.$slots, "default", {
			open: $setup.open,
			removeFile: $setup.removeFile,
			ui: $setup.ui
		}, () => [(openBlock(), createBlock(resolveDynamicComponent($setup.variant === "button" ? "button" : "div"), {
			ref: "dropzoneRef",
			type: $setup.variant === "button" ? "button" : void 0,
			role: $setup.variant === "button" ? void 0 : "button",
			disabled: $setup.variant === "button" ? $setup.disabled : void 0,
			"aria-disabled": $setup.variant === "button" ? void 0 : $setup.disabled || void 0,
			"data-dragging": $setup.isDragging,
			"data-slot": "base",
			class: normalizeClass($setup.ui.base({ class: $setup.props.ui?.base })),
			tabindex: $setup.props.interactive && !$setup.disabled ? 0 : -1,
			onClick: _cache[0] || (_cache[0] = ($event) => $setup.props.interactive && !$setup.disabled && $setup.open()),
			onKeydown: _cache[1] || (_cache[1] = withKeys(withModifiers(() => {}, ["prevent"]), ["space"])),
			onKeyup: _cache[2] || (_cache[2] = withKeys(($event) => $setup.props.interactive && !$setup.disabled && $setup.open(), ["enter", "space"]))
		}, {
			default: withCtx(() => [$setup.position === "inside" ? (openBlock(), createBlock($setup["ReuseFilesTemplate"], { key: 0 })) : createCommentVNode("", true), ($setup.position === "inside" ? !$setup.props.preview || ($setup.multiple ? !$setup.modelValue?.length : !$setup.modelValue) : true) ? (openBlock(), createElementBlock("div", {
				key: 1,
				"data-slot": "wrapper",
				class: normalizeClass($setup.ui.wrapper({ class: $setup.props.ui?.wrapper }))
			}, [renderSlot(_ctx.$slots, "leading", { ui: $setup.ui }, () => [$setup.props.icon !== false ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [$setup.variant === "button" ? (openBlock(), createBlock($setup["UIcon"], {
				key: 0,
				name: $setup.props.icon ?? $setup.appConfig.ui.icons.upload,
				"data-slot": "icon",
				class: normalizeClass($setup.ui.icon({ class: $setup.props.ui?.icon }))
			}, null, 8, ["name", "class"])) : (openBlock(), createBlock($setup["UAvatar"], {
				key: 1,
				icon: $setup.props.icon ?? $setup.appConfig.ui.icons.upload,
				size: $setup.size,
				"data-slot": "avatar",
				class: normalizeClass($setup.ui.avatar({ class: $setup.props.ui?.avatar }))
			}, null, 8, [
				"icon",
				"size",
				"class"
			]))], 64)) : createCommentVNode("", true)]), $setup.variant !== "button" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
				$setup.props.label || !!$setup.slots.label ? (openBlock(), createElementBlock("div", {
					key: 0,
					"data-slot": "label",
					class: normalizeClass($setup.ui.label({ class: $setup.props.ui?.label }))
				}, [renderSlot(_ctx.$slots, "label", {}, () => [createTextVNode(toDisplayString($setup.props.label), 1)])], 2)) : createCommentVNode("", true),
				$setup.props.description || !!$setup.slots.description ? (openBlock(), createElementBlock("div", {
					key: 1,
					"data-slot": "description",
					class: normalizeClass($setup.ui.description({ class: $setup.props.ui?.description }))
				}, [renderSlot(_ctx.$slots, "description", {}, () => [createTextVNode(toDisplayString($setup.props.description), 1)])], 2)) : createCommentVNode("", true),
				!!$setup.slots.actions ? (openBlock(), createElementBlock("div", {
					key: 2,
					"data-slot": "actions",
					class: normalizeClass($setup.ui.actions({ class: $setup.props.ui?.actions }))
				}, [renderSlot(_ctx.$slots, "actions", {
					files: $setup.modelValue,
					open: $setup.open,
					removeFile: $setup.removeFile
				})], 2)) : createCommentVNode("", true)
			], 64)) : createCommentVNode("", true)], 2)) : createCommentVNode("", true)]),
			_: 3
		}, 40, [
			"type",
			"role",
			"disabled",
			"aria-disabled",
			"data-dragging",
			"class",
			"tabindex"
		])), $setup.position === "outside" ? (openBlock(), createBlock($setup["ReuseFilesTemplate"], { key: 0 })) : createCommentVNode("", true)]), createVNode($setup["VisuallyHidden"], mergeProps({
			id: $setup.id,
			ref: "inputRef",
			as: "input",
			type: "file",
			feature: "fully-hidden",
			name: $setup.name,
			accept: $setup.accept,
			multiple: $setup.multiple,
			required: $setup.props.required,
			disabled: $setup.disabled
		}, {
			..._ctx.$attrs,
			...$setup.ariaAttrs,
			"data-slot": void 0
		}), null, 16, [
			"id",
			"name",
			"accept",
			"multiple",
			"required",
			"disabled"
		])]),
		_: 3
	}, 8, [
		"as",
		"data-slot",
		"class"
	])], 64);
}
var FileUpload_default = /*@__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["render", _sfc_render], ["__file", "FileUpload.vue"]]);
export { FileUpload_default as default };

//# sourceMappingURL=FileUpload.js.map