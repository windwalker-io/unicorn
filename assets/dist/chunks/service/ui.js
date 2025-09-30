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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidWkuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zZXJ2aWNlL3VpLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFsZXJ0QWRhcHRlciwgZGVsZXRlQ29uZmlybSwgc2ltcGxlQWxlcnQsIHNpbXBsZUNvbmZpcm0gfSBmcm9tICdAbHlyYXNvZnQvdHMtdG9vbGtpdC9nZW5lcmljJztcclxuaW1wb3J0IHR5cGUgeyBBbHBpbmUgYXMgQWxwaW5lR2xvYmFsIH0gZnJvbSAnYWxwaW5lanMnO1xyXG5pbXBvcnQgdHlwZSB7IGRlZmF1bHQgYXMgU3BlY3RydW1HbG9iYWwgfSBmcm9tICdzcGVjdHJ1bS12YW5pbGxhJztcclxuaW1wb3J0IHR5cGUgeyBTcGVjdHJ1bU9wdGlvbnMgfSBmcm9tICdzcGVjdHJ1bS12YW5pbGxhL2Rpc3QvdHlwZXMvdHlwZXMnO1xyXG5pbXBvcnQgdHlwZSB7IGRlZmF1bHQgYXMgVG9tU2VsZWN0R2xvYmFsIH0gZnJvbSAndG9tLXNlbGVjdCc7XHJcbmltcG9ydCB7IHVzZVN0YWNrIH0gZnJvbSAnLi4vY29tcG9zYWJsZSc7XHJcbmltcG9ydCB7IGRhdGEsIHJlbW92ZURhdGEgfSBmcm9tICcuLi9kYXRhJztcclxuaW1wb3J0IHR5cGUgeyBDb25zdHJ1Y3RvciwgTWF5YmVQcm9taXNlLCBOdWxsYWJsZSwgVUlUaGVtZUludGVyZmFjZSB9IGZyb20gJy4uL3R5cGVzJztcclxuaW1wb3J0IHsgYW5pbWF0ZVRvIH0gZnJvbSAnLi9hbmltYXRlJztcclxuaW1wb3J0IHsgaHRtbCwgbW9kdWxlLCBzZWxlY3RBbGwsIHNlbGVjdE9uZSB9IGZyb20gJy4vZG9tJztcclxuaW1wb3J0IHsgbmV4dFRpY2sgfSBmcm9tICcuL2hlbHBlcic7XHJcbmltcG9ydCB7IHVzZUNzc0ltcG9ydCwgdXNlSW1wb3J0IH0gZnJvbSAnLi9sb2FkZXInO1xyXG5cclxubGV0IHVpOiBVbmljb3JuVUk7XHJcblxyXG5BbGVydEFkYXB0ZXIuYWxlcnQgPSAodGl0bGU6IHN0cmluZywgdGV4dCA9ICcnLCB0eXBlID0gJ2luZm8nKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgaWYgKHRleHQpIHtcclxuICAgIHRpdGxlICs9ICcgfCAnICsgdGV4dDtcclxuICB9XHJcblxyXG4gIHdpbmRvdy5hbGVydCh0aXRsZSk7XHJcblxyXG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxufTtcclxuXHJcbkFsZXJ0QWRhcHRlci5jb25maXJtID0gKG1lc3NhZ2U6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4gPT4ge1xyXG4gIG1lc3NhZ2UgPSBtZXNzYWdlIHx8ICdBcmUgeW91IHN1cmU/JztcclxuXHJcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICByZXNvbHZlKHdpbmRvdy5jb25maXJtKG1lc3NhZ2UpKTtcclxuICB9KTtcclxufTtcclxuXHJcbkFsZXJ0QWRhcHRlci5jb25maXJtVGV4dCA9ICgpID0+ICdPSyc7XHJcbkFsZXJ0QWRhcHRlci5jYW5jZWxUZXh0ID0gKCkgPT4gJ0NhbmNlbCc7XHJcbkFsZXJ0QWRhcHRlci5kZWxldGVUZXh0ID0gKCkgPT4gJ0RlbGV0ZSc7XHJcblxyXG5leHBvcnQgeyBzaW1wbGVBbGVydCwgc2ltcGxlQ29uZmlybSwgZGVsZXRlQ29uZmlybSwgQWxlcnRBZGFwdGVyIH07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlVUkoaW5zdGFuY2U/OiBVbmljb3JuVUkpOiBVbmljb3JuVUkge1xyXG4gIGlmIChpbnN0YW5jZSkge1xyXG4gICAgdWkgPSBpbnN0YW5jZTtcclxuICB9XHJcblxyXG4gIHJldHVybiB1aSA/Pz0gbmV3IFVuaWNvcm5VSSgpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlVUlUaGVtZTxUIGV4dGVuZHMgVUlUaGVtZUludGVyZmFjZT4odGhlbWU/OiBUIHwgQ29uc3RydWN0b3I8VD4pOiBUIHtcclxuICBjb25zdCB1aSA9IHVzZVVJKCk7XHJcblxyXG4gIGlmICh1aS50aGVtZSAmJiAhdGhlbWUpIHtcclxuICAgIHJldHVybiB1aS50aGVtZTtcclxuICB9XHJcblxyXG4gIGlmICh0eXBlb2YgdGhlbWUgPT09ICdmdW5jdGlvbicpIHtcclxuICAgIHRoZW1lID0gbmV3IHRoZW1lKCk7XHJcbiAgfVxyXG5cclxuICB1aS5pbnN0YWxsVGhlbWUodGhlbWUpO1xyXG5cclxuICByZXR1cm4gdWkudGhlbWU7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBVbmljb3JuVUkge1xyXG4gIHRoZW1lPzogYW55O1xyXG4gIGFsaXZlSGFuZGxlPzogYW55O1xyXG5cclxuICBzdGF0aWMgZ2V0IGRlZmF1bHRPcHRpb25zKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbWVzc2FnZVNlbGVjdG9yOiAnLm1lc3NhZ2Utd3JhcCcsXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgaW5zdGFsbFRoZW1lKHRoZW1lOiBhbnkpIHtcclxuICAgIHRoaXMudGhlbWUgPSB0aGVtZTtcclxuICB9XHJcblxyXG4gIC8vIGNvbmZpcm0obWVzc2FnZTogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgLy8gICBtZXNzYWdlID0gbWVzc2FnZSB8fCAnQXJlIHlvdSBzdXJlPyc7XHJcbiAgLy9cclxuICAvLyAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gIC8vICAgICByZXNvbHZlKHdpbmRvdy5jb25maXJtKG1lc3NhZ2UpKTtcclxuICAvLyAgIH0pO1xyXG4gIC8vIH1cclxuICAvL1xyXG4gIC8vIGFsZXJ0KHRpdGxlOiBzdHJpbmcsIHRleHQgPSAnJywgdHlwZSA9ICdpbmZvJyk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gIC8vICAgaWYgKHRleHQpIHtcclxuICAvLyAgICAgdGl0bGUgKz0gJyB8ICcgKyB0ZXh0O1xyXG4gIC8vICAgfVxyXG4gIC8vXHJcbiAgLy8gICB3aW5kb3cuYWxlcnQodGl0bGUpO1xyXG4gIC8vXHJcbiAgLy8gICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xyXG4gIC8vIH1cclxufVxyXG5cclxuY29uc3QgcHJlcGFyZXM6IEFscGluZVByZXBhcmVDYWxsYmFja1tdID0gW107XHJcbnR5cGUgQWxwaW5lUHJlcGFyZUNhbGxiYWNrID0gKEFscGluZTogQWxwaW5lR2xvYmFsKSA9PiBNYXliZVByb21pc2U8YW55PjtcclxuY29uc3QgeyBwcm9taXNlOiBhbHBpbmVMb2FkZWQsIHJlc29sdmU6IGFscGluZVJlc29sdmUgfSA9IFByb21pc2Uud2l0aFJlc29sdmVyczxBbHBpbmVHbG9iYWw+KCk7XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9hZEFscGluZShjYWxsYmFjaz86IE51bGxhYmxlPEFscGluZVByZXBhcmVDYWxsYmFjaz4pOiBQcm9taXNlPEFscGluZUdsb2JhbD4ge1xyXG4gIGlmIChjYWxsYmFjayAmJiAhd2luZG93LkFscGluZSkge1xyXG4gICAgcHJlcGFyZXMucHVzaChjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxuICBjb25zdCB7IGRlZmF1bHQ6IEFscGluZSB9OiB7IGRlZmF1bHQ6IEFscGluZUdsb2JhbCB9ID0gYXdhaXQgdXNlSW1wb3J0KCdAYWxwaW5lanMnKTtcclxuXHJcbiAgaWYgKCF3aW5kb3cuQWxwaW5lKSB7XHJcbiAgICBhd2FpdCBQcm9taXNlLmFsbChwcmVwYXJlcy5tYXAoKGNhbGxiYWNrKSA9PiBQcm9taXNlLnJlc29sdmUoY2FsbGJhY2soQWxwaW5lKSkpKTtcclxuXHJcbiAgICBBbHBpbmUuc3RhcnQoKTtcclxuXHJcbiAgICB3aW5kb3cuQWxwaW5lID0gQWxwaW5lO1xyXG5cclxuICAgIGFscGluZVJlc29sdmUoQWxwaW5lKTtcclxuICB9IGVsc2UgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICBhd2FpdCBjYWxsYmFjayhBbHBpbmUpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIEFscGluZTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGluaXRBbHBpbmVDb21wb25lbnQoZGlyZWN0aXZlOiBzdHJpbmcpIHtcclxuICBjb25zdCBBbHBpbmUgPSBhd2FpdCBhbHBpbmVMb2FkZWQ7XHJcblxyXG4gIGF3YWl0IG5leHRUaWNrKCk7XHJcblxyXG4gIHNlbGVjdEFsbDxIVE1MRWxlbWVudD4oYFske2RpcmVjdGl2ZX1dYCwgKGVsKSA9PiB7XHJcbiAgICBjb25zdCBjb2RlID0gZWwuZ2V0QXR0cmlidXRlKGRpcmVjdGl2ZSkgfHwgJyc7XHJcbiAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoZGlyZWN0aXZlKTtcclxuXHJcbiAgICAvLyBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbHBpbmVqcy9hbHBpbmUvaXNzdWVzLzM1OSNpc3N1ZWNvbW1lbnQtOTczNjg4NDY0XHJcbiAgICBBbHBpbmUubXV0YXRlRG9tKCgpID0+IHtcclxuICAgICAgZWwuc2V0QXR0cmlidXRlKCd4LWRhdGEnLCBjb2RlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIEFscGluZS5pbml0VHJlZShlbCk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBCZWZvcmUgQWxwaW5lIGluaXRcclxuICovXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwcmVwYXJlQWxwaW5lKGNhbGxiYWNrOiBBbHBpbmVQcmVwYXJlQ2FsbGJhY2spIHtcclxuICBpZiAod2luZG93LkFscGluZSkge1xyXG4gICAgYXdhaXQgY2FsbGJhY2sod2luZG93LkFscGluZSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHByZXBhcmVzLnB1c2goY2FsbGJhY2spO1xyXG4gIH1cclxufVxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcHJlcGFyZUFscGluZURlZmVyKGNhbGxiYWNrOiBBbHBpbmVQcmVwYXJlQ2FsbGJhY2spIHtcclxuICBjb25zdCBBbHBpbmUgPSBhd2FpdCBhbHBpbmVMb2FkZWQ7XHJcblxyXG4gIGF3YWl0IGNhbGxiYWNrKHdpbmRvdy5BbHBpbmUpO1xyXG59XHJcblxyXG4vKipcclxuICogUmVuZGVyIE1lc3NhZ2VzLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlck1lc3NhZ2UobWVzc2FnZXM6IHN0cmluZyB8IHN0cmluZ1tdLCB0eXBlOiBzdHJpbmcgPSAnaW5mbycpIHtcclxuICB1aS50aGVtZS5yZW5kZXJNZXNzYWdlKG1lc3NhZ2VzLCB0eXBlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENsZWFyIG1lc3NhZ2VzLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyTWVzc2FnZXMoKSB7XHJcbiAgdWkudGhlbWUuY2xlYXJNZXNzYWdlcygpO1xyXG59XHJcblxyXG4vKipcclxuICogU2hvdyBub3RpZnkuXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gbm90aWZ5KG1lc3NhZ2VzOiBzdHJpbmcgfCBzdHJpbmdbXSwgdHlwZTogc3RyaW5nID0gJ2luZm8nKSB7XHJcbiAgdWkudGhlbWUucmVuZGVyTWVzc2FnZShtZXNzYWdlcywgdHlwZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDbGVhciBub3RpZmllcy5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBjbGVhck5vdGlmaWVzKCkge1xyXG4gIHVpLnRoZW1lLmNsZWFyTWVzc2FnZXMoKTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1hcmsoc2VsZWN0b3I/OiBzdHJpbmcgfCBIVE1MRWxlbWVudCwga2V5d29yZDogc3RyaW5nID0gJycsIG9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fSkge1xyXG4gIGNvbnN0IG1vZHVsZXMgPSBhd2FpdCB1c2VJbXBvcnQoJ0B2ZW5kb3IvbWFyay5qcy9kaXN0L21hcmsubWluLmpzJyk7XHJcblxyXG4gIGlmIChzZWxlY3RvciAhPSBudWxsKSB7XHJcbiAgICBjb25zdCBpbnN0YW5jZSA9IG5ldyBNYXJrKHNlbGVjdG9yKTtcclxuICAgIGluc3RhbmNlLm1hcmsoa2V5d29yZCwgb3B0aW9ucyk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbW9kdWxlcztcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNsaWRlVXAodGFyZ2V0OiBzdHJpbmcgfCBIVE1MRWxlbWVudCwgZHVyYXRpb246IG51bWJlciA9IDMwMCk6IFByb21pc2U8QW5pbWF0aW9uIHwgdm9pZD4ge1xyXG4gIGNvbnN0IGVsZSA9IHNlbGVjdE9uZSh0YXJnZXQpO1xyXG5cclxuICBpZiAoIWVsZSkge1xyXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gIH1cclxuXHJcbiAgZWxlLnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XHJcblxyXG4gIGNvbnN0IGFuaW1hdGlvbiA9IGFuaW1hdGVUbyhcclxuICAgIGVsZSxcclxuICAgIHsgaGVpZ2h0OiAwLCBwYWRkaW5nVG9wOiAwLCBwYWRkaW5nQm90dG9tOiAwIH0sXHJcbiAgICB7IGR1cmF0aW9uLCBlYXNpbmc6ICdlYXNlLW91dCcgfVxyXG4gICk7XHJcblxyXG4gIGRhdGEoZWxlLCAnYW5pbWF0aW9uLnNsaWRpbmcudXAnLCB0cnVlKTtcclxuXHJcbiAgY29uc3QgciA9IGF3YWl0IGFuaW1hdGlvbi5maW5pc2hlZDtcclxuXHJcbiAgaWYgKCFkYXRhKGVsZSwgJ2FuaW1hdGlvbi5zbGlkaW5nLmRvd24nKSkge1xyXG4gICAgZWxlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgfVxyXG5cclxuICByZW1vdmVEYXRhKGVsZSwgJ2FuaW1hdGlvbi5zbGlkaW5nLnVwJyk7XHJcblxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2xpZGVEb3duKFxyXG4gIHRhcmdldDogc3RyaW5nIHwgSFRNTEVsZW1lbnQsXHJcbiAgZHVyYXRpb246IG51bWJlciA9IDMwMCxcclxuICBkaXNwbGF5OiBzdHJpbmcgPSAnYmxvY2snKTogUHJvbWlzZTxBbmltYXRpb24gfCB2b2lkPiB7XHJcbiAgY29uc3QgZWxlID0gc2VsZWN0T25lKHRhcmdldCk7XHJcblxyXG4gIGlmICghZWxlKSB7XHJcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgfVxyXG5cclxuICBkYXRhKGVsZSwgJ2FuaW1hdGlvbi5zbGlkaW5nLmRvd24nLCB0cnVlKTtcclxuXHJcbiAgZWxlLnN0eWxlLmRpc3BsYXkgPSBkaXNwbGF5O1xyXG5cclxuLy8gR2V0IGhlaWdodFxyXG4gIGxldCBtYXhIZWlnaHQgPSAwO1xyXG4gIGZvciAoY29uc3QgY2hpbGQgb2YgQXJyYXkuZnJvbShlbGUuY2hpbGRyZW4pIGFzIEhUTUxFbGVtZW50W10pIHtcclxuICAgIG1heEhlaWdodCA9IE1hdGgubWF4KGNoaWxkLm9mZnNldEhlaWdodCwgbWF4SGVpZ2h0KTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGFuaW1hdGlvbiA9IGFuaW1hdGVUbyhcclxuICAgIGVsZSxcclxuICAgIHtcclxuICAgICAgaGVpZ2h0OiBbXHJcbiAgICAgICAgMCxcclxuICAgICAgICBtYXhIZWlnaHQgKyAncHgnXHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICB7IGR1cmF0aW9uLCBlYXNpbmc6ICdlYXNlLW91dCcgfVxyXG4gICk7XHJcblxyXG4gIGFuaW1hdGlvbi5hZGRFdmVudExpc3RlbmVyKCdmaW5pc2gnLCAoKSA9PiB7XHJcbiAgICBlbGUuc3R5bGUuaGVpZ2h0ID0gJyc7XHJcblxyXG4gICAgaWYgKCFkYXRhKGVsZSwgJ2FuaW1hdGlvbi5zbGlkaW5nLnVwJykpIHtcclxuICAgICAgZWxlLnN0eWxlLm92ZXJmbG93ID0gJ3Zpc2libGUnO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZURhdGEoZWxlLCAnYW5pbWF0aW9uLnNsaWRpbmcuZG93bicpO1xyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gYW5pbWF0aW9uLmZpbmlzaGVkO1xyXG59XHJcblxyXG4vKipcclxuICogc2xpZGVUb2dnbGVcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBzbGlkZVRvZ2dsZShcclxuICB0YXJnZXQ6IHN0cmluZyB8IEhUTUxFbGVtZW50LFxyXG4gIGR1cmF0aW9uOiBudW1iZXIgPSA1MDAsXHJcbiAgZGlzcGxheTogc3RyaW5nID0gJ2Jsb2NrJyk6IFByb21pc2U8QW5pbWF0aW9uIHwgdm9pZD4ge1xyXG4gIGNvbnN0IGVsZSA9IHNlbGVjdE9uZSh0YXJnZXQpO1xyXG5cclxuICBpZiAoIWVsZSkge1xyXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gIH1cclxuXHJcbiAgaWYgKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZSkuZGlzcGxheSA9PT0gJ25vbmUnKSB7XHJcbiAgICByZXR1cm4gc2xpZGVEb3duKGVsZSwgZHVyYXRpb24sIGRpc3BsYXkpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gc2xpZGVVcChlbGUsIGR1cmF0aW9uKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmYWRlT3V0KHNlbGVjdG9yOiBzdHJpbmcgfCBIVE1MRWxlbWVudCwgZHVyYXRpb246IG51bWJlciA9IDUwMCk6IFByb21pc2U8QW5pbWF0aW9uIHwgdm9pZD4ge1xyXG4gIGNvbnN0IGVsID0gc2VsZWN0T25lKHNlbGVjdG9yKTtcclxuXHJcbiAgaWYgKCFlbCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgYW5pbWF0aW9uID0gYW5pbWF0ZVRvKGVsLCB7IG9wYWNpdHk6IDAgfSwgeyBkdXJhdGlvbiwgZWFzaW5nOiAnZWFzZS1vdXQnIH0pO1xyXG5cclxuICBjb25zdCBwID0gYXdhaXQgYW5pbWF0aW9uLmZpbmlzaGVkO1xyXG4gIGVsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcblxyXG4gIHJldHVybiBwO1xyXG59O1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZhZGVJbihcclxuICBzZWxlY3Rvcjogc3RyaW5nIHwgSFRNTEVsZW1lbnQsXHJcbiAgZHVyYXRpb246IG51bWJlciA9IDUwMCxcclxuICBkaXNwbGF5OiBzdHJpbmcgPSAnYmxvY2snXHJcbik6IFByb21pc2U8QW5pbWF0aW9uIHwgdm9pZD4ge1xyXG4gIGNvbnN0IGVsID0gc2VsZWN0T25lKHNlbGVjdG9yKTtcclxuXHJcbiAgaWYgKCFlbCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgZWwuc3R5bGUuZGlzcGxheSA9ICcnO1xyXG5cclxuICBpZiAod2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpLmRpc3BsYXkgIT09IGRpc3BsYXkpIHtcclxuICAgIGVsLnN0eWxlLmRpc3BsYXkgPSBkaXNwbGF5O1xyXG4gIH1cclxuXHJcbiAgY29uc3QgYW5pbWF0aW9uID0gYW5pbWF0ZVRvKGVsLCB7IG9wYWNpdHk6IDEgfSwgeyBkdXJhdGlvbiwgZWFzaW5nOiAnZWFzZS1vdXQnIH0pO1xyXG5cclxuICByZXR1cm4gYW5pbWF0aW9uLmZpbmlzaGVkO1xyXG59O1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhpZ2hsaWdodChcclxuICBzZWxlY3Rvcjogc3RyaW5nIHwgSFRNTEVsZW1lbnQsXHJcbiAgY29sb3I6IHN0cmluZyA9ICcjZmZmZjk5JyxcclxuICBkdXJhdGlvbjogbnVtYmVyID0gNjAwXHJcbik6IFByb21pc2U8QW5pbWF0aW9uIHwgdm9pZD4ge1xyXG4gIGNvbnN0IGVsZSA9IHNlbGVjdE9uZShzZWxlY3Rvcik7XHJcblxyXG4gIGlmICghZWxlKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICBkdXJhdGlvbiAvPSAyO1xyXG4gIGNvbnN0IGJnID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlKS5iYWNrZ3JvdW5kQ29sb3I7XHJcblxyXG4gIGNvbnN0IGFuaW1hdGlvbiA9IGFuaW1hdGVUbyhlbGUsIHsgYmFja2dyb3VuZENvbG9yOiBjb2xvciB9LCB7IGR1cmF0aW9uIH0pO1xyXG5cclxuICBhd2FpdCBhbmltYXRpb24uZmluaXNoZWQ7XHJcblxyXG4gIHJldHVybiBhbmltYXRlVG8oZWxlLCB7IGJhY2tncm91bmRDb2xvcjogYmcgfSwgeyBkdXJhdGlvbiB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENvbG9yIFBpY2tlci5cclxuICovXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VDb2xvclBpY2tlcihcclxuICBzZWxlY3Rvcj86IE51bGxhYmxlPHN0cmluZyB8IEhUTUxFbGVtZW50IHwgTm9kZUxpc3RPZjxIVE1MRWxlbWVudD4+LFxyXG4gIG9wdGlvbnM6IFBhcnRpYWw8U3BlY3RydW1PcHRpb25zPiA9IHt9XHJcbik6IFByb21pc2U8YW55PiB7XHJcbiAgaWYgKG9wdGlvbnM/LnRoZW1lID09PSAnZGFyaycpIHtcclxuICAgIHVzZUNzc0ltcG9ydCgnQHNwZWN0cnVtL3NwZWN0cnVtLWRhcmsubWluLmNzcycpO1xyXG4gIH0gZWxzZSBpZiAoIW9wdGlvbnM/LnRoZW1lKSB7XHJcbiAgICB1c2VDc3NJbXBvcnQoJ0BzcGVjdHJ1bS9zcGVjdHJ1bS5taW4uY3NzJyk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBtID0gYXdhaXQgdXNlSW1wb3J0KCdAc3BlY3RydW0nKTtcclxuXHJcbi8vIExvY2FsZVxyXG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5sb2NhbGUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICBsZXQgbHM6IGFueSA9IG9wdGlvbnMubG9jYWxlLnNwbGl0KCctJykubWFwKChsKSA9PiBsLnRvTG93ZXJDYXNlKCkpO1xyXG5cclxuICAgIGlmIChsc1swXSA9PT0gbHNbMV0pIHtcclxuICAgICAgbHMgPSBbbHNdO1xyXG4gICAgfVxyXG5cclxuICAgIGxzID0gbHMuam9pbignLScpO1xyXG4gICAgdHJ5IHtcclxuICAgICAgYXdhaXQgdXNlSW1wb3J0KGBAc3BlY3RydW0vaTE4bi8ke2xzfS5qc2ApO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBjb25zb2xlLndhcm4oYFVuYWJsZSB0byBsb2FkIFNwZWN0cnVtIGxvY2FsZSBcIiR7bHN9XCIgKCR7b3B0aW9ucy5sb2NhbGV9KWApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaWYgKHNlbGVjdG9yKSB7XHJcbiAgICBtb2R1bGU8YW55LCBIVE1MRWxlbWVudD4oc2VsZWN0b3IsICdzcGVjdHJ1bScsIChlbGUpID0+IFNwZWN0cnVtLmdldEluc3RhbmNlKGVsZSwgb3B0aW9ucykpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VEaXNhYmxlT25TdWJtaXQoXHJcbiAgZm9ybVNlbGVjdG9yOiBzdHJpbmcgfCBIVE1MRm9ybUVsZW1lbnQgPSAnI2FkbWluLWZvcm0nLFxyXG4gIGJ1dHRvblNlbGVjdG9yOiBzdHJpbmcgPSAnJyxcclxuICBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge31cclxuKSB7XHJcbiAgLy8gVG9kbzogVXNlIG9iamVjdCB0byBoYW5kbGUgaXRcclxuICBidXR0b25TZWxlY3RvciA9IGJ1dHRvblNlbGVjdG9yIHx8IFtcclxuICAgICcjYWRtaW4tdG9vbGJhciBidXR0b24nLFxyXG4gICAgJyNhZG1pbi10b29sYmFyIGEnLFxyXG4gICAgZm9ybVNlbGVjdG9yICsgJyAuZGlzYWJsZS1vbi1zdWJtaXQnLFxyXG4gICAgZm9ybVNlbGVjdG9yICsgJyAuanMtZG9zJyxcclxuICAgIGZvcm1TZWxlY3RvciArICcgW2RhdGEtZG9zXScsXHJcbiAgXS5qb2luKCcsJyk7XHJcblxyXG4gIGNvbnN0IGljb25TZWxlY3RvciA9IG9wdGlvbnMuaWNvblNlbGVjdG9yIHx8IFtcclxuICAgICdbY2xhc3MqPVwiZmEtXCJdJyxcclxuICAgICdbZGF0YS1zcGluXScsXHJcbiAgICAnW2RhdGEtc3Bpbm5lcl0nLFxyXG4gIF0uam9pbignLCcpO1xyXG5cclxuICBjb25zdCBldmVudCA9IG9wdGlvbnMuZXZlbnQgfHwgJ3N1Ym1pdCc7XHJcbiAgY29uc3Qgc3Bpbm5lckNsYXNzID0gb3B0aW9ucy5zcGlubmVyQ2xhc3MgfHwgJ3NwaW5uZXItYm9yZGVyIHNwaW5uZXItYm9yZGVyLXNtJztcclxuXHJcbiAgc2VsZWN0QWxsPEhUTUxFbGVtZW50PihidXR0b25TZWxlY3RvciwgKGJ1dHRvbikgPT4ge1xyXG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgYnV0dG9uLmRhdGFzZXQuY2xpY2tlZCA9ICcxJztcclxuXHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGRlbGV0ZSBidXR0b24uZGF0YXNldC5jbGlja2VkO1xyXG4gICAgICB9LCAxNTAwKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBjb25zdCBmb3JtID0gc2VsZWN0T25lPEhUTUxGb3JtRWxlbWVudD4oZm9ybVNlbGVjdG9yKTtcclxuICBmb3JtPy5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCAoZTogU3VibWl0RXZlbnQpID0+IHtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBpZiAoIWZvcm0uY2hlY2tWYWxpZGl0eSgpKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzZWxlY3RBbGw8SFRNTEVsZW1lbnQ+KGJ1dHRvblNlbGVjdG9yLCAoYnV0dG9uKSA9PiB7XHJcbiAgICAgICAgYnV0dG9uLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnbm9uZSc7XHJcbiAgICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCAnZGlzYWJsZWQnKTtcclxuICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnZGlzYWJsZWQnKTtcclxuXHJcbiAgICAgICAgaWYgKGJ1dHRvbi5kYXRhc2V0LmNsaWNrZWQpIHtcclxuICAgICAgICAgIGxldCBpY29uID0gYnV0dG9uLnF1ZXJ5U2VsZWN0b3IoaWNvblNlbGVjdG9yKTtcclxuXHJcbiAgICAgICAgICBpZiAoaWNvbikge1xyXG4gICAgICAgICAgICBjb25zdCBpID0gaHRtbCgnPGk+PC9pPicpO1xyXG4gICAgICAgICAgICBpY29uLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKGksIGljb24pO1xyXG5cclxuICAgICAgICAgICAgaS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgc3Bpbm5lckNsYXNzKTtcclxuICAgICAgICAgICAgLy8gaWNvbi5zdHlsZXMud2lkdGggPSAnMWVtJztcclxuICAgICAgICAgICAgLy8gaWNvbi5zdHlsZXMuaGVpZ2h0ID0gJzFlbSc7XHJcbiAgICAgICAgICAgIC8vIGljb24uc3R5bGVzLmJvcmRlcldpdGggPSAnLjE1ZW0nO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9LCAwKTtcclxuICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZURpc2FibGVJZlN0YWNrTm90RW1wdHkoYnV0dG9uU2VsZWN0b3I6IHN0cmluZyA9ICdbZGF0YS10YXNrPXNhdmVdJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2tOYW1lOiBzdHJpbmcgPSAndXBsb2FkaW5nJykge1xyXG4gIGNvbnN0IHN0YWNrID0gdXNlU3RhY2soc3RhY2tOYW1lKTtcclxuXHJcbiAgc3RhY2sub2JzZXJ2ZSgoc3RhY2ssIGxlbmd0aCkgPT4ge1xyXG4gICAgZm9yIChjb25zdCBidXR0b24gb2Ygc2VsZWN0QWxsPEhUTUxFbGVtZW50PihidXR0b25TZWxlY3RvcikpIHtcclxuICAgICAgaWYgKGxlbmd0aCA+IDApIHtcclxuICAgICAgICBidXR0b24uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICdkaXNhYmxlZCcpO1xyXG4gICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlZCcpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGJ1dHRvbi5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XHJcbiAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc2FibGVkJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEtlZXAgYWxpdmUuXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gdXNlS2VlcEFsaXZlKHVybDogc3RyaW5nLCB0aW1lOiBudW1iZXIgPSA2MDAwMCk6ICgpID0+IHZvaWQge1xyXG4gIGNvbnN0IGFsaXZlSGFuZGxlID0gd2luZG93LnNldEludGVydmFsKCgpID0+IGZldGNoKHVybCksIHRpbWUpO1xyXG5cclxuICByZXR1cm4gKCkgPT4ge1xyXG4gICAgY2xlYXJJbnRlcnZhbChhbGl2ZUhhbmRsZSk7XHJcbiAgfTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFZ1ZSBjb21wb25lbnQgZmllbGQuXHJcbiAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlVnVlQ29tcG9uZW50RmllbGQoXHJcbiAgc2VsZWN0b3I/OiBOdWxsYWJsZTxzdHJpbmcgfCBIVE1MRWxlbWVudD4sXHJcbiAgdmFsdWU/OiBhbnksXHJcbiAgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9XHJcbik6IFByb21pc2U8YW55PiB7XHJcbiAgY29uc3QgbSA9IGF3YWl0IHVzZUltcG9ydCgnQHVuaWNvcm4vZmllbGQvdnVlLWNvbXBvbmVudC1maWVsZC5qcycpO1xyXG5cclxuICBpZiAoc2VsZWN0b3IpIHtcclxuICAgIG0uVnVlQ29tcG9uZW50RmllbGQuaW5pdChzZWxlY3RvciwgdmFsdWUsIG9wdGlvbnMpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG07XHJcbn1cclxuXHJcbmRlY2xhcmUgZ2xvYmFsIHtcclxuICB2YXIgQWxwaW5lOiBBbHBpbmVHbG9iYWw7XHJcbiAgdmFyIFRvbVNlbGVjdDogdHlwZW9mIFRvbVNlbGVjdEdsb2JhbDtcclxuICB2YXIgU3BlY3RydW06IHR5cGVvZiBTcGVjdHJ1bUdsb2JhbDtcclxuICB2YXIgTWFyazogYW55O1xyXG59XHJcbiJdLCJuYW1lcyI6WyJ1aSIsImNhbGxiYWNrIiwic3RhY2siXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFhQSxJQUFJO0FBRUosYUFBYSxRQUFRLENBQUMsT0FBZSxPQUFPLElBQUksT0FB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
