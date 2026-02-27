import type { UnicornHttpClient } from '../module/http-client';
import type { AxiosInstance, CreateAxiosDefaults } from 'axios';
export type { ApiReturn, UnicornHttpClient } from '../module/http-client';

type UnicornHttpClientProxy = {
  request: UnicornHttpClient['request'];
  get: UnicornHttpClient['get'];
  post: UnicornHttpClient['post'];
  put: UnicornHttpClient['put'];
  patch: UnicornHttpClient['patch'];
  delete: UnicornHttpClient['delete'];
  head: UnicornHttpClient['head'];
  options: UnicornHttpClient['options'];
  http: Promise<UnicornHttpClient>;
};

export function useHttpClient(config?: CreateAxiosDefaults | AxiosInstance): UnicornHttpClientProxy & Promise<UnicornHttpClient> {
  const promise = import('../module/http-client').then(({ createHttpClient }) => {
    return createHttpClient(config as CreateAxiosDefaults | undefined);
  });

  const data: UnicornHttpClientProxy = {
    request: (options) => {
      return promise.then((client) => client.request(options));
    },
    get: (url, options) => {
      return promise.then((client) => client.get(url, options));
    },
    post: (url, data, options) => {
      return promise.then((client) => client.post(url, data, options));
    },
    put: (url, data, options) => {
      return promise.then((client) => client.put(url, data, options));
    },
    patch: (url, data, options) => {
      return promise.then((client) => client.patch(url, data, options));
    },
    delete: (url, data, options) => {
      return promise.then((client) => client.delete(url, data, options));
    },
    head: (url, options) => {
      return promise.then((client) => client.head(url, options));
    },
    options: (url, options) => {
      return promise.then((client) => client.options(url, options));
    },
    http: promise,
  };

  Object.assign(data, {
    then: promise.then.bind(promise),
    catch: promise.catch.bind(promise),
  });

  return data as UnicornHttpClientProxy & Promise<UnicornHttpClient>;
}
