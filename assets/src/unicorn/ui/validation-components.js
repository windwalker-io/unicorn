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

  get scrollEnabled() {
    const scroll = this.getAttribute('scroll');

    return scroll && scroll !== 'false';
  }

  get scrollOffset() {
    return Number(this.getAttribute('scroll-offset') || -100);
  }

  get fieldSelector() {
    return this.getAttribute('field-selector') || 'uni-field-validate';
  }

  get validatedClass() {
    return this.getAttribute('validated-class') || 'was-validated';
  }

  connectedCallback() {
    this.$form = this.querySelector('form');

    if (this.$form) {
      this.$form.setAttribute('novalidate', true);

      this.$form.addEventListener('submit', (event) => {
        if (!this.validateAll()) {
          event.stopImmediatePropagation(); // Stop following events
          event.stopPropagation();
          event.preventDefault();

          return false;
        }

        return true;
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

    if (firstFail && this.scrollEnabled) {
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
  $input;

  static is = 'uni-field-validate';

  constructor() {
    super();
  }

  static get observedAttributes() {
    return [
      'selector',
    ]
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'selector':
        this.selectInput();
        break;
    }
  }

  get $form() {
    return this.getForm();
  }

  get errorSelector() {
    return this.getAttribute('error-selector') || '[data-field-error]';
  }

  get selector() {
    return this.getAttribute('selector') || 'input, select, textarea';
  }

  get validClass() {
    return this.getAttribute('valid-class') || 'is-valid';
  }

  get invalidClass() {
    return this.getAttribute('invalid-class') || 'is-invalid';
  }

  selectInput() {
    return this.$input = this.querySelector(this.selector);
  }

  connectedCallback() {
    this.selectInput();

    this.bindEvents();

    if (this.querySelector(this.errorSelector)?.classList?.contains('invalid-tooltip')) {
      if (window.getComputedStyle(this).position === 'static') {
        this.style.position = 'relative';
      }
    }
  }

  bindEvents() {
    this.$input.addEventListener('invalid', (e) => {
      this.showInvalidResponse();
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
    this.$input.classList.remove(this.invalidClass);
    this.$input.classList.remove(this.validClass);

    this.$input.setCustomValidity('');

    if (this.$form) {
      this.runCustomValidity();
    }

    const valid = this.$input.checkValidity();

    if (valid) {
      this.$input.classList.add(this.validClass);
    } else {
      this.$input.classList.add(this.invalidClass);
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
        const validator = this.$form.validators[validates[i]];
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

  showInvalidResponse() {
    const $help = this.querySelector(this.errorSelector);

    $help.textContent = this.$input.validationMessage;
  }

  clearInvalidResponse() {
    const $help = this.querySelector(this.errorSelector);

    $help.textContent = '';
  }

  getForm() {
    return this.closest(this.attributes['form-selector'] || 'uni-form-validate');
  }
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

customElements.define(UnicornFormValidateElement.is, UnicornFormValidateElement);
customElements.define(UnicornFieldValidateElement.is, UnicornFieldValidateElement);
