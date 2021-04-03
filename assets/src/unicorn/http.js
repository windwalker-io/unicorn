/**
 * Part of Unicorn project.
 *
 * @copyright  Copyright (C) 2016 LYRASOFT. All rights reserved.
 * @license    GNU General Public License version 2 or later.
 */

import { Plugin } from './plugin.js';

export default class UnicornHttp extends Plugin {
  globalAxios;
  axios;

  static get is() { return 'http'; }

  static get proxies() {
    return {
      '$http': 'getSelf'
    };
  }

  static get defaultOptions() {
    return {};
  }

  constructor() {
    super();

    this.config = {
      customMethod: false,
    };

    this.data = {};
  }

  get getSelf() {
    return this;
  }

  createHttp() {
    if (!this.globalAxios) {
      this.globalAxios = this.app.import('@axios');
    }

    return this.globalAxios.then((axios) => {
      return this.axios = axios.create(this.options.axios || {});
    });
  }

  getHttp() {
    if (this.axios) {
      return Promise.resolve(this.axios);
    }

    return this.createHttp().then((axios) => this.axios = axios);
  }

  prepareAxios(axios) {
    axios.interceptors.request.use(function (config) {
      config.headers['X-CSRF-Token'] = this.app.data('csrf-token');

      return config;
    });
  }

  requestMiddleware(callback) {
    return this.getHttp().then(axios => axios.interceptors.request.use(callback));
  }

  responseMiddleware(callback) {
    return this.getHttp().then(axios => axios.interceptors.response.use(callback));
  }

  ready() {
    super.ready();
  }

  /**
   * Send a GET request.
   *
   * @param {string} url
   * @param {Object} options
   *
   * @returns {AxiosResponse}
   */
  get(url, options = {}) {
    options.url = url;
    options.method = 'GET';

    return this.request(options);
  }

  /**
   * Send a POST request.
   *
   * @param {string} url
   * @param {Object|string} data
   * @param {Object} options
   *
   * @returns {AxiosResponse}
   */
  post(url, data, options = {}) {
    options.url = url;
    options.method = 'POST';
    options.data = data;

    return this.request(options);
  }

  /**
   * Send a PUT request.
   *
   * @param {string} url
   * @param {Object|string} data
   * @param {Object} options
   *
   * @returns {AxiosResponse}
   */
  put(url, data, options = {}) {
    options.url = url;
    options.method = 'PUT';
    options.data = data;

    return this.request(options);
  }

  /**
   * Send a PATCH request.
   *
   * @param {string} url
   * @param {Object|string} data
   * @param {Object} options
   *
   * @returns {AxiosResponse}
   */
  patch(url, data, options = {}) {
    options.url = url;
    options.method = 'PATCH';
    options.data = data;

    return this.request(options);
  }

  /**
   * Send a DELETE request.
   *
   * @param {string} url
   * @param {Object|string} data
   * @param {Object} options
   *
   * @returns {AxiosResponse}
   */
  'delete'(url, data, options = {}) {
    options.url = url;
    options.method = 'DELETE';
    options.data = data;

    return this.request(options);
  }

  /**
   * Send a HEAD request.
   *
   * @param {string} url
   * @param {Object} options
   *
   * @returns {AxiosResponse}
   */
  head(url, options = {}) {
    options.url = url;
    options.method = 'HEAD';

    return this.request(options);
  }

  /**
   * Send a OPTIONS request.
   *
   * @param {string} url
   * @param {Object} options
   *
   * @returns {AxiosResponse}
   */
  options(url, options = {}) {
    options.url = url;
    options.method = 'OPTIONS';

    return this.request(options);
  }

  /**
   * Send request.
   *
   * @param {Object} options
   *
   * @returns {Promise<AxiosResponse>}
   */
  request(options) {
    return this.getHttp().then(axios => {
      return axios(options);
    });
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
   * @returns {Promise<this>}
   */
  customMethod(useHeader = true) {
    const clone = this;
    clone.axios = null;

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
}
