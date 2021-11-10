/**
 * Part of earth project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */
import { cloneDeep } from 'lodash-es';

const defaultOptions = {
  hasKey: false,
  singleArray: false
};

function prepareItem(item) {
  if (item.uid == null) {
    item.uid = u.uid();
  }
  return item;
}

u.$ui.loadAlpine(() => {
  Alpine.data(
    'RepeatableField',
    ({ items, defaultValues, attrs }, options) => ({
      items,
      defaultValues,
      attrs,
      options: u.defaultsDeep(options, defaultOptions),
      init() {
        items.forEach((item) => {
          prepareItem(item);
        });
      },

      addItem(i) {
        this.items.splice(i + 1, 0, prepareItem(this.getEmptyItem()));

        this.$nextTick(() => {
          // const el = this.$refs['repeat-item-' + (i + 1)][0];

          // $(el).css('display', 'none').fadeIn();
        });
      },

      getId(i, item, field) {
        return `${this.id}-${item.uid}-${field}`;
      },

      getName(i, item, field) {
        if (this.options.singleArray) {
          if (this.options.hasKey) {
            if (field === 'key') {
              return '';
            }

            return `${this.fieldName}[${item.key}]`;
          }

          return `${this.fieldName}[]`;
        }

        return `${this.fieldName}[${i}][${field}]`;
      },

      getEmptyItem() {
        return cloneDeep(this.defaultValues);
      },

      get canAdd() {
        if (!this.options.max) {
          return true;
        }

        return this.options.max > this.items;
      },

      get canModify() {
        return this.attrs.disabled == null && this.attrs.readonly == null;
      },

      get fieldName() {
        return this.options.fieldName;
      },
    })
  );
})

// u.directive('repeatable-field', {
//   mounted(el, { value }) {
//     u.getBoundedInstance(el, 'repeatable.field', () => {
//       return new RepeatableField(el, JSON.parse(value || '{}'));
//     });
//   },
//   updated() {
//     u.getBoundedInstance(el, 'repeatable.field').setOptions(JSON.parse(value || '{}'));
//   }
// });
