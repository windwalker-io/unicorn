import { g as b, f as v, r as x, b as O, j as P, d as h, k as w, a as I, i as B, c as E } from "./isArguments-B1y5d3Sj.js";
var $ = 9007199254740991, U = /^(?:0|[1-9]\d*)$/;
function M(r, e) {
  var t = typeof r;
  return e = e ?? $, !!e && (t == "number" || t != "symbol" && U.test(r)) && r > -1 && r % 1 == 0 && r < e;
}
function _(r, e, t) {
  e == "__proto__" && b ? b(r, e, {
    configurable: !0,
    enumerable: !0,
    value: t,
    writable: !0
  }) : r[e] = t;
}
var F = Object.prototype, L = F.hasOwnProperty;
function hr(r, e, t) {
  var n = r[e];
  (!(L.call(r, e) && v(n, t)) || t === void 0 && !(e in r)) && _(r, e, t);
}
var V = Object.prototype;
function S(r) {
  var e = r && r.constructor, t = typeof e == "function" && e.prototype || V;
  return r === t;
}
function q(r, e) {
  for (var t = -1, n = Array(r); ++t < r; )
    n[t] = e(t);
  return n;
}
function C() {
  return !1;
}
var T = typeof exports == "object" && exports && !exports.nodeType && exports, y = T && typeof module == "object" && module && !module.nodeType && module, G = y && y.exports === T, g = G ? x.Buffer : void 0, K = g ? g.isBuffer : void 0, D = K || C, N = "[object Arguments]", R = "[object Array]", W = "[object Boolean]", X = "[object Date]", z = "[object Error]", H = "[object Function]", J = "[object Map]", Q = "[object Number]", Y = "[object Object]", Z = "[object RegExp]", k = "[object Set]", rr = "[object String]", er = "[object WeakMap]", tr = "[object ArrayBuffer]", ar = "[object DataView]", or = "[object Float32Array]", nr = "[object Float64Array]", sr = "[object Int8Array]", ir = "[object Int16Array]", fr = "[object Int32Array]", ur = "[object Uint8Array]", pr = "[object Uint8ClampedArray]", cr = "[object Uint16Array]", br = "[object Uint32Array]", a = {};
a[or] = a[nr] = a[sr] = a[ir] = a[fr] = a[ur] = a[pr] = a[cr] = a[br] = !0;
a[N] = a[R] = a[tr] = a[W] = a[ar] = a[X] = a[z] = a[H] = a[J] = a[Q] = a[Y] = a[Z] = a[k] = a[rr] = a[er] = !1;
function yr(r) {
  return O(r) && P(r.length) && !!a[h(r)];
}
function gr(r) {
  return function(e) {
    return r(e);
  };
}
var l = typeof exports == "object" && exports && !exports.nodeType && exports, s = l && typeof module == "object" && module && !module.nodeType && module, dr = s && s.exports === l, u = dr && w.process, d = /* @__PURE__ */ (function() {
  try {
    var r = s && s.require && s.require("util").types;
    return r || u && u.binding && u.binding("util");
  } catch {
  }
})(), j = d && d.isTypedArray, jr = j ? /* @__PURE__ */ gr(j) : yr, Tr = Object.prototype, lr = Tr.hasOwnProperty;
function Ar(r, e) {
  var t = B(r), n = !t && I(r), i = !t && !n && D(r), p = !t && !n && !i && jr(r), c = t || n || i || p, f = c ? q(r.length, String) : [], m = f.length;
  for (var o in r)
    (e || lr.call(r, o)) && !(c && // Safari 9 has enumerable `arguments.length` in strict mode.
    (o == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
    i && (o == "offset" || o == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    p && (o == "buffer" || o == "byteLength" || o == "byteOffset") || // Skip index properties.
    M(o, m))) && f.push(o);
  return f;
}
function A(r, e) {
  return function(t) {
    return r(e(t));
  };
}
var mr = /* @__PURE__ */ A(Object.keys, Object), vr = Object.prototype, xr = vr.hasOwnProperty;
function Or(r) {
  if (!S(r))
    return mr(r);
  var e = [];
  for (var t in Object(r))
    xr.call(r, t) && t != "constructor" && e.push(t);
  return e;
}
function wr(r) {
  return E(r) ? Ar(r) : Or(r);
}
var Ir = /* @__PURE__ */ A(Object.getPrototypeOf, Object);
export {
  hr as a,
  _ as b,
  S as c,
  Ar as d,
  gr as e,
  D as f,
  Ir as g,
  M as i,
  wr as k,
  d as n
};
