import type { IFrameModalElement } from './iframe-modal';
import { data } from '../data';
import { __, highlight, html, selectOne, slideUp } from '../service';
import { template } from 'lodash-es';

export type ModalSelectCallback = (item: any) => void;

export function createCallback(type: 'list' | 'single', selector: string, modalSelector: string): ModalSelectCallback {
  switch (type) {
    // case 'tag':
    //   return () => {
    //
    //   };
    case 'list':
      return (item: any) => {
        const modalList = document.querySelector(selector) as any as ModalListSelectElement;

        if (!modalList.querySelector(`[data-value="${item.value}"]`)) {
          modalList.appendItem(item, true);

          selectOne<IFrameModalElement>(modalSelector)?.close();
        } else {
          alert(__('unicorn.field.modal.already.selected'));
        }
      };

    case 'single':
    default:
      return (item) => {
        const element = document.querySelector<HTMLDivElement>(selector)!;

        const image = element.querySelector<HTMLDivElement>('[data-role=image]')!;
        const title = element.querySelector<HTMLInputElement>('[data-role=title]')!;
        const store = element.querySelector<HTMLInputElement>('[data-role=value]')!;

        if (image && item.image) {
          image.style.backgroundImage = `url(${item.image});`;
        }

        title.value = item.title || '';
        store.value = item.value || '';

        store.dispatchEvent(new CustomEvent('change'));

        selectOne<IFrameModalElement>(modalSelector)?.close();

        highlight(title);
      };
  }
}

interface ModalListOptions {
  modalSelector: string;
  itemTemplate: string;
  sortable: boolean;
  dataKey: string;
  max: number;
}

export interface ReceivedItem {
  value: string | number;
  title?: string;
  image?: string;
  [key: string]: any;
}

class ModalListSelectElement extends HTMLElement {
  static is = 'uni-modal-list';

  itemTemplate!: ReturnType<typeof template>;
  options!: ModalListOptions;

  get listContainer() {
    return this.querySelector<HTMLDivElement>('[data-role=list-container]')!;
  }

  get modal() {
    return document.querySelector<IFrameModalElement>(this.options.modalSelector);
  }

  get items(): HTMLElement[] {
    return Array.from(this.listContainer.querySelectorAll<HTMLElement>('[data-value]'));
  }

  connectedCallback() {
    this.options = JSON.parse(this.getAttribute('options') || '{}');
    this.itemTemplate = template(document.querySelector(this.options.itemTemplate)!.innerHTML);

    const emptyInput = this.querySelector<HTMLInputElement>('[data-role=empty]');

    if (emptyInput) {
      emptyInput.name = emptyInput.dataset.name || '';
    }

    if (this.options.sortable) {
      import('sortablejs').then(({ default: Sortable }) => {
        new Sortable(this.listContainer, { handle: '.h-drag-handle', animation: 150 });
      });
    }

    const selectButton = this.querySelector<HTMLButtonElement>('[data-role=select]')!;
    selectButton.addEventListener('click', (e) => {
      this.open(e);
    });

    this.querySelector('[data-role=clear]')?.addEventListener('click', () => {
      this.removeAll();
    });

    selectButton.style.pointerEvents = '';

    this.render();
  }

  render() {
    const items: ReceivedItem[] = data('unicorn.modal-field')[this.options.dataKey] || [];

    items.forEach((item) => {
      this.appendItem(item);
    });
  }

  appendItem(item: ReceivedItem, highlights = false) {
    const itemHtml = html(this.itemTemplate({ item }));

    itemHtml.dataset.value = String(item.value);
    itemHtml.querySelector<HTMLButtonElement>('[data-role=remove]')?.addEventListener('click', () => {
      this.removeItem(item);
    });

    this.listContainer.appendChild(itemHtml);
    this.toggleRequired();

    if (highlights) {
      highlight(itemHtml);
    }
  }

  appendIfNotExists(item: ReceivedItem, highlights = false) {
    if (!this.isExists(item)) {
      this.appendItem(item, highlights);
    }
  }

  isExists(item: ReceivedItem | string | number): boolean {
    if (typeof item === 'object') {
      item = item.value;
    }

    return this.listContainer.querySelector(`[data-value="${item}"]`) !== null;
  }

  getItemElement(item: ReceivedItem | string | number): HTMLElement | null {
    if (typeof item === 'object') {
      item = item.value;
    }

    return this.listContainer.querySelector<HTMLElement>(`[data-value="${item}"]`);
  }

  getValues() {
    return this.items.map((item) => item.dataset.value);
  }

  removeItem(item: ReceivedItem | string | number) {
    if (typeof item === 'object') {
      item = item.value;
    }

    const element = this.listContainer.querySelector<HTMLElement>(`[data-value="${item}"]`);

    if (element) {
      slideUp(element).then(() => {
        element.remove();
        this.toggleRequired();
      });
    }
  }

  async removeAll() {
    const promises: Promise<any>[] = [];

    for (const item of this.items) {
      promises.push(slideUp(item).then(() => item.remove()));
    }

    await Promise.all(promises);

    this.toggleRequired();
  }

  toggleRequired() {
    const placeholder = this.querySelector<HTMLInputElement>('[data-role=validation-placeholder]');

    if (placeholder) {
      placeholder.disabled = this.listContainer.children.length !== 0;
    }
  }

  open(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    const max = this.options.max;

    const target = event.target as HTMLAnchorElement;

    if (!max) {
      this.modal?.open(target.href, { size: 'modal-xl' });
      return;
    }

    if (this.listContainer.children.length >= max) {
      alert(
        __('unicorn.field.modal.max.selected', max)
      );

      return;
    }

    this.modal?.open(target.href, { size: 'modal-xl' });
  }
}

async function init() {
  customElements.define(ModalListSelectElement.is, ModalListSelectElement);
}

export interface ModalListenMessagesOptions {
  origin: string;
  instanceId: string;
  type: 'list' | 'single';
  selector: string;
  modalSelector: string;
}

export function listenMessages(options: ModalListenMessagesOptions) {
  const callback = createCallback(options.type, options.selector, options.modalSelector);

  window.addEventListener('message', (e) => {
    if (e.origin === options.origin && Array.isArray(e.data) && e.data[0] === options.instanceId) {
      callback(e.data[1]);
    }
  });

  // Todo: Should remove this after 4.3 or 5.0
  // @ts-ignore
  window[options.instanceId] = callback;
}

export const ready = init();

export interface ModalSelectModule {
  createCallback: typeof createCallback;
  listenMessages: typeof listenMessages;
  ready: typeof ready;
}
