/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

import { defaultsDeep } from 'lodash-es';

/**
 * Default validators
 *
 * @type {{ [name: string]: ValidationHandler }}
 */
const validators = {};

const defaultOptions = {
  scroll: false,
  scrollOffset: -100,
  enabled: true,
  fieldSelector: null,
  validatedClass: null,
};

const defaultFieldOptions = {
  formSelector: '[uni-form-validate]',
  errorSelector: '[data-field-error]',
  selector: 'input[data-field-input], select[data-field-input], textarea[data-field-input]',
  validClass: 'is-valid',
  invalidClass: 'is-invalid',
  events: ['change'],
  errorMessageClass: 'invalid-tooltip',
  inputOptions: false,
  inputOptionsWrapperSelector: 'div[data-field-input]',
  inputOptionsSelector: '[data-input-option]'
};

export class UnicornFormValidation {
  /**
   * @type {Element[]}
   */
  presetFields = [];

  /**
   * @type {{ [name: string]: Validator }}
   */
  static globalValidators = {};

  /**
   * @type {{ [name: string]: Validator }}
   */
  validators = {};
  $form;

  static is = 'uni-form-validate';

  constructor(el, options = {}) {
    this.$form = u.selectOne(el);
    this.setOptions(options);

    this.registerDefaultValidators();

    this.init();
  }

  setOptions(options) {
    this.options = defaultsDeep({}, options, defaultOptions);
  }

  get scrollEnabled() {
    return this.options.scroll === true;
  }

  get scrollOffset() {
    return Number(this.options.scrollOffset || -100);
  }

  get fieldSelector() {
    return this.options.fieldSelector || 'input, select, textarea';
  }

  get validatedClass() {
    return this.options.validatedClass || 'was-validated';
  }

  init() {
    if (this.$form.tagName === 'FORM') {
      this.$form.setAttribute('novalidate', true);
      this.$form.addEventListener('submit', (event) => {
        if (this.options.enabled && !this.validateAll()) {
          event.stopImmediatePropagation(); // Stop following events
          event.stopPropagation();
          event.preventDefault();

          return false;
        }

        return true;
      }, false);
    }

    this.prepareFields(this.findDOMFields());
    this.prepareFields(this.presetFields);
  }

  /**
   * @returns {Element[]}
   */
  findDOMFields() {
    return u.selectAll(this.$form.querySelectorAll(this.fieldSelector));
  }

  /**
   * @param {Element[]} inputs
   * @returns {Promise<void>}
   */
  prepareFields(inputs) {
    inputs.forEach((input) => {
      this.prepareFieldWrapper(input);
    });

    // Wait next tick
    return Promise.resolve();
  }

  /**
   * @param {Element} input
   * @returns {Element}
   */
  prepareFieldWrapper(input) {
    if (['INPUT', 'SELECT', 'TEXTAREA'].indexOf(input.tagName) !== -1) {
      let wrapper = input.closest('[uni-field-validate]');

      if (!wrapper) {
        wrapper = input.closest('[data-input-container]') || input.parentNode;

        wrapper.setAttribute('uni-field-validate', '{}');
      }

      return wrapper;
    }

    return input;
  }

  /**
   * @param {boolean} containsPresets
   * @returns {Element[]}
   */
  findFields(containsPresets = true) {
    let inputs = this.findDOMFields();

    if (containsPresets) {
      inputs.push(...this.presetFields);
    }

    inputs = inputs.map((input) => {
      return this.prepareFieldWrapper(input);
    });

    return inputs.filter(input => input != null);
  }

  /**
   * @param input {Element}
   * @returns {UnicornFieldValidation|null}
   */
  getFieldComponent(input) {
    return u.getBoundedInstance(input, 'field.validation');
  }

  /**
   * @param {Element[]} fields
   * @returns {boolean}
   */
  validateAll(fields = null) {
    this.markFormAsUnvalidated();

    fields = fields || this.findFields();
    let firstFail = null;

    fields.forEach((field) => {
      const fv = this.getFieldComponent(field);

      if (!fv) {
        return;
      }

      const result = fv.checkValidity();

      if (!result && !firstFail) {
        firstFail = field;
      }
    });

    this.markFormAsValidated();

    if (firstFail && this.scrollEnabled) {
      this.scrollTo(firstFail);
    }

    return firstFail === null;
  }

  /**
   * @param {Element[]} fields
   * @returns {boolean}
   */
  async validateAllAsync(fields = null) {
    this.markFormAsUnvalidated();

    fields = fields || this.findFields();
    let firstFail = null;
    const promises = [];

    fields.forEach((field) => {
      const fv = this.getFieldComponent(field);

      if (!fv) {
        return;
      }

      promises.push(
        fv.checkValidityAsync().then((result) => {
          if (!result && !firstFail) {
            firstFail = field;
          }
        })
      );
    });

    await Promise.all(promises);

    this.markFormAsValidated();

    if (firstFail && this.scrollEnabled) {
      this.scrollTo(firstFail);
    }

    return firstFail === null;
  }

