/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

// TODO: This module not completed yet for 4.x
import { defaultsDeep } from 'lodash-es';

const nope = (value, ele, dep) => {
};

/**
 * Class init.
 * @param {jQuery}        $element
 * @param {jQuery|string} dependent
 * @param {Object}        options
 * @constructor
 */
export default class ListDependent {
  $xhr = null;

  static get defaultOptions() {
    return {
      ajax: {
        url: null,
        value_field: 'value'
      },
      source: null,
      text_field: 'title',
      value_field: 'id',
      first_option: null,
      default_value: null,
      initial_load: true,
      empty_mark: '__EMPTY__',
      hooks: {
        before_request: nope,
        after_request: nope
      }
    };
  }

  static select(element) {
    return typeof element === 'string' ? document.querySelector(element) : element;
  }

  constructor(element, dependent, options) {
    this.element = element;
    this.options = defaultsDeep({}, options, this.constructor.defaultOptions);
    this.dependent = this.constructor.select(dependent);

    this.bindEvents();

    if (this.options.initial_load) {
      this.changeList(this.dependent.val(), true);
    }
  }

  /**
   * Bind events.
   */
  bindEvents() {
    this.dependent.addEventListener('change', (event) => {
      this.changeList(this.constructor.select(event.currentTarget)?.value);
    });
  }

  /**
   * Update the list elements.
   *
   * @param {*}    value
   * @param {bool} initial
   */
  changeList(value, initial = null) {
    value = value || this.dependent.val();

    // Empty mark
    if (value === '') {
      value = this.options.empty_mark;
    }

    if (this.options.ajax.url) {
      this.ajaxUpdate(value);
    } else if (this.options.source) {
      this.sourceUpdate(value, initial);
    }
  }

  /**
   * Update list by source.
   *
   * @param {string} value
   * @param {bool}   initial
   */
  sourceUpdate(value, initial = null) {
    const source = this.options.source;

    this.beforeHook(value, this.element, this.dependent);

    if (source[value]) {
      this.updateListElements(source[value]);
    } else {
      this.updateListElements([]);

      if (!initial && value !== '' && parseInt(value) !== 0) {
        console.log('List for value: ' + value + ' not found.');
      }
    }

    this.afterHook(value, this.element, this.dependent);
  }

  /**
   * Do ajax.
   *
   * @param {string} value
   */
  ajaxUpdate(value) {
    const data = {};
    data[this.options.ajax.value_field] = value;

    this.beforeHook(value, this.element, this.dependent);

    if (this.$xhr) {
      this.$xhr.abort();
      this.$xhr = null;
    }

    this.$xhr = u.$http.get(this.options.ajax.url, data)
      .then((response) => {
        if (response.success) {
          this.updateListElements(response.data);
        } else {
          console.error(response.message);
        }
      }).fail(err => {
        console.error(err);
      }).always(() => {
        this.afterHook(value, this.element, this.dependent);
        this.$xhr = null;
      });
  }

  /**
   * Update list elements.
   *
   * @param {Array} items
   */
  updateListElements(items) {
    const self = this;
    const textField = this.options.text_field;
    const valueField = this.options.value_field;
    self.element.empty();

    if (this.options.first_option) {
      items.unshift({});
      items[0][textField] = this.options.first_option[textField];
      items[0][valueField] = this.options.first_option[valueField];
    }

    $.each(items, (i, item) => {
      if (Array.isArray(item)) {
        const group = $(`<optgroup label="${i}"></optgroup>`);

        $.each(item, (k, child) => {
          this.appendOptionTo({
            value: child[valueField],
            text: child[textField],
            attributes: child.attributes,
          }, group);
        })

        this.element.append(group);

        return;
      }

      this.appendOptionTo({
        value: item[valueField],
        text: item[textField],
        attributes: item.attributes,
      }, this.element);
    });

    this.element.trigger('chosen:updated');
    this.element.trigger('change');
  }

  appendOptionTo(item, parent) {
    const value = item.value;
    const option = $('<option>' + item.text + '</option>');
    option.attr('value', value);

    if (item.attributes) {
      $.each(item.attributes, (index, val) => {
        option.attr(index, val);
      });
    }

    if (this.isSelected(value)) {
      option.attr('selected', 'selected');
    }

    parent.append(option);
  }

  isSelected(value) {
    let defaultValues = '';

    // Convert all types to array
    if (Array.isArray(this.options.default_value)) {
      defaultValues = this.options.default_value;
    } else if (this.options.default_value && typeof this.options.default_value === 'object') {
      defaultValues = Object.keys(this.options.default_value);
    } else {
      defaultValues = [this.options.default_value];
    }

    return defaultValues.indexOf(value) !== -1;
  }

  /**
   * Before hook.
   *
   * @param {string} value
   * @param {jQuery} element
   * @param {jQuery} dependent
   * @returns {*}
   */
  beforeHook(value, element, dependent) {
    const before = this.options.hooks.before_request;

    return before.call(this, value, element, dependent);
  }

  /**
   * After hook.
   *
   * @param {string} value
   * @param {jQuery} element
   * @param {jQuery} dependent
   * @returns {*}
   */
  afterHook(value, element, dependent) {
    const after = this.options.hooks.after_request;

    return after.call(this, value, element, dependent);
  }
}
