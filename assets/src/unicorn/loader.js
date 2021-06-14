/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

export default class UnicornLoader {
  static install(app) {
    app.import = this.import;
  }

  static import(...src) {
    const s = window.System;

    if (src.length === 1) {
      return s.import(src[0]);
    }

    const promises = [];

    src.forEach((link) => {
      promises.push(s.import(link));
    });

    return Promise.all(promises);
  }
}
