/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

import 'construct-style-sheets-polyfill';
import { defaultsDeep } from 'lodash-es';

export default class UnicornUI {
  theme;
  aliveHandle;

  static get is() {
    return 'ui';
  }

  static install(app, options = {}) {
    const ui = app.$ui = new this(app);
    app.addMessage = ui.renderMessage.bind(ui);
    app.clearMessages = ui.clearMessages.bind(ui);
    app.notify = ui.notify.bind(ui);
    app.clearNotifies = ui.clearNotifies.bind(ui);

    app.loadAlpine = ui.loadAlpine.bind(ui);
    app.beforeAlpineInit = ui.beforeAlpineInit.bind(ui);
    app.webComponentPolyfill = ui.webComponentPolyfill.bind(ui);
    app.defineCustomElement = ui.defineCustomElement.bind(ui);
    // app.loadSpruce = ui.loadSpruce.bind(ui);
    // app.initAlpine = ui.initAlpine.bind(ui);
    // app.startAlpine = ui.startAlpine.bind(ui);
    // app.startAlpineSpruce = ui.startAlpineSpruce.bind(ui);
    // app.initAlpineSpruce = ui.initAlpineSpruce.bind(ui);

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

  loadAlpine(callback = null) {
    // For V3
    if (callback) {
      this.beforeAlpineInit(callback);
    }

    return this.app.import('@alpinejs')
      .then((m) => {
        // For V2
        if (Alpine.version.startsWith('2.')) {
          return this.app.$alpine2.loadSpruce().then((s) => {
            Alpine.store = Spruce.store.bind(Spruce);
            callback();
            return m;
          })
            .then(() => {
              this.app.$alpine2.startAlpine();
              return m;
            });
        }

        return m;
      });
  }

  beforeAlpineInit(callback) {
    document.addEventListener('alpine:initializing', callback);
  }

  renderMessage(messages, type = 'info') {
    this.theme.renderMessage(messages, type);
  }

  clearMessages() {
    this.theme.clearMessages();
  }

  notify(messages, type = 'info') {
    this.theme.renderMessage(messages, type);
  }

  clearNotifies() {
    this.theme.clearMessages();
  }

  webComponentPolyfill() {
    return u.import('@vendor/@webcomponents/webcomponentsjs/webcomponents-bundle.js')
      .then((m) => new Promise((resolve) => {
        window.addEventListener('WebComponentsReady', function() {
          resolve(m);
        });
      }));
  }

  defineCustomElement(is, target) {
    const promise = u.import('@vendor/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js');

    return promise.then(m => {
      customElements.define(is, target);

      return m;
    });
  }

  // loadSpruce() {
  //   return Promise.all([
  //     this.loadAlpine(),
  //     this.app.import('@spruce')
  //   ]);
  // }

  // initAlpine(selector) {
  //   return this.loadAlpine().then(() => {
  //     const element = this.app.selectOne(selector);
  //     Alpine.initializeComponent(element);
  //   });
  // }

  // startAlpine() {
  //   return this.loadAlpine().then(() => {
  //     Alpine.start();
  //   });
  // }

  // startAlpineSpruce() {
  //   return this.loadSpruce().then(() => {
  //     Alpine.start();
  //   });
  // }
  //
  // initAlpineSpruce(selector) {
  //   return this.loadSpruce().then(() => {
  //     const element = this.app.selectOne(selector);
  //     Alpine.initializeComponent(element);
  //   });
  // }

  /**
   * Highlight mark some keywords.
   *
   * @param selector
   * @param keyword
   * @param options
   * @returns {Promise}
   */
  mark(selector = null, keyword = '', options = {}) {
    return this.app.import('@vendor/mark.js/dist/mark.min.js')
      .then((m) => {
        if (selector != null) {
          const instance = new Mark(selector);
          instance.mark(keyword, options);
        }
        return m;
      })
      .catch(() => {
        console.error('Package "mark.js" not found.');
      });
  }

  choices(selector = null, options = {}) {
    return Promise.all([
      this.app.import('@vendor/choices.js/public/assets/scripts/choices.min.js'),
      this.app.importCSS('@vendor/choices.js/public/assets/styles/choices.min.css')
    ])
      .then((m) => {
        if (selector) {
          options = defaultsDeep(options, {
            shouldSort: false
          });

          new Choices(selector, options);
        }

        return m;
      });
  }

  flatpickr() {
    return this.app.import('@unicorn/ui/flatpickr-components.js');
  }

  listDependent(element, dependent, options = {}) {
    return this.app.import('@unicorn/ui/list-dependent.js').then((module) => {
      if (element) {
        module.ListDependent.handle(element, dependent, options);
      }
      
      return module;
    });
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

    return animation.finished.then((r) => {
      target.style.display = 'none';
      return r;
    });
  }

  slideDown(target, duration = 300, display = 'block') {
    target = this.app.selectOne(target);

    target.style.display = display;

    // Get height
    let maxHeight = 0;
    [].forEach.call(target.children, (child) => {
      maxHeight = Math.max(child.offsetHeight, maxHeight);
    });

    const animation = u.animate(
      target,
      {
        height: [
          0,
          maxHeight + 'px'
        ]
      },
      { duration, easing: 'ease-out' }
    );

    return animation.finished.then((r) => {
      target.style.overflow = 'visible';
      return r;
    });
  }

  slideToggle(target, duration = 500, display = 'block') {
    target = this.app.selectOne(target);

    if (window.getComputedStyle(target).display === 'none') {
      return this.slideDown(target, duration, display);
    } else {
      return this.slideUp(target, duration);
    }
  }

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

  /**
   * Color Picker.
   * Todo: Move to another file.
   */
  colorPicker() {
    u.directive('color-picker', {
      mounted(el, binding) {
        u.getBoundedInstance(el, 'color.picker', () => {
          const text = el.querySelector('[data-role=color-text]');
          const preview = el.querySelector('[data-role=color-preview]');
          const pick = el.querySelector('[data-task=pick-color]');
          const inputContainer = el.querySelector('[data-role=input-container]');

          pick.addEventListener('click', () => {
            openPicker();
          });

          text.addEventListener('focus', () => {
            openPicker();
          });

          text.addEventListener('change', () => {
            updatePreview();
          });

          text.dispatchEvent(new Event('change'));

          function openPicker() {
            const input = u.h('input', { type: 'color', value: text.value });

            inputContainer.innerHTML = '';
            inputContainer.appendChild(input);

            input.addEventListener('change', () => {
              preview.style.backgroundColor = input.value;
              text.value = input.value;
              updatePreview();
            });

            input.addEventListener('input', () => {
              preview.style.backgroundColor = input.value;
              text.value = input.value;
              updatePreview();
            });

            setTimeout(() => {
              input.click();
            }, 0);
          }

          function updatePreview() {
            preview.style.backgroundColor = text.value;

            // @see https://stackoverflow.com/a/12043228
            const sep = 200;
            const [, r, g, b] = preview.style.backgroundColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            const luma = Number(r) * 0.2126 + Number(g) * 0.7152 + Number(b) * 0.0722;
            pick.style.color = luma > sep ? 'black' : 'white';
          }
        });
      }
    })
  }

  disableOnSubmit(formSelector = '#admin-form', buttonSelector = null, options = {}) {
    buttonSelector = buttonSelector || [
      '#admin-toolbar button',
      '#admin-toolbar a',
      formSelector + ' .disable-on-submit',
      formSelector + ' .js-dos',
      formSelector + ' [data-dos]',
    ].join(',');

    const iconSelector = options.iconSelector || [
      '[class*="fa-"]',
      '[data-spin]',
      '[data-spinner]',
    ].join(',');

    const event = options.event || 'submit';
    const spinnerClass = options.spinnerClass || 'spinner-border spinner-border-sm';

    this.app.selectAll(buttonSelector, (button) => {
      button.addEventListener('click', (e) => {
        button.dataset.clicked = '1';

        setTimeout(() => {
          delete button.dataset.clicked;
        }, 1500);
      });
    });

    this.app.selectOne(formSelector)?.addEventListener(event, (e) => {
      setTimeout(() => {
        this.app.selectAll(buttonSelector, (button) => {
          button.disabled = true;
          button.classList.add('disabled');
          button.href = 'javascript:\/\/';
          button.onclick = 'return false;';

          if (button.dataset.clicked) {
            const icon = button.querySelector(iconSelector);

            if (icon) {
              icon.setAttribute('class', spinnerClass);
              // icon.styles.width = '1em';
              // icon.styles.height = '1em';
              // icon.styles.borderWith = '.15em';
            }
          }
        });
      }, 0);
    });
  }

  checkboxesMultiSelect(selector = null, options = {}) {
    return this.app.import('@unicorn/ui/checkboxes-multi-select.js')
      .then((m) => {
        if (selector) {
          return m.CheckboxesMultiSelect.handle(selector, options);
        }

        return m;
      });
  }

  /**
   * Keep alive.
   *
   * @param {string} url
   * @param {Number} time
   *
   * @return {number}
   */
  keepAlive(url, time = 60000) {
    return this.aliveHandle = window.setInterval(() => fetch(url), time);
  }

  /**
   * Stop keep alive
   */
  stopKeepAlive() {
    clearInterval(this.aliveHandle);

    this.aliveHandle =  null;

    return this;
  }

  static prepareInpageCSS() {
    //
  }
}
