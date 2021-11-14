/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

import { EventMixin } from './events.js';
import { mix } from './mixwith.js';
import { defaultsDeep } from 'lodash-es';
import { getData, defData, setData, removeData } from './utilities.js';

export default class UnicornApp extends mix(class {}).with(EventMixin) {
  plugins = {};
  _listeners = {};
  waits = [];

  /**
   * Default options.
   * @returns {Object}
   */
  static get defaultOptions() {
    return {};
  }

  constructor(options = {}) {
    super();
    this.options = defaultsDeep({}, options, this.constructor.defaultOptions);

    // Wait dom ready
    this.wait((resolve) => {
      document.addEventListener('DOMContentLoaded', resolve);
    });

    // Ready
    document.addEventListener('DOMContentLoaded', () => {
      this.completed().then(() => this.trigger('loaded'));
    });
  }

  use(plugin, options = {}) {
    if (Array.isArray(plugin)) {
      plugin.forEach(p => this.use(p));
      return this;
    }

    // if (plugin.is === undefined) {
    //   throw new Error(`Plugin: ${plugin.name} must instance of : ${Plugin.name}`);
    // }

    plugin.install(this, options);

    this.trigger('plugin.installed', plugin);

    return this;
  }

  detach(plugin) {
    if (plugin.uninstall) {
      plugin.uninstall(this);
    }

    this.trigger('plugin.uninstalled', plugin);

    return this;
  }

  tap(value, callback) {
    callback(value);

    return value;
  }

  // trigger(event, ...args) {
  //   return this.tap(super.trigger(event, ...args), () => {
  //     if (this.data('windwalker.debug')) {
  //       console.debug(`[Unicorn Event] ${event}`, args, this.listeners(event));
  //     }
  //   });
  // }

  data(ele, name = undefined, value = undefined) {
    if (!(ele instanceof HTMLElement)) {
      value = name;
      name = ele;
      ele = document;
    }

    this.trigger('unicorn.data', name, value);

    if (name === undefined) {
      return getData(ele);
    }

    if (value === undefined) {
      const res = getData(ele, name);

      this.trigger('unicorn.data.get', name, res);

      return res;
    }

    setData(ele, name, value);

    this.trigger('unicorn.data.set', name, value);

    return this;
  }

  removeData(ele, name) {
    if (!(ele instanceof HTMLElement)) {
      name = ele;
      ele = document;
    }

    removeData(ele, name);

    return this;
  }

  uri(type) {
    return this.data('unicorn.uri')[type];
  }

  asset(type) {
    return this.uri('asset')[type];
  }

  wait(callback) {
    const p = new Promise((resolve, reject) => {
      const promise = callback(resolve, reject);

      if (promise && 'then' in promise) {
        promise.then(resolve).catch(reject);
      }
    });

    this.waits.push(p);

    return p;
  }

  completed() {
    const promise = Promise.all(this.waits);

    this.waits = [];

    return promise;
  }
}
