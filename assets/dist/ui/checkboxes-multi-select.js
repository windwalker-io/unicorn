System.register([], function (_export, _context) {
  "use strict";

  var CheckboxesMultiSelect;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  return {
    setters: [],
    execute: function () {
      /**
       * Part of unicorn project.
       *
       * @copyright  Copyright (C) 2021 __ORGANIZATION__.
       * @license    __LICENSE__
       */
      _export("CheckboxesMultiSelect", CheckboxesMultiSelect = /*#__PURE__*/function () {
        function CheckboxesMultiSelect(selector) {
          var _this = this;

          var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

          _classCallCheck(this, CheckboxesMultiSelect);

          _defineProperty(this, "defaultOptions", {
            duration: 100,
            inputSelector: 'input[type=checkbox][data-role=grid-checkbox]'
          });

          this.$element = u.selectOne(selector);
          this.options = Object.assign({}, this.defaultOptions, options);
          this.boxes = this.$element.querySelectorAll(this.options.inputSelector);
          this.last = false;
          u.selectAll(this.boxes, function (box) {
            box.addEventListener('click', function (e) {
              _this.select(box, e);
            });
          });
        }

        _createClass(CheckboxesMultiSelect, [{
          key: "select",
          value: function select(box, event) {
            var _this2 = this;

            if (!this.last) {
              this.last = box;
              return;
            }

            if (event.shiftKey) {
              var start = [].indexOf.call(this.boxes, box);
              var end = [].indexOf.call(this.boxes, this.last);
              var chs = [].slice.call(this.boxes, Math.min(start, end), Math.max(start, end) + 1);
              [].forEach.call(chs, function (ele, i) {
                ele.checked = _this2.last.checked;
              });
            }

            this.last = box;
          }
        }], [{
          key: "handle",
          value: function handle(selector) {
            var _this3 = this;

            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            return u.selectAll(selector, function (ele) {
              return new _this3(ele, options);
            });
          }
        }]);

        return CheckboxesMultiSelect;
      }());
    }
  };
});
//# sourceMappingURL=checkboxes-multi-select.js.map
