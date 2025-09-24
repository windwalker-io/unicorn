import { f as u, g as f, i as p, j as m, k as d, m as _ } from "../chunks/unicorn-Dap6NpVD.js";
const h = () => {
}, b = {
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
  initial_load: !0,
  empty_mark: "__EMPTY__",
  hooks: {
    before_request: h,
    after_request: h
  }
};
class c {
  element;
  dependent;
  options;
  cancelToken = null;
  static handle(t, e = null, s = {}) {
    return f(t, "list-dependent", () => new this(t, e, s));
  }
  constructor(t, e, s = {}) {
    this.options = this.mergeOptions(s), this.element = p(t), this.dependent = p(e), this.bindEvents(), this.options.initial_load && this.changeList(this.dependent.value, !0);
  }
  /**
   * Bind events.
   */
  bindEvents() {
    this.dependent.addEventListener("change", (t) => {
      this.changeList(t.currentTarget?.value);
    });
  }
  /**
   * Update the list elements.
   *
   * @param {*}    value
   * @param {bool} initial
   */
  changeList(t, e = !1) {
    t = t || this.dependent.value, t === "" && (t = this.options.empty_mark), this.options.ajax.url ? this.ajaxUpdate(t) : this.options.source && this.sourceUpdate(t, e);
  }
  /**
   * Update list by source.
   *
   * @param {string} value
   * @param {bool}   initial
   */
  sourceUpdate(t, e = !1) {
    const s = this.options.source;
    this.beforeHook(t, this.element, this.dependent), s[t] ? this.updateListElements(s[t]) : (this.updateListElements([]), !e && t !== "" && parseInt(t) !== 0 && console.log("List for value: " + t + " not found.")), this.afterHook(t, this.element, this.dependent);
  }
  /**
   * Do ajax.
   *
   * @param {string} value
   */
  async ajaxUpdate(t) {
    let e = {};
    e[this.options.ajax.value_field] = t, typeof this.options.ajax.data == "object" ? e = { ...e, ...this.options.ajax.data } : typeof this.options.ajax.data == "function" && (e = this.options.ajax.data(e, this) || e), this.beforeHook(t, this.element, this.dependent), this.cancelToken && (this.cancelToken.cancel(), this.cancelToken = null);
    let s = this.options.ajax.url;
    typeof s == "function" && (s = s(this));
    const i = await m();
    try {
      const n = await i.get(s, {
        params: e,
        cancelToken: this.cancelToken
      }), { success: o, data: l } = n.data;
      o ? this.updateListElements(l) : console.error(l);
    } catch (n) {
      console.error(n);
    } finally {
      this.afterHook(t, this.element, this.dependent), this.cancelToken = null;
    }
  }
  updateListElements(t) {
    const e = this.options.text_field, s = this.options.value_field;
    this.element.innerHTML = "", this.options.first_option && Array.isArray(t) && (t.unshift({}), t[0][e] = this.options.first_option[e], t[0][s] = this.options.first_option[s]);
    for (const i in t) {
      const n = t[i];
      if (Array.isArray(n)) {
        const o = d(`<optgroup label="${i}"></optgroup>`);
        for (const l in n) {
          const r = n[l];
          this.appendOptionTo({
            value: r[s],
            text: r[e],
            attributes: r.attributes
          }, o);
        }
        this.element.appendChild(o);
        continue;
      }
      this.appendOptionTo({
        value: n[s],
        text: n[e],
        attributes: n.attributes
      }, this.element);
    }
    this.element.dispatchEvent(new CustomEvent("change")), this.element.dispatchEvent(new CustomEvent("list:updated"));
  }
  appendOptionTo(t, e) {
    const s = t.value, i = d("<option>" + t.text + "</option>");
    if (i.setAttribute("value", s), t.attributes)
      for (const n in t.attributes) {
        const o = t.attributes[n];
        i.setAttribute(n, o);
      }
    this.isSelected(s) && i.setAttribute("selected", "selected"), e.appendChild(i);
  }
  isSelected(t) {
    let e = [], s = this.element.dataset.selected ?? this.options.default_value;
    return typeof s == "function" && (s = s(t, this)), Array.isArray(s) ? e = s : s && typeof s == "object" ? e = Object.keys(s) : e = [s], e.indexOf(t) !== -1;
  }
  /**
   * Before hook.
   */
  beforeHook(t, e, s) {
    return this.options.hooks.before_request.call(this, t, e, s);
  }
  /**
   * After hook.
   */
  afterHook(t, e, s) {
    return this.options.hooks.after_request.call(this, t, e, s);
  }
  mergeOptions(t) {
    return _({}, b, t);
  }
}
const x = /* @__PURE__ */ u("list-dependent", {
  mounted(a, t) {
    const e = JSON.parse(t.value);
    c.handle(a, e.dependent, e);
  },
  updated(a, t) {
    const e = JSON.parse(t.value);
    c.handle(a).mergeOptions(e);
  }
});
export {
  c as ListDependent,
  x as ready
};
