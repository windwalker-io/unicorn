import * as punycode from 'punycode';
import { useUniDirective } from '../composable';
import { getBoundedInstance, html, selectAll, selectOne, trans, useUITheme } from '../service';
import { Nullable } from '../types';
import { mergeDeep } from '../utilities';

export declare type ValidationHandler<V = any, E = HTMLElement, P = Record<string, any>> = (
  value: V,
  input: E,
  options?: ValidatorOptions<E, P>,
  fv?: UnicornFieldValidation
) => any;

export declare type ValidatorNoticeFunction<E = HTMLElement> = (input: E, field: UnicornFieldValidation) => any;

export type ValidatorOptions<E = HTMLElement, P = Record<string, any>> = {
  notice?: ValidatorNoticeFunction<E> | string;
  [name: string]: any;
} & Partial<P>;

export declare type Validator<V = any, E = HTMLElement, P = Record<string, any>> = {
  handler: ValidationHandler<V, E, P>,
  options?: ValidatorOptions<E, P>;
};

const validatorHandlers: Record<string, ValidationHandler<any, any>> = {};

type InputElements = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export interface FormValidationOptions {
  scroll: boolean;
  validatedClass: null;
  fieldSelector: null;
  scrollOffset: number;
  enabled: boolean;
  fieldDefaults?: Partial<Omit<FieldValidationOptions, 'inputOptions' | 'formSelector'>>;
}

export interface FieldValidationOptions {
  validClass: string;
  errorSelector: string;
  inputOptions: boolean;
  inputOptionsSelector: string;
  formSelector: string;
  selector: string;
  inputOptionsWrapperSelector: string;
  events: string[];
  invalidClass: string;
  errorMessageClass: string;
}

const defaultOptions: FormValidationOptions = {
  scroll: false,
  scrollOffset: -100,
  enabled: true,
  fieldSelector: null,
  validatedClass: null,
};

const defaultFieldOptions: FieldValidationOptions = {
  formSelector: '[uni-form-validate]',
  errorSelector: '[data-field-error]',
  selector: 'input[data-field-input], select[data-field-input], textarea[data-field-input]',
  validClass: 'is-valid',
  invalidClass: 'is-invalid',
  events: ['change'],
  errorMessageClass: 'invalid-tooltip',
  inputOptions: false,
  inputOptionsWrapperSelector: 'div[data-field-input]',
  inputOptionsSelector: '[data-input-option]'
};

export class UnicornFormValidation {
  presetFields: HTMLElement[] = [];

  static globalValidators: Record<string, Validator<any, any, any>> = {};

  validators: Record<string, Validator<any, any, any>> = {};
  options: FormValidationOptions;
  $form: HTMLElement;

  static is = 'uni-form-validate';

  constructor(el: HTMLElement, options: Partial<FormValidationOptions> = {}) {
    this.$form = selectOne(el);
    this.options = this.mergeOptions(options);

    this.registerDefaultValidators();

    this.init();
  }

  mergeOptions(options: Partial<FormValidationOptions>) {
    // Fix PHP empty array to JSON issue.
    if (Array.isArray(options)) {
      options = {};
    }

    return this.options = mergeDeep({}, defaultOptions, this.options || {}, options);
  }

  get scrollEnabled() {
    return this.options.scroll;
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
      this.$form.setAttribute('novalidate', 'true');
      this.$form.addEventListener('submit', (event) => {
        if (this.options.enabled && !this.validateAll()) {
          event.stopImmediatePropagation(); // Stop following events
          event.stopPropagation();
          event.preventDefault();

          this.$form.dispatchEvent(new CustomEvent('invalid'));

          return false;
        }

        return true;
      }, false);
    }

