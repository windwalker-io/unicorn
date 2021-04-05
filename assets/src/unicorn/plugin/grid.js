/**
 * Part of Unicorn project.
 *
 * @copyright  Copyright (C) 2016 LYRASOFT. All rights reserved.
 * @license    GNU General Public License version 2 or later.
 */

import { defData } from '../utilities.js';
import { Plugin } from '../plugin.js';

/**
 * UnicornGrid
 */
export default class UnicornGrid extends Plugin {
  static get is() { return 'grid'; }

  static get proxies() {
    return {
      grid: 'getInstance'
    };
  }

  getInstance(ele, options = {}) {
    const selector = typeof ele === 'string' ? ele : null;
    ele = this.app.$(ele);

    return defData(
      ele,
      'grid.plugin',
      () => new UnicornGridElement(selector, ele, options, this.app)
    );
  }

  /**
   * Default options.
   * @returns {Object}
   */
  static get defaultOptions() {
    return {};
  }
}

class UnicornGridElement {
  static get defaultOptions() {
    return {
      mainSelector: '',
      // selector: {
      //   search: {
      //     container: '.search-container',
      //     button: '.search-button',
      //     clearButton: '.search-clear-button'
      //   },
      //   filter: {
      //     container: '.filter-container',
      //     button: '.filter-toggle-button'
      //   },
      //   sort: {
      //     button: 'a[data-sort-button]'
      //   }
      // }
    }
  }

  constructor(selector, element, options, app) {
    this.element = element;
    this.options = Object.assign({}, this.constructor.defaultOptions, options);
    this.app = app;
    this.form = app.form(selector || element);
    // this.ui = app.UI;

    if (!this.form) {
      throw new Error('UnicornGrid is dependent on UnicornForm');
    }

    // if (!this.ui) {
    //   throw new Error('UnicornGrid is dependent on UnicornUI');
    // }

    // const selector = this.options.selector;

    // this.searchContainer = this.form.find(selector.search.container);
    //this.searchButton = this.form.find(selector.search.button);
    // this.searchClearButton = this.form.find(selector.search.clearButton);
    // this.filterContainer = this.form.find(selector.filter.container);
    // this.filterButton = this.form.find(selector.filter.button);
    // this.sortButtons = this.form.find(selector.sort.button);

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

  sendFilter() {
    this.form.put();
  }

  clearFilters(element) {
    element.querySelectorAll('input, textarea, select').forEach((ele) => {
      ele.value = '';
    });

    this.form.submit();
  }

  /**
   * Sort two items.
   *
   * @param {string} ordering
   * @param {string} direction
   *
   * @returns {boolean}
   */
  sort(ordering, direction) {
    let orderingInput = this.app.$('input[name=list_ordering]');

    if (!orderingInput) {
      orderingInput = this.app.h('input', { name: 'list_ordering', type: 'hidden', value: '' });

      this.element.appendChild(orderingInput);
    }

    let directionInput = this.app.$('input[name=list_direction]');

    if (!directionInput) {
      directionInput = this.app.h('input', { name: 'list_direction', type: 'hidden', value: ''  })

      this.element.appendChild(directionInput);
    }

    orderingInput.value = ordering;
    directionInput.value = direction;

    return this.form.put();
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
    this.app.selectMap(
      this.element.querySelectorAll('input[data-role=grid-checkbox][type=checkbox]'),
      (input) => {
        input.checked = value;
      }
    );

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
    return this.app.selectMap(
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
