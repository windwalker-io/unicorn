
import { EventAwareInterface, EventMixin } from '@/events';
import { forceArray } from '@/modules';
import { Constructor, UnicornPlugin } from '@/types';
import { Mixin } from 'ts-mixer';

export default class UnicornApp extends Mixin(EventMixin) implements EventAwareInterface {
  registry = new Map();
  plugins = new Map();
  // _listeners = {};
  waits: Promise<any>[] = [];
  options: Record<string, any>;
  defaultOptions: Record<string, any> = {};

  constructor(options = {}) {
    super();
    this.options = Object.assign({}, this.defaultOptions, options);

    // Wait dom ready
    if (typeof document !== 'undefined') {
      this.wait((resolve: Function) => {
        document.addEventListener('DOMContentLoaded', () => resolve());
      });

      // Ready
      document.addEventListener('DOMContentLoaded', () => {
        this.completed().then(() => this.trigger('loaded'));
      });
    }
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

    this.plugins.set(plugin, plugin);

    return this;
  }

  detach(plugin: any) {
    if (plugin.uninstall) {
      plugin.uninstall(this);
    }

    this.trigger('plugin.uninstalled', plugin);

    return this;
  }

  inject<T>(plugin: Constructor<T> | string): T;
  inject<T>(plugin: Constructor<T> | string, def: any): T | typeof def;
  inject<T>(plugin: Constructor<T> | string, def?: any): any {
    if (!typeof this.registry.has(plugin)) {
      if (def !== undefined) {
        return def;
      }

      throw new Error(`Injectable: ${(plugin as any).name} not found.`);
    }

    return this.registry.get(plugin);
  }

  provide(id: string | Constructor<any>, value: any) {
    this.registry.set(id, value);

    return this;
  }

  // trigger(event, ...args) {
  //   return this.tap(super.trigger(event, ...args), () => {
  //     if (this.data('windwalker.debug')) {
  //       console.debug(`[Unicorn Event] ${event}`, args, this.listeners(event));
  //     }
  //   });
  // }

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
