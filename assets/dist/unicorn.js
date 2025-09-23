import crypto from "node:crypto";
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
function animateTo$1(element, styles, options = {}) {
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
function base64UrlEncode(string) {
  return btoa(String(string)).replace(/\+/, "-").replace(new RegExp("\\/"), "_").replace(/=+$/, "");
}
function base64UrlDecode(string) {
  return atob(
    String(string).replace(/-/, "+").replace(/_/, "/")
  );
}
function uid(prefix = "", timebase = false) {
  if (timebase) {
    const start = performance?.timeOrigin ? Math.round(performance.timeOrigin) : performance.timing.navigationStart;
    const time = start * 1e5 + performance.now() * 100;
    return prefix + time.toString(12) + randomBytesHex(4);
  }
  return prefix + randomBytesHex(12);
}
function tid(prefix = "") {
  return uid(prefix, true);
}
function randomBytesHex(size = 12) {
  const bytes = randomBytes(size);
  return [...bytes].map((x) => x.toString(16).padStart(2, "0")).join("");
}
function randomBytes(size) {
  if (typeof window !== "undefined" && window.crypto && window.crypto.getRandomValues) {
    const arr = new Uint8Array(size);
    window.crypto.getRandomValues(arr);
    return arr;
  }
  return new Uint8Array(crypto.randomBytes(size));
}
let globalSerial = 1;
function serial() {
  return globalSerial++;
}
const disconnectKey = "_webDirectiveDisconnectors";
const defaultOptions = {
  prefix: "w-"
};
class WebDirective {
  constructor(options = {}) {
    this.directives = {};
    this.instances = {};
    this.listenTarget = document.body;
    this.hooks = {
      mounted: {
        before: (directive, node) => {
          node[disconnectKey] = node[disconnectKey] || {};
          node[disconnectKey][directive] = this.observeChildren(node);
          this.instances[directive] = this.instances[directive] || [];
          this.instances[directive].push(node);
        }
      },
      unmounted: {
        after: (directive, node) => {
          if (!node[disconnectKey]) {
            return;
          }
          if (node[disconnectKey][directive]) {
            node[disconnectKey][directive]();
            delete node[disconnectKey][directive];
          }
        }
      }
    };
    this.options = Object.assign({}, defaultOptions, options);
  }
  register(name, handler) {
    const directive = this.getDirectiveAttrName(name);
    this.directives[directive] = handler;
    if (!this.disconnectCallback) {
      return;
    }
    this.mountDirectiveInitial(directive);
  }
  mountDirectiveInitial(directive) {
    [].forEach.call(this.listenTarget.querySelectorAll("[" + directive + "]"), (el) => {
      this.runDirectiveIfExists(directive, el, "mounted");
    });
  }
  remove(name) {
    const directive = this.getDirectiveAttrName(name);
    if (this.instances[directive]) {
      this.instances[directive].forEach((node) => {
        this.runDirectiveIfExists(directive, node, "unmounted");
      });
      delete this.instances[directive];
    }
    delete this.directives[directive];
  }
  getPrefix() {
    return this.options.prefix;
  }
  getDirectiveAttrName(name) {
    return `${this.getPrefix()}${name}`;
  }
  observeRoot(element) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        [].forEach.call(mutation.addedNodes, (node) => {
          this.findDirectivesFromNode(node).forEach((directive) => {
            this.runDirectiveIfExists(directive, node, "mounted", mutation);
          });
          for (const directive in this.directives) {
            if ("querySelectorAll" in node) {
              node.querySelectorAll(`[${directive}]`).forEach((node2) => {
                this.runDirectiveIfExists(directive, node2, "mounted", mutation);
              });
            }
          }
        });
        [].forEach.call(mutation.removedNodes, (node) => {
          this.findDirectivesFromNode(node).forEach((directive) => {
            this.runDirectiveIfExists(directive, node, "unmounted", mutation);
          });
        });
        if (mutation.type === "attributes" && mutation.oldValue == null) {
          this.runDirectiveIfExists(mutation.attributeName, mutation.target, "mounted", mutation);
        }
      });
    });
    observer.observe(element, {
      attributes: true,
      attributeOldValue: true,
      childList: true,
      characterData: false,
      subtree: true
    });
    return () => {
      observer.disconnect();
    };
  }
  observeChildren(element) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && !mutation.target.getAttribute(mutation.attributeName)) {
          this.runDirectiveIfExists(mutation.attributeName, mutation.target, "unmounted", mutation);
        }
        this.findDirectivesFromNode(mutation.target).forEach((directive) => {
          if (mutation.type === "attributes" || mutation.type === "childList") {
            this.runDirectiveIfExists(directive, mutation.target, "updated", mutation);
          }
        });
      });
    });
    observer.observe(element, {
      attributes: true,
      childList: true,
      characterData: true,
      attributeOldValue: true,
      characterDataOldValue: true,
      attributeFilter: Object.keys(this.directives)
    });
    return () => {
      observer.disconnect();
    };
  }
  listen(target) {
    if (this.disconnectCallback) {
      throw new Error("This instance has already listening.");
    }
    this.listenTarget = target || document.body;
    this.disconnectCallback = this.observeRoot(this.listenTarget);
    for (const directive in this.directives) {
      this.mountDirectiveInitial(directive);
    }
  }
  disconnect() {
    if (this.disconnectCallback) {
      this.disconnectCallback();
      this.disconnectCallback = void 0;
    }
  }
  getDirective(directive) {
    return this.directives[directive];
  }
  runDirectiveIfExists(directive, node, task, mutation = void 0) {
    const handler = this.getDirective(directive);
    if (handler && task in handler) {
      if (this.hooks?.[task]?.before) {
        this.hooks[task]?.before?.(directive, node);
      }
      handler[task]?.(node, {
        directive,
        node,
        value: node.getAttribute(directive),
        oldValue: mutation?.oldValue,
        mutation,
        dir: handler
      });
      if (this.hooks?.[task]?.after) {
        this.hooks[task]?.after?.(directive, node);
      }
    }
  }
  findDirectivesFromNode(node) {
    const directives = [];
    if (!node.getAttributeNames) {
      return [];
    }
    node.getAttributeNames().forEach((e) => {
      if (e.startsWith(this.getPrefix())) {
        directives.push(e);
      }
    });
    return directives;
  }
}
let instances = {};
function useWebDirective(name = "unicorn", options = {}) {
  return instances[name] ??= createWebDirective(Object.assign({}, options, { prefix: "uni-" }));
}
function useUniDirective(name, handler, wdInstance = "unicorn") {
  const wd = typeof wdInstance === "string" ? useWebDirective(wdInstance) : wdInstance;
  wd.register(name, handler);
}
function createWebDirective(options = {}) {
  const wd = new WebDirective(options);
  wd.listen();
  return wd;
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
function singletonModule(ele, name, callback = () => null) {
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
function uri(type) {
  return data("unicorn.uri")[type];
}
function asset(type) {
  return uri("asset")[type];
}
function html(html2) {
  const div = document.createElement("div");
  div.innerHTML = html2;
  return div.children[0];
}
function addUriBase(uri2, type = "path") {
  if (uri2.substring(0, 2) === "//" || uri2.substring(0, 4) === "http") {
    return uri2;
  }
  return asset(type) + "/" + uri2;
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
const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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
function confirm(message) {
  message = message || "Are you sure?";
  return new Promise((resolve) => {
    resolve(window.confirm(message));
  });
}
function alert(title, text = "", type = "info") {
  if (text) {
    title += " | " + text;
  }
  window.alert(title);
  return Promise.resolve(true);
}
function nextTick(callback) {
  return Promise.resolve().then(callback ?? (() => null));
}
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
function genRandomString(length) {
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
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
  doImport(src) {
    return import(src);
  }
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
  async importSeries(...src) {
    const modules = [];
    for (const source of src) {
      const m = await this.import(...forceArray(source));
      modules.push(m);
    }
    return modules;
  }
  async importCSS(...src) {
    let modules = await this.import(...src);
    modules = forceArray(modules);
    const styles = modules.map((module2) => module2.default);
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, ...styles];
  }
}
var freeGlobal = typeof global == "object" && global && /* @__PURE__ */ (() => global.Object)() === Object && global;
var freeSelf = typeof self == "object" && self && /* @__PURE__ */ (() => self.Object)() === Object && self;
var root = freeGlobal || freeSelf || /* @__PURE__ */ Function("return this")();
var Symbol$1 = /* @__PURE__ */ (() => root.Symbol)();
var objectProto$9 = /* @__PURE__ */ (() => Object.prototype)();
var hasOwnProperty$7 = /* @__PURE__ */ (() => objectProto$9.hasOwnProperty)();
var nativeObjectToString$1 = /* @__PURE__ */ (() => objectProto$9.toString)();
var symToStringTag$1 = Symbol$1 ? /* @__PURE__ */ (() => Symbol$1.toStringTag)() : void 0;
function getRawTag(value) {
  var isOwn = hasOwnProperty$7.call(value, symToStringTag$1), tag = value[symToStringTag$1];
  try {
    value[symToStringTag$1] = void 0;
    var unmasked = true;
  } catch (e) {
  }
  var result = nativeObjectToString$1.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}
var objectProto$8 = /* @__PURE__ */ (() => Object.prototype)();
var nativeObjectToString = /* @__PURE__ */ (() => objectProto$8.toString)();
function objectToString(value) {
  return nativeObjectToString.call(value);
}
var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
var symToStringTag = Symbol$1 ? /* @__PURE__ */ (() => Symbol$1.toStringTag)() : void 0;
function baseGetTag(value) {
  if (value == null) {
    return value === void 0 ? undefinedTag : nullTag;
  }
  return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}
function isObjectLike(value) {
  return value != null && typeof value == "object";
}
var isArray = /* @__PURE__ */ (() => Array.isArray)();
function isObject(value) {
  var type = typeof value;
  return value != null && (type == "object" || type == "function");
}
function identity(value) {
  return value;
}
var asyncTag = "[object AsyncFunction]", funcTag$1 = "[object Function]", genTag = "[object GeneratorFunction]", proxyTag = "[object Proxy]";
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  var tag = baseGetTag(value);
  return tag == funcTag$1 || tag == genTag || tag == asyncTag || tag == proxyTag;
}
var coreJsData = /* @__PURE__ */ (() => root["__core-js_shared__"])();
var maskSrcKey = /* @__PURE__ */ (function() {
  var uid2 = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
  return uid2 ? "Symbol(src)_1." + uid2 : "";
})();
function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}
var funcProto$2 = /* @__PURE__ */ (() => Function.prototype)();
var funcToString$2 = /* @__PURE__ */ (() => funcProto$2.toString)();
function toSource(func) {
  if (func != null) {
    try {
      return funcToString$2.call(func);
    } catch (e) {
    }
    try {
      return func + "";
    } catch (e) {
    }
  }
  return "";
}
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
var reIsHostCtor = /^\[object .+?Constructor\]$/;
var funcProto$1 = /* @__PURE__ */ (() => Function.prototype)(), objectProto$7 = /* @__PURE__ */ (() => Object.prototype)();
var funcToString$1 = /* @__PURE__ */ (() => funcProto$1.toString)();
var hasOwnProperty$6 = /* @__PURE__ */ (() => objectProto$7.hasOwnProperty)();
var reIsNative = /* @__PURE__ */ RegExp(
  "^" + /* @__PURE__ */ funcToString$1.call(hasOwnProperty$6).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}
