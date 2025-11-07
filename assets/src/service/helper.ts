import { data } from '../data';
import { sleep } from '@lyrasoft/ts-toolkit/generic';

export { sleep };

export function forceArray<T>(item: T | T[]): T[] {
  if (Array.isArray(item)) {
    return item;
  } else {
    return [item];
  }
}

export function debounce<T extends Function = Function>(handler: T, wait = 1): T {
  let timer: ReturnType<typeof setTimeout> | number, result: any;
  return function (this: any, ...args: any[]) {
    clearTimeout(timer);
    timer = setTimeout(() => result = handler.call(this, ...args), wait);
    return result;
  } as any as T;
}

export function throttle<T extends Function = Function>(handler: T, wait: number = 1): T {
  let timer: ReturnType<typeof setTimeout> | number | undefined, result: any;
  return function (this: any, ...args: any[]) {
    if (!timer) {
      return result = handler.call(this, ...args);
    }

    clearTimeout(timer);
    timer = setTimeout(() => timer = undefined, wait);
    return result;
  } as any as T;
}

export function isDebug() {
  return Boolean(data('windwalker.debug'));
}

export function nextTick(callback?: () => any): Promise<any> {
  return Promise.resolve().then(callback ?? (() => null));
}

export function wait<T extends readonly unknown[]>(
  ...promisee: { [K in keyof T]: PromiseLike<T[K]> | T[K] }
): Promise<Awaited<T>> {
  return Promise.all(promisee) as Promise<Awaited<T>>;
}

export function isError<E = Error>(e: any): e is E {
  return e instanceof Error;
}
