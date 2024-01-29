import { defData } from '../utilities';

/**
 * UnicornGrid
 */
export default class UnicornGrid {
  static get is() { return 'grid'; }

  static install(app, options = {}) {
    app.grid = (ele, options = {}) => {
      const selector = typeof ele === 'string' ? ele : null;
      ele = app.selectOne(ele);

      return defData(
        ele,
        'grid.plugin',
        () => new UnicornGridElement(selector, ele, options, app)
      );
    };
  }
}

export class UnicornGridElement {
  ordering = '';
  state = {};

  static get defaultOptions() {
    return {
      //
    }
  }

  constructor(selector, element, options, app) {
    this.element = element;
    this.options = Object.assign({}, this.constructor.defaultOptions, options);
    this.app = app;
    this.form = app.form(selector || element);

    if (!this.form) {
      throw new Error('UnicornGrid is dependent on UnicornForm');
    }

    this.bindEvents();
  }

  bindEvents() {
    this.app.selectAll('input[data-role=grid-checkbox]', (ch) => {
      ch.addEventListener('click', () => {
        ch.dispatchEvent(new CustomEvent('change'));
      });
      ch.addEventListener('change', () => {
        if (this.form) {
          const event = new CustomEvent('unicorn:checked', {
            detail: { grid: this }
          });

          this.form.element.dispatchEvent(event);
        }
      });
    });
  }

  initComponent(store = 'grid', custom = {}) {
    this.ordering = this.element?.dataset?.ordering;

    if (this.ordering) {
      if (!this.ordering.toLowerCase().endsWith(' asc')
        && !this.ordering.toLowerCase().endsWith(' desc')) {
        this.ordering += ' ASC';
      }
    }

    return this.app.loadAlpine((m) => {
      Alpine.store(store, this.useState(custom));

      return m;
    });
  }

  useState(custom = {}) {
    const state = {
      form: this.form.useState(custom),
    };
    Object.getOwnPropertyNames(Object.getPrototypeOf(this))
      .map(item => state[item] = this[item].bind(this));

    return Object.assign(
      state,
      custom
    );
  }

  getElement() {
    return this.element;
  }

  sendFilter($event, method = null) {
    if ($event) {
      $event.preventDefault();
    }

    this.form.submit(null, null, method);
  }

  clearFilters(element, method = null) {
    element.querySelectorAll('input, textarea, select').forEach((ele) => {
      ele.value = '';
    });

    this.form.submit(null, null, method);
  }

  toggleFilters(open, filterForm) {
    if (open) {
      this.app.$ui.slideDown(filterForm);
    } else {
      this.app.$ui.slideUp(filterForm);
    }
  }

