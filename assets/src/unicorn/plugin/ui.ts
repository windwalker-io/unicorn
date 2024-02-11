import '../types';
import type { Unicorn } from '../../index';
import { defaultsDeep } from 'lodash-es';
import type { SpectrumOptions } from 'spectrum-vanilla/dist/types/types';

export default class UnicornUI {
  theme?: any;
  aliveHandle?: any;

  static get is() {
    return 'ui';
  }

  static install(app: Unicorn) {
    const ui = app.$ui = new this(app);
    app.addMessage = ui.renderMessage.bind(ui);
    app.clearMessages = ui.clearMessages.bind(ui);
    app.notify = ui.notify.bind(ui);
    app.clearNotifies = ui.clearNotifies.bind(ui);

    app.loadAlpine = ui.loadAlpine.bind(ui);
    app.initAlpine = ui.initAlpine.bind(ui);
    app.beforeAlpineInit = ui.prepareAlpine.bind(ui);
    app.prepareAlpine = ui.prepareAlpine.bind(ui);
    app.webComponentPolyfill = ui.webComponentPolyfill.bind(ui);
    app.defineCustomElement = ui.defineCustomElement.bind(ui);
  }

  static get defaultOptions() {
    return {
      messageSelector: '.message-wrap',
    };
  }

  installTheme(theme: any) {
    this.theme = theme;
  }

  /**
   * @param {Unicorn} app
   */
  constructor(protected app: Unicorn) {
    //
  }

  async loadAlpine(callback?: Nullable<() => void>) {
    // For V3
    if (callback) {
      this.prepareAlpine(callback);
    }

    let m = await this.app.import('@alpinejs');

    if (Alpine.version.startsWith('2.')) {
      await this.app.$alpine2.loadSpruce();
      Alpine.store = Spruce.store.bind(Spruce);

      if (callback) {
        callback();
      }

      await this.app.$alpine2.startAlpine();
      return m;
    }

    return m;
  }

  async initAlpine(directive: string) {
    await this.app.loadAlpine();

    u.selectAll<HTMLElement>(`[${directive}]`, (el) => {
      const code = el.getAttribute(directive) || '';
      el.removeAttribute(directive);

      el.setAttribute('x-data', code);

      Alpine.initTree(el);
    });
  }

  /**
   * Before Alpine init
   */
  prepareAlpine(callback: () => void) {
    if (window.Alpine) {
      callback();
    } else {
      document.addEventListener('alpine:init', callback);
    }
  }

  /**
   * Render Messages.
   */
  renderMessage(messages: string | string[], type: string = 'info') {
    this.theme.renderMessage(messages, type);
  }

  /**
   * Clear messages.
   */
  clearMessages() {
    this.theme.clearMessages();
  }

  /**
   * Show notify.
   */
  notify(messages: string | string[], type: string = 'info') {
    this.theme.renderMessage(messages, type);
  }

  /**
   * Clear notifies.
   */
  clearNotifies() {
    this.theme.clearMessages();
  }

  /**
   * webComponentPolyfill
   */
  async webComponentPolyfill() {
    return new Promise((resolve) => {
      this.app.import('@vendor/@webcomponents/webcomponentsjs/webcomponents-loader.js')
        .then((m) => {
          if (window?.WebComponents?.ready === true) {
            resolve(m);
          } else {
            window.addEventListener('WebComponentsReady', function () {
              resolve(m);
            });
          }
        });
    });
  }

  async defineCustomElement(is: string, constructor: CustomElementConstructor, options?: ElementDefinitionOptions) {
    const m = await this.app.import('@vendor/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js');

    customElements.define(is, constructor, options);
    return m;
  }

  /**
   * Highlight mark some keywords.
   *
   * @param selector
   * @param keyword
   * @param options
   * @returns Promise<any>
   */
  mark(selector?: string | HTMLElement, keyword: string = '', options: Record<string, any> = {}) {
    return this.app.import('@vendor/mark.js/dist/mark.min.js')
      .catch((e) => {
        console.error('Package "mark.js" not found.', e);
      })
      .then((m) => {
        if (selector != null) {
          const instance = new Mark(selector);
          instance.mark(keyword, options);
        }
        return m;
      });
  }

