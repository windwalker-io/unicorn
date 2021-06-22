/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

export class UIBootstrap5 {
  static install(app) {
    app.$ui.bootstrap = new this(app.$ui);
  }

  constructor(ui) {
    this.ui = ui;
    this.app = ui.app;
  }

  /**
   * @see https://getbootstrap.com/docs/5.0/components/tooltips/#example-enable-tooltips-everywhere
   *
   * @param selector
   * @param config
   */
  tooltip(selector = '[data-bs-toggle="tooltip"]', config = {}) {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll(selector))
    return tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl, config);
    });
  }

  modal(selector, config = {}) {
    return this.app.getBoundedInstance(
      selector,
      'bs.modal',
      (element) => new bootstrap.Modal(element, config)
    );
  }

  collapse(seletor, config = {}) {
    return this.app.getBoundedInstance(
      selector,
      'bs.collapse',
      (element) => new bootstrap.Collapse(element, config)
    );
  }

  offcanvas(seletor, config = {}) {
    return this.app.getBoundedInstance(
      selector,
      'bs.collapse',
      (element) => new bootstrap.Offcanvas(element, config)
    );
  }

  popover(seletor, config = {}) {
    return this.app.getBoundedInstance(
      selector,
      'bs.collapse',
      (element) => new bootstrap.Popover(element, config)
    );
  }

  scrollspy(seletor, config = {}) {
    return this.app.getBoundedInstance(
      selector,
      'bs.collapse',
      (element) => new bootstrap.ScrollSpy(element, config)
    );
  }

  tab(seletor, config = {}) {
    return this.app.getBoundedInstance(
      selector,
      'bs.collapse',
      (element) => new bootstrap.Tab(element, config)
    );
  }

  toast(seletor, config = {}) {
    return this.app.getBoundedInstance(
      selector,
      'bs.collapse',
      (element) => new bootstrap.Toast(element, config)
    );
  }
}
