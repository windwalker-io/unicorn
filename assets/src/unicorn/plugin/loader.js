/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

export default class UnicornLoader {
  static install(app) {
    app.import = this.import;
    app.importSync = this.importSync;
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

  static importSync(...src) {
    let promise = Promise.resolve();
    let url = null;
    const modules = [];

    while (url = src.shift()) {
      if (!Array.isArray(url)) {
        url = [ url ];
      }

      const target = url;
      promise = promise.then(
        () => this.import(...target).then((m) => {
          modules.push(m);
          return modules;
        })
      );
    }

    return promise;
  }

  static importCSS(...src) {
    return u.import(...src).then((modules) => {
      if (!Array.isArray(modules)) {
        modules = [ modules ];
      }

      const styles = modules.map(module => module.default);

      document.adoptedStyleSheets = [...document.adoptedStyleSheets, ...styles];
    });
  }
}
