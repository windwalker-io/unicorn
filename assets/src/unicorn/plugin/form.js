
import { defData } from '../utilities.js';
import { each } from 'lodash-es';

export default class UnicornForm {
  static get is() {
    return 'form';
  }

  static install(app, options = {}) {
    app.form = (ele = null, options = {}) => {
      if (ele == null) {
        return new UnicornFormElement(null, null, options, app);
      }

      const selector = typeof ele === 'string' ? ele : null;
      ele = app.selectOne(ele);

      if (!ele) {
        throw new Error(`Form element of: ${selector} not found.`);
      }

      return defData(
        ele,
        'form.plugin',
        () => new UnicornFormElement(selector, ele, options, app)
      );
    };
  }
}

export class UnicornFormElement {
  /**
   * Constructor.
   * @param {?string}      selector
   * @param {HTMLElement} $form
   * @param {Object}      options
   * @param {UnicornApp}  app
   */
  constructor(selector = null, $form = null, options, app) {
    this.app = app;

    // If form not found, create one
    if (!$form) {
      $form = document.createElement('form');

      if (selector && selector.indexOf('#') === 0) {
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

    options = Object.assign( {}, this.constructor.defaultOptions, options);

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
    const state = {};
    Object.getOwnPropertyNames(Object.getPrototypeOf(this))
      .map(item => state[item] = this[item].bind(this));

    return Object.assign(
      state,
      custom
    );
  }

  getElement() {
    return this.element;
  }

  /**
   * Make a request.
   *
   * @param  {?string} url
   * @param  {?Object} data
   * @param  {?string} method
   * @param  {?string} customMethod
   *
   * @returns {boolean}
   */
  submit(url = null, data = null, method = null, customMethod = null) {
    const form = this.element;

    if (customMethod) {
      let methodInput = form.querySelector('input[name="_method"]');

      if (!methodInput) {
        methodInput = document.createElement('input');
        methodInput.setAttribute('name', '_method');
        methodInput.setAttribute('type', 'hidden');

        form.appendChild(methodInput);
      }

      methodInput.value = customMethod;
    }

    // Set data into form.
    if (data) {
      const flatted = this.constructor.flattenObject(data);

      each(flatted, (value, key) => {
        const fieldName = this.constructor.buildFieldName(key);
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

  injectInput(name, value) {
    let input = this.element.querySelector(`input[name="${name}"]`);

    if (!input) {
      input = document.createElement('input');
      input.setAttribute('name', name);
      input.setAttribute('type', 'hidden');
      input.setAttribute('data-role', 'temp-input');

      this.element.appendChild(input);
    }

    input.value = value;
    return input;
  }

  /**
   * Make a GET request.
   *
   * @param  {?string} url
   * @param  {?Object} data
   * @param  {?string} customMethod
   *
   * @returns {boolean}
   */
  get(url = null, data = null, customMethod = null) {
    return this.submit(url, data, 'GET', customMethod);
  }

  /**
   * Post form.
   *
   * @param  {?string} url
   * @param  {?Object} data
   * @param  {?string} customMethod
   *
   * @returns {boolean}
   */
  post(url = null, data = null, customMethod = null) {
    customMethod = customMethod || 'POST';

    return this.submit(url, data, 'POST', customMethod);
  }

  /**
   * Make a PUT request.
   *
   * @param  {?string} url
   * @param  {?Object} data
   *
   * @returns {boolean}
   */
  put(url = null, data = null) {
    return this.post(url, data, 'PUT');
  }

  /**
   * Make a PATCH request.
   *
   * @param  {?string} url
   * @param  {?Object} data
   *
   * @returns {boolean}
   */
  patch(url = null, data = null) {
    return this.post(url, data, 'PATCH');
  }

  /**
   * Make a DELETE request.
   *
   * @param  {?string} url
   * @param  {?Object} data
   *
   * @returns {boolean}
   */
  delete(url = null, data = null) {
    return this.post(url, data, 'DELETE');
  }

  /**
   * @see https://stackoverflow.com/a/53739792
   *
   * @param {Object} ob
   * @returns {Object}
   */
  static flattenObject(ob) {
    const toReturn = {};

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

  static buildFieldName(field) {
    const names = field.split('/');

    const first = names.shift();

    return first + names.map(name => `[${name}]`).join('');
  }
}
