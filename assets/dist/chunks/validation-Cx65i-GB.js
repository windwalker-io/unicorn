import { d as useUniDirective, A as getBoundedInstance, a as selectOne, m as mergeDeep, s as selectAll, F as trans, G as useUITheme, h as html } from "./unicorn-DR9JpPYO.js";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGlvbi1DeDY1aS1HQi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3B1bnljb2RlL3B1bnljb2RlLmVzNi5qcyIsIi4uLy4uL3NyYy9tb2R1bGUvdmFsaWRhdGlvbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbi8qKiBIaWdoZXN0IHBvc2l0aXZlIHNpZ25lZCAzMi1iaXQgZmxvYXQgdmFsdWUgKi9cbmNvbnN0IG1heEludCA9IDIxNDc0ODM2NDc7IC8vIGFrYS4gMHg3RkZGRkZGRiBvciAyXjMxLTFcblxuLyoqIEJvb3RzdHJpbmcgcGFyYW1ldGVycyAqL1xuY29uc3QgYmFzZSA9IDM2O1xuY29uc3QgdE1pbiA9IDE7XG5jb25zdCB0TWF4ID0gMjY7XG5jb25zdCBza2V3ID0gMzg7XG5jb25zdCBkYW1wID0gNzAwO1xuY29uc3QgaW5pdGlhbEJpYXMgPSA3MjtcbmNvbnN0IGluaXRpYWxOID0gMTI4OyAvLyAweDgwXG5jb25zdCBkZWxpbWl0ZXIgPSAnLSc7IC8vICdcXHgyRCdcblxuLyoqIFJlZ3VsYXIgZXhwcmVzc2lvbnMgKi9cbmNvbnN0IHJlZ2V4UHVueWNvZGUgPSAvXnhuLS0vO1xuY29uc3QgcmVnZXhOb25BU0NJSSA9IC9bXlxcMC1cXHg3Rl0vOyAvLyBOb3RlOiBVKzAwN0YgREVMIGlzIGV4Y2x1ZGVkIHRvby5cbmNvbnN0IHJlZ2V4U2VwYXJhdG9ycyA9IC9bXFx4MkVcXHUzMDAyXFx1RkYwRVxcdUZGNjFdL2c7IC8vIFJGQyAzNDkwIHNlcGFyYXRvcnNcblxuLyoqIEVycm9yIG1lc3NhZ2VzICovXG5jb25zdCBlcnJvcnMgPSB7XG5cdCdvdmVyZmxvdyc6ICdPdmVyZmxvdzogaW5wdXQgbmVlZHMgd2lkZXIgaW50ZWdlcnMgdG8gcHJvY2VzcycsXG5cdCdub3QtYmFzaWMnOiAnSWxsZWdhbCBpbnB1dCA+PSAweDgwIChub3QgYSBiYXNpYyBjb2RlIHBvaW50KScsXG5cdCdpbnZhbGlkLWlucHV0JzogJ0ludmFsaWQgaW5wdXQnXG59O1xuXG4vKiogQ29udmVuaWVuY2Ugc2hvcnRjdXRzICovXG5jb25zdCBiYXNlTWludXNUTWluID0gYmFzZSAtIHRNaW47XG5jb25zdCBmbG9vciA9IE1hdGguZmxvb3I7XG5jb25zdCBzdHJpbmdGcm9tQ2hhckNvZGUgPSBTdHJpbmcuZnJvbUNoYXJDb2RlO1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuLyoqXG4gKiBBIGdlbmVyaWMgZXJyb3IgdXRpbGl0eSBmdW5jdGlvbi5cbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZSBUaGUgZXJyb3IgdHlwZS5cbiAqIEByZXR1cm5zIHtFcnJvcn0gVGhyb3dzIGEgYFJhbmdlRXJyb3JgIHdpdGggdGhlIGFwcGxpY2FibGUgZXJyb3IgbWVzc2FnZS5cbiAqL1xuZnVuY3Rpb24gZXJyb3IodHlwZSkge1xuXHR0aHJvdyBuZXcgUmFuZ2VFcnJvcihlcnJvcnNbdHlwZV0pO1xufVxuXG4vKipcbiAqIEEgZ2VuZXJpYyBgQXJyYXkjbWFwYCB1dGlsaXR5IGZ1bmN0aW9uLlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgZnVuY3Rpb24gdGhhdCBnZXRzIGNhbGxlZCBmb3IgZXZlcnkgYXJyYXlcbiAqIGl0ZW0uXG4gKiBAcmV0dXJucyB7QXJyYXl9IEEgbmV3IGFycmF5IG9mIHZhbHVlcyByZXR1cm5lZCBieSB0aGUgY2FsbGJhY2sgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIG1hcChhcnJheSwgY2FsbGJhY2spIHtcblx0Y29uc3QgcmVzdWx0ID0gW107XG5cdGxldCBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cdHdoaWxlIChsZW5ndGgtLSkge1xuXHRcdHJlc3VsdFtsZW5ndGhdID0gY2FsbGJhY2soYXJyYXlbbGVuZ3RoXSk7XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBBIHNpbXBsZSBgQXJyYXkjbWFwYC1saWtlIHdyYXBwZXIgdG8gd29yayB3aXRoIGRvbWFpbiBuYW1lIHN0cmluZ3Mgb3IgZW1haWxcbiAqIGFkZHJlc3Nlcy5cbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge1N0cmluZ30gZG9tYWluIFRoZSBkb21haW4gbmFtZSBvciBlbWFpbCBhZGRyZXNzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgVGhlIGZ1bmN0aW9uIHRoYXQgZ2V0cyBjYWxsZWQgZm9yIGV2ZXJ5XG4gKiBjaGFyYWN0ZXIuXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBBIG5ldyBzdHJpbmcgb2YgY2hhcmFjdGVycyByZXR1cm5lZCBieSB0aGUgY2FsbGJhY2tcbiAqIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBtYXBEb21haW4oZG9tYWluLCBjYWxsYmFjaykge1xuXHRjb25zdCBwYXJ0cyA9IGRvbWFpbi5zcGxpdCgnQCcpO1xuXHRsZXQgcmVzdWx0ID0gJyc7XG5cdGlmIChwYXJ0cy5sZW5ndGggPiAxKSB7XG5cdFx0Ly8gSW4gZW1haWwgYWRkcmVzc2VzLCBvbmx5IHRoZSBkb21haW4gbmFtZSBzaG91bGQgYmUgcHVueWNvZGVkLiBMZWF2ZVxuXHRcdC8vIHRoZSBsb2NhbCBwYXJ0IChpLmUuIGV2ZXJ5dGhpbmcgdXAgdG8gYEBgKSBpbnRhY3QuXG5cdFx0cmVzdWx0ID0gcGFydHNbMF0gKyAnQCc7XG5cdFx0ZG9tYWluID0gcGFydHNbMV07XG5cdH1cblx0Ly8gQXZvaWQgYHNwbGl0KHJlZ2V4KWAgZm9yIElFOCBjb21wYXRpYmlsaXR5LiBTZWUgIzE3LlxuXHRkb21haW4gPSBkb21haW4ucmVwbGFjZShyZWdleFNlcGFyYXRvcnMsICdcXHgyRScpO1xuXHRjb25zdCBsYWJlbHMgPSBkb21haW4uc3BsaXQoJy4nKTtcblx0Y29uc3QgZW5jb2RlZCA9IG1hcChsYWJlbHMsIGNhbGxiYWNrKS5qb2luKCcuJyk7XG5cdHJldHVybiByZXN1bHQgKyBlbmNvZGVkO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgY29udGFpbmluZyB0aGUgbnVtZXJpYyBjb2RlIHBvaW50cyBvZiBlYWNoIFVuaWNvZGVcbiAqIGNoYXJhY3RlciBpbiB0aGUgc3RyaW5nLiBXaGlsZSBKYXZhU2NyaXB0IHVzZXMgVUNTLTIgaW50ZXJuYWxseSxcbiAqIHRoaXMgZnVuY3Rpb24gd2lsbCBjb252ZXJ0IGEgcGFpciBvZiBzdXJyb2dhdGUgaGFsdmVzIChlYWNoIG9mIHdoaWNoXG4gKiBVQ1MtMiBleHBvc2VzIGFzIHNlcGFyYXRlIGNoYXJhY3RlcnMpIGludG8gYSBzaW5nbGUgY29kZSBwb2ludCxcbiAqIG1hdGNoaW5nIFVURi0xNi5cbiAqIEBzZWUgYHB1bnljb2RlLnVjczIuZW5jb2RlYFxuICogQHNlZSA8aHR0cHM6Ly9tYXRoaWFzYnluZW5zLmJlL25vdGVzL2phdmFzY3JpcHQtZW5jb2Rpbmc+XG4gKiBAbWVtYmVyT2YgcHVueWNvZGUudWNzMlxuICogQG5hbWUgZGVjb2RlXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyaW5nIFRoZSBVbmljb2RlIGlucHV0IHN0cmluZyAoVUNTLTIpLlxuICogQHJldHVybnMge0FycmF5fSBUaGUgbmV3IGFycmF5IG9mIGNvZGUgcG9pbnRzLlxuICovXG5mdW5jdGlvbiB1Y3MyZGVjb2RlKHN0cmluZykge1xuXHRjb25zdCBvdXRwdXQgPSBbXTtcblx0bGV0IGNvdW50ZXIgPSAwO1xuXHRjb25zdCBsZW5ndGggPSBzdHJpbmcubGVuZ3RoO1xuXHR3aGlsZSAoY291bnRlciA8IGxlbmd0aCkge1xuXHRcdGNvbnN0IHZhbHVlID0gc3RyaW5nLmNoYXJDb2RlQXQoY291bnRlcisrKTtcblx0XHRpZiAodmFsdWUgPj0gMHhEODAwICYmIHZhbHVlIDw9IDB4REJGRiAmJiBjb3VudGVyIDwgbGVuZ3RoKSB7XG5cdFx0XHQvLyBJdCdzIGEgaGlnaCBzdXJyb2dhdGUsIGFuZCB0aGVyZSBpcyBhIG5leHQgY2hhcmFjdGVyLlxuXHRcdFx0Y29uc3QgZXh0cmEgPSBzdHJpbmcuY2hhckNvZGVBdChjb3VudGVyKyspO1xuXHRcdFx0aWYgKChleHRyYSAmIDB4RkMwMCkgPT0gMHhEQzAwKSB7IC8vIExvdyBzdXJyb2dhdGUuXG5cdFx0XHRcdG91dHB1dC5wdXNoKCgodmFsdWUgJiAweDNGRikgPDwgMTApICsgKGV4dHJhICYgMHgzRkYpICsgMHgxMDAwMCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBJdCdzIGFuIHVubWF0Y2hlZCBzdXJyb2dhdGU7IG9ubHkgYXBwZW5kIHRoaXMgY29kZSB1bml0LCBpbiBjYXNlIHRoZVxuXHRcdFx0XHQvLyBuZXh0IGNvZGUgdW5pdCBpcyB0aGUgaGlnaCBzdXJyb2dhdGUgb2YgYSBzdXJyb2dhdGUgcGFpci5cblx0XHRcdFx0b3V0cHV0LnB1c2godmFsdWUpO1xuXHRcdFx0XHRjb3VudGVyLS07XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdG91dHB1dC5wdXNoKHZhbHVlKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIG91dHB1dDtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgc3RyaW5nIGJhc2VkIG9uIGFuIGFycmF5IG9mIG51bWVyaWMgY29kZSBwb2ludHMuXG4gKiBAc2VlIGBwdW55Y29kZS51Y3MyLmRlY29kZWBcbiAqIEBtZW1iZXJPZiBwdW55Y29kZS51Y3MyXG4gKiBAbmFtZSBlbmNvZGVcbiAqIEBwYXJhbSB7QXJyYXl9IGNvZGVQb2ludHMgVGhlIGFycmF5IG9mIG51bWVyaWMgY29kZSBwb2ludHMuXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgbmV3IFVuaWNvZGUgc3RyaW5nIChVQ1MtMikuXG4gKi9cbmNvbnN0IHVjczJlbmNvZGUgPSBjb2RlUG9pbnRzID0+IFN0cmluZy5mcm9tQ29kZVBvaW50KC4uLmNvZGVQb2ludHMpO1xuXG4vKipcbiAqIENvbnZlcnRzIGEgYmFzaWMgY29kZSBwb2ludCBpbnRvIGEgZGlnaXQvaW50ZWdlci5cbiAqIEBzZWUgYGRpZ2l0VG9CYXNpYygpYFxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7TnVtYmVyfSBjb2RlUG9pbnQgVGhlIGJhc2ljIG51bWVyaWMgY29kZSBwb2ludCB2YWx1ZS5cbiAqIEByZXR1cm5zIHtOdW1iZXJ9IFRoZSBudW1lcmljIHZhbHVlIG9mIGEgYmFzaWMgY29kZSBwb2ludCAoZm9yIHVzZSBpblxuICogcmVwcmVzZW50aW5nIGludGVnZXJzKSBpbiB0aGUgcmFuZ2UgYDBgIHRvIGBiYXNlIC0gMWAsIG9yIGBiYXNlYCBpZlxuICogdGhlIGNvZGUgcG9pbnQgZG9lcyBub3QgcmVwcmVzZW50IGEgdmFsdWUuXG4gKi9cbmNvbnN0IGJhc2ljVG9EaWdpdCA9IGZ1bmN0aW9uKGNvZGVQb2ludCkge1xuXHRpZiAoY29kZVBvaW50ID49IDB4MzAgJiYgY29kZVBvaW50IDwgMHgzQSkge1xuXHRcdHJldHVybiAyNiArIChjb2RlUG9pbnQgLSAweDMwKTtcblx0fVxuXHRpZiAoY29kZVBvaW50ID49IDB4NDEgJiYgY29kZVBvaW50IDwgMHg1Qikge1xuXHRcdHJldHVybiBjb2RlUG9pbnQgLSAweDQxO1xuXHR9XG5cdGlmIChjb2RlUG9pbnQgPj0gMHg2MSAmJiBjb2RlUG9pbnQgPCAweDdCKSB7XG5cdFx0cmV0dXJuIGNvZGVQb2ludCAtIDB4NjE7XG5cdH1cblx0cmV0dXJuIGJhc2U7XG59O1xuXG4vKipcbiAqIENvbnZlcnRzIGEgZGlnaXQvaW50ZWdlciBpbnRvIGEgYmFzaWMgY29kZSBwb2ludC5cbiAqIEBzZWUgYGJhc2ljVG9EaWdpdCgpYFxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7TnVtYmVyfSBkaWdpdCBUaGUgbnVtZXJpYyB2YWx1ZSBvZiBhIGJhc2ljIGNvZGUgcG9pbnQuXG4gKiBAcmV0dXJucyB7TnVtYmVyfSBUaGUgYmFzaWMgY29kZSBwb2ludCB3aG9zZSB2YWx1ZSAod2hlbiB1c2VkIGZvclxuICogcmVwcmVzZW50aW5nIGludGVnZXJzKSBpcyBgZGlnaXRgLCB3aGljaCBuZWVkcyB0byBiZSBpbiB0aGUgcmFuZ2VcbiAqIGAwYCB0byBgYmFzZSAtIDFgLiBJZiBgZmxhZ2AgaXMgbm9uLXplcm8sIHRoZSB1cHBlcmNhc2UgZm9ybSBpc1xuICogdXNlZDsgZWxzZSwgdGhlIGxvd2VyY2FzZSBmb3JtIGlzIHVzZWQuIFRoZSBiZWhhdmlvciBpcyB1bmRlZmluZWRcbiAqIGlmIGBmbGFnYCBpcyBub24temVybyBhbmQgYGRpZ2l0YCBoYXMgbm8gdXBwZXJjYXNlIGZvcm0uXG4gKi9cbmNvbnN0IGRpZ2l0VG9CYXNpYyA9IGZ1bmN0aW9uKGRpZ2l0LCBmbGFnKSB7XG5cdC8vICAwLi4yNSBtYXAgdG8gQVNDSUkgYS4ueiBvciBBLi5aXG5cdC8vIDI2Li4zNSBtYXAgdG8gQVNDSUkgMC4uOVxuXHRyZXR1cm4gZGlnaXQgKyAyMiArIDc1ICogKGRpZ2l0IDwgMjYpIC0gKChmbGFnICE9IDApIDw8IDUpO1xufTtcblxuLyoqXG4gKiBCaWFzIGFkYXB0YXRpb24gZnVuY3Rpb24gYXMgcGVyIHNlY3Rpb24gMy40IG9mIFJGQyAzNDkyLlxuICogaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzM0OTIjc2VjdGlvbi0zLjRcbiAqIEBwcml2YXRlXG4gKi9cbmNvbnN0IGFkYXB0ID0gZnVuY3Rpb24oZGVsdGEsIG51bVBvaW50cywgZmlyc3RUaW1lKSB7XG5cdGxldCBrID0gMDtcblx0ZGVsdGEgPSBmaXJzdFRpbWUgPyBmbG9vcihkZWx0YSAvIGRhbXApIDogZGVsdGEgPj4gMTtcblx0ZGVsdGEgKz0gZmxvb3IoZGVsdGEgLyBudW1Qb2ludHMpO1xuXHRmb3IgKC8qIG5vIGluaXRpYWxpemF0aW9uICovOyBkZWx0YSA+IGJhc2VNaW51c1RNaW4gKiB0TWF4ID4+IDE7IGsgKz0gYmFzZSkge1xuXHRcdGRlbHRhID0gZmxvb3IoZGVsdGEgLyBiYXNlTWludXNUTWluKTtcblx0fVxuXHRyZXR1cm4gZmxvb3IoayArIChiYXNlTWludXNUTWluICsgMSkgKiBkZWx0YSAvIChkZWx0YSArIHNrZXcpKTtcbn07XG5cbi8qKlxuICogQ29udmVydHMgYSBQdW55Y29kZSBzdHJpbmcgb2YgQVNDSUktb25seSBzeW1ib2xzIHRvIGEgc3RyaW5nIG9mIFVuaWNvZGVcbiAqIHN5bWJvbHMuXG4gKiBAbWVtYmVyT2YgcHVueWNvZGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBpbnB1dCBUaGUgUHVueWNvZGUgc3RyaW5nIG9mIEFTQ0lJLW9ubHkgc3ltYm9scy5cbiAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSByZXN1bHRpbmcgc3RyaW5nIG9mIFVuaWNvZGUgc3ltYm9scy5cbiAqL1xuY29uc3QgZGVjb2RlID0gZnVuY3Rpb24oaW5wdXQpIHtcblx0Ly8gRG9uJ3QgdXNlIFVDUy0yLlxuXHRjb25zdCBvdXRwdXQgPSBbXTtcblx0Y29uc3QgaW5wdXRMZW5ndGggPSBpbnB1dC5sZW5ndGg7XG5cdGxldCBpID0gMDtcblx0bGV0IG4gPSBpbml0aWFsTjtcblx0bGV0IGJpYXMgPSBpbml0aWFsQmlhcztcblxuXHQvLyBIYW5kbGUgdGhlIGJhc2ljIGNvZGUgcG9pbnRzOiBsZXQgYGJhc2ljYCBiZSB0aGUgbnVtYmVyIG9mIGlucHV0IGNvZGVcblx0Ly8gcG9pbnRzIGJlZm9yZSB0aGUgbGFzdCBkZWxpbWl0ZXIsIG9yIGAwYCBpZiB0aGVyZSBpcyBub25lLCB0aGVuIGNvcHlcblx0Ly8gdGhlIGZpcnN0IGJhc2ljIGNvZGUgcG9pbnRzIHRvIHRoZSBvdXRwdXQuXG5cblx0bGV0IGJhc2ljID0gaW5wdXQubGFzdEluZGV4T2YoZGVsaW1pdGVyKTtcblx0aWYgKGJhc2ljIDwgMCkge1xuXHRcdGJhc2ljID0gMDtcblx0fVxuXG5cdGZvciAobGV0IGogPSAwOyBqIDwgYmFzaWM7ICsraikge1xuXHRcdC8vIGlmIGl0J3Mgbm90IGEgYmFzaWMgY29kZSBwb2ludFxuXHRcdGlmIChpbnB1dC5jaGFyQ29kZUF0KGopID49IDB4ODApIHtcblx0XHRcdGVycm9yKCdub3QtYmFzaWMnKTtcblx0XHR9XG5cdFx0b3V0cHV0LnB1c2goaW5wdXQuY2hhckNvZGVBdChqKSk7XG5cdH1cblxuXHQvLyBNYWluIGRlY29kaW5nIGxvb3A6IHN0YXJ0IGp1c3QgYWZ0ZXIgdGhlIGxhc3QgZGVsaW1pdGVyIGlmIGFueSBiYXNpYyBjb2RlXG5cdC8vIHBvaW50cyB3ZXJlIGNvcGllZDsgc3RhcnQgYXQgdGhlIGJlZ2lubmluZyBvdGhlcndpc2UuXG5cblx0Zm9yIChsZXQgaW5kZXggPSBiYXNpYyA+IDAgPyBiYXNpYyArIDEgOiAwOyBpbmRleCA8IGlucHV0TGVuZ3RoOyAvKiBubyBmaW5hbCBleHByZXNzaW9uICovKSB7XG5cblx0XHQvLyBgaW5kZXhgIGlzIHRoZSBpbmRleCBvZiB0aGUgbmV4dCBjaGFyYWN0ZXIgdG8gYmUgY29uc3VtZWQuXG5cdFx0Ly8gRGVjb2RlIGEgZ2VuZXJhbGl6ZWQgdmFyaWFibGUtbGVuZ3RoIGludGVnZXIgaW50byBgZGVsdGFgLFxuXHRcdC8vIHdoaWNoIGdldHMgYWRkZWQgdG8gYGlgLiBUaGUgb3ZlcmZsb3cgY2hlY2tpbmcgaXMgZWFzaWVyXG5cdFx0Ly8gaWYgd2UgaW5jcmVhc2UgYGlgIGFzIHdlIGdvLCB0aGVuIHN1YnRyYWN0IG9mZiBpdHMgc3RhcnRpbmdcblx0XHQvLyB2YWx1ZSBhdCB0aGUgZW5kIHRvIG9idGFpbiBgZGVsdGFgLlxuXHRcdGNvbnN0IG9sZGkgPSBpO1xuXHRcdGZvciAobGV0IHcgPSAxLCBrID0gYmFzZTsgLyogbm8gY29uZGl0aW9uICovOyBrICs9IGJhc2UpIHtcblxuXHRcdFx0aWYgKGluZGV4ID49IGlucHV0TGVuZ3RoKSB7XG5cdFx0XHRcdGVycm9yKCdpbnZhbGlkLWlucHV0Jyk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGRpZ2l0ID0gYmFzaWNUb0RpZ2l0KGlucHV0LmNoYXJDb2RlQXQoaW5kZXgrKykpO1xuXG5cdFx0XHRpZiAoZGlnaXQgPj0gYmFzZSkge1xuXHRcdFx0XHRlcnJvcignaW52YWxpZC1pbnB1dCcpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGRpZ2l0ID4gZmxvb3IoKG1heEludCAtIGkpIC8gdykpIHtcblx0XHRcdFx0ZXJyb3IoJ292ZXJmbG93Jyk7XG5cdFx0XHR9XG5cblx0XHRcdGkgKz0gZGlnaXQgKiB3O1xuXHRcdFx0Y29uc3QgdCA9IGsgPD0gYmlhcyA/IHRNaW4gOiAoayA+PSBiaWFzICsgdE1heCA/IHRNYXggOiBrIC0gYmlhcyk7XG5cblx0XHRcdGlmIChkaWdpdCA8IHQpIHtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGJhc2VNaW51c1QgPSBiYXNlIC0gdDtcblx0XHRcdGlmICh3ID4gZmxvb3IobWF4SW50IC8gYmFzZU1pbnVzVCkpIHtcblx0XHRcdFx0ZXJyb3IoJ292ZXJmbG93Jyk7XG5cdFx0XHR9XG5cblx0XHRcdHcgKj0gYmFzZU1pbnVzVDtcblxuXHRcdH1cblxuXHRcdGNvbnN0IG91dCA9IG91dHB1dC5sZW5ndGggKyAxO1xuXHRcdGJpYXMgPSBhZGFwdChpIC0gb2xkaSwgb3V0LCBvbGRpID09IDApO1xuXG5cdFx0Ly8gYGlgIHdhcyBzdXBwb3NlZCB0byB3cmFwIGFyb3VuZCBmcm9tIGBvdXRgIHRvIGAwYCxcblx0XHQvLyBpbmNyZW1lbnRpbmcgYG5gIGVhY2ggdGltZSwgc28gd2UnbGwgZml4IHRoYXQgbm93OlxuXHRcdGlmIChmbG9vcihpIC8gb3V0KSA+IG1heEludCAtIG4pIHtcblx0XHRcdGVycm9yKCdvdmVyZmxvdycpO1xuXHRcdH1cblxuXHRcdG4gKz0gZmxvb3IoaSAvIG91dCk7XG5cdFx0aSAlPSBvdXQ7XG5cblx0XHQvLyBJbnNlcnQgYG5gIGF0IHBvc2l0aW9uIGBpYCBvZiB0aGUgb3V0cHV0LlxuXHRcdG91dHB1dC5zcGxpY2UoaSsrLCAwLCBuKTtcblxuXHR9XG5cblx0cmV0dXJuIFN0cmluZy5mcm9tQ29kZVBvaW50KC4uLm91dHB1dCk7XG59O1xuXG4vKipcbiAqIENvbnZlcnRzIGEgc3RyaW5nIG9mIFVuaWNvZGUgc3ltYm9scyAoZS5nLiBhIGRvbWFpbiBuYW1lIGxhYmVsKSB0byBhXG4gKiBQdW55Y29kZSBzdHJpbmcgb2YgQVNDSUktb25seSBzeW1ib2xzLlxuICogQG1lbWJlck9mIHB1bnljb2RlXG4gKiBAcGFyYW0ge1N0cmluZ30gaW5wdXQgVGhlIHN0cmluZyBvZiBVbmljb2RlIHN5bWJvbHMuXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgcmVzdWx0aW5nIFB1bnljb2RlIHN0cmluZyBvZiBBU0NJSS1vbmx5IHN5bWJvbHMuXG4gKi9cbmNvbnN0IGVuY29kZSA9IGZ1bmN0aW9uKGlucHV0KSB7XG5cdGNvbnN0IG91dHB1dCA9IFtdO1xuXG5cdC8vIENvbnZlcnQgdGhlIGlucHV0IGluIFVDUy0yIHRvIGFuIGFycmF5IG9mIFVuaWNvZGUgY29kZSBwb2ludHMuXG5cdGlucHV0ID0gdWNzMmRlY29kZShpbnB1dCk7XG5cblx0Ly8gQ2FjaGUgdGhlIGxlbmd0aC5cblx0Y29uc3QgaW5wdXRMZW5ndGggPSBpbnB1dC5sZW5ndGg7XG5cblx0Ly8gSW5pdGlhbGl6ZSB0aGUgc3RhdGUuXG5cdGxldCBuID0gaW5pdGlhbE47XG5cdGxldCBkZWx0YSA9IDA7XG5cdGxldCBiaWFzID0gaW5pdGlhbEJpYXM7XG5cblx0Ly8gSGFuZGxlIHRoZSBiYXNpYyBjb2RlIHBvaW50cy5cblx0Zm9yIChjb25zdCBjdXJyZW50VmFsdWUgb2YgaW5wdXQpIHtcblx0XHRpZiAoY3VycmVudFZhbHVlIDwgMHg4MCkge1xuXHRcdFx0b3V0cHV0LnB1c2goc3RyaW5nRnJvbUNoYXJDb2RlKGN1cnJlbnRWYWx1ZSkpO1xuXHRcdH1cblx0fVxuXG5cdGNvbnN0IGJhc2ljTGVuZ3RoID0gb3V0cHV0Lmxlbmd0aDtcblx0bGV0IGhhbmRsZWRDUENvdW50ID0gYmFzaWNMZW5ndGg7XG5cblx0Ly8gYGhhbmRsZWRDUENvdW50YCBpcyB0aGUgbnVtYmVyIG9mIGNvZGUgcG9pbnRzIHRoYXQgaGF2ZSBiZWVuIGhhbmRsZWQ7XG5cdC8vIGBiYXNpY0xlbmd0aGAgaXMgdGhlIG51bWJlciBvZiBiYXNpYyBjb2RlIHBvaW50cy5cblxuXHQvLyBGaW5pc2ggdGhlIGJhc2ljIHN0cmluZyB3aXRoIGEgZGVsaW1pdGVyIHVubGVzcyBpdCdzIGVtcHR5LlxuXHRpZiAoYmFzaWNMZW5ndGgpIHtcblx0XHRvdXRwdXQucHVzaChkZWxpbWl0ZXIpO1xuXHR9XG5cblx0Ly8gTWFpbiBlbmNvZGluZyBsb29wOlxuXHR3aGlsZSAoaGFuZGxlZENQQ291bnQgPCBpbnB1dExlbmd0aCkge1xuXG5cdFx0Ly8gQWxsIG5vbi1iYXNpYyBjb2RlIHBvaW50cyA8IG4gaGF2ZSBiZWVuIGhhbmRsZWQgYWxyZWFkeS4gRmluZCB0aGUgbmV4dFxuXHRcdC8vIGxhcmdlciBvbmU6XG5cdFx0bGV0IG0gPSBtYXhJbnQ7XG5cdFx0Zm9yIChjb25zdCBjdXJyZW50VmFsdWUgb2YgaW5wdXQpIHtcblx0XHRcdGlmIChjdXJyZW50VmFsdWUgPj0gbiAmJiBjdXJyZW50VmFsdWUgPCBtKSB7XG5cdFx0XHRcdG0gPSBjdXJyZW50VmFsdWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gSW5jcmVhc2UgYGRlbHRhYCBlbm91Z2ggdG8gYWR2YW5jZSB0aGUgZGVjb2RlcidzIDxuLGk+IHN0YXRlIHRvIDxtLDA+LFxuXHRcdC8vIGJ1dCBndWFyZCBhZ2FpbnN0IG92ZXJmbG93LlxuXHRcdGNvbnN0IGhhbmRsZWRDUENvdW50UGx1c09uZSA9IGhhbmRsZWRDUENvdW50ICsgMTtcblx0XHRpZiAobSAtIG4gPiBmbG9vcigobWF4SW50IC0gZGVsdGEpIC8gaGFuZGxlZENQQ291bnRQbHVzT25lKSkge1xuXHRcdFx0ZXJyb3IoJ292ZXJmbG93Jyk7XG5cdFx0fVxuXG5cdFx0ZGVsdGEgKz0gKG0gLSBuKSAqIGhhbmRsZWRDUENvdW50UGx1c09uZTtcblx0XHRuID0gbTtcblxuXHRcdGZvciAoY29uc3QgY3VycmVudFZhbHVlIG9mIGlucHV0KSB7XG5cdFx0XHRpZiAoY3VycmVudFZhbHVlIDwgbiAmJiArK2RlbHRhID4gbWF4SW50KSB7XG5cdFx0XHRcdGVycm9yKCdvdmVyZmxvdycpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGN1cnJlbnRWYWx1ZSA9PT0gbikge1xuXHRcdFx0XHQvLyBSZXByZXNlbnQgZGVsdGEgYXMgYSBnZW5lcmFsaXplZCB2YXJpYWJsZS1sZW5ndGggaW50ZWdlci5cblx0XHRcdFx0bGV0IHEgPSBkZWx0YTtcblx0XHRcdFx0Zm9yIChsZXQgayA9IGJhc2U7IC8qIG5vIGNvbmRpdGlvbiAqLzsgayArPSBiYXNlKSB7XG5cdFx0XHRcdFx0Y29uc3QgdCA9IGsgPD0gYmlhcyA/IHRNaW4gOiAoayA+PSBiaWFzICsgdE1heCA/IHRNYXggOiBrIC0gYmlhcyk7XG5cdFx0XHRcdFx0aWYgKHEgPCB0KSB7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y29uc3QgcU1pbnVzVCA9IHEgLSB0O1xuXHRcdFx0XHRcdGNvbnN0IGJhc2VNaW51c1QgPSBiYXNlIC0gdDtcblx0XHRcdFx0XHRvdXRwdXQucHVzaChcblx0XHRcdFx0XHRcdHN0cmluZ0Zyb21DaGFyQ29kZShkaWdpdFRvQmFzaWModCArIHFNaW51c1QgJSBiYXNlTWludXNULCAwKSlcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdHEgPSBmbG9vcihxTWludXNUIC8gYmFzZU1pbnVzVCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRvdXRwdXQucHVzaChzdHJpbmdGcm9tQ2hhckNvZGUoZGlnaXRUb0Jhc2ljKHEsIDApKSk7XG5cdFx0XHRcdGJpYXMgPSBhZGFwdChkZWx0YSwgaGFuZGxlZENQQ291bnRQbHVzT25lLCBoYW5kbGVkQ1BDb3VudCA9PT0gYmFzaWNMZW5ndGgpO1xuXHRcdFx0XHRkZWx0YSA9IDA7XG5cdFx0XHRcdCsraGFuZGxlZENQQ291bnQ7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0KytkZWx0YTtcblx0XHQrK247XG5cblx0fVxuXHRyZXR1cm4gb3V0cHV0LmpvaW4oJycpO1xufTtcblxuLyoqXG4gKiBDb252ZXJ0cyBhIFB1bnljb2RlIHN0cmluZyByZXByZXNlbnRpbmcgYSBkb21haW4gbmFtZSBvciBhbiBlbWFpbCBhZGRyZXNzXG4gKiB0byBVbmljb2RlLiBPbmx5IHRoZSBQdW55Y29kZWQgcGFydHMgb2YgdGhlIGlucHV0IHdpbGwgYmUgY29udmVydGVkLCBpLmUuXG4gKiBpdCBkb2Vzbid0IG1hdHRlciBpZiB5b3UgY2FsbCBpdCBvbiBhIHN0cmluZyB0aGF0IGhhcyBhbHJlYWR5IGJlZW5cbiAqIGNvbnZlcnRlZCB0byBVbmljb2RlLlxuICogQG1lbWJlck9mIHB1bnljb2RlXG4gKiBAcGFyYW0ge1N0cmluZ30gaW5wdXQgVGhlIFB1bnljb2RlZCBkb21haW4gbmFtZSBvciBlbWFpbCBhZGRyZXNzIHRvXG4gKiBjb252ZXJ0IHRvIFVuaWNvZGUuXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgVW5pY29kZSByZXByZXNlbnRhdGlvbiBvZiB0aGUgZ2l2ZW4gUHVueWNvZGVcbiAqIHN0cmluZy5cbiAqL1xuY29uc3QgdG9Vbmljb2RlID0gZnVuY3Rpb24oaW5wdXQpIHtcblx0cmV0dXJuIG1hcERvbWFpbihpbnB1dCwgZnVuY3Rpb24oc3RyaW5nKSB7XG5cdFx0cmV0dXJuIHJlZ2V4UHVueWNvZGUudGVzdChzdHJpbmcpXG5cdFx0XHQ/IGRlY29kZShzdHJpbmcuc2xpY2UoNCkudG9Mb3dlckNhc2UoKSlcblx0XHRcdDogc3RyaW5nO1xuXHR9KTtcbn07XG5cbi8qKlxuICogQ29udmVydHMgYSBVbmljb2RlIHN0cmluZyByZXByZXNlbnRpbmcgYSBkb21haW4gbmFtZSBvciBhbiBlbWFpbCBhZGRyZXNzIHRvXG4gKiBQdW55Y29kZS4gT25seSB0aGUgbm9uLUFTQ0lJIHBhcnRzIG9mIHRoZSBkb21haW4gbmFtZSB3aWxsIGJlIGNvbnZlcnRlZCxcbiAqIGkuZS4gaXQgZG9lc24ndCBtYXR0ZXIgaWYgeW91IGNhbGwgaXQgd2l0aCBhIGRvbWFpbiB0aGF0J3MgYWxyZWFkeSBpblxuICogQVNDSUkuXG4gKiBAbWVtYmVyT2YgcHVueWNvZGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBpbnB1dCBUaGUgZG9tYWluIG5hbWUgb3IgZW1haWwgYWRkcmVzcyB0byBjb252ZXJ0LCBhcyBhXG4gKiBVbmljb2RlIHN0cmluZy5cbiAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBQdW55Y29kZSByZXByZXNlbnRhdGlvbiBvZiB0aGUgZ2l2ZW4gZG9tYWluIG5hbWUgb3JcbiAqIGVtYWlsIGFkZHJlc3MuXG4gKi9cbmNvbnN0IHRvQVNDSUkgPSBmdW5jdGlvbihpbnB1dCkge1xuXHRyZXR1cm4gbWFwRG9tYWluKGlucHV0LCBmdW5jdGlvbihzdHJpbmcpIHtcblx0XHRyZXR1cm4gcmVnZXhOb25BU0NJSS50ZXN0KHN0cmluZylcblx0XHRcdD8gJ3huLS0nICsgZW5jb2RlKHN0cmluZylcblx0XHRcdDogc3RyaW5nO1xuXHR9KTtcbn07XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vKiogRGVmaW5lIHRoZSBwdWJsaWMgQVBJICovXG5jb25zdCBwdW55Y29kZSA9IHtcblx0LyoqXG5cdCAqIEEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgY3VycmVudCBQdW55Y29kZS5qcyB2ZXJzaW9uIG51bWJlci5cblx0ICogQG1lbWJlck9mIHB1bnljb2RlXG5cdCAqIEB0eXBlIFN0cmluZ1xuXHQgKi9cblx0J3ZlcnNpb24nOiAnMi4zLjEnLFxuXHQvKipcblx0ICogQW4gb2JqZWN0IG9mIG1ldGhvZHMgdG8gY29udmVydCBmcm9tIEphdmFTY3JpcHQncyBpbnRlcm5hbCBjaGFyYWN0ZXJcblx0ICogcmVwcmVzZW50YXRpb24gKFVDUy0yKSB0byBVbmljb2RlIGNvZGUgcG9pbnRzLCBhbmQgYmFjay5cblx0ICogQHNlZSA8aHR0cHM6Ly9tYXRoaWFzYnluZW5zLmJlL25vdGVzL2phdmFzY3JpcHQtZW5jb2Rpbmc+XG5cdCAqIEBtZW1iZXJPZiBwdW55Y29kZVxuXHQgKiBAdHlwZSBPYmplY3Rcblx0ICovXG5cdCd1Y3MyJzoge1xuXHRcdCdkZWNvZGUnOiB1Y3MyZGVjb2RlLFxuXHRcdCdlbmNvZGUnOiB1Y3MyZW5jb2RlXG5cdH0sXG5cdCdkZWNvZGUnOiBkZWNvZGUsXG5cdCdlbmNvZGUnOiBlbmNvZGUsXG5cdCd0b0FTQ0lJJzogdG9BU0NJSSxcblx0J3RvVW5pY29kZSc6IHRvVW5pY29kZVxufTtcblxuZXhwb3J0IHsgdWNzMmRlY29kZSwgdWNzMmVuY29kZSwgZGVjb2RlLCBlbmNvZGUsIHRvQVNDSUksIHRvVW5pY29kZSB9O1xuZXhwb3J0IGRlZmF1bHQgcHVueWNvZGU7XG4iLCJpbXBvcnQgeyB1c2VVbmlEaXJlY3RpdmUgfSBmcm9tICcuLi9jb21wb3NhYmxlJztcbmltcG9ydCB7IGdldEJvdW5kZWRJbnN0YW5jZSwgaHRtbCwgc2VsZWN0QWxsLCBzZWxlY3RPbmUsIHRyYW5zLCB1c2VVSVRoZW1lIH0gZnJvbSAnLi4vc2VydmljZSc7XG5pbXBvcnQgeyBOdWxsYWJsZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IG1lcmdlRGVlcCB9IGZyb20gJy4uL3V0aWxpdGllcyc7XG5pbXBvcnQgKiBhcyBwdW55Y29kZSBmcm9tICdwdW55Y29kZSc7XG5cbmV4cG9ydCBkZWNsYXJlIHR5cGUgVmFsaWRhdGlvbkhhbmRsZXIgPSAodmFsdWU6IGFueSwgaW5wdXQ6IEhUTUxFbGVtZW50LCBvcHRpb25zPzogUmVjb3JkPHN0cmluZywgYW55PiwgZnY/OiBVbmljb3JuRmllbGRWYWxpZGF0aW9uKSA9PiBhbnk7XG5cbmV4cG9ydCBkZWNsYXJlIHR5cGUgVmFsaWRhdG9yID0ge1xuICBoYW5kbGVyOiBWYWxpZGF0aW9uSGFuZGxlcixcbiAgb3B0aW9ucz86IFJlY29yZDxzdHJpbmcsIGFueT47XG59O1xuXG5jb25zdCB2YWxpZGF0b3JIYW5kbGVyczogUmVjb3JkPHN0cmluZywgVmFsaWRhdGlvbkhhbmRsZXI+ID0ge307XG5cbnR5cGUgSW5wdXRFbGVtZW50cyA9IEhUTUxJbnB1dEVsZW1lbnQgfCBIVE1MU2VsZWN0RWxlbWVudCB8IEhUTUxUZXh0QXJlYUVsZW1lbnQ7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRm9ybVZhbGlkYXRpb25PcHRpb25zIHtcbiAgc2Nyb2xsOiBib29sZWFuO1xuICB2YWxpZGF0ZWRDbGFzczogbnVsbDtcbiAgZmllbGRTZWxlY3RvcjogbnVsbDtcbiAgc2Nyb2xsT2Zmc2V0OiBudW1iZXI7XG4gIGVuYWJsZWQ6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRmllbGRWYWxpZGF0aW9uT3B0aW9ucyB7XG4gIHZhbGlkQ2xhc3M6IHN0cmluZztcbiAgZXJyb3JTZWxlY3Rvcjogc3RyaW5nO1xuICBpbnB1dE9wdGlvbnM6IGJvb2xlYW47XG4gIGlucHV0T3B0aW9uc1NlbGVjdG9yOiBzdHJpbmc7XG4gIGZvcm1TZWxlY3Rvcjogc3RyaW5nO1xuICBzZWxlY3Rvcjogc3RyaW5nO1xuICBpbnB1dE9wdGlvbnNXcmFwcGVyU2VsZWN0b3I6IHN0cmluZztcbiAgZXZlbnRzOiBzdHJpbmdbXTtcbiAgaW52YWxpZENsYXNzOiBzdHJpbmc7XG4gIGVycm9yTWVzc2FnZUNsYXNzOiBzdHJpbmc7XG59XG5cbmNvbnN0IGRlZmF1bHRPcHRpb25zOiBGb3JtVmFsaWRhdGlvbk9wdGlvbnMgPSB7XG4gIHNjcm9sbDogZmFsc2UsXG4gIHNjcm9sbE9mZnNldDogLTEwMCxcbiAgZW5hYmxlZDogdHJ1ZSxcbiAgZmllbGRTZWxlY3RvcjogbnVsbCxcbiAgdmFsaWRhdGVkQ2xhc3M6IG51bGwsXG59O1xuXG5jb25zdCBkZWZhdWx0RmllbGRPcHRpb25zOiBGaWVsZFZhbGlkYXRpb25PcHRpb25zID0ge1xuICBmb3JtU2VsZWN0b3I6ICdbdW5pLWZvcm0tdmFsaWRhdGVdJyxcbiAgZXJyb3JTZWxlY3RvcjogJ1tkYXRhLWZpZWxkLWVycm9yXScsXG4gIHNlbGVjdG9yOiAnaW5wdXRbZGF0YS1maWVsZC1pbnB1dF0sIHNlbGVjdFtkYXRhLWZpZWxkLWlucHV0XSwgdGV4dGFyZWFbZGF0YS1maWVsZC1pbnB1dF0nLFxuICB2YWxpZENsYXNzOiAnaXMtdmFsaWQnLFxuICBpbnZhbGlkQ2xhc3M6ICdpcy1pbnZhbGlkJyxcbiAgZXZlbnRzOiBbJ2NoYW5nZSddLFxuICBlcnJvck1lc3NhZ2VDbGFzczogJ2ludmFsaWQtdG9vbHRpcCcsXG4gIGlucHV0T3B0aW9uczogZmFsc2UsXG4gIGlucHV0T3B0aW9uc1dyYXBwZXJTZWxlY3RvcjogJ2RpdltkYXRhLWZpZWxkLWlucHV0XScsXG4gIGlucHV0T3B0aW9uc1NlbGVjdG9yOiAnW2RhdGEtaW5wdXQtb3B0aW9uXSdcbn07XG5cbmV4cG9ydCBjbGFzcyBVbmljb3JuRm9ybVZhbGlkYXRpb24ge1xuICBwcmVzZXRGaWVsZHM6IEhUTUxFbGVtZW50W10gPSBbXTtcblxuICBzdGF0aWMgZ2xvYmFsVmFsaWRhdG9yczogUmVjb3JkPHN0cmluZywgVmFsaWRhdG9yPiA9IHt9O1xuXG4gIHZhbGlkYXRvcnM6IFJlY29yZDxzdHJpbmcsIFZhbGlkYXRvcj4gPSB7fTtcbiAgb3B0aW9uczogRm9ybVZhbGlkYXRpb25PcHRpb25zO1xuICAkZm9ybTogSFRNTEVsZW1lbnQ7XG5cbiAgc3RhdGljIGlzID0gJ3VuaS1mb3JtLXZhbGlkYXRlJztcblxuICBjb25zdHJ1Y3RvcihlbDogSFRNTEVsZW1lbnQsIG9wdGlvbnM6IFBhcnRpYWw8Rm9ybVZhbGlkYXRpb25PcHRpb25zPiA9IHt9KSB7XG4gICAgdGhpcy4kZm9ybSA9IHNlbGVjdE9uZShlbCk7XG4gICAgdGhpcy5vcHRpb25zID0gdGhpcy5tZXJnZU9wdGlvbnMob3B0aW9ucyk7XG5cbiAgICB0aGlzLnJlZ2lzdGVyRGVmYXVsdFZhbGlkYXRvcnMoKTtcblxuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgbWVyZ2VPcHRpb25zKG9wdGlvbnM6IFBhcnRpYWw8Rm9ybVZhbGlkYXRpb25PcHRpb25zPikge1xuICAgIC8vIEZpeCBQSFAgZW1wdHkgYXJyYXkgdG8gSlNPTiBpc3N1ZS5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShvcHRpb25zKSkge1xuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLm9wdGlvbnMgPSBtZXJnZURlZXAoe30sIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgfVxuXG4gIGdldCBzY3JvbGxFbmFibGVkKCkge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnMuc2Nyb2xsO1xuICB9XG5cbiAgZ2V0IHNjcm9sbE9mZnNldCgpIHtcbiAgICByZXR1cm4gTnVtYmVyKHRoaXMub3B0aW9ucy5zY3JvbGxPZmZzZXQgfHwgLTEwMCk7XG4gIH1cblxuICBnZXQgZmllbGRTZWxlY3RvcigpIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLmZpZWxkU2VsZWN0b3IgfHwgJ2lucHV0LCBzZWxlY3QsIHRleHRhcmVhJztcbiAgfVxuXG4gIGdldCB2YWxpZGF0ZWRDbGFzcygpIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLnZhbGlkYXRlZENsYXNzIHx8ICd3YXMtdmFsaWRhdGVkJztcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgaWYgKHRoaXMuJGZvcm0udGFnTmFtZSA9PT0gJ0ZPUk0nKSB7XG4gICAgICB0aGlzLiRmb3JtLnNldEF0dHJpYnV0ZSgnbm92YWxpZGF0ZScsICd0cnVlJyk7XG4gICAgICB0aGlzLiRmb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIChldmVudCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmVuYWJsZWQgJiYgIXRoaXMudmFsaWRhdGVBbGwoKSkge1xuICAgICAgICAgIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpOyAvLyBTdG9wIGZvbGxvd2luZyBldmVudHNcbiAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgdGhpcy4kZm9ybS5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnaW52YWxpZCcpKTtcblxuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSwgZmFsc2UpO1xuICAgIH1cblxuICAgIHRoaXMucHJlcGFyZUZpZWxkcyh0aGlzLmZpbmRET01GaWVsZHMoKSk7XG4gICAgdGhpcy5wcmVwYXJlRmllbGRzKHRoaXMucHJlc2V0RmllbGRzKTtcbiAgfVxuXG4gIGZpbmRET01GaWVsZHMoKTogSFRNTEVsZW1lbnRbXSB7XG4gICAgcmV0dXJuIHNlbGVjdEFsbCh0aGlzLiRmb3JtLnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KHRoaXMuZmllbGRTZWxlY3RvcikpO1xuICB9XG5cbiAgcHJlcGFyZUZpZWxkcyhpbnB1dHM6IEhUTUxFbGVtZW50W10pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpbnB1dHMuZm9yRWFjaCgoaW5wdXQpID0+IHtcbiAgICAgIHRoaXMucHJlcGFyZUZpZWxkV3JhcHBlcihpbnB1dCk7XG4gICAgfSk7XG5cbiAgICAvLyBXYWl0IG5leHQgdGlja1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfVxuXG4gIHByZXBhcmVGaWVsZFdyYXBwZXIoaW5wdXQ6IEhUTUxFbGVtZW50KTogSFRNTEVsZW1lbnQgfCBudWxsIHtcbiAgICBpZiAoWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXS5pbmRleE9mKGlucHV0LnRhZ05hbWUpICE9PSAtMSkge1xuICAgICAgbGV0IHdyYXBwZXI6IEhUTUxFbGVtZW50IHwgbnVsbCA9IGlucHV0LmNsb3Nlc3QoJ1t1bmktZmllbGQtdmFsaWRhdGVdJyk7XG5cbiAgICAgIGlmICghd3JhcHBlcikge1xuICAgICAgICB3cmFwcGVyID0gaW5wdXQuY2xvc2VzdCgnW2RhdGEtaW5wdXQtY29udGFpbmVyXScpIHx8IGlucHV0LnBhcmVudEVsZW1lbnQ7XG5cbiAgICAgICAgd3JhcHBlcj8uc2V0QXR0cmlidXRlKCd1bmktZmllbGQtdmFsaWRhdGUnLCAne30nKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHdyYXBwZXI7XG4gICAgfVxuXG4gICAgcmV0dXJuIGlucHV0O1xuICB9XG5cbiAgZmluZEZpZWxkcyhjb250YWluc1ByZXNldHM6IGJvb2xlYW4gPSB0cnVlKTogSFRNTEVsZW1lbnRbXSB7XG4gICAgbGV0IGlucHV0cyA9IHRoaXMuZmluZERPTUZpZWxkcygpO1xuXG4gICAgaWYgKGNvbnRhaW5zUHJlc2V0cykge1xuICAgICAgaW5wdXRzLnB1c2goLi4udGhpcy5wcmVzZXRGaWVsZHMpO1xuICAgIH1cblxuICAgIHJldHVybiBpbnB1dHMubWFwKChpbnB1dCkgPT4gdGhpcy5wcmVwYXJlRmllbGRXcmFwcGVyKGlucHV0KSlcbiAgICAgIC5maWx0ZXIoaW5wdXQgPT4gaW5wdXQgIT0gbnVsbCkgYXMgSFRNTEVsZW1lbnRbXTtcbiAgfVxuXG4gIGdldEZpZWxkQ29tcG9uZW50KGlucHV0OiBIVE1MRWxlbWVudCk6IFVuaWNvcm5GaWVsZFZhbGlkYXRpb24gfCBudWxsIHtcbiAgICBsZXQgdiA9IGdldEJvdW5kZWRJbnN0YW5jZShpbnB1dCwgJ2ZpZWxkLnZhbGlkYXRpb24nKTtcblxuICAgIGlmICghdikge1xuICAgICAgY29uc3Qgd3JhcHBlciA9IGlucHV0LmNsb3Nlc3QoJ1t1bmktZmllbGQtdmFsaWRhdGVdJykgYXMgSFRNTEVsZW1lbnQgfCBudWxsO1xuXG4gICAgICBpZiAod3JhcHBlcikge1xuICAgICAgICB2ID0gZ2V0Qm91bmRlZEluc3RhbmNlKHdyYXBwZXIsICdmaWVsZC52YWxpZGF0aW9uJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHY7XG4gIH1cblxuICB2YWxpZGF0ZUFsbChmaWVsZHM/OiBOdWxsYWJsZTxIVE1MRWxlbWVudFtdPik6IGJvb2xlYW4ge1xuICAgIHRoaXMubWFya0Zvcm1Bc1VudmFsaWRhdGVkKCk7XG5cbiAgICBmaWVsZHMgPSBmaWVsZHMgfHwgdGhpcy5maW5kRmllbGRzKCk7XG4gICAgbGV0IGZpcnN0RmFpbDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcblxuICAgIGZvciAoY29uc3QgZmllbGQgb2YgZmllbGRzKSB7XG4gICAgICBjb25zdCBmdiA9IHRoaXMuZ2V0RmllbGRDb21wb25lbnQoZmllbGQpO1xuXG4gICAgICBpZiAoIWZ2KSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCByZXN1bHQgPSBmdi5jaGVja1ZhbGlkaXR5KCk7XG5cbiAgICAgIGlmICghcmVzdWx0ICYmICFmaXJzdEZhaWwpIHtcbiAgICAgICAgZmlyc3RGYWlsID0gZmllbGQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5tYXJrRm9ybUFzVmFsaWRhdGVkKCk7XG5cbiAgICBpZiAoZmlyc3RGYWlsICYmIHRoaXMuc2Nyb2xsRW5hYmxlZCkge1xuICAgICAgdGhpcy5zY3JvbGxUbyhmaXJzdEZhaWwpO1xuICAgIH1cblxuICAgIHJldHVybiBmaXJzdEZhaWwgPT09IG51bGw7XG4gIH1cblxuICBhc3luYyB2YWxpZGF0ZUFsbEFzeW5jKGZpZWxkcz86IE51bGxhYmxlPEhUTUxFbGVtZW50W10+KTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgdGhpcy5tYXJrRm9ybUFzVW52YWxpZGF0ZWQoKTtcblxuICAgIGZpZWxkcyA9IGZpZWxkcyB8fCB0aGlzLmZpbmRGaWVsZHMoKTtcbiAgICBsZXQgZmlyc3RGYWlsOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICAgIGNvbnN0IHByb21pc2VzOiBQcm9taXNlPGJvb2xlYW4+W10gPSBbXTtcblxuICAgIGZvciAoY29uc3QgZmllbGQgb2YgZmllbGRzKSB7XG4gICAgICBjb25zdCBmdiA9IHRoaXMuZ2V0RmllbGRDb21wb25lbnQoZmllbGQpO1xuXG4gICAgICBpZiAoIWZ2KSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBwcm9taXNlcy5wdXNoKFxuICAgICAgICBmdi5jaGVja1ZhbGlkaXR5QXN5bmMoKS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICBpZiAoIXJlc3VsdCAmJiAhZmlyc3RGYWlsKSB7XG4gICAgICAgICAgICBmaXJzdEZhaWwgPSBmaWVsZDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcyk7XG5cbiAgICB0aGlzLm1hcmtGb3JtQXNWYWxpZGF0ZWQoKTtcblxuICAgIGlmIChmaXJzdEZhaWwgJiYgdGhpcy5zY3JvbGxFbmFibGVkKSB7XG4gICAgICB0aGlzLnNjcm9sbFRvKGZpcnN0RmFpbCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZpcnN0RmFpbCA9PT0gbnVsbDtcbiAgfVxuXG4gIHNjcm9sbFRvKGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gICAgY29uc3Qgb2Zmc2V0ID0gdGhpcy5zY3JvbGxPZmZzZXQ7XG4gICAgY29uc3QgZWxlbWVudFBvc2l0aW9uID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3A7XG4gICAgY29uc3Qgb2Zmc2V0UG9zaXRpb24gPSBlbGVtZW50UG9zaXRpb24gKyB3aW5kb3cuc2Nyb2xsWSArIG9mZnNldDtcblxuICAgIHdpbmRvdy5zY3JvbGxUbyh7XG4gICAgICB0b3A6IG9mZnNldFBvc2l0aW9uLFxuICAgICAgYmVoYXZpb3I6ICdzbW9vdGgnXG4gICAgfSk7XG4gIH1cblxuICBtYXJrRm9ybUFzVmFsaWRhdGVkKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy4kZm9ybSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuJGZvcm0uY2xhc3NMaXN0LmFkZCh0aGlzLnZhbGlkYXRlZENsYXNzKTtcbiAgfVxuXG4gIG1hcmtGb3JtQXNVbnZhbGlkYXRlZCgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuJGZvcm0pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLiRmb3JtLmNsYXNzTGlzdC5yZW1vdmUodGhpcy52YWxpZGF0ZWRDbGFzcyk7XG4gIH1cblxuICBhZGRGaWVsZChmaWVsZDogSFRNTEVsZW1lbnQpOiB0aGlzIHtcbiAgICB0aGlzLnByZXNldEZpZWxkcy5wdXNoKGZpZWxkKTtcblxuICAgIHRoaXMucHJlcGFyZUZpZWxkV3JhcHBlcihmaWVsZCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJlZ2lzdGVyRGVmYXVsdFZhbGlkYXRvcnMoKTogdm9pZCB7XG4gICAgZm9yIChsZXQgbmFtZSBpbiB2YWxpZGF0b3JIYW5kbGVycykge1xuICAgICAgdGhpcy5hZGRWYWxpZGF0b3IobmFtZSwgdmFsaWRhdG9ySGFuZGxlcnNbbmFtZV0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgdmFsaWRhdG9yIGhhbmRsZXIuXG4gICAqL1xuICBhZGRWYWxpZGF0b3IobmFtZTogc3RyaW5nLCBoYW5kbGVyOiBWYWxpZGF0aW9uSGFuZGxlciwgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9KSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICB0aGlzLnZhbGlkYXRvcnNbbmFtZV0gPSB7XG4gICAgICBoYW5kbGVyLFxuICAgICAgb3B0aW9uc1xuICAgIH07XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgdmFsaWRhdG9yIGhhbmRsZXIuXG4gICAqL1xuICBzdGF0aWMgYWRkR2xvYmFsVmFsaWRhdG9yKG5hbWU6IHN0cmluZywgaGFuZGxlcjogVmFsaWRhdGlvbkhhbmRsZXIsIG9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fSkge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgdGhpcy5nbG9iYWxWYWxpZGF0b3JzW25hbWVdID0ge1xuICAgICAgaGFuZGxlcixcbiAgICAgIG9wdGlvbnNcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFVuaWNvcm5GaWVsZFZhbGlkYXRpb24ge1xuICAkaW5wdXQ6IElucHV0RWxlbWVudHMgfCB1bmRlZmluZWQ7XG4gIG9wdGlvbnM6IEZpZWxkVmFsaWRhdGlvbk9wdGlvbnM7XG5cbiAgc3RhdGljIGlzID0gJ3VuaS1maWVsZC12YWxpZGF0ZSc7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGVsOiBIVE1MRWxlbWVudCwgb3B0aW9uczogUGFydGlhbDxGaWVsZFZhbGlkYXRpb25PcHRpb25zPiA9IHt9KSB7XG4gICAgdGhpcy5vcHRpb25zID0gdGhpcy5tZXJnZU9wdGlvbnMob3B0aW9ucyk7XG5cbiAgICB0aGlzLiRpbnB1dCA9IHRoaXMuc2VsZWN0SW5wdXQoKTtcblxuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgbWVyZ2VPcHRpb25zKG9wdGlvbnM6IFBhcnRpYWw8RmllbGRWYWxpZGF0aW9uT3B0aW9ucz4pIHtcbiAgICAvLyBGaXggUEhQIGVtcHR5IGFycmF5IHRvIEpTT04gaXNzdWUuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkob3B0aW9ucykpIHtcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5vcHRpb25zID0gbWVyZ2VEZWVwKHt9LCBkZWZhdWx0RmllbGRPcHRpb25zLCBvcHRpb25zKTtcbiAgfVxuXG4gIGdldCAkZm9ybSgpOiBIVE1MRm9ybUVsZW1lbnQge1xuICAgIHJldHVybiB0aGlzLmdldEZvcm0oKTtcbiAgfVxuXG4gIGdldCBlcnJvclNlbGVjdG9yKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy5lcnJvclNlbGVjdG9yO1xuICB9XG5cbiAgZ2V0IHNlbGVjdG9yKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy5zZWxlY3RvcjtcbiAgfVxuXG4gIGdldCB2YWxpZENsYXNzKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy52YWxpZENsYXNzO1xuICB9XG5cbiAgZ2V0IGludmFsaWRDbGFzcygpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnMuaW52YWxpZENsYXNzO1xuICB9XG5cbiAgZ2V0IGlzVmlzaWJsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISEodGhpcy5lbC5vZmZzZXRXaWR0aCB8fCB0aGlzLmVsLm9mZnNldEhlaWdodCB8fCB0aGlzLmVsLmdldENsaWVudFJlY3RzKCkubGVuZ3RoKTtcbiAgfVxuXG4gIGdldCBpc0lucHV0T3B0aW9ucygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gQm9vbGVhbih0aGlzLm9wdGlvbnMuaW5wdXRPcHRpb25zKTtcbiAgfVxuXG4gIGdldCB2YWxpZGF0aW9uTWVzc2FnZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLiRpbnB1dD8udmFsaWRhdGlvbk1lc3NhZ2UgfHwgJyc7XG4gIH1cblxuICBnZXQgdmFsaWRpdHkoKTogVmFsaWRpdHlTdGF0ZSB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuJGlucHV0Py52YWxpZGl0eTtcbiAgfVxuXG4gIHNlbGVjdElucHV0KCk6IElucHV0RWxlbWVudHMgfCB1bmRlZmluZWQge1xuICAgIGxldCBzZWxlY3RvciA9IHRoaXMuc2VsZWN0b3I7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmlucHV0T3B0aW9ucykge1xuICAgICAgc2VsZWN0b3IgKz0gJywgJyArIHRoaXMub3B0aW9ucy5pbnB1dE9wdGlvbnNXcmFwcGVyU2VsZWN0b3I7XG4gICAgfVxuXG4gICAgbGV0IGlucHV0ID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yPElucHV0RWxlbWVudHM+KHNlbGVjdG9yKTtcblxuICAgIGlmICghaW5wdXQpIHtcbiAgICAgIGlucHV0ID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yPElucHV0RWxlbWVudHM+KCdpbnB1dCwgc2VsZWN0LCB0ZXh0YXJlYScpO1xuICAgIH1cblxuICAgIGlmICghaW5wdXQpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuJGlucHV0ID0gaW5wdXQ7XG4gIH1cblxuICBpbml0KCkge1xuICAgIHRoaXMuc2VsZWN0SW5wdXQoKTtcblxuICAgIHRoaXMuYmluZEV2ZW50cygpO1xuXG4gICAgdGhpcy5wcmVwYXJlV3JhcHBlcigpO1xuXG4gICAgaWYgKHRoaXMuaXNJbnB1dE9wdGlvbnMpIHtcbiAgICAgIGNvbnN0ICRpbnB1dCA9IHRoaXMuJGlucHV0IGFzIGFueTtcblxuICAgICAgJGlucHV0LnZhbGlkYXRpb25NZXNzYWdlID0gJyc7XG4gICAgICAkaW5wdXQuc2V0Q3VzdG9tVmFsaWRpdHkgPSAobXNnOiBzdHJpbmcpID0+IHtcbiAgICAgICAgJGlucHV0LnZhbGlkYXRpb25NZXNzYWdlID0gU3RyaW5nKG1zZyk7XG4gICAgICB9O1xuXG4gICAgICAkaW5wdXQuY2hlY2tWYWxpZGl0eSA9ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2tJbnB1dE9wdGlvbnNWYWxpZGl0eSgpO1xuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICBiaW5kRXZlbnRzKCkge1xuICAgIGlmICghdGhpcy4kaW5wdXQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLiRpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnZhbGlkJywgKGUpID0+IHtcbiAgICAgIHRoaXMuc2hvd0ludmFsaWRSZXNwb25zZSgpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgZXZlbnRzID0gdGhpcy5vcHRpb25zLmV2ZW50cztcblxuICAgIGV2ZW50cy5mb3JFYWNoKChldmVudE5hbWUpID0+IHtcbiAgICAgIHRoaXMuJGlucHV0Py5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgKCkgPT4ge1xuICAgICAgICB0aGlzLmNoZWNrVmFsaWRpdHkoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJlcGFyZVdyYXBwZXIoKSB7XG4gICAgaWYgKHRoaXMuZWwucXVlcnlTZWxlY3Rvcih0aGlzLmVycm9yU2VsZWN0b3IpPy5jbGFzc0xpc3Q/LmNvbnRhaW5zKCdpbnZhbGlkLXRvb2x0aXAnKSkge1xuICAgICAgaWYgKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMuZWwpLnBvc2l0aW9uID09PSAnc3RhdGljJykge1xuICAgICAgICB0aGlzLmVsLnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjaGVja1ZhbGlkaXR5KCkge1xuICAgIGlmICghdGhpcy4kaW5wdXQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLiRpbnB1dC5oYXNBdHRyaWJ1dGUoJ3JlYWRvbmx5JykpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLiRpbnB1dC5oYXNBdHRyaWJ1dGUoJ1tkYXRhLW5vdmFsaWRhdGVdJykpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLiRpbnB1dC5jbG9zZXN0KCdbZGF0YS1ub3ZhbGlkYXRlXScpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICB0aGlzLiRpbnB1dC5zZXRDdXN0b21WYWxpZGl0eSgnJyk7XG4gICAgbGV0IHZhbGlkID0gdGhpcy4kaW5wdXQuY2hlY2tWYWxpZGl0eSgpO1xuXG4gICAgaWYgKHZhbGlkICYmIHRoaXMuJGZvcm0pIHtcbiAgICAgIHZhbGlkID0gdGhpcy5ydW5DdXN0b21WYWxpZGl0eSgpO1xuICAgIH1cblxuICAgIC8vIFJhaXNlIGludmFsaWQgZXZlbnRcbiAgICAvLyB0aGlzLiRpbnB1dC5jaGVja1ZhbGlkaXR5KCk7XG5cbiAgICB0aGlzLnVwZGF0ZVZhbGlkQ2xhc3ModmFsaWQpO1xuXG4gICAgcmV0dXJuIHZhbGlkO1xuICB9XG5cbiAgcnVuQ3VzdG9tVmFsaWRpdHkoKSB7XG4gICAgaWYgKCF0aGlzLiRpbnB1dCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgY3VzdG9tIHZhbGlkaXR5XG4gICAgY29uc3QgdmFsaWRhdGVzID0gKHRoaXMuJGlucHV0LmdldEF0dHJpYnV0ZSgnZGF0YS12YWxpZGF0ZScpIHx8ICcnKS5zcGxpdCgnfCcpO1xuICAgIGxldCByZXN1bHQgPSB0cnVlO1xuXG4gICAgaWYgKHRoaXMuJGlucHV0LnZhbHVlICE9PSAnJyAmJiB2YWxpZGF0ZXMubGVuZ3RoKSB7XG4gICAgICBpZiAoIXRoaXMuY2hlY2tDdXN0b21EYXRhQXR0cmlidXRlVmFsaWRpdHkoKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGZvciAoY29uc3QgdmFsaWRhdG9yTmFtZSBvZiB2YWxpZGF0ZXMpIHtcbiAgICAgICAgY29uc3QgW3ZhbGlkYXRvciwgb3B0aW9uc10gPSB0aGlzLmdldFZhbGlkYXRvcih2YWxpZGF0b3JOYW1lKSB8fCBbbnVsbCwge31dO1xuXG4gICAgICAgIGlmICghdmFsaWRhdG9yKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBPYmplY3QuYXNzaWduKG9wdGlvbnMsIHZhbGlkYXRvci5vcHRpb25zKTtcblxuICAgICAgICBsZXQgciA9IHZhbGlkYXRvci5oYW5kbGVyKHRoaXMuJGlucHV0LnZhbHVlLCB0aGlzLiRpbnB1dCwgb3B0aW9ucywgdGhpcyk7XG5cbiAgICAgICAgLy8gSWYgcmV0dXJuIGlzIGEgcHJvbWlzZSwgcHVzaCB0byBzdGFjayBhbmQgcmVzb2x2ZSBsYXRlclxuICAgICAgICBpZiAociBpbnN0YW5jZW9mIFByb21pc2UgfHwgKHR5cGVvZiByID09PSAnb2JqZWN0JyAmJiByLnRoZW4pKSB7XG4gICAgICAgICAgci50aGVuKChyZXN1bHQ6IGJvb2xlYW4pID0+IHtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlQXN5bmNDdXN0b21SZXN1bHQocmVzdWx0LCB2YWxpZGF0b3IpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLmhhbmRsZUN1c3RvbVJlc3VsdChyLCB2YWxpZGF0b3IpKSB7XG4gICAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBhc3luYyBjaGVja1ZhbGlkaXR5QXN5bmMoKSB7XG4gICAgaWYgKCF0aGlzLiRpbnB1dCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuJGlucHV0Lmhhc0F0dHJpYnV0ZSgncmVhZG9ubHknKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgdGhpcy4kaW5wdXQuc2V0Q3VzdG9tVmFsaWRpdHkoJycpO1xuICAgIGxldCB2YWxpZCA9IHRoaXMuJGlucHV0LmNoZWNrVmFsaWRpdHkoKTtcblxuICAgIGlmICh2YWxpZCAmJiB0aGlzLiRmb3JtKSB7XG4gICAgICB2YWxpZCA9IGF3YWl0IHRoaXMucnVuQ3VzdG9tVmFsaWRpdHlBc3luYygpO1xuICAgIH1cblxuICAgIHRoaXMudXBkYXRlVmFsaWRDbGFzcyh2YWxpZCk7XG5cbiAgICByZXR1cm4gdmFsaWQ7XG4gIH1cblxuICBhc3luYyBydW5DdXN0b21WYWxpZGl0eUFzeW5jKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGlmICghdGhpcy4kaW5wdXQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGN1c3RvbSB2YWxpZGl0eVxuICAgIGNvbnN0IHZhbGlkYXRlcyA9ICh0aGlzLiRpbnB1dC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmFsaWRhdGUnKSB8fCAnJykuc3BsaXQoJ3wnKTtcblxuICAgIGNvbnN0IHJlc3VsdHM6IEFycmF5PGJvb2xlYW4gfCBzdHJpbmcgfCB1bmRlZmluZWQ+ID0gW107XG4gICAgY29uc3QgcHJvbWlzZXM6IFByb21pc2U8Ym9vbGVhbj5bXSA9IFtdO1xuXG4gICAgaWYgKHRoaXMuJGlucHV0LnZhbHVlICE9PSAnJyAmJiB2YWxpZGF0ZXMubGVuZ3RoKSB7XG4gICAgICBpZiAoIXRoaXMuY2hlY2tDdXN0b21EYXRhQXR0cmlidXRlVmFsaWRpdHkoKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGZvciAoY29uc3QgdmFsaWRhdG9yTmFtZSBvZiB2YWxpZGF0ZXMpIHtcbiAgICAgICAgbGV0IFt2YWxpZGF0b3IsIG9wdGlvbnNdID0gdGhpcy5nZXRWYWxpZGF0b3IodmFsaWRhdG9yTmFtZSkgfHwgW251bGwsIHt9XTtcblxuICAgICAgICBpZiAoIXZhbGlkYXRvcikge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHZhbGlkYXRvci5vcHRpb25zIHx8IHt9KTtcblxuICAgICAgICBwcm9taXNlcy5wdXNoKFxuICAgICAgICAgIFByb21pc2UucmVzb2x2ZSh2YWxpZGF0b3IuaGFuZGxlcih0aGlzLiRpbnB1dC52YWx1ZSwgdGhpcy4kaW5wdXQsIG9wdGlvbnMsIHRoaXMpKVxuICAgICAgICAgICAgLnRoZW4oKHIpID0+IHtcbiAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMuaGFuZGxlQXN5bmNDdXN0b21SZXN1bHQociwgdmFsaWRhdG9yKSk7XG5cbiAgICAgICAgICAgICAgcmV0dXJuIHI7XG4gICAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcblxuICAgIGZvciAoY29uc3QgcmVzdWx0IG9mIHJlc3VsdHMpIHtcbiAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGNoZWNrQ3VzdG9tRGF0YUF0dHJpYnV0ZVZhbGlkaXR5KCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGVycm9yID0gdGhpcy4kaW5wdXQ/LmRhdGFzZXQudmFsaWRhdGlvbkZhaWw7XG5cbiAgICByZXR1cm4gdGhpcy5oYW5kbGVDdXN0b21SZXN1bHQoZXJyb3IpO1xuICB9XG5cbiAgY2hlY2tJbnB1dE9wdGlvbnNWYWxpZGl0eSgpOiBib29sZWFuIHtcbiAgICBpZiAoIXRoaXMuJGlucHV0KSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBjb25zdCBpc1JlcXVpcmVkID0gdGhpcy4kaW5wdXQuZ2V0QXR0cmlidXRlKCdyZXF1aXJlZCcpICE9IG51bGw7XG4gICAgY29uc3Qgb3B0aW9uV3JhcHBlcnMgPSB0aGlzLiRpbnB1dC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMub3B0aW9ucy5pbnB1dE9wdGlvbnNTZWxlY3Rvcik7XG4gICAgbGV0IHJlc3VsdCA9IHRydWU7XG5cbiAgICBpZiAoaXNSZXF1aXJlZCkge1xuICAgICAgZm9yIChjb25zdCBvcHRpb25XcmFwcGVyIG9mIG9wdGlvbldyYXBwZXJzKSB7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gb3B0aW9uV3JhcHBlci5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpO1xuXG4gICAgICAgIHJlc3VsdCA9IGZhbHNlO1xuXG4gICAgICAgIC8vIE9ubHkgbmVlZCBvbmUgY2hlY2tlZFxuICAgICAgICBpZiAoaW5wdXQ/LmNoZWNrZWQpIHtcbiAgICAgICAgICByZXN1bHQgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gR2V0IGJyb3dzZXIgaW5wdXQgdmFsaWRhdGlvbiBtZXNzYWdlXG4gICAgY29uc3QgbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgbi5yZXF1aXJlZCA9IGlzUmVxdWlyZWQ7XG5cbiAgICBpZiAocmVzdWx0KSB7XG4gICAgICBuLnZhbHVlID0gJ3BsYWNlaG9sZGVyJztcbiAgICB9XG5cbiAgICBuLmNoZWNrVmFsaWRpdHkoKTtcblxuICAgICh0aGlzLiRpbnB1dCBhcyBhbnkpLnZhbGlkYXRpb25NZXNzYWdlID0gbi52YWxpZGF0aW9uTWVzc2FnZTtcbiAgICAodGhpcy4kaW5wdXQgYXMgYW55KS52YWxpZGl0eSA9IG4udmFsaWRpdHk7XG5cbiAgICBmb3IgKGNvbnN0IG9wdGlvbldyYXBwZXIgb2Ygb3B0aW9uV3JhcHBlcnMpIHtcbiAgICAgIGNvbnN0IGlucHV0ID0gb3B0aW9uV3JhcHBlci5xdWVyeVNlbGVjdG9yPEhUTUxJbnB1dEVsZW1lbnQ+KCdpbnB1dCcpO1xuXG4gICAgICBpbnB1dD8uc2V0Q3VzdG9tVmFsaWRpdHkobi52YWxpZGF0aW9uTWVzc2FnZSk7XG4gICAgfVxuXG4gICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgIHRoaXMuJGlucHV0LmRpc3BhdGNoRXZlbnQoXG4gICAgICAgIG5ldyBDdXN0b21FdmVudCgnaW52YWxpZCcpXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHZhbGlkIHtib29sZWFufVxuICAgKi9cbiAgdXBkYXRlVmFsaWRDbGFzcyh2YWxpZDogQm9vbGVhbikge1xuICAgIGNvbnN0ICRlcnJvckVsZW1lbnQgPSB0aGlzLmdldEVycm9yRWxlbWVudCgpO1xuICAgIGNvbnN0ICRpbnZhbGlkVGFyZ2V0ID0gJGVycm9yRWxlbWVudD8ucHJldmlvdXNFbGVtZW50U2libGluZztcblxuICAgIHRoaXMuJGlucHV0Py5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuaW52YWxpZENsYXNzKTtcbiAgICB0aGlzLiRpbnB1dD8uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLnZhbGlkQ2xhc3MpO1xuICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLmludmFsaWRDbGFzcyk7XG4gICAgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKHRoaXMudmFsaWRDbGFzcyk7XG4gICAgJGludmFsaWRUYXJnZXQ/LmNsYXNzTGlzdC5yZW1vdmUodGhpcy5pbnZhbGlkQ2xhc3MpO1xuICAgICRpbnZhbGlkVGFyZ2V0Py5jbGFzc0xpc3QucmVtb3ZlKHRoaXMudmFsaWRDbGFzcyk7XG5cbiAgICBpZiAodmFsaWQpIHtcbiAgICAgIHRoaXMuJGlucHV0Py5jbGFzc0xpc3QuYWRkKHRoaXMudmFsaWRDbGFzcyk7XG4gICAgICB0aGlzLmVsLmNsYXNzTGlzdC5hZGQodGhpcy52YWxpZENsYXNzKTtcblxuICAgICAgJGludmFsaWRUYXJnZXQ/LmNsYXNzTGlzdC5hZGQodGhpcy52YWxpZENsYXNzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy4kaW5wdXQ/LmNsYXNzTGlzdC5hZGQodGhpcy5pbnZhbGlkQ2xhc3MpO1xuICAgICAgdGhpcy5lbC5jbGFzc0xpc3QuYWRkKHRoaXMuaW52YWxpZENsYXNzKTtcblxuICAgICAgJGludmFsaWRUYXJnZXQ/LmNsYXNzTGlzdC5hZGQodGhpcy5pbnZhbGlkQ2xhc3MpO1xuICAgIH1cbiAgfVxuXG4gIGdldEZvcm1WYWxpZGF0aW9uKGVsZW1lbnQ/OiBOdWxsYWJsZTxIVE1MRm9ybUVsZW1lbnQ+KTogVW5pY29ybkZvcm1WYWxpZGF0aW9uIHwgbnVsbCB7XG4gICAgcmV0dXJuIGdldEJvdW5kZWRJbnN0YW5jZShlbGVtZW50IHx8IHRoaXMuZ2V0Rm9ybSgpLCAnZm9ybS52YWxpZGF0aW9uJykhO1xuICB9XG5cbiAgZ2V0VmFsaWRhdG9yKG5hbWU6IHN0cmluZyk6IFtWYWxpZGF0b3IsIFJlY29yZDxzdHJpbmcsIGFueT5dIHwgbnVsbCB7XG4gICAgY29uc3QgbWF0Y2hlcyA9IG5hbWUubWF0Y2goLyg/PHR5cGU+W1xcd1xcLV9dKykoXFwoKD88cGFyYW1zPi4qKVxcKSkqLyk7XG5cbiAgICBpZiAoIW1hdGNoZXMpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHZhbGlkYXRvck5hbWUgPSBtYXRjaGVzLmdyb3Vwcz8udHlwZSB8fCAnJztcblxuICAgIGNvbnN0IHBhcmFtcyA9IG1hdGNoZXMuZ3JvdXBzPy5wYXJhbXMgfHwgJyc7XG5cbiAgICBjb25zdCBmdiA9IHRoaXMuZ2V0Rm9ybVZhbGlkYXRpb24odGhpcy4kZm9ybSEpO1xuICAgIGNvbnN0IHZhbGlkYXRvciA9IGZ2Py52YWxpZGF0b3JzW3ZhbGlkYXRvck5hbWVdIHx8IFVuaWNvcm5Gb3JtVmFsaWRhdGlvbi5nbG9iYWxWYWxpZGF0b3JzW3ZhbGlkYXRvck5hbWVdO1xuXG4gICAgaWYgKCF2YWxpZGF0b3IpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHBhcmFtTWF0Y2hlcyA9IHBhcmFtcy5tYXRjaEFsbCgvKD88a2V5PlxcdyspKFxccz9bPTpdXFxzPyg/PHZhbHVlPlxcdyspKT8vZyk7XG4gICAgY29uc3Qgb3B0aW9uczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuXG4gICAgZm9yIChjb25zdCBwYXJhbU1hdGNoIG9mIHBhcmFtTWF0Y2hlcykge1xuICAgICAgY29uc3QgbWF0Y2ggPSBwYXJhbU1hdGNoPy5ncm91cHMgYXMge1xuICAgICAgICBrZXk6IHN0cmluZztcbiAgICAgICAgdmFsdWU6IHN0cmluZztcbiAgICAgIH0gfCB1bmRlZmluZWQ7XG5cbiAgICAgIGlmICghbWF0Y2gpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIG9wdGlvbnNbbWF0Y2gua2V5XSA9IGhhbmRsZVBhcmFtVmFsdWUobWF0Y2gudmFsdWUpO1xuICAgIH1cblxuICAgIHJldHVybiBbIHZhbGlkYXRvciwgb3B0aW9ucyBdO1xuICB9XG5cbiAgaGFuZGxlQ3VzdG9tUmVzdWx0KHJlc3VsdDogYm9vbGVhbiB8IHN0cmluZyB8IHVuZGVmaW5lZCwgdmFsaWRhdG9yPzogTnVsbGFibGU8VmFsaWRhdG9yPik6IGJvb2xlYW4ge1xuICAgIGlmICh0eXBlb2YgcmVzdWx0ID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy4kaW5wdXQ/LnNldEN1c3RvbVZhbGlkaXR5KHJlc3VsdCk7XG4gICAgICByZXN1bHQgPSByZXN1bHQgPT09ICcnO1xuICAgIH0gZWxzZSBpZiAocmVzdWx0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJlc3VsdCA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHJlc3VsdCkge1xuICAgICAgdGhpcy4kaW5wdXQ/LnNldEN1c3RvbVZhbGlkaXR5KCcnKTtcbiAgICB9IGVsc2UgaWYgKHZhbGlkYXRvcikge1xuICAgICAgdGhpcy5yYWlzZUN1c3RvbUVycm9yU3RhdGUodmFsaWRhdG9yKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgaGFuZGxlQXN5bmNDdXN0b21SZXN1bHQocmVzdWx0OiBib29sZWFuLCB2YWxpZGF0b3I/OiBOdWxsYWJsZTxWYWxpZGF0b3I+KTogYm9vbGVhbiB7XG4gICAgcmVzdWx0ID0gdGhpcy5oYW5kbGVDdXN0b21SZXN1bHQocmVzdWx0LCB2YWxpZGF0b3IpO1xuXG4gICAgLy8gRmlyZSBpbnZhbGlkIGV2ZW50c1xuICAgIHRoaXMuJGlucHV0Py5jaGVja1ZhbGlkaXR5KCk7XG5cbiAgICB0aGlzLnVwZGF0ZVZhbGlkQ2xhc3MocmVzdWx0KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICByYWlzZUN1c3RvbUVycm9yU3RhdGUodmFsaWRhdG9yOiBWYWxpZGF0b3IpOiB2b2lkIHtcbiAgICBsZXQgaGVscDtcblxuICAgIGlmICh0aGlzLiRpbnB1dD8udmFsaWRhdGlvbk1lc3NhZ2UgPT09ICcnKSB7XG4gICAgICBoZWxwID0gdmFsaWRhdG9yLm9wdGlvbnM/Lm5vdGljZTtcblxuICAgICAgaWYgKHR5cGVvZiBoZWxwID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGhlbHAgPSBoZWxwKHRoaXMuJGlucHV0LCB0aGlzKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGhlbHAgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLiRpbnB1dD8uc2V0Q3VzdG9tVmFsaWRpdHkoaGVscCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuJGlucHV0Py52YWxpZGF0aW9uTWVzc2FnZSA9PT0gJycpIHtcbiAgICAgIHRoaXMuJGlucHV0Py5zZXRDdXN0b21WYWxpZGl0eSh0cmFucygndW5pY29ybi5tZXNzYWdlLnZhbGlkYXRpb24uY3VzdG9tLmVycm9yJykpO1xuICAgIH1cblxuICAgIHRoaXMuJGlucHV0Py5kaXNwYXRjaEV2ZW50KFxuICAgICAgbmV3IEN1c3RvbUV2ZW50KCdpbnZhbGlkJylcbiAgICApO1xuICB9XG5cbiAgc2V0QXNJbnZhbGlkQW5kUmVwb3J0KGVycm9yOiBzdHJpbmcpIHtcbiAgICB0aGlzLnNldEN1c3RvbVZhbGlkaXR5KGVycm9yKTtcbiAgICB0aGlzLnNob3dJbnZhbGlkUmVzcG9uc2UoKTtcbiAgfVxuXG4gIHNldEN1c3RvbVZhbGlkaXR5KGVycm9yOiBzdHJpbmcpIHtcbiAgICB0aGlzLiRpbnB1dD8uc2V0Q3VzdG9tVmFsaWRpdHkoZXJyb3IpO1xuICB9XG5cbiAgcmVwb3J0VmFsaWRpdHkoKSB7XG4gICAgaWYgKHRoaXMudmFsaWRhdGlvbk1lc3NhZ2UgIT09ICcnKSB7XG4gICAgICB0aGlzLnNob3dJbnZhbGlkUmVzcG9uc2UoKTtcbiAgICB9XG4gIH1cblxuICBzaG93SW52YWxpZFJlc3BvbnNlKCkge1xuICAgIC8qKiBAdHlwZSBWYWxpZGl0eVN0YXRlICovXG4gICAgY29uc3Qgc3RhdGUgPSB0aGlzLiRpbnB1dD8udmFsaWRpdHk7XG4gICAgbGV0IG1lc3NhZ2U6IHN0cmluZyA9IHRoaXMuJGlucHV0Py52YWxpZGF0aW9uTWVzc2FnZSB8fCAnJztcblxuICAgIGZvciAobGV0IGtleSBpbiBzdGF0ZSkge1xuICAgICAgaWYgKHN0YXRlWyhrZXkgYXMga2V5b2YgVmFsaWRpdHlTdGF0ZSldICYmIHRoaXMuJGlucHV0Py5kYXRhc2V0W2tleSArICdNZXNzYWdlJ10pIHtcbiAgICAgICAgbWVzc2FnZSA9IHRoaXMuJGlucHV0Py5kYXRhc2V0W2tleSArICdNZXNzYWdlJ10gfHwgJyc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghdGhpcy5pc1Zpc2libGUpIHtcbiAgICAgIGxldCB0aXRsZSA9IHRoaXMuZmluZExhYmVsKCk/LnRleHRDb250ZW50O1xuXG4gICAgICBpZiAoIXRpdGxlKSB7XG4gICAgICAgIHRpdGxlID0gdGhpcy4kaW5wdXQ/Lm5hbWUgfHwgJyc7XG4gICAgICB9XG5cbiAgICAgIHVzZVVJVGhlbWUoKS5yZW5kZXJNZXNzYWdlKFxuICAgICAgICBgRmllbGQ6ICR7dGl0bGV9IC0gJHttZXNzYWdlfWAsXG4gICAgICAgICd3YXJuaW5nJ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICBsZXQgJGhlbHAgPSB0aGlzLmdldEVycm9yRWxlbWVudCgpO1xuXG4gICAgaWYgKCEkaGVscCkge1xuICAgICAgJGhlbHAgPSB0aGlzLmNyZWF0ZUhlbHBFbGVtZW50KCkhO1xuICAgICAgdGhpcy5lbC5hcHBlbmRDaGlsZCgkaGVscCk7XG4gICAgICB0aGlzLnByZXBhcmVXcmFwcGVyKCk7XG4gICAgfVxuXG4gICAgJGhlbHAudGV4dENvbnRlbnQgPSBtZXNzYWdlO1xuXG4gICAgdGhpcy51cGRhdGVWYWxpZENsYXNzKGZhbHNlKTtcbiAgfVxuXG4gIGdldEVycm9yRWxlbWVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5lbC5xdWVyeVNlbGVjdG9yKHRoaXMuZXJyb3JTZWxlY3Rvcik7XG4gIH1cblxuICBjcmVhdGVIZWxwRWxlbWVudCgpIHtcbiAgICBjb25zdCBjbGFzc05hbWUgPSB0aGlzLm9wdGlvbnMuZXJyb3JNZXNzYWdlQ2xhc3M7XG4gICAgY29uc3QgcGFyc2VkID0gdGhpcy5wYXJzZVNlbGVjdG9yKHRoaXMuZXJyb3JTZWxlY3RvciB8fCAnJyk7XG5cbiAgICBjb25zdCAkaGVscCA9IGh0bWwoYDxkaXYgY2xhc3M9XCIke2NsYXNzTmFtZX1cIj48L2Rpdj5gKSE7XG5cbiAgICAkaGVscC5jbGFzc0xpc3QuYWRkKC4uLnBhcnNlZC5jbGFzc2VzKTtcblxuICAgIHBhcnNlZC5hdHRycy5mb3JFYWNoKChhdHRyKSA9PiB7XG4gICAgICAkaGVscC5zZXRBdHRyaWJ1dGUoYXR0clswXSwgYXR0clsxXSB8fCAnJyk7XG4gICAgfSk7XG5cbiAgICBwYXJzZWQuaWRzLmZvckVhY2goKGlkKSA9PiB7XG4gICAgICAkaGVscC5pZCA9IGlkO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuICRoZWxwO1xuICB9XG5cbiAgLyoqXG4gICAqIEBzZWUgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzE3ODg4MTc4XG4gICAqL1xuICBwYXJzZVNlbGVjdG9yKHN1YnNlbGVjdG9yOiBzdHJpbmcpOiB7IHRhZ3M6IHN0cmluZ1tdOyBjbGFzc2VzOiBzdHJpbmdbXTsgaWRzOiBzdHJpbmdbXTsgYXR0cnM6IHN0cmluZ1tdW10gfSB7XG4gICAgY29uc3Qgb2JqOiB7XG4gICAgICB0YWdzOiBzdHJpbmdbXTtcbiAgICAgIGNsYXNzZXM6IHN0cmluZ1tdO1xuICAgICAgaWRzOiBzdHJpbmdbXTtcbiAgICAgIGF0dHJzOiBzdHJpbmdbXVtdO1xuICAgIH0gPSB7IHRhZ3M6IFtdLCBjbGFzc2VzOiBbXSwgaWRzOiBbXSwgYXR0cnM6IFtdIH07XG4gICAgZm9yIChjb25zdCB0b2tlbiBvZiBzdWJzZWxlY3Rvci5zcGxpdCgvKD89XFwuKXwoPz0jKXwoPz1cXFspLykpIHtcbiAgICAgIHN3aXRjaCAodG9rZW5bMF0pIHtcbiAgICAgICAgY2FzZSAnIyc6XG4gICAgICAgICAgb2JqLmlkcy5wdXNoKHRva2VuLnNsaWNlKDEpKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnLic6XG4gICAgICAgICAgb2JqLmNsYXNzZXMucHVzaCh0b2tlbi5zbGljZSgxKSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ1snOlxuICAgICAgICAgIG9iai5hdHRycy5wdXNoKHRva2VuLnNsaWNlKDEsIC0xKS5zcGxpdCgnPScpKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdCA6XG4gICAgICAgICAgb2JqLnRhZ3MucHVzaCh0b2tlbik7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICBzZXRBc1ZhbGlkQW5kQ2xlYXJSZXNwb25zZSgpIHtcbiAgICB0aGlzLnNldEN1c3RvbVZhbGlkaXR5KCcnKTtcbiAgICB0aGlzLnVwZGF0ZVZhbGlkQ2xhc3ModHJ1ZSk7XG4gICAgdGhpcy5jbGVhckludmFsaWRSZXNwb25zZSgpO1xuICB9XG5cbiAgY2xlYXJJbnZhbGlkUmVzcG9uc2UoKSB7XG4gICAgY29uc3QgJGhlbHAgPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IodGhpcy5lcnJvclNlbGVjdG9yKSE7XG5cbiAgICAkaGVscC50ZXh0Q29udGVudCA9ICcnO1xuICB9XG5cbiAgZ2V0Rm9ybSgpIHtcbiAgICByZXR1cm4gdGhpcy5lbC5jbG9zZXN0KHRoaXMub3B0aW9ucy5mb3JtU2VsZWN0b3IgfHwgJ1t1bmktZm9ybS12YWxpZGF0ZV0nKSBhcyBIVE1MRm9ybUVsZW1lbnQ7XG4gIH1cblxuICBmaW5kTGFiZWwoKSB7XG4gICAgY29uc3QgaWQgPSB0aGlzLiRpbnB1dD8uaWQgfHwgJyc7XG5cbiAgICBjb25zdCB3cmFwcGVyID0gdGhpcy4kaW5wdXQ/LmNsb3Nlc3QoJ1tkYXRhLWZpZWxkLXdyYXBwZXJdJyk7XG4gICAgbGV0IGxhYmVsID0gbnVsbDtcblxuICAgIGlmICh3cmFwcGVyKSB7XG4gICAgICBsYWJlbCA9IHdyYXBwZXIucXVlcnlTZWxlY3RvcignW2RhdGEtZmllbGQtbGFiZWxdJyk7XG4gICAgfVxuXG4gICAgaWYgKCFsYWJlbCkge1xuICAgICAgbGFiZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBsYWJlbFtmb3I9XCIke2lkfVwiXWApO1xuICAgIH1cblxuICAgIHJldHVybiBsYWJlbDtcbiAgfVxufVxuXG5mdW5jdGlvbiBjYW1lbFRvKHN0cjogc3RyaW5nLCBzZXA6IHN0cmluZykge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoLyhbYS16XSkoW0EtWl0pL2csIGAkMSR7c2VwfSQyYCkudG9Mb3dlckNhc2UoKTtcbn1cblxudmFsaWRhdG9ySGFuZGxlcnMudXNlcm5hbWUgPSBmdW5jdGlvbiAodmFsdWU6IGFueSwgZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKCdbXFw8fFxcPnxcInxcXCd8XFwlfFxcO3xcXCh8XFwpfFxcJl0nLCAnaScpO1xuICByZXR1cm4gIXJlZ2V4LnRlc3QodmFsdWUpO1xufTtcblxudmFsaWRhdG9ySGFuZGxlcnMubnVtZXJpYyA9IGZ1bmN0aW9uICh2YWx1ZTogYW55LCBlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICBjb25zdCByZWdleCA9IC9eKFxcZHwtKT8oXFxkfCwpKlxcLj9cXGQqJC87XG4gIHJldHVybiByZWdleC50ZXN0KHZhbHVlKTtcbn07XG5cbnZhbGlkYXRvckhhbmRsZXJzLmVtYWlsID0gZnVuY3Rpb24gKHZhbHVlOiBhbnksIGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gIHZhbHVlID0gcHVueWNvZGUudG9BU0NJSSh2YWx1ZSk7XG4gIGNvbnN0IHJlZ2V4ID0gL15bYS16QS1aMC05LiEjJCUmw6LigqzihKIqK1xcLz0/Xl9ge3x9fi1dK0BbYS16QS1aMC05LV0rKD86XFwuW2EtekEtWjAtOS1dKykqJC87XG4gIHJldHVybiByZWdleC50ZXN0KHZhbHVlKTtcbn07XG5cbnZhbGlkYXRvckhhbmRsZXJzLnVybCA9IGZ1bmN0aW9uICh2YWx1ZTogYW55LCBlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICBjb25zdCByZWdleCA9IC9eKD86KD86aHR0cHM/fGZ0cCk6XFwvXFwvKSg/OlxcUysoPzo6XFxTKik/QCk/KD86KD8hMTAoPzpcXC5cXGR7MSwzfSl7M30pKD8hMTI3KD86XFwuXFxkezEsM30pezN9KSg/ITE2OVxcLjI1NCg/OlxcLlxcZHsxLDN9KXsyfSkoPyExOTJcXC4xNjgoPzpcXC5cXGR7MSwzfSl7Mn0pKD8hMTcyXFwuKD86MVs2LTldfDJcXGR8M1swLTFdKSg/OlxcLlxcZHsxLDN9KXsyfSkoPzpbMS05XVxcZD98MVxcZFxcZHwyWzAxXVxcZHwyMlswLTNdKSg/OlxcLig/OjE/XFxkezEsMn18MlswLTRdXFxkfDI1WzAtNV0pKXsyfSg/OlxcLig/OlsxLTldXFxkP3wxXFxkXFxkfDJbMC00XVxcZHwyNVswLTRdKSl8KD86KD86W2EtelxcdTAwYTEtXFx1ZmZmZjAtOV0rLT8pKlthLXpcXHUwMGExLVxcdWZmZmYwLTldKykoPzpcXC4oPzpbYS16XFx1MDBhMS1cXHVmZmZmMC05XSstPykqW2EtelxcdTAwYTEtXFx1ZmZmZjAtOV0rKSooPzpcXC4oPzpbYS16XFx1MDBhMS1cXHVmZmZmXXsyLH0pKSkoPzo6XFxkezIsNX0pPyg/OlxcL1teXFxzXSopPyQvaTtcbiAgcmV0dXJuIHJlZ2V4LnRlc3QodmFsdWUpO1xufTtcblxudmFsaWRhdG9ySGFuZGxlcnMuYWxudW0gPSBmdW5jdGlvbiAodmFsdWU6IGFueSwgZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgY29uc3QgcmVnZXggPSAvXlthLXpBLVowLTldKiQvO1xuICByZXR1cm4gcmVnZXgudGVzdCh2YWx1ZSk7XG59O1xuXG52YWxpZGF0b3JIYW5kbGVycy5jb2xvciA9IGZ1bmN0aW9uICh2YWx1ZTogYW55LCBlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICBjb25zdCByZWdleCA9IC9eIyg/OlswLTlhLWZdezN9KXsxLDJ9JC87XG4gIHJldHVybiByZWdleC50ZXN0KHZhbHVlKTtcbn07XG5cbi8qKlxuICogQHNlZSAgaHR0cDovL3d3dy52aXJ0dW9zaW1lZGlhLmNvbS9kZXYvcGhwLzM3LXRlc3RlZC1waHAtcGVybC1hbmQtamF2YXNjcmlwdC1yZWd1bGFyLWV4cHJlc3Npb25zXG4gKi9cbnZhbGlkYXRvckhhbmRsZXJzLmNyZWRpdGNhcmQgPSBmdW5jdGlvbiAodmFsdWU6IGFueSwgZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgY29uc3QgcmVnZXggPSAvXig/OjRbMC05XXsxMn0oPzpbMC05XXszfSk/fDVbMS01XVswLTldezE0fXw2MDExWzAtOV17MTJ9fDYyMigoMTJbNi05XXwxWzMtOV1bMC05XSl8KFsyLThdWzAtOV1bMC05XSl8KDkoKFswLTFdWzAtOV0pfCgyWzAtNV0pKSkpWzAtOV17MTB9fDY0WzQtOV1bMC05XXsxM318NjVbMC05XXsxNH18Myg/OjBbMC01XXxbNjhdWzAtOV0pWzAtOV17MTF9fDNbNDddWzAtOV17MTN9KSokLztcbiAgcmV0dXJuIHJlZ2V4LnRlc3QodmFsdWUpO1xufTtcblxudmFsaWRhdG9ySGFuZGxlcnMuaXAgPSBmdW5jdGlvbiAodmFsdWU6IGFueSwgZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgY29uc3QgcmVnZXggPSAvXigoPzooPzoyNVswLTVdfDJbMC00XVswLTldfFswMV0/WzAtOV1bMC05XT8pXFwuKXszfSg/OjI1WzAtNV18MlswLTRdWzAtOV18WzAxXT9bMC05XVswLTldPykpKiQvO1xuICByZXR1cm4gcmVnZXgudGVzdCh2YWx1ZSk7XG59O1xuXG52YWxpZGF0b3JIYW5kbGVyc1sncGFzc3dvcmQtY29uZmlybSddID0gZnVuY3Rpb24gKHZhbHVlOiBhbnksIGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gIGNvbnN0IHNlbGVjdG9yID0gZWxlbWVudC5kYXRhc2V0LmNvbmZpcm1UYXJnZXQ7XG5cbiAgaWYgKCFzZWxlY3Rvcikge1xuICAgIHRocm93IG5ldyBFcnJvcignVmFsaWRhdG9yOiBcInBhc3N3b3JkLWNvbmZpcm1cIiBtdXN0IGFkZCBcImRhdGEtY29uZmlybS10YXJnZXRcIiBhdHRyaWJ1dGUuJyk7XG4gIH1cblxuICBjb25zdCB0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxJbnB1dEVsZW1lbnQ+KHNlbGVjdG9yKTtcblxuICByZXR1cm4gdGFyZ2V0Py52YWx1ZSA9PT0gdmFsdWU7XG59O1xuXG5leHBvcnQgeyB2YWxpZGF0b3JIYW5kbGVycyBhcyB2YWxpZGF0b3JzIH07XG5cbi8vIGN1c3RvbUVsZW1lbnRzLmRlZmluZShVbmljb3JuRm9ybVZhbGlkYXRlRWxlbWVudC5pcywgVW5pY29ybkZvcm1WYWxpZGF0ZUVsZW1lbnQpO1xuLy8gY3VzdG9tRWxlbWVudHMuZGVmaW5lKFVuaWNvcm5GaWVsZFZhbGlkYXRlRWxlbWVudC5pcywgVW5pY29ybkZpZWxkVmFsaWRhdGVFbGVtZW50KTtcblxuZXhwb3J0IGNvbnN0IHJlYWR5ID0gUHJvbWlzZS5hbGwoW1xuICB1c2VVbmlEaXJlY3RpdmUoJ2Zvcm0tdmFsaWRhdGUnLCB7XG4gICAgbW91bnRlZChlbCwgYmluZGluZykge1xuICAgICAgZ2V0Qm91bmRlZEluc3RhbmNlKGVsLCAnZm9ybS52YWxpZGF0aW9uJywgKGVsZSkgPT4ge1xuICAgICAgICByZXR1cm4gbmV3IFVuaWNvcm5Gb3JtVmFsaWRhdGlvbihlbGUgYXMgSFRNTEVsZW1lbnQsIEpTT04ucGFyc2UoYmluZGluZy52YWx1ZSB8fCAne30nKSk7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIHVwZGF0ZWQoZWwsIGJpbmRpbmcpIHtcbiAgICAgIGNvbnN0IGluc3RhbmNlID0gZ2V0Qm91bmRlZEluc3RhbmNlPFVuaWNvcm5Gb3JtVmFsaWRhdGlvbj4oZWwsICdmb3JtLnZhbGlkYXRpb24nKTtcbiAgICAgIGluc3RhbmNlLm1lcmdlT3B0aW9ucyhKU09OLnBhcnNlKGJpbmRpbmcudmFsdWUgfHwgJ3t9JykpO1xuICAgIH1cbiAgfSksXG5cbiAgdXNlVW5pRGlyZWN0aXZlKCdmaWVsZC12YWxpZGF0ZScsIHtcbiAgICBtb3VudGVkKGVsLCBiaW5kaW5nKSB7XG4gICAgICBnZXRCb3VuZGVkSW5zdGFuY2U8VW5pY29ybkZpZWxkVmFsaWRhdGlvbj4oZWwsICdmaWVsZC52YWxpZGF0aW9uJywgKGVsZSkgPT4ge1xuICAgICAgICByZXR1cm4gbmV3IFVuaWNvcm5GaWVsZFZhbGlkYXRpb24oZWxlIGFzIEhUTUxFbGVtZW50LCBKU09OLnBhcnNlKGJpbmRpbmcudmFsdWUgfHwgJ3t9JykpO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIHVwZGF0ZWQoZWwsIGJpbmRpbmcpIHtcbiAgICAgIGNvbnN0IGluc3RhbmNlID0gZ2V0Qm91bmRlZEluc3RhbmNlPFVuaWNvcm5GaWVsZFZhbGlkYXRpb24+KGVsLCAnZmllbGQudmFsaWRhdGlvbicpO1xuICAgICAgaW5zdGFuY2UubWVyZ2VPcHRpb25zKEpTT04ucGFyc2UoYmluZGluZy52YWx1ZSB8fCAne30nKSB8fCB7fSk7XG4gICAgfVxuICB9KVxuXSk7XG5cbmZ1bmN0aW9uIGhhbmRsZVBhcmFtVmFsdWUodmFsdWU6IGFueSkge1xuICBpZiAoIWlzTmFOKE51bWJlcih2YWx1ZSkpKSB7XG4gICAgcmV0dXJuIE51bWJlcih2YWx1ZSk7XG4gIH1cblxuICBpZiAodmFsdWUgPT09ICdudWxsJykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKHZhbHVlID09PSAndHJ1ZScpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmICh2YWx1ZSA9PT0gJ2ZhbHNlJykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFZhbGlkYXRpb25Nb2R1bGUge1xuICBVbmljb3JuRm9ybVZhbGlkYXRpb246IHR5cGVvZiBVbmljb3JuRm9ybVZhbGlkYXRpb247XG4gIFVuaWNvcm5GaWVsZFZhbGlkYXRpb246IHR5cGVvZiBVbmljb3JuRmllbGRWYWxpZGF0aW9uO1xuICByZWFkeTogUHJvbWlzZTxhbnk+O1xuICB2YWxpZGF0b3JzOiB0eXBlb2YgdmFsaWRhdG9ySGFuZGxlcnM7XG59XG4iXSwibmFtZXMiOlsicmVzdWx0IiwiZXJyb3IiLCJwdW55Y29kZS50b0FTQ0lJIl0sIm1hcHBpbmdzIjoiO0FBR0EsTUFBTSxTQUFTO0FBR2YsTUFBTSxPQUFPO0FBQ2IsTUFBTSxPQUFPO0FBQ2IsTUFBTSxPQUFPO0FBQ2IsTUFBTSxPQUFPO0FBQ2IsTUFBTSxPQUFPO0FBQ2IsTUFBTSxjQUFjO0FBQ3BCLE1BQU0sV0FBVztBQUNqQixNQUFNLFlBQVk7QUFJbEIsTUFBTSxnQkFBZ0I7QUFDdEIsTUFBTSxrQkFBa0I7QUFHeEIsTUFBTSxTQUFTO0FBQUEsRUFDZCxZQUFZO0FBQUEsRUFDWixhQUFhO0FBQUEsRUFDYixpQkFBaUI7QUFDbEI7QUFHQSxNQUFNLGdCQUFnQixPQUFPO0FBQzdCLE1BQU0sUUFBSyx1QkFBRyxLQUFLLE9BQUE7QUFDbkIsTUFBTSw0Q0FBcUIsT0FBTyxjQUFBO0FBVWxDLFNBQVMsTUFBTSxNQUFNO0FBQ3BCLFFBQU0sSUFBSSxXQUFXLE9BQU8sSUFBSSxDQUFDO0FBQ2xDO0FBVUEsU0FBUyxJQUFJLE9BQU8sVUFBVTtBQUM3QixRQUFNLFNBQVMsQ0FBQTtBQUNmLE1BQUksU0FBUyxNQUFNO0FBQ25CLFNBQU8sVUFBVTtBQUNoQixXQUFPLE1BQU0sSUFBSSxTQUFTLE1BQU0sTUFBTSxDQUFDO0FBQUEsRUFDeEM7QUFDQSxTQUFPO0FBQ1I7QUFZQSxTQUFTLFVBQVUsUUFBUSxVQUFVO0FBQ3BDLFFBQU0sUUFBUSxPQUFPLE1BQU0sR0FBRztBQUM5QixNQUFJLFNBQVM7QUFDYixNQUFJLE1BQU0sU0FBUyxHQUFHO0FBR3JCLGFBQVMsTUFBTSxDQUFDLElBQUk7QUFDcEIsYUFBUyxNQUFNLENBQUM7QUFBQSxFQUNqQjtBQUVBLFdBQVMsT0FBTyxRQUFRLGlCQUFpQixHQUFNO0FBQy9DLFFBQU0sU0FBUyxPQUFPLE1BQU0sR0FBRztBQUMvQixRQUFNLFVBQVUsSUFBSSxRQUFRLFFBQVEsRUFBRSxLQUFLLEdBQUc7QUFDOUMsU0FBTyxT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
