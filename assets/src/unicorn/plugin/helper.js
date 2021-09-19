/**
 * Part of unicorn project.
 *
 * @copyright  Copyright (C) 2018 ${ORGANIZATION}.
 * @license    __LICENSE__
 */

import { defaultsDeep } from 'lodash-es';
import { prepareData } from './../utilities.js';
import 'sprintf-js';

export default class UnicornHelper {
  static get is() { return 'helper'; }

  static install(app, options = {}) {
    const helper = app.$helper = new this(app);

    app.selectOne = helper.selectOne.bind(helper);
    app.selectAll = helper.selectAll.bind(helper);
    app.getBoundedInstance = helper.getBoundedInstance.bind(helper);
    app.h = helper.h;
    app.html = helper.html;
    app.$get = helper.$get;
    app.$set = helper.$set;
    app.isDebug = helper.isDebug.bind(helper);
    app.confirm = helper.confirm.bind(helper);
    app.isNullDate = helper.isNullDate.bind(helper);
    app.getNullDate = helper.getNullDate.bind(helper);
    app.numberFormat = helper.numberFormat;
    app.sprintf = sprintf;
    app.vsprintf = vsprintf;
    app.defaultsDeep = helper.defaultsDeep;
  }

  constructor(app) {
    this.app = app;
  }

  selectOne(ele) {
   if (typeof ele === 'string') {
     ele = document.querySelector(ele);
   }

   return prepareData(ele);
  }

  selectAll(ele, callback) {
    if (typeof ele === 'string') {
      ele = document.querySelectorAll(ele);
    }

    const resultSet = [].slice.call(ele);

    if (callback) {
      return resultSet.map(callback);
    }

    return resultSet;
  }

  getBoundedInstance(selector, name, callback = () => null) {
    const element = this.selectOne(selector);

    if (!element) {
      return null;
    }

    return element.__unicorn[name] = element.__unicorn[name] || callback(element);
  }

  h(element, attrs = {}, content = null) {
    const ele = document.createElement(element);

    for (let i in attrs) {
      const v = attrs[i];

      ele.setAttribute(i, v);
    }

    if (content !== null) {
      ele.innerHTML = content;
    }

    return ele;
  }

  html(text) {
    const div = document.createElement('div');
    div.innerHTML = text;
    return div.children[0];
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

      if (!obj.hasOwnProperty(key)) {
        obj[key] = {};
      }

      obj = obj[key];
    }

    obj[keys[i]] = value;

    return value;
  }

  isDebug() {
    return Boolean(this.app.data('windwalker.debug'));
  }

  /**
   * Confirm popup.
   *
   * @param {string}   message
   *
   * @return {Promise}
   */
  confirm(message) {
    message = message || 'Are you sure?';

    return new Promise((resolve) => {
      resolve(confirm(message));
    });
  }

  // loadScript(urls, autoConvert = true) {
  //   if (typeof urls === 'string') {
  //     urls = [urls];
  //   }
  //
  //   const promises = [];
  //   const data = {};
  //   const endsWith = (str, suffix) => str.indexOf(suffix, str.length - suffix.length) >= 0;
  //   data[this.app.asset('version')] = '1';
  //
  //   urls.forEach(url => {
  //     const ext = url.split('.').pop();
  //     let loadUri = url;
  //
  //     if (autoConvert) {
  //       let assetFile, assetMinFile;
  //
  //       if (endsWith(url, '.min.' + ext)) {
  //         assetMinFile = url;
  //         assetFile = url.slice(0, -`.min.${ext}`.length) + '.' + ext;
  //       } else {
  //         assetFile = url;
  //         assetMinFile = url.slice(0, -`.${ext}`.length) + '.min.' + ext;
  //       }
  //
  //       loadUri = this.app.data('windwalker.debug') ? assetFile : assetMinFile;
  //     }
  //
  //     promises.push(
  //       $.getScript({
  //         url: this.addUriBase(loadUri),
  //         cache: true,
  //         data
  //       })
  //     );
  //   });
  //
  //   return $.when(...promises);
  // }

  addUriBase(uri, type = 'path') {
    if (uri.substr(0, 2) === '/\/' || uri.substr(0, 4) === 'http') {
      return uri;
    }

    return this.app.asset(type) + '/' + uri;
  }

  /**
   * Notify information.
   * @param {string|Array} message
   * @param {string}       type
   * @returns {*}
   */
  // notify(message, type = 'info') {
  //   return this.app.addMessage(message, type);
  // }

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
    return this.app.data('unicorn.date')['empty'];
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

  defaultsDeep(...args) {
    return defaultsDeep(...args);
  }
}