import { k as html, i as selectOne } from "./unicorn-BsRnuUg4.js";
class UIBootstrap5 {
  static instance = null;
  static get() {
    return this.instance ??= new this();
  }
  renderMessage(messages, type = "info") {
    if (!Array.isArray(messages)) {
      messages = [messages];
    }
    let text = "";
    messages.forEach((msg) => {
      text += `<div class="">${msg}</div>`;
    });
    const msgHtml = html(`<div class="alert alert-${type} alert-dismissible fade show" role="alert">
  ${text}
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>`);
    const container = selectOne(".c-messages-container");
    if (container) {
      container.appendChild(msgHtml);
    }
  }
  clearMessages() {
    const container = selectOne(".c-messages-container");
    if (container) {
      container.innerHTML = "";
    }
  }
  async keepTab(selector, config = {}) {
    const module = await import("./keep-tab-CMV_zqVE.js");
    if (selector) {
      return new module.LoadTab(selector, config);
    }
    return module;
  }
  async buttonRadio(selector, config = {}) {
    const m = await import("./button-radio-B_S12ghe.js");
    if (selector) {
      return m.ButtonRadio.handle(selector, config);
    }
    return m;
  }
  getMajorVersion(module) {
    return Number(module.VERSION.split(".").shift());
  }
}
export {
  UIBootstrap5
};
