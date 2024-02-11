import type { Unicorn } from '../../index';

export default class UnicornStack {
  stacks: Record<string, Stack> = {};

  static is = 'stack';

  static install(app: Unicorn) {
    const $stack = app.$stack = new this(app);

    app.stack = $stack.get.bind($stack);
  }

  constructor(protected app: Unicorn) {
    //
  }

  create(name: string, store: any[] = []): Stack {
    if (name == null) {
      throw new Error('Please provide a name.');
    }

    return new Stack(name, store);
  }

  get(name: string, store: any[] = []) {
    if (!this.stacks[name]) {
      this.stacks[name] = this.create(name, store);
    }

    return this.stacks[name];
  }

  set(name: string, stack: Stack) {
    this.stacks[name] = stack;

    return this;
  }

  remove(name: string) {
    delete this.stacks[name];

    return this;
  }

  all() {
    return this.stacks;
  }
}

declare type StackHandler = (stack: Stack, length: number) => void;

export class Stack {
  observers: { handler: StackHandler, once: boolean }[] = [];

  constructor(protected name: string, protected store: any[] = []) {
    //
  }

  push(value: any = true): number {
    const r = this.store.push(value);

    this.notice();

    return r;
  }

  pop(): any {
    const r = this.store.pop();

    this.notice();

    return r;
  }

  clear(): this {
    this.store = [];

    this.notice();

    return this;
  }

  isEmpty(): boolean {
    return this.store.length === 0;
  }

  get length() {
    return this.store.length;
  }

  peek(): any[] {
    return this.store;
  }

  observe(handler: (stack: Stack, length: number) => void): () => void {
    this.observers.push({
      handler,
      once: false
    });

    return () => {
      this.off(handler);
    };
  }

  once(handler: StackHandler): () => void {
    this.observers.push({
      handler,
      once: true
    });

    return () => {
      this.off(handler);
    };
  }

  notice(): this {
    this.observers.forEach((observer) => {
      observer.handler(this, this.length);
    });

    this.observers = this.observers.filter((observer) => observer.once !== true);

    return this;
  }

  off(callback?: StackHandler): this {
    this.observers = this.observers.filter((observer) => observer.handler !== callback);
    return this;
  }
}
