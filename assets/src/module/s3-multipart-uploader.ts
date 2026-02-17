import { AxiosProgressEvent, type AxiosRequestConfig, AxiosResponseHeaders } from 'axios';
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
  leaveAlert?: boolean;
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
  ACL?: 'public-read' | 'private' | 'authenticated-read' | 'public-read-write' | string;
  extra?: Record<string, any>;
  abortController?: AbortController;
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
  ): Promise<{ url: string; id: string; path: string; }> {
    const extra: Record<string, any> = { ...(this.options.extra ?? {}), ...(options.extra ?? {}) };

    if (typeof file === 'string') {
      file = new Blob([file], { type: options['ContentType'] || 'text/plain' });
    }

    if (file instanceof Blob && !(file instanceof File)) {
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

    // Prepare unload
    const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    if (this.options.leaveAlert === true) {
      window.addEventListener('beforeunload', beforeUnloadHandler);
    }

    let uploadId: string | null = null;
    let isCancel = false;
    let signal = options.abortController?.signal;

    if (signal) {
      signal.addEventListener('abort', (e) => {
        isCancel = true;
      });
    }

    try {
      // @Request init
      const { id } = await this.request<{ id: string; }>(
        'init',
        initData
      );

      uploadId = id;

      this.trigger('inited', { id, path });

      const chunkSize = this.options.chunkSize;
      const chunks = Math.ceil(file.size / chunkSize);

      let uploadedBytes = 0;
      let parts: { ETag: string, PartNumber: number }[] = [];
      let currentPart = 1;
      const queue = createQueue(this.options.concurrency);
      const promises = [];
      const partsUploaded: Record<number, number> = {};

      // Loop from 1 to chunks
      while (currentPart <= chunks) {
        const partNumber = currentPart;

        // Push to queue
        const p = queue.push(async () => {
          const { blob, etag } = await this.uploadPart(
            file as File,
            {
              id,
              path,
              partNumber,
              chunkSize,
              abortController: options.abortController,
              onUploadProgress: (e) => {
                partsUploaded[partNumber] = e.loaded;

                const uploaded = Object.values(partsUploaded).reduce((sum, a) => sum + a, 0);

                this.updateProgress(uploaded, file.size, options);
              }
            }
          );

          uploadedBytes += blob.size;

          // Use parts progress, ignore the overall progress, which may be inaccurate due to retries or concurrency
          // this.updateProgress(uploadedBytes, file.size, options);

          parts.push({ ETag: etag, PartNumber: partNumber });
        });

        promises.push(p);

        currentPart++;
      }

      await Promise.all(promises);

      if (isCancel) {
        const e = new Error('Upload cancelled');
        e.name = 'CanceledError';

        throw e;
      }

      // @Request complete
      const { url } = await this.request<{ url: string }>(
        'complete',
        {
          id,
          path,
          parts: parts.sort((a, b) => a.PartNumber - b.PartNumber),
          profile: this.options.profile,
        },
      );

      this.trigger('success', { id, path, url });

      return { url, id, path };
    } catch (e) {
      if (uploadId) {
        await this.abort(uploadId, path);
      }

      this.trigger('failure', { error: e as Error, uploadId, path });

      throw e;
    } finally {
      if (this.options.leaveAlert === true) {
        window.removeEventListener('beforeunload', beforeUnloadHandler);
      }
    }
  }

  protected async uploadPart(
    file: File,
    payload: {
      id: string;
      path: string;
      partNumber: number;
      chunkSize: number;
      abortController?: AbortController;
      onUploadProgress: (e: AxiosProgressEvent) => void;
    }
  ) {
    const http = await useHttpClient();
    const { id, path, partNumber, chunkSize, onUploadProgress } = payload;

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
      },
      {
        signal: payload.abortController?.signal,
      }
    );

    // PUT to S3
    const res = await http.put(
      url,
      blob,
      {
        onUploadProgress,
      }
    );

    const etag = String((res.headers as AxiosResponseHeaders).get('ETag') || '');

    return { blob, etag };
  }

  protected async request<T = Record<string, any>>(
    action: RouteActions,
    body: Record<string, any>,
    config: Partial<AxiosRequestConfig> = {}
  ): Promise<T> {
    if (this.options.requestHandler) {
      return this.options.requestHandler<T>(action, body);
    }

    const http = await useHttpClient();

    const res = await http.post<ApiReturn<T>>(await this.resolveRoute(action), body, config);

    return res.data.data;
  }

  // protected async abortBeacon(id: string, path: string): Promise<void> {
  //   const data = new FormData();
  //   data.append('id', id);
  //   data.append('path', path);
  //   data.append('profile', this.options.profile || '');
  //
  //   await navigator.sendBeacon(route(await this.resolveRoute('abort')), data);
  // }

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
    const percentage = (loaded / total) * 100;

    const event: ProgressEvent = { percentage, loaded, total };

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

  setChunkSize(size: number): this {
    this.options.chunkSize = size;

    return this;
  }

  setChunkSizeInMiB(size: number): this {
    this.options.chunkSize = size * 1024 * 1024;

    return this;
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
  on(event: 'inited', handler: (event: { id: string; path: string; }) => void): this;
  on(event: 'success', handler: (event: { url: string; id: string; path: string; }) => void): this;
  on(event: 'progress', handler: (event: ProgressEvent) => void): this;
  on(event: 'failure', handler: (event: { error: Error; id: string; path: string; }) => void): this;
  on(event: string | string[], handler: EventHandler): this {
    return super.on(event, handler);
  }
}

type ProgressEvent = {
  percentage: number;
  loaded: number;
  total: number;
};
type ProgressEventHandler = (e: ProgressEvent) => void;

export interface S3MultipartUploaderModule {
  S3MultipartUploader: typeof S3MultipartUploader;
}
