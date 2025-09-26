import { useUniDirective } from '../composable';
import { module, selectAll, selectOne, sleep } from '../service';
import { Tab } from 'bootstrap';
import { mergeDeep } from '../utilities';

export interface KeepTabOptions {
  uid?: string;
  delay?: number;
  tabItemSelector?: string;
}

const defaultOptions = {
  tabItemSelector: '[data-toggle=tab],[data-bs-toggle=tab],[data-toggle=pill],[data-bs-toggle=pill]',
  delay: 0,
};

export class KeepTab {
  $element: HTMLElement;
  tabButtons: NodeListOf<HTMLElement>;
  storageKey: string = '';
  options: any;

  constructor(selector: HTMLElement | string, options: KeepTabOptions = {}) {
    options = mergeDeep({}, defaultOptions, options);
    let uid: string;

    if (typeof selector === 'object') {
      uid = options.uid || selector.id;
    } else {
      uid = selector;
    }

    const $element = this.$element = selectOne<HTMLElement>(selector)!;

    if (!$element) {
      console.warn(`[KeepTab] Element ${selector} not found.`);
      return;
    }

    this.$element = $element;
    this.tabButtons = $element.querySelectorAll(this.options.tabItemSelector);

    this.options = options;

    this.init(uid);
  }

  protected async init(uid: string) {
    this.storageKey = 'tab-href-' + await this.hashCode(location.href + ':' + uid);

    this.bindEvents();

    await sleep(this.options.delay || 0);

    this.switchTab();
  }

  bindEvents() {
    [].forEach.call(this.tabButtons, (button: HTMLAnchorElement) => {
      button.addEventListener('click', () => {
        // Store the selected tab href in localstorage
        window.localStorage.setItem(this.storageKey, this.getButtonHref(button));
      });
    });
  }

  getButtonHref(button: HTMLAnchorElement) {
    return button.dataset.bsTarget || button.dataset.target || button.href;
  }

  findTabButtonByHref(href: string) {
    return selectAll<HTMLAnchorElement>(this.options.tabItemSelector)
      .filter((button: HTMLAnchorElement) => {
        if (button.href === href) {
          return true;
        }

        if (button.dataset.bsTarget === href) {
          return true;
        }

        return button.dataset.target === href;
      })
      .shift();
  }

  activateTab(href: string) {
    const tabTrigger = this.findTabButtonByHref(href);

    if (tabTrigger) {
      Tab.getOrCreateInstance(tabTrigger).show();
    }
  }

  hasTab(href: string) {
    return this.findTabButtonByHref(href) != null;
  }

  /**
   * Switch tab.
   *
   * @returns {boolean}
   */
  switchTab() {
    if (localStorage.getItem(this.storageKey)) {
      // When moving from tab area to a different view
      if (!this.hasTab(localStorage.getItem(this.storageKey) || '')) {
        localStorage.removeItem(this.storageKey);
        return true;
      }

      // Clean default tabs
      // selectOne(this.$element, '[data-toggle="tab"], [data-bs-toggle=tab]')
      // this.$element.querySelector('a[data-toggle="tab"]').parent().removeClass('active');

      const tabhref = localStorage.getItem(this.storageKey) || '';

      // Add active attribute for selected tab indicated by url
      this.activateTab(tabhref);

      // Check whether internal tab is selected (in format <tabname>-<id>)
      // const seperatorIndex = tabhref.indexOf('-');
      //
      // if (seperatorIndex !== -1) {
      //   const singular = tabhref.substring(0, seperatorIndex);
      //   const plural = singular + 's';
      //
      //   this.activateTab(plural);
      // }
    }
  }

  /**
   * Hash code.
   */
  async hashCode(text: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(text);
    const hashBuffer = await globalThis.crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  }
}

export const ready = useUniDirective('keeptab', {
  mounted(el, { value }) {
    const options: KeepTabOptions = JSON.parse(value || '{}');

    module(el, 'uni.keeptab', () => new KeepTab(el, options));
  }
});

export interface KeepTabModule {
  KeepTab: typeof KeepTab;
  ready: typeof ready;
}
