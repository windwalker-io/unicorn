import { Tooltip } from "bootstrap";
import { k as html, i as selectOne, o as module } from "./unicorn-DvsCW02c.js";
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
    const module2 = await import("./keep-tab-yF28GBDa.js");
    if (selector) {
      return new module2.LoadTab(selector, config);
    }
    return module2;
  }
  async buttonRadio(selector, config = {}) {
    const m = await import("./button-radio-DAA3rFLZ.js");
    if (selector) {
      return m.ButtonRadio.handle(selector, config);
    }
    return m;
  }
  tooltip(selector = '[data-bs-toggle="tooltip"]', config = {}) {
    return module(
      selector,
      "bs.tooltip",
      (ele) => Tooltip.getOrCreateInstance(ele, config)
    );
  }
  getMajorVersion(module2) {
    return Number(module2.VERSION.split(".").shift());
  }
}
export {
  UIBootstrap5
};
