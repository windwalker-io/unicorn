import { d as y, u as p } from "../chunks/unicorn-Dap6NpVD.js";
function w(r, e) {
  const t = r, s = x(t);
  r = s.route;
  let n = s.path;
  const a = y("unicorn.routes") || {};
  let u = a[r];
  if (u == null && (r.startsWith("@") ? r = r.substring(1) : r = "@" + r), u = a[r], u == null)
    throw new Error(`Route: "${t}" not found`);
  if (n) {
    const { route: i, path: h } = x(u, "?"), { route: o, path: c } = x(n, "?");
    if (u = i + "/" + o, h || c) {
      const q = [h, c].filter((E) => E).join("&");
      u += "?" + q;
    }
  }
  return I(u);
}
function x(r, e = "/") {
  if (r.indexOf(e) === -1)
    return { route: r, path: "" };
  const t = r.split(e);
  r = t.shift() || "";
  const s = t.join(e);
  return { route: r, path: s };
}
function I(r, e) {
  return r;
}
function S(r) {
  return r.split(/(%[0-9A-Fa-f]{2})/g).map(function(e) {
    return /%[0-9A-Fa-f]/.test(e) || (e = encodeURI(e).replace(/%5B/g, "[").replace(/%5D/g, "]")), e;
  }).join("");
}
function d(r) {
  return encodeURIComponent(r).replace(/[!'()*]/g, function(e) {
    return "%" + e.charCodeAt(0).toString(16).toUpperCase();
  });
}
function f(r, e, t) {
  return e = r === "+" || r === "#" ? S(e) : d(e), t ? d(t) + "=" + e : e;
}
function l(r) {
  return r != null;
}
function m(r) {
  return r === ";" || r === "&" || r === "?";
}
function T(r, e, t, s) {
  var n = r[t], a = [];
  if (l(n) && n !== "")
    if (typeof n == "string" || typeof n == "number" || typeof n == "boolean")
      n = n.toString(), s && s !== "*" && (n = n.substring(0, parseInt(s, 10))), a.push(f(e, n, m(e) ? t : null));
    else if (s === "*")
      Array.isArray(n) ? n.filter(l).forEach(function(i) {
        a.push(f(e, i, m(e) ? t : null));
      }) : Object.keys(n).forEach(function(i) {
        l(n[i]) && a.push(f(e, n[i], i));
      });
    else {
      var u = [];
      Array.isArray(n) ? n.filter(l).forEach(function(i) {
        u.push(f(e, i));
      }) : Object.keys(n).forEach(function(i) {
        l(n[i]) && (u.push(d(i)), u.push(f(e, n[i].toString())));
      }), m(e) ? a.push(d(t) + "=" + u.join(",")) : u.length !== 0 && a.push(u.join(","));
    }
  else
    e === ";" ? l(n) && a.push(d(t)) : n === "" && (e === "&" || e === "?") ? a.push(d(t) + "=") : n === "" && a.push("");
  return a;
}
function j(r) {
  var e = ["+", "#", ".", "/", ";", "?", "&"];
  return {
    expand: function(t) {
      return r.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function(s, n, a) {
        if (n) {
          var u = null, i = [];
          if (e.indexOf(n.charAt(0)) !== -1 && (u = n.charAt(0), n = n.substr(1)), n.split(/,/g).forEach(function(o) {
            var c = /([^:\*]*)(?::(\d+)|(\*))?/.exec(o);
            i.push.apply(i, T(t, u, c[1], c[2] || c[3]));
          }), u && u !== "+") {
            var h = ",";
            return u === "?" ? h = "&" : u !== "#" && (h = u), (i.length !== 0 ? u : "") + i.join(h);
          } else
            return i.join(",");
        } else
          return S(a);
      });
    }
  };
}
class A {
  constructor(e) {
    this.config = e;
  }
  static axiosStatic;
  axios;
  static importAxios() {
    return p("@axios");
  }
  static async getAxiosStatic() {
    return this.axiosStatic || (this.axiosStatic = this.importAxios()), this.axiosStatic;
  }
  async createHttp() {
    const e = await A.getAxiosStatic();
    return this.axios = e.create(this.config || {});
  }
  async getAxiosInstance() {
    return this.axios ? this.axios : this.axios = this.prepareAxios(await this.createHttp());
  }
  prepareAxios(e) {
    return e.interceptors.request.use((t) => {
      if (t.headers["X-CSRF-Token"] = y("csrf-token"), t.url && t.url.startsWith("@") && (t.url = w(t.url)), t?.vars && t.url) {
        const s = j(t.url);
        t.url = s.expand(t.vars || {});
      }
      return t.methodSimulate && (t.methodSimulateByHeader ? t.headers["X-HTTP-Method-Override"] = t : typeof t.data == "object" ? t.data._method = t.method : typeof t.data == "string" && (t.data.includes("?") ? t.data += "&_method=" + t.method : t.data += "?_method=" + t.method), t.method.toLowerCase() !== "get" && (t.method = "POST")), t;
    }), e;
  }
  requestMiddleware(e) {
    return this.getAxiosInstance().then((t) => t.interceptors.request.use(e));
  }
  responseMiddleware(e) {
    return this.getAxiosInstance().then((t) => t.interceptors.response.use(e));
  }
  // ready() {
  //   super.ready();
  // }
  /**
   * Send a GET request.
   */
  get(e, t = {}) {
    return t.url = e, t.method = "GET", this.request(t);
  }
  /**
   * Send a POST request.
   */
  post(e, t, s = {}) {
    return s.url = e, s.method = "POST", s.data = t, this.request(s);
  }
  /**
   * Send a PUT request.
   *
   * @param {string} url
   * @param {any} data
   * @param {AxiosRequestConfig} options
   *
   * @returns {Promise<AxiosResponse>}
   */
  put(e, t, s = {}) {
    return s.url = e, s.method = "PUT", s.data = t, this.request(s);
  }
  /**
   * Send a PATCH request.
   *
   * @param {string} url
   * @param {any} data
   * @param {AxiosRequestConfig} options
   *
   * @returns {Promise<AxiosResponse>}
   */
  patch(e, t, s = {}) {
    return s.url = e, s.method = "PATCH", s.data = t, this.request(s);
  }
  /**
   * Send a DELETE request.
   *
   * @param {string} url
   * @param {any} data
   * @param {AxiosRequestConfig} options
   *
   * @returns {Promise<AxiosResponse>}
   */
  delete(e, t, s = {}) {
    return s.url = e, s.method = "DELETE", s.data = t, this.request(s);
  }
  /**
   * Send a HEAD request.
   *
   * @param {string} url
   * @param {AxiosRequestConfig} options
   *
   * @returns {Promise<AxiosResponse>}
   */
  head(e, t = {}) {
    return t.url = e, t.method = "HEAD", this.request(t);
  }
  /**
   * Send a OPTIONS request.
   *
   * @param {string} url
   * @param {AxiosRequestConfig} options
   *
   * @returns {Promise<AxiosResponse>}
   */
  options(e, t = {}) {
    return t.url = e, t.method = "OPTIONS", this.request(t);
  }
  isCancel(e) {
    return axios.isCancel(e);
  }
  /**
   * Send request.
   */
  async request(e) {
    try {
      return await (await this.getAxiosInstance())(e);
    } catch (t) {
      t.originMessage = t.message;
      const s = t;
      throw s.response?.data?.message && (s.message = s.response.data.message), s;
    }
  }
  async errorClass() {
    return (await A.getAxiosStatic()).AxiosError;
  }
}
export {
  A as UnicornHttpClient
};
