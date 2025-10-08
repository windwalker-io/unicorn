import { Modal } from "bootstrap";
import { createApp, defineComponent, ref, getCurrentInstance, useTemplateRef, computed, onMounted, nextTick } from "vue";
import { VueDraggable } from "vue-draggable-plus";
import { ItemCardPlaceholder, ItemCard, MultiUploader, createItem } from "vue-multi-uploader";
import { a9 as injectCssToDocument, a7 as mergeDeep, ad as forceArray, ac as data, m as useStack } from "./unicorn.js";
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
    setup(props, { expose }) {
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
      const icons = ref({
        default: "fas fa-file",
        pdf: "fas fa-file-pdf text-danger",
        xls: "fas fa-file-excel text-success",
        xlsx: "fas fa-file-excel text-success",
        doc: "fas fa-file-word text-primary",
        docx: "fas fa-file-word text-primary",
        ppt: "fas fa-file-powerpoint text-warning",
        pptx: "fas fa-file-powerpoint text-warning",
        zip: "fas fa-file-archive text-dark",
        "7z": "fas fa-file-archive text-dark",
        rar: "fas fa-file-archive text-dark",
        mp4: "fas fa-file-video text-dark",
        avi: "fas fa-file-video text-dark",
        flv: "fas fa-file-video text-dark",
        mov: "fas fa-file-video text-dark",
        ogg: "fas fa-file-video text-dark",
        webm: "fas fa-file-video text-dark",
        mpg: "fas fa-file-video text-dark",
        mp3: "fas fa-file-audio text-dark",
        acc: "fas fa-file-audio text-dark",
        wav: "fas fa-file-audio text-dark"
      });
      function setIcons(newIcons, merge = true) {
        if (merge) {
          icons.value = { ...icons.value, ...newIcons };
          return;
        }
        icons.value = newIcons;
      }
      expose({
        uploader,
        instance,
        value,
        canModify,
        openFile,
        itemClick,
        isImage,
        setIcons
      });
      function fileIcon(item) {
        let path = item.file ? item.file.name : item.url;
        path = String(path).split("?")[0];
        const ext = path.split(".").pop() || "";
        const def = "default" in icons ? icons.default : "fas fa-file";
        return icons[String(ext || "default").toLowerCase()] || def;
      }
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
        domEmit,
        fileIcon
      };
    }
  });
}
//# sourceMappingURL=field-multi-uploader.js.map
