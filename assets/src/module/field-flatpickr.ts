import { useCssImport, useImport, injectCssToDocument } from '../service';
import flatpickr from 'flatpickr';
import css from 'flatpickr/dist/flatpickr.css?inline';

injectCssToDocument(css);

class FlatpickrElement extends HTMLElement {
  static get is() {
    return 'uni-flatpickr';
  }

  instance!: flatpickr.Instance;

  constructor() {
    super();
  }

  get selector() {
    return this.getAttribute('selector') || 'input';
  }

  get locale() {
    return this.getAttribute('locale') || '';
  }

  // todo: Currently not support single option attributes
  getOptions() {
    const options: any = {};
    const ignore = [
      'selector'
    ];

    this.getAttributeNames().forEach((name) => {
      if (ignore.indexOf(name) !== -1) {
        return;
      }

      options[name] = this.getAttribute(name);
    });

    return options;
  }

  get $input(): HTMLInputElement {
    return this.querySelector<HTMLInputElement>('input')!;
  }

  async connectedCallback() {
    let options: flatpickr.Options.Options = JSON.parse(this.getAttribute('options') || '{}') || {};

    options.autoFillDefaultTime = true;
    const now = new Date();
    options.defaultHour = now.getHours();
    options.defaultMinute = now.getMinutes();
    options.defaultSeconds = now.getSeconds();

    options = await this.handleOptions(options);

    this.instance = flatpickr(
      this.querySelector<HTMLElement>(this.selector)!,
      options
    );

    // If no value, set default time on open
    this.instance.config.onOpen.push(() => {
      if (this.instance.input.value === '') {
        const now = new Date();
        this.instance.jumpToDate(now);
        this.instance.config.defaultHour = now.getHours();
        this.instance.config.defaultMinute = now.getMinutes();
        this.instance.config.defaultSeconds = now.getSeconds();
      }
    });

    this.querySelector('[data-toggle]')?.addEventListener('click', () => {
      setTimeout(() => {
        this.querySelector<HTMLInputElement>('[data-input]')?.focus();
      }, 0);
    });
  }

  async handleOptions(options: flatpickr.Options.Options): Promise<flatpickr.Options.Options> {
    options.plugins = options.plugins || [];

    await Promise.all([
      this.handleLocale(options),
      this.handleMonthSelect(options)
    ]);

    return options;
  }

  private async handleLocale(options: Record<string, any>) {
    if (this.locale) {
      await useImport(`flatpickr/dist/l10n/${this.locale}.js`);

      options.locale = this.locale.replace(/-/, '_');
    }

    return options;
  }

  private async handleMonthSelect(options: Record<string, any>) {
    if (options.monthSelect) {
      useCssImport('flatpickr/dist/plugins/monthSelect/style.css');
      const { default: monthSelect } = await import('flatpickr/dist/plugins/monthSelect');

      if (typeof options.monthSelect === 'boolean') {
        options.monthSelect = {
          shorthand: true,
          dateFormat: 'Y-m',
          altFormat: 'Y-m'
        };
      }

      options.plugins.push(monthSelect(options.monthSelect));
    }

    return options;
  }

  getInstance() {
    return this.instance;
  }
}

customElements.define(FlatpickrElement.is, FlatpickrElement);
