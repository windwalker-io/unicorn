import type { ButtonRadio, ButtonRadioModule, ButtonRadioOptions } from '../bootstrap/button-radio';
import type { KeepTab, KeepTabModule, KeepTabOptions } from '../bootstrap/keep-tab';
import { html, module, selectAll, selectOne } from '../service';
import type { UIThemeInterface } from '../types';
import { Tooltip } from 'bootstrap';

export class UIBootstrap5 implements UIThemeInterface {
  static instance: UIBootstrap5 | null = null;

  static get() {
    return this.instance ??= new this();
  }

  renderMessage(messages: string | string[], type: string = 'info') {
    if (!Array.isArray(messages)) {
      messages = [messages];
    }

    let text = '';

    messages.forEach((msg) => {
      text += `<div class="">${msg}</div>`;
    });

    const msgHtml = html(`<div class="alert alert-${type} alert-dismissible fade show" role="alert">
  ${text}
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>`);

    const container = selectOne('.c-messages-container');

    if (container) {
      container.appendChild(msgHtml);
    }
  }

  clearMessages() {
    const container = selectOne('.c-messages-container');

    if (container) {
      container.innerHTML = '';
    }
  }

  async keepTab(): Promise<KeepTabModule>;
  async keepTab(selector?: string | HTMLElement, options?: KeepTabOptions): Promise<KeepTab>;
  async keepTab(selector?: string | HTMLElement, options: KeepTabOptions = {}): Promise<any> {
    const module = await import('../bootstrap/keep-tab');

    await module.ready;

    if (selector) {
      return new module.KeepTab(selector, options);
    }

    return module;
  }

  async buttonRadio(): Promise<ButtonRadioModule>;
  async buttonRadio(selector: string | HTMLElement, config?: ButtonRadioOptions): Promise<ButtonRadio>;
  async buttonRadio(selector?: string | HTMLElement, config: ButtonRadioOptions = {}): Promise<any> {
    const m = await import('../bootstrap/button-radio');

    await m.ready;

    if (selector) {
      return m.ButtonRadio.handle(selector, config);
    }

    return m;
  }

  tooltip(selector: NodeListOf<Element> | Element | string = '[data-bs-toggle="tooltip"]', config: Record<string, any> = {}) {
    return module(
      selector,
      'bs.tooltip',
      (ele) => Tooltip.getOrCreateInstance(ele, config)
    );
  }

  getMajorVersion(module: any) {
    return Number(module.VERSION.split('.').shift());
  }
}
