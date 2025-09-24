import { h as l, f as u, r as c } from "./isArguments-B1y5d3Sj.js";
var s = /* @__PURE__ */ l(Object, "create");
function d() {
  this.__data__ = s ? s(null) : {}, this.size = 0;
}
function f(t) {
  var e = this.has(t) && delete this.__data__[t];
  return this.size -= e ? 1 : 0, e;
}
var v = "__lodash_hash_undefined__", g = Object.prototype, C = g.hasOwnProperty;
function y(t) {
  var e = this.__data__;
  if (s) {
    var a = e[t];
    return a === v ? void 0 : a;
  }
  return C.call(e, t) ? e[t] : void 0;
}
var w = Object.prototype, z = w.hasOwnProperty;
function m(t) {
  var e = this.__data__;
  return s ? e[t] !== void 0 : z.call(e, t);
}
var b = "__lodash_hash_undefined__";
function x(t, e) {
  var a = this.__data__;
  return this.size += this.has(t) ? 0 : 1, a[t] = s && e === void 0 ? b : e, this;
}
function n(t) {
  var e = -1, a = t == null ? 0 : t.length;
  for (this.clear(); ++e < a; ) {
    var r = t[e];
    this.set(r[0], r[1]);
  }
}
n.prototype.clear = d;
n.prototype.delete = f;
n.prototype.get = y;
n.prototype.has = m;
n.prototype.set = x;
function D() {
  this.__data__ = [], this.size = 0;
}
function o(t, e) {
  for (var a = t.length; a--; )
    if (u(t[a][0], e))
      return a;
  return -1;
}
var H = Array.prototype, O = H.splice;
function P(t) {
  var e = this.__data__, a = o(e, t);
  if (a < 0)
    return !1;
  var r = e.length - 1;
  return a == r ? e.pop() : O.call(e, a, 1), --this.size, !0;
}
function j(t) {
  var e = this.__data__, a = o(e, t);
  return a < 0 ? void 0 : e[a][1];
}
function M(t) {
  return o(this.__data__, t) > -1;
}
function N(t, e) {
  var a = this.__data__, r = o(a, t);
  return r < 0 ? (++this.size, a.push([t, e])) : a[r][1] = e, this;
}
function i(t) {
  var e = -1, a = t == null ? 0 : t.length;
  for (this.clear(); ++e < a; ) {
    var r = t[e];
    this.set(r[0], r[1]);
  }
}
i.prototype.clear = D;
i.prototype.delete = P;
i.prototype.get = j;
i.prototype.has = M;
i.prototype.set = N;
var S = /* @__PURE__ */ l(c, "Map");
function E() {
  this.size = 0, this.__data__ = {
    hash: new n(),
    map: new (S || i)(),
    string: new n()
  };
}
function I(t) {
  var e = typeof t;
  return e == "string" || e == "number" || e == "symbol" || e == "boolean" ? t !== "__proto__" : t === null;
}
function _(t, e) {
  var a = t.__data__;
  return I(e) ? a[typeof e == "string" ? "string" : "hash"] : a.map;
}
function A(t) {
  var e = _(this, t).delete(t);
  return this.size -= e ? 1 : 0, e;
}
function G(t) {
  return _(this, t).get(t);
}
function $(t) {
  return _(this, t).has(t);
}
function F(t, e) {
  var a = _(this, t), r = a.size;
  return a.set(t, e), this.size += a.size == r ? 0 : 1, this;
}
function h(t) {
  var e = -1, a = t == null ? 0 : t.length;
  for (this.clear(); ++e < a; ) {
    var r = t[e];
    this.set(r[0], r[1]);
  }
}
h.prototype.clear = E;
h.prototype.delete = A;
h.prototype.get = G;
h.prototype.has = $;
h.prototype.set = F;
function U(t, e) {
  for (var a = -1, r = e.length, p = t.length; ++a < r; )
    t[p + a] = e[a];
  return t;
}
export {
  i as L,
  h as M,
  U as a,
  S as b
};
