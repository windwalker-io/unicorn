export abstract class EventMixin implements EventAwareInterface {
  _listeners: Record<string, EventHandler[]> = {};

  on<T extends any[]>(event: string, handler: EventHandler<T>): this;
  on(event: string | string[], handler: EventHandler): this;
  on(event: string | string[], handler: EventHandler): this {
    if (Array.isArray(event)) {
      for (const e of event) {
        this.on(e, handler);
      }
      return this;
    }

    this._listeners[event] ??= [];

    this._listeners[event].push(handler);

    return this;
  }

  once<T extends any[]>(event: string, handler: EventHandler<T>): this;
  once(event: string | string[], handler: EventHandler): this;
  once(event: string | string[], handler: EventHandler): this {
    // Wrap instead of flagging `handler`, so the same function can also be registered with on().
    const wrapper: EventHandler = (...args: any[]) => handler(...args);
    wrapper.once = true;
    wrapper.original = handler;

    return this.on(event, wrapper);
  }

  off(event: string, handler?: EventHandler): this {
    if (handler) {
      this._listeners[event] = this.listeners(event)
        .filter((listener) => listener !== handler && listener.original !== handler);
      return this;
    }

    delete this._listeners[event];

    return this;
  }

  trigger<T extends any[]>(event: string, ...args: T): this;
  trigger(event: string[], ...args: any[]): this;
  trigger(event: string | string[], ...args: any[]): this {
    if (Array.isArray(event)) {
      for (const e of event) {
        this.trigger(e, ...args);
      }
      return this;
    }

    const listeners = this.listeners(event);

    // Remove once before calling, so a once listener re-triggering its own event does not run again.
    this._listeners[event] = listeners.filter((listener) => listener?.once !== true);

    for (const listener of listeners) {
      listener(...args);
    }

    return this;
  }

  listeners(event: string): EventHandler[] {
    return this._listeners[event] === undefined ? [] : this._listeners[event];
  }
}

// export class EventBus extends Mixin(EventMixin) {
// }

export type EventHandler<T extends any[] = any[]> = ((...event: T) => void) & {
  once?: boolean;
  original?: EventHandler;
};

export interface EventAwareInterface {
  on<T extends any[]>(event: string, handler: EventHandler<T>): this;
  on(event: string | string[], handler: EventHandler): this;

  once<T extends any[]>(event: string, handler: EventHandler<T>): this;
  once(event: string | string[], handler: EventHandler): this;

  off(event: string, handler?: EventHandler): this;

  trigger<T extends any[]>(event: string, ...args: T): this;
  trigger(event: string[], ...args: any[]): this;

  listeners(event: string): EventHandler[];
}
