import {
  AlertAdapter,
  deleteConfirm,
  simpleAlert,
  simpleConfirm,
  simpleNotify,
  clearNotifies,
  promiseWithResolvers
} from '@lyrasoft/ts-toolkit/generic';
import type { Alpine as AlpineGlobal } from 'alpinejs';
import type { default as SpectrumGlobal } from 'spectrum-vanilla';
import type { SpectrumOptions } from 'spectrum-vanilla/dist/types/types';
import type { default as TomSelectGlobal } from 'tom-select';
import { useStack } from '../composable';
import { data, removeData } from '../data';
import type { Constructor, MaybePromise, Nullable, UIThemeInterface } from '../types';
import { animateTo } from './animate';
import { html, module, selectAll, selectOne } from './dom';
import { nextTick } from './helper';
import { useCssImport, useImport } from './loader';

let ui: UnicornUI;

AlertAdapter.alert = (title: string, text = '', type = 'info'): Promise<void> => {
  if (text) {
    title += ' | ' + text;
  }

  window.alert(title);

  return Promise.resolve();
};

AlertAdapter.confirm = (message: string, text = '', type = 'info'): Promise<boolean> => {
  message = message || 'Are you sure?';

  if (text) {
    message += ' | ' + text;
  }

  return new Promise((resolve) => {
    resolve(window.confirm(message));
  });
};

AlertAdapter.notify = async (title: string, text?: string, type: string = 'log'): Promise<() => any> => {
  if (text) {
    title += ' | ' + text;
  }

  return ui.theme?.renderMessage(title, type) ?? (() => null);
};

AlertAdapter.clearNotifies = async (): Promise<void> => {
  ui.theme?.clearMessages();
};

AlertAdapter.confirmText = () => 'OK';
AlertAdapter.cancelText = () => 'Cancel';
AlertAdapter.deleteText = () => 'Delete';

export { simpleAlert, simpleConfirm, deleteConfirm, simpleNotify, clearNotifies };

export interface AlertAdapterConfig {
  alert?: typeof AlertAdapter['alert'];
  confirm?: typeof AlertAdapter['confirm'];
  deleteConfirm?: typeof AlertAdapter['deleteConfirm'];
  confirmText?: typeof AlertAdapter['confirmText'];
  cancelText?: typeof AlertAdapter['cancelText'];
  deleteText?: typeof AlertAdapter['deleteText'];
  notify?: typeof AlertAdapter['notify'];
  clearNotifies?: typeof AlertAdapter['clearNotifies'];
}

export function useAlertAdapter(config?: AlertAdapterConfig): typeof AlertAdapter {
  if (config) {
    Object.assign(AlertAdapter, config);
  }

  return AlertAdapter;
}

export function useUI(instance?: UnicornUI): UnicornUI {
  if (instance) {
    ui = instance;
  }

  return ui ??= new UnicornUI();
}

export function useUITheme<T extends UIThemeInterface>(theme?: T | Constructor<T>): UIThemeInterface {
  const ui = useUI();

  if (ui.theme && !theme) {
    return ui.theme;
  }

  if (typeof theme === 'function') {
    theme = new theme();
  }

  ui.installTheme(theme);

  return ui.theme!;
}

export class UnicornUI {
  theme?: UIThemeInterface;

  static get defaultOptions() {
    return {
      messageSelector: '.message-wrap',
    };
  }

  installTheme(theme: any) {
    this.theme = theme;
  }

  // confirm(message: string): Promise<boolean> {
  //   message = message || 'Are you sure?';
  //
  //   return new Promise((resolve) => {
  //     resolve(window.confirm(message));
  //   });
  // }
  //
  // alert(title: string, text = '', type = 'info'): Promise<boolean> {
  //   if (text) {
  //     title += ' | ' + text;
  //   }
  //
  //   window.alert(title);
  //
  //   return Promise.resolve(true);
  // }
}

const prepares: AlpinePrepareCallback[] = [];
type AlpinePrepareCallback = (Alpine: AlpineGlobal) => MaybePromise<any>;
const { promise: alpineLoaded, resolve: alpineResolve } = promiseWithResolvers<AlpineGlobal>();

export async function loadAlpine(callback?: Nullable<AlpinePrepareCallback>): Promise<AlpineGlobal> {
  if (callback && !window.Alpine) {
    prepares.push(callback);
  }

  const { default: Alpine }: { default: AlpineGlobal } = await useImport('@alpinejs');

  if (!window.Alpine) {
    await Promise.all(prepares.map((callback) => Promise.resolve(callback(Alpine))));

    Alpine.start();

    window.Alpine = Alpine;

    alpineResolve(Alpine);
  } else if (callback) {
    await callback(Alpine);
  }

  return Alpine;
}

