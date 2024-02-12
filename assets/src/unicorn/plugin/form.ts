import { each } from 'lodash-es';
import UnicornApp from '../app';
import type { Nullable } from '../types/base';
import { defData } from '../utilities';
import UnicornHelper from './helper';

const defaultOptions = {};

export default class UnicornForm {
  static get is() {
    return 'form';
  }

  static install(app: UnicornApp, options = {}) {
    const form = new this(app);

    app.form = form.get.bind(form);
  }

  constructor(protected app: UnicornApp) {
  }

  get(ele: Nullable<string | Element>, options: Record<string, any> = {}) {
    if (ele == null) {
      return new UnicornFormElement(this.app, undefined, undefined, options);
    }

    const selector = typeof ele === 'string' ? ele : undefined;
    const el = this.app.inject<UnicornHelper>('$helper').selectOne<HTMLFormElement>(ele as string);

    if (!el) {
      throw new Error(`Form element of: ${selector} not found.`);
    }

    return defData(
      el,
      'form.plugin',
      () => new UnicornFormElement(this.app, selector, el, options)
    );
  };
}

export class UnicornFormElement {
  element: HTMLFormElement | undefined;
  options: Record<string, any>;

  constructor(
    protected app: UnicornApp,
    selector?: Nullable<string | Element>,
    $form?: Nullable<HTMLFormElement>,
    options: Record<string, any> = {},
  ) {

    // If form not found, create one
    if (!$form) {
      $form = document.createElement('form');

      if (typeof selector === 'string' && selector.indexOf('#') === 0) {
        $form.setAttribute('id', selector.substr(1));
        $form.setAttribute('name', selector.substr(1));
      }

      $form.setAttribute('method', 'post');
      $form.setAttribute('enctype', 'multipart/form-data');
      $form.setAttribute('novalidate', 'true');
      $form.setAttribute('action', app.data('unicorn.uri')['full']);
      $form.setAttribute('style', 'display: none;');

      const csrf = document.createElement('input');
      csrf.setAttribute('type', 'hidden');
      csrf.setAttribute('name', app.data('csrf-token'));
      csrf.setAttribute('value', '1');

      $form.appendChild(csrf);
      document.body.appendChild($form);
    }

    options = Object.assign({}, defaultOptions, options);

    this.element = $form;
    this.options = options;

    this.bindEvents();
  }

  bindEvents() {
    // if (this.form.attr('data-toolbar')) {
    //   $(this.form.attr('data-toolbar')).find('*[data-action]').on('click', (e) => {
    //     this.form.trigger('unicorn.submit', e.currentTarget);
    //   });
    // }

    // this.form.on('unicorn.submit', (e, button) => {
    //   const $button = $(button);
    //   const action = $button.attr('data-action');
    //   const target = $button.attr('data-target') || null;
    //   const query = $button.data('query') || {};
    //   query['task'] = $button.attr('data-task') || null;
    //
    //   this[action](target, query);
    // });
  }

  initComponent(store = 'form', custom = {}) {
    return this.app.loadAlpine(() => {
      Alpine.store(store, this.useState(custom));
    });
  }

  useState(custom = {}) {
    const state: Record<string, any> = {};
    Object.getOwnPropertyNames(Object.getPrototypeOf(this))
      .map(item => {
        // @ts-ignore
        return state[item] = this[item].bind(this);
      });

    return Object.assign(
      state,
      custom
    );
  }

  getElement() {
    return this.element;
  }

  submit(
    url?: Nullable<string>,
    data?: Nullable<Record<string, any>>,
    method?: Nullable<string>,
    customMethod?: Nullable<string>,
  ): boolean {
    const form = this.element!;

    if (customMethod) {
      let methodInput = form.querySelector<HTMLInputElement>('input[name="_method"]');

      if (!methodInput) {
        methodInput = document.createElement('input');
        methodInput.setAttribute('name', '_method');
        methodInput.setAttribute('type', 'hidden');
        methodInput.value = customMethod;

        form.appendChild(methodInput);
      } else {
        methodInput.value = customMethod;
      }
    }

    // Set data into form.
    if (data) {
      const flatted = UnicornFormElement.flattenObject(data);

      each(flatted, (value: any, key: string) => {
        const fieldName = UnicornFormElement.buildFieldName(key);
        this.injectInput(fieldName, value);
      });
    }

    if (url) {
      form.setAttribute('action', url);
    }

    if (method) {
      form.setAttribute('method', method);
    }

    // Use requestSubmit() to fire submit event.
    form.requestSubmit();

    return true;
  }

  injectInput(name: string, value: any) {
    let input = this.element!.querySelector<HTMLInputElement>(`input[name="${name}"]`);

    if (!input) {
      input = document.createElement('input');
      input.setAttribute('name', name);
      input.setAttribute('type', 'hidden');
      input.setAttribute('data-role', 'temp-input');

      this.element!.appendChild(input);
    }

    input.value = value;
    return input;
  }

  /**
   * Make a GET request.
   */
  get(
    url?: Nullable<string>,
    data?: Nullable<Record<string, any>>,
    customMethod?: Nullable<string>,
  ): boolean {
    return this.submit(url, data, 'GET', customMethod);
  }

  /**
   * Post form.
   */
  post(
    url?: Nullable<string>,
    data?: Nullable<Record<string, any>>,
    customMethod?: Nullable<string>,
  ) {
    customMethod = customMethod || 'POST';

    return this.submit(url, data, 'POST', customMethod);
  }

  /**
   * Make a PUT request.
   */
  put(
    url?: Nullable<string>,
    data?: Nullable<Record<string, any>>,
  ) {
    return this.post(url, data, 'PUT');
  }

  /**
   * Make a PATCH request.
   */
  patch(
    url?: Nullable<string>,
    data?: Nullable<Record<string, any>>,
  ) {
    return this.post(url, data, 'PATCH');
  }

  /**
   * Make a DELETE request.
   */
  delete(
    url?: Nullable<string>,
    data?: Nullable<Record<string, any>>,
  ) {
    return this.post(url, data, 'DELETE');
  }

  /**
   * @see https://stackoverflow.com/a/53739792
   *
   * @param {Object} ob
   * @returns {Object}
   */
  static flattenObject(ob: Record<string, any>): Record<string, any> {
    const toReturn: Record<string, any> = {};

    for (let i in ob) {
      if (!ob.hasOwnProperty(i)) {
        continue;
      }

      if ((typeof ob[i]) === 'object' && ob[i] != null) {
        const flatObject = this.flattenObject(ob[i]);

        for (let x in flatObject) {
          if (!flatObject.hasOwnProperty(x)) {
            continue;
          }

          toReturn[i + '/' + x] = flatObject[x];
        }
      } else {
        toReturn[i] = ob[i];
      }
    }
    return toReturn;
  }

  static buildFieldName(field: string) {
    const names = field.split('/');

    const first = names.shift();

    return first + names.map(name => `[${name}]`).join('');
  }
}
