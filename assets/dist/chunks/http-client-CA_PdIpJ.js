import { l as data, z as route } from "./unicorn-DR9JpPYO.js";
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
        if (config.method?.toLowerCase() !== "get") {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC1jbGllbnQtQ0FfUGRJcEouanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy91cmwtdGVtcGxhdGUvbGliL3VybC10ZW1wbGF0ZS5qcyIsIi4uLy4uL3NyYy9tb2R1bGUvaHR0cC1jbGllbnQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gZW5jb2RlUmVzZXJ2ZWQoc3RyKSB7XG4gIHJldHVybiBzdHIuc3BsaXQoLyglWzAtOUEtRmEtZl17Mn0pL2cpLm1hcChmdW5jdGlvbiAocGFydCkge1xuICAgIGlmICghLyVbMC05QS1GYS1mXS8udGVzdChwYXJ0KSkge1xuICAgICAgcGFydCA9IGVuY29kZVVSSShwYXJ0KS5yZXBsYWNlKC8lNUIvZywgJ1snKS5yZXBsYWNlKC8lNUQvZywgJ10nKTtcbiAgICB9XG4gICAgcmV0dXJuIHBhcnQ7XG4gIH0pLmpvaW4oJycpO1xufVxuXG5mdW5jdGlvbiBlbmNvZGVVbnJlc2VydmVkKHN0cikge1xuICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHN0cikucmVwbGFjZSgvWyEnKCkqXS9nLCBmdW5jdGlvbiAoYykge1xuICAgIHJldHVybiAnJScgKyBjLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBlbmNvZGVWYWx1ZShvcGVyYXRvciwgdmFsdWUsIGtleSkge1xuICB2YWx1ZSA9IChvcGVyYXRvciA9PT0gJysnIHx8IG9wZXJhdG9yID09PSAnIycpID8gZW5jb2RlUmVzZXJ2ZWQodmFsdWUpIDogZW5jb2RlVW5yZXNlcnZlZCh2YWx1ZSk7XG5cbiAgaWYgKGtleSkge1xuICAgIHJldHVybiBlbmNvZGVVbnJlc2VydmVkKGtleSkgKyAnPScgKyB2YWx1ZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNEZWZpbmVkKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc0tleU9wZXJhdG9yKG9wZXJhdG9yKSB7XG4gIHJldHVybiBvcGVyYXRvciA9PT0gJzsnIHx8IG9wZXJhdG9yID09PSAnJicgfHwgb3BlcmF0b3IgPT09ICc/Jztcbn1cblxuZnVuY3Rpb24gZ2V0VmFsdWVzKGNvbnRleHQsIG9wZXJhdG9yLCBrZXksIG1vZGlmaWVyKSB7XG4gIHZhciB2YWx1ZSA9IGNvbnRleHRba2V5XSxcbiAgICAgIHJlc3VsdCA9IFtdO1xuXG4gIGlmIChpc0RlZmluZWQodmFsdWUpICYmIHZhbHVlICE9PSAnJykge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgfHwgdHlwZW9mIHZhbHVlID09PSAnYm9vbGVhbicpIHtcbiAgICAgIHZhbHVlID0gdmFsdWUudG9TdHJpbmcoKTtcblxuICAgICAgaWYgKG1vZGlmaWVyICYmIG1vZGlmaWVyICE9PSAnKicpIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5zdWJzdHJpbmcoMCwgcGFyc2VJbnQobW9kaWZpZXIsIDEwKSk7XG4gICAgICB9XG5cbiAgICAgIHJlc3VsdC5wdXNoKGVuY29kZVZhbHVlKG9wZXJhdG9yLCB2YWx1ZSwgaXNLZXlPcGVyYXRvcihvcGVyYXRvcikgPyBrZXkgOiBudWxsKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChtb2RpZmllciA9PT0gJyonKSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgIHZhbHVlLmZpbHRlcihpc0RlZmluZWQpLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaChlbmNvZGVWYWx1ZShvcGVyYXRvciwgdmFsdWUsIGlzS2V5T3BlcmF0b3Iob3BlcmF0b3IpID8ga2V5IDogbnVsbCkpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIE9iamVjdC5rZXlzKHZhbHVlKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG4gICAgICAgICAgICBpZiAoaXNEZWZpbmVkKHZhbHVlW2tdKSkge1xuICAgICAgICAgICAgICByZXN1bHQucHVzaChlbmNvZGVWYWx1ZShvcGVyYXRvciwgdmFsdWVba10sIGspKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHRtcCA9IFtdO1xuXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgIHZhbHVlLmZpbHRlcihpc0RlZmluZWQpLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICB0bXAucHVzaChlbmNvZGVWYWx1ZShvcGVyYXRvciwgdmFsdWUpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBPYmplY3Qua2V5cyh2YWx1ZSkuZm9yRWFjaChmdW5jdGlvbiAoaykge1xuICAgICAgICAgICAgaWYgKGlzRGVmaW5lZCh2YWx1ZVtrXSkpIHtcbiAgICAgICAgICAgICAgdG1wLnB1c2goZW5jb2RlVW5yZXNlcnZlZChrKSk7XG4gICAgICAgICAgICAgIHRtcC5wdXNoKGVuY29kZVZhbHVlKG9wZXJhdG9yLCB2YWx1ZVtrXS50b1N0cmluZygpKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNLZXlPcGVyYXRvcihvcGVyYXRvcikpIHtcbiAgICAgICAgICByZXN1bHQucHVzaChlbmNvZGVVbnJlc2VydmVkKGtleSkgKyAnPScgKyB0bXAuam9pbignLCcpKTtcbiAgICAgICAgfSBlbHNlIGlmICh0bXAubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2godG1wLmpvaW4oJywnKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKG9wZXJhdG9yID09PSAnOycpIHtcbiAgICAgIGlmIChpc0RlZmluZWQodmFsdWUpKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKGVuY29kZVVucmVzZXJ2ZWQoa2V5KSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJycgJiYgKG9wZXJhdG9yID09PSAnJicgfHwgb3BlcmF0b3IgPT09ICc/JykpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGVuY29kZVVucmVzZXJ2ZWQoa2V5KSArICc9Jyk7XG4gICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJycpIHtcbiAgICAgIHJlc3VsdC5wdXNoKCcnKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlVGVtcGxhdGUodGVtcGxhdGUpIHtcbiAgdmFyIG9wZXJhdG9ycyA9IFsnKycsICcjJywgJy4nLCAnLycsICc7JywgJz8nLCAnJiddO1xuXG4gIHJldHVybiB7XG4gICAgZXhwYW5kOiBmdW5jdGlvbiAoY29udGV4dCkge1xuICAgICAgcmV0dXJuIHRlbXBsYXRlLnJlcGxhY2UoL1xceyhbXlxce1xcfV0rKVxcfXwoW15cXHtcXH1dKykvZywgZnVuY3Rpb24gKF8sIGV4cHJlc3Npb24sIGxpdGVyYWwpIHtcbiAgICAgICAgaWYgKGV4cHJlc3Npb24pIHtcbiAgICAgICAgICB2YXIgb3BlcmF0b3IgPSBudWxsLFxuICAgICAgICAgICAgICB2YWx1ZXMgPSBbXTtcblxuICAgICAgICAgIGlmIChvcGVyYXRvcnMuaW5kZXhPZihleHByZXNzaW9uLmNoYXJBdCgwKSkgIT09IC0xKSB7XG4gICAgICAgICAgICBvcGVyYXRvciA9IGV4cHJlc3Npb24uY2hhckF0KDApO1xuICAgICAgICAgICAgZXhwcmVzc2lvbiA9IGV4cHJlc3Npb24uc3Vic3RyKDEpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGV4cHJlc3Npb24uc3BsaXQoLywvZykuZm9yRWFjaChmdW5jdGlvbiAodmFyaWFibGUpIHtcbiAgICAgICAgICAgIHZhciB0bXAgPSAvKFteOlxcKl0qKSg/OjooXFxkKyl8KFxcKikpPy8uZXhlYyh2YXJpYWJsZSk7XG4gICAgICAgICAgICB2YWx1ZXMucHVzaC5hcHBseSh2YWx1ZXMsIGdldFZhbHVlcyhjb250ZXh0LCBvcGVyYXRvciwgdG1wWzFdLCB0bXBbMl0gfHwgdG1wWzNdKSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBpZiAob3BlcmF0b3IgJiYgb3BlcmF0b3IgIT09ICcrJykge1xuICAgICAgICAgICAgdmFyIHNlcGFyYXRvciA9ICcsJztcblxuICAgICAgICAgICAgaWYgKG9wZXJhdG9yID09PSAnPycpIHtcbiAgICAgICAgICAgICAgc2VwYXJhdG9yID0gJyYnO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvcGVyYXRvciAhPT0gJyMnKSB7XG4gICAgICAgICAgICAgIHNlcGFyYXRvciA9IG9wZXJhdG9yO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuICh2YWx1ZXMubGVuZ3RoICE9PSAwID8gb3BlcmF0b3IgOiAnJykgKyB2YWx1ZXMuam9pbihzZXBhcmF0b3IpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWVzLmpvaW4oJywnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGVuY29kZVJlc2VydmVkKGxpdGVyYWwpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59XG4iLCJpbXBvcnQgdHlwZSB7XG4gIEF4aW9zRXJyb3IsXG4gIEF4aW9zSW5zdGFuY2UsXG4gIEF4aW9zUmVxdWVzdENvbmZpZyxcbiAgQXhpb3NSZXNwb25zZSxcbiAgQXhpb3NTdGF0aWMsXG4gIENyZWF0ZUF4aW9zRGVmYXVsdHNcbn0gZnJvbSAnYXhpb3MnO1xuaW1wb3J0IHsgcGFyc2VUZW1wbGF0ZSB9IGZyb20gJ3VybC10ZW1wbGF0ZSc7XG5pbXBvcnQgeyBkYXRhIH0gZnJvbSAnLi4vZGF0YSc7XG5pbXBvcnQgeyByb3V0ZSB9IGZyb20gJy4uL3NlcnZpY2UnO1xuXG5kZWNsYXJlIGdsb2JhbCB7XG4gIGxldCBheGlvczogQXhpb3NTdGF0aWM7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXBpUmV0dXJuPFQgPSBhbnk+IHtcbiAgc3VjY2VzczogYm9vbGVhbjtcbiAgbWVzc2FnZT86IHN0cmluZztcbiAgY29kZTogbnVtYmVyO1xuICBzdGF0dXM6IG51bWJlcjtcbiAgZGF0YTogVDtcbn1cblxuZGVjbGFyZSBtb2R1bGUgJ2F4aW9zJyB7XG4gIGV4cG9ydCBpbnRlcmZhY2UgQXhpb3NSZXF1ZXN0Q29uZmlnIHtcbiAgICB2YXJzPzogUmVjb3JkPHN0cmluZywgYW55PjtcbiAgICBtZXRob2RTaW11bGF0ZT86IHN0cmluZztcbiAgICBtZXRob2RTaW11bGF0ZUJ5SGVhZGVyPzogYm9vbGVhbjtcbiAgfVxuXG4gIGV4cG9ydCBpbnRlcmZhY2UgQ3JlYXRlQXhpb3NEZWZhdWx0cyB7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFVuaWNvcm5IdHRwQ2xpZW50IHtcbiAgc3RhdGljIGF4aW9zU3RhdGljPzogUHJvbWlzZTxBeGlvc1N0YXRpYz47XG4gIGF4aW9zPzogQXhpb3NJbnN0YW5jZTtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgY29uZmlnPzogQ3JlYXRlQXhpb3NEZWZhdWx0cykge1xuICB9XG5cbiAgc3RhdGljIGFzeW5jIGltcG9ydEF4aW9zKCk6IFByb21pc2U8YW55PiB7XG4gICAgY29uc3QgeyBkZWZhdWx0OiBheGlvcyB9ID0gYXdhaXQgaW1wb3J0KCdheGlvcycpO1xuXG4gICAgcmV0dXJuIGF4aW9zO1xuICB9XG5cbiAgc3RhdGljIGFzeW5jIGdldEF4aW9zU3RhdGljKCk6IFByb21pc2U8QXhpb3NTdGF0aWM+IHtcbiAgICBpZiAoIXRoaXMuYXhpb3NTdGF0aWMpIHtcbiAgICAgIHRoaXMuYXhpb3NTdGF0aWMgPSB0aGlzLmltcG9ydEF4aW9zKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuYXhpb3NTdGF0aWM7XG4gIH1cblxuICBhc3luYyBjcmVhdGVIdHRwKCkge1xuICAgIGNvbnN0IGF4aW9zU3RhdGljID0gYXdhaXQgVW5pY29ybkh0dHBDbGllbnQuZ2V0QXhpb3NTdGF0aWMoKTtcblxuICAgIHJldHVybiB0aGlzLmF4aW9zID0gYXhpb3NTdGF0aWMuY3JlYXRlKHRoaXMuY29uZmlnIHx8IHt9KTtcbiAgfVxuXG4gIGFzeW5jIGdldEF4aW9zSW5zdGFuY2UoKSB7XG4gICAgaWYgKHRoaXMuYXhpb3MpIHtcbiAgICAgIHJldHVybiB0aGlzLmF4aW9zO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmF4aW9zID0gdGhpcy5wcmVwYXJlQXhpb3MoYXdhaXQgdGhpcy5jcmVhdGVIdHRwKCkpO1xuICB9XG5cbiAgcHJlcGFyZUF4aW9zKGF4aW9zOiBBeGlvc0luc3RhbmNlKTogQXhpb3NJbnN0YW5jZSB7XG4gICAgYXhpb3MuaW50ZXJjZXB0b3JzLnJlcXVlc3QudXNlKChjb25maWcpID0+IHtcbiAgICAgIGNvbmZpZy5oZWFkZXJzWydYLUNTUkYtVG9rZW4nXSA9IGRhdGEoJ2NzcmYtdG9rZW4nKTtcblxuICAgICAgaWYgKGNvbmZpZy51cmwgJiYgY29uZmlnLnVybC5zdGFydHNXaXRoKCdAJykpIHtcbiAgICAgICAgY29uZmlnLnVybCA9IHJvdXRlKGNvbmZpZy51cmwpO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29uZmlnPy52YXJzICYmIGNvbmZpZy51cmwpIHtcbiAgICAgICAgY29uc3QgdG1wbCA9IHBhcnNlVGVtcGxhdGUoY29uZmlnLnVybCk7XG4gICAgICAgIGNvbmZpZy51cmwgPSB0bXBsLmV4cGFuZChjb25maWcudmFycyB8fCB7fSk7XG4gICAgICB9XG5cbiAgICAgIC8vIFNpbXVsYXRlIG1ldGhvZHNcbiAgICAgIGlmIChjb25maWcubWV0aG9kU2ltdWxhdGUpIHtcbiAgICAgICAgaWYgKGNvbmZpZy5tZXRob2RTaW11bGF0ZUJ5SGVhZGVyKSB7XG4gICAgICAgICAgY29uZmlnLmhlYWRlcnNbJ1gtSFRUUC1NZXRob2QtT3ZlcnJpZGUnXSA9IGNvbmZpZztcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgY29uZmlnLmRhdGEgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgY29uZmlnLmRhdGFbJ19tZXRob2QnXSA9IGNvbmZpZy5tZXRob2Q7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvbmZpZy5kYXRhID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIGlmIChjb25maWcuZGF0YS5pbmNsdWRlcygnPycpKSB7XG4gICAgICAgICAgICBjb25maWcuZGF0YSArPSAnJl9tZXRob2Q9JyArIGNvbmZpZy5tZXRob2Q7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbmZpZy5kYXRhICs9ICc/X21ldGhvZD0nICsgY29uZmlnLm1ldGhvZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnLm1ldGhvZD8udG9Mb3dlckNhc2UoKSAhPT0gJ2dldCcpIHtcbiAgICAgICAgICBjb25maWcubWV0aG9kID0gJ1BPU1QnO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjb25maWc7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gYXhpb3M7XG4gIH1cblxuICByZXF1ZXN0TWlkZGxld2FyZShjYWxsYmFjazogUGFyYW1ldGVyczxBeGlvc0luc3RhbmNlWydpbnRlcmNlcHRvcnMnXVsncmVxdWVzdCddWyd1c2UnXT5bMF0pIHtcbiAgICByZXR1cm4gdGhpcy5nZXRBeGlvc0luc3RhbmNlKCkudGhlbihheGlvcyA9PiBheGlvcy5pbnRlcmNlcHRvcnMucmVxdWVzdC51c2UoY2FsbGJhY2spKTtcbiAgfVxuXG4gIHJlc3BvbnNlTWlkZGxld2FyZShjYWxsYmFjazogUGFyYW1ldGVyczxBeGlvc0luc3RhbmNlWydpbnRlcmNlcHRvcnMnXVsncmVzcG9uc2UnXVsndXNlJ10+WzBdKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0QXhpb3NJbnN0YW5jZSgpLnRoZW4oYXhpb3MgPT4gYXhpb3MuaW50ZXJjZXB0b3JzLnJlc3BvbnNlLnVzZShjYWxsYmFjaykpO1xuICB9XG5cbiAgLy8gcmVhZHkoKSB7XG4gIC8vICAgc3VwZXIucmVhZHkoKTtcbiAgLy8gfVxuXG4gIC8qKlxuICAgKiBTZW5kIGEgR0VUIHJlcXVlc3QuXG4gICAqL1xuICBnZXQ8VCA9IGFueSwgRCA9IGFueT4odXJsOiBzdHJpbmcsIG9wdGlvbnM6IFBhcnRpYWw8QXhpb3NSZXF1ZXN0Q29uZmlnPiA9IHt9KTogUHJvbWlzZTxBeGlvc1Jlc3BvbnNlPFQsIEQ+PiB7XG4gICAgb3B0aW9ucy51cmwgPSB1cmw7XG4gICAgb3B0aW9ucy5tZXRob2QgPSAnR0VUJztcblxuICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZCBhIFBPU1QgcmVxdWVzdC5cbiAgICovXG4gIHBvc3Q8VCA9IGFueSwgRCA9IGFueT4oXG4gICAgdXJsOiBzdHJpbmcsXG4gICAgZGF0YT86IGFueSxcbiAgICBvcHRpb25zOiBQYXJ0aWFsPEF4aW9zUmVxdWVzdENvbmZpZz4gPSB7fVxuICApOiBQcm9taXNlPEF4aW9zUmVzcG9uc2U8VCwgRD4+IHtcbiAgICBvcHRpb25zLnVybCA9IHVybDtcbiAgICBvcHRpb25zLm1ldGhvZCA9ICdQT1NUJztcbiAgICBvcHRpb25zLmRhdGEgPSBkYXRhO1xuXG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIGEgUFVUIHJlcXVlc3QuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cmxcbiAgICogQHBhcmFtIHthbnl9IGRhdGFcbiAgICogQHBhcmFtIHtBeGlvc1JlcXVlc3RDb25maWd9IG9wdGlvbnNcbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2U8QXhpb3NSZXNwb25zZT59XG4gICAqL1xuICBwdXQ8VCA9IGFueSwgRCA9IGFueT4oXG4gICAgdXJsOiBzdHJpbmcsXG4gICAgZGF0YT86IGFueSxcbiAgICBvcHRpb25zOiBQYXJ0aWFsPEF4aW9zUmVxdWVzdENvbmZpZz4gPSB7fVxuICApOiBQcm9taXNlPEF4aW9zUmVzcG9uc2U8VCwgRD4+IHtcbiAgICBvcHRpb25zLnVybCA9IHVybDtcbiAgICBvcHRpb25zLm1ldGhvZCA9ICdQVVQnO1xuICAgIG9wdGlvbnMuZGF0YSA9IGRhdGE7XG5cbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSBQQVRDSCByZXF1ZXN0LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsXG4gICAqIEBwYXJhbSB7YW55fSBkYXRhXG4gICAqIEBwYXJhbSB7QXhpb3NSZXF1ZXN0Q29uZmlnfSBvcHRpb25zXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPEF4aW9zUmVzcG9uc2U+fVxuICAgKi9cbiAgcGF0Y2g8VCA9IGFueSwgRCA9IGFueT4oXG4gICAgdXJsOiBzdHJpbmcsXG4gICAgZGF0YT86IGFueSxcbiAgICBvcHRpb25zOiBQYXJ0aWFsPEF4aW9zUmVxdWVzdENvbmZpZz4gPSB7fVxuICApOiBQcm9taXNlPEF4aW9zUmVzcG9uc2U8VCwgRD4+IHtcbiAgICBvcHRpb25zLnVybCA9IHVybDtcbiAgICBvcHRpb25zLm1ldGhvZCA9ICdQQVRDSCc7XG4gICAgb3B0aW9ucy5kYXRhID0gZGF0YTtcblxuICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZCBhIERFTEVURSByZXF1ZXN0LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsXG4gICAqIEBwYXJhbSB7YW55fSBkYXRhXG4gICAqIEBwYXJhbSB7QXhpb3NSZXF1ZXN0Q29uZmlnfSBvcHRpb25zXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPEF4aW9zUmVzcG9uc2U+fVxuICAgKi9cbiAgZGVsZXRlPFQgPSBhbnksIEQgPSBhbnk+KFxuICAgIHVybDogc3RyaW5nLFxuICAgIGRhdGE/OiBhbnksXG4gICAgb3B0aW9uczogUGFydGlhbDxBeGlvc1JlcXVlc3RDb25maWc+ID0ge31cbiAgKTogUHJvbWlzZTxBeGlvc1Jlc3BvbnNlPFQsIEQ+PiB7XG4gICAgb3B0aW9ucy51cmwgPSB1cmw7XG4gICAgb3B0aW9ucy5tZXRob2QgPSAnREVMRVRFJztcbiAgICBvcHRpb25zLmRhdGEgPSBkYXRhO1xuXG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIGEgSEVBRCByZXF1ZXN0LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsXG4gICAqIEBwYXJhbSB7QXhpb3NSZXF1ZXN0Q29uZmlnfSBvcHRpb25zXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPEF4aW9zUmVzcG9uc2U+fVxuICAgKi9cbiAgaGVhZDxUID0gYW55LCBEID0gYW55Pih1cmw6IHN0cmluZywgb3B0aW9uczogUGFydGlhbDxBeGlvc1JlcXVlc3RDb25maWc+ID0ge30pOiBQcm9taXNlPEF4aW9zUmVzcG9uc2U8VCwgRD4+IHtcbiAgICBvcHRpb25zLnVybCA9IHVybDtcbiAgICBvcHRpb25zLm1ldGhvZCA9ICdIRUFEJztcblxuICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZCBhIE9QVElPTlMgcmVxdWVzdC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVybFxuICAgKiBAcGFyYW0ge0F4aW9zUmVxdWVzdENvbmZpZ30gb3B0aW9uc1xuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxBeGlvc1Jlc3BvbnNlPn1cbiAgICovXG4gIG9wdGlvbnM8VCA9IGFueSwgRCA9IGFueT4odXJsOiBzdHJpbmcsIG9wdGlvbnM6IFBhcnRpYWw8QXhpb3NSZXF1ZXN0Q29uZmlnPiA9IHt9KTogUHJvbWlzZTxBeGlvc1Jlc3BvbnNlPFQsIEQ+PiB7XG4gICAgb3B0aW9ucy51cmwgPSB1cmw7XG4gICAgb3B0aW9ucy5tZXRob2QgPSAnT1BUSU9OUyc7XG5cbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICB9XG5cbiAgaXNDYW5jZWwoY2FuY2VsOiBhbnkpIHtcbiAgICByZXR1cm4gYXhpb3MuaXNDYW5jZWwoY2FuY2VsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIHJlcXVlc3QuXG4gICAqL1xuICBhc3luYyByZXF1ZXN0PFQgPSBhbnksIEQgPSBhbnk+KG9wdGlvbnM6IEF4aW9zUmVxdWVzdENvbmZpZyk6IFByb21pc2U8QXhpb3NSZXNwb25zZTxULCBEPj4ge1xuICAgIHRyeSB7XG4gICAgICBsZXQgYXhpb3NJbnN0YW5jZSA9IGF3YWl0IHRoaXMuZ2V0QXhpb3NJbnN0YW5jZSgpO1xuICAgICAgcmV0dXJuIGF3YWl0IGF4aW9zSW5zdGFuY2Uob3B0aW9ucyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgKGUgYXMgYW55KS5vcmlnaW5NZXNzYWdlID0gKGUgYXMgRXJyb3IpLm1lc3NhZ2U7XG5cbiAgICAgIGNvbnN0IGVyciA9IGUgYXMgQXhpb3NFcnJvcjxhbnk+O1xuXG4gICAgICBpZiAoZXJyLnJlc3BvbnNlPy5kYXRhPy5tZXNzYWdlKSB7XG4gICAgICAgIGVyci5tZXNzYWdlID0gZXJyLnJlc3BvbnNlLmRhdGEubWVzc2FnZTtcbiAgICAgIH1cblxuICAgICAgdGhyb3cgZXJyO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGVycm9yQ2xhc3MoKSB7XG4gICAgY29uc3QgYXhpb3MgPSBhd2FpdCBVbmljb3JuSHR0cENsaWVudC5nZXRBeGlvc1N0YXRpYygpO1xuXG4gICAgcmV0dXJuIGF4aW9zLkF4aW9zRXJyb3I7XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJ2YWx1ZSIsImF4aW9zIiwiZGF0YSJdLCJtYXBwaW5ncyI6IjtB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