export async function initAlpineComponent(directive: string) {
  const Alpine = await alpineLoaded;

  await nextTick();

  selectAll<HTMLElement>(`[${directive}]`, (el) => {
    const code = el.getAttribute(directive) || '';
    el.removeAttribute(directive);

    // @see https://github.com/alpinejs/alpine/issues/359#issuecomment-973688464
    Alpine.mutateDom(() => {
      el.setAttribute('x-data', code);
    });

    Alpine.initTree(el);
  });
}

/**
 * Before Alpine init
 */
export async function prepareAlpine(callback: AlpinePrepareCallback) {
  if (window.Alpine) {
    await callback(window.Alpine);
  } else {
    prepares.push(callback);
  }
}

export async function prepareAlpineDefer(callback: AlpinePrepareCallback) {
  const Alpine = await alpineLoaded;

  await callback(window.Alpine);
}

/**
 * Render Messages.
 */
export function renderMessage(messages: string | string[], type: string = 'info') {
  return ui.theme?.renderMessage(messages, type);
}

/**
 * Clear messages.
 */
export function clearMessages() {
  ui.theme?.clearMessages();
}

export async function mark(selector?: string | HTMLElement, keyword: string = '', options: Record<string, any> = {}) {
  const modules = await useImport('@vendor/mark.js/dist/mark.min.js');

  if (selector != null) {
    const instance = new Mark(selector);
    instance.mark(keyword, options);
  }

  return modules;
}

export async function slideUp(target: string | HTMLElement, duration: number = 300): Promise<Animation | void> {
  const ele = selectOne(target);

  if (!ele) {
    return Promise.resolve();
  }

  ele.style.overflow = 'hidden';

  const animation = animateTo(
    ele,
    { height: 0, paddingTop: 0, paddingBottom: 0 },
    { duration, easing: 'ease-out' }
  );

  data(ele, 'animation.sliding.up', true);

  const r = await animation.finished;

  if (!data(ele, 'animation.sliding.down')) {
    ele.style.display = 'none';
  }

  removeData(ele, 'animation.sliding.up');

  return r;
}

export function slideDown(
  target: string | HTMLElement,
  duration: number = 300,
  display: string = 'block'): Promise<Animation | void> {
  const ele = selectOne(target);

  if (!ele) {
    return Promise.resolve();
  }

  data(ele, 'animation.sliding.down', true);

  ele.style.display = display;
  ele.style.overflow = 'hidden';

// Get height
  let maxHeight = 0;
  for (const child of Array.from(ele.children) as HTMLElement[]) {
    maxHeight = Math.max(child.offsetHeight, maxHeight);
  }

  const animation = animateTo(
    ele,
    {
      height: [
        0,
        maxHeight + 'px'
      ]
    },
    { duration, easing: 'ease-out' }
  );

  animation.addEventListener('finish', () => {
    ele.style.height = '';

    if (!data(ele, 'animation.sliding.up')) {
      ele.style.overflow = 'visible';
    }

    removeData(ele, 'animation.sliding.down');
  });

  return animation.finished;
}

/**
 * slideToggle
 */
export function slideToggle(
  target: string | HTMLElement,
  duration: number = 500,
  display: string = 'block'): Promise<Animation | void> {
  const ele = selectOne(target);

  if (!ele) {
    return Promise.resolve();
  }

  if (window.getComputedStyle(ele).display === 'none') {
    return slideDown(ele, duration, display);
  } else {
    return slideUp(ele, duration);
  }
}

export async function fadeOut(selector: string | HTMLElement, duration: number = 500): Promise<Animation | void> {
  const el = selectOne(selector);

  if (!el) {
    return;
  }

  const animation = animateTo(el, { opacity: 0 }, { duration, easing: 'ease-out' });

  const p = await animation.finished;
  el.style.display = 'none';

  return p;
};

export async function fadeIn(
  selector: string | HTMLElement,
  duration: number = 500,
  display: string = 'block'
): Promise<Animation | void> {
  const el = selectOne(selector);

  if (!el) {
    return;
  }

  el.style.display = '';

  if (window.getComputedStyle(el).display !== display) {
    el.style.display = display;
  }

  const animation = animateTo(el, { opacity: 1 }, { duration, easing: 'ease-out' });

  return animation.finished;
};

