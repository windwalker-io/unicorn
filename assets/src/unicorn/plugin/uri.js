export default class UnicornUri {
  static is = 'uri';

  asset = {};

  static install(app, options = {}) {
    const $uri = app.$uri = new this(app, options);

    $uri.asset.path = (path = '') => {
      return app.asset('path') + path;
    };

    $uri.asset.root = (path = '') => {
      return app.asset('root') + path;
    };
  }

  constructor(app, options = {}) {
    this.app = app;
    this.options = options;
  }

  path(path = '') {
    return this.app.uri('path') + path;
  }

  root(path = '') {
    return this.app.uri('root') + path;
  }

  /**
   * @returns {string}
   */
  current() {
    return this.app.uri('current');
  }

  /**
   * @returns {string}
   */
  full() {
    return this.app.uri('full');
  }

  /**
   * @returns {string}
   */
  route() {
    return this.app.uri('route');
  }

  /**
   * @returns {string}
   */
  script() {
    return this.app.uri('script');
  }
}
