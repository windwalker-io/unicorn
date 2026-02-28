import { Modal } from 'bootstrap';
import { html } from '../service';
import { useUIBootstrap5 } from './useUIBootstrap5';

export interface BsModalAlertOptions {
  header?: string | HTMLElement | (() => HTMLElement | Promise<HTMLElement>);
  title?: string;
  text?: string;
  icon?: string | HTMLElement | (() => HTMLElement | Promise<HTMLElement>);
  content?: string | HTMLElement | (() => HTMLElement | Promise<HTMLElement>);
  size?: 'sm' | 'lg' | 'xl' | 'xxl';
  relatedTarget?: HTMLElement;
  buttons?: BsModalButton[];
  configure?: (el: HTMLElement) => HTMLElement | undefined;
}

export type BsModalButton = {
  text?: string | ((button: HTMLElement) => void);
  class?: string;
  attrs?: Record<string, string>;
  styles?: Record<string, string>;
  dismiss?: boolean;
  value?: any;
  href?: string;
  target?: string;
  onClick?: (value?: any, e?: MouseEvent) => any;
} | string | HTMLElement | (() => HTMLElement | Promise<HTMLElement>);

export interface BsModalAlertInstance {
  show(options: BsModalAlertOptions): Promise<any>;

  show(title: string, text?: string, icon?: string, options?: BsModalAlertOptions): Promise<any>;

  show(title: BsModalAlertOptions | string, text?: string, icon?: string, options?: BsModalAlertOptions): Promise<any>;

  hide: () => void;
  toggle: (relatedTarget?: HTMLElement) => void;
  dispose: () => void;
  destroy: () => void;
  instance: Modal;
  el: HTMLElement;
}

const defaultOptions = {
  buttons: [
    'OK'
  ],
};

export async function useBsModalAlert(
  options: Partial<Modal.Options>
): Promise<BsModalAlertInstance>
export async function useBsModalAlert(
  id?: string | HTMLElement,
  options?: Partial<Modal.Options>
): Promise<BsModalAlertInstance>;
export async function useBsModalAlert(
  id?: string | HTMLElement | Partial<Modal.Options>,
  options?: Partial<Modal.Options>
): Promise<BsModalAlertInstance> {
  await useUIBootstrap5();

  let modalElement: HTMLElement | null | undefined = undefined;

  if (typeof id !== 'string' && !(id instanceof HTMLElement)) {
    options = id;
    id = 'uni-modal-alert';
    modalElement = document.getElementById(id);
  } else {
    modalElement = typeof id === 'string' ? document.getElementById(id) : id;
  }

  if (!modalElement) {
    modalElement = html<HTMLDivElement>(`<div id="${id}" class="uni-modal-alert modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-body text-center p-4"></div>
      <div class="modal-footer"></div>
    </div>
  </div>
</div>`);

    document.body.appendChild(modalElement);
  }

  const modal = Modal.getOrCreateInstance(modalElement, options);

  return {
    show: (
      title: BsModalAlertOptions | string,
      text?: string,
      icon?: string,
      options?: BsModalAlertOptions
    ): Promise<any> => {
      if (typeof title === 'string') {
        options = options || {};
        options.title = title;
        options.text = text;
        options.icon = icon;
      } else {
        options = title;
      }

      return new Promise((resolve) => {
        prepareModalElement(modalElement, resolve, options);

        modal.show(options?.relatedTarget);
      });
    },
    hide: () => {
      modal.hide();
    },
    dispose: () => {
      modal.dispose();
    },
    toggle: (relatedTarget?: HTMLElement) => {
      modal.toggle(relatedTarget);
    },
    destroy: () => {
      modal.dispose();
      modalElement.remove();
    },
    instance: modal,
    el: modalElement,
  };
}

