import * as bootstrap from "bootstrap";
import { Tooltip } from "bootstrap";
import { h as html, a as selectOne, s as selectAll } from "./unicorn-x6CrrtPV.js";
class UIBootstrap5 {
  static instance = null;
  bootstrap = bootstrap;
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
    const module = await import("./keep-tab-Db4mHHjz.js");
    await module.ready;
    if (selector) {
      return new module.KeepTab(selector, options);
    }
    return module;
  }
  async buttonRadio(selector, options = {}) {
    const m = await import("./button-radio-Blun_-eL.js");
    await m.ready;
    if (selector) {
      return m.ButtonRadio.handle(selector, options);
    }
    return m;
  }
  tooltip(selector = '[data-bs-toggle="tooltip"]', config = {}) {
    return this.selectAsArray(selector).map((ele) => Tooltip.getOrCreateInstance(ele, config));
  }
  selectAsArray(selector) {
    if (selector instanceof NodeList) {
      return Array.from(selector);
    } else if (typeof selector === "string") {
      return selectAll(selector);
    } else {
      return [selector];
    }
  }
  getMajorVersion(module) {
    return Number(module.VERSION.split(".").shift());
  }
  pushBootstrapToGlobal() {
    window.bootstrap = bootstrap;
  }
}
export {
  UIBootstrap5
};
