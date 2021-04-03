/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

import { EventMixin } from './events.js';
import { mix } from './mixwith.js';
import { merge } from 'lodash-es';
import { installFor, Plugin } from './plugin.js';

export default class UnicornCore extends mix(class {}).with(EventMixin) {
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
    this.options = merge({}, this.constructor.defaultOptions, options);

    // Wait dom ready
    this.wait((resolve) => {
      document.addEventListener('DOMContentLoaded', resolve);
    });

    // Ready
    document.addEventListener('DOMContentLoaded', () => {
      this.completed().then(() => this.trigger('loaded'));
    });
  }

  use(plugin) {
    return installFor(plugin, this);
  }

  detach(plugin) {
    if (!(plugin instanceof Plugin)) {
      throw new Error(`Plugin must instance of : ${Plugin.name}`);
    }

    plugin.uninstall(this);

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

  data(name, value) {
    this.trigger('unicorn.data', name, value);

    document.__unicorn = document.__unicorn || {};

    if (value === undefined) {
      const res = document.__unicorn[name];

      this.trigger('unicorn.data.get', name, res);

      return res;
    }

    document.__unicorn[name] = value;

    this.trigger('unicorn.data.set', name, value);

    return this;
  }

  removeData(name) {
    document.__unicorn = document.__unicorn || {};

    delete document.__unicorn[name];

    $(document).removeData(name);

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
