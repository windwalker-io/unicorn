import { d as data, u as useImport } from "./unicorn-BzhUK5qp.js";
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
  return addQuery(url);
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
function addQuery(url, query) {
  {
    return url;
  }
}
function encodeReserved(str) {
  return str.split(/(%[0-9A-Fa-f]{2})/g).map(function(part) {
    if (!/%[0-9A-Fa-f]/.test(part)) {
      part = encodeURI(part).replace(/%5B/g, "[").replace(/%5D/g, "]");
    }
    return part;
  }).join("");
}
function encodeUnreserved(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
    return "%" + c.charCodeAt(0).toString(16).toUpperCase();
  });
}
function encodeValue(operator, value, key) {
  value = operator === "+" || operator === "#" ? encodeReserved(value) : encodeUnreserved(value);
  if (key) {
    return encodeUnreserved(key) + "=" + value;
  } else {
    return value;
  }
}
function isDefined(value) {
  return value !== void 0 && value !== null;
}
function isKeyOperator(operator) {
  return operator === ";" || operator === "&" || operator === "?";
}
function getValues(context, operator, key, modifier) {
  var value = context[key], result = [];
  if (isDefined(value) && value !== "") {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      value = value.toString();
      if (modifier && modifier !== "*") {
        value = value.substring(0, parseInt(modifier, 10));
      }
      result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : null));
    } else {
      if (modifier === "*") {
        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function(value2) {
            result.push(encodeValue(operator, value2, isKeyOperator(operator) ? key : null));
          });
        } else {
          Object.keys(value).forEach(function(k) {
            if (isDefined(value[k])) {
              result.push(encodeValue(operator, value[k], k));
            }
          });
        }
      } else {
        var tmp = [];
        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function(value2) {
            tmp.push(encodeValue(operator, value2));
          });
        } else {
          Object.keys(value).forEach(function(k) {
            if (isDefined(value[k])) {
              tmp.push(encodeUnreserved(k));
              tmp.push(encodeValue(operator, value[k].toString()));
            }
          });
        }
        if (isKeyOperator(operator)) {
          result.push(encodeUnreserved(key) + "=" + tmp.join(","));
        } else if (tmp.length !== 0) {
          result.push(tmp.join(","));
        }
      }
    }
  } else {
    if (operator === ";") {
      if (isDefined(value)) {
        result.push(encodeUnreserved(key));
      }
    } else if (value === "" && (operator === "&" || operator === "?")) {
      result.push(encodeUnreserved(key) + "=");
    } else if (value === "") {
      result.push("");
    }
  }
  return result;
}
function parseTemplate(template) {
  var operators = ["+", "#", ".", "/", ";", "?", "&"];
  return {
    expand: function(context) {
      return template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function(_, expression, literal) {
        if (expression) {
          var operator = null, values = [];
          if (operators.indexOf(expression.charAt(0)) !== -1) {
            operator = expression.charAt(0);
            expression = expression.substr(1);
          }
          expression.split(/,/g).forEach(function(variable) {
            var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
            values.push.apply(values, getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
          });
          if (operator && operator !== "+") {
            var separator = ",";
            if (operator === "?") {
              separator = "&";
            } else if (operator !== "#") {
              separator = operator;
            }
            return (values.length !== 0 ? operator : "") + values.join(separator);
          } else {
            return values.join(",");
          }
        } else {
          return encodeReserved(literal);
        }
      });
    }
  };
}
class UnicornHttpClient {
  constructor(config) {
    this.config = config;
  }
  static axiosStatic;
  axios;
  static importAxios() {
    return useImport("@axios");
  }
  static async getAxiosStatic() {
    if (!this.axiosStatic) {
      this.axiosStatic = this.importAxios();
    }
    return this.axiosStatic;
  }
  async createHttp() {
    const axiosStatic = await UnicornHttpClient.getAxiosStatic();
    return this.axios = axiosStatic.create(this.config || {});
  }
  async getAxiosInstance() {
    if (this.axios) {
      return this.axios;
    }
    return this.axios = this.prepareAxios(await this.createHttp());
  }
  prepareAxios(axios2) {
    axios2.interceptors.request.use((config) => {
      config.headers["X-CSRF-Token"] = data("csrf-token");
      if (config.url && config.url.startsWith("@")) {
        config.url = route(config.url);
      }
      if (config?.vars && config.url) {
        const tmpl = parseTemplate(config.url);
        config.url = tmpl.expand(config.vars || {});
      }
      if (config.methodSimulate) {
        if (config.methodSimulateByHeader) {
          config.headers["X-HTTP-Method-Override"] = config;
        } else if (typeof config.data === "object") {
          config.data["_method"] = config.method;
        } else if (typeof config.data === "string") {
          if (config.data.includes("?")) {
            config.data += "&_method=" + config.method;
          } else {
            config.data += "?_method=" + config.method;
          }
        }
        if (config.method.toLowerCase() !== "get") {
          config.method = "POST";
        }
      }
      return config;
    });
    return axios2;
  }
  requestMiddleware(callback) {
    return this.getAxiosInstance().then((axios2) => axios2.interceptors.request.use(callback));
  }
  responseMiddleware(callback) {
    return this.getAxiosInstance().then((axios2) => axios2.interceptors.response.use(callback));
  }
  // ready() {
  //   super.ready();
  // }
  /**
   * Send a GET request.
   */
  get(url, options = {}) {
    options.url = url;
    options.method = "GET";
    return this.request(options);
  }
  /**
   * Send a POST request.
   */
  post(url, data2, options = {}) {
    options.url = url;
    options.method = "POST";
    options.data = data2;
    return this.request(options);
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
  put(url, data2, options = {}) {
    options.url = url;
    options.method = "PUT";
    options.data = data2;
    return this.request(options);
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
  patch(url, data2, options = {}) {
    options.url = url;
    options.method = "PATCH";
    options.data = data2;
    return this.request(options);
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
  delete(url, data2, options = {}) {
    options.url = url;
    options.method = "DELETE";
    options.data = data2;
    return this.request(options);
  }
  /**
   * Send a HEAD request.
   *
   * @param {string} url
   * @param {AxiosRequestConfig} options
   *
   * @returns {Promise<AxiosResponse>}
   */
  head(url, options = {}) {
    options.url = url;
    options.method = "HEAD";
    return this.request(options);
  }
  /**
   * Send a OPTIONS request.
   *
   * @param {string} url
   * @param {AxiosRequestConfig} options
   *
   * @returns {Promise<AxiosResponse>}
   */
  options(url, options = {}) {
    options.url = url;
    options.method = "OPTIONS";
    return this.request(options);
  }
  isCancel(cancel) {
    return axios.isCancel(cancel);
  }
  /**
   * Send request.
   */
  async request(options) {
    try {
      let axiosInstance = await this.getAxiosInstance();
      return await axiosInstance(options);
    } catch (e) {
      e.originMessage = e.message;
      const err = e;
      if (err.response?.data?.message) {
        err.message = err.response.data.message;
      }
      throw err;
    }
  }
  async errorClass() {
    const axios2 = await UnicornHttpClient.getAxiosStatic();
    return axios2.AxiosError;
  }
}
export {
  UnicornHttpClient
};
