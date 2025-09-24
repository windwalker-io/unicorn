import { g as o } from "./isArguments-B1y5d3Sj.js";
function v(n) {
  return n;
}
function f(n, e, r) {
  switch (r.length) {
    case 0:
      return n.call(e);
    case 1:
      return n.call(e, r[0]);
    case 2:
      return n.call(e, r[0], r[1]);
    case 3:
      return n.call(e, r[0], r[1], r[2]);
  }
  return n.apply(e, r);
}
var p = 800, m = 16, d = Date.now;
function y(n) {
  var e = 0, r = 0;
  return function() {
    var a = d(), t = m - (a - r);
    if (r = a, t > 0) {
      if (++e >= p)
        return arguments[0];
    } else
      e = 0;
    return n.apply(void 0, arguments);
  };
}
function h(n) {
  return function() {
    return n;
  };
}
var s = o ? function(n, e) {
  return o(n, "toString", {
    configurable: !0,
    enumerable: !1,
    value: h(e),
    writable: !0
  });
} : v, b = /* @__PURE__ */ y(s), c = Math.max;
function w(n, e, r) {
  return e = c(e === void 0 ? n.length - 1 : e, 0), function() {
    for (var a = arguments, t = -1, i = c(a.length - e, 0), l = Array(i); ++t < i; )
      l[t] = a[e + t];
    t = -1;
    for (var u = Array(e + 1); ++t < e; )
      u[t] = a[t];
    return u[e] = r(l), f(n, this, u);
  };
}
function T(n, e) {
  return b(w(n, e, v), n + "");
}
export {
  f as a,
  T as b
};
