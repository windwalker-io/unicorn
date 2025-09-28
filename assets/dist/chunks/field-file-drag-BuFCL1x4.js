import { d as useUniDirective, m as mergeDeep, _ as __, u as uid, h as html, e as simpleAlert, f as injectCssToDocument } from "./unicorn-DR9JpPYO.js";
const css = ".c-file-drag {\n  --bs-card-border-color: var(--bs-gray-400);\n  --fd-delete-color: var(--bs-danger);\n  overflow: hidden;\n  border: 1px solid var(--bs-card-border-color, #ddd);\n}\n.c-file-drag label {\n  border: none;\n}\n\n.c-file-drag-input {\n  position: relative;\n  display: inline-block;\n  width: 100%;\n  min-height: 100px;\n  cursor: pointer;\n}\n.c-file-drag-input input {\n  position: relative;\n  z-index: 2;\n  width: 100%;\n  margin: 0;\n  overflow: hidden;\n  opacity: 0;\n  height: 100%;\n  cursor: pointer;\n}\n.c-file-drag-input input.hover + label {\n  background-color: #efefef;\n}\n.c-file-drag-input input.is-invalid ~ .c-file-drag-input__label {\n  border-color: var(--bs-danger);\n}\n.c-file-drag-input input:disabled {\n  opacity: 0;\n  cursor: no-drop;\n}\n.c-file-drag-input input:disabled + label {\n  background-color: #eee;\n  color: #999;\n}\n.c-file-drag-input input:disabled + label button {\n  display: none;\n}\n.c-file-drag-input__label {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  z-index: 1;\n  padding: 0.375rem 0.75rem;\n  color: #495057;\n  background-color: #fff;\n  border: 1px solid var(--bs-gray-400);\n  border-radius: 0.25rem;\n  height: 100%;\n  text-align: center;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5rem;\n  transition: all 0.3s;\n  cursor: pointer;\n}\n.c-file-drag-input__label > span {\n  display: inline-block;\n  width: 100%;\n}\n.c-file-drag-input label::after {\n  content: none !important;\n}\n.c-file-drag-preview .c-file-drag-preview__delete {\n  --bs-link-color-rgb: var(--bs-dark-rgb);\n}\n.c-file-drag-preview .c-file-drag-preview__delete.active {\n  --bs-link-color-rgb: var(--bs-primary-rgb);\n}";
/* @__PURE__ */ injectCssToDocument(document, css);
const defaultOptions = {
  maxFiles: void 0,
  maxSize: void 0,
  placeholder: "",
  height: 125
};
class FileDragElement extends HTMLElement {
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
    const files = this.element.files || [];
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
    const fileExt = file.name.split(".").pop() || "";
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
/* @__PURE__ */ customElements.define(/* @__PURE__ */ (() => FileDragElement.is)(), FileDragElement);
const ready = /* @__PURE__ */ useUniDirective("file-drag-field", {
  mounted(el) {
    const input = el.querySelector("input[type=file]");
    const placeholderInput = el.querySelector("[data-role=placeholder]");
    const preview = el.querySelector(".c-file-drag-preview");
    if (preview) {
      const previewLink = preview.querySelector(".c-file-drag-preview__link");
      const delButton = preview.querySelector(".c-file-drag-preview__delete");
      let inputValue = placeholderInput.value;
      let required = input.required;
      if (placeholderInput.value) {
        input.required = false;
      }
      delButton.addEventListener("click", () => {
        if (delButton.classList.contains("active")) {
          previewLink.style.textDecoration = "";
          previewLink.style.setProperty("color", "");
          placeholderInput.value = inputValue;
          delButton.classList.remove("active");
          input.required = false;
        } else {
          previewLink.style.textDecoration = "line-through";
          previewLink.style.color = "var(--fd-delete-color, var(--bs-danger))";
          placeholderInput.value = "";
          delButton.classList.add("active");
          input.required = required;
        }
      });
    }
  }
});
export {
  FileDragElement,
  ready
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGQtZmlsZS1kcmFnLUJ1RkNMMXg0LmpzIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbW9kdWxlL2ZpZWxkLWZpbGUtZHJhZy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY3NzIGZyb20gJy4uLy4uL3Njc3MvZmllbGQvZmlsZS1kcmFnLnNjc3M/aW5saW5lJztcbmltcG9ydCB7IHVzZVVuaURpcmVjdGl2ZSB9IGZyb20gJy4uL2NvbXBvc2FibGUnO1xuaW1wb3J0IHsgX18sIGh0bWwsIGluamVjdENzc1RvRG9jdW1lbnQsIHNpbXBsZUFsZXJ0LCB1aWQgfSBmcm9tICcuLi9zZXJ2aWNlJztcbmltcG9ydCB7IG1lcmdlRGVlcCB9IGZyb20gJy4uL3V0aWxpdGllcyc7XG5cbmluamVjdENzc1RvRG9jdW1lbnQoZG9jdW1lbnQsIGNzcyk7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRmlsZURyYWdPcHRpb25zIHtcbiAgbWF4RmlsZXM6IG51bWJlciB8IHVuZGVmaW5lZDtcbiAgbWF4U2l6ZTogbnVtYmVyIHwgdW5kZWZpbmVkO1xuICBwbGFjZWhvbGRlcjogc3RyaW5nO1xuICBoZWlnaHQ6IG51bWJlcjtcbn1cblxuY29uc3QgZGVmYXVsdE9wdGlvbnM6IEZpbGVEcmFnT3B0aW9ucyA9IHtcbiAgbWF4RmlsZXM6IHVuZGVmaW5lZCxcbiAgbWF4U2l6ZTogdW5kZWZpbmVkLFxuICBwbGFjZWhvbGRlcjogJycsXG4gIGhlaWdodDogMTI1LFxufVxuXG5leHBvcnQgY2xhc3MgRmlsZURyYWdFbGVtZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICBzdGF0aWMgaXMgPSAndW5pLWZpbGUtZHJhZyc7XG5cbiAgZWxlbWVudCE6IEhUTUxJbnB1dEVsZW1lbnQ7XG4gIG92ZXJsYXlMYWJlbCE6IEhUTUxMYWJlbEVsZW1lbnQ7XG4gIGJ1dHRvbiE6IEhUTUxCdXR0b25FbGVtZW50O1xuICBvcHRpb25zITogRmlsZURyYWdPcHRpb25zO1xuXG4gIGdldCBpbnB1dFNlbGVjdG9yKCkge1xuICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZSgnc2VsZWN0b3InKSB8fCAnaW5wdXRbdHlwZT1maWxlXSc7XG4gIH1cblxuICBnZXQgbXVsdGlwbGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudC5tdWx0aXBsZTtcbiAgfVxuXG4gIGNvbm5lY3RlZENhbGxiYWNrKCk6IHZvaWQge1xuICAgIHRoaXMuZWxlbWVudCA9IHRoaXMucXVlcnlTZWxlY3Rvcih0aGlzLmlucHV0U2VsZWN0b3IpITtcblxuICAgIHRoaXMucHJlcGFyZUVsZW1lbnRzKCk7XG5cbiAgICBjb25zdCBvcHRpb25zID0gSlNPTi5wYXJzZSh0aGlzLmdldEF0dHJpYnV0ZSgnb3B0aW9ucycpIHx8ICd7fScpIHx8IHt9O1xuXG4gICAgaWYgKHRoaXMuZWxlbWVudC5yZWFkT25seSkge1xuICAgICAgdGhpcy5lbGVtZW50LmRpc2FibGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICB0aGlzLm9wdGlvbnMgPSBtZXJnZURlZXAoe30sIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcblxuICAgIHRoaXMuYmluZEV2ZW50KCk7XG5cbiAgICB0aGlzLnN0eWxlLnZpc2liaWxpdHkgPSAnJztcblxuICAgIHRoaXMuc3R5bGUuaGVpZ2h0ID0gKHRoaXMub3B0aW9ucy5oZWlnaHQgfHwgMTAwKSArICdweCc7XG4gIH1cblxuICBiaW5kRXZlbnQoKSB7XG4gICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgKCkgPT4ge1xuICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2hvdmVyJyk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2xlYXZlJywgKCkgPT4ge1xuICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2hvdmVyJyk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsICgpID0+IHtcbiAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdob3ZlcicpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5vbkNoYW5nZSgpO1xuXG4gICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG4gICAgICB0aGlzLm9uQ2hhbmdlKGUpO1xuICAgIH0pO1xuICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIChlKSA9PiB7XG4gICAgICB0aGlzLm9uQ2hhbmdlKGUpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJlcGFyZUVsZW1lbnRzKCkge1xuICAgIGlmICh0aGlzLmNoaWxkcmVuLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy5jcmVhdGVFbGVtZW50c0xheW91dCgpO1xuICAgIH1cblxuICAgIHRoaXMub3ZlcmxheUxhYmVsID0gdGhpcy5xdWVyeVNlbGVjdG9yPEhUTUxMYWJlbEVsZW1lbnQ+KCdbZGF0YS1vdmVybGF5LWxhYmVsXScpITtcblxuICAgIGxldCBidXR0b24gPSB0aGlzLm92ZXJsYXlMYWJlbC5xdWVyeVNlbGVjdG9yKCdidXR0b24nKTtcblxuICAgIC8vIEIvQyBmb3IgbmV3IGZpbGUgZHJhZyBzdHlsZVxuICAgIGlmICghYnV0dG9uKSB7XG4gICAgICBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgIGJ1dHRvbi50eXBlID0gJ2J1dHRvbic7XG4gICAgICBidXR0b24uc2V0QXR0cmlidXRlKCdjbGFzcycsICdjLWZpbGUtZHJhZy1pbnB1dF9fYnV0dG9uIGJ0biBidG4tc3VjY2VzcyBidG4tc20gcHgtMiBweS0xJyk7XG4gICAgICBidXR0b24uaW5uZXJUZXh0ID0gX18oJ3VuaWNvcm4uZmllbGQuZmlsZS5kcmFnLmJ1dHRvbi50ZXh0Jyk7XG4gICAgICB0aGlzLm92ZXJsYXlMYWJlbC5hcHBlbmRDaGlsZChidXR0b24pO1xuICAgIH1cblxuICAgIHRoaXMuYnV0dG9uID0gYnV0dG9uO1xuICB9XG5cbiAgY3JlYXRlRWxlbWVudHNMYXlvdXQoKSB7XG4gICAgdGhpcy5pZCB8fD0gJ2MtZmlsZS1kcmFnLScgKyB1aWQoKTtcbiAgICBjb25zdCBuYW1lID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ25hbWUnKSB8fCAnZmlsZSc7XG4gICAgY29uc3QgaW5wdXRJZCA9IHRoaXMuaWQgKyAnX19pbnB1dCc7XG4gICAgY29uc3QgYnRuVGV4dCA9IF9fKCd1bmljb3JuLmZpZWxkLmZpbGUuZHJhZy5idXR0b24udGV4dCcpO1xuXG4gICAgY29uc3QgaW5wdXQgPSBodG1sKGA8aW5wdXQgaWQ9XCIke2lucHV0SWR9XCIgdHlwZT1cImZpbGVcIiBuYW1lPVwiJHtuYW1lfVwiIC8+YCk7XG4gICAgY29uc3QgbGFiZWwgPSBodG1sKGA8bGFiZWwgY2xhc3M9XCJweC0zIGMtZmlsZS1kcmFnLWlucHV0X19sYWJlbFwiXG4gICAgICAgIGRhdGEtb3ZlcmxheS1sYWJlbFxuICAgICAgICBmb3I9XCIke2lucHV0SWR9XCI+XG4gICAgICAgIDxzcGFuIGNsYXNzPVwibGFiZWwtdGV4dCBkLWJsb2NrXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImZhIGZhLXVwbG9hZFwiPjwvc3Bhbj5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImMtZmlsZS1kcmFnLWlucHV0X19idXR0b24gYnRuIGJ0bi1zdWNjZXNzIGJ0bi1zbSBweC0yIHB5LTFcIj5cbiAgICAgICAgICAgICR7YnRuVGV4dH1cbiAgICAgICAgPC9idXR0b24+XG4gICAgPC9sYWJlbD5gKTtcblxuICAgIHRoaXMuZWxlbWVudCA9IGlucHV0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgdGhpcy5vdmVybGF5TGFiZWwgPSBsYWJlbCBhcyBIVE1MTGFiZWxFbGVtZW50O1xuXG4gICAgdGhpcy5hcHBlbmRDaGlsZChpbnB1dCk7XG4gICAgdGhpcy5hcHBlbmRDaGlsZChsYWJlbCk7XG4gIH1cblxuICBvbkNoYW5nZShldnQ/OiBFdmVudCkge1xuICAgIGNvbnN0IGZpbGVzID0gdGhpcy5lbGVtZW50LmZpbGVzIHx8IFtdO1xuICAgIGNvbnN0IGxpbWl0ID0gdGhpcy5vcHRpb25zLm1heEZpbGVzO1xuICAgIGNvbnN0IG1heFNpemUgPSB0aGlzLm9wdGlvbnMubWF4U2l6ZTtcbiAgICBsZXQgcGxhY2Vob2xkZXIgPSB0aGlzLm9wdGlvbnMucGxhY2Vob2xkZXI7XG5cbiAgICBjb25zdCBhY2NlcHRlZCA9ICh0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhY2NlcHQnKSB8fCB0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWFjY2VwdGVkJykgfHwgJycpXG4gICAgICAuc3BsaXQoJywnKVxuICAgICAgLm1hcCh2ID0+IHYudHJpbSgpKVxuICAgICAgLmZpbHRlcih2ID0+IHYubGVuZ3RoID4gMClcbiAgICAgIC5tYXAodiA9PiB7XG4gICAgICAgIGlmICh2LmluZGV4T2YoJy8nKSA9PT0gLTEgJiYgdlswXSA9PT0gJy4nKSB7XG4gICAgICAgICAgcmV0dXJuIHYuc3Vic3RyaW5nKDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHY7XG4gICAgICB9KTtcblxuICAgIGxldCB0ZXh0OiBzdHJpbmc7XG5cbiAgICBpZiAoIXBsYWNlaG9sZGVyKSB7XG4gICAgICBpZiAodGhpcy5tdWx0aXBsZSkge1xuICAgICAgICBwbGFjZWhvbGRlciA9IF9fKCd1bmljb3JuLmZpZWxkLmZpbGUuZHJhZy5wbGFjZWhvbGRlci5tdWx0aXBsZScpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGxhY2Vob2xkZXIgPSBfXygndW5pY29ybi5maWVsZC5maWxlLmRyYWcucGxhY2Vob2xkZXIuc2luZ2xlJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gRmlsZXMgbGltaXRcbiAgICBpZiAobGltaXQgJiYgZmlsZXMubGVuZ3RoID4gbGltaXQpIHtcbiAgICAgIHRoaXMuYWxlcnQoX18oJ3VuaWNvcm4uZmllbGQuZmlsZS5kcmFnLm1lc3NhZ2UubWF4LmZpbGVzJywgbGltaXQpLCAnJywgJ3dhcm5pbmcnKTtcbiAgICAgIGV2dD8ucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBGaWxlcyBzaXplXG4gICAgbGV0IGZpbGVTaXplID0gMDtcbiAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKGZpbGVzLCBmaWxlID0+IHtcbiAgICAgIHRoaXMuY2hlY2tGaWxlVHlwZShhY2NlcHRlZCwgZmlsZSk7XG5cbiAgICAgIGZpbGVTaXplICs9IGZpbGUuc2l6ZTtcbiAgICB9KTtcblxuICAgIGlmIChtYXhTaXplICYmIChmaWxlU2l6ZSAvIDEwMjQgLyAxMDI0KSA+IG1heFNpemUpIHtcbiAgICAgIHRoaXMuYWxlcnQoXG4gICAgICAgIF9fKFxuICAgICAgICAgICd1bmljb3JuLmZpZWxkLmZpbGUuZHJhZy5tZXNzYWdlLm1heC5zaXplJyxcbiAgICAgICAgICBtYXhTaXplIDwgMSA/IChtYXhTaXplICogMTAyNCkgKyAnS0InIDogbWF4U2l6ZSArICdNQidcbiAgICAgICAgKSxcbiAgICAgICAgJycsXG4gICAgICAgICd3YXJuaW5nJ1xuICAgICAgKTtcbiAgICAgIGV2dD8ucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZmlsZXMubGVuZ3RoID4gMSkge1xuICAgICAgdGV4dCA9IGA8c3BhbiBjbGFzcz1cImZhIGZhLWZpbGVzIGZhLWNvcHlcIj48L3NwYW4+ICR7X18oJ3VuaWNvcm4uZmllbGQuZmlsZS5kcmFnLnNlbGVjdGVkJywgZmlsZXMubGVuZ3RoKX1gO1xuICAgIH0gZWxzZSBpZiAoZmlsZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICB0ZXh0ID0gYDxzcGFuIGNsYXNzPVwiZmEgZmEtZmlsZVwiPjwvc3Bhbj4gJHtmaWxlc1swXS5uYW1lfWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRleHQgPSBgPHNwYW4gY2xhc3M9XCJmYSBmYS11cGxvYWRcIj48L3NwYW4+ICR7cGxhY2Vob2xkZXJ9YDtcbiAgICB9XG5cbiAgICAvL3JlcGxhY2UgdGhlIFwiQ2hvb3NlIGEgZmlsZVwiIGxhYmVsXG4gICAgdGhpcy5vdmVybGF5TGFiZWwucXVlcnlTZWxlY3RvcjxIVE1MU3BhbkVsZW1lbnQ+KCdzcGFuJykhLmlubmVySFRNTCA9IHRleHQ7XG4gIH1cblxuICBjaGVja0ZpbGVUeXBlKGFjY2VwdGVkOiBzdHJpbmdbXSwgZmlsZTogRmlsZSkge1xuICAgIGNvbnN0IGZpbGVFeHQgPSBmaWxlLm5hbWUuc3BsaXQoJy4nKS5wb3AoKSB8fCAnJztcblxuICAgIGlmIChhY2NlcHRlZC5sZW5ndGgpIHtcbiAgICAgIGxldCBhbGxvdyA9IGZhbHNlO1xuXG4gICAgICBhY2NlcHRlZC5mb3JFYWNoKCh0eXBlKSA9PiB7XG4gICAgICAgIGlmIChhbGxvdykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlLmluZGV4T2YoJy8nKSAhPT0gLTEpIHtcbiAgICAgICAgICBpZiAodGhpcy5jb21wYXJlTWltZVR5cGUodHlwZSwgZmlsZS50eXBlKSkge1xuICAgICAgICAgICAgYWxsb3cgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAodHlwZS50b0xvd2VyQ2FzZSgpID09PSBmaWxlRXh0LnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgICAgIGFsbG93ID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpZiAoIWFsbG93KSB7XG4gICAgICAgIHRoaXMuYWxlcnQoXG4gICAgICAgICAgX18oJ3VuaWNvcm4uZmllbGQuZmlsZS5kcmFnLm1lc3NhZ2UudW5hY2NlcHRlZC5maWxlcycpLFxuICAgICAgICAgIF9fKCd1bmljb3JuLmZpZWxkLmZpbGUuZHJhZy5tZXNzYWdlLnVuYWNjZXB0ZWQuZmlsZXMuZGVzYycsIGFjY2VwdGVkLmpvaW4oJywgJykpLFxuICAgICAgICAgICd3YXJuaW5nJ1xuICAgICAgICApO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBhY2NlcHRlZCBmaWxlIGV4dCcpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbXBhcmVNaW1lVHlwZShhY2NlcHRlZDogc3RyaW5nLCBtaW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBhY2NlcHRlZDIgPSBhY2NlcHRlZC5zcGxpdCgnLycpO1xuICAgIGNvbnN0IG1pbWUyID0gbWltZS5zcGxpdCgnLycpO1xuXG4gICAgaWYgKGFjY2VwdGVkMlsxXSA9PT0gJyonKSB7XG4gICAgICByZXR1cm4gYWNjZXB0ZWQyWzBdID09PSBtaW1lMlswXTtcbiAgICB9XG5cbiAgICByZXR1cm4gYWNjZXB0ZWQgPT09IG1pbWU7XG4gIH1cblxuICBhc3luYyBhbGVydCh0aXRsZTogc3RyaW5nLCB0ZXh0OiBzdHJpbmcgPSAnJywgdHlwZTogc3RyaW5nID0gJ2luZm8nKSB7XG4gICAgYXdhaXQgc2ltcGxlQWxlcnQodGl0bGUsIHRleHQsIHR5cGUpO1xuICB9XG59XG5cbmN1c3RvbUVsZW1lbnRzLmRlZmluZShGaWxlRHJhZ0VsZW1lbnQuaXMsIEZpbGVEcmFnRWxlbWVudCk7XG5cbmV4cG9ydCBjb25zdCByZWFkeSA9IHVzZVVuaURpcmVjdGl2ZSgnZmlsZS1kcmFnLWZpZWxkJywge1xuICBtb3VudGVkKGVsKSB7XG4gICAgY29uc3QgaW5wdXQgPSBlbC5xdWVyeVNlbGVjdG9yPEhUTUxJbnB1dEVsZW1lbnQ+KCdpbnB1dFt0eXBlPWZpbGVdJykhO1xuICAgIGNvbnN0IHBsYWNlaG9sZGVySW5wdXQgPSBlbC5xdWVyeVNlbGVjdG9yPEhUTUxJbnB1dEVsZW1lbnQ+KCdbZGF0YS1yb2xlPXBsYWNlaG9sZGVyXScpITtcblxuICAgIGNvbnN0IHByZXZpZXcgPSBlbC5xdWVyeVNlbGVjdG9yKCcuYy1maWxlLWRyYWctcHJldmlldycpO1xuXG4gICAgaWYgKHByZXZpZXcpIHtcbiAgICAgIGNvbnN0IHByZXZpZXdMaW5rID0gcHJldmlldy5xdWVyeVNlbGVjdG9yPEhUTUxBbmNob3JFbGVtZW50PignLmMtZmlsZS1kcmFnLXByZXZpZXdfX2xpbmsnKSE7XG4gICAgICBjb25zdCBkZWxCdXR0b24gPSBwcmV2aWV3LnF1ZXJ5U2VsZWN0b3I8SFRNTEFuY2hvckVsZW1lbnQ+KCcuYy1maWxlLWRyYWctcHJldmlld19fZGVsZXRlJykhO1xuICAgICAgLy8gbGV0IGxpbmtUaXRsZSA9IHByZXZpZXdMaW5rLnRleHRDb250ZW50O1xuICAgICAgbGV0IGlucHV0VmFsdWUgPSBwbGFjZWhvbGRlcklucHV0LnZhbHVlO1xuICAgICAgbGV0IHJlcXVpcmVkID0gaW5wdXQucmVxdWlyZWQ7XG5cbiAgICAgIGlmIChwbGFjZWhvbGRlcklucHV0LnZhbHVlKSB7XG4gICAgICAgIGlucHV0LnJlcXVpcmVkID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGRlbEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgaWYgKGRlbEJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG4gICAgICAgICAgLy8gUmVzdG9yZVxuICAgICAgICAgIHByZXZpZXdMaW5rLnN0eWxlLnRleHREZWNvcmF0aW9uID0gJyc7XG4gICAgICAgICAgcHJldmlld0xpbmsuc3R5bGUuc2V0UHJvcGVydHkoJ2NvbG9yJywgJycpO1xuICAgICAgICAgIHBsYWNlaG9sZGVySW5wdXQudmFsdWUgPSBpbnB1dFZhbHVlO1xuICAgICAgICAgIGRlbEJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgICAgICBpbnB1dC5yZXF1aXJlZCA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIERlbGV0ZVxuICAgICAgICAgIHByZXZpZXdMaW5rLnN0eWxlLnRleHREZWNvcmF0aW9uID0gJ2xpbmUtdGhyb3VnaCc7XG4gICAgICAgICAgcHJldmlld0xpbmsuc3R5bGUuY29sb3IgPSAndmFyKC0tZmQtZGVsZXRlLWNvbG9yLCB2YXIoLS1icy1kYW5nZXIpKSc7XG4gICAgICAgICAgcGxhY2Vob2xkZXJJbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgICAgIGRlbEJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgICBpbnB1dC5yZXF1aXJlZCA9IHJlcXVpcmVkO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn0pO1xuXG5leHBvcnQgaW50ZXJmYWNlIEZpbGVEcmFnTW9kdWxlIHtcbiAgRmlsZURyYWdFbGVtZW50OiB0eXBlb2YgRmlsZURyYWdFbGVtZW50O1xufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBS0Esb0NBQW9CLFVBQVUsR0FBRztBQVNqQyxNQUFNLGlCQUFrQztBQUFBLEVBQ3RDLFVBQVU7QUFBQSxFQUNWLFNBQVM7QUFBQSxFQUNULGFBQWE7QUFBQSxFQUNiLFFBQVE7QUFDVjtBQUVPLE1BQU0sd0JBQXdCLFlBQVk7QUFBQSxFQUMvQyxPQUFPLEtBQUs7QUFBQSxFQUVaO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFFQSxJQUFJLGdCQUFnQjtBQUNsQixXQUFPLEtBQUssYUFBYSxVQUFVLEtBQUs7QUFBQSxFQUMxQztBQUFBLEVBRUEsSUFBSSxXQUFXO0FBQ2IsV0FBTyxLQUFLLFFBQVE7QUFBQSxFQUN0QjtBQUFBLEVBRUEsb0JBQTBCO0FBQ3hCLFNBQUssVUFBVSxLQUFLLGNBQWMsS0FBSyxhQUFhO0FBRXBELFNBQUssZ0JBQUE7QUFFTCxVQUFNLFVBQVUsS0FBSyxNQUFNLEtBQUssYUFBYSxTQUFTLEtBQUssSUFBSSxLQUFLLENBQUE7QUFFcEUsUUFBSSxLQUFLLFFBQVEsVUFBVTtBQUN6QixXQUFLLFFBQVEsV0FBVztBQUFBLElBQzFCO0FBRUEsU0FBSyxVQUFVLFVBQVUsQ0FBQSxHQUFJLGdCQUFnQixPQUFPO0FBRXBELFNBQUssVUFBQTtBQUVMLFNBQUssTUFBTSxhQUFhO0FBRXhCLFNBQUssTUFBTSxVQUFVLEtBQUssUUFBUSxVQUFVLE9BQU87QUFBQSxFQUNyRDtBQUFBLEVBRUEsWUFBWTtBQUNWLFNBQUssUUFBUSxpQkFBaUIsWUFBWSxNQUFNO0FBQzlDLFdBQUssUUFBUSxVQUFVLElBQUksT0FBTztBQUFBLElBQ3BDLENBQUM7QUFFRCxTQUFLLFFBQVEsaUJBQWlCLGFBQWEsTUFBTTtBQUMvQyxXQUFLLFFBQVEsVUFBVSxPQUFPLE9BQU87QUFBQSxJQUN2QyxDQUFDO0FBRUQsU0FBSyxRQUFRLGlCQUFpQixRQUFRLE1BQU07QUFDMUMsV0FBSyxRQUFRLFVBQVUsT0FBTyxPQUFPO0FBQUEsSUFDdkMsQ0FBQztBQUVELFNBQUssU0FBQTtBQUVMLFNBQUssUUFBUSxpQkFBaUIsVUFBVSxDQUFDLE1BQU07QUFDN0MsV0FBSyxTQUFTLENBQUM7QUFBQSxJQUNqQixDQUFDO0FBQ0QsU0FBSyxRQUFRLGlCQUFpQixTQUFTLENBQUMsTUFBTTtBQUM1QyxXQUFLLFNBQVMsQ0FBQztBQUFBLElBQ2pCLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFFQSxrQkFBa0I7QUFDaEIsUUFBSSxLQUFLLFNBQVMsV0FBVyxHQUFHO0FBQzlCLFdBQUsscUJBQUE7QUFBQSxJQUNQO0FBRUEsU0FBSyxlQUFlLEtBQUssY0FBZ0Msc0JBQXNCO0FBRS9FLFFBQUksU0FBUyxLQUFLLGFBQWEsY0FBYyxRQUFRO0FBR3JELFFBQUksQ0FBQyxRQUFRO0FBQ1gsZUFBUyxTQUFTLGNBQWMsUUFBUTtBQUN4QyxhQUFPLE9BQU87QUFDZCxhQUFPLGFBQWEsU0FBUyw0REFBNEQ7QUFDekYsYUFBTyxZQUFZLEdBQUcscUNBQXFDO0FBQzNELFdBQUssYUFBYSxZQUFZLE1BQU07QUFBQSxJQUN0QztBQUVBLFNBQUssU0FBUztBQUFBLEVBQ2hCO0FBQUEsRUFFQSx1QkFBdUI7QUFDckIsU0FBSyxPQUFPLGlCQUFpQixJQUFBO0FBQzdCLFVBQU0sT0FBTyxLQUFLLGFBQWEsTUFBTSxLQUFLO0FBQzFDLFVBQU0sVUFBVSxLQUFLLEtBQUs7QUFDMUIsVUFBTSxVQUFVLEdBQUcscUNBQXFDO0FBRXhELFVBQU0sUUFBUSxLQUFLLGNBQWMsT0FBTyx1QkFBdUIsSUFBSSxNQUFNO0FBQ3pFLFVBQU0sUUFBUSxLQUFLO0FBQUE7QUFBQSxlQUVSLE9BQU87QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGNBS1IsT0FBTztBQUFBO0FBQUEsYUFFUjtBQUVULFNBQUssVUFBVTtBQUNmLFNBQUssZUFBZTtBQUVwQixTQUFLLFlBQVksS0FBSztBQUN0QixTQUFLLFlBQVksS0FBSztBQUFBLEVBQ3hCO0FBQUEsRUFFQSxTQUFTLEtBQWE7QUFDcEIsVUFBTSxRQUFRLEtBQUssUUFBUSxTQUFTLENBQUE7QUFDcEMsVUFBTSxRQUFRLEtBQUssUUFBUTtBQUMzQixVQUFNLFVBQVUsS0FBSyxRQUFRO0FBQzdCLFFBQUksY0FBYyxLQUFLLFFBQVE7QUFFL0IsVUFBTSxZQUFZLEtBQUssUUFBUSxhQUFhLFFBQVEsS0FBSyxLQUFLLFFBQVEsYUFBYSxlQUFlLEtBQUssSUFDcEcsTUFBTSxHQUFHLEVBQ1QsSUFBSSxDQUFBLE1BQUssRUFBRSxLQUFBLENBQU0sRUFDakIsT0FBTyxDQUFBLE1BQUssRUFBRSxTQUFTLENBQUMsRUFDeEIsSUFBSSxDQUFBLE1BQUs7QUFDUixVQUFJLEVBQUUsUUFBUSxHQUFHLE1BQU0sTUFBTSxFQUFFLENBQUMsTUFBTSxLQUFLO0FBQ3pDLGVBQU8sRUFBRSxVQUFVLENBQUM7QUFBQSxNQUN0QjtBQUVBLGFBQU87QUFBQSxJQUNULENBQUM7QUFFSCxRQUFJO0FBRUosUUFBSSxDQUFDLGFBQWE7QUFDaEIsVUFBSSxLQUFLLFVBQVU7QUFDakIsc0JBQWMsR0FBRyw4Q0FBOEM7QUFBQSxNQUNqRSxPQUFPO0FBQ0wsc0JBQWMsR0FBRyw0Q0FBNEM7QUFBQSxNQUMvRDtBQUFBLElBQ0Y7QUFHQSxRQUFJLFNBQVMsTUFBTSxTQUFTLE9BQU87QUFDakMsV0FBSyxNQUFNLEdBQUcsNkNBQTZDLEtBQUssR0FBRyxJQUFJLFNBQVM7QUFDaEYsV0FBSyxlQUFBO0FBQ0w7QUFBQSxJQUNGO0FBR0EsUUFBSSxXQUFXO0FBQ2YsVUFBTSxVQUFVLFFBQVEsS0FBSyxPQUFPLENBQUEsU0FBUTtBQUMxQyxXQUFLLGNBQWMsVUFBVSxJQUFJO0FBRWpDLGtCQUFZLEtBQUs7QUFBQSxJQUNuQixDQUFDO0FBRUQsUUFBSSxXQUFZLFdBQVcsT0FBTyxPQUFRLFNBQVM7QUFDakQsV0FBSztBQUFBLFFBQ0g7QUFBQSxVQUNFO0FBQUEsVUFDQSxVQUFVLElBQUssVUFBVSxPQUFRLE9BQU8sVUFBVTtBQUFBLFFBQUE7QUFBQSxRQUVwRDtBQUFBLFFBQ0E7QUFBQSxNQUFBO0FBRUYsV0FBSyxlQUFBO0FBQ0w7QUFBQSxJQUNGO0FBRUEsUUFBSSxNQUFNLFNBQVMsR0FBRztBQUNwQixhQUFPLDZDQUE2QyxHQUFHLG9DQUFvQyxNQUFNLE1BQU0sQ0FBQztBQUFBLElBQzFHLFdBQVcsTUFBTSxXQUFXLEdBQUc7QUFDN0IsYUFBTyxvQ0FBb0MsTUFBTSxDQUFDLEVBQUUsSUFBSTtBQUFBLElBQzFELE9BQU87QUFDTCxhQUFPLHNDQUFzQyxXQUFXO0FBQUEsSUFDMUQ7QUFHQSxTQUFLLGFBQWEsY0FBK0IsTUFBTSxFQUFHLFlBQVk7QUFBQSxFQUN4RTtBQUFBLEVBRUEsY0FBYyxVQUFvQixNQUFZO0FBQzVDLFVBQU0sVUFBVSxLQUFLLEtBQUssTUFBTSxHQUFHLEVBQUUsU0FBUztBQUU5QyxRQUFJLFNBQVMsUUFBUTtBQUNuQixVQUFJLFFBQVE7QUFFWixlQUFTLFFBQVEsQ0FBQyxTQUFTO0FBQ3pCLFlBQUksT0FBTztBQUNUO0FBQUEsUUFDRjtBQUVBLFlBQUksS0FBSyxRQUFRLEdBQUcsTUFBTSxJQUFJO0FBQzVCLGNBQUksS0FBSyxnQkFBZ0IsTUFBTSxLQUFLLElBQUksR0FBRztBQUN6QyxvQkFBUTtBQUFBLFVBQ1Y7QUFBQSxRQUNGLE9BQU87QUFDTCxjQUFJLEtBQUssWUFBQSxNQUFrQixRQUFRLGVBQWU7QUFDaEQsb0JBQVE7QUFBQSxVQUNWO0FBQUEsUUFDRjtBQUFBLE1BQ0YsQ0FBQztBQUVELFVBQUksQ0FBQyxPQUFPO0FBQ1YsYUFBSztBQUFBLFVBQ0gsR0FBRyxrREFBa0Q7QUFBQSxVQUNyRCxHQUFHLHlEQUF5RCxTQUFTLEtBQUssSUFBSSxDQUFDO0FBQUEsVUFDL0U7QUFBQSxRQUFBO0FBRUYsY0FBTSxJQUFJLE1BQU0sdUJBQXVCO0FBQUEsTUFDekM7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBRUEsZ0JBQWdCLFVBQWtCLE1BQWM7QUFDOUMsVUFBTSxZQUFZLFNBQVMsTUFBTSxHQUFHO0FBQ3BDLFVBQU0sUUFBUSxLQUFLLE1BQU0sR0FBRztBQUU1QixRQUFJLFVBQVUsQ0FBQyxNQUFNLEtBQUs7QUFDeEIsYUFBTyxVQUFVLENBQUMsTUFBTSxNQUFNLENBQUM7QUFBQSxJQUNqQztBQUVBLFdBQU8sYUFBYTtBQUFBLEVBQ3RCO0FBQUEsRUFFQSxNQUFNLE1BQU0sT0FBZSxPQUFlLElBQUksT0FBZSxRQUFRO0FBQ25FLFVBQU0sWUFBWSxPQUFPLE1BQU0sSUFBSTtBQUFBLEVBQ3JDO0FBQ0Y7QUFFQSwrQkFBZSxPQUFBLHVCQUFPLGdCQUFnQixJQUFBLEdBQUksZUFBZTtBQUVsRCxNQUFNLFFBQVEsZ0NBQWdCLG1CQUFtQjtBQUFBLEVBQ3RELFFBQVEsSUFBSTtBQUNWLFVBQU0sUUFBUSxHQUFHLGNBQWdDLGtCQUFrQjtBQUNuRSxVQUFNLG1CQUFtQixHQUFHLGNBQWdDLHlCQUF5QjtBQUVyRixVQUFNLFVBQVUsR0FBRyxjQUFjLHNCQUFzQjtBQUV2RCxRQUFJLFNBQVM7QUFDWCxZQUFNLGNBQWMsUUFBUSxjQUFpQyw0QkFBNEI7QUFDekYsWUFBTSxZQUFZLFFBQVEsY0FBaUMsOEJBQThCO0FBRXpGLFVBQUksYUFBYSxpQkFBaUI7QUFDbEMsVUFBSSxXQUFXLE1BQU07QUFFckIsVUFBSSxpQkFBaUIsT0FBTztBQUMxQixjQUFNLFdBQVc7QUFBQSxNQUNuQjtBQUVBLGdCQUFVLGlCQUFpQixTQUFTLE1BQU07QUFDeEMsWUFBSSxVQUFVLFVBQVUsU0FBUyxRQUFRLEdBQUc7QUFFMUMsc0JBQVksTUFBTSxpQkFBaUI7QUFDbkMsc0JBQVksTUFBTSxZQUFZLFNBQVMsRUFBRTtBQUN6QywyQkFBaUIsUUFBUTtBQUN6QixvQkFBVSxVQUFVLE9BQU8sUUFBUTtBQUNuQyxnQkFBTSxXQUFXO0FBQUEsUUFDbkIsT0FBTztBQUVMLHNCQUFZLE1BQU0saUJBQWlCO0FBQ25DLHNCQUFZLE1BQU0sUUFBUTtBQUMxQiwyQkFBaUIsUUFBUTtBQUN6QixvQkFBVSxVQUFVLElBQUksUUFBUTtBQUNoQyxnQkFBTSxXQUFXO0FBQUEsUUFDbkI7QUFBQSxNQUNGLENBQUM7QUFBQSxJQUNIO0FBQUEsRUFDRjtBQUNGLENBQUM7In0=
