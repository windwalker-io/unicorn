import { InjectionKey, UnicornApp } from './app';
import { polyfill } from './polyfill';
import { removeCloak } from './utilities';

export * from './data';
export * from './events';
export * from './service';
export * from './composable';
export * from './plugin';

export type { UnicornApp };

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

export const useInject: typeof UnicornApp.prototype.inject = <T = any>(id: InjectionKey<T>, def?: T): T => {
  return useUnicorn().inject<T>(id, def);
}

export function pushUnicornToGlobal(app?: UnicornApp) {
  // @ts-ignore
  window.u = app ?? useUnicorn();
}
