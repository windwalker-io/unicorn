import { g as getDefaultExportFromCjs } from "./_commonjsHelpers-CUmg6egw.js";
import { p as prepareAlpineDefer, i as initAlpineComponent, m as mergeDeep, u as uid, b as module, c as useLoadedHttpClient } from "./unicorn-DR9JpPYO.js";
var alpineComponent = {};
var hasRequiredAlpineComponent;
function requireAlpineComponent() {
  if (hasRequiredAlpineComponent) return alpineComponent;
  hasRequiredAlpineComponent = 1;
  Object.defineProperty(alpineComponent, "__esModule", { value: true });
  class AlpineComponent2 {
  }
  alpineComponent.default = AlpineComponent2;
  return alpineComponent;
}
var alpineComponentExports = /* @__PURE__ */ requireAlpineComponent();
const AlpineComponent = /* @__PURE__ */ getDefaultExportFromCjs(alpineComponentExports);
var component = {};
var hasRequiredComponent;
function requireComponent() {
  if (hasRequiredComponent) return component;
  hasRequiredComponent = 1;
  Object.defineProperty(component, "__esModule", { value: true });
  function Component2(component2) {
    return function(...args) {
      let instance = new component2(...args);
      const proto = component2.prototype;
      let data = {};
      Object.getOwnPropertyNames(proto).forEach(function(key) {
        if (key === "constructor") {
          return;
        }
        const descriptor = Object.getOwnPropertyDescriptor(proto, key);
        if (descriptor.value !== void 0) {
          if (typeof descriptor.value === "function") {
            data[key] = descriptor.value;
          }
        } else if (descriptor.get || descriptor.set) {
          Object.defineProperty(data, key, { get: descriptor.get, set: descriptor.set });
        }
      });
      return Object.assign(data, instance);
    };
  }
  component.default = Component2;
  return component;
}
var componentExports = /* @__PURE__ */ requireComponent();
const Component = /* @__PURE__ */ getDefaultExportFromCjs(componentExports);
var __getOwnPropDesc = /* @__PURE__ */ (() => Object.getOwnPropertyDescriptor)();
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = decorator(result) || result;
  return result;
};
const defaultOptions = {
  id: "",
  selected: "",
  path: [],
  ignoreSelf: null,
  placeholder: "- Select -",
  placeholders: [],
  ajaxUrl: "",
  ajaxValueField: "value",
  source: [],
  labels: [],
  labelWidth: "col-md-3",
  fieldWidth: "col",
  readonly: false,
  disabled: false,
  valueField: "id",
  textField: "title",
  horizontal: null,
  horizontalColWidth: null,
  defaultValue: "",
  onSelectInit: () => {
  },
  onChange: () => {
  },
  onValueInit: () => {
  }
};
let FieldCascadeSelect = class extends AlpineComponent {
  options;
  el;
  canModify = false;
  lists = [];
  ajaxUrl = "";
  values = [];
  constructor(options = {}) {
    super();
    this.options = mergeDeep({}, defaultOptions, options);
    this.options.id = this.options.id || "cascade-select-" + uid();
  }
  init() {
    this.canModify = !this.options.readonly && !this.options.disabled;
    this.ajaxUrl = this.options.ajaxUrl;
    this.values = this.options.path.slice().map(String);
    let values = this.options.path.slice();
    if (values.length === 0) {
      values = [null];
    } else {
      values.unshift(null);
    }
    let promise = Promise.resolve();
    let lastValue = null;
    values.forEach((v, i) => {
      promise = promise.then(() => {
        return this.loadItems(v, i).then((list) => {
          if (list.length > 0) {
            this.lists.push(list);
          }
        });
      });
      lastValue = v;
    });
    this.el = this.$el;
    module(this.$el, "cascade.select", () => this);
    this.valueInit(this.$el, lastValue, values);
  }
  getLabel(i) {
    return this.options.labels[i] || `Level ${i + 1}`;
  }
  getId(i) {
    return `${this.options.id}__level-${i}`;
  }
  getListValue(i) {
    return this.values[i] || "";
  }
  isSelected(i, item) {
    return String(this.getListValue(i)) === String(item[this.options.valueField]);
  }
  getFinalValue() {
    const values = this.values.slice();
    if (values.length === 0) {
      return this.options.defaultValue;
    }
    const v = values.filter((v2) => v2 != null).filter((v2) => v2 !== "").pop();
    if (v == void 0) {
      return this.options.defaultValue;
    }
    return v;
  }
  getLevel() {
    return this.values.length;
  }
  async onChange(i, event) {
    const el = event.target;
    this.values[i] = el.value;
    this.options.onChange(event);
    event.stopPropagation();
    const changeEvent = new CustomEvent("change", {
      detail: {
        el,
        component: this,
        value: el.value,
        path: this.values
      }
    });
    this.el?.dispatchEvent(changeEvent);
    if (el.value === "") {
      this.lists.splice(i + 1);
      this.values.splice(i + 1);
      return;
    }
    let list = await this.loadItems(el.value, i);
    this.lists.splice(i + 1);
    this.values.splice(i + 1);
    if (list.length > 0) {
      this.lists.push(list);
    }
  }
  async loadItems(parentId, i) {
    if (this.ajaxUrl) {
      const http = await useLoadedHttpClient();
      let res = await http.get(
        this.ajaxUrl,
        {
          params: {
            [this.options.ajaxValueField]: parentId,
            self: this.options.ignoreSelf || null
          }
        }
      );
      return await res.data.data;
    }
    if (parentId) {
      return Promise.resolve(
        this.handleSourceItems(
          this.findFromList(this.lists[i - 1] || [], parentId)?.children || []
        )
      );
    }
    return Promise.resolve(this.handleSourceItems(this.options.source));
  }
  valueInit($select, value, path) {
    const event = new CustomEvent("value.init", {
      detail: {
        el: $select,
        component: this,
        value,
        path
      }
    });
    this.options.onSelectInit(event);
    this.$el.dispatchEvent(event);
  }
  selectInit($select) {
    const event = new CustomEvent("select.init", {
      detail: {
        el: $select,
        component: this
      }
    });
    this.options.onSelectInit(event);
    this.$el.dispatchEvent(event);
  }
  handleSourceItems(items) {
    return items.map((item) => {
      return {
        [this.options.valueField]: item.value[this.options.valueField],
        [this.options.textField]: item.value[this.options.textField],
        children: item.children
      };
    }).filter((item) => {
      if (this.options.ignoreSelf) {
        return item[this.options.valueField] != this.options.ignoreSelf;
      }
      return item;
    });
  }
  findFromList(items, value) {
    const found = items.filter((item) => item[this.options.valueField] == value);
    return found.shift();
  }
  getPlaceholder(i) {
    if (this.options.placeholders[i]) {
      return this.options.placeholders[i];
    }
    return this.options.placeholder;
  }
};
FieldCascadeSelect = /* @__PURE__ */ __decorateClass([
  Component
], FieldCascadeSelect);
async function init() {
  await prepareAlpineDefer(() => {
    Alpine.data("CascadeSelect", (options) => new FieldCascadeSelect(options));
  });
  await initAlpineComponent("data-cascade-select");
}
const ready = /* @__PURE__ */ init();
export {
  ready
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGQtY2FzY2FkZS1zZWxlY3QtREdVTTRreUguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcnViZW5iaW1tZWwvYWxwaW5lLWNsYXNzLWNvbXBvbmVudC9kaXN0L2FscGluZUNvbXBvbmVudC5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcnViZW5iaW1tZWwvYWxwaW5lLWNsYXNzLWNvbXBvbmVudC9kaXN0L2RlY29yYXRvcnMvY29tcG9uZW50LmpzIiwiLi4vLi4vc3JjL21vZHVsZS9maWVsZC1jYXNjYWRlLXNlbGVjdC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jbGFzcyBBbHBpbmVDb21wb25lbnQge1xyXG59XHJcbmV4cG9ydHMuZGVmYXVsdCA9IEFscGluZUNvbXBvbmVudDtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZnVuY3Rpb24gQ29tcG9uZW50KGNvbXBvbmVudCkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICguLi5hcmdzKSB7XHJcbiAgICAgICAgbGV0IGluc3RhbmNlID0gbmV3IGNvbXBvbmVudCguLi5hcmdzKTtcclxuICAgICAgICBjb25zdCBwcm90byA9IGNvbXBvbmVudC5wcm90b3R5cGU7XHJcbiAgICAgICAgbGV0IGRhdGEgPSB7fTtcclxuICAgICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhwcm90bykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgIGlmIChrZXkgPT09ICdjb25zdHJ1Y3RvcicpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihwcm90bywga2V5KTtcclxuICAgICAgICAgICAgaWYgKGRlc2NyaXB0b3IudmFsdWUgIT09IHZvaWQgMCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBkZXNjcmlwdG9yLnZhbHVlID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YVtrZXldID0gZGVzY3JpcHRvci52YWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChkZXNjcmlwdG9yLmdldCB8fCBkZXNjcmlwdG9yLnNldCkge1xyXG4gICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGRhdGEsIGtleSwgeyBnZXQ6IGRlc2NyaXB0b3IuZ2V0LCBzZXQ6IGRlc2NyaXB0b3Iuc2V0IH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oZGF0YSwgaW5zdGFuY2UpO1xyXG4gICAgfTtcclxufVxyXG5leHBvcnRzLmRlZmF1bHQgPSBDb21wb25lbnQ7XHJcbiIsIlxuaW1wb3J0IHsgdXNlTG9hZGVkSHR0cENsaWVudCB9IGZyb20gJy4uL2NvbXBvc2FibGUnO1xuaW1wb3J0IHsgbG9hZEFscGluZSwgbW9kdWxlLCB1aWQsIHByZXBhcmVBbHBpbmVEZWZlciwgaW5pdEFscGluZUNvbXBvbmVudCB9IGZyb20gJy4uL3NlcnZpY2UnO1xuaW1wb3J0IHsgbWVyZ2VEZWVwIH0gZnJvbSAnLi4vdXRpbGl0aWVzJztcbmltcG9ydCBBbHBpbmVDb21wb25lbnQgZnJvbSAnQHJ1YmVuYmltbWVsL2FscGluZS1jbGFzcy1jb21wb25lbnQvZGlzdC9hbHBpbmVDb21wb25lbnQnO1xuaW1wb3J0IENvbXBvbmVudCBmcm9tICdAcnViZW5iaW1tZWwvYWxwaW5lLWNsYXNzLWNvbXBvbmVudC9kaXN0L2RlY29yYXRvcnMvY29tcG9uZW50JztcblxuaW50ZXJmYWNlIENhc2NhZGVTZWxlY3RPcHRpb25zIHtcbiAgaWQ6IHN0cmluZztcbiAgc2VsZWN0ZWQ6IHN0cmluZztcbiAgcGF0aDogc3RyaW5nW107XG4gIGlnbm9yZVNlbGY6IGJvb2xlYW4gfCBudWxsO1xuICBwbGFjZWhvbGRlcjogc3RyaW5nO1xuICBwbGFjZWhvbGRlcnM6IHN0cmluZ1tdO1xuICBhamF4VXJsOiBzdHJpbmc7XG4gIGFqYXhWYWx1ZUZpZWxkOiBzdHJpbmc7XG4gIHNvdXJjZTogc3RyaW5nW107XG4gIGxhYmVsczogc3RyaW5nW107XG4gIGxhYmVsV2lkdGg6IHN0cmluZztcbiAgZmllbGRXaWR0aDogc3RyaW5nO1xuICByZWFkb25seTogYm9vbGVhbjtcbiAgZGlzYWJsZWQ6IGJvb2xlYW47XG4gIHZhbHVlRmllbGQ6IHN0cmluZztcbiAgdGV4dEZpZWxkOiBzdHJpbmc7XG4gIGhvcml6b250YWw6IGJvb2xlYW4gfCBudWxsO1xuICBob3Jpem9udGFsQ29sV2lkdGg6IHN0cmluZyB8IG51bGw7XG4gIGRlZmF1bHRWYWx1ZTogc3RyaW5nO1xuICBvblNlbGVjdEluaXQ6IEZ1bmN0aW9uLFxuICBvbkNoYW5nZTogRnVuY3Rpb24sXG4gIG9uVmFsdWVJbml0OiBGdW5jdGlvbixcbn1cblxuY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XG4gIGlkOiAnJyxcbiAgc2VsZWN0ZWQ6ICcnLFxuICBwYXRoOiBbXSxcbiAgaWdub3JlU2VsZjogbnVsbCxcbiAgcGxhY2Vob2xkZXI6ICctIFNlbGVjdCAtJyxcbiAgcGxhY2Vob2xkZXJzOiBbXSxcbiAgYWpheFVybDogJycsXG4gIGFqYXhWYWx1ZUZpZWxkOiAndmFsdWUnLFxuICBzb3VyY2U6IFtdLFxuICBsYWJlbHM6IFtdLFxuICBsYWJlbFdpZHRoOiAnY29sLW1kLTMnLFxuICBmaWVsZFdpZHRoOiAnY29sJyxcbiAgcmVhZG9ubHk6IGZhbHNlLFxuICBkaXNhYmxlZDogZmFsc2UsXG4gIHZhbHVlRmllbGQ6ICdpZCcsXG4gIHRleHRGaWVsZDogJ3RpdGxlJyxcbiAgaG9yaXpvbnRhbDogbnVsbCxcbiAgaG9yaXpvbnRhbENvbFdpZHRoOiBudWxsLFxuICBkZWZhdWx0VmFsdWU6ICcnLFxuICBvblNlbGVjdEluaXQ6ICgpID0+IHtcbiAgfSxcbiAgb25DaGFuZ2U6ICgpID0+IHtcbiAgfSxcbiAgb25WYWx1ZUluaXQ6ICgpID0+IHtcbiAgfSxcbn07XG5cbkBDb21wb25lbnRcbmNsYXNzIEZpZWxkQ2FzY2FkZVNlbGVjdCBleHRlbmRzIEFscGluZUNvbXBvbmVudCB7XG4gIG9wdGlvbnM6IENhc2NhZGVTZWxlY3RPcHRpb25zO1xuICBlbD86IEhUTUxFbGVtZW50O1xuICBjYW5Nb2RpZnk6IGJvb2xlYW4gPSBmYWxzZTtcbiAgbGlzdHM6IGFueVtdID0gW107XG4gIGFqYXhVcmw6IHN0cmluZyA9ICcnO1xuICB2YWx1ZXM6IEFycmF5PHN0cmluZyB8IG51bGw+ID0gW107XG5cbiAgY29uc3RydWN0b3Iob3B0aW9uczogUGFydGlhbDxDYXNjYWRlU2VsZWN0T3B0aW9ucz4gPSB7fSkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLm9wdGlvbnMgPSBtZXJnZURlZXAoe30sIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcblxuICAgIHRoaXMub3B0aW9ucy5pZCA9IHRoaXMub3B0aW9ucy5pZCB8fCAnY2FzY2FkZS1zZWxlY3QtJyArIHVpZCgpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLmNhbk1vZGlmeSA9ICF0aGlzLm9wdGlvbnMucmVhZG9ubHkgJiYgIXRoaXMub3B0aW9ucy5kaXNhYmxlZDtcbiAgICB0aGlzLmFqYXhVcmwgPSB0aGlzLm9wdGlvbnMuYWpheFVybDtcbiAgICB0aGlzLnZhbHVlcyA9IHRoaXMub3B0aW9ucy5wYXRoLnNsaWNlKCkubWFwKFN0cmluZyk7XG5cbiAgICBsZXQgdmFsdWVzOiBBcnJheTxzdHJpbmcgfCBudWxsPiA9IHRoaXMub3B0aW9ucy5wYXRoLnNsaWNlKCk7XG5cbiAgICBpZiAodmFsdWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdmFsdWVzID0gW251bGxdO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZXMudW5zaGlmdChudWxsKTtcbiAgICB9XG5cbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIGxldCBsYXN0VmFsdWU6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gICAgdmFsdWVzLmZvckVhY2goKHYsIGkpID0+IHtcbiAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2FkSXRlbXModiwgaSkudGhlbigobGlzdCkgPT4ge1xuICAgICAgICAgIGlmIChsaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMubGlzdHMucHVzaChsaXN0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIGxhc3RWYWx1ZSA9IHY7XG4gICAgfSk7XG5cbiAgICB0aGlzLmVsID0gdGhpcy4kZWw7XG5cbiAgICBtb2R1bGUodGhpcy4kZWwsICdjYXNjYWRlLnNlbGVjdCcsICgpID0+IHRoaXMpO1xuXG4gICAgdGhpcy52YWx1ZUluaXQodGhpcy4kZWwsIGxhc3RWYWx1ZSwgdmFsdWVzKTtcbiAgfVxuXG4gIGdldExhYmVsKGk6IG51bWJlcikge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnMubGFiZWxzW2ldIHx8IGBMZXZlbCAke2kgKyAxfWA7XG4gIH1cblxuICBnZXRJZChpOiBudW1iZXIpIHtcbiAgICByZXR1cm4gYCR7dGhpcy5vcHRpb25zLmlkfV9fbGV2ZWwtJHtpfWA7XG4gIH1cblxuICBnZXRMaXN0VmFsdWUoaTogbnVtYmVyKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWVzW2ldIHx8ICcnO1xuICB9XG5cbiAgaXNTZWxlY3RlZChpOiBudW1iZXIsIGl0ZW06IGFueSkge1xuICAgIHJldHVybiBTdHJpbmcodGhpcy5nZXRMaXN0VmFsdWUoaSkpID09PSBTdHJpbmcoaXRlbVt0aGlzLm9wdGlvbnMudmFsdWVGaWVsZF0pO1xuICB9XG5cbiAgZ2V0RmluYWxWYWx1ZSgpIHtcbiAgICBjb25zdCB2YWx1ZXMgPSB0aGlzLnZhbHVlcy5zbGljZSgpO1xuXG4gICAgaWYgKHZhbHVlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZGVmYXVsdFZhbHVlO1xuICAgIH1cblxuICAgIGNvbnN0IHYgPSB2YWx1ZXNcbiAgICAgIC5maWx0ZXIodiA9PiB2ICE9IG51bGwpXG4gICAgICAuZmlsdGVyKHYgPT4gdiAhPT0gJycpXG4gICAgICAucG9wKCk7XG5cbiAgICBpZiAodiA9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZGVmYXVsdFZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiB2O1xuICB9XG5cbiAgZ2V0TGV2ZWwoKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWVzLmxlbmd0aDtcbiAgfVxuXG4gIGFzeW5jIG9uQ2hhbmdlKGk6IG51bWJlciwgZXZlbnQ6IEV2ZW50KSB7XG4gICAgY29uc3QgZWwgPSBldmVudC50YXJnZXQgYXMgSFRNTFNlbGVjdEVsZW1lbnQ7XG5cbiAgICB0aGlzLnZhbHVlc1tpXSA9IGVsLnZhbHVlO1xuXG4gICAgdGhpcy5vcHRpb25zLm9uQ2hhbmdlKGV2ZW50KTtcblxuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgY29uc3QgY2hhbmdlRXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ2NoYW5nZScsIHtcbiAgICAgIGRldGFpbDoge1xuICAgICAgICBlbCxcbiAgICAgICAgY29tcG9uZW50OiB0aGlzLFxuICAgICAgICB2YWx1ZTogZWwudmFsdWUsXG4gICAgICAgIHBhdGg6IHRoaXMudmFsdWVzXG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLmVsPy5kaXNwYXRjaEV2ZW50KGNoYW5nZUV2ZW50KTtcblxuICAgIGlmIChlbC52YWx1ZSA9PT0gJycpIHtcbiAgICAgIC8vIENsZWFyIGNoaWxkXG4gICAgICB0aGlzLmxpc3RzLnNwbGljZShpICsgMSk7XG4gICAgICB0aGlzLnZhbHVlcy5zcGxpY2UoaSArIDEpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEdldCBjaGlsZCBsaXN0XG4gICAgbGV0IGxpc3QgPSBhd2FpdCB0aGlzLmxvYWRJdGVtcyhlbC52YWx1ZSwgaSk7XG4gICAgdGhpcy5saXN0cy5zcGxpY2UoaSArIDEpO1xuICAgIHRoaXMudmFsdWVzLnNwbGljZShpICsgMSk7XG4gICAgaWYgKGxpc3QubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5saXN0cy5wdXNoKGxpc3QpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGxvYWRJdGVtcyhwYXJlbnRJZDogc3RyaW5nIHwgbnVsbCwgaTogbnVtYmVyKSB7XG4gICAgLy8gQWpheFxuICAgIGlmICh0aGlzLmFqYXhVcmwpIHtcbiAgICAgIGNvbnN0IGh0dHAgPSBhd2FpdCB1c2VMb2FkZWRIdHRwQ2xpZW50KCk7XG5cbiAgICAgIGxldCByZXMgPSBhd2FpdCBodHRwLmdldChcbiAgICAgICAgdGhpcy5hamF4VXJsLFxuICAgICAgICB7XG4gICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICBbdGhpcy5vcHRpb25zLmFqYXhWYWx1ZUZpZWxkXTogcGFyZW50SWQsXG4gICAgICAgICAgICBzZWxmOiB0aGlzLm9wdGlvbnMuaWdub3JlU2VsZiB8fCBudWxsXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICApO1xuICAgICAgcmV0dXJuIGF3YWl0IHJlcy5kYXRhLmRhdGE7XG4gICAgfVxuXG4gICAgLy8gU291cmNlXG4gICAgaWYgKHBhcmVudElkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFxuICAgICAgICB0aGlzLmhhbmRsZVNvdXJjZUl0ZW1zKFxuICAgICAgICAgIHRoaXMuZmluZEZyb21MaXN0KHRoaXMubGlzdHNbaSAtIDFdIHx8IFtdLCBwYXJlbnRJZCk/LmNoaWxkcmVuIHx8IFtdXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLmhhbmRsZVNvdXJjZUl0ZW1zKHRoaXMub3B0aW9ucy5zb3VyY2UpKTtcbiAgfVxuXG4gIHZhbHVlSW5pdCgkc2VsZWN0OiBIVE1MRWxlbWVudCwgdmFsdWU6IHN0cmluZyB8IG51bGwsIHBhdGg6IEFycmF5PHN0cmluZyB8IG51bGw+KSB7XG4gICAgY29uc3QgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ3ZhbHVlLmluaXQnLCB7XG4gICAgICBkZXRhaWw6IHtcbiAgICAgICAgZWw6ICRzZWxlY3QsXG4gICAgICAgIGNvbXBvbmVudDogdGhpcyxcbiAgICAgICAgdmFsdWUsXG4gICAgICAgIHBhdGhcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMub3B0aW9ucy5vblNlbGVjdEluaXQoZXZlbnQpO1xuXG4gICAgdGhpcy4kZWwuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gIH1cblxuICBzZWxlY3RJbml0KCRzZWxlY3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ3NlbGVjdC5pbml0Jywge1xuICAgICAgZGV0YWlsOiB7XG4gICAgICAgIGVsOiAkc2VsZWN0LFxuICAgICAgICBjb21wb25lbnQ6IHRoaXMsXG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLm9wdGlvbnMub25TZWxlY3RJbml0KGV2ZW50KTtcblxuICAgIHRoaXMuJGVsLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICB9XG5cbiAgaGFuZGxlU291cmNlSXRlbXMoaXRlbXM6IGFueVtdKSB7XG4gICAgcmV0dXJuIGl0ZW1zLm1hcChpdGVtID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIFt0aGlzLm9wdGlvbnMudmFsdWVGaWVsZF06IGl0ZW0udmFsdWVbdGhpcy5vcHRpb25zLnZhbHVlRmllbGRdLFxuICAgICAgICBbdGhpcy5vcHRpb25zLnRleHRGaWVsZF06IGl0ZW0udmFsdWVbdGhpcy5vcHRpb25zLnRleHRGaWVsZF0sXG4gICAgICAgIGNoaWxkcmVuOiBpdGVtLmNoaWxkcmVuXG4gICAgICB9O1xuICAgIH0pXG4gICAgICAuZmlsdGVyKGl0ZW0gPT4ge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmlnbm9yZVNlbGYpIHtcbiAgICAgICAgICByZXR1cm4gaXRlbVt0aGlzLm9wdGlvbnMudmFsdWVGaWVsZF0gIT0gdGhpcy5vcHRpb25zLmlnbm9yZVNlbGY7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgIH0pO1xuICB9XG5cbiAgZmluZEZyb21MaXN0KGl0ZW1zOiBhbnlbXSwgdmFsdWU6IHN0cmluZykge1xuICAgIGNvbnN0IGZvdW5kID0gaXRlbXMuZmlsdGVyKGl0ZW0gPT4gaXRlbVt0aGlzLm9wdGlvbnMudmFsdWVGaWVsZF0gPT0gdmFsdWUpO1xuXG4gICAgcmV0dXJuIGZvdW5kLnNoaWZ0KCk7XG4gIH1cblxuICBnZXRQbGFjZWhvbGRlcihpOiBudW1iZXIpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLnBsYWNlaG9sZGVyc1tpXSkge1xuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5wbGFjZWhvbGRlcnNbaV07XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy5wbGFjZWhvbGRlcjtcbiAgfVxufVxuXG5kZWNsYXJlIGdsb2JhbCB7XG4gIHZhciBTOiBhbnk7XG59XG5cblxuXG5hc3luYyBmdW5jdGlvbiBpbml0KCkge1xuICBhd2FpdCBwcmVwYXJlQWxwaW5lRGVmZXIoKCkgPT4ge1xuICAgIEFscGluZS5kYXRhKCdDYXNjYWRlU2VsZWN0JywgKG9wdGlvbnM6IENhc2NhZGVTZWxlY3RPcHRpb25zKSA9PiBuZXcgRmllbGRDYXNjYWRlU2VsZWN0KG9wdGlvbnMpKTtcbiAgfSk7XG4gIFxuICBhd2FpdCBpbml0QWxwaW5lQ29tcG9uZW50KCdkYXRhLWNhc2NhZGUtc2VsZWN0Jyk7XG59XG5cbmV4cG9ydCBjb25zdCByZWFkeSA9IGluaXQoKTtcblxuZXhwb3J0IGludGVyZmFjZSBDYXNjYWRlU2VsZWN0TW9kdWxlIHtcbiAgcmVhZHk6IHR5cGVvZiByZWFkeTtcbn1cbiJdLCJuYW1lcyI6WyJBbHBpbmVDb21wb25lbnQiLCJDb21wb25lbnQiLCJjb21wb25lbnQiLCJ2Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0EsU0FBTyxlQUFlLGlCQUFTLGNBQWMsRUFBRSxPQUFPLEtBQUksQ0FBRTtBQUFBLEVBQzVELE1BQU1BLGlCQUFnQjtBQUFBO0FBRXRCLGtCQUFBLFVBQWtCQTs7Ozs7Ozs7OztBQ0hsQixTQUFPLGVBQWUsV0FBUyxjQUFjLEVBQUUsT0FBTyxLQUFJLENBQUU7QUFDNUQsV0FBU0MsV0FBVUMsWUFBVztBQUMxQixXQUFPLFlBQWEsTUFBTTtBQUN0QixVQUFJLFdBQVcsSUFBSUEsV0FBVSxHQUFHLElBQUk7QUFDcEMsWUFBTSxRQUFRQSxXQUFVO0FBQ3hCLFVBQUksT0FBTyxDQUFBO0FBQ1gsYUFBTyxvQkFBb0IsS0FBSyxFQUFFLFFBQVEsU0FBVSxLQUFLO0FBQ3JELFlBQUksUUFBUSxlQUFlO0FBQ3ZCO0FBQUEsUUFDaEI7QUFDWSxjQUFNLGFBQWEsT0FBTyx5QkFBeUIsT0FBTyxHQUFHO0FBQzdELFlBQUksV0FBVyxVQUFVLFFBQVE7QUFDN0IsY0FBSSxPQUFPLFdBQVcsVUFBVSxZQUFZO0FBQ3hDLGlCQUFLLEdBQUcsSUFBSSxXQUFXO0FBQUEsVUFDM0M7QUFBQSxRQUNBLFdBQ3FCLFdBQVcsT0FBTyxXQUFXLEtBQUs7QUFDdkMsaUJBQU8sZUFBZSxNQUFNLEtBQUssRUFBRSxLQUFLLFdBQVcsS0FBSyxLQUFLLFdBQVcsSUFBRyxDQUFFO0FBQUEsUUFDN0Y7QUFBQSxNQUNBLENBQVM7QUFDRCxhQUFPLE9BQU8sT0FBTyxNQUFNLFFBQVE7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
