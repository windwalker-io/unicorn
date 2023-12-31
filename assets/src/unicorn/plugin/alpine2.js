export default class UnicornAlpine2 {
  /**
   * @type {Unicorn}
   */
  app;

  static install(app) {
    // Disable Alpine auto load for Apline v2.
    window.deferLoadingAlpine = () => {};

    const self = app.$alpine2 = new this(app);
  }

  /**
   * @param {Unicorn} app
   */
  constructor(app) {
    this.app = app;
  }

  /**
   * @returns {Promise<any>}
   */
  ie11() {
    return this.app.import('@vendor/alpinejs/dist/alpine-ie11.js');
  }

  /**
   * @returns {Promise<any>}
   */
  loadAlpine() {
    return this.app.import('@alpinejs');
  }

  /**
   * @returns {Promise<any[]>}
   */
  loadSpruce() {
    return Promise.all([
      this.loadAlpine(),
      this.app.import('@spruce')
    ]);
  }

  /**
   * @param {string|Element} selector
   * @returns {Promise<*>}
   */
  initAlpine(selector) {
    return this.loadAlpine().then(() => {
      const element = this.app.selectOne(selector);
      Alpine.initializeComponent(element);
    });
  }

  /**
   * @returns {Promise<*>}
   */
  startAlpine() {
    return this.loadAlpine().then(() => {
      if (Spruce) {
        Spruce.start();
      }

      Alpine.start();
    });
  }

  /**
   * @returns {Promise<*[]>}
   */
  startAlpineSpruce() {
    return this.loadSpruce().then(() => {
      Alpine.start();
    });
  }

  /**
   * @param {string|Element} selector
   * @returns {Promise<*[]>}
   */
  initAlpineSpruce(selector) {
    return this.loadSpruce().then(() => {
      const element = this.app.selectOne(selector);
      Alpine.initializeComponent(element);
    });
  }
}