export async function highlight(
  selector: string | HTMLElement,
  color: string = '#ffff99',
  duration: number = 600
): Promise<Animation | void> {
  const ele = selectOne(selector);

  if (!ele) {
    return;
  }

  duration /= 2;
  const bg = window.getComputedStyle(ele).backgroundColor;

  const animation = animateTo(ele, { backgroundColor: color }, { duration });

  await animation.finished;

  return animateTo(ele, { backgroundColor: bg }, { duration });
}

/**
 * Color Picker.
 */
export async function useColorPicker(
  selector?: Nullable<string | HTMLElement | NodeListOf<HTMLElement>>,
  options: Partial<SpectrumOptions> = {}
): Promise<any> {
  if (options?.theme === 'dark') {
    useCssImport('@spectrum/spectrum-dark.min.css');
  } else if (!options?.theme) {
    useCssImport('@spectrum/spectrum.min.css');
  }

  const m = await useImport('@spectrum');

  // Locale
  if (typeof options.locale === 'string') {
    let ls: any = options.locale.split('-').map((l) => l.toLowerCase());

    if (ls[0] === ls[1]) {
      ls = [ls];
    }

    ls = ls.join('-');
    try {
      await useImport(`@spectrum/i18n/${ls}.js`);
    } catch (e) {
      console.warn(`Unable to load Spectrum locale "${ls}" (${options.locale})`);
    }
  }

  if (selector) {
    return module<any, HTMLElement>(selector, 'spectrum', (ele) => Spectrum.getInstance(ele, options));
  }

  return m;
}

export function useDisableOnSubmit(
  formSelector: string | HTMLFormElement = '#admin-form',
  buttonSelector: string = '',
  options: Record<string, any> = {}
) {
  // Todo: Use object to handle it
  buttonSelector = buttonSelector || [
    '#admin-toolbar button',
    '#admin-toolbar a',
    formSelector + ' .disable-on-submit',
    formSelector + ' .js-dos',
    formSelector + ' [data-dos]',
  ].join(',');

  const iconSelector = options.iconSelector || [
    '[class*="fa-"]',
    '[data-spin]',
    '[data-spinner]',
  ].join(',');

  const event = options.event || 'submit';
  const spinnerClass = options.spinnerClass || 'spinner-border spinner-border-sm';
  const loadingClass = options.loadingCass || 'is-loading';

  selectAll<HTMLElement>(buttonSelector, (button) => {
    button.addEventListener('click', (e) => {
      button.dataset.clicked = '1';

      setTimeout(() => {
        delete button.dataset.clicked;
      }, 1500);
    });
  });

  const form = selectOne<HTMLFormElement>(formSelector);
  form?.addEventListener(event, (e: SubmitEvent) => {
    setTimeout(() => {
      if (!form.checkValidity()) {
        return;
      }

      selectAll<HTMLElement>(buttonSelector, (button) => {
        button.style.pointerEvents = 'none';
        button.setAttribute('disabled', 'disabled');
        button.classList.add('disabled');

        if (button.dataset.clicked) {
          let icon = button.querySelector(iconSelector);
          button.classList.add(loadingClass);

          if (icon) {
            const i = html('<i></i>');
            icon.parentNode.replaceChild(i, icon);

            i.setAttribute('class', spinnerClass);
            // icon.styles.width = '1em';
            // icon.styles.height = '1em';
            // icon.styles.borderWith = '.15em';
          }
        }
      });
    }, 0);
  });
}

export function useDisableIfStackNotEmpty(buttonSelector: string = '[data-task=save]',
                                          stackName: string = 'uploading') {
  const stack = useStack(stackName);

  stack.observe((stack, length) => {
    for (const button of selectAll<HTMLElement>(buttonSelector)) {
      if (length > 0) {
        button.setAttribute('disabled', 'disabled');
        button.classList.add('disabled');
      } else {
        button.removeAttribute('disabled');
        button.classList.remove('disabled');
      }
    }
  });
}

/**
 * Keep alive.
 */
export function useKeepAlive(url: string, time: number = 60000): () => void {
  const aliveHandle = window.setInterval(() => fetch(url), time);

  return () => {
    clearInterval(aliveHandle);
  };
}

/**
 * Vue component field.
 */
export async function useVueComponentField(
  selector?: Nullable<string | HTMLElement>,
  value?: any,
  options: Record<string, any> = {}
): Promise<any> {
  const m = await useImport('@unicorn/field/vue-component-field.js');

  if (selector) {
    m.VueComponentField.init(selector, value, options);
  }

  return m;
}

declare global {
  var Alpine: AlpineGlobal;
  var TomSelect: typeof TomSelectGlobal;
  var Spectrum: typeof SpectrumGlobal;
  var Mark: any;
}
