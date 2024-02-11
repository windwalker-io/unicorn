
// import type UnicornAlpine2 from '@/unicorn/plugin/alpine2';
// import type UnicornHttp from '@/unicorn/plugin/http';
// import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
// import { getInstance } from './modules/aws/s3-uploader';
// import { UIBootstrap5 } from './modules/ui/ui-bootstrap5';
// import { UnicornFormValidation, UnicornFieldValidation } from './modules/ui/validation-components';
// import { EventMixin } from './unicorn/events';
// import UnicornApp from './unicorn/app';
// import { MixinBuilder, Mixin } from './unicorn/mixwith';
// import UnicornAnimate from './unicorn/plugin/animate';
// import UnicornCrypto from './unicorn/plugin/crypto';
// import UnicornDirective from './unicorn/plugin/directive';
// import UnicornForm, { UnicornFormElement } from './unicorn/plugin/form';
// import UnicornGrid, { UnicornGridElement } from './unicorn/plugin/grid';
// import UnicornHelper from './unicorn/plugin/helper';
// import UnicornLang from './unicorn/plugin/lang';
// import UnicornLoader from './unicorn/plugin/loader';
// import UnicornQueue, { SimpleQueue } from './unicorn/plugin/queue';
// import UnicornRouter from './unicorn/plugin/router';
// import UnicornStack, { Stack } from './unicorn/plugin/stack';
// import UnicornTinymce from './unicorn/plugin/tinymce';
// import UnicornUI from './unicorn/plugin/ui';
// import UnicornUri from './unicorn/plugin/uri';
// import UnicornValidation from './unicorn/plugin/validation';

