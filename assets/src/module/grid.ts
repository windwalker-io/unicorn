import { __, deleteConfirm, h, loadAlpine, simpleAlert, simpleConfirm, slideDown, slideUp } from '../service';
import { Nullable } from '../types';
import type { UnicornFormElement } from './form';

export class UnicornGridElement {
  options: Record<string, any>;
  ordering = '';
  state = {};

  constructor(
    selector: string,
    public element: HTMLElement,
    public form: UnicornFormElement,
    options: Record<string, any> = {}
  ) {
    this.options = { ...options };

    if (!this.form) {
      throw new Error('UnicornGrid is depends on UnicornForm');
    }

    this.bindEvents();
  }

  bindEvents() {
    const inputs = this.element.querySelectorAll<HTMLInputElement>('input[data-role=grid-checkbox]');

    for (const ch of inputs) {
      ch.addEventListener('click', () => {
        ch.dispatchEvent(new CustomEvent('change'));
      });
      ch.addEventListener('change', () => {
        const event = new CustomEvent('unicorn:checked', {
          detail: { grid: this }
        });

        this.form.element?.dispatchEvent(event);
      });
    }
  }

  initComponent(store = 'grid', custom: Record<string, string> = {}) {
    this.ordering = this.element?.dataset?.ordering || '';

    if (this.ordering) {
      if (!this.ordering.toLowerCase().endsWith(' asc')
        && !this.ordering.toLowerCase().endsWith(' desc')) {
        this.ordering += ' ASC';
      }
    }

    return loadAlpine((Alpine) => {
      Alpine.store(store, this.useState(custom));
    });
  }

  useState(this: any, custom: Record<string, any> = {}) {
    const state: Partial<Record<string, any>> = {
      form: this.form.useState(custom),
    };

    Object.getOwnPropertyNames(Object.getPrototypeOf(this))
      .map(item => {
        const prop = this[item];

        if (typeof prop === 'function') {
          return state[item] = this[item].bind(this);
        }

        return item;
      });

    return Object.assign(
      state,
      custom
    );
  }

  getElement() {
    return this.element;
  }

  sendFilter($event?: Event, method?: string) {
    if ($event) {
      $event.preventDefault();
    }

    this.form.submit(null, null, method);
  }

  clearFilters(element: HTMLElement, method?: Nullable<string>): void {
    element.querySelectorAll('input, textarea, select').forEach((ele) => {
      (ele as HTMLInputElement).value = '';
    });

    this.form.submit(null, null, method);
  }

  async toggleFilters(open: boolean, filterForm: HTMLElement) {
    if (open) {
      await slideDown(filterForm);
    } else {
      await slideUp(filterForm);
    }
  }

  sort($el: HTMLElement): boolean {
    const dir = this.getDirection($el);

    const field = $el.dataset.field;
    let asc = $el.dataset.asc;
    let desc = $el.dataset.desc;

    if (field) {
      asc = field + ' ASC';
      desc = field + ' DESC';
    }

    if (dir === 'ASC') {
      return this.sortBy(desc);
    }

    return this.sortBy(asc);
  }

  /**
   * Sort two items.
   */
  sortBy(ordering: Nullable<string>): boolean {
    if (!ordering) {
      return false;
    }

    let orderingInput = this.element.querySelector<HTMLInputElement>('input[name=list_ordering]');

    if (!orderingInput) {
      orderingInput = h('input', { name: 'list_ordering', type: 'hidden', value: '' });

      this.element.appendChild(orderingInput);
    }

    orderingInput.value = ordering;

    return this.form.put();
  }

  isSortActive($el: HTMLElement): boolean {
    return this.getDirection($el) != null;
  }

  getDirection($el: HTMLElement): "ASC" | "DESC" | null {
    const field = $el.dataset.field;
    let asc = $el.dataset.asc;
    let desc = $el.dataset.desc;

    if (field) {
      asc = field + ' ASC';
      desc = field + ' DESC';
    }

    if (this.orderingEquals(asc, this.ordering)) {
      return 'ASC';
    } else if (this.orderingEquals(desc, this.ordering)) {
      return 'DESC';
    }

    return null;
  }

  orderingEquals(a: Nullable<string>, b: Nullable<string>): boolean {
    a = a || '';
    b = b || '';

    a = a.replace(/\s+/g, ' ').trim().toLowerCase();
    b = b.replace(/\s+/g, ' ').trim().toLowerCase();

    return a === b;
  }

  /**
   * Check a row's checkbox.
   */
  checkRow(row: number, value = true): void {
    const ch = this.getCheckboxByRow(row);

    if (!ch) {
      throw new Error('Checkbox of row: ' + row + ' not found.');
    }

    ch.checked = value;
    ch.dispatchEvent(new Event('input'));
    ch.dispatchEvent(new Event('change'));
  }

  getCheckboxByRow(row: number): Nullable<HTMLInputElement> {
    return this.form.element?.querySelector<HTMLInputElement>(
      `input[data-role=grid-checkbox][data-row-number="${row}"]`
    );
  }

  /**
   * Update a row.
   */
  updateRow(row: number, url?: Nullable<string>, data?: Nullable<Record<string, any>>) {
    const ch = this.getCheckboxByRow(row);

    if (!ch) {
      return false;
    }

    return this.updateItem(ch.value, url, data);
  }

  /**
   * Update an item by id.
   */
  updateItem(id: string | number, url?: Nullable<string>, data?: Nullable<Record<string, any>>): boolean {
    this.toggleAll(false);

    this.disableAllCheckboxes();

    this.form.injectInput('id[]', id);

    return this.form.patch(url, data);
  }

