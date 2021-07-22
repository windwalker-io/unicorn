/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */
import { template } from 'lodash-es';

class ModalField {
  static install(app, options = {}) {
    u.import('@sortablejs');

    app.$modalField = new this(app);
  }

  constructor(app) {
    this.app = app;
  }

  createCallback(type, selector, modalSelector) {
    switch (type) {
      // case 'tag':
      //   return () => {
      //
      //   };
      case 'list':
        return (item) => {
          const modalList = document.querySelector(selector);

          if (!modalList.querySelector(`[data-value="${item.value}"]`)) {
            modalList.append(item, true);

            document.querySelector(modalSelector).close();
          } else {
            alert(u.__('unicorn.field.modal.already.selected'));
          }
        };

      case 'single':
      default:
        return (item) => {
          const element = document.querySelector(selector);

          const image = element.querySelector('[data-role=image]');
          const title = element.querySelector('[data-role=title]');
          const store = element.querySelector('[data-role=value]');

          if (image && item.image) {
            image.style.backgroundImage = `url(${item.image});`;
          }

          title.value = item.title || '';
          store.value = item.value || '';

          store.dispatchEvent(new CustomEvent('change'));

          document.querySelector(modalSelector).close();

          u.$ui.highlight(title);
        };
    }
  }
}

class ModalList extends HTMLElement {
  static is = 'uni-modal-list';

  get listContainer() {
    return this.querySelector('[data-role=list-container]');
  }

  get modal() {
    return document.querySelector(this.options.modalSelector);
  }

  get items() {
    return this.listContainer.children;
  }

  connectedCallback() {
    this.options = JSON.parse(this.getAttribute('options') || '{}');
    this.itemTemplate = template(document.querySelector(this.options.itemTemplate).innerHTML);

    if (this.options.sortable) {
      u.import('@sortablejs').then(() => {
        new Sortable(this.listContainer, { handle: '.h-drag-handle' });
      });
    }

    const selectButton = this.querySelector('[data-role=select]');
    selectButton.addEventListener('click', (e) => {
      this.open(e);
    });

    this.querySelector('[data-role=clear]').addEventListener('click', () => {
      [].forEach.call(this.items, (item) => {
        item.querySelector('[data-role=remove]').click();
      });
    });

    selectButton.style.pointerEvents = null;

    this.render();
  }

  render() {
    const items = u.data('unicorn.modal-field')[this.options.dataKey] || [];

    items.forEach((item) => {
      this.append(item);
    });
  }

  append(item, highlight = false) {
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
    const placeholder = this.querySelector('[data-role=validation-placeholder]');

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
