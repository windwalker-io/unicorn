import { i as selectOne, C as sleep, p as selectAll } from "./unicorn-Bnc3cU-N.js";
import { Tab } from "bootstrap";
const TAB_ITEM_SELECTOR = "[data-toggle=tab],[data-bs-toggle=tab],[data-toggle=pill],[data-bs-toggle=pill]";
class LoadTab {
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
  constructor(selector, options = {}) {
    let uid = selector;
    if (typeof selector === "object") {
      uid = options.uid || selector.id;
    }
    const $element = this.$element = selectOne(selector);
    if (!$element) {
      console.warn(`[KeepTab] Element ${selector} not found.`);
      return;
    }
    this.$element = $element;
    this.tabButtons = $element.querySelectorAll(TAB_ITEM_SELECTOR);
    this.options = options;
    this.init(uid);
  }
  async init(uid) {
    this.storageKey = "tab-href-" + await this.hashCode(location.href + ":" + uid);
    this.bindEvents();
    await sleep(this.options.delay || 0);
    this.switchTab();
  }
  bindEvents() {
    [].forEach.call(this.tabButtons, (button) => {
      button.addEventListener("click", () => {
        window.localStorage.setItem(this.storageKey, this.getButtonHref(button));
      });
    });
  }
  getButtonHref(button) {
    return button.dataset.bsTarget || button.dataset.target || button.href;
  }
  findTabButtonByHref(href) {
    return selectAll(this.$element.querySelectorAll(TAB_ITEM_SELECTOR)).filter((button) => {
      if (button.href === href) {
        return true;
      }
      if (button.dataset.bsTarget === href) {
        return true;
      }
      return button.dataset.target === href;
    }).shift();
  }
  activateTab(href) {
    const tabTrigger = this.findTabButtonByHref(href);
    if (tabTrigger) {
      Tab.getOrCreateInstance(tabTrigger).show();
    }
  }
  hasTab(href) {
    return this.findTabButtonByHref(href) != null;
  }
  /**
   * Switch tab.
   *
   * @returns {boolean}
   */
  switchTab() {
    if (localStorage.getItem(this.storageKey)) {
      if (!this.hasTab(localStorage.getItem(this.storageKey) || "")) {
        localStorage.removeItem(this.storageKey);
        return true;
      }
      const tabhref = localStorage.getItem(this.storageKey) || "";
      this.activateTab(tabhref);
    }
  }
  /**
   * Hash code.
   */
  async hashCode(text) {
    const msgBuffer = new TextEncoder().encode(text);
    const hashBuffer = await globalThis.crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
}
export {
  LoadTab
};
