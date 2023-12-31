import { Mixin } from './mixwith.js';

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
    on(event, handler) {
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
    once(event, handler) {
      if (Array.isArray(event)) {
        event.forEach(e => this.once(e, handler));
        return this;
      }

      handler._once = true;

      this.on(event, handler);
    }

    /**
     * @param {string} event
     * @param {?function} handler
     * @returns {this}
     */
    off(event, handler = null) {
      if (handler !== null) {
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
    trigger(event, ...args) {
      if (Array.isArray(event)) {
        event.forEach(e => this.trigger(e));
        return this;
      }

      this.listeners(event).forEach(listener => {
        listener(...args);
      });

      // Remove once
      this._listeners[event] = this.listeners(event).filter((listener) => listener._once !== true);

      return this;
    }

    /**
     * @param {string} event
     * @returns {Function[]}
     */
    listeners(event) {
      if (typeof event !== 'string') {
        throw new Error(`get listeners event name should only use string.`);
      }

      return this._listeners[event] === undefined ? [] : this._listeners[event];
    }
  };
});

export class EventBus extends EventMixin(class {}) {}
