import { useHttpClient, useStack } from "../unicorn.js";
import { d as selectOne } from "./dom.js";
import { t as mergeDeep } from "./arr.js";
import { createApp, defineComponent, h, onBeforeUnmount, ref, shallowRef, watch } from "vue";
import css from "@windwalker-io/unicorn-next/src/css/nuxt-editor.css?inline";
// src/module/nuxt-editor.ts
var instances = /*@__PURE__*/ new WeakMap();
var globalToolbars = {};
function configure(options) {
	Object.assign(globalToolbars, options.toolbars);
}
async function get(selector, options = {}) {
	const element = selectOne(selector);
	if (!element) throw new Error(`Nuxt editor element: ${selector} not found.`);
	return instances.get(element) ?? create(element, options);
}
async function create(selector, options = {}) {
	const element = selectOne(selector);
	if (!element) throw new Error(`Nuxt editor element: ${selector} not found.`);
	instances.get(element)?.destroy();
	const controller = await mount(element, options);
	instances.set(element, controller);
	return controller;
}
function destroy(selector) {
	const element = selectOne(selector);
	if (element) {
		instances.get(element)?.destroy();
		instances.delete(element);
	}
}
async function mount(element, options) {
	const [{ default: UApp }, { default: UEditor }, { default: UEditorToolbar }, { default: UEditorDragHandle }, { default: UEditorSuggestionMenu }, { default: UDropdownMenu }, { default: UButton }, { default: UFileUpload }, { default: UAvatar }, { default: UPopover }, { default: UTooltip }, { default: UInput }, { default: USeparator }, { Node, mergeAttributes }, { TextAlign }, { default: TiptapImage }, { VueNodeViewRenderer, NodeViewWrapper, nodeViewProps }, { mapEditorItems }, { default: ui }, locales] = await Promise.all([
		import("@nuxt/ui/components/App.vue"),
		import("@nuxt/ui/components/Editor.vue"),
		import("@nuxt/ui/components/EditorToolbar.vue"),
		import("@nuxt/ui/components/EditorDragHandle.vue"),
		import("@nuxt/ui/components/EditorSuggestionMenu.vue"),
		import("@nuxt/ui/components/DropdownMenu.vue"),
		import("@nuxt/ui/components/Button.vue"),
		import("@nuxt/ui/components/FileUpload.vue"),
		import("@nuxt/ui/components/Avatar.vue"),
		import("@nuxt/ui/components/Popover.vue"),
		import("@nuxt/ui/components/Tooltip.vue"),
		import("@nuxt/ui/components/Input.vue"),
		import("@nuxt/ui/components/Separator.vue"),
		import("@tiptap/core"),
		import("@tiptap/extension-text-align"),
		import("@tiptap/extension-image"),
		import("@tiptap/vue-3"),
		import("@nuxt/ui/utils/editor"),
		import("@nuxt/ui/vue-plugin"),
		import("@nuxt/ui/locale")
	]);
	const opts = mergeDeep({
		format: "html",
		props: {},
		unicorn: {}
	}, options);
	const format = opts.format;
	const host = document.createElement("div");
	host.className = "c-nuxt-editor";
	const shadow = host.attachShadow({ mode: "open" });
	const sheet = new CSSStyleSheet();
	sheet.replaceSync(css);
	shadow.adoptedStyleSheets = [sheet];
	const properties = Array.from(sheet.cssRules).flatMap((r) => collectProperties(r)).join("\n");
	if (properties && !document.getElementById("nuxt-editor-properties")) {
		const style = document.createElement("style");
		style.id = "nuxt-editor-properties";
		style.textContent = properties;
		document.head.appendChild(style);
	}
	const portal = document.createElement("div");
	const root = document.createElement("div");
	root.className = "nuxt-ui-root";
	shadow.append(root, portal);
	element.style.display = "none";
	element.after(host);
	const content = ref(parseValue(element.value, format));
	const editor = shallowRef(null);
	const editable = ref(!(opts.readonly || element.readOnly || element.disabled));
	const toolbars = {
		...globalToolbars,
		...options.toolbars
	};
	const resolveItems = (key, defaults, ed) => {
		const override = toolbars[key];
		if (override === false) return [];
		if (Array.isArray(override)) return override;
		if (typeof override === "function") return override(defaults, {
			editor: ed,
			options: opts
		}) ?? defaults;
		return defaults;
	};
	const syncing = { value: false };
	function serialize(value) {
		return format === "json" ? JSON.stringify(value) : value ?? "";
	}
	function onUpdate() {
		syncing.value = true;
		element.value = serialize(content.value);
		element.dispatchEvent(new Event("input", { bubbles: true }));
		element.dispatchEvent(new Event("change", { bubbles: true }));
		syncing.value = false;
	}
	async function uploadImage(file) {
		const url = opts.imageUploadUrl;
		if (!url) throw new Error("imageUploadUrl is not configured.");
		element.dispatchEvent(new CustomEvent("upload-start"));
		const formData = new FormData();
		formData.append("file", file, file.name);
		const stack = useStack(opts.unicorn?.stack_name);
		stack.push(true);
		const { post } = await useHttpClient();
		try {
			const res = await post(url, formData, { withCredentials: false });
			element.dispatchEvent(new CustomEvent("upload-success"));
			return res.data.data.url;
		} catch (e) {
			element.dispatchEvent(new CustomEvent("upload-error", { detail: e }));
			console.error(e);
			throw e;
		} finally {
			element.dispatchEvent(new CustomEvent("upload-complete"));
			stack.pop();
		}
	}
	const headingLevels = [
		1,
		2,
		3,
		4
	];
	const marksGroup = [
		{
			kind: "mark",
			mark: "bold",
			icon: "i-lucide-bold",
			tooltip: { text: "Bold" }
		},
		{
			kind: "mark",
			mark: "italic",
			icon: "i-lucide-italic",
			tooltip: { text: "Italic" }
		},
		{
			kind: "mark",
			mark: "underline",
			icon: "i-lucide-underline",
			tooltip: { text: "Underline" }
		},
		{
			kind: "mark",
			mark: "strike",
			icon: "i-lucide-strikethrough",
			tooltip: { text: "Strikethrough" }
		},
		{
			kind: "mark",
			mark: "code",
			icon: "i-lucide-code",
			tooltip: { text: "Code" }
		}
	];
	const imageButton = () => opts.imageUploadUrl ? [{
		kind: "uploadImage",
		icon: "i-lucide-image",
		tooltip: { text: "Image" }
	}] : [];
	const alignDropdown = {
		icon: "i-lucide-align-justify",
		tooltip: { text: "Text Align" },
		content: { align: "end" },
		items: [
			"left",
			"center",
			"right",
			"justify"
		].map((align) => ({
			kind: "textAlign",
			align,
			icon: `i-lucide-align-${align}`,
			label: `Align ${align[0].toUpperCase()}${align.slice(1)}`
		}))
	};
	function toolbarItems() {
		return [
			[{
				kind: "undo",
				icon: "i-lucide-undo",
				tooltip: { text: "Undo" }
			}, {
				kind: "redo",
				icon: "i-lucide-redo",
				tooltip: { text: "Redo" }
			}],
			[
				{
					icon: "i-lucide-heading",
					tooltip: { text: "Headings" },
					content: { align: "start" },
					items: headingLevels.map((level) => ({
						kind: "heading",
						level,
						icon: `i-lucide-heading-${level}`,
						label: `Heading ${level}`
					}))
				},
				{
					icon: "i-lucide-list",
					tooltip: { text: "Lists" },
					content: { align: "start" },
					items: [{
						kind: "bulletList",
						icon: "i-lucide-list",
						label: "Bullet List"
					}, {
						kind: "orderedList",
						icon: "i-lucide-list-ordered",
						label: "Ordered List"
					}]
				},
				{
					kind: "blockquote",
					icon: "i-lucide-text-quote",
					tooltip: { text: "Blockquote" }
				},
				{
					kind: "codeBlock",
					icon: "i-lucide-square-code",
					tooltip: { text: "Code Block" }
				},
				{
					kind: "horizontalRule",
					icon: "i-lucide-separator-horizontal",
					tooltip: { text: "Horizontal Rule" }
				}
			],
			marksGroup,
			[{
				slot: "link",
				icon: "i-lucide-link"
			}, ...imageButton()],
			[alignDropdown]
		];
	}
	function textBubbleItems() {
		return [
			[{
				label: "Turn into",
				trailingIcon: "i-lucide-chevron-down",
				activeColor: "neutral",
				activeVariant: "ghost",
				tooltip: { text: "Turn into" },
				content: { align: "start" },
				ui: { label: "text-xs" },
				items: [
					{
						type: "label",
						label: "Turn into"
					},
					{
						kind: "paragraph",
						label: "Paragraph",
						icon: "i-lucide-type"
					},
					...headingLevels.map((level) => ({
						kind: "heading",
						level,
						icon: `i-lucide-heading-${level}`,
						label: `Heading ${level}`
					})),
					{
						kind: "bulletList",
						icon: "i-lucide-list",
						label: "Bullet List"
					},
					{
						kind: "orderedList",
						icon: "i-lucide-list-ordered",
						label: "Ordered List"
					},
					{
						kind: "blockquote",
						icon: "i-lucide-text-quote",
						label: "Blockquote"
					},
					{
						kind: "codeBlock",
						icon: "i-lucide-square-code",
						label: "Code Block"
					}
				]
			}],
			marksGroup,
			[{
				slot: "link",
				icon: "i-lucide-link"
			}, ...imageButton()],
			[alignDropdown]
		];
	}
	function imageBubbleItems(ed) {
		const node = ed.state.doc.nodeAt(ed.state.selection.from);
		const editCaption = () => {
			const pos = ed.state.selection.from;
			(ed.view.nodeDOM(pos)?.querySelector?.("input.nuxt-editor-caption"))?.focus();
		};
		const download = () => {
			const a = document.createElement("a");
			a.href = node?.attrs?.src;
			a.download = "";
			a.click();
		};
		const replace = () => {
			const input = document.createElement("input");
			input.type = "file";
			input.accept = "image/*";
			input.onchange = async () => {
				const file = input.files?.[0];
				if (file) {
					const src = await uploadImage(file);
					ed.chain().focus().updateAttributes("image", { src }).run();
				}
			};
			input.click();
		};
		return [[
			{
				icon: "i-lucide-text-cursor-input",
				tooltip: { text: "Caption" },
				onClick: editCaption
			},
			{
				icon: "i-lucide-external-link",
				tooltip: { text: "Open in new window" },
				onClick: () => window.open(node?.attrs?.src, "_blank", "noopener,noreferrer")
			},
			{
				icon: "i-lucide-download",
				tooltip: { text: "Download" },
				onClick: download
			},
			...opts.imageUploadUrl ? [{
				icon: "i-lucide-replace",
				tooltip: { text: "Replace" },
				onClick: replace
			}] : []
		], [{
			icon: "i-lucide-trash",
			color: "error",
			tooltip: { text: "Delete" },
			onClick: () => ed.chain().focus().deleteSelection().run()
		}]];
	}
	const selectedNode = shallowRef();
	const suggestionItems = [
		{
			type: "label",
			label: "Style"
		},
		{
			kind: "paragraph",
			label: "Paragraph",
			icon: "i-lucide-type"
		},
		...[
			1,
			2,
			3
		].map((level) => ({
			kind: "heading",
			level,
			label: `Heading ${level}`,
			icon: `i-lucide-heading-${level}`
		})),
		{
			kind: "bulletList",
			label: "Bullet List",
			icon: "i-lucide-list"
		},
		{
			kind: "orderedList",
			label: "Numbered List",
			icon: "i-lucide-list-ordered"
		},
		{
			kind: "blockquote",
			label: "Blockquote",
			icon: "i-lucide-text-quote"
		},
		{
			kind: "codeBlock",
			label: "Code Block",
			icon: "i-lucide-square-code"
		},
		{
			type: "label",
			label: "Insert"
		},
		...opts.imageUploadUrl ? [{
			kind: "uploadImage",
			label: "Image",
			icon: "i-lucide-image"
		}] : [],
		{
			kind: "horizontalRule",
			label: "Horizontal Rule",
			icon: "i-lucide-separator-horizontal"
		}
	].reduce((groups, item) => {
		if (item.type === "label") groups.push([item]);
		else groups[groups.length - 1].push(item);
		return groups;
	}, []);
	function blockMenuItems(ed) {
		const sel = selectedNode.value;
		if (!sel?.node?.type) return [];
		const pos = sel.pos;
		return mapEditorItems(ed, resolveItems("blockMenu", [
			[{
				label: "Turn into",
				icon: "i-lucide-repeat-2",
				children: [
					{
						kind: "paragraph",
						label: "Paragraph",
						icon: "i-lucide-type"
					},
					...[
						1,
						2,
						3,
						4
					].map((level) => ({
						kind: "heading",
						level,
						label: `Heading ${level}`,
						icon: `i-lucide-heading-${level}`
					})),
					{
						kind: "bulletList",
						label: "Bullet List",
						icon: "i-lucide-list"
					},
					{
						kind: "orderedList",
						label: "Ordered List",
						icon: "i-lucide-list-ordered"
					},
					{
						kind: "blockquote",
						label: "Blockquote",
						icon: "i-lucide-text-quote"
					},
					{
						kind: "codeBlock",
						label: "Code Block",
						icon: "i-lucide-square-code"
					}
				]
			}, {
				kind: "clearFormatting",
				pos,
				label: "Reset formatting",
				icon: "i-lucide-rotate-ccw"
			}],
			[{
				kind: "duplicate",
				pos,
				label: "Duplicate",
				icon: "i-lucide-copy"
			}, {
				label: "Copy to clipboard",
				icon: "i-lucide-clipboard",
				onSelect: () => navigator.clipboard.writeText(sel.node.textContent)
			}],
			[{
				kind: "moveUp",
				pos,
				label: "Move up",
				icon: "i-lucide-arrow-up"
			}, {
				kind: "moveDown",
				pos,
				label: "Move down",
				icon: "i-lucide-arrow-down"
			}],
			[{
				kind: "delete",
				pos,
				label: "Delete",
				icon: "i-lucide-trash"
			}]
		], ed));
	}
	const ImageUploadView = defineComponent({
		props: nodeViewProps,
		setup(props) {
			const file = ref(null);
			const loading = ref(false);
			watch(file, async (newFile) => {
				if (!newFile) return;
				loading.value = true;
				try {
					const src = await uploadImage(newFile);
					const pos = props.getPos();
					if (typeof pos === "number") props.editor.chain().focus().deleteRange({
						from: pos,
						to: pos + 1
					}).setImage({
						src,
						alt: newFile.name
					}).run();
				} catch (e) {
					file.value = null;
				} finally {
					loading.value = false;
				}
			});
			return () => h(NodeViewWrapper, null, () => h(UFileUpload, {
				modelValue: file.value,
				"onUpdate:modelValue": (v) => {
					file.value = v;
				},
				accept: "image/*",
				label: "Upload an image",
				description: "SVG, PNG, JPG or GIF",
				preview: false,
				class: "min-h-48"
			}, { leading: () => h(UAvatar, {
				icon: loading.value ? "i-lucide-loader-circle" : "i-lucide-image",
				size: "xl",
				ui: { icon: [loading.value && "animate-spin"] }
			}) }));
		}
	});
	const LinkPopover = defineComponent({
		props: { editor: {
			type: Object,
			required: true
		} },
		setup(props) {
			const open = ref(false);
			const url = ref("");
			const syncUrl = () => {
				url.value = props.editor.getAttributes("link").href || "";
			};
			props.editor.on("selectionUpdate", syncUrl);
			onBeforeUnmount(() => props.editor.off("selectionUpdate", syncUrl));
			syncUrl();
			const setLink = () => {
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
			};
			const removeLink = () => {
				props.editor.chain().focus().extendMarkRange("link").unsetLink().setMeta("preventAutolink", true).run();
				url.value = "";
				open.value = false;
			};
			const btn = (icon, title, onClick) => h(UButton, {
				icon,
				title,
				onClick,
				color: "neutral",
				variant: "ghost",
				size: "sm",
				disabled: !url.value && !props.editor.isActive("link")
			});
			return () => {
				const active = props.editor.isActive("link");
				const disabled = !props.editor.isEditable || props.editor.state.selection.empty && !active;
				return h(UPopover, {
					open: open.value,
					"onUpdate:open": (v) => open.value = v,
					ui: { content: "p-0.5" }
				}, {
					default: () => h(UTooltip, { text: "Link" }, () => h(UButton, {
						icon: "i-lucide-link",
						color: "neutral",
						activeColor: "primary",
						variant: "ghost",
						activeVariant: "soft",
						size: "sm",
						active,
						disabled
					})),
					content: () => h(UInput, {
						modelValue: url.value,
						"onUpdate:modelValue": (v) => url.value = v,
						autofocus: true,
						type: "url",
						variant: "none",
						placeholder: "Paste a link...",
						onKeydown: (e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								setLink();
							}
						}
					}, { default: () => h("div", { class: "flex items-center mr-0.5" }, [
						btn("i-lucide-corner-down-left", "Apply link", setLink),
						h(USeparator, {
							orientation: "vertical",
							class: "h-6 mx-1"
						}),
						btn("i-lucide-external-link", "Open in new window", () => window.open(url.value, "_blank", "noopener,noreferrer")),
						btn("i-lucide-trash", "Remove link", removeLink)
					]) })
				});
			};
		}
	});
	const imageOptions = {
		resize: {
			enabled: true,
			directions: ["left", "right"],
			minWidth: 50,
			alwaysPreserveAspectRatio: true
		},
		HTMLAttributes: { style: "display:block;margin-left:auto;margin-right:auto;max-width:100%;height:auto;" }
	};
	const captionOptions = {
		syncAttrs: opts.captionSyncAttrs ?? ["alt", "title"],
		live: opts.captionLive ?? true
	};
	const CaptionImage = TiptapImage.extend({
		addAttributes() {
			return {
				...this.parent?.(),
				caption: {
					default: null,
					rendered: false
				}
			};
		},
		parseHTML() {
			return [{
				tag: "figure",
				priority: 60,
				getAttrs: (el) => {
					const img = el.querySelector("img");
					if (!img) return false;
					return {
						src: img.getAttribute("src"),
						alt: img.getAttribute("alt"),
						title: img.getAttribute("title"),
						width: img.getAttribute("width"),
						height: img.getAttribute("height"),
						caption: el.querySelector("figcaption")?.textContent || null
					};
				}
			}, ...this.parent?.() ?? []];
		},
		renderHTML({ node, HTMLAttributes }) {
			const img = ["img", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
			if (!node.attrs.caption) return img;
			return [
				"figure",
				{ style: "margin:1em auto;text-align:center;" },
				img,
				[
					"figcaption",
					{ style: "font-size:.875em;color:var(--bs-secondary-color,#6c757d);margin-top:.25rem;" },
					node.attrs.caption
				]
			];
		},
		addNodeView() {
			const parent = this.parent?.();
			if (!parent) return null;
			return (props) => {
				const inner = parent(props);
				const wrap = document.createElement("div");
				const input = document.createElement("input");
				let current = props.node;
				input.className = "nuxt-editor-caption";
				input.placeholder = "Add a caption...";
				input.value = current.attrs.caption || "";
				const toggle = (selected = false) => {
					input.style.display = selected || input.value ? "" : "none";
				};
				const commit = () => {
					const pos = props.getPos();
					if (typeof pos !== "number") return;
					const tr = props.view.state.tr.setNodeAttribute(pos, "caption", input.value || null);
					if (input.value) for (const attr of captionOptions.syncAttrs) tr.setNodeAttribute(pos, attr, input.value);
					props.view.dispatch(tr);
				};
				input.addEventListener(captionOptions.live ? "input" : "change", commit);
				input.addEventListener("keydown", (e) => {
					if (e.key === "Enter") {
						e.preventDefault();
						props.editor.commands.focus();
					}
				});
				wrap.append(inner.dom, input);
				toggle();
				return {
					dom: wrap,
					update(node, ...rest) {
						if (!inner.update(node, ...rest)) return false;
						current = node;
						if (document.activeElement !== input) input.value = node.attrs.caption || "";
						return true;
					},
					selectNode() {
						inner.selectNode?.();
						toggle(true);
					},
					deselectNode() {
						inner.deselectNode?.();
						toggle();
					},
					stopEvent: (e) => e.target === input || !!inner.stopEvent?.(e),
					ignoreMutation: (m) => !inner.dom.contains(m.target) || !!inner.ignoreMutation?.(m),
					destroy: () => inner.destroy?.()
				};
			};
		}
	}).configure(imageOptions);
	const ImageUpload = Node.create({
		name: "imageUpload",
		group: "block",
		atom: true,
		draggable: true,
		parseHTML: () => [{ tag: "div[data-type=\"image-upload\"]" }],
		renderHTML: ({ HTMLAttributes }) => ["div", mergeAttributes(HTMLAttributes, { "data-type": "image-upload" })],
		addNodeView: () => VueNodeViewRenderer(ImageUploadView)
	});
	const customHandlers = { uploadImage: {
		canExecute: (ed) => ed.can().insertContent({ type: "imageUpload" }),
		execute: (ed) => ed.chain().focus().insertContent({ type: "imageUpload" }),
		isActive: (ed) => ed.isActive("imageUpload"),
		isDisabled: void 0
	} };
	const locale = locales[(opts.locale || "").replace("-", "_")] ?? locales.en;
	const app = createApp({ setup() {
		return () => h(UApp, {
			locale,
			portal
		}, () => h(UEditor, {
			modelValue: content.value,
			"onUpdate:modelValue": (v) => {
				content.value = v;
				onUpdate();
			},
			contentType: format,
			handlers: customHandlers,
			image: false,
			extensions: [
				CaptionImage,
				TextAlign.configure({ types: ["heading", "paragraph"] }),
				...opts.imageUploadUrl ? [ImageUpload] : []
			],
			placeholder: "Write, type '/' for commands...",
			editable: editable.value,
			class: "w-full",
			ui: { base: "p-4 pl-16 sm:p-4 sm:pl-16 min-h-48 border border-default rounded-md" },
			onCreate: ({ editor: ed }) => {
				editor.value = ed;
				if (opts.imageUploadUrl) {
					const insertFiles = (files, pos) => {
						const images = files.filter((f) => f.type.startsWith("image/"));
						if (!images.length) return false;
						(async () => {
							for (const file of images) {
								const src = await uploadImage(file);
								const chain = ed.chain().focus();
								if (pos != null) chain.insertContentAt(pos, {
									type: "image",
									attrs: {
										src,
										alt: file.name
									}
								});
								else chain.setImage({
									src,
									alt: file.name
								});
								chain.run();
							}
						})();
						return true;
					};
					ed.setOptions({ editorProps: {
						handlePaste: (_view, event) => insertFiles(Array.from(event.clipboardData?.files ?? [])),
						handleDrop: (view, event) => {
							const files = Array.from(event.dataTransfer?.files ?? []);
							const pos = view.posAtCoords({
								left: event.clientX,
								top: event.clientY
							})?.pos;
							return insertFiles(files, pos) && (event.preventDefault(), true);
						}
					} });
				}
				element.dispatchEvent(new CustomEvent("nuxt-editor:create", { detail: ed }));
			},
			...opts.props
		}, { default: ({ editor: ed, handlers }) => {
			if (!editable.value) return null;
			const fixedItems = resolveItems("fixed", toolbarItems(), ed);
			const textItems = resolveItems("textBubble", textBubbleItems(), ed);
			const imageItems = resolveItems("imageBubble", imageBubbleItems(ed), ed);
			const slashItems = resolveItems("slash", suggestionItems, ed);
			return [
				fixedItems.length && h(UEditorToolbar, {
					editor: ed,
					items: fixedItems,
					class: "border-b border-default py-2 overflow-x-auto"
				}, { link: () => h(LinkPopover, { editor: ed }) }),
				slashItems.length && h(UEditorSuggestionMenu, {
					editor: ed,
					items: slashItems
				}),
				textItems.length && h(UEditorToolbar, {
					editor: ed,
					items: textItems,
					layout: "bubble",
					shouldShow: ({ editor: e, view, state }) => view.hasFocus() && !state.selection.empty && !e.isActive("image") && !e.isActive("imageUpload") && !e.isActive("codeBlock")
				}, { link: () => h(LinkPopover, { editor: ed }) }),
				imageItems.length && h(UEditorToolbar, {
					editor: ed,
					items: imageItems,
					layout: "bubble",
					shouldShow: ({ editor: e, view }) => e.isActive("image") && view.hasFocus()
				}),
				h(UEditorDragHandle, {
					editor: ed,
					onNodeChange: (node) => {
						selectedNode.value = node;
					}
				}, { default: ({ ui: handleUi, onClick }) => [h(UButton, {
					icon: "i-lucide-plus",
					color: "neutral",
					variant: "ghost",
					size: "sm",
					class: handleUi.handle(),
					onClick: (e) => {
						e.stopPropagation();
						const selected = onClick();
						handlers.suggestion?.execute(ed, { pos: selected?.pos }).run();
					}
				}), h(UDropdownMenu, {
					modal: false,
					items: blockMenuItems(ed),
					content: { side: "left" },
					ui: { content: "w-48" },
					"onUpdate:open": (open) => ed.chain().setMeta("lockDragHandle", open).run()
				}, { default: ({ open }) => h(UButton, {
					icon: "i-lucide-grip-vertical",
					color: "neutral",
					variant: "ghost",
					activeVariant: "soft",
					size: "sm",
					active: open,
					class: handleUi.handle()
				}) })] })
			];
		} }));
	} });
	app.use(ui);
	app.mount(root);
	return {
		element,
		options: opts,
		get editor() {
			return editor.value;
		},
		getValue() {
			return element.value;
		},
		setValue(value) {
			content.value = parseValue(value, format);
			element.value = value;
		},
		insert(html) {
			editor.value?.chain().focus().insertContent(html).run();
		},
		setEditable(value) {
			editable.value = value;
		},
		destroy() {
			app.unmount();
			host.remove();
			element.style.display = "";
			instances.delete(element);
		}
	};
}
function parseValue(value, format) {
	if (format === "json") try {
		return value ? JSON.parse(value) : "";
	} catch {
		return "";
	}
	return value;
}
function collectProperties(rule) {
	if (rule instanceof CSSPropertyRule) return [rule.cssText];
	const children = rule.cssRules;
	return children ? Array.from(children).flatMap(collectProperties) : [];
}
export { configure, create, destroy, get };

//# sourceMappingURL=nuxt-editor.js.map