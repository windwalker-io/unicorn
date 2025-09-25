import { mergeDeep } from '../utilities';
import { cloneDeep } from 'lodash-es';
import { initAlpine, prepareAlpine, uid } from '../modules';
import '@asika32764/vue-animate';
import Sortable from 'sortablejs';

export interface RepeatableOptions {
  id?: string;
  fieldName?: string;
  sortable?: boolean;
  hasKey?: boolean;
  singleArray?: boolean;
  ensureFirstRow?: boolean;
  max?: number | null;
}

const defaultOptions: RepeatableOptions = {
  id: '',
  fieldName: '',
  sortable: false,
  hasKey: false,
  singleArray: false,
  ensureFirstRow: false,
  max: null,
};

function prepareItem(item: any) {
  if (item.uid == null) {
    item.uid = uid();
  }
  return item;
}

prepareAlpine(() => {
  Alpine.data('RepeatableField', ({ items, defaultValues, attrs }, options) => ({
    items,
    defaultValues,
    attrs,
    options: mergeDeep<RepeatableOptions>(defaultOptions, options),
    init() {
      if (this.options.sortable) {
        // @see https://github.com/alpinejs/alpine/discussions/1635
        Sortable.create(this.$refs.tbody, {
          handle: '.h-handle',
          animation: 300,
          onEnd: (event: any) => {
            // V3 helper to unwrap the proxy
            const items = Alpine.raw(this.items);

            // splice mutates the original object, which
            // you want to avoid. In this case it works because we
            // created a temporary object that we can control
            // That way we know there are no side effects
            const droppedAtItem = items.splice(event.oldIndex, 1)[0];
            items.splice(event.newIndex, 0, droppedAtItem);
            //
            // // Alpine will update when you modify the state,
            // // so we need to set it back to our new state
            this.items = items;

            // HACK update prevKeys to new sort order
            let keys = [];
            for (let item of items) {
              keys.push(item.uid);
            }

            // HACK update index of dataStack
            this.$refs.steps_template._x_prevKeys = keys;
            const elements = this.$refs.steps_template
              .parentElement
              .querySelectorAll('tr');

            [].slice.call(elements).forEach((ele, i) => {
              if (ele?._x_dataStack[0]?.i != null) {
                ele._x_dataStack[0].i = i;
              }
            });
          }
        });
      }

      items.forEach((item) => {
        prepareItem(item);
      });

      if (this.options.ensureFirstRow) {
        this.makeSureDefaultItem();
      }
    },

    addItem(i: number) {
      const item = prepareItem(this.getEmptyItem());

      this.items.splice(i + 1, 0, item);
    },

    delItem(i: number) {
      const el = this.getItemElementByUID(this.items[i].uid);
      let hasAnimate = false;

      el.addEventListener('animationstart', () => {
        hasAnimate = true;
      }, { once: true });

      el.classList.add('animate__fadeOut');

      setTimeout(() => {
        if (!hasAnimate) {
          this._removeItem(i);
        }
      }, 100);

      el.addEventListener('animationend', () => {
        this._removeItem(i);
      }, { once: true });
    },

    _removeItem(i: number) {
      this.items.splice(i, 1);

      if (this.options.ensureFirstRow) {
        this.makeSureDefaultItem();
      }
    },

    makeSureDefaultItem() {
      if (this.items.length === 0) {
        this.items.push(prepareItem(this.getEmptyItem()));
      }
    },

    getItemElementByUID(uid: string) {
      return this.$root.querySelector(`[data-item="${uid}"]`);
    },

    getId(i: number, item: any, field: string) {
      return `${this.id}-${item.uid}-${field}`;
    },

    getName(i: number, item: any, field: string) {
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

      return this.options.max > this.items.length;
    },

    get canModify() {
      return this.attrs.disabled == null && this.attrs.readonly == null;
    },

    get fieldName() {
      return this.options.fieldName;
    },

    get id() {
      return this.options.id;
    }
  }));
});

await initAlpine('data-repeatable');
