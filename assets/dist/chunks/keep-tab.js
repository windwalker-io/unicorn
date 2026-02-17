import { Tab } from "bootstrap";
import { a as useUniDirective, z as module$1, a6 as mergeDeep, v as selectOne, al as sleep, w as selectAll } from "./unicorn.js";
const defaultOptions = {
  tabItemSelector: "[data-toggle=tab],[data-bs-toggle=tab],[data-toggle=pill],[data-bs-toggle=pill]",
  delay: 0
};
class KeepTab {
  $element;
  tabButtons;
  storageKey = "";
  options;
  constructor(selector, options = {}) {
    options = mergeDeep({}, defaultOptions, options);
    let uid;
    if (typeof selector === "object") {
      uid = options.uid || selector.id;
    } else {
      uid = selector;
    }
    const $element = this.$element = selectOne(selector);
    if (!$element) {
      console.warn(`[KeepTab] Element ${selector} not found.`);
      return;
    }
    this.options = options;
    this.$element = $element;
    this.tabButtons = $element.querySelectorAll(this.options.tabItemSelector);
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
    return selectAll(this.options.tabItemSelector).filter((button) => {
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
      if (tabTrigger?.getAttribute("disabled") != null || tabTrigger.classList.contains("disabled")) {
        return;
      }
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
const ready = /* @__PURE__ */ useUniDirective("keeptab", {
  mounted(el, { value }) {
    const options = JSON.parse(value || "{}");
    module$1(el, "uni.keeptab", () => new KeepTab(el, options));
  }
});
export {
  KeepTab,
  ready
};
//# sourceMappingURL=keep-tab.js.map