function getValue(object, key) {
  return object == null ? void 0 : object[key];
}
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : void 0;
}
var objectCreate = /* @__PURE__ */ (() => Object.create)();
var baseCreate = /* @__PURE__ */ (function() {
  function object() {
  }
  return function(proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object();
    object.prototype = void 0;
    return result;
  };
})();
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0:
      return func.call(thisArg);
    case 1:
      return func.call(thisArg, args[0]);
    case 2:
      return func.call(thisArg, args[0], args[1]);
    case 3:
      return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}
function copyArray(source, array) {
  var index = -1, length = source.length;
  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}
var HOT_COUNT = 800, HOT_SPAN = 16;
var nativeNow = /* @__PURE__ */ (() => Date.now)();
function shortOut(func) {
  var count = 0, lastCalled = 0;
  return function() {
    var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(void 0, arguments);
  };
}
function constant(value) {
  return function() {
    return value;
  };
}
var defineProperty = /* @__PURE__ */ (function() {
  try {
    var func = getNative(Object, "defineProperty");
    func({}, "", {});
    return func;
  } catch (e) {
  }
})();
var baseSetToString = !defineProperty ? identity : function(func, string) {
  return defineProperty(func, "toString", {
    "configurable": true,
    "enumerable": false,
    "value": constant(string),
    "writable": true
  });
};
var setToString = /* @__PURE__ */ shortOut(baseSetToString);
var MAX_SAFE_INTEGER$1 = 9007199254740991;
var reIsUint = /^(?:0|[1-9]\d*)$/;
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER$1 : length;
  return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
}
function baseAssignValue(object, key, value) {
  if (key == "__proto__" && defineProperty) {
    defineProperty(object, key, {
      "configurable": true,
      "enumerable": true,
      "value": value,
      "writable": true
    });
  } else {
    object[key] = value;
  }
}
function eq(value, other) {
  return value === other || value !== value && other !== other;
}
var objectProto$6 = /* @__PURE__ */ (() => Object.prototype)();
var hasOwnProperty$5 = /* @__PURE__ */ (() => objectProto$6.hasOwnProperty)();
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty$5.call(object, key) && eq(objValue, value)) || value === void 0 && !(key in object)) {
    baseAssignValue(object, key, value);
  }
}
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});
  var index = -1, length = props.length;
  while (++index < length) {
    var key = props[index];
    var newValue = void 0;
    if (newValue === void 0) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}
