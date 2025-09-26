import { Tooltip } from "bootstrap";
import { k as html, i as selectOne, o as module } from "./unicorn-BZTc9FFG.js";
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
  async keepTab(selector, options = {}) {
    const module2 = await import("./keep-tab-DR0ECIQb.js");
    await module2.ready;
    if (selector) {
      return new module2.KeepTab(selector, options);
    }
    return module2;
  }
  async buttonRadio(selector, config = {}) {
    const m = await import("./button-radio-a4c57Wdh.js");
    await m.ready;
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
