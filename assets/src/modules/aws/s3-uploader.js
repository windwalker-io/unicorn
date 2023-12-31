import { defaultsDeep } from 'lodash-es';

const instances = {};

/**
 * @param {string} name
 * @param {S3UploaderGlobalOptions}      options
 *
 * @returns {S3Uploader}
 */
export function getInstance(name, options = {}) {
  if (!instances[name]) {
    instances[name] = create(name, options = {});
  }

  return instances[name];
}

/**
 * @param {string} name
 * @returns {Promise<S3Uploader>}
 * @deprecated No longer needs promise.
 */
export function get(name) {
  return Promise.resolve(create(name));
}

/**
 * @param {string} name
 * @param {S3UploaderGlobalOptions} options
 * @returns {S3Uploader}
 */
export function create(name, options = {}) {
  return new S3Uploader(name, options);
}

/**
 * @param {string} name
 */
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

  /**
   * @param {string} name
   * @param {S3UploaderGlobalOptions} options
   */
  constructor(name, options = {}) {
    super();

    const awsOptions = u.data('@s3.uploder.' + name) || {};

    this.name = name;
    this.options = defaultsDeep({}, options, awsOptions, this.constructor.defaultOptions);
  }

  /**
   * Do upload.
   *
   * @param {string|File|Blob} file
   * @param {string}           path
   * @param {S3UploaderRequestOptions}           options
   *
   * @returns {Promise<S3UploaderResponse>}
   */
  upload(file, path, options = {}) {
    const fileData = new FormData();
    const inputs = defaultsDeep({}, options.formInputs || {}, this.options.formInputs);

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
          if (options.onUploadProgress) {
            options.onUploadProgress(e);
          }

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

        res.url = url;

        return res;
      })
      .finally(() => {
        this.trigger('end');
      });
  }

  static trimSlashes(str) {
    return str.replace(/^\/+|\/+$/g, '');
  }
}

u.$loader.asImported('s3.uploader');