var nativeMax = /* @__PURE__ */ (() => Math.max)();
function overRest(func, start, transform) {
  start = nativeMax(start === void 0 ? func.length - 1 : start, 0);
  return function() {
    var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array(length);
    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}
function baseRest(func, start) {
  return setToString(overRest(func, start, identity), func + "");
}
var MAX_SAFE_INTEGER = 9007199254740991;
function isLength(value) {
  return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == "number" ? isArrayLike(object) && isIndex(index, object.length) : type == "string" && index in object) {
    return eq(object[index], value);
  }
  return false;
}
function createAssigner(assigner) {
  return baseRest(function(object, sources) {
    var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : void 0, guard = length > 2 ? sources[2] : void 0;
    customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : void 0;
    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? void 0 : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}
var objectProto$5 = /* @__PURE__ */ (() => Object.prototype)();
function isPrototype(value) {
  var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto$5;
  return value === proto;
}
function baseTimes(n, iteratee) {
  var index = -1, result = Array(n);
  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}
var argsTag$1 = "[object Arguments]";
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag$1;
}
var objectProto$4 = /* @__PURE__ */ (() => Object.prototype)();
var hasOwnProperty$4 = /* @__PURE__ */ (() => objectProto$4.hasOwnProperty)();
var propertyIsEnumerable = /* @__PURE__ */ (() => objectProto$4.propertyIsEnumerable)();
var isArguments = /* @__PURE__ */ baseIsArguments(/* @__PURE__ */ (function() {
  return arguments;
})()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty$4.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
};
function stubFalse() {
  return false;
}
var freeExports$2 = typeof exports == "object" && exports && !/* @__PURE__ */ (() => exports.nodeType)() && exports;
var freeModule$2 = freeExports$2 && typeof module == "object" && module && !/* @__PURE__ */ (() => module.nodeType)() && module;
var moduleExports$2 = freeModule$2 && /* @__PURE__ */ (() => freeModule$2.exports)() === freeExports$2;
var Buffer$1 = moduleExports$2 ? /* @__PURE__ */ (() => root.Buffer)() : void 0;
var nativeIsBuffer = Buffer$1 ? /* @__PURE__ */ (() => Buffer$1.isBuffer)() : void 0;
var isBuffer = nativeIsBuffer || stubFalse;
var argsTag = "[object Arguments]", arrayTag = "[object Array]", boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", funcTag = "[object Function]", mapTag = "[object Map]", numberTag = "[object Number]", objectTag$1 = "[object Object]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", weakMapTag = "[object WeakMap]";
var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag$1] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
function baseIsTypedArray(value) {
  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}
