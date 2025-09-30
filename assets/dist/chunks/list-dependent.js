import { a as useUniDirective, x as getBoundedInstance, v as selectOne, u as useHttpClient, B as html, a5 as mergeDeep } from "./unicorn.js";
const nope = () => {
};
const defaultOptions = {
  ajax: {
    url: null,
    value_field: "value",
    data: {}
  },
  source: void 0,
  text_field: "title",
  value_field: "id",
  first_option: void 0,
  default_value: null,
  initial_load: true,
  empty_mark: "__EMPTY__",
  hooks: {
    before_request: nope,
    after_request: nope
  }
};
class ListDependent {
  element;
  dependent;
  options;
  abortController = null;
  static handle(el, dependent, options = {}) {
    return getBoundedInstance(el, "list-dependent", () => {
      return new this(el, dependent, options);
    });
  }
  constructor(element, dependent, options = {}) {
    this.options = this.mergeOptions(options);
    this.element = selectOne(element);
    if (!dependent) {
      dependent = this.element.dataset.dependent || "";
    }
    this.dependent = selectOne(dependent);
    this.bindEvents();
    if (this.options.initial_load) {
      this.changeList(this.dependent.value, true);
    }
  }
  /**
   * Bind events.
   */
  bindEvents() {
    this.dependent.addEventListener("change", (event) => {
      this.changeList(event.currentTarget?.value);
    });
  }
  /**
   * Update the list elements.
   *
   * @param {*}    value
   * @param {bool} initial
   */
  changeList(value, initial = false) {
    value = value || this.dependent.value;
    if (value === "") {
      value = this.options.empty_mark;
    }
    if (this.options.ajax.url) {
      this.ajaxUpdate(value);
    } else if (this.options.source) {
      this.sourceUpdate(value, initial);
    }
  }
  /**
   * Update list by source.
   */
  sourceUpdate(value, initial = false) {
    const source = this.options.source;
    if (!source) {
      return;
    }
    this.beforeHook(value, this.element, this.dependent);
    if (source[value]) {
      this.updateListElements(source[value]);
    } else {
      this.updateListElements([]);
      if (!initial && value !== "" && parseInt(value) !== 0) {
        console.log("List for value: " + value + " not found.");
      }
    }
    this.afterHook(value, this.element, this.dependent);
  }
  /**
   * Do ajax.
   *
   * @param {string} value
   */
  async ajaxUpdate(value) {
    let data = {};
    data[this.options.ajax.value_field] = value;
    if (typeof this.options.ajax.data === "object") {
      data = { ...data, ...this.options.ajax.data };
    } else if (typeof this.options.ajax.data === "function") {
      data = this.options.ajax.data(data, this) || data;
    }
    this.beforeHook(value, this.element, this.dependent);
    this.abort();
    let url = this.options.ajax.url;
    if (typeof url === "function") {
      url = url(this);
    }
    if (!url) {
      throw new Error("Ajax URL is not set.");
    }
    const http = await useHttpClient();
    this.abortController = new AbortController();
    try {
      const res = await http.get(url, {
        params: data,
        signal: this.abortController.signal
      });
      const { success, data: returnData } = res.data;
      if (success) {
        this.updateListElements(returnData);
      } else {
        console.error(returnData);
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.afterHook(value, this.element, this.dependent);
      this.abortController = null;
    }
  }
  abort() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }
  updateListElements(items) {
    const textField = this.options.text_field;
    const valueField = this.options.value_field;
    this.element.innerHTML = "";
    if (this.options.first_option && Array.isArray(items)) {
      items.unshift({});
      items[0][textField] = this.options.first_option[textField];
      items[0][valueField] = this.options.first_option[valueField];
    }
    for (const i in items) {
      const item = items[i];
      if (Array.isArray(item)) {
        const group = html(`<optgroup label="${i}"></optgroup>`);
        for (const k in item) {
          const child = item[k];
          this.appendOptionTo({
            value: child[valueField],
            text: child[textField],
            attributes: child.attributes
          }, group);
        }
        this.element.appendChild(group);
        continue;
      }
      this.appendOptionTo({
        value: item[valueField],
        text: item[textField],
        attributes: item.attributes
      }, this.element);
    }
    this.element.dispatchEvent(new CustomEvent("change"));
    this.element.dispatchEvent(new CustomEvent("list:updated"));
  }
  appendOptionTo(item, parent) {
    const value = item.value;
    const option = html("<option>" + item.text + "</option>");
    option.setAttribute("value", value);
    if (item.attributes) {
      for (const index in item.attributes) {
        const val = item.attributes[index];
        option.setAttribute(index, val);
      }
    }
    if (this.isSelected(value)) {
      option.setAttribute("selected", "selected");
    }
    parent.appendChild(option);
  }
  isSelected(value) {
    let defaultValues = [];
    let defValue = this.element.dataset.selected ?? this.options.default_value;
    if (typeof defValue === "function") {
      defValue = defValue(value, this);
    }
    if (Array.isArray(defValue)) {
      defaultValues = defValue;
    } else if (defValue && typeof defValue === "object") {
      defaultValues = Object.keys(defValue);
    } else {
      defaultValues = [defValue];
    }
    return defaultValues.indexOf(value) !== -1;
  }
  /**
   * Before hook.
   */
  beforeHook(value, element, dependent) {
    const before = this.options.hooks.before_request;
    return before.call(this, value, element, dependent);
  }
  /**
   * After hook.
   */
  afterHook(value, element, dependent) {
    const after = this.options.hooks.after_request;
    return after.call(this, value, element, dependent);
  }
  mergeOptions(options) {
    return mergeDeep({}, defaultOptions, options);
  }
}
const ready = /* @__PURE__ */ useUniDirective("list-dependent", {
  mounted(el, binding) {
    const options = JSON.parse(binding.value);
    ListDependent.handle(el, options.dependent, options);
  },
  updated(el, binding) {
    const options = JSON.parse(binding.value);
    ListDependent.handle(el).mergeOptions(options);
  }
});
export {
  ListDependent,
  ready
};
//# sourceMappingURL=list-dependent.js.map
