/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

export default class UnicornValidation {
  static install(app, options = {}) {
    app.formValidation = (selector = '[uni-form-validation]') => {
      return app.import('@unicorn/ui/validation-components.js')
        .then(() => {
          return app.getBoundedInstance(selector, 'form.validation');
        });
    };
  }
}
