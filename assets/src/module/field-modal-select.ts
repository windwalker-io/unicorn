import type { IFrameModalElement } from './iframe-modal';
import { data } from '../data';
import { __, highlight, html, selectOne, slideUp } from '../service';
import { template } from 'lodash-es';
import Sortable from 'sortablejs';

export class ModalSelect {
  createCallback(type: string, selector: string, modalSelector: string) {
    switch (type) {
      // case 'tag':
      //   return () => {
      //
      //   };
      case 'list':
        return (item) => {
          const modalList = document.querySelector(selector) as any as ModalListSelectElement;

          if (!modalList.querySelector(`[data-value="${item.value}"]`)) {
            modalList.appendItem(item, true);

            selectOne<IFrameModalElement>(modalSelector).close();
          } else {
            alert(__('unicorn.field.modal.already.selected'));
          }
        };

      case 'single':
      default:
        return (item) => {
          const element = document.querySelector<HTMLDivElement>(selector);

          const image = element.querySelector<HTMLDivElement>('[data-role=image]');
          const title = element.querySelector<HTMLInputElement>('[data-role=title]');
          const store = element.querySelector<HTMLInputElement>('[data-role=value]');

          if (image && item.image) {
            image.style.backgroundImage = `url(${item.image});`;
          }

          title.value = item.title || '';
          store.value = item.value || '';

          store.dispatchEvent(new CustomEvent('change'));

          selectOne<IFrameModalElement>(modalSelector).close();

          highlight(title);
        };
    }
  }
}

interface ModalListOptions {
  modalSelector: string;
  itemTemplate: string;
  sortable: boolean;
  dataKey: string;
  max: number;
}

class ModalListSelectElement extends HTMLElement {
  static is = 'uni-modal-list';

  itemTemplate: ReturnType<typeof template>;
  options: ModalListOptions;

  get listContainer() {
    return this.querySelector<HTMLDivElement>('[data-role=list-container]');
  }

  get modal() {
    return document.querySelector<IFrameModalElement>(this.options.modalSelector);
  }

  get items(): Element[] {
    return Array.from(this.listContainer.children);
  }

  connectedCallback() {
    this.options = JSON.parse(this.getAttribute('options') || '{}');
    this.itemTemplate = template(document.querySelector(this.options.itemTemplate)!.innerHTML);

    const emptyInput = this.querySelector<HTMLInputElement>('[data-role=empty]');

    if (emptyInput) {
      emptyInput.name = emptyInput.dataset.name;
    }

    if (this.options.sortable) {
      new Sortable(this.listContainer, { handle: '.h-drag-handle' });
    }

    const selectButton = this.querySelector<HTMLButtonElement>('[data-role=select]');
    selectButton.addEventListener('click', (e) => {
      this.open(e);
    });

    this.querySelector('[data-role=clear]').addEventListener('click', () => {
      this.items.forEach((item) => {
        item.querySelector<HTMLButtonElement>('[data-role=remove]').click();
      });
    });

    selectButton.style.pointerEvents = null;

    this.render();
  }

  render() {
    const items = data('unicorn.modal-field')[this.options.dataKey] || [];

    items.forEach((item) => {
      this.appendItem(item);
    });
  }

  appendItem(item: any, highlights = false) {
    const itemHtml = html(this.itemTemplate({ item }));

    itemHtml.dataset.value = item.value;
    itemHtml.querySelector('[data-role=remove]').addEventListener('click', () => {
      slideUp(itemHtml).then(() => {
        itemHtml.remove();
        this.toggleRequired();
      });
    });

    this.listContainer.appendChild(itemHtml);
    this.toggleRequired();

    if (highlights) {
      highlight(itemHtml);
    }
  }

  toggleRequired() {
    const placeholder = this.querySelector<HTMLInputElement>('[data-role=validation-placeholder]');

    if (placeholder) {
      placeholder.disabled = this.listContainer.children.length !== 0;
    }
  }

  open(event) {
    event.preventDefault();
    event.stopPropagation();

    const max = this.options.max;

    if (!max) {
      this.modal.open(event.target.href, { size: 'modal-xl' });
      return;
    }

    if (this.listContainer.children.length >= max) {
      alert(
        __('unicorn.field.modal.max.selected', max)
      );

      return;
    }

    this.modal.open(event.target.href, { size: 'modal-xl' });
  }
}

customElements.define(ModalListSelectElement.is, ModalListSelectElement);
