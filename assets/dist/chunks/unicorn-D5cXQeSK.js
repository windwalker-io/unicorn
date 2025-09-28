function isPlainObject(val) {
  return val && typeof val === "object" && !Array.isArray(val);
}
function mergeDeep(target, ...sources) {
  let out = isPlainObject(target) ? { ...target } : target;
  for (const source of sources) {
    if (Array.isArray(source)) {
      out = Array.isArray(out) ? out.concat(source) : source;
      continue;
    }
    if (isPlainObject(source)) {
      out = { ...isPlainObject(out) ? out : {} };
      for (const key of Object.keys(source)) {
        out[key] = key in out ? mergeDeep(out[key], source[key]) : source[key];
      }
      continue;
    }
    out = source;
  }
  return out;
}
function getData(element, name = void 0) {
  prepareData(element);
  if (name === void 0) {
    return element.__unicorn;
  }
  return element.__unicorn[name];
}
function setData(element, name, value) {
  prepareData(element);
  element.__unicorn[name] = value;
}
function defData(element, name, defCallback) {
  prepareData(element);
  element.__unicorn[name] = element.__unicorn[name] || defCallback(element);
  return element.__unicorn[name];
}
function removeData$1(element, name) {
  prepareData(element);
  const v = element.__unicorn[name];
  delete element.__unicorn[name];
  return v;
}
function prepareData(element) {
  if (!element) {
    return element;
  }
  element.__unicorn = element.__unicorn || {};
  return element;
}
function domready(callback) {
  let promise = new Promise((resolve) => {
    if (document.readyState === "complete" || document.readyState === "interactive") {
      setTimeout(resolve, 0);
    } else {
      document.addEventListener("DOMContentLoaded", () => resolve());
    }
  });
  if (callback) {
    promise = promise.then(callback);
  }
  return promise;
}
function selectOne(ele) {
  let r;
  if (typeof ele === "string") {
    r = document.querySelector(ele);
  } else {
    r = ele;
  }
  if (!r) {
    return r;
  }
  return r;
}
function selectAll(ele, callback = void 0) {
  if (typeof ele === "string") {
    ele = document.querySelectorAll(ele);
  }
  const resultSet = [].slice.call(ele);
  if (callback) {
    return resultSet.map((el) => callback(el) || el);
  }
  return resultSet;
}
function getBoundedInstance(selector, name, callback = () => null) {
  const element = typeof selector === "string" ? document.querySelector(selector) : selector;
  if (!element) {
    return null;
  }
  return defData(element, name, callback);
}
function getBoundedInstanceList(selector, name, callback = () => null) {
  const items = typeof selector === "string" ? document.querySelectorAll(selector) : selector;
  return Array.from(items).map((ele) => getBoundedInstance(ele, name, callback));
}
function module(ele, name, callback = () => null) {
  if (typeof ele === "string") {
    return getBoundedInstanceList(ele, name, callback);
  }
  if (ele instanceof HTMLElement) {
    return getBoundedInstance(ele, name, callback);
  }
  return getBoundedInstanceList(ele, name, callback);
}
function h(element, attrs = {}, content = void 0) {
  const ele = document.createElement(element);
  for (let i in attrs) {
    const v = attrs[i];
    ele.setAttribute(i, v);
  }
  if (content !== null) {
    ele.innerHTML = content;
  }
  return ele;
}
function html(html2) {
  const div = document.createElement("div");
  div.innerHTML = html2;
  return div.children[0];
}
function delegate(wrapper, selector, eventName, callback) {
  if (typeof selector === "undefined" || selector === "") {
    throw new Error("The provided selector is empty.");
  }
  if (typeof callback === "undefined" || typeof callback !== "function") {
    throw new Error("Please specify an callback.");
  }
  const delegationSelectorsMap = {};
  const wrapperElement = selectOne(wrapper);
  wrapperElement?.addEventListener(eventName, function(event) {
    let element = event.target;
    let forceBreak = false;
    while (element && element !== wrapperElement) {
      for (const selector2 in delegationSelectorsMap) {
        if (element.matches(selector2)) {
          event.stopPropagation = function() {
            forceBreak = true;
          };
          Object.defineProperty(
            event,
            "currentTarget",
            {
              get() {
                return element;
              }
            }
          );
          const callbackList = delegationSelectorsMap[selector2];
          callbackList.forEach(function(callback2) {
            callback2(event);
          });
        }
      }
      if (forceBreak) {
        break;
      }
      element = element.parentElement;
    }
  });
  if (!delegationSelectorsMap[selector]) {
    delegationSelectorsMap[selector] = [callback];
  } else {
    delegationSelectorsMap[selector].push(callback);
  }
  return function unsubscribe() {
    if (!delegationSelectorsMap[selector]) {
      return;
    }
    if (delegationSelectorsMap[selector].length >= 2) {
      delegationSelectorsMap[selector] = delegationSelectorsMap[selector].filter((cb) => cb !== callback);
    } else {
      delete delegationSelectorsMap[selector];
    }
  };
}
function injectCssToDocument(doc, ...css) {
  if (!(doc instanceof Document)) {
    css.push(doc);
    doc = document;
  }
  const styles = css.map((css2) => {
    if (typeof css2 === "string") {
      const style = new CSSStyleSheet();
      style.replaceSync(css2);
      return style;
    }
    return css2;
  });
  doc.adoptedStyleSheets = [...doc.adoptedStyleSheets, ...styles];
  return styles;
}
function animateTo(element, styles, options = {}) {
  element = selectOne(element);
  const currentStyles = window.getComputedStyle(element);
  const transitions = {};
  for (const name in styles) {
    const value = styles[name];
    transitions[name] = Array.isArray(value) ? value : [
      currentStyles.getPropertyValue(name),
      value
    ];
  }
  if (typeof options === "number") {
    options = { duration: options };
  }
  options = Object.assign(
    {
      duration: 400,
      easing: "linear",
      fill: "both"
    },
    options
  );
  const animation = element.animate(
    transitions,
    options
  );
  animation.addEventListener("finish", () => {
    for (const name in styles) {
      const value = styles[name];
      element.style.setProperty(
        name,
        Array.isArray(value) ? value[value.length - 1] : value
      );
    }
    animation.cancel();
  });
  return animation;
}
const _AlertAdapter = class _AlertAdapter {
};
_AlertAdapter.alert = async (title) => window.alert(title);
_AlertAdapter.confirm = async (title) => {
  return new Promise((resolve) => {
    const v = confirm(title);
    resolve(v);
  });
};
_AlertAdapter.deleteConfirm = async (title) => _AlertAdapter.confirm(title);
_AlertAdapter.confirmText = () => "確認";
_AlertAdapter.cancelText = () => "取消";
_AlertAdapter.deleteText = () => "刪除";
let AlertAdapter = _AlertAdapter;
async function simpleAlert(title, text = "", icon = "info", extra) {
  return AlertAdapter.alert(title, text, icon, extra);
}
async function simpleConfirm(title, text = "", icon = "info", extra) {
  return AlertAdapter.confirm(title, text, icon, extra);
}
async function deleteConfirm(title, text = "", icon = "info", extra) {
  return AlertAdapter.deleteConfirm(title, text, icon, extra);
}
function isNode() {
  return typeof window === "undefined";
}
function uid(prefix = "", timebase = false) {
  if (timebase) {
    const start = performance?.timeOrigin ? Math.round(performance.timeOrigin) : performance.timing.navigationStart;
    const time = start * 1e5 + performance.now() * 100;
    return prefix + time.toString(12) + randomBytesString(4);
  }
  return prefix + randomBytesString(12);
}
function tid(prefix = "") {
  return uid(prefix, true);
}
function randomBytesString(size = 12) {
  if (!isNode() && !globalThis.crypto) {
    return String(Math.floor(Math.random() * size ** 10));
  }
  return Array.from(randomBytes(size)).map((x) => x.toString(16).padStart(2, "0")).join("");
}
function randomBytes(size = 12) {
  const arr = new Uint8Array(size);
  globalThis.crypto.getRandomValues(arr);
  return arr;
}
class TaskQueue {
  constructor(maxRunning = 1) {
    this.maxRunning = maxRunning;
    this.items = [];
    this.currentRunning = 0;
    this.running = false;
    this.observers = [];
  }
  push(callback) {
    const p = new Promise((resolve, reject) => {
      this.items.push(() => {
        return Promise.resolve(callback()).then(resolve);
      });
    });
    this.run();
    return p;
  }
  run() {
    if (!this.running) {
      this.running = true;
    }
    this.pop();
  }
  async pop() {
    const callback = this.items.shift();
    if (!callback) {
      this.running = false;
      return Promise.resolve();
    }
    if (this.currentRunning >= this.maxRunning) {
      this.items.unshift(callback);
      return Promise.resolve();
    }
    this.currentRunning++;
    this.notice();
    try {
      return await callback();
    } catch (e) {
      throw e;
    } finally {
      this.endPop();
    }
  }
  endPop() {
    this.currentRunning--;
    this.notice();
    this.pop();
  }
  clear() {
    this.items = [];
    this.notice();
    return this;
  }
  isEmpty() {
    return this.items.length === 0;
  }
  get length() {
    return this.items.length;
  }
  peek() {
    return this.items;
  }
  observe(handler, options = {}) {
    this.observers.push({
      handler,
      once: options.once || false
    });
    return () => {
      this.off(handler);
    };
  }
  once(handler, options = {}) {
    options.once = true;
    return this.observe(handler, options);
  }
  onEnd(callback, options = {}) {
    return this.observe((queue2, length, running) => {
      if (length === 0 && running === 0) {
        callback(queue2, length, running);
      }
    }, options);
  }
  notice() {
    this.observers.forEach((observer) => {
      observer.handler(this, this.length, this.currentRunning);
    });
    this.observers = this.observers.filter((observer) => !observer.once);
    return this;
  }
  off(callback) {
    if (callback == null) {
      this.observers = [];
      return this;
    }
    this.observers = this.observers.filter((observer) => observer.handler !== callback);
    return this;
  }
}
function queue(maxRunning = 1) {
  return new TaskQueue(maxRunning);
}
class Stack {
  constructor(store = []) {
    this.store = store;
    this.observers = [];
  }
  push(value) {
    const r = this.store.push(value ?? true);
    this.notice();
    return r;
  }
  pop() {
    const r = this.store.pop();
    this.notice();
    return r;
  }
  clear() {
    this.store = [];
    this.notice();
    return this;
  }
  isEmpty() {
    return this.store.length === 0;
  }
  get length() {
    return this.store.length;
  }
  peek() {
    return this.store;
  }
  observe(handler) {
    this.observers.push({
      handler,
      once: false
    });
    return () => {
      this.off(handler);
    };
  }
  once(handler) {
    this.observers.push({
      handler,
      once: true
    });
    return () => {
      this.off(handler);
    };
  }
  notice() {
    this.observers.forEach((observer) => {
      observer.handler(this, this.length);
    });
    this.observers = this.observers.filter((observer) => observer.once !== true);
    return this;
  }
  off(callback) {
    this.observers = this.observers.filter((observer) => observer.handler !== callback);
    return this;
  }
}
function stack(store = []) {
  return new Stack(store);
}
function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}
function base64UrlEncode(string) {
  return btoa(String(string)).replace(/\+/, "-").replace(new RegExp("\\/"), "_").replace(/=+$/, "");
}
function base64UrlDecode(string) {
  return atob(
    String(string).replace(/-/, "+").replace(/_/, "/")
  );
}
let globalSerial = 1;
function serial() {
  return globalSerial++;
}
function forceArray(item) {
  if (Array.isArray(item)) {
    return item;
  } else {
    return [item];
  }
}
function debounce(handler, wait2 = 1) {
  let timer, result;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => result = handler.call(this, ...args), wait2);
    return result;
  };
}
function throttle(handler, wait2 = 1) {
  return function(...args) {
    {
      return handler.call(this, ...args);
    }
  };
}
function isDebug() {
  return Boolean(data("windwalker.debug"));
}
function nextTick(callback) {
  return Promise.resolve().then(callback ?? (() => null));
}
function wait(...promisee) {
  return Promise.all(promisee);
}
var sprintf = {};
var hasRequiredSprintf;
function requireSprintf() {
  if (hasRequiredSprintf) return sprintf;
  hasRequiredSprintf = 1;
  (function(exports) {
    !(function() {
      var re = {
        not_type: /[^T]/,
        not_primitive: /[^v]/,
        number: /[diefg]/,
        numeric_arg: /[bcdiefguxX]/,
        json: /[j]/,
        text: /^[^\x25]+/,
        modulo: /^\x25{2}/,
        placeholder: /^\x25(?:([1-9]\d*)\$|\(([^)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijostTuvxX])/,
        key: /^([a-z_][a-z_\d]*)/i,
        key_access: /^\.([a-z_][a-z_\d]*)/i,
        index_access: /^\[(\d+)\]/,
        sign: /^[+-]/
      };
      function sprintf2(key) {
        return sprintf_format(sprintf_parse(key), arguments);
      }
      function vsprintf(fmt, argv) {
        return sprintf2.apply(null, [fmt].concat(argv || []));
      }
      function sprintf_format(parse_tree, argv) {
        var cursor = 1, tree_length = parse_tree.length, arg, output = "", i, k, ph, pad, pad_character, pad_length, is_positive, sign;
        for (i = 0; i < tree_length; i++) {
          if (typeof parse_tree[i] === "string") {
            output += parse_tree[i];
          } else if (typeof parse_tree[i] === "object") {
            ph = parse_tree[i];
            if (ph.keys) {
              arg = argv[cursor];
              for (k = 0; k < ph.keys.length; k++) {
                if (arg == void 0) {
                  throw new Error(sprintf2('[sprintf] Cannot access property "%s" of undefined value "%s"', ph.keys[k], ph.keys[k - 1]));
                }
                arg = arg[ph.keys[k]];
              }
            } else if (ph.param_no) {
              arg = argv[ph.param_no];
            } else {
              arg = argv[cursor++];
            }
            if (re.not_type.test(ph.type) && re.not_primitive.test(ph.type) && arg instanceof Function) {
              arg = arg();
            }
            if (re.numeric_arg.test(ph.type) && (typeof arg !== "number" && isNaN(arg))) {
              throw new TypeError(sprintf2("[sprintf] expecting number but found %T", arg));
            }
            if (re.number.test(ph.type)) {
              is_positive = arg >= 0;
            }
            switch (ph.type) {
              case "b":
                arg = parseInt(arg, 10).toString(2);
                break;
              case "c":
                arg = String.fromCharCode(parseInt(arg, 10));
                break;
              case "d":
              case "i":
                arg = parseInt(arg, 10);
                break;
              case "j":
                arg = JSON.stringify(arg, null, ph.width ? parseInt(ph.width) : 0);
                break;
              case "e":
                arg = ph.precision ? parseFloat(arg).toExponential(ph.precision) : parseFloat(arg).toExponential();
                break;
              case "f":
                arg = ph.precision ? parseFloat(arg).toFixed(ph.precision) : parseFloat(arg);
                break;
              case "g":
                arg = ph.precision ? String(Number(arg.toPrecision(ph.precision))) : parseFloat(arg);
                break;
              case "o":
                arg = (parseInt(arg, 10) >>> 0).toString(8);
                break;
              case "s":
                arg = String(arg);
                arg = ph.precision ? arg.substring(0, ph.precision) : arg;
                break;
              case "t":
                arg = String(!!arg);
                arg = ph.precision ? arg.substring(0, ph.precision) : arg;
                break;
              case "T":
                arg = Object.prototype.toString.call(arg).slice(8, -1).toLowerCase();
                arg = ph.precision ? arg.substring(0, ph.precision) : arg;
                break;
              case "u":
                arg = parseInt(arg, 10) >>> 0;
                break;
              case "v":
                arg = arg.valueOf();
                arg = ph.precision ? arg.substring(0, ph.precision) : arg;
                break;
              case "x":
                arg = (parseInt(arg, 10) >>> 0).toString(16);
                break;
              case "X":
                arg = (parseInt(arg, 10) >>> 0).toString(16).toUpperCase();
                break;
            }
            if (re.json.test(ph.type)) {
              output += arg;
            } else {
              if (re.number.test(ph.type) && (!is_positive || ph.sign)) {
                sign = is_positive ? "+" : "-";
                arg = arg.toString().replace(re.sign, "");
              } else {
                sign = "";
              }
              pad_character = ph.pad_char ? ph.pad_char === "0" ? "0" : ph.pad_char.charAt(1) : " ";
              pad_length = ph.width - (sign + arg).length;
              pad = ph.width ? pad_length > 0 ? pad_character.repeat(pad_length) : "" : "";
              output += ph.align ? sign + arg + pad : pad_character === "0" ? sign + pad + arg : pad + sign + arg;
            }
          }
        }
        return output;
      }
      var sprintf_cache = /* @__PURE__ */ Object.create(null);
      function sprintf_parse(fmt) {
        if (sprintf_cache[fmt]) {
          return sprintf_cache[fmt];
        }
        var _fmt = fmt, match, parse_tree = [], arg_names = 0;
        while (_fmt) {
          if ((match = re.text.exec(_fmt)) !== null) {
            parse_tree.push(match[0]);
          } else if ((match = re.modulo.exec(_fmt)) !== null) {
            parse_tree.push("%");
          } else if ((match = re.placeholder.exec(_fmt)) !== null) {
            if (match[2]) {
              arg_names |= 1;
              var field_list = [], replacement_field = match[2], field_match = [];
              if ((field_match = re.key.exec(replacement_field)) !== null) {
                field_list.push(field_match[1]);
                while ((replacement_field = replacement_field.substring(field_match[0].length)) !== "") {
                  if ((field_match = re.key_access.exec(replacement_field)) !== null) {
                    field_list.push(field_match[1]);
                  } else if ((field_match = re.index_access.exec(replacement_field)) !== null) {
                    field_list.push(field_match[1]);
                  } else {
                    throw new SyntaxError("[sprintf] failed to parse named argument key");
                  }
                }
              } else {
                throw new SyntaxError("[sprintf] failed to parse named argument key");
              }
              match[2] = field_list;
            } else {
              arg_names |= 2;
            }
            if (arg_names === 3) {
              throw new Error("[sprintf] mixing positional and named placeholders is not (yet) supported");
            }
            parse_tree.push(
              {
                placeholder: match[0],
                param_no: match[1],
                keys: match[2],
                sign: match[3],
                pad_char: match[4],
                align: match[5],
                width: match[6],
                precision: match[7],
                type: match[8]
              }
            );
          } else {
            throw new SyntaxError("[sprintf] unexpected placeholder");
          }
          _fmt = _fmt.substring(match[0].length);
        }
        return sprintf_cache[fmt] = parse_tree;
      }
      {
        exports["sprintf"] = sprintf2;
        exports["vsprintf"] = vsprintf;
      }
      if (typeof window !== "undefined") {
        window["sprintf"] = sprintf2;
        window["vsprintf"] = vsprintf;
      }
    })();
  })(sprintf);
  return sprintf;
}
var sprintfExports = /* @__PURE__ */ requireSprintf();
let lang;
function useLang() {
  return lang ??= new UnicornLang();
}
function trans(id, ...args) {
  return useLang().trans(id, ...args);
}
function __(id, ...args) {
  return trans(id, ...args);
}
class UnicornLang {
  /**
   * Translate a string.
   */
  trans(id, ...args) {
    const key = this.normalize(id);
    let translated = this.get(key) || "";
    translated = this.replace(translated, args);
    return translated !== "" ? translated : this.wrapDebug(id, false);
  }
  replace(str, args) {
    let replacements = {};
    let values = [];
    for (const arg of args) {
      if (typeof arg === "object") {
        replacements = { ...replacements, ...arg };
      } else {
        values.push(arg);
      }
    }
    if (values.length) {
      str = sprintfExports.vsprintf(str, values);
    }
    if (Object.values(replacements).length) {
      for (const key in replacements) {
        let value = replacements[key];
        if (typeof value === "function") {
          value = value();
        }
        str = str.replace(new RegExp(":" + key, "g"), String(value));
      }
    }
    return str;
  }
  /**
   * Find text.
   */
  get(id) {
    const strings = this.getStrings();
    if (strings[id]) {
      return strings[id];
    }
    return null;
  }
  /**
   * Has language key.
   */
  has(key) {
    const strings = this.getStrings();
    return strings[key] !== void 0;
  }
  /**
   * Add language key.
   */
  add(key, value) {
    const strings = this.getStrings();
    strings[this.normalize(key)] = value;
    data("unicorn.languages", strings);
    return this;
  }
  /**
   * Replace all symbols to dot(.).
   */
  normalize(text) {
    return text.replace(/[^A-Z0-9]+/ig, ".");
  }
  wrapDebug(text, success) {
    if (isDebug()) {
      if (success) {
        return "**" + text + "**";
      }
      return "??" + text + "??";
    }
    return text;
  }
  getStrings() {
    return data("unicorn.languages") || {};
  }
}
function useScriptImport(src, attrs = {}) {
  const script = document.createElement("script");
  script.src = src;
  for (const key in attrs) {
    script.setAttribute(key, attrs[key]);
  }
  return new Promise((resolve, reject) => {
    script.onload = () => {
      resolve();
      document.body.removeChild(script);
    };
    script.onerror = (e) => {
      reject(e);
      document.body.removeChild(script);
    };
    document.body.appendChild(script);
  });
}
function doImport(src) {
  return import(
    /* @vite-ignore */
    src
  );
}
async function useImport(...src) {
  if (src.length === 1) {
    return doImport(src[0]);
  }
  const promises = [];
  src.forEach((link) => {
    promises.push(
      link instanceof Promise ? link : doImport(link)
    );
  });
  return Promise.all(promises);
}
async function useSeriesImport(...src) {
  const modules = [];
  for (const source of src) {
    if (Array.isArray(source)) {
      const m2 = await useImport(...source);
      modules.push(m2);
      continue;
    }
    const m = await useImport(source);
    modules.push(m);
  }
  return modules;
}
async function useCssIncludes(...hrefs) {
  const promises = hrefs.map((href) => {
    href = resolveUrl(href);
    return new Promise((resolve, reject) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.onload = () => resolve();
      link.onerror = (e) => reject(e);
      document.head.appendChild(link);
    });
  });
  return Promise.all(promises);
}
const importedSheets = {};
async function useCssImport(...hrefs) {
  const modules = await Promise.all(
    hrefs.map((href) => {
      if (importedSheets[href]) {
        return importedSheets[href];
      }
      return importedSheets[href] = simulateCssImport(href);
    })
  );
  const styles = modules.map((module2) => module2.default);
  return injectCssToDocument(...styles);
}
async function simulateCssImport(href) {
  href = resolveUrl(href);
  const response = await fetch(href);
  if (!response.ok) {
    throw new Error(`Failed to load CSS: ${href}`);
  }
  const cssText = await response.text();
  const sheet = new CSSStyleSheet();
  await sheet.replace(cssText);
  return { default: sheet };
}
let importMap;
function parseImportMap() {
  const importMapScript = document.querySelector('script[type="importmap"]');
  if (importMapScript) {
    try {
      return JSON.parse(importMapScript.textContent || "{}").imports || {};
    } catch (e) {
      console.error("Failed to parse import map:", e);
    }
  }
  return {};
}
function resolveUrl(specifier) {
  importMap ??= parseImportMap();
  for (const [prefix, target] of Object.entries(importMap)) {
    if (specifier === prefix) {
      return target;
    }
  }
  for (const [prefix, target] of Object.entries(importMap)) {
    if (specifier.startsWith(prefix)) {
      return specifier.replace(prefix, target);
    }
  }
  return specifier;
}
async function useCheckboxesMultiSelect(selector, options = {}) {
  const m = await import("./checkboxes-multi-select-BVdV_t7c.js");
  if (selector) {
    m.CheckboxesMultiSelect.handle(selector, options);
  }
  return m;
}
async function useFieldCascadeSelect() {
  const module2 = await import("./field-cascade-select-DZMCBEhx.js");
  await module2.ready;
  return module2;
}
async function useFieldFileDrag() {
  const module2 = await import("./field-file-drag-BsCrdT7c.js");
  await module2.ready;
  return module2;
}
function useFieldFlatpickr() {
  return import("./field-flatpickr-CqaUeihT.js");
}
function useFieldModalSelect() {
  return import("./field-modal-select-DA2nxgPO.js");
}
function useFieldModalTree() {
  import("./field-modal-tree-CbIV7JPG.js");
}
async function useFieldRepeatable() {
  const module2 = await import("./field-repeatable-DMrvmyxO.js");
  await module2.ready;
  return module2;
}
function useFieldSingleImageDrag() {
  return import("./field-single-image-drag-DGwefjfd.js");
}
async function useForm(ele, options = {}) {
  const { UnicornFormElement } = await import("./form-CE_fRsp7.js");
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
}
async function useFormComponent(ele, options = {}) {
  const form = await useForm(ele, options);
  await form.initComponent();
  return form;
}
async function useGrid(ele, options = {}) {
  const { UnicornGridElement } = await import("./grid-_NFRyXJV.js");
  const selector = typeof ele === "string" ? ele : "";
  const element = selectOne(ele);
  if (!element) {
    throw new Error("Element is empty");
  }
  const form = await useForm(selector || element);
  return module(
    element,
    "grid.plugin",
    () => new UnicornGridElement(selector, element, form, options)
  );
}
async function useGridComponent(ele, options = {}) {
  const grid = await useGrid(ele, options);
  await grid.initComponent();
  return grid;
}
async function useHttpClient(config) {
  const { UnicornHttpClient } = await import("./http-client-_dnqjHUX.js");
  if (config && "interceptors" in config) {
    const axios = config;
    const http = new UnicornHttpClient();
    http.axios = axios;
    return http;
  }
  return new UnicornHttpClient(config);
}
async function useLoadedHttpClient(config) {
  const http = await useHttpClient(config);
  await http.getAxiosInstance();
  return http;
}
async function useIframeModal() {
  const module2 = await import("./iframe-modal-DuOBxg0J.js");
  await module2.ready;
  return module2;
}
async function useListDependent(element, dependent, options = {}) {
  const module2 = await import("./list-dependent-CvM0qZg2.js");
  await module2.ready;
  if (element) {
    const { ListDependent } = module2;
    return ListDependent.handle(element, dependent, options);
  }
  return module2;
}
const queues = {};
function useQueue(name = "default", maxRunning = 1) {
  return queues[name] ??= createQueue(maxRunning);
}
function createQueue(maxRunning = 1) {
  return queue(maxRunning);
}
async function useS3Uploader(name, options = {}) {
  const module2 = await import("./s3-uploader-BtyH3hjx.js");
  if (!name) {
    return module2;
  }
  const { get } = module2;
  return get(name, options);
}
async function useShowOn() {
  const module2 = await import("./show-on-Dr1f5j1Q.js");
  await module2.ready;
  return module2;
}
const stacks = {};
function useStack(name = "default", store = []) {
  return stacks[name] ??= createStack(store);
}
function createStack(store = []) {
  return stack(store);
}
async function useTomSelect(selector, options = {}, theme = "bootstrap5") {
  const [m] = await wait(
    useImport("@vendor/tom-select/dist/js/tom-select.complete.min.js"),
    useCssImport(`@vendor/tom-select/dist/css/tom-select.${theme}.min.css`)
  );
  if (selector) {
    module(
      selector,
      "tom.select",
      (ele) => {
        options = mergeDeep({
          allowEmptyOption: true,
          maxOptions: null,
          plugins: {
            caret_position: {},
            clear_button: {}
          }
        }, options);
        if (ele.multiple) {
          options.plugins.remove_button = {};
        } else {
          options.plugins.dropdown_input = {};
        }
        class UnicornTomSelect extends TomSelect {
          syncOptionsWithoutKeepSelected() {
            const oldValue = ele.value;
            this.clear();
            this.clearOptions();
            this.sync();
            if (ele.value !== oldValue) {
              this.setValue(
                ele.querySelector(`option[value="${oldValue}"]`)?.value ?? ele.querySelector("option")?.value ?? "",
                true
              );
            }
          }
        }
        const t = new UnicornTomSelect(ele, options);
        ele.addEventListener("list:updated", () => {
          t.syncOptionsWithoutKeepSelected();
        });
        return t;
      }
    );
  }
  return m;
}
async function useUIBootstrap5(install = false, pushToGlobal = false) {
  const { UIBootstrap5 } = await import("./ui-bootstrap5-Bx--1GA7.js");
  const theme = UIBootstrap5.get();
  if (install) {
    useUITheme(theme);
    if (pushToGlobal) {
      theme.pushBootstrapToGlobal();
    }
  }
  return theme;
}
async function useBs5Tooltip(selector = '[data-bs-toggle="tooltip"]', config = {}) {
  const bs5 = await useUIBootstrap5();
  return bs5.tooltip(selector, config);
}
async function useBs5KeepTab(selector, options = {}) {
  const bs5 = await useUIBootstrap5();
  return bs5.keepTab(selector, options);
}
async function useBs5ButtonRadio(selector, options = {}) {
  const bs5 = await useUIBootstrap5();
  return bs5.buttonRadio(selector, options);
}
let instances = {};
async function useWebDirective(name = "unicorn", options = {}) {
  return instances[name] ??= await createWebDirective(Object.assign({}, options, { prefix: "uni-" }));
}
async function useUniDirective(name, handler, wdInstance = "unicorn") {
  const wd = typeof wdInstance === "string" ? await useWebDirective(wdInstance) : wdInstance;
  wd.register(name, handler);
}
async function createWebDirective(options = {}) {
  const WebDirective = (await import("web-directive")).default;
  const wd = new WebDirective(options);
  wd.listen();
  return wd;
}
async function useFormValidation(selector) {
  const module2 = await import("./validation-Bb7dmv1S.js");
  await module2.ready;
  if (!selector) {
    return module2;
  }
  return useFormValidationSync(selector);
}
function useFormValidationSync(selector) {
  return getBoundedInstance(selector, "form.validation");
}
function useFieldValidationSync(selector) {
  return getBoundedInstance(selector, "field.validation");
}
async function addGlobalValidator(name, validator, options = {}) {
  const { UnicornFormValidation } = await useFormValidation();
  UnicornFormValidation.addGlobalValidator(name, validator, options);
}
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
function multiUploader() {
  return useImport("@unicorn/field/multi-uploader.js");
}
function modalTree() {
  return useImport("@unicorn/field/modal-tree.js");
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
  const stack2 = useStack(stackName);
  stack2.observe((stack22, length) => {
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
function useSystemUri(type, path) {
  const uri2 = UnicornSystemUri.get();
  if (type) {
    return uri2[type](path);
  }
  return uri2;
}
function useAssetUri(type, path) {
  const asset2 = UnicornAssetUri.get();
  if (type) {
    return asset2[type](path);
  }
  return asset2;
}
function uri(type) {
  return data("unicorn.uri")[type];
}
function asset(type) {
  return uri("asset")[type];
}
function addUriBase(uri2, type = "path") {
  if (uri2.substring(0, 2) === "//" || uri2.substring(0, 4) === "http") {
    return uri2;
  }
  return asset(type) + "/" + uri2;
}
class UnicornSystemUri extends URL {
  static instance;
  static get() {
    return this.instance ??= new this(uri("full"));
  }
  path(path = "") {
    return uri("path") + path;
  }
  root(path = "") {
    return uri("root") + path;
  }
  current() {
    return uri("current") || "";
  }
  full() {
    return uri("full") || "";
  }
  route() {
    return uri("route") || "";
  }
  script() {
    return uri("script") || "";
  }
  routeWithQuery() {
    const route2 = this.route();
    const query = this.searchParams.toString();
    return query ? `${route2}?${query}` : route2;
  }
  routeAndQuery() {
    const route2 = this.route();
    const query = this.searchParams.toString();
    return [route2, query];
  }
}
class UnicornAssetUri {
  static instance;
  static get() {
    return this.instance ??= new this();
  }
  path(path = "") {
    return asset("path") + path;
  }
  root(path = "") {
    return asset("root") + path;
  }
}
function encode(obj, pfx) {
  var k, i, tmp, str = "";
  for (k in obj) {
    if ((tmp = obj[k]) !== void 0) {
      if (Array.isArray(tmp)) {
        for (i = 0; i < tmp.length; i++) {
          str && (str += "&");
          str += encodeURIComponent(k) + "=" + encodeURIComponent(tmp[i]);
        }
      } else {
        str && (str += "&");
        str += encodeURIComponent(k) + "=" + encodeURIComponent(tmp);
      }
    }
  }
  return "" + str;
}
function toValue(mix) {
  if (!mix) return "";
  var str = decodeURIComponent(mix);
  if (str === "false") return false;
  if (str === "true") return true;
  return +str * 0 === 0 ? +str : str;
}
function decode(str) {
  var tmp, k, out = {}, arr = str.split("&");
  while (tmp = arr.shift()) {
    tmp = tmp.split("=");
    k = tmp.shift();
    if (out[k] !== void 0) {
      out[k] = [].concat(out[k], toValue(tmp.shift()));
    } else {
      out[k] = toValue(tmp.shift());
    }
  }
  return out;
}
function addRoute(route2, url) {
  const routes = data("unicorn.routes") || {};
  routes[route2] = url;
  data("unicorn.routes", routes);
}
function route(route2, query) {
  const source = route2;
  const extract = extractRoute(source);
  route2 = extract.route;
  let path = extract.path;
  const routes = data("unicorn.routes") || {};
  let url = routes[route2];
  if (url == null) {
    if (!route2.startsWith("@")) {
      route2 = "@" + route2;
    } else {
      route2 = route2.substring(1);
    }
  }
  url = routes[route2];
  if (url == null) {
    throw new Error(`Route: "${source}" not found`);
  }
  if (path) {
    const { route: u1, path: u1q } = extractRoute(url, "?");
    const { route: u2, path: u2q } = extractRoute(path, "?");
    url = u1 + "/" + u2;
    if (u1q || u2q) {
      const q = [u1q, u2q].filter((u) => u).join("&");
      url += "?" + q;
    }
  }
  return addQuery(url, query);
}
function extractRoute(route2, sep = "/") {
  if (route2.indexOf(sep) === -1) {
    return { route: route2, path: "" };
  }
  const segments = route2.split(sep);
  route2 = segments.shift() || "";
  const path = segments.join(sep);
  return { route: route2, path };
}
function hasRoute(route2) {
  return void 0 !== data("unicorn.routes")[route2];
}
function addQuery(url, query) {
  if (query == null) {
    return url;
  }
  for (let k in query) {
    const v = query[k];
    const placeholder = `{${k}}`;
    if (url.indexOf(placeholder) !== -1) {
      url = url.replace(
        new RegExp(`${placeholder}`, "g"),
        v
      );
      delete query[k];
    }
    const encodedPlaceholder = encodeURIComponent(`{${k}}`);
    if (url.indexOf(encodedPlaceholder) !== -1) {
      url = url.replace(
        new RegExp(`${encodedPlaceholder}`, "g"),
        v
      );
      delete query[k];
    }
  }
  if (Object.keys(query).length === 0) {
    return url;
  }
  const queryString = encode(query);
  return url + (/\?/.test(url) ? `&${queryString}` : `?${queryString}`);
}
function parseQuery(queryString) {
  return decode(queryString);
}
function buildQuery(query) {
  return encode(query);
}
function removeCloak() {
  if (globalThis.document == null) {
    return;
  }
  selectAll("[uni-cloak]", (el) => el.removeAttribute("uni-cloak"));
}
function data(ele, name = void 0, value = void 0) {
  if (!(ele instanceof HTMLElement)) {
    value = name;
    name = ele;
    ele = document;
  }
  if (name === void 0) {
    return getData(ele);
  }
  if (value === void 0) {
    const res = getData(ele, name);
    return res;
  }
  setData(ele, name, value);
}
function removeData(ele, name = void 0) {
  if (!(ele instanceof HTMLElement)) {
    name = ele;
    ele = document;
  }
  removeData$1(ele, name);
}
const copyProps = (dest, src, exclude = []) => {
  const props = Object.getOwnPropertyDescriptors(src);
  for (let prop of exclude)
    delete props[prop];
  Object.defineProperties(dest, props);
};
const protoChain = (obj, currentChain = [obj]) => {
  const proto = Object.getPrototypeOf(obj);
  if (proto === null)
    return currentChain;
  return protoChain(proto, [...currentChain, proto]);
};
const nearestCommonProto = (...objs) => {
  if (objs.length === 0)
    return void 0;
  let commonProto = void 0;
  const protoChains = objs.map((obj) => protoChain(obj));
  while (protoChains.every((protoChain2) => protoChain2.length > 0)) {
    const protos = protoChains.map((protoChain2) => protoChain2.pop());
    const potentialCommonProto = protos[0];
    if (protos.every((proto) => proto === potentialCommonProto))
      commonProto = potentialCommonProto;
    else
      break;
  }
  return commonProto;
};
const hardMixProtos = (ingredients, constructor, exclude = []) => {
  var _a;
  const base = (_a = nearestCommonProto(...ingredients)) !== null && _a !== void 0 ? _a : Object.prototype;
  const mixedProto = Object.create(base);
  const visitedProtos = protoChain(base);
  for (let prototype of ingredients) {
    let protos = protoChain(prototype);
    for (let i = protos.length - 1; i >= 0; i--) {
      let newProto = protos[i];
      if (visitedProtos.indexOf(newProto) === -1) {
        copyProps(mixedProto, newProto, ["constructor", ...exclude]);
        visitedProtos.push(newProto);
      }
    }
  }
  mixedProto.constructor = constructor;
  return mixedProto;
};
const unique = (arr) => arr.filter((e, i) => arr.indexOf(e) == i);
const mixins = /* @__PURE__ */ new WeakMap();
const getMixinsForClass = (clazz) => mixins.get(clazz);
const registerMixins = (mixedClass, constituents) => mixins.set(mixedClass, constituents);
const mergeObjectsOfDecorators = (o1, o2) => {
  var _a, _b;
  const allKeys = unique([...Object.getOwnPropertyNames(o1), ...Object.getOwnPropertyNames(o2)]);
  const mergedObject = {};
  for (let key of allKeys)
    mergedObject[key] = unique([...(_a = o1 === null || o1 === void 0 ? void 0 : o1[key]) !== null && _a !== void 0 ? _a : [], ...(_b = o2 === null || o2 === void 0 ? void 0 : o2[key]) !== null && _b !== void 0 ? _b : []]);
  return mergedObject;
};
const mergePropertyAndMethodDecorators = (d1, d2) => {
  var _a, _b, _c, _d;
  return {
    property: mergeObjectsOfDecorators((_a = d1 === null || d1 === void 0 ? void 0 : d1.property) !== null && _a !== void 0 ? _a : {}, (_b = d2 === null || d2 === void 0 ? void 0 : d2.property) !== null && _b !== void 0 ? _b : {}),
    method: mergeObjectsOfDecorators((_c = d1 === null || d1 === void 0 ? void 0 : d1.method) !== null && _c !== void 0 ? _c : {}, (_d = d2 === null || d2 === void 0 ? void 0 : d2.method) !== null && _d !== void 0 ? _d : {})
  };
};
const mergeDecorators = (d1, d2) => {
  var _a, _b, _c, _d, _e, _f;
  return {
    class: unique([...(_a = d1 === null || d1 === void 0 ? void 0 : d1.class) !== null && _a !== void 0 ? _a : [], ...(_b = d2 === null || d2 === void 0 ? void 0 : d2.class) !== null && _b !== void 0 ? _b : []]),
    static: mergePropertyAndMethodDecorators((_c = d1 === null || d1 === void 0 ? void 0 : d1.static) !== null && _c !== void 0 ? _c : {}, (_d = d2 === null || d2 === void 0 ? void 0 : d2.static) !== null && _d !== void 0 ? _d : {}),
    instance: mergePropertyAndMethodDecorators((_e = d1 === null || d1 === void 0 ? void 0 : d1.instance) !== null && _e !== void 0 ? _e : {}, (_f = d2 === null || d2 === void 0 ? void 0 : d2.instance) !== null && _f !== void 0 ? _f : {})
  };
};
const decorators = /* @__PURE__ */ new Map();
const findAllConstituentClasses = (...classes) => {
  var _a;
  const allClasses = /* @__PURE__ */ new Set();
  const frontier = /* @__PURE__ */ new Set([...classes]);
  while (frontier.size > 0) {
    for (let clazz of frontier) {
      const protoChainClasses = protoChain(clazz.prototype).map((proto) => proto.constructor);
      const mixinClasses = (_a = getMixinsForClass(clazz)) !== null && _a !== void 0 ? _a : [];
      const potentiallyNewClasses = [...protoChainClasses, ...mixinClasses];
      const newClasses = potentiallyNewClasses.filter((c) => !allClasses.has(c));
      for (let newClass of newClasses)
        frontier.add(newClass);
      allClasses.add(clazz);
      frontier.delete(clazz);
    }
  }
  return [...allClasses];
};
const deepDecoratorSearch = (...classes) => {
  const decoratorsForClassChain = findAllConstituentClasses(...classes).map((clazz) => decorators.get(clazz)).filter((decorators2) => !!decorators2);
  if (decoratorsForClassChain.length == 0)
    return {};
  if (decoratorsForClassChain.length == 1)
    return decoratorsForClassChain[0];
  return decoratorsForClassChain.reduce((d1, d2) => mergeDecorators(d1, d2));
};
function Mixin(...constructors) {
  var _a, _b, _c;
  const prototypes = constructors.map((constructor) => constructor.prototype);
  function MixedClass(...args) {
    for (const constructor of constructors)
      copyProps(this, new constructor(...args));
  }
  MixedClass.prototype = hardMixProtos(prototypes, MixedClass);
  Object.setPrototypeOf(
    MixedClass,
    hardMixProtos(constructors, null, ["prototype"])
  );
  let DecoratedMixedClass = MixedClass;
  {
    const classDecorators = deepDecoratorSearch(...constructors);
    for (let decorator of (_a = classDecorators === null || classDecorators === void 0 ? void 0 : classDecorators.class) !== null && _a !== void 0 ? _a : []) {
      const result = decorator(DecoratedMixedClass);
      if (result) {
        DecoratedMixedClass = result;
      }
    }
    applyPropAndMethodDecorators((_b = classDecorators === null || classDecorators === void 0 ? void 0 : classDecorators.static) !== null && _b !== void 0 ? _b : {}, DecoratedMixedClass);
    applyPropAndMethodDecorators((_c = classDecorators === null || classDecorators === void 0 ? void 0 : classDecorators.instance) !== null && _c !== void 0 ? _c : {}, DecoratedMixedClass.prototype);
  }
  registerMixins(DecoratedMixedClass, constructors);
  return DecoratedMixedClass;
}
const applyPropAndMethodDecorators = (propAndMethodDecorators, target) => {
  const propDecorators = propAndMethodDecorators.property;
  const methodDecorators = propAndMethodDecorators.method;
  if (propDecorators)
    for (let key in propDecorators)
      for (let decorator of propDecorators[key])
        decorator(target, key);
  if (methodDecorators)
    for (let key in methodDecorators)
      for (let decorator of methodDecorators[key])
        decorator(target, key, Object.getOwnPropertyDescriptor(target, key));
};
class EventMixin {
  _listeners = {};
  on(event, handler) {
    if (Array.isArray(event)) {
      for (const e of event) {
        this.on(e, handler);
      }
      return this;
    }
    this._listeners[event] ??= [];
    this._listeners[event].push(handler);
    return this;
  }
  once(event, handler) {
    handler.once = true;
    return this.on(event, handler);
  }
  off(event, handler) {
    if (handler) {
      this._listeners[event] = this.listeners(event).filter((listener) => listener !== handler);
      return this;
    }
    delete this._listeners[event];
    return this;
  }
  trigger(event, ...args) {
    if (Array.isArray(event)) {
      for (const e of event) {
        this.trigger(e);
      }
      return this;
    }
    for (const listener of this.listeners(event)) {
      listener(...args);
    }
    this._listeners[event] = this.listeners(event).filter((listener) => listener?.once !== true);
    return this;
  }
  listeners(event) {
    return this._listeners[event] === void 0 ? [] : this._listeners[event];
  }
}
class EventBus extends (/* @__PURE__ */ Mixin(EventMixin)) {
}
class UnicornApp extends (/* @__PURE__ */ Mixin(EventMixin)) {
  registry = /* @__PURE__ */ new Map();
  plugins = /* @__PURE__ */ new Map();
  // _listeners = {};
  waits = [];
  options;
  defaultOptions = {};
  domready = domready;
  data = data;
  constructor(options = {}) {
    super();
    this.options = Object.assign({}, this.defaultOptions, options);
    if (typeof document !== "undefined") {
      this.wait((resolve) => {
        document.addEventListener("DOMContentLoaded", () => resolve());
      });
      document.addEventListener("DOMContentLoaded", () => {
        this.completed().then(() => this.trigger("loaded"));
      });
    }
  }
  use(plugin, options = {}) {
    if (Array.isArray(plugin)) {
      plugin.forEach((p) => this.use(p));
      return this;
    }
    plugin?.install?.(this, options);
    this.trigger("plugin.installed", plugin);
    this.plugins.set(plugin, plugin);
    return this;
  }
  detach(plugin) {
    if (plugin.uninstall) {
      plugin.uninstall(this);
    }
    this.trigger("plugin.uninstalled", plugin);
    return this;
  }
  inject(id, def) {
    if (!typeof this.registry.has(id)) {
      if (def !== void 0) {
        return def;
      }
      throw new Error(`Injectable: ${id.name} not found.`);
    }
    return this.registry.get(id);
  }
  provide(id, value) {
    this.registry.set(id, value);
    return this;
  }
  // trigger(event, ...args) {
  //   return this.tap(super.trigger(event, ...args), () => {
  //     if (this.data('windwalker.debug')) {
  //       console.debug(`[Unicorn Event] ${event}`, args, this.listeners(event));
  //     }
  //   });
  // }
  wait(callback) {
    const p = new Promise((resolve, reject) => {
      const promise = callback(resolve, reject);
      if (promise && "then" in promise) {
        promise.then(resolve).catch(reject);
      }
    });
    this.waits.push(p);
    return p;
  }
  completed() {
    const promise = Promise.all(this.waits);
    this.waits = [];
    return promise;
  }
}
function formRequestSubmit(prototype) {
  if (typeof prototype.requestSubmit == "function") {
    return;
  }
  prototype.requestSubmit = function(submitter) {
    if (submitter) {
      validateSubmitter(submitter, this);
      submitter.click();
    } else {
      submitter = document.createElement("input");
      submitter.type = "submit";
      submitter.hidden = true;
      this.appendChild(submitter);
      submitter.click();
      this.removeChild(submitter);
    }
  };
  function validateSubmitter(submitter, form) {
    submitter instanceof HTMLElement || raise(TypeError, "parameter 1 is not of type 'HTMLElement'");
    submitter.type == "submit" || raise(TypeError, "The specified element is not a submit button");
    submitter.form == form || raise(DOMException, "The specified element is not owned by this form element", "NotFoundError");
  }
  function raise(errorConstructor, message, name) {
    throw new errorConstructor("Failed to execute 'requestSubmit' on 'HTMLFormElement': " + message + ".", name);
  }
}
function polyfill() {
  if (typeof window !== "undefined") {
    formRequestSubmit(HTMLFormElement.prototype);
  }
}
async function useFieldMultiUploader() {
  await import("./field-multi-uploader-C7hKG2ei.js");
}
async function useTinymce(selector, options = {}) {
  const { get } = await import("./tinymce-BJ3cLOg4.js");
  return get(selector, options);
}
function useUnicornPhpAdapter(app2) {
  app2 ??= useUnicorn();
  app2.use(UnicornPhpAdapter);
  return app2.$ui;
}
const methods = {
  repeatable: useFieldRepeatable,
  flatpickr: useFieldFlatpickr,
  fileDrag: useFieldFileDrag,
  modalField: useFieldModalSelect,
  cascadeSelect: useFieldCascadeSelect,
  sid: useFieldSingleImageDrag,
  tinymce: {
    init: useTinymce
  },
  iframeModal: useIframeModal,
  initShowOn: useShowOn,
  modalTree: useFieldModalTree,
  multiUploader: useFieldMultiUploader
};
class UnicornPhpAdapter {
  static install(app2) {
    if (app2.$ui) {
      app2.$ui = { ...app2.$ui, ...methods };
    } else {
      app2.$ui = methods;
    }
  }
}
let app;
function createUnicorn() {
  polyfill();
  removeCloak();
  return app = new UnicornApp();
}
function createUnicornWithPlugins() {
  const app2 = createUnicorn();
  return app2;
}
function useUnicorn(instance) {
  if (instance) {
    app = instance;
  }
  return app ??= createUnicorn();
}
function useInject(id, def) {
  return useUnicorn().inject(id, def);
}
function pushUnicornToGlobal(app2) {
  window.u = app2 ?? useUnicorn();
}
export {
  debounce as $,
  getBoundedInstance as A,
  fadeIn as B,
  fadeOut as C,
  trans as D,
  EventMixin as E,
  useUITheme as F,
  useStack as G,
  sleep as H,
  createUnicorn as I,
  createUnicornWithPlugins as J,
  useUnicorn as K,
  useInject as L,
  Mixin as M,
  pushUnicornToGlobal as N,
  removeData as O,
  EventBus as P,
  animateTo as Q,
  base64UrlEncode as R,
  base64UrlDecode as S,
  tid as T,
  randomBytes as U,
  randomBytesString as V,
  serial as W,
  domready as X,
  getBoundedInstanceList as Y,
  delegate as Z,
  __ as _,
  selectOne as a,
  addGlobalValidator as a$,
  throttle as a0,
  isDebug as a1,
  nextTick as a2,
  wait as a3,
  useLang as a4,
  useScriptImport as a5,
  doImport as a6,
  useSeriesImport as a7,
  useCssIncludes as a8,
  AlertAdapter as a9,
  useFieldCascadeSelect as aA,
  useFieldFileDrag as aB,
  useFieldFlatpickr as aC,
  useFieldModalSelect as aD,
  useFieldModalTree as aE,
  useFieldRepeatable as aF,
  useFieldSingleImageDrag as aG,
  useForm as aH,
  useFormComponent as aI,
  useGrid as aJ,
  useGridComponent as aK,
  useIframeModal as aL,
  useListDependent as aM,
  useQueue as aN,
  createQueue as aO,
  useS3Uploader as aP,
  useShowOn as aQ,
  createStack as aR,
  useTomSelect as aS,
  useUIBootstrap5 as aT,
  useBs5Tooltip as aU,
  useBs5KeepTab as aV,
  useBs5ButtonRadio as aW,
  useWebDirective as aX,
  useFormValidation as aY,
  useFormValidationSync as aZ,
  useFieldValidationSync as a_,
  useUI as aa,
  UnicornUI as ab,
  prepareAlpine as ac,
  renderMessage as ad,
  clearMessages as ae,
  notify as af,
  clearNotifies as ag,
  mark as ah,
  multiUploader as ai,
  modalTree as aj,
  slideToggle as ak,
  useColorPicker as al,
  useDisableOnSubmit as am,
  useDisableIfStackNotEmpty as an,
  useKeepAlive as ao,
  useVueComponentField as ap,
  useAssetUri as aq,
  addUriBase as ar,
  UnicornSystemUri as as,
  UnicornAssetUri as at,
  addRoute as au,
  hasRoute as av,
  addQuery as aw,
  parseQuery as ax,
  buildQuery as ay,
  useCheckboxesMultiSelect as az,
  module as b,
  useUnicornPhpAdapter as b0,
  UnicornPhpAdapter as b1,
  useLoadedHttpClient as c,
  useUniDirective as d,
  simpleAlert as e,
  injectCssToDocument as f,
  useImport as g,
  html as h,
  initAlpineComponent as i,
  useCssImport as j,
  highlight as k,
  data as l,
  mergeDeep as m,
  slideUp as n,
  forceArray as o,
  prepareAlpineDefer as p,
  useHttpClient as q,
  useSystemUri as r,
  selectAll as s,
  loadAlpine as t,
  uid as u,
  slideDown as v,
  h as w,
  simpleConfirm as x,
  deleteConfirm as y,
  route as z
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pY29ybi1ENWNYUWVTSy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxpdGllcy9hcnIudHMiLCIuLi8uLi9zcmMvdXRpbGl0aWVzL2RhdGEudHMiLCIuLi8uLi9zcmMvc2VydmljZS9kb20udHMiLCIuLi8uLi9zcmMvc2VydmljZS9hbmltYXRlLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BseXJhc29mdC90cy10b29sa2l0L3NyYy9nZW5lcmljL2FsZXJ0LWFkYXB0ZXIudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGx5cmFzb2Z0L3RzLXRvb2xraXQvc3JjL2dlbmVyaWMvYWxlcnQudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGx5cmFzb2Z0L3RzLXRvb2xraXQvc3JjL2dlbmVyaWMvZW52LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BseXJhc29mdC90cy10b29sa2l0L3NyYy9nZW5lcmljL2NyeXB0by50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AbHlyYXNvZnQvdHMtdG9vbGtpdC9zcmMvZ2VuZXJpYy9xdWV1ZS50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AbHlyYXNvZnQvdHMtdG9vbGtpdC9zcmMvZ2VuZXJpYy9zdGFjay50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AbHlyYXNvZnQvdHMtdG9vbGtpdC9zcmMvZ2VuZXJpYy90aW1pbmcudHMiLCIuLi8uLi9zcmMvc2VydmljZS9jcnlwdG8udHMiLCIuLi8uLi9zcmMvc2VydmljZS9oZWxwZXIudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ByaW50Zi1qcy9zcmMvc3ByaW50Zi5qcyIsIi4uLy4uL3NyYy9zZXJ2aWNlL2xhbmcudHMiLCIuLi8uLi9zcmMvc2VydmljZS9sb2FkZXIudHMiLCIuLi8uLi9zcmMvY29tcG9zYWJsZS91c2VDaGVja2JveGVzTXVsdGlTZWxlY3QudHMiLCIuLi8uLi9zcmMvY29tcG9zYWJsZS91c2VGaWVsZENhc2NhZGVTZWxlY3QudHMiLCIuLi8uLi9zcmMvY29tcG9zYWJsZS91c2VGaWVsZEZpbGVEcmFnLnRzIiwiLi4vLi4vc3JjL2NvbXBvc2FibGUvdXNlRmllbGRGbGF0cGlja3IudHMiLCIuLi8uLi9zcmMvY29tcG9zYWJsZS91c2VGaWVsZE1vZGFsU2VsZWN0LnRzIiwiLi4vLi4vc3JjL2NvbXBvc2FibGUvdXNlRmllbGRNb2RhbFRyZWUudHMiLCIuLi8uLi9zcmMvY29tcG9zYWJsZS91c2VGaWVsZFJlcGVhdGFibGUudHMiLCIuLi8uLi9zcmMvY29tcG9zYWJsZS91c2VGaWVsZFNpbmdsZUltYWdlRHJhZy50cyIsIi4uLy4uL3NyYy9jb21wb3NhYmxlL3VzZUZvcm0udHMiLCIuLi8uLi9zcmMvY29tcG9zYWJsZS91c2VHcmlkLnRzIiwiLi4vLi4vc3JjL2NvbXBvc2FibGUvdXNlSHR0cC50cyIsIi4uLy4uL3NyYy9jb21wb3NhYmxlL3VzZUlmcmFtZU1vZGFsLnRzIiwiLi4vLi4vc3JjL2NvbXBvc2FibGUvdXNlTGlzdERlcGVuZGVudC50cyIsIi4uLy4uL3NyYy9jb21wb3NhYmxlL3VzZVF1ZXVlLnRzIiwiLi4vLi4vc3JjL2NvbXBvc2FibGUvdXNlUzNVcGxvYWRlci50cyIsIi4uLy4uL3NyYy9jb21wb3NhYmxlL3VzZVNob3dPbi50cyIsIi4uLy4uL3NyYy9jb21wb3NhYmxlL3VzZVN0YWNrLnRzIiwiLi4vLi4vc3JjL2NvbXBvc2FibGUvdXNlVG9tU2VsZWN0LnRzIiwiLi4vLi4vc3JjL2NvbXBvc2FibGUvdXNlVUlCb290c3RyYXA1LnRzIiwiLi4vLi4vc3JjL2NvbXBvc2FibGUvdXNlVW5pRGlyZWN0aXZlLnRzIiwiLi4vLi4vc3JjL2NvbXBvc2FibGUvdXNlVmFsaWRhdGlvbi50cyIsIi4uLy4uL3NyYy9zZXJ2aWNlL3VpLnRzIiwiLi4vLi4vc3JjL3NlcnZpY2UvdXJpLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Fzcy9kaXN0L3Fzcy5tanMiLCIuLi8uLi9zcmMvc2VydmljZS9yb3V0ZXIudHMiLCIuLi8uLi9zcmMvdXRpbGl0aWVzL2Jhc2UudHMiLCIuLi8uLi9zcmMvZGF0YS50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy90cy1taXhlci9kaXN0L2VzbS9pbmRleC5qcyIsIi4uLy4uL3NyYy9ldmVudHMudHMiLCIuLi8uLi9zcmMvYXBwLnRzIiwiLi4vLi4vc3JjL3BvbHlmaWxsL2Zvcm0tcmVxdWVzdC1zdWJtaXQudHMiLCIuLi8uLi9zcmMvcG9seWZpbGwvaW5kZXgudHMiLCIuLi8uLi9zcmMvY29tcG9zYWJsZS91c2VGaWVsZE11bHRpVXBsb2FkZXIudHMiLCIuLi8uLi9zcmMvY29tcG9zYWJsZS91c2VUaW55bWNlLnRzIiwiLi4vLi4vc3JjL3BsdWdpbi9waHAtYWRhcHRlci50cyIsIi4uLy4uL3NyYy91bmljb3JuLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlxuZXhwb3J0IGZ1bmN0aW9uIGlzUGxhaW5PYmplY3QodmFsOiBhbnkpOiB2YWwgaXMgUmVjb3JkPHN0cmluZywgYW55PiB7XG4gIHJldHVybiB2YWwgJiYgdHlwZW9mIHZhbCA9PT0gXCJvYmplY3RcIiAmJiAhQXJyYXkuaXNBcnJheSh2YWwpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VEZWVwPFQgPSBSZWNvcmQ8c3RyaW5nLCBhbnk+Pih0YXJnZXQ6IFBhcnRpYWw8VD4sIC4uLnNvdXJjZXM6IGFueVtdKTogVCB7XG4gIGxldCBvdXQ6IGFueSA9IGlzUGxhaW5PYmplY3QodGFyZ2V0KSA/IHsgLi4udGFyZ2V0IH0gOiB0YXJnZXQ7XG5cbiAgZm9yIChjb25zdCBzb3VyY2Ugb2Ygc291cmNlcykge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHNvdXJjZSkpIHtcbiAgICAgIG91dCA9IChBcnJheS5pc0FycmF5KG91dCkgPyBvdXQuY29uY2F0KHNvdXJjZSkgOiBzb3VyY2UpIGFzIFQ7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKGlzUGxhaW5PYmplY3Qoc291cmNlKSkge1xuICAgICAgb3V0ID0geyAuLi4oaXNQbGFpbk9iamVjdChvdXQpID8gb3V0IDoge30pIH07XG4gICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhzb3VyY2UpKSB7XG4gICAgICAgIG91dFtrZXldID1cbiAgICAgICAgICBrZXkgaW4gb3V0ID8gbWVyZ2VEZWVwKG91dFtrZXldLCBzb3VyY2Vba2V5XSkgOiBzb3VyY2Vba2V5XTtcbiAgICAgIH1cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBvdXQgPSBzb3VyY2UgYXMgVDtcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuIiwiXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGF0YShlbGVtZW50OiBFbGVtZW50LCBuYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQpIHtcbiAgcHJlcGFyZURhdGEoZWxlbWVudCk7XG5cbiAgaWYgKG5hbWUgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBlbGVtZW50Ll9fdW5pY29ybjtcbiAgfVxuXG4gIHJldHVybiBlbGVtZW50Ll9fdW5pY29ybltuYW1lXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldERhdGEoZWxlbWVudDogRWxlbWVudCwgbmFtZTogc3RyaW5nLCB2YWx1ZTogYW55KSB7XG4gIHByZXBhcmVEYXRhKGVsZW1lbnQpO1xuICBlbGVtZW50Ll9fdW5pY29ybltuYW1lXSA9IHZhbHVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVmRGF0YShlbGVtZW50OiBFbGVtZW50LCBuYW1lOiBzdHJpbmcsIGRlZkNhbGxiYWNrOiBGdW5jdGlvbikge1xuICBwcmVwYXJlRGF0YShlbGVtZW50KTtcbiAgZWxlbWVudC5fX3VuaWNvcm5bbmFtZV0gPSBlbGVtZW50Ll9fdW5pY29ybltuYW1lXSB8fCBkZWZDYWxsYmFjayhlbGVtZW50KTtcblxuICByZXR1cm4gZWxlbWVudC5fX3VuaWNvcm5bbmFtZV07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVEYXRhKGVsZW1lbnQ6IEVsZW1lbnQsIG5hbWU6IHN0cmluZykge1xuICBwcmVwYXJlRGF0YShlbGVtZW50KTtcblxuICBjb25zdCB2ID0gZWxlbWVudC5fX3VuaWNvcm5bbmFtZV07XG4gIGRlbGV0ZSBlbGVtZW50Ll9fdW5pY29ybltuYW1lXTtcblxuICByZXR1cm4gdjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByZXBhcmVEYXRhPFQgZXh0ZW5kcyBOb2RlPihlbGVtZW50OiBUKTogVCB7XG4gIGlmICghZWxlbWVudCkge1xuICAgIHJldHVybiBlbGVtZW50O1xuICB9XG5cbiAgZWxlbWVudC5fX3VuaWNvcm4gPSBlbGVtZW50Ll9fdW5pY29ybiB8fCB7fTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgaW50ZXJmYWNlIE5vZGUge1xuICAgIF9fdW5pY29ybj86IGFueTtcbiAgfVxufVxuXG5cbiIsImltcG9ydCB7IGRlZkRhdGEgfSBmcm9tICcuLi91dGlsaXRpZXMnO1xuXG4vKipcbiAqIEBzZWUgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzk4OTk3MDFcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRvbXJlYWR5KGNhbGxiYWNrPzogKCh2YWx1ZTogYW55KSA9PiBhbnkpKTogUHJvbWlzZTx2b2lkPiB7XG4gIGxldCBwcm9taXNlID0gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUpID0+IHtcbiAgICAvLyBzZWUgaWYgRE9NIGlzIGFscmVhZHkgYXZhaWxhYmxlXG4gICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZScgfHwgZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2ludGVyYWN0aXZlJykge1xuICAgICAgLy8gY2FsbCBvbiBuZXh0IGF2YWlsYWJsZSB0aWNrXG4gICAgICBzZXRUaW1lb3V0KHJlc29sdmUsIDApO1xuICAgIH0gZWxzZSB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4gcmVzb2x2ZSgpKTtcbiAgICB9XG4gIH0pO1xuXG4gIGlmIChjYWxsYmFjaykge1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oY2FsbGJhY2spO1xuICB9XG5cbiAgcmV0dXJuIHByb21pc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RPbmU8SyBleHRlbmRzIGtleW9mIEhUTUxFbGVtZW50VGFnTmFtZU1hcD4oZWxlOiBLKTogSFRNTEVsZW1lbnRUYWdOYW1lTWFwW0tdIHwgbnVsbDtcbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RPbmU8RSBleHRlbmRzIEVsZW1lbnQgPSBFbGVtZW50PihlbGU6IHN0cmluZyk6IEUgfCBudWxsO1xuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdE9uZTxFIGV4dGVuZHMgRWxlbWVudCA9IEVsZW1lbnQ+KGVsZTogRSk6IEU7XG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0T25lPEUgZXh0ZW5kcyBFbGVtZW50ID0gRWxlbWVudD4oZWxlOiBzdHJpbmcgfCBFKTogRSB8IG51bGw7XG4vLyBzZWxlY3RPbmUoZWxlOiBzdHJpbmcpOiBFbGVtZW50O1xuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdE9uZTxFIGV4dGVuZHMgRWxlbWVudCA9IEVsZW1lbnQ+KGVsZTogRSB8IHN0cmluZyk6IEUgfCBudWxsIHtcbiAgbGV0IHI6IEUgfCBudWxsO1xuXG4gIGlmICh0eXBlb2YgZWxlID09PSAnc3RyaW5nJykge1xuICAgIHIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEU+KGVsZSk7XG4gIH0gZWxzZSB7XG4gICAgciA9IGVsZTtcbiAgfVxuXG4gIGlmICghcikge1xuICAgIHJldHVybiByO1xuICB9XG5cbiAgcmV0dXJuIHI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RBbGw8RSBleHRlbmRzIEVsZW1lbnQgPSBFbGVtZW50PihlbGU6IHN0cmluZywgY2FsbGJhY2s/OiAoKGVsZTogRSkgPT4gYW55KSk6IEVbXTtcbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RBbGw8RSBleHRlbmRzIEVsZW1lbnQgPSBFbGVtZW50PihlbGU6IE5vZGVMaXN0T2Y8RT4gfCBFW10sIGNhbGxiYWNrPzogKChlbGU6IEUpID0+IGFueSkpOiBFW107XG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0QWxsPEUgZXh0ZW5kcyBFbGVtZW50ID0gRWxlbWVudD4oXG4gIGVsZTogc3RyaW5nIHwgTm9kZUxpc3RPZjxFPiB8IEVbXSxcbiAgY2FsbGJhY2s/OiAoKGVsZTogRSkgPT4gYW55KVxuKTogRVtdO1xuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdEFsbDxFIGV4dGVuZHMga2V5b2YgSFRNTEVsZW1lbnRUYWdOYW1lTWFwPihcbiAgZWxlOiBFLFxuICBjYWxsYmFjaz86ICgoZWxlOiBIVE1MRWxlbWVudFRhZ05hbWVNYXBbRV0pID0+IGFueSlcbik6IEhUTUxFbGVtZW50VGFnTmFtZU1hcFtFXVtdO1xuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdEFsbChcbiAgZWxlOiBOb2RlTGlzdE9mPEVsZW1lbnQ+IHwgRWxlbWVudFtdIHwgc3RyaW5nLFxuICBjYWxsYmFjazogKChlbDogRWxlbWVudCkgPT4gYW55KSB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZFxuKTogRWxlbWVudFtdIHtcbiAgaWYgKHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnKSB7XG4gICAgZWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChlbGUpO1xuICB9XG5cbiAgY29uc3QgcmVzdWx0U2V0OiBFbGVtZW50W10gPSBbXS5zbGljZS5jYWxsKGVsZSk7XG5cbiAgaWYgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHJlc3VsdFNldC5tYXAoKGVsKSA9PiBjYWxsYmFjayhlbCkgfHwgZWwpO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdFNldDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEJvdW5kZWRJbnN0YW5jZTxUID0gYW55LCBFID0gRWxlbWVudD4oc2VsZWN0b3I6IEUsIG5hbWU6IHN0cmluZywgY2FsbGJhY2s/OiAoKGVsOiBFKSA9PiBhbnkpKTogVDtcbmV4cG9ydCBmdW5jdGlvbiBnZXRCb3VuZGVkSW5zdGFuY2U8VCA9IGFueSwgRSBleHRlbmRzIEVsZW1lbnQgPSBFbGVtZW50PihcbiAgc2VsZWN0b3I6IHN0cmluZyB8IEUsXG4gIG5hbWU6IHN0cmluZyxcbiAgY2FsbGJhY2s/OiAoKGVsOiBFKSA9PiBhbnkpXG4pOiBUIHwgbnVsbDtcbmV4cG9ydCBmdW5jdGlvbiBnZXRCb3VuZGVkSW5zdGFuY2U8VCA9IGFueSwgRSBleHRlbmRzIEVsZW1lbnQgPSBFbGVtZW50PihzZWxlY3Rvcjogc3RyaW5nIHwgRSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgoZWw6IEUpID0+IGFueSkgPSAoKSA9PiBudWxsKTogVCB8IG51bGwge1xuICBjb25zdCBlbGVtZW50ID0gdHlwZW9mIHNlbGVjdG9yID09PSAnc3RyaW5nJyA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8RT4oc2VsZWN0b3IpIDogc2VsZWN0b3I7XG5cbiAgaWYgKCFlbGVtZW50KSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gZGVmRGF0YShlbGVtZW50LCBuYW1lLCBjYWxsYmFjayk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRCb3VuZGVkSW5zdGFuY2VMaXN0PFQgPSBhbnksIEUgZXh0ZW5kcyBFbGVtZW50ID0gRWxlbWVudD4oXG4gIHNlbGVjdG9yOiBzdHJpbmcgfCBOb2RlTGlzdE9mPEU+LFxuICBuYW1lOiBzdHJpbmcsXG4gIGNhbGxiYWNrOiAoKGVsOiBFKSA9PiBhbnkpID0gKCkgPT4gbnVsbFxuKTogKFQgfCBudWxsKVtdIHtcbiAgY29uc3QgaXRlbXMgPSB0eXBlb2Ygc2VsZWN0b3IgPT09ICdzdHJpbmcnID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxFPihzZWxlY3RvcikgOiBzZWxlY3RvcjtcblxuICByZXR1cm4gQXJyYXkuZnJvbShpdGVtcykubWFwKChlbGU6IEUpID0+IGdldEJvdW5kZWRJbnN0YW5jZShlbGUsIG5hbWUsIGNhbGxiYWNrKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtb2R1bGU8VCA9IGFueSwgRSBleHRlbmRzIEVsZW1lbnQgPSBFbGVtZW50PihcbiAgZWxlOiBzdHJpbmcsXG4gIG5hbWU6IHN0cmluZyxcbiAgY2FsbGJhY2s/OiAoKGVsOiBFKSA9PiBhbnkpXG4pOiAoVCB8IG51bGwpW107XG5leHBvcnQgZnVuY3Rpb24gbW9kdWxlPFQgPSBhbnksIEUgZXh0ZW5kcyBFbGVtZW50ID0gRWxlbWVudD4oXG4gIGVsZTogTm9kZUxpc3RPZjxFbGVtZW50PixcbiAgbmFtZTogc3RyaW5nLFxuICBjYWxsYmFjaz86ICgoZWw6IEUpID0+IGFueSkpOiAoVCB8IG51bGwpW107XG5leHBvcnQgZnVuY3Rpb24gbW9kdWxlPFQgPSBhbnksIEUgZXh0ZW5kcyBFbGVtZW50ID0gRWxlbWVudD4oXG4gIGVsZTogRWxlbWVudCxcbiAgbmFtZTogc3RyaW5nLFxuICBjYWxsYmFjaz86ICgoZWw6IEUpID0+IGFueSlcbik6IFQgfCBudWxsO1xuZXhwb3J0IGZ1bmN0aW9uIG1vZHVsZTxUID0gYW55LCBFIGV4dGVuZHMgRWxlbWVudCA9IEVsZW1lbnQ+KFxuICBlbGU6IHN0cmluZyB8IEVsZW1lbnQgfCBOb2RlTGlzdE9mPEVsZW1lbnQ+LFxuICBuYW1lOiBzdHJpbmcsXG4gIGNhbGxiYWNrPzogKChlbDogRSkgPT4gYW55KVxuKTogKFQgfCBudWxsKVtdIHwgVCB8IG51bGw7XG5leHBvcnQgZnVuY3Rpb24gbW9kdWxlPFQgPSBhbnksIEUgZXh0ZW5kcyBFbGVtZW50ID0gRWxlbWVudD4oXG4gIGVsZTogc3RyaW5nIHwgRSB8IE5vZGVMaXN0T2Y8RT4sXG4gIG5hbWU6IHN0cmluZyxcbiAgY2FsbGJhY2s6ICgoZWw6IEUpID0+IGFueSkgPSAoKSA9PiBudWxsXG4pOiAoVCB8IG51bGwpW10gfCBUIHwgbnVsbCB7XG4gIGlmICh0eXBlb2YgZWxlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBnZXRCb3VuZGVkSW5zdGFuY2VMaXN0PFQsIEU+KGVsZSwgbmFtZSwgY2FsbGJhY2spO1xuICB9XG5cbiAgaWYgKGVsZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgcmV0dXJuIGdldEJvdW5kZWRJbnN0YW5jZTxULCBFPihlbGUsIG5hbWUsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIHJldHVybiBnZXRCb3VuZGVkSW5zdGFuY2VMaXN0PFQsIEU+KGVsZSBhcyBOb2RlTGlzdE9mPEU+LCBuYW1lLCBjYWxsYmFjayk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoPFQgZXh0ZW5kcyBrZXlvZiBIVE1MRWxlbWVudFRhZ05hbWVNYXA+KFxuICBlbGVtZW50OiBULFxuICBhdHRycz86IFJlY29yZDxzdHJpbmcsIGFueT4sXG4gIGNvbnRlbnQ/OiBhbnlcbik6IEhUTUxFbGVtZW50VGFnTmFtZU1hcFtUXVxuZXhwb3J0IGZ1bmN0aW9uIGgoZWxlbWVudDogc3RyaW5nLCBhdHRyczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9LCBjb250ZW50OiBhbnkgPSB1bmRlZmluZWQpOiBIVE1MRWxlbWVudCB7XG4gIGNvbnN0IGVsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZWxlbWVudCk7XG5cbiAgZm9yIChsZXQgaSBpbiBhdHRycykge1xuICAgIGNvbnN0IHYgPSBhdHRyc1tpXTtcblxuICAgIGVsZS5zZXRBdHRyaWJ1dGUoaSwgdik7XG4gIH1cblxuICBpZiAoY29udGVudCAhPT0gbnVsbCkge1xuICAgIGVsZS5pbm5lckhUTUwgPSBjb250ZW50O1xuICB9XG5cbiAgcmV0dXJuIGVsZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGh0bWw8VCBleHRlbmRzIEVsZW1lbnQgPSBIVE1MRWxlbWVudD4oaHRtbDogc3RyaW5nKTogVCB7XG4gIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBkaXYuaW5uZXJIVE1MID0gaHRtbDtcbiAgcmV0dXJuIGRpdi5jaGlsZHJlblswXSBhcyBUO1xufVxuXG4vKipcbiAqIFB1cmUgSlMgdmVyc2lvbiBvZiBqUXVlcnkgZGVsZWdhdGUoKVxuICpcbiAqIEBzZWUgaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vaWFnb2JydW5vLzRkYjJlZDYyZGM0MGZhODQxYmI5YTVjN2RlOTJmNWY4XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWxlZ2F0ZShcbiAgd3JhcHBlcjogRWxlbWVudCB8IHN0cmluZyxcbiAgc2VsZWN0b3I6IHN0cmluZyxcbiAgZXZlbnROYW1lOiBzdHJpbmcsXG4gIGNhbGxiYWNrOiAoZTogRXZlbnQpID0+IHZvaWRcbik6ICgpID0+IHZvaWQge1xuICBpZiAodHlwZW9mIHNlbGVjdG9yID09PSAndW5kZWZpbmVkJyB8fCBzZWxlY3RvciA9PT0gJycpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBwcm92aWRlZCBzZWxlY3RvciBpcyBlbXB0eS4nKTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiBjYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBFcnJvcignUGxlYXNlIHNwZWNpZnkgYW4gY2FsbGJhY2suJyk7XG4gIH1cblxuICBjb25zdCBkZWxlZ2F0aW9uU2VsZWN0b3JzTWFwOiBSZWNvcmQ8c3RyaW5nLCBGdW5jdGlvbltdPiA9IHt9O1xuXG4gIGNvbnN0IHdyYXBwZXJFbGVtZW50ID0gc2VsZWN0T25lKHdyYXBwZXIpO1xuXG4gIHdyYXBwZXJFbGVtZW50Py5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgbGV0IGVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgbnVsbCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudDtcbiAgICBsZXQgZm9yY2VCcmVhayA9IGZhbHNlO1xuXG4gICAgd2hpbGUgKGVsZW1lbnQgJiYgZWxlbWVudCAhPT0gd3JhcHBlckVsZW1lbnQpIHtcbiAgICAgIGZvciAoY29uc3Qgc2VsZWN0b3IgaW4gZGVsZWdhdGlvblNlbGVjdG9yc01hcCkge1xuICAgICAgICBpZiAoZWxlbWVudC5tYXRjaGVzKHNlbGVjdG9yKSkge1xuICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGZvcmNlQnJlYWsgPSB0cnVlO1xuICAgICAgICAgIH07XG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFxuICAgICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgICAnY3VycmVudFRhcmdldCcsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGdldCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBjb25zdCBjYWxsYmFja0xpc3QgPSBkZWxlZ2F0aW9uU2VsZWN0b3JzTWFwW3NlbGVjdG9yXTtcblxuICAgICAgICAgIGNhbGxiYWNrTGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgY2FsbGJhY2soZXZlbnQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChmb3JjZUJyZWFrKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50O1xuICAgIH1cbiAgfSk7XG5cbiAgaWYgKCFkZWxlZ2F0aW9uU2VsZWN0b3JzTWFwW3NlbGVjdG9yXSkge1xuICAgIC8vIEFkZCBuZXcgc2VsZWN0b3IgdG8gdGhlIGxpc3RcbiAgICBkZWxlZ2F0aW9uU2VsZWN0b3JzTWFwW3NlbGVjdG9yXSA9IFtjYWxsYmFja107XG4gIH0gZWxzZSB7XG4gICAgZGVsZWdhdGlvblNlbGVjdG9yc01hcFtzZWxlY3Rvcl0ucHVzaChjYWxsYmFjayk7XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gdW5zdWJzY3JpYmUoKSB7XG4gICAgaWYgKCFkZWxlZ2F0aW9uU2VsZWN0b3JzTWFwW3NlbGVjdG9yXSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChkZWxlZ2F0aW9uU2VsZWN0b3JzTWFwW3NlbGVjdG9yXS5sZW5ndGggPj0gMikge1xuICAgICAgZGVsZWdhdGlvblNlbGVjdG9yc01hcFtzZWxlY3Rvcl0gPSBkZWxlZ2F0aW9uU2VsZWN0b3JzTWFwW3NlbGVjdG9yXS5maWx0ZXIoY2IgPT4gY2IgIT09IGNhbGxiYWNrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIGRlbGVnYXRpb25TZWxlY3RvcnNNYXBbc2VsZWN0b3JdO1xuICAgIH1cbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluamVjdENzc1RvRG9jdW1lbnQoZG9jOiBEb2N1bWVudCwgLi4uY3NzOiAoc3RyaW5nIHwgQ1NTU3R5bGVTaGVldClbXSk6IENTU1N0eWxlU2hlZXRbXTtcbmV4cG9ydCBmdW5jdGlvbiBpbmplY3RDc3NUb0RvY3VtZW50KC4uLmNzczogKHN0cmluZyB8IENTU1N0eWxlU2hlZXQpW10pOiBDU1NTdHlsZVNoZWV0W107XG5leHBvcnQgZnVuY3Rpb24gaW5qZWN0Q3NzVG9Eb2N1bWVudChcbiAgZG9jOiBEb2N1bWVudCB8IHN0cmluZyB8IENTU1N0eWxlU2hlZXQsXG4gIC4uLmNzczogKHN0cmluZyB8IENTU1N0eWxlU2hlZXQpW11cbik6IENTU1N0eWxlU2hlZXRbXSB7XG4gIGlmICghKGRvYyBpbnN0YW5jZW9mIERvY3VtZW50KSkge1xuICAgIGNzcy5wdXNoKGRvYyk7XG4gICAgZG9jID0gZG9jdW1lbnQ7XG4gIH1cblxuICBjb25zdCBzdHlsZXMgPSBjc3MubWFwKChjc3MpID0+IHtcbiAgICBpZiAodHlwZW9mIGNzcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnN0IHN0eWxlID0gbmV3IENTU1N0eWxlU2hlZXQoKTtcbiAgICAgIHN0eWxlLnJlcGxhY2VTeW5jKGNzcyk7XG4gICAgICByZXR1cm4gc3R5bGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNzcztcbiAgfSk7XG5cbiAgZG9jLmFkb3B0ZWRTdHlsZVNoZWV0cyA9IFsuLi5kb2MuYWRvcHRlZFN0eWxlU2hlZXRzLCAuLi5zdHlsZXNdO1xuXG4gIHJldHVybiBzdHlsZXM7XG59XG4iLCJpbXBvcnQgeyBzZWxlY3RPbmUgfSBmcm9tICcuL2RvbSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBhbmltYXRlVG8oXG4gIGVsZW1lbnQ6IEhUTUxFbGVtZW50LFxuICBzdHlsZXM6IFBhcnRpYWw8UmVjb3JkPGtleW9mIENTU1N0eWxlRGVjbGFyYXRpb24sIGFueT4+LFxuICBvcHRpb25zOiBudW1iZXIgfCBLZXlmcmFtZUFuaW1hdGlvbk9wdGlvbnMgPSB7fVxuKTogQW5pbWF0aW9uIHtcbiAgZWxlbWVudCA9IHNlbGVjdE9uZShlbGVtZW50KTtcblxuICBjb25zdCBjdXJyZW50U3R5bGVzID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCk7XG4gIGNvbnN0IHRyYW5zaXRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnlbXT4gPSB7fTtcblxuICBmb3IgKGNvbnN0IG5hbWUgaW4gc3R5bGVzKSB7XG4gICAgY29uc3QgdmFsdWUgPSBzdHlsZXNbbmFtZV07XG5cbiAgICB0cmFuc2l0aW9uc1tuYW1lXSA9IEFycmF5LmlzQXJyYXkodmFsdWUpXG4gICAgICA/IHZhbHVlXG4gICAgICA6IFtcbiAgICAgICAgY3VycmVudFN0eWxlcy5nZXRQcm9wZXJ0eVZhbHVlKG5hbWUpLFxuICAgICAgICB2YWx1ZVxuICAgICAgXTtcbiAgfVxuXG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ251bWJlcicpIHtcbiAgICBvcHRpb25zID0geyBkdXJhdGlvbjogb3B0aW9ucyB9O1xuICB9XG5cbiAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oXG4gICAge1xuICAgICAgZHVyYXRpb246IDQwMCxcbiAgICAgIGVhc2luZzogJ2xpbmVhcicsXG4gICAgICBmaWxsOiAnYm90aCdcbiAgICB9LFxuICAgIG9wdGlvbnNcbiAgKTtcblxuICBjb25zdCBhbmltYXRpb24gPSBlbGVtZW50LmFuaW1hdGUoXG4gICAgdHJhbnNpdGlvbnMsXG4gICAgb3B0aW9uc1xuICApO1xuXG4gIGFuaW1hdGlvbi5hZGRFdmVudExpc3RlbmVyKCdmaW5pc2gnLCAoKSA9PiB7XG4gICAgZm9yIChjb25zdCBuYW1lIGluIHN0eWxlcykge1xuICAgICAgY29uc3QgdmFsdWUgPSBzdHlsZXNbbmFtZV07XG5cbiAgICAgIGVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoXG4gICAgICAgIG5hbWUsXG4gICAgICAgIEFycmF5LmlzQXJyYXkodmFsdWUpXG4gICAgICAgICAgPyB2YWx1ZVt2YWx1ZS5sZW5ndGggLSAxXVxuICAgICAgICAgIDogdmFsdWVcbiAgICAgICk7XG4gICAgfVxuXG4gICAgYW5pbWF0aW9uLmNhbmNlbCgpO1xuICB9KTtcblxuICByZXR1cm4gYW5pbWF0aW9uO1xufVxuIiwiZXhwb3J0IHR5cGUgQWxlcnRIYW5kbGVyID0gKHRpdGxlOiBzdHJpbmcsIHRleHQ/OiBzdHJpbmcsIGljb24/OiBzdHJpbmcsIGV4dHJhPzogYW55KSA9PiBQcm9taXNlPHZvaWQ+O1xyXG5leHBvcnQgdHlwZSBDb25maXJtSGFuZGxlciA9ICh0aXRsZTogc3RyaW5nLCB0ZXh0Pzogc3RyaW5nLCBpY29uPzogc3RyaW5nLCBleHRyYT86IGFueSkgPT4gUHJvbWlzZTxib29sZWFuPjtcclxuXHJcbmV4cG9ydCBjbGFzcyBBbGVydEFkYXB0ZXIge1xyXG4gIHN0YXRpYyBhbGVydDogQWxlcnRIYW5kbGVyID0gYXN5bmMgKHRpdGxlOiBzdHJpbmcpID0+IHdpbmRvdy5hbGVydCh0aXRsZSk7XHJcbiAgc3RhdGljIGNvbmZpcm06IENvbmZpcm1IYW5kbGVyID0gYXN5bmMgKHRpdGxlOiBzdHJpbmcpID0+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZTxib29sZWFuPigocmVzb2x2ZSkgPT4ge1xyXG4gICAgICBjb25zdCB2ID0gY29uZmlybSh0aXRsZSk7XHJcblxyXG4gICAgICByZXNvbHZlKHYpO1xyXG4gICAgfSk7XHJcbiAgfTtcclxuICBzdGF0aWMgZGVsZXRlQ29uZmlybTogQ29uZmlybUhhbmRsZXIgPSBhc3luYyAodGl0bGU6IHN0cmluZykgPT4gdGhpcy5jb25maXJtKHRpdGxlKTtcclxuXHJcbiAgc3RhdGljIGNvbmZpcm1UZXh0OiAoKSA9PiBzdHJpbmcgPSAoKSA9PiAn56K66KqNJztcclxuICBzdGF0aWMgY2FuY2VsVGV4dDogKCkgPT4gc3RyaW5nID0gKCkgPT4gJ+WPlua2iCc7XHJcbiAgc3RhdGljIGRlbGV0ZVRleHQ6ICgpID0+IHN0cmluZyA9ICgpID0+ICfliKrpmaQnO1xyXG59XHJcblxyXG4iLCJpbXBvcnQgeyBBbGVydEFkYXB0ZXIgfSBmcm9tICcuL2FsZXJ0LWFkYXB0ZXInO1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNpbXBsZUFsZXJ0KFxyXG4gIHRpdGxlOiBzdHJpbmcsXHJcbiAgdGV4dDogc3RyaW5nID0gJycsXHJcbiAgaWNvbjogc3RyaW5nID0gJ2luZm8nLFxyXG4gIGV4dHJhPzogYW55XHJcbikge1xyXG4gIHJldHVybiBBbGVydEFkYXB0ZXIuYWxlcnQodGl0bGUsIHRleHQsIGljb24sIGV4dHJhKTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNpbXBsZUNvbmZpcm0oXHJcbiAgdGl0bGU6IHN0cmluZyxcclxuICB0ZXh0OiBzdHJpbmcgPSAnJyxcclxuICBpY29uOiBzdHJpbmcgPSAnaW5mbycsXHJcbiAgZXh0cmE/OiBhbnksXHJcbikge1xyXG4gIHJldHVybiBBbGVydEFkYXB0ZXIuY29uZmlybSh0aXRsZSwgdGV4dCwgaWNvbiwgZXh0cmEpO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlQ29uZmlybShcclxuICB0aXRsZTogc3RyaW5nLFxyXG4gIHRleHQ6IHN0cmluZyA9ICcnLFxyXG4gIGljb246IHN0cmluZyA9ICdpbmZvJyxcclxuICBleHRyYT86IGFueSxcclxuKSB7XHJcbiAgcmV0dXJuIEFsZXJ0QWRhcHRlci5kZWxldGVDb25maXJtKHRpdGxlLCB0ZXh0LCBpY29uLCBleHRyYSk7XHJcbn1cclxuIiwiXG5leHBvcnQgZnVuY3Rpb24gZ2V0R2xvYmFsVGhpcygpIHtcbiAgcmV0dXJuIGdsb2JhbFRoaXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0Jyb3dzZXIoKSB7XG4gIHJldHVybiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzTm9kZSgpIHtcbiAgcmV0dXJuIHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnO1xufVxuIiwiaW1wb3J0IHsgaXNOb2RlIH0gZnJvbSAnLi9lbnYnO1xuXG5leHBvcnQgZnVuY3Rpb24gYmFzZTY0VXJsRW5jb2RlKHN0cmluZzogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIGJ0b2EoU3RyaW5nKHN0cmluZykpXG4gICAgLnJlcGxhY2UoL1xcKy8sICctJylcbiAgICAucmVwbGFjZShuZXcgUmVnRXhwKCdcXFxcLycpLCAnXycpXG4gICAgLnJlcGxhY2UoLz0rJC8sICcnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJhc2U2NFVybERlY29kZShzdHJpbmc6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBhdG9iKFxuICAgIFN0cmluZyhzdHJpbmcpXG4gICAgICAucmVwbGFjZSgvLS8sICcrJylcbiAgICAgIC5yZXBsYWNlKC9fLywgJy8nKVxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdWlkKHByZWZpeDogc3RyaW5nID0gJycsIHRpbWViYXNlOiBib29sZWFuID0gZmFsc2UpOiBzdHJpbmcge1xuICBpZiAodGltZWJhc2UpIHtcbiAgICBjb25zdCBzdGFydCA9IHBlcmZvcm1hbmNlPy50aW1lT3JpZ2luXG4gICAgICA/IE1hdGgucm91bmQocGVyZm9ybWFuY2UudGltZU9yaWdpbilcbiAgICAgIDogcGVyZm9ybWFuY2UudGltaW5nLm5hdmlnYXRpb25TdGFydDtcblxuICAgIGNvbnN0IHRpbWUgPSAoc3RhcnQgKiAxMDAwMDApICsgKHBlcmZvcm1hbmNlLm5vdygpICogMTAwKTtcblxuICAgIHJldHVybiBwcmVmaXggKyB0aW1lLnRvU3RyaW5nKDEyKSArIChyYW5kb21CeXRlc1N0cmluZyg0KSk7XG4gIH1cblxuICByZXR1cm4gcHJlZml4ICsgcmFuZG9tQnl0ZXNTdHJpbmcoMTIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdGlkKHByZWZpeDogc3RyaW5nID0gJycpOiBzdHJpbmcge1xuICByZXR1cm4gdWlkKHByZWZpeCwgdHJ1ZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByYW5kb21CeXRlc1N0cmluZyhzaXplOiBudW1iZXIgPSAxMik6IHN0cmluZyB7XG4gIGlmICghaXNOb2RlKCkgJiYgIWdsb2JhbFRoaXMuY3J5cHRvKSB7XG4gICAgcmV0dXJuIFN0cmluZyhNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoc2l6ZSAqKiAxMCkpKTtcbiAgfVxuXG4gIHJldHVybiBBcnJheS5mcm9tKHJhbmRvbUJ5dGVzKHNpemUpKVxuICAgIC5tYXAoeCA9PiB4LnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCAnMCcpKVxuICAgIC5qb2luKCcnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJhbmRvbUJ5dGVzKHNpemU6IG51bWJlciA9IDEyKTogVWludDhBcnJheSB7XG4gIGNvbnN0IGFyciA9IG5ldyBVaW50OEFycmF5KHNpemUpO1xuICBnbG9iYWxUaGlzLmNyeXB0by5nZXRSYW5kb21WYWx1ZXMoYXJyKTtcbiAgcmV0dXJuIGFycjtcbn1cblxuZXhwb3J0IGNvbnN0IFNUUl9TRUVEX0JBU0UzMiA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWjIzNDU2Nyc7XG5leHBvcnQgY29uc3QgU1RSX1NFRURfQkFTRTMySEVYID0gJzAxMjM0NTY3ODlBQkNERUZHSElKS0xNTk9QUVJTVFVWJztcbmV4cG9ydCBjb25zdCBTVFJfU0VFRF9CQVNFMzYgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVowMTIzNDU2Nzg5JztcbmV4cG9ydCBjb25zdCBTVFJfU0VFRF9CQVNFNTggPSAnMTIzNDU2Nzg5QUJDREVGR0hKS0xNTlBRUlNUVVZXWFlaYWJjZGVmZ2hpamttbm9wcXJzdHV2d3h5eic7XG5leHBvcnQgY29uc3QgU1RSX1NFRURfQkFTRTY0U0FGRSA9ICcwMTIzNDU2Nzg5YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWic7XG5leHBvcnQgY29uc3QgU1RSX1NFRURfQkFTRTYyID0gJzAxMjM0NTY3ODlhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ekFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaJztcblxuZXhwb3J0IGZ1bmN0aW9uIHJhbmRvbVN0cmluZyhsZW5ndGg6IG51bWJlciwgY2hhcmFjdGVyczogc3RyaW5nID0gU1RSX1NFRURfQkFTRTYyKTogc3RyaW5nIHtcbiAgbGV0IHJlc3VsdCA9ICcnO1xuICBjb25zdCBjaGFyYWN0ZXJzTGVuZ3RoID0gY2hhcmFjdGVycy5sZW5ndGg7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIHJlc3VsdCArPSBjaGFyYWN0ZXJzLmNoYXJBdChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjaGFyYWN0ZXJzTGVuZ3RoKSk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuIiwiZXhwb3J0IGNsYXNzIFRhc2tRdWV1ZSB7XG4gIGl0ZW1zOiAoKCkgPT4gUHJvbWlzZTxhbnk+KVtdID0gW107XG5cbiAgY3VycmVudFJ1bm5pbmcgPSAwO1xuXG4gIHJ1bm5pbmcgPSBmYWxzZTtcblxuICBvYnNlcnZlcnM6IHtcbiAgICBoYW5kbGVyOiBGdW5jdGlvbjtcbiAgICBvbmNlOiBib29sZWFuO1xuICB9W10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgbWF4UnVubmluZyA9IDEpIHtcbiAgICAvL1xuICB9XG5cbiAgcHVzaDxUIGV4dGVuZHMgKCguLi5hcmdzOiBhbnlbXSkgPT4gYW55KT4oY2FsbGJhY2s6IFQpOiBQcm9taXNlPEF3YWl0ZWQ8UmV0dXJuVHlwZTxUPj4+IHtcbiAgICBjb25zdCBwID0gbmV3IFByb21pc2U8QXdhaXRlZDxSZXR1cm5UeXBlPFQ+Pj4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5pdGVtcy5wdXNoKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShjYWxsYmFjaygpKS50aGVuKHJlc29sdmUpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnJ1bigpO1xuXG4gICAgcmV0dXJuIHA7XG4gIH1cblxuICBydW4oKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLnJ1bm5pbmcpIHtcbiAgICAgIHRoaXMucnVubmluZyA9IHRydWU7XG4gICAgfVxuXG4gICAgdGhpcy5wb3AoKTtcbiAgfVxuXG4gIGFzeW5jIHBvcCgpIHtcbiAgICBjb25zdCBjYWxsYmFjayA9IHRoaXMuaXRlbXMuc2hpZnQoKTtcblxuICAgIC8vIElmIGVtcHR5LCBzdG9wIHJ1bm5pbmcuXG4gICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2U7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuXG4gICAgLy8gSWYgY3VycmVudCBydW5uaW5nIGZ1bGwsIHNldCBiYWNrIHRvIHF1ZXVlIGFuZCBsZWF2ZS5cbiAgICBpZiAodGhpcy5jdXJyZW50UnVubmluZyA+PSB0aGlzLm1heFJ1bm5pbmcpIHtcbiAgICAgIHRoaXMuaXRlbXMudW5zaGlmdChjYWxsYmFjayk7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuXG4gICAgdGhpcy5jdXJyZW50UnVubmluZysrO1xuXG4gICAgdGhpcy5ub3RpY2UoKTtcblxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYXdhaXQgY2FsbGJhY2soKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aHJvdyBlO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLmVuZFBvcCgpO1xuICAgIH1cbiAgfVxuXG4gIGVuZFBvcCgpIHtcbiAgICB0aGlzLmN1cnJlbnRSdW5uaW5nLS07XG4gICAgdGhpcy5ub3RpY2UoKTtcbiAgICB0aGlzLnBvcCgpO1xuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5pdGVtcyA9IFtdO1xuXG4gICAgdGhpcy5ub3RpY2UoKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgaXNFbXB0eSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5pdGVtcy5sZW5ndGggPT09IDA7XG4gIH1cblxuICBnZXQgbGVuZ3RoKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuaXRlbXMubGVuZ3RoO1xuICB9XG5cbiAgcGVlaygpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVtcztcbiAgfVxuXG4gIG9ic2VydmUoaGFuZGxlcjogT2JzZXJ2ZXJGdW5jdGlvbiwgb3B0aW9uczogeyBvbmNlPzogYm9vbGVhbiB9ID0ge30pOiAoKSA9PiB2b2lkIHtcbiAgICB0aGlzLm9ic2VydmVycy5wdXNoKHtcbiAgICAgIGhhbmRsZXIsXG4gICAgICBvbmNlOiBvcHRpb25zLm9uY2UgfHwgZmFsc2UsXG4gICAgfSk7XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgdGhpcy5vZmYoaGFuZGxlcik7XG4gICAgfTtcbiAgfVxuXG4gIG9uY2UoaGFuZGxlcjogT2JzZXJ2ZXJGdW5jdGlvbiwgb3B0aW9uczogeyBvbmNlPzogYm9vbGVhbiB9ID0ge30pOiAoKSA9PiB2b2lkIHtcbiAgICBvcHRpb25zLm9uY2UgPSB0cnVlO1xuXG4gICAgcmV0dXJuIHRoaXMub2JzZXJ2ZShoYW5kbGVyLCBvcHRpb25zKTtcbiAgfVxuXG4gIG9uRW5kKGNhbGxiYWNrOiBPYnNlcnZlckZ1bmN0aW9uLCBvcHRpb25zOiB7IG9uY2U/OiBib29sZWFuIH0gPSB7fSkge1xuICAgIHJldHVybiB0aGlzLm9ic2VydmUoKHF1ZXVlLCBsZW5ndGgsIHJ1bm5pbmcpID0+IHtcbiAgICAgIGlmIChsZW5ndGggPT09IDAgJiYgcnVubmluZyA9PT0gMCkge1xuICAgICAgICBjYWxsYmFjayhxdWV1ZSwgbGVuZ3RoLCBydW5uaW5nKTtcbiAgICAgIH1cbiAgICB9LCBvcHRpb25zKTtcbiAgfVxuXG4gIG5vdGljZSgpIHtcbiAgICB0aGlzLm9ic2VydmVycy5mb3JFYWNoKChvYnNlcnZlcikgPT4ge1xuICAgICAgb2JzZXJ2ZXIuaGFuZGxlcih0aGlzLCB0aGlzLmxlbmd0aCwgdGhpcy5jdXJyZW50UnVubmluZyk7XG4gICAgfSk7XG5cbiAgICB0aGlzLm9ic2VydmVycyA9IHRoaXMub2JzZXJ2ZXJzLmZpbHRlcigob2JzZXJ2ZXIpID0+ICFvYnNlcnZlci5vbmNlKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgb2ZmKGNhbGxiYWNrPzogRnVuY3Rpb24pIHtcbiAgICBpZiAoY2FsbGJhY2sgPT0gbnVsbCkge1xuICAgICAgdGhpcy5vYnNlcnZlcnMgPSBbXTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHRoaXMub2JzZXJ2ZXJzID0gdGhpcy5vYnNlcnZlcnMuZmlsdGVyKChvYnNlcnZlcikgPT4gb2JzZXJ2ZXIuaGFuZGxlciAhPT0gY2FsbGJhY2spO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG5cbmRlY2xhcmUgdHlwZSBPYnNlcnZlckZ1bmN0aW9uID0gKHF1ZXVlOiBUYXNrUXVldWUsIGxlbmd0aDogbnVtYmVyLCBydW5uaW5nOiBudW1iZXIpID0+IHZvaWRcblxuZXhwb3J0IGZ1bmN0aW9uIHF1ZXVlKG1heFJ1bm5pbmc6IG51bWJlciA9IDEpIHtcbiAgcmV0dXJuIG5ldyBUYXNrUXVldWUobWF4UnVubmluZyk7XG59XG4iLCJkZWNsYXJlIHR5cGUgU3RhY2tIYW5kbGVyPFQ+ID0gKHN0YWNrOiBTdGFjazxUPiwgbGVuZ3RoOiBudW1iZXIpID0+IHZvaWQ7XG5cbmRlY2xhcmUgdHlwZSBTdGFja1ZhbHVlPFY+ID0gViB8IHRydWU7XG5cbmV4cG9ydCBjbGFzcyBTdGFjazxUID0gYW55PiB7XG4gIG9ic2VydmVyczogeyBoYW5kbGVyOiBTdGFja0hhbmRsZXI8VD4sIG9uY2U6IGJvb2xlYW4gfVtdID0gW107XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHN0b3JlOiBTdGFja1ZhbHVlPFQ+W10gPSBbXSkge1xuICAgIC8vXG4gIH1cblxuICBwdXNoKHZhbHVlPzogVCk6IG51bWJlciB7XG4gICAgY29uc3QgciA9IHRoaXMuc3RvcmUucHVzaCh2YWx1ZSA/PyB0cnVlKTtcblxuICAgIHRoaXMubm90aWNlKCk7XG5cbiAgICByZXR1cm4gcjtcbiAgfVxuXG4gIHBvcCgpOiBUIHwgdHJ1ZSB8IHVuZGVmaW5lZCB7XG4gICAgY29uc3QgciA9IHRoaXMuc3RvcmUucG9wKCk7XG5cbiAgICB0aGlzLm5vdGljZSgpO1xuXG4gICAgcmV0dXJuIHI7XG4gIH1cblxuICBjbGVhcigpOiB0aGlzIHtcbiAgICB0aGlzLnN0b3JlID0gW107XG5cbiAgICB0aGlzLm5vdGljZSgpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBpc0VtcHR5KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnN0b3JlLmxlbmd0aCA9PT0gMDtcbiAgfVxuXG4gIGdldCBsZW5ndGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RvcmUubGVuZ3RoO1xuICB9XG5cbiAgcGVlaygpOiBTdGFja1ZhbHVlPFQ+W10ge1xuICAgIHJldHVybiB0aGlzLnN0b3JlO1xuICB9XG5cbiAgb2JzZXJ2ZShoYW5kbGVyOiAoc3RhY2s6IFN0YWNrLCBsZW5ndGg6IG51bWJlcikgPT4gdm9pZCk6ICgpID0+IHZvaWQge1xuICAgIHRoaXMub2JzZXJ2ZXJzLnB1c2goe1xuICAgICAgaGFuZGxlcixcbiAgICAgIG9uY2U6IGZhbHNlXG4gICAgfSk7XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgdGhpcy5vZmYoaGFuZGxlcik7XG4gICAgfTtcbiAgfVxuXG4gIG9uY2UoaGFuZGxlcjogU3RhY2tIYW5kbGVyPFQ+KTogKCkgPT4gdm9pZCB7XG4gICAgdGhpcy5vYnNlcnZlcnMucHVzaCh7XG4gICAgICBoYW5kbGVyLFxuICAgICAgb25jZTogdHJ1ZVxuICAgIH0pO1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHRoaXMub2ZmKGhhbmRsZXIpO1xuICAgIH07XG4gIH1cblxuICBub3RpY2UoKTogdGhpcyB7XG4gICAgdGhpcy5vYnNlcnZlcnMuZm9yRWFjaCgob2JzZXJ2ZXIpID0+IHtcbiAgICAgIG9ic2VydmVyLmhhbmRsZXIodGhpcywgdGhpcy5sZW5ndGgpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5vYnNlcnZlcnMgPSB0aGlzLm9ic2VydmVycy5maWx0ZXIoKG9ic2VydmVyKSA9PiBvYnNlcnZlci5vbmNlICE9PSB0cnVlKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgb2ZmKGNhbGxiYWNrPzogU3RhY2tIYW5kbGVyPFQ+KTogdGhpcyB7XG4gICAgdGhpcy5vYnNlcnZlcnMgPSB0aGlzLm9ic2VydmVycy5maWx0ZXIoKG9ic2VydmVyKSA9PiBvYnNlcnZlci5oYW5kbGVyICE9PSBjYWxsYmFjayk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0YWNrPFQgPSBhbnk+KHN0b3JlOiBhbnlbXSA9IFtdKSB7XG4gIHJldHVybiBuZXcgU3RhY2s8VD4oc3RvcmUpO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIHNsZWVwKHRpbWU6IG51bWJlcikge1xyXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgc2V0VGltZW91dChyZXNvbHZlLCB0aW1lKTtcclxuICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG5leHRUaWNrKGNhbGxiYWNrID0gKCkgPT4ge30pIHtcclxuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbihjYWxsYmFjayk7XHJcbn1cclxuIiwiaW1wb3J0IHsgdWlkLCB0aWQsIHJhbmRvbUJ5dGVzLCByYW5kb21CeXRlc1N0cmluZyB9IGZyb20gJ0BseXJhc29mdC90cy10b29sa2l0L2dlbmVyaWMnO1xuXG5leHBvcnQgZnVuY3Rpb24gYmFzZTY0VXJsRW5jb2RlKHN0cmluZzogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIGJ0b2EoU3RyaW5nKHN0cmluZykpXG4gICAgLnJlcGxhY2UoL1xcKy8sICctJylcbiAgICAucmVwbGFjZShuZXcgUmVnRXhwKCdcXFxcLycpLCAnXycpXG4gICAgLnJlcGxhY2UoLz0rJC8sICcnKTtcbn1cblxuLyoqXG4gKiBCYXNlNjQgVVJMIGRlY29kZVxuICovXG5leHBvcnQgZnVuY3Rpb24gYmFzZTY0VXJsRGVjb2RlKHN0cmluZzogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIGF0b2IoXG4gICAgU3RyaW5nKHN0cmluZylcbiAgICAgIC5yZXBsYWNlKC8tLywgJysnKVxuICAgICAgLnJlcGxhY2UoL18vLCAnLycpXG4gICk7XG59XG5cbmV4cG9ydCB7IHVpZCwgdGlkLCByYW5kb21CeXRlcywgcmFuZG9tQnl0ZXNTdHJpbmcgfTtcblxubGV0IGdsb2JhbFNlcmlhbCA9IDE7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXJpYWwoKTogbnVtYmVyIHtcbiAgcmV0dXJuIGdsb2JhbFNlcmlhbCsrO1xufVxuIiwiaW1wb3J0IHsgZGF0YSB9IGZyb20gJy4uL2RhdGEnO1xuaW1wb3J0IHsgc2xlZXAgfSBmcm9tICdAbHlyYXNvZnQvdHMtdG9vbGtpdC9nZW5lcmljJztcblxuZXhwb3J0IHsgc2xlZXAgfTtcblxuZXhwb3J0IGZ1bmN0aW9uIGZvcmNlQXJyYXk8VD4oaXRlbTogVCB8IFRbXSk6IFRbXSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGl0ZW0pKSB7XG4gICAgcmV0dXJuIGl0ZW07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFtpdGVtXTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVib3VuY2U8VCBleHRlbmRzIEZ1bmN0aW9uID0gRnVuY3Rpb24+KGhhbmRsZXI6IFQsIHdhaXQgPSAxKTogVCB7XG4gIGxldCB0aW1lcjogUmV0dXJuVHlwZTx0eXBlb2Ygc2V0VGltZW91dD4gfCBudW1iZXIsIHJlc3VsdDogYW55O1xuICByZXR1cm4gZnVuY3Rpb24gKHRoaXM6IGFueSwgLi4uYXJnczogYW55W10pIHtcbiAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgIHRpbWVyID0gc2V0VGltZW91dCgoKSA9PiByZXN1bHQgPSBoYW5kbGVyLmNhbGwodGhpcywgLi4uYXJncyksIHdhaXQpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH0gYXMgYW55IGFzIFQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0aHJvdHRsZTxUIGV4dGVuZHMgRnVuY3Rpb24gPSBGdW5jdGlvbj4oaGFuZGxlcjogVCwgd2FpdDogbnVtYmVyID0gMSk6IFQge1xuICBsZXQgdGltZXI6IFJldHVyblR5cGU8dHlwZW9mIHNldFRpbWVvdXQ+IHwgbnVtYmVyIHwgdW5kZWZpbmVkLCByZXN1bHQ6IGFueTtcbiAgcmV0dXJuIGZ1bmN0aW9uICh0aGlzOiBhbnksIC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgaWYgKCF0aW1lcikge1xuICAgICAgcmV0dXJuIHJlc3VsdCA9IGhhbmRsZXIuY2FsbCh0aGlzLCAuLi5hcmdzKTtcbiAgICB9XG5cbiAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgIHRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB0aW1lciA9IHVuZGVmaW5lZCwgd2FpdCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSBhcyBhbnkgYXMgVDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRGVidWcoKSB7XG4gIHJldHVybiBCb29sZWFuKGRhdGEoJ3dpbmR3YWxrZXIuZGVidWcnKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBuZXh0VGljayhjYWxsYmFjaz86ICgpID0+IGFueSk6IFByb21pc2U8YW55PiB7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKGNhbGxiYWNrID8/ICgoKSA9PiBudWxsKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3YWl0PFQgZXh0ZW5kcyByZWFkb25seSB1bmtub3duW10+KFxuICAuLi5wcm9taXNlZTogeyBbSyBpbiBrZXlvZiBUXTogUHJvbWlzZUxpa2U8VFtLXT4gfCBUW0tdIH1cbik6IFByb21pc2U8QXdhaXRlZDxUPj4ge1xuICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZWUpIGFzIFByb21pc2U8QXdhaXRlZDxUPj47XG59XG4iLCIvKiBnbG9iYWwgd2luZG93LCBleHBvcnRzLCBkZWZpbmUgKi9cblxuIWZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0J1xuXG4gICAgdmFyIHJlID0ge1xuICAgICAgICBub3Rfc3RyaW5nOiAvW15zXS8sXG4gICAgICAgIG5vdF9ib29sOiAvW150XS8sXG4gICAgICAgIG5vdF90eXBlOiAvW15UXS8sXG4gICAgICAgIG5vdF9wcmltaXRpdmU6IC9bXnZdLyxcbiAgICAgICAgbnVtYmVyOiAvW2RpZWZnXS8sXG4gICAgICAgIG51bWVyaWNfYXJnOiAvW2JjZGllZmd1eFhdLyxcbiAgICAgICAganNvbjogL1tqXS8sXG4gICAgICAgIG5vdF9qc29uOiAvW15qXS8sXG4gICAgICAgIHRleHQ6IC9eW15cXHgyNV0rLyxcbiAgICAgICAgbW9kdWxvOiAvXlxceDI1ezJ9LyxcbiAgICAgICAgcGxhY2Vob2xkZXI6IC9eXFx4MjUoPzooWzEtOV1cXGQqKVxcJHxcXCgoW14pXSspXFwpKT8oXFwrKT8oMHwnW14kXSk/KC0pPyhcXGQrKT8oPzpcXC4oXFxkKykpPyhbYi1naWpvc3RUdXZ4WF0pLyxcbiAgICAgICAga2V5OiAvXihbYS16X11bYS16X1xcZF0qKS9pLFxuICAgICAgICBrZXlfYWNjZXNzOiAvXlxcLihbYS16X11bYS16X1xcZF0qKS9pLFxuICAgICAgICBpbmRleF9hY2Nlc3M6IC9eXFxbKFxcZCspXFxdLyxcbiAgICAgICAgc2lnbjogL15bKy1dL1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNwcmludGYoa2V5KSB7XG4gICAgICAgIC8vIGBhcmd1bWVudHNgIGlzIG5vdCBhbiBhcnJheSwgYnV0IHNob3VsZCBiZSBmaW5lIGZvciB0aGlzIGNhbGxcbiAgICAgICAgcmV0dXJuIHNwcmludGZfZm9ybWF0KHNwcmludGZfcGFyc2Uoa2V5KSwgYXJndW1lbnRzKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZzcHJpbnRmKGZtdCwgYXJndikge1xuICAgICAgICByZXR1cm4gc3ByaW50Zi5hcHBseShudWxsLCBbZm10XS5jb25jYXQoYXJndiB8fCBbXSkpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3ByaW50Zl9mb3JtYXQocGFyc2VfdHJlZSwgYXJndikge1xuICAgICAgICB2YXIgY3Vyc29yID0gMSwgdHJlZV9sZW5ndGggPSBwYXJzZV90cmVlLmxlbmd0aCwgYXJnLCBvdXRwdXQgPSAnJywgaSwgaywgcGgsIHBhZCwgcGFkX2NoYXJhY3RlciwgcGFkX2xlbmd0aCwgaXNfcG9zaXRpdmUsIHNpZ25cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRyZWVfbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcGFyc2VfdHJlZVtpXSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gcGFyc2VfdHJlZVtpXVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIHBhcnNlX3RyZWVbaV0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgcGggPSBwYXJzZV90cmVlW2ldIC8vIGNvbnZlbmllbmNlIHB1cnBvc2VzIG9ubHlcbiAgICAgICAgICAgICAgICBpZiAocGgua2V5cykgeyAvLyBrZXl3b3JkIGFyZ3VtZW50XG4gICAgICAgICAgICAgICAgICAgIGFyZyA9IGFyZ3ZbY3Vyc29yXVxuICAgICAgICAgICAgICAgICAgICBmb3IgKGsgPSAwOyBrIDwgcGgua2V5cy5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFyZyA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3Ioc3ByaW50ZignW3NwcmludGZdIENhbm5vdCBhY2Nlc3MgcHJvcGVydHkgXCIlc1wiIG9mIHVuZGVmaW5lZCB2YWx1ZSBcIiVzXCInLCBwaC5rZXlzW2tdLCBwaC5rZXlzW2stMV0pKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJnW3BoLmtleXNba11dXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocGgucGFyYW1fbm8pIHsgLy8gcG9zaXRpb25hbCBhcmd1bWVudCAoZXhwbGljaXQpXG4gICAgICAgICAgICAgICAgICAgIGFyZyA9IGFyZ3ZbcGgucGFyYW1fbm9dXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgeyAvLyBwb3NpdGlvbmFsIGFyZ3VtZW50IChpbXBsaWNpdClcbiAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJndltjdXJzb3IrK11cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocmUubm90X3R5cGUudGVzdChwaC50eXBlKSAmJiByZS5ub3RfcHJpbWl0aXZlLnRlc3QocGgudHlwZSkgJiYgYXJnIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJnKClcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocmUubnVtZXJpY19hcmcudGVzdChwaC50eXBlKSAmJiAodHlwZW9mIGFyZyAhPT0gJ251bWJlcicgJiYgaXNOYU4oYXJnKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihzcHJpbnRmKCdbc3ByaW50Zl0gZXhwZWN0aW5nIG51bWJlciBidXQgZm91bmQgJVQnLCBhcmcpKVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChyZS5udW1iZXIudGVzdChwaC50eXBlKSkge1xuICAgICAgICAgICAgICAgICAgICBpc19wb3NpdGl2ZSA9IGFyZyA+PSAwXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc3dpdGNoIChwaC50eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2InOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gcGFyc2VJbnQoYXJnLCAxMCkudG9TdHJpbmcoMilcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2MnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gU3RyaW5nLmZyb21DaGFyQ29kZShwYXJzZUludChhcmcsIDEwKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2QnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlICdpJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IHBhcnNlSW50KGFyZywgMTApXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdqJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IEpTT04uc3RyaW5naWZ5KGFyZywgbnVsbCwgcGgud2lkdGggPyBwYXJzZUludChwaC53aWR0aCkgOiAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnZSc6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBwaC5wcmVjaXNpb24gPyBwYXJzZUZsb2F0KGFyZykudG9FeHBvbmVudGlhbChwaC5wcmVjaXNpb24pIDogcGFyc2VGbG9hdChhcmcpLnRvRXhwb25lbnRpYWwoKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnZic6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBwaC5wcmVjaXNpb24gPyBwYXJzZUZsb2F0KGFyZykudG9GaXhlZChwaC5wcmVjaXNpb24pIDogcGFyc2VGbG9hdChhcmcpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdnJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IHBoLnByZWNpc2lvbiA/IFN0cmluZyhOdW1iZXIoYXJnLnRvUHJlY2lzaW9uKHBoLnByZWNpc2lvbikpKSA6IHBhcnNlRmxvYXQoYXJnKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnbyc6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSAocGFyc2VJbnQoYXJnLCAxMCkgPj4+IDApLnRvU3RyaW5nKDgpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdzJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IFN0cmluZyhhcmcpXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSAocGgucHJlY2lzaW9uID8gYXJnLnN1YnN0cmluZygwLCBwaC5wcmVjaXNpb24pIDogYXJnKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAndCc6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBTdHJpbmcoISFhcmcpXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSAocGgucHJlY2lzaW9uID8gYXJnLnN1YnN0cmluZygwLCBwaC5wcmVjaXNpb24pIDogYXJnKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnVCc6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJnKS5zbGljZSg4LCAtMSkudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gKHBoLnByZWNpc2lvbiA/IGFyZy5zdWJzdHJpbmcoMCwgcGgucHJlY2lzaW9uKSA6IGFyZylcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3UnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gcGFyc2VJbnQoYXJnLCAxMCkgPj4+IDBcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3YnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJnLnZhbHVlT2YoKVxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gKHBoLnByZWNpc2lvbiA/IGFyZy5zdWJzdHJpbmcoMCwgcGgucHJlY2lzaW9uKSA6IGFyZylcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3gnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gKHBhcnNlSW50KGFyZywgMTApID4+PiAwKS50b1N0cmluZygxNilcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ1gnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gKHBhcnNlSW50KGFyZywgMTApID4+PiAwKS50b1N0cmluZygxNikudG9VcHBlckNhc2UoKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJlLmpzb24udGVzdChwaC50eXBlKSkge1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXQgKz0gYXJnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmUubnVtYmVyLnRlc3QocGgudHlwZSkgJiYgKCFpc19wb3NpdGl2ZSB8fCBwaC5zaWduKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2lnbiA9IGlzX3Bvc2l0aXZlID8gJysnIDogJy0nXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBhcmcudG9TdHJpbmcoKS5yZXBsYWNlKHJlLnNpZ24sICcnKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2lnbiA9ICcnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcGFkX2NoYXJhY3RlciA9IHBoLnBhZF9jaGFyID8gcGgucGFkX2NoYXIgPT09ICcwJyA/ICcwJyA6IHBoLnBhZF9jaGFyLmNoYXJBdCgxKSA6ICcgJ1xuICAgICAgICAgICAgICAgICAgICBwYWRfbGVuZ3RoID0gcGgud2lkdGggLSAoc2lnbiArIGFyZykubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgIHBhZCA9IHBoLndpZHRoID8gKHBhZF9sZW5ndGggPiAwID8gcGFkX2NoYXJhY3Rlci5yZXBlYXQocGFkX2xlbmd0aCkgOiAnJykgOiAnJ1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXQgKz0gcGguYWxpZ24gPyBzaWduICsgYXJnICsgcGFkIDogKHBhZF9jaGFyYWN0ZXIgPT09ICcwJyA/IHNpZ24gKyBwYWQgKyBhcmcgOiBwYWQgKyBzaWduICsgYXJnKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0cHV0XG4gICAgfVxuXG4gICAgdmFyIHNwcmludGZfY2FjaGUgPSBPYmplY3QuY3JlYXRlKG51bGwpXG5cbiAgICBmdW5jdGlvbiBzcHJpbnRmX3BhcnNlKGZtdCkge1xuICAgICAgICBpZiAoc3ByaW50Zl9jYWNoZVtmbXRdKSB7XG4gICAgICAgICAgICByZXR1cm4gc3ByaW50Zl9jYWNoZVtmbXRdXG4gICAgICAgIH1cblxuICAgICAgICB2YXIgX2ZtdCA9IGZtdCwgbWF0Y2gsIHBhcnNlX3RyZWUgPSBbXSwgYXJnX25hbWVzID0gMFxuICAgICAgICB3aGlsZSAoX2ZtdCkge1xuICAgICAgICAgICAgaWYgKChtYXRjaCA9IHJlLnRleHQuZXhlYyhfZm10KSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBwYXJzZV90cmVlLnB1c2gobWF0Y2hbMF0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICgobWF0Y2ggPSByZS5tb2R1bG8uZXhlYyhfZm10KSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBwYXJzZV90cmVlLnB1c2goJyUnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoKG1hdGNoID0gcmUucGxhY2Vob2xkZXIuZXhlYyhfZm10KSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2hbMl0pIHtcbiAgICAgICAgICAgICAgICAgICAgYXJnX25hbWVzIHw9IDFcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZpZWxkX2xpc3QgPSBbXSwgcmVwbGFjZW1lbnRfZmllbGQgPSBtYXRjaFsyXSwgZmllbGRfbWF0Y2ggPSBbXVxuICAgICAgICAgICAgICAgICAgICBpZiAoKGZpZWxkX21hdGNoID0gcmUua2V5LmV4ZWMocmVwbGFjZW1lbnRfZmllbGQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRfbGlzdC5wdXNoKGZpZWxkX21hdGNoWzFdKVxuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKChyZXBsYWNlbWVudF9maWVsZCA9IHJlcGxhY2VtZW50X2ZpZWxkLnN1YnN0cmluZyhmaWVsZF9tYXRjaFswXS5sZW5ndGgpKSAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGZpZWxkX21hdGNoID0gcmUua2V5X2FjY2Vzcy5leGVjKHJlcGxhY2VtZW50X2ZpZWxkKSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRfbGlzdC5wdXNoKGZpZWxkX21hdGNoWzFdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICgoZmllbGRfbWF0Y2ggPSByZS5pbmRleF9hY2Nlc3MuZXhlYyhyZXBsYWNlbWVudF9maWVsZCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkX2xpc3QucHVzaChmaWVsZF9tYXRjaFsxXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcignW3NwcmludGZdIGZhaWxlZCB0byBwYXJzZSBuYW1lZCBhcmd1bWVudCBrZXknKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcignW3NwcmludGZdIGZhaWxlZCB0byBwYXJzZSBuYW1lZCBhcmd1bWVudCBrZXknKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG1hdGNoWzJdID0gZmllbGRfbGlzdFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYXJnX25hbWVzIHw9IDJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGFyZ19uYW1lcyA9PT0gMykge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1tzcHJpbnRmXSBtaXhpbmcgcG9zaXRpb25hbCBhbmQgbmFtZWQgcGxhY2Vob2xkZXJzIGlzIG5vdCAoeWV0KSBzdXBwb3J0ZWQnKVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHBhcnNlX3RyZWUucHVzaChcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI6IG1hdGNoWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1fbm86ICAgIG1hdGNoWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAga2V5czogICAgICAgIG1hdGNoWzJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2lnbjogICAgICAgIG1hdGNoWzNdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFkX2NoYXI6ICAgIG1hdGNoWzRdLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWxpZ246ICAgICAgIG1hdGNoWzVdLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICAgICAgIG1hdGNoWzZdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJlY2lzaW9uOiAgIG1hdGNoWzddLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogICAgICAgIG1hdGNoWzhdXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoJ1tzcHJpbnRmXSB1bmV4cGVjdGVkIHBsYWNlaG9sZGVyJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF9mbXQgPSBfZm10LnN1YnN0cmluZyhtYXRjaFswXS5sZW5ndGgpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNwcmludGZfY2FjaGVbZm10XSA9IHBhcnNlX3RyZWVcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBleHBvcnQgdG8gZWl0aGVyIGJyb3dzZXIgb3Igbm9kZS5qc1xuICAgICAqL1xuICAgIC8qIGVzbGludC1kaXNhYmxlIHF1b3RlLXByb3BzICovXG4gICAgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBleHBvcnRzWydzcHJpbnRmJ10gPSBzcHJpbnRmXG4gICAgICAgIGV4cG9ydHNbJ3ZzcHJpbnRmJ10gPSB2c3ByaW50ZlxuICAgIH1cbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgd2luZG93WydzcHJpbnRmJ10gPSBzcHJpbnRmXG4gICAgICAgIHdpbmRvd1sndnNwcmludGYnXSA9IHZzcHJpbnRmXG5cbiAgICAgICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lWydhbWQnXSkge1xuICAgICAgICAgICAgZGVmaW5lKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICdzcHJpbnRmJzogc3ByaW50ZixcbiAgICAgICAgICAgICAgICAgICAgJ3ZzcHJpbnRmJzogdnNwcmludGZcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qIGVzbGludC1lbmFibGUgcXVvdGUtcHJvcHMgKi9cbn0oKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuIiwiaW1wb3J0IHsgZGF0YSB9IGZyb20gJy4uL2RhdGEnO1xuaW1wb3J0IHsgaXNEZWJ1ZyB9IGZyb20gJy4vL2hlbHBlcic7XG5pbXBvcnQgeyBEaWN0aW9uYXJ5IH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgdnNwcmludGYgfSBmcm9tICdzcHJpbnRmLWpzJztcblxubGV0IGxhbmc6IFVuaWNvcm5MYW5nO1xuXG5leHBvcnQgZnVuY3Rpb24gdXNlTGFuZygpIHtcbiAgcmV0dXJuIGxhbmcgPz89IG5ldyBVbmljb3JuTGFuZygpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdHJhbnMoaWQ6IHN0cmluZywgLi4uYXJnczogYW55W10pIHtcbiAgcmV0dXJuIHVzZUxhbmcoKS50cmFucyhpZCwgLi4uYXJncyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfXyhpZDogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSkge1xuICByZXR1cm4gdHJhbnMoaWQsIC4uLmFyZ3MpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVbmljb3JuTGFuZyB7XG4gIC8qKlxuICAgKiBUcmFuc2xhdGUgYSBzdHJpbmcuXG4gICAqL1xuICB0cmFucyhpZDogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSk6IHN0cmluZyB7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5ub3JtYWxpemUoaWQpO1xuXG4gICAgbGV0IHRyYW5zbGF0ZWQgPSB0aGlzLmdldChrZXkpIHx8ICcnO1xuXG4gICAgdHJhbnNsYXRlZCA9IHRoaXMucmVwbGFjZSh0cmFuc2xhdGVkLCBhcmdzKTtcblxuICAgIHJldHVybiB0cmFuc2xhdGVkICE9PSAnJyA/IHRyYW5zbGF0ZWQgOiB0aGlzLndyYXBEZWJ1ZyhpZCwgZmFsc2UpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHJlcGxhY2Uoc3RyOiBzdHJpbmcsIGFyZ3M6IGFueVtdKTogc3RyaW5nIHtcbiAgICBsZXQgcmVwbGFjZW1lbnRzOiBEaWN0aW9uYXJ5PGFueT4gPSB7fTtcbiAgICBsZXQgdmFsdWVzOiBhbnlbXSA9IFtdO1xuXG4gICAgZm9yIChjb25zdCBhcmcgb2YgYXJncykge1xuICAgICAgaWYgKHR5cGVvZiBhcmcgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJlcGxhY2VtZW50cyA9IHsgLi4ucmVwbGFjZW1lbnRzLCAuLi5hcmcgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlcy5wdXNoKGFyZyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlcy5sZW5ndGgpIHtcbiAgICAgIHN0ciA9IHZzcHJpbnRmKHN0ciwgdmFsdWVzKTtcbiAgICB9XG5cbiAgICBpZiAoT2JqZWN0LnZhbHVlcyhyZXBsYWNlbWVudHMpLmxlbmd0aCkge1xuICAgICAgZm9yIChjb25zdCBrZXkgaW4gcmVwbGFjZW1lbnRzKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IHJlcGxhY2VtZW50c1trZXldO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICB2YWx1ZSA9IHZhbHVlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShuZXcgUmVnRXhwKCc6JyArIGtleSwgJ2cnKSwgU3RyaW5nKHZhbHVlKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0cjtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kIHRleHQuXG4gICAqL1xuICBnZXQoaWQ6IHN0cmluZyk6IHN0cmluZyB8IG51bGwge1xuICAgIGNvbnN0IHN0cmluZ3MgPSB0aGlzLmdldFN0cmluZ3MoKTtcblxuICAgIGlmIChzdHJpbmdzW2lkXSkge1xuICAgICAgcmV0dXJuIHN0cmluZ3NbaWRdO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEhhcyBsYW5ndWFnZSBrZXkuXG4gICAqL1xuICBoYXMoa2V5OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBjb25zdCBzdHJpbmdzID0gdGhpcy5nZXRTdHJpbmdzKCk7XG5cbiAgICByZXR1cm4gc3RyaW5nc1trZXldICE9PSB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGxhbmd1YWdlIGtleS5cbiAgICovXG4gIGFkZChrZXk6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IHRoaXMge1xuICAgIGNvbnN0IHN0cmluZ3MgPSB0aGlzLmdldFN0cmluZ3MoKTtcblxuICAgIHN0cmluZ3NbdGhpcy5ub3JtYWxpemUoa2V5KV0gPSB2YWx1ZTtcblxuICAgIGRhdGEoJ3VuaWNvcm4ubGFuZ3VhZ2VzJywgc3RyaW5ncyk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXBsYWNlIGFsbCBzeW1ib2xzIHRvIGRvdCguKS5cbiAgICovXG4gIHByb3RlY3RlZCBub3JtYWxpemUodGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9bXkEtWjAtOV0rL2lnLCAnLicpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHdyYXBEZWJ1Zyh0ZXh0OiBzdHJpbmcsIHN1Y2Nlc3M6IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgIGlmIChpc0RlYnVnKCkpIHtcbiAgICAgIGlmIChzdWNjZXNzKSB7XG4gICAgICAgIHJldHVybiAnKionICsgdGV4dCArICcqKic7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAnPz8nICsgdGV4dCArICc/Pyc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRleHQ7XG4gIH1cblxuICBnZXRTdHJpbmdzKCk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4ge1xuICAgIHJldHVybiBkYXRhKCd1bmljb3JuLmxhbmd1YWdlcycpIHx8IHt9O1xuICB9XG59XG4iLCJpbXBvcnQgeyBEaWN0aW9uYXJ5IH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgaW5qZWN0Q3NzVG9Eb2N1bWVudCB9IGZyb20gJy4vJztcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZVNjcmlwdEltcG9ydChzcmM6IHN0cmluZywgYXR0cnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fSk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgc2NyaXB0LnNyYyA9IHNyYztcblxuICBmb3IgKGNvbnN0IGtleSBpbiBhdHRycykge1xuICAgIHNjcmlwdC5zZXRBdHRyaWJ1dGUoa2V5LCBhdHRyc1trZXldKTtcbiAgfVxuXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgc2NyaXB0Lm9ubG9hZCA9ICgpID0+IHtcbiAgICAgIHJlc29sdmUoKTtcbiAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcbiAgICB9O1xuICAgIHNjcmlwdC5vbmVycm9yID0gKGUpID0+IHtcbiAgICAgIHJlamVjdChlKTtcbiAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcbiAgICB9O1xuXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRvSW1wb3J0PFQgPSBhbnk+KHNyYzogc3RyaW5nKTogUHJvbWlzZTxUPiB7XG4gIHJldHVybiBpbXBvcnQoLyogQHZpdGUtaWdub3JlICovc3JjKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUltcG9ydCguLi5zcmM6IGFueVtdKTogUHJvbWlzZTxhbnk+O1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUltcG9ydDxUIGV4dGVuZHMgYW55W10+KC4uLnNyYzogc3RyaW5nW10pOiBQcm9taXNlPFQ+O1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUltcG9ydDxUID0gYW55PihzcmM6IHN0cmluZyk6IFByb21pc2U8eyBkZWZhdWx0OiBUIH0+O1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUltcG9ydDxEID0gYW55LCBDID0gYW55PihzcmM6IHN0cmluZyk6IFByb21pc2U8eyBkZWZhdWx0OiBEIH0gJiBEaWN0aW9uYXJ5PEM+PjtcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VJbXBvcnQoLi4uc3JjOiBhbnlbXSk6IFByb21pc2U8YW55PiB7XG4gIGlmIChzcmMubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIGRvSW1wb3J0KHNyY1swXSk7XG4gIH1cblxuICBjb25zdCBwcm9taXNlczogUHJvbWlzZTxhbnk+W10gPSBbXTtcblxuICBzcmMuZm9yRWFjaCgobGluaykgPT4ge1xuICAgIHByb21pc2VzLnB1c2goXG4gICAgICBsaW5rIGluc3RhbmNlb2YgUHJvbWlzZSA/IGxpbmsgOiBkb0ltcG9ydChsaW5rKVxuICAgICk7XG4gIH0pO1xuXG4gIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VTZXJpZXNJbXBvcnQoLi4uc3JjOiBhbnlbXSk6IFByb21pc2U8YW55PjtcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VTZXJpZXNJbXBvcnQ8VCBleHRlbmRzIGFueVtdPiguLi5zcmM6IHN0cmluZ1tdKTogUHJvbWlzZTxUPjtcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VTZXJpZXNJbXBvcnQ8VCA9IGFueT4oc3JjOiBzdHJpbmcpOiBQcm9taXNlPHsgZGVmYXVsdDogVCB9PjtcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VTZXJpZXNJbXBvcnQ8RCA9IGFueSwgQyA9IGFueT4oc3JjOiBzdHJpbmcpOiBQcm9taXNlPHsgZGVmYXVsdDogRCB9ICYgRGljdGlvbmFyeTxDPj47XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlU2VyaWVzSW1wb3J0KC4uLnNyYzogYW55W10pOiBQcm9taXNlPGFueT4ge1xuICBjb25zdCBtb2R1bGVzOiBhbnlbXSA9IFtdO1xuXG4gIGZvciAoY29uc3Qgc291cmNlIG9mIHNyYykge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHNvdXJjZSkpIHtcbiAgICAgIGNvbnN0IG0gPSBhd2FpdCB1c2VJbXBvcnQoLi4uc291cmNlKTtcbiAgICAgIG1vZHVsZXMucHVzaChtKTtcblxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3QgbSA9IGF3YWl0IHVzZUltcG9ydChzb3VyY2UpO1xuXG4gICAgbW9kdWxlcy5wdXNoKG0pO1xuICB9XG5cbiAgcmV0dXJuIG1vZHVsZXM7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VDc3NJbmNsdWRlcyguLi5ocmVmczogc3RyaW5nW10pOiBQcm9taXNlPHZvaWRbXT4ge1xuICBjb25zdCBwcm9taXNlcyA9IGhyZWZzLm1hcCgoaHJlZikgPT4ge1xuICAgIGhyZWYgPSByZXNvbHZlVXJsKGhyZWYpO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW5rJyk7XG4gICAgICBsaW5rLnJlbCA9ICdzdHlsZXNoZWV0JztcbiAgICAgIGxpbmsuaHJlZiA9IGhyZWY7XG4gICAgICBsaW5rLm9ubG9hZCA9ICgpID0+IHJlc29sdmUoKTtcbiAgICAgIGxpbmsub25lcnJvciA9IChlKSA9PiByZWplY3QoZSk7XG5cbiAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQobGluayk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG59XG5cbmNvbnN0IGltcG9ydGVkU2hlZXRzOiBSZWNvcmQ8c3RyaW5nLCBQcm9taXNlPHsgZGVmYXVsdDogQ1NTU3R5bGVTaGVldCB9Pj4gPSB7fTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUNzc0ltcG9ydCguLi5ocmVmczogc3RyaW5nW10pOiBQcm9taXNlPENTU1N0eWxlU2hlZXRbXT4ge1xuICAvLyBUb2RvOiBVc2UgYHsgYXNzZXJ0OiB7IHR5cGU6IFwiY3NzXCIgfWAgYWZ0ZXIgYWxsIGJyb3dzZXJzIHN1cHBvcnQgaXQuXG4gIGNvbnN0IG1vZHVsZXMgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICBocmVmcy5tYXAoKGhyZWYpID0+IHtcbiAgICAgIGlmIChpbXBvcnRlZFNoZWV0c1tocmVmXSkge1xuICAgICAgICByZXR1cm4gaW1wb3J0ZWRTaGVldHNbaHJlZl07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBpbXBvcnRlZFNoZWV0c1tocmVmXSA9IHNpbXVsYXRlQ3NzSW1wb3J0KGhyZWYpO1xuICAgIH0pXG4gICk7XG4gIGNvbnN0IHN0eWxlcyA9IG1vZHVsZXMubWFwKG1vZHVsZSA9PiBtb2R1bGUuZGVmYXVsdCk7XG5cbiAgcmV0dXJuIGluamVjdENzc1RvRG9jdW1lbnQoLi4uc3R5bGVzKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gc2ltdWxhdGVDc3NJbXBvcnQoaHJlZjogc3RyaW5nKSB7XG4gIGhyZWYgPSByZXNvbHZlVXJsKGhyZWYpO1xuXG4gIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goaHJlZik7XG4gIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byBsb2FkIENTUzogJHtocmVmfWApO1xuICB9XG4gIGNvbnN0IGNzc1RleHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG5cbiAgY29uc3Qgc2hlZXQgPSBuZXcgQ1NTU3R5bGVTaGVldCgpO1xuICBhd2FpdCBzaGVldC5yZXBsYWNlKGNzc1RleHQpO1xuICByZXR1cm4geyBkZWZhdWx0OiBzaGVldCB9O1xufVxuXG5sZXQgaW1wb3J0TWFwOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuXG5mdW5jdGlvbiBwYXJzZUltcG9ydE1hcCgpIHtcbiAgY29uc3QgaW1wb3J0TWFwU2NyaXB0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcignc2NyaXB0W3R5cGU9XCJpbXBvcnRtYXBcIl0nKTtcbiAgaWYgKGltcG9ydE1hcFNjcmlwdCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gSlNPTi5wYXJzZShpbXBvcnRNYXBTY3JpcHQudGV4dENvbnRlbnQgfHwgJ3t9JykuaW1wb3J0cyB8fCB7fTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gcGFyc2UgaW1wb3J0IG1hcDonLCBlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHt9O1xufVxuXG5mdW5jdGlvbiByZXNvbHZlVXJsKHNwZWNpZmllcjogc3RyaW5nKSB7XG4gIGltcG9ydE1hcCA/Pz0gcGFyc2VJbXBvcnRNYXAoKTtcblxuICBmb3IgKGNvbnN0IFtwcmVmaXgsIHRhcmdldF0gb2YgT2JqZWN0LmVudHJpZXMoaW1wb3J0TWFwKSkge1xuICAgIGlmIChzcGVjaWZpZXIgPT09IHByZWZpeCkge1xuICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG4gIH1cblxuICBmb3IgKGNvbnN0IFtwcmVmaXgsIHRhcmdldF0gb2YgT2JqZWN0LmVudHJpZXMoaW1wb3J0TWFwKSkge1xuICAgIGlmIChzcGVjaWZpZXIuc3RhcnRzV2l0aChwcmVmaXgpKSB7XG4gICAgICByZXR1cm4gc3BlY2lmaWVyLnJlcGxhY2UocHJlZml4LCB0YXJnZXQpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3BlY2lmaWVyO1xufVxuIiwiaW1wb3J0IHR5cGUgeyBDaGVja2JveGVzTXVsdGlTZWxlY3QgfSBmcm9tICcuLi9tb2R1bGUvY2hlY2tib3hlcy1tdWx0aS1zZWxlY3QnO1xuaW1wb3J0IHR5cGUgeyBOdWxsYWJsZSB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUNoZWNrYm94ZXNNdWx0aVNlbGVjdCgpOiBQcm9taXNlPGFueT47XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VDaGVja2JveGVzTXVsdGlTZWxlY3QoXG4gIHNlbGVjdG9yPzogTnVsbGFibGU8c3RyaW5nIHwgSFRNTEVsZW1lbnQ+LFxuICBvcHRpb25zPzogUmVjb3JkPHN0cmluZywgYW55PlxuKTogUHJvbWlzZTxDaGVja2JveGVzTXVsdGlTZWxlY3Q+O1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlQ2hlY2tib3hlc011bHRpU2VsZWN0KFxuICBzZWxlY3Rvcj86IE51bGxhYmxlPHN0cmluZyB8IEhUTUxFbGVtZW50PixcbiAgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9XG4pOiBQcm9taXNlPGFueT4ge1xuICBjb25zdCBtID0gYXdhaXQgaW1wb3J0KCcuLi9tb2R1bGUvY2hlY2tib3hlcy1tdWx0aS1zZWxlY3QnKTtcblxuICBpZiAoc2VsZWN0b3IpIHtcbiAgICBtLkNoZWNrYm94ZXNNdWx0aVNlbGVjdC5oYW5kbGUoc2VsZWN0b3IsIG9wdGlvbnMpO1xuICB9XG5cbiAgcmV0dXJuIG07XG59XG4iLCJpbXBvcnQgeyBDYXNjYWRlU2VsZWN0TW9kdWxlIH0gZnJvbSAnLi4vbW9kdWxlL2ZpZWxkLWNhc2NhZGUtc2VsZWN0JztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUZpZWxkQ2FzY2FkZVNlbGVjdCgpOiBQcm9taXNlPENhc2NhZGVTZWxlY3RNb2R1bGU+IHtcbiAgY29uc3QgbW9kdWxlID0gYXdhaXQgaW1wb3J0KCcuLi9tb2R1bGUvZmllbGQtY2FzY2FkZS1zZWxlY3QnKTtcblxuICBhd2FpdCBtb2R1bGUucmVhZHk7XG5cbiAgcmV0dXJuIG1vZHVsZTtcbn1cbiIsImltcG9ydCB7IEZpbGVEcmFnTW9kdWxlIH0gZnJvbSAnLi4vbW9kdWxlL2ZpZWxkLWZpbGUtZHJhZyc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VGaWVsZEZpbGVEcmFnKCk6IFByb21pc2U8RmlsZURyYWdNb2R1bGU+IHtcbiAgY29uc3QgbW9kdWxlID0gYXdhaXQgaW1wb3J0KCcuLi9tb2R1bGUvZmllbGQtZmlsZS1kcmFnJyk7XG5cbiAgYXdhaXQgbW9kdWxlLnJlYWR5O1xuXG4gIHJldHVybiBtb2R1bGU7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gdXNlRmllbGRGbGF0cGlja3IoKTogUHJvbWlzZTxhbnk+IHtcbiAgcmV0dXJuIGltcG9ydCgnLi4vbW9kdWxlL2ZpZWxkLWZsYXRwaWNrcicpO1xufVxuIiwiaW1wb3J0IHR5cGUgeyBNb2RhbFNlbGVjdE1vZHVsZSB9IGZyb20gJy4uL21vZHVsZS9maWVsZC1tb2RhbC1zZWxlY3QnO1xuXG5leHBvcnQgZnVuY3Rpb24gdXNlRmllbGRNb2RhbFNlbGVjdCgpOiBQcm9taXNlPE1vZGFsU2VsZWN0TW9kdWxlPiB7XG4gIC8vIE1vZGFsIHNlbGVjdCBoYXMgbm8gZXhwb3J0cyBub3dcbiAgcmV0dXJuIGltcG9ydCgnLi4vbW9kdWxlL2ZpZWxkLW1vZGFsLXNlbGVjdCcpO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIHVzZUZpZWxkTW9kYWxUcmVlKCkge1xuICBpbXBvcnQoJy4uL21vZHVsZS9maWVsZC1tb2RhbC10cmVlJyk7XG59XG4iLCJpbXBvcnQgeyBSZXBlYXRhYmxlTW9kdWxlIH0gZnJvbSAnLi4vbW9kdWxlL2ZpZWxkLXJlcGVhdGFibGUnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlRmllbGRSZXBlYXRhYmxlKCk6IFByb21pc2U8UmVwZWF0YWJsZU1vZHVsZT4ge1xuICBjb25zdCBtb2R1bGUgPSBhd2FpdCBpbXBvcnQoJy4uL21vZHVsZS9maWVsZC1yZXBlYXRhYmxlJyk7XG5cbiAgYXdhaXQgbW9kdWxlLnJlYWR5O1xuXG4gIHJldHVybiBtb2R1bGU7XG59XG4iLCJpbXBvcnQgeyBTaW5nbGVJbWFnZURyYWdNb2R1bGUgfSBmcm9tICcuLi9tb2R1bGUvZmllbGQtc2luZ2xlLWltYWdlLWRyYWcnO1xuXG5leHBvcnQgZnVuY3Rpb24gdXNlRmllbGRTaW5nbGVJbWFnZURyYWcoKTogUHJvbWlzZTxTaW5nbGVJbWFnZURyYWdNb2R1bGU+IHtcbiAgcmV0dXJuIGltcG9ydCgnLi4vbW9kdWxlL2ZpZWxkLXNpbmdsZS1pbWFnZS1kcmFnJyk7XG59XG4iLCJpbXBvcnQgdHlwZSB7IFVuaWNvcm5Gb3JtRWxlbWVudCB9IGZyb20gJy4uL21vZHVsZS9mb3JtJztcbmltcG9ydCB7IHNlbGVjdE9uZSwgbW9kdWxlIH0gZnJvbSAnLi4vc2VydmljZSc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VGb3JtKGVsZT86IHN0cmluZyB8IEVsZW1lbnQsIG9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fSk6IFByb21pc2U8VW5pY29ybkZvcm1FbGVtZW50PiB7XG4gIGNvbnN0IHsgVW5pY29ybkZvcm1FbGVtZW50IH0gPSBhd2FpdCBpbXBvcnQoJy4uL21vZHVsZS9mb3JtJyk7XG5cbiAgaWYgKGVsZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIG5ldyBVbmljb3JuRm9ybUVsZW1lbnQodW5kZWZpbmVkLCB1bmRlZmluZWQsIG9wdGlvbnMpO1xuICB9XG5cbiAgY29uc3Qgc2VsZWN0b3IgPSB0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IHVuZGVmaW5lZDtcbiAgY29uc3QgZWwgPSBzZWxlY3RPbmU8SFRNTEZvcm1FbGVtZW50PihlbGUgYXMgc3RyaW5nKTtcblxuICBpZiAoIWVsKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBGb3JtIGVsZW1lbnQgb2Y6ICR7c2VsZWN0b3J9IG5vdCBmb3VuZC5gKTtcbiAgfVxuXG4gIHJldHVybiBtb2R1bGUoXG4gICAgZWwsXG4gICAgJ3VuaWNvcm4uZm9ybScsXG4gICAgKCkgPT4gbmV3IFVuaWNvcm5Gb3JtRWxlbWVudChzZWxlY3RvciwgZWwsIG9wdGlvbnMpXG4gICk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VGb3JtQ29tcG9uZW50KGVsZT86IHN0cmluZyB8IEVsZW1lbnQsIG9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fSkge1xuICBjb25zdCBmb3JtID0gYXdhaXQgdXNlRm9ybShlbGUsIG9wdGlvbnMpO1xuXG4gIGF3YWl0IGZvcm0uaW5pdENvbXBvbmVudCgpO1xuXG4gIHJldHVybiBmb3JtO1xufVxuIiwiaW1wb3J0IHR5cGUgeyBVbmljb3JuR3JpZEVsZW1lbnQgfSBmcm9tICcuLi9tb2R1bGUvZ3JpZCc7XG5pbXBvcnQgeyB1c2VGb3JtIH0gZnJvbSAnLi91c2VGb3JtJztcbmltcG9ydCB7IHNlbGVjdE9uZSwgbW9kdWxlIH0gZnJvbSAnLi4vc2VydmljZSc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VHcmlkKFxuICBlbGU6IHN0cmluZyB8IEhUTUxFbGVtZW50LFxuICBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgdW5kZWZpbmVkID0ge31cbik6IFByb21pc2U8VW5pY29ybkdyaWRFbGVtZW50PiB7XG4gIGNvbnN0IHsgVW5pY29ybkdyaWRFbGVtZW50IH0gPSBhd2FpdCBpbXBvcnQoJy4uL21vZHVsZS9ncmlkJyk7XG5cbiAgY29uc3Qgc2VsZWN0b3IgPSB0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6ICcnO1xuICBjb25zdCBlbGVtZW50ID0gc2VsZWN0T25lKGVsZSk7XG5cbiAgaWYgKCFlbGVtZW50KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFbGVtZW50IGlzIGVtcHR5Jyk7XG4gIH1cblxuICBjb25zdCBmb3JtID0gYXdhaXQgdXNlRm9ybShzZWxlY3RvciB8fCBlbGVtZW50KTtcblxuICByZXR1cm4gbW9kdWxlKFxuICAgIGVsZW1lbnQsXG4gICAgJ2dyaWQucGx1Z2luJyxcbiAgICAoKSA9PiBuZXcgVW5pY29ybkdyaWRFbGVtZW50KHNlbGVjdG9yLCBlbGVtZW50LCBmb3JtLCBvcHRpb25zKVxuICApO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlR3JpZENvbXBvbmVudChcbiAgZWxlOiBzdHJpbmcgfCBIVE1MRWxlbWVudCxcbiAgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55PiB8IHVuZGVmaW5lZCA9IHt9XG4pOiBQcm9taXNlPFVuaWNvcm5HcmlkRWxlbWVudD4ge1xuICBjb25zdCBncmlkID0gYXdhaXQgdXNlR3JpZChlbGUsIG9wdGlvbnMpO1xuXG4gIGF3YWl0IGdyaWQuaW5pdENvbXBvbmVudCgpO1xuXG4gIHJldHVybiBncmlkO1xufVxuIiwiaW1wb3J0IHR5cGUgeyBVbmljb3JuSHR0cENsaWVudCB9IGZyb20gJy4uL21vZHVsZS9odHRwLWNsaWVudCc7XG5pbXBvcnQgdHlwZSB7IEF4aW9zSW5zdGFuY2UsIENyZWF0ZUF4aW9zRGVmYXVsdHMgfSBmcm9tICdheGlvcyc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VIdHRwQ2xpZW50KGNvbmZpZz86IENyZWF0ZUF4aW9zRGVmYXVsdHMgfCBBeGlvc0luc3RhbmNlKTogUHJvbWlzZTxVbmljb3JuSHR0cENsaWVudD4ge1xuICBjb25zdCB7IFVuaWNvcm5IdHRwQ2xpZW50IH0gPSBhd2FpdCBpbXBvcnQoJy4uL21vZHVsZS9odHRwLWNsaWVudCcpO1xuXG4gIGlmIChjb25maWcgJiYgJ2ludGVyY2VwdG9ycycgaW4gY29uZmlnKSB7XG4gICAgY29uc3QgYXhpb3MgPSBjb25maWcgYXMgQXhpb3NJbnN0YW5jZTtcblxuICAgIGNvbnN0IGh0dHAgPSBuZXcgVW5pY29ybkh0dHBDbGllbnQoKTtcblxuICAgIGh0dHAuYXhpb3MgPSBheGlvcztcblxuICAgIHJldHVybiBodHRwO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBVbmljb3JuSHR0cENsaWVudChjb25maWcgYXMgQ3JlYXRlQXhpb3NEZWZhdWx0cyB8IHVuZGVmaW5lZCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VMb2FkZWRIdHRwQ2xpZW50KGNvbmZpZz86IENyZWF0ZUF4aW9zRGVmYXVsdHMpOiBQcm9taXNlPFVuaWNvcm5IdHRwQ2xpZW50PiB7XG4gIGNvbnN0IGh0dHAgPSBhd2FpdCB1c2VIdHRwQ2xpZW50KGNvbmZpZyk7XG5cbiAgLy8gTG9hZCBhbmQgY2FjaGUgYXhpb3NcbiAgYXdhaXQgaHR0cC5nZXRBeGlvc0luc3RhbmNlKCk7XG5cbiAgcmV0dXJuIGh0dHA7XG59XG4iLCJpbXBvcnQgeyBJZnJhbWVNb2RhbE1vZHVsZSB9IGZyb20gJy4uL21vZHVsZS9pZnJhbWUtbW9kYWwnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlSWZyYW1lTW9kYWwoKTogUHJvbWlzZTxJZnJhbWVNb2RhbE1vZHVsZT4ge1xuICBjb25zdCBtb2R1bGUgPSBhd2FpdCBpbXBvcnQoJy4uL21vZHVsZS9pZnJhbWUtbW9kYWwnKTtcblxuICBhd2FpdCBtb2R1bGUucmVhZHk7XG5cbiAgcmV0dXJuIG1vZHVsZTtcbn1cbiIsImltcG9ydCB0eXBlIHsgTGlzdERlcGVuZGVudCwgTGlzdERlcGVuZGVudE1vZHVsZSwgTGlzdERlcGVuZGVudE9wdGlvbnMgfSBmcm9tICcuLi9tb2R1bGUvbGlzdC1kZXBlbmRlbnQnO1xuaW1wb3J0IHsgTnVsbGFibGUgfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VMaXN0RGVwZW5kZW50KCk6IFByb21pc2U8TGlzdERlcGVuZGVudE1vZHVsZT47XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlTGlzdERlcGVuZGVudChcbiAgZWxlbWVudDogc3RyaW5nIHwgSFRNTEVsZW1lbnQsXG4gIGRlcGVuZGVudD86IE51bGxhYmxlPHN0cmluZyB8IEhUTUxFbGVtZW50PixcbiAgb3B0aW9ucz86IFBhcnRpYWw8TGlzdERlcGVuZGVudE9wdGlvbnM+XG4pOiBQcm9taXNlPExpc3REZXBlbmRlbnQ+O1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUxpc3REZXBlbmRlbnQoXG4gIGVsZW1lbnQ/OiBOdWxsYWJsZTxzdHJpbmcgfCBIVE1MRWxlbWVudD4sXG4gIGRlcGVuZGVudD86IE51bGxhYmxlPHN0cmluZyB8IEhUTUxFbGVtZW50PixcbiAgb3B0aW9uczogUGFydGlhbDxMaXN0RGVwZW5kZW50T3B0aW9ucz4gPSB7fVxuKTogUHJvbWlzZTxhbnk+IHtcbiAgY29uc3QgbW9kdWxlID0gYXdhaXQgaW1wb3J0KCcuLi9tb2R1bGUvbGlzdC1kZXBlbmRlbnQnKTtcblxuICBhd2FpdCBtb2R1bGUucmVhZHk7XG5cbiAgaWYgKGVsZW1lbnQpIHtcbiAgICBjb25zdCB7IExpc3REZXBlbmRlbnQgfSA9IG1vZHVsZTtcblxuICAgIHJldHVybiBMaXN0RGVwZW5kZW50LmhhbmRsZShlbGVtZW50LCBkZXBlbmRlbnQsIG9wdGlvbnMpO1xuICB9XG5cbiAgcmV0dXJuIG1vZHVsZTtcbn1cbiIsImltcG9ydCB7IERpY3Rpb25hcnkgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBUYXNrUXVldWUsIHF1ZXVlIH0gZnJvbSAnQGx5cmFzb2Z0L3RzLXRvb2xraXQvZ2VuZXJpYyc7XG5cbmNvbnN0IHF1ZXVlczogRGljdGlvbmFyeTxUYXNrUXVldWU+ID0ge307XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VRdWV1ZShuYW1lOiBzdHJpbmcgPSAnZGVmYXVsdCcsIG1heFJ1bm5pbmcgPSAxKTogVGFza1F1ZXVlIHtcbiAgcmV0dXJuIHF1ZXVlc1tuYW1lXSA/Pz0gY3JlYXRlUXVldWUobWF4UnVubmluZyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVRdWV1ZShtYXhSdW5uaW5nID0gMSk6IFRhc2tRdWV1ZSB7XG4gIHJldHVybiBxdWV1ZShtYXhSdW5uaW5nKTtcbn1cblxuIiwiaW1wb3J0IHR5cGUgeyBTM1VwbG9hZGVyLCBTM1VwbG9hZGVyR2xvYmFsT3B0aW9ucywgUzNVcGxvYWRlck1vZHVsZSB9IGZyb20gJy4uL21vZHVsZS9zMy11cGxvYWRlcic7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VTM1VwbG9hZGVyKCk6IFByb21pc2U8UzNVcGxvYWRlck1vZHVsZT47XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlUzNVcGxvYWRlcihuYW1lOiBzdHJpbmcsIG9wdGlvbnM/OiBQYXJ0aWFsPFMzVXBsb2FkZXJHbG9iYWxPcHRpb25zPik6IFByb21pc2U8UzNVcGxvYWRlcj47XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlUzNVcGxvYWRlcihuYW1lPzogc3RyaW5nLCBvcHRpb25zOiBQYXJ0aWFsPFMzVXBsb2FkZXJHbG9iYWxPcHRpb25zPiA9IHt9KTogUHJvbWlzZTxhbnk+IHtcbiAgY29uc3QgbW9kdWxlID0gYXdhaXQgaW1wb3J0KCcuLi9tb2R1bGUvczMtdXBsb2FkZXInKTtcblxuICBpZiAoIW5hbWUpIHtcbiAgICByZXR1cm4gbW9kdWxlO1xuICB9XG5cbiAgY29uc3QgeyBnZXQgfSA9IG1vZHVsZTtcblxuICByZXR1cm4gZ2V0KG5hbWUsIG9wdGlvbnMpO1xufVxuIiwiaW1wb3J0IHsgU2hvd09uTW9kdWxlIH0gZnJvbSAnLi4vbW9kdWxlL3Nob3ctb24nO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlU2hvd09uKCk6IFByb21pc2U8U2hvd09uTW9kdWxlPiB7XG4gIGNvbnN0IG1vZHVsZSA9IGF3YWl0IGltcG9ydCgnLi4vbW9kdWxlL3Nob3ctb24nKTtcblxuICBhd2FpdCBtb2R1bGUucmVhZHk7XG5cbiAgcmV0dXJuIG1vZHVsZTtcbn1cbiIsIlxuaW1wb3J0IHsgRGljdGlvbmFyeSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IFN0YWNrLCBzdGFjayB9IGZyb20gJ0BseXJhc29mdC90cy10b29sa2l0L2dlbmVyaWMnO1xuXG5jb25zdCBzdGFja3M6IERpY3Rpb25hcnk8U3RhY2s+ID0ge307XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VTdGFjazxUID0gYW55PihuYW1lOiBzdHJpbmcgPSAnZGVmYXVsdCcsIHN0b3JlOiBhbnlbXSA9IFtdKTogU3RhY2s8VD4ge1xuICByZXR1cm4gc3RhY2tzW25hbWVdID8/PSBjcmVhdGVTdGFjazxUPihzdG9yZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTdGFjazxUID0gYW55PihzdG9yZTogYW55W10gPSBbXSk6IFN0YWNrPFQ+IHtcbiAgcmV0dXJuIHN0YWNrPFQ+KHN0b3JlKTtcbn1cbiIsImltcG9ydCB7IG1vZHVsZSwgdXNlQ3NzSW1wb3J0LCB1c2VDc3NJbmNsdWRlcywgdXNlSW1wb3J0LCB3YWl0IH0gZnJvbSAnLi4vc2VydmljZSc7XG5pbXBvcnQgdHlwZSB7IE51bGxhYmxlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgbWVyZ2VEZWVwIH0gZnJvbSAnLi4vdXRpbGl0aWVzJztcblxuLyoqXG4gKiBAc2VlIGh0dHBzOi8vdG9tLXNlbGVjdC5qcy5vcmcvXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VUb21TZWxlY3QoXG4gIHNlbGVjdG9yPzogTnVsbGFibGU8c3RyaW5nIHwgSFRNTEVsZW1lbnQgfCBOb2RlTGlzdE9mPEhUTUxFbGVtZW50Pj4sXG4gIG9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fSxcbiAgdGhlbWU6IHN0cmluZyA9ICdib290c3RyYXA1J1xuKSB7XG4gIGNvbnN0IFttXSA9IGF3YWl0IHdhaXQoXG4gICAgdXNlSW1wb3J0KCdAdmVuZG9yL3RvbS1zZWxlY3QvZGlzdC9qcy90b20tc2VsZWN0LmNvbXBsZXRlLm1pbi5qcycpLFxuICAgIHVzZUNzc0ltcG9ydChgQHZlbmRvci90b20tc2VsZWN0L2Rpc3QvY3NzL3RvbS1zZWxlY3QuJHt0aGVtZX0ubWluLmNzc2ApXG4gICk7XG5cbiAgaWYgKHNlbGVjdG9yKSB7XG4gICAgbW9kdWxlPGFueSwgSFRNTFNlbGVjdEVsZW1lbnQ+KFxuICAgICAgc2VsZWN0b3IsXG4gICAgICAndG9tLnNlbGVjdCcsXG4gICAgICAoZWxlKSA9PiB7XG4gICAgICAgIG9wdGlvbnMgPSBtZXJnZURlZXAoe1xuICAgICAgICAgIGFsbG93RW1wdHlPcHRpb246IHRydWUsXG4gICAgICAgICAgbWF4T3B0aW9uczogbnVsbCxcbiAgICAgICAgICBwbHVnaW5zOiB7XG4gICAgICAgICAgICBjYXJldF9wb3NpdGlvbjoge30sXG4gICAgICAgICAgICBjbGVhcl9idXR0b246IHt9LFxuICAgICAgICAgIH1cbiAgICAgICAgfSwgb3B0aW9ucyk7XG5cbiAgICAgICAgaWYgKChlbGUgYXMgSFRNTFNlbGVjdEVsZW1lbnQpLm11bHRpcGxlKSB7XG4gICAgICAgICAgb3B0aW9ucy5wbHVnaW5zLnJlbW92ZV9idXR0b24gPSB7fTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvcHRpb25zLnBsdWdpbnMuZHJvcGRvd25faW5wdXQgPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEF1dG8gc2VsZWN0IGZpcnN0IGlmIG9wdGlvbnMgY2hhbmdlZC5cbiAgICAgICAgLy8gQHNlZSBodHRwczovL2dpdGh1Yi5jb20vb3JjaGlkanMvdG9tLXNlbGVjdC9pc3N1ZXMvMzYyXG4gICAgICAgIGNsYXNzIFVuaWNvcm5Ub21TZWxlY3QgZXh0ZW5kcyBUb21TZWxlY3Qge1xuICAgICAgICAgIHN5bmNPcHRpb25zV2l0aG91dEtlZXBTZWxlY3RlZCgpIHtcbiAgICAgICAgICAgIGNvbnN0IG9sZFZhbHVlID0gZWxlLnZhbHVlO1xuXG4gICAgICAgICAgICB0aGlzLmNsZWFyKCk7XG4gICAgICAgICAgICB0aGlzLmNsZWFyT3B0aW9ucygpO1xuICAgICAgICAgICAgdGhpcy5zeW5jKCk7XG5cbiAgICAgICAgICAgIGlmIChlbGUudmFsdWUgIT09IG9sZFZhbHVlKSB7XG4gICAgICAgICAgICAgIHRoaXMuc2V0VmFsdWUoXG4gICAgICAgICAgICAgICAgZWxlLnF1ZXJ5U2VsZWN0b3I8SFRNTE9wdGlvbkVsZW1lbnQ+KGBvcHRpb25bdmFsdWU9XCIke29sZFZhbHVlfVwiXWApPy52YWx1ZVxuICAgICAgICAgICAgICAgID8/IGVsZS5xdWVyeVNlbGVjdG9yPEhUTUxPcHRpb25FbGVtZW50Pignb3B0aW9uJyk/LnZhbHVlXG4gICAgICAgICAgICAgICAgPz8gJycsXG4gICAgICAgICAgICAgICAgdHJ1ZVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgY29uc3QgdCA9IG5ldyBVbmljb3JuVG9tU2VsZWN0KGVsZSBhcyBUb21JbnB1dCwgb3B0aW9ucyk7XG5cbiAgICAgICAgZWxlLmFkZEV2ZW50TGlzdGVuZXIoJ2xpc3Q6dXBkYXRlZCcsICgpID0+IHtcbiAgICAgICAgICB0LnN5bmNPcHRpb25zV2l0aG91dEtlZXBTZWxlY3RlZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdDtcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIG07XG59XG4iLCJpbXBvcnQgdHlwZSB7IFRvb2x0aXAgfSBmcm9tICdib290c3RyYXAnO1xuaW1wb3J0IHsgQnV0dG9uUmFkaW9PcHRpb25zIH0gZnJvbSAnLi4vYm9vdHN0cmFwL2J1dHRvbi1yYWRpbyc7XG5pbXBvcnQgdHlwZSB7IEtlZXBUYWIsIEtlZXBUYWJNb2R1bGUsIEtlZXBUYWJPcHRpb25zIH0gZnJvbSAnLi4vYm9vdHN0cmFwL2tlZXAtdGFiJztcbmltcG9ydCB0eXBlIHsgVUlCb290c3RyYXA1IH0gZnJvbSAnLi4vbW9kdWxlL3VpLWJvb3RzdHJhcDUnO1xuaW1wb3J0IHsgdXNlVUlUaGVtZSB9IGZyb20gJy4uL3NlcnZpY2UnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlVUlCb290c3RyYXA1KGluc3RhbGwgPSBmYWxzZSwgcHVzaFRvR2xvYmFsID0gZmFsc2UpOiBQcm9taXNlPFVJQm9vdHN0cmFwNT4ge1xuICBjb25zdCB7IFVJQm9vdHN0cmFwNSB9ID0gYXdhaXQgaW1wb3J0KCcuLi9tb2R1bGUvdWktYm9vdHN0cmFwNScpO1xuXG4gIGNvbnN0IHRoZW1lID0gVUlCb290c3RyYXA1LmdldCgpO1xuXG4gIGlmIChpbnN0YWxsKSB7XG4gICAgdXNlVUlUaGVtZSh0aGVtZSk7XG5cbiAgICBpZiAocHVzaFRvR2xvYmFsKSB7XG4gICAgICB0aGVtZS5wdXNoQm9vdHN0cmFwVG9HbG9iYWwoKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhlbWU7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VCczVUb29sdGlwKFxuICBzZWxlY3RvcjogTm9kZUxpc3RPZjxFbGVtZW50PiB8IEVsZW1lbnQgfCBzdHJpbmcgPSAnW2RhdGEtYnMtdG9nZ2xlPVwidG9vbHRpcFwiXScsXG4gIGNvbmZpZzogUGFydGlhbDxUb29sdGlwLk9wdGlvbnM+ID0ge31cbik6IFByb21pc2U8VG9vbHRpcFtdPiB7XG4gIGNvbnN0IGJzNSA9IGF3YWl0IHVzZVVJQm9vdHN0cmFwNSgpO1xuXG4gIHJldHVybiBiczUudG9vbHRpcChzZWxlY3RvciwgY29uZmlnKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUJzNUtlZXBUYWIoc2VsZWN0b3I/OiBzdHJpbmcgfCBIVE1MRWxlbWVudCwgb3B0aW9uczogS2VlcFRhYk9wdGlvbnMgPSB7fSkge1xuICBjb25zdCBiczUgPSBhd2FpdCB1c2VVSUJvb3RzdHJhcDUoKTtcblxuICByZXR1cm4gYnM1LmtlZXBUYWIoc2VsZWN0b3IsIG9wdGlvbnMpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlQnM1QnV0dG9uUmFkaW8oc2VsZWN0b3I/OiBzdHJpbmcgfCBIVE1MRWxlbWVudCwgb3B0aW9uczogQnV0dG9uUmFkaW9PcHRpb25zID0ge30pIHtcbiAgY29uc3QgYnM1ID0gYXdhaXQgdXNlVUlCb290c3RyYXA1KCk7XG5cbiAgcmV0dXJuIGJzNS5idXR0b25SYWRpbyhzZWxlY3Rvciwgb3B0aW9ucyk7XG59XG4iLCJpbXBvcnQgeyBEaWN0aW9uYXJ5IH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHR5cGUgeyBkZWZhdWx0IGFzIFdlYkRpcmVjdGl2ZSB9IGZyb20gJ3dlYi1kaXJlY3RpdmUnO1xuaW1wb3J0IHR5cGUgeyBXZWJEaXJlY3RpdmVIYW5kbGVyLCBXZWJEaXJlY3RpdmVPcHRpb25zIH0gZnJvbSAnd2ViLWRpcmVjdGl2ZS9zcmMvdHlwZXMnO1xuXG5sZXQgaW5zdGFuY2VzOiBEaWN0aW9uYXJ5PFdlYkRpcmVjdGl2ZT4gPSB7fTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZVdlYkRpcmVjdGl2ZShcbiAgbmFtZTogc3RyaW5nID0gJ3VuaWNvcm4nLFxuICBvcHRpb25zOiBQYXJ0aWFsPFdlYkRpcmVjdGl2ZU9wdGlvbnM+ID0ge31cbik6IFByb21pc2U8V2ViRGlyZWN0aXZlPiB7XG4gIHJldHVybiBpbnN0YW5jZXNbbmFtZV0gPz89IGF3YWl0IGNyZWF0ZVdlYkRpcmVjdGl2ZShPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCB7IHByZWZpeDogJ3VuaS0nIH0pKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZVVuaURpcmVjdGl2ZShcbiAgbmFtZTogc3RyaW5nLFxuICBoYW5kbGVyOiBXZWJEaXJlY3RpdmVIYW5kbGVyLFxuICB3ZEluc3RhbmNlOiBXZWJEaXJlY3RpdmUgfCBzdHJpbmcgPSAndW5pY29ybidcbik6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCB3ZCA9IHR5cGVvZiB3ZEluc3RhbmNlID09PSAnc3RyaW5nJyA/IGF3YWl0IHVzZVdlYkRpcmVjdGl2ZSh3ZEluc3RhbmNlKSA6IHdkSW5zdGFuY2U7XG5cbiAgd2QucmVnaXN0ZXIobmFtZSwgaGFuZGxlcik7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVdlYkRpcmVjdGl2ZShvcHRpb25zOiBQYXJ0aWFsPFdlYkRpcmVjdGl2ZU9wdGlvbnM+ID0ge30pOiBQcm9taXNlPFdlYkRpcmVjdGl2ZT4ge1xuICBjb25zdCBXZWJEaXJlY3RpdmUgPSAoYXdhaXQgaW1wb3J0KCd3ZWItZGlyZWN0aXZlJykpLmRlZmF1bHQ7XG5cbiAgY29uc3Qgd2QgPSBuZXcgV2ViRGlyZWN0aXZlKG9wdGlvbnMpO1xuICB3ZC5saXN0ZW4oKTtcblxuICByZXR1cm4gd2Q7XG59XG4iLCJpbXBvcnQgdHlwZSB7XG4gIFVuaWNvcm5GaWVsZFZhbGlkYXRpb24sXG4gIFVuaWNvcm5Gb3JtVmFsaWRhdGlvbixcbiAgVmFsaWRhdGlvbkhhbmRsZXIsXG4gIFZhbGlkYXRpb25Nb2R1bGVcbn0gZnJvbSAnLi4vbW9kdWxlL3ZhbGlkYXRpb24nO1xuaW1wb3J0IHsgZ2V0Qm91bmRlZEluc3RhbmNlIH0gZnJvbSAnLi4vc2VydmljZSc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VGb3JtVmFsaWRhdGlvbigpOiBQcm9taXNlPFZhbGlkYXRpb25Nb2R1bGU+O1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUZvcm1WYWxpZGF0aW9uKHNlbGVjdG9yOiBzdHJpbmcgfCBFbGVtZW50KTogUHJvbWlzZTxVbmljb3JuRm9ybVZhbGlkYXRpb24+O1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUZvcm1WYWxpZGF0aW9uKHNlbGVjdG9yPzogc3RyaW5nIHwgRWxlbWVudCk6IFByb21pc2U8YW55PiB7XG4gIGNvbnN0IG1vZHVsZSA9IGF3YWl0IGltcG9ydCgnLi4vbW9kdWxlL3ZhbGlkYXRpb24nKTtcblxuICBhd2FpdCBtb2R1bGUucmVhZHk7XG5cbiAgaWYgKCFzZWxlY3Rvcikge1xuICAgIHJldHVybiBtb2R1bGU7XG4gIH1cblxuICByZXR1cm4gdXNlRm9ybVZhbGlkYXRpb25TeW5jKHNlbGVjdG9yKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUZvcm1WYWxpZGF0aW9uU3luYyhzZWxlY3Rvcjogc3RyaW5nIHwgRWxlbWVudCk6IFVuaWNvcm5Gb3JtVmFsaWRhdGlvbiB7XG4gIHJldHVybiBnZXRCb3VuZGVkSW5zdGFuY2U8VW5pY29ybkZvcm1WYWxpZGF0aW9uPihzZWxlY3RvciwgJ2Zvcm0udmFsaWRhdGlvbicpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXNlRmllbGRWYWxpZGF0aW9uU3luYyhzZWxlY3Rvcjogc3RyaW5nIHwgRWxlbWVudCk6IFVuaWNvcm5GaWVsZFZhbGlkYXRpb24ge1xuICByZXR1cm4gZ2V0Qm91bmRlZEluc3RhbmNlPFVuaWNvcm5GaWVsZFZhbGlkYXRpb24+KHNlbGVjdG9yLCAnZmllbGQudmFsaWRhdGlvbicpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYWRkR2xvYmFsVmFsaWRhdG9yKG5hbWU6IHN0cmluZywgdmFsaWRhdG9yOiBWYWxpZGF0aW9uSGFuZGxlciwgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9KSB7XG4gIGNvbnN0IHsgVW5pY29ybkZvcm1WYWxpZGF0aW9uIH0gPSBhd2FpdCB1c2VGb3JtVmFsaWRhdGlvbigpO1xuXG4gIFVuaWNvcm5Gb3JtVmFsaWRhdGlvbi5hZGRHbG9iYWxWYWxpZGF0b3IobmFtZSwgdmFsaWRhdG9yLCBvcHRpb25zKTtcbn1cbiIsImltcG9ydCB7IEFsZXJ0QWRhcHRlciwgZGVsZXRlQ29uZmlybSwgc2ltcGxlQWxlcnQsIHNpbXBsZUNvbmZpcm0gfSBmcm9tICdAbHlyYXNvZnQvdHMtdG9vbGtpdC9nZW5lcmljJztcbmltcG9ydCB0eXBlIHsgQWxwaW5lIGFzIEFscGluZUdsb2JhbCB9IGZyb20gJ2FscGluZWpzJztcbmltcG9ydCB0eXBlIHsgZGVmYXVsdCBhcyBTcGVjdHJ1bUdsb2JhbCB9IGZyb20gJ3NwZWN0cnVtLXZhbmlsbGEnO1xuaW1wb3J0IHR5cGUgeyBTcGVjdHJ1bU9wdGlvbnMgfSBmcm9tICdzcGVjdHJ1bS12YW5pbGxhL2Rpc3QvdHlwZXMvdHlwZXMnO1xuaW1wb3J0IHR5cGUgeyBkZWZhdWx0IGFzIFRvbVNlbGVjdEdsb2JhbCB9IGZyb20gJ3RvbS1zZWxlY3QnO1xuaW1wb3J0IHsgdXNlU3RhY2sgfSBmcm9tICcuLi9jb21wb3NhYmxlJztcbmltcG9ydCB7IGRhdGEsIHJlbW92ZURhdGEgfSBmcm9tICcuLi9kYXRhJztcbmltcG9ydCB0eXBlIHsgQ29uc3RydWN0b3IsIE1heWJlUHJvbWlzZSwgTnVsbGFibGUsIFVJVGhlbWVJbnRlcmZhY2UgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBhbmltYXRlVG8gfSBmcm9tICcuL2FuaW1hdGUnO1xuaW1wb3J0IHsgaHRtbCwgbW9kdWxlLCBzZWxlY3RBbGwsIHNlbGVjdE9uZSB9IGZyb20gJy4vZG9tJztcbmltcG9ydCB7IG5leHRUaWNrIH0gZnJvbSAnLi9oZWxwZXInO1xuaW1wb3J0IHsgdXNlQ3NzSW1wb3J0LCB1c2VJbXBvcnQgfSBmcm9tICcuL2xvYWRlcic7XG5cbmxldCB1aTogVW5pY29yblVJO1xuXG5BbGVydEFkYXB0ZXIuYWxlcnQgPSAodGl0bGU6IHN0cmluZywgdGV4dCA9ICcnLCB0eXBlID0gJ2luZm8nKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gIGlmICh0ZXh0KSB7XG4gICAgdGl0bGUgKz0gJyB8ICcgKyB0ZXh0O1xuICB9XG5cbiAgd2luZG93LmFsZXJ0KHRpdGxlKTtcblxuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG59O1xuXG5BbGVydEFkYXB0ZXIuY29uZmlybSA9IChtZXNzYWdlOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+ID0+IHtcbiAgbWVzc2FnZSA9IG1lc3NhZ2UgfHwgJ0FyZSB5b3Ugc3VyZT8nO1xuXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIHJlc29sdmUod2luZG93LmNvbmZpcm0obWVzc2FnZSkpO1xuICB9KTtcbn07XG5cbkFsZXJ0QWRhcHRlci5jb25maXJtVGV4dCA9ICgpID0+ICdPSyc7XG5BbGVydEFkYXB0ZXIuY2FuY2VsVGV4dCA9ICgpID0+ICdDYW5jZWwnO1xuQWxlcnRBZGFwdGVyLmRlbGV0ZVRleHQgPSAoKSA9PiAnRGVsZXRlJztcblxuZXhwb3J0IHsgc2ltcGxlQWxlcnQsIHNpbXBsZUNvbmZpcm0sIGRlbGV0ZUNvbmZpcm0sIEFsZXJ0QWRhcHRlciB9O1xuXG5leHBvcnQgZnVuY3Rpb24gdXNlVUkoaW5zdGFuY2U/OiBVbmljb3JuVUkpOiBVbmljb3JuVUkge1xuICBpZiAoaW5zdGFuY2UpIHtcbiAgICB1aSA9IGluc3RhbmNlO1xuICB9XG5cbiAgcmV0dXJuIHVpID8/PSBuZXcgVW5pY29yblVJKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VVSVRoZW1lPFQgZXh0ZW5kcyBVSVRoZW1lSW50ZXJmYWNlPih0aGVtZT86IFQgfCBDb25zdHJ1Y3RvcjxUPik6IFQge1xuICBjb25zdCB1aSA9IHVzZVVJKCk7XG5cbiAgaWYgKHVpLnRoZW1lICYmICF0aGVtZSkge1xuICAgIHJldHVybiB1aS50aGVtZTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgdGhlbWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICB0aGVtZSA9IG5ldyB0aGVtZSgpO1xuICB9XG5cbiAgdWkuaW5zdGFsbFRoZW1lKHRoZW1lKTtcblxuICByZXR1cm4gdWkudGhlbWU7XG59XG5cbmV4cG9ydCBjbGFzcyBVbmljb3JuVUkge1xuICB0aGVtZT86IGFueTtcbiAgYWxpdmVIYW5kbGU/OiBhbnk7XG5cbiAgc3RhdGljIGdldCBkZWZhdWx0T3B0aW9ucygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbWVzc2FnZVNlbGVjdG9yOiAnLm1lc3NhZ2Utd3JhcCcsXG4gICAgfTtcbiAgfVxuXG4gIGluc3RhbGxUaGVtZSh0aGVtZTogYW55KSB7XG4gICAgdGhpcy50aGVtZSA9IHRoZW1lO1xuICB9XG5cbiAgLy8gY29uZmlybShtZXNzYWdlOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgLy8gICBtZXNzYWdlID0gbWVzc2FnZSB8fCAnQXJlIHlvdSBzdXJlPyc7XG4gIC8vXG4gIC8vICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gIC8vICAgICByZXNvbHZlKHdpbmRvdy5jb25maXJtKG1lc3NhZ2UpKTtcbiAgLy8gICB9KTtcbiAgLy8gfVxuICAvL1xuICAvLyBhbGVydCh0aXRsZTogc3RyaW5nLCB0ZXh0ID0gJycsIHR5cGUgPSAnaW5mbycpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgLy8gICBpZiAodGV4dCkge1xuICAvLyAgICAgdGl0bGUgKz0gJyB8ICcgKyB0ZXh0O1xuICAvLyAgIH1cbiAgLy9cbiAgLy8gICB3aW5kb3cuYWxlcnQodGl0bGUpO1xuICAvL1xuICAvLyAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSk7XG4gIC8vIH1cbn1cblxuY29uc3QgcHJlcGFyZXM6IEFscGluZVByZXBhcmVDYWxsYmFja1tdID0gW107XG50eXBlIEFscGluZVByZXBhcmVDYWxsYmFjayA9IChBbHBpbmU6IEFscGluZUdsb2JhbCkgPT4gTWF5YmVQcm9taXNlPGFueT47XG5jb25zdCB7IHByb21pc2U6IGFscGluZUxvYWRlZCwgcmVzb2x2ZTogYWxwaW5lUmVzb2x2ZSB9ID0gUHJvbWlzZS53aXRoUmVzb2x2ZXJzPEFscGluZUdsb2JhbD4oKTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxvYWRBbHBpbmUoY2FsbGJhY2s/OiBOdWxsYWJsZTxBbHBpbmVQcmVwYXJlQ2FsbGJhY2s+KTogUHJvbWlzZTxBbHBpbmVHbG9iYWw+IHtcbiAgaWYgKGNhbGxiYWNrICYmICF3aW5kb3cuQWxwaW5lKSB7XG4gICAgcHJlcGFyZXMucHVzaChjYWxsYmFjayk7XG4gIH1cblxuICBjb25zdCB7IGRlZmF1bHQ6IEFscGluZSB9OiB7IGRlZmF1bHQ6IEFscGluZUdsb2JhbCB9ID0gYXdhaXQgdXNlSW1wb3J0KCdAYWxwaW5lanMnKTtcblxuICBpZiAoIXdpbmRvdy5BbHBpbmUpIHtcbiAgICBhd2FpdCBQcm9taXNlLmFsbChwcmVwYXJlcy5tYXAoKGNhbGxiYWNrKSA9PiBQcm9taXNlLnJlc29sdmUoY2FsbGJhY2soQWxwaW5lKSkpKTtcblxuICAgIEFscGluZS5zdGFydCgpO1xuXG4gICAgd2luZG93LkFscGluZSA9IEFscGluZTtcblxuICAgIGFscGluZVJlc29sdmUoQWxwaW5lKTtcbiAgfSBlbHNlIGlmIChjYWxsYmFjaykge1xuICAgIGF3YWl0IGNhbGxiYWNrKEFscGluZSk7XG4gIH1cblxuICByZXR1cm4gQWxwaW5lO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaW5pdEFscGluZUNvbXBvbmVudChkaXJlY3RpdmU6IHN0cmluZykge1xuICBjb25zdCBBbHBpbmUgPSBhd2FpdCBhbHBpbmVMb2FkZWQ7XG5cbiAgYXdhaXQgbmV4dFRpY2soKTtcblxuICBzZWxlY3RBbGw8SFRNTEVsZW1lbnQ+KGBbJHtkaXJlY3RpdmV9XWAsIChlbCkgPT4ge1xuICAgIGNvbnN0IGNvZGUgPSBlbC5nZXRBdHRyaWJ1dGUoZGlyZWN0aXZlKSB8fCAnJztcbiAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoZGlyZWN0aXZlKTtcblxuICAgIC8vIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2FscGluZWpzL2FscGluZS9pc3N1ZXMvMzU5I2lzc3VlY29tbWVudC05NzM2ODg0NjRcbiAgICBBbHBpbmUubXV0YXRlRG9tKCgpID0+IHtcbiAgICAgIGVsLnNldEF0dHJpYnV0ZSgneC1kYXRhJywgY29kZSk7XG4gICAgfSk7XG5cbiAgICBBbHBpbmUuaW5pdFRyZWUoZWwpO1xuICB9KTtcbn1cblxuLyoqXG4gKiBCZWZvcmUgQWxwaW5lIGluaXRcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHByZXBhcmVBbHBpbmUoY2FsbGJhY2s6IEFscGluZVByZXBhcmVDYWxsYmFjaykge1xuICBpZiAod2luZG93LkFscGluZSkge1xuICAgIGF3YWl0IGNhbGxiYWNrKHdpbmRvdy5BbHBpbmUpO1xuICB9IGVsc2Uge1xuICAgIHByZXBhcmVzLnB1c2goY2FsbGJhY2spO1xuICB9XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcHJlcGFyZUFscGluZURlZmVyKGNhbGxiYWNrOiBBbHBpbmVQcmVwYXJlQ2FsbGJhY2spIHtcbiAgY29uc3QgQWxwaW5lID0gYXdhaXQgYWxwaW5lTG9hZGVkO1xuXG4gIGF3YWl0IGNhbGxiYWNrKHdpbmRvdy5BbHBpbmUpO1xufVxuXG4vKipcbiAqIFJlbmRlciBNZXNzYWdlcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlck1lc3NhZ2UobWVzc2FnZXM6IHN0cmluZyB8IHN0cmluZ1tdLCB0eXBlOiBzdHJpbmcgPSAnaW5mbycpIHtcbiAgdWkudGhlbWUucmVuZGVyTWVzc2FnZShtZXNzYWdlcywgdHlwZSk7XG59XG5cbi8qKlxuICogQ2xlYXIgbWVzc2FnZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjbGVhck1lc3NhZ2VzKCkge1xuICB1aS50aGVtZS5jbGVhck1lc3NhZ2VzKCk7XG59XG5cbi8qKlxuICogU2hvdyBub3RpZnkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBub3RpZnkobWVzc2FnZXM6IHN0cmluZyB8IHN0cmluZ1tdLCB0eXBlOiBzdHJpbmcgPSAnaW5mbycpIHtcbiAgdWkudGhlbWUucmVuZGVyTWVzc2FnZShtZXNzYWdlcywgdHlwZSk7XG59XG5cbi8qKlxuICogQ2xlYXIgbm90aWZpZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjbGVhck5vdGlmaWVzKCkge1xuICB1aS50aGVtZS5jbGVhck1lc3NhZ2VzKCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtYXJrKHNlbGVjdG9yPzogc3RyaW5nIHwgSFRNTEVsZW1lbnQsIGtleXdvcmQ6IHN0cmluZyA9ICcnLCBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge30pIHtcbiAgY29uc3QgbW9kdWxlcyA9IGF3YWl0IHVzZUltcG9ydCgnQHZlbmRvci9tYXJrLmpzL2Rpc3QvbWFyay5taW4uanMnKTtcblxuICBpZiAoc2VsZWN0b3IgIT0gbnVsbCkge1xuICAgIGNvbnN0IGluc3RhbmNlID0gbmV3IE1hcmsoc2VsZWN0b3IpO1xuICAgIGluc3RhbmNlLm1hcmsoa2V5d29yZCwgb3B0aW9ucyk7XG4gIH1cblxuICByZXR1cm4gbW9kdWxlcztcbn1cblxuLyoqXG4gKiBNdWx0aXBsZSBVcGxvYWRlclxuICovXG5leHBvcnQgZnVuY3Rpb24gbXVsdGlVcGxvYWRlcigpOiBQcm9taXNlPGFueT4ge1xuICByZXR1cm4gdXNlSW1wb3J0KCdAdW5pY29ybi9maWVsZC9tdWx0aS11cGxvYWRlci5qcycpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbW9kYWxUcmVlKCk6IFByb21pc2U8YW55PiB7XG4gIHJldHVybiB1c2VJbXBvcnQoJ0B1bmljb3JuL2ZpZWxkL21vZGFsLXRyZWUuanMnKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNsaWRlVXAodGFyZ2V0OiBzdHJpbmcgfCBIVE1MRWxlbWVudCwgZHVyYXRpb246IG51bWJlciA9IDMwMCk6IFByb21pc2U8QW5pbWF0aW9uIHwgdm9pZD4ge1xuICBjb25zdCBlbGUgPSBzZWxlY3RPbmUodGFyZ2V0KTtcblxuICBpZiAoIWVsZSkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfVxuXG4gIGVsZS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuXG4gIGNvbnN0IGFuaW1hdGlvbiA9IGFuaW1hdGVUbyhcbiAgICBlbGUsXG4gICAgeyBoZWlnaHQ6IDAsIHBhZGRpbmdUb3A6IDAsIHBhZGRpbmdCb3R0b206IDAgfSxcbiAgICB7IGR1cmF0aW9uLCBlYXNpbmc6ICdlYXNlLW91dCcgfVxuICApO1xuXG4gIGRhdGEoZWxlLCAnYW5pbWF0aW9uLnNsaWRpbmcudXAnLCB0cnVlKTtcblxuICBjb25zdCByID0gYXdhaXQgYW5pbWF0aW9uLmZpbmlzaGVkO1xuXG4gIGlmICghZGF0YShlbGUsICdhbmltYXRpb24uc2xpZGluZy5kb3duJykpIHtcbiAgICBlbGUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgfVxuXG4gIHJlbW92ZURhdGEoZWxlLCAnYW5pbWF0aW9uLnNsaWRpbmcudXAnKTtcblxuICByZXR1cm4gcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNsaWRlRG93bihcbiAgdGFyZ2V0OiBzdHJpbmcgfCBIVE1MRWxlbWVudCxcbiAgZHVyYXRpb246IG51bWJlciA9IDMwMCxcbiAgZGlzcGxheTogc3RyaW5nID0gJ2Jsb2NrJyk6IFByb21pc2U8QW5pbWF0aW9uIHwgdm9pZD4ge1xuICBjb25zdCBlbGUgPSBzZWxlY3RPbmUodGFyZ2V0KTtcblxuICBpZiAoIWVsZSkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfVxuXG4gIGRhdGEoZWxlLCAnYW5pbWF0aW9uLnNsaWRpbmcuZG93bicsIHRydWUpO1xuXG4gIGVsZS5zdHlsZS5kaXNwbGF5ID0gZGlzcGxheTtcblxuLy8gR2V0IGhlaWdodFxuICBsZXQgbWF4SGVpZ2h0ID0gMDtcbiAgZm9yIChjb25zdCBjaGlsZCBvZiBBcnJheS5mcm9tKGVsZS5jaGlsZHJlbikgYXMgSFRNTEVsZW1lbnRbXSkge1xuICAgIG1heEhlaWdodCA9IE1hdGgubWF4KGNoaWxkLm9mZnNldEhlaWdodCwgbWF4SGVpZ2h0KTtcbiAgfVxuXG4gIGNvbnN0IGFuaW1hdGlvbiA9IGFuaW1hdGVUbyhcbiAgICBlbGUsXG4gICAge1xuICAgICAgaGVpZ2h0OiBbXG4gICAgICAgIDAsXG4gICAgICAgIG1heEhlaWdodCArICdweCdcbiAgICAgIF1cbiAgICB9LFxuICAgIHsgZHVyYXRpb24sIGVhc2luZzogJ2Vhc2Utb3V0JyB9XG4gICk7XG5cbiAgYW5pbWF0aW9uLmFkZEV2ZW50TGlzdGVuZXIoJ2ZpbmlzaCcsICgpID0+IHtcbiAgICBlbGUuc3R5bGUuaGVpZ2h0ID0gJyc7XG5cbiAgICBpZiAoIWRhdGEoZWxlLCAnYW5pbWF0aW9uLnNsaWRpbmcudXAnKSkge1xuICAgICAgZWxlLnN0eWxlLm92ZXJmbG93ID0gJ3Zpc2libGUnO1xuICAgIH1cblxuICAgIHJlbW92ZURhdGEoZWxlLCAnYW5pbWF0aW9uLnNsaWRpbmcuZG93bicpO1xuICB9KTtcblxuICByZXR1cm4gYW5pbWF0aW9uLmZpbmlzaGVkO1xufVxuXG4vKipcbiAqIHNsaWRlVG9nZ2xlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzbGlkZVRvZ2dsZShcbiAgdGFyZ2V0OiBzdHJpbmcgfCBIVE1MRWxlbWVudCxcbiAgZHVyYXRpb246IG51bWJlciA9IDUwMCxcbiAgZGlzcGxheTogc3RyaW5nID0gJ2Jsb2NrJyk6IFByb21pc2U8QW5pbWF0aW9uIHwgdm9pZD4ge1xuICBjb25zdCBlbGUgPSBzZWxlY3RPbmUodGFyZ2V0KTtcblxuICBpZiAoIWVsZSkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfVxuXG4gIGlmICh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGUpLmRpc3BsYXkgPT09ICdub25lJykge1xuICAgIHJldHVybiBzbGlkZURvd24oZWxlLCBkdXJhdGlvbiwgZGlzcGxheSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHNsaWRlVXAoZWxlLCBkdXJhdGlvbik7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZhZGVPdXQoc2VsZWN0b3I6IHN0cmluZyB8IEhUTUxFbGVtZW50LCBkdXJhdGlvbjogbnVtYmVyID0gNTAwKTogUHJvbWlzZTxBbmltYXRpb24gfCB2b2lkPiB7XG4gIGNvbnN0IGVsID0gc2VsZWN0T25lKHNlbGVjdG9yKTtcblxuICBpZiAoIWVsKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgYW5pbWF0aW9uID0gYW5pbWF0ZVRvKGVsLCB7IG9wYWNpdHk6IDAgfSwgeyBkdXJhdGlvbiwgZWFzaW5nOiAnZWFzZS1vdXQnIH0pO1xuXG4gIGNvbnN0IHAgPSBhd2FpdCBhbmltYXRpb24uZmluaXNoZWQ7XG4gIGVsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cbiAgcmV0dXJuIHA7XG59O1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmFkZUluKFxuICBzZWxlY3Rvcjogc3RyaW5nIHwgSFRNTEVsZW1lbnQsXG4gIGR1cmF0aW9uOiBudW1iZXIgPSA1MDAsXG4gIGRpc3BsYXk6IHN0cmluZyA9ICdibG9jaydcbik6IFByb21pc2U8QW5pbWF0aW9uIHwgdm9pZD4ge1xuICBjb25zdCBlbCA9IHNlbGVjdE9uZShzZWxlY3Rvcik7XG5cbiAgaWYgKCFlbCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGVsLnN0eWxlLmRpc3BsYXkgPSAnJztcblxuICBpZiAod2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpLmRpc3BsYXkgIT09IGRpc3BsYXkpIHtcbiAgICBlbC5zdHlsZS5kaXNwbGF5ID0gZGlzcGxheTtcbiAgfVxuXG4gIGNvbnN0IGFuaW1hdGlvbiA9IGFuaW1hdGVUbyhlbCwgeyBvcGFjaXR5OiAxIH0sIHsgZHVyYXRpb24sIGVhc2luZzogJ2Vhc2Utb3V0JyB9KTtcblxuICByZXR1cm4gYW5pbWF0aW9uLmZpbmlzaGVkO1xufTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhpZ2hsaWdodChcbiAgc2VsZWN0b3I6IHN0cmluZyB8IEhUTUxFbGVtZW50LFxuICBjb2xvcjogc3RyaW5nID0gJyNmZmZmOTknLFxuICBkdXJhdGlvbjogbnVtYmVyID0gNjAwXG4pOiBQcm9taXNlPEFuaW1hdGlvbiB8IHZvaWQ+IHtcbiAgY29uc3QgZWxlID0gc2VsZWN0T25lKHNlbGVjdG9yKTtcblxuICBpZiAoIWVsZSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGR1cmF0aW9uIC89IDI7XG4gIGNvbnN0IGJnID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlKS5iYWNrZ3JvdW5kQ29sb3I7XG5cbiAgY29uc3QgYW5pbWF0aW9uID0gYW5pbWF0ZVRvKGVsZSwgeyBiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yIH0sIHsgZHVyYXRpb24gfSk7XG5cbiAgYXdhaXQgYW5pbWF0aW9uLmZpbmlzaGVkO1xuXG4gIHJldHVybiBhbmltYXRlVG8oZWxlLCB7IGJhY2tncm91bmRDb2xvcjogYmcgfSwgeyBkdXJhdGlvbiB9KTtcbn1cblxuLyoqXG4gKiBDb2xvciBQaWNrZXIuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VDb2xvclBpY2tlcihcbiAgc2VsZWN0b3I/OiBOdWxsYWJsZTxzdHJpbmcgfCBIVE1MRWxlbWVudCB8IE5vZGVMaXN0T2Y8SFRNTEVsZW1lbnQ+PixcbiAgb3B0aW9uczogUGFydGlhbDxTcGVjdHJ1bU9wdGlvbnM+ID0ge31cbik6IFByb21pc2U8YW55PiB7XG4gIGlmIChvcHRpb25zPy50aGVtZSA9PT0gJ2RhcmsnKSB7XG4gICAgdXNlQ3NzSW1wb3J0KCdAc3BlY3RydW0vc3BlY3RydW0tZGFyay5taW4uY3NzJyk7XG4gIH0gZWxzZSBpZiAoIW9wdGlvbnM/LnRoZW1lKSB7XG4gICAgdXNlQ3NzSW1wb3J0KCdAc3BlY3RydW0vc3BlY3RydW0ubWluLmNzcycpO1xuICB9XG5cbiAgY29uc3QgbSA9IGF3YWl0IHVzZUltcG9ydCgnQHNwZWN0cnVtJyk7XG5cbi8vIExvY2FsZVxuICBpZiAodHlwZW9mIG9wdGlvbnMubG9jYWxlID09PSAnc3RyaW5nJykge1xuICAgIGxldCBsczogYW55ID0gb3B0aW9ucy5sb2NhbGUuc3BsaXQoJy0nKS5tYXAoKGwpID0+IGwudG9Mb3dlckNhc2UoKSk7XG5cbiAgICBpZiAobHNbMF0gPT09IGxzWzFdKSB7XG4gICAgICBscyA9IFtsc107XG4gICAgfVxuXG4gICAgbHMgPSBscy5qb2luKCctJyk7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHVzZUltcG9ydChgQHNwZWN0cnVtL2kxOG4vJHtsc30uanNgKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLndhcm4oYFVuYWJsZSB0byBsb2FkIFNwZWN0cnVtIGxvY2FsZSBcIiR7bHN9XCIgKCR7b3B0aW9ucy5sb2NhbGV9KWApO1xuICAgIH1cbiAgfVxuXG4gIGlmIChzZWxlY3Rvcikge1xuICAgIG1vZHVsZTxhbnksIEhUTUxFbGVtZW50PihzZWxlY3RvciwgJ3NwZWN0cnVtJywgKGVsZSkgPT4gU3BlY3RydW0uZ2V0SW5zdGFuY2UoZWxlLCBvcHRpb25zKSk7XG4gIH1cblxuICByZXR1cm4gbTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVzZURpc2FibGVPblN1Ym1pdChcbiAgZm9ybVNlbGVjdG9yOiBzdHJpbmcgfCBIVE1MRm9ybUVsZW1lbnQgPSAnI2FkbWluLWZvcm0nLFxuICBidXR0b25TZWxlY3Rvcjogc3RyaW5nID0gJycsXG4gIG9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fVxuKSB7XG4gIC8vIFRvZG86IFVzZSBvYmplY3QgdG8gaGFuZGxlIGl0XG4gIGJ1dHRvblNlbGVjdG9yID0gYnV0dG9uU2VsZWN0b3IgfHwgW1xuICAgICcjYWRtaW4tdG9vbGJhciBidXR0b24nLFxuICAgICcjYWRtaW4tdG9vbGJhciBhJyxcbiAgICBmb3JtU2VsZWN0b3IgKyAnIC5kaXNhYmxlLW9uLXN1Ym1pdCcsXG4gICAgZm9ybVNlbGVjdG9yICsgJyAuanMtZG9zJyxcbiAgICBmb3JtU2VsZWN0b3IgKyAnIFtkYXRhLWRvc10nLFxuICBdLmpvaW4oJywnKTtcblxuICBjb25zdCBpY29uU2VsZWN0b3IgPSBvcHRpb25zLmljb25TZWxlY3RvciB8fCBbXG4gICAgJ1tjbGFzcyo9XCJmYS1cIl0nLFxuICAgICdbZGF0YS1zcGluXScsXG4gICAgJ1tkYXRhLXNwaW5uZXJdJyxcbiAgXS5qb2luKCcsJyk7XG5cbiAgY29uc3QgZXZlbnQgPSBvcHRpb25zLmV2ZW50IHx8ICdzdWJtaXQnO1xuICBjb25zdCBzcGlubmVyQ2xhc3MgPSBvcHRpb25zLnNwaW5uZXJDbGFzcyB8fCAnc3Bpbm5lci1ib3JkZXIgc3Bpbm5lci1ib3JkZXItc20nO1xuXG4gIHNlbGVjdEFsbDxIVE1MRWxlbWVudD4oYnV0dG9uU2VsZWN0b3IsIChidXR0b24pID0+IHtcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgYnV0dG9uLmRhdGFzZXQuY2xpY2tlZCA9ICcxJztcblxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGRlbGV0ZSBidXR0b24uZGF0YXNldC5jbGlja2VkO1xuICAgICAgfSwgMTUwMCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGNvbnN0IGZvcm0gPSBzZWxlY3RPbmU8SFRNTEZvcm1FbGVtZW50Pihmb3JtU2VsZWN0b3IpO1xuICBmb3JtPy5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCAoZTogU3VibWl0RXZlbnQpID0+IHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmICghZm9ybS5jaGVja1ZhbGlkaXR5KCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBzZWxlY3RBbGw8SFRNTEVsZW1lbnQ+KGJ1dHRvblNlbGVjdG9yLCAoYnV0dG9uKSA9PiB7XG4gICAgICAgIGJ1dHRvbi5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnO1xuICAgICAgICBidXR0b24uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICdkaXNhYmxlZCcpO1xuICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnZGlzYWJsZWQnKTtcblxuICAgICAgICBpZiAoYnV0dG9uLmRhdGFzZXQuY2xpY2tlZCkge1xuICAgICAgICAgIGxldCBpY29uID0gYnV0dG9uLnF1ZXJ5U2VsZWN0b3IoaWNvblNlbGVjdG9yKTtcblxuICAgICAgICAgIGlmIChpY29uKSB7XG4gICAgICAgICAgICBjb25zdCBpID0gaHRtbCgnPGk+PC9pPicpO1xuICAgICAgICAgICAgaWNvbi5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChpLCBpY29uKTtcblxuICAgICAgICAgICAgaS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgc3Bpbm5lckNsYXNzKTtcbiAgICAgICAgICAgIC8vIGljb24uc3R5bGVzLndpZHRoID0gJzFlbSc7XG4gICAgICAgICAgICAvLyBpY29uLnN0eWxlcy5oZWlnaHQgPSAnMWVtJztcbiAgICAgICAgICAgIC8vIGljb24uc3R5bGVzLmJvcmRlcldpdGggPSAnLjE1ZW0nO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSwgMCk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXNlRGlzYWJsZUlmU3RhY2tOb3RFbXB0eShidXR0b25TZWxlY3Rvcjogc3RyaW5nID0gJ1tkYXRhLXRhc2s9c2F2ZV0nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2tOYW1lOiBzdHJpbmcgPSAndXBsb2FkaW5nJykge1xuICBjb25zdCBzdGFjayA9IHVzZVN0YWNrKHN0YWNrTmFtZSk7XG5cbiAgc3RhY2sub2JzZXJ2ZSgoc3RhY2ssIGxlbmd0aCkgPT4ge1xuICAgIGZvciAoY29uc3QgYnV0dG9uIG9mIHNlbGVjdEFsbDxIVE1MRWxlbWVudD4oYnV0dG9uU2VsZWN0b3IpKSB7XG4gICAgICBpZiAobGVuZ3RoID4gMCkge1xuICAgICAgICBidXR0b24uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICdkaXNhYmxlZCcpO1xuICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnZGlzYWJsZWQnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJ1dHRvbi5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdkaXNhYmxlZCcpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5cbi8qKlxuICogS2VlcCBhbGl2ZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVzZUtlZXBBbGl2ZSh1cmw6IHN0cmluZywgdGltZTogbnVtYmVyID0gNjAwMDApOiAoKSA9PiB2b2lkIHtcbiAgY29uc3QgYWxpdmVIYW5kbGUgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4gZmV0Y2godXJsKSwgdGltZSk7XG5cbiAgcmV0dXJuICgpID0+IHtcbiAgICBjbGVhckludGVydmFsKGFsaXZlSGFuZGxlKTtcbiAgfTtcbn1cblxuLyoqXG4gKiBWdWUgY29tcG9uZW50IGZpZWxkLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlVnVlQ29tcG9uZW50RmllbGQoXG4gIHNlbGVjdG9yPzogTnVsbGFibGU8c3RyaW5nIHwgSFRNTEVsZW1lbnQ+LFxuICB2YWx1ZT86IGFueSxcbiAgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9XG4pOiBQcm9taXNlPGFueT4ge1xuICBjb25zdCBtID0gYXdhaXQgdXNlSW1wb3J0KCdAdW5pY29ybi9maWVsZC92dWUtY29tcG9uZW50LWZpZWxkLmpzJyk7XG5cbiAgaWYgKHNlbGVjdG9yKSB7XG4gICAgbS5WdWVDb21wb25lbnRGaWVsZC5pbml0KHNlbGVjdG9yLCB2YWx1ZSwgb3B0aW9ucyk7XG4gIH1cblxuICByZXR1cm4gbTtcbn1cblxuZGVjbGFyZSBnbG9iYWwge1xuICB2YXIgQWxwaW5lOiBBbHBpbmVHbG9iYWw7XG4gIHZhciBUb21TZWxlY3Q6IHR5cGVvZiBUb21TZWxlY3RHbG9iYWw7XG4gIHZhciBTcGVjdHJ1bTogdHlwZW9mIFNwZWN0cnVtR2xvYmFsO1xuICB2YXIgTWFyazogYW55O1xufVxuIiwiaW1wb3J0IHsgZGF0YSB9IGZyb20gJy4uL2RhdGEnO1xuXG50eXBlIFVyaVR5cGVzID0gJ2Z1bGwnIHwgJ3BhdGgnIHwgJ3Jvb3QnIHwgJ2N1cnJlbnQnIHwgJ3JvdXRlJyB8ICdzY3JpcHQnO1xudHlwZSBBc3NldFR5cGVzID0gJ3Jvb3QnIHwgJ3BhdGgnO1xuXG5leHBvcnQgZnVuY3Rpb24gdXNlU3lzdGVtVXJpKCk6IFVuaWNvcm5TeXN0ZW1Vcmk7XG5leHBvcnQgZnVuY3Rpb24gdXNlU3lzdGVtVXJpKHR5cGU6IFVyaVR5cGVzKTogc3RyaW5nO1xuZXhwb3J0IGZ1bmN0aW9uIHVzZVN5c3RlbVVyaSh0eXBlPzogVXJpVHlwZXMsIHBhdGg/OiBzdHJpbmcpOiBVbmljb3JuU3lzdGVtVXJpIHwgc3RyaW5nIHtcbiAgY29uc3QgdXJpID0gVW5pY29yblN5c3RlbVVyaS5nZXQoKTtcblxuICBpZiAodHlwZSkge1xuICAgIHJldHVybiB1cmlbdHlwZV0ocGF0aCk7XG4gIH1cblxuICByZXR1cm4gdXJpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXNlQXNzZXRVcmkoKTogVW5pY29ybkFzc2V0VXJpO1xuZXhwb3J0IGZ1bmN0aW9uIHVzZUFzc2V0VXJpKHR5cGU/OiBBc3NldFR5cGVzLCBwYXRoPzogc3RyaW5nKTogc3RyaW5nO1xuZXhwb3J0IGZ1bmN0aW9uIHVzZUFzc2V0VXJpKHR5cGU/OiBBc3NldFR5cGVzLCBwYXRoPzogc3RyaW5nKTogVW5pY29ybkFzc2V0VXJpIHwgc3RyaW5nIHtcbiAgY29uc3QgYXNzZXQgPSBVbmljb3JuQXNzZXRVcmkuZ2V0KCk7XG5cbiAgaWYgKHR5cGUpIHtcbiAgICByZXR1cm4gYXNzZXRbdHlwZV0ocGF0aCk7XG4gIH1cblxuICByZXR1cm4gYXNzZXQ7XG59XG5cbmZ1bmN0aW9uIHVyaSh0eXBlOiBzdHJpbmcpIHtcbiAgcmV0dXJuIGRhdGEoJ3VuaWNvcm4udXJpJylbdHlwZV07XG59XG5cbmZ1bmN0aW9uIGFzc2V0KHR5cGU6IHN0cmluZykge1xuICByZXR1cm4gdXJpKCdhc3NldCcpW3R5cGVdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkVXJpQmFzZSh1cmk6IHN0cmluZywgdHlwZSA9ICdwYXRoJykge1xuICBpZiAodXJpLnN1YnN0cmluZygwLCAyKSA9PT0gJy9cXC8nIHx8IHVyaS5zdWJzdHJpbmcoMCwgNCkgPT09ICdodHRwJykge1xuICAgIHJldHVybiB1cmk7XG4gIH1cblxuICByZXR1cm4gYXNzZXQodHlwZSkgKyAnLycgKyB1cmk7XG59XG5cbmV4cG9ydCBjbGFzcyBVbmljb3JuU3lzdGVtVXJpIGV4dGVuZHMgVVJMIHtcbiAgc3RhdGljIGluc3RhbmNlOiBVbmljb3JuU3lzdGVtVXJpO1xuXG4gIHN0YXRpYyBnZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5zdGFuY2UgPz89IG5ldyB0aGlzKHVyaSgnZnVsbCcpKTtcbiAgfVxuXG4gIHBhdGgocGF0aDogc3RyaW5nID0gJycpOiBzdHJpbmcge1xuICAgIHJldHVybiB1cmkoJ3BhdGgnKSArIHBhdGg7XG4gIH1cblxuICByb290KHBhdGg6IHN0cmluZyA9ICcnKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdXJpKCdyb290JykgKyBwYXRoO1xuICB9XG5cbiAgY3VycmVudCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB1cmkoJ2N1cnJlbnQnKSB8fCAnJztcbiAgfVxuXG4gIGZ1bGwoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdXJpKCdmdWxsJykgfHwgJyc7XG4gIH1cblxuICByb3V0ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB1cmkoJ3JvdXRlJykgfHwgJyc7XG4gIH1cblxuICBzY3JpcHQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdXJpKCdzY3JpcHQnKSB8fCAnJztcbiAgfVxuXG4gIHJvdXRlV2l0aFF1ZXJ5KCkge1xuICAgIGNvbnN0IHJvdXRlID0gdGhpcy5yb3V0ZSgpO1xuICAgIGNvbnN0IHF1ZXJ5ID0gdGhpcy5zZWFyY2hQYXJhbXMudG9TdHJpbmcoKTtcblxuICAgIHJldHVybiBxdWVyeSA/IGAke3JvdXRlfT8ke3F1ZXJ5fWAgOiByb3V0ZTtcbiAgfVxuXG4gIHJvdXRlQW5kUXVlcnkoKSB7XG4gICAgY29uc3Qgcm91dGUgPSB0aGlzLnJvdXRlKCk7XG4gICAgY29uc3QgcXVlcnkgPSB0aGlzLnNlYXJjaFBhcmFtcy50b1N0cmluZygpO1xuXG4gICAgcmV0dXJuIFtyb3V0ZSwgcXVlcnldO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBVbmljb3JuQXNzZXRVcmkge1xuICBzdGF0aWMgaW5zdGFuY2U6IFVuaWNvcm5Bc3NldFVyaTtcblxuICBzdGF0aWMgZ2V0KCkge1xuICAgIHJldHVybiB0aGlzLmluc3RhbmNlID8/PSBuZXcgdGhpcygpO1xuICB9XG5cbiAgcGF0aChwYXRoOiBzdHJpbmcgPSAnJyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGFzc2V0KCdwYXRoJykgKyBwYXRoO1xuICB9XG5cbiAgcm9vdChwYXRoOiBzdHJpbmcgPSAnJyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGFzc2V0KCdyb290JykgKyBwYXRoO1xuICB9XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gZW5jb2RlKG9iaiwgcGZ4KSB7XG5cdHZhciBrLCBpLCB0bXAsIHN0cj0nJztcblxuXHRmb3IgKGsgaW4gb2JqKSB7XG5cdFx0aWYgKCh0bXAgPSBvYmpba10pICE9PSB2b2lkIDApIHtcblx0XHRcdGlmIChBcnJheS5pc0FycmF5KHRtcCkpIHtcblx0XHRcdFx0Zm9yIChpPTA7IGkgPCB0bXAubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRzdHIgJiYgKHN0ciArPSAnJicpO1xuXHRcdFx0XHRcdHN0ciArPSBlbmNvZGVVUklDb21wb25lbnQoaykgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodG1wW2ldKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c3RyICYmIChzdHIgKz0gJyYnKTtcblx0XHRcdFx0c3RyICs9IGVuY29kZVVSSUNvbXBvbmVudChrKSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh0bXApO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiAocGZ4IHx8ICcnKSArIHN0cjtcbn1cblxuZnVuY3Rpb24gdG9WYWx1ZShtaXgpIHtcblx0aWYgKCFtaXgpIHJldHVybiAnJztcblx0dmFyIHN0ciA9IGRlY29kZVVSSUNvbXBvbmVudChtaXgpO1xuXHRpZiAoc3RyID09PSAnZmFsc2UnKSByZXR1cm4gZmFsc2U7XG5cdGlmIChzdHIgPT09ICd0cnVlJykgcmV0dXJuIHRydWU7XG5cdHJldHVybiAoK3N0ciAqIDAgPT09IDApID8gKCtzdHIpIDogc3RyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVjb2RlKHN0cikge1xuXHR2YXIgdG1wLCBrLCBvdXQ9e30sIGFycj1zdHIuc3BsaXQoJyYnKTtcblxuXHR3aGlsZSAodG1wID0gYXJyLnNoaWZ0KCkpIHtcblx0XHR0bXAgPSB0bXAuc3BsaXQoJz0nKTtcblx0XHRrID0gdG1wLnNoaWZ0KCk7XG5cdFx0aWYgKG91dFtrXSAhPT0gdm9pZCAwKSB7XG5cdFx0XHRvdXRba10gPSBbXS5jb25jYXQob3V0W2tdLCB0b1ZhbHVlKHRtcC5zaGlmdCgpKSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG91dFtrXSA9IHRvVmFsdWUodG1wLnNoaWZ0KCkpO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBvdXQ7XG59XG4iLCJcbmltcG9ydCB7IGRhdGEgfSBmcm9tICcuLi9kYXRhJztcbmltcG9ydCB7IGRlY29kZSwgZW5jb2RlIH0gZnJvbSAncXNzJztcblxuLyoqXG4gKiBBZGQgYSByb3V0ZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZFJvdXRlKHJvdXRlOiBzdHJpbmcsIHVybDogc3RyaW5nKSB7XG4gIGNvbnN0IHJvdXRlcyA9IGRhdGEoJ3VuaWNvcm4ucm91dGVzJykgfHwge307XG4gIHJvdXRlc1tyb3V0ZV0gPSB1cmw7XG5cbiAgZGF0YSgndW5pY29ybi5yb3V0ZXMnLCByb3V0ZXMpO1xufVxuXG4vKipcbiAqIEdldCByb3V0ZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJvdXRlKHJvdXRlOiBzdHJpbmcsIHF1ZXJ5PzogUmVjb3JkPHN0cmluZywgYW55Pik6IHN0cmluZyB7XG4gIGNvbnN0IHNvdXJjZSA9IHJvdXRlO1xuICBjb25zdCBleHRyYWN0ID0gZXh0cmFjdFJvdXRlKHNvdXJjZSk7XG4gIHJvdXRlID0gZXh0cmFjdC5yb3V0ZTtcbiAgbGV0IHBhdGggPSBleHRyYWN0LnBhdGg7XG4gIGNvbnN0IHJvdXRlcyA9IGRhdGEoJ3VuaWNvcm4ucm91dGVzJykgfHwge307XG5cbiAgbGV0IHVybCA9IHJvdXRlc1tyb3V0ZV07XG5cbiAgaWYgKHVybCA9PSBudWxsKSB7XG4gICAgaWYgKCFyb3V0ZS5zdGFydHNXaXRoKCdAJykpIHtcbiAgICAgIHJvdXRlID0gJ0AnICsgcm91dGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJvdXRlID0gcm91dGUuc3Vic3RyaW5nKDEpO1xuICAgIH1cbiAgfVxuXG4gIHVybCA9IHJvdXRlc1tyb3V0ZV07XG5cbiAgaWYgKHVybCA9PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBSb3V0ZTogXCIke3NvdXJjZX1cIiBub3QgZm91bmRgKTtcbiAgfVxuXG4gIC8vIE1lcmdlIHF1ZXJ5XG4gIGlmIChwYXRoKSB7XG4gICAgY29uc3QgeyByb3V0ZTogdTEsIHBhdGg6IHUxcSB9ID0gZXh0cmFjdFJvdXRlKHVybCwgJz8nKTtcbiAgICBjb25zdCB7IHJvdXRlOiB1MiwgcGF0aDogdTJxIH0gPSBleHRyYWN0Um91dGUocGF0aCwgJz8nKTtcblxuICAgIHVybCA9IHUxICsgJy8nICsgdTI7XG5cbiAgICBpZiAodTFxIHx8IHUycSkge1xuICAgICAgY29uc3QgcSA9IFsgdTFxLCB1MnEgXS5maWx0ZXIodSA9PiB1KS5qb2luKCcmJyk7XG4gICAgICB1cmwgKz0gJz8nICsgcTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYWRkUXVlcnkodXJsLCBxdWVyeSk7XG59XG5cbmZ1bmN0aW9uIGV4dHJhY3RSb3V0ZShyb3V0ZTogc3RyaW5nLCBzZXA6IHN0cmluZyA9ICcvJyk6IHsgcGF0aDogc3RyaW5nOyByb3V0ZTogc3RyaW5nIH0ge1xuICBpZiAocm91dGUuaW5kZXhPZihzZXApID09PSAtMSkge1xuICAgIHJldHVybiB7IHJvdXRlLCBwYXRoOiAnJyB9XG4gIH1cblxuICBjb25zdCBzZWdtZW50cyA9IHJvdXRlLnNwbGl0KHNlcCk7XG5cbiAgcm91dGUgPSBzZWdtZW50cy5zaGlmdCgpIHx8ICcnO1xuICBjb25zdCBwYXRoID0gc2VnbWVudHMuam9pbihzZXApO1xuXG4gIHJldHVybiB7IHJvdXRlLCBwYXRoIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNSb3V0ZShyb3V0ZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiB1bmRlZmluZWQgIT09IGRhdGEoJ3VuaWNvcm4ucm91dGVzJylbcm91dGVdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkUXVlcnkodXJsOiBzdHJpbmcsIHF1ZXJ5PzogUmVjb3JkPHN0cmluZywgYW55Pik6IHN0cmluZyB7XG4gIGlmIChxdWVyeSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuXG4gIGZvciAobGV0IGsgaW4gcXVlcnkpIHtcbiAgICBjb25zdCB2ID0gcXVlcnlba107XG5cbiAgICBjb25zdCBwbGFjZWhvbGRlciA9IGB7JHtrfX1gO1xuXG4gICAgaWYgKHVybC5pbmRleE9mKHBsYWNlaG9sZGVyKSAhPT0gLTEpIHtcbiAgICAgIHVybCA9IHVybC5yZXBsYWNlKFxuICAgICAgICBuZXcgUmVnRXhwKGAke3BsYWNlaG9sZGVyfWAsICdnJyksXG4gICAgICAgIHZcbiAgICAgICk7XG4gICAgICBkZWxldGUgcXVlcnlba107XG4gICAgfVxuXG4gICAgY29uc3QgZW5jb2RlZFBsYWNlaG9sZGVyID0gZW5jb2RlVVJJQ29tcG9uZW50KGB7JHtrfX1gKTtcblxuICAgIGlmICh1cmwuaW5kZXhPZihlbmNvZGVkUGxhY2Vob2xkZXIpICE9PSAtMSkge1xuICAgICAgdXJsID0gdXJsLnJlcGxhY2UoXG4gICAgICAgIG5ldyBSZWdFeHAoYCR7ZW5jb2RlZFBsYWNlaG9sZGVyfWAsICdnJyksXG4gICAgICAgIHZcbiAgICAgICk7XG4gICAgICBkZWxldGUgcXVlcnlba107XG4gICAgfVxuICB9XG5cbiAgaWYgKE9iamVjdC5rZXlzKHF1ZXJ5KS5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gdXJsO1xuICB9XG5cbiAgY29uc3QgcXVlcnlTdHJpbmcgPSBlbmNvZGUocXVlcnkpO1xuXG4gIHJldHVybiB1cmwgKyAoL1xcPy8udGVzdCh1cmwpID8gYCYke3F1ZXJ5U3RyaW5nfWAgOiBgPyR7cXVlcnlTdHJpbmd9YCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVF1ZXJ5PFQgPSBSZWNvcmQ8c3RyaW5nLCBhbnk+PihxdWVyeVN0cmluZzogc3RyaW5nKTogVCB7XG4gIHJldHVybiBkZWNvZGUocXVlcnlTdHJpbmcpIGFzIFQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZFF1ZXJ5KHF1ZXJ5OiBSZWNvcmQ8c3RyaW5nLCBhbnk+KTogc3RyaW5nIHtcbiAgcmV0dXJuIGVuY29kZShxdWVyeSk7XG59XG4iLCJpbXBvcnQgeyBzZWxlY3RBbGwgfSBmcm9tICcuLi9zZXJ2aWNlJztcblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUNsb2FrKCkge1xuICBpZiAoZ2xvYmFsVGhpcy5kb2N1bWVudCA9PSBudWxsKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgc2VsZWN0QWxsKCdbdW5pLWNsb2FrXScsIChlbCkgPT4gZWwucmVtb3ZlQXR0cmlidXRlKCd1bmktY2xvYWsnKSk7XG59XG4iLCJpbXBvcnQgeyBnZXREYXRhLCBzZXREYXRhLCByZW1vdmVEYXRhIGFzIHJtZGF0YSB9IGZyb20gJy4vdXRpbGl0aWVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGRhdGEobmFtZTogc3RyaW5nLCBkYXRhOiBhbnkpOiBhbnk7XG5leHBvcnQgZnVuY3Rpb24gZGF0YShuYW1lOiBzdHJpbmcpOiBhbnk7XG5leHBvcnQgZnVuY3Rpb24gZGF0YShlbGU6IEVsZW1lbnQsIG5hbWU6IHN0cmluZyk6IGFueTtcbmV4cG9ydCBmdW5jdGlvbiBkYXRhKGVsZTogRWxlbWVudCwgbmFtZTogc3RyaW5nLCBkYXRhPzogYW55KTogYW55O1xuZXhwb3J0IGZ1bmN0aW9uIGRhdGEoZWxlOiBFbGVtZW50IHwgc3RyaW5nLCBuYW1lOiBhbnkgPSB1bmRlZmluZWQsIHZhbHVlOiBhbnkgPSB1bmRlZmluZWQpIHtcbiAgaWYgKCEoZWxlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpKSB7XG4gICAgdmFsdWUgPSBuYW1lO1xuICAgIG5hbWUgPSBlbGU7XG4gICAgZWxlID0gZG9jdW1lbnQgYXMgYW55IGFzIEVsZW1lbnQ7XG4gIH1cblxuICBpZiAobmFtZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGdldERhdGEoZWxlKTtcbiAgfVxuXG4gIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgY29uc3QgcmVzID0gZ2V0RGF0YShlbGUsIG5hbWUpO1xuXG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIHNldERhdGEoZWxlLCBuYW1lLCB2YWx1ZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVEYXRhKG5hbWU6IHN0cmluZyk6IGFueTtcbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVEYXRhKGVsZTogRWxlbWVudCwgbmFtZTogc3RyaW5nKTogYW55O1xuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZURhdGEoZWxlOiBFbGVtZW50fHN0cmluZywgbmFtZTogYW55ID0gdW5kZWZpbmVkKSB7XG4gIGlmICghKGVsZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSkge1xuICAgIG5hbWUgPSBlbGU7XG4gICAgZWxlID0gZG9jdW1lbnQgYXMgYW55IGFzIEVsZW1lbnQ7XG4gIH1cblxuICBybWRhdGEoZWxlLCBuYW1lKTtcbn1cbiIsIi8qKlxuICogVXRpbGl0eSBmdW5jdGlvbiB0aGF0IHdvcmtzIGxpa2UgYE9iamVjdC5hcHBseWAsIGJ1dCBjb3BpZXMgZ2V0dGVycyBhbmQgc2V0dGVycyBwcm9wZXJseSBhcyB3ZWxsLiAgQWRkaXRpb25hbGx5IGdpdmVzXG4gKiB0aGUgb3B0aW9uIHRvIGV4Y2x1ZGUgcHJvcGVydGllcyBieSBuYW1lLlxuICovXG5jb25zdCBjb3B5UHJvcHMgPSAoZGVzdCwgc3JjLCBleGNsdWRlID0gW10pID0+IHtcbiAgICBjb25zdCBwcm9wcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHNyYyk7XG4gICAgZm9yIChsZXQgcHJvcCBvZiBleGNsdWRlKVxuICAgICAgICBkZWxldGUgcHJvcHNbcHJvcF07XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoZGVzdCwgcHJvcHMpO1xufTtcbi8qKlxuICogUmV0dXJucyB0aGUgZnVsbCBjaGFpbiBvZiBwcm90b3R5cGVzIHVwIHVudGlsIE9iamVjdC5wcm90b3R5cGUgZ2l2ZW4gYSBzdGFydGluZyBvYmplY3QuICBUaGUgb3JkZXIgb2YgcHJvdG90eXBlcyB3aWxsXG4gKiBiZSBjbG9zZXN0IHRvIGZhcnRoZXN0IGluIHRoZSBjaGFpbi5cbiAqL1xuY29uc3QgcHJvdG9DaGFpbiA9IChvYmosIGN1cnJlbnRDaGFpbiA9IFtvYmpdKSA9PiB7XG4gICAgY29uc3QgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKTtcbiAgICBpZiAocHJvdG8gPT09IG51bGwpXG4gICAgICAgIHJldHVybiBjdXJyZW50Q2hhaW47XG4gICAgcmV0dXJuIHByb3RvQ2hhaW4ocHJvdG8sIFsuLi5jdXJyZW50Q2hhaW4sIHByb3RvXSk7XG59O1xuLyoqXG4gKiBJZGVudGlmaWVzIHRoZSBuZWFyZXN0IGFuY2VzdG9yIGNvbW1vbiB0byBhbGwgdGhlIGdpdmVuIG9iamVjdHMgaW4gdGhlaXIgcHJvdG90eXBlIGNoYWlucy4gIEZvciBtb3N0IHVucmVsYXRlZFxuICogb2JqZWN0cywgdGhpcyBmdW5jdGlvbiBzaG91bGQgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuXG4gKi9cbmNvbnN0IG5lYXJlc3RDb21tb25Qcm90byA9ICguLi5vYmpzKSA9PiB7XG4gICAgaWYgKG9ianMubGVuZ3RoID09PSAwKVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGxldCBjb21tb25Qcm90byA9IHVuZGVmaW5lZDtcbiAgICBjb25zdCBwcm90b0NoYWlucyA9IG9ianMubWFwKG9iaiA9PiBwcm90b0NoYWluKG9iaikpO1xuICAgIHdoaWxlIChwcm90b0NoYWlucy5ldmVyeShwcm90b0NoYWluID0+IHByb3RvQ2hhaW4ubGVuZ3RoID4gMCkpIHtcbiAgICAgICAgY29uc3QgcHJvdG9zID0gcHJvdG9DaGFpbnMubWFwKHByb3RvQ2hhaW4gPT4gcHJvdG9DaGFpbi5wb3AoKSk7XG4gICAgICAgIGNvbnN0IHBvdGVudGlhbENvbW1vblByb3RvID0gcHJvdG9zWzBdO1xuICAgICAgICBpZiAocHJvdG9zLmV2ZXJ5KHByb3RvID0+IHByb3RvID09PSBwb3RlbnRpYWxDb21tb25Qcm90bykpXG4gICAgICAgICAgICBjb21tb25Qcm90byA9IHBvdGVudGlhbENvbW1vblByb3RvO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIGNvbW1vblByb3RvO1xufTtcbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBwcm90b3R5cGUgb2JqZWN0IHRoYXQgaXMgYSBtaXh0dXJlIG9mIHRoZSBnaXZlbiBwcm90b3R5cGVzLiAgVGhlIG1peGluZyBpcyBhY2hpZXZlZCBieSBmaXJzdFxuICogaWRlbnRpZnlpbmcgdGhlIG5lYXJlc3QgY29tbW9uIGFuY2VzdG9yIGFuZCB1c2luZyBpdCBhcyB0aGUgcHJvdG90eXBlIGZvciBhIG5ldyBvYmplY3QuICBUaGVuIGFsbCBwcm9wZXJ0aWVzL21ldGhvZHNcbiAqIGRvd25zdHJlYW0gb2YgdGhpcyBwcm90b3R5cGUgKE9OTFkgZG93bnN0cmVhbSkgYXJlIGNvcGllZCBpbnRvIHRoZSBuZXcgb2JqZWN0LlxuICpcbiAqIFRoZSByZXN1bHRpbmcgcHJvdG90eXBlIGlzIG1vcmUgcGVyZm9ybWFudCB0aGFuIHNvZnRNaXhQcm90b3MoLi4uKSwgYXMgd2VsbCBhcyBFUzUgY29tcGF0aWJsZS4gIEhvd2V2ZXIsIGl0J3Mgbm90IGFzXG4gKiBmbGV4aWJsZSBhcyB1cGRhdGVzIHRvIHRoZSBzb3VyY2UgcHJvdG90eXBlcyBhcmVuJ3QgY2FwdHVyZWQgYnkgdGhlIG1peGVkIHJlc3VsdC4gIFNlZSBzb2Z0TWl4UHJvdG9zIGZvciB3aHkgeW91IG1heVxuICogd2FudCB0byB1c2UgdGhhdCBpbnN0ZWFkLlxuICovXG5jb25zdCBoYXJkTWl4UHJvdG9zID0gKGluZ3JlZGllbnRzLCBjb25zdHJ1Y3RvciwgZXhjbHVkZSA9IFtdKSA9PiB7XG4gICAgdmFyIF9hO1xuICAgIGNvbnN0IGJhc2UgPSAoX2EgPSBuZWFyZXN0Q29tbW9uUHJvdG8oLi4uaW5ncmVkaWVudHMpKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBPYmplY3QucHJvdG90eXBlO1xuICAgIGNvbnN0IG1peGVkUHJvdG8gPSBPYmplY3QuY3JlYXRlKGJhc2UpO1xuICAgIC8vIEtlZXBzIHRyYWNrIG9mIHByb3RvdHlwZXMgd2UndmUgYWxyZWFkeSB2aXNpdGVkIHRvIGF2b2lkIGNvcHlpbmcgdGhlIHNhbWUgcHJvcGVydGllcyBtdWx0aXBsZSB0aW1lcy4gIFdlIGluaXQgdGhlXG4gICAgLy8gbGlzdCB3aXRoIHRoZSBwcm90byBjaGFpbiBiZWxvdyB0aGUgbmVhcmVzdCBjb21tb24gYW5jZXN0b3IgYmVjYXVzZSB3ZSBkb24ndCB3YW50IGFueSBvZiB0aG9zZSBtZXRob2RzIG1peGVkIGluXG4gICAgLy8gd2hlbiB0aGV5IHdpbGwgYWxyZWFkeSBiZSBhY2Nlc3NpYmxlIHZpYSBwcm90b3R5cGUgYWNjZXNzLlxuICAgIGNvbnN0IHZpc2l0ZWRQcm90b3MgPSBwcm90b0NoYWluKGJhc2UpO1xuICAgIGZvciAobGV0IHByb3RvdHlwZSBvZiBpbmdyZWRpZW50cykge1xuICAgICAgICBsZXQgcHJvdG9zID0gcHJvdG9DaGFpbihwcm90b3R5cGUpO1xuICAgICAgICAvLyBBcHBseSB0aGUgcHJvdG90eXBlIGNoYWluIGluIHJldmVyc2Ugb3JkZXIgc28gdGhhdCBvbGQgbWV0aG9kcyBkb24ndCBvdmVycmlkZSBuZXdlciBvbmVzLlxuICAgICAgICBmb3IgKGxldCBpID0gcHJvdG9zLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBsZXQgbmV3UHJvdG8gPSBwcm90b3NbaV07XG4gICAgICAgICAgICBpZiAodmlzaXRlZFByb3Rvcy5pbmRleE9mKG5ld1Byb3RvKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICBjb3B5UHJvcHMobWl4ZWRQcm90bywgbmV3UHJvdG8sIFsnY29uc3RydWN0b3InLCAuLi5leGNsdWRlXSk7XG4gICAgICAgICAgICAgICAgdmlzaXRlZFByb3Rvcy5wdXNoKG5ld1Byb3RvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBtaXhlZFByb3RvLmNvbnN0cnVjdG9yID0gY29uc3RydWN0b3I7XG4gICAgcmV0dXJuIG1peGVkUHJvdG87XG59O1xuY29uc3QgdW5pcXVlID0gKGFycikgPT4gYXJyLmZpbHRlcigoZSwgaSkgPT4gYXJyLmluZGV4T2YoZSkgPT0gaSk7XG5cbi8qKlxuICogRmluZHMgdGhlIGluZ3JlZGllbnQgd2l0aCB0aGUgZ2l2ZW4gcHJvcCwgc2VhcmNoaW5nIGluIHJldmVyc2Ugb3JkZXIgYW5kIGJyZWFkdGgtZmlyc3QgaWYgc2VhcmNoaW5nIGluZ3JlZGllbnRcbiAqIHByb3RvdHlwZXMgaXMgcmVxdWlyZWQuXG4gKi9cbmNvbnN0IGdldEluZ3JlZGllbnRXaXRoUHJvcCA9IChwcm9wLCBpbmdyZWRpZW50cykgPT4ge1xuICAgIGNvbnN0IHByb3RvQ2hhaW5zID0gaW5ncmVkaWVudHMubWFwKGluZ3JlZGllbnQgPT4gcHJvdG9DaGFpbihpbmdyZWRpZW50KSk7XG4gICAgLy8gc2luY2Ugd2Ugc2VhcmNoIGJyZWFkdGgtZmlyc3QsIHdlIG5lZWQgdG8ga2VlcCB0cmFjayBvZiBvdXIgZGVwdGggaW4gdGhlIHByb3RvdHlwZSBjaGFpbnNcbiAgICBsZXQgcHJvdG9EZXB0aCA9IDA7XG4gICAgLy8gbm90IGFsbCBwcm90b3R5cGUgY2hhaW5zIGFyZSB0aGUgc2FtZSBkZXB0aCwgc28gdGhpcyByZW1haW5zIHRydWUgYXMgbG9uZyBhcyBhdCBsZWFzdCBvbmUgb2YgdGhlIGluZ3JlZGllbnRzJ1xuICAgIC8vIHByb3RvdHlwZSBjaGFpbnMgaGFzIGFuIG9iamVjdCBhdCB0aGlzIGRlcHRoXG4gICAgbGV0IHByb3Rvc0FyZUxlZnRUb1NlYXJjaCA9IHRydWU7XG4gICAgd2hpbGUgKHByb3Rvc0FyZUxlZnRUb1NlYXJjaCkge1xuICAgICAgICAvLyB3aXRoIHRoZSBzdGFydCBvZiBlYWNoIGhvcml6b250YWwgc2xpY2UsIHdlIGFzc3VtZSB0aGlzIGlzIHRoZSBvbmUgdGhhdCdzIGRlZXBlciB0aGFuIGFueSBvZiB0aGUgcHJvdG8gY2hhaW5zXG4gICAgICAgIHByb3Rvc0FyZUxlZnRUb1NlYXJjaCA9IGZhbHNlO1xuICAgICAgICAvLyBzY2FuIHRocm91Z2ggdGhlIGluZ3JlZGllbnRzIHJpZ2h0IHRvIGxlZnRcbiAgICAgICAgZm9yIChsZXQgaSA9IGluZ3JlZGllbnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBjb25zdCBzZWFyY2hUYXJnZXQgPSBwcm90b0NoYWluc1tpXVtwcm90b0RlcHRoXTtcbiAgICAgICAgICAgIGlmIChzZWFyY2hUYXJnZXQgIT09IHVuZGVmaW5lZCAmJiBzZWFyY2hUYXJnZXQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAvLyBpZiB3ZSBmaW5kIHNvbWV0aGluZywgdGhpcyBpcyBwcm9vZiB0aGF0IHRoaXMgaG9yaXpvbnRhbCBzbGljZSBwb3RlbnRpYWxseSBtb3JlIG9iamVjdHMgdG8gc2VhcmNoXG4gICAgICAgICAgICAgICAgcHJvdG9zQXJlTGVmdFRvU2VhcmNoID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAvLyBldXJla2EsIHdlIGZvdW5kIGl0XG4gICAgICAgICAgICAgICAgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc2VhcmNoVGFyZ2V0LCBwcm9wKSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb3RvQ2hhaW5zW2ldWzBdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBwcm90b0RlcHRoKys7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG59O1xuLyoqXG4gKiBcIk1peGVzXCIgaW5ncmVkaWVudHMgYnkgd3JhcHBpbmcgdGhlbSBpbiBhIFByb3h5LiAgVGhlIG9wdGlvbmFsIHByb3RvdHlwZSBhcmd1bWVudCBhbGxvd3MgdGhlIG1peGVkIG9iamVjdCB0byBzaXRcbiAqIGRvd25zdHJlYW0gb2YgYW4gZXhpc3RpbmcgcHJvdG90eXBlIGNoYWluLiAgTm90ZSB0aGF0IFwicHJvcGVydGllc1wiIGNhbm5vdCBiZSBhZGRlZCwgZGVsZXRlZCwgb3IgbW9kaWZpZWQuXG4gKi9cbmNvbnN0IHByb3h5TWl4ID0gKGluZ3JlZGllbnRzLCBwcm90b3R5cGUgPSBPYmplY3QucHJvdG90eXBlKSA9PiBuZXcgUHJveHkoe30sIHtcbiAgICBnZXRQcm90b3R5cGVPZigpIHtcbiAgICAgICAgcmV0dXJuIHByb3RvdHlwZTtcbiAgICB9LFxuICAgIHNldFByb3RvdHlwZU9mKCkge1xuICAgICAgICB0aHJvdyBFcnJvcignQ2Fubm90IHNldCBwcm90b3R5cGUgb2YgUHJveGllcyBjcmVhdGVkIGJ5IHRzLW1peGVyJyk7XG4gICAgfSxcbiAgICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoXywgcHJvcCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihnZXRJbmdyZWRpZW50V2l0aFByb3AocHJvcCwgaW5ncmVkaWVudHMpIHx8IHt9LCBwcm9wKTtcbiAgICB9LFxuICAgIGRlZmluZVByb3BlcnR5KCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBkZWZpbmUgbmV3IHByb3BlcnRpZXMgb24gUHJveGllcyBjcmVhdGVkIGJ5IHRzLW1peGVyJyk7XG4gICAgfSxcbiAgICBoYXMoXywgcHJvcCkge1xuICAgICAgICByZXR1cm4gZ2V0SW5ncmVkaWVudFdpdGhQcm9wKHByb3AsIGluZ3JlZGllbnRzKSAhPT0gdW5kZWZpbmVkIHx8IHByb3RvdHlwZVtwcm9wXSAhPT0gdW5kZWZpbmVkO1xuICAgIH0sXG4gICAgZ2V0KF8sIHByb3ApIHtcbiAgICAgICAgcmV0dXJuIChnZXRJbmdyZWRpZW50V2l0aFByb3AocHJvcCwgaW5ncmVkaWVudHMpIHx8IHByb3RvdHlwZSlbcHJvcF07XG4gICAgfSxcbiAgICBzZXQoXywgcHJvcCwgdmFsKSB7XG4gICAgICAgIGNvbnN0IGluZ3JlZGllbnRXaXRoUHJvcCA9IGdldEluZ3JlZGllbnRXaXRoUHJvcChwcm9wLCBpbmdyZWRpZW50cyk7XG4gICAgICAgIGlmIChpbmdyZWRpZW50V2l0aFByb3AgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHNldCBuZXcgcHJvcGVydGllcyBvbiBQcm94aWVzIGNyZWF0ZWQgYnkgdHMtbWl4ZXInKTtcbiAgICAgICAgaW5ncmVkaWVudFdpdGhQcm9wW3Byb3BdID0gdmFsO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIGRlbGV0ZVByb3BlcnR5KCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBkZWxldGUgcHJvcGVydGllcyBvbiBQcm94aWVzIGNyZWF0ZWQgYnkgdHMtbWl4ZXInKTtcbiAgICB9LFxuICAgIG93bktleXMoKSB7XG4gICAgICAgIHJldHVybiBpbmdyZWRpZW50c1xuICAgICAgICAgICAgLm1hcChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcylcbiAgICAgICAgICAgIC5yZWR1Y2UoKHByZXYsIGN1cnIpID0+IGN1cnIuY29uY2F0KHByZXYuZmlsdGVyKGtleSA9PiBjdXJyLmluZGV4T2Yoa2V5KSA8IDApKSk7XG4gICAgfSxcbn0pO1xuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IHByb3h5LXByb3RvdHlwZSBvYmplY3QgdGhhdCBpcyBhIFwic29mdFwiIG1peHR1cmUgb2YgdGhlIGdpdmVuIHByb3RvdHlwZXMuICBUaGUgbWl4aW5nIGlzIGFjaGlldmVkIGJ5XG4gKiBwcm94eWluZyBhbGwgcHJvcGVydHkgYWNjZXNzIHRvIHRoZSBpbmdyZWRpZW50cy4gIFRoaXMgaXMgbm90IEVTNSBjb21wYXRpYmxlIGFuZCBsZXNzIHBlcmZvcm1hbnQuICBIb3dldmVyLCBhbnlcbiAqIGNoYW5nZXMgbWFkZSB0byB0aGUgc291cmNlIHByb3RvdHlwZXMgd2lsbCBiZSByZWZsZWN0ZWQgaW4gdGhlIHByb3h5LXByb3RvdHlwZSwgd2hpY2ggbWF5IGJlIGRlc2lyYWJsZS5cbiAqL1xuY29uc3Qgc29mdE1peFByb3RvcyA9IChpbmdyZWRpZW50cywgY29uc3RydWN0b3IpID0+IHByb3h5TWl4KFsuLi5pbmdyZWRpZW50cywgeyBjb25zdHJ1Y3RvciB9XSk7XG5cbmNvbnN0IHNldHRpbmdzID0ge1xuICAgIGluaXRGdW5jdGlvbjogbnVsbCxcbiAgICBzdGF0aWNzU3RyYXRlZ3k6ICdjb3B5JyxcbiAgICBwcm90b3R5cGVTdHJhdGVneTogJ2NvcHknLFxuICAgIGRlY29yYXRvckluaGVyaXRhbmNlOiAnZGVlcCcsXG59O1xuXG4vLyBLZWVwcyB0cmFjayBvZiBjb25zdGl0dWVudCBjbGFzc2VzIGZvciBldmVyeSBtaXhpbiBjbGFzcyBjcmVhdGVkIGJ5IHRzLW1peGVyLlxuY29uc3QgbWl4aW5zID0gbmV3IFdlYWtNYXAoKTtcbmNvbnN0IGdldE1peGluc0ZvckNsYXNzID0gKGNsYXp6KSA9PiBtaXhpbnMuZ2V0KGNsYXp6KTtcbmNvbnN0IHJlZ2lzdGVyTWl4aW5zID0gKG1peGVkQ2xhc3MsIGNvbnN0aXR1ZW50cykgPT4gbWl4aW5zLnNldChtaXhlZENsYXNzLCBjb25zdGl0dWVudHMpO1xuY29uc3QgaGFzTWl4aW4gPSAoaW5zdGFuY2UsIG1peGluKSA9PiB7XG4gICAgaWYgKGluc3RhbmNlIGluc3RhbmNlb2YgbWl4aW4pXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIGNvbnN0IGNvbnN0cnVjdG9yID0gaW5zdGFuY2UuY29uc3RydWN0b3I7XG4gICAgY29uc3QgdmlzaXRlZCA9IG5ldyBTZXQoKTtcbiAgICBsZXQgZnJvbnRpZXIgPSBuZXcgU2V0KCk7XG4gICAgZnJvbnRpZXIuYWRkKGNvbnN0cnVjdG9yKTtcbiAgICB3aGlsZSAoZnJvbnRpZXIuc2l6ZSA+IDApIHtcbiAgICAgICAgLy8gY2hlY2sgaWYgdGhlIGZyb250aWVyIGhhcyB0aGUgbWl4aW4gd2UncmUgbG9va2luZyBmb3IuICBpZiBub3QsIHdlIGNhbiBzYXkgd2UgdmlzaXRlZCBldmVyeSBpdGVtIGluIHRoZSBmcm9udGllclxuICAgICAgICBpZiAoZnJvbnRpZXIuaGFzKG1peGluKSlcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICBmcm9udGllci5mb3JFYWNoKChpdGVtKSA9PiB2aXNpdGVkLmFkZChpdGVtKSk7XG4gICAgICAgIC8vIGJ1aWxkIGEgbmV3IGZyb250aWVyIGJhc2VkIG9uIHRoZSBhc3NvY2lhdGVkIG1peGluIGNsYXNzZXMgYW5kIHByb3RvdHlwZSBjaGFpbnMgb2YgZWFjaCBmcm9udGllciBpdGVtXG4gICAgICAgIGNvbnN0IG5ld0Zyb250aWVyID0gbmV3IFNldCgpO1xuICAgICAgICBmcm9udGllci5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICBjb25zdCBpdGVtQ29uc3RpdHVlbnRzID0gKF9hID0gbWl4aW5zLmdldChpdGVtKSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogcHJvdG9DaGFpbihpdGVtLnByb3RvdHlwZSlcbiAgICAgICAgICAgICAgICAubWFwKChwcm90bykgPT4gcHJvdG8uY29uc3RydWN0b3IpXG4gICAgICAgICAgICAgICAgLmZpbHRlcigoaXRlbSkgPT4gaXRlbSAhPT0gbnVsbCk7XG4gICAgICAgICAgICBpZiAoaXRlbUNvbnN0aXR1ZW50cylcbiAgICAgICAgICAgICAgICBpdGVtQ29uc3RpdHVlbnRzLmZvckVhY2goKGNvbnN0aXR1ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdmlzaXRlZC5oYXMoY29uc3RpdHVlbnQpICYmICFmcm9udGllci5oYXMoY29uc3RpdHVlbnQpKVxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3RnJvbnRpZXIuYWRkKGNvbnN0aXR1ZW50KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIHdlIGhhdmUgYSBuZXcgZnJvbnRpZXIsIG5vdyBzZWFyY2ggYWdhaW5cbiAgICAgICAgZnJvbnRpZXIgPSBuZXdGcm9udGllcjtcbiAgICB9XG4gICAgLy8gaWYgd2UgZ2V0IGhlcmUsIHdlIGNvdWxkbid0IGZpbmQgdGhlIG1peGluIGFueXdoZXJlIGluIHRoZSBwcm90b3R5cGUgY2hhaW4gb3IgYXNzb2NpYXRlZCBtaXhpbiBjbGFzc2VzXG4gICAgcmV0dXJuIGZhbHNlO1xufTtcblxuY29uc3QgbWVyZ2VPYmplY3RzT2ZEZWNvcmF0b3JzID0gKG8xLCBvMikgPT4ge1xuICAgIHZhciBfYSwgX2I7XG4gICAgY29uc3QgYWxsS2V5cyA9IHVuaXF1ZShbLi4uT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMobzEpLCAuLi5PYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvMildKTtcbiAgICBjb25zdCBtZXJnZWRPYmplY3QgPSB7fTtcbiAgICBmb3IgKGxldCBrZXkgb2YgYWxsS2V5cylcbiAgICAgICAgbWVyZ2VkT2JqZWN0W2tleV0gPSB1bmlxdWUoWy4uLigoX2EgPSBvMSA9PT0gbnVsbCB8fCBvMSA9PT0gdm9pZCAwID8gdm9pZCAwIDogbzFba2V5XSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogW10pLCAuLi4oKF9iID0gbzIgPT09IG51bGwgfHwgbzIgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG8yW2tleV0pICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IFtdKV0pO1xuICAgIHJldHVybiBtZXJnZWRPYmplY3Q7XG59O1xuY29uc3QgbWVyZ2VQcm9wZXJ0eUFuZE1ldGhvZERlY29yYXRvcnMgPSAoZDEsIGQyKSA9PiB7XG4gICAgdmFyIF9hLCBfYiwgX2MsIF9kO1xuICAgIHJldHVybiAoe1xuICAgICAgICBwcm9wZXJ0eTogbWVyZ2VPYmplY3RzT2ZEZWNvcmF0b3JzKChfYSA9IGQxID09PSBudWxsIHx8IGQxID09PSB2b2lkIDAgPyB2b2lkIDAgOiBkMS5wcm9wZXJ0eSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDoge30sIChfYiA9IGQyID09PSBudWxsIHx8IGQyID09PSB2b2lkIDAgPyB2b2lkIDAgOiBkMi5wcm9wZXJ0eSkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDoge30pLFxuICAgICAgICBtZXRob2Q6IG1lcmdlT2JqZWN0c09mRGVjb3JhdG9ycygoX2MgPSBkMSA9PT0gbnVsbCB8fCBkMSA9PT0gdm9pZCAwID8gdm9pZCAwIDogZDEubWV0aG9kKSAhPT0gbnVsbCAmJiBfYyAhPT0gdm9pZCAwID8gX2MgOiB7fSwgKF9kID0gZDIgPT09IG51bGwgfHwgZDIgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGQyLm1ldGhvZCkgIT09IG51bGwgJiYgX2QgIT09IHZvaWQgMCA/IF9kIDoge30pLFxuICAgIH0pO1xufTtcbmNvbnN0IG1lcmdlRGVjb3JhdG9ycyA9IChkMSwgZDIpID0+IHtcbiAgICB2YXIgX2EsIF9iLCBfYywgX2QsIF9lLCBfZjtcbiAgICByZXR1cm4gKHtcbiAgICAgICAgY2xhc3M6IHVuaXF1ZShbLi4uKF9hID0gZDEgPT09IG51bGwgfHwgZDEgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGQxLmNsYXNzKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBbXSwgLi4uKF9iID0gZDIgPT09IG51bGwgfHwgZDIgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGQyLmNsYXNzKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBbXV0pLFxuICAgICAgICBzdGF0aWM6IG1lcmdlUHJvcGVydHlBbmRNZXRob2REZWNvcmF0b3JzKChfYyA9IGQxID09PSBudWxsIHx8IGQxID09PSB2b2lkIDAgPyB2b2lkIDAgOiBkMS5zdGF0aWMpICE9PSBudWxsICYmIF9jICE9PSB2b2lkIDAgPyBfYyA6IHt9LCAoX2QgPSBkMiA9PT0gbnVsbCB8fCBkMiA9PT0gdm9pZCAwID8gdm9pZCAwIDogZDIuc3RhdGljKSAhPT0gbnVsbCAmJiBfZCAhPT0gdm9pZCAwID8gX2QgOiB7fSksXG4gICAgICAgIGluc3RhbmNlOiBtZXJnZVByb3BlcnR5QW5kTWV0aG9kRGVjb3JhdG9ycygoX2UgPSBkMSA9PT0gbnVsbCB8fCBkMSA9PT0gdm9pZCAwID8gdm9pZCAwIDogZDEuaW5zdGFuY2UpICE9PSBudWxsICYmIF9lICE9PSB2b2lkIDAgPyBfZSA6IHt9LCAoX2YgPSBkMiA9PT0gbnVsbCB8fCBkMiA9PT0gdm9pZCAwID8gdm9pZCAwIDogZDIuaW5zdGFuY2UpICE9PSBudWxsICYmIF9mICE9PSB2b2lkIDAgPyBfZiA6IHt9KSxcbiAgICB9KTtcbn07XG5jb25zdCBkZWNvcmF0b3JzID0gbmV3IE1hcCgpO1xuY29uc3QgZmluZEFsbENvbnN0aXR1ZW50Q2xhc3NlcyA9ICguLi5jbGFzc2VzKSA9PiB7XG4gICAgdmFyIF9hO1xuICAgIGNvbnN0IGFsbENsYXNzZXMgPSBuZXcgU2V0KCk7XG4gICAgY29uc3QgZnJvbnRpZXIgPSBuZXcgU2V0KFsuLi5jbGFzc2VzXSk7XG4gICAgd2hpbGUgKGZyb250aWVyLnNpemUgPiAwKSB7XG4gICAgICAgIGZvciAobGV0IGNsYXp6IG9mIGZyb250aWVyKSB7XG4gICAgICAgICAgICBjb25zdCBwcm90b0NoYWluQ2xhc3NlcyA9IHByb3RvQ2hhaW4oY2xhenoucHJvdG90eXBlKS5tYXAocHJvdG8gPT4gcHJvdG8uY29uc3RydWN0b3IpO1xuICAgICAgICAgICAgY29uc3QgbWl4aW5DbGFzc2VzID0gKF9hID0gZ2V0TWl4aW5zRm9yQ2xhc3MoY2xhenopKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBbXTtcbiAgICAgICAgICAgIGNvbnN0IHBvdGVudGlhbGx5TmV3Q2xhc3NlcyA9IFsuLi5wcm90b0NoYWluQ2xhc3NlcywgLi4ubWl4aW5DbGFzc2VzXTtcbiAgICAgICAgICAgIGNvbnN0IG5ld0NsYXNzZXMgPSBwb3RlbnRpYWxseU5ld0NsYXNzZXMuZmlsdGVyKGMgPT4gIWFsbENsYXNzZXMuaGFzKGMpKTtcbiAgICAgICAgICAgIGZvciAobGV0IG5ld0NsYXNzIG9mIG5ld0NsYXNzZXMpXG4gICAgICAgICAgICAgICAgZnJvbnRpZXIuYWRkKG5ld0NsYXNzKTtcbiAgICAgICAgICAgIGFsbENsYXNzZXMuYWRkKGNsYXp6KTtcbiAgICAgICAgICAgIGZyb250aWVyLmRlbGV0ZShjbGF6eik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFsuLi5hbGxDbGFzc2VzXTtcbn07XG5jb25zdCBkZWVwRGVjb3JhdG9yU2VhcmNoID0gKC4uLmNsYXNzZXMpID0+IHtcbiAgICBjb25zdCBkZWNvcmF0b3JzRm9yQ2xhc3NDaGFpbiA9IGZpbmRBbGxDb25zdGl0dWVudENsYXNzZXMoLi4uY2xhc3NlcylcbiAgICAgICAgLm1hcChjbGF6eiA9PiBkZWNvcmF0b3JzLmdldChjbGF6eikpXG4gICAgICAgIC5maWx0ZXIoZGVjb3JhdG9ycyA9PiAhIWRlY29yYXRvcnMpO1xuICAgIGlmIChkZWNvcmF0b3JzRm9yQ2xhc3NDaGFpbi5sZW5ndGggPT0gMClcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgIGlmIChkZWNvcmF0b3JzRm9yQ2xhc3NDaGFpbi5sZW5ndGggPT0gMSlcbiAgICAgICAgcmV0dXJuIGRlY29yYXRvcnNGb3JDbGFzc0NoYWluWzBdO1xuICAgIHJldHVybiBkZWNvcmF0b3JzRm9yQ2xhc3NDaGFpbi5yZWR1Y2UoKGQxLCBkMikgPT4gbWVyZ2VEZWNvcmF0b3JzKGQxLCBkMikpO1xufTtcbmNvbnN0IGRpcmVjdERlY29yYXRvclNlYXJjaCA9ICguLi5jbGFzc2VzKSA9PiB7XG4gICAgY29uc3QgY2xhc3NEZWNvcmF0b3JzID0gY2xhc3Nlcy5tYXAoY2xhenogPT4gZ2V0RGVjb3JhdG9yc0ZvckNsYXNzKGNsYXp6KSk7XG4gICAgaWYgKGNsYXNzRGVjb3JhdG9ycy5sZW5ndGggPT09IDApXG4gICAgICAgIHJldHVybiB7fTtcbiAgICBpZiAoY2xhc3NEZWNvcmF0b3JzLmxlbmd0aCA9PT0gMSlcbiAgICAgICAgcmV0dXJuIGNsYXNzRGVjb3JhdG9yc1swXTtcbiAgICByZXR1cm4gY2xhc3NEZWNvcmF0b3JzLnJlZHVjZSgoZDEsIGQyKSA9PiBtZXJnZURlY29yYXRvcnMoZDEsIGQyKSk7XG59O1xuY29uc3QgZ2V0RGVjb3JhdG9yc0ZvckNsYXNzID0gKGNsYXp6KSA9PiB7XG4gICAgbGV0IGRlY29yYXRvcnNGb3JDbGFzcyA9IGRlY29yYXRvcnMuZ2V0KGNsYXp6KTtcbiAgICBpZiAoIWRlY29yYXRvcnNGb3JDbGFzcykge1xuICAgICAgICBkZWNvcmF0b3JzRm9yQ2xhc3MgPSB7fTtcbiAgICAgICAgZGVjb3JhdG9ycy5zZXQoY2xhenosIGRlY29yYXRvcnNGb3JDbGFzcyk7XG4gICAgfVxuICAgIHJldHVybiBkZWNvcmF0b3JzRm9yQ2xhc3M7XG59O1xuY29uc3QgZGVjb3JhdGVDbGFzcyA9IChkZWNvcmF0b3IpID0+ICgoY2xhenopID0+IHtcbiAgICBjb25zdCBkZWNvcmF0b3JzRm9yQ2xhc3MgPSBnZXREZWNvcmF0b3JzRm9yQ2xhc3MoY2xhenopO1xuICAgIGxldCBjbGFzc0RlY29yYXRvcnMgPSBkZWNvcmF0b3JzRm9yQ2xhc3MuY2xhc3M7XG4gICAgaWYgKCFjbGFzc0RlY29yYXRvcnMpIHtcbiAgICAgICAgY2xhc3NEZWNvcmF0b3JzID0gW107XG4gICAgICAgIGRlY29yYXRvcnNGb3JDbGFzcy5jbGFzcyA9IGNsYXNzRGVjb3JhdG9ycztcbiAgICB9XG4gICAgY2xhc3NEZWNvcmF0b3JzLnB1c2goZGVjb3JhdG9yKTtcbiAgICByZXR1cm4gZGVjb3JhdG9yKGNsYXp6KTtcbn0pO1xuY29uc3QgZGVjb3JhdGVNZW1iZXIgPSAoZGVjb3JhdG9yKSA9PiAoKG9iamVjdCwga2V5LCAuLi5vdGhlckFyZ3MpID0+IHtcbiAgICB2YXIgX2EsIF9iLCBfYztcbiAgICBjb25zdCBkZWNvcmF0b3JUYXJnZXRUeXBlID0gdHlwZW9mIG9iamVjdCA9PT0gJ2Z1bmN0aW9uJyA/ICdzdGF0aWMnIDogJ2luc3RhbmNlJztcbiAgICBjb25zdCBkZWNvcmF0b3JUeXBlID0gdHlwZW9mIG9iamVjdFtrZXldID09PSAnZnVuY3Rpb24nID8gJ21ldGhvZCcgOiAncHJvcGVydHknO1xuICAgIGNvbnN0IGNsYXp6ID0gZGVjb3JhdG9yVGFyZ2V0VHlwZSA9PT0gJ3N0YXRpYycgPyBvYmplY3QgOiBvYmplY3QuY29uc3RydWN0b3I7XG4gICAgY29uc3QgZGVjb3JhdG9yc0ZvckNsYXNzID0gZ2V0RGVjb3JhdG9yc0ZvckNsYXNzKGNsYXp6KTtcbiAgICBjb25zdCBkZWNvcmF0b3JzRm9yVGFyZ2V0VHlwZSA9IChfYSA9IGRlY29yYXRvcnNGb3JDbGFzcyA9PT0gbnVsbCB8fCBkZWNvcmF0b3JzRm9yQ2xhc3MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGRlY29yYXRvcnNGb3JDbGFzc1tkZWNvcmF0b3JUYXJnZXRUeXBlXSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDoge307XG4gICAgZGVjb3JhdG9yc0ZvckNsYXNzW2RlY29yYXRvclRhcmdldFR5cGVdID0gZGVjb3JhdG9yc0ZvclRhcmdldFR5cGU7XG4gICAgbGV0IGRlY29yYXRvcnNGb3JUeXBlID0gKF9iID0gZGVjb3JhdG9yc0ZvclRhcmdldFR5cGUgPT09IG51bGwgfHwgZGVjb3JhdG9yc0ZvclRhcmdldFR5cGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGRlY29yYXRvcnNGb3JUYXJnZXRUeXBlW2RlY29yYXRvclR5cGVdKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiB7fTtcbiAgICBkZWNvcmF0b3JzRm9yVGFyZ2V0VHlwZVtkZWNvcmF0b3JUeXBlXSA9IGRlY29yYXRvcnNGb3JUeXBlO1xuICAgIGxldCBkZWNvcmF0b3JzRm9yS2V5ID0gKF9jID0gZGVjb3JhdG9yc0ZvclR5cGUgPT09IG51bGwgfHwgZGVjb3JhdG9yc0ZvclR5cGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGRlY29yYXRvcnNGb3JUeXBlW2tleV0pICE9PSBudWxsICYmIF9jICE9PSB2b2lkIDAgPyBfYyA6IFtdO1xuICAgIGRlY29yYXRvcnNGb3JUeXBlW2tleV0gPSBkZWNvcmF0b3JzRm9yS2V5O1xuICAgIC8vIEB0cy1pZ25vcmU6IGFycmF5IGlzIHR5cGUgYEFbXSB8IEJbXWAgYW5kIGl0ZW0gaXMgdHlwZSBgQSB8IEJgLCBzbyB0ZWNobmljYWxseSBhIHR5cGUgZXJyb3IsIGJ1dCBpdCdzIGZpbmVcbiAgICBkZWNvcmF0b3JzRm9yS2V5LnB1c2goZGVjb3JhdG9yKTtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgcmV0dXJuIGRlY29yYXRvcihvYmplY3QsIGtleSwgLi4ub3RoZXJBcmdzKTtcbn0pO1xuY29uc3QgZGVjb3JhdGUgPSAoZGVjb3JhdG9yKSA9PiAoKC4uLmFyZ3MpID0+IHtcbiAgICBpZiAoYXJncy5sZW5ndGggPT09IDEpXG4gICAgICAgIHJldHVybiBkZWNvcmF0ZUNsYXNzKGRlY29yYXRvcikoYXJnc1swXSk7XG4gICAgcmV0dXJuIGRlY29yYXRlTWVtYmVyKGRlY29yYXRvcikoLi4uYXJncyk7XG59KTtcblxuZnVuY3Rpb24gTWl4aW4oLi4uY29uc3RydWN0b3JzKSB7XG4gICAgdmFyIF9hLCBfYiwgX2M7XG4gICAgY29uc3QgcHJvdG90eXBlcyA9IGNvbnN0cnVjdG9ycy5tYXAoY29uc3RydWN0b3IgPT4gY29uc3RydWN0b3IucHJvdG90eXBlKTtcbiAgICAvLyBIZXJlIHdlIGdhdGhlciB1cCB0aGUgaW5pdCBmdW5jdGlvbnMgb2YgdGhlIGluZ3JlZGllbnQgcHJvdG90eXBlcywgY29tYmluZSB0aGVtIGludG8gb25lIGluaXQgZnVuY3Rpb24sIGFuZFxuICAgIC8vIGF0dGFjaCBpdCB0byB0aGUgbWl4ZWQgY2xhc3MgcHJvdG90eXBlLiAgVGhlIHJlYXNvbiB3ZSBkbyB0aGlzIGlzIGJlY2F1c2Ugd2Ugd2FudCB0aGUgaW5pdCBmdW5jdGlvbnMgdG8gbWl4XG4gICAgLy8gc2ltaWxhcmx5IHRvIGNvbnN0cnVjdG9ycyAtLSBub3QgbWV0aG9kcywgd2hpY2ggc2ltcGx5IG92ZXJyaWRlIGVhY2ggb3RoZXIuXG4gICAgY29uc3QgaW5pdEZ1bmN0aW9uTmFtZSA9IHNldHRpbmdzLmluaXRGdW5jdGlvbjtcbiAgICBpZiAoaW5pdEZ1bmN0aW9uTmFtZSAhPT0gbnVsbCkge1xuICAgICAgICBjb25zdCBpbml0RnVuY3Rpb25zID0gcHJvdG90eXBlc1xuICAgICAgICAgICAgLm1hcChwcm90byA9PiBwcm90b1tpbml0RnVuY3Rpb25OYW1lXSlcbiAgICAgICAgICAgIC5maWx0ZXIoZnVuYyA9PiB0eXBlb2YgZnVuYyA9PT0gJ2Z1bmN0aW9uJyk7XG4gICAgICAgIGNvbnN0IGNvbWJpbmVkSW5pdEZ1bmN0aW9uID0gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGluaXRGdW5jdGlvbiBvZiBpbml0RnVuY3Rpb25zKVxuICAgICAgICAgICAgICAgIGluaXRGdW5jdGlvbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgZXh0cmFQcm90byA9IHsgW2luaXRGdW5jdGlvbk5hbWVdOiBjb21iaW5lZEluaXRGdW5jdGlvbiB9O1xuICAgICAgICBwcm90b3R5cGVzLnB1c2goZXh0cmFQcm90byk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIE1peGVkQ2xhc3MoLi4uYXJncykge1xuICAgICAgICBmb3IgKGNvbnN0IGNvbnN0cnVjdG9yIG9mIGNvbnN0cnVjdG9ycylcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmU6IHBvdGVudGlhbGx5IGFic3RyYWN0IGNsYXNzXG4gICAgICAgICAgICBjb3B5UHJvcHModGhpcywgbmV3IGNvbnN0cnVjdG9yKC4uLmFyZ3MpKTtcbiAgICAgICAgaWYgKGluaXRGdW5jdGlvbk5hbWUgIT09IG51bGwgJiYgdHlwZW9mIHRoaXNbaW5pdEZ1bmN0aW9uTmFtZV0gPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICB0aGlzW2luaXRGdW5jdGlvbk5hbWVdLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgICBNaXhlZENsYXNzLnByb3RvdHlwZSA9IHNldHRpbmdzLnByb3RvdHlwZVN0cmF0ZWd5ID09PSAnY29weSdcbiAgICAgICAgPyBoYXJkTWl4UHJvdG9zKHByb3RvdHlwZXMsIE1peGVkQ2xhc3MpXG4gICAgICAgIDogc29mdE1peFByb3Rvcyhwcm90b3R5cGVzLCBNaXhlZENsYXNzKTtcbiAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YoTWl4ZWRDbGFzcywgc2V0dGluZ3Muc3RhdGljc1N0cmF0ZWd5ID09PSAnY29weSdcbiAgICAgICAgPyBoYXJkTWl4UHJvdG9zKGNvbnN0cnVjdG9ycywgbnVsbCwgWydwcm90b3R5cGUnXSlcbiAgICAgICAgOiBwcm94eU1peChjb25zdHJ1Y3RvcnMsIEZ1bmN0aW9uLnByb3RvdHlwZSkpO1xuICAgIGxldCBEZWNvcmF0ZWRNaXhlZENsYXNzID0gTWl4ZWRDbGFzcztcbiAgICBpZiAoc2V0dGluZ3MuZGVjb3JhdG9ySW5oZXJpdGFuY2UgIT09ICdub25lJykge1xuICAgICAgICBjb25zdCBjbGFzc0RlY29yYXRvcnMgPSBzZXR0aW5ncy5kZWNvcmF0b3JJbmhlcml0YW5jZSA9PT0gJ2RlZXAnXG4gICAgICAgICAgICA/IGRlZXBEZWNvcmF0b3JTZWFyY2goLi4uY29uc3RydWN0b3JzKVxuICAgICAgICAgICAgOiBkaXJlY3REZWNvcmF0b3JTZWFyY2goLi4uY29uc3RydWN0b3JzKTtcbiAgICAgICAgZm9yIChsZXQgZGVjb3JhdG9yIG9mIChfYSA9IGNsYXNzRGVjb3JhdG9ycyA9PT0gbnVsbCB8fCBjbGFzc0RlY29yYXRvcnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGNsYXNzRGVjb3JhdG9ycy5jbGFzcykgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogW10pIHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGRlY29yYXRvcihEZWNvcmF0ZWRNaXhlZENsYXNzKTtcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICBEZWNvcmF0ZWRNaXhlZENsYXNzID0gcmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGFwcGx5UHJvcEFuZE1ldGhvZERlY29yYXRvcnMoKF9iID0gY2xhc3NEZWNvcmF0b3JzID09PSBudWxsIHx8IGNsYXNzRGVjb3JhdG9ycyA9PT0gdm9pZCAwID8gdm9pZCAwIDogY2xhc3NEZWNvcmF0b3JzLnN0YXRpYykgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDoge30sIERlY29yYXRlZE1peGVkQ2xhc3MpO1xuICAgICAgICBhcHBseVByb3BBbmRNZXRob2REZWNvcmF0b3JzKChfYyA9IGNsYXNzRGVjb3JhdG9ycyA9PT0gbnVsbCB8fCBjbGFzc0RlY29yYXRvcnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGNsYXNzRGVjb3JhdG9ycy5pbnN0YW5jZSkgIT09IG51bGwgJiYgX2MgIT09IHZvaWQgMCA/IF9jIDoge30sIERlY29yYXRlZE1peGVkQ2xhc3MucHJvdG90eXBlKTtcbiAgICB9XG4gICAgcmVnaXN0ZXJNaXhpbnMoRGVjb3JhdGVkTWl4ZWRDbGFzcywgY29uc3RydWN0b3JzKTtcbiAgICByZXR1cm4gRGVjb3JhdGVkTWl4ZWRDbGFzcztcbn1cbmNvbnN0IGFwcGx5UHJvcEFuZE1ldGhvZERlY29yYXRvcnMgPSAocHJvcEFuZE1ldGhvZERlY29yYXRvcnMsIHRhcmdldCkgPT4ge1xuICAgIGNvbnN0IHByb3BEZWNvcmF0b3JzID0gcHJvcEFuZE1ldGhvZERlY29yYXRvcnMucHJvcGVydHk7XG4gICAgY29uc3QgbWV0aG9kRGVjb3JhdG9ycyA9IHByb3BBbmRNZXRob2REZWNvcmF0b3JzLm1ldGhvZDtcbiAgICBpZiAocHJvcERlY29yYXRvcnMpXG4gICAgICAgIGZvciAobGV0IGtleSBpbiBwcm9wRGVjb3JhdG9ycylcbiAgICAgICAgICAgIGZvciAobGV0IGRlY29yYXRvciBvZiBwcm9wRGVjb3JhdG9yc1trZXldKVxuICAgICAgICAgICAgICAgIGRlY29yYXRvcih0YXJnZXQsIGtleSk7XG4gICAgaWYgKG1ldGhvZERlY29yYXRvcnMpXG4gICAgICAgIGZvciAobGV0IGtleSBpbiBtZXRob2REZWNvcmF0b3JzKVxuICAgICAgICAgICAgZm9yIChsZXQgZGVjb3JhdG9yIG9mIG1ldGhvZERlY29yYXRvcnNba2V5XSlcbiAgICAgICAgICAgICAgICBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpKTtcbn07XG4vKipcbiAqIEEgZGVjb3JhdG9yIHZlcnNpb24gb2YgdGhlIGBNaXhpbmAgZnVuY3Rpb24uICBZb3UnbGwgd2FudCB0byB1c2UgdGhpcyBpbnN0ZWFkIG9mIGBNaXhpbmAgZm9yIG1peGluZyBnZW5lcmljIGNsYXNzZXMuXG4gKi9cbmNvbnN0IG1peCA9ICguLi5pbmdyZWRpZW50cykgPT4gZGVjb3JhdGVkQ2xhc3MgPT4ge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25zdCBtaXhlZENsYXNzID0gTWl4aW4oLi4uaW5ncmVkaWVudHMuY29uY2F0KFtkZWNvcmF0ZWRDbGFzc10pKTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobWl4ZWRDbGFzcywgJ25hbWUnLCB7XG4gICAgICAgIHZhbHVlOiBkZWNvcmF0ZWRDbGFzcy5uYW1lLFxuICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgfSk7XG4gICAgcmV0dXJuIG1peGVkQ2xhc3M7XG59O1xuXG5leHBvcnQgeyBNaXhpbiwgZGVjb3JhdGUsIGhhc01peGluLCBtaXgsIHNldHRpbmdzIH07XG4iLCJpbXBvcnQgeyBNaXhpbiB9IGZyb20gJ3RzLW1peGVyJztcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEV2ZW50TWl4aW4gaW1wbGVtZW50cyBFdmVudEF3YXJlSW50ZXJmYWNlIHtcbiAgX2xpc3RlbmVyczogUmVjb3JkPHN0cmluZywgRXZlbnRIYW5kbGVyW10+ID0ge307XG5cbiAgb24oZXZlbnQ6IHN0cmluZyB8IHN0cmluZ1tdLCBoYW5kbGVyOiBFdmVudEhhbmRsZXIpOiB0aGlzIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShldmVudCkpIHtcbiAgICAgIGZvciAoY29uc3QgZSBvZiBldmVudCkge1xuICAgICAgICB0aGlzLm9uKGUsIGhhbmRsZXIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdGhpcy5fbGlzdGVuZXJzW2V2ZW50XSA/Pz0gW107XG5cbiAgICB0aGlzLl9saXN0ZW5lcnNbZXZlbnRdLnB1c2goaGFuZGxlcik7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIG9uY2UoZXZlbnQ6IHN0cmluZyB8IHN0cmluZ1tdLCBoYW5kbGVyOiBFdmVudEhhbmRsZXIpOiB0aGlzIHtcbiAgICBoYW5kbGVyLm9uY2UgPSB0cnVlO1xuICAgIHJldHVybiB0aGlzLm9uKGV2ZW50LCBoYW5kbGVyKTtcbiAgfVxuXG4gIG9mZihldmVudDogc3RyaW5nLCBoYW5kbGVyPzogRXZlbnRIYW5kbGVyKTogdGhpcyB7XG4gICAgaWYgKGhhbmRsZXIpIHtcbiAgICAgIHRoaXMuX2xpc3RlbmVyc1tldmVudF0gPSB0aGlzLmxpc3RlbmVycyhldmVudCkuZmlsdGVyKChsaXN0ZW5lcikgPT4gbGlzdGVuZXIgIT09IGhhbmRsZXIpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZGVsZXRlIHRoaXMuX2xpc3RlbmVyc1tldmVudF07XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHRyaWdnZXIoZXZlbnQ6IHN0cmluZyB8IHN0cmluZ1tdLCAuLi5hcmdzOiBhbnlbXSk6IHRoaXMge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGV2ZW50KSkge1xuICAgICAgZm9yIChjb25zdCBlIG9mIGV2ZW50KSB7XG4gICAgICAgIHRoaXMudHJpZ2dlcihlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgbGlzdGVuZXIgb2YgdGhpcy5saXN0ZW5lcnMoZXZlbnQpKSB7XG4gICAgICBsaXN0ZW5lciguLi5hcmdzKTtcbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgb25jZVxuICAgIHRoaXMuX2xpc3RlbmVyc1tldmVudF0gPSB0aGlzLmxpc3RlbmVycyhldmVudCkuZmlsdGVyKChsaXN0ZW5lcikgPT4gbGlzdGVuZXI/Lm9uY2UgIT09IHRydWUpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMoZXZlbnQ6IHN0cmluZyk6IEV2ZW50SGFuZGxlcltdIHtcbiAgICByZXR1cm4gdGhpcy5fbGlzdGVuZXJzW2V2ZW50XSA9PT0gdW5kZWZpbmVkID8gW10gOiB0aGlzLl9saXN0ZW5lcnNbZXZlbnRdO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBFdmVudEJ1cyBleHRlbmRzIE1peGluKEV2ZW50TWl4aW4pIHtcbn1cblxuZXhwb3J0IHR5cGUgRXZlbnRIYW5kbGVyID0gKCguLi5ldmVudDogYW55W10pID0+IHZvaWQpICYgeyBvbmNlPzogYm9vbGVhbiB9O1xuXG5leHBvcnQgaW50ZXJmYWNlIEV2ZW50QXdhcmVJbnRlcmZhY2Uge1xuICBvbihldmVudDogc3RyaW5nIHwgc3RyaW5nW10sIGhhbmRsZXI6IEV2ZW50SGFuZGxlcik6IHRoaXM7XG5cbiAgb25jZShldmVudDogc3RyaW5nIHwgc3RyaW5nW10sIGhhbmRsZXI6IEV2ZW50SGFuZGxlcik6IHRoaXM7XG5cbiAgb2ZmKGV2ZW50OiBzdHJpbmcsIGhhbmRsZXI/OiBFdmVudEhhbmRsZXIpOiB0aGlzO1xuXG4gIHRyaWdnZXIoZXZlbnQ6IHN0cmluZyB8IHN0cmluZ1tdLCAuLi5hcmdzOiBhbnlbXSk6IHRoaXM7XG5cbiAgbGlzdGVuZXJzKGV2ZW50OiBzdHJpbmcpOiBFdmVudEhhbmRsZXJbXTtcbn1cbiIsIlxuaW1wb3J0IHsgZGF0YSB9IGZyb20gJy4vZGF0YSc7XG5pbXBvcnQgeyBFdmVudEF3YXJlSW50ZXJmYWNlLCBFdmVudE1peGluIH0gZnJvbSAnLi9ldmVudHMnO1xuaW1wb3J0IHsgZG9tcmVhZHkgfSBmcm9tICcuL3NlcnZpY2UnO1xuaW1wb3J0IHsgQ29uc3RydWN0b3IsIFVuaWNvcm5QbHVnaW4gfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IE1peGluIH0gZnJvbSAndHMtbWl4ZXInO1xuXG5leHBvcnQgdHlwZSBJbmplY3Rpb25LZXk8VCA9IGFueT4gPSBzdHJpbmcgfCBzeW1ib2wgfCBDb25zdHJ1Y3RvcjxUPjtcblxuZXhwb3J0IGludGVyZmFjZSBVbmljb3JuQXBwIGV4dGVuZHMgRXZlbnRBd2FyZUludGVyZmFjZSB7fVxuXG5leHBvcnQgY2xhc3MgVW5pY29ybkFwcCBleHRlbmRzIE1peGluKEV2ZW50TWl4aW4pIGltcGxlbWVudHMgRXZlbnRBd2FyZUludGVyZmFjZSB7XG4gIHJlZ2lzdHJ5ID0gbmV3IE1hcCgpO1xuICBwbHVnaW5zID0gbmV3IE1hcCgpO1xuICAvLyBfbGlzdGVuZXJzID0ge307XG4gIHdhaXRzOiBQcm9taXNlPGFueT5bXSA9IFtdO1xuICBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuICBkZWZhdWx0T3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICBkb21yZWFkeSA9IGRvbXJlYWR5O1xuICBkYXRhID0gZGF0YTtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgLy8gV2FpdCBkb20gcmVhZHlcbiAgICBpZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhpcy53YWl0KChyZXNvbHZlOiBGdW5jdGlvbikgPT4ge1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4gcmVzb2x2ZSgpKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBSZWFkeVxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgICAgICAgdGhpcy5jb21wbGV0ZWQoKS50aGVuKCgpID0+IHRoaXMudHJpZ2dlcignbG9hZGVkJykpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgdXNlKHBsdWdpbjogVW5pY29yblBsdWdpbiwgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9KSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkocGx1Z2luKSkge1xuICAgICAgcGx1Z2luLmZvckVhY2gocCA9PiB0aGlzLnVzZShwKSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvLyBpZiAocGx1Z2luLmlzID09PSB1bmRlZmluZWQpIHtcbiAgICAvLyAgIHRocm93IG5ldyBFcnJvcihgUGx1Z2luOiAke3BsdWdpbi5uYW1lfSBtdXN0IGluc3RhbmNlIG9mIDogJHtQbHVnaW4ubmFtZX1gKTtcbiAgICAvLyB9XG5cbiAgICBwbHVnaW4/Lmluc3RhbGw/Lih0aGlzLCBvcHRpb25zKTtcblxuICAgIHRoaXMudHJpZ2dlcigncGx1Z2luLmluc3RhbGxlZCcsIHBsdWdpbik7XG5cbiAgICB0aGlzLnBsdWdpbnMuc2V0KHBsdWdpbiwgcGx1Z2luKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZGV0YWNoKHBsdWdpbjogYW55KSB7XG4gICAgaWYgKHBsdWdpbi51bmluc3RhbGwpIHtcbiAgICAgIHBsdWdpbi51bmluc3RhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgdGhpcy50cmlnZ2VyKCdwbHVnaW4udW5pbnN0YWxsZWQnLCBwbHVnaW4pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBpbmplY3Q8VD4oaWQ6IEluamVjdGlvbktleTxUPik6IFQ7XG4gIGluamVjdDxUPihpZDogSW5qZWN0aW9uS2V5PFQ+LCBkZWY6IFQpOiBUO1xuICBpbmplY3Q8VD4oaWQ6IEluamVjdGlvbktleTxUPiwgZGVmPzogVCk6IFQgfCB1bmRlZmluZWQge1xuICAgIGlmICghdHlwZW9mIHRoaXMucmVnaXN0cnkuaGFzKGlkKSkge1xuICAgICAgaWYgKGRlZiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBkZWY7XG4gICAgICB9XG5cbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW5qZWN0YWJsZTogJHsoaWQgYXMgYW55KS5uYW1lfSBub3QgZm91bmQuYCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucmVnaXN0cnkuZ2V0KGlkKTtcbiAgfVxuXG4gIHByb3ZpZGU8VD4oaWQ6IEluamVjdGlvbktleTxUPiwgdmFsdWU6IGFueSkge1xuICAgIHRoaXMucmVnaXN0cnkuc2V0KGlkLCB2YWx1ZSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHRyaWdnZXIoZXZlbnQsIC4uLmFyZ3MpIHtcbiAgLy8gICByZXR1cm4gdGhpcy50YXAoc3VwZXIudHJpZ2dlcihldmVudCwgLi4uYXJncyksICgpID0+IHtcbiAgLy8gICAgIGlmICh0aGlzLmRhdGEoJ3dpbmR3YWxrZXIuZGVidWcnKSkge1xuICAvLyAgICAgICBjb25zb2xlLmRlYnVnKGBbVW5pY29ybiBFdmVudF0gJHtldmVudH1gLCBhcmdzLCB0aGlzLmxpc3RlbmVycyhldmVudCkpO1xuICAvLyAgICAgfVxuICAvLyAgIH0pO1xuICAvLyB9XG5cbiAgd2FpdChjYWxsYmFjazogRnVuY3Rpb24pOiBQcm9taXNlPGFueT4ge1xuICAgIGNvbnN0IHAgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBwcm9taXNlID0gY2FsbGJhY2socmVzb2x2ZSwgcmVqZWN0KTtcblxuICAgICAgaWYgKHByb21pc2UgJiYgJ3RoZW4nIGluIHByb21pc2UpIHtcbiAgICAgICAgcHJvbWlzZS50aGVuKHJlc29sdmUpLmNhdGNoKHJlamVjdCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLndhaXRzLnB1c2gocCk7XG5cbiAgICByZXR1cm4gcDtcbiAgfVxuXG4gIGNvbXBsZXRlZCgpOiBQcm9taXNlPGFueVtdPiB7XG4gICAgY29uc3QgcHJvbWlzZSA9IFByb21pc2UuYWxsKHRoaXMud2FpdHMpO1xuXG4gICAgdGhpcy53YWl0cyA9IFtdO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuXG59XG4iLCIvLyBAdHMtbm9jaGVja1xuLy8gQHNlZSBodHRwczovL2dpdGh1Yi5jb20vamF2YW4vZm9ybS1yZXF1ZXN0LXN1Ym1pdC1wb2x5ZmlsbFxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1SZXF1ZXN0U3VibWl0KHByb3RvdHlwZSkge1xuICBpZiAodHlwZW9mIHByb3RvdHlwZS5yZXF1ZXN0U3VibWl0ID09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBwcm90b3R5cGUucmVxdWVzdFN1Ym1pdCA9IGZ1bmN0aW9uIChzdWJtaXR0ZXIpIHtcbiAgICBpZiAoc3VibWl0dGVyKSB7XG4gICAgICB2YWxpZGF0ZVN1Ym1pdHRlcihzdWJtaXR0ZXIsIHRoaXMpO1xuICAgICAgc3VibWl0dGVyLmNsaWNrKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN1Ym1pdHRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICBzdWJtaXR0ZXIudHlwZSA9ICdzdWJtaXQnO1xuICAgICAgc3VibWl0dGVyLmhpZGRlbiA9IHRydWU7XG4gICAgICB0aGlzLmFwcGVuZENoaWxkKHN1Ym1pdHRlcik7XG4gICAgICBzdWJtaXR0ZXIuY2xpY2soKTtcbiAgICAgIHRoaXMucmVtb3ZlQ2hpbGQoc3VibWl0dGVyKTtcbiAgICB9XG4gIH07XG5cbiAgZnVuY3Rpb24gdmFsaWRhdGVTdWJtaXR0ZXIoc3VibWl0dGVyLCBmb3JtKSB7XG4gICAgc3VibWl0dGVyIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgfHwgcmFpc2UoVHlwZUVycm9yLCAncGFyYW1ldGVyIDEgaXMgbm90IG9mIHR5cGUgXFwnSFRNTEVsZW1lbnRcXCcnKTtcbiAgICBzdWJtaXR0ZXIudHlwZSA9PSAnc3VibWl0JyB8fCByYWlzZShUeXBlRXJyb3IsICdUaGUgc3BlY2lmaWVkIGVsZW1lbnQgaXMgbm90IGEgc3VibWl0IGJ1dHRvbicpO1xuICAgIHN1Ym1pdHRlci5mb3JtID09IGZvcm0gfHwgcmFpc2UoRE9NRXhjZXB0aW9uLCAnVGhlIHNwZWNpZmllZCBlbGVtZW50IGlzIG5vdCBvd25lZCBieSB0aGlzIGZvcm0gZWxlbWVudCcsICdOb3RGb3VuZEVycm9yJyk7XG4gIH1cblxuICBmdW5jdGlvbiByYWlzZShlcnJvckNvbnN0cnVjdG9yLCBtZXNzYWdlLCBuYW1lKSB7XG4gICAgdGhyb3cgbmV3IGVycm9yQ29uc3RydWN0b3IoJ0ZhaWxlZCB0byBleGVjdXRlIFxcJ3JlcXVlc3RTdWJtaXRcXCcgb24gXFwnSFRNTEZvcm1FbGVtZW50XFwnOiAnICsgbWVzc2FnZSArICcuJywgbmFtZSk7XG4gIH1cbn1cbiIsIlxuaW1wb3J0IHsgZm9ybVJlcXVlc3RTdWJtaXQgfSBmcm9tICcuL2Zvcm0tcmVxdWVzdC1zdWJtaXQnO1xuXG5leHBvcnQgZnVuY3Rpb24gcG9seWZpbGwoKSB7XG4gIC8vIElmIGluIGJyb3dzZXJcbiAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgZm9ybVJlcXVlc3RTdWJtaXQoSFRNTEZvcm1FbGVtZW50LnByb3RvdHlwZSk7XG4gIH1cbn1cbiIsImV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VGaWVsZE11bHRpVXBsb2FkZXIoKSB7XG4gIGF3YWl0IGltcG9ydCgnLi4vbW9kdWxlL2ZpZWxkLW11bHRpLXVwbG9hZGVyJyk7XG59XG4iLCJpbXBvcnQgdHlwZSB7IFRpbnltY2VDb250cm9sbGVyLCBUaW55bWNlTW9kdWxlIH0gZnJvbSAnLi4vbW9kdWxlL3RpbnltY2UnO1xuaW1wb3J0IHR5cGUgeyBNYXliZVByb21pc2UgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgdHlwZSB7IFRpbnlNQ0UgfSBmcm9tICd0aW55bWNlJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZVRpbnltY2UoKTogUHJvbWlzZTxUaW55bWNlTW9kdWxlPlxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZVRpbnltY2UoXG4gIHNlbGVjdG9yPzogc3RyaW5nLFxuICBvcHRpb25zPzogUmVjb3JkPHN0cmluZywgYW55PlxuKTogUHJvbWlzZTxUaW55bWNlQ29udHJvbGxlcj47XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlVGlueW1jZShcbiAgc2VsZWN0b3I/OiBzdHJpbmcsXG4gIG9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fVxuKTogUHJvbWlzZTxhbnk+IHtcbiAgY29uc3QgeyBnZXQgfSA9IGF3YWl0IGltcG9ydCgnLi4vbW9kdWxlL3RpbnltY2UnKTtcblxuICByZXR1cm4gZ2V0KHNlbGVjdG9yLCBvcHRpb25zKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZVRpbnltY2VIb29rKFxuICBoYW5kbGVyOiAoKHRpbnltY2U6IFRpbnlNQ0UpID0+IE1heWJlUHJvbWlzZTxhbnk+KVxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHsgYWRkSG9vayB9ID0gYXdhaXQgaW1wb3J0KCcuLi9tb2R1bGUvdGlueW1jZScpO1xuXG4gIHJldHVybiBhZGRIb29rKGhhbmRsZXIpO1xufVxuIiwiaW1wb3J0IHR5cGUgeyBVbmljb3JuQXBwIH0gZnJvbSAnLi4vYXBwJztcbmltcG9ydCB7XG4gIHVzZUZpZWxkQ2FzY2FkZVNlbGVjdCxcbiAgdXNlRmllbGRGaWxlRHJhZyxcbiAgdXNlRmllbGRGbGF0cGlja3IsXG4gIHVzZUZpZWxkTW9kYWxTZWxlY3QsIHVzZUZpZWxkTW9kYWxUcmVlLFxuICB1c2VGaWVsZFJlcGVhdGFibGUsXG4gIHVzZUZpZWxkU2luZ2xlSW1hZ2VEcmFnLFxuICB1c2VJZnJhbWVNb2RhbCxcbiAgdXNlU2hvd09uLFxufSBmcm9tICcuLi9jb21wb3NhYmxlJztcbmltcG9ydCB7IHVzZUZpZWxkTXVsdGlVcGxvYWRlciB9IGZyb20gJy4uL2NvbXBvc2FibGUvdXNlRmllbGRNdWx0aVVwbG9hZGVyJztcbmltcG9ydCB7IHVzZVRpbnltY2UgfSBmcm9tICcuLi9jb21wb3NhYmxlL3VzZVRpbnltY2UnO1xuaW1wb3J0IHsgdXNlVW5pY29ybiB9IGZyb20gJy4uL3VuaWNvcm4nO1xuXG5kZWNsYXJlIG1vZHVsZSAnLi4vYXBwJyB7XG4gIGV4cG9ydCBpbnRlcmZhY2UgVW5pY29ybkFwcCB7XG4gICAgLyoqIEBkZXByZWNhdGVkIE9ubHkgZm9yIGNvZGUgZ2VuZXJhdG9yIHVzZS4gKi9cbiAgICAkdWk6IHR5cGVvZiBtZXRob2RzO1xuICB9XG59XG5cbi8vIEB0cy1pZ25vcmVcbmRlY2xhcmUgbW9kdWxlICdAd2luZHdhbGtlci1pby91bmljb3JuLW5leHQnIHtcbiAgZXhwb3J0IGludGVyZmFjZSBVbmljb3JuQXBwIHtcbiAgICAvKiogQGRlcHJlY2F0ZWQgT25seSBmb3IgY29kZSBnZW5lcmF0b3IgdXNlLiAqL1xuICAgICR1aTogdHlwZW9mIG1ldGhvZHM7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVzZVVuaWNvcm5QaHBBZGFwdGVyKGFwcD86IFVuaWNvcm5BcHApIHtcbiAgYXBwID8/PSB1c2VVbmljb3JuKCk7XG5cbiAgYXBwLnVzZShVbmljb3JuUGhwQWRhcHRlcik7XG5cbiAgcmV0dXJuIGFwcC4kdWk7XG59XG5cbmNvbnN0IG1ldGhvZHMgPSB7XG4gIHJlcGVhdGFibGU6IHVzZUZpZWxkUmVwZWF0YWJsZSxcbiAgZmxhdHBpY2tyOiB1c2VGaWVsZEZsYXRwaWNrcixcbiAgZmlsZURyYWc6IHVzZUZpZWxkRmlsZURyYWcsXG4gIG1vZGFsRmllbGQ6IHVzZUZpZWxkTW9kYWxTZWxlY3QsXG4gIGNhc2NhZGVTZWxlY3Q6IHVzZUZpZWxkQ2FzY2FkZVNlbGVjdCxcbiAgc2lkOiB1c2VGaWVsZFNpbmdsZUltYWdlRHJhZyxcbiAgdGlueW1jZToge1xuICAgIGluaXQ6IHVzZVRpbnltY2VcbiAgfSxcbiAgaWZyYW1lTW9kYWw6IHVzZUlmcmFtZU1vZGFsLFxuICBpbml0U2hvd09uOiB1c2VTaG93T24sXG4gIG1vZGFsVHJlZTogdXNlRmllbGRNb2RhbFRyZWUsXG4gIG11bHRpVXBsb2FkZXI6IHVzZUZpZWxkTXVsdGlVcGxvYWRlcixcbn07XG5cbmV4cG9ydCBjbGFzcyBVbmljb3JuUGhwQWRhcHRlciB7XG4gIHN0YXRpYyBpbnN0YWxsKGFwcDogVW5pY29ybkFwcCkge1xuICAgIGlmIChhcHAuJHVpKSB7XG4gICAgICBhcHAuJHVpID0geyAuLi5hcHAuJHVpLCAuLi5tZXRob2RzIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwcC4kdWkgPSBtZXRob2RzO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgSW5qZWN0aW9uS2V5LCBVbmljb3JuQXBwIH0gZnJvbSAnLi9hcHAnO1xuaW1wb3J0IHsgcG9seWZpbGwgfSBmcm9tICcuL3BvbHlmaWxsJztcbmltcG9ydCB7IHJlbW92ZUNsb2FrIH0gZnJvbSAnLi91dGlsaXRpZXMnO1xuXG5leHBvcnQgKiBmcm9tICcuL2RhdGEnO1xuZXhwb3J0ICogZnJvbSAnLi9ldmVudHMnO1xuZXhwb3J0ICogZnJvbSAnLi9zZXJ2aWNlJztcbmV4cG9ydCAqIGZyb20gJy4vY29tcG9zYWJsZSc7XG5leHBvcnQgKiBmcm9tICcuL3BsdWdpbic7XG5cbmV4cG9ydCB0eXBlIHsgVW5pY29ybkFwcCB9O1xuXG5sZXQgYXBwOiBVbmljb3JuQXBwO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVW5pY29ybigpOiBVbmljb3JuQXBwIHtcbiAgcG9seWZpbGwoKTtcbiAgcmVtb3ZlQ2xvYWsoKTtcblxuICByZXR1cm4gYXBwID0gbmV3IFVuaWNvcm5BcHAoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVVuaWNvcm5XaXRoUGx1Z2lucygpOiBVbmljb3JuQXBwIHtcbiAgY29uc3QgYXBwID0gY3JlYXRlVW5pY29ybigpO1xuXG4gIC8vIGFwcC51c2UoVW5pY29yblVJKTtcblxuICAvLyBhcHAudXNlKFVuaWNvcm5Eb20pO1xuXG4gIHJldHVybiBhcHA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VVbmljb3JuKGluc3RhbmNlPzogVW5pY29ybkFwcCk6IFVuaWNvcm5BcHAge1xuICBpZiAoaW5zdGFuY2UpIHtcbiAgICBhcHAgPSBpbnN0YW5jZTtcbiAgfVxuXG4gIHJldHVybiBhcHAgPz89IGNyZWF0ZVVuaWNvcm4oKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUluamVjdDxUPihpZDogSW5qZWN0aW9uS2V5PFQ+KTogVDtcbmV4cG9ydCBmdW5jdGlvbiB1c2VJbmplY3Q8VD4oaWQ6IEluamVjdGlvbktleTxUPiwgZGVmOiBUKTogVDtcbmV4cG9ydCBmdW5jdGlvbiB1c2VJbmplY3Q8VD4oaWQ6IEluamVjdGlvbktleTxUPiwgZGVmPzogVCk6IFQgfCB1bmRlZmluZWQge1xuICByZXR1cm4gdXNlVW5pY29ybigpLmluamVjdDxUPihpZCwgZGVmKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHB1c2hVbmljb3JuVG9HbG9iYWwoYXBwPzogVW5pY29ybkFwcCkge1xuICAvLyBAdHMtaWdub3JlXG4gIHdpbmRvdy51ID0gYXBwID8/IHVzZVVuaWNvcm4oKTtcbn1cbiJdLCJuYW1lcyI6WyJyZW1vdmVEYXRhIiwiaHRtbCIsInNlbGVjdG9yIiwiY2FsbGJhY2siLCJjc3MiLCJxdWV1ZSIsIndhaXQiLCJzcHJpbnRmIiwidnNwcmludGYiLCJtIiwibW9kdWxlIiwidWkiLCJzdGFjayIsInVyaSIsImFzc2V0Iiwicm91dGUiLCJybWRhdGEiLCJwcm90b0NoYWluIiwiZGVjb3JhdG9ycyIsImFwcCJdLCJtYXBwaW5ncyI6IkFBQ08sU0FBUyxjQUFjLEtBQXNDO0FBQ2xFLFNBQU8sT0FBTyxPQUFPLFFBQVEsWUFBWSxDQUFDLE1BQU0sUUFBUSxHQUFHO0FBQzdEO0FBRU8sU0FBUyxVQUFtQyxXQUF1QixTQUFtQjtBQUMzRixNQUFJLE1BQVcsY0FBYyxNQUFNLElBQUksRUFBRSxHQUFHLFdBQVc7QUFFdkQsYUFBVyxVQUFVLFNBQVM7QUFDNUIsUUFBSSxNQUFNLFFBQVEsTUFBTSxHQUFHO0FBQ3pCLFlBQU8sTUFB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
