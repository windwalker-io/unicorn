import { d as useUniDirective, m as mergeDeep } from "./unicorn-CR0afSsW.js";
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
    const { Modal } = await import("bootstrap");
    return this.modal ??= Modal.getOrCreateInstance(this.modalElement);
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
        height: null,
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
    el.style.pointerEvents = null;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWZyYW1lLW1vZGFsLURkblhmanA4LmpzIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbW9kdWxlL2lmcmFtZS1tb2RhbC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1c2VVbmlEaXJlY3RpdmUgfSBmcm9tICcuLi9jb21wb3NhYmxlJztcbmltcG9ydCB7IG1lcmdlRGVlcCB9IGZyb20gJy4uL3V0aWxpdGllcyc7XG5cbmludGVyZmFjZSBJRnJhbWVNb2RhbE9wdGlvbnMge1xuICBpZD86IHN0cmluZztcbiAgc2l6ZT86IHN0cmluZztcbiAgcmVzaXplPzogYm9vbGVhbjtcbiAgaGVpZ2h0Pzogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgSUZyYW1lTW9kYWxFbGVtZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICBzdGF0aWMgaXMgPSAndW5pLWlmcmFtZS1tb2RhbCc7XG5cbiAgb3B0aW9uczogSUZyYW1lTW9kYWxPcHRpb25zO1xuICBtb2RhbEVsZW1lbnQ6IEhUTUxEaXZFbGVtZW50O1xuICBtb2RhbDogYW55O1xuICBpZnJhbWU6IEhUTUxJRnJhbWVFbGVtZW50O1xuXG4gIHRlbXBsYXRlKCkge1xuICAgIHJldHVybiBgXG48ZGl2IGNsYXNzPVwibW9kYWwgZmFkZSBjLXVuaWNvcm4taWZyYW1lLW1vZGFsXCIgaWQ9XCIke3RoaXMuZ2V0TW9kYWxJZCgpfVwiXG4gICAgZGF0YS1pZnJhbWUtbW9kYWw+XG4gICAgPGRpdiBjbGFzcz1cIm1vZGFsLWRpYWxvZyAke3RoaXMub3B0aW9ucz8uc2l6ZSB8fCAnbW9kYWwteGwnfVwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWJvZHlcIj5cbiAgICAgICAgICAgICAgICA8aWZyYW1lIGNsYXNzPVwiYy11bmljb3JuLWlmcmFtZS1tb2RhbF9faWZyYW1lXCIgd2lkdGg9XCIxMDAlXCIgc3JjPVwiXCIgZnJhbWVib3JkZXI9XCIwXCI+PC9pZnJhbWU+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG48L2Rpdj5gO1xuICB9XG5cbiAgZ2V0IHNlbGVjdG9yKCkge1xuICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZSgnc2VsZWN0b3InKSB8fCAnW2RhdGEtaWZyYW1lLW1vZGFsXSc7XG4gIH1cblxuICBhc3luYyBnZXRCb290c3RyYXBNb2RhbCgpIHtcbiAgICBjb25zdCB7IE1vZGFsIH0gPSBhd2FpdCBpbXBvcnQoJ2Jvb3RzdHJhcCcpO1xuXG4gICAgcmV0dXJuIHRoaXMubW9kYWwgPz89IE1vZGFsLmdldE9yQ3JlYXRlSW5zdGFuY2UodGhpcy5tb2RhbEVsZW1lbnQpO1xuICB9XG5cbiAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgdGhpcy5vcHRpb25zID0gSlNPTi5wYXJzZSh0aGlzLmdldEF0dHJpYnV0ZSgnb3B0aW9ucycpIHx8ICd7fScpO1xuXG4gICAgaWYgKCF0aGlzLmlubmVySFRNTC50cmltKCkpIHtcbiAgICAgIHRoaXMuaW5uZXJIVE1MID0gdGhpcy50ZW1wbGF0ZSgpO1xuICAgIH1cblxuICAgIHRoaXMubW9kYWxFbGVtZW50ID0gdGhpcy5xdWVyeVNlbGVjdG9yKHRoaXMuc2VsZWN0b3IpO1xuICAgIHRoaXMuaWZyYW1lID0gdGhpcy5tb2RhbEVsZW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MSUZyYW1lRWxlbWVudD4oJ2lmcmFtZScpO1xuXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHRoaXMuaWZyYW1lLm1vZGFsTGluayA9ICgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgICB0aGlzLmdldEJvb3RzdHJhcE1vZGFsKCk7XG4gIH1cblxuICBiaW5kRXZlbnRzKCkge1xuICAgIHRoaXMubW9kYWxFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2hpZGRlbi5icy5tb2RhbCcsICgpID0+IHtcbiAgICAgIHRoaXMuaWZyYW1lLnNyYyA9ICcnO1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgb3BlbihocmVmOiBzdHJpbmcsIG9wdGlvbnM6IElGcmFtZU1vZGFsT3B0aW9ucyA9IHt9KSB7XG4gICAgb3B0aW9ucyA9IG1lcmdlRGVlcChcbiAgICAgIHtcbiAgICAgICAgaGVpZ2h0OiBudWxsLFxuICAgICAgICByZXNpemU6IGZhbHNlLFxuICAgICAgICBzaXplOiAnbW9kYWwtbGcnLFxuICAgICAgfSxcbiAgICAgIHRoaXMub3B0aW9ucyxcbiAgICAgIG9wdGlvbnNcbiAgICApO1xuXG4gICAgaWYgKG9wdGlvbnMucmVzaXplKSB7XG4gICAgICBjb25zdCBvbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMucmVzaXplKHRoaXMuaWZyYW1lKTtcblxuICAgICAgICB0aGlzLmlmcmFtZS5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkJywgb25sb2FkKTtcbiAgICAgIH07XG5cbiAgICAgIHRoaXMuaWZyYW1lLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBvbmxvYWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmlmcmFtZS5zdHlsZS5oZWlnaHQgPSBvcHRpb25zLmhlaWdodCB8fCAnNTAwcHgnO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnNpemUgIT0gbnVsbCkge1xuICAgICAgY29uc3QgZGlhbG9nID0gdGhpcy5tb2RhbEVsZW1lbnQucXVlcnlTZWxlY3RvcignLm1vZGFsLWRpYWxvZycpO1xuICAgICAgZGlhbG9nLmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLWxnJywgJ21vZGFsLXhsJywgJ21vZGFsLXNtJywgJ21vZGFsLXhzJyk7XG4gICAgICBkaWFsb2cuY2xhc3NMaXN0LmFkZChvcHRpb25zLnNpemUpO1xuICAgIH1cblxuICAgIHRoaXMuaWZyYW1lLnNyYyA9IGhyZWY7XG4gICAgY29uc3QgbW9kYWwgPSBhd2FpdCB0aGlzLmdldEJvb3RzdHJhcE1vZGFsKCk7XG4gICAgbW9kYWwuc2hvdygpO1xuICB9XG5cbiAgYXN5bmMgY2xvc2UoKSB7XG4gICAgdGhpcy5pZnJhbWUuc3JjID0gJyc7XG4gICAgY29uc3QgbW9kYWwgPSBhd2FpdCB0aGlzLmdldEJvb3RzdHJhcE1vZGFsKCk7XG4gICAgbW9kYWwuaGlkZSgpO1xuICB9XG5cbiAgcmVzaXplKGlmcmFtZTogSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGxldCBoZWlnaHQgPSBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsSGVpZ2h0O1xuXG4gICAgICBoZWlnaHQgKz0gMzA7XG5cbiAgICAgIGlmIChoZWlnaHQgPCA1MDApIHtcbiAgICAgICAgaGVpZ2h0ID0gNTAwO1xuICAgICAgfVxuXG4gICAgICBpZnJhbWUuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4JztcbiAgICB9LCAzMCk7XG4gIH1cblxuICBnZXRNb2RhbElkKCkge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnM/LmlkIHx8IHRoaXMuaWQgKyAnX19tb2RhbCc7XG4gIH1cbn1cblxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKElGcmFtZU1vZGFsRWxlbWVudC5pcywgSUZyYW1lTW9kYWxFbGVtZW50KTtcblxuZXhwb3J0IGNvbnN0IHJlYWR5ID0gdXNlVW5pRGlyZWN0aXZlKCdtb2RhbC1saW5rJywge1xuICBtb3VudGVkKGVsLCBiaW5kaW5nKSB7XG4gICAgbGV0IG9wdGlvbnM6IElGcmFtZU1vZGFsT3B0aW9ucyA9IHt9O1xuXG4gICAgb3B0aW9ucy5oZWlnaHQgPSBlbC5kYXRhc2V0LmhlaWdodDtcbiAgICBvcHRpb25zLnJlc2l6ZSA9IGVsLmRhdGFzZXQucmVzaXplID09PSAnMScgfHwgZWwuZGF0YXNldC5yZXNpemUgPT09ICd0cnVlJztcbiAgICBvcHRpb25zLnNpemUgPSBlbC5kYXRhc2V0LnNpemU7XG5cbiAgICBjb25zdCB0YXJnZXQgPSBiaW5kaW5nLnZhbHVlO1xuXG4gICAgZWwuc3R5bGUucG9pbnRlckV2ZW50cyA9IG51bGw7XG5cbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgY29uc3QgaW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG4gICAgICBcbiAgICAgIGlmICghaW0pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgXG4gICAgICBpZiAoJ3NyYycgaW4gZWwpIHtcbiAgICAgICAgaW0ub3BlbihlbC5zcmMsIG9wdGlvbnMpO1xuICAgICAgfSBlbHNlIGlmICgnaHJlZicgaW4gZWwpIHtcbiAgICAgICAgaW0ub3BlbihlbC5ocmVmLCBvcHRpb25zKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSWZyYW1lTW9kYWxNb2R1bGUge1xuICBJRnJhbWVNb2RhbEVsZW1lbnQ6IHR5cGVvZiBJRnJhbWVNb2RhbEVsZW1lbnQ7XG4gIHJlYWR5OiB0eXBlb2YgcmVhZHk7XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQVVPLE1BQU0sMkJBQTJCLFlBQVk7QUFBQSxFQUNsRCxPQUFPLEtBQUs7QUFBQSxFQUVaO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFFQSxXQUFXO0FBQ1QsV0FBTztBQUFBLHFEQUMwQyxLQUFLLFlBQVk7QUFBQTtBQUFBLCtCQUV2QyxLQUFLLFNBQVMsUUFBUSxVQUFVO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQVE3RDtBQUFBLEVBRUEsSUFBSSxXQUFXO0FBQ2IsV0FBTyxLQUFLLGFBQWEsVUFBVSxLQUFLO0FBQUEsRUFDMUM7QUFBQSxFQUVBLE1BQU0sb0JBQW9CO0FBQ3hCLFVBQU0sRUFBRSxNQUFBLElBQVUsTUFBTSxPQUFPLFdBQVc7QUFF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