  /**
   * @see https://tom-select.js.org/
   */
  tomSelect(
    selector?: Nullable<string | HTMLSelectElement | NodeListOf<HTMLSelectElement>>,
    options: Record<string, any> = {},
    theme: string = 'bootstrap5'
  ) {
    return this.app.import(
      this.app.minFileName('@vendor/tom-select/dist/js/tom-select.complete.js'),
      this.app.importCSS(
        this.app.minFileName(`@vendor/tom-select/dist/css/tom-select.${theme}.css`)
      )
    )
      .then((m) => {
        if (selector) {
          this.app.module<any, HTMLSelectElement>(
            selector,
            'tom.select',
            (ele) => {
              options = defaultsDeep(options, {
                allowEmptyOption: true,
                maxOptions: null,
                plugins: {
                  caret_position: {},
                  clear_button: {},
                }
              });

              if ((ele as HTMLSelectElement).multiple) {
                options.plugins.remove_button = {};
              } else {
                options.plugins.dropdown_input = {};
              }

              // Auto select first if options changed.
              // @see https://github.com/orchidjs/tom-select/issues/362
              class UnicornTomSelect extends TomSelect {
                syncOptionsWithoutKeepSelected() {
                  const oldValue = ele.value;

                  this.clear();
                  this.clearOptions();
                  this.sync();

                  if (ele.value !== oldValue) {
                    this.setValue(
                      ele.querySelector<HTMLOptionElement>(`option[value="${oldValue}"]`)?.value
                      ?? ele.querySelector<HTMLOptionElement>('option')?.value
                      ?? '',
                      true
                    );
                  }
                }
              }

              const t = new UnicornTomSelect(ele, options);

              ele.addEventListener('list:updated', () => {
                t.syncOptionsWithoutKeepSelected();
              });

              return t;
            }
          );
        }

        return m;
      });
  }

  /**
   * Choices.js
   *
   * @deprecated Use TomSelect() instead.
   */
  choices(selector: Nullable<string | HTMLElement>, options: Record<string, any> = {}) {
    return this.app.import(
      '@vendor/choices.js/public/assets/scripts/choices.min.js',
      this.app.importCSS('@vendor/choices.js/public/assets/styles/choices.min.css')
    )
      .catch((e) => {
        console.error('Package "choices.js" not found.', e);
      })
      .then((m) => m[0])
      .then((m) => {
        if (selector) {
          options = defaultsDeep(options, {
            shouldSort: false,
            removeItemButton: true,
            renderSelectedChoices: 'always',
          });

          new Choices(selector, options);
        }

        return m;
      });
  }

  /**
   * Flatpickr
   */
  flatpickr(): Promise<any> {
    return this.app.import('@unicorn/ui/flatpickr-components.js');
  }

  async listDependent(
    element?: Nullable<string | HTMLElement>,
    dependent?: Nullable<string | HTMLElement>,
    options: Record<string, any> = {}
  ): Promise<any> {
    const module = await this.app.import('@unicorn/ui/list-dependent.js');

    if (element) {
      module.ListDependent.handle(element, dependent, options);
    }

    return module;
  }

  /**
   * Cascade Select
   */
  cascadeSelect(): Promise<any> {
    return this.app.import('@unicorn/field/cascade-select.js');
  }

  /**
   * Single Drag Image
   */
  sid(): Promise<any> {
    return this.app.import('@unicorn/field/single-image-drag.js');
  }

  /**
   * File Drag
   */
  fileDrag(): Promise<any> {
    return this.app.import('@unicorn/field/file-drag.js');
  }

  /**
   * Iframe Modal
   */
  iframeModal(): Promise<any> {
    return this.app.import('@unicorn/ui/iframe-modal.js');
  }

  /**
   * Modal Field
   */
  modalField(): Promise<any> {
    return this.app.import('@unicorn/field/modal-field.js');
  }

  /**
   * Multiple Uploader
   */
  multiUploader(): Promise<any> {
    return this.app.import('@unicorn/field/multi-uploader.js');
  }

  /**
   * Repeatable
   */
  repeatable(): Promise<any> {
    return this.app.import('@unicorn/field/repeatable.js');
  }

  modalTree(): Promise<any> {
    return this.app.import('@unicorn/field/modal-tree.js');
  }

  /**
   * S3 Uploader.
   */
  async s3Uploader(name?: Nullable<string>): Promise<any> {
    const module = await u.import('@unicorn/aws/s3-uploader.js');

    if (name) {
      return S3Uploader.get(name);
    }

    return module;
  }

  async slideUp(target: string | HTMLElement, duration: number = 300): Promise<Animation | void> {
    const ele = this.app.selectOne(target);

    if (!ele) {
      return Promise.resolve();
    }

    ele.style.overflow = 'hidden';

    const animation = u.animate(
      ele,
      { height: 0, paddingTop: 0, paddingBottom: 0 },
      { duration, easing: 'ease-out' }
    );

    const r = await animation.finished;

    ele.style.display = 'none';

    return r;
  }

  slideDown(target: string | HTMLElement,
            duration: number = 300,
            display: string = 'block'): Promise<Animation | void> {
    const ele = this.app.selectOne(target);

    if (!ele) {
      return Promise.resolve();
    }

    ele.style.display = display;

    // Get height
    let maxHeight = 0;
    for (const child of Array.from(ele.children) as HTMLElement[]) {
      maxHeight = Math.max(child.offsetHeight, maxHeight);
    }

    const animation = u.animate(
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
      ele.style.overflow = 'visible';
    });

