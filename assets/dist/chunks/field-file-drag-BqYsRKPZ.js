import { a as useUniDirective, a1 as mergeDeep, _ as __, K as uid, B as html, G as simpleAlert, a3 as injectCssToDocument } from "./unicorn-G5leHO5V.js";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGQtZmlsZS1kcmFnLUJxWXNSS1BaLmpzIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbW9kdWxlL2ZpZWxkLWZpbGUtZHJhZy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY3NzIGZyb20gJy4uLy4uL3Njc3MvZmllbGQvZmlsZS1kcmFnLnNjc3M/aW5saW5lJztcclxuaW1wb3J0IHsgdXNlVW5pRGlyZWN0aXZlIH0gZnJvbSAnLi4vY29tcG9zYWJsZSc7XHJcbmltcG9ydCB7IF9fLCBodG1sLCBpbmplY3RDc3NUb0RvY3VtZW50LCBzaW1wbGVBbGVydCwgdWlkIH0gZnJvbSAnLi4vc2VydmljZSc7XHJcbmltcG9ydCB7IG1lcmdlRGVlcCB9IGZyb20gJy4uL3V0aWxpdGllcyc7XHJcblxyXG5pbmplY3RDc3NUb0RvY3VtZW50KGRvY3VtZW50LCBjc3MpO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBGaWxlRHJhZ09wdGlvbnMge1xyXG4gIG1heEZpbGVzOiBudW1iZXIgfCB1bmRlZmluZWQ7XHJcbiAgbWF4U2l6ZTogbnVtYmVyIHwgdW5kZWZpbmVkO1xyXG4gIHBsYWNlaG9sZGVyOiBzdHJpbmc7XHJcbiAgaGVpZ2h0OiBudW1iZXI7XHJcbn1cclxuXHJcbmNvbnN0IGRlZmF1bHRPcHRpb25zOiBGaWxlRHJhZ09wdGlvbnMgPSB7XHJcbiAgbWF4RmlsZXM6IHVuZGVmaW5lZCxcclxuICBtYXhTaXplOiB1bmRlZmluZWQsXHJcbiAgcGxhY2Vob2xkZXI6ICcnLFxyXG4gIGhlaWdodDogMTI1LFxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRmlsZURyYWdFbGVtZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xyXG4gIHN0YXRpYyBpcyA9ICd1bmktZmlsZS1kcmFnJztcclxuXHJcbiAgZWxlbWVudCE6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgb3ZlcmxheUxhYmVsITogSFRNTExhYmVsRWxlbWVudDtcclxuICBidXR0b24hOiBIVE1MQnV0dG9uRWxlbWVudDtcclxuICBvcHRpb25zITogRmlsZURyYWdPcHRpb25zO1xyXG5cclxuICBnZXQgaW5wdXRTZWxlY3RvcigpIHtcclxuICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZSgnc2VsZWN0b3InKSB8fCAnaW5wdXRbdHlwZT1maWxlXSc7XHJcbiAgfVxyXG5cclxuICBnZXQgbXVsdGlwbGUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50Lm11bHRpcGxlO1xyXG4gIH1cclxuXHJcbiAgY29ubmVjdGVkQ2FsbGJhY2soKTogdm9pZCB7XHJcbiAgICB0aGlzLmVsZW1lbnQgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IodGhpcy5pbnB1dFNlbGVjdG9yKSE7XHJcblxyXG4gICAgdGhpcy5wcmVwYXJlRWxlbWVudHMoKTtcclxuXHJcbiAgICBjb25zdCBvcHRpb25zID0gSlNPTi5wYXJzZSh0aGlzLmdldEF0dHJpYnV0ZSgnb3B0aW9ucycpIHx8ICd7fScpIHx8IHt9O1xyXG5cclxuICAgIGlmICh0aGlzLmVsZW1lbnQucmVhZE9ubHkpIHtcclxuICAgICAgdGhpcy5lbGVtZW50LmRpc2FibGVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm9wdGlvbnMgPSBtZXJnZURlZXAoe30sIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcclxuXHJcbiAgICB0aGlzLmJpbmRFdmVudCgpO1xyXG5cclxuICAgIHRoaXMuc3R5bGUudmlzaWJpbGl0eSA9ICcnO1xyXG5cclxuICAgIHRoaXMuc3R5bGUuaGVpZ2h0ID0gKHRoaXMub3B0aW9ucy5oZWlnaHQgfHwgMTAwKSArICdweCc7XHJcbiAgfVxyXG5cclxuICBiaW5kRXZlbnQoKSB7XHJcbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ292ZXInLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdob3ZlcicpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdsZWF2ZScsICgpID0+IHtcclxuICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2hvdmVyJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsICgpID0+IHtcclxuICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2hvdmVyJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLm9uQ2hhbmdlKCk7XHJcblxyXG4gICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XHJcbiAgICAgIHRoaXMub25DaGFuZ2UoZSk7XHJcbiAgICB9KTtcclxuICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIChlKSA9PiB7XHJcbiAgICAgIHRoaXMub25DaGFuZ2UoZSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByZXBhcmVFbGVtZW50cygpIHtcclxuICAgIGlmICh0aGlzLmNoaWxkcmVuLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICB0aGlzLmNyZWF0ZUVsZW1lbnRzTGF5b3V0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5vdmVybGF5TGFiZWwgPSB0aGlzLnF1ZXJ5U2VsZWN0b3I8SFRNTExhYmVsRWxlbWVudD4oJ1tkYXRhLW92ZXJsYXktbGFiZWxdJykhO1xyXG5cclxuICAgIGxldCBidXR0b24gPSB0aGlzLm92ZXJsYXlMYWJlbC5xdWVyeVNlbGVjdG9yKCdidXR0b24nKTtcclxuXHJcbiAgICAvLyBCL0MgZm9yIG5ldyBmaWxlIGRyYWcgc3R5bGVcclxuICAgIGlmICghYnV0dG9uKSB7XHJcbiAgICAgIGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gICAgICBidXR0b24udHlwZSA9ICdidXR0b24nO1xyXG4gICAgICBidXR0b24uc2V0QXR0cmlidXRlKCdjbGFzcycsICdjLWZpbGUtZHJhZy1pbnB1dF9fYnV0dG9uIGJ0biBidG4tc3VjY2VzcyBidG4tc20gcHgtMiBweS0xJyk7XHJcbiAgICAgIGJ1dHRvbi5pbm5lclRleHQgPSBfXygndW5pY29ybi5maWVsZC5maWxlLmRyYWcuYnV0dG9uLnRleHQnKTtcclxuICAgICAgdGhpcy5vdmVybGF5TGFiZWwuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmJ1dHRvbiA9IGJ1dHRvbjtcclxuICB9XHJcblxyXG4gIGNyZWF0ZUVsZW1lbnRzTGF5b3V0KCkge1xyXG4gICAgdGhpcy5pZCB8fD0gJ2MtZmlsZS1kcmFnLScgKyB1aWQoKTtcclxuICAgIGNvbnN0IG5hbWUgPSB0aGlzLmdldEF0dHJpYnV0ZSgnbmFtZScpIHx8ICdmaWxlJztcclxuICAgIGNvbnN0IGlucHV0SWQgPSB0aGlzLmlkICsgJ19faW5wdXQnO1xyXG4gICAgY29uc3QgYnRuVGV4dCA9IF9fKCd1bmljb3JuLmZpZWxkLmZpbGUuZHJhZy5idXR0b24udGV4dCcpO1xyXG5cclxuICAgIGNvbnN0IGlucHV0ID0gaHRtbChgPGlucHV0IGlkPVwiJHtpbnB1dElkfVwiIHR5cGU9XCJmaWxlXCIgbmFtZT1cIiR7bmFtZX1cIiAvPmApO1xyXG4gICAgY29uc3QgbGFiZWwgPSBodG1sKGA8bGFiZWwgY2xhc3M9XCJweC0zIGMtZmlsZS1kcmFnLWlucHV0X19sYWJlbFwiXHJcbiAgICAgICAgZGF0YS1vdmVybGF5LWxhYmVsXHJcbiAgICAgICAgZm9yPVwiJHtpbnB1dElkfVwiPlxyXG4gICAgICAgIDxzcGFuIGNsYXNzPVwibGFiZWwtdGV4dCBkLWJsb2NrXCI+XHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZmEgZmEtdXBsb2FkXCI+PC9zcGFuPlxyXG4gICAgICAgIDwvc3Bhbj5cclxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImMtZmlsZS1kcmFnLWlucHV0X19idXR0b24gYnRuIGJ0bi1zdWNjZXNzIGJ0bi1zbSBweC0yIHB5LTFcIj5cclxuICAgICAgICAgICAgJHtidG5UZXh0fVxyXG4gICAgICAgIDwvYnV0dG9uPlxyXG4gICAgPC9sYWJlbD5gKTtcclxuXHJcbiAgICB0aGlzLmVsZW1lbnQgPSBpbnB1dCBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgdGhpcy5vdmVybGF5TGFiZWwgPSBsYWJlbCBhcyBIVE1MTGFiZWxFbGVtZW50O1xyXG5cclxuICAgIHRoaXMuYXBwZW5kQ2hpbGQoaW5wdXQpO1xyXG4gICAgdGhpcy5hcHBlbmRDaGlsZChsYWJlbCk7XHJcbiAgfVxyXG5cclxuICBvbkNoYW5nZShldnQ/OiBFdmVudCkge1xyXG4gICAgY29uc3QgZmlsZXMgPSB0aGlzLmVsZW1lbnQuZmlsZXMgfHwgW107XHJcbiAgICBjb25zdCBsaW1pdCA9IHRoaXMub3B0aW9ucy5tYXhGaWxlcztcclxuICAgIGNvbnN0IG1heFNpemUgPSB0aGlzLm9wdGlvbnMubWF4U2l6ZTtcclxuICAgIGxldCBwbGFjZWhvbGRlciA9IHRoaXMub3B0aW9ucy5wbGFjZWhvbGRlcjtcclxuXHJcbiAgICBjb25zdCBhY2NlcHRlZCA9ICh0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhY2NlcHQnKSB8fCB0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWFjY2VwdGVkJykgfHwgJycpXHJcbiAgICAgIC5zcGxpdCgnLCcpXHJcbiAgICAgIC5tYXAodiA9PiB2LnRyaW0oKSlcclxuICAgICAgLmZpbHRlcih2ID0+IHYubGVuZ3RoID4gMClcclxuICAgICAgLm1hcCh2ID0+IHtcclxuICAgICAgICBpZiAodi5pbmRleE9mKCcvJykgPT09IC0xICYmIHZbMF0gPT09ICcuJykge1xyXG4gICAgICAgICAgcmV0dXJuIHYuc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHY7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgIGxldCB0ZXh0OiBzdHJpbmc7XHJcblxyXG4gICAgaWYgKCFwbGFjZWhvbGRlcikge1xyXG4gICAgICBpZiAodGhpcy5tdWx0aXBsZSkge1xyXG4gICAgICAgIHBsYWNlaG9sZGVyID0gX18oJ3VuaWNvcm4uZmllbGQuZmlsZS5kcmFnLnBsYWNlaG9sZGVyLm11bHRpcGxlJyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcGxhY2Vob2xkZXIgPSBfXygndW5pY29ybi5maWVsZC5maWxlLmRyYWcucGxhY2Vob2xkZXIuc2luZ2xlJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBGaWxlcyBsaW1pdFxyXG4gICAgaWYgKGxpbWl0ICYmIGZpbGVzLmxlbmd0aCA+IGxpbWl0KSB7XHJcbiAgICAgIHRoaXMuYWxlcnQoX18oJ3VuaWNvcm4uZmllbGQuZmlsZS5kcmFnLm1lc3NhZ2UubWF4LmZpbGVzJywgbGltaXQpLCAnJywgJ3dhcm5pbmcnKTtcclxuICAgICAgZXZ0Py5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRmlsZXMgc2l6ZVxyXG4gICAgbGV0IGZpbGVTaXplID0gMDtcclxuICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoZmlsZXMsIGZpbGUgPT4ge1xyXG4gICAgICB0aGlzLmNoZWNrRmlsZVR5cGUoYWNjZXB0ZWQsIGZpbGUpO1xyXG5cclxuICAgICAgZmlsZVNpemUgKz0gZmlsZS5zaXplO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKG1heFNpemUgJiYgKGZpbGVTaXplIC8gMTAyNCAvIDEwMjQpID4gbWF4U2l6ZSkge1xyXG4gICAgICB0aGlzLmFsZXJ0KFxyXG4gICAgICAgIF9fKFxyXG4gICAgICAgICAgJ3VuaWNvcm4uZmllbGQuZmlsZS5kcmFnLm1lc3NhZ2UubWF4LnNpemUnLFxyXG4gICAgICAgICAgbWF4U2l6ZSA8IDEgPyAobWF4U2l6ZSAqIDEwMjQpICsgJ0tCJyA6IG1heFNpemUgKyAnTUInXHJcbiAgICAgICAgKSxcclxuICAgICAgICAnJyxcclxuICAgICAgICAnd2FybmluZydcclxuICAgICAgKTtcclxuICAgICAgZXZ0Py5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGZpbGVzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgdGV4dCA9IGA8c3BhbiBjbGFzcz1cImZhIGZhLWZpbGVzIGZhLWNvcHlcIj48L3NwYW4+ICR7X18oJ3VuaWNvcm4uZmllbGQuZmlsZS5kcmFnLnNlbGVjdGVkJywgZmlsZXMubGVuZ3RoKX1gO1xyXG4gICAgfSBlbHNlIGlmIChmaWxlcy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgdGV4dCA9IGA8c3BhbiBjbGFzcz1cImZhIGZhLWZpbGVcIj48L3NwYW4+ICR7ZmlsZXNbMF0ubmFtZX1gO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGV4dCA9IGA8c3BhbiBjbGFzcz1cImZhIGZhLXVwbG9hZFwiPjwvc3Bhbj4gJHtwbGFjZWhvbGRlcn1gO1xyXG4gICAgfVxyXG5cclxuICAgIC8vcmVwbGFjZSB0aGUgXCJDaG9vc2UgYSBmaWxlXCIgbGFiZWxcclxuICAgIHRoaXMub3ZlcmxheUxhYmVsLnF1ZXJ5U2VsZWN0b3I8SFRNTFNwYW5FbGVtZW50Pignc3BhbicpIS5pbm5lckhUTUwgPSB0ZXh0O1xyXG4gIH1cclxuXHJcbiAgY2hlY2tGaWxlVHlwZShhY2NlcHRlZDogc3RyaW5nW10sIGZpbGU6IEZpbGUpIHtcclxuICAgIGNvbnN0IGZpbGVFeHQgPSBmaWxlLm5hbWUuc3BsaXQoJy4nKS5wb3AoKSB8fCAnJztcclxuXHJcbiAgICBpZiAoYWNjZXB0ZWQubGVuZ3RoKSB7XHJcbiAgICAgIGxldCBhbGxvdyA9IGZhbHNlO1xyXG5cclxuICAgICAgYWNjZXB0ZWQuZm9yRWFjaCgodHlwZSkgPT4ge1xyXG4gICAgICAgIGlmIChhbGxvdykge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHR5cGUuaW5kZXhPZignLycpICE9PSAtMSkge1xyXG4gICAgICAgICAgaWYgKHRoaXMuY29tcGFyZU1pbWVUeXBlKHR5cGUsIGZpbGUudHlwZSkpIHtcclxuICAgICAgICAgICAgYWxsb3cgPSB0cnVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZiAodHlwZS50b0xvd2VyQ2FzZSgpID09PSBmaWxlRXh0LnRvTG93ZXJDYXNlKCkpIHtcclxuICAgICAgICAgICAgYWxsb3cgPSB0cnVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpZiAoIWFsbG93KSB7XHJcbiAgICAgICAgdGhpcy5hbGVydChcclxuICAgICAgICAgIF9fKCd1bmljb3JuLmZpZWxkLmZpbGUuZHJhZy5tZXNzYWdlLnVuYWNjZXB0ZWQuZmlsZXMnKSxcclxuICAgICAgICAgIF9fKCd1bmljb3JuLmZpZWxkLmZpbGUuZHJhZy5tZXNzYWdlLnVuYWNjZXB0ZWQuZmlsZXMuZGVzYycsIGFjY2VwdGVkLmpvaW4oJywgJykpLFxyXG4gICAgICAgICAgJ3dhcm5pbmcnXHJcbiAgICAgICAgKTtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBhY2NlcHRlZCBmaWxlIGV4dCcpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb21wYXJlTWltZVR5cGUoYWNjZXB0ZWQ6IHN0cmluZywgbWltZTogc3RyaW5nKSB7XHJcbiAgICBjb25zdCBhY2NlcHRlZDIgPSBhY2NlcHRlZC5zcGxpdCgnLycpO1xyXG4gICAgY29uc3QgbWltZTIgPSBtaW1lLnNwbGl0KCcvJyk7XHJcblxyXG4gICAgaWYgKGFjY2VwdGVkMlsxXSA9PT0gJyonKSB7XHJcbiAgICAgIHJldHVybiBhY2NlcHRlZDJbMF0gPT09IG1pbWUyWzBdO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhY2NlcHRlZCA9PT0gbWltZTtcclxuICB9XHJcblxyXG4gIGFzeW5jIGFsZXJ0KHRpdGxlOiBzdHJpbmcsIHRleHQ6IHN0cmluZyA9ICcnLCB0eXBlOiBzdHJpbmcgPSAnaW5mbycpIHtcclxuICAgIGF3YWl0IHNpbXBsZUFsZXJ0KHRpdGxlLCB0ZXh0LCB0eXBlKTtcclxuICB9XHJcbn1cclxuXHJcbmN1c3RvbUVsZW1lbnRzLmRlZmluZShGaWxlRHJhZ0VsZW1lbnQuaXMsIEZpbGVEcmFnRWxlbWVudCk7XHJcblxyXG5leHBvcnQgY29uc3QgcmVhZHkgPSB1c2VVbmlEaXJlY3RpdmUoJ2ZpbGUtZHJhZy1maWVsZCcsIHtcclxuICBtb3VudGVkKGVsKSB7XHJcbiAgICBjb25zdCBpbnB1dCA9IGVsLnF1ZXJ5U2VsZWN0b3I8SFRNTElucHV0RWxlbWVudD4oJ2lucHV0W3R5cGU9ZmlsZV0nKSE7XHJcbiAgICBjb25zdCBwbGFjZWhvbGRlcklucHV0ID0gZWwucXVlcnlTZWxlY3RvcjxIVE1MSW5wdXRFbGVtZW50PignW2RhdGEtcm9sZT1wbGFjZWhvbGRlcl0nKSE7XHJcblxyXG4gICAgY29uc3QgcHJldmlldyA9IGVsLnF1ZXJ5U2VsZWN0b3IoJy5jLWZpbGUtZHJhZy1wcmV2aWV3Jyk7XHJcblxyXG4gICAgaWYgKHByZXZpZXcpIHtcclxuICAgICAgY29uc3QgcHJldmlld0xpbmsgPSBwcmV2aWV3LnF1ZXJ5U2VsZWN0b3I8SFRNTEFuY2hvckVsZW1lbnQ+KCcuYy1maWxlLWRyYWctcHJldmlld19fbGluaycpITtcclxuICAgICAgY29uc3QgZGVsQnV0dG9uID0gcHJldmlldy5xdWVyeVNlbGVjdG9yPEhUTUxBbmNob3JFbGVtZW50PignLmMtZmlsZS1kcmFnLXByZXZpZXdfX2RlbGV0ZScpITtcclxuICAgICAgLy8gbGV0IGxpbmtUaXRsZSA9IHByZXZpZXdMaW5rLnRleHRDb250ZW50O1xyXG4gICAgICBsZXQgaW5wdXRWYWx1ZSA9IHBsYWNlaG9sZGVySW5wdXQudmFsdWU7XHJcbiAgICAgIGxldCByZXF1aXJlZCA9IGlucHV0LnJlcXVpcmVkO1xyXG5cclxuICAgICAgaWYgKHBsYWNlaG9sZGVySW5wdXQudmFsdWUpIHtcclxuICAgICAgICBpbnB1dC5yZXF1aXJlZCA9IGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBkZWxCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgaWYgKGRlbEJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XHJcbiAgICAgICAgICAvLyBSZXN0b3JlXHJcbiAgICAgICAgICBwcmV2aWV3TGluay5zdHlsZS50ZXh0RGVjb3JhdGlvbiA9ICcnO1xyXG4gICAgICAgICAgcHJldmlld0xpbmsuc3R5bGUuc2V0UHJvcGVydHkoJ2NvbG9yJywgJycpO1xyXG4gICAgICAgICAgcGxhY2Vob2xkZXJJbnB1dC52YWx1ZSA9IGlucHV0VmFsdWU7XHJcbiAgICAgICAgICBkZWxCdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgICBpbnB1dC5yZXF1aXJlZCA9IGZhbHNlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAvLyBEZWxldGVcclxuICAgICAgICAgIHByZXZpZXdMaW5rLnN0eWxlLnRleHREZWNvcmF0aW9uID0gJ2xpbmUtdGhyb3VnaCc7XHJcbiAgICAgICAgICBwcmV2aWV3TGluay5zdHlsZS5jb2xvciA9ICd2YXIoLS1mZC1kZWxldGUtY29sb3IsIHZhcigtLWJzLWRhbmdlcikpJztcclxuICAgICAgICAgIHBsYWNlaG9sZGVySW5wdXQudmFsdWUgPSAnJztcclxuICAgICAgICAgIGRlbEJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuICAgICAgICAgIGlucHV0LnJlcXVpcmVkID0gcmVxdWlyZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcbn0pO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBGaWxlRHJhZ01vZHVsZSB7XHJcbiAgRmlsZURyYWdFbGVtZW50OiB0eXBl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
