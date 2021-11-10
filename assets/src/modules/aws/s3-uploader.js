/**
 * Part of datavideo project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

import { defaultsDeep } from 'lodash-es';

const instances = {};
const promises = {};
const resolves = {};

/**
 * @param {string} name
 * @param {*}      args
 *
 * @returns {S3Uploader}
 */
export function getInstance(name, ...args) {
  if (!instances[name]) {
    instances[name] = new S3Uploader(name, ...args);

    if (resolves[name]) {
      resolves[name](instances[name]);
      delete resolves[name];
    }
  }

  return instances[name];
}

export function get(name) {
  if (instances[name]) {
    return Promise.resolve(instances[name]);
  }

  if (!promises[name]) {
    promises[name] = new Promise((resolve) => {
      resolves[name] = resolve;
    });
  }

  return promises[name];
}

export function destroy(name) {
  delete instances[name];
}

class S3Uploader extends Unicorn.EventMixin(class {}) {
  static defaultOptions = {
    endpoint: '',
    subfolder: '',
    viewerHost: '',
    starts_with: [],
    formInputs: {
      acl: '',
      bucket: '',
      key: '',
      Policy: '',
      'X-Amz-Algorithm': '',
      'X-Amz-Credential': '',
      'X-Amz-Date': '',
      'X-Amz-Signature': '',
    }
  };

  constructor(name, options = {}) {
    super();

    this.name = name;
    this.options = defaultsDeep({}, options, this.constructor.defaultOptions);
  }

  /**
   * Do upload.
   *
   * @param {string|File|Blob} file
   * @param {string}           path
   * @param {Object}           options
   *
   * @returns {Promise}
   */
  upload(file, path, options = {}) {
    const fileData = new FormData();
    const inputs = defaultsDeep({}, this.options.formInputs);

    if (typeof file === 'string') {
      file = new Blob([file], {type: options['Content-Type'] || 'text/plain'});
    }

    if (file instanceof Blob || file instanceof File) {
      options['Content-Type'] = options['Content-Type'] || file.type;
    }

    if (options['filename']) {
      options['Content-Disposition'] = 'attachment; filename*=UTF-8\'\'' + encodeURIComponent(options['filename']);
    }

    options['key'] = this.constructor.trimSlashes(this.options.subfolder) + '/'
      + this.constructor.trimSlashes(path);
    options['key'] = this.constructor.trimSlashes(options['key']);
    options['Content-Type'] = options['Content-Type'] || null;
    options['Content-Disposition'] = options['Content-Disposition'] || null;

    // Prepare pre-signed data
    for (let key in inputs) {
      fileData.set(key, inputs[key]);
    }

    // Prepare custom data
    for (let key of Object.keys(this.options.starts_with)) {
      if (options[key]) {
        fileData.set(key, options[key]);
      }
    }

    fileData.append('file', file);

    this.trigger('start', fileData);

    return u.$http.post(
      this.options.endpoint,
      fileData,
      {
        onUploadProgress: (e) => {
          this.trigger('upload-progress', e);

          if (e.lengthComputable) {
            this.trigger('progress', e.loaded / e.total, e);
          }
        }
      }
    )
      .then((res) => {
        const url = this.options.viewerHost + '/'
          + this.constructor.trimSlashes(path);

        this.trigger('success', url, res);
        return res;
      })
      .finally(() => {
        this.trigger('end');
      });

    // return $.post({
    //     url: this.options.endpoint,
    //     data: fileData,
    //     processData: false,
    //     contentType: false,
    //     type: 'POST',
    //     xhr: () => {
    //       const xhr = new XMLHttpRequest();
    //
    //       if(xhr.upload){
    //         xhr.upload.addEventListener('progress', e => {
    //           this.trigger('upload-progress', e);
    //
    //           if (e.lengthComputable) {
    //             this.trigger('progress', e.loaded / e.total, e);
    //           }
    //         }, false);
    //       }
    //
    //       return xhr;
    //     },
    //   })
    //   .done((res, textStatus, xhr) => {
    //     const url = this.options.endpoint + '/'
    //       + this.constructor.trimSlashes(this.options.subfolder) + '/'
    //       + this.constructor.trimSlashes(path);
    //
    //     this.trigger('success', url, xhr);
    //   })
    //   .fail((xhr) => {
    //     this.trigger('fail', xhr);
    //   })
    //   .always(() => {
    //     this.trigger('end');
    //   });
  }

  static trimSlashes(str) {
    return str.replace(/^\/+|\/+$/g, '');
  }
}