// declare global {
//   var u: Unicorn;
//   var Unicorn: Unicorn['constructor'];
//   var S3Uploader: S3Uploader['constructor'];
// }
//
// export interface Unicorn extends UnicornApp {
//   constructor: {
//     createApp(): Unicorn;
//     noConflict(): Unicorn;
//     mix<T>(superclass: T): MixinBuilder;
//     Mixin<T>(mixin: (superclass: Function) => T): T;
//     EventMixin: typeof EventMixin;
//   }
//
//   tap<T>(value: T, callback: ((T) => void)): T;
//   // data(name: string, data: any): any;
//   // data(name: string): any;
//   // data(ele: Element, name: string): any;
//   // data(ele: Element, name: string, data?: any): any;
//   use(plugin: any, options?: any): this;
//   // removeData(name: string): any;
//   // removeData(ele: Element, name: string): any;
//   on(event: string|string[], handler: Function): this;
//   once(event: string|string[], handler: Function): this;
//   off(event: string, handler?: Function): this;
//   trigger(event: string|string[], ...args: any[]): this;
//   listeners(event: string): Function[];
//   uri(type: string): string|undefined;
//   asset(type: string): string|undefined;
//   wait(callback: (resolve: Function, reject: Function) => void): Promise<any>;
//   completed(): Promise<any>;
//
//   // alpine2
//   $alpine2: UnicornAlpine2;
//
//   // animate.ts
//   $animate: UnicornAnimate;
//   animate: typeof UnicornAnimate.prototype.to;
//
//   // crypto.js
//   $crypto: UnicornCrypto;
//   base64Encode(string: string):  string;
//   base64Decode(string: string): string;
//   uuid4(): string;
//   uid(prefix?: string, timebase?: boolean): string;
//   tid(prefix?: string): string;
//   md5(str: string): string;
//   serial(): number;
//
//   // directive.js
//   $directive: UnicornDirective;
//   directive(name: string, handler: UnicornDirectiveHandler): void;
//
//   // lang.js
//   $lang: UnicornLang;
//   __(text: string, ...args: any[]): string;
//   trans(text: string, ...args: any[]): string;
//
//   // validation.js
//   $validation: UnicornValidation;
//   formValidation(selector?: string): Promise<UnicornFormValidation|null>;
//
//   // router.js
//   $router: UnicornRouter;
//   route(route: string, query?: any): string;
//
//   $grid: UnicornGrid;
//   grid(ele?: string|Element, options?: object): UnicornGridElement;
//
//   $form: UnicornForm;
//   form(ele?: string|Element, options?: object): UnicornFormElement;
//
//   // ui.js
//   $ui: UnicornUIExtended & UnicornUI;
//   addMessage(messages: string[]|string, type?: string): void;
//   clearMessages(): void;
//   notify(messages: string|string[], type?: string): void;
//   clearNotifies(): void;
//   loadAlpine(callback?: () => void): Promise<any>;
//   initAlpine(directive: string): Promise<any>;
//   beforeAlpineInit(callback: () => void): void;
//   prepareAlpine(callback: () => void): void;
//   webComponentPolyfill(): Promise<any>;
//   defineCustomElement(name: string, constructor: CustomElementConstructor, options?: ElementDefinitionOptions): Promise<any>;
//
//   // loader.js
//   $loader: UnicornLoader;
//   import: typeof UnicornLoader.prototype.import;
//   importSync: typeof UnicornLoader.prototype.importSync;
//   importCSS: typeof UnicornLoader.prototype.importCSS;
//   minFileName: typeof UnicornLoader.prototype.minFileName;
//   afterImported: typeof UnicornLoader.prototype.afterImported;
//
//   // helper.js
//   $helper: UnicornHelper;
//   domready: (callback?: () => any) => Promise<any>;
//   selectOne: typeof UnicornHelper.prototype.selectOne;
//   selectAll: typeof UnicornHelper.prototype.selectAll;
//   // selectOne<E extends Element = Element>(ele: E): E;
//   // selectOne<K extends keyof HTMLElementTagNameMap>(ele: K): HTMLElementTagNameMap[K]|null;
//   // selectOne<E extends Element = Element>(ele: string|E): E|null;
//   // selectOne(ele: string): Element;
//   // selectAll<E extends Element = Element>(ele: string, callback?: ((ele: E) => any)): NodeListOf<E>;
//   // selectAll<E extends Element = Element>(ele: NodeListOf<E>|E[], callback?: ((ele: E) => any)): E[];
//   // selectAll<E extends keyof HTMLElementTagNameMap>(ele: E, callback?: ((ele: HTMLElementTagNameMap[E]) => any)): HTMLElementTagNameMap[E][];
//   // selectAll(ele: string, callback?: ((ele: Element) => any)): Element[];
//   each: typeof UnicornHelper.prototype.selectAll;
//   getBoundedInstance: typeof UnicornHelper.prototype.getBoundedInstance;
//   // getBoundedInstance<M, E extends Element = Element>(selector: E, name: string, callback?: ((ele: E) => M)): M;
//   // getBoundedInstance<M, E extends keyof HTMLElementTagNameMap>(selector: E, name: string, callback?: ((ele: HTMLElementTagNameMap[E]) => M)): M;
//   // getBoundedInstance<M>(selector: string, name: string, callback?: ((ele: Element) => M)): M;
//   getBoundedInstanceList: typeof UnicornHelper.prototype.getBoundedInstanceList;
//   // getBoundedInstanceList<M, E extends Element = Element>(selector: NodeListOf<E>|E[], name: string, callback?: ((ele: E) => M)): M[];
//   // getBoundedInstanceList<M, E extends keyof HTMLElementTagNameMap>(selector: E, name: string, callback?: ((ele: HTMLElementTagNameMap[E]) => M)): M[];
//   // getBoundedInstanceList<M>(selector: string, name: string, callback?: ((ele: M) => M)): M[];
//   module: typeof UnicornHelper.prototype.module;
//   // module<M, E extends Element = Element>(selector: E[]|NodeListOf<E>, name: string, callback?: ((ele: E) => M)): M[];
//   // module<M, E extends Element = Element>(selector: E, name: string, callback?: ((ele: E) => M)): M;
//   // module<M, E extends keyof HTMLElementTagNameMap>(selector: E, name: string, callback?: ((ele: HTMLElementTagNameMap[E]) => M)): M;
//   // module<M>(selector: string, name: string, callback?: ((ele: Element) => M)): M;
//   h: typeof UnicornHelper.prototype.h;
//   html: typeof UnicornHelper.prototype.html;
//   $get: typeof UnicornHelper.prototype.get;
//   $set: typeof UnicornHelper.prototype.set;
//   delegate: typeof UnicornHelper.prototype.delegate;
//   debounce: typeof UnicornHelper.prototype.debounce;
//   throttle: typeof UnicornHelper.prototype.throttle;
//   isDebug: typeof UnicornHelper.prototype.isDebug;
//   confirm: typeof UnicornHelper.prototype.confirm;
//   alert: typeof UnicornHelper.prototype.alert;
//   numberFormat: typeof UnicornHelper.prototype.numberFormat;
//   sprintf: typeof sprintf;
//   vsprintf: typeof vsprintf;
//   genRandomString: typeof UnicornHelper.prototype.genRandomString;
//   defaultsDeep: typeof UnicornHelper.prototype.defaultsDeep;
//
//   // http.js
//   $http: UnicornHttp;
//
//   // uri.js
//   $uri: UnicornUri & UnicornUriExtended;
//
//   // stack.js
//   $stack: UnicornStack;
//   stack(name: string, store?: any[]): Stack;
//
//   // queue.js
//   $queue: UnicornQueue;
//   queue(name: string, maxRunning?: number): SimpleQueue;
// }
//
// export interface UnicornPlugin {
//   constructor: {
//     is?: string;
//   }
//   install?(app: UnicornApp, options?: any): void;
//   uninstall?(app: UnicornApp, options?: any): void;
// }
//
// // Validation
// export interface Validator {
//   handler: ValidationHandler;
//   options: ValidationOptions;
// }
// export type ValidationHandler = (value: any, element: Element, options: { [name: string]: any }, field: UnicornFieldValidation) => boolean|string|undefined;
// export interface ValidationOptions {
//   notice?: string | ((input: Element, field: UnicornFieldValidation) => string);
// }
//
// // UI
// export interface UnicornUIExtended {
//   tinymce: UnicornTinymce;
//   bootstrap: UIBootstrap5;
//   theme: UIBootstrap5;
// }
//
// // Http
// export type UnicornHttpOptions = AxiosRequestConfig | {
//   vars?: Record<string, any>;
// };
//
// // export interface UnicornHttp {
// //   axios: AxiosInstance;
// //   createHttp(): Promise<AxiosInstance>;
// //   getHttp(): Promise<AxiosInstance>;
// //   prepareAxios(axios: AxiosInstance): void;
// //   requestMiddleware(callback: (config: UnicornHttpOptions) => AxiosRequestConfig): void;
// //   get(url: string, options?: UnicornHttpOptions): Promise<AxiosResponse>;
// //   post(url: string, data?: any, options?: UnicornHttpOptions): Promise<AxiosResponse>;
// //   put(url: string, data?: any, options?: UnicornHttpOptions): Promise<AxiosResponse>;
// //   patch(url: string, data?: any, options?: UnicornHttpOptions): Promise<AxiosResponse>;
// //   delete(url: string, data?: any, options?: UnicornHttpOptions): Promise<AxiosResponse>;
// //   head(url: string, options?: UnicornHttpOptions): Promise<AxiosResponse>;
// //   options(url: string, options?: UnicornHttpOptions): Promise<AxiosResponse>;
// //   request(options: UnicornHttpOptions): Promise<AxiosResponse>;
// // }
//
// // Uri
// export interface UnicornUriExtended {
//   asset: {
//     path(path: string): string;
//     root(path: string): string;
//   }
// }
//
// // S3Uploader
// export interface S3Uploader {
//   constructor: {
//     getInstance(name: string, options?: S3UploaderGlobalOptions): S3Uploader;
//     get(name: string, options?: S3UploaderGlobalOptions): Promise<S3Uploader>;
//     create(name: string, options?: S3UploaderGlobalOptions): S3Uploader;
//     destory(name: string): void;
//   }
//   upload(file: string|Blob|File, path: string, options?: S3UploaderRequestOptions): Promise<S3UploaderResponse>;
// }
//
// export interface S3UploaderResponse extends AxiosResponse {
//   url: string;
// }
//
// export interface S3UploaderGlobalOptions {
//   endpoint?: string;
//   subfolder?: string;
//   viewerHost?: string;
//   starts_with: any[];
//   formInputs?: {
//     acl: string;
//     bucket: string;
//     key: string;
//     Policy: string;
//     'X-Amz-Algorithm': string;
//     'X-Amz-Credential': string;
//     'X-Amz-Date': string;
//     'X-Amz-Signature': string;
//     [name: string]: any
//   },
// }
//
// export interface S3UploaderRequestOptions {
//   formInputs?: { [name: string]: any };
//   onUploadProgress?: (e: ProgressEvent) => void;
//   'Content-Type'?: string;
//   'Content-Disposition'?: string;
//   key?: string;
//   [name: string]: any
// }
//
// export interface UnicornPlugin {
//   install(app: UnicornApp): void;
// }
