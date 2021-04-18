/**
 * Part of Unicorn project.
 *
 * @copyright  Copyright (C) 2016 LYRASOFT. All rights reserved.
 * @license    GNU General Public License version 2 or later.
 */

import { merge } from 'lodash-es';
import { defData } from '../utilities.js';

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

class UnicornGridElement {
  ordering = '';

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

    this.registerEvents();
  }

  /**
   * Start this object and events.
   */
  registerEvents() {
    // this.searchClearButton.click(() => {
    //   this.searchContainer.find('input, textarea, select').val('');
    //   this.filterContainer.find('input, textarea, select').val('');
    //
    //   this.form.submit();
    // });
    //
    // this.filterButton.click(event => {
    //   this.toggleFilter();
    //   event.stopPropagation();
    //   event.preventDefault();
    // });
    //
    // this.sortButtons.click(event => {
    //   self.sort(event.currentTarget, event);
    // });
  }

  // registerCustomElements() {
  //   return app.import('@unicorn/ui/grid-components.js');
  // }

  initComponent(store = 'grid', custom = {}) {
    this.ordering = this.element.dataset.ordering;

    if (!this.ordering.toLowerCase().endsWith(' asc')
      && !this.ordering.toLowerCase().endsWith(' desc')) {
      this.ordering += ' ASC';
    }

    return this.app.loadSpruce()
      .then(() => {
        Spruce.store(store, this.useState(custom));
        // this.registerCustomElements();
        this.app.startAlpine();
      });
  }

  useState(custom = {}) {
    return merge(
      this,
      custom
    );
  }

  sendFilter($event) {
    if ($event) {
      $event.preventDefault();
    }

    this.form.put();
  }

  clearFilters(element) {
    element.querySelectorAll('input, textarea, select').forEach((ele) => {
      ele.value = '';
    });

    this.form.put();
  }

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

  isSortActive($el) {
    return this.getDirection($el) != null;
  }

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
    const ch = this.form.find('input.grid-checkbox[data-row-number=' + row + ']');

    if (!ch.length) {
      throw new Error('Checkbox of row: ' + row + ' not found.');
    }

    ch[0].checked = value;
  }

  /**
   * Update a row.
   *
   * @param  {number} row
   * @param  {string} url
   * @param  {Object} queries
   *
   * @returns {boolean}
   */
  updateRow(row, url, queries) {
    this.toggleAll(false);

    this.checkRow(row);

    return this.core.patch(url, queries);
  }

  /**
   * Update a row with batch task.
   *
   * @param  {string} task
   * @param  {number} row
   * @param  {string} url
   * @param  {Object} queries
   *
   * @returns {boolean}
   */
  doTask(task, row, url, queries) {
    queries = queries || {};

    queries.task = task;

    return this.updateRow(row, url, queries);
  }

  /**
   * Batch update items.
   *
   * @param  {string} task
   * @param  {string} url
   * @param  {Object} queries
   *
   * @returns {boolean}
   */
  batch(task, url, queries) {
    queries = queries || {};

    queries.task = task;

    return this.core.patch(url, queries);
  }

  /**
   * Copy a row.
   *
   * @param  {number} row
   * @param  {string} url
   * @param  {Object} queries
   *
   * @returns {boolean}
   */
  copyRow(row, url, queries) {
    this.toggleAll(false);

    this.checkRow(row);

    return this.core.post(url, queries);
  }

  /**
   * Delete checked items.
   *
   * @param  {string} message
   * @param  {string} url
   * @param  {Object} queries
   *
   * @returns {boolean}
   */
  deleteList(message, url, queries) {
    message = message == null ? this.app.__('unicorn.message.delete.confirm') : message;

    if (message !== false) {
      this.app.confirm(message, isConfirm => {
        if (isConfirm) {
          this.core['delete'](url, queries);
        }
      });
    } else {
      this.core['delete'](url, queries);
    }

    return true;
  }

  /**
   * Delete an itme.
   *
   * @param  {number} row
   * @param  {string} msg
   * @param  {string} url
   * @param  {Object} queries
   *
   * @returns {boolean}
   */
  deleteRow(row, msg, url, queries) {
    msg = msg || this.app.__('unicorn.message.delete.confirm');

    this.app.confirm(msg, isConfirm => {
      if (isConfirm) {
        this.toggleAll(false);

        this.checkRow(row);

        this.deleteList(false, url, queries);
      }
    });

    return true;
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
      });

    return this;
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
   * @returns {Element[]}
   */
  getChecked() {
    return this.app.selectAll(
      this.element.querySelectorAll('input[data-role=grid-checkbox][type=checkbox]')
    );
  }

  /**
   * Validate there has one or more checked boxes.
   *
   * @param   {string}  msg
   * @param   {Event}   event
   *
   * @returns {UnicornGridElement}
   */
  hasChecked(msg, event) {
    msg = msg || Unicorn.Translator.translate('unicorn.message.grid.checked');

    if (!this.countChecked()) {
      alert(msg);

      // If you send event object as second argument, we will stop all actions.
      if (event) {
        event.stopPropagation();
        event.preventDefault();
      }

      throw new Error(msg);
    }

    return this;
  }

  /**
   * Reorder all.
   *
   * @param   {string}  url
   * @param   {Object}  queries
   *
   * @returns {boolean}
   */
  reorderAll(url, queries) {
    const self = this;
    const origin = this.form.find('input[name=origin_ordering]');

    // If origin exists, we diff them and only send changed group.
    if (origin.length) {
      const originOrdering = origin.val().split(',');
      const inputs = this.form.find('.ordering-control input');

      this.toggleAll();

      inputs.each(function(i) {
        const $this = $(this);

        if ($this.val() !== originOrdering[i]) {
          // Check self
          self.checkRow($this.attr('data-order-row'));

          const tr = $this.parents('tr');
          const group = tr.attr('data-order-group');

          // Check same group boxes
          if (group !== '') {
            tr.siblings('[data-order-group=' + group + ']')
              .find('input.grid-checkbox')
              .prop('checked', true);
          }
        }
      });
    }

    return this.batch('reorder', url, queries);
  }

  /**
   * Reorder items.
   *
   * @param  {int}     row
   * @param  {int}     delta
   * @param  {string}  url
   * @param  {Object}  queries
   *
   * @returns {boolean}
   */
  reorder(row, delta, url, queries) {
    queries = queries || {};
    queries.delta = delta;

    return this.doTask('reorder', row, url, queries);
  }
}

function isSortActive($el) {
  let field = $el.dataset.field;
  let desc = $el.dataset.desc;
  let asc = $el.dataset.asc;
  
  desc = desc || `${field} DESC`;
  asc = asc || `${field} ASC`;

  const ordering = this.grid.element.dataset.ordering;
  console.log(ordering, asc, desc);
  return ordering === asc || ordering === desc;
}
