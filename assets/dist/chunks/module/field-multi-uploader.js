import { Modal } from "bootstrap";
import { createApp, defineComponent, ref, getCurrentInstance, useTemplateRef, computed, onMounted, nextTick } from "vue";
import { VueDraggable } from "vue-draggable-plus";
import { ItemCardPlaceholder, ItemCard, MultiUploader, createItem } from "vue-multi-uploader";
import { d as data } from "../data.js";
import { i as injectCssToDocument } from "../service/dom.js";
import { m as mergeDeep } from "../utilities/arr.js";
import { f as forceArray } from "../service/helper.js";
import { u as useStack } from "../composable/useStack.js";
const css = ".vue-drag-uploader {\n  --vmu-img-size: 155px;\n  display: flex;\n  flex-wrap: wrap;\n  padding: 1rem;\n  border: 1px dotted #999;\n  border-radius: 4px;\n  cursor: pointer;\n  color: #999;\n  min-height: 250px;\n}\n.vue-drag-uploader--readonly {\n  border: 1px solid #999;\n}\n.vue-drag-uploader.h-ondrag {\n  border: 1px dotted #666;\n  background-color: rgba(0, 0, 0, 0.05);\n  color: #666;\n}\n.vue-drag-uploader__wrapper {\n  width: 100%;\n}\n.vue-drag-uploader__draggable-wrapper, .vue-drag-uploader__transition-wrapper {\n  display: flex;\n  flex-wrap: wrap;\n}\n.vue-drag-uploader-item {\n  width: var(--vmu-img-size);\n  height: var(--vmu-img-size);\n  border: 1px solid rgba(0, 0, 0, 0.25);\n  border-radius: 3px;\n  cursor: pointer;\n  padding: 0.5rem;\n}\n.vue-drag-uploader .add-button {\n  display: flex;\n  align-items: center;\n  text-align: center;\n  transition: background-color 0.5s;\n}\n.vue-drag-uploader .add-button:hover {\n  background-color: rgba(0, 0, 0, 0.05);\n}\n.vue-drag-uploader .add-button__body {\n  margin: 0 auto;\n}\n.vue-drag-uploader .add-button__icon {\n  margin-bottom: 10px;\n}\n.vue-drag-uploader .add-button__text {\n  font-size: 14px;\n}\n.vue-drag-uploader .preview-img {\n  position: relative;\n  cursor: pointer;\n  padding: 1px;\n}\n.vue-drag-uploader .preview-img > * {\n  position: absolute;\n}\n.vue-drag-uploader .preview-img:hover .error-message__message {\n  display: block;\n  padding: 10px;\n}\n.vue-drag-uploader .preview-img__body {\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  background: transparent no-repeat center center;\n  background-size: cover;\n}\n.vue-drag-uploader .preview-img__title {\n  margin: 0 auto;\n}\n.vue-drag-uploader .preview-img__overlay {\n  display: flex;\n  align-items: center;\n  left: 0;\n  top: 0;\n  bottom: 0;\n  right: 0;\n  background-color: rgba(0, 0, 0, 0.35);\n  opacity: 0;\n  transition: opacity 0.5s;\n}\n.vue-drag-uploader .preview-img__overlay:hover {\n  opacity: 1;\n}\n.vue-drag-uploader .preview-img__remove-icon {\n  position: absolute;\n  top: 5px;\n  right: 5px;\n  color: white;\n  opacity: 0.75;\n  transition: opacity 0.5s;\n}\n.vue-drag-uploader .preview-img__remove-icon:hover {\n  opacity: 1;\n}\n.vue-drag-uploader .preview-img__progress {\n  height: 5px;\n  background-color: rgba(255, 255, 255, 0.8);\n  width: 100%;\n  bottom: 0;\n  left: 0;\n}\n.vue-drag-uploader .preview-img__progress-bar {\n  background-color: var(--bs-primary, #007bff);\n  width: 0;\n  height: 100%;\n}\n.vue-drag-uploader .error-message {\n  width: 100%;\n  background-color: #dc3545;\n  color: white;\n  font-size: 14px;\n  word-break: break-all;\n  top: calc(100% - 26px);\n  min-height: 26px;\n}\n.vue-drag-uploader .error-message__notice {\n  display: inline-block;\n  padding: 3px;\n  text-align: center;\n  width: 100%;\n}\n.vue-drag-uploader .error-message__message {\n  display: none;\n}";
/* @__PURE__ */ injectCssToDocument(css);
const defaultOptions = {
  readonly: false,
  disabled: false,
  sortable: false,
  thumbSize: 150,
  maxConcurrent: 5,
  canReplace: false,
  tmplSelector: "#multi-uploader-field-tmpl"
};
class MultiUploaderElement extends HTMLElement {
  static is = "uni-multi-uploader";
  modalElement;
  vm;
  async connectedCallback() {
    let options = JSON.parse(
      this.getAttribute("options") || "{}"
    );
    const resolvedOptions = mergeDeep({}, defaultOptions, options);
    resolvedOptions.thumbSize ??= 150;
    this.modalElement = this.querySelector(".modal");
    const tmplSelector = resolvedOptions.tmplSelector;
    const app = createApp(
      createAppInstance(resolvedOptions, document.querySelector(tmplSelector).innerHTML, this)
    );
    this.vm = app.mount(this);
  }
}
/* @__PURE__ */ customElements.define(/* @__PURE__ */ (() => MultiUploaderElement.is)(), MultiUploaderElement);
function createAppInstance(opt, tmpl, el) {
  return defineComponent({
    name: "MultiUploaderFieldApp",
    template: tmpl,
    components: {
      VueDraggable,
      MultiUploader,
      ItemCard,
      ItemCardPlaceholder
    },
    props: {
      stackName: String
    },
    setup(props, ctx) {
      const options = ref(opt);
      const current = ref();
      const currentIndex = ref();
      const loading = ref(false);
      const dragarea = ref();
      const modal = ref();
      const app = getCurrentInstance();
      const uploader = useTemplateRef("uploader");
      const canModify = computed(() => !options.value.disabled && !options.value.readonly);
      const instance = ref();
      onMounted(() => {
        instance.value = uploader.value.instance;
        domEmit("multi-uploader:mounted", { app, uploader });
      });
      const items = ref([]);
      for (let item of forceArray(options.value.value)) {
        if (typeof item === "string") {
          item = {
            url: item
          };
        }
        const uploadItem = createItem({
          url: item.url || "",
          thumbUrl: item.thumbUrl || item.thumb_url || item.url || "",
          data: item
        });
        items.value.push(uploadItem);
      }
      const uploadUrl = options.value.uploadUrl;
      const value = items.value;
      const uploaderOptions = ref({
        maxFiles: () => options.value.maxFiles,
        readonly: () => options.value.readonly,
        disabled: () => options.value.disabled,
        accept: () => options.value.accept,
        maxConcurrent: () => options.value.maxConcurrent,
        prepareXhr(xhr) {
          xhr.setRequestHeader(
            "X-CSRF-TOKEN",
            data("csrf-token")
          );
        },
        onItemUploadSuccess(item, xhr) {
          const res = JSON.parse(xhr.responseText);
          item.url = res.data.url;
          item.thumbUrl = res.data.thumbUrl || res.data.thumb_url || res.data.url;
          item.data = res.data;
          item.data.title ??= item.url.split("/").pop()?.split("?").shift() || "";
        }
      });
      const draggableOptions = {
        draggable: ".c-drag-item",
        animation: 300,
        disabled: !canModify.value
      };
      function openFile(item) {
        if (options.value.openFileHandler) {
          options.value.openFileHandler(item);
        } else {
          window.open(item.download_url || item.url);
        }
      }
      async function itemClick(item, i, event) {
        current.value = item;
        currentIndex.value = i;
        domEmit("item-click", { item, i });
        nextTick().then(() => {
          Modal.getOrCreateInstance(modal.value).show();
        });
      }
      function metaSave() {
        current.value = void 0;
        currentIndex.value = void 0;
      }
      function isImage(url) {
        const ext = url.split(".").pop().split("?").shift() || "";
        const allow = ["png", "jpeg", "jpg", "gif", "bmp", "webp"];
        return allow.indexOf(ext.toLowerCase()) !== -1;
      }
      function dragover(e) {
        if (!options.value.canReplace) {
          return;
        }
        dragarea.value.style.opacity = "0.75";
      }
      function dragleave(e) {
        if (!options.value.canReplace) {
          return;
        }
        dragarea.value.style.opacity = "1";
      }
      function drop(event) {
        if (!options.value.canReplace) {
          return;
        }
        dragarea.value.style.opacity = "1";
        const item = current.value;
        const file = event.dataTransfer?.files[0] || null;
        if (!file) {
          return;
        }
        instance.value.checkFile(file);
        if (instance.value.isReadonly) {
          return;
        }
        item.file = file;
        loading.value = true;
        try {
          instance.value.uploadFile(item);
        } finally {
          loading.value = false;
        }
      }
      function uploading() {
        useStack(props.stackName).push(true);
        domEmit("uploading");
      }
      function uploaded() {
        useStack(props.stackName).pop();
        domEmit("uploaded");
      }
      function onChange(item) {
        domEmit("change", item);
      }
      function domEmit(event, detail) {
        el.dispatchEvent(new CustomEvent(event, { detail }));
      }
      const foo = ref();
      foo.value = "Bar";
      return {
        uploader,
        uploadUrl,
        value,
        uploaderOptions,
        draggableOptions,
        modal,
        dragarea,
        options,
        current,
        currentIndex,
        loading,
        instance,
        canModify,
        openFile,
        itemClick,
        metaSave,
        isImage,
        dragover,
        dragleave,
        drop,
        uploading,
        uploaded,
        onChange,
        domEmit
      };
    }
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGQtbXVsdGktdXBsb2FkZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tb2R1bGUvZmllbGQtbXVsdGktdXBsb2FkZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTW9kYWwgfSBmcm9tICdib290c3RyYXAnO1xyXG5pbXBvcnQgdHlwZSB7IE9wdGlvbnMgfSBmcm9tICdzb3J0YWJsZWpzJztcclxuaW1wb3J0IHtcclxuICB0eXBlIENvbXBvbmVudFB1YmxpY0luc3RhbmNlLFxyXG4gIGNvbXB1dGVkLFxyXG4gIGNyZWF0ZUFwcCxcclxuICBkZWZpbmVDb21wb25lbnQsXHJcbiAgZ2V0Q3VycmVudEluc3RhbmNlLFxyXG4gIG5leHRUaWNrLFxyXG4gIG9uTW91bnRlZCxcclxuICBQcm9wVHlwZSxcclxuICByZWYsXHJcbiAgdXNlVGVtcGxhdGVSZWZcclxufSBmcm9tICd2dWUnO1xyXG5pbXBvcnQgeyBWdWVEcmFnZ2FibGUgfSBmcm9tICd2dWUtZHJhZ2dhYmxlLXBsdXMnO1xyXG5pbXBvcnQge1xyXG4gIGNyZWF0ZUl0ZW0sXHJcbiAgSXRlbUNhcmQsXHJcbiAgSXRlbUNhcmRQbGFjZWhvbGRlcixcclxuICBNdWx0aVVwbG9hZGVyLFxyXG4gIE11bHRpVXBsb2FkZXJDb21wb3NhYmxlSW5zdGFuY2UsXHJcbiAgTXVsdGlVcGxvYWRlck9wdGlvbnMsXHJcbiAgVXBsb2FkZXJJdGVtXHJcbn0gZnJvbSAndnVlLW11bHRpLXVwbG9hZGVyJztcclxuaW1wb3J0IGNzcyBmcm9tICd2dWUtbXVsdGktdXBsb2FkZXIvc3JjL3Z1ZS1tdWx0aS11cGxvYWRlci5zY3NzP2lubGluZSc7XHJcbmltcG9ydCB7IHVzZVN0YWNrIH0gZnJvbSAnLi4vY29tcG9zYWJsZSc7XHJcbmltcG9ydCB7IGRhdGEgfSBmcm9tICcuLi9kYXRhJztcclxuaW1wb3J0IHsgZm9yY2VBcnJheSwgaW5qZWN0Q3NzVG9Eb2N1bWVudCB9IGZyb20gJy4uL3NlcnZpY2UnO1xyXG5pbXBvcnQgeyBtZXJnZURlZXAgfSBmcm9tICcuLi91dGlsaXRpZXMnO1xyXG5cclxuaW5qZWN0Q3NzVG9Eb2N1bWVudChjc3MpO1xyXG5cclxuZXhwb3J0IHR5cGUgVW5pTXVsdGlVcGxvYWRlck9wdGlvbnMgPSB7XHJcbiAgdmFsdWU/OiBhbnlbXTtcclxuICB1cGxvYWRVcmw6IHN0cmluZztcclxuICBtYXhGaWxlcz86IG51bWJlcjtcclxuICBtYXhDb25jdXJyZW50PzogbnVtYmVyO1xyXG4gIHRodW1iU2l6ZT86IG51bWJlcjtcclxuICBhY2NlcHQ/OiBzdHJpbmc7XHJcbiAgcmVhZG9ubHk6IGJvb2xlYW47XHJcbiAgZGlzYWJsZWQ6IGJvb2xlYW47XHJcbiAgZmllbGROYW1lPzogc3RyaW5nO1xyXG4gIGZpZWxkRnVsbE5hbWU/OiBzdHJpbmc7XHJcbiAgdG1wbFNlbGVjdG9yOiBzdHJpbmc7XHJcbiAgY2FuUmVwbGFjZTogZmFsc2U7XHJcbiAgb3BlbkZpbGVIYW5kbGVyPzogKGl0ZW06IFVwbG9hZGVySXRlbSkgPT4gdm9pZDtcclxufVxyXG5cclxuY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XHJcbiAgcmVhZG9ubHk6IGZhbHNlLFxyXG4gIGRpc2FibGVkOiBmYWxzZSxcclxuICBzb3J0YWJsZTogZmFsc2UsXHJcbiAgdGh1bWJTaXplOiAxNTAsXHJcbiAgbWF4Q29uY3VycmVudDogNSxcclxuICBjYW5SZXBsYWNlOiBmYWxzZSxcclxuICB0bXBsU2VsZWN0b3I6ICcjbXVsdGktdXBsb2FkZXItZmllbGQtdG1wbCcsXHJcbn07XHJcblxyXG5jbGFzcyBNdWx0aVVwbG9hZGVyRWxlbWVudCBleHRlbmRzIEhUTUxFbGVtZW50IHtcclxuICBzdGF0aWMgaXMgPSAndW5pLW11bHRpLXVwbG9hZGVyJztcclxuXHJcbiAgbW9kYWxFbGVtZW50ITogSFRNTERpdkVsZW1lbnQ7XHJcbiAgdm0hOiBDb21wb25lbnRQdWJsaWNJbnN0YW5jZTtcclxuXHJcbiAgYXN5bmMgY29ubmVjdGVkQ2FsbGJhY2soKSB7XHJcbiAgICBsZXQgb3B0aW9uczogUGFydGlhbDxVbmlNdWx0aVVwbG9hZGVyT3B0aW9ucz4gPSBKU09OLnBhcnNlKFxyXG4gICAgICB0aGlzLmdldEF0dHJpYnV0ZSgnb3B0aW9ucycpIHx8ICd7fSdcclxuICAgICk7XHJcblxyXG4gICAgY29uc3QgcmVzb2x2ZWRPcHRpb25zOiBVbmlNdWx0aVVwbG9hZGVyT3B0aW9ucyA9IG1lcmdlRGVlcCh7fSwgZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xyXG5cclxuICAgIC8vIE1ha2Ugc29tZSBkZWZhdWx0IG9wdGlvbnMgc2luY2UgUEhQIHdpbGwgc2VuZCBOVUxMXHJcbiAgICByZXNvbHZlZE9wdGlvbnMudGh1bWJTaXplID8/PSAxNTA7XHJcblxyXG4gICAgdGhpcy5tb2RhbEVsZW1lbnQgPSB0aGlzLnF1ZXJ5U2VsZWN0b3I8SFRNTERpdkVsZW1lbnQ+KCcubW9kYWwnKSE7XHJcblxyXG4gICAgY29uc3QgdG1wbFNlbGVjdG9yID0gcmVzb2x2ZWRPcHRpb25zLnRtcGxTZWxlY3RvcjtcclxuXHJcbiAgICBjb25zdCBhcHAgPSBjcmVhdGVBcHAoXHJcbiAgICAgIGNyZWF0ZUFwcEluc3RhbmNlKHJlc29sdmVkT3B0aW9ucywgZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0bXBsU2VsZWN0b3IpIS5pbm5lckhUTUwsIHRoaXMpXHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMudm0gPSBhcHAubW91bnQodGhpcyk7XHJcbiAgfVxyXG59XHJcblxyXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoTXVsdGlVcGxvYWRlckVsZW1lbnQuaXMsIE11bHRpVXBsb2FkZXJFbGVtZW50KTtcclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUFwcEluc3RhbmNlKG9wdDogVW5pTXVsdGlVcGxvYWRlck9wdGlvbnMsIHRtcGw6IHN0cmluZywgZWw6IE11bHRpVXBsb2FkZXJFbGVtZW50KSB7XHJcbiAgcmV0dXJuIGRlZmluZUNvbXBvbmVudCh7XHJcbiAgICBuYW1lOiAnTXVsdGlVcGxvYWRlckZpZWxkQXBwJyxcclxuICAgIHRlbXBsYXRlOiB0bXBsLFxyXG4gICAgY29tcG9uZW50czoge1xyXG4gICAgICBWdWVEcmFnZ2FibGUsXHJcbiAgICAgIE11bHRpVXBsb2FkZXIsXHJcbiAgICAgIEl0ZW1DYXJkLFxyXG4gICAgICBJdGVtQ2FyZFBsYWNlaG9sZGVyLFxyXG4gICAgfSxcclxuICAgIHByb3BzOiB7XHJcbiAgICAgIHN0YWNrTmFtZTogU3RyaW5nIGFzIFByb3BUeXBlPHN0cmluZz4sXHJcbiAgICB9LFxyXG4gICAgc2V0dXAocHJvcHMsIGN0eCkge1xyXG4gICAgICBjb25zdCBvcHRpb25zID0gcmVmPFVuaU11bHRpVXBsb2FkZXJPcHRpb25zPihvcHQpO1xyXG4gICAgICBjb25zdCBjdXJyZW50ID0gcmVmPFVwbG9hZGVySXRlbT4oKTtcclxuICAgICAgY29uc3QgY3VycmVudEluZGV4ID0gcmVmPG51bWJlcj4oKTtcclxuICAgICAgY29uc3QgbG9hZGluZyA9IHJlZihmYWxzZSk7XHJcbiAgICAgIGNvbnN0IGRyYWdhcmVhID0gcmVmPEhUTUxEaXZFbGVtZW50PigpO1xyXG4gICAgICBjb25zdCBtb2RhbCA9IHJlZjxIVE1MRGl2RWxlbWVudD4oKTtcclxuICAgICAgY29uc3QgYXBwID0gZ2V0Q3VycmVudEluc3RhbmNlKCk7XHJcbiAgICAgIGNvbnN0IHVwbG9hZGVyID0gdXNlVGVtcGxhdGVSZWY8dHlwZW9mIE11bHRpVXBsb2FkZXI+KCd1cGxvYWRlcicpO1xyXG4gICAgICBjb25zdCBjYW5Nb2RpZnkgPSBjb21wdXRlZCgoKSA9PiAhb3B0aW9ucy52YWx1ZS5kaXNhYmxlZCAmJiAhb3B0aW9ucy52YWx1ZS5yZWFkb25seSk7XHJcbiAgICAgIGNvbnN0IGluc3RhbmNlID0gcmVmPE11bHRpVXBsb2FkZXJDb21wb3NhYmxlSW5zdGFuY2U+KCk7XHJcblxyXG4gICAgICBvbk1vdW50ZWQoKCkgPT4ge1xyXG4gICAgICAgIGluc3RhbmNlLnZhbHVlID0gdXBsb2FkZXIudmFsdWUhLmluc3RhbmNlO1xyXG5cclxuICAgICAgICBkb21FbWl0KCdtdWx0aS11cGxvYWRlcjptb3VudGVkJywgeyBhcHAsIHVwbG9hZGVyIH0pO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGNvbnN0IGl0ZW1zID0gcmVmPFVwbG9hZGVySXRlbVtdPihbXSk7XHJcblxyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIGZvcmNlQXJyYXkob3B0aW9ucy52YWx1ZS52YWx1ZSkpIHtcclxuICAgICAgICBpZiAodHlwZW9mIGl0ZW0gPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICBpdGVtID0ge1xyXG4gICAgICAgICAgICB1cmw6IGl0ZW1cclxuICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB1cGxvYWRJdGVtID0gY3JlYXRlSXRlbSh7XHJcbiAgICAgICAgICB1cmw6IGl0ZW0udXJsIHx8ICcnLFxyXG4gICAgICAgICAgdGh1bWJVcmw6IGl0ZW0udGh1bWJVcmwgfHwgaXRlbS50aHVtYl91cmwgfHwgaXRlbS51cmwgfHwgJycsXHJcbiAgICAgICAgICBkYXRhOiBpdGVtXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0ZW1zLnZhbHVlLnB1c2godXBsb2FkSXRlbSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHVwbG9hZFVybCA9IG9wdGlvbnMudmFsdWUudXBsb2FkVXJsO1xyXG4gICAgICBjb25zdCB2YWx1ZSA9IGl0ZW1zLnZhbHVlO1xyXG4gICAgICBjb25zdCB1cGxvYWRlck9wdGlvbnMgPSByZWY8TXVsdGlVcGxvYWRlck9wdGlvbnM+KHtcclxuICAgICAgICBtYXhGaWxlczogKCkgPT4gb3B0aW9ucy52YWx1ZS5tYXhGaWxlcyxcclxuICAgICAgICByZWFkb25seTogKCkgPT4gb3B0aW9ucy52YWx1ZS5yZWFkb25seSxcclxuICAgICAgICBkaXNhYmxlZDogKCkgPT4gb3B0aW9ucy52YWx1ZS5kaXNhYmxlZCxcclxuICAgICAgICBhY2NlcHQ6ICgpID0+IG9wdGlvbnMudmFsdWUuYWNjZXB0LFxyXG4gICAgICAgIG1heENvbmN1cnJlbnQ6ICgpID0+IG9wdGlvbnMudmFsdWUubWF4Q29uY3VycmVudCxcclxuICAgICAgICBwcmVwYXJlWGhyKHhocikge1xyXG4gICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoXHJcbiAgICAgICAgICAgICdYLUNTUkYtVE9LRU4nLFxyXG4gICAgICAgICAgICBkYXRhKCdjc3JmLXRva2VuJylcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbkl0ZW1VcGxvYWRTdWNjZXNzKGl0ZW0sIHhocikge1xyXG4gICAgICAgICAgY29uc3QgcmVzID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgIGl0ZW0udXJsID0gcmVzLmRhdGEudXJsO1xyXG4gICAgICAgICAgaXRlbS50aHVtYlVybCA9IHJlcy5kYXRhLnRodW1iVXJsIHx8IHJlcy5kYXRhLnRodW1iX3VybCB8fCByZXMuZGF0YS51cmw7XHJcbiAgICAgICAgICBpdGVtLmRhdGEgPSByZXMuZGF0YTtcclxuICAgICAgICAgIGl0ZW0uZGF0YS50aXRsZSA/Pz0gaXRlbS51cmwuc3BsaXQoJy8nKS5wb3AoKT8uc3BsaXQoJz8nKS5zaGlmdCgpIHx8ICcnO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIGNvbnN0IGRyYWdnYWJsZU9wdGlvbnM6IE9wdGlvbnMgPSB7XHJcbiAgICAgICAgZHJhZ2dhYmxlOiAnLmMtZHJhZy1pdGVtJyxcclxuICAgICAgICBhbmltYXRpb246IDMwMCxcclxuICAgICAgICBkaXNhYmxlZDogIWNhbk1vZGlmeS52YWx1ZSxcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIG9wZW5GaWxlKGl0ZW06IFVwbG9hZGVySXRlbSkge1xyXG4gICAgICAgIGlmIChvcHRpb25zLnZhbHVlLm9wZW5GaWxlSGFuZGxlcikge1xyXG4gICAgICAgICAgb3B0aW9ucy52YWx1ZS5vcGVuRmlsZUhhbmRsZXIoaXRlbSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHdpbmRvdy5vcGVuKGl0ZW0uZG93bmxvYWRfdXJsIHx8IGl0ZW0udXJsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIGl0ZW1DbGljayhpdGVtOiBVcGxvYWRlckl0ZW0sIGk6IG51bWJlciwgZXZlbnQ6IE1vdXNlRXZlbnQpIHtcclxuICAgICAgICBjdXJyZW50LnZhbHVlID0gaXRlbTtcclxuICAgICAgICBjdXJyZW50SW5kZXgudmFsdWUgPSBpO1xyXG5cclxuICAgICAgICBkb21FbWl0KCdpdGVtLWNsaWNrJywgeyBpdGVtLCBpIH0pO1xyXG5cclxuICAgICAgICBuZXh0VGljaygpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgTW9kYWwuZ2V0T3JDcmVhdGVJbnN0YW5jZShtb2RhbC52YWx1ZSEpLnNob3coKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyB0aGlzLiRvcHRpb25zLm1ldGFNb2RhbC5tb2RhbCgnc2hvdycpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBtZXRhU2F2ZSgpIHtcclxuICAgICAgICBjdXJyZW50LnZhbHVlID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIGN1cnJlbnRJbmRleC52YWx1ZSA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgLy8gbmV4dFRpY2soKS50aGVuKCgpID0+IHtcclxuICAgICAgICAvLyBuZXcgYm9vdHN0cmFwLk1vZGFsKG1vZGFsLnZhbHVlKS5oaWRlKCk7XHJcbiAgICAgICAgLy8gfSk7XHJcbiAgICAgICAgLy8gdGhpcy4kb3B0aW9ucy5tZXRhTW9kYWwubW9kYWwoJ2hpZGUnKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gaXNJbWFnZSh1cmw6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IGV4dCA9IHVybC5zcGxpdCgnLicpLnBvcCgpIS5zcGxpdCgnPycpLnNoaWZ0KCkgfHwgJyc7XHJcbiAgICAgICAgY29uc3QgYWxsb3cgPSBbJ3BuZycsICdqcGVnJywgJ2pwZycsICdnaWYnLCAnYm1wJywgJ3dlYnAnXTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGFsbG93LmluZGV4T2YoZXh0LnRvTG93ZXJDYXNlKCkpICE9PSAtMTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gZHJhZ292ZXIoZTogRHJhZ0V2ZW50KSB7XHJcbiAgICAgICAgaWYgKCFvcHRpb25zLnZhbHVlLmNhblJlcGxhY2UpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRyYWdhcmVhLnZhbHVlIS5zdHlsZS5vcGFjaXR5ID0gJzAuNzUnO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBkcmFnbGVhdmUoZTogRHJhZ0V2ZW50KSB7XHJcbiAgICAgICAgaWYgKCFvcHRpb25zLnZhbHVlLmNhblJlcGxhY2UpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRyYWdhcmVhLnZhbHVlIS5zdHlsZS5vcGFjaXR5ID0gJzEnO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBkcm9wKGV2ZW50OiBEcmFnRXZlbnQpIHtcclxuICAgICAgICBpZiAoIW9wdGlvbnMudmFsdWUuY2FuUmVwbGFjZSkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZHJhZ2FyZWEudmFsdWUhLnN0eWxlLm9wYWNpdHkgPSAnMSc7XHJcbiAgICAgICAgY29uc3QgaXRlbSA9IGN1cnJlbnQudmFsdWU7XHJcbiAgICAgICAgY29uc3QgZmlsZSA9IGV2ZW50LmRhdGFUcmFuc2Zlcj8uZmlsZXNbMF0gfHwgbnVsbDtcclxuXHJcbiAgICAgICAgaWYgKCFmaWxlKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbnN0YW5jZS52YWx1ZSEuY2hlY2tGaWxlKGZpbGUpO1xyXG5cclxuICAgICAgICBpZiAoaW5zdGFuY2UudmFsdWUhLmlzUmVhZG9ubHkpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGl0ZW0hLmZpbGUgPSBmaWxlO1xyXG5cclxuICAgICAgICBsb2FkaW5nLnZhbHVlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgIGluc3RhbmNlLnZhbHVlIS51cGxvYWRGaWxlKGl0ZW0hKTtcclxuICAgICAgICB9IGZpbmFsbHkge1xyXG4gICAgICAgICAgbG9hZGluZy52YWx1ZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gdXBsb2FkaW5nKCkge1xyXG4gICAgICAgIHVzZVN0YWNrKHByb3BzLnN0YWNrTmFtZSkucHVzaCh0cnVlKTtcclxuXHJcbiAgICAgICAgZG9tRW1pdCgndXBsb2FkaW5nJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIHVwbG9hZGVkKCkge1xyXG4gICAgICAgIHVzZVN0YWNrKHByb3BzLnN0YWNrTmFtZSkucG9wKCk7XHJcblxyXG4gICAgICAgIGRvbUVtaXQoJ3VwbG9hZGVkJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFRvZG86IEZpeCB0aGlzXHJcbiAgICAgIGZ1bmN0aW9uIG9uQ2hhbmdlKGl0ZW06IFVwbG9hZGVySXRlbSkge1xyXG4gICAgICAgIC8vIHN0YXRlLnZhbHVlID0gZTtcclxuXHJcbiAgICAgICAgZG9tRW1pdCgnY2hhbmdlJywgaXRlbSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGRvbUVtaXQoZXZlbnQ6IHN0cmluZywgZGV0YWlsPzogYW55KSB7XHJcbiAgICAgICAgZWwuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoZXZlbnQsIHsgZGV0YWlsIH0pKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgZm9vID0gcmVmPHN0cmluZz4oKTtcclxuXHJcbiAgICAgIGZvby52YWx1ZSA9ICdCYXInO1xyXG5cclxuICAgICAgLy8gZWwudXBsb2FkZXIgPSB1cGxvYWRlcjtcclxuICAgICAgLy8gZWwuYXBwID0gcmVmKGFwcC5wcm94eSk7XHJcblxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHVwbG9hZGVyLFxyXG4gICAgICAgIHVwbG9hZFVybCxcclxuICAgICAgICB2YWx1ZSxcclxuICAgICAgICB1cGxvYWRlck9wdGlvbnMsXHJcbiAgICAgICAgZHJhZ2dhYmxlT3B0aW9ucyxcclxuICAgICAgICBtb2RhbCxcclxuICAgICAgICBkcmFnYXJlYSxcclxuICAgICAgICBvcHRpb25zLFxyXG4gICAgICAgIGN1cnJlbnQsXHJcbiAgICAgICAgY3VycmVudEluZGV4LFxyXG4gICAgICAgIGxvYWRpbmcsXHJcbiAgICAgICAgaW5zdGFuY2UsXHJcbiAgICAgICAgY2FuTW9kaWZ5LFxyXG5cclxuICAgICAgICBvcGVuRmlsZSxcclxuICAgICAgICBpdGVtQ2xpY2ssXHJcbiAgICAgICAgbWV0YVNhdmUsXHJcbiAgICAgICAgaXNJbWFnZSxcclxuICAgICAgICBkcmFnb3ZlcixcclxuICAgICAgICBkcmFnbGVhdmUsXHJcbiAgICAgICAgZHJvcCxcclxuICAgICAgICB1cGxvYWRpbmcsXHJcbiAgICAgICAgdXBsb2FkZWQsXHJcbiAgICAgICAgb25DaGFuZ2UsXHJcbiAgICAgICAgZG9tRW1pdFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gIH0pO1xyXG59XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBOEJBLG9DQUFvQixHQUFHO0FBa0J2QixNQUFNLGlCQUFpQjtBQUFBLEVBQ3JCLFVBQVU7QUFBQSxFQUNWLFVBQVU7QUFBQSxFQUNWLFVBQVU7QUFBQSxFQUNWLFdBQVc7QUFBQSxFQUNYLGVBQWU7QUFB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VUFBVTtBQUFBLE1BQ2xDO0FBRUEsZUFBUyxVQUFVLEdBQWM7QUFDL0IsWUFBSSxDQUFDLFFBQVEsTUFBTSxZQUFZO0FBQzdCO0FBQUEsUUFDRjtBQUVBLGlCQUFTLE1BQU8sTUFBTSxVQUFVO0FBQUEsTUFDbEM7QUFFQSxlQUFTLEtBQUssT0FBa0I7QUFDOUIsWUFBSSxDQUFDLFFBQVEsTUFBTSxZQUFZO0FBQzdCO0FBQUEsUUFDRjtBQUVBLGlCQUFTLE1BQU8sTUFBTSxVQUFVO0FBQ2hDLGNBQU0sT0FBTyxRQUFRO0FBQ3JCLGNBQU0sT0FBTyxNQUFNLGNBQWMsTUFBTSxDQUFDLEtBQUs7QUFFN0MsWUFBSSxDQUFDLE1BQU07QUFDVDtBQUFBLFFBQ0Y7QUFFQSxpQkFBUyxNQUFPLFVBQVUsSUFBSTtBQUU5QixZQUFJLFNBQVMsTUFBTyxZQUFZO0FBQzlCO0FBQUEsUUFDRjtBQUVBLGFBQU0sT0FBTztBQUViLGdCQUFRLFFBQVE7QUFFaEIsWUFBSTtBQUNGLG1CQUFTLE1BQU8sV0FBVyxJQUFLO0FBQUEsUUFDbEMsVUFBQTtBQUNFLGtCQUFRLFFBQVE7QUFBQSxRQUNsQjtBQUFBLE1BQ0Y7QUFFQSxlQUFTLFlBQVk7QUFDbkIsaUJBQVMsTUFBTSxTQUFTLEVBQUUsS0FBSyxJQUFJO0FBRW5DLGdCQUFRLFdBQVc7QUFBQSxNQUNyQjtBQUVBLGVBQVMsV0FBVztBQUNsQixpQkFBUyxNQUFNLFNBQVMsRUFBRSxJQUFBO0FBRTFCLGdCQUFRLFVBQVU7QUFBQSxNQUNwQjtBQUdBLGVBQVMsU0FBUyxNQUFvQjtBQUdwQyxnQkFBUSxVQUFVLElBQUk7QUFBQSxNQUN4QjtBQUVBLGVBQVMsUUFBUSxPQUFlLFFBQWM7QUFDNUMsV0FBRyxjQUFjLElBQUksWUFBWSxPQUFPLEVBQUUsT0FBQSxDQUFRLENBQUM7QUFBQSxNQUNyRDtBQUVBLFlBQU0sTUFBTSxJQUFBO0FBRVosVUFBSSxRQUFRO0FBS1osYUFBTztBQUFBLFFBQ0w7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUVBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQUE7QUFBQSxJQUVKO0FBQUEsRUFBQSxDQUNEO0FBQ0g7In0=
