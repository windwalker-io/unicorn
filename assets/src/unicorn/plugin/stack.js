/**
 * Part of earth project.
 *
 * @copyright  Copyright (C) 2022 __ORGANIZATION__.
 * @license    __LICENSE__
 */

export default class UnicornStack {
  /**
   * @type {{ [name: string]: Stack }}
   */
  stacks = {};

  static is = 'stack';

  static install(app, options = {}) {
    const $stack = app.$stack = new this(app, options);

    app.stack = $stack.get.bind($stack);
  }

  constructor(app, options = {}) {
    this.app = app;
    this.$options = options;
  }

  /**
   * @param {string} name
   * @param {*[]} store
   * @returns {Stack}
   */
  create(name, store = []) {
    if (name == null) {
      throw new Error('Please provide a name.');
    }

    return new Stack(name, store);
  }

  /**
   * @param {string} name
   * @param {*[]} store
   * @returns {Stack}
   */
  get(name, store = []) {
    if (name == null) {
      throw new Error('Please provide a name.');
    }

    if (!this.stacks[name]) {
      this.stacks[name] = this.create(name, store);
    }

    return this.stacks[name];
  }

  /**
   * @param {string} name
   * @param {Stack} stack
   * @returns {UnicornStack}
   */
  set(name, stack) {
    if (name == null) {
      throw new Error('Please provide a name.');
    }

    this.stacks[name] = stack;

    return this;
  }

  /**
   * @param {string} name
   * @returns {UnicornStack}
   */
  remove(name) {
    delete this.stacks[name];

    return this;
  }

  /**
   * @returns {{[p: string]: Stack}}
   */
  all() {
    return this.stacks;
  }
}

export class Stack {
  name = '';
  store = [];
  observers = [];

  constructor(name, store = []) {
    this.name = name;
    this.store = store;
  }

  /**
   * @param {any} value
   * @returns {number}
   */
  push(value = true) {
    const r = this.store.push(value);

    this.notice();

    return r;
  }

  /**
   * @returns {*}
   */
  pop() {
    const r = this.store.pop();

    this.notice();

    return r;
  }

  /**
   * @returns {Stack}
   */
  clear() {
    this.store = [];

    this.notice();

    return this;
  }

  /**
   * @returns {boolean}
   */
  isEmpty() {
    return this.store.length === 0;
  }

  /**
   * @returns {number}
   */
  get length() {
    return this.store.length;
  }

  /**
   * @returns {*[]}
   */
  peek() {
    return this.store;
  }

  /**
   * @param {(function(stack: Stack, length: number): void)} handler
   * @returns {(function(): void)}
   */
  observe(handler) {
    this.observers.push({
      handler
    });

    return () => {
      this.off(handler);
    };
  }

  /**
   * @param {(function(stack: Stack, length: number): void)} handler
   * @returns {(function(): void)}
   */
  once(handler) {
    this.observers.push({
      handler,
      once: true
    });

    return () => {
      this.off(handler);
    };
  }

  /**
   * @returns {Stack}
   */
  notice() {
    this.observers.forEach((observer) => {
      observer.handler(this, this.length);
    });

    this.observers = this.observers.filter((observer) => observer.once !== true);

    return this;
  }

  /**
   * @param {*} callback
   * @returns {Stack}
   */
  off(callback = null) {
    this.observers = this.observers.filter((observer) => observer.handler !== callback);
    return this;
  }
}
