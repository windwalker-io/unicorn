import { t as trans } from "../service/lang.js";
import { u as useUniDirective } from "../composable/useUniDirective.js";
import { g as getBoundedInstance, s as selectOne, a as selectAll, c as html } from "../service/dom.js";
import { m as mergeDeep } from "../utilities/arr.js";
import { u as useUITheme } from "../service/ui.js";
const maxInt = 2147483647;
const base = 36;
const tMin = 1;
const tMax = 26;
const skew = 38;
const damp = 700;
const initialBias = 72;
const initialN = 128;
const delimiter = "-";
const regexNonASCII = /[^\0-\x7F]/;
const regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g;
const errors = {
  "overflow": "Overflow: input needs wider integers to process",
  "not-basic": "Illegal input >= 0x80 (not a basic code point)",
  "invalid-input": "Invalid input"
};
const baseMinusTMin = base - tMin;
const floor = /* @__PURE__ */ (() => Math.floor)();
const stringFromCharCode = /* @__PURE__ */ (() => String.fromCharCode)();
function error(type) {
  throw new RangeError(errors[type]);
}
function map(array, callback) {
  const result = [];
  let length = array.length;
  while (length--) {
    result[length] = callback(array[length]);
  }
  return result;
}
function mapDomain(domain, callback) {
  const parts = domain.split("@");
  let result = "";
  if (parts.length > 1) {
    result = parts[0] + "@";
    domain = parts[1];
  }
  domain = domain.replace(regexSeparators, ".");
  const labels = domain.split(".");
  const encoded = map(labels, callback).join(".");
  return result + encoded;
}
function ucs2decode(string) {
  const output = [];
  let counter = 0;
  const length = string.length;
  while (counter < length) {
    const value = string.charCodeAt(counter++);
    if (value >= 55296 && value <= 56319 && counter < length) {
      const extra = string.charCodeAt(counter++);
      if ((extra & 64512) == 56320) {
        output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
      } else {
        output.push(value);
        counter--;
      }
    } else {
      output.push(value);
    }
  }
  return output;
}
const digitToBasic = function(digit, flag) {
  return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
};
const adapt = function(delta, numPoints, firstTime) {
  let k = 0;
  delta = firstTime ? floor(delta / damp) : delta >> 1;
  delta += floor(delta / numPoints);
  for (; delta > baseMinusTMin * tMax >> 1; k += base) {
    delta = floor(delta / baseMinusTMin);
  }
  return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
};
const encode = function(input) {
  const output = [];
  input = ucs2decode(input);
  const inputLength = input.length;
  let n = initialN;
  let delta = 0;
  let bias = initialBias;
  for (const currentValue of input) {
    if (currentValue < 128) {
      output.push(stringFromCharCode(currentValue));
    }
  }
  const basicLength = output.length;
  let handledCPCount = basicLength;
  if (basicLength) {
    output.push(delimiter);
  }
  while (handledCPCount < inputLength) {
    let m = maxInt;
    for (const currentValue of input) {
      if (currentValue >= n && currentValue < m) {
        m = currentValue;
      }
    }
    const handledCPCountPlusOne = handledCPCount + 1;
    if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
      error("overflow");
    }
    delta += (m - n) * handledCPCountPlusOne;
    n = m;
    for (const currentValue of input) {
      if (currentValue < n && ++delta > maxInt) {
        error("overflow");
      }
      if (currentValue === n) {
        let q = delta;
        for (let k = base; ; k += base) {
          const t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
          if (q < t) {
            break;
          }
          const qMinusT = q - t;
          const baseMinusT = base - t;
          output.push(
            stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
          );
          q = floor(qMinusT / baseMinusT);
        }
        output.push(stringFromCharCode(digitToBasic(q, 0)));
        bias = adapt(delta, handledCPCountPlusOne, handledCPCount === basicLength);
        delta = 0;
        ++handledCPCount;
      }
    }
    ++delta;
    ++n;
  }
  return output.join("");
};
const toASCII = function(input) {
  return mapDomain(input, function(string) {
    return regexNonASCII.test(string) ? "xn--" + encode(string) : string;
  });
};
const validatorHandlers = {};
const defaultOptions = {
  scroll: false,
  scrollOffset: -100,
  enabled: true,
  fieldSelector: null,
  validatedClass: null
};
const defaultFieldOptions = {
  formSelector: "[uni-form-validate]",
  errorSelector: "[data-field-error]",
  selector: "input[data-field-input], select[data-field-input], textarea[data-field-input]",
  validClass: "is-valid",
  invalidClass: "is-invalid",
  events: ["change"],
  errorMessageClass: "invalid-tooltip",
  inputOptions: false,
  inputOptionsWrapperSelector: "div[data-field-input]",
  inputOptionsSelector: "[data-input-option]"
};
class UnicornFormValidation {
  presetFields = [];
  static globalValidators = {};
  validators = {};
  options;
  $form;
  static is = "uni-form-validate";
  constructor(el, options = {}) {
    this.$form = selectOne(el);
    this.options = this.mergeOptions(options);
    this.registerDefaultValidators();
    this.init();
  }
  mergeOptions(options) {
    if (Array.isArray(options)) {
      options = {};
    }
    return this.options = mergeDeep({}, defaultOptions, options);
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
    if (this.$form.tagName === "FORM") {
      this.$form.setAttribute("novalidate", "true");
      this.$form.addEventListener("submit", (event) => {
        if (this.options.enabled && !this.validateAll()) {
          event.stopImmediatePropagation();
          event.stopPropagation();
          event.preventDefault();
          this.$form.dispatchEvent(new CustomEvent("invalid"));
          return false;
        }
        return true;
      }, false);
    }
    this.prepareFields(this.findDOMFields());
    this.prepareFields(this.presetFields);
  }
  findDOMFields() {
    return selectAll(this.$form.querySelectorAll(this.fieldSelector));
  }
  prepareFields(inputs) {
    inputs.forEach((input) => {
      this.prepareFieldWrapper(input);
    });
    return Promise.resolve();
  }
  prepareFieldWrapper(input) {
    if (["INPUT", "SELECT", "TEXTAREA"].indexOf(input.tagName) !== -1) {
      let wrapper = input.closest("[uni-field-validate]");
      if (!wrapper) {
        wrapper = input.closest("[data-input-container]") || input.parentElement;
        wrapper?.setAttribute("uni-field-validate", "{}");
      }
      return wrapper;
    }
    return input;
  }
  findFields(containsPresets = true) {
    let inputs = this.findDOMFields();
    if (containsPresets) {
      inputs.push(...this.presetFields);
    }
    return inputs.map((input) => this.prepareFieldWrapper(input)).filter((input) => input != null);
  }
  getFieldComponent(input) {
    let v = getBoundedInstance(input, "field.validation");
    if (!v) {
      const wrapper = input.closest("[uni-field-validate]");
      if (wrapper) {
        v = getBoundedInstance(wrapper, "field.validation");
      }
    }
    return v;
  }
  validateAll(fields) {
    this.markFormAsUnvalidated();
    fields = fields || this.findFields();
    let firstFail = null;
    for (const field of fields) {
      const fv = this.getFieldComponent(field);
      if (!fv) {
        continue;
      }
      const result = fv.checkValidity();
      if (!result && !firstFail) {
        firstFail = field;
      }
    }
    this.markFormAsValidated();
    if (firstFail && this.scrollEnabled) {
      this.scrollTo(firstFail);
    }
    return firstFail === null;
  }
  async validateAllAsync(fields) {
    this.markFormAsUnvalidated();
    fields = fields || this.findFields();
    let firstFail = null;
    const promises = [];
    for (const field of fields) {
      const fv = this.getFieldComponent(field);
      if (!fv) {
        continue;
      }
      promises.push(
        fv.checkValidityAsync().then((result) => {
          if (!result && !firstFail) {
            firstFail = field;
          }
          return result;
        })
      );
    }
    await Promise.all(promises);
    this.markFormAsValidated();
    if (firstFail && this.scrollEnabled) {
      this.scrollTo(firstFail);
    }
    return firstFail === null;
  }
  scrollTo(element) {
    const offset = this.scrollOffset;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY + offset;
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  }
  markFormAsValidated() {
    if (!this.$form) {
      return;
    }
    this.$form.classList.add(this.validatedClass);
  }
  markFormAsUnvalidated() {
    if (!this.$form) {
      return;
    }
    this.$form.classList.remove(this.validatedClass);
  }
  addField(field) {
    this.presetFields.push(field);
    this.prepareFieldWrapper(field);
    return this;
  }
  registerDefaultValidators() {
    for (let name in validatorHandlers) {
      this.addValidator(name, validatorHandlers[name]);
    }
  }
  /**
   * Add validator handler.
   */
  addValidator(name, handler, options = {}) {
    options = options || {};
    this.validators[name] = {
      handler,
      options
    };
    return this;
  }
  /**
   * Add validator handler.
   */
  static addGlobalValidator(name, handler, options = {}) {
    options = options || {};
    this.globalValidators[name] = {
      handler,
      options
    };
    return this;
  }
}
class UnicornFieldValidation {
  constructor(el, options = {}) {
    this.el = el;
    this.options = this.mergeOptions(options);
    this.$input = this.selectInput();
    this.init();
  }
  $input;
  options;
  static is = "uni-field-validate";
  mergeOptions(options) {
    if (Array.isArray(options)) {
      options = {};
    }
    return this.options = mergeDeep({}, defaultFieldOptions, options);
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
    return Boolean(this.options.inputOptions);
  }
  get validationMessage() {
    return this.$input?.validationMessage || "";
  }
  get validity() {
    return this.$input?.validity;
  }
  selectInput() {
    let selector = this.selector;
    if (this.options.inputOptions) {
      selector += ", " + this.options.inputOptionsWrapperSelector;
    }
    let input = this.el.querySelector(selector);
    if (!input) {
      input = this.el.querySelector("input, select, textarea");
    }
    if (!input) {
      return void 0;
    }
    return this.$input = input;
  }
  init() {
    this.selectInput();
    this.bindEvents();
    this.prepareWrapper();
    if (this.isInputOptions) {
      const $input = this.$input;
      $input.validationMessage = "";
      $input.setCustomValidity = (msg) => {
        $input.validationMessage = String(msg);
      };
      $input.checkValidity = () => {
        return this.checkInputOptionsValidity();
      };
    }
  }
  bindEvents() {
    if (!this.$input) {
      return;
    }
    this.$input.addEventListener("invalid", (e) => {
      this.showInvalidResponse();
    });
    const events = this.options.events;
    events.forEach((eventName) => {
      this.$input?.addEventListener(eventName, () => {
        this.checkValidity();
      });
    });
  }
  prepareWrapper() {
    if (this.el.querySelector(this.errorSelector)?.classList?.contains("invalid-tooltip")) {
      if (window.getComputedStyle(this.el).position === "static") {
        this.el.style.position = "relative";
      }
    }
  }
  checkValidity() {
    if (!this.$input) {
      return true;
    }
    if (this.$input.hasAttribute("readonly")) {
      return true;
    }
    if (this.$input.hasAttribute("[data-novalidate]")) {
      return true;
    }
    if (this.$input.closest("[data-novalidate]")) {
      return true;
    }
    this.$input.setCustomValidity("");
    let valid = this.$input.checkValidity();
    if (valid && this.$form) {
      valid = this.runCustomValidity();
    }
    this.updateValidClass(valid);
    return valid;
  }
  runCustomValidity() {
    if (!this.$input) {
      return true;
    }
    const validates = (this.$input.getAttribute("data-validate") || "").split("|");
    let result = true;
    if (this.$input.value !== "" && validates.length) {
      if (!this.checkCustomDataAttributeValidity()) {
        return false;
      }
      for (const validatorName of validates) {
        const [validator, options] = this.getValidator(validatorName) || [null, {}];
        if (!validator) {
          continue;
        }
        Object.assign(options, validator.options);
        let r = validator.handler(this.$input.value, this.$input, options, this);
        if (r instanceof Promise || typeof r === "object" && r.then) {
          r.then((result2) => {
            this.handleAsyncCustomResult(result2, validator);
          });
          continue;
        }
        if (!this.handleCustomResult(r, validator)) {
          result = false;
          break;
        }
      }
    }
    return result;
  }
  async checkValidityAsync() {
    if (!this.$input) {
      return true;
    }
    if (this.$input.hasAttribute("readonly")) {
      return true;
    }
    this.$input.setCustomValidity("");
    let valid = this.$input.checkValidity();
    if (valid && this.$form) {
      valid = await this.runCustomValidityAsync();
    }
    this.updateValidClass(valid);
    return valid;
  }
  async runCustomValidityAsync() {
    if (!this.$input) {
      return true;
    }
    const validates = (this.$input.getAttribute("data-validate") || "").split("|");
    const results = [];
    const promises = [];
    if (this.$input.value !== "" && validates.length) {
      if (!this.checkCustomDataAttributeValidity()) {
        return false;
      }
      for (const validatorName of validates) {
        let [validator, options] = this.getValidator(validatorName) || [null, {}];
        if (!validator) {
          continue;
        }
        options = Object.assign({}, options, validator.options || {});
        promises.push(
          Promise.resolve(validator.handler(this.$input.value, this.$input, options, this)).then((r) => {
            results.push(this.handleAsyncCustomResult(r, validator));
            return r;
          })
        );
      }
    }
    await Promise.all(promises);
    for (const result of results) {
      if (result === false) {
        return false;
      }
    }
    return true;
  }
  checkCustomDataAttributeValidity() {
    const error2 = this.$input?.dataset.validationFail;
    return this.handleCustomResult(error2);
  }
  checkInputOptionsValidity() {
    if (!this.$input) {
      return true;
    }
    const isRequired = this.$input.getAttribute("required") != null;
    const optionWrappers = this.$input.querySelectorAll(this.options.inputOptionsSelector);
    let result = true;
    if (isRequired) {
      for (const optionWrapper of optionWrappers) {
        const input = optionWrapper.querySelector("input");
        result = false;
        if (input?.checked) {
          result = true;
          break;
        }
      }
    }
    const n = document.createElement("input");
    n.required = isRequired;
    if (result) {
      n.value = "placeholder";
    }
    n.checkValidity();
    this.$input.validationMessage = n.validationMessage;
    this.$input.validity = n.validity;
    for (const optionWrapper of optionWrappers) {
      const input = optionWrapper.querySelector("input");
      input?.setCustomValidity(n.validationMessage);
    }
    if (!result) {
      this.$input.dispatchEvent(
        new CustomEvent("invalid")
      );
    }
    return result;
  }
  /**
   * @param valid {boolean}
   */
  updateValidClass(valid) {
    const $errorElement = this.getErrorElement();
    const $invalidTarget = $errorElement?.previousElementSibling;
    this.$input?.classList.remove(this.invalidClass);
    this.$input?.classList.remove(this.validClass);
    this.el.classList.remove(this.invalidClass);
    this.el.classList.remove(this.validClass);
    $invalidTarget?.classList.remove(this.invalidClass);
    $invalidTarget?.classList.remove(this.validClass);
    if (valid) {
      this.$input?.classList.add(this.validClass);
      this.el.classList.add(this.validClass);
      $invalidTarget?.classList.add(this.validClass);
    } else {
      this.$input?.classList.add(this.invalidClass);
      this.el.classList.add(this.invalidClass);
      $invalidTarget?.classList.add(this.invalidClass);
    }
  }
  getFormValidation(element) {
    return getBoundedInstance(element || this.getForm(), "form.validation");
  }
  getValidator(name) {
    const matches = name.match(/(?<type>[\w\-_]+)(\((?<params>.*)\))*/);
    if (!matches) {
      return null;
    }
    const validatorName = matches.groups?.type || "";
    const params = matches.groups?.params || "";
    const fv = this.getFormValidation(this.$form);
    const validator = fv?.validators[validatorName] || UnicornFormValidation.globalValidators[validatorName];
    if (!validator) {
      return null;
    }
    const paramMatches = params.matchAll(/(?<key>\w+)(\s?[=:]\s?(?<value>\w+))?/g);
    const options = {};
    for (const paramMatch of paramMatches) {
      const match = paramMatch?.groups;
      if (!match) {
        continue;
      }
      options[match.key] = handleParamValue(match.value);
    }
    return [validator, options];
  }
  handleCustomResult(result, validator) {
    if (typeof result === "string") {
      this.$input?.setCustomValidity(result);
      result = result === "";
    } else if (result === void 0) {
      result = true;
    }
    if (result) {
      this.$input?.setCustomValidity("");
    } else if (validator) {
      this.raiseCustomErrorState(validator);
    }
    return result;
  }
  handleAsyncCustomResult(result, validator) {
    result = this.handleCustomResult(result, validator);
    this.$input?.checkValidity();
    this.updateValidClass(result);
    return result;
  }
  raiseCustomErrorState(validator) {
    let help;
    if (this.$input?.validationMessage === "") {
      help = validator.options?.notice;
      if (typeof help === "function") {
        help = help(this.$input, this);
      }
      if (help != null) {
        this.$input?.setCustomValidity(help);
      }
    }
    if (this.$input?.validationMessage === "") {
      this.$input?.setCustomValidity(trans("unicorn.message.validation.custom.error"));
    }
    this.$input?.dispatchEvent(
      new CustomEvent("invalid")
    );
  }
  setAsInvalidAndReport(error2) {
    this.setCustomValidity(error2);
    this.showInvalidResponse();
  }
  setCustomValidity(error2) {
    this.$input?.setCustomValidity(error2);
  }
  reportValidity() {
    if (this.validationMessage !== "") {
      this.showInvalidResponse();
    }
  }
  showInvalidResponse() {
    const state = this.$input?.validity;
    let message = this.$input?.validationMessage || "";
    for (let key in state) {
      if (state[key] && this.$input?.dataset[key + "Message"]) {
        message = this.$input?.dataset[key + "Message"] || "";
        break;
      }
    }
    if (!this.isVisible) {
      let title = this.findLabel()?.textContent;
      if (!title) {
        title = this.$input?.name || "";
      }
      useUITheme().renderMessage(
        `Field: ${title} - ${message}`,
        "warning"
      );
    }
    let $help = this.getErrorElement();
    if (!$help) {
      $help = this.createHelpElement();
      this.el.appendChild($help);
      this.prepareWrapper();
    }
    $help.textContent = message;
    this.updateValidClass(false);
  }
  getErrorElement() {
    return this.el.querySelector(this.errorSelector);
  }
  createHelpElement() {
    const className = this.options.errorMessageClass;
    const parsed = this.parseSelector(this.errorSelector || "");
    const $help = html(`<div class="${className}"></div>`);
    $help.classList.add(...parsed.classes);
    parsed.attrs.forEach((attr) => {
      $help.setAttribute(attr[0], attr[1] || "");
    });
    parsed.ids.forEach((id) => {
      $help.id = id;
    });
    return $help;
  }
  /**
   * @see https://stackoverflow.com/a/17888178
   */
  parseSelector(subselector) {
    const obj = { tags: [], classes: [], ids: [], attrs: [] };
    for (const token of subselector.split(/(?=\.)|(?=#)|(?=\[)/)) {
      switch (token[0]) {
        case "#":
          obj.ids.push(token.slice(1));
          break;
        case ".":
          obj.classes.push(token.slice(1));
          break;
        case "[":
          obj.attrs.push(token.slice(1, -1).split("="));
          break;
        default:
          obj.tags.push(token);
          break;
      }
    }
    return obj;
  }
  setAsValidAndClearResponse() {
    this.setCustomValidity("");
    this.updateValidClass(true);
    this.clearInvalidResponse();
  }
  clearInvalidResponse() {
    const $help = this.el.querySelector(this.errorSelector);
    $help.textContent = "";
  }
  getForm() {
    return this.el.closest(this.options.formSelector || "[uni-form-validate]");
  }
  findLabel() {
    const id = this.$input?.id || "";
    const wrapper = this.$input?.closest("[data-field-wrapper]");
    let label = null;
    if (wrapper) {
      label = wrapper.querySelector("[data-field-label]");
    }
    if (!label) {
      label = document.querySelector(`label[for="${id}"]`);
    }
    return label;
  }
}
validatorHandlers.username = function(value, element) {
  const regex = new RegExp(`[<|>|"|'|%|;|(|)|&]`, "i");
  return !regex.test(value);
};
validatorHandlers.numeric = function(value, element) {
  const regex = /^(\d|-)?(\d|,)*\.?\d*$/;
  return regex.test(value);
};
validatorHandlers.email = function(value, element) {
  value = toASCII(value);
  const regex = /^[a-zA-Z0-9.!#$%&â€™*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return regex.test(value);
};
validatorHandlers.url = function(value, element) {
  const regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;
  return regex.test(value);
};
validatorHandlers.alnum = function(value, element) {
  const regex = /^[a-zA-Z0-9]*$/;
  return regex.test(value);
};
validatorHandlers.color = function(value, element) {
  const regex = /^#(?:[0-9a-f]{3}){1,2}$/;
  return regex.test(value);
};
validatorHandlers.creditcard = function(value, element) {
  const regex = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6011[0-9]{12}|622((12[6-9]|1[3-9][0-9])|([2-8][0-9][0-9])|(9(([0-1][0-9])|(2[0-5]))))[0-9]{10}|64[4-9][0-9]{13}|65[0-9]{14}|3(?:0[0-5]|[68][0-9])[0-9]{11}|3[47][0-9]{13})*$/;
  return regex.test(value);
};
validatorHandlers.ip = function(value, element) {
  const regex = /^((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))*$/;
  return regex.test(value);
};
validatorHandlers["password-confirm"] = function(value, element) {
  const selector = element.dataset.confirmTarget;
  if (!selector) {
    throw new Error('Validator: "password-confirm" must add "data-confirm-target" attribute.');
  }
  const target = document.querySelector(selector);
  return target?.value === value;
};
const ready = /* @__PURE__ */ Promise.all([
  /* @__PURE__ */ useUniDirective("form-validate", {
    mounted(el, binding) {
      getBoundedInstance(el, "form.validation", (ele) => {
        return new UnicornFormValidation(ele, JSON.parse(binding.value || "{}"));
      });
    },
    updated(el, binding) {
      const instance = getBoundedInstance(el, "form.validation");
      instance.mergeOptions(JSON.parse(binding.value || "{}"));
    }
  }),
  /* @__PURE__ */ useUniDirective("field-validate", {
    mounted(el, binding) {
      getBoundedInstance(el, "field.validation", (ele) => {
        return new UnicornFieldValidation(ele, JSON.parse(binding.value || "{}"));
      });
    },
    updated(el, binding) {
      const instance = getBoundedInstance(el, "field.validation");
      instance.mergeOptions(JSON.parse(binding.value || "{}") || {});
    }
  })
]);
function handleParamValue(value) {
  if (!isNaN(Number(value))) {
    return Number(value);
  }
  if (value === "null") {
    return null;
  }
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return true;
  }
  return value;
}
export {
  UnicornFieldValidation,
  UnicornFormValidation,
  ready,
  validatorHandlers as validators
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGlvbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1bnljb2RlL3B1bnljb2RlLmVzNi5qcyIsIi4uLy4uLy4uL3NyYy9tb2R1bGUvdmFsaWRhdGlvbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbi8qKiBIaWdoZXN0IHBvc2l0aXZlIHNpZ25lZCAzMi1iaXQgZmxvYXQgdmFsdWUgKi9cbmNvbnN0IG1heEludCA9IDIxNDc0ODM2NDc7IC8vIGFrYS4gMHg3RkZGRkZGRiBvciAyXjMxLTFcblxuLyoqIEJvb3RzdHJpbmcgcGFyYW1ldGVycyAqL1xuY29uc3QgYmFzZSA9IDM2O1xuY29uc3QgdE1pbiA9IDE7XG5jb25zdCB0TWF4ID0gMjY7XG5jb25zdCBza2V3ID0gMzg7XG5jb25zdCBkYW1wID0gNzAwO1xuY29uc3QgaW5pdGlhbEJpYXMgPSA3MjtcbmNvbnN0IGluaXRpYWxOID0gMTI4OyAvLyAweDgwXG5jb25zdCBkZWxpbWl0ZXIgPSAnLSc7IC8vICdcXHgyRCdcblxuLyoqIFJlZ3VsYXIgZXhwcmVzc2lvbnMgKi9cbmNvbnN0IHJlZ2V4UHVueWNvZGUgPSAvXnhuLS0vO1xuY29uc3QgcmVnZXhOb25BU0NJSSA9IC9bXlxcMC1cXHg3Rl0vOyAvLyBOb3RlOiBVKzAwN0YgREVMIGlzIGV4Y2x1ZGVkIHRvby5cbmNvbnN0IHJlZ2V4U2VwYXJhdG9ycyA9IC9bXFx4MkVcXHUzMDAyXFx1RkYwRVxcdUZGNjFdL2c7IC8vIFJGQyAzNDkwIHNlcGFyYXRvcnNcblxuLyoqIEVycm9yIG1lc3NhZ2VzICovXG5jb25zdCBlcnJvcnMgPSB7XG5cdCdvdmVyZmxvdyc6ICdPdmVyZmxvdzogaW5wdXQgbmVlZHMgd2lkZXIgaW50ZWdlcnMgdG8gcHJvY2VzcycsXG5cdCdub3QtYmFzaWMnOiAnSWxsZWdhbCBpbnB1dCA+PSAweDgwIChub3QgYSBiYXNpYyBjb2RlIHBvaW50KScsXG5cdCdpbnZhbGlkLWlucHV0JzogJ0ludmFsaWQgaW5wdXQnXG59O1xuXG4vKiogQ29udmVuaWVuY2Ugc2hvcnRjdXRzICovXG5jb25zdCBiYXNlTWludXNUTWluID0gYmFzZSAtIHRNaW47XG5jb25zdCBmbG9vciA9IE1hdGguZmxvb3I7XG5jb25zdCBzdHJpbmdGcm9tQ2hhckNvZGUgPSBTdHJpbmcuZnJvbUNoYXJDb2RlO1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuLyoqXG4gKiBBIGdlbmVyaWMgZXJyb3IgdXRpbGl0eSBmdW5jdGlvbi5cbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZSBUaGUgZXJyb3IgdHlwZS5cbiAqIEByZXR1cm5zIHtFcnJvcn0gVGhyb3dzIGEgYFJhbmdlRXJyb3JgIHdpdGggdGhlIGFwcGxpY2FibGUgZXJyb3IgbWVzc2FnZS5cbiAqL1xuZnVuY3Rpb24gZXJyb3IodHlwZSkge1xuXHR0aHJvdyBuZXcgUmFuZ2VFcnJvcihlcnJvcnNbdHlwZV0pO1xufVxuXG4vKipcbiAqIEEgZ2VuZXJpYyBgQXJyYXkjbWFwYCB1dGlsaXR5IGZ1bmN0aW9uLlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgZnVuY3Rpb24gdGhhdCBnZXRzIGNhbGxlZCBmb3IgZXZlcnkgYXJyYXlcbiAqIGl0ZW0uXG4gKiBAcmV0dXJucyB7QXJyYXl9IEEgbmV3IGFycmF5IG9mIHZhbHVlcyByZXR1cm5lZCBieSB0aGUgY2FsbGJhY2sgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIG1hcChhcnJheSwgY2FsbGJhY2spIHtcblx0Y29uc3QgcmVzdWx0ID0gW107XG5cdGxldCBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cdHdoaWxlIChsZW5ndGgtLSkge1xuXHRcdHJlc3VsdFtsZW5ndGhdID0gY2FsbGJhY2soYXJyYXlbbGVuZ3RoXSk7XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBBIHNpbXBsZSBgQXJyYXkjbWFwYC1saWtlIHdyYXBwZXIgdG8gd29yayB3aXRoIGRvbWFpbiBuYW1lIHN0cmluZ3Mgb3IgZW1haWxcbiAqIGFkZHJlc3Nlcy5cbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge1N0cmluZ30gZG9tYWluIFRoZSBkb21haW4gbmFtZSBvciBlbWFpbCBhZGRyZXNzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgVGhlIGZ1bmN0aW9uIHRoYXQgZ2V0cyBjYWxsZWQgZm9yIGV2ZXJ5XG4gKiBjaGFyYWN0ZXIuXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBBIG5ldyBzdHJpbmcgb2YgY2hhcmFjdGVycyByZXR1cm5lZCBieSB0aGUgY2FsbGJhY2tcbiAqIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBtYXBEb21haW4oZG9tYWluLCBjYWxsYmFjaykge1xuXHRjb25zdCBwYXJ0cyA9IGRvbWFpbi5zcGxpdCgnQCcpO1xuXHRsZXQgcmVzdWx0ID0gJyc7XG5cdGlmIChwYXJ0cy5sZW5ndGggPiAxKSB7XG5cdFx0Ly8gSW4gZW1haWwgYWRkcmVzc2VzLCBvbmx5IHRoZSBkb21haW4gbmFtZSBzaG91bGQgYmUgcHVueWNvZGVkLiBMZWF2ZVxuXHRcdC8vIHRoZSBsb2NhbCBwYXJ0IChpLmUuIGV2ZXJ5dGhpbmcgdXAgdG8gYEBgKSBpbnRhY3QuXG5cdFx0cmVzdWx0ID0gcGFydHNbMF0gKyAnQCc7XG5cdFx0ZG9tYWluID0gcGFydHNbMV07XG5cdH1cblx0Ly8gQXZvaWQgYHNwbGl0KHJlZ2V4KWAgZm9yIElFOCBjb21wYXRpYmlsaXR5LiBTZWUgIzE3LlxuXHRkb21haW4gPSBkb21haW4ucmVwbGFjZShyZWdleFNlcGFyYXRvcnMsICdcXHgyRScpO1xuXHRjb25zdCBsYWJlbHMgPSBkb21haW4uc3BsaXQoJy4nKTtcblx0Y29uc3QgZW5jb2RlZCA9IG1hcChsYWJlbHMsIGNhbGxiYWNrKS5qb2luKCcuJyk7XG5cdHJldHVybiByZXN1bHQgKyBlbmNvZGVkO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgY29udGFpbmluZyB0aGUgbnVtZXJpYyBjb2RlIHBvaW50cyBvZiBlYWNoIFVuaWNvZGVcbiAqIGNoYXJhY3RlciBpbiB0aGUgc3RyaW5nLiBXaGlsZSBKYXZhU2NyaXB0IHVzZXMgVUNTLTIgaW50ZXJuYWxseSxcbiAqIHRoaXMgZnVuY3Rpb24gd2lsbCBjb252ZXJ0IGEgcGFpciBvZiBzdXJyb2dhdGUgaGFsdmVzIChlYWNoIG9mIHdoaWNoXG4gKiBVQ1MtMiBleHBvc2VzIGFzIHNlcGFyYXRlIGNoYXJhY3RlcnMpIGludG8gYSBzaW5nbGUgY29kZSBwb2ludCxcbiAqIG1hdGNoaW5nIFVURi0xNi5cbiAqIEBzZWUgYHB1bnljb2RlLnVjczIuZW5jb2RlYFxuICogQHNlZSA8aHR0cHM6Ly9tYXRoaWFzYnluZW5zLmJlL25vdGVzL2phdmFzY3JpcHQtZW5jb2Rpbmc+XG4gKiBAbWVtYmVyT2YgcHVueWNvZGUudWNzMlxuICogQG5hbWUgZGVjb2RlXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyaW5nIFRoZSBVbmljb2RlIGlucHV0IHN0cmluZyAoVUNTLTIpLlxuICogQHJldHVybnMge0FycmF5fSBUaGUgbmV3IGFycmF5IG9mIGNvZGUgcG9pbnRzLlxuICovXG5mdW5jdGlvbiB1Y3MyZGVjb2RlKHN0cmluZykge1xuXHRjb25zdCBvdXRwdXQgPSBbXTtcblx0bGV0IGNvdW50ZXIgPSAwO1xuXHRjb25zdCBsZW5ndGggPSBzdHJpbmcubGVuZ3RoO1xuXHR3aGlsZSAoY291bnRlciA8IGxlbmd0aCkge1xuXHRcdGNvbnN0IHZhbHVlID0gc3RyaW5nLmNoYXJDb2RlQXQoY291bnRlcisrKTtcblx0XHRpZiAodmFsdWUgPj0gMHhEODAwICYmIHZhbHVlIDw9IDB4REJGRiAmJiBjb3VudGVyIDwgbGVuZ3RoKSB7XG5cdFx0XHQvLyBJdCdzIGEgaGlnaCBzdXJyb2dhdGUsIGFuZCB0aGVyZSBpcyBhIG5leHQgY2hhcmFjdGVyLlxuXHRcdFx0Y29uc3QgZXh0cmEgPSBzdHJpbmcuY2hhckNvZGVBdChjb3VudGVyKyspO1xuXHRcdFx0aWYgKChleHRyYSAmIDB4RkMwMCkgPT0gMHhEQzAwKSB7IC8vIExvdyBzdXJyb2dhdGUuXG5cdFx0XHRcdG91dHB1dC5wdXNoKCgodmFsdWUgJiAweDNGRikgPDwgMTApICsgKGV4dHJhICYgMHgzRkYpICsgMHgxMDAwMCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBJdCdzIGFuIHVubWF0Y2hlZCBzdXJyb2dhdGU7IG9ubHkgYXBwZW5kIHRoaXMgY29kZSB1bml0LCBpbiBjYXNlIHRoZVxuXHRcdFx0XHQvLyBuZXh0IGNvZGUgdW5pdCBpcyB0aGUgaGlnaCBzdXJyb2dhdGUgb2YgYSBzdXJyb2dhdGUgcGFpci5cblx0XHRcdFx0b3V0cHV0LnB1c2godmFsdWUpO1xuXHRcdFx0XHRjb3VudGVyLS07XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdG91dHB1dC5wdXNoKHZhbHVlKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIG91dHB1dDtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgc3RyaW5nIGJhc2VkIG9uIGFuIGFycmF5IG9mIG51bWVyaWMgY29kZSBwb2ludHMuXG4gKiBAc2VlIGBwdW55Y29kZS51Y3MyLmRlY29kZWBcbiAqIEBtZW1iZXJPZiBwdW55Y29kZS51Y3MyXG4gKiBAbmFtZSBlbmNvZGVcbiAqIEBwYXJhbSB7QXJyYXl9IGNvZGVQb2ludHMgVGhlIGFycmF5IG9mIG51bWVyaWMgY29kZSBwb2ludHMuXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgbmV3IFVuaWNvZGUgc3RyaW5nIChVQ1MtMikuXG4gKi9cbmNvbnN0IHVjczJlbmNvZGUgPSBjb2RlUG9pbnRzID0+IFN0cmluZy5mcm9tQ29kZVBvaW50KC4uLmNvZGVQb2ludHMpO1xuXG4vKipcbiAqIENvbnZlcnRzIGEgYmFzaWMgY29kZSBwb2ludCBpbnRvIGEgZGlnaXQvaW50ZWdlci5cbiAqIEBzZWUgYGRpZ2l0VG9CYXNpYygpYFxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7TnVtYmVyfSBjb2RlUG9pbnQgVGhlIGJhc2ljIG51bWVyaWMgY29kZSBwb2ludCB2YWx1ZS5cbiAqIEByZXR1cm5zIHtOdW1iZXJ9IFRoZSBudW1lcmljIHZhbHVlIG9mIGEgYmFzaWMgY29kZSBwb2ludCAoZm9yIHVzZSBpblxuICogcmVwcmVzZW50aW5nIGludGVnZXJzKSBpbiB0aGUgcmFuZ2UgYDBgIHRvIGBiYXNlIC0gMWAsIG9yIGBiYXNlYCBpZlxuICogdGhlIGNvZGUgcG9pbnQgZG9lcyBub3QgcmVwcmVzZW50IGEgdmFsdWUuXG4gKi9cbmNvbnN0IGJhc2ljVG9EaWdpdCA9IGZ1bmN0aW9uKGNvZGVQb2ludCkge1xuXHRpZiAoY29kZVBvaW50ID49IDB4MzAgJiYgY29kZVBvaW50IDwgMHgzQSkge1xuXHRcdHJldHVybiAyNiArIChjb2RlUG9pbnQgLSAweDMwKTtcblx0fVxuXHRpZiAoY29kZVBvaW50ID49IDB4NDEgJiYgY29kZVBvaW50IDwgMHg1Qikge1xuXHRcdHJldHVybiBjb2RlUG9pbnQgLSAweDQxO1xuXHR9XG5cdGlmIChjb2RlUG9pbnQgPj0gMHg2MSAmJiBjb2RlUG9pbnQgPCAweDdCKSB7XG5cdFx0cmV0dXJuIGNvZGVQb2ludCAtIDB4NjE7XG5cdH1cblx0cmV0dXJuIGJhc2U7XG59O1xuXG4vKipcbiAqIENvbnZlcnRzIGEgZGlnaXQvaW50ZWdlciBpbnRvIGEgYmFzaWMgY29kZSBwb2ludC5cbiAqIEBzZWUgYGJhc2ljVG9EaWdpdCgpYFxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7TnVtYmVyfSBkaWdpdCBUaGUgbnVtZXJpYyB2YWx1ZSBvZiBhIGJhc2ljIGNvZGUgcG9pbnQuXG4gKiBAcmV0dXJucyB7TnVtYmVyfSBUaGUgYmFzaWMgY29kZSBwb2ludCB3aG9zZSB2YWx1ZSAod2hlbiB1c2VkIGZvclxuICogcmVwcmVzZW50aW5nIGludGVnZXJzKSBpcyBgZGlnaXRgLCB3aGljaCBuZWVkcyB0byBiZSBpbiB0aGUgcmFuZ2VcbiAqIGAwYCB0byBgYmFzZSAtIDFgLiBJZiBgZmxhZ2AgaXMgbm9uLXplcm8sIHRoZSB1cHBlcmNhc2UgZm9ybSBpc1xuICogdXNlZDsgZWxzZSwgdGhlIGxvd2VyY2FzZSBmb3JtIGlzIHVzZWQuIFRoZSBiZWhhdmlvciBpcyB1bmRlZmluZWRcbiAqIGlmIGBmbGFnYCBpcyBub24temVybyBhbmQgYGRpZ2l0YCBoYXMgbm8gdXBwZXJjYXNlIGZvcm0uXG4gKi9cbmNvbnN0IGRpZ2l0VG9CYXNpYyA9IGZ1bmN0aW9uKGRpZ2l0LCBmbGFnKSB7XG5cdC8vICAwLi4yNSBtYXAgdG8gQVNDSUkgYS4ueiBvciBBLi5aXG5cdC8vIDI2Li4zNSBtYXAgdG8gQVNDSUkgMC4uOVxuXHRyZXR1cm4gZGlnaXQgKyAyMiArIDc1ICogKGRpZ2l0IDwgMjYpIC0gKChmbGFnICE9IDApIDw8IDUpO1xufTtcblxuLyoqXG4gKiBCaWFzIGFkYXB0YXRpb24gZnVuY3Rpb24gYXMgcGVyIHNlY3Rpb24gMy40IG9mIFJGQyAzNDkyLlxuICogaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzM0OTIjc2VjdGlvbi0zLjRcbiAqIEBwcml2YXRlXG4gKi9cbmNvbnN0IGFkYXB0ID0gZnVuY3Rpb24oZGVsdGEsIG51bVBvaW50cywgZmlyc3RUaW1lKSB7XG5cdGxldCBrID0gMDtcblx0ZGVsdGEgPSBmaXJzdFRpbWUgPyBmbG9vcihkZWx0YSAvIGRhbXApIDogZGVsdGEgPj4gMTtcblx0ZGVsdGEgKz0gZmxvb3IoZGVsdGEgLyBudW1Qb2ludHMpO1xuXHRmb3IgKC8qIG5vIGluaXRpYWxpemF0aW9uICovOyBkZWx0YSA+IGJhc2VNaW51c1RNaW4gKiB0TWF4ID4+IDE7IGsgKz0gYmFzZSkge1xuXHRcdGRlbHRhID0gZmxvb3IoZGVsdGEgLyBiYXNlTWludXNUTWluKTtcblx0fVxuXHRyZXR1cm4gZmxvb3IoayArIChiYXNlTWludXNUTWluICsgMSkgKiBkZWx0YSAvIChkZWx0YSArIHNrZXcpKTtcbn07XG5cbi8qKlxuICogQ29udmVydHMgYSBQdW55Y29kZSBzdHJpbmcgb2YgQVNDSUktb25seSBzeW1ib2xzIHRvIGEgc3RyaW5nIG9mIFVuaWNvZGVcbiAqIHN5bWJvbHMuXG4gKiBAbWVtYmVyT2YgcHVueWNvZGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBpbnB1dCBUaGUgUHVueWNvZGUgc3RyaW5nIG9mIEFTQ0lJLW9ubHkgc3ltYm9scy5cbiAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSByZXN1bHRpbmcgc3RyaW5nIG9mIFVuaWNvZGUgc3ltYm9scy5cbiAqL1xuY29uc3QgZGVjb2RlID0gZnVuY3Rpb24oaW5wdXQpIHtcblx0Ly8gRG9uJ3QgdXNlIFVDUy0yLlxuXHRjb25zdCBvdXRwdXQgPSBbXTtcblx0Y29uc3QgaW5wdXRMZW5ndGggPSBpbnB1dC5sZW5ndGg7XG5cdGxldCBpID0gMDtcblx0bGV0IG4gPSBpbml0aWFsTjtcblx0bGV0IGJpYXMgPSBpbml0aWFsQmlhcztcblxuXHQvLyBIYW5kbGUgdGhlIGJhc2ljIGNvZGUgcG9pbnRzOiBsZXQgYGJhc2ljYCBiZSB0aGUgbnVtYmVyIG9mIGlucHV0IGNvZGVcblx0Ly8gcG9pbnRzIGJlZm9yZSB0aGUgbGFzdCBkZWxpbWl0ZXIsIG9yIGAwYCBpZiB0aGVyZSBpcyBub25lLCB0aGVuIGNvcHlcblx0Ly8gdGhlIGZpcnN0IGJhc2ljIGNvZGUgcG9pbnRzIHRvIHRoZSBvdXRwdXQuXG5cblx0bGV0IGJhc2ljID0gaW5wdXQubGFzdEluZGV4T2YoZGVsaW1pdGVyKTtcblx0aWYgKGJhc2ljIDwgMCkge1xuXHRcdGJhc2ljID0gMDtcblx0fVxuXG5cdGZvciAobGV0IGogPSAwOyBqIDwgYmFzaWM7ICsraikge1xuXHRcdC8vIGlmIGl0J3Mgbm90IGEgYmFzaWMgY29kZSBwb2ludFxuXHRcdGlmIChpbnB1dC5jaGFyQ29kZUF0KGopID49IDB4ODApIHtcblx0XHRcdGVycm9yKCdub3QtYmFzaWMnKTtcblx0XHR9XG5cdFx0b3V0cHV0LnB1c2goaW5wdXQuY2hhckNvZGVBdChqKSk7XG5cdH1cblxuXHQvLyBNYWluIGRlY29kaW5nIGxvb3A6IHN0YXJ0IGp1c3QgYWZ0ZXIgdGhlIGxhc3QgZGVsaW1pdGVyIGlmIGFueSBiYXNpYyBjb2RlXG5cdC8vIHBvaW50cyB3ZXJlIGNvcGllZDsgc3RhcnQgYXQgdGhlIGJlZ2lubmluZyBvdGhlcndpc2UuXG5cblx0Zm9yIChsZXQgaW5kZXggPSBiYXNpYyA+IDAgPyBiYXNpYyArIDEgOiAwOyBpbmRleCA8IGlucHV0TGVuZ3RoOyAvKiBubyBmaW5hbCBleHByZXNzaW9uICovKSB7XG5cblx0XHQvLyBgaW5kZXhgIGlzIHRoZSBpbmRleCBvZiB0aGUgbmV4dCBjaGFyYWN0ZXIgdG8gYmUgY29uc3VtZWQuXG5cdFx0Ly8gRGVjb2RlIGEgZ2VuZXJhbGl6ZWQgdmFyaWFibGUtbGVuZ3RoIGludGVnZXIgaW50byBgZGVsdGFgLFxuXHRcdC8vIHdoaWNoIGdldHMgYWRkZWQgdG8gYGlgLiBUaGUgb3ZlcmZsb3cgY2hlY2tpbmcgaXMgZWFzaWVyXG5cdFx0Ly8gaWYgd2UgaW5jcmVhc2UgYGlgIGFzIHdlIGdvLCB0aGVuIHN1YnRyYWN0IG9mZiBpdHMgc3RhcnRpbmdcblx0XHQvLyB2YWx1ZSBhdCB0aGUgZW5kIHRvIG9idGFpbiBgZGVsdGFgLlxuXHRcdGNvbnN0IG9sZGkgPSBpO1xuXHRcdGZvciAobGV0IHcgPSAxLCBrID0gYmFzZTsgLyogbm8gY29uZGl0aW9uICovOyBrICs9IGJhc2UpIHtcblxuXHRcdFx0aWYgKGluZGV4ID49IGlucHV0TGVuZ3RoKSB7XG5cdFx0XHRcdGVycm9yKCdpbnZhbGlkLWlucHV0Jyk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGRpZ2l0ID0gYmFzaWNUb0RpZ2l0KGlucHV0LmNoYXJDb2RlQXQoaW5kZXgrKykpO1xuXG5cdFx0XHRpZiAoZGlnaXQgPj0gYmFzZSkge1xuXHRcdFx0XHRlcnJvcignaW52YWxpZC1pbnB1dCcpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGRpZ2l0ID4gZmxvb3IoKG1heEludCAtIGkpIC8gdykpIHtcblx0XHRcdFx0ZXJyb3IoJ292ZXJmbG93Jyk7XG5cdFx0XHR9XG5cblx0XHRcdGkgKz0gZGlnaXQgKiB3O1xuXHRcdFx0Y29uc3QgdCA9IGsgPD0gYmlhcyA/IHRNaW4gOiAoayA+PSBiaWFzICsgdE1heCA/IHRNYXggOiBrIC0gYmlhcyk7XG5cblx0XHRcdGlmIChkaWdpdCA8IHQpIHtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGJhc2VNaW51c1QgPSBiYXNlIC0gdDtcblx0XHRcdGlmICh3ID4gZmxvb3IobWF4SW50IC8gYmFzZU1pbnVzVCkpIHtcblx0XHRcdFx0ZXJyb3IoJ292ZXJmbG93Jyk7XG5cdFx0XHR9XG5cblx0XHRcdHcgKj0gYmFzZU1pbnVzVDtcblxuXHRcdH1cblxuXHRcdGNvbnN0IG91dCA9IG91dHB1dC5sZW5ndGggKyAxO1xuXHRcdGJpYXMgPSBhZGFwdChpIC0gb2xkaSwgb3V0LCBvbGRpID09IDApO1xuXG5cdFx0Ly8gYGlgIHdhcyBzdXBwb3NlZCB0byB3cmFwIGFyb3VuZCBmcm9tIGBvdXRgIHRvIGAwYCxcblx0XHQvLyBpbmNyZW1lbnRpbmcgYG5gIGVhY2ggdGltZSwgc28gd2UnbGwgZml4IHRoYXQgbm93OlxuXHRcdGlmIChmbG9vcihpIC8gb3V0KSA+IG1heEludCAtIG4pIHtcblx0XHRcdGVycm9yKCdvdmVyZmxvdycpO1xuXHRcdH1cblxuXHRcdG4gKz0gZmxvb3IoaSAvIG91dCk7XG5cdFx0aSAlPSBvdXQ7XG5cblx0XHQvLyBJbnNlcnQgYG5gIGF0IHBvc2l0aW9uIGBpYCBvZiB0aGUgb3V0cHV0LlxuXHRcdG91dHB1dC5zcGxpY2UoaSsrLCAwLCBuKTtcblxuXHR9XG5cblx0cmV0dXJuIFN0cmluZy5mcm9tQ29kZVBvaW50KC4uLm91dHB1dCk7XG59O1xuXG4vKipcbiAqIENvbnZlcnRzIGEgc3RyaW5nIG9mIFVuaWNvZGUgc3ltYm9scyAoZS5nLiBhIGRvbWFpbiBuYW1lIGxhYmVsKSB0byBhXG4gKiBQdW55Y29kZSBzdHJpbmcgb2YgQVNDSUktb25seSBzeW1ib2xzLlxuICogQG1lbWJlck9mIHB1bnljb2RlXG4gKiBAcGFyYW0ge1N0cmluZ30gaW5wdXQgVGhlIHN0cmluZyBvZiBVbmljb2RlIHN5bWJvbHMuXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgcmVzdWx0aW5nIFB1bnljb2RlIHN0cmluZyBvZiBBU0NJSS1vbmx5IHN5bWJvbHMuXG4gKi9cbmNvbnN0IGVuY29kZSA9IGZ1bmN0aW9uKGlucHV0KSB7XG5cdGNvbnN0IG91dHB1dCA9IFtdO1xuXG5cdC8vIENvbnZlcnQgdGhlIGlucHV0IGluIFVDUy0yIHRvIGFuIGFycmF5IG9mIFVuaWNvZGUgY29kZSBwb2ludHMuXG5cdGlucHV0ID0gdWNzMmRlY29kZShpbnB1dCk7XG5cblx0Ly8gQ2FjaGUgdGhlIGxlbmd0aC5cblx0Y29uc3QgaW5wdXRMZW5ndGggPSBpbnB1dC5sZW5ndGg7XG5cblx0Ly8gSW5pdGlhbGl6ZSB0aGUgc3RhdGUuXG5cdGxldCBuID0gaW5pdGlhbE47XG5cdGxldCBkZWx0YSA9IDA7XG5cdGxldCBiaWFzID0gaW5pdGlhbEJpYXM7XG5cblx0Ly8gSGFuZGxlIHRoZSBiYXNpYyBjb2RlIHBvaW50cy5cblx0Zm9yIChjb25zdCBjdXJyZW50VmFsdWUgb2YgaW5wdXQpIHtcblx0XHRpZiAoY3VycmVudFZhbHVlIDwgMHg4MCkge1xuXHRcdFx0b3V0cHV0LnB1c2goc3RyaW5nRnJvbUNoYXJDb2RlKGN1cnJlbnRWYWx1ZSkpO1xuXHRcdH1cblx0fVxuXG5cdGNvbnN0IGJhc2ljTGVuZ3RoID0gb3V0cHV0Lmxlbmd0aDtcblx0bGV0IGhhbmRsZWRDUENvdW50ID0gYmFzaWNMZW5ndGg7XG5cblx0Ly8gYGhhbmRsZWRDUENvdW50YCBpcyB0aGUgbnVtYmVyIG9mIGNvZGUgcG9pbnRzIHRoYXQgaGF2ZSBiZWVuIGhhbmRsZWQ7XG5cdC8vIGBiYXNpY0xlbmd0aGAgaXMgdGhlIG51bWJlciBvZiBiYXNpYyBjb2RlIHBvaW50cy5cblxuXHQvLyBGaW5pc2ggdGhlIGJhc2ljIHN0cmluZyB3aXRoIGEgZGVsaW1pdGVyIHVubGVzcyBpdCdzIGVtcHR5LlxuXHRpZiAoYmFzaWNMZW5ndGgpIHtcblx0XHRvdXRwdXQucHVzaChkZWxpbWl0ZXIpO1xuXHR9XG5cblx0Ly8gTWFpbiBlbmNvZGluZyBsb29wOlxuXHR3aGlsZSAoaGFuZGxlZENQQ291bnQgPCBpbnB1dExlbmd0aCkge1xuXG5cdFx0Ly8gQWxsIG5vbi1iYXNpYyBjb2RlIHBvaW50cyA8IG4gaGF2ZSBiZWVuIGhhbmRsZWQgYWxyZWFkeS4gRmluZCB0aGUgbmV4dFxuXHRcdC8vIGxhcmdlciBvbmU6XG5cdFx0bGV0IG0gPSBtYXhJbnQ7XG5cdFx0Zm9yIChjb25zdCBjdXJyZW50VmFsdWUgb2YgaW5wdXQpIHtcblx0XHRcdGlmIChjdXJyZW50VmFsdWUgPj0gbiAmJiBjdXJyZW50VmFsdWUgPCBtKSB7XG5cdFx0XHRcdG0gPSBjdXJyZW50VmFsdWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gSW5jcmVhc2UgYGRlbHRhYCBlbm91Z2ggdG8gYWR2YW5jZSB0aGUgZGVjb2RlcidzIDxuLGk+IHN0YXRlIHRvIDxtLDA+LFxuXHRcdC8vIGJ1dCBndWFyZCBhZ2FpbnN0IG92ZXJmbG93LlxuXHRcdGNvbnN0IGhhbmRsZWRDUENvdW50UGx1c09uZSA9IGhhbmRsZWRDUENvdW50ICsgMTtcblx0XHRpZiAobSAtIG4gPiBmbG9vcigobWF4SW50IC0gZGVsdGEpIC8gaGFuZGxlZENQQ291bnRQbHVzT25lKSkge1xuXHRcdFx0ZXJyb3IoJ292ZXJmbG93Jyk7XG5cdFx0fVxuXG5cdFx0ZGVsdGEgKz0gKG0gLSBuKSAqIGhhbmRsZWRDUENvdW50UGx1c09uZTtcblx0XHRuID0gbTtcblxuXHRcdGZvciAoY29uc3QgY3VycmVudFZhbHVlIG9mIGlucHV0KSB7XG5cdFx0XHRpZiAoY3VycmVudFZhbHVlIDwgbiAmJiArK2RlbHRhID4gbWF4SW50KSB7XG5cdFx0XHRcdGVycm9yKCdvdmVyZmxvdycpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGN1cnJlbnRWYWx1ZSA9PT0gbikge1xuXHRcdFx0XHQvLyBSZXByZXNlbnQgZGVsdGEgYXMgYSBnZW5lcmFsaXplZCB2YXJpYWJsZS1sZW5ndGggaW50ZWdlci5cblx0XHRcdFx0bGV0IHEgPSBkZWx0YTtcblx0XHRcdFx0Zm9yIChsZXQgayA9IGJhc2U7IC8qIG5vIGNvbmRpdGlvbiAqLzsgayArPSBiYXNlKSB7XG5cdFx0XHRcdFx0Y29uc3QgdCA9IGsgPD0gYmlhcyA/IHRNaW4gOiAoayA+PSBiaWFzICsgdE1heCA/IHRNYXggOiBrIC0gYmlhcyk7XG5cdFx0XHRcdFx0aWYgKHEgPCB0KSB7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y29uc3QgcU1pbnVzVCA9IHEgLSB0O1xuXHRcdFx0XHRcdGNvbnN0IGJhc2VNaW51c1QgPSBiYXNlIC0gdDtcblx0XHRcdFx0XHRvdXRwdXQucHVzaChcblx0XHRcdFx0XHRcdHN0cmluZ0Zyb21DaGFyQ29kZShkaWdpdFRvQmFzaWModCArIHFNaW51c1QgJSBiYXNlTWludXNULCAwKSlcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdHEgPSBmbG9vcihxTWludXNUIC8gYmFzZU1pbnVzVCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRvdXRwdXQucHVzaChzdHJpbmdGcm9tQ2hhckNvZGUoZGlnaXRUb0Jhc2ljKHEsIDApKSk7XG5cdFx0XHRcdGJpYXMgPSBhZGFwdChkZWx0YSwgaGFuZGxlZENQQ291bnRQbHVzT25lLCBoYW5kbGVkQ1BDb3VudCA9PT0gYmFzaWNMZW5ndGgpO1xuXHRcdFx0XHRkZWx0YSA9IDA7XG5cdFx0XHRcdCsraGFuZGxlZENQQ291bnQ7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0KytkZWx0YTtcblx0XHQrK247XG5cblx0fVxuXHRyZXR1cm4gb3V0cHV0LmpvaW4oJycpO1xufTtcblxuLyoqXG4gKiBDb252ZXJ0cyBhIFB1bnljb2RlIHN0cmluZyByZXByZXNlbnRpbmcgYSBkb21haW4gbmFtZSBvciBhbiBlbWFpbCBhZGRyZXNzXG4gKiB0byBVbmljb2RlLiBPbmx5IHRoZSBQdW55Y29kZWQgcGFydHMgb2YgdGhlIGlucHV0IHdpbGwgYmUgY29udmVydGVkLCBpLmUuXG4gKiBpdCBkb2Vzbid0IG1hdHRlciBpZiB5b3UgY2FsbCBpdCBvbiBhIHN0cmluZyB0aGF0IGhhcyBhbHJlYWR5IGJlZW5cbiAqIGNvbnZlcnRlZCB0byBVbmljb2RlLlxuICogQG1lbWJlck9mIHB1bnljb2RlXG4gKiBAcGFyYW0ge1N0cmluZ30gaW5wdXQgVGhlIFB1bnljb2RlZCBkb21haW4gbmFtZSBvciBlbWFpbCBhZGRyZXNzIHRvXG4gKiBjb252ZXJ0IHRvIFVuaWNvZGUuXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgVW5pY29kZSByZXByZXNlbnRhdGlvbiBvZiB0aGUgZ2l2ZW4gUHVueWNvZGVcbiAqIHN0cmluZy5cbiAqL1xuY29uc3QgdG9Vbmljb2RlID0gZnVuY3Rpb24oaW5wdXQpIHtcblx0cmV0dXJuIG1hcERvbWFpbihpbnB1dCwgZnVuY3Rpb24oc3RyaW5nKSB7XG5cdFx0cmV0dXJuIHJlZ2V4UHVueWNvZGUudGVzdChzdHJpbmcpXG5cdFx0XHQ/IGRlY29kZShzdHJpbmcuc2xpY2UoNCkudG9Mb3dlckNhc2UoKSlcblx0XHRcdDogc3RyaW5nO1xuXHR9KTtcbn07XG5cbi8qKlxuICogQ29udmVydHMgYSBVbmljb2RlIHN0cmluZyByZXByZXNlbnRpbmcgYSBkb21haW4gbmFtZSBvciBhbiBlbWFpbCBhZGRyZXNzIHRvXG4gKiBQdW55Y29kZS4gT25seSB0aGUgbm9uLUFTQ0lJIHBhcnRzIG9mIHRoZSBkb21haW4gbmFtZSB3aWxsIGJlIGNvbnZlcnRlZCxcbiAqIGkuZS4gaXQgZG9lc24ndCBtYXR0ZXIgaWYgeW91IGNhbGwgaXQgd2l0aCBhIGRvbWFpbiB0aGF0J3MgYWxyZWFkeSBpblxuICogQVNDSUkuXG4gKiBAbWVtYmVyT2YgcHVueWNvZGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBpbnB1dCBUaGUgZG9tYWluIG5hbWUgb3IgZW1haWwgYWRkcmVzcyB0byBjb252ZXJ0LCBhcyBhXG4gKiBVbmljb2RlIHN0cmluZy5cbiAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBQdW55Y29kZSByZXByZXNlbnRhdGlvbiBvZiB0aGUgZ2l2ZW4gZG9tYWluIG5hbWUgb3JcbiAqIGVtYWlsIGFkZHJlc3MuXG4gKi9cbmNvbnN0IHRvQVNDSUkgPSBmdW5jdGlvbihpbnB1dCkge1xuXHRyZXR1cm4gbWFwRG9tYWluKGlucHV0LCBmdW5jdGlvbihzdHJpbmcpIHtcblx0XHRyZXR1cm4gcmVnZXhOb25BU0NJSS50ZXN0KHN0cmluZylcblx0XHRcdD8gJ3huLS0nICsgZW5jb2RlKHN0cmluZylcblx0XHRcdDogc3RyaW5nO1xuXHR9KTtcbn07XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vKiogRGVmaW5lIHRoZSBwdWJsaWMgQVBJICovXG5jb25zdCBwdW55Y29kZSA9IHtcblx0LyoqXG5cdCAqIEEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgY3VycmVudCBQdW55Y29kZS5qcyB2ZXJzaW9uIG51bWJlci5cblx0ICogQG1lbWJlck9mIHB1bnljb2RlXG5cdCAqIEB0eXBlIFN0cmluZ1xuXHQgKi9cblx0J3ZlcnNpb24nOiAnMi4zLjEnLFxuXHQvKipcblx0ICogQW4gb2JqZWN0IG9mIG1ldGhvZHMgdG8gY29udmVydCBmcm9tIEphdmFTY3JpcHQncyBpbnRlcm5hbCBjaGFyYWN0ZXJcblx0ICogcmVwcmVzZW50YXRpb24gKFVDUy0yKSB0byBVbmljb2RlIGNvZGUgcG9pbnRzLCBhbmQgYmFjay5cblx0ICogQHNlZSA8aHR0cHM6Ly9tYXRoaWFzYnluZW5zLmJlL25vdGVzL2phdmFzY3JpcHQtZW5jb2Rpbmc+XG5cdCAqIEBtZW1iZXJPZiBwdW55Y29kZVxuXHQgKiBAdHlwZSBPYmplY3Rcblx0ICovXG5cdCd1Y3MyJzoge1xuXHRcdCdkZWNvZGUnOiB1Y3MyZGVjb2RlLFxuXHRcdCdlbmNvZGUnOiB1Y3MyZW5jb2RlXG5cdH0sXG5cdCdkZWNvZGUnOiBkZWNvZGUsXG5cdCdlbmNvZGUnOiBlbmNvZGUsXG5cdCd0b0FTQ0lJJzogdG9BU0NJSSxcblx0J3RvVW5pY29kZSc6IHRvVW5pY29kZVxufTtcblxuZXhwb3J0IHsgdWNzMmRlY29kZSwgdWNzMmVuY29kZSwgZGVjb2RlLCBlbmNvZGUsIHRvQVNDSUksIHRvVW5pY29kZSB9O1xuZXhwb3J0IGRlZmF1bHQgcHVueWNvZGU7XG4iLCJpbXBvcnQgeyB1c2VVbmlEaXJlY3RpdmUgfSBmcm9tICcuLi9jb21wb3NhYmxlJztcclxuaW1wb3J0IHsgZ2V0Qm91bmRlZEluc3RhbmNlLCBodG1sLCBzZWxlY3RBbGwsIHNlbGVjdE9uZSwgdHJhbnMsIHVzZVVJVGhlbWUgfSBmcm9tICcuLi9zZXJ2aWNlJztcclxuaW1wb3J0IHsgTnVsbGFibGUgfSBmcm9tICcuLi90eXBlcyc7XHJcbmltcG9ydCB7IG1lcmdlRGVlcCB9IGZyb20gJy4uL3V0aWxpdGllcyc7XHJcbmltcG9ydCAqIGFzIHB1bnljb2RlIGZyb20gJ3B1bnljb2RlJztcclxuXHJcbmV4cG9ydCBkZWNsYXJlIHR5cGUgVmFsaWRhdGlvbkhhbmRsZXIgPSAodmFsdWU6IGFueSwgaW5wdXQ6IEhUTUxFbGVtZW50LCBvcHRpb25zPzogUmVjb3JkPHN0cmluZywgYW55PiwgZnY/OiBVbmljb3JuRmllbGRWYWxpZGF0aW9uKSA9PiBhbnk7XHJcblxyXG5leHBvcnQgZGVjbGFyZSB0eXBlIFZhbGlkYXRvciA9IHtcclxuICBoYW5kbGVyOiBWYWxpZGF0aW9uSGFuZGxlcixcclxuICBvcHRpb25zPzogUmVjb3JkPHN0cmluZywgYW55PjtcclxufTtcclxuXHJcbmNvbnN0IHZhbGlkYXRvckhhbmRsZXJzOiBSZWNvcmQ8c3RyaW5nLCBWYWxpZGF0aW9uSGFuZGxlcj4gPSB7fTtcclxuXHJcbnR5cGUgSW5wdXRFbGVtZW50cyA9IEhUTUxJbnB1dEVsZW1lbnQgfCBIVE1MU2VsZWN0RWxlbWVudCB8IEhUTUxUZXh0QXJlYUVsZW1lbnQ7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEZvcm1WYWxpZGF0aW9uT3B0aW9ucyB7XHJcbiAgc2Nyb2xsOiBib29sZWFuO1xyXG4gIHZhbGlkYXRlZENsYXNzOiBudWxsO1xyXG4gIGZpZWxkU2VsZWN0b3I6IG51bGw7XHJcbiAgc2Nyb2xsT2Zmc2V0OiBudW1iZXI7XHJcbiAgZW5hYmxlZDogYm9vbGVhbjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBGaWVsZFZhbGlkYXRpb25PcHRpb25zIHtcclxuICB2YWxpZENsYXNzOiBzdHJpbmc7XHJcbiAgZXJyb3JTZWxlY3Rvcjogc3RyaW5nO1xyXG4gIGlucHV0T3B0aW9uczogYm9vbGVhbjtcclxuICBpbnB1dE9wdGlvbnNTZWxlY3Rvcjogc3RyaW5nO1xyXG4gIGZvcm1TZWxlY3Rvcjogc3RyaW5nO1xyXG4gIHNlbGVjdG9yOiBzdHJpbmc7XHJcbiAgaW5wdXRPcHRpb25zV3JhcHBlclNlbGVjdG9yOiBzdHJpbmc7XHJcbiAgZXZlbnRzOiBzdHJpbmdbXTtcclxuICBpbnZhbGlkQ2xhc3M6IHN0cmluZztcclxuICBlcnJvck1lc3NhZ2VDbGFzczogc3RyaW5nO1xyXG59XHJcblxyXG5jb25zdCBkZWZhdWx0T3B0aW9uczogRm9ybVZhbGlkYXRpb25PcHRpb25zID0ge1xyXG4gIHNjcm9sbDogZmFsc2UsXHJcbiAgc2Nyb2xsT2Zmc2V0OiAtMTAwLFxyXG4gIGVuYWJsZWQ6IHRydWUsXHJcbiAgZmllbGRTZWxlY3RvcjogbnVsbCxcclxuICB2YWxpZGF0ZWRDbGFzczogbnVsbCxcclxufTtcclxuXHJcbmNvbnN0IGRlZmF1bHRGaWVsZE9wdGlvbnM6IEZpZWxkVmFsaWRhdGlvbk9wdGlvbnMgPSB7XHJcbiAgZm9ybVNlbGVjdG9yOiAnW3VuaS1mb3JtLXZhbGlkYXRlXScsXHJcbiAgZXJyb3JTZWxlY3RvcjogJ1tkYXRhLWZpZWxkLWVycm9yXScsXHJcbiAgc2VsZWN0b3I6ICdpbnB1dFtkYXRhLWZpZWxkLWlucHV0XSwgc2VsZWN0W2RhdGEtZmllbGQtaW5wdXRdLCB0ZXh0YXJlYVtkYXRhLWZpZWxkLWlucHV0XScsXHJcbiAgdmFsaWRDbGFzczogJ2lzLXZhbGlkJyxcclxuICBpbnZhbGlkQ2xhc3M6ICdpcy1pbnZhbGlkJyxcclxuICBldmVudHM6IFsnY2hhbmdlJ10sXHJcbiAgZXJyb3JNZXNzYWdlQ2xhc3M6ICdpbnZhbGlkLXRvb2x0aXAnLFxyXG4gIGlucHV0T3B0aW9uczogZmFsc2UsXHJcbiAgaW5wdXRPcHRpb25zV3JhcHBlclNlbGVjdG9yOiAnZGl2W2RhdGEtZmllbGQtaW5wdXRdJyxcclxuICBpbnB1dE9wdGlvbnNTZWxlY3RvcjogJ1tkYXRhLWlucHV0LW9wdGlvbl0nXHJcbn07XHJcblxyXG5leHBvcnQgY2xhc3MgVW5pY29ybkZvcm1WYWxpZGF0aW9uIHtcclxuICBwcmVzZXRGaWVsZHM6IEhUTUxFbGVtZW50W10gPSBbXTtcclxuXHJcbiAgc3RhdGljIGdsb2JhbFZhbGlkYXRvcnM6IFJlY29yZDxzdHJpbmcsIFZhbGlkYXRvcj4gPSB7fTtcclxuXHJcbiAgdmFsaWRhdG9yczogUmVjb3JkPHN0cmluZywgVmFsaWRhdG9yPiA9IHt9O1xyXG4gIG9wdGlvbnM6IEZvcm1WYWxpZGF0aW9uT3B0aW9ucztcclxuICAkZm9ybTogSFRNTEVsZW1lbnQ7XHJcblxyXG4gIHN0YXRpYyBpcyA9ICd1bmktZm9ybS12YWxpZGF0ZSc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGVsOiBIVE1MRWxlbWVudCwgb3B0aW9uczogUGFydGlhbDxGb3JtVmFsaWRhdGlvbk9wdGlvbnM+ID0ge30pIHtcclxuICAgIHRoaXMuJGZvcm0gPSBzZWxlY3RPbmUoZWwpO1xyXG4gICAgdGhpcy5vcHRpb25zID0gdGhpcy5tZXJnZU9wdGlvbnMob3B0aW9ucyk7XHJcblxyXG4gICAgdGhpcy5yZWdpc3RlckRlZmF1bHRWYWxpZGF0b3JzKCk7XHJcblxyXG4gICAgdGhpcy5pbml0KCk7XHJcbiAgfVxyXG5cclxuICBtZXJnZU9wdGlvbnMob3B0aW9uczogUGFydGlhbDxGb3JtVmFsaWRhdGlvbk9wdGlvbnM+KSB7XHJcbiAgICAvLyBGaXggUEhQIGVtcHR5IGFycmF5IHRvIEpTT04gaXNzdWUuXHJcbiAgICBpZiAoQXJyYXkuaXNBcnJheShvcHRpb25zKSkge1xyXG4gICAgICBvcHRpb25zID0ge307XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucyA9IG1lcmdlRGVlcCh7fSwgZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHNjcm9sbEVuYWJsZWQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLnNjcm9sbDtcclxuICB9XHJcblxyXG4gIGdldCBzY3JvbGxPZmZzZXQoKSB7XHJcbiAgICByZXR1cm4gTnVtYmVyKHRoaXMub3B0aW9ucy5zY3JvbGxPZmZzZXQgfHwgLTEwMCk7XHJcbiAgfVxyXG5cclxuICBnZXQgZmllbGRTZWxlY3RvcigpIHtcclxuICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZmllbGRTZWxlY3RvciB8fCAnaW5wdXQsIHNlbGVjdCwgdGV4dGFyZWEnO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHZhbGlkYXRlZENsYXNzKCkge1xyXG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy52YWxpZGF0ZWRDbGFzcyB8fCAnd2FzLXZhbGlkYXRlZCc7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgaWYgKHRoaXMuJGZvcm0udGFnTmFtZSA9PT0gJ0ZPUk0nKSB7XHJcbiAgICAgIHRoaXMuJGZvcm0uc2V0QXR0cmlidXRlKCdub3ZhbGlkYXRlJywgJ3RydWUnKTtcclxuICAgICAgdGhpcy4kZm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCAoZXZlbnQpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmVuYWJsZWQgJiYgIXRoaXMudmFsaWRhdGVBbGwoKSkge1xyXG4gICAgICAgICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7IC8vIFN0b3AgZm9sbG93aW5nIGV2ZW50c1xyXG4gICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgIHRoaXMuJGZvcm0uZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2ludmFsaWQnKSk7XHJcblxyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH0sIGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnByZXBhcmVGaWVsZHModGhpcy5maW5kRE9NRmllbGRzKCkpO1xyXG4gICAgdGhpcy5wcmVwYXJlRmllbGRzKHRoaXMucHJlc2V0RmllbGRzKTtcclxuICB9XHJcblxyXG4gIGZpbmRET01GaWVsZHMoKTogSFRNTEVsZW1lbnRbXSB7XHJcbiAgICByZXR1cm4gc2VsZWN0QWxsKHRoaXMuJGZvcm0ucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4odGhpcy5maWVsZFNlbGVjdG9yKSk7XHJcbiAgfVxyXG5cclxuICBwcmVwYXJlRmllbGRzKGlucHV0czogSFRNTEVsZW1lbnRbXSk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgaW5wdXRzLmZvckVhY2goKGlucHV0KSA9PiB7XHJcbiAgICAgIHRoaXMucHJlcGFyZUZpZWxkV3JhcHBlcihpbnB1dCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBXYWl0IG5leHQgdGlja1xyXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gIH1cclxuXHJcbiAgcHJlcGFyZUZpZWxkV3JhcHBlcihpbnB1dDogSFRNTEVsZW1lbnQpOiBIVE1MRWxlbWVudCB8IG51bGwge1xyXG4gICAgaWYgKFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10uaW5kZXhPZihpbnB1dC50YWdOYW1lKSAhPT0gLTEpIHtcclxuICAgICAgbGV0IHdyYXBwZXI6IEhUTUxFbGVtZW50IHwgbnVsbCA9IGlucHV0LmNsb3Nlc3QoJ1t1bmktZmllbGQtdmFsaWRhdGVdJyk7XHJcblxyXG4gICAgICBpZiAoIXdyYXBwZXIpIHtcclxuICAgICAgICB3cmFwcGVyID0gaW5wdXQuY2xvc2VzdCgnW2RhdGEtaW5wdXQtY29udGFpbmVyXScpIHx8IGlucHV0LnBhcmVudEVsZW1lbnQ7XHJcblxyXG4gICAgICAgIHdyYXBwZXI/LnNldEF0dHJpYnV0ZSgndW5pLWZpZWxkLXZhbGlkYXRlJywgJ3t9Jyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB3cmFwcGVyO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBpbnB1dDtcclxuICB9XHJcblxyXG4gIGZpbmRGaWVsZHMoY29udGFpbnNQcmVzZXRzOiBib29sZWFuID0gdHJ1ZSk6IEhUTUxFbGVtZW50W10ge1xyXG4gICAgbGV0IGlucHV0cyA9IHRoaXMuZmluZERPTUZpZWxkcygpO1xyXG5cclxuICAgIGlmIChjb250YWluc1ByZXNldHMpIHtcclxuICAgICAgaW5wdXRzLnB1c2goLi4udGhpcy5wcmVzZXRGaWVsZHMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBpbnB1dHMubWFwKChpbnB1dCkgPT4gdGhpcy5wcmVwYXJlRmllbGRXcmFwcGVyKGlucHV0KSlcclxuICAgICAgLmZpbHRlcihpbnB1dCA9PiBpbnB1dCAhPSBudWxsKSBhcyBIVE1MRWxlbWVudFtdO1xyXG4gIH1cclxuXHJcbiAgZ2V0RmllbGRDb21wb25lbnQoaW5wdXQ6IEhUTUxFbGVtZW50KTogVW5pY29ybkZpZWxkVmFsaWRhdGlvbiB8IG51bGwge1xyXG4gICAgbGV0IHYgPSBnZXRCb3VuZGVkSW5zdGFuY2UoaW5wdXQsICdmaWVsZC52YWxpZGF0aW9uJyk7XHJcblxyXG4gICAgaWYgKCF2KSB7XHJcbiAgICAgIGNvbnN0IHdyYXBwZXIgPSBpbnB1dC5jbG9zZXN0KCdbdW5pLWZpZWxkLXZhbGlkYXRlXScpIGFzIEhUTUxFbGVtZW50IHwgbnVsbDtcclxuXHJcbiAgICAgIGlmICh3cmFwcGVyKSB7XHJcbiAgICAgICAgdiA9IGdldEJvdW5kZWRJbnN0YW5jZSh3cmFwcGVyLCAnZmllbGQudmFsaWRhdGlvbicpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHY7XHJcbiAgfVxyXG5cclxuICB2YWxpZGF0ZUFsbChmaWVsZHM/OiBOdWxsYWJsZTxIVE1MRWxlbWVudFtdPik6IGJvb2xlYW4ge1xyXG4gICAgdGhpcy5tYXJrRm9ybUFzVW52YWxpZGF0ZWQoKTtcclxuXHJcbiAgICBmaWVsZHMgPSBmaWVsZHMgfHwgdGhpcy5maW5kRmllbGRzKCk7XHJcbiAgICBsZXQgZmlyc3RGYWlsOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIGZvciAoY29uc3QgZmllbGQgb2YgZmllbGRzKSB7XHJcbiAgICAgIGNvbnN0IGZ2ID0gdGhpcy5nZXRGaWVsZENvbXBvbmVudChmaWVsZCk7XHJcblxyXG4gICAgICBpZiAoIWZ2KSB7XHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGZ2LmNoZWNrVmFsaWRpdHkoKTtcclxuXHJcbiAgICAgIGlmICghcmVzdWx0ICYmICFmaXJzdEZhaWwpIHtcclxuICAgICAgICBmaXJzdEZhaWwgPSBmaWVsZDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubWFya0Zvcm1Bc1ZhbGlkYXRlZCgpO1xyXG5cclxuICAgIGlmIChmaXJzdEZhaWwgJiYgdGhpcy5zY3JvbGxFbmFibGVkKSB7XHJcbiAgICAgIHRoaXMuc2Nyb2xsVG8oZmlyc3RGYWlsKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZmlyc3RGYWlsID09PSBudWxsO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgdmFsaWRhdGVBbGxBc3luYyhmaWVsZHM/OiBOdWxsYWJsZTxIVE1MRWxlbWVudFtdPik6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgdGhpcy5tYXJrRm9ybUFzVW52YWxpZGF0ZWQoKTtcclxuXHJcbiAgICBmaWVsZHMgPSBmaWVsZHMgfHwgdGhpcy5maW5kRmllbGRzKCk7XHJcbiAgICBsZXQgZmlyc3RGYWlsOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xyXG4gICAgY29uc3QgcHJvbWlzZXM6IFByb21pc2U8Ym9vbGVhbj5bXSA9IFtdO1xyXG5cclxuICAgIGZvciAoY29uc3QgZmllbGQgb2YgZmllbGRzKSB7XHJcbiAgICAgIGNvbnN0IGZ2ID0gdGhpcy5nZXRGaWVsZENvbXBvbmVudChmaWVsZCk7XHJcblxyXG4gICAgICBpZiAoIWZ2KSB7XHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHByb21pc2VzLnB1c2goXHJcbiAgICAgICAgZnYuY2hlY2tWYWxpZGl0eUFzeW5jKCkudGhlbigocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICBpZiAoIXJlc3VsdCAmJiAhZmlyc3RGYWlsKSB7XHJcbiAgICAgICAgICAgIGZpcnN0RmFpbCA9IGZpZWxkO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcyk7XHJcblxyXG4gICAgdGhpcy5tYXJrRm9ybUFzVmFsaWRhdGVkKCk7XHJcblxyXG4gICAgaWYgKGZpcnN0RmFpbCAmJiB0aGlzLnNjcm9sbEVuYWJsZWQpIHtcclxuICAgICAgdGhpcy5zY3JvbGxUbyhmaXJzdEZhaWwpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmaXJzdEZhaWwgPT09IG51bGw7XHJcbiAgfVxyXG5cclxuICBzY3JvbGxUbyhlbGVtZW50OiBIVE1MRWxlbWVudCk6IHZvaWQge1xyXG4gICAgY29uc3Qgb2Zmc2V0ID0gdGhpcy5zY3JvbGxPZmZzZXQ7XHJcbiAgICBjb25zdCBlbGVtZW50UG9zaXRpb24gPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcDtcclxuICAgIGNvbnN0IG9mZnNldFBvc2l0aW9uID0gZWxlbWVudFBvc2l0aW9uICsgd2luZG93LnNjcm9sbFkgKyBvZmZzZXQ7XHJcblxyXG4gICAgd2luZG93LnNjcm9sbFRvKHtcclxuICAgICAgdG9wOiBvZmZzZXRQb3NpdGlvbixcclxuICAgICAgYmVoYXZpb3I6ICdzbW9vdGgnXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIG1hcmtGb3JtQXNWYWxpZGF0ZWQoKTogdm9pZCB7XHJcbiAgICBpZiAoIXRoaXMuJGZvcm0pIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuJGZvcm0uY2xhc3NMaXN0LmFkZCh0aGlzLnZhbGlkYXRlZENsYXNzKTtcclxuICB9XHJcblxyXG4gIG1hcmtGb3JtQXNVbnZhbGlkYXRlZCgpOiB2b2lkIHtcclxuICAgIGlmICghdGhpcy4kZm9ybSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy4kZm9ybS5jbGFzc0xpc3QucmVtb3ZlKHRoaXMudmFsaWRhdGVkQ2xhc3MpO1xyXG4gIH1cclxuXHJcbiAgYWRkRmllbGQoZmllbGQ6IEhUTUxFbGVtZW50KTogdGhpcyB7XHJcbiAgICB0aGlzLnByZXNldEZpZWxkcy5wdXNoKGZpZWxkKTtcclxuXHJcbiAgICB0aGlzLnByZXBhcmVGaWVsZFdyYXBwZXIoZmllbGQpO1xyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgcmVnaXN0ZXJEZWZhdWx0VmFsaWRhdG9ycygpOiB2b2lkIHtcclxuICAgIGZvciAobGV0IG5hbWUgaW4gdmFsaWRhdG9ySGFuZGxlcnMpIHtcclxuICAgICAgdGhpcy5hZGRWYWxpZGF0b3IobmFtZSwgdmFsaWRhdG9ySGFuZGxlcnNbbmFtZV0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQWRkIHZhbGlkYXRvciBoYW5kbGVyLlxyXG4gICAqL1xyXG4gIGFkZFZhbGlkYXRvcihuYW1lOiBzdHJpbmcsIGhhbmRsZXI6IFZhbGlkYXRpb25IYW5kbGVyLCBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge30pIHtcclxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG5cclxuICAgIHRoaXMudmFsaWRhdG9yc1tuYW1lXSA9IHtcclxuICAgICAgaGFuZGxlcixcclxuICAgICAgb3B0aW9uc1xyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEFkZCB2YWxpZGF0b3IgaGFuZGxlci5cclxuICAgKi9cclxuICBzdGF0aWMgYWRkR2xvYmFsVmFsaWRhdG9yKG5hbWU6IHN0cmluZywgaGFuZGxlcjogVmFsaWRhdGlvbkhhbmRsZXIsIG9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fSkge1xyXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcblxyXG4gICAgdGhpcy5nbG9iYWxWYWxpZGF0b3JzW25hbWVdID0ge1xyXG4gICAgICBoYW5kbGVyLFxyXG4gICAgICBvcHRpb25zXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFVuaWNvcm5GaWVsZFZhbGlkYXRpb24ge1xyXG4gICRpbnB1dDogSW5wdXRFbGVtZW50cyB8IHVuZGVmaW5lZDtcclxuICBvcHRpb25zOiBGaWVsZFZhbGlkYXRpb25PcHRpb25zO1xyXG5cclxuICBzdGF0aWMgaXMgPSAndW5pLWZpZWxkLXZhbGlkYXRlJztcclxuXHJcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGVsOiBIVE1MRWxlbWVudCwgb3B0aW9uczogUGFydGlhbDxGaWVsZFZhbGlkYXRpb25PcHRpb25zPiA9IHt9KSB7XHJcbiAgICB0aGlzLm9wdGlvbnMgPSB0aGlzLm1lcmdlT3B0aW9ucyhvcHRpb25zKTtcclxuXHJcbiAgICB0aGlzLiRpbnB1dCA9IHRoaXMuc2VsZWN0SW5wdXQoKTtcclxuXHJcbiAgICB0aGlzLmluaXQoKTtcclxuICB9XHJcblxyXG4gIG1lcmdlT3B0aW9ucyhvcHRpb25zOiBQYXJ0aWFsPEZpZWxkVmFsaWRhdGlvbk9wdGlvbnM+KSB7XHJcbiAgICAvLyBGaXggUEhQIGVtcHR5IGFycmF5IHRvIEpTT04gaXNzdWUuXHJcbiAgICBpZiAoQXJyYXkuaXNBcnJheShvcHRpb25zKSkge1xyXG4gICAgICBvcHRpb25zID0ge307XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucyA9IG1lcmdlRGVlcCh7fSwgZGVmYXVsdEZpZWxkT3B0aW9ucywgb3B0aW9ucyk7XHJcbiAgfVxyXG5cclxuICBnZXQgJGZvcm0oKTogSFRNTEZvcm1FbGVtZW50IHtcclxuICAgIHJldHVybiB0aGlzLmdldEZvcm0oKTtcclxuICB9XHJcblxyXG4gIGdldCBlcnJvclNlbGVjdG9yKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLmVycm9yU2VsZWN0b3I7XHJcbiAgfVxyXG5cclxuICBnZXQgc2VsZWN0b3IoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLm9wdGlvbnMuc2VsZWN0b3I7XHJcbiAgfVxyXG5cclxuICBnZXQgdmFsaWRDbGFzcygpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy52YWxpZENsYXNzO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGludmFsaWRDbGFzcygpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy5pbnZhbGlkQ2xhc3M7XHJcbiAgfVxyXG5cclxuICBnZXQgaXNWaXNpYmxlKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuICEhKHRoaXMuZWwub2Zmc2V0V2lkdGggfHwgdGhpcy5lbC5vZmZzZXRIZWlnaHQgfHwgdGhpcy5lbC5nZXRDbGllbnRSZWN0cygpLmxlbmd0aCk7XHJcbiAgfVxyXG5cclxuICBnZXQgaXNJbnB1dE9wdGlvbnMoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gQm9vbGVhbih0aGlzLm9wdGlvbnMuaW5wdXRPcHRpb25zKTtcclxuICB9XHJcblxyXG4gIGdldCB2YWxpZGF0aW9uTWVzc2FnZSgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuJGlucHV0Py52YWxpZGF0aW9uTWVzc2FnZSB8fCAnJztcclxuICB9XHJcblxyXG4gIGdldCB2YWxpZGl0eSgpOiBWYWxpZGl0eVN0YXRlIHwgdW5kZWZpbmVkIHtcclxuICAgIHJldHVybiB0aGlzLiRpbnB1dD8udmFsaWRpdHk7XHJcbiAgfVxyXG5cclxuICBzZWxlY3RJbnB1dCgpOiBJbnB1dEVsZW1lbnRzIHwgdW5kZWZpbmVkIHtcclxuICAgIGxldCBzZWxlY3RvciA9IHRoaXMuc2VsZWN0b3I7XHJcblxyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5pbnB1dE9wdGlvbnMpIHtcclxuICAgICAgc2VsZWN0b3IgKz0gJywgJyArIHRoaXMub3B0aW9ucy5pbnB1dE9wdGlvbnNXcmFwcGVyU2VsZWN0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGlucHV0ID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yPElucHV0RWxlbWVudHM+KHNlbGVjdG9yKTtcclxuXHJcbiAgICBpZiAoIWlucHV0KSB7XHJcbiAgICAgIGlucHV0ID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yPElucHV0RWxlbWVudHM+KCdpbnB1dCwgc2VsZWN0LCB0ZXh0YXJlYScpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghaW5wdXQpIHtcclxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy4kaW5wdXQgPSBpbnB1dDtcclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICB0aGlzLnNlbGVjdElucHV0KCk7XHJcblxyXG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XHJcblxyXG4gICAgdGhpcy5wcmVwYXJlV3JhcHBlcigpO1xyXG5cclxuICAgIGlmICh0aGlzLmlzSW5wdXRPcHRpb25zKSB7XHJcbiAgICAgIGNvbnN0ICRpbnB1dCA9IHRoaXMuJGlucHV0IGFzIGFueTtcclxuXHJcbiAgICAgICRpbnB1dC52YWxpZGF0aW9uTWVzc2FnZSA9ICcnO1xyXG4gICAgICAkaW5wdXQuc2V0Q3VzdG9tVmFsaWRpdHkgPSAobXNnOiBzdHJpbmcpID0+IHtcclxuICAgICAgICAkaW5wdXQudmFsaWRhdGlvbk1lc3NhZ2UgPSBTdHJpbmcobXNnKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgICRpbnB1dC5jaGVja1ZhbGlkaXR5ID0gKCkgPT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNoZWNrSW5wdXRPcHRpb25zVmFsaWRpdHkoKTtcclxuICAgICAgfTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGJpbmRFdmVudHMoKSB7XHJcbiAgICBpZiAoIXRoaXMuJGlucHV0KSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLiRpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnZhbGlkJywgKGUpID0+IHtcclxuICAgICAgdGhpcy5zaG93SW52YWxpZFJlc3BvbnNlKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBldmVudHMgPSB0aGlzLm9wdGlvbnMuZXZlbnRzO1xyXG5cclxuICAgIGV2ZW50cy5mb3JFYWNoKChldmVudE5hbWUpID0+IHtcclxuICAgICAgdGhpcy4kaW5wdXQ/LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5jaGVja1ZhbGlkaXR5KCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcmVwYXJlV3JhcHBlcigpIHtcclxuICAgIGlmICh0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IodGhpcy5lcnJvclNlbGVjdG9yKT8uY2xhc3NMaXN0Py5jb250YWlucygnaW52YWxpZC10b29sdGlwJykpIHtcclxuICAgICAgaWYgKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMuZWwpLnBvc2l0aW9uID09PSAnc3RhdGljJykge1xyXG4gICAgICAgIHRoaXMuZWwuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjaGVja1ZhbGlkaXR5KCkge1xyXG4gICAgaWYgKCF0aGlzLiRpbnB1dCkge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy4kaW5wdXQuaGFzQXR0cmlidXRlKCdyZWFkb25seScpKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLiRpbnB1dC5oYXNBdHRyaWJ1dGUoJ1tkYXRhLW5vdmFsaWRhdGVdJykpIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuJGlucHV0LmNsb3Nlc3QoJ1tkYXRhLW5vdmFsaWRhdGVdJykpIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy4kaW5wdXQuc2V0Q3VzdG9tVmFsaWRpdHkoJycpO1xyXG4gICAgbGV0IHZhbGlkID0gdGhpcy4kaW5wdXQuY2hlY2tWYWxpZGl0eSgpO1xyXG5cclxuICAgIGlmICh2YWxpZCAmJiB0aGlzLiRmb3JtKSB7XHJcbiAgICAgIHZhbGlkID0gdGhpcy5ydW5DdXN0b21WYWxpZGl0eSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFJhaXNlIGludmFsaWQgZXZlbnRcclxuICAgIC8vIHRoaXMuJGlucHV0LmNoZWNrVmFsaWRpdHkoKTtcclxuXHJcbiAgICB0aGlzLnVwZGF0ZVZhbGlkQ2xhc3ModmFsaWQpO1xyXG5cclxuICAgIHJldHVybiB2YWxpZDtcclxuICB9XHJcblxyXG4gIHJ1bkN1c3RvbVZhbGlkaXR5KCkge1xyXG4gICAgaWYgKCF0aGlzLiRpbnB1dCkge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDaGVjayBjdXN0b20gdmFsaWRpdHlcclxuICAgIGNvbnN0IHZhbGlkYXRlcyA9ICh0aGlzLiRpbnB1dC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmFsaWRhdGUnKSB8fCAnJykuc3BsaXQoJ3wnKTtcclxuICAgIGxldCByZXN1bHQgPSB0cnVlO1xyXG5cclxuICAgIGlmICh0aGlzLiRpbnB1dC52YWx1ZSAhPT0gJycgJiYgdmFsaWRhdGVzLmxlbmd0aCkge1xyXG4gICAgICBpZiAoIXRoaXMuY2hlY2tDdXN0b21EYXRhQXR0cmlidXRlVmFsaWRpdHkoKSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZm9yIChjb25zdCB2YWxpZGF0b3JOYW1lIG9mIHZhbGlkYXRlcykge1xyXG4gICAgICAgIGNvbnN0IFt2YWxpZGF0b3IsIG9wdGlvbnNdID0gdGhpcy5nZXRWYWxpZGF0b3IodmFsaWRhdG9yTmFtZSkgfHwgW251bGwsIHt9XTtcclxuXHJcbiAgICAgICAgaWYgKCF2YWxpZGF0b3IpIHtcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihvcHRpb25zLCB2YWxpZGF0b3Iub3B0aW9ucyk7XHJcblxyXG4gICAgICAgIGxldCByID0gdmFsaWRhdG9yLmhhbmRsZXIodGhpcy4kaW5wdXQudmFsdWUsIHRoaXMuJGlucHV0LCBvcHRpb25zLCB0aGlzKTtcclxuXHJcbiAgICAgICAgLy8gSWYgcmV0dXJuIGlzIGEgcHJvbWlzZSwgcHVzaCB0byBzdGFjayBhbmQgcmVzb2x2ZSBsYXRlclxyXG4gICAgICAgIGlmIChyIGluc3RhbmNlb2YgUHJvbWlzZSB8fCAodHlwZW9mIHIgPT09ICdvYmplY3QnICYmIHIudGhlbikpIHtcclxuICAgICAgICAgIHIudGhlbigocmVzdWx0OiBib29sZWFuKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlQXN5bmNDdXN0b21SZXN1bHQocmVzdWx0LCB2YWxpZGF0b3IpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5oYW5kbGVDdXN0b21SZXN1bHQociwgdmFsaWRhdG9yKSkge1xyXG4gICAgICAgICAgcmVzdWx0ID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG4gIGFzeW5jIGNoZWNrVmFsaWRpdHlBc3luYygpIHtcclxuICAgIGlmICghdGhpcy4kaW5wdXQpIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuJGlucHV0Lmhhc0F0dHJpYnV0ZSgncmVhZG9ubHknKSkge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLiRpbnB1dC5zZXRDdXN0b21WYWxpZGl0eSgnJyk7XHJcbiAgICBsZXQgdmFsaWQgPSB0aGlzLiRpbnB1dC5jaGVja1ZhbGlkaXR5KCk7XHJcblxyXG4gICAgaWYgKHZhbGlkICYmIHRoaXMuJGZvcm0pIHtcclxuICAgICAgdmFsaWQgPSBhd2FpdCB0aGlzLnJ1bkN1c3RvbVZhbGlkaXR5QXN5bmMoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnVwZGF0ZVZhbGlkQ2xhc3ModmFsaWQpO1xyXG5cclxuICAgIHJldHVybiB2YWxpZDtcclxuICB9XHJcblxyXG4gIGFzeW5jIHJ1bkN1c3RvbVZhbGlkaXR5QXN5bmMoKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICBpZiAoIXRoaXMuJGlucHV0KSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENoZWNrIGN1c3RvbSB2YWxpZGl0eVxyXG4gICAgY29uc3QgdmFsaWRhdGVzID0gKHRoaXMuJGlucHV0LmdldEF0dHJpYnV0ZSgnZGF0YS12YWxpZGF0ZScpIHx8ICcnKS5zcGxpdCgnfCcpO1xyXG5cclxuICAgIGNvbnN0IHJlc3VsdHM6IEFycmF5PGJvb2xlYW4gfCBzdHJpbmcgfCB1bmRlZmluZWQ+ID0gW107XHJcbiAgICBjb25zdCBwcm9taXNlczogUHJvbWlzZTxib29sZWFuPltdID0gW107XHJcblxyXG4gICAgaWYgKHRoaXMuJGlucHV0LnZhbHVlICE9PSAnJyAmJiB2YWxpZGF0ZXMubGVuZ3RoKSB7XHJcbiAgICAgIGlmICghdGhpcy5jaGVja0N1c3RvbURhdGFBdHRyaWJ1dGVWYWxpZGl0eSgpKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmb3IgKGNvbnN0IHZhbGlkYXRvck5hbWUgb2YgdmFsaWRhdGVzKSB7XHJcbiAgICAgICAgbGV0IFt2YWxpZGF0b3IsIG9wdGlvbnNdID0gdGhpcy5nZXRWYWxpZGF0b3IodmFsaWRhdG9yTmFtZSkgfHwgW251bGwsIHt9XTtcclxuXHJcbiAgICAgICAgaWYgKCF2YWxpZGF0b3IpIHtcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHZhbGlkYXRvci5vcHRpb25zIHx8IHt9KTtcclxuXHJcbiAgICAgICAgcHJvbWlzZXMucHVzaChcclxuICAgICAgICAgIFByb21pc2UucmVzb2x2ZSh2YWxpZGF0b3IuaGFuZGxlcih0aGlzLiRpbnB1dC52YWx1ZSwgdGhpcy4kaW5wdXQsIG9wdGlvbnMsIHRoaXMpKVxyXG4gICAgICAgICAgICAudGhlbigocikgPT4ge1xyXG4gICAgICAgICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLmhhbmRsZUFzeW5jQ3VzdG9tUmVzdWx0KHIsIHZhbGlkYXRvcikpO1xyXG5cclxuICAgICAgICAgICAgICByZXR1cm4gcjtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xyXG5cclxuICAgIGZvciAoY29uc3QgcmVzdWx0IG9mIHJlc3VsdHMpIHtcclxuICAgICAgaWYgKHJlc3VsdCA9PT0gZmFsc2UpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGNoZWNrQ3VzdG9tRGF0YUF0dHJpYnV0ZVZhbGlkaXR5KCk6IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgZXJyb3IgPSB0aGlzLiRpbnB1dD8uZGF0YXNldC52YWxpZGF0aW9uRmFpbDtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5oYW5kbGVDdXN0b21SZXN1bHQoZXJyb3IpO1xyXG4gIH1cclxuXHJcbiAgY2hlY2tJbnB1dE9wdGlvbnNWYWxpZGl0eSgpOiBib29sZWFuIHtcclxuICAgIGlmICghdGhpcy4kaW5wdXQpIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgaXNSZXF1aXJlZCA9IHRoaXMuJGlucHV0LmdldEF0dHJpYnV0ZSgncmVxdWlyZWQnKSAhPSBudWxsO1xyXG4gICAgY29uc3Qgb3B0aW9uV3JhcHBlcnMgPSB0aGlzLiRpbnB1dC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMub3B0aW9ucy5pbnB1dE9wdGlvbnNTZWxlY3Rvcik7XHJcbiAgICBsZXQgcmVzdWx0ID0gdHJ1ZTtcclxuXHJcbiAgICBpZiAoaXNSZXF1aXJlZCkge1xyXG4gICAgICBmb3IgKGNvbnN0IG9wdGlvbldyYXBwZXIgb2Ygb3B0aW9uV3JhcHBlcnMpIHtcclxuICAgICAgICBjb25zdCBpbnB1dCA9IG9wdGlvbldyYXBwZXIucXVlcnlTZWxlY3RvcignaW5wdXQnKTtcclxuXHJcbiAgICAgICAgcmVzdWx0ID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8vIE9ubHkgbmVlZCBvbmUgY2hlY2tlZFxyXG4gICAgICAgIGlmIChpbnB1dD8uY2hlY2tlZCkge1xyXG4gICAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEdldCBicm93c2VyIGlucHV0IHZhbGlkYXRpb24gbWVzc2FnZVxyXG4gICAgY29uc3QgbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XHJcbiAgICBuLnJlcXVpcmVkID0gaXNSZXF1aXJlZDtcclxuXHJcbiAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgIG4udmFsdWUgPSAncGxhY2Vob2xkZXInO1xyXG4gICAgfVxyXG5cclxuICAgIG4uY2hlY2tWYWxpZGl0eSgpO1xyXG5cclxuICAgICh0aGlzLiRpbnB1dCBhcyBhbnkpLnZhbGlkYXRpb25NZXNzYWdlID0gbi52YWxpZGF0aW9uTWVzc2FnZTtcclxuICAgICh0aGlzLiRpbnB1dCBhcyBhbnkpLnZhbGlkaXR5ID0gbi52YWxpZGl0eTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IG9wdGlvbldyYXBwZXIgb2Ygb3B0aW9uV3JhcHBlcnMpIHtcclxuICAgICAgY29uc3QgaW5wdXQgPSBvcHRpb25XcmFwcGVyLnF1ZXJ5U2VsZWN0b3I8SFRNTElucHV0RWxlbWVudD4oJ2lucHV0Jyk7XHJcblxyXG4gICAgICBpbnB1dD8uc2V0Q3VzdG9tVmFsaWRpdHkobi52YWxpZGF0aW9uTWVzc2FnZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFyZXN1bHQpIHtcclxuICAgICAgdGhpcy4kaW5wdXQuZGlzcGF0Y2hFdmVudChcclxuICAgICAgICBuZXcgQ3VzdG9tRXZlbnQoJ2ludmFsaWQnKVxyXG4gICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBAcGFyYW0gdmFsaWQge2Jvb2xlYW59XHJcbiAgICovXHJcbiAgdXBkYXRlVmFsaWRDbGFzcyh2YWxpZDogQm9vbGVhbikge1xyXG4gICAgY29uc3QgJGVycm9yRWxlbWVudCA9IHRoaXMuZ2V0RXJyb3JFbGVtZW50KCk7XHJcbiAgICBjb25zdCAkaW52YWxpZFRhcmdldCA9ICRlcnJvckVsZW1lbnQ/LnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XHJcblxyXG4gICAgdGhpcy4kaW5wdXQ/LmNsYXNzTGlzdC5yZW1vdmUodGhpcy5pbnZhbGlkQ2xhc3MpO1xyXG4gICAgdGhpcy4kaW5wdXQ/LmNsYXNzTGlzdC5yZW1vdmUodGhpcy52YWxpZENsYXNzKTtcclxuICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLmludmFsaWRDbGFzcyk7XHJcbiAgICB0aGlzLmVsLmNsYXNzTGlzdC5yZW1vdmUodGhpcy52YWxpZENsYXNzKTtcclxuICAgICRpbnZhbGlkVGFyZ2V0Py5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuaW52YWxpZENsYXNzKTtcclxuICAgICRpbnZhbGlkVGFyZ2V0Py5jbGFzc0xpc3QucmVtb3ZlKHRoaXMudmFsaWRDbGFzcyk7XHJcblxyXG4gICAgaWYgKHZhbGlkKSB7XHJcbiAgICAgIHRoaXMuJGlucHV0Py5jbGFzc0xpc3QuYWRkKHRoaXMudmFsaWRDbGFzcyk7XHJcbiAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LmFkZCh0aGlzLnZhbGlkQ2xhc3MpO1xyXG5cclxuICAgICAgJGludmFsaWRUYXJnZXQ/LmNsYXNzTGlzdC5hZGQodGhpcy52YWxpZENsYXNzKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuJGlucHV0Py5jbGFzc0xpc3QuYWRkKHRoaXMuaW52YWxpZENsYXNzKTtcclxuICAgICAgdGhpcy5lbC5jbGFzc0xpc3QuYWRkKHRoaXMuaW52YWxpZENsYXNzKTtcclxuXHJcbiAgICAgICRpbnZhbGlkVGFyZ2V0Py5jbGFzc0xpc3QuYWRkKHRoaXMuaW52YWxpZENsYXNzKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldEZvcm1WYWxpZGF0aW9uKGVsZW1lbnQ/OiBOdWxsYWJsZTxIVE1MRm9ybUVsZW1lbnQ+KTogVW5pY29ybkZvcm1WYWxpZGF0aW9uIHwgbnVsbCB7XHJcbiAgICByZXR1cm4gZ2V0Qm91bmRlZEluc3RhbmNlKGVsZW1lbnQgfHwgdGhpcy5nZXRGb3JtKCksICdmb3JtLnZhbGlkYXRpb24nKSE7XHJcbiAgfVxyXG5cclxuICBnZXRWYWxpZGF0b3IobmFtZTogc3RyaW5nKTogW1ZhbGlkYXRvciwgUmVjb3JkPHN0cmluZywgYW55Pl0gfCBudWxsIHtcclxuICAgIGNvbnN0IG1hdGNoZXMgPSBuYW1lLm1hdGNoKC8oPzx0eXBlPltcXHdcXC1fXSspKFxcKCg/PHBhcmFtcz4uKilcXCkpKi8pO1xyXG5cclxuICAgIGlmICghbWF0Y2hlcykge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB2YWxpZGF0b3JOYW1lID0gbWF0Y2hlcy5ncm91cHM/LnR5cGUgfHwgJyc7XHJcblxyXG4gICAgY29uc3QgcGFyYW1zID0gbWF0Y2hlcy5ncm91cHM/LnBhcmFtcyB8fCAnJztcclxuXHJcbiAgICBjb25zdCBmdiA9IHRoaXMuZ2V0Rm9ybVZhbGlkYXRpb24odGhpcy4kZm9ybSEpO1xyXG4gICAgY29uc3QgdmFsaWRhdG9yID0gZnY/LnZhbGlkYXRvcnNbdmFsaWRhdG9yTmFtZV0gfHwgVW5pY29ybkZvcm1WYWxpZGF0aW9uLmdsb2JhbFZhbGlkYXRvcnNbdmFsaWRhdG9yTmFtZV07XHJcblxyXG4gICAgaWYgKCF2YWxpZGF0b3IpIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcGFyYW1NYXRjaGVzID0gcGFyYW1zLm1hdGNoQWxsKC8oPzxrZXk+XFx3KykoXFxzP1s9Ol1cXHM/KD88dmFsdWU+XFx3KykpPy9nKTtcclxuICAgIGNvbnN0IG9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IHBhcmFtTWF0Y2ggb2YgcGFyYW1NYXRjaGVzKSB7XHJcbiAgICAgIGNvbnN0IG1hdGNoID0gcGFyYW1NYXRjaD8uZ3JvdXBzIGFzIHtcclxuICAgICAgICBrZXk6IHN0cmluZztcclxuICAgICAgICB2YWx1ZTogc3RyaW5nO1xyXG4gICAgICB9IHwgdW5kZWZpbmVkO1xyXG5cclxuICAgICAgaWYgKCFtYXRjaCkge1xyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBvcHRpb25zW21hdGNoLmtleV0gPSBoYW5kbGVQYXJhbVZhbHVlKG1hdGNoLnZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gWyB2YWxpZGF0b3IsIG9wdGlvbnMgXTtcclxuICB9XHJcblxyXG4gIGhhbmRsZUN1c3RvbVJlc3VsdChyZXN1bHQ6IGJvb2xlYW4gfCBzdHJpbmcgfCB1bmRlZmluZWQsIHZhbGlkYXRvcj86IE51bGxhYmxlPFZhbGlkYXRvcj4pOiBib29sZWFuIHtcclxuICAgIGlmICh0eXBlb2YgcmVzdWx0ID09PSAnc3RyaW5nJykge1xyXG4gICAgICB0aGlzLiRpbnB1dD8uc2V0Q3VzdG9tVmFsaWRpdHkocmVzdWx0KTtcclxuICAgICAgcmVzdWx0ID0gcmVzdWx0ID09PSAnJztcclxuICAgIH0gZWxzZSBpZiAocmVzdWx0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgcmVzdWx0ID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgIHRoaXMuJGlucHV0Py5zZXRDdXN0b21WYWxpZGl0eSgnJyk7XHJcbiAgICB9IGVsc2UgaWYgKHZhbGlkYXRvcikge1xyXG4gICAgICB0aGlzLnJhaXNlQ3VzdG9tRXJyb3JTdGF0ZSh2YWxpZGF0b3IpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVBc3luY0N1c3RvbVJlc3VsdChyZXN1bHQ6IGJvb2xlYW4sIHZhbGlkYXRvcj86IE51bGxhYmxlPFZhbGlkYXRvcj4pOiBib29sZWFuIHtcclxuICAgIHJlc3VsdCA9IHRoaXMuaGFuZGxlQ3VzdG9tUmVzdWx0KHJlc3VsdCwgdmFsaWRhdG9yKTtcclxuXHJcbiAgICAvLyBGaXJlIGludmFsaWQgZXZlbnRzXHJcbiAgICB0aGlzLiRpbnB1dD8uY2hlY2tWYWxpZGl0eSgpO1xyXG5cclxuICAgIHRoaXMudXBkYXRlVmFsaWRDbGFzcyhyZXN1bHQpO1xyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICByYWlzZUN1c3RvbUVycm9yU3RhdGUodmFsaWRhdG9yOiBWYWxpZGF0b3IpOiB2b2lkIHtcclxuICAgIGxldCBoZWxwO1xyXG5cclxuICAgIGlmICh0aGlzLiRpbnB1dD8udmFsaWRhdGlvbk1lc3NhZ2UgPT09ICcnKSB7XHJcbiAgICAgIGhlbHAgPSB2YWxpZGF0b3Iub3B0aW9ucz8ubm90aWNlO1xyXG5cclxuICAgICAgaWYgKHR5cGVvZiBoZWxwID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgaGVscCA9IGhlbHAodGhpcy4kaW5wdXQsIHRoaXMpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoaGVscCAhPSBudWxsKSB7XHJcbiAgICAgICAgdGhpcy4kaW5wdXQ/LnNldEN1c3RvbVZhbGlkaXR5KGhlbHApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuJGlucHV0Py52YWxpZGF0aW9uTWVzc2FnZSA9PT0gJycpIHtcclxuICAgICAgdGhpcy4kaW5wdXQ/LnNldEN1c3RvbVZhbGlkaXR5KHRyYW5zKCd1bmljb3JuLm1lc3NhZ2UudmFsaWRhdGlvbi5jdXN0b20uZXJyb3InKSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy4kaW5wdXQ/LmRpc3BhdGNoRXZlbnQoXHJcbiAgICAgIG5ldyBDdXN0b21FdmVudCgnaW52YWxpZCcpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgc2V0QXNJbnZhbGlkQW5kUmVwb3J0KGVycm9yOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuc2V0Q3VzdG9tVmFsaWRpdHkoZXJyb3IpO1xyXG4gICAgdGhpcy5zaG93SW52YWxpZFJlc3BvbnNlKCk7XHJcbiAgfVxyXG5cclxuICBzZXRDdXN0b21WYWxpZGl0eShlcnJvcjogc3RyaW5nKSB7XHJcbiAgICB0aGlzLiRpbnB1dD8uc2V0Q3VzdG9tVmFsaWRpdHkoZXJyb3IpO1xyXG4gIH1cclxuXHJcbiAgcmVwb3J0VmFsaWRpdHkoKSB7XHJcbiAgICBpZiAodGhpcy52YWxpZGF0aW9uTWVzc2FnZSAhPT0gJycpIHtcclxuICAgICAgdGhpcy5zaG93SW52YWxpZFJlc3BvbnNlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzaG93SW52YWxpZFJlc3BvbnNlKCkge1xyXG4gICAgLyoqIEB0eXBlIFZhbGlkaXR5U3RhdGUgKi9cclxuICAgIGNvbnN0IHN0YXRlID0gdGhpcy4kaW5wdXQ/LnZhbGlkaXR5O1xyXG4gICAgbGV0IG1lc3NhZ2U6IHN0cmluZyA9IHRoaXMuJGlucHV0Py52YWxpZGF0aW9uTWVzc2FnZSB8fCAnJztcclxuXHJcbiAgICBmb3IgKGxldCBrZXkgaW4gc3RhdGUpIHtcclxuICAgICAgaWYgKHN0YXRlWyhrZXkgYXMga2V5b2YgVmFsaWRpdHlTdGF0ZSldICYmIHRoaXMuJGlucHV0Py5kYXRhc2V0W2tleSArICdNZXNzYWdlJ10pIHtcclxuICAgICAgICBtZXNzYWdlID0gdGhpcy4kaW5wdXQ/LmRhdGFzZXRba2V5ICsgJ01lc3NhZ2UnXSB8fCAnJztcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICghdGhpcy5pc1Zpc2libGUpIHtcclxuICAgICAgbGV0IHRpdGxlID0gdGhpcy5maW5kTGFiZWwoKT8udGV4dENvbnRlbnQ7XHJcblxyXG4gICAgICBpZiAoIXRpdGxlKSB7XHJcbiAgICAgICAgdGl0bGUgPSB0aGlzLiRpbnB1dD8ubmFtZSB8fCAnJztcclxuICAgICAgfVxyXG5cclxuICAgICAgdXNlVUlUaGVtZSgpLnJlbmRlck1lc3NhZ2UoXHJcbiAgICAgICAgYEZpZWxkOiAke3RpdGxlfSAtICR7bWVzc2FnZX1gLFxyXG4gICAgICAgICd3YXJuaW5nJ1xyXG4gICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCAkaGVscCA9IHRoaXMuZ2V0RXJyb3JFbGVtZW50KCk7XHJcblxyXG4gICAgaWYgKCEkaGVscCkge1xyXG4gICAgICAkaGVscCA9IHRoaXMuY3JlYXRlSGVscEVsZW1lbnQoKSE7XHJcbiAgICAgIHRoaXMuZWwuYXBwZW5kQ2hpbGQoJGhlbHApO1xyXG4gICAgICB0aGlzLnByZXBhcmVXcmFwcGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgJGhlbHAudGV4dENvbnRlbnQgPSBtZXNzYWdlO1xyXG5cclxuICAgIHRoaXMudXBkYXRlVmFsaWRDbGFzcyhmYWxzZSk7XHJcbiAgfVxyXG5cclxuICBnZXRFcnJvckVsZW1lbnQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5lbC5xdWVyeVNlbGVjdG9yKHRoaXMuZXJyb3JTZWxlY3Rvcik7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVIZWxwRWxlbWVudCgpIHtcclxuICAgIGNvbnN0IGNsYXNzTmFtZSA9IHRoaXMub3B0aW9ucy5lcnJvck1lc3NhZ2VDbGFzcztcclxuICAgIGNvbnN0IHBhcnNlZCA9IHRoaXMucGFyc2VTZWxlY3Rvcih0aGlzLmVycm9yU2VsZWN0b3IgfHwgJycpO1xyXG5cclxuICAgIGNvbnN0ICRoZWxwID0gaHRtbChgPGRpdiBjbGFzcz1cIiR7Y2xhc3NOYW1lfVwiPjwvZGl2PmApITtcclxuXHJcbiAgICAkaGVscC5jbGFzc0xpc3QuYWRkKC4uLnBhcnNlZC5jbGFzc2VzKTtcclxuXHJcbiAgICBwYXJzZWQuYXR0cnMuZm9yRWFjaCgoYXR0cikgPT4ge1xyXG4gICAgICAkaGVscC5zZXRBdHRyaWJ1dGUoYXR0clswXSwgYXR0clsxXSB8fCAnJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBwYXJzZWQuaWRzLmZvckVhY2goKGlkKSA9PiB7XHJcbiAgICAgICRoZWxwLmlkID0gaWQ7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gJGhlbHA7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBAc2VlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xNzg4ODE3OFxyXG4gICAqL1xyXG4gIHBhcnNlU2VsZWN0b3Ioc3Vic2VsZWN0b3I6IHN0cmluZyk6IHsgdGFnczogc3RyaW5nW107IGNsYXNzZXM6IHN0cmluZ1tdOyBpZHM6IHN0cmluZ1tdOyBhdHRyczogc3RyaW5nW11bXSB9IHtcclxuICAgIGNvbnN0IG9iajoge1xyXG4gICAgICB0YWdzOiBzdHJpbmdbXTtcclxuICAgICAgY2xhc3Nlczogc3RyaW5nW107XHJcbiAgICAgIGlkczogc3RyaW5nW107XHJcbiAgICAgIGF0dHJzOiBzdHJpbmdbXVtdO1xyXG4gICAgfSA9IHsgdGFnczogW10sIGNsYXNzZXM6IFtdLCBpZHM6IFtdLCBhdHRyczogW10gfTtcclxuICAgIGZvciAoY29uc3QgdG9rZW4gb2Ygc3Vic2VsZWN0b3Iuc3BsaXQoLyg/PVxcLil8KD89Iyl8KD89XFxbKS8pKSB7XHJcbiAgICAgIHN3aXRjaCAodG9rZW5bMF0pIHtcclxuICAgICAgICBjYXNlICcjJzpcclxuICAgICAgICAgIG9iai5pZHMucHVzaCh0b2tlbi5zbGljZSgxKSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICcuJzpcclxuICAgICAgICAgIG9iai5jbGFzc2VzLnB1c2godG9rZW4uc2xpY2UoMSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnWyc6XHJcbiAgICAgICAgICBvYmouYXR0cnMucHVzaCh0b2tlbi5zbGljZSgxLCAtMSkuc3BsaXQoJz0nKSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0IDpcclxuICAgICAgICAgIG9iai50YWdzLnB1c2godG9rZW4pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBvYmo7XHJcbiAgfVxyXG5cclxuICBzZXRBc1ZhbGlkQW5kQ2xlYXJSZXNwb25zZSgpIHtcclxuICAgIHRoaXMuc2V0Q3VzdG9tVmFsaWRpdHkoJycpO1xyXG4gICAgdGhpcy51cGRhdGVWYWxpZENsYXNzKHRydWUpO1xyXG4gICAgdGhpcy5jbGVhckludmFsaWRSZXNwb25zZSgpO1xyXG4gIH1cclxuXHJcbiAgY2xlYXJJbnZhbGlkUmVzcG9uc2UoKSB7XHJcbiAgICBjb25zdCAkaGVscCA9IHRoaXMuZWwucXVlcnlTZWxlY3Rvcih0aGlzLmVycm9yU2VsZWN0b3IpITtcclxuXHJcbiAgICAkaGVscC50ZXh0Q29udGVudCA9ICcnO1xyXG4gIH1cclxuXHJcbiAgZ2V0Rm9ybSgpIHtcclxuICAgIHJldHVybiB0aGlzLmVsLmNsb3Nlc3QodGhpcy5vcHRpb25zLmZvcm1TZWxlY3RvciB8fCAnW3VuaS1mb3JtLXZhbGlkYXRlXScpIGFzIEhUTUxGb3JtRWxlbWVudDtcclxuICB9XHJcblxyXG4gIGZpbmRMYWJlbCgpIHtcclxuICAgIGNvbnN0IGlkID0gdGhpcy4kaW5wdXQ/LmlkIHx8ICcnO1xyXG5cclxuICAgIGNvbnN0IHdyYXBwZXIgPSB0aGlzLiRpbnB1dD8uY2xvc2VzdCgnW2RhdGEtZmllbGQtd3JhcHBlcl0nKTtcclxuICAgIGxldCBsYWJlbCA9IG51bGw7XHJcblxyXG4gICAgaWYgKHdyYXBwZXIpIHtcclxuICAgICAgbGFiZWwgPSB3cmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWZpZWxkLWxhYmVsXScpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghbGFiZWwpIHtcclxuICAgICAgbGFiZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBsYWJlbFtmb3I9XCIke2lkfVwiXWApO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBsYWJlbDtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNhbWVsVG8oc3RyOiBzdHJpbmcsIHNlcDogc3RyaW5nKSB7XHJcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCBgJDEke3NlcH0kMmApLnRvTG93ZXJDYXNlKCk7XHJcbn1cclxuXHJcbnZhbGlkYXRvckhhbmRsZXJzLnVzZXJuYW1lID0gZnVuY3Rpb24gKHZhbHVlOiBhbnksIGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XHJcbiAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKCdbXFw8fFxcPnxcInxcXCd8XFwlfFxcO3xcXCh8XFwpfFxcJl0nLCAnaScpO1xyXG4gIHJldHVybiAhcmVnZXgudGVzdCh2YWx1ZSk7XHJcbn07XHJcblxyXG52YWxpZGF0b3JIYW5kbGVycy5udW1lcmljID0gZnVuY3Rpb24gKHZhbHVlOiBhbnksIGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XHJcbiAgY29uc3QgcmVnZXggPSAvXihcXGR8LSk/KFxcZHwsKSpcXC4/XFxkKiQvO1xyXG4gIHJldHVybiByZWdleC50ZXN0KHZhbHVlKTtcclxufTtcclxuXHJcbnZhbGlkYXRvckhhbmRsZXJzLmVtYWlsID0gZnVuY3Rpb24gKHZhbHVlOiBhbnksIGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XHJcbiAgdmFsdWUgPSBwdW55Y29kZS50b0FTQ0lJKHZhbHVlKTtcclxuICBjb25zdCByZWdleCA9IC9eW2EtekEtWjAtOS4hIyQlJsOi4oKs4oSiKitcXC89P15fYHt8fX4tXStAW2EtekEtWjAtOS1dKyg/OlxcLlthLXpBLVowLTktXSspKiQvO1xyXG4gIHJldHVybiByZWdleC50ZXN0KHZhbHVlKTtcclxufTtcclxuXHJcbnZhbGlkYXRvckhhbmRsZXJzLnVybCA9IGZ1bmN0aW9uICh2YWx1ZTogYW55LCBlbGVtZW50OiBIVE1MRWxlbWVudCkge1xyXG4gIGNvbnN0IHJlZ2V4ID0gL14oPzooPzpodHRwcz98ZnRwKTpcXC9cXC8pKD86XFxTKyg/OjpcXFMqKT9AKT8oPzooPyExMCg/OlxcLlxcZHsxLDN9KXszfSkoPyExMjcoPzpcXC5cXGR7MSwzfSl7M30pKD8hMTY5XFwuMjU0KD86XFwuXFxkezEsM30pezJ9KSg/ITE5MlxcLjE2OCg/OlxcLlxcZHsxLDN9KXsyfSkoPyExNzJcXC4oPzoxWzYtOV18MlxcZHwzWzAtMV0pKD86XFwuXFxkezEsM30pezJ9KSg/OlsxLTldXFxkP3wxXFxkXFxkfDJbMDFdXFxkfDIyWzAtM10pKD86XFwuKD86MT9cXGR7MSwyfXwyWzAtNF1cXGR8MjVbMC01XSkpezJ9KD86XFwuKD86WzEtOV1cXGQ/fDFcXGRcXGR8MlswLTRdXFxkfDI1WzAtNF0pKXwoPzooPzpbYS16XFx1MDBhMS1cXHVmZmZmMC05XSstPykqW2EtelxcdTAwYTEtXFx1ZmZmZjAtOV0rKSg/OlxcLig/OlthLXpcXHUwMGExLVxcdWZmZmYwLTldKy0/KSpbYS16XFx1MDBhMS1cXHVmZmZmMC05XSspKig/OlxcLig/OlthLXpcXHUwMGExLVxcdWZmZmZdezIsfSkpKSg/OjpcXGR7Miw1fSk/KD86XFwvW15cXHNdKik/JC9pO1xyXG4gIHJldHVybiByZWdleC50ZXN0KHZhbHVlKTtcclxufTtcclxuXHJcbnZhbGlkYXRvckhhbmRsZXJzLmFsbnVtID0gZnVuY3Rpb24gKHZhbHVlOiBhbnksIGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XHJcbiAgY29uc3QgcmVnZXggPSAvXlthLXpBLVowLTldKiQvO1xyXG4gIHJldHVybiByZWdleC50ZXN0KHZhbHVlKTtcclxufTtcclxuXHJcbnZhbGlkYXRvckhhbmRsZXJzLmNvbG9yID0gZnVuY3Rpb24gKHZhbHVlOiBhbnksIGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XHJcbiAgY29uc3QgcmVnZXggPSAvXiMoPzpbMC05YS1mXXszfSl7MSwyfSQvO1xyXG4gIHJldHVybiByZWdleC50ZXN0KHZhbHVlKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAc2VlICBodHRwOi8vd3d3LnZpcnR1b3NpbWVkaWEuY29tL2Rldi9waHAvMzctdGVzdGVkLXBocC1wZXJsLWFuZC1qYXZhc2NyaXB0LXJlZ3VsYXItZXhwcmVzc2lvbnNcclxuICovXHJcbnZhbGlkYXRvckhhbmRsZXJzLmNyZWRpdGNhcmQgPSBmdW5jdGlvbiAodmFsdWU6IGFueSwgZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcclxuICBjb25zdCByZWdleCA9IC9eKD86NFswLTldezEyfSg/OlswLTldezN9KT98NVsxLTVdWzAtOV17MTR9fDYwMTFbMC05XXsxMn18NjIyKCgxMls2LTldfDFbMy05XVswLTldKXwoWzItOF1bMC05XVswLTldKXwoOSgoWzAtMV1bMC05XSl8KDJbMC01XSkpKSlbMC05XXsxMH18NjRbNC05XVswLTldezEzfXw2NVswLTldezE0fXwzKD86MFswLTVdfFs2OF1bMC05XSlbMC05XXsxMX18M1s0N11bMC05XXsxM30pKiQvO1xyXG4gIHJldHVybiByZWdleC50ZXN0KHZhbHVlKTtcclxufTtcclxuXHJcbnZhbGlkYXRvckhhbmRsZXJzLmlwID0gZnVuY3Rpb24gKHZhbHVlOiBhbnksIGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XHJcbiAgY29uc3QgcmVnZXggPSAvXigoPzooPzoyNVswLTVdfDJbMC00XVswLTldfFswMV0/WzAtOV1bMC05XT8pXFwuKXszfSg/OjI1WzAtNV18MlswLTRdWzAtOV18WzAxXT9bMC05XVswLTldPykpKiQvO1xyXG4gIHJldHVybiByZWdleC50ZXN0KHZhbHVlKTtcclxufTtcclxuXHJcbnZhbGlkYXRvckhhbmRsZXJzWydwYXNzd29yZC1jb25maXJtJ10gPSBmdW5jdGlvbiAodmFsdWU6IGFueSwgZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcclxuICBjb25zdCBzZWxlY3RvciA9IGVsZW1lbnQuZGF0YXNldC5jb25maXJtVGFyZ2V0O1xyXG5cclxuICBpZiAoIXNlbGVjdG9yKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1ZhbGlkYXRvcjogXCJwYXNzd29yZC1jb25maXJtXCIgbXVzdCBhZGQgXCJkYXRhLWNvbmZpcm0tdGFyZ2V0XCIgYXR0cmlidXRlLicpO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MSW5wdXRFbGVtZW50PihzZWxlY3Rvcik7XHJcblxyXG4gIHJldHVybiB0YXJnZXQ/LnZhbHVlID09PSB2YWx1ZTtcclxufTtcclxuXHJcbmV4cG9ydCB7IHZhbGlkYXRvckhhbmRsZXJzIGFzIHZhbGlkYXRvcnMgfTtcclxuXHJcbi8vIGN1c3RvbUVsZW1lbnRzLmRlZmluZShVbmljb3JuRm9ybVZhbGlkYXRlRWxlbWVudC5pcywgVW5pY29ybkZvcm1WYWxpZGF0ZUVsZW1lbnQpO1xyXG4vLyBjdXN0b21FbGVtZW50cy5kZWZpbmUoVW5pY29ybkZpZWxkVmFsaWRhdGVFbGVtZW50LmlzLCBVbmljb3JuRmllbGRWYWxpZGF0ZUVsZW1lbnQpO1xyXG5cclxuZXhwb3J0IGNvbnN0IHJlYWR5ID0gUHJvbWlzZS5hbGwoW1xyXG4gIHVzZVVuaURpcmVjdGl2ZSgnZm9ybS12YWxpZGF0ZScsIHtcclxuICAgIG1vdW50ZWQoZWwsIGJpbmRpbmcpIHtcclxuICAgICAgZ2V0Qm91bmRlZEluc3RhbmNlKGVsLCAnZm9ybS52YWxpZGF0aW9uJywgKGVsZSkgPT4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgVW5pY29ybkZvcm1WYWxpZGF0aW9uKGVsZSBhcyBIVE1MRWxlbWVudCwgSlNPTi5wYXJzZShiaW5kaW5nLnZhbHVlIHx8ICd7fScpKTtcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgdXBkYXRlZChlbCwgYmluZGluZykge1xyXG4gICAgICBjb25zdCBpbnN0YW5jZSA9IGdldEJvdW5kZWRJbnN0YW5jZTxVbmljb3JuRm9ybVZhbGlkYXRpb24+KGVsLCAnZm9ybS52YWxpZGF0aW9uJyk7XHJcbiAgICAgIGluc3RhbmNlLm1lcmdlT3B0aW9ucyhKU09OLnBhcnNlKGJpbmRpbmcudmFsdWUgfHwgJ3t9JykpO1xyXG4gICAgfVxyXG4gIH0pLFxyXG5cclxuICB1c2VVbmlEaXJlY3RpdmUoJ2ZpZWxkLXZhbGlkYXRlJywge1xyXG4gICAgbW91bnRlZChlbCwgYmluZGluZykge1xyXG4gICAgICBnZXRCb3VuZGVkSW5zdGFuY2U8VW5pY29ybkZpZWxkVmFsaWRhdGlvbj4oZWwsICdmaWVsZC52YWxpZGF0aW9uJywgKGVsZSkgPT4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgVW5pY29ybkZpZWxkVmFsaWRhdGlvbihlbGUgYXMgSFRNTEVsZW1lbnQsIEpTT04ucGFyc2UoYmluZGluZy52YWx1ZSB8fCAne30nKSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICB1cGRhdGVkKGVsLCBiaW5kaW5nKSB7XHJcbiAgICAgIGNvbnN0IGluc3RhbmNlID0gZ2V0Qm91bmRlZEluc3RhbmNlPFVuaWNvcm5GaWVsZFZhbGlkYXRpb24+KGVsLCAnZmllbGQudmFsaWRhdGlvbicpO1xyXG4gICAgICBpbnN0YW5jZS5tZXJnZU9wdGlvbnMoSlNPTi5wYXJzZShiaW5kaW5nLnZhbHVlIHx8ICd7fScpIHx8IHt9KTtcclxuICAgIH1cclxuICB9KVxyXG5dKTtcclxuXHJcbmZ1bmN0aW9uIGhhbmRsZVBhcmFtVmFsdWUodmFsdWU6IGFueSkge1xyXG4gIGlmICghaXNOYU4oTnVtYmVyKHZhbHVlKSkpIHtcclxuICAgIHJldHVybiBOdW1iZXIodmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgaWYgKHZhbHVlID09PSAnbnVsbCcpIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgaWYgKHZhbHVlID09PSAndHJ1ZScpIHtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgaWYgKHZhbHVlID09PSAnZmFsc2UnKSB7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIHJldHVybiB2YWx1ZTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBWYWxpZGF0aW9uTW9kdWxlIHtcclxuICBVbmljb3JuRm9ybVZhbGlkYXRpb246IHR5cGVvZiBVbmljb3JuRm9ybVZhbGlkYXRpb247XHJcbiAgVW5pY29ybkZpZWxkVmFsaWRhdGlvbjogdHlwZW9mIFVuaWNvcm5GaWVsZFZhbGlkYXRpb247XHJcbiAgcmVhZHk6IFByb21pc2U8YW55PjtcclxuICB2YWxpZGF0b3JzOiB0eXBlb2YgdmFsaWRhdG9ySGFuZGxlcnM7XHJcbn1cclxuIl0sIm5hbWVzIjpbInJlc3VsdCIsImVycm9yIiwicHVueWNvZGUudG9BU0NJSSJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFHQSxNQUFNLFNBQVM7QUFHZixNQUFNLE9BQU87QUFDYixNQUFNLE9BQU87QUFDYixNQUFNLE9BQU87QUFDYixNQUFNLE9BQU87QUFDYixNQUFNLE9BQU87QUFDYixNQUFNLGNBQWM7QUFDcEIsTUFBTSxXQUFXO0FBQ2pCLE1BQU0sWUFBWTtBQUlsQixNQUFNLGdCQUFnQjtBQUN0QixNQUFNLGtCQUFrQjtBQUd4QixNQUFNLFNBQVM7QUFBQSxFQUNkLFlBQVk7QUFBQSxFQUNaLGFBQWE7QUFBQSxFQUNiLGlCQUFpQjtBQUNsQjtBQUdBLE1BQU0sZ0JBQWdCLE9BQU87QUFDN0IsTUFBTSxRQUFLLHVCQUFHLEtBQUssT0FBQTtBQUNuQixNQUFNLDRDQUFxQixPQUFPLGNBQUE7QUFVbEMsU0FBUyxNQUFNLE1BQU07QUFDcEIsUUFBTSxJQUFJLFdBQVcsT0FBTyxJQUFJLENBQUM7QUFDbEM7QUFVQSxTQUFTLElBQUksT0FBTyxVQUFVO0FBQzdCLFFBQU0sU0FBUyxDQUFBO0FBQ2YsTUFBSSxTQUFTLE1BQU07QUFDbkIsU0FBTyxVQUFVO0FBQ2hCLFdBQU8sTUFBTSxJQUFJLFNBQVMsTUFBTSxNQUFNLENBQUM7QUFBQSxFQUN4QztBQUNBLFNBQU87QUFDUjtBQVlBLFNBQVMsVUFBVSxRQUFRLFVBQVU7QUFDcEMsUUFBTSxR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
