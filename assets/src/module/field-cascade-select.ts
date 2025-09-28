
import { useLoadedHttpClient } from '../composable';
import { loadAlpine, module, uid, prepareAlpineDefer, initAlpineComponent } from '../service';
import { mergeDeep } from '../utilities';
import AlpineComponent from '@rubenbimmel/alpine-class-component/dist/alpineComponent';
import Component from '@rubenbimmel/alpine-class-component/dist/decorators/component';

interface CascadeSelectOptions {
  id: string;
  selected: string;
  path: string[];
  ignoreSelf: boolean | null;
  placeholder: string;
  placeholders: string[];
  ajaxUrl: string;
  ajaxValueField: string;
  source: string[];
  labels: string[];
  labelWidth: string;
  fieldWidth: string;
  readonly: boolean;
  disabled: boolean;
  valueField: string;
  textField: string;
  horizontal: boolean | null;
  horizontalColWidth: string | null;
  defaultValue: string;
  onSelectInit: Function,
  onChange: Function,
  onValueInit: Function,
}

const defaultOptions = {
  id: '',
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
  onSelectInit: () => {
  },
  onChange: () => {
  },
  onValueInit: () => {
  },
};

@Component
class FieldCascadeSelect extends AlpineComponent {
  options: CascadeSelectOptions;
  el?: HTMLElement;
  canModify: boolean = false;
  lists: any[] = [];
  ajaxUrl: string = '';
  values: Array<string | null> = [];

  constructor(options: Partial<CascadeSelectOptions> = {}) {
    super();

    this.options = mergeDeep({}, defaultOptions, options);

    this.options.id = this.options.id || 'cascade-select-' + uid();
  }

  init() {
    this.canModify = !this.options.readonly && !this.options.disabled;
    this.ajaxUrl = this.options.ajaxUrl;
    this.values = this.options.path.slice().map(String);

    let values: Array<string | null> = this.options.path.slice();

    if (values.length === 0) {
      values = [null];
    } else {
      values.unshift(null);
    }

    let promise = Promise.resolve();
    let lastValue: string | null = null;

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

    module(this.$el, 'cascade.select', () => this);

    this.valueInit(this.$el, lastValue, values);
  }

  getLabel(i: number) {
    return this.options.labels[i] || `Level ${i + 1}`;
  }

  getId(i: number) {
    return `${this.options.id}__level-${i}`;
  }

  getListValue(i: number) {
    return this.values[i] || '';
  }

  isSelected(i: number, item: any) {
    return String(this.getListValue(i)) === String(item[this.options.valueField]);
  }

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
  }

  getLevel() {
    return this.values.length;
  }

  async onChange(i: number, event: Event) {
    const el = event.target as HTMLSelectElement;

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

    this.el?.dispatchEvent(changeEvent);

    if (el.value === '') {
      // Clear child
      this.lists.splice(i + 1);
      this.values.splice(i + 1);
      return;
    }

    // Get child list
    let list = await this.loadItems(el.value, i);
    this.lists.splice(i + 1);
    this.values.splice(i + 1);
    if (list.length > 0) {
      this.lists.push(list);
    }
  }

  async loadItems(parentId: string | null, i: number) {
    // Ajax
    if (this.ajaxUrl) {
      const http = await useLoadedHttpClient();

      let res = await http.get(
        this.ajaxUrl,
        {
          params: {
            [this.options.ajaxValueField]: parentId,
            self: this.options.ignoreSelf || null
          }
        }
      );
      return await res.data.data;
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
  }

  valueInit($select: HTMLElement, value: string | null, path: Array<string | null>) {
    const event = new CustomEvent('value.init', {
      detail: {
        el: $select,
        component: this,
        value,
        path
      }
    });

    this.options.onSelectInit(event);

    this.$el.dispatchEvent(event);
  }

  selectInit($select: HTMLElement) {
    const event = new CustomEvent('select.init', {
      detail: {
        el: $select,
        component: this,
      }
    });

    this.options.onSelectInit(event);

    this.$el.dispatchEvent(event);
  }

  handleSourceItems(items: any[]) {
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
  }

  findFromList(items: any[], value: string) {
    const found = items.filter(item => item[this.options.valueField] == value);

    return found.shift();
  }

  getPlaceholder(i: number) {
    if (this.options.placeholders[i]) {
      return this.options.placeholders[i];
    }

    return this.options.placeholder;
  }
}

declare global {
  var S: any;
}



async function init() {
  await prepareAlpineDefer(() => {
    Alpine.data('CascadeSelect', (options: CascadeSelectOptions) => new FieldCascadeSelect(options));
  });
  
  await initAlpineComponent('data-cascade-select');
}

export const ready = init();

export interface CascadeSelectModule {
  ready: typeof ready;
}
