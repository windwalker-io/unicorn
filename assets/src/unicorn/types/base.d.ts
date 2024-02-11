import UnicornApp from '../app';

export interface UnicornPlugin {
  install?(app: UnicornApp, options?: any): void;
  uninstall?(app: UnicornApp, options?: any): void;
}

export type Nullable<T> = T | null | undefined;
