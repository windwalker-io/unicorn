import { Modal } from "bootstrap";
import Cropper from "cropperjs";
import { m as mergeDeep, p as selectAll, _ as __, e as simpleAlert, j as useHttpClient, z as injectCssToDocument } from "./unicorn-DuXOh8pQ.js";
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
  currentFile;
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
    const modalShown = () => {
      const cropper = this.getCropper();
      cropper.replace(this.currentImage);
      this.cropContainer.style.visibility = "";
      this.currentImage = null;
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
      const files = event.target.files || event.dataTransfer.files;
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
  saveCropped() {
    this.getCropper().getCroppedCanvas({
      width: this.options.width,
      height: this.options.height,
      imageSmoothingEnabled: true
    }).toBlob((blob) => {
      const file = new File([blob], this.currentFile.name, { type: "image/png" });
      this.saveImage(file);
    }, "image/png");
  }
  getCropper() {
    return this.cropper = this.cropper || (() => {
      const cropper = new Cropper(this.cropContainer.querySelector("img"), {
        aspectRatio: this.options.width / this.options.height,
        autoCropArea: 1,
        viewMode: 1,
        dragMode: "move",
        cropBoxMovable: false,
        cropBoxResizable: false,
        ready: (e) => {
        }
      });
      return cropper;
    })();
  }
  toolbarClicked(button, event) {
    const cropper = this.getCropper();
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
  /**
   * Check image size.
   *
   * @param {Image} image
   *
   * @returns {boolean}
   */
  checkSize(image) {
    try {
      if (this.options.max_width !== null && this.options.max_width < image.width) {
        throw new Error(__("unicorn.field.sid.message.invalid.size.max.width", this.options.max_width));
      }
      if (this.options.min_width !== null && this.options.min_width > image.width) {
        throw new Error(__("unicorn.field.sid.message.invalid.size.min.width", this.options.min_width));
      }
      if (this.options.max_height !== null && this.options.max_height < image.height) {
        throw new Error(__("unicorn.field.sid.message.invalid.size.max.height", this.options.max_height));
      }
      if (this.options.min_height !== null && this.options.min_height > image.height) {
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
    this.storeValue(null, URL.createObjectURL(file));
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
export {
  SingleImageDragElement
};