    this.prepareFields(this.findDOMFields());
    this.prepareFields(this.presetFields);
  }

  findDOMFields(): HTMLElement[] {
    return selectAll(this.$form.querySelectorAll<HTMLElement>(this.fieldSelector));
  }

  prepareFields(inputs: HTMLElement[]): Promise<void> {
    inputs.forEach((input) => {
      this.prepareFieldWrapper(input);
    });

    // Wait next tick
    return Promise.resolve();
  }

  prepareFieldWrapper(input: HTMLElement): HTMLElement | null {
    if (['INPUT', 'SELECT', 'TEXTAREA'].indexOf(input.tagName) !== -1) {
      let wrapper: HTMLElement | null = input.closest('[uni-field-validate]');

      if (!wrapper) {
        wrapper = input.closest('[data-input-container]') || input.parentElement;

        wrapper?.setAttribute('uni-field-validate', '{}');
      }

      return wrapper;
    }

    return input;
  }

  findFields(containsPresets: boolean = true): HTMLElement[] {
    let inputs = this.findDOMFields();

    if (containsPresets) {
      inputs.push(...this.presetFields);
    }

    return inputs.map((input) => this.prepareFieldWrapper(input))
      .filter(input => input != null) as HTMLElement[];
  }

  getFieldComponents(containsPresets: boolean = true): UnicornFieldValidation[] {
    const components: UnicornFieldValidation[] = [];

    for (const field of this.findFields(containsPresets)) {
      const v = this.getFieldComponent(field);

      if (v) {
        components.push(v);
      }
    }

    return components;
  }

  getFieldComponent(input: HTMLElement): UnicornFieldValidation | null {
    let v = getBoundedInstance(input, 'field.validation');

    if (!v) {
      const wrapper = input.closest('[uni-field-validate]') as HTMLElement | null;

      if (wrapper) {
        v = getBoundedInstance(wrapper, 'field.validation');
      }
    }

    return v;
  }

  validateAll(fields?: Nullable<HTMLElement[]>): boolean {
    this.markFormAsUnvalidated();

    fields = fields || this.findFields();
    let firstFail: HTMLElement | null = null;

    for (const field of fields) {
      const fv = this.getFieldComponent(field);

      if (!fv) {
        continue;
      }

      const result = fv.checkValidity();

      if (!result && !firstFail) {
        firstFail = field;
      }
    }

    this.markFormAsValidated();

    if (firstFail && this.scrollEnabled) {
      this.scrollTo(firstFail);
    }

    return firstFail === null;
  }

  async validateAllAsync(fields?: Nullable<HTMLElement[]>): Promise<boolean> {
    this.markFormAsUnvalidated();

    fields = fields || this.findFields();
    let firstFail: HTMLElement | null = null;
    const promises: Promise<boolean>[] = [];

    for (const field of fields) {
      const fv = this.getFieldComponent(field);

      if (!fv) {
        continue;
      }

      promises.push(
        fv.checkValidityAsync().then((result) => {
          if (!result && !firstFail) {
            firstFail = field;
          }

          return result;
        })
      );
    }

    await Promise.all(promises);

    this.markFormAsValidated();

    if (firstFail && this.scrollEnabled) {
      this.scrollTo(firstFail);
    }

    return firstFail === null;
  }

  scrollTo(element: HTMLElement): void {
    const offset = this.scrollOffset;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY + offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }

  markFormAsValidated(): void {
    if (!this.$form) {
      return;
    }

    this.$form.classList.add(this.validatedClass);
  }

  markFormAsUnvalidated(): void {
    if (!this.$form) {
      return;
    }

    this.$form.classList.remove(this.validatedClass);
  }

  addField(field: HTMLElement): this {
    this.presetFields.push(field);

    this.prepareFieldWrapper(field);

    return this;
  }

  registerDefaultValidators(): void {
    for (let name in validatorHandlers) {
      this.addValidator(name, validatorHandlers[name]);
    }
  }

  /**
   * Add validator handler.
   */
  addValidator<T extends any, E extends HTMLElement, P = Record<string, any>>(
    name: string,
    handler: ValidationHandler<T, E, P>,
    options: ValidatorOptions<E, P> = {}
  ) {
    options = options || {};

    this.validators[name] = {
      handler,
      options
    };

    return this;
  }

  /**
   * Add validator handler.
   */
  static addGlobalValidator<T extends any, E extends HTMLElement, P = Record<string, any>>(
    name: string,
    handler: ValidationHandler<T, E, P>,
    options: ValidatorOptions<E, P> = {}
  ) {
    options = options || {};

    this.globalValidators[name] = {
      handler,
      options
    };

    return this;
  }
}

export class UnicornFieldValidation {
  $input: InputElements | undefined;
  options: Partial<FieldValidationOptions> = {};

  static is = 'uni-field-validate';

  constructor(protected el: HTMLElement, options: Partial<FieldValidationOptions> = {}) {
    this.setOptions(options);

    this.$input = this.selectInput();

    this.init();
  }

