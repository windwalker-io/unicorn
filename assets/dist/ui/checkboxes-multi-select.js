System.register([], function (_export, _context) {
  "use strict";

  var CheckboxesMultiSelect;
  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
  _export("CheckboxesMultiSelect", void 0);
  return {
    setters: [],
    execute: function () {
      /**
       * Part of unicorn project.
       *
       * @copyright  Copyright (C) 2021 __ORGANIZATION__.
       * @license    __LICENSE__
       */
      _export("CheckboxesMultiSelect", CheckboxesMultiSelect = class CheckboxesMultiSelect {
        static handle(selector) {
          let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          return u.selectAll(selector, ele => {
            return new this(ele, options);
          });
        }
        constructor(selector) {
          let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          _defineProperty(this, "defaultOptions", {
            duration: 100,
            inputSelector: 'input[type=checkbox][data-role=grid-checkbox]'
          });
          this.$element = u.selectOne(selector);
          this.options = Object.assign({}, this.defaultOptions, options);
          this.boxes = this.$element.querySelectorAll(this.options.inputSelector);
          this.last = false;
          u.selectAll(this.boxes, box => {
            box.addEventListener('click', e => {
              this.select(box, e);
            });
          });
        }
        select(box, event) {
          if (!this.last) {
            this.last = box;
            return;
          }
          if (event.shiftKey) {
            const start = [].indexOf.call(this.boxes, box);
            const end = [].indexOf.call(this.boxes, this.last);
            const chs = [].slice.call(this.boxes, Math.min(start, end), Math.max(start, end) + 1);
            [].forEach.call(chs, (ele, i) => {
              ele.checked = this.last.checked;
            });
          }
          this.last = box;
        }
      });
    }
  };
});
//# sourceMappingURL=checkboxes-multi-select.js.map
