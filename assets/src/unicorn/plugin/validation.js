import { merge } from 'lodash-es';
import { defData } from '../utilities.js';

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

export default class UnicornValidation {
  static install(app, options = {}) {
    app.validation = (ele, options = {}) => {
      const selector = typeof ele === 'string' ? ele : null;
      ele = app.selectOne(ele);

      app.import('@unicorn/ui/validation-components.js');

      return defData(
        ele,
        'validation.plugin',
        () => new UnicornValidationElement(selector, ele, options, app)
      );
    };
  }
}

class UnicornValidationElement {
  static get defaultOptions() {
    return {
      enabled: true,
      events: ['change'],
      input_selector: 'input, select, textarea',
      scroll: {
        enabled: true,
        offset: -100,
        duration: 1000
      }
    };
  }

  presetInputs = [];

  constructor(selector, ele, options, app) {
    this.app = app;
    this.selector = selector;
    this.options = merge(this.constructor.defaultOptions, options);
    this.$form = ele;

    this.$form.setAttribute('novalidate', true);

    this.bindEvents();
  }

  bindEvents() {
    this.bindInputsEvents();
  }

  bindInputsEvents() {
    this.findInputs().forEach(($input) => {
      this.bindInputEvents($input);
    });
  }

  bindInputEvents($input) {
    this.options.events.forEach((eventName) => {
      $input.addEventListener(eventName, () => {
        this.validateOne($input);
      });
    });
  }

  findInputs(containsPresets = true) {
    const inputs = this.app.selectAll(this.$form.querySelectorAll(this.options.input_selector));

    if (containsPresets) {
      inputs.push(...this.presetInputs);
    }

    return inputs;
  }

  validateOne($input) {
    $input.classList.remove('is-valid', 'is-invalid');

    const valid = $input.checkValidity();

    // this.markFormAsValidated();

    if (valid) {
      $input.classList.add('is-valid');
    } else {
      $input.classList.add('is-invalid');
    }

    this.emitInputValidityEvent($input, valid);
  }

  markFormAsValidated() {
    this.$form.classList.add('was-validated');
  }

  markFormAsUnvalidated() {
    this.$form.classList.remove('was-validated');
  }

  emitInputValidityEvent($input, valid) {
    const state = $input.validity;

    this.app.trigger('validation.response', {
      state,
      $input,
      valid,
      validation: this
    });

    $input.dispatchEvent(
      new CustomEvent(
        'unicorn:validated',
        {
          detail: {
            input: $input,
            state,
            valid,
            validation: this
          }
        }
      )
    );
  }
}
