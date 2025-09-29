import { A as AlertAdapter } from "../composable/useQueue.js";
import { d as data, r as removeData } from "../data.js";
import { a as animateTo } from "./animate.js";
import { a as selectAll, s as selectOne, m as module, c as html } from "./dom.js";
import { n as nextTick } from "./helper.js";
import { a as useImport, u as useCssImport } from "./loader.js";
import { u as useStack } from "../composable/useStack.js";
let ui;
AlertAdapter.alert = (title, text = "", type = "info") => {
  if (text) {
    title += " | " + text;
  }
  window.alert(title);
  return Promise.resolve();
};
AlertAdapter.confirm = (message) => {
  message = message || "Are you sure?";
  return new Promise((resolve) => {
    resolve(window.confirm(message));
  });
};
AlertAdapter.confirmText = () => "OK";
AlertAdapter.cancelText = () => "Cancel";
AlertAdapter.deleteText = () => "Delete";
function useUI(instance) {
  if (instance) {
    ui = instance;
  }
  return ui ??= new UnicornUI();
}
function useUITheme(theme) {
  const ui2 = useUI();
  if (ui2.theme && !theme) {
    return ui2.theme;
  }
  if (typeof theme === "function") {
    theme = new theme();
  }
  ui2.installTheme(theme);
  return ui2.theme;
}
class UnicornUI {
  theme;
  aliveHandle;
  static get defaultOptions() {
    return {
      messageSelector: ".message-wrap"
    };
  }
  installTheme(theme) {
    this.theme = theme;
  }
  // confirm(message: string): Promise<boolean> {
  //   message = message || 'Are you sure?';
  //
  //   return new Promise((resolve) => {
  //     resolve(window.confirm(message));
  //   });
  // }
  //
  // alert(title: string, text = '', type = 'info'): Promise<boolean> {
  //   if (text) {
  //     title += ' | ' + text;
  //   }
  //
  //   window.alert(title);
  //
  //   return Promise.resolve(true);
  // }
}
const prepares = [];
const { promise: alpineLoaded, resolve: alpineResolve } = /* @__PURE__ */ Promise.withResolvers();
async function loadAlpine(callback) {
  if (callback && !window.Alpine) {
    prepares.push(callback);
  }
  const { default: Alpine } = await useImport("@alpinejs");
  if (!window.Alpine) {
    await Promise.all(prepares.map((callback2) => Promise.resolve(callback2(Alpine))));
    Alpine.start();
    window.Alpine = Alpine;
    alpineResolve(Alpine);
  } else if (callback) {
    await callback(Alpine);
  }
  return Alpine;
}
async function initAlpineComponent(directive) {
  const Alpine = await alpineLoaded;
  await nextTick();
  selectAll(`[${directive}]`, (el) => {
    const code = el.getAttribute(directive) || "";
    el.removeAttribute(directive);
    Alpine.mutateDom(() => {
      el.setAttribute("x-data", code);
    });
    Alpine.initTree(el);
  });
}
async function prepareAlpine(callback) {
  if (window.Alpine) {
    await callback(window.Alpine);
  } else {
    prepares.push(callback);
  }
}
async function prepareAlpineDefer(callback) {
  await alpineLoaded;
  await callback(window.Alpine);
}
function renderMessage(messages, type = "info") {
  ui.theme.renderMessage(messages, type);
}
function clearMessages() {
  ui.theme.clearMessages();
}
function notify(messages, type = "info") {
  ui.theme.renderMessage(messages, type);
}
function clearNotifies() {
  ui.theme.clearMessages();
}
async function mark(selector, keyword = "", options = {}) {
  const modules = await useImport("@vendor/mark.js/dist/mark.min.js");
  if (selector != null) {
    const instance = new Mark(selector);
    instance.mark(keyword, options);
  }
  return modules;
}
async function slideUp(target, duration = 300) {
  const ele = selectOne(target);
  if (!ele) {
    return Promise.resolve();
  }
  ele.style.overflow = "hidden";
  const animation = animateTo(
    ele,
    { height: 0, paddingTop: 0, paddingBottom: 0 },
    { duration, easing: "ease-out" }
  );
  data(ele, "animation.sliding.up", true);
  const r = await animation.finished;
  if (!data(ele, "animation.sliding.down")) {
    ele.style.display = "none";
  }
  removeData(ele, "animation.sliding.up");
  return r;
}
function slideDown(target, duration = 300, display = "block") {
  const ele = selectOne(target);
  if (!ele) {
    return Promise.resolve();
  }
  data(ele, "animation.sliding.down", true);
  ele.style.display = display;
  let maxHeight = 0;
  for (const child of Array.from(ele.children)) {
    maxHeight = Math.max(child.offsetHeight, maxHeight);
  }
  const animation = animateTo(
    ele,
    {
      height: [
        0,
        maxHeight + "px"
      ]
    },
    { duration, easing: "ease-out" }
  );
  animation.addEventListener("finish", () => {
    ele.style.height = "";
    if (!data(ele, "animation.sliding.up")) {
      ele.style.overflow = "visible";
    }
    removeData(ele, "animation.sliding.down");
  });
  return animation.finished;
}
function slideToggle(target, duration = 500, display = "block") {
  const ele = selectOne(target);
  if (!ele) {
    return Promise.resolve();
  }
  if (window.getComputedStyle(ele).display === "none") {
    return slideDown(ele, duration, display);
  } else {
    return slideUp(ele, duration);
  }
}
async function fadeOut(selector, duration = 500) {
  const el = selectOne(selector);
  if (!el) {
    return;
  }
  const animation = animateTo(el, { opacity: 0 }, { duration, easing: "ease-out" });
  const p = await animation.finished;
  el.style.display = "none";
  return p;
}
async function fadeIn(selector, duration = 500, display = "block") {
  const el = selectOne(selector);
  if (!el) {
    return;
  }
  el.style.display = "";
  if (window.getComputedStyle(el).display !== display) {
    el.style.display = display;
  }
  const animation = animateTo(el, { opacity: 1 }, { duration, easing: "ease-out" });
  return animation.finished;
}
async function highlight(selector, color = "#ffff99", duration = 600) {
  const ele = selectOne(selector);
  if (!ele) {
    return;
  }
  duration /= 2;
  const bg = window.getComputedStyle(ele).backgroundColor;
  const animation = animateTo(ele, { backgroundColor: color }, { duration });
  await animation.finished;
  return animateTo(ele, { backgroundColor: bg }, { duration });
}
async function useColorPicker(selector, options = {}) {
  if (options?.theme === "dark") {
    useCssImport("@spectrum/spectrum-dark.min.css");
  } else if (!options?.theme) {
    useCssImport("@spectrum/spectrum.min.css");
  }
  const m = await useImport("@spectrum");
  if (typeof options.locale === "string") {
    let ls = options.locale.split("-").map((l) => l.toLowerCase());
    if (ls[0] === ls[1]) {
      ls = [ls];
    }
    ls = ls.join("-");
    try {
      await useImport(`@spectrum/i18n/${ls}.js`);
    } catch (e) {
      console.warn(`Unable to load Spectrum locale "${ls}" (${options.locale})`);
    }
  }
  if (selector) {
    module(selector, "spectrum", (ele) => Spectrum.getInstance(ele, options));
  }
  return m;
}
function useDisableOnSubmit(formSelector = "#admin-form", buttonSelector = "", options = {}) {
  buttonSelector = buttonSelector || [
    "#admin-toolbar button",
    "#admin-toolbar a",
    formSelector + " .disable-on-submit",
    formSelector + " .js-dos",
    formSelector + " [data-dos]"
  ].join(",");
  const iconSelector = options.iconSelector || [
    '[class*="fa-"]',
    "[data-spin]",
    "[data-spinner]"
  ].join(",");
  const event = options.event || "submit";
  const spinnerClass = options.spinnerClass || "spinner-border spinner-border-sm";
  selectAll(buttonSelector, (button) => {
    button.addEventListener("click", (e) => {
      button.dataset.clicked = "1";
      setTimeout(() => {
        delete button.dataset.clicked;
      }, 1500);
    });
  });
  const form = selectOne(formSelector);
  form?.addEventListener(event, (e) => {
    setTimeout(() => {
      if (!form.checkValidity()) {
        return;
      }
      selectAll(buttonSelector, (button) => {
        button.style.pointerEvents = "none";
        button.setAttribute("disabled", "disabled");
        button.classList.add("disabled");
        if (button.dataset.clicked) {
          let icon = button.querySelector(iconSelector);
          if (icon) {
            const i = html("<i></i>");
            icon.parentNode.replaceChild(i, icon);
            i.setAttribute("class", spinnerClass);
          }
        }
      });
    }, 0);
  });
}
function useDisableIfStackNotEmpty(buttonSelector = "[data-task=save]", stackName = "uploading") {
  const stack = useStack(stackName);
  stack.observe((stack2, length) => {
    for (const button of selectAll(buttonSelector)) {
      if (length > 0) {
        button.setAttribute("disabled", "disabled");
        button.classList.add("disabled");
      } else {
        button.removeAttribute("disabled");
        button.classList.remove("disabled");
      }
    }
  });
}
function useKeepAlive(url, time = 6e4) {
  const aliveHandle = window.setInterval(() => fetch(url), time);
  return () => {
    clearInterval(aliveHandle);
  };
}
async function useVueComponentField(selector, value, options = {}) {
  const m = await useImport("@unicorn/field/vue-component-field.js");
  if (selector) {
    m.VueComponentField.init(selector, value, options);
  }
  return m;
}
export {
  UnicornUI as U,
  clearNotifies as a,
  slideDown as b,
  clearMessages as c,
  slideToggle as d,
  fadeIn as e,
  fadeOut as f,
  useColorPicker as g,
  highlight as h,
  initAlpineComponent as i,
  useDisableOnSubmit as j,
  useDisableIfStackNotEmpty as k,
  loadAlpine as l,
  mark as m,
  notify as n,
  useKeepAlive as o,
  prepareAlpine as p,
  prepareAlpineDefer as q,
  renderMessage as r,
  slideUp as s,
  useUI as t,
  useUITheme as u,
  useVueComponentField as v
};