  setOptions(options: Partial<FieldValidationOptions>) {
    // Fix PHP empty array to JSON issue.
    if (Array.isArray(options)) {
      options = {};
    }

    this.options = options;

    return this;
  }

  get mergedOptions(): FieldValidationOptions {
    return mergeDeep({}, defaultFieldOptions, this.globalOptions, this.options);
  }

  get $form(): HTMLFormElement {
    return this.getForm();
  }

  get errorSelector(): string {
    return this.mergedOptions.errorSelector;
  }

  get selector(): string {
    return this.mergedOptions.selector;
  }

  get validClass(): string {
    return this.mergedOptions.validClass;
  }

  get invalidClass(): string {
    return this.mergedOptions.invalidClass;
  }

  get isVisible(): boolean {
    return !!(this.el.offsetWidth || this.el.offsetHeight || this.el.getClientRects().length);
  }

  get isInputOptions(): boolean {
    return Boolean(this.mergedOptions.inputOptions);
  }

  get validationMessage(): string {
    return this.$input?.validationMessage || '';
  }

  get validity(): ValidityState | undefined {
    return this.$input?.validity;
  }

  selectInput(): InputElements | undefined {
    let selector = this.selector;

    if (this.mergedOptions.inputOptions) {
      selector += ', ' + this.mergedOptions.inputOptionsWrapperSelector;
    }

    let input = this.el.querySelector<InputElements>(selector);

    if (!input) {
      input = this.el.querySelector<InputElements>('input, select, textarea');
    }

    if (!input) {
      return undefined;
    }

    return this.$input = input;
  }

  init() {
    this.selectInput();

    this.bindEvents();

    this.prepareWrapper();

    if (this.isInputOptions) {
      const $input = this.$input as any;

      if (
        !($input instanceof HTMLInputElement)
        && !($input instanceof HTMLSelectElement)
        && !($input instanceof HTMLTextAreaElement)
      ) {
        $input.validationMessage = '';

        $input.setCustomValidity = (msg: string) => {
          $input.validationMessage = String(msg);
        };

        $input.checkValidity = () => {
          return this.checkInputOptionsValidity();
        };
      }
    }
  }

