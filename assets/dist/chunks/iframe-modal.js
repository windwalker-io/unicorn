import { a as useUniDirective, a7 as mergeDeep } from "./unicorn.js";
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
//# sourceMappingURL=iframe-modal.js.map
