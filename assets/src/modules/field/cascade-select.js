import { defaultsDeep } from 'lodash-es';

S.import('@main').then(() => {
  u.loadAlpine(() => {
    Alpine.data('CascadeSelect', (options) => ({
      options: {
        id: 'cascade-select-' + u.uid(),
        selected: '',
        path: [],
        ignoreSelf: null,
        placeholder: '- Select -',
        placeholders: [],
        ajaxUrl: '',
        ajaxValueField: 'value',
        source: [],
        labels: [],
        labelWidth: 'col-md-3',
        fieldWidth: 'col',
        readonly: false,
        disabled: false,
        valueField: 'id',
        textField: 'title',
        horizontal: null,
        horizontalColWidth: null,
        defaultValue: '',
        onSelectInit: () => {},
        onChange: () => {},
        onValueInit: () => {},
      },
      el: null,
      canModify: true,
      lists: [],
      ajaxUrl: '',
      values: [],

      init() {
        this.options = defaultsDeep(options, this.options);

        this.canModify = !this.options.readonly && !this.options.disabled;
        this.ajaxUrl = this.options.ajaxUrl;
        this.values = this.options.path.slice().map(String);

        let values = this.options.path.slice();

        if (values.length === 0) {
          values = [null];
        } else {
          values.unshift(null);
        }

        let promise = Promise.resolve();
        let lastValue;

        values.forEach((v, i) => {
          promise = promise.then(() => {
            return this.loadItems(v, i).then((list) => {
              if (list.length > 0) {
                this.lists.push(list);
              }
            });
          });

          lastValue = v;
        });

        this.el = this.$el;

        u.module(this.el, 'cascade.select', () => this);

        this.valueInit(this.$el, lastValue, values);
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
        return String(this.getListValue(i)) === String(item[this.options.valueField]);
      },

      getFinalValue() {
        const values = this.values.slice();

        if (values.length === 0) {
          return this.options.defaultValue;
        }

        const v = values
          .filter(v => v != null)
          .filter(v => v !== '')
          .pop();

        if (v == undefined) {
          return this.options.defaultValue;
        }

        return v;
      },

      getLevel() {
        return this.values.length;
      },

      onChange(i, event) {
        const el = event.target;

        this.values[i] = el.value;

        this.options.onChange(event);

        event.stopPropagation();

        const changeEvent = new CustomEvent('change', {
          detail: {
            el,
            component: this,
            value: el.value,
            path: this.values
          }
        });

        this.el.dispatchEvent(changeEvent);

        if (el.value === '') {
          // Clear child
          this.lists.splice(i + 1);
          this.values.splice(i + 1);
          return;
        }

        // Get child list
        this.loadItems(el.value, i)
          .then((list) => {
            // Clear child
            this.lists.splice(i + 1);
            this.values.splice(i + 1);

            if (list.length > 0) {
              this.lists.push(list);
            }
          });
      },

      loadItems(parentId, i) {
        // Ajax
        if (this.ajaxUrl) {
          return u.$http.get(
            this.ajaxUrl,
            {
              params: {
                [this.options.ajaxValueField]: parentId,
                self: this.options.ignoreSelf || null
              }
            }
          ).then((res) => res.data.data);
        }

        // Source
        if (parentId) {
          return Promise.resolve(
            this.handleSourceItems(
              this.findFromList(this.lists[i - 1] || [], parentId)?.children || []
            )
          );
        }

        return Promise.resolve(this.handleSourceItems(this.options.source));
      },

      valueInit($select, value, path) {
        const event = new CustomEvent('value.init', {
          detail: {
            el: $select,
            component: this,
            value,
            path
          }
        });

        this.options.onSelectInit(event);

        this.el.dispatchEvent(event);
      },

      selectInit($select) {
        const event = new CustomEvent('select.init', {
          detail: {
            el: $select,
            component: this,
          }
        });

        this.options.onSelectInit(event);

        this.el.dispatchEvent(event);
      },

      handleSourceItems(items) {
        return items.map(item => {
            return {
              [this.options.valueField]: item.value[this.options.valueField],
              [this.options.textField]: item.value[this.options.textField],
              children: item.children
            };
          })
          .filter(item => {
            if (this.options.ignoreSelf) {
              return item[this.options.valueField] != this.options.ignoreSelf;
            }

            return item;
          });
      },

      findFromList(items, value) {
        const found = items.filter(item => item[this.options.valueField] == value);

        return found.shift();
      },

      getPlaceholder(i) {
        if (this.options.placeholders[i]) {
          return this.options.placeholders[i];
        }

        return this.options.placeholder;
      }
    }));
  });
});
