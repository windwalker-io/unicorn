System.register([], function (_export, _context) {
  "use strict";

  var defaultOptions, ButtonRadio;

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

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
      defaultOptions = {
        selector: '.btn-group .radio',
        buttonClass: 'btn',
        activeClass: 'active',
        color: {
          'default': 'btn-default btn-outline-secondary',
          green: 'btn-success',
          red: 'btn-danger',
          blue: 'btn-primary'
        }
      };

      _export("ButtonRadio", ButtonRadio = /*#__PURE__*/function () {
        function ButtonRadio(selector, options) {
          var _this = this;

          _classCallCheck(this, ButtonRadio);

          _defineProperty(this, "wrapper", null);

          _defineProperty(this, "radios", []);

          _defineProperty(this, "inputs", []);

          _defineProperty(this, "buttons", []);

          _defineProperty(this, "colors", []);

          this.element = u.selectOne(selector);
          this.options = options = u.defaultsDeep({}, options, defaultOptions);
          var wrapper = null; // Turn radios into btn-group

          if (this.element.dataset.fieldInput != null) {
            wrapper = this.element;
          } else {
            wrapper = this.element.querySelector('[data-field-input]');
          }

          this.wrapper = wrapper;
          var inputGroup = wrapper.querySelector('.btn-group');
          var exists = inputGroup != null;

          if (!inputGroup) {
            inputGroup = u.h('div', {
              "class": 'btn-group'
            });
          }

          this.radios = wrapper.querySelectorAll('.radio');
          this.radios.forEach(function (radio) {
            var button = _this.prepareButton(radio, exists);

            if (!exists) {
              inputGroup.appendChild(button);
            }
          });
          this.syncState();
          wrapper.insertBefore(inputGroup, wrapper.firstChild);
          wrapper.dispatchEvent(new Event('button-radio.loaded')); // Make color elements unique

          this.colors = _toConsumableArray(new Set(this.colors));
        }

        _createClass(ButtonRadio, [{
          key: "prepareButton",
          value: function prepareButton(radio) {
            var _this2 = this;

            var exists = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
            var options = this.options;
            var input = radio.querySelector('input');
            var label = radio.querySelector('label');
            var button = null;

            if (exists) {
              var _button$classList;

              button = this.wrapper.querySelector("[data-for=\"".concat(input.id, "\"]"));

              (_button$classList = button.classList).add.apply(_button$classList, _toConsumableArray(this.parseClasses("".concat(options.buttonClass, " ").concat(options.color['default']))));
            } else {
              button = u.h('button', {
                type: 'button',
                "class": "".concat(options.buttonClass, " ").concat(options.color['default']),
                'data-value': input.value
              }, "<span>".concat(label.innerHTML, "</span>"));
            }

            u.$helper.set(button, '__unicorn.input', input);
            this.inputs.push(input);
            this.buttons.push(button);
            radio.style.display = 'none'; // Prepare color schema

            var color = input.dataset.colorClass;

            if (color == null) {
              switch (input.value) {
                case '':
                  color = options.color.blue;
                  break;

                case '0':
                  color = options.color.red;
                  break;

                default:
                  color = options.color.green;
                  break;
              }

              input.dataset.colorClass = color;
            }

            this.colors.push(color);

            if (input.disabled) {
              button.classList.add('disabled');
            }

            if (input.getAttribute('readonly')) {
              button.classList.add('readonly');
            } // Bind event


            button.addEventListener('click', function () {
              if (input.getAttribute('disabled') || input.getAttribute('readonly')) {
                return;
              }

              var changed = !input.checked;

              if (changed) {
                _this2.inputs.forEach(function (ele) {
                  ele.checked = false;
                });

                input.checked = true;

                _this2.syncState();

                input.dispatchEvent(new Event('change'));
                input.dispatchEvent(new Event('input'));
              }
            });
            return button;
          }
        }, {
          key: "syncState",
          value: function syncState() {
            var _this3 = this;

            var options = this.options;
            this.buttons.forEach(function (button) {
              var _button$classList2, _button$classList3, _button$classList4;

              var input = u.$helper.get(button, '__unicorn.input');

              (_button$classList2 = button.classList).add.apply(_button$classList2, _toConsumableArray(_this3.parseClasses(options.color["default"])));

              (_button$classList3 = button.classList).remove.apply(_button$classList3, _toConsumableArray(_this3.parseClasses(options.activeClass)));

              (_button$classList4 = button.classList).remove.apply(_button$classList4, _toConsumableArray(_this3.parseClasses.apply(_this3, _toConsumableArray(_this3.colors))));

              if (input.checked) {
                var _button$classList5, _button$classList6, _button$classList7;

                (_button$classList5 = button.classList).add.apply(_button$classList5, _toConsumableArray(_this3.parseClasses(options.activeClass)));

                (_button$classList6 = button.classList).add.apply(_button$classList6, _toConsumableArray(_this3.parseClasses(input.dataset.colorClass)));

                (_button$classList7 = button.classList).remove.apply(_button$classList7, _toConsumableArray(_this3.parseClasses(options.color["default"])));
              }
            });
          }
        }, {
          key: "parseClasses",
          value: function parseClasses() {
            for (var _len = arguments.length, className = new Array(_len), _key = 0; _key < _len; _key++) {
              className[_key] = arguments[_key];
            }

            className = className.join(' ');
            return className.split(' ').filter(function (t) {
              return t !== '';
            });
          }
        }], [{
          key: "handle",
          value: function handle(el) {
            var _this4 = this;

            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            return u.getBoundedInstance(el, 'button-radio', function (el) {
              return new _this4(el, options);
            });
          }
        }]);

        return ButtonRadio;
      }());
    }
  };
});
//# sourceMappingURL=button-radio.js.map
