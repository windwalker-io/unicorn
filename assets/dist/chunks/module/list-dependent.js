import { u as useUniDirective } from "../composable/useUniDirective.js";
import { g as getBoundedInstance, s as selectOne, c as html } from "../service/dom.js";
import { u as useHttpClient } from "../composable/useHttp.js";
import { m as mergeDeep } from "../utilities/arr.js";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC1kZXBlbmRlbnQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tb2R1bGUvbGlzdC1kZXBlbmRlbnQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXHJcbmltcG9ydCB0eXBlIHsgQ2FuY2VsVG9rZW5Tb3VyY2UgfSBmcm9tICdheGlvcyc7XHJcbmltcG9ydCB7IHVzZUh0dHBDbGllbnQsIHVzZVVuaURpcmVjdGl2ZSB9IGZyb20gJy4uL2NvbXBvc2FibGUnO1xyXG5pbXBvcnQgeyBnZXRCb3VuZGVkSW5zdGFuY2UsIGh0bWwsIHNlbGVjdE9uZSB9IGZyb20gJy4uL3NlcnZpY2UnO1xyXG5pbXBvcnQgeyBtZXJnZURlZXAgfSBmcm9tICcuLi91dGlsaXRpZXMnO1xyXG5cclxuY29uc3Qgbm9wZSA9ICgpID0+IHt9O1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBMaXN0RGVwZW5kZW50T3B0aW9ucyB7XHJcbiAgYWpheDoge1xyXG4gICAgdXJsOiBzdHJpbmcgfCBudWxsIHwgKChzZWxmOiBMaXN0RGVwZW5kZW50KSA9PiBzdHJpbmcpO1xyXG4gICAgdmFsdWVfZmllbGQ6IHN0cmluZztcclxuICAgIGRhdGE6IFJlY29yZDxzdHJpbmcsIGFueT4gfCAoKGRhdGE6IFJlY29yZDxzdHJpbmcsIGFueT4sIHNlbGY6IExpc3REZXBlbmRlbnQpID0+IFJlY29yZDxzdHJpbmcsIGFueT4pO1xyXG4gIH07XHJcbiAgc291cmNlPzogUmVjb3JkPHN0cmluZywgYW55PjtcclxuICB0ZXh0X2ZpZWxkOiBzdHJpbmc7XHJcbiAgdmFsdWVfZmllbGQ6IHN0cmluZztcclxuICBmaXJzdF9vcHRpb24/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xyXG4gIGRlZmF1bHRfdmFsdWU6IGFueTtcclxuICBpbml0aWFsX2xvYWQ6IGJvb2xlYW47XHJcbiAgZW1wdHlfbWFyazogc3RyaW5nO1xyXG4gIGhvb2tzOiB7XHJcbiAgICBiZWZvcmVfcmVxdWVzdDogKHZhbHVlOiBhbnksIGVsZW1lbnQ6IEhUTUxTZWxlY3RFbGVtZW50LCBkZXBlbmRlbnQ6IEhUTUxTZWxlY3RFbGVtZW50KSA9PiBhbnk7XHJcbiAgICBhZnRlcl9yZXF1ZXN0OiAodmFsdWU6IGFueSwgZWxlbWVudDogSFRNTFNlbGVjdEVsZW1lbnQsIGRlcGVuZGVudDogSFRNTFNlbGVjdEVsZW1lbnQpID0+IGFueTtcclxuICB9O1xyXG59XHJcblxyXG5jb25zdCBkZWZhdWx0T3B0aW9uczogTGlzdERlcGVuZGVudE9wdGlvbnMgPSB7XHJcbiAgYWpheDoge1xyXG4gICAgdXJsOiBudWxsLFxyXG4gICAgdmFsdWVfZmllbGQ6ICd2YWx1ZScsXHJcbiAgICBkYXRhOiB7fSxcclxuICB9LFxyXG4gIHNvdXJjZTogdW5kZWZpbmVkLFxyXG4gIHRleHRfZmllbGQ6ICd0aXRsZScsXHJcbiAgdmFsdWVfZmllbGQ6ICdpZCcsXHJcbiAgZmlyc3Rfb3B0aW9uOiB1bmRlZmluZWQsXHJcbiAgZGVmYXVsdF92YWx1ZTogbnVsbCxcclxuICBpbml0aWFsX2xvYWQ6IHRydWUsXHJcbiAgZW1wdHlfbWFyazogJ19fRU1QVFlfXycsXHJcbiAgaG9va3M6IHtcclxuICAgIGJlZm9yZV9yZXF1ZXN0OiBub3BlLFxyXG4gICAgYWZ0ZXJfcmVxdWVzdDogbm9wZVxyXG4gIH1cclxufTtcclxuXHJcbnR5cGUgTGlzdEl0ZW1zID0gUmVjb3JkPHN0cmluZywgYW55PltdO1xyXG50eXBlIE1heWJlR3JvdXBlZExpc3RJdGVtcyA9IFJlY29yZDxzdHJpbmcsIExpc3RJdGVtcz4gfCBMaXN0SXRlbXM7XHJcblxyXG5leHBvcnQgY2xhc3MgTGlzdERlcGVuZGVudCB7XHJcbiAgZWxlbWVudDogSFRNTFNlbGVjdEVsZW1lbnQ7XHJcbiAgZGVwZW5kZW50OiBIVE1MU2VsZWN0RWxlbWVudDtcclxuICBvcHRpb25zOiBMaXN0RGVwZW5kZW50T3B0aW9ucztcclxuICBhYm9ydENvbnRyb2xsZXI6IEFib3J0Q29udHJvbGxlciB8IG51bGwgPSBudWxsO1xyXG5cclxuICBzdGF0aWMgaGFuZGxlKGVsOiBzdHJpbmcgfCBIVE1MU2VsZWN0RWxlbWVudCwgZGVwZW5kZW50Pzogc3RyaW5nIHwgSFRNTFNlbGVjdEVsZW1lbnQsIG9wdGlvbnM6IFBhcnRpYWw8TGlzdERlcGVuZGVudE9wdGlvbnM+ID0ge30pOiBMaXN0RGVwZW5kZW50IHtcclxuICAgIHJldHVybiBnZXRCb3VuZGVkSW5zdGFuY2UoZWwsICdsaXN0LWRlcGVuZGVudCcsICgpID0+IHtcclxuICAgICAgcmV0dXJuIG5ldyB0aGlzKGVsLCBkZXBlbmRlbnQsIG9wdGlvbnMpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3RvcihlbGVtZW50OiBzdHJpbmcgfCBIVE1MU2VsZWN0RWxlbWVudCwgZGVwZW5kZW50Pzogc3RyaW5nIHwgSFRNTFNlbGVjdEVsZW1lbnQsIG9wdGlvbnM6IFBhcnRpYWw8TGlzdERlcGVuZGVudE9wdGlvbnM+ID0ge30pIHtcclxuICAgIHRoaXMub3B0aW9ucyA9IHRoaXMubWVyZ2VPcHRpb25zKG9wdGlvbnMpO1xyXG5cclxuICAgIHRoaXMuZWxlbWVudCA9IHNlbGVjdE9uZTxIVE1MU2VsZWN0RWxlbWVudD4oZWxlbWVudCkhO1xyXG5cclxuICAgIGlmICghZGVwZW5kZW50KSB7XHJcbiAgICAgIGRlcGVuZGVudCA9IHRoaXMuZWxlbWVudC5kYXRhc2V0LmRlcGVuZGVudCB8fCAnJztcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmRlcGVuZGVudCA9IHNlbGVjdE9uZTxIVE1MU2VsZWN0RWxlbWVudD4oZGVwZW5kZW50KSE7XHJcblxyXG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XHJcblxyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5pbml0aWFsX2xvYWQpIHtcclxuICAgICAgdGhpcy5jaGFuZ2VMaXN0KHRoaXMuZGVwZW5kZW50LnZhbHVlLCB0cnVlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEJpbmQgZXZlbnRzLlxyXG4gICAqL1xyXG4gIGJpbmRFdmVudHMoKSB7XHJcbiAgICB0aGlzLmRlcGVuZGVudC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZXZlbnQpID0+IHtcclxuICAgICAgdGhpcy5jaGFuZ2VMaXN0KChldmVudC5jdXJyZW50VGFyZ2V0IGFzIEhUTUxTZWxlY3RFbGVtZW50KT8udmFsdWUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBVcGRhdGUgdGhlIGxpc3QgZWxlbWVudHMuXHJcbiAgICpcclxuICAgKiBAcGFyYW0geyp9ICAgIHZhbHVlXHJcbiAgICogQHBhcmFtIHtib29sfSBpbml0aWFsXHJcbiAgICovXHJcbiAgY2hhbmdlTGlzdCh2YWx1ZTogc3RyaW5nLCBpbml0aWFsID0gZmFsc2UpIHtcclxuICAgIHZhbHVlID0gdmFsdWUgfHwgdGhpcy5kZXBlbmRlbnQudmFsdWU7XHJcblxyXG4gICAgLy8gRW1wdHkgbWFya1xyXG4gICAgaWYgKHZhbHVlID09PSAnJykge1xyXG4gICAgICB2YWx1ZSA9IHRoaXMub3B0aW9ucy5lbXB0eV9tYXJrO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLm9wdGlvbnMuYWpheC51cmwpIHtcclxuICAgICAgdGhpcy5hamF4VXBkYXRlKHZhbHVlKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLnNvdXJjZSkge1xyXG4gICAgICB0aGlzLnNvdXJjZVVwZGF0ZSh2YWx1ZSwgaW5pdGlhbCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBVcGRhdGUgbGlzdCBieSBzb3VyY2UuXHJcbiAgICovXHJcbiAgc291cmNlVXBkYXRlKHZhbHVlOiBzdHJpbmcsIGluaXRpYWwgPSBmYWxzZSkge1xyXG4gICAgY29uc3Qgc291cmNlID0gdGhpcy5vcHRpb25zLnNvdXJjZTtcclxuXHJcbiAgICBpZiAoIXNvdXJjZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5iZWZvcmVIb29rKHZhbHVlLCB0aGlzLmVsZW1lbnQsIHRoaXMuZGVwZW5kZW50KTtcclxuXHJcbiAgICBpZiAoc291cmNlW3ZhbHVlXSkge1xyXG4gICAgICB0aGlzLnVwZGF0ZUxpc3RFbGVtZW50cyhzb3VyY2VbdmFsdWVdKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMudXBkYXRlTGlzdEVsZW1lbnRzKFtdKTtcclxuXHJcbiAgICAgIGlmICghaW5pdGlhbCAmJiB2YWx1ZSAhPT0gJycgJiYgcGFyc2VJbnQodmFsdWUpICE9PSAwKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ0xpc3QgZm9yIHZhbHVlOiAnICsgdmFsdWUgKyAnIG5vdCBmb3VuZC4nKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuYWZ0ZXJIb29rKHZhbHVlLCB0aGlzLmVsZW1lbnQsIHRoaXMuZGVwZW5kZW50KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIERvIGFqYXguXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcclxuICAgKi9cclxuICBhc3luYyBhamF4VXBkYXRlKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgIGxldCBkYXRhOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XHJcblxyXG4gICAgZGF0YVt0aGlzLm9wdGlvbnMuYWpheC52YWx1ZV9maWVsZF0gPSB2YWx1ZTtcclxuXHJcbiAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5hamF4LmRhdGEgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgIGRhdGEgPSB7IC4uLmRhdGEsIC4uLnRoaXMub3B0aW9ucy5hamF4LmRhdGEgfTtcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5hamF4LmRhdGEgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgZGF0YSA9IHRoaXMub3B0aW9ucy5hamF4LmRhdGEoZGF0YSwgdGhpcykgfHwgZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmJlZm9yZUhvb2sodmFsdWUsIHRoaXMuZWxlbWVudCwgdGhpcy5kZXBlbmRlbnQpO1xyXG5cclxuICAgIHRoaXMuYWJvcnQoKTtcclxuXHJcbiAgICBsZXQgdXJsID0gdGhpcy5vcHRpb25zLmFqYXgudXJsO1xyXG5cclxuICAgIGlmICh0eXBlb2YgdXJsID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgIHVybCA9IHVybCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXVybCkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FqYXggVVJMIGlzIG5vdCBzZXQuJyk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgaHR0cCA9IGF3YWl0IHVzZUh0dHBDbGllbnQoKTtcclxuXHJcbiAgICB0aGlzLmFib3J0Q29udHJvbGxlciA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCByZXMgPSBhd2FpdCBodHRwLmdldDx7XHJcbiAgICAgICAgc3VjY2VzczogYm9vbGVhbjtcclxuICAgICAgICBkYXRhOiBhbnk7XHJcbiAgICAgIH0+KHVybCwge1xyXG4gICAgICAgIHBhcmFtczogZGF0YSxcclxuICAgICAgICBzaWduYWw6IHRoaXMuYWJvcnRDb250cm9sbGVyLnNpZ25hbFxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGNvbnN0IHsgc3VjY2VzcywgZGF0YTogcmV0dXJuRGF0YSB9ID0gcmVzLmRhdGE7XHJcblxyXG4gICAgICBpZiAoc3VjY2Vzcykge1xyXG4gICAgICAgIHRoaXMudXBkYXRlTGlzdEVsZW1lbnRzKHJldHVybkRhdGEpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IocmV0dXJuRGF0YSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICB0aGlzLmFmdGVySG9vayh2YWx1ZSwgdGhpcy5lbGVtZW50LCB0aGlzLmRlcGVuZGVudCk7XHJcbiAgICAgIHRoaXMuYWJvcnRDb250cm9sbGVyID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFib3J0KCkge1xyXG4gICAgaWYgKHRoaXMuYWJvcnRDb250cm9sbGVyKSB7XHJcbiAgICAgIHRoaXMuYWJvcnRDb250cm9sbGVyLmFib3J0KCk7XHJcbiAgICAgIHRoaXMuYWJvcnRDb250cm9sbGVyID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHVwZGF0ZUxpc3RFbGVtZW50cyhpdGVtczogTWF5YmVHcm91cGVkTGlzdEl0ZW1zKSB7XHJcbiAgICBjb25zdCB0ZXh0RmllbGQgPSB0aGlzLm9wdGlvbnMudGV4dF9maWVsZDtcclxuICAgIGNvbnN0IHZhbHVlRmllbGQgPSB0aGlzLm9wdGlvbnMudmFsdWVfZmllbGQ7XHJcbiAgICB0aGlzLmVsZW1lbnQuaW5uZXJIVE1MID0gJyc7XHJcblxyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5maXJzdF9vcHRpb24gJiYgQXJyYXkuaXNBcnJheShpdGVtcykpIHtcclxuICAgICAgaXRlbXMudW5zaGlmdCh7fSk7XHJcbiAgICAgIGl0ZW1zWzBdW3RleHRGaWVsZF0gPSB0aGlzLm9wdGlvbnMuZmlyc3Rfb3B0aW9uW3RleHRGaWVsZF07XHJcbiAgICAgIGl0ZW1zWzBdW3ZhbHVlRmllbGRdID0gdGhpcy5vcHRpb25zLmZpcnN0X29wdGlvblt2YWx1ZUZpZWxkXTtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGNvbnN0IGkgaW4gaXRlbXMpIHtcclxuICAgICAgY29uc3QgaXRlbSA9IGl0ZW1zW2kgYXMga2V5b2YgdHlwZW9mIGl0ZW1zXSBhcyBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgTGlzdEl0ZW1zO1xyXG5cclxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaXRlbSkpIHtcclxuICAgICAgICBjb25zdCBncm91cCA9IGh0bWwoYDxvcHRncm91cCBsYWJlbD1cIiR7aX1cIj48L29wdGdyb3VwPmApO1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IGsgaW4gaXRlbSkge1xyXG4gICAgICAgICAgY29uc3QgY2hpbGQgPSBpdGVtW2tdO1xyXG4gICAgICAgICAgdGhpcy5hcHBlbmRPcHRpb25Ubyh7XHJcbiAgICAgICAgICAgIHZhbHVlOiBjaGlsZFt2YWx1ZUZpZWxkXSxcclxuICAgICAgICAgICAgdGV4dDogY2hpbGRbdGV4dEZpZWxkXSxcclxuICAgICAgICAgICAgYXR0cmlidXRlczogY2hpbGQuYXR0cmlidXRlcyxcclxuICAgICAgICAgIH0sIGdyb3VwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChncm91cCk7XHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuYXBwZW5kT3B0aW9uVG8oe1xyXG4gICAgICAgIHZhbHVlOiBpdGVtW3ZhbHVlRmllbGRdLFxyXG4gICAgICAgIHRleHQ6IGl0ZW1bdGV4dEZpZWxkXSxcclxuICAgICAgICBhdHRyaWJ1dGVzOiBpdGVtLmF0dHJpYnV0ZXMsXHJcbiAgICAgIH0sIHRoaXMuZWxlbWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5lbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdjaGFuZ2UnKSk7XHJcbiAgICB0aGlzLmVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2xpc3Q6dXBkYXRlZCcpKTtcclxuICB9XHJcblxyXG4gIGFwcGVuZE9wdGlvblRvKGl0ZW06IGFueSwgcGFyZW50OiBhbnkpIHtcclxuICAgIGNvbnN0IHZhbHVlID0gaXRlbS52YWx1ZTtcclxuICAgIGNvbnN0IG9wdGlvbiA9IGh0bWwoJzxvcHRpb24+JyArIGl0ZW0udGV4dCArICc8L29wdGlvbj4nKTtcclxuICAgIG9wdGlvbi5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgdmFsdWUpO1xyXG5cclxuICAgIGlmIChpdGVtLmF0dHJpYnV0ZXMpIHtcclxuICAgICAgZm9yIChjb25zdCBpbmRleCBpbiBpdGVtLmF0dHJpYnV0ZXMpIHtcclxuICAgICAgICBjb25zdCB2YWwgPSBpdGVtLmF0dHJpYnV0ZXNbaW5kZXhdO1xyXG4gICAgICAgIG9wdGlvbi5zZXRBdHRyaWJ1dGUoaW5kZXgsIHZhbCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5pc1NlbGVjdGVkKHZhbHVlKSkge1xyXG4gICAgICBvcHRpb24uc2V0QXR0cmlidXRlKCdzZWxlY3RlZCcsICdzZWxlY3RlZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIHBhcmVudC5hcHBlbmRDaGlsZChvcHRpb24pO1xyXG4gIH1cclxuXHJcbiAgaXNTZWxlY3RlZCh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICBsZXQgZGVmYXVsdFZhbHVlczogYW55W10gPSBbXTtcclxuXHJcbiAgICAvLyBDb252ZXJ0IGFsbCB0eXBlcyB0byBhcnJheVxyXG4gICAgbGV0IGRlZlZhbHVlID0gdGhpcy5lbGVtZW50LmRhdGFzZXQuc2VsZWN0ZWQgPz8gdGhpcy5vcHRpb25zLmRlZmF1bHRfdmFsdWU7XHJcblxyXG4gICAgaWYgKHR5cGVvZiBkZWZWYWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICBkZWZWYWx1ZSA9IGRlZlZhbHVlKHZhbHVlLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoQXJyYXkuaXNBcnJheShkZWZWYWx1ZSkpIHtcclxuICAgICAgZGVmYXVsdFZhbHVlcyA9IGRlZlZhbHVlO1xyXG4gICAgfSBlbHNlIGlmIChkZWZWYWx1ZSAmJiB0eXBlb2YgZGVmVmFsdWUgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgIGRlZmF1bHRWYWx1ZXMgPSBPYmplY3Qua2V5cyhkZWZWYWx1ZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkZWZhdWx0VmFsdWVzID0gW2RlZlZhbHVlXTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZGVmYXVsdFZhbHVlcy5pbmRleE9mKHZhbHVlKSAhPT0gLTE7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBCZWZvcmUgaG9vay5cclxuICAgKi9cclxuICBiZWZvcmVIb29rKHZhbHVlOiBzdHJpbmcsIGVsZW1lbnQ6IEhUTUxTZWxlY3RFbGVtZW50LCBkZXBlbmRlbnQ6IEhUTUxTZWxlY3RFbGVtZW50KSB7XHJcbiAgICBjb25zdCBiZWZvcmUgPSB0aGlzLm9wdGlvbnMuaG9va3MuYmVmb3JlX3JlcXVlc3Q7XHJcblxyXG4gICAgcmV0dXJuIGJlZm9yZS5jYWxsKHRoaXMsIHZhbHVlLCBlbGVtZW50LCBkZXBlbmRlbnQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQWZ0ZXIgaG9vay5cclxuICAgKi9cclxuICBhZnRlckhvb2sodmFsdWU6IHN0cmluZywgZWxlbWVudDogSFRNTFNlbGVjdEVsZW1lbnQsIGRlcGVuZGVudDogSFRNTFNlbGVjdEVsZW1lbnQpIHtcclxuICAgIGNvbnN0IGFmdGVyID0gdGhpcy5vcHRpb25zLmhvb2tzLmFmdGVyX3JlcXVlc3Q7XHJcblxyXG4gICAgcmV0dXJuIGFmdGVyLmNhbGwodGhpcywgdmFsdWUsIGVsZW1lbnQsIGRlcGVuZGVudCk7XHJcbiAgfVxyXG5cclxuICBtZXJnZU9wdGlvbnMob3B0aW9uczogUGFydGlhbDxMaXN0RGVwZW5kZW50T3B0aW9ucz4pOiBMaXN0RGVwZW5kZW50T3B0aW9ucyB7XHJcbiAgICByZXR1cm4gbWVyZ2VEZWVwPExpc3REZXBlbmRlbnRPcHRpb25zPih7fSwgZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHJlYWR5ID0gdXNlVW5pRGlyZWN0aXZlPEhUTUxTZWxlY3RFbGVtZW50PignbGlzdC1kZXBlbmRlbnQnLCB7XHJcbiAgbW91bnRlZChlbCwgYmluZGluZykge1xyXG4gICAgY29uc3Qgb3B0aW9ucyA9IEpTT04ucGFyc2UoYmluZGluZy52YWx1ZSk7XHJcblxyXG4gICAgTGlzdERlcGVuZGVudC5oYW5kbGUoZWwsIG9wdGlvbnMuZGVwZW5kZW50LCBvcHRpb25zKTtcclxuICB9LFxyXG4gIHVwZGF0ZWQoZWwsIGJpbmRpbmcpIHtcclxuICAgIGNvbnN0IG9wdGlvbnMgPSBKU09OLnBhcnNlKGJpbmRpbmcudmFsdWUpO1xyXG5cclxuICAgIExpc3REZXBlbmRlbnQuaGFuZGxlKGVsKS5tZXJnZU9wdGlvbnMob3B0aW9ucyk7XHJcbiAgfVxyXG59KTtcclxuXHJcbmV4cG9ydCB0eXBlIExpc3REZXBlbmRlbnRNb2R1bGUgPSB7XHJcbiAgTGlzdERlcGVuZGVudDogdHlwZW9mIExpc3REZXBlbmRlbnQ7XHJcbiAgcmVhZHk6IHR5cGVvZiByZWFkeTtcclxufTtcclxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFNQSxNQUFNLE9BQU8sTUFBTTtBQUFDO0FBcUJwQixNQUFNLGlCQUF1QztBQUFBLEVBQzNDLE1BQU07QUFBQSxJQUNKLEtBQUs7QUFBQSxJQUNMLGFBQWE7QUFBQSxJQUNiLE1BQU0sQ0FBQTtBQUFBLEVBQUM7QUFBQSxFQUVULFFBQVE7QUFBQSxFQUNSLFlBQVk7QUFBQSxFQUNaLGFBQWE7QUFBQSxFQUNiLGNBQWM7QUFBQSxFQUNkLGVBQWU7QUFBQSxFQUNmLGNBQWM7QUFBQSxFQUNkLFlBQVk7QUFBQSxFQUNaLE9BQU87QUFBQSxJQUNMLGdCQUFnQjtBQUFBLElBQ2hCLGVBQWU7QUFBQSxFQUFBO0FBRW5CO0FBS08sTUFBTSxjQUFjO0FBQUEsRUFDekI7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0Esa0JBQTBDO0FBQUEsRUFFMUMsT0FBTyxPQUFPLElBQWdDLFdBQXdDLFVBQXlDLENBQUEsR0FBbUI7QUFDaEosV0FBTyxtQkFBbUIsSUFBSSxrQkFBa0IsTUFBTTtBQUNwRCxhQUFPLElBQUksS0FBSyxJQUFJLFdBQVcsT0FBTztBQUFBLElBQ3hDLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFFQSxZQUFZLFNBQXFDLFdBQXdDLFVBQXlDLENBQUEsR0FBSTtBQUNwSSxTQUFLLFVBQVUs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
