import { Mixin } from './mixwith';

export const EventMixin = Mixin(function (superclass) {
  return class extends superclass {
    /**
     * @type {{ [event: string]: function[] }}
     * @private
     */
    _listeners = {};

    /**
     * @param {string|Array<string>} event
     * @param {function} handler
     * @returns {this}
     */
    on(event: string | string[], handler: Function): this {
      if (Array.isArray(event)) {
        event.forEach(e => this.on(e, handler));
        return this;
      }

      if (this._listeners[event] === undefined) {
        this._listeners[event] = [];
      }

      this._listeners[event].push(handler);

      return this;
    }

    /**
     * @param {string|Array<string>} event
     * @param {function} handler
     * @returns {this}
     */
    once(event: string | string[], handler: Function): this {
      if (Array.isArray(event)) {
        event.forEach(e => this.once(e, handler));
        return this;
      }

      handler[Symbol.for('once')] = true;
      // handler._once = true;

      this.on(event, handler);
    }

    /**
     * @param {string} event
     * @param {?function} handler
     * @returns {this}
     */
    off(event: string, handler: Function | undefined = undefined): this {
      if (handler != null) {
        this._listeners[event] = this.listeners(event).filter((listener) => listener !== handler);
        return this;
      }

      delete this._listeners[event];

      return this;
    }

    /**
     * @param {string|string[]} event
     * @param {any[]} args
     * @returns {this}
     */
    trigger(event: string | string[], ...args: any[]): this {
      if (Array.isArray(event)) {
        event.forEach(e => this.trigger(e));
        return this;
      }

      this.listeners(event).forEach(listener => {
        listener(...args);
      });

      // Remove once
      this._listeners[event] = this.listeners(event).filter((listener) => listener[Symbol.for('once')] !== true);

      return this;
    }

    /**
     * @param {string} event
     * @returns {Function[]}
     */
    listeners(event: string): Function[] {
      if (typeof event !== 'string') {
        throw new Error(`get listeners event name should only use string.`);
      }

      return this._listeners[event] === undefined ? [] : this._listeners[event];
    }
  };
});

export class EventBus extends EventMixin(class {
}) {
}

export interface EventAwareInterface {
  on(event: string | string[], handler: Function): this;

  once(event: string | string[], handler: Function): this;

  off(event: string, handler?: Function): this;

  trigger(event: string | string[], ...args: any[]): this;

  listeners(event: string): Function[];
}
