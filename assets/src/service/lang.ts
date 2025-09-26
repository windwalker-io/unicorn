import { data } from '../data';
import { isDebug } from './/helper';
import { Dictionary } from '../types';
import { vsprintf } from 'sprintf-js';

let lang: UnicornLang;

export function useLang() {
  return lang ??= new UnicornLang();
}

export function trans(id: string, ...args: any[]) {
  return useLang().trans(id, ...args);
}

export function __(id: string, ...args: any[]) {
  return trans(id, ...args);
}

export default class UnicornLang {
  /**
   * Translate a string.
   */
  trans(id: string, ...args: any[]): string {
    const key = this.normalize(id);

    let translated = this.get(key) || '';

    translated = this.replace(translated, args);

    return translated !== '' ? translated : this.wrapDebug(id, false);
  }

  protected replace(str: string, args: any[]): string {
    let replacements: Dictionary<any> = {};
    let values: any[] = [];

    for (const arg of args) {
      if (typeof arg === 'object') {
        replacements = { ...replacements, ...arg };
      } else {
        values.push(arg);
      }
    }

    if (values.length) {
      str = vsprintf(str, values);
    }

    if (Object.values(replacements).length) {
      for (const key in replacements) {
        let value = replacements[key];

        if (typeof value === 'function') {
          value = value();
        }

        str = str.replace(new RegExp(':' + key, 'g'), String(value));
      }
    }

    return str;
  }

  /**
   * Find text.
   */
  get(id: string): string | null {
    const strings = this.getStrings();

    if (strings[id]) {
      return strings[id];
    }

    return null;
  }

  /**
   * Has language key.
   */
  has(key: string): boolean {
    const strings = this.getStrings();

    return strings[key] !== undefined;
  }

  /**
   * Add language key.
   */
  add(key: string, value: string): this {
    const strings = this.getStrings();

    strings[this.normalize(key)] = value;

    data('unicorn.languages', strings);

    return this;
  }

  /**
   * Replace all symbols to dot(.).
   */
  protected normalize(text: string): string {
    return text.replace(/[^A-Z0-9]+/ig, '.');
  }

  protected wrapDebug(text: string, success: boolean): string {
    if (isDebug()) {
      if (success) {
        return '**' + text + '**';
      }

      return '??' + text + '??';
    }

    return text;
  }

  getStrings(): Record<string, string> {
    return data('unicorn.languages') || {};
  }
}
