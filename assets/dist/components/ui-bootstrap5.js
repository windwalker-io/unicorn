import { k as o, i } from "../chunks/unicorn-Dap6NpVD.js";
class d {
  static instance = null;
  static get() {
    return this.instance ??= new this();
  }
  renderMessage(t, e = "info") {
    Array.isArray(t) || (t = [t]);
    let a = "";
    t.forEach((r) => {
      a += `<div class="">${r}</div>`;
    });
    const s = o(`<div class="alert alert-${e} alert-dismissible fade show" role="alert">
  ${a}
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>`), n = i(".c-messages-container");
    n && n.appendChild(s);
  }
  clearMessages() {
    const t = i(".c-messages-container");
    t && (t.innerHTML = "");
  }
  async keepTab(t, e = {}) {
    const a = await import("../chunks/keep-tab-BsziCBg8.js");
    return t ? new a.LoadTab(t, e) : a;
  }
  async buttonRadio(t, e = {}) {
    const a = await import("../chunks/button-radio-ANVpcuA5.js");
    return t ? a.ButtonRadio.handle(t, e) : a;
  }
  getMajorVersion(t) {
    return Number(t.VERSION.split(".").shift());
  }
}
export {
  d as UIBootstrap5
};
