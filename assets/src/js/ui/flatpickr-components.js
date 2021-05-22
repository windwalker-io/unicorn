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
  }

  handleOptions(options) {
    if (options.monthSelect) {
      return Promise.all([
          System.import('@flatpickr/plugins/monthSelect/index.js'),
          System.import('@flatpickr/plugins/monthSelect/style.css'),
        ])
        .then((modules) => {
          const styleSheet = modules[1].default; // A CSSStyleSheet object
          document.adoptedStyleSheets = [...document.adoptedStyleSheets, styleSheet];

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
  System.import('@flatpickr/flatpickr.js'),
  System.import('@flatpickr/flatpickr.css')
]).then((modules) => {
  const styleSheet = modules[1].default; // A CSSStyleSheet object
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, styleSheet];
  
  customElements.define(FlatpickrElement.is, FlatpickrElement);
});
