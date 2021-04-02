/**
 * Part of unicorn project.
 *
 * @copyright  Copyright (C) 2018 ${ORGANIZATION}.
 * @license    __LICENSE__
 */

import { Plugin } from './plugin.js';

class UnicornHelper extends Plugin {
  static get is() { return 'Helper'; }

  static get proxies() {
    return {
      $get: 'get',
      $set: 'set',
      isDebug: 'isDebug',
      confirm: 'confirm',
      keepAlive: 'keepAlive',
      stopKeepAlive: 'stopKeepAlive',
      isNullDate: 'isNullDate',
      getNullDate: 'getNullDate',
      loadScript: 'loadScript',
      notify: 'notify',
      numberFormat: 'numberFormat',
      sprintf: 'sprintf',
      vsprintf: 'vsprintf',
    };
  }

  static get defaultOptions() {
    return {}
  }

  constructor() {
    super();

    this.aliveHandle = null;
  }

  get(obj, path) {
    const keys = Array.isArray(path) ? path : path.split('.');

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (!obj || !obj.hasOwnProperty(key)) {
        obj = undefined;
        break;
      }

      obj = obj[key];
    }

    return obj;
  }

  set(obj, path, value) {
    const keys = Array.isArray(path) ? path : path.split('.');
    let i;

    for (i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      console.log(obj.hasOwnProperty(key), key);
      if (!obj.hasOwnProperty(key)) {
        obj[key] = {};
      }

      obj = obj[key];
    }

    obj[keys[i]] = value;

    return value;
  }

  isDebug() {
    return Boolean(this.unicorn.data('windwalker.debug'));
  }

  /**
   * Confirm popup.
   *
   * @param {string}   message
   * @param {Function} callback
   * @param {Function} falseCallback
   */
  confirm(message, callback, falseCallback = null) {
    message = message || 'Are you sure?';

    const d = $.Deferred();
    const when = $.when(d);

    if (callback) {
      when.done(callback);
    }

    if (falseCallback) {
      when.catch(callback);
    }

    const confirmed = confirm(message);

    if (confirmed) {
      d.resolve(confirmed);
    } else {
      d.reject(confirmed);
    }

    return when;
  }

  loadScript(urls, autoConvert = true) {
    if (typeof urls === 'string') {
      urls = [urls];
    }

    const promises = [];
    const data = {};
    const endsWith = (str, suffix) => str.indexOf(suffix, str.length - suffix.length) >= 0;
    data[this.unicorn.asset('version')] = '1';

    urls.forEach(url => {
      const ext = url.split('.').pop();
      let loadUri = url;

      if (autoConvert) {
        let assetFile, assetMinFile;

        if (endsWith(url, '.min.' + ext)) {
          assetMinFile = url;
          assetFile = url.slice(0, -`.min.${ext}`.length) + '.' + ext;
        } else {
          assetFile = url;
          assetMinFile = url.slice(0, -`.${ext}`.length) + '.min.' + ext;
        }

        loadUri = this.unicorn.data('windwalker.debug') ? assetFile : assetMinFile;
      }

      promises.push(
        $.getScript({
          url: this.addUriBase(loadUri),
          cache: true,
          data
        })
      );
    });

    return $.when(...promises);
  }

  addUriBase(uri, type = 'path') {
    if (uri.substr(0, 2) === '//' || uri.substr(0, 4) === 'http') {
      return uri;
    }

    return this.unicorn.asset(type) + '/' + uri;
  }

  /**
   * Notify information.
   * @param {string|Array} message
   * @param {string}       type
   * @returns {*}
   */
  notify(message, type = 'info') {
    return this.unicorn.addMessage(message, type);
  }

  /**
   * Keep alive.
   *
   * @param {string} url
   * @param {Number} time
   *
   * @return {number}
   */
  keepAlive(url, time = 60000) {
    return this.aliveHandle = window.setInterval(() => $.get(url), time);
  }

  /**
   * Stop keep alive
   */
  stopKeepAlive() {
    clearInterval(this.aliveHandle);

    this.aliveHandle =  null;

    return this;
  }

  /**
   * Is NULL date from default SQL.
   *
   * @param {string} date
   */
  isNullDate(date) {
    return ['0000-00-00 00:00:00', this.getNullDate()].indexOf(date) !== -1;
  }

  /**
   * Get NULL date from default SQL.
   *
   * @returns {string}
   */
  getNullDate() {
    return this.unicorn.data('unicorn.date')['empty'];
  }

  /**
   * Number format like php function.
   *
   * @param {string|number} number
   * @param {number}        decimals
   * @param {string}        decPoint
   * @param {string}        thousandsSep
   * @returns {string}
   */
  numberFormat(number, decimals = 0, decPoint = '.', thousandsSep = ',') {
    decimals = decimals || 0;
    number = parseFloat(number);

    let roundedNumber = Math.round(Math.abs(number) * ('1e' + decimals)) + '';
    let numbersString = decimals ? roundedNumber.slice(0, decimals * -1) : roundedNumber;
    let decimalsString = decimals ? roundedNumber.slice(decimals * -1) : '';
    let formattedNumber = "";

    while (numbersString.length > 3) {
      formattedNumber += thousandsSep + numbersString.slice(-3);
      numbersString = numbersString.slice(0, -3);
    }

    return (number < 0 ? '-' : '') + numbersString + formattedNumber + (decimalsString ? (decPoint + decimalsString) : '');
  }
}
