import { l as data, z as route } from "./unicorn-D5cXQeSK.js";
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
  static async importAxios() {
    const { default: axios2 } = await import("axios");
    return axios2;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC1jbGllbnQtX2RucWpIVVguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy91cmwtdGVtcGxhdGUvbGliL3VybC10ZW1wbGF0ZS5qcyIsIi4uLy4uL3NyYy9tb2R1bGUvaHR0cC1jbGllbnQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gZW5jb2RlUmVzZXJ2ZWQoc3RyKSB7XG4gIHJldHVybiBzdHIuc3BsaXQoLyglWzAtOUEtRmEtZl17Mn0pL2cpLm1hcChmdW5jdGlvbiAocGFydCkge1xuICAgIGlmICghLyVbMC05QS1GYS1mXS8udGVzdChwYXJ0KSkge1xuICAgICAgcGFydCA9IGVuY29kZVVSSShwYXJ0KS5yZXBsYWNlKC8lNUIvZywgJ1snKS5yZXBsYWNlKC8lNUQvZywgJ10nKTtcbiAgICB9XG4gICAgcmV0dXJuIHBhcnQ7XG4gIH0pLmpvaW4oJycpO1xufVxuXG5mdW5jdGlvbiBlbmNvZGVVbnJlc2VydmVkKHN0cikge1xuICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHN0cikucmVwbGFjZSgvWyEnKCkqXS9nLCBmdW5jdGlvbiAoYykge1xuICAgIHJldHVybiAnJScgKyBjLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBlbmNvZGVWYWx1ZShvcGVyYXRvciwgdmFsdWUsIGtleSkge1xuICB2YWx1ZSA9IChvcGVyYXRvciA9PT0gJysnIHx8IG9wZXJhdG9yID09PSAnIycpID8gZW5jb2RlUmVzZXJ2ZWQodmFsdWUpIDogZW5jb2RlVW5yZXNlcnZlZCh2YWx1ZSk7XG5cbiAgaWYgKGtleSkge1xuICAgIHJldHVybiBlbmNvZGVVbnJlc2VydmVkKGtleSkgKyAnPScgKyB2YWx1ZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNEZWZpbmVkKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc0tleU9wZXJhdG9yKG9wZXJhdG9yKSB7XG4gIHJldHVybiBvcGVyYXRvciA9PT0gJzsnIHx8IG9wZXJhdG9yID09PSAnJicgfHwgb3BlcmF0b3IgPT09ICc/Jztcbn1cblxuZnVuY3Rpb24gZ2V0VmFsdWVzKGNvbnRleHQsIG9wZXJhdG9yLCBrZXksIG1vZGlmaWVyKSB7XG4gIHZhciB2YWx1ZSA9IGNvbnRleHRba2V5XSxcbiAgICAgIHJlc3VsdCA9IFtdO1xuXG4gIGlmIChpc0RlZmluZWQodmFsdWUpICYmIHZhbHVlICE9PSAnJykge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgfHwgdHlwZW9mIHZhbHVlID09PSAnYm9vbGVhbicpIHtcbiAgICAgIHZhbHVlID0gdmFsdWUudG9TdHJpbmcoKTtcblxuICAgICAgaWYgKG1vZGlmaWVyICYmIG1vZGlmaWVyICE9PSAnKicpIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5zdWJzdHJpbmcoMCwgcGFyc2VJbnQobW9kaWZpZXIsIDEwKSk7XG4gICAgICB9XG5cbiAgICAgIHJlc3VsdC5wdXNoKGVuY29kZVZhbHVlKG9wZXJhdG9yLCB2YWx1ZSwgaXNLZXlPcGVyYXRvcihvcGVyYXRvcikgPyBrZXkgOiBudWxsKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChtb2RpZmllciA9PT0gJyonKSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgIHZhbHVlLmZpbHRlcihpc0RlZmluZWQpLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaChlbmNvZGVWYWx1ZShvcGVyYXRvciwgdmFsdWUsIGlzS2V5T3BlcmF0b3Iob3BlcmF0b3IpID8ga2V5IDogbnVsbCkpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIE9iamVjdC5rZXlzKHZhbHVlKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG4gICAgICAgICAgICBpZiAoaXNEZWZpbmVkKHZhbHVlW2tdKSkge1xuICAgICAgICAgICAgICByZXN1bHQucHVzaChlbmNvZGVWYWx1ZShvcGVyYXRvciwgdmFsdWVba10sIGspKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHRtcCA9IFtdO1xuXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgIHZhbHVlLmZpbHRlcihpc0RlZmluZWQpLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICB0bXAucHVzaChlbmNvZGVWYWx1ZShvcGVyYXRvciwgdmFsdWUpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBPYmplY3Qua2V5cyh2YWx1ZSkuZm9yRWFjaChmdW5jdGlvbiAoaykge1xuICAgICAgICAgICAgaWYgKGlzRGVmaW5lZCh2YWx1ZVtrXSkpIHtcbiAgICAgICAgICAgICAgdG1wLnB1c2goZW5jb2RlVW5yZXNlcnZlZChrKSk7XG4gICAgICAgICAgICAgIHRtcC5wdXNoKGVuY29kZVZhbHVlKG9wZXJhdG9yLCB2YWx1ZVtrXS50b1N0cmluZygpKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNLZXlPcGVyYXRvcihvcGVyYXRvcikpIHtcbiAgICAgICAgICByZXN1bHQucHVzaChlbmNvZGVVbnJlc2VydmVkKGtleSkgKyAnPScgKyB0bXAuam9pbignLCcpKTtcbiAgICAgICAgfSBlbHNlIGlmICh0bXAubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2godG1wLmpvaW4oJywnKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKG9wZXJhdG9yID09PSAnOycpIHtcbiAgICAgIGlmIChpc0RlZmluZWQodmFsdWUpKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKGVuY29kZVVucmVzZXJ2ZWQoa2V5KSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJycgJiYgKG9wZXJhdG9yID09PSAnJicgfHwgb3BlcmF0b3IgPT09ICc/JykpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGVuY29kZVVucmVzZXJ2ZWQoa2V5KSArICc9Jyk7XG4gICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJycpIHtcbiAgICAgIHJlc3VsdC5wdXNoKCcnKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlVGVtcGxhdGUodGVtcGxhdGUpIHtcbiAgdmFyIG9wZXJhdG9ycyA9IFsnKycsICcjJywgJy4nLCAnLycsICc7JywgJz8nLCAnJiddO1xuXG4gIHJldHVybiB7XG4gICAgZXhwYW5kOiBmdW5jdGlvbiAoY29udGV4dCkge1xuICAgICAgcmV0dXJuIHRlbXBsYXRlLnJlcGxhY2UoL1xceyhbXlxce1xcfV0rKVxcfXwoW15cXHtcXH1dKykvZywgZnVuY3Rpb24gKF8sIGV4cHJlc3Npb24sIGxpdGVyYWwpIHtcbiAgICAgICAgaWYgKGV4cHJlc3Npb24pIHtcbiAgICAgICAgICB2YXIgb3BlcmF0b3IgPSBudWxsLFxuICAgICAgICAgICAgICB2YWx1ZXMgPSBbXTtcblxuICAgICAgICAgIGlmIChvcGVyYXRvcnMuaW5kZXhPZihleHByZXNzaW9uLmNoYXJBdCgwKSkgIT09IC0xKSB7XG4gICAgICAgICAgICBvcGVyYXRvciA9IGV4cHJlc3Npb24uY2hhckF0KDApO1xuICAgICAgICAgICAgZXhwcmVzc2lvbiA9IGV4cHJlc3Npb24uc3Vic3RyKDEpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGV4cHJlc3Npb24uc3BsaXQoLywvZykuZm9yRWFjaChmdW5jdGlvbiAodmFyaWFibGUpIHtcbiAgICAgICAgICAgIHZhciB0bXAgPSAvKFteOlxcKl0qKSg/OjooXFxkKyl8KFxcKikpPy8uZXhlYyh2YXJpYWJsZSk7XG4gICAgICAgICAgICB2YWx1ZXMucHVzaC5hcHBseSh2YWx1ZXMsIGdldFZhbHVlcyhjb250ZXh0LCBvcGVyYXRvciwgdG1wWzFdLCB0bXBbMl0gfHwgdG1wWzNdKSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBpZiAob3BlcmF0b3IgJiYgb3BlcmF0b3IgIT09ICcrJykge1xuICAgICAgICAgICAgdmFyIHNlcGFyYXRvciA9ICcsJztcblxuICAgICAgICAgICAgaWYgKG9wZXJhdG9yID09PSAnPycpIHtcbiAgICAgICAgICAgICAgc2VwYXJhdG9yID0gJyYnO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvcGVyYXRvciAhPT0gJyMnKSB7XG4gICAgICAgICAgICAgIHNlcGFyYXRvciA9IG9wZXJhdG9yO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuICh2YWx1ZXMubGVuZ3RoICE9PSAwID8gb3BlcmF0b3IgOiAnJykgKyB2YWx1ZXMuam9pbihzZXBhcmF0b3IpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWVzLmpvaW4oJywnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGVuY29kZVJlc2VydmVkKGxpdGVyYWwpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59XG4iLCJpbXBvcnQgdHlwZSB7XG4gIEF4aW9zRXJyb3IsXG4gIEF4aW9zSW5zdGFuY2UsXG4gIEF4aW9zUmVxdWVzdENvbmZpZyxcbiAgQXhpb3NSZXNwb25zZSxcbiAgQXhpb3NTdGF0aWMsXG4gIENyZWF0ZUF4aW9zRGVmYXVsdHNcbn0gZnJvbSAnYXhpb3MnO1xuaW1wb3J0IHsgcGFyc2VUZW1wbGF0ZSB9IGZyb20gJ3VybC10ZW1wbGF0ZSc7XG5pbXBvcnQgeyBkYXRhIH0gZnJvbSAnLi4vZGF0YSc7XG5pbXBvcnQgeyByb3V0ZSwgdXNlSW1wb3J0IH0gZnJvbSAnLi4vc2VydmljZSc7XG5cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgbGV0IGF4aW9zOiBBeGlvc1N0YXRpYztcbn1cblxuZGVjbGFyZSBtb2R1bGUgJ2F4aW9zJyB7XG4gIGV4cG9ydCBpbnRlcmZhY2UgQXhpb3NSZXF1ZXN0Q29uZmlnIHtcbiAgICB2YXJzPzogUmVjb3JkPHN0cmluZywgYW55PjtcbiAgICBtZXRob2RTaW11bGF0ZT86IHN0cmluZztcbiAgICBtZXRob2RTaW11bGF0ZUJ5SGVhZGVyPzogYm9vbGVhbjtcbiAgfVxuXG4gIGV4cG9ydCBpbnRlcmZhY2UgQ3JlYXRlQXhpb3NEZWZhdWx0cyB7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFVuaWNvcm5IdHRwQ2xpZW50IHtcbiAgc3RhdGljIGF4aW9zU3RhdGljPzogUHJvbWlzZTxBeGlvc1N0YXRpYz47XG4gIGF4aW9zPzogQXhpb3NJbnN0YW5jZTtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgY29uZmlnPzogQ3JlYXRlQXhpb3NEZWZhdWx0cykge1xuICB9XG5cbiAgc3RhdGljIGFzeW5jIGltcG9ydEF4aW9zKCk6IFByb21pc2U8YW55PiB7XG4gICAgY29uc3QgeyBkZWZhdWx0OiBheGlvcyB9ID0gYXdhaXQgaW1wb3J0KCdheGlvcycpO1xuXG4gICAgcmV0dXJuIGF4aW9zO1xuICB9XG5cbiAgc3RhdGljIGFzeW5jIGdldEF4aW9zU3RhdGljKCk6IFByb21pc2U8QXhpb3NTdGF0aWM+IHtcbiAgICBpZiAoIXRoaXMuYXhpb3NTdGF0aWMpIHtcbiAgICAgIHRoaXMuYXhpb3NTdGF0aWMgPSB0aGlzLmltcG9ydEF4aW9zKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuYXhpb3NTdGF0aWM7XG4gIH1cblxuICBhc3luYyBjcmVhdGVIdHRwKCkge1xuICAgIGNvbnN0IGF4aW9zU3RhdGljID0gYXdhaXQgVW5pY29ybkh0dHBDbGllbnQuZ2V0QXhpb3NTdGF0aWMoKTtcblxuICAgIHJldHVybiB0aGlzLmF4aW9zID0gYXhpb3NTdGF0aWMuY3JlYXRlKHRoaXMuY29uZmlnIHx8IHt9KTtcbiAgfVxuXG4gIGFzeW5jIGdldEF4aW9zSW5zdGFuY2UoKSB7XG4gICAgaWYgKHRoaXMuYXhpb3MpIHtcbiAgICAgIHJldHVybiB0aGlzLmF4aW9zO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmF4aW9zID0gdGhpcy5wcmVwYXJlQXhpb3MoYXdhaXQgdGhpcy5jcmVhdGVIdHRwKCkpO1xuICB9XG5cbiAgcHJlcGFyZUF4aW9zKGF4aW9zOiBBeGlvc0luc3RhbmNlKTogQXhpb3NJbnN0YW5jZSB7XG4gICAgYXhpb3MuaW50ZXJjZXB0b3JzLnJlcXVlc3QudXNlKChjb25maWcpID0+IHtcbiAgICAgIGNvbmZpZy5oZWFkZXJzWydYLUNTUkYtVG9rZW4nXSA9IGRhdGEoJ2NzcmYtdG9rZW4nKTtcblxuICAgICAgaWYgKGNvbmZpZy51cmwgJiYgY29uZmlnLnVybC5zdGFydHNXaXRoKCdAJykpIHtcbiAgICAgICAgY29uZmlnLnVybCA9IHJvdXRlKGNvbmZpZy51cmwpO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29uZmlnPy52YXJzICYmIGNvbmZpZy51cmwpIHtcbiAgICAgICAgY29uc3QgdG1wbCA9IHBhcnNlVGVtcGxhdGUoY29uZmlnLnVybCk7XG4gICAgICAgIGNvbmZpZy51cmwgPSB0bXBsLmV4cGFuZChjb25maWcudmFycyB8fCB7fSk7XG4gICAgICB9XG5cbiAgICAgIC8vIFNpbXVsYXRlIG1ldGhvZHNcbiAgICAgIGlmIChjb25maWcubWV0aG9kU2ltdWxhdGUpIHtcbiAgICAgICAgaWYgKGNvbmZpZy5tZXRob2RTaW11bGF0ZUJ5SGVhZGVyKSB7XG4gICAgICAgICAgY29uZmlnLmhlYWRlcnNbJ1gtSFRUUC1NZXRob2QtT3ZlcnJpZGUnXSA9IGNvbmZpZztcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgY29uZmlnLmRhdGEgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgY29uZmlnLmRhdGFbJ19tZXRob2QnXSA9IGNvbmZpZy5tZXRob2Q7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvbmZpZy5kYXRhID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIGlmIChjb25maWcuZGF0YS5pbmNsdWRlcygnPycpKSB7XG4gICAgICAgICAgICBjb25maWcuZGF0YSArPSAnJl9tZXRob2Q9JyArIGNvbmZpZy5tZXRob2Q7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbmZpZy5kYXRhICs9ICc/X21ldGhvZD0nICsgY29uZmlnLm1ldGhvZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnLm1ldGhvZC50b0xvd2VyQ2FzZSgpICE9PSAnZ2V0Jykge1xuICAgICAgICAgIGNvbmZpZy5tZXRob2QgPSAnUE9TVCc7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICB9KTtcblxuICAgIHJldHVybiBheGlvcztcbiAgfVxuXG4gIHJlcXVlc3RNaWRkbGV3YXJlKGNhbGxiYWNrOiBQYXJhbWV0ZXJzPEF4aW9zSW5zdGFuY2VbJ2ludGVyY2VwdG9ycyddWydyZXF1ZXN0J11bJ3VzZSddPlswXSkge1xuICAgIHJldHVybiB0aGlzLmdldEF4aW9zSW5zdGFuY2UoKS50aGVuKGF4aW9zID0+IGF4aW9zLmludGVyY2VwdG9ycy5yZXF1ZXN0LnVzZShjYWxsYmFjaykpO1xuICB9XG5cbiAgcmVzcG9uc2VNaWRkbGV3YXJlKGNhbGxiYWNrOiBQYXJhbWV0ZXJzPEF4aW9zSW5zdGFuY2VbJ2ludGVyY2VwdG9ycyddWydyZXNwb25zZSddWyd1c2UnXT5bMF0pIHtcbiAgICByZXR1cm4gdGhpcy5nZXRBeGlvc0luc3RhbmNlKCkudGhlbihheGlvcyA9PiBheGlvcy5pbnRlcmNlcHRvcnMucmVzcG9uc2UudXNlKGNhbGxiYWNrKSk7XG4gIH1cblxuICAvLyByZWFkeSgpIHtcbiAgLy8gICBzdXBlci5yZWFkeSgpO1xuICAvLyB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSBHRVQgcmVxdWVzdC5cbiAgICovXG4gIGdldDxUID0gYW55LCBEID0gYW55Pih1cmw6IHN0cmluZywgb3B0aW9uczogUGFydGlhbDxBeGlvc1JlcXVlc3RDb25maWc+ID0ge30pOiBQcm9taXNlPEF4aW9zUmVzcG9uc2U8VCwgRD4+IHtcbiAgICBvcHRpb25zLnVybCA9IHVybDtcbiAgICBvcHRpb25zLm1ldGhvZCA9ICdHRVQnO1xuXG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIGEgUE9TVCByZXF1ZXN0LlxuICAgKi9cbiAgcG9zdDxUID0gYW55LCBEID0gYW55PihcbiAgICB1cmw6IHN0cmluZyxcbiAgICBkYXRhPzogYW55LFxuICAgIG9wdGlvbnM6IFBhcnRpYWw8QXhpb3NSZXF1ZXN0Q29uZmlnPiA9IHt9XG4gICk6IFByb21pc2U8QXhpb3NSZXNwb25zZTxULCBEPj4ge1xuICAgIG9wdGlvbnMudXJsID0gdXJsO1xuICAgIG9wdGlvbnMubWV0aG9kID0gJ1BPU1QnO1xuICAgIG9wdGlvbnMuZGF0YSA9IGRhdGE7XG5cbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSBQVVQgcmVxdWVzdC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVybFxuICAgKiBAcGFyYW0ge2FueX0gZGF0YVxuICAgKiBAcGFyYW0ge0F4aW9zUmVxdWVzdENvbmZpZ30gb3B0aW9uc1xuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxBeGlvc1Jlc3BvbnNlPn1cbiAgICovXG4gIHB1dDxUID0gYW55LCBEID0gYW55PihcbiAgICB1cmw6IHN0cmluZyxcbiAgICBkYXRhPzogYW55LFxuICAgIG9wdGlvbnM6IFBhcnRpYWw8QXhpb3NSZXF1ZXN0Q29uZmlnPiA9IHt9XG4gICk6IFByb21pc2U8QXhpb3NSZXNwb25zZTxULCBEPj4ge1xuICAgIG9wdGlvbnMudXJsID0gdXJsO1xuICAgIG9wdGlvbnMubWV0aG9kID0gJ1BVVCc7XG4gICAgb3B0aW9ucy5kYXRhID0gZGF0YTtcblxuICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZCBhIFBBVENIIHJlcXVlc3QuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cmxcbiAgICogQHBhcmFtIHthbnl9IGRhdGFcbiAgICogQHBhcmFtIHtBeGlvc1JlcXVlc3RDb25maWd9IG9wdGlvbnNcbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2U8QXhpb3NSZXNwb25zZT59XG4gICAqL1xuICBwYXRjaDxUID0gYW55LCBEID0gYW55PihcbiAgICB1cmw6IHN0cmluZyxcbiAgICBkYXRhPzogYW55LFxuICAgIG9wdGlvbnM6IFBhcnRpYWw8QXhpb3NSZXF1ZXN0Q29uZmlnPiA9IHt9XG4gICk6IFByb21pc2U8QXhpb3NSZXNwb25zZTxULCBEPj4ge1xuICAgIG9wdGlvbnMudXJsID0gdXJsO1xuICAgIG9wdGlvbnMubWV0aG9kID0gJ1BBVENIJztcbiAgICBvcHRpb25zLmRhdGEgPSBkYXRhO1xuXG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIGEgREVMRVRFIHJlcXVlc3QuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cmxcbiAgICogQHBhcmFtIHthbnl9IGRhdGFcbiAgICogQHBhcmFtIHtBeGlvc1JlcXVlc3RDb25maWd9IG9wdGlvbnNcbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2U8QXhpb3NSZXNwb25zZT59XG4gICAqL1xuICBkZWxldGU8VCA9IGFueSwgRCA9IGFueT4oXG4gICAgdXJsOiBzdHJpbmcsXG4gICAgZGF0YT86IGFueSxcbiAgICBvcHRpb25zOiBQYXJ0aWFsPEF4aW9zUmVxdWVzdENvbmZpZz4gPSB7fVxuICApOiBQcm9taXNlPEF4aW9zUmVzcG9uc2U8VCwgRD4+IHtcbiAgICBvcHRpb25zLnVybCA9IHVybDtcbiAgICBvcHRpb25zLm1ldGhvZCA9ICdERUxFVEUnO1xuICAgIG9wdGlvbnMuZGF0YSA9IGRhdGE7XG5cbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSBIRUFEIHJlcXVlc3QuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cmxcbiAgICogQHBhcmFtIHtBeGlvc1JlcXVlc3RDb25maWd9IG9wdGlvbnNcbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2U8QXhpb3NSZXNwb25zZT59XG4gICAqL1xuICBoZWFkPFQgPSBhbnksIEQgPSBhbnk+KHVybDogc3RyaW5nLCBvcHRpb25zOiBQYXJ0aWFsPEF4aW9zUmVxdWVzdENvbmZpZz4gPSB7fSk6IFByb21pc2U8QXhpb3NSZXNwb25zZTxULCBEPj4ge1xuICAgIG9wdGlvbnMudXJsID0gdXJsO1xuICAgIG9wdGlvbnMubWV0aG9kID0gJ0hFQUQnO1xuXG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIGEgT1BUSU9OUyByZXF1ZXN0LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsXG4gICAqIEBwYXJhbSB7QXhpb3NSZXF1ZXN0Q29uZmlnfSBvcHRpb25zXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPEF4aW9zUmVzcG9uc2U+fVxuICAgKi9cbiAgb3B0aW9uczxUID0gYW55LCBEID0gYW55Pih1cmw6IHN0cmluZywgb3B0aW9uczogUGFydGlhbDxBeGlvc1JlcXVlc3RDb25maWc+ID0ge30pOiBQcm9taXNlPEF4aW9zUmVzcG9uc2U8VCwgRD4+IHtcbiAgICBvcHRpb25zLnVybCA9IHVybDtcbiAgICBvcHRpb25zLm1ldGhvZCA9ICdPUFRJT05TJztcblxuICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gIH1cblxuICBpc0NhbmNlbChjYW5jZWw6IGFueSkge1xuICAgIHJldHVybiBheGlvcy5pc0NhbmNlbChjYW5jZWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgcmVxdWVzdC5cbiAgICovXG4gIGFzeW5jIHJlcXVlc3Q8VCA9IGFueSwgRCA9IGFueT4ob3B0aW9uczogQXhpb3NSZXF1ZXN0Q29uZmlnKTogUHJvbWlzZTxBeGlvc1Jlc3BvbnNlPFQsIEQ+PiB7XG4gICAgdHJ5IHtcbiAgICAgIGxldCBheGlvc0luc3RhbmNlID0gYXdhaXQgdGhpcy5nZXRBeGlvc0luc3RhbmNlKCk7XG4gICAgICByZXR1cm4gYXdhaXQgYXhpb3NJbnN0YW5jZShvcHRpb25zKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAoZSBhcyBhbnkpLm9yaWdpbk1lc3NhZ2UgPSAoZSBhcyBFcnJvcikubWVzc2FnZTtcblxuICAgICAgY29uc3QgZXJyID0gZSBhcyBBeGlvc0Vycm9yPGFueT47XG5cbiAgICAgIGlmIChlcnIucmVzcG9uc2U/LmRhdGE/Lm1lc3NhZ2UpIHtcbiAgICAgICAgZXJyLm1lc3NhZ2UgPSBlcnIucmVzcG9uc2UuZGF0YS5tZXNzYWdlO1xuICAgICAgfVxuXG4gICAgICB0aHJvdyBlcnI7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZXJyb3JDbGFzcygpIHtcbiAgICBjb25zdCBheGlvcyA9IGF3YWl0IFVuaWNvcm5IdHRwQ2xpZW50LmdldEF4aW9zU3RhdGljKCk7XG5cbiAgICByZXR1cm4gYXhpb3MuQXhpb3NFcnJvcjtcbiAgfVxufVxuIl0sIm5hbWVzIjpbInZhbHVlIiwiYXhpb3MiLCJkYXRhIl0sIm1hcHBpbmdzIjoiO0FBQUEsU0FBUyxlQUFlLEtBQUs7QUFDM0IsU0FBTyxJQUFJLE1BQU0sb0JBQW9CLEVBQUUsSUFBSSxTQUFVLE1BQU07QUFDekQsUUFBSSxDQUFDLGVBQWUsS0FBSyxJQUFJLEdBQUc7QUFDOUIsYUFBTyxVQUFVLElBQUksRUFBRSxRQUFRLFFBQVEsR0FBRyxFQUFFLFFBQVEsUUFBUSxHQUFHO0FBQUEsSUFDakU7QUFDQSxXQUFPO0FBQUEsRUFDVCxDQUFDLEVBQUUsS0FBSyxFQUFFO0FBQ1o7QUFFQSxTQUFTLGlCQUFpQixLQUFLO0FBQzdCLFNBQU8sbUJBQW1CLEdBQUcsRUFBRSxRQUFRLFlBQVksU0FBVSxHQUFHO0FBQzlELFdBQU8sTUFBTSxFQUFFLFdBQVcsQ0FBQyxFQUFFLFNBQVMsRUFBRSxFQUFFLFlBQVc7QUFBQSxFQUN2RCxDQUFDO0FBQ0g7QUFFQSxTQUFTLFlBQVksVUFBVSxPQUFPLEtBQUs7QUFDekMsVUFBUyxhQUFhLE9BQU8sYUFBYSxNQUFPLGVBQWUsS0FBSyxJQUFJLGlCQUFpQixLQUFLO0FBRS9GLE1BQUksS0FBSztBQUNQLFdBQU8saUJBQWlCLEdBQUcsSUFBSSxNQUFNO0FBQUEsRUFDdkMsT0FBTztBQUNMLFdBQU87QUFBQSxFQUNUO0FBQ0Y7QUFFQSxTQUFTLFVBQVUsT0FBTztBQUN4QixTQUFPLFVBQVUsVUFBYSxVQUFVO0FBQzFDO0FBRUEsU0FBUyxjQUFjLFVBQVU7QUFDL0IsU0FBTyxhQUFhLE9BQU8sYUFBYSxPQUFPLGFBQWE7QUFDOUQ7QUFFQSxTQUFTLFVBQVUsU0FBUyxVQUFVLEtBQUssVUFBVTtBQUNuRCxNQUFJLFFBQVEsUUFBUSxHQUFHLEdBQ25CLFNBQVMsQ0FBQTtBQUViLE1BQUksVUFBVSxLQUFLLEtBQUssVUFBVSxJQUFJO0FBQ3BDLFFBQUksT0FBTyxVQUFVLFlBQVksT0FBTyxVQUFVLFlBQVksT0FBTyxVQUFVLFdBQVc7QUFDeEYsY0FBUSxNQUFNLFNBQVE7QUFFdEIsVUFBSSxZQUFZLGFBQWEsS0FBSztBQUNoQyxnQkFBUSxNQUFNLFVBQVUsR0FBRyxTQUFTLFVBQVUsRUFBRSxDQUFDO0FBQUEsTUFDbkQ7QUFFQSxhQUFPLEtBQUssWUFBWSxVQUFVLE9BQU8sY0FBYyxRQUFRLElBQUksTUFBTSxJQUFJLENBQUM7QUFBQSxJQUNoRixPQUFPO0FBQ0wsVUFBSSxhQUFhLEtBQUs7QUFDcEIsWUFBSSxNQUFNLFFBQVEsS0FBSyxHQUFHO0FBQ3hCLGdCQUFNLE9BQU8sU0FBUyxFQUFFLFFBQVEsU0FBVUEsUUFBTztBQUMvQyxtQkFBTyxLQUFLLFlBQVksVUFBVUEsUUFBTyxjQUFjLFFBQVEsSUFBSSxNQUFNLElBQUksQ0FBQztBQUFBLFVBQ2hGLENBQUM7QUFBQSxRQUNILE9BQU87QUFDTCxpQkFBTyxLQUFLLEtBQUssRUFBRSxRQUFRLFNBQVUsR0FBRztBQUN0QyxnQkFBSSxVQUFVLE1BQU0sQ0FBQyxDQUFDLEdBQUc7QUFDdkIscUJBQU8sS0FBSyxZQUFZLFVBQVUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQUEsWUFDaEQ7QUFBQSxVQUNGLENBQUM7QUFBQSxRQUNIO0FBQUEsTUFDRixPQUFPO0FBQ0wsWUFBSSxNQUFNLENBQUE7QUFFVixZQUFJLE1BQU0sUUFBUSxLQUFLLEdBQUc7QUFDeEIsZ0JBQU0sT0FBTyxTQUFTLEVBQUUsUUFBUSxTQUFVQSxRQUFPO0FBQy9DLGdCQUFJLEtBQUssWUFBWSxVQUFVQSxNQUFLLENBQUM7QUFBQSxVQUN2QyxDQUFDO0FBQUEsUUFDSCxPQUFPO0FBQ0wsaUJBQU8sS0FBSyxLQUFLLEVBQUUsUUFBUSxTQUFVLEdBQUc7QUFDdEMsZ0JBQUksVUFBVSxNQUFNLENBQUMsQ0FBQyxHQUFHO0FBQ3ZCLGtCQUFJLEtBQUssaUJBQWlCLENBQUMsQ0FBQztBQUM1QixrQkFBSSxLQUFLLFlBQVksVUFBVSxNQUFNLENBQUMsRUFBRSxTQUFRLENBQUUsQ0FBQztBQUFBLFlBQ3JEO0FBQUEsVUFDRixDQUFDO0FBQUEsUUFDSDtBQUVBLFlBQUksY0FBYyxRQUFRLEdBQUc7QUFDM0IsaUJBQU8sS0FBSyxpQkFBaUIsR0FBRyxJQUFJLE1BQU0sSUFBSSxLQUFLLEdBQUcsQ0FBQztBQUFBLFFBQ3pELFdBQVcsSUFBSSxXQUFXLEdBQUc7QUFDM0IsaUJBQU8sS0FBSyxJQUFJLEtBQUssR0FBRyxDQUFDO0FBQUEsUUFDM0I7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0YsT0FBTztBQUNMLFFBQUksYUFBYSxLQUFLO0FBQ3BCLFVBQUksVUFBVSxLQUFLLEdBQUc7QUFDcEIsZUFBTyxLQUFLLGlCQUFpQixHQUFHLENBQUM7QUFBQSxNQUNuQztBQUFBLElBQ0YsV0FBVyxVQUFVLE9BQU8sYUFBYSxPQUFPLGFBQWEsTUFBTTtBQUNqRSxhQUFPLEtBQUssaUJBQWlCLEdBQUcsSUFBSSxHQUFHO0FBQUEsSUFDekMsV0FBVyxVQUFVLElBQUk7QUFDdkIsYUFBTyxLQUFLLEVBQUU7QUFBQSxJQUNoQjtBQUFBLEVBQ0Y7QUFDQSxTQUFPO0FBQ1Q7QUFFTyxTQUFTLGNBQWMsVUFBVTtBQUN0QyxNQUFJLFlBQVksQ0FBQyxLQUFLLEtBQUssS0FBSyxLQUFLLEtBQUssS0FBSyxHQUFHO0FBRWxELFNBQU87QUFBQSxJQUNMLFFBQVEsU0FBVSxTQUFTO0FBQ3pCLGFBQU8sU0FBUyxRQUFRLDhCQUE4QixTQUFVLEdBQUcsWUFBWSxTQUFTO0FBQ3RGLFlBQUksWUFBWTtBQUNkLGNBQUksV0FBVyxNQUNYLFNBQVMsQ0FBQTtBQUViLGNBQUksVUFBVSxRQUFRLFdBQVcsT0FBTyxDQUFDLENBQUMsTUFBTSxJQUFJO0FBQ2xELHVCQUFXLFdBQVcsT0FBTyxDQUFDO0FBQzlCLHlCQUFhLFdBQVcsT0FBTyxDQUFDO0FBQUEsVUFDbEM7QUFFQSxxQkFBVyxNQUFNLElBQUksRUFBRSxRQUFRLFNBQVUsVUFBVTtBQUNqRCxnQkFBSSxNQUFNLDRCQUE0QixLQUFLLFFBQVE7QUFDbkQsbUJBQU8sS0FBSyxNQUFNLFFBQVEsVUFBVSxTQUFTLFVBQVUsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztBQUFBLFVBQ2xGLENBQUM7QUFFRCxjQUFJLFlBQVksYUFBYSxLQUFLO0FBQ2hDLGdCQUFJLFlBQVk7QUFFaEIsZ0JBQUksYUFBYSxLQUFLO0FBQ3BCLDBCQUFZO0FBQUEsWUFDZCxXQUFXLGFBQWEsS0FBSztBQUMzQiwwQkFBWTtBQUFBLFlBQ2Q7QUFDQSxvQkFBUSxPQUFPLFdBQVcsSUFBSSxXQUFXLE1BQU0sT0FBTyxLQUFLLFNBQVM7QUFBQSxVQUN0RSxPQUFPO0FBQ0wsbUJBQU8sT0FBTyxLQUFLLEdBQUc7QUFBQSxVQUN4QjtBQUFBLFFBQ0YsT0FBTztBQUNMLGlCQUFPLGVBQWUsT0FBTztBQUFBLFFBQy9CO0FBQUEsTUFDRixDQUFDO0FBQUEsSUFDSDtBQUFBLEVBQ0o7QUFDQTtBQzNHTyxNQUFNLGtCQUFrQjtBQUFBLEVBSTdCLFlBQXNCLFFBQThCO0FBQTlCLFNBQUEsU0FBQTtBQUFBLEVBQ3RCO0FBQUEsRUFKQSxPQUFPO0FBQUEsRUFDUDtBQUFBLEVBS0EsYUFBYSxjQUE0QjtBQUN2QyxVQUFNLEVBQUUsU0FBU0MsV0FBVSxNQUFNLE9BQU8sT0FBTztBQUUvQyxXQUFPQTtBQUFBQSxFQUNUO0FBQUEsRUFFQSxhQUFhLGlCQUF1QztBQUNsRCxRQUFJLENBQUMsS0FBSyxhQUFhO0FBQ3JCLFdBQUssY0FBYyxLQUFLLFlBQUE7QUFBQSxJQUMxQjtBQUVBLFdBQU8sS0FBSztBQUFBLEVBQ2Q7QUFBQSxFQUVBLE1BQU0sYUFBYTtBQUNqQixVQUFNLGNBQWMsTUFBTSxrQkFBa0IsZUFBQTtBQUU1QyxXQUFPLEtBQUssUUFBUSxZQUFZLE9BQU8sS0FBSyxVQUFVLEVBQUU7QUFBQSxFQUMxRDtBQUFBLEVBRUEsTUFBTSxtQkFBbUI7QUFDdkIsUUFBSSxLQUFLLE9BQU87QUFDZCxhQUFPLEtBQUs7QUFBQSxJQUNkO0FBRUEsV0FBTyxLQUFLLFFBQVEsS0FBSyxhQUFhLE1BQU0sS0FBSyxZQUFZO0FBQUEsRUFDL0Q7QUFBQSxFQUVBLGFBQWFBLFFBQXFDO0FBQ2hEQSxXQUFNLGFBQWEsUUFBUSxJQUFJLENBQUMsV0FBVztBQUN6QyxhQUFPLFFBQVEsY0FBYyxJQUFJLEtBQUssWUFBWTtBQUVsRCxVQUFJLE9BQU8sT0FBTyxPQUFPLElBQUksV0FBVyxHQUFHLEdBQUc7QUFDNUMsZUFBTyxNQUFNLE1BQU0sT0FBTyxHQUFHO0FBQUEsTUFDL0I7QUFFQSxVQUFJLFFBQVEsUUFBUSxPQUFPLEtBQUs7QUFDOUIsY0FBTSxPQUFPLGNBQWMsT0FBTyxHQUFHO0FBQ3JDLGVBQU8sTUFBTSxLQUFLLE9BQU8sT0FBTyxRQUFRLEVBQUU7QUFBQSxNQUM1QztBQUdBLFVBQUksT0FBTyxnQkFBZ0I7QUFDekIsWUFBSSxPQUFPLHdCQUF3QjtBQUNqQyxpQkFBTyxRQUFRLHdCQUF3QixJQUFJO0FBQUEsUUFDN0MsV0FBVyxPQUFPLE9BQU8sU0FBUyxVQUFVO0FBQzFDLGlCQUFPLEtBQUssU0FBUyxJQUFJLE9BQU87QUFBQSxRQUNsQyxXQUFXLE9BQU8sT0FBTyxTQUFTLFVBQVU7QUFDMUMsY0FBSSxPQUFPLEtBQUssU0FBUyxHQUFHLEdBQUc7QUFDN0IsbUJBQU8sUUFBUSxjQUFjLE9BQU87QUFBQSxVQUN0QyxPQUFPO0FBQ0wsbUJBQU8sUUFBUSxjQUFjLE9BQU87QUFBQSxVQUN0QztBQUFBLFFBQ0Y7QUFFQSxZQUFJLE9BQU8sT0FBTyxZQUFBLE1BQWtCLE9BQU87QUFDekMsaUJBQU8sU0FBUztBQUFBLFFBQ2xCO0FBQUEsTUFDRjtBQUVBLGFBQU87QUFBQSxJQUNULENBQUM7QUFFRCxXQUFPQTtBQUFBQSxFQUNUO0FBQUEsRUFFQSxrQkFBa0IsVUFBMEU7QUFDMUYsV0FBTyxLQUFLLG1CQUFtQixLQUFLLENBQUFBLFdBQVNBLE9BQU0sYUFBYSxRQUFRLElBQUksUUFBUSxDQUFDO0FBQUEsRUFDdkY7QUFBQSxFQUVBLG1CQUFtQixVQUEyRTtBQUM1RixXQUFPLEtBQUssbUJBQW1CLEtBQUssQ0FBQUEsV0FBU0EsT0FBTSxhQUFhLFNBQVMsSUFBSSxRQUFRLENBQUM7QUFBQSxFQUN4RjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBU0EsSUFBc0IsS0FBYSxVQUF1QyxJQUFrQztBQUMxRyxZQUFRLE1BQU07QUFDZCxZQUFRLFNBQVM7QUFFakIsV0FBTyxLQUFLLFFBQVEsT0FBTztBQUFBLEVBQzdCO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFLQSxLQUNFLEtBQ0FDLE9BQ0EsVUFBdUMsQ0FBQSxHQUNUO0FBQzlCLFlBQVEsTUFBTTtBQUNkLFlBQVEsU0FBUztBQUNqQixZQUFRLE9BQU9BO0FBRWYsV0FBTyxLQUFLLFFBQVEsT0FBTztBQUFBLEVBQzdCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFXQSxJQUNFLEtBQ0FBLE9BQ0EsVUFBdUMsQ0FBQSxHQUNUO0FBQzlCLFlBQVEsTUFBTTtBQUNkLFlBQVEsU0FBUztBQUNqQixZQUFRLE9BQU9BO0FBRWYsV0FBTyxLQUFLLFFBQVEsT0FBTztBQUFBLEVBQzdCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFXQSxNQUNFLEtBQ0FBLE9BQ0EsVUFBdUMsQ0FBQSxHQUNUO0FBQzlCLFlBQVEsTUFBTTtBQUNkLFlBQVEsU0FBUztBQUNqQixZQUFRLE9BQU9BO0FBRWYsV0FBTyxLQUFLLFFBQVEsT0FBTztBQUFBLEVBQzdCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFXQSxPQUNFLEtBQ0FBLE9BQ0EsVUFBdUMsQ0FBQSxHQUNUO0FBQzlCLFlBQVEsTUFBTTtBQUNkLFlBQVEsU0FBUztBQUNqQixZQUFRLE9BQU9BO0FBRWYsV0FBTyxLQUFLLFFBQVEsT0FBTztBQUFBLEVBQzdCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBVUEsS0FBdUIsS0FBYSxVQUF1QyxJQUFrQztBQUMzRyxZQUFRLE1BQU07QUFDZCxZQUFRLFNBQVM7QUFFakIsV0FBTyxLQUFLLFFBQVEsT0FBTztBQUFBLEVBQzdCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBVUEsUUFBMEIsS0FBYSxVQUF1QyxJQUFrQztBQUM5RyxZQUFRLE1BQU07QUFDZCxZQUFRLFNBQVM7QUFFakIsV0FBTyxLQUFLLFFBQVEsT0FBTztBQUFBLEVBQzdCO0FBQUEsRUFFQSxTQUFTLFFBQWE7QUFDcEIsV0FBTyxNQUFNLFNBQVMsTUFBTTtBQUFBLEVBQzlCO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFLQSxNQUFNLFFBQTBCLFNBQTJEO0FBQ3pGLFFBQUk7QUFDRixVQUFJLGdCQUFnQixNQUFNLEtBQUssaUJBQUE7QUFDL0IsYUFBTyxNQUFNLGNBQWMsT0FBTztBQUFBLElBQ3BDLFNBQVMsR0FBRztBQUNULFFBQVUsZ0JBQWlCLEVBQVk7QUFFeEMsWUFBTSxNQUFNO0FBRVosVUFBSSxJQUFJLFVBQVUsTUFBTSxTQUFTO0FBQy9CLFlBQUksVUFBVSxJQUFJLFNBQVMsS0FBSztBQUFBLE1BQ2xDO0FBRUEsWUFBTTtBQUFBLElBQ1I7QUFBQSxFQUNGO0FBQUEsRUFFQSxNQUFNLGFBQWE7QUFDakIsVUFBTUQsU0FBUSxNQUFNLGtCQUFrQixlQUFBO0FBRXRDLFdBQU9BLE9BQU07QUFBQSxFQUNmO0FBQ0Y7IiwieF9nb29nbGVfaWdub3JlTGlzdCI6WzBdfQ==
