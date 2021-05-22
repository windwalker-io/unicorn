/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

export default class UnicornUI {
  theme;

  static get is() { return 'ui'; }

  static install(app, options = {}) {
    // Disable Alpine auto load.
    window.deferLoadingAlpine = () => {};

    const ui = app.$ui = new this(app);
    app.addMessage = ui.renderMessage;

    app.loadAlpine = ui.loadAlpine.bind(ui);
    app.loadSpruce = ui.loadSpruce.bind(ui);
    app.initAlpine = ui.initAlpine.bind(ui);
    app.startAlpine = ui.startAlpine.bind(ui);
    app.startAlpineSpruce = ui.startAlpineSpruce.bind(ui);
    app.initAlpineSpruce = ui.initAlpineSpruce.bind(ui);
  }

  static get defaultOptions() {
    return {
      messageSelector: '.message-wrap',
    };
  }

  installTheme(theme) {
    this.theme = theme;
  }

  constructor(app) {
    this.app = app;
    this.aliveHandle = null;
  }

  renderMessage(messages, type = 'info') {
    //
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

  flatpickr() {
    return this.app.import('@unicorn/ui/flatpickr-components.js');
  }

  listDependent() {
    return this.app.import('@unicorn/ui/list-dependent.js');
  }

  sid() {
    return this.app.import('@unicorn/field/single-image-drag.js');
  }
}
