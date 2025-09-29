import { a1 as mergeDeep, m as useStack, u as useHttpClient, a4 as useImport } from "./unicorn-G5leHO5V.js";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlueW1jZS1EcFdQZklEYi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21vZHVsZS90aW55bWNlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgRWRpdG9yLCBFZGl0b3JPcHRpb25zLCBUaW55TUNFIH0gZnJvbSAndGlueW1jZSc7XHJcbmltcG9ydCB7IHVzZUh0dHBDbGllbnQsIHVzZVN0YWNrIH0gZnJvbSAnLi4vY29tcG9zYWJsZSc7XHJcbmltcG9ydCB7IHVzZUltcG9ydCB9IGZyb20gJy4uL3NlcnZpY2UnO1xyXG5pbXBvcnQgeyBEaWN0aW9uYXJ5LCBNYXliZVByb21pc2UgfSBmcm9tICcuLi90eXBlcyc7XHJcbmltcG9ydCB7IG1lcmdlRGVlcCB9IGZyb20gJy4uL3V0aWxpdGllcyc7XHJcblxyXG5jb25zdCBpbnN0YW5jZXM6IERpY3Rpb25hcnk8VGlueW1jZUNvbnRyb2xsZXI+ID0ge307XHJcbmxldCBob29rczogKCh0aW55bWNlOiBUaW55TUNFKSA9PiBNYXliZVByb21pc2U8YW55PilbXSA9IFtdO1xyXG5cclxubGV0IGltcG9ydGVkID0gZmFsc2U7XHJcblxyXG5kZWNsYXJlIHR5cGUgVXBsb2FkSGFuZGxlclBhcmFtcyA9IFBhcmFtZXRlcnM8Tm9uTnVsbGFibGU8RWRpdG9yT3B0aW9uc1snaW1hZ2VzX3VwbG9hZF9oYW5kbGVyJ10+PjtcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXQoXHJcbiAgc2VsZWN0b3I6IHN0cmluZyxcclxuICBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge31cclxuKTogUHJvbWlzZTxUaW55bWNlQ29udHJvbGxlcj4ge1xyXG4gIGNvbnN0IHRpbnltY2UgPSBhd2FpdCBsb2FkVGlueW1jZSgpO1xyXG5cclxuICByZXR1cm4gaW5zdGFuY2VzW3NlbGVjdG9yXSA/Pz0gbmV3IFRpbnltY2VDb250cm9sbGVyKHRpbnltY2UsIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpISwgb3B0aW9ucyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkZXN0cm95KHNlbGVjdG9yOiBzdHJpbmcpOiB2b2lkIHtcclxuICBkZWxldGUgaW5zdGFuY2VzW3NlbGVjdG9yXTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFkZEhvb2soaGFuZGxlcjogKCh0aW55bWNlOiBUaW55TUNFKSA9PiBNYXliZVByb21pc2U8YW55PikpIHtcclxuICBob29rcy5wdXNoKGhhbmRsZXIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2xlYXJIb29rcygpIHtcclxuICBob29rcyA9IFtdO1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBsb2FkVGlueW1jZSgpOiBQcm9taXNlPFRpbnlNQ0U+IHtcclxuICBsZXQgdGlueW1jZSA9IChhd2FpdCB1c2VJbXBvcnQoJ0B0aW55bWNlJykpLmRlZmF1bHQ7XHJcblxyXG4gIGlmIChpbXBvcnRlZCkge1xyXG4gICAgcmV0dXJuIHRpbnltY2U7XHJcbiAgfVxyXG4gIGltcG9ydGVkID0gdHJ1ZTtcclxuICBmb3IgKGNvbnN0IGhvb2sgb2YgaG9va3MpIHtcclxuICAgIGhvb2sodGlueW1jZSk7XHJcbiAgfVxyXG4gIGF3YWl0IHJlZ2lzdGVyRHJhZ1BsdWdpbih0aW55bWNlKTtcclxuICByZXR1cm4gdGlueW1jZTtcclxufVxyXG5cclxuY29uc3QgZGVmYXVsdE9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcclxuXHJcbmV4cG9ydCBjbGFzcyBUaW55bWNlQ29udHJvbGxlciB7XHJcbiAgZWRpdG9yPzogRWRpdG9yO1xyXG4gIG9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcclxuXHJcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHRpbnltY2U6IFRpbnlNQ0UsIHB1YmxpYyBlbGVtZW50OiBIVE1MRWxlbWVudCwgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55Pikge1xyXG4gICAgb3B0aW9ucy50YXJnZXQgPSBlbGVtZW50O1xyXG5cclxuICAgIHRoaXMub3B0aW9ucyA9IG1lcmdlRGVlcChcclxuICAgICAge1xyXG4gICAgICAgIHVuaWNvcm46IHtcclxuICAgICAgICAgIHN0YWNrX25hbWU6ICd1cGxvYWRpbmcnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBkZWZhdWx0T3B0aW9ucyxcclxuICAgICAgdGhpcy5wcmVwYXJlT3B0aW9ucyhvcHRpb25zLCB0aW55bWNlLm1ham9yVmVyc2lvbiksXHJcbiAgICApO1xyXG5cclxuICAgIHRpbnltY2UuRWRpdG9yTWFuYWdlci5pbml0KHRoaXMub3B0aW9ucykudGhlbigoZWRpdG9yKSA9PiB7XHJcbiAgICAgIHRoaXMuZWRpdG9yID0gZWRpdG9yWzBdO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcmVwYXJlT3B0aW9ucyhvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+LCB2ZXJzaW9uID0gJzYnKSB7XHJcbiAgICBjb25zdCBkZWZhdWx0czogUGFydGlhbDxFZGl0b3JPcHRpb25zPiA9IHt9O1xyXG5cclxuICAgIGlmIChvcHRpb25zLmltYWdlc191cGxvYWRfdXJsKSB7XHJcbiAgICAgIGRlZmF1bHRzLnBhc3RlX2RhdGFfaW1hZ2VzID0gdHJ1ZTtcclxuICAgICAgZGVmYXVsdHMucmVtb3ZlX3NjcmlwdF9ob3N0ID0gZmFsc2U7XHJcbiAgICAgIGRlZmF1bHRzLnJlbGF0aXZlX3VybHMgPSBmYWxzZTtcclxuXHJcbiAgICAgIGlmIChOdW1iZXIodmVyc2lvbikgPj0gNikge1xyXG4gICAgICAgIGRlZmF1bHRzLmltYWdlc191cGxvYWRfaGFuZGxlciA9IChibG9iSW5mbywgcHJvZ3Jlc3MpID0+XHJcbiAgICAgICAgICB0aGlzLmltYWdlVXBsb2FkSGFuZGxlcihibG9iSW5mbywgcHJvZ3Jlc3MpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG9wdGlvbnMucGx1Z2lucy5wdXNoKCdwYXN0ZScpO1xyXG5cclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgZGVmYXVsdHMuaW1hZ2VzX3VwbG9hZF9oYW5kbGVyID0gKGJsb2JJbmZvLCBzdWNjZXNzLCBmYWlsdXJlLCBwcm9ncmVzcykgPT5cclxuICAgICAgICAgIHRoaXMuaW1hZ2VVcGxvYWRIYW5kbGVyKGJsb2JJbmZvLCBwcm9ncmVzcylcclxuICAgICAgICAgICAgLnRoZW4oKHVybCkgPT4ge1xyXG4gICAgICAgICAgICAgIHN1Y2Nlc3ModXJsKTtcclxuICAgICAgICAgICAgICByZXR1cm4gdXJsO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goKGUpID0+IHtcclxuICAgICAgICAgICAgICBmYWlsdXJlKGUubWVzc2FnZSwgeyByZW1vdmU6IHRydWUgfSk7XHJcbiAgICAgICAgICAgICAgdGhyb3cgZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBkZWZhdWx0cy5maWxlX3BpY2tlcl9jYWxsYmFjayA9ICguLi5hcmdzKSA9PiB0aGlzLmZpbGVQaWNrZXJDYWxsYmFjayguLi5hcmdzKTtcclxuXHJcbiAgICBkZWZhdWx0cy5wbHVnaW5zID0gZGVmYXVsdHMucGx1Z2lucyB8fCBbXTtcclxuXHJcbiAgICBkZWZhdWx0cy5zZXR1cCA9IChlZGl0b3IpID0+IHtcclxuICAgICAgZWRpdG9yLm9uKCdjaGFuZ2UnLCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy50aW55bWNlLnRyaWdnZXJTYXZlKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBvcHRpb25zID0gbWVyZ2VEZWVwKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XHJcblxyXG4gICAgaWYgKG9wdGlvbnMucGx1Z2lucy5pbmRleE9mKCd1bmljb3JuZHJhZ2Ryb3AnKSA9PT0gLTEpIHtcclxuICAgICAgb3B0aW9ucy5wbHVnaW5zLnB1c2goJ3VuaWNvcm5kcmFnZHJvcCcpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvcHRpb25zO1xyXG4gIH1cclxuXHJcbiAgaW5zZXJ0KHRleHQ6IHN0cmluZykge1xyXG4gICAgdGhpcy5lZGl0b3I/Lmluc2VydENvbnRlbnQodGV4dCk7XHJcbiAgfVxyXG5cclxuICBnZXRWYWx1ZSgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuZWRpdG9yPy5nZXRDb250ZW50KCkgPz8gJyc7XHJcbiAgfVxyXG5cclxuICBzZXRWYWx1ZSh0ZXh0OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIHRoaXMuZWRpdG9yPy5zZXRDb250ZW50KHRleHQpO1xyXG4gIH1cclxuXHJcbiAgLy8gZmlsZVBpY2tlckNhbGxiYWNrKGNhbGxiYWNrLCB2YWx1ZSwgbWV0YSkge1xyXG4gIC8vICAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xyXG4gIC8vICAgaW5wdXQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ2ZpbGUnKTtcclxuICAvLyAgIGlucHV0LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgLy9cclxuICAvLyAgIGlmIChtZXRhLmZpbGV0eXBlID09PSAnaW1hZ2UnKSB7XHJcbiAgLy8gICAgIGlucHV0LnNldEF0dHJpYnV0ZSgnYWNjZXB0JywgYGltYWdlL1xcKmApO1xyXG4gIC8vICAgfVxyXG4gIC8vXHJcbiAgLy8gICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGlucHV0KTtcclxuICAvL1xyXG4gIC8vICAgaW5wdXQub25jaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgLy8gICAgIGNvbnN0IGZpbGUgPSB0aGlzLmZpbGVzWzBdO1xyXG4gIC8vXHJcbiAgLy8gICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgLy8gICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgLy8gICAgICAgY29uc3QgaWQgPSAnYmxvYmlkJyArIChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XHJcbiAgLy8gICAgICAgY29uc3QgYmxvYkNhY2hlID0gIHRpbnltY2UuYWN0aXZlRWRpdG9yLmVkaXRvclVwbG9hZC5ibG9iQ2FjaGU7XHJcbiAgLy8gICAgICAgY29uc3QgYmFzZTY0ID0gcmVhZGVyLnJlc3VsdC5zcGxpdCgnLCcpWzFdO1xyXG4gIC8vICAgICAgIGNvbnN0IGJsb2JJbmZvID0gYmxvYkNhY2hlLmNyZWF0ZShpZCwgZmlsZSwgYmFzZTY0KTtcclxuICAvLyAgICAgICBibG9iQ2FjaGUuYWRkKGJsb2JJbmZvKTtcclxuICAvL1xyXG4gIC8vICAgICAgIC8qIGNhbGwgdGhlIGNhbGxiYWNrIGFuZCBwb3B1bGF0ZSB0aGUgVGl0bGUgZmllbGQgd2l0aCB0aGUgZmlsZSBuYW1lICovXHJcbiAgLy8gICAgICAgY2FsbGJhY2soYmxvYkluZm8uYmxvYlVyaSgpLCB7IHRpdGxlOiBmaWxlLm5hbWUsIHRleHQ6IGZpbGUubmFtZSB9KTtcclxuICAvLyAgICAgfTtcclxuICAvLyAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7XHJcbiAgLy8gICAgIGlucHV0LnJlbW92ZSgpO1xyXG4gIC8vICAgfTtcclxuICAvL1xyXG4gIC8vICAgaW5wdXQuY2xpY2soKTtcclxuICAvLyB9XHJcblxyXG4gIGFzeW5jIGltYWdlVXBsb2FkSGFuZGxlcihibG9iSW5mbzogVXBsb2FkSGFuZGxlclBhcmFtc1swXSwgcHJvZ3Jlc3M6IFVwbG9hZEhhbmRsZXJQYXJhbXNbMV0pIHtcclxuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmVsZW1lbnQ7XHJcblxyXG4gICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgndXBsb2FkLXN0YXJ0JykpO1xyXG5cclxuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XHJcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZpbGUnLCBibG9iSW5mby5ibG9iKCksIGJsb2JJbmZvLmZpbGVuYW1lKCkpO1xyXG5cclxuICAgIGNvbnN0IHN0YWNrID0gdXNlU3RhY2sodGhpcy5vcHRpb25zLnVuaWNvcm4uc3RhY2tfbmFtZSk7XHJcbiAgICBzdGFjay5wdXNoKHRydWUpO1xyXG5cclxuICAgIGNvbnN0IGh0dHAgPSBhd2FpdCB1c2VIdHRwQ2xpZW50KCk7XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IHJlcyA9IGF3YWl0IGh0dHAucG9zdChcclxuICAgICAgICB0aGlzLm9wdGlvbnMuaW1hZ2VzX3VwbG9hZF91cmwsXHJcbiAgICAgICAgZm9ybURhdGEsXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgd2l0aENyZWRlbnRpYWxzOiBmYWxzZSxcclxuICAgICAgICAgIG9uVXBsb2FkUHJvZ3Jlc3M6IChlKSA9PiB7XHJcbiAgICAgICAgICAgIHByb2dyZXNzKGUubG9hZGVkIC8gZS50b3RhbCEgKiAxMDApO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgKTtcclxuICAgICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgndXBsb2FkLXN1Y2Nlc3MnKSk7XHJcblxyXG4gICAgICByZXR1cm4gcmVzLmRhdGEuZGF0YS51cmw7XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgY29uc3QgQXhpb3NFcnJvciA9IGF3YWl0IGh0dHAuZXJyb3JDbGFzcygpO1xyXG5cclxuICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIEF4aW9zRXJyb3IpIHtcclxuICAgICAgICBjb25zdCBtZXNzYWdlID0gZXJyPy5yZXNwb25zZT8uZGF0YT8ubWVzc2FnZSB8fCBlcnIubWVzc2FnZTtcclxuICAgICAgICBjb25zb2xlLmVycm9yKGVycj8ucmVzcG9uc2U/LmRhdGE/Lm1lc3NhZ2UgfHwgZXJyLm1lc3NhZ2UsIGVycik7XHJcbiAgICAgICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgndXBsb2FkLWVycm9yJywgeyBkZXRhaWw6IGVyciB9KSk7XHJcblxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCh7IG1lc3NhZ2UsIHJlbW92ZTogdHJ1ZSB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhyb3cgZXJyO1xyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgndXBsb2FkLWNvbXBsZXRlJykpO1xyXG4gICAgICBzdGFjay5wb3AoKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlZ2lzdGVyRHJhZ1BsdWdpbih0aW55bWNlOiBUaW55TUNFKSB7XHJcbiAgdGlueW1jZS5QbHVnaW5NYW5hZ2VyLmFkZCgndW5pY29ybmRyYWdkcm9wJywgZnVuY3Rpb24gKGVkaXRvcikge1xyXG4gICAgLy8gUmVzZXQgdGhlIGRyb3AgYXJlYSBib3JkZXJcclxuICAgIHRpbnltY2UuRE9NLmJpbmQoZG9jdW1lbnQsICdkcmFnbGVhdmUnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICBpZiAodGlueW1jZS5hY3RpdmVFZGl0b3IpIHtcclxuICAgICAgICB0aW55bWNlLmFjdGl2ZUVkaXRvci5jb250ZW50QXJlYUNvbnRhaW5lci5zdHlsZS50cmFuc2l0aW9uID0gJ2FsbCAuM3MnO1xyXG4gICAgICAgIHRpbnltY2UuYWN0aXZlRWRpdG9yLmNvbnRlbnRBcmVhQ29udGFpbmVyLnN0eWxlLmJvcmRlcldpZHRoID0gJyc7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0pO1xyXG5cclxuICAgIGlmICh0eXBlb2YgRm9ybURhdGEgIT09ICd1bmRlZmluZWQnKSB7XHJcblxyXG4gICAgICAvLyBGaXggZm9yIENocm9tZVxyXG4gICAgICBlZGl0b3Iub24oJ2RyYWdlbnRlcicsIGUgPT4ge1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIC8vIE5vdGlmeSB1c2VyIHdoZW4gZmlsZSBpcyBvdmVyIHRoZSBkcm9wIGFyZWFcclxuICAgICAgZWRpdG9yLm9uKCdkcmFnb3ZlcicsIGUgPT4ge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgaWYgKHRpbnltY2UuYWN0aXZlRWRpdG9yKSB7XHJcbiAgICAgICAgICB0aW55bWNlLmFjdGl2ZUVkaXRvci5jb250ZW50QXJlYUNvbnRhaW5lci5zdHlsZS50cmFuc2l0aW9uID0gJ2FsbCAuM3MnO1xyXG4gICAgICAgICAgdGlueW1jZS5hY3RpdmVFZGl0b3IuY29udGVudEFyZWFDb250YWluZXIuc3R5bGUuYm9yZGVyID0gJzNweCBkYXNoZWQgcmdiYSgwLCAwLCAwLCAuMzUpJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBlZGl0b3Iub24oJ2Ryb3AnLCBlID0+IHtcclxuICAgICAgICBlZGl0b3IuY29udGVudEFyZWFDb250YWluZXIuc3R5bGUuYm9yZGVyV2lkdGggPSAnJztcclxuICAgICAgICBlZGl0b3IuY29udGVudEFyZWFDb250YWluZXIuc3R5bGUuYm9yZGVyV2lkdGggPSAnJztcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBUaW55bWNlTW9kdWxlIHtcclxuICBnZXQ6IHR5cGVvZiBnZXQ7XHJcbiAgZGVzdHJveTogdHlwZW9mIGRlc3Ryb3k7XHJcbiAgYWRkSG9vazogdHlwZW9mIGFkZEhvb2s7XHJcbiAgY2xlYXJIb29rczogdHlwZW9mIGNsZWFySG9va3M7XHJcbiAgVGlueW1jZUNvbnRyb2xsZXI6IHR5cGVvZiBUaW55bWNlQ29udHJvbGxlcjtcclxufVxyXG4iXSwibmFtZXMiOltd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
