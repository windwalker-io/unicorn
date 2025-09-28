import { d as useUniDirective, A as getBoundedInstance, a as selectOne, q as useHttpClient, h as html, m as mergeDeep } from "./unicorn-DR9JpPYO.js";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC1kZXBlbmRlbnQtRERsU25ic0wuanMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2R1bGUvbGlzdC1kZXBlbmRlbnQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgdHlwZSB7IENhbmNlbFRva2VuU291cmNlIH0gZnJvbSAnYXhpb3MnO1xuaW1wb3J0IHsgdXNlSHR0cENsaWVudCwgdXNlVW5pRGlyZWN0aXZlIH0gZnJvbSAnLi4vY29tcG9zYWJsZSc7XG5pbXBvcnQgeyBnZXRCb3VuZGVkSW5zdGFuY2UsIGh0bWwsIHNlbGVjdE9uZSB9IGZyb20gJy4uL3NlcnZpY2UnO1xuaW1wb3J0IHsgbWVyZ2VEZWVwIH0gZnJvbSAnLi4vdXRpbGl0aWVzJztcblxuY29uc3Qgbm9wZSA9ICgpID0+IHt9O1xuXG5leHBvcnQgaW50ZXJmYWNlIExpc3REZXBlbmRlbnRPcHRpb25zIHtcbiAgYWpheDoge1xuICAgIHVybDogc3RyaW5nIHwgbnVsbCB8ICgoc2VsZjogTGlzdERlcGVuZGVudCkgPT4gc3RyaW5nKTtcbiAgICB2YWx1ZV9maWVsZDogc3RyaW5nO1xuICAgIGRhdGE6IFJlY29yZDxzdHJpbmcsIGFueT4gfCAoKGRhdGE6IFJlY29yZDxzdHJpbmcsIGFueT4sIHNlbGY6IExpc3REZXBlbmRlbnQpID0+IFJlY29yZDxzdHJpbmcsIGFueT4pO1xuICB9O1xuICBzb3VyY2U/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuICB0ZXh0X2ZpZWxkOiBzdHJpbmc7XG4gIHZhbHVlX2ZpZWxkOiBzdHJpbmc7XG4gIGZpcnN0X29wdGlvbj86IFJlY29yZDxzdHJpbmcsIGFueT47XG4gIGRlZmF1bHRfdmFsdWU6IGFueTtcbiAgaW5pdGlhbF9sb2FkOiBib29sZWFuO1xuICBlbXB0eV9tYXJrOiBzdHJpbmc7XG4gIGhvb2tzOiB7XG4gICAgYmVmb3JlX3JlcXVlc3Q6ICh2YWx1ZTogYW55LCBlbGVtZW50OiBIVE1MU2VsZWN0RWxlbWVudCwgZGVwZW5kZW50OiBIVE1MU2VsZWN0RWxlbWVudCkgPT4gYW55O1xuICAgIGFmdGVyX3JlcXVlc3Q6ICh2YWx1ZTogYW55LCBlbGVtZW50OiBIVE1MU2VsZWN0RWxlbWVudCwgZGVwZW5kZW50OiBIVE1MU2VsZWN0RWxlbWVudCkgPT4gYW55O1xuICB9O1xufVxuXG5jb25zdCBkZWZhdWx0T3B0aW9uczogTGlzdERlcGVuZGVudE9wdGlvbnMgPSB7XG4gIGFqYXg6IHtcbiAgICB1cmw6IG51bGwsXG4gICAgdmFsdWVfZmllbGQ6ICd2YWx1ZScsXG4gICAgZGF0YToge30sXG4gIH0sXG4gIHNvdXJjZTogdW5kZWZpbmVkLFxuICB0ZXh0X2ZpZWxkOiAndGl0bGUnLFxuICB2YWx1ZV9maWVsZDogJ2lkJyxcbiAgZmlyc3Rfb3B0aW9uOiB1bmRlZmluZWQsXG4gIGRlZmF1bHRfdmFsdWU6IG51bGwsXG4gIGluaXRpYWxfbG9hZDogdHJ1ZSxcbiAgZW1wdHlfbWFyazogJ19fRU1QVFlfXycsXG4gIGhvb2tzOiB7XG4gICAgYmVmb3JlX3JlcXVlc3Q6IG5vcGUsXG4gICAgYWZ0ZXJfcmVxdWVzdDogbm9wZVxuICB9XG59O1xuXG50eXBlIExpc3RJdGVtcyA9IFJlY29yZDxzdHJpbmcsIGFueT5bXTtcbnR5cGUgTWF5YmVHcm91cGVkTGlzdEl0ZW1zID0gUmVjb3JkPHN0cmluZywgTGlzdEl0ZW1zPiB8IExpc3RJdGVtcztcblxuZXhwb3J0IGNsYXNzIExpc3REZXBlbmRlbnQge1xuICBlbGVtZW50OiBIVE1MU2VsZWN0RWxlbWVudDtcbiAgZGVwZW5kZW50OiBIVE1MU2VsZWN0RWxlbWVudDtcbiAgb3B0aW9uczogTGlzdERlcGVuZGVudE9wdGlvbnM7XG4gIGFib3J0Q29udHJvbGxlcjogQWJvcnRDb250cm9sbGVyIHwgbnVsbCA9IG51bGw7XG5cbiAgc3RhdGljIGhhbmRsZShlbDogc3RyaW5nIHwgSFRNTFNlbGVjdEVsZW1lbnQsIGRlcGVuZGVudD86IHN0cmluZyB8IEhUTUxTZWxlY3RFbGVtZW50LCBvcHRpb25zOiBQYXJ0aWFsPExpc3REZXBlbmRlbnRPcHRpb25zPiA9IHt9KTogTGlzdERlcGVuZGVudCB7XG4gICAgcmV0dXJuIGdldEJvdW5kZWRJbnN0YW5jZShlbCwgJ2xpc3QtZGVwZW5kZW50JywgKCkgPT4ge1xuICAgICAgcmV0dXJuIG5ldyB0aGlzKGVsLCBkZXBlbmRlbnQsIG9wdGlvbnMpO1xuICAgIH0pO1xuICB9XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudDogc3RyaW5nIHwgSFRNTFNlbGVjdEVsZW1lbnQsIGRlcGVuZGVudD86IHN0cmluZyB8IEhUTUxTZWxlY3RFbGVtZW50LCBvcHRpb25zOiBQYXJ0aWFsPExpc3REZXBlbmRlbnRPcHRpb25zPiA9IHt9KSB7XG4gICAgdGhpcy5vcHRpb25zID0gdGhpcy5tZXJnZU9wdGlvbnMob3B0aW9ucyk7XG5cbiAgICB0aGlzLmVsZW1lbnQgPSBzZWxlY3RPbmU8SFRNTFNlbGVjdEVsZW1lbnQ+KGVsZW1lbnQpITtcblxuICAgIGlmICghZGVwZW5kZW50KSB7XG4gICAgICBkZXBlbmRlbnQgPSB0aGlzLmVsZW1lbnQuZGF0YXNldC5kZXBlbmRlbnQgfHwgJyc7XG4gICAgfVxuXG4gICAgdGhpcy5kZXBlbmRlbnQgPSBzZWxlY3RPbmU8SFRNTFNlbGVjdEVsZW1lbnQ+KGRlcGVuZGVudCkhO1xuXG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmluaXRpYWxfbG9hZCkge1xuICAgICAgdGhpcy5jaGFuZ2VMaXN0KHRoaXMuZGVwZW5kZW50LnZhbHVlLCB0cnVlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQmluZCBldmVudHMuXG4gICAqL1xuICBiaW5kRXZlbnRzKCkge1xuICAgIHRoaXMuZGVwZW5kZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChldmVudCkgPT4ge1xuICAgICAgdGhpcy5jaGFuZ2VMaXN0KChldmVudC5jdXJyZW50VGFyZ2V0IGFzIEhUTUxTZWxlY3RFbGVtZW50KT8udmFsdWUpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSB0aGUgbGlzdCBlbGVtZW50cy5cbiAgICpcbiAgICogQHBhcmFtIHsqfSAgICB2YWx1ZVxuICAgKiBAcGFyYW0ge2Jvb2x9IGluaXRpYWxcbiAgICovXG4gIGNoYW5nZUxpc3QodmFsdWU6IHN0cmluZywgaW5pdGlhbCA9IGZhbHNlKSB7XG4gICAgdmFsdWUgPSB2YWx1ZSB8fCB0aGlzLmRlcGVuZGVudC52YWx1ZTtcblxuICAgIC8vIEVtcHR5IG1hcmtcbiAgICBpZiAodmFsdWUgPT09ICcnKSB7XG4gICAgICB2YWx1ZSA9IHRoaXMub3B0aW9ucy5lbXB0eV9tYXJrO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9wdGlvbnMuYWpheC51cmwpIHtcbiAgICAgIHRoaXMuYWpheFVwZGF0ZSh2YWx1ZSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMuc291cmNlKSB7XG4gICAgICB0aGlzLnNvdXJjZVVwZGF0ZSh2YWx1ZSwgaW5pdGlhbCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBsaXN0IGJ5IHNvdXJjZS5cbiAgICovXG4gIHNvdXJjZVVwZGF0ZSh2YWx1ZTogc3RyaW5nLCBpbml0aWFsID0gZmFsc2UpIHtcbiAgICBjb25zdCBzb3VyY2UgPSB0aGlzLm9wdGlvbnMuc291cmNlO1xuXG4gICAgaWYgKCFzb3VyY2UpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmJlZm9yZUhvb2sodmFsdWUsIHRoaXMuZWxlbWVudCwgdGhpcy5kZXBlbmRlbnQpO1xuXG4gICAgaWYgKHNvdXJjZVt2YWx1ZV0pIHtcbiAgICAgIHRoaXMudXBkYXRlTGlzdEVsZW1lbnRzKHNvdXJjZVt2YWx1ZV0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnVwZGF0ZUxpc3RFbGVtZW50cyhbXSk7XG5cbiAgICAgIGlmICghaW5pdGlhbCAmJiB2YWx1ZSAhPT0gJycgJiYgcGFyc2VJbnQodmFsdWUpICE9PSAwKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdMaXN0IGZvciB2YWx1ZTogJyArIHZhbHVlICsgJyBub3QgZm91bmQuJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5hZnRlckhvb2sodmFsdWUsIHRoaXMuZWxlbWVudCwgdGhpcy5kZXBlbmRlbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIERvIGFqYXguXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxuICAgKi9cbiAgYXN5bmMgYWpheFVwZGF0ZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgbGV0IGRhdGE6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcblxuICAgIGRhdGFbdGhpcy5vcHRpb25zLmFqYXgudmFsdWVfZmllbGRdID0gdmFsdWU7XG5cbiAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5hamF4LmRhdGEgPT09ICdvYmplY3QnKSB7XG4gICAgICBkYXRhID0geyAuLi5kYXRhLCAuLi50aGlzLm9wdGlvbnMuYWpheC5kYXRhIH07XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLmFqYXguZGF0YSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgZGF0YSA9IHRoaXMub3B0aW9ucy5hamF4LmRhdGEoZGF0YSwgdGhpcykgfHwgZGF0YTtcbiAgICB9XG5cbiAgICB0aGlzLmJlZm9yZUhvb2sodmFsdWUsIHRoaXMuZWxlbWVudCwgdGhpcy5kZXBlbmRlbnQpO1xuXG4gICAgdGhpcy5hYm9ydCgpO1xuXG4gICAgbGV0IHVybCA9IHRoaXMub3B0aW9ucy5hamF4LnVybDtcblxuICAgIGlmICh0eXBlb2YgdXJsID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB1cmwgPSB1cmwodGhpcyk7XG4gICAgfVxuXG4gICAgaWYgKCF1cmwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQWpheCBVUkwgaXMgbm90IHNldC4nKTtcbiAgICB9XG5cbiAgICBjb25zdCBodHRwID0gYXdhaXQgdXNlSHR0cENsaWVudCgpO1xuXG4gICAgdGhpcy5hYm9ydENvbnRyb2xsZXIgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzID0gYXdhaXQgaHR0cC5nZXQ8e1xuICAgICAgICBzdWNjZXNzOiBib29sZWFuO1xuICAgICAgICBkYXRhOiBhbnk7XG4gICAgICB9Pih1cmwsIHtcbiAgICAgICAgcGFyYW1zOiBkYXRhLFxuICAgICAgICBzaWduYWw6IHRoaXMuYWJvcnRDb250cm9sbGVyLnNpZ25hbFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHsgc3VjY2VzcywgZGF0YTogcmV0dXJuRGF0YSB9ID0gcmVzLmRhdGE7XG5cbiAgICAgIGlmIChzdWNjZXNzKSB7XG4gICAgICAgIHRoaXMudXBkYXRlTGlzdEVsZW1lbnRzKHJldHVybkRhdGEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihyZXR1cm5EYXRhKTtcbiAgICAgIH1cblxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMuYWZ0ZXJIb29rKHZhbHVlLCB0aGlzLmVsZW1lbnQsIHRoaXMuZGVwZW5kZW50KTtcbiAgICAgIHRoaXMuYWJvcnRDb250cm9sbGVyID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBhYm9ydCgpIHtcbiAgICBpZiAodGhpcy5hYm9ydENvbnRyb2xsZXIpIHtcbiAgICAgIHRoaXMuYWJvcnRDb250cm9sbGVyLmFib3J0KCk7XG4gICAgICB0aGlzLmFib3J0Q29udHJvbGxlciA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlTGlzdEVsZW1lbnRzKGl0ZW1zOiBNYXliZUdyb3VwZWRMaXN0SXRlbXMpIHtcbiAgICBjb25zdCB0ZXh0RmllbGQgPSB0aGlzLm9wdGlvbnMudGV4dF9maWVsZDtcbiAgICBjb25zdCB2YWx1ZUZpZWxkID0gdGhpcy5vcHRpb25zLnZhbHVlX2ZpZWxkO1xuICAgIHRoaXMuZWxlbWVudC5pbm5lckhUTUwgPSAnJztcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuZmlyc3Rfb3B0aW9uICYmIEFycmF5LmlzQXJyYXkoaXRlbXMpKSB7XG4gICAgICBpdGVtcy51bnNoaWZ0KHt9KTtcbiAgICAgIGl0ZW1zWzBdW3RleHRGaWVsZF0gPSB0aGlzLm9wdGlvbnMuZmlyc3Rfb3B0aW9uW3RleHRGaWVsZF07XG4gICAgICBpdGVtc1swXVt2YWx1ZUZpZWxkXSA9IHRoaXMub3B0aW9ucy5maXJzdF9vcHRpb25bdmFsdWVGaWVsZF07XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBpIGluIGl0ZW1zKSB7XG4gICAgICBjb25zdCBpdGVtID0gaXRlbXNbaSBhcyBrZXlvZiB0eXBlb2YgaXRlbXNdIGFzIFJlY29yZDxzdHJpbmcsIGFueT4gfCBMaXN0SXRlbXM7XG5cbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGl0ZW0pKSB7XG4gICAgICAgIGNvbnN0IGdyb3VwID0gaHRtbChgPG9wdGdyb3VwIGxhYmVsPVwiJHtpfVwiPjwvb3B0Z3JvdXA+YCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBrIGluIGl0ZW0pIHtcbiAgICAgICAgICBjb25zdCBjaGlsZCA9IGl0ZW1ba107XG4gICAgICAgICAgdGhpcy5hcHBlbmRPcHRpb25Ubyh7XG4gICAgICAgICAgICB2YWx1ZTogY2hpbGRbdmFsdWVGaWVsZF0sXG4gICAgICAgICAgICB0ZXh0OiBjaGlsZFt0ZXh0RmllbGRdLFxuICAgICAgICAgICAgYXR0cmlidXRlczogY2hpbGQuYXR0cmlidXRlcyxcbiAgICAgICAgICB9LCBncm91cCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQoZ3JvdXApO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5hcHBlbmRPcHRpb25Ubyh7XG4gICAgICAgIHZhbHVlOiBpdGVtW3ZhbHVlRmllbGRdLFxuICAgICAgICB0ZXh0OiBpdGVtW3RleHRGaWVsZF0sXG4gICAgICAgIGF0dHJpYnV0ZXM6IGl0ZW0uYXR0cmlidXRlcyxcbiAgICAgIH0sIHRoaXMuZWxlbWVudCk7XG4gICAgfVxuXG4gICAgdGhpcy5lbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdjaGFuZ2UnKSk7XG4gICAgdGhpcy5lbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdsaXN0OnVwZGF0ZWQnKSk7XG4gIH1cblxuICBhcHBlbmRPcHRpb25UbyhpdGVtOiBhbnksIHBhcmVudDogYW55KSB7XG4gICAgY29uc3QgdmFsdWUgPSBpdGVtLnZhbHVlO1xuICAgIGNvbnN0IG9wdGlvbiA9IGh0bWwoJzxvcHRpb24+JyArIGl0ZW0udGV4dCArICc8L29wdGlvbj4nKTtcbiAgICBvcHRpb24uc2V0QXR0cmlidXRlKCd2YWx1ZScsIHZhbHVlKTtcblxuICAgIGlmIChpdGVtLmF0dHJpYnV0ZXMpIHtcbiAgICAgIGZvciAoY29uc3QgaW5kZXggaW4gaXRlbS5hdHRyaWJ1dGVzKSB7XG4gICAgICAgIGNvbnN0IHZhbCA9IGl0ZW0uYXR0cmlidXRlc1tpbmRleF07XG4gICAgICAgIG9wdGlvbi5zZXRBdHRyaWJ1dGUoaW5kZXgsIHZhbCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXNTZWxlY3RlZCh2YWx1ZSkpIHtcbiAgICAgIG9wdGlvbi5zZXRBdHRyaWJ1dGUoJ3NlbGVjdGVkJywgJ3NlbGVjdGVkJyk7XG4gICAgfVxuXG4gICAgcGFyZW50LmFwcGVuZENoaWxkKG9wdGlvbik7XG4gIH1cblxuICBpc1NlbGVjdGVkKHZhbHVlOiBzdHJpbmcpIHtcbiAgICBsZXQgZGVmYXVsdFZhbHVlczogYW55W10gPSBbXTtcblxuICAgIC8vIENvbnZlcnQgYWxsIHR5cGVzIHRvIGFycmF5XG4gICAgbGV0IGRlZlZhbHVlID0gdGhpcy5lbGVtZW50LmRhdGFzZXQuc2VsZWN0ZWQgPz8gdGhpcy5vcHRpb25zLmRlZmF1bHRfdmFsdWU7XG5cbiAgICBpZiAodHlwZW9mIGRlZlZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBkZWZWYWx1ZSA9IGRlZlZhbHVlKHZhbHVlLCB0aGlzKTtcbiAgICB9XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShkZWZWYWx1ZSkpIHtcbiAgICAgIGRlZmF1bHRWYWx1ZXMgPSBkZWZWYWx1ZTtcbiAgICB9IGVsc2UgaWYgKGRlZlZhbHVlICYmIHR5cGVvZiBkZWZWYWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGRlZmF1bHRWYWx1ZXMgPSBPYmplY3Qua2V5cyhkZWZWYWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlZmF1bHRWYWx1ZXMgPSBbZGVmVmFsdWVdO1xuICAgIH1cblxuICAgIHJldHVybiBkZWZhdWx0VmFsdWVzLmluZGV4T2YodmFsdWUpICE9PSAtMTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCZWZvcmUgaG9vay5cbiAgICovXG4gIGJlZm9yZUhvb2sodmFsdWU6IHN0cmluZywgZWxlbWVudDogSFRNTFNlbGVjdEVsZW1lbnQsIGRlcGVuZGVudDogSFRNTFNlbGVjdEVsZW1lbnQpIHtcbiAgICBjb25zdCBiZWZvcmUgPSB0aGlzLm9wdGlvbnMuaG9va3MuYmVmb3JlX3JlcXVlc3Q7XG5cbiAgICByZXR1cm4gYmVmb3JlLmNhbGwodGhpcywgdmFsdWUsIGVsZW1lbnQsIGRlcGVuZGVudCk7XG4gIH1cblxuICAvKipcbiAgICogQWZ0ZXIgaG9vay5cbiAgICovXG4gIGFmdGVySG9vayh2YWx1ZTogc3RyaW5nLCBlbGVtZW50OiBIVE1MU2VsZWN0RWxlbWVudCwgZGVwZW5kZW50OiBIVE1MU2VsZWN0RWxlbWVudCkge1xuICAgIGNvbnN0IGFmdGVyID0gdGhpcy5vcHRpb25zLmhvb2tzLmFmdGVyX3JlcXVlc3Q7XG5cbiAgICByZXR1cm4gYWZ0ZXIuY2FsbCh0aGlzLCB2YWx1ZSwgZWxlbWVudCwgZGVwZW5kZW50KTtcbiAgfVxuXG4gIG1lcmdlT3B0aW9ucyhvcHRpb25zOiBQYXJ0aWFsPExpc3REZXBlbmRlbnRPcHRpb25zPik6IExpc3REZXBlbmRlbnRPcHRpb25zIHtcbiAgICByZXR1cm4gbWVyZ2VEZWVwPExpc3REZXBlbmRlbnRPcHRpb25zPih7fSwgZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCByZWFkeSA9IHVzZVVuaURpcmVjdGl2ZTxIVE1MU2VsZWN0RWxlbWVudD4oJ2xpc3QtZGVwZW5kZW50Jywge1xuICBtb3VudGVkKGVsLCBiaW5kaW5nKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IEpTT04ucGFyc2UoYmluZGluZy52YWx1ZSk7XG5cbiAgICBMaXN0RGVwZW5kZW50LmhhbmRsZShlbCwgb3B0aW9ucy5kZXBlbmRlbnQsIG9wdGlvbnMpO1xuICB9LFxuICB1cGRhdGVkKGVsLCBiaW5kaW5nKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IEpTT04ucGFyc2UoYmluZGluZy52YWx1ZSk7XG5cbiAgICBMaXN0RGVwZW5kZW50LmhhbmRsZShlbCkubWVyZ2VPcHRpb25zKG9wdGlvbnMpO1xuICB9XG59KTtcblxuZXhwb3J0IHR5cGUgTGlzdERlcGVuZGVudE1vZHVsZSA9IHtcbiAgTGlzdERlcGVuZGVudDogdHlwZW9mIExpc3REZXBlbmRlbnQ7XG4gIHJlYWR5OiB0eXBlb2YgcmVhZHk7XG59O1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFNQSxNQUFNLE9BQU8sTUFBTTtBQUFDO0FBcUJwQixNQUFNLGlCQUF1QztBQUFBLEVBQzNDLE1BQU07QUFBQSxJQUNKLEtBQUs7QUFBQSxJQUNMLGFBQWE7QUFBQSxJQUNiLE1BQU0sQ0FBQTtBQUFBLEVBQUM7QUFBQSxFQUVULFFBQVE7QUFBQSxFQUNSLFlBQVk7QUFBQSxFQUNaLGFBQWE7QUFBQSxFQUNiLGNBQWM7QUFBQSxFQUNkLGVBQWU7QUFBQSxFQUNmLGNBQWM7QUFBQSxFQUNkLFlBQVk7QUFBQSxFQUNaLE9BQU87QUFBQSxJQUNMLGdCQUFnQjtBQUFBLElBQ2hCLGVBQWU7QUFBQSxFQUFBO0FBRW5CO0FBS08sTUFB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
