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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlueW1jZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL21vZHVsZS90aW55bWNlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgRWRpdG9yLCBFZGl0b3JPcHRpb25zLCBUaW55TUNFIH0gZnJvbSAndGlueW1jZSc7XHJcbmltcG9ydCB7IHVzZUh0dHBDbGllbnQsIHVzZVN0YWNrIH0gZnJvbSAnLi4vY29tcG9zYWJsZSc7XHJcbmltcG9ydCB7IHVzZUltcG9ydCB9IGZyb20gJy4uL3NlcnZpY2UnO1xyXG5pbXBvcnQgeyBEaWN0aW9uYXJ5LCBNYXliZVByb21pc2UgfSBmcm9tICcuLi90eXBlcyc7XHJcbmltcG9ydCB7IG1lcmdlRGVlcCB9IGZyb20gJy4uL3V0aWxpdGllcyc7XHJcblxyXG5jb25zdCBpbnN0YW5jZXM6IERpY3Rpb25hcnk8VGlueW1jZUNvbnRyb2xsZXI+ID0ge307XHJcbmxldCBob29rczogKCh0aW55bWNlOiBUaW55TUNFKSA9PiBNYXliZVByb21pc2U8YW55PilbXSA9IFtdO1xyXG5cclxubGV0IGltcG9ydGVkID0gZmFsc2U7XHJcblxyXG5kZWNsYXJlIHR5cGUgVXBsb2FkSGFuZGxlclBhcmFtcyA9IFBhcmFtZXRlcnM8Tm9uTnVsbGFibGU8RWRpdG9yT3B0aW9uc1snaW1hZ2VzX3VwbG9hZF9oYW5kbGVyJ10+PjtcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXQoXHJcbiAgc2VsZWN0b3I6IHN0cmluZyxcclxuICBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge31cclxuKTogUHJvbWlzZTxUaW55bWNlQ29udHJvbGxlcj4ge1xyXG4gIGNvbnN0IHRpbnltY2UgPSBhd2FpdCBsb2FkVGlueW1jZSgpO1xyXG5cclxuICByZXR1cm4gaW5zdGFuY2VzW3NlbGVjdG9yXSA/Pz0gbmV3IFRpbnltY2VDb250cm9sbGVyKHRpbnltY2UsIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpISwgb3B0aW9ucyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkZXN0cm95KHNlbGVjdG9yOiBzdHJpbmcpOiB2b2lkIHtcclxuICBkZWxldGUgaW5zdGFuY2VzW3NlbGVjdG9yXTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFkZEhvb2soaGFuZGxlcjogKCh0aW55bWNlOiBUaW55TUNFKSA9PiBNYXliZVByb21pc2U8YW55PikpIHtcclxuICBob29rcy5wdXNoKGhhbmRsZXIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2xlYXJIb29rcygpIHtcclxuICBob29rcyA9IFtdO1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBsb2FkVGlueW1jZSgpOiBQcm9taXNlPFRpbnlNQ0U+IHtcclxuICBhd2FpdCB1c2VJbXBvcnQoJ0B0aW55bWNlJyk7XHJcblxyXG4gIGlmIChpbXBvcnRlZCkge1xyXG4gICAgcmV0dXJuIHRpbnltY2U7XHJcbiAgfVxyXG4gIGltcG9ydGVkID0gdHJ1ZTtcclxuICBmb3IgKGNvbnN0IGhvb2sgb2YgaG9va3MpIHtcclxuICAgIGhvb2sodGlueW1jZSk7XHJcbiAgfVxyXG4gIGF3YWl0IHJlZ2lzdGVyRHJhZ1BsdWdpbih0aW55bWNlKTtcclxuICByZXR1cm4gdGlueW1jZTtcclxufVxyXG5cclxuY29uc3QgZGVmYXVsdE9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcclxuXHJcbmV4cG9ydCBjbGFzcyBUaW55bWNlQ29udHJvbGxlciB7XHJcbiAgZWRpdG9yPzogRWRpdG9yO1xyXG4gIG9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcclxuXHJcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHRpbnltY2U6IFRpbnlNQ0UsIHB1YmxpYyBlbGVtZW50OiBIVE1MRWxlbWVudCwgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55Pikge1xyXG4gICAgb3B0aW9ucy50YXJnZXQgPSBlbGVtZW50O1xyXG5cclxuICAgIHRoaXMub3B0aW9ucyA9IG1lcmdlRGVlcChcclxuICAgICAge1xyXG4gICAgICAgIHVuaWNvcm46IHtcclxuICAgICAgICAgIHN0YWNrX25hbWU6ICd1cGxvYWRpbmcnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBkZWZhdWx0T3B0aW9ucyxcclxuICAgICAgdGhpcy5wcmVwYXJlT3B0aW9ucyhvcHRpb25zLCB0aW55bWNlLm1ham9yVmVyc2lvbiksXHJcbiAgICApO1xyXG5cclxuICAgIHRpbnltY2UuRWRpdG9yTWFuYWdlci5pbml0KHRoaXMub3B0aW9ucykudGhlbigoZWRpdG9yKSA9PiB7XHJcbiAgICAgIHRoaXMuZWRpdG9yID0gZWRpdG9yWzBdO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcmVwYXJlT3B0aW9ucyhvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+LCB2ZXJzaW9uID0gJzYnKSB7XHJcbiAgICBjb25zdCBkZWZhdWx0czogUGFydGlhbDxFZGl0b3JPcHRpb25zPiA9IHt9O1xyXG5cclxuICAgIGlmIChvcHRpb25zLmltYWdlc191cGxvYWRfdXJsKSB7XHJcbiAgICAgIGRlZmF1bHRzLnBhc3RlX2RhdGFfaW1hZ2VzID0gdHJ1ZTtcclxuICAgICAgZGVmYXVsdHMucmVtb3ZlX3NjcmlwdF9ob3N0ID0gZmFsc2U7XHJcbiAgICAgIGRlZmF1bHRzLnJlbGF0aXZlX3VybHMgPSBmYWxzZTtcclxuXHJcbiAgICAgIGlmIChOdW1iZXIodmVyc2lvbikgPj0gNikge1xyXG4gICAgICAgIGRlZmF1bHRzLmltYWdlc191cGxvYWRfaGFuZGxlciA9IChibG9iSW5mbywgcHJvZ3Jlc3MpID0+XHJcbiAgICAgICAgICB0aGlzLmltYWdlVXBsb2FkSGFuZGxlcihibG9iSW5mbywgcHJvZ3Jlc3MpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG9wdGlvbnMucGx1Z2lucy5wdXNoKCdwYXN0ZScpO1xyXG5cclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgZGVmYXVsdHMuaW1hZ2VzX3VwbG9hZF9oYW5kbGVyID0gKGJsb2JJbmZvLCBzdWNjZXNzLCBmYWlsdXJlLCBwcm9ncmVzcykgPT5cclxuICAgICAgICAgIHRoaXMuaW1hZ2VVcGxvYWRIYW5kbGVyKGJsb2JJbmZvLCBwcm9ncmVzcylcclxuICAgICAgICAgICAgLnRoZW4oKHVybCkgPT4ge1xyXG4gICAgICAgICAgICAgIHN1Y2Nlc3ModXJsKTtcclxuICAgICAgICAgICAgICByZXR1cm4gdXJsO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goKGUpID0+IHtcclxuICAgICAgICAgICAgICBmYWlsdXJlKGUubWVzc2FnZSwgeyByZW1vdmU6IHRydWUgfSk7XHJcbiAgICAgICAgICAgICAgdGhyb3cgZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBkZWZhdWx0cy5maWxlX3BpY2tlcl9jYWxsYmFjayA9ICguLi5hcmdzKSA9PiB0aGlzLmZpbGVQaWNrZXJDYWxsYmFjayguLi5hcmdzKTtcclxuXHJcbiAgICBkZWZhdWx0cy5wbHVnaW5zID0gZGVmYXVsdHMucGx1Z2lucyB8fCBbXTtcclxuXHJcbiAgICBkZWZhdWx0cy5zZXR1cCA9IChlZGl0b3IpID0+IHtcclxuICAgICAgZWRpdG9yLm9uKCdjaGFuZ2UnLCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy50aW55bWNlLnRyaWdnZXJTYXZlKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBvcHRpb25zID0gbWVyZ2VEZWVwKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XHJcblxyXG4gICAgaWYgKG9wdGlvbnMucGx1Z2lucy5pbmRleE9mKCd1bmljb3JuZHJhZ2Ryb3AnKSA9PT0gLTEpIHtcclxuICAgICAgb3B0aW9ucy5wbHVnaW5zLnB1c2goJ3VuaWNvcm5kcmFnZHJvcCcpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvcHRpb25zO1xyXG4gIH1cclxuXHJcbiAgaW5zZXJ0KHRleHQ6IHN0cmluZykge1xyXG4gICAgdGhpcy5lZGl0b3I/Lmluc2VydENvbnRlbnQodGV4dCk7XHJcbiAgfVxyXG5cclxuICBnZXRWYWx1ZSgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuZWRpdG9yPy5nZXRDb250ZW50KCkgPz8gJyc7XHJcbiAgfVxyXG5cclxuICBzZXRWYWx1ZSh0ZXh0OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIHRoaXMuZWRpdG9yPy5zZXRDb250ZW50KHRleHQpO1xyXG4gIH1cclxuXHJcbiAgLy8gZmlsZVBpY2tlckNhbGxiYWNrKGNhbGxiYWNrLCB2YWx1ZSwgbWV0YSkge1xyXG4gIC8vICAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xyXG4gIC8vICAgaW5wdXQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ2ZpbGUnKTtcclxuICAvLyAgIGlucHV0LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgLy9cclxuICAvLyAgIGlmIChtZXRhLmZpbGV0eXBlID09PSAnaW1hZ2UnKSB7XHJcbiAgLy8gICAgIGlucHV0LnNldEF0dHJpYnV0ZSgnYWNjZXB0JywgYGltYWdlL1xcKmApO1xyXG4gIC8vICAgfVxyXG4gIC8vXHJcbiAgLy8gICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGlucHV0KTtcclxuICAvL1xyXG4gIC8vICAgaW5wdXQub25jaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgLy8gICAgIGNvbnN0IGZpbGUgPSB0aGlzLmZpbGVzWzBdO1xyXG4gIC8vXHJcbiAgLy8gICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgLy8gICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgLy8gICAgICAgY29uc3QgaWQgPSAnYmxvYmlkJyArIChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XHJcbiAgLy8gICAgICAgY29uc3QgYmxvYkNhY2hlID0gIHRpbnltY2UuYWN0aXZlRWRpdG9yLmVkaXRvclVwbG9hZC5ibG9iQ2FjaGU7XHJcbiAgLy8gICAgICAgY29uc3QgYmFzZTY0ID0gcmVhZGVyLnJlc3VsdC5zcGxpdCgnLCcpWzFdO1xyXG4gIC8vICAgICAgIGNvbnN0IGJsb2JJbmZvID0gYmxvYkNhY2hlLmNyZWF0ZShpZCwgZmlsZSwgYmFzZTY0KTtcclxuICAvLyAgICAgICBibG9iQ2FjaGUuYWRkKGJsb2JJbmZvKTtcclxuICAvL1xyXG4gIC8vICAgICAgIC8qIGNhbGwgdGhlIGNhbGxiYWNrIGFuZCBwb3B1bGF0ZSB0aGUgVGl0bGUgZmllbGQgd2l0aCB0aGUgZmlsZSBuYW1lICovXHJcbiAgLy8gICAgICAgY2FsbGJhY2soYmxvYkluZm8uYmxvYlVyaSgpLCB7IHRpdGxlOiBmaWxlLm5hbWUsIHRleHQ6IGZpbGUubmFtZSB9KTtcclxuICAvLyAgICAgfTtcclxuICAvLyAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7XHJcbiAgLy8gICAgIGlucHV0LnJlbW92ZSgpO1xyXG4gIC8vICAgfTtcclxuICAvL1xyXG4gIC8vICAgaW5wdXQuY2xpY2soKTtcclxuICAvLyB9XHJcblxyXG4gIGFzeW5jIGltYWdlVXBsb2FkSGFuZGxlcihibG9iSW5mbzogVXBsb2FkSGFuZGxlclBhcmFtc1swXSwgcHJvZ3Jlc3M6IFVwbG9hZEhhbmRsZXJQYXJhbXNbMV0pIHtcclxuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmVsZW1lbnQ7XHJcblxyXG4gICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgndXBsb2FkLXN0YXJ0JykpO1xyXG5cclxuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XHJcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZpbGUnLCBibG9iSW5mby5ibG9iKCksIGJsb2JJbmZvLmZpbGVuYW1lKCkpO1xyXG5cclxuICAgIGNvbnN0IHN0YWNrID0gdXNlU3RhY2sodGhpcy5vcHRpb25zLnVuaWNvcm4uc3RhY2tfbmFtZSk7XHJcbiAgICBzdGFjay5wdXNoKHRydWUpO1xyXG5cclxuICAgIGNvbnN0IGh0dHAgPSBhd2FpdCB1c2VIdHRwQ2xpZW50KCk7XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IHJlcyA9IGF3YWl0IGh0dHAucG9zdChcclxuICAgICAgICB0aGlzLm9wdGlvbnMuaW1hZ2VzX3VwbG9hZF91cmwsXHJcbiAgICAgICAgZm9ybURhdGEsXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgd2l0aENyZWRlbnRpYWxzOiBmYWxzZSxcclxuICAgICAgICAgIG9uVXBsb2FkUHJvZ3Jlc3M6IChlKSA9PiB7XHJcbiAgICAgICAgICAgIHByb2dyZXNzKGUubG9hZGVkIC8gZS50b3RhbCEgKiAxMDApO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgKTtcclxuICAgICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgndXBsb2FkLXN1Y2Nlc3MnKSk7XHJcblxyXG4gICAgICByZXR1cm4gcmVzLmRhdGEuZGF0YS51cmw7XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgY29uc3QgQXhpb3NFcnJvciA9IGF3YWl0IGh0dHAuZXJyb3JDbGFzcygpO1xyXG5cclxuICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIEF4aW9zRXJyb3IpIHtcclxuICAgICAgICBjb25zdCBtZXNzYWdlID0gZXJyPy5yZXNwb25zZT8uZGF0YT8ubWVzc2FnZSB8fCBlcnIubWVzc2FnZTtcclxuICAgICAgICBjb25zb2xlLmVycm9yKGVycj8ucmVzcG9uc2U/LmRhdGE/Lm1lc3NhZ2UgfHwgZXJyLm1lc3NhZ2UsIGVycik7XHJcbiAgICAgICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgndXBsb2FkLWVycm9yJywgeyBkZXRhaWw6IGVyciB9KSk7XHJcblxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCh7IG1lc3NhZ2UsIHJlbW92ZTogdHJ1ZSB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhyb3cgZXJyO1xyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgndXBsb2FkLWNvbXBsZXRlJykpO1xyXG4gICAgICBzdGFjay5wb3AoKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlZ2lzdGVyRHJhZ1BsdWdpbih0aW55bWNlOiBUaW55TUNFKSB7XHJcbiAgdGlueW1jZS5QbHVnaW5NYW5hZ2VyLmFkZCgndW5pY29ybmRyYWdkcm9wJywgZnVuY3Rpb24gKGVkaXRvcikge1xyXG4gICAgLy8gUmVzZXQgdGhlIGRyb3AgYXJlYSBib3JkZXJcclxuICAgIHRpbnltY2UuRE9NLmJpbmQoZG9jdW1lbnQsICdkcmFnbGVhdmUnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICBpZiAodGlueW1jZS5hY3RpdmVFZGl0b3IpIHtcclxuICAgICAgICB0aW55bWNlLmFjdGl2ZUVkaXRvci5jb250ZW50QXJlYUNvbnRhaW5lci5zdHlsZS50cmFuc2l0aW9uID0gJ2FsbCAuM3MnO1xyXG4gICAgICAgIHRpbnltY2UuYWN0aXZlRWRpdG9yLmNvbnRlbnRBcmVhQ29udGFpbmVyLnN0eWxlLmJvcmRlcldpZHRoID0gJyc7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0pO1xyXG5cclxuICAgIGlmICh0eXBlb2YgRm9ybURhdGEgIT09ICd1bmRlZmluZWQnKSB7XHJcblxyXG4gICAgICAvLyBGaXggZm9yIENocm9tZVxyXG4gICAgICBlZGl0b3Iub24oJ2RyYWdlbnRlcicsIGUgPT4ge1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIC8vIE5vdGlmeSB1c2VyIHdoZW4gZmlsZSBpcyBvdmVyIHRoZSBkcm9wIGFyZWFcclxuICAgICAgZWRpdG9yLm9uKCdkcmFnb3ZlcicsIGUgPT4ge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgaWYgKHRpbnltY2UuYWN0aXZlRWRpdG9yKSB7XHJcbiAgICAgICAgICB0aW55bWNlLmFjdGl2ZUVkaXRvci5jb250ZW50QXJlYUNvbnRhaW5lci5zdHlsZS50cmFuc2l0aW9uID0gJ2FsbCAuM3MnO1xyXG4gICAgICAgICAgdGlueW1jZS5hY3RpdmVFZGl0b3IuY29udGVudEFyZWFDb250YWluZXIuc3R5bGUuYm9yZGVyID0gJzNweCBkYXNoZWQgcmdiYSgwLCAwLCAwLCAuMzUpJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBlZGl0b3Iub24oJ2Ryb3AnLCBlID0+IHtcclxuICAgICAgICBlZGl0b3IuY29udGVudEFyZWFDb250YWluZXIuc3R5bGUuYm9yZGVyV2lkdGggPSAnJztcclxuICAgICAgICBlZGl0b3IuY29udGVudEFyZWFDb250YWluZXIuc3R5bGUuYm9yZGVyV2lkdGggPSAnJztcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBUaW55bWNlTW9kdWxlIHtcclxuICBnZXQ6IHR5cGVvZiBnZXQ7XHJcbiAgZGVzdHJveTogdHlwZW9mIGRlc3Ryb3k7XHJcbiAgYWRkSG9vazogdHlwZW9mIGFkZEhvb2s7XHJcbiAgY2xlYXJIb29rczogdHlwZW9mIGNsZWFySG9va3M7XHJcbiAgVGlueW1jZUNvbnRyb2xsZXI6IHR5cGVvZiBUaW55bWNlQ29udHJvbGxlcjtcclxufVxyXG5cclxuZGVjbGFyZSBnbG9iYWwge1xyXG4gIHZhciB0aW55bWNlOiBUaW55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
