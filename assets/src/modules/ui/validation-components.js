/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

import { defaultsDeep } from 'lodash-es';

/**
 * Default handlers
 *
 * @type {{ [name: string]: ValidationHandler }}
 */
const handlers = {};

const defaultOptions = {
  scroll: false,
  scrollOffset: -100,
  enabled: true,
  fieldSelector: null,
  validatedClass: null,
};

export class UnicornFormValidation {
  /**
   * @type {Element[]}
   */
  presetFields = [];

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
    this.options = defaultsDeep(options, defaultOptions);
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
      const wrapper = input.closest('.form-group, [uni-field-validate]');

      if (wrapper && !wrapper.getAttribute('uni-field-validate')) {
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
   * @param {Element[]} fields
   * @returns {boolean}
   */
  validateAll(fields = null) {
    this.markFormAsUnvalidated();

    fields = fields || this.findFields();
    let firstFail = null;

    fields.forEach((field) => {
      const fv = u.getBoundedInstance(field, 'field.validation');

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
      this.scrollTo(firstFail)
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
    for (let name in handlers) {
      if (handlers.hasOwnProperty(name)) {
        this.addValidator(name, handlers[name]);
      }
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
}

export class UnicornFieldValidation {
  $input;

  static is = 'uni-field-validate';

  constructor(el, options = {}) {
    this.el = el;
    this.options = options;

    this.init();
  }

  get $form() {
    return this.getForm();
  }

  get errorSelector() {
    return this.options.errorSelector || '[data-field-error]';
  }

  get selector() {
    return this.options.selector || 'input[data-field-input], select[data-field-input], textarea[data-field-input]';
  }

  get validClass() {
    return this.options.validClass || 'is-valid';
  }

  get invalidClass() {
    return this.options.invalidClass || 'is-invalid';
  }

  get isVisible() {
    return !!(this.el.offsetWidth || this.el.offsetHeight || this.el.getClientRects().length);
  }

  selectInput() {
    let input = this.el.querySelector(this.selector);

    if (!input) {
      input = this.el.querySelector('input, select, textarea');
    }

    return this.$input = input;
  }

  init() {
    this.selectInput();

    this.bindEvents();

    this.prepareWrapper();
  }

  bindEvents() {
    if (!this.$input) {
      return;
    }

    this.$input.addEventListener('invalid', (e) => {
      this.showInvalidResponse();
    });

    const events = this.options['events'] || ['change'];

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

    this.$input.classList.remove(this.invalidClass);
    this.$input.classList.remove(this.validClass);
    this.el.classList.remove(this.invalidClass);
    this.el.classList.remove(this.validClass);

    this.$input.setCustomValidity('');

    if (this.$form) {
      this.runCustomValidity();
    }

    const valid = this.$input.checkValidity();

    if (valid) {
      this.$input.classList.add(this.validClass);
      this.el.classList.add(this.validClass);
    } else {
      this.$input.classList.add(this.invalidClass);
      this.el.classList.add(this.invalidClass);
    }

    return valid;
  }

  /**
   * @param {Element} element
   * @returns {UnicornFormValidation}
   */
  getFormValidation(element) {
    return u.getBoundedInstance(element, 'form.validation');
  }

  runCustomValidity() {
    // Check custom validity
    const validates = (this.$input.getAttribute('data-validate') || '').split('|');
    let help;
    let result = true;
    const fv = this.getFormValidation(this.$form);

    if (this.$input.value !== '' && validates.length) {
      for (let i in validates) {
        const validator = fv.validators[validates[i]];
        if (validator && !validator.handler(this.$input.value, this.$input)) {
          help = validator.options.notice;

          if (typeof help === 'function') {
            help = help(this.$input, this);
          }

          if (help != null) {
            this.$input.setCustomValidity(help);
          }

          if (this.$input.validationMessage === '') {
            this.$input.setCustomValidity(u.__('unicorn.message.validation.custom.error'));
          }

          result = false;

          break;
        }
      }
    }

    return result;
  }

  showInvalidResponse() {
    if (!this.isVisible) {
      let title = this.findLabel()?.textContent;

      if (!title) {
        title = this.$input.name;
      }

      u.addMessage(
        `Field: ${title} - ${this.$input.validationMessage}`,
        'warning'
      );
    }

    let $help = this.el.querySelector(this.errorSelector);

    if (!$help) {
      $help = this.createHelpElement();
      this.el.appendChild($help);
      this.prepareWrapper();
    }

    $help.textContent = this.$input.validationMessage;
  }

  createHelpElement() {
    const className = this.options.errorMessageClass || 'invalid-tooltip';
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
    var obj = {tags:[], classes:[], ids:[], attrs:[]};
    subselector.split(/(?=\.)|(?=#)|(?=\[)/).forEach(function(token){
      switch (token[0]) {
        case '#':
          obj.ids.push(token.slice(1));
          break;
        case '.':
          obj.classes.push(token.slice(1));
          break;
        case '[':
          obj.attrs.push(token.slice(1,-1).split('='));
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
    return this.el.closest(this.options['formSelector'] || '[uni-form-validate]');
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

function camelTo(str, sep) {
  return str.replace(/([a-z])([A-Z])/g, `$1${sep}$2`).toLowerCase();
}

handlers.username = function(value, element) {
  const regex = new RegExp("[\<|\>|\"|\'|\%|\;|\(|\)|\&]", "i");
  return !regex.test(value);
};

handlers.numeric = function(value, element) {
  const regex = /^(\d|-)?(\d|,)*\.?\d*$/;
  return regex.test(value);
};

handlers.email = function(value, element) {
  value = punycode.toASCII(value);
  const regex = /^[a-zA-Z0-9.!#$%&â€™*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return regex.test(value);
};

handlers.url = function(value, element) {
  const regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;
  return regex.test(value);
};

handlers.alnum = function(value, element) {
  const regex = /^[a-zA-Z0-9]*$/;
  return regex.test(value);
};

handlers.color = function(value, element) {
  const regex = /^#(?:[0-9a-f]{3}){1,2}$/;
  return regex.test(value);
};

/**
 * @see  http://www.virtuosimedia.com/dev/php/37-tested-php-perl-and-javascript-regular-expressions
 */
handlers.creditcard = function(value, element) {
  const regex = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6011[0-9]{12}|622((12[6-9]|1[3-9][0-9])|([2-8][0-9][0-9])|(9(([0-1][0-9])|(2[0-5]))))[0-9]{10}|64[4-9][0-9]{13}|65[0-9]{14}|3(?:0[0-5]|[68][0-9])[0-9]{11}|3[47][0-9]{13})*$/;
  return regex.test(value);
};

handlers.ip = function(value, element) {
  const regex = /^((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))*$/;
  return regex.test(value);
};

handlers['password-confirm'] = function (value, element) {
  const selector = element.attr('data-confirm-target');
  const target = $(selector);

  return target.val() === value;
};

// customElements.define(UnicornFormValidateElement.is, UnicornFormValidateElement);
// customElements.define(UnicornFieldValidateElement.is, UnicornFieldValidateElement);
