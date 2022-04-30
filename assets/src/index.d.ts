
import { UnicornFormValidation } from './modules/ui/validation-components';
import UnicornApp from './unicorn/js';
import UnicornAnimate from './unicorn/plugin/animate';
import UnicornCrypto from './unicorn/plugin/crypto';
import UnicornDirective from './unicorn/plugin/directive';
import UnicornHelper from './unicorn/plugin/helper';
import UnicornLang from './unicorn/plugin/lang';
import UnicornUI from './unicorn/plugin/ui';
import UnicornValidation from './unicorn/plugin/validation';

declare global {
  var u: Unicorn;
}

export interface Unicorn extends UnicornApp {
  data(name: string, data?: any): any;

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

  // ui.js
  $ui: UnicornUI;
  addMessage(messages: string[]|string, type: string = 'info'): void;
  clearMessages(): void;
  notify(messages: string|string[], type: string = 'info'): void;
  clearNotifies(): void;
  loadAlpine(callback?: () => void): Promise<any>;
  beforeAlpineInit(callback: () => void): void;
  prepareAlpine(callback: () => void): void;
  webComponentPolyfill(): Promise<any>;
  defineCustomElement(name: string, constructor: CustomElementConstructor, options?: ElementDefinitionOptions): Promise<any>;
  
  // helper.js
  $helper: UnicornHelper;
  selectOne<E extends Element = Element>(ele: E): E;
  selectOne<K extends keyof HTMLElementTagNameMap = Element>(ele: K): HTMLElementTagNameMap[K]|null;
  selectOne(ele: string): Element;
  selectAll<E extends Element = Element>(ele: NodeListOf<E>|E[], callback: ((ele: E) => any)): E[];
  selectAll<E extends keyof HTMLElementTagNameMap = Element>(ele: E, callback: ((ele: HTMLElementTagNameMap[E]) => any)): HTMLElementTagNameMap[E][];
  selectAll(ele: string, callback: ((ele: Element) => any)): Element[];
  each(collection: any, iteratee: (item: any, i: number|string) => void): void;
  getBoundedInstance<E = Element, M>(selector: string|Element, name: string, callback?: ((ele: E) => M)): M;
  getBoundedInstanceList<E = Element, M>(selector: string|NodeListOf<Element>, name: string, callback?: ((ele: E) => M)): M[];
  module<E = Element, M>(selector: string|Element[]|NodeListOf<Element>|E, name: string, callback?: ((ele: E) => M)): M[];
  module<E = Element, M>(selector: Element|E, name: string, callback?: ((ele: E) => M)): M;
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

  // loader.js
  import(...src): Promise<any>;
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
