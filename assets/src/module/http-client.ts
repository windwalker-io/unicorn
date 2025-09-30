import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, CreateAxiosDefaults } from 'axios';
import AxiosStatic, { AxiosError, isAxiosError, isCancel } from 'axios';
import { parseTemplate } from 'url-template';
import { data } from '../data';
import { route } from '../service';

export interface ApiReturn<T = any> {
  success: boolean;
  message?: string;
  code: number;
  status: number;
  data: T;
}

declare module 'axios' {
  export interface AxiosRequestConfig {
    vars?: Record<string, any>;
    methodSimulate?: string;
    methodSimulateByHeader?: boolean;
  }

  export interface CreateAxiosDefaults {
  }
}

function prepareAxios(axios: AxiosInstance): AxiosInstance {
  axios.interceptors.request.use((config) => {
    config.headers['X-CSRF-Token'] = data('csrf-token');

    if (config.url && config.url.startsWith('@')) {
      config.url = route(config.url);
    }

    if (config?.vars && config.url) {
      const tmpl = parseTemplate(config.url);
      config.url = tmpl.expand(config.vars || {});
    }

    // Simulate methods
    if (config.methodSimulate) {
      if (config.methodSimulateByHeader) {
        config.headers['X-HTTP-Method-Override'] = config;
      } else if (typeof config.data === 'object') {
        config.data['_method'] = config.method;
      } else if (typeof config.data === 'string') {
        if (config.data.includes('?')) {
          config.data += '&_method=' + config.method;
        } else {
          config.data += '?_method=' + config.method;
        }
      }

      if (config.method?.toLowerCase() !== 'get') {
        config.method = 'POST';
      }
    }

    return config;
  });

  return axios;
}

export type UnicornHttpClient = ReturnType<typeof createHttpClient>;

export function createHttpClient(config?: CreateAxiosDefaults | AxiosInstance) {
  const axios = config && 'interceptors' in config
    ? config
    : AxiosStatic.create(config ?? {});

  prepareAxios(axios);

  function requestMiddleware(callback: Parameters<AxiosInstance['interceptors']['request']['use']>[0]) {
    return axios.interceptors.request.use(callback);
  }

  function responseMiddleware(callback: Parameters<AxiosInstance['interceptors']['response']['use']>[0]) {
    return axios.interceptors.response.use(callback);
  }

  /**
   * Send a GET request.
   */
  async function get<T = any, D = any>(
    url: string,
    options: Partial<AxiosRequestConfig> = {}
  ): Promise<AxiosResponse<T, D>> {
    options.url = url;
    options.method = 'GET';

    return request(options);
  }

  /**
   * Send a POST request.
   */
  async function post<T = any, D = any>(
    url: string,
    data?: any,
    options: Partial<AxiosRequestConfig> = {}
  ): Promise<AxiosResponse<T, D>> {
    options.url = url;
    options.method = 'POST';
    options.data = data;

    return request(options);
  }

  /**
   * Send a PUT request.
   *
   * @param {string} url
   * @param {any} data
   * @param {AxiosRequestConfig} options
   *
   * @returns {Promise<AxiosResponse>}
   */
  async function put<T = any, D = any>(
    url: string,
    data?: any,
    options: Partial<AxiosRequestConfig> = {}
  ): Promise<AxiosResponse<T, D>> {
    options.url = url;
    options.method = 'PUT';
    options.data = data;

    return request(options);
  }

  /**
   * Send a PATCH request.
   *
   * @param {string} url
   * @param {any} data
   * @param {AxiosRequestConfig} options
   *
   * @returns {Promise<AxiosResponse>}
   */
  async function patch<T = any, D = any>(
    url: string,
    data?: any,
    options: Partial<AxiosRequestConfig> = {}
  ): Promise<AxiosResponse<T, D>> {
    options.url = url;
    options.method = 'PATCH';
    options.data = data;

    return request(options);
  }

  /**
   * Send a DELETE request.
   *
   * @param {string} url
   * @param {any} data
   * @param {AxiosRequestConfig} options
   *
   * @returns {Promise<AxiosResponse>}
   */
  async function deletes<T = any, D = any>(
    url: string,
    data?: any,
    options: Partial<AxiosRequestConfig> = {}
  ): Promise<AxiosResponse<T, D>> {
    options.url = url;
    options.method = 'DELETE';
    options.data = data;

    return request(options);
  }

  /**
   * Send a HEAD request.
   *
   * @param {string} url
   * @param {AxiosRequestConfig} options
   *
   * @returns {Promise<AxiosResponse>}
   */
  async function head<T = any, D = any>(
    url: string,
    options: Partial<AxiosRequestConfig> = {}
  ): Promise<AxiosResponse<T, D>> {
    options.url = url;
    options.method = 'HEAD';

    return request(options);
  }

  /**
   * Send a OPTIONS request.
   *
   * @param {string} url
   * @param {AxiosRequestConfig} options
   *
   * @returns {Promise<AxiosResponse>}
   */
  async function options<T = any, D = any>(
    url: string,
    options: Partial<AxiosRequestConfig> = {}
  ): Promise<AxiosResponse<T, D>> {
    options.url = url;
    options.method = 'OPTIONS';

    return request(options);
  }

  /**
   * Send request.
   */
  async function request<T = any, D = any>(options: AxiosRequestConfig): Promise<AxiosResponse<T, D>> {
    try {
      return await axios(options);
    } catch (e) {
      (e as any).originMessage = (e as Error).message;

      const err = e as AxiosError<any>;

      if (err.response?.data?.message) {
        err.message = err.response.data.message;
      }

      throw err;
    }
  }

  return {
    axios,
    request,
    get,
    post,
    put,
    patch,
    delete: deletes,
    head,
    options,
    requestMiddleware,
    responseMiddleware,
    isCancel,
    AxiosError,
    isAxiosError,
  };
}
