import type { Unicorn } from '../../index';

declare global {
  interface Window {
    deferLoadingAlpine: Function;
  }
}

export default class UnicornAlpine2 {
  static install(app: Unicorn): void {
    // Disable Alpine auto load for Apline v2.
    window.deferLoadingAlpine = () => {};

    const self = app.$alpine2 = new this(app);
  }

  constructor(protected app: Unicorn) {
    //
  }

  ie11(): Promise<any> {
    return this.app.import('@vendor/alpinejs/dist/alpine-ie11.js');
  }

  loadAlpine(): Promise<any> {
    return this.app.import('@alpinejs');
  }

  loadSpruce(): Promise<Awaited<any>[]> {
    return Promise.all([
      this.loadAlpine(),
      this.app.import('@spruce')
    ]);
  }

  async initAlpine(selector: string | Element): Promise<void> {
    await this.loadAlpine();
    const element = this.app.selectOne(selector);
    Alpine.initializeComponent(element);
  }

  async startAlpine(): Promise<void> {
    await this.loadAlpine();
    if (Spruce) {
      Spruce.start();
    }
    Alpine.start();
  }

  async startAlpineSpruce(): Promise<void> {
    await this.loadSpruce();
    Alpine.start();
  }

  async initAlpineSpruce(selector: string|Element): Promise<void> {
    await this.loadSpruce();
    const element = this.app.selectOne(selector);
    Alpine.initializeComponent(element);
  }
}
