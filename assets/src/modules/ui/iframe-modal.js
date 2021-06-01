
/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */
import { defaultsDeep } from 'lodash-es';

class IFrameModal extends HTMLElement {
  static is = 'uni-iframe-modal';

  template() {
    return `
<div class="modal fade c-unicorn-iframe-modal" id="${this.options?.id}"
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
    this.modal = new bootstrap.Modal(this.modalElement);
    this.iframe = this.modalElement.querySelector('iframe');

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

  open(href, options = {}) {
    options = defaultsDeep(
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

  resize(iframe) {
    setTimeout(() => {
      let height = iframe.contentWindow.document.documentElement.scrollHeight;

      if (height < 500) {
        height = 500;
      }
      
      iframe.style.height = height + 'px';
    }, 30);
  }
}

customElements.define(IFrameModal.is, IFrameModal);

u.directive('modal-link', {
  mounted(el, binding) {
    let options = {};
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
      
      if (el.src) {
        im.open(el.src, options);
      } else if (el.href) {
        im.open(el.href, options);
      }
    });
  }
});
