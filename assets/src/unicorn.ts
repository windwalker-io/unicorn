import UnicornApp from '@/app';
import { polyfill } from '@/polyfill';
import { Constructor, Dictionary } from '@/types';

export * from '@/data';
// export * from '@/events';

// Helpers
export * from '@/modules';
export * from '@/composable';
// export * from '@/ui';
// export * from '@/plugin';

let app: UnicornApp;

export function createUnicorn(): UnicornApp {
  polyfill();

  return app = new UnicornApp();
}

export function createUnicornWithPlugins(): UnicornApp {
  const app = createUnicorn();

  // app.use(UnicornUI);

  // app.use(UnicornDom);

  return app;
}

export function setUnicornApp(inc: UnicornApp) {
  app = inc;
}

export function useUnicornApp(): UnicornApp {
  return app ??= createUnicorn();
}

export function useInject<T>(name: Constructor<T> | string): T;
export function useInject<T, D>(name: Constructor<T> | string, def?: D): T | D;
export function useInject<T, D>(name: Constructor<T> | string, def?: D): T | D {
  return useUnicornApp().inject(name, def);
}
