import type { Unicorn } from '@/index';

export default class UnicornValidation {
  static install(app: Unicorn) {
    const $validation = app.$validation = new this(app);

    app.formValidation = async (selector: string = '[uni-form-validation]') => {
      await $validation.import();
      return $validation.get(selector);
    };
  }

  constructor(protected app: Unicorn) {
    //
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
  get(selector: string): UnicornFormValidation {
    return this.app.$helper.getBoundedInstance(selector, 'form.validation');
  }

  /**
   * @param {string|Element} selector
   * @returns {UnicornFieldValidation}
   */
  getField(selector: string | HTMLElement) {
    return this.app.$helper.getBoundedInstance(selector, 'field.validation');
  }

  async addGlobalValidator(name: string, validator: any, options = {}) {
    let m = await this.import();

    UnicornFormValidation.addGlobalValidator(name, validator, options);

    return m;
  }
}
