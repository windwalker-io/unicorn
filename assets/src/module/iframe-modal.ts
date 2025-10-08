import { Modal } from 'bootstrap';
import { useUniDirective } from '../composable';
import { mergeDeep } from '../utilities';

interface IFrameModalOptions {
  id?: string;
  size?: string;
  resize?: boolean;
  height?: string;
}

export class IFrameModalElement extends HTMLElement {
  static is = 'uni-iframe-modal';

  options!: IFrameModalOptions;
  modalElement!: HTMLDivElement;
  modal!: Modal;
  iframe!: HTMLIFrameElement;

  template() {
    return `
<div class="modal fade c-unicorn-iframe-modal" id="${this.getModalId()}"
    data-iframe-modal>
    <div class="modal-dialog ${this.options?.size || 'modal-xl'}">
        <div class="modal-content">
            <div class="modal-body">
                <iframe class="c-unicorn-iframe-modal__iframe" width="100%" src="" frameborder="0"></iframe>
            </div>
        </div>
    </div>
</div>`;
  }

  get selector() {
    return this.getAttribute('selector') || '[data-iframe-modal]';
  }

  async getBootstrapModal() {
    const { Modal } = await import('bootstrap');

    return this.modal ??= Modal.getOrCreateInstance(this.modalElement);
  }

  connectedCallback() {
    this.options = JSON.parse(this.getAttribute('options') || '{}');

    if (!this.innerHTML.trim()) {
      this.innerHTML = this.template();
    }

    this.modalElement = this.querySelector<HTMLDivElement>(this.selector)!;
    this.iframe = this.modalElement.querySelector<HTMLIFrameElement>('iframe')!;

    // @ts-ignore
    this.iframe.modalLink = () => {
      return this;
    };

    this.bindEvents();
    this.getBootstrapModal();
  }

  bindEvents() {
    this.modalElement.addEventListener('hidden.bs.modal', () => {
      this.iframe.src = '';
    });
  }

  async open(href: string, options: IFrameModalOptions = {}) {
    options = mergeDeep(
      {
        height: undefined,
        resize: false,
        size: 'modal-lg',
      },
      this.options,
      options
    );

    if (options.resize) {
      const onload = () => {
        this.resize(this.iframe);

        this.iframe.removeEventListener('load', onload);
      };

      this.iframe.addEventListener('load', onload);
    } else {
      this.iframe.style.height = options.height || '500px';
    }

    if (options.size != null) {
      const dialog = this.modalElement.querySelector<HTMLDivElement>('.modal-dialog')!;
      dialog.classList.remove('modal-lg', 'modal-xl', 'modal-sm', 'modal-xs');
      dialog.classList.add(options.size);
    }

    this.iframe.src = href;
    const modal = await this.getBootstrapModal();
    modal.show();
  }

  async close() {
    this.iframe.src = '';
    const modal = await this.getBootstrapModal();
    modal.hide();
  }

  resize(iframe: HTMLIFrameElement) {
    setTimeout(() => {
      if (!iframe.contentWindow) {
        return;
      }

      let height = iframe.contentWindow.document.documentElement.scrollHeight;

      height += 30;

      if (height < 500) {
        height = 500;
      }

      iframe.style.height = height + 'px';
    }, 30);
  }

  getModalId() {
    return this.options?.id || this.id + '__modal';
  }
}

customElements.define(IFrameModalElement.is, IFrameModalElement);

export const ready = useUniDirective('modal-link', {
  mounted(el, binding) {
    let options: IFrameModalOptions = {};

    options.height = el.dataset.height;
    options.resize = el.dataset.resize === '1' || el.dataset.resize === 'true';
    options.size = el.dataset.size;

    const target = binding.value;

    el.style.pointerEvents = '';

    el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const im = document.querySelector(target);
      
      if (!im) {
        return;
      }
      
      if ('src' in el) {
        im.open(el.src, options);
      } else if ('href' in el) {
        im.open(el.href, options);
      }
    });
  }
});

export interface IFrameModalModule {
  IFrameModalElement: typeof IFrameModalElement;
  ready: typeof ready;
}
