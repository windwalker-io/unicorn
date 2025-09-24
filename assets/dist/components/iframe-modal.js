import { f as r, m as d } from "../chunks/unicorn-Dap6NpVD.js";
class n extends HTMLElement {
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
    const { Modal: i } = await import("bootstrap");
    return this.modal ??= i.getOrCreateInstance(this.modalElement);
  }
  connectedCallback() {
    this.options = JSON.parse(this.getAttribute("options") || "{}"), this.innerHTML.trim() || (this.innerHTML = this.template()), this.modalElement = this.querySelector(this.selector), this.iframe = this.modalElement.querySelector("iframe"), this.iframe.modalLink = () => this, this.bindEvents(), this.getBootstrapModal();
  }
  bindEvents() {
    this.modalElement.addEventListener("hidden.bs.modal", () => {
      this.iframe.src = "";
    });
  }
  async open(i, e = {}) {
    if (e = d(
      {
        height: null,
        resize: !1,
        size: "modal-lg"
      },
      this.options,
      e
    ), e.resize) {
      const s = () => {
        this.resize(this.iframe), this.iframe.removeEventListener("load", s);
      };
      this.iframe.addEventListener("load", s);
    } else
      this.iframe.style.height = e.height || "500px";
    if (e.size != null) {
      const s = this.modalElement.querySelector(".modal-dialog");
      s.classList.remove("modal-lg", "modal-xl", "modal-sm", "modal-xs"), s.classList.add(e.size);
    }
    this.iframe.src = i, (await this.getBootstrapModal()).show();
  }
  async close() {
    this.iframe.src = "", (await this.getBootstrapModal()).hide();
  }
  resize(i) {
    setTimeout(() => {
      let e = i.contentWindow.document.documentElement.scrollHeight;
      e += 30, e < 500 && (e = 500), i.style.height = e + "px";
    }, 30);
  }
  getModalId() {
    return this.options?.id || this.id + "__modal";
  }
}
const m = /* @__PURE__ */ r("modal-link", {
  mounted(t, i) {
    let e = {};
    e.height = t.dataset.height, e.resize = t.dataset.resize === "1" || t.dataset.resize === "true", e.size = t.dataset.size;
    const o = i.value;
    t.style.pointerEvents = null, t.addEventListener("click", (s) => {
      s.preventDefault(), s.stopPropagation();
      const a = document.querySelector(o);
      a && ("src" in t ? a.open(t.src, e) : "href" in t && a.open(t.href, e));
    });
  }
});
export {
  n as IFrameModal,
  m as ready
};
