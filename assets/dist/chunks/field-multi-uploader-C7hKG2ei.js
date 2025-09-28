import { Modal } from "bootstrap";
import { createApp, defineComponent, ref, getCurrentInstance, useTemplateRef, computed, onMounted, nextTick } from "vue";
import { VueDraggable } from "vue-draggable-plus";
import { ItemCardPlaceholder, ItemCard, MultiUploader, createItem } from "vue-multi-uploader";
import { f as injectCssToDocument, m as mergeDeep, o as forceArray, l as data, G as useStack } from "./unicorn-D5cXQeSK.js";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGQtbXVsdGktdXBsb2FkZXItQzdoS0cyZWkuanMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2R1bGUvZmllbGQtbXVsdGktdXBsb2FkZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTW9kYWwgfSBmcm9tICdib290c3RyYXAnO1xuaW1wb3J0IHR5cGUgeyBPcHRpb25zIH0gZnJvbSAnc29ydGFibGVqcyc7XG5pbXBvcnQge1xuICB0eXBlIENvbXBvbmVudFB1YmxpY0luc3RhbmNlLFxuICBjb21wdXRlZCxcbiAgY3JlYXRlQXBwLFxuICBkZWZpbmVDb21wb25lbnQsXG4gIGdldEN1cnJlbnRJbnN0YW5jZSxcbiAgbmV4dFRpY2ssXG4gIG9uTW91bnRlZCxcbiAgUHJvcFR5cGUsXG4gIHJlZixcbiAgdXNlVGVtcGxhdGVSZWZcbn0gZnJvbSAndnVlJztcbmltcG9ydCB7IFZ1ZURyYWdnYWJsZSB9IGZyb20gJ3Z1ZS1kcmFnZ2FibGUtcGx1cyc7XG5pbXBvcnQge1xuICBjcmVhdGVJdGVtLFxuICBJdGVtQ2FyZCxcbiAgSXRlbUNhcmRQbGFjZWhvbGRlcixcbiAgTXVsdGlVcGxvYWRlcixcbiAgTXVsdGlVcGxvYWRlckNvbXBvc2FibGVJbnN0YW5jZSxcbiAgTXVsdGlVcGxvYWRlck9wdGlvbnMsXG4gIFVwbG9hZGVySXRlbVxufSBmcm9tICd2dWUtbXVsdGktdXBsb2FkZXInO1xuaW1wb3J0IGNzcyBmcm9tICd2dWUtbXVsdGktdXBsb2FkZXIvc3JjL3Z1ZS1tdWx0aS11cGxvYWRlci5zY3NzP2lubGluZSc7XG5pbXBvcnQgeyB1c2VTdGFjayB9IGZyb20gJy4uL2NvbXBvc2FibGUnO1xuaW1wb3J0IHsgZGF0YSB9IGZyb20gJy4uL2RhdGEnO1xuaW1wb3J0IHsgZm9yY2VBcnJheSwgaW5qZWN0Q3NzVG9Eb2N1bWVudCB9IGZyb20gJy4uL3NlcnZpY2UnO1xuaW1wb3J0IHsgbWVyZ2VEZWVwIH0gZnJvbSAnLi4vdXRpbGl0aWVzJztcblxuaW5qZWN0Q3NzVG9Eb2N1bWVudChjc3MpO1xuXG5leHBvcnQgdHlwZSBVbmlNdWx0aVVwbG9hZGVyT3B0aW9ucyA9IHtcbiAgdmFsdWU/OiBhbnlbXTtcbiAgdXBsb2FkVXJsOiBzdHJpbmc7XG4gIG1heEZpbGVzPzogbnVtYmVyO1xuICBtYXhDb25jdXJyZW50PzogbnVtYmVyO1xuICB0aHVtYlNpemU/OiBudW1iZXI7XG4gIGFjY2VwdD86IHN0cmluZztcbiAgcmVhZG9ubHk6IGJvb2xlYW47XG4gIGRpc2FibGVkOiBib29sZWFuO1xuICBmaWVsZE5hbWU/OiBzdHJpbmc7XG4gIGZpZWxkRnVsbE5hbWU/OiBzdHJpbmc7XG4gIHRtcGxTZWxlY3Rvcjogc3RyaW5nO1xuICBjYW5SZXBsYWNlOiBmYWxzZTtcbiAgb3BlbkZpbGVIYW5kbGVyPzogKGl0ZW06IFVwbG9hZGVySXRlbSkgPT4gdm9pZDtcbn1cblxuY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XG4gIHJlYWRvbmx5OiBmYWxzZSxcbiAgZGlzYWJsZWQ6IGZhbHNlLFxuICBzb3J0YWJsZTogZmFsc2UsXG4gIHRodW1iU2l6ZTogMTUwLFxuICBtYXhDb25jdXJyZW50OiA1LFxuICBjYW5SZXBsYWNlOiBmYWxzZSxcbiAgdG1wbFNlbGVjdG9yOiAnI211bHRpLXVwbG9hZGVyLWZpZWxkLXRtcGwnLFxufTtcblxuY2xhc3MgTXVsdGlVcGxvYWRlckVsZW1lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gIHN0YXRpYyBpcyA9ICd1bmktbXVsdGktdXBsb2FkZXInO1xuXG4gIG1vZGFsRWxlbWVudCE6IEhUTUxEaXZFbGVtZW50O1xuICB2bSE6IENvbXBvbmVudFB1YmxpY0luc3RhbmNlO1xuXG4gIGFzeW5jIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgIGxldCBvcHRpb25zOiBQYXJ0aWFsPFVuaU11bHRpVXBsb2FkZXJPcHRpb25zPiA9IEpTT04ucGFyc2UoXG4gICAgICB0aGlzLmdldEF0dHJpYnV0ZSgnb3B0aW9ucycpIHx8ICd7fSdcbiAgICApO1xuXG4gICAgY29uc3QgcmVzb2x2ZWRPcHRpb25zOiBVbmlNdWx0aVVwbG9hZGVyT3B0aW9ucyA9IG1lcmdlRGVlcCh7fSwgZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgLy8gTWFrZSBzb21lIGRlZmF1bHQgb3B0aW9ucyBzaW5jZSBQSFAgd2lsbCBzZW5kIE5VTExcbiAgICByZXNvbHZlZE9wdGlvbnMudGh1bWJTaXplID8/PSAxNTA7XG5cbiAgICB0aGlzLm1vZGFsRWxlbWVudCA9IHRoaXMucXVlcnlTZWxlY3RvcjxIVE1MRGl2RWxlbWVudD4oJy5tb2RhbCcpITtcblxuICAgIGNvbnN0IHRtcGxTZWxlY3RvciA9IHJlc29sdmVkT3B0aW9ucy50bXBsU2VsZWN0b3I7XG5cbiAgICBjb25zdCBhcHAgPSBjcmVhdGVBcHAoXG4gICAgICBjcmVhdGVBcHBJbnN0YW5jZShyZXNvbHZlZE9wdGlvbnMsIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodG1wbFNlbGVjdG9yKSEuaW5uZXJIVE1MLCB0aGlzKVxuICAgICk7XG5cbiAgICB0aGlzLnZtID0gYXBwLm1vdW50KHRoaXMpO1xuICB9XG59XG5cbmN1c3RvbUVsZW1lbnRzLmRlZmluZShNdWx0aVVwbG9hZGVyRWxlbWVudC5pcywgTXVsdGlVcGxvYWRlckVsZW1lbnQpO1xuXG5mdW5jdGlvbiBjcmVhdGVBcHBJbnN0YW5jZShvcHQ6IFVuaU11bHRpVXBsb2FkZXJPcHRpb25zLCB0bXBsOiBzdHJpbmcsIGVsOiBNdWx0aVVwbG9hZGVyRWxlbWVudCkge1xuICByZXR1cm4gZGVmaW5lQ29tcG9uZW50KHtcbiAgICBuYW1lOiAnTXVsdGlVcGxvYWRlckZpZWxkQXBwJyxcbiAgICB0ZW1wbGF0ZTogdG1wbCxcbiAgICBjb21wb25lbnRzOiB7XG4gICAgICBWdWVEcmFnZ2FibGUsXG4gICAgICBNdWx0aVVwbG9hZGVyLFxuICAgICAgSXRlbUNhcmQsXG4gICAgICBJdGVtQ2FyZFBsYWNlaG9sZGVyLFxuICAgIH0sXG4gICAgcHJvcHM6IHtcbiAgICAgIHN0YWNrTmFtZTogU3RyaW5nIGFzIFByb3BUeXBlPHN0cmluZz4sXG4gICAgfSxcbiAgICBzZXR1cChwcm9wcywgY3R4KSB7XG4gICAgICBjb25zdCBvcHRpb25zID0gcmVmPFVuaU11bHRpVXBsb2FkZXJPcHRpb25zPihvcHQpO1xuICAgICAgY29uc3QgY3VycmVudCA9IHJlZjxVcGxvYWRlckl0ZW0+KCk7XG4gICAgICBjb25zdCBjdXJyZW50SW5kZXggPSByZWY8bnVtYmVyPigpO1xuICAgICAgY29uc3QgbG9hZGluZyA9IHJlZihmYWxzZSk7XG4gICAgICBjb25zdCBkcmFnYXJlYSA9IHJlZjxIVE1MRGl2RWxlbWVudD4oKTtcbiAgICAgIGNvbnN0IG1vZGFsID0gcmVmPEhUTUxEaXZFbGVtZW50PigpO1xuICAgICAgY29uc3QgYXBwID0gZ2V0Q3VycmVudEluc3RhbmNlKCk7XG4gICAgICBjb25zdCB1cGxvYWRlciA9IHVzZVRlbXBsYXRlUmVmPHR5cGVvZiBNdWx0aVVwbG9hZGVyPigndXBsb2FkZXInKTtcbiAgICAgIGNvbnN0IGNhbk1vZGlmeSA9IGNvbXB1dGVkKCgpID0+ICFvcHRpb25zLnZhbHVlLmRpc2FibGVkICYmICFvcHRpb25zLnZhbHVlLnJlYWRvbmx5KTtcbiAgICAgIGNvbnN0IGluc3RhbmNlID0gcmVmPE11bHRpVXBsb2FkZXJDb21wb3NhYmxlSW5zdGFuY2U+KCk7XG5cbiAgICAgIG9uTW91bnRlZCgoKSA9PiB7XG4gICAgICAgIGluc3RhbmNlLnZhbHVlID0gdXBsb2FkZXIudmFsdWUhLmluc3RhbmNlO1xuXG4gICAgICAgIGRvbUVtaXQoJ211bHRpLXVwbG9hZGVyOm1vdW50ZWQnLCB7IGFwcCwgdXBsb2FkZXIgfSk7XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgaXRlbXMgPSByZWY8VXBsb2FkZXJJdGVtW10+KFtdKTtcblxuICAgICAgZm9yIChsZXQgaXRlbSBvZiBmb3JjZUFycmF5KG9wdGlvbnMudmFsdWUudmFsdWUpKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBpdGVtID0ge1xuICAgICAgICAgICAgdXJsOiBpdGVtXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHVwbG9hZEl0ZW0gPSBjcmVhdGVJdGVtKHtcbiAgICAgICAgICB1cmw6IGl0ZW0udXJsIHx8ICcnLFxuICAgICAgICAgIHRodW1iVXJsOiBpdGVtLnRodW1iVXJsIHx8IGl0ZW0udGh1bWJfdXJsIHx8IGl0ZW0udXJsIHx8ICcnLFxuICAgICAgICAgIGRhdGE6IGl0ZW1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXRlbXMudmFsdWUucHVzaCh1cGxvYWRJdGVtKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdXBsb2FkVXJsID0gb3B0aW9ucy52YWx1ZS51cGxvYWRVcmw7XG4gICAgICBjb25zdCB2YWx1ZSA9IGl0ZW1zLnZhbHVlO1xuICAgICAgY29uc3QgdXBsb2FkZXJPcHRpb25zID0gcmVmPE11bHRpVXBsb2FkZXJPcHRpb25zPih7XG4gICAgICAgIG1heEZpbGVzOiAoKSA9PiBvcHRpb25zLnZhbHVlLm1heEZpbGVzLFxuICAgICAgICByZWFkb25seTogKCkgPT4gb3B0aW9ucy52YWx1ZS5yZWFkb25seSxcbiAgICAgICAgZGlzYWJsZWQ6ICgpID0+IG9wdGlvbnMudmFsdWUuZGlzYWJsZWQsXG4gICAgICAgIGFjY2VwdDogKCkgPT4gb3B0aW9ucy52YWx1ZS5hY2NlcHQsXG4gICAgICAgIG1heENvbmN1cnJlbnQ6ICgpID0+IG9wdGlvbnMudmFsdWUubWF4Q29uY3VycmVudCxcbiAgICAgICAgcHJlcGFyZVhocih4aHIpIHtcbiAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihcbiAgICAgICAgICAgICdYLUNTUkYtVE9LRU4nLFxuICAgICAgICAgICAgZGF0YSgnY3NyZi10b2tlbicpXG4gICAgICAgICAgKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25JdGVtVXBsb2FkU3VjY2VzcyhpdGVtLCB4aHIpIHtcbiAgICAgICAgICBjb25zdCByZXMgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgIGl0ZW0udXJsID0gcmVzLmRhdGEudXJsO1xuICAgICAgICAgIGl0ZW0udGh1bWJVcmwgPSByZXMuZGF0YS50aHVtYlVybCB8fCByZXMuZGF0YS50aHVtYl91cmwgfHwgcmVzLmRhdGEudXJsO1xuICAgICAgICAgIGl0ZW0uZGF0YSA9IHJlcy5kYXRhO1xuICAgICAgICAgIGl0ZW0uZGF0YS50aXRsZSA/Pz0gaXRlbS51cmwuc3BsaXQoJy8nKS5wb3AoKT8uc3BsaXQoJz8nKS5zaGlmdCgpIHx8ICcnO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGRyYWdnYWJsZU9wdGlvbnM6IE9wdGlvbnMgPSB7XG4gICAgICAgIGRyYWdnYWJsZTogJy5jLWRyYWctaXRlbScsXG4gICAgICAgIGFuaW1hdGlvbjogMzAwLFxuICAgICAgICBkaXNhYmxlZDogIWNhbk1vZGlmeS52YWx1ZSxcbiAgICAgIH07XG5cbiAgICAgIGZ1bmN0aW9uIG9wZW5GaWxlKGl0ZW06IFVwbG9hZGVySXRlbSkge1xuICAgICAgICBpZiAob3B0aW9ucy52YWx1ZS5vcGVuRmlsZUhhbmRsZXIpIHtcbiAgICAgICAgICBvcHRpb25zLnZhbHVlLm9wZW5GaWxlSGFuZGxlcihpdGVtKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB3aW5kb3cub3BlbihpdGVtLmRvd25sb2FkX3VybCB8fCBpdGVtLnVybCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgYXN5bmMgZnVuY3Rpb24gaXRlbUNsaWNrKGl0ZW06IFVwbG9hZGVySXRlbSwgaTogbnVtYmVyLCBldmVudDogTW91c2VFdmVudCkge1xuICAgICAgICBjdXJyZW50LnZhbHVlID0gaXRlbTtcbiAgICAgICAgY3VycmVudEluZGV4LnZhbHVlID0gaTtcblxuICAgICAgICBkb21FbWl0KCdpdGVtLWNsaWNrJywgeyBpdGVtLCBpIH0pO1xuXG4gICAgICAgIG5leHRUaWNrKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgTW9kYWwuZ2V0T3JDcmVhdGVJbnN0YW5jZShtb2RhbC52YWx1ZSEpLnNob3coKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIHRoaXMuJG9wdGlvbnMubWV0YU1vZGFsLm1vZGFsKCdzaG93Jyk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIG1ldGFTYXZlKCkge1xuICAgICAgICBjdXJyZW50LnZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgICBjdXJyZW50SW5kZXgudmFsdWUgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgLy8gbmV4dFRpY2soKS50aGVuKCgpID0+IHtcbiAgICAgICAgLy8gbmV3IGJvb3RzdHJhcC5Nb2RhbChtb2RhbC52YWx1ZSkuaGlkZSgpO1xuICAgICAgICAvLyB9KTtcbiAgICAgICAgLy8gdGhpcy4kb3B0aW9ucy5tZXRhTW9kYWwubW9kYWwoJ2hpZGUnKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gaXNJbWFnZSh1cmw6IHN0cmluZykge1xuICAgICAgICBjb25zdCBleHQgPSB1cmwuc3BsaXQoJy4nKS5wb3AoKSEuc3BsaXQoJz8nKS5zaGlmdCgpIHx8ICcnO1xuICAgICAgICBjb25zdCBhbGxvdyA9IFsncG5nJywgJ2pwZWcnLCAnanBnJywgJ2dpZicsICdibXAnLCAnd2VicCddO1xuXG4gICAgICAgIHJldHVybiBhbGxvdy5pbmRleE9mKGV4dC50b0xvd2VyQ2FzZSgpKSAhPT0gLTE7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGRyYWdvdmVyKGU6IERyYWdFdmVudCkge1xuICAgICAgICBpZiAoIW9wdGlvbnMudmFsdWUuY2FuUmVwbGFjZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGRyYWdhcmVhLnZhbHVlIS5zdHlsZS5vcGFjaXR5ID0gJzAuNzUnO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBkcmFnbGVhdmUoZTogRHJhZ0V2ZW50KSB7XG4gICAgICAgIGlmICghb3B0aW9ucy52YWx1ZS5jYW5SZXBsYWNlKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZHJhZ2FyZWEudmFsdWUhLnN0eWxlLm9wYWNpdHkgPSAnMSc7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGRyb3AoZXZlbnQ6IERyYWdFdmVudCkge1xuICAgICAgICBpZiAoIW9wdGlvbnMudmFsdWUuY2FuUmVwbGFjZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGRyYWdhcmVhLnZhbHVlIS5zdHlsZS5vcGFjaXR5ID0gJzEnO1xuICAgICAgICBjb25zdCBpdGVtID0gY3VycmVudC52YWx1ZTtcbiAgICAgICAgY29uc3QgZmlsZSA9IGV2ZW50LmRhdGFUcmFuc2Zlcj8uZmlsZXNbMF0gfHwgbnVsbDtcblxuICAgICAgICBpZiAoIWZpbGUpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpbnN0YW5jZS52YWx1ZSEuY2hlY2tGaWxlKGZpbGUpO1xuXG4gICAgICAgIGlmIChpbnN0YW5jZS52YWx1ZSEuaXNSZWFkb25seSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGl0ZW0hLmZpbGUgPSBmaWxlO1xuXG4gICAgICAgIGxvYWRpbmcudmFsdWUgPSB0cnVlO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaW5zdGFuY2UudmFsdWUhLnVwbG9hZEZpbGUoaXRlbSEpO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIGxvYWRpbmcudmFsdWUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiB1cGxvYWRpbmcoKSB7XG4gICAgICAgIHVzZVN0YWNrKHByb3BzLnN0YWNrTmFtZSkucHVzaCh0cnVlKTtcblxuICAgICAgICBkb21FbWl0KCd1cGxvYWRpbmcnKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gdXBsb2FkZWQoKSB7XG4gICAgICAgIHVzZVN0YWNrKHByb3BzLnN0YWNrTmFtZSkucG9wKCk7XG5cbiAgICAgICAgZG9tRW1pdCgndXBsb2FkZWQnKTtcbiAgICAgIH1cblxuICAgICAgLy8gVG9kbzogRml4IHRoaXNcbiAgICAgIGZ1bmN0aW9uIG9uQ2hhbmdlKGl0ZW06IFVwbG9hZGVySXRlbSkge1xuICAgICAgICAvLyBzdGF0ZS52YWx1ZSA9IGU7XG5cbiAgICAgICAgZG9tRW1pdCgnY2hhbmdlJywgaXRlbSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGRvbUVtaXQoZXZlbnQ6IHN0cmluZywgZGV0YWlsPzogYW55KSB7XG4gICAgICAgIGVsLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KGV2ZW50LCB7IGRldGFpbCB9KSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZvbyA9IHJlZjxzdHJpbmc+KCk7XG5cbiAgICAgIGZvby52YWx1ZSA9ICdCYXInO1xuXG4gICAgICAvLyBlbC51cGxvYWRlciA9IHVwbG9hZGVyO1xuICAgICAgLy8gZWwuYXBwID0gcmVmKGFwcC5wcm94eSk7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHVwbG9hZGVyLFxuICAgICAgICB1cGxvYWRVcmwsXG4gICAgICAgIHZhbHVlLFxuICAgICAgICB1cGxvYWRlck9wdGlvbnMsXG4gICAgICAgIGRyYWdnYWJsZU9wdGlvbnMsXG4gICAgICAgIG1vZGFsLFxuICAgICAgICBkcmFnYXJlYSxcbiAgICAgICAgb3B0aW9ucyxcbiAgICAgICAgY3VycmVudCxcbiAgICAgICAgY3VycmVudEluZGV4LFxuICAgICAgICBsb2FkaW5nLFxuICAgICAgICBpbnN0YW5jZSxcbiAgICAgICAgY2FuTW9kaWZ5LFxuXG4gICAgICAgIG9wZW5GaWxlLFxuICAgICAgICBpdGVtQ2xpY2ssXG4gICAgICAgIG1ldGFTYXZlLFxuICAgICAgICBpc0ltYWdlLFxuICAgICAgICBkcmFnb3ZlcixcbiAgICAgICAgZHJhZ2xlYXZlLFxuICAgICAgICBkcm9wLFxuICAgICAgICB1cGxvYWRpbmcsXG4gICAgICAgIHVwbG9hZGVkLFxuICAgICAgICBvbkNoYW5nZSxcbiAgICAgICAgZG9tRW1pdFxuICAgICAgfTtcbiAgICB9XG4gIH0pO1xufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQThCQSxvQ0FBb0IsR0FBRztBQWtCdkIsTUFBTSxpQkFBaUI7QUFBQSxFQUNyQixVQUFVO0FBQUEsRUFDVixVQUFVO0FBQUEsRUFDVixVQUFVO0FBQUEsRUFDVixXQUFXO0FBQUEsRUFDWCxlQUFlO0FBQUEsRUFDZixZQUFZO0FBQUEsRUFDWixjQUFjO0FBQ2hCO0FBRUEsTUFBTSw2QkFBNkIsWUFBWTtBQUFBLEVBQzdDLE9BQU8sS0FBSztBQUFBLEVBRVo7QUFBQSxFQUNBO0FBQUEsRUFFQSxNQUFNLG9CQUFvQjtBQUN4QixRQUFJLFVBQTRDLEtBQUs7QUFBQSxNQUNuRCxLQUFLLGFBQWEsU0FBUyxLQUFLO0FBQUEsSUFBQTtBQUdsQyxVQUFNLGtCQUEyQyxVQUFVLElBQUksZ0JBQWdCLE9BQU87QUFHdEYsb0JBQWdCLGNBQWM7QUFFOUIsU0FBSyxlQUFlLEtBQUssY0FBOEIsUUFBUTtBQUUvRCxVQUFNLGVBQWUsZ0JBQWdCO0FBRXJDLFVBQU0sTUFBTTtBQUFBLE1BQ1Ysa0JBQWtCLGlCQUFpQixTQUFTLGNBQWMsWUFBWSxFQUFHLFdBQVcsSUFBSTtBQUFBLElBQUE7QUFHMUYsU0FBSyxLQUFLLElBQUksTUFBTSxJQUFJO0FBQUEsRUFDMUI7QUFDRjtBQUVBLCtCQUFlLE9BQUEsdUJBQU8scUJBQXFCLElBQUEsR0FBSSxvQkFBb0I7QUFFbkUsU0FBUyxrQkFBa0IsS0FBOEIsTUFBYyxJQUEwQjtBQUMvRixTQUFPLGdCQUFnQjtBQUFBLElBQ3JCLE1BQU07QUFBQSxJQUNOLFVBQVU7QUFBQSxJQUNWLFlBQVk7QUFBQSxNQUNWO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFB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
