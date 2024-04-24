/// <reference types="./unicorn" />

export * from './unicorn';
import * as S3UploaderGlobal from '../src/modules/aws/s3-uploader';
import type { UIBootstrap5 } from '../src/modules/ui/ui-bootstrap5';
import type {
  MixinBuilder,
  SimpleQueue,
  Stack,
  UnicornAlpine2,
  UnicornAnimate,
  UnicornCrypto,
  UnicornDirective,
  UnicornDirectiveHandler,
  UnicornForm,
  UnicornFormElement,
  UnicornFormValidation,
  UnicornGrid,
  UnicornGridElement,
  UnicornHelper,
  UnicornHttp,
  UnicornLang,
  UnicornLoader,
  UnicornQueue,
  UnicornRouter,
  UnicornStack,
  UnicornTinymce,
  UnicornUI,
  UnicornUri,
  UnicornValidation
} from './unicorn';
import { UnicornApp } from './unicorn';

declare global {
    var u: Unicorn;
    var Unicorn: Unicorn['constructor'];
    var S3Uploader: typeof S3UploaderGlobal;
}

export interface Unicorn extends UnicornApp {
    constructor: {
        createApp(): Unicorn;
        noConflict(): Unicorn;
        mix<T>(superclass: T): MixinBuilder;
        Mixin<T>(mixin: (superclass: Function) => T): T;
        EventMixin: typeof EventMixin;
    };

    // alpine2
    $alpine2: UnicornAlpine2;

    // animate.ts
    $animate: UnicornAnimate;
    animate: typeof UnicornAnimate.prototype.to;

    // crypto.js
    $crypto: UnicornCrypto;

    base64Encode(string: string): string;

    base64Decode(string: string): string;

    uuid4(): string;

    uid(prefix?: string, timebase?: boolean): string;

    tid(prefix?: string): string;

    md5(str: string): string;

    serial(): number;

    // directive.js
    $directive: UnicornDirective;

    directive<T extends Element = HTMLElement>(name: string, handler: UnicornDirectiveHandler<T>): void;

    // lang.js
    $lang: UnicornLang;

    __(text: string, ...args: any[]): string;

    trans(text: string, ...args: any[]): string;

    // validation.js
    $validation: UnicornValidation;

    formValidation(selector?: string): Promise<UnicornFormValidation | null>;

    // router.js
    $router: UnicornRouter;

    route(route: string, query?: any): string;

    $grid: UnicornGrid;

    grid(ele?: string | Element, options?: object): UnicornGridElement;

    $form: UnicornForm;

    form(ele?: string | Element, options?: object): UnicornFormElement;

    // ui.js
    $ui: UnicornUIExtended & UnicornUI;

    addMessage(messages: string[] | string, type?: string): void;

    clearMessages(): void;

    notify(messages: string | string[], type?: string): void;

    clearNotifies(): void;

    loadAlpine(callback?: () => void): Promise<any>;

    initAlpine(directive: string): Promise<any>;

    beforeAlpineInit(callback: () => void): void;

    prepareAlpine(callback: () => void): void;

    webComponentPolyfill(): Promise<any>;

    defineCustomElement(name: string,
                        constructor: CustomElementConstructor,
                        options?: ElementDefinitionOptions): Promise<any>;

    // loader.js
    $loader: UnicornLoader;
    import: typeof UnicornLoader.prototype.import;
    importSync: typeof UnicornLoader.prototype.importSync;
    importCSS: typeof UnicornLoader.prototype.importCSS;
    minFileName: typeof UnicornLoader.prototype.minFileName;
    afterImported: typeof UnicornLoader.prototype.afterImported;

    // helper.js
    $helper: UnicornHelper;
    domready: (callback?: () => any) => Promise<any>;
    selectOne: typeof UnicornHelper.prototype.selectOne;
    selectAll: typeof UnicornHelper.prototype.selectAll;
    each: typeof UnicornHelper.prototype.selectAll;
    getBoundedInstance: typeof UnicornHelper.prototype.getBoundedInstance;
    getBoundedInstanceList: typeof UnicornHelper.prototype.getBoundedInstanceList;
    // getBoundedInstanceList<M, E extends Element = Element>(selector: NodeListOf<E>|E[], name: string, callback?: ((ele: E) => M)): M[];
    // getBoundedInstanceList<M, E extends keyof HTMLElementTagNameMap>(selector: E, name: string, callback?: ((ele: HTMLElementTagNameMap[E]) => M)): M[];
    // getBoundedInstanceList<M>(selector: string, name: string, callback?: ((ele: M) => M)): M[];
    module: typeof UnicornHelper.prototype.module;
    // module<M, E extends Element = Element>(selector: E[]|NodeListOf<E>, name: string, callback?: ((ele: E) => M)): M[];
    // module<M, E extends Element = Element>(selector: E, name: string, callback?: ((ele: E) => M)): M;
    // module<M, E extends keyof HTMLElementTagNameMap>(selector: E, name: string, callback?: ((ele: HTMLElementTagNameMap[E]) => M)): M;
    // module<M>(selector: string, name: string, callback?: ((ele: Element) => M)): M;
    h: typeof UnicornHelper.prototype.h;
    html: typeof UnicornHelper.prototype.html;
    $get: typeof UnicornHelper.prototype.get;
    $set: typeof UnicornHelper.prototype.set;
    delegate: typeof UnicornHelper.prototype.delegate;
    debounce: typeof UnicornHelper.prototype.debounce;
    throttle: typeof UnicornHelper.prototype.throttle;
    isDebug: typeof UnicornHelper.prototype.isDebug;
    confirm: typeof UnicornHelper.prototype.confirm;
    alert: typeof UnicornHelper.prototype.alert;
    numberFormat: typeof UnicornHelper.prototype.numberFormat;
    sprintf: typeof UnicornHelper.prototype.sprintf;
    vsprintf: typeof UnicornHelper.prototype.vsprintf;
    genRandomString: typeof UnicornHelper.prototype.genRandomString;
    defaultsDeep: typeof UnicornHelper.prototype.defaultsDeep;

    // http.js
    $http: UnicornHttp;

    // uri.js
    $uri: UnicornUri & UnicornUriExtended;

    // stack.js
    $stack: UnicornStack;

    stack(name: string, store?: any[]): Stack;

    // queue.js
    $queue: UnicornQueue;

    queue(name: string, maxRunning?: number): SimpleQueue;
}

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
// UI
export interface UnicornUIExtended {
    tinymce: UnicornTinymce;
    bootstrap: UIBootstrap5;
    theme: UIBootstrap5;
}

//
// Http
declare module 'axios' {
    interface AxiosRequestConfig {
        vars?: Record<string, any>;
    }
}

// Uri
export interface UnicornUriExtended {
    asset: {
        path(path: string): string;
        root(path: string): string;
    };
}