var freeExports$1 = typeof exports == "object" && exports && !/* @__PURE__ */ (() => exports.nodeType)() && exports;
var freeModule$1 = freeExports$1 && typeof module == "object" && module && !/* @__PURE__ */ (() => module.nodeType)() && module;
var moduleExports$1 = freeModule$1 && /* @__PURE__ */ (() => freeModule$1.exports)() === freeExports$1;
var freeProcess = moduleExports$1 && /* @__PURE__ */ (() => freeGlobal.process)();
var nodeUtil = /* @__PURE__ */ (function() {
  try {
    var types = freeModule$1 && freeModule$1.require && freeModule$1.require("util").types;
    if (types) {
      return types;
    }
    return freeProcess && freeProcess.binding && freeProcess.binding("util");
  } catch (e) {
  }
})();
var nodeIsTypedArray = nodeUtil && /* @__PURE__ */ (() => nodeUtil.isTypedArray)();
var isTypedArray = nodeIsTypedArray ? /* @__PURE__ */ baseUnary(nodeIsTypedArray) : baseIsTypedArray;
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
  for (var key in value) {
    if (!(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
    (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
    isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
    isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}
var objectProto$3 = /* @__PURE__ */ (() => Object.prototype)();
var hasOwnProperty$3 = /* @__PURE__ */ (() => objectProto$3.hasOwnProperty)();
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object), result = [];
  for (var key in object) {
    if (!(key == "constructor" && (isProto || !hasOwnProperty$3.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeysIn(object);
}
var nativeCreate = /* @__PURE__ */ getNative(Object, "create");
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}
var HASH_UNDEFINED$1 = "__lodash_hash_undefined__";
var objectProto$2 = /* @__PURE__ */ (() => Object.prototype)();
var hasOwnProperty$2 = /* @__PURE__ */ (() => objectProto$2.hasOwnProperty)();
function hashGet(key) {
  var data2 = this.__data__;
  if (nativeCreate) {
    var result = data2[key];
    return result === HASH_UNDEFINED$1 ? void 0 : result;
  }
  return hasOwnProperty$2.call(data2, key) ? data2[key] : void 0;
}
var objectProto$1 = /* @__PURE__ */ (() => Object.prototype)();
var hasOwnProperty$1 = /* @__PURE__ */ (() => objectProto$1.hasOwnProperty)();
function hashHas(key) {
  var data2 = this.__data__;
  return nativeCreate ? data2[key] !== void 0 : hasOwnProperty$1.call(data2, key);
}
var HASH_UNDEFINED = "__lodash_hash_undefined__";
function hashSet(key, value) {
  var data2 = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data2[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
  return this;
}
function Hash(entries) {
  var index = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
Hash.prototype.clear = hashClear;
Hash.prototype["delete"] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}
var arrayProto = /* @__PURE__ */ (() => Array.prototype)();
var splice = /* @__PURE__ */ (() => arrayProto.splice)();
function listCacheDelete(key) {
  var data2 = this.__data__, index = assocIndexOf(data2, key);
  if (index < 0) {
    return false;
  }
  var lastIndex = data2.length - 1;
  if (index == lastIndex) {
    data2.pop();
  } else {
    splice.call(data2, index, 1);
  }
  --this.size;
  return true;
}
function listCacheGet(key) {
  var data2 = this.__data__, index = assocIndexOf(data2, key);
  return index < 0 ? void 0 : data2[index][1];
}
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}
function listCacheSet(key, value) {
  var data2 = this.__data__, index = assocIndexOf(data2, key);
  if (index < 0) {
    ++this.size;
    data2.push([key, value]);
  } else {
    data2[index][1] = value;
  }
  return this;
}
function ListCache(entries) {
  var index = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
ListCache.prototype.clear = listCacheClear;
ListCache.prototype["delete"] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;
var Map$1 = /* @__PURE__ */ getNative(root, "Map");
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    "hash": new Hash(),
    "map": new (Map$1 || ListCache)(),
    "string": new Hash()
  };
}
function isKeyable(value) {
  var type = typeof value;
  return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
}
function getMapData(map, key) {
  var data2 = map.__data__;
  return isKeyable(key) ? data2[typeof key == "string" ? "string" : "hash"] : data2.map;
}
function mapCacheDelete(key) {
  var result = getMapData(this, key)["delete"](key);
  this.size -= result ? 1 : 0;
  return result;
}
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}
function mapCacheSet(key, value) {
  var data2 = getMapData(this, key), size = data2.size;
  data2.set(key, value);
  this.size += data2.size == size ? 0 : 1;
  return this;
}
function MapCache(entries) {
  var index = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype["delete"] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;
var getPrototype = /* @__PURE__ */ overArg(/* @__PURE__ */ (() => Object.getPrototypeOf)(), Object);
var objectTag = "[object Object]";
var funcProto = /* @__PURE__ */ (() => Function.prototype)(), objectProto = /* @__PURE__ */ (() => Object.prototype)();
var funcToString = /* @__PURE__ */ (() => funcProto.toString)();
var hasOwnProperty = /* @__PURE__ */ (() => objectProto.hasOwnProperty)();
var objectCtorString = /* @__PURE__ */ funcToString.call(Object);
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
  return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
}
function stackClear() {
  this.__data__ = new ListCache();
  this.size = 0;
}
function stackDelete(key) {
  var data2 = this.__data__, result = data2["delete"](key);
  this.size = data2.size;
  return result;
}
function stackGet(key) {
  return this.__data__.get(key);
}
function stackHas(key) {
  return this.__data__.has(key);
}
var LARGE_ARRAY_SIZE = 200;
function stackSet(key, value) {
  var data2 = this.__data__;
  if (data2 instanceof ListCache) {
    var pairs = data2.__data__;
    if (!Map$1 || pairs.length < LARGE_ARRAY_SIZE - 1) {
      pairs.push([key, value]);
      this.size = ++data2.size;
      return this;
    }
    data2 = this.__data__ = new MapCache(pairs);
  }
  data2.set(key, value);
  this.size = data2.size;
  return this;
}
function Stack(entries) {
  var data2 = this.__data__ = new ListCache(entries);
  this.size = data2.size;
}
Stack.prototype.clear = stackClear;
Stack.prototype["delete"] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;
var freeExports = typeof exports == "object" && exports && !/* @__PURE__ */ (() => exports.nodeType)() && exports;
var freeModule = freeExports && typeof module == "object" && module && !/* @__PURE__ */ (() => module.nodeType)() && module;
var moduleExports = freeModule && /* @__PURE__ */ (() => freeModule.exports)() === freeExports;
var Buffer = moduleExports ? /* @__PURE__ */ (() => root.Buffer)() : void 0;
Buffer ? /* @__PURE__ */ (() => Buffer.allocUnsafe)() : void 0;
function cloneBuffer(buffer, isDeep) {
  {
    return buffer.slice();
  }
}
var Uint8Array$1 = /* @__PURE__ */ (() => root.Uint8Array)();
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array$1(result).set(new Uint8Array$1(arrayBuffer));
  return result;
}
function cloneTypedArray(typedArray, isDeep) {
  var buffer = cloneArrayBuffer(typedArray.buffer);
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}
function initCloneObject(object) {
  return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
}
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
    while (length--) {
      var key = props[++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}
var baseFor = /* @__PURE__ */ createBaseFor();
function assignMergeValue(object, key, value) {
  if (value !== void 0 && !eq(object[key], value) || value === void 0 && !(key in object)) {
    baseAssignValue(object, key, value);
  }
}
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}
function safeGet(object, key) {
  if (key === "constructor" && typeof object[key] === "function") {
    return;
  }
  if (key == "__proto__") {
    return;
  }
  return object[key];
}
function toPlainObject(value) {
  return copyObject(value, keysIn(value));
}
function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = safeGet(object, key), srcValue = safeGet(source, key), stacked = stack.get(srcValue);
  if (stacked) {
    assignMergeValue(object, key, stacked);
    return;
  }
  var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack) : void 0;
  var isCommon = newValue === void 0;
  if (isCommon) {
    var isArr = isArray(srcValue), isBuff = !isArr && isBuffer(srcValue), isTyped = !isArr && !isBuff && isTypedArray(srcValue);
    newValue = srcValue;
    if (isArr || isBuff || isTyped) {
      if (isArray(objValue)) {
        newValue = objValue;
      } else if (isArrayLikeObject(objValue)) {
        newValue = copyArray(objValue);
      } else if (isBuff) {
        isCommon = false;
        newValue = cloneBuffer(srcValue);
      } else if (isTyped) {
        isCommon = false;
        newValue = cloneTypedArray(srcValue);
      } else {
        newValue = [];
      }
    } else if (isPlainObject(srcValue) || isArguments(srcValue)) {
      newValue = objValue;
      if (isArguments(objValue)) {
        newValue = toPlainObject(objValue);
      } else if (!isObject(objValue) || isFunction(objValue)) {
        newValue = initCloneObject(srcValue);
      }
    } else {
      isCommon = false;
    }
  }
  if (isCommon) {
    stack.set(srcValue, newValue);
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
    stack["delete"](srcValue);
  }
  assignMergeValue(object, key, newValue);
}
function baseMerge(object, source, srcIndex, customizer, stack) {
  if (object === source) {
    return;
  }
  baseFor(source, function(srcValue, key) {
    stack || (stack = new Stack());
    if (isObject(srcValue)) {
      baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
    } else {
      var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + "", object, source, stack) : void 0;
      if (newValue === void 0) {
        newValue = srcValue;
      }
      assignMergeValue(object, key, newValue);
    }
  }, keysIn);
}
function customDefaultsMerge(objValue, srcValue, key, object, source, stack) {
  if (isObject(objValue) && isObject(srcValue)) {
    stack.set(srcValue, objValue);
    baseMerge(objValue, srcValue, void 0, customDefaultsMerge, stack);
    stack["delete"](srcValue);
  }
  return objValue;
}
var mergeWith = /* @__PURE__ */ createAssigner(function(object, source, srcIndex, customizer) {
  baseMerge(object, source, srcIndex, customizer);
});
var defaultsDeep = /* @__PURE__ */ baseRest(function(args) {
  args.push(void 0, customDefaultsMerge);
  return apply(mergeWith, void 0, args);
});
function useUI() {
  return useInject(UnicornUI);
}
class UnicornUI {
  constructor(app) {
    this.app = app;
  }
  theme;
  aliveHandle;
  static get is() {
    return "ui";
  }
  static install(app) {
    new this(app);
  }
  static get defaultOptions() {
    return {
      messageSelector: ".message-wrap"
    };
  }
  installTheme(theme) {
    this.theme = theme;
  }
  async loadAlpine(callback) {
    if (callback) {
      this.prepareAlpine(callback);
    }
    let m = await this.app.import("@alpinejs");
    return m;
  }
  async initAlpine(directive) {
    await this.loadAlpine();
    selectAll(`[${directive}]`, (el) => {
      const code = el.getAttribute(directive) || "";
      el.removeAttribute(directive);
      Alpine.mutateDom(() => {
        el.setAttribute("x-data", code);
      });
      Alpine.initTree(el);
    });
  }
  /**
   * Before Alpine init
   */
  prepareAlpine(callback) {
    if (window.Alpine) {
      callback();
    } else {
      document.addEventListener("alpine:init", callback);
    }
  }
  /**
   * Render Messages.
   */
  renderMessage(messages, type = "info") {
    this.theme.renderMessage(messages, type);
  }
  /**
   * Clear messages.
   */
  clearMessages() {
    this.theme.clearMessages();
  }
  /**
   * Show notify.
   */
  notify(messages, type = "info") {
    this.theme.renderMessage(messages, type);
  }
  /**
   * Clear notifies.
   */
  clearNotifies() {
    this.theme.clearMessages();
  }
  async mark(selector, keyword = "", options = {}) {
    const modules = await this.app.import("@vendor/mark.js/dist/mark.min.js");
    if (selector != null) {
      const instance = new Mark(selector);
      instance.mark(keyword, options);
    }
    return modules;
  }
  /**
   * @see https://tom-select.js.org/
   */
  async tomSelect(selector, options = {}, theme = "bootstrap5") {
    const modules = await this.app.import(
      "@vendor/tom-select/dist/js/tom-select.complete.min.js",
      this.app.importCSS(`@vendor/tom-select/dist/css/tom-select.${theme}.min.css`)
    );
    if (selector) {
      singletonModule(
        selector,
        "tom.select",
        (ele) => {
          options = defaultsDeep(options, {
            allowEmptyOption: true,
            maxOptions: null,
            plugins: {
              caret_position: {},
              clear_button: {}
            }
          });
          if (ele.multiple) {
            options.plugins.remove_button = {};
          } else {
            options.plugins.dropdown_input = {};
          }
          class UnicornTomSelect extends TomSelect {
            syncOptionsWithoutKeepSelected() {
              const oldValue = ele.value;
              this.clear(), this.clearOptions(), this.sync();
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
  /**
   * Flatpickr
   */
  flatpickr() {
    return this.app.import("@unicorn/ui/flatpickr-components.js");
  }
  async listDependent(element, dependent, options = {}) {
    const module2 = await this.app.import("@unicorn/ui/list-dependent.js");
    if (element) {
      module2.ListDependent.handle(element, dependent, options);
    }
    return module2;
  }
  /**
   * Cascade Select
   */
  cascadeSelect() {
    return this.app.import("@unicorn/field/cascade-select.js");
  }
  /**
   * Single Drag Image
   */
  sid() {
    return this.app.import("@unicorn/field/single-image-drag.js");
  }
  /**
   * File Drag
   */
  fileDrag() {
    return this.app.import("@unicorn/field/file-drag.js");
  }
  /**
   * Iframe Modal
   */
  iframeModal() {
    return this.app.import("@unicorn/ui/iframe-modal.js");
  }
  /**
   * Modal Field
   */
  modalField() {
    return this.app.import("@unicorn/field/modal-field.js");
  }
  /**
   * Multiple Uploader
   */
  multiUploader() {
    return this.app.import("@unicorn/field/multi-uploader.js");
  }
  /**
   * Repeatable
   */
  repeatable() {
    return this.app.import("@unicorn/field/repeatable.js");
  }
  modalTree() {
    return this.app.import("@unicorn/field/modal-tree.js");
  }
  async s3Uploader(name) {
    const module2 = await this.app.import("@unicorn/aws/s3-uploader.js");
    module2.init(this.app);
    if (name) {
      return module2.get(name);
    }
    return null;
  }
  async slideUp(target, duration = 300) {
    const ele = selectOne(target);
    if (!ele) {
      return Promise.resolve();
    }
    ele.style.overflow = "hidden";
    const animation = this.$animate.to(
      ele,
      { height: 0, paddingTop: 0, paddingBottom: 0 },
      { duration, easing: "ease-out" }
    );
    const r = await animation.finished;
    ele.style.display = "none";
    return r;
  }
  slideDown(target, duration = 300, display = "block") {
    const ele = selectOne(target);
    if (!ele) {
      return Promise.resolve();
    }
    ele.style.display = display;
    let maxHeight = 0;
    for (const child of Array.from(ele.children)) {
      maxHeight = Math.max(child.offsetHeight, maxHeight);
    }
    const animation = this.$animate.to(
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
  /**
   * slideToggle
   */
  slideToggle(target, duration = 500, display = "block") {
    const ele = selectOne(target);
    if (!ele) {
      return Promise.resolve();
    }
    if (window.getComputedStyle(ele).display === "none") {
      return this.slideDown(ele, duration, display);
    } else {
      return this.slideUp(ele, duration);
    }
  }
  async fadeOut(selector, duration = 500) {
    const el = selectOne(selector);
    if (!el) {
      return;
    }
    const animation = this.$animate.to(el, { opacity: 0 }, { duration, easing: "ease-out" });
    const p = await animation.finished;
    el.style.display = "none";
    return p;
  }
  async fadeIn(selector, duration = 500, display = "block") {
    const el = selectOne(selector);
    if (!el) {
      return;
    }
    el.style.display = "";
    if (window.getComputedStyle(el).display !== display) {
      el.style.display = display;
    }
    const animation = this.$animate.to(el, { opacity: 1 }, { duration, easing: "ease-out" });
    return animation.finished;
  }
  async highlight(selector, color = "#ffff99", duration = 600) {
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
  /**
   * Color Picker.
   */
  async colorPicker(selector, options = {}) {
    if (options?.theme === "dark") {
      this.app.importCSS("@spectrum/spectrum-dark.min.css");
    } else if (!options?.theme) {
      this.app.importCSS("@spectrum/spectrum.min.css");
    }
    const m = await this.app.import("@spectrum");
    if (typeof options.locale === "string") {
      let ls = options.locale.split("-").map((l) => l.toLowerCase());
      if (ls[0] === ls[1]) {
        ls = [ls];
      }
      ls = ls.join("-");
      try {
        await this.app.import(`@spectrum/i18n/${ls}.js`);
      } catch (e) {
        console.warn(`Unable to load Spectrum locale "${ls}" (${options.locale})`);
      }
    }
    if (selector) {
      singletonModule(selector, "spectrum", (ele) => Spectrum.getInstance(ele, options));
    }
    return m;
  }
  disableOnSubmit(formSelector = "#admin-form", buttonSelector = "", options = {}) {
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
  disableIfStackNotEmpty(buttonSelector = "[data-task=save]", stackName = "uploading") {
    const stack = this.app.inject("$stack").get(stackName);
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
  async checkboxesMultiSelect(selector, options = {}) {
    const m = await this.app.import("@unicorn/ui/checkboxes-multi-select.js");
    if (selector) {
      m.CheckboxesMultiSelect.handle(selector, options);
    }
    return m;
  }
  /**
   * Keep alive.
   */
  keepAlive(url, time = 6e4) {
    const aliveHandle = window.setInterval(() => fetch(url), time);
    return () => {
      clearInterval(aliveHandle);
    };
  }
  /**
   * Init Form Show On
   */
  initShowOn() {
    return this.app.import("@unicorn/ui/show-on.js");
  }
  /**
   * Vue component field.
   */
  async vueComponentField(selector, value, options = {}) {
    const m = await this.app.import("@unicorn/field/vue-component-field.js");
    if (selector) {
      m.VueComponentField.init(selector, value, options);
    }
    return m;
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
let apps = {};
function createUnicorn(name = "default") {
  polyfill();
  return apps[name] ??= new UnicornApp();
}
function createUnicornWithPlugins(name = "default") {
  const app = createUnicorn(name);
  app.use(UnicornUI);
  return app;
}
function setUnicornApp(inc, name = "default") {
  apps[name] = inc;
}
function useUnicornApp(name = "default") {
  return apps[name] ??= createUnicorn(name);
}
function useInject(name, def) {
  return useUnicornApp().inject(name, def);
}
export {
  UnicornUI,
  addUriBase,
  alert,
  animateTo$1 as animateTo,
  asset,
  base64UrlDecode,
  base64UrlEncode,
  confirm,
  createUnicorn,
  createUnicornWithPlugins,
  data,
  debounce,
  delegate,
  domready,
  forceArray,
  genRandomString,
  getBoundedInstance,
  getBoundedInstanceList,
  h,
  html,
  isDebug,
  nextTick,
  numberFormat,
  randomBytes,
  randomBytesHex,
  removeData,
  selectAll,
  selectOne,
  serial,
  setUnicornApp,
  singletonModule,
  throttle,
  tid,
  uid,
  uri,
  useInject,
  useUI,
  useUniDirective,
  useUnicornApp,
  useWebDirective
};
