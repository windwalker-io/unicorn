/// <reference types="../../../types" />

import type { AxiosProgressEvent, AxiosResponse } from 'axios';
import { defaultsDeep } from 'lodash-es';
import type { EventAwareInterface } from '../../unicorn/events';

const instances: Record<string, S3Uploader> = {};

export function getInstance(name: string, options: Partial<S3UploaderGlobalOptions> = {}): S3Uploader {
  if (!instances[name]) {
    instances[name] = create(name, options);
  }

  return instances[name];
}

export function get(name: string): Promise<Awaited<S3Uploader>> {
  return Promise.resolve(create(name));
}

export function create(name: string, options: Partial<S3UploaderGlobalOptions> = {}): S3Uploader {
  return new S3Uploader(name, options);
}

/**
 * @param {string} name
 */
export function destroy(name: string) {
  delete instances[name];
}

const defaultOptions = {
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

class S3Uploader extends Unicorn.mix(class {
}).with(Unicorn.EventMixin) {
  options: S3UploaderGlobalOptions;

  constructor(protected name: string, options: Partial<S3UploaderGlobalOptions> = {}) {
    super();

    const awsOptions = u.data('@s3.uploader.' + name) || {};

    this.options = defaultsDeep({}, options, awsOptions, defaultOptions);
  }

  /**
   * Do upload.
   */
  async upload(
    file: string | File | Blob,
    path: string,
    options: Partial<S3UploaderRequestOptions> = {}
  ): Promise<S3UploaderResponse> {
    const fileData = new FormData();
    const inputs = defaultsDeep({}, options.formInputs || {}, this.options.formInputs);

    if (typeof file === 'string') {
      file = new Blob([file], { type: options['Content-Type'] || 'text/plain' });
    }

    if ((file instanceof Blob) || (file as any) instanceof File) {
      options['Content-Type'] = options['Content-Type'] || file.type;
    }

    if (options['filename']) {
      options['Content-Disposition'] = 'attachment; filename*=UTF-8\'\'' + encodeURIComponent(options['filename']);
    }

    options['key'] = trimSlashes(this.options.subfolder || '') + '/'
      + trimSlashes(path);
    options['key'] = trimSlashes(options['key']);
    options['Content-Type'] = options['Content-Type'] || undefined;
    options['Content-Disposition'] = options['Content-Disposition'] || undefined;

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

    try {
      let res = await u.$http.post(
        this.options.endpoint || '',
        fileData,
        {
          onUploadProgress: (e) => {
            if (options.onUploadProgress) {
              options.onUploadProgress(e);
            }

            this.trigger('upload-progress', e);

            if (e.total != null) {
              this.trigger('progress', e.loaded / e.total, e);
            }
          }
        }
      ) as S3UploaderResponse;

      const url = this.options.viewerHost + '/'
        + trimSlashes(path);

      this.trigger('success', url, res);

      res.url = url;

      return res;
    } finally {
      this.trigger('end');
    }
  }
}

function trimSlashes(str: string) {
  return str.replace(/^\/+|\/+$/g, '');
}

u.$loader.asImported('s3.uploader');

export interface S3UploaderResponse extends AxiosResponse {
  url: string;
}

export interface S3UploaderGlobalOptions {
  endpoint?: string;
  subfolder?: string;
  viewerHost?: string;
  starts_with: any[];
  formInputs?: {
    acl: string;
    bucket: string;
    key: string;
    Policy: string;
    'X-Amz-Algorithm': string;
    'X-Amz-Credential': string;
    'X-Amz-Date': string;
    'X-Amz-Signature': string;
    [name: string]: any
  },
}

export interface S3UploaderRequestOptions {
  formInputs?: { [name: string]: any };
  onUploadProgress?: (e: AxiosProgressEvent) => void;
  'Content-Type'?: string;
  'Content-Disposition'?: string;
  key?: string;

  [name: string]: any;
}

interface S3Uploader extends EventAwareInterface {
  //
}

export { S3Uploader };
