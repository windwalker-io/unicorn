import { EventAwareInterface, EventMixin } from './events';
import { Constructor, UnicornPlugin } from './types';
declare const UnicornApp_base: import('ts-mixer/dist/types/types').Class<any[], EventMixin, typeof EventMixin>;
export default class UnicornApp extends UnicornApp_base implements EventAwareInterface {
    registry: Map<any, any>;
    plugins: Map<any, any>;
    waits: Promise<any>[];
    options: Record<string, any>;
    defaultOptions: Record<string, any>;
    constructor(options?: {});
    use(plugin: UnicornPlugin, options?: Record<string, any>): this;
    detach(plugin: any): this;
    inject<T>(plugin: Constructor<T> | string): T;
    inject<T>(plugin: Constructor<T> | string, def: any): T | typeof def;
    provide(id: string | Constructor<any>, value: any): this;
    wait(callback: Function): Promise<any>;
    completed(): Promise<any[]>;
}
export {};
