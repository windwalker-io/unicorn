import { S3Uploader, S3UploaderGlobalOptions } from '../module/s3-uploader';
export declare function useS3Uploader(): Promise<typeof import('../module/s3-uploader')>;
export declare function useS3Uploader(name: string, options?: Partial<S3UploaderGlobalOptions>): Promise<S3Uploader>;
