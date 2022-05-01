/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

class FlatpickrElement extends HTMLElement {
  static get is() {
    return 'uni-flatpickr';
  }

  instance;

  constructor() {
    super();
  }

  get selector() {
    return this.getAttribute('selector') || 'input';
  }

  get locale() {
    return this.getAttribute('locale') || '';
  }

  // todo: Currently not support single option attributes
  getOptions() {
    const options = {};
    const ignore = [
      'selector'
    ];

    this.getAttributeNames().forEach((name) => {
      if (ignore.indexOf(name) !== -1) {
        return;
      }

      options[name] = this.getAttribute(name);
    });

    return options;
  }

  connectedCallback() {
    const options = JSON.parse(this.getAttribute('options'));

    this.handleOptions(options).then((options) => {
      this.instance = flatpickr(
        this.querySelector(this.selector),
        options
      );
    });

    this.querySelector('[data-toggle]')?.addEventListener('click', () => {
      setTimeout(() => {
        this.querySelector('[data-input]').focus();
      }, 0);
    });
  }

  handleOptions(options) {
    const promises = [];

    if (options.monthSelect) {
      promises.push(
        u.import('@flatpickr/plugins/monthSelect/index.js'),
        u.importCSS('@flatpickr/plugins/monthSelect/style.css')
      );
    }

    if (this.locale) {
      promises.push(u.import(`@flatpickr/l10n/${this.locale}.js`));
    }

    if (promises.length > 0) {
      return Promise.all(promises)
        .then((modules) => {
          if (options.monthSelect) {
            options.plugins = options.plugins || [];

            if (typeof options.monthSelect === 'boolean') {
              options.monthSelect = {
                shorthand: true,
                dateFormat: 'Y-m',
                altFormat: 'Y-m'
              };
            }

            options.plugins.push(
              new monthSelectPlugin(options.monthSelect)
            );
          }

          if (this.locale) {
            options.locale = this.locale.replace(/-/, '_');
          }

          return options;
        });
    }

    return Promise.resolve(options);
  }

  getInstance() {
    return this.instance;
  }
}

Promise.all([
  u.import('@flatpickr/flatpickr.js'),
  u.import('@flatpickr/flatpickr.css')
]).then((modules) => {
  const styleSheet = modules[1].default; // A CSSStyleSheet object
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, styleSheet];

  u.defineCustomElement(FlatpickrElement.is, FlatpickrElement);
});
