
import { EventAwareInterface, EventMixin } from '@/unicorn/events';
import { forceArray } from '@/unicorn/modules';
import { Constructor, UnicornPlugin } from '@/unicorn/types';
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

  provide(id: string, value: any) {
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

  doImport(src: string) {
    // @ts-ignore
    return import(src);
  }

  import(...src: any[]): Promise<any|any[]> {
    if (src.length === 1) {
      return this.doImport(src[0]);
    }

    const promises: Promise<any>[] = [];

    src.forEach((link) => {
      promises.push(
        link instanceof Promise ? link : this.doImport(link)
      );
    });

    return Promise.all(promises);
  }

  async importSeries(...src: any): Promise<any|any[]> {
    const modules: any[] = [];

    for (const source of src) {
      const m = await this.import(...forceArray(source));

      modules.push(m);
    }

    return modules;
  }

  async importCSS(...src: any): Promise<any|any[]> {
    let modules: any = await this.import(...src);

    modules = forceArray(modules);

    const styles: CSSStyleSheet[] = (modules as any[]).map(module => module.default);

    document.adoptedStyleSheets = [...document.adoptedStyleSheets, ...styles];
  }
}
