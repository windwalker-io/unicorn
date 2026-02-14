import { Dictionary } from '../types';
import { injectCssToDocument } from './';

type Source = string | (() => Promise<{ default: string }>);

export async function useScriptImport(src: Source, attrs: Record<string, string> = {}): Promise<void> {
  if (typeof src === 'function') {
    src = (await src()).default;
  }

  const script = document.createElement('script');
  script.src = resolveUrl(src);

  for (const key in attrs) {
    script.setAttribute(key, attrs[key]);
  }

  return new Promise((resolve, reject) => {
    script.onload = () => {
      resolve();
      document.body.removeChild(script);
    };
    script.onerror = (e) => {
      reject(e);
      document.body.removeChild(script);
    };

    document.body.appendChild(script);
  });
}

export function doImport<T = any>(src: string): Promise<T> {
  return import(/* @vite-ignore */src);
}

export async function useImport(...src: any[]): Promise<any>;
export async function useImport<T extends any[]>(...src: string[]): Promise<T>;
export async function useImport<T = any>(src: string): Promise<{ default: T }>;
export async function useImport<D = any, C = any>(src: string): Promise<{ default: D } & Dictionary<C>>;
export async function useImport(...src: any[]): Promise<any> {
  if (src.length === 1) {
    return doImport(src[0]);
  }

  const promises: Promise<any>[] = [];

  src.forEach((link) => {
    promises.push(
      link instanceof Promise ? link : doImport(link)
    );
  });

  return Promise.all(promises);
}

export async function useSeriesImport(...src: any[]): Promise<any>;
export async function useSeriesImport<T extends any[]>(...src: string[]): Promise<T>;
export async function useSeriesImport<T = any>(src: string): Promise<{ default: T }>;
export async function useSeriesImport<D = any, C = any>(src: string): Promise<{ default: D } & Dictionary<C>>;
export async function useSeriesImport(...src: any[]): Promise<any> {
  const modules: any[] = [];

  for (const source of src) {
    if (Array.isArray(source)) {
      const m = await useImport(...source);
      modules.push(m);

      continue;
    }

    const m = await useImport(source);

    modules.push(m);
  }

  return modules;
}

export async function useCssIncludes(...hrefs: Source[]): Promise<void[]> {
  const promises = hrefs.map((href) => {
    return new Promise<void>((resolve, reject) => {
      resolveSource(href).then((href) => {
        href = resolveUrl(href);

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = () => resolve();
        link.onerror = (e) => reject(e);

        document.head.appendChild(link);
      });
    });
  });

  return Promise.all(promises);
}

const importedSheets: Record<string, Promise<{ default: CSSStyleSheet }>> = {};

export async function useCssImport(...hrefs: Source[]): Promise<CSSStyleSheet[]> {
  // Todo: Use `{ assert: { type: "css" }` after all browsers support it.
  const modules = await Promise.all(
    hrefs.map((href) => {
      return new Promise<{ default: CSSStyleSheet }>((resolve) => {
        resolveSource(href).then((href) => {
          if (!importedSheets[href]) {
            importedSheets[href] = simulateCssImport(href);
          }

          resolve(importedSheets[href]);
        });
      });
    })
  );
  const styles = modules.map(module => module.default);

  return injectCssToDocument(...styles);
}

async function simulateCssImport(href: string) {
  const response = await fetch(href);
  if (!response.ok) {
    throw new Error(`Failed to load CSS: ${href}`);
  }
  const cssText = await response.text();

  const sheet = new CSSStyleSheet();
  await sheet.replace(cssText);
  return { default: sheet };
}

let importMap: Record<string, string>;

function parseImportMap() {
  const importMapScript = document.querySelector('script[type="importmap"]');
  if (importMapScript) {
    try {
      return JSON.parse(importMapScript.textContent || '{}').imports || {};
    } catch (e) {
      console.error('Failed to parse import map:', e);
    }
  }
  return {};
}

function resolveUrl(specifier: string) {
  importMap ??= parseImportMap();

  for (const [prefix, target] of Object.entries(importMap)) {
    if (specifier === prefix) {
      return target;
    }
  }

  for (const [prefix, target] of Object.entries(importMap)) {
    if (specifier.startsWith(prefix)) {
      return specifier.replace(prefix, target);
    }
  }
  return specifier;
}

async function resolveSource(src: Source): Promise<string> {
  if (typeof src === 'function') {
    return (await src()).default;
  }

  return src;
}
