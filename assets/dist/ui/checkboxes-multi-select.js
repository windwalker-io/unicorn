System.register([], function (_export, _context) {
  "use strict";

  var CheckboxesMultiSelect;
  function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
  function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  _export("CheckboxesMultiSelect", void 0);
  return {
    setters: [],
    execute: function () {
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
