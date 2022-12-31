/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

export default class UnicornValidation {
  static install(app, options = {}) {
    const $validation = app.$validation = new this(app);

    app.formValidation = (selector = '[uni-form-validation]') => {
      return $validation.import().then(() => $validation.get(selector));
    };
  }

  constructor(app) {
    this.app = app;
  }

  /**
   * Import
   * @returns Promise<any>
   */
  import() {
    return this.app.import('@unicorn/ui/validation-components.js');
  }

  /**
   * @param {string|Element} selector
   * @returns {UnicornFormValidation}
   */
  get(selector) {
    return this.app.$helper.getBoundedInstance(selector, 'form.validation');
  }

  /**
   * @param {string|Element} selector
   * @returns {UnicornFieldValidation}
   */
  getField(selector) {
    return this.app.$helper.getBoundedInstance(selector, 'field.validation');
  }

  addGlobalValidator(name, validator, options = {}) {
    return this.import().then((m) => {
      UnicornFormValidation.addGlobalValidator(name, validator, options);
      return m;
    });
  }
}
