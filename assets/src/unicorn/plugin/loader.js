/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

export default class UnicornLoader {
  static install(app) {
    app.import = this.import;
    app.importCSS = this.importCSS;
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

  static importCSS(...src) {
    u.import(...src).then((modules) => {
      if (!Array.isArray(modules)) {
        modules = [ modules ];
      }

      const styles = modules.map(module => module.default);

      document.adoptedStyleSheets = [...document.adoptedStyleSheets, ...styles];
    });
  }
}
