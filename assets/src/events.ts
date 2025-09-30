export abstract class EventMixin implements EventAwareInterface {
  _listeners: Record<string, EventHandler[]> = {};

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

  once(event: string | string[], handler: EventHandler): this {
    handler.once = true;
    return this.on(event, handler);
  }

  off(event: string, handler?: EventHandler): this {
    if (handler) {
      this._listeners[event] = this.listeners(event).filter((listener) => listener !== handler);
      return this;
    }

    delete this._listeners[event];

    return this;
  }

  trigger(event: string | string[], ...args: any[]): this {
    if (Array.isArray(event)) {
      for (const e of event) {
        this.trigger(e);
      }
      return this;
    }

    for (const listener of this.listeners(event)) {
      listener(...args);
    }

    // Remove once
    this._listeners[event] = this.listeners(event).filter((listener) => listener?.once !== true);

    return this;
  }

  listeners(event: string): EventHandler[] {
    return this._listeners[event] === undefined ? [] : this._listeners[event];
  }
}

// export class EventBus extends Mixin(EventMixin) {
// }

export type EventHandler = ((...event: any[]) => void) & { once?: boolean };

export interface EventAwareInterface {
  on(event: string | string[], handler: EventHandler): this;

  once(event: string | string[], handler: EventHandler): this;

  off(event: string, handler?: EventHandler): this;

  trigger(event: string | string[], ...args: any[]): this;

  listeners(event: string): EventHandler[];
}
