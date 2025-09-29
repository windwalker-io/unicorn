import { AxiosResponseHeaders } from 'axios';
import { Mixin } from 'ts-mixer';
import { createQueue, useHttpClient } from '../composable';
import { EventHandler, EventMixin } from '../events';
import type { MaybePromise } from '../types';
import { mergeDeep } from '../utilities';
import { ApiReturn } from './http-client';

declare type RoutingOptions = {
  init: string;
  sign: string;
  complete: string;
  abort: string;
} | ((action: RouteActions) => MaybePromise<string>);

declare type RouteActions = 'init' | 'sign' | 'complete' | 'abort';
declare type RequestHandler = <T = Record<string, any>>(action: RouteActions, data: Record<string, any>) => Promise<T>;

export interface S3MultipartUploaderOptions {
  profile?: string;
  chunkSize: number;
  concurrency: number;
  routes: RoutingOptions;
  requestHandler?: RequestHandler;
  onProgress?: ProgressEventHandler;
  ACL?: string;
  extra?: Record<string, any>;

  // maxRetries?: number;
  // endpoint: string;
  // subfolder?: string;
}

const defaultOptions: Partial<S3MultipartUploaderOptions> = {
  chunkSize: 5 * 1024 * 1024, // 5MB
  concurrency: 2,
};

export interface S3MultipartUploaderRequestOptions {
  onProgress?: ProgressEventHandler;
  filename?: string;
  ContentType?: string;
  ContentDisposition?: string;
  ACL?: string;
  extra?: Record<string, any>;
}

export class S3MultipartUploader extends Mixin(EventMixin) {
  options: S3MultipartUploaderOptions;

  constructor(options: Partial<S3MultipartUploaderOptions>) {
    super();
    this.options = mergeDeep({}, defaultOptions, options);
  }

  async upload(
    file: string | File | Blob,
    path: string,
    options: S3MultipartUploaderRequestOptions = {}
  ): Promise<{ url: string; }> {
    const extra: Record<string, any> = { ...(this.options.extra ?? {}), ...(options.extra ?? {}) };

    if (typeof file === 'string') {
      file = new Blob([file], { type: options['ContentType'] || 'text/plain' });
    }

    if (file instanceof Blob) {
      if (path.endsWith('.{ext}')) {
        throw new Error('If using Blob or file data string, you must provide a valid file extension in the path.');
      }

      file = new File([file], 'blob', { type: file.type });
    }

    if (file instanceof File) {
      extra['ContentType'] = options['ContentType'] || file.type;
    }

    if (options.ACL || this.options.ACL) {
      extra.ACL = options.ACL || this.options.ACL;
    }

    path = this.replaceExt(path, file);

    const initData: Record<string, any> = { extra, path, profile: this.options.profile };

    if (options['filename']) {
      initData['filename'] = options['filename'];
    }

    this.trigger('start', file, initData);

    // @Request sign
    const { id } = await this.request<{ id: string; }>(
      'init',
      initData
    );

    try {
      const chunkSize = this.options.chunkSize;
      const chunks = Math.ceil(file.size / chunkSize);

      let uploadedBytes = 0;
      let parts: { ETag: string, PartNumber: number }[] = [];
      let currentPart = 1;
      const queue = createQueue(this.options.concurrency);
      const promises = [];

      // Loop from 1 to chunks
      while (currentPart <= chunks) {
        const partNumber = currentPart;

        // Push to queue
        const p = queue.push(async () => {
          const { blob, etag } = await this.uploadPart(file as File, { id, path, partNumber, chunkSize });

          uploadedBytes += blob.size;

          this.updateProgress(uploadedBytes, file.size, options);

          parts.push({ ETag: etag, PartNumber: partNumber });
        });

        promises.push(p);

        currentPart++;
      }

      await Promise.all(promises);

      // @Request sign
      const { url } = await this.request<{ url: string }>(
        'complete',
        {
          id,
          path,
          parts: parts.sort((a, b) => a.PartNumber - b.PartNumber),
          profile: this.options.profile,
        },
      );

      this.trigger('success', url);

      return { url };
    } catch (e) {
      await this.abort(id, path);

      throw e;
    }
  }

  protected async uploadPart(file: File, payload: { id: string; path: string; partNumber: number; chunkSize: number; }) {
    const http = await useHttpClient();
    const { id, path, partNumber, chunkSize } = payload;

    const start = (partNumber - 1) * chunkSize;
    const end = Math.min(partNumber * chunkSize, file.size);

    const blob = file.slice(start, end);

    // @Request sign
    const { url } = await this.request<{ url: string; }>(
      'sign',
      {
        id,
        path,
        partNumber,
        profile: this.options.profile,
      }
    );

    // PUT to S3
    const res = await http.put(url, blob);

    const etag = String((res.headers as AxiosResponseHeaders).get('ETag') || '');

    return { blob, etag };
  }

  protected async request<T = Record<string, any>>(action: RouteActions, body: Record<string, any>): Promise<T> {
    if (this.options.requestHandler) {
      return this.options.requestHandler<T>(action, body);
    }

    const http = await useHttpClient();

    const res = await http.post<ApiReturn<T>>(await this.resolveRoute(action), body);

    return res.data.data;
  }

  async abort(id: string, path: string) {
    await this.request(
      'abort',
      {
        id,
        path,
        profile: this.options.profile,
      }
    );
  }

  updateProgress(loaded: number, total: number, options: S3MultipartUploaderRequestOptions) {
    const percent = (loaded / total) * 100;

    const event = { percent, loaded, total };

    this.trigger('progress', event);

    this.options.onProgress?.(event);

    if (options.onProgress) {
      options.onProgress(event);
    }
  }

  async resolveRoute(action: RouteActions): Promise<string> {
    if (typeof this.options.routes === 'function') {
      return this.options.routes(action);
    }

    return this.options.routes[action];
  }

  replaceExt(path: string, file: File | Blob): string {
    if (file instanceof File) {
      const fileExt = file.name.split('.').pop();

      if (path.endsWith('.{ext}')) {
        return path.replace(/\.{ext}$/, fileExt ? '.' + fileExt : '');
      }
    }

    return path;
  }

  on(
    event: 'start',
    handler: (file: File, data: { path: string; extra: Record<string, any>; [name: string]: any; }) => void
  ): this;
  on(event: 'success', handler: (url: string) => void): this;
  on(event: 'progress', handler: (event: ProgressEvent) => void): this;
  on(event: string | string[], handler: EventHandler): this {
    return super.on(event, handler);
  }
}

type ProgressEvent = {
  percent: number;
  loaded: number;
  total: number;
};
type ProgressEventHandler = (e: ProgressEvent) => void;

export interface S3MultipartUploaderModule {
  S3MultipartUploader: typeof S3MultipartUploader;
}
