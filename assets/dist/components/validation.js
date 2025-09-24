import { f as A, g as c, i as O, m as x, p as M, t as I, v as L, k as R } from "../chunks/unicorn-Dap6NpVD.js";
const $ = 2147483647, f = 36, E = 1, V = 26, N = 38, q = 700, P = 72, D = 128, T = "-", W = /[^\0-\x7F]/, z = /[\x2E\u3002\uFF0E\uFF61]/g, U = {
  overflow: "Overflow: input needs wider integers to process",
  "not-basic": "Illegal input >= 0x80 (not a basic code point)",
  "invalid-input": "Invalid input"
}, C = f - E, h = Math.floor, y = String.fromCharCode;
function S(s) {
  throw new RangeError(U[s]);
}
function j(s, t) {
  const e = [];
  let i = s.length;
  for (; i--; )
    e[i] = t(s[i]);
  return e;
}
function B(s, t) {
  const e = s.split("@");
  let i = "";
  e.length > 1 && (i = e[0] + "@", s = e[1]), s = s.replace(z, ".");
  const n = s.split("."), r = j(n, t).join(".");
  return i + r;
}
function H(s) {
  const t = [];
  let e = 0;
  const i = s.length;
  for (; e < i; ) {
    const n = s.charCodeAt(e++);
    if (n >= 55296 && n <= 56319 && e < i) {
      const r = s.charCodeAt(e++);
      (r & 64512) == 56320 ? t.push(((n & 1023) << 10) + (r & 1023) + 65536) : (t.push(n), e--);
    } else
      t.push(n);
  }
  return t;
}
const w = function(s, t) {
  return s + 22 + 75 * (s < 26) - ((t != 0) << 5);
}, J = function(s, t, e) {
  let i = 0;
  for (s = e ? h(s / q) : s >> 1, s += h(s / t); s > C * V >> 1; i += f)
    s = h(s / C);
  return h(i + (C + 1) * s / (s + N));
}, Z = function(s) {
  const t = [];
  s = H(s);
  const e = s.length;
  let i = D, n = 0, r = P;
  for (const l of s)
    l < 128 && t.push(y(l));
  const a = t.length;
  let o = a;
  for (a && t.push(T); o < e; ) {
    let l = $;
    for (const d of s)
      d >= i && d < l && (l = d);
    const p = o + 1;
    l - i > h(($ - n) / p) && S("overflow"), n += (l - i) * p, i = l;
    for (const d of s)
      if (d < i && ++n > $ && S("overflow"), d === i) {
        let m = n;
        for (let v = f; ; v += f) {
          const g = v <= r ? E : v >= r + V ? V : v - r;
          if (m < g)
            break;
          const b = m - g, F = f - g;
          t.push(
            y(w(g + b % F, 0))
          ), m = h(b / F);
        }
        t.push(y(w(m, 0))), r = J(n, p, o === a), n = 0, ++o;
      }
    ++n, ++i;
  }
  return t.join("");
}, _ = function(s) {
  return B(s, function(t) {
    return W.test(t) ? "xn--" + Z(t) : t;
  });
}, u = {}, G = {
  scroll: !1,
  scrollOffset: -100,
  enabled: !0,
  fieldSelector: null,
  validatedClass: null
}, X = {
  formSelector: "[uni-form-validate]",
  errorSelector: "[data-field-error]",
  selector: "input[data-field-input], select[data-field-input], textarea[data-field-input]",
  validClass: "is-valid",
  invalidClass: "is-invalid",
  events: ["change"],
  errorMessageClass: "invalid-tooltip",
  inputOptions: !1,
  inputOptionsWrapperSelector: "div[data-field-input]",
  inputOptionsSelector: "[data-input-option]"
};
class k {
  presetFields = [];
  static globalValidators = {};
  validators = {};
  options;
  $form;
  static is = "uni-form-validate";
  constructor(t, e = {}) {
    this.$form = O(t), this.options = this.mergeOptions(e), this.registerDefaultValidators(), this.init();
  }
  mergeOptions(t) {
    return this.options = x({}, G, t);
  }
  get scrollEnabled() {
    return this.options.scroll;
  }
  get scrollOffset() {
    return Number(this.options.scrollOffset || -100);
  }
  get fieldSelector() {
    return this.options.fieldSelector || "input, select, textarea";
  }
  get validatedClass() {
    return this.options.validatedClass || "was-validated";
  }
  init() {
    this.$form.tagName === "FORM" && (this.$form.setAttribute("novalidate", "true"), this.$form.addEventListener("submit", (t) => this.options.enabled && !this.validateAll() ? (t.stopImmediatePropagation(), t.stopPropagation(), t.preventDefault(), this.$form.dispatchEvent(new CustomEvent("invalid")), !1) : !0, !1)), this.prepareFields(this.findDOMFields()), this.prepareFields(this.presetFields);
  }
  findDOMFields() {
    return M(this.$form.querySelectorAll(this.fieldSelector));
  }
  prepareFields(t) {
    return t.forEach((e) => {
      this.prepareFieldWrapper(e);
    }), Promise.resolve();
  }
  prepareFieldWrapper(t) {
    if (["INPUT", "SELECT", "TEXTAREA"].indexOf(t.tagName) !== -1) {
      let e = t.closest("[uni-field-validate]");
      return e || (e = t.closest("[data-input-container]") || t.parentElement, e?.setAttribute("uni-field-validate", "{}")), e;
    }
    return t;
  }
  findFields(t = !0) {
    let e = this.findDOMFields();
    return t && e.push(...this.presetFields), e.map((i) => this.prepareFieldWrapper(i)).filter((i) => i != null);
  }
  getFieldComponent(t) {
    let e = c(t, "field.validation");
    if (!e) {
      const i = t.closest("[uni-field-validate]");
      i && (e = c(i, "field.validation"));
    }
    return e;
  }
  validateAll(t) {
    this.markFormAsUnvalidated(), t = t || this.findFields();
    let e = null;
    for (const i of t) {
      const n = this.getFieldComponent(i);
      if (!n)
        continue;
      !n.checkValidity() && !e && (e = i);
    }
    return this.markFormAsValidated(), e && this.scrollEnabled && this.scrollTo(e), e === null;
  }
  async validateAllAsync(t) {
    this.markFormAsUnvalidated(), t = t || this.findFields();
    let e = null;
    const i = [];
    for (const n of t) {
      const r = this.getFieldComponent(n);
      r && i.push(
        r.checkValidityAsync().then((a) => (!a && !e && (e = n), a))
      );
    }
    return await Promise.all(i), this.markFormAsValidated(), e && this.scrollEnabled && this.scrollTo(e), e === null;
  }
  scrollTo(t) {
    const e = this.scrollOffset, n = t.getBoundingClientRect().top + window.scrollY + e;
    window.scrollTo({
      top: n,
      behavior: "smooth"
    });
  }
  markFormAsValidated() {
    this.$form && this.$form.classList.add(this.validatedClass);
  }
  markFormAsUnvalidated() {
    this.$form && this.$form.classList.remove(this.validatedClass);
  }
  addField(t) {
    return this.presetFields.push(t), this.prepareFieldWrapper(t), this;
  }
  registerDefaultValidators() {
    for (let t in u)
      this.addValidator(t, u[t]);
  }
  /**
   * Add validator handler.
   */
  addValidator(t, e, i = {}) {
    return i = i || {}, this.validators[t] = {
      handler: e,
      options: i
    }, this;
  }
  /**
   * Add validator handler.
   */
  static addGlobalValidator(t, e, i = {}) {
    return i = i || {}, this.globalValidators[t] = {
      handler: e,
      options: i
    }, this;
  }
}
class Y {
  constructor(t, e = {}) {
    this.el = t, this.options = this.mergeOptions(e), this.$input = this.selectInput(), this.init();
  }
  $input;
  options;
  static is = "uni-field-validate";
  mergeOptions(t) {
    return this.options = x({}, X, t);
  }
  get $form() {
    return this.getForm();
  }
  get errorSelector() {
    return this.options.errorSelector;
  }
  get selector() {
    return this.options.selector;
  }
  get validClass() {
    return this.options.validClass;
  }
  get invalidClass() {
    return this.options.invalidClass;
  }
  get isVisible() {
    return !!(this.el.offsetWidth || this.el.offsetHeight || this.el.getClientRects().length);
  }
  get isInputOptions() {
    return !!this.options.inputOptions;
  }
  get validationMessage() {
    return this.$input?.validationMessage || "";
  }
  get validity() {
    return this.$input?.validity;
  }
  selectInput() {
    let t = this.selector;
    this.options.inputOptions && (t += ", " + this.options.inputOptionsWrapperSelector);
    let e = this.el.querySelector(t);
    if (e || (e = this.el.querySelector("input, select, textarea")), !!e)
      return this.$input = e;
  }
  init() {
    if (this.selectInput(), this.bindEvents(), this.prepareWrapper(), this.isInputOptions) {
      const t = this.$input;
      t.validationMessage = "", t.setCustomValidity = (e) => {
        t.validationMessage = String(e);
      }, t.checkValidity = () => this.checkInputOptionsValidity();
    }
  }
  bindEvents() {
    if (!this.$input)
      return;
    this.$input.addEventListener("invalid", (e) => {
      this.showInvalidResponse();
    }), this.options.events.forEach((e) => {
      this.$input?.addEventListener(e, () => {
        this.checkValidity();
      });
    });
  }
  prepareWrapper() {
    this.el.querySelector(this.errorSelector)?.classList?.contains("invalid-tooltip") && window.getComputedStyle(this.el).position === "static" && (this.el.style.position = "relative");
  }
  checkValidity() {
    if (!this.$input || this.$input.hasAttribute("readonly") || this.$input.hasAttribute("[data-novalidate]") || this.$input.closest("[data-novalidate]"))
      return !0;
    this.$input.setCustomValidity("");
    let t = this.$input.checkValidity();
    return t && this.$form && (t = this.runCustomValidity()), this.updateValidClass(t), t;
  }
  runCustomValidity() {
    if (!this.$input)
      return !0;
    const t = (this.$input.getAttribute("data-validate") || "").split("|");
    let e = !0;
    if (this.$input.value !== "" && t.length) {
      if (!this.checkCustomDataAttributeValidity())
        return !1;
      for (const i of t) {
        const [n, r] = this.getValidator(i) || [null, {}];
        if (!n)
          continue;
        Object.assign(r, n.options);
        let a = n.handler(this.$input.value, this.$input, r, this);
        if (a instanceof Promise || typeof a == "object" && a.then) {
          a.then((o) => {
            this.handleAsyncCustomResult(o, n);
          });
          continue;
        }
        if (!this.handleCustomResult(a, n)) {
          e = !1;
          break;
        }
      }
    }
    return e;
  }
  async checkValidityAsync() {
    if (!this.$input || this.$input.hasAttribute("readonly"))
      return !0;
    this.$input.setCustomValidity("");
    let t = this.$input.checkValidity();
    return t && this.$form && (t = await this.runCustomValidityAsync()), this.updateValidClass(t), t;
  }
  async runCustomValidityAsync() {
    if (!this.$input)
      return !0;
    const t = (this.$input.getAttribute("data-validate") || "").split("|"), e = [], i = [];
    if (this.$input.value !== "" && t.length) {
      if (!this.checkCustomDataAttributeValidity())
        return !1;
      for (const n of t) {
        let [r, a] = this.getValidator(n) || [null, {}];
        r && (a = Object.assign({}, a, r.options || {}), i.push(
          Promise.resolve(r.handler(this.$input.value, this.$input, a, this)).then((o) => (e.push(this.handleAsyncCustomResult(o, r)), o))
        ));
      }
    }
    await Promise.all(i);
    for (const n of e)
      if (n === !1)
        return !1;
    return !0;
  }
  checkCustomDataAttributeValidity() {
    const t = this.$input?.dataset.validationFail;
    return this.handleCustomResult(t);
  }
  checkInputOptionsValidity() {
    if (!this.$input)
      return !0;
    const t = this.$input.getAttribute("required") != null, e = this.$input.querySelectorAll(this.options.inputOptionsSelector);
    let i = !0;
    if (t)
      for (const r of e) {
        const a = r.querySelector("input");
        if (i = !1, a?.checked) {
          i = !0;
          break;
        }
      }
    const n = document.createElement("input");
    n.required = t, i && (n.value = "placeholder"), n.checkValidity(), this.$input.validationMessage = n.validationMessage, this.$input.validity = n.validity;
    for (const r of e)
      r.querySelector("input")?.setCustomValidity(n.validationMessage);
    return i || this.$input.dispatchEvent(
      new CustomEvent("invalid")
    ), i;
  }
  /**
   * @param valid {boolean}
   */
  updateValidClass(t) {
    const i = this.getErrorElement()?.previousElementSibling;
    this.$input?.classList.remove(this.invalidClass), this.$input?.classList.remove(this.validClass), this.el.classList.remove(this.invalidClass), this.el.classList.remove(this.validClass), i?.classList.remove(this.invalidClass), i?.classList.remove(this.validClass), t ? (this.$input?.classList.add(this.validClass), this.el.classList.add(this.validClass), i?.classList.add(this.validClass)) : (this.$input?.classList.add(this.invalidClass), this.el.classList.add(this.invalidClass), i?.classList.add(this.invalidClass));
  }
  getFormValidation(t) {
    return c(t || this.getForm(), "form.validation");
  }
  getValidator(t) {
    const e = t.match(/(?<type>[\w\-_]+)(\((?<params>.*)\))*/);
    if (!e)
      return null;
    const i = e.groups?.type || "", n = e.groups?.params || "", a = this.getFormValidation(this.$form)?.validators[i] || k.globalValidators[i];
    if (!a)
      return null;
    const o = n.matchAll(/(?<key>\w+)(\s?[=:]\s?(?<value>\w+))?/g), l = {};
    for (const p of o) {
      const d = p?.groups;
      d && (l[d.key] = K(d.value));
    }
    return [a, l];
  }
  handleCustomResult(t, e) {
    return typeof t == "string" ? (this.$input?.setCustomValidity(t), t = t === "") : t === void 0 && (t = !0), t ? this.$input?.setCustomValidity("") : e && this.raiseCustomErrorState(e), t;
  }
  handleAsyncCustomResult(t, e) {
    return t = this.handleCustomResult(t, e), this.$input?.checkValidity(), this.updateValidClass(t), t;
  }
  raiseCustomErrorState(t) {
    let e;
    this.$input?.validationMessage === "" && (e = t.options?.notice, typeof e == "function" && (e = e(this.$input, this)), e != null && this.$input?.setCustomValidity(e)), this.$input?.validationMessage === "" && this.$input?.setCustomValidity(I("unicorn.message.validation.custom.error")), this.$input?.dispatchEvent(
      new CustomEvent("invalid")
    );
  }
  setAsInvalidAndReport(t) {
    this.setCustomValidity(t), this.showInvalidResponse();
  }
  setCustomValidity(t) {
    this.$input?.setCustomValidity(t);
  }
  reportValidity() {
    this.validationMessage !== "" && this.showInvalidResponse();
  }
  showInvalidResponse() {
    const t = this.$input?.validity;
    let e = this.$input?.validationMessage || "";
    for (let n in t)
      if (t[n] && this.$input?.dataset[n + "Message"]) {
        e = this.$input?.dataset[n + "Message"] || "";
        break;
      }
    if (!this.isVisible) {
      let n = this.findLabel()?.textContent;
      n || (n = this.$input?.name || ""), L().renderMessage(
        `Field: ${n} - ${e}`,
        "warning"
      );
    }
    let i = this.getErrorElement();
    i || (i = this.createHelpElement(), this.el.appendChild(i), this.prepareWrapper()), i.textContent = e, this.updateValidClass(!1);
  }
  getErrorElement() {
    return this.el.querySelector(this.errorSelector);
  }
  createHelpElement() {
    const t = this.options.errorMessageClass, e = this.parseSelector(this.errorSelector || ""), i = R(`<div class="${t}"></div>`);
    return i.classList.add(...e.classes), e.attrs.forEach((n) => {
      i.setAttribute(n[0], n[1] || "");
    }), e.ids.forEach((n) => {
      i.id = n;
    }), i;
  }
  /**
   * @see https://stackoverflow.com/a/17888178
   */
  parseSelector(t) {
    const e = { tags: [], classes: [], ids: [], attrs: [] };
    for (const i of t.split(/(?=\.)|(?=#)|(?=\[)/))
      switch (i[0]) {
        case "#":
          e.ids.push(i.slice(1));
          break;
        case ".":
          e.classes.push(i.slice(1));
          break;
        case "[":
          e.attrs.push(i.slice(1, -1).split("="));
          break;
        default:
          e.tags.push(i);
          break;
      }
    return e;
  }
  setAsValidAndClearResponse() {
    this.setCustomValidity(""), this.updateValidClass(!0), this.clearInvalidResponse();
  }
  clearInvalidResponse() {
    const t = this.el.querySelector(this.errorSelector);
    t.textContent = "";
  }
  getForm() {
    return this.el.closest(this.options.formSelector || "[uni-form-validate]");
  }
  findLabel() {
    const t = this.$input?.id || "", e = this.$input?.closest("[data-field-wrapper]");
    let i = null;
    return e && (i = e.querySelector("[data-field-label]")), i || (i = document.querySelector(`label[for="${t}"]`)), i;
  }
}
u.username = function(s, t) {
  return !new RegExp(`[<|>|"|'|%|;|(|)|&]`, "i").test(s);
};
u.numeric = function(s, t) {
  return /^(\d|-)?(\d|,)*\.?\d*$/.test(s);
};
u.email = function(s, t) {
  return s = _(s), /^[a-zA-Z0-9.!#$%&â€™*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(s);
};
u.url = function(s, t) {
  return /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i.test(s);
};
u.alnum = function(s, t) {
  return /^[a-zA-Z0-9]*$/.test(s);
};
u.color = function(s, t) {
  return /^#(?:[0-9a-f]{3}){1,2}$/.test(s);
};
u.creditcard = function(s, t) {
  return /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6011[0-9]{12}|622((12[6-9]|1[3-9][0-9])|([2-8][0-9][0-9])|(9(([0-1][0-9])|(2[0-5]))))[0-9]{10}|64[4-9][0-9]{13}|65[0-9]{14}|3(?:0[0-5]|[68][0-9])[0-9]{11}|3[47][0-9]{13})*$/.test(s);
};
u.ip = function(s, t) {
  return /^((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))*$/.test(s);
};
u["password-confirm"] = function(s, t) {
  const e = t.dataset.confirmTarget;
  if (!e)
    throw new Error('Validator: "password-confirm" must add "data-confirm-target" attribute.');
  return document.querySelector(e)?.value === s;
};
const tt = /* @__PURE__ */ Promise.all([
  /* @__PURE__ */ A("form-validate", {
    mounted(s, t) {
      c(s, "form.validation", (e) => new k(e, JSON.parse(t.value || "{}")));
    },
    updated(s, t) {
      c(s, "form.validation").mergeOptions(JSON.parse(t.value || "{}"));
    }
  }),
  /* @__PURE__ */ A("field-validate", {
    mounted(s, t) {
      c(s, "field.validation", (e) => new Y(e, JSON.parse(t.value || "{}")));
    },
    updated(s, t) {
      c(s, "field.validation").mergeOptions(JSON.parse(t.value || "{}") || {});
    }
  })
]);
function K(s) {
  return isNaN(Number(s)) ? s === "null" ? null : s === "true" || s === "false" ? !0 : s : Number(s);
}
export {
  Y as UnicornFieldValidation,
  k as UnicornFormValidation,
  tt as ready,
  u as validators
};
