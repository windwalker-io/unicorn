
import UnicornApp from './unicorn/app.js';
import UnicornUI from './unicorn/plugin/ui';

declare global {
  var u: Unicorn;
}

export interface Unicorn extends UnicornApp {
  data: (name: string, data?: any) => any;

  // ui.js
  $ui: UnicornUI;
  addMessage(messages: string[]|string): void;
  clearMessages(): void;
  notify(messages: string|string[], type: string): void;
  clearNotifies(): void;
  loadAlpine(callback: () => void): Promise<any>;
  beforeAlpineInit(callback: () => void): void;
  prepareAlpine(callback: () => void): void;
  webComponentPolyfill(): Promise<any>;
  defineCustomElement(name: string, constructor: CustomElementConstructor, options?: ElementDefinitionOptions): Promise<any>;

  import: (...src) => Promise<any>;
}