  bindEvents() {
    if (!this.$input) {
      return;
    }

    this.$input.addEventListener('invalid', (e) => {
      this.showInvalidResponse();
    });
    
    const events = this.mergedOptions.events;

    events.forEach((eventName) => {
      this.$input?.addEventListener(eventName, () => {
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

    if (this.$input.hasAttribute('[data-novalidate]')) {
      return true;
    }

    if (this.$input.closest('[data-novalidate]')) {
      return true;
    }

    if (this.hasChildDirectives()) {
      // If has child field validation directives, let them handle the validation.
      return true;
    }

    this.$input.setCustomValidity('');
    let valid = this.$input.checkValidity();

    if (valid && this.$form) {
      valid = this.runCustomValidity();
    }

    // Raise invalid event
    // this.$input.checkValidity();

    this.updateValidClass(valid);

    return valid;
  }

  protected runCustomValidity() {
    if (!this.$input) {
      return true;
    }

    // Check custom validity
    const validates = (this.$input.getAttribute('data-validate') || '').split('|');
    let result = true;

    if (this.$input.value !== '' && validates.length) {
      if (!this.checkCustomDataAttributeValidity()) {
        return false;
      }

      for (const validatorName of validates) {
        const [validator, options] = this.getValidator(validatorName) || [null, {}];

        if (!validator) {
          continue;
        }

        Object.assign(options, validator.options);

        let r = validator.handler(this.$input.value, this.$input, options, this);

        // If return is a promise, push to stack and resolve later
        if (r instanceof Promise || (typeof r === 'object' && r.then)) {
          r.then((result: boolean) => {
            this.handleAsyncCustomResult(result, validator);
          });
          continue;
        }

        if (!this.handleCustomResult(r, validator)) {
          result = false;

          break;
        }
      }
    }

    return result;
  }

  async checkValidityAsync() {
    if (!this.$input) {
      return true;
    }

    if (this.$input.hasAttribute('readonly')) {
      return true;
    }

    if (this.$input.hasAttribute('[data-novalidate]')) {
      return true;
    }

    if (this.hasChildDirectives()) {
      // If has child field validation directives, let them handle the validation.
      return true;
    }

    this.$input.setCustomValidity('');
    let valid = this.$input.checkValidity();

    if (valid && this.$form) {
      valid = await this.runCustomValidityAsync();
    }

    this.updateValidClass(valid);

    return valid;
  }

  protected async runCustomValidityAsync(): Promise<boolean> {
    if (!this.$input) {
      return true;
    }

    // Check custom validity
    const validates = (this.$input.getAttribute('data-validate') || '').split('|');

    const results: Array<boolean | string | undefined> = [];
    const promises: Promise<boolean>[] = [];

    if (this.$input.value !== '' && validates.length) {
      if (!this.checkCustomDataAttributeValidity()) {
        return false;
      }

      for (const validatorName of validates) {
        let [validator, options] = this.getValidator(validatorName) || [null, {}];

        if (!validator) {
          continue;
        }

        options = Object.assign({}, options, validator.options || {});

        promises.push(
          Promise.resolve(validator.handler(this.$input.value, this.$input, options, this))
            .then((r) => {
              results.push(this.handleAsyncCustomResult(r, validator));

              return r;
            })
        );
      }
    }

    await Promise.all(promises);

    for (const result of results) {
      if (result === false) {
        return false;
      }
    }

    return true;
  }

  protected checkCustomDataAttributeValidity(): boolean {
    const error = this.$input?.dataset.validationFail;

    return this.handleCustomResult(error);
  }

  protected checkInputOptionsValidity(): boolean {
    if (!this.$input) {
      return true;
    }

    const isRequired = this.$input.getAttribute('required') != null;
    const optionWrappers = this.$input.querySelectorAll(this.mergedOptions.inputOptionsSelector);
    let result = true;

    if (isRequired) {
      for (const optionWrapper of optionWrappers) {
        const input = optionWrapper.querySelector('input');

        result = false;

        // Only need one checked
        if (input?.checked) {
          result = true;
          break;
        }
      }
    }

    // Get browser input validation message
    const n = document.createElement('input');
    n.required = isRequired;

    if (result) {
      n.value = 'placeholder';
    }

    n.checkValidity();

    (this.$input as any).validationMessage = n.validationMessage;
    (this.$input as any).validity = n.validity;

    for (const optionWrapper of optionWrappers) {
      const input = optionWrapper.querySelector<HTMLInputElement>('input');

      input?.setCustomValidity(n.validationMessage);
    }

    if (!result) {
      this.$input.dispatchEvent(
        new CustomEvent('invalid')
      );
    }

    return result;
  }

  /**
   * @param valid {boolean}
   */
  updateValidClass(valid: Boolean) {
    const $errorElement = this.getErrorElement();
    const $invalidTarget = $errorElement?.previousElementSibling;

    this.$input?.classList.remove(this.invalidClass);
    this.$input?.classList.remove(this.validClass);
    this.el.classList.remove(this.invalidClass);
    this.el.classList.remove(this.validClass);
    $invalidTarget?.classList.remove(this.invalidClass);
    $invalidTarget?.classList.remove(this.validClass);

    if (valid) {
      this.$input?.classList.add(this.validClass);
      this.el.classList.add(this.validClass);

      $invalidTarget?.classList.add(this.validClass);
    } else {
      this.$input?.classList.add(this.invalidClass);
      this.el.classList.add(this.invalidClass);

      $invalidTarget?.classList.add(this.invalidClass);
    }
  }

  getFormValidation(element?: Nullable<HTMLFormElement>): UnicornFormValidation | null {
    return getBoundedInstance(element || this.getForm(), 'form.validation')!;
  }

  get globalOptions(): Partial<FieldValidationOptions> {
    return this.getFormValidation()?.options?.fieldDefaults ?? {};
  }

  getValidator(name: string): [Validator, Record<string, any>] | null {
    const matches = name.match(/(?<type>[\w\-_]+)(\((?<params>.*)\))*/);

    if (!matches) {
      return null;
    }

    const validatorName = matches.groups?.type || '';

    const params = matches.groups?.params || '';

    const fv = this.getFormValidation(this.$form!);
    const validator = fv?.validators[validatorName] || UnicornFormValidation.globalValidators[validatorName];

    if (!validator) {
      return null;
    }

    const paramMatches = params.matchAll(/(?<key>\w+)(\s?[=:]\s?(?<value>\w+))?/g);
    const options: Record<string, string> = {};

    for (const paramMatch of paramMatches) {
      const match = paramMatch?.groups as {
        key: string;
        value: string;
      } | undefined;

      if (!match) {
        continue;
      }

      options[match.key] = handleParamValue(match.value);
    }

    return [validator, options];
  }

  handleCustomResult(result: boolean | string | undefined, validator?: Nullable<Validator>): boolean {
    if (typeof result === 'string') {
      this.$input?.setCustomValidity(result);
      result = result === '';
    } else if (result === undefined) {
      result = true;
    }

    if (result) {
      this.$input?.setCustomValidity('');
    } else if (validator) {
      this.raiseCustomErrorState(validator);
    }

    return result;
  }

  handleAsyncCustomResult(result: boolean, validator?: Nullable<Validator>): boolean {
    result = this.handleCustomResult(result, validator);

    // Fire invalid events
    this.$input?.checkValidity();

    this.updateValidClass(result);

    return result;
  }

  raiseCustomErrorState(validator: Validator): void {
    let help;

    if (this.$input?.validationMessage === '') {
      help = validator.options?.notice;

      if (typeof help === 'function') {
        help = help(this.$input, this);
      }

      if (help != null) {
        this.$input?.setCustomValidity(help);
      }
    }

    if (this.$input?.validationMessage === '') {
      this.$input?.setCustomValidity(trans('unicorn.message.validation.custom.error'));
    }

    this.$input?.dispatchEvent(
      new CustomEvent('invalid')
    );
  }

  setAsInvalidAndReport(error: string) {
    this.setCustomValidity(error);
    this.showInvalidResponse();
  }

  setCustomValidity(error: string) {
    this.$input?.setCustomValidity(error);
  }

  reportValidity() {
    if (this.validationMessage !== '') {
      this.showInvalidResponse();
    }
  }

  showInvalidResponse() {
    if (this.hasChildDirectives()) {
      // If has child field validation directives, let them handle the error message display.
      return;
    }

    /** @type ValidityState */
    const state = this.$input?.validity;
    let message: string = this.$input?.validationMessage || '';

    for (let key in state) {
      if (state[(key as keyof ValidityState)] && this.$input?.dataset[key + 'Message']) {
        message = this.$input?.dataset[key + 'Message'] || '';
        break;
      }
    }

    if (!this.isVisible) {
      let title = this.findLabel()?.textContent;

      if (!title) {
        title = this.$input?.name || '';
      }

      useUITheme().renderMessage(
        `Field: ${title} - ${message}`,
        'warning'
      );
    }

    let $help = this.getErrorElement();

    if (!$help) {
      $help = this.createHelpElement()!;
      this.el.appendChild($help);
      this.prepareWrapper();
    }

    $help.textContent = message;

    this.updateValidClass(false);
  }

  getErrorElement() {
    return this.el.querySelector(this.errorSelector);
  }

  createHelpElement() {
    const className = this.mergedOptions.errorMessageClass;
    const parsed = this.parseSelector(this.errorSelector || '');

    const $help = html(`<div class="${className}"></div>`)!;

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
   */
  parseSelector(subselector: string): { tags: string[]; classes: string[]; ids: string[]; attrs: string[][] } {
    const obj: {
      tags: string[];
      classes: string[];
      ids: string[];
      attrs: string[][];
    } = { tags: [], classes: [], ids: [], attrs: [] };
    for (const token of subselector.split(/(?=\.)|(?=#)|(?=\[)/)) {
      switch (token[0]) {
        case '#':
          obj.ids.push(token.slice(1));
          break;
        case '.':
          obj.classes.push(token.slice(1));
          break;
        case '[':
          obj.attrs.push(token.slice(1, -1).split('='));
          break;
        default :
          obj.tags.push(token);
          break;
      }
    }
    return obj;
  }

  setAsValidAndClearResponse() {
    this.setCustomValidity('');
    this.updateValidClass(true);
    this.clearInvalidResponse();
  }

  clearInvalidResponse() {
    const $help = this.el.querySelector(this.errorSelector)!;

    $help.textContent = '';
  }

  getForm() {
    return this.el.closest(this.options.formSelector || '[uni-form-validate]') as HTMLFormElement;
  }

  findLabel() {
    const id = this.$input?.id || '';

    const wrapper = this.$input?.closest('[data-field-wrapper]');
    let label = null;

    if (wrapper) {
      label = wrapper.querySelector('[data-field-label]');
    }

    if (!label) {
      label = document.querySelector(`label[for="${id}"]`);
    }

    return label;
  }

  protected hasChildDirectives() {
    return this.el.querySelector('[uni-field-validate]') != null;
  }
}

function camelTo(str: string, sep: string) {
  return str.replace(/([a-z])([A-Z])/g, `$1${sep}$2`).toLowerCase();
}

validatorHandlers.username = function (value: any, element: HTMLElement) {
  const regex = new RegExp('[\<|\>|"|\'|\%|\;|\(|\)|\&]', 'i');
  return !regex.test(value);
};

validatorHandlers.numeric = function (value: any, element: HTMLElement) {
  const regex = /^(\d|-)?(\d|,)*\.?\d*$/;
  return regex.test(value);
};

validatorHandlers.email = function (value: any, element: HTMLElement) {
  value = punycode.toASCII(value);
  const regex = /^[a-zA-Z0-9.!#$%&â€™*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return regex.test(value);
};

validatorHandlers.url = function (value: any, element: HTMLElement) {
  const regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;
  return regex.test(value);
};

validatorHandlers.alnum = function (value: any, element: HTMLElement) {
  const regex = /^[a-zA-Z0-9]*$/;
  return regex.test(value);
};

validatorHandlers.color = function (value: any, element: HTMLElement) {
  const regex = /^#(?:[0-9a-f]{3}){1,2}$/;
  return regex.test(value);
};

/**
 * @see  http://www.virtuosimedia.com/dev/php/37-tested-php-perl-and-javascript-regular-expressions
 */
validatorHandlers.creditcard = function (value: any, element: HTMLElement) {
  const regex = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6011[0-9]{12}|622((12[6-9]|1[3-9][0-9])|([2-8][0-9][0-9])|(9(([0-1][0-9])|(2[0-5]))))[0-9]{10}|64[4-9][0-9]{13}|65[0-9]{14}|3(?:0[0-5]|[68][0-9])[0-9]{11}|3[47][0-9]{13})*$/;
  return regex.test(value);
};

validatorHandlers.ip = function (value: any, element: HTMLElement) {
  const regex = /^((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))*$/;
  return regex.test(value);
};

validatorHandlers['password-confirm'] = function (value: any, element: HTMLElement) {
  const selector = element.dataset.confirmTarget;

  if (!selector) {
    throw new Error('Validator: "password-confirm" must add "data-confirm-target" attribute.');
  }

  const target = document.querySelector<HTMLInputElement>(selector);

  return target?.value === value;
};

export { validatorHandlers as validators };

// customElements.define(UnicornFormValidateElement.is, UnicornFormValidateElement);
// customElements.define(UnicornFieldValidateElement.is, UnicornFieldValidateElement);

export const ready = Promise.all([
  useUniDirective('form-validate', {
    mounted(el, binding) {
      getBoundedInstance(el, 'form.validation', (ele) => {
        return new UnicornFormValidation(ele as HTMLElement, JSON.parse(binding.value || '{}'));
      });
    },
    updated(el, binding) {
      const instance = getBoundedInstance<UnicornFormValidation>(el, 'form.validation');
      instance.mergeOptions(JSON.parse(binding.value || '{}'));
    }
  }),

  useUniDirective('field-validate', {
    mounted(el, binding) {
      getBoundedInstance<UnicornFieldValidation>(el, 'field.validation', (ele) => {
        return new UnicornFieldValidation(ele as HTMLElement, JSON.parse(binding.value || '{}'));
      });
    },

    updated(el, binding) {
      const instance = getBoundedInstance<UnicornFieldValidation>(el, 'field.validation');
      instance.setOptions(JSON.parse(binding.value || '{}') || {});
    }
  })
]);

function handleParamValue(value: any) {
  if (!isNaN(Number(value))) {
    return Number(value);
  }

  if (value === 'null') {
    return null;
  }

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return true;
  }

  return value;
}

export interface ValidationModule {
  UnicornFormValidation: typeof UnicornFormValidation;
  UnicornFieldValidation: typeof UnicornFieldValidation;
  ready: Promise<any>;
  validators: typeof validatorHandlers;
}
