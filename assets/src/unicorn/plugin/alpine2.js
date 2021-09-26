/**
 * Part of unicorn project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

export default class UnicornAlpine2 {
  static install(app) {
    // Disable Alpine auto load for Apline v2.
    window.deferLoadingAlpine = () => {};

    const self = app.$alpine2 = new this(app);
  }

  constructor(app) {
    this.app = app;
  }

  ie11() {
    return this.app.import('@vendor/alpinejs/dist/alpine-ie11.js');
  }

  loadAlpine() {
    return this.app.import('@alpinejs');
  }

  loadSpruce() {
    return Promise.all([
      this.loadAlpine(),
      this.app.import('@spruce')
    ]);
  }

  initAlpine(selector) {
    return this.loadAlpine().then(() => {
      const element = this.app.selectOne(selector);
      Alpine.initializeComponent(element);
    });
  }

  startAlpine() {
    return this.loadAlpine().then(() => {
      if (Spruce) {
        Spruce.start();
      }

      Alpine.start();
    });
  }

  startAlpineSpruce() {
    return this.loadSpruce().then(() => {
      Alpine.start();
    });
  }

  initAlpineSpruce(selector) {
    return this.loadSpruce().then(() => {
      const element = this.app.selectOne(selector);
      Alpine.initializeComponent(element);
    });
  }
}
