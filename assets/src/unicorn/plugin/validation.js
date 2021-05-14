/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

export default class UnicornValidation {
  static install(app, options = {}) {
    app.formValidation = (selector = 'uni-form-validate') => {
      app.import('@unicorn/ui/validation-components.js');

      return app.selectOne(selector);
    };
  }
}