    return animation.finished;
  }

  /**
   * slideToggle
   */
  slideToggle(target: string | HTMLElement,
              duration: number = 500,
              display: string = 'block'): Promise<Animation | void> {
    const ele = this.app.selectOne(target);

    if (!ele) {
      return Promise.resolve();
    }

    if (window.getComputedStyle(ele).display === 'none') {
      return this.slideDown(ele, duration, display);
    } else {
      return this.slideUp(ele, duration);
    }
  }

  async fadeOut(selector: string | HTMLElement, duration: number = 500): Promise<Animation | void> {
    const el = this.app.selectOne(selector);

    if (!el) {
      return;
    }

    const animation = u.animate(el, { opacity: 0 }, { duration, easing: 'ease-out' });

    const p = await animation.finished;
    el.style.display = 'none';

    return p;
  };

  async fadeIn(selector: string | HTMLElement,
               duration: number = 500,
               display: string = 'block'): Promise<Animation | void> {
    const el = this.app.selectOne(selector);

    if (!el) {
      return;
    }

    el.style.display = '';

    if (window.getComputedStyle(el).display !== display) {
      el.style.display = display;
    }

    const animation = u.animate(el, { opacity: 1 }, { duration, easing: 'ease-out' });

    return animation.finished;
  };

  async highlight(selector: string | HTMLElement,
                  color: string = '#ffff99',
                  duration: number = 600): Promise<Animation | void> {
    const ele = this.app.selectOne(selector);

    if (!ele) {
      return;
    }

    duration /= 2;
    const bg = window.getComputedStyle(ele).backgroundColor;

    const animation = this.app.animate(ele, { backgroundColor: color }, { duration });

    await animation.finished;

    return this.app.animate(ele, { backgroundColor: bg }, { duration });
  }

  /**
   * Color Picker.
   */
  async colorPicker(
    selector?: Nullable<string | HTMLElement | NodeListOf<HTMLElement>>,
    options: Partial<SpectrumOptions> = {}
  ): Promise<any> {
    if (options?.theme === 'dark') {
      this.app.importCSS('@spectrum/spectrum-dark.min.css');
    } else if (!options?.theme) {
      this.app.importCSS('@spectrum/spectrum.min.css');
    }

    const m = await this.app.import('@spectrum');

    // Locale
    if (typeof options.locale === 'string') {
      let ls: any = options.locale.split('-').map((l) => l.toLocaleString());

      if (ls[0] === ls[1]) {
        ls = [ls];
      }

      ls = ls.join('-');
      await this.app.import(`@spectrum/i18n/${ls}.js`);
    }

    if (selector) {
      u.module(selector, 'spectrum', (ele) => Spectrum.getInstance(ele, options));
    }

    return m;
  }

  disableOnSubmit(
    formSelector: string | HTMLFormElement = '#admin-form',
    buttonSelector: string = '',
    options: Record<string, any> = {}
  ) {
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

    this.app.selectAll<HTMLElement>(buttonSelector, (button) => {
      button.addEventListener('click', (e) => {
        button.dataset.clicked = '1';

        setTimeout(() => {
          delete button.dataset.clicked;
        }, 1500);
      });
    });

    const form = this.app.selectOne<HTMLFormElement>(formSelector);
    form?.addEventListener(event, (e) => {
      setTimeout(() => {
        if (!form.checkValidity()) {
          return;
        }

        this.app.selectAll<HTMLElement>(buttonSelector, (button) => {
          button.style.pointerEvents = 'none';
          button.setAttribute('disabled', 'disabled');
          button.classList.add('disabled');

          if (button.dataset.clicked) {
            let icon = button.querySelector(iconSelector);

            if (icon) {
              const i = u.html('<i></i>');
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

  disableIfStackNotEmpty(buttonSelector: string = '[data-task=save]', stackName: string = 'uploading') {
    const stack = u.stack(stackName);

    stack.observe((stack, length) => {
      for (const button of u.selectAll<HTMLElement>(buttonSelector)) {
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

  async checkboxesMultiSelect(selector?: Nullable<string | HTMLElement>, options: Record<string, any> = {}): Promise<any> {
    const m = await this.app.import('@unicorn/ui/checkboxes-multi-select.js');

    if (selector) {
      m.CheckboxesMultiSelect.handle(selector, options);
    }

    return m;
  }

  /**
   * Keep alive.
   */
  keepAlive(url: string, time: number = 60000): () => void {
    const aliveHandle = window.setInterval(() => fetch(url), time);

    return () => {
      clearInterval(aliveHandle);
    };
  }

  /**
   * Init Form Show On
   */
  initShowOn(): Promise<any> {
    return u.import('@unicorn/ui/show-on.js');
  }

  /**
   * Vue component field.
   */
  async vueComponentField(
    selector?: Nullable<string | HTMLElement>,
    value?: any,
    options: Record<string, any> = {}
  ): Promise<any> {
    const m = await u.import('@unicorn/field/vue-component-field.js');

    if (selector) {
      m.VueComponentField.init(selector, value, options);
    }

    return m;
  }
}
