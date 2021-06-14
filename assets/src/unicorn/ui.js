/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

export default class UnicornUI {
  theme;

  static get is() {
    return 'ui';
  }

  static install(app, options = {}) {
    // Disable Alpine auto load.
    window.deferLoadingAlpine = () => {
    };

    const ui = app.$ui = new this(app);
    app.addMessage = ui.renderMessage;

    app.loadAlpine = ui.loadAlpine.bind(ui);
    app.loadSpruce = ui.loadSpruce.bind(ui);
    app.initAlpine = ui.initAlpine.bind(ui);
    app.startAlpine = ui.startAlpine.bind(ui);
    app.startAlpineSpruce = ui.startAlpineSpruce.bind(ui);
    app.initAlpineSpruce = ui.initAlpineSpruce.bind(ui);

    this.prepareInpageCSS();
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

  fileDrag() {
    return this.app.import('@unicorn/field/file-drag.js');
  }

  iframeModal() {
    return this.app.import('@unicorn/ui/iframe-modal.js');
  }

  modalField() {
    return this.app.import('@unicorn/field/modal-field.js');
  }

  multiUploader() {
    return this.app.import('@unicorn/field/multi-uploader.js');
  }

  /**
   * @param target
   * @param duration
   */
  slideUp(target, duration = 300) {
    target = this.app.selectOne(target);

    target.style.overflow = 'hidden';

    const animation = u.animate(
      target,
      { height: 0, paddingTop: 0, paddingBottom: 0 },
      { duration, easing: 'ease-out' }
    );

    return animation.finished.then(() => {
      target.style.display = 'none';
    });
  }

  slideDown(target, duration = 300, display = 'block') {
    target = this.app.selectOne(target);

    target.style.display = display;
    const animation = u.animate(
      target,
      {
        height: [
          0,
          target.scrollHeight + 'px'
        ]
      },
      { duration, easing: 'ease-out' }
    );

    return animation.finished;
  }

  slideToggle(target, duration = 500, display = 'block') {
    target = this.app.selectOne(target);

    if (window.getComputedStyle(target).display === 'none') {
      return this.slideDown(target, duration, display);
    } else {
      return this.slideUp(target, duration);
    }
  }

  /**
   * @param el
   */
  fadeOut(el, duration = 500) {
    el = this.app.selectOne(el);

    const animation = u.animate(el, { opacity: 0 }, { duration, easing: 'ease-out' });

    return animation.finished.then(() => {
      el.style.display = 'none';
    });
  };

  fadeIn(el, duration = 500, display = 'block') {
    el = this.app.selectOne(el);

    el.style.display = display;

    const animation = u.animate(el, { opacity: 1 }, { duration, easing: 'ease-out' });

    return animation.finished;
  };

  highlight(element, color = '#ffff99', duration = 600) {
    element = this.app.selectOne(element);

    duration /= 2;
    const bg = window.getComputedStyle(element).backgroundColor;
    const animation = u.animate(element, { backgroundColor: color }, { duration });

    return animation.finished.then(() => {
      return u.animate(element, { backgroundColor: bg }, { duration });
    });
  }

  static prepareInpageCSS() {
    //
  }
}
