
import { difference, each } from 'lodash-es';

class ShowOn {
  el = null;
  input = null;
  conditions = {};
  targets = {};
  readonly = false;
  initialDisplay = null;

  constructor(el, conditions) {
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
      const target = u.selectOne(selector);

      if (this.input) {
        this.readonly = this.input.hasAttribute('readonly');
      }

      let listenTarget;

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

  updateShowState(target, value, duration = 300) {
    const matched = this.isValueMatched(target, value);

    if (matched) {
      u.$ui.fadeIn(this.el, duration, this.initialDisplay);
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

  isValueMatched(target, value) {
    let targetValue = null;

    const type = this.nodeType(target);

    switch (type) {
      case 'input':
      case 'textarea':
        targetValue = target.value;
        break;
      case 'select':
        if (!target.multiple) {
          targetValue = target.value;
        } else {
          targetValue = u.selectAll(target.querySelectorAll('option'))
            .filter(option => option.selected)
            .map(option => option.value);
        }
        break;

      case 'checkbox':
        targetValue = target.checked ? target.value : null;
        break;

      case 'radio':
        targetValue = target.querySelector('input[type=radio]:checked')?.value;
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
  nodeType(el) {
    var node = el.nodeName.toLowerCase();
    var type = el.type;

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
    u.module(el, 'show.on', (el) => {
      return new ShowOn(el, JSON.parse(value));
    });
  }
});