  /**
   * @param {Element} element
   */
  scrollTo(element) {
    const offset = this.scrollOffset;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset + offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
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

  /**
   * @param {Element} field
   * @returns {this}
   */
  addField(field) {
    this.presetFields.push(field);

    this.prepareFieldWrapper(field);

    return this;
  }

  registerDefaultValidators() {
    for (let name in validators) {
      this.addValidator(name, validators[name]);
    }
  }

  /**
   * Add validator handler.
   *
   * @param {string} name
   * @param {ValidationHandler} validator
   * @param {ValidationOptions} options
   * @returns {this}
   */
  addValidator(name, validator, options = {}) {
    options = options || {};

    this.validators[name] = {
      handler: validator,
      options: options
    };

    return this;
  }

  /**
   * Add validator handler.
   *
   * @param {string} name
   * @param {ValidationHandler} validator
   * @param {ValidationOptions} options
   * @returns {this}
   */
  static addGlobalValidator(name, validator, options = {}) {
    options = options || {};

    this.globalValidators[name] = {
      handler: validator,
      options: options
    };

    return this;
  }
}

export class UnicornFieldValidation {
  $input;

  static is = 'uni-field-validate';

  constructor(el, options = {}) {
    this.el = el;
    this.options = defaultsDeep({}, options, defaultFieldOptions);

    this.init();
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

  selectInput() {
    let selector = this.selector;

    if (this.options.inputOptions) {
      selector += ', ' + this.options.inputOptionsWrapperSelector;
    }

    let input = this.el.querySelector(selector);

    if (!input) {
      input = this.el.querySelector('input, select, textarea');
    }

    return this.$input = input;
  }

  init() {
    this.selectInput();

    this.bindEvents();

    this.prepareWrapper();

    if (this.isInputOptions) {
      this.$input.validationMessage = '';
      this.$input.setCustomValidity = (msg) => {
        this.$input.validationMessage = String(msg);
      };
      this.$input.checkValidity = () => {
        return this.checkInputOptionsValidity();
      };
    }
  }

  bindEvents() {
    if (!this.$input) {
      return;
    }

    this.$input.addEventListener('invalid', (e) => {
      this.showInvalidResponse();
    });

    const events = this.options.events;

    events.forEach((eventName) => {
      this.$input.addEventListener(eventName, () => {
        this.checkValidity();
      });
    });
  }

  prepareWrapper() {
    if (this.el.querySelector(this.errorSelector)?.classList?.contains('invalid-tooltip')) {
      if (window.getComputedStyle(this.el).position === 'static') {
        this.el.style.position = 'relative';
      }
    }
  }

  checkValidity() {
    if (!this.$input) {
      return true;
    }

    if (this.$input.hasAttribute('readonly')) {
      return true;
    }

    this.$input.setCustomValidity('');
    let valid = this.$input.checkValidity();

    if (valid && this.$form) {
      valid = this.runCustomValidity();
    }

    // Raise invalid event
    this.$input.checkValidity();

    this.updateValidClass(valid);

    return valid;
  }

  runCustomValidity() {
    // Check custom validity
    const validates = (this.$input.getAttribute('data-validate') || '').split('|');
    let result = true;

    if (this.$input.value !== '' && validates.length) {
      if (!this.checkCustomDataAttributeValidity()) {
        return false;
      }

      for (const validatorName of validates) {
        const [ validator, options ] = this.getValidator(validatorName) || [ null, {} ];

        if (!validator) {
          continue;
        }

        Object.assign(options, validator.options);

        let r = validator.handler(this.$input.value, this.$input, options, this);

        // If return is a promise, push to stack and resolve later
        if (r instanceof Promise || (typeof r === 'object' && r.then)) {
          r.then((result) => {
            this.handleAsyncCustomResult(result, validator);
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

    if (this.$input.hasAttribute('readonly')) {
      return true;
    }

    this.$input.setCustomValidity('');
    let valid = this.$input.checkValidity();

    if (valid && this.$form) {
      valid = await this.runCustomValidityAsync();
    }

    this.updateValidClass(valid);

    return valid;
  }

  async runCustomValidityAsync() {
    // Check custom validity
    const validates = (this.$input.getAttribute('data-validate') || '').split('|');
    /** @type Array<boolean|string|undefined> */
    const results = [];

    /** @type Promise<boolean>[] */
    const promises = [];

    if (this.$input.value !== '' && validates.length) {
      if (!this.checkCustomDataAttributeValidity()) {
        return false;
      }

      for (const validatorName of validates) {
        const [ validator, options ] = this.getValidator(validatorName) || [ null, {} ];

        if (!validator) {
          continue;
        }

        Object.assign(options, validator.options);

        promises.push(
          Promise.resolve(validator.handler(this.$input.value, this.$input, options, this))
            .then((r) => {
              results.push(this.handleAsyncCustomResult(r, validator));
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
    const error = this.$input.dataset.validationFail;

    return this.handleCustomResult(error);
  }

  checkInputOptionsValidity() {
    const optionWrappers = this.$input.querySelectorAll(this.options.inputOptionsSelector);
    let result = true;

    for (const optionWrapper of optionWrappers) {
      const input = optionWrapper.querySelector('input');
      result = result && input.checked;

      // Only need one checked
      if (result) {
        break;
      }
    }

    // Get browser input validation message
    const n = document.createElement('input');
    n.required = true;

    if (result) {
      n.value = 'placeholder';
    }

    n.checkValidity();

    this.$input.validationMessage = n.validationMessage;
    this.$input.validity = n.validity;

    for (const optionWrapper of optionWrappers) {
      const input = optionWrapper.querySelector('input');

      input.setCustomValidity(n.validationMessage);
    }

    if (!result) {
      this.$input.dispatchEvent(
        new CustomEvent('invalid')
      );
    }

    return result;
  }

  /**
   * @param valid {boolean}
   */
  updateValidClass(valid) {
    this.$input.classList.remove(this.invalidClass);
    this.$input.classList.remove(this.validClass);
    this.el.classList.remove(this.invalidClass);
    this.el.classList.remove(this.validClass);

    if (valid) {
      this.$input.classList.add(this.validClass);
      this.el.classList.add(this.validClass);
    } else {
      this.$input.classList.add(this.invalidClass);
      this.el.classList.add(this.invalidClass);
    }
  }

  /**
   * @param {Element} element
   * @returns {UnicornFormValidation}
   */
  getFormValidation(element) {
    return u.getBoundedInstance(element, 'form.validation');
  }

  /**
   * @param name {string}
   * @returns {[Validator, object]|null}
   */
  getValidator(name) {
    const matches = name.match(/(?<type>\w+)(\((?<params>.*)\))*/);

    if (!matches) {
      return null;
    }

    const validatorName = matches.groups.type || '';
    const params = matches.groups.params || '';

    const fv = this.getFormValidation(this.$form);
    const validator = fv.validators[validatorName] || fv.constructor.globalValidators[validatorName];

    if (!validator) {
      return null;
    }

    const paramMatches = params.matchAll(/(?<key>\w+)(\s?[=:]\s?(?<value>\w+))?/g);
    const options = {};

    for (const paramMatch of paramMatches) {
      options[paramMatch.groups.key] = handleParamValue(paramMatch.groups.value);
    }

    return [ validator, options ];
  }

  /**
   * @param result {boolean|string|undefined}
   * @param validator {Validator|null}
   *
   * @return {boolean}
   */
  handleCustomResult(result, validator = null) {
    if (typeof result === 'string') {
      this.$input.setCustomValidity(result);
      result = result === '';
    } else if (result === undefined) {
      result = true;
    }

    if (result) {
      this.$input.setCustomValidity('');
    } else if (validator) {
      this.raiseCustomErrorState(validator);
    }

    return result;
  }

  /**
   * @param result {boolean}
   * @param validator {Validator|null}
   *
   * @return {boolean}
   */
  handleAsyncCustomResult(result, validator = null) {
    result = this.handleCustomResult(result, validator);

    // Fire invalid events
    this.$input.checkValidity();

    this.updateValidClass(result);

    return result;
  }

  /**
   * @param validator {Validator}
   */
  raiseCustomErrorState(validator) {
    let help;

    if (this.$input.validationMessage === '') {
      help = validator.options.notice;

      if (typeof help === 'function') {
        help = help(this.$input, this);
      }

      if (help != null) {
        this.$input.setCustomValidity(help);
      }
    }

    if (this.$input.validationMessage === '') {
      this.$input.setCustomValidity(u.__('unicorn.message.validation.custom.error'));
    }
  }

  showInvalidResponse() {
    /** @type ValidityState */
    const state = this.$input.validity;
    let message = this.$input.validationMessage;

    for (let key in state) {
      if (state[key] === true && this.$input.dataset[key + 'Message']) {
        message = this.$input.dataset[key + 'Message'];
        break;
      }
    }

    if (!this.isVisible) {
      let title = this.findLabel()?.textContent;

      if (!title) {
        title = this.$input.name;
      }

      u.addMessage(
        `Field: ${title} - ${message}`,
        'warning'
      );
    }

    let $help = this.el.querySelector(this.errorSelector);

    if (!$help) {
      $help = this.createHelpElement();
      this.el.appendChild($help);
      this.prepareWrapper();
    }

    $help.textContent = message;
  }

  createHelpElement() {
    const className = this.options.errorMessageClass;
    const parsed = this.parseSelector(this.errorSelector);

    const $help = u.html(`<div class="${className}"></div>`);

    $help.classList.add(...parsed.classes);

    parsed.attrs.forEach((attr) => {
      $help.setAttribute(attr[0], attr[1] || '');
    });

    parsed.ids.forEach((id) => {
      $help.id = id;
    });

    return $help;
  }

  /**
   * @see https://stackoverflow.com/a/17888178
   *
   * @param subselector
   * @returns {{classes: *[], ids: *[], tags: *[], attrs: *[]}}
   */
  parseSelector(subselector) {
    const obj = { tags: [], classes: [], ids: [], attrs: [] };
    subselector.split(/(?=\.)|(?=#)|(?=\[)/).forEach(function (token) {
      switch (token[0]) {
        case '#':
          obj.ids.push(token.slice(1));
          break;
        case '.':
          obj.classes.push(token.slice(1));
          break;
        case '[':
          obj.attrs.push(token.slice(1, -1).split('='));
          break;
        default :
          obj.tags.push(token);
          break;
      }
    });
    return obj;
  }

  clearInvalidResponse() {
    const $help = this.el.querySelector(this.errorSelector);

    $help.textContent = '';
  }

  getForm() {
    return this.el.closest(this.options.formSelector || '[uni-form-validate]');
  }

  findLabel() {
    const id = this.$input.id;

    const wrapper = this.$input.closest('[data-field-wrapper]');
    let label = null;

    if (wrapper) {
      label = wrapper.querySelector('[data-field-label]');
    }

    if (!label) {
      label = document.querySelector(`label[for="${id}"]`);
    }

    return label;
  }
}

function camelTo(str, sep) {
  return str.replace(/([a-z])([A-Z])/g, `$1${sep}$2`).toLowerCase();
}

validators.username = function (value, element) {
  const regex = new RegExp('[\<|\>|"|\'|\%|\;|\(|\)|\&]', 'i');
  return !regex.test(value);
};

validators.numeric = function (value, element) {
  const regex = /^(\d|-)?(\d|,)*\.?\d*$/;
  return regex.test(value);
};

validators.email = function (value, element) {
  value = punycode.toASCII(value);
  const regex = /^[a-zA-Z0-9.!#$%&â€™*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return regex.test(value);
};

validators.url = function (value, element) {
  const regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;
  return regex.test(value);
};

validators.alnum = function (value, element) {
  const regex = /^[a-zA-Z0-9]*$/;
  return regex.test(value);
};

validators.color = function (value, element) {
  const regex = /^#(?:[0-9a-f]{3}){1,2}$/;
  return regex.test(value);
};

/**
 * @see  http://www.virtuosimedia.com/dev/php/37-tested-php-perl-and-javascript-regular-expressions
 */
validators.creditcard = function (value, element) {
  const regex = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6011[0-9]{12}|622((12[6-9]|1[3-9][0-9])|([2-8][0-9][0-9])|(9(([0-1][0-9])|(2[0-5]))))[0-9]{10}|64[4-9][0-9]{13}|65[0-9]{14}|3(?:0[0-5]|[68][0-9])[0-9]{11}|3[47][0-9]{13})*$/;
  return regex.test(value);
};

validators.ip = function (value, element) {
  const regex = /^((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))*$/;
  return regex.test(value);
};

validators['password-confirm'] = function (value, element) {
  const selector = element.dataset.confirmTarget;

  if (!selector) {
    throw new Error('Validator: "password-confirm" must add "data-confirm-target" attribute.');
  }

  const target = document.querySelector(selector);

  return target.value === value;
};

// customElements.define(UnicornFormValidateElement.is, UnicornFormValidateElement);
// customElements.define(UnicornFieldValidateElement.is, UnicornFieldValidateElement);

u.directive('form-validate', {
  mounted(el, binding) {
    u.getBoundedInstance(el, 'form.validation', (ele) => {
      return new UnicornFormValidation(ele, JSON.parse(binding.value || '{}'));
    });
  },
  updated(el, binding) {
    const instance = u.getBoundedInstance(el, 'form.validation');
    instance.setOptions(JSON.parse(binding.value || '{}'));
  }
});

u.directive('field-validate', {
  mounted(el, binding) {
    u.getBoundedInstance(el, 'field.validation', (ele) => {
      return new UnicornFieldValidation(ele, JSON.parse(binding.value || '{}'));
    });
  },

  updated(el, binding) {
    const instance = u.getBoundedInstance(el, 'field.validation');
    instance.options = JSON.parse(binding.value || '{}');
  }
});

function handleParamValue(value) {
  if (!isNaN(Number(value))) {
    return Number(value);
  }

  if (value === 'null') {
    return null;
  }

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return true;
  }

  return value;
}
