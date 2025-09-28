import { g as getDefaultExportFromCjs } from "./_commonjsHelpers-CUmg6egw.js";
import { p as prepareAlpineDefer, i as initAlpineComponent, m as mergeDeep, u as uid, b as module, c as useLoadedHttpClient } from "./unicorn-x6CrrtPV.js";
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
