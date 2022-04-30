/**
 * Part of unicorn project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

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

  current() {
    return this.app.uri('current');
  }

  full() {
    return this.app.uri('full');
  }

  route() {
    return this.app.uri('route');
  }

  script() {
    return this.app.uri('script');
  }
}
