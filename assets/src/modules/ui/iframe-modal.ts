/// <reference types="../../../types/index" />

interface IFrameModalOptions {
  id?: string;
  size?: string;
  resize?: string;
  height?: string;
}

export class IFrameModal extends HTMLElement {
  static is = 'uni-iframe-modal';

  options: IFrameModalOptions;
  modalElement: HTMLDivElement;
  modal: any;
  iframe: HTMLIFrameElement;

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

  connectedCallback() {
    this.options = JSON.parse(this.getAttribute('options') || '{}');

    if (!this.innerHTML.trim()) {
      this.innerHTML = this.template();
    }

    this.modalElement = this.querySelector(this.selector);
    this.modal = u.$ui.bootstrap.modal(this.modalElement);
    this.iframe = this.modalElement.querySelector<HTMLIFrameElement>('iframe');

    // @ts-ignore
    this.iframe.modalLink = () => {
      return this;
    };

    this.bindEvents();
  }

  bindEvents() {
    this.modalElement.addEventListener('hidden.bs.modal', () => {
      this.iframe.src = '';
    });
  }

  open(href: string, options: IFrameModalOptions = {}) {
    options = u.defaultsDeep(
      options,
      this.options,
      {
        height: null,
        resize: false,
        size: 'modal-lg',
      }
    );

    if (options.resize) {
      let onload;
      this.iframe.addEventListener('load', onload = () => {
        this.resize(this.iframe);

        this.iframe.removeEventListener('load', onload);
      });
    } else {
      this.iframe.style.height = options.height || '500px';
    }

    if (options.size != null) {
      const dialog = this.modalElement.querySelector('.modal-dialog');
      dialog.classList.remove('modal-lg', 'modal-xl', 'modal-sm', 'modal-xs');
      dialog.classList.add(options.size);
    }

    this.iframe.src = href;
    this.modal.show();
  }

  close() {
    this.modal.hide();
    this.iframe.src = '';
  }

  resize(iframe: HTMLIFrameElement) {
    setTimeout(() => {
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

u.defineCustomElement(IFrameModal.is, IFrameModal);

u.directive('modal-link', {
  mounted(el, binding) {
    let options: IFrameModalOptions = {};

    options.height = el.dataset.height;
    options.resize = el.dataset.resize;
    options.size = el.dataset.size;

    const target = binding.value;

    el.style.pointerEvents = null;

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
