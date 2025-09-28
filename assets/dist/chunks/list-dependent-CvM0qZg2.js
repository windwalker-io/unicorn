import { d as useUniDirective, A as getBoundedInstance, a as selectOne, q as useHttpClient, h as html, m as mergeDeep } from "./unicorn-D5cXQeSK.js";
const nope = () => {
};
const defaultOptions = {
  ajax: {
    url: null,
    value_field: "value",
    data: null
  },
  source: null,
  text_field: "title",
  value_field: "id",
  first_option: null,
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
  cancelToken = null;
  static handle(el, dependent = null, options = {}) {
    return getBoundedInstance(el, "list-dependent", () => {
      return new this(el, dependent, options);
    });
  }
  constructor(element, dependent, options = {}) {
    this.options = this.mergeOptions(options);
    this.element = selectOne(element);
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
   *
   * @param {string} value
   * @param {bool}   initial
   */
  sourceUpdate(value, initial = false) {
    const source = this.options.source;
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
    if (this.cancelToken) {
      this.cancelToken.cancel();
      this.cancelToken = null;
    }
    let url = this.options.ajax.url;
    if (typeof url === "function") {
      url = url(this);
    }
    const http = await useHttpClient();
    try {
      const res = await http.get(url, {
        params: data,
        cancelToken: this.cancelToken
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
      this.cancelToken = null;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC1kZXBlbmRlbnQtQ3ZNMHFaZzIuanMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2R1bGUvbGlzdC1kZXBlbmRlbnQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgeyB1c2VIdHRwQ2xpZW50LCB1c2VVbmlEaXJlY3RpdmUgfSBmcm9tICcuLi9jb21wb3NhYmxlJztcbmltcG9ydCB7IGdldEJvdW5kZWRJbnN0YW5jZSwgaHRtbCwgc2VsZWN0T25lIH0gZnJvbSAnLi4vc2VydmljZSc7XG5pbXBvcnQgeyBtZXJnZURlZXAgfSBmcm9tICcuLi91dGlsaXRpZXMnO1xuXG5jb25zdCBub3BlID0gKCkgPT4ge307XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGlzdERlcGVuZGVudE9wdGlvbnMge1xuICBhamF4OiB7XG4gICAgdXJsOiBzdHJpbmcgfCBudWxsIHwgKChzZWxmOiBMaXN0RGVwZW5kZW50KSA9PiBzdHJpbmcpO1xuICAgIHZhbHVlX2ZpZWxkOiBzdHJpbmc7XG4gICAgZGF0YTogUmVjb3JkPHN0cmluZywgYW55PiB8ICgoZGF0YTogUmVjb3JkPHN0cmluZywgYW55Piwgc2VsZjogTGlzdERlcGVuZGVudCkgPT4gUmVjb3JkPHN0cmluZywgYW55Pik7XG4gIH07XG4gIHNvdXJjZTogUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGw7XG4gIHRleHRfZmllbGQ6IHN0cmluZztcbiAgdmFsdWVfZmllbGQ6IHN0cmluZztcbiAgZmlyc3Rfb3B0aW9uOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbDtcbiAgZGVmYXVsdF92YWx1ZTogYW55O1xuICBpbml0aWFsX2xvYWQ6IGJvb2xlYW47XG4gIGVtcHR5X21hcms6IHN0cmluZztcbiAgaG9va3M6IHtcbiAgICBiZWZvcmVfcmVxdWVzdDogKHZhbHVlOiBhbnksIGVsZW1lbnQ6IEhUTUxTZWxlY3RFbGVtZW50LCBkZXBlbmRlbnQ6IEhUTUxTZWxlY3RFbGVtZW50KSA9PiBhbnk7XG4gICAgYWZ0ZXJfcmVxdWVzdDogKHZhbHVlOiBhbnksIGVsZW1lbnQ6IEhUTUxTZWxlY3RFbGVtZW50LCBkZXBlbmRlbnQ6IEhUTUxTZWxlY3RFbGVtZW50KSA9PiBhbnk7XG4gIH07XG59XG5cbmNvbnN0IGRlZmF1bHRPcHRpb25zOiBMaXN0RGVwZW5kZW50T3B0aW9ucyA9IHtcbiAgYWpheDoge1xuICAgIHVybDogbnVsbCxcbiAgICB2YWx1ZV9maWVsZDogJ3ZhbHVlJyxcbiAgICBkYXRhOiBudWxsLFxuICB9LFxuICBzb3VyY2U6IG51bGwsXG4gIHRleHRfZmllbGQ6ICd0aXRsZScsXG4gIHZhbHVlX2ZpZWxkOiAnaWQnLFxuICBmaXJzdF9vcHRpb246IG51bGwsXG4gIGRlZmF1bHRfdmFsdWU6IG51bGwsXG4gIGluaXRpYWxfbG9hZDogdHJ1ZSxcbiAgZW1wdHlfbWFyazogJ19fRU1QVFlfXycsXG4gIGhvb2tzOiB7XG4gICAgYmVmb3JlX3JlcXVlc3Q6IG5vcGUsXG4gICAgYWZ0ZXJfcmVxdWVzdDogbm9wZVxuICB9XG59O1xuXG50eXBlIExpc3RJdGVtcyA9IFJlY29yZDxzdHJpbmcsIGFueT5bXTtcbnR5cGUgTWF5YmVHcm91cGVkTGlzdEl0ZW1zID0gUmVjb3JkPHN0cmluZywgTGlzdEl0ZW1zPiB8IExpc3RJdGVtcztcblxuZXhwb3J0IGNsYXNzIExpc3REZXBlbmRlbnQge1xuICBlbGVtZW50OiBIVE1MU2VsZWN0RWxlbWVudDtcbiAgZGVwZW5kZW50OiBIVE1MU2VsZWN0RWxlbWVudDtcbiAgb3B0aW9uczogTGlzdERlcGVuZGVudE9wdGlvbnM7XG4gIGNhbmNlbFRva2VuID0gbnVsbDtcblxuICBzdGF0aWMgaGFuZGxlKGVsOiBzdHJpbmcgfCBFbGVtZW50LCBkZXBlbmRlbnQgPSBudWxsLCBvcHRpb25zOiBQYXJ0aWFsPExpc3REZXBlbmRlbnRPcHRpb25zPiA9IHt9KTogTGlzdERlcGVuZGVudCB7XG4gICAgcmV0dXJuIGdldEJvdW5kZWRJbnN0YW5jZShlbCwgJ2xpc3QtZGVwZW5kZW50JywgKCkgPT4ge1xuICAgICAgcmV0dXJuIG5ldyB0aGlzKGVsLCBkZXBlbmRlbnQsIG9wdGlvbnMpO1xuICAgIH0pO1xuICB9XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudDogYW55LCBkZXBlbmRlbnQ6IGFueSwgb3B0aW9uczogUGFydGlhbDxMaXN0RGVwZW5kZW50T3B0aW9ucz4gPSB7fSkge1xuICAgIHRoaXMub3B0aW9ucyA9IHRoaXMubWVyZ2VPcHRpb25zKG9wdGlvbnMpO1xuXG4gICAgdGhpcy5lbGVtZW50ID0gc2VsZWN0T25lKGVsZW1lbnQpO1xuICAgIHRoaXMuZGVwZW5kZW50ID0gc2VsZWN0T25lKGRlcGVuZGVudCk7XG5cbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuaW5pdGlhbF9sb2FkKSB7XG4gICAgICB0aGlzLmNoYW5nZUxpc3QodGhpcy5kZXBlbmRlbnQudmFsdWUsIHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBCaW5kIGV2ZW50cy5cbiAgICovXG4gIGJpbmRFdmVudHMoKSB7XG4gICAgdGhpcy5kZXBlbmRlbnQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGV2ZW50KSA9PiB7XG4gICAgICB0aGlzLmNoYW5nZUxpc3QoKGV2ZW50LmN1cnJlbnRUYXJnZXQgYXMgSFRNTFNlbGVjdEVsZW1lbnQpPy52YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIHRoZSBsaXN0IGVsZW1lbnRzLlxuICAgKlxuICAgKiBAcGFyYW0geyp9ICAgIHZhbHVlXG4gICAqIEBwYXJhbSB7Ym9vbH0gaW5pdGlhbFxuICAgKi9cbiAgY2hhbmdlTGlzdCh2YWx1ZTogc3RyaW5nLCBpbml0aWFsID0gZmFsc2UpIHtcbiAgICB2YWx1ZSA9IHZhbHVlIHx8IHRoaXMuZGVwZW5kZW50LnZhbHVlO1xuXG4gICAgLy8gRW1wdHkgbWFya1xuICAgIGlmICh2YWx1ZSA9PT0gJycpIHtcbiAgICAgIHZhbHVlID0gdGhpcy5vcHRpb25zLmVtcHR5X21hcms7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5hamF4LnVybCkge1xuICAgICAgdGhpcy5hamF4VXBkYXRlKHZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ucy5zb3VyY2UpIHtcbiAgICAgIHRoaXMuc291cmNlVXBkYXRlKHZhbHVlLCBpbml0aWFsKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIGxpc3QgYnkgc291cmNlLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcbiAgICogQHBhcmFtIHtib29sfSAgIGluaXRpYWxcbiAgICovXG4gIHNvdXJjZVVwZGF0ZSh2YWx1ZTogc3RyaW5nLCBpbml0aWFsID0gZmFsc2UpIHtcbiAgICBjb25zdCBzb3VyY2UgPSB0aGlzLm9wdGlvbnMuc291cmNlO1xuXG4gICAgdGhpcy5iZWZvcmVIb29rKHZhbHVlLCB0aGlzLmVsZW1lbnQsIHRoaXMuZGVwZW5kZW50KTtcblxuICAgIGlmIChzb3VyY2VbdmFsdWVdKSB7XG4gICAgICB0aGlzLnVwZGF0ZUxpc3RFbGVtZW50cyhzb3VyY2VbdmFsdWVdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy51cGRhdGVMaXN0RWxlbWVudHMoW10pO1xuXG4gICAgICBpZiAoIWluaXRpYWwgJiYgdmFsdWUgIT09ICcnICYmIHBhcnNlSW50KHZhbHVlKSAhPT0gMCkge1xuICAgICAgICBjb25zb2xlLmxvZygnTGlzdCBmb3IgdmFsdWU6ICcgKyB2YWx1ZSArICcgbm90IGZvdW5kLicpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuYWZ0ZXJIb29rKHZhbHVlLCB0aGlzLmVsZW1lbnQsIHRoaXMuZGVwZW5kZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEbyBhamF4LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcbiAgICovXG4gIGFzeW5jIGFqYXhVcGRhdGUodmFsdWU6IHN0cmluZykge1xuICAgIGxldCBkYXRhID0ge307XG5cbiAgICBkYXRhW3RoaXMub3B0aW9ucy5hamF4LnZhbHVlX2ZpZWxkXSA9IHZhbHVlO1xuXG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMuYWpheC5kYXRhID09PSAnb2JqZWN0Jykge1xuICAgICAgZGF0YSA9IHsgLi4uZGF0YSwgLi4udGhpcy5vcHRpb25zLmFqYXguZGF0YSB9O1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5hamF4LmRhdGEgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGRhdGEgPSB0aGlzLm9wdGlvbnMuYWpheC5kYXRhKGRhdGEsIHRoaXMpIHx8IGRhdGE7XG4gICAgfVxuXG4gICAgdGhpcy5iZWZvcmVIb29rKHZhbHVlLCB0aGlzLmVsZW1lbnQsIHRoaXMuZGVwZW5kZW50KTtcblxuICAgIGlmICh0aGlzLmNhbmNlbFRva2VuKSB7XG4gICAgICB0aGlzLmNhbmNlbFRva2VuLmNhbmNlbCgpO1xuICAgICAgdGhpcy5jYW5jZWxUb2tlbiA9IG51bGw7XG4gICAgfVxuXG4gICAgbGV0IHVybCA9IHRoaXMub3B0aW9ucy5hamF4LnVybDtcblxuICAgIGlmICh0eXBlb2YgdXJsID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB1cmwgPSB1cmwodGhpcyk7XG4gICAgfVxuXG4gICAgY29uc3QgaHR0cCA9IGF3YWl0IHVzZUh0dHBDbGllbnQoKTtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXMgPSBhd2FpdCBodHRwLmdldDx7XG4gICAgICAgIHN1Y2Nlc3M6IGJvb2xlYW47XG4gICAgICAgIGRhdGE6IGFueTtcbiAgICAgIH0+KHVybCwge1xuICAgICAgICBwYXJhbXM6IGRhdGEsXG4gICAgICAgIGNhbmNlbFRva2VuOiB0aGlzLmNhbmNlbFRva2VuXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgeyBzdWNjZXNzLCBkYXRhOiByZXR1cm5EYXRhIH0gPSByZXMuZGF0YTtcblxuICAgICAgaWYgKHN1Y2Nlc3MpIHtcbiAgICAgICAgdGhpcy51cGRhdGVMaXN0RWxlbWVudHMocmV0dXJuRGF0YSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKHJldHVybkRhdGEpO1xuICAgICAgfVxuXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5hZnRlckhvb2sodmFsdWUsIHRoaXMuZWxlbWVudCwgdGhpcy5kZXBlbmRlbnQpO1xuICAgICAgdGhpcy5jYW5jZWxUb2tlbiA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlTGlzdEVsZW1lbnRzKGl0ZW1zOiBNYXliZUdyb3VwZWRMaXN0SXRlbXMpIHtcbiAgICBjb25zdCB0ZXh0RmllbGQgPSB0aGlzLm9wdGlvbnMudGV4dF9maWVsZDtcbiAgICBjb25zdCB2YWx1ZUZpZWxkID0gdGhpcy5vcHRpb25zLnZhbHVlX2ZpZWxkO1xuICAgIHRoaXMuZWxlbWVudC5pbm5lckhUTUwgPSAnJztcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuZmlyc3Rfb3B0aW9uICYmIEFycmF5LmlzQXJyYXkoaXRlbXMpKSB7XG4gICAgICBpdGVtcy51bnNoaWZ0KHt9KTtcbiAgICAgIGl0ZW1zWzBdW3RleHRGaWVsZF0gPSB0aGlzLm9wdGlvbnMuZmlyc3Rfb3B0aW9uW3RleHRGaWVsZF07XG4gICAgICBpdGVtc1swXVt2YWx1ZUZpZWxkXSA9IHRoaXMub3B0aW9ucy5maXJzdF9vcHRpb25bdmFsdWVGaWVsZF07XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBpIGluICBpdGVtcykge1xuICAgICAgY29uc3QgaXRlbSA9IGl0ZW1zW2ldO1xuXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShpdGVtKSkge1xuICAgICAgICBjb25zdCBncm91cCA9IGh0bWwoYDxvcHRncm91cCBsYWJlbD1cIiR7aX1cIj48L29wdGdyb3VwPmApO1xuXG4gICAgICAgIGZvciAoY29uc3QgayBpbiBpdGVtKSB7XG4gICAgICAgICAgY29uc3QgY2hpbGQgPSBpdGVtW2tdO1xuICAgICAgICAgIHRoaXMuYXBwZW5kT3B0aW9uVG8oe1xuICAgICAgICAgICAgdmFsdWU6IGNoaWxkW3ZhbHVlRmllbGRdLFxuICAgICAgICAgICAgdGV4dDogY2hpbGRbdGV4dEZpZWxkXSxcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IGNoaWxkLmF0dHJpYnV0ZXMsXG4gICAgICAgICAgfSwgZ3JvdXApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKGdyb3VwKTtcblxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5hcHBlbmRPcHRpb25Ubyh7XG4gICAgICAgIHZhbHVlOiBpdGVtW3ZhbHVlRmllbGRdLFxuICAgICAgICB0ZXh0OiBpdGVtW3RleHRGaWVsZF0sXG4gICAgICAgIGF0dHJpYnV0ZXM6IGl0ZW0uYXR0cmlidXRlcyxcbiAgICAgIH0sIHRoaXMuZWxlbWVudCk7XG4gICAgfVxuXG4gICAgdGhpcy5lbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdjaGFuZ2UnKSk7XG4gICAgdGhpcy5lbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdsaXN0OnVwZGF0ZWQnKSk7XG4gIH1cblxuICBhcHBlbmRPcHRpb25UbyhpdGVtOiBhbnksIHBhcmVudDogYW55KSB7XG4gICAgY29uc3QgdmFsdWUgPSBpdGVtLnZhbHVlO1xuICAgIGNvbnN0IG9wdGlvbiA9IGh0bWwoJzxvcHRpb24+JyArIGl0ZW0udGV4dCArICc8L29wdGlvbj4nKTtcbiAgICBvcHRpb24uc2V0QXR0cmlidXRlKCd2YWx1ZScsIHZhbHVlKTtcblxuICAgIGlmIChpdGVtLmF0dHJpYnV0ZXMpIHtcbiAgICAgIGZvciAoY29uc3QgaW5kZXggaW4gaXRlbS5hdHRyaWJ1dGVzKSB7XG4gICAgICAgIGNvbnN0IHZhbCA9IGl0ZW0uYXR0cmlidXRlc1tpbmRleF07XG4gICAgICAgIG9wdGlvbi5zZXRBdHRyaWJ1dGUoaW5kZXgsIHZhbCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXNTZWxlY3RlZCh2YWx1ZSkpIHtcbiAgICAgIG9wdGlvbi5zZXRBdHRyaWJ1dGUoJ3NlbGVjdGVkJywgJ3NlbGVjdGVkJyk7XG4gICAgfVxuXG4gICAgcGFyZW50LmFwcGVuZENoaWxkKG9wdGlvbik7XG4gIH1cblxuICBpc1NlbGVjdGVkKHZhbHVlOiBzdHJpbmcpIHtcbiAgICBsZXQgZGVmYXVsdFZhbHVlczogYW55W10gPSBbXTtcblxuICAgIC8vIENvbnZlcnQgYWxsIHR5cGVzIHRvIGFycmF5XG4gICAgbGV0IGRlZlZhbHVlID0gdGhpcy5lbGVtZW50LmRhdGFzZXQuc2VsZWN0ZWQgPz8gdGhpcy5vcHRpb25zLmRlZmF1bHRfdmFsdWU7XG5cbiAgICBpZiAodHlwZW9mIGRlZlZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBkZWZWYWx1ZSA9IGRlZlZhbHVlKHZhbHVlLCB0aGlzKTtcbiAgICB9XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShkZWZWYWx1ZSkpIHtcbiAgICAgIGRlZmF1bHRWYWx1ZXMgPSBkZWZWYWx1ZTtcbiAgICB9IGVsc2UgaWYgKGRlZlZhbHVlICYmIHR5cGVvZiBkZWZWYWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGRlZmF1bHRWYWx1ZXMgPSBPYmplY3Qua2V5cyhkZWZWYWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlZmF1bHRWYWx1ZXMgPSBbZGVmVmFsdWVdO1xuICAgIH1cblxuICAgIHJldHVybiBkZWZhdWx0VmFsdWVzLmluZGV4T2YodmFsdWUpICE9PSAtMTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCZWZvcmUgaG9vay5cbiAgICovXG4gIGJlZm9yZUhvb2sodmFsdWU6IHN0cmluZywgZWxlbWVudDogSFRNTFNlbGVjdEVsZW1lbnQsIGRlcGVuZGVudDogSFRNTFNlbGVjdEVsZW1lbnQpIHtcbiAgICBjb25zdCBiZWZvcmUgPSB0aGlzLm9wdGlvbnMuaG9va3MuYmVmb3JlX3JlcXVlc3Q7XG5cbiAgICByZXR1cm4gYmVmb3JlLmNhbGwodGhpcywgdmFsdWUsIGVsZW1lbnQsIGRlcGVuZGVudCk7XG4gIH1cblxuICAvKipcbiAgICogQWZ0ZXIgaG9vay5cbiAgICovXG4gIGFmdGVySG9vayh2YWx1ZTogc3RyaW5nLCBlbGVtZW50OiBIVE1MU2VsZWN0RWxlbWVudCwgZGVwZW5kZW50OiBIVE1MU2VsZWN0RWxlbWVudCkge1xuICAgIGNvbnN0IGFmdGVyID0gdGhpcy5vcHRpb25zLmhvb2tzLmFmdGVyX3JlcXVlc3Q7XG5cbiAgICByZXR1cm4gYWZ0ZXIuY2FsbCh0aGlzLCB2YWx1ZSwgZWxlbWVudCwgZGVwZW5kZW50KTtcbiAgfVxuXG4gIG1lcmdlT3B0aW9ucyhvcHRpb25zOiBQYXJ0aWFsPExpc3REZXBlbmRlbnRPcHRpb25zPik6IExpc3REZXBlbmRlbnRPcHRpb25zIHtcbiAgICByZXR1cm4gbWVyZ2VEZWVwPExpc3REZXBlbmRlbnRPcHRpb25zPih7fSwgZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCByZWFkeSA9IHVzZVVuaURpcmVjdGl2ZSgnbGlzdC1kZXBlbmRlbnQnLCB7XG4gIG1vdW50ZWQoZWwsIGJpbmRpbmcpIHtcbiAgICBjb25zdCBvcHRpb25zID0gSlNPTi5wYXJzZShiaW5kaW5nLnZhbHVlKTtcblxuICAgIExpc3REZXBlbmRlbnQuaGFuZGxlKGVsLCBvcHRpb25zLmRlcGVuZGVudCwgb3B0aW9ucyk7XG4gIH0sXG4gIHVwZGF0ZWQoZWwsIGJpbmRpbmcpIHtcbiAgICBjb25zdCBvcHRpb25zID0gSlNPTi5wYXJzZShiaW5kaW5nLnZhbHVlKTtcblxuICAgIExpc3REZXBlbmRlbnQuaGFuZGxlKGVsKS5tZXJnZU9wdGlvbnMob3B0aW9ucyk7XG4gIH1cbn0pO1xuXG5leHBvcnQgdHlwZSBMaXN0RGVwZW5kZW50TW9kdWxlID0ge1xuICBMaXN0RGVwZW5kZW50OiB0eXBlb2YgTGlzdERlcGVuZGVu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
