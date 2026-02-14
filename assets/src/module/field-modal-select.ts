import { template } from 'lodash-es';
import { data } from '../data';
import { __, highlight, html, selectOne, simpleAlert, slideUp } from '../service';
import type { IFrameModalElement } from './iframe-modal';

export type ModalSelectCallback = (item: any, ...args: any[]) => void;

export function createCallback(
  type: 'list' | 'single',
  selector: string,
  modalSelector: string
): ModalSelectCallback {
  switch (type) {
    case 'list':
      return (item: any) => {
        const modalList = document.querySelector(selector) as any as ModalListSelectElement;
        const checked = item.checked;

        if (checked === undefined) {
          // Single selection mode
          if (!modalList.querySelector(`[data-value="${item.value}"]`)) {
            modalList.appendItem(item, true);

            selectOne<IFrameModalElement>(modalSelector)?.close();
          } else {
            simpleAlert(__('unicorn.field.modal.already.selected'));
          }
        } else if (checked) {
          // Multiple selection mode - add item
          try {
            modalList.appendIfNotExists(item, true);
          } catch (e) {
            window.postMessage({
              task: 'remove-row',
              value: item,
              id: item.instanceId
            });
            simpleAlert((e as Error).message);
          } finally {
            modalList.updateSelected();
          }
        } else if (!checked) {
          // Multiple selection mode - remove item
          modalList.removeItem(item).then(() => {
            console.log(modalList.items);
            modalList.updateSelected();
          });
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
  multiCheck?: boolean;
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
  isMultiCheck = false;

  get listContainer() {
    return this.querySelector<HTMLDivElement>('[data-role=list-container]')!;
  }

  get selectButton() {
    return this.querySelector<HTMLAnchorElement>('[data-role=select]')!;
  }

  get modal() {
    return document.querySelector<IFrameModalElement>(this.options.modalSelector);
  }

  get items(): HTMLElement[] {
    return Array.from(this.listContainer.querySelectorAll<HTMLElement>('[data-value]'));
  }

  get count(): number {
    return this.items.length;
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

    this.selectButton.addEventListener('click', (e) => {
      try {
        this.open(e);
      } catch (e) {
        simpleAlert((e as Error).message);
      }
    });

    this.querySelector('[data-role=clear]')?.addEventListener('click', () => {
      this.removeAll();
    });

    this.selectButton.style.pointerEvents = '';

    this.render();

    this.enableMultiCheck(this.options.multiCheck || false);
  }

  render() {
    const items: ReceivedItem[] = data('unicorn.modal-field')[this.options.dataKey] || [];

    items.forEach((item) => {
      this.appendItem(item);
    });
  }

  appendItem(item: ReceivedItem, highlights = false) {
    const max = this.options.max;

    if (max && this.count >= max) {
      throw new Error(__('unicorn.field.modal.max.selected', max));
    }

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

    if (this.isMultiCheck) {
      this.updateSelected();
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

  async removeItem(item: ReceivedItem | string | number) {
    if (typeof item === 'object') {
      item = item.value;
    }

    const element = this.listContainer.querySelector<HTMLElement>(`[data-value="${item}"]`);

    if (element) {
      return slideUp(element).then(() => {
        element.remove();
        this.toggleRequired();

        if (this.isMultiCheck) {
          this.updateSelected();
        }
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

    if (this.isMultiCheck) {
      this.updateSelected();
    }
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

    if (this.count >= max) {
      throw new Error(__('unicorn.field.modal.max.selected', max));
    }

    this.modal?.open(target.href, { size: 'modal-xl' });
  }

  enableMultiCheck(enable = true) {
    this.isMultiCheck = enable;

    if (enable) {
      this.updateSelected();
    } else {
      this.clearSelected();
    }
  }

  updateSelected() {
    const url = new URL(this.selectButton.href);
    url.searchParams.set('selected', this.items.map((i) => i.dataset.value).join(','));
    this.selectButton.href = url.toString();
  }

  clearSelected() {
    const url = new URL(this.selectButton.href);
    url.searchParams.delete('selected');
    this.selectButton.href = url.toString();
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
    if (e.origin === options.origin) {
      if (Array.isArray(e.data) && e.data[0] === options.instanceId) {
        callback(e.data[1]);
      }

      if (
        typeof e.data === 'object'
        && e.data !== null
        && e.data.id === options.instanceId
        && e.data.task === 'select-row'
      ) {
        const item = e.data.value;
        item.checked = e.data.checked;
        item.instanceId = e.data.id;

        callback(e.data.value);
      }
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
