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
   * @param selector
   * @param config
   */
  tooltip(selector = '[data-bs-toggle="tooltip"]', config = {}) {
    return this.app.getBoundedInstanceList(
      selector,
      'bs.tooltip',
      (ele) => new bootstrap.Tooltip(ele, config)
    );
  }

  modal(selector, config = {}) {
    return this.app.getBoundedInstance(
      selector,
      'bs.modal',
      (element) => new bootstrap.Modal(element, config)
    );
  }

  collapse(seletor = '[data-bs-toggle=collapse]', config = {}) {
    return this.app.getBoundedInstanceList(
      selector,
      'bs.collapse',
      (ele) => new bootstrap.Collapse(ele, config)
    );
  }

  offcanvas(seletor = '[data-bs-toggle="offcanvas"]', config = {}) {
    return this.app.getBoundedInstanceList(
      selector,
      'bs.offcanvas',
      (ele) => new bootstrap.Offcanvas(ele, config)
    );
  }

  popover(selector = '[data-bs-toggle="popover"]', config = {}) {
    return this.app.getBoundedInstanceList(
      selector,
      'bs.popover',
      (ele) => new bootstrap.Popover(ele, config)
    );
  }

  scrollspy(seletor = '[data-bs-spy="scroll"]', config = {}) {
    return this.app.getBoundedInstanceList(
      selector,
      'bs.scrollspy',
      (element) => new bootstrap.ScrollSpy(element, config)
    );
  }

  tab(selector = '[data-bs-toggle="tab"]', config = {}) {
    return this.app.getBoundedInstanceList(
      selector,
      'bs.tab',
      (element) => new bootstrap.Tab(element, config)
    );
  }

  toast(seletor = '[data-bs-toggle="toast"]', config = {}) {
    return this.app.getBoundedInstanceList(
      selector,
      'bs.toast',
      (element) => new bootstrap.Toast(element, config)
    );
  }

  keepTab(selector = null, options = {}) {
    return this.app.import('@unicorn/bootstrap/keep-tab.js')
      .then((m) => {
        if (selector) {
          return new m.LoadTab(selector, options);
        }

        return m;
      });
  }

  buttonRadio(selector = null, options = {}) {
    return this.app.import('@unicorn/bootstrap/button-radio.js')
      .then((m) => {
        if (selector) {
          return m.ButtonRadio.handle(selector, options);
        }

        return m;
      });
  }
}
