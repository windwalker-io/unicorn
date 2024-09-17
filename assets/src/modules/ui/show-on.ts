
import { difference, each } from 'lodash-es';

class ShowOn {
  el = null;
  input = null;
  conditions = {};
  targets = {};
  readonly = false;
  initialDisplay = null;

  constructor(el: HTMLElement, conditions: any) {
    this.el = el;
    this.input = this.el.querySelector(
      this.el.dataset.inputSelector || '[data-field-input]'
    );
    this.conditions = conditions;

    this.init();
  }

  init() {
    this.initialDisplay = window.getComputedStyle(this.el).display || 'block';

    each(this.conditions, (value, selector) => {
      const target = u.selectOne<HTMLElement>(selector);

      if (this.input) {
        this.readonly = this.input.hasAttribute('readonly');
      }

      let listenTarget: any;

      if (target.nodeName === 'DIV') {
        listenTarget = target.querySelectorAll('input, select, textarea');
      } else {
        listenTarget = [target];
      }

      u.selectAll(listenTarget, (ele) => {
        ele.addEventListener('change', () => {
          this.updateShowState(target, value);
        });
      });

      this.updateShowState(target, value, 1);
    });
  }

  updateShowState(target: HTMLElement, value: any, duration = 300) {
    const matched = this.isValueMatched(target, value);

    if (matched) {
      setTimeout(() => {
        u.$ui.fadeIn(this.el, duration, this.initialDisplay);
      }, duration + 30);
    } else {
      u.$ui.fadeOut(this.el, duration);
    }

    if (this.input) {
      if (matched) {
        this.input.removeAttribute('readonly');
      } else {
        this.input.setAttribute('readonly', 'readonly');
      }
    }
  }

  isValueMatched(target: HTMLElement, value: any) {
    let targetValue = null;

    const type = this.nodeType(target);

    switch (type) {
      case 'input':
      case 'textarea':
        targetValue = (target as HTMLInputElement).value;
        break;
      case 'select':
        if (!(target as HTMLSelectElement).multiple) {
          targetValue = (target as HTMLSelectElement).value;
        } else {
          targetValue = u.selectAll(target.querySelectorAll('option'))
            .filter(option => option.selected)
            .map(option => option.value);
        }
        break;

      case 'checkbox':
        targetValue = (target as HTMLInputElement).checked ? (target as HTMLInputElement).value : null;
        break;

      case 'radio':
        targetValue = target.querySelector<HTMLInputElement>('input[type=radio]:checked')?.value;
        break;
    }

    if (Array.isArray(value)) {
      if (Array.isArray(targetValue)) {
        return difference(value, targetValue).length === 0;
      }

      return value.indexOf(targetValue) !== -1;
    }

    if (Array.isArray(targetValue)) {
      return targetValue.indexOf(value) !== -1;
    }

    return value == targetValue;
  }

  /**
   * @see https://github.com/nickjackson/val/blob/master/index.js#L55
   * @param el
   * @returns {string}
   */
  nodeType(el: HTMLElement) {
    var node = el.nodeName.toLowerCase();
    var type = (el as HTMLInputElement).type;

    if (node === 'select') {
      return 'select';
    }

    if (node === 'textarea') {
      return 'textarea';
    }

    if (node === 'input') {
      if (type === 'checkbox') {
        return 'checkbox';
      }

      return 'input';
    }

    if (node === 'div') {
      if (el.querySelector('input[type=radio]')) {
        return 'radio';
      }
    }

    return;
  }
}

u.directive('show-on', {
  mounted(el, { value }) {
    u.module<HTMLElement, HTMLElement>(el, 'show.on', (el) => {
      return new ShowOn(el, JSON.parse(value));
    });
  }
});
