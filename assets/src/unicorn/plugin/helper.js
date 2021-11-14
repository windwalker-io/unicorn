/**
 * Part of unicorn project.
 *
 * @copyright  Copyright (C) 2018 ${ORGANIZATION}.
 * @license    __LICENSE__
 */

import { NodeList } from 'core-js/internals/dom-iterables';
import { defaultsDeep, each } from 'lodash-es';
import { prepareData, defData } from './../utilities.js';
import 'sprintf-js';

export default class UnicornHelper {
  static get is() { return 'helper'; }

  static install(app, options = {}) {
    const helper = app.$helper = new this(app);

    app.selectOne = helper.selectOne.bind(helper);
    app.selectAll = helper.selectAll.bind(helper);
    app.each = helper.selectAll.bind(helper);
    app.getBoundedInstance = helper.getBoundedInstance.bind(helper);
    app.getBoundedInstanceList = helper.getBoundedInstanceList.bind(helper);
    app.module = helper.module.bind(helper);
    app.h = helper.h;
    app.html = helper.html;
    app.$get = helper.$get;
    app.$set = helper.$set;
    app.isDebug = helper.isDebug.bind(helper);
    app.confirm = helper.confirm.bind(helper);
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

  each(collection, iteratee) {
    return each(collection, iteratee);
  }

  getBoundedInstance(selector, name, callback = () => null) {
    const element = this.selectOne(selector);

    if (!element) {
      return null;
    }

    return defData(element, name, callback);
  }

  getBoundedInstanceList(selector, name, callback = () => null) {
    return this.app.selectAll(selector, (ele) => {
      return this.getBoundedInstance(ele, name, callback);
    });
  }

  module(ele, name, callback = () => null) {
    if (typeof ele === 'string') {
      return this.getBoundedInstanceList(ele, name, callback);
    }

    if (ele instanceof HTMLElement) {
      return this.getBoundedInstance(ele, name, callback);
    }

    return this.getBoundedInstanceList(ele, name, callback);
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

  nextTick(callback = () => { }) {
    return Promise.resolve().then(callback);
  }

  addUriBase(uri, type = 'path') {
    if (uri.substr(0, 2) === '/\/' || uri.substr(0, 4) === 'http') {
      return uri;
    }

    return this.app.asset(type) + '/' + uri;
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
