
import { type EventAwareInterface, EventMixin } from './events';
import { mix } from './mixwith';
import { defaultsDeep } from 'lodash-es';
import type { UnicornPlugin } from './types/base';
import { getData, defData, setData, removeData } from './utilities';

const defaultOptions: Record<string, any> = {};

class UnicornApp extends mix(class {}).with(EventMixin) {
  plugins = {};
  // _listeners = {};
  waits: Promise<any>[] = [];
  options: Record<string, any>;

  constructor(options = {}) {
    super();
    this.options = defaultsDeep({}, options, defaultOptions);

    // Wait dom ready
    this.wait((resolve: Function) => {
      document.addEventListener('DOMContentLoaded', () => resolve());
    });

    // Ready
    document.addEventListener('DOMContentLoaded', () => {
      this.completed().then(() => this.trigger('loaded'));
    });
  }

  use(plugin: UnicornPlugin, options: Record<string, any> = {}) {
    if (Array.isArray(plugin)) {
      plugin.forEach(p => this.use(p));
      return this;
    }

    // if (plugin.is === undefined) {
    //   throw new Error(`Plugin: ${plugin.name} must instance of : ${Plugin.name}`);
    // }

    plugin?.install?.(this, options);

    this.trigger('plugin.installed', plugin);

    return this;
  }

  inject<T>(plugin: string): T {
    if (typeof this[plugin] === undefined) {
      throw new Error(`Plugin: ${plugin} not found.`);
    }

    return this[plugin] as T;
  }

  detach(plugin: any) {
    if (plugin.uninstall) {
      plugin.uninstall(this);
    }

    this.trigger('plugin.uninstalled', plugin);

    return this;
  }

  tap<T>(value: T, callback: Function): T {
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

  data(name: string, data: any): any;
  data(name: string): any;
  data(ele: Element, name: string): any;
  data(ele: Element, name: string, data?: any): any;
  data(ele: Element | string, name: any = undefined, value: any = undefined) {
    if (!(ele instanceof HTMLElement)) {
      value = name;
      name = ele;
      ele = document as any as Element;
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

  removeData(name: string): any;
  removeData(ele: Element, name: string): any;
  removeData(ele: Element|string, name: any = undefined) {
    if (!(ele instanceof HTMLElement)) {
      name = ele;
      ele = document as any as Element;
    }

    removeData(ele, name);

    return this;
  }

  uri(type: string) {
    return this.data('unicorn.uri')[type];
  }

  asset(type: string) {
    return this.uri('asset')[type];
  }

  wait(callback: Function): Promise<any> {
    const p = new Promise((resolve, reject) => {
      const promise = callback(resolve, reject);

      if (promise && 'then' in promise) {
        promise.then(resolve).catch(reject);
      }
    });

    this.waits.push(p);

    return p;
  }

  completed(): Promise<any[]> {
    const promise = Promise.all(this.waits);

    this.waits = [];

    return promise;
  }
}

interface UnicornApp extends EventAwareInterface {
  //
}

export default UnicornApp;
