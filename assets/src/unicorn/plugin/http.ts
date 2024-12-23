import UnicornApp from '../app';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosStatic } from 'axios';
import type { AxiosError } from 'axios';
import { parseTemplate } from 'url-template';

declare global {
  var axios: AxiosStatic;
}

declare module 'axios' {
  export interface AxiosRequestConfig {
    vars?: Record<string, any>;
  }
}

export default class UnicornHttp {
  globalAxios?: Promise<AxiosStatic>;
  // CanceledError?: CanceledError;
  axios?: AxiosInstance;
  config: Record<string, any> = {
    customMethod: false,
  };
  data: Record<string, any> = {};

  static get is() {
    return 'http';
  }

  static install(app: UnicornApp) {
    app.$http = new this(app);
  }

  constructor(protected app: UnicornApp) {
    this.data = {};
  }

  get getSelf() {
    return this;
  }

  importAxios(): Promise<any> {
    return this.app.import('@axios');
  }

  async getGlobalAxios(): Promise<AxiosStatic> {
    if (!this.globalAxios) {
      this.globalAxios = this.importAxios();
    }

    return this.globalAxios;
  }

  async createHttp() {
    return this.getGlobalAxios().then(() => {
      // this.CanceledError = axios.CanceledError;
      return this.axios = axios.create(this.config.axios || {});
    });
  }

  async getHttp() {
    if (this.axios) {
      return this.axios;
    }

    return this.createHttp()
      .then((axios) => this.prepareAxios(axios))
      .then((axios) => this.axios = axios);
  }

  prepareAxios(axios: AxiosInstance): AxiosInstance {
    axios.interceptors.request.use((config) => {
      config.headers['X-CSRF-Token'] = this.app.data('csrf-token');

      if (config.url && config.url.startsWith('@')) {
        config.url = this.app.route(config.url);
      }

      if (config?.vars && config.url) {
        const tmpl = parseTemplate(config.url);
        config.url = tmpl.expand(config.vars || {});
      }

      return config;
    });

    return axios;
  }

  requestMiddleware(callback: Parameters<AxiosInstance['interceptors']['request']['use']>[0]) {
    return this.getHttp().then(axios => axios.interceptors.request.use(callback));
  }

  responseMiddleware(callback: Parameters<AxiosInstance['interceptors']['response']['use']>[0]) {
    return this.getHttp().then(axios => axios.interceptors.response.use(callback));
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
      let axiosInstance = await this.getHttp();
      return await axiosInstance(options);
    } catch (e) {
      (e as any).originMessage = (e as Error).message;

      const err = e as AxiosError<any>;

      if (err.response?.data?.message) {
        err.message = err.response.data.message;
      }

      throw err;
    }

    // let reqOptions = options;
    // let reqUrl = url;
    // let reqHeaders = headers;
    //
    // if (typeof reqUrl === 'object') {
    //   reqOptions = reqUrl;
    //   reqUrl = reqOptions.url;
    // }
    //
    // const isFormData = data instanceof FormData;
    //
    // if (isFormData) {
    //   reqOptions.processData = false;
    //   reqOptions.contentType = false;
    // }
    //
    // if (typeof reqOptions.dataType === 'undefined') {
    //   reqOptions.dataType = 'json';
    // }
    //
    // reqOptions.data = typeof data === 'string' || isFormData
    //   ? data
    //   : $.extend(true, {}, this.data, reqOptions.data, data);
    //
    // reqOptions.type = method.toUpperCase() || 'GET';
    // const { type } = reqOptions;
    //
    // if (['POST', 'GET'].indexOf(reqOptions.type) === -1 && this.config.customMethod) {
    //   reqHeaders['X-HTTP-Method-Override'] = reqOptions.type;
    //   reqOptions.data._method = reqOptions.type;
    //   reqOptions.type = 'POST';
    // }
    //
    // reqOptions.headers = $.extend(
    //   true,
    //   {},
    //   this.headers._global,
    //   this.headers[type],
    //   reqOptions.headers,
    //   reqHeaders,
    // );
    //
    // return this.$.ajax(reqUrl, reqOptions)
    //   .fail((xhr, error) => {
    //     if (error === 'parsererror') {
    //       // eslint-disable-next-line no-param-reassign
    //       xhr.statusText = 'Unable to parse data.';
    //     } else {
    //       xhr.statusText = decodeURIComponent(xhr.statusText);
    //     }
    //   });
  }

  /**
   * Set custom method with _method parameter.
   *
   * This method will return a clone of this object to help us send request once.
   *
   * @param {boolean} useHeader
   *
   * @returns {Promise<this>}
   */
  customMethod(useHeader = true) {
    const clone = this;
    clone.axios = undefined;

    return clone.requestMiddleware((config) => {
      if (useHeader) {
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

      config.method = 'POST';

      return config;
    }).then(() => clone);
  }

  async errorClass() {
    const axios = await this.globalAxios!;

    return axios.AxiosError;
  }
}
