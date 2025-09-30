import { u as useUniDirective } from "../composable/useUniDirective.js";
import { m as mergeDeep } from "../utilities/arr.js";
class IFrameModalElement extends HTMLElement {
  static is = "uni-iframe-modal";
  options;
  modalElement;
  modal;
  iframe;
  template() {
    return `
<div class="modal fade c-unicorn-iframe-modal" id="${this.getModalId()}"
    data-iframe-modal>
    <div class="modal-dialog ${this.options?.size || "modal-xl"}">
        <div class="modal-content">
            <div class="modal-body">
                <iframe class="c-unicorn-iframe-modal__iframe" width="100%" src="" frameborder="0"></iframe>
            </div>
        </div>
    </div>
</div>`;
  }
  get selector() {
    return this.getAttribute("selector") || "[data-iframe-modal]";
  }
  async getBootstrapModal() {
    const { Modal: Modal2 } = await import("bootstrap");
    return this.modal ??= Modal2.getOrCreateInstance(this.modalElement);
  }
  connectedCallback() {
    this.options = JSON.parse(this.getAttribute("options") || "{}");
    if (!this.innerHTML.trim()) {
      this.innerHTML = this.template();
    }
    this.modalElement = this.querySelector(this.selector);
    this.iframe = this.modalElement.querySelector("iframe");
    this.iframe.modalLink = () => {
      return this;
    };
    this.bindEvents();
    this.getBootstrapModal();
  }
  bindEvents() {
    this.modalElement.addEventListener("hidden.bs.modal", () => {
      this.iframe.src = "";
    });
  }
  async open(href, options = {}) {
    options = mergeDeep(
      {
        height: void 0,
        resize: false,
        size: "modal-lg"
      },
      this.options,
      options
    );
    if (options.resize) {
      const onload = () => {
        this.resize(this.iframe);
        this.iframe.removeEventListener("load", onload);
      };
      this.iframe.addEventListener("load", onload);
    } else {
      this.iframe.style.height = options.height || "500px";
    }
    if (options.size != null) {
      const dialog = this.modalElement.querySelector(".modal-dialog");
      dialog.classList.remove("modal-lg", "modal-xl", "modal-sm", "modal-xs");
      dialog.classList.add(options.size);
    }
    this.iframe.src = href;
    const modal = await this.getBootstrapModal();
    modal.show();
  }
  async close() {
    this.iframe.src = "";
    const modal = await this.getBootstrapModal();
    modal.hide();
  }
  resize(iframe) {
    setTimeout(() => {
      if (!iframe.contentWindow) {
        return;
      }
      let height = iframe.contentWindow.document.documentElement.scrollHeight;
      height += 30;
      if (height < 500) {
        height = 500;
      }
      iframe.style.height = height + "px";
    }, 30);
  }
  getModalId() {
    return this.options?.id || this.id + "__modal";
  }
}
/* @__PURE__ */ customElements.define(/* @__PURE__ */ (() => IFrameModalElement.is)(), IFrameModalElement);
const ready = /* @__PURE__ */ useUniDirective("modal-link", {
  mounted(el, binding) {
    let options = {};
    options.height = el.dataset.height;
    options.resize = el.dataset.resize === "1" || el.dataset.resize === "true";
    options.size = el.dataset.size;
    const target = binding.value;
    el.style.pointerEvents = "";
    el.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const im = document.querySelector(target);
      if (!im) {
        return;
      }
      if ("src" in el) {
        im.open(el.src, options);
      } else if ("href" in el) {
        im.open(el.href, options);
      }
    });
  }
});
export {
  IFrameModalElement,
  ready
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWZyYW1lLW1vZGFsLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbW9kdWxlL2lmcmFtZS1tb2RhbC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNb2RhbCB9IGZyb20gJ2Jvb3RzdHJhcCc7XHJcbmltcG9ydCB7IHVzZVVuaURpcmVjdGl2ZSB9IGZyb20gJy4uL2NvbXBvc2FibGUnO1xyXG5pbXBvcnQgeyBtZXJnZURlZXAgfSBmcm9tICcuLi91dGlsaXRpZXMnO1xyXG5cclxuaW50ZXJmYWNlIElGcmFtZU1vZGFsT3B0aW9ucyB7XHJcbiAgaWQ/OiBzdHJpbmc7XHJcbiAgc2l6ZT86IHN0cmluZztcclxuICByZXNpemU/OiBib29sZWFuO1xyXG4gIGhlaWdodD86IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIElGcmFtZU1vZGFsRWxlbWVudCBleHRlbmRzIEhUTUxFbGVtZW50IHtcclxuICBzdGF0aWMgaXMgPSAndW5pLWlmcmFtZS1tb2RhbCc7XHJcblxyXG4gIG9wdGlvbnMhOiBJRnJhbWVNb2RhbE9wdGlvbnM7XHJcbiAgbW9kYWxFbGVtZW50ITogSFRNTERpdkVsZW1lbnQ7XHJcbiAgbW9kYWwhOiBNb2RhbDtcclxuICBpZnJhbWUhOiBIVE1MSUZyYW1lRWxlbWVudDtcclxuXHJcbiAgdGVtcGxhdGUoKSB7XHJcbiAgICByZXR1cm4gYFxyXG48ZGl2IGNsYXNzPVwibW9kYWwgZmFkZSBjLXVuaWNvcm4taWZyYW1lLW1vZGFsXCIgaWQ9XCIke3RoaXMuZ2V0TW9kYWxJZCgpfVwiXHJcbiAgICBkYXRhLWlmcmFtZS1tb2RhbD5cclxuICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1kaWFsb2cgJHt0aGlzLm9wdGlvbnM/LnNpemUgfHwgJ21vZGFsLXhsJ31cIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtYm9keVwiPlxyXG4gICAgICAgICAgICAgICAgPGlmcmFtZSBjbGFzcz1cImMtdW5pY29ybi1pZnJhbWUtbW9kYWxfX2lmcmFtZVwiIHdpZHRoPVwiMTAwJVwiIHNyYz1cIlwiIGZyYW1lYm9yZGVyPVwiMFwiPjwvaWZyYW1lPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG48L2Rpdj5gO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHNlbGVjdG9yKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKCdzZWxlY3RvcicpIHx8ICdbZGF0YS1pZnJhbWUtbW9kYWxdJztcclxuICB9XHJcblxyXG4gIGFzeW5jIGdldEJvb3RzdHJhcE1vZGFsKCkge1xyXG4gICAgY29uc3QgeyBNb2RhbCB9ID0gYXdhaXQgaW1wb3J0KCdib290c3RyYXAnKTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5tb2RhbCA/Pz0gTW9kYWwuZ2V0T3JDcmVhdGVJbnN0YW5jZSh0aGlzLm1vZGFsRWxlbWVudCk7XHJcbiAgfVxyXG5cclxuICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcclxuICAgIHRoaXMub3B0aW9ucyA9IEpTT04ucGFyc2UodGhpcy5nZXRBdHRyaWJ1dGUoJ29wdGlvbnMnKSB8fCAne30nKTtcclxuXHJcbiAgICBpZiAoIXRoaXMuaW5uZXJIVE1MLnRyaW0oKSkge1xyXG4gICAgICB0aGlzLmlubmVySFRNTCA9IHRoaXMudGVtcGxhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm1vZGFsRWxlbWVudCA9IHRoaXMucXVlcnlTZWxlY3RvcjxIVE1MRGl2RWxlbWVudD4odGhpcy5zZWxlY3RvcikhO1xyXG4gICAgdGhpcy5pZnJhbWUgPSB0aGlzLm1vZGFsRWxlbWVudC5xdWVyeVNlbGVjdG9yPEhUTUxJRnJhbWVFbGVtZW50PignaWZyYW1lJykhO1xyXG5cclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIHRoaXMuaWZyYW1lLm1vZGFsTGluayA9ICgpID0+IHtcclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuYmluZEV2ZW50cygpO1xyXG4gICAgdGhpcy5nZXRCb290c3RyYXBNb2RhbCgpO1xyXG4gIH1cclxuXHJcbiAgYmluZEV2ZW50cygpIHtcclxuICAgIHRoaXMubW9kYWxFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2hpZGRlbi5icy5tb2RhbCcsICgpID0+IHtcclxuICAgICAgdGhpcy5pZnJhbWUuc3JjID0gJyc7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGFzeW5jIG9wZW4oaHJlZjogc3RyaW5nLCBvcHRpb25zOiBJRnJhbWVNb2RhbE9wdGlvbnMgPSB7fSkge1xyXG4gICAgb3B0aW9ucyA9IG1lcmdlRGVlcChcclxuICAgICAge1xyXG4gICAgICAgIGhlaWdodDogdW5kZWZpbmVkLFxyXG4gICAgICAgIHJlc2l6ZTogZmFsc2UsXHJcbiAgICAgICAgc2l6ZTogJ21vZGFsLWxnJyxcclxuICAgICAgfSxcclxuICAgICAgdGhpcy5vcHRpb25zLFxyXG4gICAgICBvcHRpb25zXHJcbiAgICApO1xyXG5cclxuICAgIGlmIChvcHRpb25zLnJlc2l6ZSkge1xyXG4gICAgICBjb25zdCBvbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5yZXNpemUodGhpcy5pZnJhbWUpO1xyXG5cclxuICAgICAgICB0aGlzLmlmcmFtZS5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkJywgb25sb2FkKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHRoaXMuaWZyYW1lLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBvbmxvYWQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5pZnJhbWUuc3R5bGUuaGVpZ2h0ID0gb3B0aW9ucy5oZWlnaHQgfHwgJzUwMHB4JztcclxuICAgIH1cclxuXHJcbiAgICBpZiAob3B0aW9ucy5zaXplICE9IG51bGwpIHtcclxuICAgICAgY29uc3QgZGlhbG9nID0gdGhpcy5tb2RhbEVsZW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRGl2RWxlbWVudD4oJy5tb2RhbC1kaWFsb2cnKSE7XHJcbiAgICAgIGRpYWxvZy5jbGFzc0xpc3QucmVtb3ZlKCdtb2RhbC1sZycsICdtb2RhbC14bCcsICdtb2RhbC1zbScsICdtb2RhbC14cycpO1xyXG4gICAgICBkaWFsb2cuY2xhc3NMaXN0LmFkZChvcHRpb25zLnNpemUpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaWZyYW1lLnNyYyA9IGhyZWY7XHJcbiAgICBjb25zdCBtb2RhbCA9IGF3YWl0IHRoaXMuZ2V0Qm9vdHN0cmFwTW9kYWwoKTtcclxuICAgIG1vZGFsLnNob3coKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIGNsb3NlKCkge1xyXG4gICAgdGhpcy5pZnJhbWUuc3JjID0gJyc7XHJcbiAgICBjb25zdCBtb2RhbCA9IGF3YWl0IHRoaXMuZ2V0Qm9vdHN0cmFwTW9kYWwoKTtcclxuICAgIG1vZGFsLmhpZGUoKTtcclxuICB9XHJcblxyXG4gIHJlc2l6ZShpZnJhbWU6IEhUTUxJRnJhbWVFbGVtZW50KSB7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgaWYgKCFpZnJhbWUuY29udGVudFdpbmRvdykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IGhlaWdodCA9IGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxIZWlnaHQ7XHJcblxyXG4gICAgICBoZWlnaHQgKz0gMzA7XHJcblxyXG4gICAgICBpZiAoaGVpZ2h0IDwgNTAwKSB7XHJcbiAgICAgICAgaGVpZ2h0ID0gNTAwO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZnJhbWUuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4JztcclxuICAgIH0sIDMwKTtcclxuICB9XHJcblxyXG4gIGdldE1vZGFsSWQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zPy5pZCB8fCB0aGlzLmlkICsgJ19fbW9kYWwnO1xyXG4gIH1cclxufVxyXG5cclxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKElGcmFtZU1vZGFsRWxlbWVudC5pcywgSUZyYW1lTW9kYWxFbGVtZW50KTtcclxuXHJcbmV4cG9ydCBjb25zdCByZWFkeSA9IHVzZVVuaURpcmVjdGl2ZSgnbW9kYWwtbGluaycsIHtcclxuICBtb3VudGVkKGVsLCBiaW5kaW5nKSB7XHJcbiAgICBsZXQgb3B0aW9uczogSUZyYW1lTW9kYWxPcHRpb25zID0ge307XHJcblxyXG4gICAgb3B0aW9ucy5oZWlnaHQgPSBlbC5kYXRhc2V0LmhlaWdodDtcclxuICAgIG9wdGlvbnMucmVzaXplID0gZWwuZGF0YXNldC5yZXNpemUgPT09ICcxJyB8fCBlbC5kYXRhc2V0LnJlc2l6ZSA9PT0gJ3RydWUnO1xyXG4gICAgb3B0aW9ucy5zaXplID0gZWwuZGF0YXNldC5zaXplO1xyXG5cclxuICAgIGNvbnN0IHRhcmdldCA9IGJpbmRpbmcudmFsdWU7XHJcblxyXG4gICAgZWwuc3R5bGUucG9pbnRlckV2ZW50cyA9ICcnO1xyXG5cclxuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBjb25zdCBpbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcclxuICAgICAgXHJcbiAgICAgIGlmICghaW0pIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIGlmICgnc3JjJyBpbiBlbCkge1xyXG4gICAgICAgIGltLm9wZW4oZWwuc3JjLCBvcHRpb25zKTtcclxuICAgICAgfSBlbHNlIGlmICgnaHJlZicgaW4gZWwpIHtcclxuICAgICAgICBpbS5vcGVuKGVsLmhyZWYsIG9wdGlvbnMpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbn0pO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJZnJhbWVNb2RhbE1vZHVsZSB7XHJcbiAgSUZyYW1lTW9kYWxFbGVtZW50OiB0eXBlb2YgSUZyYW1lTW9kYWxFbGVtZW50O1xyXG4gIHJlYWR5OiB0eXBlb2YgcmVhZHk7XHJcbn1cclxuIl0sIm5hbWVzIjpbIk1vZGFsIl0sIm1hcHBpbmdzIjoiOztBQVdPLE1BQU0sMkJBQTJCLFlBQVk7QUFBQSxFQUNsRCxPQUFPLEtBQUs7QUFBQSxFQUVaO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFFQSxXQUFXO0FBQ1QsV0FBTztBQUFBLHFEQUMwQyxLQUFLLFlBQVk7QUFBQTtBQUFBLCtCQUV2QyxLQUFLLFNBQVMsUUFBUSxVQUFVO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQVE3RDtBQUFBLEVBRUEsSUFBSSxXQUFXO0FBQ2IsV0FBTyxLQUFLLGFBQWEsVUFBVSxLQUFLO0FBQUEsRUFDMUM7QUFBQSxFQUVBLE1BQU0sb0JBQW9CO0FBQ3hCLFVBQU0sRUFBRSxPQUFBQSxXQUFVLE1BQU0sT0FBTyxXQUFXO0FBRTFDLFdBQU8sS0FBSyxVQUFVQSxPQUFNLG9CQUFvQixLQUFLLFlBQVk7QUFBQSxFQUNuRTtBQUFBLEVBRUEsb0JBQW9CO0FBQ2xCLFNBQUssVUFBVSxLQUFLLE1BQU0sS0FBSyxhQUFhLFNBQVMsS0FBSyxJQUFJO0FBRTlELFFBQUksQ0FBQyxLQUFLLFVBQVUsUUFBUTtBQUMxQixXQUFLLFlBQVksS0FBSyxTQUFBO0FBQUEsSUFDeEI7QUFFQSxTQUFLLGVBQWUsS0FBSyxjQUE4QixLQUFLLFFBQVE7QUFDcEUsU0FBSyxTQUFTLEtBQUssYUFBYSxjQUFpQyxRQUFRO0FBR3pFLFNBQUssT0FBTyxZQUFZLE1BQU07QUFDNUIsYUFBTztBQUFBLElBQ1Q7QUFFQSxTQUFLLFdBQUE7QUFDTCxTQUFLLGtCQUFBO0FBQUEsRUFDUDtBQUFBLEVBRUEsYUFBYTtBQUNYLFNBQUssYUFBYSxpQkFBaUIsbUJBQW1CLE1BQU07QUFDMUQsV0FBSyxPQUFPLE1BQU07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
