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

  static get is() {
    return 'ui';
  }

  /**
   * @param {UnicornApp} app
   * @param {object} options
   */
  static install(app, options = {}) {
    const ui = app.$ui = new this(app);
    app.addMessage = ui.renderMessage.bind(ui);
    app.clearMessages = ui.clearMessages.bind(ui);
    app.notify = ui.notify.bind(ui);
    app.clearNotifies = ui.clearNotifies.bind(ui);

    app.loadAlpine = ui.loadAlpine.bind(ui);
    app.beforeAlpineInit = ui.prepareAlpine.bind(ui);
    app.prepareAlpine = ui.prepareAlpine.bind(ui);
    app.webComponentPolyfill = ui.webComponentPolyfill.bind(ui);
    app.defineCustomElement = ui.defineCustomElement.bind(ui);

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
      this.prepareAlpine(callback);
    }

    return this.app.import('@alpinejs')
      .then((m) => {
        // For V2
        if (Alpine.version.startsWith('2.')) {
          return this.app.$alpine2.loadSpruce()
            .then((s) => {
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

  /**
   * Before Alpine init
   * @param {function} callback
   */
  prepareAlpine(callback) {
    document.addEventListener('alpine:init', callback);
  }

  /**
   * Render Messages.
   * @param {string|string[]} messages
   * @param {string} type
   */
  renderMessage(messages, type = 'info') {
    this.theme.renderMessage(messages, type);
  }

  /**
   * Clear messages.
   */
  clearMessages() {
    this.theme.clearMessages();
  }

  /**
   * Show notify.
   * @param {string|string[]} messages
   * @param {string} type
   */
  notify(messages, type = 'info') {
    this.theme.renderMessage(messages, type);
  }

  /**
   * Clear notifies.
   */
  clearNotifies() {
    this.theme.clearMessages();
  }

  /**
   * webComponentPolyfill
   * @returns Promise<*>
   */
  webComponentPolyfill() {
    return this.app.import('@vendor/@webcomponents/webcomponentsjs/webcomponents-bundle.js')
      .then((m) => new Promise((resolve) => {
        window.addEventListener('WebComponentsReady', function() {
          resolve(m);
        });
      }));
  }

  /**
   *
   * @param {string} is
   * @param {*} target
   * @param {*} options
   * @returns Promise<*>
   */
  defineCustomElement(is, target, options) {
    const promise = this.app.import('@vendor/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js');

    return promise.then(m => {
      customElements.define(is, target, options);

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
   * @returns Promise<any>
   */
  mark(selector = null, keyword = '', options = {}) {
    return this.app.import('@vendor/mark.js/dist/mark.min.js')
      .catch((e) => {
        console.error('Package "mark.js" not found.', e);
      })
      .then((m) => {
        if (selector != null) {
          const instance = new Mark(selector);
          instance.mark(keyword, options);
        }
        return m;
      });
  }

  /**
   * @see https://tom-select.js.org/
   * @param {string} selector
   * @param {object} options
   * @param {string} theme
   */
  tomSelect(selector, options = {}, theme = 'bootstrap5') {
    return this.app.import(
      this.app.minFileName('@vendor/tom-select/dist/js/tom-select.complete.js'),
      this.app.importCSS(
        this.app.minFileName(`@vendor/tom-select/dist/css/tom-select.${theme}.css`)
      )
    )
      .then((m) => {
        if (selector) {
          this.app.module(
            selector,
            'tom.select',
            (ele) => {
              options = defaultsDeep(options, {
                allowEmptyOption: true,
                maxOptions: null,
                plugins: {
                  caret_position: {},
                  clear_button: {},
                }
              });

              if (ele.multiple) {
                options.plugins.remove_button = {};
              } else {
                options.plugins.dropdown_input = {};
              }

              // Auto select first if options changed.
              // @see https://github.com/orchidjs/tom-select/issues/362
              class UnicornTomSelect extends TomSelect {
                syncOptionsWithoutKeepSelected() {
                  let item;
                  
                  for(item of this.items) {
                    var option = this.options[item].$option;

                    if(!this.input.contains(option)) {
                      this.removeItem(item, true);
                      delete this.options[item];
                      const first = Object.keys(this.options).shift();

                      this.setValue(first);
                    }
                  }
                  
                  this.clearOptions();
                  this.sync();
                }
              }

              const t = new UnicornTomSelect(ele, options);

              ele.addEventListener('list:updated', () => {
                t.syncOptionsWithoutKeepSelected();
              });

              return t;
            }
          );
        }

        return m;
      });
  }

  /**
   * Choices.js
   * @param {string} selector
   * @param {object} options
   * @returns {Promise<T>}
   *
   * @deprecated Use TomSelect() instead.
   */
  choices(selector = null, options = {}) {
    return this.app.import(
      '@vendor/choices.js/public/assets/scripts/choices.min.js',
      this.app.importCSS('@vendor/choices.js/public/assets/styles/choices.min.css')
    )
      .catch((e) => {
        console.error('Package "choices.js" not found.', e);
      })
      .then((m) => m[0])
      .then((m) => {
        if (selector) {
          options = defaultsDeep(options, {
            shouldSort: false,
            removeItemButton: true,
            renderSelectedChoices: 'always',
          });

          new Choices(selector, options);
        }

        return m;
      });
  }

  /**
   * Flatpickr
   * @returns {Promise<*>}
   */
  flatpickr() {
    return this.app.import('@unicorn/ui/flatpickr-components.js');
  }

  /**
   *
   * @param {string|Element} element
   * @param {string|Element} dependent
   * @param {object} options
   * @returns {Promise<*>}
   */
  listDependent(element = null, dependent = null, options = {}) {
    return this.app.import('@unicorn/ui/list-dependent.js').then((module) => {
      if (element) {
        module.ListDependent.handle(element, dependent, options);
      }
      
      return module;
    });
  }

  /**
   * Cascade Select
   * @returns {Promise<*>}
   */
  cascadeSelect() {
    return this.app.import('@unicorn/field/cascade-select.js');
  }

  /**
   * Single Drag Image
   * @returns {Promise<*>}
   */
  sid() {
    return this.app.import('@unicorn/field/single-image-drag.js');
  }

  /**
   * File Drag
   * @returns {Promise<*>}
   */
  fileDrag() {
    return this.app.import('@unicorn/field/file-drag.js');
  }

  /**
   * Iframe Modal
   * @returns {Promise<*>}
   */
  iframeModal() {
    return this.app.import('@unicorn/ui/iframe-modal.js');
  }

  /**
   * Modal Field
   * @returns {Promise<*>}
   */
  modalField() {
    return this.app.import('@unicorn/field/modal-field.js');
  }

  /**
   * Miltuple Uploader
   * @returns {Promise<*>}
   */
  multiUploader() {
    return this.app.import('@unicorn/field/multi-uploader.js');
  }

  /**
   * Repeatable
   * @returns {Promise<*>}
   */
  repeatable() {
    return this.app.import('@unicorn/field/repeatable.js');
  }

  modalTree() {
    return this.app.import('@unicorn/field/modal-tree.js');
  }

  /**
   * S3 Uploader.
   * @param {string} name
   * @returns {Promise<S3Uploader>}
   */
  s3Uploader(name = null) {
    return u.import('@unicorn/aws/s3-uploader.js').then(function (module) {
      if (name) {
        return S3Uploader.get(name);
      }

      return module;
    });
  }

  /**
   * @param {string|Elemet} target
   * @param {number} duration
   */
  slideUp(target, duration = 300) {
    target = this.app.selectOne(target);

    if (!target) {
      return Promise.resolve();
    }

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

  /**
   * @param {string|Element} target
   * @param {number} duration
   * @param {string} display
   * @returns {Promise<*}
   */
  slideDown(target, duration = 300, display = 'block') {
    target = this.app.selectOne(target);

    if (!target) {
      return Promise.resolve();
    }

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

  /**
   * slideToggle
   * @param {string|Element} target
   * @param {number} duration
   * @param {string} display
   * @returns {Promise<*>}
   */
  slideToggle(target, duration = 500, display = 'block') {
    target = this.app.selectOne(target);

    if (!target) {
      return Promise.resolve();
    }

    if (window.getComputedStyle(target).display === 'none') {
      return this.slideDown(target, duration, display);
    } else {
      return this.slideUp(target, duration);
    }
  }

  /**
   * @param {string|Element} el
   * @param {number} duration
   * @returns {Promise<*>}
   */
  fadeOut(el, duration = 500) {
    el = this.app.selectOne(el);

    const animation = u.animate(el, { opacity: 0 }, { duration, easing: 'ease-out' });

    return animation.finished.then(() => {
      el.style.display = 'none';
    });
  };

  /**
   * @param {string|Element} el
   * @param {number} duration
   * @param {string} display
   * @returns {Promise<*>}
   */
  fadeIn(el, duration = 500, display = 'block') {
    el = this.app.selectOne(el);

    el.style.display = display;

    const animation = u.animate(el, { opacity: 1 }, { duration, easing: 'ease-out' });

    return animation.finished;
  };

  /**
   * @param {string|Element} element
   * @param {string} color
   * @param {number} duration
   * @returns {string|Element}
   */
  highlight(element, color = '#ffff99', duration = 600) {
    element = this.app.selectOne(element);

    duration /= 2;
    const bg = window.getComputedStyle(element).backgroundColor;
    const animation = this.app.animate(element, { backgroundColor: color }, { duration });

    return animation.finished.then(() => {
      return this.app.animate(element, { backgroundColor: bg }, { duration });
    });
  }

  /**
   * Color Picker.
   * Todo: Move to another file.
   */
  colorPicker() {
    this.app.directive('color-picker', {
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
            const [, r, g, b] = preview.style.backgroundColor?.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
              || ['', 255, 255, 255];
            const luma = Number(r) * 0.2126 + Number(g) * 0.7152 + Number(b) * 0.0722;
            pick.style.color = luma > sep ? 'black' : 'white';
          }
        });
      }
    })
  }

  /**
   * @param {string|Element} formSelector
   * @param {string|Element} buttonSelector
   * @param {object} options
   */
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

  /**
   * @param {string|Element} selector
   * @param {object} options
   * @returns {Promise<*>}
   */
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
    const aliveHandle = window.setInterval(() => fetch(url), time);

    return () => {
      clearInterval(aliveHandle)
    };
  }

  /**
   * Init Form Show On
   * @returns {Promise<*>}
   */
  initShowOn() {
    return u.import('@unicorn/ui/show-on.js');
  }

  static prepareInpageCSS() {
    //
  }
}
