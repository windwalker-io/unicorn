import { Modal } from "bootstrap";
import { a1 as mergeDeep, w as selectAll, _ as __, G as simpleAlert, u as useHttpClient, a3 as injectCssToDocument } from "./unicorn-G5leHO5V.js";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGQtc2luZ2xlLWltYWdlLWRyYWctT0Jaa3BfbUsuanMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2R1bGUvZmllbGQtc2luZ2xlLWltYWdlLWRyYWcudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXHJcbmltcG9ydCB7IHVzZUh0dHBDbGllbnQgfSBmcm9tICcuLi9jb21wb3NhYmxlJztcclxuaW1wb3J0IHsgX18sIGluamVjdENzc1RvRG9jdW1lbnQsIHNlbGVjdEFsbCwgc2ltcGxlQWxlcnQgfSBmcm9tICcuLi9zZXJ2aWNlJztcclxuaW1wb3J0IHsgbWVyZ2VEZWVwIH0gZnJvbSAnLi4vdXRpbGl0aWVzJztcclxuaW1wb3J0IGNzcyBmcm9tICcuLi8uLi9zY3NzL2ZpZWxkL3NpbmdsZS1pbWFnZS1kcmFnLnNjc3M/aW5saW5lJztcclxuaW1wb3J0IHsgTW9kYWwgfSBmcm9tICdib290c3RyYXAnO1xyXG5pbXBvcnQgdHlwZSBDcm9wcGVyIGZyb20gJ2Nyb3BwZXJqcyc7XHJcblxyXG5pbmplY3RDc3NUb0RvY3VtZW50KGNzcyk7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFNpbmdsZUltYWdlRHJhZ09wdGlvbnMge1xyXG4gIGFjY2VwdDogc3RyaW5nIHwgc3RyaW5nW107XHJcbiAgYWpheF91cmw/OiBzdHJpbmc7XHJcbiAgY3JvcDogYm9vbGVhbjtcclxuICB3aWR0aDogbnVtYmVyO1xyXG4gIGhlaWdodDogbnVtYmVyO1xyXG4gIG1heF93aWR0aD86IG51bWJlcjtcclxuICBtaW5fd2lkdGg/OiBudW1iZXI7XHJcbiAgbWF4X2hlaWdodD86IG51bWJlcjtcclxuICBtaW5faGVpZ2h0PzogbnVtYmVyO1xyXG4gIG1vZGFsVGFyZ2V0OiBzdHJpbmc7XHJcbn1cclxuXHJcbmNvbnN0IGRlZmF1bHRPcHRpb25zOiBQYXJ0aWFsPFNpbmdsZUltYWdlRHJhZ09wdGlvbnM+ID0ge1xyXG4gIGFjY2VwdDogW1xyXG4gICAgJ2ltYWdlL2pwZWcnLFxyXG4gICAgJ2ltYWdlL3BuZycsXHJcbiAgICAnaW1hZ2Uvd2VicCcsXHJcbiAgICAnaW1hZ2UvYXZpZicsXHJcbiAgICAnaW1hZ2UvZ2lmJyxcclxuICBdLFxyXG4gIGNyb3A6IGZhbHNlLFxyXG4gIHdpZHRoOiA4MDAsXHJcbiAgaGVpZ2h0OiA4MDAsXHJcbn07XHJcblxyXG5leHBvcnQgY2xhc3MgU2luZ2xlSW1hZ2VEcmFnRWxlbWVudCBleHRlbmRzIEhUTUxFbGVtZW50IHtcclxuICBzdGF0aWMgaXMgPSAndW5pLXNpZCc7XHJcblxyXG4gIGN1cnJlbnRJbWFnZSA9ICcnO1xyXG4gIGN1cnJlbnRGaWxlOiBGaWxlIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xyXG4gIGxhc3Rab29tID0gMDtcclxuICB2YWx1ZUJhY2t1cCA9ICcnO1xyXG5cclxuICBwcml2YXRlIG9wdGlvbnMhOiBTaW5nbGVJbWFnZURyYWdPcHRpb25zO1xyXG4gIHByaXZhdGUgdmFsdWVJbnB1dCE6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgcHJpdmF0ZSBmaWxlSW5wdXQhOiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gIHByaXZhdGUgc2VsZWN0QnV0dG9uITogSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgcHJpdmF0ZSBwYXN0ZUJ1dHRvbiE6IEhUTUxCdXR0b25FbGVtZW50O1xyXG4gIHByaXZhdGUgZHJhZ2FyZWEhOiBIVE1MRGl2RWxlbWVudDtcclxuICBwcml2YXRlIHByZXZpZXdJbWFnZSE6IEhUTUxJbWFnZUVsZW1lbnQ7XHJcbiAgcHJpdmF0ZSByZW1vdmVDaGVja2JveCE6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgcHJpdmF0ZSBtb2RhbEVsZW1lbnQhOiBIVE1MRGl2RWxlbWVudDtcclxuICBwcml2YXRlIG1vZGFsITogTW9kYWw7XHJcbiAgcHJpdmF0ZSBjcm9wQ29udGFpbmVyITogSFRNTERpdkVsZW1lbnQ7XHJcbiAgcHJpdmF0ZSBzYXZlYnV0dG9uITogSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgcHJpdmF0ZSBtb2RhbFRvb2xiYXJCdXR0b25zITogTm9kZUxpc3RPZjxIVE1MQnV0dG9uRWxlbWVudD47XHJcbiAgcHJpdmF0ZSBjcm9wcGVyITogQ3JvcHBlcjtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBzdXBlcigpO1xyXG4gIH1cclxuXHJcbiAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XHJcbiAgICB0aGlzLm9wdGlvbnMgPSBtZXJnZURlZXAoXHJcbiAgICAgIHt9LFxyXG4gICAgICBkZWZhdWx0T3B0aW9ucyxcclxuICAgICAgSlNPTi5wYXJzZSh0aGlzLmdldEF0dHJpYnV0ZSgnb3B0aW9ucycpIHx8ICd7fScpXHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMudmFsdWVJbnB1dCA9IHRoaXMucXVlcnlTZWxlY3RvcjxIVE1MSW5wdXRFbGVtZW50PignW2RhdGEtZmllbGQtaW5wdXRdJykhO1xyXG4gICAgdGhpcy5maWxlSW5wdXQgPSB0aGlzLnF1ZXJ5U2VsZWN0b3I8SFRNTElucHV0RWxlbWVudD4oJ1tkYXRhLXNpZD1maWxlXScpITtcclxuICAgIHRoaXMuc2VsZWN0QnV0dG9uID0gdGhpcy5xdWVyeVNlbGVjdG9yPEhUTUxCdXR0b25FbGVtZW50PignW2RhdGEtc2lkPXNlbGVjdF0nKSE7XHJcbiAgICB0aGlzLnBhc3RlQnV0dG9uID0gdGhpcy5xdWVyeVNlbGVjdG9yPEhUTUxCdXR0b25FbGVtZW50PignW2RhdGEtc2lkPXBhc3RlXScpITtcclxuICAgIHRoaXMuZHJhZ2FyZWEgPSB0aGlzLnF1ZXJ5U2VsZWN0b3I8SFRNTERpdkVsZW1lbnQ+KCdbZGF0YS1zaWQ9ZHJhZ2FyZWFdJykhO1xyXG4gICAgdGhpcy5wcmV2aWV3SW1hZ2UgPSB0aGlzLnF1ZXJ5U2VsZWN0b3I8SFRNTEltYWdlRWxlbWVudD4oJ1tkYXRhLXNpZD1wcmV2aWV3XScpITtcclxuICAgIHRoaXMucmVtb3ZlQ2hlY2tib3ggPSB0aGlzLnF1ZXJ5U2VsZWN0b3I8SFRNTElucHV0RWxlbWVudD4oJ1tkYXRhLXNpZD1yZW1vdmVdJykhO1xyXG5cclxuICAgIHRoaXMubW9kYWxFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRGl2RWxlbWVudD4odGhpcy5vcHRpb25zLm1vZGFsVGFyZ2V0KSE7XHJcbiAgICB0aGlzLm1vZGFsID0gTW9kYWwuZ2V0T3JDcmVhdGVJbnN0YW5jZSh0aGlzLm1vZGFsRWxlbWVudCk7XHJcbiAgICB0aGlzLmNyb3BDb250YWluZXIgPSB0aGlzLm1vZGFsRWxlbWVudC5xdWVyeVNlbGVjdG9yPEhUTUxEaXZFbGVtZW50PignW2RhdGEtc2lkPVwiY3JvcC1jb250YWluZXJcIl0nKSE7XHJcbiAgICB0aGlzLnNhdmVidXR0b24gPSB0aGlzLm1vZGFsRWxlbWVudC5xdWVyeVNlbGVjdG9yPEhUTUxCdXR0b25FbGVtZW50PignW2RhdGEtc2lkPXNhdmUtYnV0dG9uXScpITtcclxuICAgIHRoaXMubW9kYWxUb29sYmFyQnV0dG9ucyA9IHRoaXMubW9kYWxFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEJ1dHRvbkVsZW1lbnQ+KCdbZGF0YS1zaWQtdG9vbGJhcl0nKTtcclxuXHJcbiAgICBjb25zdCBtb2RhbFNob3duID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICBjb25zdCBjcm9wcGVyID0gYXdhaXQgdGhpcy5nZXRDcm9wcGVyKCk7XHJcbiAgICAgIGNyb3BwZXIucmVwbGFjZSh0aGlzLmN1cnJlbnRJbWFnZSk7XHJcbiAgICAgIHRoaXMuY3JvcENvbnRhaW5lci5zdHlsZS52aXNpYmlsaXR5ID0gJyc7XHJcbiAgICAgIHRoaXMuY3VycmVudEltYWdlID0gJyc7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMubW9kYWxFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Nob3duLmJzLm1vZGFsJywgbW9kYWxTaG93bi5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICB0aGlzLnNhdmVidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMuc2F2ZUNyb3BwZWQoKTtcclxuICAgICAgdGhpcy5tb2RhbC5oaWRlKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcclxuXHJcbiAgICB0aGlzLnN0eWxlLnZpc2liaWxpdHkgPSAnJztcclxuICB9XHJcblxyXG4gIGJpbmRFdmVudHMoKSB7XHJcbiAgICB0aGlzLmRyYWdhcmVhLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgKGV2ZW50KSA9PiB7XHJcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgdGhpcy5kcmFnYXJlYS5jbGFzc0xpc3QuYWRkKCdob3ZlcicpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5kcmFnYXJlYS5hZGRFdmVudExpc3RlbmVyKCdkcmFnbGVhdmUnLCAoZXZlbnQpID0+IHtcclxuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICB0aGlzLmRyYWdhcmVhLmNsYXNzTGlzdC5yZW1vdmUoJ2hvdmVyJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmRyYWdhcmVhLmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCAoZXZlbnQpID0+IHtcclxuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICB0aGlzLmRyYWdhcmVhLmNsYXNzTGlzdC5yZW1vdmUoJ2hvdmVyJyk7XHJcblxyXG4gICAgICBjb25zdCBmaWxlcyA9IChldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkuZmlsZXMgfHwgZXZlbnQuZGF0YVRyYW5zZmVyPy5maWxlcyB8fCBbXTtcclxuICAgICAgdGhpcy5oYW5kbGVGaWxlU2VsZWN0KGZpbGVzWzBdKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIFNlbGVjdCBidXR0b25cclxuICAgIHRoaXMuc2VsZWN0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XHJcbiAgICAgIGlucHV0LnNldEF0dHJpYnV0ZSgndHlwZScsICdmaWxlJyk7XHJcbiAgICAgIGlucHV0LnNldEF0dHJpYnV0ZSgnYWNjZXB0JywgdGhpcy5nZXRJbnB1dEFjY2VwdCgpKTtcclxuICAgICAgaW5wdXQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcclxuICAgICAgICB0aGlzLmhhbmRsZUZpbGVTZWxlY3QoaW5wdXQuZmlsZXMhWzBdISk7XHJcblxyXG4gICAgICAgIGlucHV0LnJlbW92ZSgpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaW5wdXQpO1xyXG4gICAgICBpbnB1dC5jbGljaygpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5wYXN0ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgbmF2aWdhdG9yLmNsaXBib2FyZC5yZWFkKCkudGhlbigoaXRlbXMpID0+IHtcclxuICAgICAgICBsZXQgdHlwZXMgPSBpdGVtc1swXS50eXBlcztcclxuXHJcbiAgICAgICAgaWYgKHR5cGVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgdGhpcy5hbGVydCgnVGhpcyBicm93c2VyIHVuYWJsZSB0byBnZXQgY2xpcGJvYXJkIGRhdGEuJyk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0eXBlcyA9IHR5cGVzLnNsaWNlKCkuc29ydCgpO1xyXG5cclxuICAgICAgICBjb25zdCB0eXBlID0gdHlwZXNbMF07XHJcblxyXG4gICAgICAgIGl0ZW1zWzBdLmdldFR5cGUodHlwZSkudGhlbigoYmxvYikgPT4ge1xyXG4gICAgICAgICAgdGhpcy5oYW5kbGVGaWxlU2VsZWN0KG5ldyBGaWxlKFsgYmxvYiBdLCAnaW1hZ2UucG5nJywgeyB0eXBlIH0pKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBEZWxldGVcclxuICAgIHRoaXMucmVtb3ZlQ2hlY2tib3g/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICBpZiAodGhpcy5yZW1vdmVDaGVja2JveC5jaGVja2VkKSB7XHJcbiAgICAgICAgdGhpcy52YWx1ZUJhY2t1cCA9IHRoaXMudmFsdWVJbnB1dC52YWx1ZTtcclxuICAgICAgICB0aGlzLnZhbHVlSW5wdXQudmFsdWUgPSAnJztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnZhbHVlSW5wdXQudmFsdWUgPSB0aGlzLnZhbHVlQmFja3VwO1xyXG4gICAgICAgIHRoaXMudmFsdWVCYWNrdXAgPSAnJztcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gWm9vbSBzbGlkZXJcclxuICAgIHNlbGVjdEFsbCh0aGlzLm1vZGFsVG9vbGJhckJ1dHRvbnMsIChidXR0b24pID0+IHtcclxuICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgdGhpcy50b29sYmFyQ2xpY2tlZChidXR0b24sIGV2ZW50KTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldElucHV0QWNjZXB0KCkge1xyXG4gICAgbGV0IGFjY2VwdCA9IHRoaXMub3B0aW9ucy5hY2NlcHQ7XHJcblxyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoYWNjZXB0KSkge1xyXG4gICAgICBhY2NlcHQgPSBhY2NlcHQuam9pbignLCcpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhY2NlcHQ7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVGaWxlU2VsZWN0KGZpbGU6IEZpbGUpIHtcclxuICAgIGlmICghdGhpcy5jaGVja0ZpbGUoZmlsZSkpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLm9wdGlvbnMuY3JvcCkge1xyXG4gICAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG5cclxuICAgICAgcmVhZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZXZlbnQpID0+IHtcclxuICAgICAgICB0aGlzLmNyb3BDb250YWluZXIuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xyXG4gICAgICAgIHRoaXMuY3VycmVudEltYWdlID0gZXZlbnQudGFyZ2V0IS5yZXN1bHQgYXMgc3RyaW5nO1xyXG4gICAgICAgIHRoaXMuY3VycmVudEZpbGUgPSBmaWxlO1xyXG5cclxuICAgICAgICAvLyBBZnRlciBtb2RhbCBzaG93biwgY3JvcHBlciB3aWxsIGF1dG8gbG9hZC5cclxuICAgICAgICB0aGlzLm1vZGFsLnNob3coKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICByZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc2F2ZUltYWdlKGZpbGUpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgc2F2ZUNyb3BwZWQoKSB7XHJcbiAgICBjb25zdCBDcm9wcGVyID0gYXdhaXQgdGhpcy5nZXRDcm9wcGVyKCk7XHJcblxyXG4gICAgQ3JvcHBlci5nZXRDcm9wcGVkQ2FudmFzKHtcclxuICAgICAgICB3aWR0aDogdGhpcy5vcHRpb25zLndpZHRoLFxyXG4gICAgICAgIGhlaWdodDogdGhpcy5vcHRpb25zLmhlaWdodCxcclxuICAgICAgICBpbWFnZVNtb290aGluZ0VuYWJsZWQ6IHRydWVcclxuICAgICAgfSlcclxuICAgICAgLnRvQmxvYigoYmxvYikgPT4ge1xyXG4gICAgICAgIGNvbnN0IGZpbGUgPSBuZXcgRmlsZShbIGJsb2IhIF0sIHRoaXMuY3VycmVudEZpbGUhLm5hbWUsIHsgdHlwZTogJ2ltYWdlL3BuZycgfSk7XHJcbiAgICAgICAgdGhpcy5zYXZlSW1hZ2UoZmlsZSk7XHJcbiAgICAgIH0sICdpbWFnZS9wbmcnKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIGdldENyb3BwZXIoKSB7XHJcbiAgICBpZiAodGhpcy5jcm9wcGVyKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmNyb3BwZXI7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgQ3JvcHBlciA9IGF3YWl0IGxvYWRDcm9wcGVyKCk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuY3JvcHBlciA9IG5ldyBDcm9wcGVyKHRoaXMuY3JvcENvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdpbWcnKSEsIHtcclxuICAgICAgYXNwZWN0UmF0aW86IHRoaXMub3B0aW9ucy53aWR0aCAvIHRoaXMub3B0aW9ucy5oZWlnaHQsXHJcbiAgICAgIGF1dG9Dcm9wQXJlYTogMSxcclxuICAgICAgdmlld01vZGU6IDEsXHJcbiAgICAgIGRyYWdNb2RlOiAnbW92ZScsXHJcbiAgICAgIGNyb3BCb3hNb3ZhYmxlOiBmYWxzZSxcclxuICAgICAgY3JvcEJveFJlc2l6YWJsZTogZmFsc2UsXHJcbiAgICAgIHJlYWR5OiAoZSkgPT4ge1xyXG4gICAgICAgIC8vXHJcbiAgICAgIH0sXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGFzeW5jIHRvb2xiYXJDbGlja2VkKGJ1dHRvbjogSFRNTEJ1dHRvbkVsZW1lbnQsIGV2ZW50OiBNb3VzZUV2ZW50KSB7XHJcbiAgICBjb25zdCBjcm9wcGVyID0gYXdhaXQgdGhpcy5nZXRDcm9wcGVyKCk7XHJcblxyXG4gICAgY29uc3QgZGF0YSA9IGNyb3BwZXIuZ2V0RGF0YSgpO1xyXG5cclxuICAgIHN3aXRjaCAoYnV0dG9uLmRhdGFzZXQuc2lkVG9vbGJhcikge1xyXG4gICAgICBjYXNlICd6b29tLWluJzpcclxuICAgICAgICBjcm9wcGVyLnpvb20oMC4xKTtcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIGNhc2UgJ3pvb20tb3V0JzpcclxuICAgICAgICBjcm9wcGVyLnpvb20oLTAuMSk7XHJcbiAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICBjYXNlICdyb3RhdGUtbGVmdCc6XHJcbiAgICAgICAgY3JvcHBlci5yb3RhdGUoLTkwKTtcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIGNhc2UgJ3JvdGF0ZS1yaWdodCc6XHJcbiAgICAgICAgY3JvcHBlci5yb3RhdGUoOTApO1xyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgY2FzZSAnc2NhbGUteCc6XHJcbiAgICAgICAgY3JvcHBlci5zY2FsZVgoLWRhdGEuc2NhbGVYKTtcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIGNhc2UgJ3NjYWxlLXknOlxyXG4gICAgICAgIGNyb3BwZXIuc2NhbGVZKC1kYXRhLnNjYWxlWSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjaGVja0ZpbGUoZmlsZTogRmlsZSk6IGJvb2xlYW4ge1xyXG4gICAgbGV0IGFjY2VwdCA9IHRoaXMub3B0aW9ucy5hY2NlcHQ7XHJcblxyXG4gICAgaWYgKHR5cGVvZiBhY2NlcHQgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIGFjY2VwdCA9IGFjY2VwdC5zcGxpdCgnLCcpLm1hcCh2ID0+IHYudHJpbSgpKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIWFjY2VwdC5sZW5ndGgpIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGFsbG93ID0gZmFsc2U7XHJcblxyXG4gICAgZm9yIChjb25zdCB0eXBlIG9mIGFjY2VwdCkge1xyXG4gICAgICBpZiAodHlwZS5pbmRleE9mKCcvJykgIT09IC0xKSB7XHJcbiAgICAgICAgYWxsb3cgPSBhbGxvdyB8fCB0aGlzLmNvbXBhcmVNaW1lVHlwZSh0eXBlLCBmaWxlLnR5cGUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGFsbG93ID0gYWxsb3cgfHwgdHlwZS50b0xvd2VyQ2FzZSgpID09PSBnZXRGaWxlRXh0ZW5zaW9uKGZpbGUpPy50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGFsbG93KSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuYWxlcnQoXHJcbiAgICAgIF9fKCd1bmljb3JuLmZpZWxkLnNpZC5tZXNzYWdlLmludmFsaWQuaW1hZ2UudGl0bGUnKSxcclxuICAgICAgX18oJ3VuaWNvcm4uZmllbGQuc2lkLm1lc3NhZ2UuaW52YWxpZC5pbWFnZS5kZXNjJyksXHJcbiAgICAgICdlcnJvcidcclxuICAgICk7XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgY29tcGFyZU1pbWVUeXBlKGFjY2VwdDogc3RyaW5nLCBtaW1lOiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IGFjY2VwdDIgPSBhY2NlcHQuc3BsaXQoJy8nKTtcclxuICAgIGNvbnN0IG1pbWUyID0gbWltZS5zcGxpdCgnLycpO1xyXG5cclxuICAgIGlmIChhY2NlcHQyWzFdID09PSAnKicpIHtcclxuICAgICAgcmV0dXJuIGFjY2VwdDJbMF0gPT09IG1pbWUyWzBdO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhY2NlcHQgPT09IG1pbWU7XHJcbiAgfVxyXG5cclxuICBjaGVja1NpemUoaW1hZ2U6IEhUTUxJbWFnZUVsZW1lbnQpOiBib29sZWFuIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMubWF4X3dpZHRoICYmIHRoaXMub3B0aW9ucy5tYXhfd2lkdGggPCBpbWFnZS53aWR0aCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihfXygndW5pY29ybi5maWVsZC5zaWQubWVzc2FnZS5pbnZhbGlkLnNpemUubWF4LndpZHRoJywgdGhpcy5vcHRpb25zLm1heF93aWR0aCkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLm1pbl93aWR0aCAmJiB0aGlzLm9wdGlvbnMubWluX3dpZHRoID4gaW1hZ2Uud2lkdGgpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoX18oJ3VuaWNvcm4uZmllbGQuc2lkLm1lc3NhZ2UuaW52YWxpZC5zaXplLm1pbi53aWR0aCcsIHRoaXMub3B0aW9ucy5taW5fd2lkdGgpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5tYXhfaGVpZ2h0ICYmIHRoaXMub3B0aW9ucy5tYXhfaGVpZ2h0IDwgaW1hZ2UuaGVpZ2h0KSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKF9fKCd1bmljb3JuLmZpZWxkLnNpZC5tZXNzYWdlLmludmFsaWQuc2l6ZS5tYXguaGVpZ2h0JywgdGhpcy5vcHRpb25zLm1heF9oZWlnaHQpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5taW5faGVpZ2h0ICYmIHRoaXMub3B0aW9ucy5taW5faGVpZ2h0ID4gaW1hZ2UuaGVpZ2h0KSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKF9fKCd1bmljb3JuLmZpZWxkLnNpZC5tZXNzYWdlLmludmFsaWQuc2l6ZS5taW4uaGVpZ2h0JywgdGhpcy5vcHRpb25zLm1pbl9oZWlnaHQpKTtcclxuICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICB0aGlzLmFsZXJ0KFxyXG4gICAgICAgIF9fKCd1bmljb3JuLmZpZWxkLnNpZC5tZXNzYWdlLmludmFsaWQuc2l6ZS50aXRsZScpLFxyXG4gICAgICAgIChlIGFzIEVycm9yKS5tZXNzYWdlLFxyXG4gICAgICAgICdlcnJvcidcclxuICAgICAgKTtcclxuXHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGFsZXJ0KHRpdGxlOiBzdHJpbmcsIHRleHQgPSAnJywgdHlwZSA9ICdpbmZvJykge1xyXG4gICAgcmV0dXJuIHNpbXBsZUFsZXJ0KHRpdGxlLCB0ZXh0LCB0eXBlKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIHNhdmVJbWFnZShmaWxlOiBGaWxlKSB7XHJcbiAgICBpZiAodGhpcy5vcHRpb25zLmFqYXhfdXJsKSB7XHJcbiAgICAgIGNvbnN0IGxvYWRpbmcgPSB0aGlzLnF1ZXJ5U2VsZWN0b3I8SFRNTEltYWdlRWxlbWVudD4oJ1tkYXRhLXNpZD1maWxlLXVwbG9hZGluZ10nKSE7XHJcblxyXG4gICAgICB0aGlzLnByZXZpZXdJbWFnZS5zcmMgPSAnJztcclxuICAgICAgdGhpcy5wcmV2aWV3SW1hZ2Uuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgbG9hZGluZy5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnO1xyXG5cclxuICAgICAgdHJ5IHtcclxuICAgICAgICBhd2FpdCB0aGlzLnVwbG9hZEltYWdlKGZpbGUpO1xyXG4gICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihlKTtcclxuICAgICAgICBzaW1wbGVBbGVydCgoZSBhcyBFcnJvcikubWVzc2FnZSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9IGZpbmFsbHkge1xyXG4gICAgICAgIGxvYWRpbmcuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEBzZWUgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzQ3MTcyNDA5XHJcbiAgICAvLyBAc2VlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS80NzUyMjgxMlxyXG4gICAgY29uc3QgZHQgPSBuZXcgRGF0YVRyYW5zZmVyKCk7XHJcbiAgICBkdC5pdGVtcy5hZGQoZmlsZSk7XHJcblxyXG4gICAgLy8gTm8gcmVxdWlyZWQgZm9yIHZhbHVlIGlucHV0IHRvIHJlbW92ZSB2YWxpZGF0aW9uIG1lc3NhZ2VcclxuICAgIHRoaXMudmFsdWVJbnB1dC5yZXF1aXJlZCA9IGZhbHNlO1xyXG5cclxuICAgIHRoaXMuZmlsZUlucHV0LmZpbGVzID0gZHQuZmlsZXM7XHJcbiAgICB0aGlzLmZpbGVJbnB1dC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnY2hhbmdlJywgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgIHRoaXMuZmlsZUlucHV0LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdpbnB1dCcsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcblxyXG4gICAgdGhpcy5zdG9yZVZhbHVlKCcnLCBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIHVwbG9hZEltYWdlKGZpbGU6IEZpbGUpIHtcclxuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XHJcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZpbGUnLCBmaWxlKTtcclxuXHJcbiAgICBjb25zdCB7IHBvc3QgfSA9IGF3YWl0IHVzZUh0dHBDbGllbnQoKTtcclxuXHJcbiAgICByZXR1cm4gcG9zdCh0aGlzLm9wdGlvbnMuYWpheF91cmwhLCBmb3JtRGF0YSwge1xyXG4gICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdtdWx0aXBhcnQvZm9ybS1kYXRhJ1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHN0b3JlVmFsdWUodXJsOiBzdHJpbmcsIHByZXZpZXc6IHN0cmluZykge1xyXG4gICAgdGhpcy5wcmV2aWV3SW1hZ2Uuc3JjID0gcHJldmlldztcclxuICAgIHRoaXMucHJldmlld0ltYWdlLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lLWJsb2NrJztcclxuXHJcbiAgICAvLyBNYWtlIGRlbGV0ZSBib3ggdW5jaGVja2VkXHJcbiAgICBpZiAodGhpcy5yZW1vdmVDaGVja2JveCkge1xyXG4gICAgICB0aGlzLnJlbW92ZUNoZWNrYm94LmNoZWNrZWQgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodXJsKSB7XHJcbiAgICAgIHRoaXMudmFsdWVJbnB1dC52YWx1ZSA9IHVybDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBUcmlnZ2VyIGNoYW5nZVxyXG4gICAgdGhpcy5wcmV2aWV3SW1hZ2UuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2NoYW5nZScsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICB0aGlzLnZhbHVlSW5wdXQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2NoYW5nZScsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICB0aGlzLnZhbHVlSW5wdXQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2lucHV0JywgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICB9XHJcbn1cclxuXHJcbi8vIFByb21pc2UuYWxsKFtcclxuLy8gICBpbXBvcnQoJ0Bjcm9wcGVyanMvY3JvcHBlci5taW4uanMnKSxcclxuLy8gICBpbXBvcnQoJ0Bjcm9wcGVyanMvY3JvcHBlci5jc3MnKSxcclxuLy8gXSlcclxuLy8gICAudGhlbigoc2VydmljZSkgPT4ge1xyXG4vLyAgICAgY29uc3Qgc3R5bGVTaGVldCA9IHNlcnZpY2VbMV0uZGVmYXVsdDtcclxuLy8gICAgIGRvY3VtZW50LmFkb3B0ZWRTdHlsZVNoZWV0cyA9IFsuLi5kb2N1bWVudC5hZG9wdGVkU3R5bGVTaGVldHMsIHN0eWxlU2hlZXRdO1xyXG4vLyAgIH0pO1xyXG5cclxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKFNpbmdsZUltYWdlRHJhZ0VsZW1lbnQuaXMsIFNpbmdsZUltYWdlRHJhZ0VsZW1lbnQpO1xyXG5cclxuZnVuY3Rpb24gZ2V0RmlsZUV4dGVuc2lvbihmaWxlOiBGaWxlKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcclxuICBjb25zdCBwYXJ0cyA9IGZpbGUubmFtZS5zcGxpdCgnLicpO1xyXG4gIGlmIChwYXJ0cy5sZW5ndGggPiAxKSB7XHJcbiAgICByZXR1cm4gcGFydHMucG9wKCk7XHJcbiAgfVxyXG4gIHJldHVybiB1bmRlZmluZWQ7XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGxvYWRDcm9wcGVyKCk6IFByb21pc2U8dHlwZW9mIENyb3BwZXI+IHtcclxuICBjb25zdCBbbW9kdWxlXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcclxuICAgIGltcG9ydCgnY3JvcHBlcmpzJyksXHJcbiAgICBpbXBvcnQoJ2Nyb3BwZXJqcy9kaXN0L2Nyb3BwZXIubWluLmNzcz9pbmxpbmUnKS50aGVuKCh7IGRlZmF1bHQ6IGNzcyB9KSA9PiB7XHJcbiAgICAgIGluamVjdENzc1RvRG9jdW1lbnQoY3NzKTtcclxuICAgIH0pXHJcbiAgXSk7XHJcblxyXG4gIHJldHVybiBtb2R1bGUuZGVmYXVsdDtcclxufVxyXG5cclxubG9hZENyb3BwZXIoKTtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgU2luZ2xlSW1hZ2VEcmFnTW9kdWxlIHtcclxuICBTaW5nbGVJbWFnZURyYWdFbGVtZW50OiB0eXBlb2YgU2luZ2xlSW1hZ2VEcmFnRWxlbWVudDtcclxufVxyXG4iXSwibmFtZXMiOlsiY3NzIl0sIm1hcHBpbmdzIjoiOzs7QUFRQSxvQ0FBb0IsR0FBRztBQWV2QixNQUFNLGlCQUFrRDtBQUFBLEVBQ3RELFFBQVE7QUFBQSxJQUNOO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQUE7QUFBQSxFQUVGLE1BQU07QUFBQSxFQUNOLE9BQU87QUFBQSxFQUNQLFFBQVE7QUFDVjtBQUVPLE1BQU0sK0JBQStCLFlBQVk7QUFBQSxFQUN0RCxPQUFPLEtBQUs7QUFBQSxFQUVaLGVBQWU7QUFBQSxFQUNmLGNBQWdDO0FBQUEsRUFDaEMsV0FBVztBQUFBLEVBQ1gsY0FBYztBQUFBLEVBRU47QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxF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
