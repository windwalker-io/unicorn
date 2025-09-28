import { d as useUniDirective, m as mergeDeep } from "./unicorn-DR9JpPYO.js";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWZyYW1lLW1vZGFsLUNVX3ozYVdsLmpzIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbW9kdWxlL2lmcmFtZS1tb2RhbC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNb2RhbCB9IGZyb20gJ2Jvb3RzdHJhcCc7XG5pbXBvcnQgeyB1c2VVbmlEaXJlY3RpdmUgfSBmcm9tICcuLi9jb21wb3NhYmxlJztcbmltcG9ydCB7IG1lcmdlRGVlcCB9IGZyb20gJy4uL3V0aWxpdGllcyc7XG5cbmludGVyZmFjZSBJRnJhbWVNb2RhbE9wdGlvbnMge1xuICBpZD86IHN0cmluZztcbiAgc2l6ZT86IHN0cmluZztcbiAgcmVzaXplPzogYm9vbGVhbjtcbiAgaGVpZ2h0Pzogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgSUZyYW1lTW9kYWxFbGVtZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICBzdGF0aWMgaXMgPSAndW5pLWlmcmFtZS1tb2RhbCc7XG5cbiAgb3B0aW9ucyE6IElGcmFtZU1vZGFsT3B0aW9ucztcbiAgbW9kYWxFbGVtZW50ITogSFRNTERpdkVsZW1lbnQ7XG4gIG1vZGFsITogTW9kYWw7XG4gIGlmcmFtZSE6IEhUTUxJRnJhbWVFbGVtZW50O1xuXG4gIHRlbXBsYXRlKCkge1xuICAgIHJldHVybiBgXG48ZGl2IGNsYXNzPVwibW9kYWwgZmFkZSBjLXVuaWNvcm4taWZyYW1lLW1vZGFsXCIgaWQ9XCIke3RoaXMuZ2V0TW9kYWxJZCgpfVwiXG4gICAgZGF0YS1pZnJhbWUtbW9kYWw+XG4gICAgPGRpdiBjbGFzcz1cIm1vZGFsLWRpYWxvZyAke3RoaXMub3B0aW9ucz8uc2l6ZSB8fCAnbW9kYWwteGwnfVwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWJvZHlcIj5cbiAgICAgICAgICAgICAgICA8aWZyYW1lIGNsYXNzPVwiYy11bmljb3JuLWlmcmFtZS1tb2RhbF9faWZyYW1lXCIgd2lkdGg9XCIxMDAlXCIgc3JjPVwiXCIgZnJhbWVib3JkZXI9XCIwXCI+PC9pZnJhbWU+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG48L2Rpdj5gO1xuICB9XG5cbiAgZ2V0IHNlbGVjdG9yKCkge1xuICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZSgnc2VsZWN0b3InKSB8fCAnW2RhdGEtaWZyYW1lLW1vZGFsXSc7XG4gIH1cblxuICBhc3luYyBnZXRCb290c3RyYXBNb2RhbCgpIHtcbiAgICBjb25zdCB7IE1vZGFsIH0gPSBhd2FpdCBpbXBvcnQoJ2Jvb3RzdHJhcCcpO1xuXG4gICAgcmV0dXJuIHRoaXMubW9kYWwgPz89IE1vZGFsLmdldE9yQ3JlYXRlSW5zdGFuY2UodGhpcy5tb2RhbEVsZW1lbnQpO1xuICB9XG5cbiAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgdGhpcy5vcHRpb25zID0gSlNPTi5wYXJzZSh0aGlzLmdldEF0dHJpYnV0ZSgnb3B0aW9ucycpIHx8ICd7fScpO1xuXG4gICAgaWYgKCF0aGlzLmlubmVySFRNTC50cmltKCkpIHtcbiAgICAgIHRoaXMuaW5uZXJIVE1MID0gdGhpcy50ZW1wbGF0ZSgpO1xuICAgIH1cblxuICAgIHRoaXMubW9kYWxFbGVtZW50ID0gdGhpcy5xdWVyeVNlbGVjdG9yPEhUTUxEaXZFbGVtZW50Pih0aGlzLnNlbGVjdG9yKSE7XG4gICAgdGhpcy5pZnJhbWUgPSB0aGlzLm1vZGFsRWxlbWVudC5xdWVyeVNlbGVjdG9yPEhUTUxJRnJhbWVFbGVtZW50PignaWZyYW1lJykhO1xuXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHRoaXMuaWZyYW1lLm1vZGFsTGluayA9ICgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgICB0aGlzLmdldEJvb3RzdHJhcE1vZGFsKCk7XG4gIH1cblxuICBiaW5kRXZlbnRzKCkge1xuICAgIHRoaXMubW9kYWxFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2hpZGRlbi5icy5tb2RhbCcsICgpID0+IHtcbiAgICAgIHRoaXMuaWZyYW1lLnNyYyA9ICcnO1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgb3BlbihocmVmOiBzdHJpbmcsIG9wdGlvbnM6IElGcmFtZU1vZGFsT3B0aW9ucyA9IHt9KSB7XG4gICAgb3B0aW9ucyA9IG1lcmdlRGVlcChcbiAgICAgIHtcbiAgICAgICAgaGVpZ2h0OiB1bmRlZmluZWQsXG4gICAgICAgIHJlc2l6ZTogZmFsc2UsXG4gICAgICAgIHNpemU6ICdtb2RhbC1sZycsXG4gICAgICB9LFxuICAgICAgdGhpcy5vcHRpb25zLFxuICAgICAgb3B0aW9uc1xuICAgICk7XG5cbiAgICBpZiAob3B0aW9ucy5yZXNpemUpIHtcbiAgICAgIGNvbnN0IG9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5yZXNpemUodGhpcy5pZnJhbWUpO1xuXG4gICAgICAgIHRoaXMuaWZyYW1lLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBvbmxvYWQpO1xuICAgICAgfTtcblxuICAgICAgdGhpcy5pZnJhbWUuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIG9ubG9hZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaWZyYW1lLnN0eWxlLmhlaWdodCA9IG9wdGlvbnMuaGVpZ2h0IHx8ICc1MDBweCc7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuc2l6ZSAhPSBudWxsKSB7XG4gICAgICBjb25zdCBkaWFsb2cgPSB0aGlzLm1vZGFsRWxlbWVudC5xdWVyeVNlbGVjdG9yPEhUTUxEaXZFbGVtZW50PignLm1vZGFsLWRpYWxvZycpITtcbiAgICAgIGRpYWxvZy5jbGFzc0xpc3QucmVtb3ZlKCdtb2RhbC1sZycsICdtb2RhbC14bCcsICdtb2RhbC1zbScsICdtb2RhbC14cycpO1xuICAgICAgZGlhbG9nLmNsYXNzTGlzdC5hZGQob3B0aW9ucy5zaXplKTtcbiAgICB9XG5cbiAgICB0aGlzLmlmcmFtZS5zcmMgPSBocmVmO1xuICAgIGNvbnN0IG1vZGFsID0gYXdhaXQgdGhpcy5nZXRCb290c3RyYXBNb2RhbCgpO1xuICAgIG1vZGFsLnNob3coKTtcbiAgfVxuXG4gIGFzeW5jIGNsb3NlKCkge1xuICAgIHRoaXMuaWZyYW1lLnNyYyA9ICcnO1xuICAgIGNvbnN0IG1vZGFsID0gYXdhaXQgdGhpcy5nZXRCb290c3RyYXBNb2RhbCgpO1xuICAgIG1vZGFsLmhpZGUoKTtcbiAgfVxuXG4gIHJlc2l6ZShpZnJhbWU6IEhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAoIWlmcmFtZS5jb250ZW50V2luZG93KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbGV0IGhlaWdodCA9IGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxIZWlnaHQ7XG5cbiAgICAgIGhlaWdodCArPSAzMDtcblxuICAgICAgaWYgKGhlaWdodCA8IDUwMCkge1xuICAgICAgICBoZWlnaHQgPSA1MDA7XG4gICAgICB9XG5cbiAgICAgIGlmcmFtZS5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyAncHgnO1xuICAgIH0sIDMwKTtcbiAgfVxuXG4gIGdldE1vZGFsSWQoKSB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucz8uaWQgfHwgdGhpcy5pZCArICdfX21vZGFsJztcbiAgfVxufVxuXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoSUZyYW1lTW9kYWxFbGVtZW50LmlzLCBJRnJhbWVNb2RhbEVsZW1lbnQpO1xuXG5leHBvcnQgY29uc3QgcmVhZHkgPSB1c2VVbmlEaXJlY3RpdmUoJ21vZGFsLWxpbmsnLCB7XG4gIG1vdW50ZWQoZWwsIGJpbmRpbmcpIHtcbiAgICBsZXQgb3B0aW9uczogSUZyYW1lTW9kYWxPcHRpb25zID0ge307XG5cbiAgICBvcHRpb25zLmhlaWdodCA9IGVsLmRhdGFzZXQuaGVpZ2h0O1xuICAgIG9wdGlvbnMucmVzaXplID0gZWwuZGF0YXNldC5yZXNpemUgPT09ICcxJyB8fCBlbC5kYXRhc2V0LnJlc2l6ZSA9PT0gJ3RydWUnO1xuICAgIG9wdGlvbnMuc2l6ZSA9IGVsLmRhdGFzZXQuc2l6ZTtcblxuICAgIGNvbnN0IHRhcmdldCA9IGJpbmRpbmcudmFsdWU7XG5cbiAgICBlbC5zdHlsZS5wb2ludGVyRXZlbnRzID0gJyc7XG5cbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgY29uc3QgaW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG4gICAgICBcbiAgICAgIGlmICghaW0pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgXG4gICAgICBpZiAoJ3NyYycgaW4gZWwpIHtcbiAgICAgICAgaW0ub3BlbihlbC5zcmMsIG9wdGlvbnMpO1xuICAgICAgfSBlbHNlIGlmICgnaHJlZicgaW4gZWwpIHtcbiAgICAgICAgaW0ub3BlbihlbC5ocmVmLCBvcHRpb25zKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSWZyYW1lTW9kYWxNb2R1bGUge1xuICBJRnJhbWVNb2RhbEVsZW1lbnQ6IHR5cGVvZiBJRnJhbWVNb2RhbEVsZW1lbnQ7XG4gIHJlYWR5OiB0eXBlb2YgcmVhZHk7XG59XG4iXSwibmFtZXMiOlsiTW9kYWwiXSwibWFwcGluZ3MiOiI7QUFXTyxNQUFNLDJCQUEyQixZQUFZO0FBQUEsRUFDbEQsT0FBTyxLQUFLO0FBQUEsRUFFWjtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBRUEsV0FBVztBQUNULFdBQU87QUFBQSxxREFDMEMsS0FBSyxZQUFZO0FBQUE7QUFBQSwrQkFFdkMsS0FBSyxTQUFTLFFBQVEsVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FB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
