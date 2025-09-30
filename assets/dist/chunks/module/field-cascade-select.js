import { g as getDefaultExportFromCjs } from "../legacy/legacy.js";
import { q as prepareAlpineDefer, i as initAlpineComponent } from "../service/ui.js";
import { d as uid } from "../composable/useQueue.js";
import { a as useLoadedHttpClient } from "../composable/useHttp.js";
import { m as mergeDeep } from "../utilities/arr.js";
import { m as module } from "../service/dom.js";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGQtY2FzY2FkZS1zZWxlY3QuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcnViZW5iaW1tZWwvYWxwaW5lLWNsYXNzLWNvbXBvbmVudC9kaXN0L2FscGluZUNvbXBvbmVudC5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcnViZW5iaW1tZWwvYWxwaW5lLWNsYXNzLWNvbXBvbmVudC9kaXN0L2RlY29yYXRvcnMvY29tcG9uZW50LmpzIiwiLi4vLi4vLi4vc3JjL21vZHVsZS9maWVsZC1jYXNjYWRlLXNlbGVjdC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jbGFzcyBBbHBpbmVDb21wb25lbnQge1xyXG59XHJcbmV4cG9ydHMuZGVmYXVsdCA9IEFscGluZUNvbXBvbmVudDtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZnVuY3Rpb24gQ29tcG9uZW50KGNvbXBvbmVudCkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICguLi5hcmdzKSB7XHJcbiAgICAgICAgbGV0IGluc3RhbmNlID0gbmV3IGNvbXBvbmVudCguLi5hcmdzKTtcclxuICAgICAgICBjb25zdCBwcm90byA9IGNvbXBvbmVudC5wcm90b3R5cGU7XHJcbiAgICAgICAgbGV0IGRhdGEgPSB7fTtcclxuICAgICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhwcm90bykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgIGlmIChrZXkgPT09ICdjb25zdHJ1Y3RvcicpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihwcm90bywga2V5KTtcclxuICAgICAgICAgICAgaWYgKGRlc2NyaXB0b3IudmFsdWUgIT09IHZvaWQgMCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBkZXNjcmlwdG9yLnZhbHVlID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YVtrZXldID0gZGVzY3JpcHRvci52YWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChkZXNjcmlwdG9yLmdldCB8fCBkZXNjcmlwdG9yLnNldCkge1xyXG4gICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGRhdGEsIGtleSwgeyBnZXQ6IGRlc2NyaXB0b3IuZ2V0LCBzZXQ6IGRlc2NyaXB0b3Iuc2V0IH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oZGF0YSwgaW5zdGFuY2UpO1xyXG4gICAgfTtcclxufVxyXG5leHBvcnRzLmRlZmF1bHQgPSBDb21wb25lbnQ7XHJcbiIsIlxyXG5pbXBvcnQgeyB1c2VMb2FkZWRIdHRwQ2xpZW50IH0gZnJvbSAnLi4vY29tcG9zYWJsZSc7XHJcbmltcG9ydCB7IGxvYWRBbHBpbmUsIG1vZHVsZSwgdWlkLCBwcmVwYXJlQWxwaW5lRGVmZXIsIGluaXRBbHBpbmVDb21wb25lbnQgfSBmcm9tICcuLi9zZXJ2aWNlJztcclxuaW1wb3J0IHsgbWVyZ2VEZWVwIH0gZnJvbSAnLi4vdXRpbGl0aWVzJztcclxuaW1wb3J0IEFscGluZUNvbXBvbmVudCBmcm9tICdAcnViZW5iaW1tZWwvYWxwaW5lLWNsYXNzLWNvbXBvbmVudC9kaXN0L2FscGluZUNvbXBvbmVudCc7XHJcbmltcG9ydCBDb21wb25lbnQgZnJvbSAnQHJ1YmVuYmltbWVsL2FscGluZS1jbGFzcy1jb21wb25lbnQvZGlzdC9kZWNvcmF0b3JzL2NvbXBvbmVudCc7XHJcblxyXG5pbnRlcmZhY2UgQ2FzY2FkZVNlbGVjdE9wdGlvbnMge1xyXG4gIGlkOiBzdHJpbmc7XHJcbiAgc2VsZWN0ZWQ6IHN0cmluZztcclxuICBwYXRoOiBzdHJpbmdbXTtcclxuICBpZ25vcmVTZWxmOiBib29sZWFuIHwgbnVsbDtcclxuICBwbGFjZWhvbGRlcjogc3RyaW5nO1xyXG4gIHBsYWNlaG9sZGVyczogc3RyaW5nW107XHJcbiAgYWpheFVybDogc3RyaW5nO1xyXG4gIGFqYXhWYWx1ZUZpZWxkOiBzdHJpbmc7XHJcbiAgc291cmNlOiBzdHJpbmdbXTtcclxuICBsYWJlbHM6IHN0cmluZ1tdO1xyXG4gIGxhYmVsV2lkdGg6IHN0cmluZztcclxuICBmaWVsZFdpZHRoOiBzdHJpbmc7XHJcbiAgcmVhZG9ubHk6IGJvb2xlYW47XHJcbiAgZGlzYWJsZWQ6IGJvb2xlYW47XHJcbiAgdmFsdWVGaWVsZDogc3RyaW5nO1xyXG4gIHRleHRGaWVsZDogc3RyaW5nO1xyXG4gIGhvcml6b250YWw6IGJvb2xlYW4gfCBudWxsO1xyXG4gIGhvcml6b250YWxDb2xXaWR0aDogc3RyaW5nIHwgbnVsbDtcclxuICBkZWZhdWx0VmFsdWU6IHN0cmluZztcclxuICBvblNlbGVjdEluaXQ6IEZ1bmN0aW9uLFxyXG4gIG9uQ2hhbmdlOiBGdW5jdGlvbixcclxuICBvblZhbHVlSW5pdDogRnVuY3Rpb24sXHJcbn1cclxuXHJcbmNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xyXG4gIGlkOiAnJyxcclxuICBzZWxlY3RlZDogJycsXHJcbiAgcGF0aDogW10sXHJcbiAgaWdub3JlU2VsZjogbnVsbCxcclxuICBwbGFjZWhvbGRlcjogJy0gU2VsZWN0IC0nLFxyXG4gIHBsYWNlaG9sZGVyczogW10sXHJcbiAgYWpheFVybDogJycsXHJcbiAgYWpheFZhbHVlRmllbGQ6ICd2YWx1ZScsXHJcbiAgc291cmNlOiBbXSxcclxuICBsYWJlbHM6IFtdLFxyXG4gIGxhYmVsV2lkdGg6ICdjb2wtbWQtMycsXHJcbiAgZmllbGRXaWR0aDogJ2NvbCcsXHJcbiAgcmVhZG9ubHk6IGZhbHNlLFxyXG4gIGRpc2FibGVkOiBmYWxzZSxcclxuICB2YWx1ZUZpZWxkOiAnaWQnLFxyXG4gIHRleHRGaWVsZDogJ3RpdGxlJyxcclxuICBob3Jpem9udGFsOiBudWxsLFxyXG4gIGhvcml6b250YWxDb2xXaWR0aDogbnVsbCxcclxuICBkZWZhdWx0VmFsdWU6ICcnLFxyXG4gIG9uU2VsZWN0SW5pdDogKCkgPT4ge1xyXG4gIH0sXHJcbiAgb25DaGFuZ2U6ICgpID0+IHtcclxuICB9LFxyXG4gIG9uVmFsdWVJbml0OiAoKSA9PiB7XHJcbiAgfSxcclxufTtcclxuXHJcbkBDb21wb25lbnRcclxuY2xhc3MgRmllbGRDYXNjYWRlU2VsZWN0IGV4dGVuZHMgQWxwaW5lQ29tcG9uZW50IHtcclxuICBvcHRpb25zOiBDYXNjYWRlU2VsZWN0T3B0aW9ucztcclxuICBlbD86IEhUTUxFbGVtZW50O1xyXG4gIGNhbk1vZGlmeTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIGxpc3RzOiBhbnlbXSA9IFtdO1xyXG4gIGFqYXhVcmw6IHN0cmluZyA9ICcnO1xyXG4gIHZhbHVlczogQXJyYXk8c3RyaW5nIHwgbnVsbD4gPSBbXTtcclxuXHJcbiAgY29uc3RydWN0b3Iob3B0aW9uczogUGFydGlhbDxDYXNjYWRlU2VsZWN0T3B0aW9ucz4gPSB7fSkge1xyXG4gICAgc3VwZXIoKTtcclxuXHJcbiAgICB0aGlzLm9wdGlvbnMgPSBtZXJnZURlZXAoe30sIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcclxuXHJcbiAgICB0aGlzLm9wdGlvbnMuaWQgPSB0aGlzLm9wdGlvbnMuaWQgfHwgJ2Nhc2NhZGUtc2VsZWN0LScgKyB1aWQoKTtcclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICB0aGlzLmNhbk1vZGlmeSA9ICF0aGlzLm9wdGlvbnMucmVhZG9ubHkgJiYgIXRoaXMub3B0aW9ucy5kaXNhYmxlZDtcclxuICAgIHRoaXMuYWpheFVybCA9IHRoaXMub3B0aW9ucy5hamF4VXJsO1xyXG4gICAgdGhpcy52YWx1ZXMgPSB0aGlzLm9wdGlvbnMucGF0aC5zbGljZSgpLm1hcChTdHJpbmcpO1xyXG5cclxuICAgIGxldCB2YWx1ZXM6IEFycmF5PHN0cmluZyB8IG51bGw+ID0gdGhpcy5vcHRpb25zLnBhdGguc2xpY2UoKTtcclxuXHJcbiAgICBpZiAodmFsdWVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICB2YWx1ZXMgPSBbbnVsbF07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YWx1ZXMudW5zaGlmdChudWxsKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgbGV0IGxhc3RWYWx1ZTogc3RyaW5nIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgdmFsdWVzLmZvckVhY2goKHYsIGkpID0+IHtcclxuICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubG9hZEl0ZW1zKHYsIGkpLnRoZW4oKGxpc3QpID0+IHtcclxuICAgICAgICAgIGlmIChsaXN0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5saXN0cy5wdXNoKGxpc3QpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGxhc3RWYWx1ZSA9IHY7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmVsID0gdGhpcy4kZWw7XHJcblxyXG4gICAgbW9kdWxlKHRoaXMuJGVsLCAnY2FzY2FkZS5zZWxlY3QnLCAoKSA9PiB0aGlzKTtcclxuXHJcbiAgICB0aGlzLnZhbHVlSW5pdCh0aGlzLiRlbCwgbGFzdFZhbHVlLCB2YWx1ZXMpO1xyXG4gIH1cclxuXHJcbiAgZ2V0TGFiZWwoaTogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLmxhYmVsc1tpXSB8fCBgTGV2ZWwgJHtpICsgMX1gO1xyXG4gIH1cclxuXHJcbiAgZ2V0SWQoaTogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gYCR7dGhpcy5vcHRpb25zLmlkfV9fbGV2ZWwtJHtpfWA7XHJcbiAgfVxyXG5cclxuICBnZXRMaXN0VmFsdWUoaTogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gdGhpcy52YWx1ZXNbaV0gfHwgJyc7XHJcbiAgfVxyXG5cclxuICBpc1NlbGVjdGVkKGk6IG51bWJlciwgaXRlbTogYW55KSB7XHJcbiAgICByZXR1cm4gU3RyaW5nKHRoaXMuZ2V0TGlzdFZhbHVlKGkpKSA9PT0gU3RyaW5nKGl0ZW1bdGhpcy5vcHRpb25zLnZhbHVlRmllbGRdKTtcclxuICB9XHJcblxyXG4gIGdldEZpbmFsVmFsdWUoKSB7XHJcbiAgICBjb25zdCB2YWx1ZXMgPSB0aGlzLnZhbHVlcy5zbGljZSgpO1xyXG5cclxuICAgIGlmICh2YWx1ZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZGVmYXVsdFZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHYgPSB2YWx1ZXNcclxuICAgICAgLmZpbHRlcih2ID0+IHYgIT0gbnVsbClcclxuICAgICAgLmZpbHRlcih2ID0+IHYgIT09ICcnKVxyXG4gICAgICAucG9wKCk7XHJcblxyXG4gICAgaWYgKHYgPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZGVmYXVsdFZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB2O1xyXG4gIH1cclxuXHJcbiAgZ2V0TGV2ZWwoKSB7XHJcbiAgICByZXR1cm4gdGhpcy52YWx1ZXMubGVuZ3RoO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgb25DaGFuZ2UoaTogbnVtYmVyLCBldmVudDogRXZlbnQpIHtcclxuICAgIGNvbnN0IGVsID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxTZWxlY3RFbGVtZW50O1xyXG5cclxuICAgIHRoaXMudmFsdWVzW2ldID0gZWwudmFsdWU7XHJcblxyXG4gICAgdGhpcy5vcHRpb25zLm9uQ2hhbmdlKGV2ZW50KTtcclxuXHJcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICBjb25zdCBjaGFuZ2VFdmVudCA9IG5ldyBDdXN0b21FdmVudCgnY2hhbmdlJywge1xyXG4gICAgICBkZXRhaWw6IHtcclxuICAgICAgICBlbCxcclxuICAgICAgICBjb21wb25lbnQ6IHRoaXMsXHJcbiAgICAgICAgdmFsdWU6IGVsLnZhbHVlLFxyXG4gICAgICAgIHBhdGg6IHRoaXMudmFsdWVzXHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuZWw/LmRpc3BhdGNoRXZlbnQoY2hhbmdlRXZlbnQpO1xyXG5cclxuICAgIGlmIChlbC52YWx1ZSA9PT0gJycpIHtcclxuICAgICAgLy8gQ2xlYXIgY2hpbGRcclxuICAgICAgdGhpcy5saXN0cy5zcGxpY2UoaSArIDEpO1xyXG4gICAgICB0aGlzLnZhbHVlcy5zcGxpY2UoaSArIDEpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gR2V0IGNoaWxkIGxpc3RcclxuICAgIGxldCBsaXN0ID0gYXdhaXQgdGhpcy5sb2FkSXRlbXMoZWwudmFsdWUsIGkpO1xyXG4gICAgdGhpcy5saXN0cy5zcGxpY2UoaSArIDEpO1xyXG4gICAgdGhpcy52YWx1ZXMuc3BsaWNlKGkgKyAxKTtcclxuICAgIGlmIChsaXN0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgdGhpcy5saXN0cy5wdXNoKGxpc3QpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgbG9hZEl0ZW1zKHBhcmVudElkOiBzdHJpbmcgfCBudWxsLCBpOiBudW1iZXIpIHtcclxuICAgIC8vIEFqYXhcclxuICAgIGlmICh0aGlzLmFqYXhVcmwpIHtcclxuICAgICAgY29uc3QgaHR0cCA9IGF3YWl0IHVzZUxvYWRlZEh0dHBDbGllbnQoKTtcclxuXHJcbiAgICAgIGxldCByZXMgPSBhd2FpdCBodHRwLmdldChcclxuICAgICAgICB0aGlzLmFqYXhVcmwsXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgICAgIFt0aGlzLm9wdGlvbnMuYWpheFZhbHVlRmllbGRdOiBwYXJlbnRJZCxcclxuICAgICAgICAgICAgc2VsZjogdGhpcy5vcHRpb25zLmlnbm9yZVNlbGYgfHwgbnVsbFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgKTtcclxuICAgICAgcmV0dXJuIGF3YWl0IHJlcy5kYXRhLmRhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gU291cmNlXHJcbiAgICBpZiAocGFyZW50SWQpIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShcclxuICAgICAgICB0aGlzLmhhbmRsZVNvdXJjZUl0ZW1zKFxyXG4gICAgICAgICAgdGhpcy5maW5kRnJvbUxpc3QodGhpcy5saXN0c1tpIC0gMV0gfHwgW10sIHBhcmVudElkKT8uY2hpbGRyZW4gfHwgW11cclxuICAgICAgICApXHJcbiAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLmhhbmRsZVNvdXJjZUl0ZW1zKHRoaXMub3B0aW9ucy5zb3VyY2UpKTtcclxuICB9XHJcblxyXG4gIHZhbHVlSW5pdCgkc2VsZWN0OiBIVE1MRWxlbWVudCwgdmFsdWU6IHN0cmluZyB8IG51bGwsIHBhdGg6IEFycmF5PHN0cmluZyB8IG51bGw+KSB7XHJcbiAgICBjb25zdCBldmVudCA9IG5ldyBDdXN0b21FdmVudCgndmFsdWUuaW5pdCcsIHtcclxuICAgICAgZGV0YWlsOiB7XHJcbiAgICAgICAgZWw6ICRzZWxlY3QsXHJcbiAgICAgICAgY29tcG9uZW50OiB0aGlzLFxyXG4gICAgICAgIHZhbHVlLFxyXG4gICAgICAgIHBhdGhcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5vcHRpb25zLm9uU2VsZWN0SW5pdChldmVudCk7XHJcblxyXG4gICAgdGhpcy4kZWwuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbiAgfVxyXG5cclxuICBzZWxlY3RJbml0KCRzZWxlY3Q6IEhUTUxFbGVtZW50KSB7XHJcbiAgICBjb25zdCBldmVudCA9IG5ldyBDdXN0b21FdmVudCgnc2VsZWN0LmluaXQnLCB7XHJcbiAgICAgIGRldGFpbDoge1xyXG4gICAgICAgIGVsOiAkc2VsZWN0LFxyXG4gICAgICAgIGNvbXBvbmVudDogdGhpcyxcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5vcHRpb25zLm9uU2VsZWN0SW5pdChldmVudCk7XHJcblxyXG4gICAgdGhpcy4kZWwuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVTb3VyY2VJdGVtcyhpdGVtczogYW55W10pIHtcclxuICAgIHJldHVybiBpdGVtcy5tYXAoaXRlbSA9PiB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgW3RoaXMub3B0aW9ucy52YWx1ZUZpZWxkXTogaXRlbS52YWx1ZVt0aGlzLm9wdGlvbnMudmFsdWVGaWVsZF0sXHJcbiAgICAgICAgW3RoaXMub3B0aW9ucy50ZXh0RmllbGRdOiBpdGVtLnZhbHVlW3RoaXMub3B0aW9ucy50ZXh0RmllbGRdLFxyXG4gICAgICAgIGNoaWxkcmVuOiBpdGVtLmNoaWxkcmVuXHJcbiAgICAgIH07XHJcbiAgICB9KVxyXG4gICAgICAuZmlsdGVyKGl0ZW0gPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuaWdub3JlU2VsZikge1xyXG4gICAgICAgICAgcmV0dXJuIGl0ZW1bdGhpcy5vcHRpb25zLnZhbHVlRmllbGRdICE9IHRoaXMub3B0aW9ucy5pZ25vcmVTZWxmO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZmluZEZyb21MaXN0KGl0ZW1zOiBhbnlbXSwgdmFsdWU6IHN0cmluZykge1xyXG4gICAgY29uc3QgZm91bmQgPSBpdGVtcy5maWx0ZXIoaXRlbSA9PiBpdGVtW3RoaXMub3B0aW9ucy52YWx1ZUZpZWxkXSA9PSB2YWx1ZSk7XHJcblxyXG4gICAgcmV0dXJuIGZvdW5kLnNoaWZ0KCk7XHJcbiAgfVxyXG5cclxuICBnZXRQbGFjZWhvbGRlcihpOiBudW1iZXIpIHtcclxuICAgIGlmICh0aGlzLm9wdGlvbnMucGxhY2Vob2xkZXJzW2ldKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMucGxhY2Vob2xkZXJzW2ldO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLm9wdGlvbnMucGxhY2Vob2xkZXI7XHJcbiAgfVxyXG59XHJcblxyXG5kZWNsYXJlIGdsb2JhbCB7XHJcbiAgdmFyIFM6IGFueTtcclxufVxyXG5cclxuXHJcblxyXG5hc3luYyBmdW5jdGlvbiBpbml0KCkge1xyXG4gIGF3YWl0IHByZXBhcmVBbHBpbmVEZWZlcigoKSA9PiB7XHJcbiAgICBBbHBpbmUuZGF0YSgnQ2FzY2FkZVNlbGVjdCcsIChvcHRpb25zOiBDYXNjYWRlU2VsZWN0T3B0aW9ucykgPT4gbmV3IEZpZWxkQ2FzY2FkZVNlbGVjdChvcHRpb25zKSk7XHJcbiAgfSk7XHJcbiAgXHJcbiAgYXdhaXQgaW5pdEFscGluZUNvbXBvbmVudCgnZGF0YS1jYXNjYWRlLXNlbGVjdCcpO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgcmVhZHkgPSBpbml0KCk7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENhc2NhZGVTZWxlY3RNb2R1bGUge1xyXG4gIHJlYWR5OiB0eXBlb2YgcmVhZHk7XHJcbn1cclxuIl0sIm5hbWVzIjpbIkFscGluZUNvbXBvbmVudCIsIkNvbXBvbmVudCIsImNvbXBvbmVudCIsInYiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQ0EsU0FBTyxlQUFlLGlCQUFTLGNBQWMsRUFBRSxPQUFPLEtBQUksQ0FBRTtBQUFB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
