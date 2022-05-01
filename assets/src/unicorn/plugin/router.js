/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

import { parse, stringify } from 'qs';

export default class UnicornRouter {
  keys = {};

  static get is() { return 'router'; }

  static install(app, options = {}) {
    const $router = app.$router = new this(app);

    app.route = $router.route.bind($router);
  }

  constructor(app) {
    this.app = app;
  }

  /**
   * Add a route.
   *
   * @param route
   * @param url
   *
   * @returns {UnicornRouter}
   */
  add(route, url) {
    const data = this.app.data('unicorn.routes') || {};
    data[route] = url;

    this.app.data('unicorn.routes', data);

    return this;
  }

  /**
   * Get route.
   *
   * @param {string} route
   * @param {*} query
   * @returns {String|UnicornRouter}
   */
  route(route, query = null) {
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

  /**
   * @param {string} route
   * @param {string} sep
   * @returns {{ path: string; route: string }}
   */
  extractRoute(route, sep = '/') {
    if (route.indexOf(sep) === -1) {
      return { route, path: '' }
    }

    const segments = route.split(sep);

    route = segments.shift();
    const path = segments.join(sep);

    return { route, path };
  }

  /**
   * @param {string} route
   * @returns {boolean}
   */
  has(route) {
    return undefined !== this.app.data('unicorn.routes')[route];
  }

  /**
   * @param {string} url
   * @param {*} query
   * @returns {string}
   */
  addQuery(url, query = null) {
    if (query === null) {
      return url;
    }

    const params = {};

    for (let k in query) {
      const v = query[k];

      if (url.indexOf(`{${k}}`) !== -1) {
        url = url.replace(
          new RegExp(`\{${k}\}`, 'g'),
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

  /**
   * @param {string} queryString
   * @returns {object}
   */
  parseQuery(queryString) {
    return parse(queryString);
  }

  /**
   * @param {object} query
   * @returns {string}
   */
  buildQuery(query) {
    return stringify(query);
  }

  /**
   * @param {object|string} data
   * @returns {this}
   */
  push(data) {
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

  /**
   * @param {object|string} data
   * @returns {UnicornRouter}
   */
  replace(data) {
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

  /**
   * @returns {any}
   */
  state() {
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
  go(num) {
    window.history.go(num);
  }
}
