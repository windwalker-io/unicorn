import type { ButtonRadio } from '../bootstrap/button-radio';
import type { LoadTab } from '../bootstrap/keep-tab';
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

  async keepTab(): Promise<typeof import('../bootstrap/keep-tab')>;
  async keepTab(selector?: string | HTMLElement, config?: Record<string, any>): Promise<LoadTab>;
  async keepTab(selector?: string | HTMLElement, config: Record<string, any> = {}): Promise<any> {
    const module = await import('../bootstrap/keep-tab');

    if (selector) {
      return new module.LoadTab(selector, config);
    }

    return module;
  }

  async buttonRadio(): Promise<typeof import('../bootstrap/button-radio')>;
  async buttonRadio(selector: string | HTMLElement, config?: Record<string, any>): Promise<ButtonRadio>;
  async buttonRadio(selector?: string | HTMLElement, config: Record<string, any> = {}): Promise<any> {
    const m = await import('../bootstrap/button-radio');

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
