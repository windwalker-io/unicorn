import { useCssImport, useImport } from '@/modules';
import flatpickr from 'flatpickr';
import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect';

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
    const options = JSON.parse(this.getAttribute('options')) || {};

    this.handleOptions(options).then((options) => {
      this.instance = flatpickr(
        this.querySelector(this.selector),
        options
      );
    });

    this.querySelector('[data-toggle]')?.addEventListener('click', () => {
      setTimeout(() => {
        this.querySelector<HTMLInputElement>('[data-input]')?.focus();
      }, 0);
    });
  }

  handleOptions(options: Record<string, any>) {
    const promises = [];

    if (options.monthSelect) {
      promises.push(
        useImport('@flatpickr/plugins/monthSelect/index.js'),
        useCssImport('@flatpickr/plugins/monthSelect/style.css')
      );
    }

    if (this.locale) {
      promises.push(useImport(`@flatpickr/l10n/${this.locale}.js`));
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
              monthSelectPlugin(options.monthSelect)
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
  useImport('@flatpickr/flatpickr.js'),
  useCssImport('@flatpickr/flatpickr.css')
]).then(() => {
  customElements.define(FlatpickrElement.is, FlatpickrElement);
});
