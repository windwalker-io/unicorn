/**
 * Part of datavideo project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

import { defaultsDeep } from 'lodash-es';

u.loadAlpine(() => {
  Alpine.data('CascadeSelect', (options) => ({
    options: {
      id: 'cascade-select-' + u.uid(),
      selected: '',
      path: [],
      ignoreSelf: null,
      placeholder: '- Select -',
      ajaxUrl: '',
      ajaxValueField: 'value',
      labels: [],
      labelWidth: 'col-md-3',
      fieldWidth: 'col',
      readonly: false,
      disabled: false,
      valueField: 'id',
      textField: 'title',
      horizontal: null,
      horizontalColWidth: null,
    },
    canModify: true,
    lists: [],
    ajaxUrl: '',
    values: [],

    init() {
      this.options = defaultsDeep( options, this.options );

      this.canModify = !this.options.readonly && !this.options.disabled;
      this.ajaxUrl = this.options.ajaxUrl;
      this.values = this.options.path.slice();

      let values = this.options.path.slice();

      if (values.length === 0) {
        values = [1];
      } else {
        values.unshift(1);
      }

      let promise = Promise.resolve();

      values.forEach((v) => {
        promise = promise.then(() => {
          return this.loadItems(v).then((res) => {
            if (res.data.data.length > 0) {
              this.lists.push(res.data.data);
            }
          });
        });
      });
    },

    getLabel(i) {
      return this.options.labels[i] || `Level ${i + 1}`;
    },

    getId(i) {
      return `${this.options.id}__level-${i}`
    },

    getListValue(i) {
      return this.values[i] || '';
    },
    
    isSelected(i, item) {
      return this.getListValue(i) == item[this.options.valueField];
    },

    getFinalValue() {
      const values = this.values.slice();
      return values.filter(v => v != null).pop();
    },

    onChange(i, event) {
      const el = event.target;

      this.values[i] = el.value;

      if (el.value === '') {
        // Clear child
        this.lists.splice(i + 1);
        this.values.splice(i + 1);
        return;
      }

      // Get child list
      this.loadItems(el.value)
        .then((res) => {

          // Clear child
          this.lists.splice(i + 1);
          this.values.splice(i + 1);

          if (res.data.data.length > 0) {
            this.lists.push(res.data.data);
          }
        });
    },

    loadItems(parentId) {
      return u.$http.get(
        this.ajaxUrl,
        {
          params: {
            [this.options.ajaxValueField]: parentId,
            self: this.options.ignoreSelf || null
          }
        }
      );
    }
  }));
});
