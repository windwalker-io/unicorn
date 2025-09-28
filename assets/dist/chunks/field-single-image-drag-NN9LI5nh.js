import { Modal } from "bootstrap";
import { m as mergeDeep, s as selectAll, _ as __, e as simpleAlert, q as useHttpClient, f as injectCssToDocument } from "./unicorn-DR9JpPYO.js";
const css = ".c-sid-default__left-col {\n  width: 30%;\n  margin-right: 15px;\n  justify-content: center;\n}\n.c-sid-default__left-col img {\n  max-height: 250px;\n}\n.c-sid-default__right-col {\n  overflow: hidden;\n}\n.c-sid-default__dragarea {\n  font-weight: bold;\n  text-align: center;\n  padding: 9% 0;\n  color: #ccc;\n  border: 2px dashed #ccc;\n  border-radius: 7px;\n  cursor: default;\n}\n.c-sid-default__dragarea.hover {\n  color: #333;\n  border-color: #333;\n  background-color: #f9f9f9;\n}\n.c-sid-default__img-loader {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 100%;\n  height: 180px;\n}\n.c-sid-default__size-info {\n  margin-top: 5px;\n  font-size: 13px;\n}\n.c-sid-default__remove {\n  margin-left: 5px;\n}\n.c-sid-default__modal .btn {\n  position: relative;\n}\n\n.c-sid-modal .modal-body {\n  position: relative;\n}\n.c-sid-modal__content {\n  position: relative;\n  z-index: 3;\n}\n.c-sid-modal__loading {\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  z-index: 1;\n}\n.is-invalid[uni-field-validate] > uni-sid ~ [data-field-error] {\n  display: block;\n}";
/* @__PURE__ */ injectCssToDocument(css);
const defaultOptions = {
  accept: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
    "image/gif"
  ],
  crop: false,
  width: 800,
  height: 800
};
class SingleImageDragElement extends HTMLElement {
  static is = "uni-sid";
  currentImage = "";
  currentFile = void 0;
  lastZoom = 0;
  valueBackup = "";
  options;
  valueInput;
  fileInput;
  selectButton;
  pasteButton;
  dragarea;
  previewImage;
  removeCheckbox;
  modalElement;
  modal;
  cropContainer;
  savebutton;
  modalToolbarButtons;
  cropper;
  constructor() {
    super();
  }
  connectedCallback() {
    this.options = mergeDeep(
      {},
      defaultOptions,
      JSON.parse(this.getAttribute("options") || "{}")
    );
    this.valueInput = this.querySelector("[data-field-input]");
    this.fileInput = this.querySelector("[data-sid=file]");
    this.selectButton = this.querySelector("[data-sid=select]");
    this.pasteButton = this.querySelector("[data-sid=paste]");
    this.dragarea = this.querySelector("[data-sid=dragarea]");
    this.previewImage = this.querySelector("[data-sid=preview]");
    this.removeCheckbox = this.querySelector("[data-sid=remove]");
    this.modalElement = document.querySelector(this.options.modalTarget);
    this.modal = Modal.getOrCreateInstance(this.modalElement);
    this.cropContainer = this.modalElement.querySelector('[data-sid="crop-container"]');
    this.savebutton = this.modalElement.querySelector("[data-sid=save-button]");
    this.modalToolbarButtons = this.modalElement.querySelectorAll("[data-sid-toolbar]");
    const modalShown = async () => {
      const cropper = await this.getCropper();
      cropper.replace(this.currentImage);
      this.cropContainer.style.visibility = "";
      this.currentImage = "";
    };
    this.modalElement.addEventListener("shown.bs.modal", modalShown.bind(this));
    this.savebutton.addEventListener("click", () => {
      this.saveCropped();
      this.modal.hide();
    });
    this.bindEvents();
    this.style.visibility = "";
  }
  bindEvents() {
    this.dragarea.addEventListener("dragover", (event) => {
      event.stopPropagation();
      event.preventDefault();
      this.dragarea.classList.add("hover");
    });
    this.dragarea.addEventListener("dragleave", (event) => {
      event.stopPropagation();
      event.preventDefault();
      this.dragarea.classList.remove("hover");
    });
    this.dragarea.addEventListener("drop", (event) => {
      event.stopPropagation();
      event.preventDefault();
      this.dragarea.classList.remove("hover");
      const files = event.target.files || event.dataTransfer?.files || [];
      this.handleFileSelect(files[0]);
    });
    this.selectButton.addEventListener("click", () => {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", this.getInputAccept());
      input.style.display = "none";
      input.addEventListener("change", (e) => {
        this.handleFileSelect(input.files[0]);
        input.remove();
      });
      document.body.appendChild(input);
      input.click();
    });
    this.pasteButton.addEventListener("click", () => {
      navigator.clipboard.read().then((items) => {
        let types = items[0].types;
        if (types.length === 0) {
          this.alert("This browser unable to get clipboard data.");
          return;
        }
        types = types.slice().sort();
        const type = types[0];
        items[0].getType(type).then((blob) => {
          this.handleFileSelect(new File([blob], "image.png", { type }));
        });
      });
    });
    this.removeCheckbox?.addEventListener("click", () => {
      if (this.removeCheckbox.checked) {
        this.valueBackup = this.valueInput.value;
        this.valueInput.value = "";
      } else {
        this.valueInput.value = this.valueBackup;
        this.valueBackup = "";
      }
    });
    selectAll(this.modalToolbarButtons, (button) => {
      button.addEventListener("click", (event) => {
        this.toolbarClicked(button, event);
      });
    });
  }
  getInputAccept() {
    let accept = this.options.accept;
    if (Array.isArray(accept)) {
      accept = accept.join(",");
    }
    return accept;
  }
  handleFileSelect(file) {
    if (!this.checkFile(file)) {
      return;
    }
    if (this.options.crop) {
      const reader = new FileReader();
      reader.addEventListener("load", (event) => {
        this.cropContainer.style.visibility = "hidden";
        this.currentImage = event.target.result;
        this.currentFile = file;
        this.modal.show();
      });
      reader.readAsDataURL(file);
      return;
    }
    this.saveImage(file);
  }
  async saveCropped() {
    const Cropper = await this.getCropper();
    Cropper.getCroppedCanvas({
      width: this.options.width,
      height: this.options.height,
      imageSmoothingEnabled: true
    }).toBlob((blob) => {
      const file = new File([blob], this.currentFile.name, { type: "image/png" });
      this.saveImage(file);
    }, "image/png");
  }
  async getCropper() {
    if (this.cropper) {
      return this.cropper;
    }
    const Cropper = await loadCropper();
    return this.cropper = new Cropper(this.cropContainer.querySelector("img"), {
      aspectRatio: this.options.width / this.options.height,
      autoCropArea: 1,
      viewMode: 1,
      dragMode: "move",
      cropBoxMovable: false,
      cropBoxResizable: false,
      ready: (e) => {
      }
    });
  }
  async toolbarClicked(button, event) {
    const cropper = await this.getCropper();
    const data = cropper.getData();
    switch (button.dataset.sidToolbar) {
      case "zoom-in":
        cropper.zoom(0.1);
        break;
      case "zoom-out":
        cropper.zoom(-0.1);
        break;
      case "rotate-left":
        cropper.rotate(-90);
        break;
      case "rotate-right":
        cropper.rotate(90);
        break;
      case "scale-x":
        cropper.scaleX(-data.scaleX);
        break;
      case "scale-y":
        cropper.scaleY(-data.scaleY);
        break;
    }
  }
  checkFile(file) {
    let accept = this.options.accept;
    if (typeof accept === "string") {
      accept = accept.split(",").map((v) => v.trim());
    }
    if (!accept.length) {
      return true;
    }
    let allow = false;
    for (const type of accept) {
      if (type.indexOf("/") !== -1) {
        allow = allow || this.compareMimeType(type, file.type);
      } else {
        allow = allow || type.toLowerCase() === getFileExtension(file)?.toLowerCase();
      }
    }
    if (allow) {
      return true;
    }
    this.alert(
      __("unicorn.field.sid.message.invalid.image.title"),
      __("unicorn.field.sid.message.invalid.image.desc"),
      "error"
    );
    return false;
  }
  compareMimeType(accept, mime) {
    const accept2 = accept.split("/");
    const mime2 = mime.split("/");
    if (accept2[1] === "*") {
      return accept2[0] === mime2[0];
    }
    return accept === mime;
  }
  checkSize(image) {
    try {
      if (this.options.max_width && this.options.max_width < image.width) {
        throw new Error(__("unicorn.field.sid.message.invalid.size.max.width", this.options.max_width));
      }
      if (this.options.min_width && this.options.min_width > image.width) {
        throw new Error(__("unicorn.field.sid.message.invalid.size.min.width", this.options.min_width));
      }
      if (this.options.max_height && this.options.max_height < image.height) {
        throw new Error(__("unicorn.field.sid.message.invalid.size.max.height", this.options.max_height));
      }
      if (this.options.min_height && this.options.min_height > image.height) {
        throw new Error(__("unicorn.field.sid.message.invalid.size.min.height", this.options.min_height));
      }
    } catch (e) {
      this.alert(
        __("unicorn.field.sid.message.invalid.size.title"),
        e.message,
        "error"
      );
      return false;
    }
    return true;
  }
  alert(title, text = "", type = "info") {
    return simpleAlert(title, text, type);
  }
  async saveImage(file) {
    if (this.options.ajax_url) {
      const loading = this.querySelector("[data-sid=file-uploading]");
      this.previewImage.src = "";
      this.previewImage.style.display = "none";
      loading.style.display = "flex";
      try {
        await this.uploadImage(file);
      } catch (e) {
        console.error(e);
        simpleAlert(e.message);
        return;
      } finally {
        loading.style.display = "none";
      }
      return;
    }
    const dt = new DataTransfer();
    dt.items.add(file);
    this.valueInput.required = false;
    this.fileInput.files = dt.files;
    this.fileInput.dispatchEvent(new CustomEvent("change", { bubbles: true }));
    this.fileInput.dispatchEvent(new CustomEvent("input", { bubbles: true }));
    this.storeValue("", URL.createObjectURL(file));
  }
  async uploadImage(file) {
    const formData = new FormData();
    formData.append("file", file);
    const { post } = await useHttpClient();
    return post(this.options.ajax_url, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  }
  storeValue(url, preview) {
    this.previewImage.src = preview;
    this.previewImage.style.display = "inline-block";
    if (this.removeCheckbox) {
      this.removeCheckbox.checked = false;
    }
    if (url) {
      this.valueInput.value = url;
    }
    this.previewImage.dispatchEvent(new CustomEvent("change", { bubbles: true }));
    this.valueInput.dispatchEvent(new CustomEvent("change", { bubbles: true }));
    this.valueInput.dispatchEvent(new CustomEvent("input", { bubbles: true }));
  }
}
/* @__PURE__ */ customElements.define(/* @__PURE__ */ (() => SingleImageDragElement.is)(), SingleImageDragElement);
function getFileExtension(file) {
  const parts = file.name.split(".");
  if (parts.length > 1) {
    return parts.pop();
  }
  return void 0;
}
async function loadCropper() {
  const [module] = await Promise.all([
    import("cropperjs"),
    import("./cropper.min-C_KgFUJf.js").then(({ default: css2 }) => {
      injectCssToDocument(css2);
    })
  ]);
  return module.default;
}
/* @__PURE__ */ loadCropper();
export {
  SingleImageDragElement
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGQtc2luZ2xlLWltYWdlLWRyYWctTk45TEk1bmguanMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2R1bGUvZmllbGQtc2luZ2xlLWltYWdlLWRyYWcudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgeyB1c2VIdHRwQ2xpZW50IH0gZnJvbSAnLi4vY29tcG9zYWJsZSc7XG5pbXBvcnQgeyBfXywgaW5qZWN0Q3NzVG9Eb2N1bWVudCwgc2VsZWN0QWxsLCBzaW1wbGVBbGVydCB9IGZyb20gJy4uL3NlcnZpY2UnO1xuaW1wb3J0IHsgbWVyZ2VEZWVwIH0gZnJvbSAnLi4vdXRpbGl0aWVzJztcbmltcG9ydCBjc3MgZnJvbSAnLi4vLi4vc2Nzcy9maWVsZC9zaW5nbGUtaW1hZ2UtZHJhZy5zY3NzP2lubGluZSc7XG5pbXBvcnQgeyBNb2RhbCB9IGZyb20gJ2Jvb3RzdHJhcCc7XG5pbXBvcnQgdHlwZSBDcm9wcGVyIGZyb20gJ2Nyb3BwZXJqcyc7XG5cbmluamVjdENzc1RvRG9jdW1lbnQoY3NzKTtcblxuZXhwb3J0IGludGVyZmFjZSBTaW5nbGVJbWFnZURyYWdPcHRpb25zIHtcbiAgYWNjZXB0OiBzdHJpbmcgfCBzdHJpbmdbXTtcbiAgYWpheF91cmw/OiBzdHJpbmc7XG4gIGNyb3A6IGJvb2xlYW47XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xuICBtYXhfd2lkdGg/OiBudW1iZXI7XG4gIG1pbl93aWR0aD86IG51bWJlcjtcbiAgbWF4X2hlaWdodD86IG51bWJlcjtcbiAgbWluX2hlaWdodD86IG51bWJlcjtcbiAgbW9kYWxUYXJnZXQ6IHN0cmluZztcbn1cblxuY29uc3QgZGVmYXVsdE9wdGlvbnM6IFBhcnRpYWw8U2luZ2xlSW1hZ2VEcmFnT3B0aW9ucz4gPSB7XG4gIGFjY2VwdDogW1xuICAgICdpbWFnZS9qcGVnJyxcbiAgICAnaW1hZ2UvcG5nJyxcbiAgICAnaW1hZ2Uvd2VicCcsXG4gICAgJ2ltYWdlL2F2aWYnLFxuICAgICdpbWFnZS9naWYnLFxuICBdLFxuICBjcm9wOiBmYWxzZSxcbiAgd2lkdGg6IDgwMCxcbiAgaGVpZ2h0OiA4MDAsXG59O1xuXG5leHBvcnQgY2xhc3MgU2luZ2xlSW1hZ2VEcmFnRWxlbWVudCBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgc3RhdGljIGlzID0gJ3VuaS1zaWQnO1xuXG4gIGN1cnJlbnRJbWFnZSA9ICcnO1xuICBjdXJyZW50RmlsZTogRmlsZSB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgbGFzdFpvb20gPSAwO1xuICB2YWx1ZUJhY2t1cCA9ICcnO1xuXG4gIHByaXZhdGUgb3B0aW9ucyE6IFNpbmdsZUltYWdlRHJhZ09wdGlvbnM7XG4gIHByaXZhdGUgdmFsdWVJbnB1dCE6IEhUTUxJbnB1dEVsZW1lbnQ7XG4gIHByaXZhdGUgZmlsZUlucHV0ITogSFRNTElucHV0RWxlbWVudDtcbiAgcHJpdmF0ZSBzZWxlY3RCdXR0b24hOiBIVE1MQnV0dG9uRWxlbWVudDtcbiAgcHJpdmF0ZSBwYXN0ZUJ1dHRvbiE6IEhUTUxCdXR0b25FbGVtZW50O1xuICBwcml2YXRlIGRyYWdhcmVhITogSFRNTERpdkVsZW1lbnQ7XG4gIHByaXZhdGUgcHJldmlld0ltYWdlITogSFRNTEltYWdlRWxlbWVudDtcbiAgcHJpdmF0ZSByZW1vdmVDaGVja2JveCE6IEhUTUxJbnB1dEVsZW1lbnQ7XG4gIHByaXZhdGUgbW9kYWxFbGVtZW50ITogSFRNTERpdkVsZW1lbnQ7XG4gIHByaXZhdGUgbW9kYWwhOiBNb2RhbDtcbiAgcHJpdmF0ZSBjcm9wQ29udGFpbmVyITogSFRNTERpdkVsZW1lbnQ7XG4gIHByaXZhdGUgc2F2ZWJ1dHRvbiE6IEhUTUxCdXR0b25FbGVtZW50O1xuICBwcml2YXRlIG1vZGFsVG9vbGJhckJ1dHRvbnMhOiBOb2RlTGlzdE9mPEhUTUxCdXR0b25FbGVtZW50PjtcbiAgcHJpdmF0ZSBjcm9wcGVyITogQ3JvcHBlcjtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgdGhpcy5vcHRpb25zID0gbWVyZ2VEZWVwKFxuICAgICAge30sXG4gICAgICBkZWZhdWx0T3B0aW9ucyxcbiAgICAgIEpTT04ucGFyc2UodGhpcy5nZXRBdHRyaWJ1dGUoJ29wdGlvbnMnKSB8fCAne30nKVxuICAgICk7XG5cbiAgICB0aGlzLnZhbHVlSW5wdXQgPSB0aGlzLnF1ZXJ5U2VsZWN0b3I8SFRNTElucHV0RWxlbWVudD4oJ1tkYXRhLWZpZWxkLWlucHV0XScpITtcbiAgICB0aGlzLmZpbGVJbnB1dCA9IHRoaXMucXVlcnlTZWxlY3RvcjxIVE1MSW5wdXRFbGVtZW50PignW2RhdGEtc2lkPWZpbGVdJykhO1xuICAgIHRoaXMuc2VsZWN0QnV0dG9uID0gdGhpcy5xdWVyeVNlbGVjdG9yPEhUTUxCdXR0b25FbGVtZW50PignW2RhdGEtc2lkPXNlbGVjdF0nKSE7XG4gICAgdGhpcy5wYXN0ZUJ1dHRvbiA9IHRoaXMucXVlcnlTZWxlY3RvcjxIVE1MQnV0dG9uRWxlbWVudD4oJ1tkYXRhLXNpZD1wYXN0ZV0nKSE7XG4gICAgdGhpcy5kcmFnYXJlYSA9IHRoaXMucXVlcnlTZWxlY3RvcjxIVE1MRGl2RWxlbWVudD4oJ1tkYXRhLXNpZD1kcmFnYXJlYV0nKSE7XG4gICAgdGhpcy5wcmV2aWV3SW1hZ2UgPSB0aGlzLnF1ZXJ5U2VsZWN0b3I8SFRNTEltYWdlRWxlbWVudD4oJ1tkYXRhLXNpZD1wcmV2aWV3XScpITtcbiAgICB0aGlzLnJlbW92ZUNoZWNrYm94ID0gdGhpcy5xdWVyeVNlbGVjdG9yPEhUTUxJbnB1dEVsZW1lbnQ+KCdbZGF0YS1zaWQ9cmVtb3ZlXScpITtcblxuICAgIHRoaXMubW9kYWxFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRGl2RWxlbWVudD4odGhpcy5vcHRpb25zLm1vZGFsVGFyZ2V0KSE7XG4gICAgdGhpcy5tb2RhbCA9IE1vZGFsLmdldE9yQ3JlYXRlSW5zdGFuY2UodGhpcy5tb2RhbEVsZW1lbnQpO1xuICAgIHRoaXMuY3JvcENvbnRhaW5lciA9IHRoaXMubW9kYWxFbGVtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTERpdkVsZW1lbnQ+KCdbZGF0YS1zaWQ9XCJjcm9wLWNvbnRhaW5lclwiXScpITtcbiAgICB0aGlzLnNhdmVidXR0b24gPSB0aGlzLm1vZGFsRWxlbWVudC5xdWVyeVNlbGVjdG9yPEhUTUxCdXR0b25FbGVtZW50PignW2RhdGEtc2lkPXNhdmUtYnV0dG9uXScpITtcbiAgICB0aGlzLm1vZGFsVG9vbGJhckJ1dHRvbnMgPSB0aGlzLm1vZGFsRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxCdXR0b25FbGVtZW50PignW2RhdGEtc2lkLXRvb2xiYXJdJyk7XG5cbiAgICBjb25zdCBtb2RhbFNob3duID0gYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgY3JvcHBlciA9IGF3YWl0IHRoaXMuZ2V0Q3JvcHBlcigpO1xuICAgICAgY3JvcHBlci5yZXBsYWNlKHRoaXMuY3VycmVudEltYWdlKTtcbiAgICAgIHRoaXMuY3JvcENvbnRhaW5lci5zdHlsZS52aXNpYmlsaXR5ID0gJyc7XG4gICAgICB0aGlzLmN1cnJlbnRJbWFnZSA9ICcnO1xuICAgIH07XG5cbiAgICB0aGlzLm1vZGFsRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdzaG93bi5icy5tb2RhbCcsIG1vZGFsU2hvd24uYmluZCh0aGlzKSk7XG5cbiAgICB0aGlzLnNhdmVidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICB0aGlzLnNhdmVDcm9wcGVkKCk7XG4gICAgICB0aGlzLm1vZGFsLmhpZGUoKTtcbiAgICB9KTtcblxuICAgIHRoaXMuYmluZEV2ZW50cygpO1xuXG4gICAgdGhpcy5zdHlsZS52aXNpYmlsaXR5ID0gJyc7XG4gIH1cblxuICBiaW5kRXZlbnRzKCkge1xuICAgIHRoaXMuZHJhZ2FyZWEuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ292ZXInLCAoZXZlbnQpID0+IHtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgdGhpcy5kcmFnYXJlYS5jbGFzc0xpc3QuYWRkKCdob3ZlcicpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5kcmFnYXJlYS5hZGRFdmVudExpc3RlbmVyKCdkcmFnbGVhdmUnLCAoZXZlbnQpID0+IHtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgdGhpcy5kcmFnYXJlYS5jbGFzc0xpc3QucmVtb3ZlKCdob3ZlcicpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5kcmFnYXJlYS5hZGRFdmVudExpc3RlbmVyKCdkcm9wJywgKGV2ZW50KSA9PiB7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIHRoaXMuZHJhZ2FyZWEuY2xhc3NMaXN0LnJlbW92ZSgnaG92ZXInKTtcblxuICAgICAgY29uc3QgZmlsZXMgPSAoZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmZpbGVzIHx8IGV2ZW50LmRhdGFUcmFuc2Zlcj8uZmlsZXMgfHwgW107XG4gICAgICB0aGlzLmhhbmRsZUZpbGVTZWxlY3QoZmlsZXNbMF0pO1xuICAgIH0pO1xuXG4gICAgLy8gU2VsZWN0IGJ1dHRvblxuICAgIHRoaXMuc2VsZWN0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ2ZpbGUnKTtcbiAgICAgIGlucHV0LnNldEF0dHJpYnV0ZSgnYWNjZXB0JywgdGhpcy5nZXRJbnB1dEFjY2VwdCgpKTtcbiAgICAgIGlucHV0LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZSkgPT4ge1xuICAgICAgICB0aGlzLmhhbmRsZUZpbGVTZWxlY3QoaW5wdXQuZmlsZXMhWzBdISk7XG5cbiAgICAgICAgaW5wdXQucmVtb3ZlKCk7XG4gICAgICB9KTtcblxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpbnB1dCk7XG4gICAgICBpbnB1dC5jbGljaygpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5wYXN0ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIG5hdmlnYXRvci5jbGlwYm9hcmQucmVhZCgpLnRoZW4oKGl0ZW1zKSA9PiB7XG4gICAgICAgIGxldCB0eXBlcyA9IGl0ZW1zWzBdLnR5cGVzO1xuXG4gICAgICAgIGlmICh0eXBlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICB0aGlzLmFsZXJ0KCdUaGlzIGJyb3dzZXIgdW5hYmxlIHRvIGdldCBjbGlwYm9hcmQgZGF0YS4nKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0eXBlcyA9IHR5cGVzLnNsaWNlKCkuc29ydCgpO1xuXG4gICAgICAgIGNvbnN0IHR5cGUgPSB0eXBlc1swXTtcblxuICAgICAgICBpdGVtc1swXS5nZXRUeXBlKHR5cGUpLnRoZW4oKGJsb2IpID0+IHtcbiAgICAgICAgICB0aGlzLmhhbmRsZUZpbGVTZWxlY3QobmV3IEZpbGUoWyBibG9iIF0sICdpbWFnZS5wbmcnLCB7IHR5cGUgfSkpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gRGVsZXRlXG4gICAgdGhpcy5yZW1vdmVDaGVja2JveD8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBpZiAodGhpcy5yZW1vdmVDaGVja2JveC5jaGVja2VkKSB7XG4gICAgICAgIHRoaXMudmFsdWVCYWNrdXAgPSB0aGlzLnZhbHVlSW5wdXQudmFsdWU7XG4gICAgICAgIHRoaXMudmFsdWVJbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy52YWx1ZUlucHV0LnZhbHVlID0gdGhpcy52YWx1ZUJhY2t1cDtcbiAgICAgICAgdGhpcy52YWx1ZUJhY2t1cCA9ICcnO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gWm9vbSBzbGlkZXJcbiAgICBzZWxlY3RBbGwodGhpcy5tb2RhbFRvb2xiYXJCdXR0b25zLCAoYnV0dG9uKSA9PiB7XG4gICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy50b29sYmFyQ2xpY2tlZChidXR0b24sIGV2ZW50KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0SW5wdXRBY2NlcHQoKSB7XG4gICAgbGV0IGFjY2VwdCA9IHRoaXMub3B0aW9ucy5hY2NlcHQ7XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShhY2NlcHQpKSB7XG4gICAgICBhY2NlcHQgPSBhY2NlcHQuam9pbignLCcpO1xuICAgIH1cblxuICAgIHJldHVybiBhY2NlcHQ7XG4gIH1cblxuICBoYW5kbGVGaWxlU2VsZWN0KGZpbGU6IEZpbGUpIHtcbiAgICBpZiAoIXRoaXMuY2hlY2tGaWxlKGZpbGUpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5jcm9wKSB7XG4gICAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXG4gICAgICByZWFkZXIuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLmNyb3BDb250YWluZXIuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgICB0aGlzLmN1cnJlbnRJbWFnZSA9IGV2ZW50LnRhcmdldCEucmVzdWx0IGFzIHN0cmluZztcbiAgICAgICAgdGhpcy5jdXJyZW50RmlsZSA9IGZpbGU7XG5cbiAgICAgICAgLy8gQWZ0ZXIgbW9kYWwgc2hvd24sIGNyb3BwZXIgd2lsbCBhdXRvIGxvYWQuXG4gICAgICAgIHRoaXMubW9kYWwuc2hvdygpO1xuICAgICAgfSk7XG5cbiAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc2F2ZUltYWdlKGZpbGUpO1xuICB9XG5cbiAgYXN5bmMgc2F2ZUNyb3BwZWQoKSB7XG4gICAgY29uc3QgQ3JvcHBlciA9IGF3YWl0IHRoaXMuZ2V0Q3JvcHBlcigpO1xuXG4gICAgQ3JvcHBlci5nZXRDcm9wcGVkQ2FudmFzKHtcbiAgICAgICAgd2lkdGg6IHRoaXMub3B0aW9ucy53aWR0aCxcbiAgICAgICAgaGVpZ2h0OiB0aGlzLm9wdGlvbnMuaGVpZ2h0LFxuICAgICAgICBpbWFnZVNtb290aGluZ0VuYWJsZWQ6IHRydWVcbiAgICAgIH0pXG4gICAgICAudG9CbG9iKChibG9iKSA9PiB7XG4gICAgICAgIGNvbnN0IGZpbGUgPSBuZXcgRmlsZShbIGJsb2IhIF0sIHRoaXMuY3VycmVudEZpbGUhLm5hbWUsIHsgdHlwZTogJ2ltYWdlL3BuZycgfSk7XG4gICAgICAgIHRoaXMuc2F2ZUltYWdlKGZpbGUpO1xuICAgICAgfSwgJ2ltYWdlL3BuZycpO1xuICB9XG5cbiAgYXN5bmMgZ2V0Q3JvcHBlcigpIHtcbiAgICBpZiAodGhpcy5jcm9wcGVyKSB7XG4gICAgICByZXR1cm4gdGhpcy5jcm9wcGVyO1xuICAgIH1cblxuICAgIGNvbnN0IENyb3BwZXIgPSBhd2FpdCBsb2FkQ3JvcHBlcigpO1xuXG4gICAgcmV0dXJuIHRoaXMuY3JvcHBlciA9IG5ldyBDcm9wcGVyKHRoaXMuY3JvcENvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdpbWcnKSEsIHtcbiAgICAgIGFzcGVjdFJhdGlvOiB0aGlzLm9wdGlvbnMud2lkdGggLyB0aGlzLm9wdGlvbnMuaGVpZ2h0LFxuICAgICAgYXV0b0Nyb3BBcmVhOiAxLFxuICAgICAgdmlld01vZGU6IDEsXG4gICAgICBkcmFnTW9kZTogJ21vdmUnLFxuICAgICAgY3JvcEJveE1vdmFibGU6IGZhbHNlLFxuICAgICAgY3JvcEJveFJlc2l6YWJsZTogZmFsc2UsXG4gICAgICByZWFkeTogKGUpID0+IHtcbiAgICAgICAgLy9cbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBhc3luYyB0b29sYmFyQ2xpY2tlZChidXR0b246IEhUTUxCdXR0b25FbGVtZW50LCBldmVudDogTW91c2VFdmVudCkge1xuICAgIGNvbnN0IGNyb3BwZXIgPSBhd2FpdCB0aGlzLmdldENyb3BwZXIoKTtcblxuICAgIGNvbnN0IGRhdGEgPSBjcm9wcGVyLmdldERhdGEoKTtcblxuICAgIHN3aXRjaCAoYnV0dG9uLmRhdGFzZXQuc2lkVG9vbGJhcikge1xuICAgICAgY2FzZSAnem9vbS1pbic6XG4gICAgICAgIGNyb3BwZXIuem9vbSgwLjEpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnem9vbS1vdXQnOlxuICAgICAgICBjcm9wcGVyLnpvb20oLTAuMSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdyb3RhdGUtbGVmdCc6XG4gICAgICAgIGNyb3BwZXIucm90YXRlKC05MCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdyb3RhdGUtcmlnaHQnOlxuICAgICAgICBjcm9wcGVyLnJvdGF0ZSg5MCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdzY2FsZS14JzpcbiAgICAgICAgY3JvcHBlci5zY2FsZVgoLWRhdGEuc2NhbGVYKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3NjYWxlLXknOlxuICAgICAgICBjcm9wcGVyLnNjYWxlWSgtZGF0YS5zY2FsZVkpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBjaGVja0ZpbGUoZmlsZTogRmlsZSk6IGJvb2xlYW4ge1xuICAgIGxldCBhY2NlcHQgPSB0aGlzLm9wdGlvbnMuYWNjZXB0O1xuXG4gICAgaWYgKHR5cGVvZiBhY2NlcHQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBhY2NlcHQgPSBhY2NlcHQuc3BsaXQoJywnKS5tYXAodiA9PiB2LnRyaW0oKSk7XG4gICAgfVxuXG4gICAgaWYgKCFhY2NlcHQubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBsZXQgYWxsb3cgPSBmYWxzZTtcblxuICAgIGZvciAoY29uc3QgdHlwZSBvZiBhY2NlcHQpIHtcbiAgICAgIGlmICh0eXBlLmluZGV4T2YoJy8nKSAhPT0gLTEpIHtcbiAgICAgICAgYWxsb3cgPSBhbGxvdyB8fCB0aGlzLmNvbXBhcmVNaW1lVHlwZSh0eXBlLCBmaWxlLnR5cGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWxsb3cgPSBhbGxvdyB8fCB0eXBlLnRvTG93ZXJDYXNlKCkgPT09IGdldEZpbGVFeHRlbnNpb24oZmlsZSk/LnRvTG93ZXJDYXNlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGFsbG93KSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICB0aGlzLmFsZXJ0KFxuICAgICAgX18oJ3VuaWNvcm4uZmllbGQuc2lkLm1lc3NhZ2UuaW52YWxpZC5pbWFnZS50aXRsZScpLFxuICAgICAgX18oJ3VuaWNvcm4uZmllbGQuc2lkLm1lc3NhZ2UuaW52YWxpZC5pbWFnZS5kZXNjJyksXG4gICAgICAnZXJyb3InXG4gICAgKTtcblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbXBhcmVNaW1lVHlwZShhY2NlcHQ6IHN0cmluZywgbWltZTogc3RyaW5nKSB7XG4gICAgY29uc3QgYWNjZXB0MiA9IGFjY2VwdC5zcGxpdCgnLycpO1xuICAgIGNvbnN0IG1pbWUyID0gbWltZS5zcGxpdCgnLycpO1xuXG4gICAgaWYgKGFjY2VwdDJbMV0gPT09ICcqJykge1xuICAgICAgcmV0dXJuIGFjY2VwdDJbMF0gPT09IG1pbWUyWzBdO1xuICAgIH1cblxuICAgIHJldHVybiBhY2NlcHQgPT09IG1pbWU7XG4gIH1cblxuICBjaGVja1NpemUoaW1hZ2U6IEhUTUxJbWFnZUVsZW1lbnQpOiBib29sZWFuIHtcbiAgICB0cnkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5tYXhfd2lkdGggJiYgdGhpcy5vcHRpb25zLm1heF93aWR0aCA8IGltYWdlLndpZHRoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihfXygndW5pY29ybi5maWVsZC5zaWQubWVzc2FnZS5pbnZhbGlkLnNpemUubWF4LndpZHRoJywgdGhpcy5vcHRpb25zLm1heF93aWR0aCkpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLm1pbl93aWR0aCAmJiB0aGlzLm9wdGlvbnMubWluX3dpZHRoID4gaW1hZ2Uud2lkdGgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKF9fKCd1bmljb3JuLmZpZWxkLnNpZC5tZXNzYWdlLmludmFsaWQuc2l6ZS5taW4ud2lkdGgnLCB0aGlzLm9wdGlvbnMubWluX3dpZHRoKSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMubWF4X2hlaWdodCAmJiB0aGlzLm9wdGlvbnMubWF4X2hlaWdodCA8IGltYWdlLmhlaWdodCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoX18oJ3VuaWNvcm4uZmllbGQuc2lkLm1lc3NhZ2UuaW52YWxpZC5zaXplLm1heC5oZWlnaHQnLCB0aGlzLm9wdGlvbnMubWF4X2hlaWdodCkpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLm1pbl9oZWlnaHQgJiYgdGhpcy5vcHRpb25zLm1pbl9oZWlnaHQgPiBpbWFnZS5oZWlnaHQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKF9fKCd1bmljb3JuLmZpZWxkLnNpZC5tZXNzYWdlLmludmFsaWQuc2l6ZS5taW4uaGVpZ2h0JywgdGhpcy5vcHRpb25zLm1pbl9oZWlnaHQpKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aGlzLmFsZXJ0KFxuICAgICAgICBfXygndW5pY29ybi5maWVsZC5zaWQubWVzc2FnZS5pbnZhbGlkLnNpemUudGl0bGUnKSxcbiAgICAgICAgKGUgYXMgRXJyb3IpLm1lc3NhZ2UsXG4gICAgICAgICdlcnJvcidcbiAgICAgICk7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGFsZXJ0KHRpdGxlOiBzdHJpbmcsIHRleHQgPSAnJywgdHlwZSA9ICdpbmZvJykge1xuICAgIHJldHVybiBzaW1wbGVBbGVydCh0aXRsZSwgdGV4dCwgdHlwZSk7XG4gIH1cblxuICBhc3luYyBzYXZlSW1hZ2UoZmlsZTogRmlsZSkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuYWpheF91cmwpIHtcbiAgICAgIGNvbnN0IGxvYWRpbmcgPSB0aGlzLnF1ZXJ5U2VsZWN0b3I8SFRNTEltYWdlRWxlbWVudD4oJ1tkYXRhLXNpZD1maWxlLXVwbG9hZGluZ10nKSE7XG5cbiAgICAgIHRoaXMucHJldmlld0ltYWdlLnNyYyA9ICcnO1xuICAgICAgdGhpcy5wcmV2aWV3SW1hZ2Uuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIGxvYWRpbmcuc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcblxuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgdGhpcy51cGxvYWRJbWFnZShmaWxlKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgc2ltcGxlQWxlcnQoKGUgYXMgRXJyb3IpLm1lc3NhZ2UpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBsb2FkaW5nLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBAc2VlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS80NzE3MjQwOVxuICAgIC8vIEBzZWUgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzQ3NTIyODEyXG4gICAgY29uc3QgZHQgPSBuZXcgRGF0YVRyYW5zZmVyKCk7XG4gICAgZHQuaXRlbXMuYWRkKGZpbGUpO1xuXG4gICAgLy8gTm8gcmVxdWlyZWQgZm9yIHZhbHVlIGlucHV0IHRvIHJlbW92ZSB2YWxpZGF0aW9uIG1lc3NhZ2VcbiAgICB0aGlzLnZhbHVlSW5wdXQucmVxdWlyZWQgPSBmYWxzZTtcblxuICAgIHRoaXMuZmlsZUlucHV0LmZpbGVzID0gZHQuZmlsZXM7XG4gICAgdGhpcy5maWxlSW5wdXQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2NoYW5nZScsIHsgYnViYmxlczogdHJ1ZSB9KSk7XG4gICAgdGhpcy5maWxlSW5wdXQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2lucHV0JywgeyBidWJibGVzOiB0cnVlIH0pKTtcblxuICAgIHRoaXMuc3RvcmVWYWx1ZSgnJywgVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlKSk7XG4gIH1cblxuICBhc3luYyB1cGxvYWRJbWFnZShmaWxlOiBGaWxlKSB7XG4gICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZpbGUnLCBmaWxlKTtcblxuICAgIGNvbnN0IHsgcG9zdCB9ID0gYXdhaXQgdXNlSHR0cENsaWVudCgpO1xuXG4gICAgcmV0dXJuIHBvc3QodGhpcy5vcHRpb25zLmFqYXhfdXJsISwgZm9ybURhdGEsIHtcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdtdWx0aXBhcnQvZm9ybS1kYXRhJ1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc3RvcmVWYWx1ZSh1cmw6IHN0cmluZywgcHJldmlldzogc3RyaW5nKSB7XG4gICAgdGhpcy5wcmV2aWV3SW1hZ2Uuc3JjID0gcHJldmlldztcbiAgICB0aGlzLnByZXZpZXdJbWFnZS5zdHlsZS5kaXNwbGF5ID0gJ2lubGluZS1ibG9jayc7XG5cbiAgICAvLyBNYWtlIGRlbGV0ZSBib3ggdW5jaGVja2VkXG4gICAgaWYgKHRoaXMucmVtb3ZlQ2hlY2tib3gpIHtcbiAgICAgIHRoaXMucmVtb3ZlQ2hlY2tib3guY2hlY2tlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGlmICh1cmwpIHtcbiAgICAgIHRoaXMudmFsdWVJbnB1dC52YWx1ZSA9IHVybDtcbiAgICB9XG5cbiAgICAvLyBUcmlnZ2VyIGNoYW5nZVxuICAgIHRoaXMucHJldmlld0ltYWdlLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdjaGFuZ2UnLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xuICAgIHRoaXMudmFsdWVJbnB1dC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnY2hhbmdlJywgeyBidWJibGVzOiB0cnVlIH0pKTtcbiAgICB0aGlzLnZhbHVlSW5wdXQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2lucHV0JywgeyBidWJibGVzOiB0cnVlIH0pKTtcbiAgfVxufVxuXG4vLyBQcm9taXNlLmFsbChbXG4vLyAgIGltcG9ydCgnQGNyb3BwZXJqcy9jcm9wcGVyLm1pbi5qcycpLFxuLy8gICBpbXBvcnQoJ0Bjcm9wcGVyanMvY3JvcHBlci5jc3MnKSxcbi8vIF0pXG4vLyAgIC50aGVuKChzZXJ2aWNlKSA9PiB7XG4vLyAgICAgY29uc3Qgc3R5bGVTaGVldCA9IHNlcnZpY2VbMV0uZGVmYXVsdDtcbi8vICAgICBkb2N1bWVudC5hZG9wdGVkU3R5bGVTaGVldHMgPSBbLi4uZG9jdW1lbnQuYWRvcHRlZFN0eWxlU2hlZXRzLCBzdHlsZVNoZWV0XTtcbi8vICAgfSk7XG5cbmN1c3RvbUVsZW1lbnRzLmRlZmluZShTaW5nbGVJbWFnZURyYWdFbGVtZW50LmlzLCBTaW5nbGVJbWFnZURyYWdFbGVtZW50KTtcblxuZnVuY3Rpb24gZ2V0RmlsZUV4dGVuc2lvbihmaWxlOiBGaWxlKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgY29uc3QgcGFydHMgPSBmaWxlLm5hbWUuc3BsaXQoJy4nKTtcbiAgaWYgKHBhcnRzLmxlbmd0aCA+IDEpIHtcbiAgICByZXR1cm4gcGFydHMucG9wKCk7XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuYXN5bmMgZnVuY3Rpb24gbG9hZENyb3BwZXIoKTogUHJvbWlzZTx0eXBlb2YgQ3JvcHBlcj4ge1xuICBjb25zdCBbbW9kdWxlXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICBpbXBvcnQoJ2Nyb3BwZXJqcycpLFxuICAgIGltcG9ydCgnY3JvcHBlcmpzL2Rpc3QvY3JvcHBlci5taW4uY3NzP2lubGluZScpLnRoZW4oKHsgZGVmYXVsdDogY3NzIH0pID0+IHtcbiAgICAgIGluamVjdENzc1RvRG9jdW1lbnQoY3NzKTtcbiAgICB9KVxuICBdKTtcblxuICByZXR1cm4gbW9kdWxlLmRlZmF1bHQ7XG59XG5cbmxvYWRDcm9wcGVyKCk7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2luZ2xlSW1hZ2VEcmFnTW9kdWxlIHtcbiAgU2luZ2xlSW1hZ2VEcmFnRWxlbWVudDogdHlwZW9mIFNpbmdsZUltYWdlRHJhZ0VsZW1lbnQ7XG59XG4iXSwibmFtZXMiOlsiY3NzIl0sIm1hcHBpbmdzIjoiOzs7QUFRQSxvQ0FBb0IsR0FBRztBQWV2QixNQUFNLGlCQUFrRDtBQUFBLEVBQ3RELFFBQVE7QUFBQSxJQUNOO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQUE7QUFBQSxFQUVGLE1BQU07QUFBQSxFQUNOLE9BQU87QUFBQSxFQUNQLFFBQVE7QUFDVjtBQUVPLE1BQU0sK0JBQStCLFlBQVk7QUFBQSxFQUN0RCxPQUFPLEtBQUs7QUFBQSxFQUVaLGVBQWU7QUFBQSxFQUNmLGNBQWdDO0FBQUEsRUFDaEMsV0FBVztBQUFBLEVBQ1gsY0FBYztBQUFBLEVBRU47QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxF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
