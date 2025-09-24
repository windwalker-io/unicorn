import { d as data, l as loadAlpine } from "./unicorn-BsRnuUg4.js";
function useSystemUri(type, path) {
  const uri2 = UnicornSystemUri.get();
  {
    return uri2[type](path);
  }
}
function uri(type) {
  return data("unicorn.uri")[type];
}
class UnicornSystemUri extends URL {
  static instance;
  static get() {
    return this.instance ??= new this(uri("full"));
  }
  path(path = "") {
    return uri("path") + path;
  }
  root(path = "") {
    return uri("root") + path;
  }
  current() {
    return uri("current") || "";
  }
  full() {
    return uri("full") || "";
  }
  route() {
    return uri("route") || "";
  }
  script() {
    return uri("script") || "";
  }
  routeWithQuery() {
    const route = this.route();
    const query = this.searchParams.toString();
    return query ? `${route}?${query}` : route;
  }
  routeAndQuery() {
    const route = this.route();
    const query = this.searchParams.toString();
    return [route, query];
  }
}
class UnicornFormElement {
  element;
  options;
  constructor(selector, element, options = {}) {
    if (!element) {
      element = document.createElement("form");
      if (typeof selector === "string" && selector.startsWith("#")) {
        element.setAttribute("id", selector.substring(1));
        element.setAttribute("name", selector.substring(1));
      }
      element.setAttribute("method", "post");
      element.setAttribute("enctype", "multipart/form-data");
      element.setAttribute("novalidate", "true");
      element.setAttribute("action", useSystemUri("full"));
      element.setAttribute("style", "display: none;");
      const csrf = document.createElement("input");
      csrf.setAttribute("type", "hidden");
      csrf.setAttribute("name", data("csrf-token"));
      csrf.setAttribute("value", "1");
      element.appendChild(csrf);
      document.body.appendChild(element);
    }
    this.element = element;
    this.options = { ...options };
  }
  initComponent(store = "form", custom = {}) {
    return loadAlpine(() => {
      Alpine.store(store, this.useState(custom));
    });
  }
  useState(custom = {}) {
    const state = {};
    Object.getOwnPropertyNames(Object.getPrototypeOf(this)).map((item) => {
      return state[item] = this[item].bind(this);
    });
    return Object.assign(
      state,
      custom
    );
  }
  getElement() {
    return this.element;
  }
  submit(url, data2, method, customMethod) {
    const form = this.element;
    if (customMethod) {
      let methodInput = form.querySelector('input[name="_method"]');
      if (!methodInput) {
        methodInput = document.createElement("input");
        methodInput.setAttribute("name", "_method");
        methodInput.setAttribute("type", "hidden");
        methodInput.value = customMethod;
        form.appendChild(methodInput);
      } else {
        methodInput.value = customMethod;
      }
    }
    if (data2) {
      const flatted = UnicornFormElement.flattenObject(data2);
      for (const key in flatted) {
        const value = flatted[key];
        const fieldName = UnicornFormElement.buildFieldName(key);
        this.injectInput(fieldName, value);
      }
    }
    if (url) {
      form.setAttribute("action", url);
    }
    if (method) {
      form.setAttribute("method", method);
    }
    form.requestSubmit();
    return true;
  }
  injectInput(name, value) {
    let input = this.element.querySelector(`input[name="${name}"]`);
    if (!input) {
      input = document.createElement("input");
      input.setAttribute("name", name);
      input.setAttribute("type", "hidden");
      input.setAttribute("data-role", "temp-input");
      this.element.appendChild(input);
    }
    input.value = value;
    return input;
  }
  /**
   * Make a GET request.
   */
  get(url, data2, customMethod) {
    return this.submit(url, data2, "GET", customMethod);
  }
  /**
   * Post form.
   */
  post(url, data2, customMethod) {
    customMethod = customMethod || "POST";
    return this.submit(url, data2, "POST", customMethod);
  }
  /**
   * Make a PUT request.
   */
  put(url, data2) {
    return this.post(url, data2, "PUT");
  }
  /**
   * Make a PATCH request.
   */
  patch(url, data2) {
    return this.post(url, data2, "PATCH");
  }
  /**
   * Make a DELETE request.
   */
  delete(url, data2) {
    return this.post(url, data2, "DELETE");
  }
  /**
   * @see https://stackoverflow.com/a/53739792
   *
   * @param {Object} ob
   * @returns {Object}
   */
  static flattenObject(ob) {
    const toReturn = {};
    for (let i in ob) {
      if (!ob.hasOwnProperty(i)) {
        continue;
      }
      if (typeof ob[i] === "object" && ob[i] != null) {
        const flatObject = this.flattenObject(ob[i]);
        for (let x in flatObject) {
          if (!flatObject.hasOwnProperty(x)) {
            continue;
          }
          toReturn[i + "/" + x] = flatObject[x];
        }
      } else {
        toReturn[i] = ob[i];
      }
    }
    return toReturn;
  }
  static buildFieldName(field) {
    const names = field.split("/");
    const first = names.shift();
    return first + names.map((name) => `[${name}]`).join("");
  }
}
export {
  UnicornFormElement
};
