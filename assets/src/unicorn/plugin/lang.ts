import type { Unicorn } from '../../index';

export default class UnicornLang {
  static get is() { return 'lang'; }

  static install(app: Unicorn) {
    const $lang = app.$lang = new this(app);

    app.__ = $lang.__.bind($lang);
    app.trans = $lang.trans.bind($lang);
  }

  constructor(protected app: Unicorn) {
    //
  }

  __(text: string, ...args: any[]): string {
    return this.trans(text, ...args);
  }

  /**
   * Translate a string.
   */
  trans(text: string, ...args: any[]): string {
    const key = this.normalize(text);

    let translated = this.find(key) || '';

    if (args.length) {
      translated = this.sprintf(translated, ...args);
    }

    return translated !== '' ? translated : this.wrapDebug(text, false);
  }

  /**
   * Sptintf language string.
   */
  sprintf(text: string, ...args: any[]): string {
    return this.app.vsprintf(text, args);
  }

  /**
   * Find text.
   */
  find(key: string): string | null {
    const langs = this.getStrings();

    if (langs[key]) {
      return langs[key];
    }

    return null;
  }

  /**
   * Has language key.
   */
  has(key: string): boolean {
    const langs = this.getStrings();

    return langs[key] !== undefined;
  }

  /**
   * Add language key.
   */
  add(key: string, value: string): this {
    const data = this.getStrings();

    data[this.normalize(key)] = value;

    this.app.data('unicorn.languages', data);

    return this;
  }

  /**
   * Replace all symbols to dot(.).
   */
  normalize(text: string): string {
    return text.replace(/[^A-Z0-9]+/ig, '.');
  }

  wrapDebug(text: string, success: boolean): string {
    if (this.app.isDebug()) {
      if (success) {
        return '**' + text + '**';
      }

      return '??' + text + '??';
    }

    return text;
  }

  getStrings(): Record<string, string> {
    return this.app.data('unicorn.languages') || {};
  }
}
