import type { Unicorn } from '@/index';
import type { UnicornFormValidation, UnicornFieldValidation } from '@/modules/ui/validation-components';

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

  get(selector: string): UnicornFormValidation | null {
    return this.app.$helper.getBoundedInstance<UnicornFormValidation>(selector, 'form.validation');
  }

  getField(selector: string | HTMLElement): UnicornFieldValidation | null {
    return this.app.$helper.getBoundedInstance<UnicornFieldValidation>(selector, 'field.validation');
  }

  async addGlobalValidator(name: string, validator: any, options: Record<string, any> = {}) {
    let m = await this.import();

    (m.UnicornFormValidation as typeof UnicornFormValidation).addGlobalValidator(name, validator, options);

    return m;
  }
}
