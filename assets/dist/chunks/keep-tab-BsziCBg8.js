import { i as o, C as n, p as l } from "./unicorn-Dap6NpVD.js";
import { Tab as h } from "bootstrap";
const r = "[data-toggle=tab],[data-bs-toggle=tab],[data-toggle=pill],[data-bs-toggle=pill]";
class d {
  $element;
  tabButtons;
  storageKey = "";
  options;
  /**
   * Class init.
   *
   * @param {HTMLElement|string} selector
   * @param {Object}      options
   *
   * @constructor
   */
  constructor(t, e = {}) {
    let a = t;
    typeof t == "object" && (a = e.uid || t.id);
    const s = this.$element = o(t);
    if (!s) {
      console.warn(`[KeepTab] Element ${t} not found.`);
      return;
    }
    this.$element = s, this.tabButtons = s.querySelectorAll(r), this.options = e, this.init(a);
  }
  async init(t) {
    this.storageKey = "tab-href-" + await this.hashCode(location.href + ":" + t), this.bindEvents(), await n(this.options.delay || 0), this.switchTab();
  }
  bindEvents() {
    [].forEach.call(this.tabButtons, (t) => {
      t.addEventListener("click", () => {
        window.localStorage.setItem(this.storageKey, this.getButtonHref(t));
      });
    });
  }
  getButtonHref(t) {
    return t.dataset.bsTarget || t.dataset.target || t.href;
  }
  findTabButtonByHref(t) {
    return l(this.$element.querySelectorAll(r)).filter((e) => e.href === t || e.dataset.bsTarget === t ? !0 : e.dataset.target === t).shift();
  }
  activateTab(t) {
    const e = this.findTabButtonByHref(t);
    e && h.getOrCreateInstance(e).show();
  }
  hasTab(t) {
    return this.findTabButtonByHref(t) != null;
  }
  /**
   * Switch tab.
   *
   * @returns {boolean}
   */
  switchTab() {
    if (localStorage.getItem(this.storageKey)) {
      if (!this.hasTab(localStorage.getItem(this.storageKey) || ""))
        return localStorage.removeItem(this.storageKey), !0;
      const t = localStorage.getItem(this.storageKey) || "";
      this.activateTab(t);
    }
  }
  /**
   * Hash code.
   */
  async hashCode(t) {
    const e = new TextEncoder().encode(t), a = await globalThis.crypto.subtle.digest("SHA-256", e);
    return Array.from(new Uint8Array(a)).map((i) => i.toString(16).padStart(2, "0")).join("");
  }
}
export {
  d as LoadTab
};
