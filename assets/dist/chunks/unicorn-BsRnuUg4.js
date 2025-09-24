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
  inject(plugin, def) {
    if (!typeof this.registry.has(plugin)) {
      if (def !== void 0) {
        return def;
      }
      throw new Error(`Injectable: ${plugin.name} not found.`);
    }
    return this.registry.get(plugin);
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
function animateTo(element, styles, options = {}) {
  element = this.app.selectOne(element);
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
function domready(callback = void 0) {
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
function forceArray(item) {
  if (Array.isArray(item)) {
    return item;
  } else {
    return [item];
  }
}
function debounce(handler, wait = 1) {
  let timer, result;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => result = handler.call(this, ...args), wait);
    return result;
  };
}
function throttle(handler, wait = 1) {
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
function doImport(src) {
  return import(src);
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
async function useCssImport(...src) {
  let modules = await useImport(...src);
  modules = forceArray(modules);
  const styles = modules.map((module2) => module2.default);
  return injectCssToDocument(...styles);
}
const stacks = {};
function useStack(name = "default", store = []) {
  return stacks[name] ??= createStack(store);
}
function createStack(store = []) {
  return stack(store);
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
async function loadAlpine(callback) {
  if (callback) {
    prepareAlpine(callback);
  }
  let m = await useImport("@alpinejs");
  return m;
}
async function initAlpine(directive) {
  await loadAlpine();
  selectAll(`[${directive}]`, (el) => {
    const code = el.getAttribute(directive) || "";
    el.removeAttribute(directive);
    Alpine.mutateDom(() => {
      el.setAttribute("x-data", code);
    });
    Alpine.initTree(el);
  });
}
function prepareAlpine(callback) {
  if (window.Alpine) {
    callback();
  } else {
    document.addEventListener("alpine:init", callback);
  }
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
  const r = await animation.finished;
  ele.style.display = "none";
  return r;
}
function slideDown(target, duration = 300, display = "block") {
  const ele = selectOne(target);
  if (!ele) {
    return Promise.resolve();
  }
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
    ele.style.overflow = "visible";
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
async function colorPicker(selector, options = {}) {
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
function disableOnSubmit(formSelector = "#admin-form", buttonSelector = "", options = {}) {
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
    console.log(e.submitter);
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
function disableIfStackNotEmpty(buttonSelector = "[data-task=save]", stackName = "uploading") {
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
function keepAlive(url, time = 6e4) {
  const aliveHandle = window.setInterval(() => fetch(url), time);
  return () => {
    clearInterval(aliveHandle);
  };
}
async function vueComponentField(selector, value, options = {}) {
  const m = await useImport("@unicorn/field/vue-component-field.js");
  if (selector) {
    m.VueComponentField.init(selector, value, options);
  }
  return m;
}
const queues = {};
function useQueue(name = "default", maxRunning = 1) {
  return queues[name] ??= createQueue(maxRunning);
}
function createQueue(maxRunning = 1) {
  return queue(maxRunning);
}
async function useForm(ele, options = {}) {
  const { UnicornFormElement } = await import("./form-CUXoDZfg.js");
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
async function useGrid(ele, options = {}) {
  const { UnicornGridElement } = await import("./grid-DrGEIlYL.js");
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
async function useHttpClient(config) {
  const { UnicornHttpClient } = await import("./http-client-DsTYZuZ1.js");
  if ("interceptors" in config) {
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
async function useListDependent(element, dependent, options = {}) {
  const module2 = await import("./list-dependent-CtraOON0.js");
  await module2.ready;
  if (element) {
    const { ListDependent } = module2;
    return ListDependent.handle(element, dependent, options);
  }
  return module2;
}
function useFieldFlatpickr() {
  return import("./field-flatpickr-CmuuFxgq.js");
}
async function useTomSelect(selector, options = {}, theme = "bootstrap5") {
  const modules = await useImport(
    "@vendor/tom-select/dist/js/tom-select.complete.min.js",
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
  return modules;
}
async function useIframeModal() {
  const module2 = await import("./iframe-modal-C6iVuOi7.js");
  await module2.ready;
  return module2;
}
async function useS3Uploader(name, options = {}) {
  const module2 = await import("./s3-uploader-DLfP0IYj.js");
  if (!name) {
    return module2;
  }
  const { get } = module2;
  return get(name, options);
}
async function useShowOn() {
  const module2 = await import("./show-on-BPTm45Rm.js");
  await module2.ready;
  return module2;
}
async function useUIBootstrap5(install = false) {
  const { UIBootstrap5 } = await import("./ui-bootstrap5-1mMJa12V.js");
  const theme = UIBootstrap5.get();
  if (install) {
    useUITheme(theme);
  }
  return theme;
}
async function useFormValidation(selector) {
  const module2 = await import("./validation-DxoB36Pe.js");
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
function useFieldCascadeSelect() {
  return import("./field-cascade-select-CFohM_Sq.js");
}
async function useFieldFileDrag() {
  const module2 = await import("./field-file-drag-BWMYsQAm.js");
  await module2.ready;
  return module2;
}
function useFieldModalSelect() {
  return import("./field-modal-select-DrmRJdjf.js");
}
async function useCheckboxesMultiSelect(selector, options = {}) {
  const m = await import("./checkboxes-multi-select-DKahYxmi.js");
  if (selector) {
    m.CheckboxesMultiSelect.handle(selector, options);
  }
  return m;
}
function useFieldRepeatable() {
  return import("./field-repeatable-Xl_l5r4g.js");
}
function useFieldSingleImageDrag() {
  return import("./field-single-image-drag-CW6mWxdH.js");
}
let app;
function createUnicorn() {
  polyfill();
  return app = new UnicornApp();
}
function createUnicornWithPlugins() {
  const app2 = createUnicorn();
  return app2;
}
function setUnicornApp(inc) {
  app = inc;
}
function useUnicornApp() {
  return app ??= createUnicorn();
}
function useInject(name, def) {
  return useUnicornApp().inject(name, def);
}
export {
  useLang as $,
  prepareAlpine as A,
  initAlpine as B,
  sleep as C,
  createUnicorn as D,
  EventMixin as E,
  createUnicornWithPlugins as F,
  setUnicornApp as G,
  useUnicornApp as H,
  useInject as I,
  removeData as J,
  animateTo as K,
  base64UrlEncode as L,
  Mixin as M,
  base64UrlDecode as N,
  tid as O,
  randomBytes as P,
  randomBytesString as Q,
  serial as R,
  domready as S,
  getBoundedInstanceList as T,
  delegate as U,
  forceArray as V,
  debounce as W,
  throttle as X,
  isDebug as Y,
  nextTick as Z,
  __ as _,
  slideUp as a,
  doImport as a0,
  useSeriesImport as a1,
  AlertAdapter as a2,
  useUI as a3,
  UnicornUI as a4,
  renderMessage as a5,
  clearMessages as a6,
  notify as a7,
  clearNotifies as a8,
  mark as a9,
  useFieldCascadeSelect as aA,
  useFieldFileDrag as aB,
  useFieldModalSelect as aC,
  useCheckboxesMultiSelect as aD,
  useFieldRepeatable as aE,
  useFieldSingleImageDrag as aF,
  multiUploader as aa,
  modalTree as ab,
  slideToggle as ac,
  colorPicker as ad,
  disableOnSubmit as ae,
  disableIfStackNotEmpty as af,
  keepAlive as ag,
  vueComponentField as ah,
  useQueue as ai,
  createQueue as aj,
  useStack as ak,
  createStack as al,
  useForm as am,
  useGrid as an,
  useWebDirective as ao,
  useListDependent as ap,
  useFieldFlatpickr as aq,
  useTomSelect as ar,
  useIframeModal as as,
  useS3Uploader as at,
  useShowOn as au,
  useUIBootstrap5 as av,
  useFormValidation as aw,
  useFormValidationSync as ax,
  useFieldValidationSync as ay,
  addGlobalValidator as az,
  simpleConfirm as b,
  deleteConfirm as c,
  data as d,
  simpleAlert as e,
  useUniDirective as f,
  getBoundedInstance as g,
  h,
  selectOne as i,
  useHttpClient as j,
  html as k,
  loadAlpine as l,
  mergeDeep as m,
  useCssImport as n,
  module as o,
  selectAll as p,
  fadeIn as q,
  fadeOut as r,
  slideDown as s,
  trans as t,
  useImport as u,
  useUITheme as v,
  uid as w,
  useLoadedHttpClient as x,
  injectCssToDocument as y,
  highlight as z
};
