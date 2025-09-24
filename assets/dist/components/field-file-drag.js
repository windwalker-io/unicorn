import { f as useUniDirective, y as injectCssToDocument, m as mergeDeep, _ as __, w as uid, k as html, e as simpleAlert } from "../chunks/unicorn-Bnc3cU-N.js";
const css = ".c-file-drag {\n  --bs-card-border-color: var(--bs-gray-400);\n  overflow: hidden;\n  border: 1px solid var(--bs-card-border-color, #ddd);\n}\n.c-file-drag label {\n  border: none;\n}\n\n.c-file-drag-input {\n  position: relative;\n  display: inline-block;\n  width: 100%;\n  min-height: 100px;\n  cursor: pointer;\n}\n.c-file-drag-input input {\n  position: relative;\n  z-index: 2;\n  width: 100%;\n  margin: 0;\n  overflow: hidden;\n  opacity: 0;\n  height: 100%;\n  cursor: pointer;\n}\n.c-file-drag-input input.hover + label {\n  background-color: #efefef;\n}\n.c-file-drag-input input.is-invalid ~ .c-file-drag-input__label {\n  border-color: var(--bs-danger);\n}\n.c-file-drag-input input:disabled {\n  opacity: 0;\n  cursor: no-drop;\n}\n.c-file-drag-input input:disabled + label {\n  background-color: #eee;\n  color: #999;\n}\n.c-file-drag-input input:disabled + label button {\n  display: none;\n}\n.c-file-drag-input__label {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  z-index: 1;\n  padding: 0.375rem 0.75rem;\n  color: #495057;\n  background-color: #fff;\n  border: 1px solid var(--bs-gray-400);\n  border-radius: 0.25rem;\n  height: 100%;\n  text-align: center;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5rem;\n  transition: all 0.3s;\n  cursor: pointer;\n}\n.c-file-drag-input__label > span {\n  display: inline-block;\n  width: 100%;\n}\n.c-file-drag-input label::after {\n  content: none !important;\n}\n.c-file-drag-preview .c-file-drag-preview__delete {\n  --bs-link-color-rgb: var(--bs-dark-rgb);\n}\n.c-file-drag-preview .c-file-drag-preview__delete.active {\n  --bs-link-color-rgb: var(--bs-primary-rgb);\n}";
/* @__PURE__ */ injectCssToDocument(document, css);
const defaultOptions = {
  maxFiles: void 0,
  maxSize: void 0,
  placeholder: "",
  height: 125
};
class FieldFileDrag extends HTMLElement {
  static is = "uni-file-drag";
  element;
  overlayLabel;
  button;
  options;
  get inputSelector() {
    return this.getAttribute("selector") || "input[type=file]";
  }
  get multiple() {
    return this.element.multiple;
  }
  connectedCallback() {
    this.element = this.querySelector(this.inputSelector);
    this.prepareElements();
    const options = JSON.parse(this.getAttribute("options") || "{}") || {};
    if (this.element.readOnly) {
      this.element.disabled = true;
    }
    this.options = mergeDeep({}, defaultOptions, options);
    this.bindEvent();
    this.style.visibility = "";
    this.style.height = (this.options.height || 100) + "px";
  }
  bindEvent() {
    this.element.addEventListener("dragover", () => {
      this.element.classList.add("hover");
    });
    this.element.addEventListener("dragleave", () => {
      this.element.classList.remove("hover");
    });
    this.element.addEventListener("drop", () => {
      this.element.classList.remove("hover");
    });
    this.onChange();
    this.element.addEventListener("change", (e) => {
      this.onChange(e);
    });
    this.element.addEventListener("input", (e) => {
      this.onChange(e);
    });
  }
  prepareElements() {
    if (this.children.length === 0) {
      this.createElementsLayout();
    }
    this.overlayLabel = this.querySelector("[data-overlay-label]");
    let button = this.overlayLabel.querySelector("button");
    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.setAttribute("class", "c-file-drag-input__button btn btn-success btn-sm px-2 py-1");
      button.innerText = __("unicorn.field.file.drag.button.text");
      this.overlayLabel.appendChild(button);
    }
    this.button = button;
  }
  createElementsLayout() {
    this.id ||= "c-file-drag-" + uid();
    const name = this.getAttribute("name") || "file";
    const inputId = this.id + "__input";
    const btnText = __("unicorn.field.file.drag.button.text");
    const input = html(`<input id="${inputId}" type="file" name="${name}" />`);
    const label = html(`<label class="px-3 c-file-drag-input__label"
        data-overlay-label
        for="${inputId}">
        <span class="label-text d-block">
            <span class="fa fa-upload"></span>
        </span>
        <button type="button" class="c-file-drag-input__button btn btn-success btn-sm px-2 py-1">
            ${btnText}
        </button>
    </label>`);
    this.element = input;
    this.overlayLabel = label;
    this.appendChild(input);
    this.appendChild(label);
  }
  onChange(evt) {
    const files = this.element.files;
    const limit = this.options.maxFiles;
    const maxSize = this.options.maxSize;
    let placeholder = this.options.placeholder;
    const accepted = (this.element.getAttribute("accept") || this.element.getAttribute("data-accepted") || "").split(",").map((v) => v.trim()).filter((v) => v.length > 0).map((v) => {
      if (v.indexOf("/") === -1 && v[0] === ".") {
        return v.substring(1);
      }
      return v;
    });
    let text;
    if (!placeholder) {
      if (this.multiple) {
        placeholder = __("unicorn.field.file.drag.placeholder.multiple");
      } else {
        placeholder = __("unicorn.field.file.drag.placeholder.single");
      }
    }
    if (limit && files.length > limit) {
      this.alert(__("unicorn.field.file.drag.message.max.files", limit), "", "warning");
      evt?.preventDefault();
      return;
    }
    let fileSize = 0;
    Array.prototype.forEach.call(files, (file) => {
      this.checkFileType(accepted, file);
      fileSize += file.size;
    });
    if (maxSize && fileSize / 1024 / 1024 > maxSize) {
      this.alert(
        __(
          "unicorn.field.file.drag.message.max.size",
          maxSize < 1 ? maxSize * 1024 + "KB" : maxSize + "MB"
        ),
        "",
        "warning"
      );
      evt?.preventDefault();
      return;
    }
    if (files.length > 1) {
      text = `<span class="fa fa-files fa-copy"></span> ${__("unicorn.field.file.drag.selected", files.length)}`;
    } else if (files.length === 1) {
      text = `<span class="fa fa-file"></span> ${files[0].name}`;
    } else {
      text = `<span class="fa fa-upload"></span> ${placeholder}`;
    }
    this.overlayLabel.querySelector("span").innerHTML = text;
  }
  checkFileType(accepted, file) {
    const fileExt = file.name.split(".").pop();
    if (accepted.length) {
      let allow = false;
      accepted.forEach((type) => {
        if (allow) {
          return;
        }
        if (type.indexOf("/") !== -1) {
          if (this.compareMimeType(type, file.type)) {
            allow = true;
          }
        } else {
          if (type.toLowerCase() === fileExt.toLowerCase()) {
            allow = true;
          }
        }
      });
      if (!allow) {
        this.alert(
          __("unicorn.field.file.drag.message.unaccepted.files"),
          __("unicorn.field.file.drag.message.unaccepted.files.desc", accepted.join(", ")),
          "warning"
        );
        throw new Error("Not accepted file ext");
      }
    }
  }
  compareMimeType(accepted, mime) {
    const accepted2 = accepted.split("/");
    const mime2 = mime.split("/");
    if (accepted2[1] === "*") {
      return accepted2[0] === mime2[0];
    }
    return accepted === mime;
  }
  async alert(title, text = "", type = "info") {
    await simpleAlert(title, text, type);
  }
}
/* @__PURE__ */ customElements.define(/* @__PURE__ */ (() => FieldFileDrag.is)(), FieldFileDrag);
const ready = /* @__PURE__ */ useUniDirective("file-drag-field", {
  mounted(el) {
    const input = el.querySelector("input[type=file]");
    const placeholderInput = el.querySelector("[data-role=placeholder]");
    const preview = el.querySelector(".c-file-drag-preview");
    if (preview) {
      const previewLink = preview.querySelector(".c-file-drag-preview__link");
      const delButton = preview.querySelector(".c-file-drag-preview__delete");
      let linkTitle = previewLink.textContent;
      let inputValue = placeholderInput.value;
      let required = input.required;
      if (placeholderInput.value) {
        input.required = false;
      }
      delButton.addEventListener("click", () => {
        if (delButton.classList.contains("active")) {
          previewLink.textContent = linkTitle;
          placeholderInput.value = inputValue;
          delButton.classList.remove("active");
          input.required = false;
        } else {
          previewLink.textContent = "";
          placeholderInput.value = "";
          delButton.classList.add("active");
          input.required = required;
        }
      });
    }
  }
});
export {
  ready
};
