
import { Mixin } from 'ts-mixer';
import { data } from './data';
import { EventAwareInterface, EventMixin } from './events';
import { domready } from './service';
import { Constructor, UnicornPlugin } from './types';

export type InjectionKey<T = any> = string | symbol | Constructor<T>;

export interface UnicornApp extends EventAwareInterface {}

export class UnicornApp extends Mixin(EventMixin) implements EventAwareInterface {
  registry = new Map();
  plugins = new Map();
  // _listeners = {};
  waits: Promise<any>[] = [];
  options: Record<string, any>;
  defaultOptions: Record<string, any> = {};
  domready = domready;
  data = data;

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

  inject<T>(id: InjectionKey<T>): T;
  inject<T>(id: InjectionKey<T>, def: T): T;
  inject<T>(id: InjectionKey<T>, def?: T): T;
  inject<T>(id: InjectionKey<T>, def?: T): T | undefined {
    if (!this.registry.has(id)) {
      if (def !== undefined) {
        return def;
      }

      throw new Error(`Injectable: ${(id as any).name} not found.`);
    }

    return this.registry.get(id);
  }

  provide<T>(id: InjectionKey<T>, value: any) {
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

  macro(name: string, prop: any) {
    if ((this as any)[name]) {
      throw new Error(`Macro: ${name} already exists.`);
    }

    (this as any)[name] = prop;

    return this;
  }
}
