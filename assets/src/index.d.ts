
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { UnicornFormValidation } from './modules/ui/validation-components';
import { EventMixin } from './unicorn/events';
import UnicornApp from './unicorn/js';
import { MixinBuilder, Mixin } from './unicorn/mixwith';
import UnicornAnimate from './unicorn/plugin/animate';
import UnicornCrypto from './unicorn/plugin/crypto';
import UnicornDirective from './unicorn/plugin/directive';
import UnicornForm, { UnicornFormElement } from './unicorn/plugin/form';
import UnicornGrid, { UnicornGridElement } from './unicorn/plugin/grid';
import UnicornHelper from './unicorn/plugin/helper';
import UnicornLang from './unicorn/plugin/lang';
import UnicornLoader from './unicorn/plugin/loader';
import UnicornRouter from './unicorn/plugin/router';
import UnicornStack, { Stack } from './unicorn/plugin/stack';
import UnicornTinymce from './unicorn/plugin/tinymce';
import UnicornUI from './unicorn/plugin/ui';
import UnicornUri from './unicorn/plugin/uri';
import UnicornValidation from './unicorn/plugin/validation';
import { createApp, noConflict } from './unicorn/unicorn';

declare global {
  var u: Unicorn;
  var Unicorn: Unicorn.constructor;
}

export interface Unicorn extends UnicornApp {
  constructor: {
    createApp(): Unicorn;
    noConflict(): Unicorn;
    mix<T>(superclass: T): MixinBuilder<T>;
    Mixin<T>(mixin: (superclass: Function) => T): T;
    EventMixin: EventMixin;
  }

  tap<T>(value: T, callback: ((T) => void)): T;
  data(name: string, data: any): any;
  data(name: string): any;
  data(ele: Element, name: string): any;
  data(ele: Element, name: string, data?: any): any;
  removeData(name: string): any;
  removeData(ele: Element, name: string): any;
  uri(type: string): string|undefined;
  asset(type: string): string|undefined;
  wait(callback: (resolve: Function, reject: Function) => void): Promise<any>;
  completed(): Promise<any>;

  // animate.js
  $animate: UnicornAnimate;
  animate(element: Element, styles: { [name: string]: any }, options?: number | KeyframeAnimationOptions): Animation;

  // crypto.js
  $crypto: UnicornCrypto;
  base64Encode(string: string):  string;
  base64Decode(string: string): string;
  uuid4(): string;
  uid(prefix: string = '', timebase: boolean = false): string;
  tid(prefix: string = ''): string;
  md5(str: string): string;
  serial(): number;

  // directive.js
  $directive: UnicornDirective;
  directive(name: string, handler: UnicornDirectiveHandler): void;

  // lang.js
  $lang: UnicornLang;
  __(text: string, ...args: any[]): string;
  trans(text: string, ...args: any[]): string;

  // validation.js
  $validation: UnicornValidation;
  formValidation(selector: string = '[uni-form-validation]'): Promise<UnicornFormValidation|null>;

  // router.js
  $router: UnicornRouter;
  route(route: string, query: any): string;

  $grid: UnicornGrid;
  grid(ele: string|Element, options: object = {}): UnicornGridElement;

  $form: UnicornForm;
  form(ele: string|Element, options: object = {}): UnicornFormElement;

  // ui.js
  $ui: UnicornUIExtended;
  addMessage(messages: string[]|string, type: string = 'info'): void;
  clearMessages(): void;
  notify(messages: string|string[], type: string = 'info'): void;
  clearNotifies(): void;
  loadAlpine(callback?: () => void): Promise<any>;
  beforeAlpineInit(callback: () => void): void;
  prepareAlpine(callback: () => void): void;
  webComponentPolyfill(): Promise<any>;
  defineCustomElement(name: string, constructor: CustomElementConstructor, options?: ElementDefinitionOptions): Promise<any>;

  // loader.js
  $loader: UnicornLoader;
  import(...src): Promise<any>;
  importSync(...src): Promise<any>;
  importCSS(...src): Promise<any>;
  minFileName(fileName: string): string;
  agterImported(name: string, callback: (resolve: Function, reject?: Function) => void): Promise<any>;

