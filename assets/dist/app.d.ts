import { EventAwareInterface, EventMixin } from './events';
import { Constructor, UnicornPlugin } from './types';
type InjectionKey<T = any> = string | symbol | Constructor<T>;
export interface UnicornApp extends EventAwareInterface {
}
declare const UnicornApp_base: import('ts-mixer/dist/types/types').Class<any[], EventMixin, typeof EventMixin>;
export declare class UnicornApp extends UnicornApp_base implements EventAwareInterface {
    registry: Map<any, any>;
    plugins: Map<any, any>;
    waits: Promise<any>[];
    options: Record<string, any>;
    defaultOptions: Record<string, any>;
    constructor(options?: {});
    use(plugin: UnicornPlugin, options?: Record<string, any>): this;
    detach(plugin: any): this;
    inject<T>(plugin: Constructor<T> | string): T;
    inject<T>(plugin: Constructor<T> | string, def: T): T;
    provide<T>(id: InjectionKey<T>, value: T): this;
    wait(callback: Function): Promise<any>;
    completed(): Promise<any[]>;
}
export {};
