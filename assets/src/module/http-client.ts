import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosStatic,
  CreateAxiosDefaults
} from 'axios';
import { parseTemplate } from 'url-template';
import { data } from '../data';
import { route } from '../service';

declare global {
  let axios: AxiosStatic;
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

export class UnicornHttpClient {
  static axiosStatic?: Promise<AxiosStatic>;
  axios?: AxiosInstance;

  constructor(protected config?: CreateAxiosDefaults) {
  }

  static async importAxios(): Promise<any> {
    const { default: axios } = await import('axios');

    return axios;
  }

  static async getAxiosStatic(): Promise<AxiosStatic> {
    if (!this.axiosStatic) {
      this.axiosStatic = this.importAxios();
    }

    return this.axiosStatic;
  }

  async createHttp() {
    const axiosStatic = await UnicornHttpClient.getAxiosStatic();

    return this.axios = axiosStatic.create(this.config || {});
  }

  async getAxiosInstance() {
    if (this.axios) {
      return this.axios;
    }

    return this.axios = this.prepareAxios(await this.createHttp());
  }

  prepareAxios(axios: AxiosInstance): AxiosInstance {
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

  requestMiddleware(callback: Parameters<AxiosInstance['interceptors']['request']['use']>[0]) {
    return this.getAxiosInstance().then(axios => axios.interceptors.request.use(callback));
  }

  responseMiddleware(callback: Parameters<AxiosInstance['interceptors']['response']['use']>[0]) {
    return this.getAxiosInstance().then(axios => axios.interceptors.response.use(callback));
  }

  // ready() {
  //   super.ready();
  // }

  /**
   * Send a GET request.
   */
  get<T = any, D = any>(url: string, options: Partial<AxiosRequestConfig> = {}): Promise<AxiosResponse<T, D>> {
    options.url = url;
    options.method = 'GET';

    return this.request(options);
  }

  /**
   * Send a POST request.
   */
  post<T = any, D = any>(
    url: string,
    data?: any,
    options: Partial<AxiosRequestConfig> = {}
  ): Promise<AxiosResponse<T, D>> {
    options.url = url;
    options.method = 'POST';
    options.data = data;

    return this.request(options);
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
  put<T = any, D = any>(
    url: string,
    data?: any,
    options: Partial<AxiosRequestConfig> = {}
  ): Promise<AxiosResponse<T, D>> {
    options.url = url;
    options.method = 'PUT';
    options.data = data;

    return this.request(options);
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
  patch<T = any, D = any>(
    url: string,
    data?: any,
    options: Partial<AxiosRequestConfig> = {}
  ): Promise<AxiosResponse<T, D>> {
    options.url = url;
    options.method = 'PATCH';
    options.data = data;

    return this.request(options);
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
  delete<T = any, D = any>(
    url: string,
    data?: any,
    options: Partial<AxiosRequestConfig> = {}
  ): Promise<AxiosResponse<T, D>> {
    options.url = url;
    options.method = 'DELETE';
    options.data = data;

    return this.request(options);
  }

  /**
   * Send a HEAD request.
   *
   * @param {string} url
   * @param {AxiosRequestConfig} options
   *
   * @returns {Promise<AxiosResponse>}
   */
  head<T = any, D = any>(url: string, options: Partial<AxiosRequestConfig> = {}): Promise<AxiosResponse<T, D>> {
    options.url = url;
    options.method = 'HEAD';

    return this.request(options);
  }

  /**
   * Send a OPTIONS request.
   *
   * @param {string} url
   * @param {AxiosRequestConfig} options
   *
   * @returns {Promise<AxiosResponse>}
   */
  options<T = any, D = any>(url: string, options: Partial<AxiosRequestConfig> = {}): Promise<AxiosResponse<T, D>> {
    options.url = url;
    options.method = 'OPTIONS';

    return this.request(options);
  }

  isCancel(cancel: any) {
    return axios.isCancel(cancel);
  }

  /**
   * Send request.
   */
  async request<T = any, D = any>(options: AxiosRequestConfig): Promise<AxiosResponse<T, D>> {
    try {
      let axiosInstance = await this.getAxiosInstance();
      return await axiosInstance(options);
    } catch (e) {
      (e as any).originMessage = (e as Error).message;

      const err = e as AxiosError<any>;

      if (err.response?.data?.message) {
        err.message = err.response.data.message;
      }

      throw err;
    }
  }

  async errorClass() {
    const axios = await UnicornHttpClient.getAxiosStatic();

    return axios.AxiosError;
  }
}