  // helper.js
  $helper: UnicornHelper;
  selectOne<E extends Element = Element>(ele: E): E;
  selectOne<K extends keyof HTMLElementTagNameMap = Element>(ele: K): HTMLElementTagNameMap[K]|null;
  selectOne(ele: string): Element;
  selectAll<E extends Element = Element>(ele: NodeListOf<E>|E[], callback: ((ele: E) => any)): E[];
  selectAll<E extends keyof HTMLElementTagNameMap = Element>(ele: E, callback: ((ele: HTMLElementTagNameMap[E]) => any)): HTMLElementTagNameMap[E][];
  selectAll(ele: string, callback: ((ele: Element) => any)): Element[];
  each(collection: any, iteratee: (item: any, i: number|string) => void): void;
  getBoundedInstance<E extends Element = Element, M>(selector: E, name: string, callback?: ((ele: E) => M)): M;
  getBoundedInstance<E extends keyof HTMLElementTagNameMap = Element, M>(selector: E, name: string, callback?: ((ele: HTMLElementTagNameMap[E]) => M)): M;
  getBoundedInstance<M>(selector: string, name: string, callback?: ((ele: Element) => M)): M;
  getBoundedInstanceList<E extends Element = Element, M>(selector: NodeListOf<E>|E[], name: string, callback?: ((ele: E) => M)): M[];
  getBoundedInstanceList<E extends keyof HTMLElementTagNameMap = Element, M>(selector: E, name: string, callback?: ((ele: HTMLElementTagNameMap[E]) => M)): M[];
  getBoundedInstanceList<M>(selector: string, name: string, callback?: ((ele: M) => M)): M[];
  module<E extends Element = Element, M>(selector: E[]|NodeListOf<E>, name: string, callback?: ((ele: E) => M)): M[];
  module<E extends Element = Element, M>(selector: E, name: string, callback?: ((ele: E) => M)): M;
  module<E extends keyof HTMLElementTagNameMap = Element, M>(selector: E, name: string, callback?: ((ele: HTMLElementTagNameMap[E]) => M)): M;
  module<M>(selector: string, name: string, callback?: ((ele: Element) => M)): M;
  h(element: string, attrs?: { [name: string]: any }, content?: string|Element): Element;
  html(html: string): Element;
  $get(obj: any, path: string): any;
  $set<SetValue>(obj: any, path: string, value: SetValue): SetValue;
  delegate(wrapper: Element|string, selector: Element|string, eventName: string, callback: (e: Event) => void): (() => void);
  isDebug(): boolean;
  confirm(message: string): Promise<boolean>;
  alert(title: string, text: string = '', type: string = 'info'): Promise<boolean>;
  numberFormat(number: number|string, decimals: number = 0, decPoint: string = '.', thousandsSep: string = ','): string
  sprintf(tmpl: string, ...args: string[]);
  vsprintf(tmpl: string, args: string[]);
  defaultsDeep(...args: any): any;

  // http.js
  $http: UnicornHttp;

  // uri.js
  $uri: UnicornUri;

  // stack.js
  $stack: UnicornStack;
  stack(name: string): Stack;
}

export interface UnicornPlugin {
  contructor: {
    is?: string;
  }
  install?(app: UnicornApp, options?: any = {}): void;
  uninstall?(app: UnicornApp, options?: any = {}): void;
}

// Directive
export interface UnicornDirectiveHandler {
  mounted?: UnicornDirectiveHandlerHook;
  unmounted?: UnicornDirectiveHandlerHook;
  updated?: UnicornDirectiveHandlerHook;
}

export type UnicornDirectiveHandlerHook = (node: Element, bindings: {
  directive: string;
  node: Element;
  value: any;
  oldValue: any;
  mutation: MutationRecord;
  dir: UnicornDirectiveHandler;
}) => void

// Validation
export interface Validator {
  handler: ValidationHandler;
  options: ValidationOptions;
}
export type ValidationHandler = (value: any, element: Element) => boolean;
export interface ValidationOptions {
  notice?: string | ((input: Element, field: UnicornFieldValidation) => string);
}

// UI
export interface UnicornUIExtended extends UnicornUI {
  tinymce: UnicornTinymce
}

// Http
export interface UnicornHttp {
  axios: AxiosInstance;
  createHttp(): Promise<AxiosInstance>;
  getHttp(): Promise<AxiosInstance>;
  prepareAxios(axios: AxiosInstance): void;
  requestMiddleware(callback: (config: AxiosRequestConfig) => AxiosRequestConfig): void;
  get(url: string, options?: AxiosRequestConfig): Promise<AxiosResponse>;
  post(url: string, data?: any, options?: AxiosRequestConfig): Promise<AxiosResponse>;
  put(url: string, data?: any, options?: AxiosRequestConfig): Promise<AxiosResponse>;
  patch(url: string, data?: any, options?: AxiosRequestConfig): Promise<AxiosResponse>;
  delete(url: string, data?: any, options?: AxiosRequestConfig): Promise<AxiosResponse>;
  head(url: string, options?: AxiosRequestConfig): Promise<AxiosResponse>;
  options(url: string, options?: AxiosRequestConfig): Promise<AxiosResponse>;
  request(options: AxiosRequestConfig): Promise<AxiosResponse>;
};

// Uri
export interface UnicornUri {
  aset: {
    path(path: string = ''): string;
    root(path: string = ''): string;
  }
}
