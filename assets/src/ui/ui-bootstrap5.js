/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

export class UIBootstrap5 {
  static install(unicorn) {
    unicorn.ui.bootstrap = new this(unicorn.ui);
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
  tooltip(selector = '[data-bs-toggle="tooltip"]', config) {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll(selector))
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl, config);
    });
  }
}
