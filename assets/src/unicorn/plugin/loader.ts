import UnicornApp from '../app';
import type UnicornHelper from './helper';

const imports: Record<string, { promise: Promise<any>; resolve?: Function; }> = {};

declare global {
  interface Window {
    System?: any;
  }
}

export default class UnicornLoader {
  static install(app: UnicornApp) {
    const loader = app.$loader = new this(app);

    app.import = loader.import.bind(loader);
    app.importSync = loader.importSync.bind(loader);
    app.importCSS = loader.importCSS.bind(loader);
    app.minFileName = loader.minFileName.bind(loader);
    app.afterImported = loader.afterImported.bind(loader);
  }

  constructor(protected app: UnicornApp) {
    //
  }

  doImport(src: string): Promise<any> {
    const s = window.System;

    return s.import(src);
  }

  /**
   * Import modules or scripts.
   */
  import(...src: any[]): Promise<any|any[]> {
    if (src.length === 1) {
      return this.doImport(src[0]);
    }

    const promises: Promise<any>[] = [];

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
  importSync(...src: any): Promise<any|any[]> {
    let promise: Promise<any> = Promise.resolve();
    let url: string[];
    const modules: any[] = [];

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
   */
  async importCSS(...src: any): Promise<any|any[]> {
    let modules: any = await this.import(...src);

    if (!Array.isArray(modules)) {
      modules = [modules];
    }

    const styles: CSSStyleSheet[] = (modules as any[]).map(module => module.default);

    document.adoptedStyleSheets = [...document.adoptedStyleSheets, ...styles];
  }

  minFileName(fileName: string): string {
    const segments = fileName.split('.');
    const ext = segments.pop();

    if (this.app.inject<UnicornHelper>('$helper').isDebug()) {
      return segments.join('.') + '.min.' + ext;
    }

    return fileName;
  }

  asImported(name: string) {
    if (!imports[name]) {
      imports[name] = {
        promise: Promise.resolve(),
        resolve: undefined
      };
    } else {
      imports[name]?.resolve?.();
    }
  }

  /**
   * Add after import hook for some url or id.
   */
  afterImported(name: string, callback: (resolve: Function, reject?: Function) => void): Promise<any> {
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


