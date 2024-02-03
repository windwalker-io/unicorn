import type { Unicorn } from '@/index';
import MD5 from 'md5-es';

let globalSerial = 1;

export default class UnicornCrypto {
  static is = 'crypto';

  static install(app: Unicorn) {
    const $crypto = app.$crypto = new this(app);

    app.base64Encode = $crypto.base64Encode.bind($crypto);
    app.base64Decode = $crypto.base64Decode.bind($crypto);
    app.uuid4 = $crypto.uuid4.bind($crypto);
    app.uid = $crypto.uid.bind($crypto);
    app.tid = $crypto.tid.bind($crypto);
    app.md5 = $crypto.md5.bind($crypto);
    app.serial = $crypto.serial.bind($crypto);
  }

  constructor(protected app: Unicorn) {
    //
  }

  /**
   * Base64 URL encode
   */
  base64Encode(string: string): string {
    return btoa(String(string))
      .replace(/\+/, '-')
      .replace(new RegExp('\\/'), '_')
      .replace(/=+$/, '');
  }

  /**
   * Base64 URL decode
   */
  base64Decode(string: string): string {
    return atob(
      String(string)
        .replace(/-/, '+')
        .replace(/_/, '/')
    );
  }

  /**
   * XOR Cipher encrypt.
   */
  encrypt(key: string, data: string): string {
    const code = data.split('').map((c, i) => c.charCodeAt(0) ^ this.keyCharAt(key, i)).join(',');

    return this.base64Encode(code);
  }

  /**
   * XOR Cipher decrypt.
   */
  decrypt(key: string, data: string): string {
    // eslint-disable-next-line no-param-reassign
    data = this.base64Decode(data);

    // eslint-disable-next-line no-param-reassign

    return data.split(',')
      .map((c, i) => String.fromCharCode(Number(c) ^ this.keyCharAt(key, i))).join('');
  }

  /**
   * Key char at.
   */
  keyCharAt(key: string, i: number): number {
    return key.charCodeAt(Math.floor(i % key.length));
  }

  /**
   * UUID v4
   *
   * @see  https://gist.github.com/jed/982883
   */
  uuid4(): string {
    return (function b(a) {
      return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, b);
    }());
  }

  /**
   * Get uid, similar Windwalker Uililities uid().
   */
  uid(prefix: string = '', timebase: boolean = false): string {
    if (timebase) {
      const start = performance?.timeOrigin
        ? Math.round(performance.timeOrigin)
        : performance.timing.navigationStart;

      const time = (start * 100000) + (performance.now() * 100);

      return prefix + time.toString(12) + (this.randomString(4));
    }

    return prefix + this.randomString(12);
  }

  tid(prefix: string = ''): string {
    return this.uid(prefix, true);
  }

  randomString(n: number = 12): string {
    const QUOTA = 65536;
    const crypto = (window.crypto || window.msCrypto);

    if (!crypto) {
      return String(Math.floor(Math.random() * (n ** 10)));
    }

    const a = new Uint8Array(n);

    for (let i = 0; i < n; i += QUOTA) {
      crypto.getRandomValues(a.subarray(i, i + Math.min(n - i, QUOTA)));
    }

    return [...a]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('');
  }

  md5(str: string) {
    return MD5.hash(str);
  }

  serial(): number {
    return globalSerial++;
  }
}
