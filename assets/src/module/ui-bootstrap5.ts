import * as bootstrap from 'bootstrap';
import { Tooltip } from 'bootstrap';
import type { ButtonRadio, ButtonRadioModule, ButtonRadioOptions } from '../bootstrap/button-radio';
import type { KeepTab, KeepTabModule, KeepTabOptions } from '../bootstrap/keep-tab';
import { html, selectAll, selectOne, uid } from '../service';
import type { UIThemeInterface } from '../types';

export class UIBootstrap5 implements UIThemeInterface {
  static instance: UIBootstrap5 | null = null;

  bootstrap = bootstrap;

  static get() {
    return this.instance ??= new this();
  }

  renderMessage(messages: string | string[], type: string = 'info'): () => void {
    if (!Array.isArray(messages)) {
      messages = [messages];
    }

    let text = '';
    const id = 'uni-msg-' + uid();

    messages.forEach((msg) => {
      text += `<div class="">${msg}</div>`;
    });

    const msgHtml = html(`<div id="${id}" class="alert alert-${type} alert-dismissible fade show" role="alert">
  ${text}
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>`);

    const container = selectOne('.c-messages-container');

    if (container) {
      container.appendChild(msgHtml);
    }

    return () => {
      const ele = document.getElementById(id);

      if (ele) {
        ele.remove();
      }
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
  async buttonRadio(selector?: string | HTMLElement, options?: ButtonRadioOptions): Promise<ButtonRadio>;
  async buttonRadio(selector?: string | HTMLElement, options: ButtonRadioOptions = {}): Promise<any> {
    const m = await import('../bootstrap/button-radio');

    await m.ready;

    if (selector) {
      return m.ButtonRadio.handle(selector, options);
    }

    return m;
  }

  tooltip(
    selector: NodeListOf<Element> | Element | string = '[data-bs-toggle="tooltip"]',
    config: Partial<Tooltip.Options> = {}
  ): Tooltip[] {
    return this.selectAsArray(selector)
      .map((ele) => Tooltip.getOrCreateInstance(ele, config));
  }

  protected selectAsArray(selector: NodeListOf<Element> | Element | string) {
    if (selector instanceof NodeList) {
      return Array.from(selector);
    } else if (typeof selector === 'string') {
      return selectAll(selector);
    } else {
      return [selector];
    }
  }

  getMajorVersion(module: any) {
    return Number(module.VERSION.split('.').shift());
  }

  pushBootstrapToGlobal() {
    window.bootstrap = bootstrap;
  }
}

declare global {
  export interface Window {
    bootstrap: typeof bootstrap;
  }
}
