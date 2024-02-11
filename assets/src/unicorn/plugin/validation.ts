import type { UnicornFormValidation, UnicornFieldValidation } from '../../modules/ui/validation-components';
import UnicornApp from '../app';
import UnicornHelper from './helper';
import UnicornLoader from './loader';

export default class UnicornValidation {
  static install(app: UnicornApp) {
    const $validation = app.$validation = new this(app);

    app.formValidation = async (selector: string = '[uni-form-validation]') => {
      await $validation.import();
      return $validation.get(selector);
    };
  }

  constructor(protected app: UnicornApp) {
    //
  }

  /**
   * Import
   * @returns Promise<any>
   */
  import() {
    return this.$loader.import('@unicorn/ui/validation-components.js');
  }

  get $loader() {
    return this.app.inject<UnicornLoader>('$loader');
  }

  get $helper() {
    return this.app.inject<UnicornHelper>('$helper');
  }

  get(selector: string): UnicornFormValidation | null {
    return this.$helper.getBoundedInstance<UnicornFormValidation>(selector, 'form.validation');
  }

  getField(selector: string | HTMLElement): UnicornFieldValidation | null {
    return this.$helper.getBoundedInstance<UnicornFieldValidation>(selector, 'field.validation');
  }

  async addGlobalValidator(name: string, validator: any, options: Record<string, any> = {}) {
    let m = await this.import();

    (m.UnicornFormValidation as typeof UnicornFormValidation).addGlobalValidator(name, validator, options);

    return m;
  }
}
