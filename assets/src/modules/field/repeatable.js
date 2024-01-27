
import { cloneDeep } from 'lodash-es';

const defaultOptions = {
  id: '',
  fieldName: '',
  sortable: false,
  hasKey: false,
  singleArray: false,
  ensureFirstRow: false,
  max: null,
};

function prepareItem(item) {
  if (item.uid == null) {
    item.uid = u.uid();
  }
  return item;
}

S.import('@main').then(async () => {
  u.importCSS('@vue2-animate');
  await u.loadAlpine();

  Alpine.data('RepeatableField', ({ items, defaultValues, attrs }, options) => ({
    items,
    defaultValues,
    attrs,
    options: u.defaultsDeep(options, defaultOptions),
    init() {
      if (this.options.sortable) {
        u.import('@sortablejs').then(() => {
          // @see https://github.com/alpinejs/alpine/discussions/1635
          Sortable.create(this.$refs.tbody, {
            handle: '.h-handle',
            animation: 300,
            onEnd: (event) => {
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
        });
      }

      items.forEach((item) => {
        prepareItem(item);
      });

      if (this.options.ensureFirstRow) {
        this.makeSureDefaultItem();
      }
    },

    addItem(i) {
      const item = prepareItem(this.getEmptyItem());

      this.items.splice(i + 1, 0, item);
    },

    delItem(i) {
      const el = this.getItemElementByUID(this.items[i].uid);

      el.classList.add('fadeOut');
      el.addEventListener('animationend', () => {
        this.items.splice(i, 1);

        if (this.options.ensureFirstRow) {
          this.makeSureDefaultItem();
        }
      });
    },

    makeSureDefaultItem() {
      if (this.items.length === 0) {
        this.items.push(prepareItem(this.getEmptyItem()));
      }
    },

    getItemElementByUID(uid) {
      return this.$root.querySelector(`[data-item="${uid}"]`);
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

  u.selectAll('[data-repeatable]', (el) => {
    el.setAttribute('x-data', el.dataset.repeatable);

    delete el.dataset.repeatable;

    Alpine.initTree(el);
  });
});
