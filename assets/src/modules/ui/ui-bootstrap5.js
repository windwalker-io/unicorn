/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

export class UIBootstrap5 {
  static install(app) {
    app.$ui.bootstrap = new this(app.$ui);
    app.$ui.theme = new this(app.$ui);
  }

  constructor(ui) {
    this.ui = ui;
    this.app = ui.app;
  }

  renderMessage(messages, type = 'info') {
    if (!Array.isArray(messages)) {
      messages = [ messages ];
    }

    let text = '';

    messages.forEach((msg) => {
      text += `<div class="">${msg}</div>`;
    });

    const html = this.app.html(`<div class="alert alert-${type} alert-dismissible fade show" role="alert">
  ${text}
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>`);

    const container = this.app.selectOne('.c-messages-container');

    if (container) {
      container.appendChild(html);
    }
  }

  clearMessages() {
    const container = this.app.selectOne('.c-messages-container');

    if (container) {
      container.innerHTML = '';
    }
  }

  /**
   * @see https://getbootstrap.com/docs/5.0/components/tooltips/#example-enable-tooltips-everywhere
   *
   * @param {string|Element|Element[]} selector
   * @param {object} config
   */
  tooltip(selector = '[data-bs-toggle="tooltip"]', config = {}) {
    return this.app.getBoundedInstanceList(
      selector,
      'bs.tooltip',
      (ele) => new bootstrap.Tooltip(ele, config)
    );
  }

  /**
   * @param {string|Element} selector
   * @param {object} config
   */
  modal(selector, config = {}) {
    return this.app.getBoundedInstance(
      selector,
      'bs.modal',
      (element) => new bootstrap.Modal(element, config)
    );
  }

  /**
   * @param {string|Element|Element[]} selector
   * @param {object} config
   */
  collapse(selector = '[data-bs-toggle=collapse]', config = {}) {
    return this.app.getBoundedInstanceList(
      selector,
      'bs.collapse',
      (ele) => new bootstrap.Collapse(ele, config)
    );
  }

  /**
   * @param {string|Element|Element[]} selector
   * @param {object} config
   */
  offcanvas(selector = '[data-bs-toggle="offcanvas"]', config = {}) {
    return this.app.getBoundedInstanceList(
      selector,
      'bs.offcanvas',
      (ele) => new bootstrap.Offcanvas(ele, config)
    );
  }

  /**
   * @param {string|Element|Element[]} selector
   * @param {object} config
   */
  popover(selector = '[data-bs-toggle="popover"]', config = {}) {
    return this.app.getBoundedInstanceList(
      selector,
      'bs.popover',
      (ele) => new bootstrap.Popover(ele, config)
    );
  }

  /**
   * @param {string|Element|Element[]} selector
   * @param {object} config
   */
  scrollspy(selector = '[data-bs-spy="scroll"]', config = {}) {
    return this.app.getBoundedInstanceList(
      selector,
      'bs.scrollspy',
      (element) => new bootstrap.ScrollSpy(element, config)
    );
  }

  /**
   * @param {string|Element|Element[]} selector
   * @param {object} config
   */
  tab(selector = '[data-bs-toggle="tab"]', config = {}) {
    return this.app.getBoundedInstanceList(
      selector,
      'bs.tab',
      (element) => new bootstrap.Tab(element, config)
    );
  }

  /**
   * @param {string|Element|Element[]} selector
   * @param {object} config
   */
  toast(selector = '[data-bs-toggle="toast"]', config = {}) {
    return this.app.getBoundedInstanceList(
      selector,
      'bs.toast',
      (element) => new bootstrap.Toast(element, config)
    );
  }

  /**
   * @param {string|Element} selector
   * @param {object} config
   */
  keepTab(selector = null, config = {}) {
    return this.app.import('@unicorn/bootstrap/keep-tab.js')
      .then((m) => {
        if (selector) {
          return new m.LoadTab(selector, config);
        }

        return m;
      });
  }

  /**
   * @param {string|Element} selector
   * @param {object} config
   */
  buttonRadio(selector = null, config = {}) {
    return this.app.import('@unicorn/bootstrap/button-radio.js')
      .then((m) => {
        if (selector) {
          return m.ButtonRadio.handle(selector, config);
        }

        return m;
      });
  }
}
