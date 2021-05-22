/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

export default class UnicornLang {
  keys = {};

  static get is() { return 'lang'; }

  static install(app, options = {}) {
    const $lang = app.$lang = new this(app);

    app.__ = $lang.__.bind($lang);
  }

  constructor(app) {
    this.app = app;
  }

  __(text, ...args) {
    return this.trans(text, ...args);
  }

  /**
   * Translate a string.
   *
   * @param {string} text
   * @param {Array}  args
   * @returns {string}
   */
  trans(text, ...args) {
    const key = this.normalize(text);

    if (args.length) {
      return this.sprintf(text, ...args);
    }

    const translated = this.find(key);

    return translated !== null ? translated : this.wrapDebug(text, false);
  }

  /**
   * Sptintf language string.
   * @param {string} text
   * @param {Array} args
   */
  sprintf(text, ...args) {
    return this.app.vsprintf(this.find(text), args);
  }

  /**
   * Find text.
   * @param {string} key
   * @returns {*}
   */
  find(key) {
    const langs = this.app.data('unicorn.languages') || {};

    if (langs[key]) {
      return langs[key];
    }

    return null;
  }

  /**
   * Has language key.
   * @param {string} key
   * @returns {boolean}
   */
  has(key) {
    const langs = this.app.data('unicorn.languages');

    return langs[key] !== undefined;
  }

  /**
   * Add language key.
   *
   * @param {string} key
   * @param {string} value
   *
   * @return {this}
   */
  add(key, value) {
    const data = this.app.data('unicorn.languages') || {};

    data[this.normalize(key)] = value;

    this.app.data('unicorn.languages', data);

    return this;
  }

  /**
   * Replace all symbols to dot(.).
   *
   * @param {string} text
   *
   * @return {string}
   */
  normalize(text) {
    return text.replace(/[^A-Z0-9]+/ig, '.');
  }

  wrapDebug(text, success) {
    if (this.app.isDebug()) {
      if (success) {
        return '**' + text + '**';
      }

      return '??' + text + '??';
    }

    return text;
  }
}
