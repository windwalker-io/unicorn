import { merge } from 'lodash-es';
import { defData } from '../utilities.js';

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

/**
 * Default handlers
 *
 * @type {Object}
 */
const handlers = {};
let registered = false;

export default class UnicornValidation {
  static install(app, options = {}) {
    registerValidationElements();
  }
}

/**
 * UnicornFormValidateElement
 */
export class UnicornFormValidateElement extends HTMLElement {
  presetFields = [];
  validators = {};
  $form;

  static is = 'uni-form-validate';

  constructor() {
    super();

    this.registerDefaultValidators();
  }

  connectedCallback() {
    this.scroll = this.attributes['scroll'] || true;
    this.scrollOffset = this.attributes['scroll-offset'] || -100;
    this.fieldSelector = this.attributes['field-selector'] || 'uni-field-validate';
    this.$form = this.querySelector('form');

    if (this.$form) {
      this.$form.setAttribute('novalidate', true);

      this.$form.addEventListener('submit', () => {

      });
    }
  }

  findFields(containsPresets = true) {
    const inputs = u.selectAll(this.$form.querySelectorAll(this.fieldSelector));

    if (containsPresets) {
      inputs.push(...this.presetFields);
    }

    return inputs;
  }

  validateAll(fields = null) {
    this.markFormAsUnvalidated();

    fields = fields || this.findFields();
    let firstFail = null;

    fields.forEach((field) => {
      const result = field.checkValidity();

      if (!result && !firstFail) {
        firstFail = field;
      }
    });

    this.markFormAsValidated();

    if (firstFail && this.scroll && this.scroll !== 'false') {
      this.scrollTo(firstFail)
    }

    return firstFail === null;
  }

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
    this.$form.classList.add('was-validated');
  }

  markFormAsUnvalidated() {
    this.$form.classList.remove('was-validated');
  }

  addField(field) {
    this.presetFields.push(field);
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
   * @param name
   * @param validator
   * @param options
   * @returns {UnicornFormValidateElement}
   */
  addValidator(name, validator, options) {
    options = options || {};

    this.validators[name] = {
      handler: validator,
      options: options
    };

    return this;
  }
}

/**
 * UnicornFieldValidateElement
 */
export class UnicornFieldValidateElement extends HTMLElement {
  errorClass = '';

  static is = 'uni-field-validate';

  constructor() {
    super();
  }

  connectedCallback() {
    const $input = this.$input = this.querySelector(
      this.attributes['selector'] || 'input, select, textarea'
    );
    this.formElement = this.closest(this.attributes['form-selector'] || 'uni-form-validate');

    this.bindEvents();

    this.errorClass = this.attributes['error-class'] || 'invalid-tooltip';

    if (this.errorClass === 'invalid-tooltip') {
      if (window.getComputedStyle(this).position === 'static') {
        this.style.position = 'relative';
      }
    }
  }

  bindEvents() {
    this.$input.addEventListener('invalid', (e) => {
      this.showResponse();
    });

    const events = this.attributes['events'] || 'change';

    events.split(',')
      .map(e => e.trim())
      .filter(e => e !== '')
      .forEach((eventName) => {
        this.$input.addEventListener(eventName, () => {
          this.checkValidity();
        });
      });
  }

  checkValidity() {
    this.$input.classList.remove('is-invalid');
    this.$input.classList.remove('is-valid');

    this.$input.setCustomValidity('');

    if (this.formElement) {
      this.runCustomValidity();
    }

    const valid = this.$input.checkValidity();

    if (valid) {
      this.$input.classList.add('is-valid');
    } else {
      this.$input.classList.add('is-invalid');
    }

    return valid;
  }

  runCustomValidity() {
    // Check custom validity
    const validates = (this.$input.getAttribute('data-validate') || '').split('|');
    let help;
    let result = true;

    if (this.$input.value !== '' && validates.length) {
      for (let i in validates) {
        const validator = this.formElement.validators[validates[i]];
        if (validator && !validator.handler(this.$input.value, this.$input)) {
          help = validator.options.notice;

          if (typeof help === 'function') {
            help = help(this.$input, this);
          }

          if (help != null) {
            this.$input.setCustomValidity(help);
          }

          if (this.$input.validationMessage === '') {
            this.$input.setCustomValidity('Value type mismatch');
          }

          result = false;

          break;
        }
      }
    }

    return result;
  }

  showResponse() {
    const $input = this.$input;
    const $help = document.createElement('div');
    const state = $input.validity;
    const errorClass = this.attributes['error-class'] || 'invalid-tooltip';

    this.querySelector(`.${errorClass}`)?.remove();

    if (state.valid) {
      return;
    }

    $help.textContent = $input.validationMessage;

    $help.classList.add(errorClass);

    $input.parentNode.insertBefore($help, $input.nextSibling);
  }
}

function registerValidationElements() {
  if (registered) {
    return;
  }

  registered = true;

  customElements.define(UnicornFormValidateElement.is, UnicornFormValidateElement);
  customElements.define(UnicornFieldValidateElement.is, UnicornFieldValidateElement);
}

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
