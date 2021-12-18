/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

const imports = {};

export default class UnicornLoader {
  static install(app) {
    const loader = app.$loader = new this(app);

    app.import = loader.import.bind(loader);
    app.importSync = loader.importSync.bind(loader);
    app.importCSS = loader.importCSS.bind(loader);
    app.minFileName = loader.minFileName.bind(loader);
    app.afterImported = loader.afterImported.bind(loader);
  }

  constructor(app) {
    this.app = app;
  }

  /**
   * @param {string} src
   * @returns {Promise<*>}
   */
  doImport(src) {
    const s = window.System;

    return s.import(src);
  }

  /**
   * Import modules or scripts.
   * @param {string} ...src
   * @returns {Promise<any[]|any>}
   */
  import(...src) {
    const s = window.System;

    if (src.length === 1) {
      return this.doImport(src[0]);
    }

    const promises = [];

    src.forEach((link) => {
      promises.push(
        link instanceof Promise ? link : this.doImport(link)
      );
    });

    return Promise.all(promises);
  }

  /**
   * Import sync.
   * @param src
   * @returns {Promise<void>}
   */
  importSync(...src) {
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

  /**
   * Import CSS files.
   * @param src
   * @returns {Promise<*>}
   */
  importCSS(...src) {
    return this.import(...src).then((modules) => {
      if (!Array.isArray(modules)) {
        modules = [ modules ];
      }

      const styles = modules.map(module => module.default);

      document.adoptedStyleSheets = [...document.adoptedStyleSheets, ...styles];
    });
  }

  /**
   * @param {string} fileName
   * @returns {string}
   */
  minFileName(fileName) {
    const segments = fileName.split('.');
    const ext = segments.pop();

    if (this.app.isDebug()) {
      return segments.join('.') + '.min.' + ext;
    }

    return fileName;
  }

  asImported(name) {
    if (!imports[name]) {
      imports[name] = {
        promise: Promise.resolve(),
        resolve: null
      };
    } else {
      imports[name].resolve();
    }
  }

  afterImported(name, callback) {
    if (!imports[name]) {
      let r;
      imports[name] = {
        promise: new Promise((resolve) => {
          r = resolve;
        }),
      };

      imports[name].resolve = r;
    }

    imports[name].promise.then(callback);

    return imports[name].promise;
  }
}
