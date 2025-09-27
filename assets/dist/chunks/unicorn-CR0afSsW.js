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
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
function getAugmentedNamespace(n) {
  if (Object.prototype.hasOwnProperty.call(n, "__esModule")) return n;
  var f = n.default;
  if (typeof f == "function") {
    var a = function a2() {
      var isInstance = false;
      try {
        isInstance = this instanceof a2;
      } catch {
      }
      if (isInstance) {
        return Reflect.construct(f, arguments, this.constructor);
      }
      return f.apply(this, arguments);
    };
    a.prototype = f.prototype;
  } else a = {};
  Object.defineProperty(a, "__esModule", { value: true });
  Object.keys(n).forEach(function(k) {
    var d = Object.getOwnPropertyDescriptor(n, k);
    Object.defineProperty(a, k, d.get ? d : {
      enumerable: true,
      get: function() {
        return n[k];
      }
    });
  });
  return a;
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
        var cursor = 1, tree_length = parse_tree.length, arg, output = "", i, k, ph, pad, pad_character, pad_length, is_positive, sign2;
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
                sign2 = is_positive ? "+" : "-";
                arg = arg.toString().replace(re.sign, "");
              } else {
                sign2 = "";
              }
              pad_character = ph.pad_char ? ph.pad_char === "0" ? "0" : ph.pad_char.charAt(1) : " ";
              pad_length = ph.width - (sign2 + arg).length;
              pad = ph.width ? pad_length > 0 ? pad_character.repeat(pad_length) : "" : "";
              output += ph.align ? sign2 + arg + pad : pad_character === "0" ? sign2 + pad + arg : pad + sign2 + arg;
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
  const m = await import("./checkboxes-multi-select-Ms6nhytZ.js");
  if (selector) {
    m.CheckboxesMultiSelect.handle(selector, options);
  }
  return m;
}
async function useFieldCascadeSelect() {
  const module2 = await import("./field-cascade-select-DZsA49gF.js");
  await module2.ready;
  return module2;
}
async function useFieldFileDrag() {
  const module2 = await import("./field-file-drag-2Jqiae7o.js");
  await module2.ready;
  return module2;
}
function useFieldFlatpickr() {
  return import("./field-flatpickr-BrhUGqkV.js");
}
function useFieldModalSelect() {
  return import("./field-modal-select-C36VnTJe.js");
}
function useFieldModalTree() {
  import("./field-modal-tree-BgsE6kCM.js");
}
async function useFieldRepeatable() {
  const module2 = await import("./field-repeatable-Dp_bOuXh.js");
  await module2.ready;
  return module2;
}
function useFieldSingleImageDrag() {
  return import("./field-single-image-drag-DL4AyuPH.js");
}
async function useForm(ele, options = {}) {
  const { UnicornFormElement } = await import("./form-Dx6b-cjM.js");
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
  const { UnicornGridElement } = await import("./grid-DkcZbsWp.js");
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
  const { UnicornHttpClient } = await import("./http-client-CkeZNBIG.js");
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
  const module2 = await import("./iframe-modal-DdnXfjp8.js");
  await module2.ready;
  return module2;
}
async function useListDependent(element, dependent, options = {}) {
  const module2 = await import("./list-dependent-r--I6FAj.js");
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
  const module2 = await import("./s3-uploader-Co5f1XCA.js");
  if (!name) {
    return module2;
  }
  const { get: get2 } = module2;
  return get2(name, options);
}
async function useShowOn() {
  const module2 = await import("./show-on-CUaNh4fv.js");
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
  const { UIBootstrap5 } = await import("./ui-bootstrap5-D8EYY-jw.js");
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
  const WebDirective = (await import("./web-directive.es-DnVr9lB3.js")).default;
  const wd = new WebDirective(options);
  wd.listen();
  return wd;
}
async function useFormValidation(selector) {
  const module2 = await import("./validation-CEvF5MOy.js");
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
AlertAdapter.alert = (title, text = "", type2 = "info") => {
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
function renderMessage(messages, type2 = "info") {
  ui.theme.renderMessage(messages, type2);
}
function clearMessages() {
  ui.theme.clearMessages();
}
function notify(messages, type2 = "info") {
  ui.theme.renderMessage(messages, type2);
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
function useSystemUri(type2, path) {
  const uri2 = UnicornSystemUri.get();
  if (type2) {
    return uri2[type2](path);
  }
  return uri2;
}
function useAssetUri(type2, path) {
  const asset2 = UnicornAssetUri.get();
  if (type2) {
    return asset2[type2](path);
  }
  return asset2;
}
function uri$1(type2) {
  return data("unicorn.uri")[type2];
}
function asset(type2) {
  return uri$1("asset")[type2];
}
function addUriBase(uri2, type2 = "path") {
  if (uri2.substring(0, 2) === "//" || uri2.substring(0, 4) === "http") {
    return uri2;
  }
  return asset(type2) + "/" + uri2;
}
class UnicornSystemUri extends URL {
  static instance;
  static get() {
    return this.instance ??= new this(uri$1("full"));
  }
  path(path = "") {
    return uri$1("path") + path;
  }
  root(path = "") {
    return uri$1("root") + path;
  }
  current() {
    return uri$1("current") || "";
  }
  full() {
    return uri$1("full") || "";
  }
  route() {
    return uri$1("route") || "";
  }
  script() {
    return uri$1("script") || "";
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
var type;
var hasRequiredType;
function requireType() {
  if (hasRequiredType) return type;
  hasRequiredType = 1;
  type = TypeError;
  return type;
}
const __viteBrowserExternal = {};
const __viteBrowserExternal$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __viteBrowserExternal
}, /* @__PURE__ */ (() => Symbol.toStringTag)(), { value: "Module" }));
const require$$0 = /* @__PURE__ */ getAugmentedNamespace(__viteBrowserExternal$1);
var objectInspect;
var hasRequiredObjectInspect;
function requireObjectInspect() {
  if (hasRequiredObjectInspect) return objectInspect;
  hasRequiredObjectInspect = 1;
  var hasMap = typeof Map === "function" && Map.prototype;
  var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, "size") : null;
  var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === "function" ? mapSizeDescriptor.get : null;
  var mapForEach = hasMap && Map.prototype.forEach;
  var hasSet = typeof Set === "function" && Set.prototype;
  var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, "size") : null;
  var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === "function" ? setSizeDescriptor.get : null;
  var setForEach = hasSet && Set.prototype.forEach;
  var hasWeakMap = typeof WeakMap === "function" && WeakMap.prototype;
  var weakMapHas = hasWeakMap ? WeakMap.prototype.has : null;
  var hasWeakSet = typeof WeakSet === "function" && WeakSet.prototype;
  var weakSetHas = hasWeakSet ? WeakSet.prototype.has : null;
  var hasWeakRef = typeof WeakRef === "function" && WeakRef.prototype;
  var weakRefDeref = hasWeakRef ? WeakRef.prototype.deref : null;
  var booleanValueOf = Boolean.prototype.valueOf;
  var objectToString = Object.prototype.toString;
  var functionToString = Function.prototype.toString;
  var $match = String.prototype.match;
  var $slice = String.prototype.slice;
  var $replace = String.prototype.replace;
  var $toUpperCase = String.prototype.toUpperCase;
  var $toLowerCase = String.prototype.toLowerCase;
  var $test = RegExp.prototype.test;
  var $concat = Array.prototype.concat;
  var $join = Array.prototype.join;
  var $arrSlice = Array.prototype.slice;
  var $floor = Math.floor;
  var bigIntValueOf = typeof BigInt === "function" ? BigInt.prototype.valueOf : null;
  var gOPS = Object.getOwnPropertySymbols;
  var symToString = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? Symbol.prototype.toString : null;
  var hasShammedSymbols = typeof Symbol === "function" && typeof Symbol.iterator === "object";
  var toStringTag = typeof Symbol === "function" && Symbol.toStringTag && (typeof Symbol.toStringTag === hasShammedSymbols ? "object" : "symbol") ? Symbol.toStringTag : null;
  var isEnumerable = Object.prototype.propertyIsEnumerable;
  var gPO = (typeof Reflect === "function" ? Reflect.getPrototypeOf : Object.getPrototypeOf) || ([].__proto__ === Array.prototype ? function(O) {
    return O.__proto__;
  } : null);
  function addNumericSeparator(num, str) {
    if (num === Infinity || num === -Infinity || num !== num || num && num > -1e3 && num < 1e3 || $test.call(/e/, str)) {
      return str;
    }
    var sepRegex = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
    if (typeof num === "number") {
      var int = num < 0 ? -$floor(-num) : $floor(num);
      if (int !== num) {
        var intStr = String(int);
        var dec = $slice.call(str, intStr.length + 1);
        return $replace.call(intStr, sepRegex, "$&_") + "." + $replace.call($replace.call(dec, /([0-9]{3})/g, "$&_"), /_$/, "");
      }
    }
    return $replace.call(str, sepRegex, "$&_");
  }
  var utilInspect = require$$0;
  var inspectCustom = utilInspect.custom;
  var inspectSymbol = isSymbol(inspectCustom) ? inspectCustom : null;
  var quotes = {
    __proto__: null,
    "double": '"',
    single: "'"
  };
  var quoteREs = {
    __proto__: null,
    "double": /(["\\])/g,
    single: /(['\\])/g
  };
  objectInspect = function inspect_(obj, options, depth, seen) {
    var opts = options || {};
    if (has(opts, "quoteStyle") && !has(quotes, opts.quoteStyle)) {
      throw new TypeError('option "quoteStyle" must be "single" or "double"');
    }
    if (has(opts, "maxStringLength") && (typeof opts.maxStringLength === "number" ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity : opts.maxStringLength !== null)) {
      throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
    }
    var customInspect = has(opts, "customInspect") ? opts.customInspect : true;
    if (typeof customInspect !== "boolean" && customInspect !== "symbol") {
      throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");
    }
    if (has(opts, "indent") && opts.indent !== null && opts.indent !== "	" && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)) {
      throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
    }
    if (has(opts, "numericSeparator") && typeof opts.numericSeparator !== "boolean") {
      throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
    }
    var numericSeparator = opts.numericSeparator;
    if (typeof obj === "undefined") {
      return "undefined";
    }
    if (obj === null) {
      return "null";
    }
    if (typeof obj === "boolean") {
      return obj ? "true" : "false";
    }
    if (typeof obj === "string") {
      return inspectString(obj, opts);
    }
    if (typeof obj === "number") {
      if (obj === 0) {
        return Infinity / obj > 0 ? "0" : "-0";
      }
      var str = String(obj);
      return numericSeparator ? addNumericSeparator(obj, str) : str;
    }
    if (typeof obj === "bigint") {
      var bigIntStr = String(obj) + "n";
      return numericSeparator ? addNumericSeparator(obj, bigIntStr) : bigIntStr;
    }
    var maxDepth = typeof opts.depth === "undefined" ? 5 : opts.depth;
    if (typeof depth === "undefined") {
      depth = 0;
    }
    if (depth >= maxDepth && maxDepth > 0 && typeof obj === "object") {
      return isArray(obj) ? "[Array]" : "[Object]";
    }
    var indent = getIndent(opts, depth);
    if (typeof seen === "undefined") {
      seen = [];
    } else if (indexOf(seen, obj) >= 0) {
      return "[Circular]";
    }
    function inspect(value, from, noIndent) {
      if (from) {
        seen = $arrSlice.call(seen);
        seen.push(from);
      }
      if (noIndent) {
        var newOpts = {
          depth: opts.depth
        };
        if (has(opts, "quoteStyle")) {
          newOpts.quoteStyle = opts.quoteStyle;
        }
        return inspect_(value, newOpts, depth + 1, seen);
      }
      return inspect_(value, opts, depth + 1, seen);
    }
    if (typeof obj === "function" && !isRegExp(obj)) {
      var name = nameOf(obj);
      var keys = arrObjKeys(obj, inspect);
      return "[Function" + (name ? ": " + name : " (anonymous)") + "]" + (keys.length > 0 ? " { " + $join.call(keys, ", ") + " }" : "");
    }
    if (isSymbol(obj)) {
      var symString = hasShammedSymbols ? $replace.call(String(obj), /^(Symbol\(.*\))_[^)]*$/, "$1") : symToString.call(obj);
      return typeof obj === "object" && !hasShammedSymbols ? markBoxed(symString) : symString;
    }
    if (isElement(obj)) {
      var s = "<" + $toLowerCase.call(String(obj.nodeName));
      var attrs = obj.attributes || [];
      for (var i = 0; i < attrs.length; i++) {
        s += " " + attrs[i].name + "=" + wrapQuotes(quote(attrs[i].value), "double", opts);
      }
      s += ">";
      if (obj.childNodes && obj.childNodes.length) {
        s += "...";
      }
      s += "</" + $toLowerCase.call(String(obj.nodeName)) + ">";
      return s;
    }
    if (isArray(obj)) {
      if (obj.length === 0) {
        return "[]";
      }
      var xs = arrObjKeys(obj, inspect);
      if (indent && !singleLineValues(xs)) {
        return "[" + indentedJoin(xs, indent) + "]";
      }
      return "[ " + $join.call(xs, ", ") + " ]";
    }
    if (isError(obj)) {
      var parts = arrObjKeys(obj, inspect);
      if (!("cause" in Error.prototype) && "cause" in obj && !isEnumerable.call(obj, "cause")) {
        return "{ [" + String(obj) + "] " + $join.call($concat.call("[cause]: " + inspect(obj.cause), parts), ", ") + " }";
      }
      if (parts.length === 0) {
        return "[" + String(obj) + "]";
      }
      return "{ [" + String(obj) + "] " + $join.call(parts, ", ") + " }";
    }
    if (typeof obj === "object" && customInspect) {
      if (inspectSymbol && typeof obj[inspectSymbol] === "function" && utilInspect) {
        return utilInspect(obj, { depth: maxDepth - depth });
      } else if (customInspect !== "symbol" && typeof obj.inspect === "function") {
        return obj.inspect();
      }
    }
    if (isMap(obj)) {
      var mapParts = [];
      if (mapForEach) {
        mapForEach.call(obj, function(value, key) {
          mapParts.push(inspect(key, obj, true) + " => " + inspect(value, obj));
        });
      }
      return collectionOf("Map", mapSize.call(obj), mapParts, indent);
    }
    if (isSet(obj)) {
      var setParts = [];
      if (setForEach) {
        setForEach.call(obj, function(value) {
          setParts.push(inspect(value, obj));
        });
      }
      return collectionOf("Set", setSize.call(obj), setParts, indent);
    }
    if (isWeakMap(obj)) {
      return weakCollectionOf("WeakMap");
    }
    if (isWeakSet(obj)) {
      return weakCollectionOf("WeakSet");
    }
    if (isWeakRef(obj)) {
      return weakCollectionOf("WeakRef");
    }
    if (isNumber(obj)) {
      return markBoxed(inspect(Number(obj)));
    }
    if (isBigInt(obj)) {
      return markBoxed(inspect(bigIntValueOf.call(obj)));
    }
    if (isBoolean(obj)) {
      return markBoxed(booleanValueOf.call(obj));
    }
    if (isString(obj)) {
      return markBoxed(inspect(String(obj)));
    }
    if (typeof window !== "undefined" && obj === window) {
      return "{ [object Window] }";
    }
    if (typeof globalThis !== "undefined" && obj === globalThis || typeof commonjsGlobal !== "undefined" && obj === commonjsGlobal) {
      return "{ [object globalThis] }";
    }
    if (!isDate(obj) && !isRegExp(obj)) {
      var ys = arrObjKeys(obj, inspect);
      var isPlainObject2 = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;
      var protoTag = obj instanceof Object ? "" : "null prototype";
      var stringTag = !isPlainObject2 && toStringTag && Object(obj) === obj && toStringTag in obj ? $slice.call(toStr(obj), 8, -1) : protoTag ? "Object" : "";
      var constructorTag = isPlainObject2 || typeof obj.constructor !== "function" ? "" : obj.constructor.name ? obj.constructor.name + " " : "";
      var tag = constructorTag + (stringTag || protoTag ? "[" + $join.call($concat.call([], stringTag || [], protoTag || []), ": ") + "] " : "");
      if (ys.length === 0) {
        return tag + "{}";
      }
      if (indent) {
        return tag + "{" + indentedJoin(ys, indent) + "}";
      }
      return tag + "{ " + $join.call(ys, ", ") + " }";
    }
    return String(obj);
  };
  function wrapQuotes(s, defaultStyle, opts) {
    var style = opts.quoteStyle || defaultStyle;
    var quoteChar = quotes[style];
    return quoteChar + s + quoteChar;
  }
  function quote(s) {
    return $replace.call(String(s), /"/g, "&quot;");
  }
  function canTrustToString(obj) {
    return !toStringTag || !(typeof obj === "object" && (toStringTag in obj || typeof obj[toStringTag] !== "undefined"));
  }
  function isArray(obj) {
    return toStr(obj) === "[object Array]" && canTrustToString(obj);
  }
  function isDate(obj) {
    return toStr(obj) === "[object Date]" && canTrustToString(obj);
  }
  function isRegExp(obj) {
    return toStr(obj) === "[object RegExp]" && canTrustToString(obj);
  }
  function isError(obj) {
    return toStr(obj) === "[object Error]" && canTrustToString(obj);
  }
  function isString(obj) {
    return toStr(obj) === "[object String]" && canTrustToString(obj);
  }
  function isNumber(obj) {
    return toStr(obj) === "[object Number]" && canTrustToString(obj);
  }
  function isBoolean(obj) {
    return toStr(obj) === "[object Boolean]" && canTrustToString(obj);
  }
  function isSymbol(obj) {
    if (hasShammedSymbols) {
      return obj && typeof obj === "object" && obj instanceof Symbol;
    }
    if (typeof obj === "symbol") {
      return true;
    }
    if (!obj || typeof obj !== "object" || !symToString) {
      return false;
    }
    try {
      symToString.call(obj);
      return true;
    } catch (e) {
    }
    return false;
  }
  function isBigInt(obj) {
    if (!obj || typeof obj !== "object" || !bigIntValueOf) {
      return false;
    }
    try {
      bigIntValueOf.call(obj);
      return true;
    } catch (e) {
    }
    return false;
  }
  var hasOwn = Object.prototype.hasOwnProperty || function(key) {
    return key in this;
  };
  function has(obj, key) {
    return hasOwn.call(obj, key);
  }
  function toStr(obj) {
    return objectToString.call(obj);
  }
  function nameOf(f) {
    if (f.name) {
      return f.name;
    }
    var m = $match.call(functionToString.call(f), /^function\s*([\w$]+)/);
    if (m) {
      return m[1];
    }
    return null;
  }
  function indexOf(xs, x) {
    if (xs.indexOf) {
      return xs.indexOf(x);
    }
    for (var i = 0, l = xs.length; i < l; i++) {
      if (xs[i] === x) {
        return i;
      }
    }
    return -1;
  }
  function isMap(x) {
    if (!mapSize || !x || typeof x !== "object") {
      return false;
    }
    try {
      mapSize.call(x);
      try {
        setSize.call(x);
      } catch (s) {
        return true;
      }
      return x instanceof Map;
    } catch (e) {
    }
    return false;
  }
  function isWeakMap(x) {
    if (!weakMapHas || !x || typeof x !== "object") {
      return false;
    }
    try {
      weakMapHas.call(x, weakMapHas);
      try {
        weakSetHas.call(x, weakSetHas);
      } catch (s) {
        return true;
      }
      return x instanceof WeakMap;
    } catch (e) {
    }
    return false;
  }
  function isWeakRef(x) {
    if (!weakRefDeref || !x || typeof x !== "object") {
      return false;
    }
    try {
      weakRefDeref.call(x);
      return true;
    } catch (e) {
    }
    return false;
  }
  function isSet(x) {
    if (!setSize || !x || typeof x !== "object") {
      return false;
    }
    try {
      setSize.call(x);
      try {
        mapSize.call(x);
      } catch (m) {
        return true;
      }
      return x instanceof Set;
    } catch (e) {
    }
    return false;
  }
  function isWeakSet(x) {
    if (!weakSetHas || !x || typeof x !== "object") {
      return false;
    }
    try {
      weakSetHas.call(x, weakSetHas);
      try {
        weakMapHas.call(x, weakMapHas);
      } catch (s) {
        return true;
      }
      return x instanceof WeakSet;
    } catch (e) {
    }
    return false;
  }
  function isElement(x) {
    if (!x || typeof x !== "object") {
      return false;
    }
    if (typeof HTMLElement !== "undefined" && x instanceof HTMLElement) {
      return true;
    }
    return typeof x.nodeName === "string" && typeof x.getAttribute === "function";
  }
  function inspectString(str, opts) {
    if (str.length > opts.maxStringLength) {
      var remaining = str.length - opts.maxStringLength;
      var trailer = "... " + remaining + " more character" + (remaining > 1 ? "s" : "");
      return inspectString($slice.call(str, 0, opts.maxStringLength), opts) + trailer;
    }
    var quoteRE = quoteREs[opts.quoteStyle || "single"];
    quoteRE.lastIndex = 0;
    var s = $replace.call($replace.call(str, quoteRE, "\\$1"), /[\x00-\x1f]/g, lowbyte);
    return wrapQuotes(s, "single", opts);
  }
  function lowbyte(c) {
    var n = c.charCodeAt(0);
    var x = {
      8: "b",
      9: "t",
      10: "n",
      12: "f",
      13: "r"
    }[n];
    if (x) {
      return "\\" + x;
    }
    return "\\x" + (n < 16 ? "0" : "") + $toUpperCase.call(n.toString(16));
  }
  function markBoxed(str) {
    return "Object(" + str + ")";
  }
  function weakCollectionOf(type2) {
    return type2 + " { ? }";
  }
  function collectionOf(type2, size, entries, indent) {
    var joinedEntries = indent ? indentedJoin(entries, indent) : $join.call(entries, ", ");
    return type2 + " (" + size + ") {" + joinedEntries + "}";
  }
  function singleLineValues(xs) {
    for (var i = 0; i < xs.length; i++) {
      if (indexOf(xs[i], "\n") >= 0) {
        return false;
      }
    }
    return true;
  }
  function getIndent(opts, depth) {
    var baseIndent;
    if (opts.indent === "	") {
      baseIndent = "	";
    } else if (typeof opts.indent === "number" && opts.indent > 0) {
      baseIndent = $join.call(Array(opts.indent + 1), " ");
    } else {
      return null;
    }
    return {
      base: baseIndent,
      prev: $join.call(Array(depth + 1), baseIndent)
    };
  }
  function indentedJoin(xs, indent) {
    if (xs.length === 0) {
      return "";
    }
    var lineJoiner = "\n" + indent.prev + indent.base;
    return lineJoiner + $join.call(xs, "," + lineJoiner) + "\n" + indent.prev;
  }
  function arrObjKeys(obj, inspect) {
    var isArr = isArray(obj);
    var xs = [];
    if (isArr) {
      xs.length = obj.length;
      for (var i = 0; i < obj.length; i++) {
        xs[i] = has(obj, i) ? inspect(obj[i], obj) : "";
      }
    }
    var syms = typeof gOPS === "function" ? gOPS(obj) : [];
    var symMap;
    if (hasShammedSymbols) {
      symMap = {};
      for (var k = 0; k < syms.length; k++) {
        symMap["$" + syms[k]] = syms[k];
      }
    }
    for (var key in obj) {
      if (!has(obj, key)) {
        continue;
      }
      if (isArr && String(Number(key)) === key && key < obj.length) {
        continue;
      }
      if (hasShammedSymbols && symMap["$" + key] instanceof Symbol) {
        continue;
      } else if ($test.call(/[^\w$]/, key)) {
        xs.push(inspect(key, obj) + ": " + inspect(obj[key], obj));
      } else {
        xs.push(key + ": " + inspect(obj[key], obj));
      }
    }
    if (typeof gOPS === "function") {
      for (var j = 0; j < syms.length; j++) {
        if (isEnumerable.call(obj, syms[j])) {
          xs.push("[" + inspect(syms[j]) + "]: " + inspect(obj[syms[j]], obj));
        }
      }
    }
    return xs;
  }
  return objectInspect;
}
var sideChannelList;
var hasRequiredSideChannelList;
function requireSideChannelList() {
  if (hasRequiredSideChannelList) return sideChannelList;
  hasRequiredSideChannelList = 1;
  var inspect = /* @__PURE__ */ requireObjectInspect();
  var $TypeError = /* @__PURE__ */ requireType();
  var listGetNode = function(list, key, isDelete) {
    var prev = list;
    var curr;
    for (; (curr = prev.next) != null; prev = curr) {
      if (curr.key === key) {
        prev.next = curr.next;
        if (!isDelete) {
          curr.next = /** @type {NonNullable<typeof list.next>} */
          list.next;
          list.next = curr;
        }
        return curr;
      }
    }
  };
  var listGet = function(objects, key) {
    if (!objects) {
      return void 0;
    }
    var node = listGetNode(objects, key);
    return node && node.value;
  };
  var listSet = function(objects, key, value) {
    var node = listGetNode(objects, key);
    if (node) {
      node.value = value;
    } else {
      objects.next = /** @type {import('./list.d.ts').ListNode<typeof value, typeof key>} */
      {
        // eslint-disable-line no-param-reassign, no-extra-parens
        key,
        next: objects.next,
        value
      };
    }
  };
  var listHas = function(objects, key) {
    if (!objects) {
      return false;
    }
    return !!listGetNode(objects, key);
  };
  var listDelete = function(objects, key) {
    if (objects) {
      return listGetNode(objects, key, true);
    }
  };
  sideChannelList = function getSideChannelList() {
    var $o;
    var channel = {
      assert: function(key) {
        if (!channel.has(key)) {
          throw new $TypeError("Side channel does not contain " + inspect(key));
        }
      },
      "delete": function(key) {
        var root = $o && $o.next;
        var deletedNode = listDelete($o, key);
        if (deletedNode && root && root === deletedNode) {
          $o = void 0;
        }
        return !!deletedNode;
      },
      get: function(key) {
        return listGet($o, key);
      },
      has: function(key) {
        return listHas($o, key);
      },
      set: function(key, value) {
        if (!$o) {
          $o = {
            next: void 0
          };
        }
        listSet(
          /** @type {NonNullable<typeof $o>} */
          $o,
          key,
          value
        );
      }
    };
    return channel;
  };
  return sideChannelList;
}
var esObjectAtoms;
var hasRequiredEsObjectAtoms;
function requireEsObjectAtoms() {
  if (hasRequiredEsObjectAtoms) return esObjectAtoms;
  hasRequiredEsObjectAtoms = 1;
  esObjectAtoms = Object;
  return esObjectAtoms;
}
var esErrors;
var hasRequiredEsErrors;
function requireEsErrors() {
  if (hasRequiredEsErrors) return esErrors;
  hasRequiredEsErrors = 1;
  esErrors = Error;
  return esErrors;
}
var _eval;
var hasRequired_eval;
function require_eval() {
  if (hasRequired_eval) return _eval;
  hasRequired_eval = 1;
  _eval = EvalError;
  return _eval;
}
var range;
var hasRequiredRange;
function requireRange() {
  if (hasRequiredRange) return range;
  hasRequiredRange = 1;
  range = RangeError;
  return range;
}
var ref;
var hasRequiredRef;
function requireRef() {
  if (hasRequiredRef) return ref;
  hasRequiredRef = 1;
  ref = ReferenceError;
  return ref;
}
var syntax;
var hasRequiredSyntax;
function requireSyntax() {
  if (hasRequiredSyntax) return syntax;
  hasRequiredSyntax = 1;
  syntax = SyntaxError;
  return syntax;
}
var uri;
var hasRequiredUri;
function requireUri() {
  if (hasRequiredUri) return uri;
  hasRequiredUri = 1;
  uri = URIError;
  return uri;
}
var abs;
var hasRequiredAbs;
function requireAbs() {
  if (hasRequiredAbs) return abs;
  hasRequiredAbs = 1;
  abs = Math.abs;
  return abs;
}
var floor;
var hasRequiredFloor;
function requireFloor() {
  if (hasRequiredFloor) return floor;
  hasRequiredFloor = 1;
  floor = Math.floor;
  return floor;
}
var max;
var hasRequiredMax;
function requireMax() {
  if (hasRequiredMax) return max;
  hasRequiredMax = 1;
  max = Math.max;
  return max;
}
var min;
var hasRequiredMin;
function requireMin() {
  if (hasRequiredMin) return min;
  hasRequiredMin = 1;
  min = Math.min;
  return min;
}
var pow;
var hasRequiredPow;
function requirePow() {
  if (hasRequiredPow) return pow;
  hasRequiredPow = 1;
  pow = Math.pow;
  return pow;
}
var round;
var hasRequiredRound;
function requireRound() {
  if (hasRequiredRound) return round;
  hasRequiredRound = 1;
  round = Math.round;
  return round;
}
var _isNaN;
var hasRequired_isNaN;
function require_isNaN() {
  if (hasRequired_isNaN) return _isNaN;
  hasRequired_isNaN = 1;
  _isNaN = Number.isNaN || function isNaN2(a) {
    return a !== a;
  };
  return _isNaN;
}
var sign;
var hasRequiredSign;
function requireSign() {
  if (hasRequiredSign) return sign;
  hasRequiredSign = 1;
  var $isNaN = /* @__PURE__ */ require_isNaN();
  sign = function sign2(number) {
    if ($isNaN(number) || number === 0) {
      return number;
    }
    return number < 0 ? -1 : 1;
  };
  return sign;
}
var gOPD;
var hasRequiredGOPD;
function requireGOPD() {
  if (hasRequiredGOPD) return gOPD;
  hasRequiredGOPD = 1;
  gOPD = Object.getOwnPropertyDescriptor;
  return gOPD;
}
var gopd;
var hasRequiredGopd;
function requireGopd() {
  if (hasRequiredGopd) return gopd;
  hasRequiredGopd = 1;
  var $gOPD = /* @__PURE__ */ requireGOPD();
  if ($gOPD) {
    try {
      $gOPD([], "length");
    } catch (e) {
      $gOPD = null;
    }
  }
  gopd = $gOPD;
  return gopd;
}
var esDefineProperty;
var hasRequiredEsDefineProperty;
function requireEsDefineProperty() {
  if (hasRequiredEsDefineProperty) return esDefineProperty;
  hasRequiredEsDefineProperty = 1;
  var $defineProperty = Object.defineProperty || false;
  if ($defineProperty) {
    try {
      $defineProperty({}, "a", { value: 1 });
    } catch (e) {
      $defineProperty = false;
    }
  }
  esDefineProperty = $defineProperty;
  return esDefineProperty;
}
var shams;
var hasRequiredShams;
function requireShams() {
  if (hasRequiredShams) return shams;
  hasRequiredShams = 1;
  shams = function hasSymbols2() {
    if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") {
      return false;
    }
    if (typeof Symbol.iterator === "symbol") {
      return true;
    }
    var obj = {};
    var sym = Symbol("test");
    var symObj = Object(sym);
    if (typeof sym === "string") {
      return false;
    }
    if (Object.prototype.toString.call(sym) !== "[object Symbol]") {
      return false;
    }
    if (Object.prototype.toString.call(symObj) !== "[object Symbol]") {
      return false;
    }
    var symVal = 42;
    obj[sym] = symVal;
    for (var _ in obj) {
      return false;
    }
    if (typeof Object.keys === "function" && Object.keys(obj).length !== 0) {
      return false;
    }
    if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj).length !== 0) {
      return false;
    }
    var syms = Object.getOwnPropertySymbols(obj);
    if (syms.length !== 1 || syms[0] !== sym) {
      return false;
    }
    if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
      return false;
    }
    if (typeof Object.getOwnPropertyDescriptor === "function") {
      var descriptor = (
        /** @type {PropertyDescriptor} */
        Object.getOwnPropertyDescriptor(obj, sym)
      );
      if (descriptor.value !== symVal || descriptor.enumerable !== true) {
        return false;
      }
    }
    return true;
  };
  return shams;
}
var hasSymbols;
var hasRequiredHasSymbols;
function requireHasSymbols() {
  if (hasRequiredHasSymbols) return hasSymbols;
  hasRequiredHasSymbols = 1;
  var origSymbol = typeof Symbol !== "undefined" && Symbol;
  var hasSymbolSham = requireShams();
  hasSymbols = function hasNativeSymbols() {
    if (typeof origSymbol !== "function") {
      return false;
    }
    if (typeof Symbol !== "function") {
      return false;
    }
    if (typeof origSymbol("foo") !== "symbol") {
      return false;
    }
    if (typeof Symbol("bar") !== "symbol") {
      return false;
    }
    return hasSymbolSham();
  };
  return hasSymbols;
}
var Reflect_getPrototypeOf;
var hasRequiredReflect_getPrototypeOf;
function requireReflect_getPrototypeOf() {
  if (hasRequiredReflect_getPrototypeOf) return Reflect_getPrototypeOf;
  hasRequiredReflect_getPrototypeOf = 1;
  Reflect_getPrototypeOf = typeof Reflect !== "undefined" && Reflect.getPrototypeOf || null;
  return Reflect_getPrototypeOf;
}
var Object_getPrototypeOf;
var hasRequiredObject_getPrototypeOf;
function requireObject_getPrototypeOf() {
  if (hasRequiredObject_getPrototypeOf) return Object_getPrototypeOf;
  hasRequiredObject_getPrototypeOf = 1;
  var $Object = /* @__PURE__ */ requireEsObjectAtoms();
  Object_getPrototypeOf = $Object.getPrototypeOf || null;
  return Object_getPrototypeOf;
}
var implementation;
var hasRequiredImplementation;
function requireImplementation() {
  if (hasRequiredImplementation) return implementation;
  hasRequiredImplementation = 1;
  var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
  var toStr = Object.prototype.toString;
  var max2 = Math.max;
  var funcType = "[object Function]";
  var concatty = function concatty2(a, b) {
    var arr = [];
    for (var i = 0; i < a.length; i += 1) {
      arr[i] = a[i];
    }
    for (var j = 0; j < b.length; j += 1) {
      arr[j + a.length] = b[j];
    }
    return arr;
  };
  var slicy = function slicy2(arrLike, offset) {
    var arr = [];
    for (var i = offset, j = 0; i < arrLike.length; i += 1, j += 1) {
      arr[j] = arrLike[i];
    }
    return arr;
  };
  var joiny = function(arr, joiner) {
    var str = "";
    for (var i = 0; i < arr.length; i += 1) {
      str += arr[i];
      if (i + 1 < arr.length) {
        str += joiner;
      }
    }
    return str;
  };
  implementation = function bind(that) {
    var target = this;
    if (typeof target !== "function" || toStr.apply(target) !== funcType) {
      throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slicy(arguments, 1);
    var bound;
    var binder = function() {
      if (this instanceof bound) {
        var result = target.apply(
          this,
          concatty(args, arguments)
        );
        if (Object(result) === result) {
          return result;
        }
        return this;
      }
      return target.apply(
        that,
        concatty(args, arguments)
      );
    };
    var boundLength = max2(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
      boundArgs[i] = "$" + i;
    }
    bound = Function("binder", "return function (" + joiny(boundArgs, ",") + "){ return binder.apply(this,arguments); }")(binder);
    if (target.prototype) {
      var Empty = function Empty2() {
      };
      Empty.prototype = target.prototype;
      bound.prototype = new Empty();
      Empty.prototype = null;
    }
    return bound;
  };
  return implementation;
}
var functionBind;
var hasRequiredFunctionBind;
function requireFunctionBind() {
  if (hasRequiredFunctionBind) return functionBind;
  hasRequiredFunctionBind = 1;
  var implementation2 = requireImplementation();
  functionBind = Function.prototype.bind || implementation2;
  return functionBind;
}
var functionCall;
var hasRequiredFunctionCall;
function requireFunctionCall() {
  if (hasRequiredFunctionCall) return functionCall;
  hasRequiredFunctionCall = 1;
  functionCall = Function.prototype.call;
  return functionCall;
}
var functionApply;
var hasRequiredFunctionApply;
function requireFunctionApply() {
  if (hasRequiredFunctionApply) return functionApply;
  hasRequiredFunctionApply = 1;
  functionApply = Function.prototype.apply;
  return functionApply;
}
var reflectApply;
var hasRequiredReflectApply;
function requireReflectApply() {
  if (hasRequiredReflectApply) return reflectApply;
  hasRequiredReflectApply = 1;
  reflectApply = typeof Reflect !== "undefined" && Reflect && Reflect.apply;
  return reflectApply;
}
var actualApply;
var hasRequiredActualApply;
function requireActualApply() {
  if (hasRequiredActualApply) return actualApply;
  hasRequiredActualApply = 1;
  var bind = requireFunctionBind();
  var $apply = requireFunctionApply();
  var $call = requireFunctionCall();
  var $reflectApply = requireReflectApply();
  actualApply = $reflectApply || bind.call($call, $apply);
  return actualApply;
}
var callBindApplyHelpers;
var hasRequiredCallBindApplyHelpers;
function requireCallBindApplyHelpers() {
  if (hasRequiredCallBindApplyHelpers) return callBindApplyHelpers;
  hasRequiredCallBindApplyHelpers = 1;
  var bind = requireFunctionBind();
  var $TypeError = /* @__PURE__ */ requireType();
  var $call = requireFunctionCall();
  var $actualApply = requireActualApply();
  callBindApplyHelpers = function callBindBasic(args) {
    if (args.length < 1 || typeof args[0] !== "function") {
      throw new $TypeError("a function is required");
    }
    return $actualApply(bind, $call, args);
  };
  return callBindApplyHelpers;
}
var get;
var hasRequiredGet;
function requireGet() {
  if (hasRequiredGet) return get;
  hasRequiredGet = 1;
  var callBind = requireCallBindApplyHelpers();
  var gOPD2 = /* @__PURE__ */ requireGopd();
  var hasProtoAccessor;
  try {
    hasProtoAccessor = /** @type {{ __proto__?: typeof Array.prototype }} */
    [].__proto__ === Array.prototype;
  } catch (e) {
    if (!e || typeof e !== "object" || !("code" in e) || e.code !== "ERR_PROTO_ACCESS") {
      throw e;
    }
  }
  var desc = !!hasProtoAccessor && gOPD2 && gOPD2(
    Object.prototype,
    /** @type {keyof typeof Object.prototype} */
    "__proto__"
  );
  var $Object = Object;
  var $getPrototypeOf = $Object.getPrototypeOf;
  get = desc && typeof desc.get === "function" ? callBind([desc.get]) : typeof $getPrototypeOf === "function" ? (
    /** @type {import('./get')} */
    function getDunder(value) {
      return $getPrototypeOf(value == null ? value : $Object(value));
    }
  ) : false;
  return get;
}
var getProto;
var hasRequiredGetProto;
function requireGetProto() {
  if (hasRequiredGetProto) return getProto;
  hasRequiredGetProto = 1;
  var reflectGetProto = requireReflect_getPrototypeOf();
  var originalGetProto = requireObject_getPrototypeOf();
  var getDunderProto = /* @__PURE__ */ requireGet();
  getProto = reflectGetProto ? function getProto2(O) {
    return reflectGetProto(O);
  } : originalGetProto ? function getProto2(O) {
    if (!O || typeof O !== "object" && typeof O !== "function") {
      throw new TypeError("getProto: not an object");
    }
    return originalGetProto(O);
  } : getDunderProto ? function getProto2(O) {
    return getDunderProto(O);
  } : null;
  return getProto;
}
var hasown;
var hasRequiredHasown;
function requireHasown() {
  if (hasRequiredHasown) return hasown;
  hasRequiredHasown = 1;
  var call = Function.prototype.call;
  var $hasOwn = Object.prototype.hasOwnProperty;
  var bind = requireFunctionBind();
  hasown = bind.call(call, $hasOwn);
  return hasown;
}
var getIntrinsic;
var hasRequiredGetIntrinsic;
function requireGetIntrinsic() {
  if (hasRequiredGetIntrinsic) return getIntrinsic;
  hasRequiredGetIntrinsic = 1;
  var undefined$1;
  var $Object = /* @__PURE__ */ requireEsObjectAtoms();
  var $Error = /* @__PURE__ */ requireEsErrors();
  var $EvalError = /* @__PURE__ */ require_eval();
  var $RangeError = /* @__PURE__ */ requireRange();
  var $ReferenceError = /* @__PURE__ */ requireRef();
  var $SyntaxError = /* @__PURE__ */ requireSyntax();
  var $TypeError = /* @__PURE__ */ requireType();
  var $URIError = /* @__PURE__ */ requireUri();
  var abs2 = /* @__PURE__ */ requireAbs();
  var floor2 = /* @__PURE__ */ requireFloor();
  var max2 = /* @__PURE__ */ requireMax();
  var min2 = /* @__PURE__ */ requireMin();
  var pow2 = /* @__PURE__ */ requirePow();
  var round2 = /* @__PURE__ */ requireRound();
  var sign2 = /* @__PURE__ */ requireSign();
  var $Function = Function;
  var getEvalledConstructor = function(expressionSyntax) {
    try {
      return $Function('"use strict"; return (' + expressionSyntax + ").constructor;")();
    } catch (e) {
    }
  };
  var $gOPD = /* @__PURE__ */ requireGopd();
  var $defineProperty = /* @__PURE__ */ requireEsDefineProperty();
  var throwTypeError = function() {
    throw new $TypeError();
  };
  var ThrowTypeError = $gOPD ? (function() {
    try {
      arguments.callee;
      return throwTypeError;
    } catch (calleeThrows) {
      try {
        return $gOPD(arguments, "callee").get;
      } catch (gOPDthrows) {
        return throwTypeError;
      }
    }
  })() : throwTypeError;
  var hasSymbols2 = requireHasSymbols()();
  var getProto2 = requireGetProto();
  var $ObjectGPO = requireObject_getPrototypeOf();
  var $ReflectGPO = requireReflect_getPrototypeOf();
  var $apply = requireFunctionApply();
  var $call = requireFunctionCall();
  var needsEval = {};
  var TypedArray = typeof Uint8Array === "undefined" || !getProto2 ? undefined$1 : getProto2(Uint8Array);
  var INTRINSICS = {
    __proto__: null,
    "%AggregateError%": typeof AggregateError === "undefined" ? undefined$1 : AggregateError,
    "%Array%": Array,
    "%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? undefined$1 : ArrayBuffer,
    "%ArrayIteratorPrototype%": hasSymbols2 && getProto2 ? getProto2([][Symbol.iterator]()) : undefined$1,
    "%AsyncFromSyncIteratorPrototype%": undefined$1,
    "%AsyncFunction%": needsEval,
    "%AsyncGenerator%": needsEval,
    "%AsyncGeneratorFunction%": needsEval,
    "%AsyncIteratorPrototype%": needsEval,
    "%Atomics%": typeof Atomics === "undefined" ? undefined$1 : Atomics,
    "%BigInt%": typeof BigInt === "undefined" ? undefined$1 : BigInt,
    "%BigInt64Array%": typeof BigInt64Array === "undefined" ? undefined$1 : BigInt64Array,
    "%BigUint64Array%": typeof BigUint64Array === "undefined" ? undefined$1 : BigUint64Array,
    "%Boolean%": Boolean,
    "%DataView%": typeof DataView === "undefined" ? undefined$1 : DataView,
    "%Date%": Date,
    "%decodeURI%": decodeURI,
    "%decodeURIComponent%": decodeURIComponent,
    "%encodeURI%": encodeURI,
    "%encodeURIComponent%": encodeURIComponent,
    "%Error%": $Error,
    "%eval%": eval,
    // eslint-disable-line no-eval
    "%EvalError%": $EvalError,
    "%Float16Array%": typeof Float16Array === "undefined" ? undefined$1 : Float16Array,
    "%Float32Array%": typeof Float32Array === "undefined" ? undefined$1 : Float32Array,
    "%Float64Array%": typeof Float64Array === "undefined" ? undefined$1 : Float64Array,
    "%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? undefined$1 : FinalizationRegistry,
    "%Function%": $Function,
    "%GeneratorFunction%": needsEval,
    "%Int8Array%": typeof Int8Array === "undefined" ? undefined$1 : Int8Array,
    "%Int16Array%": typeof Int16Array === "undefined" ? undefined$1 : Int16Array,
    "%Int32Array%": typeof Int32Array === "undefined" ? undefined$1 : Int32Array,
    "%isFinite%": isFinite,
    "%isNaN%": isNaN,
    "%IteratorPrototype%": hasSymbols2 && getProto2 ? getProto2(getProto2([][Symbol.iterator]())) : undefined$1,
    "%JSON%": typeof JSON === "object" ? JSON : undefined$1,
    "%Map%": typeof Map === "undefined" ? undefined$1 : Map,
    "%MapIteratorPrototype%": typeof Map === "undefined" || !hasSymbols2 || !getProto2 ? undefined$1 : getProto2((/* @__PURE__ */ new Map())[Symbol.iterator]()),
    "%Math%": Math,
    "%Number%": Number,
    "%Object%": $Object,
    "%Object.getOwnPropertyDescriptor%": $gOPD,
    "%parseFloat%": parseFloat,
    "%parseInt%": parseInt,
    "%Promise%": typeof Promise === "undefined" ? undefined$1 : Promise,
    "%Proxy%": typeof Proxy === "undefined" ? undefined$1 : Proxy,
    "%RangeError%": $RangeError,
    "%ReferenceError%": $ReferenceError,
    "%Reflect%": typeof Reflect === "undefined" ? undefined$1 : Reflect,
    "%RegExp%": RegExp,
    "%Set%": typeof Set === "undefined" ? undefined$1 : Set,
    "%SetIteratorPrototype%": typeof Set === "undefined" || !hasSymbols2 || !getProto2 ? undefined$1 : getProto2((/* @__PURE__ */ new Set())[Symbol.iterator]()),
    "%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? undefined$1 : SharedArrayBuffer,
    "%String%": String,
    "%StringIteratorPrototype%": hasSymbols2 && getProto2 ? getProto2(""[Symbol.iterator]()) : undefined$1,
    "%Symbol%": hasSymbols2 ? Symbol : undefined$1,
    "%SyntaxError%": $SyntaxError,
    "%ThrowTypeError%": ThrowTypeError,
    "%TypedArray%": TypedArray,
    "%TypeError%": $TypeError,
    "%Uint8Array%": typeof Uint8Array === "undefined" ? undefined$1 : Uint8Array,
    "%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? undefined$1 : Uint8ClampedArray,
    "%Uint16Array%": typeof Uint16Array === "undefined" ? undefined$1 : Uint16Array,
    "%Uint32Array%": typeof Uint32Array === "undefined" ? undefined$1 : Uint32Array,
    "%URIError%": $URIError,
    "%WeakMap%": typeof WeakMap === "undefined" ? undefined$1 : WeakMap,
    "%WeakRef%": typeof WeakRef === "undefined" ? undefined$1 : WeakRef,
    "%WeakSet%": typeof WeakSet === "undefined" ? undefined$1 : WeakSet,
    "%Function.prototype.call%": $call,
    "%Function.prototype.apply%": $apply,
    "%Object.defineProperty%": $defineProperty,
    "%Object.getPrototypeOf%": $ObjectGPO,
    "%Math.abs%": abs2,
    "%Math.floor%": floor2,
    "%Math.max%": max2,
    "%Math.min%": min2,
    "%Math.pow%": pow2,
    "%Math.round%": round2,
    "%Math.sign%": sign2,
    "%Reflect.getPrototypeOf%": $ReflectGPO
  };
  if (getProto2) {
    try {
      null.error;
    } catch (e) {
      var errorProto = getProto2(getProto2(e));
      INTRINSICS["%Error.prototype%"] = errorProto;
    }
  }
  var doEval = function doEval2(name) {
    var value;
    if (name === "%AsyncFunction%") {
      value = getEvalledConstructor("async function () {}");
    } else if (name === "%GeneratorFunction%") {
      value = getEvalledConstructor("function* () {}");
    } else if (name === "%AsyncGeneratorFunction%") {
      value = getEvalledConstructor("async function* () {}");
    } else if (name === "%AsyncGenerator%") {
      var fn = doEval2("%AsyncGeneratorFunction%");
      if (fn) {
        value = fn.prototype;
      }
    } else if (name === "%AsyncIteratorPrototype%") {
      var gen = doEval2("%AsyncGenerator%");
      if (gen && getProto2) {
        value = getProto2(gen.prototype);
      }
    }
    INTRINSICS[name] = value;
    return value;
  };
  var LEGACY_ALIASES = {
    __proto__: null,
    "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
    "%ArrayPrototype%": ["Array", "prototype"],
    "%ArrayProto_entries%": ["Array", "prototype", "entries"],
    "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
    "%ArrayProto_keys%": ["Array", "prototype", "keys"],
    "%ArrayProto_values%": ["Array", "prototype", "values"],
    "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
    "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
    "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
    "%BooleanPrototype%": ["Boolean", "prototype"],
    "%DataViewPrototype%": ["DataView", "prototype"],
    "%DatePrototype%": ["Date", "prototype"],
    "%ErrorPrototype%": ["Error", "prototype"],
    "%EvalErrorPrototype%": ["EvalError", "prototype"],
    "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
    "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
    "%FunctionPrototype%": ["Function", "prototype"],
    "%Generator%": ["GeneratorFunction", "prototype"],
    "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
    "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
    "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
    "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
    "%JSONParse%": ["JSON", "parse"],
    "%JSONStringify%": ["JSON", "stringify"],
    "%MapPrototype%": ["Map", "prototype"],
    "%NumberPrototype%": ["Number", "prototype"],
    "%ObjectPrototype%": ["Object", "prototype"],
    "%ObjProto_toString%": ["Object", "prototype", "toString"],
    "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
    "%PromisePrototype%": ["Promise", "prototype"],
    "%PromiseProto_then%": ["Promise", "prototype", "then"],
    "%Promise_all%": ["Promise", "all"],
    "%Promise_reject%": ["Promise", "reject"],
    "%Promise_resolve%": ["Promise", "resolve"],
    "%RangeErrorPrototype%": ["RangeError", "prototype"],
    "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
    "%RegExpPrototype%": ["RegExp", "prototype"],
    "%SetPrototype%": ["Set", "prototype"],
    "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
    "%StringPrototype%": ["String", "prototype"],
    "%SymbolPrototype%": ["Symbol", "prototype"],
    "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
    "%TypedArrayPrototype%": ["TypedArray", "prototype"],
    "%TypeErrorPrototype%": ["TypeError", "prototype"],
    "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
    "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
    "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
    "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
    "%URIErrorPrototype%": ["URIError", "prototype"],
    "%WeakMapPrototype%": ["WeakMap", "prototype"],
    "%WeakSetPrototype%": ["WeakSet", "prototype"]
  };
  var bind = requireFunctionBind();
  var hasOwn = /* @__PURE__ */ requireHasown();
  var $concat = bind.call($call, Array.prototype.concat);
  var $spliceApply = bind.call($apply, Array.prototype.splice);
  var $replace = bind.call($call, String.prototype.replace);
  var $strSlice = bind.call($call, String.prototype.slice);
  var $exec = bind.call($call, RegExp.prototype.exec);
  var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
  var reEscapeChar = /\\(\\)?/g;
  var stringToPath = function stringToPath2(string) {
    var first = $strSlice(string, 0, 1);
    var last = $strSlice(string, -1);
    if (first === "%" && last !== "%") {
      throw new $SyntaxError("invalid intrinsic syntax, expected closing `%`");
    } else if (last === "%" && first !== "%") {
      throw new $SyntaxError("invalid intrinsic syntax, expected opening `%`");
    }
    var result = [];
    $replace(string, rePropName, function(match, number, quote, subString) {
      result[result.length] = quote ? $replace(subString, reEscapeChar, "$1") : number || match;
    });
    return result;
  };
  var getBaseIntrinsic = function getBaseIntrinsic2(name, allowMissing) {
    var intrinsicName = name;
    var alias;
    if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
      alias = LEGACY_ALIASES[intrinsicName];
      intrinsicName = "%" + alias[0] + "%";
    }
    if (hasOwn(INTRINSICS, intrinsicName)) {
      var value = INTRINSICS[intrinsicName];
      if (value === needsEval) {
        value = doEval(intrinsicName);
      }
      if (typeof value === "undefined" && !allowMissing) {
        throw new $TypeError("intrinsic " + name + " exists, but is not available. Please file an issue!");
      }
      return {
        alias,
        name: intrinsicName,
        value
      };
    }
    throw new $SyntaxError("intrinsic " + name + " does not exist!");
  };
  getIntrinsic = function GetIntrinsic(name, allowMissing) {
    if (typeof name !== "string" || name.length === 0) {
      throw new $TypeError("intrinsic name must be a non-empty string");
    }
    if (arguments.length > 1 && typeof allowMissing !== "boolean") {
      throw new $TypeError('"allowMissing" argument must be a boolean');
    }
    if ($exec(/^%?[^%]*%?$/, name) === null) {
      throw new $SyntaxError("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
    }
    var parts = stringToPath(name);
    var intrinsicBaseName = parts.length > 0 ? parts[0] : "";
    var intrinsic = getBaseIntrinsic("%" + intrinsicBaseName + "%", allowMissing);
    var intrinsicRealName = intrinsic.name;
    var value = intrinsic.value;
    var skipFurtherCaching = false;
    var alias = intrinsic.alias;
    if (alias) {
      intrinsicBaseName = alias[0];
      $spliceApply(parts, $concat([0, 1], alias));
    }
    for (var i = 1, isOwn = true; i < parts.length; i += 1) {
      var part = parts[i];
      var first = $strSlice(part, 0, 1);
      var last = $strSlice(part, -1);
      if ((first === '"' || first === "'" || first === "`" || (last === '"' || last === "'" || last === "`")) && first !== last) {
        throw new $SyntaxError("property names with quotes must have matching quotes");
      }
      if (part === "constructor" || !isOwn) {
        skipFurtherCaching = true;
      }
      intrinsicBaseName += "." + part;
      intrinsicRealName = "%" + intrinsicBaseName + "%";
      if (hasOwn(INTRINSICS, intrinsicRealName)) {
        value = INTRINSICS[intrinsicRealName];
      } else if (value != null) {
        if (!(part in value)) {
          if (!allowMissing) {
            throw new $TypeError("base intrinsic for " + name + " exists, but the property is not available.");
          }
          return void undefined$1;
        }
        if ($gOPD && i + 1 >= parts.length) {
          var desc = $gOPD(value, part);
          isOwn = !!desc;
          if (isOwn && "get" in desc && !("originalValue" in desc.get)) {
            value = desc.get;
          } else {
            value = value[part];
          }
        } else {
          isOwn = hasOwn(value, part);
          value = value[part];
        }
        if (isOwn && !skipFurtherCaching) {
          INTRINSICS[intrinsicRealName] = value;
        }
      }
    }
    return value;
  };
  return getIntrinsic;
}
var callBound;
var hasRequiredCallBound;
function requireCallBound() {
  if (hasRequiredCallBound) return callBound;
  hasRequiredCallBound = 1;
  var GetIntrinsic = /* @__PURE__ */ requireGetIntrinsic();
  var callBindBasic = requireCallBindApplyHelpers();
  var $indexOf = callBindBasic([GetIntrinsic("%String.prototype.indexOf%")]);
  callBound = function callBoundIntrinsic(name, allowMissing) {
    var intrinsic = (
      /** @type {(this: unknown, ...args: unknown[]) => unknown} */
      GetIntrinsic(name, !!allowMissing)
    );
    if (typeof intrinsic === "function" && $indexOf(name, ".prototype.") > -1) {
      return callBindBasic(
        /** @type {const} */
        [intrinsic]
      );
    }
    return intrinsic;
  };
  return callBound;
}
var sideChannelMap;
var hasRequiredSideChannelMap;
function requireSideChannelMap() {
  if (hasRequiredSideChannelMap) return sideChannelMap;
  hasRequiredSideChannelMap = 1;
  var GetIntrinsic = /* @__PURE__ */ requireGetIntrinsic();
  var callBound2 = /* @__PURE__ */ requireCallBound();
  var inspect = /* @__PURE__ */ requireObjectInspect();
  var $TypeError = /* @__PURE__ */ requireType();
  var $Map = GetIntrinsic("%Map%", true);
  var $mapGet = callBound2("Map.prototype.get", true);
  var $mapSet = callBound2("Map.prototype.set", true);
  var $mapHas = callBound2("Map.prototype.has", true);
  var $mapDelete = callBound2("Map.prototype.delete", true);
  var $mapSize = callBound2("Map.prototype.size", true);
  sideChannelMap = !!$Map && /** @type {Exclude<import('.'), false>} */
  function getSideChannelMap() {
    var $m;
    var channel = {
      assert: function(key) {
        if (!channel.has(key)) {
          throw new $TypeError("Side channel does not contain " + inspect(key));
        }
      },
      "delete": function(key) {
        if ($m) {
          var result = $mapDelete($m, key);
          if ($mapSize($m) === 0) {
            $m = void 0;
          }
          return result;
        }
        return false;
      },
      get: function(key) {
        if ($m) {
          return $mapGet($m, key);
        }
      },
      has: function(key) {
        if ($m) {
          return $mapHas($m, key);
        }
        return false;
      },
      set: function(key, value) {
        if (!$m) {
          $m = new $Map();
        }
        $mapSet($m, key, value);
      }
    };
    return channel;
  };
  return sideChannelMap;
}
var sideChannelWeakmap;
var hasRequiredSideChannelWeakmap;
function requireSideChannelWeakmap() {
  if (hasRequiredSideChannelWeakmap) return sideChannelWeakmap;
  hasRequiredSideChannelWeakmap = 1;
  var GetIntrinsic = /* @__PURE__ */ requireGetIntrinsic();
  var callBound2 = /* @__PURE__ */ requireCallBound();
  var inspect = /* @__PURE__ */ requireObjectInspect();
  var getSideChannelMap = requireSideChannelMap();
  var $TypeError = /* @__PURE__ */ requireType();
  var $WeakMap = GetIntrinsic("%WeakMap%", true);
  var $weakMapGet = callBound2("WeakMap.prototype.get", true);
  var $weakMapSet = callBound2("WeakMap.prototype.set", true);
  var $weakMapHas = callBound2("WeakMap.prototype.has", true);
  var $weakMapDelete = callBound2("WeakMap.prototype.delete", true);
  sideChannelWeakmap = $WeakMap ? (
    /** @type {Exclude<import('.'), false>} */
    function getSideChannelWeakMap() {
      var $wm;
      var $m;
      var channel = {
        assert: function(key) {
          if (!channel.has(key)) {
            throw new $TypeError("Side channel does not contain " + inspect(key));
          }
        },
        "delete": function(key) {
          if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
            if ($wm) {
              return $weakMapDelete($wm, key);
            }
          } else if (getSideChannelMap) {
            if ($m) {
              return $m["delete"](key);
            }
          }
          return false;
        },
        get: function(key) {
          if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
            if ($wm) {
              return $weakMapGet($wm, key);
            }
          }
          return $m && $m.get(key);
        },
        has: function(key) {
          if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
            if ($wm) {
              return $weakMapHas($wm, key);
            }
          }
          return !!$m && $m.has(key);
        },
        set: function(key, value) {
          if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
            if (!$wm) {
              $wm = new $WeakMap();
            }
            $weakMapSet($wm, key, value);
          } else if (getSideChannelMap) {
            if (!$m) {
              $m = getSideChannelMap();
            }
            $m.set(key, value);
          }
        }
      };
      return channel;
    }
  ) : getSideChannelMap;
  return sideChannelWeakmap;
}
var sideChannel;
var hasRequiredSideChannel;
function requireSideChannel() {
  if (hasRequiredSideChannel) return sideChannel;
  hasRequiredSideChannel = 1;
  var $TypeError = /* @__PURE__ */ requireType();
  var inspect = /* @__PURE__ */ requireObjectInspect();
  var getSideChannelList = requireSideChannelList();
  var getSideChannelMap = requireSideChannelMap();
  var getSideChannelWeakMap = requireSideChannelWeakmap();
  var makeChannel = getSideChannelWeakMap || getSideChannelMap || getSideChannelList;
  sideChannel = function getSideChannel() {
    var $channelData;
    var channel = {
      assert: function(key) {
        if (!channel.has(key)) {
          throw new $TypeError("Side channel does not contain " + inspect(key));
        }
      },
      "delete": function(key) {
        return !!$channelData && $channelData["delete"](key);
      },
      get: function(key) {
        return $channelData && $channelData.get(key);
      },
      has: function(key) {
        return !!$channelData && $channelData.has(key);
      },
      set: function(key, value) {
        if (!$channelData) {
          $channelData = makeChannel();
        }
        $channelData.set(key, value);
      }
    };
    return channel;
  };
  return sideChannel;
}
var formats;
var hasRequiredFormats;
function requireFormats() {
  if (hasRequiredFormats) return formats;
  hasRequiredFormats = 1;
  var replace = String.prototype.replace;
  var percentTwenties = /%20/g;
  var Format = {
    RFC1738: "RFC1738",
    RFC3986: "RFC3986"
  };
  formats = {
    "default": Format.RFC3986,
    formatters: {
      RFC1738: function(value) {
        return replace.call(value, percentTwenties, "+");
      },
      RFC3986: function(value) {
        return String(value);
      }
    },
    RFC1738: Format.RFC1738,
    RFC3986: Format.RFC3986
  };
  return formats;
}
var utils;
var hasRequiredUtils;
function requireUtils() {
  if (hasRequiredUtils) return utils;
  hasRequiredUtils = 1;
  var formats2 = /* @__PURE__ */ requireFormats();
  var has = Object.prototype.hasOwnProperty;
  var isArray = Array.isArray;
  var hexTable = (function() {
    var array = [];
    for (var i = 0; i < 256; ++i) {
      array.push("%" + ((i < 16 ? "0" : "") + i.toString(16)).toUpperCase());
    }
    return array;
  })();
  var compactQueue = function compactQueue2(queue2) {
    while (queue2.length > 1) {
      var item = queue2.pop();
      var obj = item.obj[item.prop];
      if (isArray(obj)) {
        var compacted = [];
        for (var j = 0; j < obj.length; ++j) {
          if (typeof obj[j] !== "undefined") {
            compacted.push(obj[j]);
          }
        }
        item.obj[item.prop] = compacted;
      }
    }
  };
  var arrayToObject = function arrayToObject2(source, options) {
    var obj = options && options.plainObjects ? { __proto__: null } : {};
    for (var i = 0; i < source.length; ++i) {
      if (typeof source[i] !== "undefined") {
        obj[i] = source[i];
      }
    }
    return obj;
  };
  var merge = function merge2(target, source, options) {
    if (!source) {
      return target;
    }
    if (typeof source !== "object" && typeof source !== "function") {
      if (isArray(target)) {
        target.push(source);
      } else if (target && typeof target === "object") {
        if (options && (options.plainObjects || options.allowPrototypes) || !has.call(Object.prototype, source)) {
          target[source] = true;
        }
      } else {
        return [target, source];
      }
      return target;
    }
    if (!target || typeof target !== "object") {
      return [target].concat(source);
    }
    var mergeTarget = target;
    if (isArray(target) && !isArray(source)) {
      mergeTarget = arrayToObject(target, options);
    }
    if (isArray(target) && isArray(source)) {
      source.forEach(function(item, i) {
        if (has.call(target, i)) {
          var targetItem = target[i];
          if (targetItem && typeof targetItem === "object" && item && typeof item === "object") {
            target[i] = merge2(targetItem, item, options);
          } else {
            target.push(item);
          }
        } else {
          target[i] = item;
        }
      });
      return target;
    }
    return Object.keys(source).reduce(function(acc, key) {
      var value = source[key];
      if (has.call(acc, key)) {
        acc[key] = merge2(acc[key], value, options);
      } else {
        acc[key] = value;
      }
      return acc;
    }, mergeTarget);
  };
  var assign = function assignSingleSource(target, source) {
    return Object.keys(source).reduce(function(acc, key) {
      acc[key] = source[key];
      return acc;
    }, target);
  };
  var decode = function(str, defaultDecoder, charset) {
    var strWithoutPlus = str.replace(/\+/g, " ");
    if (charset === "iso-8859-1") {
      return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
    }
    try {
      return decodeURIComponent(strWithoutPlus);
    } catch (e) {
      return strWithoutPlus;
    }
  };
  var limit = 1024;
  var encode = function encode2(str, defaultEncoder, charset, kind, format) {
    if (str.length === 0) {
      return str;
    }
    var string = str;
    if (typeof str === "symbol") {
      string = Symbol.prototype.toString.call(str);
    } else if (typeof str !== "string") {
      string = String(str);
    }
    if (charset === "iso-8859-1") {
      return escape(string).replace(/%u[0-9a-f]{4}/gi, function($0) {
        return "%26%23" + parseInt($0.slice(2), 16) + "%3B";
      });
    }
    var out = "";
    for (var j = 0; j < string.length; j += limit) {
      var segment = string.length >= limit ? string.slice(j, j + limit) : string;
      var arr = [];
      for (var i = 0; i < segment.length; ++i) {
        var c = segment.charCodeAt(i);
        if (c === 45 || c === 46 || c === 95 || c === 126 || c >= 48 && c <= 57 || c >= 65 && c <= 90 || c >= 97 && c <= 122 || format === formats2.RFC1738 && (c === 40 || c === 41)) {
          arr[arr.length] = segment.charAt(i);
          continue;
        }
        if (c < 128) {
          arr[arr.length] = hexTable[c];
          continue;
        }
        if (c < 2048) {
          arr[arr.length] = hexTable[192 | c >> 6] + hexTable[128 | c & 63];
          continue;
        }
        if (c < 55296 || c >= 57344) {
          arr[arr.length] = hexTable[224 | c >> 12] + hexTable[128 | c >> 6 & 63] + hexTable[128 | c & 63];
          continue;
        }
        i += 1;
        c = 65536 + ((c & 1023) << 10 | segment.charCodeAt(i) & 1023);
        arr[arr.length] = hexTable[240 | c >> 18] + hexTable[128 | c >> 12 & 63] + hexTable[128 | c >> 6 & 63] + hexTable[128 | c & 63];
      }
      out += arr.join("");
    }
    return out;
  };
  var compact = function compact2(value) {
    var queue2 = [{ obj: { o: value }, prop: "o" }];
    var refs = [];
    for (var i = 0; i < queue2.length; ++i) {
      var item = queue2[i];
      var obj = item.obj[item.prop];
      var keys = Object.keys(obj);
      for (var j = 0; j < keys.length; ++j) {
        var key = keys[j];
        var val = obj[key];
        if (typeof val === "object" && val !== null && refs.indexOf(val) === -1) {
          queue2.push({ obj, prop: key });
          refs.push(val);
        }
      }
    }
    compactQueue(queue2);
    return value;
  };
  var isRegExp = function isRegExp2(obj) {
    return Object.prototype.toString.call(obj) === "[object RegExp]";
  };
  var isBuffer = function isBuffer2(obj) {
    if (!obj || typeof obj !== "object") {
      return false;
    }
    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
  };
  var combine = function combine2(a, b) {
    return [].concat(a, b);
  };
  var maybeMap = function maybeMap2(val, fn) {
    if (isArray(val)) {
      var mapped = [];
      for (var i = 0; i < val.length; i += 1) {
        mapped.push(fn(val[i]));
      }
      return mapped;
    }
    return fn(val);
  };
  utils = {
    arrayToObject,
    assign,
    combine,
    compact,
    decode,
    encode,
    isBuffer,
    isRegExp,
    maybeMap,
    merge
  };
  return utils;
}
var stringify_1;
var hasRequiredStringify;
function requireStringify() {
  if (hasRequiredStringify) return stringify_1;
  hasRequiredStringify = 1;
  var getSideChannel = requireSideChannel();
  var utils2 = /* @__PURE__ */ requireUtils();
  var formats2 = /* @__PURE__ */ requireFormats();
  var has = Object.prototype.hasOwnProperty;
  var arrayPrefixGenerators = {
    brackets: function brackets(prefix) {
      return prefix + "[]";
    },
    comma: "comma",
    indices: function indices(prefix, key) {
      return prefix + "[" + key + "]";
    },
    repeat: function repeat(prefix) {
      return prefix;
    }
  };
  var isArray = Array.isArray;
  var push = Array.prototype.push;
  var pushToArray = function(arr, valueOrArray) {
    push.apply(arr, isArray(valueOrArray) ? valueOrArray : [valueOrArray]);
  };
  var toISO = Date.prototype.toISOString;
  var defaultFormat = formats2["default"];
  var defaults = {
    addQueryPrefix: false,
    allowDots: false,
    allowEmptyArrays: false,
    arrayFormat: "indices",
    charset: "utf-8",
    charsetSentinel: false,
    commaRoundTrip: false,
    delimiter: "&",
    encode: true,
    encodeDotInKeys: false,
    encoder: utils2.encode,
    encodeValuesOnly: false,
    filter: void 0,
    format: defaultFormat,
    formatter: formats2.formatters[defaultFormat],
    // deprecated
    indices: false,
    serializeDate: function serializeDate(date) {
      return toISO.call(date);
    },
    skipNulls: false,
    strictNullHandling: false
  };
  var isNonNullishPrimitive = function isNonNullishPrimitive2(v) {
    return typeof v === "string" || typeof v === "number" || typeof v === "boolean" || typeof v === "symbol" || typeof v === "bigint";
  };
  var sentinel = {};
  var stringify = function stringify2(object, prefix, generateArrayPrefix, commaRoundTrip, allowEmptyArrays, strictNullHandling, skipNulls, encodeDotInKeys, encoder, filter, sort, allowDots, serializeDate, format, formatter, encodeValuesOnly, charset, sideChannel2) {
    var obj = object;
    var tmpSc = sideChannel2;
    var step = 0;
    var findFlag = false;
    while ((tmpSc = tmpSc.get(sentinel)) !== void 0 && !findFlag) {
      var pos = tmpSc.get(object);
      step += 1;
      if (typeof pos !== "undefined") {
        if (pos === step) {
          throw new RangeError("Cyclic object value");
        } else {
          findFlag = true;
        }
      }
      if (typeof tmpSc.get(sentinel) === "undefined") {
        step = 0;
      }
    }
    if (typeof filter === "function") {
      obj = filter(prefix, obj);
    } else if (obj instanceof Date) {
      obj = serializeDate(obj);
    } else if (generateArrayPrefix === "comma" && isArray(obj)) {
      obj = utils2.maybeMap(obj, function(value2) {
        if (value2 instanceof Date) {
          return serializeDate(value2);
        }
        return value2;
      });
    }
    if (obj === null) {
      if (strictNullHandling) {
        return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder, charset, "key", format) : prefix;
      }
      obj = "";
    }
    if (isNonNullishPrimitive(obj) || utils2.isBuffer(obj)) {
      if (encoder) {
        var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset, "key", format);
        return [formatter(keyValue) + "=" + formatter(encoder(obj, defaults.encoder, charset, "value", format))];
      }
      return [formatter(prefix) + "=" + formatter(String(obj))];
    }
    var values = [];
    if (typeof obj === "undefined") {
      return values;
    }
    var objKeys;
    if (generateArrayPrefix === "comma" && isArray(obj)) {
      if (encodeValuesOnly && encoder) {
        obj = utils2.maybeMap(obj, encoder);
      }
      objKeys = [{ value: obj.length > 0 ? obj.join(",") || null : void 0 }];
    } else if (isArray(filter)) {
      objKeys = filter;
    } else {
      var keys = Object.keys(obj);
      objKeys = sort ? keys.sort(sort) : keys;
    }
    var encodedPrefix = encodeDotInKeys ? String(prefix).replace(/\./g, "%2E") : String(prefix);
    var adjustedPrefix = commaRoundTrip && isArray(obj) && obj.length === 1 ? encodedPrefix + "[]" : encodedPrefix;
    if (allowEmptyArrays && isArray(obj) && obj.length === 0) {
      return adjustedPrefix + "[]";
    }
    for (var j = 0; j < objKeys.length; ++j) {
      var key = objKeys[j];
      var value = typeof key === "object" && key && typeof key.value !== "undefined" ? key.value : obj[key];
      if (skipNulls && value === null) {
        continue;
      }
      var encodedKey = allowDots && encodeDotInKeys ? String(key).replace(/\./g, "%2E") : String(key);
      var keyPrefix = isArray(obj) ? typeof generateArrayPrefix === "function" ? generateArrayPrefix(adjustedPrefix, encodedKey) : adjustedPrefix : adjustedPrefix + (allowDots ? "." + encodedKey : "[" + encodedKey + "]");
      sideChannel2.set(object, step);
      var valueSideChannel = getSideChannel();
      valueSideChannel.set(sentinel, sideChannel2);
      pushToArray(values, stringify2(
        value,
        keyPrefix,
        generateArrayPrefix,
        commaRoundTrip,
        allowEmptyArrays,
        strictNullHandling,
        skipNulls,
        encodeDotInKeys,
        generateArrayPrefix === "comma" && encodeValuesOnly && isArray(obj) ? null : encoder,
        filter,
        sort,
        allowDots,
        serializeDate,
        format,
        formatter,
        encodeValuesOnly,
        charset,
        valueSideChannel
      ));
    }
    return values;
  };
  var normalizeStringifyOptions = function normalizeStringifyOptions2(opts) {
    if (!opts) {
      return defaults;
    }
    if (typeof opts.allowEmptyArrays !== "undefined" && typeof opts.allowEmptyArrays !== "boolean") {
      throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
    }
    if (typeof opts.encodeDotInKeys !== "undefined" && typeof opts.encodeDotInKeys !== "boolean") {
      throw new TypeError("`encodeDotInKeys` option can only be `true` or `false`, when provided");
    }
    if (opts.encoder !== null && typeof opts.encoder !== "undefined" && typeof opts.encoder !== "function") {
      throw new TypeError("Encoder has to be a function.");
    }
    var charset = opts.charset || defaults.charset;
    if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") {
      throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
    }
    var format = formats2["default"];
    if (typeof opts.format !== "undefined") {
      if (!has.call(formats2.formatters, opts.format)) {
        throw new TypeError("Unknown format option provided.");
      }
      format = opts.format;
    }
    var formatter = formats2.formatters[format];
    var filter = defaults.filter;
    if (typeof opts.filter === "function" || isArray(opts.filter)) {
      filter = opts.filter;
    }
    var arrayFormat;
    if (opts.arrayFormat in arrayPrefixGenerators) {
      arrayFormat = opts.arrayFormat;
    } else if ("indices" in opts) {
      arrayFormat = opts.indices ? "indices" : "repeat";
    } else {
      arrayFormat = defaults.arrayFormat;
    }
    if ("commaRoundTrip" in opts && typeof opts.commaRoundTrip !== "boolean") {
      throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
    }
    var allowDots = typeof opts.allowDots === "undefined" ? opts.encodeDotInKeys === true ? true : defaults.allowDots : !!opts.allowDots;
    return {
      addQueryPrefix: typeof opts.addQueryPrefix === "boolean" ? opts.addQueryPrefix : defaults.addQueryPrefix,
      allowDots,
      allowEmptyArrays: typeof opts.allowEmptyArrays === "boolean" ? !!opts.allowEmptyArrays : defaults.allowEmptyArrays,
      arrayFormat,
      charset,
      charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults.charsetSentinel,
      commaRoundTrip: !!opts.commaRoundTrip,
      delimiter: typeof opts.delimiter === "undefined" ? defaults.delimiter : opts.delimiter,
      encode: typeof opts.encode === "boolean" ? opts.encode : defaults.encode,
      encodeDotInKeys: typeof opts.encodeDotInKeys === "boolean" ? opts.encodeDotInKeys : defaults.encodeDotInKeys,
      encoder: typeof opts.encoder === "function" ? opts.encoder : defaults.encoder,
      encodeValuesOnly: typeof opts.encodeValuesOnly === "boolean" ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
      filter,
      format,
      formatter,
      serializeDate: typeof opts.serializeDate === "function" ? opts.serializeDate : defaults.serializeDate,
      skipNulls: typeof opts.skipNulls === "boolean" ? opts.skipNulls : defaults.skipNulls,
      sort: typeof opts.sort === "function" ? opts.sort : null,
      strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults.strictNullHandling
    };
  };
  stringify_1 = function(object, opts) {
    var obj = object;
    var options = normalizeStringifyOptions(opts);
    var objKeys;
    var filter;
    if (typeof options.filter === "function") {
      filter = options.filter;
      obj = filter("", obj);
    } else if (isArray(options.filter)) {
      filter = options.filter;
      objKeys = filter;
    }
    var keys = [];
    if (typeof obj !== "object" || obj === null) {
      return "";
    }
    var generateArrayPrefix = arrayPrefixGenerators[options.arrayFormat];
    var commaRoundTrip = generateArrayPrefix === "comma" && options.commaRoundTrip;
    if (!objKeys) {
      objKeys = Object.keys(obj);
    }
    if (options.sort) {
      objKeys.sort(options.sort);
    }
    var sideChannel2 = getSideChannel();
    for (var i = 0; i < objKeys.length; ++i) {
      var key = objKeys[i];
      var value = obj[key];
      if (options.skipNulls && value === null) {
        continue;
      }
      pushToArray(keys, stringify(
        value,
        key,
        generateArrayPrefix,
        commaRoundTrip,
        options.allowEmptyArrays,
        options.strictNullHandling,
        options.skipNulls,
        options.encodeDotInKeys,
        options.encode ? options.encoder : null,
        options.filter,
        options.sort,
        options.allowDots,
        options.serializeDate,
        options.format,
        options.formatter,
        options.encodeValuesOnly,
        options.charset,
        sideChannel2
      ));
    }
    var joined = keys.join(options.delimiter);
    var prefix = options.addQueryPrefix === true ? "?" : "";
    if (options.charsetSentinel) {
      if (options.charset === "iso-8859-1") {
        prefix += "utf8=%26%2310003%3B&";
      } else {
        prefix += "utf8=%E2%9C%93&";
      }
    }
    return joined.length > 0 ? prefix + joined : "";
  };
  return stringify_1;
}
var parse;
var hasRequiredParse;
function requireParse() {
  if (hasRequiredParse) return parse;
  hasRequiredParse = 1;
  var utils2 = /* @__PURE__ */ requireUtils();
  var has = Object.prototype.hasOwnProperty;
  var isArray = Array.isArray;
  var defaults = {
    allowDots: false,
    allowEmptyArrays: false,
    allowPrototypes: false,
    allowSparse: false,
    arrayLimit: 20,
    charset: "utf-8",
    charsetSentinel: false,
    comma: false,
    decodeDotInKeys: false,
    decoder: utils2.decode,
    delimiter: "&",
    depth: 5,
    duplicates: "combine",
    ignoreQueryPrefix: false,
    interpretNumericEntities: false,
    parameterLimit: 1e3,
    parseArrays: true,
    plainObjects: false,
    strictDepth: false,
    strictNullHandling: false,
    throwOnLimitExceeded: false
  };
  var interpretNumericEntities = function(str) {
    return str.replace(/&#(\d+);/g, function($0, numberStr) {
      return String.fromCharCode(parseInt(numberStr, 10));
    });
  };
  var parseArrayValue = function(val, options, currentArrayLength) {
    if (val && typeof val === "string" && options.comma && val.indexOf(",") > -1) {
      return val.split(",");
    }
    if (options.throwOnLimitExceeded && currentArrayLength >= options.arrayLimit) {
      throw new RangeError("Array limit exceeded. Only " + options.arrayLimit + " element" + (options.arrayLimit === 1 ? "" : "s") + " allowed in an array.");
    }
    return val;
  };
  var isoSentinel = "utf8=%26%2310003%3B";
  var charsetSentinel = "utf8=%E2%9C%93";
  var parseValues = function parseQueryStringValues(str, options) {
    var obj = { __proto__: null };
    var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, "") : str;
    cleanStr = cleanStr.replace(/%5B/gi, "[").replace(/%5D/gi, "]");
    var limit = options.parameterLimit === Infinity ? void 0 : options.parameterLimit;
    var parts = cleanStr.split(
      options.delimiter,
      options.throwOnLimitExceeded ? limit + 1 : limit
    );
    if (options.throwOnLimitExceeded && parts.length > limit) {
      throw new RangeError("Parameter limit exceeded. Only " + limit + " parameter" + (limit === 1 ? "" : "s") + " allowed.");
    }
    var skipIndex = -1;
    var i;
    var charset = options.charset;
    if (options.charsetSentinel) {
      for (i = 0; i < parts.length; ++i) {
        if (parts[i].indexOf("utf8=") === 0) {
          if (parts[i] === charsetSentinel) {
            charset = "utf-8";
          } else if (parts[i] === isoSentinel) {
            charset = "iso-8859-1";
          }
          skipIndex = i;
          i = parts.length;
        }
      }
    }
    for (i = 0; i < parts.length; ++i) {
      if (i === skipIndex) {
        continue;
      }
      var part = parts[i];
      var bracketEqualsPos = part.indexOf("]=");
      var pos = bracketEqualsPos === -1 ? part.indexOf("=") : bracketEqualsPos + 1;
      var key;
      var val;
      if (pos === -1) {
        key = options.decoder(part, defaults.decoder, charset, "key");
        val = options.strictNullHandling ? null : "";
      } else {
        key = options.decoder(part.slice(0, pos), defaults.decoder, charset, "key");
        val = utils2.maybeMap(
          parseArrayValue(
            part.slice(pos + 1),
            options,
            isArray(obj[key]) ? obj[key].length : 0
          ),
          function(encodedVal) {
            return options.decoder(encodedVal, defaults.decoder, charset, "value");
          }
        );
      }
      if (val && options.interpretNumericEntities && charset === "iso-8859-1") {
        val = interpretNumericEntities(String(val));
      }
      if (part.indexOf("[]=") > -1) {
        val = isArray(val) ? [val] : val;
      }
      var existing = has.call(obj, key);
      if (existing && options.duplicates === "combine") {
        obj[key] = utils2.combine(obj[key], val);
      } else if (!existing || options.duplicates === "last") {
        obj[key] = val;
      }
    }
    return obj;
  };
  var parseObject = function(chain, val, options, valuesParsed) {
    var currentArrayLength = 0;
    if (chain.length > 0 && chain[chain.length - 1] === "[]") {
      var parentKey = chain.slice(0, -1).join("");
      currentArrayLength = Array.isArray(val) && val[parentKey] ? val[parentKey].length : 0;
    }
    var leaf = valuesParsed ? val : parseArrayValue(val, options, currentArrayLength);
    for (var i = chain.length - 1; i >= 0; --i) {
      var obj;
      var root = chain[i];
      if (root === "[]" && options.parseArrays) {
        obj = options.allowEmptyArrays && (leaf === "" || options.strictNullHandling && leaf === null) ? [] : utils2.combine([], leaf);
      } else {
        obj = options.plainObjects ? { __proto__: null } : {};
        var cleanRoot = root.charAt(0) === "[" && root.charAt(root.length - 1) === "]" ? root.slice(1, -1) : root;
        var decodedRoot = options.decodeDotInKeys ? cleanRoot.replace(/%2E/g, ".") : cleanRoot;
        var index = parseInt(decodedRoot, 10);
        if (!options.parseArrays && decodedRoot === "") {
          obj = { 0: leaf };
        } else if (!isNaN(index) && root !== decodedRoot && String(index) === decodedRoot && index >= 0 && (options.parseArrays && index <= options.arrayLimit)) {
          obj = [];
          obj[index] = leaf;
        } else if (decodedRoot !== "__proto__") {
          obj[decodedRoot] = leaf;
        }
      }
      leaf = obj;
    }
    return leaf;
  };
  var parseKeys = function parseQueryStringKeys(givenKey, val, options, valuesParsed) {
    if (!givenKey) {
      return;
    }
    var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, "[$1]") : givenKey;
    var brackets = /(\[[^[\]]*])/;
    var child = /(\[[^[\]]*])/g;
    var segment = options.depth > 0 && brackets.exec(key);
    var parent = segment ? key.slice(0, segment.index) : key;
    var keys = [];
    if (parent) {
      if (!options.plainObjects && has.call(Object.prototype, parent)) {
        if (!options.allowPrototypes) {
          return;
        }
      }
      keys.push(parent);
    }
    var i = 0;
    while (options.depth > 0 && (segment = child.exec(key)) !== null && i < options.depth) {
      i += 1;
      if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
        if (!options.allowPrototypes) {
          return;
        }
      }
      keys.push(segment[1]);
    }
    if (segment) {
      if (options.strictDepth === true) {
        throw new RangeError("Input depth exceeded depth option of " + options.depth + " and strictDepth is true");
      }
      keys.push("[" + key.slice(segment.index) + "]");
    }
    return parseObject(keys, val, options, valuesParsed);
  };
  var normalizeParseOptions = function normalizeParseOptions2(opts) {
    if (!opts) {
      return defaults;
    }
    if (typeof opts.allowEmptyArrays !== "undefined" && typeof opts.allowEmptyArrays !== "boolean") {
      throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
    }
    if (typeof opts.decodeDotInKeys !== "undefined" && typeof opts.decodeDotInKeys !== "boolean") {
      throw new TypeError("`decodeDotInKeys` option can only be `true` or `false`, when provided");
    }
    if (opts.decoder !== null && typeof opts.decoder !== "undefined" && typeof opts.decoder !== "function") {
      throw new TypeError("Decoder has to be a function.");
    }
    if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") {
      throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
    }
    if (typeof opts.throwOnLimitExceeded !== "undefined" && typeof opts.throwOnLimitExceeded !== "boolean") {
      throw new TypeError("`throwOnLimitExceeded` option must be a boolean");
    }
    var charset = typeof opts.charset === "undefined" ? defaults.charset : opts.charset;
    var duplicates = typeof opts.duplicates === "undefined" ? defaults.duplicates : opts.duplicates;
    if (duplicates !== "combine" && duplicates !== "first" && duplicates !== "last") {
      throw new TypeError("The duplicates option must be either combine, first, or last");
    }
    var allowDots = typeof opts.allowDots === "undefined" ? opts.decodeDotInKeys === true ? true : defaults.allowDots : !!opts.allowDots;
    return {
      allowDots,
      allowEmptyArrays: typeof opts.allowEmptyArrays === "boolean" ? !!opts.allowEmptyArrays : defaults.allowEmptyArrays,
      allowPrototypes: typeof opts.allowPrototypes === "boolean" ? opts.allowPrototypes : defaults.allowPrototypes,
      allowSparse: typeof opts.allowSparse === "boolean" ? opts.allowSparse : defaults.allowSparse,
      arrayLimit: typeof opts.arrayLimit === "number" ? opts.arrayLimit : defaults.arrayLimit,
      charset,
      charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults.charsetSentinel,
      comma: typeof opts.comma === "boolean" ? opts.comma : defaults.comma,
      decodeDotInKeys: typeof opts.decodeDotInKeys === "boolean" ? opts.decodeDotInKeys : defaults.decodeDotInKeys,
      decoder: typeof opts.decoder === "function" ? opts.decoder : defaults.decoder,
      delimiter: typeof opts.delimiter === "string" || utils2.isRegExp(opts.delimiter) ? opts.delimiter : defaults.delimiter,
      // eslint-disable-next-line no-implicit-coercion, no-extra-parens
      depth: typeof opts.depth === "number" || opts.depth === false ? +opts.depth : defaults.depth,
      duplicates,
      ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
      interpretNumericEntities: typeof opts.interpretNumericEntities === "boolean" ? opts.interpretNumericEntities : defaults.interpretNumericEntities,
      parameterLimit: typeof opts.parameterLimit === "number" ? opts.parameterLimit : defaults.parameterLimit,
      parseArrays: opts.parseArrays !== false,
      plainObjects: typeof opts.plainObjects === "boolean" ? opts.plainObjects : defaults.plainObjects,
      strictDepth: typeof opts.strictDepth === "boolean" ? !!opts.strictDepth : defaults.strictDepth,
      strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults.strictNullHandling,
      throwOnLimitExceeded: typeof opts.throwOnLimitExceeded === "boolean" ? opts.throwOnLimitExceeded : false
    };
  };
  parse = function(str, opts) {
    var options = normalizeParseOptions(opts);
    if (str === "" || str === null || typeof str === "undefined") {
      return options.plainObjects ? { __proto__: null } : {};
    }
    var tempObj = typeof str === "string" ? parseValues(str, options) : str;
    var obj = options.plainObjects ? { __proto__: null } : {};
    var keys = Object.keys(tempObj);
    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i];
      var newObj = parseKeys(key, tempObj[key], options, typeof str === "string");
      obj = utils2.merge(obj, newObj, options);
    }
    if (options.allowSparse === true) {
      return obj;
    }
    return utils2.compact(obj);
  };
  return parse;
}
var lib;
var hasRequiredLib;
function requireLib() {
  if (hasRequiredLib) return lib;
  hasRequiredLib = 1;
  var stringify = /* @__PURE__ */ requireStringify();
  var parse2 = /* @__PURE__ */ requireParse();
  var formats2 = /* @__PURE__ */ requireFormats();
  lib = {
    formats: formats2,
    parse: parse2,
    stringify
  };
  return lib;
}
var libExports = /* @__PURE__ */ requireLib();
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
  const queryString = libExports.stringify(query);
  return url + (/\?/.test(url) ? `&${queryString}` : `?${queryString}`);
}
function parseQuery(queryString) {
  return libExports.parse(queryString);
}
function buildQuery(query) {
  return libExports.stringify(query);
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
async function useTinymce(selector, options = {}) {
  const { get: get2 } = await import("./tinymce-BU-AeAmK.js");
  return get2(selector, options);
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
  modalTree: useFieldModalTree
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
  delegate as $,
  route as A,
  getBoundedInstance as B,
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
  createQueue as aP,
  useS3Uploader as aQ,
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
  getDefaultExportFromCjs as g,
  html as h,
  initAlpineComponent as i,
  useImport as j,
  useCssImport as k,
  highlight as l,
  mergeDeep as m,
  data as n,
  slideUp as o,
  prepareAlpineDefer as p,
  forceArray as q,
  useHttpClient as r,
  selectAll as s,
  useSystemUri as t,
  uid as u,
  loadAlpine as v,
  slideDown as w,
  h as x,
  simpleConfirm as y,
  deleteConfirm as z
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pY29ybi1DUjBhZlNzVy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxpdGllcy9hcnIudHMiLCIuLi8uLi9zcmMvdXRpbGl0aWVzL2RhdGEudHMiLCIuLi8uLi9zcmMvc2VydmljZS9kb20udHMiLCIuLi8uLi9zcmMvc2VydmljZS9hbmltYXRlLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BseXJhc29mdC90cy10b29sa2l0L3NyYy9nZW5lcmljL2FsZXJ0LWFkYXB0ZXIudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGx5cmFzb2Z0L3RzLXRvb2xraXQvc3JjL2dlbmVyaWMvYWxlcnQudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGx5cmFzb2Z0L3RzLXRvb2xraXQvc3JjL2dlbmVyaWMvZW52LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BseXJhc29mdC90cy10b29sa2l0L3NyYy9nZW5lcmljL2NyeXB0by50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AbHlyYXNvZnQvdHMtdG9vbGtpdC9zcmMvZ2VuZXJpYy9xdWV1ZS50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AbHlyYXNvZnQvdHMtdG9vbGtpdC9zcmMvZ2VuZXJpYy9zdGFjay50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AbHlyYXNvZnQvdHMtdG9vbGtpdC9zcmMvZ2VuZXJpYy90aW1pbmcudHMiLCIuLi8uLi9zcmMvc2VydmljZS9jcnlwdG8udHMiLCIuLi8uLi9zcmMvc2VydmljZS9oZWxwZXIudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ByaW50Zi1qcy9zcmMvc3ByaW50Zi5qcyIsIi4uLy4uL3NyYy9zZXJ2aWNlL2xhbmcudHMiLCIuLi8uLi9zcmMvc2VydmljZS9sb2FkZXIudHMiLCIuLi8uLi9zcmMvY29tcG9zYWJsZS91c2VDaGVja2JveGVzTXVsdGlTZWxlY3QudHMiLCIuLi8uLi9zcmMvY29tcG9zYWJsZS91c2VGaWVsZENhc2NhZGVTZWxlY3QudHMiLCIuLi8uLi9zcmMvY29tcG9zYWJsZS91c2VGaWVsZEZpbGVEcmFnLnRzIiwiLi4vLi4vc3JjL2NvbXBvc2FibGUvdXNlRmllbGRGbGF0cGlja3IudHMiLCIuLi8uLi9zcmMvY29tcG9zYWJsZS91c2VGaWVsZE1vZGFsU2VsZWN0LnRzIiwiLi4vLi4vc3JjL2NvbXBvc2FibGUvdXNlRmllbGRNb2RhbFRyZWUudHMiLCIuLi8uLi9zcmMvY29tcG9zYWJsZS91c2VGaWVsZFJlcGVhdGFibGUudHMiLCIuLi8uLi9zcmMvY29tcG9zYWJsZS91c2VGaWVsZFNpbmdsZUltYWdlRHJhZy50cyIsIi4uLy4uL3NyYy9jb21wb3NhYmxlL3VzZUZvcm0udHMiLCIuLi8uLi9zcmMvY29tcG9zYWJsZS91c2VHcmlkLnRzIiwiLi4vLi4vc3JjL2NvbXBvc2FibGUvdXNlSHR0cC50cyIsIi4uLy4uL3NyYy9jb21wb3NhYmxlL3VzZUlmcmFtZU1vZGFsLnRzIiwiLi4vLi4vc3JjL2NvbXBvc2FibGUvdXNlTGlzdERlcGVuZGVudC50cyIsIi4uLy4uL3NyYy9jb21wb3NhYmxlL3VzZVF1ZXVlLnRzIiwiLi4vLi4vc3JjL2NvbXBvc2FibGUvdXNlUzNVcGxvYWRlci50cyIsIi4uLy4uL3NyYy9jb21wb3NhYmxlL3VzZVNob3dPbi50cyIsIi4uLy4uL3NyYy9jb21wb3NhYmxlL3VzZVN0YWNrLnRzIiwiLi4vLi4vc3JjL2NvbXBvc2FibGUvdXNlVG9tU2VsZWN0LnRzIiwiLi4vLi4vc3JjL2NvbXBvc2FibGUvdXNlVUlCb290c3RyYXA1LnRzIiwiLi4vLi4vc3JjL2NvbXBvc2FibGUvdXNlVW5pRGlyZWN0aXZlLnRzIiwiLi4vLi4vc3JjL2NvbXBvc2FibGUvdXNlVmFsaWRhdGlvbi50cyIsIi4uLy4uL3NyYy9zZXJ2aWNlL3VpLnRzIiwiLi4vLi4vc3JjL3NlcnZpY2UvdXJpLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2VzLWVycm9ycy90eXBlLmpzIiwiLi4vLi4vX192aXRlLWJyb3dzZXItZXh0ZXJuYWwiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvb2JqZWN0LWluc3BlY3QvaW5kZXguanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2lkZS1jaGFubmVsLWxpc3QvaW5kZXguanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvZXMtb2JqZWN0LWF0b21zL2luZGV4LmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2VzLWVycm9ycy9pbmRleC5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9lcy1lcnJvcnMvZXZhbC5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9lcy1lcnJvcnMvcmFuZ2UuanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvZXMtZXJyb3JzL3JlZi5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9lcy1lcnJvcnMvc3ludGF4LmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2VzLWVycm9ycy91cmkuanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbWF0aC1pbnRyaW5zaWNzL2Ficy5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9tYXRoLWludHJpbnNpY3MvZmxvb3IuanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbWF0aC1pbnRyaW5zaWNzL21heC5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9tYXRoLWludHJpbnNpY3MvbWluLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21hdGgtaW50cmluc2ljcy9wb3cuanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvbWF0aC1pbnRyaW5zaWNzL3JvdW5kLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21hdGgtaW50cmluc2ljcy9pc05hTi5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9tYXRoLWludHJpbnNpY3Mvc2lnbi5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9nb3BkL2dPUEQuanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvZ29wZC9pbmRleC5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9lcy1kZWZpbmUtcHJvcGVydHkvaW5kZXguanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvaGFzLXN5bWJvbHMvc2hhbXMuanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvaGFzLXN5bWJvbHMvaW5kZXguanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvZ2V0LXByb3RvL1JlZmxlY3QuZ2V0UHJvdG90eXBlT2YuanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvZ2V0LXByb3RvL09iamVjdC5nZXRQcm90b3R5cGVPZi5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9mdW5jdGlvbi1iaW5kL2ltcGxlbWVudGF0aW9uLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Z1bmN0aW9uLWJpbmQvaW5kZXguanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY2FsbC1iaW5kLWFwcGx5LWhlbHBlcnMvZnVuY3Rpb25DYWxsLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NhbGwtYmluZC1hcHBseS1oZWxwZXJzL2Z1bmN0aW9uQXBwbHkuanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY2FsbC1iaW5kLWFwcGx5LWhlbHBlcnMvcmVmbGVjdEFwcGx5LmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NhbGwtYmluZC1hcHBseS1oZWxwZXJzL2FjdHVhbEFwcGx5LmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NhbGwtYmluZC1hcHBseS1oZWxwZXJzL2luZGV4LmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2R1bmRlci1wcm90by9nZXQuanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvZ2V0LXByb3RvL2luZGV4LmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2hhc293bi9pbmRleC5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9nZXQtaW50cmluc2ljL2luZGV4LmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NhbGwtYm91bmQvaW5kZXguanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2lkZS1jaGFubmVsLW1hcC9pbmRleC5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zaWRlLWNoYW5uZWwtd2Vha21hcC9pbmRleC5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zaWRlLWNoYW5uZWwvaW5kZXguanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcXMvbGliL2Zvcm1hdHMuanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcXMvbGliL3V0aWxzLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3FzL2xpYi9zdHJpbmdpZnkuanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcXMvbGliL3BhcnNlLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3FzL2xpYi9pbmRleC5qcyIsIi4uLy4uL3NyYy9zZXJ2aWNlL3JvdXRlci50cyIsIi4uLy4uL3NyYy91dGlsaXRpZXMvYmFzZS50cyIsIi4uLy4uL3NyYy9kYXRhLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3RzLW1peGVyL2Rpc3QvZXNtL2luZGV4LmpzIiwiLi4vLi4vc3JjL2V2ZW50cy50cyIsIi4uLy4uL3NyYy9hcHAudHMiLCIuLi8uLi9zcmMvcG9seWZpbGwvZm9ybS1yZXF1ZXN0LXN1Ym1pdC50cyIsIi4uLy4uL3NyYy9wb2x5ZmlsbC9pbmRleC50cyIsIi4uLy4uL3NyYy9jb21wb3NhYmxlL3VzZVRpbnltY2UudHMiLCIuLi8uLi9zcmMvcGx1Z2luL3BocC1hZGFwdGVyLnRzIiwiLi4vLi4vc3JjL3VuaWNvcm4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiXG5leHBvcnQgZnVuY3Rpb24gaXNQbGFpbk9iamVjdCh2YWw6IGFueSk6IHZhbCBpcyBSZWNvcmQ8c3RyaW5nLCBhbnk+IHtcbiAgcmV0dXJuIHZhbCAmJiB0eXBlb2YgdmFsID09PSBcIm9iamVjdFwiICYmICFBcnJheS5pc0FycmF5KHZhbCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZURlZXA8VCA9IFJlY29yZDxzdHJpbmcsIGFueT4+KHRhcmdldDogUGFydGlhbDxUPiwgLi4uc291cmNlczogYW55W10pOiBUIHtcbiAgbGV0IG91dDogYW55ID0gaXNQbGFpbk9iamVjdCh0YXJnZXQpID8geyAuLi50YXJnZXQgfSA6IHRhcmdldDtcblxuICBmb3IgKGNvbnN0IHNvdXJjZSBvZiBzb3VyY2VzKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoc291cmNlKSkge1xuICAgICAgb3V0ID0gKEFycmF5LmlzQXJyYXkob3V0KSA/IG91dC5jb25jYXQoc291cmNlKSA6IHNvdXJjZSkgYXMgVDtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAoaXNQbGFpbk9iamVjdChzb3VyY2UpKSB7XG4gICAgICBvdXQgPSB7IC4uLihpc1BsYWluT2JqZWN0KG91dCkgPyBvdXQgOiB7fSkgfTtcbiAgICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHNvdXJjZSkpIHtcbiAgICAgICAgb3V0W2tleV0gPVxuICAgICAgICAgIGtleSBpbiBvdXQgPyBtZXJnZURlZXAob3V0W2tleV0sIHNvdXJjZVtrZXldKSA6IHNvdXJjZVtrZXldO1xuICAgICAgfVxuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIG91dCA9IHNvdXJjZSBhcyBUO1xuICB9XG4gIHJldHVybiBvdXQ7XG59XG4iLCJcbmV4cG9ydCBmdW5jdGlvbiBnZXREYXRhKGVsZW1lbnQ6IEVsZW1lbnQsIG5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZCkge1xuICBwcmVwYXJlRGF0YShlbGVtZW50KTtcblxuICBpZiAobmFtZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGVsZW1lbnQuX191bmljb3JuO1xuICB9XG5cbiAgcmV0dXJuIGVsZW1lbnQuX191bmljb3JuW25hbWVdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0RGF0YShlbGVtZW50OiBFbGVtZW50LCBuYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcbiAgcHJlcGFyZURhdGEoZWxlbWVudCk7XG4gIGVsZW1lbnQuX191bmljb3JuW25hbWVdID0gdmFsdWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWZEYXRhKGVsZW1lbnQ6IEVsZW1lbnQsIG5hbWU6IHN0cmluZywgZGVmQ2FsbGJhY2s6IEZ1bmN0aW9uKSB7XG4gIHByZXBhcmVEYXRhKGVsZW1lbnQpO1xuICBlbGVtZW50Ll9fdW5pY29ybltuYW1lXSA9IGVsZW1lbnQuX191bmljb3JuW25hbWVdIHx8IGRlZkNhbGxiYWNrKGVsZW1lbnQpO1xuXG4gIHJldHVybiBlbGVtZW50Ll9fdW5pY29ybltuYW1lXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZURhdGEoZWxlbWVudDogRWxlbWVudCwgbmFtZTogc3RyaW5nKSB7XG4gIHByZXBhcmVEYXRhKGVsZW1lbnQpO1xuXG4gIGNvbnN0IHYgPSBlbGVtZW50Ll9fdW5pY29ybltuYW1lXTtcbiAgZGVsZXRlIGVsZW1lbnQuX191bmljb3JuW25hbWVdO1xuXG4gIHJldHVybiB2O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJlcGFyZURhdGE8VCBleHRlbmRzIE5vZGU+KGVsZW1lbnQ6IFQpOiBUIHtcbiAgaWYgKCFlbGVtZW50KSB7XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH1cblxuICBlbGVtZW50Ll9fdW5pY29ybiA9IGVsZW1lbnQuX191bmljb3JuIHx8IHt9O1xuICByZXR1cm4gZWxlbWVudDtcbn1cblxuZGVjbGFyZSBnbG9iYWwge1xuICBpbnRlcmZhY2UgTm9kZSB7XG4gICAgX191bmljb3JuPzogYW55O1xuICB9XG59XG5cblxuIiwiaW1wb3J0IHsgZGVmRGF0YSB9IGZyb20gJy4uL3V0aWxpdGllcyc7XG5cbi8qKlxuICogQHNlZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvOTg5OTcwMVxuICovXG5leHBvcnQgZnVuY3Rpb24gZG9tcmVhZHkoY2FsbGJhY2s/OiAoKHZhbHVlOiBhbnkpID0+IGFueSkpOiBQcm9taXNlPHZvaWQ+IHtcbiAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSkgPT4ge1xuICAgIC8vIHNlZSBpZiBET00gaXMgYWxyZWFkeSBhdmFpbGFibGVcbiAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJyB8fCBkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnaW50ZXJhY3RpdmUnKSB7XG4gICAgICAvLyBjYWxsIG9uIG5leHQgYXZhaWxhYmxlIHRpY2tcbiAgICAgIHNldFRpbWVvdXQocmVzb2x2ZSwgMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiByZXNvbHZlKCkpO1xuICAgIH1cbiAgfSk7XG5cbiAgaWYgKGNhbGxiYWNrKSB7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbihjYWxsYmFjayk7XG4gIH1cblxuICByZXR1cm4gcHJvbWlzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdE9uZTxLIGV4dGVuZHMga2V5b2YgSFRNTEVsZW1lbnRUYWdOYW1lTWFwPihlbGU6IEspOiBIVE1MRWxlbWVudFRhZ05hbWVNYXBbS10gfCBudWxsO1xuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdE9uZTxFIGV4dGVuZHMgRWxlbWVudCA9IEVsZW1lbnQ+KGVsZTogc3RyaW5nKTogRSB8IG51bGw7XG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0T25lPEUgZXh0ZW5kcyBFbGVtZW50ID0gRWxlbWVudD4oZWxlOiBFKTogRTtcbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RPbmU8RSBleHRlbmRzIEVsZW1lbnQgPSBFbGVtZW50PihlbGU6IHN0cmluZyB8IEUpOiBFIHwgbnVsbDtcbi8vIHNlbGVjdE9uZShlbGU6IHN0cmluZyk6IEVsZW1lbnQ7XG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0T25lPEUgZXh0ZW5kcyBFbGVtZW50ID0gRWxlbWVudD4oZWxlOiBFIHwgc3RyaW5nKTogRSB8IG51bGwge1xuICBsZXQgcjogRSB8IG51bGw7XG5cbiAgaWYgKHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnKSB7XG4gICAgciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8RT4oZWxlKTtcbiAgfSBlbHNlIHtcbiAgICByID0gZWxlO1xuICB9XG5cbiAgaWYgKCFyKSB7XG4gICAgcmV0dXJuIHI7XG4gIH1cblxuICByZXR1cm4gcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdEFsbDxFIGV4dGVuZHMgRWxlbWVudCA9IEVsZW1lbnQ+KGVsZTogc3RyaW5nLCBjYWxsYmFjaz86ICgoZWxlOiBFKSA9PiBhbnkpKTogRVtdO1xuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdEFsbDxFIGV4dGVuZHMgRWxlbWVudCA9IEVsZW1lbnQ+KGVsZTogTm9kZUxpc3RPZjxFPiB8IEVbXSwgY2FsbGJhY2s/OiAoKGVsZTogRSkgPT4gYW55KSk6IEVbXTtcbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RBbGw8RSBleHRlbmRzIEVsZW1lbnQgPSBFbGVtZW50PihcbiAgZWxlOiBzdHJpbmcgfCBOb2RlTGlzdE9mPEU+IHwgRVtdLFxuICBjYWxsYmFjaz86ICgoZWxlOiBFKSA9PiBhbnkpXG4pOiBFW107XG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0QWxsPEUgZXh0ZW5kcyBrZXlvZiBIVE1MRWxlbWVudFRhZ05hbWVNYXA+KFxuICBlbGU6IEUsXG4gIGNhbGxiYWNrPzogKChlbGU6IEhUTUxFbGVtZW50VGFnTmFtZU1hcFtFXSkgPT4gYW55KVxuKTogSFRNTEVsZW1lbnRUYWdOYW1lTWFwW0VdW107XG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0QWxsKFxuICBlbGU6IE5vZGVMaXN0T2Y8RWxlbWVudD4gfCBFbGVtZW50W10gfCBzdHJpbmcsXG4gIGNhbGxiYWNrOiAoKGVsOiBFbGVtZW50KSA9PiBhbnkpIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkXG4pOiBFbGVtZW50W10ge1xuICBpZiAodHlwZW9mIGVsZSA9PT0gJ3N0cmluZycpIHtcbiAgICBlbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGVsZSk7XG4gIH1cblxuICBjb25zdCByZXN1bHRTZXQ6IEVsZW1lbnRbXSA9IFtdLnNsaWNlLmNhbGwoZWxlKTtcblxuICBpZiAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gcmVzdWx0U2V0Lm1hcCgoZWwpID0+IGNhbGxiYWNrKGVsKSB8fCBlbCk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0U2V0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Qm91bmRlZEluc3RhbmNlPFQgPSBhbnksIEUgPSBFbGVtZW50PihzZWxlY3RvcjogRSwgbmFtZTogc3RyaW5nLCBjYWxsYmFjaz86ICgoZWw6IEUpID0+IGFueSkpOiBUO1xuZXhwb3J0IGZ1bmN0aW9uIGdldEJvdW5kZWRJbnN0YW5jZTxUID0gYW55LCBFIGV4dGVuZHMgRWxlbWVudCA9IEVsZW1lbnQ+KFxuICBzZWxlY3Rvcjogc3RyaW5nIHwgRSxcbiAgbmFtZTogc3RyaW5nLFxuICBjYWxsYmFjaz86ICgoZWw6IEUpID0+IGFueSlcbik6IFQgfCBudWxsO1xuZXhwb3J0IGZ1bmN0aW9uIGdldEJvdW5kZWRJbnN0YW5jZTxUID0gYW55LCBFIGV4dGVuZHMgRWxlbWVudCA9IEVsZW1lbnQ+KHNlbGVjdG9yOiBzdHJpbmcgfCBFLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKChlbDogRSkgPT4gYW55KSA9ICgpID0+IG51bGwpOiBUIHwgbnVsbCB7XG4gIGNvbnN0IGVsZW1lbnQgPSB0eXBlb2Ygc2VsZWN0b3IgPT09ICdzdHJpbmcnID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxFPihzZWxlY3RvcikgOiBzZWxlY3RvcjtcblxuICBpZiAoIWVsZW1lbnQpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBkZWZEYXRhKGVsZW1lbnQsIG5hbWUsIGNhbGxiYWNrKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEJvdW5kZWRJbnN0YW5jZUxpc3Q8VCA9IGFueSwgRSBleHRlbmRzIEVsZW1lbnQgPSBFbGVtZW50PihcbiAgc2VsZWN0b3I6IHN0cmluZyB8IE5vZGVMaXN0T2Y8RT4sXG4gIG5hbWU6IHN0cmluZyxcbiAgY2FsbGJhY2s6ICgoZWw6IEUpID0+IGFueSkgPSAoKSA9PiBudWxsXG4pOiAoVCB8IG51bGwpW10ge1xuICBjb25zdCBpdGVtcyA9IHR5cGVvZiBzZWxlY3RvciA9PT0gJ3N0cmluZycgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEU+KHNlbGVjdG9yKSA6IHNlbGVjdG9yO1xuXG4gIHJldHVybiBBcnJheS5mcm9tKGl0ZW1zKS5tYXAoKGVsZTogRSkgPT4gZ2V0Qm91bmRlZEluc3RhbmNlKGVsZSwgbmFtZSwgY2FsbGJhY2spKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1vZHVsZTxUID0gYW55LCBFIGV4dGVuZHMgRWxlbWVudCA9IEVsZW1lbnQ+KFxuICBlbGU6IHN0cmluZyxcbiAgbmFtZTogc3RyaW5nLFxuICBjYWxsYmFjaz86ICgoZWw6IEUpID0+IGFueSlcbik6IChUIHwgbnVsbClbXTtcbmV4cG9ydCBmdW5jdGlvbiBtb2R1bGU8VCA9IGFueSwgRSBleHRlbmRzIEVsZW1lbnQgPSBFbGVtZW50PihcbiAgZWxlOiBOb2RlTGlzdE9mPEVsZW1lbnQ+LFxuICBuYW1lOiBzdHJpbmcsXG4gIGNhbGxiYWNrPzogKChlbDogRSkgPT4gYW55KSk6IChUIHwgbnVsbClbXTtcbmV4cG9ydCBmdW5jdGlvbiBtb2R1bGU8VCA9IGFueSwgRSBleHRlbmRzIEVsZW1lbnQgPSBFbGVtZW50PihcbiAgZWxlOiBFbGVtZW50LFxuICBuYW1lOiBzdHJpbmcsXG4gIGNhbGxiYWNrPzogKChlbDogRSkgPT4gYW55KVxuKTogVCB8IG51bGw7XG5leHBvcnQgZnVuY3Rpb24gbW9kdWxlPFQgPSBhbnksIEUgZXh0ZW5kcyBFbGVtZW50ID0gRWxlbWVudD4oXG4gIGVsZTogc3RyaW5nIHwgRWxlbWVudCB8IE5vZGVMaXN0T2Y8RWxlbWVudD4sXG4gIG5hbWU6IHN0cmluZyxcbiAgY2FsbGJhY2s/OiAoKGVsOiBFKSA9PiBhbnkpXG4pOiAoVCB8IG51bGwpW10gfCBUIHwgbnVsbDtcbmV4cG9ydCBmdW5jdGlvbiBtb2R1bGU8VCA9IGFueSwgRSBleHRlbmRzIEVsZW1lbnQgPSBFbGVtZW50PihcbiAgZWxlOiBzdHJpbmcgfCBFIHwgTm9kZUxpc3RPZjxFPixcbiAgbmFtZTogc3RyaW5nLFxuICBjYWxsYmFjazogKChlbDogRSkgPT4gYW55KSA9ICgpID0+IG51bGxcbik6IChUIHwgbnVsbClbXSB8IFQgfCBudWxsIHtcbiAgaWYgKHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGdldEJvdW5kZWRJbnN0YW5jZUxpc3Q8VCwgRT4oZWxlLCBuYW1lLCBjYWxsYmFjayk7XG4gIH1cblxuICBpZiAoZWxlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICByZXR1cm4gZ2V0Qm91bmRlZEluc3RhbmNlPFQsIEU+KGVsZSwgbmFtZSwgY2FsbGJhY2spO1xuICB9XG5cbiAgcmV0dXJuIGdldEJvdW5kZWRJbnN0YW5jZUxpc3Q8VCwgRT4oZWxlIGFzIE5vZGVMaXN0T2Y8RT4sIG5hbWUsIGNhbGxiYWNrKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGg8VCBleHRlbmRzIGtleW9mIEhUTUxFbGVtZW50VGFnTmFtZU1hcD4oXG4gIGVsZW1lbnQ6IFQsXG4gIGF0dHJzPzogUmVjb3JkPHN0cmluZywgYW55PixcbiAgY29udGVudD86IGFueVxuKTogSFRNTEVsZW1lbnRUYWdOYW1lTWFwW1RdXG5leHBvcnQgZnVuY3Rpb24gaChlbGVtZW50OiBzdHJpbmcsIGF0dHJzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge30sIGNvbnRlbnQ6IGFueSA9IHVuZGVmaW5lZCk6IEhUTUxFbGVtZW50IHtcbiAgY29uc3QgZWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChlbGVtZW50KTtcblxuICBmb3IgKGxldCBpIGluIGF0dHJzKSB7XG4gICAgY29uc3QgdiA9IGF0dHJzW2ldO1xuXG4gICAgZWxlLnNldEF0dHJpYnV0ZShpLCB2KTtcbiAgfVxuXG4gIGlmIChjb250ZW50ICE9PSBudWxsKSB7XG4gICAgZWxlLmlubmVySFRNTCA9IGNvbnRlbnQ7XG4gIH1cblxuICByZXR1cm4gZWxlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaHRtbDxUIGV4dGVuZHMgRWxlbWVudCA9IEhUTUxFbGVtZW50PihodG1sOiBzdHJpbmcpOiBUIHtcbiAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGRpdi5pbm5lckhUTUwgPSBodG1sO1xuICByZXR1cm4gZGl2LmNoaWxkcmVuWzBdIGFzIFQ7XG59XG5cbi8qKlxuICogUHVyZSBKUyB2ZXJzaW9uIG9mIGpRdWVyeSBkZWxlZ2F0ZSgpXG4gKlxuICogQHNlZSBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9pYWdvYnJ1bm8vNGRiMmVkNjJkYzQwZmE4NDFiYjlhNWM3ZGU5MmY1ZjhcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlbGVnYXRlKFxuICB3cmFwcGVyOiBFbGVtZW50IHwgc3RyaW5nLFxuICBzZWxlY3Rvcjogc3RyaW5nLFxuICBldmVudE5hbWU6IHN0cmluZyxcbiAgY2FsbGJhY2s6IChlOiBFdmVudCkgPT4gdm9pZFxuKTogKCkgPT4gdm9pZCB7XG4gIGlmICh0eXBlb2Ygc2VsZWN0b3IgPT09ICd1bmRlZmluZWQnIHx8IHNlbGVjdG9yID09PSAnJykge1xuICAgIHRocm93IG5ldyBFcnJvcignVGhlIHByb3ZpZGVkIHNlbGVjdG9yIGlzIGVtcHR5LicpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIGNhbGxiYWNrICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdQbGVhc2Ugc3BlY2lmeSBhbiBjYWxsYmFjay4nKTtcbiAgfVxuXG4gIGNvbnN0IGRlbGVnYXRpb25TZWxlY3RvcnNNYXA6IFJlY29yZDxzdHJpbmcsIEZ1bmN0aW9uW10+ID0ge307XG5cbiAgY29uc3Qgd3JhcHBlckVsZW1lbnQgPSBzZWxlY3RPbmUod3JhcHBlcik7XG5cbiAgd3JhcHBlckVsZW1lbnQ/LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBsZXQgZWxlbWVudDogSFRNTEVsZW1lbnQgfCBudWxsID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuICAgIGxldCBmb3JjZUJyZWFrID0gZmFsc2U7XG5cbiAgICB3aGlsZSAoZWxlbWVudCAmJiBlbGVtZW50ICE9PSB3cmFwcGVyRWxlbWVudCkge1xuICAgICAgZm9yIChjb25zdCBzZWxlY3RvciBpbiBkZWxlZ2F0aW9uU2VsZWN0b3JzTWFwKSB7XG4gICAgICAgIGlmIChlbGVtZW50Lm1hdGNoZXMoc2VsZWN0b3IpKSB7XG4gICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZm9yY2VCcmVhayA9IHRydWU7XG4gICAgICAgICAgfTtcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoXG4gICAgICAgICAgICBldmVudCxcbiAgICAgICAgICAgICdjdXJyZW50VGFyZ2V0JyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgZ2V0KCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGNvbnN0IGNhbGxiYWNrTGlzdCA9IGRlbGVnYXRpb25TZWxlY3RvcnNNYXBbc2VsZWN0b3JdO1xuXG4gICAgICAgICAgY2FsbGJhY2tMaXN0LmZvckVhY2goZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhldmVudCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGZvcmNlQnJlYWspIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgfVxuICB9KTtcblxuICBpZiAoIWRlbGVnYXRpb25TZWxlY3RvcnNNYXBbc2VsZWN0b3JdKSB7XG4gICAgLy8gQWRkIG5ldyBzZWxlY3RvciB0byB0aGUgbGlzdFxuICAgIGRlbGVnYXRpb25TZWxlY3RvcnNNYXBbc2VsZWN0b3JdID0gW2NhbGxiYWNrXTtcbiAgfSBlbHNlIHtcbiAgICBkZWxlZ2F0aW9uU2VsZWN0b3JzTWFwW3NlbGVjdG9yXS5wdXNoKGNhbGxiYWNrKTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiB1bnN1YnNjcmliZSgpIHtcbiAgICBpZiAoIWRlbGVnYXRpb25TZWxlY3RvcnNNYXBbc2VsZWN0b3JdKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGRlbGVnYXRpb25TZWxlY3RvcnNNYXBbc2VsZWN0b3JdLmxlbmd0aCA+PSAyKSB7XG4gICAgICBkZWxlZ2F0aW9uU2VsZWN0b3JzTWFwW3NlbGVjdG9yXSA9IGRlbGVnYXRpb25TZWxlY3RvcnNNYXBbc2VsZWN0b3JdLmZpbHRlcihjYiA9PiBjYiAhPT0gY2FsbGJhY2spO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgZGVsZWdhdGlvblNlbGVjdG9yc01hcFtzZWxlY3Rvcl07XG4gICAgfVxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5qZWN0Q3NzVG9Eb2N1bWVudChkb2M6IERvY3VtZW50LCAuLi5jc3M6IChzdHJpbmcgfCBDU1NTdHlsZVNoZWV0KVtdKTogQ1NTU3R5bGVTaGVldFtdO1xuZXhwb3J0IGZ1bmN0aW9uIGluamVjdENzc1RvRG9jdW1lbnQoLi4uY3NzOiAoc3RyaW5nIHwgQ1NTU3R5bGVTaGVldClbXSk6IENTU1N0eWxlU2hlZXRbXTtcbmV4cG9ydCBmdW5jdGlvbiBpbmplY3RDc3NUb0RvY3VtZW50KFxuICBkb2M6IERvY3VtZW50IHwgc3RyaW5nIHwgQ1NTU3R5bGVTaGVldCxcbiAgLi4uY3NzOiAoc3RyaW5nIHwgQ1NTU3R5bGVTaGVldClbXVxuKTogQ1NTU3R5bGVTaGVldFtdIHtcbiAgaWYgKCEoZG9jIGluc3RhbmNlb2YgRG9jdW1lbnQpKSB7XG4gICAgY3NzLnB1c2goZG9jKTtcbiAgICBkb2MgPSBkb2N1bWVudDtcbiAgfVxuXG4gIGNvbnN0IHN0eWxlcyA9IGNzcy5tYXAoKGNzcykgPT4ge1xuICAgIGlmICh0eXBlb2YgY3NzID09PSAnc3RyaW5nJykge1xuICAgICAgY29uc3Qgc3R5bGUgPSBuZXcgQ1NTU3R5bGVTaGVldCgpO1xuICAgICAgc3R5bGUucmVwbGFjZVN5bmMoY3NzKTtcbiAgICAgIHJldHVybiBzdHlsZTtcbiAgICB9XG5cbiAgICByZXR1cm4gY3NzO1xuICB9KTtcblxuICBkb2MuYWRvcHRlZFN0eWxlU2hlZXRzID0gWy4uLmRvYy5hZG9wdGVkU3R5bGVTaGVldHMsIC4uLnN0eWxlc107XG5cbiAgcmV0dXJuIHN0eWxlcztcbn1cbiIsImltcG9ydCB7IHNlbGVjdE9uZSB9IGZyb20gJy4vZG9tJztcblxuZXhwb3J0IGZ1bmN0aW9uIGFuaW1hdGVUbyhcbiAgZWxlbWVudDogSFRNTEVsZW1lbnQsXG4gIHN0eWxlczogUGFydGlhbDxSZWNvcmQ8a2V5b2YgQ1NTU3R5bGVEZWNsYXJhdGlvbiwgYW55Pj4sXG4gIG9wdGlvbnM6IG51bWJlciB8IEtleWZyYW1lQW5pbWF0aW9uT3B0aW9ucyA9IHt9XG4pOiBBbmltYXRpb24ge1xuICBlbGVtZW50ID0gc2VsZWN0T25lKGVsZW1lbnQpO1xuXG4gIGNvbnN0IGN1cnJlbnRTdHlsZXMgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KTtcbiAgY29uc3QgdHJhbnNpdGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueVtdPiA9IHt9O1xuXG4gIGZvciAoY29uc3QgbmFtZSBpbiBzdHlsZXMpIHtcbiAgICBjb25zdCB2YWx1ZSA9IHN0eWxlc1tuYW1lXTtcblxuICAgIHRyYW5zaXRpb25zW25hbWVdID0gQXJyYXkuaXNBcnJheSh2YWx1ZSlcbiAgICAgID8gdmFsdWVcbiAgICAgIDogW1xuICAgICAgICBjdXJyZW50U3R5bGVzLmdldFByb3BlcnR5VmFsdWUobmFtZSksXG4gICAgICAgIHZhbHVlXG4gICAgICBdO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnbnVtYmVyJykge1xuICAgIG9wdGlvbnMgPSB7IGR1cmF0aW9uOiBvcHRpb25zIH07XG4gIH1cblxuICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbihcbiAgICB7XG4gICAgICBkdXJhdGlvbjogNDAwLFxuICAgICAgZWFzaW5nOiAnbGluZWFyJyxcbiAgICAgIGZpbGw6ICdib3RoJ1xuICAgIH0sXG4gICAgb3B0aW9uc1xuICApO1xuXG4gIGNvbnN0IGFuaW1hdGlvbiA9IGVsZW1lbnQuYW5pbWF0ZShcbiAgICB0cmFuc2l0aW9ucyxcbiAgICBvcHRpb25zXG4gICk7XG5cbiAgYW5pbWF0aW9uLmFkZEV2ZW50TGlzdGVuZXIoJ2ZpbmlzaCcsICgpID0+IHtcbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gc3R5bGVzKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IHN0eWxlc1tuYW1lXTtcblxuICAgICAgZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcbiAgICAgICAgbmFtZSxcbiAgICAgICAgQXJyYXkuaXNBcnJheSh2YWx1ZSlcbiAgICAgICAgICA/IHZhbHVlW3ZhbHVlLmxlbmd0aCAtIDFdXG4gICAgICAgICAgOiB2YWx1ZVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBhbmltYXRpb24uY2FuY2VsKCk7XG4gIH0pO1xuXG4gIHJldHVybiBhbmltYXRpb247XG59XG4iLCJleHBvcnQgdHlwZSBBbGVydEhhbmRsZXIgPSAodGl0bGU6IHN0cmluZywgdGV4dD86IHN0cmluZywgaWNvbj86IHN0cmluZywgZXh0cmE/OiBhbnkpID0+IFByb21pc2U8dm9pZD47XHJcbmV4cG9ydCB0eXBlIENvbmZpcm1IYW5kbGVyID0gKHRpdGxlOiBzdHJpbmcsIHRleHQ/OiBzdHJpbmcsIGljb24/OiBzdHJpbmcsIGV4dHJhPzogYW55KSA9PiBQcm9taXNlPGJvb2xlYW4+O1xyXG5cclxuZXhwb3J0IGNsYXNzIEFsZXJ0QWRhcHRlciB7XHJcbiAgc3RhdGljIGFsZXJ0OiBBbGVydEhhbmRsZXIgPSBhc3luYyAodGl0bGU6IHN0cmluZykgPT4gd2luZG93LmFsZXJ0KHRpdGxlKTtcclxuICBzdGF0aWMgY29uZmlybTogQ29uZmlybUhhbmRsZXIgPSBhc3luYyAodGl0bGU6IHN0cmluZykgPT4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPGJvb2xlYW4+KChyZXNvbHZlKSA9PiB7XHJcbiAgICAgIGNvbnN0IHYgPSBjb25maXJtKHRpdGxlKTtcclxuXHJcbiAgICAgIHJlc29sdmUodik7XHJcbiAgICB9KTtcclxuICB9O1xyXG4gIHN0YXRpYyBkZWxldGVDb25maXJtOiBDb25maXJtSGFuZGxlciA9IGFzeW5jICh0aXRsZTogc3RyaW5nKSA9PiB0aGlzLmNvbmZpcm0odGl0bGUpO1xyXG5cclxuICBzdGF0aWMgY29uZmlybVRleHQ6ICgpID0+IHN0cmluZyA9ICgpID0+ICfnorroqo0nO1xyXG4gIHN0YXRpYyBjYW5jZWxUZXh0OiAoKSA9PiBzdHJpbmcgPSAoKSA9PiAn5Y+W5raIJztcclxuICBzdGF0aWMgZGVsZXRlVGV4dDogKCkgPT4gc3RyaW5nID0gKCkgPT4gJ+WIqumZpCc7XHJcbn1cclxuXHJcbiIsImltcG9ydCB7IEFsZXJ0QWRhcHRlciB9IGZyb20gJy4vYWxlcnQtYWRhcHRlcic7XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2ltcGxlQWxlcnQoXHJcbiAgdGl0bGU6IHN0cmluZyxcclxuICB0ZXh0OiBzdHJpbmcgPSAnJyxcclxuICBpY29uOiBzdHJpbmcgPSAnaW5mbycsXHJcbiAgZXh0cmE/OiBhbnlcclxuKSB7XHJcbiAgcmV0dXJuIEFsZXJ0QWRhcHRlci5hbGVydCh0aXRsZSwgdGV4dCwgaWNvbiwgZXh0cmEpO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2ltcGxlQ29uZmlybShcclxuICB0aXRsZTogc3RyaW5nLFxyXG4gIHRleHQ6IHN0cmluZyA9ICcnLFxyXG4gIGljb246IHN0cmluZyA9ICdpbmZvJyxcclxuICBleHRyYT86IGFueSxcclxuKSB7XHJcbiAgcmV0dXJuIEFsZXJ0QWRhcHRlci5jb25maXJtKHRpdGxlLCB0ZXh0LCBpY29uLCBleHRyYSk7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVDb25maXJtKFxyXG4gIHRpdGxlOiBzdHJpbmcsXHJcbiAgdGV4dDogc3RyaW5nID0gJycsXHJcbiAgaWNvbjogc3RyaW5nID0gJ2luZm8nLFxyXG4gIGV4dHJhPzogYW55LFxyXG4pIHtcclxuICByZXR1cm4gQWxlcnRBZGFwdGVyLmRlbGV0ZUNvbmZpcm0odGl0bGUsIHRleHQsIGljb24sIGV4dHJhKTtcclxufVxyXG4iLCJcbmV4cG9ydCBmdW5jdGlvbiBnZXRHbG9iYWxUaGlzKCkge1xuICByZXR1cm4gZ2xvYmFsVGhpcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQnJvd3NlcigpIHtcbiAgcmV0dXJuIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNOb2RlKCkge1xuICByZXR1cm4gdHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCc7XG59XG4iLCJpbXBvcnQgeyBpc05vZGUgfSBmcm9tICcuL2Vudic7XG5cbmV4cG9ydCBmdW5jdGlvbiBiYXNlNjRVcmxFbmNvZGUoc3RyaW5nOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gYnRvYShTdHJpbmcoc3RyaW5nKSlcbiAgICAucmVwbGFjZSgvXFwrLywgJy0nKVxuICAgIC5yZXBsYWNlKG5ldyBSZWdFeHAoJ1xcXFwvJyksICdfJylcbiAgICAucmVwbGFjZSgvPSskLywgJycpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYmFzZTY0VXJsRGVjb2RlKHN0cmluZzogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIGF0b2IoXG4gICAgU3RyaW5nKHN0cmluZylcbiAgICAgIC5yZXBsYWNlKC8tLywgJysnKVxuICAgICAgLnJlcGxhY2UoL18vLCAnLycpXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1aWQocHJlZml4OiBzdHJpbmcgPSAnJywgdGltZWJhc2U6IGJvb2xlYW4gPSBmYWxzZSk6IHN0cmluZyB7XG4gIGlmICh0aW1lYmFzZSkge1xuICAgIGNvbnN0IHN0YXJ0ID0gcGVyZm9ybWFuY2U/LnRpbWVPcmlnaW5cbiAgICAgID8gTWF0aC5yb3VuZChwZXJmb3JtYW5jZS50aW1lT3JpZ2luKVxuICAgICAgOiBwZXJmb3JtYW5jZS50aW1pbmcubmF2aWdhdGlvblN0YXJ0O1xuXG4gICAgY29uc3QgdGltZSA9IChzdGFydCAqIDEwMDAwMCkgKyAocGVyZm9ybWFuY2Uubm93KCkgKiAxMDApO1xuXG4gICAgcmV0dXJuIHByZWZpeCArIHRpbWUudG9TdHJpbmcoMTIpICsgKHJhbmRvbUJ5dGVzU3RyaW5nKDQpKTtcbiAgfVxuXG4gIHJldHVybiBwcmVmaXggKyByYW5kb21CeXRlc1N0cmluZygxMik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0aWQocHJlZml4OiBzdHJpbmcgPSAnJyk6IHN0cmluZyB7XG4gIHJldHVybiB1aWQocHJlZml4LCB0cnVlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJhbmRvbUJ5dGVzU3RyaW5nKHNpemU6IG51bWJlciA9IDEyKTogc3RyaW5nIHtcbiAgaWYgKCFpc05vZGUoKSAmJiAhZ2xvYmFsVGhpcy5jcnlwdG8pIHtcbiAgICByZXR1cm4gU3RyaW5nKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChzaXplICoqIDEwKSkpO1xuICB9XG5cbiAgcmV0dXJuIEFycmF5LmZyb20ocmFuZG9tQnl0ZXMoc2l6ZSkpXG4gICAgLm1hcCh4ID0+IHgudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsICcwJykpXG4gICAgLmpvaW4oJycpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmFuZG9tQnl0ZXMoc2l6ZTogbnVtYmVyID0gMTIpOiBVaW50OEFycmF5IHtcbiAgY29uc3QgYXJyID0gbmV3IFVpbnQ4QXJyYXkoc2l6ZSk7XG4gIGdsb2JhbFRoaXMuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhhcnIpO1xuICByZXR1cm4gYXJyO1xufVxuXG5leHBvcnQgY29uc3QgU1RSX1NFRURfQkFTRTMyID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaMjM0NTY3JztcbmV4cG9ydCBjb25zdCBTVFJfU0VFRF9CQVNFMzJIRVggPSAnMDEyMzQ1Njc4OUFCQ0RFRkdISUpLTE1OT1BRUlNUVVYnO1xuZXhwb3J0IGNvbnN0IFNUUl9TRUVEX0JBU0UzNiA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWjAxMjM0NTY3ODknO1xuZXhwb3J0IGNvbnN0IFNUUl9TRUVEX0JBU0U1OCA9ICcxMjM0NTY3ODlBQkNERUZHSEpLTE1OUFFSU1RVVldYWVphYmNkZWZnaGlqa21ub3BxcnN0dXZ3eHl6JztcbmV4cG9ydCBjb25zdCBTVFJfU0VFRF9CQVNFNjRTQUZFID0gJzAxMjM0NTY3ODlhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ekFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaJztcbmV4cG9ydCBjb25zdCBTVFJfU0VFRF9CQVNFNjIgPSAnMDEyMzQ1Njc4OWFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVonO1xuXG5leHBvcnQgZnVuY3Rpb24gcmFuZG9tU3RyaW5nKGxlbmd0aDogbnVtYmVyLCBjaGFyYWN0ZXJzOiBzdHJpbmcgPSBTVFJfU0VFRF9CQVNFNjIpOiBzdHJpbmcge1xuICBsZXQgcmVzdWx0ID0gJyc7XG4gIGNvbnN0IGNoYXJhY3RlcnNMZW5ndGggPSBjaGFyYWN0ZXJzLmxlbmd0aDtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgcmVzdWx0ICs9IGNoYXJhY3RlcnMuY2hhckF0KE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNoYXJhY3RlcnNMZW5ndGgpKTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG4iLCJleHBvcnQgY2xhc3MgVGFza1F1ZXVlIHtcbiAgaXRlbXM6ICgoKSA9PiBQcm9taXNlPGFueT4pW10gPSBbXTtcblxuICBjdXJyZW50UnVubmluZyA9IDA7XG5cbiAgcnVubmluZyA9IGZhbHNlO1xuXG4gIG9ic2VydmVyczoge1xuICAgIGhhbmRsZXI6IEZ1bmN0aW9uO1xuICAgIG9uY2U6IGJvb2xlYW47XG4gIH1bXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBtYXhSdW5uaW5nID0gMSkge1xuICAgIC8vXG4gIH1cblxuICBwdXNoPFQgZXh0ZW5kcyAoKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpPihjYWxsYmFjazogVCk6IFByb21pc2U8QXdhaXRlZDxSZXR1cm5UeXBlPFQ+Pj4ge1xuICAgIGNvbnN0IHAgPSBuZXcgUHJvbWlzZTxBd2FpdGVkPFJldHVyblR5cGU8VD4+PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLml0ZW1zLnB1c2goKCkgPT4ge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGNhbGxiYWNrKCkpLnRoZW4ocmVzb2x2ZSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMucnVuKCk7XG5cbiAgICByZXR1cm4gcDtcbiAgfVxuXG4gIHJ1bigpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMucnVubmluZykge1xuICAgICAgdGhpcy5ydW5uaW5nID0gdHJ1ZTtcbiAgICB9XG5cbiAgICB0aGlzLnBvcCgpO1xuICB9XG5cbiAgYXN5bmMgcG9wKCkge1xuICAgIGNvbnN0IGNhbGxiYWNrID0gdGhpcy5pdGVtcy5zaGlmdCgpO1xuXG4gICAgLy8gSWYgZW1wdHksIHN0b3AgcnVubmluZy5cbiAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICB0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG5cbiAgICAvLyBJZiBjdXJyZW50IHJ1bm5pbmcgZnVsbCwgc2V0IGJhY2sgdG8gcXVldWUgYW5kIGxlYXZlLlxuICAgIGlmICh0aGlzLmN1cnJlbnRSdW5uaW5nID49IHRoaXMubWF4UnVubmluZykge1xuICAgICAgdGhpcy5pdGVtcy51bnNoaWZ0KGNhbGxiYWNrKTtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG5cbiAgICB0aGlzLmN1cnJlbnRSdW5uaW5nKys7XG5cbiAgICB0aGlzLm5vdGljZSgpO1xuXG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBhd2FpdCBjYWxsYmFjaygpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRocm93IGU7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMuZW5kUG9wKCk7XG4gICAgfVxuICB9XG5cbiAgZW5kUG9wKCkge1xuICAgIHRoaXMuY3VycmVudFJ1bm5pbmctLTtcbiAgICB0aGlzLm5vdGljZSgpO1xuICAgIHRoaXMucG9wKCk7XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICB0aGlzLml0ZW1zID0gW107XG5cbiAgICB0aGlzLm5vdGljZSgpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBpc0VtcHR5KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLml0ZW1zLmxlbmd0aCA9PT0gMDtcbiAgfVxuXG4gIGdldCBsZW5ndGgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5pdGVtcy5sZW5ndGg7XG4gIH1cblxuICBwZWVrKCkge1xuICAgIHJldHVybiB0aGlzLml0ZW1zO1xuICB9XG5cbiAgb2JzZXJ2ZShoYW5kbGVyOiBPYnNlcnZlckZ1bmN0aW9uLCBvcHRpb25zOiB7IG9uY2U/OiBib29sZWFuIH0gPSB7fSk6ICgpID0+IHZvaWQge1xuICAgIHRoaXMub2JzZXJ2ZXJzLnB1c2goe1xuICAgICAgaGFuZGxlcixcbiAgICAgIG9uY2U6IG9wdGlvbnMub25jZSB8fCBmYWxzZSxcbiAgICB9KTtcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB0aGlzLm9mZihoYW5kbGVyKTtcbiAgICB9O1xuICB9XG5cbiAgb25jZShoYW5kbGVyOiBPYnNlcnZlckZ1bmN0aW9uLCBvcHRpb25zOiB7IG9uY2U/OiBib29sZWFuIH0gPSB7fSk6ICgpID0+IHZvaWQge1xuICAgIG9wdGlvbnMub25jZSA9IHRydWU7XG5cbiAgICByZXR1cm4gdGhpcy5vYnNlcnZlKGhhbmRsZXIsIG9wdGlvbnMpO1xuICB9XG5cbiAgb25FbmQoY2FsbGJhY2s6IE9ic2VydmVyRnVuY3Rpb24sIG9wdGlvbnM6IHsgb25jZT86IGJvb2xlYW4gfSA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMub2JzZXJ2ZSgocXVldWUsIGxlbmd0aCwgcnVubmluZykgPT4ge1xuICAgICAgaWYgKGxlbmd0aCA9PT0gMCAmJiBydW5uaW5nID09PSAwKSB7XG4gICAgICAgIGNhbGxiYWNrKHF1ZXVlLCBsZW5ndGgsIHJ1bm5pbmcpO1xuICAgICAgfVxuICAgIH0sIG9wdGlvbnMpO1xuICB9XG5cbiAgbm90aWNlKCkge1xuICAgIHRoaXMub2JzZXJ2ZXJzLmZvckVhY2goKG9ic2VydmVyKSA9PiB7XG4gICAgICBvYnNlcnZlci5oYW5kbGVyKHRoaXMsIHRoaXMubGVuZ3RoLCB0aGlzLmN1cnJlbnRSdW5uaW5nKTtcbiAgICB9KTtcblxuICAgIHRoaXMub2JzZXJ2ZXJzID0gdGhpcy5vYnNlcnZlcnMuZmlsdGVyKChvYnNlcnZlcikgPT4gIW9ic2VydmVyLm9uY2UpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBvZmYoY2FsbGJhY2s/OiBGdW5jdGlvbikge1xuICAgIGlmIChjYWxsYmFjayA9PSBudWxsKSB7XG4gICAgICB0aGlzLm9ic2VydmVycyA9IFtdO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdGhpcy5vYnNlcnZlcnMgPSB0aGlzLm9ic2VydmVycy5maWx0ZXIoKG9ic2VydmVyKSA9PiBvYnNlcnZlci5oYW5kbGVyICE9PSBjYWxsYmFjayk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cblxuZGVjbGFyZSB0eXBlIE9ic2VydmVyRnVuY3Rpb24gPSAocXVldWU6IFRhc2tRdWV1ZSwgbGVuZ3RoOiBudW1iZXIsIHJ1bm5pbmc6IG51bWJlcikgPT4gdm9pZFxuXG5leHBvcnQgZnVuY3Rpb24gcXVldWUobWF4UnVubmluZzogbnVtYmVyID0gMSkge1xuICByZXR1cm4gbmV3IFRhc2tRdWV1ZShtYXhSdW5uaW5nKTtcbn1cbiIsImRlY2xhcmUgdHlwZSBTdGFja0hhbmRsZXI8VD4gPSAoc3RhY2s6IFN0YWNrPFQ+LCBsZW5ndGg6IG51bWJlcikgPT4gdm9pZDtcblxuZGVjbGFyZSB0eXBlIFN0YWNrVmFsdWU8Vj4gPSBWIHwgdHJ1ZTtcblxuZXhwb3J0IGNsYXNzIFN0YWNrPFQgPSBhbnk+IHtcbiAgb2JzZXJ2ZXJzOiB7IGhhbmRsZXI6IFN0YWNrSGFuZGxlcjxUPiwgb25jZTogYm9vbGVhbiB9W10gPSBbXTtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgc3RvcmU6IFN0YWNrVmFsdWU8VD5bXSA9IFtdKSB7XG4gICAgLy9cbiAgfVxuXG4gIHB1c2godmFsdWU/OiBUKTogbnVtYmVyIHtcbiAgICBjb25zdCByID0gdGhpcy5zdG9yZS5wdXNoKHZhbHVlID8/IHRydWUpO1xuXG4gICAgdGhpcy5ub3RpY2UoKTtcblxuICAgIHJldHVybiByO1xuICB9XG5cbiAgcG9wKCk6IFQgfCB0cnVlIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCByID0gdGhpcy5zdG9yZS5wb3AoKTtcblxuICAgIHRoaXMubm90aWNlKCk7XG5cbiAgICByZXR1cm4gcjtcbiAgfVxuXG4gIGNsZWFyKCk6IHRoaXMge1xuICAgIHRoaXMuc3RvcmUgPSBbXTtcblxuICAgIHRoaXMubm90aWNlKCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGlzRW1wdHkoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc3RvcmUubGVuZ3RoID09PSAwO1xuICB9XG5cbiAgZ2V0IGxlbmd0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5zdG9yZS5sZW5ndGg7XG4gIH1cblxuICBwZWVrKCk6IFN0YWNrVmFsdWU8VD5bXSB7XG4gICAgcmV0dXJuIHRoaXMuc3RvcmU7XG4gIH1cblxuICBvYnNlcnZlKGhhbmRsZXI6IChzdGFjazogU3RhY2ssIGxlbmd0aDogbnVtYmVyKSA9PiB2b2lkKTogKCkgPT4gdm9pZCB7XG4gICAgdGhpcy5vYnNlcnZlcnMucHVzaCh7XG4gICAgICBoYW5kbGVyLFxuICAgICAgb25jZTogZmFsc2VcbiAgICB9KTtcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB0aGlzLm9mZihoYW5kbGVyKTtcbiAgICB9O1xuICB9XG5cbiAgb25jZShoYW5kbGVyOiBTdGFja0hhbmRsZXI8VD4pOiAoKSA9PiB2b2lkIHtcbiAgICB0aGlzLm9ic2VydmVycy5wdXNoKHtcbiAgICAgIGhhbmRsZXIsXG4gICAgICBvbmNlOiB0cnVlXG4gICAgfSk7XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgdGhpcy5vZmYoaGFuZGxlcik7XG4gICAgfTtcbiAgfVxuXG4gIG5vdGljZSgpOiB0aGlzIHtcbiAgICB0aGlzLm9ic2VydmVycy5mb3JFYWNoKChvYnNlcnZlcikgPT4ge1xuICAgICAgb2JzZXJ2ZXIuaGFuZGxlcih0aGlzLCB0aGlzLmxlbmd0aCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLm9ic2VydmVycyA9IHRoaXMub2JzZXJ2ZXJzLmZpbHRlcigob2JzZXJ2ZXIpID0+IG9ic2VydmVyLm9uY2UgIT09IHRydWUpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBvZmYoY2FsbGJhY2s/OiBTdGFja0hhbmRsZXI8VD4pOiB0aGlzIHtcbiAgICB0aGlzLm9ic2VydmVycyA9IHRoaXMub2JzZXJ2ZXJzLmZpbHRlcigob2JzZXJ2ZXIpID0+IG9ic2VydmVyLmhhbmRsZXIgIT09IGNhbGxiYWNrKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RhY2s8VCA9IGFueT4oc3RvcmU6IGFueVtdID0gW10pIHtcbiAgcmV0dXJuIG5ldyBTdGFjazxUPihzdG9yZSk7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gc2xlZXAodGltZTogbnVtYmVyKSB7XHJcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICBzZXRUaW1lb3V0KHJlc29sdmUsIHRpbWUpO1xyXG4gIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbmV4dFRpY2soY2FsbGJhY2sgPSAoKSA9PiB7fSkge1xyXG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKGNhbGxiYWNrKTtcclxufVxyXG4iLCJpbXBvcnQgeyB1aWQsIHRpZCwgcmFuZG9tQnl0ZXMsIHJhbmRvbUJ5dGVzU3RyaW5nIH0gZnJvbSAnQGx5cmFzb2Z0L3RzLXRvb2xraXQvZ2VuZXJpYyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBiYXNlNjRVcmxFbmNvZGUoc3RyaW5nOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gYnRvYShTdHJpbmcoc3RyaW5nKSlcbiAgICAucmVwbGFjZSgvXFwrLywgJy0nKVxuICAgIC5yZXBsYWNlKG5ldyBSZWdFeHAoJ1xcXFwvJyksICdfJylcbiAgICAucmVwbGFjZSgvPSskLywgJycpO1xufVxuXG4vKipcbiAqIEJhc2U2NCBVUkwgZGVjb2RlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBiYXNlNjRVcmxEZWNvZGUoc3RyaW5nOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gYXRvYihcbiAgICBTdHJpbmcoc3RyaW5nKVxuICAgICAgLnJlcGxhY2UoLy0vLCAnKycpXG4gICAgICAucmVwbGFjZSgvXy8sICcvJylcbiAgKTtcbn1cblxuZXhwb3J0IHsgdWlkLCB0aWQsIHJhbmRvbUJ5dGVzLCByYW5kb21CeXRlc1N0cmluZyB9O1xuXG5sZXQgZ2xvYmFsU2VyaWFsID0gMTtcblxuZXhwb3J0IGZ1bmN0aW9uIHNlcmlhbCgpOiBudW1iZXIge1xuICByZXR1cm4gZ2xvYmFsU2VyaWFsKys7XG59XG4iLCJpbXBvcnQgeyBkYXRhIH0gZnJvbSAnLi4vZGF0YSc7XG5pbXBvcnQgeyBzbGVlcCB9IGZyb20gJ0BseXJhc29mdC90cy10b29sa2l0L2dlbmVyaWMnO1xuXG5leHBvcnQgeyBzbGVlcCB9O1xuXG5leHBvcnQgZnVuY3Rpb24gZm9yY2VBcnJheTxUPihpdGVtOiBUIHwgVFtdKTogVFtdIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoaXRlbSkpIHtcbiAgICByZXR1cm4gaXRlbTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gW2l0ZW1dO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWJvdW5jZTxUIGV4dGVuZHMgRnVuY3Rpb24gPSBGdW5jdGlvbj4oaGFuZGxlcjogVCwgd2FpdCA9IDEpOiBUIHtcbiAgbGV0IHRpbWVyOiBSZXR1cm5UeXBlPHR5cGVvZiBzZXRUaW1lb3V0PiB8IG51bWJlciwgcmVzdWx0OiBhbnk7XG4gIHJldHVybiBmdW5jdGlvbiAodGhpczogYW55LCAuLi5hcmdzOiBhbnlbXSkge1xuICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHJlc3VsdCA9IGhhbmRsZXIuY2FsbCh0aGlzLCAuLi5hcmdzKSwgd2FpdCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSBhcyBhbnkgYXMgVDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRocm90dGxlPFQgZXh0ZW5kcyBGdW5jdGlvbiA9IEZ1bmN0aW9uPihoYW5kbGVyOiBULCB3YWl0OiBudW1iZXIgPSAxKTogVCB7XG4gIGxldCB0aW1lcjogUmV0dXJuVHlwZTx0eXBlb2Ygc2V0VGltZW91dD4gfCBudW1iZXIgfCB1bmRlZmluZWQsIHJlc3VsdDogYW55O1xuICByZXR1cm4gZnVuY3Rpb24gKHRoaXM6IGFueSwgLi4uYXJnczogYW55W10pIHtcbiAgICBpZiAoIXRpbWVyKSB7XG4gICAgICByZXR1cm4gcmVzdWx0ID0gaGFuZGxlci5jYWxsKHRoaXMsIC4uLmFyZ3MpO1xuICAgIH1cblxuICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHRpbWVyID0gdW5kZWZpbmVkLCB3YWl0KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9IGFzIGFueSBhcyBUO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNEZWJ1ZygpIHtcbiAgcmV0dXJuIEJvb2xlYW4oZGF0YSgnd2luZHdhbGtlci5kZWJ1ZycpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5leHRUaWNrKGNhbGxiYWNrPzogKCkgPT4gYW55KTogUHJvbWlzZTxhbnk+IHtcbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oY2FsbGJhY2sgPz8gKCgpID0+IG51bGwpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdhaXQ8VCBleHRlbmRzIHJlYWRvbmx5IHVua25vd25bXT4oXG4gIC4uLnByb21pc2VlOiB7IFtLIGluIGtleW9mIFRdOiBQcm9taXNlTGlrZTxUW0tdPiB8IFRbS10gfVxuKTogUHJvbWlzZTxBd2FpdGVkPFQ+PiB7XG4gIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlZSkgYXMgUHJvbWlzZTxBd2FpdGVkPFQ+Pjtcbn1cbiIsIi8qIGdsb2JhbCB3aW5kb3csIGV4cG9ydHMsIGRlZmluZSAqL1xuXG4hZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnXG5cbiAgICB2YXIgcmUgPSB7XG4gICAgICAgIG5vdF9zdHJpbmc6IC9bXnNdLyxcbiAgICAgICAgbm90X2Jvb2w6IC9bXnRdLyxcbiAgICAgICAgbm90X3R5cGU6IC9bXlRdLyxcbiAgICAgICAgbm90X3ByaW1pdGl2ZTogL1tedl0vLFxuICAgICAgICBudW1iZXI6IC9bZGllZmddLyxcbiAgICAgICAgbnVtZXJpY19hcmc6IC9bYmNkaWVmZ3V4WF0vLFxuICAgICAgICBqc29uOiAvW2pdLyxcbiAgICAgICAgbm90X2pzb246IC9bXmpdLyxcbiAgICAgICAgdGV4dDogL15bXlxceDI1XSsvLFxuICAgICAgICBtb2R1bG86IC9eXFx4MjV7Mn0vLFxuICAgICAgICBwbGFjZWhvbGRlcjogL15cXHgyNSg/OihbMS05XVxcZCopXFwkfFxcKChbXildKylcXCkpPyhcXCspPygwfCdbXiRdKT8oLSk/KFxcZCspPyg/OlxcLihcXGQrKSk/KFtiLWdpam9zdFR1dnhYXSkvLFxuICAgICAgICBrZXk6IC9eKFthLXpfXVthLXpfXFxkXSopL2ksXG4gICAgICAgIGtleV9hY2Nlc3M6IC9eXFwuKFthLXpfXVthLXpfXFxkXSopL2ksXG4gICAgICAgIGluZGV4X2FjY2VzczogL15cXFsoXFxkKylcXF0vLFxuICAgICAgICBzaWduOiAvXlsrLV0vXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3ByaW50ZihrZXkpIHtcbiAgICAgICAgLy8gYGFyZ3VtZW50c2AgaXMgbm90IGFuIGFycmF5LCBidXQgc2hvdWxkIGJlIGZpbmUgZm9yIHRoaXMgY2FsbFxuICAgICAgICByZXR1cm4gc3ByaW50Zl9mb3JtYXQoc3ByaW50Zl9wYXJzZShrZXkpLCBhcmd1bWVudHMpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdnNwcmludGYoZm10LCBhcmd2KSB7XG4gICAgICAgIHJldHVybiBzcHJpbnRmLmFwcGx5KG51bGwsIFtmbXRdLmNvbmNhdChhcmd2IHx8IFtdKSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzcHJpbnRmX2Zvcm1hdChwYXJzZV90cmVlLCBhcmd2KSB7XG4gICAgICAgIHZhciBjdXJzb3IgPSAxLCB0cmVlX2xlbmd0aCA9IHBhcnNlX3RyZWUubGVuZ3RoLCBhcmcsIG91dHB1dCA9ICcnLCBpLCBrLCBwaCwgcGFkLCBwYWRfY2hhcmFjdGVyLCBwYWRfbGVuZ3RoLCBpc19wb3NpdGl2ZSwgc2lnblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdHJlZV9sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBwYXJzZV90cmVlW2ldID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIG91dHB1dCArPSBwYXJzZV90cmVlW2ldXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgcGFyc2VfdHJlZVtpXSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICBwaCA9IHBhcnNlX3RyZWVbaV0gLy8gY29udmVuaWVuY2UgcHVycG9zZXMgb25seVxuICAgICAgICAgICAgICAgIGlmIChwaC5rZXlzKSB7IC8vIGtleXdvcmQgYXJndW1lbnRcbiAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJndltjdXJzb3JdXG4gICAgICAgICAgICAgICAgICAgIGZvciAoayA9IDA7IGsgPCBwaC5rZXlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJnID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihzcHJpbnRmKCdbc3ByaW50Zl0gQ2Fubm90IGFjY2VzcyBwcm9wZXJ0eSBcIiVzXCIgb2YgdW5kZWZpbmVkIHZhbHVlIFwiJXNcIicsIHBoLmtleXNba10sIHBoLmtleXNbay0xXSkpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBhcmdbcGgua2V5c1trXV1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChwaC5wYXJhbV9ubykgeyAvLyBwb3NpdGlvbmFsIGFyZ3VtZW50IChleHBsaWNpdClcbiAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJndltwaC5wYXJhbV9ub11cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7IC8vIHBvc2l0aW9uYWwgYXJndW1lbnQgKGltcGxpY2l0KVxuICAgICAgICAgICAgICAgICAgICBhcmcgPSBhcmd2W2N1cnNvcisrXVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChyZS5ub3RfdHlwZS50ZXN0KHBoLnR5cGUpICYmIHJlLm5vdF9wcmltaXRpdmUudGVzdChwaC50eXBlKSAmJiBhcmcgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBhcmcgPSBhcmcoKVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChyZS5udW1lcmljX2FyZy50ZXN0KHBoLnR5cGUpICYmICh0eXBlb2YgYXJnICE9PSAnbnVtYmVyJyAmJiBpc05hTihhcmcpKSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHNwcmludGYoJ1tzcHJpbnRmXSBleHBlY3RpbmcgbnVtYmVyIGJ1dCBmb3VuZCAlVCcsIGFyZykpXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHJlLm51bWJlci50ZXN0KHBoLnR5cGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzX3Bvc2l0aXZlID0gYXJnID49IDBcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHBoLnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnYic6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBwYXJzZUludChhcmcsIDEwKS50b1N0cmluZygyKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnYyc6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHBhcnNlSW50KGFyZywgMTApKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnZCc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2knOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gcGFyc2VJbnQoYXJnLCAxMClcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2onOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gSlNPTi5zdHJpbmdpZnkoYXJnLCBudWxsLCBwaC53aWR0aCA/IHBhcnNlSW50KHBoLndpZHRoKSA6IDApXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdlJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IHBoLnByZWNpc2lvbiA/IHBhcnNlRmxvYXQoYXJnKS50b0V4cG9uZW50aWFsKHBoLnByZWNpc2lvbikgOiBwYXJzZUZsb2F0KGFyZykudG9FeHBvbmVudGlhbCgpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdmJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IHBoLnByZWNpc2lvbiA/IHBhcnNlRmxvYXQoYXJnKS50b0ZpeGVkKHBoLnByZWNpc2lvbikgOiBwYXJzZUZsb2F0KGFyZylcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2cnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gcGgucHJlY2lzaW9uID8gU3RyaW5nKE51bWJlcihhcmcudG9QcmVjaXNpb24ocGgucHJlY2lzaW9uKSkpIDogcGFyc2VGbG9hdChhcmcpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdvJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IChwYXJzZUludChhcmcsIDEwKSA+Pj4gMCkudG9TdHJpbmcoOClcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3MnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gU3RyaW5nKGFyZylcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IChwaC5wcmVjaXNpb24gPyBhcmcuc3Vic3RyaW5nKDAsIHBoLnByZWNpc2lvbikgOiBhcmcpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICd0JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IFN0cmluZyghIWFyZylcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IChwaC5wcmVjaXNpb24gPyBhcmcuc3Vic3RyaW5nKDAsIHBoLnByZWNpc2lvbikgOiBhcmcpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdUJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcmcpLnNsaWNlKDgsIC0xKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSAocGgucHJlY2lzaW9uID8gYXJnLnN1YnN0cmluZygwLCBwaC5wcmVjaXNpb24pIDogYXJnKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAndSc6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBwYXJzZUludChhcmcsIDEwKSA+Pj4gMFxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAndic6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBhcmcudmFsdWVPZigpXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSAocGgucHJlY2lzaW9uID8gYXJnLnN1YnN0cmluZygwLCBwaC5wcmVjaXNpb24pIDogYXJnKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAneCc6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSAocGFyc2VJbnQoYXJnLCAxMCkgPj4+IDApLnRvU3RyaW5nKDE2KVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnWCc6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSAocGFyc2VJbnQoYXJnLCAxMCkgPj4+IDApLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmUuanNvbi50ZXN0KHBoLnR5cGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dCArPSBhcmdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZS5udW1iZXIudGVzdChwaC50eXBlKSAmJiAoIWlzX3Bvc2l0aXZlIHx8IHBoLnNpZ24pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaWduID0gaXNfcG9zaXRpdmUgPyAnKycgOiAnLSdcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IGFyZy50b1N0cmluZygpLnJlcGxhY2UocmUuc2lnbiwgJycpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaWduID0gJydcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBwYWRfY2hhcmFjdGVyID0gcGgucGFkX2NoYXIgPyBwaC5wYWRfY2hhciA9PT0gJzAnID8gJzAnIDogcGgucGFkX2NoYXIuY2hhckF0KDEpIDogJyAnXG4gICAgICAgICAgICAgICAgICAgIHBhZF9sZW5ndGggPSBwaC53aWR0aCAtIChzaWduICsgYXJnKS5sZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgcGFkID0gcGgud2lkdGggPyAocGFkX2xlbmd0aCA+IDAgPyBwYWRfY2hhcmFjdGVyLnJlcGVhdChwYWRfbGVuZ3RoKSA6ICcnKSA6ICcnXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dCArPSBwaC5hbGlnbiA/IHNpZ24gKyBhcmcgKyBwYWQgOiAocGFkX2NoYXJhY3RlciA9PT0gJzAnID8gc2lnbiArIHBhZCArIGFyZyA6IHBhZCArIHNpZ24gKyBhcmcpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXRwdXRcbiAgICB9XG5cbiAgICB2YXIgc3ByaW50Zl9jYWNoZSA9IE9iamVjdC5jcmVhdGUobnVsbClcblxuICAgIGZ1bmN0aW9uIHNwcmludGZfcGFyc2UoZm10KSB7XG4gICAgICAgIGlmIChzcHJpbnRmX2NhY2hlW2ZtdF0pIHtcbiAgICAgICAgICAgIHJldHVybiBzcHJpbnRmX2NhY2hlW2ZtdF1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBfZm10ID0gZm10LCBtYXRjaCwgcGFyc2VfdHJlZSA9IFtdLCBhcmdfbmFtZXMgPSAwXG4gICAgICAgIHdoaWxlIChfZm10KSB7XG4gICAgICAgICAgICBpZiAoKG1hdGNoID0gcmUudGV4dC5leGVjKF9mbXQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHBhcnNlX3RyZWUucHVzaChtYXRjaFswXSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKChtYXRjaCA9IHJlLm1vZHVsby5leGVjKF9mbXQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHBhcnNlX3RyZWUucHVzaCgnJScpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICgobWF0Y2ggPSByZS5wbGFjZWhvbGRlci5leGVjKF9mbXQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlmIChtYXRjaFsyXSkge1xuICAgICAgICAgICAgICAgICAgICBhcmdfbmFtZXMgfD0gMVxuICAgICAgICAgICAgICAgICAgICB2YXIgZmllbGRfbGlzdCA9IFtdLCByZXBsYWNlbWVudF9maWVsZCA9IG1hdGNoWzJdLCBmaWVsZF9tYXRjaCA9IFtdXG4gICAgICAgICAgICAgICAgICAgIGlmICgoZmllbGRfbWF0Y2ggPSByZS5rZXkuZXhlYyhyZXBsYWNlbWVudF9maWVsZCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWVsZF9saXN0LnB1c2goZmllbGRfbWF0Y2hbMV0pXG4gICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAoKHJlcGxhY2VtZW50X2ZpZWxkID0gcmVwbGFjZW1lbnRfZmllbGQuc3Vic3RyaW5nKGZpZWxkX21hdGNoWzBdLmxlbmd0aCkpICE9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoZmllbGRfbWF0Y2ggPSByZS5rZXlfYWNjZXNzLmV4ZWMocmVwbGFjZW1lbnRfZmllbGQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZF9saXN0LnB1c2goZmllbGRfbWF0Y2hbMV0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKChmaWVsZF9tYXRjaCA9IHJlLmluZGV4X2FjY2Vzcy5leGVjKHJlcGxhY2VtZW50X2ZpZWxkKSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRfbGlzdC5wdXNoKGZpZWxkX21hdGNoWzFdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKCdbc3ByaW50Zl0gZmFpbGVkIHRvIHBhcnNlIG5hbWVkIGFyZ3VtZW50IGtleScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKCdbc3ByaW50Zl0gZmFpbGVkIHRvIHBhcnNlIG5hbWVkIGFyZ3VtZW50IGtleScpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hbMl0gPSBmaWVsZF9saXN0XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhcmdfbmFtZXMgfD0gMlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYXJnX25hbWVzID09PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignW3NwcmludGZdIG1peGluZyBwb3NpdGlvbmFsIGFuZCBuYW1lZCBwbGFjZWhvbGRlcnMgaXMgbm90ICh5ZXQpIHN1cHBvcnRlZCcpXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcGFyc2VfdHJlZS5wdXNoKFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcjogbWF0Y2hbMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbV9ubzogICAgbWF0Y2hbMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXlzOiAgICAgICAgbWF0Y2hbMl0sXG4gICAgICAgICAgICAgICAgICAgICAgICBzaWduOiAgICAgICAgbWF0Y2hbM10sXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWRfY2hhcjogICAgbWF0Y2hbNF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBhbGlnbjogICAgICAgbWF0Y2hbNV0sXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogICAgICAgbWF0Y2hbNl0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVjaXNpb246ICAgbWF0Y2hbN10sXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAgICAgICAgbWF0Y2hbOF1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcignW3NwcmludGZdIHVuZXhwZWN0ZWQgcGxhY2Vob2xkZXInKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX2ZtdCA9IF9mbXQuc3Vic3RyaW5nKG1hdGNoWzBdLmxlbmd0aClcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3ByaW50Zl9jYWNoZVtmbXRdID0gcGFyc2VfdHJlZVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGV4cG9ydCB0byBlaXRoZXIgYnJvd3NlciBvciBub2RlLmpzXG4gICAgICovXG4gICAgLyogZXNsaW50LWRpc2FibGUgcXVvdGUtcHJvcHMgKi9cbiAgICBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGV4cG9ydHNbJ3NwcmludGYnXSA9IHNwcmludGZcbiAgICAgICAgZXhwb3J0c1sndnNwcmludGYnXSA9IHZzcHJpbnRmXG4gICAgfVxuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICB3aW5kb3dbJ3NwcmludGYnXSA9IHNwcmludGZcbiAgICAgICAgd2luZG93Wyd2c3ByaW50ZiddID0gdnNwcmludGZcblxuICAgICAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmVbJ2FtZCddKSB7XG4gICAgICAgICAgICBkZWZpbmUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgJ3NwcmludGYnOiBzcHJpbnRmLFxuICAgICAgICAgICAgICAgICAgICAndnNwcmludGYnOiB2c3ByaW50ZlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG4gICAgLyogZXNsaW50LWVuYWJsZSBxdW90ZS1wcm9wcyAqL1xufSgpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4iLCJpbXBvcnQgeyBkYXRhIH0gZnJvbSAnLi4vZGF0YSc7XG5pbXBvcnQgeyBpc0RlYnVnIH0gZnJvbSAnLi8vaGVscGVyJztcbmltcG9ydCB7IERpY3Rpb25hcnkgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyB2c3ByaW50ZiB9IGZyb20gJ3NwcmludGYtanMnO1xuXG5sZXQgbGFuZzogVW5pY29ybkxhbmc7XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VMYW5nKCkge1xuICByZXR1cm4gbGFuZyA/Pz0gbmV3IFVuaWNvcm5MYW5nKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0cmFucyhpZDogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSkge1xuICByZXR1cm4gdXNlTGFuZygpLnRyYW5zKGlkLCAuLi5hcmdzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fKGlkOiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKSB7XG4gIHJldHVybiB0cmFucyhpZCwgLi4uYXJncyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFVuaWNvcm5MYW5nIHtcbiAgLyoqXG4gICAqIFRyYW5zbGF0ZSBhIHN0cmluZy5cbiAgICovXG4gIHRyYW5zKGlkOiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKTogc3RyaW5nIHtcbiAgICBjb25zdCBrZXkgPSB0aGlzLm5vcm1hbGl6ZShpZCk7XG5cbiAgICBsZXQgdHJhbnNsYXRlZCA9IHRoaXMuZ2V0KGtleSkgfHwgJyc7XG5cbiAgICB0cmFuc2xhdGVkID0gdGhpcy5yZXBsYWNlKHRyYW5zbGF0ZWQsIGFyZ3MpO1xuXG4gICAgcmV0dXJuIHRyYW5zbGF0ZWQgIT09ICcnID8gdHJhbnNsYXRlZCA6IHRoaXMud3JhcERlYnVnKGlkLCBmYWxzZSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVwbGFjZShzdHI6IHN0cmluZywgYXJnczogYW55W10pOiBzdHJpbmcge1xuICAgIGxldCByZXBsYWNlbWVudHM6IERpY3Rpb25hcnk8YW55PiA9IHt9O1xuICAgIGxldCB2YWx1ZXM6IGFueVtdID0gW107XG5cbiAgICBmb3IgKGNvbnN0IGFyZyBvZiBhcmdzKSB7XG4gICAgICBpZiAodHlwZW9mIGFyZyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmVwbGFjZW1lbnRzID0geyAuLi5yZXBsYWNlbWVudHMsIC4uLmFyZyB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWVzLnB1c2goYXJnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodmFsdWVzLmxlbmd0aCkge1xuICAgICAgc3RyID0gdnNwcmludGYoc3RyLCB2YWx1ZXMpO1xuICAgIH1cblxuICAgIGlmIChPYmplY3QudmFsdWVzKHJlcGxhY2VtZW50cykubGVuZ3RoKSB7XG4gICAgICBmb3IgKGNvbnN0IGtleSBpbiByZXBsYWNlbWVudHMpIHtcbiAgICAgICAgbGV0IHZhbHVlID0gcmVwbGFjZW1lbnRzW2tleV07XG5cbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHZhbHVlID0gdmFsdWUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKG5ldyBSZWdFeHAoJzonICsga2V5LCAnZycpLCBTdHJpbmcodmFsdWUpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc3RyO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmQgdGV4dC5cbiAgICovXG4gIGdldChpZDogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgY29uc3Qgc3RyaW5ncyA9IHRoaXMuZ2V0U3RyaW5ncygpO1xuXG4gICAgaWYgKHN0cmluZ3NbaWRdKSB7XG4gICAgICByZXR1cm4gc3RyaW5nc1tpZF07XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogSGFzIGxhbmd1YWdlIGtleS5cbiAgICovXG4gIGhhcyhrZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHN0cmluZ3MgPSB0aGlzLmdldFN0cmluZ3MoKTtcblxuICAgIHJldHVybiBzdHJpbmdzW2tleV0gIT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgbGFuZ3VhZ2Uga2V5LlxuICAgKi9cbiAgYWRkKGtleTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogdGhpcyB7XG4gICAgY29uc3Qgc3RyaW5ncyA9IHRoaXMuZ2V0U3RyaW5ncygpO1xuXG4gICAgc3RyaW5nc1t0aGlzLm5vcm1hbGl6ZShrZXkpXSA9IHZhbHVlO1xuXG4gICAgZGF0YSgndW5pY29ybi5sYW5ndWFnZXMnLCBzdHJpbmdzKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcGxhY2UgYWxsIHN5bWJvbHMgdG8gZG90KC4pLlxuICAgKi9cbiAgcHJvdGVjdGVkIG5vcm1hbGl6ZSh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL1teQS1aMC05XSsvaWcsICcuJyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgd3JhcERlYnVnKHRleHQ6IHN0cmluZywgc3VjY2VzczogYm9vbGVhbik6IHN0cmluZyB7XG4gICAgaWYgKGlzRGVidWcoKSkge1xuICAgICAgaWYgKHN1Y2Nlc3MpIHtcbiAgICAgICAgcmV0dXJuICcqKicgKyB0ZXh0ICsgJyoqJztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuICc/PycgKyB0ZXh0ICsgJz8/JztcbiAgICB9XG5cbiAgICByZXR1cm4gdGV4dDtcbiAgfVxuXG4gIGdldFN0cmluZ3MoKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB7XG4gICAgcmV0dXJuIGRhdGEoJ3VuaWNvcm4ubGFuZ3VhZ2VzJykgfHwge307XG4gIH1cbn1cbiIsImltcG9ydCB7IERpY3Rpb25hcnkgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBpbmplY3RDc3NUb0RvY3VtZW50IH0gZnJvbSAnLi8nO1xuXG5leHBvcnQgZnVuY3Rpb24gdXNlU2NyaXB0SW1wb3J0KHNyYzogc3RyaW5nLCBhdHRyczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9KTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICBzY3JpcHQuc3JjID0gc3JjO1xuXG4gIGZvciAoY29uc3Qga2V5IGluIGF0dHJzKSB7XG4gICAgc2NyaXB0LnNldEF0dHJpYnV0ZShrZXksIGF0dHJzW2tleV0pO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBzY3JpcHQub25sb2FkID0gKCkgPT4ge1xuICAgICAgcmVzb2x2ZSgpO1xuICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChzY3JpcHQpO1xuICAgIH07XG4gICAgc2NyaXB0Lm9uZXJyb3IgPSAoZSkgPT4ge1xuICAgICAgcmVqZWN0KGUpO1xuICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChzY3JpcHQpO1xuICAgIH07XG5cbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZG9JbXBvcnQ8VCA9IGFueT4oc3JjOiBzdHJpbmcpOiBQcm9taXNlPFQ+IHtcbiAgcmV0dXJuIGltcG9ydCgvKiBAdml0ZS1pZ25vcmUgKi9zcmMpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlSW1wb3J0KC4uLnNyYzogYW55W10pOiBQcm9taXNlPGFueT47XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlSW1wb3J0PFQgZXh0ZW5kcyBhbnlbXT4oLi4uc3JjOiBzdHJpbmdbXSk6IFByb21pc2U8VD47XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlSW1wb3J0PFQgPSBhbnk+KHNyYzogc3RyaW5nKTogUHJvbWlzZTx7IGRlZmF1bHQ6IFQgfT47XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlSW1wb3J0PEQgPSBhbnksIEMgPSBhbnk+KHNyYzogc3RyaW5nKTogUHJvbWlzZTx7IGRlZmF1bHQ6IEQgfSAmIERpY3Rpb25hcnk8Qz4+O1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUltcG9ydCguLi5zcmM6IGFueVtdKTogUHJvbWlzZTxhbnk+IHtcbiAgaWYgKHNyYy5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gZG9JbXBvcnQoc3JjWzBdKTtcbiAgfVxuXG4gIGNvbnN0IHByb21pc2VzOiBQcm9taXNlPGFueT5bXSA9IFtdO1xuXG4gIHNyYy5mb3JFYWNoKChsaW5rKSA9PiB7XG4gICAgcHJvbWlzZXMucHVzaChcbiAgICAgIGxpbmsgaW5zdGFuY2VvZiBQcm9taXNlID8gbGluayA6IGRvSW1wb3J0KGxpbmspXG4gICAgKTtcbiAgfSk7XG5cbiAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZVNlcmllc0ltcG9ydCguLi5zcmM6IGFueVtdKTogUHJvbWlzZTxhbnk+O1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZVNlcmllc0ltcG9ydDxUIGV4dGVuZHMgYW55W10+KC4uLnNyYzogc3RyaW5nW10pOiBQcm9taXNlPFQ+O1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZVNlcmllc0ltcG9ydDxUID0gYW55PihzcmM6IHN0cmluZyk6IFByb21pc2U8eyBkZWZhdWx0OiBUIH0+O1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZVNlcmllc0ltcG9ydDxEID0gYW55LCBDID0gYW55PihzcmM6IHN0cmluZyk6IFByb21pc2U8eyBkZWZhdWx0OiBEIH0gJiBEaWN0aW9uYXJ5PEM+PjtcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VTZXJpZXNJbXBvcnQoLi4uc3JjOiBhbnlbXSk6IFByb21pc2U8YW55PiB7XG4gIGNvbnN0IG1vZHVsZXM6IGFueVtdID0gW107XG5cbiAgZm9yIChjb25zdCBzb3VyY2Ugb2Ygc3JjKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoc291cmNlKSkge1xuICAgICAgY29uc3QgbSA9IGF3YWl0IHVzZUltcG9ydCguLi5zb3VyY2UpO1xuICAgICAgbW9kdWxlcy5wdXNoKG0pO1xuXG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBjb25zdCBtID0gYXdhaXQgdXNlSW1wb3J0KHNvdXJjZSk7XG5cbiAgICBtb2R1bGVzLnB1c2gobSk7XG4gIH1cblxuICByZXR1cm4gbW9kdWxlcztcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUNzc0luY2x1ZGVzKC4uLmhyZWZzOiBzdHJpbmdbXSk6IFByb21pc2U8dm9pZFtdPiB7XG4gIGNvbnN0IHByb21pc2VzID0gaHJlZnMubWFwKChocmVmKSA9PiB7XG4gICAgaHJlZiA9IHJlc29sdmVVcmwoaHJlZik7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbmsnKTtcbiAgICAgIGxpbmsucmVsID0gJ3N0eWxlc2hlZXQnO1xuICAgICAgbGluay5ocmVmID0gaHJlZjtcbiAgICAgIGxpbmsub25sb2FkID0gKCkgPT4gcmVzb2x2ZSgpO1xuICAgICAgbGluay5vbmVycm9yID0gKGUpID0+IHJlamVjdChlKTtcblxuICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChsaW5rKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbn1cblxuY29uc3QgaW1wb3J0ZWRTaGVldHM6IFJlY29yZDxzdHJpbmcsIFByb21pc2U8eyBkZWZhdWx0OiBDU1NTdHlsZVNoZWV0IH0+PiA9IHt9O1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlQ3NzSW1wb3J0KC4uLmhyZWZzOiBzdHJpbmdbXSk6IFByb21pc2U8Q1NTU3R5bGVTaGVldFtdPiB7XG4gIC8vIFRvZG86IFVzZSBgeyBhc3NlcnQ6IHsgdHlwZTogXCJjc3NcIiB9YCBhZnRlciBhbGwgYnJvd3NlcnMgc3VwcG9ydCBpdC5cbiAgY29uc3QgbW9kdWxlcyA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgIGhyZWZzLm1hcCgoaHJlZikgPT4ge1xuICAgICAgaWYgKGltcG9ydGVkU2hlZXRzW2hyZWZdKSB7XG4gICAgICAgIHJldHVybiBpbXBvcnRlZFNoZWV0c1tocmVmXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGltcG9ydGVkU2hlZXRzW2hyZWZdID0gc2ltdWxhdGVDc3NJbXBvcnQoaHJlZik7XG4gICAgfSlcbiAgKTtcbiAgY29uc3Qgc3R5bGVzID0gbW9kdWxlcy5tYXAobW9kdWxlID0+IG1vZHVsZS5kZWZhdWx0KTtcblxuICByZXR1cm4gaW5qZWN0Q3NzVG9Eb2N1bWVudCguLi5zdHlsZXMpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBzaW11bGF0ZUNzc0ltcG9ydChocmVmOiBzdHJpbmcpIHtcbiAgaHJlZiA9IHJlc29sdmVVcmwoaHJlZik7XG5cbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChocmVmKTtcbiAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgIHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIGxvYWQgQ1NTOiAke2hyZWZ9YCk7XG4gIH1cbiAgY29uc3QgY3NzVGV4dCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcblxuICBjb25zdCBzaGVldCA9IG5ldyBDU1NTdHlsZVNoZWV0KCk7XG4gIGF3YWl0IHNoZWV0LnJlcGxhY2UoY3NzVGV4dCk7XG4gIHJldHVybiB7IGRlZmF1bHQ6IHNoZWV0IH07XG59XG5cbmxldCBpbXBvcnRNYXA6IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG5cbmZ1bmN0aW9uIHBhcnNlSW1wb3J0TWFwKCkge1xuICBjb25zdCBpbXBvcnRNYXBTY3JpcHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdzY3JpcHRbdHlwZT1cImltcG9ydG1hcFwiXScpO1xuICBpZiAoaW1wb3J0TWFwU2NyaXB0KSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKGltcG9ydE1hcFNjcmlwdC50ZXh0Q29udGVudCB8fCAne30nKS5pbXBvcnRzIHx8IHt9O1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBwYXJzZSBpbXBvcnQgbWFwOicsIGUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4ge307XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVVcmwoc3BlY2lmaWVyOiBzdHJpbmcpIHtcbiAgaW1wb3J0TWFwID8/PSBwYXJzZUltcG9ydE1hcCgpO1xuXG4gIGZvciAoY29uc3QgW3ByZWZpeCwgdGFyZ2V0XSBvZiBPYmplY3QuZW50cmllcyhpbXBvcnRNYXApKSB7XG4gICAgaWYgKHNwZWNpZmllciA9PT0gcHJlZml4KSB7XG4gICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH1cbiAgfVxuXG4gIGZvciAoY29uc3QgW3ByZWZpeCwgdGFyZ2V0XSBvZiBPYmplY3QuZW50cmllcyhpbXBvcnRNYXApKSB7XG4gICAgaWYgKHNwZWNpZmllci5zdGFydHNXaXRoKHByZWZpeCkpIHtcbiAgICAgIHJldHVybiBzcGVjaWZpZXIucmVwbGFjZShwcmVmaXgsIHRhcmdldCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBzcGVjaWZpZXI7XG59XG4iLCJpbXBvcnQgdHlwZSB7IENoZWNrYm94ZXNNdWx0aVNlbGVjdCB9IGZyb20gJy4uL21vZHVsZS9jaGVja2JveGVzLW11bHRpLXNlbGVjdCc7XG5pbXBvcnQgdHlwZSB7IE51bGxhYmxlIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlQ2hlY2tib3hlc011bHRpU2VsZWN0KCk6IFByb21pc2U8YW55PjtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUNoZWNrYm94ZXNNdWx0aVNlbGVjdChcbiAgc2VsZWN0b3I/OiBOdWxsYWJsZTxzdHJpbmcgfCBIVE1MRWxlbWVudD4sXG4gIG9wdGlvbnM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+XG4pOiBQcm9taXNlPENoZWNrYm94ZXNNdWx0aVNlbGVjdD47XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VDaGVja2JveGVzTXVsdGlTZWxlY3QoXG4gIHNlbGVjdG9yPzogTnVsbGFibGU8c3RyaW5nIHwgSFRNTEVsZW1lbnQ+LFxuICBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge31cbik6IFByb21pc2U8YW55PiB7XG4gIGNvbnN0IG0gPSBhd2FpdCBpbXBvcnQoJy4uL21vZHVsZS9jaGVja2JveGVzLW11bHRpLXNlbGVjdCcpO1xuXG4gIGlmIChzZWxlY3Rvcikge1xuICAgIG0uQ2hlY2tib3hlc011bHRpU2VsZWN0LmhhbmRsZShzZWxlY3Rvciwgb3B0aW9ucyk7XG4gIH1cblxuICByZXR1cm4gbTtcbn1cbiIsImltcG9ydCB7IENhc2NhZGVTZWxlY3RNb2R1bGUgfSBmcm9tICcuLi9tb2R1bGUvZmllbGQtY2FzY2FkZS1zZWxlY3QnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlRmllbGRDYXNjYWRlU2VsZWN0KCk6IFByb21pc2U8Q2FzY2FkZVNlbGVjdE1vZHVsZT4ge1xuICBjb25zdCBtb2R1bGUgPSBhd2FpdCBpbXBvcnQoJy4uL21vZHVsZS9maWVsZC1jYXNjYWRlLXNlbGVjdCcpO1xuXG4gIGF3YWl0IG1vZHVsZS5yZWFkeTtcblxuICByZXR1cm4gbW9kdWxlO1xufVxuIiwiaW1wb3J0IHsgRmlsZURyYWdNb2R1bGUgfSBmcm9tICcuLi9tb2R1bGUvZmllbGQtZmlsZS1kcmFnJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUZpZWxkRmlsZURyYWcoKTogUHJvbWlzZTxGaWxlRHJhZ01vZHVsZT4ge1xuICBjb25zdCBtb2R1bGUgPSBhd2FpdCBpbXBvcnQoJy4uL21vZHVsZS9maWVsZC1maWxlLWRyYWcnKTtcblxuICBhd2FpdCBtb2R1bGUucmVhZHk7XG5cbiAgcmV0dXJuIG1vZHVsZTtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiB1c2VGaWVsZEZsYXRwaWNrcigpOiBQcm9taXNlPGFueT4ge1xuICByZXR1cm4gaW1wb3J0KCcuLi9tb2R1bGUvZmllbGQtZmxhdHBpY2tyJyk7XG59XG4iLCJpbXBvcnQgdHlwZSB7IE1vZGFsU2VsZWN0TW9kdWxlIH0gZnJvbSAnLi4vbW9kdWxlL2ZpZWxkLW1vZGFsLXNlbGVjdCc7XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VGaWVsZE1vZGFsU2VsZWN0KCk6IFByb21pc2U8TW9kYWxTZWxlY3RNb2R1bGU+IHtcbiAgLy8gTW9kYWwgc2VsZWN0IGhhcyBubyBleHBvcnRzIG5vd1xuICByZXR1cm4gaW1wb3J0KCcuLi9tb2R1bGUvZmllbGQtbW9kYWwtc2VsZWN0Jyk7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gdXNlRmllbGRNb2RhbFRyZWUoKSB7XG4gIGltcG9ydCgnLi4vbW9kdWxlL2ZpZWxkLW1vZGFsLXRyZWUnKTtcbn1cbiIsImltcG9ydCB7IFJlcGVhdGFibGVNb2R1bGUgfSBmcm9tICcuLi9tb2R1bGUvZmllbGQtcmVwZWF0YWJsZSc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VGaWVsZFJlcGVhdGFibGUoKTogUHJvbWlzZTxSZXBlYXRhYmxlTW9kdWxlPiB7XG4gIGNvbnN0IG1vZHVsZSA9IGF3YWl0IGltcG9ydCgnLi4vbW9kdWxlL2ZpZWxkLXJlcGVhdGFibGUnKTtcblxuICBhd2FpdCBtb2R1bGUucmVhZHk7XG5cbiAgcmV0dXJuIG1vZHVsZTtcbn1cbiIsImltcG9ydCB7IFNpbmdsZUltYWdlRHJhZ01vZHVsZSB9IGZyb20gJy4uL21vZHVsZS9maWVsZC1zaW5nbGUtaW1hZ2UtZHJhZyc7XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VGaWVsZFNpbmdsZUltYWdlRHJhZygpOiBQcm9taXNlPFNpbmdsZUltYWdlRHJhZ01vZHVsZT4ge1xuICByZXR1cm4gaW1wb3J0KCcuLi9tb2R1bGUvZmllbGQtc2luZ2xlLWltYWdlLWRyYWcnKTtcbn1cbiIsImltcG9ydCB0eXBlIHsgVW5pY29ybkZvcm1FbGVtZW50IH0gZnJvbSAnLi4vbW9kdWxlL2Zvcm0nO1xuaW1wb3J0IHsgc2VsZWN0T25lLCBtb2R1bGUgfSBmcm9tICcuLi9zZXJ2aWNlJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUZvcm0oZWxlPzogc3RyaW5nIHwgRWxlbWVudCwgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9KTogUHJvbWlzZTxVbmljb3JuRm9ybUVsZW1lbnQ+IHtcbiAgY29uc3QgeyBVbmljb3JuRm9ybUVsZW1lbnQgfSA9IGF3YWl0IGltcG9ydCgnLi4vbW9kdWxlL2Zvcm0nKTtcblxuICBpZiAoZWxlID09IG51bGwpIHtcbiAgICByZXR1cm4gbmV3IFVuaWNvcm5Gb3JtRWxlbWVudCh1bmRlZmluZWQsIHVuZGVmaW5lZCwgb3B0aW9ucyk7XG4gIH1cblxuICBjb25zdCBzZWxlY3RvciA9IHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogdW5kZWZpbmVkO1xuICBjb25zdCBlbCA9IHNlbGVjdE9uZTxIVE1MRm9ybUVsZW1lbnQ+KGVsZSBhcyBzdHJpbmcpO1xuXG4gIGlmICghZWwpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEZvcm0gZWxlbWVudCBvZjogJHtzZWxlY3Rvcn0gbm90IGZvdW5kLmApO1xuICB9XG5cbiAgcmV0dXJuIG1vZHVsZShcbiAgICBlbCxcbiAgICAndW5pY29ybi5mb3JtJyxcbiAgICAoKSA9PiBuZXcgVW5pY29ybkZvcm1FbGVtZW50KHNlbGVjdG9yLCBlbCwgb3B0aW9ucylcbiAgKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUZvcm1Db21wb25lbnQoZWxlPzogc3RyaW5nIHwgRWxlbWVudCwgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9KSB7XG4gIGNvbnN0IGZvcm0gPSBhd2FpdCB1c2VGb3JtKGVsZSwgb3B0aW9ucyk7XG5cbiAgYXdhaXQgZm9ybS5pbml0Q29tcG9uZW50KCk7XG5cbiAgcmV0dXJuIGZvcm07XG59XG4iLCJpbXBvcnQgdHlwZSB7IFVuaWNvcm5HcmlkRWxlbWVudCB9IGZyb20gJy4uL21vZHVsZS9ncmlkJztcbmltcG9ydCB7IHVzZUZvcm0gfSBmcm9tICcuL3VzZUZvcm0nO1xuaW1wb3J0IHsgc2VsZWN0T25lLCBtb2R1bGUgfSBmcm9tICcuLi9zZXJ2aWNlJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUdyaWQoXG4gIGVsZTogc3RyaW5nIHwgSFRNTEVsZW1lbnQsXG4gIG9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT4gfCB1bmRlZmluZWQgPSB7fVxuKTogUHJvbWlzZTxVbmljb3JuR3JpZEVsZW1lbnQ+IHtcbiAgY29uc3QgeyBVbmljb3JuR3JpZEVsZW1lbnQgfSA9IGF3YWl0IGltcG9ydCgnLi4vbW9kdWxlL2dyaWQnKTtcblxuICBjb25zdCBzZWxlY3RvciA9IHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogJyc7XG4gIGNvbnN0IGVsZW1lbnQgPSBzZWxlY3RPbmUoZWxlKTtcblxuICBpZiAoIWVsZW1lbnQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0VsZW1lbnQgaXMgZW1wdHknKTtcbiAgfVxuXG4gIGNvbnN0IGZvcm0gPSBhd2FpdCB1c2VGb3JtKHNlbGVjdG9yIHx8IGVsZW1lbnQpO1xuXG4gIHJldHVybiBtb2R1bGUoXG4gICAgZWxlbWVudCxcbiAgICAnZ3JpZC5wbHVnaW4nLFxuICAgICgpID0+IG5ldyBVbmljb3JuR3JpZEVsZW1lbnQoc2VsZWN0b3IsIGVsZW1lbnQsIGZvcm0sIG9wdGlvbnMpXG4gICk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VHcmlkQ29tcG9uZW50KFxuICBlbGU6IHN0cmluZyB8IEhUTUxFbGVtZW50LFxuICBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgdW5kZWZpbmVkID0ge31cbik6IFByb21pc2U8VW5pY29ybkdyaWRFbGVtZW50PiB7XG4gIGNvbnN0IGdyaWQgPSBhd2FpdCB1c2VHcmlkKGVsZSwgb3B0aW9ucyk7XG5cbiAgYXdhaXQgZ3JpZC5pbml0Q29tcG9uZW50KCk7XG5cbiAgcmV0dXJuIGdyaWQ7XG59XG4iLCJpbXBvcnQgdHlwZSB7IFVuaWNvcm5IdHRwQ2xpZW50IH0gZnJvbSAnLi4vbW9kdWxlL2h0dHAtY2xpZW50JztcbmltcG9ydCB0eXBlIHsgQXhpb3NJbnN0YW5jZSwgQ3JlYXRlQXhpb3NEZWZhdWx0cyB9IGZyb20gJ2F4aW9zJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUh0dHBDbGllbnQoY29uZmlnPzogQ3JlYXRlQXhpb3NEZWZhdWx0cyB8IEF4aW9zSW5zdGFuY2UpOiBQcm9taXNlPFVuaWNvcm5IdHRwQ2xpZW50PiB7XG4gIGNvbnN0IHsgVW5pY29ybkh0dHBDbGllbnQgfSA9IGF3YWl0IGltcG9ydCgnLi4vbW9kdWxlL2h0dHAtY2xpZW50Jyk7XG5cbiAgaWYgKGNvbmZpZyAmJiAnaW50ZXJjZXB0b3JzJyBpbiBjb25maWcpIHtcbiAgICBjb25zdCBheGlvcyA9IGNvbmZpZyBhcyBBeGlvc0luc3RhbmNlO1xuXG4gICAgY29uc3QgaHR0cCA9IG5ldyBVbmljb3JuSHR0cENsaWVudCgpO1xuXG4gICAgaHR0cC5heGlvcyA9IGF4aW9zO1xuXG4gICAgcmV0dXJuIGh0dHA7XG4gIH1cblxuICByZXR1cm4gbmV3IFVuaWNvcm5IdHRwQ2xpZW50KGNvbmZpZyBhcyBDcmVhdGVBeGlvc0RlZmF1bHRzIHwgdW5kZWZpbmVkKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUxvYWRlZEh0dHBDbGllbnQoY29uZmlnPzogQ3JlYXRlQXhpb3NEZWZhdWx0cyk6IFByb21pc2U8VW5pY29ybkh0dHBDbGllbnQ+IHtcbiAgY29uc3QgaHR0cCA9IGF3YWl0IHVzZUh0dHBDbGllbnQoY29uZmlnKTtcblxuICAvLyBMb2FkIGFuZCBjYWNoZSBheGlvc1xuICBhd2FpdCBodHRwLmdldEF4aW9zSW5zdGFuY2UoKTtcblxuICByZXR1cm4gaHR0cDtcbn1cbiIsImltcG9ydCB7IElmcmFtZU1vZGFsTW9kdWxlIH0gZnJvbSAnLi4vbW9kdWxlL2lmcmFtZS1tb2RhbCc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VJZnJhbWVNb2RhbCgpOiBQcm9taXNlPElmcmFtZU1vZGFsTW9kdWxlPiB7XG4gIGNvbnN0IG1vZHVsZSA9IGF3YWl0IGltcG9ydCgnLi4vbW9kdWxlL2lmcmFtZS1tb2RhbCcpO1xuXG4gIGF3YWl0IG1vZHVsZS5yZWFkeTtcblxuICByZXR1cm4gbW9kdWxlO1xufVxuIiwiaW1wb3J0IHR5cGUgeyBMaXN0RGVwZW5kZW50LCBMaXN0RGVwZW5kZW50TW9kdWxlLCBMaXN0RGVwZW5kZW50T3B0aW9ucyB9IGZyb20gJy4uL21vZHVsZS9saXN0LWRlcGVuZGVudCc7XG5pbXBvcnQgeyBOdWxsYWJsZSB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUxpc3REZXBlbmRlbnQoKTogUHJvbWlzZTxMaXN0RGVwZW5kZW50TW9kdWxlPjtcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VMaXN0RGVwZW5kZW50KFxuICBlbGVtZW50OiBzdHJpbmcgfCBIVE1MRWxlbWVudCxcbiAgZGVwZW5kZW50PzogTnVsbGFibGU8c3RyaW5nIHwgSFRNTEVsZW1lbnQ+LFxuICBvcHRpb25zPzogUGFydGlhbDxMaXN0RGVwZW5kZW50T3B0aW9ucz5cbik6IFByb21pc2U8TGlzdERlcGVuZGVudD47XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlTGlzdERlcGVuZGVudChcbiAgZWxlbWVudD86IE51bGxhYmxlPHN0cmluZyB8IEhUTUxFbGVtZW50PixcbiAgZGVwZW5kZW50PzogTnVsbGFibGU8c3RyaW5nIHwgSFRNTEVsZW1lbnQ+LFxuICBvcHRpb25zOiBQYXJ0aWFsPExpc3REZXBlbmRlbnRPcHRpb25zPiA9IHt9XG4pOiBQcm9taXNlPGFueT4ge1xuICBjb25zdCBtb2R1bGUgPSBhd2FpdCBpbXBvcnQoJy4uL21vZHVsZS9saXN0LWRlcGVuZGVudCcpO1xuXG4gIGF3YWl0IG1vZHVsZS5yZWFkeTtcblxuICBpZiAoZWxlbWVudCkge1xuICAgIGNvbnN0IHsgTGlzdERlcGVuZGVudCB9ID0gbW9kdWxlO1xuXG4gICAgcmV0dXJuIExpc3REZXBlbmRlbnQuaGFuZGxlKGVsZW1lbnQsIGRlcGVuZGVudCwgb3B0aW9ucyk7XG4gIH1cblxuICByZXR1cm4gbW9kdWxlO1xufVxuIiwiaW1wb3J0IHsgRGljdGlvbmFyeSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IFRhc2tRdWV1ZSwgcXVldWUgfSBmcm9tICdAbHlyYXNvZnQvdHMtdG9vbGtpdC9nZW5lcmljJztcblxuY29uc3QgcXVldWVzOiBEaWN0aW9uYXJ5PFRhc2tRdWV1ZT4gPSB7fTtcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZVF1ZXVlKG5hbWU6IHN0cmluZyA9ICdkZWZhdWx0JywgbWF4UnVubmluZyA9IDEpOiBUYXNrUXVldWUge1xuICByZXR1cm4gcXVldWVzW25hbWVdID8/PSBjcmVhdGVRdWV1ZShtYXhSdW5uaW5nKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVF1ZXVlKG1heFJ1bm5pbmcgPSAxKTogVGFza1F1ZXVlIHtcbiAgcmV0dXJuIHF1ZXVlKG1heFJ1bm5pbmcpO1xufVxuXG4iLCJpbXBvcnQgdHlwZSB7IFMzVXBsb2FkZXIsIFMzVXBsb2FkZXJHbG9iYWxPcHRpb25zLCBTM1VwbG9hZGVyTW9kdWxlIH0gZnJvbSAnLi4vbW9kdWxlL3MzLXVwbG9hZGVyJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZVMzVXBsb2FkZXIoKTogUHJvbWlzZTxTM1VwbG9hZGVyTW9kdWxlPjtcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VTM1VwbG9hZGVyKG5hbWU6IHN0cmluZywgb3B0aW9ucz86IFBhcnRpYWw8UzNVcGxvYWRlckdsb2JhbE9wdGlvbnM+KTogUHJvbWlzZTxTM1VwbG9hZGVyPjtcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VTM1VwbG9hZGVyKG5hbWU/OiBzdHJpbmcsIG9wdGlvbnM6IFBhcnRpYWw8UzNVcGxvYWRlckdsb2JhbE9wdGlvbnM+ID0ge30pOiBQcm9taXNlPGFueT4ge1xuICBjb25zdCBtb2R1bGUgPSBhd2FpdCBpbXBvcnQoJy4uL21vZHVsZS9zMy11cGxvYWRlcicpO1xuXG4gIGlmICghbmFtZSkge1xuICAgIHJldHVybiBtb2R1bGU7XG4gIH1cblxuICBjb25zdCB7IGdldCB9ID0gbW9kdWxlO1xuXG4gIHJldHVybiBnZXQobmFtZSwgb3B0aW9ucyk7XG59XG4iLCJpbXBvcnQgeyBTaG93T25Nb2R1bGUgfSBmcm9tICcuLi9tb2R1bGUvc2hvdy1vbic7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VTaG93T24oKTogUHJvbWlzZTxTaG93T25Nb2R1bGU+IHtcbiAgY29uc3QgbW9kdWxlID0gYXdhaXQgaW1wb3J0KCcuLi9tb2R1bGUvc2hvdy1vbicpO1xuXG4gIGF3YWl0IG1vZHVsZS5yZWFkeTtcblxuICByZXR1cm4gbW9kdWxlO1xufVxuIiwiXG5pbXBvcnQgeyBEaWN0aW9uYXJ5IH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgU3RhY2ssIHN0YWNrIH0gZnJvbSAnQGx5cmFzb2Z0L3RzLXRvb2xraXQvZ2VuZXJpYyc7XG5cbmNvbnN0IHN0YWNrczogRGljdGlvbmFyeTxTdGFjaz4gPSB7fTtcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZVN0YWNrPFQgPSBhbnk+KG5hbWU6IHN0cmluZyA9ICdkZWZhdWx0Jywgc3RvcmU6IGFueVtdID0gW10pOiBTdGFjazxUPiB7XG4gIHJldHVybiBzdGFja3NbbmFtZV0gPz89IGNyZWF0ZVN0YWNrPFQ+KHN0b3JlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVN0YWNrPFQgPSBhbnk+KHN0b3JlOiBhbnlbXSA9IFtdKTogU3RhY2s8VD4ge1xuICByZXR1cm4gc3RhY2s8VD4oc3RvcmUpO1xufVxuIiwiaW1wb3J0IHsgbW9kdWxlLCB1c2VDc3NJbXBvcnQsIHVzZUNzc0luY2x1ZGVzLCB1c2VJbXBvcnQsIHdhaXQgfSBmcm9tICcuLi9zZXJ2aWNlJztcbmltcG9ydCB0eXBlIHsgTnVsbGFibGUgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBtZXJnZURlZXAgfSBmcm9tICcuLi91dGlsaXRpZXMnO1xuXG4vKipcbiAqIEBzZWUgaHR0cHM6Ly90b20tc2VsZWN0LmpzLm9yZy9cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZVRvbVNlbGVjdChcbiAgc2VsZWN0b3I/OiBOdWxsYWJsZTxzdHJpbmcgfCBIVE1MRWxlbWVudCB8IE5vZGVMaXN0T2Y8SFRNTEVsZW1lbnQ+PixcbiAgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9LFxuICB0aGVtZTogc3RyaW5nID0gJ2Jvb3RzdHJhcDUnXG4pIHtcbiAgY29uc3QgW21dID0gYXdhaXQgd2FpdChcbiAgICB1c2VJbXBvcnQoJ0B2ZW5kb3IvdG9tLXNlbGVjdC9kaXN0L2pzL3RvbS1zZWxlY3QuY29tcGxldGUubWluLmpzJyksXG4gICAgdXNlQ3NzSW1wb3J0KGBAdmVuZG9yL3RvbS1zZWxlY3QvZGlzdC9jc3MvdG9tLXNlbGVjdC4ke3RoZW1lfS5taW4uY3NzYClcbiAgKTtcblxuICBpZiAoc2VsZWN0b3IpIHtcbiAgICBtb2R1bGU8YW55LCBIVE1MU2VsZWN0RWxlbWVudD4oXG4gICAgICBzZWxlY3RvcixcbiAgICAgICd0b20uc2VsZWN0JyxcbiAgICAgIChlbGUpID0+IHtcbiAgICAgICAgb3B0aW9ucyA9IG1lcmdlRGVlcCh7XG4gICAgICAgICAgYWxsb3dFbXB0eU9wdGlvbjogdHJ1ZSxcbiAgICAgICAgICBtYXhPcHRpb25zOiBudWxsLFxuICAgICAgICAgIHBsdWdpbnM6IHtcbiAgICAgICAgICAgIGNhcmV0X3Bvc2l0aW9uOiB7fSxcbiAgICAgICAgICAgIGNsZWFyX2J1dHRvbjoge30sXG4gICAgICAgICAgfVxuICAgICAgICB9LCBvcHRpb25zKTtcblxuICAgICAgICBpZiAoKGVsZSBhcyBIVE1MU2VsZWN0RWxlbWVudCkubXVsdGlwbGUpIHtcbiAgICAgICAgICBvcHRpb25zLnBsdWdpbnMucmVtb3ZlX2J1dHRvbiA9IHt9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9wdGlvbnMucGx1Z2lucy5kcm9wZG93bl9pbnB1dCA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQXV0byBzZWxlY3QgZmlyc3QgaWYgb3B0aW9ucyBjaGFuZ2VkLlxuICAgICAgICAvLyBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9vcmNoaWRqcy90b20tc2VsZWN0L2lzc3Vlcy8zNjJcbiAgICAgICAgY2xhc3MgVW5pY29yblRvbVNlbGVjdCBleHRlbmRzIFRvbVNlbGVjdCB7XG4gICAgICAgICAgc3luY09wdGlvbnNXaXRob3V0S2VlcFNlbGVjdGVkKCkge1xuICAgICAgICAgICAgY29uc3Qgb2xkVmFsdWUgPSBlbGUudmFsdWU7XG5cbiAgICAgICAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICAgICAgICAgIHRoaXMuY2xlYXJPcHRpb25zKCk7XG4gICAgICAgICAgICB0aGlzLnN5bmMoKTtcblxuICAgICAgICAgICAgaWYgKGVsZS52YWx1ZSAhPT0gb2xkVmFsdWUpIHtcbiAgICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZShcbiAgICAgICAgICAgICAgICBlbGUucXVlcnlTZWxlY3RvcjxIVE1MT3B0aW9uRWxlbWVudD4oYG9wdGlvblt2YWx1ZT1cIiR7b2xkVmFsdWV9XCJdYCk/LnZhbHVlXG4gICAgICAgICAgICAgICAgPz8gZWxlLnF1ZXJ5U2VsZWN0b3I8SFRNTE9wdGlvbkVsZW1lbnQ+KCdvcHRpb24nKT8udmFsdWVcbiAgICAgICAgICAgICAgICA/PyAnJyxcbiAgICAgICAgICAgICAgICB0cnVlXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBjb25zdCB0ID0gbmV3IFVuaWNvcm5Ub21TZWxlY3QoZWxlIGFzIFRvbUlucHV0LCBvcHRpb25zKTtcblxuICAgICAgICBlbGUuYWRkRXZlbnRMaXN0ZW5lcignbGlzdDp1cGRhdGVkJywgKCkgPT4ge1xuICAgICAgICAgIHQuc3luY09wdGlvbnNXaXRob3V0S2VlcFNlbGVjdGVkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0O1xuICAgICAgfVxuICAgICk7XG4gIH1cblxuICByZXR1cm4gbTtcbn1cbiIsImltcG9ydCB0eXBlIHsgVG9vbHRpcCB9IGZyb20gJ2Jvb3RzdHJhcCc7XG5pbXBvcnQgeyBCdXR0b25SYWRpb09wdGlvbnMgfSBmcm9tICcuLi9ib290c3RyYXAvYnV0dG9uLXJhZGlvJztcbmltcG9ydCB0eXBlIHsgS2VlcFRhYiwgS2VlcFRhYk1vZHVsZSwgS2VlcFRhYk9wdGlvbnMgfSBmcm9tICcuLi9ib290c3RyYXAva2VlcC10YWInO1xuaW1wb3J0IHR5cGUgeyBVSUJvb3RzdHJhcDUgfSBmcm9tICcuLi9tb2R1bGUvdWktYm9vdHN0cmFwNSc7XG5pbXBvcnQgeyB1c2VVSVRoZW1lIH0gZnJvbSAnLi4vc2VydmljZSc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VVSUJvb3RzdHJhcDUoaW5zdGFsbCA9IGZhbHNlLCBwdXNoVG9HbG9iYWwgPSBmYWxzZSk6IFByb21pc2U8VUlCb290c3RyYXA1PiB7XG4gIGNvbnN0IHsgVUlCb290c3RyYXA1IH0gPSBhd2FpdCBpbXBvcnQoJy4uL21vZHVsZS91aS1ib290c3RyYXA1Jyk7XG5cbiAgY29uc3QgdGhlbWUgPSBVSUJvb3RzdHJhcDUuZ2V0KCk7XG5cbiAgaWYgKGluc3RhbGwpIHtcbiAgICB1c2VVSVRoZW1lKHRoZW1lKTtcblxuICAgIGlmIChwdXNoVG9HbG9iYWwpIHtcbiAgICAgIHRoZW1lLnB1c2hCb290c3RyYXBUb0dsb2JhbCgpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGVtZTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUJzNVRvb2x0aXAoXG4gIHNlbGVjdG9yOiBOb2RlTGlzdE9mPEVsZW1lbnQ+IHwgRWxlbWVudCB8IHN0cmluZyA9ICdbZGF0YS1icy10b2dnbGU9XCJ0b29sdGlwXCJdJyxcbiAgY29uZmlnOiBQYXJ0aWFsPFRvb2x0aXAuT3B0aW9ucz4gPSB7fVxuKTogUHJvbWlzZTxUb29sdGlwW10+IHtcbiAgY29uc3QgYnM1ID0gYXdhaXQgdXNlVUlCb290c3RyYXA1KCk7XG5cbiAgcmV0dXJuIGJzNS50b29sdGlwKHNlbGVjdG9yLCBjb25maWcpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlQnM1S2VlcFRhYihzZWxlY3Rvcj86IHN0cmluZyB8IEhUTUxFbGVtZW50LCBvcHRpb25zOiBLZWVwVGFiT3B0aW9ucyA9IHt9KSB7XG4gIGNvbnN0IGJzNSA9IGF3YWl0IHVzZVVJQm9vdHN0cmFwNSgpO1xuXG4gIHJldHVybiBiczUua2VlcFRhYihzZWxlY3Rvciwgb3B0aW9ucyk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VCczVCdXR0b25SYWRpbyhzZWxlY3Rvcj86IHN0cmluZyB8IEhUTUxFbGVtZW50LCBvcHRpb25zOiBCdXR0b25SYWRpb09wdGlvbnMgPSB7fSkge1xuICBjb25zdCBiczUgPSBhd2FpdCB1c2VVSUJvb3RzdHJhcDUoKTtcblxuICByZXR1cm4gYnM1LmJ1dHRvblJhZGlvKHNlbGVjdG9yLCBvcHRpb25zKTtcbn1cbiIsImltcG9ydCB7IERpY3Rpb25hcnkgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgdHlwZSB7IGRlZmF1bHQgYXMgV2ViRGlyZWN0aXZlIH0gZnJvbSAnd2ViLWRpcmVjdGl2ZSc7XG5pbXBvcnQgdHlwZSB7IFdlYkRpcmVjdGl2ZUhhbmRsZXIsIFdlYkRpcmVjdGl2ZU9wdGlvbnMgfSBmcm9tICd3ZWItZGlyZWN0aXZlL3NyYy90eXBlcyc7XG5cbmxldCBpbnN0YW5jZXM6IERpY3Rpb25hcnk8V2ViRGlyZWN0aXZlPiA9IHt9O1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlV2ViRGlyZWN0aXZlKFxuICBuYW1lOiBzdHJpbmcgPSAndW5pY29ybicsXG4gIG9wdGlvbnM6IFBhcnRpYWw8V2ViRGlyZWN0aXZlT3B0aW9ucz4gPSB7fVxuKTogUHJvbWlzZTxXZWJEaXJlY3RpdmU+IHtcbiAgcmV0dXJuIGluc3RhbmNlc1tuYW1lXSA/Pz0gYXdhaXQgY3JlYXRlV2ViRGlyZWN0aXZlKE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHsgcHJlZml4OiAndW5pLScgfSkpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlVW5pRGlyZWN0aXZlKFxuICBuYW1lOiBzdHJpbmcsXG4gIGhhbmRsZXI6IFdlYkRpcmVjdGl2ZUhhbmRsZXIsXG4gIHdkSW5zdGFuY2U6IFdlYkRpcmVjdGl2ZSB8IHN0cmluZyA9ICd1bmljb3JuJ1xuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHdkID0gdHlwZW9mIHdkSW5zdGFuY2UgPT09ICdzdHJpbmcnID8gYXdhaXQgdXNlV2ViRGlyZWN0aXZlKHdkSW5zdGFuY2UpIDogd2RJbnN0YW5jZTtcblxuICB3ZC5yZWdpc3RlcihuYW1lLCBoYW5kbGVyKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gY3JlYXRlV2ViRGlyZWN0aXZlKG9wdGlvbnM6IFBhcnRpYWw8V2ViRGlyZWN0aXZlT3B0aW9ucz4gPSB7fSk6IFByb21pc2U8V2ViRGlyZWN0aXZlPiB7XG4gIGNvbnN0IFdlYkRpcmVjdGl2ZSA9IChhd2FpdCBpbXBvcnQoJ3dlYi1kaXJlY3RpdmUnKSkuZGVmYXVsdDtcblxuICBjb25zdCB3ZCA9IG5ldyBXZWJEaXJlY3RpdmUob3B0aW9ucyk7XG4gIHdkLmxpc3RlbigpO1xuXG4gIHJldHVybiB3ZDtcbn1cbiIsImltcG9ydCB0eXBlIHtcbiAgVW5pY29ybkZpZWxkVmFsaWRhdGlvbixcbiAgVW5pY29ybkZvcm1WYWxpZGF0aW9uLFxuICBWYWxpZGF0aW9uSGFuZGxlcixcbiAgVmFsaWRhdGlvbk1vZHVsZVxufSBmcm9tICcuLi9tb2R1bGUvdmFsaWRhdGlvbic7XG5pbXBvcnQgeyBnZXRCb3VuZGVkSW5zdGFuY2UgfSBmcm9tICcuLi9zZXJ2aWNlJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUZvcm1WYWxpZGF0aW9uKCk6IFByb21pc2U8VmFsaWRhdGlvbk1vZHVsZT47XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlRm9ybVZhbGlkYXRpb24oc2VsZWN0b3I6IHN0cmluZyB8IEVsZW1lbnQpOiBQcm9taXNlPFVuaWNvcm5Gb3JtVmFsaWRhdGlvbj47XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlRm9ybVZhbGlkYXRpb24oc2VsZWN0b3I/OiBzdHJpbmcgfCBFbGVtZW50KTogUHJvbWlzZTxhbnk+IHtcbiAgY29uc3QgbW9kdWxlID0gYXdhaXQgaW1wb3J0KCcuLi9tb2R1bGUvdmFsaWRhdGlvbicpO1xuXG4gIGF3YWl0IG1vZHVsZS5yZWFkeTtcblxuICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIG1vZHVsZTtcbiAgfVxuXG4gIHJldHVybiB1c2VGb3JtVmFsaWRhdGlvblN5bmMoc2VsZWN0b3IpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXNlRm9ybVZhbGlkYXRpb25TeW5jKHNlbGVjdG9yOiBzdHJpbmcgfCBFbGVtZW50KTogVW5pY29ybkZvcm1WYWxpZGF0aW9uIHtcbiAgcmV0dXJuIGdldEJvdW5kZWRJbnN0YW5jZTxVbmljb3JuRm9ybVZhbGlkYXRpb24+KHNlbGVjdG9yLCAnZm9ybS52YWxpZGF0aW9uJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VGaWVsZFZhbGlkYXRpb25TeW5jKHNlbGVjdG9yOiBzdHJpbmcgfCBFbGVtZW50KTogVW5pY29ybkZpZWxkVmFsaWRhdGlvbiB7XG4gIHJldHVybiBnZXRCb3VuZGVkSW5zdGFuY2U8VW5pY29ybkZpZWxkVmFsaWRhdGlvbj4oc2VsZWN0b3IsICdmaWVsZC52YWxpZGF0aW9uJyk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZGRHbG9iYWxWYWxpZGF0b3IobmFtZTogc3RyaW5nLCB2YWxpZGF0b3I6IFZhbGlkYXRpb25IYW5kbGVyLCBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge30pIHtcbiAgY29uc3QgeyBVbmljb3JuRm9ybVZhbGlkYXRpb24gfSA9IGF3YWl0IHVzZUZvcm1WYWxpZGF0aW9uKCk7XG5cbiAgVW5pY29ybkZvcm1WYWxpZGF0aW9uLmFkZEdsb2JhbFZhbGlkYXRvcihuYW1lLCB2YWxpZGF0b3IsIG9wdGlvbnMpO1xufVxuIiwiaW1wb3J0IHsgQWxlcnRBZGFwdGVyLCBkZWxldGVDb25maXJtLCBzaW1wbGVBbGVydCwgc2ltcGxlQ29uZmlybSB9IGZyb20gJ0BseXJhc29mdC90cy10b29sa2l0L2dlbmVyaWMnO1xuaW1wb3J0IHR5cGUgeyBBbHBpbmUgYXMgQWxwaW5lR2xvYmFsIH0gZnJvbSAnYWxwaW5lanMnO1xuaW1wb3J0IHR5cGUgeyBkZWZhdWx0IGFzIFNwZWN0cnVtR2xvYmFsIH0gZnJvbSAnc3BlY3RydW0tdmFuaWxsYSc7XG5pbXBvcnQgdHlwZSB7IFNwZWN0cnVtT3B0aW9ucyB9IGZyb20gJ3NwZWN0cnVtLXZhbmlsbGEvZGlzdC90eXBlcy90eXBlcyc7XG5pbXBvcnQgdHlwZSB7IGRlZmF1bHQgYXMgVG9tU2VsZWN0R2xvYmFsIH0gZnJvbSAndG9tLXNlbGVjdCc7XG5pbXBvcnQgeyB1c2VTdGFjayB9IGZyb20gJy4uL2NvbXBvc2FibGUnO1xuaW1wb3J0IHsgZGF0YSwgcmVtb3ZlRGF0YSB9IGZyb20gJy4uL2RhdGEnO1xuaW1wb3J0IHR5cGUgeyBDb25zdHJ1Y3RvciwgTWF5YmVQcm9taXNlLCBOdWxsYWJsZSwgVUlUaGVtZUludGVyZmFjZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGFuaW1hdGVUbyB9IGZyb20gJy4vYW5pbWF0ZSc7XG5pbXBvcnQgeyBodG1sLCBtb2R1bGUsIHNlbGVjdEFsbCwgc2VsZWN0T25lIH0gZnJvbSAnLi9kb20nO1xuaW1wb3J0IHsgbmV4dFRpY2sgfSBmcm9tICcuL2hlbHBlcic7XG5pbXBvcnQgeyB1c2VDc3NJbXBvcnQsIHVzZUltcG9ydCB9IGZyb20gJy4vbG9hZGVyJztcblxubGV0IHVpOiBVbmljb3JuVUk7XG5cbkFsZXJ0QWRhcHRlci5hbGVydCA9ICh0aXRsZTogc3RyaW5nLCB0ZXh0ID0gJycsIHR5cGUgPSAnaW5mbycpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgaWYgKHRleHQpIHtcbiAgICB0aXRsZSArPSAnIHwgJyArIHRleHQ7XG4gIH1cblxuICB3aW5kb3cuYWxlcnQodGl0bGUpO1xuXG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbn07XG5cbkFsZXJ0QWRhcHRlci5jb25maXJtID0gKG1lc3NhZ2U6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4gPT4ge1xuICBtZXNzYWdlID0gbWVzc2FnZSB8fCAnQXJlIHlvdSBzdXJlPyc7XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgcmVzb2x2ZSh3aW5kb3cuY29uZmlybShtZXNzYWdlKSk7XG4gIH0pO1xufTtcblxuQWxlcnRBZGFwdGVyLmNvbmZpcm1UZXh0ID0gKCkgPT4gJ09LJztcbkFsZXJ0QWRhcHRlci5jYW5jZWxUZXh0ID0gKCkgPT4gJ0NhbmNlbCc7XG5BbGVydEFkYXB0ZXIuZGVsZXRlVGV4dCA9ICgpID0+ICdEZWxldGUnO1xuXG5leHBvcnQgeyBzaW1wbGVBbGVydCwgc2ltcGxlQ29uZmlybSwgZGVsZXRlQ29uZmlybSwgQWxlcnRBZGFwdGVyIH07XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VVSShpbnN0YW5jZT86IFVuaWNvcm5VSSk6IFVuaWNvcm5VSSB7XG4gIGlmIChpbnN0YW5jZSkge1xuICAgIHVpID0gaW5zdGFuY2U7XG4gIH1cblxuICByZXR1cm4gdWkgPz89IG5ldyBVbmljb3JuVUkoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVzZVVJVGhlbWU8VCBleHRlbmRzIFVJVGhlbWVJbnRlcmZhY2U+KHRoZW1lPzogVCB8IENvbnN0cnVjdG9yPFQ+KTogVCB7XG4gIGNvbnN0IHVpID0gdXNlVUkoKTtcblxuICBpZiAodWkudGhlbWUgJiYgIXRoZW1lKSB7XG4gICAgcmV0dXJuIHVpLnRoZW1lO1xuICB9XG5cbiAgaWYgKHR5cGVvZiB0aGVtZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHRoZW1lID0gbmV3IHRoZW1lKCk7XG4gIH1cblxuICB1aS5pbnN0YWxsVGhlbWUodGhlbWUpO1xuXG4gIHJldHVybiB1aS50aGVtZTtcbn1cblxuZXhwb3J0IGNsYXNzIFVuaWNvcm5VSSB7XG4gIHRoZW1lPzogYW55O1xuICBhbGl2ZUhhbmRsZT86IGFueTtcblxuICBzdGF0aWMgZ2V0IGRlZmF1bHRPcHRpb25zKCkge1xuICAgIHJldHVybiB7XG4gICAgICBtZXNzYWdlU2VsZWN0b3I6ICcubWVzc2FnZS13cmFwJyxcbiAgICB9O1xuICB9XG5cbiAgaW5zdGFsbFRoZW1lKHRoZW1lOiBhbnkpIHtcbiAgICB0aGlzLnRoZW1lID0gdGhlbWU7XG4gIH1cblxuICAvLyBjb25maXJtKG1lc3NhZ2U6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAvLyAgIG1lc3NhZ2UgPSBtZXNzYWdlIHx8ICdBcmUgeW91IHN1cmU/JztcbiAgLy9cbiAgLy8gICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgLy8gICAgIHJlc29sdmUod2luZG93LmNvbmZpcm0obWVzc2FnZSkpO1xuICAvLyAgIH0pO1xuICAvLyB9XG4gIC8vXG4gIC8vIGFsZXJ0KHRpdGxlOiBzdHJpbmcsIHRleHQgPSAnJywgdHlwZSA9ICdpbmZvJyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAvLyAgIGlmICh0ZXh0KSB7XG4gIC8vICAgICB0aXRsZSArPSAnIHwgJyArIHRleHQ7XG4gIC8vICAgfVxuICAvL1xuICAvLyAgIHdpbmRvdy5hbGVydCh0aXRsZSk7XG4gIC8vXG4gIC8vICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKTtcbiAgLy8gfVxufVxuXG5jb25zdCBwcmVwYXJlczogQWxwaW5lUHJlcGFyZUNhbGxiYWNrW10gPSBbXTtcbnR5cGUgQWxwaW5lUHJlcGFyZUNhbGxiYWNrID0gKEFscGluZTogQWxwaW5lR2xvYmFsKSA9PiBNYXliZVByb21pc2U8YW55PjtcbmNvbnN0IHsgcHJvbWlzZTogYWxwaW5lTG9hZGVkLCByZXNvbHZlOiBhbHBpbmVSZXNvbHZlIH0gPSBQcm9taXNlLndpdGhSZXNvbHZlcnM8QWxwaW5lR2xvYmFsPigpO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9hZEFscGluZShjYWxsYmFjaz86IE51bGxhYmxlPEFscGluZVByZXBhcmVDYWxsYmFjaz4pOiBQcm9taXNlPEFscGluZUdsb2JhbD4ge1xuICBpZiAoY2FsbGJhY2sgJiYgIXdpbmRvdy5BbHBpbmUpIHtcbiAgICBwcmVwYXJlcy5wdXNoKGNhbGxiYWNrKTtcbiAgfVxuXG4gIGNvbnN0IHsgZGVmYXVsdDogQWxwaW5lIH06IHsgZGVmYXVsdDogQWxwaW5lR2xvYmFsIH0gPSBhd2FpdCB1c2VJbXBvcnQoJ0BhbHBpbmVqcycpO1xuXG4gIGlmICghd2luZG93LkFscGluZSkge1xuICAgIGF3YWl0IFByb21pc2UuYWxsKHByZXBhcmVzLm1hcCgoY2FsbGJhY2spID0+IFByb21pc2UucmVzb2x2ZShjYWxsYmFjayhBbHBpbmUpKSkpO1xuXG4gICAgQWxwaW5lLnN0YXJ0KCk7XG5cbiAgICB3aW5kb3cuQWxwaW5lID0gQWxwaW5lO1xuXG4gICAgYWxwaW5lUmVzb2x2ZShBbHBpbmUpO1xuICB9IGVsc2UgaWYgKGNhbGxiYWNrKSB7XG4gICAgYXdhaXQgY2FsbGJhY2soQWxwaW5lKTtcbiAgfVxuXG4gIHJldHVybiBBbHBpbmU7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBpbml0QWxwaW5lQ29tcG9uZW50KGRpcmVjdGl2ZTogc3RyaW5nKSB7XG4gIGNvbnN0IEFscGluZSA9IGF3YWl0IGFscGluZUxvYWRlZDtcblxuICBhd2FpdCBuZXh0VGljaygpO1xuXG4gIHNlbGVjdEFsbDxIVE1MRWxlbWVudD4oYFske2RpcmVjdGl2ZX1dYCwgKGVsKSA9PiB7XG4gICAgY29uc3QgY29kZSA9IGVsLmdldEF0dHJpYnV0ZShkaXJlY3RpdmUpIHx8ICcnO1xuICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShkaXJlY3RpdmUpO1xuXG4gICAgLy8gQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYWxwaW5lanMvYWxwaW5lL2lzc3Vlcy8zNTkjaXNzdWVjb21tZW50LTk3MzY4ODQ2NFxuICAgIEFscGluZS5tdXRhdGVEb20oKCkgPT4ge1xuICAgICAgZWwuc2V0QXR0cmlidXRlKCd4LWRhdGEnLCBjb2RlKTtcbiAgICB9KTtcblxuICAgIEFscGluZS5pbml0VHJlZShlbCk7XG4gIH0pO1xufVxuXG4vKipcbiAqIEJlZm9yZSBBbHBpbmUgaW5pdFxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcHJlcGFyZUFscGluZShjYWxsYmFjazogQWxwaW5lUHJlcGFyZUNhbGxiYWNrKSB7XG4gIGlmICh3aW5kb3cuQWxwaW5lKSB7XG4gICAgYXdhaXQgY2FsbGJhY2sod2luZG93LkFscGluZSk7XG4gIH0gZWxzZSB7XG4gICAgcHJlcGFyZXMucHVzaChjYWxsYmFjayk7XG4gIH1cbn1cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwcmVwYXJlQWxwaW5lRGVmZXIoY2FsbGJhY2s6IEFscGluZVByZXBhcmVDYWxsYmFjaykge1xuICBjb25zdCBBbHBpbmUgPSBhd2FpdCBhbHBpbmVMb2FkZWQ7XG5cbiAgYXdhaXQgY2FsbGJhY2sod2luZG93LkFscGluZSk7XG59XG5cbi8qKlxuICogUmVuZGVyIE1lc3NhZ2VzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyTWVzc2FnZShtZXNzYWdlczogc3RyaW5nIHwgc3RyaW5nW10sIHR5cGU6IHN0cmluZyA9ICdpbmZvJykge1xuICB1aS50aGVtZS5yZW5kZXJNZXNzYWdlKG1lc3NhZ2VzLCB0eXBlKTtcbn1cblxuLyoqXG4gKiBDbGVhciBtZXNzYWdlcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyTWVzc2FnZXMoKSB7XG4gIHVpLnRoZW1lLmNsZWFyTWVzc2FnZXMoKTtcbn1cblxuLyoqXG4gKiBTaG93IG5vdGlmeS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vdGlmeShtZXNzYWdlczogc3RyaW5nIHwgc3RyaW5nW10sIHR5cGU6IHN0cmluZyA9ICdpbmZvJykge1xuICB1aS50aGVtZS5yZW5kZXJNZXNzYWdlKG1lc3NhZ2VzLCB0eXBlKTtcbn1cblxuLyoqXG4gKiBDbGVhciBub3RpZmllcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyTm90aWZpZXMoKSB7XG4gIHVpLnRoZW1lLmNsZWFyTWVzc2FnZXMoKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1hcmsoc2VsZWN0b3I/OiBzdHJpbmcgfCBIVE1MRWxlbWVudCwga2V5d29yZDogc3RyaW5nID0gJycsIG9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fSkge1xuICBjb25zdCBtb2R1bGVzID0gYXdhaXQgdXNlSW1wb3J0KCdAdmVuZG9yL21hcmsuanMvZGlzdC9tYXJrLm1pbi5qcycpO1xuXG4gIGlmIChzZWxlY3RvciAhPSBudWxsKSB7XG4gICAgY29uc3QgaW5zdGFuY2UgPSBuZXcgTWFyayhzZWxlY3Rvcik7XG4gICAgaW5zdGFuY2UubWFyayhrZXl3b3JkLCBvcHRpb25zKTtcbiAgfVxuXG4gIHJldHVybiBtb2R1bGVzO1xufVxuXG4vKipcbiAqIE11bHRpcGxlIFVwbG9hZGVyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtdWx0aVVwbG9hZGVyKCk6IFByb21pc2U8YW55PiB7XG4gIHJldHVybiB1c2VJbXBvcnQoJ0B1bmljb3JuL2ZpZWxkL211bHRpLXVwbG9hZGVyLmpzJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtb2RhbFRyZWUoKTogUHJvbWlzZTxhbnk+IHtcbiAgcmV0dXJuIHVzZUltcG9ydCgnQHVuaWNvcm4vZmllbGQvbW9kYWwtdHJlZS5qcycpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2xpZGVVcCh0YXJnZXQ6IHN0cmluZyB8IEhUTUxFbGVtZW50LCBkdXJhdGlvbjogbnVtYmVyID0gMzAwKTogUHJvbWlzZTxBbmltYXRpb24gfCB2b2lkPiB7XG4gIGNvbnN0IGVsZSA9IHNlbGVjdE9uZSh0YXJnZXQpO1xuXG4gIGlmICghZWxlKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICB9XG5cbiAgZWxlLnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG5cbiAgY29uc3QgYW5pbWF0aW9uID0gYW5pbWF0ZVRvKFxuICAgIGVsZSxcbiAgICB7IGhlaWdodDogMCwgcGFkZGluZ1RvcDogMCwgcGFkZGluZ0JvdHRvbTogMCB9LFxuICAgIHsgZHVyYXRpb24sIGVhc2luZzogJ2Vhc2Utb3V0JyB9XG4gICk7XG5cbiAgZGF0YShlbGUsICdhbmltYXRpb24uc2xpZGluZy51cCcsIHRydWUpO1xuXG4gIGNvbnN0IHIgPSBhd2FpdCBhbmltYXRpb24uZmluaXNoZWQ7XG5cbiAgaWYgKCFkYXRhKGVsZSwgJ2FuaW1hdGlvbi5zbGlkaW5nLmRvd24nKSkge1xuICAgIGVsZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICB9XG5cbiAgcmVtb3ZlRGF0YShlbGUsICdhbmltYXRpb24uc2xpZGluZy51cCcpO1xuXG4gIHJldHVybiByO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2xpZGVEb3duKFxuICB0YXJnZXQ6IHN0cmluZyB8IEhUTUxFbGVtZW50LFxuICBkdXJhdGlvbjogbnVtYmVyID0gMzAwLFxuICBkaXNwbGF5OiBzdHJpbmcgPSAnYmxvY2snKTogUHJvbWlzZTxBbmltYXRpb24gfCB2b2lkPiB7XG4gIGNvbnN0IGVsZSA9IHNlbGVjdE9uZSh0YXJnZXQpO1xuXG4gIGlmICghZWxlKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICB9XG5cbiAgZGF0YShlbGUsICdhbmltYXRpb24uc2xpZGluZy5kb3duJywgdHJ1ZSk7XG5cbiAgZWxlLnN0eWxlLmRpc3BsYXkgPSBkaXNwbGF5O1xuXG4vLyBHZXQgaGVpZ2h0XG4gIGxldCBtYXhIZWlnaHQgPSAwO1xuICBmb3IgKGNvbnN0IGNoaWxkIG9mIEFycmF5LmZyb20oZWxlLmNoaWxkcmVuKSBhcyBIVE1MRWxlbWVudFtdKSB7XG4gICAgbWF4SGVpZ2h0ID0gTWF0aC5tYXgoY2hpbGQub2Zmc2V0SGVpZ2h0LCBtYXhIZWlnaHQpO1xuICB9XG5cbiAgY29uc3QgYW5pbWF0aW9uID0gYW5pbWF0ZVRvKFxuICAgIGVsZSxcbiAgICB7XG4gICAgICBoZWlnaHQ6IFtcbiAgICAgICAgMCxcbiAgICAgICAgbWF4SGVpZ2h0ICsgJ3B4J1xuICAgICAgXVxuICAgIH0sXG4gICAgeyBkdXJhdGlvbiwgZWFzaW5nOiAnZWFzZS1vdXQnIH1cbiAgKTtcblxuICBhbmltYXRpb24uYWRkRXZlbnRMaXN0ZW5lcignZmluaXNoJywgKCkgPT4ge1xuICAgIGVsZS5zdHlsZS5oZWlnaHQgPSAnJztcblxuICAgIGlmICghZGF0YShlbGUsICdhbmltYXRpb24uc2xpZGluZy51cCcpKSB7XG4gICAgICBlbGUuc3R5bGUub3ZlcmZsb3cgPSAndmlzaWJsZSc7XG4gICAgfVxuXG4gICAgcmVtb3ZlRGF0YShlbGUsICdhbmltYXRpb24uc2xpZGluZy5kb3duJyk7XG4gIH0pO1xuXG4gIHJldHVybiBhbmltYXRpb24uZmluaXNoZWQ7XG59XG5cbi8qKlxuICogc2xpZGVUb2dnbGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNsaWRlVG9nZ2xlKFxuICB0YXJnZXQ6IHN0cmluZyB8IEhUTUxFbGVtZW50LFxuICBkdXJhdGlvbjogbnVtYmVyID0gNTAwLFxuICBkaXNwbGF5OiBzdHJpbmcgPSAnYmxvY2snKTogUHJvbWlzZTxBbmltYXRpb24gfCB2b2lkPiB7XG4gIGNvbnN0IGVsZSA9IHNlbGVjdE9uZSh0YXJnZXQpO1xuXG4gIGlmICghZWxlKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICB9XG5cbiAgaWYgKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZSkuZGlzcGxheSA9PT0gJ25vbmUnKSB7XG4gICAgcmV0dXJuIHNsaWRlRG93bihlbGUsIGR1cmF0aW9uLCBkaXNwbGF5KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gc2xpZGVVcChlbGUsIGR1cmF0aW9uKTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmFkZU91dChzZWxlY3Rvcjogc3RyaW5nIHwgSFRNTEVsZW1lbnQsIGR1cmF0aW9uOiBudW1iZXIgPSA1MDApOiBQcm9taXNlPEFuaW1hdGlvbiB8IHZvaWQ+IHtcbiAgY29uc3QgZWwgPSBzZWxlY3RPbmUoc2VsZWN0b3IpO1xuXG4gIGlmICghZWwpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBhbmltYXRpb24gPSBhbmltYXRlVG8oZWwsIHsgb3BhY2l0eTogMCB9LCB7IGR1cmF0aW9uLCBlYXNpbmc6ICdlYXNlLW91dCcgfSk7XG5cbiAgY29uc3QgcCA9IGF3YWl0IGFuaW1hdGlvbi5maW5pc2hlZDtcbiAgZWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxuICByZXR1cm4gcDtcbn07XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmYWRlSW4oXG4gIHNlbGVjdG9yOiBzdHJpbmcgfCBIVE1MRWxlbWVudCxcbiAgZHVyYXRpb246IG51bWJlciA9IDUwMCxcbiAgZGlzcGxheTogc3RyaW5nID0gJ2Jsb2NrJ1xuKTogUHJvbWlzZTxBbmltYXRpb24gfCB2b2lkPiB7XG4gIGNvbnN0IGVsID0gc2VsZWN0T25lKHNlbGVjdG9yKTtcblxuICBpZiAoIWVsKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZWwuc3R5bGUuZGlzcGxheSA9ICcnO1xuXG4gIGlmICh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCkuZGlzcGxheSAhPT0gZGlzcGxheSkge1xuICAgIGVsLnN0eWxlLmRpc3BsYXkgPSBkaXNwbGF5O1xuICB9XG5cbiAgY29uc3QgYW5pbWF0aW9uID0gYW5pbWF0ZVRvKGVsLCB7IG9wYWNpdHk6IDEgfSwgeyBkdXJhdGlvbiwgZWFzaW5nOiAnZWFzZS1vdXQnIH0pO1xuXG4gIHJldHVybiBhbmltYXRpb24uZmluaXNoZWQ7XG59O1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGlnaGxpZ2h0KFxuICBzZWxlY3Rvcjogc3RyaW5nIHwgSFRNTEVsZW1lbnQsXG4gIGNvbG9yOiBzdHJpbmcgPSAnI2ZmZmY5OScsXG4gIGR1cmF0aW9uOiBudW1iZXIgPSA2MDBcbik6IFByb21pc2U8QW5pbWF0aW9uIHwgdm9pZD4ge1xuICBjb25zdCBlbGUgPSBzZWxlY3RPbmUoc2VsZWN0b3IpO1xuXG4gIGlmICghZWxlKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZHVyYXRpb24gLz0gMjtcbiAgY29uc3QgYmcgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGUpLmJhY2tncm91bmRDb2xvcjtcblxuICBjb25zdCBhbmltYXRpb24gPSBhbmltYXRlVG8oZWxlLCB7IGJhY2tncm91bmRDb2xvcjogY29sb3IgfSwgeyBkdXJhdGlvbiB9KTtcblxuICBhd2FpdCBhbmltYXRpb24uZmluaXNoZWQ7XG5cbiAgcmV0dXJuIGFuaW1hdGVUbyhlbGUsIHsgYmFja2dyb3VuZENvbG9yOiBiZyB9LCB7IGR1cmF0aW9uIH0pO1xufVxuXG4vKipcbiAqIENvbG9yIFBpY2tlci5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVzZUNvbG9yUGlja2VyKFxuICBzZWxlY3Rvcj86IE51bGxhYmxlPHN0cmluZyB8IEhUTUxFbGVtZW50IHwgTm9kZUxpc3RPZjxIVE1MRWxlbWVudD4+LFxuICBvcHRpb25zOiBQYXJ0aWFsPFNwZWN0cnVtT3B0aW9ucz4gPSB7fVxuKTogUHJvbWlzZTxhbnk+IHtcbiAgaWYgKG9wdGlvbnM/LnRoZW1lID09PSAnZGFyaycpIHtcbiAgICB1c2VDc3NJbXBvcnQoJ0BzcGVjdHJ1bS9zcGVjdHJ1bS1kYXJrLm1pbi5jc3MnKTtcbiAgfSBlbHNlIGlmICghb3B0aW9ucz8udGhlbWUpIHtcbiAgICB1c2VDc3NJbXBvcnQoJ0BzcGVjdHJ1bS9zcGVjdHJ1bS5taW4uY3NzJyk7XG4gIH1cblxuICBjb25zdCBtID0gYXdhaXQgdXNlSW1wb3J0KCdAc3BlY3RydW0nKTtcblxuLy8gTG9jYWxlXG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5sb2NhbGUgPT09ICdzdHJpbmcnKSB7XG4gICAgbGV0IGxzOiBhbnkgPSBvcHRpb25zLmxvY2FsZS5zcGxpdCgnLScpLm1hcCgobCkgPT4gbC50b0xvd2VyQ2FzZSgpKTtcblxuICAgIGlmIChsc1swXSA9PT0gbHNbMV0pIHtcbiAgICAgIGxzID0gW2xzXTtcbiAgICB9XG5cbiAgICBscyA9IGxzLmpvaW4oJy0nKTtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgdXNlSW1wb3J0KGBAc3BlY3RydW0vaTE4bi8ke2xzfS5qc2ApO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUud2FybihgVW5hYmxlIHRvIGxvYWQgU3BlY3RydW0gbG9jYWxlIFwiJHtsc31cIiAoJHtvcHRpb25zLmxvY2FsZX0pYCk7XG4gICAgfVxuICB9XG5cbiAgaWYgKHNlbGVjdG9yKSB7XG4gICAgbW9kdWxlPGFueSwgSFRNTEVsZW1lbnQ+KHNlbGVjdG9yLCAnc3BlY3RydW0nLCAoZWxlKSA9PiBTcGVjdHJ1bS5nZXRJbnN0YW5jZShlbGUsIG9wdGlvbnMpKTtcbiAgfVxuXG4gIHJldHVybiBtO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXNlRGlzYWJsZU9uU3VibWl0KFxuICBmb3JtU2VsZWN0b3I6IHN0cmluZyB8IEhUTUxGb3JtRWxlbWVudCA9ICcjYWRtaW4tZm9ybScsXG4gIGJ1dHRvblNlbGVjdG9yOiBzdHJpbmcgPSAnJyxcbiAgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9XG4pIHtcbiAgLy8gVG9kbzogVXNlIG9iamVjdCB0byBoYW5kbGUgaXRcbiAgYnV0dG9uU2VsZWN0b3IgPSBidXR0b25TZWxlY3RvciB8fCBbXG4gICAgJyNhZG1pbi10b29sYmFyIGJ1dHRvbicsXG4gICAgJyNhZG1pbi10b29sYmFyIGEnLFxuICAgIGZvcm1TZWxlY3RvciArICcgLmRpc2FibGUtb24tc3VibWl0JyxcbiAgICBmb3JtU2VsZWN0b3IgKyAnIC5qcy1kb3MnLFxuICAgIGZvcm1TZWxlY3RvciArICcgW2RhdGEtZG9zXScsXG4gIF0uam9pbignLCcpO1xuXG4gIGNvbnN0IGljb25TZWxlY3RvciA9IG9wdGlvbnMuaWNvblNlbGVjdG9yIHx8IFtcbiAgICAnW2NsYXNzKj1cImZhLVwiXScsXG4gICAgJ1tkYXRhLXNwaW5dJyxcbiAgICAnW2RhdGEtc3Bpbm5lcl0nLFxuICBdLmpvaW4oJywnKTtcblxuICBjb25zdCBldmVudCA9IG9wdGlvbnMuZXZlbnQgfHwgJ3N1Ym1pdCc7XG4gIGNvbnN0IHNwaW5uZXJDbGFzcyA9IG9wdGlvbnMuc3Bpbm5lckNsYXNzIHx8ICdzcGlubmVyLWJvcmRlciBzcGlubmVyLWJvcmRlci1zbSc7XG5cbiAgc2VsZWN0QWxsPEhUTUxFbGVtZW50PihidXR0b25TZWxlY3RvciwgKGJ1dHRvbikgPT4ge1xuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBidXR0b24uZGF0YXNldC5jbGlja2VkID0gJzEnO1xuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgZGVsZXRlIGJ1dHRvbi5kYXRhc2V0LmNsaWNrZWQ7XG4gICAgICB9LCAxNTAwKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgY29uc3QgZm9ybSA9IHNlbGVjdE9uZTxIVE1MRm9ybUVsZW1lbnQ+KGZvcm1TZWxlY3Rvcik7XG4gIGZvcm0/LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIChlOiBTdWJtaXRFdmVudCkgPT4ge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaWYgKCFmb3JtLmNoZWNrVmFsaWRpdHkoKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHNlbGVjdEFsbDxIVE1MRWxlbWVudD4oYnV0dG9uU2VsZWN0b3IsIChidXR0b24pID0+IHtcbiAgICAgICAgYnV0dG9uLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnbm9uZSc7XG4gICAgICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyk7XG4gICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlZCcpO1xuXG4gICAgICAgIGlmIChidXR0b24uZGF0YXNldC5jbGlja2VkKSB7XG4gICAgICAgICAgbGV0IGljb24gPSBidXR0b24ucXVlcnlTZWxlY3RvcihpY29uU2VsZWN0b3IpO1xuXG4gICAgICAgICAgaWYgKGljb24pIHtcbiAgICAgICAgICAgIGNvbnN0IGkgPSBodG1sKCc8aT48L2k+Jyk7XG4gICAgICAgICAgICBpY29uLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKGksIGljb24pO1xuXG4gICAgICAgICAgICBpLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBzcGlubmVyQ2xhc3MpO1xuICAgICAgICAgICAgLy8gaWNvbi5zdHlsZXMud2lkdGggPSAnMWVtJztcbiAgICAgICAgICAgIC8vIGljb24uc3R5bGVzLmhlaWdodCA9ICcxZW0nO1xuICAgICAgICAgICAgLy8gaWNvbi5zdHlsZXMuYm9yZGVyV2l0aCA9ICcuMTVlbSc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LCAwKTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VEaXNhYmxlSWZTdGFja05vdEVtcHR5KGJ1dHRvblNlbGVjdG9yOiBzdHJpbmcgPSAnW2RhdGEtdGFzaz1zYXZlXScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFja05hbWU6IHN0cmluZyA9ICd1cGxvYWRpbmcnKSB7XG4gIGNvbnN0IHN0YWNrID0gdXNlU3RhY2soc3RhY2tOYW1lKTtcblxuICBzdGFjay5vYnNlcnZlKChzdGFjaywgbGVuZ3RoKSA9PiB7XG4gICAgZm9yIChjb25zdCBidXR0b24gb2Ygc2VsZWN0QWxsPEhUTUxFbGVtZW50PihidXR0b25TZWxlY3RvcikpIHtcbiAgICAgIGlmIChsZW5ndGggPiAwKSB7XG4gICAgICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyk7XG4gICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlZCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYnV0dG9uLnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc2FibGVkJyk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuLyoqXG4gKiBLZWVwIGFsaXZlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdXNlS2VlcEFsaXZlKHVybDogc3RyaW5nLCB0aW1lOiBudW1iZXIgPSA2MDAwMCk6ICgpID0+IHZvaWQge1xuICBjb25zdCBhbGl2ZUhhbmRsZSA9IHdpbmRvdy5zZXRJbnRlcnZhbCgoKSA9PiBmZXRjaCh1cmwpLCB0aW1lKTtcblxuICByZXR1cm4gKCkgPT4ge1xuICAgIGNsZWFySW50ZXJ2YWwoYWxpdmVIYW5kbGUpO1xuICB9O1xufVxuXG4vKipcbiAqIFZ1ZSBjb21wb25lbnQgZmllbGQuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VWdWVDb21wb25lbnRGaWVsZChcbiAgc2VsZWN0b3I/OiBOdWxsYWJsZTxzdHJpbmcgfCBIVE1MRWxlbWVudD4sXG4gIHZhbHVlPzogYW55LFxuICBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge31cbik6IFByb21pc2U8YW55PiB7XG4gIGNvbnN0IG0gPSBhd2FpdCB1c2VJbXBvcnQoJ0B1bmljb3JuL2ZpZWxkL3Z1ZS1jb21wb25lbnQtZmllbGQuanMnKTtcblxuICBpZiAoc2VsZWN0b3IpIHtcbiAgICBtLlZ1ZUNvbXBvbmVudEZpZWxkLmluaXQoc2VsZWN0b3IsIHZhbHVlLCBvcHRpb25zKTtcbiAgfVxuXG4gIHJldHVybiBtO1xufVxuXG5kZWNsYXJlIGdsb2JhbCB7XG4gIHZhciBBbHBpbmU6IEFscGluZUdsb2JhbDtcbiAgdmFyIFRvbVNlbGVjdDogdHlwZW9mIFRvbVNlbGVjdEdsb2JhbDtcbiAgdmFyIFNwZWN0cnVtOiB0eXBlb2YgU3BlY3RydW1HbG9iYWw7XG4gIHZhciBNYXJrOiBhbnk7XG59XG4iLCJpbXBvcnQgeyBkYXRhIH0gZnJvbSAnLi4vZGF0YSc7XG5cbnR5cGUgVXJpVHlwZXMgPSAnZnVsbCcgfCAncGF0aCcgfCAncm9vdCcgfCAnY3VycmVudCcgfCAncm91dGUnIHwgJ3NjcmlwdCc7XG50eXBlIEFzc2V0VHlwZXMgPSAncm9vdCcgfCAncGF0aCc7XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VTeXN0ZW1VcmkoKTogVW5pY29yblN5c3RlbVVyaTtcbmV4cG9ydCBmdW5jdGlvbiB1c2VTeXN0ZW1VcmkodHlwZTogVXJpVHlwZXMpOiBzdHJpbmc7XG5leHBvcnQgZnVuY3Rpb24gdXNlU3lzdGVtVXJpKHR5cGU/OiBVcmlUeXBlcywgcGF0aD86IHN0cmluZyk6IFVuaWNvcm5TeXN0ZW1VcmkgfCBzdHJpbmcge1xuICBjb25zdCB1cmkgPSBVbmljb3JuU3lzdGVtVXJpLmdldCgpO1xuXG4gIGlmICh0eXBlKSB7XG4gICAgcmV0dXJuIHVyaVt0eXBlXShwYXRoKTtcbiAgfVxuXG4gIHJldHVybiB1cmk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VBc3NldFVyaSgpOiBVbmljb3JuQXNzZXRVcmk7XG5leHBvcnQgZnVuY3Rpb24gdXNlQXNzZXRVcmkodHlwZT86IEFzc2V0VHlwZXMsIHBhdGg/OiBzdHJpbmcpOiBzdHJpbmc7XG5leHBvcnQgZnVuY3Rpb24gdXNlQXNzZXRVcmkodHlwZT86IEFzc2V0VHlwZXMsIHBhdGg/OiBzdHJpbmcpOiBVbmljb3JuQXNzZXRVcmkgfCBzdHJpbmcge1xuICBjb25zdCBhc3NldCA9IFVuaWNvcm5Bc3NldFVyaS5nZXQoKTtcblxuICBpZiAodHlwZSkge1xuICAgIHJldHVybiBhc3NldFt0eXBlXShwYXRoKTtcbiAgfVxuXG4gIHJldHVybiBhc3NldDtcbn1cblxuZnVuY3Rpb24gdXJpKHR5cGU6IHN0cmluZykge1xuICByZXR1cm4gZGF0YSgndW5pY29ybi51cmknKVt0eXBlXTtcbn1cblxuZnVuY3Rpb24gYXNzZXQodHlwZTogc3RyaW5nKSB7XG4gIHJldHVybiB1cmkoJ2Fzc2V0JylbdHlwZV07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRVcmlCYXNlKHVyaTogc3RyaW5nLCB0eXBlID0gJ3BhdGgnKSB7XG4gIGlmICh1cmkuc3Vic3RyaW5nKDAsIDIpID09PSAnL1xcLycgfHwgdXJpLnN1YnN0cmluZygwLCA0KSA9PT0gJ2h0dHAnKSB7XG4gICAgcmV0dXJuIHVyaTtcbiAgfVxuXG4gIHJldHVybiBhc3NldCh0eXBlKSArICcvJyArIHVyaTtcbn1cblxuZXhwb3J0IGNsYXNzIFVuaWNvcm5TeXN0ZW1VcmkgZXh0ZW5kcyBVUkwge1xuICBzdGF0aWMgaW5zdGFuY2U6IFVuaWNvcm5TeXN0ZW1Vcmk7XG5cbiAgc3RhdGljIGdldCgpIHtcbiAgICByZXR1cm4gdGhpcy5pbnN0YW5jZSA/Pz0gbmV3IHRoaXModXJpKCdmdWxsJykpO1xuICB9XG5cbiAgcGF0aChwYXRoOiBzdHJpbmcgPSAnJyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHVyaSgncGF0aCcpICsgcGF0aDtcbiAgfVxuXG4gIHJvb3QocGF0aDogc3RyaW5nID0gJycpOiBzdHJpbmcge1xuICAgIHJldHVybiB1cmkoJ3Jvb3QnKSArIHBhdGg7XG4gIH1cblxuICBjdXJyZW50KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHVyaSgnY3VycmVudCcpIHx8ICcnO1xuICB9XG5cbiAgZnVsbCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB1cmkoJ2Z1bGwnKSB8fCAnJztcbiAgfVxuXG4gIHJvdXRlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHVyaSgncm91dGUnKSB8fCAnJztcbiAgfVxuXG4gIHNjcmlwdCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB1cmkoJ3NjcmlwdCcpIHx8ICcnO1xuICB9XG5cbiAgcm91dGVXaXRoUXVlcnkoKSB7XG4gICAgY29uc3Qgcm91dGUgPSB0aGlzLnJvdXRlKCk7XG4gICAgY29uc3QgcXVlcnkgPSB0aGlzLnNlYXJjaFBhcmFtcy50b1N0cmluZygpO1xuXG4gICAgcmV0dXJuIHF1ZXJ5ID8gYCR7cm91dGV9PyR7cXVlcnl9YCA6IHJvdXRlO1xuICB9XG5cbiAgcm91dGVBbmRRdWVyeSgpIHtcbiAgICBjb25zdCByb3V0ZSA9IHRoaXMucm91dGUoKTtcbiAgICBjb25zdCBxdWVyeSA9IHRoaXMuc2VhcmNoUGFyYW1zLnRvU3RyaW5nKCk7XG5cbiAgICByZXR1cm4gW3JvdXRlLCBxdWVyeV07XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFVuaWNvcm5Bc3NldFVyaSB7XG4gIHN0YXRpYyBpbnN0YW5jZTogVW5pY29ybkFzc2V0VXJpO1xuXG4gIHN0YXRpYyBnZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5zdGFuY2UgPz89IG5ldyB0aGlzKCk7XG4gIH1cblxuICBwYXRoKHBhdGg6IHN0cmluZyA9ICcnKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYXNzZXQoJ3BhdGgnKSArIHBhdGg7XG4gIH1cblxuICByb290KHBhdGg6IHN0cmluZyA9ICcnKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYXNzZXQoJ3Jvb3QnKSArIHBhdGg7XG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqIEB0eXBlIHtpbXBvcnQoJy4vdHlwZScpfSAqL1xubW9kdWxlLmV4cG9ydHMgPSBUeXBlRXJyb3I7XG4iLCJleHBvcnQgZGVmYXVsdCB7fSIsInZhciBoYXNNYXAgPSB0eXBlb2YgTWFwID09PSAnZnVuY3Rpb24nICYmIE1hcC5wcm90b3R5cGU7XG52YXIgbWFwU2l6ZURlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yICYmIGhhc01hcCA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTWFwLnByb3RvdHlwZSwgJ3NpemUnKSA6IG51bGw7XG52YXIgbWFwU2l6ZSA9IGhhc01hcCAmJiBtYXBTaXplRGVzY3JpcHRvciAmJiB0eXBlb2YgbWFwU2l6ZURlc2NyaXB0b3IuZ2V0ID09PSAnZnVuY3Rpb24nID8gbWFwU2l6ZURlc2NyaXB0b3IuZ2V0IDogbnVsbDtcbnZhciBtYXBGb3JFYWNoID0gaGFzTWFwICYmIE1hcC5wcm90b3R5cGUuZm9yRWFjaDtcbnZhciBoYXNTZXQgPSB0eXBlb2YgU2V0ID09PSAnZnVuY3Rpb24nICYmIFNldC5wcm90b3R5cGU7XG52YXIgc2V0U2l6ZURlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yICYmIGhhc1NldCA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoU2V0LnByb3RvdHlwZSwgJ3NpemUnKSA6IG51bGw7XG52YXIgc2V0U2l6ZSA9IGhhc1NldCAmJiBzZXRTaXplRGVzY3JpcHRvciAmJiB0eXBlb2Ygc2V0U2l6ZURlc2NyaXB0b3IuZ2V0ID09PSAnZnVuY3Rpb24nID8gc2V0U2l6ZURlc2NyaXB0b3IuZ2V0IDogbnVsbDtcbnZhciBzZXRGb3JFYWNoID0gaGFzU2V0ICYmIFNldC5wcm90b3R5cGUuZm9yRWFjaDtcbnZhciBoYXNXZWFrTWFwID0gdHlwZW9mIFdlYWtNYXAgPT09ICdmdW5jdGlvbicgJiYgV2Vha01hcC5wcm90b3R5cGU7XG52YXIgd2Vha01hcEhhcyA9IGhhc1dlYWtNYXAgPyBXZWFrTWFwLnByb3RvdHlwZS5oYXMgOiBudWxsO1xudmFyIGhhc1dlYWtTZXQgPSB0eXBlb2YgV2Vha1NldCA9PT0gJ2Z1bmN0aW9uJyAmJiBXZWFrU2V0LnByb3RvdHlwZTtcbnZhciB3ZWFrU2V0SGFzID0gaGFzV2Vha1NldCA/IFdlYWtTZXQucHJvdG90eXBlLmhhcyA6IG51bGw7XG52YXIgaGFzV2Vha1JlZiA9IHR5cGVvZiBXZWFrUmVmID09PSAnZnVuY3Rpb24nICYmIFdlYWtSZWYucHJvdG90eXBlO1xudmFyIHdlYWtSZWZEZXJlZiA9IGhhc1dlYWtSZWYgPyBXZWFrUmVmLnByb3RvdHlwZS5kZXJlZiA6IG51bGw7XG52YXIgYm9vbGVhblZhbHVlT2YgPSBCb29sZWFuLnByb3RvdHlwZS52YWx1ZU9mO1xudmFyIG9iamVjdFRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbnZhciBmdW5jdGlvblRvU3RyaW5nID0gRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nO1xudmFyICRtYXRjaCA9IFN0cmluZy5wcm90b3R5cGUubWF0Y2g7XG52YXIgJHNsaWNlID0gU3RyaW5nLnByb3RvdHlwZS5zbGljZTtcbnZhciAkcmVwbGFjZSA9IFN0cmluZy5wcm90b3R5cGUucmVwbGFjZTtcbnZhciAkdG9VcHBlckNhc2UgPSBTdHJpbmcucHJvdG90eXBlLnRvVXBwZXJDYXNlO1xudmFyICR0b0xvd2VyQ2FzZSA9IFN0cmluZy5wcm90b3R5cGUudG9Mb3dlckNhc2U7XG52YXIgJHRlc3QgPSBSZWdFeHAucHJvdG90eXBlLnRlc3Q7XG52YXIgJGNvbmNhdCA9IEFycmF5LnByb3RvdHlwZS5jb25jYXQ7XG52YXIgJGpvaW4gPSBBcnJheS5wcm90b3R5cGUuam9pbjtcbnZhciAkYXJyU2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG52YXIgJGZsb29yID0gTWF0aC5mbG9vcjtcbnZhciBiaWdJbnRWYWx1ZU9mID0gdHlwZW9mIEJpZ0ludCA9PT0gJ2Z1bmN0aW9uJyA/IEJpZ0ludC5wcm90b3R5cGUudmFsdWVPZiA6IG51bGw7XG52YXIgZ09QUyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG52YXIgc3ltVG9TdHJpbmcgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09ICdzeW1ib2wnID8gU3ltYm9sLnByb3RvdHlwZS50b1N0cmluZyA6IG51bGw7XG52YXIgaGFzU2hhbW1lZFN5bWJvbHMgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09ICdvYmplY3QnO1xuLy8gaWUsIGBoYXMtdG9zdHJpbmd0YWcvc2hhbXNcbnZhciB0b1N0cmluZ1RhZyA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLnRvU3RyaW5nVGFnICYmICh0eXBlb2YgU3ltYm9sLnRvU3RyaW5nVGFnID09PSBoYXNTaGFtbWVkU3ltYm9scyA/ICdvYmplY3QnIDogJ3N5bWJvbCcpXG4gICAgPyBTeW1ib2wudG9TdHJpbmdUYWdcbiAgICA6IG51bGw7XG52YXIgaXNFbnVtZXJhYmxlID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxudmFyIGdQTyA9ICh0eXBlb2YgUmVmbGVjdCA9PT0gJ2Z1bmN0aW9uJyA/IFJlZmxlY3QuZ2V0UHJvdG90eXBlT2YgOiBPYmplY3QuZ2V0UHJvdG90eXBlT2YpIHx8IChcbiAgICBbXS5fX3Byb3RvX18gPT09IEFycmF5LnByb3RvdHlwZSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXByb3RvXG4gICAgICAgID8gZnVuY3Rpb24gKE8pIHtcbiAgICAgICAgICAgIHJldHVybiBPLl9fcHJvdG9fXzsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1wcm90b1xuICAgICAgICB9XG4gICAgICAgIDogbnVsbFxuKTtcblxuZnVuY3Rpb24gYWRkTnVtZXJpY1NlcGFyYXRvcihudW0sIHN0cikge1xuICAgIGlmIChcbiAgICAgICAgbnVtID09PSBJbmZpbml0eVxuICAgICAgICB8fCBudW0gPT09IC1JbmZpbml0eVxuICAgICAgICB8fCBudW0gIT09IG51bVxuICAgICAgICB8fCAobnVtICYmIG51bSA+IC0xMDAwICYmIG51bSA8IDEwMDApXG4gICAgICAgIHx8ICR0ZXN0LmNhbGwoL2UvLCBzdHIpXG4gICAgKSB7XG4gICAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuICAgIHZhciBzZXBSZWdleCA9IC9bMC05XSg/PSg/OlswLTldezN9KSsoPyFbMC05XSkpL2c7XG4gICAgaWYgKHR5cGVvZiBudW0gPT09ICdudW1iZXInKSB7XG4gICAgICAgIHZhciBpbnQgPSBudW0gPCAwID8gLSRmbG9vcigtbnVtKSA6ICRmbG9vcihudW0pOyAvLyB0cnVuYyhudW0pXG4gICAgICAgIGlmIChpbnQgIT09IG51bSkge1xuICAgICAgICAgICAgdmFyIGludFN0ciA9IFN0cmluZyhpbnQpO1xuICAgICAgICAgICAgdmFyIGRlYyA9ICRzbGljZS5jYWxsKHN0ciwgaW50U3RyLmxlbmd0aCArIDEpO1xuICAgICAgICAgICAgcmV0dXJuICRyZXBsYWNlLmNhbGwoaW50U3RyLCBzZXBSZWdleCwgJyQmXycpICsgJy4nICsgJHJlcGxhY2UuY2FsbCgkcmVwbGFjZS5jYWxsKGRlYywgLyhbMC05XXszfSkvZywgJyQmXycpLCAvXyQvLCAnJyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuICRyZXBsYWNlLmNhbGwoc3RyLCBzZXBSZWdleCwgJyQmXycpO1xufVxuXG52YXIgdXRpbEluc3BlY3QgPSByZXF1aXJlKCcuL3V0aWwuaW5zcGVjdCcpO1xudmFyIGluc3BlY3RDdXN0b20gPSB1dGlsSW5zcGVjdC5jdXN0b207XG52YXIgaW5zcGVjdFN5bWJvbCA9IGlzU3ltYm9sKGluc3BlY3RDdXN0b20pID8gaW5zcGVjdEN1c3RvbSA6IG51bGw7XG5cbnZhciBxdW90ZXMgPSB7XG4gICAgX19wcm90b19fOiBudWxsLFxuICAgICdkb3VibGUnOiAnXCInLFxuICAgIHNpbmdsZTogXCInXCJcbn07XG52YXIgcXVvdGVSRXMgPSB7XG4gICAgX19wcm90b19fOiBudWxsLFxuICAgICdkb3VibGUnOiAvKFtcIlxcXFxdKS9nLFxuICAgIHNpbmdsZTogLyhbJ1xcXFxdKS9nXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluc3BlY3RfKG9iaiwgb3B0aW9ucywgZGVwdGgsIHNlZW4pIHtcbiAgICB2YXIgb3B0cyA9IG9wdGlvbnMgfHwge307XG5cbiAgICBpZiAoaGFzKG9wdHMsICdxdW90ZVN0eWxlJykgJiYgIWhhcyhxdW90ZXMsIG9wdHMucXVvdGVTdHlsZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignb3B0aW9uIFwicXVvdGVTdHlsZVwiIG11c3QgYmUgXCJzaW5nbGVcIiBvciBcImRvdWJsZVwiJyk7XG4gICAgfVxuICAgIGlmIChcbiAgICAgICAgaGFzKG9wdHMsICdtYXhTdHJpbmdMZW5ndGgnKSAmJiAodHlwZW9mIG9wdHMubWF4U3RyaW5nTGVuZ3RoID09PSAnbnVtYmVyJ1xuICAgICAgICAgICAgPyBvcHRzLm1heFN0cmluZ0xlbmd0aCA8IDAgJiYgb3B0cy5tYXhTdHJpbmdMZW5ndGggIT09IEluZmluaXR5XG4gICAgICAgICAgICA6IG9wdHMubWF4U3RyaW5nTGVuZ3RoICE9PSBudWxsXG4gICAgICAgIClcbiAgICApIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignb3B0aW9uIFwibWF4U3RyaW5nTGVuZ3RoXCIsIGlmIHByb3ZpZGVkLCBtdXN0IGJlIGEgcG9zaXRpdmUgaW50ZWdlciwgSW5maW5pdHksIG9yIGBudWxsYCcpO1xuICAgIH1cbiAgICB2YXIgY3VzdG9tSW5zcGVjdCA9IGhhcyhvcHRzLCAnY3VzdG9tSW5zcGVjdCcpID8gb3B0cy5jdXN0b21JbnNwZWN0IDogdHJ1ZTtcbiAgICBpZiAodHlwZW9mIGN1c3RvbUluc3BlY3QgIT09ICdib29sZWFuJyAmJiBjdXN0b21JbnNwZWN0ICE9PSAnc3ltYm9sJykge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdvcHRpb24gXCJjdXN0b21JbnNwZWN0XCIsIGlmIHByb3ZpZGVkLCBtdXN0IGJlIGB0cnVlYCwgYGZhbHNlYCwgb3IgYFxcJ3N5bWJvbFxcJ2AnKTtcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICAgIGhhcyhvcHRzLCAnaW5kZW50JylcbiAgICAgICAgJiYgb3B0cy5pbmRlbnQgIT09IG51bGxcbiAgICAgICAgJiYgb3B0cy5pbmRlbnQgIT09ICdcXHQnXG4gICAgICAgICYmICEocGFyc2VJbnQob3B0cy5pbmRlbnQsIDEwKSA9PT0gb3B0cy5pbmRlbnQgJiYgb3B0cy5pbmRlbnQgPiAwKVxuICAgICkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdvcHRpb24gXCJpbmRlbnRcIiBtdXN0IGJlIFwiXFxcXHRcIiwgYW4gaW50ZWdlciA+IDAsIG9yIGBudWxsYCcpO1xuICAgIH1cbiAgICBpZiAoaGFzKG9wdHMsICdudW1lcmljU2VwYXJhdG9yJykgJiYgdHlwZW9mIG9wdHMubnVtZXJpY1NlcGFyYXRvciAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ29wdGlvbiBcIm51bWVyaWNTZXBhcmF0b3JcIiwgaWYgcHJvdmlkZWQsIG11c3QgYmUgYHRydWVgIG9yIGBmYWxzZWAnKTtcbiAgICB9XG4gICAgdmFyIG51bWVyaWNTZXBhcmF0b3IgPSBvcHRzLm51bWVyaWNTZXBhcmF0b3I7XG5cbiAgICBpZiAodHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuICd1bmRlZmluZWQnO1xuICAgIH1cbiAgICBpZiAob2JqID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiAnbnVsbCc7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygb2JqID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgcmV0dXJuIG9iaiA/ICd0cnVlJyA6ICdmYWxzZSc7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBvYmogPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiBpbnNwZWN0U3RyaW5nKG9iaiwgb3B0cyk7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygb2JqID09PSAnbnVtYmVyJykge1xuICAgICAgICBpZiAob2JqID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gSW5maW5pdHkgLyBvYmogPiAwID8gJzAnIDogJy0wJztcbiAgICAgICAgfVxuICAgICAgICB2YXIgc3RyID0gU3RyaW5nKG9iaik7XG4gICAgICAgIHJldHVybiBudW1lcmljU2VwYXJhdG9yID8gYWRkTnVtZXJpY1NlcGFyYXRvcihvYmosIHN0cikgOiBzdHI7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygb2JqID09PSAnYmlnaW50Jykge1xuICAgICAgICB2YXIgYmlnSW50U3RyID0gU3RyaW5nKG9iaikgKyAnbic7XG4gICAgICAgIHJldHVybiBudW1lcmljU2VwYXJhdG9yID8gYWRkTnVtZXJpY1NlcGFyYXRvcihvYmosIGJpZ0ludFN0cikgOiBiaWdJbnRTdHI7XG4gICAgfVxuXG4gICAgdmFyIG1heERlcHRoID0gdHlwZW9mIG9wdHMuZGVwdGggPT09ICd1bmRlZmluZWQnID8gNSA6IG9wdHMuZGVwdGg7XG4gICAgaWYgKHR5cGVvZiBkZXB0aCA9PT0gJ3VuZGVmaW5lZCcpIHsgZGVwdGggPSAwOyB9XG4gICAgaWYgKGRlcHRoID49IG1heERlcHRoICYmIG1heERlcHRoID4gMCAmJiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gaXNBcnJheShvYmopID8gJ1tBcnJheV0nIDogJ1tPYmplY3RdJztcbiAgICB9XG5cbiAgICB2YXIgaW5kZW50ID0gZ2V0SW5kZW50KG9wdHMsIGRlcHRoKTtcblxuICAgIGlmICh0eXBlb2Ygc2VlbiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgc2VlbiA9IFtdO1xuICAgIH0gZWxzZSBpZiAoaW5kZXhPZihzZWVuLCBvYmopID49IDApIHtcbiAgICAgICAgcmV0dXJuICdbQ2lyY3VsYXJdJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnNwZWN0KHZhbHVlLCBmcm9tLCBub0luZGVudCkge1xuICAgICAgICBpZiAoZnJvbSkge1xuICAgICAgICAgICAgc2VlbiA9ICRhcnJTbGljZS5jYWxsKHNlZW4pO1xuICAgICAgICAgICAgc2Vlbi5wdXNoKGZyb20pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChub0luZGVudCkge1xuICAgICAgICAgICAgdmFyIG5ld09wdHMgPSB7XG4gICAgICAgICAgICAgICAgZGVwdGg6IG9wdHMuZGVwdGhcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAoaGFzKG9wdHMsICdxdW90ZVN0eWxlJykpIHtcbiAgICAgICAgICAgICAgICBuZXdPcHRzLnF1b3RlU3R5bGUgPSBvcHRzLnF1b3RlU3R5bGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaW5zcGVjdF8odmFsdWUsIG5ld09wdHMsIGRlcHRoICsgMSwgc2Vlbik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGluc3BlY3RfKHZhbHVlLCBvcHRzLCBkZXB0aCArIDEsIHNlZW4pO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygb2JqID09PSAnZnVuY3Rpb24nICYmICFpc1JlZ0V4cChvYmopKSB7IC8vIGluIG9sZGVyIGVuZ2luZXMsIHJlZ2V4ZXMgYXJlIGNhbGxhYmxlXG4gICAgICAgIHZhciBuYW1lID0gbmFtZU9mKG9iaik7XG4gICAgICAgIHZhciBrZXlzID0gYXJyT2JqS2V5cyhvYmosIGluc3BlY3QpO1xuICAgICAgICByZXR1cm4gJ1tGdW5jdGlvbicgKyAobmFtZSA/ICc6ICcgKyBuYW1lIDogJyAoYW5vbnltb3VzKScpICsgJ10nICsgKGtleXMubGVuZ3RoID4gMCA/ICcgeyAnICsgJGpvaW4uY2FsbChrZXlzLCAnLCAnKSArICcgfScgOiAnJyk7XG4gICAgfVxuICAgIGlmIChpc1N5bWJvbChvYmopKSB7XG4gICAgICAgIHZhciBzeW1TdHJpbmcgPSBoYXNTaGFtbWVkU3ltYm9scyA/ICRyZXBsYWNlLmNhbGwoU3RyaW5nKG9iaiksIC9eKFN5bWJvbFxcKC4qXFwpKV9bXildKiQvLCAnJDEnKSA6IHN5bVRvU3RyaW5nLmNhbGwob2JqKTtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmICFoYXNTaGFtbWVkU3ltYm9scyA/IG1hcmtCb3hlZChzeW1TdHJpbmcpIDogc3ltU3RyaW5nO1xuICAgIH1cbiAgICBpZiAoaXNFbGVtZW50KG9iaikpIHtcbiAgICAgICAgdmFyIHMgPSAnPCcgKyAkdG9Mb3dlckNhc2UuY2FsbChTdHJpbmcob2JqLm5vZGVOYW1lKSk7XG4gICAgICAgIHZhciBhdHRycyA9IG9iai5hdHRyaWJ1dGVzIHx8IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGF0dHJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBzICs9ICcgJyArIGF0dHJzW2ldLm5hbWUgKyAnPScgKyB3cmFwUXVvdGVzKHF1b3RlKGF0dHJzW2ldLnZhbHVlKSwgJ2RvdWJsZScsIG9wdHMpO1xuICAgICAgICB9XG4gICAgICAgIHMgKz0gJz4nO1xuICAgICAgICBpZiAob2JqLmNoaWxkTm9kZXMgJiYgb2JqLmNoaWxkTm9kZXMubGVuZ3RoKSB7IHMgKz0gJy4uLic7IH1cbiAgICAgICAgcyArPSAnPC8nICsgJHRvTG93ZXJDYXNlLmNhbGwoU3RyaW5nKG9iai5ub2RlTmFtZSkpICsgJz4nO1xuICAgICAgICByZXR1cm4gcztcbiAgICB9XG4gICAgaWYgKGlzQXJyYXkob2JqKSkge1xuICAgICAgICBpZiAob2JqLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gJ1tdJzsgfVxuICAgICAgICB2YXIgeHMgPSBhcnJPYmpLZXlzKG9iaiwgaW5zcGVjdCk7XG4gICAgICAgIGlmIChpbmRlbnQgJiYgIXNpbmdsZUxpbmVWYWx1ZXMoeHMpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ1snICsgaW5kZW50ZWRKb2luKHhzLCBpbmRlbnQpICsgJ10nO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAnWyAnICsgJGpvaW4uY2FsbCh4cywgJywgJykgKyAnIF0nO1xuICAgIH1cbiAgICBpZiAoaXNFcnJvcihvYmopKSB7XG4gICAgICAgIHZhciBwYXJ0cyA9IGFyck9iaktleXMob2JqLCBpbnNwZWN0KTtcbiAgICAgICAgaWYgKCEoJ2NhdXNlJyBpbiBFcnJvci5wcm90b3R5cGUpICYmICdjYXVzZScgaW4gb2JqICYmICFpc0VudW1lcmFibGUuY2FsbChvYmosICdjYXVzZScpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3sgWycgKyBTdHJpbmcob2JqKSArICddICcgKyAkam9pbi5jYWxsKCRjb25jYXQuY2FsbCgnW2NhdXNlXTogJyArIGluc3BlY3Qob2JqLmNhdXNlKSwgcGFydHMpLCAnLCAnKSArICcgfSc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcnRzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gJ1snICsgU3RyaW5nKG9iaikgKyAnXSc7IH1cbiAgICAgICAgcmV0dXJuICd7IFsnICsgU3RyaW5nKG9iaikgKyAnXSAnICsgJGpvaW4uY2FsbChwYXJ0cywgJywgJykgKyAnIH0nO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiYgY3VzdG9tSW5zcGVjdCkge1xuICAgICAgICBpZiAoaW5zcGVjdFN5bWJvbCAmJiB0eXBlb2Ygb2JqW2luc3BlY3RTeW1ib2xdID09PSAnZnVuY3Rpb24nICYmIHV0aWxJbnNwZWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gdXRpbEluc3BlY3Qob2JqLCB7IGRlcHRoOiBtYXhEZXB0aCAtIGRlcHRoIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKGN1c3RvbUluc3BlY3QgIT09ICdzeW1ib2wnICYmIHR5cGVvZiBvYmouaW5zcGVjdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuIG9iai5pbnNwZWN0KCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGlzTWFwKG9iaikpIHtcbiAgICAgICAgdmFyIG1hcFBhcnRzID0gW107XG4gICAgICAgIGlmIChtYXBGb3JFYWNoKSB7XG4gICAgICAgICAgICBtYXBGb3JFYWNoLmNhbGwob2JqLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICAgICAgICAgIG1hcFBhcnRzLnB1c2goaW5zcGVjdChrZXksIG9iaiwgdHJ1ZSkgKyAnID0+ICcgKyBpbnNwZWN0KHZhbHVlLCBvYmopKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb2xsZWN0aW9uT2YoJ01hcCcsIG1hcFNpemUuY2FsbChvYmopLCBtYXBQYXJ0cywgaW5kZW50KTtcbiAgICB9XG4gICAgaWYgKGlzU2V0KG9iaikpIHtcbiAgICAgICAgdmFyIHNldFBhcnRzID0gW107XG4gICAgICAgIGlmIChzZXRGb3JFYWNoKSB7XG4gICAgICAgICAgICBzZXRGb3JFYWNoLmNhbGwob2JqLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBzZXRQYXJ0cy5wdXNoKGluc3BlY3QodmFsdWUsIG9iaikpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb25PZignU2V0Jywgc2V0U2l6ZS5jYWxsKG9iaiksIHNldFBhcnRzLCBpbmRlbnQpO1xuICAgIH1cbiAgICBpZiAoaXNXZWFrTWFwKG9iaikpIHtcbiAgICAgICAgcmV0dXJuIHdlYWtDb2xsZWN0aW9uT2YoJ1dlYWtNYXAnKTtcbiAgICB9XG4gICAgaWYgKGlzV2Vha1NldChvYmopKSB7XG4gICAgICAgIHJldHVybiB3ZWFrQ29sbGVjdGlvbk9mKCdXZWFrU2V0Jyk7XG4gICAgfVxuICAgIGlmIChpc1dlYWtSZWYob2JqKSkge1xuICAgICAgICByZXR1cm4gd2Vha0NvbGxlY3Rpb25PZignV2Vha1JlZicpO1xuICAgIH1cbiAgICBpZiAoaXNOdW1iZXIob2JqKSkge1xuICAgICAgICByZXR1cm4gbWFya0JveGVkKGluc3BlY3QoTnVtYmVyKG9iaikpKTtcbiAgICB9XG4gICAgaWYgKGlzQmlnSW50KG9iaikpIHtcbiAgICAgICAgcmV0dXJuIG1hcmtCb3hlZChpbnNwZWN0KGJpZ0ludFZhbHVlT2YuY2FsbChvYmopKSk7XG4gICAgfVxuICAgIGlmIChpc0Jvb2xlYW4ob2JqKSkge1xuICAgICAgICByZXR1cm4gbWFya0JveGVkKGJvb2xlYW5WYWx1ZU9mLmNhbGwob2JqKSk7XG4gICAgfVxuICAgIGlmIChpc1N0cmluZyhvYmopKSB7XG4gICAgICAgIHJldHVybiBtYXJrQm94ZWQoaW5zcGVjdChTdHJpbmcob2JqKSkpO1xuICAgIH1cbiAgICAvLyBub3RlOiBpbiBJRSA4LCBzb21ldGltZXMgYGdsb2JhbCAhPT0gd2luZG93YCBidXQgYm90aCBhcmUgdGhlIHByb3RvdHlwZXMgb2YgZWFjaCBvdGhlclxuICAgIC8qIGVzbGludC1lbnYgYnJvd3NlciAqL1xuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiBvYmogPT09IHdpbmRvdykge1xuICAgICAgICByZXR1cm4gJ3sgW29iamVjdCBXaW5kb3ddIH0nO1xuICAgIH1cbiAgICBpZiAoXG4gICAgICAgICh0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gJ3VuZGVmaW5lZCcgJiYgb2JqID09PSBnbG9iYWxUaGlzKVxuICAgICAgICB8fCAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgJiYgb2JqID09PSBnbG9iYWwpXG4gICAgKSB7XG4gICAgICAgIHJldHVybiAneyBbb2JqZWN0IGdsb2JhbFRoaXNdIH0nO1xuICAgIH1cbiAgICBpZiAoIWlzRGF0ZShvYmopICYmICFpc1JlZ0V4cChvYmopKSB7XG4gICAgICAgIHZhciB5cyA9IGFyck9iaktleXMob2JqLCBpbnNwZWN0KTtcbiAgICAgICAgdmFyIGlzUGxhaW5PYmplY3QgPSBnUE8gPyBnUE8ob2JqKSA9PT0gT2JqZWN0LnByb3RvdHlwZSA6IG9iaiBpbnN0YW5jZW9mIE9iamVjdCB8fCBvYmouY29uc3RydWN0b3IgPT09IE9iamVjdDtcbiAgICAgICAgdmFyIHByb3RvVGFnID0gb2JqIGluc3RhbmNlb2YgT2JqZWN0ID8gJycgOiAnbnVsbCBwcm90b3R5cGUnO1xuICAgICAgICB2YXIgc3RyaW5nVGFnID0gIWlzUGxhaW5PYmplY3QgJiYgdG9TdHJpbmdUYWcgJiYgT2JqZWN0KG9iaikgPT09IG9iaiAmJiB0b1N0cmluZ1RhZyBpbiBvYmogPyAkc2xpY2UuY2FsbCh0b1N0cihvYmopLCA4LCAtMSkgOiBwcm90b1RhZyA/ICdPYmplY3QnIDogJyc7XG4gICAgICAgIHZhciBjb25zdHJ1Y3RvclRhZyA9IGlzUGxhaW5PYmplY3QgfHwgdHlwZW9mIG9iai5jb25zdHJ1Y3RvciAhPT0gJ2Z1bmN0aW9uJyA/ICcnIDogb2JqLmNvbnN0cnVjdG9yLm5hbWUgPyBvYmouY29uc3RydWN0b3IubmFtZSArICcgJyA6ICcnO1xuICAgICAgICB2YXIgdGFnID0gY29uc3RydWN0b3JUYWcgKyAoc3RyaW5nVGFnIHx8IHByb3RvVGFnID8gJ1snICsgJGpvaW4uY2FsbCgkY29uY2F0LmNhbGwoW10sIHN0cmluZ1RhZyB8fCBbXSwgcHJvdG9UYWcgfHwgW10pLCAnOiAnKSArICddICcgOiAnJyk7XG4gICAgICAgIGlmICh5cy5sZW5ndGggPT09IDApIHsgcmV0dXJuIHRhZyArICd7fSc7IH1cbiAgICAgICAgaWYgKGluZGVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHRhZyArICd7JyArIGluZGVudGVkSm9pbih5cywgaW5kZW50KSArICd9JztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGFnICsgJ3sgJyArICRqb2luLmNhbGwoeXMsICcsICcpICsgJyB9JztcbiAgICB9XG4gICAgcmV0dXJuIFN0cmluZyhvYmopO1xufTtcblxuZnVuY3Rpb24gd3JhcFF1b3RlcyhzLCBkZWZhdWx0U3R5bGUsIG9wdHMpIHtcbiAgICB2YXIgc3R5bGUgPSBvcHRzLnF1b3RlU3R5bGUgfHwgZGVmYXVsdFN0eWxlO1xuICAgIHZhciBxdW90ZUNoYXIgPSBxdW90ZXNbc3R5bGVdO1xuICAgIHJldHVybiBxdW90ZUNoYXIgKyBzICsgcXVvdGVDaGFyO1xufVxuXG5mdW5jdGlvbiBxdW90ZShzKSB7XG4gICAgcmV0dXJuICRyZXBsYWNlLmNhbGwoU3RyaW5nKHMpLCAvXCIvZywgJyZxdW90OycpO1xufVxuXG5mdW5jdGlvbiBjYW5UcnVzdFRvU3RyaW5nKG9iaikge1xuICAgIHJldHVybiAhdG9TdHJpbmdUYWcgfHwgISh0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyAmJiAodG9TdHJpbmdUYWcgaW4gb2JqIHx8IHR5cGVvZiBvYmpbdG9TdHJpbmdUYWddICE9PSAndW5kZWZpbmVkJykpO1xufVxuZnVuY3Rpb24gaXNBcnJheShvYmopIHsgcmV0dXJuIHRvU3RyKG9iaikgPT09ICdbb2JqZWN0IEFycmF5XScgJiYgY2FuVHJ1c3RUb1N0cmluZyhvYmopOyB9XG5mdW5jdGlvbiBpc0RhdGUob2JqKSB7IHJldHVybiB0b1N0cihvYmopID09PSAnW29iamVjdCBEYXRlXScgJiYgY2FuVHJ1c3RUb1N0cmluZyhvYmopOyB9XG5mdW5jdGlvbiBpc1JlZ0V4cChvYmopIHsgcmV0dXJuIHRvU3RyKG9iaikgPT09ICdbb2JqZWN0IFJlZ0V4cF0nICYmIGNhblRydXN0VG9TdHJpbmcob2JqKTsgfVxuZnVuY3Rpb24gaXNFcnJvcihvYmopIHsgcmV0dXJuIHRvU3RyKG9iaikgPT09ICdbb2JqZWN0IEVycm9yXScgJiYgY2FuVHJ1c3RUb1N0cmluZyhvYmopOyB9XG5mdW5jdGlvbiBpc1N0cmluZyhvYmopIHsgcmV0dXJuIHRvU3RyKG9iaikgPT09ICdbb2JqZWN0IFN0cmluZ10nICYmIGNhblRydXN0VG9TdHJpbmcob2JqKTsgfVxuZnVuY3Rpb24gaXNOdW1iZXIob2JqKSB7IHJldHVybiB0b1N0cihvYmopID09PSAnW29iamVjdCBOdW1iZXJdJyAmJiBjYW5UcnVzdFRvU3RyaW5nKG9iaik7IH1cbmZ1bmN0aW9uIGlzQm9vbGVhbihvYmopIHsgcmV0dXJuIHRvU3RyKG9iaikgPT09ICdbb2JqZWN0IEJvb2xlYW5dJyAmJiBjYW5UcnVzdFRvU3RyaW5nKG9iaik7IH1cblxuLy8gU3ltYm9sIGFuZCBCaWdJbnQgZG8gaGF2ZSBTeW1ib2wudG9TdHJpbmdUYWcgYnkgc3BlYywgc28gdGhhdCBjYW4ndCBiZSB1c2VkIHRvIGVsaW1pbmF0ZSBmYWxzZSBwb3NpdGl2ZXNcbmZ1bmN0aW9uIGlzU3ltYm9sKG9iaikge1xuICAgIGlmIChoYXNTaGFtbWVkU3ltYm9scykge1xuICAgICAgICByZXR1cm4gb2JqICYmIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIG9iaiBpbnN0YW5jZW9mIFN5bWJvbDtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBvYmogPT09ICdzeW1ib2wnKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAoIW9iaiB8fCB0eXBlb2Ygb2JqICE9PSAnb2JqZWN0JyB8fCAhc3ltVG9TdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBzeW1Ub1N0cmluZy5jYWxsKG9iaik7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBpc0JpZ0ludChvYmopIHtcbiAgICBpZiAoIW9iaiB8fCB0eXBlb2Ygb2JqICE9PSAnb2JqZWN0JyB8fCAhYmlnSW50VmFsdWVPZikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGJpZ0ludFZhbHVlT2YuY2FsbChvYmopO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxudmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkgfHwgZnVuY3Rpb24gKGtleSkgeyByZXR1cm4ga2V5IGluIHRoaXM7IH07XG5mdW5jdGlvbiBoYXMob2JqLCBrZXkpIHtcbiAgICByZXR1cm4gaGFzT3duLmNhbGwob2JqLCBrZXkpO1xufVxuXG5mdW5jdGlvbiB0b1N0cihvYmopIHtcbiAgICByZXR1cm4gb2JqZWN0VG9TdHJpbmcuY2FsbChvYmopO1xufVxuXG5mdW5jdGlvbiBuYW1lT2YoZikge1xuICAgIGlmIChmLm5hbWUpIHsgcmV0dXJuIGYubmFtZTsgfVxuICAgIHZhciBtID0gJG1hdGNoLmNhbGwoZnVuY3Rpb25Ub1N0cmluZy5jYWxsKGYpLCAvXmZ1bmN0aW9uXFxzKihbXFx3JF0rKS8pO1xuICAgIGlmIChtKSB7IHJldHVybiBtWzFdOyB9XG4gICAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIGluZGV4T2YoeHMsIHgpIHtcbiAgICBpZiAoeHMuaW5kZXhPZikgeyByZXR1cm4geHMuaW5kZXhPZih4KTsgfVxuICAgIGZvciAodmFyIGkgPSAwLCBsID0geHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGlmICh4c1tpXSA9PT0geCkgeyByZXR1cm4gaTsgfVxuICAgIH1cbiAgICByZXR1cm4gLTE7XG59XG5cbmZ1bmN0aW9uIGlzTWFwKHgpIHtcbiAgICBpZiAoIW1hcFNpemUgfHwgIXggfHwgdHlwZW9mIHggIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgbWFwU2l6ZS5jYWxsKHgpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgc2V0U2l6ZS5jYWxsKHgpO1xuICAgICAgICB9IGNhdGNoIChzKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geCBpbnN0YW5jZW9mIE1hcDsgLy8gY29yZS1qcyB3b3JrYXJvdW5kLCBwcmUtdjIuNS4wXG4gICAgfSBjYXRjaCAoZSkge31cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGlzV2Vha01hcCh4KSB7XG4gICAgaWYgKCF3ZWFrTWFwSGFzIHx8ICF4IHx8IHR5cGVvZiB4ICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIHdlYWtNYXBIYXMuY2FsbCh4LCB3ZWFrTWFwSGFzKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHdlYWtTZXRIYXMuY2FsbCh4LCB3ZWFrU2V0SGFzKTtcbiAgICAgICAgfSBjYXRjaCAocykge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHggaW5zdGFuY2VvZiBXZWFrTWFwOyAvLyBjb3JlLWpzIHdvcmthcm91bmQsIHByZS12Mi41LjBcbiAgICB9IGNhdGNoIChlKSB7fVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gaXNXZWFrUmVmKHgpIHtcbiAgICBpZiAoIXdlYWtSZWZEZXJlZiB8fCAheCB8fCB0eXBlb2YgeCAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICB3ZWFrUmVmRGVyZWYuY2FsbCh4KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGlzU2V0KHgpIHtcbiAgICBpZiAoIXNldFNpemUgfHwgIXggfHwgdHlwZW9mIHggIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgc2V0U2l6ZS5jYWxsKHgpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbWFwU2l6ZS5jYWxsKHgpO1xuICAgICAgICB9IGNhdGNoIChtKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geCBpbnN0YW5jZW9mIFNldDsgLy8gY29yZS1qcyB3b3JrYXJvdW5kLCBwcmUtdjIuNS4wXG4gICAgfSBjYXRjaCAoZSkge31cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGlzV2Vha1NldCh4KSB7XG4gICAgaWYgKCF3ZWFrU2V0SGFzIHx8ICF4IHx8IHR5cGVvZiB4ICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIHdlYWtTZXRIYXMuY2FsbCh4LCB3ZWFrU2V0SGFzKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHdlYWtNYXBIYXMuY2FsbCh4LCB3ZWFrTWFwSGFzKTtcbiAgICAgICAgfSBjYXRjaCAocykge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHggaW5zdGFuY2VvZiBXZWFrU2V0OyAvLyBjb3JlLWpzIHdvcmthcm91bmQsIHByZS12Mi41LjBcbiAgICB9IGNhdGNoIChlKSB7fVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gaXNFbGVtZW50KHgpIHtcbiAgICBpZiAoIXggfHwgdHlwZW9mIHggIT09ICdvYmplY3QnKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIGlmICh0eXBlb2YgSFRNTEVsZW1lbnQgIT09ICd1bmRlZmluZWQnICYmIHggaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHR5cGVvZiB4Lm5vZGVOYW1lID09PSAnc3RyaW5nJyAmJiB0eXBlb2YgeC5nZXRBdHRyaWJ1dGUgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGluc3BlY3RTdHJpbmcoc3RyLCBvcHRzKSB7XG4gICAgaWYgKHN0ci5sZW5ndGggPiBvcHRzLm1heFN0cmluZ0xlbmd0aCkge1xuICAgICAgICB2YXIgcmVtYWluaW5nID0gc3RyLmxlbmd0aCAtIG9wdHMubWF4U3RyaW5nTGVuZ3RoO1xuICAgICAgICB2YXIgdHJhaWxlciA9ICcuLi4gJyArIHJlbWFpbmluZyArICcgbW9yZSBjaGFyYWN0ZXInICsgKHJlbWFpbmluZyA+IDEgPyAncycgOiAnJyk7XG4gICAgICAgIHJldHVybiBpbnNwZWN0U3RyaW5nKCRzbGljZS5jYWxsKHN0ciwgMCwgb3B0cy5tYXhTdHJpbmdMZW5ndGgpLCBvcHRzKSArIHRyYWlsZXI7XG4gICAgfVxuICAgIHZhciBxdW90ZVJFID0gcXVvdGVSRXNbb3B0cy5xdW90ZVN0eWxlIHx8ICdzaW5nbGUnXTtcbiAgICBxdW90ZVJFLmxhc3RJbmRleCA9IDA7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnRyb2wtcmVnZXhcbiAgICB2YXIgcyA9ICRyZXBsYWNlLmNhbGwoJHJlcGxhY2UuY2FsbChzdHIsIHF1b3RlUkUsICdcXFxcJDEnKSwgL1tcXHgwMC1cXHgxZl0vZywgbG93Ynl0ZSk7XG4gICAgcmV0dXJuIHdyYXBRdW90ZXMocywgJ3NpbmdsZScsIG9wdHMpO1xufVxuXG5mdW5jdGlvbiBsb3dieXRlKGMpIHtcbiAgICB2YXIgbiA9IGMuY2hhckNvZGVBdCgwKTtcbiAgICB2YXIgeCA9IHtcbiAgICAgICAgODogJ2InLFxuICAgICAgICA5OiAndCcsXG4gICAgICAgIDEwOiAnbicsXG4gICAgICAgIDEyOiAnZicsXG4gICAgICAgIDEzOiAncidcbiAgICB9W25dO1xuICAgIGlmICh4KSB7IHJldHVybiAnXFxcXCcgKyB4OyB9XG4gICAgcmV0dXJuICdcXFxceCcgKyAobiA8IDB4MTAgPyAnMCcgOiAnJykgKyAkdG9VcHBlckNhc2UuY2FsbChuLnRvU3RyaW5nKDE2KSk7XG59XG5cbmZ1bmN0aW9uIG1hcmtCb3hlZChzdHIpIHtcbiAgICByZXR1cm4gJ09iamVjdCgnICsgc3RyICsgJyknO1xufVxuXG5mdW5jdGlvbiB3ZWFrQ29sbGVjdGlvbk9mKHR5cGUpIHtcbiAgICByZXR1cm4gdHlwZSArICcgeyA/IH0nO1xufVxuXG5mdW5jdGlvbiBjb2xsZWN0aW9uT2YodHlwZSwgc2l6ZSwgZW50cmllcywgaW5kZW50KSB7XG4gICAgdmFyIGpvaW5lZEVudHJpZXMgPSBpbmRlbnQgPyBpbmRlbnRlZEpvaW4oZW50cmllcywgaW5kZW50KSA6ICRqb2luLmNhbGwoZW50cmllcywgJywgJyk7XG4gICAgcmV0dXJuIHR5cGUgKyAnICgnICsgc2l6ZSArICcpIHsnICsgam9pbmVkRW50cmllcyArICd9Jztcbn1cblxuZnVuY3Rpb24gc2luZ2xlTGluZVZhbHVlcyh4cykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGluZGV4T2YoeHNbaV0sICdcXG4nKSA+PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGdldEluZGVudChvcHRzLCBkZXB0aCkge1xuICAgIHZhciBiYXNlSW5kZW50O1xuICAgIGlmIChvcHRzLmluZGVudCA9PT0gJ1xcdCcpIHtcbiAgICAgICAgYmFzZUluZGVudCA9ICdcXHQnO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG9wdHMuaW5kZW50ID09PSAnbnVtYmVyJyAmJiBvcHRzLmluZGVudCA+IDApIHtcbiAgICAgICAgYmFzZUluZGVudCA9ICRqb2luLmNhbGwoQXJyYXkob3B0cy5pbmRlbnQgKyAxKSwgJyAnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgYmFzZTogYmFzZUluZGVudCxcbiAgICAgICAgcHJldjogJGpvaW4uY2FsbChBcnJheShkZXB0aCArIDEpLCBiYXNlSW5kZW50KVxuICAgIH07XG59XG5cbmZ1bmN0aW9uIGluZGVudGVkSm9pbih4cywgaW5kZW50KSB7XG4gICAgaWYgKHhzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gJyc7IH1cbiAgICB2YXIgbGluZUpvaW5lciA9ICdcXG4nICsgaW5kZW50LnByZXYgKyBpbmRlbnQuYmFzZTtcbiAgICByZXR1cm4gbGluZUpvaW5lciArICRqb2luLmNhbGwoeHMsICcsJyArIGxpbmVKb2luZXIpICsgJ1xcbicgKyBpbmRlbnQucHJldjtcbn1cblxuZnVuY3Rpb24gYXJyT2JqS2V5cyhvYmosIGluc3BlY3QpIHtcbiAgICB2YXIgaXNBcnIgPSBpc0FycmF5KG9iaik7XG4gICAgdmFyIHhzID0gW107XG4gICAgaWYgKGlzQXJyKSB7XG4gICAgICAgIHhzLmxlbmd0aCA9IG9iai5sZW5ndGg7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2JqLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB4c1tpXSA9IGhhcyhvYmosIGkpID8gaW5zcGVjdChvYmpbaV0sIG9iaikgOiAnJztcbiAgICAgICAgfVxuICAgIH1cbiAgICB2YXIgc3ltcyA9IHR5cGVvZiBnT1BTID09PSAnZnVuY3Rpb24nID8gZ09QUyhvYmopIDogW107XG4gICAgdmFyIHN5bU1hcDtcbiAgICBpZiAoaGFzU2hhbW1lZFN5bWJvbHMpIHtcbiAgICAgICAgc3ltTWFwID0ge307XG4gICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgc3ltcy5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgc3ltTWFwWyckJyArIHN5bXNba11dID0gc3ltc1trXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1yZXN0cmljdGVkLXN5bnRheFxuICAgICAgICBpZiAoIWhhcyhvYmosIGtleSkpIHsgY29udGludWU7IH0gLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1yZXN0cmljdGVkLXN5bnRheCwgbm8tY29udGludWVcbiAgICAgICAgaWYgKGlzQXJyICYmIFN0cmluZyhOdW1iZXIoa2V5KSkgPT09IGtleSAmJiBrZXkgPCBvYmoubGVuZ3RoKSB7IGNvbnRpbnVlOyB9IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tcmVzdHJpY3RlZC1zeW50YXgsIG5vLWNvbnRpbnVlXG4gICAgICAgIGlmIChoYXNTaGFtbWVkU3ltYm9scyAmJiBzeW1NYXBbJyQnICsga2V5XSBpbnN0YW5jZW9mIFN5bWJvbCkge1xuICAgICAgICAgICAgLy8gdGhpcyBpcyB0byBwcmV2ZW50IHNoYW1tZWQgU3ltYm9scywgd2hpY2ggYXJlIHN0b3JlZCBhcyBzdHJpbmdzLCBmcm9tIGJlaW5nIGluY2x1ZGVkIGluIHRoZSBzdHJpbmcga2V5IHNlY3Rpb25cbiAgICAgICAgICAgIGNvbnRpbnVlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXJlc3RyaWN0ZWQtc3ludGF4LCBuby1jb250aW51ZVxuICAgICAgICB9IGVsc2UgaWYgKCR0ZXN0LmNhbGwoL1teXFx3JF0vLCBrZXkpKSB7XG4gICAgICAgICAgICB4cy5wdXNoKGluc3BlY3Qoa2V5LCBvYmopICsgJzogJyArIGluc3BlY3Qob2JqW2tleV0sIG9iaikpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgeHMucHVzaChrZXkgKyAnOiAnICsgaW5zcGVjdChvYmpba2V5XSwgb2JqKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHR5cGVvZiBnT1BTID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgc3ltcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgaWYgKGlzRW51bWVyYWJsZS5jYWxsKG9iaiwgc3ltc1tqXSkpIHtcbiAgICAgICAgICAgICAgICB4cy5wdXNoKCdbJyArIGluc3BlY3Qoc3ltc1tqXSkgKyAnXTogJyArIGluc3BlY3Qob2JqW3N5bXNbal1dLCBvYmopKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4geHM7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpbnNwZWN0ID0gcmVxdWlyZSgnb2JqZWN0LWluc3BlY3QnKTtcblxudmFyICRUeXBlRXJyb3IgPSByZXF1aXJlKCdlcy1lcnJvcnMvdHlwZScpO1xuXG4vKlxuKiBUaGlzIGZ1bmN0aW9uIHRyYXZlcnNlcyB0aGUgbGlzdCByZXR1cm5pbmcgdGhlIG5vZGUgY29ycmVzcG9uZGluZyB0byB0aGUgZ2l2ZW4ga2V5LlxuKlxuKiBUaGF0IG5vZGUgaXMgYWxzbyBtb3ZlZCB0byB0aGUgaGVhZCBvZiB0aGUgbGlzdCwgc28gdGhhdCBpZiBpdCdzIGFjY2Vzc2VkIGFnYWluIHdlIGRvbid0IG5lZWQgdG8gdHJhdmVyc2UgdGhlIHdob2xlIGxpc3QuXG4qIEJ5IGRvaW5nIHNvLCBhbGwgdGhlIHJlY2VudGx5IHVzZWQgbm9kZXMgY2FuIGJlIGFjY2Vzc2VkIHJlbGF0aXZlbHkgcXVpY2tseS5cbiovXG4vKiogQHR5cGUge2ltcG9ydCgnLi9saXN0LmQudHMnKS5saXN0R2V0Tm9kZX0gKi9cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjb25zaXN0ZW50LXJldHVyblxudmFyIGxpc3RHZXROb2RlID0gZnVuY3Rpb24gKGxpc3QsIGtleSwgaXNEZWxldGUpIHtcblx0LyoqIEB0eXBlIHt0eXBlb2YgbGlzdCB8IE5vbk51bGxhYmxlPCh0eXBlb2YgbGlzdClbJ25leHQnXT59ICovXG5cdHZhciBwcmV2ID0gbGlzdDtcblx0LyoqIEB0eXBlIHsodHlwZW9mIGxpc3QpWyduZXh0J119ICovXG5cdHZhciBjdXJyO1xuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXFlcWVxXG5cdGZvciAoOyAoY3VyciA9IHByZXYubmV4dCkgIT0gbnVsbDsgcHJldiA9IGN1cnIpIHtcblx0XHRpZiAoY3Vyci5rZXkgPT09IGtleSkge1xuXHRcdFx0cHJldi5uZXh0ID0gY3Vyci5uZXh0O1xuXHRcdFx0aWYgKCFpc0RlbGV0ZSkge1xuXHRcdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZXh0cmEtcGFyZW5zXG5cdFx0XHRcdGN1cnIubmV4dCA9IC8qKiBAdHlwZSB7Tm9uTnVsbGFibGU8dHlwZW9mIGxpc3QubmV4dD59ICovIChsaXN0Lm5leHQpO1xuXHRcdFx0XHRsaXN0Lm5leHQgPSBjdXJyOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gY3Vycjtcblx0XHR9XG5cdH1cbn07XG5cbi8qKiBAdHlwZSB7aW1wb3J0KCcuL2xpc3QuZC50cycpLmxpc3RHZXR9ICovXG52YXIgbGlzdEdldCA9IGZ1bmN0aW9uIChvYmplY3RzLCBrZXkpIHtcblx0aWYgKCFvYmplY3RzKSB7XG5cdFx0cmV0dXJuIHZvaWQgdW5kZWZpbmVkO1xuXHR9XG5cdHZhciBub2RlID0gbGlzdEdldE5vZGUob2JqZWN0cywga2V5KTtcblx0cmV0dXJuIG5vZGUgJiYgbm9kZS52YWx1ZTtcbn07XG4vKiogQHR5cGUge2ltcG9ydCgnLi9saXN0LmQudHMnKS5saXN0U2V0fSAqL1xudmFyIGxpc3RTZXQgPSBmdW5jdGlvbiAob2JqZWN0cywga2V5LCB2YWx1ZSkge1xuXHR2YXIgbm9kZSA9IGxpc3RHZXROb2RlKG9iamVjdHMsIGtleSk7XG5cdGlmIChub2RlKSB7XG5cdFx0bm9kZS52YWx1ZSA9IHZhbHVlO1xuXHR9IGVsc2Uge1xuXHRcdC8vIFByZXBlbmQgdGhlIG5ldyBub2RlIHRvIHRoZSBiZWdpbm5pbmcgb2YgdGhlIGxpc3Rcblx0XHRvYmplY3RzLm5leHQgPSAvKiogQHR5cGUge2ltcG9ydCgnLi9saXN0LmQudHMnKS5MaXN0Tm9kZTx0eXBlb2YgdmFsdWUsIHR5cGVvZiBrZXk+fSAqLyAoeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXBhcmFtLXJlYXNzaWduLCBuby1leHRyYS1wYXJlbnNcblx0XHRcdGtleToga2V5LFxuXHRcdFx0bmV4dDogb2JqZWN0cy5uZXh0LFxuXHRcdFx0dmFsdWU6IHZhbHVlXG5cdFx0fSk7XG5cdH1cbn07XG4vKiogQHR5cGUge2ltcG9ydCgnLi9saXN0LmQudHMnKS5saXN0SGFzfSAqL1xudmFyIGxpc3RIYXMgPSBmdW5jdGlvbiAob2JqZWN0cywga2V5KSB7XG5cdGlmICghb2JqZWN0cykge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRyZXR1cm4gISFsaXN0R2V0Tm9kZShvYmplY3RzLCBrZXkpO1xufTtcbi8qKiBAdHlwZSB7aW1wb3J0KCcuL2xpc3QuZC50cycpLmxpc3REZWxldGV9ICovXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY29uc2lzdGVudC1yZXR1cm5cbnZhciBsaXN0RGVsZXRlID0gZnVuY3Rpb24gKG9iamVjdHMsIGtleSkge1xuXHRpZiAob2JqZWN0cykge1xuXHRcdHJldHVybiBsaXN0R2V0Tm9kZShvYmplY3RzLCBrZXksIHRydWUpO1xuXHR9XG59O1xuXG4vKiogQHR5cGUge2ltcG9ydCgnLicpfSAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRTaWRlQ2hhbm5lbExpc3QoKSB7XG5cdC8qKiBAdHlwZWRlZiB7UmV0dXJuVHlwZTx0eXBlb2YgZ2V0U2lkZUNoYW5uZWxMaXN0Pn0gQ2hhbm5lbCAqL1xuXHQvKiogQHR5cGVkZWYge1BhcmFtZXRlcnM8Q2hhbm5lbFsnZ2V0J10+WzBdfSBLICovXG5cdC8qKiBAdHlwZWRlZiB7UGFyYW1ldGVyczxDaGFubmVsWydzZXQnXT5bMV19IFYgKi9cblxuXHQvKiogQHR5cGUge2ltcG9ydCgnLi9saXN0LmQudHMnKS5Sb290Tm9kZTxWLCBLPiB8IHVuZGVmaW5lZH0gKi8gdmFyICRvO1xuXG5cdC8qKiBAdHlwZSB7Q2hhbm5lbH0gKi9cblx0dmFyIGNoYW5uZWwgPSB7XG5cdFx0YXNzZXJ0OiBmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHRpZiAoIWNoYW5uZWwuaGFzKGtleSkpIHtcblx0XHRcdFx0dGhyb3cgbmV3ICRUeXBlRXJyb3IoJ1NpZGUgY2hhbm5lbCBkb2VzIG5vdCBjb250YWluICcgKyBpbnNwZWN0KGtleSkpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0J2RlbGV0ZSc6IGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdHZhciByb290ID0gJG8gJiYgJG8ubmV4dDtcblx0XHRcdHZhciBkZWxldGVkTm9kZSA9IGxpc3REZWxldGUoJG8sIGtleSk7XG5cdFx0XHRpZiAoZGVsZXRlZE5vZGUgJiYgcm9vdCAmJiByb290ID09PSBkZWxldGVkTm9kZSkge1xuXHRcdFx0XHQkbyA9IHZvaWQgdW5kZWZpbmVkO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuICEhZGVsZXRlZE5vZGU7XG5cdFx0fSxcblx0XHRnZXQ6IGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdHJldHVybiBsaXN0R2V0KCRvLCBrZXkpO1xuXHRcdH0sXG5cdFx0aGFzOiBmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHRyZXR1cm4gbGlzdEhhcygkbywga2V5KTtcblx0XHR9LFxuXHRcdHNldDogZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcblx0XHRcdGlmICghJG8pIHtcblx0XHRcdFx0Ly8gSW5pdGlhbGl6ZSB0aGUgbGlua2VkIGxpc3QgYXMgYW4gZW1wdHkgbm9kZSwgc28gdGhhdCB3ZSBkb24ndCBoYXZlIHRvIHNwZWNpYWwtY2FzZSBoYW5kbGluZyBvZiB0aGUgZmlyc3Qgbm9kZTogd2UgY2FuIGFsd2F5cyByZWZlciB0byBpdCBhcyAocHJldmlvdXMgbm9kZSkubmV4dCwgaW5zdGVhZCBvZiBzb21ldGhpbmcgbGlrZSAobGlzdCkuaGVhZFxuXHRcdFx0XHQkbyA9IHtcblx0XHRcdFx0XHRuZXh0OiB2b2lkIHVuZGVmaW5lZFxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWV4dHJhLXBhcmVuc1xuXHRcdFx0bGlzdFNldCgvKiogQHR5cGUge05vbk51bGxhYmxlPHR5cGVvZiAkbz59ICovICgkbyksIGtleSwgdmFsdWUpO1xuXHRcdH1cblx0fTtcblx0Ly8gQHRzLWV4cGVjdC1lcnJvciBUT0RPOiBmaWd1cmUgb3V0IHdoeSB0aGlzIGlzIGVycm9yaW5nXG5cdHJldHVybiBjaGFubmVsO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqIEB0eXBlIHtpbXBvcnQoJy4nKX0gKi9cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKiogQHR5cGUge2ltcG9ydCgnLicpfSAqL1xubW9kdWxlLmV4cG9ydHMgPSBFcnJvcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqIEB0eXBlIHtpbXBvcnQoJy4vZXZhbCcpfSAqL1xubW9kdWxlLmV4cG9ydHMgPSBFdmFsRXJyb3I7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKiBAdHlwZSB7aW1wb3J0KCcuL3JhbmdlJyl9ICovXG5tb2R1bGUuZXhwb3J0cyA9IFJhbmdlRXJyb3I7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKiBAdHlwZSB7aW1wb3J0KCcuL3JlZicpfSAqL1xubW9kdWxlLmV4cG9ydHMgPSBSZWZlcmVuY2VFcnJvcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqIEB0eXBlIHtpbXBvcnQoJy4vc3ludGF4Jyl9ICovXG5tb2R1bGUuZXhwb3J0cyA9IFN5bnRheEVycm9yO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKiogQHR5cGUge2ltcG9ydCgnLi91cmknKX0gKi9cbm1vZHVsZS5leHBvcnRzID0gVVJJRXJyb3I7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKiBAdHlwZSB7aW1wb3J0KCcuL2FicycpfSAqL1xubW9kdWxlLmV4cG9ydHMgPSBNYXRoLmFicztcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqIEB0eXBlIHtpbXBvcnQoJy4vZmxvb3InKX0gKi9cbm1vZHVsZS5leHBvcnRzID0gTWF0aC5mbG9vcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqIEB0eXBlIHtpbXBvcnQoJy4vbWF4Jyl9ICovXG5tb2R1bGUuZXhwb3J0cyA9IE1hdGgubWF4O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKiogQHR5cGUge2ltcG9ydCgnLi9taW4nKX0gKi9cbm1vZHVsZS5leHBvcnRzID0gTWF0aC5taW47XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKiBAdHlwZSB7aW1wb3J0KCcuL3BvdycpfSAqL1xubW9kdWxlLmV4cG9ydHMgPSBNYXRoLnBvdztcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqIEB0eXBlIHtpbXBvcnQoJy4vcm91bmQnKX0gKi9cbm1vZHVsZS5leHBvcnRzID0gTWF0aC5yb3VuZDtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqIEB0eXBlIHtpbXBvcnQoJy4vaXNOYU4nKX0gKi9cbm1vZHVsZS5leHBvcnRzID0gTnVtYmVyLmlzTmFOIHx8IGZ1bmN0aW9uIGlzTmFOKGEpIHtcblx0cmV0dXJuIGEgIT09IGE7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgJGlzTmFOID0gcmVxdWlyZSgnLi9pc05hTicpO1xuXG4vKiogQHR5cGUge2ltcG9ydCgnLi9zaWduJyl9ICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNpZ24obnVtYmVyKSB7XG5cdGlmICgkaXNOYU4obnVtYmVyKSB8fCBudW1iZXIgPT09IDApIHtcblx0XHRyZXR1cm4gbnVtYmVyO1xuXHR9XG5cdHJldHVybiBudW1iZXIgPCAwID8gLTEgOiArMTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKiBAdHlwZSB7aW1wb3J0KCcuL2dPUEQnKX0gKi9cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqIEB0eXBlIHtpbXBvcnQoJy4nKX0gKi9cbnZhciAkZ09QRCA9IHJlcXVpcmUoJy4vZ09QRCcpO1xuXG5pZiAoJGdPUEQpIHtcblx0dHJ5IHtcblx0XHQkZ09QRChbXSwgJ2xlbmd0aCcpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0Ly8gSUUgOCBoYXMgYSBicm9rZW4gZ09QRFxuXHRcdCRnT1BEID0gbnVsbDtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9ICRnT1BEO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKiogQHR5cGUge2ltcG9ydCgnLicpfSAqL1xudmFyICRkZWZpbmVQcm9wZXJ0eSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSB8fCBmYWxzZTtcbmlmICgkZGVmaW5lUHJvcGVydHkpIHtcblx0dHJ5IHtcblx0XHQkZGVmaW5lUHJvcGVydHkoe30sICdhJywgeyB2YWx1ZTogMSB9KTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdC8vIElFIDggaGFzIGEgYnJva2VuIGRlZmluZVByb3BlcnR5XG5cdFx0JGRlZmluZVByb3BlcnR5ID0gZmFsc2U7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSAkZGVmaW5lUHJvcGVydHk7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKiBAdHlwZSB7aW1wb3J0KCcuL3NoYW1zJyl9ICovXG4vKiBlc2xpbnQgY29tcGxleGl0eTogWzIsIDE4XSwgbWF4LXN0YXRlbWVudHM6IFsyLCAzM10gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaGFzU3ltYm9scygpIHtcblx0aWYgKHR5cGVvZiBTeW1ib2wgIT09ICdmdW5jdGlvbicgfHwgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgIT09ICdmdW5jdGlvbicpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdGlmICh0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSAnc3ltYm9sJykgeyByZXR1cm4gdHJ1ZTsgfVxuXG5cdC8qKiBAdHlwZSB7eyBbayBpbiBzeW1ib2xdPzogdW5rbm93biB9fSAqL1xuXHR2YXIgb2JqID0ge307XG5cdHZhciBzeW0gPSBTeW1ib2woJ3Rlc3QnKTtcblx0dmFyIHN5bU9iaiA9IE9iamVjdChzeW0pO1xuXHRpZiAodHlwZW9mIHN5bSA9PT0gJ3N0cmluZycpIHsgcmV0dXJuIGZhbHNlOyB9XG5cblx0aWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChzeW0pICE9PSAnW29iamVjdCBTeW1ib2xdJykgeyByZXR1cm4gZmFsc2U7IH1cblx0aWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChzeW1PYmopICE9PSAnW29iamVjdCBTeW1ib2xdJykgeyByZXR1cm4gZmFsc2U7IH1cblxuXHQvLyB0ZW1wIGRpc2FibGVkIHBlciBodHRwczovL2dpdGh1Yi5jb20vbGpoYXJiL29iamVjdC5hc3NpZ24vaXNzdWVzLzE3XG5cdC8vIGlmIChzeW0gaW5zdGFuY2VvZiBTeW1ib2wpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdC8vIHRlbXAgZGlzYWJsZWQgcGVyIGh0dHBzOi8vZ2l0aHViLmNvbS9XZWJSZWZsZWN0aW9uL2dldC1vd24tcHJvcGVydHktc3ltYm9scy9pc3N1ZXMvNFxuXHQvLyBpZiAoIShzeW1PYmogaW5zdGFuY2VvZiBTeW1ib2wpKSB7IHJldHVybiBmYWxzZTsgfVxuXG5cdC8vIGlmICh0eXBlb2YgU3ltYm9sLnByb3RvdHlwZS50b1N0cmluZyAhPT0gJ2Z1bmN0aW9uJykgeyByZXR1cm4gZmFsc2U7IH1cblx0Ly8gaWYgKFN0cmluZyhzeW0pICE9PSBTeW1ib2wucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoc3ltKSkgeyByZXR1cm4gZmFsc2U7IH1cblxuXHR2YXIgc3ltVmFsID0gNDI7XG5cdG9ialtzeW1dID0gc3ltVmFsO1xuXHRmb3IgKHZhciBfIGluIG9iaikgeyByZXR1cm4gZmFsc2U7IH0gLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1yZXN0cmljdGVkLXN5bnRheCwgbm8tdW5yZWFjaGFibGUtbG9vcFxuXHRpZiAodHlwZW9mIE9iamVjdC5rZXlzID09PSAnZnVuY3Rpb24nICYmIE9iamVjdC5rZXlzKG9iaikubGVuZ3RoICE9PSAwKSB7IHJldHVybiBmYWxzZTsgfVxuXG5cdGlmICh0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMgPT09ICdmdW5jdGlvbicgJiYgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMob2JqKS5sZW5ndGggIT09IDApIHsgcmV0dXJuIGZhbHNlOyB9XG5cblx0dmFyIHN5bXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKG9iaik7XG5cdGlmIChzeW1zLmxlbmd0aCAhPT0gMSB8fCBzeW1zWzBdICE9PSBzeW0pIHsgcmV0dXJuIGZhbHNlOyB9XG5cblx0aWYgKCFPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwob2JqLCBzeW0pKSB7IHJldHVybiBmYWxzZTsgfVxuXG5cdGlmICh0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvciA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1leHRyYS1wYXJlbnNcblx0XHR2YXIgZGVzY3JpcHRvciA9IC8qKiBAdHlwZSB7UHJvcGVydHlEZXNjcmlwdG9yfSAqLyAoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIHN5bSkpO1xuXHRcdGlmIChkZXNjcmlwdG9yLnZhbHVlICE9PSBzeW1WYWwgfHwgZGVzY3JpcHRvci5lbnVtZXJhYmxlICE9PSB0cnVlKSB7IHJldHVybiBmYWxzZTsgfVxuXHR9XG5cblx0cmV0dXJuIHRydWU7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgb3JpZ1N5bWJvbCA9IHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbDtcbnZhciBoYXNTeW1ib2xTaGFtID0gcmVxdWlyZSgnLi9zaGFtcycpO1xuXG4vKiogQHR5cGUge2ltcG9ydCgnLicpfSAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBoYXNOYXRpdmVTeW1ib2xzKCkge1xuXHRpZiAodHlwZW9mIG9yaWdTeW1ib2wgIT09ICdmdW5jdGlvbicpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdGlmICh0eXBlb2YgU3ltYm9sICE9PSAnZnVuY3Rpb24nKSB7IHJldHVybiBmYWxzZTsgfVxuXHRpZiAodHlwZW9mIG9yaWdTeW1ib2woJ2ZvbycpICE9PSAnc3ltYm9sJykgeyByZXR1cm4gZmFsc2U7IH1cblx0aWYgKHR5cGVvZiBTeW1ib2woJ2JhcicpICE9PSAnc3ltYm9sJykgeyByZXR1cm4gZmFsc2U7IH1cblxuXHRyZXR1cm4gaGFzU3ltYm9sU2hhbSgpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqIEB0eXBlIHtpbXBvcnQoJy4vUmVmbGVjdC5nZXRQcm90b3R5cGVPZicpfSAqL1xubW9kdWxlLmV4cG9ydHMgPSAodHlwZW9mIFJlZmxlY3QgIT09ICd1bmRlZmluZWQnICYmIFJlZmxlY3QuZ2V0UHJvdG90eXBlT2YpIHx8IG51bGw7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciAkT2JqZWN0ID0gcmVxdWlyZSgnZXMtb2JqZWN0LWF0b21zJyk7XG5cbi8qKiBAdHlwZSB7aW1wb3J0KCcuL09iamVjdC5nZXRQcm90b3R5cGVPZicpfSAqL1xubW9kdWxlLmV4cG9ydHMgPSAkT2JqZWN0LmdldFByb3RvdHlwZU9mIHx8IG51bGw7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qIGVzbGludCBuby1pbnZhbGlkLXRoaXM6IDEgKi9cblxudmFyIEVSUk9SX01FU1NBR0UgPSAnRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQgY2FsbGVkIG9uIGluY29tcGF0aWJsZSAnO1xudmFyIHRvU3RyID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbnZhciBtYXggPSBNYXRoLm1heDtcbnZhciBmdW5jVHlwZSA9ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG5cbnZhciBjb25jYXR0eSA9IGZ1bmN0aW9uIGNvbmNhdHR5KGEsIGIpIHtcbiAgICB2YXIgYXJyID0gW107XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGEubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgYXJyW2ldID0gYVtpXTtcbiAgICB9XG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBiLmxlbmd0aDsgaiArPSAxKSB7XG4gICAgICAgIGFycltqICsgYS5sZW5ndGhdID0gYltqXTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJyO1xufTtcblxudmFyIHNsaWN5ID0gZnVuY3Rpb24gc2xpY3koYXJyTGlrZSwgb2Zmc2V0KSB7XG4gICAgdmFyIGFyciA9IFtdO1xuICAgIGZvciAodmFyIGkgPSBvZmZzZXQgfHwgMCwgaiA9IDA7IGkgPCBhcnJMaWtlLmxlbmd0aDsgaSArPSAxLCBqICs9IDEpIHtcbiAgICAgICAgYXJyW2pdID0gYXJyTGlrZVtpXTtcbiAgICB9XG4gICAgcmV0dXJuIGFycjtcbn07XG5cbnZhciBqb2lueSA9IGZ1bmN0aW9uIChhcnIsIGpvaW5lcikge1xuICAgIHZhciBzdHIgPSAnJztcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBzdHIgKz0gYXJyW2ldO1xuICAgICAgICBpZiAoaSArIDEgPCBhcnIubGVuZ3RoKSB7XG4gICAgICAgICAgICBzdHIgKz0gam9pbmVyO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzdHI7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJpbmQodGhhdCkge1xuICAgIHZhciB0YXJnZXQgPSB0aGlzO1xuICAgIGlmICh0eXBlb2YgdGFyZ2V0ICE9PSAnZnVuY3Rpb24nIHx8IHRvU3RyLmFwcGx5KHRhcmdldCkgIT09IGZ1bmNUeXBlKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRVJST1JfTUVTU0FHRSArIHRhcmdldCk7XG4gICAgfVxuICAgIHZhciBhcmdzID0gc2xpY3koYXJndW1lbnRzLCAxKTtcblxuICAgIHZhciBib3VuZDtcbiAgICB2YXIgYmluZGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIGJvdW5kKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gdGFyZ2V0LmFwcGx5KFxuICAgICAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgICAgICAgY29uY2F0dHkoYXJncywgYXJndW1lbnRzKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChPYmplY3QocmVzdWx0KSA9PT0gcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0YXJnZXQuYXBwbHkoXG4gICAgICAgICAgICB0aGF0LFxuICAgICAgICAgICAgY29uY2F0dHkoYXJncywgYXJndW1lbnRzKVxuICAgICAgICApO1xuXG4gICAgfTtcblxuICAgIHZhciBib3VuZExlbmd0aCA9IG1heCgwLCB0YXJnZXQubGVuZ3RoIC0gYXJncy5sZW5ndGgpO1xuICAgIHZhciBib3VuZEFyZ3MgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJvdW5kTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYm91bmRBcmdzW2ldID0gJyQnICsgaTtcbiAgICB9XG5cbiAgICBib3VuZCA9IEZ1bmN0aW9uKCdiaW5kZXInLCAncmV0dXJuIGZ1bmN0aW9uICgnICsgam9pbnkoYm91bmRBcmdzLCAnLCcpICsgJyl7IHJldHVybiBiaW5kZXIuYXBwbHkodGhpcyxhcmd1bWVudHMpOyB9JykoYmluZGVyKTtcblxuICAgIGlmICh0YXJnZXQucHJvdG90eXBlKSB7XG4gICAgICAgIHZhciBFbXB0eSA9IGZ1bmN0aW9uIEVtcHR5KCkge307XG4gICAgICAgIEVtcHR5LnByb3RvdHlwZSA9IHRhcmdldC5wcm90b3R5cGU7XG4gICAgICAgIGJvdW5kLnByb3RvdHlwZSA9IG5ldyBFbXB0eSgpO1xuICAgICAgICBFbXB0eS5wcm90b3R5cGUgPSBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBib3VuZDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpbXBsZW1lbnRhdGlvbiA9IHJlcXVpcmUoJy4vaW1wbGVtZW50YXRpb24nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCB8fCBpbXBsZW1lbnRhdGlvbjtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqIEB0eXBlIHtpbXBvcnQoJy4vZnVuY3Rpb25DYWxsJyl9ICovXG5tb2R1bGUuZXhwb3J0cyA9IEZ1bmN0aW9uLnByb3RvdHlwZS5jYWxsO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKiogQHR5cGUge2ltcG9ydCgnLi9mdW5jdGlvbkFwcGx5Jyl9ICovXG5tb2R1bGUuZXhwb3J0cyA9IEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqIEB0eXBlIHtpbXBvcnQoJy4vcmVmbGVjdEFwcGx5Jyl9ICovXG5tb2R1bGUuZXhwb3J0cyA9IHR5cGVvZiBSZWZsZWN0ICE9PSAndW5kZWZpbmVkJyAmJiBSZWZsZWN0ICYmIFJlZmxlY3QuYXBwbHk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiaW5kID0gcmVxdWlyZSgnZnVuY3Rpb24tYmluZCcpO1xuXG52YXIgJGFwcGx5ID0gcmVxdWlyZSgnLi9mdW5jdGlvbkFwcGx5Jyk7XG52YXIgJGNhbGwgPSByZXF1aXJlKCcuL2Z1bmN0aW9uQ2FsbCcpO1xudmFyICRyZWZsZWN0QXBwbHkgPSByZXF1aXJlKCcuL3JlZmxlY3RBcHBseScpO1xuXG4vKiogQHR5cGUge2ltcG9ydCgnLi9hY3R1YWxBcHBseScpfSAqL1xubW9kdWxlLmV4cG9ydHMgPSAkcmVmbGVjdEFwcGx5IHx8IGJpbmQuY2FsbCgkY2FsbCwgJGFwcGx5KTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJpbmQgPSByZXF1aXJlKCdmdW5jdGlvbi1iaW5kJyk7XG52YXIgJFR5cGVFcnJvciA9IHJlcXVpcmUoJ2VzLWVycm9ycy90eXBlJyk7XG5cbnZhciAkY2FsbCA9IHJlcXVpcmUoJy4vZnVuY3Rpb25DYWxsJyk7XG52YXIgJGFjdHVhbEFwcGx5ID0gcmVxdWlyZSgnLi9hY3R1YWxBcHBseScpO1xuXG4vKiogQHR5cGUgeyhhcmdzOiBbRnVuY3Rpb24sIHRoaXNBcmc/OiB1bmtub3duLCAuLi5hcmdzOiB1bmtub3duW11dKSA9PiBGdW5jdGlvbn0gVE9ETyBGSVhNRSwgZmluZCBhIHdheSB0byB1c2UgaW1wb3J0KCcuJykgKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY2FsbEJpbmRCYXNpYyhhcmdzKSB7XG5cdGlmIChhcmdzLmxlbmd0aCA8IDEgfHwgdHlwZW9mIGFyZ3NbMF0gIT09ICdmdW5jdGlvbicpIHtcblx0XHR0aHJvdyBuZXcgJFR5cGVFcnJvcignYSBmdW5jdGlvbiBpcyByZXF1aXJlZCcpO1xuXHR9XG5cdHJldHVybiAkYWN0dWFsQXBwbHkoYmluZCwgJGNhbGwsIGFyZ3MpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNhbGxCaW5kID0gcmVxdWlyZSgnY2FsbC1iaW5kLWFwcGx5LWhlbHBlcnMnKTtcbnZhciBnT1BEID0gcmVxdWlyZSgnZ29wZCcpO1xuXG52YXIgaGFzUHJvdG9BY2Nlc3NvcjtcbnRyeSB7XG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1leHRyYS1wYXJlbnMsIG5vLXByb3RvXG5cdGhhc1Byb3RvQWNjZXNzb3IgPSAvKiogQHR5cGUge3sgX19wcm90b19fPzogdHlwZW9mIEFycmF5LnByb3RvdHlwZSB9fSAqLyAoW10pLl9fcHJvdG9fXyA9PT0gQXJyYXkucHJvdG90eXBlO1xufSBjYXRjaCAoZSkge1xuXHRpZiAoIWUgfHwgdHlwZW9mIGUgIT09ICdvYmplY3QnIHx8ICEoJ2NvZGUnIGluIGUpIHx8IGUuY29kZSAhPT0gJ0VSUl9QUk9UT19BQ0NFU1MnKSB7XG5cdFx0dGhyb3cgZTtcblx0fVxufVxuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZXh0cmEtcGFyZW5zXG52YXIgZGVzYyA9ICEhaGFzUHJvdG9BY2Nlc3NvciAmJiBnT1BEICYmIGdPUEQoT2JqZWN0LnByb3RvdHlwZSwgLyoqIEB0eXBlIHtrZXlvZiB0eXBlb2YgT2JqZWN0LnByb3RvdHlwZX0gKi8gKCdfX3Byb3RvX18nKSk7XG5cbnZhciAkT2JqZWN0ID0gT2JqZWN0O1xudmFyICRnZXRQcm90b3R5cGVPZiA9ICRPYmplY3QuZ2V0UHJvdG90eXBlT2Y7XG5cbi8qKiBAdHlwZSB7aW1wb3J0KCcuL2dldCcpfSAqL1xubW9kdWxlLmV4cG9ydHMgPSBkZXNjICYmIHR5cGVvZiBkZXNjLmdldCA9PT0gJ2Z1bmN0aW9uJ1xuXHQ/IGNhbGxCaW5kKFtkZXNjLmdldF0pXG5cdDogdHlwZW9mICRnZXRQcm90b3R5cGVPZiA9PT0gJ2Z1bmN0aW9uJ1xuXHRcdD8gLyoqIEB0eXBlIHtpbXBvcnQoJy4vZ2V0Jyl9ICovIGZ1bmN0aW9uIGdldER1bmRlcih2YWx1ZSkge1xuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVxZXFlcVxuXHRcdFx0cmV0dXJuICRnZXRQcm90b3R5cGVPZih2YWx1ZSA9PSBudWxsID8gdmFsdWUgOiAkT2JqZWN0KHZhbHVlKSk7XG5cdFx0fVxuXHRcdDogZmFsc2U7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciByZWZsZWN0R2V0UHJvdG8gPSByZXF1aXJlKCcuL1JlZmxlY3QuZ2V0UHJvdG90eXBlT2YnKTtcbnZhciBvcmlnaW5hbEdldFByb3RvID0gcmVxdWlyZSgnLi9PYmplY3QuZ2V0UHJvdG90eXBlT2YnKTtcblxudmFyIGdldER1bmRlclByb3RvID0gcmVxdWlyZSgnZHVuZGVyLXByb3RvL2dldCcpO1xuXG4vKiogQHR5cGUge2ltcG9ydCgnLicpfSAqL1xubW9kdWxlLmV4cG9ydHMgPSByZWZsZWN0R2V0UHJvdG9cblx0PyBmdW5jdGlvbiBnZXRQcm90byhPKSB7XG5cdFx0Ly8gQHRzLWV4cGVjdC1lcnJvciBUUyBjYW4ndCBuYXJyb3cgaW5zaWRlIGEgY2xvc3VyZSwgZm9yIHNvbWUgcmVhc29uXG5cdFx0cmV0dXJuIHJlZmxlY3RHZXRQcm90byhPKTtcblx0fVxuXHQ6IG9yaWdpbmFsR2V0UHJvdG9cblx0XHQ/IGZ1bmN0aW9uIGdldFByb3RvKE8pIHtcblx0XHRcdGlmICghTyB8fCAodHlwZW9mIE8gIT09ICdvYmplY3QnICYmIHR5cGVvZiBPICE9PSAnZnVuY3Rpb24nKSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdnZXRQcm90bzogbm90IGFuIG9iamVjdCcpO1xuXHRcdFx0fVxuXHRcdFx0Ly8gQHRzLWV4cGVjdC1lcnJvciBUUyBjYW4ndCBuYXJyb3cgaW5zaWRlIGEgY2xvc3VyZSwgZm9yIHNvbWUgcmVhc29uXG5cdFx0XHRyZXR1cm4gb3JpZ2luYWxHZXRQcm90byhPKTtcblx0XHR9XG5cdFx0OiBnZXREdW5kZXJQcm90b1xuXHRcdFx0PyBmdW5jdGlvbiBnZXRQcm90byhPKSB7XG5cdFx0XHRcdC8vIEB0cy1leHBlY3QtZXJyb3IgVFMgY2FuJ3QgbmFycm93IGluc2lkZSBhIGNsb3N1cmUsIGZvciBzb21lIHJlYXNvblxuXHRcdFx0XHRyZXR1cm4gZ2V0RHVuZGVyUHJvdG8oTyk7XG5cdFx0XHR9XG5cdFx0XHQ6IG51bGw7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjYWxsID0gRnVuY3Rpb24ucHJvdG90eXBlLmNhbGw7XG52YXIgJGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgYmluZCA9IHJlcXVpcmUoJ2Z1bmN0aW9uLWJpbmQnKTtcblxuLyoqIEB0eXBlIHtpbXBvcnQoJy4nKX0gKi9cbm1vZHVsZS5leHBvcnRzID0gYmluZC5jYWxsKGNhbGwsICRoYXNPd24pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdW5kZWZpbmVkO1xuXG52YXIgJE9iamVjdCA9IHJlcXVpcmUoJ2VzLW9iamVjdC1hdG9tcycpO1xuXG52YXIgJEVycm9yID0gcmVxdWlyZSgnZXMtZXJyb3JzJyk7XG52YXIgJEV2YWxFcnJvciA9IHJlcXVpcmUoJ2VzLWVycm9ycy9ldmFsJyk7XG52YXIgJFJhbmdlRXJyb3IgPSByZXF1aXJlKCdlcy1lcnJvcnMvcmFuZ2UnKTtcbnZhciAkUmVmZXJlbmNlRXJyb3IgPSByZXF1aXJlKCdlcy1lcnJvcnMvcmVmJyk7XG52YXIgJFN5bnRheEVycm9yID0gcmVxdWlyZSgnZXMtZXJyb3JzL3N5bnRheCcpO1xudmFyICRUeXBlRXJyb3IgPSByZXF1aXJlKCdlcy1lcnJvcnMvdHlwZScpO1xudmFyICRVUklFcnJvciA9IHJlcXVpcmUoJ2VzLWVycm9ycy91cmknKTtcblxudmFyIGFicyA9IHJlcXVpcmUoJ21hdGgtaW50cmluc2ljcy9hYnMnKTtcbnZhciBmbG9vciA9IHJlcXVpcmUoJ21hdGgtaW50cmluc2ljcy9mbG9vcicpO1xudmFyIG1heCA9IHJlcXVpcmUoJ21hdGgtaW50cmluc2ljcy9tYXgnKTtcbnZhciBtaW4gPSByZXF1aXJlKCdtYXRoLWludHJpbnNpY3MvbWluJyk7XG52YXIgcG93ID0gcmVxdWlyZSgnbWF0aC1pbnRyaW5zaWNzL3BvdycpO1xudmFyIHJvdW5kID0gcmVxdWlyZSgnbWF0aC1pbnRyaW5zaWNzL3JvdW5kJyk7XG52YXIgc2lnbiA9IHJlcXVpcmUoJ21hdGgtaW50cmluc2ljcy9zaWduJyk7XG5cbnZhciAkRnVuY3Rpb24gPSBGdW5jdGlvbjtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG52YXIgZ2V0RXZhbGxlZENvbnN0cnVjdG9yID0gZnVuY3Rpb24gKGV4cHJlc3Npb25TeW50YXgpIHtcblx0dHJ5IHtcblx0XHRyZXR1cm4gJEZ1bmN0aW9uKCdcInVzZSBzdHJpY3RcIjsgcmV0dXJuICgnICsgZXhwcmVzc2lvblN5bnRheCArICcpLmNvbnN0cnVjdG9yOycpKCk7XG5cdH0gY2F0Y2ggKGUpIHt9XG59O1xuXG52YXIgJGdPUEQgPSByZXF1aXJlKCdnb3BkJyk7XG52YXIgJGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnZXMtZGVmaW5lLXByb3BlcnR5Jyk7XG5cbnZhciB0aHJvd1R5cGVFcnJvciA9IGZ1bmN0aW9uICgpIHtcblx0dGhyb3cgbmV3ICRUeXBlRXJyb3IoKTtcbn07XG52YXIgVGhyb3dUeXBlRXJyb3IgPSAkZ09QRFxuXHQ/IChmdW5jdGlvbiAoKSB7XG5cdFx0dHJ5IHtcblx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtZXhwcmVzc2lvbnMsIG5vLWNhbGxlciwgbm8tcmVzdHJpY3RlZC1wcm9wZXJ0aWVzXG5cdFx0XHRhcmd1bWVudHMuY2FsbGVlOyAvLyBJRSA4IGRvZXMgbm90IHRocm93IGhlcmVcblx0XHRcdHJldHVybiB0aHJvd1R5cGVFcnJvcjtcblx0XHR9IGNhdGNoIChjYWxsZWVUaHJvd3MpIHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdC8vIElFIDggdGhyb3dzIG9uIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoYXJndW1lbnRzLCAnJylcblx0XHRcdFx0cmV0dXJuICRnT1BEKGFyZ3VtZW50cywgJ2NhbGxlZScpLmdldDtcblx0XHRcdH0gY2F0Y2ggKGdPUER0aHJvd3MpIHtcblx0XHRcdFx0cmV0dXJuIHRocm93VHlwZUVycm9yO1xuXHRcdFx0fVxuXHRcdH1cblx0fSgpKVxuXHQ6IHRocm93VHlwZUVycm9yO1xuXG52YXIgaGFzU3ltYm9scyA9IHJlcXVpcmUoJ2hhcy1zeW1ib2xzJykoKTtcblxudmFyIGdldFByb3RvID0gcmVxdWlyZSgnZ2V0LXByb3RvJyk7XG52YXIgJE9iamVjdEdQTyA9IHJlcXVpcmUoJ2dldC1wcm90by9PYmplY3QuZ2V0UHJvdG90eXBlT2YnKTtcbnZhciAkUmVmbGVjdEdQTyA9IHJlcXVpcmUoJ2dldC1wcm90by9SZWZsZWN0LmdldFByb3RvdHlwZU9mJyk7XG5cbnZhciAkYXBwbHkgPSByZXF1aXJlKCdjYWxsLWJpbmQtYXBwbHktaGVscGVycy9mdW5jdGlvbkFwcGx5Jyk7XG52YXIgJGNhbGwgPSByZXF1aXJlKCdjYWxsLWJpbmQtYXBwbHktaGVscGVycy9mdW5jdGlvbkNhbGwnKTtcblxudmFyIG5lZWRzRXZhbCA9IHt9O1xuXG52YXIgVHlwZWRBcnJheSA9IHR5cGVvZiBVaW50OEFycmF5ID09PSAndW5kZWZpbmVkJyB8fCAhZ2V0UHJvdG8gPyB1bmRlZmluZWQgOiBnZXRQcm90byhVaW50OEFycmF5KTtcblxudmFyIElOVFJJTlNJQ1MgPSB7XG5cdF9fcHJvdG9fXzogbnVsbCxcblx0JyVBZ2dyZWdhdGVFcnJvciUnOiB0eXBlb2YgQWdncmVnYXRlRXJyb3IgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkIDogQWdncmVnYXRlRXJyb3IsXG5cdCclQXJyYXklJzogQXJyYXksXG5cdCclQXJyYXlCdWZmZXIlJzogdHlwZW9mIEFycmF5QnVmZmVyID09PSAndW5kZWZpbmVkJyA/IHVuZGVmaW5lZCA6IEFycmF5QnVmZmVyLFxuXHQnJUFycmF5SXRlcmF0b3JQcm90b3R5cGUlJzogaGFzU3ltYm9scyAmJiBnZXRQcm90byA/IGdldFByb3RvKFtdW1N5bWJvbC5pdGVyYXRvcl0oKSkgOiB1bmRlZmluZWQsXG5cdCclQXN5bmNGcm9tU3luY0l0ZXJhdG9yUHJvdG90eXBlJSc6IHVuZGVmaW5lZCxcblx0JyVBc3luY0Z1bmN0aW9uJSc6IG5lZWRzRXZhbCxcblx0JyVBc3luY0dlbmVyYXRvciUnOiBuZWVkc0V2YWwsXG5cdCclQXN5bmNHZW5lcmF0b3JGdW5jdGlvbiUnOiBuZWVkc0V2YWwsXG5cdCclQXN5bmNJdGVyYXRvclByb3RvdHlwZSUnOiBuZWVkc0V2YWwsXG5cdCclQXRvbWljcyUnOiB0eXBlb2YgQXRvbWljcyA9PT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWQgOiBBdG9taWNzLFxuXHQnJUJpZ0ludCUnOiB0eXBlb2YgQmlnSW50ID09PSAndW5kZWZpbmVkJyA/IHVuZGVmaW5lZCA6IEJpZ0ludCxcblx0JyVCaWdJbnQ2NEFycmF5JSc6IHR5cGVvZiBCaWdJbnQ2NEFycmF5ID09PSAndW5kZWZpbmVkJyA/IHVuZGVmaW5lZCA6IEJpZ0ludDY0QXJyYXksXG5cdCclQmlnVWludDY0QXJyYXklJzogdHlwZW9mIEJpZ1VpbnQ2NEFycmF5ID09PSAndW5kZWZpbmVkJyA/IHVuZGVmaW5lZCA6IEJpZ1VpbnQ2NEFycmF5LFxuXHQnJUJvb2xlYW4lJzogQm9vbGVhbixcblx0JyVEYXRhVmlldyUnOiB0eXBlb2YgRGF0YVZpZXcgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkIDogRGF0YVZpZXcsXG5cdCclRGF0ZSUnOiBEYXRlLFxuXHQnJWRlY29kZVVSSSUnOiBkZWNvZGVVUkksXG5cdCclZGVjb2RlVVJJQ29tcG9uZW50JSc6IGRlY29kZVVSSUNvbXBvbmVudCxcblx0JyVlbmNvZGVVUkklJzogZW5jb2RlVVJJLFxuXHQnJWVuY29kZVVSSUNvbXBvbmVudCUnOiBlbmNvZGVVUklDb21wb25lbnQsXG5cdCclRXJyb3IlJzogJEVycm9yLFxuXHQnJWV2YWwlJzogZXZhbCwgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1ldmFsXG5cdCclRXZhbEVycm9yJSc6ICRFdmFsRXJyb3IsXG5cdCclRmxvYXQxNkFycmF5JSc6IHR5cGVvZiBGbG9hdDE2QXJyYXkgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkIDogRmxvYXQxNkFycmF5LFxuXHQnJUZsb2F0MzJBcnJheSUnOiB0eXBlb2YgRmxvYXQzMkFycmF5ID09PSAndW5kZWZpbmVkJyA/IHVuZGVmaW5lZCA6IEZsb2F0MzJBcnJheSxcblx0JyVGbG9hdDY0QXJyYXklJzogdHlwZW9mIEZsb2F0NjRBcnJheSA9PT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWQgOiBGbG9hdDY0QXJyYXksXG5cdCclRmluYWxpemF0aW9uUmVnaXN0cnklJzogdHlwZW9mIEZpbmFsaXphdGlvblJlZ2lzdHJ5ID09PSAndW5kZWZpbmVkJyA/IHVuZGVmaW5lZCA6IEZpbmFsaXphdGlvblJlZ2lzdHJ5LFxuXHQnJUZ1bmN0aW9uJSc6ICRGdW5jdGlvbixcblx0JyVHZW5lcmF0b3JGdW5jdGlvbiUnOiBuZWVkc0V2YWwsXG5cdCclSW50OEFycmF5JSc6IHR5cGVvZiBJbnQ4QXJyYXkgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkIDogSW50OEFycmF5LFxuXHQnJUludDE2QXJyYXklJzogdHlwZW9mIEludDE2QXJyYXkgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkIDogSW50MTZBcnJheSxcblx0JyVJbnQzMkFycmF5JSc6IHR5cGVvZiBJbnQzMkFycmF5ID09PSAndW5kZWZpbmVkJyA/IHVuZGVmaW5lZCA6IEludDMyQXJyYXksXG5cdCclaXNGaW5pdGUlJzogaXNGaW5pdGUsXG5cdCclaXNOYU4lJzogaXNOYU4sXG5cdCclSXRlcmF0b3JQcm90b3R5cGUlJzogaGFzU3ltYm9scyAmJiBnZXRQcm90byA/IGdldFByb3RvKGdldFByb3RvKFtdW1N5bWJvbC5pdGVyYXRvcl0oKSkpIDogdW5kZWZpbmVkLFxuXHQnJUpTT04lJzogdHlwZW9mIEpTT04gPT09ICdvYmplY3QnID8gSlNPTiA6IHVuZGVmaW5lZCxcblx0JyVNYXAlJzogdHlwZW9mIE1hcCA9PT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWQgOiBNYXAsXG5cdCclTWFwSXRlcmF0b3JQcm90b3R5cGUlJzogdHlwZW9mIE1hcCA9PT0gJ3VuZGVmaW5lZCcgfHwgIWhhc1N5bWJvbHMgfHwgIWdldFByb3RvID8gdW5kZWZpbmVkIDogZ2V0UHJvdG8obmV3IE1hcCgpW1N5bWJvbC5pdGVyYXRvcl0oKSksXG5cdCclTWF0aCUnOiBNYXRoLFxuXHQnJU51bWJlciUnOiBOdW1iZXIsXG5cdCclT2JqZWN0JSc6ICRPYmplY3QsXG5cdCclT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvciUnOiAkZ09QRCxcblx0JyVwYXJzZUZsb2F0JSc6IHBhcnNlRmxvYXQsXG5cdCclcGFyc2VJbnQlJzogcGFyc2VJbnQsXG5cdCclUHJvbWlzZSUnOiB0eXBlb2YgUHJvbWlzZSA9PT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWQgOiBQcm9taXNlLFxuXHQnJVByb3h5JSc6IHR5cGVvZiBQcm94eSA9PT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWQgOiBQcm94eSxcblx0JyVSYW5nZUVycm9yJSc6ICRSYW5nZUVycm9yLFxuXHQnJVJlZmVyZW5jZUVycm9yJSc6ICRSZWZlcmVuY2VFcnJvcixcblx0JyVSZWZsZWN0JSc6IHR5cGVvZiBSZWZsZWN0ID09PSAndW5kZWZpbmVkJyA/IHVuZGVmaW5lZCA6IFJlZmxlY3QsXG5cdCclUmVnRXhwJSc6IFJlZ0V4cCxcblx0JyVTZXQlJzogdHlwZW9mIFNldCA9PT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWQgOiBTZXQsXG5cdCclU2V0SXRlcmF0b3JQcm90b3R5cGUlJzogdHlwZW9mIFNldCA9PT0gJ3VuZGVmaW5lZCcgfHwgIWhhc1N5bWJvbHMgfHwgIWdldFByb3RvID8gdW5kZWZpbmVkIDogZ2V0UHJvdG8obmV3IFNldCgpW1N5bWJvbC5pdGVyYXRvcl0oKSksXG5cdCclU2hhcmVkQXJyYXlCdWZmZXIlJzogdHlwZW9mIFNoYXJlZEFycmF5QnVmZmVyID09PSAndW5kZWZpbmVkJyA/IHVuZGVmaW5lZCA6IFNoYXJlZEFycmF5QnVmZmVyLFxuXHQnJVN0cmluZyUnOiBTdHJpbmcsXG5cdCclU3RyaW5nSXRlcmF0b3JQcm90b3R5cGUlJzogaGFzU3ltYm9scyAmJiBnZXRQcm90byA/IGdldFByb3RvKCcnW1N5bWJvbC5pdGVyYXRvcl0oKSkgOiB1bmRlZmluZWQsXG5cdCclU3ltYm9sJSc6IGhhc1N5bWJvbHMgPyBTeW1ib2wgOiB1bmRlZmluZWQsXG5cdCclU3ludGF4RXJyb3IlJzogJFN5bnRheEVycm9yLFxuXHQnJVRocm93VHlwZUVycm9yJSc6IFRocm93VHlwZUVycm9yLFxuXHQnJVR5cGVkQXJyYXklJzogVHlwZWRBcnJheSxcblx0JyVUeXBlRXJyb3IlJzogJFR5cGVFcnJvcixcblx0JyVVaW50OEFycmF5JSc6IHR5cGVvZiBVaW50OEFycmF5ID09PSAndW5kZWZpbmVkJyA/IHVuZGVmaW5lZCA6IFVpbnQ4QXJyYXksXG5cdCclVWludDhDbGFtcGVkQXJyYXklJzogdHlwZW9mIFVpbnQ4Q2xhbXBlZEFycmF5ID09PSAndW5kZWZpbmVkJyA/IHVuZGVmaW5lZCA6IFVpbnQ4Q2xhbXBlZEFycmF5LFxuXHQnJVVpbnQxNkFycmF5JSc6IHR5cGVvZiBVaW50MTZBcnJheSA9PT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWQgOiBVaW50MTZBcnJheSxcblx0JyVVaW50MzJBcnJheSUnOiB0eXBlb2YgVWludDMyQXJyYXkgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkIDogVWludDMyQXJyYXksXG5cdCclVVJJRXJyb3IlJzogJFVSSUVycm9yLFxuXHQnJVdlYWtNYXAlJzogdHlwZW9mIFdlYWtNYXAgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkIDogV2Vha01hcCxcblx0JyVXZWFrUmVmJSc6IHR5cGVvZiBXZWFrUmVmID09PSAndW5kZWZpbmVkJyA/IHVuZGVmaW5lZCA6IFdlYWtSZWYsXG5cdCclV2Vha1NldCUnOiB0eXBlb2YgV2Vha1NldCA9PT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWQgOiBXZWFrU2V0LFxuXG5cdCclRnVuY3Rpb24ucHJvdG90eXBlLmNhbGwlJzogJGNhbGwsXG5cdCclRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5JSc6ICRhcHBseSxcblx0JyVPYmplY3QuZGVmaW5lUHJvcGVydHklJzogJGRlZmluZVByb3BlcnR5LFxuXHQnJU9iamVjdC5nZXRQcm90b3R5cGVPZiUnOiAkT2JqZWN0R1BPLFxuXHQnJU1hdGguYWJzJSc6IGFicyxcblx0JyVNYXRoLmZsb29yJSc6IGZsb29yLFxuXHQnJU1hdGgubWF4JSc6IG1heCxcblx0JyVNYXRoLm1pbiUnOiBtaW4sXG5cdCclTWF0aC5wb3clJzogcG93LFxuXHQnJU1hdGgucm91bmQlJzogcm91bmQsXG5cdCclTWF0aC5zaWduJSc6IHNpZ24sXG5cdCclUmVmbGVjdC5nZXRQcm90b3R5cGVPZiUnOiAkUmVmbGVjdEdQT1xufTtcblxuaWYgKGdldFByb3RvKSB7XG5cdHRyeSB7XG5cdFx0bnVsbC5lcnJvcjsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtZXhwcmVzc2lvbnNcblx0fSBjYXRjaCAoZSkge1xuXHRcdC8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLXNoYWRvd3JlYWxtL3B1bGwvMzg0I2lzc3VlY29tbWVudC0xMzY0MjY0MjI5XG5cdFx0dmFyIGVycm9yUHJvdG8gPSBnZXRQcm90byhnZXRQcm90byhlKSk7XG5cdFx0SU5UUklOU0lDU1snJUVycm9yLnByb3RvdHlwZSUnXSA9IGVycm9yUHJvdG87XG5cdH1cbn1cblxudmFyIGRvRXZhbCA9IGZ1bmN0aW9uIGRvRXZhbChuYW1lKSB7XG5cdHZhciB2YWx1ZTtcblx0aWYgKG5hbWUgPT09ICclQXN5bmNGdW5jdGlvbiUnKSB7XG5cdFx0dmFsdWUgPSBnZXRFdmFsbGVkQ29uc3RydWN0b3IoJ2FzeW5jIGZ1bmN0aW9uICgpIHt9Jyk7XG5cdH0gZWxzZSBpZiAobmFtZSA9PT0gJyVHZW5lcmF0b3JGdW5jdGlvbiUnKSB7XG5cdFx0dmFsdWUgPSBnZXRFdmFsbGVkQ29uc3RydWN0b3IoJ2Z1bmN0aW9uKiAoKSB7fScpO1xuXHR9IGVsc2UgaWYgKG5hbWUgPT09ICclQXN5bmNHZW5lcmF0b3JGdW5jdGlvbiUnKSB7XG5cdFx0dmFsdWUgPSBnZXRFdmFsbGVkQ29uc3RydWN0b3IoJ2FzeW5jIGZ1bmN0aW9uKiAoKSB7fScpO1xuXHR9IGVsc2UgaWYgKG5hbWUgPT09ICclQXN5bmNHZW5lcmF0b3IlJykge1xuXHRcdHZhciBmbiA9IGRvRXZhbCgnJUFzeW5jR2VuZXJhdG9yRnVuY3Rpb24lJyk7XG5cdFx0aWYgKGZuKSB7XG5cdFx0XHR2YWx1ZSA9IGZuLnByb3RvdHlwZTtcblx0XHR9XG5cdH0gZWxzZSBpZiAobmFtZSA9PT0gJyVBc3luY0l0ZXJhdG9yUHJvdG90eXBlJScpIHtcblx0XHR2YXIgZ2VuID0gZG9FdmFsKCclQXN5bmNHZW5lcmF0b3IlJyk7XG5cdFx0aWYgKGdlbiAmJiBnZXRQcm90bykge1xuXHRcdFx0dmFsdWUgPSBnZXRQcm90byhnZW4ucHJvdG90eXBlKTtcblx0XHR9XG5cdH1cblxuXHRJTlRSSU5TSUNTW25hbWVdID0gdmFsdWU7XG5cblx0cmV0dXJuIHZhbHVlO1xufTtcblxudmFyIExFR0FDWV9BTElBU0VTID0ge1xuXHRfX3Byb3RvX186IG51bGwsXG5cdCclQXJyYXlCdWZmZXJQcm90b3R5cGUlJzogWydBcnJheUJ1ZmZlcicsICdwcm90b3R5cGUnXSxcblx0JyVBcnJheVByb3RvdHlwZSUnOiBbJ0FycmF5JywgJ3Byb3RvdHlwZSddLFxuXHQnJUFycmF5UHJvdG9fZW50cmllcyUnOiBbJ0FycmF5JywgJ3Byb3RvdHlwZScsICdlbnRyaWVzJ10sXG5cdCclQXJyYXlQcm90b19mb3JFYWNoJSc6IFsnQXJyYXknLCAncHJvdG90eXBlJywgJ2ZvckVhY2gnXSxcblx0JyVBcnJheVByb3RvX2tleXMlJzogWydBcnJheScsICdwcm90b3R5cGUnLCAna2V5cyddLFxuXHQnJUFycmF5UHJvdG9fdmFsdWVzJSc6IFsnQXJyYXknLCAncHJvdG90eXBlJywgJ3ZhbHVlcyddLFxuXHQnJUFzeW5jRnVuY3Rpb25Qcm90b3R5cGUlJzogWydBc3luY0Z1bmN0aW9uJywgJ3Byb3RvdHlwZSddLFxuXHQnJUFzeW5jR2VuZXJhdG9yJSc6IFsnQXN5bmNHZW5lcmF0b3JGdW5jdGlvbicsICdwcm90b3R5cGUnXSxcblx0JyVBc3luY0dlbmVyYXRvclByb3RvdHlwZSUnOiBbJ0FzeW5jR2VuZXJhdG9yRnVuY3Rpb24nLCAncHJvdG90eXBlJywgJ3Byb3RvdHlwZSddLFxuXHQnJUJvb2xlYW5Qcm90b3R5cGUlJzogWydCb29sZWFuJywgJ3Byb3RvdHlwZSddLFxuXHQnJURhdGFWaWV3UHJvdG90eXBlJSc6IFsnRGF0YVZpZXcnLCAncHJvdG90eXBlJ10sXG5cdCclRGF0ZVByb3RvdHlwZSUnOiBbJ0RhdGUnLCAncHJvdG90eXBlJ10sXG5cdCclRXJyb3JQcm90b3R5cGUlJzogWydFcnJvcicsICdwcm90b3R5cGUnXSxcblx0JyVFdmFsRXJyb3JQcm90b3R5cGUlJzogWydFdmFsRXJyb3InLCAncHJvdG90eXBlJ10sXG5cdCclRmxvYXQzMkFycmF5UHJvdG90eXBlJSc6IFsnRmxvYXQzMkFycmF5JywgJ3Byb3RvdHlwZSddLFxuXHQnJUZsb2F0NjRBcnJheVByb3RvdHlwZSUnOiBbJ0Zsb2F0NjRBcnJheScsICdwcm90b3R5cGUnXSxcblx0JyVGdW5jdGlvblByb3RvdHlwZSUnOiBbJ0Z1bmN0aW9uJywgJ3Byb3RvdHlwZSddLFxuXHQnJUdlbmVyYXRvciUnOiBbJ0dlbmVyYXRvckZ1bmN0aW9uJywgJ3Byb3RvdHlwZSddLFxuXHQnJUdlbmVyYXRvclByb3RvdHlwZSUnOiBbJ0dlbmVyYXRvckZ1bmN0aW9uJywgJ3Byb3RvdHlwZScsICdwcm90b3R5cGUnXSxcblx0JyVJbnQ4QXJyYXlQcm90b3R5cGUlJzogWydJbnQ4QXJyYXknLCAncHJvdG90eXBlJ10sXG5cdCclSW50MTZBcnJheVByb3RvdHlwZSUnOiBbJ0ludDE2QXJyYXknLCAncHJvdG90eXBlJ10sXG5cdCclSW50MzJBcnJheVByb3RvdHlwZSUnOiBbJ0ludDMyQXJyYXknLCAncHJvdG90eXBlJ10sXG5cdCclSlNPTlBhcnNlJSc6IFsnSlNPTicsICdwYXJzZSddLFxuXHQnJUpTT05TdHJpbmdpZnklJzogWydKU09OJywgJ3N0cmluZ2lmeSddLFxuXHQnJU1hcFByb3RvdHlwZSUnOiBbJ01hcCcsICdwcm90b3R5cGUnXSxcblx0JyVOdW1iZXJQcm90b3R5cGUlJzogWydOdW1iZXInLCAncHJvdG90eXBlJ10sXG5cdCclT2JqZWN0UHJvdG90eXBlJSc6IFsnT2JqZWN0JywgJ3Byb3RvdHlwZSddLFxuXHQnJU9ialByb3RvX3RvU3RyaW5nJSc6IFsnT2JqZWN0JywgJ3Byb3RvdHlwZScsICd0b1N0cmluZyddLFxuXHQnJU9ialByb3RvX3ZhbHVlT2YlJzogWydPYmplY3QnLCAncHJvdG90eXBlJywgJ3ZhbHVlT2YnXSxcblx0JyVQcm9taXNlUHJvdG90eXBlJSc6IFsnUHJvbWlzZScsICdwcm90b3R5cGUnXSxcblx0JyVQcm9taXNlUHJvdG9fdGhlbiUnOiBbJ1Byb21pc2UnLCAncHJvdG90eXBlJywgJ3RoZW4nXSxcblx0JyVQcm9taXNlX2FsbCUnOiBbJ1Byb21pc2UnLCAnYWxsJ10sXG5cdCclUHJvbWlzZV9yZWplY3QlJzogWydQcm9taXNlJywgJ3JlamVjdCddLFxuXHQnJVByb21pc2VfcmVzb2x2ZSUnOiBbJ1Byb21pc2UnLCAncmVzb2x2ZSddLFxuXHQnJVJhbmdlRXJyb3JQcm90b3R5cGUlJzogWydSYW5nZUVycm9yJywgJ3Byb3RvdHlwZSddLFxuXHQnJVJlZmVyZW5jZUVycm9yUHJvdG90eXBlJSc6IFsnUmVmZXJlbmNlRXJyb3InLCAncHJvdG90eXBlJ10sXG5cdCclUmVnRXhwUHJvdG90eXBlJSc6IFsnUmVnRXhwJywgJ3Byb3RvdHlwZSddLFxuXHQnJVNldFByb3RvdHlwZSUnOiBbJ1NldCcsICdwcm90b3R5cGUnXSxcblx0JyVTaGFyZWRBcnJheUJ1ZmZlclByb3RvdHlwZSUnOiBbJ1NoYXJlZEFycmF5QnVmZmVyJywgJ3Byb3RvdHlwZSddLFxuXHQnJVN0cmluZ1Byb3RvdHlwZSUnOiBbJ1N0cmluZycsICdwcm90b3R5cGUnXSxcblx0JyVTeW1ib2xQcm90b3R5cGUlJzogWydTeW1ib2wnLCAncHJvdG90eXBlJ10sXG5cdCclU3ludGF4RXJyb3JQcm90b3R5cGUlJzogWydTeW50YXhFcnJvcicsICdwcm90b3R5cGUnXSxcblx0JyVUeXBlZEFycmF5UHJvdG90eXBlJSc6IFsnVHlwZWRBcnJheScsICdwcm90b3R5cGUnXSxcblx0JyVUeXBlRXJyb3JQcm90b3R5cGUlJzogWydUeXBlRXJyb3InLCAncHJvdG90eXBlJ10sXG5cdCclVWludDhBcnJheVByb3RvdHlwZSUnOiBbJ1VpbnQ4QXJyYXknLCAncHJvdG90eXBlJ10sXG5cdCclVWludDhDbGFtcGVkQXJyYXlQcm90b3R5cGUlJzogWydVaW50OENsYW1wZWRBcnJheScsICdwcm90b3R5cGUnXSxcblx0JyVVaW50MTZBcnJheVByb3RvdHlwZSUnOiBbJ1VpbnQxNkFycmF5JywgJ3Byb3RvdHlwZSddLFxuXHQnJVVpbnQzMkFycmF5UHJvdG90eXBlJSc6IFsnVWludDMyQXJyYXknLCAncHJvdG90eXBlJ10sXG5cdCclVVJJRXJyb3JQcm90b3R5cGUlJzogWydVUklFcnJvcicsICdwcm90b3R5cGUnXSxcblx0JyVXZWFrTWFwUHJvdG90eXBlJSc6IFsnV2Vha01hcCcsICdwcm90b3R5cGUnXSxcblx0JyVXZWFrU2V0UHJvdG90eXBlJSc6IFsnV2Vha1NldCcsICdwcm90b3R5cGUnXVxufTtcblxudmFyIGJpbmQgPSByZXF1aXJlKCdmdW5jdGlvbi1iaW5kJyk7XG52YXIgaGFzT3duID0gcmVxdWlyZSgnaGFzb3duJyk7XG52YXIgJGNvbmNhdCA9IGJpbmQuY2FsbCgkY2FsbCwgQXJyYXkucHJvdG90eXBlLmNvbmNhdCk7XG52YXIgJHNwbGljZUFwcGx5ID0gYmluZC5jYWxsKCRhcHBseSwgQXJyYXkucHJvdG90eXBlLnNwbGljZSk7XG52YXIgJHJlcGxhY2UgPSBiaW5kLmNhbGwoJGNhbGwsIFN0cmluZy5wcm90b3R5cGUucmVwbGFjZSk7XG52YXIgJHN0clNsaWNlID0gYmluZC5jYWxsKCRjYWxsLCBTdHJpbmcucHJvdG90eXBlLnNsaWNlKTtcbnZhciAkZXhlYyA9IGJpbmQuY2FsbCgkY2FsbCwgUmVnRXhwLnByb3RvdHlwZS5leGVjKTtcblxuLyogYWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9sb2Rhc2gvbG9kYXNoL2Jsb2IvNC4xNy4xNS9kaXN0L2xvZGFzaC5qcyNMNjczNS1MNjc0NCAqL1xudmFyIHJlUHJvcE5hbWUgPSAvW14lLltcXF1dK3xcXFsoPzooLT9cXGQrKD86XFwuXFxkKyk/KXwoW1wiJ10pKCg/Oig/IVxcMilbXlxcXFxdfFxcXFwuKSo/KVxcMilcXF18KD89KD86XFwufFxcW1xcXSkoPzpcXC58XFxbXFxdfCUkKSkvZztcbnZhciByZUVzY2FwZUNoYXIgPSAvXFxcXChcXFxcKT8vZzsgLyoqIFVzZWQgdG8gbWF0Y2ggYmFja3NsYXNoZXMgaW4gcHJvcGVydHkgcGF0aHMuICovXG52YXIgc3RyaW5nVG9QYXRoID0gZnVuY3Rpb24gc3RyaW5nVG9QYXRoKHN0cmluZykge1xuXHR2YXIgZmlyc3QgPSAkc3RyU2xpY2Uoc3RyaW5nLCAwLCAxKTtcblx0dmFyIGxhc3QgPSAkc3RyU2xpY2Uoc3RyaW5nLCAtMSk7XG5cdGlmIChmaXJzdCA9PT0gJyUnICYmIGxhc3QgIT09ICclJykge1xuXHRcdHRocm93IG5ldyAkU3ludGF4RXJyb3IoJ2ludmFsaWQgaW50cmluc2ljIHN5bnRheCwgZXhwZWN0ZWQgY2xvc2luZyBgJWAnKTtcblx0fSBlbHNlIGlmIChsYXN0ID09PSAnJScgJiYgZmlyc3QgIT09ICclJykge1xuXHRcdHRocm93IG5ldyAkU3ludGF4RXJyb3IoJ2ludmFsaWQgaW50cmluc2ljIHN5bnRheCwgZXhwZWN0ZWQgb3BlbmluZyBgJWAnKTtcblx0fVxuXHR2YXIgcmVzdWx0ID0gW107XG5cdCRyZXBsYWNlKHN0cmluZywgcmVQcm9wTmFtZSwgZnVuY3Rpb24gKG1hdGNoLCBudW1iZXIsIHF1b3RlLCBzdWJTdHJpbmcpIHtcblx0XHRyZXN1bHRbcmVzdWx0Lmxlbmd0aF0gPSBxdW90ZSA/ICRyZXBsYWNlKHN1YlN0cmluZywgcmVFc2NhcGVDaGFyLCAnJDEnKSA6IG51bWJlciB8fCBtYXRjaDtcblx0fSk7XG5cdHJldHVybiByZXN1bHQ7XG59O1xuLyogZW5kIGFkYXB0YXRpb24gKi9cblxudmFyIGdldEJhc2VJbnRyaW5zaWMgPSBmdW5jdGlvbiBnZXRCYXNlSW50cmluc2ljKG5hbWUsIGFsbG93TWlzc2luZykge1xuXHR2YXIgaW50cmluc2ljTmFtZSA9IG5hbWU7XG5cdHZhciBhbGlhcztcblx0aWYgKGhhc093bihMRUdBQ1lfQUxJQVNFUywgaW50cmluc2ljTmFtZSkpIHtcblx0XHRhbGlhcyA9IExFR0FDWV9BTElBU0VTW2ludHJpbnNpY05hbWVdO1xuXHRcdGludHJpbnNpY05hbWUgPSAnJScgKyBhbGlhc1swXSArICclJztcblx0fVxuXG5cdGlmIChoYXNPd24oSU5UUklOU0lDUywgaW50cmluc2ljTmFtZSkpIHtcblx0XHR2YXIgdmFsdWUgPSBJTlRSSU5TSUNTW2ludHJpbnNpY05hbWVdO1xuXHRcdGlmICh2YWx1ZSA9PT0gbmVlZHNFdmFsKSB7XG5cdFx0XHR2YWx1ZSA9IGRvRXZhbChpbnRyaW5zaWNOYW1lKTtcblx0XHR9XG5cdFx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcgJiYgIWFsbG93TWlzc2luZykge1xuXHRcdFx0dGhyb3cgbmV3ICRUeXBlRXJyb3IoJ2ludHJpbnNpYyAnICsgbmFtZSArICcgZXhpc3RzLCBidXQgaXMgbm90IGF2YWlsYWJsZS4gUGxlYXNlIGZpbGUgYW4gaXNzdWUhJyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGFsaWFzOiBhbGlhcyxcblx0XHRcdG5hbWU6IGludHJpbnNpY05hbWUsXG5cdFx0XHR2YWx1ZTogdmFsdWVcblx0XHR9O1xuXHR9XG5cblx0dGhyb3cgbmV3ICRTeW50YXhFcnJvcignaW50cmluc2ljICcgKyBuYW1lICsgJyBkb2VzIG5vdCBleGlzdCEnKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gR2V0SW50cmluc2ljKG5hbWUsIGFsbG93TWlzc2luZykge1xuXHRpZiAodHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnIHx8IG5hbWUubGVuZ3RoID09PSAwKSB7XG5cdFx0dGhyb3cgbmV3ICRUeXBlRXJyb3IoJ2ludHJpbnNpYyBuYW1lIG11c3QgYmUgYSBub24tZW1wdHkgc3RyaW5nJyk7XG5cdH1cblx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIHR5cGVvZiBhbGxvd01pc3NpbmcgIT09ICdib29sZWFuJykge1xuXHRcdHRocm93IG5ldyAkVHlwZUVycm9yKCdcImFsbG93TWlzc2luZ1wiIGFyZ3VtZW50IG11c3QgYmUgYSBib29sZWFuJyk7XG5cdH1cblxuXHRpZiAoJGV4ZWMoL14lP1teJV0qJT8kLywgbmFtZSkgPT09IG51bGwpIHtcblx0XHR0aHJvdyBuZXcgJFN5bnRheEVycm9yKCdgJWAgbWF5IG5vdCBiZSBwcmVzZW50IGFueXdoZXJlIGJ1dCBhdCB0aGUgYmVnaW5uaW5nIGFuZCBlbmQgb2YgdGhlIGludHJpbnNpYyBuYW1lJyk7XG5cdH1cblx0dmFyIHBhcnRzID0gc3RyaW5nVG9QYXRoKG5hbWUpO1xuXHR2YXIgaW50cmluc2ljQmFzZU5hbWUgPSBwYXJ0cy5sZW5ndGggPiAwID8gcGFydHNbMF0gOiAnJztcblxuXHR2YXIgaW50cmluc2ljID0gZ2V0QmFzZUludHJpbnNpYygnJScgKyBpbnRyaW5zaWNCYXNlTmFtZSArICclJywgYWxsb3dNaXNzaW5nKTtcblx0dmFyIGludHJpbnNpY1JlYWxOYW1lID0gaW50cmluc2ljLm5hbWU7XG5cdHZhciB2YWx1ZSA9IGludHJpbnNpYy52YWx1ZTtcblx0dmFyIHNraXBGdXJ0aGVyQ2FjaGluZyA9IGZhbHNlO1xuXG5cdHZhciBhbGlhcyA9IGludHJpbnNpYy5hbGlhcztcblx0aWYgKGFsaWFzKSB7XG5cdFx0aW50cmluc2ljQmFzZU5hbWUgPSBhbGlhc1swXTtcblx0XHQkc3BsaWNlQXBwbHkocGFydHMsICRjb25jYXQoWzAsIDFdLCBhbGlhcykpO1xuXHR9XG5cblx0Zm9yICh2YXIgaSA9IDEsIGlzT3duID0gdHJ1ZTsgaSA8IHBhcnRzLmxlbmd0aDsgaSArPSAxKSB7XG5cdFx0dmFyIHBhcnQgPSBwYXJ0c1tpXTtcblx0XHR2YXIgZmlyc3QgPSAkc3RyU2xpY2UocGFydCwgMCwgMSk7XG5cdFx0dmFyIGxhc3QgPSAkc3RyU2xpY2UocGFydCwgLTEpO1xuXHRcdGlmIChcblx0XHRcdChcblx0XHRcdFx0KGZpcnN0ID09PSAnXCInIHx8IGZpcnN0ID09PSBcIidcIiB8fCBmaXJzdCA9PT0gJ2AnKVxuXHRcdFx0XHR8fCAobGFzdCA9PT0gJ1wiJyB8fCBsYXN0ID09PSBcIidcIiB8fCBsYXN0ID09PSAnYCcpXG5cdFx0XHQpXG5cdFx0XHQmJiBmaXJzdCAhPT0gbGFzdFxuXHRcdCkge1xuXHRcdFx0dGhyb3cgbmV3ICRTeW50YXhFcnJvcigncHJvcGVydHkgbmFtZXMgd2l0aCBxdW90ZXMgbXVzdCBoYXZlIG1hdGNoaW5nIHF1b3RlcycpO1xuXHRcdH1cblx0XHRpZiAocGFydCA9PT0gJ2NvbnN0cnVjdG9yJyB8fCAhaXNPd24pIHtcblx0XHRcdHNraXBGdXJ0aGVyQ2FjaGluZyA9IHRydWU7XG5cdFx0fVxuXG5cdFx0aW50cmluc2ljQmFzZU5hbWUgKz0gJy4nICsgcGFydDtcblx0XHRpbnRyaW5zaWNSZWFsTmFtZSA9ICclJyArIGludHJpbnNpY0Jhc2VOYW1lICsgJyUnO1xuXG5cdFx0aWYgKGhhc093bihJTlRSSU5TSUNTLCBpbnRyaW5zaWNSZWFsTmFtZSkpIHtcblx0XHRcdHZhbHVlID0gSU5UUklOU0lDU1tpbnRyaW5zaWNSZWFsTmFtZV07XG5cdFx0fSBlbHNlIGlmICh2YWx1ZSAhPSBudWxsKSB7XG5cdFx0XHRpZiAoIShwYXJ0IGluIHZhbHVlKSkge1xuXHRcdFx0XHRpZiAoIWFsbG93TWlzc2luZykge1xuXHRcdFx0XHRcdHRocm93IG5ldyAkVHlwZUVycm9yKCdiYXNlIGludHJpbnNpYyBmb3IgJyArIG5hbWUgKyAnIGV4aXN0cywgYnV0IHRoZSBwcm9wZXJ0eSBpcyBub3QgYXZhaWxhYmxlLicpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB2b2lkIHVuZGVmaW5lZDtcblx0XHRcdH1cblx0XHRcdGlmICgkZ09QRCAmJiAoaSArIDEpID49IHBhcnRzLmxlbmd0aCkge1xuXHRcdFx0XHR2YXIgZGVzYyA9ICRnT1BEKHZhbHVlLCBwYXJ0KTtcblx0XHRcdFx0aXNPd24gPSAhIWRlc2M7XG5cblx0XHRcdFx0Ly8gQnkgY29udmVudGlvbiwgd2hlbiBhIGRhdGEgcHJvcGVydHkgaXMgY29udmVydGVkIHRvIGFuIGFjY2Vzc29yXG5cdFx0XHRcdC8vIHByb3BlcnR5IHRvIGVtdWxhdGUgYSBkYXRhIHByb3BlcnR5IHRoYXQgZG9lcyBub3Qgc3VmZmVyIGZyb21cblx0XHRcdFx0Ly8gdGhlIG92ZXJyaWRlIG1pc3Rha2UsIHRoYXQgYWNjZXNzb3IncyBnZXR0ZXIgaXMgbWFya2VkIHdpdGhcblx0XHRcdFx0Ly8gYW4gYG9yaWdpbmFsVmFsdWVgIHByb3BlcnR5LiBIZXJlLCB3aGVuIHdlIGRldGVjdCB0aGlzLCB3ZVxuXHRcdFx0XHQvLyB1cGhvbGQgdGhlIGlsbHVzaW9uIGJ5IHByZXRlbmRpbmcgdG8gc2VlIHRoYXQgb3JpZ2luYWwgZGF0YVxuXHRcdFx0XHQvLyBwcm9wZXJ0eSwgaS5lLiwgcmV0dXJuaW5nIHRoZSB2YWx1ZSByYXRoZXIgdGhhbiB0aGUgZ2V0dGVyXG5cdFx0XHRcdC8vIGl0c2VsZi5cblx0XHRcdFx0aWYgKGlzT3duICYmICdnZXQnIGluIGRlc2MgJiYgISgnb3JpZ2luYWxWYWx1ZScgaW4gZGVzYy5nZXQpKSB7XG5cdFx0XHRcdFx0dmFsdWUgPSBkZXNjLmdldDtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR2YWx1ZSA9IHZhbHVlW3BhcnRdO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpc093biA9IGhhc093bih2YWx1ZSwgcGFydCk7XG5cdFx0XHRcdHZhbHVlID0gdmFsdWVbcGFydF07XG5cdFx0XHR9XG5cblx0XHRcdGlmIChpc093biAmJiAhc2tpcEZ1cnRoZXJDYWNoaW5nKSB7XG5cdFx0XHRcdElOVFJJTlNJQ1NbaW50cmluc2ljUmVhbE5hbWVdID0gdmFsdWU7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHJldHVybiB2YWx1ZTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBHZXRJbnRyaW5zaWMgPSByZXF1aXJlKCdnZXQtaW50cmluc2ljJyk7XG5cbnZhciBjYWxsQmluZEJhc2ljID0gcmVxdWlyZSgnY2FsbC1iaW5kLWFwcGx5LWhlbHBlcnMnKTtcblxuLyoqIEB0eXBlIHsodGhpc0FyZzogc3RyaW5nLCBzZWFyY2hTdHJpbmc6IHN0cmluZywgcG9zaXRpb24/OiBudW1iZXIpID0+IG51bWJlcn0gKi9cbnZhciAkaW5kZXhPZiA9IGNhbGxCaW5kQmFzaWMoW0dldEludHJpbnNpYygnJVN0cmluZy5wcm90b3R5cGUuaW5kZXhPZiUnKV0pO1xuXG4vKiogQHR5cGUge2ltcG9ydCgnLicpfSAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjYWxsQm91bmRJbnRyaW5zaWMobmFtZSwgYWxsb3dNaXNzaW5nKSB7XG5cdC8qIGVzbGludCBuby1leHRyYS1wYXJlbnM6IDAgKi9cblxuXHR2YXIgaW50cmluc2ljID0gLyoqIEB0eXBlIHsodGhpczogdW5rbm93biwgLi4uYXJnczogdW5rbm93bltdKSA9PiB1bmtub3dufSAqLyAoR2V0SW50cmluc2ljKG5hbWUsICEhYWxsb3dNaXNzaW5nKSk7XG5cdGlmICh0eXBlb2YgaW50cmluc2ljID09PSAnZnVuY3Rpb24nICYmICRpbmRleE9mKG5hbWUsICcucHJvdG90eXBlLicpID4gLTEpIHtcblx0XHRyZXR1cm4gY2FsbEJpbmRCYXNpYygvKiogQHR5cGUge2NvbnN0fSAqLyAoW2ludHJpbnNpY10pKTtcblx0fVxuXHRyZXR1cm4gaW50cmluc2ljO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIEdldEludHJpbnNpYyA9IHJlcXVpcmUoJ2dldC1pbnRyaW5zaWMnKTtcbnZhciBjYWxsQm91bmQgPSByZXF1aXJlKCdjYWxsLWJvdW5kJyk7XG52YXIgaW5zcGVjdCA9IHJlcXVpcmUoJ29iamVjdC1pbnNwZWN0Jyk7XG5cbnZhciAkVHlwZUVycm9yID0gcmVxdWlyZSgnZXMtZXJyb3JzL3R5cGUnKTtcbnZhciAkTWFwID0gR2V0SW50cmluc2ljKCclTWFwJScsIHRydWUpO1xuXG4vKiogQHR5cGUgezxLLCBWPih0aGlzQXJnOiBNYXA8SywgVj4sIGtleTogSykgPT4gVn0gKi9cbnZhciAkbWFwR2V0ID0gY2FsbEJvdW5kKCdNYXAucHJvdG90eXBlLmdldCcsIHRydWUpO1xuLyoqIEB0eXBlIHs8SywgVj4odGhpc0FyZzogTWFwPEssIFY+LCBrZXk6IEssIHZhbHVlOiBWKSA9PiB2b2lkfSAqL1xudmFyICRtYXBTZXQgPSBjYWxsQm91bmQoJ01hcC5wcm90b3R5cGUuc2V0JywgdHJ1ZSk7XG4vKiogQHR5cGUgezxLLCBWPih0aGlzQXJnOiBNYXA8SywgVj4sIGtleTogSykgPT4gYm9vbGVhbn0gKi9cbnZhciAkbWFwSGFzID0gY2FsbEJvdW5kKCdNYXAucHJvdG90eXBlLmhhcycsIHRydWUpO1xuLyoqIEB0eXBlIHs8SywgVj4odGhpc0FyZzogTWFwPEssIFY+LCBrZXk6IEspID0+IGJvb2xlYW59ICovXG52YXIgJG1hcERlbGV0ZSA9IGNhbGxCb3VuZCgnTWFwLnByb3RvdHlwZS5kZWxldGUnLCB0cnVlKTtcbi8qKiBAdHlwZSB7PEssIFY+KHRoaXNBcmc6IE1hcDxLLCBWPikgPT4gbnVtYmVyfSAqL1xudmFyICRtYXBTaXplID0gY2FsbEJvdW5kKCdNYXAucHJvdG90eXBlLnNpemUnLCB0cnVlKTtcblxuLyoqIEB0eXBlIHtpbXBvcnQoJy4nKX0gKi9cbm1vZHVsZS5leHBvcnRzID0gISEkTWFwICYmIC8qKiBAdHlwZSB7RXhjbHVkZTxpbXBvcnQoJy4nKSwgZmFsc2U+fSAqLyBmdW5jdGlvbiBnZXRTaWRlQ2hhbm5lbE1hcCgpIHtcblx0LyoqIEB0eXBlZGVmIHtSZXR1cm5UeXBlPHR5cGVvZiBnZXRTaWRlQ2hhbm5lbE1hcD59IENoYW5uZWwgKi9cblx0LyoqIEB0eXBlZGVmIHtQYXJhbWV0ZXJzPENoYW5uZWxbJ2dldCddPlswXX0gSyAqL1xuXHQvKiogQHR5cGVkZWYge1BhcmFtZXRlcnM8Q2hhbm5lbFsnc2V0J10+WzFdfSBWICovXG5cblx0LyoqIEB0eXBlIHtNYXA8SywgVj4gfCB1bmRlZmluZWR9ICovIHZhciAkbTtcblxuXHQvKiogQHR5cGUge0NoYW5uZWx9ICovXG5cdHZhciBjaGFubmVsID0ge1xuXHRcdGFzc2VydDogZnVuY3Rpb24gKGtleSkge1xuXHRcdFx0aWYgKCFjaGFubmVsLmhhcyhrZXkpKSB7XG5cdFx0XHRcdHRocm93IG5ldyAkVHlwZUVycm9yKCdTaWRlIGNoYW5uZWwgZG9lcyBub3QgY29udGFpbiAnICsgaW5zcGVjdChrZXkpKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdCdkZWxldGUnOiBmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHRpZiAoJG0pIHtcblx0XHRcdFx0dmFyIHJlc3VsdCA9ICRtYXBEZWxldGUoJG0sIGtleSk7XG5cdFx0XHRcdGlmICgkbWFwU2l6ZSgkbSkgPT09IDApIHtcblx0XHRcdFx0XHQkbSA9IHZvaWQgdW5kZWZpbmVkO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSxcblx0XHRnZXQ6IGZ1bmN0aW9uIChrZXkpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBjb25zaXN0ZW50LXJldHVyblxuXHRcdFx0aWYgKCRtKSB7XG5cdFx0XHRcdHJldHVybiAkbWFwR2V0KCRtLCBrZXkpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0aGFzOiBmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHRpZiAoJG0pIHtcblx0XHRcdFx0cmV0dXJuICRtYXBIYXMoJG0sIGtleSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSxcblx0XHRzZXQ6IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG5cdFx0XHRpZiAoISRtKSB7XG5cdFx0XHRcdC8vIEB0cy1leHBlY3QtZXJyb3IgVFMgY2FuJ3QgaGFuZGxlIG5hcnJvd2luZyBhIHZhcmlhYmxlIGluc2lkZSBhIGNsb3N1cmVcblx0XHRcdFx0JG0gPSBuZXcgJE1hcCgpO1xuXHRcdFx0fVxuXHRcdFx0JG1hcFNldCgkbSwga2V5LCB2YWx1ZSk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIEB0cy1leHBlY3QtZXJyb3IgVE9ETzogZmlndXJlIG91dCB3aHkgVFMgaXMgZXJyb3JpbmcgaGVyZVxuXHRyZXR1cm4gY2hhbm5lbDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBHZXRJbnRyaW5zaWMgPSByZXF1aXJlKCdnZXQtaW50cmluc2ljJyk7XG52YXIgY2FsbEJvdW5kID0gcmVxdWlyZSgnY2FsbC1ib3VuZCcpO1xudmFyIGluc3BlY3QgPSByZXF1aXJlKCdvYmplY3QtaW5zcGVjdCcpO1xudmFyIGdldFNpZGVDaGFubmVsTWFwID0gcmVxdWlyZSgnc2lkZS1jaGFubmVsLW1hcCcpO1xuXG52YXIgJFR5cGVFcnJvciA9IHJlcXVpcmUoJ2VzLWVycm9ycy90eXBlJyk7XG52YXIgJFdlYWtNYXAgPSBHZXRJbnRyaW5zaWMoJyVXZWFrTWFwJScsIHRydWUpO1xuXG4vKiogQHR5cGUgezxLIGV4dGVuZHMgb2JqZWN0LCBWPih0aGlzQXJnOiBXZWFrTWFwPEssIFY+LCBrZXk6IEspID0+IFZ9ICovXG52YXIgJHdlYWtNYXBHZXQgPSBjYWxsQm91bmQoJ1dlYWtNYXAucHJvdG90eXBlLmdldCcsIHRydWUpO1xuLyoqIEB0eXBlIHs8SyBleHRlbmRzIG9iamVjdCwgVj4odGhpc0FyZzogV2Vha01hcDxLLCBWPiwga2V5OiBLLCB2YWx1ZTogVikgPT4gdm9pZH0gKi9cbnZhciAkd2Vha01hcFNldCA9IGNhbGxCb3VuZCgnV2Vha01hcC5wcm90b3R5cGUuc2V0JywgdHJ1ZSk7XG4vKiogQHR5cGUgezxLIGV4dGVuZHMgb2JqZWN0LCBWPih0aGlzQXJnOiBXZWFrTWFwPEssIFY+LCBrZXk6IEspID0+IGJvb2xlYW59ICovXG52YXIgJHdlYWtNYXBIYXMgPSBjYWxsQm91bmQoJ1dlYWtNYXAucHJvdG90eXBlLmhhcycsIHRydWUpO1xuLyoqIEB0eXBlIHs8SyBleHRlbmRzIG9iamVjdCwgVj4odGhpc0FyZzogV2Vha01hcDxLLCBWPiwga2V5OiBLKSA9PiBib29sZWFufSAqL1xudmFyICR3ZWFrTWFwRGVsZXRlID0gY2FsbEJvdW5kKCdXZWFrTWFwLnByb3RvdHlwZS5kZWxldGUnLCB0cnVlKTtcblxuLyoqIEB0eXBlIHtpbXBvcnQoJy4nKX0gKi9cbm1vZHVsZS5leHBvcnRzID0gJFdlYWtNYXBcblx0PyAvKiogQHR5cGUge0V4Y2x1ZGU8aW1wb3J0KCcuJyksIGZhbHNlPn0gKi8gZnVuY3Rpb24gZ2V0U2lkZUNoYW5uZWxXZWFrTWFwKCkge1xuXHRcdC8qKiBAdHlwZWRlZiB7UmV0dXJuVHlwZTx0eXBlb2YgZ2V0U2lkZUNoYW5uZWxXZWFrTWFwPn0gQ2hhbm5lbCAqL1xuXHRcdC8qKiBAdHlwZWRlZiB7UGFyYW1ldGVyczxDaGFubmVsWydnZXQnXT5bMF19IEsgKi9cblx0XHQvKiogQHR5cGVkZWYge1BhcmFtZXRlcnM8Q2hhbm5lbFsnc2V0J10+WzFdfSBWICovXG5cblx0XHQvKiogQHR5cGUge1dlYWtNYXA8SyAmIG9iamVjdCwgVj4gfCB1bmRlZmluZWR9ICovIHZhciAkd207XG5cdFx0LyoqIEB0eXBlIHtDaGFubmVsIHwgdW5kZWZpbmVkfSAqLyB2YXIgJG07XG5cblx0XHQvKiogQHR5cGUge0NoYW5uZWx9ICovXG5cdFx0dmFyIGNoYW5uZWwgPSB7XG5cdFx0XHRhc3NlcnQ6IGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdFx0aWYgKCFjaGFubmVsLmhhcyhrZXkpKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3ICRUeXBlRXJyb3IoJ1NpZGUgY2hhbm5lbCBkb2VzIG5vdCBjb250YWluICcgKyBpbnNwZWN0KGtleSkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0J2RlbGV0ZSc6IGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdFx0aWYgKCRXZWFrTWFwICYmIGtleSAmJiAodHlwZW9mIGtleSA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIGtleSA9PT0gJ2Z1bmN0aW9uJykpIHtcblx0XHRcdFx0XHRpZiAoJHdtKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gJHdlYWtNYXBEZWxldGUoJHdtLCBrZXkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIGlmIChnZXRTaWRlQ2hhbm5lbE1hcCkge1xuXHRcdFx0XHRcdGlmICgkbSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuICRtWydkZWxldGUnXShrZXkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9LFxuXHRcdFx0Z2V0OiBmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHRcdGlmICgkV2Vha01hcCAmJiBrZXkgJiYgKHR5cGVvZiBrZXkgPT09ICdvYmplY3QnIHx8IHR5cGVvZiBrZXkgPT09ICdmdW5jdGlvbicpKSB7XG5cdFx0XHRcdFx0aWYgKCR3bSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuICR3ZWFrTWFwR2V0KCR3bSwga2V5KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuICRtICYmICRtLmdldChrZXkpO1xuXHRcdFx0fSxcblx0XHRcdGhhczogZnVuY3Rpb24gKGtleSkge1xuXHRcdFx0XHRpZiAoJFdlYWtNYXAgJiYga2V5ICYmICh0eXBlb2Yga2V5ID09PSAnb2JqZWN0JyB8fCB0eXBlb2Yga2V5ID09PSAnZnVuY3Rpb24nKSkge1xuXHRcdFx0XHRcdGlmICgkd20pIHtcblx0XHRcdFx0XHRcdHJldHVybiAkd2Vha01hcEhhcygkd20sIGtleSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiAhISRtICYmICRtLmhhcyhrZXkpO1xuXHRcdFx0fSxcblx0XHRcdHNldDogZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcblx0XHRcdFx0aWYgKCRXZWFrTWFwICYmIGtleSAmJiAodHlwZW9mIGtleSA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIGtleSA9PT0gJ2Z1bmN0aW9uJykpIHtcblx0XHRcdFx0XHRpZiAoISR3bSkge1xuXHRcdFx0XHRcdFx0JHdtID0gbmV3ICRXZWFrTWFwKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCR3ZWFrTWFwU2V0KCR3bSwga2V5LCB2YWx1ZSk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoZ2V0U2lkZUNoYW5uZWxNYXApIHtcblx0XHRcdFx0XHRpZiAoISRtKSB7XG5cdFx0XHRcdFx0XHQkbSA9IGdldFNpZGVDaGFubmVsTWFwKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1leHRyYS1wYXJlbnNcblx0XHRcdFx0XHQvKiogQHR5cGUge05vbk51bGxhYmxlPHR5cGVvZiAkbT59ICovICgkbSkuc2V0KGtleSwgdmFsdWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdC8vIEB0cy1leHBlY3QtZXJyb3IgVE9ETzogZmlndXJlIG91dCB3aHkgdGhpcyBpcyBlcnJvcmluZ1xuXHRcdHJldHVybiBjaGFubmVsO1xuXHR9XG5cdDogZ2V0U2lkZUNoYW5uZWxNYXA7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciAkVHlwZUVycm9yID0gcmVxdWlyZSgnZXMtZXJyb3JzL3R5cGUnKTtcbnZhciBpbnNwZWN0ID0gcmVxdWlyZSgnb2JqZWN0LWluc3BlY3QnKTtcbnZhciBnZXRTaWRlQ2hhbm5lbExpc3QgPSByZXF1aXJlKCdzaWRlLWNoYW5uZWwtbGlzdCcpO1xudmFyIGdldFNpZGVDaGFubmVsTWFwID0gcmVxdWlyZSgnc2lkZS1jaGFubmVsLW1hcCcpO1xudmFyIGdldFNpZGVDaGFubmVsV2Vha01hcCA9IHJlcXVpcmUoJ3NpZGUtY2hhbm5lbC13ZWFrbWFwJyk7XG5cbnZhciBtYWtlQ2hhbm5lbCA9IGdldFNpZGVDaGFubmVsV2Vha01hcCB8fCBnZXRTaWRlQ2hhbm5lbE1hcCB8fCBnZXRTaWRlQ2hhbm5lbExpc3Q7XG5cbi8qKiBAdHlwZSB7aW1wb3J0KCcuJyl9ICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldFNpZGVDaGFubmVsKCkge1xuXHQvKiogQHR5cGVkZWYge1JldHVyblR5cGU8dHlwZW9mIGdldFNpZGVDaGFubmVsPn0gQ2hhbm5lbCAqL1xuXG5cdC8qKiBAdHlwZSB7Q2hhbm5lbCB8IHVuZGVmaW5lZH0gKi8gdmFyICRjaGFubmVsRGF0YTtcblxuXHQvKiogQHR5cGUge0NoYW5uZWx9ICovXG5cdHZhciBjaGFubmVsID0ge1xuXHRcdGFzc2VydDogZnVuY3Rpb24gKGtleSkge1xuXHRcdFx0aWYgKCFjaGFubmVsLmhhcyhrZXkpKSB7XG5cdFx0XHRcdHRocm93IG5ldyAkVHlwZUVycm9yKCdTaWRlIGNoYW5uZWwgZG9lcyBub3QgY29udGFpbiAnICsgaW5zcGVjdChrZXkpKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdCdkZWxldGUnOiBmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHRyZXR1cm4gISEkY2hhbm5lbERhdGEgJiYgJGNoYW5uZWxEYXRhWydkZWxldGUnXShrZXkpO1xuXHRcdH0sXG5cdFx0Z2V0OiBmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHRyZXR1cm4gJGNoYW5uZWxEYXRhICYmICRjaGFubmVsRGF0YS5nZXQoa2V5KTtcblx0XHR9LFxuXHRcdGhhczogZnVuY3Rpb24gKGtleSkge1xuXHRcdFx0cmV0dXJuICEhJGNoYW5uZWxEYXRhICYmICRjaGFubmVsRGF0YS5oYXMoa2V5KTtcblx0XHR9LFxuXHRcdHNldDogZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcblx0XHRcdGlmICghJGNoYW5uZWxEYXRhKSB7XG5cdFx0XHRcdCRjaGFubmVsRGF0YSA9IG1ha2VDaGFubmVsKCk7XG5cdFx0XHR9XG5cblx0XHRcdCRjaGFubmVsRGF0YS5zZXQoa2V5LCB2YWx1ZSk7XG5cdFx0fVxuXHR9O1xuXHQvLyBAdHMtZXhwZWN0LWVycm9yIFRPRE86IGZpZ3VyZSBvdXQgd2h5IHRoaXMgaXMgZXJyb3Jpbmdcblx0cmV0dXJuIGNoYW5uZWw7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcmVwbGFjZSA9IFN0cmluZy5wcm90b3R5cGUucmVwbGFjZTtcbnZhciBwZXJjZW50VHdlbnRpZXMgPSAvJTIwL2c7XG5cbnZhciBGb3JtYXQgPSB7XG4gICAgUkZDMTczODogJ1JGQzE3MzgnLFxuICAgIFJGQzM5ODY6ICdSRkMzOTg2J1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgJ2RlZmF1bHQnOiBGb3JtYXQuUkZDMzk4NixcbiAgICBmb3JtYXR0ZXJzOiB7XG4gICAgICAgIFJGQzE3Mzg6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlcGxhY2UuY2FsbCh2YWx1ZSwgcGVyY2VudFR3ZW50aWVzLCAnKycpO1xuICAgICAgICB9LFxuICAgICAgICBSRkMzOTg2OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBTdHJpbmcodmFsdWUpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBSRkMxNzM4OiBGb3JtYXQuUkZDMTczOCxcbiAgICBSRkMzOTg2OiBGb3JtYXQuUkZDMzk4NlxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGZvcm1hdHMgPSByZXF1aXJlKCcuL2Zvcm1hdHMnKTtcblxudmFyIGhhcyA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG5cbnZhciBoZXhUYWJsZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGFycmF5ID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCAyNTY7ICsraSkge1xuICAgICAgICBhcnJheS5wdXNoKCclJyArICgoaSA8IDE2ID8gJzAnIDogJycpICsgaS50b1N0cmluZygxNikpLnRvVXBwZXJDYXNlKCkpO1xuICAgIH1cblxuICAgIHJldHVybiBhcnJheTtcbn0oKSk7XG5cbnZhciBjb21wYWN0UXVldWUgPSBmdW5jdGlvbiBjb21wYWN0UXVldWUocXVldWUpIHtcbiAgICB3aGlsZSAocXVldWUubGVuZ3RoID4gMSkge1xuICAgICAgICB2YXIgaXRlbSA9IHF1ZXVlLnBvcCgpO1xuICAgICAgICB2YXIgb2JqID0gaXRlbS5vYmpbaXRlbS5wcm9wXTtcblxuICAgICAgICBpZiAoaXNBcnJheShvYmopKSB7XG4gICAgICAgICAgICB2YXIgY29tcGFjdGVkID0gW107XG5cbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgb2JqLmxlbmd0aDsgKytqKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvYmpbal0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBhY3RlZC5wdXNoKG9ialtqXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpdGVtLm9ialtpdGVtLnByb3BdID0gY29tcGFjdGVkO1xuICAgICAgICB9XG4gICAgfVxufTtcblxudmFyIGFycmF5VG9PYmplY3QgPSBmdW5jdGlvbiBhcnJheVRvT2JqZWN0KHNvdXJjZSwgb3B0aW9ucykge1xuICAgIHZhciBvYmogPSBvcHRpb25zICYmIG9wdGlvbnMucGxhaW5PYmplY3RzID8geyBfX3Byb3RvX186IG51bGwgfSA6IHt9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc291cmNlLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc291cmNlW2ldICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgb2JqW2ldID0gc291cmNlW2ldO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG9iajtcbn07XG5cbnZhciBtZXJnZSA9IGZ1bmN0aW9uIG1lcmdlKHRhcmdldCwgc291cmNlLCBvcHRpb25zKSB7XG4gICAgLyogZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOiAwICovXG4gICAgaWYgKCFzb3VyY2UpIHtcbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHNvdXJjZSAhPT0gJ29iamVjdCcgJiYgdHlwZW9mIHNvdXJjZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBpZiAoaXNBcnJheSh0YXJnZXQpKSB7XG4gICAgICAgICAgICB0YXJnZXQucHVzaChzb3VyY2UpO1xuICAgICAgICB9IGVsc2UgaWYgKHRhcmdldCAmJiB0eXBlb2YgdGFyZ2V0ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIChvcHRpb25zICYmIChvcHRpb25zLnBsYWluT2JqZWN0cyB8fCBvcHRpb25zLmFsbG93UHJvdG90eXBlcykpXG4gICAgICAgICAgICAgICAgfHwgIWhhcy5jYWxsKE9iamVjdC5wcm90b3R5cGUsIHNvdXJjZSlcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHRhcmdldFtzb3VyY2VdID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBbdGFyZ2V0LCBzb3VyY2VdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG5cbiAgICBpZiAoIXRhcmdldCB8fCB0eXBlb2YgdGFyZ2V0ICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gW3RhcmdldF0uY29uY2F0KHNvdXJjZSk7XG4gICAgfVxuXG4gICAgdmFyIG1lcmdlVGFyZ2V0ID0gdGFyZ2V0O1xuICAgIGlmIChpc0FycmF5KHRhcmdldCkgJiYgIWlzQXJyYXkoc291cmNlKSkge1xuICAgICAgICBtZXJnZVRhcmdldCA9IGFycmF5VG9PYmplY3QodGFyZ2V0LCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICBpZiAoaXNBcnJheSh0YXJnZXQpICYmIGlzQXJyYXkoc291cmNlKSkge1xuICAgICAgICBzb3VyY2UuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaSkge1xuICAgICAgICAgICAgaWYgKGhhcy5jYWxsKHRhcmdldCwgaSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0SXRlbSA9IHRhcmdldFtpXTtcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0SXRlbSAmJiB0eXBlb2YgdGFyZ2V0SXRlbSA9PT0gJ29iamVjdCcgJiYgaXRlbSAmJiB0eXBlb2YgaXRlbSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0W2ldID0gbWVyZ2UodGFyZ2V0SXRlbSwgaXRlbSwgb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRbaV0gPSBpdGVtO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG5cbiAgICByZXR1cm4gT2JqZWN0LmtleXMoc291cmNlKS5yZWR1Y2UoZnVuY3Rpb24gKGFjYywga2V5KSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IHNvdXJjZVtrZXldO1xuXG4gICAgICAgIGlmIChoYXMuY2FsbChhY2MsIGtleSkpIHtcbiAgICAgICAgICAgIGFjY1trZXldID0gbWVyZ2UoYWNjW2tleV0sIHZhbHVlLCBvcHRpb25zKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFjY1trZXldID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCBtZXJnZVRhcmdldCk7XG59O1xuXG52YXIgYXNzaWduID0gZnVuY3Rpb24gYXNzaWduU2luZ2xlU291cmNlKHRhcmdldCwgc291cmNlKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHNvdXJjZSkucmVkdWNlKGZ1bmN0aW9uIChhY2MsIGtleSkge1xuICAgICAgICBhY2Nba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHRhcmdldCk7XG59O1xuXG52YXIgZGVjb2RlID0gZnVuY3Rpb24gKHN0ciwgZGVmYXVsdERlY29kZXIsIGNoYXJzZXQpIHtcbiAgICB2YXIgc3RyV2l0aG91dFBsdXMgPSBzdHIucmVwbGFjZSgvXFwrL2csICcgJyk7XG4gICAgaWYgKGNoYXJzZXQgPT09ICdpc28tODg1OS0xJykge1xuICAgICAgICAvLyB1bmVzY2FwZSBuZXZlciB0aHJvd3MsIG5vIHRyeS4uLmNhdGNoIG5lZWRlZDpcbiAgICAgICAgcmV0dXJuIHN0cldpdGhvdXRQbHVzLnJlcGxhY2UoLyVbMC05YS1mXXsyfS9naSwgdW5lc2NhcGUpO1xuICAgIH1cbiAgICAvLyB1dGYtOFxuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoc3RyV2l0aG91dFBsdXMpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIHN0cldpdGhvdXRQbHVzO1xuICAgIH1cbn07XG5cbnZhciBsaW1pdCA9IDEwMjQ7XG5cbi8qIGVzbGludCBvcGVyYXRvci1saW5lYnJlYWs6IFsyLCBcImJlZm9yZVwiXSAqL1xuXG52YXIgZW5jb2RlID0gZnVuY3Rpb24gZW5jb2RlKHN0ciwgZGVmYXVsdEVuY29kZXIsIGNoYXJzZXQsIGtpbmQsIGZvcm1hdCkge1xuICAgIC8vIFRoaXMgY29kZSB3YXMgb3JpZ2luYWxseSB3cml0dGVuIGJ5IEJyaWFuIFdoaXRlIChtc2NkZXgpIGZvciB0aGUgaW8uanMgY29yZSBxdWVyeXN0cmluZyBsaWJyYXJ5LlxuICAgIC8vIEl0IGhhcyBiZWVuIGFkYXB0ZWQgaGVyZSBmb3Igc3RyaWN0ZXIgYWRoZXJlbmNlIHRvIFJGQyAzOTg2XG4gICAgaWYgKHN0ci5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG5cbiAgICB2YXIgc3RyaW5nID0gc3RyO1xuICAgIGlmICh0eXBlb2Ygc3RyID09PSAnc3ltYm9sJykge1xuICAgICAgICBzdHJpbmcgPSBTeW1ib2wucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoc3RyKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHN0cmluZyA9IFN0cmluZyhzdHIpO1xuICAgIH1cblxuICAgIGlmIChjaGFyc2V0ID09PSAnaXNvLTg4NTktMScpIHtcbiAgICAgICAgcmV0dXJuIGVzY2FwZShzdHJpbmcpLnJlcGxhY2UoLyV1WzAtOWEtZl17NH0vZ2ksIGZ1bmN0aW9uICgkMCkge1xuICAgICAgICAgICAgcmV0dXJuICclMjYlMjMnICsgcGFyc2VJbnQoJDAuc2xpY2UoMiksIDE2KSArICclM0InO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB2YXIgb3V0ID0gJyc7XG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBzdHJpbmcubGVuZ3RoOyBqICs9IGxpbWl0KSB7XG4gICAgICAgIHZhciBzZWdtZW50ID0gc3RyaW5nLmxlbmd0aCA+PSBsaW1pdCA/IHN0cmluZy5zbGljZShqLCBqICsgbGltaXQpIDogc3RyaW5nO1xuICAgICAgICB2YXIgYXJyID0gW107XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWdtZW50Lmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICB2YXIgYyA9IHNlZ21lbnQuY2hhckNvZGVBdChpKTtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBjID09PSAweDJEIC8vIC1cbiAgICAgICAgICAgICAgICB8fCBjID09PSAweDJFIC8vIC5cbiAgICAgICAgICAgICAgICB8fCBjID09PSAweDVGIC8vIF9cbiAgICAgICAgICAgICAgICB8fCBjID09PSAweDdFIC8vIH5cbiAgICAgICAgICAgICAgICB8fCAoYyA+PSAweDMwICYmIGMgPD0gMHgzOSkgLy8gMC05XG4gICAgICAgICAgICAgICAgfHwgKGMgPj0gMHg0MSAmJiBjIDw9IDB4NUEpIC8vIGEtelxuICAgICAgICAgICAgICAgIHx8IChjID49IDB4NjEgJiYgYyA8PSAweDdBKSAvLyBBLVpcbiAgICAgICAgICAgICAgICB8fCAoZm9ybWF0ID09PSBmb3JtYXRzLlJGQzE3MzggJiYgKGMgPT09IDB4MjggfHwgYyA9PT0gMHgyOSkpIC8vICggKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgYXJyW2Fyci5sZW5ndGhdID0gc2VnbWVudC5jaGFyQXQoaSk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjIDwgMHg4MCkge1xuICAgICAgICAgICAgICAgIGFyclthcnIubGVuZ3RoXSA9IGhleFRhYmxlW2NdO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYyA8IDB4ODAwKSB7XG4gICAgICAgICAgICAgICAgYXJyW2Fyci5sZW5ndGhdID0gaGV4VGFibGVbMHhDMCB8IChjID4+IDYpXVxuICAgICAgICAgICAgICAgICAgICArIGhleFRhYmxlWzB4ODAgfCAoYyAmIDB4M0YpXTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGMgPCAweEQ4MDAgfHwgYyA+PSAweEUwMDApIHtcbiAgICAgICAgICAgICAgICBhcnJbYXJyLmxlbmd0aF0gPSBoZXhUYWJsZVsweEUwIHwgKGMgPj4gMTIpXVxuICAgICAgICAgICAgICAgICAgICArIGhleFRhYmxlWzB4ODAgfCAoKGMgPj4gNikgJiAweDNGKV1cbiAgICAgICAgICAgICAgICAgICAgKyBoZXhUYWJsZVsweDgwIHwgKGMgJiAweDNGKV07XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGkgKz0gMTtcbiAgICAgICAgICAgIGMgPSAweDEwMDAwICsgKCgoYyAmIDB4M0ZGKSA8PCAxMCkgfCAoc2VnbWVudC5jaGFyQ29kZUF0KGkpICYgMHgzRkYpKTtcblxuICAgICAgICAgICAgYXJyW2Fyci5sZW5ndGhdID0gaGV4VGFibGVbMHhGMCB8IChjID4+IDE4KV1cbiAgICAgICAgICAgICAgICArIGhleFRhYmxlWzB4ODAgfCAoKGMgPj4gMTIpICYgMHgzRildXG4gICAgICAgICAgICAgICAgKyBoZXhUYWJsZVsweDgwIHwgKChjID4+IDYpICYgMHgzRildXG4gICAgICAgICAgICAgICAgKyBoZXhUYWJsZVsweDgwIHwgKGMgJiAweDNGKV07XG4gICAgICAgIH1cblxuICAgICAgICBvdXQgKz0gYXJyLmpvaW4oJycpO1xuICAgIH1cblxuICAgIHJldHVybiBvdXQ7XG59O1xuXG52YXIgY29tcGFjdCA9IGZ1bmN0aW9uIGNvbXBhY3QodmFsdWUpIHtcbiAgICB2YXIgcXVldWUgPSBbeyBvYmo6IHsgbzogdmFsdWUgfSwgcHJvcDogJ28nIH1dO1xuICAgIHZhciByZWZzID0gW107XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHF1ZXVlLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHZhciBpdGVtID0gcXVldWVbaV07XG4gICAgICAgIHZhciBvYmogPSBpdGVtLm9ialtpdGVtLnByb3BdO1xuXG4gICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBrZXlzLmxlbmd0aDsgKytqKSB7XG4gICAgICAgICAgICB2YXIga2V5ID0ga2V5c1tqXTtcbiAgICAgICAgICAgIHZhciB2YWwgPSBvYmpba2V5XTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsID09PSAnb2JqZWN0JyAmJiB2YWwgIT09IG51bGwgJiYgcmVmcy5pbmRleE9mKHZhbCkgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgcXVldWUucHVzaCh7IG9iajogb2JqLCBwcm9wOiBrZXkgfSk7XG4gICAgICAgICAgICAgICAgcmVmcy5wdXNoKHZhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb21wYWN0UXVldWUocXVldWUpO1xuXG4gICAgcmV0dXJuIHZhbHVlO1xufTtcblxudmFyIGlzUmVnRXhwID0gZnVuY3Rpb24gaXNSZWdFeHAob2JqKSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBSZWdFeHBdJztcbn07XG5cbnZhciBpc0J1ZmZlciA9IGZ1bmN0aW9uIGlzQnVmZmVyKG9iaikge1xuICAgIGlmICghb2JqIHx8IHR5cGVvZiBvYmogIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gISEob2JqLmNvbnN0cnVjdG9yICYmIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlciAmJiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIob2JqKSk7XG59O1xuXG52YXIgY29tYmluZSA9IGZ1bmN0aW9uIGNvbWJpbmUoYSwgYikge1xuICAgIHJldHVybiBbXS5jb25jYXQoYSwgYik7XG59O1xuXG52YXIgbWF5YmVNYXAgPSBmdW5jdGlvbiBtYXliZU1hcCh2YWwsIGZuKSB7XG4gICAgaWYgKGlzQXJyYXkodmFsKSkge1xuICAgICAgICB2YXIgbWFwcGVkID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBtYXBwZWQucHVzaChmbih2YWxbaV0pKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWFwcGVkO1xuICAgIH1cbiAgICByZXR1cm4gZm4odmFsKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGFycmF5VG9PYmplY3Q6IGFycmF5VG9PYmplY3QsXG4gICAgYXNzaWduOiBhc3NpZ24sXG4gICAgY29tYmluZTogY29tYmluZSxcbiAgICBjb21wYWN0OiBjb21wYWN0LFxuICAgIGRlY29kZTogZGVjb2RlLFxuICAgIGVuY29kZTogZW5jb2RlLFxuICAgIGlzQnVmZmVyOiBpc0J1ZmZlcixcbiAgICBpc1JlZ0V4cDogaXNSZWdFeHAsXG4gICAgbWF5YmVNYXA6IG1heWJlTWFwLFxuICAgIG1lcmdlOiBtZXJnZVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdldFNpZGVDaGFubmVsID0gcmVxdWlyZSgnc2lkZS1jaGFubmVsJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG52YXIgZm9ybWF0cyA9IHJlcXVpcmUoJy4vZm9ybWF0cycpO1xudmFyIGhhcyA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbnZhciBhcnJheVByZWZpeEdlbmVyYXRvcnMgPSB7XG4gICAgYnJhY2tldHM6IGZ1bmN0aW9uIGJyYWNrZXRzKHByZWZpeCkge1xuICAgICAgICByZXR1cm4gcHJlZml4ICsgJ1tdJztcbiAgICB9LFxuICAgIGNvbW1hOiAnY29tbWEnLFxuICAgIGluZGljZXM6IGZ1bmN0aW9uIGluZGljZXMocHJlZml4LCBrZXkpIHtcbiAgICAgICAgcmV0dXJuIHByZWZpeCArICdbJyArIGtleSArICddJztcbiAgICB9LFxuICAgIHJlcGVhdDogZnVuY3Rpb24gcmVwZWF0KHByZWZpeCkge1xuICAgICAgICByZXR1cm4gcHJlZml4O1xuICAgIH1cbn07XG5cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcbnZhciBwdXNoID0gQXJyYXkucHJvdG90eXBlLnB1c2g7XG52YXIgcHVzaFRvQXJyYXkgPSBmdW5jdGlvbiAoYXJyLCB2YWx1ZU9yQXJyYXkpIHtcbiAgICBwdXNoLmFwcGx5KGFyciwgaXNBcnJheSh2YWx1ZU9yQXJyYXkpID8gdmFsdWVPckFycmF5IDogW3ZhbHVlT3JBcnJheV0pO1xufTtcblxudmFyIHRvSVNPID0gRGF0ZS5wcm90b3R5cGUudG9JU09TdHJpbmc7XG5cbnZhciBkZWZhdWx0Rm9ybWF0ID0gZm9ybWF0c1snZGVmYXVsdCddO1xudmFyIGRlZmF1bHRzID0ge1xuICAgIGFkZFF1ZXJ5UHJlZml4OiBmYWxzZSxcbiAgICBhbGxvd0RvdHM6IGZhbHNlLFxuICAgIGFsbG93RW1wdHlBcnJheXM6IGZhbHNlLFxuICAgIGFycmF5Rm9ybWF0OiAnaW5kaWNlcycsXG4gICAgY2hhcnNldDogJ3V0Zi04JyxcbiAgICBjaGFyc2V0U2VudGluZWw6IGZhbHNlLFxuICAgIGNvbW1hUm91bmRUcmlwOiBmYWxzZSxcbiAgICBkZWxpbWl0ZXI6ICcmJyxcbiAgICBlbmNvZGU6IHRydWUsXG4gICAgZW5jb2RlRG90SW5LZXlzOiBmYWxzZSxcbiAgICBlbmNvZGVyOiB1dGlscy5lbmNvZGUsXG4gICAgZW5jb2RlVmFsdWVzT25seTogZmFsc2UsXG4gICAgZmlsdGVyOiB2b2lkIHVuZGVmaW5lZCxcbiAgICBmb3JtYXQ6IGRlZmF1bHRGb3JtYXQsXG4gICAgZm9ybWF0dGVyOiBmb3JtYXRzLmZvcm1hdHRlcnNbZGVmYXVsdEZvcm1hdF0sXG4gICAgLy8gZGVwcmVjYXRlZFxuICAgIGluZGljZXM6IGZhbHNlLFxuICAgIHNlcmlhbGl6ZURhdGU6IGZ1bmN0aW9uIHNlcmlhbGl6ZURhdGUoZGF0ZSkge1xuICAgICAgICByZXR1cm4gdG9JU08uY2FsbChkYXRlKTtcbiAgICB9LFxuICAgIHNraXBOdWxsczogZmFsc2UsXG4gICAgc3RyaWN0TnVsbEhhbmRsaW5nOiBmYWxzZVxufTtcblxudmFyIGlzTm9uTnVsbGlzaFByaW1pdGl2ZSA9IGZ1bmN0aW9uIGlzTm9uTnVsbGlzaFByaW1pdGl2ZSh2KSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2ID09PSAnc3RyaW5nJ1xuICAgICAgICB8fCB0eXBlb2YgdiA9PT0gJ251bWJlcidcbiAgICAgICAgfHwgdHlwZW9mIHYgPT09ICdib29sZWFuJ1xuICAgICAgICB8fCB0eXBlb2YgdiA9PT0gJ3N5bWJvbCdcbiAgICAgICAgfHwgdHlwZW9mIHYgPT09ICdiaWdpbnQnO1xufTtcblxudmFyIHNlbnRpbmVsID0ge307XG5cbnZhciBzdHJpbmdpZnkgPSBmdW5jdGlvbiBzdHJpbmdpZnkoXG4gICAgb2JqZWN0LFxuICAgIHByZWZpeCxcbiAgICBnZW5lcmF0ZUFycmF5UHJlZml4LFxuICAgIGNvbW1hUm91bmRUcmlwLFxuICAgIGFsbG93RW1wdHlBcnJheXMsXG4gICAgc3RyaWN0TnVsbEhhbmRsaW5nLFxuICAgIHNraXBOdWxscyxcbiAgICBlbmNvZGVEb3RJbktleXMsXG4gICAgZW5jb2RlcixcbiAgICBmaWx0ZXIsXG4gICAgc29ydCxcbiAgICBhbGxvd0RvdHMsXG4gICAgc2VyaWFsaXplRGF0ZSxcbiAgICBmb3JtYXQsXG4gICAgZm9ybWF0dGVyLFxuICAgIGVuY29kZVZhbHVlc09ubHksXG4gICAgY2hhcnNldCxcbiAgICBzaWRlQ2hhbm5lbFxuKSB7XG4gICAgdmFyIG9iaiA9IG9iamVjdDtcblxuICAgIHZhciB0bXBTYyA9IHNpZGVDaGFubmVsO1xuICAgIHZhciBzdGVwID0gMDtcbiAgICB2YXIgZmluZEZsYWcgPSBmYWxzZTtcbiAgICB3aGlsZSAoKHRtcFNjID0gdG1wU2MuZ2V0KHNlbnRpbmVsKSkgIT09IHZvaWQgdW5kZWZpbmVkICYmICFmaW5kRmxhZykge1xuICAgICAgICAvLyBXaGVyZSBvYmplY3QgbGFzdCBhcHBlYXJlZCBpbiB0aGUgcmVmIHRyZWVcbiAgICAgICAgdmFyIHBvcyA9IHRtcFNjLmdldChvYmplY3QpO1xuICAgICAgICBzdGVwICs9IDE7XG4gICAgICAgIGlmICh0eXBlb2YgcG9zICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgaWYgKHBvcyA9PT0gc3RlcCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdDeWNsaWMgb2JqZWN0IHZhbHVlJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZpbmRGbGFnID0gdHJ1ZTsgLy8gQnJlYWsgd2hpbGVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIHRtcFNjLmdldChzZW50aW5lbCkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBzdGVwID0gMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0eXBlb2YgZmlsdGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIG9iaiA9IGZpbHRlcihwcmVmaXgsIG9iaik7XG4gICAgfSBlbHNlIGlmIChvYmogaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgIG9iaiA9IHNlcmlhbGl6ZURhdGUob2JqKTtcbiAgICB9IGVsc2UgaWYgKGdlbmVyYXRlQXJyYXlQcmVmaXggPT09ICdjb21tYScgJiYgaXNBcnJheShvYmopKSB7XG4gICAgICAgIG9iaiA9IHV0aWxzLm1heWJlTWFwKG9iaiwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlcmlhbGl6ZURhdGUodmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAob2JqID09PSBudWxsKSB7XG4gICAgICAgIGlmIChzdHJpY3ROdWxsSGFuZGxpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBlbmNvZGVyICYmICFlbmNvZGVWYWx1ZXNPbmx5ID8gZW5jb2RlcihwcmVmaXgsIGRlZmF1bHRzLmVuY29kZXIsIGNoYXJzZXQsICdrZXknLCBmb3JtYXQpIDogcHJlZml4O1xuICAgICAgICB9XG5cbiAgICAgICAgb2JqID0gJyc7XG4gICAgfVxuXG4gICAgaWYgKGlzTm9uTnVsbGlzaFByaW1pdGl2ZShvYmopIHx8IHV0aWxzLmlzQnVmZmVyKG9iaikpIHtcbiAgICAgICAgaWYgKGVuY29kZXIpIHtcbiAgICAgICAgICAgIHZhciBrZXlWYWx1ZSA9IGVuY29kZVZhbHVlc09ubHkgPyBwcmVmaXggOiBlbmNvZGVyKHByZWZpeCwgZGVmYXVsdHMuZW5jb2RlciwgY2hhcnNldCwgJ2tleScsIGZvcm1hdCk7XG4gICAgICAgICAgICByZXR1cm4gW2Zvcm1hdHRlcihrZXlWYWx1ZSkgKyAnPScgKyBmb3JtYXR0ZXIoZW5jb2RlcihvYmosIGRlZmF1bHRzLmVuY29kZXIsIGNoYXJzZXQsICd2YWx1ZScsIGZvcm1hdCkpXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW2Zvcm1hdHRlcihwcmVmaXgpICsgJz0nICsgZm9ybWF0dGVyKFN0cmluZyhvYmopKV07XG4gICAgfVxuXG4gICAgdmFyIHZhbHVlcyA9IFtdO1xuXG4gICAgaWYgKHR5cGVvZiBvYmogPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZXM7XG4gICAgfVxuXG4gICAgdmFyIG9iaktleXM7XG4gICAgaWYgKGdlbmVyYXRlQXJyYXlQcmVmaXggPT09ICdjb21tYScgJiYgaXNBcnJheShvYmopKSB7XG4gICAgICAgIC8vIHdlIG5lZWQgdG8gam9pbiBlbGVtZW50cyBpblxuICAgICAgICBpZiAoZW5jb2RlVmFsdWVzT25seSAmJiBlbmNvZGVyKSB7XG4gICAgICAgICAgICBvYmogPSB1dGlscy5tYXliZU1hcChvYmosIGVuY29kZXIpO1xuICAgICAgICB9XG4gICAgICAgIG9iaktleXMgPSBbeyB2YWx1ZTogb2JqLmxlbmd0aCA+IDAgPyBvYmouam9pbignLCcpIHx8IG51bGwgOiB2b2lkIHVuZGVmaW5lZCB9XTtcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXkoZmlsdGVyKSkge1xuICAgICAgICBvYmpLZXlzID0gZmlsdGVyO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcbiAgICAgICAgb2JqS2V5cyA9IHNvcnQgPyBrZXlzLnNvcnQoc29ydCkgOiBrZXlzO1xuICAgIH1cblxuICAgIHZhciBlbmNvZGVkUHJlZml4ID0gZW5jb2RlRG90SW5LZXlzID8gU3RyaW5nKHByZWZpeCkucmVwbGFjZSgvXFwuL2csICclMkUnKSA6IFN0cmluZyhwcmVmaXgpO1xuXG4gICAgdmFyIGFkanVzdGVkUHJlZml4ID0gY29tbWFSb3VuZFRyaXAgJiYgaXNBcnJheShvYmopICYmIG9iai5sZW5ndGggPT09IDEgPyBlbmNvZGVkUHJlZml4ICsgJ1tdJyA6IGVuY29kZWRQcmVmaXg7XG5cbiAgICBpZiAoYWxsb3dFbXB0eUFycmF5cyAmJiBpc0FycmF5KG9iaikgJiYgb2JqLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gYWRqdXN0ZWRQcmVmaXggKyAnW10nO1xuICAgIH1cblxuICAgIGZvciAodmFyIGogPSAwOyBqIDwgb2JqS2V5cy5sZW5ndGg7ICsraikge1xuICAgICAgICB2YXIga2V5ID0gb2JqS2V5c1tqXTtcbiAgICAgICAgdmFyIHZhbHVlID0gdHlwZW9mIGtleSA9PT0gJ29iamVjdCcgJiYga2V5ICYmIHR5cGVvZiBrZXkudmFsdWUgIT09ICd1bmRlZmluZWQnXG4gICAgICAgICAgICA/IGtleS52YWx1ZVxuICAgICAgICAgICAgOiBvYmpba2V5XTtcblxuICAgICAgICBpZiAoc2tpcE51bGxzICYmIHZhbHVlID09PSBudWxsKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBlbmNvZGVkS2V5ID0gYWxsb3dEb3RzICYmIGVuY29kZURvdEluS2V5cyA/IFN0cmluZyhrZXkpLnJlcGxhY2UoL1xcLi9nLCAnJTJFJykgOiBTdHJpbmcoa2V5KTtcbiAgICAgICAgdmFyIGtleVByZWZpeCA9IGlzQXJyYXkob2JqKVxuICAgICAgICAgICAgPyB0eXBlb2YgZ2VuZXJhdGVBcnJheVByZWZpeCA9PT0gJ2Z1bmN0aW9uJyA/IGdlbmVyYXRlQXJyYXlQcmVmaXgoYWRqdXN0ZWRQcmVmaXgsIGVuY29kZWRLZXkpIDogYWRqdXN0ZWRQcmVmaXhcbiAgICAgICAgICAgIDogYWRqdXN0ZWRQcmVmaXggKyAoYWxsb3dEb3RzID8gJy4nICsgZW5jb2RlZEtleSA6ICdbJyArIGVuY29kZWRLZXkgKyAnXScpO1xuXG4gICAgICAgIHNpZGVDaGFubmVsLnNldChvYmplY3QsIHN0ZXApO1xuICAgICAgICB2YXIgdmFsdWVTaWRlQ2hhbm5lbCA9IGdldFNpZGVDaGFubmVsKCk7XG4gICAgICAgIHZhbHVlU2lkZUNoYW5uZWwuc2V0KHNlbnRpbmVsLCBzaWRlQ2hhbm5lbCk7XG4gICAgICAgIHB1c2hUb0FycmF5KHZhbHVlcywgc3RyaW5naWZ5KFxuICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICBrZXlQcmVmaXgsXG4gICAgICAgICAgICBnZW5lcmF0ZUFycmF5UHJlZml4LFxuICAgICAgICAgICAgY29tbWFSb3VuZFRyaXAsXG4gICAgICAgICAgICBhbGxvd0VtcHR5QXJyYXlzLFxuICAgICAgICAgICAgc3RyaWN0TnVsbEhhbmRsaW5nLFxuICAgICAgICAgICAgc2tpcE51bGxzLFxuICAgICAgICAgICAgZW5jb2RlRG90SW5LZXlzLFxuICAgICAgICAgICAgZ2VuZXJhdGVBcnJheVByZWZpeCA9PT0gJ2NvbW1hJyAmJiBlbmNvZGVWYWx1ZXNPbmx5ICYmIGlzQXJyYXkob2JqKSA/IG51bGwgOiBlbmNvZGVyLFxuICAgICAgICAgICAgZmlsdGVyLFxuICAgICAgICAgICAgc29ydCxcbiAgICAgICAgICAgIGFsbG93RG90cyxcbiAgICAgICAgICAgIHNlcmlhbGl6ZURhdGUsXG4gICAgICAgICAgICBmb3JtYXQsXG4gICAgICAgICAgICBmb3JtYXR0ZXIsXG4gICAgICAgICAgICBlbmNvZGVWYWx1ZXNPbmx5LFxuICAgICAgICAgICAgY2hhcnNldCxcbiAgICAgICAgICAgIHZhbHVlU2lkZUNoYW5uZWxcbiAgICAgICAgKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlcztcbn07XG5cbnZhciBub3JtYWxpemVTdHJpbmdpZnlPcHRpb25zID0gZnVuY3Rpb24gbm9ybWFsaXplU3RyaW5naWZ5T3B0aW9ucyhvcHRzKSB7XG4gICAgaWYgKCFvcHRzKSB7XG4gICAgICAgIHJldHVybiBkZWZhdWx0cztcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG9wdHMuYWxsb3dFbXB0eUFycmF5cyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG9wdHMuYWxsb3dFbXB0eUFycmF5cyAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2BhbGxvd0VtcHR5QXJyYXlzYCBvcHRpb24gY2FuIG9ubHkgYmUgYHRydWVgIG9yIGBmYWxzZWAsIHdoZW4gcHJvdmlkZWQnKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG9wdHMuZW5jb2RlRG90SW5LZXlzICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygb3B0cy5lbmNvZGVEb3RJbktleXMgIT09ICdib29sZWFuJykge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdgZW5jb2RlRG90SW5LZXlzYCBvcHRpb24gY2FuIG9ubHkgYmUgYHRydWVgIG9yIGBmYWxzZWAsIHdoZW4gcHJvdmlkZWQnKTtcbiAgICB9XG5cbiAgICBpZiAob3B0cy5lbmNvZGVyICE9PSBudWxsICYmIHR5cGVvZiBvcHRzLmVuY29kZXIgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBvcHRzLmVuY29kZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRW5jb2RlciBoYXMgdG8gYmUgYSBmdW5jdGlvbi4nKTtcbiAgICB9XG5cbiAgICB2YXIgY2hhcnNldCA9IG9wdHMuY2hhcnNldCB8fCBkZWZhdWx0cy5jaGFyc2V0O1xuICAgIGlmICh0eXBlb2Ygb3B0cy5jaGFyc2V0ICE9PSAndW5kZWZpbmVkJyAmJiBvcHRzLmNoYXJzZXQgIT09ICd1dGYtOCcgJiYgb3B0cy5jaGFyc2V0ICE9PSAnaXNvLTg4NTktMScpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIGNoYXJzZXQgb3B0aW9uIG11c3QgYmUgZWl0aGVyIHV0Zi04LCBpc28tODg1OS0xLCBvciB1bmRlZmluZWQnKTtcbiAgICB9XG5cbiAgICB2YXIgZm9ybWF0ID0gZm9ybWF0c1snZGVmYXVsdCddO1xuICAgIGlmICh0eXBlb2Ygb3B0cy5mb3JtYXQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGlmICghaGFzLmNhbGwoZm9ybWF0cy5mb3JtYXR0ZXJzLCBvcHRzLmZvcm1hdCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZm9ybWF0IG9wdGlvbiBwcm92aWRlZC4nKTtcbiAgICAgICAgfVxuICAgICAgICBmb3JtYXQgPSBvcHRzLmZvcm1hdDtcbiAgICB9XG4gICAgdmFyIGZvcm1hdHRlciA9IGZvcm1hdHMuZm9ybWF0dGVyc1tmb3JtYXRdO1xuXG4gICAgdmFyIGZpbHRlciA9IGRlZmF1bHRzLmZpbHRlcjtcbiAgICBpZiAodHlwZW9mIG9wdHMuZmlsdGVyID09PSAnZnVuY3Rpb24nIHx8IGlzQXJyYXkob3B0cy5maWx0ZXIpKSB7XG4gICAgICAgIGZpbHRlciA9IG9wdHMuZmlsdGVyO1xuICAgIH1cblxuICAgIHZhciBhcnJheUZvcm1hdDtcbiAgICBpZiAob3B0cy5hcnJheUZvcm1hdCBpbiBhcnJheVByZWZpeEdlbmVyYXRvcnMpIHtcbiAgICAgICAgYXJyYXlGb3JtYXQgPSBvcHRzLmFycmF5Rm9ybWF0O1xuICAgIH0gZWxzZSBpZiAoJ2luZGljZXMnIGluIG9wdHMpIHtcbiAgICAgICAgYXJyYXlGb3JtYXQgPSBvcHRzLmluZGljZXMgPyAnaW5kaWNlcycgOiAncmVwZWF0JztcbiAgICB9IGVsc2Uge1xuICAgICAgICBhcnJheUZvcm1hdCA9IGRlZmF1bHRzLmFycmF5Rm9ybWF0O1xuICAgIH1cblxuICAgIGlmICgnY29tbWFSb3VuZFRyaXAnIGluIG9wdHMgJiYgdHlwZW9mIG9wdHMuY29tbWFSb3VuZFRyaXAgIT09ICdib29sZWFuJykge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdgY29tbWFSb3VuZFRyaXBgIG11c3QgYmUgYSBib29sZWFuLCBvciBhYnNlbnQnKTtcbiAgICB9XG5cbiAgICB2YXIgYWxsb3dEb3RzID0gdHlwZW9mIG9wdHMuYWxsb3dEb3RzID09PSAndW5kZWZpbmVkJyA/IG9wdHMuZW5jb2RlRG90SW5LZXlzID09PSB0cnVlID8gdHJ1ZSA6IGRlZmF1bHRzLmFsbG93RG90cyA6ICEhb3B0cy5hbGxvd0RvdHM7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBhZGRRdWVyeVByZWZpeDogdHlwZW9mIG9wdHMuYWRkUXVlcnlQcmVmaXggPT09ICdib29sZWFuJyA/IG9wdHMuYWRkUXVlcnlQcmVmaXggOiBkZWZhdWx0cy5hZGRRdWVyeVByZWZpeCxcbiAgICAgICAgYWxsb3dEb3RzOiBhbGxvd0RvdHMsXG4gICAgICAgIGFsbG93RW1wdHlBcnJheXM6IHR5cGVvZiBvcHRzLmFsbG93RW1wdHlBcnJheXMgPT09ICdib29sZWFuJyA/ICEhb3B0cy5hbGxvd0VtcHR5QXJyYXlzIDogZGVmYXVsdHMuYWxsb3dFbXB0eUFycmF5cyxcbiAgICAgICAgYXJyYXlGb3JtYXQ6IGFycmF5Rm9ybWF0LFxuICAgICAgICBjaGFyc2V0OiBjaGFyc2V0LFxuICAgICAgICBjaGFyc2V0U2VudGluZWw6IHR5cGVvZiBvcHRzLmNoYXJzZXRTZW50aW5lbCA9PT0gJ2Jvb2xlYW4nID8gb3B0cy5jaGFyc2V0U2VudGluZWwgOiBkZWZhdWx0cy5jaGFyc2V0U2VudGluZWwsXG4gICAgICAgIGNvbW1hUm91bmRUcmlwOiAhIW9wdHMuY29tbWFSb3VuZFRyaXAsXG4gICAgICAgIGRlbGltaXRlcjogdHlwZW9mIG9wdHMuZGVsaW1pdGVyID09PSAndW5kZWZpbmVkJyA/IGRlZmF1bHRzLmRlbGltaXRlciA6IG9wdHMuZGVsaW1pdGVyLFxuICAgICAgICBlbmNvZGU6IHR5cGVvZiBvcHRzLmVuY29kZSA9PT0gJ2Jvb2xlYW4nID8gb3B0cy5lbmNvZGUgOiBkZWZhdWx0cy5lbmNvZGUsXG4gICAgICAgIGVuY29kZURvdEluS2V5czogdHlwZW9mIG9wdHMuZW5jb2RlRG90SW5LZXlzID09PSAnYm9vbGVhbicgPyBvcHRzLmVuY29kZURvdEluS2V5cyA6IGRlZmF1bHRzLmVuY29kZURvdEluS2V5cyxcbiAgICAgICAgZW5jb2RlcjogdHlwZW9mIG9wdHMuZW5jb2RlciA9PT0gJ2Z1bmN0aW9uJyA/IG9wdHMuZW5jb2RlciA6IGRlZmF1bHRzLmVuY29kZXIsXG4gICAgICAgIGVuY29kZVZhbHVlc09ubHk6IHR5cGVvZiBvcHRzLmVuY29kZVZhbHVlc09ubHkgPT09ICdib29sZWFuJyA/IG9wdHMuZW5jb2RlVmFsdWVzT25seSA6IGRlZmF1bHRzLmVuY29kZVZhbHVlc09ubHksXG4gICAgICAgIGZpbHRlcjogZmlsdGVyLFxuICAgICAgICBmb3JtYXQ6IGZvcm1hdCxcbiAgICAgICAgZm9ybWF0dGVyOiBmb3JtYXR0ZXIsXG4gICAgICAgIHNlcmlhbGl6ZURhdGU6IHR5cGVvZiBvcHRzLnNlcmlhbGl6ZURhdGUgPT09ICdmdW5jdGlvbicgPyBvcHRzLnNlcmlhbGl6ZURhdGUgOiBkZWZhdWx0cy5zZXJpYWxpemVEYXRlLFxuICAgICAgICBza2lwTnVsbHM6IHR5cGVvZiBvcHRzLnNraXBOdWxscyA9PT0gJ2Jvb2xlYW4nID8gb3B0cy5za2lwTnVsbHMgOiBkZWZhdWx0cy5za2lwTnVsbHMsXG4gICAgICAgIHNvcnQ6IHR5cGVvZiBvcHRzLnNvcnQgPT09ICdmdW5jdGlvbicgPyBvcHRzLnNvcnQgOiBudWxsLFxuICAgICAgICBzdHJpY3ROdWxsSGFuZGxpbmc6IHR5cGVvZiBvcHRzLnN0cmljdE51bGxIYW5kbGluZyA9PT0gJ2Jvb2xlYW4nID8gb3B0cy5zdHJpY3ROdWxsSGFuZGxpbmcgOiBkZWZhdWx0cy5zdHJpY3ROdWxsSGFuZGxpbmdcbiAgICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqZWN0LCBvcHRzKSB7XG4gICAgdmFyIG9iaiA9IG9iamVjdDtcbiAgICB2YXIgb3B0aW9ucyA9IG5vcm1hbGl6ZVN0cmluZ2lmeU9wdGlvbnMob3B0cyk7XG5cbiAgICB2YXIgb2JqS2V5cztcbiAgICB2YXIgZmlsdGVyO1xuXG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLmZpbHRlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBmaWx0ZXIgPSBvcHRpb25zLmZpbHRlcjtcbiAgICAgICAgb2JqID0gZmlsdGVyKCcnLCBvYmopO1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheShvcHRpb25zLmZpbHRlcikpIHtcbiAgICAgICAgZmlsdGVyID0gb3B0aW9ucy5maWx0ZXI7XG4gICAgICAgIG9iaktleXMgPSBmaWx0ZXI7XG4gICAgfVxuXG4gICAgdmFyIGtleXMgPSBbXTtcblxuICAgIGlmICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0JyB8fCBvYmogPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIHZhciBnZW5lcmF0ZUFycmF5UHJlZml4ID0gYXJyYXlQcmVmaXhHZW5lcmF0b3JzW29wdGlvbnMuYXJyYXlGb3JtYXRdO1xuICAgIHZhciBjb21tYVJvdW5kVHJpcCA9IGdlbmVyYXRlQXJyYXlQcmVmaXggPT09ICdjb21tYScgJiYgb3B0aW9ucy5jb21tYVJvdW5kVHJpcDtcblxuICAgIGlmICghb2JqS2V5cykge1xuICAgICAgICBvYmpLZXlzID0gT2JqZWN0LmtleXMob2JqKTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5zb3J0KSB7XG4gICAgICAgIG9iaktleXMuc29ydChvcHRpb25zLnNvcnQpO1xuICAgIH1cblxuICAgIHZhciBzaWRlQ2hhbm5lbCA9IGdldFNpZGVDaGFubmVsKCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmpLZXlzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHZhciBrZXkgPSBvYmpLZXlzW2ldO1xuICAgICAgICB2YXIgdmFsdWUgPSBvYmpba2V5XTtcblxuICAgICAgICBpZiAob3B0aW9ucy5za2lwTnVsbHMgJiYgdmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHB1c2hUb0FycmF5KGtleXMsIHN0cmluZ2lmeShcbiAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAga2V5LFxuICAgICAgICAgICAgZ2VuZXJhdGVBcnJheVByZWZpeCxcbiAgICAgICAgICAgIGNvbW1hUm91bmRUcmlwLFxuICAgICAgICAgICAgb3B0aW9ucy5hbGxvd0VtcHR5QXJyYXlzLFxuICAgICAgICAgICAgb3B0aW9ucy5zdHJpY3ROdWxsSGFuZGxpbmcsXG4gICAgICAgICAgICBvcHRpb25zLnNraXBOdWxscyxcbiAgICAgICAgICAgIG9wdGlvbnMuZW5jb2RlRG90SW5LZXlzLFxuICAgICAgICAgICAgb3B0aW9ucy5lbmNvZGUgPyBvcHRpb25zLmVuY29kZXIgOiBudWxsLFxuICAgICAgICAgICAgb3B0aW9ucy5maWx0ZXIsXG4gICAgICAgICAgICBvcHRpb25zLnNvcnQsXG4gICAgICAgICAgICBvcHRpb25zLmFsbG93RG90cyxcbiAgICAgICAgICAgIG9wdGlvbnMuc2VyaWFsaXplRGF0ZSxcbiAgICAgICAgICAgIG9wdGlvbnMuZm9ybWF0LFxuICAgICAgICAgICAgb3B0aW9ucy5mb3JtYXR0ZXIsXG4gICAgICAgICAgICBvcHRpb25zLmVuY29kZVZhbHVlc09ubHksXG4gICAgICAgICAgICBvcHRpb25zLmNoYXJzZXQsXG4gICAgICAgICAgICBzaWRlQ2hhbm5lbFxuICAgICAgICApKTtcbiAgICB9XG5cbiAgICB2YXIgam9pbmVkID0ga2V5cy5qb2luKG9wdGlvbnMuZGVsaW1pdGVyKTtcbiAgICB2YXIgcHJlZml4ID0gb3B0aW9ucy5hZGRRdWVyeVByZWZpeCA9PT0gdHJ1ZSA/ICc/JyA6ICcnO1xuXG4gICAgaWYgKG9wdGlvbnMuY2hhcnNldFNlbnRpbmVsKSB7XG4gICAgICAgIGlmIChvcHRpb25zLmNoYXJzZXQgPT09ICdpc28tODg1OS0xJykge1xuICAgICAgICAgICAgLy8gZW5jb2RlVVJJQ29tcG9uZW50KCcmIzEwMDAzOycpLCB0aGUgXCJudW1lcmljIGVudGl0eVwiIHJlcHJlc2VudGF0aW9uIG9mIGEgY2hlY2ttYXJrXG4gICAgICAgICAgICBwcmVmaXggKz0gJ3V0Zjg9JTI2JTIzMTAwMDMlM0ImJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGVuY29kZVVSSUNvbXBvbmVudCgn4pyTJylcbiAgICAgICAgICAgIHByZWZpeCArPSAndXRmOD0lRTIlOUMlOTMmJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBqb2luZWQubGVuZ3RoID4gMCA/IHByZWZpeCArIGpvaW5lZCA6ICcnO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG52YXIgaGFzID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcblxudmFyIGRlZmF1bHRzID0ge1xuICAgIGFsbG93RG90czogZmFsc2UsXG4gICAgYWxsb3dFbXB0eUFycmF5czogZmFsc2UsXG4gICAgYWxsb3dQcm90b3R5cGVzOiBmYWxzZSxcbiAgICBhbGxvd1NwYXJzZTogZmFsc2UsXG4gICAgYXJyYXlMaW1pdDogMjAsXG4gICAgY2hhcnNldDogJ3V0Zi04JyxcbiAgICBjaGFyc2V0U2VudGluZWw6IGZhbHNlLFxuICAgIGNvbW1hOiBmYWxzZSxcbiAgICBkZWNvZGVEb3RJbktleXM6IGZhbHNlLFxuICAgIGRlY29kZXI6IHV0aWxzLmRlY29kZSxcbiAgICBkZWxpbWl0ZXI6ICcmJyxcbiAgICBkZXB0aDogNSxcbiAgICBkdXBsaWNhdGVzOiAnY29tYmluZScsXG4gICAgaWdub3JlUXVlcnlQcmVmaXg6IGZhbHNlLFxuICAgIGludGVycHJldE51bWVyaWNFbnRpdGllczogZmFsc2UsXG4gICAgcGFyYW1ldGVyTGltaXQ6IDEwMDAsXG4gICAgcGFyc2VBcnJheXM6IHRydWUsXG4gICAgcGxhaW5PYmplY3RzOiBmYWxzZSxcbiAgICBzdHJpY3REZXB0aDogZmFsc2UsXG4gICAgc3RyaWN0TnVsbEhhbmRsaW5nOiBmYWxzZSxcbiAgICB0aHJvd09uTGltaXRFeGNlZWRlZDogZmFsc2Vcbn07XG5cbnZhciBpbnRlcnByZXROdW1lcmljRW50aXRpZXMgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC8mIyhcXGQrKTsvZywgZnVuY3Rpb24gKCQwLCBudW1iZXJTdHIpIHtcbiAgICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUocGFyc2VJbnQobnVtYmVyU3RyLCAxMCkpO1xuICAgIH0pO1xufTtcblxudmFyIHBhcnNlQXJyYXlWYWx1ZSA9IGZ1bmN0aW9uICh2YWwsIG9wdGlvbnMsIGN1cnJlbnRBcnJheUxlbmd0aCkge1xuICAgIGlmICh2YWwgJiYgdHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgJiYgb3B0aW9ucy5jb21tYSAmJiB2YWwuaW5kZXhPZignLCcpID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIHZhbC5zcGxpdCgnLCcpO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnRocm93T25MaW1pdEV4Y2VlZGVkICYmIGN1cnJlbnRBcnJheUxlbmd0aCA+PSBvcHRpb25zLmFycmF5TGltaXQpIHtcbiAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0FycmF5IGxpbWl0IGV4Y2VlZGVkLiBPbmx5ICcgKyBvcHRpb25zLmFycmF5TGltaXQgKyAnIGVsZW1lbnQnICsgKG9wdGlvbnMuYXJyYXlMaW1pdCA9PT0gMSA/ICcnIDogJ3MnKSArICcgYWxsb3dlZCBpbiBhbiBhcnJheS4nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsO1xufTtcblxuLy8gVGhpcyBpcyB3aGF0IGJyb3dzZXJzIHdpbGwgc3VibWl0IHdoZW4gdGhlIOKckyBjaGFyYWN0ZXIgb2NjdXJzIGluIGFuXG4vLyBhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQgYm9keSBhbmQgdGhlIGVuY29kaW5nIG9mIHRoZSBwYWdlIGNvbnRhaW5pbmdcbi8vIHRoZSBmb3JtIGlzIGlzby04ODU5LTEsIG9yIHdoZW4gdGhlIHN1Ym1pdHRlZCBmb3JtIGhhcyBhbiBhY2NlcHQtY2hhcnNldFxuLy8gYXR0cmlidXRlIG9mIGlzby04ODU5LTEuIFByZXN1bWFibHkgYWxzbyB3aXRoIG90aGVyIGNoYXJzZXRzIHRoYXQgZG8gbm90IGNvbnRhaW5cbi8vIHRoZSDinJMgY2hhcmFjdGVyLCBzdWNoIGFzIHVzLWFzY2lpLlxudmFyIGlzb1NlbnRpbmVsID0gJ3V0Zjg9JTI2JTIzMTAwMDMlM0InOyAvLyBlbmNvZGVVUklDb21wb25lbnQoJyYjMTAwMDM7JylcblxuLy8gVGhlc2UgYXJlIHRoZSBwZXJjZW50LWVuY29kZWQgdXRmLTggb2N0ZXRzIHJlcHJlc2VudGluZyBhIGNoZWNrbWFyaywgaW5kaWNhdGluZyB0aGF0IHRoZSByZXF1ZXN0IGFjdHVhbGx5IGlzIHV0Zi04IGVuY29kZWQuXG52YXIgY2hhcnNldFNlbnRpbmVsID0gJ3V0Zjg9JUUyJTlDJTkzJzsgLy8gZW5jb2RlVVJJQ29tcG9uZW50KCfinJMnKVxuXG52YXIgcGFyc2VWYWx1ZXMgPSBmdW5jdGlvbiBwYXJzZVF1ZXJ5U3RyaW5nVmFsdWVzKHN0ciwgb3B0aW9ucykge1xuICAgIHZhciBvYmogPSB7IF9fcHJvdG9fXzogbnVsbCB9O1xuXG4gICAgdmFyIGNsZWFuU3RyID0gb3B0aW9ucy5pZ25vcmVRdWVyeVByZWZpeCA/IHN0ci5yZXBsYWNlKC9eXFw/LywgJycpIDogc3RyO1xuICAgIGNsZWFuU3RyID0gY2xlYW5TdHIucmVwbGFjZSgvJTVCL2dpLCAnWycpLnJlcGxhY2UoLyU1RC9naSwgJ10nKTtcblxuICAgIHZhciBsaW1pdCA9IG9wdGlvbnMucGFyYW1ldGVyTGltaXQgPT09IEluZmluaXR5ID8gdW5kZWZpbmVkIDogb3B0aW9ucy5wYXJhbWV0ZXJMaW1pdDtcbiAgICB2YXIgcGFydHMgPSBjbGVhblN0ci5zcGxpdChcbiAgICAgICAgb3B0aW9ucy5kZWxpbWl0ZXIsXG4gICAgICAgIG9wdGlvbnMudGhyb3dPbkxpbWl0RXhjZWVkZWQgPyBsaW1pdCArIDEgOiBsaW1pdFxuICAgICk7XG5cbiAgICBpZiAob3B0aW9ucy50aHJvd09uTGltaXRFeGNlZWRlZCAmJiBwYXJ0cy5sZW5ndGggPiBsaW1pdCkge1xuICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignUGFyYW1ldGVyIGxpbWl0IGV4Y2VlZGVkLiBPbmx5ICcgKyBsaW1pdCArICcgcGFyYW1ldGVyJyArIChsaW1pdCA9PT0gMSA/ICcnIDogJ3MnKSArICcgYWxsb3dlZC4nKTtcbiAgICB9XG5cbiAgICB2YXIgc2tpcEluZGV4ID0gLTE7IC8vIEtlZXAgdHJhY2sgb2Ygd2hlcmUgdGhlIHV0Zjggc2VudGluZWwgd2FzIGZvdW5kXG4gICAgdmFyIGk7XG5cbiAgICB2YXIgY2hhcnNldCA9IG9wdGlvbnMuY2hhcnNldDtcbiAgICBpZiAob3B0aW9ucy5jaGFyc2V0U2VudGluZWwpIHtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHBhcnRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBpZiAocGFydHNbaV0uaW5kZXhPZigndXRmOD0nKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGlmIChwYXJ0c1tpXSA9PT0gY2hhcnNldFNlbnRpbmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoYXJzZXQgPSAndXRmLTgnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocGFydHNbaV0gPT09IGlzb1NlbnRpbmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoYXJzZXQgPSAnaXNvLTg4NTktMSc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNraXBJbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgaSA9IHBhcnRzLmxlbmd0aDsgLy8gVGhlIGVzbGludCBzZXR0aW5ncyBkbyBub3QgYWxsb3cgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgcGFydHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgaWYgKGkgPT09IHNraXBJbmRleCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHBhcnQgPSBwYXJ0c1tpXTtcblxuICAgICAgICB2YXIgYnJhY2tldEVxdWFsc1BvcyA9IHBhcnQuaW5kZXhPZignXT0nKTtcbiAgICAgICAgdmFyIHBvcyA9IGJyYWNrZXRFcXVhbHNQb3MgPT09IC0xID8gcGFydC5pbmRleE9mKCc9JykgOiBicmFja2V0RXF1YWxzUG9zICsgMTtcblxuICAgICAgICB2YXIga2V5O1xuICAgICAgICB2YXIgdmFsO1xuICAgICAgICBpZiAocG9zID09PSAtMSkge1xuICAgICAgICAgICAga2V5ID0gb3B0aW9ucy5kZWNvZGVyKHBhcnQsIGRlZmF1bHRzLmRlY29kZXIsIGNoYXJzZXQsICdrZXknKTtcbiAgICAgICAgICAgIHZhbCA9IG9wdGlvbnMuc3RyaWN0TnVsbEhhbmRsaW5nID8gbnVsbCA6ICcnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAga2V5ID0gb3B0aW9ucy5kZWNvZGVyKHBhcnQuc2xpY2UoMCwgcG9zKSwgZGVmYXVsdHMuZGVjb2RlciwgY2hhcnNldCwgJ2tleScpO1xuXG4gICAgICAgICAgICB2YWwgPSB1dGlscy5tYXliZU1hcChcbiAgICAgICAgICAgICAgICBwYXJzZUFycmF5VmFsdWUoXG4gICAgICAgICAgICAgICAgICAgIHBhcnQuc2xpY2UocG9zICsgMSksXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMsXG4gICAgICAgICAgICAgICAgICAgIGlzQXJyYXkob2JqW2tleV0pID8gb2JqW2tleV0ubGVuZ3RoIDogMFxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGVuY29kZWRWYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnMuZGVjb2RlcihlbmNvZGVkVmFsLCBkZWZhdWx0cy5kZWNvZGVyLCBjaGFyc2V0LCAndmFsdWUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHZhbCAmJiBvcHRpb25zLmludGVycHJldE51bWVyaWNFbnRpdGllcyAmJiBjaGFyc2V0ID09PSAnaXNvLTg4NTktMScpIHtcbiAgICAgICAgICAgIHZhbCA9IGludGVycHJldE51bWVyaWNFbnRpdGllcyhTdHJpbmcodmFsKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGFydC5pbmRleE9mKCdbXT0nKSA+IC0xKSB7XG4gICAgICAgICAgICB2YWwgPSBpc0FycmF5KHZhbCkgPyBbdmFsXSA6IHZhbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBleGlzdGluZyA9IGhhcy5jYWxsKG9iaiwga2V5KTtcbiAgICAgICAgaWYgKGV4aXN0aW5nICYmIG9wdGlvbnMuZHVwbGljYXRlcyA9PT0gJ2NvbWJpbmUnKSB7XG4gICAgICAgICAgICBvYmpba2V5XSA9IHV0aWxzLmNvbWJpbmUob2JqW2tleV0sIHZhbCk7XG4gICAgICAgIH0gZWxzZSBpZiAoIWV4aXN0aW5nIHx8IG9wdGlvbnMuZHVwbGljYXRlcyA9PT0gJ2xhc3QnKSB7XG4gICAgICAgICAgICBvYmpba2V5XSA9IHZhbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBvYmo7XG59O1xuXG52YXIgcGFyc2VPYmplY3QgPSBmdW5jdGlvbiAoY2hhaW4sIHZhbCwgb3B0aW9ucywgdmFsdWVzUGFyc2VkKSB7XG4gICAgdmFyIGN1cnJlbnRBcnJheUxlbmd0aCA9IDA7XG4gICAgaWYgKGNoYWluLmxlbmd0aCA+IDAgJiYgY2hhaW5bY2hhaW4ubGVuZ3RoIC0gMV0gPT09ICdbXScpIHtcbiAgICAgICAgdmFyIHBhcmVudEtleSA9IGNoYWluLnNsaWNlKDAsIC0xKS5qb2luKCcnKTtcbiAgICAgICAgY3VycmVudEFycmF5TGVuZ3RoID0gQXJyYXkuaXNBcnJheSh2YWwpICYmIHZhbFtwYXJlbnRLZXldID8gdmFsW3BhcmVudEtleV0ubGVuZ3RoIDogMDtcbiAgICB9XG5cbiAgICB2YXIgbGVhZiA9IHZhbHVlc1BhcnNlZCA/IHZhbCA6IHBhcnNlQXJyYXlWYWx1ZSh2YWwsIG9wdGlvbnMsIGN1cnJlbnRBcnJheUxlbmd0aCk7XG5cbiAgICBmb3IgKHZhciBpID0gY2hhaW4ubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIG9iajtcbiAgICAgICAgdmFyIHJvb3QgPSBjaGFpbltpXTtcblxuICAgICAgICBpZiAocm9vdCA9PT0gJ1tdJyAmJiBvcHRpb25zLnBhcnNlQXJyYXlzKSB7XG4gICAgICAgICAgICBvYmogPSBvcHRpb25zLmFsbG93RW1wdHlBcnJheXMgJiYgKGxlYWYgPT09ICcnIHx8IChvcHRpb25zLnN0cmljdE51bGxIYW5kbGluZyAmJiBsZWFmID09PSBudWxsKSlcbiAgICAgICAgICAgICAgICA/IFtdXG4gICAgICAgICAgICAgICAgOiB1dGlscy5jb21iaW5lKFtdLCBsZWFmKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9iaiA9IG9wdGlvbnMucGxhaW5PYmplY3RzID8geyBfX3Byb3RvX186IG51bGwgfSA6IHt9O1xuICAgICAgICAgICAgdmFyIGNsZWFuUm9vdCA9IHJvb3QuY2hhckF0KDApID09PSAnWycgJiYgcm9vdC5jaGFyQXQocm9vdC5sZW5ndGggLSAxKSA9PT0gJ10nID8gcm9vdC5zbGljZSgxLCAtMSkgOiByb290O1xuICAgICAgICAgICAgdmFyIGRlY29kZWRSb290ID0gb3B0aW9ucy5kZWNvZGVEb3RJbktleXMgPyBjbGVhblJvb3QucmVwbGFjZSgvJTJFL2csICcuJykgOiBjbGVhblJvb3Q7XG4gICAgICAgICAgICB2YXIgaW5kZXggPSBwYXJzZUludChkZWNvZGVkUm9vdCwgMTApO1xuICAgICAgICAgICAgaWYgKCFvcHRpb25zLnBhcnNlQXJyYXlzICYmIGRlY29kZWRSb290ID09PSAnJykge1xuICAgICAgICAgICAgICAgIG9iaiA9IHsgMDogbGVhZiB9O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICAhaXNOYU4oaW5kZXgpXG4gICAgICAgICAgICAgICAgJiYgcm9vdCAhPT0gZGVjb2RlZFJvb3RcbiAgICAgICAgICAgICAgICAmJiBTdHJpbmcoaW5kZXgpID09PSBkZWNvZGVkUm9vdFxuICAgICAgICAgICAgICAgICYmIGluZGV4ID49IDBcbiAgICAgICAgICAgICAgICAmJiAob3B0aW9ucy5wYXJzZUFycmF5cyAmJiBpbmRleCA8PSBvcHRpb25zLmFycmF5TGltaXQpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBvYmogPSBbXTtcbiAgICAgICAgICAgICAgICBvYmpbaW5kZXhdID0gbGVhZjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGVjb2RlZFJvb3QgIT09ICdfX3Byb3RvX18nKSB7XG4gICAgICAgICAgICAgICAgb2JqW2RlY29kZWRSb290XSA9IGxlYWY7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZWFmID0gb2JqO1xuICAgIH1cblxuICAgIHJldHVybiBsZWFmO1xufTtcblxudmFyIHBhcnNlS2V5cyA9IGZ1bmN0aW9uIHBhcnNlUXVlcnlTdHJpbmdLZXlzKGdpdmVuS2V5LCB2YWwsIG9wdGlvbnMsIHZhbHVlc1BhcnNlZCkge1xuICAgIGlmICghZ2l2ZW5LZXkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFRyYW5zZm9ybSBkb3Qgbm90YXRpb24gdG8gYnJhY2tldCBub3RhdGlvblxuICAgIHZhciBrZXkgPSBvcHRpb25zLmFsbG93RG90cyA/IGdpdmVuS2V5LnJlcGxhY2UoL1xcLihbXi5bXSspL2csICdbJDFdJykgOiBnaXZlbktleTtcblxuICAgIC8vIFRoZSByZWdleCBjaHVua3NcblxuICAgIHZhciBicmFja2V0cyA9IC8oXFxbW15bXFxdXSpdKS87XG4gICAgdmFyIGNoaWxkID0gLyhcXFtbXltcXF1dKl0pL2c7XG5cbiAgICAvLyBHZXQgdGhlIHBhcmVudFxuXG4gICAgdmFyIHNlZ21lbnQgPSBvcHRpb25zLmRlcHRoID4gMCAmJiBicmFja2V0cy5leGVjKGtleSk7XG4gICAgdmFyIHBhcmVudCA9IHNlZ21lbnQgPyBrZXkuc2xpY2UoMCwgc2VnbWVudC5pbmRleCkgOiBrZXk7XG5cbiAgICAvLyBTdGFzaCB0aGUgcGFyZW50IGlmIGl0IGV4aXN0c1xuXG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBpZiAocGFyZW50KSB7XG4gICAgICAgIC8vIElmIHdlIGFyZW4ndCB1c2luZyBwbGFpbiBvYmplY3RzLCBvcHRpb25hbGx5IHByZWZpeCBrZXlzIHRoYXQgd291bGQgb3ZlcndyaXRlIG9iamVjdCBwcm90b3R5cGUgcHJvcGVydGllc1xuICAgICAgICBpZiAoIW9wdGlvbnMucGxhaW5PYmplY3RzICYmIGhhcy5jYWxsKE9iamVjdC5wcm90b3R5cGUsIHBhcmVudCkpIHtcbiAgICAgICAgICAgIGlmICghb3B0aW9ucy5hbGxvd1Byb3RvdHlwZXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBrZXlzLnB1c2gocGFyZW50KTtcbiAgICB9XG5cbiAgICAvLyBMb29wIHRocm91Z2ggY2hpbGRyZW4gYXBwZW5kaW5nIHRvIHRoZSBhcnJheSB1bnRpbCB3ZSBoaXQgZGVwdGhcblxuICAgIHZhciBpID0gMDtcbiAgICB3aGlsZSAob3B0aW9ucy5kZXB0aCA+IDAgJiYgKHNlZ21lbnQgPSBjaGlsZC5leGVjKGtleSkpICE9PSBudWxsICYmIGkgPCBvcHRpb25zLmRlcHRoKSB7XG4gICAgICAgIGkgKz0gMTtcbiAgICAgICAgaWYgKCFvcHRpb25zLnBsYWluT2JqZWN0cyAmJiBoYXMuY2FsbChPYmplY3QucHJvdG90eXBlLCBzZWdtZW50WzFdLnNsaWNlKDEsIC0xKSkpIHtcbiAgICAgICAgICAgIGlmICghb3B0aW9ucy5hbGxvd1Byb3RvdHlwZXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAga2V5cy5wdXNoKHNlZ21lbnRbMV0pO1xuICAgIH1cblxuICAgIC8vIElmIHRoZXJlJ3MgYSByZW1haW5kZXIsIGNoZWNrIHN0cmljdERlcHRoIG9wdGlvbiBmb3IgdGhyb3csIGVsc2UganVzdCBhZGQgd2hhdGV2ZXIgaXMgbGVmdFxuXG4gICAgaWYgKHNlZ21lbnQpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuc3RyaWN0RGVwdGggPT09IHRydWUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbnB1dCBkZXB0aCBleGNlZWRlZCBkZXB0aCBvcHRpb24gb2YgJyArIG9wdGlvbnMuZGVwdGggKyAnIGFuZCBzdHJpY3REZXB0aCBpcyB0cnVlJyk7XG4gICAgICAgIH1cbiAgICAgICAga2V5cy5wdXNoKCdbJyArIGtleS5zbGljZShzZWdtZW50LmluZGV4KSArICddJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcnNlT2JqZWN0KGtleXMsIHZhbCwgb3B0aW9ucywgdmFsdWVzUGFyc2VkKTtcbn07XG5cbnZhciBub3JtYWxpemVQYXJzZU9wdGlvbnMgPSBmdW5jdGlvbiBub3JtYWxpemVQYXJzZU9wdGlvbnMob3B0cykge1xuICAgIGlmICghb3B0cykge1xuICAgICAgICByZXR1cm4gZGVmYXVsdHM7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBvcHRzLmFsbG93RW1wdHlBcnJheXMgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBvcHRzLmFsbG93RW1wdHlBcnJheXMgIT09ICdib29sZWFuJykge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdgYWxsb3dFbXB0eUFycmF5c2Agb3B0aW9uIGNhbiBvbmx5IGJlIGB0cnVlYCBvciBgZmFsc2VgLCB3aGVuIHByb3ZpZGVkJyk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBvcHRzLmRlY29kZURvdEluS2V5cyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG9wdHMuZGVjb2RlRG90SW5LZXlzICE9PSAnYm9vbGVhbicpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignYGRlY29kZURvdEluS2V5c2Agb3B0aW9uIGNhbiBvbmx5IGJlIGB0cnVlYCBvciBgZmFsc2VgLCB3aGVuIHByb3ZpZGVkJyk7XG4gICAgfVxuXG4gICAgaWYgKG9wdHMuZGVjb2RlciAhPT0gbnVsbCAmJiB0eXBlb2Ygb3B0cy5kZWNvZGVyICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygb3B0cy5kZWNvZGVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0RlY29kZXIgaGFzIHRvIGJlIGEgZnVuY3Rpb24uJyk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBvcHRzLmNoYXJzZXQgIT09ICd1bmRlZmluZWQnICYmIG9wdHMuY2hhcnNldCAhPT0gJ3V0Zi04JyAmJiBvcHRzLmNoYXJzZXQgIT09ICdpc28tODg1OS0xJykge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgY2hhcnNldCBvcHRpb24gbXVzdCBiZSBlaXRoZXIgdXRmLTgsIGlzby04ODU5LTEsIG9yIHVuZGVmaW5lZCcpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygb3B0cy50aHJvd09uTGltaXRFeGNlZWRlZCAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG9wdHMudGhyb3dPbkxpbWl0RXhjZWVkZWQgIT09ICdib29sZWFuJykge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdgdGhyb3dPbkxpbWl0RXhjZWVkZWRgIG9wdGlvbiBtdXN0IGJlIGEgYm9vbGVhbicpO1xuICAgIH1cblxuICAgIHZhciBjaGFyc2V0ID0gdHlwZW9mIG9wdHMuY2hhcnNldCA9PT0gJ3VuZGVmaW5lZCcgPyBkZWZhdWx0cy5jaGFyc2V0IDogb3B0cy5jaGFyc2V0O1xuXG4gICAgdmFyIGR1cGxpY2F0ZXMgPSB0eXBlb2Ygb3B0cy5kdXBsaWNhdGVzID09PSAndW5kZWZpbmVkJyA/IGRlZmF1bHRzLmR1cGxpY2F0ZXMgOiBvcHRzLmR1cGxpY2F0ZXM7XG5cbiAgICBpZiAoZHVwbGljYXRlcyAhPT0gJ2NvbWJpbmUnICYmIGR1cGxpY2F0ZXMgIT09ICdmaXJzdCcgJiYgZHVwbGljYXRlcyAhPT0gJ2xhc3QnKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBkdXBsaWNhdGVzIG9wdGlvbiBtdXN0IGJlIGVpdGhlciBjb21iaW5lLCBmaXJzdCwgb3IgbGFzdCcpO1xuICAgIH1cblxuICAgIHZhciBhbGxvd0RvdHMgPSB0eXBlb2Ygb3B0cy5hbGxvd0RvdHMgPT09ICd1bmRlZmluZWQnID8gb3B0cy5kZWNvZGVEb3RJbktleXMgPT09IHRydWUgPyB0cnVlIDogZGVmYXVsdHMuYWxsb3dEb3RzIDogISFvcHRzLmFsbG93RG90cztcblxuICAgIHJldHVybiB7XG4gICAgICAgIGFsbG93RG90czogYWxsb3dEb3RzLFxuICAgICAgICBhbGxvd0VtcHR5QXJyYXlzOiB0eXBlb2Ygb3B0cy5hbGxvd0VtcHR5QXJyYXlzID09PSAnYm9vbGVhbicgPyAhIW9wdHMuYWxsb3dFbXB0eUFycmF5cyA6IGRlZmF1bHRzLmFsbG93RW1wdHlBcnJheXMsXG4gICAgICAgIGFsbG93UHJvdG90eXBlczogdHlwZW9mIG9wdHMuYWxsb3dQcm90b3R5cGVzID09PSAnYm9vbGVhbicgPyBvcHRzLmFsbG93UHJvdG90eXBlcyA6IGRlZmF1bHRzLmFsbG93UHJvdG90eXBlcyxcbiAgICAgICAgYWxsb3dTcGFyc2U6IHR5cGVvZiBvcHRzLmFsbG93U3BhcnNlID09PSAnYm9vbGVhbicgPyBvcHRzLmFsbG93U3BhcnNlIDogZGVmYXVsdHMuYWxsb3dTcGFyc2UsXG4gICAgICAgIGFycmF5TGltaXQ6IHR5cGVvZiBvcHRzLmFycmF5TGltaXQgPT09ICdudW1iZXInID8gb3B0cy5hcnJheUxpbWl0IDogZGVmYXVsdHMuYXJyYXlMaW1pdCxcbiAgICAgICAgY2hhcnNldDogY2hhcnNldCxcbiAgICAgICAgY2hhcnNldFNlbnRpbmVsOiB0eXBlb2Ygb3B0cy5jaGFyc2V0U2VudGluZWwgPT09ICdib29sZWFuJyA/IG9wdHMuY2hhcnNldFNlbnRpbmVsIDogZGVmYXVsdHMuY2hhcnNldFNlbnRpbmVsLFxuICAgICAgICBjb21tYTogdHlwZW9mIG9wdHMuY29tbWEgPT09ICdib29sZWFuJyA/IG9wdHMuY29tbWEgOiBkZWZhdWx0cy5jb21tYSxcbiAgICAgICAgZGVjb2RlRG90SW5LZXlzOiB0eXBlb2Ygb3B0cy5kZWNvZGVEb3RJbktleXMgPT09ICdib29sZWFuJyA/IG9wdHMuZGVjb2RlRG90SW5LZXlzIDogZGVmYXVsdHMuZGVjb2RlRG90SW5LZXlzLFxuICAgICAgICBkZWNvZGVyOiB0eXBlb2Ygb3B0cy5kZWNvZGVyID09PSAnZnVuY3Rpb24nID8gb3B0cy5kZWNvZGVyIDogZGVmYXVsdHMuZGVjb2RlcixcbiAgICAgICAgZGVsaW1pdGVyOiB0eXBlb2Ygb3B0cy5kZWxpbWl0ZXIgPT09ICdzdHJpbmcnIHx8IHV0aWxzLmlzUmVnRXhwKG9wdHMuZGVsaW1pdGVyKSA/IG9wdHMuZGVsaW1pdGVyIDogZGVmYXVsdHMuZGVsaW1pdGVyLFxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8taW1wbGljaXQtY29lcmNpb24sIG5vLWV4dHJhLXBhcmVuc1xuICAgICAgICBkZXB0aDogKHR5cGVvZiBvcHRzLmRlcHRoID09PSAnbnVtYmVyJyB8fCBvcHRzLmRlcHRoID09PSBmYWxzZSkgPyArb3B0cy5kZXB0aCA6IGRlZmF1bHRzLmRlcHRoLFxuICAgICAgICBkdXBsaWNhdGVzOiBkdXBsaWNhdGVzLFxuICAgICAgICBpZ25vcmVRdWVyeVByZWZpeDogb3B0cy5pZ25vcmVRdWVyeVByZWZpeCA9PT0gdHJ1ZSxcbiAgICAgICAgaW50ZXJwcmV0TnVtZXJpY0VudGl0aWVzOiB0eXBlb2Ygb3B0cy5pbnRlcnByZXROdW1lcmljRW50aXRpZXMgPT09ICdib29sZWFuJyA/IG9wdHMuaW50ZXJwcmV0TnVtZXJpY0VudGl0aWVzIDogZGVmYXVsdHMuaW50ZXJwcmV0TnVtZXJpY0VudGl0aWVzLFxuICAgICAgICBwYXJhbWV0ZXJMaW1pdDogdHlwZW9mIG9wdHMucGFyYW1ldGVyTGltaXQgPT09ICdudW1iZXInID8gb3B0cy5wYXJhbWV0ZXJMaW1pdCA6IGRlZmF1bHRzLnBhcmFtZXRlckxpbWl0LFxuICAgICAgICBwYXJzZUFycmF5czogb3B0cy5wYXJzZUFycmF5cyAhPT0gZmFsc2UsXG4gICAgICAgIHBsYWluT2JqZWN0czogdHlwZW9mIG9wdHMucGxhaW5PYmplY3RzID09PSAnYm9vbGVhbicgPyBvcHRzLnBsYWluT2JqZWN0cyA6IGRlZmF1bHRzLnBsYWluT2JqZWN0cyxcbiAgICAgICAgc3RyaWN0RGVwdGg6IHR5cGVvZiBvcHRzLnN0cmljdERlcHRoID09PSAnYm9vbGVhbicgPyAhIW9wdHMuc3RyaWN0RGVwdGggOiBkZWZhdWx0cy5zdHJpY3REZXB0aCxcbiAgICAgICAgc3RyaWN0TnVsbEhhbmRsaW5nOiB0eXBlb2Ygb3B0cy5zdHJpY3ROdWxsSGFuZGxpbmcgPT09ICdib29sZWFuJyA/IG9wdHMuc3RyaWN0TnVsbEhhbmRsaW5nIDogZGVmYXVsdHMuc3RyaWN0TnVsbEhhbmRsaW5nLFxuICAgICAgICB0aHJvd09uTGltaXRFeGNlZWRlZDogdHlwZW9mIG9wdHMudGhyb3dPbkxpbWl0RXhjZWVkZWQgPT09ICdib29sZWFuJyA/IG9wdHMudGhyb3dPbkxpbWl0RXhjZWVkZWQgOiBmYWxzZVxuICAgIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChzdHIsIG9wdHMpIHtcbiAgICB2YXIgb3B0aW9ucyA9IG5vcm1hbGl6ZVBhcnNlT3B0aW9ucyhvcHRzKTtcblxuICAgIGlmIChzdHIgPT09ICcnIHx8IHN0ciA9PT0gbnVsbCB8fCB0eXBlb2Ygc3RyID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5wbGFpbk9iamVjdHMgPyB7IF9fcHJvdG9fXzogbnVsbCB9IDoge307XG4gICAgfVxuXG4gICAgdmFyIHRlbXBPYmogPSB0eXBlb2Ygc3RyID09PSAnc3RyaW5nJyA/IHBhcnNlVmFsdWVzKHN0ciwgb3B0aW9ucykgOiBzdHI7XG4gICAgdmFyIG9iaiA9IG9wdGlvbnMucGxhaW5PYmplY3RzID8geyBfX3Byb3RvX186IG51bGwgfSA6IHt9O1xuXG4gICAgLy8gSXRlcmF0ZSBvdmVyIHRoZSBrZXlzIGFuZCBzZXR1cCB0aGUgbmV3IG9iamVjdFxuXG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh0ZW1wT2JqKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgdmFyIGtleSA9IGtleXNbaV07XG4gICAgICAgIHZhciBuZXdPYmogPSBwYXJzZUtleXMoa2V5LCB0ZW1wT2JqW2tleV0sIG9wdGlvbnMsIHR5cGVvZiBzdHIgPT09ICdzdHJpbmcnKTtcbiAgICAgICAgb2JqID0gdXRpbHMubWVyZ2Uob2JqLCBuZXdPYmosIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLmFsbG93U3BhcnNlID09PSB0cnVlKSB7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuXG4gICAgcmV0dXJuIHV0aWxzLmNvbXBhY3Qob2JqKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBzdHJpbmdpZnkgPSByZXF1aXJlKCcuL3N0cmluZ2lmeScpO1xudmFyIHBhcnNlID0gcmVxdWlyZSgnLi9wYXJzZScpO1xudmFyIGZvcm1hdHMgPSByZXF1aXJlKCcuL2Zvcm1hdHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZm9ybWF0czogZm9ybWF0cyxcbiAgICBwYXJzZTogcGFyc2UsXG4gICAgc3RyaW5naWZ5OiBzdHJpbmdpZnlcbn07XG4iLCJcbmltcG9ydCB7IGRhdGEgfSBmcm9tICcuLi9kYXRhJztcbmltcG9ydCB7IHBhcnNlLCBzdHJpbmdpZnkgfSBmcm9tICdxcyc7XG5cbi8qKlxuICogQWRkIGEgcm91dGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRSb3V0ZShyb3V0ZTogc3RyaW5nLCB1cmw6IHN0cmluZykge1xuICBjb25zdCByb3V0ZXMgPSBkYXRhKCd1bmljb3JuLnJvdXRlcycpIHx8IHt9O1xuICByb3V0ZXNbcm91dGVdID0gdXJsO1xuXG4gIGRhdGEoJ3VuaWNvcm4ucm91dGVzJywgcm91dGVzKTtcbn1cblxuLyoqXG4gKiBHZXQgcm91dGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByb3V0ZShyb3V0ZTogc3RyaW5nLCBxdWVyeT86IFJlY29yZDxzdHJpbmcsIGFueT4pOiBzdHJpbmcge1xuICBjb25zdCBzb3VyY2UgPSByb3V0ZTtcbiAgY29uc3QgZXh0cmFjdCA9IGV4dHJhY3RSb3V0ZShzb3VyY2UpO1xuICByb3V0ZSA9IGV4dHJhY3Qucm91dGU7XG4gIGxldCBwYXRoID0gZXh0cmFjdC5wYXRoO1xuICBjb25zdCByb3V0ZXMgPSBkYXRhKCd1bmljb3JuLnJvdXRlcycpIHx8IHt9O1xuXG4gIGxldCB1cmwgPSByb3V0ZXNbcm91dGVdO1xuXG4gIGlmICh1cmwgPT0gbnVsbCkge1xuICAgIGlmICghcm91dGUuc3RhcnRzV2l0aCgnQCcpKSB7XG4gICAgICByb3V0ZSA9ICdAJyArIHJvdXRlO1xuICAgIH0gZWxzZSB7XG4gICAgICByb3V0ZSA9IHJvdXRlLnN1YnN0cmluZygxKTtcbiAgICB9XG4gIH1cblxuICB1cmwgPSByb3V0ZXNbcm91dGVdO1xuXG4gIGlmICh1cmwgPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgUm91dGU6IFwiJHtzb3VyY2V9XCIgbm90IGZvdW5kYCk7XG4gIH1cblxuICAvLyBNZXJnZSBxdWVyeVxuICBpZiAocGF0aCkge1xuICAgIGNvbnN0IHsgcm91dGU6IHUxLCBwYXRoOiB1MXEgfSA9IGV4dHJhY3RSb3V0ZSh1cmwsICc/Jyk7XG4gICAgY29uc3QgeyByb3V0ZTogdTIsIHBhdGg6IHUycSB9ID0gZXh0cmFjdFJvdXRlKHBhdGgsICc/Jyk7XG5cbiAgICB1cmwgPSB1MSArICcvJyArIHUyO1xuXG4gICAgaWYgKHUxcSB8fCB1MnEpIHtcbiAgICAgIGNvbnN0IHEgPSBbIHUxcSwgdTJxIF0uZmlsdGVyKHUgPT4gdSkuam9pbignJicpO1xuICAgICAgdXJsICs9ICc/JyArIHE7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGFkZFF1ZXJ5KHVybCwgcXVlcnkpO1xufVxuXG5mdW5jdGlvbiBleHRyYWN0Um91dGUocm91dGU6IHN0cmluZywgc2VwOiBzdHJpbmcgPSAnLycpOiB7IHBhdGg6IHN0cmluZzsgcm91dGU6IHN0cmluZyB9IHtcbiAgaWYgKHJvdXRlLmluZGV4T2Yoc2VwKSA9PT0gLTEpIHtcbiAgICByZXR1cm4geyByb3V0ZSwgcGF0aDogJycgfVxuICB9XG5cbiAgY29uc3Qgc2VnbWVudHMgPSByb3V0ZS5zcGxpdChzZXApO1xuXG4gIHJvdXRlID0gc2VnbWVudHMuc2hpZnQoKSB8fCAnJztcbiAgY29uc3QgcGF0aCA9IHNlZ21lbnRzLmpvaW4oc2VwKTtcblxuICByZXR1cm4geyByb3V0ZSwgcGF0aCB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFzUm91dGUocm91dGU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gdW5kZWZpbmVkICE9PSBkYXRhKCd1bmljb3JuLnJvdXRlcycpW3JvdXRlXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZFF1ZXJ5KHVybDogc3RyaW5nLCBxdWVyeT86IFJlY29yZDxzdHJpbmcsIGFueT4pOiBzdHJpbmcge1xuICBpZiAocXVlcnkgPT0gbnVsbCkge1xuICAgIHJldHVybiB1cmw7XG4gIH1cblxuICBmb3IgKGxldCBrIGluIHF1ZXJ5KSB7XG4gICAgY29uc3QgdiA9IHF1ZXJ5W2tdO1xuXG4gICAgY29uc3QgcGxhY2Vob2xkZXIgPSBgeyR7a319YDtcblxuICAgIGlmICh1cmwuaW5kZXhPZihwbGFjZWhvbGRlcikgIT09IC0xKSB7XG4gICAgICB1cmwgPSB1cmwucmVwbGFjZShcbiAgICAgICAgbmV3IFJlZ0V4cChgJHtwbGFjZWhvbGRlcn1gLCAnZycpLFxuICAgICAgICB2XG4gICAgICApO1xuICAgICAgZGVsZXRlIHF1ZXJ5W2tdO1xuICAgIH1cblxuICAgIGNvbnN0IGVuY29kZWRQbGFjZWhvbGRlciA9IGVuY29kZVVSSUNvbXBvbmVudChgeyR7a319YCk7XG5cbiAgICBpZiAodXJsLmluZGV4T2YoZW5jb2RlZFBsYWNlaG9sZGVyKSAhPT0gLTEpIHtcbiAgICAgIHVybCA9IHVybC5yZXBsYWNlKFxuICAgICAgICBuZXcgUmVnRXhwKGAke2VuY29kZWRQbGFjZWhvbGRlcn1gLCAnZycpLFxuICAgICAgICB2XG4gICAgICApO1xuICAgICAgZGVsZXRlIHF1ZXJ5W2tdO1xuICAgIH1cbiAgfVxuXG4gIGlmIChPYmplY3Qua2V5cyhxdWVyeSkubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuXG4gIGNvbnN0IHF1ZXJ5U3RyaW5nID0gc3RyaW5naWZ5KHF1ZXJ5KTtcblxuICByZXR1cm4gdXJsICsgKC9cXD8vLnRlc3QodXJsKSA/IGAmJHtxdWVyeVN0cmluZ31gIDogYD8ke3F1ZXJ5U3RyaW5nfWApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VRdWVyeTxUID0gUmVjb3JkPHN0cmluZywgYW55Pj4ocXVlcnlTdHJpbmc6IHN0cmluZyk6IFQge1xuICByZXR1cm4gcGFyc2UocXVlcnlTdHJpbmcpIGFzIFQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZFF1ZXJ5KHF1ZXJ5OiBSZWNvcmQ8c3RyaW5nLCBhbnk+KTogc3RyaW5nIHtcbiAgcmV0dXJuIHN0cmluZ2lmeShxdWVyeSk7XG59XG4iLCJpbXBvcnQgeyBzZWxlY3RBbGwgfSBmcm9tICcuLi9zZXJ2aWNlJztcblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUNsb2FrKCkge1xuICBpZiAoZ2xvYmFsVGhpcy5kb2N1bWVudCA9PSBudWxsKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgc2VsZWN0QWxsKCdbdW5pLWNsb2FrXScsIChlbCkgPT4gZWwucmVtb3ZlQXR0cmlidXRlKCd1bmktY2xvYWsnKSk7XG59XG4iLCJpbXBvcnQgeyBnZXREYXRhLCBzZXREYXRhLCByZW1vdmVEYXRhIGFzIHJtZGF0YSB9IGZyb20gJy4vdXRpbGl0aWVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGRhdGEobmFtZTogc3RyaW5nLCBkYXRhOiBhbnkpOiBhbnk7XG5leHBvcnQgZnVuY3Rpb24gZGF0YShuYW1lOiBzdHJpbmcpOiBhbnk7XG5leHBvcnQgZnVuY3Rpb24gZGF0YShlbGU6IEVsZW1lbnQsIG5hbWU6IHN0cmluZyk6IGFueTtcbmV4cG9ydCBmdW5jdGlvbiBkYXRhKGVsZTogRWxlbWVudCwgbmFtZTogc3RyaW5nLCBkYXRhPzogYW55KTogYW55O1xuZXhwb3J0IGZ1bmN0aW9uIGRhdGEoZWxlOiBFbGVtZW50IHwgc3RyaW5nLCBuYW1lOiBhbnkgPSB1bmRlZmluZWQsIHZhbHVlOiBhbnkgPSB1bmRlZmluZWQpIHtcbiAgaWYgKCEoZWxlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpKSB7XG4gICAgdmFsdWUgPSBuYW1lO1xuICAgIG5hbWUgPSBlbGU7XG4gICAgZWxlID0gZG9jdW1lbnQgYXMgYW55IGFzIEVsZW1lbnQ7XG4gIH1cblxuICBpZiAobmFtZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGdldERhdGEoZWxlKTtcbiAgfVxuXG4gIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgY29uc3QgcmVzID0gZ2V0RGF0YShlbGUsIG5hbWUpO1xuXG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIHNldERhdGEoZWxlLCBuYW1lLCB2YWx1ZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVEYXRhKG5hbWU6IHN0cmluZyk6IGFueTtcbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVEYXRhKGVsZTogRWxlbWVudCwgbmFtZTogc3RyaW5nKTogYW55O1xuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZURhdGEoZWxlOiBFbGVtZW50fHN0cmluZywgbmFtZTogYW55ID0gdW5kZWZpbmVkKSB7XG4gIGlmICghKGVsZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSkge1xuICAgIG5hbWUgPSBlbGU7XG4gICAgZWxlID0gZG9jdW1lbnQgYXMgYW55IGFzIEVsZW1lbnQ7XG4gIH1cblxuICBybWRhdGEoZWxlLCBuYW1lKTtcbn1cbiIsIi8qKlxuICogVXRpbGl0eSBmdW5jdGlvbiB0aGF0IHdvcmtzIGxpa2UgYE9iamVjdC5hcHBseWAsIGJ1dCBjb3BpZXMgZ2V0dGVycyBhbmQgc2V0dGVycyBwcm9wZXJseSBhcyB3ZWxsLiAgQWRkaXRpb25hbGx5IGdpdmVzXG4gKiB0aGUgb3B0aW9uIHRvIGV4Y2x1ZGUgcHJvcGVydGllcyBieSBuYW1lLlxuICovXG5jb25zdCBjb3B5UHJvcHMgPSAoZGVzdCwgc3JjLCBleGNsdWRlID0gW10pID0+IHtcbiAgICBjb25zdCBwcm9wcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHNyYyk7XG4gICAgZm9yIChsZXQgcHJvcCBvZiBleGNsdWRlKVxuICAgICAgICBkZWxldGUgcHJvcHNbcHJvcF07XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoZGVzdCwgcHJvcHMpO1xufTtcbi8qKlxuICogUmV0dXJucyB0aGUgZnVsbCBjaGFpbiBvZiBwcm90b3R5cGVzIHVwIHVudGlsIE9iamVjdC5wcm90b3R5cGUgZ2l2ZW4gYSBzdGFydGluZyBvYmplY3QuICBUaGUgb3JkZXIgb2YgcHJvdG90eXBlcyB3aWxsXG4gKiBiZSBjbG9zZXN0IHRvIGZhcnRoZXN0IGluIHRoZSBjaGFpbi5cbiAqL1xuY29uc3QgcHJvdG9DaGFpbiA9IChvYmosIGN1cnJlbnRDaGFpbiA9IFtvYmpdKSA9PiB7XG4gICAgY29uc3QgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKTtcbiAgICBpZiAocHJvdG8gPT09IG51bGwpXG4gICAgICAgIHJldHVybiBjdXJyZW50Q2hhaW47XG4gICAgcmV0dXJuIHByb3RvQ2hhaW4ocHJvdG8sIFsuLi5jdXJyZW50Q2hhaW4sIHByb3RvXSk7XG59O1xuLyoqXG4gKiBJZGVudGlmaWVzIHRoZSBuZWFyZXN0IGFuY2VzdG9yIGNvbW1vbiB0byBhbGwgdGhlIGdpdmVuIG9iamVjdHMgaW4gdGhlaXIgcHJvdG90eXBlIGNoYWlucy4gIEZvciBtb3N0IHVucmVsYXRlZFxuICogb2JqZWN0cywgdGhpcyBmdW5jdGlvbiBzaG91bGQgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuXG4gKi9cbmNvbnN0IG5lYXJlc3RDb21tb25Qcm90byA9ICguLi5vYmpzKSA9PiB7XG4gICAgaWYgKG9ianMubGVuZ3RoID09PSAwKVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGxldCBjb21tb25Qcm90byA9IHVuZGVmaW5lZDtcbiAgICBjb25zdCBwcm90b0NoYWlucyA9IG9ianMubWFwKG9iaiA9PiBwcm90b0NoYWluKG9iaikpO1xuICAgIHdoaWxlIChwcm90b0NoYWlucy5ldmVyeShwcm90b0NoYWluID0+IHByb3RvQ2hhaW4ubGVuZ3RoID4gMCkpIHtcbiAgICAgICAgY29uc3QgcHJvdG9zID0gcHJvdG9DaGFpbnMubWFwKHByb3RvQ2hhaW4gPT4gcHJvdG9DaGFpbi5wb3AoKSk7XG4gICAgICAgIGNvbnN0IHBvdGVudGlhbENvbW1vblByb3RvID0gcHJvdG9zWzBdO1xuICAgICAgICBpZiAocHJvdG9zLmV2ZXJ5KHByb3RvID0+IHByb3RvID09PSBwb3RlbnRpYWxDb21tb25Qcm90bykpXG4gICAgICAgICAgICBjb21tb25Qcm90byA9IHBvdGVudGlhbENvbW1vblByb3RvO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIGNvbW1vblByb3RvO1xufTtcbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBwcm90b3R5cGUgb2JqZWN0IHRoYXQgaXMgYSBtaXh0dXJlIG9mIHRoZSBnaXZlbiBwcm90b3R5cGVzLiAgVGhlIG1peGluZyBpcyBhY2hpZXZlZCBieSBmaXJzdFxuICogaWRlbnRpZnlpbmcgdGhlIG5lYXJlc3QgY29tbW9uIGFuY2VzdG9yIGFuZCB1c2luZyBpdCBhcyB0aGUgcHJvdG90eXBlIGZvciBhIG5ldyBvYmplY3QuICBUaGVuIGFsbCBwcm9wZXJ0aWVzL21ldGhvZHNcbiAqIGRvd25zdHJlYW0gb2YgdGhpcyBwcm90b3R5cGUgKE9OTFkgZG93bnN0cmVhbSkgYXJlIGNvcGllZCBpbnRvIHRoZSBuZXcgb2JqZWN0LlxuICpcbiAqIFRoZSByZXN1bHRpbmcgcHJvdG90eXBlIGlzIG1vcmUgcGVyZm9ybWFudCB0aGFuIHNvZnRNaXhQcm90b3MoLi4uKSwgYXMgd2VsbCBhcyBFUzUgY29tcGF0aWJsZS4gIEhvd2V2ZXIsIGl0J3Mgbm90IGFzXG4gKiBmbGV4aWJsZSBhcyB1cGRhdGVzIHRvIHRoZSBzb3VyY2UgcHJvdG90eXBlcyBhcmVuJ3QgY2FwdHVyZWQgYnkgdGhlIG1peGVkIHJlc3VsdC4gIFNlZSBzb2Z0TWl4UHJvdG9zIGZvciB3aHkgeW91IG1heVxuICogd2FudCB0byB1c2UgdGhhdCBpbnN0ZWFkLlxuICovXG5jb25zdCBoYXJkTWl4UHJvdG9zID0gKGluZ3JlZGllbnRzLCBjb25zdHJ1Y3RvciwgZXhjbHVkZSA9IFtdKSA9PiB7XG4gICAgdmFyIF9hO1xuICAgIGNvbnN0IGJhc2UgPSAoX2EgPSBuZWFyZXN0Q29tbW9uUHJvdG8oLi4uaW5ncmVkaWVudHMpKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBPYmplY3QucHJvdG90eXBlO1xuICAgIGNvbnN0IG1peGVkUHJvdG8gPSBPYmplY3QuY3JlYXRlKGJhc2UpO1xuICAgIC8vIEtlZXBzIHRyYWNrIG9mIHByb3RvdHlwZXMgd2UndmUgYWxyZWFkeSB2aXNpdGVkIHRvIGF2b2lkIGNvcHlpbmcgdGhlIHNhbWUgcHJvcGVydGllcyBtdWx0aXBsZSB0aW1lcy4gIFdlIGluaXQgdGhlXG4gICAgLy8gbGlzdCB3aXRoIHRoZSBwcm90byBjaGFpbiBiZWxvdyB0aGUgbmVhcmVzdCBjb21tb24gYW5jZXN0b3IgYmVjYXVzZSB3ZSBkb24ndCB3YW50IGFueSBvZiB0aG9zZSBtZXRob2RzIG1peGVkIGluXG4gICAgLy8gd2hlbiB0aGV5IHdpbGwgYWxyZWFkeSBiZSBhY2Nlc3NpYmxlIHZpYSBwcm90b3R5cGUgYWNjZXNzLlxuICAgIGNvbnN0IHZpc2l0ZWRQcm90b3MgPSBwcm90b0NoYWluKGJhc2UpO1xuICAgIGZvciAobGV0IHByb3RvdHlwZSBvZiBpbmdyZWRpZW50cykge1xuICAgICAgICBsZXQgcHJvdG9zID0gcHJvdG9DaGFpbihwcm90b3R5cGUpO1xuICAgICAgICAvLyBBcHBseSB0aGUgcHJvdG90eXBlIGNoYWluIGluIHJldmVyc2Ugb3JkZXIgc28gdGhhdCBvbGQgbWV0aG9kcyBkb24ndCBvdmVycmlkZSBuZXdlciBvbmVzLlxuICAgICAgICBmb3IgKGxldCBpID0gcHJvdG9zLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBsZXQgbmV3UHJvdG8gPSBwcm90b3NbaV07XG4gICAgICAgICAgICBpZiAodmlzaXRlZFByb3Rvcy5pbmRleE9mKG5ld1Byb3RvKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICBjb3B5UHJvcHMobWl4ZWRQcm90bywgbmV3UHJvdG8sIFsnY29uc3RydWN0b3InLCAuLi5leGNsdWRlXSk7XG4gICAgICAgICAgICAgICAgdmlzaXRlZFByb3Rvcy5wdXNoKG5ld1Byb3RvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBtaXhlZFByb3RvLmNvbnN0cnVjdG9yID0gY29uc3RydWN0b3I7XG4gICAgcmV0dXJuIG1peGVkUHJvdG87XG59O1xuY29uc3QgdW5pcXVlID0gKGFycikgPT4gYXJyLmZpbHRlcigoZSwgaSkgPT4gYXJyLmluZGV4T2YoZSkgPT0gaSk7XG5cbi8qKlxuICogRmluZHMgdGhlIGluZ3JlZGllbnQgd2l0aCB0aGUgZ2l2ZW4gcHJvcCwgc2VhcmNoaW5nIGluIHJldmVyc2Ugb3JkZXIgYW5kIGJyZWFkdGgtZmlyc3QgaWYgc2VhcmNoaW5nIGluZ3JlZGllbnRcbiAqIHByb3RvdHlwZXMgaXMgcmVxdWlyZWQuXG4gKi9cbmNvbnN0IGdldEluZ3JlZGllbnRXaXRoUHJvcCA9IChwcm9wLCBpbmdyZWRpZW50cykgPT4ge1xuICAgIGNvbnN0IHByb3RvQ2hhaW5zID0gaW5ncmVkaWVudHMubWFwKGluZ3JlZGllbnQgPT4gcHJvdG9DaGFpbihpbmdyZWRpZW50KSk7XG4gICAgLy8gc2luY2Ugd2Ugc2VhcmNoIGJyZWFkdGgtZmlyc3QsIHdlIG5lZWQgdG8ga2VlcCB0cmFjayBvZiBvdXIgZGVwdGggaW4gdGhlIHByb3RvdHlwZSBjaGFpbnNcbiAgICBsZXQgcHJvdG9EZXB0aCA9IDA7XG4gICAgLy8gbm90IGFsbCBwcm90b3R5cGUgY2hhaW5zIGFyZSB0aGUgc2FtZSBkZXB0aCwgc28gdGhpcyByZW1haW5zIHRydWUgYXMgbG9uZyBhcyBhdCBsZWFzdCBvbmUgb2YgdGhlIGluZ3JlZGllbnRzJ1xuICAgIC8vIHByb3RvdHlwZSBjaGFpbnMgaGFzIGFuIG9iamVjdCBhdCB0aGlzIGRlcHRoXG4gICAgbGV0IHByb3Rvc0FyZUxlZnRUb1NlYXJjaCA9IHRydWU7XG4gICAgd2hpbGUgKHByb3Rvc0FyZUxlZnRUb1NlYXJjaCkge1xuICAgICAgICAvLyB3aXRoIHRoZSBzdGFydCBvZiBlYWNoIGhvcml6b250YWwgc2xpY2UsIHdlIGFzc3VtZSB0aGlzIGlzIHRoZSBvbmUgdGhhdCdzIGRlZXBlciB0aGFuIGFueSBvZiB0aGUgcHJvdG8gY2hhaW5zXG4gICAgICAgIHByb3Rvc0FyZUxlZnRUb1NlYXJjaCA9IGZhbHNlO1xuICAgICAgICAvLyBzY2FuIHRocm91Z2ggdGhlIGluZ3JlZGllbnRzIHJpZ2h0IHRvIGxlZnRcbiAgICAgICAgZm9yIChsZXQgaSA9IGluZ3JlZGllbnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBjb25zdCBzZWFyY2hUYXJnZXQgPSBwcm90b0NoYWluc1tpXVtwcm90b0RlcHRoXTtcbiAgICAgICAgICAgIGlmIChzZWFyY2hUYXJnZXQgIT09IHVuZGVmaW5lZCAmJiBzZWFyY2hUYXJnZXQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAvLyBpZiB3ZSBmaW5kIHNvbWV0aGluZywgdGhpcyBpcyBwcm9vZiB0aGF0IHRoaXMgaG9yaXpvbnRhbCBzbGljZSBwb3RlbnRpYWxseSBtb3JlIG9iamVjdHMgdG8gc2VhcmNoXG4gICAgICAgICAgICAgICAgcHJvdG9zQXJlTGVmdFRvU2VhcmNoID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAvLyBldXJla2EsIHdlIGZvdW5kIGl0XG4gICAgICAgICAgICAgICAgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc2VhcmNoVGFyZ2V0LCBwcm9wKSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb3RvQ2hhaW5zW2ldWzBdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBwcm90b0RlcHRoKys7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG59O1xuLyoqXG4gKiBcIk1peGVzXCIgaW5ncmVkaWVudHMgYnkgd3JhcHBpbmcgdGhlbSBpbiBhIFByb3h5LiAgVGhlIG9wdGlvbmFsIHByb3RvdHlwZSBhcmd1bWVudCBhbGxvd3MgdGhlIG1peGVkIG9iamVjdCB0byBzaXRcbiAqIGRvd25zdHJlYW0gb2YgYW4gZXhpc3RpbmcgcHJvdG90eXBlIGNoYWluLiAgTm90ZSB0aGF0IFwicHJvcGVydGllc1wiIGNhbm5vdCBiZSBhZGRlZCwgZGVsZXRlZCwgb3IgbW9kaWZpZWQuXG4gKi9cbmNvbnN0IHByb3h5TWl4ID0gKGluZ3JlZGllbnRzLCBwcm90b3R5cGUgPSBPYmplY3QucHJvdG90eXBlKSA9PiBuZXcgUHJveHkoe30sIHtcbiAgICBnZXRQcm90b3R5cGVPZigpIHtcbiAgICAgICAgcmV0dXJuIHByb3RvdHlwZTtcbiAgICB9LFxuICAgIHNldFByb3RvdHlwZU9mKCkge1xuICAgICAgICB0aHJvdyBFcnJvcignQ2Fubm90IHNldCBwcm90b3R5cGUgb2YgUHJveGllcyBjcmVhdGVkIGJ5IHRzLW1peGVyJyk7XG4gICAgfSxcbiAgICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoXywgcHJvcCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihnZXRJbmdyZWRpZW50V2l0aFByb3AocHJvcCwgaW5ncmVkaWVudHMpIHx8IHt9LCBwcm9wKTtcbiAgICB9LFxuICAgIGRlZmluZVByb3BlcnR5KCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBkZWZpbmUgbmV3IHByb3BlcnRpZXMgb24gUHJveGllcyBjcmVhdGVkIGJ5IHRzLW1peGVyJyk7XG4gICAgfSxcbiAgICBoYXMoXywgcHJvcCkge1xuICAgICAgICByZXR1cm4gZ2V0SW5ncmVkaWVudFdpdGhQcm9wKHByb3AsIGluZ3JlZGllbnRzKSAhPT0gdW5kZWZpbmVkIHx8IHByb3RvdHlwZVtwcm9wXSAhPT0gdW5kZWZpbmVkO1xuICAgIH0sXG4gICAgZ2V0KF8sIHByb3ApIHtcbiAgICAgICAgcmV0dXJuIChnZXRJbmdyZWRpZW50V2l0aFByb3AocHJvcCwgaW5ncmVkaWVudHMpIHx8IHByb3RvdHlwZSlbcHJvcF07XG4gICAgfSxcbiAgICBzZXQoXywgcHJvcCwgdmFsKSB7XG4gICAgICAgIGNvbnN0IGluZ3JlZGllbnRXaXRoUHJvcCA9IGdldEluZ3JlZGllbnRXaXRoUHJvcChwcm9wLCBpbmdyZWRpZW50cyk7XG4gICAgICAgIGlmIChpbmdyZWRpZW50V2l0aFByb3AgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHNldCBuZXcgcHJvcGVydGllcyBvbiBQcm94aWVzIGNyZWF0ZWQgYnkgdHMtbWl4ZXInKTtcbiAgICAgICAgaW5ncmVkaWVudFdpdGhQcm9wW3Byb3BdID0gdmFsO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIGRlbGV0ZVByb3BlcnR5KCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBkZWxldGUgcHJvcGVydGllcyBvbiBQcm94aWVzIGNyZWF0ZWQgYnkgdHMtbWl4ZXInKTtcbiAgICB9LFxuICAgIG93bktleXMoKSB7XG4gICAgICAgIHJldHVybiBpbmdyZWRpZW50c1xuICAgICAgICAgICAgLm1hcChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcylcbiAgICAgICAgICAgIC5yZWR1Y2UoKHByZXYsIGN1cnIpID0+IGN1cnIuY29uY2F0KHByZXYuZmlsdGVyKGtleSA9PiBjdXJyLmluZGV4T2Yoa2V5KSA8IDApKSk7XG4gICAgfSxcbn0pO1xuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IHByb3h5LXByb3RvdHlwZSBvYmplY3QgdGhhdCBpcyBhIFwic29mdFwiIG1peHR1cmUgb2YgdGhlIGdpdmVuIHByb3RvdHlwZXMuICBUaGUgbWl4aW5nIGlzIGFjaGlldmVkIGJ5XG4gKiBwcm94eWluZyBhbGwgcHJvcGVydHkgYWNjZXNzIHRvIHRoZSBpbmdyZWRpZW50cy4gIFRoaXMgaXMgbm90IEVTNSBjb21wYXRpYmxlIGFuZCBsZXNzIHBlcmZvcm1hbnQuICBIb3dldmVyLCBhbnlcbiAqIGNoYW5nZXMgbWFkZSB0byB0aGUgc291cmNlIHByb3RvdHlwZXMgd2lsbCBiZSByZWZsZWN0ZWQgaW4gdGhlIHByb3h5LXByb3RvdHlwZSwgd2hpY2ggbWF5IGJlIGRlc2lyYWJsZS5cbiAqL1xuY29uc3Qgc29mdE1peFByb3RvcyA9IChpbmdyZWRpZW50cywgY29uc3RydWN0b3IpID0+IHByb3h5TWl4KFsuLi5pbmdyZWRpZW50cywgeyBjb25zdHJ1Y3RvciB9XSk7XG5cbmNvbnN0IHNldHRpbmdzID0ge1xuICAgIGluaXRGdW5jdGlvbjogbnVsbCxcbiAgICBzdGF0aWNzU3RyYXRlZ3k6ICdjb3B5JyxcbiAgICBwcm90b3R5cGVTdHJhdGVneTogJ2NvcHknLFxuICAgIGRlY29yYXRvckluaGVyaXRhbmNlOiAnZGVlcCcsXG59O1xuXG4vLyBLZWVwcyB0cmFjayBvZiBjb25zdGl0dWVudCBjbGFzc2VzIGZvciBldmVyeSBtaXhpbiBjbGFzcyBjcmVhdGVkIGJ5IHRzLW1peGVyLlxuY29uc3QgbWl4aW5zID0gbmV3IFdlYWtNYXAoKTtcbmNvbnN0IGdldE1peGluc0ZvckNsYXNzID0gKGNsYXp6KSA9PiBtaXhpbnMuZ2V0KGNsYXp6KTtcbmNvbnN0IHJlZ2lzdGVyTWl4aW5zID0gKG1peGVkQ2xhc3MsIGNvbnN0aXR1ZW50cykgPT4gbWl4aW5zLnNldChtaXhlZENsYXNzLCBjb25zdGl0dWVudHMpO1xuY29uc3QgaGFzTWl4aW4gPSAoaW5zdGFuY2UsIG1peGluKSA9PiB7XG4gICAgaWYgKGluc3RhbmNlIGluc3RhbmNlb2YgbWl4aW4pXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIGNvbnN0IGNvbnN0cnVjdG9yID0gaW5zdGFuY2UuY29uc3RydWN0b3I7XG4gICAgY29uc3QgdmlzaXRlZCA9IG5ldyBTZXQoKTtcbiAgICBsZXQgZnJvbnRpZXIgPSBuZXcgU2V0KCk7XG4gICAgZnJvbnRpZXIuYWRkKGNvbnN0cnVjdG9yKTtcbiAgICB3aGlsZSAoZnJvbnRpZXIuc2l6ZSA+IDApIHtcbiAgICAgICAgLy8gY2hlY2sgaWYgdGhlIGZyb250aWVyIGhhcyB0aGUgbWl4aW4gd2UncmUgbG9va2luZyBmb3IuICBpZiBub3QsIHdlIGNhbiBzYXkgd2UgdmlzaXRlZCBldmVyeSBpdGVtIGluIHRoZSBmcm9udGllclxuICAgICAgICBpZiAoZnJvbnRpZXIuaGFzKG1peGluKSlcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICBmcm9udGllci5mb3JFYWNoKChpdGVtKSA9PiB2aXNpdGVkLmFkZChpdGVtKSk7XG4gICAgICAgIC8vIGJ1aWxkIGEgbmV3IGZyb250aWVyIGJhc2VkIG9uIHRoZSBhc3NvY2lhdGVkIG1peGluIGNsYXNzZXMgYW5kIHByb3RvdHlwZSBjaGFpbnMgb2YgZWFjaCBmcm9udGllciBpdGVtXG4gICAgICAgIGNvbnN0IG5ld0Zyb250aWVyID0gbmV3IFNldCgpO1xuICAgICAgICBmcm9udGllci5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICBjb25zdCBpdGVtQ29uc3RpdHVlbnRzID0gKF9hID0gbWl4aW5zLmdldChpdGVtKSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogcHJvdG9DaGFpbihpdGVtLnByb3RvdHlwZSlcbiAgICAgICAgICAgICAgICAubWFwKChwcm90bykgPT4gcHJvdG8uY29uc3RydWN0b3IpXG4gICAgICAgICAgICAgICAgLmZpbHRlcigoaXRlbSkgPT4gaXRlbSAhPT0gbnVsbCk7XG4gICAgICAgICAgICBpZiAoaXRlbUNvbnN0aXR1ZW50cylcbiAgICAgICAgICAgICAgICBpdGVtQ29uc3RpdHVlbnRzLmZvckVhY2goKGNvbnN0aXR1ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdmlzaXRlZC5oYXMoY29uc3RpdHVlbnQpICYmICFmcm9udGllci5oYXMoY29uc3RpdHVlbnQpKVxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3RnJvbnRpZXIuYWRkKGNvbnN0aXR1ZW50KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIHdlIGhhdmUgYSBuZXcgZnJvbnRpZXIsIG5vdyBzZWFyY2ggYWdhaW5cbiAgICAgICAgZnJvbnRpZXIgPSBuZXdGcm9udGllcjtcbiAgICB9XG4gICAgLy8gaWYgd2UgZ2V0IGhlcmUsIHdlIGNvdWxkbid0IGZpbmQgdGhlIG1peGluIGFueXdoZXJlIGluIHRoZSBwcm90b3R5cGUgY2hhaW4gb3IgYXNzb2NpYXRlZCBtaXhpbiBjbGFzc2VzXG4gICAgcmV0dXJuIGZhbHNlO1xufTtcblxuY29uc3QgbWVyZ2VPYmplY3RzT2ZEZWNvcmF0b3JzID0gKG8xLCBvMikgPT4ge1xuICAgIHZhciBfYSwgX2I7XG4gICAgY29uc3QgYWxsS2V5cyA9IHVuaXF1ZShbLi4uT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMobzEpLCAuLi5PYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvMildKTtcbiAgICBjb25zdCBtZXJnZWRPYmplY3QgPSB7fTtcbiAgICBmb3IgKGxldCBrZXkgb2YgYWxsS2V5cylcbiAgICAgICAgbWVyZ2VkT2JqZWN0W2tleV0gPSB1bmlxdWUoWy4uLigoX2EgPSBvMSA9PT0gbnVsbCB8fCBvMSA9PT0gdm9pZCAwID8gdm9pZCAwIDogbzFba2V5XSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogW10pLCAuLi4oKF9iID0gbzIgPT09IG51bGwgfHwgbzIgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG8yW2tleV0pICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IFtdKV0pO1xuICAgIHJldHVybiBtZXJnZWRPYmplY3Q7XG59O1xuY29uc3QgbWVyZ2VQcm9wZXJ0eUFuZE1ldGhvZERlY29yYXRvcnMgPSAoZDEsIGQyKSA9PiB7XG4gICAgdmFyIF9hLCBfYiwgX2MsIF9kO1xuICAgIHJldHVybiAoe1xuICAgICAgICBwcm9wZXJ0eTogbWVyZ2VPYmplY3RzT2ZEZWNvcmF0b3JzKChfYSA9IGQxID09PSBudWxsIHx8IGQxID09PSB2b2lkIDAgPyB2b2lkIDAgOiBkMS5wcm9wZXJ0eSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDoge30sIChfYiA9IGQyID09PSBudWxsIHx8IGQyID09PSB2b2lkIDAgPyB2b2lkIDAgOiBkMi5wcm9wZXJ0eSkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDoge30pLFxuICAgICAgICBtZXRob2Q6IG1lcmdlT2JqZWN0c09mRGVjb3JhdG9ycygoX2MgPSBkMSA9PT0gbnVsbCB8fCBkMSA9PT0gdm9pZCAwID8gdm9pZCAwIDogZDEubWV0aG9kKSAhPT0gbnVsbCAmJiBfYyAhPT0gdm9pZCAwID8gX2MgOiB7fSwgKF9kID0gZDIgPT09IG51bGwgfHwgZDIgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGQyLm1ldGhvZCkgIT09IG51bGwgJiYgX2QgIT09IHZvaWQgMCA/IF9kIDoge30pLFxuICAgIH0pO1xufTtcbmNvbnN0IG1lcmdlRGVjb3JhdG9ycyA9IChkMSwgZDIpID0+IHtcbiAgICB2YXIgX2EsIF9iLCBfYywgX2QsIF9lLCBfZjtcbiAgICByZXR1cm4gKHtcbiAgICAgICAgY2xhc3M6IHVuaXF1ZShbLi4uKF9hID0gZDEgPT09IG51bGwgfHwgZDEgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGQxLmNsYXNzKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBbXSwgLi4uKF9iID0gZDIgPT09IG51bGwgfHwgZDIgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGQyLmNsYXNzKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBbXV0pLFxuICAgICAgICBzdGF0aWM6IG1lcmdlUHJvcGVydHlBbmRNZXRob2REZWNvcmF0b3JzKChfYyA9IGQxID09PSBudWxsIHx8IGQxID09PSB2b2lkIDAgPyB2b2lkIDAgOiBkMS5zdGF0aWMpICE9PSBudWxsICYmIF9jICE9PSB2b2lkIDAgPyBfYyA6IHt9LCAoX2QgPSBkMiA9PT0gbnVsbCB8fCBkMiA9PT0gdm9pZCAwID8gdm9pZCAwIDogZDIuc3RhdGljKSAhPT0gbnVsbCAmJiBfZCAhPT0gdm9pZCAwID8gX2QgOiB7fSksXG4gICAgICAgIGluc3RhbmNlOiBtZXJnZVByb3BlcnR5QW5kTWV0aG9kRGVjb3JhdG9ycygoX2UgPSBkMSA9PT0gbnVsbCB8fCBkMSA9PT0gdm9pZCAwID8gdm9pZCAwIDogZDEuaW5zdGFuY2UpICE9PSBudWxsICYmIF9lICE9PSB2b2lkIDAgPyBfZSA6IHt9LCAoX2YgPSBkMiA9PT0gbnVsbCB8fCBkMiA9PT0gdm9pZCAwID8gdm9pZCAwIDogZDIuaW5zdGFuY2UpICE9PSBudWxsICYmIF9mICE9PSB2b2lkIDAgPyBfZiA6IHt9KSxcbiAgICB9KTtcbn07XG5jb25zdCBkZWNvcmF0b3JzID0gbmV3IE1hcCgpO1xuY29uc3QgZmluZEFsbENvbnN0aXR1ZW50Q2xhc3NlcyA9ICguLi5jbGFzc2VzKSA9PiB7XG4gICAgdmFyIF9hO1xuICAgIGNvbnN0IGFsbENsYXNzZXMgPSBuZXcgU2V0KCk7XG4gICAgY29uc3QgZnJvbnRpZXIgPSBuZXcgU2V0KFsuLi5jbGFzc2VzXSk7XG4gICAgd2hpbGUgKGZyb250aWVyLnNpemUgPiAwKSB7XG4gICAgICAgIGZvciAobGV0IGNsYXp6IG9mIGZyb250aWVyKSB7XG4gICAgICAgICAgICBjb25zdCBwcm90b0NoYWluQ2xhc3NlcyA9IHByb3RvQ2hhaW4oY2xhenoucHJvdG90eXBlKS5tYXAocHJvdG8gPT4gcHJvdG8uY29uc3RydWN0b3IpO1xuICAgICAgICAgICAgY29uc3QgbWl4aW5DbGFzc2VzID0gKF9hID0gZ2V0TWl4aW5zRm9yQ2xhc3MoY2xhenopKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBbXTtcbiAgICAgICAgICAgIGNvbnN0IHBvdGVudGlhbGx5TmV3Q2xhc3NlcyA9IFsuLi5wcm90b0NoYWluQ2xhc3NlcywgLi4ubWl4aW5DbGFzc2VzXTtcbiAgICAgICAgICAgIGNvbnN0IG5ld0NsYXNzZXMgPSBwb3RlbnRpYWxseU5ld0NsYXNzZXMuZmlsdGVyKGMgPT4gIWFsbENsYXNzZXMuaGFzKGMpKTtcbiAgICAgICAgICAgIGZvciAobGV0IG5ld0NsYXNzIG9mIG5ld0NsYXNzZXMpXG4gICAgICAgICAgICAgICAgZnJvbnRpZXIuYWRkKG5ld0NsYXNzKTtcbiAgICAgICAgICAgIGFsbENsYXNzZXMuYWRkKGNsYXp6KTtcbiAgICAgICAgICAgIGZyb250aWVyLmRlbGV0ZShjbGF6eik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFsuLi5hbGxDbGFzc2VzXTtcbn07XG5jb25zdCBkZWVwRGVjb3JhdG9yU2VhcmNoID0gKC4uLmNsYXNzZXMpID0+IHtcbiAgICBjb25zdCBkZWNvcmF0b3JzRm9yQ2xhc3NDaGFpbiA9IGZpbmRBbGxDb25zdGl0dWVudENsYXNzZXMoLi4uY2xhc3NlcylcbiAgICAgICAgLm1hcChjbGF6eiA9PiBkZWNvcmF0b3JzLmdldChjbGF6eikpXG4gICAgICAgIC5maWx0ZXIoZGVjb3JhdG9ycyA9PiAhIWRlY29yYXRvcnMpO1xuICAgIGlmIChkZWNvcmF0b3JzRm9yQ2xhc3NDaGFpbi5sZW5ndGggPT0gMClcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgIGlmIChkZWNvcmF0b3JzRm9yQ2xhc3NDaGFpbi5sZW5ndGggPT0gMSlcbiAgICAgICAgcmV0dXJuIGRlY29yYXRvcnNGb3JDbGFzc0NoYWluWzBdO1xuICAgIHJldHVybiBkZWNvcmF0b3JzRm9yQ2xhc3NDaGFpbi5yZWR1Y2UoKGQxLCBkMikgPT4gbWVyZ2VEZWNvcmF0b3JzKGQxLCBkMikpO1xufTtcbmNvbnN0IGRpcmVjdERlY29yYXRvclNlYXJjaCA9ICguLi5jbGFzc2VzKSA9PiB7XG4gICAgY29uc3QgY2xhc3NEZWNvcmF0b3JzID0gY2xhc3Nlcy5tYXAoY2xhenogPT4gZ2V0RGVjb3JhdG9yc0ZvckNsYXNzKGNsYXp6KSk7XG4gICAgaWYgKGNsYXNzRGVjb3JhdG9ycy5sZW5ndGggPT09IDApXG4gICAgICAgIHJldHVybiB7fTtcbiAgICBpZiAoY2xhc3NEZWNvcmF0b3JzLmxlbmd0aCA9PT0gMSlcbiAgICAgICAgcmV0dXJuIGNsYXNzRGVjb3JhdG9yc1swXTtcbiAgICByZXR1cm4gY2xhc3NEZWNvcmF0b3JzLnJlZHVjZSgoZDEsIGQyKSA9PiBtZXJnZURlY29yYXRvcnMoZDEsIGQyKSk7XG59O1xuY29uc3QgZ2V0RGVjb3JhdG9yc0ZvckNsYXNzID0gKGNsYXp6KSA9PiB7XG4gICAgbGV0IGRlY29yYXRvcnNGb3JDbGFzcyA9IGRlY29yYXRvcnMuZ2V0KGNsYXp6KTtcbiAgICBpZiAoIWRlY29yYXRvcnNGb3JDbGFzcykge1xuICAgICAgICBkZWNvcmF0b3JzRm9yQ2xhc3MgPSB7fTtcbiAgICAgICAgZGVjb3JhdG9ycy5zZXQoY2xhenosIGRlY29yYXRvcnNGb3JDbGFzcyk7XG4gICAgfVxuICAgIHJldHVybiBkZWNvcmF0b3JzRm9yQ2xhc3M7XG59O1xuY29uc3QgZGVjb3JhdGVDbGFzcyA9IChkZWNvcmF0b3IpID0+ICgoY2xhenopID0+IHtcbiAgICBjb25zdCBkZWNvcmF0b3JzRm9yQ2xhc3MgPSBnZXREZWNvcmF0b3JzRm9yQ2xhc3MoY2xhenopO1xuICAgIGxldCBjbGFzc0RlY29yYXRvcnMgPSBkZWNvcmF0b3JzRm9yQ2xhc3MuY2xhc3M7XG4gICAgaWYgKCFjbGFzc0RlY29yYXRvcnMpIHtcbiAgICAgICAgY2xhc3NEZWNvcmF0b3JzID0gW107XG4gICAgICAgIGRlY29yYXRvcnNGb3JDbGFzcy5jbGFzcyA9IGNsYXNzRGVjb3JhdG9ycztcbiAgICB9XG4gICAgY2xhc3NEZWNvcmF0b3JzLnB1c2goZGVjb3JhdG9yKTtcbiAgICByZXR1cm4gZGVjb3JhdG9yKGNsYXp6KTtcbn0pO1xuY29uc3QgZGVjb3JhdGVNZW1iZXIgPSAoZGVjb3JhdG9yKSA9PiAoKG9iamVjdCwga2V5LCAuLi5vdGhlckFyZ3MpID0+IHtcbiAgICB2YXIgX2EsIF9iLCBfYztcbiAgICBjb25zdCBkZWNvcmF0b3JUYXJnZXRUeXBlID0gdHlwZW9mIG9iamVjdCA9PT0gJ2Z1bmN0aW9uJyA/ICdzdGF0aWMnIDogJ2luc3RhbmNlJztcbiAgICBjb25zdCBkZWNvcmF0b3JUeXBlID0gdHlwZW9mIG9iamVjdFtrZXldID09PSAnZnVuY3Rpb24nID8gJ21ldGhvZCcgOiAncHJvcGVydHknO1xuICAgIGNvbnN0IGNsYXp6ID0gZGVjb3JhdG9yVGFyZ2V0VHlwZSA9PT0gJ3N0YXRpYycgPyBvYmplY3QgOiBvYmplY3QuY29uc3RydWN0b3I7XG4gICAgY29uc3QgZGVjb3JhdG9yc0ZvckNsYXNzID0gZ2V0RGVjb3JhdG9yc0ZvckNsYXNzKGNsYXp6KTtcbiAgICBjb25zdCBkZWNvcmF0b3JzRm9yVGFyZ2V0VHlwZSA9IChfYSA9IGRlY29yYXRvcnNGb3JDbGFzcyA9PT0gbnVsbCB8fCBkZWNvcmF0b3JzRm9yQ2xhc3MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGRlY29yYXRvcnNGb3JDbGFzc1tkZWNvcmF0b3JUYXJnZXRUeXBlXSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDoge307XG4gICAgZGVjb3JhdG9yc0ZvckNsYXNzW2RlY29yYXRvclRhcmdldFR5cGVdID0gZGVjb3JhdG9yc0ZvclRhcmdldFR5cGU7XG4gICAgbGV0IGRlY29yYXRvcnNGb3JUeXBlID0gKF9iID0gZGVjb3JhdG9yc0ZvclRhcmdldFR5cGUgPT09IG51bGwgfHwgZGVjb3JhdG9yc0ZvclRhcmdldFR5cGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGRlY29yYXRvcnNGb3JUYXJnZXRUeXBlW2RlY29yYXRvclR5cGVdKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiB7fTtcbiAgICBkZWNvcmF0b3JzRm9yVGFyZ2V0VHlwZVtkZWNvcmF0b3JUeXBlXSA9IGRlY29yYXRvcnNGb3JUeXBlO1xuICAgIGxldCBkZWNvcmF0b3JzRm9yS2V5ID0gKF9jID0gZGVjb3JhdG9yc0ZvclR5cGUgPT09IG51bGwgfHwgZGVjb3JhdG9yc0ZvclR5cGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGRlY29yYXRvcnNGb3JUeXBlW2tleV0pICE9PSBudWxsICYmIF9jICE9PSB2b2lkIDAgPyBfYyA6IFtdO1xuICAgIGRlY29yYXRvcnNGb3JUeXBlW2tleV0gPSBkZWNvcmF0b3JzRm9yS2V5O1xuICAgIC8vIEB0cy1pZ25vcmU6IGFycmF5IGlzIHR5cGUgYEFbXSB8IEJbXWAgYW5kIGl0ZW0gaXMgdHlwZSBgQSB8IEJgLCBzbyB0ZWNobmljYWxseSBhIHR5cGUgZXJyb3IsIGJ1dCBpdCdzIGZpbmVcbiAgICBkZWNvcmF0b3JzRm9yS2V5LnB1c2goZGVjb3JhdG9yKTtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgcmV0dXJuIGRlY29yYXRvcihvYmplY3QsIGtleSwgLi4ub3RoZXJBcmdzKTtcbn0pO1xuY29uc3QgZGVjb3JhdGUgPSAoZGVjb3JhdG9yKSA9PiAoKC4uLmFyZ3MpID0+IHtcbiAgICBpZiAoYXJncy5sZW5ndGggPT09IDEpXG4gICAgICAgIHJldHVybiBkZWNvcmF0ZUNsYXNzKGRlY29yYXRvcikoYXJnc1swXSk7XG4gICAgcmV0dXJuIGRlY29yYXRlTWVtYmVyKGRlY29yYXRvcikoLi4uYXJncyk7XG59KTtcblxuZnVuY3Rpb24gTWl4aW4oLi4uY29uc3RydWN0b3JzKSB7XG4gICAgdmFyIF9hLCBfYiwgX2M7XG4gICAgY29uc3QgcHJvdG90eXBlcyA9IGNvbnN0cnVjdG9ycy5tYXAoY29uc3RydWN0b3IgPT4gY29uc3RydWN0b3IucHJvdG90eXBlKTtcbiAgICAvLyBIZXJlIHdlIGdhdGhlciB1cCB0aGUgaW5pdCBmdW5jdGlvbnMgb2YgdGhlIGluZ3JlZGllbnQgcHJvdG90eXBlcywgY29tYmluZSB0aGVtIGludG8gb25lIGluaXQgZnVuY3Rpb24sIGFuZFxuICAgIC8vIGF0dGFjaCBpdCB0byB0aGUgbWl4ZWQgY2xhc3MgcHJvdG90eXBlLiAgVGhlIHJlYXNvbiB3ZSBkbyB0aGlzIGlzIGJlY2F1c2Ugd2Ugd2FudCB0aGUgaW5pdCBmdW5jdGlvbnMgdG8gbWl4XG4gICAgLy8gc2ltaWxhcmx5IHRvIGNvbnN0cnVjdG9ycyAtLSBub3QgbWV0aG9kcywgd2hpY2ggc2ltcGx5IG92ZXJyaWRlIGVhY2ggb3RoZXIuXG4gICAgY29uc3QgaW5pdEZ1bmN0aW9uTmFtZSA9IHNldHRpbmdzLmluaXRGdW5jdGlvbjtcbiAgICBpZiAoaW5pdEZ1bmN0aW9uTmFtZSAhPT0gbnVsbCkge1xuICAgICAgICBjb25zdCBpbml0RnVuY3Rpb25zID0gcHJvdG90eXBlc1xuICAgICAgICAgICAgLm1hcChwcm90byA9PiBwcm90b1tpbml0RnVuY3Rpb25OYW1lXSlcbiAgICAgICAgICAgIC5maWx0ZXIoZnVuYyA9PiB0eXBlb2YgZnVuYyA9PT0gJ2Z1bmN0aW9uJyk7XG4gICAgICAgIGNvbnN0IGNvbWJpbmVkSW5pdEZ1bmN0aW9uID0gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGluaXRGdW5jdGlvbiBvZiBpbml0RnVuY3Rpb25zKVxuICAgICAgICAgICAgICAgIGluaXRGdW5jdGlvbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgZXh0cmFQcm90byA9IHsgW2luaXRGdW5jdGlvbk5hbWVdOiBjb21iaW5lZEluaXRGdW5jdGlvbiB9O1xuICAgICAgICBwcm90b3R5cGVzLnB1c2goZXh0cmFQcm90byk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIE1peGVkQ2xhc3MoLi4uYXJncykge1xuICAgICAgICBmb3IgKGNvbnN0IGNvbnN0cnVjdG9yIG9mIGNvbnN0cnVjdG9ycylcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmU6IHBvdGVudGlhbGx5IGFic3RyYWN0IGNsYXNzXG4gICAgICAgICAgICBjb3B5UHJvcHModGhpcywgbmV3IGNvbnN0cnVjdG9yKC4uLmFyZ3MpKTtcbiAgICAgICAgaWYgKGluaXRGdW5jdGlvbk5hbWUgIT09IG51bGwgJiYgdHlwZW9mIHRoaXNbaW5pdEZ1bmN0aW9uTmFtZV0gPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICB0aGlzW2luaXRGdW5jdGlvbk5hbWVdLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgICBNaXhlZENsYXNzLnByb3RvdHlwZSA9IHNldHRpbmdzLnByb3RvdHlwZVN0cmF0ZWd5ID09PSAnY29weSdcbiAgICAgICAgPyBoYXJkTWl4UHJvdG9zKHByb3RvdHlwZXMsIE1peGVkQ2xhc3MpXG4gICAgICAgIDogc29mdE1peFByb3Rvcyhwcm90b3R5cGVzLCBNaXhlZENsYXNzKTtcbiAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YoTWl4ZWRDbGFzcywgc2V0dGluZ3Muc3RhdGljc1N0cmF0ZWd5ID09PSAnY29weSdcbiAgICAgICAgPyBoYXJkTWl4UHJvdG9zKGNvbnN0cnVjdG9ycywgbnVsbCwgWydwcm90b3R5cGUnXSlcbiAgICAgICAgOiBwcm94eU1peChjb25zdHJ1Y3RvcnMsIEZ1bmN0aW9uLnByb3RvdHlwZSkpO1xuICAgIGxldCBEZWNvcmF0ZWRNaXhlZENsYXNzID0gTWl4ZWRDbGFzcztcbiAgICBpZiAoc2V0dGluZ3MuZGVjb3JhdG9ySW5oZXJpdGFuY2UgIT09ICdub25lJykge1xuICAgICAgICBjb25zdCBjbGFzc0RlY29yYXRvcnMgPSBzZXR0aW5ncy5kZWNvcmF0b3JJbmhlcml0YW5jZSA9PT0gJ2RlZXAnXG4gICAgICAgICAgICA/IGRlZXBEZWNvcmF0b3JTZWFyY2goLi4uY29uc3RydWN0b3JzKVxuICAgICAgICAgICAgOiBkaXJlY3REZWNvcmF0b3JTZWFyY2goLi4uY29uc3RydWN0b3JzKTtcbiAgICAgICAgZm9yIChsZXQgZGVjb3JhdG9yIG9mIChfYSA9IGNsYXNzRGVjb3JhdG9ycyA9PT0gbnVsbCB8fCBjbGFzc0RlY29yYXRvcnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGNsYXNzRGVjb3JhdG9ycy5jbGFzcykgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogW10pIHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGRlY29yYXRvcihEZWNvcmF0ZWRNaXhlZENsYXNzKTtcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICBEZWNvcmF0ZWRNaXhlZENsYXNzID0gcmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGFwcGx5UHJvcEFuZE1ldGhvZERlY29yYXRvcnMoKF9iID0gY2xhc3NEZWNvcmF0b3JzID09PSBudWxsIHx8IGNsYXNzRGVjb3JhdG9ycyA9PT0gdm9pZCAwID8gdm9pZCAwIDogY2xhc3NEZWNvcmF0b3JzLnN0YXRpYykgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDoge30sIERlY29yYXRlZE1peGVkQ2xhc3MpO1xuICAgICAgICBhcHBseVByb3BBbmRNZXRob2REZWNvcmF0b3JzKChfYyA9IGNsYXNzRGVjb3JhdG9ycyA9PT0gbnVsbCB8fCBjbGFzc0RlY29yYXRvcnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGNsYXNzRGVjb3JhdG9ycy5pbnN0YW5jZSkgIT09IG51bGwgJiYgX2MgIT09IHZvaWQgMCA/IF9jIDoge30sIERlY29yYXRlZE1peGVkQ2xhc3MucHJvdG90eXBlKTtcbiAgICB9XG4gICAgcmVnaXN0ZXJNaXhpbnMoRGVjb3JhdGVkTWl4ZWRDbGFzcywgY29uc3RydWN0b3JzKTtcbiAgICByZXR1cm4gRGVjb3JhdGVkTWl4ZWRDbGFzcztcbn1cbmNvbnN0IGFwcGx5UHJvcEFuZE1ldGhvZERlY29yYXRvcnMgPSAocHJvcEFuZE1ldGhvZERlY29yYXRvcnMsIHRhcmdldCkgPT4ge1xuICAgIGNvbnN0IHByb3BEZWNvcmF0b3JzID0gcHJvcEFuZE1ldGhvZERlY29yYXRvcnMucHJvcGVydHk7XG4gICAgY29uc3QgbWV0aG9kRGVjb3JhdG9ycyA9IHByb3BBbmRNZXRob2REZWNvcmF0b3JzLm1ldGhvZDtcbiAgICBpZiAocHJvcERlY29yYXRvcnMpXG4gICAgICAgIGZvciAobGV0IGtleSBpbiBwcm9wRGVjb3JhdG9ycylcbiAgICAgICAgICAgIGZvciAobGV0IGRlY29yYXRvciBvZiBwcm9wRGVjb3JhdG9yc1trZXldKVxuICAgICAgICAgICAgICAgIGRlY29yYXRvcih0YXJnZXQsIGtleSk7XG4gICAgaWYgKG1ldGhvZERlY29yYXRvcnMpXG4gICAgICAgIGZvciAobGV0IGtleSBpbiBtZXRob2REZWNvcmF0b3JzKVxuICAgICAgICAgICAgZm9yIChsZXQgZGVjb3JhdG9yIG9mIG1ldGhvZERlY29yYXRvcnNba2V5XSlcbiAgICAgICAgICAgICAgICBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpKTtcbn07XG4vKipcbiAqIEEgZGVjb3JhdG9yIHZlcnNpb24gb2YgdGhlIGBNaXhpbmAgZnVuY3Rpb24uICBZb3UnbGwgd2FudCB0byB1c2UgdGhpcyBpbnN0ZWFkIG9mIGBNaXhpbmAgZm9yIG1peGluZyBnZW5lcmljIGNsYXNzZXMuXG4gKi9cbmNvbnN0IG1peCA9ICguLi5pbmdyZWRpZW50cykgPT4gZGVjb3JhdGVkQ2xhc3MgPT4ge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25zdCBtaXhlZENsYXNzID0gTWl4aW4oLi4uaW5ncmVkaWVudHMuY29uY2F0KFtkZWNvcmF0ZWRDbGFzc10pKTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobWl4ZWRDbGFzcywgJ25hbWUnLCB7XG4gICAgICAgIHZhbHVlOiBkZWNvcmF0ZWRDbGFzcy5uYW1lLFxuICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgfSk7XG4gICAgcmV0dXJuIG1peGVkQ2xhc3M7XG59O1xuXG5leHBvcnQgeyBNaXhpbiwgZGVjb3JhdGUsIGhhc01peGluLCBtaXgsIHNldHRpbmdzIH07XG4iLCJpbXBvcnQgeyBNaXhpbiB9IGZyb20gJ3RzLW1peGVyJztcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEV2ZW50TWl4aW4gaW1wbGVtZW50cyBFdmVudEF3YXJlSW50ZXJmYWNlIHtcbiAgX2xpc3RlbmVyczogUmVjb3JkPHN0cmluZywgRXZlbnRIYW5kbGVyW10+ID0ge307XG5cbiAgb24oZXZlbnQ6IHN0cmluZyB8IHN0cmluZ1tdLCBoYW5kbGVyOiBFdmVudEhhbmRsZXIpOiB0aGlzIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShldmVudCkpIHtcbiAgICAgIGZvciAoY29uc3QgZSBvZiBldmVudCkge1xuICAgICAgICB0aGlzLm9uKGUsIGhhbmRsZXIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdGhpcy5fbGlzdGVuZXJzW2V2ZW50XSA/Pz0gW107XG5cbiAgICB0aGlzLl9saXN0ZW5lcnNbZXZlbnRdLnB1c2goaGFuZGxlcik7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIG9uY2UoZXZlbnQ6IHN0cmluZyB8IHN0cmluZ1tdLCBoYW5kbGVyOiBFdmVudEhhbmRsZXIpOiB0aGlzIHtcbiAgICBoYW5kbGVyLm9uY2UgPSB0cnVlO1xuICAgIHJldHVybiB0aGlzLm9uKGV2ZW50LCBoYW5kbGVyKTtcbiAgfVxuXG4gIG9mZihldmVudDogc3RyaW5nLCBoYW5kbGVyPzogRXZlbnRIYW5kbGVyKTogdGhpcyB7XG4gICAgaWYgKGhhbmRsZXIpIHtcbiAgICAgIHRoaXMuX2xpc3RlbmVyc1tldmVudF0gPSB0aGlzLmxpc3RlbmVycyhldmVudCkuZmlsdGVyKChsaXN0ZW5lcikgPT4gbGlzdGVuZXIgIT09IGhhbmRsZXIpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZGVsZXRlIHRoaXMuX2xpc3RlbmVyc1tldmVudF07XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHRyaWdnZXIoZXZlbnQ6IHN0cmluZyB8IHN0cmluZ1tdLCAuLi5hcmdzOiBhbnlbXSk6IHRoaXMge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGV2ZW50KSkge1xuICAgICAgZm9yIChjb25zdCBlIG9mIGV2ZW50KSB7XG4gICAgICAgIHRoaXMudHJpZ2dlcihlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgbGlzdGVuZXIgb2YgdGhpcy5saXN0ZW5lcnMoZXZlbnQpKSB7XG4gICAgICBsaXN0ZW5lciguLi5hcmdzKTtcbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgb25jZVxuICAgIHRoaXMuX2xpc3RlbmVyc1tldmVudF0gPSB0aGlzLmxpc3RlbmVycyhldmVudCkuZmlsdGVyKChsaXN0ZW5lcikgPT4gbGlzdGVuZXI/Lm9uY2UgIT09IHRydWUpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMoZXZlbnQ6IHN0cmluZyk6IEV2ZW50SGFuZGxlcltdIHtcbiAgICByZXR1cm4gdGhpcy5fbGlzdGVuZXJzW2V2ZW50XSA9PT0gdW5kZWZpbmVkID8gW10gOiB0aGlzLl9saXN0ZW5lcnNbZXZlbnRdO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBFdmVudEJ1cyBleHRlbmRzIE1peGluKEV2ZW50TWl4aW4pIHtcbn1cblxuZXhwb3J0IHR5cGUgRXZlbnRIYW5kbGVyID0gKCguLi5ldmVudDogYW55W10pID0+IHZvaWQpICYgeyBvbmNlPzogYm9vbGVhbiB9O1xuXG5leHBvcnQgaW50ZXJmYWNlIEV2ZW50QXdhcmVJbnRlcmZhY2Uge1xuICBvbihldmVudDogc3RyaW5nIHwgc3RyaW5nW10sIGhhbmRsZXI6IEV2ZW50SGFuZGxlcik6IHRoaXM7XG5cbiAgb25jZShldmVudDogc3RyaW5nIHwgc3RyaW5nW10sIGhhbmRsZXI6IEV2ZW50SGFuZGxlcik6IHRoaXM7XG5cbiAgb2ZmKGV2ZW50OiBzdHJpbmcsIGhhbmRsZXI/OiBFdmVudEhhbmRsZXIpOiB0aGlzO1xuXG4gIHRyaWdnZXIoZXZlbnQ6IHN0cmluZyB8IHN0cmluZ1tdLCAuLi5hcmdzOiBhbnlbXSk6IHRoaXM7XG5cbiAgbGlzdGVuZXJzKGV2ZW50OiBzdHJpbmcpOiBFdmVudEhhbmRsZXJbXTtcbn1cbiIsIlxuaW1wb3J0IHsgZGF0YSB9IGZyb20gJy4vZGF0YSc7XG5pbXBvcnQgeyBFdmVudEF3YXJlSW50ZXJmYWNlLCBFdmVudE1peGluIH0gZnJvbSAnLi9ldmVudHMnO1xuaW1wb3J0IHsgZG9tcmVhZHkgfSBmcm9tICcuL3NlcnZpY2UnO1xuaW1wb3J0IHsgQ29uc3RydWN0b3IsIFVuaWNvcm5QbHVnaW4gfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IE1peGluIH0gZnJvbSAndHMtbWl4ZXInO1xuXG5leHBvcnQgdHlwZSBJbmplY3Rpb25LZXk8VCA9IGFueT4gPSBzdHJpbmcgfCBzeW1ib2wgfCBDb25zdHJ1Y3RvcjxUPjtcblxuZXhwb3J0IGludGVyZmFjZSBVbmljb3JuQXBwIGV4dGVuZHMgRXZlbnRBd2FyZUludGVyZmFjZSB7fVxuXG5leHBvcnQgY2xhc3MgVW5pY29ybkFwcCBleHRlbmRzIE1peGluKEV2ZW50TWl4aW4pIGltcGxlbWVudHMgRXZlbnRBd2FyZUludGVyZmFjZSB7XG4gIHJlZ2lzdHJ5ID0gbmV3IE1hcCgpO1xuICBwbHVnaW5zID0gbmV3IE1hcCgpO1xuICAvLyBfbGlzdGVuZXJzID0ge307XG4gIHdhaXRzOiBQcm9taXNlPGFueT5bXSA9IFtdO1xuICBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuICBkZWZhdWx0T3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICBkb21yZWFkeSA9IGRvbXJlYWR5O1xuICBkYXRhID0gZGF0YTtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgLy8gV2FpdCBkb20gcmVhZHlcbiAgICBpZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhpcy53YWl0KChyZXNvbHZlOiBGdW5jdGlvbikgPT4ge1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4gcmVzb2x2ZSgpKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBSZWFkeVxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgICAgICAgdGhpcy5jb21wbGV0ZWQoKS50aGVuKCgpID0+IHRoaXMudHJpZ2dlcignbG9hZGVkJykpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgdXNlKHBsdWdpbjogVW5pY29yblBsdWdpbiwgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9KSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkocGx1Z2luKSkge1xuICAgICAgcGx1Z2luLmZvckVhY2gocCA9PiB0aGlzLnVzZShwKSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvLyBpZiAocGx1Z2luLmlzID09PSB1bmRlZmluZWQpIHtcbiAgICAvLyAgIHRocm93IG5ldyBFcnJvcihgUGx1Z2luOiAke3BsdWdpbi5uYW1lfSBtdXN0IGluc3RhbmNlIG9mIDogJHtQbHVnaW4ubmFtZX1gKTtcbiAgICAvLyB9XG5cbiAgICBwbHVnaW4/Lmluc3RhbGw/Lih0aGlzLCBvcHRpb25zKTtcblxuICAgIHRoaXMudHJpZ2dlcigncGx1Z2luLmluc3RhbGxlZCcsIHBsdWdpbik7XG5cbiAgICB0aGlzLnBsdWdpbnMuc2V0KHBsdWdpbiwgcGx1Z2luKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZGV0YWNoKHBsdWdpbjogYW55KSB7XG4gICAgaWYgKHBsdWdpbi51bmluc3RhbGwpIHtcbiAgICAgIHBsdWdpbi51bmluc3RhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgdGhpcy50cmlnZ2VyKCdwbHVnaW4udW5pbnN0YWxsZWQnLCBwbHVnaW4pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBpbmplY3Q8VD4oaWQ6IEluamVjdGlvbktleTxUPik6IFQ7XG4gIGluamVjdDxUPihpZDogSW5qZWN0aW9uS2V5PFQ+LCBkZWY6IFQpOiBUO1xuICBpbmplY3Q8VD4oaWQ6IEluamVjdGlvbktleTxUPiwgZGVmPzogVCk6IFQgfCB1bmRlZmluZWQge1xuICAgIGlmICghdHlwZW9mIHRoaXMucmVnaXN0cnkuaGFzKGlkKSkge1xuICAgICAgaWYgKGRlZiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBkZWY7XG4gICAgICB9XG5cbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW5qZWN0YWJsZTogJHsoaWQgYXMgYW55KS5uYW1lfSBub3QgZm91bmQuYCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucmVnaXN0cnkuZ2V0KGlkKTtcbiAgfVxuXG4gIHByb3ZpZGU8VD4oaWQ6IEluamVjdGlvbktleTxUPiwgdmFsdWU6IGFueSkge1xuICAgIHRoaXMucmVnaXN0cnkuc2V0KGlkLCB2YWx1ZSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHRyaWdnZXIoZXZlbnQsIC4uLmFyZ3MpIHtcbiAgLy8gICByZXR1cm4gdGhpcy50YXAoc3VwZXIudHJpZ2dlcihldmVudCwgLi4uYXJncyksICgpID0+IHtcbiAgLy8gICAgIGlmICh0aGlzLmRhdGEoJ3dpbmR3YWxrZXIuZGVidWcnKSkge1xuICAvLyAgICAgICBjb25zb2xlLmRlYnVnKGBbVW5pY29ybiBFdmVudF0gJHtldmVudH1gLCBhcmdzLCB0aGlzLmxpc3RlbmVycyhldmVudCkpO1xuICAvLyAgICAgfVxuICAvLyAgIH0pO1xuICAvLyB9XG5cbiAgd2FpdChjYWxsYmFjazogRnVuY3Rpb24pOiBQcm9taXNlPGFueT4ge1xuICAgIGNvbnN0IHAgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBwcm9taXNlID0gY2FsbGJhY2socmVzb2x2ZSwgcmVqZWN0KTtcblxuICAgICAgaWYgKHByb21pc2UgJiYgJ3RoZW4nIGluIHByb21pc2UpIHtcbiAgICAgICAgcHJvbWlzZS50aGVuKHJlc29sdmUpLmNhdGNoKHJlamVjdCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLndhaXRzLnB1c2gocCk7XG5cbiAgICByZXR1cm4gcDtcbiAgfVxuXG4gIGNvbXBsZXRlZCgpOiBQcm9taXNlPGFueVtdPiB7XG4gICAgY29uc3QgcHJvbWlzZSA9IFByb21pc2UuYWxsKHRoaXMud2FpdHMpO1xuXG4gICAgdGhpcy53YWl0cyA9IFtdO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuXG59XG4iLCIvLyBAdHMtbm9jaGVja1xuLy8gQHNlZSBodHRwczovL2dpdGh1Yi5jb20vamF2YW4vZm9ybS1yZXF1ZXN0LXN1Ym1pdC1wb2x5ZmlsbFxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1SZXF1ZXN0U3VibWl0KHByb3RvdHlwZSkge1xuICBpZiAodHlwZW9mIHByb3RvdHlwZS5yZXF1ZXN0U3VibWl0ID09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBwcm90b3R5cGUucmVxdWVzdFN1Ym1pdCA9IGZ1bmN0aW9uIChzdWJtaXR0ZXIpIHtcbiAgICBpZiAoc3VibWl0dGVyKSB7XG4gICAgICB2YWxpZGF0ZVN1Ym1pdHRlcihzdWJtaXR0ZXIsIHRoaXMpO1xuICAgICAgc3VibWl0dGVyLmNsaWNrKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN1Ym1pdHRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICBzdWJtaXR0ZXIudHlwZSA9ICdzdWJtaXQnO1xuICAgICAgc3VibWl0dGVyLmhpZGRlbiA9IHRydWU7XG4gICAgICB0aGlzLmFwcGVuZENoaWxkKHN1Ym1pdHRlcik7XG4gICAgICBzdWJtaXR0ZXIuY2xpY2soKTtcbiAgICAgIHRoaXMucmVtb3ZlQ2hpbGQoc3VibWl0dGVyKTtcbiAgICB9XG4gIH07XG5cbiAgZnVuY3Rpb24gdmFsaWRhdGVTdWJtaXR0ZXIoc3VibWl0dGVyLCBmb3JtKSB7XG4gICAgc3VibWl0dGVyIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgfHwgcmFpc2UoVHlwZUVycm9yLCAncGFyYW1ldGVyIDEgaXMgbm90IG9mIHR5cGUgXFwnSFRNTEVsZW1lbnRcXCcnKTtcbiAgICBzdWJtaXR0ZXIudHlwZSA9PSAnc3VibWl0JyB8fCByYWlzZShUeXBlRXJyb3IsICdUaGUgc3BlY2lmaWVkIGVsZW1lbnQgaXMgbm90IGEgc3VibWl0IGJ1dHRvbicpO1xuICAgIHN1Ym1pdHRlci5mb3JtID09IGZvcm0gfHwgcmFpc2UoRE9NRXhjZXB0aW9uLCAnVGhlIHNwZWNpZmllZCBlbGVtZW50IGlzIG5vdCBvd25lZCBieSB0aGlzIGZvcm0gZWxlbWVudCcsICdOb3RGb3VuZEVycm9yJyk7XG4gIH1cblxuICBmdW5jdGlvbiByYWlzZShlcnJvckNvbnN0cnVjdG9yLCBtZXNzYWdlLCBuYW1lKSB7XG4gICAgdGhyb3cgbmV3IGVycm9yQ29uc3RydWN0b3IoJ0ZhaWxlZCB0byBleGVjdXRlIFxcJ3JlcXVlc3RTdWJtaXRcXCcgb24gXFwnSFRNTEZvcm1FbGVtZW50XFwnOiAnICsgbWVzc2FnZSArICcuJywgbmFtZSk7XG4gIH1cbn1cbiIsIlxuaW1wb3J0IHsgZm9ybVJlcXVlc3RTdWJtaXQgfSBmcm9tICcuL2Zvcm0tcmVxdWVzdC1zdWJtaXQnO1xuXG5leHBvcnQgZnVuY3Rpb24gcG9seWZpbGwoKSB7XG4gIC8vIElmIGluIGJyb3dzZXJcbiAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgZm9ybVJlcXVlc3RTdWJtaXQoSFRNTEZvcm1FbGVtZW50LnByb3RvdHlwZSk7XG4gIH1cbn1cbiIsImltcG9ydCB0eXBlIHsgVGlueW1jZUNvbnRyb2xsZXIsIFRpbnltY2VNb2R1bGUgfSBmcm9tICcuLi9tb2R1bGUvdGlueW1jZSc7XG5pbXBvcnQgdHlwZSB7IE1heWJlUHJvbWlzZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB0eXBlIHsgVGlueU1DRSB9IGZyb20gJ3RpbnltY2UnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlVGlueW1jZSgpOiBQcm9taXNlPFRpbnltY2VNb2R1bGU+XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlVGlueW1jZShcbiAgc2VsZWN0b3I/OiBzdHJpbmcsXG4gIG9wdGlvbnM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+XG4pOiBQcm9taXNlPFRpbnltY2VDb250cm9sbGVyPjtcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1c2VUaW55bWNlKFxuICBzZWxlY3Rvcj86IHN0cmluZyxcbiAgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9XG4pOiBQcm9taXNlPGFueT4ge1xuICBjb25zdCB7IGdldCB9ID0gYXdhaXQgaW1wb3J0KCcuLi9tb2R1bGUvdGlueW1jZScpO1xuXG4gIHJldHVybiBnZXQoc2VsZWN0b3IsIG9wdGlvbnMpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlVGlueW1jZUhvb2soXG4gIGhhbmRsZXI6ICgodGlueW1jZTogVGlueU1DRSkgPT4gTWF5YmVQcm9taXNlPGFueT4pXG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgeyBhZGRIb29rIH0gPSBhd2FpdCBpbXBvcnQoJy4uL21vZHVsZS90aW55bWNlJyk7XG5cbiAgcmV0dXJuIGFkZEhvb2soaGFuZGxlcik7XG59XG4iLCJpbXBvcnQgdHlwZSB7IFVuaWNvcm5BcHAgfSBmcm9tICcuLi9hcHAnO1xuaW1wb3J0IHtcbiAgdXNlRmllbGRDYXNjYWRlU2VsZWN0LFxuICB1c2VGaWVsZEZpbGVEcmFnLFxuICB1c2VGaWVsZEZsYXRwaWNrcixcbiAgdXNlRmllbGRNb2RhbFNlbGVjdCwgdXNlRmllbGRNb2RhbFRyZWUsXG4gIHVzZUZpZWxkUmVwZWF0YWJsZSxcbiAgdXNlRmllbGRTaW5nbGVJbWFnZURyYWcsXG4gIHVzZUlmcmFtZU1vZGFsLFxuICB1c2VTaG93T24sXG59IGZyb20gJy4uL2NvbXBvc2FibGUnO1xuaW1wb3J0IHsgdXNlVGlueW1jZSB9IGZyb20gJy4uL2NvbXBvc2FibGUvdXNlVGlueW1jZSc7XG5pbXBvcnQgeyB1c2VVbmljb3JuIH0gZnJvbSAnLi4vdW5pY29ybic7XG5pbXBvcnQgeyBkb21yZWFkeSB9IGZyb20gJy4uL3NlcnZpY2UnO1xuXG5kZWNsYXJlIG1vZHVsZSAnLi4vYXBwJyB7XG4gIGV4cG9ydCBpbnRlcmZhY2UgVW5pY29ybkFwcCB7XG4gICAgLyoqIEBkZXByZWNhdGVkIE9ubHkgZm9yIGNvZGUgZ2VuZXJhdG9yIHVzZS4gKi9cbiAgICAkdWk6IHR5cGVvZiBtZXRob2RzO1xuICB9XG59XG5cbi8vIEB0cy1pZ25vcmVcbmRlY2xhcmUgbW9kdWxlICdAd2luZHdhbGtlci1pby91bmljb3JuLW5leHQnIHtcbiAgZXhwb3J0IGludGVyZmFjZSBVbmljb3JuQXBwIHtcbiAgICAvKiogQGRlcHJlY2F0ZWQgT25seSBmb3IgY29kZSBnZW5lcmF0b3IgdXNlLiAqL1xuICAgICR1aTogdHlwZW9mIG1ldGhvZHM7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVzZVVuaWNvcm5QaHBBZGFwdGVyKGFwcD86IFVuaWNvcm5BcHApIHtcbiAgYXBwID8/PSB1c2VVbmljb3JuKCk7XG5cbiAgYXBwLnVzZShVbmljb3JuUGhwQWRhcHRlcik7XG5cbiAgcmV0dXJuIGFwcC4kdWk7XG59XG5cbmNvbnN0IG1ldGhvZHMgPSB7XG4gIHJlcGVhdGFibGU6IHVzZUZpZWxkUmVwZWF0YWJsZSxcbiAgZmxhdHBpY2tyOiB1c2VGaWVsZEZsYXRwaWNrcixcbiAgZmlsZURyYWc6IHVzZUZpZWxkRmlsZURyYWcsXG4gIG1vZGFsRmllbGQ6IHVzZUZpZWxkTW9kYWxTZWxlY3QsXG4gIGNhc2NhZGVTZWxlY3Q6IHVzZUZpZWxkQ2FzY2FkZVNlbGVjdCxcbiAgc2lkOiB1c2VGaWVsZFNpbmdsZUltYWdlRHJhZyxcbiAgdGlueW1jZToge1xuICAgIGluaXQ6IHVzZVRpbnltY2VcbiAgfSxcbiAgaWZyYW1lTW9kYWw6IHVzZUlmcmFtZU1vZGFsLFxuICBpbml0U2hvd09uOiB1c2VTaG93T24sXG4gIG1vZGFsVHJlZTogdXNlRmllbGRNb2RhbFRyZWUsXG59O1xuXG5leHBvcnQgY2xhc3MgVW5pY29yblBocEFkYXB0ZXIge1xuICBzdGF0aWMgaW5zdGFsbChhcHA6IFVuaWNvcm5BcHApIHtcbiAgICBpZiAoYXBwLiR1aSkge1xuICAgICAgYXBwLiR1aSA9IHsgLi4uYXBwLiR1aSwgLi4ubWV0aG9kcyB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBhcHAuJHVpID0gbWV0aG9kcztcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IEluamVjdGlvbktleSwgVW5pY29ybkFwcCB9IGZyb20gJy4vYXBwJztcbmltcG9ydCB7IHBvbHlmaWxsIH0gZnJvbSAnLi9wb2x5ZmlsbCc7XG5pbXBvcnQgeyByZW1vdmVDbG9hayB9IGZyb20gJy4vdXRpbGl0aWVzJztcblxuZXhwb3J0ICogZnJvbSAnLi9kYXRhJztcbmV4cG9ydCAqIGZyb20gJy4vZXZlbnRzJztcbmV4cG9ydCAqIGZyb20gJy4vc2VydmljZSc7XG5leHBvcnQgKiBmcm9tICcuL2NvbXBvc2FibGUnO1xuZXhwb3J0ICogZnJvbSAnLi9wbHVnaW4nO1xuXG5leHBvcnQgdHlwZSB7IFVuaWNvcm5BcHAgfTtcblxubGV0IGFwcDogVW5pY29ybkFwcDtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVVuaWNvcm4oKTogVW5pY29ybkFwcCB7XG4gIHBvbHlmaWxsKCk7XG4gIHJlbW92ZUNsb2FrKCk7XG5cbiAgcmV0dXJuIGFwcCA9IG5ldyBVbmljb3JuQXBwKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVVbmljb3JuV2l0aFBsdWdpbnMoKTogVW5pY29ybkFwcCB7XG4gIGNvbnN0IGFwcCA9IGNyZWF0ZVVuaWNvcm4oKTtcblxuICAvLyBhcHAudXNlKFVuaWNvcm5VSSk7XG5cbiAgLy8gYXBwLnVzZShVbmljb3JuRG9tKTtcblxuICByZXR1cm4gYXBwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXNlVW5pY29ybihpbnN0YW5jZT86IFVuaWNvcm5BcHApOiBVbmljb3JuQXBwIHtcbiAgaWYgKGluc3RhbmNlKSB7XG4gICAgYXBwID0gaW5zdGFuY2U7XG4gIH1cblxuICByZXR1cm4gYXBwID8/PSBjcmVhdGVVbmljb3JuKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VJbmplY3Q8VD4oaWQ6IEluamVjdGlvbktleTxUPik6IFQ7XG5leHBvcnQgZnVuY3Rpb24gdXNlSW5qZWN0PFQ+KGlkOiBJbmplY3Rpb25LZXk8VD4sIGRlZjogVCk6IFQ7XG5leHBvcnQgZnVuY3Rpb24gdXNlSW5qZWN0PFQ+KGlkOiBJbmplY3Rpb25LZXk8VD4sIGRlZj86IFQpOiBUIHwgdW5kZWZpbmVkIHtcbiAgcmV0dXJuIHVzZVVuaWNvcm4oKS5pbmplY3Q8VD4oaWQsIGRlZik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwdXNoVW5pY29yblRvR2xvYmFsKGFwcD86IFVuaWNvcm5BcHApIHtcbiAgLy8gQHRzLWlnbm9yZVxuICB3aW5kb3cudSA9IGFwcCA/PyB1c2VVbmljb3JuKCk7XG59XG4iXSwibmFtZXMiOlsicmVtb3ZlRGF0YSIsImh0bWwiLCJzZWxlY3RvciIsImNhbGxiYWNrIiwiY3NzIiwicXVldWUiLCJ3YWl0Iiwic3ByaW50ZiIsInNpZ24iLCJ2c3ByaW50ZiIsIm0iLCJtb2R1bGUiLCJnZXQiLCJ0eXBlIiwidWkiLCJzdGFjayIsInVyaSIsImFzc2V0Iiwicm91dGUiLCJnbG9iYWwiLCJpc1BsYWluT2JqZWN0IiwicmVxdWlyZSQkMCIsInJlcXVpcmUkJDEiLCJpc05hTiIsImhhc1N5bWJvbHMiLCJtYXgiLCJjb25jYXR0eSIsInNsaWN5IiwiRW1wdHkiLCJpbXBsZW1lbnRhdGlvbiIsInJlcXVpcmUkJDIiLCJyZXF1aXJlJCQzIiwiZ09QRCIsImdldFByb3RvIiwidW5kZWZpbmVkIiwicmVxdWlyZSQkNCIsInJlcXVpcmUkJDUiLCJyZXF1aXJlJCQ2IiwicmVxdWlyZSQkNyIsImFicyIsInJlcXVpcmUkJDgiLCJmbG9vciIsInJlcXVpcmUkJDkiLCJyZXF1aXJlJCQxMCIsIm1pbiIsInJlcXVpcmUkJDExIiwicG93IiwicmVxdWlyZSQkMTIiLCJyb3VuZCIsInJlcXVpcmUkJDEzIiwicmVxdWlyZSQkMTQiLCJyZXF1aXJlJCQxNSIsInJlcXVpcmUkJDE2IiwicmVxdWlyZSQkMTciLCJyZXF1aXJlJCQxOCIsInJlcXVpcmUkJDE5IiwicmVxdWlyZSQkMjAiLCJyZXF1aXJlJCQyMSIsInJlcXVpcmUkJDIyIiwiZG9FdmFsIiwicmVxdWlyZSQkMjMiLCJyZXF1aXJlJCQyNCIsInN0cmluZ1RvUGF0aCIsImdldEJhc2VJbnRyaW5zaWMiLCJjYWxsQm91bmQiLCJmb3JtYXRzIiwiY29tcGFjdFF1ZXVlIiwiYXJyYXlUb09iamVjdCIsIm1lcmdlIiwiZW5jb2RlIiwiY29tcGFjdCIsImlzUmVnRXhwIiwiaXNCdWZmZXIiLCJjb21iaW5lIiwibWF5YmVNYXAiLCJ1dGlscyIsImlzTm9uTnVsbGlzaFByaW1pdGl2ZSIsInN0cmluZ2lmeSIsInNpZGVDaGFubmVsIiwidmFsdWUiLCJub3JtYWxpemVTdHJpbmdpZnlPcHRpb25zIiwibm9ybWFsaXplUGFyc2VPcHRpb25zIiwicGFyc2UiLCJybWRhdGEiLCJwcm90b0NoYWluIiwiZGVjb3JhdG9ycyIsImFwcCJdLCJtYXBwaW5ncyI6IkFBQ08sU0FBUyxjQUFjLEtBQXNDO0FBQ2xFLFNBQU8sT0FBTyxPQUFPLFFBQVEsWUFBWSxDQUFDLE1BQU0sUUFBUSxHQUFHO0FBQzdEO0FBRU8sU0FBUyxVQUFtQyxXQUF1QixTQUFtQjtBQUMzRixNQUFJLE1BQVcsY0FBYyxNQUFNLElBQUksRUFBRSxHQUFHLFdBQVc7QUFFdkQsYUFBVyxVQUFVLFNBQVM7QUFDNUIsUUFBSSxNQUFNLFFBQVEsTUFBTSxHQUFHO0FBQ3pCLFlBQU8sTUFBTSxRQUFRLEdBQUcsSUFBSSxJQUFJLE9BQU8sTUFBTSxJQUFJO0FBQ2pEO0FBQUEsSUFDRjtBQUNBLFFBQUksY0FBYyxNQUFNLEdBQUc7QUFDekIsWUFBTSxFQUFFLEdBQUksY0FBYyxHQUFHLElBQUksTUFBTSxDQUFBLEVBQUM7QUFDeEMsaUJBQVcsT0FBTyxPQUFPLEtBQUssTUFBTSxHQUFHO0FB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YixZQUFZO0FBQUEsRUFDWixXQUFXO0FBQ2I7QUFFTyxNQUFNLGtCQUFrQjtBQUFBLEVBQzdCLE9BQU8sUUFBUUEsTUFBaUI7QUFDOUIsUUFBSUEsS0FBSSxLQUFLO0FBQ1gsTUFBQUEsS0FBSSxNQUFNLEVBQUUsR0FBR0EsS0FBSSxLQUFLLEdBQUcsUUFBQTtBQUFBLElBQzdCLE9BQU87QUFDTCxNQUFBQSxLQUFJLE1BQU07QUFBQSxJQUNaO0FBQUEsRUFDRjtBQUNGO0FDakRBLElBQUk7QUFFRyxTQUFTLGdCQUE0QjtBQUMxQyxXQUFBO0FBQ0EsY0FBQTtBQUVBLFNBQU8sTUFBTSxJQUFJLFdBQUE7QUFDbkI7QUFFTyxTQUFTLDJCQUF1QztBQUNyRCxRQUFNQSxPQUFNLGNBQUE7QUFNWixTQUFPQTtBQUNUO0FBRU8sU0FBUyxXQUFXLFVBQW1DO0FBQzVELE1BQUksVUFBVTtBQUNaLFVBQU07QUFBQSxFQUNSO0FBRUEsU0FBTyxRQUFRLGNBQUE7QUFDakI7QUFJTyxTQUFTLFVBQWEsSUFBcUIsS0FBd0I7QUFDeEUsU0FBTyxXQUFBLEVBQWEsT0FBVSxJQUFJLEdBQUc7QUFDdkM7QUFFTyxTQUFTLG9CQUFvQkEsTUFBa0I7QUFFcEQsU0FBTyxJQUFJQSxRQUFPLFdBQUE7QUFDcEI7IiwieF9nb29nbGVfaWdub3JlTGlzdCI6WzQsNSw2LDcsOCw5LDEwLDEzLDM5LDQxLDQyLDQzLDQ0LDQ1LDQ2LDQ3LDQ4LDQ5LDUwLDUxLDUyLDUzLDU0LDU1LDU2LDU3LDU4LDU5LDYwLDYxLDYyLDYzLDY0LDY1LDY2LDY3LDY4LDY5LDcwLDcxLDcyLDczLDc0LDc1LDc2LDc3LDc4LDc5LDgwLDgxLDgyLDgzLDg0LDg4XX0=