  /**
   * @param {Element} $el
   * @returns {boolean}
   */
  sort($el) {
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
   *
   * @param {string} ordering
   *
   * @returns {boolean}
   */
  sortBy(ordering) {
    let orderingInput = this.element.querySelector('input[name=list_ordering]');

    if (!orderingInput) {
      orderingInput = this.app.h('input', { name: 'list_ordering', type: 'hidden', value: '' });

      this.element.appendChild(orderingInput);
    }

    orderingInput.value = ordering;

    return this.form.put();
  }

  /**
   * @param {Element} $el
   * @returns {boolean}
   */
  isSortActive($el) {
    return this.getDirection($el) != null;
  }

  /**
   * @param {HTMLElement} $el
   * @returns {string|null}
   */
  getDirection($el) {
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

  orderingEquals(a, b) {
    a = a || '';
    b = b || '';

    a = a.replace(/\s+/g, ' ').trim().toLowerCase();
    b = b.replace(/\s+/g, ' ').trim().toLowerCase();

    return a === b;
  }

  /**
   * Check a row's checkbox.
   *
   * @param {number}  row
   * @param {boolean} value
   */
  checkRow(row, value = true) {
    const ch = this.getCheckboxByRow(row);

    if (!ch) {
      throw new Error('Checkbox of row: ' + row + ' not found.');
    }

    ch.checked = value;
    ch.dispatchEvent(new Event('input'));
    ch.dispatchEvent(new Event('change'));
  }

  getCheckboxByRow(row) {
    return this.form.element.querySelector(`input[data-role=grid-checkbox][data-row-number="${row}"]`);
  }

  /**
   * Update a row.
   *
   * @param  {number} row
   * @param  {?string} url
   * @param  {?Object} data
   *
   * @returns {boolean}
   */
  updateRow(row, url = null, data = null) {
    const ch = this.getCheckboxByRow(row);

    return this.updateItem(ch.value, url, data);
  }

  /**
   * Update a row.
   *
   * @param  {string|number} id
   * @param  {?string} url
   * @param  {?Object} data
   *
   * @returns {boolean}
   */
  updateItem(id, url = null, data = null) {
    this.toggleAll(false);

    this.disableAllCheckboxes();

    this.form.injectInput('id[]', id);

    return this.form.patch(url, data);
  }

  /**
   * Update a item with batch task.
   *
   * @param  {string} task
   * @param  {string} id
   * @param  {?string} url
   * @param  {?Object} data
   *
   * @returns {boolean}
   */
  updateItemByTask(task, id, url = null, data = null) {
    data = data || {};
    data.task = task;

    return this.updateItem(id, url, data);
  }

  /**
   * Update a row with batch task.
   *
   * @param  {string} task
   * @param  {number} row
   * @param  {?string} url
   * @param  {?Object} data
   *
   * @returns {boolean}
   */
  updateRowByTask(task, row, url = null, data = null) {
    const ch = this.getCheckboxByRow(row);

    return this.updateItemByTask(task, ch.value, url, data);
  }

  /**
   * @param {string} task
   * @param {any} id
   * @param {string|null} url
   * @param {*|null} data
   * @returns {boolean}
   */
  doTask(task, id, url = null, data = null) {
    return this.updateItemByTask(task, id, url, data);
  }

  /**
   * Batch update items.
   *
   * @param  {string} task
   * @param  {?string} url
   * @param  {*|null} data
   *
   * @returns {boolean}
   */
  updateByTask(task, url = null, data = null) {
    data = data || {};
    data.task = task;

    return this.form.patch(url, data);
  }

  /**
   * @param {string} task
   * @param {string|null} url
   * @param {*|null} data
   * @returns {boolean}
   */
  batch(task, url = null, data = null) {
    return this.updateByTask(task, url, data);
  }

  /**
   * Copy a row.
   *
   * @param  {string|number} id
   * @param  {?string} url
   * @param  {*|null} data
   *
   * @returns {boolean}
   */
  copyItem(id, url = null, data = null) {
    this.toggleAll(false);

    this.disableAllCheckboxes();

    this.form.injectInput('id[]', id);

    return this.form.post(url, data);
  }

  /**
   * Copy a row.
   *
   * @param  {number} row
   * @param  {?string} url
   * @param  {Object} data
   *
   * @returns {boolean}
   */
  copyRow(row, url = null, data = null) {
    const ch = this.getCheckboxByRow(row);

    return this.copyItem(ch.value, url, data);
  }

  /**
   * Delete checked items.
   *
   * @param  {?string} message
   * @param  {?string} url
   * @param  {?Object} data
   *
   * @returns {boolean}
   */
  deleteList(message = null, url = null, data = null) {
    if (!this.validateChecked()) {
      return false;
    }

    message = message == null ? this.app.__('unicorn.message.delete.confirm') : message;

    if (message !== false) {
      this.app.confirm(message).then(isConfirm => {
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
   * Delete an item.
   *
   * @param  {number} row
   * @param  {?string} msg
   * @param  {?string} url
   * @param  {Object} data
   *
   * @returns {boolean}
   */
  deleteRow(row, msg = null, url = null, data = null) {
    const  ch = this.getCheckboxByRow(row);

    return this.deleteItem(ch.value, msg, url, data);
  }

  /**
   * Delete an item.
   *
   * @param  {number|string} id
   * @param  {?string} msg
   * @param  {?string} url
   * @param  {Object} data
   *
   * @returns {boolean}
   */
  deleteItem(id, msg = null, url = null, data = null) {
    msg = msg || this.app.__('unicorn.message.delete.confirm');

    return this.app.confirm(msg)
      .then(isConfirm => {
        if (isConfirm) {
          // this.toggleAll(false);
          // this.checkRow(row);
          data = data || {};

          data.id = id;

          this.form.delete(url, data);
        }
      });
  }

  /**
   * Toggle all checkboxes.
   *
   * @param  {boolean}          value     Checked or unchecked.
   */
  toggleAll(value) {
    this.app.selectAll(
      this.element.querySelectorAll('input[data-role=grid-checkbox][type=checkbox]')
    )
      .map((input) => {
        input.checked = value;

        input.dispatchEvent(new Event('input'));
        input.dispatchEvent(new Event('change'));
      });

    return this;
  }

  disableAllCheckboxes() {
    this.app.selectAll(
      this.element.querySelectorAll('input[data-role=grid-checkbox][type=checkbox]'),
      (input) => {
        input.disabled = true;
      }
    );
  }

  /**
   * Count checked checkboxes.
   *
   * @returns {int}
   */
  countChecked() {
    return this.getChecked().length;
  }

  /**
   * Get Checked boxes.
   *
   * @returns {HTMLInputElement[]}
   */
  getChecked() {
    return this.app.selectAll(
      this.element.querySelectorAll('input[data-role=grid-checkbox][type=checkbox]:checked')
    );
  }

  /**
   * @returns {string[]}
   */
  getCheckedValues() {
    return this.getChecked().map(input => input.value);
  }

  /**
   * Validate there has one or more checked boxes.
   *
   * @param   {Event}     event
   * @param   {Function}  callback
   * @param   {?string}    msg
   *
   * @returns {boolean}
   */
  validateChecked(event= null, callback = null, msg = null) {
    msg = msg || this.app.__('unicorn.message.grid.checked');

    if (!this.hasChecked()) {
      if (msg !== '') {
        this.app.alert(msg);
      }

      if (event) {
        event.stopPropagation();
        event.preventDefault();
      }

      return false;
    }

    if (callback) {
      callback(this);
    }

    return this;
  }

  /**
   * @return {boolean}
   */
  hasChecked() {
    return this.countChecked() > 0;
  }

  /**
   * Reorder all.
   *
   * @param   {?string}  url
   * @param   {Object}  data
   *
   * @returns {boolean}
   */
  reorderAll(url = null, data = null) {
    return this.batch('reorder', url, data);
  }

  /**
   * Reorder items.
   *
   * @param  {int}     id
   * @param  {int}     delta
   * @param  {?string}  url
   * @param  {Object}  data
   *
   * @returns {boolean}
   */
  moveItem(id, delta, url = null, data = null) {
    data = data || {};
    data.delta = delta;

    return this.updateRowByTask('move', id, url, data);
  }

  /**
   * @param  {int}     id
   * @param  {?string}  url
   * @param  {Object}  data
   *
   * @returns {boolean}
   */
  moveUp(id, url = null, data = null) {
    return this.moveItem(id, -1, url, data);
  }

  /**
   * @param  {int}     id
   * @param  {?string}  url
   * @param  {Object}  data
   *
   * @returns {boolean}
   */
  moveDown(id, url = null, data = null) {
    return this.moveItem(id, 1, url, data);
  }

  getId(suffix = '') {
    return this.form.element.id + suffix;
  }
}
