/**
 * Part of earth project.
 *
 * @copyright  Copyright (C) 2022 __ORGANIZATION__.
 * @license    __LICENSE__
 */

export default class UnicornQueue {
  /**
   * @type {{ [name: string]: SimpleQueue }}
   */
  queues = {};

  static is = 'queue';

  static install(app, options = {}) {
    const $queue = app.$queue = new this(app, options);

    app.queue = $queue.get.bind($queue);
  }

  constructor(app, options = {}) {
    this.app = app;
    this.$options = options;
  }

  /**
   * @param {number} maxRunning
   * @returns {SimpleQueue}
   */
  create(maxRunning = 1) {
    if (name == null) {
      throw new Error('Please provide a name.');
    }

    return new SimpleQueue(maxRunning);
  }

  /**
   * @param {string} name
   * @param {number} maxRunning
   * @returns {SimpleQueue}
   */
  get(name, maxRunning = 1) {
    if (name == null) {
      throw new Error('Please provide a name.');
    }

    if (!this.queues[name]) {
      this.queues[name] = this.create(maxRunning);
    }

    return this.queues[name];
  }

  /**
   * @param {string} name
   * @param {SimpleQueue} queue
   * @returns {UnicornQueue}
   */
  set(name, queue) {
    if (name == null) {
      throw new Error('Please provide a name.');
    }

    this.queues[name] = queue;

    return this;
  }

  /**
   * @param {string} name
   * @returns {UnicornQueue}
   */
  remove(name) {
    delete this.queues[name];

    return this;
  }

  /**
   * @returns {{[p: string]: SimpleQueue}}
   */
  all() {
    return this.queues;
  }
}

export class SimpleQueue {
  /**
   * @type {Function[]}
   */
  items = [];

  maxRunning = 1;

  currentRunnging = 0;

  running = false;

  observers = [];

  constructor(maxRunning = 1) {
    this.maxRunning = maxRunning;
  }

  /**
   * @param {Function} callback
   * @returns {boolean}
   */
  push(callback) {
    const p = new Promise((resolve, reject) => {
      this.items.push(() => {
        return callback().then(resolve);
      });
    });

    this.run();

    return p;
  }

  run() {
    if (!this.running) {
      this.running = true;
    }

    this.pop();
  }

  pop() {
    const callback = this.items.shift();

    // If empty, stop running.
    if (!callback) {
      this.running = false;
      return Promise.resolve();
    }

    // If current running full, set back to queue and leave.
    if (this.currentRunnging >= this.maxRunning) {
      console.log('wait');
      this.items.unshift(callback);
      return Promise.resolve();
    }

    this.currentRunnging++;

    this.notice();

    return Promise.resolve(callback())
      .then((v) => {
        this.currentRunnging--;
        this.pop();
        return v;
      })
      .catch((e) => {
        this.currentRunnging--;
        this.pop();

        return Promise.reject(e);
      });
  }

  /**
   * @returns {Stack}
   */
  clear() {
    this.items = [];

    this.notice();

    return this;
  }

  /**
   * @returns {boolean}
   */
  isEmpty() {
    return this.items.length === 0;
  }

  /**
   * @returns {number}
   */
  get length() {
    return this.items.length;
  }

  /**
   * @returns {*[]}
   */
  peek() {
    return this.items;
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
   * @returns {SimpleQueue}
   */
  notice() {
    this.observers.forEach((observer) => {
      observer.handler(this, this.length, this.currentRunnging);
    });

    this.observers = this.observers.filter((observer) => observer.once !== true);

    return this;
  }

  /**
   * @param {*} callback
   * @returns {SimpleQueue}
   */
  off(callback = null) {
    this.observers = this.observers.filter((observer) => observer.handler !== callback);
    return this;
  }
}
