import { t as mergeDeep } from "./arr.js";
import { d as selectOne } from "./dom.js";
import { n as useStack } from "./useStack.js";
import { a as useScriptImport } from "./loader.js";
import { useHttpClient } from "../unicorn.js";
//#region src/module/tinymce.ts
var instances = {};
var hooks = [];
var imported;
async function get(selector, options = {}) {
	const key = typeof selector !== "string" ? "#" + selector.id : selector;
	return instances[key] ??= await create(selectOne(selector), options);
}
async function create(selector, options = {}) {
	const tinymce = await loadTinymce();
	let el;
	if (typeof selector === "string") el = document.querySelector(selector);
	else el = selector;
	return new TinymceController(tinymce, el, options);
}
function destroy(selector) {
	const key = typeof selector !== "string" ? "#" + selector.id : selector;
	instances[key]?.destroy();
	delete instances[key];
}
function addHook(handler) {
	hooks.push(handler);
}
function clearHooks() {
	hooks = [];
}
async function loadTinymce() {
	return imported ??= new Promise((resolve) => {
		useScriptImport("@tinymce").then(() => {
			for (const hook of hooks) hook(tinymce);
			registerDragPlugin(tinymce).then(() => {
				resolve(tinymce);
			});
		});
	});
}
var defaultOptions = {};
var TinymceController = class {
	editor;
	options = {};
	constructor(tinymce, element, options) {
		this.tinymce = tinymce;
		this.element = element;
		this.options = mergeDeep({ unicorn: { stack_name: "uploading" } }, defaultOptions, this.prepareOptions(options, tinymce.majorVersion));
		this.options.target = element;
		tinymce.init(this.options).then((editor) => {
			if (!editor[0]) throw new Error("Failed to initialize TinyMCE editor.");
			this.editor = editor[0];
		});
	}
	prepareOptions(options, version = "6") {
		const defaults = {};
		if (options.images_upload_url) {
			defaults.paste_data_images = true;
			defaults.remove_script_host = false;
			defaults.relative_urls = false;
			if (Number(version) >= 6) defaults.images_upload_handler = (blobInfo, progress) => this.imageUploadHandler(blobInfo, progress);
			else {
				options.plugins.push("paste");
				defaults.images_upload_handler = (blobInfo, success, failure, progress) => this.imageUploadHandler(blobInfo, progress).then((url) => {
					success(url);
					return url;
				}).catch((e) => {
					failure(e.message, { remove: true });
					throw e;
				});
			}
		}
		defaults.plugins = defaults.plugins || [];
		defaults.setup = (editor) => {
			editor.on("change", () => {
				this.tinymce.triggerSave();
			});
		};
		options = mergeDeep({}, defaults, options);
		if (options.plugins.indexOf("unicorndragdrop") === -1) options.plugins.push("unicorndragdrop");
		return options;
	}
	insert(text) {
		this.editor?.insertContent(text);
	}
	getValue() {
		return this.editor?.getContent() ?? "";
	}
	setValue(text) {
		this.editor?.setContent(text);
	}
	async imageUploadHandler(blobInfo, progress) {
		const element = this.element;
		element.dispatchEvent(new CustomEvent("upload-start"));
		const formData = new FormData();
		formData.append("file", blobInfo.blob(), blobInfo.filename());
		const stack = useStack(this.options.unicorn.stack_name);
		stack.push(true);
		const { post, isAxiosError } = await useHttpClient();
		try {
			let res = await post(this.options.images_upload_url, formData, {
				withCredentials: false,
				onUploadProgress: (e) => {
					progress(e.loaded / e.total * 100);
				}
			});
			element.dispatchEvent(new CustomEvent("upload-success"));
			return res.data.data.url;
		} catch (err) {
			if (isAxiosError(err)) {
				const message = err?.response?.data?.message || err.message;
				console.error(err?.response?.data?.message || err.message, err);
				element.dispatchEvent(new CustomEvent("upload-error", { detail: err }));
				return Promise.reject({
					message,
					remove: true
				});
			}
			throw err;
		} finally {
			element.dispatchEvent(new CustomEvent("upload-complete"));
			stack.pop();
		}
	}
	destroy() {
		this.editor?.destroy();
		this.editor = void 0;
	}
};
function registerDragPlugin(tinymce) {
	tinymce.PluginManager.add("unicorndragdrop", function(editor) {
		tinymce.DOM.bind(document, "dragleave", function(e) {
			e.stopPropagation();
			e.preventDefault();
			if (tinymce.activeEditor) {
				tinymce.activeEditor.contentAreaContainer.style.transition = "all .3s";
				tinymce.activeEditor.contentAreaContainer.style.borderWidth = "";
			}
			return false;
		});
		if (typeof FormData !== "undefined") {
			editor.on("dragenter", (e) => {
				e.stopPropagation();
				return false;
			});
			editor.on("dragover", (e) => {
				e.preventDefault();
				if (tinymce.activeEditor) {
					tinymce.activeEditor.contentAreaContainer.style.transition = "all .3s";
					tinymce.activeEditor.contentAreaContainer.style.border = "3px dashed rgba(0, 0, 0, .35)";
				}
				return false;
			});
			editor.on("drop", (e) => {
				editor.contentAreaContainer.style.borderWidth = "";
				editor.contentAreaContainer.style.borderWidth = "";
			});
		}
	});
	return Promise.resolve();
}
//#endregion
export { TinymceController, addHook, clearHooks, create, destroy, get };

//# sourceMappingURL=tinymce.js.map