async function prepareModalElement(
  modalElement: HTMLElement,
  handler: (value?: any) => any,
  options?: BsModalAlertOptions
) {
  options = Object.assign({}, defaultOptions, options || {});

  let header = options.header;
  const content = options.content;

  modalElement.querySelector('.modal-header')?.remove();
  modalElement.querySelector('.modal-body')!.innerHTML = '';
  modalElement.querySelector('.modal-footer')!.innerHTML = '';

  const dialog = modalElement.querySelector('.modal-dialog');

  dialog?.classList.remove('modal-sm', 'modal-lg', 'modal-xl', 'modal-xxl');

  if (header) {
    if (typeof header === 'string') {
      header = `<div class="modal-header">
        <h5 class="modal-title">${header}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>`;
    }

    header = await anyToElement(header);

    // Remove existing header if exists
    modalElement.querySelector('.modal-header')?.remove();

    modalElement.querySelector('.modal-content')!.insertAdjacentElement('afterbegin', header);
  }

  if (content) {
    let contentElement = await anyToElement(content);

    modalElement.querySelector('.modal-body')!.appendChild(contentElement);
  } else {
    const title = options.title;
    const text = options.text;
    let icon = options.icon;

    if (icon) {
      if (typeof icon === 'string') {
        icon = `<div class="uni-modal-alert__icon text-center mb-3"><span class="${icon}" style="font-size: 64px;"></span></div>`;
      }

      icon = await anyToElement(icon);

      modalElement.querySelector('.modal-body')!.appendChild(icon);
    }

    if (title) {
      const titleEl = html(`<h4 class="uni-modal-alert__title">${title}</h4>`);

      modalElement.querySelector('.modal-body')!.appendChild(titleEl);
    }

    if (text) {
      const textEl = html(`<div class="uni-modal-alert__text">${text}</div>`);

      modalElement.querySelector('.modal-body')!.appendChild(textEl);
    }
  }

  const buttons = options.buttons!;

  for (const i in buttons) {
    const button = buttons[i];
    const isConfirm = buttons.length === 1 || (buttons.length === 2 && Number(i) === 1);

    const buttonElement = createButton(
      button,
      handler,
      isConfirm
    );

    modalElement.querySelector('.modal-footer')!.appendChild(await buttonElement);
  }

  if (options.size) {
    modalElement.querySelector('.modal-dialog')!.classList.add(`modal-${options.size}`);
  }

  if (options.configure) {
    modalElement = options.configure(modalElement) ?? modalElement;
  }

  return modalElement;
}

async function anyToElement(content: string | HTMLElement | (() => (HTMLElement | Promise<HTMLElement>))) {
  if (typeof content === 'function') {
    return content();
  }

  return typeof content === 'string' ? html(content) : content;
}

async function createButton(
  buttonOption: BsModalButton,
  handler: (value?: any) => any,
  isConfirm?: boolean): Promise<HTMLElement> {
  if (typeof buttonOption === 'function') {
    return await buttonOption();
  }

  if (typeof buttonOption === 'string') {
    buttonOption = {
      text: buttonOption,
      value: isConfirm ?? false,
      class: isConfirm ? 'btn btn-primary is-confirm' : 'btn btn-outline-secondary',
      styles: isConfirm ? { width: '150px' } : {},
      dismiss: true,
    };
  }

  // if not HTMLElement
  let button: HTMLElement;

  if (buttonOption instanceof HTMLElement) {
    button = buttonOption;
  } else {
    const {
      text,
      class: className = 'btn btn-secondary',
      attrs = {},
      styles = {},
      dismiss = true,
      value,
      href,
      target,
      onClick
    } = buttonOption;

    const tag = href ? 'a' : 'button';

    const el = document.createElement(tag);

    if (el instanceof HTMLAnchorElement) {
      el.href = href!;
      el.target = target || '_self';
    }

    if (el instanceof HTMLButtonElement) {
      el.type = 'button';
    }

    el.setAttribute('class', className);

    for (let attr in attrs) {
      el.setAttribute(attr, attrs[attr]);
    }

    for (let style in styles) {
      (el.style as any)[style] = styles[style];
    }

    if (dismiss) {
      el.setAttribute('data-bs-dismiss', 'modal');
    }

    if (typeof text === 'string') {
      el.textContent = text;
    } else if (typeof text === 'function') {
      text(el);
    }

    el.addEventListener('click', (e) => {
      onClick?.(value, e as MouseEvent);
      handler(value);
    });

    button = el;
  }

  return button;
}

