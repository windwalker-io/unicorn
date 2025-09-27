import { Modal } from "bootstrap";
import { m as mergeDeep, s as selectAll, _ as __, e as simpleAlert, r as useHttpClient, f as injectCssToDocument } from "./unicorn-CR0afSsW.js";
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
    const modalShown = async () => {
      const cropper = await this.getCropper();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGQtc2luZ2xlLWltYWdlLWRyYWctREw0QXl1UEguanMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2R1bGUvZmllbGQtc2luZ2xlLWltYWdlLWRyYWcudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgeyB1c2VIdHRwQ2xpZW50IH0gZnJvbSAnLi4vY29tcG9zYWJsZSc7XG5pbXBvcnQgeyBfXywgaW5qZWN0Q3NzVG9Eb2N1bWVudCwgc2VsZWN0QWxsLCBzaW1wbGVBbGVydCB9IGZyb20gJy4uL3NlcnZpY2UnO1xuaW1wb3J0IHsgbWVyZ2VEZWVwIH0gZnJvbSAnLi4vdXRpbGl0aWVzJztcbmltcG9ydCBjc3MgZnJvbSAnLi4vLi4vc2Nzcy9maWVsZC9zaW5nbGUtaW1hZ2UtZHJhZy5zY3NzP2lubGluZSc7XG5pbXBvcnQgeyBNb2RhbCB9IGZyb20gJ2Jvb3RzdHJhcCc7XG5pbXBvcnQgdHlwZSBDcm9wcGVyIGZyb20gJ2Nyb3BwZXJqcyc7XG5cbmluamVjdENzc1RvRG9jdW1lbnQoY3NzKTtcblxuZXhwb3J0IGludGVyZmFjZSBTaW5nbGVJbWFnZURyYWdPcHRpb25zIHtcbiAgYWNjZXB0OiBzdHJpbmcgfCBzdHJpbmdbXTtcbiAgYWpheF91cmw/OiBzdHJpbmc7XG4gIGNyb3A6IGJvb2xlYW47XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xuICBtYXhfd2lkdGg/OiBudW1iZXI7XG4gIG1pbl93aWR0aD86IG51bWJlcjtcbiAgbWF4X2hlaWdodD86IG51bWJlcjtcbiAgbWluX2hlaWdodD86IG51bWJlcjtcbiAgbW9kYWxUYXJnZXQ/OiBzdHJpbmc7XG59XG5cbmNvbnN0IGRlZmF1bHRPcHRpb25zOiBTaW5nbGVJbWFnZURyYWdPcHRpb25zID0ge1xuICBhY2NlcHQ6IFtcbiAgICAnaW1hZ2UvanBlZycsXG4gICAgJ2ltYWdlL3BuZycsXG4gICAgJ2ltYWdlL3dlYnAnLFxuICAgICdpbWFnZS9hdmlmJyxcbiAgICAnaW1hZ2UvZ2lmJyxcbiAgXSxcbiAgY3JvcDogZmFsc2UsXG4gIHdpZHRoOiA4MDAsXG4gIGhlaWdodDogODAwLFxufTtcblxuZXhwb3J0IGNsYXNzIFNpbmdsZUltYWdlRHJhZ0VsZW1lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gIHN0YXRpYyBpcyA9ICd1bmktc2lkJztcblxuICBjdXJyZW50SW1hZ2UgPSAnJztcbiAgY3VycmVudEZpbGU7XG4gIGxhc3Rab29tID0gMDtcbiAgdmFsdWVCYWNrdXAgPSAnJztcblxuICBwcml2YXRlIG9wdGlvbnM6IFNpbmdsZUltYWdlRHJhZ09wdGlvbnM7XG4gIHByaXZhdGUgdmFsdWVJbnB1dDogSFRNTElucHV0RWxlbWVudDtcbiAgcHJpdmF0ZSBmaWxlSW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQ7XG4gIHByaXZhdGUgc2VsZWN0QnV0dG9uOiBIVE1MQnV0dG9uRWxlbWVudDtcbiAgcHJpdmF0ZSBwYXN0ZUJ1dHRvbjogSFRNTEJ1dHRvbkVsZW1lbnQ7XG4gIHByaXZhdGUgZHJhZ2FyZWE6IEhUTUxEaXZFbGVtZW50O1xuICBwcml2YXRlIHByZXZpZXdJbWFnZTogSFRNTEltYWdlRWxlbWVudDtcbiAgcHJpdmF0ZSByZW1vdmVDaGVja2JveDogSFRNTElucHV0RWxlbWVudDtcbiAgcHJpdmF0ZSBtb2RhbEVsZW1lbnQ6IEhUTUxEaXZFbGVtZW50O1xuICBwcml2YXRlIG1vZGFsOiBNb2RhbDtcbiAgcHJpdmF0ZSBjcm9wQ29udGFpbmVyOiBIVE1MRGl2RWxlbWVudDtcbiAgcHJpdmF0ZSBzYXZlYnV0dG9uOiBIVE1MQnV0dG9uRWxlbWVudDtcbiAgcHJpdmF0ZSBtb2RhbFRvb2xiYXJCdXR0b25zOiBOb2RlTGlzdE9mPEhUTUxCdXR0b25FbGVtZW50PjtcbiAgcHJpdmF0ZSBjcm9wcGVyOiBDcm9wcGVyO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSBtZXJnZURlZXAoXG4gICAgICB7fSxcbiAgICAgIGRlZmF1bHRPcHRpb25zLFxuICAgICAgSlNPTi5wYXJzZSh0aGlzLmdldEF0dHJpYnV0ZSgnb3B0aW9ucycpIHx8ICd7fScpXG4gICAgKTtcblxuICAgIHRoaXMudmFsdWVJbnB1dCA9IHRoaXMucXVlcnlTZWxlY3RvcjxIVE1MSW5wdXRFbGVtZW50PignW2RhdGEtZmllbGQtaW5wdXRdJyk7XG4gICAgdGhpcy5maWxlSW5wdXQgPSB0aGlzLnF1ZXJ5U2VsZWN0b3I8SFRNTElucHV0RWxlbWVudD4oJ1tkYXRhLXNpZD1maWxlXScpO1xuICAgIHRoaXMuc2VsZWN0QnV0dG9uID0gdGhpcy5xdWVyeVNlbGVjdG9yPEhUTUxCdXR0b25FbGVtZW50PignW2RhdGEtc2lkPXNlbGVjdF0nKTtcbiAgICB0aGlzLnBhc3RlQnV0dG9uID0gdGhpcy5xdWVyeVNlbGVjdG9yPEhUTUxCdXR0b25FbGVtZW50PignW2RhdGEtc2lkPXBhc3RlXScpO1xuICAgIHRoaXMuZHJhZ2FyZWEgPSB0aGlzLnF1ZXJ5U2VsZWN0b3I8SFRNTERpdkVsZW1lbnQ+KCdbZGF0YS1zaWQ9ZHJhZ2FyZWFdJyk7XG4gICAgdGhpcy5wcmV2aWV3SW1hZ2UgPSB0aGlzLnF1ZXJ5U2VsZWN0b3I8SFRNTEltYWdlRWxlbWVudD4oJ1tkYXRhLXNpZD1wcmV2aWV3XScpO1xuICAgIHRoaXMucmVtb3ZlQ2hlY2tib3ggPSB0aGlzLnF1ZXJ5U2VsZWN0b3I8SFRNTElucHV0RWxlbWVudD4oJ1tkYXRhLXNpZD1yZW1vdmVdJyk7XG5cbiAgICB0aGlzLm1vZGFsRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTERpdkVsZW1lbnQ+KHRoaXMub3B0aW9ucy5tb2RhbFRhcmdldCk7XG4gICAgdGhpcy5tb2RhbCA9IE1vZGFsLmdldE9yQ3JlYXRlSW5zdGFuY2UodGhpcy5tb2RhbEVsZW1lbnQpO1xuICAgIHRoaXMuY3JvcENvbnRhaW5lciA9IHRoaXMubW9kYWxFbGVtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTERpdkVsZW1lbnQ+KCdbZGF0YS1zaWQ9XCJjcm9wLWNvbnRhaW5lclwiXScpO1xuICAgIHRoaXMuc2F2ZWJ1dHRvbiA9IHRoaXMubW9kYWxFbGVtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEJ1dHRvbkVsZW1lbnQ+KCdbZGF0YS1zaWQ9c2F2ZS1idXR0b25dJyk7XG4gICAgdGhpcy5tb2RhbFRvb2xiYXJCdXR0b25zID0gdGhpcy5tb2RhbEVsZW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MQnV0dG9uRWxlbWVudD4oJ1tkYXRhLXNpZC10b29sYmFyXScpO1xuXG4gICAgY29uc3QgbW9kYWxTaG93biA9IGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGNyb3BwZXIgPSBhd2FpdCB0aGlzLmdldENyb3BwZXIoKTtcbiAgICAgIGNyb3BwZXIucmVwbGFjZSh0aGlzLmN1cnJlbnRJbWFnZSk7XG4gICAgICB0aGlzLmNyb3BDb250YWluZXIuc3R5bGUudmlzaWJpbGl0eSA9ICcnO1xuICAgICAgdGhpcy5jdXJyZW50SW1hZ2UgPSBudWxsO1xuICAgIH07XG5cbiAgICB0aGlzLm1vZGFsRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdzaG93bi5icy5tb2RhbCcsIG1vZGFsU2hvd24uYmluZCh0aGlzKSk7XG5cbiAgICB0aGlzLnNhdmVidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICB0aGlzLnNhdmVDcm9wcGVkKCk7XG4gICAgICB0aGlzLm1vZGFsLmhpZGUoKTtcbiAgICB9KTtcblxuICAgIHRoaXMuYmluZEV2ZW50cygpO1xuXG4gICAgdGhpcy5zdHlsZS52aXNpYmlsaXR5ID0gJyc7XG4gIH1cblxuICBiaW5kRXZlbnRzKCkge1xuICAgIHRoaXMuZHJhZ2FyZWEuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ292ZXInLCAoZXZlbnQpID0+IHtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgdGhpcy5kcmFnYXJlYS5jbGFzc0xpc3QuYWRkKCdob3ZlcicpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5kcmFnYXJlYS5hZGRFdmVudExpc3RlbmVyKCdkcmFnbGVhdmUnLCAoZXZlbnQpID0+IHtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgdGhpcy5kcmFnYXJlYS5jbGFzc0xpc3QucmVtb3ZlKCdob3ZlcicpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5kcmFnYXJlYS5hZGRFdmVudExpc3RlbmVyKCdkcm9wJywgKGV2ZW50KSA9PiB7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIHRoaXMuZHJhZ2FyZWEuY2xhc3NMaXN0LnJlbW92ZSgnaG92ZXInKTtcblxuICAgICAgY29uc3QgZmlsZXMgPSAoZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmZpbGVzIHx8IGV2ZW50LmRhdGFUcmFuc2Zlci5maWxlcztcbiAgICAgIHRoaXMuaGFuZGxlRmlsZVNlbGVjdChmaWxlc1swXSk7XG4gICAgfSk7XG5cbiAgICAvLyBTZWxlY3QgYnV0dG9uXG4gICAgdGhpcy5zZWxlY3RCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnZmlsZScpO1xuICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKCdhY2NlcHQnLCB0aGlzLmdldElucHV0QWNjZXB0KCkpO1xuICAgICAgaW5wdXQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG4gICAgICAgIHRoaXMuaGFuZGxlRmlsZVNlbGVjdChpbnB1dC5maWxlc1swXSk7XG5cbiAgICAgICAgaW5wdXQucmVtb3ZlKCk7XG4gICAgICB9KTtcblxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpbnB1dCk7XG4gICAgICBpbnB1dC5jbGljaygpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5wYXN0ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIG5hdmlnYXRvci5jbGlwYm9hcmQucmVhZCgpLnRoZW4oKGl0ZW1zKSA9PiB7XG4gICAgICAgIGxldCB0eXBlcyA9IGl0ZW1zWzBdLnR5cGVzO1xuXG4gICAgICAgIGlmICh0eXBlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICB0aGlzLmFsZXJ0KCdUaGlzIGJyb3dzZXIgdW5hYmxlIHRvIGdldCBjbGlwYm9hcmQgZGF0YS4nKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0eXBlcyA9IHR5cGVzLnNsaWNlKCkuc29ydCgpO1xuXG4gICAgICAgIGNvbnN0IHR5cGUgPSB0eXBlc1swXTtcblxuICAgICAgICBpdGVtc1swXS5nZXRUeXBlKHR5cGUpLnRoZW4oKGJsb2IpID0+IHtcbiAgICAgICAgICB0aGlzLmhhbmRsZUZpbGVTZWxlY3QobmV3IEZpbGUoWyBibG9iIF0sICdpbWFnZS5wbmcnLCB7IHR5cGUgfSkpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gRGVsZXRlXG4gICAgdGhpcy5yZW1vdmVDaGVja2JveD8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBpZiAodGhpcy5yZW1vdmVDaGVja2JveC5jaGVja2VkKSB7XG4gICAgICAgIHRoaXMudmFsdWVCYWNrdXAgPSB0aGlzLnZhbHVlSW5wdXQudmFsdWU7XG4gICAgICAgIHRoaXMudmFsdWVJbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy52YWx1ZUlucHV0LnZhbHVlID0gdGhpcy52YWx1ZUJhY2t1cDtcbiAgICAgICAgdGhpcy52YWx1ZUJhY2t1cCA9ICcnO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gWm9vbSBzbGlkZXJcbiAgICBzZWxlY3RBbGwodGhpcy5tb2RhbFRvb2xiYXJCdXR0b25zLCAoYnV0dG9uKSA9PiB7XG4gICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy50b29sYmFyQ2xpY2tlZChidXR0b24sIGV2ZW50KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0SW5wdXRBY2NlcHQoKSB7XG4gICAgbGV0IGFjY2VwdCA9IHRoaXMub3B0aW9ucy5hY2NlcHQ7XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShhY2NlcHQpKSB7XG4gICAgICBhY2NlcHQgPSBhY2NlcHQuam9pbignLCcpO1xuICAgIH1cblxuICAgIHJldHVybiBhY2NlcHQ7XG4gIH1cblxuICBoYW5kbGVGaWxlU2VsZWN0KGZpbGU6IEZpbGUpIHtcbiAgICBpZiAoIXRoaXMuY2hlY2tGaWxlKGZpbGUpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5jcm9wKSB7XG4gICAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXG4gICAgICByZWFkZXIuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLmNyb3BDb250YWluZXIuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgICB0aGlzLmN1cnJlbnRJbWFnZSA9IGV2ZW50LnRhcmdldC5yZXN1bHQgYXMgc3RyaW5nO1xuICAgICAgICB0aGlzLmN1cnJlbnRGaWxlID0gZmlsZTtcblxuICAgICAgICAvLyBBZnRlciBtb2RhbCBzaG93biwgY3JvcHBlciB3aWxsIGF1dG8gbG9hZC5cbiAgICAgICAgdGhpcy5tb2RhbC5zaG93KCk7XG4gICAgICB9KTtcblxuICAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5zYXZlSW1hZ2UoZmlsZSk7XG4gIH1cblxuICBhc3luYyBzYXZlQ3JvcHBlZCgpIHtcbiAgICBjb25zdCBDcm9wcGVyID0gYXdhaXQgdGhpcy5nZXRDcm9wcGVyKCk7XG5cbiAgICBDcm9wcGVyLmdldENyb3BwZWRDYW52YXMoe1xuICAgICAgICB3aWR0aDogdGhpcy5vcHRpb25zLndpZHRoLFxuICAgICAgICBoZWlnaHQ6IHRoaXMub3B0aW9ucy5oZWlnaHQsXG4gICAgICAgIGltYWdlU21vb3RoaW5nRW5hYmxlZDogdHJ1ZVxuICAgICAgfSlcbiAgICAgIC50b0Jsb2IoKGJsb2IpID0+IHtcbiAgICAgICAgY29uc3QgZmlsZSA9IG5ldyBGaWxlKFsgYmxvYiBdLCB0aGlzLmN1cnJlbnRGaWxlLm5hbWUsIHsgdHlwZTogJ2ltYWdlL3BuZycgfSk7XG4gICAgICAgIHRoaXMuc2F2ZUltYWdlKGZpbGUpO1xuICAgICAgfSwgJ2ltYWdlL3BuZycpO1xuICB9XG5cbiAgYXN5bmMgZ2V0Q3JvcHBlcigpIHtcbiAgICBpZiAodGhpcy5jcm9wcGVyKSB7XG4gICAgICByZXR1cm4gdGhpcy5jcm9wcGVyO1xuICAgIH1cblxuICAgIGNvbnN0IENyb3BwZXIgPSBhd2FpdCBsb2FkQ3JvcHBlcigpO1xuXG4gICAgcmV0dXJuIHRoaXMuY3JvcHBlciA9IG5ldyBDcm9wcGVyKHRoaXMuY3JvcENvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdpbWcnKSwge1xuICAgICAgYXNwZWN0UmF0aW86IHRoaXMub3B0aW9ucy53aWR0aCAvIHRoaXMub3B0aW9ucy5oZWlnaHQsXG4gICAgICBhdXRvQ3JvcEFyZWE6IDEsXG4gICAgICB2aWV3TW9kZTogMSxcbiAgICAgIGRyYWdNb2RlOiAnbW92ZScsXG4gICAgICBjcm9wQm94TW92YWJsZTogZmFsc2UsXG4gICAgICBjcm9wQm94UmVzaXphYmxlOiBmYWxzZSxcbiAgICAgIHJlYWR5OiAoZSkgPT4ge1xuICAgICAgICAvL1xuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHRvb2xiYXJDbGlja2VkKGJ1dHRvbjogSFRNTEJ1dHRvbkVsZW1lbnQsIGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgY29uc3QgY3JvcHBlciA9IGF3YWl0IHRoaXMuZ2V0Q3JvcHBlcigpO1xuXG4gICAgY29uc3QgZGF0YSA9IGNyb3BwZXIuZ2V0RGF0YSgpO1xuXG4gICAgc3dpdGNoIChidXR0b24uZGF0YXNldC5zaWRUb29sYmFyKSB7XG4gICAgICBjYXNlICd6b29tLWluJzpcbiAgICAgICAgY3JvcHBlci56b29tKDAuMSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICd6b29tLW91dCc6XG4gICAgICAgIGNyb3BwZXIuem9vbSgtMC4xKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3JvdGF0ZS1sZWZ0JzpcbiAgICAgICAgY3JvcHBlci5yb3RhdGUoLTkwKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3JvdGF0ZS1yaWdodCc6XG4gICAgICAgIGNyb3BwZXIucm90YXRlKDkwKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3NjYWxlLXgnOlxuICAgICAgICBjcm9wcGVyLnNjYWxlWCgtZGF0YS5zY2FsZVgpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnc2NhbGUteSc6XG4gICAgICAgIGNyb3BwZXIuc2NhbGVZKC1kYXRhLnNjYWxlWSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGNoZWNrRmlsZShmaWxlOiBGaWxlKTogYm9vbGVhbiB7XG4gICAgbGV0IGFjY2VwdCA9IHRoaXMub3B0aW9ucy5hY2NlcHQ7XG5cbiAgICBpZiAodHlwZW9mIGFjY2VwdCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGFjY2VwdCA9IGFjY2VwdC5zcGxpdCgnLCcpLm1hcCh2ID0+IHYudHJpbSgpKTtcbiAgICB9XG5cbiAgICBpZiAoIWFjY2VwdC5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGxldCBhbGxvdyA9IGZhbHNlO1xuXG4gICAgZm9yIChjb25zdCB0eXBlIG9mIGFjY2VwdCkge1xuICAgICAgaWYgKHR5cGUuaW5kZXhPZignLycpICE9PSAtMSkge1xuICAgICAgICBhbGxvdyA9IGFsbG93IHx8IHRoaXMuY29tcGFyZU1pbWVUeXBlKHR5cGUsIGZpbGUudHlwZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhbGxvdyA9IGFsbG93IHx8IHR5cGUudG9Mb3dlckNhc2UoKSA9PT0gZ2V0RmlsZUV4dGVuc2lvbihmaWxlKT8udG9Mb3dlckNhc2UoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYWxsb3cpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHRoaXMuYWxlcnQoXG4gICAgICBfXygndW5pY29ybi5maWVsZC5zaWQubWVzc2FnZS5pbnZhbGlkLmltYWdlLnRpdGxlJyksXG4gICAgICBfXygndW5pY29ybi5maWVsZC5zaWQubWVzc2FnZS5pbnZhbGlkLmltYWdlLmRlc2MnKSxcbiAgICAgICdlcnJvcidcbiAgICApO1xuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29tcGFyZU1pbWVUeXBlKGFjY2VwdCwgbWltZSkge1xuICAgIGNvbnN0IGFjY2VwdDIgPSBhY2NlcHQuc3BsaXQoJy8nKTtcbiAgICBjb25zdCBtaW1lMiA9IG1pbWUuc3BsaXQoJy8nKTtcblxuICAgIGlmIChhY2NlcHQyWzFdID09PSAnKicpIHtcbiAgICAgIHJldHVybiBhY2NlcHQyWzBdID09PSBtaW1lMlswXTtcbiAgICB9XG5cbiAgICByZXR1cm4gYWNjZXB0ID09PSBtaW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGltYWdlIHNpemUuXG4gICAqXG4gICAqIEBwYXJhbSB7SW1hZ2V9IGltYWdlXG4gICAqXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgY2hlY2tTaXplKGltYWdlKSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMubWF4X3dpZHRoICE9PSBudWxsICYmIHRoaXMub3B0aW9ucy5tYXhfd2lkdGggPCBpbWFnZS53aWR0aCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoX18oJ3VuaWNvcm4uZmllbGQuc2lkLm1lc3NhZ2UuaW52YWxpZC5zaXplLm1heC53aWR0aCcsIHRoaXMub3B0aW9ucy5tYXhfd2lkdGgpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5taW5fd2lkdGggIT09IG51bGwgJiYgdGhpcy5vcHRpb25zLm1pbl93aWR0aCA+IGltYWdlLndpZHRoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihfXygndW5pY29ybi5maWVsZC5zaWQubWVzc2FnZS5pbnZhbGlkLnNpemUubWluLndpZHRoJywgdGhpcy5vcHRpb25zLm1pbl93aWR0aCkpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLm1heF9oZWlnaHQgIT09IG51bGwgJiYgdGhpcy5vcHRpb25zLm1heF9oZWlnaHQgPCBpbWFnZS5oZWlnaHQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKF9fKCd1bmljb3JuLmZpZWxkLnNpZC5tZXNzYWdlLmludmFsaWQuc2l6ZS5tYXguaGVpZ2h0JywgdGhpcy5vcHRpb25zLm1heF9oZWlnaHQpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5taW5faGVpZ2h0ICE9PSBudWxsICYmIHRoaXMub3B0aW9ucy5taW5faGVpZ2h0ID4gaW1hZ2UuaGVpZ2h0KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihfXygndW5pY29ybi5maWVsZC5zaWQubWVzc2FnZS5pbnZhbGlkLnNpemUubWluLmhlaWdodCcsIHRoaXMub3B0aW9ucy5taW5faGVpZ2h0KSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdGhpcy5hbGVydChcbiAgICAgICAgX18oJ3VuaWNvcm4uZmllbGQuc2lkLm1lc3NhZ2UuaW52YWxpZC5zaXplLnRpdGxlJyksXG4gICAgICAgIGUubWVzc2FnZSxcbiAgICAgICAgJ2Vycm9yJ1xuICAgICAgKTtcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgYWxlcnQodGl0bGU6IHN0cmluZywgdGV4dCA9ICcnLCB0eXBlID0gJ2luZm8nKSB7XG4gICAgcmV0dXJuIHNpbXBsZUFsZXJ0KHRpdGxlLCB0ZXh0LCB0eXBlKTtcbiAgfVxuXG4gIGFzeW5jIHNhdmVJbWFnZShmaWxlOiBGaWxlKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5hamF4X3VybCkge1xuICAgICAgY29uc3QgbG9hZGluZyA9IHRoaXMucXVlcnlTZWxlY3RvcjxIVE1MSW1hZ2VFbGVtZW50PignW2RhdGEtc2lkPWZpbGUtdXBsb2FkaW5nXScpO1xuXG4gICAgICB0aGlzLnByZXZpZXdJbWFnZS5zcmMgPSAnJztcbiAgICAgIHRoaXMucHJldmlld0ltYWdlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICBsb2FkaW5nLnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IHRoaXMudXBsb2FkSW1hZ2UoZmlsZSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgIHNpbXBsZUFsZXJ0KGUubWVzc2FnZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGxvYWRpbmcuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEBzZWUgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzQ3MTcyNDA5XG4gICAgLy8gQHNlZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNDc1MjI4MTJcbiAgICBjb25zdCBkdCA9IG5ldyBEYXRhVHJhbnNmZXIoKTtcbiAgICBkdC5pdGVtcy5hZGQoZmlsZSk7XG5cbiAgICAvLyBObyByZXF1aXJlZCBmb3IgdmFsdWUgaW5wdXQgdG8gcmVtb3ZlIHZhbGlkYXRpb24gbWVzc2FnZVxuICAgIHRoaXMudmFsdWVJbnB1dC5yZXF1aXJlZCA9IGZhbHNlO1xuXG4gICAgdGhpcy5maWxlSW5wdXQuZmlsZXMgPSBkdC5maWxlcztcbiAgICB0aGlzLmZpbGVJbnB1dC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnY2hhbmdlJywgeyBidWJibGVzOiB0cnVlIH0pKTtcbiAgICB0aGlzLmZpbGVJbnB1dC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnaW5wdXQnLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xuXG4gICAgdGhpcy5zdG9yZVZhbHVlKG51bGwsIFVSTC5jcmVhdGVPYmplY3RVUkwoZmlsZSkpO1xuICB9XG5cbiAgYXN5bmMgdXBsb2FkSW1hZ2UoZmlsZTogRmlsZSkge1xuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgZm9ybURhdGEuYXBwZW5kKCdmaWxlJywgZmlsZSk7XG5cbiAgICBjb25zdCB7IHBvc3QgfSA9IGF3YWl0IHVzZUh0dHBDbGllbnQoKTtcblxuICAgIHJldHVybiBwb3N0KHRoaXMub3B0aW9ucy5hamF4X3VybCwgZm9ybURhdGEsIHtcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdtdWx0aXBhcnQvZm9ybS1kYXRhJ1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc3RvcmVWYWx1ZSh1cmw6IHN0cmluZywgcHJldmlldzogc3RyaW5nKSB7XG4gICAgdGhpcy5wcmV2aWV3SW1hZ2Uuc3JjID0gcHJldmlldztcbiAgICB0aGlzLnByZXZpZXdJbWFnZS5zdHlsZS5kaXNwbGF5ID0gJ2lubGluZS1ibG9jayc7XG5cbiAgICAvLyBNYWtlIGRlbGV0ZSBib3ggdW5jaGVja2VkXG4gICAgaWYgKHRoaXMucmVtb3ZlQ2hlY2tib3gpIHtcbiAgICAgIHRoaXMucmVtb3ZlQ2hlY2tib3guY2hlY2tlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGlmICh1cmwpIHtcbiAgICAgIHRoaXMudmFsdWVJbnB1dC52YWx1ZSA9IHVybDtcbiAgICB9XG5cbiAgICAvLyBUcmlnZ2VyIGNoYW5nZVxuICAgIHRoaXMucHJldmlld0ltYWdlLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdjaGFuZ2UnLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xuICAgIHRoaXMudmFsdWVJbnB1dC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnY2hhbmdlJywgeyBidWJibGVzOiB0cnVlIH0pKTtcbiAgICB0aGlzLnZhbHVlSW5wdXQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2lucHV0JywgeyBidWJibGVzOiB0cnVlIH0pKTtcbiAgfVxufVxuXG4vLyBQcm9taXNlLmFsbChbXG4vLyAgIGltcG9ydCgnQGNyb3BwZXJqcy9jcm9wcGVyLm1pbi5qcycpLFxuLy8gICBpbXBvcnQoJ0Bjcm9wcGVyanMvY3JvcHBlci5jc3MnKSxcbi8vIF0pXG4vLyAgIC50aGVuKChzZXJ2aWNlKSA9PiB7XG4vLyAgICAgY29uc3Qgc3R5bGVTaGVldCA9IHNlcnZpY2VbMV0uZGVmYXVsdDtcbi8vICAgICBkb2N1bWVudC5hZG9wdGVkU3R5bGVTaGVldHMgPSBbLi4uZG9jdW1lbnQuYWRvcHRlZFN0eWxlU2hlZXRzLCBzdHlsZVNoZWV0XTtcbi8vICAgfSk7XG5cbmN1c3RvbUVsZW1lbnRzLmRlZmluZShTaW5nbGVJbWFnZURyYWdFbGVtZW50LmlzLCBTaW5nbGVJbWFnZURyYWdFbGVtZW50KTtcblxuZnVuY3Rpb24gZ2V0RmlsZUV4dGVuc2lvbihmaWxlOiBGaWxlKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgY29uc3QgcGFydHMgPSBmaWxlLm5hbWUuc3BsaXQoJy4nKTtcbiAgaWYgKHBhcnRzLmxlbmd0aCA+IDEpIHtcbiAgICByZXR1cm4gcGFydHMucG9wKCk7XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuYXN5bmMgZnVuY3Rpb24gbG9hZENyb3BwZXIoKTogUHJvbWlzZTx0eXBlb2YgQ3JvcHBlcj4ge1xuICBjb25zdCBbbW9kdWxlXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICBpbXBvcnQoJ2Nyb3BwZXJqcycpLFxuICAgIGltcG9ydCgnY3JvcHBlcmpzL2Rpc3QvY3JvcHBlci5taW4uY3NzP2lubGluZScpLnRoZW4oKHsgZGVmYXVsdDogY3NzIH0pID0+IHtcbiAgICAgIGluamVjdENzc1RvRG9jdW1lbnQoY3NzKTtcbiAgICB9KVxuICBdKTtcblxuICByZXR1cm4gbW9kdWxlLmRlZmF1bHQ7XG59XG5cbmxvYWRDcm9wcGVyKCk7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2luZ2xlSW1hZ2VEcmFnTW9kdWxlIHtcbiAgU2luZ2xlSW1hZ2VEcmFnRWxlbWVudDogdHlwZW9mIFNpbmdsZUltYWdlRHJhZ0VsZW1lbnQ7XG59XG4iXSwibmFtZXMiOlsiY3NzIl0sIm1hcHBpbmdzIjoiOzs7QUFRQSxvQ0FBb0IsR0FBRztBQWV2QixNQUFNLGlCQUF5QztBQUFBLEVBQzdDLFFBQVE7QUFBQSxJQUNOO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQUE7QUFBQSxFQUVGLE1BQU07QUFBQSxFQUNOLE9BQU87QUFBQSxFQUNQLFFBQVE7QUFDVjtBQUVPLE1BQU0sK0JBQStCLFlBQVk7QUFBQSxFQUN0RCxPQUFPLEtBQUs7QUFBQSxFQUVaLGVBQWU7QUFBQSxFQUNmO0FBQUEsRUFDQSxXQUFXO0FBQUEsRUFDWCxjQUFjO0FBQUEsRUFFTjtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFB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
