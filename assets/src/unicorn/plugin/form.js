/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */
import { defData } from '../utilities.js';
import { Plugin } from '../plugin.js';
import { each } from 'lodash-es';

export default class UnicornForm extends Plugin {
  static get is() {
    return 'form';
  }

  static get proxies() {
    return {
      form: 'getInstance'
    };
  }

  getInstance(ele, options = {}) {
    const selector = typeof ele === 'string' ? ele : null;
    ele = this.app.$(ele);

    return defData(
      ele,
      'form.plugin',
      () => new UnicornFormElement(selector, ele, options, this.app)
    );
  }

  /**
   * Default options.
   * @returns {Object}
   */
  static get defaultOptions() {
    return {};
  }
}

class UnicornFormElement {
  /**
   * Constructor.
   * @param {string}      selector
   * @param {HTMLElement} $form
   * @param {Object}      options
   * @param {UnicornCore} unicorn
   */
  constructor(selector, $form, options, unicorn) {
    // If form not found, create one
    if (!$form) {
      $form = document.createElement('form');

      if (selector.indexOf('#') === 0) {
        $form.setAttribute('id', selector.substr(1));
        $form.setAttribute('name', selector.substr(1));
      }

      $form.setAttribute('action', 'post');
      $form.setAttribute('enctype', 'multipart/form-data');
      $form.setAttribute('novalidate', 'true');
      $form.setAttribute('action', unicorn.data('unicorn.uri')['full']);
      $form.setAttribute('display', 'none');

      const csrf = document.createElement('input');
      csrf.setAttribute('name', unicorn.data('csrf-token'));

      $form.appendChild(csrf);
      document.body.appendChild($form);
    }

    options = Object.assign( {}, this.constructor.defaultOptions, options);

    this.form = $form;
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
    const form = this.form;

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
      let input;

      const flatted = this.constructor.flattenObject(queries);

      each(flatted, (value, key) => {
        const fieldName = this.constructor.buildFieldName(key);
        input = form.find('input[name="' + fieldName + '"]');

        if (!input.length) {
          input = document.createElement('input');
          input.setAttribute('name', fieldName);
          input.setAttribute('type', 'hidden');

          form.appendChild(input);
        }

        input.value = value;
      });
    }

    if (url) {
      form.setAttribute('action', url);
    }

    if (method) {
      form.setAttribute('method', method);
    }

    form.submit();

    return true;
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
