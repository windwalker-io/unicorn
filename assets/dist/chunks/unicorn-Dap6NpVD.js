const G = (e, t, n = []) => {
  const r = Object.getOwnPropertyDescriptors(t);
  for (let i of n)
    delete r[i];
  Object.defineProperties(e, r);
}, x = (e, t = [e]) => {
  const n = Object.getPrototypeOf(e);
  return n === null ? t : x(n, [...t, n]);
}, J = (...e) => {
  if (e.length === 0)
    return;
  let t;
  const n = e.map((r) => x(r));
  for (; n.every((r) => r.length > 0); ) {
    const r = n.map((s) => s.pop()), i = r[0];
    if (r.every((s) => s === i))
      t = i;
    else
      break;
  }
  return t;
}, q = (e, t, n = []) => {
  var r;
  const i = (r = J(...e)) !== null && r !== void 0 ? r : Object.prototype, s = Object.create(i), c = x(i);
  for (let a of e) {
    let f = x(a);
    for (let u = f.length - 1; u >= 0; u--) {
      let d = f[u];
      c.indexOf(d) === -1 && (G(s, d, ["constructor", ...n]), c.push(d));
    }
  }
  return s.constructor = t, s;
}, L = (e) => e.filter((t, n) => e.indexOf(t) == n), K = /* @__PURE__ */ new WeakMap(), Z = (e) => K.get(e), Y = (e, t) => K.set(e, t), H = (e, t) => {
  var n, r;
  const i = L([...Object.getOwnPropertyNames(e), ...Object.getOwnPropertyNames(t)]), s = {};
  for (let c of i)
    s[c] = L([...(n = e?.[c]) !== null && n !== void 0 ? n : [], ...(r = t?.[c]) !== null && r !== void 0 ? r : []]);
  return s;
}, N = (e, t) => {
  var n, r, i, s;
  return {
    property: H((n = e?.property) !== null && n !== void 0 ? n : {}, (r = t?.property) !== null && r !== void 0 ? r : {}),
    method: H((i = e?.method) !== null && i !== void 0 ? i : {}, (s = t?.method) !== null && s !== void 0 ? s : {})
  };
}, tt = (e, t) => {
  var n, r, i, s, c, a;
  return {
    class: L([...(n = e?.class) !== null && n !== void 0 ? n : [], ...(r = t?.class) !== null && r !== void 0 ? r : []]),
    static: N((i = e?.static) !== null && i !== void 0 ? i : {}, (s = t?.static) !== null && s !== void 0 ? s : {}),
    instance: N((c = e?.instance) !== null && c !== void 0 ? c : {}, (a = t?.instance) !== null && a !== void 0 ? a : {})
  };
}, et = /* @__PURE__ */ new Map(), nt = (...e) => {
  var t;
  const n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set([...e]);
  for (; r.size > 0; )
    for (let i of r) {
      const s = x(i.prototype).map((u) => u.constructor), c = (t = Z(i)) !== null && t !== void 0 ? t : [], f = [...s, ...c].filter((u) => !n.has(u));
      for (let u of f)
        r.add(u);
      n.add(i), r.delete(i);
    }
  return [...n];
}, rt = (...e) => {
  const t = nt(...e).map((n) => et.get(n)).filter((n) => !!n);
  return t.length == 0 ? {} : t.length == 1 ? t[0] : t.reduce((n, r) => tt(n, r));
};
function it(...e) {
  var t, n, r;
  const i = e.map((a) => a.prototype);
  function s(...a) {
    for (const f of e)
      G(this, new f(...a));
  }
  s.prototype = q(i, s), Object.setPrototypeOf(
    s,
    q(e, null, ["prototype"])
  );
  let c = s;
  {
    const a = rt(...e);
    for (let f of (t = a?.class) !== null && t !== void 0 ? t : []) {
      const u = f(c);
      u && (c = u);
    }
    R((n = a?.static) !== null && n !== void 0 ? n : {}, c), R((r = a?.instance) !== null && r !== void 0 ? r : {}, c.prototype);
  }
  return Y(c, e), c;
}
const R = (e, t) => {
  const n = e.property, r = e.method;
  if (n)
    for (let i in n)
      for (let s of n[i])
        s(t, i);
  if (r)
    for (let i in r)
      for (let s of r[i])
        s(t, i, Object.getOwnPropertyDescriptor(t, i));
};
class st {
  _listeners = {};
  on(t, n) {
    if (Array.isArray(t)) {
      for (const r of t)
        this.on(r, n);
      return this;
    }
    return this._listeners[t] ??= [], this._listeners[t].push(n), this;
  }
  once(t, n) {
    return n.once = !0, this.on(t, n);
  }
  off(t, n) {
    return n ? (this._listeners[t] = this.listeners(t).filter((r) => r !== n), this) : (delete this._listeners[t], this);
  }
  trigger(t, ...n) {
    if (Array.isArray(t)) {
      for (const r of t)
        this.trigger(r);
      return this;
    }
    for (const r of this.listeners(t))
      r(...n);
    return this._listeners[t] = this.listeners(t).filter((r) => r?.once !== !0), this;
  }
  listeners(t) {
    return this._listeners[t] === void 0 ? [] : this._listeners[t];
  }
}
class ot extends (/* @__PURE__ */ it(st)) {
  registry = /* @__PURE__ */ new Map();
  plugins = /* @__PURE__ */ new Map();
  // _listeners = {};
  waits = [];
  options;
  defaultOptions = {};
  constructor(t = {}) {
    super(), this.options = Object.assign({}, this.defaultOptions, t), typeof document < "u" && (this.wait((n) => {
      document.addEventListener("DOMContentLoaded", () => n());
    }), document.addEventListener("DOMContentLoaded", () => {
      this.completed().then(() => this.trigger("loaded"));
    }));
  }
  use(t, n = {}) {
    return Array.isArray(t) ? (t.forEach((r) => this.use(r)), this) : (t?.install?.(this, n), this.trigger("plugin.installed", t), this.plugins.set(t, t), this);
  }
  detach(t) {
    return t.uninstall && t.uninstall(this), this.trigger("plugin.uninstalled", t), this;
  }
  inject(t, n) {
    return this.registry.has(t), this.registry.get(t);
  }
  provide(t, n) {
    return this.registry.set(t, n), this;
  }
  // trigger(event, ...args) {
  //   return this.tap(super.trigger(event, ...args), () => {
  //     if (this.data('windwalker.debug')) {
  //       console.debug(`[Unicorn Event] ${event}`, args, this.listeners(event));
  //     }
  //   });
  // }
  wait(t) {
    const n = new Promise((r, i) => {
      const s = t(r, i);
      s && "then" in s && s.then(r).catch(i);
    });
    return this.waits.push(n), n;
  }
  completed() {
    const t = Promise.all(this.waits);
    return this.waits = [], t;
  }
}
function at(e) {
  if (typeof e.requestSubmit == "function")
    return;
  e.requestSubmit = function(r) {
    r ? (t(r, this), r.click()) : (r = document.createElement("input"), r.type = "submit", r.hidden = !0, this.appendChild(r), r.click(), this.removeChild(r));
  };
  function t(r, i) {
    r instanceof HTMLElement || n(TypeError, "parameter 1 is not of type 'HTMLElement'"), r.type == "submit" || n(TypeError, "The specified element is not a submit button"), r.form == i || n(DOMException, "The specified element is not owned by this form element", "NotFoundError");
  }
  function n(r, i, s) {
    throw new r("Failed to execute 'requestSubmit' on 'HTMLFormElement': " + i + ".", s);
  }
}
function ct() {
  typeof window < "u" && at(HTMLFormElement.prototype);
}
function D(e) {
  return e && typeof e == "object" && !Array.isArray(e);
}
function Q(e, ...t) {
  let n = D(e) ? { ...e } : e;
  for (const r of t) {
    if (Array.isArray(r)) {
      n = Array.isArray(n) ? n.concat(r) : r;
      continue;
    }
    if (D(r)) {
      n = { ...D(n) ? n : {} };
      for (const i of Object.keys(r))
        n[i] = i in n ? Q(n[i], r[i]) : r[i];
      continue;
    }
    n = r;
  }
  return n;
}
function V(e, t = void 0) {
  return C(e), t === void 0 ? e.__unicorn : e.__unicorn[t];
}
function ut(e, t, n) {
  C(e), e.__unicorn[t] = n;
}
function lt(e, t, n) {
  return C(e), e.__unicorn[t] = e.__unicorn[t] || n(e), e.__unicorn[t];
}
function ft(e, t) {
  C(e);
  const n = e.__unicorn[t];
  return delete e.__unicorn[t], n;
}
function C(e) {
  return e && (e.__unicorn = e.__unicorn || {}, e);
}
function F(e, t = void 0, n = void 0) {
  if (e instanceof HTMLElement || (n = t, t = e, e = document), t === void 0)
    return V(e);
  if (n === void 0)
    return V(e, t);
  ut(e, t, n);
}
function Xt(e, t = void 0) {
  e instanceof HTMLElement || (t = e, e = document), ft(e, t);
}
function S(e, t, n = {}) {
  e = this.app.selectOne(e);
  const r = window.getComputedStyle(e), i = {};
  for (const c in t) {
    const a = t[c];
    i[c] = Array.isArray(a) ? a : [
      r.getPropertyValue(c),
      a
    ];
  }
  typeof n == "number" && (n = { duration: n }), n = Object.assign(
    {
      duration: 400,
      easing: "linear",
      fill: "both"
    },
    n
  );
  const s = e.animate(
    i,
    n
  );
  return s.addEventListener("finish", () => {
    for (const c in t) {
      const a = t[c];
      e.style.setProperty(
        c,
        Array.isArray(a) ? a[a.length - 1] : a
      );
    }
    s.cancel();
  }), s;
}
const v = class v {
};
v.alert = async (t) => window.alert(t), v.confirm = async (t) => new Promise((n) => {
  const r = confirm(t);
  n(r);
}), v.deleteConfirm = async (t) => v.confirm(t), v.confirmText = () => "確認", v.cancelText = () => "取消", v.deleteText = () => "刪除";
let y = v;
async function Jt(e, t = "", n = "info", r) {
  return y.alert(e, t, n, r);
}
async function Zt(e, t = "", n = "info", r) {
  return y.confirm(e, t, n, r);
}
async function Yt(e, t = "", n = "info", r) {
  return y.deleteConfirm(e, t, n, r);
}
function dt() {
  return typeof window > "u";
}
function pt(e = "", t = !1) {
  if (t) {
    const r = (performance?.timeOrigin ? Math.round(performance.timeOrigin) : performance.timing.navigationStart) * 1e5 + performance.now() * 100;
    return e + r.toString(12) + $(4);
  }
  return e + $(12);
}
function te(e = "") {
  return pt(e, !0);
}
function $(e = 12) {
  return !dt() && !globalThis.crypto ? String(Math.floor(Math.random() * e ** 10)) : Array.from(ht(e)).map((t) => t.toString(16).padStart(2, "0")).join("");
}
function ht(e = 12) {
  const t = new Uint8Array(e);
  return globalThis.crypto.getRandomValues(t), t;
}
class mt {
  constructor(t = 1) {
    this.maxRunning = t, this.items = [], this.currentRunning = 0, this.running = !1, this.observers = [];
  }
  push(t) {
    const n = new Promise((r, i) => {
      this.items.push(() => Promise.resolve(t()).then(r));
    });
    return this.run(), n;
  }
  run() {
    this.running || (this.running = !0), this.pop();
  }
  async pop() {
    const t = this.items.shift();
    if (!t)
      return this.running = !1, Promise.resolve();
    if (this.currentRunning >= this.maxRunning)
      return this.items.unshift(t), Promise.resolve();
    this.currentRunning++, this.notice();
    try {
      return await t();
    } catch (n) {
      throw n;
    } finally {
      this.endPop();
    }
  }
  endPop() {
    this.currentRunning--, this.notice(), this.pop();
  }
  clear() {
    return this.items = [], this.notice(), this;
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
  observe(t, n = {}) {
    return this.observers.push({
      handler: t,
      once: n.once || !1
    }), () => {
      this.off(t);
    };
  }
  once(t, n = {}) {
    return n.once = !0, this.observe(t, n);
  }
  onEnd(t, n = {}) {
    return this.observe((r, i, s) => {
      i === 0 && s === 0 && t(r, i, s);
    }, n);
  }
  notice() {
    return this.observers.forEach((t) => {
      t.handler(this, this.length, this.currentRunning);
    }), this.observers = this.observers.filter((t) => !t.once), this;
  }
  off(t) {
    return t == null ? (this.observers = [], this) : (this.observers = this.observers.filter((n) => n.handler !== t), this);
  }
}
function yt(e = 1) {
  return new mt(e);
}
class gt {
  constructor(t = []) {
    this.store = t, this.observers = [];
  }
  push(t) {
    const n = this.store.push(t ?? !0);
    return this.notice(), n;
  }
  pop() {
    const t = this.store.pop();
    return this.notice(), t;
  }
  clear() {
    return this.store = [], this.notice(), this;
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
  observe(t) {
    return this.observers.push({
      handler: t,
      once: !1
    }), () => {
      this.off(t);
    };
  }
  once(t) {
    return this.observers.push({
      handler: t,
      once: !0
    }), () => {
      this.off(t);
    };
  }
  notice() {
    return this.observers.forEach((t) => {
      t.handler(this, this.length);
    }), this.observers = this.observers.filter((t) => t.once !== !0), this;
  }
  off(t) {
    return this.observers = this.observers.filter((n) => n.handler !== t), this;
  }
}
function wt(e = []) {
  return new gt(e);
}
function ee(e) {
  return new Promise((t) => {
    setTimeout(t, e);
  });
}
function ne(e) {
  return btoa(String(e)).replace(/\+/, "-").replace(new RegExp("\\/"), "_").replace(/=+$/, "");
}
function re(e) {
  return atob(
    String(e).replace(/-/, "+").replace(/_/, "/")
  );
}
let vt = 1;
function ie() {
  return vt++;
}
function se(e = void 0) {
  let t = new Promise((n) => {
    document.readyState === "complete" || document.readyState === "interactive" ? setTimeout(n, 0) : document.addEventListener("DOMContentLoaded", () => n());
  });
  return e && (t = t.then(e)), t;
}
function g(e) {
  let t;
  return typeof e == "string" ? t = document.querySelector(e) : t = e, t;
}
function _(e, t = void 0) {
  typeof e == "string" && (e = document.querySelectorAll(e));
  const n = [].slice.call(e);
  return t ? n.map((r) => t(r) || r) : n;
}
function O(e, t, n = () => null) {
  const r = typeof e == "string" ? document.querySelector(e) : e;
  return r ? lt(r, t, n) : null;
}
function B(e, t, n = () => null) {
  const r = typeof e == "string" ? document.querySelectorAll(e) : e;
  return Array.from(r).map((i) => O(i, t, n));
}
function T(e, t, n = () => null) {
  return typeof e == "string" ? B(e, t, n) : e instanceof HTMLElement ? O(e, t, n) : B(e, t, n);
}
function oe(e, t = {}, n = void 0) {
  const r = document.createElement(e);
  for (let i in t) {
    const s = t[i];
    r.setAttribute(i, s);
  }
  return n !== null && (r.innerHTML = n), r;
}
function bt(e) {
  const t = document.createElement("div");
  return t.innerHTML = e, t.children[0];
}
function ae(e, t, n, r) {
  if (typeof t > "u" || t === "")
    throw new Error("The provided selector is empty.");
  if (typeof r > "u" || typeof r != "function")
    throw new Error("Please specify an callback.");
  const i = {}, s = g(e);
  return s?.addEventListener(n, function(c) {
    let a = c.target, f = !1;
    for (; a && a !== s; ) {
      for (const u in i)
        a.matches(u) && (c.stopPropagation = function() {
          f = !0;
        }, Object.defineProperty(
          c,
          "currentTarget",
          {
            get() {
              return a;
            }
          }
        ), i[u].forEach(function(o) {
          o(c);
        }));
      if (f)
        break;
      a = a.parentElement;
    }
  }), i[t] ? i[t].push(r) : i[t] = [r], function() {
    i[t] && (i[t].length >= 2 ? i[t] = i[t].filter((a) => a !== r) : delete i[t]);
  };
}
function St(e, ...t) {
  e instanceof Document || (t.push(e), e = document);
  const n = t.map((r) => {
    if (typeof r == "string") {
      const i = new CSSStyleSheet();
      return i.replaceSync(r), i;
    }
    return r;
  });
  return e.adoptedStyleSheets = [...e.adoptedStyleSheets, ...n], n;
}
function kt(e) {
  return Array.isArray(e) ? e : [e];
}
function ce(e, t = 1) {
  let n, r;
  return function(...i) {
    return clearTimeout(n), n = setTimeout(() => r = e.call(this, ...i), t), r;
  };
}
function ue(e, t = 1) {
  return function(...n) {
    return e.call(this, ...n);
  };
}
function xt() {
  return !!F("windwalker.debug");
}
function le(e) {
  return Promise.resolve().then(e ?? (() => null));
}
var A = {}, z;
function Et() {
  return z || (z = 1, (function(e) {
    (function() {
      var t = {
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
      function n(a) {
        return i(c(a), arguments);
      }
      function r(a, f) {
        return n.apply(null, [a].concat(f || []));
      }
      function i(a, f) {
        var u = 1, d = a.length, o, w = "", h, p, l, E, j, P, M, b;
        for (h = 0; h < d; h++)
          if (typeof a[h] == "string")
            w += a[h];
          else if (typeof a[h] == "object") {
            if (l = a[h], l.keys)
              for (o = f[u], p = 0; p < l.keys.length; p++) {
                if (o == null)
                  throw new Error(n('[sprintf] Cannot access property "%s" of undefined value "%s"', l.keys[p], l.keys[p - 1]));
                o = o[l.keys[p]];
              }
            else l.param_no ? o = f[l.param_no] : o = f[u++];
            if (t.not_type.test(l.type) && t.not_primitive.test(l.type) && o instanceof Function && (o = o()), t.numeric_arg.test(l.type) && typeof o != "number" && isNaN(o))
              throw new TypeError(n("[sprintf] expecting number but found %T", o));
            switch (t.number.test(l.type) && (M = o >= 0), l.type) {
              case "b":
                o = parseInt(o, 10).toString(2);
                break;
              case "c":
                o = String.fromCharCode(parseInt(o, 10));
                break;
              case "d":
              case "i":
                o = parseInt(o, 10);
                break;
              case "j":
                o = JSON.stringify(o, null, l.width ? parseInt(l.width) : 0);
                break;
              case "e":
                o = l.precision ? parseFloat(o).toExponential(l.precision) : parseFloat(o).toExponential();
                break;
              case "f":
                o = l.precision ? parseFloat(o).toFixed(l.precision) : parseFloat(o);
                break;
              case "g":
                o = l.precision ? String(Number(o.toPrecision(l.precision))) : parseFloat(o);
                break;
              case "o":
                o = (parseInt(o, 10) >>> 0).toString(8);
                break;
              case "s":
                o = String(o), o = l.precision ? o.substring(0, l.precision) : o;
                break;
              case "t":
                o = String(!!o), o = l.precision ? o.substring(0, l.precision) : o;
                break;
              case "T":
                o = Object.prototype.toString.call(o).slice(8, -1).toLowerCase(), o = l.precision ? o.substring(0, l.precision) : o;
                break;
              case "u":
                o = parseInt(o, 10) >>> 0;
                break;
              case "v":
                o = o.valueOf(), o = l.precision ? o.substring(0, l.precision) : o;
                break;
              case "x":
                o = (parseInt(o, 10) >>> 0).toString(16);
                break;
              case "X":
                o = (parseInt(o, 10) >>> 0).toString(16).toUpperCase();
                break;
            }
            t.json.test(l.type) ? w += o : (t.number.test(l.type) && (!M || l.sign) ? (b = M ? "+" : "-", o = o.toString().replace(t.sign, "")) : b = "", j = l.pad_char ? l.pad_char === "0" ? "0" : l.pad_char.charAt(1) : " ", P = l.width - (b + o).length, E = l.width && P > 0 ? j.repeat(P) : "", w += l.align ? b + o + E : j === "0" ? b + E + o : E + b + o);
          }
        return w;
      }
      var s = /* @__PURE__ */ Object.create(null);
      function c(a) {
        if (s[a])
          return s[a];
        for (var f = a, u, d = [], o = 0; f; ) {
          if ((u = t.text.exec(f)) !== null)
            d.push(u[0]);
          else if ((u = t.modulo.exec(f)) !== null)
            d.push("%");
          else if ((u = t.placeholder.exec(f)) !== null) {
            if (u[2]) {
              o |= 1;
              var w = [], h = u[2], p = [];
              if ((p = t.key.exec(h)) !== null)
                for (w.push(p[1]); (h = h.substring(p[0].length)) !== ""; )
                  if ((p = t.key_access.exec(h)) !== null)
                    w.push(p[1]);
                  else if ((p = t.index_access.exec(h)) !== null)
                    w.push(p[1]);
                  else
                    throw new SyntaxError("[sprintf] failed to parse named argument key");
              else
                throw new SyntaxError("[sprintf] failed to parse named argument key");
              u[2] = w;
            } else
              o |= 2;
            if (o === 3)
              throw new Error("[sprintf] mixing positional and named placeholders is not (yet) supported");
            d.push(
              {
                placeholder: u[0],
                param_no: u[1],
                keys: u[2],
                sign: u[3],
                pad_char: u[4],
                align: u[5],
                width: u[6],
                precision: u[7],
                type: u[8]
              }
            );
          } else
            throw new SyntaxError("[sprintf] unexpected placeholder");
          f = f.substring(u[0].length);
        }
        return s[a] = d;
      }
      e.sprintf = n, e.vsprintf = r, typeof window < "u" && (window.sprintf = n, window.vsprintf = r);
    })();
  })(A)), A;
}
var _t = /* @__PURE__ */ Et();
let Ct;
function Ot() {
  return Ct ??= new jt();
}
function Tt(e, ...t) {
  return Ot().trans(e, ...t);
}
function fe(e, ...t) {
  return Tt(e, ...t);
}
class jt {
  /**
   * Translate a string.
   */
  trans(t, ...n) {
    const r = this.normalize(t);
    let i = this.get(r) || "";
    return i = this.replace(i, n), i !== "" ? i : this.wrapDebug(t, !1);
  }
  replace(t, n) {
    let r = {}, i = [];
    for (const s of n)
      typeof s == "object" ? r = { ...r, ...s } : i.push(s);
    if (i.length && (t = _t.vsprintf(t, i)), Object.values(r).length)
      for (const s in r) {
        let c = r[s];
        typeof c == "function" && (c = c()), t = t.replace(new RegExp(":" + s, "g"), String(c));
      }
    return t;
  }
  /**
   * Find text.
   */
  get(t) {
    const n = this.getStrings();
    return n[t] ? n[t] : null;
  }
  /**
   * Has language key.
   */
  has(t) {
    return this.getStrings()[t] !== void 0;
  }
  /**
   * Add language key.
   */
  add(t, n) {
    const r = this.getStrings();
    return r[this.normalize(t)] = n, F("unicorn.languages", r), this;
  }
  /**
   * Replace all symbols to dot(.).
   */
  normalize(t) {
    return t.replace(/[^A-Z0-9]+/ig, ".");
  }
  wrapDebug(t, n) {
    return xt() ? n ? "**" + t + "**" : "??" + t + "??" : t;
  }
  getStrings() {
    return F("unicorn.languages") || {};
  }
}
function W(e) {
  return import(e);
}
async function m(...e) {
  if (e.length === 1)
    return W(e[0]);
  const t = [];
  return e.forEach((n) => {
    t.push(
      n instanceof Promise ? n : W(n)
    );
  }), Promise.all(t);
}
async function de(...e) {
  const t = [];
  for (const n of e) {
    if (Array.isArray(n)) {
      const i = await m(...n);
      t.push(i);
      continue;
    }
    const r = await m(n);
    t.push(r);
  }
  return t;
}
async function I(...e) {
  let t = await m(...e);
  t = kt(t);
  const n = t.map((r) => r.default);
  return St(...n);
}
const Pt = {};
function Mt(e = "default", t = []) {
  return Pt[e] ??= Dt(t);
}
function Dt(e = []) {
  return wt(e);
}
let k;
y.alert = (e, t = "", n = "info") => (t && (e += " | " + t), window.alert(e), Promise.resolve());
y.confirm = (e) => (e = e || "Are you sure?", new Promise((t) => {
  t(window.confirm(e));
}));
y.confirmText = () => "OK";
y.cancelText = () => "Cancel";
y.deleteText = () => "Delete";
function At(e) {
  return e && (k = e), k ??= new Ft();
}
function Lt(e) {
  const t = At();
  return t.theme && !e || (typeof e == "function" && (e = new e()), t.installTheme(e)), t.theme;
}
class Ft {
  theme;
  aliveHandle;
  static get defaultOptions() {
    return {
      messageSelector: ".message-wrap"
    };
  }
  installTheme(t) {
    this.theme = t;
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
async function It(e) {
  return e && Ut(e), await m("@alpinejs");
}
async function pe(e) {
  await It(), _(`[${e}]`, (t) => {
    const n = t.getAttribute(e) || "";
    t.removeAttribute(e), Alpine.mutateDom(() => {
      t.setAttribute("x-data", n);
    }), Alpine.initTree(t);
  });
}
function Ut(e) {
  window.Alpine ? e() : document.addEventListener("alpine:init", e);
}
function he(e, t = "info") {
  k.theme.renderMessage(e, t);
}
function me() {
  k.theme.clearMessages();
}
function ye(e, t = "info") {
  k.theme.renderMessage(e, t);
}
function ge() {
  k.theme.clearMessages();
}
async function we(e, t = "", n = {}) {
  const r = await m("@vendor/mark.js/dist/mark.min.js");
  return e != null && new Mark(e).mark(t, n), r;
}
function ve() {
  return m("@unicorn/field/multi-uploader.js");
}
function be() {
  return m("@unicorn/field/modal-tree.js");
}
async function qt(e, t = 300) {
  const n = g(e);
  if (!n)
    return Promise.resolve();
  n.style.overflow = "hidden";
  const i = await S(
    n,
    { height: 0, paddingTop: 0, paddingBottom: 0 },
    { duration: t, easing: "ease-out" }
  ).finished;
  return n.style.display = "none", i;
}
function Ht(e, t = 300, n = "block") {
  const r = g(e);
  if (!r)
    return Promise.resolve();
  r.style.display = n;
  let i = 0;
  for (const c of Array.from(r.children))
    i = Math.max(c.offsetHeight, i);
  const s = S(
    r,
    {
      height: [
        0,
        i + "px"
      ]
    },
    { duration: t, easing: "ease-out" }
  );
  return s.addEventListener("finish", () => {
    r.style.height = "", r.style.overflow = "visible";
  }), s.finished;
}
function Se(e, t = 500, n = "block") {
  const r = g(e);
  return r ? window.getComputedStyle(r).display === "none" ? Ht(r, t, n) : qt(r, t) : Promise.resolve();
}
async function ke(e, t = 500) {
  const n = g(e);
  if (!n)
    return;
  const i = await S(n, { opacity: 0 }, { duration: t, easing: "ease-out" }).finished;
  return n.style.display = "none", i;
}
async function xe(e, t = 500, n = "block") {
  const r = g(e);
  return r ? (r.style.display = "", window.getComputedStyle(r).display !== n && (r.style.display = n), S(r, { opacity: 1 }, { duration: t, easing: "ease-out" }).finished) : void 0;
}
async function Ee(e, t = "#ffff99", n = 600) {
  const r = g(e);
  if (!r)
    return;
  n /= 2;
  const i = window.getComputedStyle(r).backgroundColor;
  return await S(r, { backgroundColor: t }, { duration: n }).finished, S(r, { backgroundColor: i }, { duration: n });
}
async function _e(e, t = {}) {
  t?.theme === "dark" ? I("@spectrum/spectrum-dark.min.css") : t?.theme || I("@spectrum/spectrum.min.css");
  const n = await m("@spectrum");
  if (typeof t.locale == "string") {
    let r = t.locale.split("-").map((i) => i.toLowerCase());
    r[0] === r[1] && (r = [r]), r = r.join("-");
    try {
      await m(`@spectrum/i18n/${r}.js`);
    } catch {
      console.warn(`Unable to load Spectrum locale "${r}" (${t.locale})`);
    }
  }
  return e && T(e, "spectrum", (r) => Spectrum.getInstance(r, t)), n;
}
function Ce(e = "#admin-form", t = "", n = {}) {
  t = t || [
    "#admin-toolbar button",
    "#admin-toolbar a",
    e + " .disable-on-submit",
    e + " .js-dos",
    e + " [data-dos]"
  ].join(",");
  const r = n.iconSelector || [
    '[class*="fa-"]',
    "[data-spin]",
    "[data-spinner]"
  ].join(","), i = n.event || "submit", s = n.spinnerClass || "spinner-border spinner-border-sm";
  _(t, (a) => {
    a.addEventListener("click", (f) => {
      a.dataset.clicked = "1", setTimeout(() => {
        delete a.dataset.clicked;
      }, 1500);
    });
  });
  const c = g(e);
  c?.addEventListener(i, (a) => {
    console.log(a.submitter), setTimeout(() => {
      c.checkValidity() && _(t, (f) => {
        if (f.style.pointerEvents = "none", f.setAttribute("disabled", "disabled"), f.classList.add("disabled"), f.dataset.clicked) {
          let u = f.querySelector(r);
          if (u) {
            const d = bt("<i></i>");
            u.parentNode.replaceChild(d, u), d.setAttribute("class", s);
          }
        }
      });
    }, 0);
  });
}
function Oe(e = "[data-task=save]", t = "uploading") {
  Mt(t).observe((r, i) => {
    for (const s of _(e))
      i > 0 ? (s.setAttribute("disabled", "disabled"), s.classList.add("disabled")) : (s.removeAttribute("disabled"), s.classList.remove("disabled"));
  });
}
function Te(e, t = 6e4) {
  const n = window.setInterval(() => fetch(e), t);
  return () => {
    clearInterval(n);
  };
}
async function je(e, t, n = {}) {
  const r = await m("@unicorn/field/vue-component-field.js");
  return e && r.VueComponentField.init(e, t, n), r;
}
const Nt = {};
function Pe(e = "default", t = 1) {
  return Nt[e] ??= Rt(t);
}
function Rt(e = 1) {
  return yt(e);
}
async function Vt(e, t = {}) {
  const { UnicornFormElement: n } = await import("../components/form.js");
  if (e == null)
    return new n(void 0, void 0, t);
  const r = typeof e == "string" ? e : void 0, i = g(e);
  if (!i)
    throw new Error(`Form element of: ${r} not found.`);
  return T(
    i,
    "unicorn.form",
    () => new n(r, i, t)
  );
}
async function Me(e, t = {}) {
  const { UnicornGridElement: n } = await import("../components/grid.js"), r = typeof e == "string" ? e : "", i = g(e);
  if (!i)
    throw new Error("Element is empty");
  const s = await Vt(r || i);
  return T(
    i,
    "grid.plugin",
    () => new n(r, i, s, t)
  );
}
async function $t(e) {
  const { UnicornHttpClient: t } = await import("../components/http-client.js");
  if (e && "interceptors" in e) {
    const n = e, r = new t();
    return r.axios = n, r;
  }
  return new t(e);
}
async function De(e) {
  const t = await $t(e);
  return await t.getAxiosInstance(), t;
}
let Bt = {};
async function zt(e = "unicorn", t = {}) {
  return Bt[e] ??= await Wt(Object.assign({}, t, { prefix: "uni-" }));
}
async function Ae(e, t, n = "unicorn") {
  (typeof n == "string" ? await zt(n) : n).register(e, t);
}
async function Wt(e = {}) {
  const t = (await import("./web-directive.es-DbHVfT8c.js")).default, n = new t(e);
  return n.listen(), n;
}
async function Le(e, t, n = {}) {
  const r = await import("../components/list-dependent.js");
  if (await r.ready, e) {
    const { ListDependent: i } = r;
    return i.handle(e, t, n);
  }
  return r;
}
function Fe() {
  return import("../components/field-flatpickr.js");
}
async function Ie(e, t = {}, n = "bootstrap5") {
  const r = await m(
    "@vendor/tom-select/dist/js/tom-select.complete.min.js",
    I(`@vendor/tom-select/dist/css/tom-select.${n}.min.css`)
  );
  return e && T(
    e,
    "tom.select",
    (i) => {
      t = Q({
        allowEmptyOption: !0,
        maxOptions: null,
        plugins: {
          caret_position: {},
          clear_button: {}
        }
      }, t), i.multiple ? t.plugins.remove_button = {} : t.plugins.dropdown_input = {};
      class s extends TomSelect {
        syncOptionsWithoutKeepSelected() {
          const f = i.value;
          this.clear(), this.clearOptions(), this.sync(), i.value !== f && this.setValue(
            i.querySelector(`option[value="${f}"]`)?.value ?? i.querySelector("option")?.value ?? "",
            !0
          );
        }
      }
      const c = new s(i, t);
      return i.addEventListener("list:updated", () => {
        c.syncOptionsWithoutKeepSelected();
      }), c;
    }
  ), r;
}
async function Ue() {
  const e = await import("../components/iframe-modal.js");
  return await e.ready, e;
}
async function qe(e, t = {}) {
  const n = await import("../components/s3-uploader.js");
  if (!e)
    return n;
  const { get: r } = n;
  return r(e, t);
}
async function He() {
  const e = await import("../components/show-on.js");
  return await e.ready, e;
}
async function Ne(e = !1) {
  const { UIBootstrap5: t } = await import("../components/ui-bootstrap5.js"), n = t.get();
  return e && Lt(n), n;
}
async function Gt(e) {
  const t = await import("../components/validation.js");
  return await t.ready, e ? Kt(e) : t;
}
function Kt(e) {
  return O(e, "form.validation");
}
function Re(e) {
  return O(e, "field.validation");
}
async function Ve(e, t, n = {}) {
  const { UnicornFormValidation: r } = await Gt();
  r.addGlobalValidator(e, t, n);
}
function $e() {
  return import("../components/field-cascade-select.js");
}
async function Be() {
  const e = await import("../components/field-file-drag.js");
  return await e.ready, e;
}
function ze() {
  return import("../components/field-modal-select.js");
}
async function We(e, t = {}) {
  const n = await import("../components/checkboxes-multi-select.js");
  return e && n.CheckboxesMultiSelect.handle(e, t), n;
}
function Ge() {
  return import("../components/field-repeatable.js");
}
function Ke() {
  return import("../components/field-single-image-drag.js");
}
let U;
function X() {
  return ct(), U = new ot();
}
function Qe() {
  return X();
}
function Xe(e) {
  U = e;
}
function Qt() {
  return U ??= X();
}
function Je(e, t) {
  return Qt().inject(e, t);
}
export {
  Ot as $,
  Ut as A,
  pe as B,
  ee as C,
  X as D,
  st as E,
  Qe as F,
  Xe as G,
  Qt as H,
  Je as I,
  Xt as J,
  S as K,
  ne as L,
  it as M,
  re as N,
  te as O,
  ht as P,
  $ as Q,
  ie as R,
  se as S,
  B as T,
  ae as U,
  kt as V,
  ce as W,
  ue as X,
  xt as Y,
  le as Z,
  fe as _,
  qt as a,
  W as a0,
  de as a1,
  y as a2,
  At as a3,
  Ft as a4,
  he as a5,
  me as a6,
  ye as a7,
  ge as a8,
  we as a9,
  $e as aA,
  Be as aB,
  ze as aC,
  We as aD,
  Ge as aE,
  Ke as aF,
  ve as aa,
  be as ab,
  Se as ac,
  _e as ad,
  Ce as ae,
  Oe as af,
  Te as ag,
  je as ah,
  Pe as ai,
  Rt as aj,
  Mt as ak,
  Dt as al,
  Vt as am,
  Me as an,
  zt as ao,
  Le as ap,
  Fe as aq,
  Ie as ar,
  Ue as as,
  qe as at,
  He as au,
  Ne as av,
  Gt as aw,
  Kt as ax,
  Re as ay,
  Ve as az,
  Zt as b,
  Yt as c,
  F as d,
  Jt as e,
  Ae as f,
  O as g,
  oe as h,
  g as i,
  $t as j,
  bt as k,
  It as l,
  Q as m,
  I as n,
  T as o,
  _ as p,
  xe as q,
  ke as r,
  Ht as s,
  Tt as t,
  m as u,
  Lt as v,
  pt as w,
  De as x,
  St as y,
  Ee as z
};
