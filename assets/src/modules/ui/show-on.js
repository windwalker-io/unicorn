/**
 * Part of earth project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

import { difference, each } from 'lodash-es';

class ShowOn {
  el = null;
  conditions = {};
  targets = {};

  constructor(el, conditions) {
    this.el = el;
    this.conditions = conditions;

    this.init();
  }

  init() {
    each(this.conditions, (value, selector) => {
      const target = u.selectOne(selector);

      target.addEventListener('change', () => {
        this.updateShowState(target, value);
      });

      this.updateShowState(target, value, 1);
    });
  }

  updateShowState(target, value, duration = 300) {
    const matched = this.isValueMatched(target, value);

    if (matched) {
      u.$ui.fadeOut(this.el, duration);
    } else {
      u.$ui.fadeIn(this.el, duration);
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
          targetValue = u.selectAll(target.querySelectorAll('option:checked'))
            .filter(option => option.checked)
            .map(option => option.value);
        }
        break;

      case 'checkbox':
        targetValue = target.cecked ? target.value : null;
        break;
    }

    if (Array.isArray(value)) {
      if (Array.isArray(targetValue)) {
        return difference(value, targetValue).lenth === 0;
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
    }
    return;
  }
}

u.directive('show-on', {
  mounted(el, { value }) {
    u.getBoundedInstance(el, 'show.on', (el) => {
      return new ShowOn(el, JSON.parse(value));
    });
  }
});
