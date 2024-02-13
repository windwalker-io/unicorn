import UnicornApp from '../app';
import UnicornLoader from './loader';

declare global {
  interface Window {
    deferLoadingAlpine: Function;
  }

  var Spruce: any;
}

export default class UnicornAlpine2 {
  static install(app: UnicornApp): void {
    // Disable Alpine auto load for Apline v2.
    window.deferLoadingAlpine = () => {};

    const self = app.$alpine2 = new this(app);
  }

  constructor(protected app: UnicornApp) {
    //
  }

  import(...args: any[]) {
    return this.app.inject<UnicornLoader>('$loader').import(...args);
  }

  ie11(): Promise<any> {
    return this.import('@vendor/alpinejs/dist/alpine-ie11.js');
  }

  loadAlpine(): Promise<any> {
    return this.import('@alpinejs');
  }

  loadSpruce(): Promise<Awaited<any>[]> {
    return Promise.all([
      this.loadAlpine(),
      this.import('@spruce')
    ]);
  }

  async initAlpine(selector: string | Element): Promise<void> {
    await this.loadAlpine();
    const element = this.app.selectOne(selector);
    // @ts-ignore
    Alpine.initializeComponent(element);
  }

  async startAlpine(): Promise<void> {
    await this.loadAlpine();
    if (Spruce) {
      Spruce.start();
    }

    // @ts-ignore
    Alpine.start();
  }

  async startAlpineSpruce(): Promise<void> {
    await this.loadSpruce();
    // @ts-ignore
    Alpine.start();
  }

  async initAlpineSpruce(selector: string|Element): Promise<void> {
    await this.loadSpruce();
    const element = this.app.selectOne(selector);
    // @ts-ignore
    Alpine.initializeComponent(element);
  }
}
