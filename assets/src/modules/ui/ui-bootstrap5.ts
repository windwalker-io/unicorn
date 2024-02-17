import type { UnicornApp, UnicornHelper, UnicornLoader, UnicornUI } from '../../../types';

declare type ElementSelector = Parameters<typeof UnicornHelper.prototype.module>[0];

declare global {
  var bootstrap: any;
}

export class UIBootstrap5 {
  static install(app: UnicornApp) {
    app.$ui.bootstrap = new this(app, app.$ui);
    app.$ui.theme = app.$ui.bootstrap;
  }

  constructor(protected app: UnicornApp, protected ui: UnicornUI) {
    //
  }

  get $helper() {
    return this.app.inject<UnicornHelper>('$helper');
  }

  get $loader() {
    return this.app.inject<UnicornLoader>('$loader');
  }

  renderMessage(messages: string | string[], type: string = 'info') {
    if (!Array.isArray(messages)) {
      messages = [messages];
    }

    let text = '';

    messages.forEach((msg) => {
      text += `<div class="">${msg}</div>`;
    });

    const html = this.$helper.html(`<div class="alert alert-${type} alert-dismissible fade show" role="alert">
  ${text}
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>`);

    const container = this.$helper.selectOne('.c-messages-container');

    if (container) {
      container.appendChild(html);
    }
  }

  clearMessages() {
    const container = this.$helper.selectOne('.c-messages-container');

    if (container) {
      container.innerHTML = '';
    }
  }

  /**
   * @see https://getbootstrap.com/docs/5.0/components/tooltips/#example-enable-tooltips-everywhere
   */
  tooltip(selector: ElementSelector = '[data-bs-toggle="tooltip"]', config: Record<string, any> = {}) {
    return this.$helper.module(
      selector,
      'bs.tooltip',
      (ele) => this.getOrCreateInstance(bootstrap.Tooltip, ele, config)
    );
  }

  /**
   * @param {string|Element} selector
   * @param {object} config
   */
  modal(selector: ElementSelector, config: Record<string, any> = {}) {
    return this.$helper.module(
      selector,
      'bs.modal',
      (ele) => this.getOrCreateInstance(bootstrap.Modal, ele, config)
    );
  }

  collapse(selector: ElementSelector = '[data-bs-toggle=collapse]', config: Record<string, any> = {}) {
    return this.$helper.module(
      selector,
      'bs.collapse',
      (ele) => this.getOrCreateInstance(bootstrap.Collapse, ele, config)
    );
  }

  offcanvas(selector: ElementSelector = '[data-bs-toggle="offcanvas"]', config: Record<string, any> = {}) {
    return this.$helper.module(
      selector,
      'bs.offcanvas',
      (ele) => this.getOrCreateInstance(bootstrap.Offcanvas, ele, config)
    );
  }

  popover(selector: ElementSelector = '[data-bs-toggle="popover"]', config: Record<string, any> = {}) {
    return this.$helper.module(
      selector,
      'bs.popover',
      (ele) => this.getOrCreateInstance(bootstrap.Popover, ele, config)
    );
  }

  scrollspy(selector: ElementSelector = '[data-bs-spy="scroll"]', config: Record<string, any> = {}) {
    return this.$helper.module(
      selector,
      'bs.scrollspy',
      (ele) => this.getOrCreateInstance(bootstrap.ScrollSpy, ele, config)
    );
  }

  tab(selector: ElementSelector = '[data-bs-toggle="tab"]', config: Record<string, any> = {}) {
    return this.$helper.module(
      selector,
      'bs.tab',
      (ele) => this.getOrCreateInstance(bootstrap.Tab, ele, config)
    );
  }

  toast(selector: ElementSelector = '[data-bs-toggle="toast"]', config: Record<string, any> = {}) {
    return this.$helper.module(
      selector,
      'bs.toast',
      (ele) => this.getOrCreateInstance(bootstrap.Toast, ele, config)
    );
  }

  keepTab(selector?: string | HTMLElement, config: Record<string, any> = {}) {
    return this.$loader.import('@unicorn/bootstrap/keep-tab.js')
      .then((m) => {
        if (selector) {
          return new m.LoadTab(selector, config);
        }

        return m;
      });
  }

  async buttonRadio(selector?: string | HTMLElement, config: Record<string, any> = {}) {
    let m = await this.$loader.import('@unicorn/bootstrap/button-radio.js');

    if (selector) {
      return m.ButtonRadio.handle(selector, config);
    }

    return m;
  }

  getMajorVersion(module: any) {
    return Number(module.VERSION.split('.').shift());
  }

  getOrCreateInstance(module: any, ele: any, config: Record<string, any> = {}) {
    if (this.getMajorVersion(module) <= 4) {
      return new module(ele, config);
    } else {
      return module.getOrCreateInstance(ele, config);
    }
  }
}
