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
      if (!importedSheets[href]) {
        importedSheets[href] = simulateCssImport(href);
      }
      return importedSheets[href];
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
  const m = await import("./checkboxes-multi-select-Bm8oXqVr.js");
  if (selector) {
    m.CheckboxesMultiSelect.handle(selector, options);
  }
  return m;
}
async function useFieldCascadeSelect() {
  const module2 = await import("./field-cascade-select-DGUM4kyH.js");
  await module2.ready;
  return module2;
}
async function useFieldFileDrag() {
  const module2 = await import("./field-file-drag-BuFCL1x4.js");
  await module2.ready;
  return module2;
}
function useFieldFlatpickr() {
  return import("./field-flatpickr-ClPCPzI6.js");
}
function useFieldModalSelect() {
  return import("./field-modal-select-qA-vsjiY.js");
}
function useFieldModalTree() {
  import("./field-modal-tree-DRcgWqxv.js");
}
async function useFieldRepeatable() {
  const module2 = await import("./field-repeatable-25BHNlou.js");
  await module2.ready;
  return module2;
}
function useFieldSingleImageDrag() {
  return import("./field-single-image-drag-NN9LI5nh.js");
}
async function useForm(ele, options = {}) {
  const { UnicornFormElement } = await import("./form-BcZoGHH-.js");
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
  await form?.initComponent();
  return form;
}
async function useGrid(ele, options = {}) {
  const { UnicornGridElement } = await import("./grid-lFzXRRIz.js");
  const selector = typeof ele === "string" ? ele : "";
  const element = selectOne(ele);
  if (!element) {
    throw new Error("Element is empty");
  }
  const form = await useForm(selector || element);
  if (!form) {
    throw new Error("UnicornGrid is depends on UnicornForm");
  }
  return module(
    element,
    "grid.plugin",
    () => new UnicornGridElement(selector, element, form, options)
  );
}
async function useGridComponent(ele, options = {}) {
  const grid = await useGrid(ele, options);
  await grid?.initComponent();
  return grid;
}
async function useHttpClient(config) {
  const { UnicornHttpClient } = await import("./http-client-CA_PdIpJ.js");
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
  const module2 = await import("./iframe-modal-CU_z3aWl.js");
  await module2.ready;
  return module2;
}
async function useListDependent(element, dependent, options = {}) {
  const module2 = await import("./list-dependent-DDlSnbsL.js");
  await module2.ready;
  if (element) {
    const { ListDependent } = module2;
    return ListDependent.handle(element, dependent ?? void 0, options);
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
  const module2 = await import("./s3-uploader-Di6_ZtPb.js");
  if (!name) {
    return module2;
  }
  const { get } = module2;
  return get(name, options);
}
async function useS3MultipartUploader(options) {
  const module2 = await import("./s3-multipart-uploader-eS2Obvri.js");
  if (options != null) {
    return new module2.S3MultipartUploader(options);
  }
  return module2;
}
async function useShowOn() {
  const module2 = await import("./show-on-DxBRoJ-c.js");
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
  const { UIBootstrap5 } = await import("./ui-bootstrap5-CKVDVvFv.js");
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
const useBs5KeepTab = async (selector, options = {}) => {
  const bs5 = await useUIBootstrap5();
  return bs5.keepTab(selector, options);
};
const useBs5ButtonRadio = async (selector, options = {}) => {
  const bs5 = await useUIBootstrap5();
  return bs5.buttonRadio(selector, options);
};
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
  const module2 = await import("./validation-Cx65i-GB.js");
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
  await import("./field-multi-uploader-CCi8mV86.js");
}
async function useTinymce(selector, options = {}) {
  const module2 = await import("./tinymce-CPQGCBlZ.js");
  if (selector) {
    return module2.get(selector, options);
  }
  return module2;
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
  s3Uploader: useS3Uploader,
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
const useInject = (id, def) => {
  return useUnicorn().inject(id, def);
};
function pushUnicornToGlobal(app2) {
  window.u = app2 ?? useUnicorn();
}
export {
  delegate as $,
  getBoundedInstance as A,
  createQueue as B,
  fadeIn as C,
  fadeOut as D,
  EventMixin as E,
  trans as F,
  useUITheme as G,
  useStack as H,
  sleep as I,
  createUnicorn as J,
  createUnicornWithPlugins as K,
  useUnicorn as L,
  Mixin as M,
  useInject as N,
  pushUnicornToGlobal as O,
  removeData as P,
  EventBus as Q,
  animateTo as R,
  base64UrlEncode as S,
  base64UrlDecode as T,
  tid as U,
  randomBytes as V,
  randomBytesString as W,
  serial as X,
  domready as Y,
  getBoundedInstanceList as Z,
  __ as _,
  selectOne as a,
  useFieldValidationSync as a$,
  debounce as a0,
  throttle as a1,
  isDebug as a2,
  nextTick as a3,
  wait as a4,
  useLang as a5,
  useScriptImport as a6,
  doImport as a7,
  useSeriesImport as a8,
  useCssIncludes as a9,
  useCheckboxesMultiSelect as aA,
  useFieldCascadeSelect as aB,
  useFieldFileDrag as aC,
  useFieldFlatpickr as aD,
  useFieldModalSelect as aE,
  useFieldModalTree as aF,
  useFieldRepeatable as aG,
  useFieldSingleImageDrag as aH,
  useForm as aI,
  useFormComponent as aJ,
  useGrid as aK,
  useGridComponent as aL,
  useIframeModal as aM,
  useListDependent as aN,
  useQueue as aO,
  useS3Uploader as aP,
  useS3MultipartUploader as aQ,
  useShowOn as aR,
  createStack as aS,
  useTomSelect as aT,
  useUIBootstrap5 as aU,
  useBs5Tooltip as aV,
  useBs5KeepTab as aW,
  useBs5ButtonRadio as aX,
  useWebDirective as aY,
  useFormValidation as aZ,
  useFormValidationSync as a_,
  AlertAdapter as aa,
  useUI as ab,
  UnicornUI as ac,
  prepareAlpine as ad,
  renderMessage as ae,
  clearMessages as af,
  notify as ag,
  clearNotifies as ah,
  mark as ai,
  multiUploader as aj,
  modalTree as ak,
  slideToggle as al,
  useColorPicker as am,
  useDisableOnSubmit as an,
  useDisableIfStackNotEmpty as ao,
  useKeepAlive as ap,
  useVueComponentField as aq,
  useAssetUri as ar,
  addUriBase as as,
  UnicornSystemUri as at,
  UnicornAssetUri as au,
  addRoute as av,
  hasRoute as aw,
  addQuery as ax,
  parseQuery as ay,
  buildQuery as az,
  module as b,
  addGlobalValidator as b0,
  useUnicornPhpAdapter as b1,
  UnicornPhpAdapter as b2,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pY29ybi1EUjlKcFBZTy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxpdGllcy9hcnIudHMiLCIuLi8uLi9zcmMvdXRpbGl0aWVzL2RhdGEudHMiLCIuLi8uLi9zcmMvc2VydmljZS9kb20udHMiLCIuLi8uLi9zcmMvc2VydmljZS9hbmltYXRlLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BseXJhc29mdC90cy10b29sa2l0L3NyYy9nZW5lcmljL2FsZXJ0LWFkYXB0ZXIudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGx5cmFzb2Z0L3RzLXRvb2xraXQvc3JjL2dlbmVyaWMvYWxlcnQudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGx5cmFzb2Z0L3RzLXRvb2xraXQvc3JjL2dlbmVyaWMvZW52LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BseXJhc29mdC90cy10b29sa2l0L3NyYy9nZW5lcmljL2NyeXB0by50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AbHlyYXNvZnQvdHMtdG9vbGtpdC9zcmMvZ2VuZXJpYy9xdWV1ZS50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AbHlyYXNvZnQvdHMtdG9vbGtpdC9zcmMvZ2VuZXJpYy9zdGFjay50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AbHlyYXNvZnQvdHMtdG9vbGtpdC9zcmMvZ2VuZXJpYy90aW1pbmcudHMiLCIuLi8uLi9zcmMvc2VydmljZS9jcnlwdG8udHMiLCIuLi8uLi9zcmMvc2VydmljZS9oZWxwZXIudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ByaW50Zi1qcy9zcmMvc3ByaW50Zi5qcyIsIi4uLy4uL3NyYy9zZXJ2aWNlL2xhbmcudHMiLCIuLi8uLi9zcmMvc2VydmljZS9sb2FkZXIudHMiLCIuLi8uLi9zcmMvY29tcG9zYWJsZS91c2VDaGVja2JveGVzTXVsdGlTZWxlY3QudHMiLCIuLi8uLi9zcmMvY29tcG9zYWJsZS91c2VGaWVsZENhc2NhZGVTZWxlY3QudHMiLCIuLi8uLi9zcmMvY29tcG9zYWJsZS91c2VGaWVsZEZpbGVEcmFnLnRzIiwiLi4vLi4vc3JjL2NvbXBvc2FibGUvdXNlRmllbGRGbGF0cGlja3IudHMiLCIuLi8uLi9zcmMvY29tcG9zYWJsZS91c2VGaWVsZE1vZGFsU2VsZWN0LnRzIiwiLi4vLi4vc3JjL2NvbXBvc2FibGUvdXNlRmllbGRNb2RhbFRyZWUudHMiLCIuLi8uLi9zcmMvY29tcG9zYWJsZS91c2VGaWVsZFJlcGVhdGFibGUudHMiLCIuLi8uLi9zcmMvY29tcG9zYWJsZS91c2VGaWVsZFNpbmdsZUltYWdlRHJhZy50cyIsIi4uLy4uL3NyYy9jb21wb3NhYmxlL3VzZUZvcm0udHMiLCIuLi8uLi9zcmMvY29tcG9zYWJsZS91c2VHcmlkLnRzIiwiLi4vLi4vc3JjL2NvbXBvc2FibGUvdXNlSHR0cC50cyIsIi4uLy4uL3NyYy9jb21wb3NhYmxlL3VzZUlmcmFtZU1vZGFsLnRzIiwiLi4vLi4vc3JjL2NvbXBvc2FibGUvdXNlTGlzdERlcGVuZGVudC50cyIsIi4uLy4uL3NyYy9jb21wb3NhYmxlL3VzZVF1ZXVlLnRzIiwiLi4vLi4vc3JjL2NvbXBvc2FibGUvdXNlUzNVcGxvYWRlci50cyIsIi4uLy4uL3NyYy9jb21wb3NhYmxlL3VzZVNob3dPbi50cyIsIi4uLy4uL3NyYy9jb21wb3NhYmxlL3VzZVN0YWNrLnRzIiwiLi4vLi4vc3JjL2NvbXBvc2FibGUvdXNlVG9tU2VsZWN0LnRzIiwiLi4vLi4vc3JjL2NvbXBvc2FibGUvdXNlVUlCb290c3RyYXA1LnRzIiwiLi4vLi4vc3JjL2NvbXBvc2FibGUvdXNlVW5pRGlyZWN0aXZlLnRzIiwiLi4vLi4vc3JjL2NvbXBvc2FibGUvdXNlVmFsaWRhdGlvbi50cyIsIi4uLy4uL3NyYy9zZXJ2aWNlL3VpLnRzIiwiLi4vLi4vc3JjL3NlcnZpY2UvdXJpLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Fzcy9kaXN0L3Fzcy5tanMiLCIuLi8uLi9zcmMvc2VydmljZS9yb3V0ZXIudHMiLCIuLi8uLi9zcmMvdXRpbGl0aWVzL2Jhc2UudHMiLCIuLi8uLi9zcmMvZGF0YS50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy90cy1taXhlci9kaXN0L2VzbS9pbmRleC5qcyIsIi4uLy4uL3NyYy9ldmVudHMudHMiLCIuLi8uLi9zcmMvYXBwLnRzIiwiLi4vLi4vc3JjL3BvbHlmaWxsL2Zvcm0tcmVxdWVzdC1zdWJtaXQudHMiLCIuLi8uLi9zcmMvcG9seWZpbGwvaW5kZXgudHMiLCIuLi8uLi9zcmMvY29tcG9zYWJsZS91c2VGaWVsZE11bHRpVXBsb2FkZXIudHMiLCIuLi8uLi9zcmMvY29tcG9zYWJsZS91c2VUaW55bWNlLnRzIiwiLi4vLi4vc3JjL3BsdWdpbi9waHAtYWRhcHRlci50cyIsIi4uLy4uL3NyYy91bmljb3JuLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlxuZXhwb3J0IGZ1bmN0aW9uIGlzUGxhaW5PYmplY3QodmFsOiBhbnkpOiB2YWwgaXMgUmVjb3JkPHN0cmluZywgYW55PiB7XG4gIHJldHVybiB2YWwgJiYgdHlwZW9mIHZhbCA9PT0gXCJvYmplY3RcIiAmJiAhQXJyYXkuaXNBcnJheSh2YWwpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VEZWVwPFQgPSBSZWNvcmQ8c3RyaW5nLCBhbnk+Pih0YXJnZXQ6IFBhcnRpYWw8VD4sIC4uLnNvdXJjZXM6IGFueVtdKTogVCB7XG4gIGxldCBvdXQ6IGFueSA9IGlzUGxhaW5PYmplY3QodGFyZ2V0KSA/IHsgLi4udGFyZ2V0IH0gOiB0YXJnZXQ7XG5cbiAgZm9yIChjb25zdCBzb3VyY2Ugb2Ygc291cmNlcykge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHNvdXJjZSkpIHtcbiAgICAgIG91dCA9IChBcnJheS5pc0FycmF5KG91dCkgPyBvdXQuY29uY2F0KHNvdXJjZSkgOiBzb3VyY2UpIGFzIFQ7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKGlzUGxhaW5PYmplY3Qoc291cmNlKSkge1xuICAgICAgb3V0ID0geyAuLi4oaXNQbGFpbk9iamVjdChvdXQpID8gb3V0IDoge30pIH07XG4gICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhzb3VyY2UpKSB7XG4gICAgICAgIG91dFtrZXldID1cbiAgICAgICAgICBrZXkgaW4gb3V0ID8gbWVyZ2VEZWVwKG91dFtrZXldLCBzb3VyY2Vba2V5XSkgOiBzb3VyY2Vba2V5XTtcbiAgICAgIH1cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBvdXQgPSBzb3VyY2UgYXMgVDtcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuIiwiXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGF0YShlbGVtZW50OiBFbGVtZW50LCBuYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQpIHtcbiAgcHJlcGFyZURhdGEoZWxlbWVudCk7XG5cbiAgaWYgKG5hbWUgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBlbGVtZW50Ll9fdW5pY29ybjtcbiAgfVxuXG4gIHJldHVybiBlbGVtZW50Ll9fdW5pY29ybltuYW1lXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldERhdGEoZWxlbWVudDogRWxlbWVudCwgbmFtZTogc3RyaW5nLCB2YWx1ZTogYW55KSB7XG4gIHByZXBhcmVEYXRhKGVsZW1lbnQpO1xuICBlbGVtZW50Ll9fdW5pY29ybltuYW1lXSA9IHZhbHVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVmRGF0YShlbGVtZW50OiBFbGVtZW50LCBuYW1lOiBzdHJpbmcsIGRlZkNhbGxiYWNrOiBGdW5jdGlvbikge1xuICBwcmVwYXJlRGF0YShlbGVtZW50KTtcbiAgZWxlbWVudC5fX3VuaWNvcm5bbmFtZV0gPSBlbGVtZW50Ll9fdW5pY29ybltuYW1lXSB8fCBkZWZDYWxsYmFjayhlbGVtZW50KTtcblxuICByZXR1cm4gZWxlbWVudC5fX3VuaWNvcm5bbmFtZV07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVEYXRhKGVsZW1lbnQ6IEVsZW1lbnQsIG5hbWU6IHN0cmluZykge1xuICBwcmVwYXJlRGF0YShlbGVtZW50KTtcblxuICBjb25zdCB2ID0gZWxlbWVudC5fX3VuaWNvcm5bbmFtZV07XG4gIGRlbGV0ZSBlbGVtZW50Ll9fdW5pY29ybltuYW1lXTtcblxuICByZXR1cm4gdjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByZXBhcmVEYXRhPFQgZXh0ZW5kcyBOb2RlPihlbGVtZW50OiBUKTogVCB7XG4gIGlmICghZWxlbWVudCkge1xuICAgIHJldHVybiBlbGVtZW50O1xuICB9XG5cbiAgZWxlbWVudC5fX3VuaWNvcm4gPSBlbGVtZW50Ll9fdW5pY29ybiB8fCB7fTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgaW50ZXJmYWNlIE5vZGUge1xuICAgIF9fdW5pY29ybj86IGFueTtcbiAgfVxufVxuXG5cbiIsImltcG9ydCB7IGRlZkRhdGEgfSBmcm9tICcuLi91dGlsaXRpZXMnO1xuXG4vKipcbiAqIEBzZWUgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzk4OTk3MDFcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRvbXJlYWR5KGNhbGxiYWNrPzogKCh2YWx1ZTogYW55KSA9PiBhbnkpKTogUHJvbWlzZTx2b2lkPiB7XG4gIGxldCBwcm9taXNlID0gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUpID0+IHtcbiAgICAvLyBzZWUgaWYgRE9NIGlzIGFscmVhZHkgYXZhaWxhYmxlXG4gICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZScgfHwgZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2ludGVyYWN0aXZlJykge1xuICAgICAgLy8gY2FsbCBvbiBuZXh0IGF2YWlsYWJsZSB0aWNrXG4gICAgICBzZXRUaW1lb3V0KHJlc29sdmUsIDApO1xuICAgIH0gZWxzZSB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4gcmVzb2x2ZSgpKTtcbiAgICB9XG4gIH0pO1xuXG4gIGlmIChjYWxsYmFjaykge1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oY2FsbGJhY2spO1xuICB9XG5cbiAgcmV0dXJuIHByb21pc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RPbmU8SyBleHRlbmRzIGtleW9mIEhUTUxFbGVtZW50VGFnTmFtZU1hcD4oZWxlOiBLKTogSFRNTEVsZW1lbnRUYWdOYW1lTWFwW0tdIHwgbnVsbDtcbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RPbmU8RSBleHRlbmRzIEVsZW1lbnQgPSBFbGVtZW50PihlbGU6IHN0cmluZyk6IEUgfCBudWxsO1xuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdE9uZTxFIGV4dGVuZHMgRWxlbWVudCA9IEVsZW1lbnQ+KGVsZTogRSk6IEU7XG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0T25lPEUgZXh0ZW5kcyBFbGVtZW50ID0gRWxlbWVudD4oZWxlOiBzdHJpbmcgfCBFKTogRSB8IG51bGw7XG4vLyBzZWxlY3RPbmUoZWxlOiBzdHJpbmcpOiBFbGVtZW50O1xuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdE9uZTxFIGV4dGVuZHMgRWxlbWVudCA9IEVsZW1lbnQ+KGVsZTogRSB8IHN0cmluZyk6IEUgfCBudWxsIHtcbiAgbGV0IHI6IEUgfCBudWxsO1xuXG4gIGlmICh0eXBlb2YgZWxlID09PSAnc3RyaW5nJykge1xuICAgIHIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEU+KGVsZSk7XG4gIH0gZWxzZSB7XG4gICAgciA9IGVsZTtcbiAgfVxuXG4gIGlmICghcikge1xuICAgIHJldHVybiByO1xuICB9XG5cbiAgcmV0dXJuIHI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RBbGw8RSBleHRlbmRzIEVsZW1lbnQgPSBFbGVtZW50PihlbGU6IHN0cmluZywgY2FsbGJhY2s/OiAoKGVsZTogRSkgPT4gYW55KSk6IEVbXTtcbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RBbGw8RSBleHRlbmRzIEVsZW1lbnQgPSBFbGVtZW50PihlbGU6IE5vZGVMaXN0T2Y8RT4gfCBFW10sIGNhbGxiYWNrPzogKChlbGU6IEUpID0+IGFueSkpOiBFW107XG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0QWxsPEUgZXh0ZW5kcyBFbGVtZW50ID0gRWxlbWVudD4oXG4gIGVsZTogc3RyaW5nIHwgTm9kZUxpc3RPZjxFPiB8IEVbXSxcbiAgY2FsbGJhY2s/OiAoKGVsZTogRSkgPT4gYW55KVxuKTogRVtdO1xuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdEFsbDxFIGV4dGVuZHMga2V5b2YgSFRNTEVsZW1lbnRUYWdOYW1lTWFwPihcbiAgZWxlOiBFLFxuICBjYWxsYmFjaz86ICgoZWxlOiBIVE1MRWxlbWVudFRhZ05hbWVNYXBbRV0pID0+IGFueSlcbik6IEhUTUxFbGVtZW50VGFnTmFtZU1hcFtFXVtdO1xuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdEFsbChcbiAgZWxlOiBOb2RlTGlzdE9mPEVsZW1lbnQ+IHwgRWxlbWVudFtdIHwgc3RyaW5nLFxuICBjYWxsYmFjazogKChlbDogRWxlbWVudCkgPT4gYW55KSB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZFxuKTogRWxlbWVudFtdIHtcbiAgaWYgKHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnKSB7XG4gICAgZWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChlbGUpO1xuICB9XG5cbiAgY29uc3QgcmVzdWx0U2V0OiBFbGVtZW50W10gPSBbXS5zbGljZS5jYWxsKGVsZSk7XG5cbiAgaWYgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHJlc3VsdFNldC5tYXAoKGVsKSA9PiBjYWxsYmFjayhlbCkgfHwgZWwpO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdFNldDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEJvdW5kZWRJbnN0YW5jZTxUID0gYW55LCBFID0gRWxlbWVudD4oc2VsZWN0b3I6IEUsIG5hbWU6IHN0cmluZywgY2FsbGJhY2s/OiAoKGVsOiBFKSA9PiBhbnkpKTogVDtcbmV4cG9ydCBmdW5jdGlvbiBnZXRCb3VuZGVkSW5zdGFuY2U8VCA9IGFueSwgRSBleHRlbmRzIEVsZW1lbnQgPSBFbGVtZW50PihcbiAgc2VsZWN0b3I6IHN0cmluZyB8IEUsXG4gIG5hbWU6IHN0cmluZyxcbiAgY2FsbGJhY2s/OiAoKGVsOiBFKSA9PiBhbnkpXG4pOiBUIHwgbnVsbDtcbmV4cG9ydCBmdW5jdGlvbiBnZXRCb3VuZGVkSW5zdGFuY2U8VCA9IGFueSwgRSBleHRlbmRzIEVsZW1lbnQgPSBFbGVtZW50PihzZWxlY3Rvcjogc3RyaW5nIHwgRSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgoZWw6IEUpID0+IGFueSkgPSAoKSA9PiBudWxsKTogVCB8IG51bGwge1xuICBjb25zdCBlbGVtZW50ID0gdHlwZW9mIHNlbGVjdG9yID09PSAnc3RyaW5nJyA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8RT4oc2VsZWN0b3IpIDogc2VsZWN0b3I7XG5cbiAgaWYgKCFlbGVtZW50KSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gZGVmRGF0YShlbGVtZW50LCBuYW1lLCBjYWxsYmFjayk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRCb3VuZGVkSW5zdGFuY2VMaXN0PFQgPSBhbnksIEUgZXh0ZW5kcyBFbGVtZW50ID0gRWxlbWVudD4oXG4gIHNlbGVjdG9yOiBzdHJpbmcgfCBOb2RlTGlzdE9mPEU+LFxuICBuYW1lOiBzdHJpbmcsXG4gIGNhbGxiYWNrOiAoKGVsOiBFKSA9PiBhbnkpID0gKCkgPT4gbnVsbFxuKTogKFQgfCBudWxsKVtdIHtcbiAgY29uc3QgaXRlbXMgPSB0eXBlb2Ygc2VsZWN0b3IgPT09ICdzdHJpbmcnID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxFPihzZWxlY3RvcikgOiBzZWxlY3RvcjtcblxuICByZXR1cm4gQXJyYXkuZnJvbShpdGVtcykubWFwKChlbGU6IEUpID0+IGdldEJvdW5kZWRJbnN0YW5jZShlbGUsIG5hbWUsIGNhbGxiYWNrKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtb2R1bGU8VCA9IGFueSwgRSBleHRlbmRzIEVsZW1lbnQgPSBFbGVtZW50PihcbiAgZWxlOiBzdHJpbmcsXG4gIG5hbWU6IHN0cmluZyxcbiAgY2FsbGJhY2s/OiAoKGVsOiBFKSA9PiBhbnkpXG4pOiAoVCB8IG51bGwpW107XG5leHBvcnQgZnVuY3Rpb24gbW9kdWxlPFQgPSBhbnksIEUgZXh0ZW5kcyBFbGVtZW50ID0gRWxlbWVudD4oXG4gIGVsZTogTm9kZUxpc3RPZjxFbGVtZW50PixcbiAgbmFtZTogc3RyaW5nLFxuICBjYWxsYmFjaz86ICgoZWw6IEUpID0+IGFueSkpOiAoVCB8IG51bGwpW107XG5leHBvcnQgZnVuY3Rpb24gbW9kdWxlPFQgPSBhbnksIEUgZXh0ZW5kcyBFbGVtZW50ID0gRWxlbWVudD4oXG4gIGVsZTogRWxlbWVudCxcbiAgbmFtZTogc3RyaW5nLFxuICBjYWxsYmFjaz86ICgoZWw6IEUpID0+IGFueSlcbik6IFQgfCBudWxsO1xuZXhwb3J0IGZ1bmN0aW9uIG1vZHVsZTxUID0gYW55LCBFIGV4dGVuZHMgRWxlbWVudCA9IEVsZW1lbnQ+KFxuICBlbGU6IHN0cmluZyB8IEVsZW1lbnQgfCBOb2RlTGlzdE9mPEVsZW1lbnQ+LFxuICBuYW1lOiBzdHJpbmcsXG4gIGNhbGxiYWNrPzogKChlbDogRSkgPT4gYW55KVxuKTogKFQgfCBudWxsKVtdIHwgVCB8IG51bGw7XG5leHBvcnQgZnVuY3Rpb24gbW9kdWxlPFQgPSBhbnksIEUgZXh0ZW5kcyBFbGVtZW50ID0gRWxlbWVudD4oXG4gIGVsZTogc3RyaW5nIHwgRSB8IE5vZGVMaXN0T2Y8RT4sXG4gIG5hbWU6IHN0cmluZyxcbiAgY2FsbGJhY2s6ICgoZWw6IEUpID0+IGFueSkgPSAoKSA9PiBudWxsXG4pOiAoVCB8IG51bGwpW10gfCBUIHwgbnVsbCB7XG4gIGlmICh0eXBlb2YgZWxlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBnZXRCb3VuZGVkSW5zdGFuY2VMaXN0PFQsIEU+KGVsZSwgbmFtZSwgY2FsbGJhY2spO1xuICB9XG5cbiAgaWYgKGVsZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgcmV0dXJuIGdldEJvdW5kZWRJbnN0YW5jZTxULCBFPihlbGUsIG5hbWUsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIHJldHVybiBnZXRCb3VuZGVkSW5zdGFuY2VMaXN0PFQsIEU+KGVsZSBhcyBOb2RlTGlzdE9mPEU+LCBuYW1lLCBjYWxsYmFjayk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoPFQgZXh0ZW5kcyBrZXlvZiBIVE1MRWxlbWVudFRhZ05hbWVNYXA+KFxuICBlbGVtZW50OiBULFxuICBhdHRycz86IFJlY29yZDxzdHJpbmcsIGFueT4sXG4gIGNvbnRlbnQ/OiBhbnlcbik6IEhUTUxFbGVtZW50VGFnTmFtZU1hcFtUXVxuZXhwb3J0IGZ1bmN0aW9uIGgoZWxlbWVudDogc3RyaW5nLCBhdHRyczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9LCBjb250ZW50OiBhbnkgPSB1bmRlZmluZWQpOiBIVE1MRWxlbWVudCB7XG4gIGNvbnN0IGVsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZWxlbWVudCk7XG5cbiAgZm9yIChsZXQgaSBpbiBhdHRycykge1xuICAgIGNvbnN0IHYgPSBhdHRyc1tpXTtcblxuICAgIGVsZS5zZXRBdHRyaWJ1dGUoaSwgdik7XG4gIH1cblxuICBpZiAoY29udGVudCAhPT0gbnVsbCkge1xuICAgIGVsZS5pbm5lckhUTUwgPSBjb250ZW50O1xuICB9XG5cbiAgcmV0dXJuIGVsZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGh0bWw8VCBleHRlbmRzIEVsZW1lbnQgPSBIVE1MRWxlbWVudD4oaHRtbDogc3RyaW5nKTogVCB7XG4gIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBkaXYuaW5uZXJIVE1MID0gaHRtbDtcbiAgcmV0dXJuIGRpdi5jaGlsZHJlblswXSBhcyBUO1xufVxuXG4vKipcbiAqIFB1cmUgSlMgdmVyc2lvbiBvZiBqUXVlcnkgZGVsZWdhdGUoKVxuICpcbiAqIEBzZWUgaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vaWFnb2JydW5vLzRkYjJlZDYyZGM0MGZhODQxYmI5YTVjN2RlOTJmNWY4XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWxlZ2F0ZShcbiAgd3JhcHBlcjogRWxlbWVudCB8IHN0cmluZyxcbiAgc2VsZWN0b3I6IHN0cmluZyxcbiAgZXZlbnROYW1lOiBzdHJpbmcsXG4gIGNhbGxiYWNrOiAoZTogRXZlbnQpID0+IHZvaWRcbik6ICgpID0+IHZvaWQge1xuICBpZiAodHlwZW9mIHNlbGVjdG9yID09PSAndW5kZWZpbmVkJyB8fCBzZWxlY3RvciA9PT0gJycpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBwcm92aWRlZCBzZWxlY3RvciBpcyBlbXB0eS4nKTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiBjYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBFcnJvcignUGxlYXNlIHNwZWNpZnkgYW4gY2FsbGJhY2suJyk7XG4gIH1cblxuICBjb25zdCBkZWxlZ2F0aW9uU2VsZWN0b3JzTWFwOiBSZWNvcmQ8c3RyaW5nLCBGdW5jdGlvbltdPiA9IHt9O1xuXG4gIGNvbnN0IHdyYXBwZXJFbGVtZW50ID0gc2VsZWN0T25lKHdyYXBwZXIpO1xuXG4gIHdyYXBwZXJFbGVtZW50Py5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgbGV0IGVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgbnVsbCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudDtcbiAgICBsZXQgZm9yY2VCcmVhayA9IGZhbHNlO1xuXG4gICAgd2hpbGUgKGVsZW1lbnQgJiYgZWxlbWVudCAhPT0gd3JhcHBlckVsZW1lbnQpIHtcbiAgICAgIGZvciAoY29uc3Qgc2VsZWN0b3IgaW4gZGVsZWdhdGlvblNlbGVjdG9yc01hcCkge1xuICAgICAgICBpZiAoZWxlbWVudC5tYXRjaGVzKHNlbGVjdG9yKSkge1xuICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGZvcmNlQnJlYWsgPSB0cnVlO1xuICAgICAgICAgIH07XG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFxuICAgICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgICAnY3VycmVudFRhcmdldCcsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGdldCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBjb25zdCBjYWxsYmFja0xpc3QgPSBkZWxlZ2F0aW9uU2VsZWN0b3JzTWFwW3NlbGVjdG9yXTtcblxuICAgICAgICAgIGNhbGxiYWNrTGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgY2FsbGJhY2soZXZlbnQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChmb3JjZUJyZWFrKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50O1xuICAgIH1cbiAgfSk7XG5cbiAgaWYgKCFkZWxlZ2F0aW9uU2VsZWN0b3JzTWFwW3NlbGVjdG9yXSkge1xuICAgIC8vIEFkZCBuZXcgc2VsZWN0b3IgdG8gdGhlIGxpc3RcbiAgICBkZWxlZ2F0aW9uU2VsZWN0b3JzTWFwW3NlbGVjdG9yXSA9IFtjYWxsYmFja107XG4gIH0gZWxzZSB7XG4gICAgZGVsZWdhdGlvblNlbGVjdG9yc01hcFtzZWxlY3Rvcl0ucHVzaChjYWxsYmFjayk7XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gdW5zdWJzY3JpYmUoKSB7XG4gICAgaWYgKCFkZWxlZ2F0aW9uU2VsZWN0b3JzTWFwW3NlbGVjdG9yXSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChkZWxlZ2F0aW9uU2VsZWN0b3JzTWFwW3NlbGVjdG9yXS5sZW5ndGggPj0gMikge1xuICAgICAgZGVsZWdhdGlvblNlbGVjdG9yc01hcFtzZWxlY3Rvcl0gPSBkZWxlZ2F0aW9uU2VsZWN0b3JzTWFwW3NlbGVjdG9yXS5maWx0ZXIoY2IgPT4gY2IgIT09IGNhbGxiYWNrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIGRlbGVnYXRpb25TZWxlY3RvcnNNYXBbc2VsZWN0b3JdO1xuICAgIH1cbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluamVjdENzc1RvRG9jdW1lbnQoZG9jOiBEb2N1bWVudCwgLi4uY3NzOiAoc3RyaW5nIHwgQ1NTU3R5bGVTaGVldClbXSk6IENTU1N0eWxlU2hlZXRbXTtcbmV4cG9ydCBmdW5jdGlvbiBpbmplY3RDc3NUb0RvY3VtZW50KC4uLmNzczogKHN0cmluZyB8IENTU1N0eWxlU2hlZXQpW10pOiBDU1NTdHlsZVNoZWV0W107XG5leHBvcnQgZnVuY3Rpb24gaW5qZWN0Q3NzVG9Eb2N1bWVudChcbiAgZG9jOiBEb2N1bWVudCB8IHN0cmluZyB8IENTU1N0eWxlU2hlZXQsXG4gIC4uLmNzczogKHN0cmluZyB8IENTU1N0eWxlU2hlZXQpW11cbik6IENTU1N0eWxlU2hlZXRbXSB7XG4gIGlmICghKGRvYyBpbnN0YW5jZW9mIERvY3VtZW50KSkge1xuICAgIGNzcy5wdXNoKGRvYyk7XG4gICAgZG9jID0gZG9jdW1lbnQ7XG4gIH1cblxuICBjb25zdCBzdHlsZXMgPSBjc3MubWFwKChjc3MpID0+IHtcbiAgICBpZiAodHlwZW9mIGNzcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnN0IHN0eWxlID0gbmV3IENTU1N0eWxlU2hlZXQoKTtcbiAgICAgIHN0eWxlLnJlcGxhY2VTeW5jKGNzcyk7XG4gICAgICByZXR1cm4gc3R5bGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNzcztcbiAgfSk7XG5cbiAgZG9jLmFkb3B0ZWRTdHlsZVNoZWV0cyA9IFsuLi5kb2MuYWRvcHRlZFN0eWxlU2hlZXRzLCAuLi5zdHlsZXNdO1xuXG4gIHJldHVybiBzdHlsZXM7XG59XG4iLCJpbXBvcnQgeyBzZWxlY3RPbmUgfSBmcm9tICcuL2RvbSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBhbmltYXRlVG8oXG4gIGVsZW1lbnQ6IEhUTUxFbGVtZW50LFxuICBzdHlsZXM6IFBhcnRpYWw8UmVjb3JkPGtleW9mIENTU1N0eWxlRGVjbGFyYXRpb24sIGFueT4+LFxuICBvcHRpb25zOiBudW1iZXIgfCBLZXlmcmFtZUFuaW1hdGlvbk9wdGlvbnMgPSB7fVxuKTogQW5pbWF0aW9uIHtcbiAgZWxlbWVudCA9IHNlbGVjdE9uZShlbGVtZW50KTtcblxuICBjb25zdCBjdXJyZW50U3R5bGVzID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCk7XG4gIGNvbnN0IHRyYW5zaXRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnlbXT4gPSB7fTtcblxuICBmb3IgKGNvbnN0IG5hbWUgaW4gc3R5bGVzKSB7XG4gICAgY29uc3QgdmFsdWUgPSBzdHlsZXNbbmFtZV07XG5cbiAgICB0cmFuc2l0aW9uc1tuYW1lXSA9IEFycmF5LmlzQXJyYXkodmFsdWUpXG4gICAgICA/IHZhbHVlXG4gICAgICA6IFtcbiAgICAgICAgY3VycmVudFN0eWxlcy5nZXRQcm9wZXJ0eVZhbHVlKG5hbWUpLFxuICAgICAgICB2YWx1ZVxuICAgICAgXTtcbiAgfVxuXG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ251bWJlcicpIHtcbiAgICBvcHRpb25zID0geyBkdXJhdGlvbjogb3B0aW9ucyB9O1xuICB9XG5cbiAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oXG4gICAge1xuICAgICAgZHVyYXRpb246IDQwMCxcbiAgICAgIGVhc2luZzogJ2xpbmVhcicsXG4gICAgICBmaWxsOiAnYm90aCdcbiAgICB9LFxuICAgIG9wdGlvbnNcbiAgKTtcblxuICBjb25zdCBhbmltYXRpb24gPSBlbGVtZW50LmFuaW1hdGUoXG4gICAgdHJhbnNpdGlvbnMsXG4gICAgb3B0aW9uc1xuICApO1xuXG4gIGFuaW1hdGlvbi5hZGRFdmVudExpc3RlbmVyKCdmaW5pc2gnLCAoKSA9PiB7XG4gICAgZm9yIChjb25zdCBuYW1lIGluIHN0eWxlcykge1xuICAgICAgY29uc3QgdmFsdWUgPSBzdHlsZXNbbmFtZV07XG5cbiAgICAgIGVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoXG4gICAgICAgIG5hbWUsXG4gICAgICAgIEFycmF5LmlzQXJyYXkodmFsdWUpXG4gICAgICAgICAgPyB2YWx1ZVt2YWx1ZS5sZW5ndGggLSAxXVxuICAgICAgICAgIDogdmFsdWVcbiAgICAgICk7XG4gICAgfVxuXG4gICAgYW5pbWF0aW9uLmNhbmNlbCgpO1xuICB9KTtcblxuICByZXR1cm4gYW5pbWF0aW9uO1xufVxuIiwiZXhwb3J0IHR5cGUgQWxlcnRIYW5kbGVyID0gKHRpdGxlOiBzdHJpbmcsIHRleHQ/OiBzdHJpbmcsIGljb24/OiBzdHJpbmcsIGV4dHJhPzogYW55KSA9PiBQcm9taXNlPHZvaWQ+O1xyXG5leHBvcnQgdHlwZSBDb25maXJtSGFuZGxlciA9ICh0aXRsZTogc3RyaW5nLCB0ZXh0Pzogc3RyaW5nLCBpY29uPzogc3RyaW5nLCBleHRyYT86IGFueSkgPT4gUHJvbWlzZTxib29sZWFuPjtcclxuXHJcbmV4cG9ydCBjbGFzcyBBbGVydEFkYXB0ZXIge1xyXG4gIHN0YXRpYyBhbGVydDogQWxlcnRIYW5kbGVyID0gYXN5bmMgKHRpdGxlOiBzdHJpbmcpID0+IHdpbmRvdy5hbGVydCh0aXRsZSk7XHJcbiAgc3RhdGljIGNvbmZpcm06IENvbmZpcm1IYW5kbGVyID0gYXN5bmMgKHRpdGxlOiBzdHJpbmcpID0+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZTxib29sZWFuPigocmVzb2x2ZSkgPT4ge1xyXG4gICAgICBjb25zdCB2ID0gY29uZmlybSh0aXRsZSk7XHJcblxyXG4gICAgICByZXNvbHZlKHYpO1xyXG4gICAgfSk7XHJcbiAgfTtcclxuICBzdGF0aWMgZGVsZXRlQ29uZmlybTogQ29uZmlybUhhbmRsZXIgPSBhc3luYyAodGl0bGU6IHN0cmluZykgPT4gdGhpcy5jb25maXJtKHRpdGxlKTtcclxuXHJcbiAgc3RhdGljIGNvbmZpcm1UZXh0OiAoKSA9PiBzdHJpbmcgPSAoKSA9PiAn56K66KqNJztcclxuICBzdGF0aWMgY2FuY2VsVGV4dDogKCkgPT4gc3RyaW5nID0gKCkgPT4gJ+WPlua2iCc7XHJcbiAgc3RhdGljIGRlbGV0ZVRleHQ6ICgpID0+IHN0cmluZyA9ICgpID0+ICfliKrpmaQnO1xyXG59XHJcblxyXG4iLCJpbXBvcnQgeyBBbGVydEFkYXB0ZXIgfSBmcm9tICcuL2FsZXJ0LWFkYXB0ZXInO1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNpbXBsZUFsZXJ0KFxyXG4gIHRpdGxlOiBzdHJpbmcsXHJcbiAgdGV4dDogc3RyaW5nID0gJycsXHJcbiAgaWNvbjogc3RyaW5nID0gJ2luZm8nLFxyXG4gIGV4dHJhPzogYW55XHJcbikge1xyXG4gIHJldHVybiBBbGVydEFkYXB0ZXIuYWxlcnQodGl0bGUsIHRleHQsIGljb24sIGV4dHJhKTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNpbXBsZUNvbmZpcm0oXHJcbiAgdGl0bGU6IHN0cmluZyxcclxuICB0ZXh0OiBzdHJpbmcgPSAnJyxcclxuICBpY29uOiBzdHJpbmcgPSAnaW5mbycsXHJcbiAgZXh0cmE/OiBhbnksXHJcbikge1xyXG4gIHJldHVybiBBbGVydEFkYXB0ZXIuY29uZmlybSh0aXRsZSwgdGV4dCwgaWNvbiwgZXh0cmEpO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlQ29uZmlybShcclxuICB0aXRsZTogc3RyaW5nLFxyXG4gIHRleHQ6IHN0cmluZyA9ICcnLFxyXG4gIGljb246IHN0cmluZyA9ICdpbmZvJyxcclxuICBleHRyYT86IGFueSxcclxuKSB7XHJcbiAgcmV0dXJuIEFsZXJ0QWRhcHRlci5kZWxldGVDb25maXJtKHRpdGxlLCB0ZXh0LCBpY29uLCBleHRyYSk7XHJcbn1cclxuIiwiXG5leHBvcnQgZnVuY3Rpb24gZ2V0R2xvYmFsVGhpcygpIHtcbiAgcmV0dXJuIGdsb2JhbFRoaXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0Jyb3dzZXIoKSB7XG4gIHJldHVybiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzTm9kZSgpIHtcbiAgcmV0dXJuIHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnO1xufVxuIiwiaW1wb3J0IHsgaXNOb2RlIH0gZnJvbSAnLi9lbnYnO1xuXG5leHBvcnQgZnVuY3Rpb24gYmFzZTY0VXJsRW5jb2RlKHN0cmluZzogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIGJ0b2EoU3RyaW5nKHN0cmluZykpXG4gICAgLnJlcGxhY2UoL1xcKy8sICctJylcbiAgICAucmVwbGFjZShuZXcgUmVnRXhwKCdcXFxcLycpLCAnXycpXG4gICAgLnJlcGxhY2UoLz0rJC8sICcnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJhc2U2NFVybERlY29kZShzdHJpbmc6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBhdG9iKFxuICAgIFN0cmluZyhzdHJpbmcpXG4gICAgICAucmVwbGFjZSgvLS8sICcrJylcbiAgICAgIC5yZXBsYWNlKC9fLywgJy8nKVxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdWlkKHByZWZpeDogc3RyaW5nID0gJycsIHRpbWViYXNlOiBib29sZWFuID0gZmFsc2UpOiBzdHJpbmcge1xuICBpZiAodGltZWJhc2UpIHtcbiAgICBjb25zdCBzdGFydCA9IHBlcmZvcm1hbmNlPy50aW1lT3JpZ2luXG4gICAgICA/IE1hdGgucm91bmQocGVyZm9ybWFuY2UudGltZU9yaWdpbilcbiAgICAgIDogcGVyZm9ybWFuY2UudGltaW5nLm5hdmlnYXRpb25TdGFydDtcblxuICAgIGNvbnN0IHRpbWUgPSAoc3RhcnQgKiAxMDAwMDApICsgKHBlcmZvcm1hbmNlLm5vdygpICogMTAwKTtcblxuICAgIHJldHVybiBwcmVmaXggKyB0aW1lLnRvU3RyaW5nKDEyKSArIChyYW5kb21CeXRlc1N0cmluZyg0KSk7XG4gIH1cblxuICByZXR1cm4gcHJlZml4ICsgcmFuZG9tQnl0ZXNTdHJpbmcoMTIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdGlkKHByZWZpeDogc3RyaW5nID0gJycpOiBzdHJpbmcge1xuICByZXR1cm4gdWlkKHByZWZpeCwgdHJ1ZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByYW5kb21CeXRlc1N0cmluZyhzaXplOiBudW1iZXIgPSAxMik6IHN0cmluZyB7XG4gIGlmICghaXNOb2RlKCkgJiYgIWdsb2JhbFRoaXMuY3J5cHRvKSB7XG4gICAgcmV0dXJuIFN0cmluZyhNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoc2l6ZSAqKiAxMCkpKTtcbiAgfVxuXG4gIHJldHVybiBBcnJheS5mcm9tKHJhbmRvbUJ5dGVzKHNpemUpKVxuICAgIC5tYXAoeCA9PiB4LnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCAnMCcpKVxuICAgIC5qb2luKCcnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJhbmRvbUJ5dGVzKHNpemU6IG51bWJlciA9IDEyKTogVWludDhBcnJheSB7XG4gIGNvbnN0IGFyciA9IG5ldyBVaW50OEFycmF5KHNpemUpO1xuICBnbG9iYWxUaGlzLmNyeXB0by5nZXRSYW5kb21WYWx1ZXMoYXJyKTtcbiAgcmV0dXJuIGFycjtcbn1cblxuZXhwb3J0IGNvbnN0IFNUUl9TRUVEX0JBU0UzMiA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWjIzNDU2Nyc7XG5leHBvcnQgY29uc3QgU1RSX1NFRURfQkFTRTMySEVYID0gJzAxMjM0NTY3ODlBQkNERUZHSElKS0xNTk9QUVJTVFVWJztcbmV4cG9ydCBjb25zdCBTVFJfU0VFRF9CQVNFMzYgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVowMTIzNDU2Nzg5JztcbmV4cG9ydCBjb25zdCBTVFJfU0VFRF9CQVNFNTggPSAnMTIzNDU2Nzg5QUJDREVGR0hKS0xNTlBRUlNUVVZXWFlaYWJjZGVmZ2hpamttbm9wcXJzdHV2d3h5eic7XG5leHBvcnQgY29uc3QgU1RSX1NFRURfQkFTRTY0U0FGRSA9ICcwMTIzNDU2Nzg5YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWic7XG5leHBvcnQgY29uc3QgU1RSX1NFRURfQkFTRTYyID0gJzAxMjM0NTY3ODlhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ekFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaJztcblxuZXhwb3J0IGZ1bmN0aW9uIHJhbmRvbVN0cmluZyhsZW5ndGg6IG51bWJlciwgY2hhcmFjdGVyczogc3RyaW5nID0gU1RSX1NFRURfQkFTRTYyKTogc3RyaW5nIHtcbiAgbGV0IHJlc3VsdCA9ICcnO1xuICBjb25zdCBjaGFyYWN0ZXJzTGVuZ3RoID0gY2hhcmFjdGVycy5sZW5ndGg7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIHJlc3VsdCArPSBjaGFyYWN0ZXJzLmNoYXJBdChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjaGFyYWN0ZXJzTGVuZ3RoKSk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuIiwiZXhwb3J0IGNsYXNzIFRhc2tRdWV1ZSB7XG4gIGl0ZW1zOiAoKCkgPT4gUHJvbWlzZTxhbnk+KVtdID0gW107XG5cbiAgY3VycmVudFJ1bm5pbmcgPSAwO1xuXG4gIHJ1bm5pbmcgPSBmYWxzZTtcblxuICBvYnNlcnZlcnM6IHtcbiAgICBoYW5kbGVyOiBGdW5jdGlvbjtcbiAgICBvbmNlOiBib29sZWFuO1xuICB9W10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgbWF4UnVubmluZyA9IDEpIHtcbiAgICAvL1xuICB9XG5cbiAgcHVzaDxUIGV4dGVuZHMgKCguLi5hcmdzOiBhbnlbXSkgPT4gYW55KT4oY2FsbGJhY2s6IFQpOiBQcm9taXNlPEF3YWl0ZWQ8UmV0dXJuVHlwZTxUPj4+IHtcbiAgICBjb25zdCBwID0gbmV3IFByb21pc2U8QXdhaXRlZDxSZXR1cm5UeXBlPFQ+Pj4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5pdGVtcy5wdXNoKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShjYWxsYmFjaygpKS50aGVuKHJlc29sdmUpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnJ1bigpO1xuXG4gICAgcmV0dXJuIHA7XG4gIH1cblxuICBydW4oKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLnJ1bm5pbmcpIHtcbiAgICAgIHRoaXMucnVubmluZyA9IHRydWU7XG4gICAgfVxuXG4gICAgdGhpcy5wb3AoKTtcbiAgfVxuXG4gIGFzeW5jIHBvcCgpIHtcbiAgICBjb25zdCBjYWxsYmFjayA9IHRoaXMuaXRlbXMuc2hpZnQoKTtcblxuICAgIC8vIElmIGVtcHR5LCBzdG9wIHJ1bm5pbmcuXG4gICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2U7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuXG4gICAgLy8gSWYgY3VycmVudCBydW5uaW5nIGZ1bGwsIHNldCBiYWNrIHRvIHF1ZXVlIGFuZCBsZWF2ZS5cbiAgICBpZiAodGhpcy5jdXJyZW50UnVubmluZyA+PSB0aGlzLm1heFJ1bm5pbmcpIHtcbiAgICAgIHRoaXMuaXRlbXMudW5zaGlmdChjYWxsYmFjayk7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuXG4gICAgdGhpcy5jdXJyZW50UnVubmluZysrO1xuXG4gICAgdGhpcy5ub3RpY2UoKTtcblxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYXdhaXQgY2FsbGJhY2soKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aHJvdyBlO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLmVuZFBvcCgpO1xuICAgIH1cbiAgfVxuXG4gIGVuZFBvcCgpIHtcbiAgICB0aGlzLmN1cnJlbnRSdW5uaW5nLS07XG4gICAgdGhpcy5ub3RpY2UoKTtcbiAgICB0aGlzLnBvcCgpO1xuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5pdGVtcyA9IFtdO1xuXG4gICAgdGhpcy5ub3RpY2UoKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgaXNFbXB0eSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5pdGVtcy5sZW5ndGggPT09IDA7XG4gIH1cblxuICBnZXQgbGVuZ3RoKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuaXRlbXMubGVuZ3RoO1xuICB9XG5cbiAgcGVlaygpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVtcztcbiAgfVxuXG4gIG9ic2VydmUoaGFuZGxlcjogT2JzZXJ2ZXJGdW5jdGlvbiwgb3B0aW9uczogeyBvbmNlPzogYm9vbGVhbiB9ID0ge30pOiAoKSA9PiB2b2lkIHtcbiAgICB0aGlzLm9ic2VydmVycy5wdXNoKHtcbiAgICAgIGhhbmRsZXIsXG4gICAgICBvbmNlOiBvcHRpb25zLm9uY2UgfHwgZmFsc2UsXG4gICAgfSk7XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgdGhpcy5vZmYoaGFuZGxlcik7XG4gICAgfTtcbiAgfVxuXG4gIG9uY2UoaGFuZGxlcjogT2JzZXJ2ZXJGdW5jdGlvbiwgb3B0aW9uczogeyBvbmNlPzogYm9vbGVhbiB9ID0ge30pOiAoKSA9PiB2b2lkIHtcbiAgICBvcHRpb25zLm9uY2UgPSB0cnVlO1xuXG4gICAgcmV0dXJuIHRoaXMub2JzZXJ2ZShoYW5kbGVyLCBvcHRpb25zKTtcbiAgfVxuXG4gIG9uRW5kKGNhbGxiYWNrOiBPYnNlcnZlckZ1bmN0aW9uLCBvcHRpb25zOiB7IG9uY2U/OiBib29sZWFuIH0gPSB7fSkge1xuICAgIHJldHVybiB0aGlzLm9ic2VydmUoKHF1ZXVlLCBsZW5ndGgsIHJ1bm5pbmcpID0+IHtcbiAgICAgIGlmIChsZW5ndGggPT09IDAgJiYgcnVubmluZyA9PT0gMCkge1xuICAgICAgICBjYWxsYmFjayhxdWV1ZSwgbGVuZ3RoLCBydW5uaW5nKTtcbiAgICAgIH1cbiAgICB9LCBvcHRpb25zKTtcbiAgfVxuXG4gIG5vdGljZSgpIHtcbiAgICB0aGlzLm9ic2VydmVycy5mb3JFYWNoKChvYnNlcnZlcikgPT4ge1xuICAgICAgb2JzZXJ2ZXIuaGFuZGxlcih0aGlzLCB0aGlzLmxlbmd0aCwgdGhpcy5jdXJyZW50UnVubmluZyk7XG4gICAgfSk7XG5cbiAgICB0aGlzLm9ic2VydmVycyA9IHRoaXMub2JzZXJ2ZXJzLmZpbHRlcigob2JzZXJ2ZXIpID0+ICFvYnNlcnZlci5vbmNlKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgb2ZmKGNhbGxiYWNrPzogRnVuY3Rpb24pIHtcbiAgICBpZiAoY2FsbGJhY2sgPT0gbnVsbCkge1xuICAgICAgdGhpcy5vYnNlcnZlcnMgPSBbXTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHRoaXMub2JzZXJ2ZXJzID0gdGhpcy5vYnNlcnZlcnMuZmlsdGVyKChvYnNlcnZlcikgPT4gb2JzZXJ2ZXIuaGFuZGxlciAhPT0gY2FsbGJhY2spO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG5cbmRlY2xhcmUgdHlwZSBPYnNlcnZlckZ1bmN0aW9uID0gKHF1ZXVlOiBUYXNrUXVldWUsIGxlbmd0aDogbnVtYmVyLCBydW5uaW5nOiBudW1iZXIpID0+IHZvaWRcblxuZXhwb3J0IGZ1bmN0aW9uIHF1ZXVlKG1heFJ1bm5pbmc6IG51bWJlciA9IDEpIHtcbiAgcmV0dXJuIG5ldyBUYXNrUXVldWUobWF4UnVubmluZyk7XG59XG4iLCJkZWNsYXJlIHR5cGUgU3RhY2tIYW5kbGVyPFQ+ID0gKHN0YWNrOiBTdGFjazxUPiwgbGVuZ3RoOiBudW1iZXIpID0+IHZvaWQ7XG5cbmRlY2xhcmUgdHlwZSBTdGFja1ZhbHVlPFY+ID0gViB8IHRydWU7XG5cbmV4cG9ydCBjbGFzcyBTdGFjazxUID0gYW55PiB7XG4gIG9ic2VydmVyczogeyBoYW5kbGVyOiBTdGFja0hhbmRsZXI8VD4sIG9uY2U6IGJvb2xlYW4gfVtdID0gW107XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHN0b3JlOiBTdGFja1ZhbHVlPFQ+W10gPSBbXSkge1xuICAgIC8vXG4gIH1cblxuICBwdXNoKHZhbHVlPzogVCk6IG51bWJlciB7XG4gICAgY29uc3QgciA9IHRoaXMuc3RvcmUucHVzaCh2YWx1ZSA/PyB0cnVlKTtcblxuICAgIHRoaXMubm90aWNlKCk7XG5cbiAgICByZXR1cm4gcjtcbiAgfVxuXG4gIHBvcCgpOiBUIHwgdHJ1ZSB8IHVuZGVmaW5lZCB7XG4gICAgY29uc3QgciA9IHRoaXMuc3RvcmUucG9wKCk7XG5cbiAgICB0aGlzLm5vdGljZSgpO1xuXG4gICAgcmV0dXJuIHI7XG4gIH1cblxuICBjbGVhcigpOiB0aGlzIHtcbiAgICB0aGlzLnN0b3JlID0gW107XG5cbiAgICB0aGlzLm5vdGljZSgpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBpc0VtcHR5KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnN0b3JlLmxlbmd0aCA9PT0gMDtcbiAgfVxuXG4gIGdldCBsZW5ndGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RvcmUubGVuZ3RoO1xuICB9XG5cbiAgcGVlaygpOiBTdGFja1ZhbHVlPFQ+W10ge1xuICAgIHJldHVybiB0aGlzLnN0b3JlO1xuICB9XG5cbiAgb2JzZXJ2ZShoYW5kbGVyOiAoc3RhY2s6IFN0YWNrLCBsZW5ndGg6IG51bWJlcikgPT4gdm9pZCk6ICgpID0+IHZvaWQge1xuICAgIHRoaXMub2JzZXJ2ZXJzLnB1c2goe1xuICAgICAgaGFuZGxlcixcbiAgICAgIG9uY2U6IGZhbHNlXG4gICAgfSk7XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgdGhpcy5vZmYoaGFuZGxlcik7XG4gICAgfTtcbiAgfVxuXG4gIG9uY2UoaGFuZGxlcjogU3RhY2tIYW5kbGVyPFQ+KTogKCkgPT4gdm9pZCB7XG4gICAgdGhpcy5vYnNlcnZlcnMucHVzaCh7XG4gICAgICBoYW5kbGVyLFxuICAgICAgb25jZTogdHJ1ZVxuICAgIH0pO1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHRoaXMub2ZmKGhhbmRsZXIpO1xuICAgIH07XG4gIH1cblxuICBub3RpY2UoKTogdGhpcyB7XG4gICAgdGhpcy5vYnNlcnZlcnMuZm9yRWFjaCgob2JzZXJ2ZXIpID0+IHtcbiAgICAgIG9ic2VydmVyLmhhbmRsZXIodGhpcywgdGhpcy5sZW5ndGgpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5vYnNlcnZlcnMgPSB0aGlzLm9ic2VydmVycy5maWx0ZXIoKG9ic2VydmVyKSA9PiBvYnNlcnZlci5vbmNlICE9PSB0cnVlKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgb2ZmKGNhbGxiYWNrPzogU3RhY2tIYW5kbGVyPFQ+KTogdGhpcyB7XG4gICAgdGhpcy5vYnNlcnZlcnMgPSB0aGlzLm9ic2VydmVycy5maWx0ZXIoKG9ic2VydmVyKSA9PiBvYnNlcnZlci5oYW5kbGVyICE9PSBjYWxsYmFjayk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0YWNrPFQgPSBhbnk+KHN0b3JlOiBhbnlbXSA9IFtdKSB7XG4gIHJldHVybiBuZXcgU3RhY2s8VD4oc3RvcmUpO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIHNsZWVwKHRpbWU6IG51bWJlcikge1xyXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgc2V0VGltZW91dChyZXNvbHZlLCB0aW1lKTtcclxuICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG5leHRUaWNrKGNhbGxiYWNrID0gKCkgPT4ge30pIHtcclxuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbihjYWxsYmFjayk7XHJcbn1cclxuIiwiaW1wb3J0IHsgdWlkLCB0aWQsIHJhbmRvbUJ5dGVzLCByYW5kb21CeXRlc1N0cmluZyB9IGZyb20gJ0BseXJhc29mdC90cy10b29sa2l0L2dlbmVyaWMnO1xuXG5leHBvcnQgZnVuY3Rpb24gYmFzZTY0VXJsRW5jb2RlKHN0cmluZzogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIGJ0b2EoU3RyaW5nKHN0cmluZykpXG4gICAgLnJlcGxhY2UoL1xcKy8sICctJylcbiAgICAucmVwbGFjZShuZXcgUmVnRXhwKCdcXFxcLycpLCAnXycpXG4gICAgLnJlcGxhY2UoLz0rJC8sICcnKTtcbn1cblxuLyoqXG4gKiBCYXNlNjQgVVJMIGRlY29kZVxuICovXG5leHBvcnQgZnVuY3Rpb24gYmFzZTY0VXJsRGVjb2RlKHN0cmluZzogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIGF0b2IoXG4gICAgU3RyaW5nKHN0cmluZylcbiAgICAgIC5yZXBsYWNlKC8tLywgJysnKVxuICAgICAgLnJlcGxhY2UoL18vLCAnLycpXG4gICk7XG59XG5cbmV4cG9ydCB7IHVpZCwgdGlkLCByYW5kb21CeXRlcywgcmFuZG9tQnl0ZXNTdHJpbmcgfTtcblxubGV0IGdsb2JhbFNlcmlhbCA9IDE7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXJpYWwoKTogbnVtYmVyIHtcbiAgcmV0dXJuIGdsb2JhbFNlcmlhbCsrO1xufVxuIiwiaW1wb3J0IHsgZGF0YSB9IGZyb20gJy4uL2RhdGEnO1xuaW1wb3J0IHsgc2xlZXAgfSBmcm9tICdAbHlyYXNvZnQvdHMtdG9vbGtpdC9nZW5lcmljJztcblxuZXhwb3J0IHsgc2xlZXAgfTtcblxuZXhwb3J0IGZ1bmN0aW9uIGZvcmNlQXJyYXk8VD4oaXRlbTogVCB8IFRbXSk6IFRbXSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGl0ZW0pKSB7XG4gICAgcmV0dXJuIGl0ZW07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFtpdGVtXTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVib3VuY2U8VCBleHRlbmRzIEZ1bmN0aW9uID0gRnVuY3Rpb24+KGhhbmRsZXI6IFQsIHdhaXQgPSAxKTogVCB7XG4gIGxldCB0aW1lcjogUmV0dXJuVHlwZTx0eXBlb2Ygc2V0VGltZW91dD4gfCBudW1iZXIsIHJlc3VsdDogYW55O1xuICByZXR1cm4gZnVuY3Rpb24gKHRoaXM6IGFueSwgLi4uYXJnczogYW55W10pIHtcbiAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgIHRpbWVyID0gc2V0VGltZW91dCgoKSA9PiByZXN1bHQgPSBoYW5kbGVyLmNhbGwodGhpcywgLi4uYXJncyksIHdhaXQpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH0gYXMgYW55IGFzIFQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0aHJvdHRsZTxUIGV4dGVuZHMgRnVuY3Rpb24gPSBGdW5jdGlvbj4oaGFuZGxlcjogVCwgd2FpdDogbnVtYmVyID0gMSk6IFQge1xuICBsZXQgdGltZXI6IFJldHVyblR5cGU8dHlwZW9mIHNldFRpbWVvdXQ+IHwgbnVtYmVyIHwgdW5kZWZpbmVkLCByZXN1bHQ6IGFueTtcbiAgcmV0dXJuIGZ1bmN0aW9uICh0aGlzOiBhbnksIC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgaWYgKCF0aW1lcikge1xuICAgICAgcmV0dXJuIHJlc3VsdCA9IGhhbmRsZXIuY2FsbCh0aGlzLCAuLi5hcmdzKTtcbiAgICB9XG5cbiAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgIHRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB0aW1lciA9IHVuZGVmaW5lZCwgd2FpdCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSBhcyBhbnkgYXMgVDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRGVidWcoKSB7XG4gIHJldHVybiBCb29sZWFuKGRhdGEoJ3dpbmR3YWxrZXIuZGVidWcnKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBuZXh0VGljayhjYWxsYmFjaz86ICgpID0+IGFueSk6IFByb21pc2U8YW55PiB7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKGNhbGxiYWNrID8/ICgoKSA9PiBudWxsKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3YWl0PFQgZXh0ZW5kcyByZWFkb25seSB1bmtub3duW10+KFxuICAuLi5wcm9taXNlZTogeyBbSyBpbiBrZXlvZiBUXTogUHJvbWlzZUxpa2U8VFtLXT4gfCBUW0tdIH1cbik6IFByb21pc2U8QXdhaXRlZDxUPj4ge1xuICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZWUpIGFzIFByb21pc2U8QXdhaXRlZDxUPj47XG59XG4iLCIvKiBnbG9iYWwgd2luZG93LCBleHBvcnRzLCBkZWZpbmUgKi9cblxuIWZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0J1xuXG4gICAgdmFyIHJlID0ge1xuICAgICAgICBub3Rfc3RyaW5nOiAvW15zXS8sXG4gICAgICAgIG5vdF9ib29sOiAvW150XS8sXG4gICAgICAgIG5vdF90eXBlOiAvW15UXS8sXG4gICAgICAgIG5vdF9wcmltaXRpdmU6IC9bXnZdLyxcbiAgICAgICAgbnVtYmVyOiAvW2RpZWZnXS8sXG4gICAgICAgIG51bWVyaWNfYXJnOiAvW2JjZGllZmd1eFhdLyxcbiAgICAgICAganNvbjogL1tqXS8sXG4gICAgICAgIG5vdF9qc29uOiAvW15qXS8sXG4gICAgICAgIHRleHQ6IC9eW15cXHgyNV0rLyxcbiAgICAgICAgbW9kdWxvOiAvXlxceDI1ezJ9LyxcbiAgICAgICAgcGxhY2Vob2xkZXI6IC9eXFx4MjUoPzooWzEtOV1cXGQqKVxcJHxcXCgoW14pXSspXFwpKT8oXFwrKT8oMHwnW14kXSk/KC0pPyhcXGQrKT8oPzpcXC4oXFxkKykpPyhbYi1naWpvc3RUdXZ4WF0pLyxcbiAgICAgICAga2V5OiAvXihbYS16X11bYS16X1xcZF0qKS9pLFxuICAgICAgICBrZXlfYWNjZXNzOiAvXlxcLihbYS16X11bYS16X1xcZF0qKS9pLFxuICAgICAgICBpbmRleF9hY2Nlc3M6IC9eXFxbKFxcZCspXFxdLyxcbiAgICAgICAgc2lnbjogL15bKy1dL1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNwcmludGYoa2V5KSB7XG4gICAgICAgIC8vIGBhcmd1bWVudHNgIGlzIG5vdCBhbiBhcnJheSwgYnV0IHNob3VsZCBiZSBmaW5lIGZvciB0aGlzIGNhbGxcbiAgICAgICAgcmV0dXJuIHNwcmludGZfZm9ybWF0KHNwcmludGZfcGFyc2Uoa2V5KSwgYXJndW1lbnRzKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZzcHJpbnRmKGZtdCwgYXJndikge1xuICAgICAgICByZXR1cm4gc3ByaW50Zi5hcHBseShudWxsLCBbZm10XS5jb25jYXQoYXJndiB8fCBbXSkpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3ByaW50Zl9mb3JtYXQocGFyc2VfdHJlZSwgYXJndikge1xuICAgICAgICB2YXIgY3Vyc29yID0gMSwgdHJlZV9sZW5ndGggPSBwYXJzZV90cmVlLmxlbmd0aCwgYXJnLCBvdXRwdXQgPSAnJywgaSwgaywgcGgsIHBhZCwgcGFkX2NoYXJhY3RlciwgcGFkX2xlbmd0aCwgaXNfcG9zaXRpdmUsIHNpZ25cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRyZWVfbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcGFyc2VfdHJlZVtpXSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gcGFyc2VfdHJlZVtpXVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIHBhcnNlX3RyZWVbaV0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgcGggPSBwYXJzZV90cmVlW2ldIC8vIGNvbnZlbmllbmNlIHB1cnBvc2VzIG9ubHlcbiAgICAgICAgICAgICAgICBpZiAocGgua2V5cykgeyAvLyBrZXl3b3JkIGFyZ3VtZW50XG4gICAgICAgICAgICAgICAgICAgIGFyZyA9IGFyZ3ZbY3Vyc29yXVxuICAgICAgICAgICAgICAgICAgICBmb3IgKGsgPSAwOyBrIDwgcGgua2V5cy5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFyZyA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3Ioc3ByaW50ZignW3NwcmludGZdIENhbm5vdCBhY2Nlc3MgcHJvcGVydHkgXCIlc1wiIG9mIHVuZGVmaW5lZCB2YWx1ZSBcIiVzXCInLCBwaC5rZXlzW2tdLCBwaC5rZXlzW2stMV0pKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJnW3BoLmtleXNba11dXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocGgucGFyYW1fbm8pIHsgLy8gcG9zaXRpb25hbCBhcmd1bWVudCAoZXhwbGljaXQpXG4gICAgICAgICAgICAgICAgICAgIGFyZyA9IGFyZ3ZbcGgucGFyYW1fbm9dXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgeyAvLyBwb3NpdGlvbmFsIGFyZ3VtZW50IChpbXBsaWNpdClcbiAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJndltjdXJzb3IrK11cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocmUubm90X3R5cGUudGVzdChwaC50eXBlKSAmJiByZS5ub3RfcHJpbWl0aXZlLnRlc3QocGgudHlwZSkgJiYgYXJnIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJnKClcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocmUubnVtZXJpY19hcmcudGVzdChwaC50eXBlKSAmJiAodHlwZW9mIGFyZyAhPT0gJ251bWJlcicgJiYgaXNOYU4oYXJnKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihzcHJpbnRmKCdbc3ByaW50Zl0gZXhwZWN0aW5nIG51bWJlciBidXQgZm91bmQgJVQnLCBhcmcpKVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChyZS5udW1iZXIudGVzdChwaC50eXBlKSkge1xuICAgICAgICAgICAgICAgICAgICBpc19wb3NpdGl2ZSA9IGFyZyA+PSAwXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc3dpdGNoIChwaC50eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2InOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gcGFyc2VJbnQoYXJnLCAxMCkudG9TdHJpbmcoMilcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2MnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gU3RyaW5nLmZyb21DaGFyQ29kZShwYXJzZUludChhcmcsIDEwKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2QnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlICdpJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IHBhcnNlSW50KGFyZywgMTApXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdqJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IEpTT04uc3RyaW5naWZ5KGFyZywgbnVsbCwgcGgud2lkdGggPyBwYXJzZUludChwaC53aWR0aCkgOiAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnZSc6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBwaC5wcmVjaXNpb24gPyBwYXJzZUZsb2F0KGFyZykudG9FeHBvbmVudGlhbChwaC5wcmVjaXNpb24pIDogcGFyc2VGbG9hdChhcmcpLnRvRXhwb25lbnRpYWwoKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnZic6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBwaC5wcmVjaXNpb24gPyBwYXJzZUZsb2F0KGFyZykudG9GaXhlZChwaC5wcmVjaXNpb24pIDogcGFyc2VGbG9hdChhcmcpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdnJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IHBoLnByZWNpc2lvbiA/IFN0cmluZyhOdW1iZXIoYXJnLnRvUHJlY2lzaW9uKHBoLnByZWNpc2lvbikpKSA6IHBhcnNlRmxvYXQoYXJnKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnbyc6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSAocGFyc2VJbnQoYXJnLCAxMCkgPj4+IDApLnRvU3RyaW5nKDgpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdzJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IFN0cmluZyhhcmcpXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSAocGgucHJlY2lzaW9uID8gYXJnLnN1YnN0cmluZygwLCBwaC5wcmVjaXNpb24pIDogYXJnKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAndCc6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBTdHJpbmcoISFhcmcpXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSAocGgucHJlY2lzaW9uID8gYXJnLnN1YnN0cmluZygwLCBwaC5wcmVjaXNpb24pIDogYXJnKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnVCc6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJnKS5zbGljZSg4LCAtMSkudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gKHBoLnByZWNpc2lvbiA/IGFyZy5zdWJzdHJpbmcoMCwgcGgucHJlY2lzaW9uKSA6IGFyZylcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3UnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gcGFyc2VJbnQoYXJnLCAxMCkgPj4+IDBcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3YnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJnLnZhbHVlT2YoKVxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gKHBoLnByZWNpc2lvbiA/IGFyZy5zdWJzdHJpbmcoMCwgcGgucHJlY2lzaW9uKSA6IGFyZylcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3gnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gKHBhcnNlSW50KGFyZywgMTApID4+PiAwKS50b1N0cmluZygxNilcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ1gnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gKHBhcnNlSW50KGFyZywgMTApID4+PiAwKS50b1N0cmluZygxNikudG9VcHBlckNhc2UoKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJlLmpzb24udGVzdChwaC50eXBlKSkge1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXQgKz0gYXJnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmUubnVtYmVyLnRlc3QocGgudHlwZSkgJiYgKCFpc19wb3NpdGl2ZSB8fCBwaC5zaWduKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2lnbiA9IGlzX3Bvc2l0aXZlID8gJysnIDogJy0nXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBhcmcudG9TdHJpbmcoKS5yZXBsYWNlKHJlLnNpZ24sICcnKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2lnbiA9ICcnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcGFkX2NoYXJhY3RlciA9IHBoLnBhZF9jaGFyID8gcGgucGFkX2NoYXIgPT09ICcwJyA/ICcwJyA6IHBoLnBhZF9jaGFyLmNoYXJBdCgxKSA6ICcgJ1xuICAgICAgICAgICAgICAgICAgICBwYWRfbGVuZ3RoID0gcGgud2lkdGggLSAoc2lnbiArIGFyZykubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgIHBhZCA9IHBoLndpZHRoID8gKHBhZF9sZW5ndGggPiAwID8gcGFkX2NoYXJhY3Rlci5yZXBlYXQocGFkX2xlbmd0aCkgOiAnJykgOiAnJ1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXQgKz0gcGguYWxpZ24gPyBzaWduICsgYXJnICsgcGFkIDogKHBhZF9jaGFyYWN0ZXIgPT09ICcwJyA/IHNpZ24gKyBwYWQgKyBhcmcgOiBwYWQgKyBzaWduICsgYXJnKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0cHV0XG4gICAgfVxuXG4gICAgdmFyIHNwcmludGZfY2FjaGUgPSBPYmplY3QuY3JlYXRlKG51bGwpXG5cbiAgICBmdW5jdGlvbiBzcHJpbnRmX3BhcnNlKGZtdCkge1xuICAgICAgICBpZiAoc3ByaW50Zl9jYWNoZVtmbXRdKSB7XG4gICAgICAgICAgICByZXR1cm4gc3ByaW50Zl9jYWNoZVtmbXRdXG4gICAgICAgIH1cblxuICAgICAgICB2YXIgX2ZtdCA9IGZtdCwgbWF0Y2gsIHBhcnNlX3RyZWUgPSBbXSwgYXJnX25hbWVzID0gMFxuICAgICAgICB3aGlsZSAoX2ZtdCkge1xuICAgICAgICAgICAgaWYgKChtYXRjaCA9IHJlLnRleHQuZXhlYyhfZm10KSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBwYXJzZV90cmVlLnB1c2gobWF0Y2hbMF0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICgobWF0Y2ggPSByZS5tb2R1bG8uZXhlYyhfZm10KSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBwYXJzZV90cmVlLnB1c2goJyUnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoKG1hdGNoID0gcmUucGxhY2Vob2xkZXIuZXhlYyhfZm10KSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2hbMl0pIHtcbiAgICAgICAgICAgICAgICAgICAgYXJnX25hbWVzIHw9IDFcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZpZWxkX2xpc3QgPSBbXSwgcmVwbGFjZW1lbnRfZmllbGQgPSBtYXRjaFsyXSwgZmllbGRfbWF0Y2ggPSBbXVxuICAgICAgICAgICAgICAgICAgICBpZiAoKGZpZWxkX21hdGNoID0gcmUua2V5LmV4ZWMocmVwbGFjZW1lbnRfZmllbGQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRfbGlzdC5wdXNoKGZpZWxkX21hdGNoWzFdKVxuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKChyZXBsYWNlbWVudF9maWVsZCA9IHJlcGxhY2VtZW50X2ZpZWxkLnN1YnN0cmluZyhmaWVsZF9tYXRjaFswXS5sZW5ndGgpKSAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGZpZWxkX21hdGNoID0gcmUua2V5X2FjY2Vzcy5leGVjKHJlcGxhY2VtZW50X2ZpZWxkKSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRfbGlzdC5wdXNoKGZpZWxkX21hdGNoWzFdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICgoZmllbGRfbWF0Y2ggPSByZS5pbmRleF9hY2Nlc3MuZXhlYyhyZXBsYWNlbWVudF9maWVsZCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkX2xpc3QucHVzaChmaWVsZF9tYXRjaFsxXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcignW3NwcmludGZdIGZhaWxlZCB0byBwYXJzZSBuYW1lZCBhcmd1bWVudCBrZXknKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcignW3NwcmludGZdIGZhaWxlZCB0byBwYXJzZSBuYW1lZCBhcmd1bWVudCBrZXknKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG1hdGNoWzJdID0gZmllbGRfbGlzdFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYXJnX25hbWVzIHw9IDJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGFyZ19uYW1lcyA9PT0gMykge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1tzcHJpbnRmXSBtaXhpbmcgcG9zaXRpb25hbCBhbmQgbmFtZWQgcGxhY2Vob2xkZXJzIGlzIG5vdCAoeWV0KSBzdXBwb3J0ZWQnKVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHBhcnNlX3RyZWUucHVzaChcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI6IG1hdGNoWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1fbm86ICAgIG1hdGNoWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAga2V5czogICAgICAgIG1hdGNoWzJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2lnbjogICAgICAgIG1hdGNoWzNdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFkX2NoYXI6ICAgIG1hdGNoWzRdLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWxpZ246ICAgICAgIG1hdGNoWzVdLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICAgICAgIG1hdGNoWzZdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJlY2lzaW9uOiAgIG1hdGNoWzddLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogICAgICAgIG1hdGNoWzhdXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoJ1tzcHJpbnRmXSB1bmV4cGVjdGVkIHBsYWNlaG9sZGVyJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF9mbXQgPSBfZm10LnN1YnN0cmluZyhtYXRjaFswXS5sZW5ndGgpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNwcmludGZfY2FjaGVbZm10XSA9IHBhcnNlX3RyZWVcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBleHBvcnQgdG8gZWl0aGVyIGJyb3dzZXIgb3Igbm9kZS5qc1xuICAgICAqL1xuICAgIC8qIGVzbGludC1kaXNhYmxlIHF1b3RlLXByb3BzICovXG4gICAgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBleHBvcnRzWydzcHJpbnRmJ10gPSBzcHJpbnRmXG4gICAgICAgIGV4cG9ydHNbJ3ZzcHJpbnRmJ10gPSB2c3ByaW50ZlxuICAgIH1cbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgd2luZG93WydzcHJpbnRmJ10gPSBzcHJpbnRmXG4gICAgICAgIHdpbmRvd1sndnNwcmludGYnXSA9IHZzcHJpbnRmXG5cbiAgICAgICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lWydhbWQnXSkge1xuICAgICAgICAgICAgZGVmaW5lKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICdzcHJpbnRmJzogc3ByaW50ZixcbiAgICAgICAgICAgICAgICAgICAgJ3ZzcHJpbnRmJzogdnNwcmludGZcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qIGVzbGludC1lbmFibGUgcXVvdGUtcHJvcHMgKi9cbn0oKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuIiwiaW1wb3J0IHsgZGF0YSB9IGZyb20gJy4uL2RhdGEnO1xuaW1wb3J0IHsgaXNEZWJ1ZyB9IGZyb20gJy4vL2hlbHBlcic7XG5pbXBvcnQgeyBEaWN0aW9uYXJ5IH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgdnNwcmludGYgfSBmcm9tICdzcHJpbnRmLWpzJztcblxubGV0IGxhbmc6IFVuaWNvcm5MYW5nO1xuXG5leHBvcnQgZnVuY3Rpb24gdXNlTGFuZygpIHtcbiAgcmV0dXJuIGxhbmcgPz89IG5ldyBVbmljb3JuTGFuZygpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdHJhbnMoaWQ6IHN0cmluZywgLi4uYXJnczogYW55W10pIHtcbiAgcmV0dXJuIHVzZUxhbmcoKS50cmFucyhpZCwgLi4uYXJncyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfXyhpZDogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSkge1xuICByZXR1cm4gdHJhbnMoaWQsIC4uLmFyZ3MpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVbmljb3JuTGFuZyB7XG4gIC8qKlxuICAgKiBUcmFuc2xhdGUgYSBzdHJpbmcuXG4gICAqL1xuICB0cmFucyhpZDogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSk6IHN0cmluZyB7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5ub3JtYWxpemUoaWQpO1xuXG4gICAgbGV0IHRyYW5zbGF0ZWQgPSB0aGlzLmdldChrZXkpIHx8ICcnO1xuXG4gICAgdHJhbnNsYXRlZCA9IHRoaXMucmVwbGFjZSh0cmFuc2xhdGVkLCBhcmdzKTtcblxuICAgIHJldHVybiB0cmFuc2xhdGVkICE9PSAnJyA/IHRyYW5zbGF0ZWQgOiB0aGlzLndyYXBEZWJ1ZyhpZCwgZmFsc2UpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHJlcGxhY2Uoc3RyOiBzdHJpbmcsIGFyZ3M6IGFueVtdKTogc3RyaW5nIHtcbiAgICBsZXQgcmVwbGFjZW1lbnRzOiBEaWN0aW9uYXJ5PGFueT4gPSB7fTtcbiAgICBsZXQgdmFsdWVzOiBhbnlbXSA9IFtdO1xuXG4gICAgZm9yIChjb25zdCBhcmcgb2YgYXJncykge1xuICAgICAgaWYgKHR5cGVvZiBhcmcgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJlcGxhY2VtZW50cyA9IHsgLi4ucmVwbGFjZW1lbnRzLCAuLi5hcmcgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlcy5wdXNoKGFyZyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlcy5sZW5ndGgpIHtcbiAgICAgIHN0ciA9IHZzcHJpbnRmKHN0ciwgdmFsdWVzKTtcbiAgICB9XG5cbiAgICBpZiAoT2JqZWN0LnZhbHVlcyhyZXBsYWNlbWVudHMpLmxlbmd0aCkge1xuICAgICAgZm9yIChjb25zdCBrZXkgaW4gcmVwbGFjZW1lbnRzKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IHJlcGxhY2VtZW50c1trZXldO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICB2YWx1ZSA9IHZhbHVlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShuZXcgUmVnRXhwKCc6JyArIGtleSwgJ2cnKSwgU3RyaW5nKHZhbHVlKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0cjtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kIHRleHQuXG4gICAqL1xuICBnZXQoaWQ6IHN0cmluZyk6IHN0cmluZyB8IG51bGwge1xuICAgIGNvbnN0IHN0cmluZ3MgPSB0aGlzLmdldFN0cmluZ3MoKTtcblxuICAgIGlmIChzdHJpbmdzW2lkXSkge1xuICAgICAgcmV0dXJuIHN0cmluZ3NbaWRdO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEhhcyBsYW5ndWFnZSBrZXkuXG4gICAqL1xuICBoYXMoa2V5OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBjb25zdCBzdHJpbmdzID0gdGhpcy5nZXRTdHJpbmdzKCk7XG5cbiAgICByZXR1cm4gc3RyaW5nc1trZXldICE9PSB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGxhbmd1YWdlIGtleS5cbiAgICovXG4gIGFkZChrZXk6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IHRoaXMge1xuICAgIGNvbnN0IHN0cmluZ3MgPSB0aGlzLmdldFN0cmluZ3MoKTtcblxuICAgIHN0cmluZ3NbdGhpcy5ub3JtYWxpemUoa2V5KV0gPSB2YWx1ZTtcblxuICAgIGRhdGEoJ3VuaWNvcm4ubGFuZ3VhZ2VzJywgc3RyaW5ncyk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXBsYWNlIGFsbCBzeW1ib2xzIHRvIGRvdCguKS5cbiAgICovXG4gIHByb3RlY3RlZCBub3JtYWxpemUodGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9bXkEtWjAtOV0rL2lnLCAnLicpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHdyYXBEZWJ1Zyh0ZXh0OiBzdHJpbmcsIHN1Y2Nlc3M6IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgIGlmIChpc0RlYnVnKCkpIHtcbiAgICAgIGlmIChzdWNjZXNzKSB7XG4gICAgICAgIHJldHVybiAnKionICsgdGV4dCArICcqKic7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAnPz8nICsgdGV4dCArICc/Pyc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRleHQ7XG4gIH1cblxuICBnZXRTdHJpbmdzKCk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4ge1xuICAgIHJldHVybiBkYXRhKCd1bmljb3JuLmxhbmd1YWdlcycpIHx8IHt9O1xuICB9XG59XG4iLCJpbXBvcnQgeyBEaWN0aW9uYXJ5IH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgaW5qZWN0Q3NzVG9Eb2N1bWVudCB9IGZyb20gJy4vJztcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZVNjcmlwdEltcG9ydChzcmM6IHN0cmluZywgYXR0cnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fSk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgc2NyaXB0LnNyYyA9IHNyYztcblxuICBmb3IgKGNvbnN0IGtleSBpbiBhdHRycykge1xuICAgIHNjcmlwdC5zZXRBdHRyaWJ1dGUoa2V5LCBhdHRyc1trZXldKTtcbiAgfVxuXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgc2NyaXB0Lm9ubG9hZCA9ICgpID0+IHtcbiAgICAgIHJlc29sdmUoKTtcbiAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcbiAgICB9O1xuICAgIHNjcmlwdC5vbmVycm9yID0gKGUpID0+IHtcbiAgICAgIHJlamVjdChlKTtcbiAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcbiAgICB9O1xuXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRvSW1wb3J0PFQgPSBhbnk+KHNyYzogc3RyaW5nKTogUHJvbWlzZTxUPiB7XG4gIHJldHVybiBpbXBvcnQoLyogQHZpdGUtaWdub3JlICovc3JjKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUltcG9ydCguLi5zcmM6IGFueVtdKTogUHJvbWlzZTxhbnk+O1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUltcG9ydDxUIGV4dGVuZHMgYW55W10+KC4uLnNyYzogc3RyaW5nW10pOiBQcm9taXNlPFQ+O1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUltcG9ydDxUID0gYW55PihzcmM6IHN0cmluZyk6IFByb21pc2U8eyBkZWZhdWx0OiBUIH0+O1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUltcG9ydDxEID0gYW55LCBDID0gYW55PihzcmM6IHN0cmluZyk6IFByb21pc2U8eyBkZWZhdWx0OiBEIH0gJiBEaWN0aW9uYXJ5PEM+PjtcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VJbXBvcnQoLi4uc3JjOiBhbnlbXSk6IFByb21pc2U8YW55PiB7XG4gIGlmIChzcmMubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIGRvSW1wb3J0KHNyY1swXSk7XG4gIH1cblxuICBjb25zdCBwcm9taXNlczogUHJvbWlzZTxhbnk+W10gPSBbXTtcblxuICBzcmMuZm9yRWFjaCgobGluaykgPT4ge1xuICAgIHByb21pc2VzLnB1c2goXG4gICAgICBsaW5rIGluc3RhbmNlb2YgUHJvbWlzZSA/IGxpbmsgOiBkb0ltcG9ydChsaW5rKVxuICAgICk7XG4gIH0pO1xuXG4gIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VTZXJpZXNJbXBvcnQoLi4uc3JjOiBhbnlbXSk6IFByb21pc2U8YW55PjtcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VTZXJpZXNJbXBvcnQ8VCBleHRlbmRzIGFueVtdPiguLi5zcmM6IHN0cmluZ1tdKTogUHJvbWlzZTxUPjtcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VTZXJpZXNJbXBvcnQ8VCA9IGFueT4oc3JjOiBzdHJpbmcpOiBQcm9taXNlPHsgZGVmYXVsdDogVCB9PjtcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VTZXJpZXNJbXBvcnQ8RCA9IGFueSwgQyA9IGFueT4oc3JjOiBzdHJpbmcpOiBQcm9taXNlPHsgZGVmYXVsdDogRCB9ICYgRGljdGlvbmFyeTxDPj47XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlU2VyaWVzSW1wb3J0KC4uLnNyYzogYW55W10pOiBQcm9taXNlPGFueT4ge1xuICBjb25zdCBtb2R1bGVzOiBhbnlbXSA9IFtdO1xuXG4gIGZvciAoY29uc3Qgc291cmNlIG9mIHNyYykge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHNvdXJjZSkpIHtcbiAgICAgIGNvbnN0IG0gPSBhd2FpdCB1c2VJbXBvcnQoLi4uc291cmNlKTtcbiAgICAgIG1vZHVsZXMucHVzaChtKTtcblxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3QgbSA9IGF3YWl0IHVzZUltcG9ydChzb3VyY2UpO1xuXG4gICAgbW9kdWxlcy5wdXNoKG0pO1xuICB9XG5cbiAgcmV0dXJuIG1vZHVsZXM7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VDc3NJbmNsdWRlcyguLi5ocmVmczogc3RyaW5nW10pOiBQcm9taXNlPHZvaWRbXT4ge1xuICBjb25zdCBwcm9taXNlcyA9IGhyZWZzLm1hcCgoaHJlZikgPT4ge1xuICAgIGhyZWYgPSByZXNvbHZlVXJsKGhyZWYpO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW5rJyk7XG4gICAgICBsaW5rLnJlbCA9ICdzdHlsZXNoZWV0JztcbiAgICAgIGxpbmsuaHJlZiA9IGhyZWY7XG4gICAgICBsaW5rLm9ubG9hZCA9ICgpID0+IHJlc29sdmUoKTtcbiAgICAgIGxpbmsub25lcnJvciA9IChlKSA9PiByZWplY3QoZSk7XG5cbiAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQobGluayk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG59XG5cbmNvbnN0IGltcG9ydGVkU2hlZXRzOiBSZWNvcmQ8c3RyaW5nLCBQcm9taXNlPHsgZGVmYXVsdDogQ1NTU3R5bGVTaGVldCB9Pj4gPSB7fTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUNzc0ltcG9ydCguLi5ocmVmczogc3RyaW5nW10pOiBQcm9taXNlPENTU1N0eWxlU2hlZXRbXT4ge1xuICAvLyBUb2RvOiBVc2UgYHsgYXNzZXJ0OiB7IHR5cGU6IFwiY3NzXCIgfWAgYWZ0ZXIgYWxsIGJyb3dzZXJzIHN1cHBvcnQgaXQuXG4gIGNvbnN0IG1vZHVsZXMgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICBocmVmcy5tYXAoKGhyZWYpID0+IHtcbiAgICAgIGlmICghaW1wb3J0ZWRTaGVldHNbaHJlZl0pIHtcbiAgICAgICAgaW1wb3J0ZWRTaGVldHNbaHJlZl0gPSBzaW11bGF0ZUNzc0ltcG9ydChocmVmKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGltcG9ydGVkU2hlZXRzW2hyZWZdO1xuICAgIH0pXG4gICk7XG4gIGNvbnN0IHN0eWxlcyA9IG1vZHVsZXMubWFwKG1vZHVsZSA9PiBtb2R1bGUuZGVmYXVsdCk7XG5cbiAgcmV0dXJuIGluamVjdENzc1RvRG9jdW1lbnQoLi4uc3R5bGVzKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gc2ltdWxhdGVDc3NJbXBvcnQoaHJlZjogc3RyaW5nKSB7XG4gIGhyZWYgPSByZXNvbHZlVXJsKGhyZWYpO1xuXG4gIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goaHJlZik7XG4gIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byBsb2FkIENTUzogJHtocmVmfWApO1xuICB9XG4gIGNvbnN0IGNzc1RleHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG5cbiAgY29uc3Qgc2hlZXQgPSBuZXcgQ1NTU3R5bGVTaGVldCgpO1xuICBhd2FpdCBzaGVldC5yZXBsYWNlKGNzc1RleHQpO1xuICByZXR1cm4geyBkZWZhdWx0OiBzaGVldCB9O1xufVxuXG5sZXQgaW1wb3J0TWFwOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuXG5mdW5jdGlvbiBwYXJzZUltcG9ydE1hcCgpIHtcbiAgY29uc3QgaW1wb3J0TWFwU2NyaXB0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcignc2NyaXB0W3R5cGU9XCJpbXBvcnRtYXBcIl0nKTtcbiAgaWYgKGltcG9ydE1hcFNjcmlwdCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gSlNPTi5wYXJzZShpbXBvcnRNYXBTY3JpcHQudGV4dENvbnRlbnQgfHwgJ3t9JykuaW1wb3J0cyB8fCB7fTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gcGFyc2UgaW1wb3J0IG1hcDonLCBlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHt9O1xufVxuXG5mdW5jdGlvbiByZXNvbHZlVXJsKHNwZWNpZmllcjogc3RyaW5nKSB7XG4gIGltcG9ydE1hcCA/Pz0gcGFyc2VJbXBvcnRNYXAoKTtcblxuICBmb3IgKGNvbnN0IFtwcmVmaXgsIHRhcmdldF0gb2YgT2JqZWN0LmVudHJpZXMoaW1wb3J0TWFwKSkge1xuICAgIGlmIChzcGVjaWZpZXIgPT09IHByZWZpeCkge1xuICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG4gIH1cblxuICBmb3IgKGNvbnN0IFtwcmVmaXgsIHRhcmdldF0gb2YgT2JqZWN0LmVudHJpZXMoaW1wb3J0TWFwKSkge1xuICAgIGlmIChzcGVjaWZpZXIuc3RhcnRzV2l0aChwcmVmaXgpKSB7XG4gICAgICByZXR1cm4gc3BlY2lmaWVyLnJlcGxhY2UocHJlZml4LCB0YXJnZXQpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3BlY2lmaWVyO1xufVxuIiwiaW1wb3J0IHR5cGUgeyBDaGVja2JveGVzTXVsdGlTZWxlY3QgfSBmcm9tICcuLi9tb2R1bGUvY2hlY2tib3hlcy1tdWx0aS1zZWxlY3QnO1xuaW1wb3J0IHR5cGUgeyBOdWxsYWJsZSB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUNoZWNrYm94ZXNNdWx0aVNlbGVjdCgpOiBQcm9taXNlPGFueT47XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VDaGVja2JveGVzTXVsdGlTZWxlY3QoXG4gIHNlbGVjdG9yPzogTnVsbGFibGU8c3RyaW5nIHwgSFRNTEVsZW1lbnQ+LFxuICBvcHRpb25zPzogUmVjb3JkPHN0cmluZywgYW55PlxuKTogUHJvbWlzZTxDaGVja2JveGVzTXVsdGlTZWxlY3Q+O1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlQ2hlY2tib3hlc011bHRpU2VsZWN0KFxuICBzZWxlY3Rvcj86IE51bGxhYmxlPHN0cmluZyB8IEhUTUxFbGVtZW50PixcbiAgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9XG4pOiBQcm9taXNlPGFueT4ge1xuICBjb25zdCBtID0gYXdhaXQgaW1wb3J0KCcuLi9tb2R1bGUvY2hlY2tib3hlcy1tdWx0aS1zZWxlY3QnKTtcblxuICBpZiAoc2VsZWN0b3IpIHtcbiAgICBtLkNoZWNrYm94ZXNNdWx0aVNlbGVjdC5oYW5kbGUoc2VsZWN0b3IsIG9wdGlvbnMpO1xuICB9XG5cbiAgcmV0dXJuIG07XG59XG4iLCJpbXBvcnQgeyBDYXNjYWRlU2VsZWN0TW9kdWxlIH0gZnJvbSAnLi4vbW9kdWxlL2ZpZWxkLWNhc2NhZGUtc2VsZWN0JztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUZpZWxkQ2FzY2FkZVNlbGVjdCgpOiBQcm9taXNlPENhc2NhZGVTZWxlY3RNb2R1bGU+IHtcbiAgY29uc3QgbW9kdWxlID0gYXdhaXQgaW1wb3J0KCcuLi9tb2R1bGUvZmllbGQtY2FzY2FkZS1zZWxlY3QnKTtcblxuICBhd2FpdCBtb2R1bGUucmVhZHk7XG5cbiAgcmV0dXJuIG1vZHVsZTtcbn1cbiIsImltcG9ydCB7IEZpbGVEcmFnTW9kdWxlIH0gZnJvbSAnLi4vbW9kdWxlL2ZpZWxkLWZpbGUtZHJhZyc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VGaWVsZEZpbGVEcmFnKCk6IFByb21pc2U8RmlsZURyYWdNb2R1bGU+IHtcbiAgY29uc3QgbW9kdWxlID0gYXdhaXQgaW1wb3J0KCcuLi9tb2R1bGUvZmllbGQtZmlsZS1kcmFnJyk7XG5cbiAgYXdhaXQgbW9kdWxlLnJlYWR5O1xuXG4gIHJldHVybiBtb2R1bGU7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gdXNlRmllbGRGbGF0cGlja3IoKTogUHJvbWlzZTxhbnk+IHtcbiAgcmV0dXJuIGltcG9ydCgnLi4vbW9kdWxlL2ZpZWxkLWZsYXRwaWNrcicpO1xufVxuIiwiaW1wb3J0IHR5cGUgeyBNb2RhbFNlbGVjdE1vZHVsZSB9IGZyb20gJy4uL21vZHVsZS9maWVsZC1tb2RhbC1zZWxlY3QnO1xuXG5leHBvcnQgZnVuY3Rpb24gdXNlRmllbGRNb2RhbFNlbGVjdCgpOiBQcm9taXNlPE1vZGFsU2VsZWN0TW9kdWxlPiB7XG4gIC8vIE1vZGFsIHNlbGVjdCBoYXMgbm8gZXhwb3J0cyBub3dcbiAgcmV0dXJuIGltcG9ydCgnLi4vbW9kdWxlL2ZpZWxkLW1vZGFsLXNlbGVjdCcpO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIHVzZUZpZWxkTW9kYWxUcmVlKCkge1xuICBpbXBvcnQoJy4uL21vZHVsZS9maWVsZC1tb2RhbC10cmVlJyk7XG59XG4iLCJpbXBvcnQgeyBSZXBlYXRhYmxlTW9kdWxlIH0gZnJvbSAnLi4vbW9kdWxlL2ZpZWxkLXJlcGVhdGFibGUnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlRmllbGRSZXBlYXRhYmxlKCk6IFByb21pc2U8UmVwZWF0YWJsZU1vZHVsZT4ge1xuICBjb25zdCBtb2R1bGUgPSBhd2FpdCBpbXBvcnQoJy4uL21vZHVsZS9maWVsZC1yZXBlYXRhYmxlJyk7XG5cbiAgYXdhaXQgbW9kdWxlLnJlYWR5O1xuXG4gIHJldHVybiBtb2R1bGU7XG59XG4iLCJpbXBvcnQgeyBTaW5nbGVJbWFnZURyYWdNb2R1bGUgfSBmcm9tICcuLi9tb2R1bGUvZmllbGQtc2luZ2xlLWltYWdlLWRyYWcnO1xuXG5leHBvcnQgZnVuY3Rpb24gdXNlRmllbGRTaW5nbGVJbWFnZURyYWcoKTogUHJvbWlzZTxTaW5nbGVJbWFnZURyYWdNb2R1bGU+IHtcbiAgcmV0dXJuIGltcG9ydCgnLi4vbW9kdWxlL2ZpZWxkLXNpbmdsZS1pbWFnZS1kcmFnJyk7XG59XG4iLCJpbXBvcnQgdHlwZSB7IFVuaWNvcm5Gb3JtRWxlbWVudCB9IGZyb20gJy4uL21vZHVsZS9mb3JtJztcbmltcG9ydCB7IHNlbGVjdE9uZSwgbW9kdWxlIH0gZnJvbSAnLi4vc2VydmljZSc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VGb3JtKGVsZT86IHN0cmluZyB8IEVsZW1lbnQsIG9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fSk6IFByb21pc2U8VW5pY29ybkZvcm1FbGVtZW50IHwgbnVsbD4ge1xuICBjb25zdCB7IFVuaWNvcm5Gb3JtRWxlbWVudCB9ID0gYXdhaXQgaW1wb3J0KCcuLi9tb2R1bGUvZm9ybScpO1xuXG4gIGlmIChlbGUgPT0gbnVsbCkge1xuICAgIHJldHVybiBuZXcgVW5pY29ybkZvcm1FbGVtZW50KHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBvcHRpb25zKTtcbiAgfVxuXG4gIGNvbnN0IHNlbGVjdG9yID0gdHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiB1bmRlZmluZWQ7XG4gIGNvbnN0IGVsID0gc2VsZWN0T25lPEhUTUxGb3JtRWxlbWVudD4oZWxlIGFzIHN0cmluZyk7XG5cbiAgaWYgKCFlbCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgRm9ybSBlbGVtZW50IG9mOiAke3NlbGVjdG9yfSBub3QgZm91bmQuYCk7XG4gIH1cblxuICByZXR1cm4gbW9kdWxlKFxuICAgIGVsLFxuICAgICd1bmljb3JuLmZvcm0nLFxuICAgICgpID0+IG5ldyBVbmljb3JuRm9ybUVsZW1lbnQoc2VsZWN0b3IsIGVsLCBvcHRpb25zKVxuICApO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlRm9ybUNvbXBvbmVudChlbGU/OiBzdHJpbmcgfCBFbGVtZW50LCBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge30pIHtcbiAgY29uc3QgZm9ybSA9IGF3YWl0IHVzZUZvcm0oZWxlLCBvcHRpb25zKTtcblxuICBhd2FpdCBmb3JtPy5pbml0Q29tcG9uZW50KCk7XG5cbiAgcmV0dXJuIGZvcm07XG59XG4iLCJpbXBvcnQgdHlwZSB7IFVuaWNvcm5HcmlkRWxlbWVudCB9IGZyb20gJy4uL21vZHVsZS9ncmlkJztcbmltcG9ydCB7IHVzZUZvcm0gfSBmcm9tICcuL3VzZUZvcm0nO1xuaW1wb3J0IHsgc2VsZWN0T25lLCBtb2R1bGUgfSBmcm9tICcuLi9zZXJ2aWNlJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUdyaWQoXG4gIGVsZTogc3RyaW5nIHwgSFRNTEVsZW1lbnQsXG4gIG9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT4gfCB1bmRlZmluZWQgPSB7fVxuKTogUHJvbWlzZTxVbmljb3JuR3JpZEVsZW1lbnQgfCBudWxsPiB7XG4gIGNvbnN0IHsgVW5pY29ybkdyaWRFbGVtZW50IH0gPSBhd2FpdCBpbXBvcnQoJy4uL21vZHVsZS9ncmlkJyk7XG5cbiAgY29uc3Qgc2VsZWN0b3IgPSB0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6ICcnO1xuICBjb25zdCBlbGVtZW50ID0gc2VsZWN0T25lKGVsZSk7XG5cbiAgaWYgKCFlbGVtZW50KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFbGVtZW50IGlzIGVtcHR5Jyk7XG4gIH1cblxuICBjb25zdCBmb3JtID0gYXdhaXQgdXNlRm9ybShzZWxlY3RvciB8fCBlbGVtZW50KTtcblxuICBpZiAoIWZvcm0pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuaWNvcm5HcmlkIGlzIGRlcGVuZHMgb24gVW5pY29ybkZvcm0nKTtcbiAgfVxuXG4gIHJldHVybiBtb2R1bGUoXG4gICAgZWxlbWVudCxcbiAgICAnZ3JpZC5wbHVnaW4nLFxuICAgICgpID0+IG5ldyBVbmljb3JuR3JpZEVsZW1lbnQoc2VsZWN0b3IsIGVsZW1lbnQsIGZvcm0sIG9wdGlvbnMpXG4gICk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VHcmlkQ29tcG9uZW50KFxuICBlbGU6IHN0cmluZyB8IEhUTUxFbGVtZW50LFxuICBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgdW5kZWZpbmVkID0ge31cbik6IFByb21pc2U8VW5pY29ybkdyaWRFbGVtZW50IHwgbnVsbD4ge1xuICBjb25zdCBncmlkID0gYXdhaXQgdXNlR3JpZChlbGUsIG9wdGlvbnMpO1xuXG4gIGF3YWl0IGdyaWQ/LmluaXRDb21wb25lbnQoKTtcblxuICByZXR1cm4gZ3JpZDtcbn1cbiIsImltcG9ydCB0eXBlIHsgVW5pY29ybkh0dHBDbGllbnQgfSBmcm9tICcuLi9tb2R1bGUvaHR0cC1jbGllbnQnO1xuaW1wb3J0IHR5cGUgeyBBeGlvc0luc3RhbmNlLCBDcmVhdGVBeGlvc0RlZmF1bHRzIH0gZnJvbSAnYXhpb3MnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlSHR0cENsaWVudChjb25maWc/OiBDcmVhdGVBeGlvc0RlZmF1bHRzIHwgQXhpb3NJbnN0YW5jZSk6IFByb21pc2U8VW5pY29ybkh0dHBDbGllbnQ+IHtcbiAgY29uc3QgeyBVbmljb3JuSHR0cENsaWVudCB9ID0gYXdhaXQgaW1wb3J0KCcuLi9tb2R1bGUvaHR0cC1jbGllbnQnKTtcblxuICBpZiAoY29uZmlnICYmICdpbnRlcmNlcHRvcnMnIGluIGNvbmZpZykge1xuICAgIGNvbnN0IGF4aW9zID0gY29uZmlnIGFzIEF4aW9zSW5zdGFuY2U7XG5cbiAgICBjb25zdCBodHRwID0gbmV3IFVuaWNvcm5IdHRwQ2xpZW50KCk7XG5cbiAgICBodHRwLmF4aW9zID0gYXhpb3M7XG5cbiAgICByZXR1cm4gaHR0cDtcbiAgfVxuXG4gIHJldHVybiBuZXcgVW5pY29ybkh0dHBDbGllbnQoY29uZmlnIGFzIENyZWF0ZUF4aW9zRGVmYXVsdHMgfCB1bmRlZmluZWQpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlTG9hZGVkSHR0cENsaWVudChjb25maWc/OiBDcmVhdGVBeGlvc0RlZmF1bHRzKTogUHJvbWlzZTxVbmljb3JuSHR0cENsaWVudD4ge1xuICBjb25zdCBodHRwID0gYXdhaXQgdXNlSHR0cENsaWVudChjb25maWcpO1xuXG4gIC8vIExvYWQgYW5kIGNhY2hlIGF4aW9zXG4gIGF3YWl0IGh0dHAuZ2V0QXhpb3NJbnN0YW5jZSgpO1xuXG4gIHJldHVybiBodHRwO1xufVxuIiwiaW1wb3J0IHsgSWZyYW1lTW9kYWxNb2R1bGUgfSBmcm9tICcuLi9tb2R1bGUvaWZyYW1lLW1vZGFsJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUlmcmFtZU1vZGFsKCk6IFByb21pc2U8SWZyYW1lTW9kYWxNb2R1bGU+IHtcbiAgY29uc3QgbW9kdWxlID0gYXdhaXQgaW1wb3J0KCcuLi9tb2R1bGUvaWZyYW1lLW1vZGFsJyk7XG5cbiAgYXdhaXQgbW9kdWxlLnJlYWR5O1xuXG4gIHJldHVybiBtb2R1bGU7XG59XG4iLCJpbXBvcnQgdHlwZSB7IExpc3REZXBlbmRlbnQsIExpc3REZXBlbmRlbnRNb2R1bGUsIExpc3REZXBlbmRlbnRPcHRpb25zIH0gZnJvbSAnLi4vbW9kdWxlL2xpc3QtZGVwZW5kZW50JztcbmltcG9ydCB7IE51bGxhYmxlIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlTGlzdERlcGVuZGVudCgpOiBQcm9taXNlPExpc3REZXBlbmRlbnRNb2R1bGU+O1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUxpc3REZXBlbmRlbnQoXG4gIGVsZW1lbnQ6IHN0cmluZyB8IEhUTUxTZWxlY3RFbGVtZW50LFxuICBkZXBlbmRlbnQ/OiBOdWxsYWJsZTxzdHJpbmcgfCBIVE1MU2VsZWN0RWxlbWVudD4sXG4gIG9wdGlvbnM/OiBQYXJ0aWFsPExpc3REZXBlbmRlbnRPcHRpb25zPlxuKTogUHJvbWlzZTxMaXN0RGVwZW5kZW50PjtcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VMaXN0RGVwZW5kZW50KFxuICBlbGVtZW50PzogTnVsbGFibGU8c3RyaW5nIHwgSFRNTFNlbGVjdEVsZW1lbnQ+LFxuICBkZXBlbmRlbnQ/OiBOdWxsYWJsZTxzdHJpbmcgfCBIVE1MU2VsZWN0RWxlbWVudD4sXG4gIG9wdGlvbnM6IFBhcnRpYWw8TGlzdERlcGVuZGVudE9wdGlvbnM+ID0ge31cbik6IFByb21pc2U8YW55PiB7XG4gIGNvbnN0IG1vZHVsZSA9IGF3YWl0IGltcG9ydCgnLi4vbW9kdWxlL2xpc3QtZGVwZW5kZW50Jyk7XG5cbiAgYXdhaXQgbW9kdWxlLnJlYWR5O1xuXG4gIGlmIChlbGVtZW50KSB7XG4gICAgY29uc3QgeyBMaXN0RGVwZW5kZW50IH0gPSBtb2R1bGU7XG5cbiAgICByZXR1cm4gTGlzdERlcGVuZGVudC5oYW5kbGUoZWxlbWVudCwgZGVwZW5kZW50ID8/IHVuZGVmaW5lZCwgb3B0aW9ucyk7XG4gIH1cblxuICByZXR1cm4gbW9kdWxlO1xufVxuIiwiaW1wb3J0IHsgRGljdGlvbmFyeSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IFRhc2tRdWV1ZSwgcXVldWUgfSBmcm9tICdAbHlyYXNvZnQvdHMtdG9vbGtpdC9nZW5lcmljJztcblxuY29uc3QgcXVldWVzOiBEaWN0aW9uYXJ5PFRhc2tRdWV1ZT4gPSB7fTtcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZVF1ZXVlKG5hbWU6IHN0cmluZyA9ICdkZWZhdWx0JywgbWF4UnVubmluZyA9IDEpOiBUYXNrUXVldWUge1xuICByZXR1cm4gcXVldWVzW25hbWVdID8/PSBjcmVhdGVRdWV1ZShtYXhSdW5uaW5nKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVF1ZXVlKG1heFJ1bm5pbmcgPSAxKTogVGFza1F1ZXVlIHtcbiAgcmV0dXJuIHF1ZXVlKG1heFJ1bm5pbmcpO1xufVxuXG4iLCJpbXBvcnQge1xuICBTM011bHRpcGFydFVwbG9hZGVyLFxuICBTM011bHRpcGFydFVwbG9hZGVyTW9kdWxlLFxuICBTM011bHRpcGFydFVwbG9hZGVyT3B0aW9uc1xufSBmcm9tICcuLi9tb2R1bGUvczMtbXVsdGlwYXJ0LXVwbG9hZGVyJztcbmltcG9ydCB0eXBlIHsgUzNVcGxvYWRlciwgUzNVcGxvYWRlckdsb2JhbE9wdGlvbnMsIFMzVXBsb2FkZXJNb2R1bGUgfSBmcm9tICcuLi9tb2R1bGUvczMtdXBsb2FkZXInO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlUzNVcGxvYWRlcigpOiBQcm9taXNlPFMzVXBsb2FkZXJNb2R1bGU+O1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZVMzVXBsb2FkZXIobmFtZTogc3RyaW5nLCBvcHRpb25zPzogUGFydGlhbDxTM1VwbG9hZGVyR2xvYmFsT3B0aW9ucz4pOiBQcm9taXNlPFMzVXBsb2FkZXI+O1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZVMzVXBsb2FkZXIobmFtZT86IHN0cmluZywgb3B0aW9uczogUGFydGlhbDxTM1VwbG9hZGVyR2xvYmFsT3B0aW9ucz4gPSB7fSk6IFByb21pc2U8YW55PiB7XG4gIGNvbnN0IG1vZHVsZSA9IGF3YWl0IGltcG9ydCgnLi4vbW9kdWxlL3MzLXVwbG9hZGVyJyk7XG5cbiAgaWYgKCFuYW1lKSB7XG4gICAgcmV0dXJuIG1vZHVsZTtcbiAgfVxuXG4gIGNvbnN0IHsgZ2V0IH0gPSBtb2R1bGU7XG5cbiAgcmV0dXJuIGdldChuYW1lLCBvcHRpb25zKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZVMzTXVsdGlwYXJ0VXBsb2FkZXIoKTogUHJvbWlzZTxTM011bHRpcGFydFVwbG9hZGVyTW9kdWxlPjtcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VTM011bHRpcGFydFVwbG9hZGVyKG9wdGlvbnM6IFBhcnRpYWw8UzNNdWx0aXBhcnRVcGxvYWRlck9wdGlvbnM+KTogUHJvbWlzZTxTM011bHRpcGFydFVwbG9hZGVyPjtcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VTM011bHRpcGFydFVwbG9hZGVyKG9wdGlvbnM/OiBQYXJ0aWFsPFMzTXVsdGlwYXJ0VXBsb2FkZXJPcHRpb25zPik6IFByb21pc2U8YW55PiB7XG4gIGNvbnN0IG1vZHVsZSA9IGF3YWl0IGltcG9ydCgnLi4vbW9kdWxlL3MzLW11bHRpcGFydC11cGxvYWRlcicpO1xuXG4gIGlmIChvcHRpb25zICE9IG51bGwpIHtcbiAgICByZXR1cm4gbmV3IG1vZHVsZS5TM011bHRpcGFydFVwbG9hZGVyKG9wdGlvbnMpO1xuICB9XG5cbiAgcmV0dXJuIG1vZHVsZTtcbn1cbiIsImltcG9ydCB7IFNob3dPbk1vZHVsZSB9IGZyb20gJy4uL21vZHVsZS9zaG93LW9uJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZVNob3dPbigpOiBQcm9taXNlPFNob3dPbk1vZHVsZT4ge1xuICBjb25zdCBtb2R1bGUgPSBhd2FpdCBpbXBvcnQoJy4uL21vZHVsZS9zaG93LW9uJyk7XG5cbiAgYXdhaXQgbW9kdWxlLnJlYWR5O1xuXG4gIHJldHVybiBtb2R1bGU7XG59XG4iLCJcbmltcG9ydCB7IERpY3Rpb25hcnkgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBTdGFjaywgc3RhY2sgfSBmcm9tICdAbHlyYXNvZnQvdHMtdG9vbGtpdC9nZW5lcmljJztcblxuY29uc3Qgc3RhY2tzOiBEaWN0aW9uYXJ5PFN0YWNrPiA9IHt9O1xuXG5leHBvcnQgZnVuY3Rpb24gdXNlU3RhY2s8VCA9IGFueT4obmFtZTogc3RyaW5nID0gJ2RlZmF1bHQnLCBzdG9yZTogYW55W10gPSBbXSk6IFN0YWNrPFQ+IHtcbiAgcmV0dXJuIHN0YWNrc1tuYW1lXSA/Pz0gY3JlYXRlU3RhY2s8VD4oc3RvcmUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU3RhY2s8VCA9IGFueT4oc3RvcmU6IGFueVtdID0gW10pOiBTdGFjazxUPiB7XG4gIHJldHVybiBzdGFjazxUPihzdG9yZSk7XG59XG4iLCJpbXBvcnQgeyBtb2R1bGUsIHVzZUNzc0ltcG9ydCwgdXNlQ3NzSW5jbHVkZXMsIHVzZUltcG9ydCwgd2FpdCB9IGZyb20gJy4uL3NlcnZpY2UnO1xuaW1wb3J0IHR5cGUgeyBOdWxsYWJsZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IG1lcmdlRGVlcCB9IGZyb20gJy4uL3V0aWxpdGllcyc7XG5cbi8qKlxuICogQHNlZSBodHRwczovL3RvbS1zZWxlY3QuanMub3JnL1xuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlVG9tU2VsZWN0KFxuICBzZWxlY3Rvcj86IE51bGxhYmxlPHN0cmluZyB8IEhUTUxFbGVtZW50IHwgTm9kZUxpc3RPZjxIVE1MRWxlbWVudD4+LFxuICBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge30sXG4gIHRoZW1lOiBzdHJpbmcgPSAnYm9vdHN0cmFwNSdcbikge1xuICBjb25zdCBbbV0gPSBhd2FpdCB3YWl0KFxuICAgIHVzZUltcG9ydCgnQHZlbmRvci90b20tc2VsZWN0L2Rpc3QvanMvdG9tLXNlbGVjdC5jb21wbGV0ZS5taW4uanMnKSxcbiAgICB1c2VDc3NJbXBvcnQoYEB2ZW5kb3IvdG9tLXNlbGVjdC9kaXN0L2Nzcy90b20tc2VsZWN0LiR7dGhlbWV9Lm1pbi5jc3NgKVxuICApO1xuXG4gIGlmIChzZWxlY3Rvcikge1xuICAgIG1vZHVsZTxhbnksIEhUTUxTZWxlY3RFbGVtZW50PihcbiAgICAgIHNlbGVjdG9yLFxuICAgICAgJ3RvbS5zZWxlY3QnLFxuICAgICAgKGVsZSkgPT4ge1xuICAgICAgICBvcHRpb25zID0gbWVyZ2VEZWVwKHtcbiAgICAgICAgICBhbGxvd0VtcHR5T3B0aW9uOiB0cnVlLFxuICAgICAgICAgIG1heE9wdGlvbnM6IG51bGwsXG4gICAgICAgICAgcGx1Z2luczoge1xuICAgICAgICAgICAgY2FyZXRfcG9zaXRpb246IHt9LFxuICAgICAgICAgICAgY2xlYXJfYnV0dG9uOiB7fSxcbiAgICAgICAgICB9XG4gICAgICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgICAgIGlmICgoZWxlIGFzIEhUTUxTZWxlY3RFbGVtZW50KS5tdWx0aXBsZSkge1xuICAgICAgICAgIG9wdGlvbnMucGx1Z2lucy5yZW1vdmVfYnV0dG9uID0ge307XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb3B0aW9ucy5wbHVnaW5zLmRyb3Bkb3duX2lucHV0ID0ge307XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBdXRvIHNlbGVjdCBmaXJzdCBpZiBvcHRpb25zIGNoYW5nZWQuXG4gICAgICAgIC8vIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL29yY2hpZGpzL3RvbS1zZWxlY3QvaXNzdWVzLzM2MlxuICAgICAgICBjbGFzcyBVbmljb3JuVG9tU2VsZWN0IGV4dGVuZHMgVG9tU2VsZWN0IHtcbiAgICAgICAgICBzeW5jT3B0aW9uc1dpdGhvdXRLZWVwU2VsZWN0ZWQoKSB7XG4gICAgICAgICAgICBjb25zdCBvbGRWYWx1ZSA9IGVsZS52YWx1ZTtcblxuICAgICAgICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgICAgICAgdGhpcy5jbGVhck9wdGlvbnMoKTtcbiAgICAgICAgICAgIHRoaXMuc3luYygpO1xuXG4gICAgICAgICAgICBpZiAoZWxlLnZhbHVlICE9PSBvbGRWYWx1ZSkge1xuICAgICAgICAgICAgICB0aGlzLnNldFZhbHVlKFxuICAgICAgICAgICAgICAgIGVsZS5xdWVyeVNlbGVjdG9yPEhUTUxPcHRpb25FbGVtZW50Pihgb3B0aW9uW3ZhbHVlPVwiJHtvbGRWYWx1ZX1cIl1gKT8udmFsdWVcbiAgICAgICAgICAgICAgICA/PyBlbGUucXVlcnlTZWxlY3RvcjxIVE1MT3B0aW9uRWxlbWVudD4oJ29wdGlvbicpPy52YWx1ZVxuICAgICAgICAgICAgICAgID8/ICcnLFxuICAgICAgICAgICAgICAgIHRydWVcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGNvbnN0IHQgPSBuZXcgVW5pY29yblRvbVNlbGVjdChlbGUgYXMgVG9tSW5wdXQsIG9wdGlvbnMpO1xuXG4gICAgICAgIGVsZS5hZGRFdmVudExpc3RlbmVyKCdsaXN0OnVwZGF0ZWQnLCAoKSA9PiB7XG4gICAgICAgICAgdC5zeW5jT3B0aW9uc1dpdGhvdXRLZWVwU2VsZWN0ZWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiBtO1xufVxuIiwiaW1wb3J0IHR5cGUgeyBUb29sdGlwIH0gZnJvbSAnYm9vdHN0cmFwJztcbmltcG9ydCB7IEJ1dHRvblJhZGlvT3B0aW9ucyB9IGZyb20gJy4uL2Jvb3RzdHJhcC9idXR0b24tcmFkaW8nO1xuaW1wb3J0IHR5cGUgeyBLZWVwVGFiT3B0aW9ucyB9IGZyb20gJy4uL2Jvb3RzdHJhcC9rZWVwLXRhYic7XG5pbXBvcnQgdHlwZSB7IFVJQm9vdHN0cmFwNSB9IGZyb20gJy4uL21vZHVsZS91aS1ib290c3RyYXA1JztcbmltcG9ydCB7IHVzZVVJVGhlbWUgfSBmcm9tICcuLi9zZXJ2aWNlJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZVVJQm9vdHN0cmFwNShpbnN0YWxsID0gZmFsc2UsIHB1c2hUb0dsb2JhbCA9IGZhbHNlKTogUHJvbWlzZTxVSUJvb3RzdHJhcDU+IHtcbiAgY29uc3QgeyBVSUJvb3RzdHJhcDUgfSA9IGF3YWl0IGltcG9ydCgnLi4vbW9kdWxlL3VpLWJvb3RzdHJhcDUnKTtcblxuICBjb25zdCB0aGVtZSA9IFVJQm9vdHN0cmFwNS5nZXQoKTtcblxuICBpZiAoaW5zdGFsbCkge1xuICAgIHVzZVVJVGhlbWUodGhlbWUpO1xuXG4gICAgaWYgKHB1c2hUb0dsb2JhbCkge1xuICAgICAgdGhlbWUucHVzaEJvb3RzdHJhcFRvR2xvYmFsKCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoZW1lO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlQnM1VG9vbHRpcChcbiAgc2VsZWN0b3I6IE5vZGVMaXN0T2Y8RWxlbWVudD4gfCBFbGVtZW50IHwgc3RyaW5nID0gJ1tkYXRhLWJzLXRvZ2dsZT1cInRvb2x0aXBcIl0nLFxuICBjb25maWc6IFBhcnRpYWw8VG9vbHRpcC5PcHRpb25zPiA9IHt9XG4pOiBQcm9taXNlPFRvb2x0aXBbXT4ge1xuICBjb25zdCBiczUgPSBhd2FpdCB1c2VVSUJvb3RzdHJhcDUoKTtcblxuICByZXR1cm4gYnM1LnRvb2x0aXAoc2VsZWN0b3IsIGNvbmZpZyk7XG59XG5cbmV4cG9ydCBjb25zdCB1c2VCczVLZWVwVGFiOiB0eXBlb2YgVUlCb290c3RyYXA1LnByb3RvdHlwZS5rZWVwVGFiID0gYXN5bmMgKFxuICBzZWxlY3Rvcj86IHN0cmluZyB8IEhUTUxFbGVtZW50LFxuICBvcHRpb25zOiBLZWVwVGFiT3B0aW9ucyA9IHt9XG4pOiBQcm9taXNlPGFueT4gPT4ge1xuICBjb25zdCBiczUgPSBhd2FpdCB1c2VVSUJvb3RzdHJhcDUoKTtcblxuICByZXR1cm4gYnM1LmtlZXBUYWIoc2VsZWN0b3IsIG9wdGlvbnMpO1xufTtcblxuZXhwb3J0IGNvbnN0IHVzZUJzNUJ1dHRvblJhZGlvOiB0eXBlb2YgVUlCb290c3RyYXA1LnByb3RvdHlwZS5idXR0b25SYWRpbyA9IGFzeW5jIChcbiAgc2VsZWN0b3I/OiBzdHJpbmcgfCBIVE1MRWxlbWVudCxcbiAgb3B0aW9uczogQnV0dG9uUmFkaW9PcHRpb25zID0ge31cbik6IFByb21pc2U8YW55PiA9PiB7XG4gIGNvbnN0IGJzNSA9IGF3YWl0IHVzZVVJQm9vdHN0cmFwNSgpO1xuXG4gIHJldHVybiBiczUuYnV0dG9uUmFkaW8oc2VsZWN0b3IsIG9wdGlvbnMpO1xufTtcbiIsImltcG9ydCB7IERpY3Rpb25hcnkgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgdHlwZSB7IGRlZmF1bHQgYXMgV2ViRGlyZWN0aXZlIH0gZnJvbSAnd2ViLWRpcmVjdGl2ZSc7XG5pbXBvcnQgdHlwZSB7IFdlYkRpcmVjdGl2ZUhhbmRsZXIsIFdlYkRpcmVjdGl2ZU9wdGlvbnMgfSBmcm9tICd3ZWItZGlyZWN0aXZlL3NyYy90eXBlcyc7XG5cbmxldCBpbnN0YW5jZXM6IERpY3Rpb25hcnk8V2ViRGlyZWN0aXZlPiA9IHt9O1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlV2ViRGlyZWN0aXZlKFxuICBuYW1lOiBzdHJpbmcgPSAndW5pY29ybicsXG4gIG9wdGlvbnM6IFBhcnRpYWw8V2ViRGlyZWN0aXZlT3B0aW9ucz4gPSB7fVxuKTogUHJvbWlzZTxXZWJEaXJlY3RpdmU+IHtcbiAgcmV0dXJuIGluc3RhbmNlc1tuYW1lXSA/Pz0gYXdhaXQgY3JlYXRlV2ViRGlyZWN0aXZlKE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHsgcHJlZml4OiAndW5pLScgfSkpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlVW5pRGlyZWN0aXZlPFQgZXh0ZW5kcyBFbGVtZW50ID0gSFRNTEVsZW1lbnQ+KFxuICBuYW1lOiBzdHJpbmcsXG4gIGhhbmRsZXI6IFdlYkRpcmVjdGl2ZUhhbmRsZXI8VD4sXG4gIHdkSW5zdGFuY2U6IFdlYkRpcmVjdGl2ZSB8IHN0cmluZyA9ICd1bmljb3JuJ1xuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHdkID0gdHlwZW9mIHdkSW5zdGFuY2UgPT09ICdzdHJpbmcnID8gYXdhaXQgdXNlV2ViRGlyZWN0aXZlKHdkSW5zdGFuY2UpIDogd2RJbnN0YW5jZTtcblxuICAvLyBUb2RvOiBTaG91bGQgZml4IHdlYi1kaXJlY3RpdmUgdHlwZXNcbiAgd2QucmVnaXN0ZXIobmFtZSwgaGFuZGxlciBhcyBXZWJEaXJlY3RpdmVIYW5kbGVyPGFueT4pO1xufVxuXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVXZWJEaXJlY3RpdmUob3B0aW9uczogUGFydGlhbDxXZWJEaXJlY3RpdmVPcHRpb25zPiA9IHt9KTogUHJvbWlzZTxXZWJEaXJlY3RpdmU+IHtcbiAgY29uc3QgV2ViRGlyZWN0aXZlID0gKGF3YWl0IGltcG9ydCgnd2ViLWRpcmVjdGl2ZScpKS5kZWZhdWx0O1xuXG4gIGNvbnN0IHdkID0gbmV3IFdlYkRpcmVjdGl2ZShvcHRpb25zKTtcbiAgd2QubGlzdGVuKCk7XG5cbiAgcmV0dXJuIHdkO1xufVxuIiwiaW1wb3J0IHR5cGUge1xuICBVbmljb3JuRmllbGRWYWxpZGF0aW9uLFxuICBVbmljb3JuRm9ybVZhbGlkYXRpb24sXG4gIFZhbGlkYXRpb25IYW5kbGVyLFxuICBWYWxpZGF0aW9uTW9kdWxlXG59IGZyb20gJy4uL21vZHVsZS92YWxpZGF0aW9uJztcbmltcG9ydCB7IGdldEJvdW5kZWRJbnN0YW5jZSB9IGZyb20gJy4uL3NlcnZpY2UnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlRm9ybVZhbGlkYXRpb24oKTogUHJvbWlzZTxWYWxpZGF0aW9uTW9kdWxlPjtcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VGb3JtVmFsaWRhdGlvbihzZWxlY3Rvcjogc3RyaW5nIHwgRWxlbWVudCk6IFByb21pc2U8VW5pY29ybkZvcm1WYWxpZGF0aW9uIHwgbnVsbD47XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlRm9ybVZhbGlkYXRpb24oc2VsZWN0b3I/OiBzdHJpbmcgfCBFbGVtZW50KTogUHJvbWlzZTxhbnk+IHtcbiAgY29uc3QgbW9kdWxlID0gYXdhaXQgaW1wb3J0KCcuLi9tb2R1bGUvdmFsaWRhdGlvbicpO1xuXG4gIGF3YWl0IG1vZHVsZS5yZWFkeTtcblxuICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIG1vZHVsZTtcbiAgfVxuXG4gIHJldHVybiB1c2VGb3JtVmFsaWRhdGlvblN5bmMoc2VsZWN0b3IpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXNlRm9ybVZhbGlkYXRpb25TeW5jKHNlbGVjdG9yOiBzdHJpbmcgfCBFbGVtZW50KTogVW5pY29ybkZvcm1WYWxpZGF0aW9uIHwgbnVsbCB7XG4gIHJldHVybiBnZXRCb3VuZGVkSW5zdGFuY2U8VW5pY29ybkZvcm1WYWxpZGF0aW9uPihzZWxlY3RvciwgJ2Zvcm0udmFsaWRhdGlvbicpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXNlRmllbGRWYWxpZGF0aW9uU3luYyhzZWxlY3Rvcjogc3RyaW5nIHwgRWxlbWVudCk6IFVuaWNvcm5GaWVsZFZhbGlkYXRpb24gfCBudWxsIHtcbiAgcmV0dXJuIGdldEJvdW5kZWRJbnN0YW5jZTxVbmljb3JuRmllbGRWYWxpZGF0aW9uPihzZWxlY3RvciwgJ2ZpZWxkLnZhbGlkYXRpb24nKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFkZEdsb2JhbFZhbGlkYXRvcihcbiAgbmFtZTogc3RyaW5nLFxuICB2YWxpZGF0b3I6IFZhbGlkYXRpb25IYW5kbGVyLFxuICBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge31cbik6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCB7IFVuaWNvcm5Gb3JtVmFsaWRhdGlvbiB9ID0gYXdhaXQgdXNlRm9ybVZhbGlkYXRpb24oKTtcblxuICBVbmljb3JuRm9ybVZhbGlkYXRpb24uYWRkR2xvYmFsVmFsaWRhdG9yKG5hbWUsIHZhbGlkYXRvciwgb3B0aW9ucyk7XG59XG4iLCJpbXBvcnQgeyBBbGVydEFkYXB0ZXIsIGRlbGV0ZUNvbmZpcm0sIHNpbXBsZUFsZXJ0LCBzaW1wbGVDb25maXJtIH0gZnJvbSAnQGx5cmFzb2Z0L3RzLXRvb2xraXQvZ2VuZXJpYyc7XG5pbXBvcnQgdHlwZSB7IEFscGluZSBhcyBBbHBpbmVHbG9iYWwgfSBmcm9tICdhbHBpbmVqcyc7XG5pbXBvcnQgdHlwZSB7IGRlZmF1bHQgYXMgU3BlY3RydW1HbG9iYWwgfSBmcm9tICdzcGVjdHJ1bS12YW5pbGxhJztcbmltcG9ydCB0eXBlIHsgU3BlY3RydW1PcHRpb25zIH0gZnJvbSAnc3BlY3RydW0tdmFuaWxsYS9kaXN0L3R5cGVzL3R5cGVzJztcbmltcG9ydCB0eXBlIHsgZGVmYXVsdCBhcyBUb21TZWxlY3RHbG9iYWwgfSBmcm9tICd0b20tc2VsZWN0JztcbmltcG9ydCB7IHVzZVN0YWNrIH0gZnJvbSAnLi4vY29tcG9zYWJsZSc7XG5pbXBvcnQgeyBkYXRhLCByZW1vdmVEYXRhIH0gZnJvbSAnLi4vZGF0YSc7XG5pbXBvcnQgdHlwZSB7IENvbnN0cnVjdG9yLCBNYXliZVByb21pc2UsIE51bGxhYmxlLCBVSVRoZW1lSW50ZXJmYWNlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgYW5pbWF0ZVRvIH0gZnJvbSAnLi9hbmltYXRlJztcbmltcG9ydCB7IGh0bWwsIG1vZHVsZSwgc2VsZWN0QWxsLCBzZWxlY3RPbmUgfSBmcm9tICcuL2RvbSc7XG5pbXBvcnQgeyBuZXh0VGljayB9IGZyb20gJy4vaGVscGVyJztcbmltcG9ydCB7IHVzZUNzc0ltcG9ydCwgdXNlSW1wb3J0IH0gZnJvbSAnLi9sb2FkZXInO1xuXG5sZXQgdWk6IFVuaWNvcm5VSTtcblxuQWxlcnRBZGFwdGVyLmFsZXJ0ID0gKHRpdGxlOiBzdHJpbmcsIHRleHQgPSAnJywgdHlwZSA9ICdpbmZvJyk6IFByb21pc2U8dm9pZD4gPT4ge1xuICBpZiAodGV4dCkge1xuICAgIHRpdGxlICs9ICcgfCAnICsgdGV4dDtcbiAgfVxuXG4gIHdpbmRvdy5hbGVydCh0aXRsZSk7XG5cbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xufTtcblxuQWxlcnRBZGFwdGVyLmNvbmZpcm0gPSAobWVzc2FnZTogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiA9PiB7XG4gIG1lc3NhZ2UgPSBtZXNzYWdlIHx8ICdBcmUgeW91IHN1cmU/JztcblxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICByZXNvbHZlKHdpbmRvdy5jb25maXJtKG1lc3NhZ2UpKTtcbiAgfSk7XG59O1xuXG5BbGVydEFkYXB0ZXIuY29uZmlybVRleHQgPSAoKSA9PiAnT0snO1xuQWxlcnRBZGFwdGVyLmNhbmNlbFRleHQgPSAoKSA9PiAnQ2FuY2VsJztcbkFsZXJ0QWRhcHRlci5kZWxldGVUZXh0ID0gKCkgPT4gJ0RlbGV0ZSc7XG5cbmV4cG9ydCB7IHNpbXBsZUFsZXJ0LCBzaW1wbGVDb25maXJtLCBkZWxldGVDb25maXJtLCBBbGVydEFkYXB0ZXIgfTtcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZVVJKGluc3RhbmNlPzogVW5pY29yblVJKTogVW5pY29yblVJIHtcbiAgaWYgKGluc3RhbmNlKSB7XG4gICAgdWkgPSBpbnN0YW5jZTtcbiAgfVxuXG4gIHJldHVybiB1aSA/Pz0gbmV3IFVuaWNvcm5VSSgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXNlVUlUaGVtZTxUIGV4dGVuZHMgVUlUaGVtZUludGVyZmFjZT4odGhlbWU/OiBUIHwgQ29uc3RydWN0b3I8VD4pOiBUIHtcbiAgY29uc3QgdWkgPSB1c2VVSSgpO1xuXG4gIGlmICh1aS50aGVtZSAmJiAhdGhlbWUpIHtcbiAgICByZXR1cm4gdWkudGhlbWU7XG4gIH1cblxuICBpZiAodHlwZW9mIHRoZW1lID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhlbWUgPSBuZXcgdGhlbWUoKTtcbiAgfVxuXG4gIHVpLmluc3RhbGxUaGVtZSh0aGVtZSk7XG5cbiAgcmV0dXJuIHVpLnRoZW1lO1xufVxuXG5leHBvcnQgY2xhc3MgVW5pY29yblVJIHtcbiAgdGhlbWU/OiBhbnk7XG4gIGFsaXZlSGFuZGxlPzogYW55O1xuXG4gIHN0YXRpYyBnZXQgZGVmYXVsdE9wdGlvbnMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1lc3NhZ2VTZWxlY3RvcjogJy5tZXNzYWdlLXdyYXAnLFxuICAgIH07XG4gIH1cblxuICBpbnN0YWxsVGhlbWUodGhlbWU6IGFueSkge1xuICAgIHRoaXMudGhlbWUgPSB0aGVtZTtcbiAgfVxuXG4gIC8vIGNvbmZpcm0obWVzc2FnZTogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7XG4gIC8vICAgbWVzc2FnZSA9IG1lc3NhZ2UgfHwgJ0FyZSB5b3Ugc3VyZT8nO1xuICAvL1xuICAvLyAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAvLyAgICAgcmVzb2x2ZSh3aW5kb3cuY29uZmlybShtZXNzYWdlKSk7XG4gIC8vICAgfSk7XG4gIC8vIH1cbiAgLy9cbiAgLy8gYWxlcnQodGl0bGU6IHN0cmluZywgdGV4dCA9ICcnLCB0eXBlID0gJ2luZm8nKTogUHJvbWlzZTxib29sZWFuPiB7XG4gIC8vICAgaWYgKHRleHQpIHtcbiAgLy8gICAgIHRpdGxlICs9ICcgfCAnICsgdGV4dDtcbiAgLy8gICB9XG4gIC8vXG4gIC8vICAgd2luZG93LmFsZXJ0KHRpdGxlKTtcbiAgLy9cbiAgLy8gICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuICAvLyB9XG59XG5cbmNvbnN0IHByZXBhcmVzOiBBbHBpbmVQcmVwYXJlQ2FsbGJhY2tbXSA9IFtdO1xudHlwZSBBbHBpbmVQcmVwYXJlQ2FsbGJhY2sgPSAoQWxwaW5lOiBBbHBpbmVHbG9iYWwpID0+IE1heWJlUHJvbWlzZTxhbnk+O1xuY29uc3QgeyBwcm9taXNlOiBhbHBpbmVMb2FkZWQsIHJlc29sdmU6IGFscGluZVJlc29sdmUgfSA9IFByb21pc2Uud2l0aFJlc29sdmVyczxBbHBpbmVHbG9iYWw+KCk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2FkQWxwaW5lKGNhbGxiYWNrPzogTnVsbGFibGU8QWxwaW5lUHJlcGFyZUNhbGxiYWNrPik6IFByb21pc2U8QWxwaW5lR2xvYmFsPiB7XG4gIGlmIChjYWxsYmFjayAmJiAhd2luZG93LkFscGluZSkge1xuICAgIHByZXBhcmVzLnB1c2goY2FsbGJhY2spO1xuICB9XG5cbiAgY29uc3QgeyBkZWZhdWx0OiBBbHBpbmUgfTogeyBkZWZhdWx0OiBBbHBpbmVHbG9iYWwgfSA9IGF3YWl0IHVzZUltcG9ydCgnQGFscGluZWpzJyk7XG5cbiAgaWYgKCF3aW5kb3cuQWxwaW5lKSB7XG4gICAgYXdhaXQgUHJvbWlzZS5hbGwocHJlcGFyZXMubWFwKChjYWxsYmFjaykgPT4gUHJvbWlzZS5yZXNvbHZlKGNhbGxiYWNrKEFscGluZSkpKSk7XG5cbiAgICBBbHBpbmUuc3RhcnQoKTtcblxuICAgIHdpbmRvdy5BbHBpbmUgPSBBbHBpbmU7XG5cbiAgICBhbHBpbmVSZXNvbHZlKEFscGluZSk7XG4gIH0gZWxzZSBpZiAoY2FsbGJhY2spIHtcbiAgICBhd2FpdCBjYWxsYmFjayhBbHBpbmUpO1xuICB9XG5cbiAgcmV0dXJuIEFscGluZTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGluaXRBbHBpbmVDb21wb25lbnQoZGlyZWN0aXZlOiBzdHJpbmcpIHtcbiAgY29uc3QgQWxwaW5lID0gYXdhaXQgYWxwaW5lTG9hZGVkO1xuXG4gIGF3YWl0IG5leHRUaWNrKCk7XG5cbiAgc2VsZWN0QWxsPEhUTUxFbGVtZW50PihgWyR7ZGlyZWN0aXZlfV1gLCAoZWwpID0+IHtcbiAgICBjb25zdCBjb2RlID0gZWwuZ2V0QXR0cmlidXRlKGRpcmVjdGl2ZSkgfHwgJyc7XG4gICAgZWwucmVtb3ZlQXR0cmlidXRlKGRpcmVjdGl2ZSk7XG5cbiAgICAvLyBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbHBpbmVqcy9hbHBpbmUvaXNzdWVzLzM1OSNpc3N1ZWNvbW1lbnQtOTczNjg4NDY0XG4gICAgQWxwaW5lLm11dGF0ZURvbSgoKSA9PiB7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoJ3gtZGF0YScsIGNvZGUpO1xuICAgIH0pO1xuXG4gICAgQWxwaW5lLmluaXRUcmVlKGVsKTtcbiAgfSk7XG59XG5cbi8qKlxuICogQmVmb3JlIEFscGluZSBpbml0XG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwcmVwYXJlQWxwaW5lKGNhbGxiYWNrOiBBbHBpbmVQcmVwYXJlQ2FsbGJhY2spIHtcbiAgaWYgKHdpbmRvdy5BbHBpbmUpIHtcbiAgICBhd2FpdCBjYWxsYmFjayh3aW5kb3cuQWxwaW5lKTtcbiAgfSBlbHNlIHtcbiAgICBwcmVwYXJlcy5wdXNoKGNhbGxiYWNrKTtcbiAgfVxufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHByZXBhcmVBbHBpbmVEZWZlcihjYWxsYmFjazogQWxwaW5lUHJlcGFyZUNhbGxiYWNrKSB7XG4gIGNvbnN0IEFscGluZSA9IGF3YWl0IGFscGluZUxvYWRlZDtcblxuICBhd2FpdCBjYWxsYmFjayh3aW5kb3cuQWxwaW5lKTtcbn1cblxuLyoqXG4gKiBSZW5kZXIgTWVzc2FnZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJNZXNzYWdlKG1lc3NhZ2VzOiBzdHJpbmcgfCBzdHJpbmdbXSwgdHlwZTogc3RyaW5nID0gJ2luZm8nKSB7XG4gIHVpLnRoZW1lLnJlbmRlck1lc3NhZ2UobWVzc2FnZXMsIHR5cGUpO1xufVxuXG4vKipcbiAqIENsZWFyIG1lc3NhZ2VzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY2xlYXJNZXNzYWdlcygpIHtcbiAgdWkudGhlbWUuY2xlYXJNZXNzYWdlcygpO1xufVxuXG4vKipcbiAqIFNob3cgbm90aWZ5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gbm90aWZ5KG1lc3NhZ2VzOiBzdHJpbmcgfCBzdHJpbmdbXSwgdHlwZTogc3RyaW5nID0gJ2luZm8nKSB7XG4gIHVpLnRoZW1lLnJlbmRlck1lc3NhZ2UobWVzc2FnZXMsIHR5cGUpO1xufVxuXG4vKipcbiAqIENsZWFyIG5vdGlmaWVzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY2xlYXJOb3RpZmllcygpIHtcbiAgdWkudGhlbWUuY2xlYXJNZXNzYWdlcygpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWFyayhzZWxlY3Rvcj86IHN0cmluZyB8IEhUTUxFbGVtZW50LCBrZXl3b3JkOiBzdHJpbmcgPSAnJywgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9KSB7XG4gIGNvbnN0IG1vZHVsZXMgPSBhd2FpdCB1c2VJbXBvcnQoJ0B2ZW5kb3IvbWFyay5qcy9kaXN0L21hcmsubWluLmpzJyk7XG5cbiAgaWYgKHNlbGVjdG9yICE9IG51bGwpIHtcbiAgICBjb25zdCBpbnN0YW5jZSA9IG5ldyBNYXJrKHNlbGVjdG9yKTtcbiAgICBpbnN0YW5jZS5tYXJrKGtleXdvcmQsIG9wdGlvbnMpO1xuICB9XG5cbiAgcmV0dXJuIG1vZHVsZXM7XG59XG5cbi8qKlxuICogTXVsdGlwbGUgVXBsb2FkZXJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG11bHRpVXBsb2FkZXIoKTogUHJvbWlzZTxhbnk+IHtcbiAgcmV0dXJuIHVzZUltcG9ydCgnQHVuaWNvcm4vZmllbGQvbXVsdGktdXBsb2FkZXIuanMnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1vZGFsVHJlZSgpOiBQcm9taXNlPGFueT4ge1xuICByZXR1cm4gdXNlSW1wb3J0KCdAdW5pY29ybi9maWVsZC9tb2RhbC10cmVlLmpzJyk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzbGlkZVVwKHRhcmdldDogc3RyaW5nIHwgSFRNTEVsZW1lbnQsIGR1cmF0aW9uOiBudW1iZXIgPSAzMDApOiBQcm9taXNlPEFuaW1hdGlvbiB8IHZvaWQ+IHtcbiAgY29uc3QgZWxlID0gc2VsZWN0T25lKHRhcmdldCk7XG5cbiAgaWYgKCFlbGUpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gIH1cblxuICBlbGUuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcblxuICBjb25zdCBhbmltYXRpb24gPSBhbmltYXRlVG8oXG4gICAgZWxlLFxuICAgIHsgaGVpZ2h0OiAwLCBwYWRkaW5nVG9wOiAwLCBwYWRkaW5nQm90dG9tOiAwIH0sXG4gICAgeyBkdXJhdGlvbiwgZWFzaW5nOiAnZWFzZS1vdXQnIH1cbiAgKTtcblxuICBkYXRhKGVsZSwgJ2FuaW1hdGlvbi5zbGlkaW5nLnVwJywgdHJ1ZSk7XG5cbiAgY29uc3QgciA9IGF3YWl0IGFuaW1hdGlvbi5maW5pc2hlZDtcblxuICBpZiAoIWRhdGEoZWxlLCAnYW5pbWF0aW9uLnNsaWRpbmcuZG93bicpKSB7XG4gICAgZWxlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIH1cblxuICByZW1vdmVEYXRhKGVsZSwgJ2FuaW1hdGlvbi5zbGlkaW5nLnVwJyk7XG5cbiAgcmV0dXJuIHI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzbGlkZURvd24oXG4gIHRhcmdldDogc3RyaW5nIHwgSFRNTEVsZW1lbnQsXG4gIGR1cmF0aW9uOiBudW1iZXIgPSAzMDAsXG4gIGRpc3BsYXk6IHN0cmluZyA9ICdibG9jaycpOiBQcm9taXNlPEFuaW1hdGlvbiB8IHZvaWQ+IHtcbiAgY29uc3QgZWxlID0gc2VsZWN0T25lKHRhcmdldCk7XG5cbiAgaWYgKCFlbGUpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gIH1cblxuICBkYXRhKGVsZSwgJ2FuaW1hdGlvbi5zbGlkaW5nLmRvd24nLCB0cnVlKTtcblxuICBlbGUuc3R5bGUuZGlzcGxheSA9IGRpc3BsYXk7XG5cbi8vIEdldCBoZWlnaHRcbiAgbGV0IG1heEhlaWdodCA9IDA7XG4gIGZvciAoY29uc3QgY2hpbGQgb2YgQXJyYXkuZnJvbShlbGUuY2hpbGRyZW4pIGFzIEhUTUxFbGVtZW50W10pIHtcbiAgICBtYXhIZWlnaHQgPSBNYXRoLm1heChjaGlsZC5vZmZzZXRIZWlnaHQsIG1heEhlaWdodCk7XG4gIH1cblxuICBjb25zdCBhbmltYXRpb24gPSBhbmltYXRlVG8oXG4gICAgZWxlLFxuICAgIHtcbiAgICAgIGhlaWdodDogW1xuICAgICAgICAwLFxuICAgICAgICBtYXhIZWlnaHQgKyAncHgnXG4gICAgICBdXG4gICAgfSxcbiAgICB7IGR1cmF0aW9uLCBlYXNpbmc6ICdlYXNlLW91dCcgfVxuICApO1xuXG4gIGFuaW1hdGlvbi5hZGRFdmVudExpc3RlbmVyKCdmaW5pc2gnLCAoKSA9PiB7XG4gICAgZWxlLnN0eWxlLmhlaWdodCA9ICcnO1xuXG4gICAgaWYgKCFkYXRhKGVsZSwgJ2FuaW1hdGlvbi5zbGlkaW5nLnVwJykpIHtcbiAgICAgIGVsZS5zdHlsZS5vdmVyZmxvdyA9ICd2aXNpYmxlJztcbiAgICB9XG5cbiAgICByZW1vdmVEYXRhKGVsZSwgJ2FuaW1hdGlvbi5zbGlkaW5nLmRvd24nKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGFuaW1hdGlvbi5maW5pc2hlZDtcbn1cblxuLyoqXG4gKiBzbGlkZVRvZ2dsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2xpZGVUb2dnbGUoXG4gIHRhcmdldDogc3RyaW5nIHwgSFRNTEVsZW1lbnQsXG4gIGR1cmF0aW9uOiBudW1iZXIgPSA1MDAsXG4gIGRpc3BsYXk6IHN0cmluZyA9ICdibG9jaycpOiBQcm9taXNlPEFuaW1hdGlvbiB8IHZvaWQ+IHtcbiAgY29uc3QgZWxlID0gc2VsZWN0T25lKHRhcmdldCk7XG5cbiAgaWYgKCFlbGUpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gIH1cblxuICBpZiAod2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlKS5kaXNwbGF5ID09PSAnbm9uZScpIHtcbiAgICByZXR1cm4gc2xpZGVEb3duKGVsZSwgZHVyYXRpb24sIGRpc3BsYXkpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzbGlkZVVwKGVsZSwgZHVyYXRpb24pO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmYWRlT3V0KHNlbGVjdG9yOiBzdHJpbmcgfCBIVE1MRWxlbWVudCwgZHVyYXRpb246IG51bWJlciA9IDUwMCk6IFByb21pc2U8QW5pbWF0aW9uIHwgdm9pZD4ge1xuICBjb25zdCBlbCA9IHNlbGVjdE9uZShzZWxlY3Rvcik7XG5cbiAgaWYgKCFlbCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGFuaW1hdGlvbiA9IGFuaW1hdGVUbyhlbCwgeyBvcGFjaXR5OiAwIH0sIHsgZHVyYXRpb24sIGVhc2luZzogJ2Vhc2Utb3V0JyB9KTtcblxuICBjb25zdCBwID0gYXdhaXQgYW5pbWF0aW9uLmZpbmlzaGVkO1xuICBlbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXG4gIHJldHVybiBwO1xufTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZhZGVJbihcbiAgc2VsZWN0b3I6IHN0cmluZyB8IEhUTUxFbGVtZW50LFxuICBkdXJhdGlvbjogbnVtYmVyID0gNTAwLFxuICBkaXNwbGF5OiBzdHJpbmcgPSAnYmxvY2snXG4pOiBQcm9taXNlPEFuaW1hdGlvbiB8IHZvaWQ+IHtcbiAgY29uc3QgZWwgPSBzZWxlY3RPbmUoc2VsZWN0b3IpO1xuXG4gIGlmICghZWwpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBlbC5zdHlsZS5kaXNwbGF5ID0gJyc7XG5cbiAgaWYgKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKS5kaXNwbGF5ICE9PSBkaXNwbGF5KSB7XG4gICAgZWwuc3R5bGUuZGlzcGxheSA9IGRpc3BsYXk7XG4gIH1cblxuICBjb25zdCBhbmltYXRpb24gPSBhbmltYXRlVG8oZWwsIHsgb3BhY2l0eTogMSB9LCB7IGR1cmF0aW9uLCBlYXNpbmc6ICdlYXNlLW91dCcgfSk7XG5cbiAgcmV0dXJuIGFuaW1hdGlvbi5maW5pc2hlZDtcbn07XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoaWdobGlnaHQoXG4gIHNlbGVjdG9yOiBzdHJpbmcgfCBIVE1MRWxlbWVudCxcbiAgY29sb3I6IHN0cmluZyA9ICcjZmZmZjk5JyxcbiAgZHVyYXRpb246IG51bWJlciA9IDYwMFxuKTogUHJvbWlzZTxBbmltYXRpb24gfCB2b2lkPiB7XG4gIGNvbnN0IGVsZSA9IHNlbGVjdE9uZShzZWxlY3Rvcik7XG5cbiAgaWYgKCFlbGUpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBkdXJhdGlvbiAvPSAyO1xuICBjb25zdCBiZyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZSkuYmFja2dyb3VuZENvbG9yO1xuXG4gIGNvbnN0IGFuaW1hdGlvbiA9IGFuaW1hdGVUbyhlbGUsIHsgYmFja2dyb3VuZENvbG9yOiBjb2xvciB9LCB7IGR1cmF0aW9uIH0pO1xuXG4gIGF3YWl0IGFuaW1hdGlvbi5maW5pc2hlZDtcblxuICByZXR1cm4gYW5pbWF0ZVRvKGVsZSwgeyBiYWNrZ3JvdW5kQ29sb3I6IGJnIH0sIHsgZHVyYXRpb24gfSk7XG59XG5cbi8qKlxuICogQ29sb3IgUGlja2VyLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlQ29sb3JQaWNrZXIoXG4gIHNlbGVjdG9yPzogTnVsbGFibGU8c3RyaW5nIHwgSFRNTEVsZW1lbnQgfCBOb2RlTGlzdE9mPEhUTUxFbGVtZW50Pj4sXG4gIG9wdGlvbnM6IFBhcnRpYWw8U3BlY3RydW1PcHRpb25zPiA9IHt9XG4pOiBQcm9taXNlPGFueT4ge1xuICBpZiAob3B0aW9ucz8udGhlbWUgPT09ICdkYXJrJykge1xuICAgIHVzZUNzc0ltcG9ydCgnQHNwZWN0cnVtL3NwZWN0cnVtLWRhcmsubWluLmNzcycpO1xuICB9IGVsc2UgaWYgKCFvcHRpb25zPy50aGVtZSkge1xuICAgIHVzZUNzc0ltcG9ydCgnQHNwZWN0cnVtL3NwZWN0cnVtLm1pbi5jc3MnKTtcbiAgfVxuXG4gIGNvbnN0IG0gPSBhd2FpdCB1c2VJbXBvcnQoJ0BzcGVjdHJ1bScpO1xuXG4vLyBMb2NhbGVcbiAgaWYgKHR5cGVvZiBvcHRpb25zLmxvY2FsZSA9PT0gJ3N0cmluZycpIHtcbiAgICBsZXQgbHM6IGFueSA9IG9wdGlvbnMubG9jYWxlLnNwbGl0KCctJykubWFwKChsKSA9PiBsLnRvTG93ZXJDYXNlKCkpO1xuXG4gICAgaWYgKGxzWzBdID09PSBsc1sxXSkge1xuICAgICAgbHMgPSBbbHNdO1xuICAgIH1cblxuICAgIGxzID0gbHMuam9pbignLScpO1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCB1c2VJbXBvcnQoYEBzcGVjdHJ1bS9pMThuLyR7bHN9LmpzYCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS53YXJuKGBVbmFibGUgdG8gbG9hZCBTcGVjdHJ1bSBsb2NhbGUgXCIke2xzfVwiICgke29wdGlvbnMubG9jYWxlfSlgKTtcbiAgICB9XG4gIH1cblxuICBpZiAoc2VsZWN0b3IpIHtcbiAgICBtb2R1bGU8YW55LCBIVE1MRWxlbWVudD4oc2VsZWN0b3IsICdzcGVjdHJ1bScsIChlbGUpID0+IFNwZWN0cnVtLmdldEluc3RhbmNlKGVsZSwgb3B0aW9ucykpO1xuICB9XG5cbiAgcmV0dXJuIG07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VEaXNhYmxlT25TdWJtaXQoXG4gIGZvcm1TZWxlY3Rvcjogc3RyaW5nIHwgSFRNTEZvcm1FbGVtZW50ID0gJyNhZG1pbi1mb3JtJyxcbiAgYnV0dG9uU2VsZWN0b3I6IHN0cmluZyA9ICcnLFxuICBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge31cbikge1xuICAvLyBUb2RvOiBVc2Ugb2JqZWN0IHRvIGhhbmRsZSBpdFxuICBidXR0b25TZWxlY3RvciA9IGJ1dHRvblNlbGVjdG9yIHx8IFtcbiAgICAnI2FkbWluLXRvb2xiYXIgYnV0dG9uJyxcbiAgICAnI2FkbWluLXRvb2xiYXIgYScsXG4gICAgZm9ybVNlbGVjdG9yICsgJyAuZGlzYWJsZS1vbi1zdWJtaXQnLFxuICAgIGZvcm1TZWxlY3RvciArICcgLmpzLWRvcycsXG4gICAgZm9ybVNlbGVjdG9yICsgJyBbZGF0YS1kb3NdJyxcbiAgXS5qb2luKCcsJyk7XG5cbiAgY29uc3QgaWNvblNlbGVjdG9yID0gb3B0aW9ucy5pY29uU2VsZWN0b3IgfHwgW1xuICAgICdbY2xhc3MqPVwiZmEtXCJdJyxcbiAgICAnW2RhdGEtc3Bpbl0nLFxuICAgICdbZGF0YS1zcGlubmVyXScsXG4gIF0uam9pbignLCcpO1xuXG4gIGNvbnN0IGV2ZW50ID0gb3B0aW9ucy5ldmVudCB8fCAnc3VibWl0JztcbiAgY29uc3Qgc3Bpbm5lckNsYXNzID0gb3B0aW9ucy5zcGlubmVyQ2xhc3MgfHwgJ3NwaW5uZXItYm9yZGVyIHNwaW5uZXItYm9yZGVyLXNtJztcblxuICBzZWxlY3RBbGw8SFRNTEVsZW1lbnQ+KGJ1dHRvblNlbGVjdG9yLCAoYnV0dG9uKSA9PiB7XG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIGJ1dHRvbi5kYXRhc2V0LmNsaWNrZWQgPSAnMSc7XG5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBkZWxldGUgYnV0dG9uLmRhdGFzZXQuY2xpY2tlZDtcbiAgICAgIH0sIDE1MDApO1xuICAgIH0pO1xuICB9KTtcblxuICBjb25zdCBmb3JtID0gc2VsZWN0T25lPEhUTUxGb3JtRWxlbWVudD4oZm9ybVNlbGVjdG9yKTtcbiAgZm9ybT8uYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgKGU6IFN1Ym1pdEV2ZW50KSA9PiB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAoIWZvcm0uY2hlY2tWYWxpZGl0eSgpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc2VsZWN0QWxsPEhUTUxFbGVtZW50PihidXR0b25TZWxlY3RvciwgKGJ1dHRvbikgPT4ge1xuICAgICAgICBidXR0b24uc3R5bGUucG9pbnRlckV2ZW50cyA9ICdub25lJztcbiAgICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCAnZGlzYWJsZWQnKTtcbiAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2Rpc2FibGVkJyk7XG5cbiAgICAgICAgaWYgKGJ1dHRvbi5kYXRhc2V0LmNsaWNrZWQpIHtcbiAgICAgICAgICBsZXQgaWNvbiA9IGJ1dHRvbi5xdWVyeVNlbGVjdG9yKGljb25TZWxlY3Rvcik7XG5cbiAgICAgICAgICBpZiAoaWNvbikge1xuICAgICAgICAgICAgY29uc3QgaSA9IGh0bWwoJzxpPjwvaT4nKTtcbiAgICAgICAgICAgIGljb24ucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoaSwgaWNvbik7XG5cbiAgICAgICAgICAgIGkuc2V0QXR0cmlidXRlKCdjbGFzcycsIHNwaW5uZXJDbGFzcyk7XG4gICAgICAgICAgICAvLyBpY29uLnN0eWxlcy53aWR0aCA9ICcxZW0nO1xuICAgICAgICAgICAgLy8gaWNvbi5zdHlsZXMuaGVpZ2h0ID0gJzFlbSc7XG4gICAgICAgICAgICAvLyBpY29uLnN0eWxlcy5ib3JkZXJXaXRoID0gJy4xNWVtJztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sIDApO1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVzZURpc2FibGVJZlN0YWNrTm90RW1wdHkoYnV0dG9uU2VsZWN0b3I6IHN0cmluZyA9ICdbZGF0YS10YXNrPXNhdmVdJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrTmFtZTogc3RyaW5nID0gJ3VwbG9hZGluZycpIHtcbiAgY29uc3Qgc3RhY2sgPSB1c2VTdGFjayhzdGFja05hbWUpO1xuXG4gIHN0YWNrLm9ic2VydmUoKHN0YWNrLCBsZW5ndGgpID0+IHtcbiAgICBmb3IgKGNvbnN0IGJ1dHRvbiBvZiBzZWxlY3RBbGw8SFRNTEVsZW1lbnQ+KGJ1dHRvblNlbGVjdG9yKSkge1xuICAgICAgaWYgKGxlbmd0aCA+IDApIHtcbiAgICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCAnZGlzYWJsZWQnKTtcbiAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2Rpc2FibGVkJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBidXR0b24ucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgICAgICBidXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnZGlzYWJsZWQnKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuXG4vKipcbiAqIEtlZXAgYWxpdmUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1c2VLZWVwQWxpdmUodXJsOiBzdHJpbmcsIHRpbWU6IG51bWJlciA9IDYwMDAwKTogKCkgPT4gdm9pZCB7XG4gIGNvbnN0IGFsaXZlSGFuZGxlID0gd2luZG93LnNldEludGVydmFsKCgpID0+IGZldGNoKHVybCksIHRpbWUpO1xuXG4gIHJldHVybiAoKSA9PiB7XG4gICAgY2xlYXJJbnRlcnZhbChhbGl2ZUhhbmRsZSk7XG4gIH07XG59XG5cbi8qKlxuICogVnVlIGNvbXBvbmVudCBmaWVsZC5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZVZ1ZUNvbXBvbmVudEZpZWxkKFxuICBzZWxlY3Rvcj86IE51bGxhYmxlPHN0cmluZyB8IEhUTUxFbGVtZW50PixcbiAgdmFsdWU/OiBhbnksXG4gIG9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fVxuKTogUHJvbWlzZTxhbnk+IHtcbiAgY29uc3QgbSA9IGF3YWl0IHVzZUltcG9ydCgnQHVuaWNvcm4vZmllbGQvdnVlLWNvbXBvbmVudC1maWVsZC5qcycpO1xuXG4gIGlmIChzZWxlY3Rvcikge1xuICAgIG0uVnVlQ29tcG9uZW50RmllbGQuaW5pdChzZWxlY3RvciwgdmFsdWUsIG9wdGlvbnMpO1xuICB9XG5cbiAgcmV0dXJuIG07XG59XG5cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgdmFyIEFscGluZTogQWxwaW5lR2xvYmFsO1xuICB2YXIgVG9tU2VsZWN0OiB0eXBlb2YgVG9tU2VsZWN0R2xvYmFsO1xuICB2YXIgU3BlY3RydW06IHR5cGVvZiBTcGVjdHJ1bUdsb2JhbDtcbiAgdmFyIE1hcms6IGFueTtcbn1cbiIsImltcG9ydCB7IGRhdGEgfSBmcm9tICcuLi9kYXRhJztcblxudHlwZSBVcmlUeXBlcyA9ICdmdWxsJyB8ICdwYXRoJyB8ICdyb290JyB8ICdjdXJyZW50JyB8ICdyb3V0ZScgfCAnc2NyaXB0JztcbnR5cGUgQXNzZXRUeXBlcyA9ICdyb290JyB8ICdwYXRoJztcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZVN5c3RlbVVyaSgpOiBVbmljb3JuU3lzdGVtVXJpO1xuZXhwb3J0IGZ1bmN0aW9uIHVzZVN5c3RlbVVyaSh0eXBlOiBVcmlUeXBlcyk6IHN0cmluZztcbmV4cG9ydCBmdW5jdGlvbiB1c2VTeXN0ZW1VcmkodHlwZT86IFVyaVR5cGVzLCBwYXRoPzogc3RyaW5nKTogVW5pY29yblN5c3RlbVVyaSB8IHN0cmluZyB7XG4gIGNvbnN0IHVyaSA9IFVuaWNvcm5TeXN0ZW1VcmkuZ2V0KCk7XG5cbiAgaWYgKHR5cGUpIHtcbiAgICByZXR1cm4gdXJpW3R5cGVdKHBhdGgpO1xuICB9XG5cbiAgcmV0dXJuIHVyaTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUFzc2V0VXJpKCk6IFVuaWNvcm5Bc3NldFVyaTtcbmV4cG9ydCBmdW5jdGlvbiB1c2VBc3NldFVyaSh0eXBlPzogQXNzZXRUeXBlcywgcGF0aD86IHN0cmluZyk6IHN0cmluZztcbmV4cG9ydCBmdW5jdGlvbiB1c2VBc3NldFVyaSh0eXBlPzogQXNzZXRUeXBlcywgcGF0aD86IHN0cmluZyk6IFVuaWNvcm5Bc3NldFVyaSB8IHN0cmluZyB7XG4gIGNvbnN0IGFzc2V0ID0gVW5pY29ybkFzc2V0VXJpLmdldCgpO1xuXG4gIGlmICh0eXBlKSB7XG4gICAgcmV0dXJuIGFzc2V0W3R5cGVdKHBhdGgpO1xuICB9XG5cbiAgcmV0dXJuIGFzc2V0O1xufVxuXG5mdW5jdGlvbiB1cmkodHlwZTogc3RyaW5nKSB7XG4gIHJldHVybiBkYXRhKCd1bmljb3JuLnVyaScpW3R5cGVdO1xufVxuXG5mdW5jdGlvbiBhc3NldCh0eXBlOiBzdHJpbmcpIHtcbiAgcmV0dXJuIHVyaSgnYXNzZXQnKVt0eXBlXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZFVyaUJhc2UodXJpOiBzdHJpbmcsIHR5cGUgPSAncGF0aCcpIHtcbiAgaWYgKHVyaS5zdWJzdHJpbmcoMCwgMikgPT09ICcvXFwvJyB8fCB1cmkuc3Vic3RyaW5nKDAsIDQpID09PSAnaHR0cCcpIHtcbiAgICByZXR1cm4gdXJpO1xuICB9XG5cbiAgcmV0dXJuIGFzc2V0KHR5cGUpICsgJy8nICsgdXJpO1xufVxuXG5leHBvcnQgY2xhc3MgVW5pY29yblN5c3RlbVVyaSBleHRlbmRzIFVSTCB7XG4gIHN0YXRpYyBpbnN0YW5jZTogVW5pY29yblN5c3RlbVVyaTtcblxuICBzdGF0aWMgZ2V0KCkge1xuICAgIHJldHVybiB0aGlzLmluc3RhbmNlID8/PSBuZXcgdGhpcyh1cmkoJ2Z1bGwnKSk7XG4gIH1cblxuICBwYXRoKHBhdGg6IHN0cmluZyA9ICcnKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdXJpKCdwYXRoJykgKyBwYXRoO1xuICB9XG5cbiAgcm9vdChwYXRoOiBzdHJpbmcgPSAnJyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHVyaSgncm9vdCcpICsgcGF0aDtcbiAgfVxuXG4gIGN1cnJlbnQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdXJpKCdjdXJyZW50JykgfHwgJyc7XG4gIH1cblxuICBmdWxsKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHVyaSgnZnVsbCcpIHx8ICcnO1xuICB9XG5cbiAgcm91dGUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdXJpKCdyb3V0ZScpIHx8ICcnO1xuICB9XG5cbiAgc2NyaXB0KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHVyaSgnc2NyaXB0JykgfHwgJyc7XG4gIH1cblxuICByb3V0ZVdpdGhRdWVyeSgpIHtcbiAgICBjb25zdCByb3V0ZSA9IHRoaXMucm91dGUoKTtcbiAgICBjb25zdCBxdWVyeSA9IHRoaXMuc2VhcmNoUGFyYW1zLnRvU3RyaW5nKCk7XG5cbiAgICByZXR1cm4gcXVlcnkgPyBgJHtyb3V0ZX0/JHtxdWVyeX1gIDogcm91dGU7XG4gIH1cblxuICByb3V0ZUFuZFF1ZXJ5KCkge1xuICAgIGNvbnN0IHJvdXRlID0gdGhpcy5yb3V0ZSgpO1xuICAgIGNvbnN0IHF1ZXJ5ID0gdGhpcy5zZWFyY2hQYXJhbXMudG9TdHJpbmcoKTtcblxuICAgIHJldHVybiBbcm91dGUsIHF1ZXJ5XTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVW5pY29ybkFzc2V0VXJpIHtcbiAgc3RhdGljIGluc3RhbmNlOiBVbmljb3JuQXNzZXRVcmk7XG5cbiAgc3RhdGljIGdldCgpIHtcbiAgICByZXR1cm4gdGhpcy5pbnN0YW5jZSA/Pz0gbmV3IHRoaXMoKTtcbiAgfVxuXG4gIHBhdGgocGF0aDogc3RyaW5nID0gJycpOiBzdHJpbmcge1xuICAgIHJldHVybiBhc3NldCgncGF0aCcpICsgcGF0aDtcbiAgfVxuXG4gIHJvb3QocGF0aDogc3RyaW5nID0gJycpOiBzdHJpbmcge1xuICAgIHJldHVybiBhc3NldCgncm9vdCcpICsgcGF0aDtcbiAgfVxufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGVuY29kZShvYmosIHBmeCkge1xuXHR2YXIgaywgaSwgdG1wLCBzdHI9Jyc7XG5cblx0Zm9yIChrIGluIG9iaikge1xuXHRcdGlmICgodG1wID0gb2JqW2tdKSAhPT0gdm9pZCAwKSB7XG5cdFx0XHRpZiAoQXJyYXkuaXNBcnJheSh0bXApKSB7XG5cdFx0XHRcdGZvciAoaT0wOyBpIDwgdG1wLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0c3RyICYmIChzdHIgKz0gJyYnKTtcblx0XHRcdFx0XHRzdHIgKz0gZW5jb2RlVVJJQ29tcG9uZW50KGspICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHRtcFtpXSk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHN0ciAmJiAoc3RyICs9ICcmJyk7XG5cdFx0XHRcdHN0ciArPSBlbmNvZGVVUklDb21wb25lbnQoaykgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodG1wKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gKHBmeCB8fCAnJykgKyBzdHI7XG59XG5cbmZ1bmN0aW9uIHRvVmFsdWUobWl4KSB7XG5cdGlmICghbWl4KSByZXR1cm4gJyc7XG5cdHZhciBzdHIgPSBkZWNvZGVVUklDb21wb25lbnQobWl4KTtcblx0aWYgKHN0ciA9PT0gJ2ZhbHNlJykgcmV0dXJuIGZhbHNlO1xuXHRpZiAoc3RyID09PSAndHJ1ZScpIHJldHVybiB0cnVlO1xuXHRyZXR1cm4gKCtzdHIgKiAwID09PSAwKSA/ICgrc3RyKSA6IHN0cjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlY29kZShzdHIpIHtcblx0dmFyIHRtcCwgaywgb3V0PXt9LCBhcnI9c3RyLnNwbGl0KCcmJyk7XG5cblx0d2hpbGUgKHRtcCA9IGFyci5zaGlmdCgpKSB7XG5cdFx0dG1wID0gdG1wLnNwbGl0KCc9Jyk7XG5cdFx0ayA9IHRtcC5zaGlmdCgpO1xuXHRcdGlmIChvdXRba10gIT09IHZvaWQgMCkge1xuXHRcdFx0b3V0W2tdID0gW10uY29uY2F0KG91dFtrXSwgdG9WYWx1ZSh0bXAuc2hpZnQoKSkpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRvdXRba10gPSB0b1ZhbHVlKHRtcC5zaGlmdCgpKTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gb3V0O1xufVxuIiwiXG5pbXBvcnQgeyBkYXRhIH0gZnJvbSAnLi4vZGF0YSc7XG5pbXBvcnQgeyBkZWNvZGUsIGVuY29kZSB9IGZyb20gJ3Fzcyc7XG5cbi8qKlxuICogQWRkIGEgcm91dGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRSb3V0ZShyb3V0ZTogc3RyaW5nLCB1cmw6IHN0cmluZykge1xuICBjb25zdCByb3V0ZXMgPSBkYXRhKCd1bmljb3JuLnJvdXRlcycpIHx8IHt9O1xuICByb3V0ZXNbcm91dGVdID0gdXJsO1xuXG4gIGRhdGEoJ3VuaWNvcm4ucm91dGVzJywgcm91dGVzKTtcbn1cblxuLyoqXG4gKiBHZXQgcm91dGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByb3V0ZShyb3V0ZTogc3RyaW5nLCBxdWVyeT86IFJlY29yZDxzdHJpbmcsIGFueT4pOiBzdHJpbmcge1xuICBjb25zdCBzb3VyY2UgPSByb3V0ZTtcbiAgY29uc3QgZXh0cmFjdCA9IGV4dHJhY3RSb3V0ZShzb3VyY2UpO1xuICByb3V0ZSA9IGV4dHJhY3Qucm91dGU7XG4gIGxldCBwYXRoID0gZXh0cmFjdC5wYXRoO1xuICBjb25zdCByb3V0ZXMgPSBkYXRhKCd1bmljb3JuLnJvdXRlcycpIHx8IHt9O1xuXG4gIGxldCB1cmwgPSByb3V0ZXNbcm91dGVdO1xuXG4gIGlmICh1cmwgPT0gbnVsbCkge1xuICAgIGlmICghcm91dGUuc3RhcnRzV2l0aCgnQCcpKSB7XG4gICAgICByb3V0ZSA9ICdAJyArIHJvdXRlO1xuICAgIH0gZWxzZSB7XG4gICAgICByb3V0ZSA9IHJvdXRlLnN1YnN0cmluZygxKTtcbiAgICB9XG4gIH1cblxuICB1cmwgPSByb3V0ZXNbcm91dGVdO1xuXG4gIGlmICh1cmwgPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgUm91dGU6IFwiJHtzb3VyY2V9XCIgbm90IGZvdW5kYCk7XG4gIH1cblxuICAvLyBNZXJnZSBxdWVyeVxuICBpZiAocGF0aCkge1xuICAgIGNvbnN0IHsgcm91dGU6IHUxLCBwYXRoOiB1MXEgfSA9IGV4dHJhY3RSb3V0ZSh1cmwsICc/Jyk7XG4gICAgY29uc3QgeyByb3V0ZTogdTIsIHBhdGg6IHUycSB9ID0gZXh0cmFjdFJvdXRlKHBhdGgsICc/Jyk7XG5cbiAgICB1cmwgPSB1MSArICcvJyArIHUyO1xuXG4gICAgaWYgKHUxcSB8fCB1MnEpIHtcbiAgICAgIGNvbnN0IHEgPSBbIHUxcSwgdTJxIF0uZmlsdGVyKHUgPT4gdSkuam9pbignJicpO1xuICAgICAgdXJsICs9ICc/JyArIHE7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGFkZFF1ZXJ5KHVybCwgcXVlcnkpO1xufVxuXG5mdW5jdGlvbiBleHRyYWN0Um91dGUocm91dGU6IHN0cmluZywgc2VwOiBzdHJpbmcgPSAnLycpOiB7IHBhdGg6IHN0cmluZzsgcm91dGU6IHN0cmluZyB9IHtcbiAgaWYgKHJvdXRlLmluZGV4T2Yoc2VwKSA9PT0gLTEpIHtcbiAgICByZXR1cm4geyByb3V0ZSwgcGF0aDogJycgfVxuICB9XG5cbiAgY29uc3Qgc2VnbWVudHMgPSByb3V0ZS5zcGxpdChzZXApO1xuXG4gIHJvdXRlID0gc2VnbWVudHMuc2hpZnQoKSB8fCAnJztcbiAgY29uc3QgcGF0aCA9IHNlZ21lbnRzLmpvaW4oc2VwKTtcblxuICByZXR1cm4geyByb3V0ZSwgcGF0aCB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFzUm91dGUocm91dGU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gdW5kZWZpbmVkICE9PSBkYXRhKCd1bmljb3JuLnJvdXRlcycpW3JvdXRlXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZFF1ZXJ5KHVybDogc3RyaW5nLCBxdWVyeT86IFJlY29yZDxzdHJpbmcsIGFueT4pOiBzdHJpbmcge1xuICBpZiAocXVlcnkgPT0gbnVsbCkge1xuICAgIHJldHVybiB1cmw7XG4gIH1cblxuICBmb3IgKGxldCBrIGluIHF1ZXJ5KSB7XG4gICAgY29uc3QgdiA9IHF1ZXJ5W2tdO1xuXG4gICAgY29uc3QgcGxhY2Vob2xkZXIgPSBgeyR7a319YDtcblxuICAgIGlmICh1cmwuaW5kZXhPZihwbGFjZWhvbGRlcikgIT09IC0xKSB7XG4gICAgICB1cmwgPSB1cmwucmVwbGFjZShcbiAgICAgICAgbmV3IFJlZ0V4cChgJHtwbGFjZWhvbGRlcn1gLCAnZycpLFxuICAgICAgICB2XG4gICAgICApO1xuICAgICAgZGVsZXRlIHF1ZXJ5W2tdO1xuICAgIH1cblxuICAgIGNvbnN0IGVuY29kZWRQbGFjZWhvbGRlciA9IGVuY29kZVVSSUNvbXBvbmVudChgeyR7a319YCk7XG5cbiAgICBpZiAodXJsLmluZGV4T2YoZW5jb2RlZFBsYWNlaG9sZGVyKSAhPT0gLTEpIHtcbiAgICAgIHVybCA9IHVybC5yZXBsYWNlKFxuICAgICAgICBuZXcgUmVnRXhwKGAke2VuY29kZWRQbGFjZWhvbGRlcn1gLCAnZycpLFxuICAgICAgICB2XG4gICAgICApO1xuICAgICAgZGVsZXRlIHF1ZXJ5W2tdO1xuICAgIH1cbiAgfVxuXG4gIGlmIChPYmplY3Qua2V5cyhxdWVyeSkubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuXG4gIGNvbnN0IHF1ZXJ5U3RyaW5nID0gZW5jb2RlKHF1ZXJ5KTtcblxuICByZXR1cm4gdXJsICsgKC9cXD8vLnRlc3QodXJsKSA/IGAmJHtxdWVyeVN0cmluZ31gIDogYD8ke3F1ZXJ5U3RyaW5nfWApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VRdWVyeTxUID0gUmVjb3JkPHN0cmluZywgYW55Pj4ocXVlcnlTdHJpbmc6IHN0cmluZyk6IFQge1xuICByZXR1cm4gZGVjb2RlKHF1ZXJ5U3RyaW5nKSBhcyBUO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRRdWVyeShxdWVyeTogUmVjb3JkPHN0cmluZywgYW55Pik6IHN0cmluZyB7XG4gIHJldHVybiBlbmNvZGUocXVlcnkpO1xufVxuIiwiaW1wb3J0IHsgc2VsZWN0QWxsIH0gZnJvbSAnLi4vc2VydmljZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVDbG9haygpIHtcbiAgaWYgKGdsb2JhbFRoaXMuZG9jdW1lbnQgPT0gbnVsbCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHNlbGVjdEFsbCgnW3VuaS1jbG9ha10nLCAoZWwpID0+IGVsLnJlbW92ZUF0dHJpYnV0ZSgndW5pLWNsb2FrJykpO1xufVxuIiwiaW1wb3J0IHsgZ2V0RGF0YSwgc2V0RGF0YSwgcmVtb3ZlRGF0YSBhcyBybWRhdGEgfSBmcm9tICcuL3V0aWxpdGllcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBkYXRhKG5hbWU6IHN0cmluZywgZGF0YTogYW55KTogYW55O1xuZXhwb3J0IGZ1bmN0aW9uIGRhdGEobmFtZTogc3RyaW5nKTogYW55O1xuZXhwb3J0IGZ1bmN0aW9uIGRhdGEoZWxlOiBFbGVtZW50LCBuYW1lOiBzdHJpbmcpOiBhbnk7XG5leHBvcnQgZnVuY3Rpb24gZGF0YShlbGU6IEVsZW1lbnQsIG5hbWU6IHN0cmluZywgZGF0YT86IGFueSk6IGFueTtcbmV4cG9ydCBmdW5jdGlvbiBkYXRhKGVsZTogRWxlbWVudCB8IHN0cmluZywgbmFtZTogYW55ID0gdW5kZWZpbmVkLCB2YWx1ZTogYW55ID0gdW5kZWZpbmVkKSB7XG4gIGlmICghKGVsZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSkge1xuICAgIHZhbHVlID0gbmFtZTtcbiAgICBuYW1lID0gZWxlO1xuICAgIGVsZSA9IGRvY3VtZW50IGFzIGFueSBhcyBFbGVtZW50O1xuICB9XG5cbiAgaWYgKG5hbWUgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBnZXREYXRhKGVsZSk7XG4gIH1cblxuICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgIGNvbnN0IHJlcyA9IGdldERhdGEoZWxlLCBuYW1lKTtcblxuICAgIHJldHVybiByZXM7XG4gIH1cblxuICBzZXREYXRhKGVsZSwgbmFtZSwgdmFsdWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlRGF0YShuYW1lOiBzdHJpbmcpOiBhbnk7XG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlRGF0YShlbGU6IEVsZW1lbnQsIG5hbWU6IHN0cmluZyk6IGFueTtcbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVEYXRhKGVsZTogRWxlbWVudHxzdHJpbmcsIG5hbWU6IGFueSA9IHVuZGVmaW5lZCkge1xuICBpZiAoIShlbGUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkpIHtcbiAgICBuYW1lID0gZWxlO1xuICAgIGVsZSA9IGRvY3VtZW50IGFzIGFueSBhcyBFbGVtZW50O1xuICB9XG5cbiAgcm1kYXRhKGVsZSwgbmFtZSk7XG59XG4iLCIvKipcbiAqIFV0aWxpdHkgZnVuY3Rpb24gdGhhdCB3b3JrcyBsaWtlIGBPYmplY3QuYXBwbHlgLCBidXQgY29waWVzIGdldHRlcnMgYW5kIHNldHRlcnMgcHJvcGVybHkgYXMgd2VsbC4gIEFkZGl0aW9uYWxseSBnaXZlc1xuICogdGhlIG9wdGlvbiB0byBleGNsdWRlIHByb3BlcnRpZXMgYnkgbmFtZS5cbiAqL1xuY29uc3QgY29weVByb3BzID0gKGRlc3QsIHNyYywgZXhjbHVkZSA9IFtdKSA9PiB7XG4gICAgY29uc3QgcHJvcHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhzcmMpO1xuICAgIGZvciAobGV0IHByb3Agb2YgZXhjbHVkZSlcbiAgICAgICAgZGVsZXRlIHByb3BzW3Byb3BdO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGRlc3QsIHByb3BzKTtcbn07XG4vKipcbiAqIFJldHVybnMgdGhlIGZ1bGwgY2hhaW4gb2YgcHJvdG90eXBlcyB1cCB1bnRpbCBPYmplY3QucHJvdG90eXBlIGdpdmVuIGEgc3RhcnRpbmcgb2JqZWN0LiAgVGhlIG9yZGVyIG9mIHByb3RvdHlwZXMgd2lsbFxuICogYmUgY2xvc2VzdCB0byBmYXJ0aGVzdCBpbiB0aGUgY2hhaW4uXG4gKi9cbmNvbnN0IHByb3RvQ2hhaW4gPSAob2JqLCBjdXJyZW50Q2hhaW4gPSBbb2JqXSkgPT4ge1xuICAgIGNvbnN0IHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaik7XG4gICAgaWYgKHByb3RvID09PSBudWxsKVxuICAgICAgICByZXR1cm4gY3VycmVudENoYWluO1xuICAgIHJldHVybiBwcm90b0NoYWluKHByb3RvLCBbLi4uY3VycmVudENoYWluLCBwcm90b10pO1xufTtcbi8qKlxuICogSWRlbnRpZmllcyB0aGUgbmVhcmVzdCBhbmNlc3RvciBjb21tb24gdG8gYWxsIHRoZSBnaXZlbiBvYmplY3RzIGluIHRoZWlyIHByb3RvdHlwZSBjaGFpbnMuICBGb3IgbW9zdCB1bnJlbGF0ZWRcbiAqIG9iamVjdHMsIHRoaXMgZnVuY3Rpb24gc2hvdWxkIHJldHVybiBPYmplY3QucHJvdG90eXBlLlxuICovXG5jb25zdCBuZWFyZXN0Q29tbW9uUHJvdG8gPSAoLi4ub2JqcykgPT4ge1xuICAgIGlmIChvYmpzLmxlbmd0aCA9PT0gMClcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICBsZXQgY29tbW9uUHJvdG8gPSB1bmRlZmluZWQ7XG4gICAgY29uc3QgcHJvdG9DaGFpbnMgPSBvYmpzLm1hcChvYmogPT4gcHJvdG9DaGFpbihvYmopKTtcbiAgICB3aGlsZSAocHJvdG9DaGFpbnMuZXZlcnkocHJvdG9DaGFpbiA9PiBwcm90b0NoYWluLmxlbmd0aCA+IDApKSB7XG4gICAgICAgIGNvbnN0IHByb3RvcyA9IHByb3RvQ2hhaW5zLm1hcChwcm90b0NoYWluID0+IHByb3RvQ2hhaW4ucG9wKCkpO1xuICAgICAgICBjb25zdCBwb3RlbnRpYWxDb21tb25Qcm90byA9IHByb3Rvc1swXTtcbiAgICAgICAgaWYgKHByb3Rvcy5ldmVyeShwcm90byA9PiBwcm90byA9PT0gcG90ZW50aWFsQ29tbW9uUHJvdG8pKVxuICAgICAgICAgICAgY29tbW9uUHJvdG8gPSBwb3RlbnRpYWxDb21tb25Qcm90bztcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiBjb21tb25Qcm90bztcbn07XG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgcHJvdG90eXBlIG9iamVjdCB0aGF0IGlzIGEgbWl4dHVyZSBvZiB0aGUgZ2l2ZW4gcHJvdG90eXBlcy4gIFRoZSBtaXhpbmcgaXMgYWNoaWV2ZWQgYnkgZmlyc3RcbiAqIGlkZW50aWZ5aW5nIHRoZSBuZWFyZXN0IGNvbW1vbiBhbmNlc3RvciBhbmQgdXNpbmcgaXQgYXMgdGhlIHByb3RvdHlwZSBmb3IgYSBuZXcgb2JqZWN0LiAgVGhlbiBhbGwgcHJvcGVydGllcy9tZXRob2RzXG4gKiBkb3duc3RyZWFtIG9mIHRoaXMgcHJvdG90eXBlIChPTkxZIGRvd25zdHJlYW0pIGFyZSBjb3BpZWQgaW50byB0aGUgbmV3IG9iamVjdC5cbiAqXG4gKiBUaGUgcmVzdWx0aW5nIHByb3RvdHlwZSBpcyBtb3JlIHBlcmZvcm1hbnQgdGhhbiBzb2Z0TWl4UHJvdG9zKC4uLiksIGFzIHdlbGwgYXMgRVM1IGNvbXBhdGlibGUuICBIb3dldmVyLCBpdCdzIG5vdCBhc1xuICogZmxleGlibGUgYXMgdXBkYXRlcyB0byB0aGUgc291cmNlIHByb3RvdHlwZXMgYXJlbid0IGNhcHR1cmVkIGJ5IHRoZSBtaXhlZCByZXN1bHQuICBTZWUgc29mdE1peFByb3RvcyBmb3Igd2h5IHlvdSBtYXlcbiAqIHdhbnQgdG8gdXNlIHRoYXQgaW5zdGVhZC5cbiAqL1xuY29uc3QgaGFyZE1peFByb3RvcyA9IChpbmdyZWRpZW50cywgY29uc3RydWN0b3IsIGV4Y2x1ZGUgPSBbXSkgPT4ge1xuICAgIHZhciBfYTtcbiAgICBjb25zdCBiYXNlID0gKF9hID0gbmVhcmVzdENvbW1vblByb3RvKC4uLmluZ3JlZGllbnRzKSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogT2JqZWN0LnByb3RvdHlwZTtcbiAgICBjb25zdCBtaXhlZFByb3RvID0gT2JqZWN0LmNyZWF0ZShiYXNlKTtcbiAgICAvLyBLZWVwcyB0cmFjayBvZiBwcm90b3R5cGVzIHdlJ3ZlIGFscmVhZHkgdmlzaXRlZCB0byBhdm9pZCBjb3B5aW5nIHRoZSBzYW1lIHByb3BlcnRpZXMgbXVsdGlwbGUgdGltZXMuICBXZSBpbml0IHRoZVxuICAgIC8vIGxpc3Qgd2l0aCB0aGUgcHJvdG8gY2hhaW4gYmVsb3cgdGhlIG5lYXJlc3QgY29tbW9uIGFuY2VzdG9yIGJlY2F1c2Ugd2UgZG9uJ3Qgd2FudCBhbnkgb2YgdGhvc2UgbWV0aG9kcyBtaXhlZCBpblxuICAgIC8vIHdoZW4gdGhleSB3aWxsIGFscmVhZHkgYmUgYWNjZXNzaWJsZSB2aWEgcHJvdG90eXBlIGFjY2Vzcy5cbiAgICBjb25zdCB2aXNpdGVkUHJvdG9zID0gcHJvdG9DaGFpbihiYXNlKTtcbiAgICBmb3IgKGxldCBwcm90b3R5cGUgb2YgaW5ncmVkaWVudHMpIHtcbiAgICAgICAgbGV0IHByb3RvcyA9IHByb3RvQ2hhaW4ocHJvdG90eXBlKTtcbiAgICAgICAgLy8gQXBwbHkgdGhlIHByb3RvdHlwZSBjaGFpbiBpbiByZXZlcnNlIG9yZGVyIHNvIHRoYXQgb2xkIG1ldGhvZHMgZG9uJ3Qgb3ZlcnJpZGUgbmV3ZXIgb25lcy5cbiAgICAgICAgZm9yIChsZXQgaSA9IHByb3Rvcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgbGV0IG5ld1Byb3RvID0gcHJvdG9zW2ldO1xuICAgICAgICAgICAgaWYgKHZpc2l0ZWRQcm90b3MuaW5kZXhPZihuZXdQcm90bykgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgY29weVByb3BzKG1peGVkUHJvdG8sIG5ld1Byb3RvLCBbJ2NvbnN0cnVjdG9yJywgLi4uZXhjbHVkZV0pO1xuICAgICAgICAgICAgICAgIHZpc2l0ZWRQcm90b3MucHVzaChuZXdQcm90byk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgbWl4ZWRQcm90by5jb25zdHJ1Y3RvciA9IGNvbnN0cnVjdG9yO1xuICAgIHJldHVybiBtaXhlZFByb3RvO1xufTtcbmNvbnN0IHVuaXF1ZSA9IChhcnIpID0+IGFyci5maWx0ZXIoKGUsIGkpID0+IGFyci5pbmRleE9mKGUpID09IGkpO1xuXG4vKipcbiAqIEZpbmRzIHRoZSBpbmdyZWRpZW50IHdpdGggdGhlIGdpdmVuIHByb3AsIHNlYXJjaGluZyBpbiByZXZlcnNlIG9yZGVyIGFuZCBicmVhZHRoLWZpcnN0IGlmIHNlYXJjaGluZyBpbmdyZWRpZW50XG4gKiBwcm90b3R5cGVzIGlzIHJlcXVpcmVkLlxuICovXG5jb25zdCBnZXRJbmdyZWRpZW50V2l0aFByb3AgPSAocHJvcCwgaW5ncmVkaWVudHMpID0+IHtcbiAgICBjb25zdCBwcm90b0NoYWlucyA9IGluZ3JlZGllbnRzLm1hcChpbmdyZWRpZW50ID0+IHByb3RvQ2hhaW4oaW5ncmVkaWVudCkpO1xuICAgIC8vIHNpbmNlIHdlIHNlYXJjaCBicmVhZHRoLWZpcnN0LCB3ZSBuZWVkIHRvIGtlZXAgdHJhY2sgb2Ygb3VyIGRlcHRoIGluIHRoZSBwcm90b3R5cGUgY2hhaW5zXG4gICAgbGV0IHByb3RvRGVwdGggPSAwO1xuICAgIC8vIG5vdCBhbGwgcHJvdG90eXBlIGNoYWlucyBhcmUgdGhlIHNhbWUgZGVwdGgsIHNvIHRoaXMgcmVtYWlucyB0cnVlIGFzIGxvbmcgYXMgYXQgbGVhc3Qgb25lIG9mIHRoZSBpbmdyZWRpZW50cydcbiAgICAvLyBwcm90b3R5cGUgY2hhaW5zIGhhcyBhbiBvYmplY3QgYXQgdGhpcyBkZXB0aFxuICAgIGxldCBwcm90b3NBcmVMZWZ0VG9TZWFyY2ggPSB0cnVlO1xuICAgIHdoaWxlIChwcm90b3NBcmVMZWZ0VG9TZWFyY2gpIHtcbiAgICAgICAgLy8gd2l0aCB0aGUgc3RhcnQgb2YgZWFjaCBob3Jpem9udGFsIHNsaWNlLCB3ZSBhc3N1bWUgdGhpcyBpcyB0aGUgb25lIHRoYXQncyBkZWVwZXIgdGhhbiBhbnkgb2YgdGhlIHByb3RvIGNoYWluc1xuICAgICAgICBwcm90b3NBcmVMZWZ0VG9TZWFyY2ggPSBmYWxzZTtcbiAgICAgICAgLy8gc2NhbiB0aHJvdWdoIHRoZSBpbmdyZWRpZW50cyByaWdodCB0byBsZWZ0XG4gICAgICAgIGZvciAobGV0IGkgPSBpbmdyZWRpZW50cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgY29uc3Qgc2VhcmNoVGFyZ2V0ID0gcHJvdG9DaGFpbnNbaV1bcHJvdG9EZXB0aF07XG4gICAgICAgICAgICBpZiAoc2VhcmNoVGFyZ2V0ICE9PSB1bmRlZmluZWQgJiYgc2VhcmNoVGFyZ2V0ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgd2UgZmluZCBzb21ldGhpbmcsIHRoaXMgaXMgcHJvb2YgdGhhdCB0aGlzIGhvcml6b250YWwgc2xpY2UgcG90ZW50aWFsbHkgbW9yZSBvYmplY3RzIHRvIHNlYXJjaFxuICAgICAgICAgICAgICAgIHByb3Rvc0FyZUxlZnRUb1NlYXJjaCA9IHRydWU7XG4gICAgICAgICAgICAgICAgLy8gZXVyZWthLCB3ZSBmb3VuZCBpdFxuICAgICAgICAgICAgICAgIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNlYXJjaFRhcmdldCwgcHJvcCkgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm90b0NoYWluc1tpXVswXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcHJvdG9EZXB0aCsrO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xufTtcbi8qKlxuICogXCJNaXhlc1wiIGluZ3JlZGllbnRzIGJ5IHdyYXBwaW5nIHRoZW0gaW4gYSBQcm94eS4gIFRoZSBvcHRpb25hbCBwcm90b3R5cGUgYXJndW1lbnQgYWxsb3dzIHRoZSBtaXhlZCBvYmplY3QgdG8gc2l0XG4gKiBkb3duc3RyZWFtIG9mIGFuIGV4aXN0aW5nIHByb3RvdHlwZSBjaGFpbi4gIE5vdGUgdGhhdCBcInByb3BlcnRpZXNcIiBjYW5ub3QgYmUgYWRkZWQsIGRlbGV0ZWQsIG9yIG1vZGlmaWVkLlxuICovXG5jb25zdCBwcm94eU1peCA9IChpbmdyZWRpZW50cywgcHJvdG90eXBlID0gT2JqZWN0LnByb3RvdHlwZSkgPT4gbmV3IFByb3h5KHt9LCB7XG4gICAgZ2V0UHJvdG90eXBlT2YoKSB7XG4gICAgICAgIHJldHVybiBwcm90b3R5cGU7XG4gICAgfSxcbiAgICBzZXRQcm90b3R5cGVPZigpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoJ0Nhbm5vdCBzZXQgcHJvdG90eXBlIG9mIFByb3hpZXMgY3JlYXRlZCBieSB0cy1taXhlcicpO1xuICAgIH0sXG4gICAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKF8sIHByb3ApIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoZ2V0SW5ncmVkaWVudFdpdGhQcm9wKHByb3AsIGluZ3JlZGllbnRzKSB8fCB7fSwgcHJvcCk7XG4gICAgfSxcbiAgICBkZWZpbmVQcm9wZXJ0eSgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgZGVmaW5lIG5ldyBwcm9wZXJ0aWVzIG9uIFByb3hpZXMgY3JlYXRlZCBieSB0cy1taXhlcicpO1xuICAgIH0sXG4gICAgaGFzKF8sIHByb3ApIHtcbiAgICAgICAgcmV0dXJuIGdldEluZ3JlZGllbnRXaXRoUHJvcChwcm9wLCBpbmdyZWRpZW50cykgIT09IHVuZGVmaW5lZCB8fCBwcm90b3R5cGVbcHJvcF0gIT09IHVuZGVmaW5lZDtcbiAgICB9LFxuICAgIGdldChfLCBwcm9wKSB7XG4gICAgICAgIHJldHVybiAoZ2V0SW5ncmVkaWVudFdpdGhQcm9wKHByb3AsIGluZ3JlZGllbnRzKSB8fCBwcm90b3R5cGUpW3Byb3BdO1xuICAgIH0sXG4gICAgc2V0KF8sIHByb3AsIHZhbCkge1xuICAgICAgICBjb25zdCBpbmdyZWRpZW50V2l0aFByb3AgPSBnZXRJbmdyZWRpZW50V2l0aFByb3AocHJvcCwgaW5ncmVkaWVudHMpO1xuICAgICAgICBpZiAoaW5ncmVkaWVudFdpdGhQcm9wID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBzZXQgbmV3IHByb3BlcnRpZXMgb24gUHJveGllcyBjcmVhdGVkIGJ5IHRzLW1peGVyJyk7XG4gICAgICAgIGluZ3JlZGllbnRXaXRoUHJvcFtwcm9wXSA9IHZhbDtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICBkZWxldGVQcm9wZXJ0eSgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgZGVsZXRlIHByb3BlcnRpZXMgb24gUHJveGllcyBjcmVhdGVkIGJ5IHRzLW1peGVyJyk7XG4gICAgfSxcbiAgICBvd25LZXlzKCkge1xuICAgICAgICByZXR1cm4gaW5ncmVkaWVudHNcbiAgICAgICAgICAgIC5tYXAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMpXG4gICAgICAgICAgICAucmVkdWNlKChwcmV2LCBjdXJyKSA9PiBjdXJyLmNvbmNhdChwcmV2LmZpbHRlcihrZXkgPT4gY3Vyci5pbmRleE9mKGtleSkgPCAwKSkpO1xuICAgIH0sXG59KTtcbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBwcm94eS1wcm90b3R5cGUgb2JqZWN0IHRoYXQgaXMgYSBcInNvZnRcIiBtaXh0dXJlIG9mIHRoZSBnaXZlbiBwcm90b3R5cGVzLiAgVGhlIG1peGluZyBpcyBhY2hpZXZlZCBieVxuICogcHJveHlpbmcgYWxsIHByb3BlcnR5IGFjY2VzcyB0byB0aGUgaW5ncmVkaWVudHMuICBUaGlzIGlzIG5vdCBFUzUgY29tcGF0aWJsZSBhbmQgbGVzcyBwZXJmb3JtYW50LiAgSG93ZXZlciwgYW55XG4gKiBjaGFuZ2VzIG1hZGUgdG8gdGhlIHNvdXJjZSBwcm90b3R5cGVzIHdpbGwgYmUgcmVmbGVjdGVkIGluIHRoZSBwcm94eS1wcm90b3R5cGUsIHdoaWNoIG1heSBiZSBkZXNpcmFibGUuXG4gKi9cbmNvbnN0IHNvZnRNaXhQcm90b3MgPSAoaW5ncmVkaWVudHMsIGNvbnN0cnVjdG9yKSA9PiBwcm94eU1peChbLi4uaW5ncmVkaWVudHMsIHsgY29uc3RydWN0b3IgfV0pO1xuXG5jb25zdCBzZXR0aW5ncyA9IHtcbiAgICBpbml0RnVuY3Rpb246IG51bGwsXG4gICAgc3RhdGljc1N0cmF0ZWd5OiAnY29weScsXG4gICAgcHJvdG90eXBlU3RyYXRlZ3k6ICdjb3B5JyxcbiAgICBkZWNvcmF0b3JJbmhlcml0YW5jZTogJ2RlZXAnLFxufTtcblxuLy8gS2VlcHMgdHJhY2sgb2YgY29uc3RpdHVlbnQgY2xhc3NlcyBmb3IgZXZlcnkgbWl4aW4gY2xhc3MgY3JlYXRlZCBieSB0cy1taXhlci5cbmNvbnN0IG1peGlucyA9IG5ldyBXZWFrTWFwKCk7XG5jb25zdCBnZXRNaXhpbnNGb3JDbGFzcyA9IChjbGF6eikgPT4gbWl4aW5zLmdldChjbGF6eik7XG5jb25zdCByZWdpc3Rlck1peGlucyA9IChtaXhlZENsYXNzLCBjb25zdGl0dWVudHMpID0+IG1peGlucy5zZXQobWl4ZWRDbGFzcywgY29uc3RpdHVlbnRzKTtcbmNvbnN0IGhhc01peGluID0gKGluc3RhbmNlLCBtaXhpbikgPT4ge1xuICAgIGlmIChpbnN0YW5jZSBpbnN0YW5jZW9mIG1peGluKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICBjb25zdCBjb25zdHJ1Y3RvciA9IGluc3RhbmNlLmNvbnN0cnVjdG9yO1xuICAgIGNvbnN0IHZpc2l0ZWQgPSBuZXcgU2V0KCk7XG4gICAgbGV0IGZyb250aWVyID0gbmV3IFNldCgpO1xuICAgIGZyb250aWVyLmFkZChjb25zdHJ1Y3Rvcik7XG4gICAgd2hpbGUgKGZyb250aWVyLnNpemUgPiAwKSB7XG4gICAgICAgIC8vIGNoZWNrIGlmIHRoZSBmcm9udGllciBoYXMgdGhlIG1peGluIHdlJ3JlIGxvb2tpbmcgZm9yLiAgaWYgbm90LCB3ZSBjYW4gc2F5IHdlIHZpc2l0ZWQgZXZlcnkgaXRlbSBpbiB0aGUgZnJvbnRpZXJcbiAgICAgICAgaWYgKGZyb250aWVyLmhhcyhtaXhpbikpXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgZnJvbnRpZXIuZm9yRWFjaCgoaXRlbSkgPT4gdmlzaXRlZC5hZGQoaXRlbSkpO1xuICAgICAgICAvLyBidWlsZCBhIG5ldyBmcm9udGllciBiYXNlZCBvbiB0aGUgYXNzb2NpYXRlZCBtaXhpbiBjbGFzc2VzIGFuZCBwcm90b3R5cGUgY2hhaW5zIG9mIGVhY2ggZnJvbnRpZXIgaXRlbVxuICAgICAgICBjb25zdCBuZXdGcm9udGllciA9IG5ldyBTZXQoKTtcbiAgICAgICAgZnJvbnRpZXIuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgY29uc3QgaXRlbUNvbnN0aXR1ZW50cyA9IChfYSA9IG1peGlucy5nZXQoaXRlbSkpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IHByb3RvQ2hhaW4oaXRlbS5wcm90b3R5cGUpXG4gICAgICAgICAgICAgICAgLm1hcCgocHJvdG8pID0+IHByb3RvLmNvbnN0cnVjdG9yKVxuICAgICAgICAgICAgICAgIC5maWx0ZXIoKGl0ZW0pID0+IGl0ZW0gIT09IG51bGwpO1xuICAgICAgICAgICAgaWYgKGl0ZW1Db25zdGl0dWVudHMpXG4gICAgICAgICAgICAgICAgaXRlbUNvbnN0aXR1ZW50cy5mb3JFYWNoKChjb25zdGl0dWVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXZpc2l0ZWQuaGFzKGNvbnN0aXR1ZW50KSAmJiAhZnJvbnRpZXIuaGFzKGNvbnN0aXR1ZW50KSlcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0Zyb250aWVyLmFkZChjb25zdGl0dWVudCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyB3ZSBoYXZlIGEgbmV3IGZyb250aWVyLCBub3cgc2VhcmNoIGFnYWluXG4gICAgICAgIGZyb250aWVyID0gbmV3RnJvbnRpZXI7XG4gICAgfVxuICAgIC8vIGlmIHdlIGdldCBoZXJlLCB3ZSBjb3VsZG4ndCBmaW5kIHRoZSBtaXhpbiBhbnl3aGVyZSBpbiB0aGUgcHJvdG90eXBlIGNoYWluIG9yIGFzc29jaWF0ZWQgbWl4aW4gY2xhc3Nlc1xuICAgIHJldHVybiBmYWxzZTtcbn07XG5cbmNvbnN0IG1lcmdlT2JqZWN0c09mRGVjb3JhdG9ycyA9IChvMSwgbzIpID0+IHtcbiAgICB2YXIgX2EsIF9iO1xuICAgIGNvbnN0IGFsbEtleXMgPSB1bmlxdWUoWy4uLk9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG8xKSwgLi4uT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMobzIpXSk7XG4gICAgY29uc3QgbWVyZ2VkT2JqZWN0ID0ge307XG4gICAgZm9yIChsZXQga2V5IG9mIGFsbEtleXMpXG4gICAgICAgIG1lcmdlZE9iamVjdFtrZXldID0gdW5pcXVlKFsuLi4oKF9hID0gbzEgPT09IG51bGwgfHwgbzEgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG8xW2tleV0pICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IFtdKSwgLi4uKChfYiA9IG8yID09PSBudWxsIHx8IG8yID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvMltrZXldKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBbXSldKTtcbiAgICByZXR1cm4gbWVyZ2VkT2JqZWN0O1xufTtcbmNvbnN0IG1lcmdlUHJvcGVydHlBbmRNZXRob2REZWNvcmF0b3JzID0gKGQxLCBkMikgPT4ge1xuICAgIHZhciBfYSwgX2IsIF9jLCBfZDtcbiAgICByZXR1cm4gKHtcbiAgICAgICAgcHJvcGVydHk6IG1lcmdlT2JqZWN0c09mRGVjb3JhdG9ycygoX2EgPSBkMSA9PT0gbnVsbCB8fCBkMSA9PT0gdm9pZCAwID8gdm9pZCAwIDogZDEucHJvcGVydHkpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IHt9LCAoX2IgPSBkMiA9PT0gbnVsbCB8fCBkMiA9PT0gdm9pZCAwID8gdm9pZCAwIDogZDIucHJvcGVydHkpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IHt9KSxcbiAgICAgICAgbWV0aG9kOiBtZXJnZU9iamVjdHNPZkRlY29yYXRvcnMoKF9jID0gZDEgPT09IG51bGwgfHwgZDEgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGQxLm1ldGhvZCkgIT09IG51bGwgJiYgX2MgIT09IHZvaWQgMCA/IF9jIDoge30sIChfZCA9IGQyID09PSBudWxsIHx8IGQyID09PSB2b2lkIDAgPyB2b2lkIDAgOiBkMi5tZXRob2QpICE9PSBudWxsICYmIF9kICE9PSB2b2lkIDAgPyBfZCA6IHt9KSxcbiAgICB9KTtcbn07XG5jb25zdCBtZXJnZURlY29yYXRvcnMgPSAoZDEsIGQyKSA9PiB7XG4gICAgdmFyIF9hLCBfYiwgX2MsIF9kLCBfZSwgX2Y7XG4gICAgcmV0dXJuICh7XG4gICAgICAgIGNsYXNzOiB1bmlxdWUoWy4uLihfYSA9IGQxID09PSBudWxsIHx8IGQxID09PSB2b2lkIDAgPyB2b2lkIDAgOiBkMS5jbGFzcykgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogW10sIC4uLihfYiA9IGQyID09PSBudWxsIHx8IGQyID09PSB2b2lkIDAgPyB2b2lkIDAgOiBkMi5jbGFzcykgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogW11dKSxcbiAgICAgICAgc3RhdGljOiBtZXJnZVByb3BlcnR5QW5kTWV0aG9kRGVjb3JhdG9ycygoX2MgPSBkMSA9PT0gbnVsbCB8fCBkMSA9PT0gdm9pZCAwID8gdm9pZCAwIDogZDEuc3RhdGljKSAhPT0gbnVsbCAmJiBfYyAhPT0gdm9pZCAwID8gX2MgOiB7fSwgKF9kID0gZDIgPT09IG51bGwgfHwgZDIgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGQyLnN0YXRpYykgIT09IG51bGwgJiYgX2QgIT09IHZvaWQgMCA/IF9kIDoge30pLFxuICAgICAgICBpbnN0YW5jZTogbWVyZ2VQcm9wZXJ0eUFuZE1ldGhvZERlY29yYXRvcnMoKF9lID0gZDEgPT09IG51bGwgfHwgZDEgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGQxLmluc3RhbmNlKSAhPT0gbnVsbCAmJiBfZSAhPT0gdm9pZCAwID8gX2UgOiB7fSwgKF9mID0gZDIgPT09IG51bGwgfHwgZDIgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGQyLmluc3RhbmNlKSAhPT0gbnVsbCAmJiBfZiAhPT0gdm9pZCAwID8gX2YgOiB7fSksXG4gICAgfSk7XG59O1xuY29uc3QgZGVjb3JhdG9ycyA9IG5ldyBNYXAoKTtcbmNvbnN0IGZpbmRBbGxDb25zdGl0dWVudENsYXNzZXMgPSAoLi4uY2xhc3NlcykgPT4ge1xuICAgIHZhciBfYTtcbiAgICBjb25zdCBhbGxDbGFzc2VzID0gbmV3IFNldCgpO1xuICAgIGNvbnN0IGZyb250aWVyID0gbmV3IFNldChbLi4uY2xhc3Nlc10pO1xuICAgIHdoaWxlIChmcm9udGllci5zaXplID4gMCkge1xuICAgICAgICBmb3IgKGxldCBjbGF6eiBvZiBmcm9udGllcikge1xuICAgICAgICAgICAgY29uc3QgcHJvdG9DaGFpbkNsYXNzZXMgPSBwcm90b0NoYWluKGNsYXp6LnByb3RvdHlwZSkubWFwKHByb3RvID0+IHByb3RvLmNvbnN0cnVjdG9yKTtcbiAgICAgICAgICAgIGNvbnN0IG1peGluQ2xhc3NlcyA9IChfYSA9IGdldE1peGluc0ZvckNsYXNzKGNsYXp6KSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogW107XG4gICAgICAgICAgICBjb25zdCBwb3RlbnRpYWxseU5ld0NsYXNzZXMgPSBbLi4ucHJvdG9DaGFpbkNsYXNzZXMsIC4uLm1peGluQ2xhc3Nlc107XG4gICAgICAgICAgICBjb25zdCBuZXdDbGFzc2VzID0gcG90ZW50aWFsbHlOZXdDbGFzc2VzLmZpbHRlcihjID0+ICFhbGxDbGFzc2VzLmhhcyhjKSk7XG4gICAgICAgICAgICBmb3IgKGxldCBuZXdDbGFzcyBvZiBuZXdDbGFzc2VzKVxuICAgICAgICAgICAgICAgIGZyb250aWVyLmFkZChuZXdDbGFzcyk7XG4gICAgICAgICAgICBhbGxDbGFzc2VzLmFkZChjbGF6eik7XG4gICAgICAgICAgICBmcm9udGllci5kZWxldGUoY2xhenopO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBbLi4uYWxsQ2xhc3Nlc107XG59O1xuY29uc3QgZGVlcERlY29yYXRvclNlYXJjaCA9ICguLi5jbGFzc2VzKSA9PiB7XG4gICAgY29uc3QgZGVjb3JhdG9yc0ZvckNsYXNzQ2hhaW4gPSBmaW5kQWxsQ29uc3RpdHVlbnRDbGFzc2VzKC4uLmNsYXNzZXMpXG4gICAgICAgIC5tYXAoY2xhenogPT4gZGVjb3JhdG9ycy5nZXQoY2xhenopKVxuICAgICAgICAuZmlsdGVyKGRlY29yYXRvcnMgPT4gISFkZWNvcmF0b3JzKTtcbiAgICBpZiAoZGVjb3JhdG9yc0ZvckNsYXNzQ2hhaW4ubGVuZ3RoID09IDApXG4gICAgICAgIHJldHVybiB7fTtcbiAgICBpZiAoZGVjb3JhdG9yc0ZvckNsYXNzQ2hhaW4ubGVuZ3RoID09IDEpXG4gICAgICAgIHJldHVybiBkZWNvcmF0b3JzRm9yQ2xhc3NDaGFpblswXTtcbiAgICByZXR1cm4gZGVjb3JhdG9yc0ZvckNsYXNzQ2hhaW4ucmVkdWNlKChkMSwgZDIpID0+IG1lcmdlRGVjb3JhdG9ycyhkMSwgZDIpKTtcbn07XG5jb25zdCBkaXJlY3REZWNvcmF0b3JTZWFyY2ggPSAoLi4uY2xhc3NlcykgPT4ge1xuICAgIGNvbnN0IGNsYXNzRGVjb3JhdG9ycyA9IGNsYXNzZXMubWFwKGNsYXp6ID0+IGdldERlY29yYXRvcnNGb3JDbGFzcyhjbGF6eikpO1xuICAgIGlmIChjbGFzc0RlY29yYXRvcnMubGVuZ3RoID09PSAwKVxuICAgICAgICByZXR1cm4ge307XG4gICAgaWYgKGNsYXNzRGVjb3JhdG9ycy5sZW5ndGggPT09IDEpXG4gICAgICAgIHJldHVybiBjbGFzc0RlY29yYXRvcnNbMF07XG4gICAgcmV0dXJuIGNsYXNzRGVjb3JhdG9ycy5yZWR1Y2UoKGQxLCBkMikgPT4gbWVyZ2VEZWNvcmF0b3JzKGQxLCBkMikpO1xufTtcbmNvbnN0IGdldERlY29yYXRvcnNGb3JDbGFzcyA9IChjbGF6eikgPT4ge1xuICAgIGxldCBkZWNvcmF0b3JzRm9yQ2xhc3MgPSBkZWNvcmF0b3JzLmdldChjbGF6eik7XG4gICAgaWYgKCFkZWNvcmF0b3JzRm9yQ2xhc3MpIHtcbiAgICAgICAgZGVjb3JhdG9yc0ZvckNsYXNzID0ge307XG4gICAgICAgIGRlY29yYXRvcnMuc2V0KGNsYXp6LCBkZWNvcmF0b3JzRm9yQ2xhc3MpO1xuICAgIH1cbiAgICByZXR1cm4gZGVjb3JhdG9yc0ZvckNsYXNzO1xufTtcbmNvbnN0IGRlY29yYXRlQ2xhc3MgPSAoZGVjb3JhdG9yKSA9PiAoKGNsYXp6KSA9PiB7XG4gICAgY29uc3QgZGVjb3JhdG9yc0ZvckNsYXNzID0gZ2V0RGVjb3JhdG9yc0ZvckNsYXNzKGNsYXp6KTtcbiAgICBsZXQgY2xhc3NEZWNvcmF0b3JzID0gZGVjb3JhdG9yc0ZvckNsYXNzLmNsYXNzO1xuICAgIGlmICghY2xhc3NEZWNvcmF0b3JzKSB7XG4gICAgICAgIGNsYXNzRGVjb3JhdG9ycyA9IFtdO1xuICAgICAgICBkZWNvcmF0b3JzRm9yQ2xhc3MuY2xhc3MgPSBjbGFzc0RlY29yYXRvcnM7XG4gICAgfVxuICAgIGNsYXNzRGVjb3JhdG9ycy5wdXNoKGRlY29yYXRvcik7XG4gICAgcmV0dXJuIGRlY29yYXRvcihjbGF6eik7XG59KTtcbmNvbnN0IGRlY29yYXRlTWVtYmVyID0gKGRlY29yYXRvcikgPT4gKChvYmplY3QsIGtleSwgLi4ub3RoZXJBcmdzKSA9PiB7XG4gICAgdmFyIF9hLCBfYiwgX2M7XG4gICAgY29uc3QgZGVjb3JhdG9yVGFyZ2V0VHlwZSA9IHR5cGVvZiBvYmplY3QgPT09ICdmdW5jdGlvbicgPyAnc3RhdGljJyA6ICdpbnN0YW5jZSc7XG4gICAgY29uc3QgZGVjb3JhdG9yVHlwZSA9IHR5cGVvZiBvYmplY3Rba2V5XSA9PT0gJ2Z1bmN0aW9uJyA/ICdtZXRob2QnIDogJ3Byb3BlcnR5JztcbiAgICBjb25zdCBjbGF6eiA9IGRlY29yYXRvclRhcmdldFR5cGUgPT09ICdzdGF0aWMnID8gb2JqZWN0IDogb2JqZWN0LmNvbnN0cnVjdG9yO1xuICAgIGNvbnN0IGRlY29yYXRvcnNGb3JDbGFzcyA9IGdldERlY29yYXRvcnNGb3JDbGFzcyhjbGF6eik7XG4gICAgY29uc3QgZGVjb3JhdG9yc0ZvclRhcmdldFR5cGUgPSAoX2EgPSBkZWNvcmF0b3JzRm9yQ2xhc3MgPT09IG51bGwgfHwgZGVjb3JhdG9yc0ZvckNsYXNzID09PSB2b2lkIDAgPyB2b2lkIDAgOiBkZWNvcmF0b3JzRm9yQ2xhc3NbZGVjb3JhdG9yVGFyZ2V0VHlwZV0pICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IHt9O1xuICAgIGRlY29yYXRvcnNGb3JDbGFzc1tkZWNvcmF0b3JUYXJnZXRUeXBlXSA9IGRlY29yYXRvcnNGb3JUYXJnZXRUeXBlO1xuICAgIGxldCBkZWNvcmF0b3JzRm9yVHlwZSA9IChfYiA9IGRlY29yYXRvcnNGb3JUYXJnZXRUeXBlID09PSBudWxsIHx8IGRlY29yYXRvcnNGb3JUYXJnZXRUeXBlID09PSB2b2lkIDAgPyB2b2lkIDAgOiBkZWNvcmF0b3JzRm9yVGFyZ2V0VHlwZVtkZWNvcmF0b3JUeXBlXSkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDoge307XG4gICAgZGVjb3JhdG9yc0ZvclRhcmdldFR5cGVbZGVjb3JhdG9yVHlwZV0gPSBkZWNvcmF0b3JzRm9yVHlwZTtcbiAgICBsZXQgZGVjb3JhdG9yc0ZvcktleSA9IChfYyA9IGRlY29yYXRvcnNGb3JUeXBlID09PSBudWxsIHx8IGRlY29yYXRvcnNGb3JUeXBlID09PSB2b2lkIDAgPyB2b2lkIDAgOiBkZWNvcmF0b3JzRm9yVHlwZVtrZXldKSAhPT0gbnVsbCAmJiBfYyAhPT0gdm9pZCAwID8gX2MgOiBbXTtcbiAgICBkZWNvcmF0b3JzRm9yVHlwZVtrZXldID0gZGVjb3JhdG9yc0ZvcktleTtcbiAgICAvLyBAdHMtaWdub3JlOiBhcnJheSBpcyB0eXBlIGBBW10gfCBCW11gIGFuZCBpdGVtIGlzIHR5cGUgYEEgfCBCYCwgc28gdGVjaG5pY2FsbHkgYSB0eXBlIGVycm9yLCBidXQgaXQncyBmaW5lXG4gICAgZGVjb3JhdG9yc0ZvcktleS5wdXNoKGRlY29yYXRvcik7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHJldHVybiBkZWNvcmF0b3Iob2JqZWN0LCBrZXksIC4uLm90aGVyQXJncyk7XG59KTtcbmNvbnN0IGRlY29yYXRlID0gKGRlY29yYXRvcikgPT4gKCguLi5hcmdzKSA9PiB7XG4gICAgaWYgKGFyZ3MubGVuZ3RoID09PSAxKVxuICAgICAgICByZXR1cm4gZGVjb3JhdGVDbGFzcyhkZWNvcmF0b3IpKGFyZ3NbMF0pO1xuICAgIHJldHVybiBkZWNvcmF0ZU1lbWJlcihkZWNvcmF0b3IpKC4uLmFyZ3MpO1xufSk7XG5cbmZ1bmN0aW9uIE1peGluKC4uLmNvbnN0cnVjdG9ycykge1xuICAgIHZhciBfYSwgX2IsIF9jO1xuICAgIGNvbnN0IHByb3RvdHlwZXMgPSBjb25zdHJ1Y3RvcnMubWFwKGNvbnN0cnVjdG9yID0+IGNvbnN0cnVjdG9yLnByb3RvdHlwZSk7XG4gICAgLy8gSGVyZSB3ZSBnYXRoZXIgdXAgdGhlIGluaXQgZnVuY3Rpb25zIG9mIHRoZSBpbmdyZWRpZW50IHByb3RvdHlwZXMsIGNvbWJpbmUgdGhlbSBpbnRvIG9uZSBpbml0IGZ1bmN0aW9uLCBhbmRcbiAgICAvLyBhdHRhY2ggaXQgdG8gdGhlIG1peGVkIGNsYXNzIHByb3RvdHlwZS4gIFRoZSByZWFzb24gd2UgZG8gdGhpcyBpcyBiZWNhdXNlIHdlIHdhbnQgdGhlIGluaXQgZnVuY3Rpb25zIHRvIG1peFxuICAgIC8vIHNpbWlsYXJseSB0byBjb25zdHJ1Y3RvcnMgLS0gbm90IG1ldGhvZHMsIHdoaWNoIHNpbXBseSBvdmVycmlkZSBlYWNoIG90aGVyLlxuICAgIGNvbnN0IGluaXRGdW5jdGlvbk5hbWUgPSBzZXR0aW5ncy5pbml0RnVuY3Rpb247XG4gICAgaWYgKGluaXRGdW5jdGlvbk5hbWUgIT09IG51bGwpIHtcbiAgICAgICAgY29uc3QgaW5pdEZ1bmN0aW9ucyA9IHByb3RvdHlwZXNcbiAgICAgICAgICAgIC5tYXAocHJvdG8gPT4gcHJvdG9baW5pdEZ1bmN0aW9uTmFtZV0pXG4gICAgICAgICAgICAuZmlsdGVyKGZ1bmMgPT4gdHlwZW9mIGZ1bmMgPT09ICdmdW5jdGlvbicpO1xuICAgICAgICBjb25zdCBjb21iaW5lZEluaXRGdW5jdGlvbiA9IGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpbml0RnVuY3Rpb24gb2YgaW5pdEZ1bmN0aW9ucylcbiAgICAgICAgICAgICAgICBpbml0RnVuY3Rpb24uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGV4dHJhUHJvdG8gPSB7IFtpbml0RnVuY3Rpb25OYW1lXTogY29tYmluZWRJbml0RnVuY3Rpb24gfTtcbiAgICAgICAgcHJvdG90eXBlcy5wdXNoKGV4dHJhUHJvdG8pO1xuICAgIH1cbiAgICBmdW5jdGlvbiBNaXhlZENsYXNzKC4uLmFyZ3MpIHtcbiAgICAgICAgZm9yIChjb25zdCBjb25zdHJ1Y3RvciBvZiBjb25zdHJ1Y3RvcnMpXG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlOiBwb3RlbnRpYWxseSBhYnN0cmFjdCBjbGFzc1xuICAgICAgICAgICAgY29weVByb3BzKHRoaXMsIG5ldyBjb25zdHJ1Y3RvciguLi5hcmdzKSk7XG4gICAgICAgIGlmIChpbml0RnVuY3Rpb25OYW1lICE9PSBudWxsICYmIHR5cGVvZiB0aGlzW2luaXRGdW5jdGlvbk5hbWVdID09PSAnZnVuY3Rpb24nKVxuICAgICAgICAgICAgdGhpc1tpbml0RnVuY3Rpb25OYW1lXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gICAgTWl4ZWRDbGFzcy5wcm90b3R5cGUgPSBzZXR0aW5ncy5wcm90b3R5cGVTdHJhdGVneSA9PT0gJ2NvcHknXG4gICAgICAgID8gaGFyZE1peFByb3Rvcyhwcm90b3R5cGVzLCBNaXhlZENsYXNzKVxuICAgICAgICA6IHNvZnRNaXhQcm90b3MocHJvdG90eXBlcywgTWl4ZWRDbGFzcyk7XG4gICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKE1peGVkQ2xhc3MsIHNldHRpbmdzLnN0YXRpY3NTdHJhdGVneSA9PT0gJ2NvcHknXG4gICAgICAgID8gaGFyZE1peFByb3Rvcyhjb25zdHJ1Y3RvcnMsIG51bGwsIFsncHJvdG90eXBlJ10pXG4gICAgICAgIDogcHJveHlNaXgoY29uc3RydWN0b3JzLCBGdW5jdGlvbi5wcm90b3R5cGUpKTtcbiAgICBsZXQgRGVjb3JhdGVkTWl4ZWRDbGFzcyA9IE1peGVkQ2xhc3M7XG4gICAgaWYgKHNldHRpbmdzLmRlY29yYXRvckluaGVyaXRhbmNlICE9PSAnbm9uZScpIHtcbiAgICAgICAgY29uc3QgY2xhc3NEZWNvcmF0b3JzID0gc2V0dGluZ3MuZGVjb3JhdG9ySW5oZXJpdGFuY2UgPT09ICdkZWVwJ1xuICAgICAgICAgICAgPyBkZWVwRGVjb3JhdG9yU2VhcmNoKC4uLmNvbnN0cnVjdG9ycylcbiAgICAgICAgICAgIDogZGlyZWN0RGVjb3JhdG9yU2VhcmNoKC4uLmNvbnN0cnVjdG9ycyk7XG4gICAgICAgIGZvciAobGV0IGRlY29yYXRvciBvZiAoX2EgPSBjbGFzc0RlY29yYXRvcnMgPT09IG51bGwgfHwgY2xhc3NEZWNvcmF0b3JzID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjbGFzc0RlY29yYXRvcnMuY2xhc3MpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IFtdKSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBkZWNvcmF0b3IoRGVjb3JhdGVkTWl4ZWRDbGFzcyk7XG4gICAgICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgRGVjb3JhdGVkTWl4ZWRDbGFzcyA9IHJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBhcHBseVByb3BBbmRNZXRob2REZWNvcmF0b3JzKChfYiA9IGNsYXNzRGVjb3JhdG9ycyA9PT0gbnVsbCB8fCBjbGFzc0RlY29yYXRvcnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGNsYXNzRGVjb3JhdG9ycy5zdGF0aWMpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IHt9LCBEZWNvcmF0ZWRNaXhlZENsYXNzKTtcbiAgICAgICAgYXBwbHlQcm9wQW5kTWV0aG9kRGVjb3JhdG9ycygoX2MgPSBjbGFzc0RlY29yYXRvcnMgPT09IG51bGwgfHwgY2xhc3NEZWNvcmF0b3JzID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjbGFzc0RlY29yYXRvcnMuaW5zdGFuY2UpICE9PSBudWxsICYmIF9jICE9PSB2b2lkIDAgPyBfYyA6IHt9LCBEZWNvcmF0ZWRNaXhlZENsYXNzLnByb3RvdHlwZSk7XG4gICAgfVxuICAgIHJlZ2lzdGVyTWl4aW5zKERlY29yYXRlZE1peGVkQ2xhc3MsIGNvbnN0cnVjdG9ycyk7XG4gICAgcmV0dXJuIERlY29yYXRlZE1peGVkQ2xhc3M7XG59XG5jb25zdCBhcHBseVByb3BBbmRNZXRob2REZWNvcmF0b3JzID0gKHByb3BBbmRNZXRob2REZWNvcmF0b3JzLCB0YXJnZXQpID0+IHtcbiAgICBjb25zdCBwcm9wRGVjb3JhdG9ycyA9IHByb3BBbmRNZXRob2REZWNvcmF0b3JzLnByb3BlcnR5O1xuICAgIGNvbnN0IG1ldGhvZERlY29yYXRvcnMgPSBwcm9wQW5kTWV0aG9kRGVjb3JhdG9ycy5tZXRob2Q7XG4gICAgaWYgKHByb3BEZWNvcmF0b3JzKVxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gcHJvcERlY29yYXRvcnMpXG4gICAgICAgICAgICBmb3IgKGxldCBkZWNvcmF0b3Igb2YgcHJvcERlY29yYXRvcnNba2V5XSlcbiAgICAgICAgICAgICAgICBkZWNvcmF0b3IodGFyZ2V0LCBrZXkpO1xuICAgIGlmIChtZXRob2REZWNvcmF0b3JzKVxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gbWV0aG9kRGVjb3JhdG9ycylcbiAgICAgICAgICAgIGZvciAobGV0IGRlY29yYXRvciBvZiBtZXRob2REZWNvcmF0b3JzW2tleV0pXG4gICAgICAgICAgICAgICAgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSk7XG59O1xuLyoqXG4gKiBBIGRlY29yYXRvciB2ZXJzaW9uIG9mIHRoZSBgTWl4aW5gIGZ1bmN0aW9uLiAgWW91J2xsIHdhbnQgdG8gdXNlIHRoaXMgaW5zdGVhZCBvZiBgTWl4aW5gIGZvciBtaXhpbmcgZ2VuZXJpYyBjbGFzc2VzLlxuICovXG5jb25zdCBtaXggPSAoLi4uaW5ncmVkaWVudHMpID0+IGRlY29yYXRlZENsYXNzID0+IHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgY29uc3QgbWl4ZWRDbGFzcyA9IE1peGluKC4uLmluZ3JlZGllbnRzLmNvbmNhdChbZGVjb3JhdGVkQ2xhc3NdKSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG1peGVkQ2xhc3MsICduYW1lJywge1xuICAgICAgICB2YWx1ZTogZGVjb3JhdGVkQ2xhc3MubmFtZSxcbiAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgIH0pO1xuICAgIHJldHVybiBtaXhlZENsYXNzO1xufTtcblxuZXhwb3J0IHsgTWl4aW4sIGRlY29yYXRlLCBoYXNNaXhpbiwgbWl4LCBzZXR0aW5ncyB9O1xuIiwiaW1wb3J0IHsgTWl4aW4gfSBmcm9tICd0cy1taXhlcic7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBFdmVudE1peGluIGltcGxlbWVudHMgRXZlbnRBd2FyZUludGVyZmFjZSB7XG4gIF9saXN0ZW5lcnM6IFJlY29yZDxzdHJpbmcsIEV2ZW50SGFuZGxlcltdPiA9IHt9O1xuXG4gIG9uKGV2ZW50OiBzdHJpbmcgfCBzdHJpbmdbXSwgaGFuZGxlcjogRXZlbnRIYW5kbGVyKTogdGhpcyB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZXZlbnQpKSB7XG4gICAgICBmb3IgKGNvbnN0IGUgb2YgZXZlbnQpIHtcbiAgICAgICAgdGhpcy5vbihlLCBoYW5kbGVyKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHRoaXMuX2xpc3RlbmVyc1tldmVudF0gPz89IFtdO1xuXG4gICAgdGhpcy5fbGlzdGVuZXJzW2V2ZW50XS5wdXNoKGhhbmRsZXIpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBvbmNlKGV2ZW50OiBzdHJpbmcgfCBzdHJpbmdbXSwgaGFuZGxlcjogRXZlbnRIYW5kbGVyKTogdGhpcyB7XG4gICAgaGFuZGxlci5vbmNlID0gdHJ1ZTtcbiAgICByZXR1cm4gdGhpcy5vbihldmVudCwgaGFuZGxlcik7XG4gIH1cblxuICBvZmYoZXZlbnQ6IHN0cmluZywgaGFuZGxlcj86IEV2ZW50SGFuZGxlcik6IHRoaXMge1xuICAgIGlmIChoYW5kbGVyKSB7XG4gICAgICB0aGlzLl9saXN0ZW5lcnNbZXZlbnRdID0gdGhpcy5saXN0ZW5lcnMoZXZlbnQpLmZpbHRlcigobGlzdGVuZXIpID0+IGxpc3RlbmVyICE9PSBoYW5kbGVyKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGRlbGV0ZSB0aGlzLl9saXN0ZW5lcnNbZXZlbnRdO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB0cmlnZ2VyKGV2ZW50OiBzdHJpbmcgfCBzdHJpbmdbXSwgLi4uYXJnczogYW55W10pOiB0aGlzIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShldmVudCkpIHtcbiAgICAgIGZvciAoY29uc3QgZSBvZiBldmVudCkge1xuICAgICAgICB0aGlzLnRyaWdnZXIoZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGxpc3RlbmVyIG9mIHRoaXMubGlzdGVuZXJzKGV2ZW50KSkge1xuICAgICAgbGlzdGVuZXIoLi4uYXJncyk7XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIG9uY2VcbiAgICB0aGlzLl9saXN0ZW5lcnNbZXZlbnRdID0gdGhpcy5saXN0ZW5lcnMoZXZlbnQpLmZpbHRlcigobGlzdGVuZXIpID0+IGxpc3RlbmVyPy5vbmNlICE9PSB0cnVlKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzKGV2ZW50OiBzdHJpbmcpOiBFdmVudEhhbmRsZXJbXSB7XG4gICAgcmV0dXJuIHRoaXMuX2xpc3RlbmVyc1tldmVudF0gPT09IHVuZGVmaW5lZCA/IFtdIDogdGhpcy5fbGlzdGVuZXJzW2V2ZW50XTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRXZlbnRCdXMgZXh0ZW5kcyBNaXhpbihFdmVudE1peGluKSB7XG59XG5cbmV4cG9ydCB0eXBlIEV2ZW50SGFuZGxlciA9ICgoLi4uZXZlbnQ6IGFueVtdKSA9PiB2b2lkKSAmIHsgb25jZT86IGJvb2xlYW4gfTtcblxuZXhwb3J0IGludGVyZmFjZSBFdmVudEF3YXJlSW50ZXJmYWNlIHtcbiAgb24oZXZlbnQ6IHN0cmluZyB8IHN0cmluZ1tdLCBoYW5kbGVyOiBFdmVudEhhbmRsZXIpOiB0aGlzO1xuXG4gIG9uY2UoZXZlbnQ6IHN0cmluZyB8IHN0cmluZ1tdLCBoYW5kbGVyOiBFdmVudEhhbmRsZXIpOiB0aGlzO1xuXG4gIG9mZihldmVudDogc3RyaW5nLCBoYW5kbGVyPzogRXZlbnRIYW5kbGVyKTogdGhpcztcblxuICB0cmlnZ2VyKGV2ZW50OiBzdHJpbmcgfCBzdHJpbmdbXSwgLi4uYXJnczogYW55W10pOiB0aGlzO1xuXG4gIGxpc3RlbmVycyhldmVudDogc3RyaW5nKTogRXZlbnRIYW5kbGVyW107XG59XG4iLCJcbmltcG9ydCB7IGRhdGEgfSBmcm9tICcuL2RhdGEnO1xuaW1wb3J0IHsgRXZlbnRBd2FyZUludGVyZmFjZSwgRXZlbnRNaXhpbiB9IGZyb20gJy4vZXZlbnRzJztcbmltcG9ydCB7IGRvbXJlYWR5IH0gZnJvbSAnLi9zZXJ2aWNlJztcbmltcG9ydCB7IENvbnN0cnVjdG9yLCBVbmljb3JuUGx1Z2luIH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgeyBNaXhpbiB9IGZyb20gJ3RzLW1peGVyJztcblxuZXhwb3J0IHR5cGUgSW5qZWN0aW9uS2V5PFQgPSBhbnk+ID0gc3RyaW5nIHwgc3ltYm9sIHwgQ29uc3RydWN0b3I8VD47XG5cbmV4cG9ydCBpbnRlcmZhY2UgVW5pY29ybkFwcCBleHRlbmRzIEV2ZW50QXdhcmVJbnRlcmZhY2Uge31cblxuZXhwb3J0IGNsYXNzIFVuaWNvcm5BcHAgZXh0ZW5kcyBNaXhpbihFdmVudE1peGluKSBpbXBsZW1lbnRzIEV2ZW50QXdhcmVJbnRlcmZhY2Uge1xuICByZWdpc3RyeSA9IG5ldyBNYXAoKTtcbiAgcGx1Z2lucyA9IG5ldyBNYXAoKTtcbiAgLy8gX2xpc3RlbmVycyA9IHt9O1xuICB3YWl0czogUHJvbWlzZTxhbnk+W10gPSBbXTtcbiAgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55PjtcbiAgZGVmYXVsdE9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgZG9tcmVhZHkgPSBkb21yZWFkeTtcbiAgZGF0YSA9IGRhdGE7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcblxuICAgIC8vIFdhaXQgZG9tIHJlYWR5XG4gICAgaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRoaXMud2FpdCgocmVzb2x2ZTogRnVuY3Rpb24pID0+IHtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHJlc29sdmUoKSk7XG4gICAgICB9KTtcblxuICAgICAgLy8gUmVhZHlcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuY29tcGxldGVkKCkudGhlbigoKSA9PiB0aGlzLnRyaWdnZXIoJ2xvYWRlZCcpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHVzZShwbHVnaW46IFVuaWNvcm5QbHVnaW4sIG9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHBsdWdpbikpIHtcbiAgICAgIHBsdWdpbi5mb3JFYWNoKHAgPT4gdGhpcy51c2UocCkpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLy8gaWYgKHBsdWdpbi5pcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gICB0aHJvdyBuZXcgRXJyb3IoYFBsdWdpbjogJHtwbHVnaW4ubmFtZX0gbXVzdCBpbnN0YW5jZSBvZiA6ICR7UGx1Z2luLm5hbWV9YCk7XG4gICAgLy8gfVxuXG4gICAgcGx1Z2luPy5pbnN0YWxsPy4odGhpcywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLnRyaWdnZXIoJ3BsdWdpbi5pbnN0YWxsZWQnLCBwbHVnaW4pO1xuXG4gICAgdGhpcy5wbHVnaW5zLnNldChwbHVnaW4sIHBsdWdpbik7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGRldGFjaChwbHVnaW46IGFueSkge1xuICAgIGlmIChwbHVnaW4udW5pbnN0YWxsKSB7XG4gICAgICBwbHVnaW4udW5pbnN0YWxsKHRoaXMpO1xuICAgIH1cblxuICAgIHRoaXMudHJpZ2dlcigncGx1Z2luLnVuaW5zdGFsbGVkJywgcGx1Z2luKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgaW5qZWN0PFQ+KGlkOiBJbmplY3Rpb25LZXk8VD4pOiBUO1xuICBpbmplY3Q8VD4oaWQ6IEluamVjdGlvbktleTxUPiwgZGVmOiBUKTogVDtcbiAgaW5qZWN0PFQ+KGlkOiBJbmplY3Rpb25LZXk8VD4sIGRlZj86IFQpOiBUO1xuICBpbmplY3Q8VD4oaWQ6IEluamVjdGlvbktleTxUPiwgZGVmPzogVCk6IFQgfCB1bmRlZmluZWQge1xuICAgIGlmICghdHlwZW9mIHRoaXMucmVnaXN0cnkuaGFzKGlkKSkge1xuICAgICAgaWYgKGRlZiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBkZWY7XG4gICAgICB9XG5cbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW5qZWN0YWJsZTogJHsoaWQgYXMgYW55KS5uYW1lfSBub3QgZm91bmQuYCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucmVnaXN0cnkuZ2V0KGlkKTtcbiAgfVxuXG4gIHByb3ZpZGU8VD4oaWQ6IEluamVjdGlvbktleTxUPiwgdmFsdWU6IGFueSkge1xuICAgIHRoaXMucmVnaXN0cnkuc2V0KGlkLCB2YWx1ZSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHRyaWdnZXIoZXZlbnQsIC4uLmFyZ3MpIHtcbiAgLy8gICByZXR1cm4gdGhpcy50YXAoc3VwZXIudHJpZ2dlcihldmVudCwgLi4uYXJncyksICgpID0+IHtcbiAgLy8gICAgIGlmICh0aGlzLmRhdGEoJ3dpbmR3YWxrZXIuZGVidWcnKSkge1xuICAvLyAgICAgICBjb25zb2xlLmRlYnVnKGBbVW5pY29ybiBFdmVudF0gJHtldmVudH1gLCBhcmdzLCB0aGlzLmxpc3RlbmVycyhldmVudCkpO1xuICAvLyAgICAgfVxuICAvLyAgIH0pO1xuICAvLyB9XG5cbiAgd2FpdChjYWxsYmFjazogRnVuY3Rpb24pOiBQcm9taXNlPGFueT4ge1xuICAgIGNvbnN0IHAgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBwcm9taXNlID0gY2FsbGJhY2socmVzb2x2ZSwgcmVqZWN0KTtcblxuICAgICAgaWYgKHByb21pc2UgJiYgJ3RoZW4nIGluIHByb21pc2UpIHtcbiAgICAgICAgcHJvbWlzZS50aGVuKHJlc29sdmUpLmNhdGNoKHJlamVjdCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLndhaXRzLnB1c2gocCk7XG5cbiAgICByZXR1cm4gcDtcbiAgfVxuXG4gIGNvbXBsZXRlZCgpOiBQcm9taXNlPGFueVtdPiB7XG4gICAgY29uc3QgcHJvbWlzZSA9IFByb21pc2UuYWxsKHRoaXMud2FpdHMpO1xuXG4gICAgdGhpcy53YWl0cyA9IFtdO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuXG59XG4iLCIvLyBAdHMtbm9jaGVja1xuLy8gQHNlZSBodHRwczovL2dpdGh1Yi5jb20vamF2YW4vZm9ybS1yZXF1ZXN0LXN1Ym1pdC1wb2x5ZmlsbFxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1SZXF1ZXN0U3VibWl0KHByb3RvdHlwZSkge1xuICBpZiAodHlwZW9mIHByb3RvdHlwZS5yZXF1ZXN0U3VibWl0ID09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBwcm90b3R5cGUucmVxdWVzdFN1Ym1pdCA9IGZ1bmN0aW9uIChzdWJtaXR0ZXIpIHtcbiAgICBpZiAoc3VibWl0dGVyKSB7XG4gICAgICB2YWxpZGF0ZVN1Ym1pdHRlcihzdWJtaXR0ZXIsIHRoaXMpO1xuICAgICAgc3VibWl0dGVyLmNsaWNrKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN1Ym1pdHRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICBzdWJtaXR0ZXIudHlwZSA9ICdzdWJtaXQnO1xuICAgICAgc3VibWl0dGVyLmhpZGRlbiA9IHRydWU7XG4gICAgICB0aGlzLmFwcGVuZENoaWxkKHN1Ym1pdHRlcik7XG4gICAgICBzdWJtaXR0ZXIuY2xpY2soKTtcbiAgICAgIHRoaXMucmVtb3ZlQ2hpbGQoc3VibWl0dGVyKTtcbiAgICB9XG4gIH07XG5cbiAgZnVuY3Rpb24gdmFsaWRhdGVTdWJtaXR0ZXIoc3VibWl0dGVyLCBmb3JtKSB7XG4gICAgc3VibWl0dGVyIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgfHwgcmFpc2UoVHlwZUVycm9yLCAncGFyYW1ldGVyIDEgaXMgbm90IG9mIHR5cGUgXFwnSFRNTEVsZW1lbnRcXCcnKTtcbiAgICBzdWJtaXR0ZXIudHlwZSA9PSAnc3VibWl0JyB8fCByYWlzZShUeXBlRXJyb3IsICdUaGUgc3BlY2lmaWVkIGVsZW1lbnQgaXMgbm90IGEgc3VibWl0IGJ1dHRvbicpO1xuICAgIHN1Ym1pdHRlci5mb3JtID09IGZvcm0gfHwgcmFpc2UoRE9NRXhjZXB0aW9uLCAnVGhlIHNwZWNpZmllZCBlbGVtZW50IGlzIG5vdCBvd25lZCBieSB0aGlzIGZvcm0gZWxlbWVudCcsICdOb3RGb3VuZEVycm9yJyk7XG4gIH1cblxuICBmdW5jdGlvbiByYWlzZShlcnJvckNvbnN0cnVjdG9yLCBtZXNzYWdlLCBuYW1lKSB7XG4gICAgdGhyb3cgbmV3IGVycm9yQ29uc3RydWN0b3IoJ0ZhaWxlZCB0byBleGVjdXRlIFxcJ3JlcXVlc3RTdWJtaXRcXCcgb24gXFwnSFRNTEZvcm1FbGVtZW50XFwnOiAnICsgbWVzc2FnZSArICcuJywgbmFtZSk7XG4gIH1cbn1cbiIsIlxuaW1wb3J0IHsgZm9ybVJlcXVlc3RTdWJtaXQgfSBmcm9tICcuL2Zvcm0tcmVxdWVzdC1zdWJtaXQnO1xuXG5leHBvcnQgZnVuY3Rpb24gcG9seWZpbGwoKSB7XG4gIC8vIElmIGluIGJyb3dzZXJcbiAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgZm9ybVJlcXVlc3RTdWJtaXQoSFRNTEZvcm1FbGVtZW50LnByb3RvdHlwZSk7XG4gIH1cbn1cbiIsImV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VGaWVsZE11bHRpVXBsb2FkZXIoKSB7XG4gIGF3YWl0IGltcG9ydCgnLi4vbW9kdWxlL2ZpZWxkLW11bHRpLXVwbG9hZGVyJyk7XG59XG4iLCJpbXBvcnQgdHlwZSB7IFRpbnltY2VDb250cm9sbGVyLCBUaW55bWNlTW9kdWxlIH0gZnJvbSAnLi4vbW9kdWxlL3RpbnltY2UnO1xuaW1wb3J0IHR5cGUgeyBNYXliZVByb21pc2UgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgdHlwZSB7IFRpbnlNQ0UgfSBmcm9tICd0aW55bWNlJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZVRpbnltY2UoKTogUHJvbWlzZTxUaW55bWNlTW9kdWxlPlxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZVRpbnltY2UoXG4gIHNlbGVjdG9yPzogc3RyaW5nLFxuICBvcHRpb25zPzogUmVjb3JkPHN0cmluZywgYW55PlxuKTogUHJvbWlzZTxUaW55bWNlQ29udHJvbGxlcj47XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlVGlueW1jZShcbiAgc2VsZWN0b3I/OiBzdHJpbmcsXG4gIG9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fVxuKTogUHJvbWlzZTxhbnk+IHtcbiAgY29uc3QgbW9kdWxlID0gYXdhaXQgaW1wb3J0KCcuLi9tb2R1bGUvdGlueW1jZScpO1xuXG4gIGlmIChzZWxlY3Rvcikge1xuICAgIHJldHVybiBtb2R1bGUuZ2V0KHNlbGVjdG9yLCBvcHRpb25zKTtcbiAgfVxuXG4gIHJldHVybiBtb2R1bGU7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VUaW55bWNlSG9vayhcbiAgaGFuZGxlcjogKCh0aW55bWNlOiBUaW55TUNFKSA9PiBNYXliZVByb21pc2U8YW55Pilcbik6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCB7IGFkZEhvb2sgfSA9IGF3YWl0IGltcG9ydCgnLi4vbW9kdWxlL3RpbnltY2UnKTtcblxuICByZXR1cm4gYWRkSG9vayhoYW5kbGVyKTtcbn1cbiIsImltcG9ydCB0eXBlIHsgVW5pY29ybkFwcCB9IGZyb20gJy4uL2FwcCc7XG5pbXBvcnQge1xuICB1c2VGaWVsZENhc2NhZGVTZWxlY3QsXG4gIHVzZUZpZWxkRmlsZURyYWcsXG4gIHVzZUZpZWxkRmxhdHBpY2tyLFxuICB1c2VGaWVsZE1vZGFsU2VsZWN0LCB1c2VGaWVsZE1vZGFsVHJlZSxcbiAgdXNlRmllbGRSZXBlYXRhYmxlLFxuICB1c2VGaWVsZFNpbmdsZUltYWdlRHJhZyxcbiAgdXNlSWZyYW1lTW9kYWwsIHVzZVMzVXBsb2FkZXIsXG4gIHVzZVNob3dPbixcbn0gZnJvbSAnLi4vY29tcG9zYWJsZSc7XG5pbXBvcnQgeyB1c2VGaWVsZE11bHRpVXBsb2FkZXIgfSBmcm9tICcuLi9jb21wb3NhYmxlL3VzZUZpZWxkTXVsdGlVcGxvYWRlcic7XG5pbXBvcnQgeyB1c2VUaW55bWNlIH0gZnJvbSAnLi4vY29tcG9zYWJsZS91c2VUaW55bWNlJztcbmltcG9ydCB7IHVzZVVuaWNvcm4gfSBmcm9tICcuLi91bmljb3JuJztcblxuZGVjbGFyZSBtb2R1bGUgJy4uL2FwcCcge1xuICBleHBvcnQgaW50ZXJmYWNlIFVuaWNvcm5BcHAge1xuICAgIC8qKiBAZGVwcmVjYXRlZCBPbmx5IGZvciBjb2RlIGdlbmVyYXRvciB1c2UuICovXG4gICAgJHVpOiB0eXBlb2YgbWV0aG9kcztcbiAgfVxufVxuXG4vLyBAdHMtaWdub3JlXG5kZWNsYXJlIG1vZHVsZSAnQHdpbmR3YWxrZXItaW8vdW5pY29ybi1uZXh0JyB7XG4gIGV4cG9ydCBpbnRlcmZhY2UgVW5pY29ybkFwcCB7XG4gICAgLyoqIEBkZXByZWNhdGVkIE9ubHkgZm9yIGNvZGUgZ2VuZXJhdG9yIHVzZS4gKi9cbiAgICAkdWk6IHR5cGVvZiBtZXRob2RzO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VVbmljb3JuUGhwQWRhcHRlcihhcHA/OiBVbmljb3JuQXBwKSB7XG4gIGFwcCA/Pz0gdXNlVW5pY29ybigpO1xuXG4gIGFwcC51c2UoVW5pY29yblBocEFkYXB0ZXIpO1xuXG4gIHJldHVybiBhcHAuJHVpO1xufVxuXG5jb25zdCBtZXRob2RzID0ge1xuICByZXBlYXRhYmxlOiB1c2VGaWVsZFJlcGVhdGFibGUsXG4gIGZsYXRwaWNrcjogdXNlRmllbGRGbGF0cGlja3IsXG4gIGZpbGVEcmFnOiB1c2VGaWVsZEZpbGVEcmFnLFxuICBtb2RhbEZpZWxkOiB1c2VGaWVsZE1vZGFsU2VsZWN0LFxuICBjYXNjYWRlU2VsZWN0OiB1c2VGaWVsZENhc2NhZGVTZWxlY3QsXG4gIHNpZDogdXNlRmllbGRTaW5nbGVJbWFnZURyYWcsXG4gIHRpbnltY2U6IHtcbiAgICBpbml0OiB1c2VUaW55bWNlXG4gIH0sXG4gIHMzVXBsb2FkZXI6IHVzZVMzVXBsb2FkZXIsXG4gIGlmcmFtZU1vZGFsOiB1c2VJZnJhbWVNb2RhbCxcbiAgaW5pdFNob3dPbjogdXNlU2hvd09uLFxuICBtb2RhbFRyZWU6IHVzZUZpZWxkTW9kYWxUcmVlLFxuICBtdWx0aVVwbG9hZGVyOiB1c2VGaWVsZE11bHRpVXBsb2FkZXIsXG59O1xuXG5leHBvcnQgY2xhc3MgVW5pY29yblBocEFkYXB0ZXIge1xuICBzdGF0aWMgaW5zdGFsbChhcHA6IFVuaWNvcm5BcHApIHtcbiAgICBpZiAoYXBwLiR1aSkge1xuICAgICAgYXBwLiR1aSA9IHsgLi4uYXBwLiR1aSwgLi4ubWV0aG9kcyB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBhcHAuJHVpID0gbWV0aG9kcztcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IEluamVjdGlvbktleSwgVW5pY29ybkFwcCB9IGZyb20gJy4vYXBwJztcbmltcG9ydCB7IHBvbHlmaWxsIH0gZnJvbSAnLi9wb2x5ZmlsbCc7XG5pbXBvcnQgeyByZW1vdmVDbG9hayB9IGZyb20gJy4vdXRpbGl0aWVzJztcblxuZXhwb3J0ICogZnJvbSAnLi9kYXRhJztcbmV4cG9ydCAqIGZyb20gJy4vZXZlbnRzJztcbmV4cG9ydCAqIGZyb20gJy4vc2VydmljZSc7XG5leHBvcnQgKiBmcm9tICcuL2NvbXBvc2FibGUnO1xuZXhwb3J0ICogZnJvbSAnLi9wbHVnaW4nO1xuXG5leHBvcnQgdHlwZSB7IFVuaWNvcm5BcHAgfTtcblxubGV0IGFwcDogVW5pY29ybkFwcDtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVVuaWNvcm4oKTogVW5pY29ybkFwcCB7XG4gIHBvbHlmaWxsKCk7XG4gIHJlbW92ZUNsb2FrKCk7XG5cbiAgcmV0dXJuIGFwcCA9IG5ldyBVbmljb3JuQXBwKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVVbmljb3JuV2l0aFBsdWdpbnMoKTogVW5pY29ybkFwcCB7XG4gIGNvbnN0IGFwcCA9IGNyZWF0ZVVuaWNvcm4oKTtcblxuICAvLyBhcHAudXNlKFVuaWNvcm5VSSk7XG5cbiAgLy8gYXBwLnVzZShVbmljb3JuRG9tKTtcblxuICByZXR1cm4gYXBwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXNlVW5pY29ybihpbnN0YW5jZT86IFVuaWNvcm5BcHApOiBVbmljb3JuQXBwIHtcbiAgaWYgKGluc3RhbmNlKSB7XG4gICAgYXBwID0gaW5zdGFuY2U7XG4gIH1cblxuICByZXR1cm4gYXBwID8/PSBjcmVhdGVVbmljb3JuKCk7XG59XG5cbmV4cG9ydCBjb25zdCB1c2VJbmplY3Q6IHR5cGVvZiBVbmljb3JuQXBwLnByb3RvdHlwZS5pbmplY3QgPSA8VCA9IGFueT4oaWQ6IEluamVjdGlvbktleTxUPiwgZGVmPzogVCk6IFQgPT4ge1xuICByZXR1cm4gdXNlVW5pY29ybigpLmluamVjdDxUPihpZCwgZGVmKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHB1c2hVbmljb3JuVG9HbG9iYWwoYXBwPzogVW5pY29ybkFwcCkge1xuICAvLyBAdHMtaWdub3JlXG4gIHdpbmRvdy51ID0gYXBwID8/IHVzZVVuaWNvcm4oKTtcbn1cbiJdLCJuYW1lcyI6WyJyZW1vdmVEYXRhIiwiaHRtbCIsInNlbGVjdG9yIiwiY2FsbGJhY2siLCJjc3MiLCJxdWV1ZSIsIndhaXQiLCJzcHJpbnRmIiwidnNwcmludGYiLCJtIiwibW9kdWxlIiwidWkiLCJzdGFjayIsInVyaSIsImFzc2V0Iiwicm91dGUiLCJybWRhdGEiLCJwcm90b0NoYWluIiwiZGVjb3JhdG9ycyIsImFwcCJdLCJtYXBwaW5ncyI6IkFBQ08sU0FBUyxjQUFjLEtBQXND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QixTQUFTLE1BQU07QUFDOUMsVUFBTSxJQUFJLGlCQUFpQiw2REFBaUUsVUFBVSxLQUFLLElBQUk7QUFBQSxFQUNqSDtBQUNGO0FDM0JPLFNBQVMsV0FBVztBQUV6QixNQUFJLE9BQU8sV0FBVyxhQUFhO0FBQ2pDLHNCQUFrQixnQkFBZ0IsU0FBUztBQUFBLEVBQzdDO0FBQ0Y7QUNSQSxlQUFzQix3QkFBd0I7QUFDNUMsUUFBTSxPQUFPLG9DQUFnQztBQUMvQztBQ09BLGVBQXNCLFdBQ3BCLFVBQ0EsVUFBK0IsSUFDakI7QUFDZCxRQUFNUixVQUFTLE1BQU0sT0FBTyx1QkFBbUI7QUFFL0MsTUFBSSxVQUFVO0FBQ1osV0FBT0EsUUFBTyxJQUFJLFVBQVUsT0FBTztBQUFBLEVBQ3JDO0FBRUEsU0FBT0E7QUFDVDtBQ1VPLFNBQVMscUJBQXFCUyxNQUFrQjtBQUNyRCxFQUFBQSxTQUFRLFdBQUE7QUFFUixFQUFBQSxLQUFJLElBQUksaUJBQWlCO0FBRXpCLFNBQU9BLEtBQUk7QUFDYjtBQUVBLE1BQU0sVUFBVTtBQUFBLEVBQ2QsWUFBWTtBQUFBLEVBQ1osV0FBVztBQUFBLEVBQ1gsVUFBVTtBQUFBLEVBQ1YsWUFBWTtBQUFBLEVBQ1osZUFBZTtBQUFBLEVBQ2YsS0FBSztBQUFBLEVBQ0wsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLEVBQUE7QUFBQSxFQUVSLFlBQVk7QUFBQSxFQUNaLGFBQWE7QUFBQSxFQUNiLFlBQVk7QUFBQSxFQUNaLFdBQVc7QUFBQSxFQUNYLGVBQWU7QUFDakI7QUFFTyxNQUFNLGtCQUFrQjtBQUFBLEVBQzdCLE9BQU8sUUFBUUEsTUFBaUI7QUFDOUIsUUFBSUEsS0FBSSxLQUFLO0FBQ1gsTUFBQUEsS0FBSSxNQUFNLEVBQUUsR0FBR0EsS0FBSSxLQUFLLEdBQUcsUUFBQTtBQUFBLElBQzdCLE9BQU87QUFDTCxNQUFBQSxLQUFJLE1BQU07QUFBQSxJQUNaO0FBQUEsRUFDRjtBQUNGO0FDbkRBLElBQUk7QUFFRyxTQUFTLGdCQUE0QjtBQUMxQyxXQUFBO0FBQ0EsY0FBQTtBQUVBLFNBQU8sTUFBTSxJQUFJLFdBQUE7QUFDbkI7QUFFTyxTQUFTLDJCQUF1QztBQUNyRCxRQUFNQSxPQUFNLGNBQUE7QUFNWixTQUFPQTtBQUNUO0FBRU8sU0FBUyxXQUFXLFVBQW1DO0FBQzVELE1BQUksVUFBVTtBQUNaLFVBQU07QUFBQSxFQUNSO0FBRUEsU0FBTyxRQUFRLGNBQUE7QUFDakI7QUFFTyxNQUFNLFlBQWdELENBQVUsSUFBcUIsUUFBZTtBQUN6RyxTQUFPLFdBQUEsRUFBYSxPQUFVLElBQUksR0FBRztBQUN2QztBQUVPLFNBQVMsb0JBQW9CQSxNQUFrQjtBQUVwRCxTQUFPLElBQUlBLFFBQU8sV0FBQTtBQUNwQjsiLCJ4X2dvb2dsZV9pZ25vcmVMaXN0IjpbNCw1LDYsNyw4LDksMTAsMTMsMzksNDNdfQ==
