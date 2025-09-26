import type { S3Uploader, S3UploaderGlobalOptions } from '../module/s3-uploader';

export async function useS3Uploader(): Promise<typeof import('../module/s3-uploader')>;
export async function useS3Uploader(name: string, options?: Partial<S3UploaderGlobalOptions>): Promise<S3Uploader>;
export async function useS3Uploader(name?: string, options: Partial<S3UploaderGlobalOptions> = {}): Promise<any> {
  const module = await import('../module/s3-uploader');

  if (!name) {
    return module;
  }

  const { get } = module;

  return get(name, options);
}
