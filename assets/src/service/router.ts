
import { data } from '../data';
import { decode, encode } from 'qss';

/**
 * Add a route.
 */
export function addRoute(route: string, url: string) {
  const routes = data('unicorn.routes') || {};
  routes[route] = url;

  data('unicorn.routes', routes);
}

/**
 * Get route.
 */
export function route(route: string, query?: Record<string, any>): string {
  const source = route;
  const extract = extractRoute(source);
  route = extract.route;
  let path = extract.path;
  const routes = data('unicorn.routes') || {};

  let url = routes[route];

  if (url == null) {
    if (!route.startsWith('@')) {
      route = '@' + route;
    } else {
      route = route.substring(1);
    }
  }

  url = routes[route];

  if (url == null) {
    throw new Error(`Route: "${source}" not found`);
  }

  // Merge query
  if (path) {
    const { route: u1, path: u1q } = extractRoute(url, '?');
    const { route: u2, path: u2q } = extractRoute(path, '?');

    url = u1 + '/' + u2;

    if (u1q || u2q) {
      const q = [ u1q, u2q ].filter(u => u).join('&');
      url += '?' + q;
    }
  }

  return addQuery(url, query);
}

function extractRoute(route: string, sep: string = '/'): { path: string; route: string } {
  if (route.indexOf(sep) === -1) {
    return { route, path: '' }
  }

  const segments = route.split(sep);

  route = segments.shift() || '';
  const path = segments.join(sep);

  return { route, path };
}

export function hasRoute(route: string): boolean {
  const routes = data('unicorn.routes') || {};

  if (routes[route] != null) {
    return true;
  }

  const alt = route.startsWith('@') ? route.substring(1) : '@' + route;

  return routes[alt] != null;
}

export function addQuery(url: string, query?: Record<string, any>): string {
  if (query == null) {
    return url;
  }

  // Work on a copy so the caller's object is not mutated (placeholders consumed below).
  const params: Record<string, any> = structuredClone(query);

  for (let k in params) {
    const v = params[k];

    const placeholder = `{${k}}`;

    if (url.indexOf(placeholder) !== -1) {
      url = url.replace(
        new RegExp(`${placeholder}`, 'g'),
        v
      );
      delete params[k];
    }

    const encodedPlaceholder = encodeURIComponent(`{${k}}`);

    if (url.indexOf(encodedPlaceholder) !== -1) {
      url = url.replace(
        new RegExp(`${encodedPlaceholder}`, 'g'),
        v
      );
      delete params[k];
    }
  }

  if (Object.keys(params).length === 0) {
    return url;
  }

  const queryString = encode(params);

  return url + (/\?/.test(url) ? `&${queryString}` : `?${queryString}`);
}

export function parseQuery<T = Record<string, any>>(queryString: string): T {
  return decode(queryString) as T;
}

export function buildQuery(query: Record<string, any>): string {
  return encode(query);
}
