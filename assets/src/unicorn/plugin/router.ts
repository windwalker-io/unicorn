
import type { Unicorn } from '../../index';
import { parse, stringify } from 'qs';

export default class UnicornRouter {
  keys = {};

  static get is() { return 'router'; }

  static install(app: Unicorn) {
    const $router = app.$router = new this(app);

    app.route = $router.route.bind($router);
  }

  constructor(protected app: Unicorn) {
    //
  }

  /**
   * Add a route.
   */
  add(route: string, url: string): this {
    const data = this.app.data('unicorn.routes') || {};
    data[route] = url;

    this.app.data('unicorn.routes', data);

    return this;
  }

  /**
   * Get route.
   */
  route(route: string, query?: Record<string, any>): string {
    const source = route;
    const extract = this.extractRoute(source);
    route = extract.route;
    let path = extract.path;
    const routes = this.app.data('unicorn.routes') || {};

    let url = routes[route];

    if (url == null) {
      if (!route.startsWith('@')) {
        route = '@' + route;
      } else {
        route = route.substr(1);
      }
    }

    url = routes[route];

    if (url == null) {
      throw new Error(`Route: "${source}" not found`);
    }

    // Merge query
    if (path) {
      const { route: u1, path: u1q } = this.extractRoute(url, '?');
      const { route: u2, path: u2q } = this.extractRoute(path, '?');

      url = u1 + '/' + u2;

      if (u1q || u2q) {
        const q = [ u1q, u2q ].filter(u => u).join('&');
        url += '?' + q;
      }
    }

    return this.addQuery(url, query);
  }

  extractRoute(route: string, sep: string = '/'): { path: string; route: string } {
    if (route.indexOf(sep) === -1) {
      return { route, path: '' }
    }

    const segments = route.split(sep);

    route = segments.shift() || '';
    const path = segments.join(sep);

    return { route, path };
  }

  has(route: string): boolean {
    return undefined !== this.app.data('unicorn.routes')[route];
  }

  addQuery(url: string, query?: Record<string, any>): string {
    if (query == null) {
      return url;
    }

    const params = {};

    for (let k in query) {
      const v = query[k];

      const placeholder = `{${k}}`;

      if (url.indexOf(placeholder) !== -1) {
        url = url.replace(
          new RegExp(`${placeholder}`, 'g'),
          v
        );
        delete query[k];
      }

      const encodedPlaceholder = encodeURIComponent(`{${k}}`);

      if (url.indexOf(encodedPlaceholder) !== -1) {
        url = url.replace(
          new RegExp(`${encodedPlaceholder}`, 'g'),
          v
        );
        delete query[k];
      }
    }

    if (Object.keys(query).length === 0) {
      return url;
    }

    const queryString = stringify(query);

    return url + (/\?/.test(url) ? `&${queryString}` : `?${queryString}`);
  }

  parseQuery(queryString: string): Record<string, any> {
    return parse(queryString);
  }

  buildQuery(query: Record<string, any>): string {
    return stringify(query);
  }

  push(data: string | Record<string, any>): this {
    if (typeof data === 'string') {
      // eslint-disable-next-line no-param-reassign
      data = { uri: data };
    }

    window.history.pushState(
      data.state || null,
      data.title || null,
      data.uri || this.route(data.route, data.params),
    );

    return this;
  }

  replace(data: string | Record<string, any>): this {
    if (typeof data === 'string') {
      // eslint-disable-next-line no-param-reassign
      data = { uri: data };
    }

    window.history.replaceState(
      data.state || null,
      data.title || null,
      data.uri || this.route(data.route, data.params),
    );

    return this;
  }

  state(): any {
    return window.history.state;
  }

  back() {
    window.history.back();
  }

  forward() {
    window.history.forward();
  }

  /**
   * @param {number} num
   */
  go(num: number) {
    window.history.go(num);
  }
}
