import { template } from 'lodash-es';
import type { UnicornApp, UnicornUI } from '../../../types';
import type { IFrameModal } from '../ui/iframe-modal';
import type { UIBootstrap5 } from '../ui/ui-bootstrap5';

declare global {
  var Sortable: any;
}

export class ModalField {
  static install(app: UnicornApp, options = {}) {
    app.$modalField = new this(app);
  }

  constructor(protected app: UnicornApp) {
    //
  }

  get $ui() {
    return this.app.inject<UnicornUI>('$ui');
  }

  get $bootstrap() {
    return this.$ui['bootstrap'] as UIBootstrap5;
  }

  createCallback(type: string, selector: string, modalSelector: string) {
    switch (type) {
      // case 'tag':
      //   return () => {
      //
      //   };
      case 'list':
        return (item) => {
          const modalList = document.querySelector(selector) as any as ModalList;

          if (!modalList.querySelector(`[data-value="${item.value}"]`)) {
            modalList.appendItem(item, true);

            this.$bootstrap.modal(modalSelector).close();
          } else {
            alert(u.__('unicorn.field.modal.already.selected'));
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

          this.$bootstrap.modal(modalSelector).close();

          u.$ui.highlight(title);
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

class ModalList extends HTMLElement {
  static is = 'uni-modal-list';

  itemTemplate: ReturnType<typeof template>;
  options: ModalListOptions;

  get listContainer() {
    return this.querySelector<HTMLDivElement>('[data-role=list-container]');
  }

  get modal() {
    return document.querySelector<IFrameModal>(this.options.modalSelector);
  }

  get items(): Element[] {
    return Array.from(this.listContainer.children);
  }

  connectedCallback() {
    this.options = JSON.parse(this.getAttribute('options') || '{}');
    this.itemTemplate = template(document.querySelector(this.options.itemTemplate).innerHTML);

    const emptyInput = this.querySelector<HTMLInputElement>('[data-role=empty]');

    if (emptyInput) {
      emptyInput.name = emptyInput.dataset.name;
    }

    if (this.options.sortable) {
      u.import('@sortablejs').then(() => {
        new Sortable(this.listContainer, { handle: '.h-drag-handle' });
      });
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
    const items = u.data('unicorn.modal-field')[this.options.dataKey] || [];

    items.forEach((item) => {
      this.appendItem(item);
    });
  }

  appendItem(item: any, highlight = false) {
    const itemHtml = u.html(this.itemTemplate({ item }));

    itemHtml.dataset.value = item.value;
    itemHtml.querySelector('[data-role=remove]').addEventListener('click', () => {
      u.$ui.slideUp(itemHtml).then(() => {
        itemHtml.remove();
        this.toggleRequired();
      });
    });

    this.listContainer.appendChild(itemHtml);
    this.toggleRequired();

    if (highlight) {
      u.$ui.highlight(itemHtml);
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
        u.__('unicorn.field.modal.max.selected', max)
      );

      return;
    }

    this.modal.open(event.target.href, { size: 'modal-xl' });
  }
}

u.defineCustomElement(ModalList.is, ModalList);

u.use(ModalField);
