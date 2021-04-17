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

    app.loadAlpine = () => app.import('@alpinejs');
    app.loadSpruce = () => {
      return Promise.all([
        app.loadAlpine(),
        app.import('@spruce')
      ]);
    };

    app.initAlpine = (selector) => {
      return app.loadAlpine().then(() => {
        const element = app.selectOne(selector);
        Alpine.initializeComponent(element);
      });
    };

    app.startAlpine = () => {
      return app.loadAlpine().then(() => {
        if (Spruce) {
          Spruce.start();
        }

        Alpine.start();
      });
    };

    app.startAlpineSpruce = () => {
      return app.loadSpruce().then(() => {
        Alpine.start();
      });
    };

    app.initAlpineSpruce = (selector) => {
      return app.loadSpruce().then(() => {
        const element = app.selectOne(selector);
        Alpine.initializeComponent(element);
      });
    };
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
}
