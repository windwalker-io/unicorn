import {
  S3MultipartUploader,
  S3MultipartUploaderModule,
  S3MultipartUploaderOptions
} from '../module/s3-multipart-uploader';
import type { S3Uploader, S3UploaderGlobalOptions, S3UploaderModule } from '../module/s3-uploader';

export async function useS3Uploader(): Promise<S3UploaderModule>;
export async function useS3Uploader(name: string, options?: Partial<S3UploaderGlobalOptions>): Promise<S3Uploader>;
export async function useS3Uploader(name?: string, options: Partial<S3UploaderGlobalOptions> = {}): Promise<any> {
  const module = await import('../module/s3-uploader');

  if (!name) {
    return module;
  }

  const { get } = module;

  return get(name, options);
}

export async function useS3MultipartUploader(): Promise<S3MultipartUploaderModule>;
export async function useS3MultipartUploader(options: Partial<S3MultipartUploaderOptions>): Promise<S3MultipartUploader>;
export async function useS3MultipartUploader(options?: Partial<S3MultipartUploaderOptions>): Promise<any> {
  const module = await import('../module/s3-multipart-uploader');

  if (options != null) {
    return new module.S3MultipartUploader(options);
  }

  return module;
}
