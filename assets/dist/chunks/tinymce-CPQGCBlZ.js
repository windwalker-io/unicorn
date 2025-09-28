import { m as mergeDeep, H as useStack, q as useHttpClient, g as useImport } from "./unicorn-DR9JpPYO.js";
const instances = {};
let hooks = [];
let imported = false;
async function get(selector, options = {}) {
  const tinymce = await loadTinymce();
  return instances[selector] ??= new TinymceController(tinymce, document.querySelector(selector), options);
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
  let tinymce = (await useImport("@tinymce")).default;
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
  constructor(tinymce, element, options) {
    this.tinymce = tinymce;
    this.element = element;
    options.target = element;
    this.options = mergeDeep(
      {
        unicorn: {
          stack_name: "uploading"
        }
      },
      defaultOptions,
      this.prepareOptions(options, tinymce.majorVersion)
    );
    tinymce.EditorManager.init(this.options).then((editor) => {
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
export {
  TinymceController,
  addHook,
  clearHooks,
  destroy,
  get
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlueW1jZS1DUFFHQ0JsWi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21vZHVsZS90aW55bWNlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgRWRpdG9yLCBFZGl0b3JPcHRpb25zLCBUaW55TUNFIH0gZnJvbSAndGlueW1jZSc7XG5pbXBvcnQgeyB1c2VIdHRwQ2xpZW50LCB1c2VTdGFjayB9IGZyb20gJy4uL2NvbXBvc2FibGUnO1xuaW1wb3J0IHsgdXNlSW1wb3J0IH0gZnJvbSAnLi4vc2VydmljZSc7XG5pbXBvcnQgeyBEaWN0aW9uYXJ5LCBNYXliZVByb21pc2UgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBtZXJnZURlZXAgfSBmcm9tICcuLi91dGlsaXRpZXMnO1xuXG5jb25zdCBpbnN0YW5jZXM6IERpY3Rpb25hcnk8VGlueW1jZUNvbnRyb2xsZXI+ID0ge307XG5sZXQgaG9va3M6ICgodGlueW1jZTogVGlueU1DRSkgPT4gTWF5YmVQcm9taXNlPGFueT4pW10gPSBbXTtcblxubGV0IGltcG9ydGVkID0gZmFsc2U7XG5cbmRlY2xhcmUgdHlwZSBVcGxvYWRIYW5kbGVyUGFyYW1zID0gUGFyYW1ldGVyczxOb25OdWxsYWJsZTxFZGl0b3JPcHRpb25zWydpbWFnZXNfdXBsb2FkX2hhbmRsZXInXT4+O1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0KFxuICBzZWxlY3Rvcjogc3RyaW5nLFxuICBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge31cbik6IFByb21pc2U8VGlueW1jZUNvbnRyb2xsZXI+IHtcbiAgY29uc3QgdGlueW1jZSA9IGF3YWl0IGxvYWRUaW55bWNlKCk7XG5cbiAgcmV0dXJuIGluc3RhbmNlc1tzZWxlY3Rvcl0gPz89IG5ldyBUaW55bWNlQ29udHJvbGxlcih0aW55bWNlLCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKSEsIG9wdGlvbnMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVzdHJveShzZWxlY3Rvcjogc3RyaW5nKTogdm9pZCB7XG4gIGRlbGV0ZSBpbnN0YW5jZXNbc2VsZWN0b3JdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkSG9vayhoYW5kbGVyOiAoKHRpbnltY2U6IFRpbnlNQ0UpID0+IE1heWJlUHJvbWlzZTxhbnk+KSkge1xuICBob29rcy5wdXNoKGhhbmRsZXIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xlYXJIb29rcygpIHtcbiAgaG9va3MgPSBbXTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gbG9hZFRpbnltY2UoKTogUHJvbWlzZTxUaW55TUNFPiB7XG4gIGxldCB0aW55bWNlID0gKGF3YWl0IHVzZUltcG9ydCgnQHRpbnltY2UnKSkuZGVmYXVsdDtcblxuICBpZiAoaW1wb3J0ZWQpIHtcbiAgICByZXR1cm4gdGlueW1jZTtcbiAgfVxuICBpbXBvcnRlZCA9IHRydWU7XG4gIGZvciAoY29uc3QgaG9vayBvZiBob29rcykge1xuICAgIGhvb2sodGlueW1jZSk7XG4gIH1cbiAgYXdhaXQgcmVnaXN0ZXJEcmFnUGx1Z2luKHRpbnltY2UpO1xuICByZXR1cm4gdGlueW1jZTtcbn1cblxuY29uc3QgZGVmYXVsdE9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcblxuZXhwb3J0IGNsYXNzIFRpbnltY2VDb250cm9sbGVyIHtcbiAgZWRpdG9yPzogRWRpdG9yO1xuICBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHRpbnltY2U6IFRpbnlNQ0UsIHB1YmxpYyBlbGVtZW50OiBIVE1MRWxlbWVudCwgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55Pikge1xuICAgIG9wdGlvbnMudGFyZ2V0ID0gZWxlbWVudDtcblxuICAgIHRoaXMub3B0aW9ucyA9IG1lcmdlRGVlcChcbiAgICAgIHtcbiAgICAgICAgdW5pY29ybjoge1xuICAgICAgICAgIHN0YWNrX25hbWU6ICd1cGxvYWRpbmcnXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBkZWZhdWx0T3B0aW9ucyxcbiAgICAgIHRoaXMucHJlcGFyZU9wdGlvbnMob3B0aW9ucywgdGlueW1jZS5tYWpvclZlcnNpb24pLFxuICAgICk7XG5cbiAgICB0aW55bWNlLkVkaXRvck1hbmFnZXIuaW5pdCh0aGlzLm9wdGlvbnMpLnRoZW4oKGVkaXRvcikgPT4ge1xuICAgICAgdGhpcy5lZGl0b3IgPSBlZGl0b3JbMF07XG4gICAgfSk7XG4gIH1cblxuICBwcmVwYXJlT3B0aW9ucyhvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+LCB2ZXJzaW9uID0gJzYnKSB7XG4gICAgY29uc3QgZGVmYXVsdHM6IFBhcnRpYWw8RWRpdG9yT3B0aW9ucz4gPSB7fTtcblxuICAgIGlmIChvcHRpb25zLmltYWdlc191cGxvYWRfdXJsKSB7XG4gICAgICBkZWZhdWx0cy5wYXN0ZV9kYXRhX2ltYWdlcyA9IHRydWU7XG4gICAgICBkZWZhdWx0cy5yZW1vdmVfc2NyaXB0X2hvc3QgPSBmYWxzZTtcbiAgICAgIGRlZmF1bHRzLnJlbGF0aXZlX3VybHMgPSBmYWxzZTtcblxuICAgICAgaWYgKE51bWJlcih2ZXJzaW9uKSA+PSA2KSB7XG4gICAgICAgIGRlZmF1bHRzLmltYWdlc191cGxvYWRfaGFuZGxlciA9IChibG9iSW5mbywgcHJvZ3Jlc3MpID0+XG4gICAgICAgICAgdGhpcy5pbWFnZVVwbG9hZEhhbmRsZXIoYmxvYkluZm8sIHByb2dyZXNzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9wdGlvbnMucGx1Z2lucy5wdXNoKCdwYXN0ZScpO1xuXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgZGVmYXVsdHMuaW1hZ2VzX3VwbG9hZF9oYW5kbGVyID0gKGJsb2JJbmZvLCBzdWNjZXNzLCBmYWlsdXJlLCBwcm9ncmVzcykgPT5cbiAgICAgICAgICB0aGlzLmltYWdlVXBsb2FkSGFuZGxlcihibG9iSW5mbywgcHJvZ3Jlc3MpXG4gICAgICAgICAgICAudGhlbigodXJsKSA9PiB7XG4gICAgICAgICAgICAgIHN1Y2Nlc3ModXJsKTtcbiAgICAgICAgICAgICAgcmV0dXJuIHVybDtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgICAgICAgZmFpbHVyZShlLm1lc3NhZ2UsIHsgcmVtb3ZlOiB0cnVlIH0pO1xuICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gZGVmYXVsdHMuZmlsZV9waWNrZXJfY2FsbGJhY2sgPSAoLi4uYXJncykgPT4gdGhpcy5maWxlUGlja2VyQ2FsbGJhY2soLi4uYXJncyk7XG5cbiAgICBkZWZhdWx0cy5wbHVnaW5zID0gZGVmYXVsdHMucGx1Z2lucyB8fCBbXTtcblxuICAgIGRlZmF1bHRzLnNldHVwID0gKGVkaXRvcikgPT4ge1xuICAgICAgZWRpdG9yLm9uKCdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICAgIHRoaXMudGlueW1jZS50cmlnZ2VyU2F2ZSgpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIG9wdGlvbnMgPSBtZXJnZURlZXAoe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcblxuICAgIGlmIChvcHRpb25zLnBsdWdpbnMuaW5kZXhPZigndW5pY29ybmRyYWdkcm9wJykgPT09IC0xKSB7XG4gICAgICBvcHRpb25zLnBsdWdpbnMucHVzaCgndW5pY29ybmRyYWdkcm9wJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9wdGlvbnM7XG4gIH1cblxuICBpbnNlcnQodGV4dDogc3RyaW5nKSB7XG4gICAgdGhpcy5lZGl0b3I/Lmluc2VydENvbnRlbnQodGV4dCk7XG4gIH1cblxuICBnZXRWYWx1ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmVkaXRvcj8uZ2V0Q29udGVudCgpID8/ICcnO1xuICB9XG5cbiAgc2V0VmFsdWUodGV4dDogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5lZGl0b3I/LnNldENvbnRlbnQodGV4dCk7XG4gIH1cblxuICAvLyBmaWxlUGlja2VyQ2FsbGJhY2soY2FsbGJhY2ssIHZhbHVlLCBtZXRhKSB7XG4gIC8vICAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAvLyAgIGlucHV0LnNldEF0dHJpYnV0ZSgndHlwZScsICdmaWxlJyk7XG4gIC8vICAgaW5wdXQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgLy9cbiAgLy8gICBpZiAobWV0YS5maWxldHlwZSA9PT0gJ2ltYWdlJykge1xuICAvLyAgICAgaW5wdXQuc2V0QXR0cmlidXRlKCdhY2NlcHQnLCBgaW1hZ2UvXFwqYCk7XG4gIC8vICAgfVxuICAvL1xuICAvLyAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaW5wdXQpO1xuICAvL1xuICAvLyAgIGlucHV0Lm9uY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAvLyAgICAgY29uc3QgZmlsZSA9IHRoaXMuZmlsZXNbMF07XG4gIC8vXG4gIC8vICAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAvLyAgICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gICAgICAgY29uc3QgaWQgPSAnYmxvYmlkJyArIChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XG4gIC8vICAgICAgIGNvbnN0IGJsb2JDYWNoZSA9ICB0aW55bWNlLmFjdGl2ZUVkaXRvci5lZGl0b3JVcGxvYWQuYmxvYkNhY2hlO1xuICAvLyAgICAgICBjb25zdCBiYXNlNjQgPSByZWFkZXIucmVzdWx0LnNwbGl0KCcsJylbMV07XG4gIC8vICAgICAgIGNvbnN0IGJsb2JJbmZvID0gYmxvYkNhY2hlLmNyZWF0ZShpZCwgZmlsZSwgYmFzZTY0KTtcbiAgLy8gICAgICAgYmxvYkNhY2hlLmFkZChibG9iSW5mbyk7XG4gIC8vXG4gIC8vICAgICAgIC8qIGNhbGwgdGhlIGNhbGxiYWNrIGFuZCBwb3B1bGF0ZSB0aGUgVGl0bGUgZmllbGQgd2l0aCB0aGUgZmlsZSBuYW1lICovXG4gIC8vICAgICAgIGNhbGxiYWNrKGJsb2JJbmZvLmJsb2JVcmkoKSwgeyB0aXRsZTogZmlsZS5uYW1lLCB0ZXh0OiBmaWxlLm5hbWUgfSk7XG4gIC8vICAgICB9O1xuICAvLyAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7XG4gIC8vICAgICBpbnB1dC5yZW1vdmUoKTtcbiAgLy8gICB9O1xuICAvL1xuICAvLyAgIGlucHV0LmNsaWNrKCk7XG4gIC8vIH1cblxuICBhc3luYyBpbWFnZVVwbG9hZEhhbmRsZXIoYmxvYkluZm86IFVwbG9hZEhhbmRsZXJQYXJhbXNbMF0sIHByb2dyZXNzOiBVcGxvYWRIYW5kbGVyUGFyYW1zWzFdKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZWxlbWVudDtcblxuICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3VwbG9hZC1zdGFydCcpKTtcblxuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgZm9ybURhdGEuYXBwZW5kKCdmaWxlJywgYmxvYkluZm8uYmxvYigpLCBibG9iSW5mby5maWxlbmFtZSgpKTtcblxuICAgIGNvbnN0IHN0YWNrID0gdXNlU3RhY2sodGhpcy5vcHRpb25zLnVuaWNvcm4uc3RhY2tfbmFtZSk7XG4gICAgc3RhY2sucHVzaCh0cnVlKTtcblxuICAgIGNvbnN0IGh0dHAgPSBhd2FpdCB1c2VIdHRwQ2xpZW50KCk7XG5cbiAgICB0cnkge1xuICAgICAgbGV0IHJlcyA9IGF3YWl0IGh0dHAucG9zdChcbiAgICAgICAgdGhpcy5vcHRpb25zLmltYWdlc191cGxvYWRfdXJsLFxuICAgICAgICBmb3JtRGF0YSxcbiAgICAgICAge1xuICAgICAgICAgIHdpdGhDcmVkZW50aWFsczogZmFsc2UsXG4gICAgICAgICAgb25VcGxvYWRQcm9ncmVzczogKGUpID0+IHtcbiAgICAgICAgICAgIHByb2dyZXNzKGUubG9hZGVkIC8gZS50b3RhbCEgKiAxMDApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgKTtcbiAgICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3VwbG9hZC1zdWNjZXNzJykpO1xuXG4gICAgICByZXR1cm4gcmVzLmRhdGEuZGF0YS51cmw7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zdCBBeGlvc0Vycm9yID0gYXdhaXQgaHR0cC5lcnJvckNsYXNzKCk7XG5cbiAgICAgIGlmIChlcnIgaW5zdGFuY2VvZiBBeGlvc0Vycm9yKSB7XG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBlcnI/LnJlc3BvbnNlPy5kYXRhPy5tZXNzYWdlIHx8IGVyci5tZXNzYWdlO1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycj8ucmVzcG9uc2U/LmRhdGE/Lm1lc3NhZ2UgfHwgZXJyLm1lc3NhZ2UsIGVycik7XG4gICAgICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3VwbG9hZC1lcnJvcicsIHsgZGV0YWlsOiBlcnIgfSkpO1xuXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCh7IG1lc3NhZ2UsIHJlbW92ZTogdHJ1ZSB9KTtcbiAgICAgIH1cblxuICAgICAgdGhyb3cgZXJyO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCd1cGxvYWQtY29tcGxldGUnKSk7XG4gICAgICBzdGFjay5wb3AoKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVnaXN0ZXJEcmFnUGx1Z2luKHRpbnltY2U6IFRpbnlNQ0UpIHtcbiAgdGlueW1jZS5QbHVnaW5NYW5hZ2VyLmFkZCgndW5pY29ybmRyYWdkcm9wJywgZnVuY3Rpb24gKGVkaXRvcikge1xuICAgIC8vIFJlc2V0IHRoZSBkcm9wIGFyZWEgYm9yZGVyXG4gICAgdGlueW1jZS5ET00uYmluZChkb2N1bWVudCwgJ2RyYWdsZWF2ZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICBpZiAodGlueW1jZS5hY3RpdmVFZGl0b3IpIHtcbiAgICAgICAgdGlueW1jZS5hY3RpdmVFZGl0b3IuY29udGVudEFyZWFDb250YWluZXIuc3R5bGUudHJhbnNpdGlvbiA9ICdhbGwgLjNzJztcbiAgICAgICAgdGlueW1jZS5hY3RpdmVFZGl0b3IuY29udGVudEFyZWFDb250YWluZXIuc3R5bGUuYm9yZGVyV2lkdGggPSAnJztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuXG4gICAgaWYgKHR5cGVvZiBGb3JtRGF0YSAhPT0gJ3VuZGVmaW5lZCcpIHtcblxuICAgICAgLy8gRml4IGZvciBDaHJvbWVcbiAgICAgIGVkaXRvci5vbignZHJhZ2VudGVyJywgZSA9PiB7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBOb3RpZnkgdXNlciB3aGVuIGZpbGUgaXMgb3ZlciB0aGUgZHJvcCBhcmVhXG4gICAgICBlZGl0b3Iub24oJ2RyYWdvdmVyJywgZSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBpZiAodGlueW1jZS5hY3RpdmVFZGl0b3IpIHtcbiAgICAgICAgICB0aW55bWNlLmFjdGl2ZUVkaXRvci5jb250ZW50QXJlYUNvbnRhaW5lci5zdHlsZS50cmFuc2l0aW9uID0gJ2FsbCAuM3MnO1xuICAgICAgICAgIHRpbnltY2UuYWN0aXZlRWRpdG9yLmNvbnRlbnRBcmVhQ29udGFpbmVyLnN0eWxlLmJvcmRlciA9ICczcHggZGFzaGVkIHJnYmEoMCwgMCwgMCwgLjM1KSc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9KTtcblxuICAgICAgZWRpdG9yLm9uKCdkcm9wJywgZSA9PiB7XG4gICAgICAgIGVkaXRvci5jb250ZW50QXJlYUNvbnRhaW5lci5zdHlsZS5ib3JkZXJXaWR0aCA9ICcnO1xuICAgICAgICBlZGl0b3IuY29udGVudEFyZWFDb250YWluZXIuc3R5bGUuYm9yZGVyV2lkdGggPSAnJztcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFRpbnltY2VNb2R1bGUge1xuICBnZXQ6IHR5cGVvZiBnZXQ7XG4gIGRlc3Ryb3k6IHR5cGVvZiBkZXN0cm95O1xuICBhZGRIb29rOiB0eXBlb2YgYWRkSG9vaztcbiAgY2xlYXJIb29rczogdHlwZW9mIGNsZWFySG9va3M7XG4gIFRpbnltY2VDb250cm9sbGVyOiB0eXBlb2YgVGlueW1jZUNvbnRyb2xsZXI7XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU1BLE1BQU0sWUFBMkMsQ0FBQTtBQUNqRCxJQUFJLFFBQXFELENBQUE7QUFFekQsSUFBSSxXQUFXO0FBSWYsZUFBc0IsSUFDcEIsVUFDQSxVQUErQixJQUNIO0FBQzVCLFFBQU0sVUFBVSxNQUFNLFlBQUE7QUFFdEIsU0FBTyxVQUFVLFFBQVEsTUFBTSxJQUFJLGtCQUFrQixTQUFTLFNBQVMsY0FBYyxRQUFRLEdBQUksT0FBTztBQUMxRztBQUVPLFNBQVMsUUFBUSxVQUF3QjtBQUM5QyxTQUFPLFVBQVUsUUFBUTtBQUMzQjtBQUVPLFNBQVMsUUFBUSxTQUFvRDtBQUMxRSxRQUFNLEtBQUssT0FBTztBQUNwQjtBQUVPLFNBQVMsYUFBYTtBQUMzQixVQUFRLENBQUE7QUFDVjtBQUVBLGVBQWUsY0FBZ0M7QUFDN0MsTUFBSSxXQUFXLE1BQU0sVUFBVSxVQUFVLEdBQUc7QUFFNUMsTUFBSSxVQUFVO0FBQ1osV0FBTztBQUFBLEVBQ1Q7QUFDQSxhQUFXO0FBQ1gsYUFBVyxRQUFRLE9BQU87QUFDeEIsU0FBSyxPQUFPO0FBQUEsRUFDZDtBQUNBLFFBQU0sbUJBQW1CLE9BQU87QUFDaEMsU0FBTztBQUNUO0FB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
