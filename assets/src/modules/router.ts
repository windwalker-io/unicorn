
import { data } from '@/data';
import { parse, stringify } from 'qs';

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
  return undefined !== data('unicorn.routes')[route];
}

export function addQuery(url: string, query?: Record<string, any>): string {
  if (query == null) {
    return url;
  }

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

export function parseQuery<T = Record<string, any>>(queryString: string): T {
  return parse(queryString) as T;
}

export function buildQuery(query: Record<string, any>): string {
  return stringify(query);
}
