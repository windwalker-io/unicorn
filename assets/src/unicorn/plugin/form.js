/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

import { defData } from '../utilities.js';
import { each } from 'lodash-es';

export default class UnicornForm {
  static get is() {
    return 'form';
  }

  static install(app, options = {}) {
    app.form = (ele, options = {}) => {
      const selector = typeof ele === 'string' ? ele : null;
      ele = app.selectOne(ele);

      return defData(
        ele,
        'form.plugin',
        () => new UnicornFormElement(selector, ele, options, app)
      );
    };
  }
}

class UnicornFormElement {
  /**
   * Constructor.
   * @param {string}      selector
   * @param {HTMLElement} $form
   * @param {Object}      options
   * @param {UnicornApp}  app
   */
  constructor(selector, $form, options, app) {
    this.app = app;

    // If form not found, create one
    if (!$form) {
      $form = document.createElement('form');

      if (selector.indexOf('#') === 0) {
        $form.setAttribute('id', selector.substr(1));
        $form.setAttribute('name', selector.substr(1));
      }

      $form.setAttribute('method', 'post');
      $form.setAttribute('enctype', 'multipart/form-data');
      $form.setAttribute('novalidate', 'true');
      $form.setAttribute('action', app.data('unicorn.uri')['full']);
      $form.setAttribute('display', 'none');

      const csrf = document.createElement('input');
      csrf.setAttribute('name', app.data('csrf-token'));

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
   * @param  {string} url
   * @param  {Object} queries
   * @param  {string} method
   * @param  {string} customMethod
   *
   * @returns {boolean}
   */
  submit(url, queries, method, customMethod) {
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

    // Set queries into form.
    if (queries) {
      const flatted = this.constructor.flattenObject(queries);

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

    // Create a submit button that can fire `submit` event
    let submitButton = form.querySelector(`button[type=submit][data-submit]`);

    if (!submitButton) {
      submitButton = this.app.h('button', { type: 'submit' }, 'GO');
      submitButton.dataset.submit = true;
      submitButton.style.display = 'none';
      form.appendChild(submitButton);
    }

    submitButton.click();

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
   * @param  {string} url
   * @param  {Object} queries
   * @param  {string} customMethod
   *
   * @returns {boolean}
   */
  get(url, queries, customMethod) {
    return this.submit(url, queries, 'GET', customMethod);
  }

  /**
   * Post form.
   *
   * @param  {string} url
   * @param  {Object} queries
   * @param  {string} customMethod
   *
   * @returns {boolean}
   */
  post(url, queries, customMethod) {
    customMethod = customMethod || 'POST';

    return this.submit(url, queries, 'POST', customMethod);
  }

  /**
   * Make a PUT request.
   *
   * @param  {string} url
   * @param  {Object} queries
   *
   * @returns {boolean}
   */
  put(url, queries) {
    return this.post(url, queries, 'PUT');
  }

  /**
   * Make a PATCH request.
   *
   * @param  {string} url
   * @param  {Object} queries
   *
   * @returns {boolean}
   */
  patch(url, queries) {
    return this.post(url, queries, 'PATCH');
  }

  /**
   * Make a DELETE request.
   *
   * @param  {string} url
   * @param  {Object} queries
   *
   * @returns {boolean}
   */
  delete(url, queries) {
    return this.post(url, queries, 'DELETE');
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
