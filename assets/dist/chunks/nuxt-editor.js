import { n as __exportAll } from "./rolldown-runtime.js";
import { d as selectOne } from "./dom.js";
import { t as mergeDeep } from "./arr.js";
import { n as trans } from "./lang.js";
import { useHttpClient, useStack } from "../unicorn.js";
import { createApp, defineComponent, h, ref, shallowRef, watch } from "vue";
// src/module/nuxt-editor-lib/caption-image.ts
var imageOptions = {
	resize: {
		enabled: true,
		directions: ["left", "right"],
		minWidth: 50,
		alwaysPreserveAspectRatio: true
	},
	HTMLAttributes: { style: "display:block;margin-left:auto;margin-right:auto;max-width:100%;height:auto;" }
};
function createCaptionImage(TiptapImage, mergeAttributes, opts) {
	const captionOptions = {
		syncAttrs: opts.captionSyncAttrs ?? ["alt", "title"],
		figure: opts.captionFigure ?? false
	};
	const isAutoAlt = (node, value) => {
		const src = String(node.attrs.src || "").split(/[?#]/)[0];
		const name = decodeURIComponent(src.split("/").pop() || "");
		return value === name || value === name.replace(/\.[^.]+$/, "");
	};
	const readCaption = (node) => node.attrs.title || node.attrs.caption || (captionOptions.syncAttrs.map((a) => node.attrs[a]).find((v) => v && !isAutoAlt(node, String(v))) ?? "");
	return TiptapImage.extend({
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
			if (!captionOptions.figure || !node.attrs.caption) return img;
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
				input.className = "nuxt-editor-caption";
				input.placeholder = trans("unicorn.nuxt.editor.field.caption.placeholder");
				input.value = readCaption(props.node);
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
				input.addEventListener("input", commit);
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
						if (document.activeElement !== input) input.value = readCaption(node);
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
}
// src/composable/nuxt-editor/useBlockMenu.ts
function useBlockMenu(resolveItems, defaultItems, mapEditorItems) {
	const selectedNode = shallowRef();
	const items = (ed) => selectedNode.value?.node?.type ? mapEditorItems(ed, resolveItems("blockMenu", defaultItems(selectedNode.value), ed)) : [];
	return {
		selectedNode,
		items
	};
}
// src/composable/nuxt-editor/useEditorSync.ts
function useEditorSync(element, format, parse) {
	const content = ref(parse(element.value, format));
	function serialize(value) {
		return format === "json" ? JSON.stringify(value) : value ?? "";
	}
	function update(value) {
		content.value = value;
		element.value = serialize(value);
		element.dispatchEvent(new Event("input", { bubbles: true }));
		element.dispatchEvent(new Event("change", { bubbles: true }));
	}
	function set(value) {
		content.value = parse(value, format);
		element.value = value;
	}
	return {
		content,
		update,
		set
	};
}
// src/module/nuxt-editor-lib/upload.ts
function fileNameFromUrl(src) {
	const path = src.split(/[?#]/)[0];
	try {
		return decodeURIComponent(path.substring(path.lastIndexOf("/") + 1));
	} catch (e) {
		return path.substring(path.lastIndexOf("/") + 1);
	}
}
function createUploadImage(element, opts) {
	return async (file) => {
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
	};
}
function createFetchImage(element, opts) {
	return async (imageUrl) => {
		element.dispatchEvent(new CustomEvent("upload-start"));
		const stack = useStack(opts.unicorn?.stack_name);
		stack.push(true);
		const { post } = await useHttpClient();
		try {
			const res = await post(opts.imageFetchUrl, { url: imageUrl }, { withCredentials: false });
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
	};
}
var IMAGE_URL_RE = /^https?:\/\/\S+\.(png|jpe?g|gif|webp|svg|avif)(\?\S*)?$/i;
function createPasteDropPlugins(ed, { Plugin, key, Decoration, DecorationSet }, uploadImage, opts = {}, fetchImage) {
	const ownHosts = opts.imageOwnHosts?.length ? opts.imageOwnHosts : [location.host];
	const isExternal = (src) => {
		try {
			const u = new URL(src, location.href);
			return /^https?:$/.test(u.protocol) && !ownHosts.includes(u.host) && !ownHosts.includes(u.hostname);
		} catch (e) {
			return false;
		}
	};
	const rehostHtml = async (html) => {
		const doc = new DOMParser().parseFromString(html, "text/html");
		const imgs = Array.from(doc.querySelectorAll("img")).filter((img) => isExternal(img.getAttribute("src") || ""));
		await Promise.all(imgs.map(async (img) => {
			try {
				img.setAttribute("src", await fetchImage(img.getAttribute("src")));
			} catch (e) {}
		}));
		return doc.body.innerHTML;
	};
	const handleRemotePaste = (event) => {
		if (!fetchImage) return false;
		const html = event.clipboardData?.getData("text/html") || "";
		const text = (event.clipboardData?.getData("text/plain") || "").trim();
		if (html && /<img\b/i.test(html)) {
			if (!Array.from(new DOMParser().parseFromString(html, "text/html").querySelectorAll("img")).some((img) => isExternal(img.getAttribute("src") || ""))) return false;
			rehostHtml(html).then((newHtml) => ed.chain().focus().insertContent(newHtml).run());
			return true;
		}
		if (IMAGE_URL_RE.test(text) && isExternal(text)) {
			fetchImage(text).then((src) => ed.chain().focus().setImage({
				src,
				alt: fileNameFromUrl(src)
			}).run()).catch(() => ed.chain().focus().insertContent(text).run());
			return true;
		}
		return false;
	};
	const insertFiles = (files, pos) => {
		const images = files.filter((f) => f.type.startsWith("image/"));
		if (!images.length) return false;
		(async () => {
			for (const file of images) {
				const id = {};
				const at = pos ?? ed.state.selection.from;
				ed.view.dispatch(ed.state.tr.setMeta(key, { add: {
					id,
					pos: at
				} }));
				const findPlaceholder = () => key.getState(ed.state).find(void 0, void 0, (s) => s.id === id)[0]?.from;
				try {
					const src = await uploadImage(file);
					const where = findPlaceholder();
					ed.view.dispatch(ed.state.tr.setMeta(key, { remove: id }));
					if (where != null) ed.chain().focus().insertContentAt(where, {
						type: "image",
						attrs: {
							src,
							alt: fileNameFromUrl(src)
						}
					}).run();
				} catch (e) {
					ed.view.dispatch(ed.state.tr.setMeta(key, { remove: id }));
				}
			}
		})();
		return true;
	};
	return [new Plugin({
		key,
		state: {
			init: () => DecorationSet.empty,
			apply(tr, set) {
				set = set.map(tr.mapping, tr.doc);
				const meta = tr.getMeta(key);
				if (meta?.add) {
					const el = document.createElement("div");
					el.className = "nuxt-upload-placeholder";
					el.setAttribute("contenteditable", "false");
					el.innerHTML = "<span class=\"nuxt-upload-placeholder__icon\"><svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"><path d=\"M21 12a9 9 0 1 1-6.2-8.55\"><animateTransform attributeName=\"transform\" type=\"rotate\" from=\"0 12 12\" to=\"360 12 12\" dur=\"1s\" repeatCount=\"indefinite\"/></path></svg></span><span class=\"nuxt-upload-placeholder__label\">" + trans("unicorn.nuxt.editor.message.uploading") + "</span>";
					set = set.add(tr.doc, [Decoration.widget(meta.add.pos, el, {
						id: meta.add.id,
						side: -1
					})]);
				}
				if (meta?.remove) set = set.remove(set.find(void 0, void 0, (s) => s.id === meta.remove));
				return set;
			}
		},
		props: {
			decorations: (state) => key.getState(state),
			handlePaste: (_view, event) => insertFiles(Array.from(event.clipboardData?.files ?? [])) || handleRemotePaste(event),
			handleDrop: (view, event) => {
				const files = Array.from(event.dataTransfer?.files ?? []);
				const pos = view.posAtCoords({
					left: event.clientX,
					top: event.clientY
				})?.pos;
				return insertFiles(files, pos) && (event.preventDefault(), true);
			}
		}
	})];
}
function createImagePasteDrop({ Extension, Plugin, PluginKey, Decoration, DecorationSet }, uploadImage, opts = {}, fetchImage) {
	const key = new PluginKey("imagePasteDrop");
	return Extension.create({
		name: "imagePasteDrop",
		addProseMirrorPlugins() {
			return createPasteDropPlugins(this.editor, {
				Plugin,
				key,
				Decoration,
				DecorationSet
			}, uploadImage, opts, fetchImage);
		}
	});
}
// src/module/nuxt-editor-lib/image-upload.ts
function createImageUpload(deps) {
	const { Node, mergeAttributes, VueNodeViewRenderer, NodeViewWrapper, nodeViewProps, UFileUpload, UAvatar, uploadImage } = deps;
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
						alt: fileNameFromUrl(src)
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
				label: trans("unicorn.nuxt.editor.action.upload.image"),
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
	return {
		ImageUpload: Node.create({
			name: "imageUpload",
			group: "block",
			atom: true,
			draggable: true,
			parseHTML: () => [{ tag: "div[data-type=\"image-upload\"]" }],
			renderHTML: ({ HTMLAttributes }) => ["div", mergeAttributes(HTMLAttributes, { "data-type": "image-upload" })],
			addNodeView: () => VueNodeViewRenderer(ImageUploadView)
		}),
		customHandlers: { uploadImage: {
			canExecute: (ed) => ed.can().insertContent({ type: "imageUpload" }),
			execute: (ed) => ed.chain().focus().insertContent({ type: "imageUpload" }),
			isActive: (ed) => ed.isActive("imageUpload"),
			isDisabled: void 0
		} }
	};
}
// src/module/nuxt-editor-lib/shadow.ts
function createShadowHost(css) {
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
	const stopBacktick = (e) => {
		if (e.key === "`" && !e.ctrlKey && !e.metaKey && !e.altKey) e.stopPropagation();
	};
	for (const target of [root, portal]) for (const type of [
		"keydown",
		"keypress",
		"keyup"
	]) target.addEventListener(type, stopBacktick);
	return {
		host,
		root,
		portal
	};
}
function collectProperties(rule) {
	if (rule instanceof CSSPropertyRule) return [rule.cssText];
	const children = rule.cssRules;
	return children ? Array.from(children).flatMap(collectProperties) : [];
}
// src/module/nuxt-editor-lib/toolbars.ts
function createToolbars(opts, uploadImage) {
	const headingLevels = [
		1,
		2,
		3,
		4
	];
	const headingLabel = (level) => trans("unicorn.nuxt.editor.action.heading", level);
	const marksGroup = [
		{
			kind: "mark",
			mark: "bold",
			icon: "i-lucide-bold",
			tooltip: { text: trans("unicorn.nuxt.editor.action.bold") }
		},
		{
			kind: "mark",
			mark: "italic",
			icon: "i-lucide-italic",
			tooltip: { text: trans("unicorn.nuxt.editor.action.italic") }
		},
		{
			kind: "mark",
			mark: "underline",
			icon: "i-lucide-underline",
			tooltip: { text: trans("unicorn.nuxt.editor.action.underline") }
		},
		{
			kind: "mark",
			mark: "strike",
			icon: "i-lucide-strikethrough",
			tooltip: { text: trans("unicorn.nuxt.editor.action.strikethrough") }
		},
		{
			kind: "mark",
			mark: "code",
			icon: "i-lucide-code",
			tooltip: { text: trans("unicorn.nuxt.editor.action.code") }
		},
		{
			kind: "mark",
			mark: "highlight",
			icon: "i-lucide-highlighter",
			tooltip: { text: trans("unicorn.nuxt.editor.action.highlight") }
		}
	];
	const colorsButton = () => [{
		slot: "colors",
		colorKind: "text",
		icon: "i-lucide-baseline",
		tooltip: { text: trans("unicorn.nuxt.editor.action.text.colors") },
		colors: opts.tableColors
	}, {
		slot: "colors",
		colorKind: "background",
		icon: "i-lucide-paint-bucket",
		tooltip: { text: trans("unicorn.nuxt.editor.action.background.colors") },
		colors: opts.tableColors
	}];
	const imageButton = () => opts.imageUploadUrl ? [{
		kind: "uploadImage",
		icon: "i-lucide-image",
		tooltip: { text: trans("unicorn.nuxt.editor.action.image") }
	}] : [];
	const alignButtons = [
		{
			kind: "textAlign",
			align: "left",
			icon: "i-lucide-align-left",
			tooltip: { text: trans("unicorn.nuxt.editor.action.align.left") }
		},
		{
			kind: "textAlign",
			align: "center",
			icon: "i-lucide-align-center",
			tooltip: { text: trans("unicorn.nuxt.editor.action.align.center") }
		},
		{
			kind: "textAlign",
			align: "right",
			icon: "i-lucide-align-right",
			tooltip: { text: trans("unicorn.nuxt.editor.action.align.right") }
		},
		{
			kind: "textAlign",
			align: "justify",
			icon: "i-lucide-align-justify",
			tooltip: { text: trans("unicorn.nuxt.editor.action.align.justify") }
		}
	];
	function toolbarItems() {
		return [
			[{
				kind: "undo",
				icon: "i-lucide-undo",
				tooltip: { text: trans("unicorn.nuxt.editor.action.undo") }
			}, {
				kind: "redo",
				icon: "i-lucide-redo",
				tooltip: { text: trans("unicorn.nuxt.editor.action.redo") }
			}],
			[
				{
					icon: "i-lucide-heading",
					tooltip: { text: trans("unicorn.nuxt.editor.action.headings") },
					content: { align: "start" },
					items: headingLevels.map((level) => ({
						kind: "heading",
						level,
						icon: `i-lucide-heading-${level}`,
						label: headingLabel(level)
					}))
				},
				{
					icon: "i-lucide-list",
					tooltip: { text: trans("unicorn.nuxt.editor.action.lists") },
					content: { align: "start" },
					items: [{
						kind: "bulletList",
						icon: "i-lucide-list",
						label: trans("unicorn.nuxt.editor.action.bullet.list")
					}, {
						kind: "orderedList",
						icon: "i-lucide-list-ordered",
						label: trans("unicorn.nuxt.editor.action.ordered.list")
					}]
				},
				{
					kind: "blockquote",
					icon: "i-lucide-text-quote",
					tooltip: { text: trans("unicorn.nuxt.editor.action.blockquote") }
				},
				{
					kind: "codeBlock",
					icon: "i-lucide-square-code",
					tooltip: { text: trans("unicorn.nuxt.editor.action.code.block") }
				},
				{
					kind: "horizontalRule",
					icon: "i-lucide-separator-horizontal",
					tooltip: { text: trans("unicorn.nuxt.editor.action.horizontal.rule") }
				}
			],
			[...marksGroup, ...colorsButton()],
			[
				{
					slot: "link",
					icon: "i-lucide-link"
				},
				...imageButton(),
				{
					slot: "video",
					icon: "i-lucide-video"
				}
			],
			alignButtons
		];
	}
	function textBubbleItems() {
		return [
			[{
				label: trans("unicorn.nuxt.editor.action.turn.into"),
				trailingIcon: "i-lucide-chevron-down",
				activeColor: "neutral",
				activeVariant: "ghost",
				tooltip: { text: trans("unicorn.nuxt.editor.action.turn.into") },
				content: { align: "start" },
				ui: { label: "text-xs" },
				items: [
					{
						type: "label",
						label: trans("unicorn.nuxt.editor.action.turn.into")
					},
					{
						kind: "paragraph",
						label: trans("unicorn.nuxt.editor.action.paragraph"),
						icon: "i-lucide-type"
					},
					...headingLevels.map((level) => ({
						kind: "heading",
						level,
						icon: `i-lucide-heading-${level}`,
						label: headingLabel(level)
					})),
					{
						kind: "bulletList",
						icon: "i-lucide-list",
						label: trans("unicorn.nuxt.editor.action.bullet.list")
					},
					{
						kind: "orderedList",
						icon: "i-lucide-list-ordered",
						label: trans("unicorn.nuxt.editor.action.ordered.list")
					},
					{
						kind: "blockquote",
						icon: "i-lucide-text-quote",
						label: trans("unicorn.nuxt.editor.action.blockquote")
					},
					{
						kind: "codeBlock",
						icon: "i-lucide-square-code",
						label: trans("unicorn.nuxt.editor.action.code.block")
					}
				]
			}],
			[...marksGroup, ...colorsButton()],
			[{
				slot: "link",
				icon: "i-lucide-link"
			}, ...imageButton()],
			alignButtons
		];
	}
	function videoBubbleItems(ed) {
		const src = ed.state.selection.node?.attrs?.src;
		return [[{
			icon: "i-lucide-external-link",
			tooltip: { text: trans("unicorn.nuxt.editor.action.open.in.new.window") },
			onClick: () => window.open(src, "_blank", "noopener,noreferrer")
		}, {
			slot: "videosource",
			icon: "i-lucide-pencil"
		}], [{
			icon: "i-lucide-trash",
			color: "error",
			tooltip: { text: trans("unicorn.nuxt.editor.action.delete") },
			onClick: () => ed.chain().focus().deleteSelection().run()
		}]];
	}
	function imageBubbleItems(ed) {
		const node = ed.state.doc.nodeAt(ed.state.selection.from);
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
					const attrs = { src };
					if (!node?.attrs?.title && !node?.attrs?.caption) attrs.alt = fileNameFromUrl(src);
					ed.chain().focus().updateAttributes("image", attrs).run();
				}
			};
			input.click();
		};
		return [
			[{
				icon: "i-lucide-external-link",
				tooltip: { text: trans("unicorn.nuxt.editor.action.open.in.new.window") },
				onClick: () => window.open(node?.attrs?.src, "_blank", "noopener,noreferrer")
			}, {
				icon: "i-lucide-download",
				tooltip: { text: trans("unicorn.nuxt.editor.action.download") },
				onClick: download
			}],
			...opts.imageUploadUrl ? [[{
				icon: "i-lucide-replace",
				tooltip: { text: trans("unicorn.nuxt.editor.action.replace") },
				onClick: replace
			}]] : [],
			[{
				icon: "i-lucide-trash",
				color: "error",
				tooltip: { text: trans("unicorn.nuxt.editor.action.delete") },
				onClick: () => ed.chain().focus().deleteSelection().run()
			}]
		];
	}
	const suggestionItems = [
		{
			type: "label",
			label: trans("unicorn.nuxt.editor.text.style")
		},
		{
			kind: "paragraph",
			label: trans("unicorn.nuxt.editor.action.paragraph"),
			icon: "i-lucide-type"
		},
		...[
			1,
			2,
			3
		].map((level) => ({
			kind: "heading",
			level,
			label: headingLabel(level),
			icon: `i-lucide-heading-${level}`
		})),
		{
			kind: "bulletList",
			label: trans("unicorn.nuxt.editor.action.bullet.list"),
			icon: "i-lucide-list"
		},
		{
			kind: "orderedList",
			label: trans("unicorn.nuxt.editor.action.numbered.list"),
			icon: "i-lucide-list-ordered"
		},
		{
			kind: "blockquote",
			label: trans("unicorn.nuxt.editor.action.blockquote"),
			icon: "i-lucide-text-quote"
		},
		{
			kind: "codeBlock",
			label: trans("unicorn.nuxt.editor.action.code.block"),
			icon: "i-lucide-square-code"
		},
		{
			type: "label",
			label: trans("unicorn.nuxt.editor.text.insert")
		},
		...opts.imageUploadUrl ? [{
			kind: "uploadImage",
			label: trans("unicorn.nuxt.editor.action.image"),
			icon: "i-lucide-image"
		}] : [],
		{
			kind: "insertTable",
			label: trans("unicorn.nuxt.editor.action.table"),
			icon: "i-lucide-table"
		},
		{
			kind: "horizontalRule",
			label: trans("unicorn.nuxt.editor.action.horizontal.rule"),
			icon: "i-lucide-separator-horizontal"
		}
	].reduce((groups, item) => {
		if (item.type === "label") groups.push([item]);
		else groups[groups.length - 1].push(item);
		return groups;
	}, []);
	function blockMenuItems(sel) {
		if (!sel?.node?.type) return [];
		const pos = sel.pos;
		return [
			[{
				label: trans("unicorn.nuxt.editor.action.turn.into"),
				icon: "i-lucide-repeat-2",
				children: [
					{
						kind: "paragraph",
						label: trans("unicorn.nuxt.editor.action.paragraph"),
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
						label: headingLabel(level),
						icon: `i-lucide-heading-${level}`
					})),
					{
						kind: "bulletList",
						label: trans("unicorn.nuxt.editor.action.bullet.list"),
						icon: "i-lucide-list"
					},
					{
						kind: "orderedList",
						label: trans("unicorn.nuxt.editor.action.ordered.list"),
						icon: "i-lucide-list-ordered"
					},
					{
						kind: "blockquote",
						label: trans("unicorn.nuxt.editor.action.blockquote"),
						icon: "i-lucide-text-quote"
					},
					{
						kind: "codeBlock",
						label: trans("unicorn.nuxt.editor.action.code.block"),
						icon: "i-lucide-square-code"
					}
				]
			}, {
				kind: "clearFormatting",
				pos,
				label: trans("unicorn.nuxt.editor.action.clear.formatting"),
				icon: "i-lucide-remove-formatting"
			}],
			[{
				kind: "duplicate",
				pos,
				label: trans("unicorn.nuxt.editor.action.duplicate"),
				icon: "i-lucide-copy"
			}, {
				label: trans("unicorn.nuxt.editor.action.copy.to.clipboard"),
				icon: "i-lucide-clipboard",
				onSelect: () => navigator.clipboard.writeText(sel.node.textContent)
			}],
			[{
				kind: "moveUp",
				pos,
				label: trans("unicorn.nuxt.editor.action.move.up"),
				icon: "i-lucide-arrow-up"
			}, {
				kind: "moveDown",
				pos,
				label: trans("unicorn.nuxt.editor.action.move.down"),
				icon: "i-lucide-arrow-down"
			}],
			[{
				kind: "delete",
				pos,
				label: trans("unicorn.nuxt.editor.action.delete"),
				icon: "i-lucide-trash"
			}]
		];
	}
	return {
		toolbarItems,
		textBubbleItems,
		videoBubbleItems,
		imageBubbleItems,
		suggestionItems,
		blockMenuItems
	};
}
function createItemsResolver(toolbars, opts) {
	return (key, defaults, ed) => {
		const override = toolbars[key];
		if (override === false) return [];
		if (Array.isArray(override)) return override;
		if (typeof override === "function") return override(defaults, {
			editor: ed,
			options: opts
		}) ?? defaults;
		return defaults;
	};
}
// src/module/nuxt-editor-lib/code-block.ts
var DEFAULT_LANGUAGES = {
	html: "HTML",
	css: "CSS",
	javascript: "JavaScript",
	typescript: "TypeScript",
	json: "JSON",
	php: "PHP",
	sql: "SQL",
	bash: "Bash",
	python: "Python",
	xml: "XML",
	yaml: "YAML",
	markdown: "Markdown"
};
var DEFAULT_ALIASES = {
	js: "javascript",
	jsx: "javascript",
	mjs: "javascript",
	ts: "typescript",
	tsx: "typescript",
	md: "markdown",
	yml: "yaml",
	sh: "bash",
	shell: "bash",
	zsh: "bash",
	py: "python",
	htm: "html",
	text: "",
	plain: "",
	plaintext: ""
};
function createCodeBlock(CodeBlock, opts) {
	const languages = opts.codeBlockLanguages && Object.keys(opts.codeBlockLanguages).length ? opts.codeBlockLanguages : DEFAULT_LANGUAGES;
	const ALIASES = opts.codeBlockAliases && Object.keys(opts.codeBlockAliases).length ? opts.codeBlockAliases : DEFAULT_ALIASES;
	return CodeBlock.extend({ addNodeView() {
		return ({ node, editor, getPos }) => {
			let current = node;
			const dom = document.createElement("div");
			dom.className = "nuxt-code-block";
			const select = document.createElement("select");
			select.setAttribute("contenteditable", "false");
			const sync = () => {
				select.innerHTML = "";
				select.add(new Option(trans("unicorn.nuxt.editor.text.plain.text"), ""));
				for (const [value, label] of Object.entries(languages)) select.add(new Option(label, value));
				const raw = current.attrs.language || "";
				const lang = raw in languages ? raw : ALIASES[raw] ?? raw;
				if (lang && !(lang in languages)) select.add(new Option(lang, lang));
				select.value = lang;
			};
			select.addEventListener("change", () => {
				const pos = getPos();
				if (typeof pos === "number") editor.view.dispatch(editor.state.tr.setNodeMarkup(pos, void 0, {
					...current.attrs,
					language: select.value || null
				}));
			});
			const pre = document.createElement("pre");
			const code = document.createElement("code");
			pre.append(code);
			dom.append(select, pre);
			sync();
			const markActive = () => {
				const pos = getPos();
				const { from, to } = editor.state.selection;
				dom.classList.toggle("is-active", typeof pos === "number" && from >= pos && to <= pos + current.nodeSize);
			};
			editor.on("selectionUpdate", markActive);
			editor.on("focus", markActive);
			editor.on("blur", () => dom.classList.remove("is-active"));
			markActive();
			return {
				dom,
				contentDOM: code,
				destroy() {
					editor.off("selectionUpdate", markActive);
					editor.off("focus", markActive);
				},
				update(updated) {
					if (updated.type !== current.type) return false;
					current = updated;
					sync();
					return true;
				},
				stopEvent: (e) => e.target === select,
				ignoreMutation: (m) => !code.contains(m.target)
			};
		};
	} });
}
// src/module/nuxt-editor-lib/colors.ts
var DEFAULT_COLORS = {
	Primary: "var(--bs-primary)",
	Secondary: "var(--bs-secondary)",
	Success: "var(--bs-success)",
	Danger: "var(--bs-danger)",
	Warning: "var(--bs-warning)",
	Info: "var(--bs-info)",
	Gray: "#6b7280",
	Red: "#ef4444",
	Orange: "#f97316",
	Yellow: "#eab308",
	Green: "#22c55e",
	Blue: "#3b82f6",
	Purple: "#a855f7",
	Pink: "#ec4899"
};
var RECENT_KEY = "nuxt-editor:table-recent-colors";
var resolveColors = (colors) => colors && Object.keys(colors).length ? colors : DEFAULT_COLORS;
var toBackground = (color) => {
	if (/^#[0-9a-f]{6}$/i.test(color)) return `${color}33`;
	const bs = color.match(/^var\(--bs-([\w-]+)\)$/);
	return bs ? `rgba(var(--bs-${bs[1]}-rgb), .2)` : color;
};
function getRecentColors() {
	try {
		const list = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
		return Array.isArray(list) ? list : [];
	} catch {
		return [];
	}
}
function pushRecentColor(recent) {
	const others = getRecentColors().filter((r) => r.kind !== recent.kind);
	const same = getRecentColors().filter((r) => r.kind === recent.kind && r.color !== recent.color);
	const list = [
		...others,
		recent,
		...same.slice(0, 2)
	];
	try {
		localStorage.setItem(RECENT_KEY, JSON.stringify(list));
	} catch {}
}
/**
* Two submenu items (Text Colors, Background Colors). `apply(kind, color)` receives the raw palette
* color, or null for "Default"; recent colors are recorded here.
*/
function createColorMenu(colors, apply) {
	const select = (kind, color) => {
		apply(kind, color);
		if (color) pushRecentColor({
			kind,
			color
		});
	};
	const colorItem = (kind, label, color) => ({
		label,
		slot: kind === "text" ? "textSwatch" : "swatch",
		swatch: color,
		onSelect: () => {
			select(kind, color);
		}
	});
	const palette = (kind) => {
		const recent = getRecentColors().filter((r) => r.kind === kind).map(({ color }) => colorItem(kind, Object.entries(colors).find(([, v]) => v === color)?.[0] ?? color, color));
		return [...recent.length ? [[{
			type: "label",
			label: trans("unicorn.nuxt.editor.text.recent.colors")
		}, ...recent]] : [], [{
			icon: "i-lucide-ban",
			label: trans("unicorn.nuxt.editor.action.default"),
			onSelect: () => {
				select(kind, null);
			}
		}, ...Object.entries(colors).map(([label, color]) => colorItem(kind, label, color))]];
	};
	return [{
		icon: "i-lucide-baseline",
		label: trans("unicorn.nuxt.editor.action.text.colors"),
		children: palette("text")
	}, {
		icon: "i-lucide-paint-bucket",
		label: trans("unicorn.nuxt.editor.action.background.colors"),
		children: palette("background")
	}];
}
// src/module/nuxt-editor-lib/table.ts
var commands = {
	insertTable: (ed) => ed.chain().focus().insertTable({
		rows: 3,
		cols: 3,
		withHeaderRow: true
	}),
	addRowBefore: (ed) => ed.chain().focus().addRowBefore(),
	addRowAfter: (ed) => ed.chain().focus().addRowAfter(),
	deleteRow: (ed) => ed.chain().focus().deleteRow(),
	addColumnBefore: (ed) => ed.chain().focus().addColumnBefore(),
	addColumnAfter: (ed) => ed.chain().focus().addColumnAfter(),
	deleteColumn: (ed) => ed.chain().focus().deleteColumn(),
	toggleHeaderRow: (ed) => ed.chain().focus().toggleHeaderRow(),
	mergeCells: (ed) => ed.chain().focus().mergeCells(),
	splitCell: (ed) => ed.chain().focus().splitCell(),
	deleteTable: (ed) => ed.chain().focus().deleteTable()
};
function createTable(tableExt, pmTables, pmModel, tableOptions = {}) {
	const colors = resolveColors(tableOptions.colors);
	const { TableKit, TableCell, TableHeader } = tableExt;
	const { selectedRect } = pmTables;
	const { Fragment } = pmModel;
	const styleAttr = (attr, css) => ({
		default: null,
		parseHTML: (el) => el.style.getPropertyValue(css) || null,
		renderHTML: (attrs) => attrs[attr] ? { style: `${css}: ${attrs[attr]}` } : {}
	});
	const withCellAttrs = (Base) => Base.extend({ addAttributes() {
		return {
			...this.parent?.(),
			backgroundColor: styleAttr("backgroundColor", "background-color"),
			textColor: styleAttr("textColor", "color"),
			textAlign: styleAttr("textAlign", "text-align"),
			verticalAlign: styleAttr("verticalAlign", "vertical-align")
		};
	} });
	const getContext = (state) => {
		let rect;
		try {
			rect = selectedRect(state);
		} catch {
			return null;
		}
		const rows = [];
		let spanned = false;
		rect.table.forEach((row) => {
			rows.push(row);
			row.forEach((cell) => {
				spanned ||= cell.attrs.colspan > 1 || cell.attrs.rowspan > 1;
			});
		});
		return {
			rect,
			rows,
			spanned
		};
	};
	const rowCells = (row) => {
		const cells = [];
		row.forEach((cell) => cells.push(cell));
		return cells;
	};
	const swap = (list, a, b) => {
		[list[a], list[b]] = [list[b], list[a]];
		return list;
	};
	const mapColumns = ({ rows }, fn) => rows.map((row) => row.copy(Fragment.from(fn(rowCells(row)))));
	const custom = {
		moveRowUp: (c) => c.spanned || c.rect.top < 1 ? null : {
			rows: swap([...c.rows], c.rect.top, c.rect.top - 1),
			row: c.rect.top - 1,
			col: c.rect.left
		},
		moveRowDown: (c) => c.spanned || c.rect.top >= c.rows.length - 1 ? null : {
			rows: swap([...c.rows], c.rect.top, c.rect.top + 1),
			row: c.rect.top + 1,
			col: c.rect.left
		},
		duplicateRow: (c) => {
			if (c.spanned) return null;
			const rows = [...c.rows];
			rows.splice(c.rect.top + 1, 0, rows[c.rect.top]);
			return {
				rows,
				row: c.rect.top + 1,
				col: c.rect.left
			};
		},
		moveColumnLeft: (c) => c.spanned || c.rect.left < 1 ? null : {
			rows: mapColumns(c, (cells) => swap(cells, c.rect.left, c.rect.left - 1)),
			row: c.rect.top,
			col: c.rect.left - 1
		},
		moveColumnRight: (c) => c.spanned || c.rect.left >= c.rect.map.width - 1 ? null : {
			rows: mapColumns(c, (cells) => swap(cells, c.rect.left, c.rect.left + 1)),
			row: c.rect.top,
			col: c.rect.left + 1
		},
		duplicateColumn: (c) => c.spanned ? null : {
			rows: mapColumns(c, (cells) => {
				cells.splice(c.rect.left + 1, 0, cells[c.rect.left]);
				return cells;
			}),
			row: c.rect.top,
			col: c.rect.left + 1
		}
	};
	const runCustom = (ed, kind) => ed.chain().focus().command(({ state, tr, dispatch }) => {
		const ctx = getContext(state);
		const result = ctx && custom[kind](ctx);
		if (!ctx || !result) return false;
		if (dispatch) {
			const { table, tableStart } = ctx.rect;
			const newTable = table.copy(Fragment.from(result.rows));
			tr.replaceWith(tableStart - 1, tableStart - 1 + table.nodeSize, newTable);
			let pos = tableStart;
			for (let i = 0; i < result.row; i++) pos += newTable.child(i).nodeSize;
			const row = newTable.child(result.row);
			pos += 1;
			for (let i = 0; i < result.col; i++) pos += row.child(i).nodeSize;
			tr.setSelection(tr.selection.constructor.near(tr.doc.resolve(pos + 1)));
		}
		return true;
	}).run();
	const setCellAttrs = (ed, scope, attrs) => ed.chain().focus().command(({ state, tr }) => {
		const ctx = getContext(state);
		if (!ctx) return false;
		const { map, tableStart, top, left, bottom, right } = ctx.rect;
		const area = scope === "row" ? {
			left: 0,
			right: map.width,
			top,
			bottom: top + 1
		} : scope === "column" ? {
			left,
			right: left + 1,
			top: 0,
			bottom: map.height
		} : {
			left,
			right,
			top,
			bottom
		};
		map.cellsInRect(area).forEach((offset) => {
			const node = tr.doc.nodeAt(tableStart + offset);
			tr.setNodeMarkup(tableStart + offset, void 0, {
				...node.attrs,
				...attrs
			});
		});
		return true;
	}).run();
	const handlers = Object.fromEntries(Object.entries(commands).map(([kind, run]) => [kind, {
		canExecute: (ed) => canRun(ed, kind),
		execute: (ed) => run(ed),
		isActive: (ed) => kind === "insertTable" ? ed.isActive("table") : false,
		isDisabled: void 0
	}]));
	const toolbarGroup = () => [{
		kind: "insertTable",
		icon: "i-lucide-table",
		tooltip: { text: trans("unicorn.nuxt.editor.action.insert.table") }
	}, {
		icon: "i-lucide-table-properties",
		tooltip: { text: trans("unicorn.nuxt.editor.action.table") },
		content: { align: "start" },
		items: [
			{
				kind: "addRowBefore",
				icon: "i-lucide-arrow-up-from-line",
				label: trans("unicorn.nuxt.editor.action.add.row.above")
			},
			{
				kind: "addRowAfter",
				icon: "i-lucide-arrow-down-from-line",
				label: trans("unicorn.nuxt.editor.action.add.row.below")
			},
			{
				kind: "deleteRow",
				icon: "i-lucide-table-rows-split",
				label: trans("unicorn.nuxt.editor.action.delete.row")
			},
			{
				kind: "addColumnBefore",
				icon: "i-lucide-arrow-left-from-line",
				label: trans("unicorn.nuxt.editor.action.add.column.before")
			},
			{
				kind: "addColumnAfter",
				icon: "i-lucide-arrow-right-from-line",
				label: trans("unicorn.nuxt.editor.action.add.column.after")
			},
			{
				kind: "deleteColumn",
				icon: "i-lucide-table-columns-split",
				label: trans("unicorn.nuxt.editor.action.delete.column")
			},
			{
				kind: "toggleHeaderRow",
				icon: "i-lucide-heading",
				label: trans("unicorn.nuxt.editor.action.toggle.header.row")
			},
			{
				kind: "mergeCells",
				icon: "i-lucide-table-cells-merge",
				label: trans("unicorn.nuxt.editor.action.merge.cells")
			},
			{
				kind: "splitCell",
				icon: "i-lucide-table-cells-split",
				label: trans("unicorn.nuxt.editor.action.split.cell")
			},
			{
				kind: "deleteTable",
				icon: "i-lucide-trash",
				label: trans("unicorn.nuxt.editor.action.delete.table"),
				color: "error"
			}
		]
	}];
	const menuGroups = [
		[
			[
				"addRowBefore",
				"i-lucide-arrow-up-from-line",
				trans("unicorn.nuxt.editor.action.add.row.above")
			],
			[
				"addRowAfter",
				"i-lucide-arrow-down-from-line",
				trans("unicorn.nuxt.editor.action.add.row.below")
			],
			[
				"deleteRow",
				"i-lucide-table-rows-split",
				trans("unicorn.nuxt.editor.action.delete.row")
			],
			[
				"toggleHeaderRow",
				"i-lucide-heading",
				trans("unicorn.nuxt.editor.action.toggle.header.row")
			]
		],
		[
			[
				"addColumnBefore",
				"i-lucide-arrow-left-from-line",
				trans("unicorn.nuxt.editor.action.add.column.before")
			],
			[
				"addColumnAfter",
				"i-lucide-arrow-right-from-line",
				trans("unicorn.nuxt.editor.action.add.column.after")
			],
			[
				"deleteColumn",
				"i-lucide-table-columns-split",
				trans("unicorn.nuxt.editor.action.delete.column")
			]
		],
		[[
			"mergeCells",
			"i-lucide-table-cells-merge",
			trans("unicorn.nuxt.editor.action.merge.cells")
		], [
			"splitCell",
			"i-lucide-table-cells-split",
			trans("unicorn.nuxt.editor.action.split.cell")
		]],
		[[
			"deleteTable",
			"i-lucide-trash",
			trans("unicorn.nuxt.editor.action.delete.table"),
			true
		]]
	];
	const scopes = {
		cell: [2],
		row: [0],
		column: [1]
	};
	const customGroups = {
		row: [
			[
				"moveRowUp",
				"i-lucide-move-up",
				trans("unicorn.nuxt.editor.action.move.row.up")
			],
			[
				"moveRowDown",
				"i-lucide-move-down",
				trans("unicorn.nuxt.editor.action.move.row.down")
			],
			[
				"duplicateRow",
				"i-lucide-copy-plus",
				trans("unicorn.nuxt.editor.action.duplicate.row")
			]
		],
		column: [
			[
				"moveColumnLeft",
				"i-lucide-move-left",
				trans("unicorn.nuxt.editor.action.move.column.left")
			],
			[
				"moveColumnRight",
				"i-lucide-move-right",
				trans("unicorn.nuxt.editor.action.move.column.right")
			],
			[
				"duplicateColumn",
				"i-lucide-copy-plus",
				trans("unicorn.nuxt.editor.action.duplicate.column")
			]
		]
	};
	const alignmentMenu = (ed) => ({
		icon: "i-lucide-align-center",
		label: trans("unicorn.nuxt.editor.action.alignment"),
		children: [[
			[
				"left",
				"i-lucide-align-left",
				trans("unicorn.nuxt.editor.action.align.left")
			],
			[
				"center",
				"i-lucide-align-center",
				trans("unicorn.nuxt.editor.action.align.center")
			],
			[
				"right",
				"i-lucide-align-right",
				trans("unicorn.nuxt.editor.action.align.right")
			]
		].map(([value, icon, label]) => ({
			icon,
			label,
			onSelect: () => {
				setCellAttrs(ed, "cell", { textAlign: value });
			}
		})), [
			[
				"top",
				"i-lucide-align-vertical-justify-start",
				trans("unicorn.nuxt.editor.action.align.top")
			],
			[
				"middle",
				"i-lucide-align-vertical-justify-center",
				trans("unicorn.nuxt.editor.action.align.middle")
			],
			[
				"bottom",
				"i-lucide-align-vertical-justify-end",
				trans("unicorn.nuxt.editor.action.align.bottom")
			]
		].map(([value, icon, label]) => ({
			icon,
			label,
			onSelect: () => {
				setCellAttrs(ed, "cell", { verticalAlign: value });
			}
		}))]
	});
	const colorsMenu = (ed, scope) => createColorMenu(colors, (kind, color) => {
		setCellAttrs(ed, scope, kind === "text" ? { textColor: color } : { backgroundColor: color && toBackground(color) });
	});
	const toItems = (ed, group) => group.map(([kind, icon, label, danger]) => ({
		icon,
		label,
		color: danger ? "error" : void 0,
		disabled: kind in custom ? !canCustom(ed, kind) : !canRun(ed, kind),
		onSelect: () => {
			if (kind in custom) runCustom(ed, kind);
			else commands[kind](ed).run();
		}
	}));
	const canCustom = (ed, kind) => {
		const ctx = getContext(ed.state);
		return !!ctx && !!custom[kind](ctx);
	};
	const menuItems = (ed, scope = "cell") => {
		const groups = scopes[scope].map((i) => toItems(ed, menuGroups[i]));
		if (scope === "cell") return [
			...groups,
			[alignmentMenu(ed), ...colorsMenu(ed, "cell")],
			toItems(ed, menuGroups[3])
		];
		return [
			...groups,
			toItems(ed, customGroups[scope]),
			colorsMenu(ed, scope)
		];
	};
	return {
		extensions: [
			TableKit.configure({
				table: { resizable: true },
				tableCell: false,
				tableHeader: false
			}),
			withCellAttrs(TableCell),
			withCellAttrs(TableHeader)
		],
		handlers,
		toolbarGroup,
		menuItems
	};
}
function canRun(ed, kind) {
	const can = ed.can();
	return kind === "insertTable" ? can.insertTable({
		rows: 3,
		cols: 3,
		withHeaderRow: true
	}) : can[kind]();
}
// ../../../../node_modules/@social-embed/lib/dist/lib.js
var s = /^(?:(?:https?):)?(?:\/\/)?(?:www\.)?(?:(?:dailymotion\.com(?:\/embed)?\/video)|dai\.ly)\/([a-zA-Z0-9]+)(?:_[\w_-]+)?(?:\?playlist=[a-zA-Z0-9]+)?$/;
var p = (e) => e.match(s)?.[1] ?? "";
var w = (e) => `https://www.dailymotion.com/embed/video/${e}`;
var f = {
	/**
	* Checks whether a given URL matches the DailyMotion pattern.
	*
	* @param url - The URL to test for DailyMotion compatibility.
	* @returns `true` if the URL belongs to DailyMotion, otherwise `false`.
	*/
	canParseUrl(e) {
		return s.test(e);
	},
	/**
	* Builds an embed URL for a given DailyMotion ID.
	*
	* @param id - The DailyMotion video ID.
	* @returns A fully embeddable iframe URL for DailyMotion.
	*/
	getEmbedUrlFromId(e) {
		return w(e);
	},
	/**
	* Extracts the ID from a recognized DailyMotion URL.
	*
	* @param url - The DailyMotion URL string.
	* @returns The video ID found in the URL.
	*/
	getIdFromUrl(e) {
		return p(e);
	},
	/** @inheritdoc */
	name: "DailyMotion"
};
var i = /^(?:(?:https?):)?(?:\/\/)?(?:www\.)?edpuzzle.com[=/]media\/([-\w]+)/;
var y = (e) => {
	if (e) {
		if (e?.length > 1e3) throw new Error("URL too long");
		return e.match(i)?.[1] ?? "";
	}
	return "";
};
var h$1 = (e) => `https://edpuzzle.com/embed/media/${e}`;
var b = {
	/**
	* Checks if the given URL belongs to EdPuzzle.
	*
	* @param url - A string potentially matching EdPuzzle.
	* @returns `true` if EdPuzzle is recognized; otherwise `false`.
	*/
	canParseUrl(e) {
		return i.test(e);
	},
	/**
	* Builds an embeddable EdPuzzle URL from the given media ID.
	*
	* @param id - The EdPuzzle media ID.
	* @returns A full embed URL (e.g. `https://edpuzzle.com/embed/media/<id>`).
	*/
	getEmbedUrlFromId(e) {
		return h$1(e);
	},
	/**
	* Extracts the EdPuzzle ID from the recognized EdPuzzle URL.
	*
	* @param url - The EdPuzzle media URL.
	* @returns The extracted EdPuzzle ID.
	*/
	getIdFromUrl(e) {
		return y(e);
	},
	/** @inheritdoc */
	name: "EdPuzzle"
};
var d = /^(?:(?:https?):)?(?:\/\/)?(?:www\.)?loom.com[=/]share\/([-\w]+)/;
var I = (e) => {
	if (e) {
		if (e.length > 1e3) throw new Error("URL too long");
		return e.match(d)?.[1] ?? "";
	}
	return "";
};
var v = (e) => `https://www.loom.com/embed/${e}`;
var F = {
	/**
	* Returns `true` if the provided URL matches the Loom share pattern.
	*
	* @param url - The URL to test for Loom compatibility.
	* @returns `true` if Loom recognized; otherwise `false`.
	*/
	canParseUrl(e) {
		return d.test(e);
	},
	/**
	* Builds an embeddable Loom URL from a given Loom video ID.
	*
	* @param id - The Loom ID (e.g. `"e883f70b219a49f6ba7fbeac71a72604"`).
	* @returns The final embed URL (e.g. `https://www.loom.com/embed/<id>`).
	*/
	getEmbedUrlFromId(e) {
		return v(e);
	},
	/**
	* Extracts the Loom video ID from a recognized Loom URL.
	*
	* @param url - The shared Loom link.
	* @returns The parsed Loom video ID.
	*/
	getIdFromUrl(e) {
		return I(e);
	},
	/** @inheritdoc */
	name: "Loom"
};
var n = [
	"track",
	"album",
	"playlist",
	"artist",
	"show",
	"episode"
];
var m = /*@__PURE__*/ new RegExp(`^(?:(?:https?):)?(?:\\/\\/)?(?:embed\\.|open\\.)?spotify\\.com\\/(?:(${/*@__PURE__*/ n.join("|")})\\/)([-\\w]{22})(?:\\?si=[_\\-\\w]{22})?`);
var c = /*@__PURE__*/ new RegExp(`^spotify:(?:(${/*@__PURE__*/ n.join("|")}):)([-\\w]{22})`);
function E(e) {
	const r = e.match(m) || e.match(c);
	if (!r) return ["", ""];
	const t = r[1] ?? "";
	return [r[2] ?? "", t];
}
function P(e, ...r) {
	const t = typeof r[0] == "string" ? r[0] : "";
	return `https://open.spotify.com/embed/${n.includes(t) ? t : "track"}/${e}`;
}
var R = {
	/**
	* Determines if the given URL or URI matches a recognized Spotify pattern.
	*
	* @param url - A string that could point to a Spotify resource.
	* @returns `true` if the pattern matches, otherwise `false`.
	*/
	canParseUrl(e) {
		return m.test(e) || c.test(e);
	},
	/**
	* Builds an embeddable Spotify URL from an ID plus optional arguments (e.g. type).
	*
	* @param id - The 22-char Spotify ID.
	* @param args - The first arg may be the content type (`track`, `album`, `playlist`, etc.).
	* @returns The final embed URL, e.g. `"https://open.spotify.com/embed/track/<id>"`.
	*/
	getEmbedUrlFromId(e, ...r) {
		return P(e, ...r);
	},
	/**
	* Extracts the ID and type from a recognized Spotify URL or `spotify:` URI.
	*
	* @param url - The Spotify link.
	* @returns `[id, type]` if matched, otherwise `["", ""]`.
	*/
	getIdFromUrl(e) {
		return E(e);
	},
	/** @inheritdoc */
	name: "Spotify"
};
var a = /(?:(?:https?):)?(?:\/\/)?(?:www\.|player\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^/]*)\/videos\/|video\/|)(\d+)(?:|\/\?)/;
var z = (e) => e.match(a)?.[1] ?? "";
var T = (e) => `https://player.vimeo.com/video/${e}`;
var S = {
	/**
	* Determines if the given URL matches the Vimeo pattern.
	*
	* @param url - The URL string to test.
	* @returns `true` if the URL is recognized as Vimeo; otherwise `false`.
	*/
	canParseUrl(e) {
		return a.test(e);
	},
	/**
	* Builds an embeddable Vimeo URL from a numeric video ID.
	*
	* @param id - The numeric Vimeo ID.
	* @returns A fully embeddable URL for use in `<iframe src="...">`.
	*/
	getEmbedUrlFromId(e) {
		return T(e);
	},
	/**
	* Extracts the Vimeo video ID from a recognized URL.
	*
	* @param url - The Vimeo URL.
	* @returns The numeric video ID.
	*/
	getIdFromUrl(e) {
		return z(e);
	},
	/** @inheritdoc */
	name: "Vimeo"
};
var l = /^(?:(?:https?):)?(?:\/\/)?(?:www|fast|support\.)?(?:wistia.com|wi.st)[=/](?:medias|embed)\/([-\w]+)/;
var x = (e) => {
	if (e) {
		if (e.length > 1e3) throw new Error("URL too long");
		return e.match(l)?.[1] ?? "";
	}
	return "";
};
var $ = (e) => `https://fast.wistia.net/embed/iframe/${e}`;
var A = {
	/**
	* Checks if a URL is recognized as a Wistia link by testing the pattern {@link wistiaUrlRegex}.
	*
	* @param url - The string to test.
	* @returns `true` if it matches Wistia patterns, otherwise `false`.
	*/
	canParseUrl(e) {
		return l.test(e);
	},
	/**
	* Constructs a Wistia embed URL given a media ID.
	*
	* @param id - The Wistia media ID.
	* @returns An `<iframe>`-friendly URL (e.g. `https://fast.wistia.net/embed/iframe/<id>`).
	*/
	getEmbedUrlFromId(e) {
		return $(e);
	},
	/**
	* Extracts the Wistia media ID from a recognized Wistia URL.
	*
	* @param url - The shared Wistia link.
	* @returns The extracted Wistia ID (e.g. `"26sk4lmiix"`).
	*/
	getIdFromUrl(e) {
		return x(e);
	},
	/** @inheritdoc */
	name: "Wistia"
};
var u = /^(?:(?:https?):)?(?:\/\/)?(?:www\.)?(?:youtube(?:-nocookie)?\.com|youtu\.be)(?:\/(?:watch\?v=|shorts\/)?)?([a-zA-Z0-9_-]{11})(?:[?&#]|$)/;
var Y = (e) => e ? e.match(u)?.[1] ?? "" : "";
var _ = (e) => `https://www.youtube.com/embed/${e}`;
var M = {
	/**
	* Determines if a given URL is recognized as a YouTube link.
	*
	* @param url - The string to evaluate.
	* @returns `true` if the URL matches YouTube patterns; otherwise `false`.
	*/
	canParseUrl(e) {
		return u.test(e);
	},
	/**
	* Builds a full YouTube embed URL (e.g. `https://www.youtube.com/embed/<id>`).
	*
	* @param id - The 11-char YouTube video ID.
	* @returns A fully embeddable `<iframe>` URL for YouTube.
	*/
	getEmbedUrlFromId(e) {
		return _(e);
	},
	/**
	* Extracts the 11-char YouTube ID from a recognized YouTube URL.
	*
	* @param url - The potential YouTube link.
	* @returns The extracted video ID or an empty string if none found.
	*/
	getIdFromUrl(e) {
		return Y(e);
	},
	/** @inheritdoc */
	name: "YouTube"
};
function B(e) {
	if (e) return U.findProviderByUrl(e);
}
function N(e) {
	const r = B(e);
	if (!r) return "";
	const t = r.getIdFromUrl(e);
	if (Array.isArray(t)) {
		const [o, ...g] = t;
		return o ? r.getEmbedUrlFromId(o, ...g) : "";
	}
	return r.getEmbedUrlFromId(t);
}
var D = class {
	/**
	* Creates an instance of {@link EmbedProviderRegistry}.
	*/
	constructor() {
		this.providers = /* @__PURE__ */ new Map();
	}
	/**
	* Registers a provider.
	*
	* @remarks
	* If a provider with the same name is already present, it will be overwritten.
	*
	* @param provider - The {@link EmbedProvider} instance to register.
	*/
	register(r) {
		this.providers.set(r.name, r);
	}
	/**
	* Lists all registered providers.
	*
	* @returns An array of all currently registered {@link EmbedProvider} instances.
	*/
	listProviders() {
		return Array.from(this.providers.values());
	}
	/**
	* Retrieves a provider by name.
	*
	* @param name - A provider’s `name` property.
	* @returns The matching {@link EmbedProvider}, or `undefined` if not found.
	*/
	getProviderByName(r) {
		return this.providers.get(r);
	}
	/**
	* Finds the first provider that can parse the given URL.
	*
	* @param url - The URL to analyze.
	* @returns The matching {@link EmbedProvider}, or `undefined` if no provider recognizes it.
	*/
	findProviderByUrl(r) {
		for (const t of this.providers.values()) if (t.canParseUrl(r)) return t;
	}
};
var V = [
	f,
	b,
	F,
	R,
	S,
	A,
	M
];
var U = /*@__PURE__*/ new D();
for (const e of V) U.register(e);
// src/module/nuxt-editor-lib/video-embed.ts
var FILE_RE = /\.(mp4|webm|ogv|ogg|mov|m4v)$/i;
var DEFAULT_RATIO = 56.25;
var num = (v) => v && /^\d+(\.\d+)?(px)?$/.test(v.trim()) ? parseFloat(v) : null;
function parseIframeCode(input) {
	const text = input.trim();
	if (!/^<iframe[\s>]/i.test(text)) return null;
	const body = new DOMParser().parseFromString(text, "text/html").body;
	const el = body.childNodes.length === 1 ? body.firstElementChild : null;
	if (el?.tagName !== "IFRAME") return null;
	let src;
	try {
		src = new URL(el.getAttribute("src") || "", "https://placeholder.invalid");
	} catch {
		return null;
	}
	if (!/^https?:$/.test(src.protocol) || src.hostname === "placeholder.invalid") return null;
	const width = num(el.getAttribute("width"));
	const height = num(el.getAttribute("height"));
	const ratio = width && height ? Math.round(height / width * 1e4) / 100 : null;
	return {
		type: "iframe",
		src: src.href,
		ratio: ratio ?? (height ? null : DEFAULT_RATIO),
		height: ratio ? null : height,
		title: el.getAttribute("title")
	};
}
function parseEmbedInput(input) {
	return parseIframeCode(input) ?? parseVideoUrl(input);
}
function parseVideoUrl(input) {
	let url;
	try {
		url = new URL(input.trim());
	} catch {
		return null;
	}
	if (!/^https?:$/.test(url.protocol)) return null;
	if (FILE_RE.test(url.pathname)) return {
		type: "video",
		src: url.href
	};
	if (url.hostname.replace(/^(www|m)\./, "") === "bilibili.com") {
		const bvid = url.pathname.split("/").find((p) => /^BV\w+$/i.test(p));
		return bvid ? {
			type: "iframe",
			src: `https://player.bilibili.com/player.html?bvid=${bvid}&autoplay=0`
		} : null;
	}
	let src = N(url.href);
	if (!src) return null;
	const start = url.searchParams.get("t") || url.searchParams.get("start");
	if (B(url.href)?.name === "YouTube" && start && /^\d+s?$/.test(start)) src += `?start=${parseInt(start, 10)}`;
	return {
		type: "iframe",
		src
	};
}
function createVideoEmbed({ Node, mergeAttributes, Plugin, PluginKey }) {
	const box = (ratio, height) => "position:relative;width:100%;overflow:hidden;" + (height ? `height:${height}px;` : `padding-bottom:${ratio || DEFAULT_RATIO}%;height:0;`);
	const FILL = "position:absolute;top:0;left:0;width:100%;height:100%;border:0;";
	const ALLOW = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
	const mediaAttrs = (a) => a.type === "video" ? {
		src: a.src,
		controls: "",
		style: FILL
	} : {
		src: a.src,
		style: FILL,
		allowfullscreen: "",
		loading: "lazy",
		allow: ALLOW,
		...a.title ? { title: a.title } : {}
	};
	const build = (a) => {
		const el = document.createElement(a.type === "video" ? "video" : "iframe");
		Object.entries(mediaAttrs(a)).forEach(([k, v]) => el.setAttribute(k, v));
		return el;
	};
	const parseBox = (el) => {
		const media = el.querySelector("iframe, video");
		return media ? {
			src: media.getAttribute("src"),
			type: media.tagName === "VIDEO" ? "video" : "iframe",
			title: media.getAttribute("title"),
			ratio: num(el.getAttribute("data-ratio")),
			height: num(el.getAttribute("data-height"))
		} : false;
	};
	return Node.create({
		name: "videoEmbed",
		group: "block",
		atom: true,
		draggable: true,
		selectable: true,
		addAttributes() {
			return {
				src: {
					default: null,
					rendered: false
				},
				type: {
					default: "iframe",
					rendered: false
				},
				ratio: {
					default: null,
					rendered: false
				},
				height: {
					default: null,
					rendered: false
				},
				title: {
					default: null,
					rendered: false
				}
			};
		},
		parseHTML() {
			return [{
				tag: "p[data-video-embed]",
				priority: 100,
				getAttrs: parseBox
			}, {
				tag: "div[data-video-embed]",
				getAttrs: parseBox
			}];
		},
		renderHTML({ node, HTMLAttributes }) {
			const a = node.attrs;
			const extra = {
				"data-video-embed": "",
				style: box(a.ratio, a.height) + "margin:0 0 1rem;"
			};
			if (a.height) extra["data-height"] = a.height;
			else if (a.ratio) extra["data-ratio"] = a.ratio;
			return [
				"p",
				mergeAttributes(HTMLAttributes, extra),
				[a.type === "video" ? "video" : "iframe", mediaAttrs(a)]
			];
		},
		addNodeView() {
			return ({ node }) => {
				const dom = document.createElement("div");
				dom.setAttribute("data-video-embed", "");
				dom.setAttribute("style", box(node.attrs.ratio, node.attrs.height) + "margin:1rem 0;background:#000;border-radius:.375rem;");
				dom.append(build(node.attrs));
				const overlay = document.createElement("div");
				overlay.setAttribute("style", "position:absolute;inset:0;cursor:grab;");
				dom.append(overlay);
				return {
					dom,
					selectNode: () => {
						dom.style.outline = "2px solid var(--ui-primary, #3b82f6)";
					},
					deselectNode: () => {
						dom.style.outline = "";
					}
				};
			};
		},
		addCommands() {
			return { setVideoEmbed: (input) => ({ commands }) => {
				const source = parseEmbedInput(input);
				return source ? commands.insertContent({
					type: this.name,
					attrs: attrsOf(source)
				}) : false;
			} };
		},
		addStorage() {
			return { key: new PluginKey("videoEmbedPaste") };
		},
		addProseMirrorPlugins() {
			const key = this.storage.key;
			let pending = null;
			return [new Plugin({
				key,
				state: {
					init: () => null,
					apply(tr, value) {
						const meta = tr.getMeta(key);
						if (meta !== void 0) return meta;
						if (value && (tr.docChanged || tr.selection.from !== value.to)) return null;
						return value;
					}
				},
				appendTransaction(_trs, _old, state) {
					if (!pending) return null;
					const { text, source } = pending;
					const { $from, empty } = state.selection;
					if (!empty || $from.parent.textContent !== text || $from.parentOffset !== text.length) return null;
					pending = null;
					return state.tr.setMeta(key, {
						from: $from.start(),
						to: $from.pos,
						source
					});
				},
				props: { handleDOMEvents: { paste(view, event) {
					const text = event.clipboardData?.getData("text/plain")?.trim();
					const source = text ? parseEmbedInput(text) : null;
					const { $from, empty } = view.state.selection;
					pending = null;
					if (source && text && empty && $from.parent.type.name === "paragraph" && !$from.parent.content.size) {
						pending = {
							text,
							source
						};
						setTimeout(() => {
							pending = null;
						}, 0);
					}
					return false;
				} } }
			})];
		}
	});
}
var attrsOf = (s) => ({
	src: s.src,
	type: s.type,
	ratio: s.ratio ?? null,
	height: s.height ?? null,
	title: s.title ?? null
});
// src/css/nuxt-editor.css?inline
var nuxt_editor_default = "/*! tailwindcss v4.3.5 | MIT License | https://tailwindcss.com */\n@layer properties {\n  @supports (((-webkit-hyphens: none)) and (not (margin-trim: block))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {\n    *, :before, :after, ::backdrop {\n      --tw-border-spacing-x: 0;\n      --tw-border-spacing-y: 0;\n      --tw-translate-x: 0;\n      --tw-translate-y: 0;\n      --tw-translate-z: 0;\n      --tw-scale-x: 1;\n      --tw-scale-y: 1;\n      --tw-scale-z: 1;\n      --tw-rotate-x: initial;\n      --tw-rotate-y: initial;\n      --tw-rotate-z: initial;\n      --tw-skew-x: initial;\n      --tw-skew-y: initial;\n      --tw-pan-x: initial;\n      --tw-pan-y: initial;\n      --tw-pinch-zoom: initial;\n      --tw-space-y-reverse: 0;\n      --tw-space-x-reverse: 0;\n      --tw-divide-x-reverse: 0;\n      --tw-border-style: solid;\n      --tw-divide-y-reverse: 0;\n      --tw-gradient-position: initial;\n      --tw-gradient-from: #0000;\n      --tw-gradient-via: #0000;\n      --tw-gradient-to: #0000;\n      --tw-gradient-stops: initial;\n      --tw-gradient-via-stops: initial;\n      --tw-gradient-from-position: 0%;\n      --tw-gradient-via-position: 50%;\n      --tw-gradient-to-position: 100%;\n      --tw-leading: initial;\n      --tw-font-weight: initial;\n      --tw-tracking: initial;\n      --tw-ordinal: initial;\n      --tw-slashed-zero: initial;\n      --tw-numeric-figure: initial;\n      --tw-numeric-spacing: initial;\n      --tw-numeric-fraction: initial;\n      --tw-shadow: 0 0 #0000;\n      --tw-shadow-color: initial;\n      --tw-shadow-alpha: 100%;\n      --tw-inset-shadow: 0 0 #0000;\n      --tw-inset-shadow-color: initial;\n      --tw-inset-shadow-alpha: 100%;\n      --tw-ring-color: initial;\n      --tw-ring-shadow: 0 0 #0000;\n      --tw-inset-ring-color: initial;\n      --tw-inset-ring-shadow: 0 0 #0000;\n      --tw-ring-inset: initial;\n      --tw-ring-offset-width: 0px;\n      --tw-ring-offset-color: #fff;\n      --tw-ring-offset-shadow: 0 0 #0000;\n      --tw-outline-style: solid;\n      --tw-blur: initial;\n      --tw-brightness: initial;\n      --tw-contrast: initial;\n      --tw-grayscale: initial;\n      --tw-hue-rotate: initial;\n      --tw-invert: initial;\n      --tw-opacity: initial;\n      --tw-saturate: initial;\n      --tw-sepia: initial;\n      --tw-drop-shadow: initial;\n      --tw-drop-shadow-color: initial;\n      --tw-drop-shadow-alpha: 100%;\n      --tw-drop-shadow-size: initial;\n      --tw-backdrop-blur: initial;\n      --tw-backdrop-brightness: initial;\n      --tw-backdrop-contrast: initial;\n      --tw-backdrop-grayscale: initial;\n      --tw-backdrop-hue-rotate: initial;\n      --tw-backdrop-invert: initial;\n      --tw-backdrop-opacity: initial;\n      --tw-backdrop-saturate: initial;\n      --tw-backdrop-sepia: initial;\n      --tw-duration: initial;\n      --tw-ease: initial;\n      --tw-content: \"\";\n    }\n  }\n}\n\n@layer theme {\n  :root, :host {\n    --font-sans: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", \"Noto Sans\", Arial,\n    sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\";\n    --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\",\n    monospace;\n    --color-amber-400: oklch(82.8% .189 84.429);\n    --color-amber-500: oklch(76.9% .188 70.08);\n    --color-cyan-400: oklch(78.9% .154 211.53);\n    --color-cyan-500: oklch(71.5% .143 215.221);\n    --color-blue-400: oklch(70.7% .165 254.624);\n    --color-blue-500: oklch(62.3% .214 259.815);\n    --color-violet-400: oklch(70.2% .183 293.541);\n    --color-violet-500: oklch(60.6% .25 292.717);\n    --color-rose-400: oklch(71.2% .194 13.428);\n    --color-rose-500: oklch(64.5% .246 16.439);\n    --color-white: #fff;\n    --spacing: .25rem;\n    --container-xs: 20rem;\n    --container-sm: 24rem;\n    --container-md: 28rem;\n    --container-lg: 32rem;\n    --container-2xl: 42rem;\n    --container-3xl: 48rem;\n    --text-xs: .75rem;\n    --text-xs--line-height: calc(1 / .75);\n    --text-sm: .875rem;\n    --text-sm--line-height: calc(1.25 / .875);\n    --text-base: 1rem;\n    --text-base--line-height: calc(1.5 / 1);\n    --text-lg: 1.125rem;\n    --text-lg--line-height: calc(1.75 / 1.125);\n    --text-xl: 1.25rem;\n    --text-xl--line-height: calc(1.75 / 1.25);\n    --text-2xl: 1.5rem;\n    --text-2xl--line-height: calc(2 / 1.5);\n    --text-3xl: 1.875rem;\n    --text-3xl--line-height: calc(2.25 / 1.875);\n    --text-4xl: 2.25rem;\n    --text-4xl--line-height: calc(2.5 / 2.25);\n    --text-5xl: 3rem;\n    --text-5xl--line-height: 1;\n    --text-7xl: 4.5rem;\n    --text-7xl--line-height: 1;\n    --font-weight-normal: 400;\n    --font-weight-medium: 500;\n    --font-weight-semibold: 600;\n    --font-weight-bold: 700;\n    --tracking-tight: -.025em;\n    --radius-sm: var(--ui-radius);\n    --shadow-sm: 0 1px 3px 0 #0000001a, 0 1px 2px -1px #0000001a;\n    --ease-out: cubic-bezier(0, 0, .2, 1);\n    --ease-in-out: cubic-bezier(.4, 0, .2, 1);\n    --animate-spin: spin 1s linear infinite;\n    --animate-pulse: pulse 2s cubic-bezier(.4, 0, .6, 1) infinite;\n    --blur-sm: 8px;\n    --default-transition-duration: .15s;\n    --default-transition-timing-function: cubic-bezier(.4, 0, .2, 1);\n    --default-font-family: var(--font-sans);\n    --default-mono-font-family: var(--font-mono);\n    --color-old-neutral-50: oklch(98.5% 0 none);\n    --color-old-neutral-100: oklch(97% 0 none);\n    --color-old-neutral-200: oklch(92.2% 0 none);\n    --color-old-neutral-300: oklch(87% 0 none);\n    --color-old-neutral-400: oklch(70.8% 0 none);\n    --color-old-neutral-500: oklch(55.6% 0 none);\n    --color-old-neutral-600: oklch(43.9% 0 none);\n    --color-old-neutral-700: oklch(37.1% 0 none);\n    --color-old-neutral-800: oklch(26.9% 0 none);\n    --color-old-neutral-900: oklch(20.5% 0 none);\n    --color-old-neutral-950: oklch(14.5% 0 none);\n  }\n\n  :host, :root {\n    --ui-header-height: 4rem;\n    --ui-radius: .25rem;\n    --ui-container: 80rem;\n  }\n\n  .light, :host, :root {\n    --ui-text-dimmed: var(--ui-color-neutral-400);\n    --ui-text-muted: var(--ui-color-neutral-500);\n    --ui-text-toned: var(--ui-color-neutral-600);\n    --ui-text: var(--ui-color-neutral-700);\n    --ui-text-highlighted: var(--ui-color-neutral-900);\n    --ui-text-inverted: #fff;\n    --ui-bg: #fff;\n    --ui-bg-muted: var(--ui-color-neutral-50);\n    --ui-bg-elevated: var(--ui-color-neutral-100);\n    --ui-bg-accented: var(--ui-color-neutral-200);\n    --ui-bg-inverted: var(--ui-color-neutral-900);\n    --ui-border: var(--ui-color-neutral-200);\n    --ui-border-muted: var(--ui-color-neutral-200);\n    --ui-border-accented: var(--ui-color-neutral-300);\n    --ui-border-inverted: var(--ui-color-neutral-900);\n    --ui-chart-1: var(--ui-primary);\n    --ui-chart-2: var(--color-blue-500, oklch(62.3% .214 259.815));\n    --ui-chart-3: var(--color-violet-500, oklch(60.6% .25 292.717));\n    --ui-chart-4: var(--color-amber-500, oklch(76.9% .188 70.08));\n    --ui-chart-5: var(--color-rose-500, oklch(64.5% .246 16.439));\n    --ui-chart-6: var(--color-cyan-500, oklch(71.5% .143 215.221));\n  }\n\n  .dark {\n    --ui-text-dimmed: var(--ui-color-neutral-500);\n    --ui-text-muted: var(--ui-color-neutral-400);\n    --ui-text-toned: var(--ui-color-neutral-300);\n    --ui-text: var(--ui-color-neutral-200);\n    --ui-text-highlighted: #fff;\n    --ui-text-inverted: var(--ui-color-neutral-900);\n    --ui-bg: var(--ui-color-neutral-900);\n    --ui-bg-muted: var(--ui-color-neutral-800);\n    --ui-bg-elevated: var(--ui-color-neutral-800);\n    --ui-bg-accented: var(--ui-color-neutral-700);\n    --ui-bg-inverted: #fff;\n    --ui-border: var(--ui-color-neutral-800);\n    --ui-border-muted: var(--ui-color-neutral-700);\n    --ui-border-accented: var(--ui-color-neutral-700);\n    --ui-border-inverted: #fff;\n    --ui-chart-1: var(--ui-primary);\n    --ui-chart-2: var(--color-blue-400, oklch(70.7% .165 254.624));\n    --ui-chart-3: var(--color-violet-400, oklch(70.2% .183 293.541));\n    --ui-chart-4: var(--color-amber-400, oklch(82.8% .189 84.429));\n    --ui-chart-5: var(--color-rose-400, oklch(71.2% .194 13.428));\n    --ui-chart-6: var(--color-cyan-400, oklch(78.9% .154 211.53));\n  }\n}\n\n@layer base {\n  *, :after, :before, ::backdrop {\n    box-sizing: border-box;\n    border: 0 solid;\n    margin: 0;\n    padding: 0;\n  }\n\n  ::file-selector-button {\n    box-sizing: border-box;\n    border: 0 solid;\n    margin: 0;\n    padding: 0;\n  }\n\n  html, :host {\n    -webkit-text-size-adjust: 100%;\n    tab-size: 4;\n    line-height: 1.5;\n    font-family: var(--default-font-family, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", \"Noto Sans\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\");\n    font-feature-settings: var(--default-font-feature-settings, normal);\n    font-variation-settings: var(--default-font-variation-settings, normal);\n    -webkit-tap-highlight-color: transparent;\n  }\n\n  hr {\n    height: 0;\n    color: inherit;\n    border-top-width: 1px;\n  }\n\n  abbr:where([title]) {\n    -webkit-text-decoration: underline dotted;\n    text-decoration: underline dotted;\n  }\n\n  h1, h2, h3, h4, h5, h6 {\n    font-size: inherit;\n    font-weight: inherit;\n  }\n\n  a {\n    color: inherit;\n    -webkit-text-decoration: inherit;\n    -webkit-text-decoration: inherit;\n    -webkit-text-decoration: inherit;\n    text-decoration: inherit;\n  }\n\n  b, strong {\n    font-weight: bolder;\n  }\n\n  code, kbd, samp, pre {\n    font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace);\n    font-feature-settings: var(--default-mono-font-feature-settings, normal);\n    font-variation-settings: var(--default-mono-font-variation-settings, normal);\n    font-size: 1em;\n  }\n\n  small {\n    font-size: 80%;\n  }\n\n  sub, sup {\n    vertical-align: baseline;\n    font-size: 75%;\n    line-height: 0;\n    position: relative;\n  }\n\n  sub {\n    bottom: -.25em;\n  }\n\n  sup {\n    top: -.5em;\n  }\n\n  table {\n    text-indent: 0;\n    border-color: inherit;\n    border-collapse: collapse;\n  }\n\n  :-moz-focusring:where(:not(iframe)) {\n    outline: auto;\n  }\n\n  progress {\n    vertical-align: baseline;\n  }\n\n  summary {\n    display: list-item;\n  }\n\n  ol, ul, menu {\n    list-style: none;\n  }\n\n  img, svg, video, canvas, audio, iframe, embed, object {\n    vertical-align: middle;\n    display: block;\n  }\n\n  img, video {\n    max-width: 100%;\n    height: auto;\n  }\n\n  button, input, select, optgroup, textarea {\n    font: inherit;\n    font-feature-settings: inherit;\n    font-variation-settings: inherit;\n    letter-spacing: inherit;\n    color: inherit;\n    opacity: 1;\n    background-color: #0000;\n    border-radius: 0;\n  }\n\n  ::file-selector-button {\n    font: inherit;\n    font-feature-settings: inherit;\n    font-variation-settings: inherit;\n    letter-spacing: inherit;\n    color: inherit;\n    opacity: 1;\n    background-color: #0000;\n    border-radius: 0;\n  }\n\n  :where(select:is([multiple], [size])) optgroup {\n    font-weight: bolder;\n  }\n\n  :where(select:is([multiple], [size])) optgroup option {\n    padding-inline-start: 20px;\n  }\n\n  ::file-selector-button {\n    margin-inline-end: 4px;\n  }\n\n  ::placeholder {\n    opacity: 1;\n  }\n\n  @supports (not ((-webkit-appearance: -apple-pay-button))) or (contain-intrinsic-size: 1px) {\n    ::placeholder {\n      color: currentColor;\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      ::placeholder {\n        color: color-mix(in oklab, currentcolor 50%, transparent);\n      }\n    }\n  }\n\n  textarea {\n    resize: vertical;\n  }\n\n  ::-webkit-search-decoration {\n    -webkit-appearance: none;\n  }\n\n  ::-webkit-date-and-time-value {\n    min-height: 1lh;\n    text-align: inherit;\n  }\n\n  ::-webkit-datetime-edit {\n    display: inline-flex;\n  }\n\n  ::-webkit-datetime-edit-fields-wrapper {\n    padding: 0;\n  }\n\n  ::-webkit-datetime-edit {\n    padding-block: 0;\n  }\n\n  ::-webkit-datetime-edit-year-field {\n    padding-block: 0;\n  }\n\n  ::-webkit-datetime-edit-month-field {\n    padding-block: 0;\n  }\n\n  ::-webkit-datetime-edit-day-field {\n    padding-block: 0;\n  }\n\n  ::-webkit-datetime-edit-hour-field {\n    padding-block: 0;\n  }\n\n  ::-webkit-datetime-edit-minute-field {\n    padding-block: 0;\n  }\n\n  ::-webkit-datetime-edit-second-field {\n    padding-block: 0;\n  }\n\n  ::-webkit-datetime-edit-millisecond-field {\n    padding-block: 0;\n  }\n\n  ::-webkit-datetime-edit-meridiem-field {\n    padding-block: 0;\n  }\n\n  ::-webkit-calendar-picker-indicator {\n    line-height: 1;\n  }\n\n  :-moz-ui-invalid {\n    box-shadow: none;\n  }\n\n  button, input:where([type=\"button\"], [type=\"reset\"], [type=\"submit\"]) {\n    appearance: button;\n  }\n\n  ::file-selector-button {\n    appearance: button;\n  }\n\n  ::-webkit-inner-spin-button {\n    height: auto;\n  }\n\n  ::-webkit-outer-spin-button {\n    height: auto;\n  }\n\n  [hidden]:where(:not([hidden=\"until-found\"])) {\n    display: none !important;\n  }\n\n  body {\n    background-color: var(--ui-bg);\n    color: var(--ui-text);\n    -webkit-font-smoothing: antialiased;\n    -moz-osx-font-smoothing: grayscale;\n    color-scheme: light;\n  }\n\n  body:where(.dark, .dark *) {\n    color-scheme: dark;\n  }\n\n  a:focus-visible {\n    outline-offset: 0;\n  }\n}\n\n@layer components;\n\n@layer utilities {\n  .\\@container {\n    container-type: inline-size;\n  }\n\n  .pointer-events-auto {\n    pointer-events: auto;\n  }\n\n  .pointer-events-none {\n    pointer-events: none;\n  }\n\n  .collapse {\n    visibility: collapse;\n  }\n\n  .invisible {\n    visibility: hidden;\n  }\n\n  .visible {\n    visibility: visible;\n  }\n\n  .sr-only {\n    clip-path: inset(50%);\n    white-space: nowrap;\n    border-width: 0;\n    width: 1px;\n    height: 1px;\n    margin: -1px;\n    padding: 0;\n    position: absolute;\n    overflow: hidden;\n  }\n\n  .not-sr-only {\n    clip-path: none;\n    white-space: normal;\n    width: auto;\n    height: auto;\n    margin: 0;\n    padding: 0;\n    position: static;\n    overflow: visible;\n  }\n\n  .absolute {\n    position: absolute;\n  }\n\n  .fixed {\n    position: fixed;\n  }\n\n  .relative {\n    position: relative;\n  }\n\n  .static {\n    position: static;\n  }\n\n  .sticky {\n    position: sticky;\n  }\n\n  .inset-0 {\n    inset: 0;\n  }\n\n  .inset-x-0 {\n    inset-inline: 0;\n  }\n\n  .inset-x-1 {\n    inset-inline: var(--spacing);\n  }\n\n  .inset-x-4 {\n    inset-inline: calc(var(--spacing) * 4);\n  }\n\n  .inset-y-0 {\n    inset-block: 0;\n  }\n\n  .inset-y-1 {\n    inset-block: var(--spacing);\n  }\n\n  .inset-y-1\\.5 {\n    inset-block: calc(var(--spacing) * 1.5);\n  }\n\n  .inset-y-2 {\n    inset-block: calc(var(--spacing) * 2);\n  }\n\n  .inset-y-3 {\n    inset-block: calc(var(--spacing) * 3);\n  }\n\n  .inset-y-4 {\n    inset-block: calc(var(--spacing) * 4);\n  }\n\n  .-start-px {\n    inset-inline-start: -1px;\n  }\n\n  .start-0 {\n    inset-inline-start: calc(var(--spacing) * 0);\n  }\n\n  .start-4 {\n    inset-inline-start: calc(var(--spacing) * 4);\n  }\n\n  .start-32 {\n    inset-inline-start: calc(var(--spacing) * 32);\n  }\n\n  .start-\\[calc\\(--spacing\\(4\\)-1px\\)\\] {\n    inset-inline-start: calc(calc(var(--spacing) * 4) - 1px);\n  }\n\n  .start-\\[calc\\(50\\%\\+16px\\)\\] {\n    inset-inline-start: calc(50% + 16px);\n  }\n\n  .start-\\[calc\\(50\\%\\+20px\\)\\] {\n    inset-inline-start: calc(50% + 20px);\n  }\n\n  .start-\\[calc\\(50\\%\\+28px\\)\\] {\n    inset-inline-start: calc(50% + 28px);\n  }\n\n  .start-\\[calc\\(50\\%\\+32px\\)\\] {\n    inset-inline-start: calc(50% + 32px);\n  }\n\n  .start-\\[calc\\(50\\%\\+36px\\)\\] {\n    inset-inline-start: calc(50% + 36px);\n  }\n\n  .start-\\[calc\\(50\\%-1px\\)\\] {\n    inset-inline-start: calc(50% - 1px);\n  }\n\n  .-end-1 {\n    inset-inline-end: calc(var(--spacing) * -1);\n  }\n\n  .-end-1\\.5 {\n    inset-inline-end: calc(var(--spacing) * -1.5);\n  }\n\n  .end-0 {\n    inset-inline-end: calc(var(--spacing) * 0);\n  }\n\n  .end-4 {\n    inset-inline-end: calc(var(--spacing) * 4);\n  }\n\n  .end-\\[calc\\(-50\\%\\+16px\\)\\] {\n    inset-inline-end: calc(16px - 50%);\n  }\n\n  .end-\\[calc\\(-50\\%\\+20px\\)\\] {\n    inset-inline-end: calc(20px - 50%);\n  }\n\n  .end-\\[calc\\(-50\\%\\+28px\\)\\] {\n    inset-inline-end: calc(28px - 50%);\n  }\n\n  .end-\\[calc\\(-50\\%\\+32px\\)\\] {\n    inset-inline-end: calc(32px - 50%);\n  }\n\n  .end-\\[calc\\(-50\\%\\+36px\\)\\] {\n    inset-inline-end: calc(36px - 50%);\n  }\n\n  .-top-1 {\n    top: calc(var(--spacing) * -1);\n  }\n\n  .-top-1\\.5 {\n    top: calc(var(--spacing) * -1.5);\n  }\n\n  .-top-8 {\n    top: calc(var(--spacing) * -8);\n  }\n\n  .top-0 {\n    top: 0;\n  }\n\n  .top-1 {\n    top: var(--spacing);\n  }\n\n  .top-1\\/2 {\n    top: 50%;\n  }\n\n  .top-4 {\n    top: calc(var(--spacing) * 4);\n  }\n\n  .top-\\[30px\\] {\n    top: 30px;\n  }\n\n  .top-\\[38px\\] {\n    top: 38px;\n  }\n\n  .top-\\[46px\\] {\n    top: 46px;\n  }\n\n  .top-\\[50\\%\\] {\n    top: 50%;\n  }\n\n  .top-\\[54px\\] {\n    top: 54px;\n  }\n\n  .top-\\[62px\\] {\n    top: 62px;\n  }\n\n  .top-\\[86\\%\\] {\n    top: 86%;\n  }\n\n  .top-\\[calc\\(50\\%-2px\\)\\] {\n    top: calc(50% - 2px);\n  }\n\n  .top-full {\n    top: 100%;\n  }\n\n  .right-0 {\n    right: 0;\n  }\n\n  .right-1 {\n    right: var(--spacing);\n  }\n\n  .right-1\\/2 {\n    right: 50%;\n  }\n\n  .right-4 {\n    right: calc(var(--spacing) * 4);\n  }\n\n  .-bottom-7 {\n    bottom: calc(var(--spacing) * -7);\n  }\n\n  .-bottom-\\[10px\\] {\n    bottom: -10px;\n  }\n\n  .-bottom-px {\n    bottom: -1px;\n  }\n\n  .bottom-0 {\n    bottom: 0;\n  }\n\n  .bottom-4 {\n    bottom: calc(var(--spacing) * 4);\n  }\n\n  .left-\\(--reka-navigation-menu-viewport-left\\) {\n    left: var(--reka-navigation-menu-viewport-left);\n  }\n\n  .left-0 {\n    left: 0;\n  }\n\n  .left-1 {\n    left: var(--spacing);\n  }\n\n  .left-1\\/2 {\n    left: 50%;\n  }\n\n  .left-4 {\n    left: calc(var(--spacing) * 4);\n  }\n\n  .isolate {\n    isolation: isolate;\n  }\n\n  .isolation-auto {\n    isolation: auto;\n  }\n\n  .z-\\(--index\\) {\n    z-index: var(--index);\n  }\n\n  .z-\\(--reka-rating-item-step-z-index\\) {\n    z-index: var(--reka-rating-item-step-z-index);\n  }\n\n  .z-1 {\n    z-index: 1;\n  }\n\n  .z-2 {\n    z-index: 2;\n  }\n\n  .z-10 {\n    z-index: 10;\n  }\n\n  .z-20 {\n    z-index: 20;\n  }\n\n  .z-50 {\n    z-index: 50;\n  }\n\n  .z-\\[1\\] {\n    z-index: 1;\n  }\n\n  .z-\\[100\\] {\n    z-index: 100;\n  }\n\n  .order-first {\n    order: -9999;\n  }\n\n  .order-last {\n    order: 9999;\n  }\n\n  .col-start-1 {\n    grid-column-start: 1;\n  }\n\n  .row-start-1 {\n    grid-row-start: 1;\n  }\n\n  .container {\n    width: 100%;\n  }\n\n  @media (min-width: 40rem) {\n    .container {\n      max-width: 40rem;\n    }\n  }\n\n  @media (min-width: 48rem) {\n    .container {\n      max-width: 48rem;\n    }\n  }\n\n  @media (min-width: 64rem) {\n    .container {\n      max-width: 64rem;\n    }\n  }\n\n  @media (min-width: 80rem) {\n    .container {\n      max-width: 80rem;\n    }\n  }\n\n  @media (min-width: 96rem) {\n    .container {\n      max-width: 96rem;\n    }\n  }\n\n  .m-0 {\n    margin: 0;\n  }\n\n  .m-0\\.5 {\n    margin: calc(var(--spacing) * .5);\n  }\n\n  .m-3 {\n    margin: calc(var(--spacing) * 3);\n  }\n\n  .-mx-1 {\n    margin-inline: calc(var(--spacing) * -1);\n  }\n\n  .-mx-4 {\n    margin-inline: calc(var(--spacing) * -4);\n  }\n\n  .mx-1 {\n    margin-inline: var(--spacing);\n  }\n\n  .mx-3 {\n    margin-inline: calc(var(--spacing) * 3);\n  }\n\n  .mx-auto {\n    margin-inline: auto;\n  }\n\n  .my-1 {\n    margin-block: var(--spacing);\n  }\n\n  .my-2 {\n    margin-block: calc(var(--spacing) * 2);\n  }\n\n  .my-3 {\n    margin-block: calc(var(--spacing) * 3);\n  }\n\n  .-ms-1 {\n    margin-inline-start: calc(var(--spacing) * -1);\n  }\n\n  .-ms-1\\.5 {\n    margin-inline-start: calc(var(--spacing) * -1.5);\n  }\n\n  .-ms-4 {\n    margin-inline-start: calc(var(--spacing) * -4);\n  }\n\n  .-ms-\\[8\\.5px\\] {\n    margin-inline-start: -8.5px;\n  }\n\n  .-ms-px {\n    margin-inline-start: -1px;\n  }\n\n  .ms-1 {\n    margin-inline-start: var(--spacing);\n  }\n\n  .ms-2 {\n    margin-inline-start: calc(var(--spacing) * 2);\n  }\n\n  .ms-3 {\n    margin-inline-start: calc(var(--spacing) * 3);\n  }\n\n  .ms-4 {\n    margin-inline-start: calc(var(--spacing) * 4);\n  }\n\n  .ms-4\\.5 {\n    margin-inline-start: calc(var(--spacing) * 4.5);\n  }\n\n  .ms-5 {\n    margin-inline-start: calc(var(--spacing) * 5);\n  }\n\n  .ms-5\\.5 {\n    margin-inline-start: calc(var(--spacing) * 5.5);\n  }\n\n  .ms-6 {\n    margin-inline-start: calc(var(--spacing) * 6);\n  }\n\n  .ms-auto {\n    margin-inline-start: auto;\n  }\n\n  .-me-0 {\n    margin-inline-end: 0;\n  }\n\n  .-me-0\\.5 {\n    margin-inline-end: calc(var(--spacing) * -.5);\n  }\n\n  .-me-1 {\n    margin-inline-end: calc(var(--spacing) * -1);\n  }\n\n  .-me-1\\.5 {\n    margin-inline-end: calc(var(--spacing) * -1.5);\n  }\n\n  .-me-2 {\n    margin-inline-end: calc(var(--spacing) * -2);\n  }\n\n  .me-1 {\n    margin-inline-end: var(--spacing);\n  }\n\n  .me-1\\.5 {\n    margin-inline-end: calc(var(--spacing) * 1.5);\n  }\n\n  .me-2 {\n    margin-inline-end: calc(var(--spacing) * 2);\n  }\n\n  .me-3 {\n    margin-inline-end: calc(var(--spacing) * 3);\n  }\n\n  .-mt-0 {\n    margin-top: 0;\n  }\n\n  .-mt-0\\.5 {\n    margin-top: calc(var(--spacing) * -.5);\n  }\n\n  .-mt-4 {\n    margin-top: calc(var(--spacing) * -4);\n  }\n\n  .-mt-8 {\n    margin-top: calc(var(--spacing) * -8);\n  }\n\n  .mt-0 {\n    margin-top: 0;\n  }\n\n  .mt-0\\.5 {\n    margin-top: calc(var(--spacing) * .5);\n  }\n\n  .mt-1 {\n    margin-top: var(--spacing);\n  }\n\n  .mt-1\\.5 {\n    margin-top: calc(var(--spacing) * 1.5);\n  }\n\n  .mt-2 {\n    margin-top: calc(var(--spacing) * 2);\n  }\n\n  .mt-2\\.5 {\n    margin-top: calc(var(--spacing) * 2.5);\n  }\n\n  .mt-3 {\n    margin-top: calc(var(--spacing) * 3);\n  }\n\n  .mt-3\\.5 {\n    margin-top: calc(var(--spacing) * 3.5);\n  }\n\n  .mt-4 {\n    margin-top: calc(var(--spacing) * 4);\n  }\n\n  .mt-5 {\n    margin-top: calc(var(--spacing) * 5);\n  }\n\n  .mt-6 {\n    margin-top: calc(var(--spacing) * 6);\n  }\n\n  .mt-8 {\n    margin-top: calc(var(--spacing) * 8);\n  }\n\n  .mt-10 {\n    margin-top: calc(var(--spacing) * 10);\n  }\n\n  .mt-16 {\n    margin-top: calc(var(--spacing) * 16);\n  }\n\n  .mt-24 {\n    margin-top: calc(var(--spacing) * 24);\n  }\n\n  .mt-auto {\n    margin-top: auto;\n  }\n\n  .\\!mr-4 {\n    margin-right: calc(var(--spacing) * 4) !important;\n  }\n\n  .mr-0 {\n    margin-right: 0;\n  }\n\n  .mr-0\\.5 {\n    margin-right: calc(var(--spacing) * .5);\n  }\n\n  .-mb-px {\n    margin-bottom: -1px;\n  }\n\n  .mb-1 {\n    margin-bottom: var(--spacing);\n  }\n\n  .mb-1\\.5 {\n    margin-bottom: calc(var(--spacing) * 1.5);\n  }\n\n  .mb-2 {\n    margin-bottom: calc(var(--spacing) * 2);\n  }\n\n  .mb-2\\.5 {\n    margin-bottom: calc(var(--spacing) * 2.5);\n  }\n\n  .mb-3 {\n    margin-bottom: calc(var(--spacing) * 3);\n  }\n\n  .mb-4 {\n    margin-bottom: calc(var(--spacing) * 4);\n  }\n\n  .mb-6 {\n    margin-bottom: calc(var(--spacing) * 6);\n  }\n\n  .mb-10 {\n    margin-bottom: calc(var(--spacing) * 10);\n  }\n\n  .mb-24 {\n    margin-bottom: calc(var(--spacing) * 24);\n  }\n\n  .mb-auto {\n    margin-bottom: auto;\n  }\n\n  .\\!ml-4 {\n    margin-left: calc(var(--spacing) * 4) !important;\n  }\n\n  .box-border {\n    box-sizing: border-box;\n  }\n\n  .block {\n    display: block;\n  }\n\n  .contents {\n    display: contents;\n  }\n\n  .flex {\n    display: flex;\n  }\n\n  .flow-root {\n    display: flow-root;\n  }\n\n  .grid {\n    display: grid;\n  }\n\n  .hidden {\n    display: none;\n  }\n\n  .inline {\n    display: inline;\n  }\n\n  .inline-block {\n    display: inline-block;\n  }\n\n  .inline-flex {\n    display: inline-flex;\n  }\n\n  .inline-grid {\n    display: inline-grid;\n  }\n\n  .inline-table {\n    display: inline-table;\n  }\n\n  .list-item {\n    display: list-item;\n  }\n\n  .table {\n    display: table;\n  }\n\n  .table-caption {\n    display: table-caption;\n  }\n\n  .table-cell {\n    display: table-cell;\n  }\n\n  .table-column {\n    display: table-column;\n  }\n\n  .table-column-group {\n    display: table-column-group;\n  }\n\n  .table-footer-group {\n    display: table-footer-group;\n  }\n\n  .table-header-group {\n    display: table-header-group;\n  }\n\n  .table-row {\n    display: table-row;\n  }\n\n  .table-row-group {\n    display: table-row-group;\n  }\n\n  .aspect-\\[16\\/9\\] {\n    aspect-ratio: 16 / 9;\n  }\n\n  .aspect-square {\n    aspect-ratio: 1;\n  }\n\n  .size-1 {\n    width: var(--spacing);\n    height: var(--spacing);\n  }\n\n  .size-1\\.5 {\n    width: calc(var(--spacing) * 1.5);\n    height: calc(var(--spacing) * 1.5);\n  }\n\n  .size-2 {\n    width: calc(var(--spacing) * 2);\n    height: calc(var(--spacing) * 2);\n  }\n\n  .size-2\\.5 {\n    width: calc(var(--spacing) * 2.5);\n    height: calc(var(--spacing) * 2.5);\n  }\n\n  .size-3 {\n    width: calc(var(--spacing) * 3);\n    height: calc(var(--spacing) * 3);\n  }\n\n  .size-3\\.5 {\n    width: calc(var(--spacing) * 3.5);\n    height: calc(var(--spacing) * 3.5);\n  }\n\n  .size-4 {\n    width: calc(var(--spacing) * 4);\n    height: calc(var(--spacing) * 4);\n  }\n\n  .size-4\\.5 {\n    width: calc(var(--spacing) * 4.5);\n    height: calc(var(--spacing) * 4.5);\n  }\n\n  .size-5 {\n    width: calc(var(--spacing) * 5);\n    height: calc(var(--spacing) * 5);\n  }\n\n  .size-6 {\n    width: calc(var(--spacing) * 6);\n    height: calc(var(--spacing) * 6);\n  }\n\n  .size-7 {\n    width: calc(var(--spacing) * 7);\n    height: calc(var(--spacing) * 7);\n  }\n\n  .size-8 {\n    width: calc(var(--spacing) * 8);\n    height: calc(var(--spacing) * 8);\n  }\n\n  .size-9 {\n    width: calc(var(--spacing) * 9);\n    height: calc(var(--spacing) * 9);\n  }\n\n  .size-10 {\n    width: calc(var(--spacing) * 10);\n    height: calc(var(--spacing) * 10);\n  }\n\n  .size-10\\/12 {\n    width: 83.3333%;\n    height: 83.3333%;\n  }\n\n  .size-11 {\n    width: calc(var(--spacing) * 11);\n    height: calc(var(--spacing) * 11);\n  }\n\n  .size-12 {\n    width: calc(var(--spacing) * 12);\n    height: calc(var(--spacing) * 12);\n  }\n\n  .size-14 {\n    width: calc(var(--spacing) * 14);\n    height: calc(var(--spacing) * 14);\n  }\n\n  .size-full {\n    width: 100%;\n    height: 100%;\n  }\n\n  .\\!h-1\\.5 {\n    height: calc(var(--spacing) * 1.5) !important;\n  }\n\n  .\\!h-12 {\n    height: calc(var(--spacing) * 12) !important;\n  }\n\n  .h-\\(--percent\\) {\n    height: var(--percent);\n  }\n\n  .h-\\(--reka-navigation-menu-viewport-height\\) {\n    height: var(--reka-navigation-menu-viewport-height);\n  }\n\n  .h-\\(--reka-tabs-indicator-size\\) {\n    height: var(--reka-tabs-indicator-size);\n  }\n\n  .h-\\(--ui-header-height\\) {\n    height: var(--ui-header-height);\n  }\n\n  .h-0 {\n    height: 0;\n  }\n\n  .h-0\\.5 {\n    height: calc(var(--spacing) * .5);\n  }\n\n  .h-1 {\n    height: var(--spacing);\n  }\n\n  .h-2 {\n    height: calc(var(--spacing) * 2);\n  }\n\n  .h-2\\.5 {\n    height: calc(var(--spacing) * 2.5);\n  }\n\n  .h-3 {\n    height: calc(var(--spacing) * 3);\n  }\n\n  .h-4 {\n    height: calc(var(--spacing) * 4);\n  }\n\n  .h-5 {\n    height: calc(var(--spacing) * 5);\n  }\n\n  .h-6 {\n    height: calc(var(--spacing) * 6);\n  }\n\n  .h-7 {\n    height: calc(var(--spacing) * 7);\n  }\n\n  .h-8 {\n    height: calc(var(--spacing) * 8);\n  }\n\n  .h-9 {\n    height: calc(var(--spacing) * 9);\n  }\n\n  .h-10 {\n    height: calc(var(--spacing) * 10);\n  }\n\n  .h-12 {\n    height: calc(var(--spacing) * 12);\n  }\n\n  .h-38 {\n    height: calc(var(--spacing) * 38);\n  }\n\n  .h-40 {\n    height: calc(var(--spacing) * 40);\n  }\n\n  .h-42 {\n    height: calc(var(--spacing) * 42);\n  }\n\n  .h-44 {\n    height: calc(var(--spacing) * 44);\n  }\n\n  .h-46 {\n    height: calc(var(--spacing) * 46);\n  }\n\n  .h-\\[4px\\] {\n    height: 4px;\n  }\n\n  .h-\\[5px\\] {\n    height: 5px;\n  }\n\n  .h-\\[6px\\] {\n    height: 6px;\n  }\n\n  .h-\\[7px\\] {\n    height: 7px;\n  }\n\n  .h-\\[8px\\] {\n    height: 8px;\n  }\n\n  .h-\\[9px\\] {\n    height: 9px;\n  }\n\n  .h-\\[10px\\] {\n    height: 10px;\n  }\n\n  .h-\\[11px\\] {\n    height: 11px;\n  }\n\n  .h-\\[12px\\] {\n    height: 12px;\n  }\n\n  .h-\\[fit-content\\] {\n    height: fit-content;\n  }\n\n  .h-auto {\n    height: auto;\n  }\n\n  .h-fit {\n    height: fit-content;\n  }\n\n  .h-full {\n    height: 100%;\n  }\n\n  .h-px {\n    height: 1px;\n  }\n\n  .h-svh {\n    height: 100svh;\n  }\n\n  .max-h-\\(--reka-context-menu-content-available-height\\) {\n    max-height: var(--reka-context-menu-content-available-height);\n  }\n\n  .max-h-\\(--reka-dropdown-menu-content-available-height\\) {\n    max-height: var(--reka-dropdown-menu-content-available-height);\n  }\n\n  .max-h-60 {\n    max-height: calc(var(--spacing) * 60);\n  }\n\n  .max-h-72 {\n    max-height: calc(var(--spacing) * 72);\n  }\n\n  .max-h-96 {\n    max-height: calc(var(--spacing) * 96);\n  }\n\n  .max-h-\\[70vh\\] {\n    max-height: 70vh;\n  }\n\n  .max-h-\\[96\\%\\] {\n    max-height: 96%;\n  }\n\n  .max-h-\\[200px\\] {\n    max-height: 200px;\n  }\n\n  .max-h-\\[calc\\(100\\%-2rem\\)\\] {\n    max-height: calc(100% - 2rem);\n  }\n\n  .max-h-\\[calc\\(100dvh-2rem\\)\\] {\n    max-height: calc(100dvh - 2rem);\n  }\n\n  .max-h-\\[min\\(15rem\\,var\\(--reka-combobox-content-available-height\\,15rem\\)\\)\\] {\n    max-height: min(15rem, var(--reka-combobox-content-available-height, 15rem));\n  }\n\n  .max-h-\\[min\\(15rem\\,var\\(--reka-select-content-available-height\\,15rem\\)\\)\\] {\n    max-height: min(15rem, var(--reka-select-content-available-height, 15rem));\n  }\n\n  .max-h-full {\n    max-height: 100%;\n  }\n\n  .min-h-\\(--ui-header-height\\) {\n    min-height: var(--ui-header-height);\n  }\n\n  .min-h-0 {\n    min-height: 0;\n  }\n\n  .min-h-6 {\n    min-height: calc(var(--spacing) * 6);\n  }\n\n  .min-h-8 {\n    min-height: calc(var(--spacing) * 8);\n  }\n\n  .min-h-12 {\n    min-height: calc(var(--spacing) * 12);\n  }\n\n  .min-h-48 {\n    min-height: calc(var(--spacing) * 48);\n  }\n\n  .min-h-\\[49px\\] {\n    min-height: 49px;\n  }\n\n  .min-h-\\[calc\\(100vh-var\\(--ui-header-height\\)\\)\\] {\n    min-height: calc(100vh - var(--ui-header-height));\n  }\n\n  .min-h-fit {\n    min-height: fit-content;\n  }\n\n  .min-h-svh {\n    min-height: 100svh;\n  }\n\n  .\\!w-1\\.5 {\n    width: calc(var(--spacing) * 1.5) !important;\n  }\n\n  .\\!w-12 {\n    width: calc(var(--spacing) * 12) !important;\n  }\n\n  .w-\\(--percent\\) {\n    width: var(--percent);\n  }\n\n  .w-\\(--reka-combobox-trigger-width\\) {\n    width: var(--reka-combobox-trigger-width);\n  }\n\n  .w-\\(--reka-navigation-menu-indicator-size\\) {\n    width: var(--reka-navigation-menu-indicator-size);\n  }\n\n  .w-\\(--reka-rating-item-step-width\\) {\n    width: var(--reka-rating-item-step-width);\n  }\n\n  .w-\\(--reka-select-trigger-width\\) {\n    width: var(--reka-select-trigger-width);\n  }\n\n  .w-\\(--reka-tabs-indicator-size\\) {\n    width: var(--reka-tabs-indicator-size);\n  }\n\n  .w-\\(--sidebar-width\\) {\n    width: var(--sidebar-width);\n  }\n\n  .w-\\(--width\\) {\n    width: var(--width);\n  }\n\n  .w-0 {\n    width: 0;\n  }\n\n  .w-0\\.5 {\n    width: calc(var(--spacing) * .5);\n  }\n\n  .w-1 {\n    width: var(--spacing);\n  }\n\n  .w-2 {\n    width: calc(var(--spacing) * 2);\n  }\n\n  .w-3 {\n    width: calc(var(--spacing) * 3);\n  }\n\n  .w-4 {\n    width: calc(var(--spacing) * 4);\n  }\n\n  .w-5 {\n    width: calc(var(--spacing) * 5);\n  }\n\n  .w-7 {\n    width: calc(var(--spacing) * 7);\n  }\n\n  .w-8 {\n    width: calc(var(--spacing) * 8);\n  }\n\n  .w-9 {\n    width: calc(var(--spacing) * 9);\n  }\n\n  .w-10 {\n    width: calc(var(--spacing) * 10);\n  }\n\n  .w-11 {\n    width: calc(var(--spacing) * 11);\n  }\n\n  .w-32 {\n    width: calc(var(--spacing) * 32);\n  }\n\n  .w-38 {\n    width: calc(var(--spacing) * 38);\n  }\n\n  .w-40 {\n    width: calc(var(--spacing) * 40);\n  }\n\n  .w-42 {\n    width: calc(var(--spacing) * 42);\n  }\n\n  .w-44 {\n    width: calc(var(--spacing) * 44);\n  }\n\n  .w-46 {\n    width: calc(var(--spacing) * 46);\n  }\n\n  .w-48 {\n    width: calc(var(--spacing) * 48);\n  }\n\n  .w-60 {\n    width: calc(var(--spacing) * 60);\n  }\n\n  .w-\\[6px\\] {\n    width: 6px;\n  }\n\n  .w-\\[7px\\] {\n    width: 7px;\n  }\n\n  .w-\\[8px\\] {\n    width: 8px;\n  }\n\n  .w-\\[9px\\] {\n    width: 9px;\n  }\n\n  .w-\\[10px\\] {\n    width: 10px;\n  }\n\n  .w-\\[28rem\\] {\n    width: 28rem;\n  }\n\n  .w-\\[calc\\(100\\%-2rem\\)\\] {\n    width: calc(100% - 2rem);\n  }\n\n  .w-\\[calc\\(100vw-2rem\\)\\] {\n    width: calc(100vw - 2rem);\n  }\n\n  .w-auto {\n    width: auto;\n  }\n\n  .w-full {\n    width: 100%;\n  }\n\n  .w-px {\n    width: 1px;\n  }\n\n  .max-w-\\(--ui-container\\) {\n    max-width: var(--ui-container);\n  }\n\n  .max-w-2xl {\n    max-width: var(--container-2xl);\n  }\n\n  .max-w-60 {\n    max-width: calc(var(--spacing) * 60);\n  }\n\n  .max-w-\\[75\\%\\] {\n    max-width: 75%;\n  }\n\n  .max-w-\\[90vw\\] {\n    max-width: 90vw;\n  }\n\n  .max-w-\\[calc\\(100\\%-2rem\\)\\] {\n    max-width: calc(100% - 2rem);\n  }\n\n  .max-w-lg {\n    max-width: var(--container-lg);\n  }\n\n  .max-w-sm {\n    max-width: var(--container-sm);\n  }\n\n  .min-w-0 {\n    min-width: 0;\n  }\n\n  .min-w-5 {\n    min-width: calc(var(--spacing) * 5);\n  }\n\n  .min-w-16 {\n    min-width: calc(var(--spacing) * 16);\n  }\n\n  .min-w-32 {\n    min-width: calc(var(--spacing) * 32);\n  }\n\n  .min-w-40 {\n    min-width: calc(var(--spacing) * 40);\n  }\n\n  .min-w-48 {\n    min-width: calc(var(--spacing) * 48);\n  }\n\n  .min-w-72 {\n    min-width: calc(var(--spacing) * 72);\n  }\n\n  .min-w-\\[4px\\] {\n    min-width: 4px;\n  }\n\n  .min-w-\\[5px\\] {\n    min-width: 5px;\n  }\n\n  .min-w-\\[6px\\] {\n    min-width: 6px;\n  }\n\n  .min-w-\\[7px\\] {\n    min-width: 7px;\n  }\n\n  .min-w-\\[8px\\] {\n    min-width: 8px;\n  }\n\n  .min-w-\\[9px\\] {\n    min-width: 9px;\n  }\n\n  .min-w-\\[10px\\] {\n    min-width: 10px;\n  }\n\n  .min-w-\\[11px\\] {\n    min-width: 11px;\n  }\n\n  .min-w-\\[12px\\] {\n    min-width: 12px;\n  }\n\n  .min-w-\\[16px\\] {\n    min-width: 16px;\n  }\n\n  .min-w-\\[20px\\] {\n    min-width: 20px;\n  }\n\n  .min-w-\\[24px\\] {\n    min-width: 24px;\n  }\n\n  .min-w-fit {\n    min-width: fit-content;\n  }\n\n  .min-w-full {\n    min-width: 100%;\n  }\n\n  .min-w-max {\n    min-width: max-content;\n  }\n\n  .flex-1 {\n    flex: 1;\n  }\n\n  .flex-shrink, .shrink {\n    flex-shrink: 1;\n  }\n\n  .shrink-0 {\n    flex-shrink: 0;\n  }\n\n  .flex-grow, .flex-grow-1, .grow {\n    flex-grow: 1;\n  }\n\n  .grow-0 {\n    flex-grow: 0;\n  }\n\n  .basis-full {\n    flex-basis: 100%;\n  }\n\n  .table-fixed {\n    table-layout: fixed;\n  }\n\n  .border-collapse {\n    border-collapse: collapse;\n  }\n\n  .border-separate {\n    border-collapse: separate;\n  }\n\n  .border-spacing-x-0 {\n    --tw-border-spacing-x: 0px;\n    border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);\n  }\n\n  .origin-\\(--reka-combobox-content-transform-origin\\) {\n    transform-origin: var(--reka-combobox-content-transform-origin);\n  }\n\n  .origin-\\(--reka-context-menu-content-transform-origin\\) {\n    transform-origin: var(--reka-context-menu-content-transform-origin);\n  }\n\n  .origin-\\(--reka-dropdown-menu-content-transform-origin\\) {\n    transform-origin: var(--reka-dropdown-menu-content-transform-origin);\n  }\n\n  .origin-\\(--reka-popover-content-transform-origin\\) {\n    transform-origin: var(--reka-popover-content-transform-origin);\n  }\n\n  .origin-\\(--reka-select-content-transform-origin\\) {\n    transform-origin: var(--reka-select-content-transform-origin);\n  }\n\n  .origin-\\(--reka-tooltip-content-transform-origin\\) {\n    transform-origin: var(--reka-tooltip-content-transform-origin);\n  }\n\n  .origin-\\[top_center\\] {\n    transform-origin: top;\n  }\n\n  .-translate-x-1 {\n    --tw-translate-x: calc(var(--spacing) * -1);\n    translate: var(--tw-translate-x) var(--tw-translate-y);\n  }\n\n  .-translate-x-1\\/2 {\n    --tw-translate-x: calc(calc(1 / 2 * 100%) * -1);\n    translate: var(--tw-translate-x) var(--tw-translate-y);\n  }\n\n  .-translate-x-\\[4px\\] {\n    --tw-translate-x: calc(4px * -1);\n    translate: var(--tw-translate-x) var(--tw-translate-y);\n  }\n\n  .translate-x-\\(--reka-navigation-menu-indicator-position\\) {\n    --tw-translate-x: var(--reka-navigation-menu-indicator-position);\n    translate: var(--tw-translate-x) var(--tw-translate-y);\n  }\n\n  .translate-x-\\(--reka-tabs-indicator-position\\) {\n    --tw-translate-x: var(--reka-tabs-indicator-position);\n    translate: var(--tw-translate-x) var(--tw-translate-y);\n  }\n\n  .translate-x-1 {\n    --tw-translate-x: var(--spacing);\n    translate: var(--tw-translate-x) var(--tw-translate-y);\n  }\n\n  .translate-x-1\\/2 {\n    --tw-translate-x: calc(1 / 2 * 100%);\n    translate: var(--tw-translate-x) var(--tw-translate-y);\n  }\n\n  .-translate-y-1 {\n    --tw-translate-y: calc(var(--spacing) * -1);\n    translate: var(--tw-translate-x) var(--tw-translate-y);\n  }\n\n  .-translate-y-1\\/2 {\n    --tw-translate-y: calc(calc(1 / 2 * 100%) * -1);\n    translate: var(--tw-translate-x) var(--tw-translate-y);\n  }\n\n  .translate-y-\\(--reka-tabs-indicator-position\\) {\n    --tw-translate-y: var(--reka-tabs-indicator-position);\n    translate: var(--tw-translate-x) var(--tw-translate-y);\n  }\n\n  .translate-y-1 {\n    --tw-translate-y: var(--spacing);\n    translate: var(--tw-translate-x) var(--tw-translate-y);\n  }\n\n  .translate-y-1\\/2 {\n    --tw-translate-y: calc(1 / 2 * 100%);\n    translate: var(--tw-translate-x) var(--tw-translate-y);\n  }\n\n  .translate-none {\n    translate: none;\n  }\n\n  .scale-80 {\n    --tw-scale-x: 80%;\n    --tw-scale-y: 80%;\n    --tw-scale-z: 80%;\n    scale: var(--tw-scale-x) var(--tw-scale-y);\n  }\n\n  .scale-3d {\n    scale: var(--tw-scale-x) var(--tw-scale-y) var(--tw-scale-z);\n  }\n\n  .rotate-45 {\n    rotate: 45deg;\n  }\n\n  .rotate-90 {\n    rotate: 90deg;\n  }\n\n  .transform {\n    transform: var(--tw-rotate-x, ) var(--tw-rotate-y, ) var(--tw-rotate-z, ) var(--tw-skew-x, ) var(--tw-skew-y, );\n  }\n\n  .transform-\\(--transform\\) {\n    transform: var(--transform);\n  }\n\n  .animate-pulse {\n    animation: var(--animate-pulse);\n  }\n\n  .animate-spin {\n    animation: var(--animate-spin);\n  }\n\n  .cursor-col-resize {\n    cursor: col-resize;\n  }\n\n  .cursor-default {\n    cursor: default;\n  }\n\n  .cursor-e-resize {\n    cursor: e-resize;\n  }\n\n  .cursor-ew-resize {\n    cursor: ew-resize;\n  }\n\n  .cursor-grab {\n    cursor: grab;\n  }\n\n  .cursor-not-allowed {\n    cursor: not-allowed;\n  }\n\n  .cursor-pointer {\n    cursor: pointer;\n  }\n\n  .cursor-row-resize {\n    cursor: row-resize;\n  }\n\n  .cursor-w-resize {\n    cursor: w-resize;\n  }\n\n  .touch-pinch-zoom {\n    --tw-pinch-zoom: pinch-zoom;\n    touch-action: var(--tw-pan-x, ) var(--tw-pan-y, ) var(--tw-pinch-zoom, );\n  }\n\n  .touch-none {\n    touch-action: none;\n  }\n\n  .resize {\n    resize: both;\n  }\n\n  .resize-none {\n    resize: none;\n  }\n\n  .scroll-mt-3 {\n    scroll-margin-top: calc(var(--spacing) * 3);\n  }\n\n  .scroll-mt-4 {\n    scroll-margin-top: calc(var(--spacing) * 4);\n  }\n\n  .scroll-py-1 {\n    scroll-padding-block: var(--spacing);\n  }\n\n  .appearance-none {\n    appearance: none;\n  }\n\n  .columns-1 {\n    columns: 1;\n  }\n\n  .auto-cols-fr {\n    grid-auto-columns: minmax(0, 1fr);\n  }\n\n  .grid-flow-col {\n    grid-auto-flow: column;\n  }\n\n  .grid-cols-1 {\n    grid-template-columns: repeat(1, minmax(0, 1fr));\n  }\n\n  .grid-cols-2 {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n\n  .grid-cols-4 {\n    grid-template-columns: repeat(4, minmax(0, 1fr));\n  }\n\n  .grid-cols-7 {\n    grid-template-columns: repeat(7, minmax(0, 1fr));\n  }\n\n  .grid-cols-8 {\n    grid-template-columns: repeat(8, minmax(0, 1fr));\n  }\n\n  .flex-col {\n    flex-direction: column;\n  }\n\n  .flex-col-reverse {\n    flex-direction: column-reverse;\n  }\n\n  .flex-row {\n    flex-direction: row;\n  }\n\n  .flex-row-reverse {\n    flex-direction: row-reverse;\n  }\n\n  .flex-wrap {\n    flex-wrap: wrap;\n  }\n\n  .place-items-baseline {\n    place-items: baseline;\n  }\n\n  .place-items-center {\n    place-items: center;\n  }\n\n  .content-center {\n    align-content: center;\n  }\n\n  .items-center {\n    align-items: center;\n  }\n\n  .items-end {\n    align-items: flex-end;\n  }\n\n  .items-start {\n    align-items: flex-start;\n  }\n\n  .items-stretch {\n    align-items: stretch;\n  }\n\n  .justify-around {\n    justify-content: space-around;\n  }\n\n  .justify-between {\n    justify-content: space-between;\n  }\n\n  .justify-center {\n    justify-content: center;\n  }\n\n  .justify-end {\n    justify-content: flex-end;\n  }\n\n  .justify-start {\n    justify-content: flex-start;\n  }\n\n  .gap-\\(--gap\\) {\n    gap: var(--gap);\n  }\n\n  .gap-0 {\n    gap: 0;\n  }\n\n  .gap-0\\.5 {\n    gap: calc(var(--spacing) * .5);\n  }\n\n  .gap-0\\.25 {\n    gap: calc(var(--spacing) * .25);\n  }\n\n  .gap-0\\.75 {\n    gap: calc(var(--spacing) * .75);\n  }\n\n  .gap-1 {\n    gap: var(--spacing);\n  }\n\n  .gap-1\\.5 {\n    gap: calc(var(--spacing) * 1.5);\n  }\n\n  .gap-2 {\n    gap: calc(var(--spacing) * 2);\n  }\n\n  .gap-2\\.5 {\n    gap: calc(var(--spacing) * 2.5);\n  }\n\n  .gap-3 {\n    gap: calc(var(--spacing) * 3);\n  }\n\n  .gap-3\\.5 {\n    gap: calc(var(--spacing) * 3.5);\n  }\n\n  .gap-4 {\n    gap: calc(var(--spacing) * 4);\n  }\n\n  .gap-6 {\n    gap: calc(var(--spacing) * 6);\n  }\n\n  .gap-8 {\n    gap: calc(var(--spacing) * 8);\n  }\n\n  .gap-16 {\n    gap: calc(var(--spacing) * 16);\n  }\n\n  :where(.-space-y-px > :not(:last-child)) {\n    --tw-space-y-reverse: 0;\n    margin-block-start: calc(-1px * var(--tw-space-y-reverse));\n    margin-block-end: calc(-1px * calc(1 - var(--tw-space-y-reverse)));\n  }\n\n  :where(.space-y-1 > :not(:last-child)) {\n    --tw-space-y-reverse: 0;\n    margin-block-start: calc(var(--spacing) * var(--tw-space-y-reverse));\n    margin-block-end: calc(var(--spacing) * calc(1 - var(--tw-space-y-reverse)));\n  }\n\n  :where(.space-y-2 > :not(:last-child)) {\n    --tw-space-y-reverse: 0;\n    margin-block-start: calc(calc(var(--spacing) * 2) * var(--tw-space-y-reverse));\n    margin-block-end: calc(calc(var(--spacing) * 2) * calc(1 - var(--tw-space-y-reverse)));\n  }\n\n  :where(.space-y-3 > :not(:last-child)) {\n    --tw-space-y-reverse: 0;\n    margin-block-start: calc(calc(var(--spacing) * 3) * var(--tw-space-y-reverse));\n    margin-block-end: calc(calc(var(--spacing) * 3) * calc(1 - var(--tw-space-y-reverse)));\n  }\n\n  :where(.space-y-4 > :not(:last-child)) {\n    --tw-space-y-reverse: 0;\n    margin-block-start: calc(calc(var(--spacing) * 4) * var(--tw-space-y-reverse));\n    margin-block-end: calc(calc(var(--spacing) * 4) * calc(1 - var(--tw-space-y-reverse)));\n  }\n\n  :where(.space-y-5 > :not(:last-child)) {\n    --tw-space-y-reverse: 0;\n    margin-block-start: calc(calc(var(--spacing) * 5) * var(--tw-space-y-reverse));\n    margin-block-end: calc(calc(var(--spacing) * 5) * calc(1 - var(--tw-space-y-reverse)));\n  }\n\n  :where(.space-y-6 > :not(:last-child)) {\n    --tw-space-y-reverse: 0;\n    margin-block-start: calc(calc(var(--spacing) * 6) * var(--tw-space-y-reverse));\n    margin-block-end: calc(calc(var(--spacing) * 6) * calc(1 - var(--tw-space-y-reverse)));\n  }\n\n  :where(.space-y-8 > :not(:last-child)) {\n    --tw-space-y-reverse: 0;\n    margin-block-start: calc(calc(var(--spacing) * 8) * var(--tw-space-y-reverse));\n    margin-block-end: calc(calc(var(--spacing) * 8) * calc(1 - var(--tw-space-y-reverse)));\n  }\n\n  :where(.space-y-12 > :not(:last-child)) {\n    --tw-space-y-reverse: 0;\n    margin-block-start: calc(calc(var(--spacing) * 12) * var(--tw-space-y-reverse));\n    margin-block-end: calc(calc(var(--spacing) * 12) * calc(1 - var(--tw-space-y-reverse)));\n  }\n\n  :where(.space-y-reverse > :not(:last-child)) {\n    --tw-space-y-reverse: 1;\n  }\n\n  .gap-x-1 {\n    column-gap: var(--spacing);\n  }\n\n  .gap-x-1\\.5 {\n    column-gap: calc(var(--spacing) * 1.5);\n  }\n\n  .gap-x-2 {\n    column-gap: calc(var(--spacing) * 2);\n  }\n\n  .gap-x-3 {\n    column-gap: calc(var(--spacing) * 3);\n  }\n\n  .gap-x-4 {\n    column-gap: calc(var(--spacing) * 4);\n  }\n\n  .gap-x-6 {\n    column-gap: calc(var(--spacing) * 6);\n  }\n\n  .gap-x-8 {\n    column-gap: calc(var(--spacing) * 8);\n  }\n\n  :where(.-space-x-px > :not(:last-child)) {\n    --tw-space-x-reverse: 0;\n    margin-inline-start: calc(-1px * var(--tw-space-x-reverse));\n    margin-inline-end: calc(-1px * calc(1 - var(--tw-space-x-reverse)));\n  }\n\n  :where(.space-x-1 > :not(:last-child)) {\n    --tw-space-x-reverse: 0;\n    margin-inline-start: calc(var(--spacing) * var(--tw-space-x-reverse));\n    margin-inline-end: calc(var(--spacing) * calc(1 - var(--tw-space-x-reverse)));\n  }\n\n  :where(.space-x-reverse > :not(:last-child)) {\n    --tw-space-x-reverse: 1;\n  }\n\n  .gap-y-0 {\n    row-gap: 0;\n  }\n\n  .gap-y-0\\.5 {\n    row-gap: calc(var(--spacing) * .5);\n  }\n\n  .gap-y-1 {\n    row-gap: var(--spacing);\n  }\n\n  .gap-y-1\\.5 {\n    row-gap: calc(var(--spacing) * 1.5);\n  }\n\n  .gap-y-3 {\n    row-gap: calc(var(--spacing) * 3);\n  }\n\n  .gap-y-4 {\n    row-gap: calc(var(--spacing) * 4);\n  }\n\n  .gap-y-6 {\n    row-gap: calc(var(--spacing) * 6);\n  }\n\n  .gap-y-8 {\n    row-gap: calc(var(--spacing) * 8);\n  }\n\n  :where(.divide-x > :not(:last-child)) {\n    --tw-divide-x-reverse: 0;\n    border-inline-style: var(--tw-border-style);\n    border-inline-start-width: calc(1px * var(--tw-divide-x-reverse));\n    border-inline-end-width: calc(1px * calc(1 - var(--tw-divide-x-reverse)));\n  }\n\n  :where(.divide-y > :not(:last-child)) {\n    --tw-divide-y-reverse: 0;\n    border-bottom-style: var(--tw-border-style);\n    border-top-style: var(--tw-border-style);\n    border-top-width: calc(1px * var(--tw-divide-y-reverse));\n    border-bottom-width: calc(1px * calc(1 - var(--tw-divide-y-reverse)));\n  }\n\n  :where(.divide-y-reverse > :not(:last-child)) {\n    --tw-divide-y-reverse: 1;\n  }\n\n  :where(.divide-accented > :not(:last-child)) {\n    border-color: var(--ui-border-accented);\n  }\n\n  :where(.divide-default > :not(:last-child)) {\n    border-color: var(--ui-border);\n  }\n\n  :where(.divide-transparent > :not(:last-child)) {\n    border-color: #0000;\n  }\n\n  .self-center {\n    align-self: center;\n  }\n\n  .self-end {\n    align-self: flex-end;\n  }\n\n  .self-stretch {\n    align-self: stretch;\n  }\n\n  .truncate {\n    text-overflow: ellipsis;\n    white-space: nowrap;\n    overflow: hidden;\n  }\n\n  .overflow-auto {\n    overflow: auto;\n  }\n\n  .overflow-clip {\n    overflow: clip;\n  }\n\n  .overflow-hidden {\n    overflow: hidden;\n  }\n\n  .overflow-visible {\n    overflow: visible;\n  }\n\n  .overflow-x-auto {\n    overflow-x: auto;\n  }\n\n  .overflow-x-hidden {\n    overflow-x: hidden;\n  }\n\n  .overflow-y-auto {\n    overflow-y: auto;\n  }\n\n  .overflow-y-hidden {\n    overflow-y: hidden;\n  }\n\n  .rounded {\n    border-radius: .25rem;\n  }\n\n  .rounded-\\[inherit\\] {\n    border-radius: inherit;\n  }\n\n  .rounded-full {\n    border-radius: 2147483647px;\n  }\n\n  .rounded-lg {\n    border-radius: calc(var(--ui-radius) * 2);\n  }\n\n  .rounded-md {\n    border-radius: calc(var(--ui-radius) * 1.5);\n  }\n\n  .rounded-sm {\n    border-radius: var(--ui-radius);\n  }\n\n  .rounded-xl {\n    border-radius: calc(var(--ui-radius) * 3);\n  }\n\n  .rounded-xs {\n    border-radius: calc(var(--ui-radius) * .5);\n  }\n\n  .rounded-s {\n    border-start-start-radius: .25rem;\n    border-end-start-radius: .25rem;\n  }\n\n  .rounded-ss {\n    border-start-start-radius: .25rem;\n  }\n\n  .rounded-e {\n    border-start-end-radius: .25rem;\n    border-end-end-radius: .25rem;\n  }\n\n  .rounded-se {\n    border-start-end-radius: .25rem;\n  }\n\n  .rounded-ee {\n    border-end-end-radius: .25rem;\n  }\n\n  .rounded-es {\n    border-end-start-radius: .25rem;\n  }\n\n  .rounded-t {\n    border-top-left-radius: .25rem;\n    border-top-right-radius: .25rem;\n  }\n\n  .rounded-t-lg {\n    border-top-left-radius: calc(var(--ui-radius) * 2);\n    border-top-right-radius: calc(var(--ui-radius) * 2);\n  }\n\n  .rounded-t-none {\n    border-top-left-radius: 0;\n    border-top-right-radius: 0;\n  }\n\n  .rounded-l {\n    border-top-left-radius: .25rem;\n    border-bottom-left-radius: .25rem;\n  }\n\n  .rounded-l-lg {\n    border-top-left-radius: calc(var(--ui-radius) * 2);\n    border-bottom-left-radius: calc(var(--ui-radius) * 2);\n  }\n\n  .rounded-tl {\n    border-top-left-radius: .25rem;\n  }\n\n  .rounded-r {\n    border-top-right-radius: .25rem;\n    border-bottom-right-radius: .25rem;\n  }\n\n  .rounded-r-lg {\n    border-top-right-radius: calc(var(--ui-radius) * 2);\n    border-bottom-right-radius: calc(var(--ui-radius) * 2);\n  }\n\n  .rounded-tr {\n    border-top-right-radius: .25rem;\n  }\n\n  .rounded-b {\n    border-bottom-right-radius: .25rem;\n    border-bottom-left-radius: .25rem;\n  }\n\n  .rounded-b-lg {\n    border-bottom-right-radius: calc(var(--ui-radius) * 2);\n    border-bottom-left-radius: calc(var(--ui-radius) * 2);\n  }\n\n  .rounded-br {\n    border-bottom-right-radius: .25rem;\n  }\n\n  .rounded-bl {\n    border-bottom-left-radius: .25rem;\n  }\n\n  .border {\n    border-style: var(--tw-border-style);\n    border-width: 1px;\n  }\n\n  .border-0 {\n    border-style: var(--tw-border-style);\n    border-width: 0;\n  }\n\n  .border-2 {\n    border-style: var(--tw-border-style);\n    border-width: 2px;\n  }\n\n  .border-x {\n    border-inline-style: var(--tw-border-style);\n    border-inline-width: 1px;\n  }\n\n  .border-y {\n    border-block-style: var(--tw-border-style);\n    border-block-width: 1px;\n  }\n\n  .border-s {\n    border-inline-start-style: var(--tw-border-style);\n    border-inline-start-width: 1px;\n  }\n\n  .border-s-\\[2px\\] {\n    border-inline-start-style: var(--tw-border-style);\n    border-inline-start-width: 2px;\n  }\n\n  .border-s-\\[3px\\] {\n    border-inline-start-style: var(--tw-border-style);\n    border-inline-start-width: 3px;\n  }\n\n  .border-s-\\[4px\\] {\n    border-inline-start-style: var(--tw-border-style);\n    border-inline-start-width: 4px;\n  }\n\n  .border-s-\\[5px\\] {\n    border-inline-start-style: var(--tw-border-style);\n    border-inline-start-width: 5px;\n  }\n\n  .border-e {\n    border-inline-end-style: var(--tw-border-style);\n    border-inline-end-width: 1px;\n  }\n\n  .border-bs {\n    border-block-start-style: var(--tw-border-style);\n    border-block-start-width: 1px;\n  }\n\n  .border-be {\n    border-block-end-style: var(--tw-border-style);\n    border-block-end-width: 1px;\n  }\n\n  .border-t {\n    border-top-style: var(--tw-border-style);\n    border-top-width: 1px;\n  }\n\n  .border-t-\\[2px\\] {\n    border-top-style: var(--tw-border-style);\n    border-top-width: 2px;\n  }\n\n  .border-t-\\[3px\\] {\n    border-top-style: var(--tw-border-style);\n    border-top-width: 3px;\n  }\n\n  .border-t-\\[4px\\] {\n    border-top-style: var(--tw-border-style);\n    border-top-width: 4px;\n  }\n\n  .border-t-\\[5px\\] {\n    border-top-style: var(--tw-border-style);\n    border-top-width: 5px;\n  }\n\n  .border-r {\n    border-right-style: var(--tw-border-style);\n    border-right-width: 1px;\n  }\n\n  .border-b {\n    border-bottom-style: var(--tw-border-style);\n    border-bottom-width: 1px;\n  }\n\n  .border-l {\n    border-left-style: var(--tw-border-style);\n    border-left-width: 1px;\n  }\n\n  .border-dashed {\n    --tw-border-style: dashed;\n    border-style: dashed;\n  }\n\n  .border-dotted {\n    --tw-border-style: dotted;\n    border-style: dotted;\n  }\n\n  .border-solid {\n    --tw-border-style: solid;\n    border-style: solid;\n  }\n\n  .border-bg {\n    border-color: var(--ui-bg);\n  }\n\n  .border-default {\n    border-color: var(--ui-border);\n  }\n\n  .border-error {\n    border-color: var(--ui-error);\n  }\n\n  .border-info {\n    border-color: var(--ui-info);\n  }\n\n  .border-inverted {\n    border-color: var(--ui-border-inverted);\n  }\n\n  .border-primary {\n    border-color: var(--ui-primary);\n  }\n\n  .border-secondary {\n    border-color: var(--ui-secondary);\n  }\n\n  .border-success {\n    border-color: var(--ui-success);\n  }\n\n  .border-transparent {\n    border-color: #0000;\n  }\n\n  .border-warning {\n    border-color: var(--ui-warning);\n  }\n\n  .\\!bg-accented {\n    background-color: var(--ui-bg-accented) !important;\n  }\n\n  .bg-\\(--ui-border-accented\\) {\n    background-color: var(--ui-border-accented);\n  }\n\n  .bg-accented {\n    background-color: var(--ui-bg-accented);\n  }\n\n  .bg-border {\n    background-color: var(--ui-border);\n  }\n\n  .bg-default, .bg-default\\/75 {\n    background-color: var(--ui-bg);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .bg-default\\/75 {\n      background-color: color-mix(in oklab, var(--ui-bg) 75%, transparent);\n    }\n  }\n\n  .bg-default\\/90 {\n    background-color: var(--ui-bg);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .bg-default\\/90 {\n      background-color: color-mix(in oklab, var(--ui-bg) 90%, transparent);\n    }\n  }\n\n  .bg-elevated, .bg-elevated\\/50 {\n    background-color: var(--ui-bg-elevated);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .bg-elevated\\/50 {\n      background-color: color-mix(in oklab, var(--ui-bg-elevated) 50%, transparent);\n    }\n  }\n\n  .bg-elevated\\/75 {\n    background-color: var(--ui-bg-elevated);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .bg-elevated\\/75 {\n      background-color: color-mix(in oklab, var(--ui-bg-elevated) 75%, transparent);\n    }\n  }\n\n  .bg-error, .bg-error\\/10 {\n    background-color: var(--ui-error);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .bg-error\\/10 {\n      background-color: color-mix(in oklab, var(--ui-error) 10%, transparent);\n    }\n  }\n\n  .bg-info, .bg-info\\/10 {\n    background-color: var(--ui-info);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .bg-info\\/10 {\n      background-color: color-mix(in oklab, var(--ui-info) 10%, transparent);\n    }\n  }\n\n  .bg-inverted {\n    background-color: var(--ui-bg-inverted);\n  }\n\n  .bg-primary, .bg-primary\\/10 {\n    background-color: var(--ui-primary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .bg-primary\\/10 {\n      background-color: color-mix(in oklab, var(--ui-primary) 10%, transparent);\n    }\n  }\n\n  .bg-secondary, .bg-secondary\\/10 {\n    background-color: var(--ui-secondary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .bg-secondary\\/10 {\n      background-color: color-mix(in oklab, var(--ui-secondary) 10%, transparent);\n    }\n  }\n\n  .bg-success, .bg-success\\/10 {\n    background-color: var(--ui-success);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .bg-success\\/10 {\n      background-color: color-mix(in oklab, var(--ui-success) 10%, transparent);\n    }\n  }\n\n  .bg-transparent {\n    background-color: #0000;\n  }\n\n  .bg-warning, .bg-warning\\/10 {\n    background-color: var(--ui-warning);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .bg-warning\\/10 {\n      background-color: color-mix(in oklab, var(--ui-warning) 10%, transparent);\n    }\n  }\n\n  .bg-gradient-to-b {\n    --tw-gradient-position: to bottom in oklab;\n    background-image: linear-gradient(var(--tw-gradient-stops));\n  }\n\n  .bg-\\[image\\:linear-gradient\\(90deg\\,\\#0000_calc\\(50\\%-var\\(--spread\\)\\)\\,var\\(--ui-text-highlighted\\)\\,\\#0000_calc\\(50\\%\\+var\\(--spread\\)\\)\\)\\,linear-gradient\\(var\\(--ui-text-muted\\)\\,var\\(--ui-text-muted\\)\\)\\] {\n    background-image: linear-gradient(90deg,#0000 calc(50% - var(--spread)),var(--ui-text-highlighted),#0000 calc(50% + var(--spread))),linear-gradient(var(--ui-text-muted),var(--ui-text-muted));\n  }\n\n  .from-default {\n    --tw-gradient-from: var(--ui-bg);\n    --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));\n  }\n\n  .bg-size-\\[calc\\(200\\%\\+var\\(--spread\\)\\*2\\+2px\\)_100\\%\\,auto\\] {\n    background-size: calc(200% + var(--spread) * 2 + 2px) 100%,auto;\n  }\n\n  .bg-clip-text {\n    -webkit-background-clip: text;\n    background-clip: text;\n  }\n\n  .bg-no-repeat {\n    background-repeat: no-repeat;\n  }\n\n  .bg-repeat {\n    background-repeat: repeat;\n  }\n\n  .mask-no-clip {\n    -webkit-mask-clip: no-clip;\n    mask-clip: no-clip;\n  }\n\n  .mask-repeat {\n    -webkit-mask-repeat: repeat;\n    mask-repeat: repeat;\n  }\n\n  .fill-bg {\n    fill: var(--ui-bg);\n  }\n\n  .stroke-default {\n    stroke: var(--ui-border);\n  }\n\n  .object-cover {\n    object-fit: cover;\n  }\n\n  .object-top {\n    object-position: top;\n  }\n\n  .p-0 {\n    padding: 0;\n  }\n\n  .p-0\\.5 {\n    padding: calc(var(--spacing) * .5);\n  }\n\n  .p-1 {\n    padding: var(--spacing);\n  }\n\n  .p-1\\.5 {\n    padding: calc(var(--spacing) * 1.5);\n  }\n\n  .p-2 {\n    padding: calc(var(--spacing) * 2);\n  }\n\n  .p-2\\.5 {\n    padding: calc(var(--spacing) * 2.5);\n  }\n\n  .p-3 {\n    padding: calc(var(--spacing) * 3);\n  }\n\n  .p-3\\.5 {\n    padding: calc(var(--spacing) * 3.5);\n  }\n\n  .p-4 {\n    padding: calc(var(--spacing) * 4);\n  }\n\n  .p-4\\.5 {\n    padding: calc(var(--spacing) * 4.5);\n  }\n\n  .p-6 {\n    padding: calc(var(--spacing) * 6);\n  }\n\n  .px-0 {\n    padding-inline: 0;\n  }\n\n  .px-1 {\n    padding-inline: var(--spacing);\n  }\n\n  .px-1\\.5 {\n    padding-inline: calc(var(--spacing) * 1.5);\n  }\n\n  .px-2 {\n    padding-inline: calc(var(--spacing) * 2);\n  }\n\n  .px-2\\.5 {\n    padding-inline: calc(var(--spacing) * 2.5);\n  }\n\n  .px-3 {\n    padding-inline: calc(var(--spacing) * 3);\n  }\n\n  .px-4 {\n    padding-inline: calc(var(--spacing) * 4);\n  }\n\n  .px-5 {\n    padding-inline: calc(var(--spacing) * 5);\n  }\n\n  .px-6 {\n    padding-inline: calc(var(--spacing) * 6);\n  }\n\n  .py-0 {\n    padding-block: 0;\n  }\n\n  .py-0\\.5 {\n    padding-block: calc(var(--spacing) * .5);\n  }\n\n  .py-1 {\n    padding-block: var(--spacing);\n  }\n\n  .py-1\\.5 {\n    padding-block: calc(var(--spacing) * 1.5);\n  }\n\n  .py-2 {\n    padding-block: calc(var(--spacing) * 2);\n  }\n\n  .py-3 {\n    padding-block: calc(var(--spacing) * 3);\n  }\n\n  .py-3\\.5 {\n    padding-block: calc(var(--spacing) * 3.5);\n  }\n\n  .py-4 {\n    padding-block: calc(var(--spacing) * 4);\n  }\n\n  .py-6 {\n    padding-block: calc(var(--spacing) * 6);\n  }\n\n  .py-7 {\n    padding-block: calc(var(--spacing) * 7);\n  }\n\n  .py-8 {\n    padding-block: calc(var(--spacing) * 8);\n  }\n\n  .py-12 {\n    padding-block: calc(var(--spacing) * 12);\n  }\n\n  .py-16 {\n    padding-block: calc(var(--spacing) * 16);\n  }\n\n  .py-24 {\n    padding-block: calc(var(--spacing) * 24);\n  }\n\n  .ps-1 {\n    padding-inline-start: var(--spacing);\n  }\n\n  .ps-1\\.5 {\n    padding-inline-start: calc(var(--spacing) * 1.5);\n  }\n\n  .ps-2 {\n    padding-inline-start: calc(var(--spacing) * 2);\n  }\n\n  .ps-2\\.5 {\n    padding-inline-start: calc(var(--spacing) * 2.5);\n  }\n\n  .ps-3 {\n    padding-inline-start: calc(var(--spacing) * 3);\n  }\n\n  .ps-4 {\n    padding-inline-start: calc(var(--spacing) * 4);\n  }\n\n  .ps-7 {\n    padding-inline-start: calc(var(--spacing) * 7);\n  }\n\n  .ps-8 {\n    padding-inline-start: calc(var(--spacing) * 8);\n  }\n\n  .ps-9 {\n    padding-inline-start: calc(var(--spacing) * 9);\n  }\n\n  .ps-10 {\n    padding-inline-start: calc(var(--spacing) * 10);\n  }\n\n  .ps-11 {\n    padding-inline-start: calc(var(--spacing) * 11);\n  }\n\n  .pe-1 {\n    padding-inline-end: var(--spacing);\n  }\n\n  .pe-2 {\n    padding-inline-end: calc(var(--spacing) * 2);\n  }\n\n  .pe-2\\.5 {\n    padding-inline-end: calc(var(--spacing) * 2.5);\n  }\n\n  .pe-3 {\n    padding-inline-end: calc(var(--spacing) * 3);\n  }\n\n  .pe-4 {\n    padding-inline-end: calc(var(--spacing) * 4);\n  }\n\n  .pe-4\\.5 {\n    padding-inline-end: calc(var(--spacing) * 4.5);\n  }\n\n  .pe-5 {\n    padding-inline-end: calc(var(--spacing) * 5);\n  }\n\n  .pe-5\\.5 {\n    padding-inline-end: calc(var(--spacing) * 5.5);\n  }\n\n  .pe-6 {\n    padding-inline-end: calc(var(--spacing) * 6);\n  }\n\n  .pe-6\\.5 {\n    padding-inline-end: calc(var(--spacing) * 6.5);\n  }\n\n  .pe-7 {\n    padding-inline-end: calc(var(--spacing) * 7);\n  }\n\n  .pe-7\\.5 {\n    padding-inline-end: calc(var(--spacing) * 7.5);\n  }\n\n  .pe-8 {\n    padding-inline-end: calc(var(--spacing) * 8);\n  }\n\n  .pe-8\\.5 {\n    padding-inline-end: calc(var(--spacing) * 8.5);\n  }\n\n  .pe-9 {\n    padding-inline-end: calc(var(--spacing) * 9);\n  }\n\n  .pe-10 {\n    padding-inline-end: calc(var(--spacing) * 10);\n  }\n\n  .pe-11 {\n    padding-inline-end: calc(var(--spacing) * 11);\n  }\n\n  .pt-2 {\n    padding-top: calc(var(--spacing) * 2);\n  }\n\n  .pt-4 {\n    padding-top: calc(var(--spacing) * 4);\n  }\n\n  .pt-5 {\n    padding-top: calc(var(--spacing) * 5);\n  }\n\n  .pb-3 {\n    padding-bottom: calc(var(--spacing) * 3);\n  }\n\n  .pb-3\\.5 {\n    padding-bottom: calc(var(--spacing) * 3.5);\n  }\n\n  .pb-4 {\n    padding-bottom: calc(var(--spacing) * 4);\n  }\n\n  .pb-4\\.5 {\n    padding-bottom: calc(var(--spacing) * 4.5);\n  }\n\n  .pb-5 {\n    padding-bottom: calc(var(--spacing) * 5);\n  }\n\n  .pb-5\\.5 {\n    padding-bottom: calc(var(--spacing) * 5.5);\n  }\n\n  .pb-6 {\n    padding-bottom: calc(var(--spacing) * 6);\n  }\n\n  .pb-6\\.5 {\n    padding-bottom: calc(var(--spacing) * 6.5);\n  }\n\n  .pb-7 {\n    padding-bottom: calc(var(--spacing) * 7);\n  }\n\n  .pb-7\\.5 {\n    padding-bottom: calc(var(--spacing) * 7.5);\n  }\n\n  .pb-8 {\n    padding-bottom: calc(var(--spacing) * 8);\n  }\n\n  .pb-8\\.5 {\n    padding-bottom: calc(var(--spacing) * 8.5);\n  }\n\n  .pb-24 {\n    padding-bottom: calc(var(--spacing) * 24);\n  }\n\n  .pl-16 {\n    padding-left: calc(var(--spacing) * 16);\n  }\n\n  .text-center {\n    text-align: center;\n  }\n\n  .text-end {\n    text-align: end;\n  }\n\n  .text-start {\n    text-align: start;\n  }\n\n  .align-middle {\n    vertical-align: middle;\n  }\n\n  .align-top {\n    vertical-align: top;\n  }\n\n  .font-sans {\n    font-family: var(--font-sans);\n  }\n\n  .text-2xl {\n    font-size: var(--text-2xl);\n    line-height: var(--tw-leading, var(--text-2xl--line-height));\n  }\n\n  .text-3xl {\n    font-size: var(--text-3xl);\n    line-height: var(--tw-leading, var(--text-3xl--line-height));\n  }\n\n  .text-4xl {\n    font-size: var(--text-4xl);\n    line-height: var(--tw-leading, var(--text-4xl--line-height));\n  }\n\n  .text-5xl {\n    font-size: var(--text-5xl);\n    line-height: var(--tw-leading, var(--text-5xl--line-height));\n  }\n\n  .text-\\[8px\\]\\/3 {\n    font-size: 8px;\n    line-height: calc(var(--spacing) * 3);\n  }\n\n  .text-\\[10px\\]\\/3 {\n    font-size: 10px;\n    line-height: calc(var(--spacing) * 3);\n  }\n\n  .text-base {\n    font-size: var(--text-base);\n    line-height: var(--tw-leading, var(--text-base--line-height));\n  }\n\n  .text-base\\/5 {\n    font-size: var(--text-base);\n    line-height: calc(var(--spacing) * 5);\n  }\n\n  .text-lg {\n    font-size: var(--text-lg);\n    line-height: var(--tw-leading, var(--text-lg--line-height));\n  }\n\n  .text-sm {\n    font-size: var(--text-sm);\n    line-height: var(--tw-leading, var(--text-sm--line-height));\n  }\n\n  .text-sm\\/4 {\n    font-size: var(--text-sm);\n    line-height: calc(var(--spacing) * 4);\n  }\n\n  .text-sm\\/6 {\n    font-size: var(--text-sm);\n    line-height: calc(var(--spacing) * 6);\n  }\n\n  .text-xl {\n    font-size: var(--text-xl);\n    line-height: var(--tw-leading, var(--text-xl--line-height));\n  }\n\n  .text-xs {\n    font-size: var(--text-xs);\n    line-height: var(--tw-leading, var(--text-xs--line-height));\n  }\n\n  .text-xs\\/5 {\n    font-size: var(--text-xs);\n    line-height: calc(var(--spacing) * 5);\n  }\n\n  .text-\\[4px\\] {\n    font-size: 4px;\n  }\n\n  .text-\\[5px\\] {\n    font-size: 5px;\n  }\n\n  .text-\\[6px\\] {\n    font-size: 6px;\n  }\n\n  .text-\\[7px\\] {\n    font-size: 7px;\n  }\n\n  .text-\\[8px\\] {\n    font-size: 8px;\n  }\n\n  .text-\\[9px\\] {\n    font-size: 9px;\n  }\n\n  .text-\\[10px\\] {\n    font-size: 10px;\n  }\n\n  .text-\\[11px\\] {\n    font-size: 11px;\n  }\n\n  .text-\\[12px\\] {\n    font-size: 12px;\n  }\n\n  .text-\\[15px\\] {\n    font-size: 15px;\n  }\n\n  .text-\\[22px\\] {\n    font-size: 22px;\n  }\n\n  .leading-4 {\n    --tw-leading: calc(var(--spacing) * 4);\n    line-height: calc(var(--spacing) * 4);\n  }\n\n  .font-bold {\n    --tw-font-weight: var(--font-weight-bold);\n    font-weight: var(--font-weight-bold);\n  }\n\n  .font-medium {\n    --tw-font-weight: var(--font-weight-medium);\n    font-weight: var(--font-weight-medium);\n  }\n\n  .font-normal {\n    --tw-font-weight: var(--font-weight-normal);\n    font-weight: var(--font-weight-normal);\n  }\n\n  .font-semibold {\n    --tw-font-weight: var(--font-weight-semibold);\n    font-weight: var(--font-weight-semibold);\n  }\n\n  .tracking-tight {\n    --tw-tracking: var(--tracking-tight);\n    letter-spacing: var(--tracking-tight);\n  }\n\n  .text-balance {\n    text-wrap: balance;\n  }\n\n  .text-nowrap {\n    text-wrap: nowrap;\n  }\n\n  .text-pretty {\n    text-wrap: pretty;\n  }\n\n  .text-wrap {\n    text-wrap: wrap;\n  }\n\n  .break-words {\n    overflow-wrap: break-word;\n  }\n\n  .wrap-anywhere {\n    overflow-wrap: anywhere;\n  }\n\n  .wrap-break-word {\n    overflow-wrap: break-word;\n  }\n\n  .text-clip {\n    text-overflow: clip;\n  }\n\n  .text-ellipsis {\n    text-overflow: ellipsis;\n  }\n\n  .whitespace-nowrap {\n    white-space: nowrap;\n  }\n\n  .whitespace-pre-wrap {\n    white-space: pre-wrap;\n  }\n\n  .text-default {\n    color: var(--ui-text);\n  }\n\n  .text-dimmed {\n    color: var(--ui-text-dimmed);\n  }\n\n  .text-error, .text-error\\/75 {\n    color: var(--ui-error);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .text-error\\/75 {\n      color: color-mix(in oklab, var(--ui-error) 75%, transparent);\n    }\n  }\n\n  .text-highlighted {\n    color: var(--ui-text-highlighted);\n  }\n\n  .text-info, .text-info\\/75 {\n    color: var(--ui-info);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .text-info\\/75 {\n      color: color-mix(in oklab, var(--ui-info) 75%, transparent);\n    }\n  }\n\n  .text-inherit {\n    color: inherit;\n  }\n\n  .text-inverted {\n    color: var(--ui-text-inverted);\n  }\n\n  .text-muted {\n    color: var(--ui-text-muted);\n  }\n\n  .text-primary, .text-primary\\/75 {\n    color: var(--ui-primary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .text-primary\\/75 {\n      color: color-mix(in oklab, var(--ui-primary) 75%, transparent);\n    }\n  }\n\n  .text-secondary, .text-secondary\\/75 {\n    color: var(--ui-secondary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .text-secondary\\/75 {\n      color: color-mix(in oklab, var(--ui-secondary) 75%, transparent);\n    }\n  }\n\n  .text-success, .text-success\\/75 {\n    color: var(--ui-success);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .text-success\\/75 {\n      color: color-mix(in oklab, var(--ui-success) 75%, transparent);\n    }\n  }\n\n  .text-toned {\n    color: var(--ui-text-toned);\n  }\n\n  .text-transparent {\n    color: #0000;\n  }\n\n  .text-warning, .text-warning\\/75 {\n    color: var(--ui-warning);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .text-warning\\/75 {\n      color: color-mix(in oklab, var(--ui-warning) 75%, transparent);\n    }\n  }\n\n  .capitalize {\n    text-transform: capitalize;\n  }\n\n  .lowercase {\n    text-transform: lowercase;\n  }\n\n  .normal-case {\n    text-transform: none;\n  }\n\n  .uppercase {\n    text-transform: uppercase;\n  }\n\n  .italic {\n    font-style: italic;\n  }\n\n  .not-italic {\n    font-style: normal;\n  }\n\n  .diagonal-fractions {\n    --tw-numeric-fraction: diagonal-fractions;\n    font-variant-numeric: var(--tw-ordinal, ) var(--tw-slashed-zero, ) var(--tw-numeric-figure, ) var(--tw-numeric-spacing, ) var(--tw-numeric-fraction, );\n  }\n\n  .lining-nums {\n    --tw-numeric-figure: lining-nums;\n    font-variant-numeric: var(--tw-ordinal, ) var(--tw-slashed-zero, ) var(--tw-numeric-figure, ) var(--tw-numeric-spacing, ) var(--tw-numeric-fraction, );\n  }\n\n  .oldstyle-nums {\n    --tw-numeric-figure: oldstyle-nums;\n    font-variant-numeric: var(--tw-ordinal, ) var(--tw-slashed-zero, ) var(--tw-numeric-figure, ) var(--tw-numeric-spacing, ) var(--tw-numeric-fraction, );\n  }\n\n  .ordinal {\n    --tw-ordinal: ordinal;\n    font-variant-numeric: var(--tw-ordinal, ) var(--tw-slashed-zero, ) var(--tw-numeric-figure, ) var(--tw-numeric-spacing, ) var(--tw-numeric-fraction, );\n  }\n\n  .proportional-nums {\n    --tw-numeric-spacing: proportional-nums;\n    font-variant-numeric: var(--tw-ordinal, ) var(--tw-slashed-zero, ) var(--tw-numeric-figure, ) var(--tw-numeric-spacing, ) var(--tw-numeric-fraction, );\n  }\n\n  .slashed-zero {\n    --tw-slashed-zero: slashed-zero;\n    font-variant-numeric: var(--tw-ordinal, ) var(--tw-slashed-zero, ) var(--tw-numeric-figure, ) var(--tw-numeric-spacing, ) var(--tw-numeric-fraction, );\n  }\n\n  .stacked-fractions {\n    --tw-numeric-fraction: stacked-fractions;\n    font-variant-numeric: var(--tw-ordinal, ) var(--tw-slashed-zero, ) var(--tw-numeric-figure, ) var(--tw-numeric-spacing, ) var(--tw-numeric-fraction, );\n  }\n\n  .tabular-nums {\n    --tw-numeric-spacing: tabular-nums;\n    font-variant-numeric: var(--tw-ordinal, ) var(--tw-slashed-zero, ) var(--tw-numeric-figure, ) var(--tw-numeric-spacing, ) var(--tw-numeric-fraction, );\n  }\n\n  .normal-nums {\n    font-variant-numeric: normal;\n  }\n\n  .line-through {\n    text-decoration-line: line-through;\n  }\n\n  .no-underline {\n    text-decoration-line: none;\n  }\n\n  .overline {\n    text-decoration-line: overline;\n  }\n\n  .underline {\n    text-decoration-line: underline;\n  }\n\n  .antialiased {\n    -webkit-font-smoothing: antialiased;\n    -moz-osx-font-smoothing: grayscale;\n  }\n\n  .subpixel-antialiased {\n    -webkit-font-smoothing: auto;\n    -moz-osx-font-smoothing: auto;\n  }\n\n  .opacity-\\(--reka-rating-item-step-opacity\\) {\n    opacity: var(--reka-rating-item-step-opacity);\n  }\n\n  .opacity-0 {\n    opacity: 0;\n  }\n\n  .opacity-75 {\n    opacity: .75;\n  }\n\n  .opacity-90 {\n    opacity: .9;\n  }\n\n  .opacity-100 {\n    opacity: 1;\n  }\n\n  .shadow {\n    --tw-shadow: 0 1px 3px 0 var(--tw-shadow-color, #0000001a), 0 1px 2px -1px var(--tw-shadow-color, #0000001a);\n    box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);\n  }\n\n  .shadow-lg {\n    --tw-shadow: 0 10px 15px -3px var(--tw-shadow-color, #0000001a), 0 4px 6px -4px var(--tw-shadow-color, #0000001a);\n    box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);\n  }\n\n  .shadow-sm {\n    --tw-shadow: 0 1px 3px 0 var(--tw-shadow-color, #0000001a), 0 1px 2px -1px var(--tw-shadow-color, #0000001a);\n    box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);\n  }\n\n  .shadow-xs {\n    --tw-shadow: 0 1px 2px 0 var(--tw-shadow-color, #0000000d);\n    box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);\n  }\n\n  .ring {\n    --tw-ring-shadow: var(--tw-ring-inset, ) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentcolor);\n    box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);\n  }\n\n  .ring-0 {\n    --tw-ring-shadow: var(--tw-ring-inset, ) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentcolor);\n    box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);\n  }\n\n  .ring-2 {\n    --tw-ring-shadow: var(--tw-ring-inset, ) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentcolor);\n    box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);\n  }\n\n  .ring-3 {\n    --tw-ring-shadow: var(--tw-ring-inset, ) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentcolor);\n    box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);\n  }\n\n  .inset-ring {\n    --tw-inset-ring-shadow: inset 0 0 0 1px var(--tw-inset-ring-color, currentcolor);\n    box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);\n  }\n\n  .ring-accented {\n    --tw-ring-color: var(--ui-border-accented);\n  }\n\n  .ring-bg {\n    --tw-ring-color: var(--ui-bg);\n  }\n\n  .ring-default {\n    --tw-ring-color: var(--ui-border);\n  }\n\n  .ring-error, .ring-error\\/25 {\n    --tw-ring-color: var(--ui-error);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .ring-error\\/25 {\n      --tw-ring-color: color-mix(in oklab, var(--ui-error) 25%, transparent);\n    }\n  }\n\n  .ring-error\\/50 {\n    --tw-ring-color: var(--ui-error);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .ring-error\\/50 {\n      --tw-ring-color: color-mix(in oklab, var(--ui-error) 50%, transparent);\n    }\n  }\n\n  .ring-info, .ring-info\\/25 {\n    --tw-ring-color: var(--ui-info);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .ring-info\\/25 {\n      --tw-ring-color: color-mix(in oklab, var(--ui-info) 25%, transparent);\n    }\n  }\n\n  .ring-info\\/50 {\n    --tw-ring-color: var(--ui-info);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .ring-info\\/50 {\n      --tw-ring-color: color-mix(in oklab, var(--ui-info) 50%, transparent);\n    }\n  }\n\n  .ring-inverted {\n    --tw-ring-color: var(--ui-border-inverted);\n  }\n\n  .ring-primary, .ring-primary\\/25 {\n    --tw-ring-color: var(--ui-primary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .ring-primary\\/25 {\n      --tw-ring-color: color-mix(in oklab, var(--ui-primary) 25%, transparent);\n    }\n  }\n\n  .ring-primary\\/50 {\n    --tw-ring-color: var(--ui-primary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .ring-primary\\/50 {\n      --tw-ring-color: color-mix(in oklab, var(--ui-primary) 50%, transparent);\n    }\n  }\n\n  .ring-secondary, .ring-secondary\\/25 {\n    --tw-ring-color: var(--ui-secondary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .ring-secondary\\/25 {\n      --tw-ring-color: color-mix(in oklab, var(--ui-secondary) 25%, transparent);\n    }\n  }\n\n  .ring-secondary\\/50 {\n    --tw-ring-color: var(--ui-secondary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .ring-secondary\\/50 {\n      --tw-ring-color: color-mix(in oklab, var(--ui-secondary) 50%, transparent);\n    }\n  }\n\n  .ring-success, .ring-success\\/25 {\n    --tw-ring-color: var(--ui-success);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .ring-success\\/25 {\n      --tw-ring-color: color-mix(in oklab, var(--ui-success) 25%, transparent);\n    }\n  }\n\n  .ring-success\\/50 {\n    --tw-ring-color: var(--ui-success);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .ring-success\\/50 {\n      --tw-ring-color: color-mix(in oklab, var(--ui-success) 50%, transparent);\n    }\n  }\n\n  .ring-warning, .ring-warning\\/25 {\n    --tw-ring-color: var(--ui-warning);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .ring-warning\\/25 {\n      --tw-ring-color: color-mix(in oklab, var(--ui-warning) 25%, transparent);\n    }\n  }\n\n  .ring-warning\\/50 {\n    --tw-ring-color: var(--ui-warning);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .ring-warning\\/50 {\n      --tw-ring-color: color-mix(in oklab, var(--ui-warning) 50%, transparent);\n    }\n  }\n\n  .ring-white {\n    --tw-ring-color: var(--color-white);\n  }\n\n  .outline-hidden {\n    --tw-outline-style: none;\n    outline-style: none;\n  }\n\n  @media (forced-colors: active) {\n    .outline-hidden {\n      outline-offset: 2px;\n      outline: 2px solid #0000;\n    }\n  }\n\n  .outline {\n    outline-style: var(--tw-outline-style);\n    outline-width: 1px;\n  }\n\n  .-outline-offset-3 {\n    outline-offset: calc(3px * -1);\n  }\n\n  .outline-\\(--ui-bg\\)\\/25 {\n    outline-color: var(--ui-bg);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .outline-\\(--ui-bg\\)\\/25 {\n      outline-color: color-mix(in oklab, var(--ui-bg) 25%, transparent);\n    }\n  }\n\n  .outline-error, .outline-error\\/25 {\n    outline-color: var(--ui-error);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .outline-error\\/25 {\n      outline-color: color-mix(in oklab, var(--ui-error) 25%, transparent);\n    }\n  }\n\n  .outline-info, .outline-info\\/25 {\n    outline-color: var(--ui-info);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .outline-info\\/25 {\n      outline-color: color-mix(in oklab, var(--ui-info) 25%, transparent);\n    }\n  }\n\n  .outline-inverted, .outline-inverted\\/25 {\n    outline-color: var(--ui-border-inverted);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .outline-inverted\\/25 {\n      outline-color: color-mix(in oklab, var(--ui-border-inverted) 25%, transparent);\n    }\n  }\n\n  .outline-primary, .outline-primary\\/25 {\n    outline-color: var(--ui-primary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .outline-primary\\/25 {\n      outline-color: color-mix(in oklab, var(--ui-primary) 25%, transparent);\n    }\n  }\n\n  .outline-secondary, .outline-secondary\\/25 {\n    outline-color: var(--ui-secondary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .outline-secondary\\/25 {\n      outline-color: color-mix(in oklab, var(--ui-secondary) 25%, transparent);\n    }\n  }\n\n  .outline-success, .outline-success\\/25 {\n    outline-color: var(--ui-success);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .outline-success\\/25 {\n      outline-color: color-mix(in oklab, var(--ui-success) 25%, transparent);\n    }\n  }\n\n  .outline-warning, .outline-warning\\/25 {\n    outline-color: var(--ui-warning);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .outline-warning\\/25 {\n      outline-color: color-mix(in oklab, var(--ui-warning) 25%, transparent);\n    }\n  }\n\n  .blur {\n    --tw-blur: blur(8px);\n    filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );\n  }\n\n  .drop-shadow {\n    --tw-drop-shadow-size: drop-shadow(0 1px 2px var(--tw-drop-shadow-color, #0000001a)) drop-shadow(0 1px 1px var(--tw-drop-shadow-color, #0000000f));\n    --tw-drop-shadow: drop-shadow(0 1px 2px #0000001a) drop-shadow(0 1px 1px #0000000f);\n    filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );\n  }\n\n  .grayscale {\n    --tw-grayscale: grayscale(100%);\n    filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );\n  }\n\n  .invert {\n    --tw-invert: invert(100%);\n    filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );\n  }\n\n  .sepia {\n    --tw-sepia: sepia(100%);\n    filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );\n  }\n\n  .filter {\n    filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );\n  }\n\n  .backdrop-blur {\n    --tw-backdrop-blur: blur(8px);\n    -webkit-backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );\n    backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );\n  }\n\n  .backdrop-blur-sm {\n    --tw-backdrop-blur: blur(var(--blur-sm));\n    -webkit-backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );\n    backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );\n  }\n\n  .backdrop-grayscale {\n    --tw-backdrop-grayscale: grayscale(100%);\n    -webkit-backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );\n    backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );\n  }\n\n  .backdrop-invert {\n    --tw-backdrop-invert: invert(100%);\n    -webkit-backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );\n    backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );\n  }\n\n  .backdrop-sepia {\n    --tw-backdrop-sepia: sepia(100%);\n    -webkit-backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );\n    backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );\n  }\n\n  .backdrop-filter {\n    -webkit-backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );\n    backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );\n  }\n\n  .transition {\n    transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to, opacity, box-shadow, transform, translate, scale, rotate, filter, -webkit-backdrop-filter, backdrop-filter, display, content-visibility, overlay, pointer-events;\n    transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));\n    transition-duration: var(--tw-duration, var(--default-transition-duration));\n  }\n\n  .transition-\\[background\\] {\n    transition-property: background;\n    transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));\n    transition-duration: var(--tw-duration, var(--default-transition-duration));\n  }\n\n  .transition-\\[box-shadow\\,border-radius\\] {\n    transition-property: box-shadow, border-radius;\n    transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));\n    transition-duration: var(--tw-duration, var(--default-transition-duration));\n  }\n\n  .transition-\\[color\\,opacity\\] {\n    transition-property: color, opacity;\n    transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));\n    transition-duration: var(--tw-duration, var(--default-transition-duration));\n  }\n\n  .transition-\\[height\\] {\n    transition-property: height;\n    transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));\n    transition-duration: var(--tw-duration, var(--default-transition-duration));\n  }\n\n  .transition-\\[inset-inline-start\\,inset-inline-end\\,width\\] {\n    transition-property: inset-inline-start, inset-inline-end, width;\n    transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));\n    transition-duration: var(--tw-duration, var(--default-transition-duration));\n  }\n\n  .transition-\\[rotate\\,opacity\\] {\n    transition-property: rotate, opacity;\n    transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));\n    transition-duration: var(--tw-duration, var(--default-transition-duration));\n  }\n\n  .transition-\\[top\\,left\\] {\n    transition-property: top, left;\n    transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));\n    transition-duration: var(--tw-duration, var(--default-transition-duration));\n  }\n\n  .transition-\\[transform\\,translate\\,height\\] {\n    transition-property: transform, translate, height;\n    transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));\n    transition-duration: var(--tw-duration, var(--default-transition-duration));\n  }\n\n  .transition-\\[translate\\,width\\] {\n    transition-property: translate, width;\n    transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));\n    transition-duration: var(--tw-duration, var(--default-transition-duration));\n  }\n\n  .transition-\\[width\\,height\\,left\\,right\\] {\n    transition-property: width, height, left, right;\n    transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));\n    transition-duration: var(--tw-duration, var(--default-transition-duration));\n  }\n\n  .transition-\\[width\\] {\n    transition-property: width;\n    transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));\n    transition-duration: var(--tw-duration, var(--default-transition-duration));\n  }\n\n  .transition-colors {\n    transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to;\n    transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));\n    transition-duration: var(--tw-duration, var(--default-transition-duration));\n  }\n\n  .transition-opacity {\n    transition-property: opacity;\n    transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));\n    transition-duration: var(--tw-duration, var(--default-transition-duration));\n  }\n\n  .transition-transform {\n    transition-property: transform, translate, scale, rotate;\n    transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));\n    transition-duration: var(--tw-duration, var(--default-transition-duration));\n  }\n\n  .duration-150 {\n    --tw-duration: .15s;\n    transition-duration: .15s;\n  }\n\n  .duration-200 {\n    --tw-duration: .2s;\n    transition-duration: .2s;\n  }\n\n  .ease-in-out {\n    --tw-ease: var(--ease-in-out);\n    transition-timing-function: var(--ease-in-out);\n  }\n\n  .ease-out {\n    --tw-ease: var(--ease-out);\n    transition-timing-function: var(--ease-out);\n  }\n\n  .will-change-\\[background-position\\] {\n    will-change: background-position;\n  }\n\n  .will-change-\\[height\\] {\n    will-change: height;\n  }\n\n  .outline-none {\n    --tw-outline-style: none;\n    outline-style: none;\n  }\n\n  .select-none {\n    -webkit-user-select: none;\n    user-select: none;\n  }\n\n  .\\!\\[animation-direction\\:reverse\\] {\n    animation-direction: reverse !important;\n  }\n\n  .\\[--duration\\:20s\\] {\n    --duration: 20s;\n  }\n\n  .\\[--gap\\:--spacing\\(16\\)\\] {\n    --gap: calc(var(--spacing) * 16);\n  }\n\n  .\\[--initial-transform\\:calc\\(100\\%\\+1\\.5rem\\)\\] {\n    --initial-transform: calc(100% + 1.5rem);\n  }\n\n  .\\[--sidebar-width-icon\\:4rem\\] {\n    --sidebar-width-icon: 4rem;\n  }\n\n  .\\[--sidebar-width\\:16rem\\] {\n    --sidebar-width: 16rem;\n  }\n\n  .\\[--spotlight-color\\:var\\(--ui-bg-inverted\\)\\] {\n    --spotlight-color: var(--ui-bg-inverted);\n  }\n\n  .\\[--spotlight-color\\:var\\(--ui-error\\)\\] {\n    --spotlight-color: var(--ui-error);\n  }\n\n  .\\[--spotlight-color\\:var\\(--ui-info\\)\\] {\n    --spotlight-color: var(--ui-info);\n  }\n\n  .\\[--spotlight-color\\:var\\(--ui-primary\\)\\] {\n    --spotlight-color: var(--ui-primary);\n  }\n\n  .\\[--spotlight-color\\:var\\(--ui-secondary\\)\\] {\n    --spotlight-color: var(--ui-secondary);\n  }\n\n  .\\[--spotlight-color\\:var\\(--ui-success\\)\\] {\n    --spotlight-color: var(--ui-success);\n  }\n\n  .\\[--spotlight-color\\:var\\(--ui-warning\\)\\] {\n    --spotlight-color: var(--ui-warning);\n  }\n\n  .\\[--spotlight-size\\:400px\\] {\n    --spotlight-size: 400px;\n  }\n\n  .\\[--ts-chart-tooltip-background\\:var\\(--ui-bg\\)\\] {\n    --ts-chart-tooltip-background: var(--ui-bg);\n  }\n\n  .\\[--ts-chart-tooltip-border-radius\\:var\\(--radius-sm\\)\\] {\n    --ts-chart-tooltip-border-radius: var(--radius-sm);\n  }\n\n  .\\[--ts-chart-tooltip-border\\:1px_solid_var\\(--ui-border\\)\\] {\n    --ts-chart-tooltip-border: 1px solid var(--ui-border);\n  }\n\n  .\\[--ts-chart-tooltip-color\\:var\\(--ui-text-highlighted\\)\\] {\n    --ts-chart-tooltip-color: var(--ui-text-highlighted);\n  }\n\n  .\\[--ts-chart-tooltip-font\\:inherit\\] {\n    --ts-chart-tooltip-font: inherit;\n  }\n\n  .\\[--ts-chart-tooltip-padding\\:--spacing\\(1\\.5\\)_--spacing\\(2\\.5\\)\\] {\n    --ts-chart-tooltip-padding: calc(var(--spacing) * 1.5) calc(var(--spacing) * 2.5);\n  }\n\n  .\\[--ts-chart-tooltip-shadow\\:var\\(--shadow-sm\\)\\] {\n    --ts-chart-tooltip-shadow: var(--shadow-sm);\n  }\n\n  .backface-hidden {\n    backface-visibility: hidden;\n  }\n\n  :where(.divide-x-reverse > :not(:last-child)) {\n    --tw-divide-x-reverse: 1;\n  }\n\n  .ring-inset {\n    --tw-ring-inset: inset;\n  }\n\n  :is(.\\*\\:my-5 > *) {\n    margin-block: calc(var(--spacing) * 5);\n  }\n\n  :is(.\\*\\:size-2 > *) {\n    width: calc(var(--spacing) * 2);\n    height: calc(var(--spacing) * 2);\n  }\n\n  :is(.\\*\\:break-inside-avoid-column > *) {\n    break-inside: avoid-column;\n  }\n\n  :is(.\\*\\:rounded-full > *) {\n    border-radius: 2147483647px;\n  }\n\n  :is(.\\*\\:bg-elevated > *) {\n    background-color: var(--ui-bg-elevated);\n  }\n\n  :is(.\\*\\:pt-8 > *) {\n    padding-top: calc(var(--spacing) * 8);\n  }\n\n  :is(.\\*\\:will-change-transform > *) {\n    will-change: transform;\n  }\n\n  .not-last\\:not-first\\:rounded-none:not(:last-child):not(:first-child) {\n    border-radius: 0;\n  }\n\n  .not-has-disabled\\:border-error:not(:has(:disabled)) {\n    border-color: var(--ui-error);\n  }\n\n  .not-has-disabled\\:border-info:not(:has(:disabled)) {\n    border-color: var(--ui-info);\n  }\n\n  .not-has-disabled\\:border-inverted:not(:has(:disabled)) {\n    border-color: var(--ui-border-inverted);\n  }\n\n  .not-has-disabled\\:border-primary:not(:has(:disabled)) {\n    border-color: var(--ui-primary);\n  }\n\n  .not-has-disabled\\:border-secondary:not(:has(:disabled)) {\n    border-color: var(--ui-secondary);\n  }\n\n  .not-has-disabled\\:border-success:not(:has(:disabled)) {\n    border-color: var(--ui-success);\n  }\n\n  .not-has-disabled\\:border-warning:not(:has(:disabled)) {\n    border-color: var(--ui-warning);\n  }\n\n  .not-has-disabled\\:not-has-aria-disabled\\:border-error:not(:has(:disabled)):not(:has([aria-disabled=\"true\"])) {\n    border-color: var(--ui-error);\n  }\n\n  .not-has-disabled\\:not-has-aria-disabled\\:border-info:not(:has(:disabled)):not(:has([aria-disabled=\"true\"])) {\n    border-color: var(--ui-info);\n  }\n\n  .not-has-disabled\\:not-has-aria-disabled\\:border-inverted:not(:has(:disabled)):not(:has([aria-disabled=\"true\"])) {\n    border-color: var(--ui-border-inverted);\n  }\n\n  .not-has-disabled\\:not-has-aria-disabled\\:border-primary:not(:has(:disabled)):not(:has([aria-disabled=\"true\"])) {\n    border-color: var(--ui-primary);\n  }\n\n  .not-has-disabled\\:not-has-aria-disabled\\:border-secondary:not(:has(:disabled)):not(:has([aria-disabled=\"true\"])) {\n    border-color: var(--ui-secondary);\n  }\n\n  .not-has-disabled\\:not-has-aria-disabled\\:border-success:not(:has(:disabled)):not(:has([aria-disabled=\"true\"])) {\n    border-color: var(--ui-success);\n  }\n\n  .not-has-disabled\\:not-has-aria-disabled\\:border-warning:not(:has(:disabled)):not(:has([aria-disabled=\"true\"])) {\n    border-color: var(--ui-warning);\n  }\n\n  .not-data-\\[segment\\=literal\\]\\:w-8:not([data-segment=\"literal\"]) {\n    width: calc(var(--spacing) * 8);\n  }\n\n  .not-data-\\[segment\\=literal\\]\\:w-9:not([data-segment=\"literal\"]) {\n    width: calc(var(--spacing) * 9);\n  }\n\n  .not-data-\\[segment\\=literal\\]\\:w-10:not([data-segment=\"literal\"]) {\n    width: calc(var(--spacing) * 10);\n  }\n\n  :is(:where(.group):not(:first-child) :is(:where(.group):not(:last-child) .group-not-last\\:group-not-first\\:rounded-none)) {\n    border-radius: 0;\n  }\n\n  :is(:where(.group):first-child :is(:where(.group):not(:only-child) .group-not-only\\:group-first\\:rounded-e-none)) {\n    border-start-end-radius: 0;\n    border-end-end-radius: 0;\n  }\n\n  :is(:where(.group):first-child :is(:where(.group):not(:only-child) .group-not-only\\:group-first\\:rounded-b-none)) {\n    border-bottom-right-radius: 0;\n    border-bottom-left-radius: 0;\n  }\n\n  :is(:where(.group):last-child :is(:where(.group):not(:only-child) .group-not-only\\:group-last\\:rounded-s-none)) {\n    border-start-start-radius: 0;\n    border-end-start-radius: 0;\n  }\n\n  :is(:where(.group):last-child :is(:where(.group):not(:only-child) .group-not-only\\:group-last\\:rounded-t-none)) {\n    border-top-left-radius: 0;\n    border-top-right-radius: 0;\n  }\n\n  @media (hover: hover) {\n    :is(:where(.group):hover .group-hover\\:bg-primary) {\n      background-color: var(--ui-primary);\n    }\n\n    :is(:where(.group):hover .group-hover\\:text-default) {\n      color: var(--ui-text);\n    }\n\n    :is(:where(.group):hover .group-hover\\:text-inverted) {\n      color: var(--ui-text-inverted);\n    }\n\n    :is(:where(.group):hover .group-hover\\:opacity-0) {\n      opacity: 0;\n    }\n\n    :is(:where(.group):hover .group-hover\\:opacity-100) {\n      opacity: 1;\n    }\n\n    :is(:where(.group):hover .group-hover\\:ring-primary) {\n      --tw-ring-color: var(--ui-primary);\n    }\n\n    :is(:where(.group):hover .group-hover\\:\\[animation-play-state\\:paused\\]) {\n      animation-play-state: paused;\n    }\n\n    :is(:where(.group\\/blog-post):hover .group-hover\\/blog-post\\:scale-110) {\n      --tw-scale-x: 110%;\n      --tw-scale-y: 110%;\n      --tw-scale-z: 110%;\n      scale: var(--tw-scale-x) var(--tw-scale-y);\n    }\n\n    :is(:where(.group\\/blog-post):hover .group-hover\\/blog-post\\:rounded-e-none) {\n      border-start-end-radius: 0;\n      border-end-end-radius: 0;\n    }\n\n    :is(:where(.group\\/blog-post):hover .group-hover\\/blog-post\\:rounded-b-none) {\n      border-bottom-right-radius: 0;\n      border-bottom-left-radius: 0;\n    }\n\n    :is(:where(.group\\/blog-post):hover .group-hover\\/blog-post\\:shadow-none) {\n      --tw-shadow: 0 0 #0000;\n      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);\n    }\n\n    :is(:where(.group\\/changelog-version-image):hover .group-hover\\/changelog-version-image\\:scale-105) {\n      --tw-scale-x: 105%;\n      --tw-scale-y: 105%;\n      --tw-scale-z: 105%;\n      scale: var(--tw-scale-x) var(--tw-scale-y);\n    }\n\n    :is(:where(.group\\/message):hover .group-hover\\/message\\:opacity-100) {\n      opacity: 1;\n    }\n\n    :is(:where(.group\\/user):hover .group-hover\\/user\\:scale-115) {\n      --tw-scale-x: 115%;\n      --tw-scale-y: 115%;\n      --tw-scale-z: 115%;\n      scale: var(--tw-scale-x) var(--tw-scale-y);\n    }\n  }\n\n  :is(:where(.group\\/changelog-version-image):has(:focus-visible) .group-has-focus-visible\\/changelog-version-image\\:scale-105) {\n    --tw-scale-x: 105%;\n    --tw-scale-y: 105%;\n    --tw-scale-z: 105%;\n    scale: var(--tw-scale-x) var(--tw-scale-y);\n  }\n\n  :is(:where(.group\\/user):has(:focus-visible) .group-has-focus-visible\\/user\\:scale-115) {\n    --tw-scale-x: 115%;\n    --tw-scale-y: 115%;\n    --tw-scale-z: 115%;\n    scale: var(--tw-scale-x) var(--tw-scale-y);\n  }\n\n  :is(:where(.group)[data-expanded] .group-data-expanded\\:rotate-180) {\n    rotate: 180deg;\n  }\n\n  :is(:where(.group)[data-highlighted] .group-data-highlighted\\:inline-flex) {\n    display: inline-flex;\n  }\n\n  :is(:where(.group)[data-highlighted] .group-data-highlighted\\:text-default) {\n    color: var(--ui-text);\n  }\n\n  :is(:where(.group)[data-highlighted] .group-data-highlighted\\:text-error) {\n    color: var(--ui-error);\n  }\n\n  :is(:where(.group)[data-highlighted] .group-data-highlighted\\:text-info) {\n    color: var(--ui-info);\n  }\n\n  :is(:where(.group)[data-highlighted] .group-data-highlighted\\:text-primary) {\n    color: var(--ui-primary);\n  }\n\n  :is(:where(.group)[data-highlighted] .group-data-highlighted\\:text-secondary) {\n    color: var(--ui-secondary);\n  }\n\n  :is(:where(.group)[data-highlighted] .group-data-highlighted\\:text-success) {\n    color: var(--ui-success);\n  }\n\n  :is(:where(.group)[data-highlighted] .group-data-highlighted\\:text-warning) {\n    color: var(--ui-warning);\n  }\n\n  :is(:where(.group)[data-highlighted] .group-data-highlighted\\:not-group-data-disabled\\:text-default):not(:is(:where(.group)[data-disabled] *)) {\n    color: var(--ui-text);\n  }\n\n  :is(:where(.group)[data-disabled] .group-data-\\[disabled\\]\\:opacity-75) {\n    opacity: .75;\n  }\n\n  :is(:where(.group)[data-state=\"active\"] .group-data-\\[state\\=active\\]\\:bg-error) {\n    background-color: var(--ui-error);\n  }\n\n  :is(:where(.group)[data-state=\"active\"] .group-data-\\[state\\=active\\]\\:bg-info) {\n    background-color: var(--ui-info);\n  }\n\n  :is(:where(.group)[data-state=\"active\"] .group-data-\\[state\\=active\\]\\:bg-inverted) {\n    background-color: var(--ui-bg-inverted);\n  }\n\n  :is(:where(.group)[data-state=\"active\"] .group-data-\\[state\\=active\\]\\:bg-primary) {\n    background-color: var(--ui-primary);\n  }\n\n  :is(:where(.group)[data-state=\"active\"] .group-data-\\[state\\=active\\]\\:bg-secondary) {\n    background-color: var(--ui-secondary);\n  }\n\n  :is(:where(.group)[data-state=\"active\"] .group-data-\\[state\\=active\\]\\:bg-success) {\n    background-color: var(--ui-success);\n  }\n\n  :is(:where(.group)[data-state=\"active\"] .group-data-\\[state\\=active\\]\\:bg-warning) {\n    background-color: var(--ui-warning);\n  }\n\n  :is(:where(.group)[data-state=\"active\"] .group-data-\\[state\\=active\\]\\:text-inverted) {\n    color: var(--ui-text-inverted);\n  }\n\n  :is(:where(.group)[data-state=\"checked\"] .group-data-\\[state\\=checked\\]\\:text-error) {\n    color: var(--ui-error);\n  }\n\n  :is(:where(.group)[data-state=\"checked\"] .group-data-\\[state\\=checked\\]\\:text-highlighted) {\n    color: var(--ui-text-highlighted);\n  }\n\n  :is(:where(.group)[data-state=\"checked\"] .group-data-\\[state\\=checked\\]\\:text-info) {\n    color: var(--ui-info);\n  }\n\n  :is(:where(.group)[data-state=\"checked\"] .group-data-\\[state\\=checked\\]\\:text-primary) {\n    color: var(--ui-primary);\n  }\n\n  :is(:where(.group)[data-state=\"checked\"] .group-data-\\[state\\=checked\\]\\:text-secondary) {\n    color: var(--ui-secondary);\n  }\n\n  :is(:where(.group)[data-state=\"checked\"] .group-data-\\[state\\=checked\\]\\:text-success) {\n    color: var(--ui-success);\n  }\n\n  :is(:where(.group)[data-state=\"checked\"] .group-data-\\[state\\=checked\\]\\:text-warning) {\n    color: var(--ui-warning);\n  }\n\n  :is(:where(.group)[data-state=\"checked\"] .group-data-\\[state\\=checked\\]\\:opacity-100) {\n    opacity: 1;\n  }\n\n  :is(:where(.group\\/sidebar)[data-state=\"collapsed\"] .group-data-\\[state\\=collapsed\\]\\/sidebar\\:hidden) {\n    display: none;\n  }\n\n  :is(:where(.group\\/sidebar)[data-state=\"collapsed\"] .group-data-\\[state\\=collapsed\\]\\/sidebar\\:overflow-hidden) {\n    overflow: hidden;\n  }\n\n  :is(:where(.group)[data-state=\"completed\"] .group-data-\\[state\\=completed\\]\\:bg-error) {\n    background-color: var(--ui-error);\n  }\n\n  :is(:where(.group)[data-state=\"completed\"] .group-data-\\[state\\=completed\\]\\:bg-info) {\n    background-color: var(--ui-info);\n  }\n\n  :is(:where(.group)[data-state=\"completed\"] .group-data-\\[state\\=completed\\]\\:bg-inverted) {\n    background-color: var(--ui-bg-inverted);\n  }\n\n  :is(:where(.group)[data-state=\"completed\"] .group-data-\\[state\\=completed\\]\\:bg-primary) {\n    background-color: var(--ui-primary);\n  }\n\n  :is(:where(.group)[data-state=\"completed\"] .group-data-\\[state\\=completed\\]\\:bg-secondary) {\n    background-color: var(--ui-secondary);\n  }\n\n  :is(:where(.group)[data-state=\"completed\"] .group-data-\\[state\\=completed\\]\\:bg-success) {\n    background-color: var(--ui-success);\n  }\n\n  :is(:where(.group)[data-state=\"completed\"] .group-data-\\[state\\=completed\\]\\:bg-warning) {\n    background-color: var(--ui-warning);\n  }\n\n  :is(:where(.group)[data-state=\"completed\"] .group-data-\\[state\\=completed\\]\\:text-inverted) {\n    color: var(--ui-text-inverted);\n  }\n\n  :is(:where(.group)[data-state=\"open\"] .group-data-\\[state\\=open\\]\\:rotate-180) {\n    rotate: 180deg;\n  }\n\n  :is(:where(.group)[data-state=\"open\"] .group-data-\\[state\\=open\\]\\:text-default) {\n    color: var(--ui-text);\n  }\n\n  :is(:where(.group)[data-state=\"open\"] .group-data-\\[state\\=open\\]\\:text-error) {\n    color: var(--ui-error);\n  }\n\n  :is(:where(.group)[data-state=\"open\"] .group-data-\\[state\\=open\\]\\:text-highlighted) {\n    color: var(--ui-text-highlighted);\n  }\n\n  :is(:where(.group)[data-state=\"open\"] .group-data-\\[state\\=open\\]\\:text-info) {\n    color: var(--ui-info);\n  }\n\n  :is(:where(.group)[data-state=\"open\"] .group-data-\\[state\\=open\\]\\:text-primary) {\n    color: var(--ui-primary);\n  }\n\n  :is(:where(.group)[data-state=\"open\"] .group-data-\\[state\\=open\\]\\:text-secondary) {\n    color: var(--ui-secondary);\n  }\n\n  :is(:where(.group)[data-state=\"open\"] .group-data-\\[state\\=open\\]\\:text-success) {\n    color: var(--ui-success);\n  }\n\n  :is(:where(.group)[data-state=\"open\"] .group-data-\\[state\\=open\\]\\:text-warning) {\n    color: var(--ui-warning);\n  }\n\n  :is(:where(.group)[data-state=\"open\"] .group-data-\\[state\\=open\\]\\:opacity-0) {\n    opacity: 0;\n  }\n\n  :is(:where(.group)[data-state=\"open\"] .group-data-\\[state\\=open\\]\\:opacity-100) {\n    opacity: 1;\n  }\n\n  :is(:where(.group)[data-state=\"unchecked\"] .group-data-\\[state\\=unchecked\\]\\:text-dimmed) {\n    color: var(--ui-text-dimmed);\n  }\n\n  :is(:where(.group)[data-state=\"unchecked\"] .group-data-\\[state\\=unchecked\\]\\:opacity-100) {\n    opacity: 1;\n  }\n\n  @media (hover: hover) {\n    :is(:where(.peer):hover ~ .peer-hover\\:text-highlighted) {\n      color: var(--ui-text-highlighted);\n    }\n\n    :is(:where(.peer):hover ~ .peer-hover\\:text-toned) {\n      color: var(--ui-text-toned);\n    }\n  }\n\n  :is(:where(.peer):focus-visible ~ .peer-focus-visible\\:text-highlighted) {\n    color: var(--ui-text-highlighted);\n  }\n\n  :is(:where(.peer):focus-visible ~ .peer-focus-visible\\:text-toned) {\n    color: var(--ui-text-toned);\n  }\n\n  .selection\\:bg-primary\\/20 ::selection {\n    background-color: var(--ui-primary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .selection\\:bg-primary\\/20 ::selection {\n      background-color: color-mix(in oklab, var(--ui-primary) 20%, transparent);\n    }\n  }\n\n  .selection\\:bg-primary\\/20::selection {\n    background-color: var(--ui-primary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .selection\\:bg-primary\\/20::selection {\n      background-color: color-mix(in oklab, var(--ui-primary) 20%, transparent);\n    }\n  }\n\n  .file\\:me-1\\.5::file-selector-button {\n    margin-inline-end: calc(var(--spacing) * 1.5);\n  }\n\n  .file\\:font-medium::file-selector-button {\n    --tw-font-weight: var(--font-weight-medium);\n    font-weight: var(--font-weight-medium);\n  }\n\n  .file\\:text-muted::file-selector-button {\n    color: var(--ui-text-muted);\n  }\n\n  .file\\:outline-none::file-selector-button {\n    --tw-outline-style: none;\n    outline-style: none;\n  }\n\n  .placeholder\\:text-dimmed::placeholder {\n    color: var(--ui-text-dimmed);\n  }\n\n  .before\\:pointer-events-none:before {\n    content: var(--tw-content);\n    pointer-events: none;\n  }\n\n  .before\\:absolute:before {\n    content: var(--tw-content);\n    position: absolute;\n  }\n\n  .before\\:-inset-px:before {\n    content: var(--tw-content);\n    inset: -1px;\n  }\n\n  .before\\:inset-px:before {\n    content: var(--tw-content);\n    inset: 1px;\n  }\n\n  .before\\:inset-x-0:before {\n    content: var(--tw-content);\n    inset-inline: 0;\n  }\n\n  .before\\:inset-x-px:before {\n    content: var(--tw-content);\n    inset-inline: 1px;\n  }\n\n  .before\\:inset-y-0:before {\n    content: var(--tw-content);\n    inset-block: 0;\n  }\n\n  .before\\:inset-y-px:before {\n    content: var(--tw-content);\n    inset-block: 1px;\n  }\n\n  .before\\:start-0:before {\n    content: var(--tw-content);\n    inset-inline-start: calc(var(--spacing) * 0);\n  }\n\n  .before\\:top-0:before {\n    content: var(--tw-content);\n    top: 0;\n  }\n\n  .before\\:-right-1\\.5:before {\n    content: var(--tw-content);\n    right: calc(var(--spacing) * -1.5);\n  }\n\n  .before\\:-left-1\\.5:before {\n    content: var(--tw-content);\n    left: calc(var(--spacing) * -1.5);\n  }\n\n  .before\\:z-1:before {\n    content: var(--tw-content);\n    z-index: 1;\n  }\n\n  .before\\:z-2:before {\n    content: var(--tw-content);\n    z-index: 2;\n  }\n\n  .before\\:z-\\[-1\\]:before {\n    content: var(--tw-content);\n    z-index: -1;\n  }\n\n  .before\\:h-1\\/3:before {\n    content: var(--tw-content);\n    height: 33.3333%;\n  }\n\n  .before\\:h-full:before {\n    content: var(--tw-content);\n    height: 100%;\n  }\n\n  .before\\:w-1\\/3:before {\n    content: var(--tw-content);\n    width: 33.3333%;\n  }\n\n  .before\\:w-full:before {\n    content: var(--tw-content);\n    width: 100%;\n  }\n\n  .before\\:rounded-\\[inherit\\]:before {\n    content: var(--tw-content);\n    border-radius: inherit;\n  }\n\n  .before\\:rounded-md:before {\n    content: var(--tw-content);\n    border-radius: calc(var(--ui-radius) * 1.5);\n  }\n\n  .before\\:bg-elevated:before, .before\\:bg-elevated\\/75:before {\n    content: var(--tw-content);\n    background-color: var(--ui-bg-elevated);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .before\\:bg-elevated\\/75:before {\n      background-color: color-mix(in oklab, var(--ui-bg-elevated) 75%, transparent);\n    }\n  }\n\n  .before\\:bg-error\\/10:before {\n    content: var(--tw-content);\n    background-color: var(--ui-error);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .before\\:bg-error\\/10:before {\n      background-color: color-mix(in oklab, var(--ui-error) 10%, transparent);\n    }\n  }\n\n  .before\\:bg-info\\/10:before {\n    content: var(--tw-content);\n    background-color: var(--ui-info);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .before\\:bg-info\\/10:before {\n      background-color: color-mix(in oklab, var(--ui-info) 10%, transparent);\n    }\n  }\n\n  .before\\:bg-primary\\/10:before {\n    content: var(--tw-content);\n    background-color: var(--ui-primary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .before\\:bg-primary\\/10:before {\n      background-color: color-mix(in oklab, var(--ui-primary) 10%, transparent);\n    }\n  }\n\n  .before\\:bg-secondary\\/10:before {\n    content: var(--tw-content);\n    background-color: var(--ui-secondary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .before\\:bg-secondary\\/10:before {\n      background-color: color-mix(in oklab, var(--ui-secondary) 10%, transparent);\n    }\n  }\n\n  .before\\:bg-success\\/10:before {\n    content: var(--tw-content);\n    background-color: var(--ui-success);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .before\\:bg-success\\/10:before {\n      background-color: color-mix(in oklab, var(--ui-success) 10%, transparent);\n    }\n  }\n\n  .before\\:bg-warning\\/10:before {\n    content: var(--tw-content);\n    background-color: var(--ui-warning);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .before\\:bg-warning\\/10:before {\n      background-color: color-mix(in oklab, var(--ui-warning) 10%, transparent);\n    }\n  }\n\n  .before\\:bg-gradient-to-b:before {\n    content: var(--tw-content);\n    --tw-gradient-position: to bottom in oklab;\n    background-image: linear-gradient(var(--tw-gradient-stops));\n  }\n\n  .before\\:bg-gradient-to-r:before {\n    content: var(--tw-content);\n    --tw-gradient-position: to right in oklab;\n    background-image: linear-gradient(var(--tw-gradient-stops));\n  }\n\n  .before\\:bg-\\[radial-gradient\\(var\\(--spotlight-size\\)_var\\(--spotlight-size\\)_at_calc\\(var\\(--spotlight-x\\,0px\\)\\)_calc\\(var\\(--spotlight-y\\,0px\\)\\)\\,var\\(--spotlight-color\\)\\,transparent_70\\%\\)\\]:before {\n    content: var(--tw-content);\n    background-image: radial-gradient(var(--spotlight-size) var(--spotlight-size) at calc(var(--spotlight-x, 0px)) calc(var(--spotlight-y, 0px)),var(--spotlight-color),transparent 70%);\n  }\n\n  .before\\:from-default:before {\n    content: var(--tw-content);\n    --tw-gradient-from: var(--ui-bg);\n    --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));\n  }\n\n  .before\\:to-transparent:before {\n    content: var(--tw-content);\n    --tw-gradient-to: transparent;\n    --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));\n  }\n\n  .before\\:outline-error\\/25:before {\n    content: var(--tw-content);\n    outline-color: var(--ui-error);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .before\\:outline-error\\/25:before {\n      outline-color: color-mix(in oklab, var(--ui-error) 25%, transparent);\n    }\n  }\n\n  .before\\:outline-info\\/25:before {\n    content: var(--tw-content);\n    outline-color: var(--ui-info);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .before\\:outline-info\\/25:before {\n      outline-color: color-mix(in oklab, var(--ui-info) 25%, transparent);\n    }\n  }\n\n  .before\\:outline-inverted\\/25:before {\n    content: var(--tw-content);\n    outline-color: var(--ui-border-inverted);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .before\\:outline-inverted\\/25:before {\n      outline-color: color-mix(in oklab, var(--ui-border-inverted) 25%, transparent);\n    }\n  }\n\n  .before\\:outline-primary\\/25:before {\n    content: var(--tw-content);\n    outline-color: var(--ui-primary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .before\\:outline-primary\\/25:before {\n      outline-color: color-mix(in oklab, var(--ui-primary) 25%, transparent);\n    }\n  }\n\n  .before\\:outline-secondary\\/25:before {\n    content: var(--tw-content);\n    outline-color: var(--ui-secondary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .before\\:outline-secondary\\/25:before {\n      outline-color: color-mix(in oklab, var(--ui-secondary) 25%, transparent);\n    }\n  }\n\n  .before\\:outline-success\\/25:before {\n    content: var(--tw-content);\n    outline-color: var(--ui-success);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .before\\:outline-success\\/25:before {\n      outline-color: color-mix(in oklab, var(--ui-success) 25%, transparent);\n    }\n  }\n\n  .before\\:outline-warning\\/25:before {\n    content: var(--tw-content);\n    outline-color: var(--ui-warning);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .before\\:outline-warning\\/25:before {\n      outline-color: color-mix(in oklab, var(--ui-warning) 25%, transparent);\n    }\n  }\n\n  .before\\:transition-colors:before {\n    content: var(--tw-content);\n    transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to;\n    transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));\n    transition-duration: var(--tw-duration, var(--default-transition-duration));\n  }\n\n  .before\\:content-\\[\\'\\'\\]:before {\n    --tw-content: \"\";\n    content: var(--tw-content);\n  }\n\n  .not-first-of-type\\:before\\:me-0\\.5:not(:first-of-type):before {\n    content: var(--tw-content);\n    margin-inline-end: calc(var(--spacing) * .5);\n  }\n\n  .not-first-of-type\\:before\\:content-\\[\\'·\\'\\]:not(:first-of-type):before {\n    --tw-content: \"·\";\n    content: var(--tw-content);\n  }\n\n  .after\\:pointer-events-none:after {\n    content: var(--tw-content);\n    pointer-events: none;\n  }\n\n  .after\\:absolute:after {\n    content: var(--tw-content);\n    position: absolute;\n  }\n\n  .after\\:inset-x-0:after {\n    content: var(--tw-content);\n    inset-inline: 0;\n  }\n\n  .after\\:inset-x-2\\.5:after {\n    content: var(--tw-content);\n    inset-inline: calc(var(--spacing) * 2.5);\n  }\n\n  .after\\:inset-y-0:after {\n    content: var(--tw-content);\n    inset-block: 0;\n  }\n\n  .after\\:inset-y-0\\.5:after {\n    content: var(--tw-content);\n    inset-block: calc(var(--spacing) * .5);\n  }\n\n  .after\\:-start-1\\.5:after {\n    content: var(--tw-content);\n    inset-inline-start: calc(var(--spacing) * -1.5);\n  }\n\n  .after\\:end-0:after {\n    content: var(--tw-content);\n    inset-inline-end: calc(var(--spacing) * 0);\n  }\n\n  .after\\:-bottom-2:after {\n    content: var(--tw-content);\n    bottom: calc(var(--spacing) * -2);\n  }\n\n  .after\\:bottom-0:after {\n    content: var(--tw-content);\n    bottom: 0;\n  }\n\n  .after\\:left-1\\/2:after {\n    content: var(--tw-content);\n    left: 50%;\n  }\n\n  .after\\:z-1:after {\n    content: var(--tw-content);\n    z-index: 1;\n  }\n\n  .after\\:z-2:after {\n    content: var(--tw-content);\n    z-index: 2;\n  }\n\n  .after\\:ms-0\\.5:after {\n    content: var(--tw-content);\n    margin-inline-start: calc(var(--spacing) * .5);\n  }\n\n  .after\\:block:after {\n    content: var(--tw-content);\n    display: block;\n  }\n\n  .after\\:hidden:after {\n    content: var(--tw-content);\n    display: none;\n  }\n\n  .after\\:size-1:after {\n    content: var(--tw-content);\n    width: var(--spacing);\n    height: var(--spacing);\n  }\n\n  .after\\:size-1\\.5:after {\n    content: var(--tw-content);\n    width: calc(var(--spacing) * 1.5);\n    height: calc(var(--spacing) * 1.5);\n  }\n\n  .after\\:size-2:after {\n    content: var(--tw-content);\n    width: calc(var(--spacing) * 2);\n    height: calc(var(--spacing) * 2);\n  }\n\n  .after\\:h-1\\/3:after {\n    content: var(--tw-content);\n    height: 33.3333%;\n  }\n\n  .after\\:h-full:after {\n    content: var(--tw-content);\n    height: 100%;\n  }\n\n  .after\\:h-px:after {\n    content: var(--tw-content);\n    height: 1px;\n  }\n\n  .after\\:w-1\\/3:after {\n    content: var(--tw-content);\n    width: 33.3333%;\n  }\n\n  .after\\:w-full:after {\n    content: var(--tw-content);\n    width: 100%;\n  }\n\n  .after\\:w-px:after {\n    content: var(--tw-content);\n    width: 1px;\n  }\n\n  .after\\:rounded-full:after {\n    content: var(--tw-content);\n    border-radius: 2147483647px;\n  }\n\n  .after\\:bg-default:after {\n    content: var(--tw-content);\n    background-color: var(--ui-bg);\n  }\n\n  .after\\:bg-error:after {\n    content: var(--tw-content);\n    background-color: var(--ui-error);\n  }\n\n  .after\\:bg-info:after {\n    content: var(--tw-content);\n    background-color: var(--ui-info);\n  }\n\n  .after\\:bg-inverted:after {\n    content: var(--tw-content);\n    background-color: var(--ui-bg-inverted);\n  }\n\n  .after\\:bg-primary:after {\n    content: var(--tw-content);\n    background-color: var(--ui-primary);\n  }\n\n  .after\\:bg-secondary:after {\n    content: var(--tw-content);\n    background-color: var(--ui-secondary);\n  }\n\n  .after\\:bg-success:after {\n    content: var(--tw-content);\n    background-color: var(--ui-success);\n  }\n\n  .after\\:bg-warning:after {\n    content: var(--tw-content);\n    background-color: var(--ui-warning);\n  }\n\n  .after\\:bg-gradient-to-l:after {\n    content: var(--tw-content);\n    --tw-gradient-position: to left in oklab;\n    background-image: linear-gradient(var(--tw-gradient-stops));\n  }\n\n  .after\\:bg-gradient-to-t:after {\n    content: var(--tw-content);\n    --tw-gradient-position: to top in oklab;\n    background-image: linear-gradient(var(--tw-gradient-stops));\n  }\n\n  .after\\:from-default:after {\n    content: var(--tw-content);\n    --tw-gradient-from: var(--ui-bg);\n    --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));\n  }\n\n  .after\\:to-transparent:after {\n    content: var(--tw-content);\n    --tw-gradient-to: transparent;\n    --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));\n  }\n\n  .after\\:text-error:after {\n    content: var(--tw-content);\n    color: var(--ui-error);\n  }\n\n  .after\\:transition-colors:after {\n    content: var(--tw-content);\n    transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to;\n    transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));\n    transition-duration: var(--tw-duration, var(--default-transition-duration));\n  }\n\n  .after\\:content-\\[\\'\\'\\]:after {\n    --tw-content: \"\";\n    content: var(--tw-content);\n  }\n\n  .after\\:content-\\[\\'\\*\\'\\]:after {\n    --tw-content: \"*\";\n    content: var(--tw-content);\n  }\n\n  :is(.\\*\\:not-last\\:after\\:absolute > *):not(:last-child):after {\n    content: var(--tw-content);\n    position: absolute;\n  }\n\n  :is(.\\*\\:not-last\\:after\\:inset-x-1 > *):not(:last-child):after {\n    content: var(--tw-content);\n    inset-inline: var(--spacing);\n  }\n\n  :is(.\\*\\:not-last\\:after\\:bottom-0 > *):not(:last-child):after {\n    content: var(--tw-content);\n    bottom: 0;\n  }\n\n  :is(.\\*\\:not-last\\:after\\:h-px > *):not(:last-child):after {\n    content: var(--tw-content);\n    height: 1px;\n  }\n\n  :is(.\\*\\:not-last\\:after\\:bg-border > *):not(:last-child):after {\n    content: var(--tw-content);\n    background-color: var(--ui-border);\n  }\n\n  .first\\:me-0:first-child {\n    margin-inline-end: 0;\n  }\n\n  :is(.\\*\\:first\\:mt-0 > *):first-child {\n    margin-top: 0;\n  }\n\n  .not-only\\:first\\:rounded-e-none:not(:only-child):first-child {\n    border-start-end-radius: 0;\n    border-end-end-radius: 0;\n  }\n\n  .not-only\\:first\\:rounded-b-none:not(:only-child):first-child {\n    border-bottom-right-radius: 0;\n    border-bottom-left-radius: 0;\n  }\n\n  .last\\:border-b-0:last-child {\n    border-bottom-style: var(--tw-border-style);\n    border-bottom-width: 0;\n  }\n\n  :is(.\\*\\:last\\:mb-0 > *):last-child {\n    margin-bottom: 0;\n  }\n\n  .not-only\\:last\\:rounded-s-none:not(:only-child):last-child {\n    border-start-start-radius: 0;\n    border-end-start-radius: 0;\n  }\n\n  .not-only\\:last\\:rounded-t-none:not(:only-child):last-child {\n    border-top-left-radius: 0;\n    border-top-right-radius: 0;\n  }\n\n  .first-of-type\\:rounded-s-lg:first-of-type {\n    border-start-start-radius: calc(var(--ui-radius) * 2);\n    border-end-start-radius: calc(var(--ui-radius) * 2);\n  }\n\n  .first-of-type\\:rounded-t-lg:first-of-type {\n    border-top-left-radius: calc(var(--ui-radius) * 2);\n    border-top-right-radius: calc(var(--ui-radius) * 2);\n  }\n\n  .last-of-type\\:rounded-e-lg:last-of-type {\n    border-start-end-radius: calc(var(--ui-radius) * 2);\n    border-end-end-radius: calc(var(--ui-radius) * 2);\n  }\n\n  .last-of-type\\:rounded-b-lg:last-of-type {\n    border-bottom-right-radius: calc(var(--ui-radius) * 2);\n    border-bottom-left-radius: calc(var(--ui-radius) * 2);\n  }\n\n  @media (hover: hover) {\n    .hover\\:scale-110:hover {\n      --tw-scale-x: 110%;\n      --tw-scale-y: 110%;\n      --tw-scale-z: 110%;\n      scale: var(--tw-scale-x) var(--tw-scale-y);\n    }\n\n    .hover\\:scale-115:hover {\n      --tw-scale-x: 115%;\n      --tw-scale-y: 115%;\n      --tw-scale-z: 115%;\n      scale: var(--tw-scale-x) var(--tw-scale-y);\n    }\n\n    .hover\\:bg-accented\\/75:hover {\n      background-color: var(--ui-bg-accented);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:bg-accented\\/75:hover {\n        background-color: color-mix(in oklab, var(--ui-bg-accented) 75%, transparent);\n      }\n    }\n\n    .hover\\:bg-default\\/10:hover {\n      background-color: var(--ui-bg);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:bg-default\\/10:hover {\n        background-color: color-mix(in oklab, var(--ui-bg) 10%, transparent);\n      }\n    }\n\n    .hover\\:bg-elevated:hover, .hover\\:bg-elevated\\/25:hover {\n      background-color: var(--ui-bg-elevated);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:bg-elevated\\/25:hover {\n        background-color: color-mix(in oklab, var(--ui-bg-elevated) 25%, transparent);\n      }\n    }\n\n    .hover\\:bg-elevated\\/50:hover {\n      background-color: var(--ui-bg-elevated);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:bg-elevated\\/50:hover {\n        background-color: color-mix(in oklab, var(--ui-bg-elevated) 50%, transparent);\n      }\n    }\n\n    .hover\\:bg-error\\/10:hover {\n      background-color: var(--ui-error);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:bg-error\\/10:hover {\n        background-color: color-mix(in oklab, var(--ui-error) 10%, transparent);\n      }\n    }\n\n    .hover\\:bg-error\\/15:hover {\n      background-color: var(--ui-error);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:bg-error\\/15:hover {\n        background-color: color-mix(in oklab, var(--ui-error) 15%, transparent);\n      }\n    }\n\n    .hover\\:bg-error\\/75:hover {\n      background-color: var(--ui-error);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:bg-error\\/75:hover {\n        background-color: color-mix(in oklab, var(--ui-error) 75%, transparent);\n      }\n    }\n\n    .hover\\:bg-error\\/90:hover {\n      background-color: var(--ui-error);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:bg-error\\/90:hover {\n        background-color: color-mix(in oklab, var(--ui-error) 90%, transparent);\n      }\n    }\n\n    .hover\\:bg-info\\/10:hover {\n      background-color: var(--ui-info);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:bg-info\\/10:hover {\n        background-color: color-mix(in oklab, var(--ui-info) 10%, transparent);\n      }\n    }\n\n    .hover\\:bg-info\\/15:hover {\n      background-color: var(--ui-info);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:bg-info\\/15:hover {\n        background-color: color-mix(in oklab, var(--ui-info) 15%, transparent);\n      }\n    }\n\n    .hover\\:bg-info\\/75:hover {\n      background-color: var(--ui-info);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:bg-info\\/75:hover {\n        background-color: color-mix(in oklab, var(--ui-info) 75%, transparent);\n      }\n    }\n\n    .hover\\:bg-info\\/90:hover {\n      background-color: var(--ui-info);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:bg-info\\/90:hover {\n        background-color: color-mix(in oklab, var(--ui-info) 90%, transparent);\n      }\n    }\n\n    .hover\\:bg-inverted\\/90:hover {\n      background-color: var(--ui-bg-inverted);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:bg-inverted\\/90:hover {\n        background-color: color-mix(in oklab, var(--ui-bg-inverted) 90%, transparent);\n      }\n    }\n\n    .hover\\:bg-primary\\/10:hover {\n      background-color: var(--ui-primary);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:bg-primary\\/10:hover {\n        background-color: color-mix(in oklab, var(--ui-primary) 10%, transparent);\n      }\n    }\n\n    .hover\\:bg-primary\\/15:hover {\n      background-color: var(--ui-primary);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:bg-primary\\/15:hover {\n        background-color: color-mix(in oklab, var(--ui-primary) 15%, transparent);\n      }\n    }\n\n    .hover\\:bg-primary\\/75:hover {\n      background-color: var(--ui-primary);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:bg-primary\\/75:hover {\n        background-color: color-mix(in oklab, var(--ui-primary) 75%, transparent);\n      }\n    }\n\n    .hover\\:bg-primary\\/90:hover {\n      background-color: var(--ui-primary);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:bg-primary\\/90:hover {\n        background-color: color-mix(in oklab, var(--ui-primary) 90%, transparent);\n      }\n    }\n\n    .hover\\:bg-secondary\\/10:hover {\n      background-color: var(--ui-secondary);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:bg-secondary\\/10:hover {\n        background-color: color-mix(in oklab, var(--ui-secondary) 10%, transparent);\n      }\n    }\n\n    .hover\\:bg-secondary\\/15:hover {\n      background-color: var(--ui-secondary);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:bg-secondary\\/15:hover {\n        background-color: color-mix(in oklab, var(--ui-secondary) 15%, transparent);\n      }\n    }\n\n    .hover\\:bg-secondary\\/75:hover {\n      background-color: var(--ui-secondary);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:bg-secondary\\/75:hover {\n        background-color: color-mix(in oklab, var(--ui-secondary) 75%, transparent);\n      }\n    }\n\n    .hover\\:bg-secondary\\/90:hover {\n      background-color: var(--ui-secondary);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:bg-secondary\\/90:hover {\n        background-color: color-mix(in oklab, var(--ui-secondary) 90%, transparent);\n      }\n    }\n\n    .hover\\:bg-success\\/10:hover {\n      background-color: var(--ui-success);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:bg-success\\/10:hover {\n        background-color: color-mix(in oklab, var(--ui-success) 10%, transparent);\n      }\n    }\n\n    .hover\\:bg-success\\/15:hover {\n      background-color: var(--ui-success);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:bg-success\\/15:hover {\n        background-color: color-mix(in oklab, var(--ui-success) 15%, transparent);\n      }\n    }\n\n    .hover\\:bg-success\\/75:hover {\n      background-color: var(--ui-success);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:bg-success\\/75:hover {\n        background-color: color-mix(in oklab, var(--ui-success) 75%, transparent);\n      }\n    }\n\n    .hover\\:bg-success\\/90:hover {\n      background-color: var(--ui-success);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:bg-success\\/90:hover {\n        background-color: color-mix(in oklab, var(--ui-success) 90%, transparent);\n      }\n    }\n\n    .hover\\:bg-warning\\/10:hover {\n      background-color: var(--ui-warning);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:bg-warning\\/10:hover {\n        background-color: color-mix(in oklab, var(--ui-warning) 10%, transparent);\n      }\n    }\n\n    .hover\\:bg-warning\\/15:hover {\n      background-color: var(--ui-warning);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:bg-warning\\/15:hover {\n        background-color: color-mix(in oklab, var(--ui-warning) 15%, transparent);\n      }\n    }\n\n    .hover\\:bg-warning\\/75:hover {\n      background-color: var(--ui-warning);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:bg-warning\\/75:hover {\n        background-color: color-mix(in oklab, var(--ui-warning) 75%, transparent);\n      }\n    }\n\n    .hover\\:bg-warning\\/90:hover {\n      background-color: var(--ui-warning);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:bg-warning\\/90:hover {\n        background-color: color-mix(in oklab, var(--ui-warning) 90%, transparent);\n      }\n    }\n\n    .hover\\:text-default:hover {\n      color: var(--ui-text);\n    }\n\n    .hover\\:text-error\\/75:hover {\n      color: var(--ui-error);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:text-error\\/75:hover {\n        color: color-mix(in oklab, var(--ui-error) 75%, transparent);\n      }\n    }\n\n    .hover\\:text-highlighted:hover {\n      color: var(--ui-text-highlighted);\n    }\n\n    .hover\\:text-info\\/75:hover {\n      color: var(--ui-info);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:text-info\\/75:hover {\n        color: color-mix(in oklab, var(--ui-info) 75%, transparent);\n      }\n    }\n\n    .hover\\:text-primary\\/75:hover {\n      color: var(--ui-primary);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:text-primary\\/75:hover {\n        color: color-mix(in oklab, var(--ui-primary) 75%, transparent);\n      }\n    }\n\n    .hover\\:text-secondary\\/75:hover {\n      color: var(--ui-secondary);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:text-secondary\\/75:hover {\n        color: color-mix(in oklab, var(--ui-secondary) 75%, transparent);\n      }\n    }\n\n    .hover\\:text-success\\/75:hover {\n      color: var(--ui-success);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:text-success\\/75:hover {\n        color: color-mix(in oklab, var(--ui-success) 75%, transparent);\n      }\n    }\n\n    .hover\\:text-warning\\/75:hover {\n      color: var(--ui-warning);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:text-warning\\/75:hover {\n        color: color-mix(in oklab, var(--ui-warning) 75%, transparent);\n      }\n    }\n\n    .hover\\:ring-accented:hover {\n      --tw-ring-color: var(--ui-border-accented);\n    }\n\n    .hover\\:not-has-disabled\\:not-has-aria-disabled\\:not-has-focus-visible\\:not-has-data-\\[state\\=checked\\]\\:z-\\[1\\]:hover:not(:has(:disabled)):not(:has([aria-disabled=\"true\"])):not(:has(:focus-visible)):not(:has([data-state=\"checked\"])) {\n      z-index: 1;\n    }\n\n    .hover\\:not-has-disabled\\:not-has-aria-disabled\\:not-has-focus-visible\\:not-has-data-\\[state\\=checked\\]\\:border-accented:hover:not(:has(:disabled)):not(:has([aria-disabled=\"true\"])):not(:has(:focus-visible)):not(:has([data-state=\"checked\"])) {\n      border-color: var(--ui-border-accented);\n    }\n\n    .hover\\:not-has-disabled\\:not-has-aria-disabled\\:not-has-focus-visible\\:not-has-data-\\[state\\=checked\\]\\:bg-elevated\\/50:hover:not(:has(:disabled)):not(:has([aria-disabled=\"true\"])):not(:has(:focus-visible)):not(:has([data-state=\"checked\"])) {\n      background-color: var(--ui-bg-elevated);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:not-has-disabled\\:not-has-aria-disabled\\:not-has-focus-visible\\:not-has-data-\\[state\\=checked\\]\\:bg-elevated\\/50:hover:not(:has(:disabled)):not(:has([aria-disabled=\"true\"])):not(:has(:focus-visible)):not(:has([data-state=\"checked\"])) {\n        background-color: color-mix(in oklab, var(--ui-bg-elevated) 50%, transparent);\n      }\n    }\n\n    .hover\\:not-data-selected\\:bg-error\\/10:hover:not([data-selected]) {\n      background-color: var(--ui-error);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:not-data-selected\\:bg-error\\/10:hover:not([data-selected]) {\n        background-color: color-mix(in oklab, var(--ui-error) 10%, transparent);\n      }\n    }\n\n    .hover\\:not-data-selected\\:bg-error\\/20:hover:not([data-selected]) {\n      background-color: var(--ui-error);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:not-data-selected\\:bg-error\\/20:hover:not([data-selected]) {\n        background-color: color-mix(in oklab, var(--ui-error) 20%, transparent);\n      }\n    }\n\n    .hover\\:not-data-selected\\:bg-info\\/10:hover:not([data-selected]) {\n      background-color: var(--ui-info);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:not-data-selected\\:bg-info\\/10:hover:not([data-selected]) {\n        background-color: color-mix(in oklab, var(--ui-info) 10%, transparent);\n      }\n    }\n\n    .hover\\:not-data-selected\\:bg-info\\/20:hover:not([data-selected]) {\n      background-color: var(--ui-info);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:not-data-selected\\:bg-info\\/20:hover:not([data-selected]) {\n        background-color: color-mix(in oklab, var(--ui-info) 20%, transparent);\n      }\n    }\n\n    .hover\\:not-data-selected\\:bg-inverted\\/10:hover:not([data-selected]) {\n      background-color: var(--ui-bg-inverted);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:not-data-selected\\:bg-inverted\\/10:hover:not([data-selected]) {\n        background-color: color-mix(in oklab, var(--ui-bg-inverted) 10%, transparent);\n      }\n    }\n\n    .hover\\:not-data-selected\\:bg-primary\\/10:hover:not([data-selected]) {\n      background-color: var(--ui-primary);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:not-data-selected\\:bg-primary\\/10:hover:not([data-selected]) {\n        background-color: color-mix(in oklab, var(--ui-primary) 10%, transparent);\n      }\n    }\n\n    .hover\\:not-data-selected\\:bg-primary\\/20:hover:not([data-selected]) {\n      background-color: var(--ui-primary);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:not-data-selected\\:bg-primary\\/20:hover:not([data-selected]) {\n        background-color: color-mix(in oklab, var(--ui-primary) 20%, transparent);\n      }\n    }\n\n    .hover\\:not-data-selected\\:bg-secondary\\/10:hover:not([data-selected]) {\n      background-color: var(--ui-secondary);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:not-data-selected\\:bg-secondary\\/10:hover:not([data-selected]) {\n        background-color: color-mix(in oklab, var(--ui-secondary) 10%, transparent);\n      }\n    }\n\n    .hover\\:not-data-selected\\:bg-secondary\\/20:hover:not([data-selected]) {\n      background-color: var(--ui-secondary);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:not-data-selected\\:bg-secondary\\/20:hover:not([data-selected]) {\n        background-color: color-mix(in oklab, var(--ui-secondary) 20%, transparent);\n      }\n    }\n\n    .hover\\:not-data-selected\\:bg-success\\/10:hover:not([data-selected]) {\n      background-color: var(--ui-success);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:not-data-selected\\:bg-success\\/10:hover:not([data-selected]) {\n        background-color: color-mix(in oklab, var(--ui-success) 10%, transparent);\n      }\n    }\n\n    .hover\\:not-data-selected\\:bg-success\\/20:hover:not([data-selected]) {\n      background-color: var(--ui-success);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:not-data-selected\\:bg-success\\/20:hover:not([data-selected]) {\n        background-color: color-mix(in oklab, var(--ui-success) 20%, transparent);\n      }\n    }\n\n    .hover\\:not-data-selected\\:bg-warning\\/10:hover:not([data-selected]) {\n      background-color: var(--ui-warning);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:not-data-selected\\:bg-warning\\/10:hover:not([data-selected]) {\n        background-color: color-mix(in oklab, var(--ui-warning) 10%, transparent);\n      }\n    }\n\n    .hover\\:not-data-selected\\:bg-warning\\/20:hover:not([data-selected]) {\n      background-color: var(--ui-warning);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:not-data-selected\\:bg-warning\\/20:hover:not([data-selected]) {\n        background-color: color-mix(in oklab, var(--ui-warning) 20%, transparent);\n      }\n    }\n\n    .hover\\:before\\:bg-elevated\\/50:hover:before {\n      content: var(--tw-content);\n      background-color: var(--ui-bg-elevated);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .hover\\:before\\:bg-elevated\\/50:hover:before {\n        background-color: color-mix(in oklab, var(--ui-bg-elevated) 50%, transparent);\n      }\n    }\n\n    .hover\\:after\\:bg-\\(--ui-border-accented\\):hover:after {\n      content: var(--tw-content);\n      background-color: var(--ui-border-accented);\n    }\n  }\n\n  .focus\\:bg-accented:focus, .focus\\:bg-accented\\/50:focus {\n    background-color: var(--ui-bg-accented);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .focus\\:bg-accented\\/50:focus {\n      background-color: color-mix(in oklab, var(--ui-bg-accented) 50%, transparent);\n    }\n  }\n\n  .focus\\:bg-elevated:focus {\n    background-color: var(--ui-bg-elevated);\n  }\n\n  .focus\\:outline-none:focus {\n    --tw-outline-style: none;\n    outline-style: none;\n  }\n\n  @media (hover: hover) {\n    :is(:where(.group):hover .group-hover\\:focus\\:bg-accented):focus {\n      background-color: var(--ui-bg-accented);\n    }\n  }\n\n  .focus-visible\\:z-\\[1\\]:focus-visible {\n    z-index: 1;\n  }\n\n  .focus-visible\\:border-error:focus-visible {\n    border-color: var(--ui-error);\n  }\n\n  .focus-visible\\:border-info:focus-visible {\n    border-color: var(--ui-info);\n  }\n\n  .focus-visible\\:border-inverted:focus-visible {\n    border-color: var(--ui-border-inverted);\n  }\n\n  .focus-visible\\:border-primary:focus-visible {\n    border-color: var(--ui-primary);\n  }\n\n  .focus-visible\\:border-secondary:focus-visible {\n    border-color: var(--ui-secondary);\n  }\n\n  .focus-visible\\:border-success:focus-visible {\n    border-color: var(--ui-success);\n  }\n\n  .focus-visible\\:border-warning:focus-visible {\n    border-color: var(--ui-warning);\n  }\n\n  .focus-visible\\:bg-default\\/10:focus-visible {\n    background-color: var(--ui-bg);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .focus-visible\\:bg-default\\/10:focus-visible {\n      background-color: color-mix(in oklab, var(--ui-bg) 10%, transparent);\n    }\n  }\n\n  .focus-visible\\:ring-error:focus-visible {\n    --tw-ring-color: var(--ui-error);\n  }\n\n  .focus-visible\\:ring-info:focus-visible {\n    --tw-ring-color: var(--ui-info);\n  }\n\n  .focus-visible\\:ring-inverted:focus-visible {\n    --tw-ring-color: var(--ui-border-inverted);\n  }\n\n  .focus-visible\\:ring-primary:focus-visible {\n    --tw-ring-color: var(--ui-primary);\n  }\n\n  .focus-visible\\:ring-secondary:focus-visible {\n    --tw-ring-color: var(--ui-secondary);\n  }\n\n  .focus-visible\\:ring-success:focus-visible {\n    --tw-ring-color: var(--ui-success);\n  }\n\n  .focus-visible\\:ring-warning:focus-visible {\n    --tw-ring-color: var(--ui-warning);\n  }\n\n  .focus-visible\\:outline-2:focus-visible {\n    outline-style: var(--tw-outline-style);\n    outline-width: 2px;\n  }\n\n  .focus-visible\\:outline-3:focus-visible {\n    outline-style: var(--tw-outline-style);\n    outline-width: 3px;\n  }\n\n  .focus-visible\\:outline-offset-2:focus-visible {\n    outline-offset: 2px;\n  }\n\n  .focus-visible\\:outline-primary:focus-visible {\n    outline-color: var(--ui-primary);\n  }\n\n  .focus-visible\\:outline-none:focus-visible {\n    --tw-outline-style: none;\n    outline-style: none;\n  }\n\n  .focus-visible\\:outline-solid:focus-visible {\n    --tw-outline-style: solid;\n    outline-style: solid;\n  }\n\n  .focus-visible\\:before\\:outline-3:focus-visible:before {\n    content: var(--tw-content);\n    outline-style: var(--tw-outline-style);\n    outline-width: 3px;\n  }\n\n  .active\\:bg-accented\\/75:active {\n    background-color: var(--ui-bg-accented);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .active\\:bg-accented\\/75:active {\n      background-color: color-mix(in oklab, var(--ui-bg-accented) 75%, transparent);\n    }\n  }\n\n  .active\\:bg-elevated:active {\n    background-color: var(--ui-bg-elevated);\n  }\n\n  .active\\:bg-error\\/10:active {\n    background-color: var(--ui-error);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .active\\:bg-error\\/10:active {\n      background-color: color-mix(in oklab, var(--ui-error) 10%, transparent);\n    }\n  }\n\n  .active\\:bg-error\\/15:active {\n    background-color: var(--ui-error);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .active\\:bg-error\\/15:active {\n      background-color: color-mix(in oklab, var(--ui-error) 15%, transparent);\n    }\n  }\n\n  .active\\:bg-error\\/75:active {\n    background-color: var(--ui-error);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .active\\:bg-error\\/75:active {\n      background-color: color-mix(in oklab, var(--ui-error) 75%, transparent);\n    }\n  }\n\n  .active\\:bg-info\\/10:active {\n    background-color: var(--ui-info);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .active\\:bg-info\\/10:active {\n      background-color: color-mix(in oklab, var(--ui-info) 10%, transparent);\n    }\n  }\n\n  .active\\:bg-info\\/15:active {\n    background-color: var(--ui-info);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .active\\:bg-info\\/15:active {\n      background-color: color-mix(in oklab, var(--ui-info) 15%, transparent);\n    }\n  }\n\n  .active\\:bg-info\\/75:active {\n    background-color: var(--ui-info);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .active\\:bg-info\\/75:active {\n      background-color: color-mix(in oklab, var(--ui-info) 75%, transparent);\n    }\n  }\n\n  .active\\:bg-inverted\\/90:active {\n    background-color: var(--ui-bg-inverted);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .active\\:bg-inverted\\/90:active {\n      background-color: color-mix(in oklab, var(--ui-bg-inverted) 90%, transparent);\n    }\n  }\n\n  .active\\:bg-primary\\/10:active {\n    background-color: var(--ui-primary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .active\\:bg-primary\\/10:active {\n      background-color: color-mix(in oklab, var(--ui-primary) 10%, transparent);\n    }\n  }\n\n  .active\\:bg-primary\\/15:active {\n    background-color: var(--ui-primary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .active\\:bg-primary\\/15:active {\n      background-color: color-mix(in oklab, var(--ui-primary) 15%, transparent);\n    }\n  }\n\n  .active\\:bg-primary\\/75:active {\n    background-color: var(--ui-primary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .active\\:bg-primary\\/75:active {\n      background-color: color-mix(in oklab, var(--ui-primary) 75%, transparent);\n    }\n  }\n\n  .active\\:bg-secondary\\/10:active {\n    background-color: var(--ui-secondary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .active\\:bg-secondary\\/10:active {\n      background-color: color-mix(in oklab, var(--ui-secondary) 10%, transparent);\n    }\n  }\n\n  .active\\:bg-secondary\\/15:active {\n    background-color: var(--ui-secondary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .active\\:bg-secondary\\/15:active {\n      background-color: color-mix(in oklab, var(--ui-secondary) 15%, transparent);\n    }\n  }\n\n  .active\\:bg-secondary\\/75:active {\n    background-color: var(--ui-secondary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .active\\:bg-secondary\\/75:active {\n      background-color: color-mix(in oklab, var(--ui-secondary) 75%, transparent);\n    }\n  }\n\n  .active\\:bg-success\\/10:active {\n    background-color: var(--ui-success);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .active\\:bg-success\\/10:active {\n      background-color: color-mix(in oklab, var(--ui-success) 10%, transparent);\n    }\n  }\n\n  .active\\:bg-success\\/15:active {\n    background-color: var(--ui-success);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .active\\:bg-success\\/15:active {\n      background-color: color-mix(in oklab, var(--ui-success) 15%, transparent);\n    }\n  }\n\n  .active\\:bg-success\\/75:active {\n    background-color: var(--ui-success);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .active\\:bg-success\\/75:active {\n      background-color: color-mix(in oklab, var(--ui-success) 75%, transparent);\n    }\n  }\n\n  .active\\:bg-warning\\/10:active {\n    background-color: var(--ui-warning);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .active\\:bg-warning\\/10:active {\n      background-color: color-mix(in oklab, var(--ui-warning) 10%, transparent);\n    }\n  }\n\n  .active\\:bg-warning\\/15:active {\n    background-color: var(--ui-warning);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .active\\:bg-warning\\/15:active {\n      background-color: color-mix(in oklab, var(--ui-warning) 15%, transparent);\n    }\n  }\n\n  .active\\:bg-warning\\/75:active {\n    background-color: var(--ui-warning);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .active\\:bg-warning\\/75:active {\n      background-color: color-mix(in oklab, var(--ui-warning) 75%, transparent);\n    }\n  }\n\n  .active\\:text-default:active {\n    color: var(--ui-text);\n  }\n\n  .active\\:text-error\\/75:active {\n    color: var(--ui-error);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .active\\:text-error\\/75:active {\n      color: color-mix(in oklab, var(--ui-error) 75%, transparent);\n    }\n  }\n\n  .active\\:text-info\\/75:active {\n    color: var(--ui-info);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .active\\:text-info\\/75:active {\n      color: color-mix(in oklab, var(--ui-info) 75%, transparent);\n    }\n  }\n\n  .active\\:text-primary\\/75:active {\n    color: var(--ui-primary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .active\\:text-primary\\/75:active {\n      color: color-mix(in oklab, var(--ui-primary) 75%, transparent);\n    }\n  }\n\n  .active\\:text-secondary\\/75:active {\n    color: var(--ui-secondary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .active\\:text-secondary\\/75:active {\n      color: color-mix(in oklab, var(--ui-secondary) 75%, transparent);\n    }\n  }\n\n  .active\\:text-success\\/75:active {\n    color: var(--ui-success);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .active\\:text-success\\/75:active {\n      color: color-mix(in oklab, var(--ui-success) 75%, transparent);\n    }\n  }\n\n  .active\\:text-warning\\/75:active {\n    color: var(--ui-warning);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .active\\:text-warning\\/75:active {\n      color: color-mix(in oklab, var(--ui-warning) 75%, transparent);\n    }\n  }\n\n  .disabled\\:pointer-events-none:disabled {\n    pointer-events: none;\n  }\n\n  .disabled\\:cursor-default:disabled {\n    cursor: default;\n  }\n\n  .disabled\\:cursor-not-allowed:disabled {\n    cursor: not-allowed;\n  }\n\n  .disabled\\:bg-default:disabled {\n    background-color: var(--ui-bg);\n  }\n\n  .disabled\\:bg-elevated:disabled, .disabled\\:bg-elevated\\/50:disabled {\n    background-color: var(--ui-bg-elevated);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .disabled\\:bg-elevated\\/50:disabled {\n      background-color: color-mix(in oklab, var(--ui-bg-elevated) 50%, transparent);\n    }\n  }\n\n  .disabled\\:bg-error:disabled, .disabled\\:bg-error\\/10:disabled {\n    background-color: var(--ui-error);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .disabled\\:bg-error\\/10:disabled {\n      background-color: color-mix(in oklab, var(--ui-error) 10%, transparent);\n    }\n  }\n\n  .disabled\\:bg-info:disabled, .disabled\\:bg-info\\/10:disabled {\n    background-color: var(--ui-info);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .disabled\\:bg-info\\/10:disabled {\n      background-color: color-mix(in oklab, var(--ui-info) 10%, transparent);\n    }\n  }\n\n  .disabled\\:bg-inverted:disabled {\n    background-color: var(--ui-bg-inverted);\n  }\n\n  .disabled\\:bg-primary:disabled, .disabled\\:bg-primary\\/10:disabled {\n    background-color: var(--ui-primary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .disabled\\:bg-primary\\/10:disabled {\n      background-color: color-mix(in oklab, var(--ui-primary) 10%, transparent);\n    }\n  }\n\n  .disabled\\:bg-secondary:disabled, .disabled\\:bg-secondary\\/10:disabled {\n    background-color: var(--ui-secondary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .disabled\\:bg-secondary\\/10:disabled {\n      background-color: color-mix(in oklab, var(--ui-secondary) 10%, transparent);\n    }\n  }\n\n  .disabled\\:bg-success:disabled, .disabled\\:bg-success\\/10:disabled {\n    background-color: var(--ui-success);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .disabled\\:bg-success\\/10:disabled {\n      background-color: color-mix(in oklab, var(--ui-success) 10%, transparent);\n    }\n  }\n\n  .disabled\\:bg-transparent:disabled {\n    background-color: #0000;\n  }\n\n  .disabled\\:bg-warning:disabled, .disabled\\:bg-warning\\/10:disabled {\n    background-color: var(--ui-warning);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .disabled\\:bg-warning\\/10:disabled {\n      background-color: color-mix(in oklab, var(--ui-warning) 10%, transparent);\n    }\n  }\n\n  .disabled\\:text-error:disabled {\n    color: var(--ui-error);\n  }\n\n  .disabled\\:text-info:disabled {\n    color: var(--ui-info);\n  }\n\n  .disabled\\:text-muted:disabled {\n    color: var(--ui-text-muted);\n  }\n\n  .disabled\\:text-primary:disabled {\n    color: var(--ui-primary);\n  }\n\n  .disabled\\:text-secondary:disabled {\n    color: var(--ui-secondary);\n  }\n\n  .disabled\\:text-success:disabled {\n    color: var(--ui-success);\n  }\n\n  .disabled\\:text-warning:disabled {\n    color: var(--ui-warning);\n  }\n\n  .disabled\\:opacity-75:disabled {\n    opacity: .75;\n  }\n\n  @media (hover: hover) {\n    .hover\\:disabled\\:bg-transparent:hover:disabled {\n      background-color: #0000;\n    }\n\n    .disabled\\:hover\\:text-muted:disabled:hover {\n      color: var(--ui-text-muted);\n    }\n  }\n\n  :where([data-measured]) .in-data-measured\\:opacity-100 {\n    opacity: 1;\n  }\n\n  :where(.ui-macos) .in-\\[\\.ui-macos\\]\\:hidden {\n    display: none;\n  }\n\n  :where(.ui-macos) .in-\\[\\.ui-macos\\]\\:inline {\n    display: inline;\n  }\n\n  .has-focus\\:bg-elevated:has(:focus) {\n    background-color: var(--ui-bg-elevated);\n  }\n\n  .has-focus\\:outline-none:has(:focus) {\n    --tw-outline-style: none;\n    outline-style: none;\n  }\n\n  .has-focus-visible\\:z-\\[1\\]:has(:focus-visible) {\n    z-index: 1;\n  }\n\n  .has-focus-visible\\:ring-error:has(:focus-visible) {\n    --tw-ring-color: var(--ui-error);\n  }\n\n  .has-focus-visible\\:ring-info:has(:focus-visible) {\n    --tw-ring-color: var(--ui-info);\n  }\n\n  .has-focus-visible\\:ring-inverted:has(:focus-visible) {\n    --tw-ring-color: var(--ui-border-inverted);\n  }\n\n  .has-focus-visible\\:ring-primary:has(:focus-visible) {\n    --tw-ring-color: var(--ui-primary);\n  }\n\n  .has-focus-visible\\:ring-secondary:has(:focus-visible) {\n    --tw-ring-color: var(--ui-secondary);\n  }\n\n  .has-focus-visible\\:ring-success:has(:focus-visible) {\n    --tw-ring-color: var(--ui-success);\n  }\n\n  .has-focus-visible\\:ring-warning:has(:focus-visible) {\n    --tw-ring-color: var(--ui-warning);\n  }\n\n  .has-focus-visible\\:outline-3:has(:focus-visible) {\n    outline-style: var(--tw-outline-style);\n    outline-width: 3px;\n  }\n\n  .not-has-disabled\\:has-focus-visible\\:border-error:not(:has(:disabled)):has(:focus-visible) {\n    border-color: var(--ui-error);\n  }\n\n  .not-has-disabled\\:has-focus-visible\\:border-info:not(:has(:disabled)):has(:focus-visible) {\n    border-color: var(--ui-info);\n  }\n\n  .not-has-disabled\\:has-focus-visible\\:border-inverted:not(:has(:disabled)):has(:focus-visible) {\n    border-color: var(--ui-border-inverted);\n  }\n\n  .not-has-disabled\\:has-focus-visible\\:border-primary:not(:has(:disabled)):has(:focus-visible) {\n    border-color: var(--ui-primary);\n  }\n\n  .not-has-disabled\\:has-focus-visible\\:border-secondary:not(:has(:disabled)):has(:focus-visible) {\n    border-color: var(--ui-secondary);\n  }\n\n  .not-has-disabled\\:has-focus-visible\\:border-success:not(:has(:disabled)):has(:focus-visible) {\n    border-color: var(--ui-success);\n  }\n\n  .not-has-disabled\\:has-focus-visible\\:border-warning:not(:has(:disabled)):has(:focus-visible) {\n    border-color: var(--ui-warning);\n  }\n\n  .has-aria-disabled\\:cursor-not-allowed:has([aria-disabled=\"true\"]) {\n    cursor: not-allowed;\n  }\n\n  .has-data-\\[state\\=checked\\]\\:z-\\[2\\]:has([data-state=\"checked\"]) {\n    z-index: 2;\n  }\n\n  .has-data-\\[state\\=checked\\]\\:border-error\\/50:has([data-state=\"checked\"]) {\n    border-color: var(--ui-error);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .has-data-\\[state\\=checked\\]\\:border-error\\/50:has([data-state=\"checked\"]) {\n      border-color: color-mix(in oklab, var(--ui-error) 50%, transparent);\n    }\n  }\n\n  .has-data-\\[state\\=checked\\]\\:border-info\\/50:has([data-state=\"checked\"]) {\n    border-color: var(--ui-info);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .has-data-\\[state\\=checked\\]\\:border-info\\/50:has([data-state=\"checked\"]) {\n      border-color: color-mix(in oklab, var(--ui-info) 50%, transparent);\n    }\n  }\n\n  .has-data-\\[state\\=checked\\]\\:border-inverted\\/50:has([data-state=\"checked\"]) {\n    border-color: var(--ui-border-inverted);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .has-data-\\[state\\=checked\\]\\:border-inverted\\/50:has([data-state=\"checked\"]) {\n      border-color: color-mix(in oklab, var(--ui-border-inverted) 50%, transparent);\n    }\n  }\n\n  .has-data-\\[state\\=checked\\]\\:border-primary\\/50:has([data-state=\"checked\"]) {\n    border-color: var(--ui-primary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .has-data-\\[state\\=checked\\]\\:border-primary\\/50:has([data-state=\"checked\"]) {\n      border-color: color-mix(in oklab, var(--ui-primary) 50%, transparent);\n    }\n  }\n\n  .has-data-\\[state\\=checked\\]\\:border-secondary\\/50:has([data-state=\"checked\"]) {\n    border-color: var(--ui-secondary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .has-data-\\[state\\=checked\\]\\:border-secondary\\/50:has([data-state=\"checked\"]) {\n      border-color: color-mix(in oklab, var(--ui-secondary) 50%, transparent);\n    }\n  }\n\n  .has-data-\\[state\\=checked\\]\\:border-success\\/50:has([data-state=\"checked\"]) {\n    border-color: var(--ui-success);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .has-data-\\[state\\=checked\\]\\:border-success\\/50:has([data-state=\"checked\"]) {\n      border-color: color-mix(in oklab, var(--ui-success) 50%, transparent);\n    }\n  }\n\n  .has-data-\\[state\\=checked\\]\\:border-warning\\/50:has([data-state=\"checked\"]) {\n    border-color: var(--ui-warning);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .has-data-\\[state\\=checked\\]\\:border-warning\\/50:has([data-state=\"checked\"]) {\n      border-color: color-mix(in oklab, var(--ui-warning) 50%, transparent);\n    }\n  }\n\n  .has-data-\\[state\\=checked\\]\\:bg-elevated:has([data-state=\"checked\"]) {\n    background-color: var(--ui-bg-elevated);\n  }\n\n  .has-data-\\[state\\=checked\\]\\:bg-error\\/10:has([data-state=\"checked\"]) {\n    background-color: var(--ui-error);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .has-data-\\[state\\=checked\\]\\:bg-error\\/10:has([data-state=\"checked\"]) {\n      background-color: color-mix(in oklab, var(--ui-error) 10%, transparent);\n    }\n  }\n\n  .has-data-\\[state\\=checked\\]\\:bg-info\\/10:has([data-state=\"checked\"]) {\n    background-color: var(--ui-info);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .has-data-\\[state\\=checked\\]\\:bg-info\\/10:has([data-state=\"checked\"]) {\n      background-color: color-mix(in oklab, var(--ui-info) 10%, transparent);\n    }\n  }\n\n  .has-data-\\[state\\=checked\\]\\:bg-primary\\/10:has([data-state=\"checked\"]) {\n    background-color: var(--ui-primary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .has-data-\\[state\\=checked\\]\\:bg-primary\\/10:has([data-state=\"checked\"]) {\n      background-color: color-mix(in oklab, var(--ui-primary) 10%, transparent);\n    }\n  }\n\n  .has-data-\\[state\\=checked\\]\\:bg-secondary\\/10:has([data-state=\"checked\"]) {\n    background-color: var(--ui-secondary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .has-data-\\[state\\=checked\\]\\:bg-secondary\\/10:has([data-state=\"checked\"]) {\n      background-color: color-mix(in oklab, var(--ui-secondary) 10%, transparent);\n    }\n  }\n\n  .has-data-\\[state\\=checked\\]\\:bg-success\\/10:has([data-state=\"checked\"]) {\n    background-color: var(--ui-success);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .has-data-\\[state\\=checked\\]\\:bg-success\\/10:has([data-state=\"checked\"]) {\n      background-color: color-mix(in oklab, var(--ui-success) 10%, transparent);\n    }\n  }\n\n  .has-data-\\[state\\=checked\\]\\:bg-warning\\/10:has([data-state=\"checked\"]) {\n    background-color: var(--ui-warning);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .has-data-\\[state\\=checked\\]\\:bg-warning\\/10:has([data-state=\"checked\"]) {\n      background-color: color-mix(in oklab, var(--ui-warning) 10%, transparent);\n    }\n  }\n\n  .not-has-disabled\\:has-data-\\[state\\=checked\\]\\:border-error:not(:has(:disabled)):has([data-state=\"checked\"]) {\n    border-color: var(--ui-error);\n  }\n\n  .not-has-disabled\\:has-data-\\[state\\=checked\\]\\:border-info:not(:has(:disabled)):has([data-state=\"checked\"]) {\n    border-color: var(--ui-info);\n  }\n\n  .not-has-disabled\\:has-data-\\[state\\=checked\\]\\:border-inverted:not(:has(:disabled)):has([data-state=\"checked\"]) {\n    border-color: var(--ui-border-inverted);\n  }\n\n  .not-has-disabled\\:has-data-\\[state\\=checked\\]\\:border-primary:not(:has(:disabled)):has([data-state=\"checked\"]) {\n    border-color: var(--ui-primary);\n  }\n\n  .not-has-disabled\\:has-data-\\[state\\=checked\\]\\:border-secondary:not(:has(:disabled)):has([data-state=\"checked\"]) {\n    border-color: var(--ui-secondary);\n  }\n\n  .not-has-disabled\\:has-data-\\[state\\=checked\\]\\:border-success:not(:has(:disabled)):has([data-state=\"checked\"]) {\n    border-color: var(--ui-success);\n  }\n\n  .not-has-disabled\\:has-data-\\[state\\=checked\\]\\:border-warning:not(:has(:disabled)):has([data-state=\"checked\"]) {\n    border-color: var(--ui-warning);\n  }\n\n  .not-has-disabled\\:not-has-aria-disabled\\:has-data-\\[state\\=checked\\]\\:border-error:not(:has(:disabled)):not(:has([aria-disabled=\"true\"])):has([data-state=\"checked\"]) {\n    border-color: var(--ui-error);\n  }\n\n  .not-has-disabled\\:not-has-aria-disabled\\:has-data-\\[state\\=checked\\]\\:border-info:not(:has(:disabled)):not(:has([aria-disabled=\"true\"])):has([data-state=\"checked\"]) {\n    border-color: var(--ui-info);\n  }\n\n  .not-has-disabled\\:not-has-aria-disabled\\:has-data-\\[state\\=checked\\]\\:border-inverted:not(:has(:disabled)):not(:has([aria-disabled=\"true\"])):has([data-state=\"checked\"]) {\n    border-color: var(--ui-border-inverted);\n  }\n\n  .not-has-disabled\\:not-has-aria-disabled\\:has-data-\\[state\\=checked\\]\\:border-primary:not(:has(:disabled)):not(:has([aria-disabled=\"true\"])):has([data-state=\"checked\"]) {\n    border-color: var(--ui-primary);\n  }\n\n  .not-has-disabled\\:not-has-aria-disabled\\:has-data-\\[state\\=checked\\]\\:border-secondary:not(:has(:disabled)):not(:has([aria-disabled=\"true\"])):has([data-state=\"checked\"]) {\n    border-color: var(--ui-secondary);\n  }\n\n  .not-has-disabled\\:not-has-aria-disabled\\:has-data-\\[state\\=checked\\]\\:border-success:not(:has(:disabled)):not(:has([aria-disabled=\"true\"])):has([data-state=\"checked\"]) {\n    border-color: var(--ui-success);\n  }\n\n  .not-has-disabled\\:not-has-aria-disabled\\:has-data-\\[state\\=checked\\]\\:border-warning:not(:has(:disabled)):not(:has([aria-disabled=\"true\"])):has([data-state=\"checked\"]) {\n    border-color: var(--ui-warning);\n  }\n\n  .has-\\[\\[contenteditable\\]\\:focus-visible\\]\\:ring-error:has([contenteditable]:focus-visible) {\n    --tw-ring-color: var(--ui-error);\n  }\n\n  .has-\\[\\[contenteditable\\]\\:focus-visible\\]\\:ring-info:has([contenteditable]:focus-visible) {\n    --tw-ring-color: var(--ui-info);\n  }\n\n  .has-\\[\\[contenteditable\\]\\:focus-visible\\]\\:ring-inverted:has([contenteditable]:focus-visible) {\n    --tw-ring-color: var(--ui-border-inverted);\n  }\n\n  .has-\\[\\[contenteditable\\]\\:focus-visible\\]\\:ring-primary:has([contenteditable]:focus-visible) {\n    --tw-ring-color: var(--ui-primary);\n  }\n\n  .has-\\[\\[contenteditable\\]\\:focus-visible\\]\\:ring-secondary:has([contenteditable]:focus-visible) {\n    --tw-ring-color: var(--ui-secondary);\n  }\n\n  .has-\\[\\[contenteditable\\]\\:focus-visible\\]\\:ring-success:has([contenteditable]:focus-visible) {\n    --tw-ring-color: var(--ui-success);\n  }\n\n  .has-\\[\\[contenteditable\\]\\:focus-visible\\]\\:ring-warning:has([contenteditable]:focus-visible) {\n    --tw-ring-color: var(--ui-warning);\n  }\n\n  .has-\\[\\[contenteditable\\]\\:focus-visible\\]\\:outline-3:has([contenteditable]:focus-visible) {\n    outline-style: var(--tw-outline-style);\n    outline-width: 3px;\n  }\n\n  .has-\\[textarea\\:focus-visible\\]\\:ring-error:has(:is(textarea:focus-visible)) {\n    --tw-ring-color: var(--ui-error);\n  }\n\n  .has-\\[textarea\\:focus-visible\\]\\:ring-info:has(:is(textarea:focus-visible)) {\n    --tw-ring-color: var(--ui-info);\n  }\n\n  .has-\\[textarea\\:focus-visible\\]\\:ring-inverted:has(:is(textarea:focus-visible)) {\n    --tw-ring-color: var(--ui-border-inverted);\n  }\n\n  .has-\\[textarea\\:focus-visible\\]\\:ring-primary:has(:is(textarea:focus-visible)) {\n    --tw-ring-color: var(--ui-primary);\n  }\n\n  .has-\\[textarea\\:focus-visible\\]\\:ring-secondary:has(:is(textarea:focus-visible)) {\n    --tw-ring-color: var(--ui-secondary);\n  }\n\n  .has-\\[textarea\\:focus-visible\\]\\:ring-success:has(:is(textarea:focus-visible)) {\n    --tw-ring-color: var(--ui-success);\n  }\n\n  .has-\\[textarea\\:focus-visible\\]\\:ring-warning:has(:is(textarea:focus-visible)) {\n    --tw-ring-color: var(--ui-warning);\n  }\n\n  .has-\\[textarea\\:focus-visible\\]\\:outline-3:has(:is(textarea:focus-visible)) {\n    outline-style: var(--tw-outline-style);\n    outline-width: 3px;\n  }\n\n  .has-\\[\\>a\\:focus-visible\\]\\:ring-primary:has( > a:focus-visible) {\n    --tw-ring-color: var(--ui-primary);\n  }\n\n  .has-\\[\\>a\\:focus-visible\\]\\:outline-3:has( > a:focus-visible) {\n    outline-style: var(--tw-outline-style);\n    outline-width: 3px;\n  }\n\n  .aria-disabled\\:cursor-not-allowed[aria-disabled=\"true\"] {\n    cursor: not-allowed;\n  }\n\n  .aria-disabled\\:bg-default[aria-disabled=\"true\"] {\n    background-color: var(--ui-bg);\n  }\n\n  .aria-disabled\\:bg-elevated[aria-disabled=\"true\"] {\n    background-color: var(--ui-bg-elevated);\n  }\n\n  .aria-disabled\\:bg-error[aria-disabled=\"true\"], .aria-disabled\\:bg-error\\/10[aria-disabled=\"true\"] {\n    background-color: var(--ui-error);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .aria-disabled\\:bg-error\\/10[aria-disabled=\"true\"] {\n      background-color: color-mix(in oklab, var(--ui-error) 10%, transparent);\n    }\n  }\n\n  .aria-disabled\\:bg-info[aria-disabled=\"true\"], .aria-disabled\\:bg-info\\/10[aria-disabled=\"true\"] {\n    background-color: var(--ui-info);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .aria-disabled\\:bg-info\\/10[aria-disabled=\"true\"] {\n      background-color: color-mix(in oklab, var(--ui-info) 10%, transparent);\n    }\n  }\n\n  .aria-disabled\\:bg-inverted[aria-disabled=\"true\"] {\n    background-color: var(--ui-bg-inverted);\n  }\n\n  .aria-disabled\\:bg-primary[aria-disabled=\"true\"], .aria-disabled\\:bg-primary\\/10[aria-disabled=\"true\"] {\n    background-color: var(--ui-primary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .aria-disabled\\:bg-primary\\/10[aria-disabled=\"true\"] {\n      background-color: color-mix(in oklab, var(--ui-primary) 10%, transparent);\n    }\n  }\n\n  .aria-disabled\\:bg-secondary[aria-disabled=\"true\"], .aria-disabled\\:bg-secondary\\/10[aria-disabled=\"true\"] {\n    background-color: var(--ui-secondary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .aria-disabled\\:bg-secondary\\/10[aria-disabled=\"true\"] {\n      background-color: color-mix(in oklab, var(--ui-secondary) 10%, transparent);\n    }\n  }\n\n  .aria-disabled\\:bg-success[aria-disabled=\"true\"], .aria-disabled\\:bg-success\\/10[aria-disabled=\"true\"] {\n    background-color: var(--ui-success);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .aria-disabled\\:bg-success\\/10[aria-disabled=\"true\"] {\n      background-color: color-mix(in oklab, var(--ui-success) 10%, transparent);\n    }\n  }\n\n  .aria-disabled\\:bg-transparent[aria-disabled=\"true\"] {\n    background-color: #0000;\n  }\n\n  .aria-disabled\\:bg-warning[aria-disabled=\"true\"], .aria-disabled\\:bg-warning\\/10[aria-disabled=\"true\"] {\n    background-color: var(--ui-warning);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .aria-disabled\\:bg-warning\\/10[aria-disabled=\"true\"] {\n      background-color: color-mix(in oklab, var(--ui-warning) 10%, transparent);\n    }\n  }\n\n  .aria-disabled\\:text-error[aria-disabled=\"true\"] {\n    color: var(--ui-error);\n  }\n\n  .aria-disabled\\:text-info[aria-disabled=\"true\"] {\n    color: var(--ui-info);\n  }\n\n  .aria-disabled\\:text-muted[aria-disabled=\"true\"] {\n    color: var(--ui-text-muted);\n  }\n\n  .aria-disabled\\:text-primary[aria-disabled=\"true\"] {\n    color: var(--ui-primary);\n  }\n\n  .aria-disabled\\:text-secondary[aria-disabled=\"true\"] {\n    color: var(--ui-secondary);\n  }\n\n  .aria-disabled\\:text-success[aria-disabled=\"true\"] {\n    color: var(--ui-success);\n  }\n\n  .aria-disabled\\:text-warning[aria-disabled=\"true\"] {\n    color: var(--ui-warning);\n  }\n\n  .aria-disabled\\:opacity-75[aria-disabled=\"true\"] {\n    opacity: .75;\n  }\n\n  @media (hover: hover) {\n    .hover\\:aria-disabled\\:bg-transparent:hover[aria-disabled=\"true\"] {\n      background-color: #0000;\n    }\n  }\n\n  .data-disabled\\:cursor-not-allowed[data-disabled] {\n    cursor: not-allowed;\n  }\n\n  .data-disabled\\:text-muted[data-disabled] {\n    color: var(--ui-text-muted);\n  }\n\n  .data-disabled\\:opacity-75[data-disabled] {\n    opacity: .75;\n  }\n\n  .data-highlighted\\:bg-error\\/10[data-highlighted] {\n    background-color: var(--ui-error);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-highlighted\\:bg-error\\/10[data-highlighted] {\n      background-color: color-mix(in oklab, var(--ui-error) 10%, transparent);\n    }\n  }\n\n  .data-highlighted\\:bg-error\\/20[data-highlighted] {\n    background-color: var(--ui-error);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-highlighted\\:bg-error\\/20[data-highlighted] {\n      background-color: color-mix(in oklab, var(--ui-error) 20%, transparent);\n    }\n  }\n\n  .data-highlighted\\:bg-info\\/10[data-highlighted] {\n    background-color: var(--ui-info);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-highlighted\\:bg-info\\/10[data-highlighted] {\n      background-color: color-mix(in oklab, var(--ui-info) 10%, transparent);\n    }\n  }\n\n  .data-highlighted\\:bg-info\\/20[data-highlighted] {\n    background-color: var(--ui-info);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-highlighted\\:bg-info\\/20[data-highlighted] {\n      background-color: color-mix(in oklab, var(--ui-info) 20%, transparent);\n    }\n  }\n\n  .data-highlighted\\:bg-inverted\\/10[data-highlighted] {\n    background-color: var(--ui-bg-inverted);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-highlighted\\:bg-inverted\\/10[data-highlighted] {\n      background-color: color-mix(in oklab, var(--ui-bg-inverted) 10%, transparent);\n    }\n  }\n\n  .data-highlighted\\:bg-inverted\\/20[data-highlighted] {\n    background-color: var(--ui-bg-inverted);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-highlighted\\:bg-inverted\\/20[data-highlighted] {\n      background-color: color-mix(in oklab, var(--ui-bg-inverted) 20%, transparent);\n    }\n  }\n\n  .data-highlighted\\:bg-primary\\/10[data-highlighted] {\n    background-color: var(--ui-primary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-highlighted\\:bg-primary\\/10[data-highlighted] {\n      background-color: color-mix(in oklab, var(--ui-primary) 10%, transparent);\n    }\n  }\n\n  .data-highlighted\\:bg-primary\\/20[data-highlighted] {\n    background-color: var(--ui-primary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-highlighted\\:bg-primary\\/20[data-highlighted] {\n      background-color: color-mix(in oklab, var(--ui-primary) 20%, transparent);\n    }\n  }\n\n  .data-highlighted\\:bg-secondary\\/10[data-highlighted] {\n    background-color: var(--ui-secondary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-highlighted\\:bg-secondary\\/10[data-highlighted] {\n      background-color: color-mix(in oklab, var(--ui-secondary) 10%, transparent);\n    }\n  }\n\n  .data-highlighted\\:bg-secondary\\/20[data-highlighted] {\n    background-color: var(--ui-secondary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-highlighted\\:bg-secondary\\/20[data-highlighted] {\n      background-color: color-mix(in oklab, var(--ui-secondary) 20%, transparent);\n    }\n  }\n\n  .data-highlighted\\:bg-success\\/10[data-highlighted] {\n    background-color: var(--ui-success);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-highlighted\\:bg-success\\/10[data-highlighted] {\n      background-color: color-mix(in oklab, var(--ui-success) 10%, transparent);\n    }\n  }\n\n  .data-highlighted\\:bg-success\\/20[data-highlighted] {\n    background-color: var(--ui-success);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-highlighted\\:bg-success\\/20[data-highlighted] {\n      background-color: color-mix(in oklab, var(--ui-success) 20%, transparent);\n    }\n  }\n\n  .data-highlighted\\:bg-warning\\/10[data-highlighted] {\n    background-color: var(--ui-warning);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-highlighted\\:bg-warning\\/10[data-highlighted] {\n      background-color: color-mix(in oklab, var(--ui-warning) 10%, transparent);\n    }\n  }\n\n  .data-highlighted\\:bg-warning\\/20[data-highlighted] {\n    background-color: var(--ui-warning);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-highlighted\\:bg-warning\\/20[data-highlighted] {\n      background-color: color-mix(in oklab, var(--ui-warning) 20%, transparent);\n    }\n  }\n\n  .data-highlighted\\:text-error[data-highlighted] {\n    color: var(--ui-error);\n  }\n\n  .data-highlighted\\:text-highlighted[data-highlighted] {\n    color: var(--ui-text-highlighted);\n  }\n\n  .data-highlighted\\:text-info[data-highlighted] {\n    color: var(--ui-info);\n  }\n\n  .data-highlighted\\:text-primary[data-highlighted] {\n    color: var(--ui-primary);\n  }\n\n  .data-highlighted\\:text-secondary[data-highlighted] {\n    color: var(--ui-secondary);\n  }\n\n  .data-highlighted\\:text-success[data-highlighted] {\n    color: var(--ui-success);\n  }\n\n  .data-highlighted\\:text-warning[data-highlighted] {\n    color: var(--ui-warning);\n  }\n\n  .data-highlighted\\:not-data-disabled\\:text-highlighted[data-highlighted]:not([data-disabled]) {\n    color: var(--ui-text-highlighted);\n  }\n\n  .data-highlighted\\:before\\:bg-elevated\\/50[data-highlighted]:before {\n    content: var(--tw-content);\n    background-color: var(--ui-bg-elevated);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-highlighted\\:before\\:bg-elevated\\/50[data-highlighted]:before {\n      background-color: color-mix(in oklab, var(--ui-bg-elevated) 50%, transparent);\n    }\n  }\n\n  .data-highlighted\\:before\\:bg-error\\/10[data-highlighted]:before {\n    content: var(--tw-content);\n    background-color: var(--ui-error);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-highlighted\\:before\\:bg-error\\/10[data-highlighted]:before {\n      background-color: color-mix(in oklab, var(--ui-error) 10%, transparent);\n    }\n  }\n\n  .data-highlighted\\:before\\:bg-info\\/10[data-highlighted]:before {\n    content: var(--tw-content);\n    background-color: var(--ui-info);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-highlighted\\:before\\:bg-info\\/10[data-highlighted]:before {\n      background-color: color-mix(in oklab, var(--ui-info) 10%, transparent);\n    }\n  }\n\n  .data-highlighted\\:before\\:bg-primary\\/10[data-highlighted]:before {\n    content: var(--tw-content);\n    background-color: var(--ui-primary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-highlighted\\:before\\:bg-primary\\/10[data-highlighted]:before {\n      background-color: color-mix(in oklab, var(--ui-primary) 10%, transparent);\n    }\n  }\n\n  .data-highlighted\\:before\\:bg-secondary\\/10[data-highlighted]:before {\n    content: var(--tw-content);\n    background-color: var(--ui-secondary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-highlighted\\:before\\:bg-secondary\\/10[data-highlighted]:before {\n      background-color: color-mix(in oklab, var(--ui-secondary) 10%, transparent);\n    }\n  }\n\n  .data-highlighted\\:before\\:bg-success\\/10[data-highlighted]:before {\n    content: var(--tw-content);\n    background-color: var(--ui-success);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-highlighted\\:before\\:bg-success\\/10[data-highlighted]:before {\n      background-color: color-mix(in oklab, var(--ui-success) 10%, transparent);\n    }\n  }\n\n  .data-highlighted\\:before\\:bg-warning\\/10[data-highlighted]:before {\n    content: var(--tw-content);\n    background-color: var(--ui-warning);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-highlighted\\:before\\:bg-warning\\/10[data-highlighted]:before {\n      background-color: color-mix(in oklab, var(--ui-warning) 10%, transparent);\n    }\n  }\n\n  .data-highlighted\\:not-data-disabled\\:before\\:bg-elevated\\/50[data-highlighted]:not([data-disabled]):before {\n    content: var(--tw-content);\n    background-color: var(--ui-bg-elevated);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-highlighted\\:not-data-disabled\\:before\\:bg-elevated\\/50[data-highlighted]:not([data-disabled]):before {\n      background-color: color-mix(in oklab, var(--ui-bg-elevated) 50%, transparent);\n    }\n  }\n\n  .data-invalid\\:text-error[data-invalid] {\n    color: var(--ui-error);\n  }\n\n  .data-outside-view\\:text-muted[data-outside-view] {\n    color: var(--ui-text-muted);\n  }\n\n  .data-placeholder\\:text-dimmed[data-placeholder] {\n    color: var(--ui-text-dimmed);\n  }\n\n  :is(.\\*\\*\\:data-reka-popper-content-wrapper\\:pointer-events-none *)[data-reka-popper-content-wrapper] {\n    pointer-events: none;\n  }\n\n  .data-selected\\:bg-default[data-selected] {\n    background-color: var(--ui-bg);\n  }\n\n  .data-selected\\:bg-elevated[data-selected] {\n    background-color: var(--ui-bg-elevated);\n  }\n\n  .data-selected\\:bg-error[data-selected], .data-selected\\:bg-error\\/10[data-selected] {\n    background-color: var(--ui-error);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-selected\\:bg-error\\/10[data-selected] {\n      background-color: color-mix(in oklab, var(--ui-error) 10%, transparent);\n    }\n  }\n\n  .data-selected\\:bg-info[data-selected], .data-selected\\:bg-info\\/10[data-selected] {\n    background-color: var(--ui-info);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-selected\\:bg-info\\/10[data-selected] {\n      background-color: color-mix(in oklab, var(--ui-info) 10%, transparent);\n    }\n  }\n\n  .data-selected\\:bg-inverted[data-selected] {\n    background-color: var(--ui-bg-inverted);\n  }\n\n  .data-selected\\:bg-primary[data-selected], .data-selected\\:bg-primary\\/10[data-selected] {\n    background-color: var(--ui-primary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-selected\\:bg-primary\\/10[data-selected] {\n      background-color: color-mix(in oklab, var(--ui-primary) 10%, transparent);\n    }\n  }\n\n  .data-selected\\:bg-secondary[data-selected], .data-selected\\:bg-secondary\\/10[data-selected] {\n    background-color: var(--ui-secondary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-selected\\:bg-secondary\\/10[data-selected] {\n      background-color: color-mix(in oklab, var(--ui-secondary) 10%, transparent);\n    }\n  }\n\n  .data-selected\\:bg-success[data-selected], .data-selected\\:bg-success\\/10[data-selected] {\n    background-color: var(--ui-success);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-selected\\:bg-success\\/10[data-selected] {\n      background-color: color-mix(in oklab, var(--ui-success) 10%, transparent);\n    }\n  }\n\n  .data-selected\\:bg-warning[data-selected], .data-selected\\:bg-warning\\/10[data-selected] {\n    background-color: var(--ui-warning);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-selected\\:bg-warning\\/10[data-selected] {\n      background-color: color-mix(in oklab, var(--ui-warning) 10%, transparent);\n    }\n  }\n\n  .data-selected\\:text-default[data-selected] {\n    color: var(--ui-text);\n  }\n\n  .data-selected\\:text-error[data-selected] {\n    color: var(--ui-error);\n  }\n\n  .data-selected\\:text-info[data-selected] {\n    color: var(--ui-info);\n  }\n\n  .data-selected\\:text-inverted[data-selected] {\n    color: var(--ui-text-inverted);\n  }\n\n  .data-selected\\:text-primary[data-selected] {\n    color: var(--ui-primary);\n  }\n\n  .data-selected\\:text-secondary[data-selected] {\n    color: var(--ui-secondary);\n  }\n\n  .data-selected\\:text-success[data-selected] {\n    color: var(--ui-success);\n  }\n\n  .data-selected\\:text-warning[data-selected] {\n    color: var(--ui-warning);\n  }\n\n  .data-selected\\:ring[data-selected] {\n    --tw-ring-shadow: var(--tw-ring-inset, ) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentcolor);\n    box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);\n  }\n\n  .data-selected\\:ring-accented[data-selected] {\n    --tw-ring-color: var(--ui-border-accented);\n  }\n\n  .data-selected\\:ring-error\\/25[data-selected] {\n    --tw-ring-color: var(--ui-error);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-selected\\:ring-error\\/25[data-selected] {\n      --tw-ring-color: color-mix(in oklab, var(--ui-error) 25%, transparent);\n    }\n  }\n\n  .data-selected\\:ring-error\\/50[data-selected] {\n    --tw-ring-color: var(--ui-error);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-selected\\:ring-error\\/50[data-selected] {\n      --tw-ring-color: color-mix(in oklab, var(--ui-error) 50%, transparent);\n    }\n  }\n\n  .data-selected\\:ring-info\\/25[data-selected] {\n    --tw-ring-color: var(--ui-info);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-selected\\:ring-info\\/25[data-selected] {\n      --tw-ring-color: color-mix(in oklab, var(--ui-info) 25%, transparent);\n    }\n  }\n\n  .data-selected\\:ring-info\\/50[data-selected] {\n    --tw-ring-color: var(--ui-info);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-selected\\:ring-info\\/50[data-selected] {\n      --tw-ring-color: color-mix(in oklab, var(--ui-info) 50%, transparent);\n    }\n  }\n\n  .data-selected\\:ring-primary\\/25[data-selected] {\n    --tw-ring-color: var(--ui-primary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-selected\\:ring-primary\\/25[data-selected] {\n      --tw-ring-color: color-mix(in oklab, var(--ui-primary) 25%, transparent);\n    }\n  }\n\n  .data-selected\\:ring-primary\\/50[data-selected] {\n    --tw-ring-color: var(--ui-primary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-selected\\:ring-primary\\/50[data-selected] {\n      --tw-ring-color: color-mix(in oklab, var(--ui-primary) 50%, transparent);\n    }\n  }\n\n  .data-selected\\:ring-secondary\\/25[data-selected] {\n    --tw-ring-color: var(--ui-secondary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-selected\\:ring-secondary\\/25[data-selected] {\n      --tw-ring-color: color-mix(in oklab, var(--ui-secondary) 25%, transparent);\n    }\n  }\n\n  .data-selected\\:ring-secondary\\/50[data-selected] {\n    --tw-ring-color: var(--ui-secondary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-selected\\:ring-secondary\\/50[data-selected] {\n      --tw-ring-color: color-mix(in oklab, var(--ui-secondary) 50%, transparent);\n    }\n  }\n\n  .data-selected\\:ring-success\\/25[data-selected] {\n    --tw-ring-color: var(--ui-success);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-selected\\:ring-success\\/25[data-selected] {\n      --tw-ring-color: color-mix(in oklab, var(--ui-success) 25%, transparent);\n    }\n  }\n\n  .data-selected\\:ring-success\\/50[data-selected] {\n    --tw-ring-color: var(--ui-success);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-selected\\:ring-success\\/50[data-selected] {\n      --tw-ring-color: color-mix(in oklab, var(--ui-success) 50%, transparent);\n    }\n  }\n\n  .data-selected\\:ring-warning\\/25[data-selected] {\n    --tw-ring-color: var(--ui-warning);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-selected\\:ring-warning\\/25[data-selected] {\n      --tw-ring-color: color-mix(in oklab, var(--ui-warning) 25%, transparent);\n    }\n  }\n\n  .data-selected\\:ring-warning\\/50[data-selected] {\n    --tw-ring-color: var(--ui-warning);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-selected\\:ring-warning\\/50[data-selected] {\n      --tw-ring-color: color-mix(in oklab, var(--ui-warning) 50%, transparent);\n    }\n  }\n\n  .data-selected\\:ring-inset[data-selected] {\n    --tw-ring-inset: inset;\n  }\n\n  .data-selected\\:focus-visible\\:ring-error[data-selected]:focus-visible {\n    --tw-ring-color: var(--ui-error);\n  }\n\n  .data-selected\\:focus-visible\\:ring-info[data-selected]:focus-visible {\n    --tw-ring-color: var(--ui-info);\n  }\n\n  .data-selected\\:focus-visible\\:ring-inverted[data-selected]:focus-visible {\n    --tw-ring-color: var(--ui-border-inverted);\n  }\n\n  .data-selected\\:focus-visible\\:ring-primary[data-selected]:focus-visible {\n    --tw-ring-color: var(--ui-primary);\n  }\n\n  .data-selected\\:focus-visible\\:ring-secondary[data-selected]:focus-visible {\n    --tw-ring-color: var(--ui-secondary);\n  }\n\n  .data-selected\\:focus-visible\\:ring-success[data-selected]:focus-visible {\n    --tw-ring-color: var(--ui-success);\n  }\n\n  .data-selected\\:focus-visible\\:ring-warning[data-selected]:focus-visible {\n    --tw-ring-color: var(--ui-warning);\n  }\n\n  .data-today\\:font-semibold[data-today] {\n    --tw-font-weight: var(--font-weight-semibold);\n    font-weight: var(--font-weight-semibold);\n  }\n\n  .data-today\\:not-data-selected\\:text-error[data-today]:not([data-selected]) {\n    color: var(--ui-error);\n  }\n\n  .data-today\\:not-data-selected\\:text-highlighted[data-today]:not([data-selected]) {\n    color: var(--ui-text-highlighted);\n  }\n\n  .data-today\\:not-data-selected\\:text-info[data-today]:not([data-selected]) {\n    color: var(--ui-info);\n  }\n\n  .data-today\\:not-data-selected\\:text-primary[data-today]:not([data-selected]) {\n    color: var(--ui-primary);\n  }\n\n  .data-today\\:not-data-selected\\:text-secondary[data-today]:not([data-selected]) {\n    color: var(--ui-secondary);\n  }\n\n  .data-today\\:not-data-selected\\:text-success[data-today]:not([data-selected]) {\n    color: var(--ui-success);\n  }\n\n  .data-today\\:not-data-selected\\:text-warning[data-today]:not([data-selected]) {\n    color: var(--ui-warning);\n  }\n\n  .data-unavailable\\:pointer-events-none[data-unavailable] {\n    pointer-events: none;\n  }\n\n  .data-unavailable\\:text-muted[data-unavailable] {\n    color: var(--ui-text-muted);\n  }\n\n  .data-unavailable\\:line-through[data-unavailable] {\n    text-decoration-line: line-through;\n  }\n\n  .data-\\[active\\=true\\]\\:text-highlighted[data-active=\"true\"] {\n    color: var(--ui-text-highlighted);\n  }\n\n  .data-\\[disabled\\]\\:cursor-not-allowed[data-disabled] {\n    cursor: not-allowed;\n  }\n\n  .data-\\[disabled\\]\\:opacity-75[data-disabled] {\n    opacity: .75;\n  }\n\n  .data-\\[dragging\\=true\\]\\:bg-elevated\\/25[data-dragging=\"true\"] {\n    background-color: var(--ui-bg-elevated);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-\\[dragging\\=true\\]\\:bg-elevated\\/25[data-dragging=\"true\"] {\n      background-color: color-mix(in oklab, var(--ui-bg-elevated) 25%, transparent);\n    }\n  }\n\n  .data-\\[expanded\\=true\\]\\:h-\\(--height\\)[data-expanded=\"true\"] {\n    height: var(--height);\n  }\n\n  :is(.data-\\[front\\=false\\]\\:\\*\\:transition-opacity[data-front=\"false\"] > *) {\n    transition-property: opacity;\n    transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));\n    transition-duration: var(--tw-duration, var(--default-transition-duration));\n  }\n\n  :is(.data-\\[front\\=false\\]\\:\\*\\:duration-100[data-front=\"false\"] > *) {\n    --tw-duration: .1s;\n    transition-duration: .1s;\n  }\n\n  .data-\\[collapsed\\=true\\]\\:data-\\[front\\=false\\]\\:h-\\(--front-height\\)[data-collapsed=\"true\"][data-front=\"false\"] {\n    height: var(--front-height);\n  }\n\n  :is(.data-\\[collapsed\\=true\\]\\:data-\\[front\\=false\\]\\:\\*\\:opacity-0[data-collapsed=\"true\"][data-front=\"false\"] > *) {\n    opacity: 0;\n  }\n\n  .data-\\[motion\\=from-end\\]\\:animate-\\[enter-from-right_200ms_var\\(--ease-out\\)\\][data-motion=\"from-end\"] {\n    animation: enter-from-right .2s var(--ease-out);\n  }\n\n  .data-\\[motion\\=from-start\\]\\:animate-\\[enter-from-left_200ms_var\\(--ease-out\\)\\][data-motion=\"from-start\"] {\n    animation: enter-from-left .2s var(--ease-out);\n  }\n\n  .data-\\[motion\\=to-end\\]\\:animate-\\[exit-to-right_200ms_var\\(--ease-out\\)\\][data-motion=\"to-end\"] {\n    animation: exit-to-right .2s var(--ease-out);\n  }\n\n  .data-\\[motion\\=to-start\\]\\:animate-\\[exit-to-left_200ms_var\\(--ease-out\\)\\][data-motion=\"to-start\"] {\n    animation: exit-to-left .2s var(--ease-out);\n  }\n\n  .data-\\[panel-resize-handle-enabled\\=false\\]\\:cursor-default[data-panel-resize-handle-enabled=\"false\"] {\n    cursor: default;\n  }\n\n  .data-\\[segment\\=day\\]\\:w-8[data-segment=\"day\"] {\n    width: calc(var(--spacing) * 8);\n  }\n\n  .data-\\[segment\\=day\\]\\:w-9[data-segment=\"day\"] {\n    width: calc(var(--spacing) * 9);\n  }\n\n  .data-\\[segment\\=day\\]\\:w-10[data-segment=\"day\"] {\n    width: calc(var(--spacing) * 10);\n  }\n\n  .data-\\[segment\\=literal\\]\\:text-muted[data-segment=\"literal\"] {\n    color: var(--ui-text-muted);\n  }\n\n  .data-\\[segment\\=month\\]\\:w-8[data-segment=\"month\"] {\n    width: calc(var(--spacing) * 8);\n  }\n\n  .data-\\[segment\\=month\\]\\:w-9[data-segment=\"month\"] {\n    width: calc(var(--spacing) * 9);\n  }\n\n  .data-\\[segment\\=month\\]\\:w-10[data-segment=\"month\"], .data-\\[segment\\=year\\]\\:w-10[data-segment=\"year\"] {\n    width: calc(var(--spacing) * 10);\n  }\n\n  .data-\\[segment\\=year\\]\\:w-11[data-segment=\"year\"] {\n    width: calc(var(--spacing) * 11);\n  }\n\n  .data-\\[segment\\=year\\]\\:w-12[data-segment=\"year\"] {\n    width: calc(var(--spacing) * 12);\n  }\n\n  .data-\\[selected\\=true\\]\\:bg-elevated\\/50[data-selected=\"true\"] {\n    background-color: var(--ui-bg-elevated);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-\\[selected\\=true\\]\\:bg-elevated\\/50[data-selected=\"true\"] {\n      background-color: color-mix(in oklab, var(--ui-bg-elevated) 50%, transparent);\n    }\n  }\n\n  .data-\\[state\\=active\\]\\:bg-accented[data-state=\"active\"] {\n    background-color: var(--ui-bg-accented);\n  }\n\n  .data-\\[state\\=active\\]\\:bg-inverted[data-state=\"active\"] {\n    background-color: var(--ui-bg-inverted);\n  }\n\n  .data-\\[state\\=active\\]\\:text-error[data-state=\"active\"] {\n    color: var(--ui-error);\n  }\n\n  .data-\\[state\\=active\\]\\:text-highlighted[data-state=\"active\"] {\n    color: var(--ui-text-highlighted);\n  }\n\n  .data-\\[state\\=active\\]\\:text-info[data-state=\"active\"] {\n    color: var(--ui-info);\n  }\n\n  .data-\\[state\\=active\\]\\:text-inverted[data-state=\"active\"] {\n    color: var(--ui-text-inverted);\n  }\n\n  .data-\\[state\\=active\\]\\:text-primary[data-state=\"active\"] {\n    color: var(--ui-primary);\n  }\n\n  .data-\\[state\\=active\\]\\:text-secondary[data-state=\"active\"] {\n    color: var(--ui-secondary);\n  }\n\n  .data-\\[state\\=active\\]\\:text-success[data-state=\"active\"] {\n    color: var(--ui-success);\n  }\n\n  .data-\\[state\\=active\\]\\:text-warning[data-state=\"active\"] {\n    color: var(--ui-warning);\n  }\n\n  :where([data-slot=\"list\"]:not(:has([data-slot=\"indicator\"]))) .in-\\[\\[data-slot\\=list\\]\\:not\\(\\:has\\(\\[data-slot\\=indicator\\]\\)\\)\\]\\:data-\\[state\\=active\\]\\:isolate[data-state=\"active\"] {\n    isolation: isolate;\n  }\n\n  :where([data-slot=\"list\"]:not(:has([data-slot=\"indicator\"]))) .in-\\[\\[data-slot\\=list\\]\\:not\\(\\:has\\(\\[data-slot\\=indicator\\]\\)\\)\\]\\:data-\\[state\\=active\\]\\:before\\:absolute[data-state=\"active\"]:before {\n    content: var(--tw-content);\n    position: absolute;\n  }\n\n  :where([data-slot=\"list\"]:not(:has([data-slot=\"indicator\"]))) .in-\\[\\[data-slot\\=list\\]\\:not\\(\\:has\\(\\[data-slot\\=indicator\\]\\)\\)\\]\\:data-\\[state\\=active\\]\\:before\\:inset-0[data-state=\"active\"]:before {\n    content: var(--tw-content);\n    inset: 0;\n  }\n\n  :where([data-slot=\"list\"]:not(:has([data-slot=\"indicator\"]))) .in-\\[\\[data-slot\\=list\\]\\:not\\(\\:has\\(\\[data-slot\\=indicator\\]\\)\\)\\]\\:data-\\[state\\=active\\]\\:before\\:-z-10[data-state=\"active\"]:before {\n    content: var(--tw-content);\n    z-index: calc(10 * -1);\n  }\n\n  :where([data-slot=\"list\"]:not(:has([data-slot=\"indicator\"]))) .in-\\[\\[data-slot\\=list\\]\\:not\\(\\:has\\(\\[data-slot\\=indicator\\]\\)\\)\\]\\:data-\\[state\\=active\\]\\:before\\:rounded-md[data-state=\"active\"]:before {\n    content: var(--tw-content);\n    border-radius: calc(var(--ui-radius) * 1.5);\n  }\n\n  :where([data-slot=\"list\"]:not(:has([data-slot=\"indicator\"]))) .in-\\[\\[data-slot\\=list\\]\\:not\\(\\:has\\(\\[data-slot\\=indicator\\]\\)\\)\\]\\:data-\\[state\\=active\\]\\:before\\:bg-error[data-state=\"active\"]:before {\n    content: var(--tw-content);\n    background-color: var(--ui-error);\n  }\n\n  :where([data-slot=\"list\"]:not(:has([data-slot=\"indicator\"]))) .in-\\[\\[data-slot\\=list\\]\\:not\\(\\:has\\(\\[data-slot\\=indicator\\]\\)\\)\\]\\:data-\\[state\\=active\\]\\:before\\:bg-info[data-state=\"active\"]:before {\n    content: var(--tw-content);\n    background-color: var(--ui-info);\n  }\n\n  :where([data-slot=\"list\"]:not(:has([data-slot=\"indicator\"]))) .in-\\[\\[data-slot\\=list\\]\\:not\\(\\:has\\(\\[data-slot\\=indicator\\]\\)\\)\\]\\:data-\\[state\\=active\\]\\:before\\:bg-inverted[data-state=\"active\"]:before {\n    content: var(--tw-content);\n    background-color: var(--ui-bg-inverted);\n  }\n\n  :where([data-slot=\"list\"]:not(:has([data-slot=\"indicator\"]))) .in-\\[\\[data-slot\\=list\\]\\:not\\(\\:has\\(\\[data-slot\\=indicator\\]\\)\\)\\]\\:data-\\[state\\=active\\]\\:before\\:bg-primary[data-state=\"active\"]:before {\n    content: var(--tw-content);\n    background-color: var(--ui-primary);\n  }\n\n  :where([data-slot=\"list\"]:not(:has([data-slot=\"indicator\"]))) .in-\\[\\[data-slot\\=list\\]\\:not\\(\\:has\\(\\[data-slot\\=indicator\\]\\)\\)\\]\\:data-\\[state\\=active\\]\\:before\\:bg-secondary[data-state=\"active\"]:before {\n    content: var(--tw-content);\n    background-color: var(--ui-secondary);\n  }\n\n  :where([data-slot=\"list\"]:not(:has([data-slot=\"indicator\"]))) .in-\\[\\[data-slot\\=list\\]\\:not\\(\\:has\\(\\[data-slot\\=indicator\\]\\)\\)\\]\\:data-\\[state\\=active\\]\\:before\\:bg-success[data-state=\"active\"]:before {\n    content: var(--tw-content);\n    background-color: var(--ui-success);\n  }\n\n  :where([data-slot=\"list\"]:not(:has([data-slot=\"indicator\"]))) .in-\\[\\[data-slot\\=list\\]\\:not\\(\\:has\\(\\[data-slot\\=indicator\\]\\)\\)\\]\\:data-\\[state\\=active\\]\\:before\\:bg-warning[data-state=\"active\"]:before {\n    content: var(--tw-content);\n    background-color: var(--ui-warning);\n  }\n\n  :where([data-slot=\"list\"]:not(:has([data-slot=\"indicator\"]))) .in-\\[\\[data-slot\\=list\\]\\:not\\(\\:has\\(\\[data-slot\\=indicator\\]\\)\\)\\]\\:data-\\[state\\=active\\]\\:before\\:shadow-xs[data-state=\"active\"]:before {\n    content: var(--tw-content);\n    --tw-shadow: 0 1px 2px 0 var(--tw-shadow-color, #0000000d);\n    box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);\n  }\n\n  :where([data-slot=\"list\"]:not(:has([data-slot=\"indicator\"]))) .in-\\[\\[data-slot\\=list\\]\\:not\\(\\:has\\(\\[data-slot\\=indicator\\]\\)\\)\\]\\:data-\\[state\\=active\\]\\:before\\:content-\\[\\'\\'\\][data-state=\"active\"]:before {\n    --tw-content: \"\";\n    content: var(--tw-content);\n  }\n\n  :where([data-slot=\"list\"]:not(:has([data-slot=\"indicator\"]))) .in-\\[\\[data-slot\\=list\\]\\:not\\(\\:has\\(\\[data-slot\\=indicator\\]\\)\\)\\]\\:data-\\[state\\=active\\]\\:after\\:absolute[data-state=\"active\"]:after {\n    content: var(--tw-content);\n    position: absolute;\n  }\n\n  :where([data-slot=\"list\"]:not(:has([data-slot=\"indicator\"]))) .in-\\[\\[data-slot\\=list\\]\\:not\\(\\:has\\(\\[data-slot\\=indicator\\]\\)\\)\\]\\:data-\\[state\\=active\\]\\:after\\:inset-x-0[data-state=\"active\"]:after {\n    content: var(--tw-content);\n    inset-inline: 0;\n  }\n\n  :where([data-slot=\"list\"]:not(:has([data-slot=\"indicator\"]))) .in-\\[\\[data-slot\\=list\\]\\:not\\(\\:has\\(\\[data-slot\\=indicator\\]\\)\\)\\]\\:data-\\[state\\=active\\]\\:after\\:inset-y-0[data-state=\"active\"]:after {\n    content: var(--tw-content);\n    inset-block: 0;\n  }\n\n  :where([data-slot=\"list\"]:not(:has([data-slot=\"indicator\"]))) .in-\\[\\[data-slot\\=list\\]\\:not\\(\\:has\\(\\[data-slot\\=indicator\\]\\)\\)\\]\\:data-\\[state\\=active\\]\\:after\\:-start-\\[calc\\(var\\(--spacing\\)\\+1px\\)\\][data-state=\"active\"]:after {\n    content: var(--tw-content);\n    inset-inline-start: calc(calc(var(--spacing) + 1px) * -1);\n  }\n\n  :where([data-slot=\"list\"]:not(:has([data-slot=\"indicator\"]))) .in-\\[\\[data-slot\\=list\\]\\:not\\(\\:has\\(\\[data-slot\\=indicator\\]\\)\\)\\]\\:data-\\[state\\=active\\]\\:after\\:-bottom-\\[calc\\(var\\(--spacing\\)\\+1px\\)\\][data-state=\"active\"]:after {\n    content: var(--tw-content);\n    bottom: calc(calc(var(--spacing) + 1px) * -1);\n  }\n\n  :where([data-slot=\"list\"]:not(:has([data-slot=\"indicator\"]))) .in-\\[\\[data-slot\\=list\\]\\:not\\(\\:has\\(\\[data-slot\\=indicator\\]\\)\\)\\]\\:data-\\[state\\=active\\]\\:after\\:h-px[data-state=\"active\"]:after {\n    content: var(--tw-content);\n    height: 1px;\n  }\n\n  :where([data-slot=\"list\"]:not(:has([data-slot=\"indicator\"]))) .in-\\[\\[data-slot\\=list\\]\\:not\\(\\:has\\(\\[data-slot\\=indicator\\]\\)\\)\\]\\:data-\\[state\\=active\\]\\:after\\:w-px[data-state=\"active\"]:after {\n    content: var(--tw-content);\n    width: 1px;\n  }\n\n  :where([data-slot=\"list\"]:not(:has([data-slot=\"indicator\"]))) .in-\\[\\[data-slot\\=list\\]\\:not\\(\\:has\\(\\[data-slot\\=indicator\\]\\)\\)\\]\\:data-\\[state\\=active\\]\\:after\\:rounded-full[data-state=\"active\"]:after {\n    content: var(--tw-content);\n    border-radius: 2147483647px;\n  }\n\n  :where([data-slot=\"list\"]:not(:has([data-slot=\"indicator\"]))) .in-\\[\\[data-slot\\=list\\]\\:not\\(\\:has\\(\\[data-slot\\=indicator\\]\\)\\)\\]\\:data-\\[state\\=active\\]\\:after\\:bg-error[data-state=\"active\"]:after {\n    content: var(--tw-content);\n    background-color: var(--ui-error);\n  }\n\n  :where([data-slot=\"list\"]:not(:has([data-slot=\"indicator\"]))) .in-\\[\\[data-slot\\=list\\]\\:not\\(\\:has\\(\\[data-slot\\=indicator\\]\\)\\)\\]\\:data-\\[state\\=active\\]\\:after\\:bg-info[data-state=\"active\"]:after {\n    content: var(--tw-content);\n    background-color: var(--ui-info);\n  }\n\n  :where([data-slot=\"list\"]:not(:has([data-slot=\"indicator\"]))) .in-\\[\\[data-slot\\=list\\]\\:not\\(\\:has\\(\\[data-slot\\=indicator\\]\\)\\)\\]\\:data-\\[state\\=active\\]\\:after\\:bg-inverted[data-state=\"active\"]:after {\n    content: var(--tw-content);\n    background-color: var(--ui-bg-inverted);\n  }\n\n  :where([data-slot=\"list\"]:not(:has([data-slot=\"indicator\"]))) .in-\\[\\[data-slot\\=list\\]\\:not\\(\\:has\\(\\[data-slot\\=indicator\\]\\)\\)\\]\\:data-\\[state\\=active\\]\\:after\\:bg-primary[data-state=\"active\"]:after {\n    content: var(--tw-content);\n    background-color: var(--ui-primary);\n  }\n\n  :where([data-slot=\"list\"]:not(:has([data-slot=\"indicator\"]))) .in-\\[\\[data-slot\\=list\\]\\:not\\(\\:has\\(\\[data-slot\\=indicator\\]\\)\\)\\]\\:data-\\[state\\=active\\]\\:after\\:bg-secondary[data-state=\"active\"]:after {\n    content: var(--tw-content);\n    background-color: var(--ui-secondary);\n  }\n\n  :where([data-slot=\"list\"]:not(:has([data-slot=\"indicator\"]))) .in-\\[\\[data-slot\\=list\\]\\:not\\(\\:has\\(\\[data-slot\\=indicator\\]\\)\\)\\]\\:data-\\[state\\=active\\]\\:after\\:bg-success[data-state=\"active\"]:after {\n    content: var(--tw-content);\n    background-color: var(--ui-success);\n  }\n\n  :where([data-slot=\"list\"]:not(:has([data-slot=\"indicator\"]))) .in-\\[\\[data-slot\\=list\\]\\:not\\(\\:has\\(\\[data-slot\\=indicator\\]\\)\\)\\]\\:data-\\[state\\=active\\]\\:after\\:bg-warning[data-state=\"active\"]:after {\n    content: var(--tw-content);\n    background-color: var(--ui-warning);\n  }\n\n  :where([data-slot=\"list\"]:not(:has([data-slot=\"indicator\"]))) .in-\\[\\[data-slot\\=list\\]\\:not\\(\\:has\\(\\[data-slot\\=indicator\\]\\)\\)\\]\\:data-\\[state\\=active\\]\\:after\\:content-\\[\\'\\'\\][data-state=\"active\"]:after {\n    --tw-content: \"\";\n    content: var(--tw-content);\n  }\n\n  .data-\\[state\\=checked\\]\\:translate-x-3[data-state=\"checked\"] {\n    --tw-translate-x: calc(var(--spacing) * 3);\n    translate: var(--tw-translate-x) var(--tw-translate-y);\n  }\n\n  .data-\\[state\\=checked\\]\\:translate-x-3\\.5[data-state=\"checked\"] {\n    --tw-translate-x: calc(var(--spacing) * 3.5);\n    translate: var(--tw-translate-x) var(--tw-translate-y);\n  }\n\n  .data-\\[state\\=checked\\]\\:translate-x-4[data-state=\"checked\"] {\n    --tw-translate-x: calc(var(--spacing) * 4);\n    translate: var(--tw-translate-x) var(--tw-translate-y);\n  }\n\n  .data-\\[state\\=checked\\]\\:translate-x-4\\.5[data-state=\"checked\"] {\n    --tw-translate-x: calc(var(--spacing) * 4.5);\n    translate: var(--tw-translate-x) var(--tw-translate-y);\n  }\n\n  .data-\\[state\\=checked\\]\\:translate-x-5[data-state=\"checked\"] {\n    --tw-translate-x: calc(var(--spacing) * 5);\n    translate: var(--tw-translate-x) var(--tw-translate-y);\n  }\n\n  .data-\\[state\\=checked\\]\\:bg-error[data-state=\"checked\"] {\n    background-color: var(--ui-error);\n  }\n\n  .data-\\[state\\=checked\\]\\:bg-info[data-state=\"checked\"] {\n    background-color: var(--ui-info);\n  }\n\n  .data-\\[state\\=checked\\]\\:bg-inverted[data-state=\"checked\"] {\n    background-color: var(--ui-bg-inverted);\n  }\n\n  .data-\\[state\\=checked\\]\\:bg-primary[data-state=\"checked\"] {\n    background-color: var(--ui-primary);\n  }\n\n  .data-\\[state\\=checked\\]\\:bg-secondary[data-state=\"checked\"] {\n    background-color: var(--ui-secondary);\n  }\n\n  .data-\\[state\\=checked\\]\\:bg-success[data-state=\"checked\"] {\n    background-color: var(--ui-success);\n  }\n\n  .data-\\[state\\=checked\\]\\:bg-warning[data-state=\"checked\"] {\n    background-color: var(--ui-warning);\n  }\n\n  .data-\\[state\\=closed\\]\\:pointer-events-none\\![data-state=\"closed\"] {\n    pointer-events: none !important;\n  }\n\n  .data-\\[state\\=closed\\]\\:animate-\\[accordion-up_200ms_var\\(--ease-out\\)\\][data-state=\"closed\"] {\n    animation: accordion-up .2s var(--ease-out);\n  }\n\n  .data-\\[state\\=closed\\]\\:animate-\\[collapsible-up_200ms_var\\(--ease-out\\)\\][data-state=\"closed\"] {\n    animation: collapsible-up .2s var(--ease-out);\n  }\n\n  .data-\\[state\\=closed\\]\\:animate-\\[fade-out_200ms_var\\(--ease-out\\)\\][data-state=\"closed\"] {\n    animation: fade-out .2s var(--ease-out);\n  }\n\n  .data-\\[state\\=closed\\]\\:animate-\\[scale-out_100ms_var\\(--ease-out\\)\\][data-state=\"closed\"] {\n    animation: scale-out .1s var(--ease-out);\n  }\n\n  .data-\\[state\\=closed\\]\\:animate-\\[scale-out_200ms_var\\(--ease-out\\)\\][data-state=\"closed\"] {\n    animation: scale-out .2s var(--ease-out);\n  }\n\n  .data-\\[state\\=closed\\]\\:animate-\\[slide-out-to-bottom_200ms_var\\(--ease-out\\)\\][data-state=\"closed\"] {\n    animation: slide-out-to-bottom .2s var(--ease-out);\n  }\n\n  .data-\\[state\\=closed\\]\\:animate-\\[slide-out-to-left_200ms_var\\(--ease-out\\)\\][data-state=\"closed\"] {\n    animation: slide-out-to-left .2s var(--ease-out);\n  }\n\n  .data-\\[state\\=closed\\]\\:animate-\\[slide-out-to-right_200ms_var\\(--ease-out\\)\\][data-state=\"closed\"] {\n    animation: slide-out-to-right .2s var(--ease-out);\n  }\n\n  .data-\\[state\\=closed\\]\\:animate-\\[slide-out-to-top_200ms_var\\(--ease-out\\)\\][data-state=\"closed\"] {\n    animation: slide-out-to-top .2s var(--ease-out);\n  }\n\n  .data-\\[state\\=closed\\]\\:animate-\\[toast-closed_200ms_var\\(--ease-out\\)\\][data-state=\"closed\"] {\n    animation: toast-closed .2s var(--ease-out);\n  }\n\n  .data-\\[state\\=closed\\]\\:overflow-hidden[data-state=\"closed\"] {\n    overflow: hidden;\n  }\n\n  .data-\\[state\\=closed\\]\\:data-\\[collapsed\\=true\\]\\:data-\\[front\\=false\\]\\:animate-\\[toast-collapsed-closed_200ms_var\\(--ease-out\\)\\][data-state=\"closed\"][data-collapsed=\"true\"][data-front=\"false\"] {\n    animation: toast-collapsed-closed .2s var(--ease-out);\n  }\n\n  .data-\\[state\\=collapsed\\]\\:-start-\\(--sidebar-width\\)[data-state=\"collapsed\"] {\n    inset-inline-start: calc(var(--sidebar-width) * -1);\n  }\n\n  .data-\\[state\\=collapsed\\]\\:-end-\\(--sidebar-width\\)[data-state=\"collapsed\"] {\n    inset-inline-end: calc(var(--sidebar-width) * -1);\n  }\n\n  .data-\\[state\\=collapsed\\]\\:w-\\(--sidebar-width-icon\\)[data-state=\"collapsed\"] {\n    width: var(--sidebar-width-icon);\n  }\n\n  .data-\\[state\\=collapsed\\]\\:w-0[data-state=\"collapsed\"] {\n    width: 0;\n  }\n\n  .data-\\[state\\=collapsed\\]\\:w-\\[calc\\(var\\(--sidebar-width-icon\\)\\+--spacing\\(8\\)\\)\\][data-state=\"collapsed\"] {\n    width: calc(var(--sidebar-width-icon) + calc(var(--spacing) * 8));\n  }\n\n  .data-\\[state\\=collapsed\\]\\:w-\\[calc\\(var\\(--sidebar-width-icon\\)\\+--spacing\\(8\\)\\+2px\\)\\][data-state=\"collapsed\"] {\n    width: calc(var(--sidebar-width-icon) + calc(var(--spacing) * 8) + 2px);\n  }\n\n  .data-\\[state\\=collapsed\\]\\:cursor-e-resize[data-state=\"collapsed\"] {\n    cursor: e-resize;\n  }\n\n  .data-\\[state\\=collapsed\\]\\:cursor-w-resize[data-state=\"collapsed\"] {\n    cursor: w-resize;\n  }\n\n  .data-\\[state\\=delayed-open\\]\\:animate-\\[scale-in_100ms_var\\(--ease-out\\)\\][data-state=\"delayed-open\"] {\n    animation: scale-in .1s var(--ease-out);\n  }\n\n  .data-\\[state\\=hidden\\]\\:animate-\\[fade-out_100ms_var\\(--ease-out\\)\\][data-state=\"hidden\"] {\n    animation: fade-out .1s var(--ease-out);\n  }\n\n  .data-\\[state\\=hidden\\]\\:opacity-0[data-state=\"hidden\"] {\n    opacity: 0;\n  }\n\n  .data-\\[state\\=inactive\\]\\:text-muted[data-state=\"inactive\"] {\n    color: var(--ui-text-muted);\n  }\n\n  @media (hover: hover) {\n    .hover\\:data-\\[state\\=inactive\\]\\:not-disabled\\:text-default:hover[data-state=\"inactive\"]:not(:disabled) {\n      color: var(--ui-text);\n    }\n  }\n\n  .data-\\[state\\=open\\]\\:animate-\\[accordion-down_200ms_var\\(--ease-out\\)\\][data-state=\"open\"] {\n    animation: accordion-down .2s var(--ease-out);\n  }\n\n  .data-\\[state\\=open\\]\\:animate-\\[collapsible-down_200ms_var\\(--ease-out\\)\\][data-state=\"open\"] {\n    animation: collapsible-down .2s var(--ease-out);\n  }\n\n  .data-\\[state\\=open\\]\\:animate-\\[fade-in_200ms_var\\(--ease-out\\)\\][data-state=\"open\"] {\n    animation: fade-in .2s var(--ease-out);\n  }\n\n  .data-\\[state\\=open\\]\\:animate-\\[scale-in_100ms_var\\(--ease-out\\)\\][data-state=\"open\"] {\n    animation: scale-in .1s var(--ease-out);\n  }\n\n  .data-\\[state\\=open\\]\\:animate-\\[scale-in_200ms_var\\(--ease-out\\)\\][data-state=\"open\"] {\n    animation: scale-in .2s var(--ease-out);\n  }\n\n  .data-\\[state\\=open\\]\\:animate-\\[slide-in-from-bottom_200ms_var\\(--ease-out\\)\\][data-state=\"open\"] {\n    animation: slide-in-from-bottom .2s var(--ease-out);\n  }\n\n  .data-\\[state\\=open\\]\\:animate-\\[slide-in-from-left_200ms_var\\(--ease-out\\)\\][data-state=\"open\"] {\n    animation: slide-in-from-left .2s var(--ease-out);\n  }\n\n  .data-\\[state\\=open\\]\\:animate-\\[slide-in-from-right_200ms_var\\(--ease-out\\)\\][data-state=\"open\"] {\n    animation: slide-in-from-right .2s var(--ease-out);\n  }\n\n  .data-\\[state\\=open\\]\\:animate-\\[slide-in-from-top_200ms_var\\(--ease-out\\)\\][data-state=\"open\"] {\n    animation: slide-in-from-top .2s var(--ease-out);\n  }\n\n  .data-\\[state\\=open\\]\\:animate-\\[toast-slide-in-from-bottom_200ms_var\\(--ease-out\\)\\][data-state=\"open\"] {\n    animation: toast-slide-in-from-bottom .2s var(--ease-out);\n  }\n\n  .data-\\[state\\=open\\]\\:animate-\\[toast-slide-in-from-top_200ms_var\\(--ease-out\\)\\][data-state=\"open\"] {\n    animation: toast-slide-in-from-top .2s var(--ease-out);\n  }\n\n  .data-\\[state\\=open\\]\\:text-highlighted[data-state=\"open\"] {\n    color: var(--ui-text-highlighted);\n  }\n\n  .data-\\[state\\=open\\]\\:before\\:bg-elevated\\/50[data-state=\"open\"]:before {\n    content: var(--tw-content);\n    background-color: var(--ui-bg-elevated);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-\\[state\\=open\\]\\:before\\:bg-elevated\\/50[data-state=\"open\"]:before {\n      background-color: color-mix(in oklab, var(--ui-bg-elevated) 50%, transparent);\n    }\n  }\n\n  .data-\\[state\\=open\\]\\:before\\:bg-error\\/10[data-state=\"open\"]:before {\n    content: var(--tw-content);\n    background-color: var(--ui-error);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-\\[state\\=open\\]\\:before\\:bg-error\\/10[data-state=\"open\"]:before {\n      background-color: color-mix(in oklab, var(--ui-error) 10%, transparent);\n    }\n  }\n\n  .data-\\[state\\=open\\]\\:before\\:bg-info\\/10[data-state=\"open\"]:before {\n    content: var(--tw-content);\n    background-color: var(--ui-info);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-\\[state\\=open\\]\\:before\\:bg-info\\/10[data-state=\"open\"]:before {\n      background-color: color-mix(in oklab, var(--ui-info) 10%, transparent);\n    }\n  }\n\n  .data-\\[state\\=open\\]\\:before\\:bg-primary\\/10[data-state=\"open\"]:before {\n    content: var(--tw-content);\n    background-color: var(--ui-primary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-\\[state\\=open\\]\\:before\\:bg-primary\\/10[data-state=\"open\"]:before {\n      background-color: color-mix(in oklab, var(--ui-primary) 10%, transparent);\n    }\n  }\n\n  .data-\\[state\\=open\\]\\:before\\:bg-secondary\\/10[data-state=\"open\"]:before {\n    content: var(--tw-content);\n    background-color: var(--ui-secondary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-\\[state\\=open\\]\\:before\\:bg-secondary\\/10[data-state=\"open\"]:before {\n      background-color: color-mix(in oklab, var(--ui-secondary) 10%, transparent);\n    }\n  }\n\n  .data-\\[state\\=open\\]\\:before\\:bg-success\\/10[data-state=\"open\"]:before {\n    content: var(--tw-content);\n    background-color: var(--ui-success);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-\\[state\\=open\\]\\:before\\:bg-success\\/10[data-state=\"open\"]:before {\n      background-color: color-mix(in oklab, var(--ui-success) 10%, transparent);\n    }\n  }\n\n  .data-\\[state\\=open\\]\\:before\\:bg-warning\\/10[data-state=\"open\"]:before {\n    content: var(--tw-content);\n    background-color: var(--ui-warning);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .data-\\[state\\=open\\]\\:before\\:bg-warning\\/10[data-state=\"open\"]:before {\n      background-color: color-mix(in oklab, var(--ui-warning) 10%, transparent);\n    }\n  }\n\n  .data-\\[state\\=unchecked\\]\\:translate-x-0[data-state=\"unchecked\"] {\n    --tw-translate-x: 0px;\n    translate: var(--tw-translate-x) var(--tw-translate-y);\n  }\n\n  .data-\\[state\\=unchecked\\]\\:bg-accented[data-state=\"unchecked\"] {\n    background-color: var(--ui-bg-accented);\n  }\n\n  .data-\\[state\\=visible\\]\\:animate-\\[fade-in_100ms_var\\(--ease-out\\)\\][data-state=\"visible\"] {\n    animation: fade-in .1s var(--ease-out);\n  }\n\n  .data-\\[swipe\\=cancel\\]\\:translate-x-0[data-swipe=\"cancel\"] {\n    --tw-translate-x: 0px;\n    translate: var(--tw-translate-x) var(--tw-translate-y);\n  }\n\n  .data-\\[swipe\\=cancel\\]\\:translate-y-0[data-swipe=\"cancel\"] {\n    --tw-translate-y: 0px;\n    translate: var(--tw-translate-x) var(--tw-translate-y);\n  }\n\n  .data-\\[swipe\\=end\\]\\:translate-x-\\(--reka-toast-swipe-end-x\\)[data-swipe=\"end\"] {\n    --tw-translate-x: var(--reka-toast-swipe-end-x);\n    translate: var(--tw-translate-x) var(--tw-translate-y);\n  }\n\n  .data-\\[swipe\\=end\\]\\:translate-y-\\(--reka-toast-swipe-end-y\\)[data-swipe=\"end\"] {\n    --tw-translate-y: var(--reka-toast-swipe-end-y);\n    translate: var(--tw-translate-x) var(--tw-translate-y);\n  }\n\n  .data-\\[swipe\\=end\\]\\:animate-\\[toast-slide-down_200ms_var\\(--ease-out\\)\\][data-swipe=\"end\"] {\n    animation: toast-slide-down .2s var(--ease-out);\n  }\n\n  .data-\\[swipe\\=end\\]\\:animate-\\[toast-slide-left_200ms_var\\(--ease-out\\)\\][data-swipe=\"end\"] {\n    animation: toast-slide-left .2s var(--ease-out);\n  }\n\n  .data-\\[swipe\\=end\\]\\:animate-\\[toast-slide-right_200ms_var\\(--ease-out\\)\\][data-swipe=\"end\"] {\n    animation: toast-slide-right .2s var(--ease-out);\n  }\n\n  .data-\\[swipe\\=end\\]\\:animate-\\[toast-slide-up_200ms_var\\(--ease-out\\)\\][data-swipe=\"end\"] {\n    animation: toast-slide-up .2s var(--ease-out);\n  }\n\n  .data-\\[swipe\\=move\\]\\:translate-x-\\(--reka-toast-swipe-move-x\\)[data-swipe=\"move\"] {\n    --tw-translate-x: var(--reka-toast-swipe-move-x);\n    translate: var(--tw-translate-x) var(--tw-translate-y);\n  }\n\n  .data-\\[swipe\\=move\\]\\:translate-y-\\(--reka-toast-swipe-move-y\\)[data-swipe=\"move\"] {\n    --tw-translate-y: var(--reka-toast-swipe-move-y);\n    translate: var(--tw-translate-x) var(--tw-translate-y);\n  }\n\n  .data-\\[swipe\\=move\\]\\:transition-none[data-swipe=\"move\"] {\n    transition-property: none;\n  }\n\n  @media (prefers-reduced-motion: no-preference) {\n    .motion-safe\\:animate-\\[marquee-vertical_var\\(--duration\\)_linear_infinite\\] {\n      animation: marquee-vertical var(--duration) linear infinite;\n    }\n\n    .motion-safe\\:animate-\\[marquee_var\\(--duration\\)_linear_infinite\\] {\n      animation: marquee var(--duration) linear infinite;\n    }\n\n    .motion-safe\\:animate-\\[shimmer_var\\(--duration\\)_linear_infinite\\] {\n      animation: shimmer var(--duration) linear infinite;\n    }\n\n    .motion-safe\\:after\\:animate-\\[carousel-inverse_2s_linear_infinite\\]:after {\n      content: var(--tw-content);\n      animation: 2s linear infinite carousel-inverse;\n    }\n\n    .motion-safe\\:after\\:animate-\\[carousel_2s_linear_infinite\\]:after {\n      content: var(--tw-content);\n      animation: 2s linear infinite carousel;\n    }\n\n    .motion-safe\\:after\\:animate-\\[elastic_2s_var\\(--ease-in-out\\)_infinite\\]:after {\n      content: var(--tw-content);\n      animation: elastic 2s var(--ease-in-out) infinite;\n    }\n\n    .motion-safe\\:after\\:animate-\\[swing_2s_var\\(--ease-in-out\\)_infinite\\]:after {\n      content: var(--tw-content);\n      animation: swing 2s var(--ease-in-out) infinite;\n    }\n\n    .motion-safe\\:data-\\[state\\=indeterminate\\]\\:animate-\\[carousel-inverse-vertical_2s_linear_infinite\\][data-state=\"indeterminate\"] {\n      animation: 2s linear infinite carousel-inverse-vertical;\n    }\n\n    .motion-safe\\:data-\\[state\\=indeterminate\\]\\:animate-\\[carousel-inverse_2s_linear_infinite\\][data-state=\"indeterminate\"] {\n      animation: 2s linear infinite carousel-inverse;\n    }\n\n    .motion-safe\\:data-\\[state\\=indeterminate\\]\\:animate-\\[carousel-vertical_2s_linear_infinite\\][data-state=\"indeterminate\"] {\n      animation: 2s linear infinite carousel-vertical;\n    }\n\n    .motion-safe\\:data-\\[state\\=indeterminate\\]\\:animate-\\[carousel_2s_linear_infinite\\][data-state=\"indeterminate\"] {\n      animation: 2s linear infinite carousel;\n    }\n\n    .motion-safe\\:data-\\[state\\=indeterminate\\]\\:animate-\\[elastic-vertical_2s_var\\(--ease-in-out\\)_infinite\\][data-state=\"indeterminate\"] {\n      animation: elastic-vertical 2s var(--ease-in-out) infinite;\n    }\n\n    .motion-safe\\:data-\\[state\\=indeterminate\\]\\:animate-\\[elastic_2s_var\\(--ease-in-out\\)_infinite\\][data-state=\"indeterminate\"] {\n      animation: elastic 2s var(--ease-in-out) infinite;\n    }\n\n    .motion-safe\\:data-\\[state\\=indeterminate\\]\\:animate-\\[swing-vertical_2s_var\\(--ease-in-out\\)_infinite\\][data-state=\"indeterminate\"] {\n      animation: swing-vertical 2s var(--ease-in-out) infinite;\n    }\n\n    .motion-safe\\:data-\\[state\\=indeterminate\\]\\:animate-\\[swing_2s_var\\(--ease-in-out\\)_infinite\\][data-state=\"indeterminate\"] {\n      animation: swing 2s var(--ease-in-out) infinite;\n    }\n\n    .motion-safe\\:data-\\[state\\=open\\]\\:data-\\[pulsing\\=even\\]\\:animate-\\[toast-pulse-b_200ms_var\\(--ease-out\\)\\][data-state=\"open\"][data-pulsing=\"even\"] {\n      animation: toast-pulse-b .2s var(--ease-out);\n    }\n\n    .motion-safe\\:data-\\[state\\=open\\]\\:data-\\[pulsing\\=odd\\]\\:animate-\\[toast-pulse-a_200ms_var\\(--ease-out\\)\\][data-state=\"open\"][data-pulsing=\"odd\"] {\n      animation: toast-pulse-a .2s var(--ease-out);\n    }\n  }\n\n  @media (prefers-reduced-motion: reduce) {\n    .motion-reduce\\:bg-none {\n      background-image: none;\n    }\n\n    .motion-reduce\\:text-muted {\n      color: var(--ui-text-muted);\n    }\n\n    .motion-reduce\\:transition-none {\n      transition-property: none;\n    }\n\n    .motion-reduce\\:after\\:inset-x-0:after {\n      content: var(--tw-content);\n      inset-inline: 0;\n    }\n\n    .motion-reduce\\:after\\:animate-pulse:after {\n      content: var(--tw-content);\n      animation: var(--animate-pulse);\n    }\n\n    .motion-reduce\\:data-\\[state\\=indeterminate\\]\\:animate-pulse[data-state=\"indeterminate\"] {\n      animation: var(--animate-pulse);\n    }\n  }\n\n  @media (min-width: 40rem) {\n    .sm\\:-start-12 {\n      inset-inline-start: calc(var(--spacing) * -12);\n    }\n\n    .sm\\:-end-12 {\n      inset-inline-end: calc(var(--spacing) * -12);\n    }\n\n    .sm\\:-top-12 {\n      top: calc(var(--spacing) * -12);\n    }\n\n    .sm\\:-bottom-12 {\n      bottom: calc(var(--spacing) * -12);\n    }\n\n    .sm\\:block {\n      display: block;\n    }\n\n    .sm\\:flex {\n      display: flex;\n    }\n\n    .sm\\:grid {\n      display: grid;\n    }\n\n    .sm\\:h-\\[28rem\\] {\n      height: 28rem;\n    }\n\n    .sm\\:max-h-\\[calc\\(100dvh-4rem\\)\\] {\n      max-height: calc(100dvh - 4rem);\n    }\n\n    .sm\\:w-\\(--reka-navigation-menu-viewport-width\\) {\n      width: var(--reka-navigation-menu-viewport-width);\n    }\n\n    .sm\\:w-96 {\n      width: calc(var(--spacing) * 96);\n    }\n\n    .sm\\:max-w-3xl {\n      max-width: var(--container-3xl);\n    }\n\n    .sm\\:max-w-md {\n      max-width: var(--container-md);\n    }\n\n    .sm\\:scroll-mt-6 {\n      scroll-margin-top: calc(var(--spacing) * 6);\n    }\n\n    .sm\\:grid-cols-2 {\n      grid-template-columns: repeat(2, minmax(0, 1fr));\n    }\n\n    .sm\\:flex-row {\n      flex-direction: row;\n    }\n\n    .sm\\:gap-6 {\n      gap: calc(var(--spacing) * 6);\n    }\n\n    .sm\\:gap-16 {\n      gap: calc(var(--spacing) * 16);\n    }\n\n    :where(.sm\\:space-y-0 > :not(:last-child)) {\n      --tw-space-y-reverse: 0;\n      margin-block: 0;\n    }\n\n    :where(.sm\\:space-x-4 > :not(:last-child)) {\n      --tw-space-x-reverse: 0;\n      margin-inline-start: calc(calc(var(--spacing) * 4) * var(--tw-space-x-reverse));\n      margin-inline-end: calc(calc(var(--spacing) * 4) * calc(1 - var(--tw-space-x-reverse)));\n    }\n\n    .sm\\:gap-y-12 {\n      row-gap: calc(var(--spacing) * 12);\n    }\n\n    .sm\\:gap-y-24 {\n      row-gap: calc(var(--spacing) * 24);\n    }\n\n    .sm\\:p-0 {\n      padding: 0;\n    }\n\n    .sm\\:p-4 {\n      padding: calc(var(--spacing) * 4);\n    }\n\n    .sm\\:p-6 {\n      padding: calc(var(--spacing) * 6);\n    }\n\n    .sm\\:px-6 {\n      padding-inline: calc(var(--spacing) * 6);\n    }\n\n    .sm\\:px-8 {\n      padding-inline: calc(var(--spacing) * 8);\n    }\n\n    .sm\\:px-12 {\n      padding-inline: calc(var(--spacing) * 12);\n    }\n\n    .sm\\:py-8 {\n      padding-block: calc(var(--spacing) * 8);\n    }\n\n    .sm\\:py-24 {\n      padding-block: calc(var(--spacing) * 24);\n    }\n\n    .sm\\:py-32 {\n      padding-block: calc(var(--spacing) * 32);\n    }\n\n    .sm\\:pl-16 {\n      padding-left: calc(var(--spacing) * 16);\n    }\n\n    .sm\\:text-2xl {\n      font-size: var(--text-2xl);\n      line-height: var(--tw-leading, var(--text-2xl--line-height));\n    }\n\n    .sm\\:text-3xl {\n      font-size: var(--text-3xl);\n      line-height: var(--tw-leading, var(--text-3xl--line-height));\n    }\n\n    .sm\\:text-4xl {\n      font-size: var(--text-4xl);\n      line-height: var(--tw-leading, var(--text-4xl--line-height));\n    }\n\n    .sm\\:text-5xl {\n      font-size: var(--text-5xl);\n      line-height: var(--tw-leading, var(--text-5xl--line-height));\n    }\n\n    .sm\\:text-7xl {\n      font-size: var(--text-7xl);\n      line-height: var(--tw-leading, var(--text-7xl--line-height));\n    }\n\n    .sm\\:text-lg {\n      font-size: var(--text-lg);\n      line-height: var(--tw-leading, var(--text-lg--line-height));\n    }\n\n    .sm\\:text-xl\\/8 {\n      font-size: var(--text-xl);\n      line-height: calc(var(--spacing) * 8);\n    }\n\n    .sm\\:shadow-lg {\n      --tw-shadow: 0 10px 15px -3px var(--tw-shadow-color, #0000001a), 0 4px 6px -4px var(--tw-shadow-color, #0000001a);\n      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);\n    }\n\n    .sm\\:ring {\n      --tw-ring-shadow: var(--tw-ring-inset, ) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentcolor);\n      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);\n    }\n  }\n\n  @media (min-width: 48rem) {\n    .md\\:mt-auto {\n      margin-top: auto;\n    }\n\n    .md\\:block {\n      display: block;\n    }\n\n    .md\\:flex {\n      display: flex;\n    }\n\n    .md\\:hidden {\n      display: none;\n    }\n\n    .md\\:table {\n      display: table;\n    }\n\n    .md\\:h-full {\n      height: 100%;\n    }\n\n    .md\\:columns-2 {\n      columns: 2;\n    }\n\n    .md\\:grid-cols-3 {\n      grid-template-columns: repeat(3, minmax(0, 1fr));\n    }\n\n    .md\\:pt-6 {\n      padding-top: calc(var(--spacing) * 6);\n    }\n\n    .md\\:text-sm {\n      font-size: var(--text-sm);\n      line-height: var(--tw-leading, var(--text-sm--line-height));\n    }\n\n    .md\\:text-xs {\n      font-size: var(--text-xs);\n      line-height: var(--tw-leading, var(--text-xs--line-height));\n    }\n  }\n\n  @media (min-width: 64rem) {\n    .lg\\:sticky {\n      position: sticky;\n    }\n\n    .lg\\:top-\\(--ui-header-height\\) {\n      top: var(--ui-header-height);\n    }\n\n    .lg\\:z-\\[1\\] {\n      z-index: 1;\n    }\n\n    .lg\\:order-1 {\n      order: 1;\n    }\n\n    .lg\\:order-2 {\n      order: 2;\n    }\n\n    .lg\\:order-3 {\n      order: 3;\n    }\n\n    .lg\\:order-last {\n      order: 9999;\n    }\n\n    .lg\\:col-span-2 {\n      grid-column: span 2 / span 2;\n    }\n\n    .lg\\:col-span-6 {\n      grid-column: span 6 / span 6;\n    }\n\n    .lg\\:col-span-8 {\n      grid-column: span 8 / span 8;\n    }\n\n    .lg\\:col-span-10 {\n      grid-column: span 10 / span 10;\n    }\n\n    .lg\\:mx-auto {\n      margin-inline: auto;\n    }\n\n    .lg\\:-ms-4 {\n      margin-inline-start: calc(var(--spacing) * -4);\n    }\n\n    .lg\\:me-0 {\n      margin-inline-end: 0;\n    }\n\n    .lg\\:mt-0 {\n      margin-top: 0;\n    }\n\n    .lg\\:mt-12 {\n      margin-top: calc(var(--spacing) * 12);\n    }\n\n    .lg\\:block {\n      display: block;\n    }\n\n    .lg\\:flex {\n      display: flex;\n    }\n\n    .lg\\:grid {\n      display: grid;\n    }\n\n    .lg\\:hidden {\n      display: none;\n    }\n\n    .lg\\:inline-flex {\n      display: inline-flex;\n    }\n\n    .lg\\:max-h-\\[calc\\(100vh-var\\(--ui-header-height\\)\\)\\] {\n      max-height: calc(100vh - var(--ui-header-height));\n    }\n\n    .lg\\:w-\\(--width\\) {\n      width: var(--width);\n    }\n\n    .lg\\:w-full {\n      width: 100%;\n    }\n\n    .lg\\:max-w-xs {\n      max-width: var(--container-xs);\n    }\n\n    .lg\\:flex-1 {\n      flex: 1;\n    }\n\n    .lg\\:scale-\\[1\\.1\\] {\n      scale: 1.1;\n    }\n\n    .lg\\:columns-3 {\n      columns: 3;\n    }\n\n    .lg\\:grid-cols-2 {\n      grid-template-columns: repeat(2, minmax(0, 1fr));\n    }\n\n    .lg\\:grid-cols-3 {\n      grid-template-columns: repeat(3, minmax(0, 1fr));\n    }\n\n    .lg\\:grid-cols-10 {\n      grid-template-columns: repeat(10, minmax(0, 1fr));\n    }\n\n    .lg\\:grid-cols-\\[repeat\\(var\\(--count\\)\\,minmax\\(0\\,1fr\\)\\)\\] {\n      grid-template-columns: repeat(var(--count),minmax(0,1fr));\n    }\n\n    .lg\\:flex-row {\n      flex-direction: row;\n    }\n\n    .lg\\:items-center {\n      align-items: center;\n    }\n\n    .lg\\:justify-between {\n      justify-content: space-between;\n    }\n\n    .lg\\:justify-center {\n      justify-content: center;\n    }\n\n    .lg\\:justify-end {\n      justify-content: flex-end;\n    }\n\n    .lg\\:justify-start {\n      justify-content: flex-start;\n    }\n\n    .lg\\:gap-10 {\n      gap: calc(var(--spacing) * 10);\n    }\n\n    .lg\\:gap-x-3 {\n      column-gap: calc(var(--spacing) * 3);\n    }\n\n    .lg\\:gap-x-13 {\n      column-gap: calc(var(--spacing) * 13);\n    }\n\n    .lg\\:gap-y-16 {\n      row-gap: calc(var(--spacing) * 16);\n    }\n\n    :where(.lg\\:divide-x > :not(:last-child)) {\n      --tw-divide-x-reverse: 0;\n      border-inline-style: var(--tw-border-style);\n      border-inline-start-width: calc(1px * var(--tw-divide-x-reverse));\n      border-inline-end-width: calc(1px * calc(1 - var(--tw-divide-x-reverse)));\n    }\n\n    :where(.lg\\:divide-y-0 > :not(:last-child)) {\n      --tw-divide-y-reverse: 0;\n      border-bottom-style: var(--tw-border-style);\n      border-top-style: var(--tw-border-style);\n      border-top-width: calc(0px * var(--tw-divide-y-reverse));\n      border-bottom-width: calc(0px * calc(1 - var(--tw-divide-y-reverse)));\n    }\n\n    .lg\\:p-6 {\n      padding: calc(var(--spacing) * 6);\n    }\n\n    .lg\\:p-8 {\n      padding: calc(var(--spacing) * 8);\n    }\n\n    .lg\\:px-0 {\n      padding-inline: 0;\n    }\n\n    .lg\\:px-8 {\n      padding-inline: calc(var(--spacing) * 8);\n    }\n\n    .lg\\:px-16 {\n      padding-inline: calc(var(--spacing) * 16);\n    }\n\n    .lg\\:py-4 {\n      padding-block: calc(var(--spacing) * 4);\n    }\n\n    .lg\\:py-12 {\n      padding-block: calc(var(--spacing) * 12);\n    }\n\n    .lg\\:py-24 {\n      padding-block: calc(var(--spacing) * 24);\n    }\n\n    .lg\\:py-32 {\n      padding-block: calc(var(--spacing) * 32);\n    }\n\n    .lg\\:py-40 {\n      padding-block: calc(var(--spacing) * 40);\n    }\n\n    .lg\\:ps-4 {\n      padding-inline-start: calc(var(--spacing) * 4);\n    }\n\n    .lg\\:pe-6 {\n      padding-inline-end: calc(var(--spacing) * 6);\n    }\n\n    .lg\\:pe-6\\.5 {\n      padding-inline-end: calc(var(--spacing) * 6.5);\n    }\n\n    .lg\\:pb-0 {\n      padding-bottom: 0;\n    }\n\n    .lg\\:text-5xl {\n      font-size: var(--text-5xl);\n      line-height: var(--tw-leading, var(--text-5xl--line-height));\n    }\n\n    .lg\\:not-last\\:border-e:not(:last-child) {\n      border-inline-end-style: var(--tw-border-style);\n      border-inline-end-width: 1px;\n    }\n\n    .lg\\:not-last\\:border-default:not(:last-child) {\n      border-color: var(--ui-border);\n    }\n  }\n\n  @media (min-width: 80rem) {\n    .xl\\:col-span-2 {\n      grid-column: span 2 / span 2;\n    }\n\n    .xl\\:mt-0 {\n      margin-top: 0;\n    }\n\n    .xl\\:mb-0 {\n      margin-bottom: 0;\n    }\n\n    .xl\\:block {\n      display: block;\n    }\n\n    .xl\\:flex {\n      display: flex;\n    }\n\n    .xl\\:grid {\n      display: grid;\n    }\n\n    .xl\\:grid-cols-3 {\n      grid-template-columns: repeat(3, minmax(0, 1fr));\n    }\n\n    .xl\\:gap-8 {\n      gap: calc(var(--spacing) * 8);\n    }\n\n    .xl\\:p-10 {\n      padding: calc(var(--spacing) * 10);\n    }\n  }\n\n  @media (min-width: 96rem) {\n    .\\32 xl\\:block {\n      display: block;\n    }\n\n    .\\32 xl\\:flex {\n      display: flex;\n    }\n  }\n\n  .rtl\\:right-\\[calc\\(100\\%-var\\(--reka-navigation-menu-viewport-left\\)-var\\(--reka-navigation-menu-viewport-width\\)\\)\\]:where(:dir(rtl), [dir=\"rtl\"], [dir=\"rtl\"] *) {\n    right: calc(100% - var(--reka-navigation-menu-viewport-left) - var(--reka-navigation-menu-viewport-width));\n  }\n\n  .rtl\\:left-auto:where(:dir(rtl), [dir=\"rtl\"], [dir=\"rtl\"] *) {\n    left: auto;\n  }\n\n  .rtl\\:-translate-x-1\\/2:where(:dir(rtl), [dir=\"rtl\"], [dir=\"rtl\"] *) {\n    --tw-translate-x: calc(calc(1 / 2 * 100%) * -1);\n    translate: var(--tw-translate-x) var(--tw-translate-y);\n  }\n\n  .rtl\\:translate-x-1\\/2:where(:dir(rtl), [dir=\"rtl\"], [dir=\"rtl\"] *) {\n    --tw-translate-x: calc(1 / 2 * 100%);\n    translate: var(--tw-translate-x) var(--tw-translate-y);\n  }\n\n  .rtl\\:translate-x-\\[4px\\]:where(:dir(rtl), [dir=\"rtl\"], [dir=\"rtl\"] *) {\n    --tw-translate-x: 4px;\n    translate: var(--tw-translate-x) var(--tw-translate-y);\n  }\n\n  .rtl\\:-rotate-90:where(:dir(rtl), [dir=\"rtl\"], [dir=\"rtl\"] *) {\n    rotate: -90deg;\n  }\n\n  .rtl\\:cursor-e-resize:where(:dir(rtl), [dir=\"rtl\"], [dir=\"rtl\"] *) {\n    cursor: e-resize;\n  }\n\n  .rtl\\:cursor-w-resize:where(:dir(rtl), [dir=\"rtl\"], [dir=\"rtl\"] *) {\n    cursor: w-resize;\n  }\n\n  .rtl\\:flex-row:where(:dir(rtl), [dir=\"rtl\"], [dir=\"rtl\"] *) {\n    flex-direction: row;\n  }\n\n  .rtl\\:flex-row-reverse:where(:dir(rtl), [dir=\"rtl\"], [dir=\"rtl\"] *) {\n    flex-direction: row-reverse;\n  }\n\n  .rtl\\:before\\:bg-gradient-to-l:where(:dir(rtl), [dir=\"rtl\"], [dir=\"rtl\"] *):before {\n    content: var(--tw-content);\n    --tw-gradient-position: to left in oklab;\n    background-image: linear-gradient(var(--tw-gradient-stops));\n  }\n\n  .rtl\\:after\\:bg-gradient-to-r:where(:dir(rtl), [dir=\"rtl\"], [dir=\"rtl\"] *):after {\n    content: var(--tw-content);\n    --tw-gradient-position: to right in oklab;\n    background-image: linear-gradient(var(--tw-gradient-stops));\n  }\n\n  .data-\\[state\\=checked\\]\\:rtl\\:-translate-x-3[data-state=\"checked\"]:where(:dir(rtl), [dir=\"rtl\"], [dir=\"rtl\"] *) {\n    --tw-translate-x: calc(var(--spacing) * -3);\n    translate: var(--tw-translate-x) var(--tw-translate-y);\n  }\n\n  .data-\\[state\\=checked\\]\\:rtl\\:-translate-x-3\\.5[data-state=\"checked\"]:where(:dir(rtl), [dir=\"rtl\"], [dir=\"rtl\"] *) {\n    --tw-translate-x: calc(var(--spacing) * -3.5);\n    translate: var(--tw-translate-x) var(--tw-translate-y);\n  }\n\n  .data-\\[state\\=checked\\]\\:rtl\\:-translate-x-4[data-state=\"checked\"]:where(:dir(rtl), [dir=\"rtl\"], [dir=\"rtl\"] *) {\n    --tw-translate-x: calc(var(--spacing) * -4);\n    translate: var(--tw-translate-x) var(--tw-translate-y);\n  }\n\n  .data-\\[state\\=checked\\]\\:rtl\\:-translate-x-4\\.5[data-state=\"checked\"]:where(:dir(rtl), [dir=\"rtl\"], [dir=\"rtl\"] *) {\n    --tw-translate-x: calc(var(--spacing) * -4.5);\n    translate: var(--tw-translate-x) var(--tw-translate-y);\n  }\n\n  .data-\\[state\\=checked\\]\\:rtl\\:-translate-x-5[data-state=\"checked\"]:where(:dir(rtl), [dir=\"rtl\"], [dir=\"rtl\"] *) {\n    --tw-translate-x: calc(var(--spacing) * -5);\n    translate: var(--tw-translate-x) var(--tw-translate-y);\n  }\n\n  .data-\\[state\\=collapsed\\]\\:rtl\\:cursor-e-resize[data-state=\"collapsed\"]:where(:dir(rtl), [dir=\"rtl\"], [dir=\"rtl\"] *) {\n    cursor: e-resize;\n  }\n\n  .data-\\[state\\=collapsed\\]\\:rtl\\:cursor-w-resize[data-state=\"collapsed\"]:where(:dir(rtl), [dir=\"rtl\"], [dir=\"rtl\"] *) {\n    cursor: w-resize;\n  }\n\n  .data-\\[state\\=unchecked\\]\\:rtl\\:-translate-x-0[data-state=\"unchecked\"]:where(:dir(rtl), [dir=\"rtl\"], [dir=\"rtl\"] *) {\n    --tw-translate-x: 0px;\n    translate: var(--tw-translate-x) var(--tw-translate-y);\n  }\n\n  @media (prefers-reduced-motion: no-preference) {\n    .motion-safe\\:rtl\\:animate-\\[marquee-rtl_var\\(--duration\\)_linear_infinite\\]:where(:dir(rtl), [dir=\"rtl\"], [dir=\"rtl\"] *) {\n      animation: marquee-rtl var(--duration) linear infinite;\n    }\n\n    .motion-safe\\:rtl\\:animate-\\[shimmer-rtl_var\\(--duration\\)_linear_infinite\\]:where(:dir(rtl), [dir=\"rtl\"], [dir=\"rtl\"] *) {\n      animation: shimmer-rtl var(--duration) linear infinite;\n    }\n\n    .motion-safe\\:rtl\\:after\\:animate-\\[carousel-inverse-rtl_2s_linear_infinite\\]:where(:dir(rtl), [dir=\"rtl\"], [dir=\"rtl\"] *):after {\n      content: var(--tw-content);\n      animation: 2s linear infinite carousel-inverse-rtl;\n    }\n\n    .motion-safe\\:rtl\\:after\\:animate-\\[carousel-rtl_2s_linear_infinite\\]:where(:dir(rtl), [dir=\"rtl\"], [dir=\"rtl\"] *):after {\n      content: var(--tw-content);\n      animation: 2s linear infinite carousel-rtl;\n    }\n\n    .motion-safe\\:data-\\[state\\=indeterminate\\]\\:rtl\\:animate-\\[carousel-inverse-rtl_2s_linear_infinite\\][data-state=\"indeterminate\"]:where(:dir(rtl), [dir=\"rtl\"], [dir=\"rtl\"] *) {\n      animation: 2s linear infinite carousel-inverse-rtl;\n    }\n\n    .motion-safe\\:data-\\[state\\=indeterminate\\]\\:rtl\\:animate-\\[carousel-rtl_2s_linear_infinite\\][data-state=\"indeterminate\"]:where(:dir(rtl), [dir=\"rtl\"], [dir=\"rtl\"] *) {\n      animation: 2s linear infinite carousel-rtl;\n    }\n  }\n\n  .dark\\:block:where(.dark, .dark *) {\n    display: block;\n  }\n\n  .dark\\:hidden:where(.dark, .dark *) {\n    display: none;\n  }\n\n  .dark\\:inline-block:where(.dark, .dark *) {\n    display: inline-block;\n  }\n\n  .dark\\:disabled\\:bg-transparent:where(.dark, .dark *):disabled {\n    background-color: #0000;\n  }\n\n  @media (hover: hover) {\n    .dark\\:hover\\:disabled\\:bg-transparent:where(.dark, .dark *):hover:disabled {\n      background-color: #0000;\n    }\n  }\n\n  .dark\\:aria-disabled\\:bg-transparent:where(.dark, .dark *)[aria-disabled=\"true\"] {\n    background-color: #0000;\n  }\n\n  @media (hover: hover) {\n    .dark\\:hover\\:aria-disabled\\:bg-transparent:where(.dark, .dark *):hover[aria-disabled=\"true\"] {\n      background-color: #0000;\n    }\n  }\n\n  .\\[\\&_\\.ProseMirror-selectednode\\:not\\(img\\)\\:not\\(pre\\)\\:not\\(\\[data-node-view-wrapper\\]\\)\\]\\:bg-primary\\/20 .ProseMirror-selectednode:not(img):not(pre):not([data-node-view-wrapper]) {\n    background-color: var(--ui-primary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .\\[\\&_\\.ProseMirror-selectednode\\:not\\(img\\)\\:not\\(pre\\)\\:not\\(\\[data-node-view-wrapper\\]\\)\\]\\:bg-primary\\/20 .ProseMirror-selectednode:not(img):not(pre):not([data-node-view-wrapper]) {\n      background-color: color-mix(in oklab, var(--ui-primary) 20%, transparent);\n    }\n  }\n\n  .\\[\\&_\\.mention\\]\\:font-medium .mention {\n    --tw-font-weight: var(--font-weight-medium);\n    font-weight: var(--font-weight-medium);\n  }\n\n  .\\[\\&_\\.mention\\]\\:text-primary .mention {\n    color: var(--ui-primary);\n  }\n\n  .\\[\\&_\\.ts-chart\\]\\:rounded-md .ts-chart {\n    border-radius: calc(var(--ui-radius) * 1.5);\n  }\n\n  .\\[\\&_\\.ts-chart\\]\\:outline-0 .ts-chart {\n    outline-style: var(--tw-outline-style);\n    outline-width: 0;\n  }\n\n  .\\[\\&_\\.ts-chart\\]\\:outline-primary\\/25 .ts-chart {\n    outline-color: var(--ui-primary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .\\[\\&_\\.ts-chart\\]\\:outline-primary\\/25 .ts-chart {\n      outline-color: color-mix(in oklab, var(--ui-primary) 25%, transparent);\n    }\n  }\n\n  .\\[\\&_\\.ts-chart\\:focus-visible\\]\\:ring .ts-chart:focus-visible {\n    --tw-ring-shadow: var(--tw-ring-inset, ) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentcolor);\n    box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);\n  }\n\n  .\\[\\&_\\.ts-chart\\:focus-visible\\]\\:ring-primary .ts-chart:focus-visible {\n    --tw-ring-color: var(--ui-primary);\n  }\n\n  .\\[\\&_\\.ts-chart\\:focus-visible\\]\\:outline-3 .ts-chart:focus-visible {\n    outline-style: var(--tw-outline-style);\n    outline-width: 3px;\n  }\n\n  .\\[\\&_\\:is\\(h1\\,h2\\,h3\\,h4\\,h5\\,h6\\)\\]\\:font-bold :is(h1, h2, h3, h4, h5, h6) {\n    --tw-font-weight: var(--font-weight-bold);\n    font-weight: var(--font-weight-bold);\n  }\n\n  .\\[\\&_\\:is\\(h1\\,h2\\,h3\\,h4\\,h5\\,h6\\)\\]\\:text-highlighted :is(h1, h2, h3, h4, h5, h6) {\n    color: var(--ui-text-highlighted);\n  }\n\n  .\\[\\&_\\:is\\(h1\\,h2\\,h3\\,h4\\,h5\\,h6\\)\\>code\\]\\:border-dashed :is(h1, h2, h3, h4, h5, h6) > code {\n    --tw-border-style: dashed;\n    border-style: dashed;\n  }\n\n  .\\[\\&_\\:is\\(h1\\,h2\\,h3\\,h4\\,h5\\,h6\\)\\>code\\]\\:font-bold :is(h1, h2, h3, h4, h5, h6) > code {\n    --tw-font-weight: var(--font-weight-bold);\n    font-weight: var(--font-weight-bold);\n  }\n\n  .\\[\\&_\\:is\\(p\\,h1\\,h2\\,h3\\,h4\\,h5\\,h6\\)\\.is-editor-empty\\:first-child\\]\\:before\\:pointer-events-none :is(p, h1, h2, h3, h4, h5, h6).is-editor-empty:first-child:before {\n    content: var(--tw-content);\n    pointer-events: none;\n  }\n\n  .\\[\\&_\\:is\\(p\\,h1\\,h2\\,h3\\,h4\\,h5\\,h6\\)\\.is-editor-empty\\:first-child\\]\\:before\\:float-start :is(p, h1, h2, h3, h4, h5, h6).is-editor-empty:first-child:before {\n    content: var(--tw-content);\n    float: inline-start;\n  }\n\n  .\\[\\&_\\:is\\(p\\,h1\\,h2\\,h3\\,h4\\,h5\\,h6\\)\\.is-editor-empty\\:first-child\\]\\:before\\:h-0 :is(p, h1, h2, h3, h4, h5, h6).is-editor-empty:first-child:before {\n    content: var(--tw-content);\n    height: 0;\n  }\n\n  .\\[\\&_\\:is\\(p\\,h1\\,h2\\,h3\\,h4\\,h5\\,h6\\)\\.is-editor-empty\\:first-child\\]\\:before\\:text-dimmed :is(p, h1, h2, h3, h4, h5, h6).is-editor-empty:first-child:before {\n    content: var(--tw-content);\n    color: var(--ui-text-dimmed);\n  }\n\n  .\\[\\&_\\:is\\(p\\,h1\\,h2\\,h3\\,h4\\,h5\\,h6\\)\\.is-editor-empty\\:first-child\\]\\:before\\:content-\\[attr\\(data-placeholder\\)\\] :is(p, h1, h2, h3, h4, h5, h6).is-editor-empty:first-child:before {\n    --tw-content: attr(data-placeholder);\n    content: var(--tw-content);\n  }\n\n  .\\[\\&_\\:is\\(p\\,h1\\,h2\\,h3\\,h4\\,h5\\,h6\\)\\.is-empty\\]\\:before\\:pointer-events-none :is(p, h1, h2, h3, h4, h5, h6).is-empty:before {\n    content: var(--tw-content);\n    pointer-events: none;\n  }\n\n  .\\[\\&_\\:is\\(p\\,h1\\,h2\\,h3\\,h4\\,h5\\,h6\\)\\.is-empty\\]\\:before\\:float-start :is(p, h1, h2, h3, h4, h5, h6).is-empty:before {\n    content: var(--tw-content);\n    float: inline-start;\n  }\n\n  .\\[\\&_\\:is\\(p\\,h1\\,h2\\,h3\\,h4\\,h5\\,h6\\)\\.is-empty\\]\\:before\\:h-0 :is(p, h1, h2, h3, h4, h5, h6).is-empty:before {\n    content: var(--tw-content);\n    height: 0;\n  }\n\n  .\\[\\&_\\:is\\(p\\,h1\\,h2\\,h3\\,h4\\,h5\\,h6\\)\\.is-empty\\]\\:before\\:text-dimmed :is(p, h1, h2, h3, h4, h5, h6).is-empty:before {\n    content: var(--tw-content);\n    color: var(--ui-text-dimmed);\n  }\n\n  .\\[\\&_\\:is\\(p\\,h1\\,h2\\,h3\\,h4\\,h5\\,h6\\)\\.is-empty\\]\\:before\\:content-\\[attr\\(data-placeholder\\)\\] :is(p, h1, h2, h3, h4, h5, h6).is-empty:before {\n    --tw-content: attr(data-placeholder);\n    content: var(--tw-content);\n  }\n\n  .\\[\\&_\\:is\\(ul\\,ol\\)\\]\\:ps-6 :is(ul, ol) {\n    padding-inline-start: calc(var(--spacing) * 6);\n  }\n\n  .\\[\\&_\\[data-type\\=horizontalRule\\]\\]\\:my-8 [data-type=\"horizontalRule\"] {\n    margin-block: calc(var(--spacing) * 8);\n  }\n\n  .\\[\\&_\\[data-type\\=horizontalRule\\]\\]\\:py-2 [data-type=\"horizontalRule\"] {\n    padding-block: calc(var(--spacing) * 2);\n  }\n\n  .\\[\\&_a\\]\\:border-b a {\n    border-bottom-style: var(--tw-border-style);\n    border-bottom-width: 1px;\n  }\n\n  .\\[\\&_a\\]\\:border-transparent a {\n    border-color: #0000;\n  }\n\n  .\\[\\&_a\\]\\:font-medium a {\n    --tw-font-weight: var(--font-weight-medium);\n    font-weight: var(--font-weight-medium);\n  }\n\n  .\\[\\&_a\\]\\:text-primary a {\n    color: var(--ui-primary);\n  }\n\n  .\\[\\&_a\\]\\:outline-primary\\/25 a {\n    outline-color: var(--ui-primary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .\\[\\&_a\\]\\:outline-primary\\/25 a {\n      outline-color: color-mix(in oklab, var(--ui-primary) 25%, transparent);\n    }\n  }\n\n  .\\[\\&_a\\]\\:transition-colors a {\n    transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to;\n    transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));\n    transition-duration: var(--tw-duration, var(--default-transition-duration));\n  }\n\n  @media (hover: hover) {\n    .\\[\\&_a\\]\\:hover\\:border-primary a:hover {\n      border-color: var(--ui-primary);\n    }\n  }\n\n  .\\[\\&_a\\]\\:focus-visible\\:rounded-xs a:focus-visible {\n    border-radius: calc(var(--ui-radius) * .5);\n  }\n\n  .\\[\\&_a\\]\\:focus-visible\\:border-transparent a:focus-visible {\n    border-color: #0000;\n  }\n\n  .\\[\\&_a\\]\\:focus-visible\\:outline-3 a:focus-visible {\n    outline-style: var(--tw-outline-style);\n    outline-width: 3px;\n  }\n\n  .\\[\\&_a\\:focus-visible\\>code\\]\\:border-primary a:focus-visible > code {\n    border-color: var(--ui-primary);\n  }\n\n  .\\[\\&_a\\:focus-visible\\>code\\]\\:text-primary a:focus-visible > code {\n    color: var(--ui-primary);\n  }\n\n  .\\[\\&_a\\:focus-visible\\>code\\]\\:outline-3 a:focus-visible > code {\n    outline-style: var(--tw-outline-style);\n    outline-width: 3px;\n  }\n\n  .\\[\\&_a\\:has\\(\\>code\\)\\]\\:border-b-0 a:has( > code) {\n    border-bottom-style: var(--tw-border-style);\n    border-bottom-width: 0;\n  }\n\n  .\\[\\&_a\\:has\\(\\>code\\)\\]\\:focus-visible\\:outline-0 a:has( > code):focus-visible {\n    outline-style: var(--tw-outline-style);\n    outline-width: 0;\n  }\n\n  .\\[\\&_a\\:hover\\>code\\]\\:border-primary a:hover > code {\n    border-color: var(--ui-primary);\n  }\n\n  .\\[\\&_a\\:hover\\>code\\]\\:text-primary a:hover > code {\n    color: var(--ui-primary);\n  }\n\n  .\\[\\&_a\\>code\\]\\:border-dashed a > code {\n    --tw-border-style: dashed;\n    border-style: dashed;\n  }\n\n  .\\[\\&_a\\>code\\]\\:outline-primary\\/25 a > code {\n    outline-color: var(--ui-primary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .\\[\\&_a\\>code\\]\\:outline-primary\\/25 a > code {\n      outline-color: color-mix(in oklab, var(--ui-primary) 25%, transparent);\n    }\n  }\n\n  .\\[\\&_a\\>code\\]\\:transition-colors a > code {\n    transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to;\n    transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));\n    transition-duration: var(--tw-duration, var(--default-transition-duration));\n  }\n\n  .\\[\\&_blockquote\\]\\:border-s-4 blockquote {\n    border-inline-start-style: var(--tw-border-style);\n    border-inline-start-width: 4px;\n  }\n\n  .\\[\\&_blockquote\\]\\:border-accented blockquote {\n    border-color: var(--ui-border-accented);\n  }\n\n  .\\[\\&_blockquote\\]\\:ps-4 blockquote {\n    padding-inline-start: calc(var(--spacing) * 4);\n  }\n\n  .\\[\\&_blockquote\\]\\:italic blockquote {\n    font-style: italic;\n  }\n\n  .\\[\\&_code\\]\\:inline-block code {\n    display: inline-block;\n  }\n\n  .\\[\\&_code\\]\\:rounded-md code {\n    border-radius: calc(var(--ui-radius) * 1.5);\n  }\n\n  .\\[\\&_code\\]\\:border code {\n    border-style: var(--tw-border-style);\n    border-width: 1px;\n  }\n\n  .\\[\\&_code\\]\\:border-muted code {\n    border-color: var(--ui-border-muted);\n  }\n\n  .\\[\\&_code\\]\\:bg-muted code {\n    background-color: var(--ui-bg-muted);\n  }\n\n  .\\[\\&_code\\]\\:px-1\\.5 code {\n    padding-inline: calc(var(--spacing) * 1.5);\n  }\n\n  .\\[\\&_code\\]\\:py-0\\.5 code {\n    padding-block: calc(var(--spacing) * .5);\n  }\n\n  .\\[\\&_code\\]\\:font-mono code {\n    font-family: var(--font-mono);\n  }\n\n  .\\[\\&_code\\]\\:text-sm code {\n    font-size: var(--text-sm);\n    line-height: var(--tw-leading, var(--text-sm--line-height));\n  }\n\n  .\\[\\&_code\\]\\:font-medium code {\n    --tw-font-weight: var(--font-weight-medium);\n    font-weight: var(--font-weight-medium);\n  }\n\n  .\\[\\&_code\\]\\:text-highlighted code {\n    color: var(--ui-text-highlighted);\n  }\n\n  .\\[\\&_h1\\]\\:text-3xl h1 {\n    font-size: var(--text-3xl);\n    line-height: var(--tw-leading, var(--text-3xl--line-height));\n  }\n\n  .\\[\\&_h2\\]\\:text-2xl h2 {\n    font-size: var(--text-2xl);\n    line-height: var(--tw-leading, var(--text-2xl--line-height));\n  }\n\n  .\\[\\&_h2\\>code\\]\\:text-xl\\/6 h2 > code {\n    font-size: var(--text-xl);\n    line-height: calc(var(--spacing) * 6);\n  }\n\n  .\\[\\&_h3\\]\\:text-xl h3 {\n    font-size: var(--text-xl);\n    line-height: var(--tw-leading, var(--text-xl--line-height));\n  }\n\n  .\\[\\&_h3\\>code\\]\\:text-lg\\/5 h3 > code {\n    font-size: var(--text-lg);\n    line-height: calc(var(--spacing) * 5);\n  }\n\n  .\\[\\&_h4\\]\\:text-lg h4 {\n    font-size: var(--text-lg);\n    line-height: var(--tw-leading, var(--text-lg--line-height));\n  }\n\n  .\\[\\&_h5\\]\\:text-base h5, .\\[\\&_h6\\]\\:text-base h6 {\n    font-size: var(--text-base);\n    line-height: var(--tw-leading, var(--text-base--line-height));\n  }\n\n  .\\[\\&_hr\\]\\:border-t hr {\n    border-top-style: var(--tw-border-style);\n    border-top-width: 1px;\n  }\n\n  .\\[\\&_hr\\]\\:border-default hr {\n    border-color: var(--ui-border);\n  }\n\n  .\\[\\&_img\\]\\:block img {\n    display: block;\n  }\n\n  .\\[\\&_img\\]\\:max-w-full img {\n    max-width: 100%;\n  }\n\n  .\\[\\&_img\\]\\:rounded-md img {\n    border-radius: calc(var(--ui-radius) * 1.5);\n  }\n\n  .\\[\\&_img\\.ProseMirror-selectednode\\]\\:outline-2 img.ProseMirror-selectednode {\n    outline-style: var(--tw-outline-style);\n    outline-width: 2px;\n  }\n\n  .\\[\\&_img\\.ProseMirror-selectednode\\]\\:outline-primary img.ProseMirror-selectednode {\n    outline-color: var(--ui-primary);\n  }\n\n  .\\[\\&_li\\]\\:my-1\\.5 li {\n    margin-block: calc(var(--spacing) * 1.5);\n  }\n\n  .\\[\\&_li\\]\\:ps-1\\.5 li {\n    padding-inline-start: calc(var(--spacing) * 1.5);\n  }\n\n  .\\[\\&_ol\\]\\:list-decimal ol {\n    list-style-type: decimal;\n  }\n\n  .\\[\\&_ol\\]\\:marker\\:text-muted ol ::marker {\n    color: var(--ui-text-muted);\n  }\n\n  .\\[\\&_ol\\]\\:marker\\:text-muted ol::marker {\n    color: var(--ui-text-muted);\n  }\n\n  .\\[\\&_ol\\]\\:marker\\:text-muted ol ::-webkit-details-marker {\n    color: var(--ui-text-muted);\n  }\n\n  .\\[\\&_ol\\]\\:marker\\:text-muted ol::-webkit-details-marker {\n    color: var(--ui-text-muted);\n  }\n\n  .\\[\\&_p\\]\\:leading-7 p {\n    --tw-leading: calc(var(--spacing) * 7);\n    line-height: calc(var(--spacing) * 7);\n  }\n\n  .\\[\\&_pre\\]\\:overflow-x-auto pre {\n    overflow-x: auto;\n  }\n\n  .\\[\\&_pre\\]\\:rounded-md pre {\n    border-radius: calc(var(--ui-radius) * 1.5);\n  }\n\n  .\\[\\&_pre\\]\\:border pre {\n    border-style: var(--tw-border-style);\n    border-width: 1px;\n  }\n\n  .\\[\\&_pre\\]\\:border-muted pre {\n    border-color: var(--ui-border-muted);\n  }\n\n  .\\[\\&_pre\\]\\:bg-muted pre {\n    background-color: var(--ui-bg-muted);\n  }\n\n  .\\[\\&_pre\\]\\:px-4 pre {\n    padding-inline: calc(var(--spacing) * 4);\n  }\n\n  .\\[\\&_pre\\]\\:py-3 pre {\n    padding-block: calc(var(--spacing) * 3);\n  }\n\n  .\\[\\&_pre\\]\\:text-sm\\/6 pre {\n    font-size: var(--text-sm);\n    line-height: calc(var(--spacing) * 6);\n  }\n\n  .\\[\\&_pre\\]\\:wrap-break-word pre {\n    overflow-wrap: break-word;\n  }\n\n  .\\[\\&_pre\\]\\:whitespace-pre-wrap pre {\n    white-space: pre-wrap;\n  }\n\n  .\\[\\&_pre_code\\]\\:inline pre code {\n    display: inline;\n  }\n\n  .\\[\\&_pre_code\\]\\:rounded-none pre code {\n    border-radius: 0;\n  }\n\n  .\\[\\&_pre_code\\]\\:border-0 pre code {\n    border-style: var(--tw-border-style);\n    border-width: 0;\n  }\n\n  .\\[\\&_pre_code\\]\\:bg-transparent pre code {\n    background-color: #0000;\n  }\n\n  .\\[\\&_pre_code\\]\\:p-0 pre code {\n    padding: 0;\n  }\n\n  .\\[\\&_pre_code\\]\\:text-inherit pre code {\n    color: inherit;\n  }\n\n  .\\[\\&_ul\\]\\:list-disc ul {\n    list-style-type: disc;\n  }\n\n  .\\[\\&_ul\\]\\:marker\\:text-\\(--ui-border-accented\\) ul ::marker {\n    color: var(--ui-border-accented);\n  }\n\n  .\\[\\&_ul\\]\\:marker\\:text-\\(--ui-border-accented\\) ul::marker {\n    color: var(--ui-border-accented);\n  }\n\n  .\\[\\&_ul\\]\\:marker\\:text-\\(--ui-border-accented\\) ul ::-webkit-details-marker {\n    color: var(--ui-border-accented);\n  }\n\n  .\\[\\&_ul\\]\\:marker\\:text-\\(--ui-border-accented\\) ul::-webkit-details-marker {\n    color: var(--ui-border-accented);\n  }\n\n  .\\[\\&\\:has\\(\\[role\\=checkbox\\]\\)\\]\\:pe-0:has([role=\"checkbox\"]) {\n    padding-inline-end: 0;\n  }\n\n  .\\[\\&\\>\\*\\:first-child\\]\\:col-start-2 > :first-child {\n    grid-column-start: 2;\n  }\n\n  @media (prefers-reduced-motion: no-preference) {\n    .motion-safe\\:\\[\\&\\>\\*\\:nth-child\\(1\\)\\]\\:animate-\\[bounce_1s_infinite\\] > :first-child {\n      animation: 1s infinite bounce;\n    }\n\n    .motion-safe\\:\\[\\&\\>\\*\\:nth-child\\(2\\)\\]\\:animate-\\[bounce_1s_0\\.15s_infinite\\] > :nth-child(2) {\n      animation: 1s .15s infinite bounce;\n    }\n\n    .motion-safe\\:\\[\\&\\>\\*\\:nth-child\\(3\\)\\]\\:animate-\\[bounce_1s_0\\.3s_infinite\\] > :nth-child(3) {\n      animation: 1s .3s infinite bounce;\n    }\n  }\n\n  .\\[\\&\\>\\[data-slot\\=icon\\]\\]\\:animate-spin > [data-slot=\"icon\"] {\n    animation: var(--animate-spin);\n  }\n\n  .\\[\\&\\>\\[data-slot\\=separator\\]\\]\\:z-2 > [data-slot=\"separator\"] {\n    z-index: 2;\n  }\n\n  .\\[\\&\\>article\\]\\:last-of-type\\:min-h-\\(--last-message-height\\) > article:last-of-type {\n    min-height: var(--last-message-height);\n  }\n\n  .\\[\\&\\>button\\]\\:py-0 > button {\n    padding-block: 0;\n  }\n\n  .\\[\\&\\>div\\]\\:min-w-0 > div {\n    min-width: 0;\n  }\n\n  .\\[\\&\\>input\\]\\:h-10 > input {\n    height: calc(var(--spacing) * 10);\n  }\n\n  .\\[\\&\\>input\\]\\:h-11 > input {\n    height: calc(var(--spacing) * 11);\n  }\n\n  .\\[\\&\\>input\\]\\:h-12 > input {\n    height: calc(var(--spacing) * 12);\n  }\n\n  .\\[\\&\\>input\\]\\:h-13 > input {\n    height: calc(var(--spacing) * 13);\n  }\n\n  .\\[\\&\\>input\\]\\:h-14 > input {\n    height: calc(var(--spacing) * 14);\n  }\n\n  .\\[\\&\\>mark\\]\\:bg-primary\\/15 > mark {\n    background-color: var(--ui-primary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .\\[\\&\\>mark\\]\\:bg-primary\\/15 > mark {\n      background-color: color-mix(in oklab, var(--ui-primary) 15%, transparent);\n    }\n  }\n\n  .\\[\\&\\>mark\\]\\:text-primary > mark {\n    color: var(--ui-primary);\n  }\n\n  .\\[\\&\\>tr\\]\\:data-\\[selectable\\=true\\]\\:-outline-offset-3 > tr[data-selectable=\"true\"] {\n    outline-offset: calc(3px * -1);\n  }\n\n  .\\[\\&\\>tr\\]\\:data-\\[selectable\\=true\\]\\:outline-primary\\/25 > tr[data-selectable=\"true\"] {\n    outline-color: var(--ui-primary);\n  }\n\n  @supports (color: color-mix(in lab, red, red)) {\n    .\\[\\&\\>tr\\]\\:data-\\[selectable\\=true\\]\\:outline-primary\\/25 > tr[data-selectable=\"true\"] {\n      outline-color: color-mix(in oklab, var(--ui-primary) 25%, transparent);\n    }\n  }\n\n  @media (hover: hover) {\n    .\\[\\&\\>tr\\]\\:data-\\[selectable\\=true\\]\\:hover\\:bg-elevated\\/50 > tr[data-selectable=\"true\"]:hover {\n      background-color: var(--ui-bg-elevated);\n    }\n\n    @supports (color: color-mix(in lab, red, red)) {\n      .\\[\\&\\>tr\\]\\:data-\\[selectable\\=true\\]\\:hover\\:bg-elevated\\/50 > tr[data-selectable=\"true\"]:hover {\n        background-color: color-mix(in oklab, var(--ui-bg-elevated) 50%, transparent);\n      }\n    }\n  }\n\n  .\\[\\&\\>tr\\]\\:data-\\[selectable\\=true\\]\\:focus-visible\\:outline-3 > tr[data-selectable=\"true\"]:focus-visible {\n    outline-style: var(--tw-outline-style);\n    outline-width: 3px;\n  }\n\n  @media (hover: hover) {\n    .\\[\\@media\\(hover\\:hover\\)\\]\\:opacity-0 {\n      opacity: 0;\n    }\n  }\n}\n\n@keyframes accordion-up {\n  0% {\n    height: var(--reka-accordion-content-height);\n    overflow: hidden;\n  }\n\n  to {\n    height: 0;\n    overflow: hidden;\n  }\n}\n\n@keyframes accordion-down {\n  0% {\n    height: 0;\n    overflow: hidden;\n  }\n\n  to {\n    height: var(--reka-accordion-content-height);\n    overflow: hidden;\n  }\n}\n\n@keyframes collapsible-up {\n  0% {\n    height: var(--reka-collapsible-content-height);\n    overflow: hidden;\n  }\n\n  to {\n    height: 0;\n    overflow: hidden;\n  }\n}\n\n@keyframes collapsible-down {\n  0% {\n    height: 0;\n    overflow: hidden;\n  }\n\n  to {\n    height: var(--reka-collapsible-content-height);\n    overflow: hidden;\n  }\n}\n\n@keyframes toast-slide-in-from-top {\n  0% {\n    transform: translateY(-100%);\n  }\n\n  to {\n    transform: var(--transform);\n  }\n}\n\n@keyframes toast-slide-in-from-bottom {\n  0% {\n    transform: translateY(100%);\n  }\n\n  to {\n    transform: var(--transform);\n  }\n}\n\n@keyframes toast-slide-up {\n  0% {\n    transform: translateX(0) translateY(var(--translate));\n  }\n\n  to {\n    transform: translateX(0) translateY(calc(var(--translate) - 100%));\n  }\n}\n\n@keyframes toast-slide-down {\n  0% {\n    transform: translateX(0) translateY(var(--translate));\n  }\n\n  to {\n    transform: translateX(0) translateY(calc(var(--translate) + 100%));\n  }\n}\n\n@keyframes toast-pulse-a {\n  0%, to {\n    scale: 1;\n  }\n\n  50% {\n    scale: 1.04;\n  }\n}\n\n@keyframes toast-pulse-b {\n  0%, to {\n    scale: 1;\n  }\n\n  50% {\n    scale: 1.04;\n  }\n}\n\n@keyframes toast-collapsed-closed {\n  0% {\n    transform: var(--transform);\n  }\n\n  to {\n    transform: translateY(calc((var(--before) - var(--height))*var(--gap))) scale(var(--scale));\n  }\n}\n\n@keyframes toast-closed {\n  0% {\n    transform: var(--transform);\n  }\n\n  to {\n    transform: translateY(calc((var(--offset) - var(--height))*var(--translate-factor)));\n  }\n}\n\n@keyframes toast-slide-left {\n  0% {\n    transform: translateX(0) translateY(var(--translate));\n  }\n\n  to {\n    transform: translateX(-100%) translateY(var(--translate));\n  }\n}\n\n@keyframes toast-slide-right {\n  0% {\n    transform: translateX(0) translateY(var(--translate));\n  }\n\n  to {\n    transform: translateX(100%) translateY(var(--translate));\n  }\n}\n\n@keyframes fade-in {\n  0% {\n    opacity: 0;\n  }\n\n  to {\n    opacity: 1;\n  }\n}\n\n@keyframes fade-out {\n  0% {\n    opacity: 1;\n  }\n\n  to {\n    opacity: 0;\n  }\n}\n\n@keyframes scale-in {\n  0% {\n    opacity: 0;\n    transform: scale(.95);\n  }\n\n  to {\n    opacity: 1;\n    transform: scale(1);\n  }\n}\n\n@keyframes scale-out {\n  0% {\n    opacity: 1;\n    transform: scale(1);\n  }\n\n  to {\n    opacity: 0;\n    transform: scale(.95);\n  }\n}\n\n@keyframes slide-in-from-top {\n  0% {\n    transform: translateY(-100%);\n  }\n\n  to {\n    transform: translateY(0);\n  }\n}\n\n@keyframes slide-out-to-top {\n  0% {\n    transform: translateY(0);\n  }\n\n  to {\n    transform: translateY(-100%);\n  }\n}\n\n@keyframes slide-in-from-right {\n  0% {\n    transform: translateX(100%);\n  }\n\n  to {\n    transform: translateX(0);\n  }\n}\n\n@keyframes slide-out-to-right {\n  0% {\n    transform: translateX(0);\n  }\n\n  to {\n    transform: translateX(100%);\n  }\n}\n\n@keyframes slide-in-from-bottom {\n  0% {\n    transform: translateY(100%);\n  }\n\n  to {\n    transform: translateY(0);\n  }\n}\n\n@keyframes slide-out-to-bottom {\n  0% {\n    transform: translateY(0);\n  }\n\n  to {\n    transform: translateY(100%);\n  }\n}\n\n@keyframes slide-in-from-left {\n  0% {\n    transform: translateX(-100%);\n  }\n\n  to {\n    transform: translateX(0);\n  }\n}\n\n@keyframes slide-out-to-left {\n  0% {\n    transform: translateX(0);\n  }\n\n  to {\n    transform: translateX(-100%);\n  }\n}\n\n@keyframes slide-in-from-top-and-fade {\n  0% {\n    opacity: 0;\n    transform: translateY(-4px);\n  }\n\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n\n@keyframes slide-out-to-top-and-fade {\n  0% {\n    opacity: 1;\n    transform: translateY(0);\n  }\n\n  to {\n    opacity: 0;\n    transform: translateY(-4px);\n  }\n}\n\n@keyframes slide-in-from-right-and-fade {\n  0% {\n    opacity: 0;\n    transform: translateX(4px);\n  }\n\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n\n@keyframes slide-out-to-right-and-fade {\n  0% {\n    opacity: 1;\n    transform: translateX(0);\n  }\n\n  to {\n    opacity: 0;\n    transform: translateX(4px);\n  }\n}\n\n@keyframes slide-in-from-bottom-and-fade {\n  0% {\n    opacity: 0;\n    transform: translateY(4px);\n  }\n\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n\n@keyframes slide-out-to-bottom-and-fade {\n  0% {\n    opacity: 1;\n    transform: translateY(0);\n  }\n\n  to {\n    opacity: 0;\n    transform: translateY(4px);\n  }\n}\n\n@keyframes slide-in-from-left-and-fade {\n  0% {\n    opacity: 0;\n    transform: translateX(-4px);\n  }\n\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n\n@keyframes slide-out-to-left-and-fade {\n  0% {\n    opacity: 1;\n    transform: translateX(0);\n  }\n\n  to {\n    opacity: 0;\n    transform: translateX(-4px);\n  }\n}\n\n@keyframes enter-from-right {\n  0% {\n    opacity: 0;\n    transform: translateX(200px);\n  }\n\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n\n@keyframes enter-from-left {\n  0% {\n    opacity: 0;\n    transform: translateX(-200px);\n  }\n\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n\n@keyframes exit-to-right {\n  0% {\n    opacity: 1;\n    transform: translateX(0);\n  }\n\n  to {\n    opacity: 0;\n    transform: translateX(200px);\n  }\n}\n\n@keyframes exit-to-left {\n  0% {\n    opacity: 1;\n    transform: translateX(0);\n  }\n\n  to {\n    opacity: 0;\n    transform: translateX(-200px);\n  }\n}\n\n@keyframes carousel {\n  0%, to {\n    width: 50%;\n  }\n\n  0% {\n    transform: translateX(-100%);\n  }\n\n  to {\n    transform: translateX(200%);\n  }\n}\n\n@keyframes carousel-rtl {\n  0%, to {\n    width: 50%;\n  }\n\n  0% {\n    transform: translateX(100%);\n  }\n\n  to {\n    transform: translateX(-200%);\n  }\n}\n\n@keyframes carousel-vertical {\n  0%, to {\n    height: 50%;\n  }\n\n  0% {\n    transform: translateY(-100%);\n  }\n\n  to {\n    transform: translateY(200%);\n  }\n}\n\n@keyframes carousel-inverse {\n  0%, to {\n    width: 50%;\n  }\n\n  0% {\n    transform: translateX(200%);\n  }\n\n  to {\n    transform: translateX(-100%);\n  }\n}\n\n@keyframes carousel-inverse-rtl {\n  0%, to {\n    width: 50%;\n  }\n\n  0% {\n    transform: translateX(-200%);\n  }\n\n  to {\n    transform: translateX(100%);\n  }\n}\n\n@keyframes carousel-inverse-vertical {\n  0%, to {\n    height: 50%;\n  }\n\n  0% {\n    transform: translateY(200%);\n  }\n\n  to {\n    transform: translateY(-100%);\n  }\n}\n\n@keyframes swing {\n  0%, to {\n    width: 50%;\n  }\n\n  0%, to {\n    transform: translateX(-25%);\n  }\n\n  50% {\n    transform: translateX(125%);\n  }\n}\n\n@keyframes swing-vertical {\n  0%, to {\n    height: 50%;\n  }\n\n  0%, to {\n    transform: translateY(-25%);\n  }\n\n  50% {\n    transform: translateY(125%);\n  }\n}\n\n@keyframes elastic {\n  0%, to {\n    width: 50%;\n    left: 25%;\n  }\n\n  50% {\n    width: 100%;\n    left: 0;\n  }\n}\n\n@keyframes elastic-vertical {\n  0%, to {\n    height: 50%;\n    top: 25%;\n  }\n\n  50% {\n    height: 100%;\n    top: 0;\n  }\n}\n\n@keyframes marquee {\n  0% {\n    transform: translateZ(0);\n  }\n\n  to {\n    transform: translate3d(calc(-100% - var(--gap)),0,0);\n  }\n}\n\n@keyframes marquee-rtl {\n  0% {\n    transform: translateZ(0);\n  }\n\n  to {\n    transform: translate3d(calc(100% + var(--gap)),0,0);\n  }\n}\n\n@keyframes marquee-vertical {\n  0% {\n    transform: translateZ(0);\n  }\n\n  to {\n    transform: translate3d(0,calc(-100% - var(--gap)),0);\n  }\n}\n\n@keyframes shimmer {\n  0% {\n    background-position: 100%;\n  }\n\n  to {\n    background-position: 0;\n  }\n}\n\n@keyframes shimmer-rtl {\n  0% {\n    background-position: 0;\n  }\n\n  to {\n    background-position: 100%;\n  }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  @keyframes scale-in {\n    0% {\n      opacity: 0;\n    }\n\n    to {\n      opacity: 1;\n    }\n  }\n\n  @keyframes scale-out {\n    0% {\n      opacity: 1;\n    }\n\n    to {\n      opacity: 0;\n    }\n  }\n\n  @keyframes slide-in-from-top {\n    0% {\n      opacity: 0;\n    }\n\n    to {\n      opacity: 1;\n    }\n  }\n\n  @keyframes slide-out-to-top {\n    0% {\n      opacity: 1;\n    }\n\n    to {\n      opacity: 0;\n    }\n  }\n\n  @keyframes slide-in-from-right {\n    0% {\n      opacity: 0;\n    }\n\n    to {\n      opacity: 1;\n    }\n  }\n\n  @keyframes slide-out-to-right {\n    0% {\n      opacity: 1;\n    }\n\n    to {\n      opacity: 0;\n    }\n  }\n\n  @keyframes slide-in-from-bottom {\n    0% {\n      opacity: 0;\n    }\n\n    to {\n      opacity: 1;\n    }\n  }\n\n  @keyframes slide-out-to-bottom {\n    0% {\n      opacity: 1;\n    }\n\n    to {\n      opacity: 0;\n    }\n  }\n\n  @keyframes slide-in-from-left {\n    0% {\n      opacity: 0;\n    }\n\n    to {\n      opacity: 1;\n    }\n  }\n\n  @keyframes slide-out-to-left {\n    0% {\n      opacity: 1;\n    }\n\n    to {\n      opacity: 0;\n    }\n  }\n\n  @keyframes slide-in-from-top-and-fade {\n    0% {\n      opacity: 0;\n    }\n\n    to {\n      opacity: 1;\n    }\n  }\n\n  @keyframes slide-out-to-top-and-fade {\n    0% {\n      opacity: 1;\n    }\n\n    to {\n      opacity: 0;\n    }\n  }\n\n  @keyframes slide-in-from-right-and-fade {\n    0% {\n      opacity: 0;\n    }\n\n    to {\n      opacity: 1;\n    }\n  }\n\n  @keyframes slide-out-to-right-and-fade {\n    0% {\n      opacity: 1;\n    }\n\n    to {\n      opacity: 0;\n    }\n  }\n\n  @keyframes slide-in-from-bottom-and-fade {\n    0% {\n      opacity: 0;\n    }\n\n    to {\n      opacity: 1;\n    }\n  }\n\n  @keyframes slide-out-to-bottom-and-fade {\n    0% {\n      opacity: 1;\n    }\n\n    to {\n      opacity: 0;\n    }\n  }\n\n  @keyframes slide-in-from-left-and-fade {\n    0% {\n      opacity: 0;\n    }\n\n    to {\n      opacity: 1;\n    }\n  }\n\n  @keyframes slide-out-to-left-and-fade {\n    0% {\n      opacity: 1;\n    }\n\n    to {\n      opacity: 0;\n    }\n  }\n\n  @keyframes enter-from-right {\n    0% {\n      opacity: 0;\n    }\n\n    to {\n      opacity: 1;\n    }\n  }\n\n  @keyframes enter-from-left {\n    0% {\n      opacity: 0;\n    }\n\n    to {\n      opacity: 1;\n    }\n  }\n\n  @keyframes exit-to-right {\n    0% {\n      opacity: 1;\n    }\n\n    to {\n      opacity: 0;\n    }\n  }\n\n  @keyframes exit-to-left {\n    0% {\n      opacity: 1;\n    }\n\n    to {\n      opacity: 0;\n    }\n  }\n\n  @keyframes toast-slide-in-from-top {\n    0% {\n      opacity: 0;\n    }\n\n    to {\n      opacity: 1;\n    }\n  }\n\n  @keyframes toast-slide-in-from-bottom {\n    0% {\n      opacity: 0;\n    }\n\n    to {\n      opacity: 1;\n    }\n  }\n\n  @keyframes toast-closed {\n    0% {\n      opacity: 1;\n    }\n\n    to {\n      opacity: 0;\n    }\n  }\n\n  @keyframes toast-collapsed-closed {\n    0% {\n      opacity: 1;\n    }\n\n    to {\n      opacity: 0;\n    }\n  }\n}\n\n:host {\n  --ui-primary: var(--bs-primary, #0d6efd);\n  --ui-success: var(--bs-success, #198754);\n  --ui-info: var(--bs-info, #0dcaf0);\n  --ui-warning: var(--bs-warning, #ffc107);\n  --ui-error: var(--bs-danger, #dc3545);\n  --ui-radius: var(--bs-border-radius, .375rem);\n  --ui-bg: var(--bs-body-bg, #fff);\n  --ui-bg-muted: var(--bs-tertiary-bg, #f8f9fa);\n  --ui-bg-elevated: var(--bs-secondary-bg, #e9ecef);\n  --ui-bg-accented: var(--bs-secondary-bg, #e9ecef);\n  --ui-border: var(--bs-border-color, #dee2e6);\n  --ui-border-muted: var(--bs-border-color, #dee2e6);\n  --ui-border-accented: var(--bs-border-color, #dee2e6);\n  --ui-text: var(--bs-body-color, #212529);\n  --ui-text-highlighted: var(--bs-emphasis-color, #000);\n  --ui-text-toned: var(--bs-secondary-color, #6c757d);\n  --ui-text-muted: var(--bs-secondary-color, #6c757d);\n  --ui-text-dimmed: var(--bs-tertiary-color, #adb5bd);\n  --ui-text-inverted: var(--bs-body-bg, #fff);\n  --ui-bg-inverted: var(--bs-emphasis-color, #212529);\n  font-family: var(--bs-body-font-family, inherit);\n}\n\n[data-resize-container] {\n  justify-content: center;\n  max-width: 100%;\n}\n\n.nuxt-code-block {\n  position: relative;\n}\n\n.nuxt-code-block > select {\n  z-index: 10;\n  color: var(--ui-text);\n  background: var(--ui-bg);\n  border: 1px solid var(--ui-border);\n  opacity: 0;\n  border-radius: .25rem;\n  padding: .125rem .25rem;\n  font-size: .75rem;\n  transition: opacity .15s;\n  position: absolute;\n  top: .5rem;\n  right: .5rem;\n}\n\n.nuxt-code-block:hover > select, .nuxt-code-block.is-active > select, .nuxt-code-block > select:focus {\n  opacity: 1;\n}\n\n.nuxt-upload-placeholder {\n  box-sizing: border-box;\n  border: 2px dashed var(--ui-border-accented, var(--ui-border));\n  background: var(--ui-bg);\n  width: 100%;\n  color: var(--ui-text-muted);\n  border-radius: .5rem;\n  flex-direction: row;\n  justify-content: center;\n  align-items: center;\n  gap: .75rem;\n  margin: .5rem 0;\n  padding: .5rem 1rem;\n  display: flex;\n}\n\n.nuxt-upload-placeholder__icon {\n  background: var(--ui-bg-elevated);\n  width: 2rem;\n  height: 2rem;\n  color: var(--ui-text-muted);\n  border-radius: 9999px;\n  justify-content: center;\n  align-items: center;\n  display: inline-flex;\n}\n\n.nuxt-upload-placeholder__label {\n  color: var(--ui-text-highlighted, var(--ui-text));\n  font-size: .875rem;\n  font-weight: 500;\n}\n\n[data-resize-container] [data-resize-wrapper], [data-resize-container] [data-resize-wrapper] img {\n  max-width: 100%;\n  height: auto !important;\n}\n\n[data-resize-handle] {\n  background: var(--ui-primary);\n  border: 1px solid var(--bs-body-bg, #fff);\n  cursor: ew-resize;\n  opacity: 0;\n  border-radius: 9999px;\n  width: 8px;\n  transform: translateY(-50%);\n  height: 48px !important;\n  top: 50% !important;\n  bottom: auto !important;\n}\n\n[data-resize-container]:hover [data-resize-handle], [data-resize-container][data-resize-state=\"true\"] [data-resize-handle] {\n  opacity: 1;\n}\n\n[data-resize-handle=\"left\"] {\n  left: -4px !important;\n}\n\n[data-resize-handle=\"right\"] {\n  right: -4px !important;\n}\n\n.ProseMirror mark {\n  color: inherit;\n  background-color: #fff3a3;\n  border-radius: .15em;\n  padding: 0 .1em;\n}\n\n.ProseMirror table {\n  border-collapse: collapse;\n  table-layout: fixed;\n  width: 100%;\n  margin: .75rem 0;\n  overflow: hidden;\n}\n\n.ProseMirror th, .ProseMirror td {\n  vertical-align: top;\n  border: 1px solid var(--ui-border-accented, var(--ui-border));\n  box-sizing: border-box;\n  min-width: 2rem;\n  padding: .375rem .5rem;\n  position: relative;\n}\n\n.ProseMirror th {\n  text-align: left;\n  background: var(--ui-bg-muted);\n  font-weight: 600;\n}\n\n.ProseMirror .selectedCell:after {\n  content: \"\";\n  background: var(--ui-primary);\n  position: absolute;\n  inset: 0;\n}\n\n@supports (color: color-mix(in lab, red, red)) {\n  .ProseMirror .selectedCell:after {\n    background: color-mix(in srgb, var(--ui-primary) 20%, transparent);\n  }\n}\n\n.ProseMirror .selectedCell:after {\n  pointer-events: none;\n}\n\n.ProseMirror .column-resize-handle {\n  background: var(--ui-primary);\n  pointer-events: none;\n  width: 4px;\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  right: -2px;\n}\n\n.ProseMirror.resize-cursor {\n  cursor: col-resize;\n}\n\n.ProseMirror .tableWrapper {\n  overflow-x: auto;\n}\n\n.ProseMirror td > p, .ProseMirror th > p {\n  margin: 0;\n}\n\n.nuxt-editor-caption {\n  text-align: center;\n  width: 100%;\n  color: var(--ui-text-muted);\n  background: none;\n  outline: none;\n  margin-top: .25rem;\n  font-size: .875rem;\n  display: block;\n}\n\n@property --tw-border-spacing-x {\n  syntax: \"<length>\";\n  inherits: false;\n  initial-value: 0;\n}\n\n@property --tw-border-spacing-y {\n  syntax: \"<length>\";\n  inherits: false;\n  initial-value: 0;\n}\n\n@property --tw-translate-x {\n  syntax: \"*\";\n  inherits: false;\n  initial-value: 0;\n}\n\n@property --tw-translate-y {\n  syntax: \"*\";\n  inherits: false;\n  initial-value: 0;\n}\n\n@property --tw-translate-z {\n  syntax: \"*\";\n  inherits: false;\n  initial-value: 0;\n}\n\n@property --tw-scale-x {\n  syntax: \"*\";\n  inherits: false;\n  initial-value: 1;\n}\n\n@property --tw-scale-y {\n  syntax: \"*\";\n  inherits: false;\n  initial-value: 1;\n}\n\n@property --tw-scale-z {\n  syntax: \"*\";\n  inherits: false;\n  initial-value: 1;\n}\n\n@property --tw-rotate-x {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-rotate-y {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-rotate-z {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-skew-x {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-skew-y {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-pan-x {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-pan-y {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-pinch-zoom {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-space-y-reverse {\n  syntax: \"*\";\n  inherits: false;\n  initial-value: 0;\n}\n\n@property --tw-space-x-reverse {\n  syntax: \"*\";\n  inherits: false;\n  initial-value: 0;\n}\n\n@property --tw-divide-x-reverse {\n  syntax: \"*\";\n  inherits: false;\n  initial-value: 0;\n}\n\n@property --tw-border-style {\n  syntax: \"*\";\n  inherits: false;\n  initial-value: solid;\n}\n\n@property --tw-divide-y-reverse {\n  syntax: \"*\";\n  inherits: false;\n  initial-value: 0;\n}\n\n@property --tw-gradient-position {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-gradient-from {\n  syntax: \"<color>\";\n  inherits: false;\n  initial-value: #0000;\n}\n\n@property --tw-gradient-via {\n  syntax: \"<color>\";\n  inherits: false;\n  initial-value: #0000;\n}\n\n@property --tw-gradient-to {\n  syntax: \"<color>\";\n  inherits: false;\n  initial-value: #0000;\n}\n\n@property --tw-gradient-stops {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-gradient-via-stops {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-gradient-from-position {\n  syntax: \"<length-percentage>\";\n  inherits: false;\n  initial-value: 0%;\n}\n\n@property --tw-gradient-via-position {\n  syntax: \"<length-percentage>\";\n  inherits: false;\n  initial-value: 50%;\n}\n\n@property --tw-gradient-to-position {\n  syntax: \"<length-percentage>\";\n  inherits: false;\n  initial-value: 100%;\n}\n\n@property --tw-leading {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-font-weight {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-tracking {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-ordinal {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-slashed-zero {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-numeric-figure {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-numeric-spacing {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-numeric-fraction {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-shadow {\n  syntax: \"*\";\n  inherits: false;\n  initial-value: 0 0 #0000;\n}\n\n@property --tw-shadow-color {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-shadow-alpha {\n  syntax: \"<percentage>\";\n  inherits: false;\n  initial-value: 100%;\n}\n\n@property --tw-inset-shadow {\n  syntax: \"*\";\n  inherits: false;\n  initial-value: 0 0 #0000;\n}\n\n@property --tw-inset-shadow-color {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-inset-shadow-alpha {\n  syntax: \"<percentage>\";\n  inherits: false;\n  initial-value: 100%;\n}\n\n@property --tw-ring-color {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-ring-shadow {\n  syntax: \"*\";\n  inherits: false;\n  initial-value: 0 0 #0000;\n}\n\n@property --tw-inset-ring-color {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-inset-ring-shadow {\n  syntax: \"*\";\n  inherits: false;\n  initial-value: 0 0 #0000;\n}\n\n@property --tw-ring-inset {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-ring-offset-width {\n  syntax: \"<length>\";\n  inherits: false;\n  initial-value: 0;\n}\n\n@property --tw-ring-offset-color {\n  syntax: \"*\";\n  inherits: false;\n  initial-value: #fff;\n}\n\n@property --tw-ring-offset-shadow {\n  syntax: \"*\";\n  inherits: false;\n  initial-value: 0 0 #0000;\n}\n\n@property --tw-outline-style {\n  syntax: \"*\";\n  inherits: false;\n  initial-value: solid;\n}\n\n@property --tw-blur {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-brightness {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-contrast {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-grayscale {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-hue-rotate {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-invert {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-opacity {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-saturate {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-sepia {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-drop-shadow {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-drop-shadow-color {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-drop-shadow-alpha {\n  syntax: \"<percentage>\";\n  inherits: false;\n  initial-value: 100%;\n}\n\n@property --tw-drop-shadow-size {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-backdrop-blur {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-backdrop-brightness {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-backdrop-contrast {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-backdrop-grayscale {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-backdrop-hue-rotate {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-backdrop-invert {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-backdrop-opacity {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-backdrop-saturate {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-backdrop-sepia {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-duration {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-ease {\n  syntax: \"*\";\n  inherits: false\n}\n\n@property --tw-content {\n  syntax: \"*\";\n  inherits: false;\n  initial-value: \"\";\n}\n\n@keyframes spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes pulse {\n  50% {\n    opacity: .5;\n  }\n}\n\n@keyframes bounce {\n  0%, 100% {\n    animation-timing-function: cubic-bezier(.8, 0, 1, 1);\n    transform: translateY(-25%);\n  }\n\n  50% {\n    animation-timing-function: cubic-bezier(0, 0, .2, 1);\n    transform: none;\n  }\n}\n";
// src/module/nuxt-editor.ts
var nuxt_editor_exports = /*@__PURE__*/ __exportAll({
	configure: () => configure,
	create: () => create,
	destroy: () => destroy,
	get: () => get
});
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
	element.style.display = "none";
	const loader = document.createElement("div");
	loader.className = "nuxt-editor-loading";
	loader.style.cssText = "display:flex;align-items:center;justify-content:center;gap:.5rem;min-height:8rem;border:1px solid var(--bs-border-color,#dee2e6);border-radius:.375rem;color:var(--bs-secondary-color,#6c757d);font-size:.875rem;";
	loader.innerHTML = "<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"><path d=\"M21 12a9 9 0 1 1-6.2-8.55\"><animateTransform attributeName=\"transform\" type=\"rotate\" from=\"0 12 12\" to=\"360 12 12\" dur=\"1s\" repeatCount=\"indefinite\"/></path></svg><span>Loading editor...</span>";
	element.after(loader);
	const [{ default: UFileUpload }, { default: UAvatar }, { Node, Extension, mergeAttributes }, { Plugin, PluginKey }, { Decoration, DecorationSet }, { TextAlign }, { default: TiptapHighlight }, { TextStyle, Color, BackgroundColor }, { default: TiptapImage }, { default: TiptapCodeBlock }, tableExt, pmTables, pmModel, { VueNodeViewRenderer, NodeViewWrapper, nodeViewProps }, { mapEditorItems }, { default: ui }, locales] = await Promise.all([
		import("./FileUpload.js"),
		import("./Avatar.js").then((n) => n.n),
		import("@tiptap/core"),
		import("@tiptap/pm/state"),
		import("@tiptap/pm/view"),
		import("@tiptap/extension-text-align"),
		import("@tiptap/extension-highlight"),
		import("@tiptap/extension-text-style"),
		import("@tiptap/extension-image"),
		import("@tiptap/extension-code-block"),
		import("@tiptap/extension-table"),
		import("@tiptap/pm/tables"),
		import("@tiptap/pm/model"),
		import("@tiptap/vue-3"),
		import("./editor.js").then((n) => n.r),
		import("./virtual_nuxt-ui-plugins.js"),
		import("./locale.js")
	]).catch((e) => {
		loader.remove();
		element.style.display = "";
		element.style.visibility = "";
		throw e;
	});
	const { default: NuxtEditorApp } = await import("./NuxtEditorApp.js");
	const opts = mergeDeep({
		format: "html",
		props: {},
		unicorn: {}
	}, options);
	const format = opts.format;
	const { host, root, portal } = createShadowHost(nuxt_editor_default);
	loader.replaceWith(host);
	const { content, update, set } = useEditorSync(element, format, parseValue);
	const editor = shallowRef(null);
	const editable = ref(!(opts.readonly || element.readOnly || element.disabled));
	const resolveItems = createItemsResolver({
		...globalToolbars,
		...options.toolbars
	}, opts);
	const uploadImage = createUploadImage(element, opts);
	const { toolbarItems, textBubbleItems, videoBubbleItems, imageBubbleItems, suggestionItems, blockMenuItems: defaultBlockMenu } = createToolbars(opts, uploadImage);
	const CaptionImage = createCaptionImage(TiptapImage, mergeAttributes, opts);
	const CodeBlock = createCodeBlock(TiptapCodeBlock, opts);
	const { ImageUpload, customHandlers } = createImageUpload({
		Node,
		mergeAttributes,
		VueNodeViewRenderer,
		NodeViewWrapper,
		nodeViewProps,
		UFileUpload,
		UAvatar,
		uploadImage
	});
	const table = createTable(tableExt, pmTables, pmModel, { colors: opts.tableColors });
	const handlers = {
		...customHandlers,
		...table.handlers
	};
	const { selectedNode, items: blockMenuItems } = useBlockMenu(resolveItems, defaultBlockMenu, mapEditorItems);
	const locale = locales[(opts.locale || "").replace("-", "_")] ?? locales.en;
	const extensions = [
		CaptionImage,
		CodeBlock,
		TextAlign.configure({ types: ["heading", "paragraph"] }),
		TiptapHighlight,
		TextStyle,
		Color,
		BackgroundColor,
		createVideoEmbed({
			Node,
			mergeAttributes,
			Plugin,
			PluginKey
		}),
		...table.extensions,
		...opts.imageUploadUrl ? [ImageUpload, createImagePasteDrop({
			Extension,
			Plugin,
			PluginKey,
			Decoration,
			DecorationSet
		}, uploadImage, opts, opts.imageFetchUrl ? createFetchImage(element, opts) : void 0)] : []
	];
	const items = {
		fixed: (ed) => resolveItems("fixed", [...toolbarItems(), table.toolbarGroup()], ed),
		text: (ed) => resolveItems("textBubble", textBubbleItems(), ed),
		video: (ed) => resolveItems("videoBubble", videoBubbleItems(ed), ed),
		image: (ed) => resolveItems("imageBubble", imageBubbleItems(ed), ed),
		slash: (ed) => resolveItems("slash", suggestionItems, ed),
		blockMenu: blockMenuItems,
		tableMenu: table.menuItems
	};
	const app = createApp({ setup() {
		return () => h(NuxtEditorApp, {
			modelValue: content.value,
			format,
			editable: editable.value,
			locale,
			portal,
			extensions,
			handlers,
			editorProps: opts.props,
			items,
			"onUpdate:modelValue": update,
			onNodeChange: (node) => {
				selectedNode.value = node;
			},
			onCreate: (ed) => {
				editor.value = ed;
				element.dispatchEvent(new CustomEvent("nuxt-editor:create", { detail: ed }));
			}
		});
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
			set(value);
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
			element.style.visibility = "";
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
export { resolveColors as a, configure, create, destroy, get, createColorMenu as i, attrsOf as n, toBackground as o, parseEmbedInput as r, nuxt_editor_exports as t };

//# sourceMappingURL=nuxt-editor.js.map