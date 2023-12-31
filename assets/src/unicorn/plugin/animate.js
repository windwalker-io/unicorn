import { each, defaultsDeep } from 'lodash-es';

export default class UnicornAnimate {
  static install(app) {
    const self = app.$animate = new this(app);
    app.animate = self.to.bind(self);
  }

  constructor(app) {
    this.app = app;
  }

  /**
   *
   * @param {Element} element
   * @param {{ [name: string]: any }} styles
   * @param {number | KeyframeAnimationOptions} options
   * @returns {Animation}
   */
  to(element, styles, options = {}) {
    element = this.app.selectOne(element);

    const currentStyles = window.getComputedStyle(element);
    const transitions = {};

    each(styles, (value, name) => {
      transitions[name] = Array.isArray(value)
        ? value
        : [
          currentStyles[name],
          value
        ];
    });

    if (typeof options === 'number') {
      options = { duration: options };
    }

    options = defaultsDeep(
      options,
      {
        duration: 400,
        easing: 'linear',
        fill: 'forwards'
      }
    );

    return element.animate(
      transitions,
      options
    );
  }

  /**
   *
   * @param {Element} element
   * @param {string} name
   * @returns {*}
   */
  getCurrentStyle(element, name) {
    return window.getComputedStyle(element)[name];
  }
}
