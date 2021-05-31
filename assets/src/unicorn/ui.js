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

  /**
   * @see https://dev.to/bmsvieira/vanilla-js-slidedown-up-4dkn
   * @param target
   * @param duration
   */
  slideUp(target, duration = 500) {
    target = this.app.selectOne(target);

    if (target._clearSlider) {
      clearInterval(target._clearSlider);
      target._clearSlider = null;
    }

    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionDuration = duration + 'ms';
    target.style.boxSizing = 'border-box';
    target.style.height = target.offsetHeight + 'px';
    target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target._clearSlider = window.setTimeout(() => {
      target.style.display = 'none';
      target.style.removeProperty('height');
      target.style.removeProperty('padding-top');
      target.style.removeProperty('padding-bottom');
      target.style.removeProperty('margin-top');
      target.style.removeProperty('margin-bottom');
      target.style.removeProperty('overflow');
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
    }, duration);
  }

  slideDown(target, duration = 500) {
    target = this.app.selectOne(target);

    if (target._clearSlider) {
      clearInterval(target._clearSlider);
      target._clearSlider = null;
    }

    target.style.removeProperty('display');
    let display = window.getComputedStyle(target).display;
    if (display === 'none') {
      display = 'block';
    }
    target.style.display = display;
    let height = target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.boxSizing = 'border-box';
    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionDuration = duration + 'ms';
    target.style.height = height + 'px';
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');
    target._clearSlider = window.setTimeout(() => {
      target.style.removeProperty('height');
      target.style.removeProperty('overflow');
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
    }, duration);
  }

  slideToggle(target, duration = 500) {
    target = this.app.selectOne(target);

    if (window.getComputedStyle(target).display === 'none') {
      return this.slideDown(target, duration);
    } else {
      return this.slideUp(target, duration);
    }
  }

  /**
   * @see https://dev.to/bmsvieira/vanilla-js-fadein-out-2a6o
   * @param el
   */
  fadeOut(el) {
    el = this.app.selectOne(el);

    el.style.opacity = 1;
    (function fade() {
      if ((el.style.opacity -= .1) < 0) {
        el.style.display = 'none';
      } else {
        requestAnimationFrame(fade);
      }
    })();
  };

  fadeIn(el, display) {
    el = this.app.selectOne(el);
    el.style.opacity = 0;
    el.style.display = display || 'block';
    (function fade() {
      var val = parseFloat(el.style.opacity);
      if (!((val += .1) > 1)) {
        el.style.opacity = val;
        requestAnimationFrame(fade);
      }
    })();
  };
}
