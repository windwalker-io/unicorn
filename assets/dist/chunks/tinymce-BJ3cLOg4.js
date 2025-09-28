import { g as useImport, m as mergeDeep, G as useStack, q as useHttpClient } from "./unicorn-D5cXQeSK.js";
const instances = {};
let hooks = [];
let imported = false;
async function get(selector, options = {}) {
  await loadTinymce();
  return instances[selector] ??= new TinymceController(document.querySelector(selector), options);
}
async function loadTinymce() {
  let tinymce2 = (await useImport("@tinymce")).default;
  if (imported) {
    return tinymce2;
  }
  imported = true;
  for (const hook of hooks) {
    hook(tinymce2);
  }
  await registerDragPlugin();
  return tinymce2;
}
const defaultOptions = {};
class TinymceController {
  constructor(element, options) {
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
        tinymce.triggerSave();
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
function registerDragPlugin() {
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
  get
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlueW1jZS1CSjNjTE9nNC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21vZHVsZS90aW55bWNlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgRWRpdG9yLCBFZGl0b3JPcHRpb25zLCBUaW55TUNFIH0gZnJvbSAndGlueW1jZSc7XG5pbXBvcnQgeyB1c2VIdHRwQ2xpZW50LCB1c2VTdGFjayB9IGZyb20gJy4uL2NvbXBvc2FibGUnO1xuaW1wb3J0IHsgdXNlSW1wb3J0IH0gZnJvbSAnLi4vc2VydmljZSc7XG5pbXBvcnQgeyBEaWN0aW9uYXJ5LCBNYXliZVByb21pc2UgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBtZXJnZURlZXAgfSBmcm9tICcuLi91dGlsaXRpZXMnO1xuXG5jb25zdCBpbnN0YW5jZXM6IERpY3Rpb25hcnk8VGlueW1jZUNvbnRyb2xsZXI+ID0ge307XG5sZXQgaG9va3M6ICgodGlueW1jZTogVGlueU1DRSkgPT4gTWF5YmVQcm9taXNlPGFueT4pW10gPSBbXTtcblxubGV0IGltcG9ydGVkID0gZmFsc2U7XG5cbmRlY2xhcmUgdHlwZSBVcGxvYWRIYW5kbGVyUGFyYW1zID0gUGFyYW1ldGVyczxOb25OdWxsYWJsZTxFZGl0b3JPcHRpb25zWydpbWFnZXNfdXBsb2FkX2hhbmRsZXInXT4+O1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0KFxuICBzZWxlY3Rvcjogc3RyaW5nLFxuICBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge31cbik6IFByb21pc2U8VGlueW1jZUNvbnRyb2xsZXI+IHtcbiAgYXdhaXQgbG9hZFRpbnltY2UoKTtcblxuICByZXR1cm4gaW5zdGFuY2VzW3NlbGVjdG9yXSA/Pz0gbmV3IFRpbnltY2VDb250cm9sbGVyKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpISwgb3B0aW9ucyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXN0cm95KHNlbGVjdG9yOiBzdHJpbmcpOiB2b2lkIHtcbiAgZGVsZXRlIGluc3RhbmNlc1tzZWxlY3Rvcl07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRIb29rKGhhbmRsZXI6ICgodGlueW1jZTogVGlueU1DRSkgPT4gTWF5YmVQcm9taXNlPGFueT4pKSB7XG4gIGhvb2tzLnB1c2goaGFuZGxlcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGVhckhvb2tzKCkge1xuICBob29rcyA9IFtdO1xufVxuXG5hc3luYyBmdW5jdGlvbiBsb2FkVGlueW1jZSgpIHtcbiAgbGV0IHRpbnltY2UgPSAoYXdhaXQgdXNlSW1wb3J0KCdAdGlueW1jZScpKS5kZWZhdWx0O1xuXG4gIGlmIChpbXBvcnRlZCkge1xuICAgIHJldHVybiB0aW55bWNlO1xuICB9XG4gIGltcG9ydGVkID0gdHJ1ZTtcbiAgZm9yIChjb25zdCBob29rIG9mIGhvb2tzKSB7XG4gICAgaG9vayh0aW55bWNlKTtcbiAgfVxuICBhd2FpdCByZWdpc3RlckRyYWdQbHVnaW4oKTtcbiAgcmV0dXJuIHRpbnltY2U7XG59XG5cbmNvbnN0IGRlZmF1bHRPcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG5cbmV4cG9ydCBjbGFzcyBUaW55bWNlQ29udHJvbGxlciB7XG4gIGVkaXRvcj86IEVkaXRvcjtcbiAgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBlbGVtZW50OiBIVE1MRWxlbWVudCwgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55Pikge1xuICAgIG9wdGlvbnMudGFyZ2V0ID0gZWxlbWVudDtcblxuICAgIHRoaXMub3B0aW9ucyA9IG1lcmdlRGVlcChcbiAgICAgIHtcbiAgICAgICAgdW5pY29ybjoge1xuICAgICAgICAgIHN0YWNrX25hbWU6ICd1cGxvYWRpbmcnXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBkZWZhdWx0T3B0aW9ucyxcbiAgICAgIHRoaXMucHJlcGFyZU9wdGlvbnMob3B0aW9ucywgdGlueW1jZS5tYWpvclZlcnNpb24pLFxuICAgICk7XG5cbiAgICB0aW55bWNlLkVkaXRvck1hbmFnZXIuaW5pdCh0aGlzLm9wdGlvbnMpLnRoZW4oKGVkaXRvcikgPT4ge1xuICAgICAgdGhpcy5lZGl0b3IgPSBlZGl0b3JbMF07XG4gICAgfSk7XG4gIH1cblxuICBwcmVwYXJlT3B0aW9ucyhvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+LCB2ZXJzaW9uID0gJzYnKSB7XG4gICAgY29uc3QgZGVmYXVsdHM6IFBhcnRpYWw8RWRpdG9yT3B0aW9ucz4gPSB7fTtcblxuICAgIGlmIChvcHRpb25zLmltYWdlc191cGxvYWRfdXJsKSB7XG4gICAgICBkZWZhdWx0cy5wYXN0ZV9kYXRhX2ltYWdlcyA9IHRydWU7XG4gICAgICBkZWZhdWx0cy5yZW1vdmVfc2NyaXB0X2hvc3QgPSBmYWxzZTtcbiAgICAgIGRlZmF1bHRzLnJlbGF0aXZlX3VybHMgPSBmYWxzZTtcblxuICAgICAgaWYgKE51bWJlcih2ZXJzaW9uKSA+PSA2KSB7XG4gICAgICAgIGRlZmF1bHRzLmltYWdlc191cGxvYWRfaGFuZGxlciA9IChibG9iSW5mbywgcHJvZ3Jlc3MpID0+XG4gICAgICAgICAgdGhpcy5pbWFnZVVwbG9hZEhhbmRsZXIoYmxvYkluZm8sIHByb2dyZXNzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9wdGlvbnMucGx1Z2lucy5wdXNoKCdwYXN0ZScpO1xuXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgZGVmYXVsdHMuaW1hZ2VzX3VwbG9hZF9oYW5kbGVyID0gKGJsb2JJbmZvLCBzdWNjZXNzLCBmYWlsdXJlLCBwcm9ncmVzcykgPT5cbiAgICAgICAgICB0aGlzLmltYWdlVXBsb2FkSGFuZGxlcihibG9iSW5mbywgcHJvZ3Jlc3MpXG4gICAgICAgICAgICAudGhlbigodXJsKSA9PiB7XG4gICAgICAgICAgICAgIHN1Y2Nlc3ModXJsKTtcbiAgICAgICAgICAgICAgcmV0dXJuIHVybDtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgICAgICAgZmFpbHVyZShlLm1lc3NhZ2UsIHsgcmVtb3ZlOiB0cnVlIH0pO1xuICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gZGVmYXVsdHMuZmlsZV9waWNrZXJfY2FsbGJhY2sgPSAoLi4uYXJncykgPT4gdGhpcy5maWxlUGlja2VyQ2FsbGJhY2soLi4uYXJncyk7XG5cbiAgICBkZWZhdWx0cy5wbHVnaW5zID0gZGVmYXVsdHMucGx1Z2lucyB8fCBbXTtcblxuICAgIGRlZmF1bHRzLnNldHVwID0gKGVkaXRvcikgPT4ge1xuICAgICAgZWRpdG9yLm9uKCdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICAgIHRpbnltY2UudHJpZ2dlclNhdmUoKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBvcHRpb25zID0gbWVyZ2VEZWVwKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG5cbiAgICBpZiAob3B0aW9ucy5wbHVnaW5zLmluZGV4T2YoJ3VuaWNvcm5kcmFnZHJvcCcpID09PSAtMSkge1xuICAgICAgb3B0aW9ucy5wbHVnaW5zLnB1c2goJ3VuaWNvcm5kcmFnZHJvcCcpO1xuICAgIH1cblxuICAgIHJldHVybiBvcHRpb25zO1xuICB9XG5cbiAgaW5zZXJ0KHRleHQ6IHN0cmluZykge1xuICAgIHRoaXMuZWRpdG9yPy5pbnNlcnRDb250ZW50KHRleHQpO1xuICB9XG5cbiAgZ2V0VmFsdWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5lZGl0b3I/LmdldENvbnRlbnQoKSA/PyAnJztcbiAgfVxuXG4gIHNldFZhbHVlKHRleHQ6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuZWRpdG9yPy5zZXRDb250ZW50KHRleHQpO1xuICB9XG5cbiAgLy8gZmlsZVBpY2tlckNhbGxiYWNrKGNhbGxiYWNrLCB2YWx1ZSwgbWV0YSkge1xuICAvLyAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgLy8gICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnZmlsZScpO1xuICAvLyAgIGlucHV0LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIC8vXG4gIC8vICAgaWYgKG1ldGEuZmlsZXR5cGUgPT09ICdpbWFnZScpIHtcbiAgLy8gICAgIGlucHV0LnNldEF0dHJpYnV0ZSgnYWNjZXB0JywgYGltYWdlL1xcKmApO1xuICAvLyAgIH1cbiAgLy9cbiAgLy8gICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGlucHV0KTtcbiAgLy9cbiAgLy8gICBpbnB1dC5vbmNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gICAgIGNvbnN0IGZpbGUgPSB0aGlzLmZpbGVzWzBdO1xuICAvL1xuICAvLyAgICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgLy8gICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gIC8vICAgICAgIGNvbnN0IGlkID0gJ2Jsb2JpZCcgKyAobmV3IERhdGUoKSkuZ2V0VGltZSgpO1xuICAvLyAgICAgICBjb25zdCBibG9iQ2FjaGUgPSAgdGlueW1jZS5hY3RpdmVFZGl0b3IuZWRpdG9yVXBsb2FkLmJsb2JDYWNoZTtcbiAgLy8gICAgICAgY29uc3QgYmFzZTY0ID0gcmVhZGVyLnJlc3VsdC5zcGxpdCgnLCcpWzFdO1xuICAvLyAgICAgICBjb25zdCBibG9iSW5mbyA9IGJsb2JDYWNoZS5jcmVhdGUoaWQsIGZpbGUsIGJhc2U2NCk7XG4gIC8vICAgICAgIGJsb2JDYWNoZS5hZGQoYmxvYkluZm8pO1xuICAvL1xuICAvLyAgICAgICAvKiBjYWxsIHRoZSBjYWxsYmFjayBhbmQgcG9wdWxhdGUgdGhlIFRpdGxlIGZpZWxkIHdpdGggdGhlIGZpbGUgbmFtZSAqL1xuICAvLyAgICAgICBjYWxsYmFjayhibG9iSW5mby5ibG9iVXJpKCksIHsgdGl0bGU6IGZpbGUubmFtZSwgdGV4dDogZmlsZS5uYW1lIH0pO1xuICAvLyAgICAgfTtcbiAgLy8gICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGUpO1xuICAvLyAgICAgaW5wdXQucmVtb3ZlKCk7XG4gIC8vICAgfTtcbiAgLy9cbiAgLy8gICBpbnB1dC5jbGljaygpO1xuICAvLyB9XG5cbiAgYXN5bmMgaW1hZ2VVcGxvYWRIYW5kbGVyKGJsb2JJbmZvOiBVcGxvYWRIYW5kbGVyUGFyYW1zWzBdLCBwcm9ncmVzczogVXBsb2FkSGFuZGxlclBhcmFtc1sxXSkge1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmVsZW1lbnQ7XG5cbiAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCd1cGxvYWQtc3RhcnQnKSk7XG5cbiAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICAgIGZvcm1EYXRhLmFwcGVuZCgnZmlsZScsIGJsb2JJbmZvLmJsb2IoKSwgYmxvYkluZm8uZmlsZW5hbWUoKSk7XG5cbiAgICBjb25zdCBzdGFjayA9IHVzZVN0YWNrKHRoaXMub3B0aW9ucy51bmljb3JuLnN0YWNrX25hbWUpO1xuICAgIHN0YWNrLnB1c2godHJ1ZSk7XG5cbiAgICBjb25zdCBodHRwID0gYXdhaXQgdXNlSHR0cENsaWVudCgpO1xuXG4gICAgdHJ5IHtcbiAgICAgIGxldCByZXMgPSBhd2FpdCBodHRwLnBvc3QoXG4gICAgICAgIHRoaXMub3B0aW9ucy5pbWFnZXNfdXBsb2FkX3VybCxcbiAgICAgICAgZm9ybURhdGEsXG4gICAgICAgIHtcbiAgICAgICAgICB3aXRoQ3JlZGVudGlhbHM6IGZhbHNlLFxuICAgICAgICAgIG9uVXBsb2FkUHJvZ3Jlc3M6IChlKSA9PiB7XG4gICAgICAgICAgICBwcm9ncmVzcyhlLmxvYWRlZCAvIGUudG90YWwhICogMTAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCd1cGxvYWQtc3VjY2VzcycpKTtcblxuICAgICAgcmV0dXJuIHJlcy5kYXRhLmRhdGEudXJsO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc3QgQXhpb3NFcnJvciA9IGF3YWl0IGh0dHAuZXJyb3JDbGFzcygpO1xuXG4gICAgICBpZiAoZXJyIGluc3RhbmNlb2YgQXhpb3NFcnJvcikge1xuICAgICAgICBjb25zdCBtZXNzYWdlID0gZXJyPy5yZXNwb25zZT8uZGF0YT8ubWVzc2FnZSB8fCBlcnIubWVzc2FnZTtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnI/LnJlc3BvbnNlPy5kYXRhPy5tZXNzYWdlIHx8IGVyci5tZXNzYWdlLCBlcnIpO1xuICAgICAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCd1cGxvYWQtZXJyb3InLCB7IGRldGFpbDogZXJyIH0pKTtcblxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoeyBtZXNzYWdlLCByZW1vdmU6IHRydWUgfSk7XG4gICAgICB9XG5cbiAgICAgIHRocm93IGVycjtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgndXBsb2FkLWNvbXBsZXRlJykpO1xuICAgICAgc3RhY2sucG9wKCk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyRHJhZ1BsdWdpbigpIHtcbiAgdGlueW1jZS5QbHVnaW5NYW5hZ2VyLmFkZCgndW5pY29ybmRyYWdkcm9wJywgZnVuY3Rpb24gKGVkaXRvcikge1xuICAgIC8vIFJlc2V0IHRoZSBkcm9wIGFyZWEgYm9yZGVyXG4gICAgdGlueW1jZS5ET00uYmluZChkb2N1bWVudCwgJ2RyYWdsZWF2ZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICBpZiAodGlueW1jZS5hY3RpdmVFZGl0b3IpIHtcbiAgICAgICAgdGlueW1jZS5hY3RpdmVFZGl0b3IuY29udGVudEFyZWFDb250YWluZXIuc3R5bGUudHJhbnNpdGlvbiA9ICdhbGwgLjNzJztcbiAgICAgICAgdGlueW1jZS5hY3RpdmVFZGl0b3IuY29udGVudEFyZWFDb250YWluZXIuc3R5bGUuYm9yZGVyV2lkdGggPSAnJztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuXG4gICAgaWYgKHR5cGVvZiBGb3JtRGF0YSAhPT0gJ3VuZGVmaW5lZCcpIHtcblxuICAgICAgLy8gRml4IGZvciBDaHJvbWVcbiAgICAgIGVkaXRvci5vbignZHJhZ2VudGVyJywgZSA9PiB7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBOb3RpZnkgdXNlciB3aGVuIGZpbGUgaXMgb3ZlciB0aGUgZHJvcCBhcmVhXG4gICAgICBlZGl0b3Iub24oJ2RyYWdvdmVyJywgZSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBpZiAodGlueW1jZS5hY3RpdmVFZGl0b3IpIHtcbiAgICAgICAgICB0aW55bWNlLmFjdGl2ZUVkaXRvci5jb250ZW50QXJlYUNvbnRhaW5lci5zdHlsZS50cmFuc2l0aW9uID0gJ2FsbCAuM3MnO1xuICAgICAgICAgIHRpbnltY2UuYWN0aXZlRWRpdG9yLmNvbnRlbnRBcmVhQ29udGFpbmVyLnN0eWxlLmJvcmRlciA9ICczcHggZGFzaGVkIHJnYmEoMCwgMCwgMCwgLjM1KSc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9KTtcblxuICAgICAgZWRpdG9yLm9uKCdkcm9wJywgZSA9PiB7XG4gICAgICAgIGVkaXRvci5jb250ZW50QXJlYUNvbnRhaW5lci5zdHlsZS5ib3JkZXJXaWR0aCA9ICcnO1xuICAgICAgICBlZGl0b3IuY29udGVudEFyZWFDb250YWluZXIuc3R5bGUuYm9yZGVyV2lkdGggPSAnJztcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFRpbnltY2VNb2R1bGUge1xuICBnZXQ6IHR5cGVvZiBnZXQ7XG4gIGRlc3Ryb3k6IHR5cGVvZiBkZXN0cm95O1xuICBhZGRIb29rOiB0eXBlb2YgYWRkSG9vaztcbiAgY2xlYXJIb29rczogdHlwZW9mIGNsZWFySG9va3M7XG4gIFRpbnltY2VDb250cm9sbGVyOiB0eXBlb2YgVGlueW1jZUNvbnRyb2xsZXI7XG59XG4iXSwibmFtZXMiOlsidGlueW1jZSJdLCJtYXBwaW5ncyI6IjtBQU1BLE1BQU0sWUFBMkMsQ0FBQTtBQUNqRCxJQUFJLFFBQXFELENBQUE7QUFFekQsSUFBSSxXQUFXO0FBSWYsZUFBc0IsSUFDcEIsVUFDQSxVQUErQixJQUNIO0FBQzVCLFFBQU0sWUFBQTtBQUVOLFNBQU8sVUFBVSxRQUFRLE1BQU0sSUFBSSxrQkFBa0IsU0FBUyxjQUFjLFFBQVEsR0FBSSxPQUFPO0FBQ2pHO0FBY0EsZUFBZSxjQUFjO0FBQzNCLE1BQUlBLFlBQVcsTUFBTSxVQUFVLFVBQVUsR0FBRztBQUU1QyxNQUFJLFVBQVU7QUFDWixXQUFPQTtBQUFBQSxFQUNUO0FBQ0EsYUFBVztBQUNYLGFBQVcsUUFBUSxPQUFPO0FBQ3hCLFNBQUtBLFFBQU87QUFBQSxFQUNkO0FBQ0EsUUFBTSxtQkFBQTtBQUNOLFNBQU9BO0FBQ1Q7QUFFQSxNQUFNLGlCQUFzQyxDQUFBO0FBRXJDLE1BQU0sa0JBQWtCO0FBQUEsRUFJN0IsWUFBbUIsU0FBc0IsU0FBOEI7QUFBcEQsU0FBQSxVQUFBO0FBQ2pCLFlBQVEsU0FBUztBQUVqQixTQUFLLFVBQVU7QUFBQSxNQUNiO0FBQUEsUUFDRSxTQUFTO0FBQUEsVUFDUCxZQUFZO0FBQUEsUUFBQTtBQUFBLE1BQ2Q7QUFBQSxNQUVGO0FBQUEsTUFDQSxLQUFLLGVBQWUsU0FBUyxRQUFRLFlBQVk7QUFBQSxJQUFBO0FBR25ELFlBQVEs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
