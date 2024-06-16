import { AxiosProgressEvent, AxiosResponse } from 'axios';

declare class UnicornApp extends UnicornApp_base {
	plugins: {};
	waits: Promise<any>[];
	options: Record<string, any>;
	constructor(options?: {});
	use(plugin: UnicornPlugin, options?: Record<string, any>): this;
	inject<T>(plugin: string): T;
	detach(plugin: any): this;
	tap<T>(value: T, callback: Function): T;
	data(name: string, data: any): any;
	data(name: string): any;
	data(ele: Element, name: string): any;
	data(ele: Element, name: string, data?: any): any;
	removeData(name: string): any;
	removeData(ele: Element, name: string): any;
	uri(type: string): any;
	asset(type: string): any;
	wait(callback: Function): Promise<any>;
	completed(): Promise<any[]>;
}
declare const S3Uploader_base: any;
declare const UnicornApp_base: any;
export declare class S3Uploader extends S3Uploader_base {
	protected name: string;
	options: S3UploaderGlobalOptions;
	constructor(name: string, options?: Partial<S3UploaderGlobalOptions>);
	/**
	 * Do upload.
	 */
	upload(file: string | File | Blob, path: string, options?: Partial<S3UploaderRequestOptions>): Promise<S3UploaderResponse>;
}
export declare function create(name: string, options?: Partial<S3UploaderGlobalOptions>): S3Uploader;
/**
 * @param {string} name
 */
export declare function destroy(name: string): void;
export declare function get(name: string): Promise<Awaited<S3Uploader>>;
export declare function getInstance(name: string, options?: Partial<S3UploaderGlobalOptions>): S3Uploader;
export declare function init(app: UnicornApp): void;
export interface EventAwareInterface {
	on(event: string | string[], handler: Function): this;
	once(event: string | string[], handler: Function): this;
	off(event: string, handler?: Function): this;
	trigger(event: string | string[], ...args: any[]): this;
	listeners(event: string): Function[];
}
export interface S3Uploader extends EventAwareInterface {
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
		"X-Amz-Algorithm": string;
		"X-Amz-Credential": string;
		"X-Amz-Date": string;
		"X-Amz-Signature": string;
		[name: string]: any;
	};
}
export interface S3UploaderRequestOptions {
	formInputs?: {
		[name: string]: any;
	};
	onUploadProgress?: (e: AxiosProgressEvent) => void;
	"Content-Type"?: string;
	"Content-Disposition"?: string;
	key?: string;
	[name: string]: any;
}
export interface S3UploaderResponse extends AxiosResponse {
	url: string;
}
export interface UnicornApp extends EventAwareInterface {
}
export interface UnicornPlugin {
	install?(app: UnicornApp, options?: any): void;
	uninstall?(app: UnicornApp, options?: any): void;
}

export {};
