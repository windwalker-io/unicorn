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
  const m = await import("./checkboxes-multi-select-l4nIvOzE.js");
  if (selector) {
    m.CheckboxesMultiSelect.handle(selector, options);
  }
  return m;
}
async function useFieldCascadeSelect() {
  const module2 = await import("./field-cascade-select-Bd5X-8PJ.js");
  await module2.ready;
  return module2;
}
async function useFieldFileDrag() {
  const module2 = await import("./field-file-drag-BqYsRKPZ.js");
  await module2.ready;
  return module2;
}
function useFieldFlatpickr() {
  return import("./field-flatpickr-Bc5oDN_K.js");
}
function useFieldModalSelect() {
  return import("./field-modal-select-DEpsKFJm.js");
}
function useFieldModalTree() {
  import("./field-modal-tree-BKoGHFtK.js");
}
async function useFieldRepeatable() {
  const module2 = await import("./field-repeatable-BIhBjzSk.js");
  await module2.ready;
  return module2;
}
function useFieldSingleImageDrag() {
  return import("./field-single-image-drag-OBZkp_mK.js");
}
async function useForm(ele, options = {}) {
  const { UnicornFormElement } = await import("./form-BTIsx4Am.js");
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
  const { UnicornGridElement } = await import("./grid-_2qR0bTi.js");
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
  const { UnicornHttpClient } = await import("./http-client-DvfSHhAn.js");
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
  const module2 = await import("./iframe-modal-CofGo_bs.js");
  await module2.ready;
  return module2;
}
async function useListDependent(element, dependent, options = {}) {
  const module2 = await import("./list-dependent-N7r_ddib.js");
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
  const module2 = await import("./s3-uploader-BrLYI6Ip.js");
  if (!name) {
    return module2;
  }
  const { get } = module2;
  return get(name, options);
}
async function useS3MultipartUploader(options) {
  const module2 = await import("./s3-multipart-uploader-BMy8DkFh.js");
  if (options != null) {
    return new module2.S3MultipartUploader(options);
  }
  return module2;
}
async function useShowOn() {
  const module2 = await import("./show-on-D2pP6kE6.js");
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
  const { UIBootstrap5 } = await import("./ui-bootstrap5-DU7ZbN1e.js");
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
  const module2 = await import("./validation-D4SIIYMY.js");
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
  macro(name, callback) {
    if (this[name]) {
      throw new Error(`Macro: ${name} already exists.`);
    }
    this[name] = callback;
    return this;
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
  await import("./field-multi-uploader-CuRkw4QA.js");
}
async function useTinymce(selector, options = {}) {
  const module2 = await import("./tinymce-DpWPfIDb.js");
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
function useMacro(name, handler) {
  useUnicorn().macro(name, handler);
}
async function useLegacy(app2) {
  app2 ??= useUnicorn();
  pushUnicornToGlobal(app2);
  const { useLegacyMethods: useLegacyMethods2 } = await import("./legacy-BsrR6jqd.js");
  await useLegacyMethods2(app2);
  return app2;
}
export {
  useBs5Tooltip as $,
  h as A,
  html as B,
  delegate as C,
  debounce as D,
  throttle as E,
  simpleConfirm as F,
  simpleAlert as G,
  sprintfExports as H,
  base64UrlEncode as I,
  base64UrlDecode as J,
  uid as K,
  tid as L,
  serial as M,
  mark as N,
  useTomSelect as O,
  slideUp as P,
  slideDown as Q,
  slideToggle as R,
  fadeOut as S,
  fadeIn as T,
  highlight as U,
  useColorPicker as V,
  useDisableOnSubmit as W,
  useDisableIfStackNotEmpty as X,
  useCheckboxesMultiSelect as Y,
  useKeepAlive as Z,
  __ as _,
  useUniDirective as a,
  useBs5KeepTab as a$,
  prepareAlpineDefer as a0,
  mergeDeep as a1,
  useLoadedHttpClient as a2,
  injectCssToDocument as a3,
  useImport as a4,
  useCssImport as a5,
  data as a6,
  forceArray as a7,
  deleteConfirm as a8,
  Mixin as a9,
  useVueComponentField as aA,
  addUriBase as aB,
  UnicornSystemUri as aC,
  UnicornAssetUri as aD,
  addRoute as aE,
  hasRoute as aF,
  addQuery as aG,
  parseQuery as aH,
  buildQuery as aI,
  useFieldCascadeSelect as aJ,
  useFieldFileDrag as aK,
  useFieldFlatpickr as aL,
  useFieldModalSelect as aM,
  useFieldModalTree as aN,
  useFieldRepeatable as aO,
  useFieldSingleImageDrag as aP,
  useForm as aQ,
  useFormComponent as aR,
  useGrid as aS,
  useGridComponent as aT,
  useIframeModal as aU,
  useListDependent as aV,
  useS3Uploader as aW,
  useS3MultipartUploader as aX,
  useShowOn as aY,
  createStack as aZ,
  useUIBootstrap5 as a_,
  EventMixin as aa,
  createQueue as ab,
  trans as ac,
  useUITheme as ad,
  sleep as ae,
  createUnicorn as af,
  createUnicornWithPlugins as ag,
  useUnicorn as ah,
  useInject as ai,
  pushUnicornToGlobal as aj,
  useMacro as ak,
  useLegacy as al,
  removeData as am,
  EventBus as an,
  randomBytes as ao,
  randomBytesString as ap,
  nextTick as aq,
  wait as ar,
  useLang as as,
  useScriptImport as at,
  doImport as au,
  useSeriesImport as av,
  useCssIncludes as aw,
  AlertAdapter as ax,
  useUI as ay,
  UnicornUI as az,
  animateTo as b,
  useBs5ButtonRadio as b0,
  useWebDirective as b1,
  useUnicornPhpAdapter as b2,
  UnicornPhpAdapter as b3,
  renderMessage as c,
  clearMessages as d,
  clearNotifies as e,
  initAlpineComponent as f,
  useFormValidation as g,
  addGlobalValidator as h,
  isDebug as i,
  useFieldValidationSync as j,
  useFormValidationSync as k,
  loadAlpine as l,
  useStack as m,
  notify as n,
  useQueue as o,
  prepareAlpine as p,
  useSystemUri as q,
  route as r,
  useAssetUri as s,
  domready as t,
  useHttpClient as u,
  selectOne as v,
  selectAll as w,
  getBoundedInstance as x,
  getBoundedInstanceList as y,
  module as z
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pY29ybi1HNWxlSE81Vi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxpdGllcy9hcnIudHMiLCIuLi8uLi9zcmMvdXRpbGl0aWVzL2RhdGEudHMiLCIuLi8uLi9zcmMvc2VydmljZS9kb20udHMiLCIuLi8uLi9zcmMvc2VydmljZS9hbmltYXRlLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BseXJhc29mdC90cy10b29sa2l0L3NyYy9nZW5lcmljL2FsZXJ0LWFkYXB0ZXIudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGx5cmFzb2Z0L3RzLXRvb2xraXQvc3JjL2dlbmVyaWMvYWxlcnQudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGx5cmFzb2Z0L3RzLXRvb2xraXQvc3JjL2dlbmVyaWMvZW52LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BseXJhc29mdC90cy10b29sa2l0L3NyYy9nZW5lcmljL2NyeXB0by50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AbHlyYXNvZnQvdHMtdG9vbGtpdC9zcmMvZ2VuZXJpYy9xdWV1ZS50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AbHlyYXNvZnQvdHMtdG9vbGtpdC9zcmMvZ2VuZXJpYy9zdGFjay50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AbHlyYXNvZnQvdHMtdG9vbGtpdC9zcmMvZ2VuZXJpYy90aW1pbmcudHMiLCIuLi8uLi9zcmMvc2VydmljZS9jcnlwdG8udHMiLCIuLi8uLi9zcmMvc2VydmljZS9oZWxwZXIudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ByaW50Zi1qcy9zcmMvc3ByaW50Zi5qcyIsIi4uLy4uL3NyYy9zZXJ2aWNlL2xhbmcudHMiLCIuLi8uLi9zcmMvc2VydmljZS9sb2FkZXIudHMiLCIuLi8uLi9zcmMvY29tcG9zYWJsZS91c2VDaGVja2JveGVzTXVsdGlTZWxlY3QudHMiLCIuLi8uLi9zcmMvY29tcG9zYWJsZS91c2VGaWVsZENhc2NhZGVTZWxlY3QudHMiLCIuLi8uLi9zcmMvY29tcG9zYWJsZS91c2VGaWVsZEZpbGVEcmFnLnRzIiwiLi4vLi4vc3JjL2NvbXBvc2FibGUvdXNlRmllbGRGbGF0cGlja3IudHMiLCIuLi8uLi9zcmMvY29tcG9zYWJsZS91c2VGaWVsZE1vZGFsU2VsZWN0LnRzIiwiLi4vLi4vc3JjL2NvbXBvc2FibGUvdXNlRmllbGRNb2RhbFRyZWUudHMiLCIuLi8uLi9zcmMvY29tcG9zYWJsZS91c2VGaWVsZFJlcGVhdGFibGUudHMiLCIuLi8uLi9zcmMvY29tcG9zYWJsZS91c2VGaWVsZFNpbmdsZUltYWdlRHJhZy50cyIsIi4uLy4uL3NyYy9jb21wb3NhYmxlL3VzZUZvcm0udHMiLCIuLi8uLi9zcmMvY29tcG9zYWJsZS91c2VHcmlkLnRzIiwiLi4vLi4vc3JjL2NvbXBvc2FibGUvdXNlSHR0cC50cyIsIi4uLy4uL3NyYy9jb21wb3NhYmxlL3VzZUlmcmFtZU1vZGFsLnRzIiwiLi4vLi4vc3JjL2NvbXBvc2FibGUvdXNlTGlzdERlcGVuZGVudC50cyIsIi4uLy4uL3NyYy9jb21wb3NhYmxlL3VzZVF1ZXVlLnRzIiwiLi4vLi4vc3JjL2NvbXBvc2FibGUvdXNlUzNVcGxvYWRlci50cyIsIi4uLy4uL3NyYy9jb21wb3NhYmxlL3VzZVNob3dPbi50cyIsIi4uLy4uL3NyYy9jb21wb3NhYmxlL3VzZVN0YWNrLnRzIiwiLi4vLi4vc3JjL2NvbXBvc2FibGUvdXNlVG9tU2VsZWN0LnRzIiwiLi4vLi4vc3JjL2NvbXBvc2FibGUvdXNlVUlCb290c3RyYXA1LnRzIiwiLi4vLi4vc3JjL2NvbXBvc2FibGUvdXNlVW5pRGlyZWN0aXZlLnRzIiwiLi4vLi4vc3JjL2NvbXBvc2FibGUvdXNlVmFsaWRhdGlvbi50cyIsIi4uLy4uL3NyYy9zZXJ2aWNlL3VpLnRzIiwiLi4vLi4vc3JjL3NlcnZpY2UvdXJpLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Fzcy9kaXN0L3Fzcy5tanMiLCIuLi8uLi9zcmMvc2VydmljZS9yb3V0ZXIudHMiLCIuLi8uLi9zcmMvdXRpbGl0aWVzL2Jhc2UudHMiLCIuLi8uLi9zcmMvZGF0YS50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy90cy1taXhlci9kaXN0L2VzbS9pbmRleC5qcyIsIi4uLy4uL3NyYy9ldmVudHMudHMiLCIuLi8uLi9zcmMvYXBwLnRzIiwiLi4vLi4vc3JjL3BvbHlmaWxsL2Zvcm0tcmVxdWVzdC1zdWJtaXQudHMiLCIuLi8uLi9zcmMvcG9seWZpbGwvaW5kZXgudHMiLCIuLi8uLi9zcmMvY29tcG9zYWJsZS91c2VGaWVsZE11bHRpVXBsb2FkZXIudHMiLCIuLi8uLi9zcmMvY29tcG9zYWJsZS91c2VUaW55bWNlLnRzIiwiLi4vLi4vc3JjL3BsdWdpbi9waHAtYWRhcHRlci50cyIsIi4uLy4uL3NyYy91bmljb3JuLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlxuZXhwb3J0IGZ1bmN0aW9uIGlzUGxhaW5PYmplY3QodmFsOiBhbnkpOiB2YWwgaXMgUmVjb3JkPHN0cmluZywgYW55PiB7XG4gIHJldHVybiB2YWwgJiYgdHlwZW9mIHZhbCA9PT0gXCJvYmplY3RcIiAmJiAhQXJyYXkuaXNBcnJheSh2YWwpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VEZWVwPFQgPSBSZWNvcmQ8c3RyaW5nLCBhbnk+Pih0YXJnZXQ6IFBhcnRpYWw8VD4sIC4uLnNvdXJjZXM6IGFueVtdKTogVCB7XG4gIGxldCBvdXQ6IGFueSA9IGlzUGxhaW5PYmplY3QodGFyZ2V0KSA/IHsgLi4udGFyZ2V0IH0gOiB0YXJnZXQ7XG5cbiAgZm9yIChjb25zdCBzb3VyY2Ugb2Ygc291cmNlcykge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHNvdXJjZSkpIHtcbiAgICAgIG91dCA9IChBcnJheS5pc0FycmF5KG91dCkgPyBvdXQuY29uY2F0KHNvdXJjZSkgOiBzb3VyY2UpIGFzIFQ7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKGlzUGxhaW5PYmplY3Qoc291cmNlKSkge1xuICAgICAgb3V0ID0geyAuLi4oaXNQbGFpbk9iamVjdChvdXQpID8gb3V0IDoge30pIH07XG4gICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhzb3VyY2UpKSB7XG4gICAgICAgIG91dFtrZXldID1cbiAgICAgICAgICBrZXkgaW4gb3V0ID8gbWVyZ2VEZWVwKG91dFtrZXldLCBzb3VyY2Vba2V5XSkgOiBzb3VyY2Vba2V5XTtcbiAgICAgIH1cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBvdXQgPSBzb3VyY2UgYXMgVDtcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuIiwiXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGF0YShlbGVtZW50OiBFbGVtZW50LCBuYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQpIHtcbiAgcHJlcGFyZURhdGEoZWxlbWVudCk7XG5cbiAgaWYgKG5hbWUgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBlbGVtZW50Ll9fdW5pY29ybjtcbiAgfVxuXG4gIHJldHVybiBlbGVtZW50Ll9fdW5pY29ybltuYW1lXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldERhdGEoZWxlbWVudDogRWxlbWVudCwgbmFtZTogc3RyaW5nLCB2YWx1ZTogYW55KSB7XG4gIHByZXBhcmVEYXRhKGVsZW1lbnQpO1xuICBlbGVtZW50Ll9fdW5pY29ybltuYW1lXSA9IHZhbHVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVmRGF0YShlbGVtZW50OiBFbGVtZW50LCBuYW1lOiBzdHJpbmcsIGRlZkNhbGxiYWNrOiBGdW5jdGlvbikge1xuICBwcmVwYXJlRGF0YShlbGVtZW50KTtcbiAgZWxlbWVudC5fX3VuaWNvcm5bbmFtZV0gPSBlbGVtZW50Ll9fdW5pY29ybltuYW1lXSB8fCBkZWZDYWxsYmFjayhlbGVtZW50KTtcblxuICByZXR1cm4gZWxlbWVudC5fX3VuaWNvcm5bbmFtZV07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVEYXRhKGVsZW1lbnQ6IEVsZW1lbnQsIG5hbWU6IHN0cmluZykge1xuICBwcmVwYXJlRGF0YShlbGVtZW50KTtcblxuICBjb25zdCB2ID0gZWxlbWVudC5fX3VuaWNvcm5bbmFtZV07XG4gIGRlbGV0ZSBlbGVtZW50Ll9fdW5pY29ybltuYW1lXTtcblxuICByZXR1cm4gdjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByZXBhcmVEYXRhPFQgZXh0ZW5kcyBOb2RlPihlbGVtZW50OiBUKTogVCB7XG4gIGlmICghZWxlbWVudCkge1xuICAgIHJldHVybiBlbGVtZW50O1xuICB9XG5cbiAgZWxlbWVudC5fX3VuaWNvcm4gPSBlbGVtZW50Ll9fdW5pY29ybiB8fCB7fTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgaW50ZXJmYWNlIE5vZGUge1xuICAgIF9fdW5pY29ybj86IGFueTtcbiAgfVxufVxuXG5cbiIsImltcG9ydCB7IGRlZkRhdGEgfSBmcm9tICcuLi91dGlsaXRpZXMnO1xyXG5cclxuLyoqXHJcbiAqIEBzZWUgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzk4OTk3MDFcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBkb21yZWFkeShjYWxsYmFjaz86ICgodmFsdWU6IGFueSkgPT4gYW55KSk6IFByb21pc2U8dm9pZD4ge1xyXG4gIGxldCBwcm9taXNlID0gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUpID0+IHtcclxuICAgIC8vIHNlZSBpZiBET00gaXMgYWxyZWFkeSBhdmFpbGFibGVcclxuICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnIHx8IGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdpbnRlcmFjdGl2ZScpIHtcclxuICAgICAgLy8gY2FsbCBvbiBuZXh0IGF2YWlsYWJsZSB0aWNrXHJcbiAgICAgIHNldFRpbWVvdXQocmVzb2x2ZSwgMCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4gcmVzb2x2ZSgpKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKGNhbGxiYWNrKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBwcm9taXNlO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0T25lPEsgZXh0ZW5kcyBrZXlvZiBIVE1MRWxlbWVudFRhZ05hbWVNYXA+KGVsZTogSyk6IEhUTUxFbGVtZW50VGFnTmFtZU1hcFtLXSB8IG51bGw7XHJcbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RPbmU8RSBleHRlbmRzIEVsZW1lbnQgPSBFbGVtZW50PihlbGU6IHN0cmluZyk6IEUgfCBudWxsO1xyXG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0T25lPEUgZXh0ZW5kcyBFbGVtZW50ID0gRWxlbWVudD4oZWxlOiBFKTogRTtcclxuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdE9uZTxFIGV4dGVuZHMgRWxlbWVudCA9IEVsZW1lbnQ+KGVsZTogc3RyaW5nIHwgRSk6IEUgfCBudWxsO1xyXG4vLyBzZWxlY3RPbmUoZWxlOiBzdHJpbmcpOiBFbGVtZW50O1xyXG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0T25lPEUgZXh0ZW5kcyBFbGVtZW50ID0gRWxlbWVudD4oZWxlOiBFIHwgc3RyaW5nKTogRSB8IG51bGwge1xyXG4gIGxldCByOiBFIHwgbnVsbDtcclxuXHJcbiAgaWYgKHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICByID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxFPihlbGUpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByID0gZWxlO1xyXG4gIH1cclxuXHJcbiAgaWYgKCFyKSB7XHJcbiAgICByZXR1cm4gcjtcclxuICB9XHJcblxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0QWxsPEUgZXh0ZW5kcyBFbGVtZW50ID0gRWxlbWVudD4oZWxlOiBzdHJpbmcsIGNhbGxiYWNrPzogKChlbGU6IEUpID0+IGFueSkpOiBFW107XHJcbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RBbGw8RSBleHRlbmRzIEVsZW1lbnQgPSBFbGVtZW50PihlbGU6IE5vZGVMaXN0T2Y8RT4gfCBFW10sIGNhbGxiYWNrPzogKChlbGU6IEUpID0+IGFueSkpOiBFW107XHJcbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RBbGw8RSBleHRlbmRzIEVsZW1lbnQgPSBFbGVtZW50PihcclxuICBlbGU6IHN0cmluZyB8IE5vZGVMaXN0T2Y8RT4gfCBFW10sXHJcbiAgY2FsbGJhY2s/OiAoKGVsZTogRSkgPT4gYW55KVxyXG4pOiBFW107XHJcbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RBbGw8RSBleHRlbmRzIGtleW9mIEhUTUxFbGVtZW50VGFnTmFtZU1hcD4oXHJcbiAgZWxlOiBFLFxyXG4gIGNhbGxiYWNrPzogKChlbGU6IEhUTUxFbGVtZW50VGFnTmFtZU1hcFtFXSkgPT4gYW55KVxyXG4pOiBIVE1MRWxlbWVudFRhZ05hbWVNYXBbRV1bXTtcclxuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdEFsbChcclxuICBlbGU6IE5vZGVMaXN0T2Y8RWxlbWVudD4gfCBFbGVtZW50W10gfCBzdHJpbmcsXHJcbiAgY2FsbGJhY2s6ICgoZWw6IEVsZW1lbnQpID0+IGFueSkgfCB1bmRlZmluZWQgPSB1bmRlZmluZWRcclxuKTogRWxlbWVudFtdIHtcclxuICBpZiAodHlwZW9mIGVsZSA9PT0gJ3N0cmluZycpIHtcclxuICAgIGVsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoZWxlKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IHJlc3VsdFNldDogRWxlbWVudFtdID0gW10uc2xpY2UuY2FsbChlbGUpO1xyXG5cclxuICBpZiAoY2FsbGJhY2spIHtcclxuICAgIHJldHVybiByZXN1bHRTZXQubWFwKChlbCkgPT4gY2FsbGJhY2soZWwpIHx8IGVsKTtcclxuICB9XHJcblxyXG4gIHJldHVybiByZXN1bHRTZXQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRCb3VuZGVkSW5zdGFuY2U8VCA9IGFueSwgRSA9IEVsZW1lbnQ+KHNlbGVjdG9yOiBFLCBuYW1lOiBzdHJpbmcsIGNhbGxiYWNrPzogKChlbDogRSkgPT4gYW55KSk6IFQ7XHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRCb3VuZGVkSW5zdGFuY2U8VCA9IGFueSwgRSBleHRlbmRzIEVsZW1lbnQgPSBFbGVtZW50PihcclxuICBzZWxlY3Rvcjogc3RyaW5nIHwgRSxcclxuICBuYW1lOiBzdHJpbmcsXHJcbiAgY2FsbGJhY2s/OiAoKGVsOiBFKSA9PiBhbnkpXHJcbik6IFQgfCBudWxsO1xyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Qm91bmRlZEluc3RhbmNlPFQgPSBhbnksIEUgZXh0ZW5kcyBFbGVtZW50ID0gRWxlbWVudD4oc2VsZWN0b3I6IHN0cmluZyB8IEUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKChlbDogRSkgPT4gYW55KSA9ICgpID0+IG51bGwpOiBUIHwgbnVsbCB7XHJcbiAgY29uc3QgZWxlbWVudCA9IHR5cGVvZiBzZWxlY3RvciA9PT0gJ3N0cmluZycgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEU+KHNlbGVjdG9yKSA6IHNlbGVjdG9yO1xyXG5cclxuICBpZiAoIWVsZW1lbnQpIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGRlZkRhdGEoZWxlbWVudCwgbmFtZSwgY2FsbGJhY2spO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Qm91bmRlZEluc3RhbmNlTGlzdDxUID0gYW55LCBFIGV4dGVuZHMgRWxlbWVudCA9IEVsZW1lbnQ+KFxyXG4gIHNlbGVjdG9yOiBzdHJpbmcgfCBOb2RlTGlzdE9mPEU+LFxyXG4gIG5hbWU6IHN0cmluZyxcclxuICBjYWxsYmFjazogKChlbDogRSkgPT4gYW55KSA9ICgpID0+IG51bGxcclxuKTogKFQgfCBudWxsKVtdIHtcclxuICBjb25zdCBpdGVtcyA9IHR5cGVvZiBzZWxlY3RvciA9PT0gJ3N0cmluZycgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEU+KHNlbGVjdG9yKSA6IHNlbGVjdG9yO1xyXG5cclxuICByZXR1cm4gQXJyYXkuZnJvbShpdGVtcykubWFwKChlbGU6IEUpID0+IGdldEJvdW5kZWRJbnN0YW5jZShlbGUsIG5hbWUsIGNhbGxiYWNrKSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtb2R1bGU8VCA9IGFueSwgRSBleHRlbmRzIEVsZW1lbnQgPSBFbGVtZW50PihcclxuICBlbGU6IHN0cmluZyxcclxuICBuYW1lOiBzdHJpbmcsXHJcbiAgY2FsbGJhY2s/OiAoKGVsOiBFKSA9PiBhbnkpXHJcbik6IChUIHwgbnVsbClbXTtcclxuZXhwb3J0IGZ1bmN0aW9uIG1vZHVsZTxUID0gYW55LCBFIGV4dGVuZHMgRWxlbWVudCA9IEVsZW1lbnQ+KFxyXG4gIGVsZTogTm9kZUxpc3RPZjxFbGVtZW50PixcclxuICBuYW1lOiBzdHJpbmcsXHJcbiAgY2FsbGJhY2s/OiAoKGVsOiBFKSA9PiBhbnkpKTogKFQgfCBudWxsKVtdO1xyXG5leHBvcnQgZnVuY3Rpb24gbW9kdWxlPFQgPSBhbnksIEUgZXh0ZW5kcyBFbGVtZW50ID0gRWxlbWVudD4oXHJcbiAgZWxlOiBFbGVtZW50LFxyXG4gIG5hbWU6IHN0cmluZyxcclxuICBjYWxsYmFjaz86ICgoZWw6IEUpID0+IGFueSlcclxuKTogVCB8IG51bGw7XHJcbmV4cG9ydCBmdW5jdGlvbiBtb2R1bGU8VCA9IGFueSwgRSBleHRlbmRzIEVsZW1lbnQgPSBFbGVtZW50PihcclxuICBlbGU6IHN0cmluZyB8IEVsZW1lbnQgfCBOb2RlTGlzdE9mPEVsZW1lbnQ+LFxyXG4gIG5hbWU6IHN0cmluZyxcclxuICBjYWxsYmFjaz86ICgoZWw6IEUpID0+IGFueSlcclxuKTogKFQgfCBudWxsKVtdIHwgVCB8IG51bGw7XHJcbmV4cG9ydCBmdW5jdGlvbiBtb2R1bGU8VCA9IGFueSwgRSBleHRlbmRzIEVsZW1lbnQgPSBFbGVtZW50PihcclxuICBlbGU6IHN0cmluZyB8IEUgfCBOb2RlTGlzdE9mPEU+LFxyXG4gIG5hbWU6IHN0cmluZyxcclxuICBjYWxsYmFjazogKChlbDogRSkgPT4gYW55KSA9ICgpID0+IG51bGxcclxuKTogKFQgfCBudWxsKVtdIHwgVCB8IG51bGwge1xyXG4gIGlmICh0eXBlb2YgZWxlID09PSAnc3RyaW5nJykge1xyXG4gICAgcmV0dXJuIGdldEJvdW5kZWRJbnN0YW5jZUxpc3Q8VCwgRT4oZWxlLCBuYW1lLCBjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxuICBpZiAoZWxlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcclxuICAgIHJldHVybiBnZXRCb3VuZGVkSW5zdGFuY2U8VCwgRT4oZWxlLCBuYW1lLCBjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZ2V0Qm91bmRlZEluc3RhbmNlTGlzdDxULCBFPihlbGUgYXMgTm9kZUxpc3RPZjxFPiwgbmFtZSwgY2FsbGJhY2spO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaDxUIGV4dGVuZHMga2V5b2YgSFRNTEVsZW1lbnRUYWdOYW1lTWFwPihcclxuICBlbGVtZW50OiBULFxyXG4gIGF0dHJzPzogUmVjb3JkPHN0cmluZywgYW55PixcclxuICBjb250ZW50PzogYW55XHJcbik6IEhUTUxFbGVtZW50VGFnTmFtZU1hcFtUXVxyXG5leHBvcnQgZnVuY3Rpb24gaChlbGVtZW50OiBzdHJpbmcsIGF0dHJzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge30sIGNvbnRlbnQ6IGFueSA9IHVuZGVmaW5lZCk6IEhUTUxFbGVtZW50IHtcclxuICBjb25zdCBlbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGVsZW1lbnQpO1xyXG5cclxuICBmb3IgKGxldCBpIGluIGF0dHJzKSB7XHJcbiAgICBjb25zdCB2ID0gYXR0cnNbaV07XHJcblxyXG4gICAgZWxlLnNldEF0dHJpYnV0ZShpLCB2KTtcclxuICB9XHJcblxyXG4gIGlmIChjb250ZW50ICE9PSBudWxsKSB7XHJcbiAgICBlbGUuaW5uZXJIVE1MID0gY29udGVudDtcclxuICB9XHJcblxyXG4gIHJldHVybiBlbGU7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBodG1sPFQgZXh0ZW5kcyBFbGVtZW50ID0gSFRNTEVsZW1lbnQ+KGh0bWw6IHN0cmluZyk6IFQge1xyXG4gIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gIGRpdi5pbm5lckhUTUwgPSBodG1sO1xyXG4gIHJldHVybiBkaXYuY2hpbGRyZW5bMF0gYXMgVDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFB1cmUgSlMgdmVyc2lvbiBvZiBqUXVlcnkgZGVsZWdhdGUoKVxyXG4gKlxyXG4gKiBAc2VlIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL2lhZ29icnVuby80ZGIyZWQ2MmRjNDBmYTg0MWJiOWE1YzdkZTkyZjVmOFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGRlbGVnYXRlKFxyXG4gIHdyYXBwZXI6IEVsZW1lbnQgfCBzdHJpbmcsXHJcbiAgc2VsZWN0b3I6IHN0cmluZyxcclxuICBldmVudE5hbWU6IHN0cmluZyxcclxuICBjYWxsYmFjazogKGU6IEV2ZW50KSA9PiB2b2lkXHJcbik6ICgpID0+IHZvaWQge1xyXG4gIGlmICh0eXBlb2Ygc2VsZWN0b3IgPT09ICd1bmRlZmluZWQnIHx8IHNlbGVjdG9yID09PSAnJykge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgcHJvdmlkZWQgc2VsZWN0b3IgaXMgZW1wdHkuJyk7XHJcbiAgfVxyXG5cclxuICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2YgY2FsbGJhY2sgIT09ICdmdW5jdGlvbicpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignUGxlYXNlIHNwZWNpZnkgYW4gY2FsbGJhY2suJyk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBkZWxlZ2F0aW9uU2VsZWN0b3JzTWFwOiBSZWNvcmQ8c3RyaW5nLCBGdW5jdGlvbltdPiA9IHt9O1xyXG5cclxuICBjb25zdCB3cmFwcGVyRWxlbWVudCA9IHNlbGVjdE9uZSh3cmFwcGVyKTtcclxuXHJcbiAgd3JhcHBlckVsZW1lbnQ/LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIGxldCBlbGVtZW50OiBIVE1MRWxlbWVudCB8IG51bGwgPSBldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XHJcbiAgICBsZXQgZm9yY2VCcmVhayA9IGZhbHNlO1xyXG5cclxuICAgIHdoaWxlIChlbGVtZW50ICYmIGVsZW1lbnQgIT09IHdyYXBwZXJFbGVtZW50KSB7XHJcbiAgICAgIGZvciAoY29uc3Qgc2VsZWN0b3IgaW4gZGVsZWdhdGlvblNlbGVjdG9yc01hcCkge1xyXG4gICAgICAgIGlmIChlbGVtZW50Lm1hdGNoZXMoc2VsZWN0b3IpKSB7XHJcbiAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGZvcmNlQnJlYWsgPSB0cnVlO1xyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShcclxuICAgICAgICAgICAgZXZlbnQsXHJcbiAgICAgICAgICAgICdjdXJyZW50VGFyZ2V0JyxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGdldCgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICBjb25zdCBjYWxsYmFja0xpc3QgPSBkZWxlZ2F0aW9uU2VsZWN0b3JzTWFwW3NlbGVjdG9yXTtcclxuXHJcbiAgICAgICAgICBjYWxsYmFja0xpc3QuZm9yRWFjaChmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgY2FsbGJhY2soZXZlbnQpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZm9yY2VCcmVhaykge1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50O1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBpZiAoIWRlbGVnYXRpb25TZWxlY3RvcnNNYXBbc2VsZWN0b3JdKSB7XHJcbiAgICAvLyBBZGQgbmV3IHNlbGVjdG9yIHRvIHRoZSBsaXN0XHJcbiAgICBkZWxlZ2F0aW9uU2VsZWN0b3JzTWFwW3NlbGVjdG9yXSA9IFtjYWxsYmFja107XHJcbiAgfSBlbHNlIHtcclxuICAgIGRlbGVnYXRpb25TZWxlY3RvcnNNYXBbc2VsZWN0b3JdLnB1c2goY2FsbGJhY2spO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGZ1bmN0aW9uIHVuc3Vic2NyaWJlKCkge1xyXG4gICAgaWYgKCFkZWxlZ2F0aW9uU2VsZWN0b3JzTWFwW3NlbGVjdG9yXSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGRlbGVnYXRpb25TZWxlY3RvcnNNYXBbc2VsZWN0b3JdLmxlbmd0aCA+PSAyKSB7XHJcbiAgICAgIGRlbGVnYXRpb25TZWxlY3RvcnNNYXBbc2VsZWN0b3JdID0gZGVsZWdhdGlvblNlbGVjdG9yc01hcFtzZWxlY3Rvcl0uZmlsdGVyKGNiID0+IGNiICE9PSBjYWxsYmFjayk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkZWxldGUgZGVsZWdhdGlvblNlbGVjdG9yc01hcFtzZWxlY3Rvcl07XHJcbiAgICB9XHJcbiAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGluamVjdENzc1RvRG9jdW1lbnQoZG9jOiBEb2N1bWVudCwgLi4uY3NzOiAoc3RyaW5nIHwgQ1NTU3R5bGVTaGVldClbXSk6IENTU1N0eWxlU2hlZXRbXTtcclxuZXhwb3J0IGZ1bmN0aW9uIGluamVjdENzc1RvRG9jdW1lbnQoLi4uY3NzOiAoc3RyaW5nIHwgQ1NTU3R5bGVTaGVldClbXSk6IENTU1N0eWxlU2hlZXRbXTtcclxuZXhwb3J0IGZ1bmN0aW9uIGluamVjdENzc1RvRG9jdW1lbnQoXHJcbiAgZG9jOiBEb2N1bWVudCB8IHN0cmluZyB8IENTU1N0eWxlU2hlZXQsXHJcbiAgLi4uY3NzOiAoc3RyaW5nIHwgQ1NTU3R5bGVTaGVldClbXVxyXG4pOiBDU1NTdHlsZVNoZWV0W10ge1xyXG4gIGlmICghKGRvYyBpbnN0YW5jZW9mIERvY3VtZW50KSkge1xyXG4gICAgY3NzLnB1c2goZG9jKTtcclxuICAgIGRvYyA9IGRvY3VtZW50O1xyXG4gIH1cclxuXHJcbiAgY29uc3Qgc3R5bGVzID0gY3NzLm1hcCgoY3NzKSA9PiB7XHJcbiAgICBpZiAodHlwZW9mIGNzcyA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgY29uc3Qgc3R5bGUgPSBuZXcgQ1NTU3R5bGVTaGVldCgpO1xyXG4gICAgICBzdHlsZS5yZXBsYWNlU3luYyhjc3MpO1xyXG4gICAgICByZXR1cm4gc3R5bGU7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNzcztcclxuICB9KTtcclxuXHJcbiAgZG9jLmFkb3B0ZWRTdHlsZVNoZWV0cyA9IFsuLi5kb2MuYWRvcHRlZFN0eWxlU2hlZXRzLCAuLi5zdHlsZXNdO1xyXG5cclxuICByZXR1cm4gc3R5bGVzO1xyXG59XHJcbiIsImltcG9ydCB7IHNlbGVjdE9uZSB9IGZyb20gJy4vZG9tJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhbmltYXRlVG8oXHJcbiAgZWxlbWVudDogSFRNTEVsZW1lbnQsXHJcbiAgc3R5bGVzOiBQYXJ0aWFsPFJlY29yZDxrZXlvZiBDU1NTdHlsZURlY2xhcmF0aW9uLCBhbnk+PixcclxuICBvcHRpb25zOiBudW1iZXIgfCBLZXlmcmFtZUFuaW1hdGlvbk9wdGlvbnMgPSB7fVxyXG4pOiBBbmltYXRpb24ge1xyXG4gIGVsZW1lbnQgPSBzZWxlY3RPbmUoZWxlbWVudCk7XHJcblxyXG4gIGNvbnN0IGN1cnJlbnRTdHlsZXMgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KTtcclxuICBjb25zdCB0cmFuc2l0aW9uczogUmVjb3JkPHN0cmluZywgYW55W10+ID0ge307XHJcblxyXG4gIGZvciAoY29uc3QgbmFtZSBpbiBzdHlsZXMpIHtcclxuICAgIGNvbnN0IHZhbHVlID0gc3R5bGVzW25hbWVdO1xyXG5cclxuICAgIHRyYW5zaXRpb25zW25hbWVdID0gQXJyYXkuaXNBcnJheSh2YWx1ZSlcclxuICAgICAgPyB2YWx1ZVxyXG4gICAgICA6IFtcclxuICAgICAgICBjdXJyZW50U3R5bGVzLmdldFByb3BlcnR5VmFsdWUobmFtZSksXHJcbiAgICAgICAgdmFsdWVcclxuICAgICAgXTtcclxuICB9XHJcblxyXG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ251bWJlcicpIHtcclxuICAgIG9wdGlvbnMgPSB7IGR1cmF0aW9uOiBvcHRpb25zIH07XHJcbiAgfVxyXG5cclxuICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbihcclxuICAgIHtcclxuICAgICAgZHVyYXRpb246IDQwMCxcclxuICAgICAgZWFzaW5nOiAnbGluZWFyJyxcclxuICAgICAgZmlsbDogJ2JvdGgnXHJcbiAgICB9LFxyXG4gICAgb3B0aW9uc1xyXG4gICk7XHJcblxyXG4gIGNvbnN0IGFuaW1hdGlvbiA9IGVsZW1lbnQuYW5pbWF0ZShcclxuICAgIHRyYW5zaXRpb25zLFxyXG4gICAgb3B0aW9uc1xyXG4gICk7XHJcblxyXG4gIGFuaW1hdGlvbi5hZGRFdmVudExpc3RlbmVyKCdmaW5pc2gnLCAoKSA9PiB7XHJcbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gc3R5bGVzKSB7XHJcbiAgICAgIGNvbnN0IHZhbHVlID0gc3R5bGVzW25hbWVdO1xyXG5cclxuICAgICAgZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcclxuICAgICAgICBuYW1lLFxyXG4gICAgICAgIEFycmF5LmlzQXJyYXkodmFsdWUpXHJcbiAgICAgICAgICA/IHZhbHVlW3ZhbHVlLmxlbmd0aCAtIDFdXHJcbiAgICAgICAgICA6IHZhbHVlXHJcbiAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgYW5pbWF0aW9uLmNhbmNlbCgpO1xyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gYW5pbWF0aW9uO1xyXG59XHJcbiIsImV4cG9ydCB0eXBlIEFsZXJ0SGFuZGxlciA9ICh0aXRsZTogc3RyaW5nLCB0ZXh0Pzogc3RyaW5nLCBpY29uPzogc3RyaW5nLCBleHRyYT86IGFueSkgPT4gUHJvbWlzZTx2b2lkPjtcclxuZXhwb3J0IHR5cGUgQ29uZmlybUhhbmRsZXIgPSAodGl0bGU6IHN0cmluZywgdGV4dD86IHN0cmluZywgaWNvbj86IHN0cmluZywgZXh0cmE/OiBhbnkpID0+IFByb21pc2U8Ym9vbGVhbj47XHJcblxyXG5leHBvcnQgY2xhc3MgQWxlcnRBZGFwdGVyIHtcclxuICBzdGF0aWMgYWxlcnQ6IEFsZXJ0SGFuZGxlciA9IGFzeW5jICh0aXRsZTogc3RyaW5nKSA9PiB3aW5kb3cuYWxlcnQodGl0bGUpO1xyXG4gIHN0YXRpYyBjb25maXJtOiBDb25maXJtSGFuZGxlciA9IGFzeW5jICh0aXRsZTogc3RyaW5nKSA9PiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2U8Ym9vbGVhbj4oKHJlc29sdmUpID0+IHtcclxuICAgICAgY29uc3QgdiA9IGNvbmZpcm0odGl0bGUpO1xyXG5cclxuICAgICAgcmVzb2x2ZSh2KTtcclxuICAgIH0pO1xyXG4gIH07XHJcbiAgc3RhdGljIGRlbGV0ZUNvbmZpcm06IENvbmZpcm1IYW5kbGVyID0gYXN5bmMgKHRpdGxlOiBzdHJpbmcpID0+IHRoaXMuY29uZmlybSh0aXRsZSk7XHJcblxyXG4gIHN0YXRpYyBjb25maXJtVGV4dDogKCkgPT4gc3RyaW5nID0gKCkgPT4gJ+eiuuiqjSc7XHJcbiAgc3RhdGljIGNhbmNlbFRleHQ6ICgpID0+IHN0cmluZyA9ICgpID0+ICflj5bmtognO1xyXG4gIHN0YXRpYyBkZWxldGVUZXh0OiAoKSA9PiBzdHJpbmcgPSAoKSA9PiAn5Yiq6ZmkJztcclxufVxyXG5cclxuIiwiaW1wb3J0IHsgQWxlcnRBZGFwdGVyIH0gZnJvbSAnLi9hbGVydC1hZGFwdGVyJztcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzaW1wbGVBbGVydChcclxuICB0aXRsZTogc3RyaW5nLFxyXG4gIHRleHQ6IHN0cmluZyA9ICcnLFxyXG4gIGljb246IHN0cmluZyA9ICdpbmZvJyxcclxuICBleHRyYT86IGFueVxyXG4pIHtcclxuICByZXR1cm4gQWxlcnRBZGFwdGVyLmFsZXJ0KHRpdGxlLCB0ZXh0LCBpY29uLCBleHRyYSk7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzaW1wbGVDb25maXJtKFxyXG4gIHRpdGxlOiBzdHJpbmcsXHJcbiAgdGV4dDogc3RyaW5nID0gJycsXHJcbiAgaWNvbjogc3RyaW5nID0gJ2luZm8nLFxyXG4gIGV4dHJhPzogYW55LFxyXG4pIHtcclxuICByZXR1cm4gQWxlcnRBZGFwdGVyLmNvbmZpcm0odGl0bGUsIHRleHQsIGljb24sIGV4dHJhKTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZUNvbmZpcm0oXHJcbiAgdGl0bGU6IHN0cmluZyxcclxuICB0ZXh0OiBzdHJpbmcgPSAnJyxcclxuICBpY29uOiBzdHJpbmcgPSAnaW5mbycsXHJcbiAgZXh0cmE/OiBhbnksXHJcbikge1xyXG4gIHJldHVybiBBbGVydEFkYXB0ZXIuZGVsZXRlQ29uZmlybSh0aXRsZSwgdGV4dCwgaWNvbiwgZXh0cmEpO1xyXG59XHJcbiIsIlxuZXhwb3J0IGZ1bmN0aW9uIGdldEdsb2JhbFRoaXMoKSB7XG4gIHJldHVybiBnbG9iYWxUaGlzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNCcm93c2VyKCkge1xuICByZXR1cm4gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc05vZGUoKSB7XG4gIHJldHVybiB0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJztcbn1cbiIsImltcG9ydCB7IGlzTm9kZSB9IGZyb20gJy4vZW52JztcblxuZXhwb3J0IGZ1bmN0aW9uIGJhc2U2NFVybEVuY29kZShzdHJpbmc6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBidG9hKFN0cmluZyhzdHJpbmcpKVxuICAgIC5yZXBsYWNlKC9cXCsvLCAnLScpXG4gICAgLnJlcGxhY2UobmV3IFJlZ0V4cCgnXFxcXC8nKSwgJ18nKVxuICAgIC5yZXBsYWNlKC89KyQvLCAnJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBiYXNlNjRVcmxEZWNvZGUoc3RyaW5nOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gYXRvYihcbiAgICBTdHJpbmcoc3RyaW5nKVxuICAgICAgLnJlcGxhY2UoLy0vLCAnKycpXG4gICAgICAucmVwbGFjZSgvXy8sICcvJylcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVpZChwcmVmaXg6IHN0cmluZyA9ICcnLCB0aW1lYmFzZTogYm9vbGVhbiA9IGZhbHNlKTogc3RyaW5nIHtcbiAgaWYgKHRpbWViYXNlKSB7XG4gICAgY29uc3Qgc3RhcnQgPSBwZXJmb3JtYW5jZT8udGltZU9yaWdpblxuICAgICAgPyBNYXRoLnJvdW5kKHBlcmZvcm1hbmNlLnRpbWVPcmlnaW4pXG4gICAgICA6IHBlcmZvcm1hbmNlLnRpbWluZy5uYXZpZ2F0aW9uU3RhcnQ7XG5cbiAgICBjb25zdCB0aW1lID0gKHN0YXJ0ICogMTAwMDAwKSArIChwZXJmb3JtYW5jZS5ub3coKSAqIDEwMCk7XG5cbiAgICByZXR1cm4gcHJlZml4ICsgdGltZS50b1N0cmluZygxMikgKyAocmFuZG9tQnl0ZXNTdHJpbmcoNCkpO1xuICB9XG5cbiAgcmV0dXJuIHByZWZpeCArIHJhbmRvbUJ5dGVzU3RyaW5nKDEyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRpZChwcmVmaXg6IHN0cmluZyA9ICcnKTogc3RyaW5nIHtcbiAgcmV0dXJuIHVpZChwcmVmaXgsIHRydWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmFuZG9tQnl0ZXNTdHJpbmcoc2l6ZTogbnVtYmVyID0gMTIpOiBzdHJpbmcge1xuICBpZiAoIWlzTm9kZSgpICYmICFnbG9iYWxUaGlzLmNyeXB0bykge1xuICAgIHJldHVybiBTdHJpbmcoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKHNpemUgKiogMTApKSk7XG4gIH1cblxuICByZXR1cm4gQXJyYXkuZnJvbShyYW5kb21CeXRlcyhzaXplKSlcbiAgICAubWFwKHggPT4geC50b1N0cmluZygxNikucGFkU3RhcnQoMiwgJzAnKSlcbiAgICAuam9pbignJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByYW5kb21CeXRlcyhzaXplOiBudW1iZXIgPSAxMik6IFVpbnQ4QXJyYXkge1xuICBjb25zdCBhcnIgPSBuZXcgVWludDhBcnJheShzaXplKTtcbiAgZ2xvYmFsVGhpcy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKGFycik7XG4gIHJldHVybiBhcnI7XG59XG5cbmV4cG9ydCBjb25zdCBTVFJfU0VFRF9CQVNFMzIgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVoyMzQ1NjcnO1xuZXhwb3J0IGNvbnN0IFNUUl9TRUVEX0JBU0UzMkhFWCA9ICcwMTIzNDU2Nzg5QUJDREVGR0hJSktMTU5PUFFSU1RVVic7XG5leHBvcnQgY29uc3QgU1RSX1NFRURfQkFTRTM2ID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaMDEyMzQ1Njc4OSc7XG5leHBvcnQgY29uc3QgU1RSX1NFRURfQkFTRTU4ID0gJzEyMzQ1Njc4OUFCQ0RFRkdISktMTU5QUVJTVFVWV1hZWmFiY2RlZmdoaWprbW5vcHFyc3R1dnd4eXonO1xuZXhwb3J0IGNvbnN0IFNUUl9TRUVEX0JBU0U2NFNBRkUgPSAnMDEyMzQ1Njc4OWFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVonO1xuZXhwb3J0IGNvbnN0IFNUUl9TRUVEX0JBU0U2MiA9ICcwMTIzNDU2Nzg5YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWic7XG5cbmV4cG9ydCBmdW5jdGlvbiByYW5kb21TdHJpbmcobGVuZ3RoOiBudW1iZXIsIGNoYXJhY3RlcnM6IHN0cmluZyA9IFNUUl9TRUVEX0JBU0U2Mik6IHN0cmluZyB7XG4gIGxldCByZXN1bHQgPSAnJztcbiAgY29uc3QgY2hhcmFjdGVyc0xlbmd0aCA9IGNoYXJhY3RlcnMubGVuZ3RoO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICByZXN1bHQgKz0gY2hhcmFjdGVycy5jaGFyQXQoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY2hhcmFjdGVyc0xlbmd0aCkpO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiIsImV4cG9ydCBjbGFzcyBUYXNrUXVldWUge1xuICBpdGVtczogKCgpID0+IFByb21pc2U8YW55PilbXSA9IFtdO1xuXG4gIGN1cnJlbnRSdW5uaW5nID0gMDtcblxuICBydW5uaW5nID0gZmFsc2U7XG5cbiAgb2JzZXJ2ZXJzOiB7XG4gICAgaGFuZGxlcjogRnVuY3Rpb247XG4gICAgb25jZTogYm9vbGVhbjtcbiAgfVtdID0gW107XG5cbiAgY29uc3RydWN0b3IocHVibGljIG1heFJ1bm5pbmcgPSAxKSB7XG4gICAgLy9cbiAgfVxuXG4gIHB1c2g8VCBleHRlbmRzICgoLi4uYXJnczogYW55W10pID0+IGFueSk+KGNhbGxiYWNrOiBUKTogUHJvbWlzZTxBd2FpdGVkPFJldHVyblR5cGU8VD4+PiB7XG4gICAgY29uc3QgcCA9IG5ldyBQcm9taXNlPEF3YWl0ZWQ8UmV0dXJuVHlwZTxUPj4+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMuaXRlbXMucHVzaCgoKSA9PiB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoY2FsbGJhY2soKSkudGhlbihyZXNvbHZlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5ydW4oKTtcblxuICAgIHJldHVybiBwO1xuICB9XG5cbiAgcnVuKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5ydW5uaW5nKSB7XG4gICAgICB0aGlzLnJ1bm5pbmcgPSB0cnVlO1xuICAgIH1cblxuICAgIHRoaXMucG9wKCk7XG4gIH1cblxuICBhc3luYyBwb3AoKSB7XG4gICAgY29uc3QgY2FsbGJhY2sgPSB0aGlzLml0ZW1zLnNoaWZ0KCk7XG5cbiAgICAvLyBJZiBlbXB0eSwgc3RvcCBydW5uaW5nLlxuICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgIHRoaXMucnVubmluZyA9IGZhbHNlO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cblxuICAgIC8vIElmIGN1cnJlbnQgcnVubmluZyBmdWxsLCBzZXQgYmFjayB0byBxdWV1ZSBhbmQgbGVhdmUuXG4gICAgaWYgKHRoaXMuY3VycmVudFJ1bm5pbmcgPj0gdGhpcy5tYXhSdW5uaW5nKSB7XG4gICAgICB0aGlzLml0ZW1zLnVuc2hpZnQoY2FsbGJhY2spO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cblxuICAgIHRoaXMuY3VycmVudFJ1bm5pbmcrKztcblxuICAgIHRoaXMubm90aWNlKCk7XG5cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGF3YWl0IGNhbGxiYWNrKCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdGhyb3cgZTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5lbmRQb3AoKTtcbiAgICB9XG4gIH1cblxuICBlbmRQb3AoKSB7XG4gICAgdGhpcy5jdXJyZW50UnVubmluZy0tO1xuICAgIHRoaXMubm90aWNlKCk7XG4gICAgdGhpcy5wb3AoKTtcbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIHRoaXMuaXRlbXMgPSBbXTtcblxuICAgIHRoaXMubm90aWNlKCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGlzRW1wdHkoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuaXRlbXMubGVuZ3RoID09PSAwO1xuICB9XG5cbiAgZ2V0IGxlbmd0aCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLml0ZW1zLmxlbmd0aDtcbiAgfVxuXG4gIHBlZWsoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlbXM7XG4gIH1cblxuICBvYnNlcnZlKGhhbmRsZXI6IE9ic2VydmVyRnVuY3Rpb24sIG9wdGlvbnM6IHsgb25jZT86IGJvb2xlYW4gfSA9IHt9KTogKCkgPT4gdm9pZCB7XG4gICAgdGhpcy5vYnNlcnZlcnMucHVzaCh7XG4gICAgICBoYW5kbGVyLFxuICAgICAgb25jZTogb3B0aW9ucy5vbmNlIHx8IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHRoaXMub2ZmKGhhbmRsZXIpO1xuICAgIH07XG4gIH1cblxuICBvbmNlKGhhbmRsZXI6IE9ic2VydmVyRnVuY3Rpb24sIG9wdGlvbnM6IHsgb25jZT86IGJvb2xlYW4gfSA9IHt9KTogKCkgPT4gdm9pZCB7XG4gICAgb3B0aW9ucy5vbmNlID0gdHJ1ZTtcblxuICAgIHJldHVybiB0aGlzLm9ic2VydmUoaGFuZGxlciwgb3B0aW9ucyk7XG4gIH1cblxuICBvbkVuZChjYWxsYmFjazogT2JzZXJ2ZXJGdW5jdGlvbiwgb3B0aW9uczogeyBvbmNlPzogYm9vbGVhbiB9ID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5vYnNlcnZlKChxdWV1ZSwgbGVuZ3RoLCBydW5uaW5nKSA9PiB7XG4gICAgICBpZiAobGVuZ3RoID09PSAwICYmIHJ1bm5pbmcgPT09IDApIHtcbiAgICAgICAgY2FsbGJhY2socXVldWUsIGxlbmd0aCwgcnVubmluZyk7XG4gICAgICB9XG4gICAgfSwgb3B0aW9ucyk7XG4gIH1cblxuICBub3RpY2UoKSB7XG4gICAgdGhpcy5vYnNlcnZlcnMuZm9yRWFjaCgob2JzZXJ2ZXIpID0+IHtcbiAgICAgIG9ic2VydmVyLmhhbmRsZXIodGhpcywgdGhpcy5sZW5ndGgsIHRoaXMuY3VycmVudFJ1bm5pbmcpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5vYnNlcnZlcnMgPSB0aGlzLm9ic2VydmVycy5maWx0ZXIoKG9ic2VydmVyKSA9PiAhb2JzZXJ2ZXIub25jZSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIG9mZihjYWxsYmFjaz86IEZ1bmN0aW9uKSB7XG4gICAgaWYgKGNhbGxiYWNrID09IG51bGwpIHtcbiAgICAgIHRoaXMub2JzZXJ2ZXJzID0gW107XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB0aGlzLm9ic2VydmVycyA9IHRoaXMub2JzZXJ2ZXJzLmZpbHRlcigob2JzZXJ2ZXIpID0+IG9ic2VydmVyLmhhbmRsZXIgIT09IGNhbGxiYWNrKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuXG5kZWNsYXJlIHR5cGUgT2JzZXJ2ZXJGdW5jdGlvbiA9IChxdWV1ZTogVGFza1F1ZXVlLCBsZW5ndGg6IG51bWJlciwgcnVubmluZzogbnVtYmVyKSA9PiB2b2lkXG5cbmV4cG9ydCBmdW5jdGlvbiBxdWV1ZShtYXhSdW5uaW5nOiBudW1iZXIgPSAxKSB7XG4gIHJldHVybiBuZXcgVGFza1F1ZXVlKG1heFJ1bm5pbmcpO1xufVxuIiwiZGVjbGFyZSB0eXBlIFN0YWNrSGFuZGxlcjxUPiA9IChzdGFjazogU3RhY2s8VD4sIGxlbmd0aDogbnVtYmVyKSA9PiB2b2lkO1xuXG5kZWNsYXJlIHR5cGUgU3RhY2tWYWx1ZTxWPiA9IFYgfCB0cnVlO1xuXG5leHBvcnQgY2xhc3MgU3RhY2s8VCA9IGFueT4ge1xuICBvYnNlcnZlcnM6IHsgaGFuZGxlcjogU3RhY2tIYW5kbGVyPFQ+LCBvbmNlOiBib29sZWFuIH1bXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBzdG9yZTogU3RhY2tWYWx1ZTxUPltdID0gW10pIHtcbiAgICAvL1xuICB9XG5cbiAgcHVzaCh2YWx1ZT86IFQpOiBudW1iZXIge1xuICAgIGNvbnN0IHIgPSB0aGlzLnN0b3JlLnB1c2godmFsdWUgPz8gdHJ1ZSk7XG5cbiAgICB0aGlzLm5vdGljZSgpO1xuXG4gICAgcmV0dXJuIHI7XG4gIH1cblxuICBwb3AoKTogVCB8IHRydWUgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IHIgPSB0aGlzLnN0b3JlLnBvcCgpO1xuXG4gICAgdGhpcy5ub3RpY2UoKTtcblxuICAgIHJldHVybiByO1xuICB9XG5cbiAgY2xlYXIoKTogdGhpcyB7XG4gICAgdGhpcy5zdG9yZSA9IFtdO1xuXG4gICAgdGhpcy5ub3RpY2UoKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgaXNFbXB0eSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zdG9yZS5sZW5ndGggPT09IDA7XG4gIH1cblxuICBnZXQgbGVuZ3RoKCkge1xuICAgIHJldHVybiB0aGlzLnN0b3JlLmxlbmd0aDtcbiAgfVxuXG4gIHBlZWsoKTogU3RhY2tWYWx1ZTxUPltdIHtcbiAgICByZXR1cm4gdGhpcy5zdG9yZTtcbiAgfVxuXG4gIG9ic2VydmUoaGFuZGxlcjogKHN0YWNrOiBTdGFjaywgbGVuZ3RoOiBudW1iZXIpID0+IHZvaWQpOiAoKSA9PiB2b2lkIHtcbiAgICB0aGlzLm9ic2VydmVycy5wdXNoKHtcbiAgICAgIGhhbmRsZXIsXG4gICAgICBvbmNlOiBmYWxzZVxuICAgIH0pO1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHRoaXMub2ZmKGhhbmRsZXIpO1xuICAgIH07XG4gIH1cblxuICBvbmNlKGhhbmRsZXI6IFN0YWNrSGFuZGxlcjxUPik6ICgpID0+IHZvaWQge1xuICAgIHRoaXMub2JzZXJ2ZXJzLnB1c2goe1xuICAgICAgaGFuZGxlcixcbiAgICAgIG9uY2U6IHRydWVcbiAgICB9KTtcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB0aGlzLm9mZihoYW5kbGVyKTtcbiAgICB9O1xuICB9XG5cbiAgbm90aWNlKCk6IHRoaXMge1xuICAgIHRoaXMub2JzZXJ2ZXJzLmZvckVhY2goKG9ic2VydmVyKSA9PiB7XG4gICAgICBvYnNlcnZlci5oYW5kbGVyKHRoaXMsIHRoaXMubGVuZ3RoKTtcbiAgICB9KTtcblxuICAgIHRoaXMub2JzZXJ2ZXJzID0gdGhpcy5vYnNlcnZlcnMuZmlsdGVyKChvYnNlcnZlcikgPT4gb2JzZXJ2ZXIub25jZSAhPT0gdHJ1ZSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIG9mZihjYWxsYmFjaz86IFN0YWNrSGFuZGxlcjxUPik6IHRoaXMge1xuICAgIHRoaXMub2JzZXJ2ZXJzID0gdGhpcy5vYnNlcnZlcnMuZmlsdGVyKChvYnNlcnZlcikgPT4gb2JzZXJ2ZXIuaGFuZGxlciAhPT0gY2FsbGJhY2spO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdGFjazxUID0gYW55PihzdG9yZTogYW55W10gPSBbXSkge1xuICByZXR1cm4gbmV3IFN0YWNrPFQ+KHN0b3JlKTtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBzbGVlcCh0aW1lOiBudW1iZXIpIHtcclxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgIHNldFRpbWVvdXQocmVzb2x2ZSwgdGltZSk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBuZXh0VGljayhjYWxsYmFjayA9ICgpID0+IHt9KSB7XHJcbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oY2FsbGJhY2spO1xyXG59XHJcbiIsImltcG9ydCB7IHVpZCwgdGlkLCByYW5kb21CeXRlcywgcmFuZG9tQnl0ZXNTdHJpbmcgfSBmcm9tICdAbHlyYXNvZnQvdHMtdG9vbGtpdC9nZW5lcmljJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBiYXNlNjRVcmxFbmNvZGUoc3RyaW5nOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gIHJldHVybiBidG9hKFN0cmluZyhzdHJpbmcpKVxyXG4gICAgLnJlcGxhY2UoL1xcKy8sICctJylcclxuICAgIC5yZXBsYWNlKG5ldyBSZWdFeHAoJ1xcXFwvJyksICdfJylcclxuICAgIC5yZXBsYWNlKC89KyQvLCAnJyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBCYXNlNjQgVVJMIGRlY29kZVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGJhc2U2NFVybERlY29kZShzdHJpbmc6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgcmV0dXJuIGF0b2IoXHJcbiAgICBTdHJpbmcoc3RyaW5nKVxyXG4gICAgICAucmVwbGFjZSgvLS8sICcrJylcclxuICAgICAgLnJlcGxhY2UoL18vLCAnLycpXHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IHsgdWlkLCB0aWQsIHJhbmRvbUJ5dGVzLCByYW5kb21CeXRlc1N0cmluZyB9O1xyXG5cclxubGV0IGdsb2JhbFNlcmlhbCA9IDE7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2VyaWFsKCk6IG51bWJlciB7XHJcbiAgcmV0dXJuIGdsb2JhbFNlcmlhbCsrO1xyXG59XHJcbiIsImltcG9ydCB7IGRhdGEgfSBmcm9tICcuLi9kYXRhJztcclxuaW1wb3J0IHsgc2xlZXAgfSBmcm9tICdAbHlyYXNvZnQvdHMtdG9vbGtpdC9nZW5lcmljJztcclxuXHJcbmV4cG9ydCB7IHNsZWVwIH07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZm9yY2VBcnJheTxUPihpdGVtOiBUIHwgVFtdKTogVFtdIHtcclxuICBpZiAoQXJyYXkuaXNBcnJheShpdGVtKSkge1xyXG4gICAgcmV0dXJuIGl0ZW07XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBbaXRlbV07XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZGVib3VuY2U8VCBleHRlbmRzIEZ1bmN0aW9uID0gRnVuY3Rpb24+KGhhbmRsZXI6IFQsIHdhaXQgPSAxKTogVCB7XHJcbiAgbGV0IHRpbWVyOiBSZXR1cm5UeXBlPHR5cGVvZiBzZXRUaW1lb3V0PiB8IG51bWJlciwgcmVzdWx0OiBhbnk7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uICh0aGlzOiBhbnksIC4uLmFyZ3M6IGFueVtdKSB7XHJcbiAgICBjbGVhclRpbWVvdXQodGltZXIpO1xyXG4gICAgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHJlc3VsdCA9IGhhbmRsZXIuY2FsbCh0aGlzLCAuLi5hcmdzKSwgd2FpdCk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH0gYXMgYW55IGFzIFQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB0aHJvdHRsZTxUIGV4dGVuZHMgRnVuY3Rpb24gPSBGdW5jdGlvbj4oaGFuZGxlcjogVCwgd2FpdDogbnVtYmVyID0gMSk6IFQge1xyXG4gIGxldCB0aW1lcjogUmV0dXJuVHlwZTx0eXBlb2Ygc2V0VGltZW91dD4gfCBudW1iZXIgfCB1bmRlZmluZWQsIHJlc3VsdDogYW55O1xyXG4gIHJldHVybiBmdW5jdGlvbiAodGhpczogYW55LCAuLi5hcmdzOiBhbnlbXSkge1xyXG4gICAgaWYgKCF0aW1lcikge1xyXG4gICAgICByZXR1cm4gcmVzdWx0ID0gaGFuZGxlci5jYWxsKHRoaXMsIC4uLmFyZ3MpO1xyXG4gICAgfVxyXG5cclxuICAgIGNsZWFyVGltZW91dCh0aW1lcik7XHJcbiAgICB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4gdGltZXIgPSB1bmRlZmluZWQsIHdhaXQpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9IGFzIGFueSBhcyBUO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNEZWJ1ZygpIHtcclxuICByZXR1cm4gQm9vbGVhbihkYXRhKCd3aW5kd2Fsa2VyLmRlYnVnJykpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbmV4dFRpY2soY2FsbGJhY2s/OiAoKSA9PiBhbnkpOiBQcm9taXNlPGFueT4ge1xyXG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKGNhbGxiYWNrID8/ICgoKSA9PiBudWxsKSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB3YWl0PFQgZXh0ZW5kcyByZWFkb25seSB1bmtub3duW10+KFxyXG4gIC4uLnByb21pc2VlOiB7IFtLIGluIGtleW9mIFRdOiBQcm9taXNlTGlrZTxUW0tdPiB8IFRbS10gfVxyXG4pOiBQcm9taXNlPEF3YWl0ZWQ8VD4+IHtcclxuICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZWUpIGFzIFByb21pc2U8QXdhaXRlZDxUPj47XHJcbn1cclxuIiwiLyogZ2xvYmFsIHdpbmRvdywgZXhwb3J0cywgZGVmaW5lICovXG5cbiFmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCdcblxuICAgIHZhciByZSA9IHtcbiAgICAgICAgbm90X3N0cmluZzogL1tec10vLFxuICAgICAgICBub3RfYm9vbDogL1tedF0vLFxuICAgICAgICBub3RfdHlwZTogL1teVF0vLFxuICAgICAgICBub3RfcHJpbWl0aXZlOiAvW152XS8sXG4gICAgICAgIG51bWJlcjogL1tkaWVmZ10vLFxuICAgICAgICBudW1lcmljX2FyZzogL1tiY2RpZWZndXhYXS8sXG4gICAgICAgIGpzb246IC9bal0vLFxuICAgICAgICBub3RfanNvbjogL1teal0vLFxuICAgICAgICB0ZXh0OiAvXlteXFx4MjVdKy8sXG4gICAgICAgIG1vZHVsbzogL15cXHgyNXsyfS8sXG4gICAgICAgIHBsYWNlaG9sZGVyOiAvXlxceDI1KD86KFsxLTldXFxkKilcXCR8XFwoKFteKV0rKVxcKSk/KFxcKyk/KDB8J1teJF0pPygtKT8oXFxkKyk/KD86XFwuKFxcZCspKT8oW2ItZ2lqb3N0VHV2eFhdKS8sXG4gICAgICAgIGtleTogL14oW2Etel9dW2Etel9cXGRdKikvaSxcbiAgICAgICAga2V5X2FjY2VzczogL15cXC4oW2Etel9dW2Etel9cXGRdKikvaSxcbiAgICAgICAgaW5kZXhfYWNjZXNzOiAvXlxcWyhcXGQrKVxcXS8sXG4gICAgICAgIHNpZ246IC9eWystXS9cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzcHJpbnRmKGtleSkge1xuICAgICAgICAvLyBgYXJndW1lbnRzYCBpcyBub3QgYW4gYXJyYXksIGJ1dCBzaG91bGQgYmUgZmluZSBmb3IgdGhpcyBjYWxsXG4gICAgICAgIHJldHVybiBzcHJpbnRmX2Zvcm1hdChzcHJpbnRmX3BhcnNlKGtleSksIGFyZ3VtZW50cylcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB2c3ByaW50ZihmbXQsIGFyZ3YpIHtcbiAgICAgICAgcmV0dXJuIHNwcmludGYuYXBwbHkobnVsbCwgW2ZtdF0uY29uY2F0KGFyZ3YgfHwgW10pKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNwcmludGZfZm9ybWF0KHBhcnNlX3RyZWUsIGFyZ3YpIHtcbiAgICAgICAgdmFyIGN1cnNvciA9IDEsIHRyZWVfbGVuZ3RoID0gcGFyc2VfdHJlZS5sZW5ndGgsIGFyZywgb3V0cHV0ID0gJycsIGksIGssIHBoLCBwYWQsIHBhZF9jaGFyYWN0ZXIsIHBhZF9sZW5ndGgsIGlzX3Bvc2l0aXZlLCBzaWduXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0cmVlX2xlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHBhcnNlX3RyZWVbaV0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0ICs9IHBhcnNlX3RyZWVbaV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBwYXJzZV90cmVlW2ldID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIHBoID0gcGFyc2VfdHJlZVtpXSAvLyBjb252ZW5pZW5jZSBwdXJwb3NlcyBvbmx5XG4gICAgICAgICAgICAgICAgaWYgKHBoLmtleXMpIHsgLy8ga2V5d29yZCBhcmd1bWVudFxuICAgICAgICAgICAgICAgICAgICBhcmcgPSBhcmd2W2N1cnNvcl1cbiAgICAgICAgICAgICAgICAgICAgZm9yIChrID0gMDsgayA8IHBoLmtleXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhcmcgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHNwcmludGYoJ1tzcHJpbnRmXSBDYW5ub3QgYWNjZXNzIHByb3BlcnR5IFwiJXNcIiBvZiB1bmRlZmluZWQgdmFsdWUgXCIlc1wiJywgcGgua2V5c1trXSwgcGgua2V5c1trLTFdKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IGFyZ1twaC5rZXlzW2tdXVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBoLnBhcmFtX25vKSB7IC8vIHBvc2l0aW9uYWwgYXJndW1lbnQgKGV4cGxpY2l0KVxuICAgICAgICAgICAgICAgICAgICBhcmcgPSBhcmd2W3BoLnBhcmFtX25vXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHsgLy8gcG9zaXRpb25hbCBhcmd1bWVudCAoaW1wbGljaXQpXG4gICAgICAgICAgICAgICAgICAgIGFyZyA9IGFyZ3ZbY3Vyc29yKytdXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHJlLm5vdF90eXBlLnRlc3QocGgudHlwZSkgJiYgcmUubm90X3ByaW1pdGl2ZS50ZXN0KHBoLnR5cGUpICYmIGFyZyBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGFyZyA9IGFyZygpXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHJlLm51bWVyaWNfYXJnLnRlc3QocGgudHlwZSkgJiYgKHR5cGVvZiBhcmcgIT09ICdudW1iZXInICYmIGlzTmFOKGFyZykpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3Ioc3ByaW50ZignW3NwcmludGZdIGV4cGVjdGluZyBudW1iZXIgYnV0IGZvdW5kICVUJywgYXJnKSlcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocmUubnVtYmVyLnRlc3QocGgudHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNfcG9zaXRpdmUgPSBhcmcgPj0gMFxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHN3aXRjaCAocGgudHlwZSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdiJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IHBhcnNlSW50KGFyZywgMTApLnRvU3RyaW5nKDIpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdjJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IFN0cmluZy5mcm9tQ2hhckNvZGUocGFyc2VJbnQoYXJnLCAxMCkpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdkJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnaSc6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBwYXJzZUludChhcmcsIDEwKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnaic6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBKU09OLnN0cmluZ2lmeShhcmcsIG51bGwsIHBoLndpZHRoID8gcGFyc2VJbnQocGgud2lkdGgpIDogMClcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2UnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gcGgucHJlY2lzaW9uID8gcGFyc2VGbG9hdChhcmcpLnRvRXhwb25lbnRpYWwocGgucHJlY2lzaW9uKSA6IHBhcnNlRmxvYXQoYXJnKS50b0V4cG9uZW50aWFsKClcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2YnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gcGgucHJlY2lzaW9uID8gcGFyc2VGbG9hdChhcmcpLnRvRml4ZWQocGgucHJlY2lzaW9uKSA6IHBhcnNlRmxvYXQoYXJnKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnZyc6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBwaC5wcmVjaXNpb24gPyBTdHJpbmcoTnVtYmVyKGFyZy50b1ByZWNpc2lvbihwaC5wcmVjaXNpb24pKSkgOiBwYXJzZUZsb2F0KGFyZylcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ28nOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gKHBhcnNlSW50KGFyZywgMTApID4+PiAwKS50b1N0cmluZyg4KVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAncyc6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBTdHJpbmcoYXJnKVxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gKHBoLnByZWNpc2lvbiA/IGFyZy5zdWJzdHJpbmcoMCwgcGgucHJlY2lzaW9uKSA6IGFyZylcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3QnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gU3RyaW5nKCEhYXJnKVxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gKHBoLnByZWNpc2lvbiA/IGFyZy5zdWJzdHJpbmcoMCwgcGgucHJlY2lzaW9uKSA6IGFyZylcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ1QnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFyZykuc2xpY2UoOCwgLTEpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IChwaC5wcmVjaXNpb24gPyBhcmcuc3Vic3RyaW5nKDAsIHBoLnByZWNpc2lvbikgOiBhcmcpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICd1JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IHBhcnNlSW50KGFyZywgMTApID4+PiAwXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICd2JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IGFyZy52YWx1ZU9mKClcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IChwaC5wcmVjaXNpb24gPyBhcmcuc3Vic3RyaW5nKDAsIHBoLnByZWNpc2lvbikgOiBhcmcpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICd4JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IChwYXJzZUludChhcmcsIDEwKSA+Pj4gMCkudG9TdHJpbmcoMTYpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdYJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IChwYXJzZUludChhcmcsIDEwKSA+Pj4gMCkudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKClcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChyZS5qc29uLnRlc3QocGgudHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0ICs9IGFyZ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlLm51bWJlci50ZXN0KHBoLnR5cGUpICYmICghaXNfcG9zaXRpdmUgfHwgcGguc2lnbikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpZ24gPSBpc19wb3NpdGl2ZSA/ICcrJyA6ICctJ1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJnLnRvU3RyaW5nKCkucmVwbGFjZShyZS5zaWduLCAnJylcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpZ24gPSAnJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHBhZF9jaGFyYWN0ZXIgPSBwaC5wYWRfY2hhciA/IHBoLnBhZF9jaGFyID09PSAnMCcgPyAnMCcgOiBwaC5wYWRfY2hhci5jaGFyQXQoMSkgOiAnICdcbiAgICAgICAgICAgICAgICAgICAgcGFkX2xlbmd0aCA9IHBoLndpZHRoIC0gKHNpZ24gKyBhcmcpLmxlbmd0aFxuICAgICAgICAgICAgICAgICAgICBwYWQgPSBwaC53aWR0aCA/IChwYWRfbGVuZ3RoID4gMCA/IHBhZF9jaGFyYWN0ZXIucmVwZWF0KHBhZF9sZW5ndGgpIDogJycpIDogJydcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0ICs9IHBoLmFsaWduID8gc2lnbiArIGFyZyArIHBhZCA6IChwYWRfY2hhcmFjdGVyID09PSAnMCcgPyBzaWduICsgcGFkICsgYXJnIDogcGFkICsgc2lnbiArIGFyZylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dHB1dFxuICAgIH1cblxuICAgIHZhciBzcHJpbnRmX2NhY2hlID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuXG4gICAgZnVuY3Rpb24gc3ByaW50Zl9wYXJzZShmbXQpIHtcbiAgICAgICAgaWYgKHNwcmludGZfY2FjaGVbZm10XSkge1xuICAgICAgICAgICAgcmV0dXJuIHNwcmludGZfY2FjaGVbZm10XVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIF9mbXQgPSBmbXQsIG1hdGNoLCBwYXJzZV90cmVlID0gW10sIGFyZ19uYW1lcyA9IDBcbiAgICAgICAgd2hpbGUgKF9mbXQpIHtcbiAgICAgICAgICAgIGlmICgobWF0Y2ggPSByZS50ZXh0LmV4ZWMoX2ZtdCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcGFyc2VfdHJlZS5wdXNoKG1hdGNoWzBdKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoKG1hdGNoID0gcmUubW9kdWxvLmV4ZWMoX2ZtdCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcGFyc2VfdHJlZS5wdXNoKCclJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKChtYXRjaCA9IHJlLnBsYWNlaG9sZGVyLmV4ZWMoX2ZtdCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoWzJdKSB7XG4gICAgICAgICAgICAgICAgICAgIGFyZ19uYW1lcyB8PSAxXG4gICAgICAgICAgICAgICAgICAgIHZhciBmaWVsZF9saXN0ID0gW10sIHJlcGxhY2VtZW50X2ZpZWxkID0gbWF0Y2hbMl0sIGZpZWxkX21hdGNoID0gW11cbiAgICAgICAgICAgICAgICAgICAgaWYgKChmaWVsZF9tYXRjaCA9IHJlLmtleS5leGVjKHJlcGxhY2VtZW50X2ZpZWxkKSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkX2xpc3QucHVzaChmaWVsZF9tYXRjaFsxXSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlICgocmVwbGFjZW1lbnRfZmllbGQgPSByZXBsYWNlbWVudF9maWVsZC5zdWJzdHJpbmcoZmllbGRfbWF0Y2hbMF0ubGVuZ3RoKSkgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChmaWVsZF9tYXRjaCA9IHJlLmtleV9hY2Nlc3MuZXhlYyhyZXBsYWNlbWVudF9maWVsZCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkX2xpc3QucHVzaChmaWVsZF9tYXRjaFsxXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoKGZpZWxkX21hdGNoID0gcmUuaW5kZXhfYWNjZXNzLmV4ZWMocmVwbGFjZW1lbnRfZmllbGQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZF9saXN0LnB1c2goZmllbGRfbWF0Y2hbMV0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoJ1tzcHJpbnRmXSBmYWlsZWQgdG8gcGFyc2UgbmFtZWQgYXJndW1lbnQga2V5JylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoJ1tzcHJpbnRmXSBmYWlsZWQgdG8gcGFyc2UgbmFtZWQgYXJndW1lbnQga2V5JylcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBtYXRjaFsyXSA9IGZpZWxkX2xpc3RcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGFyZ19uYW1lcyB8PSAyXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChhcmdfbmFtZXMgPT09IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdbc3ByaW50Zl0gbWl4aW5nIHBvc2l0aW9uYWwgYW5kIG5hbWVkIHBsYWNlaG9sZGVycyBpcyBub3QgKHlldCkgc3VwcG9ydGVkJylcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBwYXJzZV90cmVlLnB1c2goXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiBtYXRjaFswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtX25vOiAgICBtYXRjaFsxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleXM6ICAgICAgICBtYXRjaFsyXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpZ246ICAgICAgICBtYXRjaFszXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZF9jaGFyOiAgICBtYXRjaFs0XSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsaWduOiAgICAgICBtYXRjaFs1XSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAgICAgICBtYXRjaFs2XSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZWNpc2lvbjogICBtYXRjaFs3XSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICAgICAgICBtYXRjaFs4XVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKCdbc3ByaW50Zl0gdW5leHBlY3RlZCBwbGFjZWhvbGRlcicpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfZm10ID0gX2ZtdC5zdWJzdHJpbmcobWF0Y2hbMF0ubGVuZ3RoKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzcHJpbnRmX2NhY2hlW2ZtdF0gPSBwYXJzZV90cmVlXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZXhwb3J0IHRvIGVpdGhlciBicm93c2VyIG9yIG5vZGUuanNcbiAgICAgKi9cbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBxdW90ZS1wcm9wcyAqL1xuICAgIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZXhwb3J0c1snc3ByaW50ZiddID0gc3ByaW50ZlxuICAgICAgICBleHBvcnRzWyd2c3ByaW50ZiddID0gdnNwcmludGZcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHdpbmRvd1snc3ByaW50ZiddID0gc3ByaW50ZlxuICAgICAgICB3aW5kb3dbJ3ZzcHJpbnRmJ10gPSB2c3ByaW50ZlxuXG4gICAgICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZVsnYW1kJ10pIHtcbiAgICAgICAgICAgIGRlZmluZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAnc3ByaW50Zic6IHNwcmludGYsXG4gICAgICAgICAgICAgICAgICAgICd2c3ByaW50Zic6IHZzcHJpbnRmXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKiBlc2xpbnQtZW5hYmxlIHF1b3RlLXByb3BzICovXG59KCk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiIsImltcG9ydCB7IGRhdGEgfSBmcm9tICcuLi9kYXRhJztcclxuaW1wb3J0IHsgaXNEZWJ1ZyB9IGZyb20gJy4vL2hlbHBlcic7XHJcbmltcG9ydCB7IERpY3Rpb25hcnkgfSBmcm9tICcuLi90eXBlcyc7XHJcbmltcG9ydCB7IHZzcHJpbnRmIH0gZnJvbSAnc3ByaW50Zi1qcyc7XHJcblxyXG5sZXQgbGFuZzogVW5pY29ybkxhbmc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlTGFuZygpIHtcclxuICByZXR1cm4gbGFuZyA/Pz0gbmV3IFVuaWNvcm5MYW5nKCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB0cmFucyhpZDogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSkge1xyXG4gIHJldHVybiB1c2VMYW5nKCkudHJhbnMoaWQsIC4uLmFyZ3MpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX18oaWQ6IHN0cmluZywgLi4uYXJnczogYW55W10pIHtcclxuICByZXR1cm4gdHJhbnMoaWQsIC4uLmFyZ3MpO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVbmljb3JuTGFuZyB7XHJcbiAgLyoqXHJcbiAgICogVHJhbnNsYXRlIGEgc3RyaW5nLlxyXG4gICAqL1xyXG4gIHRyYW5zKGlkOiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IGtleSA9IHRoaXMubm9ybWFsaXplKGlkKTtcclxuXHJcbiAgICBsZXQgdHJhbnNsYXRlZCA9IHRoaXMuZ2V0KGtleSkgfHwgJyc7XHJcblxyXG4gICAgdHJhbnNsYXRlZCA9IHRoaXMucmVwbGFjZSh0cmFuc2xhdGVkLCBhcmdzKTtcclxuXHJcbiAgICByZXR1cm4gdHJhbnNsYXRlZCAhPT0gJycgPyB0cmFuc2xhdGVkIDogdGhpcy53cmFwRGVidWcoaWQsIGZhbHNlKTtcclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCByZXBsYWNlKHN0cjogc3RyaW5nLCBhcmdzOiBhbnlbXSk6IHN0cmluZyB7XHJcbiAgICBsZXQgcmVwbGFjZW1lbnRzOiBEaWN0aW9uYXJ5PGFueT4gPSB7fTtcclxuICAgIGxldCB2YWx1ZXM6IGFueVtdID0gW107XHJcblxyXG4gICAgZm9yIChjb25zdCBhcmcgb2YgYXJncykge1xyXG4gICAgICBpZiAodHlwZW9mIGFyZyA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICByZXBsYWNlbWVudHMgPSB7IC4uLnJlcGxhY2VtZW50cywgLi4uYXJnIH07XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdmFsdWVzLnB1c2goYXJnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh2YWx1ZXMubGVuZ3RoKSB7XHJcbiAgICAgIHN0ciA9IHZzcHJpbnRmKHN0ciwgdmFsdWVzKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoT2JqZWN0LnZhbHVlcyhyZXBsYWNlbWVudHMpLmxlbmd0aCkge1xyXG4gICAgICBmb3IgKGNvbnN0IGtleSBpbiByZXBsYWNlbWVudHMpIHtcclxuICAgICAgICBsZXQgdmFsdWUgPSByZXBsYWNlbWVudHNba2V5XTtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgdmFsdWUgPSB2YWx1ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UobmV3IFJlZ0V4cCgnOicgKyBrZXksICdnJyksIFN0cmluZyh2YWx1ZSkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHN0cjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEZpbmQgdGV4dC5cclxuICAgKi9cclxuICBnZXQoaWQ6IHN0cmluZyk6IHN0cmluZyB8IG51bGwge1xyXG4gICAgY29uc3Qgc3RyaW5ncyA9IHRoaXMuZ2V0U3RyaW5ncygpO1xyXG5cclxuICAgIGlmIChzdHJpbmdzW2lkXSkge1xyXG4gICAgICByZXR1cm4gc3RyaW5nc1tpZF07XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBIYXMgbGFuZ3VhZ2Uga2V5LlxyXG4gICAqL1xyXG4gIGhhcyhrZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgY29uc3Qgc3RyaW5ncyA9IHRoaXMuZ2V0U3RyaW5ncygpO1xyXG5cclxuICAgIHJldHVybiBzdHJpbmdzW2tleV0gIT09IHVuZGVmaW5lZDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEFkZCBsYW5ndWFnZSBrZXkuXHJcbiAgICovXHJcbiAgYWRkKGtleTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogdGhpcyB7XHJcbiAgICBjb25zdCBzdHJpbmdzID0gdGhpcy5nZXRTdHJpbmdzKCk7XHJcblxyXG4gICAgc3RyaW5nc1t0aGlzLm5vcm1hbGl6ZShrZXkpXSA9IHZhbHVlO1xyXG5cclxuICAgIGRhdGEoJ3VuaWNvcm4ubGFuZ3VhZ2VzJywgc3RyaW5ncyk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXBsYWNlIGFsbCBzeW1ib2xzIHRvIGRvdCguKS5cclxuICAgKi9cclxuICBwcm90ZWN0ZWQgbm9ybWFsaXplKHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9bXkEtWjAtOV0rL2lnLCAnLicpO1xyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIHdyYXBEZWJ1Zyh0ZXh0OiBzdHJpbmcsIHN1Y2Nlc3M6IGJvb2xlYW4pOiBzdHJpbmcge1xyXG4gICAgaWYgKGlzRGVidWcoKSkge1xyXG4gICAgICBpZiAoc3VjY2Vzcykge1xyXG4gICAgICAgIHJldHVybiAnKionICsgdGV4dCArICcqKic7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiAnPz8nICsgdGV4dCArICc/Pyc7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRleHQ7XHJcbiAgfVxyXG5cclxuICBnZXRTdHJpbmdzKCk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4ge1xyXG4gICAgcmV0dXJuIGRhdGEoJ3VuaWNvcm4ubGFuZ3VhZ2VzJykgfHwge307XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IERpY3Rpb25hcnkgfSBmcm9tICcuLi90eXBlcyc7XHJcbmltcG9ydCB7IGluamVjdENzc1RvRG9jdW1lbnQgfSBmcm9tICcuLyc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlU2NyaXB0SW1wb3J0KHNyYzogc3RyaW5nLCBhdHRyczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9KTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgY29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XHJcbiAgc2NyaXB0LnNyYyA9IHNyYztcclxuXHJcbiAgZm9yIChjb25zdCBrZXkgaW4gYXR0cnMpIHtcclxuICAgIHNjcmlwdC5zZXRBdHRyaWJ1dGUoa2V5LCBhdHRyc1trZXldKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICBzY3JpcHQub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICByZXNvbHZlKCk7XHJcbiAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcclxuICAgIH07XHJcbiAgICBzY3JpcHQub25lcnJvciA9IChlKSA9PiB7XHJcbiAgICAgIHJlamVjdChlKTtcclxuICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChzY3JpcHQpO1xyXG4gICAgfTtcclxuXHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdCk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkb0ltcG9ydDxUID0gYW55PihzcmM6IHN0cmluZyk6IFByb21pc2U8VD4ge1xyXG4gIHJldHVybiBpbXBvcnQoLyogQHZpdGUtaWdub3JlICovc3JjKTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUltcG9ydCguLi5zcmM6IGFueVtdKTogUHJvbWlzZTxhbnk+O1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlSW1wb3J0PFQgZXh0ZW5kcyBhbnlbXT4oLi4uc3JjOiBzdHJpbmdbXSk6IFByb21pc2U8VD47XHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VJbXBvcnQ8VCA9IGFueT4oc3JjOiBzdHJpbmcpOiBQcm9taXNlPHsgZGVmYXVsdDogVCB9PjtcclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUltcG9ydDxEID0gYW55LCBDID0gYW55PihzcmM6IHN0cmluZyk6IFByb21pc2U8eyBkZWZhdWx0OiBEIH0gJiBEaWN0aW9uYXJ5PEM+PjtcclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUltcG9ydCguLi5zcmM6IGFueVtdKTogUHJvbWlzZTxhbnk+IHtcclxuICBpZiAoc3JjLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgcmV0dXJuIGRvSW1wb3J0KHNyY1swXSk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBwcm9taXNlczogUHJvbWlzZTxhbnk+W10gPSBbXTtcclxuXHJcbiAgc3JjLmZvckVhY2goKGxpbmspID0+IHtcclxuICAgIHByb21pc2VzLnB1c2goXHJcbiAgICAgIGxpbmsgaW5zdGFuY2VvZiBQcm9taXNlID8gbGluayA6IGRvSW1wb3J0KGxpbmspXHJcbiAgICApO1xyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlU2VyaWVzSW1wb3J0KC4uLnNyYzogYW55W10pOiBQcm9taXNlPGFueT47XHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VTZXJpZXNJbXBvcnQ8VCBleHRlbmRzIGFueVtdPiguLi5zcmM6IHN0cmluZ1tdKTogUHJvbWlzZTxUPjtcclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZVNlcmllc0ltcG9ydDxUID0gYW55PihzcmM6IHN0cmluZyk6IFByb21pc2U8eyBkZWZhdWx0OiBUIH0+O1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlU2VyaWVzSW1wb3J0PEQgPSBhbnksIEMgPSBhbnk+KHNyYzogc3RyaW5nKTogUHJvbWlzZTx7IGRlZmF1bHQ6IEQgfSAmIERpY3Rpb25hcnk8Qz4+O1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlU2VyaWVzSW1wb3J0KC4uLnNyYzogYW55W10pOiBQcm9taXNlPGFueT4ge1xyXG4gIGNvbnN0IG1vZHVsZXM6IGFueVtdID0gW107XHJcblxyXG4gIGZvciAoY29uc3Qgc291cmNlIG9mIHNyYykge1xyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoc291cmNlKSkge1xyXG4gICAgICBjb25zdCBtID0gYXdhaXQgdXNlSW1wb3J0KC4uLnNvdXJjZSk7XHJcbiAgICAgIG1vZHVsZXMucHVzaChtKTtcclxuXHJcbiAgICAgIGNvbnRpbnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG0gPSBhd2FpdCB1c2VJbXBvcnQoc291cmNlKTtcclxuXHJcbiAgICBtb2R1bGVzLnB1c2gobSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbW9kdWxlcztcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUNzc0luY2x1ZGVzKC4uLmhyZWZzOiBzdHJpbmdbXSk6IFByb21pc2U8dm9pZFtdPiB7XHJcbiAgY29uc3QgcHJvbWlzZXMgPSBocmVmcy5tYXAoKGhyZWYpID0+IHtcclxuICAgIGhyZWYgPSByZXNvbHZlVXJsKGhyZWYpO1xyXG5cclxuICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGNvbnN0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW5rJyk7XHJcbiAgICAgIGxpbmsucmVsID0gJ3N0eWxlc2hlZXQnO1xyXG4gICAgICBsaW5rLmhyZWYgPSBocmVmO1xyXG4gICAgICBsaW5rLm9ubG9hZCA9ICgpID0+IHJlc29sdmUoKTtcclxuICAgICAgbGluay5vbmVycm9yID0gKGUpID0+IHJlamVjdChlKTtcclxuXHJcbiAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQobGluayk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcclxufVxyXG5cclxuY29uc3QgaW1wb3J0ZWRTaGVldHM6IFJlY29yZDxzdHJpbmcsIFByb21pc2U8eyBkZWZhdWx0OiBDU1NTdHlsZVNoZWV0IH0+PiA9IHt9O1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUNzc0ltcG9ydCguLi5ocmVmczogc3RyaW5nW10pOiBQcm9taXNlPENTU1N0eWxlU2hlZXRbXT4ge1xyXG4gIC8vIFRvZG86IFVzZSBgeyBhc3NlcnQ6IHsgdHlwZTogXCJjc3NcIiB9YCBhZnRlciBhbGwgYnJvd3NlcnMgc3VwcG9ydCBpdC5cclxuICBjb25zdCBtb2R1bGVzID0gYXdhaXQgUHJvbWlzZS5hbGwoXHJcbiAgICBocmVmcy5tYXAoKGhyZWYpID0+IHtcclxuICAgICAgaWYgKCFpbXBvcnRlZFNoZWV0c1tocmVmXSkge1xyXG4gICAgICAgIGltcG9ydGVkU2hlZXRzW2hyZWZdID0gc2ltdWxhdGVDc3NJbXBvcnQoaHJlZik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBpbXBvcnRlZFNoZWV0c1tocmVmXTtcclxuICAgIH0pXHJcbiAgKTtcclxuICBjb25zdCBzdHlsZXMgPSBtb2R1bGVzLm1hcChtb2R1bGUgPT4gbW9kdWxlLmRlZmF1bHQpO1xyXG5cclxuICByZXR1cm4gaW5qZWN0Q3NzVG9Eb2N1bWVudCguLi5zdHlsZXMpO1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBzaW11bGF0ZUNzc0ltcG9ydChocmVmOiBzdHJpbmcpIHtcclxuICBocmVmID0gcmVzb2x2ZVVybChocmVmKTtcclxuXHJcbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChocmVmKTtcclxuICBpZiAoIXJlc3BvbnNlLm9rKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byBsb2FkIENTUzogJHtocmVmfWApO1xyXG4gIH1cclxuICBjb25zdCBjc3NUZXh0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xyXG5cclxuICBjb25zdCBzaGVldCA9IG5ldyBDU1NTdHlsZVNoZWV0KCk7XHJcbiAgYXdhaXQgc2hlZXQucmVwbGFjZShjc3NUZXh0KTtcclxuICByZXR1cm4geyBkZWZhdWx0OiBzaGVldCB9O1xyXG59XHJcblxyXG5sZXQgaW1wb3J0TWFwOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xyXG5cclxuZnVuY3Rpb24gcGFyc2VJbXBvcnRNYXAoKSB7XHJcbiAgY29uc3QgaW1wb3J0TWFwU2NyaXB0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcignc2NyaXB0W3R5cGU9XCJpbXBvcnRtYXBcIl0nKTtcclxuICBpZiAoaW1wb3J0TWFwU2NyaXB0KSB7XHJcbiAgICB0cnkge1xyXG4gICAgICByZXR1cm4gSlNPTi5wYXJzZShpbXBvcnRNYXBTY3JpcHQudGV4dENvbnRlbnQgfHwgJ3t9JykuaW1wb3J0cyB8fCB7fTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIHBhcnNlIGltcG9ydCBtYXA6JywgZSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiB7fTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVzb2x2ZVVybChzcGVjaWZpZXI6IHN0cmluZykge1xyXG4gIGltcG9ydE1hcCA/Pz0gcGFyc2VJbXBvcnRNYXAoKTtcclxuXHJcbiAgZm9yIChjb25zdCBbcHJlZml4LCB0YXJnZXRdIG9mIE9iamVjdC5lbnRyaWVzKGltcG9ydE1hcCkpIHtcclxuICAgIGlmIChzcGVjaWZpZXIgPT09IHByZWZpeCkge1xyXG4gICAgICByZXR1cm4gdGFyZ2V0O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZm9yIChjb25zdCBbcHJlZml4LCB0YXJnZXRdIG9mIE9iamVjdC5lbnRyaWVzKGltcG9ydE1hcCkpIHtcclxuICAgIGlmIChzcGVjaWZpZXIuc3RhcnRzV2l0aChwcmVmaXgpKSB7XHJcbiAgICAgIHJldHVybiBzcGVjaWZpZXIucmVwbGFjZShwcmVmaXgsIHRhcmdldCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBzcGVjaWZpZXI7XHJcbn1cclxuIiwiaW1wb3J0IHR5cGUgeyBDaGVja2JveGVzTXVsdGlTZWxlY3QgfSBmcm9tICcuLi9tb2R1bGUvY2hlY2tib3hlcy1tdWx0aS1zZWxlY3QnO1xyXG5pbXBvcnQgdHlwZSB7IE51bGxhYmxlIH0gZnJvbSAnLi4vdHlwZXMnO1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUNoZWNrYm94ZXNNdWx0aVNlbGVjdCgpOiBQcm9taXNlPGFueT47XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlQ2hlY2tib3hlc011bHRpU2VsZWN0KFxyXG4gIHNlbGVjdG9yPzogTnVsbGFibGU8c3RyaW5nIHwgSFRNTEVsZW1lbnQ+LFxyXG4gIG9wdGlvbnM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+XHJcbik6IFByb21pc2U8Q2hlY2tib3hlc011bHRpU2VsZWN0PjtcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VDaGVja2JveGVzTXVsdGlTZWxlY3QoXHJcbiAgc2VsZWN0b3I/OiBOdWxsYWJsZTxzdHJpbmcgfCBIVE1MRWxlbWVudD4sXHJcbiAgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9XHJcbik6IFByb21pc2U8YW55PiB7XHJcbiAgY29uc3QgbSA9IGF3YWl0IGltcG9ydCgnLi4vbW9kdWxlL2NoZWNrYm94ZXMtbXVsdGktc2VsZWN0Jyk7XHJcblxyXG4gIGlmIChzZWxlY3Rvcikge1xyXG4gICAgbS5DaGVja2JveGVzTXVsdGlTZWxlY3QuaGFuZGxlKHNlbGVjdG9yLCBvcHRpb25zKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBtO1xyXG59XHJcbiIsImltcG9ydCB7IENhc2NhZGVTZWxlY3RNb2R1bGUgfSBmcm9tICcuLi9tb2R1bGUvZmllbGQtY2FzY2FkZS1zZWxlY3QnO1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUZpZWxkQ2FzY2FkZVNlbGVjdCgpOiBQcm9taXNlPENhc2NhZGVTZWxlY3RNb2R1bGU+IHtcclxuICBjb25zdCBtb2R1bGUgPSBhd2FpdCBpbXBvcnQoJy4uL21vZHVsZS9maWVsZC1jYXNjYWRlLXNlbGVjdCcpO1xyXG5cclxuICBhd2FpdCBtb2R1bGUucmVhZHk7XHJcblxyXG4gIHJldHVybiBtb2R1bGU7XHJcbn1cclxuIiwiaW1wb3J0IHsgRmlsZURyYWdNb2R1bGUgfSBmcm9tICcuLi9tb2R1bGUvZmllbGQtZmlsZS1kcmFnJztcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VGaWVsZEZpbGVEcmFnKCk6IFByb21pc2U8RmlsZURyYWdNb2R1bGU+IHtcclxuICBjb25zdCBtb2R1bGUgPSBhd2FpdCBpbXBvcnQoJy4uL21vZHVsZS9maWVsZC1maWxlLWRyYWcnKTtcclxuXHJcbiAgYXdhaXQgbW9kdWxlLnJlYWR5O1xyXG5cclxuICByZXR1cm4gbW9kdWxlO1xyXG59XHJcbiIsImV4cG9ydCBmdW5jdGlvbiB1c2VGaWVsZEZsYXRwaWNrcigpOiBQcm9taXNlPGFueT4ge1xyXG4gIHJldHVybiBpbXBvcnQoJy4uL21vZHVsZS9maWVsZC1mbGF0cGlja3InKTtcclxufVxyXG4iLCJpbXBvcnQgdHlwZSB7IE1vZGFsU2VsZWN0TW9kdWxlIH0gZnJvbSAnLi4vbW9kdWxlL2ZpZWxkLW1vZGFsLXNlbGVjdCc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlRmllbGRNb2RhbFNlbGVjdCgpOiBQcm9taXNlPE1vZGFsU2VsZWN0TW9kdWxlPiB7XHJcbiAgLy8gTW9kYWwgc2VsZWN0IGhhcyBubyBleHBvcnRzIG5vd1xyXG4gIHJldHVybiBpbXBvcnQoJy4uL21vZHVsZS9maWVsZC1tb2RhbC1zZWxlY3QnKTtcclxufVxyXG4iLCJleHBvcnQgZnVuY3Rpb24gdXNlRmllbGRNb2RhbFRyZWUoKSB7XHJcbiAgaW1wb3J0KCcuLi9tb2R1bGUvZmllbGQtbW9kYWwtdHJlZScpO1xyXG59XHJcbiIsImltcG9ydCB7IFJlcGVhdGFibGVNb2R1bGUgfSBmcm9tICcuLi9tb2R1bGUvZmllbGQtcmVwZWF0YWJsZSc7XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlRmllbGRSZXBlYXRhYmxlKCk6IFByb21pc2U8UmVwZWF0YWJsZU1vZHVsZT4ge1xyXG4gIGNvbnN0IG1vZHVsZSA9IGF3YWl0IGltcG9ydCgnLi4vbW9kdWxlL2ZpZWxkLXJlcGVhdGFibGUnKTtcclxuXHJcbiAgYXdhaXQgbW9kdWxlLnJlYWR5O1xyXG5cclxuICByZXR1cm4gbW9kdWxlO1xyXG59XHJcbiIsImltcG9ydCB7IFNpbmdsZUltYWdlRHJhZ01vZHVsZSB9IGZyb20gJy4uL21vZHVsZS9maWVsZC1zaW5nbGUtaW1hZ2UtZHJhZyc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlRmllbGRTaW5nbGVJbWFnZURyYWcoKTogUHJvbWlzZTxTaW5nbGVJbWFnZURyYWdNb2R1bGU+IHtcclxuICByZXR1cm4gaW1wb3J0KCcuLi9tb2R1bGUvZmllbGQtc2luZ2xlLWltYWdlLWRyYWcnKTtcclxufVxyXG4iLCJpbXBvcnQgdHlwZSB7IFVuaWNvcm5Gb3JtRWxlbWVudCB9IGZyb20gJy4uL21vZHVsZS9mb3JtJztcclxuaW1wb3J0IHsgc2VsZWN0T25lLCBtb2R1bGUgfSBmcm9tICcuLi9zZXJ2aWNlJztcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VGb3JtKGVsZT86IHN0cmluZyB8IEVsZW1lbnQsIG9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fSk6IFByb21pc2U8VW5pY29ybkZvcm1FbGVtZW50IHwgbnVsbD4ge1xyXG4gIGNvbnN0IHsgVW5pY29ybkZvcm1FbGVtZW50IH0gPSBhd2FpdCBpbXBvcnQoJy4uL21vZHVsZS9mb3JtJyk7XHJcblxyXG4gIGlmIChlbGUgPT0gbnVsbCkge1xyXG4gICAgcmV0dXJuIG5ldyBVbmljb3JuRm9ybUVsZW1lbnQodW5kZWZpbmVkLCB1bmRlZmluZWQsIG9wdGlvbnMpO1xyXG4gIH1cclxuXHJcbiAgY29uc3Qgc2VsZWN0b3IgPSB0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IHVuZGVmaW5lZDtcclxuICBjb25zdCBlbCA9IHNlbGVjdE9uZTxIVE1MRm9ybUVsZW1lbnQ+KGVsZSBhcyBzdHJpbmcpO1xyXG5cclxuICBpZiAoIWVsKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEZvcm0gZWxlbWVudCBvZjogJHtzZWxlY3Rvcn0gbm90IGZvdW5kLmApO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG1vZHVsZShcclxuICAgIGVsLFxyXG4gICAgJ3VuaWNvcm4uZm9ybScsXHJcbiAgICAoKSA9PiBuZXcgVW5pY29ybkZvcm1FbGVtZW50KHNlbGVjdG9yLCBlbCwgb3B0aW9ucylcclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlRm9ybUNvbXBvbmVudChlbGU/OiBzdHJpbmcgfCBFbGVtZW50LCBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge30pIHtcclxuICBjb25zdCBmb3JtID0gYXdhaXQgdXNlRm9ybShlbGUsIG9wdGlvbnMpO1xyXG5cclxuICBhd2FpdCBmb3JtPy5pbml0Q29tcG9uZW50KCk7XHJcblxyXG4gIHJldHVybiBmb3JtO1xyXG59XHJcbiIsImltcG9ydCB0eXBlIHsgVW5pY29ybkdyaWRFbGVtZW50IH0gZnJvbSAnLi4vbW9kdWxlL2dyaWQnO1xyXG5pbXBvcnQgeyB1c2VGb3JtIH0gZnJvbSAnLi91c2VGb3JtJztcclxuaW1wb3J0IHsgc2VsZWN0T25lLCBtb2R1bGUgfSBmcm9tICcuLi9zZXJ2aWNlJztcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VHcmlkKFxyXG4gIGVsZTogc3RyaW5nIHwgSFRNTEVsZW1lbnQsXHJcbiAgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55PiB8IHVuZGVmaW5lZCA9IHt9XHJcbik6IFByb21pc2U8VW5pY29ybkdyaWRFbGVtZW50IHwgbnVsbD4ge1xyXG4gIGNvbnN0IHsgVW5pY29ybkdyaWRFbGVtZW50IH0gPSBhd2FpdCBpbXBvcnQoJy4uL21vZHVsZS9ncmlkJyk7XHJcblxyXG4gIGNvbnN0IHNlbGVjdG9yID0gdHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiAnJztcclxuICBjb25zdCBlbGVtZW50ID0gc2VsZWN0T25lKGVsZSk7XHJcblxyXG4gIGlmICghZWxlbWVudCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdFbGVtZW50IGlzIGVtcHR5Jyk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBmb3JtID0gYXdhaXQgdXNlRm9ybShzZWxlY3RvciB8fCBlbGVtZW50KTtcclxuXHJcbiAgaWYgKCFmb3JtKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuaWNvcm5HcmlkIGlzIGRlcGVuZHMgb24gVW5pY29ybkZvcm0nKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBtb2R1bGUoXHJcbiAgICBlbGVtZW50LFxyXG4gICAgJ2dyaWQucGx1Z2luJyxcclxuICAgICgpID0+IG5ldyBVbmljb3JuR3JpZEVsZW1lbnQoc2VsZWN0b3IsIGVsZW1lbnQsIGZvcm0sIG9wdGlvbnMpXHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUdyaWRDb21wb25lbnQoXHJcbiAgZWxlOiBzdHJpbmcgfCBIVE1MRWxlbWVudCxcclxuICBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgdW5kZWZpbmVkID0ge31cclxuKTogUHJvbWlzZTxVbmljb3JuR3JpZEVsZW1lbnQgfCBudWxsPiB7XHJcbiAgY29uc3QgZ3JpZCA9IGF3YWl0IHVzZUdyaWQoZWxlLCBvcHRpb25zKTtcclxuXHJcbiAgYXdhaXQgZ3JpZD8uaW5pdENvbXBvbmVudCgpO1xyXG5cclxuICByZXR1cm4gZ3JpZDtcclxufVxyXG4iLCJpbXBvcnQgdHlwZSB7IFVuaWNvcm5IdHRwQ2xpZW50IH0gZnJvbSAnLi4vbW9kdWxlL2h0dHAtY2xpZW50JztcclxuaW1wb3J0IHR5cGUgeyBBeGlvc0luc3RhbmNlLCBDcmVhdGVBeGlvc0RlZmF1bHRzIH0gZnJvbSAnYXhpb3MnO1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUh0dHBDbGllbnQoY29uZmlnPzogQ3JlYXRlQXhpb3NEZWZhdWx0cyB8IEF4aW9zSW5zdGFuY2UpOiBQcm9taXNlPFVuaWNvcm5IdHRwQ2xpZW50PiB7XHJcbiAgY29uc3QgeyBVbmljb3JuSHR0cENsaWVudCB9ID0gYXdhaXQgaW1wb3J0KCcuLi9tb2R1bGUvaHR0cC1jbGllbnQnKTtcclxuXHJcbiAgaWYgKGNvbmZpZyAmJiAnaW50ZXJjZXB0b3JzJyBpbiBjb25maWcpIHtcclxuICAgIGNvbnN0IGF4aW9zID0gY29uZmlnIGFzIEF4aW9zSW5zdGFuY2U7XHJcblxyXG4gICAgY29uc3QgaHR0cCA9IG5ldyBVbmljb3JuSHR0cENsaWVudCgpO1xyXG5cclxuICAgIGh0dHAuYXhpb3MgPSBheGlvcztcclxuXHJcbiAgICByZXR1cm4gaHR0cDtcclxuICB9XHJcblxyXG4gIHJldHVybiBuZXcgVW5pY29ybkh0dHBDbGllbnQoY29uZmlnIGFzIENyZWF0ZUF4aW9zRGVmYXVsdHMgfCB1bmRlZmluZWQpO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlTG9hZGVkSHR0cENsaWVudChjb25maWc/OiBDcmVhdGVBeGlvc0RlZmF1bHRzKTogUHJvbWlzZTxVbmljb3JuSHR0cENsaWVudD4ge1xyXG4gIGNvbnN0IGh0dHAgPSBhd2FpdCB1c2VIdHRwQ2xpZW50KGNvbmZpZyk7XHJcblxyXG4gIC8vIExvYWQgYW5kIGNhY2hlIGF4aW9zXHJcbiAgYXdhaXQgaHR0cC5nZXRBeGlvc0luc3RhbmNlKCk7XHJcblxyXG4gIHJldHVybiBodHRwO1xyXG59XHJcbiIsImltcG9ydCB7IElmcmFtZU1vZGFsTW9kdWxlIH0gZnJvbSAnLi4vbW9kdWxlL2lmcmFtZS1tb2RhbCc7XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlSWZyYW1lTW9kYWwoKTogUHJvbWlzZTxJZnJhbWVNb2RhbE1vZHVsZT4ge1xyXG4gIGNvbnN0IG1vZHVsZSA9IGF3YWl0IGltcG9ydCgnLi4vbW9kdWxlL2lmcmFtZS1tb2RhbCcpO1xyXG5cclxuICBhd2FpdCBtb2R1bGUucmVhZHk7XHJcblxyXG4gIHJldHVybiBtb2R1bGU7XHJcbn1cclxuIiwiaW1wb3J0IHR5cGUgeyBMaXN0RGVwZW5kZW50LCBMaXN0RGVwZW5kZW50TW9kdWxlLCBMaXN0RGVwZW5kZW50T3B0aW9ucyB9IGZyb20gJy4uL21vZHVsZS9saXN0LWRlcGVuZGVudCc7XHJcbmltcG9ydCB7IE51bGxhYmxlIH0gZnJvbSAnLi4vdHlwZXMnO1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUxpc3REZXBlbmRlbnQoKTogUHJvbWlzZTxMaXN0RGVwZW5kZW50TW9kdWxlPjtcclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUxpc3REZXBlbmRlbnQoXHJcbiAgZWxlbWVudDogc3RyaW5nIHwgSFRNTFNlbGVjdEVsZW1lbnQsXHJcbiAgZGVwZW5kZW50PzogTnVsbGFibGU8c3RyaW5nIHwgSFRNTFNlbGVjdEVsZW1lbnQ+LFxyXG4gIG9wdGlvbnM/OiBQYXJ0aWFsPExpc3REZXBlbmRlbnRPcHRpb25zPlxyXG4pOiBQcm9taXNlPExpc3REZXBlbmRlbnQ+O1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlTGlzdERlcGVuZGVudChcclxuICBlbGVtZW50PzogTnVsbGFibGU8c3RyaW5nIHwgSFRNTFNlbGVjdEVsZW1lbnQ+LFxyXG4gIGRlcGVuZGVudD86IE51bGxhYmxlPHN0cmluZyB8IEhUTUxTZWxlY3RFbGVtZW50PixcclxuICBvcHRpb25zOiBQYXJ0aWFsPExpc3REZXBlbmRlbnRPcHRpb25zPiA9IHt9XHJcbik6IFByb21pc2U8YW55PiB7XHJcbiAgY29uc3QgbW9kdWxlID0gYXdhaXQgaW1wb3J0KCcuLi9tb2R1bGUvbGlzdC1kZXBlbmRlbnQnKTtcclxuXHJcbiAgYXdhaXQgbW9kdWxlLnJlYWR5O1xyXG5cclxuICBpZiAoZWxlbWVudCkge1xyXG4gICAgY29uc3QgeyBMaXN0RGVwZW5kZW50IH0gPSBtb2R1bGU7XHJcblxyXG4gICAgcmV0dXJuIExpc3REZXBlbmRlbnQuaGFuZGxlKGVsZW1lbnQsIGRlcGVuZGVudCA/PyB1bmRlZmluZWQsIG9wdGlvbnMpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG1vZHVsZTtcclxufVxyXG4iLCJpbXBvcnQgeyBEaWN0aW9uYXJ5IH0gZnJvbSAnLi4vdHlwZXMnO1xyXG5pbXBvcnQgeyBUYXNrUXVldWUsIHF1ZXVlIH0gZnJvbSAnQGx5cmFzb2Z0L3RzLXRvb2xraXQvZ2VuZXJpYyc7XHJcblxyXG5jb25zdCBxdWV1ZXM6IERpY3Rpb25hcnk8VGFza1F1ZXVlPiA9IHt9O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZVF1ZXVlKG5hbWU6IHN0cmluZyA9ICdkZWZhdWx0JywgbWF4UnVubmluZyA9IDEpOiBUYXNrUXVldWUge1xyXG4gIHJldHVybiBxdWV1ZXNbbmFtZV0gPz89IGNyZWF0ZVF1ZXVlKG1heFJ1bm5pbmcpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUXVldWUobWF4UnVubmluZyA9IDEpOiBUYXNrUXVldWUge1xyXG4gIHJldHVybiBxdWV1ZShtYXhSdW5uaW5nKTtcclxufVxyXG5cclxuIiwiaW1wb3J0IHtcclxuICBTM011bHRpcGFydFVwbG9hZGVyLFxyXG4gIFMzTXVsdGlwYXJ0VXBsb2FkZXJNb2R1bGUsXHJcbiAgUzNNdWx0aXBhcnRVcGxvYWRlck9wdGlvbnNcclxufSBmcm9tICcuLi9tb2R1bGUvczMtbXVsdGlwYXJ0LXVwbG9hZGVyJztcclxuaW1wb3J0IHR5cGUgeyBTM1VwbG9hZGVyLCBTM1VwbG9hZGVyR2xvYmFsT3B0aW9ucywgUzNVcGxvYWRlck1vZHVsZSB9IGZyb20gJy4uL21vZHVsZS9zMy11cGxvYWRlcic7XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlUzNVcGxvYWRlcigpOiBQcm9taXNlPFMzVXBsb2FkZXJNb2R1bGU+O1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlUzNVcGxvYWRlcihuYW1lOiBzdHJpbmcsIG9wdGlvbnM/OiBQYXJ0aWFsPFMzVXBsb2FkZXJHbG9iYWxPcHRpb25zPik6IFByb21pc2U8UzNVcGxvYWRlcj47XHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VTM1VwbG9hZGVyKG5hbWU/OiBzdHJpbmcsIG9wdGlvbnM6IFBhcnRpYWw8UzNVcGxvYWRlckdsb2JhbE9wdGlvbnM+ID0ge30pOiBQcm9taXNlPGFueT4ge1xyXG4gIGNvbnN0IG1vZHVsZSA9IGF3YWl0IGltcG9ydCgnLi4vbW9kdWxlL3MzLXVwbG9hZGVyJyk7XHJcblxyXG4gIGlmICghbmFtZSkge1xyXG4gICAgcmV0dXJuIG1vZHVsZTtcclxuICB9XHJcblxyXG4gIGNvbnN0IHsgZ2V0IH0gPSBtb2R1bGU7XHJcblxyXG4gIHJldHVybiBnZXQobmFtZSwgb3B0aW9ucyk7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VTM011bHRpcGFydFVwbG9hZGVyKCk6IFByb21pc2U8UzNNdWx0aXBhcnRVcGxvYWRlck1vZHVsZT47XHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VTM011bHRpcGFydFVwbG9hZGVyKG9wdGlvbnM6IFBhcnRpYWw8UzNNdWx0aXBhcnRVcGxvYWRlck9wdGlvbnM+KTogUHJvbWlzZTxTM011bHRpcGFydFVwbG9hZGVyPjtcclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZVMzTXVsdGlwYXJ0VXBsb2FkZXIob3B0aW9ucz86IFBhcnRpYWw8UzNNdWx0aXBhcnRVcGxvYWRlck9wdGlvbnM+KTogUHJvbWlzZTxhbnk+IHtcclxuICBjb25zdCBtb2R1bGUgPSBhd2FpdCBpbXBvcnQoJy4uL21vZHVsZS9zMy1tdWx0aXBhcnQtdXBsb2FkZXInKTtcclxuXHJcbiAgaWYgKG9wdGlvbnMgIT0gbnVsbCkge1xyXG4gICAgcmV0dXJuIG5ldyBtb2R1bGUuUzNNdWx0aXBhcnRVcGxvYWRlcihvcHRpb25zKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBtb2R1bGU7XHJcbn1cclxuIiwiaW1wb3J0IHsgU2hvd09uTW9kdWxlIH0gZnJvbSAnLi4vbW9kdWxlL3Nob3ctb24nO1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZVNob3dPbigpOiBQcm9taXNlPFNob3dPbk1vZHVsZT4ge1xyXG4gIGNvbnN0IG1vZHVsZSA9IGF3YWl0IGltcG9ydCgnLi4vbW9kdWxlL3Nob3ctb24nKTtcclxuXHJcbiAgYXdhaXQgbW9kdWxlLnJlYWR5O1xyXG5cclxuICByZXR1cm4gbW9kdWxlO1xyXG59XHJcbiIsIlxyXG5pbXBvcnQgeyBEaWN0aW9uYXJ5IH0gZnJvbSAnLi4vdHlwZXMnO1xyXG5pbXBvcnQgeyBTdGFjaywgc3RhY2sgfSBmcm9tICdAbHlyYXNvZnQvdHMtdG9vbGtpdC9nZW5lcmljJztcclxuXHJcbmNvbnN0IHN0YWNrczogRGljdGlvbmFyeTxTdGFjaz4gPSB7fTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VTdGFjazxUID0gYW55PihuYW1lOiBzdHJpbmcgPSAnZGVmYXVsdCcsIHN0b3JlOiBhbnlbXSA9IFtdKTogU3RhY2s8VD4ge1xyXG4gIHJldHVybiBzdGFja3NbbmFtZV0gPz89IGNyZWF0ZVN0YWNrPFQ+KHN0b3JlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVN0YWNrPFQgPSBhbnk+KHN0b3JlOiBhbnlbXSA9IFtdKTogU3RhY2s8VD4ge1xyXG4gIHJldHVybiBzdGFjazxUPihzdG9yZSk7XHJcbn1cclxuIiwiaW1wb3J0IHsgbW9kdWxlLCB1c2VDc3NJbXBvcnQsIHVzZUNzc0luY2x1ZGVzLCB1c2VJbXBvcnQsIHdhaXQgfSBmcm9tICcuLi9zZXJ2aWNlJztcclxuaW1wb3J0IHR5cGUgeyBOdWxsYWJsZSB9IGZyb20gJy4uL3R5cGVzJztcclxuaW1wb3J0IHsgbWVyZ2VEZWVwIH0gZnJvbSAnLi4vdXRpbGl0aWVzJztcclxuXHJcbi8qKlxyXG4gKiBAc2VlIGh0dHBzOi8vdG9tLXNlbGVjdC5qcy5vcmcvXHJcbiAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlVG9tU2VsZWN0KFxyXG4gIHNlbGVjdG9yPzogTnVsbGFibGU8c3RyaW5nIHwgSFRNTEVsZW1lbnQgfCBOb2RlTGlzdE9mPEhUTUxFbGVtZW50Pj4sXHJcbiAgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9LFxyXG4gIHRoZW1lOiBzdHJpbmcgPSAnYm9vdHN0cmFwNSdcclxuKSB7XHJcbiAgY29uc3QgW21dID0gYXdhaXQgd2FpdChcclxuICAgIHVzZUltcG9ydCgnQHZlbmRvci90b20tc2VsZWN0L2Rpc3QvanMvdG9tLXNlbGVjdC5jb21wbGV0ZS5taW4uanMnKSxcclxuICAgIHVzZUNzc0ltcG9ydChgQHZlbmRvci90b20tc2VsZWN0L2Rpc3QvY3NzL3RvbS1zZWxlY3QuJHt0aGVtZX0ubWluLmNzc2ApXHJcbiAgKTtcclxuXHJcbiAgaWYgKHNlbGVjdG9yKSB7XHJcbiAgICBtb2R1bGU8YW55LCBIVE1MU2VsZWN0RWxlbWVudD4oXHJcbiAgICAgIHNlbGVjdG9yLFxyXG4gICAgICAndG9tLnNlbGVjdCcsXHJcbiAgICAgIChlbGUpID0+IHtcclxuICAgICAgICBvcHRpb25zID0gbWVyZ2VEZWVwKHtcclxuICAgICAgICAgIGFsbG93RW1wdHlPcHRpb246IHRydWUsXHJcbiAgICAgICAgICBtYXhPcHRpb25zOiBudWxsLFxyXG4gICAgICAgICAgcGx1Z2luczoge1xyXG4gICAgICAgICAgICBjYXJldF9wb3NpdGlvbjoge30sXHJcbiAgICAgICAgICAgIGNsZWFyX2J1dHRvbjoge30sXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgIGlmICgoZWxlIGFzIEhUTUxTZWxlY3RFbGVtZW50KS5tdWx0aXBsZSkge1xyXG4gICAgICAgICAgb3B0aW9ucy5wbHVnaW5zLnJlbW92ZV9idXR0b24gPSB7fTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgb3B0aW9ucy5wbHVnaW5zLmRyb3Bkb3duX2lucHV0ID0ge307XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBBdXRvIHNlbGVjdCBmaXJzdCBpZiBvcHRpb25zIGNoYW5nZWQuXHJcbiAgICAgICAgLy8gQHNlZSBodHRwczovL2dpdGh1Yi5jb20vb3JjaGlkanMvdG9tLXNlbGVjdC9pc3N1ZXMvMzYyXHJcbiAgICAgICAgY2xhc3MgVW5pY29yblRvbVNlbGVjdCBleHRlbmRzIFRvbVNlbGVjdCB7XHJcbiAgICAgICAgICBzeW5jT3B0aW9uc1dpdGhvdXRLZWVwU2VsZWN0ZWQoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG9sZFZhbHVlID0gZWxlLnZhbHVlO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jbGVhcigpO1xyXG4gICAgICAgICAgICB0aGlzLmNsZWFyT3B0aW9ucygpO1xyXG4gICAgICAgICAgICB0aGlzLnN5bmMoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChlbGUudmFsdWUgIT09IG9sZFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZShcclxuICAgICAgICAgICAgICAgIGVsZS5xdWVyeVNlbGVjdG9yPEhUTUxPcHRpb25FbGVtZW50Pihgb3B0aW9uW3ZhbHVlPVwiJHtvbGRWYWx1ZX1cIl1gKT8udmFsdWVcclxuICAgICAgICAgICAgICAgID8/IGVsZS5xdWVyeVNlbGVjdG9yPEhUTUxPcHRpb25FbGVtZW50Pignb3B0aW9uJyk/LnZhbHVlXHJcbiAgICAgICAgICAgICAgICA/PyAnJyxcclxuICAgICAgICAgICAgICAgIHRydWVcclxuICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgY29uc3QgdCA9IG5ldyBVbmljb3JuVG9tU2VsZWN0KGVsZSBhcyBUb21JbnB1dCwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgIGVsZS5hZGRFdmVudExpc3RlbmVyKCdsaXN0OnVwZGF0ZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICB0LnN5bmNPcHRpb25zV2l0aG91dEtlZXBTZWxlY3RlZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgICAgfVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBtO1xyXG59XHJcbiIsImltcG9ydCB0eXBlIHsgVG9vbHRpcCB9IGZyb20gJ2Jvb3RzdHJhcCc7XHJcbmltcG9ydCB7IEJ1dHRvblJhZGlvT3B0aW9ucyB9IGZyb20gJy4uL2Jvb3RzdHJhcC9idXR0b24tcmFkaW8nO1xyXG5pbXBvcnQgdHlwZSB7IEtlZXBUYWJPcHRpb25zIH0gZnJvbSAnLi4vYm9vdHN0cmFwL2tlZXAtdGFiJztcclxuaW1wb3J0IHR5cGUgeyBVSUJvb3RzdHJhcDUgfSBmcm9tICcuLi9tb2R1bGUvdWktYm9vdHN0cmFwNSc7XHJcbmltcG9ydCB7IHVzZVVJVGhlbWUgfSBmcm9tICcuLi9zZXJ2aWNlJztcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VVSUJvb3RzdHJhcDUoaW5zdGFsbCA9IGZhbHNlLCBwdXNoVG9HbG9iYWwgPSBmYWxzZSk6IFByb21pc2U8VUlCb290c3RyYXA1PiB7XHJcbiAgY29uc3QgeyBVSUJvb3RzdHJhcDUgfSA9IGF3YWl0IGltcG9ydCgnLi4vbW9kdWxlL3VpLWJvb3RzdHJhcDUnKTtcclxuXHJcbiAgY29uc3QgdGhlbWUgPSBVSUJvb3RzdHJhcDUuZ2V0KCk7XHJcblxyXG4gIGlmIChpbnN0YWxsKSB7XHJcbiAgICB1c2VVSVRoZW1lKHRoZW1lKTtcclxuXHJcbiAgICBpZiAocHVzaFRvR2xvYmFsKSB7XHJcbiAgICAgIHRoZW1lLnB1c2hCb290c3RyYXBUb0dsb2JhbCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRoZW1lO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlQnM1VG9vbHRpcChcclxuICBzZWxlY3RvcjogTm9kZUxpc3RPZjxFbGVtZW50PiB8IEVsZW1lbnQgfCBzdHJpbmcgPSAnW2RhdGEtYnMtdG9nZ2xlPVwidG9vbHRpcFwiXScsXHJcbiAgY29uZmlnOiBQYXJ0aWFsPFRvb2x0aXAuT3B0aW9ucz4gPSB7fVxyXG4pOiBQcm9taXNlPFRvb2x0aXBbXT4ge1xyXG4gIGNvbnN0IGJzNSA9IGF3YWl0IHVzZVVJQm9vdHN0cmFwNSgpO1xyXG5cclxuICByZXR1cm4gYnM1LnRvb2x0aXAoc2VsZWN0b3IsIGNvbmZpZyk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCB1c2VCczVLZWVwVGFiOiB0eXBlb2YgVUlCb290c3RyYXA1LnByb3RvdHlwZS5rZWVwVGFiID0gYXN5bmMgKFxyXG4gIHNlbGVjdG9yPzogc3RyaW5nIHwgSFRNTEVsZW1lbnQsXHJcbiAgb3B0aW9uczogS2VlcFRhYk9wdGlvbnMgPSB7fVxyXG4pOiBQcm9taXNlPGFueT4gPT4ge1xyXG4gIGNvbnN0IGJzNSA9IGF3YWl0IHVzZVVJQm9vdHN0cmFwNSgpO1xyXG5cclxuICByZXR1cm4gYnM1LmtlZXBUYWIoc2VsZWN0b3IsIG9wdGlvbnMpO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IHVzZUJzNUJ1dHRvblJhZGlvOiB0eXBlb2YgVUlCb290c3RyYXA1LnByb3RvdHlwZS5idXR0b25SYWRpbyA9IGFzeW5jIChcclxuICBzZWxlY3Rvcj86IHN0cmluZyB8IEhUTUxFbGVtZW50LFxyXG4gIG9wdGlvbnM6IEJ1dHRvblJhZGlvT3B0aW9ucyA9IHt9XHJcbik6IFByb21pc2U8YW55PiA9PiB7XHJcbiAgY29uc3QgYnM1ID0gYXdhaXQgdXNlVUlCb290c3RyYXA1KCk7XHJcblxyXG4gIHJldHVybiBiczUuYnV0dG9uUmFkaW8oc2VsZWN0b3IsIG9wdGlvbnMpO1xyXG59O1xyXG4iLCJpbXBvcnQgeyBEaWN0aW9uYXJ5IH0gZnJvbSAnLi4vdHlwZXMnO1xyXG5pbXBvcnQgdHlwZSB7IGRlZmF1bHQgYXMgV2ViRGlyZWN0aXZlIH0gZnJvbSAnd2ViLWRpcmVjdGl2ZSc7XHJcbmltcG9ydCB0eXBlIHsgV2ViRGlyZWN0aXZlSGFuZGxlciwgV2ViRGlyZWN0aXZlT3B0aW9ucyB9IGZyb20gJ3dlYi1kaXJlY3RpdmUvc3JjL3R5cGVzJztcclxuXHJcbmxldCBpbnN0YW5jZXM6IERpY3Rpb25hcnk8V2ViRGlyZWN0aXZlPiA9IHt9O1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZVdlYkRpcmVjdGl2ZShcclxuICBuYW1lOiBzdHJpbmcgPSAndW5pY29ybicsXHJcbiAgb3B0aW9uczogUGFydGlhbDxXZWJEaXJlY3RpdmVPcHRpb25zPiA9IHt9XHJcbik6IFByb21pc2U8V2ViRGlyZWN0aXZlPiB7XHJcbiAgcmV0dXJuIGluc3RhbmNlc1tuYW1lXSA/Pz0gYXdhaXQgY3JlYXRlV2ViRGlyZWN0aXZlKE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHsgcHJlZml4OiAndW5pLScgfSkpO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlVW5pRGlyZWN0aXZlPFQgZXh0ZW5kcyBFbGVtZW50ID0gSFRNTEVsZW1lbnQ+KFxyXG4gIG5hbWU6IHN0cmluZyxcclxuICBoYW5kbGVyOiBXZWJEaXJlY3RpdmVIYW5kbGVyPFQ+LFxyXG4gIHdkSW5zdGFuY2U6IFdlYkRpcmVjdGl2ZSB8IHN0cmluZyA9ICd1bmljb3JuJ1xyXG4pOiBQcm9taXNlPHZvaWQ+IHtcclxuICBjb25zdCB3ZCA9IHR5cGVvZiB3ZEluc3RhbmNlID09PSAnc3RyaW5nJyA/IGF3YWl0IHVzZVdlYkRpcmVjdGl2ZSh3ZEluc3RhbmNlKSA6IHdkSW5zdGFuY2U7XHJcblxyXG4gIC8vIFRvZG86IFNob3VsZCBmaXggd2ViLWRpcmVjdGl2ZSB0eXBlc1xyXG4gIHdkLnJlZ2lzdGVyKG5hbWUsIGhhbmRsZXIgYXMgV2ViRGlyZWN0aXZlSGFuZGxlcjxhbnk+KTtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gY3JlYXRlV2ViRGlyZWN0aXZlKG9wdGlvbnM6IFBhcnRpYWw8V2ViRGlyZWN0aXZlT3B0aW9ucz4gPSB7fSk6IFByb21pc2U8V2ViRGlyZWN0aXZlPiB7XHJcbiAgY29uc3QgV2ViRGlyZWN0aXZlID0gKGF3YWl0IGltcG9ydCgnd2ViLWRpcmVjdGl2ZScpKS5kZWZhdWx0O1xyXG5cclxuICBjb25zdCB3ZCA9IG5ldyBXZWJEaXJlY3RpdmUob3B0aW9ucyk7XHJcbiAgd2QubGlzdGVuKCk7XHJcblxyXG4gIHJldHVybiB3ZDtcclxufVxyXG4iLCJpbXBvcnQgdHlwZSB7XHJcbiAgVW5pY29ybkZpZWxkVmFsaWRhdGlvbixcclxuICBVbmljb3JuRm9ybVZhbGlkYXRpb24sXHJcbiAgVmFsaWRhdGlvbkhhbmRsZXIsXHJcbiAgVmFsaWRhdGlvbk1vZHVsZVxyXG59IGZyb20gJy4uL21vZHVsZS92YWxpZGF0aW9uJztcclxuaW1wb3J0IHsgZ2V0Qm91bmRlZEluc3RhbmNlIH0gZnJvbSAnLi4vc2VydmljZSc7XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlRm9ybVZhbGlkYXRpb24oKTogUHJvbWlzZTxWYWxpZGF0aW9uTW9kdWxlPjtcclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUZvcm1WYWxpZGF0aW9uKHNlbGVjdG9yOiBzdHJpbmcgfCBFbGVtZW50KTogUHJvbWlzZTxVbmljb3JuRm9ybVZhbGlkYXRpb24gfCBudWxsPjtcclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUZvcm1WYWxpZGF0aW9uKHNlbGVjdG9yPzogc3RyaW5nIHwgRWxlbWVudCk6IFByb21pc2U8YW55PiB7XHJcbiAgY29uc3QgbW9kdWxlID0gYXdhaXQgaW1wb3J0KCcuLi9tb2R1bGUvdmFsaWRhdGlvbicpO1xyXG5cclxuICBhd2FpdCBtb2R1bGUucmVhZHk7XHJcblxyXG4gIGlmICghc2VsZWN0b3IpIHtcclxuICAgIHJldHVybiBtb2R1bGU7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdXNlRm9ybVZhbGlkYXRpb25TeW5jKHNlbGVjdG9yKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZUZvcm1WYWxpZGF0aW9uU3luYyhzZWxlY3Rvcjogc3RyaW5nIHwgRWxlbWVudCk6IFVuaWNvcm5Gb3JtVmFsaWRhdGlvbiB8IG51bGwge1xyXG4gIHJldHVybiBnZXRCb3VuZGVkSW5zdGFuY2U8VW5pY29ybkZvcm1WYWxpZGF0aW9uPihzZWxlY3RvciwgJ2Zvcm0udmFsaWRhdGlvbicpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlRmllbGRWYWxpZGF0aW9uU3luYyhzZWxlY3Rvcjogc3RyaW5nIHwgRWxlbWVudCk6IFVuaWNvcm5GaWVsZFZhbGlkYXRpb24gfCBudWxsIHtcclxuICByZXR1cm4gZ2V0Qm91bmRlZEluc3RhbmNlPFVuaWNvcm5GaWVsZFZhbGlkYXRpb24+KHNlbGVjdG9yLCAnZmllbGQudmFsaWRhdGlvbicpO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYWRkR2xvYmFsVmFsaWRhdG9yKFxyXG4gIG5hbWU6IHN0cmluZyxcclxuICB2YWxpZGF0b3I6IFZhbGlkYXRpb25IYW5kbGVyLFxyXG4gIG9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fVxyXG4pOiBQcm9taXNlPHZvaWQ+IHtcclxuICBjb25zdCB7IFVuaWNvcm5Gb3JtVmFsaWRhdGlvbiB9ID0gYXdhaXQgdXNlRm9ybVZhbGlkYXRpb24oKTtcclxuXHJcbiAgVW5pY29ybkZvcm1WYWxpZGF0aW9uLmFkZEdsb2JhbFZhbGlkYXRvcihuYW1lLCB2YWxpZGF0b3IsIG9wdGlvbnMpO1xyXG59XHJcbiIsImltcG9ydCB7IEFsZXJ0QWRhcHRlciwgZGVsZXRlQ29uZmlybSwgc2ltcGxlQWxlcnQsIHNpbXBsZUNvbmZpcm0gfSBmcm9tICdAbHlyYXNvZnQvdHMtdG9vbGtpdC9nZW5lcmljJztcclxuaW1wb3J0IHR5cGUgeyBBbHBpbmUgYXMgQWxwaW5lR2xvYmFsIH0gZnJvbSAnYWxwaW5lanMnO1xyXG5pbXBvcnQgdHlwZSB7IGRlZmF1bHQgYXMgU3BlY3RydW1HbG9iYWwgfSBmcm9tICdzcGVjdHJ1bS12YW5pbGxhJztcclxuaW1wb3J0IHR5cGUgeyBTcGVjdHJ1bU9wdGlvbnMgfSBmcm9tICdzcGVjdHJ1bS12YW5pbGxhL2Rpc3QvdHlwZXMvdHlwZXMnO1xyXG5pbXBvcnQgdHlwZSB7IGRlZmF1bHQgYXMgVG9tU2VsZWN0R2xvYmFsIH0gZnJvbSAndG9tLXNlbGVjdCc7XHJcbmltcG9ydCB7IHVzZVN0YWNrIH0gZnJvbSAnLi4vY29tcG9zYWJsZSc7XHJcbmltcG9ydCB7IGRhdGEsIHJlbW92ZURhdGEgfSBmcm9tICcuLi9kYXRhJztcclxuaW1wb3J0IHR5cGUgeyBDb25zdHJ1Y3RvciwgTWF5YmVQcm9taXNlLCBOdWxsYWJsZSwgVUlUaGVtZUludGVyZmFjZSB9IGZyb20gJy4uL3R5cGVzJztcclxuaW1wb3J0IHsgYW5pbWF0ZVRvIH0gZnJvbSAnLi9hbmltYXRlJztcclxuaW1wb3J0IHsgaHRtbCwgbW9kdWxlLCBzZWxlY3RBbGwsIHNlbGVjdE9uZSB9IGZyb20gJy4vZG9tJztcclxuaW1wb3J0IHsgbmV4dFRpY2sgfSBmcm9tICcuL2hlbHBlcic7XHJcbmltcG9ydCB7IHVzZUNzc0ltcG9ydCwgdXNlSW1wb3J0IH0gZnJvbSAnLi9sb2FkZXInO1xyXG5cclxubGV0IHVpOiBVbmljb3JuVUk7XHJcblxyXG5BbGVydEFkYXB0ZXIuYWxlcnQgPSAodGl0bGU6IHN0cmluZywgdGV4dCA9ICcnLCB0eXBlID0gJ2luZm8nKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgaWYgKHRleHQpIHtcclxuICAgIHRpdGxlICs9ICcgfCAnICsgdGV4dDtcclxuICB9XHJcblxyXG4gIHdpbmRvdy5hbGVydCh0aXRsZSk7XHJcblxyXG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxufTtcclxuXHJcbkFsZXJ0QWRhcHRlci5jb25maXJtID0gKG1lc3NhZ2U6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4gPT4ge1xyXG4gIG1lc3NhZ2UgPSBtZXNzYWdlIHx8ICdBcmUgeW91IHN1cmU/JztcclxuXHJcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICByZXNvbHZlKHdpbmRvdy5jb25maXJtKG1lc3NhZ2UpKTtcclxuICB9KTtcclxufTtcclxuXHJcbkFsZXJ0QWRhcHRlci5jb25maXJtVGV4dCA9ICgpID0+ICdPSyc7XHJcbkFsZXJ0QWRhcHRlci5jYW5jZWxUZXh0ID0gKCkgPT4gJ0NhbmNlbCc7XHJcbkFsZXJ0QWRhcHRlci5kZWxldGVUZXh0ID0gKCkgPT4gJ0RlbGV0ZSc7XHJcblxyXG5leHBvcnQgeyBzaW1wbGVBbGVydCwgc2ltcGxlQ29uZmlybSwgZGVsZXRlQ29uZmlybSwgQWxlcnRBZGFwdGVyIH07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlVUkoaW5zdGFuY2U/OiBVbmljb3JuVUkpOiBVbmljb3JuVUkge1xyXG4gIGlmIChpbnN0YW5jZSkge1xyXG4gICAgdWkgPSBpbnN0YW5jZTtcclxuICB9XHJcblxyXG4gIHJldHVybiB1aSA/Pz0gbmV3IFVuaWNvcm5VSSgpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlVUlUaGVtZTxUIGV4dGVuZHMgVUlUaGVtZUludGVyZmFjZT4odGhlbWU/OiBUIHwgQ29uc3RydWN0b3I8VD4pOiBUIHtcclxuICBjb25zdCB1aSA9IHVzZVVJKCk7XHJcblxyXG4gIGlmICh1aS50aGVtZSAmJiAhdGhlbWUpIHtcclxuICAgIHJldHVybiB1aS50aGVtZTtcclxuICB9XHJcblxyXG4gIGlmICh0eXBlb2YgdGhlbWUgPT09ICdmdW5jdGlvbicpIHtcclxuICAgIHRoZW1lID0gbmV3IHRoZW1lKCk7XHJcbiAgfVxyXG5cclxuICB1aS5pbnN0YWxsVGhlbWUodGhlbWUpO1xyXG5cclxuICByZXR1cm4gdWkudGhlbWU7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBVbmljb3JuVUkge1xyXG4gIHRoZW1lPzogYW55O1xyXG4gIGFsaXZlSGFuZGxlPzogYW55O1xyXG5cclxuICBzdGF0aWMgZ2V0IGRlZmF1bHRPcHRpb25zKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbWVzc2FnZVNlbGVjdG9yOiAnLm1lc3NhZ2Utd3JhcCcsXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgaW5zdGFsbFRoZW1lKHRoZW1lOiBhbnkpIHtcclxuICAgIHRoaXMudGhlbWUgPSB0aGVtZTtcclxuICB9XHJcblxyXG4gIC8vIGNvbmZpcm0obWVzc2FnZTogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgLy8gICBtZXNzYWdlID0gbWVzc2FnZSB8fCAnQXJlIHlvdSBzdXJlPyc7XHJcbiAgLy9cclxuICAvLyAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gIC8vICAgICByZXNvbHZlKHdpbmRvdy5jb25maXJtKG1lc3NhZ2UpKTtcclxuICAvLyAgIH0pO1xyXG4gIC8vIH1cclxuICAvL1xyXG4gIC8vIGFsZXJ0KHRpdGxlOiBzdHJpbmcsIHRleHQgPSAnJywgdHlwZSA9ICdpbmZvJyk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gIC8vICAgaWYgKHRleHQpIHtcclxuICAvLyAgICAgdGl0bGUgKz0gJyB8ICcgKyB0ZXh0O1xyXG4gIC8vICAgfVxyXG4gIC8vXHJcbiAgLy8gICB3aW5kb3cuYWxlcnQodGl0bGUpO1xyXG4gIC8vXHJcbiAgLy8gICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xyXG4gIC8vIH1cclxufVxyXG5cclxuY29uc3QgcHJlcGFyZXM6IEFscGluZVByZXBhcmVDYWxsYmFja1tdID0gW107XHJcbnR5cGUgQWxwaW5lUHJlcGFyZUNhbGxiYWNrID0gKEFscGluZTogQWxwaW5lR2xvYmFsKSA9PiBNYXliZVByb21pc2U8YW55PjtcclxuY29uc3QgeyBwcm9taXNlOiBhbHBpbmVMb2FkZWQsIHJlc29sdmU6IGFscGluZVJlc29sdmUgfSA9IFByb21pc2Uud2l0aFJlc29sdmVyczxBbHBpbmVHbG9iYWw+KCk7XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9hZEFscGluZShjYWxsYmFjaz86IE51bGxhYmxlPEFscGluZVByZXBhcmVDYWxsYmFjaz4pOiBQcm9taXNlPEFscGluZUdsb2JhbD4ge1xyXG4gIGlmIChjYWxsYmFjayAmJiAhd2luZG93LkFscGluZSkge1xyXG4gICAgcHJlcGFyZXMucHVzaChjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxuICBjb25zdCB7IGRlZmF1bHQ6IEFscGluZSB9OiB7IGRlZmF1bHQ6IEFscGluZUdsb2JhbCB9ID0gYXdhaXQgdXNlSW1wb3J0KCdAYWxwaW5lanMnKTtcclxuXHJcbiAgaWYgKCF3aW5kb3cuQWxwaW5lKSB7XHJcbiAgICBhd2FpdCBQcm9taXNlLmFsbChwcmVwYXJlcy5tYXAoKGNhbGxiYWNrKSA9PiBQcm9taXNlLnJlc29sdmUoY2FsbGJhY2soQWxwaW5lKSkpKTtcclxuXHJcbiAgICBBbHBpbmUuc3RhcnQoKTtcclxuXHJcbiAgICB3aW5kb3cuQWxwaW5lID0gQWxwaW5lO1xyXG5cclxuICAgIGFscGluZVJlc29sdmUoQWxwaW5lKTtcclxuICB9IGVsc2UgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICBhd2FpdCBjYWxsYmFjayhBbHBpbmUpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIEFscGluZTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGluaXRBbHBpbmVDb21wb25lbnQoZGlyZWN0aXZlOiBzdHJpbmcpIHtcclxuICBjb25zdCBBbHBpbmUgPSBhd2FpdCBhbHBpbmVMb2FkZWQ7XHJcblxyXG4gIGF3YWl0IG5leHRUaWNrKCk7XHJcblxyXG4gIHNlbGVjdEFsbDxIVE1MRWxlbWVudD4oYFske2RpcmVjdGl2ZX1dYCwgKGVsKSA9PiB7XHJcbiAgICBjb25zdCBjb2RlID0gZWwuZ2V0QXR0cmlidXRlKGRpcmVjdGl2ZSkgfHwgJyc7XHJcbiAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoZGlyZWN0aXZlKTtcclxuXHJcbiAgICAvLyBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbHBpbmVqcy9hbHBpbmUvaXNzdWVzLzM1OSNpc3N1ZWNvbW1lbnQtOTczNjg4NDY0XHJcbiAgICBBbHBpbmUubXV0YXRlRG9tKCgpID0+IHtcclxuICAgICAgZWwuc2V0QXR0cmlidXRlKCd4LWRhdGEnLCBjb2RlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIEFscGluZS5pbml0VHJlZShlbCk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBCZWZvcmUgQWxwaW5lIGluaXRcclxuICovXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwcmVwYXJlQWxwaW5lKGNhbGxiYWNrOiBBbHBpbmVQcmVwYXJlQ2FsbGJhY2spIHtcclxuICBpZiAod2luZG93LkFscGluZSkge1xyXG4gICAgYXdhaXQgY2FsbGJhY2sod2luZG93LkFscGluZSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHByZXBhcmVzLnB1c2goY2FsbGJhY2spO1xyXG4gIH1cclxufVxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcHJlcGFyZUFscGluZURlZmVyKGNhbGxiYWNrOiBBbHBpbmVQcmVwYXJlQ2FsbGJhY2spIHtcclxuICBjb25zdCBBbHBpbmUgPSBhd2FpdCBhbHBpbmVMb2FkZWQ7XHJcblxyXG4gIGF3YWl0IGNhbGxiYWNrKHdpbmRvdy5BbHBpbmUpO1xyXG59XHJcblxyXG4vKipcclxuICogUmVuZGVyIE1lc3NhZ2VzLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlck1lc3NhZ2UobWVzc2FnZXM6IHN0cmluZyB8IHN0cmluZ1tdLCB0eXBlOiBzdHJpbmcgPSAnaW5mbycpIHtcclxuICB1aS50aGVtZS5yZW5kZXJNZXNzYWdlKG1lc3NhZ2VzLCB0eXBlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENsZWFyIG1lc3NhZ2VzLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyTWVzc2FnZXMoKSB7XHJcbiAgdWkudGhlbWUuY2xlYXJNZXNzYWdlcygpO1xyXG59XHJcblxyXG4vKipcclxuICogU2hvdyBub3RpZnkuXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gbm90aWZ5KG1lc3NhZ2VzOiBzdHJpbmcgfCBzdHJpbmdbXSwgdHlwZTogc3RyaW5nID0gJ2luZm8nKSB7XHJcbiAgdWkudGhlbWUucmVuZGVyTWVzc2FnZShtZXNzYWdlcywgdHlwZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDbGVhciBub3RpZmllcy5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBjbGVhck5vdGlmaWVzKCkge1xyXG4gIHVpLnRoZW1lLmNsZWFyTWVzc2FnZXMoKTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1hcmsoc2VsZWN0b3I/OiBzdHJpbmcgfCBIVE1MRWxlbWVudCwga2V5d29yZDogc3RyaW5nID0gJycsIG9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fSkge1xyXG4gIGNvbnN0IG1vZHVsZXMgPSBhd2FpdCB1c2VJbXBvcnQoJ0B2ZW5kb3IvbWFyay5qcy9kaXN0L21hcmsubWluLmpzJyk7XHJcblxyXG4gIGlmIChzZWxlY3RvciAhPSBudWxsKSB7XHJcbiAgICBjb25zdCBpbnN0YW5jZSA9IG5ldyBNYXJrKHNlbGVjdG9yKTtcclxuICAgIGluc3RhbmNlLm1hcmsoa2V5d29yZCwgb3B0aW9ucyk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbW9kdWxlcztcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNsaWRlVXAodGFyZ2V0OiBzdHJpbmcgfCBIVE1MRWxlbWVudCwgZHVyYXRpb246IG51bWJlciA9IDMwMCk6IFByb21pc2U8QW5pbWF0aW9uIHwgdm9pZD4ge1xyXG4gIGNvbnN0IGVsZSA9IHNlbGVjdE9uZSh0YXJnZXQpO1xyXG5cclxuICBpZiAoIWVsZSkge1xyXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gIH1cclxuXHJcbiAgZWxlLnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XHJcblxyXG4gIGNvbnN0IGFuaW1hdGlvbiA9IGFuaW1hdGVUbyhcclxuICAgIGVsZSxcclxuICAgIHsgaGVpZ2h0OiAwLCBwYWRkaW5nVG9wOiAwLCBwYWRkaW5nQm90dG9tOiAwIH0sXHJcbiAgICB7IGR1cmF0aW9uLCBlYXNpbmc6ICdlYXNlLW91dCcgfVxyXG4gICk7XHJcblxyXG4gIGRhdGEoZWxlLCAnYW5pbWF0aW9uLnNsaWRpbmcudXAnLCB0cnVlKTtcclxuXHJcbiAgY29uc3QgciA9IGF3YWl0IGFuaW1hdGlvbi5maW5pc2hlZDtcclxuXHJcbiAgaWYgKCFkYXRhKGVsZSwgJ2FuaW1hdGlvbi5zbGlkaW5nLmRvd24nKSkge1xyXG4gICAgZWxlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgfVxyXG5cclxuICByZW1vdmVEYXRhKGVsZSwgJ2FuaW1hdGlvbi5zbGlkaW5nLnVwJyk7XHJcblxyXG4gIHJldHVybiByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2xpZGVEb3duKFxyXG4gIHRhcmdldDogc3RyaW5nIHwgSFRNTEVsZW1lbnQsXHJcbiAgZHVyYXRpb246IG51bWJlciA9IDMwMCxcclxuICBkaXNwbGF5OiBzdHJpbmcgPSAnYmxvY2snKTogUHJvbWlzZTxBbmltYXRpb24gfCB2b2lkPiB7XHJcbiAgY29uc3QgZWxlID0gc2VsZWN0T25lKHRhcmdldCk7XHJcblxyXG4gIGlmICghZWxlKSB7XHJcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgfVxyXG5cclxuICBkYXRhKGVsZSwgJ2FuaW1hdGlvbi5zbGlkaW5nLmRvd24nLCB0cnVlKTtcclxuXHJcbiAgZWxlLnN0eWxlLmRpc3BsYXkgPSBkaXNwbGF5O1xyXG5cclxuLy8gR2V0IGhlaWdodFxyXG4gIGxldCBtYXhIZWlnaHQgPSAwO1xyXG4gIGZvciAoY29uc3QgY2hpbGQgb2YgQXJyYXkuZnJvbShlbGUuY2hpbGRyZW4pIGFzIEhUTUxFbGVtZW50W10pIHtcclxuICAgIG1heEhlaWdodCA9IE1hdGgubWF4KGNoaWxkLm9mZnNldEhlaWdodCwgbWF4SGVpZ2h0KTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGFuaW1hdGlvbiA9IGFuaW1hdGVUbyhcclxuICAgIGVsZSxcclxuICAgIHtcclxuICAgICAgaGVpZ2h0OiBbXHJcbiAgICAgICAgMCxcclxuICAgICAgICBtYXhIZWlnaHQgKyAncHgnXHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICB7IGR1cmF0aW9uLCBlYXNpbmc6ICdlYXNlLW91dCcgfVxyXG4gICk7XHJcblxyXG4gIGFuaW1hdGlvbi5hZGRFdmVudExpc3RlbmVyKCdmaW5pc2gnLCAoKSA9PiB7XHJcbiAgICBlbGUuc3R5bGUuaGVpZ2h0ID0gJyc7XHJcblxyXG4gICAgaWYgKCFkYXRhKGVsZSwgJ2FuaW1hdGlvbi5zbGlkaW5nLnVwJykpIHtcclxuICAgICAgZWxlLnN0eWxlLm92ZXJmbG93ID0gJ3Zpc2libGUnO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZURhdGEoZWxlLCAnYW5pbWF0aW9uLnNsaWRpbmcuZG93bicpO1xyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gYW5pbWF0aW9uLmZpbmlzaGVkO1xyXG59XHJcblxyXG4vKipcclxuICogc2xpZGVUb2dnbGVcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBzbGlkZVRvZ2dsZShcclxuICB0YXJnZXQ6IHN0cmluZyB8IEhUTUxFbGVtZW50LFxyXG4gIGR1cmF0aW9uOiBudW1iZXIgPSA1MDAsXHJcbiAgZGlzcGxheTogc3RyaW5nID0gJ2Jsb2NrJyk6IFByb21pc2U8QW5pbWF0aW9uIHwgdm9pZD4ge1xyXG4gIGNvbnN0IGVsZSA9IHNlbGVjdE9uZSh0YXJnZXQpO1xyXG5cclxuICBpZiAoIWVsZSkge1xyXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gIH1cclxuXHJcbiAgaWYgKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZSkuZGlzcGxheSA9PT0gJ25vbmUnKSB7XHJcbiAgICByZXR1cm4gc2xpZGVEb3duKGVsZSwgZHVyYXRpb24sIGRpc3BsYXkpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gc2xpZGVVcChlbGUsIGR1cmF0aW9uKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmYWRlT3V0KHNlbGVjdG9yOiBzdHJpbmcgfCBIVE1MRWxlbWVudCwgZHVyYXRpb246IG51bWJlciA9IDUwMCk6IFByb21pc2U8QW5pbWF0aW9uIHwgdm9pZD4ge1xyXG4gIGNvbnN0IGVsID0gc2VsZWN0T25lKHNlbGVjdG9yKTtcclxuXHJcbiAgaWYgKCFlbCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgYW5pbWF0aW9uID0gYW5pbWF0ZVRvKGVsLCB7IG9wYWNpdHk6IDAgfSwgeyBkdXJhdGlvbiwgZWFzaW5nOiAnZWFzZS1vdXQnIH0pO1xyXG5cclxuICBjb25zdCBwID0gYXdhaXQgYW5pbWF0aW9uLmZpbmlzaGVkO1xyXG4gIGVsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcblxyXG4gIHJldHVybiBwO1xyXG59O1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZhZGVJbihcclxuICBzZWxlY3Rvcjogc3RyaW5nIHwgSFRNTEVsZW1lbnQsXHJcbiAgZHVyYXRpb246IG51bWJlciA9IDUwMCxcclxuICBkaXNwbGF5OiBzdHJpbmcgPSAnYmxvY2snXHJcbik6IFByb21pc2U8QW5pbWF0aW9uIHwgdm9pZD4ge1xyXG4gIGNvbnN0IGVsID0gc2VsZWN0T25lKHNlbGVjdG9yKTtcclxuXHJcbiAgaWYgKCFlbCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgZWwuc3R5bGUuZGlzcGxheSA9ICcnO1xyXG5cclxuICBpZiAod2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpLmRpc3BsYXkgIT09IGRpc3BsYXkpIHtcclxuICAgIGVsLnN0eWxlLmRpc3BsYXkgPSBkaXNwbGF5O1xyXG4gIH1cclxuXHJcbiAgY29uc3QgYW5pbWF0aW9uID0gYW5pbWF0ZVRvKGVsLCB7IG9wYWNpdHk6IDEgfSwgeyBkdXJhdGlvbiwgZWFzaW5nOiAnZWFzZS1vdXQnIH0pO1xyXG5cclxuICByZXR1cm4gYW5pbWF0aW9uLmZpbmlzaGVkO1xyXG59O1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhpZ2hsaWdodChcclxuICBzZWxlY3Rvcjogc3RyaW5nIHwgSFRNTEVsZW1lbnQsXHJcbiAgY29sb3I6IHN0cmluZyA9ICcjZmZmZjk5JyxcclxuICBkdXJhdGlvbjogbnVtYmVyID0gNjAwXHJcbik6IFByb21pc2U8QW5pbWF0aW9uIHwgdm9pZD4ge1xyXG4gIGNvbnN0IGVsZSA9IHNlbGVjdE9uZShzZWxlY3Rvcik7XHJcblxyXG4gIGlmICghZWxlKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICBkdXJhdGlvbiAvPSAyO1xyXG4gIGNvbnN0IGJnID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlKS5iYWNrZ3JvdW5kQ29sb3I7XHJcblxyXG4gIGNvbnN0IGFuaW1hdGlvbiA9IGFuaW1hdGVUbyhlbGUsIHsgYmFja2dyb3VuZENvbG9yOiBjb2xvciB9LCB7IGR1cmF0aW9uIH0pO1xyXG5cclxuICBhd2FpdCBhbmltYXRpb24uZmluaXNoZWQ7XHJcblxyXG4gIHJldHVybiBhbmltYXRlVG8oZWxlLCB7IGJhY2tncm91bmRDb2xvcjogYmcgfSwgeyBkdXJhdGlvbiB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENvbG9yIFBpY2tlci5cclxuICovXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VDb2xvclBpY2tlcihcclxuICBzZWxlY3Rvcj86IE51bGxhYmxlPHN0cmluZyB8IEhUTUxFbGVtZW50IHwgTm9kZUxpc3RPZjxIVE1MRWxlbWVudD4+LFxyXG4gIG9wdGlvbnM6IFBhcnRpYWw8U3BlY3RydW1PcHRpb25zPiA9IHt9XHJcbik6IFByb21pc2U8YW55PiB7XHJcbiAgaWYgKG9wdGlvbnM/LnRoZW1lID09PSAnZGFyaycpIHtcclxuICAgIHVzZUNzc0ltcG9ydCgnQHNwZWN0cnVtL3NwZWN0cnVtLWRhcmsubWluLmNzcycpO1xyXG4gIH0gZWxzZSBpZiAoIW9wdGlvbnM/LnRoZW1lKSB7XHJcbiAgICB1c2VDc3NJbXBvcnQoJ0BzcGVjdHJ1bS9zcGVjdHJ1bS5taW4uY3NzJyk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBtID0gYXdhaXQgdXNlSW1wb3J0KCdAc3BlY3RydW0nKTtcclxuXHJcbi8vIExvY2FsZVxyXG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5sb2NhbGUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICBsZXQgbHM6IGFueSA9IG9wdGlvbnMubG9jYWxlLnNwbGl0KCctJykubWFwKChsKSA9PiBsLnRvTG93ZXJDYXNlKCkpO1xyXG5cclxuICAgIGlmIChsc1swXSA9PT0gbHNbMV0pIHtcclxuICAgICAgbHMgPSBbbHNdO1xyXG4gICAgfVxyXG5cclxuICAgIGxzID0gbHMuam9pbignLScpO1xyXG4gICAgdHJ5IHtcclxuICAgICAgYXdhaXQgdXNlSW1wb3J0KGBAc3BlY3RydW0vaTE4bi8ke2xzfS5qc2ApO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBjb25zb2xlLndhcm4oYFVuYWJsZSB0byBsb2FkIFNwZWN0cnVtIGxvY2FsZSBcIiR7bHN9XCIgKCR7b3B0aW9ucy5sb2NhbGV9KWApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaWYgKHNlbGVjdG9yKSB7XHJcbiAgICBtb2R1bGU8YW55LCBIVE1MRWxlbWVudD4oc2VsZWN0b3IsICdzcGVjdHJ1bScsIChlbGUpID0+IFNwZWN0cnVtLmdldEluc3RhbmNlKGVsZSwgb3B0aW9ucykpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VEaXNhYmxlT25TdWJtaXQoXHJcbiAgZm9ybVNlbGVjdG9yOiBzdHJpbmcgfCBIVE1MRm9ybUVsZW1lbnQgPSAnI2FkbWluLWZvcm0nLFxyXG4gIGJ1dHRvblNlbGVjdG9yOiBzdHJpbmcgPSAnJyxcclxuICBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge31cclxuKSB7XHJcbiAgLy8gVG9kbzogVXNlIG9iamVjdCB0byBoYW5kbGUgaXRcclxuICBidXR0b25TZWxlY3RvciA9IGJ1dHRvblNlbGVjdG9yIHx8IFtcclxuICAgICcjYWRtaW4tdG9vbGJhciBidXR0b24nLFxyXG4gICAgJyNhZG1pbi10b29sYmFyIGEnLFxyXG4gICAgZm9ybVNlbGVjdG9yICsgJyAuZGlzYWJsZS1vbi1zdWJtaXQnLFxyXG4gICAgZm9ybVNlbGVjdG9yICsgJyAuanMtZG9zJyxcclxuICAgIGZvcm1TZWxlY3RvciArICcgW2RhdGEtZG9zXScsXHJcbiAgXS5qb2luKCcsJyk7XHJcblxyXG4gIGNvbnN0IGljb25TZWxlY3RvciA9IG9wdGlvbnMuaWNvblNlbGVjdG9yIHx8IFtcclxuICAgICdbY2xhc3MqPVwiZmEtXCJdJyxcclxuICAgICdbZGF0YS1zcGluXScsXHJcbiAgICAnW2RhdGEtc3Bpbm5lcl0nLFxyXG4gIF0uam9pbignLCcpO1xyXG5cclxuICBjb25zdCBldmVudCA9IG9wdGlvbnMuZXZlbnQgfHwgJ3N1Ym1pdCc7XHJcbiAgY29uc3Qgc3Bpbm5lckNsYXNzID0gb3B0aW9ucy5zcGlubmVyQ2xhc3MgfHwgJ3NwaW5uZXItYm9yZGVyIHNwaW5uZXItYm9yZGVyLXNtJztcclxuXHJcbiAgc2VsZWN0QWxsPEhUTUxFbGVtZW50PihidXR0b25TZWxlY3RvciwgKGJ1dHRvbikgPT4ge1xyXG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgYnV0dG9uLmRhdGFzZXQuY2xpY2tlZCA9ICcxJztcclxuXHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGRlbGV0ZSBidXR0b24uZGF0YXNldC5jbGlja2VkO1xyXG4gICAgICB9LCAxNTAwKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBjb25zdCBmb3JtID0gc2VsZWN0T25lPEhUTUxGb3JtRWxlbWVudD4oZm9ybVNlbGVjdG9yKTtcclxuICBmb3JtPy5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCAoZTogU3VibWl0RXZlbnQpID0+IHtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBpZiAoIWZvcm0uY2hlY2tWYWxpZGl0eSgpKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzZWxlY3RBbGw8SFRNTEVsZW1lbnQ+KGJ1dHRvblNlbGVjdG9yLCAoYnV0dG9uKSA9PiB7XHJcbiAgICAgICAgYnV0dG9uLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnbm9uZSc7XHJcbiAgICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCAnZGlzYWJsZWQnKTtcclxuICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnZGlzYWJsZWQnKTtcclxuXHJcbiAgICAgICAgaWYgKGJ1dHRvbi5kYXRhc2V0LmNsaWNrZWQpIHtcclxuICAgICAgICAgIGxldCBpY29uID0gYnV0dG9uLnF1ZXJ5U2VsZWN0b3IoaWNvblNlbGVjdG9yKTtcclxuXHJcbiAgICAgICAgICBpZiAoaWNvbikge1xyXG4gICAgICAgICAgICBjb25zdCBpID0gaHRtbCgnPGk+PC9pPicpO1xyXG4gICAgICAgICAgICBpY29uLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKGksIGljb24pO1xyXG5cclxuICAgICAgICAgICAgaS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgc3Bpbm5lckNsYXNzKTtcclxuICAgICAgICAgICAgLy8gaWNvbi5zdHlsZXMud2lkdGggPSAnMWVtJztcclxuICAgICAgICAgICAgLy8gaWNvbi5zdHlsZXMuaGVpZ2h0ID0gJzFlbSc7XHJcbiAgICAgICAgICAgIC8vIGljb24uc3R5bGVzLmJvcmRlcldpdGggPSAnLjE1ZW0nO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9LCAwKTtcclxuICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZURpc2FibGVJZlN0YWNrTm90RW1wdHkoYnV0dG9uU2VsZWN0b3I6IHN0cmluZyA9ICdbZGF0YS10YXNrPXNhdmVdJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2tOYW1lOiBzdHJpbmcgPSAndXBsb2FkaW5nJykge1xyXG4gIGNvbnN0IHN0YWNrID0gdXNlU3RhY2soc3RhY2tOYW1lKTtcclxuXHJcbiAgc3RhY2sub2JzZXJ2ZSgoc3RhY2ssIGxlbmd0aCkgPT4ge1xyXG4gICAgZm9yIChjb25zdCBidXR0b24gb2Ygc2VsZWN0QWxsPEhUTUxFbGVtZW50PihidXR0b25TZWxlY3RvcikpIHtcclxuICAgICAgaWYgKGxlbmd0aCA+IDApIHtcclxuICAgICAgICBidXR0b24uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICdkaXNhYmxlZCcpO1xyXG4gICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlZCcpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGJ1dHRvbi5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XHJcbiAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc2FibGVkJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEtlZXAgYWxpdmUuXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gdXNlS2VlcEFsaXZlKHVybDogc3RyaW5nLCB0aW1lOiBudW1iZXIgPSA2MDAwMCk6ICgpID0+IHZvaWQge1xyXG4gIGNvbnN0IGFsaXZlSGFuZGxlID0gd2luZG93LnNldEludGVydmFsKCgpID0+IGZldGNoKHVybCksIHRpbWUpO1xyXG5cclxuICByZXR1cm4gKCkgPT4ge1xyXG4gICAgY2xlYXJJbnRlcnZhbChhbGl2ZUhhbmRsZSk7XHJcbiAgfTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFZ1ZSBjb21wb25lbnQgZmllbGQuXHJcbiAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlVnVlQ29tcG9uZW50RmllbGQoXHJcbiAgc2VsZWN0b3I/OiBOdWxsYWJsZTxzdHJpbmcgfCBIVE1MRWxlbWVudD4sXHJcbiAgdmFsdWU/OiBhbnksXHJcbiAgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9XHJcbik6IFByb21pc2U8YW55PiB7XHJcbiAgY29uc3QgbSA9IGF3YWl0IHVzZUltcG9ydCgnQHVuaWNvcm4vZmllbGQvdnVlLWNvbXBvbmVudC1maWVsZC5qcycpO1xyXG5cclxuICBpZiAoc2VsZWN0b3IpIHtcclxuICAgIG0uVnVlQ29tcG9uZW50RmllbGQuaW5pdChzZWxlY3RvciwgdmFsdWUsIG9wdGlvbnMpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG07XHJcbn1cclxuXHJcbmRlY2xhcmUgZ2xvYmFsIHtcclxuICB2YXIgQWxwaW5lOiBBbHBpbmVHbG9iYWw7XHJcbiAgdmFyIFRvbVNlbGVjdDogdHlwZW9mIFRvbVNlbGVjdEdsb2JhbDtcclxuICB2YXIgU3BlY3RydW06IHR5cGVvZiBTcGVjdHJ1bUdsb2JhbDtcclxuICB2YXIgTWFyazogYW55O1xyXG59XHJcbiIsImltcG9ydCB7IGRhdGEgfSBmcm9tICcuLi9kYXRhJztcclxuXHJcbnR5cGUgVXJpVHlwZXMgPSAnZnVsbCcgfCAncGF0aCcgfCAncm9vdCcgfCAnY3VycmVudCcgfCAncm91dGUnIHwgJ3NjcmlwdCc7XHJcbnR5cGUgQXNzZXRUeXBlcyA9ICdyb290JyB8ICdwYXRoJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VTeXN0ZW1VcmkoKTogVW5pY29yblN5c3RlbVVyaTtcclxuZXhwb3J0IGZ1bmN0aW9uIHVzZVN5c3RlbVVyaSh0eXBlOiBVcmlUeXBlcyk6IHN0cmluZztcclxuZXhwb3J0IGZ1bmN0aW9uIHVzZVN5c3RlbVVyaSh0eXBlPzogVXJpVHlwZXMsIHBhdGg/OiBzdHJpbmcpOiBVbmljb3JuU3lzdGVtVXJpIHwgc3RyaW5nIHtcclxuICBjb25zdCB1cmkgPSBVbmljb3JuU3lzdGVtVXJpLmdldCgpO1xyXG5cclxuICBpZiAodHlwZSkge1xyXG4gICAgcmV0dXJuIHVyaVt0eXBlXShwYXRoKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB1cmk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VBc3NldFVyaSgpOiBVbmljb3JuQXNzZXRVcmk7XHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VBc3NldFVyaSh0eXBlPzogQXNzZXRUeXBlcywgcGF0aD86IHN0cmluZyk6IHN0cmluZztcclxuZXhwb3J0IGZ1bmN0aW9uIHVzZUFzc2V0VXJpKHR5cGU/OiBBc3NldFR5cGVzLCBwYXRoPzogc3RyaW5nKTogVW5pY29ybkFzc2V0VXJpIHwgc3RyaW5nIHtcclxuICBjb25zdCBhc3NldCA9IFVuaWNvcm5Bc3NldFVyaS5nZXQoKTtcclxuXHJcbiAgaWYgKHR5cGUpIHtcclxuICAgIHJldHVybiBhc3NldFt0eXBlXShwYXRoKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBhc3NldDtcclxufVxyXG5cclxuZnVuY3Rpb24gdXJpKHR5cGU6IHN0cmluZykge1xyXG4gIHJldHVybiBkYXRhKCd1bmljb3JuLnVyaScpW3R5cGVdO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhc3NldCh0eXBlOiBzdHJpbmcpIHtcclxuICByZXR1cm4gdXJpKCdhc3NldCcpW3R5cGVdO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYWRkVXJpQmFzZSh1cmk6IHN0cmluZywgdHlwZSA9ICdwYXRoJykge1xyXG4gIGlmICh1cmkuc3Vic3RyaW5nKDAsIDIpID09PSAnL1xcLycgfHwgdXJpLnN1YnN0cmluZygwLCA0KSA9PT0gJ2h0dHAnKSB7XHJcbiAgICByZXR1cm4gdXJpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGFzc2V0KHR5cGUpICsgJy8nICsgdXJpO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVW5pY29yblN5c3RlbVVyaSBleHRlbmRzIFVSTCB7XHJcbiAgc3RhdGljIGluc3RhbmNlOiBVbmljb3JuU3lzdGVtVXJpO1xyXG5cclxuICBzdGF0aWMgZ2V0KCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaW5zdGFuY2UgPz89IG5ldyB0aGlzKHVyaSgnZnVsbCcpKTtcclxuICB9XHJcblxyXG4gIHBhdGgocGF0aDogc3RyaW5nID0gJycpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHVyaSgncGF0aCcpICsgcGF0aDtcclxuICB9XHJcblxyXG4gIHJvb3QocGF0aDogc3RyaW5nID0gJycpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHVyaSgncm9vdCcpICsgcGF0aDtcclxuICB9XHJcblxyXG4gIGN1cnJlbnQoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB1cmkoJ2N1cnJlbnQnKSB8fCAnJztcclxuICB9XHJcblxyXG4gIGZ1bGwoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB1cmkoJ2Z1bGwnKSB8fCAnJztcclxuICB9XHJcblxyXG4gIHJvdXRlKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdXJpKCdyb3V0ZScpIHx8ICcnO1xyXG4gIH1cclxuXHJcbiAgc2NyaXB0KCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdXJpKCdzY3JpcHQnKSB8fCAnJztcclxuICB9XHJcblxyXG4gIHJvdXRlV2l0aFF1ZXJ5KCkge1xyXG4gICAgY29uc3Qgcm91dGUgPSB0aGlzLnJvdXRlKCk7XHJcbiAgICBjb25zdCBxdWVyeSA9IHRoaXMuc2VhcmNoUGFyYW1zLnRvU3RyaW5nKCk7XHJcblxyXG4gICAgcmV0dXJuIHF1ZXJ5ID8gYCR7cm91dGV9PyR7cXVlcnl9YCA6IHJvdXRlO1xyXG4gIH1cclxuXHJcbiAgcm91dGVBbmRRdWVyeSgpIHtcclxuICAgIGNvbnN0IHJvdXRlID0gdGhpcy5yb3V0ZSgpO1xyXG4gICAgY29uc3QgcXVlcnkgPSB0aGlzLnNlYXJjaFBhcmFtcy50b1N0cmluZygpO1xyXG5cclxuICAgIHJldHVybiBbcm91dGUsIHF1ZXJ5XTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBVbmljb3JuQXNzZXRVcmkge1xyXG4gIHN0YXRpYyBpbnN0YW5jZTogVW5pY29ybkFzc2V0VXJpO1xyXG5cclxuICBzdGF0aWMgZ2V0KCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaW5zdGFuY2UgPz89IG5ldyB0aGlzKCk7XHJcbiAgfVxyXG5cclxuICBwYXRoKHBhdGg6IHN0cmluZyA9ICcnKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBhc3NldCgncGF0aCcpICsgcGF0aDtcclxuICB9XHJcblxyXG4gIHJvb3QocGF0aDogc3RyaW5nID0gJycpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIGFzc2V0KCdyb290JykgKyBwYXRoO1xyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgZnVuY3Rpb24gZW5jb2RlKG9iaiwgcGZ4KSB7XG5cdHZhciBrLCBpLCB0bXAsIHN0cj0nJztcblxuXHRmb3IgKGsgaW4gb2JqKSB7XG5cdFx0aWYgKCh0bXAgPSBvYmpba10pICE9PSB2b2lkIDApIHtcblx0XHRcdGlmIChBcnJheS5pc0FycmF5KHRtcCkpIHtcblx0XHRcdFx0Zm9yIChpPTA7IGkgPCB0bXAubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRzdHIgJiYgKHN0ciArPSAnJicpO1xuXHRcdFx0XHRcdHN0ciArPSBlbmNvZGVVUklDb21wb25lbnQoaykgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodG1wW2ldKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c3RyICYmIChzdHIgKz0gJyYnKTtcblx0XHRcdFx0c3RyICs9IGVuY29kZVVSSUNvbXBvbmVudChrKSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh0bXApO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiAocGZ4IHx8ICcnKSArIHN0cjtcbn1cblxuZnVuY3Rpb24gdG9WYWx1ZShtaXgpIHtcblx0aWYgKCFtaXgpIHJldHVybiAnJztcblx0dmFyIHN0ciA9IGRlY29kZVVSSUNvbXBvbmVudChtaXgpO1xuXHRpZiAoc3RyID09PSAnZmFsc2UnKSByZXR1cm4gZmFsc2U7XG5cdGlmIChzdHIgPT09ICd0cnVlJykgcmV0dXJuIHRydWU7XG5cdHJldHVybiAoK3N0ciAqIDAgPT09IDApID8gKCtzdHIpIDogc3RyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVjb2RlKHN0cikge1xuXHR2YXIgdG1wLCBrLCBvdXQ9e30sIGFycj1zdHIuc3BsaXQoJyYnKTtcblxuXHR3aGlsZSAodG1wID0gYXJyLnNoaWZ0KCkpIHtcblx0XHR0bXAgPSB0bXAuc3BsaXQoJz0nKTtcblx0XHRrID0gdG1wLnNoaWZ0KCk7XG5cdFx0aWYgKG91dFtrXSAhPT0gdm9pZCAwKSB7XG5cdFx0XHRvdXRba10gPSBbXS5jb25jYXQob3V0W2tdLCB0b1ZhbHVlKHRtcC5zaGlmdCgpKSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG91dFtrXSA9IHRvVmFsdWUodG1wLnNoaWZ0KCkpO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBvdXQ7XG59XG4iLCJcclxuaW1wb3J0IHsgZGF0YSB9IGZyb20gJy4uL2RhdGEnO1xyXG5pbXBvcnQgeyBkZWNvZGUsIGVuY29kZSB9IGZyb20gJ3Fzcyc7XHJcblxyXG4vKipcclxuICogQWRkIGEgcm91dGUuXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gYWRkUm91dGUocm91dGU6IHN0cmluZywgdXJsOiBzdHJpbmcpIHtcclxuICBjb25zdCByb3V0ZXMgPSBkYXRhKCd1bmljb3JuLnJvdXRlcycpIHx8IHt9O1xyXG4gIHJvdXRlc1tyb3V0ZV0gPSB1cmw7XHJcblxyXG4gIGRhdGEoJ3VuaWNvcm4ucm91dGVzJywgcm91dGVzKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCByb3V0ZS5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiByb3V0ZShyb3V0ZTogc3RyaW5nLCBxdWVyeT86IFJlY29yZDxzdHJpbmcsIGFueT4pOiBzdHJpbmcge1xyXG4gIGNvbnN0IHNvdXJjZSA9IHJvdXRlO1xyXG4gIGNvbnN0IGV4dHJhY3QgPSBleHRyYWN0Um91dGUoc291cmNlKTtcclxuICByb3V0ZSA9IGV4dHJhY3Qucm91dGU7XHJcbiAgbGV0IHBhdGggPSBleHRyYWN0LnBhdGg7XHJcbiAgY29uc3Qgcm91dGVzID0gZGF0YSgndW5pY29ybi5yb3V0ZXMnKSB8fCB7fTtcclxuXHJcbiAgbGV0IHVybCA9IHJvdXRlc1tyb3V0ZV07XHJcblxyXG4gIGlmICh1cmwgPT0gbnVsbCkge1xyXG4gICAgaWYgKCFyb3V0ZS5zdGFydHNXaXRoKCdAJykpIHtcclxuICAgICAgcm91dGUgPSAnQCcgKyByb3V0ZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJvdXRlID0gcm91dGUuc3Vic3RyaW5nKDEpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdXJsID0gcm91dGVzW3JvdXRlXTtcclxuXHJcbiAgaWYgKHVybCA9PSBudWxsKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFJvdXRlOiBcIiR7c291cmNlfVwiIG5vdCBmb3VuZGApO1xyXG4gIH1cclxuXHJcbiAgLy8gTWVyZ2UgcXVlcnlcclxuICBpZiAocGF0aCkge1xyXG4gICAgY29uc3QgeyByb3V0ZTogdTEsIHBhdGg6IHUxcSB9ID0gZXh0cmFjdFJvdXRlKHVybCwgJz8nKTtcclxuICAgIGNvbnN0IHsgcm91dGU6IHUyLCBwYXRoOiB1MnEgfSA9IGV4dHJhY3RSb3V0ZShwYXRoLCAnPycpO1xyXG5cclxuICAgIHVybCA9IHUxICsgJy8nICsgdTI7XHJcblxyXG4gICAgaWYgKHUxcSB8fCB1MnEpIHtcclxuICAgICAgY29uc3QgcSA9IFsgdTFxLCB1MnEgXS5maWx0ZXIodSA9PiB1KS5qb2luKCcmJyk7XHJcbiAgICAgIHVybCArPSAnPycgKyBxO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGFkZFF1ZXJ5KHVybCwgcXVlcnkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBleHRyYWN0Um91dGUocm91dGU6IHN0cmluZywgc2VwOiBzdHJpbmcgPSAnLycpOiB7IHBhdGg6IHN0cmluZzsgcm91dGU6IHN0cmluZyB9IHtcclxuICBpZiAocm91dGUuaW5kZXhPZihzZXApID09PSAtMSkge1xyXG4gICAgcmV0dXJuIHsgcm91dGUsIHBhdGg6ICcnIH1cclxuICB9XHJcblxyXG4gIGNvbnN0IHNlZ21lbnRzID0gcm91dGUuc3BsaXQoc2VwKTtcclxuXHJcbiAgcm91dGUgPSBzZWdtZW50cy5zaGlmdCgpIHx8ICcnO1xyXG4gIGNvbnN0IHBhdGggPSBzZWdtZW50cy5qb2luKHNlcCk7XHJcblxyXG4gIHJldHVybiB7IHJvdXRlLCBwYXRoIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBoYXNSb3V0ZShyb3V0ZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgcmV0dXJuIHVuZGVmaW5lZCAhPT0gZGF0YSgndW5pY29ybi5yb3V0ZXMnKVtyb3V0ZV07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhZGRRdWVyeSh1cmw6IHN0cmluZywgcXVlcnk/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+KTogc3RyaW5nIHtcclxuICBpZiAocXVlcnkgPT0gbnVsbCkge1xyXG4gICAgcmV0dXJuIHVybDtcclxuICB9XHJcblxyXG4gIGZvciAobGV0IGsgaW4gcXVlcnkpIHtcclxuICAgIGNvbnN0IHYgPSBxdWVyeVtrXTtcclxuXHJcbiAgICBjb25zdCBwbGFjZWhvbGRlciA9IGB7JHtrfX1gO1xyXG5cclxuICAgIGlmICh1cmwuaW5kZXhPZihwbGFjZWhvbGRlcikgIT09IC0xKSB7XHJcbiAgICAgIHVybCA9IHVybC5yZXBsYWNlKFxyXG4gICAgICAgIG5ldyBSZWdFeHAoYCR7cGxhY2Vob2xkZXJ9YCwgJ2cnKSxcclxuICAgICAgICB2XHJcbiAgICAgICk7XHJcbiAgICAgIGRlbGV0ZSBxdWVyeVtrXTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBlbmNvZGVkUGxhY2Vob2xkZXIgPSBlbmNvZGVVUklDb21wb25lbnQoYHske2t9fWApO1xyXG5cclxuICAgIGlmICh1cmwuaW5kZXhPZihlbmNvZGVkUGxhY2Vob2xkZXIpICE9PSAtMSkge1xyXG4gICAgICB1cmwgPSB1cmwucmVwbGFjZShcclxuICAgICAgICBuZXcgUmVnRXhwKGAke2VuY29kZWRQbGFjZWhvbGRlcn1gLCAnZycpLFxyXG4gICAgICAgIHZcclxuICAgICAgKTtcclxuICAgICAgZGVsZXRlIHF1ZXJ5W2tdO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaWYgKE9iamVjdC5rZXlzKHF1ZXJ5KS5sZW5ndGggPT09IDApIHtcclxuICAgIHJldHVybiB1cmw7XHJcbiAgfVxyXG5cclxuICBjb25zdCBxdWVyeVN0cmluZyA9IGVuY29kZShxdWVyeSk7XHJcblxyXG4gIHJldHVybiB1cmwgKyAoL1xcPy8udGVzdCh1cmwpID8gYCYke3F1ZXJ5U3RyaW5nfWAgOiBgPyR7cXVlcnlTdHJpbmd9YCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVF1ZXJ5PFQgPSBSZWNvcmQ8c3RyaW5nLCBhbnk+PihxdWVyeVN0cmluZzogc3RyaW5nKTogVCB7XHJcbiAgcmV0dXJuIGRlY29kZShxdWVyeVN0cmluZykgYXMgVDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkUXVlcnkocXVlcnk6IFJlY29yZDxzdHJpbmcsIGFueT4pOiBzdHJpbmcge1xyXG4gIHJldHVybiBlbmNvZGUocXVlcnkpO1xyXG59XHJcbiIsImltcG9ydCB7IHNlbGVjdEFsbCB9IGZyb20gJy4uL3NlcnZpY2UnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUNsb2FrKCkge1xyXG4gIGlmIChnbG9iYWxUaGlzLmRvY3VtZW50ID09IG51bGwpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIHNlbGVjdEFsbCgnW3VuaS1jbG9ha10nLCAoZWwpID0+IGVsLnJlbW92ZUF0dHJpYnV0ZSgndW5pLWNsb2FrJykpO1xyXG59XHJcbiIsImltcG9ydCB7IGdldERhdGEsIHNldERhdGEsIHJlbW92ZURhdGEgYXMgcm1kYXRhIH0gZnJvbSAnLi91dGlsaXRpZXMnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRhdGEobmFtZTogc3RyaW5nLCBkYXRhOiBhbnkpOiBhbnk7XHJcbmV4cG9ydCBmdW5jdGlvbiBkYXRhKG5hbWU6IHN0cmluZyk6IGFueTtcclxuZXhwb3J0IGZ1bmN0aW9uIGRhdGEoZWxlOiBFbGVtZW50LCBuYW1lOiBzdHJpbmcpOiBhbnk7XHJcbmV4cG9ydCBmdW5jdGlvbiBkYXRhKGVsZTogRWxlbWVudCwgbmFtZTogc3RyaW5nLCBkYXRhPzogYW55KTogYW55O1xyXG5leHBvcnQgZnVuY3Rpb24gZGF0YShlbGU6IEVsZW1lbnQgfCBzdHJpbmcsIG5hbWU6IGFueSA9IHVuZGVmaW5lZCwgdmFsdWU6IGFueSA9IHVuZGVmaW5lZCkge1xyXG4gIGlmICghKGVsZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSkge1xyXG4gICAgdmFsdWUgPSBuYW1lO1xyXG4gICAgbmFtZSA9IGVsZTtcclxuICAgIGVsZSA9IGRvY3VtZW50IGFzIGFueSBhcyBFbGVtZW50O1xyXG4gIH1cclxuXHJcbiAgaWYgKG5hbWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgcmV0dXJuIGdldERhdGEoZWxlKTtcclxuICB9XHJcblxyXG4gIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICBjb25zdCByZXMgPSBnZXREYXRhKGVsZSwgbmFtZSk7XHJcblxyXG4gICAgcmV0dXJuIHJlcztcclxuICB9XHJcblxyXG4gIHNldERhdGEoZWxlLCBuYW1lLCB2YWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVEYXRhKG5hbWU6IHN0cmluZyk6IGFueTtcclxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZURhdGEoZWxlOiBFbGVtZW50LCBuYW1lOiBzdHJpbmcpOiBhbnk7XHJcbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVEYXRhKGVsZTogRWxlbWVudHxzdHJpbmcsIG5hbWU6IGFueSA9IHVuZGVmaW5lZCkge1xyXG4gIGlmICghKGVsZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSkge1xyXG4gICAgbmFtZSA9IGVsZTtcclxuICAgIGVsZSA9IGRvY3VtZW50IGFzIGFueSBhcyBFbGVtZW50O1xyXG4gIH1cclxuXHJcbiAgcm1kYXRhKGVsZSwgbmFtZSk7XHJcbn1cclxuIiwiLyoqXG4gKiBVdGlsaXR5IGZ1bmN0aW9uIHRoYXQgd29ya3MgbGlrZSBgT2JqZWN0LmFwcGx5YCwgYnV0IGNvcGllcyBnZXR0ZXJzIGFuZCBzZXR0ZXJzIHByb3Blcmx5IGFzIHdlbGwuICBBZGRpdGlvbmFsbHkgZ2l2ZXNcbiAqIHRoZSBvcHRpb24gdG8gZXhjbHVkZSBwcm9wZXJ0aWVzIGJ5IG5hbWUuXG4gKi9cbmNvbnN0IGNvcHlQcm9wcyA9IChkZXN0LCBzcmMsIGV4Y2x1ZGUgPSBbXSkgPT4ge1xuICAgIGNvbnN0IHByb3BzID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoc3JjKTtcbiAgICBmb3IgKGxldCBwcm9wIG9mIGV4Y2x1ZGUpXG4gICAgICAgIGRlbGV0ZSBwcm9wc1twcm9wXTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhkZXN0LCBwcm9wcyk7XG59O1xuLyoqXG4gKiBSZXR1cm5zIHRoZSBmdWxsIGNoYWluIG9mIHByb3RvdHlwZXMgdXAgdW50aWwgT2JqZWN0LnByb3RvdHlwZSBnaXZlbiBhIHN0YXJ0aW5nIG9iamVjdC4gIFRoZSBvcmRlciBvZiBwcm90b3R5cGVzIHdpbGxcbiAqIGJlIGNsb3Nlc3QgdG8gZmFydGhlc3QgaW4gdGhlIGNoYWluLlxuICovXG5jb25zdCBwcm90b0NoYWluID0gKG9iaiwgY3VycmVudENoYWluID0gW29ial0pID0+IHtcbiAgICBjb25zdCBwcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopO1xuICAgIGlmIChwcm90byA9PT0gbnVsbClcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRDaGFpbjtcbiAgICByZXR1cm4gcHJvdG9DaGFpbihwcm90bywgWy4uLmN1cnJlbnRDaGFpbiwgcHJvdG9dKTtcbn07XG4vKipcbiAqIElkZW50aWZpZXMgdGhlIG5lYXJlc3QgYW5jZXN0b3IgY29tbW9uIHRvIGFsbCB0aGUgZ2l2ZW4gb2JqZWN0cyBpbiB0aGVpciBwcm90b3R5cGUgY2hhaW5zLiAgRm9yIG1vc3QgdW5yZWxhdGVkXG4gKiBvYmplY3RzLCB0aGlzIGZ1bmN0aW9uIHNob3VsZCByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5cbiAqL1xuY29uc3QgbmVhcmVzdENvbW1vblByb3RvID0gKC4uLm9ianMpID0+IHtcbiAgICBpZiAob2Jqcy5sZW5ndGggPT09IDApXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgbGV0IGNvbW1vblByb3RvID0gdW5kZWZpbmVkO1xuICAgIGNvbnN0IHByb3RvQ2hhaW5zID0gb2Jqcy5tYXAob2JqID0+IHByb3RvQ2hhaW4ob2JqKSk7XG4gICAgd2hpbGUgKHByb3RvQ2hhaW5zLmV2ZXJ5KHByb3RvQ2hhaW4gPT4gcHJvdG9DaGFpbi5sZW5ndGggPiAwKSkge1xuICAgICAgICBjb25zdCBwcm90b3MgPSBwcm90b0NoYWlucy5tYXAocHJvdG9DaGFpbiA9PiBwcm90b0NoYWluLnBvcCgpKTtcbiAgICAgICAgY29uc3QgcG90ZW50aWFsQ29tbW9uUHJvdG8gPSBwcm90b3NbMF07XG4gICAgICAgIGlmIChwcm90b3MuZXZlcnkocHJvdG8gPT4gcHJvdG8gPT09IHBvdGVudGlhbENvbW1vblByb3RvKSlcbiAgICAgICAgICAgIGNvbW1vblByb3RvID0gcG90ZW50aWFsQ29tbW9uUHJvdG87XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gY29tbW9uUHJvdG87XG59O1xuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IHByb3RvdHlwZSBvYmplY3QgdGhhdCBpcyBhIG1peHR1cmUgb2YgdGhlIGdpdmVuIHByb3RvdHlwZXMuICBUaGUgbWl4aW5nIGlzIGFjaGlldmVkIGJ5IGZpcnN0XG4gKiBpZGVudGlmeWluZyB0aGUgbmVhcmVzdCBjb21tb24gYW5jZXN0b3IgYW5kIHVzaW5nIGl0IGFzIHRoZSBwcm90b3R5cGUgZm9yIGEgbmV3IG9iamVjdC4gIFRoZW4gYWxsIHByb3BlcnRpZXMvbWV0aG9kc1xuICogZG93bnN0cmVhbSBvZiB0aGlzIHByb3RvdHlwZSAoT05MWSBkb3duc3RyZWFtKSBhcmUgY29waWVkIGludG8gdGhlIG5ldyBvYmplY3QuXG4gKlxuICogVGhlIHJlc3VsdGluZyBwcm90b3R5cGUgaXMgbW9yZSBwZXJmb3JtYW50IHRoYW4gc29mdE1peFByb3RvcyguLi4pLCBhcyB3ZWxsIGFzIEVTNSBjb21wYXRpYmxlLiAgSG93ZXZlciwgaXQncyBub3QgYXNcbiAqIGZsZXhpYmxlIGFzIHVwZGF0ZXMgdG8gdGhlIHNvdXJjZSBwcm90b3R5cGVzIGFyZW4ndCBjYXB0dXJlZCBieSB0aGUgbWl4ZWQgcmVzdWx0LiAgU2VlIHNvZnRNaXhQcm90b3MgZm9yIHdoeSB5b3UgbWF5XG4gKiB3YW50IHRvIHVzZSB0aGF0IGluc3RlYWQuXG4gKi9cbmNvbnN0IGhhcmRNaXhQcm90b3MgPSAoaW5ncmVkaWVudHMsIGNvbnN0cnVjdG9yLCBleGNsdWRlID0gW10pID0+IHtcbiAgICB2YXIgX2E7XG4gICAgY29uc3QgYmFzZSA9IChfYSA9IG5lYXJlc3RDb21tb25Qcm90byguLi5pbmdyZWRpZW50cykpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IE9iamVjdC5wcm90b3R5cGU7XG4gICAgY29uc3QgbWl4ZWRQcm90byA9IE9iamVjdC5jcmVhdGUoYmFzZSk7XG4gICAgLy8gS2VlcHMgdHJhY2sgb2YgcHJvdG90eXBlcyB3ZSd2ZSBhbHJlYWR5IHZpc2l0ZWQgdG8gYXZvaWQgY29weWluZyB0aGUgc2FtZSBwcm9wZXJ0aWVzIG11bHRpcGxlIHRpbWVzLiAgV2UgaW5pdCB0aGVcbiAgICAvLyBsaXN0IHdpdGggdGhlIHByb3RvIGNoYWluIGJlbG93IHRoZSBuZWFyZXN0IGNvbW1vbiBhbmNlc3RvciBiZWNhdXNlIHdlIGRvbid0IHdhbnQgYW55IG9mIHRob3NlIG1ldGhvZHMgbWl4ZWQgaW5cbiAgICAvLyB3aGVuIHRoZXkgd2lsbCBhbHJlYWR5IGJlIGFjY2Vzc2libGUgdmlhIHByb3RvdHlwZSBhY2Nlc3MuXG4gICAgY29uc3QgdmlzaXRlZFByb3RvcyA9IHByb3RvQ2hhaW4oYmFzZSk7XG4gICAgZm9yIChsZXQgcHJvdG90eXBlIG9mIGluZ3JlZGllbnRzKSB7XG4gICAgICAgIGxldCBwcm90b3MgPSBwcm90b0NoYWluKHByb3RvdHlwZSk7XG4gICAgICAgIC8vIEFwcGx5IHRoZSBwcm90b3R5cGUgY2hhaW4gaW4gcmV2ZXJzZSBvcmRlciBzbyB0aGF0IG9sZCBtZXRob2RzIGRvbid0IG92ZXJyaWRlIG5ld2VyIG9uZXMuXG4gICAgICAgIGZvciAobGV0IGkgPSBwcm90b3MubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGxldCBuZXdQcm90byA9IHByb3Rvc1tpXTtcbiAgICAgICAgICAgIGlmICh2aXNpdGVkUHJvdG9zLmluZGV4T2YobmV3UHJvdG8pID09PSAtMSkge1xuICAgICAgICAgICAgICAgIGNvcHlQcm9wcyhtaXhlZFByb3RvLCBuZXdQcm90bywgWydjb25zdHJ1Y3RvcicsIC4uLmV4Y2x1ZGVdKTtcbiAgICAgICAgICAgICAgICB2aXNpdGVkUHJvdG9zLnB1c2gobmV3UHJvdG8pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIG1peGVkUHJvdG8uY29uc3RydWN0b3IgPSBjb25zdHJ1Y3RvcjtcbiAgICByZXR1cm4gbWl4ZWRQcm90bztcbn07XG5jb25zdCB1bmlxdWUgPSAoYXJyKSA9PiBhcnIuZmlsdGVyKChlLCBpKSA9PiBhcnIuaW5kZXhPZihlKSA9PSBpKTtcblxuLyoqXG4gKiBGaW5kcyB0aGUgaW5ncmVkaWVudCB3aXRoIHRoZSBnaXZlbiBwcm9wLCBzZWFyY2hpbmcgaW4gcmV2ZXJzZSBvcmRlciBhbmQgYnJlYWR0aC1maXJzdCBpZiBzZWFyY2hpbmcgaW5ncmVkaWVudFxuICogcHJvdG90eXBlcyBpcyByZXF1aXJlZC5cbiAqL1xuY29uc3QgZ2V0SW5ncmVkaWVudFdpdGhQcm9wID0gKHByb3AsIGluZ3JlZGllbnRzKSA9PiB7XG4gICAgY29uc3QgcHJvdG9DaGFpbnMgPSBpbmdyZWRpZW50cy5tYXAoaW5ncmVkaWVudCA9PiBwcm90b0NoYWluKGluZ3JlZGllbnQpKTtcbiAgICAvLyBzaW5jZSB3ZSBzZWFyY2ggYnJlYWR0aC1maXJzdCwgd2UgbmVlZCB0byBrZWVwIHRyYWNrIG9mIG91ciBkZXB0aCBpbiB0aGUgcHJvdG90eXBlIGNoYWluc1xuICAgIGxldCBwcm90b0RlcHRoID0gMDtcbiAgICAvLyBub3QgYWxsIHByb3RvdHlwZSBjaGFpbnMgYXJlIHRoZSBzYW1lIGRlcHRoLCBzbyB0aGlzIHJlbWFpbnMgdHJ1ZSBhcyBsb25nIGFzIGF0IGxlYXN0IG9uZSBvZiB0aGUgaW5ncmVkaWVudHMnXG4gICAgLy8gcHJvdG90eXBlIGNoYWlucyBoYXMgYW4gb2JqZWN0IGF0IHRoaXMgZGVwdGhcbiAgICBsZXQgcHJvdG9zQXJlTGVmdFRvU2VhcmNoID0gdHJ1ZTtcbiAgICB3aGlsZSAocHJvdG9zQXJlTGVmdFRvU2VhcmNoKSB7XG4gICAgICAgIC8vIHdpdGggdGhlIHN0YXJ0IG9mIGVhY2ggaG9yaXpvbnRhbCBzbGljZSwgd2UgYXNzdW1lIHRoaXMgaXMgdGhlIG9uZSB0aGF0J3MgZGVlcGVyIHRoYW4gYW55IG9mIHRoZSBwcm90byBjaGFpbnNcbiAgICAgICAgcHJvdG9zQXJlTGVmdFRvU2VhcmNoID0gZmFsc2U7XG4gICAgICAgIC8vIHNjYW4gdGhyb3VnaCB0aGUgaW5ncmVkaWVudHMgcmlnaHQgdG8gbGVmdFxuICAgICAgICBmb3IgKGxldCBpID0gaW5ncmVkaWVudHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGNvbnN0IHNlYXJjaFRhcmdldCA9IHByb3RvQ2hhaW5zW2ldW3Byb3RvRGVwdGhdO1xuICAgICAgICAgICAgaWYgKHNlYXJjaFRhcmdldCAhPT0gdW5kZWZpbmVkICYmIHNlYXJjaFRhcmdldCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIC8vIGlmIHdlIGZpbmQgc29tZXRoaW5nLCB0aGlzIGlzIHByb29mIHRoYXQgdGhpcyBob3Jpem9udGFsIHNsaWNlIHBvdGVudGlhbGx5IG1vcmUgb2JqZWN0cyB0byBzZWFyY2hcbiAgICAgICAgICAgICAgICBwcm90b3NBcmVMZWZ0VG9TZWFyY2ggPSB0cnVlO1xuICAgICAgICAgICAgICAgIC8vIGV1cmVrYSwgd2UgZm91bmQgaXRcbiAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzZWFyY2hUYXJnZXQsIHByb3ApICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvdG9DaGFpbnNbaV1bMF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHByb3RvRGVwdGgrKztcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbn07XG4vKipcbiAqIFwiTWl4ZXNcIiBpbmdyZWRpZW50cyBieSB3cmFwcGluZyB0aGVtIGluIGEgUHJveHkuICBUaGUgb3B0aW9uYWwgcHJvdG90eXBlIGFyZ3VtZW50IGFsbG93cyB0aGUgbWl4ZWQgb2JqZWN0IHRvIHNpdFxuICogZG93bnN0cmVhbSBvZiBhbiBleGlzdGluZyBwcm90b3R5cGUgY2hhaW4uICBOb3RlIHRoYXQgXCJwcm9wZXJ0aWVzXCIgY2Fubm90IGJlIGFkZGVkLCBkZWxldGVkLCBvciBtb2RpZmllZC5cbiAqL1xuY29uc3QgcHJveHlNaXggPSAoaW5ncmVkaWVudHMsIHByb3RvdHlwZSA9IE9iamVjdC5wcm90b3R5cGUpID0+IG5ldyBQcm94eSh7fSwge1xuICAgIGdldFByb3RvdHlwZU9mKCkge1xuICAgICAgICByZXR1cm4gcHJvdG90eXBlO1xuICAgIH0sXG4gICAgc2V0UHJvdG90eXBlT2YoKSB7XG4gICAgICAgIHRocm93IEVycm9yKCdDYW5ub3Qgc2V0IHByb3RvdHlwZSBvZiBQcm94aWVzIGNyZWF0ZWQgYnkgdHMtbWl4ZXInKTtcbiAgICB9LFxuICAgIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihfLCBwcm9wKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGdldEluZ3JlZGllbnRXaXRoUHJvcChwcm9wLCBpbmdyZWRpZW50cykgfHwge30sIHByb3ApO1xuICAgIH0sXG4gICAgZGVmaW5lUHJvcGVydHkoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGRlZmluZSBuZXcgcHJvcGVydGllcyBvbiBQcm94aWVzIGNyZWF0ZWQgYnkgdHMtbWl4ZXInKTtcbiAgICB9LFxuICAgIGhhcyhfLCBwcm9wKSB7XG4gICAgICAgIHJldHVybiBnZXRJbmdyZWRpZW50V2l0aFByb3AocHJvcCwgaW5ncmVkaWVudHMpICE9PSB1bmRlZmluZWQgfHwgcHJvdG90eXBlW3Byb3BdICE9PSB1bmRlZmluZWQ7XG4gICAgfSxcbiAgICBnZXQoXywgcHJvcCkge1xuICAgICAgICByZXR1cm4gKGdldEluZ3JlZGllbnRXaXRoUHJvcChwcm9wLCBpbmdyZWRpZW50cykgfHwgcHJvdG90eXBlKVtwcm9wXTtcbiAgICB9LFxuICAgIHNldChfLCBwcm9wLCB2YWwpIHtcbiAgICAgICAgY29uc3QgaW5ncmVkaWVudFdpdGhQcm9wID0gZ2V0SW5ncmVkaWVudFdpdGhQcm9wKHByb3AsIGluZ3JlZGllbnRzKTtcbiAgICAgICAgaWYgKGluZ3JlZGllbnRXaXRoUHJvcCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3Qgc2V0IG5ldyBwcm9wZXJ0aWVzIG9uIFByb3hpZXMgY3JlYXRlZCBieSB0cy1taXhlcicpO1xuICAgICAgICBpbmdyZWRpZW50V2l0aFByb3BbcHJvcF0gPSB2YWw7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgZGVsZXRlUHJvcGVydHkoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGRlbGV0ZSBwcm9wZXJ0aWVzIG9uIFByb3hpZXMgY3JlYXRlZCBieSB0cy1taXhlcicpO1xuICAgIH0sXG4gICAgb3duS2V5cygpIHtcbiAgICAgICAgcmV0dXJuIGluZ3JlZGllbnRzXG4gICAgICAgICAgICAubWFwKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKVxuICAgICAgICAgICAgLnJlZHVjZSgocHJldiwgY3VycikgPT4gY3Vyci5jb25jYXQocHJldi5maWx0ZXIoa2V5ID0+IGN1cnIuaW5kZXhPZihrZXkpIDwgMCkpKTtcbiAgICB9LFxufSk7XG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgcHJveHktcHJvdG90eXBlIG9iamVjdCB0aGF0IGlzIGEgXCJzb2Z0XCIgbWl4dHVyZSBvZiB0aGUgZ2l2ZW4gcHJvdG90eXBlcy4gIFRoZSBtaXhpbmcgaXMgYWNoaWV2ZWQgYnlcbiAqIHByb3h5aW5nIGFsbCBwcm9wZXJ0eSBhY2Nlc3MgdG8gdGhlIGluZ3JlZGllbnRzLiAgVGhpcyBpcyBub3QgRVM1IGNvbXBhdGlibGUgYW5kIGxlc3MgcGVyZm9ybWFudC4gIEhvd2V2ZXIsIGFueVxuICogY2hhbmdlcyBtYWRlIHRvIHRoZSBzb3VyY2UgcHJvdG90eXBlcyB3aWxsIGJlIHJlZmxlY3RlZCBpbiB0aGUgcHJveHktcHJvdG90eXBlLCB3aGljaCBtYXkgYmUgZGVzaXJhYmxlLlxuICovXG5jb25zdCBzb2Z0TWl4UHJvdG9zID0gKGluZ3JlZGllbnRzLCBjb25zdHJ1Y3RvcikgPT4gcHJveHlNaXgoWy4uLmluZ3JlZGllbnRzLCB7IGNvbnN0cnVjdG9yIH1dKTtcblxuY29uc3Qgc2V0dGluZ3MgPSB7XG4gICAgaW5pdEZ1bmN0aW9uOiBudWxsLFxuICAgIHN0YXRpY3NTdHJhdGVneTogJ2NvcHknLFxuICAgIHByb3RvdHlwZVN0cmF0ZWd5OiAnY29weScsXG4gICAgZGVjb3JhdG9ySW5oZXJpdGFuY2U6ICdkZWVwJyxcbn07XG5cbi8vIEtlZXBzIHRyYWNrIG9mIGNvbnN0aXR1ZW50IGNsYXNzZXMgZm9yIGV2ZXJ5IG1peGluIGNsYXNzIGNyZWF0ZWQgYnkgdHMtbWl4ZXIuXG5jb25zdCBtaXhpbnMgPSBuZXcgV2Vha01hcCgpO1xuY29uc3QgZ2V0TWl4aW5zRm9yQ2xhc3MgPSAoY2xhenopID0+IG1peGlucy5nZXQoY2xhenopO1xuY29uc3QgcmVnaXN0ZXJNaXhpbnMgPSAobWl4ZWRDbGFzcywgY29uc3RpdHVlbnRzKSA9PiBtaXhpbnMuc2V0KG1peGVkQ2xhc3MsIGNvbnN0aXR1ZW50cyk7XG5jb25zdCBoYXNNaXhpbiA9IChpbnN0YW5jZSwgbWl4aW4pID0+IHtcbiAgICBpZiAoaW5zdGFuY2UgaW5zdGFuY2VvZiBtaXhpbilcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgY29uc3QgY29uc3RydWN0b3IgPSBpbnN0YW5jZS5jb25zdHJ1Y3RvcjtcbiAgICBjb25zdCB2aXNpdGVkID0gbmV3IFNldCgpO1xuICAgIGxldCBmcm9udGllciA9IG5ldyBTZXQoKTtcbiAgICBmcm9udGllci5hZGQoY29uc3RydWN0b3IpO1xuICAgIHdoaWxlIChmcm9udGllci5zaXplID4gMCkge1xuICAgICAgICAvLyBjaGVjayBpZiB0aGUgZnJvbnRpZXIgaGFzIHRoZSBtaXhpbiB3ZSdyZSBsb29raW5nIGZvci4gIGlmIG5vdCwgd2UgY2FuIHNheSB3ZSB2aXNpdGVkIGV2ZXJ5IGl0ZW0gaW4gdGhlIGZyb250aWVyXG4gICAgICAgIGlmIChmcm9udGllci5oYXMobWl4aW4pKVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIGZyb250aWVyLmZvckVhY2goKGl0ZW0pID0+IHZpc2l0ZWQuYWRkKGl0ZW0pKTtcbiAgICAgICAgLy8gYnVpbGQgYSBuZXcgZnJvbnRpZXIgYmFzZWQgb24gdGhlIGFzc29jaWF0ZWQgbWl4aW4gY2xhc3NlcyBhbmQgcHJvdG90eXBlIGNoYWlucyBvZiBlYWNoIGZyb250aWVyIGl0ZW1cbiAgICAgICAgY29uc3QgbmV3RnJvbnRpZXIgPSBuZXcgU2V0KCk7XG4gICAgICAgIGZyb250aWVyLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1Db25zdGl0dWVudHMgPSAoX2EgPSBtaXhpbnMuZ2V0KGl0ZW0pKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBwcm90b0NoYWluKGl0ZW0ucHJvdG90eXBlKVxuICAgICAgICAgICAgICAgIC5tYXAoKHByb3RvKSA9PiBwcm90by5jb25zdHJ1Y3RvcilcbiAgICAgICAgICAgICAgICAuZmlsdGVyKChpdGVtKSA9PiBpdGVtICE9PSBudWxsKTtcbiAgICAgICAgICAgIGlmIChpdGVtQ29uc3RpdHVlbnRzKVxuICAgICAgICAgICAgICAgIGl0ZW1Db25zdGl0dWVudHMuZm9yRWFjaCgoY29uc3RpdHVlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF2aXNpdGVkLmhhcyhjb25zdGl0dWVudCkgJiYgIWZyb250aWVyLmhhcyhjb25zdGl0dWVudCkpXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdGcm9udGllci5hZGQoY29uc3RpdHVlbnQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gd2UgaGF2ZSBhIG5ldyBmcm9udGllciwgbm93IHNlYXJjaCBhZ2FpblxuICAgICAgICBmcm9udGllciA9IG5ld0Zyb250aWVyO1xuICAgIH1cbiAgICAvLyBpZiB3ZSBnZXQgaGVyZSwgd2UgY291bGRuJ3QgZmluZCB0aGUgbWl4aW4gYW55d2hlcmUgaW4gdGhlIHByb3RvdHlwZSBjaGFpbiBvciBhc3NvY2lhdGVkIG1peGluIGNsYXNzZXNcbiAgICByZXR1cm4gZmFsc2U7XG59O1xuXG5jb25zdCBtZXJnZU9iamVjdHNPZkRlY29yYXRvcnMgPSAobzEsIG8yKSA9PiB7XG4gICAgdmFyIF9hLCBfYjtcbiAgICBjb25zdCBhbGxLZXlzID0gdW5pcXVlKFsuLi5PYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvMSksIC4uLk9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG8yKV0pO1xuICAgIGNvbnN0IG1lcmdlZE9iamVjdCA9IHt9O1xuICAgIGZvciAobGV0IGtleSBvZiBhbGxLZXlzKVxuICAgICAgICBtZXJnZWRPYmplY3Rba2V5XSA9IHVuaXF1ZShbLi4uKChfYSA9IG8xID09PSBudWxsIHx8IG8xID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvMVtrZXldKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBbXSksIC4uLigoX2IgPSBvMiA9PT0gbnVsbCB8fCBvMiA9PT0gdm9pZCAwID8gdm9pZCAwIDogbzJba2V5XSkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogW10pXSk7XG4gICAgcmV0dXJuIG1lcmdlZE9iamVjdDtcbn07XG5jb25zdCBtZXJnZVByb3BlcnR5QW5kTWV0aG9kRGVjb3JhdG9ycyA9IChkMSwgZDIpID0+IHtcbiAgICB2YXIgX2EsIF9iLCBfYywgX2Q7XG4gICAgcmV0dXJuICh7XG4gICAgICAgIHByb3BlcnR5OiBtZXJnZU9iamVjdHNPZkRlY29yYXRvcnMoKF9hID0gZDEgPT09IG51bGwgfHwgZDEgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGQxLnByb3BlcnR5KSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiB7fSwgKF9iID0gZDIgPT09IG51bGwgfHwgZDIgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGQyLnByb3BlcnR5KSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiB7fSksXG4gICAgICAgIG1ldGhvZDogbWVyZ2VPYmplY3RzT2ZEZWNvcmF0b3JzKChfYyA9IGQxID09PSBudWxsIHx8IGQxID09PSB2b2lkIDAgPyB2b2lkIDAgOiBkMS5tZXRob2QpICE9PSBudWxsICYmIF9jICE9PSB2b2lkIDAgPyBfYyA6IHt9LCAoX2QgPSBkMiA9PT0gbnVsbCB8fCBkMiA9PT0gdm9pZCAwID8gdm9pZCAwIDogZDIubWV0aG9kKSAhPT0gbnVsbCAmJiBfZCAhPT0gdm9pZCAwID8gX2QgOiB7fSksXG4gICAgfSk7XG59O1xuY29uc3QgbWVyZ2VEZWNvcmF0b3JzID0gKGQxLCBkMikgPT4ge1xuICAgIHZhciBfYSwgX2IsIF9jLCBfZCwgX2UsIF9mO1xuICAgIHJldHVybiAoe1xuICAgICAgICBjbGFzczogdW5pcXVlKFsuLi4oX2EgPSBkMSA9PT0gbnVsbCB8fCBkMSA9PT0gdm9pZCAwID8gdm9pZCAwIDogZDEuY2xhc3MpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IFtdLCAuLi4oX2IgPSBkMiA9PT0gbnVsbCB8fCBkMiA9PT0gdm9pZCAwID8gdm9pZCAwIDogZDIuY2xhc3MpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IFtdXSksXG4gICAgICAgIHN0YXRpYzogbWVyZ2VQcm9wZXJ0eUFuZE1ldGhvZERlY29yYXRvcnMoKF9jID0gZDEgPT09IG51bGwgfHwgZDEgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGQxLnN0YXRpYykgIT09IG51bGwgJiYgX2MgIT09IHZvaWQgMCA/IF9jIDoge30sIChfZCA9IGQyID09PSBudWxsIHx8IGQyID09PSB2b2lkIDAgPyB2b2lkIDAgOiBkMi5zdGF0aWMpICE9PSBudWxsICYmIF9kICE9PSB2b2lkIDAgPyBfZCA6IHt9KSxcbiAgICAgICAgaW5zdGFuY2U6IG1lcmdlUHJvcGVydHlBbmRNZXRob2REZWNvcmF0b3JzKChfZSA9IGQxID09PSBudWxsIHx8IGQxID09PSB2b2lkIDAgPyB2b2lkIDAgOiBkMS5pbnN0YW5jZSkgIT09IG51bGwgJiYgX2UgIT09IHZvaWQgMCA/IF9lIDoge30sIChfZiA9IGQyID09PSBudWxsIHx8IGQyID09PSB2b2lkIDAgPyB2b2lkIDAgOiBkMi5pbnN0YW5jZSkgIT09IG51bGwgJiYgX2YgIT09IHZvaWQgMCA/IF9mIDoge30pLFxuICAgIH0pO1xufTtcbmNvbnN0IGRlY29yYXRvcnMgPSBuZXcgTWFwKCk7XG5jb25zdCBmaW5kQWxsQ29uc3RpdHVlbnRDbGFzc2VzID0gKC4uLmNsYXNzZXMpID0+IHtcbiAgICB2YXIgX2E7XG4gICAgY29uc3QgYWxsQ2xhc3NlcyA9IG5ldyBTZXQoKTtcbiAgICBjb25zdCBmcm9udGllciA9IG5ldyBTZXQoWy4uLmNsYXNzZXNdKTtcbiAgICB3aGlsZSAoZnJvbnRpZXIuc2l6ZSA+IDApIHtcbiAgICAgICAgZm9yIChsZXQgY2xhenogb2YgZnJvbnRpZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IHByb3RvQ2hhaW5DbGFzc2VzID0gcHJvdG9DaGFpbihjbGF6ei5wcm90b3R5cGUpLm1hcChwcm90byA9PiBwcm90by5jb25zdHJ1Y3Rvcik7XG4gICAgICAgICAgICBjb25zdCBtaXhpbkNsYXNzZXMgPSAoX2EgPSBnZXRNaXhpbnNGb3JDbGFzcyhjbGF6eikpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IFtdO1xuICAgICAgICAgICAgY29uc3QgcG90ZW50aWFsbHlOZXdDbGFzc2VzID0gWy4uLnByb3RvQ2hhaW5DbGFzc2VzLCAuLi5taXhpbkNsYXNzZXNdO1xuICAgICAgICAgICAgY29uc3QgbmV3Q2xhc3NlcyA9IHBvdGVudGlhbGx5TmV3Q2xhc3Nlcy5maWx0ZXIoYyA9PiAhYWxsQ2xhc3Nlcy5oYXMoYykpO1xuICAgICAgICAgICAgZm9yIChsZXQgbmV3Q2xhc3Mgb2YgbmV3Q2xhc3NlcylcbiAgICAgICAgICAgICAgICBmcm9udGllci5hZGQobmV3Q2xhc3MpO1xuICAgICAgICAgICAgYWxsQ2xhc3Nlcy5hZGQoY2xhenopO1xuICAgICAgICAgICAgZnJvbnRpZXIuZGVsZXRlKGNsYXp6KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gWy4uLmFsbENsYXNzZXNdO1xufTtcbmNvbnN0IGRlZXBEZWNvcmF0b3JTZWFyY2ggPSAoLi4uY2xhc3NlcykgPT4ge1xuICAgIGNvbnN0IGRlY29yYXRvcnNGb3JDbGFzc0NoYWluID0gZmluZEFsbENvbnN0aXR1ZW50Q2xhc3NlcyguLi5jbGFzc2VzKVxuICAgICAgICAubWFwKGNsYXp6ID0+IGRlY29yYXRvcnMuZ2V0KGNsYXp6KSlcbiAgICAgICAgLmZpbHRlcihkZWNvcmF0b3JzID0+ICEhZGVjb3JhdG9ycyk7XG4gICAgaWYgKGRlY29yYXRvcnNGb3JDbGFzc0NoYWluLmxlbmd0aCA9PSAwKVxuICAgICAgICByZXR1cm4ge307XG4gICAgaWYgKGRlY29yYXRvcnNGb3JDbGFzc0NoYWluLmxlbmd0aCA9PSAxKVxuICAgICAgICByZXR1cm4gZGVjb3JhdG9yc0ZvckNsYXNzQ2hhaW5bMF07XG4gICAgcmV0dXJuIGRlY29yYXRvcnNGb3JDbGFzc0NoYWluLnJlZHVjZSgoZDEsIGQyKSA9PiBtZXJnZURlY29yYXRvcnMoZDEsIGQyKSk7XG59O1xuY29uc3QgZGlyZWN0RGVjb3JhdG9yU2VhcmNoID0gKC4uLmNsYXNzZXMpID0+IHtcbiAgICBjb25zdCBjbGFzc0RlY29yYXRvcnMgPSBjbGFzc2VzLm1hcChjbGF6eiA9PiBnZXREZWNvcmF0b3JzRm9yQ2xhc3MoY2xhenopKTtcbiAgICBpZiAoY2xhc3NEZWNvcmF0b3JzLmxlbmd0aCA9PT0gMClcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgIGlmIChjbGFzc0RlY29yYXRvcnMubGVuZ3RoID09PSAxKVxuICAgICAgICByZXR1cm4gY2xhc3NEZWNvcmF0b3JzWzBdO1xuICAgIHJldHVybiBjbGFzc0RlY29yYXRvcnMucmVkdWNlKChkMSwgZDIpID0+IG1lcmdlRGVjb3JhdG9ycyhkMSwgZDIpKTtcbn07XG5jb25zdCBnZXREZWNvcmF0b3JzRm9yQ2xhc3MgPSAoY2xhenopID0+IHtcbiAgICBsZXQgZGVjb3JhdG9yc0ZvckNsYXNzID0gZGVjb3JhdG9ycy5nZXQoY2xhenopO1xuICAgIGlmICghZGVjb3JhdG9yc0ZvckNsYXNzKSB7XG4gICAgICAgIGRlY29yYXRvcnNGb3JDbGFzcyA9IHt9O1xuICAgICAgICBkZWNvcmF0b3JzLnNldChjbGF6eiwgZGVjb3JhdG9yc0ZvckNsYXNzKTtcbiAgICB9XG4gICAgcmV0dXJuIGRlY29yYXRvcnNGb3JDbGFzcztcbn07XG5jb25zdCBkZWNvcmF0ZUNsYXNzID0gKGRlY29yYXRvcikgPT4gKChjbGF6eikgPT4ge1xuICAgIGNvbnN0IGRlY29yYXRvcnNGb3JDbGFzcyA9IGdldERlY29yYXRvcnNGb3JDbGFzcyhjbGF6eik7XG4gICAgbGV0IGNsYXNzRGVjb3JhdG9ycyA9IGRlY29yYXRvcnNGb3JDbGFzcy5jbGFzcztcbiAgICBpZiAoIWNsYXNzRGVjb3JhdG9ycykge1xuICAgICAgICBjbGFzc0RlY29yYXRvcnMgPSBbXTtcbiAgICAgICAgZGVjb3JhdG9yc0ZvckNsYXNzLmNsYXNzID0gY2xhc3NEZWNvcmF0b3JzO1xuICAgIH1cbiAgICBjbGFzc0RlY29yYXRvcnMucHVzaChkZWNvcmF0b3IpO1xuICAgIHJldHVybiBkZWNvcmF0b3IoY2xhenopO1xufSk7XG5jb25zdCBkZWNvcmF0ZU1lbWJlciA9IChkZWNvcmF0b3IpID0+ICgob2JqZWN0LCBrZXksIC4uLm90aGVyQXJncykgPT4ge1xuICAgIHZhciBfYSwgX2IsIF9jO1xuICAgIGNvbnN0IGRlY29yYXRvclRhcmdldFR5cGUgPSB0eXBlb2Ygb2JqZWN0ID09PSAnZnVuY3Rpb24nID8gJ3N0YXRpYycgOiAnaW5zdGFuY2UnO1xuICAgIGNvbnN0IGRlY29yYXRvclR5cGUgPSB0eXBlb2Ygb2JqZWN0W2tleV0gPT09ICdmdW5jdGlvbicgPyAnbWV0aG9kJyA6ICdwcm9wZXJ0eSc7XG4gICAgY29uc3QgY2xhenogPSBkZWNvcmF0b3JUYXJnZXRUeXBlID09PSAnc3RhdGljJyA/IG9iamVjdCA6IG9iamVjdC5jb25zdHJ1Y3RvcjtcbiAgICBjb25zdCBkZWNvcmF0b3JzRm9yQ2xhc3MgPSBnZXREZWNvcmF0b3JzRm9yQ2xhc3MoY2xhenopO1xuICAgIGNvbnN0IGRlY29yYXRvcnNGb3JUYXJnZXRUeXBlID0gKF9hID0gZGVjb3JhdG9yc0ZvckNsYXNzID09PSBudWxsIHx8IGRlY29yYXRvcnNGb3JDbGFzcyA9PT0gdm9pZCAwID8gdm9pZCAwIDogZGVjb3JhdG9yc0ZvckNsYXNzW2RlY29yYXRvclRhcmdldFR5cGVdKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiB7fTtcbiAgICBkZWNvcmF0b3JzRm9yQ2xhc3NbZGVjb3JhdG9yVGFyZ2V0VHlwZV0gPSBkZWNvcmF0b3JzRm9yVGFyZ2V0VHlwZTtcbiAgICBsZXQgZGVjb3JhdG9yc0ZvclR5cGUgPSAoX2IgPSBkZWNvcmF0b3JzRm9yVGFyZ2V0VHlwZSA9PT0gbnVsbCB8fCBkZWNvcmF0b3JzRm9yVGFyZ2V0VHlwZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogZGVjb3JhdG9yc0ZvclRhcmdldFR5cGVbZGVjb3JhdG9yVHlwZV0pICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IHt9O1xuICAgIGRlY29yYXRvcnNGb3JUYXJnZXRUeXBlW2RlY29yYXRvclR5cGVdID0gZGVjb3JhdG9yc0ZvclR5cGU7XG4gICAgbGV0IGRlY29yYXRvcnNGb3JLZXkgPSAoX2MgPSBkZWNvcmF0b3JzRm9yVHlwZSA9PT0gbnVsbCB8fCBkZWNvcmF0b3JzRm9yVHlwZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogZGVjb3JhdG9yc0ZvclR5cGVba2V5XSkgIT09IG51bGwgJiYgX2MgIT09IHZvaWQgMCA/IF9jIDogW107XG4gICAgZGVjb3JhdG9yc0ZvclR5cGVba2V5XSA9IGRlY29yYXRvcnNGb3JLZXk7XG4gICAgLy8gQHRzLWlnbm9yZTogYXJyYXkgaXMgdHlwZSBgQVtdIHwgQltdYCBhbmQgaXRlbSBpcyB0eXBlIGBBIHwgQmAsIHNvIHRlY2huaWNhbGx5IGEgdHlwZSBlcnJvciwgYnV0IGl0J3MgZmluZVxuICAgIGRlY29yYXRvcnNGb3JLZXkucHVzaChkZWNvcmF0b3IpO1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICByZXR1cm4gZGVjb3JhdG9yKG9iamVjdCwga2V5LCAuLi5vdGhlckFyZ3MpO1xufSk7XG5jb25zdCBkZWNvcmF0ZSA9IChkZWNvcmF0b3IpID0+ICgoLi4uYXJncykgPT4ge1xuICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMSlcbiAgICAgICAgcmV0dXJuIGRlY29yYXRlQ2xhc3MoZGVjb3JhdG9yKShhcmdzWzBdKTtcbiAgICByZXR1cm4gZGVjb3JhdGVNZW1iZXIoZGVjb3JhdG9yKSguLi5hcmdzKTtcbn0pO1xuXG5mdW5jdGlvbiBNaXhpbiguLi5jb25zdHJ1Y3RvcnMpIHtcbiAgICB2YXIgX2EsIF9iLCBfYztcbiAgICBjb25zdCBwcm90b3R5cGVzID0gY29uc3RydWN0b3JzLm1hcChjb25zdHJ1Y3RvciA9PiBjb25zdHJ1Y3Rvci5wcm90b3R5cGUpO1xuICAgIC8vIEhlcmUgd2UgZ2F0aGVyIHVwIHRoZSBpbml0IGZ1bmN0aW9ucyBvZiB0aGUgaW5ncmVkaWVudCBwcm90b3R5cGVzLCBjb21iaW5lIHRoZW0gaW50byBvbmUgaW5pdCBmdW5jdGlvbiwgYW5kXG4gICAgLy8gYXR0YWNoIGl0IHRvIHRoZSBtaXhlZCBjbGFzcyBwcm90b3R5cGUuICBUaGUgcmVhc29uIHdlIGRvIHRoaXMgaXMgYmVjYXVzZSB3ZSB3YW50IHRoZSBpbml0IGZ1bmN0aW9ucyB0byBtaXhcbiAgICAvLyBzaW1pbGFybHkgdG8gY29uc3RydWN0b3JzIC0tIG5vdCBtZXRob2RzLCB3aGljaCBzaW1wbHkgb3ZlcnJpZGUgZWFjaCBvdGhlci5cbiAgICBjb25zdCBpbml0RnVuY3Rpb25OYW1lID0gc2V0dGluZ3MuaW5pdEZ1bmN0aW9uO1xuICAgIGlmIChpbml0RnVuY3Rpb25OYW1lICE9PSBudWxsKSB7XG4gICAgICAgIGNvbnN0IGluaXRGdW5jdGlvbnMgPSBwcm90b3R5cGVzXG4gICAgICAgICAgICAubWFwKHByb3RvID0+IHByb3RvW2luaXRGdW5jdGlvbk5hbWVdKVxuICAgICAgICAgICAgLmZpbHRlcihmdW5jID0+IHR5cGVvZiBmdW5jID09PSAnZnVuY3Rpb24nKTtcbiAgICAgICAgY29uc3QgY29tYmluZWRJbml0RnVuY3Rpb24gPSBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAgICAgZm9yIChsZXQgaW5pdEZ1bmN0aW9uIG9mIGluaXRGdW5jdGlvbnMpXG4gICAgICAgICAgICAgICAgaW5pdEZ1bmN0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBleHRyYVByb3RvID0geyBbaW5pdEZ1bmN0aW9uTmFtZV06IGNvbWJpbmVkSW5pdEZ1bmN0aW9uIH07XG4gICAgICAgIHByb3RvdHlwZXMucHVzaChleHRyYVByb3RvKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gTWl4ZWRDbGFzcyguLi5hcmdzKSB7XG4gICAgICAgIGZvciAoY29uc3QgY29uc3RydWN0b3Igb2YgY29uc3RydWN0b3JzKVxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZTogcG90ZW50aWFsbHkgYWJzdHJhY3QgY2xhc3NcbiAgICAgICAgICAgIGNvcHlQcm9wcyh0aGlzLCBuZXcgY29uc3RydWN0b3IoLi4uYXJncykpO1xuICAgICAgICBpZiAoaW5pdEZ1bmN0aW9uTmFtZSAhPT0gbnVsbCAmJiB0eXBlb2YgdGhpc1tpbml0RnVuY3Rpb25OYW1lXSA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgIHRoaXNbaW5pdEZ1bmN0aW9uTmFtZV0uYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICAgIE1peGVkQ2xhc3MucHJvdG90eXBlID0gc2V0dGluZ3MucHJvdG90eXBlU3RyYXRlZ3kgPT09ICdjb3B5J1xuICAgICAgICA/IGhhcmRNaXhQcm90b3MocHJvdG90eXBlcywgTWl4ZWRDbGFzcylcbiAgICAgICAgOiBzb2Z0TWl4UHJvdG9zKHByb3RvdHlwZXMsIE1peGVkQ2xhc3MpO1xuICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihNaXhlZENsYXNzLCBzZXR0aW5ncy5zdGF0aWNzU3RyYXRlZ3kgPT09ICdjb3B5J1xuICAgICAgICA/IGhhcmRNaXhQcm90b3MoY29uc3RydWN0b3JzLCBudWxsLCBbJ3Byb3RvdHlwZSddKVxuICAgICAgICA6IHByb3h5TWl4KGNvbnN0cnVjdG9ycywgRnVuY3Rpb24ucHJvdG90eXBlKSk7XG4gICAgbGV0IERlY29yYXRlZE1peGVkQ2xhc3MgPSBNaXhlZENsYXNzO1xuICAgIGlmIChzZXR0aW5ncy5kZWNvcmF0b3JJbmhlcml0YW5jZSAhPT0gJ25vbmUnKSB7XG4gICAgICAgIGNvbnN0IGNsYXNzRGVjb3JhdG9ycyA9IHNldHRpbmdzLmRlY29yYXRvckluaGVyaXRhbmNlID09PSAnZGVlcCdcbiAgICAgICAgICAgID8gZGVlcERlY29yYXRvclNlYXJjaCguLi5jb25zdHJ1Y3RvcnMpXG4gICAgICAgICAgICA6IGRpcmVjdERlY29yYXRvclNlYXJjaCguLi5jb25zdHJ1Y3RvcnMpO1xuICAgICAgICBmb3IgKGxldCBkZWNvcmF0b3Igb2YgKF9hID0gY2xhc3NEZWNvcmF0b3JzID09PSBudWxsIHx8IGNsYXNzRGVjb3JhdG9ycyA9PT0gdm9pZCAwID8gdm9pZCAwIDogY2xhc3NEZWNvcmF0b3JzLmNsYXNzKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBbXSkge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gZGVjb3JhdG9yKERlY29yYXRlZE1peGVkQ2xhc3MpO1xuICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIERlY29yYXRlZE1peGVkQ2xhc3MgPSByZXN1bHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYXBwbHlQcm9wQW5kTWV0aG9kRGVjb3JhdG9ycygoX2IgPSBjbGFzc0RlY29yYXRvcnMgPT09IG51bGwgfHwgY2xhc3NEZWNvcmF0b3JzID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjbGFzc0RlY29yYXRvcnMuc3RhdGljKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiB7fSwgRGVjb3JhdGVkTWl4ZWRDbGFzcyk7XG4gICAgICAgIGFwcGx5UHJvcEFuZE1ldGhvZERlY29yYXRvcnMoKF9jID0gY2xhc3NEZWNvcmF0b3JzID09PSBudWxsIHx8IGNsYXNzRGVjb3JhdG9ycyA9PT0gdm9pZCAwID8gdm9pZCAwIDogY2xhc3NEZWNvcmF0b3JzLmluc3RhbmNlKSAhPT0gbnVsbCAmJiBfYyAhPT0gdm9pZCAwID8gX2MgOiB7fSwgRGVjb3JhdGVkTWl4ZWRDbGFzcy5wcm90b3R5cGUpO1xuICAgIH1cbiAgICByZWdpc3Rlck1peGlucyhEZWNvcmF0ZWRNaXhlZENsYXNzLCBjb25zdHJ1Y3RvcnMpO1xuICAgIHJldHVybiBEZWNvcmF0ZWRNaXhlZENsYXNzO1xufVxuY29uc3QgYXBwbHlQcm9wQW5kTWV0aG9kRGVjb3JhdG9ycyA9IChwcm9wQW5kTWV0aG9kRGVjb3JhdG9ycywgdGFyZ2V0KSA9PiB7XG4gICAgY29uc3QgcHJvcERlY29yYXRvcnMgPSBwcm9wQW5kTWV0aG9kRGVjb3JhdG9ycy5wcm9wZXJ0eTtcbiAgICBjb25zdCBtZXRob2REZWNvcmF0b3JzID0gcHJvcEFuZE1ldGhvZERlY29yYXRvcnMubWV0aG9kO1xuICAgIGlmIChwcm9wRGVjb3JhdG9ycylcbiAgICAgICAgZm9yIChsZXQga2V5IGluIHByb3BEZWNvcmF0b3JzKVxuICAgICAgICAgICAgZm9yIChsZXQgZGVjb3JhdG9yIG9mIHByb3BEZWNvcmF0b3JzW2tleV0pXG4gICAgICAgICAgICAgICAgZGVjb3JhdG9yKHRhcmdldCwga2V5KTtcbiAgICBpZiAobWV0aG9kRGVjb3JhdG9ycylcbiAgICAgICAgZm9yIChsZXQga2V5IGluIG1ldGhvZERlY29yYXRvcnMpXG4gICAgICAgICAgICBmb3IgKGxldCBkZWNvcmF0b3Igb2YgbWV0aG9kRGVjb3JhdG9yc1trZXldKVxuICAgICAgICAgICAgICAgIGRlY29yYXRvcih0YXJnZXQsIGtleSwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkpO1xufTtcbi8qKlxuICogQSBkZWNvcmF0b3IgdmVyc2lvbiBvZiB0aGUgYE1peGluYCBmdW5jdGlvbi4gIFlvdSdsbCB3YW50IHRvIHVzZSB0aGlzIGluc3RlYWQgb2YgYE1peGluYCBmb3IgbWl4aW5nIGdlbmVyaWMgY2xhc3Nlcy5cbiAqL1xuY29uc3QgbWl4ID0gKC4uLmluZ3JlZGllbnRzKSA9PiBkZWNvcmF0ZWRDbGFzcyA9PiB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IG1peGVkQ2xhc3MgPSBNaXhpbiguLi5pbmdyZWRpZW50cy5jb25jYXQoW2RlY29yYXRlZENsYXNzXSkpO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtaXhlZENsYXNzLCAnbmFtZScsIHtcbiAgICAgICAgdmFsdWU6IGRlY29yYXRlZENsYXNzLm5hbWUsXG4gICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICB9KTtcbiAgICByZXR1cm4gbWl4ZWRDbGFzcztcbn07XG5cbmV4cG9ydCB7IE1peGluLCBkZWNvcmF0ZSwgaGFzTWl4aW4sIG1peCwgc2V0dGluZ3MgfTtcbiIsImltcG9ydCB7IE1peGluIH0gZnJvbSAndHMtbWl4ZXInO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRXZlbnRNaXhpbiBpbXBsZW1lbnRzIEV2ZW50QXdhcmVJbnRlcmZhY2Uge1xuICBfbGlzdGVuZXJzOiBSZWNvcmQ8c3RyaW5nLCBFdmVudEhhbmRsZXJbXT4gPSB7fTtcblxuICBvbihldmVudDogc3RyaW5nIHwgc3RyaW5nW10sIGhhbmRsZXI6IEV2ZW50SGFuZGxlcik6IHRoaXMge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGV2ZW50KSkge1xuICAgICAgZm9yIChjb25zdCBlIG9mIGV2ZW50KSB7XG4gICAgICAgIHRoaXMub24oZSwgaGFuZGxlcik7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB0aGlzLl9saXN0ZW5lcnNbZXZlbnRdID8/PSBbXTtcblxuICAgIHRoaXMuX2xpc3RlbmVyc1tldmVudF0ucHVzaChoYW5kbGVyKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgb25jZShldmVudDogc3RyaW5nIHwgc3RyaW5nW10sIGhhbmRsZXI6IEV2ZW50SGFuZGxlcik6IHRoaXMge1xuICAgIGhhbmRsZXIub25jZSA9IHRydWU7XG4gICAgcmV0dXJuIHRoaXMub24oZXZlbnQsIGhhbmRsZXIpO1xuICB9XG5cbiAgb2ZmKGV2ZW50OiBzdHJpbmcsIGhhbmRsZXI/OiBFdmVudEhhbmRsZXIpOiB0aGlzIHtcbiAgICBpZiAoaGFuZGxlcikge1xuICAgICAgdGhpcy5fbGlzdGVuZXJzW2V2ZW50XSA9IHRoaXMubGlzdGVuZXJzKGV2ZW50KS5maWx0ZXIoKGxpc3RlbmVyKSA9PiBsaXN0ZW5lciAhPT0gaGFuZGxlcik7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBkZWxldGUgdGhpcy5fbGlzdGVuZXJzW2V2ZW50XTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgdHJpZ2dlcihldmVudDogc3RyaW5nIHwgc3RyaW5nW10sIC4uLmFyZ3M6IGFueVtdKTogdGhpcyB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZXZlbnQpKSB7XG4gICAgICBmb3IgKGNvbnN0IGUgb2YgZXZlbnQpIHtcbiAgICAgICAgdGhpcy50cmlnZ2VyKGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBsaXN0ZW5lciBvZiB0aGlzLmxpc3RlbmVycyhldmVudCkpIHtcbiAgICAgIGxpc3RlbmVyKC4uLmFyZ3MpO1xuICAgIH1cblxuICAgIC8vIFJlbW92ZSBvbmNlXG4gICAgdGhpcy5fbGlzdGVuZXJzW2V2ZW50XSA9IHRoaXMubGlzdGVuZXJzKGV2ZW50KS5maWx0ZXIoKGxpc3RlbmVyKSA9PiBsaXN0ZW5lcj8ub25jZSAhPT0gdHJ1ZSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVycyhldmVudDogc3RyaW5nKTogRXZlbnRIYW5kbGVyW10ge1xuICAgIHJldHVybiB0aGlzLl9saXN0ZW5lcnNbZXZlbnRdID09PSB1bmRlZmluZWQgPyBbXSA6IHRoaXMuX2xpc3RlbmVyc1tldmVudF07XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEV2ZW50QnVzIGV4dGVuZHMgTWl4aW4oRXZlbnRNaXhpbikge1xufVxuXG5leHBvcnQgdHlwZSBFdmVudEhhbmRsZXIgPSAoKC4uLmV2ZW50OiBhbnlbXSkgPT4gdm9pZCkgJiB7IG9uY2U/OiBib29sZWFuIH07XG5cbmV4cG9ydCBpbnRlcmZhY2UgRXZlbnRBd2FyZUludGVyZmFjZSB7XG4gIG9uKGV2ZW50OiBzdHJpbmcgfCBzdHJpbmdbXSwgaGFuZGxlcjogRXZlbnRIYW5kbGVyKTogdGhpcztcblxuICBvbmNlKGV2ZW50OiBzdHJpbmcgfCBzdHJpbmdbXSwgaGFuZGxlcjogRXZlbnRIYW5kbGVyKTogdGhpcztcblxuICBvZmYoZXZlbnQ6IHN0cmluZywgaGFuZGxlcj86IEV2ZW50SGFuZGxlcik6IHRoaXM7XG5cbiAgdHJpZ2dlcihldmVudDogc3RyaW5nIHwgc3RyaW5nW10sIC4uLmFyZ3M6IGFueVtdKTogdGhpcztcblxuICBsaXN0ZW5lcnMoZXZlbnQ6IHN0cmluZyk6IEV2ZW50SGFuZGxlcltdO1xufVxuIiwiXHJcbmltcG9ydCB7IGRhdGEgfSBmcm9tICcuL2RhdGEnO1xyXG5pbXBvcnQgeyBFdmVudEF3YXJlSW50ZXJmYWNlLCBFdmVudE1peGluIH0gZnJvbSAnLi9ldmVudHMnO1xyXG5pbXBvcnQgeyBkb21yZWFkeSB9IGZyb20gJy4vc2VydmljZSc7XHJcbmltcG9ydCB7IENvbnN0cnVjdG9yLCBVbmljb3JuUGx1Z2luIH0gZnJvbSAnLi90eXBlcyc7XHJcbmltcG9ydCB7IE1peGluIH0gZnJvbSAndHMtbWl4ZXInO1xyXG5cclxuZXhwb3J0IHR5cGUgSW5qZWN0aW9uS2V5PFQgPSBhbnk+ID0gc3RyaW5nIHwgc3ltYm9sIHwgQ29uc3RydWN0b3I8VD47XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFVuaWNvcm5BcHAgZXh0ZW5kcyBFdmVudEF3YXJlSW50ZXJmYWNlIHt9XHJcblxyXG5leHBvcnQgY2xhc3MgVW5pY29ybkFwcCBleHRlbmRzIE1peGluKEV2ZW50TWl4aW4pIGltcGxlbWVudHMgRXZlbnRBd2FyZUludGVyZmFjZSB7XHJcbiAgcmVnaXN0cnkgPSBuZXcgTWFwKCk7XHJcbiAgcGx1Z2lucyA9IG5ldyBNYXAoKTtcclxuICAvLyBfbGlzdGVuZXJzID0ge307XHJcbiAgd2FpdHM6IFByb21pc2U8YW55PltdID0gW107XHJcbiAgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55PjtcclxuICBkZWZhdWx0T3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xyXG4gIGRvbXJlYWR5ID0gZG9tcmVhZHk7XHJcbiAgZGF0YSA9IGRhdGE7XHJcblxyXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xyXG4gICAgc3VwZXIoKTtcclxuICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xyXG5cclxuICAgIC8vIFdhaXQgZG9tIHJlYWR5XHJcbiAgICBpZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICB0aGlzLndhaXQoKHJlc29sdmU6IEZ1bmN0aW9uKSA9PiB7XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHJlc29sdmUoKSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgLy8gUmVhZHlcclxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcclxuICAgICAgICB0aGlzLmNvbXBsZXRlZCgpLnRoZW4oKCkgPT4gdGhpcy50cmlnZ2VyKCdsb2FkZWQnKSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdXNlKHBsdWdpbjogVW5pY29yblBsdWdpbiwgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9KSB7XHJcbiAgICBpZiAoQXJyYXkuaXNBcnJheShwbHVnaW4pKSB7XHJcbiAgICAgIHBsdWdpbi5mb3JFYWNoKHAgPT4gdGhpcy51c2UocCkpO1xyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvLyBpZiAocGx1Z2luLmlzID09PSB1bmRlZmluZWQpIHtcclxuICAgIC8vICAgdGhyb3cgbmV3IEVycm9yKGBQbHVnaW46ICR7cGx1Z2luLm5hbWV9IG11c3QgaW5zdGFuY2Ugb2YgOiAke1BsdWdpbi5uYW1lfWApO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIHBsdWdpbj8uaW5zdGFsbD8uKHRoaXMsIG9wdGlvbnMpO1xyXG5cclxuICAgIHRoaXMudHJpZ2dlcigncGx1Z2luLmluc3RhbGxlZCcsIHBsdWdpbik7XHJcblxyXG4gICAgdGhpcy5wbHVnaW5zLnNldChwbHVnaW4sIHBsdWdpbik7XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBkZXRhY2gocGx1Z2luOiBhbnkpIHtcclxuICAgIGlmIChwbHVnaW4udW5pbnN0YWxsKSB7XHJcbiAgICAgIHBsdWdpbi51bmluc3RhbGwodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy50cmlnZ2VyKCdwbHVnaW4udW5pbnN0YWxsZWQnLCBwbHVnaW4pO1xyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgaW5qZWN0PFQ+KGlkOiBJbmplY3Rpb25LZXk8VD4pOiBUO1xyXG4gIGluamVjdDxUPihpZDogSW5qZWN0aW9uS2V5PFQ+LCBkZWY6IFQpOiBUO1xyXG4gIGluamVjdDxUPihpZDogSW5qZWN0aW9uS2V5PFQ+LCBkZWY/OiBUKTogVDtcclxuICBpbmplY3Q8VD4oaWQ6IEluamVjdGlvbktleTxUPiwgZGVmPzogVCk6IFQgfCB1bmRlZmluZWQge1xyXG4gICAgaWYgKCF0eXBlb2YgdGhpcy5yZWdpc3RyeS5oYXMoaWQpKSB7XHJcbiAgICAgIGlmIChkZWYgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHJldHVybiBkZWY7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW5qZWN0YWJsZTogJHsoaWQgYXMgYW55KS5uYW1lfSBub3QgZm91bmQuYCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMucmVnaXN0cnkuZ2V0KGlkKTtcclxuICB9XHJcblxyXG4gIHByb3ZpZGU8VD4oaWQ6IEluamVjdGlvbktleTxUPiwgdmFsdWU6IGFueSkge1xyXG4gICAgdGhpcy5yZWdpc3RyeS5zZXQoaWQsIHZhbHVlKTtcclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIC8vIHRyaWdnZXIoZXZlbnQsIC4uLmFyZ3MpIHtcclxuICAvLyAgIHJldHVybiB0aGlzLnRhcChzdXBlci50cmlnZ2VyKGV2ZW50LCAuLi5hcmdzKSwgKCkgPT4ge1xyXG4gIC8vICAgICBpZiAodGhpcy5kYXRhKCd3aW5kd2Fsa2VyLmRlYnVnJykpIHtcclxuICAvLyAgICAgICBjb25zb2xlLmRlYnVnKGBbVW5pY29ybiBFdmVudF0gJHtldmVudH1gLCBhcmdzLCB0aGlzLmxpc3RlbmVycyhldmVudCkpO1xyXG4gIC8vICAgICB9XHJcbiAgLy8gICB9KTtcclxuICAvLyB9XHJcblxyXG4gIHdhaXQoY2FsbGJhY2s6IEZ1bmN0aW9uKTogUHJvbWlzZTxhbnk+IHtcclxuICAgIGNvbnN0IHAgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGNvbnN0IHByb21pc2UgPSBjYWxsYmFjayhyZXNvbHZlLCByZWplY3QpO1xyXG5cclxuICAgICAgaWYgKHByb21pc2UgJiYgJ3RoZW4nIGluIHByb21pc2UpIHtcclxuICAgICAgICBwcm9taXNlLnRoZW4ocmVzb2x2ZSkuY2F0Y2gocmVqZWN0KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy53YWl0cy5wdXNoKHApO1xyXG5cclxuICAgIHJldHVybiBwO1xyXG4gIH1cclxuXHJcbiAgY29tcGxldGVkKCk6IFByb21pc2U8YW55W10+IHtcclxuICAgIGNvbnN0IHByb21pc2UgPSBQcm9taXNlLmFsbCh0aGlzLndhaXRzKTtcclxuXHJcbiAgICB0aGlzLndhaXRzID0gW107XHJcblxyXG4gICAgcmV0dXJuIHByb21pc2U7XHJcbiAgfVxyXG5cclxuICBtYWNybyhuYW1lOiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbikge1xyXG4gICAgaWYgKCh0aGlzIGFzIGFueSlbbmFtZV0pIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBNYWNybzogJHtuYW1lfSBhbHJlYWR5IGV4aXN0cy5gKTtcclxuICAgIH1cclxuXHJcbiAgICAodGhpcyBhcyBhbnkpW25hbWVdID0gY2FsbGJhY2s7XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG59XHJcbiIsIi8vIEB0cy1ub2NoZWNrXHJcbi8vIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2phdmFuL2Zvcm0tcmVxdWVzdC1zdWJtaXQtcG9seWZpbGxcclxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1SZXF1ZXN0U3VibWl0KHByb3RvdHlwZSkge1xyXG4gIGlmICh0eXBlb2YgcHJvdG90eXBlLnJlcXVlc3RTdWJtaXQgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgcHJvdG90eXBlLnJlcXVlc3RTdWJtaXQgPSBmdW5jdGlvbiAoc3VibWl0dGVyKSB7XHJcbiAgICBpZiAoc3VibWl0dGVyKSB7XHJcbiAgICAgIHZhbGlkYXRlU3VibWl0dGVyKHN1Ym1pdHRlciwgdGhpcyk7XHJcbiAgICAgIHN1Ym1pdHRlci5jbGljaygpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc3VibWl0dGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcclxuICAgICAgc3VibWl0dGVyLnR5cGUgPSAnc3VibWl0JztcclxuICAgICAgc3VibWl0dGVyLmhpZGRlbiA9IHRydWU7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoc3VibWl0dGVyKTtcclxuICAgICAgc3VibWl0dGVyLmNsaWNrKCk7XHJcbiAgICAgIHRoaXMucmVtb3ZlQ2hpbGQoc3VibWl0dGVyKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBmdW5jdGlvbiB2YWxpZGF0ZVN1Ym1pdHRlcihzdWJtaXR0ZXIsIGZvcm0pIHtcclxuICAgIHN1Ym1pdHRlciBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IHx8IHJhaXNlKFR5cGVFcnJvciwgJ3BhcmFtZXRlciAxIGlzIG5vdCBvZiB0eXBlIFxcJ0hUTUxFbGVtZW50XFwnJyk7XHJcbiAgICBzdWJtaXR0ZXIudHlwZSA9PSAnc3VibWl0JyB8fCByYWlzZShUeXBlRXJyb3IsICdUaGUgc3BlY2lmaWVkIGVsZW1lbnQgaXMgbm90IGEgc3VibWl0IGJ1dHRvbicpO1xyXG4gICAgc3VibWl0dGVyLmZvcm0gPT0gZm9ybSB8fCByYWlzZShET01FeGNlcHRpb24sICdUaGUgc3BlY2lmaWVkIGVsZW1lbnQgaXMgbm90IG93bmVkIGJ5IHRoaXMgZm9ybSBlbGVtZW50JywgJ05vdEZvdW5kRXJyb3InKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHJhaXNlKGVycm9yQ29uc3RydWN0b3IsIG1lc3NhZ2UsIG5hbWUpIHtcclxuICAgIHRocm93IG5ldyBlcnJvckNvbnN0cnVjdG9yKCdGYWlsZWQgdG8gZXhlY3V0ZSBcXCdyZXF1ZXN0U3VibWl0XFwnIG9uIFxcJ0hUTUxGb3JtRWxlbWVudFxcJzogJyArIG1lc3NhZ2UgKyAnLicsIG5hbWUpO1xyXG4gIH1cclxufVxyXG4iLCJcbmltcG9ydCB7IGZvcm1SZXF1ZXN0U3VibWl0IH0gZnJvbSAnLi9mb3JtLXJlcXVlc3Qtc3VibWl0JztcblxuZXhwb3J0IGZ1bmN0aW9uIHBvbHlmaWxsKCkge1xuICAvLyBJZiBpbiBicm93c2VyXG4gIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgIGZvcm1SZXF1ZXN0U3VibWl0KEhUTUxGb3JtRWxlbWVudC5wcm90b3R5cGUpO1xuICB9XG59XG4iLCJleHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlRmllbGRNdWx0aVVwbG9hZGVyKCkge1xuICBhd2FpdCBpbXBvcnQoJy4uL21vZHVsZS9maWVsZC1tdWx0aS11cGxvYWRlcicpO1xufVxuIiwiaW1wb3J0IHR5cGUgeyBUaW55bWNlQ29udHJvbGxlciwgVGlueW1jZU1vZHVsZSB9IGZyb20gJy4uL21vZHVsZS90aW55bWNlJztcclxuaW1wb3J0IHR5cGUgeyBNYXliZVByb21pc2UgfSBmcm9tICcuLi90eXBlcyc7XHJcbmltcG9ydCB0eXBlIHsgVGlueU1DRSB9IGZyb20gJ3RpbnltY2UnO1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZVRpbnltY2UoKTogUHJvbWlzZTxUaW55bWNlTW9kdWxlPlxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlVGlueW1jZShcclxuICBzZWxlY3Rvcj86IHN0cmluZyxcclxuICBvcHRpb25zPzogUmVjb3JkPHN0cmluZywgYW55PlxyXG4pOiBQcm9taXNlPFRpbnltY2VDb250cm9sbGVyPjtcclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZVRpbnltY2UoXHJcbiAgc2VsZWN0b3I/OiBzdHJpbmcsXHJcbiAgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9XHJcbik6IFByb21pc2U8YW55PiB7XHJcbiAgY29uc3QgbW9kdWxlID0gYXdhaXQgaW1wb3J0KCcuLi9tb2R1bGUvdGlueW1jZScpO1xyXG5cclxuICBpZiAoc2VsZWN0b3IpIHtcclxuICAgIHJldHVybiBtb2R1bGUuZ2V0KHNlbGVjdG9yLCBvcHRpb25zKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBtb2R1bGU7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VUaW55bWNlSG9vayhcclxuICBoYW5kbGVyOiAoKHRpbnltY2U6IFRpbnlNQ0UpID0+IE1heWJlUHJvbWlzZTxhbnk+KVxyXG4pOiBQcm9taXNlPHZvaWQ+IHtcclxuICBjb25zdCB7IGFkZEhvb2sgfSA9IGF3YWl0IGltcG9ydCgnLi4vbW9kdWxlL3RpbnltY2UnKTtcclxuXHJcbiAgcmV0dXJuIGFkZEhvb2soaGFuZGxlcik7XHJcbn1cclxuIiwiaW1wb3J0IHR5cGUgeyBVbmljb3JuQXBwIH0gZnJvbSAnLi4vYXBwJztcclxuaW1wb3J0IHtcclxuICB1c2VGaWVsZENhc2NhZGVTZWxlY3QsXHJcbiAgdXNlRmllbGRGaWxlRHJhZyxcclxuICB1c2VGaWVsZEZsYXRwaWNrcixcclxuICB1c2VGaWVsZE1vZGFsU2VsZWN0LCB1c2VGaWVsZE1vZGFsVHJlZSxcclxuICB1c2VGaWVsZFJlcGVhdGFibGUsXHJcbiAgdXNlRmllbGRTaW5nbGVJbWFnZURyYWcsXHJcbiAgdXNlSWZyYW1lTW9kYWwsIHVzZVMzVXBsb2FkZXIsXHJcbiAgdXNlU2hvd09uLFxyXG59IGZyb20gJy4uL2NvbXBvc2FibGUnO1xyXG5pbXBvcnQgeyB1c2VGaWVsZE11bHRpVXBsb2FkZXIgfSBmcm9tICcuLi9jb21wb3NhYmxlL3VzZUZpZWxkTXVsdGlVcGxvYWRlcic7XHJcbmltcG9ydCB7IHVzZVRpbnltY2UgfSBmcm9tICcuLi9jb21wb3NhYmxlL3VzZVRpbnltY2UnO1xyXG5pbXBvcnQgeyB1c2VVbmljb3JuIH0gZnJvbSAnLi4vdW5pY29ybic7XHJcblxyXG5kZWNsYXJlIG1vZHVsZSAnLi4vYXBwJyB7XHJcbiAgZXhwb3J0IGludGVyZmFjZSBVbmljb3JuQXBwIHtcclxuICAgIC8qKiBAZGVwcmVjYXRlZCBPbmx5IGZvciBjb2RlIGdlbmVyYXRvciB1c2UuICovXHJcbiAgICAkdWk6IHR5cGVvZiBtZXRob2RzO1xyXG4gIH1cclxufVxyXG5cclxuLy8gQHRzLWlnbm9yZVxyXG5kZWNsYXJlIG1vZHVsZSAnQHdpbmR3YWxrZXItaW8vdW5pY29ybi1uZXh0JyB7XHJcbiAgZXhwb3J0IGludGVyZmFjZSBVbmljb3JuQXBwIHtcclxuICAgIC8qKiBAZGVwcmVjYXRlZCBPbmx5IGZvciBjb2RlIGdlbmVyYXRvciB1c2UuICovXHJcbiAgICAkdWk6IHR5cGVvZiBtZXRob2RzO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZVVuaWNvcm5QaHBBZGFwdGVyKGFwcD86IFVuaWNvcm5BcHApIHtcclxuICBhcHAgPz89IHVzZVVuaWNvcm4oKTtcclxuXHJcbiAgYXBwLnVzZShVbmljb3JuUGhwQWRhcHRlcik7XHJcblxyXG4gIHJldHVybiBhcHAuJHVpO1xyXG59XHJcblxyXG5jb25zdCBtZXRob2RzID0ge1xyXG4gIHJlcGVhdGFibGU6IHVzZUZpZWxkUmVwZWF0YWJsZSxcclxuICBmbGF0cGlja3I6IHVzZUZpZWxkRmxhdHBpY2tyLFxyXG4gIGZpbGVEcmFnOiB1c2VGaWVsZEZpbGVEcmFnLFxyXG4gIG1vZGFsRmllbGQ6IHVzZUZpZWxkTW9kYWxTZWxlY3QsXHJcbiAgY2FzY2FkZVNlbGVjdDogdXNlRmllbGRDYXNjYWRlU2VsZWN0LFxyXG4gIHNpZDogdXNlRmllbGRTaW5nbGVJbWFnZURyYWcsXHJcbiAgdGlueW1jZToge1xyXG4gICAgaW5pdDogdXNlVGlueW1jZVxyXG4gIH0sXHJcbiAgczNVcGxvYWRlcjogdXNlUzNVcGxvYWRlcixcclxuICBpZnJhbWVNb2RhbDogdXNlSWZyYW1lTW9kYWwsXHJcbiAgaW5pdFNob3dPbjogdXNlU2hvd09uLFxyXG4gIG1vZGFsVHJlZTogdXNlRmllbGRNb2RhbFRyZWUsXHJcbiAgbXVsdGlVcGxvYWRlcjogdXNlRmllbGRNdWx0aVVwbG9hZGVyLFxyXG59O1xyXG5cclxuZXhwb3J0IGNsYXNzIFVuaWNvcm5QaHBBZGFwdGVyIHtcclxuICBzdGF0aWMgaW5zdGFsbChhcHA6IFVuaWNvcm5BcHApIHtcclxuICAgIGlmIChhcHAuJHVpKSB7XHJcbiAgICAgIGFwcC4kdWkgPSB7IC4uLmFwcC4kdWksIC4uLm1ldGhvZHMgfTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGFwcC4kdWkgPSBtZXRob2RzO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBhdyB9IGZyb20gJy4uL2Rpc3QvY2h1bmtzL3VuaWNvcm4tRFI5SnBQWU8nO1xyXG5pbXBvcnQgeyBJbmplY3Rpb25LZXksIFVuaWNvcm5BcHAgfSBmcm9tICcuL2FwcCc7XHJcbmltcG9ydCB7IFVuaWNvcm5MZWdhY3ksIHVzZUxlZ2FjeU1ldGhvZHMgfSBmcm9tICcuL2xlZ2FjeS9sZWdhY3knO1xyXG5pbXBvcnQgeyBwb2x5ZmlsbCB9IGZyb20gJy4vcG9seWZpbGwnO1xyXG5pbXBvcnQgeyByZW1vdmVDbG9hayB9IGZyb20gJy4vdXRpbGl0aWVzJztcclxuXHJcbmV4cG9ydCAqIGZyb20gJy4vZGF0YSc7XHJcbmV4cG9ydCAqIGZyb20gJy4vZXZlbnRzJztcclxuZXhwb3J0ICogZnJvbSAnLi9zZXJ2aWNlJztcclxuZXhwb3J0ICogZnJvbSAnLi9jb21wb3NhYmxlJztcclxuZXhwb3J0ICogZnJvbSAnLi9wbHVnaW4nO1xyXG5cclxuZXhwb3J0IHR5cGUgeyBVbmljb3JuQXBwIH07XHJcblxyXG5sZXQgYXBwOiBVbmljb3JuQXBwO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVVuaWNvcm4oKTogVW5pY29ybkFwcCB7XHJcbiAgcG9seWZpbGwoKTtcclxuICByZW1vdmVDbG9haygpO1xyXG5cclxuICByZXR1cm4gYXBwID0gbmV3IFVuaWNvcm5BcHAoKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVVuaWNvcm5XaXRoUGx1Z2lucygpOiBVbmljb3JuQXBwIHtcclxuICBjb25zdCBhcHAgPSBjcmVhdGVVbmljb3JuKCk7XHJcblxyXG4gIC8vIGFwcC51c2UoVW5pY29yblVJKTtcclxuXHJcbiAgLy8gYXBwLnVzZShVbmljb3JuRG9tKTtcclxuXHJcbiAgcmV0dXJuIGFwcDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZVVuaWNvcm4oaW5zdGFuY2U/OiBVbmljb3JuQXBwKTogVW5pY29ybkFwcCB7XHJcbiAgaWYgKGluc3RhbmNlKSB7XHJcbiAgICBhcHAgPSBpbnN0YW5jZTtcclxuICB9XHJcblxyXG4gIHJldHVybiBhcHAgPz89IGNyZWF0ZVVuaWNvcm4oKTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHVzZUluamVjdDogdHlwZW9mIFVuaWNvcm5BcHAucHJvdG90eXBlLmluamVjdCA9IDxUID0gYW55PihpZDogSW5qZWN0aW9uS2V5PFQ+LCBkZWY/OiBUKTogVCA9PiB7XHJcbiAgcmV0dXJuIHVzZVVuaWNvcm4oKS5pbmplY3Q8VD4oaWQsIGRlZik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwdXNoVW5pY29yblRvR2xvYmFsKGFwcD86IFVuaWNvcm5BcHApIHtcclxuICAvLyBAdHMtaWdub3JlXHJcbiAgd2luZG93LnUgPSBhcHAgPz8gdXNlVW5pY29ybigpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlTWFjcm8obmFtZTogc3RyaW5nLCBoYW5kbGVyOiAoLi4uYXJnczogYW55W10pID0+IGFueSkge1xyXG4gIHVzZVVuaWNvcm4oKS5tYWNybyhuYW1lLCBoYW5kbGVyKTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUxlZ2FjeShhcHA/OiBVbmljb3JuQXBwKSB7XHJcbiAgYXBwID8/PSB1c2VVbmljb3JuKCk7XHJcblxyXG4gIHB1c2hVbmljb3JuVG9HbG9iYWwoYXBwKTtcclxuXHJcbiAgY29uc3QgeyB1c2VMZWdhY3lNZXRob2RzIH0gPSBhd2FpdCBpbXBvcnQoJy4vbGVnYWN5L2xlZ2FjeScpO1xyXG5cclxuICBhd2FpdCB1c2VMZWdhY3lNZXRob2RzKGFwcCk7XHJcblxyXG4gIHJldHVybiBhcHA7XHJcbn1cclxuIl0sIm5hbWVzIjpbInJlbW92ZURhdGEiLCJodG1sIiwic2VsZWN0b3IiLCJjYWxsYmFjayIsImNzcyIsInF1ZXVlIiwid2FpdCIsInNwcmludGYiLCJ2c3ByaW50ZiIsIm0iLCJtb2R1bGUiLCJ1aSIsInN0YWNrIiwidXJpIiwiYXNzZXQiLCJyb3V0ZSIsInJtZGF0YSIsInByb3RvQ2hhaW4iLCJkZWNvcmF0b3JzIiwiYXBwIiwidXNlTGVnYWN5TWV0aG9kcyJdLCJtYXBwaW5ncyI6IkFBQ08sU0FBUyxjQUFjLEtBQXNDO0FBQ2xFLFNBQU8sT0FBTyxPQUFPLFFBQVEsWUFBWSxDQUFDLE1BQU0sUUFBUSxHQUFHO0FBQzdEO0FBRU8sU0FBUyxVQUFtQyxXQUF1QixTQUFtQjtBQUMzRixNQUFJLE1BQVcsY0FBYyxNQUFNLElBQUksRUFBRSxHQUFHLFdBQVc7QUFFdkQsYUFBVyxVQUFVLFNBQVM7QUFDNUIsUUFBSSxNQUFNLFFBQVEsTUFBTSxHQUFHO0FBQ3pCLFlBQU8sTUFBTSxRQUFRLEdBQUcsSUFBSSxJQUFJLE9BQU8sTUFBTSxJQUFJO0FBQ2pEO0FBQUEsSUFDRjtBQUNBLFFBQUksY0FBYyxNQUFNLEdBQUc7QUFDekIsWUFBTSxFQUFFLEdBQUksY0FBYyxHQUFHLElBQUksTUFBTSxDQUFBLEVBQUM7QUFDeEMsaUJBQVcsT0FBTyxPQUFPLEtBQUssTUFBTSxHQUFHO0FBQ3JDLFlBQUksR0FBRyxJQUNMLE9BQU8sTUFBTSxVQUFVLElBQUksR0FBRyxHQUFHLE9BQU8sR0FBRyxDQUFDLElBQUksT0FBTyxHQUFHO0FBQUEsTUFDOUQ7QUFDQTtBQUFBLElBQ0Y7QUFDQSxVQUFNO0FBQUEsRUFDUjtBQUNBLFNBQU87QUFDVDtBQ3ZCTyxTQUFTLFFBQVEsU0FB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
