import type { Unicorn } from '../../index';

export default class UnicornUri {
  static is = 'uri';

  asset = {
    path: () => '',
    root: () => '',
  };

  static install(app: Unicorn) {
    const $uri = app.$uri = new this(app);

    $uri.asset.path = (path = '') => {
      return app.asset('path') + path;
    };

    $uri.asset.root = (path = '') => {
      return app.asset('root') + path;
    };
  }

  constructor(protected app: Unicorn) {
    //
  }

  path(path: string = ''): string {
    return this.app.uri('path') + path;
  }

  root(path: string = ''): string {
    return this.app.uri('root') + path;
  }

  current(): string {
    return this.app.uri('current') || '';
  }

  full(): string {
    return this.app.uri('full') || '';
  }

  route(): string {
    return this.app.uri('route') || '';
  }

  script(): string {
    return this.app.uri('script') || '';
  }
}
