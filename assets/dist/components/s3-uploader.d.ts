import { EventAwareInterface, EventMixin } from '../events';
import { UnicornHttpClient } from '../components/http-client';
import { AxiosProgressEvent, AxiosResponse } from 'axios';
export declare function get(name: string, options?: Partial<S3UploaderGlobalOptions>): S3Uploader;
export declare function create(name: string, options?: Partial<S3UploaderGlobalOptions>): S3Uploader;
export declare function destroy(name: string): void;
declare const S3Uploader_base: import('ts-mixer/dist/types/types').Class<any[], EventMixin, typeof EventMixin>;
export declare class S3Uploader extends S3Uploader_base implements EventAwareInterface {
    protected name: string;
    options: S3UploaderGlobalOptions;
    http?: UnicornHttpClient;
    constructor(name: string, options?: Partial<S3UploaderGlobalOptions>);
    getHttpClient(): Promise<UnicornHttpClient>;
    /**
     * Do upload.
     */
    upload(file: string | File | Blob, path: string, options?: Partial<S3UploaderRequestOptions>): Promise<S3UploaderResponse>;
}
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
        [name: string]: any;
    };
}
export interface S3UploaderRequestOptions {
    formInputs?: {
        [name: string]: any;
    };
    onUploadProgress?: (e: AxiosProgressEvent) => void;
    'Content-Type'?: string;
    'Content-Disposition'?: string;
    key?: string;
    [name: string]: any;
}
export {};
