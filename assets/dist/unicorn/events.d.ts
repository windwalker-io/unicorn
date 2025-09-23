export declare abstract class EventMixin implements EventAwareInterface {
    _listeners: Record<string, EventHandler[]>;
    on(event: string | string[], handler: EventHandler): this;
    once(event: string | string[], handler: EventHandler): this;
    off(event: string, handler?: EventHandler): this;
    trigger(event: string | string[], ...args: any[]): this;
    listeners(event: string): EventHandler[];
}
declare const EventBus_base: import('ts-mixer/dist/types/types').Class<any[], EventMixin, typeof EventMixin>;
export declare class EventBus extends EventBus_base {
}
export type EventHandler = ((...event: any[]) => void) & {
    once?: boolean;
};
export interface EventAwareInterface {
    on(event: string | string[], handler: EventHandler): this;
    once(event: string | string[], handler: EventHandler): this;
    off(event: string, handler?: EventHandler): this;
    trigger(event: string | string[], ...args: any[]): this;
    listeners(event: string): EventHandler[];
}
export {};
