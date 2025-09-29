import { i as isDebug, u as useHttpClient, _ as __, r as route, a as useUniDirective, b as animateTo, c as renderMessage, d as clearMessages, n as notify, e as clearNotifies, l as loadAlpine, f as initAlpineComponent, p as prepareAlpine, g as useFormValidation, h as addGlobalValidator, j as useFieldValidationSync, k as useFormValidationSync, m as useStack, o as useQueue, q as useSystemUri, s as useAssetUri, t as domready, v as selectOne, w as selectAll, x as getBoundedInstance, y as getBoundedInstanceList, z as module, A as h, B as html, C as delegate, D as debounce, E as throttle, F as simpleConfirm, G as simpleAlert, H as sprintfExports, I as base64UrlEncode, J as base64UrlDecode, K as uid, L as tid, M as serial, N as mark, O as useTomSelect, P as slideUp, Q as slideDown, R as slideToggle, S as fadeOut, T as fadeIn, U as highlight, V as useColorPicker, W as useDisableOnSubmit, X as useDisableIfStackNotEmpty, Y as useCheckboxesMultiSelect, Z as useKeepAlive, $ as useBs5Tooltip } from "./unicorn-DFzPUtbL.js";
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
  const { UnicornFormElement } = await import("./form-GhEWMNuc.js");
  const { UnicornGridElement } = await import("./grid-DZQlriGq.js");
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
