import { injectCssToDocument } from '@/modules/dom';
import { forceArray } from '@/modules/helper';
import { Dictionary, MaybeArray } from '@/types';

export function doImport<T = any>(src: string): T {
  // @ts-ignore
  return import(src);
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

export async function useCssImport(...src: string[]): Promise<CSSStyleSheet[]> {
  let modules: MaybeArray<{ default: CSSStyleSheet }> = await useImport(...src);

  modules = forceArray(modules);

  const styles = modules.map(module => module.default);

  return injectCssToDocument(...styles);
}

