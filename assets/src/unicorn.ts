import { InjectionKey, UnicornApp } from './app';
import { polyfill } from './polyfill';
import { removeCloak } from './utilities';

export * from './data';
export * from './events';
export * from './modules';
export * from './composable';
export * from './plugin';

let app: UnicornApp;

export function createUnicorn(): UnicornApp {
  polyfill();
  removeCloak();

  return app = new UnicornApp();
}

export function createUnicornWithPlugins(): UnicornApp {
  const app = createUnicorn();

  // app.use(UnicornUI);

  // app.use(UnicornDom);

  return app;
}

export function useUnicorn(instance?: UnicornApp): UnicornApp {
  if (instance) {
    app = instance;
  }

  return app ??= createUnicorn();
}

export function useInject<T>(id: InjectionKey<T>): T;
export function useInject<T>(id: InjectionKey<T>, def: T): T;
export function useInject<T>(id: InjectionKey<T>, def?: T): T | undefined {
  return useUnicorn().inject<T>(id, def);
}
