import type { Unicorn } from '@/index';
import { defaultsDeep, each } from 'lodash-es';
import 'sprintf-js';
import { defData, prepareData } from './../utilities';

const domReady = null;
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export default class UnicornHelper {
  static get is() {
    return 'helper';
  }

  static install(app: Unicorn, options = {}) {
    const helper = app.$helper = new this(app);

    app.domready = helper.domready.bind(helper);
    app.selectOne = helper.selectOne.bind(helper);
    app.selectAll = helper.selectAll.bind(helper);
    app.each = helper.selectAll.bind(helper);
    app.getBoundedInstance = helper.getBoundedInstance.bind(helper);
    app.getBoundedInstanceList = helper.getBoundedInstanceList.bind(helper);
    app.module = helper.module.bind(helper);
    app.h = helper.h;
    app.html = helper.html;
    app.$get = helper.get;
    app.$set = helper.set;
    app.delegate = helper.delegate.bind(helper);
    app.debounce = helper.debounce.bind(helper);
    app.throttle = helper.throttle.bind(helper);
    app.isDebug = helper.isDebug.bind(helper);
    app.confirm = helper.confirm.bind(helper);
    app.alert = helper.alert.bind(helper);
    app.numberFormat = helper.numberFormat;
    app.sprintf = sprintf;
    app.vsprintf = vsprintf;
    app.genRandomString = helper.genRandomString;
    app.defaultsDeep = helper.defaultsDeep;
  }

  constructor(protected app: Unicorn) {
    //
  }

  /**
   * @see https://stackoverflow.com/a/9899701
   */
  domready(callback: ((value: any) => void) | undefined = undefined): Promise<void> {
    let promise: Promise<void> = domReady || new Promise<void>((resolve) => {
      // see if DOM is already available
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        // call on next available tick
        setTimeout(resolve, 0);
      } else {
        document.addEventListener('DOMContentLoaded', () => resolve());
      }
    });

    if (callback) {
      promise = promise.then(callback);
    }

    return promise;
  }

  selectOne<E extends Element = Element>(ele: string): E | null;
  selectOne<E extends Element = Element>(ele: E): E;
  selectOne<K extends keyof HTMLElementTagNameMap>(ele: K): HTMLElementTagNameMap[K] | null;
  selectOne<E extends Element = Element>(ele: string | E): E | null;
  selectOne(ele: string): Element;
  selectOne(ele: Element | string): Element | null {
    let r: Element | null;

    if (typeof ele === 'string') {
      r = document.querySelector(ele);
    } else {
      r = ele;
    }

    if (!r) {
      return r;
    }

    return prepareData(r);
  }

  selectAll<E extends Element = Element>(ele: string, callback?: ((ele: E) => any)): NodeListOf<E>;
  selectAll<E extends Element = Element>(ele: NodeListOf<E> | E[], callback?: ((ele: E) => any)): E[];
  selectAll<E extends Element = Element>(ele: string | NodeListOf<E> | E[], callback?: ((ele: E) => any)): E[];
  selectAll<E extends keyof HTMLElementTagNameMap>(ele: E,
                                                   callback?: ((ele: HTMLElementTagNameMap[E]) => any)): HTMLElementTagNameMap[E][];
  selectAll(ele: string, callback?: ((ele: Element) => any)): Element[];
  selectAll(ele: NodeListOf<Element> | Element[] | string,
            callback: ((el: Element) => any) | undefined = undefined): Element[] | NodeListOf<Element> {
    if (typeof ele === 'string') {
      ele = document.querySelectorAll(ele);
    }

    const resultSet: Element[] = [].slice.call(ele);

    if (callback) {
      return resultSet.map((el) => {
        return callback(el) || el;
      });
    }

    return resultSet;
  }

  each(collection: any, iteratee: (item: any, i: number | string) => void) {
    return each(collection, iteratee);
  }

  getBoundedInstance(selector: string | Element, name: string, callback: ((el: Element) => any) = () => null): any {
    const element = this.selectOne(selector);

    if (!element) {
      return null;
    }

    return defData(element, name, callback);
  }

  getBoundedInstanceList(
    selector: string | NodeListOf<Element>,
    name: string,
    callback: ((el: Element) => any) = () => null
  ) {
    return this.selectAll(selector, (ele) => {
      return this.getBoundedInstance(ele, name, callback);
    });
  }

  module(ele: string | Element | NodeListOf<Element>, name: string, callback: ((el: Element) => any) = () => null) {
    if (typeof ele === 'string') {
      return this.getBoundedInstanceList(ele, name, callback);
    }

    if (ele instanceof Element) {
      return this.getBoundedInstance(ele, name, callback);
    }

    return this.getBoundedInstanceList(ele, name, callback);
  }

  h<T extends keyof HTMLElementTagNameMap>(element: T, attrs?: Record<string, any>, content?: any): HTMLElementTagNameMap[T]
  h(element: string, attrs: Record<string, any> = {}, content: any = undefined): HTMLElement {
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

  html(html: string): Element {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.children[0];
  }

  get(obj: Record<string, any>, path: string): any {
    const keys = Array.isArray(path) ? path : path.split('.');
    let data: typeof obj | undefined = obj;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (!data || !data.hasOwnProperty(key)) {
        data = undefined;
        break;
      }

      data = data[key];
    }

    return data;
  }

  set<SetValue = any>(obj: Record<string, any>, path: string, value: SetValue): SetValue {
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

  /**
   * Pure JS version of jQuery delegate()
   *
   * @see https://gist.github.com/iagobruno/4db2ed62dc40fa841bb9a5c7de92f5f8
   *
   * @param {Element|string} wrapper
   * @param {string} selector
   * @param {string} eventName
   * @param { (e: Event) => void } callback
   * @returns {(function(): void)}
   */
  delegate(wrapper: Element | string, selector: string, eventName: string, callback: (e: Event) => void) {
    if (typeof selector === 'undefined' || selector === '') {
      throw new Error('The provided selector is empty.');
    }

    if (typeof callback === 'undefined' || typeof callback !== 'function') {
      throw new Error('Please specify an callback.');
    }

    const delegationSelectorsMap: Record<string, Function[]> = {};

    const wrapperElement = this.selectOne(wrapper);

    wrapperElement?.addEventListener(eventName, function (event) {
      let element: HTMLElement | null = event.target as HTMLElement;
      let forceBreak = false;

      while (element && element !== wrapperElement) {
        for (const selector in delegationSelectorsMap) {
          if (element.matches(selector)) {
            event.stopPropagation = function () {
              forceBreak = true;
            };
            Object.defineProperty(
              event,
              'currentTarget',
              {
                get() {
                  return element;
                }
              }
            );

            const callbackList = delegationSelectorsMap[selector];

            callbackList.forEach(function (callback) {
              callback(event);
            });
          }
        }

        if (forceBreak) {
          break;
        }

        element = element.parentElement;
      }
    });

    if (!delegationSelectorsMap[selector]) {
      // Add new selector to the list
      delegationSelectorsMap[selector] = [callback];
    } else {
      delegationSelectorsMap[selector].push(callback);
    }

    return function unsubscribe() {
      if (!delegationSelectorsMap[selector]) {
        return;
      }

      if (delegationSelectorsMap[selector].length >= 2) {
        delegationSelectorsMap[selector] = delegationSelectorsMap[selector].filter(cb => cb !== callback);
      } else {
        delete delegationSelectorsMap[selector];
      }
    };
  }

  debounce(handler: Function, wait = 1) {
    let timer: number, result: any;
    return function (this: any, ...args: any[]) {
      clearTimeout(timer);
      timer = setTimeout(() => result = handler.call(this, ...args), wait);
      return result;
    };
  }

  /**
   * @param {Function} handler
   * @param {number} wait
   * @returns {Function}
   */
  throttle(handler: Function, wait = 1) {
    let timer: number | undefined, result: any;
    return function (this: any, ...args: any[]) {
      if (!timer) {
        return result = handler.call(this, ...args);
      }

      clearTimeout(timer);
      timer = setTimeout(() => timer = undefined, wait);
      return result;
    };
  }

  isDebug() {
    return Boolean(this.app.data('windwalker.debug'));
  }

  confirm(message: string): Promise<any> {
    message = message || 'Are you sure?';

    return new Promise((resolve) => {
      resolve(confirm(message));
    });
  }

  /**
   * @param {string} title
   * @param {string} text
   * @param {string} type
   * @returns {Promise<boolean>}
   */
  alert(title: string, text = '', type = 'info') {
    if (text) {
      title += ' | ' + text;
    }

    alert(title);

    return Promise.resolve(true);
  }

  nextTick(callback = () => {}) {
    return Promise.resolve().then(callback);
  }

  addUriBase(uri: string, type = 'path') {
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
  numberFormat(number: string | number, decimals = 0, decPoint = '.', thousandsSep = ',') {
    number = Number(number);

    const str = number.toFixed(decimals ? decimals : 0).toString().split('.');
    const parts = [];

    for (var i = str[0].length; i > 0; i -= 3) {
      parts.unshift(str[0].substring(Math.max(0, i - 3), i));
    }

    str[0] = parts.join(thousandsSep ? thousandsSep : ',');

    return str.join(decPoint ? decPoint : '.');
  }

  /**
   * @see https://www.programiz.com/javascript/examples/generate-random-strings
   * @param {number} length
   * @returns {string}
   */
  genRandomString(length: number): string {
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  defaultsDeep(...args: any[]) {
    return defaultsDeep(...args);
  }
}
