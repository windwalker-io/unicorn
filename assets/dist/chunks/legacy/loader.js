import { i as isDebug } from "../service/helper.js";
const imports = {};
class LegacyLoader {
  constructor(app) {
    this.app = app;
  }
  static install(app) {
    const loader = app.$loader = new this(app);
    app.import = loader.import.bind(loader);
    app.importSync = loader.importSync.bind(loader);
    app.importCSS = loader.importCSS.bind(loader);
    app.minFileName = loader.minFileName.bind(loader);
    app.afterImported = loader.afterImported.bind(loader);
  }
  doImport(src) {
    return S.import(src);
  }
  /**
   * Import modules or scripts.
   */
  import(...src) {
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
   */
  importSync(...src) {
    let promise = Promise.resolve();
    let url;
    const modules = [];
    while (url = src.shift()) {
      if (!Array.isArray(url)) {
        url = [url];
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
   */
  async importCSS(...src) {
    let modules = await this.import(...src);
    if (!Array.isArray(modules)) {
      modules = [modules];
    }
    const styles = modules.map((module) => module.default);
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, ...styles];
  }
  minFileName(fileName) {
    const segments = fileName.split(".");
    const ext = segments.pop();
    if (isDebug()) {
      return segments.join(".") + ".min." + ext;
    }
    return fileName;
  }
  asImported(name) {
    if (!imports[name]) {
      imports[name] = {
        promise: Promise.resolve(),
        resolve: void 0
      };
    } else {
      imports[name]?.resolve?.();
    }
  }
  /**
   * Add after import hook for some url or id.
   */
  afterImported(name, callback) {
    if (!imports[name]) {
      let r;
      imports[name] = {
        promise: new Promise((resolve) => {
          r = resolve;
        })
      };
      imports[name].resolve = r;
    }
    imports[name].promise.then(callback);
    return imports[name].promise;
  }
}
export {
  LegacyLoader as L
};
