import { InjectionKey, UnicornApp } from './app';
import { polyfill } from './polyfill';
import { Dictionary } from './types';
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

export function useMacro<T extends Dictionary<(...args: any[]) => any>>(name: T): T;
export function useMacro<N extends string, T extends (...args: any[]) => any>(
  name: N,
  handler: T
): { [K in N]: T };
export function useMacro(name: string | Dictionary<(...args: any[]) => any>, handler?: (...args: any[]) => any): any {
  const app = useUnicorn();

  if (typeof name === 'string') {
    app.macro(name, handler!);
  } else {
    for (const k in name) {
      app.macro(k, name[k]!);
    }
  }

  return app;
}

export async function useLegacy(app?: UnicornApp) {
  app ??= useUnicorn();

  pushUnicornToGlobal(app);

  const { useLegacyMethods } = await import('./legacy/legacy');

  await useLegacyMethods(app);

  return app;
}
