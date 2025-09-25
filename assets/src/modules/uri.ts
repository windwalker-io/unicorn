import { data } from '../data';

type UriTypes = 'full' | 'path' | 'root' | 'current' | 'route' | 'script';
type AssetTypes = 'root' | 'path';

export function useSystemUri(): UnicornSystemUri;
export function useSystemUri(type: UriTypes): string;
export function useSystemUri(type?: UriTypes, path?: string): UnicornSystemUri | string {
  const uri = UnicornSystemUri.get();

  if (type) {
    return uri[type](path);
  }

  return uri;
}

export function useAssetUri(): UnicornAssetUri;
export function useAssetUri(type?: AssetTypes, path?: string): string;
export function useAssetUri(type?: AssetTypes, path?: string): UnicornAssetUri | string {
  const asset = UnicornAssetUri.get();

  if (type) {
    return asset[type](path);
  }

  return asset;
}

function uri(type: string) {
  return data('unicorn.uri')[type];
}

function asset(type: string) {
  return uri('asset')[type];
}

export function addUriBase(uri: string, type = 'path') {
  if (uri.substring(0, 2) === '/\/' || uri.substring(0, 4) === 'http') {
    return uri;
  }

  return asset(type) + '/' + uri;
}

export class UnicornSystemUri extends URL {
  static instance: UnicornSystemUri;

  static get() {
    return this.instance ??= new this(uri('full'));
  }

  path(path: string = ''): string {
    return uri('path') + path;
  }

  root(path: string = ''): string {
    return uri('root') + path;
  }

  current(): string {
    return uri('current') || '';
  }

  full(): string {
    return uri('full') || '';
  }

  route(): string {
    return uri('route') || '';
  }

  script(): string {
    return uri('script') || '';
  }

  routeWithQuery() {
    const route = this.route();
    const query = this.searchParams.toString();

    return query ? `${route}?${query}` : route;
  }

  routeAndQuery() {
    const route = this.route();
    const query = this.searchParams.toString();

    return [route, query];
  }
}

export class UnicornAssetUri {
  static instance: UnicornAssetUri;

  static get() {
    return this.instance ??= new this();
  }

  path(path: string = ''): string {
    return asset('path') + path;
  }

  root(path: string = ''): string {
    return asset('root') + path;
  }
}