  /**
   * Update a item with batch task.
   */
  updateItemByTask(
    task: string,
    id: string | number,
    url?: Nullable<string>,
    data?: Nullable<Record<string, any>>
  ): boolean {
    data = data || {};
    data.task = task;

    return this.updateItem(id, url, data);
  }

  /**
   * Update a row with batch task.
   */
  updateRowByTask(task: string, row: number, url?: Nullable<string>, data?: Nullable<Record<string, any>>): boolean {
    const ch = this.getCheckboxByRow(row);

    if (!ch) {
      return false;
    }

    return this.updateItemByTask(task, ch.value, url, data);
  }

  /**
   * Batch update items.
   */
  updateListByTask(task: string, url?: Nullable<string>, data?: Nullable<Record<string, any>>): boolean {
    data = data || {};
    data.task = task;

    return this.form.patch(url, data);
  }

  /**
   * Copy a row.
   */
  copyItem(id: string | number, url?: Nullable<string>, data?: Nullable<Record<string, any>>): boolean {
    this.toggleAll(false);

    this.disableAllCheckboxes();

    this.form.injectInput('id[]', id);

    return this.form.post(url, data);
  }

  /**
   * Copy a row.
   */
  copyRow(row: number, url?: Nullable<string>, data?: Nullable<Record<string, any>>): boolean {
    const ch = this.getCheckboxByRow(row);

    if (!ch) {
      return false;
    }

    return this.copyItem(ch.value, url, data);
  }

  /**
   * Delete checked items.
   */
  deleteList(
    message?: Nullable<string> | false,
    url?: Nullable<string>,
    data?: Nullable<Record<string, any>>
  ): boolean {
    if (!this.validateChecked()) {
      return false;
    }

    message = message == null ? __('unicorn.message.delete.confirm') : message;

    if (message !== false) {
      simpleConfirm(message).then(isConfirm => {
        if (isConfirm) {
          this.form.delete(url, data);
        }
      });
    } else {
      this.form.delete(url, data);
    }

    return true;
  }

  /**
   * Delete an item by row.
   */
  async deleteRow(row: number,
                  msg?: Nullable<string>,
                  url?: Nullable<string>,
                  data?: Nullable<Record<string, any>>): Promise<boolean> {
    const ch = this.getCheckboxByRow(row);

    if (!ch) {
      return false;
    }

    return this.deleteItem(ch.value, msg, url, data);
  }

  /**
   * Delete an item.
   */
  async deleteItem(id: string,
                   msg?: Nullable<string>,
                   url?: Nullable<string>,
                   data?: Nullable<Record<string, any>>): Promise<boolean> {
    msg = msg || __('unicorn.message.delete.confirm');

    const isConfirm = await deleteConfirm(msg);

    if (isConfirm) {
      // this.toggleAll(false);
      // this.checkRow(row);
      data = data || {};

      data.id = id;

      this.form.delete(url, data);
    }

    return isConfirm;
  }

  /**
   * Toggle all checkboxes.
   */
  toggleAll(value: boolean) {
    Array.from(
      this.element.querySelectorAll<HTMLInputElement>('input[data-role=grid-checkbox][type=checkbox]')
    )
      .forEach((input) => {
        input.checked = value;

        input.dispatchEvent(new CustomEvent('input'));
        input.dispatchEvent(new CustomEvent('change'));
      });

    return this;
  }

  disableAllCheckboxes() {
    Array.from(
      this.element.querySelectorAll<HTMLInputElement>('input[data-role=grid-checkbox][type=checkbox]')
    )
      .forEach((input) => {
        input.disabled = true;
      });
  }

  /**
   * Count checked checkboxes.
   */
  countChecked(): number {
    return this.getChecked().length;
  }

  /**
   * Get Checked boxes.
   */
  getChecked(): HTMLInputElement[] {
    return Array.from(
      this.element.querySelectorAll<HTMLInputElement>('input[data-role=grid-checkbox][type=checkbox]:checked')
    );
  }

  getCheckedValues(): string[] {
    return this.getChecked().map(input => input.value);
  }

  /**
   * Validate there has one or more checked boxes.
   */
  validateChecked(event?: Event, callback?: (grid: UnicornGridElement) => any, msg?: string): this {
    msg = msg || __('unicorn.message.grid.checked');

    if (!this.hasChecked()) {
      if (msg !== '') {
        simpleAlert(msg);
      }

      if (event) {
        event.stopPropagation();
        event.preventDefault();
      }

      return this;
    }

    if (callback) {
      callback(this);
    }

    return this;
  }

  hasChecked(): boolean {
    return this.countChecked() > 0;
  }

  /**
   * Reorder all.
   */
  reorderAll(url?: Nullable<string>, data?: Nullable<Record<string, any>>) {
    return this.updateListByTask('reorder', url, data);
  }

  /**
   * Reorder items.
   */
  moveItem(id: number | string, delta: number, url?: Nullable<string>, data?: Nullable<Record<string, any>>): boolean {
    data = data || {};
    data.delta = delta;

    return this.updateItemByTask('move', id, url, data);
  }

  moveUp(id: string | number, url?: Nullable<string>, data?: Nullable<Record<string, any>>): boolean {
    return this.moveItem(id, -1, url, data);
  }

  moveDown(id: string | number, url?: Nullable<string>, data?: Nullable<Record<string, any>>): boolean {
    return this.moveItem(id, 1, url, data);
  }

  getId(suffix = '') {
    return this.form.element?.id + suffix;
  }
}
