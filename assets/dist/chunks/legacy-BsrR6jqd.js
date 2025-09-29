import { i as isDebug, u as useHttpClient, _ as __, r as route, a as useUniDirective, b as animateTo, c as renderMessage, d as clearMessages, n as notify, e as clearNotifies, l as loadAlpine, f as initAlpineComponent, p as prepareAlpine, g as useFormValidation, h as addGlobalValidator, j as useFieldValidationSync, k as useFormValidationSync, m as useStack, o as useQueue, q as useSystemUri, s as useAssetUri, t as domready, v as selectOne, w as selectAll, x as getBoundedInstance, y as getBoundedInstanceList, z as module, A as h, B as html, C as delegate, D as debounce, E as throttle, F as simpleConfirm, G as simpleAlert, H as sprintfExports, I as base64UrlEncode, J as base64UrlDecode, K as uid, L as tid, M as serial, N as mark, O as useTomSelect, P as slideUp, Q as slideDown, R as slideToggle, S as fadeOut, T as fadeIn, U as highlight, V as useColorPicker, W as useDisableOnSubmit, X as useDisableIfStackNotEmpty, Y as useCheckboxesMultiSelect, Z as useKeepAlive, $ as useBs5Tooltip } from "./unicorn-G5leHO5V.js";
function numberFormat(number, decimals = 0, decPoint = ".", thousandsSep = ",") {
  number = Number(number);
  const str = number.toFixed(decimals ? decimals : 0).toString().split(".");
  const parts = [];
  for (var i = str[0].length; i > 0; i -= 3) {
    parts.unshift(str[0].substring(Math.max(0, i - 3), i));
  }
  str[0] = parts.join(thousandsSep ? thousandsSep : ",");
  return str.join(decPoint ? decPoint : ".");
}
const imports = {};
class LegacyLoader {
  constructor(app) {
    this.app = app;
  }
  static install(app) {
    const loader = app.$loader = new this(app);
    app.import = loader.import.bind(loader);
    app.importSync = loader.importSync.bind(loader);
    app.importCSS = loader.importCSS.bind(loader);
    app.minFileName = loader.minFileName.bind(loader);
    app.afterImported = loader.afterImported.bind(loader);
  }
  doImport(src) {
    return S.import(src);
  }
  /**
   * Import modules or scripts.
   */
  import(...src) {
    if (src.length === 1) {
      return this.doImport(src[0]);
    }
    const promises = [];
    src.forEach((link) => {
      promises.push(
        link instanceof Promise ? link : this.doImport(link)
      );
    });
    return Promise.all(promises);
  }
  /**
   * Import sync.
   */
  importSync(...src) {
    let promise = Promise.resolve();
    let url;
    const modules = [];
    while (url = src.shift()) {
      if (!Array.isArray(url)) {
        url = [url];
      }
      const target = url;
      promise = promise.then(
        () => this.import(...target).then((m) => {
          modules.push(m);
          return modules;
        })
      );
    }
    return promise;
  }
  /**
   * Import CSS files.
   */
  async importCSS(...src) {
    let modules = await this.import(...src);
    if (!Array.isArray(modules)) {
      modules = [modules];
    }
    const styles = modules.map((module2) => module2.default);
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, ...styles];
  }
  minFileName(fileName) {
    const segments = fileName.split(".");
    const ext = segments.pop();
    if (isDebug()) {
      return segments.join(".") + ".min." + ext;
    }
    return fileName;
  }
  asImported(name) {
    if (!imports[name]) {
      imports[name] = {
        promise: Promise.resolve(),
        resolve: void 0
      };
    } else {
      imports[name]?.resolve?.();
    }
  }
  /**
   * Add after import hook for some url or id.
   */
  afterImported(name, callback) {
    if (!imports[name]) {
      let r;
      imports[name] = {
        promise: new Promise((resolve) => {
          r = resolve;
        })
      };
      imports[name].resolve = r;
    }
    imports[name].promise.then(callback);
    return imports[name].promise;
  }
}
async function useLegacyMethods(app) {
  const http = await useHttpClient();
  app.use(LegacyLoader);
  handleUri(app);
  handlerHelper(app);
  handleCrypto(app);
  app.__ = __;
  app.trans = __;
  app.route = route;
  app.$http = http;
  app.directive = useUniDirective;
  app.animate = animateTo;
  app.$animation = { to: animateTo };
  app.addMessage = renderMessage;
  app.clearMessages = clearMessages;
  app.notify = notify;
  app.clearNotifies = clearNotifies;
  app.loadAlpine = loadAlpine;
  app.initAlpine = initAlpineComponent;
  app.beforeAlpineInit = prepareAlpine;
  app.prepareAlpine = prepareAlpine;
  handleUI(app);
  await handleFormGrid(app);
  app.formValidation = useFormValidation;
  app.$validation = {
    get: useFormValidationSync,
    getField: useFieldValidationSync,
    addGlobalValidator,
    import: () => useFormValidation()
  };
  app.stack = useStack;
  app.queue = useQueue;
}
function handleCrypto(app) {
  app.base64Encode = base64UrlEncode;
  app.base64Decode = base64UrlDecode;
  app.uid = uid;
  app.tid = tid;
  app.serial = serial;
}
function handleUri(app) {
  app.uri = useSystemUri;
  app.asset = useAssetUri;
}
function handlerHelper(app) {
  app.domready = domready;
  app.selectOne = selectOne;
  app.selectAll = selectAll;
  app.each = selectAll;
  app.getBoundedInstance = getBoundedInstance;
  app.getBoundedInstanceList = getBoundedInstanceList;
  app.module = module;
  app.h = h;
  app.html = html;
  app.delegate = delegate;
  app.debounce = debounce;
  app.throttle = throttle;
  app.isDebug = isDebug;
  app.confirm = simpleConfirm;
  app.alert = simpleAlert;
  app.numberFormat = numberFormat;
  app.sprintf = sprintfExports.sprintf;
  app.vsprintf = sprintfExports.vsprintf;
}
function handleUI(app) {
  app.$ui ??= {};
  app.$ui.addMessage = renderMessage;
  app.$ui.clearMessages = clearMessages;
  app.$ui.notify = notify;
  app.$ui.clearNotifies = clearNotifies;
  app.$ui.loadAlpine = loadAlpine;
  app.$ui.initAlpine = initAlpineComponent;
  app.$ui.beforeAlpineInit = prepareAlpine;
  app.$ui.prepareAlpine = prepareAlpine;
  app.$ui.mark = mark;
  app.$ui.tomSelect = useTomSelect;
  app.$ui.slideUp = slideUp;
  app.$ui.slideDown = slideDown;
  app.$ui.slideToggle = slideToggle;
  app.$ui.fadeOut = fadeOut;
  app.$ui.fadeIn = fadeIn;
  app.$ui.highlight = highlight;
  app.$ui.colorPicker = useColorPicker;
  app.$ui.disableOnSubmit = useDisableOnSubmit;
  app.$ui.disableIfStackNotEmpty = useDisableIfStackNotEmpty;
  app.$ui.checkboxesMultiSelect = useCheckboxesMultiSelect;
  app.$ui.keepAlive = useKeepAlive;
  app.$ui.bootstrap = {
    tooltip: useBs5Tooltip
  };
}
async function handleFormGrid(app) {
  const { UnicornFormElement } = await import("./form-BTIsx4Am.js");
  const { UnicornGridElement } = await import("./grid-_2qR0bTi.js");
  app.form = function useForm(ele, options = {}) {
    if (ele == null) {
      return new UnicornFormElement(void 0, void 0, options);
    }
    const selector = typeof ele === "string" ? ele : void 0;
    const el = selectOne(ele);
    if (!el) {
      throw new Error(`Form element of: ${selector} not found.`);
    }
    return module(
      el,
      "unicorn.form",
      () => new UnicornFormElement(selector, el, options)
    );
  };
  app.grid = function useGrid(ele, options = {}) {
    const selector = typeof ele === "string" ? ele : "";
    const element = selectOne(ele);
    if (!element) {
      throw new Error("Element is empty");
    }
    const form = app.form(selector || element);
    if (!form) {
      throw new Error("UnicornGrid is depends on UnicornForm");
    }
    return module(
      element,
      "grid.plugin",
      () => new UnicornGridElement(selector, element, form, options)
    );
  };
}
export {
  useLegacyMethods
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVnYWN5LUJzclI2anFkLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGx5cmFzb2Z0L3RzLXRvb2xraXQvc3JjL2dlbmVyaWMvbnVtYmVyLnRzIiwiLi4vLi4vc3JjL2xlZ2FjeS9sb2FkZXIudHMiLCIuLi8uLi9zcmMvbGVnYWN5L2xlZ2FjeS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gbnVtYmVyRm9ybWF0KG51bWJlcjogc3RyaW5nIHwgbnVtYmVyLCBkZWNpbWFscyA9IDAsIGRlY1BvaW50ID0gJy4nLCB0aG91c2FuZHNTZXAgPSAnLCcpIHtcbiAgbnVtYmVyID0gTnVtYmVyKG51bWJlcik7XG5cbiAgY29uc3Qgc3RyID0gbnVtYmVyLnRvRml4ZWQoZGVjaW1hbHMgPyBkZWNpbWFscyA6IDApLnRvU3RyaW5nKCkuc3BsaXQoJy4nKTtcbiAgY29uc3QgcGFydHMgPSBbXTtcblxuICBmb3IgKHZhciBpID0gc3RyWzBdLmxlbmd0aDsgaSA+IDA7IGkgLT0gMykge1xuICAgIHBhcnRzLnVuc2hpZnQoc3RyWzBdLnN1YnN0cmluZyhNYXRoLm1heCgwLCBpIC0gMyksIGkpKTtcbiAgfVxuXG4gIHN0clswXSA9IHBhcnRzLmpvaW4odGhvdXNhbmRzU2VwID8gdGhvdXNhbmRzU2VwIDogJywnKTtcblxuICByZXR1cm4gc3RyLmpvaW4oZGVjUG9pbnQgPyBkZWNQb2ludCA6ICcuJyk7XG59XG4iLCJpbXBvcnQgeyBpc0RlYnVnIH0gZnJvbSAnLi4vc2VydmljZSc7XG5cbmNvbnN0IGltcG9ydHM6IFJlY29yZDxzdHJpbmcsIHsgcHJvbWlzZTogUHJvbWlzZTxhbnk+OyByZXNvbHZlPzogRnVuY3Rpb247IH0+ID0ge307XG5cbmV4cG9ydCBjbGFzcyBMZWdhY3lMb2FkZXIge1xuICBzdGF0aWMgaW5zdGFsbChhcHA6IGFueSkge1xuICAgIGNvbnN0IGxvYWRlciA9IGFwcC4kbG9hZGVyID0gbmV3IHRoaXMoYXBwKTtcblxuICAgIGFwcC5pbXBvcnQgPSBsb2FkZXIuaW1wb3J0LmJpbmQobG9hZGVyKTtcbiAgICBhcHAuaW1wb3J0U3luYyA9IGxvYWRlci5pbXBvcnRTeW5jLmJpbmQobG9hZGVyKTtcbiAgICBhcHAuaW1wb3J0Q1NTID0gbG9hZGVyLmltcG9ydENTUy5iaW5kKGxvYWRlcik7XG4gICAgYXBwLm1pbkZpbGVOYW1lID0gbG9hZGVyLm1pbkZpbGVOYW1lLmJpbmQobG9hZGVyKTtcbiAgICBhcHAuYWZ0ZXJJbXBvcnRlZCA9IGxvYWRlci5hZnRlckltcG9ydGVkLmJpbmQobG9hZGVyKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBhcHA6IGFueSkge1xuICAgIC8vXG4gIH1cblxuICBkb0ltcG9ydChzcmM6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIFMuaW1wb3J0KHNyYyk7XG4gIH1cblxuICAvKipcbiAgICogSW1wb3J0IG1vZHVsZXMgb3Igc2NyaXB0cy5cbiAgICovXG4gIGltcG9ydCguLi5zcmM6IGFueVtdKTogUHJvbWlzZTxhbnl8YW55W10+IHtcbiAgICBpZiAoc3JjLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcmV0dXJuIHRoaXMuZG9JbXBvcnQoc3JjWzBdKTtcbiAgICB9XG5cbiAgICBjb25zdCBwcm9taXNlczogUHJvbWlzZTxhbnk+W10gPSBbXTtcblxuICAgIHNyYy5mb3JFYWNoKChsaW5rKSA9PiB7XG4gICAgICBwcm9taXNlcy5wdXNoKFxuICAgICAgICBsaW5rIGluc3RhbmNlb2YgUHJvbWlzZSA/IGxpbmsgOiB0aGlzLmRvSW1wb3J0KGxpbmspXG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBvcnQgc3luYy5cbiAgICovXG4gIGltcG9ydFN5bmMoLi4uc3JjOiBhbnkpOiBQcm9taXNlPGFueXxhbnlbXT4ge1xuICAgIGxldCBwcm9taXNlOiBQcm9taXNlPGFueT4gPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBsZXQgdXJsOiBzdHJpbmdbXTtcbiAgICBjb25zdCBtb2R1bGVzOiBhbnlbXSA9IFtdO1xuXG4gICAgd2hpbGUgKHVybCA9IHNyYy5zaGlmdCgpKSB7XG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkodXJsKSkge1xuICAgICAgICB1cmwgPSBbIHVybCBdO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB0YXJnZXQgPSB1cmw7XG4gICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKFxuICAgICAgICAoKSA9PiB0aGlzLmltcG9ydCguLi50YXJnZXQpLnRoZW4oKG0pID0+IHtcbiAgICAgICAgICBtb2R1bGVzLnB1c2gobSk7XG4gICAgICAgICAgcmV0dXJuIG1vZHVsZXM7XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcG9ydCBDU1MgZmlsZXMuXG4gICAqL1xuICBhc3luYyBpbXBvcnRDU1MoLi4uc3JjOiBhbnkpOiBQcm9taXNlPGFueXxhbnlbXT4ge1xuICAgIGxldCBtb2R1bGVzOiBhbnkgPSBhd2FpdCB0aGlzLmltcG9ydCguLi5zcmMpO1xuXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KG1vZHVsZXMpKSB7XG4gICAgICBtb2R1bGVzID0gW21vZHVsZXNdO1xuICAgIH1cblxuICAgIGNvbnN0IHN0eWxlczogQ1NTU3R5bGVTaGVldFtdID0gKG1vZHVsZXMgYXMgYW55W10pLm1hcChtb2R1bGUgPT4gbW9kdWxlLmRlZmF1bHQpO1xuXG4gICAgZG9jdW1lbnQuYWRvcHRlZFN0eWxlU2hlZXRzID0gWy4uLmRvY3VtZW50LmFkb3B0ZWRTdHlsZVNoZWV0cywgLi4uc3R5bGVzXTtcbiAgfVxuXG4gIG1pbkZpbGVOYW1lKGZpbGVOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHNlZ21lbnRzID0gZmlsZU5hbWUuc3BsaXQoJy4nKTtcbiAgICBjb25zdCBleHQgPSBzZWdtZW50cy5wb3AoKTtcblxuICAgIGlmIChpc0RlYnVnKCkpIHtcbiAgICAgIHJldHVybiBzZWdtZW50cy5qb2luKCcuJykgKyAnLm1pbi4nICsgZXh0O1xuICAgIH1cblxuICAgIHJldHVybiBmaWxlTmFtZTtcbiAgfVxuXG4gIGFzSW1wb3J0ZWQobmFtZTogc3RyaW5nKSB7XG4gICAgaWYgKCFpbXBvcnRzW25hbWVdKSB7XG4gICAgICBpbXBvcnRzW25hbWVdID0ge1xuICAgICAgICBwcm9taXNlOiBQcm9taXNlLnJlc29sdmUoKSxcbiAgICAgICAgcmVzb2x2ZTogdW5kZWZpbmVkXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBpbXBvcnRzW25hbWVdPy5yZXNvbHZlPy4oKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkIGFmdGVyIGltcG9ydCBob29rIGZvciBzb21lIHVybCBvciBpZC5cbiAgICovXG4gIGFmdGVySW1wb3J0ZWQobmFtZTogc3RyaW5nLCBjYWxsYmFjazogKHJlc29sdmU6IEZ1bmN0aW9uLCByZWplY3Q/OiBGdW5jdGlvbikgPT4gdm9pZCk6IFByb21pc2U8YW55PiB7XG4gICAgaWYgKCFpbXBvcnRzW25hbWVdKSB7XG4gICAgICBsZXQgcjtcbiAgICAgIGltcG9ydHNbbmFtZV0gPSB7XG4gICAgICAgIHByb21pc2U6IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgciA9IHJlc29sdmU7XG4gICAgICAgIH0pLFxuICAgICAgfTtcblxuICAgICAgaW1wb3J0c1tuYW1lXS5yZXNvbHZlID0gcjtcbiAgICB9XG5cbiAgICBpbXBvcnRzW25hbWVdLnByb21pc2UudGhlbihjYWxsYmFjayk7XG5cbiAgICByZXR1cm4gaW1wb3J0c1tuYW1lXS5wcm9taXNlO1xuICB9XG59XG5cbiIsImltcG9ydCB7IG51bWJlckZvcm1hdCB9IGZyb20gJ0BseXJhc29mdC90cy10b29sa2l0L2dlbmVyaWMnO1xuaW1wb3J0IHsgc3ByaW50ZiwgdnNwcmludGYgfSBmcm9tICdzcHJpbnRmLWpzJztcbmltcG9ydCB7XG4gIGFkZEdsb2JhbFZhbGlkYXRvcixcbiAgdXNlQnM1VG9vbHRpcCxcbiAgdXNlQ2hlY2tib3hlc011bHRpU2VsZWN0LFxuICB1c2VGaWVsZFZhbGlkYXRpb25TeW5jLFxuICB1c2VGb3JtVmFsaWRhdGlvbixcbiAgdXNlRm9ybVZhbGlkYXRpb25TeW5jLFxuICB1c2VIdHRwQ2xpZW50LFxuICB1c2VRdWV1ZSxcbiAgdXNlU3RhY2ssXG4gIHVzZVRvbVNlbGVjdCxcbiAgdXNlVW5pRGlyZWN0aXZlXG59IGZyb20gJy4uL2NvbXBvc2FibGUnO1xuaW1wb3J0IHsgTGVnYWN5TG9hZGVyIH0gZnJvbSAnLi9sb2FkZXInO1xuaW1wb3J0IHtcbiAgX18sXG4gIGFuaW1hdGVUbyxcbiAgYmFzZTY0VXJsRGVjb2RlLFxuICBiYXNlNjRVcmxFbmNvZGUsXG4gIGNsZWFyTWVzc2FnZXMsXG4gIGNsZWFyTm90aWZpZXMsXG4gIGRlYm91bmNlLFxuICBkZWxlZ2F0ZSxcbiAgZG9tcmVhZHksXG4gIGZhZGVJbixcbiAgZmFkZU91dCxcbiAgZ2V0Qm91bmRlZEluc3RhbmNlLFxuICBnZXRCb3VuZGVkSW5zdGFuY2VMaXN0LFxuICBoLFxuICBoaWdobGlnaHQsXG4gIGh0bWwsXG4gIGluaXRBbHBpbmVDb21wb25lbnQsXG4gIGlzRGVidWcsXG4gIGxvYWRBbHBpbmUsXG4gIG1hcmssXG4gIG1vZHVsZSxcbiAgbm90aWZ5LFxuICBwcmVwYXJlQWxwaW5lLFxuICByZW5kZXJNZXNzYWdlLFxuICByb3V0ZSxcbiAgc2VsZWN0QWxsLFxuICBzZWxlY3RPbmUsXG4gIHNlcmlhbCxcbiAgc2ltcGxlQWxlcnQsXG4gIHNpbXBsZUNvbmZpcm0sXG4gIHNsaWRlRG93bixcbiAgc2xpZGVUb2dnbGUsXG4gIHNsaWRlVXAsXG4gIHRocm90dGxlLFxuICB0aWQsXG4gIHVpZCxcbiAgdXNlQXNzZXRVcmksXG4gIHVzZUNvbG9yUGlja2VyLFxuICB1c2VEaXNhYmxlSWZTdGFja05vdEVtcHR5LFxuICB1c2VEaXNhYmxlT25TdWJtaXQsXG4gIHVzZUtlZXBBbGl2ZSxcbiAgdXNlU3lzdGVtVXJpXG59IGZyb20gJy4uL3NlcnZpY2UnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlTGVnYWN5TWV0aG9kcyhhcHA6IGFueSkge1xuICBjb25zdCBodHRwID0gYXdhaXQgdXNlSHR0cENsaWVudCgpO1xuXG4gIGFwcC51c2UoTGVnYWN5TG9hZGVyKTtcblxuICBoYW5kbGVVcmkoYXBwKTtcbiAgaGFuZGxlckhlbHBlcihhcHApO1xuICBoYW5kbGVDcnlwdG8oYXBwKTtcblxuICBhcHAuX18gPSBfXztcbiAgYXBwLnRyYW5zID0gX187XG4gIGFwcC5yb3V0ZSA9IHJvdXRlO1xuICBhcHAuJGh0dHAgPSBodHRwO1xuICBhcHAuZGlyZWN0aXZlID0gdXNlVW5pRGlyZWN0aXZlO1xuXG4gIGFwcC5hbmltYXRlID0gYW5pbWF0ZVRvO1xuICBhcHAuJGFuaW1hdGlvbiA9IHsgdG86IGFuaW1hdGVUbyB9O1xuXG4gIGFwcC5hZGRNZXNzYWdlID0gcmVuZGVyTWVzc2FnZTtcbiAgYXBwLmNsZWFyTWVzc2FnZXMgPSBjbGVhck1lc3NhZ2VzO1xuICBhcHAubm90aWZ5ID0gbm90aWZ5O1xuICBhcHAuY2xlYXJOb3RpZmllcyA9IGNsZWFyTm90aWZpZXM7XG5cbiAgYXBwLmxvYWRBbHBpbmUgPSBsb2FkQWxwaW5lO1xuICBhcHAuaW5pdEFscGluZSA9IGluaXRBbHBpbmVDb21wb25lbnQ7XG4gIGFwcC5iZWZvcmVBbHBpbmVJbml0ID0gcHJlcGFyZUFscGluZTtcbiAgYXBwLnByZXBhcmVBbHBpbmUgPSBwcmVwYXJlQWxwaW5lO1xuXG4gIGhhbmRsZVVJKGFwcCk7XG5cbiAgYXdhaXQgaGFuZGxlRm9ybUdyaWQoYXBwKTtcblxuICBhcHAuZm9ybVZhbGlkYXRpb24gPSB1c2VGb3JtVmFsaWRhdGlvbjtcbiAgYXBwLiR2YWxpZGF0aW9uID0ge1xuICAgIGdldDogdXNlRm9ybVZhbGlkYXRpb25TeW5jLFxuICAgIGdldEZpZWxkOiB1c2VGaWVsZFZhbGlkYXRpb25TeW5jLFxuICAgIGFkZEdsb2JhbFZhbGlkYXRvcjogYWRkR2xvYmFsVmFsaWRhdG9yLFxuICAgIGltcG9ydDogKCkgPT4gdXNlRm9ybVZhbGlkYXRpb24oKVxuICB9O1xuXG4gIGFwcC5zdGFjayA9IHVzZVN0YWNrO1xuICBhcHAucXVldWUgPSB1c2VRdWV1ZTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlQ3J5cHRvKGFwcDogYW55KSB7XG4gIGFwcC5iYXNlNjRFbmNvZGUgPSBiYXNlNjRVcmxFbmNvZGU7XG4gIGFwcC5iYXNlNjREZWNvZGUgPSBiYXNlNjRVcmxEZWNvZGU7XG4gIC8vIGFwcC51dWlkNCA9IHV1aWQ0O1xuICBhcHAudWlkID0gdWlkO1xuICBhcHAudGlkID0gdGlkO1xuICAvLyBhcHAubWQ1ID0gbWQ1O1xuICBhcHAuc2VyaWFsID0gc2VyaWFsO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVVcmkoYXBwOiBhbnkpIHtcbiAgYXBwLnVyaSA9IHVzZVN5c3RlbVVyaTtcbiAgYXBwLmFzc2V0ID0gdXNlQXNzZXRVcmk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZXJIZWxwZXIoYXBwOiBhbnkpIHtcbiAgYXBwLmRvbXJlYWR5ID0gZG9tcmVhZHk7XG4gIGFwcC5zZWxlY3RPbmUgPSBzZWxlY3RPbmU7XG4gIGFwcC5zZWxlY3RBbGwgPSBzZWxlY3RBbGw7XG4gIGFwcC5lYWNoID0gc2VsZWN0QWxsO1xuICBhcHAuZ2V0Qm91bmRlZEluc3RhbmNlID0gZ2V0Qm91bmRlZEluc3RhbmNlO1xuICBhcHAuZ2V0Qm91bmRlZEluc3RhbmNlTGlzdCA9IGdldEJvdW5kZWRJbnN0YW5jZUxpc3Q7XG4gIGFwcC5tb2R1bGUgPSBtb2R1bGU7XG4gIGFwcC5oID0gaDtcbiAgYXBwLmh0bWwgPSBodG1sO1xuICAvLyBhcHAuJGdldCA9IGdldDtcbiAgLy8gYXBwLiRzZXQgPSBzZXQ7XG4gIGFwcC5kZWxlZ2F0ZSA9IGRlbGVnYXRlO1xuICBhcHAuZGVib3VuY2UgPSBkZWJvdW5jZTtcbiAgYXBwLnRocm90dGxlID0gdGhyb3R0bGU7XG4gIGFwcC5pc0RlYnVnID0gaXNEZWJ1ZztcbiAgYXBwLmNvbmZpcm0gPSBzaW1wbGVDb25maXJtO1xuICBhcHAuYWxlcnQgPSBzaW1wbGVBbGVydDtcbiAgYXBwLm51bWJlckZvcm1hdCA9IG51bWJlckZvcm1hdDtcbiAgYXBwLnNwcmludGYgPSBzcHJpbnRmO1xuICBhcHAudnNwcmludGYgPSB2c3ByaW50ZjtcbiAgLy8gYXBwLmdlblJhbmRvbVN0cmluZyA9IGdlblJhbmRvbVN0cmluZztcbiAgLy8gYXBwLmRlZmF1bHRzRGVlcCA9IGRlZmF1bHRzRGVlcDtcbn1cblxuZnVuY3Rpb24gaGFuZGxlVUkoYXBwOiBhbnkpIHtcbiAgYXBwLiR1aSA/Pz0ge307XG4gIGFwcC4kdWkuYWRkTWVzc2FnZSA9IHJlbmRlck1lc3NhZ2U7XG4gIGFwcC4kdWkuY2xlYXJNZXNzYWdlcyA9IGNsZWFyTWVzc2FnZXM7XG4gIGFwcC4kdWkubm90aWZ5ID0gbm90aWZ5O1xuICBhcHAuJHVpLmNsZWFyTm90aWZpZXMgPSBjbGVhck5vdGlmaWVzO1xuXG4gIGFwcC4kdWkubG9hZEFscGluZSA9IGxvYWRBbHBpbmU7XG4gIGFwcC4kdWkuaW5pdEFscGluZSA9IGluaXRBbHBpbmVDb21wb25lbnQ7XG4gIGFwcC4kdWkuYmVmb3JlQWxwaW5lSW5pdCA9IHByZXBhcmVBbHBpbmU7XG4gIGFwcC4kdWkucHJlcGFyZUFscGluZSA9IHByZXBhcmVBbHBpbmU7XG5cbiAgYXBwLiR1aS5tYXJrID0gbWFyaztcbiAgYXBwLiR1aS50b21TZWxlY3QgPSB1c2VUb21TZWxlY3Q7XG4gIGFwcC4kdWkuc2xpZGVVcCA9IHNsaWRlVXA7XG4gIGFwcC4kdWkuc2xpZGVEb3duID0gc2xpZGVEb3duO1xuICBhcHAuJHVpLnNsaWRlVG9nZ2xlID0gc2xpZGVUb2dnbGU7XG4gIGFwcC4kdWkuZmFkZU91dCA9IGZhZGVPdXQ7XG4gIGFwcC4kdWkuZmFkZUluID0gZmFkZUluO1xuICBhcHAuJHVpLmhpZ2hsaWdodCA9IGhpZ2hsaWdodDtcbiAgYXBwLiR1aS5jb2xvclBpY2tlciA9IHVzZUNvbG9yUGlja2VyO1xuICBhcHAuJHVpLmRpc2FibGVPblN1Ym1pdCA9IHVzZURpc2FibGVPblN1Ym1pdDtcbiAgYXBwLiR1aS5kaXNhYmxlSWZTdGFja05vdEVtcHR5ID0gdXNlRGlzYWJsZUlmU3RhY2tOb3RFbXB0eTtcbiAgYXBwLiR1aS5jaGVja2JveGVzTXVsdGlTZWxlY3QgPSB1c2VDaGVja2JveGVzTXVsdGlTZWxlY3Q7XG4gIGFwcC4kdWkua2VlcEFsaXZlID0gdXNlS2VlcEFsaXZlO1xuICBhcHAuJHVpLmJvb3RzdHJhcCA9IHtcbiAgICB0b29sdGlwOiB1c2VCczVUb29sdGlwXG4gIH07XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZUZvcm1HcmlkKGFwcDogYW55KSB7XG4gIGNvbnN0IHsgVW5pY29ybkZvcm1FbGVtZW50IH0gPSBhd2FpdCBpbXBvcnQoJy4uL21vZHVsZS9mb3JtJyk7XG4gIGNvbnN0IHsgVW5pY29ybkdyaWRFbGVtZW50IH0gPSBhd2FpdCBpbXBvcnQoJy4uL21vZHVsZS9ncmlkJyk7XG5cbiAgYXBwLmZvcm0gPSBmdW5jdGlvbiB1c2VGb3JtKGVsZT86IHN0cmluZyB8IEVsZW1lbnQsIG9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fSkge1xuICAgIGlmIChlbGUgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG5ldyBVbmljb3JuRm9ybUVsZW1lbnQodW5kZWZpbmVkLCB1bmRlZmluZWQsIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIGNvbnN0IHNlbGVjdG9yID0gdHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiB1bmRlZmluZWQ7XG4gICAgY29uc3QgZWwgPSBzZWxlY3RPbmU8SFRNTEZvcm1FbGVtZW50PihlbGUgYXMgc3RyaW5nKTtcblxuICAgIGlmICghZWwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRm9ybSBlbGVtZW50IG9mOiAke3NlbGVjdG9yfSBub3QgZm91bmQuYCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1vZHVsZShcbiAgICAgIGVsLFxuICAgICAgJ3VuaWNvcm4uZm9ybScsXG4gICAgICAoKSA9PiBuZXcgVW5pY29ybkZvcm1FbGVtZW50KHNlbGVjdG9yLCBlbCwgb3B0aW9ucylcbiAgICApO1xuICB9O1xuXG4gIGFwcC5ncmlkID0gZnVuY3Rpb24gdXNlR3JpZChcbiAgICBlbGU6IHN0cmluZyB8IEhUTUxFbGVtZW50LFxuICAgIG9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT4gfCB1bmRlZmluZWQgPSB7fVxuICApIHtcbiAgICBjb25zdCBzZWxlY3RvciA9IHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogJyc7XG4gICAgY29uc3QgZWxlbWVudCA9IHNlbGVjdE9uZShlbGUpO1xuXG4gICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0VsZW1lbnQgaXMgZW1wdHknKTtcbiAgICB9XG5cbiAgICBjb25zdCBmb3JtID0gYXBwLmZvcm0oc2VsZWN0b3IgfHwgZWxlbWVudCk7XG5cbiAgICBpZiAoIWZvcm0pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5pY29ybkdyaWQgaXMgZGVwZW5kcyBvbiBVbmljb3JuRm9ybScpO1xuICAgIH1cblxuICAgIHJldHVybiBtb2R1bGUoXG4gICAgICBlbGVtZW50LFxuICAgICAgJ2dyaWQucGx1Z2luJyxcbiAgICAgICgpID0+IG5ldyBVbmljb3JuR3JpZEVsZW1lbnQoc2VsZWN0b3IsIGVsZW1lbnQsIGZvcm0sIG9wdGlvbnMpXG4gICAgKTtcbiAgfTtcbn1cbiJdLCJuYW1lcyI6WyJtb2R1bGUiLCJzcHJpbnRmIiwidnNwcmludGYiXSwibWFwcGluZ3MiOiI7QUFBTyxTQUFTLGFBQWEsUUFBeUIsV0FBVyxHQUFHLFdBQVcsS0FBSyxlQUFlLEtBQUs7QUFDdEcsV0FBUyxPQUFPLE1BQU07QUFF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QUFDdEIsTUFBSSxJQUFJLFVBQVU7QUFDbEIsTUFBSSxJQUFJLFNBQVM7QUFDakIsTUFBSSxJQUFJLFlBQVk7QUFDcEIsTUFBSSxJQUFJLGNBQWM7QUFDdEIsTUFBSSxJQUFJLGtCQUFrQjtBQUMxQixNQUFJLElBQUkseUJBQXlCO0FBQ2pDLE1BQUksSUFBSSx3QkFBd0I7QUFDaEMsTUFBSSxJQUFJLFlBQVk7QUFDcEIsTUFBSSxJQUFJLFlBQVk7QUFBQSxJQUNsQixTQUFTO0FBQUEsRUFBQTtBQUViO0FBRUEsZUFBZSxlQUFlLEtBQVU7QUFDdEMsUUFBTSxFQUFFLG1CQUFBLElBQXVCLE1BQU0sT0FBTyxvQkFBZ0I7QUFDNUQsUUFBTSxFQUFFLG1CQUFBLElBQXVCLE1BQU0sT0FBTyxvQkFBZ0I7QUFFNUQsTUFBSSxPQUFPLFNBQVMsUUFBUSxLQUF3QixVQUErQixDQUFBLEdBQUk7QUFDckYsUUFBSSxPQUFPLE1BQU07QUFDZixhQUFPLElBQUksbUJBQW1CLFFBQVcsUUFBVyxPQUFPO0FBQUEsSUFDN0Q7QUFFQSxVQUFNLFdBQVcsT0FBTyxRQUFRLFdBQVcsTUFBTTtBQUNqRCxVQUFNLEtBQUssVUFBMkIsR0FBYTtBQUVuRCxRQUFJLENBQUMsSUFBSTtBQUNQLFlBQU0sSUFBSSxNQUFNLG9CQUFvQixRQUFRLGFBQWE7QUFBQSxJQUMzRDtBQUVBLFdBQU87QUFBQSxNQUNMO0FBQUEsTUFDQTtBQUFBLE1BQ0EsTUFBTSxJQUFJLG1CQUFtQixVQUFVLElBQUksT0FBTztBQUFBLElBQUE7QUFBQSxFQUV0RDtBQUVBLE1BQUksT0FBTyxTQUFTLFFBQ2xCLEtBQ0EsVUFBMkMsQ0FBQSxHQUMzQztBQUNBLFVBQU0sV0FBVyxPQUFPLFFBQVEsV0FBVyxNQUFNO0FBQ2pELFVBQU0sVUFBVSxVQUFVLEdBQUc7QUFFN0IsUUFBSSxDQUFDLFNBQVM7QUFDWixZQUFNLElBQUksTUFBTSxrQkFBa0I7QUFBQSxJQUNwQztBQUVBLFVBQU0sT0FBTyxJQUFJLEtBQUssWUFBWSxPQUFPO0FBRXpDLFFBQUksQ0FBQyxNQUFNO0FBQ1QsWUFBTSxJQUFJLE1BQU0sdUNBQXVDO0FBQUEsSUFDekQ7QUFFQSxXQUFPO0FBQUEsTUFDTDtBQUFBLE1BQ0E7QUFBQSxNQUNBLE1BQU0sSUFBSSxtQkFBbUIsVUFBVSxTQUFTLE1BQU0sT0FBTztBQUFBLElBQUE7QUFBQSxFQUVqRTtBQUNGOyIsInhfZ29vZ2xlX2lnbm9yZUxpc3QiOlswXX0=
