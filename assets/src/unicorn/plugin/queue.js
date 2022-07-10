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
  items = [];

  maxRunning = 1;

  currentRunning = 0;

  running = false;

  observers = [];

  constructor(maxRunning = 1) {
    this.maxRunning = maxRunning;
  }

  /**
   * @param {Function} callback
   * @returns {Promise<any>}
   */
  push(callback) {
    const p = new Promise((resolve, reject) => {
      this.items.push(() => {
        return Promise.resolve(callback()).then(resolve);
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
    if (this.currentRunning >= this.maxRunning) {
      this.items.unshift(callback);
      return Promise.resolve();
    }

    this.currentRunning++;

    this.notice();

    return callback()
      .then((v) => {
        this.endPop();
        return v;
      })
      .catch((e) => {
        this.endPop();

        return Promise.reject(e);
      });
  }

  endPop() {
    this.currentRunning--;
    this.notice();
    this.pop();
  }

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

  peek() {
    return this.items;
  }

  /**
   * @param {Function} handler
   * @param {{ once?: boolean; [ name: string ]: any; }} options
   * @returns {(function(): void)}
   */
  observe(handler, options = {}) {
    this.observers.push({
      handler,
      once: options.once || false
    });

    return () => {
      this.off(handler);
    };
  }

  /**
   * @param {Function} handler
   * @param {{ [ name: string ]: any; }} options
   * @returns {(function(): void)}
   */
  once(handler, options = {}) {
    options.once = true;

    return this.observe(handler, options);
  }

  /**
   * @param {Function} handler
   * @param {{ once?: boolean; [ name: string ]: any; }} options
   * @returns {(function(): void)}
   */
  onEnd(callback, options = {}) {
    return this.observe((queue, length, running) => {
      if (length === 0 && running === 0) {
        callback(queue, length, running);
      }
    });
  }

  notice() {
    this.observers.forEach((observer) => {
      observer.handler(this, this.length, this.currentRunning);
    });

    this.observers = this.observers.filter((observer) => observer.once !== true);

    return this;
  }

  off(callback = undefined) {
    if (callback === undefined) {
      this.observers = [];
      return this;
    }

    this.observers = this.observers.filter((observer) => observer.handler !== callback);
    return this;
  }
}
