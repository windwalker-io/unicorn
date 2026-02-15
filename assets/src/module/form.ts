import { data } from '../data';
import { loadAlpine, useSystemUri } from '../service';
import type { Nullable } from '../types';

export class UnicornFormElement {
  element: HTMLFormElement | undefined;
  options: Record<string, any>;

  constructor(
    selector?: string | Element,
    element?: HTMLFormElement,
    options: Record<string, any> = {},
  ) {
    // If form not found, create one
    if (!element) {
      element = document.createElement('form');

      if (typeof selector === 'string' && selector.startsWith('#')) {
        element.setAttribute('id', selector.substring(1));
        element.setAttribute('name', selector.substring(1));
      }

      element.setAttribute('method', 'post');
      element.setAttribute('enctype', 'multipart/form-data');
      element.setAttribute('novalidate', 'true');
      element.setAttribute('action', useSystemUri('full'));
      element.setAttribute('style', 'display: none;');

      const csrf = document.createElement('input');
      csrf.setAttribute('type', 'hidden');
      csrf.setAttribute('name', 'anticsrf');
      csrf.setAttribute('value', data('csrf-token'));

      element.appendChild(csrf);
      document.body.appendChild(element);
    }

    this.element = element;
    this.options = { ...options };
  }

  initComponent(store = 'form', custom = {}) {
    return loadAlpine((Alpine) => {
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

      for (const key in flatted) {
        const value = flatted[key];

        const fieldName = UnicornFormElement.buildFieldName(key);
        this.injectInput(fieldName, value);
      }
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

  destroy() {
    if (this.element) {
      this.element.remove();
      this.element = undefined;
    }
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
