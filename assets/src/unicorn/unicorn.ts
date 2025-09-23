import UnicornApp from '@/unicorn/app';
import { UnicornUI } from '@/unicorn/plugin/ui';
import { polyfill } from '@/unicorn/polyfill';
import { Constructor, Dictionary } from '@/unicorn/types';

export * from '@/unicorn/data';
// export * from '@/unicorn/events';

// Helpers
export * from '@/unicorn/modules';
export * from '@/unicorn/plugin';

let apps: Dictionary<UnicornApp> = {};

export function createUnicorn(name: string = 'default'): UnicornApp {
  polyfill();

  return apps[name] ??= new UnicornApp();
}

export function createUnicornWithPlugins(name: string = 'default'): UnicornApp {
  const app = createUnicorn(name);

  app.use(UnicornUI);

  // app.use(UnicornDom);

  return app;
}

export function setUnicornApp(inc: UnicornApp, name: string = 'default') {
  apps[name] = inc;
}

export function useUnicornApp(name: string = 'default'): UnicornApp {
  return apps[name] ??= createUnicorn(name);
}

export function useInject<T>(name: Constructor<T> | string): T;
export function useInject<T, D>(name: Constructor<T> | string, def?: D): T | D;
export function useInject<T, D>(name: Constructor<T> | string, def?: D): T | D {
  return useUnicornApp().inject(name, def);
}
