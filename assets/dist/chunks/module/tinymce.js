import { m as mergeDeep } from "../utilities/arr.js";
import { u as useStack } from "../composable/useStack.js";
import { u as useHttpClient } from "../composable/useHttp.js";
import { a as useImport } from "../service/loader.js";
const instances = {};
let hooks = [];
let imported = false;
async function get(selector, options = {}) {
  const tinymce2 = await loadTinymce();
  return instances[selector] ??= new TinymceController(tinymce2, document.querySelector(selector), options);
}
function destroy(selector) {
  delete instances[selector];
}
function addHook(handler) {
  hooks.push(handler);
}
function clearHooks() {
  hooks = [];
}
async function loadTinymce() {
  await useImport("@tinymce");
  if (imported) {
    return tinymce;
  }
  imported = true;
  for (const hook of hooks) {
    hook(tinymce);
  }
  await registerDragPlugin(tinymce);
  return tinymce;
}
const defaultOptions = {};
class TinymceController {
  constructor(tinymce2, element, options) {
    this.tinymce = tinymce2;
    this.element = element;
    options.target = element;
    this.options = mergeDeep(
      {
        unicorn: {
          stack_name: "uploading"
        }
      },
      defaultOptions,
      this.prepareOptions(options, tinymce2.majorVersion)
    );
    tinymce2.EditorManager.init(this.options).then((editor) => {
      this.editor = editor[0];
    });
  }
  editor;
  options = {};
  prepareOptions(options, version = "6") {
    const defaults = {};
    if (options.images_upload_url) {
      defaults.paste_data_images = true;
      defaults.remove_script_host = false;
      defaults.relative_urls = false;
      if (Number(version) >= 6) {
        defaults.images_upload_handler = (blobInfo, progress) => this.imageUploadHandler(blobInfo, progress);
      } else {
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
    if (options.plugins.indexOf("unicorndragdrop") === -1) {
      options.plugins.push("unicorndragdrop");
    }
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
  // filePickerCallback(callback, value, meta) {
  //   const input = document.createElement('input');
  //   input.setAttribute('type', 'file');
  //   input.style.display = 'none';
  //
  //   if (meta.filetype === 'image') {
  //     input.setAttribute('accept', `image/\*`);
  //   }
  //
  //   document.body.appendChild(input);
  //
  //   input.onchange = function () {
  //     const file = this.files[0];
  //
  //     const reader = new FileReader();
  //     reader.onload = function () {
  //       const id = 'blobid' + (new Date()).getTime();
  //       const blobCache =  tinymce.activeEditor.editorUpload.blobCache;
  //       const base64 = reader.result.split(',')[1];
  //       const blobInfo = blobCache.create(id, file, base64);
  //       blobCache.add(blobInfo);
  //
  //       /* call the callback and populate the Title field with the file name */
  //       callback(blobInfo.blobUri(), { title: file.name, text: file.name });
  //     };
  //     reader.readAsDataURL(file);
  //     input.remove();
  //   };
  //
  //   input.click();
  // }
  async imageUploadHandler(blobInfo, progress) {
    const element = this.element;
    element.dispatchEvent(new CustomEvent("upload-start"));
    const formData = new FormData();
    formData.append("file", blobInfo.blob(), blobInfo.filename());
    const stack = useStack(this.options.unicorn.stack_name);
    stack.push(true);
    const http = await useHttpClient();
    try {
      let res = await http.post(
        this.options.images_upload_url,
        formData,
        {
          withCredentials: false,
          onUploadProgress: (e) => {
            progress(e.loaded / e.total * 100);
          }
        }
      );
      element.dispatchEvent(new CustomEvent("upload-success"));
      return res.data.data.url;
    } catch (err) {
      const AxiosError = await http.errorClass();
      if (err instanceof AxiosError) {
        const message = err?.response?.data?.message || err.message;
        console.error(err?.response?.data?.message || err.message, err);
        element.dispatchEvent(new CustomEvent("upload-error", { detail: err }));
        return Promise.reject({ message, remove: true });
      }
      throw err;
    } finally {
      element.dispatchEvent(new CustomEvent("upload-complete"));
      stack.pop();
    }
  }
}
function registerDragPlugin(tinymce2) {
  tinymce2.PluginManager.add("unicorndragdrop", function(editor) {
    tinymce2.DOM.bind(document, "dragleave", function(e) {
      e.stopPropagation();
      e.preventDefault();
      if (tinymce2.activeEditor) {
        tinymce2.activeEditor.contentAreaContainer.style.transition = "all .3s";
        tinymce2.activeEditor.contentAreaContainer.style.borderWidth = "";
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
        if (tinymce2.activeEditor) {
          tinymce2.activeEditor.contentAreaContainer.style.transition = "all .3s";
          tinymce2.activeEditor.contentAreaContainer.style.border = "3px dashed rgba(0, 0, 0, .35)";
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
export {
  TinymceController,
  addHook,
  clearHooks,
  destroy,
  get
};
