/**
 * Part of unicorn project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

import md5 from 'md5';

let globalSerial = 1;

export default class UnicornCrypto {
  static is = 'crypto';

  static install(app, options = {}) {
    const $crypto = app.$crypto = new this(app, options);

    app.base64Encode = $crypto.base64Encode.bind($crypto);
    app.base64Decode = $crypto.base64Decode.bind($crypto);
    app.uuid4 = $crypto.uuid4.bind($crypto);
    app.uid = $crypto.uid.bind($crypto);
    app.tid = $crypto.tid.bind($crypto);
    app.md5 = $crypto.md5.bind($crypto);
    app.serial = $crypto.serial.bind($crypto);
  }

  constructor(app, options = {}) {
    this.app = app;
    this.$options = options;
  }

  /**
   * Base64 encode.
   *
   * @param {string} string
   *
   * @returns {string}
   */
  base64Encode(string) {
    return btoa(String(string))
      .replace(/\+/, '-')
      .replace(new RegExp('\\/'), '_')
      .replace(/=+$/, '');
  }

  /**
   * Base64 decode.
   *
   * @param {string} string
   *
   * @returns {string}
   */
  base64Decode(string) {
    return atob(
      String(string)
        .replace(/-/, '+')
        .replace(/_/, '/')
    );
  }

  /**
   * XOR Cipher encrypt.
   *
   * @param {string} key
   * @param {string} data
   */
  encrypt(key, data) {
    const code = data.split('').map((c, i) => c.charCodeAt(0) ^ this.keyCharAt(key, i)).join(',');

    return this.base64Encode(code);
  }

  /**
   * XOR Cipher decrypt.
   *
   * @param {string} key
   * @param {string} data
   *
   * @returns {string}
   */
  decrypt(key, data) {
    // eslint-disable-next-line no-param-reassign
    data = this.base64Decode(data);

    // eslint-disable-next-line no-param-reassign
    data = data.split(',');

    return data.map((c, i) => String.fromCharCode(c ^ this.keyCharAt(key, i))).join('');
  }

  /**
   * Key char at.
   *
   * @param {string} key
   * @param {Number} i
   *
   * @returns {Number}
   */
  keyCharAt(key, i) {
    return key.charCodeAt(Math.floor(i % key.length));
  }

  /**
   * UUID v4
   *
   * @see  https://gist.github.com/jed/982883
   *
   * @returns {string}
   */
  uuid4() {
    return (function b(a) {
      return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, b);
    }());
  }

  /**
   * Get uid, similar Windwalker Uililities uid().
   *
   * @param {string}  prefix
   * @param {boolean} timebase
   * @returns {string}
   */
  uid(prefix = '', timebase = false) {
    if (timebase) {
      const start = performance?.timeOrigin
        ? Math.round(performance.timeOrigin)
        : performance.timing.navigationStart;

      const time = (start * 100000) + (performance.now() * 100);

      return prefix + time.toString(12) + (this.randomString(4));
    }

    return prefix + this.randomString(12);
  }

  /**
   * @param {string}  prefix
   * @returns {string}
   */
  tid(prefix = '') {
    return this.uid(prefix, true);
  }

  /**
   * @param {number} n
   * @returns {string}
   */
  randomString(n = 12) {
    const QUOTA = 65536;
    const crypto = (window.crypto || window.msCrypto);

    if (!crypto) {
      return Math.floor(Math.random() * (n ** 10));
    }

    const a = new Uint8Array(n);

    for (let i = 0; i < n; i += QUOTA) {
      crypto.getRandomValues(a.subarray(i, i + Math.min(n - i, QUOTA)));
    }

    return [...a]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * @param {string} str
   * @returns {string}
   */
  md5(str) {
    return md5(str);
  }

  /**
   * @returns {number}
   */
  serial() {
    return globalSerial++;
  }
}
