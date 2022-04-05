/**
 * Part of earth project.
 *
 * @copyright  Copyright (C) 2022 __ORGANIZATION__.
 * @license    __LICENSE__
 */

export default class UnicornStack {
  /**
   * @type Stack[]
   */
  stacks = {};

  static is = 'crypto';

  static install(app, options = {}) {
    const $stack = app.$stack = new this(app, options);

    app.stack = $stack.get.bind($stack);
  }

  constructor(app, options = {}) {
    this.app = app;
    this.$options = options;
  }

  create(name, store = []) {
    if (name == null) {
      throw new Error('Please provide a name.');
    }

    return new Stack(name, store);
  }

  get(name, store = []) {
    if (name == null) {
      throw new Error('Please provide a name.');
    }

    if (!this.stacks[name]) {
      this.stacks[name] = this.create(name, store);
    }

    return this.stacks[name];
  }

  set(name, stack) {
    if (name == null) {
      throw new Error('Please provide a name.');
    }

    this.stacks[name] = stack;

    return this;
  }

  remove(name) {
    delete this.stacks[name];

    return this;
  }

  all() {
    return this.stacks;
  }
}

class Stack {
  name = '';
  store = [];
  observers = [];

  constructor(name, store = []) {
    this.name = name;
    this.store = store;
  }

  push(value = true) {
    const r = this.store.push(value);

    this.notice();

    return r;
  }

  pop() {
    const r = this.store.pop();

    this.notice();

    return r;
  }

  clear() {
    this.store = [];

    this.notice();

    return this;
  }

  isEmpty() {
    return this.store.length === 0;
  }

  get length() {
    return this.store.length;
  }

  peek() {
    return this.store;
  }

  observe(handler) {
    this.observers.push({
      handler
    });

    return () => {
      this.off(handler);
    };
  }

  once(handler) {
    this.observers.push({
      handler,
      once: true
    });

    return () => {
      this.off(handler);
    };
  }

  notice() {
    this.observers.forEach((observer) => {
      observer.handler(this, this.length);
    });

    this.observers = this.observers.filter((observer) => observer.once !== true);

    return this;
  }

  off(callback = null) {
    this.observers = this.observers.filter((observer) => observer.handler !== callback);
    return this;
  }
}
