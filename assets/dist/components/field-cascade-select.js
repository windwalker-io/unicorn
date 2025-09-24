import { l as P, m as f, w as v, o as m, x as g } from "../chunks/unicorn-Dap6NpVD.js";
import { g as d } from "../chunks/_commonjsHelpers-C6fGbg64.js";
var r = {}, h;
function C() {
  if (h) return r;
  h = 1, Object.defineProperty(r, "__esModule", { value: !0 });
  class e {
  }
  return r.default = e, r;
}
var S = /* @__PURE__ */ C();
const j = /* @__PURE__ */ d(S);
var u = {}, p;
function x() {
  if (p) return u;
  p = 1, Object.defineProperty(u, "__esModule", { value: !0 });
  function e(t) {
    return function(...s) {
      let i = new t(...s);
      const l = t.prototype;
      let n = {};
      return Object.getOwnPropertyNames(l).forEach(function(o) {
        if (o === "constructor")
          return;
        const a = Object.getOwnPropertyDescriptor(l, o);
        a.value !== void 0 ? typeof a.value == "function" && (n[o] = a.value) : (a.get || a.set) && Object.defineProperty(n, o, { get: a.get, set: a.set });
      }), Object.assign(n, i);
    };
  }
  return u.default = e, u;
}
var F = /* @__PURE__ */ x();
const b = /* @__PURE__ */ d(F);
var w = Object.getOwnPropertyDescriptor, E = (e, t, s, i) => {
  for (var l = i > 1 ? void 0 : i ? w(t, s) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (l = o(l) || l);
  return l;
};
const I = {
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
  readonly: !1,
  disabled: !1,
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
let c = class extends j {
  options;
  el;
  canModify = !1;
  lists = [];
  ajaxUrl = "";
  values = [];
  constructor(e = {}) {
    super(), this.options = f({}, I, e), this.options.id = this.options.id || "cascade-select-" + v();
  }
  init() {
    this.canModify = !this.options.readonly && !this.options.disabled, this.ajaxUrl = this.options.ajaxUrl, this.values = this.options.path.slice().map(String);
    let e = this.options.path.slice();
    e.length === 0 ? e = [null] : e.unshift(null);
    let t = Promise.resolve(), s = null;
    e.forEach((i, l) => {
      t = t.then(() => this.loadItems(i, l).then((n) => {
        n.length > 0 && this.lists.push(n);
      })), s = i;
    }), this.el = this.$el, m(this.$el, "cascade.select", () => this), this.valueInit(this.$el, s, e);
  }
  getLabel(e) {
    return this.options.labels[e] || `Level ${e + 1}`;
  }
  getId(e) {
    return `${this.options.id}__level-${e}`;
  }
  getListValue(e) {
    return this.values[e] || "";
  }
  isSelected(e, t) {
    return String(this.getListValue(e)) === String(t[this.options.valueField]);
  }
  getFinalValue() {
    const e = this.values.slice();
    if (e.length === 0)
      return this.options.defaultValue;
    const t = e.filter((s) => s != null).filter((s) => s !== "").pop();
    return t ?? this.options.defaultValue;
  }
  getLevel() {
    return this.values.length;
  }
  async onChange(e, t) {
    const s = t.target;
    this.values[e] = s.value, this.options.onChange(t), t.stopPropagation();
    const i = new CustomEvent("change", {
      detail: {
        el: s,
        component: this,
        value: s.value,
        path: this.values
      }
    });
    if (this.el?.dispatchEvent(i), s.value === "") {
      this.lists.splice(e + 1), this.values.splice(e + 1);
      return;
    }
    let l = await this.loadItems(s.value, e);
    this.lists.splice(e + 1), this.values.splice(e + 1), l.length > 0 && this.lists.push(l);
  }
  async loadItems(e, t) {
    return this.ajaxUrl ? await (await (await g()).get(
      this.ajaxUrl,
      {
        params: {
          [this.options.ajaxValueField]: e,
          self: this.options.ignoreSelf || null
        }
      }
    )).data.data : e ? Promise.resolve(
      this.handleSourceItems(
        this.findFromList(this.lists[t - 1] || [], e)?.children || []
      )
    ) : Promise.resolve(this.handleSourceItems(this.options.source));
  }
  valueInit(e, t, s) {
    const i = new CustomEvent("value.init", {
      detail: {
        el: e,
        component: this,
        value: t,
        path: s
      }
    });
    this.options.onSelectInit(i), this.$el.dispatchEvent(i);
  }
  selectInit(e) {
    const t = new CustomEvent("select.init", {
      detail: {
        el: e,
        component: this
      }
    });
    this.options.onSelectInit(t), this.$el.dispatchEvent(t);
  }
  handleSourceItems(e) {
    return e.map((t) => ({
      [this.options.valueField]: t.value[this.options.valueField],
      [this.options.textField]: t.value[this.options.textField],
      children: t.children
    })).filter((t) => this.options.ignoreSelf ? t[this.options.valueField] != this.options.ignoreSelf : t);
  }
  findFromList(e, t) {
    return e.filter((i) => i[this.options.valueField] == t).shift();
  }
  getPlaceholder(e) {
    return this.options.placeholders[e] ? this.options.placeholders[e] : this.options.placeholder;
  }
};
c = /* @__PURE__ */ E([
  b
], c);
