
import { useUniDirective } from '../composable';
import { fadeIn, fadeOut, selectAll, selectOne, module } from '../modules';
import { difference } from 'lodash-es';

type HTMLInputTypes = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
type Conditions = Record<string, any>;

class ShowOn {
  el = null;
  input = null;
  conditions: Conditions = {};
  targets = {};
  readonly = false;
  initialDisplay = null;

  constructor(el: HTMLElement, conditions: Conditions) {
    this.el = el;
    this.input = this.el.querySelector(
      this.el.dataset.inputSelector || '[data-field-input]'
    );
    this.conditions = conditions;

    this.init();
  }

  init() {
    this.initialDisplay = window.getComputedStyle(this.el).display || 'block';

    for (const selector in this.conditions) {
      const value = this.conditions[selector];

      const target = selectOne<HTMLElement>(selector);

      if (this.input) {
        this.readonly = this.input.hasAttribute('readonly');
      }

      let listenTarget: HTMLInputTypes[];

      if (target.nodeName === 'DIV') {
        listenTarget = Array.from(target.querySelectorAll<HTMLInputTypes>('input, select, textarea'));
      } else {
        listenTarget = [target as HTMLInputTypes];
      }

      selectAll(listenTarget, (ele) => {
        ele.addEventListener('change', () => {
          this.updateShowState(target, value);
        });
      });

      this.updateShowState(target, value, 1);
    }
  }

  updateShowState(target: HTMLElement, value: any, duration = 300) {
    const matched = this.isValueMatched(target, value);

    if (matched) {
      setTimeout(() => {
        fadeIn(this.el, duration, this.initialDisplay);
      }, duration + 30);
    } else {
      fadeOut(this.el, duration);
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
    let targetValue: any = null;

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
          targetValue = selectAll(target.querySelectorAll('option'))
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

    if (targetValue && Array.isArray(targetValue)) {
      return targetValue.indexOf(value) !== -1;
    }

    return value == targetValue;
  }

  /**
   * @see https://github.com/nickjackson/val/blob/master/index.js#L55
   * @param el
   * @returns {string}
   */
  nodeType(el: HTMLElement): "select" | "textarea" | "checkbox" | "input" | "radio" {
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

export const ready = useUniDirective('show-on', {
  mounted(el, { value }) {
    module<HTMLElement, HTMLElement>(el, 'show.on', (el) => {
      return new ShowOn(el, JSON.parse(value));
    });
  }
});
