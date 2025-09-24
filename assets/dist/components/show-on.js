import { f as A, o as m, i as _, p as f, q as w, r as g } from "../chunks/unicorn-Dap6NpVD.js";
import { a as x, M as k } from "../chunks/_arrayPush-BPnR1RTH.js";
import { S as p, i as O, a as C, b as D, c as I } from "../chunks/isArguments-B1y5d3Sj.js";
import { b as L } from "../chunks/_baseRest-7FsGZDVI.js";
function N(e, t, i, n) {
  for (var r = e.length, s = i + -1; ++s < r; )
    if (t(e[s], s, e))
      return s;
  return -1;
}
function q(e) {
  return e !== e;
}
function E(e, t, i) {
  for (var n = i - 1, r = e.length; ++n < r; )
    if (e[n] === t)
      return n;
  return -1;
}
function R(e, t, i) {
  return t === t ? E(e, t, i) : N(e, q, i);
}
function F(e, t) {
  var i = e == null ? 0 : e.length;
  return !!i && R(e, t, 0) > -1;
}
var y = p ? p.isConcatSpreadable : void 0;
function H(e) {
  return O(e) || C(e) || !!(y && e && e[y]);
}
function M(e, t, i, n, r) {
  var s = -1, h = e.length;
  for (i || (i = H), r || (r = []); ++s < h; ) {
    var o = e[s];
    i(o) && x(r, o);
  }
  return r;
}
var T = "__lodash_hash_undefined__";
function V(e) {
  return this.__data__.set(e, T), this;
}
function j(e) {
  return this.__data__.has(e);
}
function u(e) {
  var t = -1, i = e == null ? 0 : e.length;
  for (this.__data__ = new k(); ++t < i; )
    this.add(e[t]);
}
u.prototype.add = u.prototype.push = V;
u.prototype.has = j;
function U(e, t) {
  return e.has(t);
}
function b(e) {
  return D(e) && I(e);
}
var v = 200;
function G(e, t, i, n) {
  var r = -1, s = F, h = !0, o = e.length, l = [], S = t.length;
  if (!o)
    return l;
  t.length >= v && (s = U, h = !1, t = new u(t));
  e:
    for (; ++r < o; ) {
      var a = e[r], c = a;
      if (a = a !== 0 ? a : 0, h && c === c) {
        for (var d = S; d--; )
          if (t[d] === c)
            continue e;
        l.push(a);
      } else s(t, c, n) || l.push(a);
    }
  return l;
}
var J = /* @__PURE__ */ L(function(e, t) {
  return b(e) ? G(e, M(t, 1, b)) : [];
});
class P {
  el = null;
  input = null;
  conditions = {};
  targets = {};
  readonly = !1;
  initialDisplay = null;
  constructor(t, i) {
    this.el = t, this.input = this.el.querySelector(
      this.el.dataset.inputSelector || "[data-field-input]"
    ), this.conditions = i, this.init();
  }
  init() {
    this.initialDisplay = window.getComputedStyle(this.el).display || "block";
    for (const t in this.conditions) {
      const i = this.conditions[t], n = _(t);
      this.input && (this.readonly = this.input.hasAttribute("readonly"));
      let r;
      n.nodeName === "DIV" ? r = Array.from(n.querySelectorAll("input, select, textarea")) : r = [n], f(r, (s) => {
        s.addEventListener("change", () => {
          this.updateShowState(n, i);
        });
      }), this.updateShowState(n, i, 1);
    }
  }
  updateShowState(t, i, n = 300) {
    const r = this.isValueMatched(t, i);
    r ? setTimeout(() => {
      w(this.el, n, this.initialDisplay);
    }, n + 30) : g(this.el, n), this.input && (r ? this.input.removeAttribute("readonly") : this.input.setAttribute("readonly", "readonly"));
  }
  isValueMatched(t, i) {
    let n = null;
    switch (this.nodeType(t)) {
      case "input":
      case "textarea":
        n = t.value;
        break;
      case "select":
        t.multiple ? n = f(t.querySelectorAll("option")).filter((s) => s.selected).map((s) => s.value) : n = t.value;
        break;
      case "checkbox":
        n = t.checked ? t.value : null;
        break;
      case "radio":
        n = t.querySelector("input[type=radio]:checked")?.value;
        break;
    }
    return Array.isArray(i) ? Array.isArray(n) ? J(i, n).length === 0 : i.indexOf(n) !== -1 : n && Array.isArray(n) ? n.indexOf(i) !== -1 : i == n;
  }
  /**
   * @see https://github.com/nickjackson/val/blob/master/index.js#L55
   * @param el
   * @returns {string}
   */
  nodeType(t) {
    var i = t.nodeName.toLowerCase(), n = t.type;
    if (i === "select")
      return "select";
    if (i === "textarea")
      return "textarea";
    if (i === "input")
      return n === "checkbox" ? "checkbox" : "input";
    if (i === "div" && t.querySelector("input[type=radio]"))
      return "radio";
  }
}
const B = /* @__PURE__ */ A("show-on", {
  mounted(e, { value: t }) {
    m(e, "show.on", (i) => new P(i, JSON.parse(t)));
  }
});
export {
  B as ready
};
