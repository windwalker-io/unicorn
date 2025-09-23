import { data } from '@/unicorn/data';

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

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

export function confirm(message: string): Promise<boolean> {
  message = message || 'Are you sure?';

  return new Promise((resolve) => {
    resolve(window.confirm(message));
  });
}

export function alert(title: string, text = '', type = 'info'): Promise<boolean> {
  if (text) {
    title += ' | ' + text;
  }

  window.alert(title);

  return Promise.resolve(true);
}

export function nextTick(callback?: () => any): Promise<any> {
  return Promise.resolve().then(callback ?? (() => null));
}

export function numberFormat(number: string | number, decimals = 0, decPoint = '.', thousandsSep = ','): string {
  number = Number(number);

  const str = number.toFixed(decimals ? decimals : 0).toString().split('.');
  const parts = [];

  for (var i = str[0].length; i > 0; i -= 3) {
    parts.unshift(str[0].substring(Math.max(0, i - 3), i));
  }

  str[0] = parts.join(thousandsSep ? thousandsSep : ',');

  return str.join(decPoint ? decPoint : '.');
}

/**
 * @see https://www.programiz.com/javascript/examples/generate-random-strings
 */
export function genRandomString(length: number): string {
  let result = '';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
