var d = typeof global == "object" && global && global.Object === Object && global, T = typeof self == "object" && self && self.Object === Object && self, u = d || T || /* @__PURE__ */ Function("return this")(), o = u.Symbol, f = Object.prototype, v = f.hasOwnProperty, S = f.toString, e = o ? o.toStringTag : void 0;
function P(r) {
  var t = v.call(r, e), n = r[e];
  try {
    r[e] = void 0;
    var j = !0;
  } catch {
  }
  var O = S.call(r);
  return j && (t ? r[e] = n : delete r[e]), O;
}
var $ = Object.prototype, h = $.toString;
function m(r) {
  return h.call(r);
}
var A = "[object Null]", w = "[object Undefined]", c = o ? o.toStringTag : void 0;
function g(r) {
  return r == null ? r === void 0 ? w : A : c && c in Object(r) ? P(r) : m(r);
}
function b(r) {
  return r != null && typeof r == "object";
}
var Y = Array.isArray;
function y(r) {
  var t = typeof r;
  return r != null && (t == "object" || t == "function");
}
var _ = "[object AsyncFunction]", E = "[object Function]", F = "[object GeneratorFunction]", I = "[object Proxy]";
function l(r) {
  if (!y(r))
    return !1;
  var t = g(r);
  return t == E || t == F || t == _ || t == I;
}
var a = u["__core-js_shared__"], i = /* @__PURE__ */ (function() {
  var r = /[^.]+$/.exec(a && a.keys && a.keys.IE_PROTO || "");
  return r ? "Symbol(src)_1." + r : "";
})();
function k(r) {
  return !!i && i in r;
}
var x = Function.prototype, N = x.toString;
function R(r) {
  if (r != null) {
    try {
      return N.call(r);
    } catch {
    }
    try {
      return r + "";
    } catch {
    }
  }
  return "";
}
var G = /[\\^$.*+?()[\]{}|]/g, C = /^\[object .+?Constructor\]$/, L = Function.prototype, M = Object.prototype, q = L.toString, D = M.hasOwnProperty, H = /* @__PURE__ */ RegExp(
  "^" + /* @__PURE__ */ q.call(D).replace(G, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function J(r) {
  if (!y(r) || k(r))
    return !1;
  var t = l(r) ? H : C;
  return t.test(R(r));
}
function K(r, t) {
  return r?.[t];
}
function U(r, t) {
  var n = K(r, t);
  return J(n) ? n : void 0;
}
var Z = /* @__PURE__ */ (function() {
  try {
    var r = U(Object, "defineProperty");
    return r({}, "", {}), r;
  } catch {
  }
})();
function rr(r, t) {
  return r === t || r !== r && t !== t;
}
var V = 9007199254740991;
function X(r) {
  return typeof r == "number" && r > -1 && r % 1 == 0 && r <= V;
}
function tr(r) {
  return r != null && X(r.length) && !l(r);
}
var z = "[object Arguments]";
function s(r) {
  return b(r) && g(r) == z;
}
var p = Object.prototype, B = p.hasOwnProperty, Q = p.propertyIsEnumerable, er = /* @__PURE__ */ s(/* @__PURE__ */ (function() {
  return arguments;
})()) ? s : function(r) {
  return b(r) && B.call(r, "callee") && !Q.call(r, "callee");
};
export {
  o as S,
  er as a,
  b,
  tr as c,
  g as d,
  y as e,
  rr as f,
  Z as g,
  U as h,
  Y as i,
  X as j,
  d as k,
  u as r,
  R as t
};
