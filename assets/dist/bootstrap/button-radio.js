System.register([], function (_export, _context) {
  "use strict";

  var ButtonRadio, defaultOptions;
  function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
  function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  _export("ButtonRadio", void 0);
  return {
    setters: [],
    execute: function () {
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
      _export("ButtonRadio", ButtonRadio = class ButtonRadio {
        static handle(el) {
          let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          return u.getBoundedInstance(el, 'button-radio', el => {
            return new this(el, options);
          });
        }
        constructor(selector, options) {
          _defineProperty(this, "wrapper", null);
          _defineProperty(this, "radios", []);
          _defineProperty(this, "inputs", []);
          _defineProperty(this, "buttons", []);
          _defineProperty(this, "colors", []);
          this.element = u.selectOne(selector);
          this.options = options = u.defaultsDeep({}, options, defaultOptions);
          let wrapper = null;

          // Turn radios into btn-group

          if (this.element.dataset.fieldInput != null) {
            wrapper = this.element;
          } else {
            wrapper = this.element.querySelector('[data-field-input]');
          }
          this.wrapper = wrapper;
          let inputGroup = wrapper.querySelector('.btn-group');
          const exists = inputGroup != null;
          if (!inputGroup) {
            inputGroup = u.h('div', {
              class: 'btn-group'
            });
          }
          this.radios = wrapper.querySelectorAll('.radio');
          this.radios.forEach(radio => {
            const button = this.prepareButton(radio, exists);
            if (!exists) {
              inputGroup.appendChild(button);
            }
          });
          this.syncState();
          wrapper.insertBefore(inputGroup, wrapper.firstChild);
          wrapper.dispatchEvent(new Event('button-radio.loaded'));

          // Make color elements unique
          this.colors = [...new Set(this.colors)];
        }
        prepareButton(radio) {
          let exists = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
          const options = this.options;
          const input = radio.querySelector('input');
          const label = radio.querySelector('label');
          let button = null;
          if (exists) {
            button = this.wrapper.querySelector(`[data-for="${input.id}"]`);
            button.classList.add(...this.parseClasses(`${options.buttonClass} ${options.color['default']}`));
          } else {
            button = u.h('button', {
              type: 'button',
              class: `${options.buttonClass} ${options.color['default']}`,
              'data-value': input.value
            }, `<span>${label.innerHTML}</span>`);
          }
          u.$helper.set(button, '__unicorn.input', input);
          this.inputs.push(input);
          this.buttons.push(button);
          radio.style.display = 'none';

          // Prepare color schema
          let color = input.dataset.colorClass;
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
          if (input.disabled || input.getAttribute('readonly') != null) {
            button.classList.add('disabled');
            button.disabled = true;
          }
          if (input.getAttribute('readonly') != null) {
            button.classList.add('readonly');
          }

          // Bind event
          button.addEventListener('click', () => {
            if (input.getAttribute('disabled') || input.getAttribute('readonly')) {
              return;
            }
            const changed = !input.checked;
            if (changed) {
              this.inputs.forEach(ele => {
                ele.checked = false;
              });
              input.checked = true;
              input.dispatchEvent(new Event('change'));
              input.dispatchEvent(new Event('input'));
            }
          });
          input.addEventListener('change', () => {
            this.syncState();
          });
          return button;
        }
        syncState() {
          const options = this.options;
          this.buttons.forEach(button => {
            const input = u.$helper.get(button, '__unicorn.input');
            button.classList.add(...this.parseClasses(options.color.default));
            button.classList.remove(...this.parseClasses(options.activeClass));
            button.classList.remove(...this.parseClasses(...this.colors));
            if (input.checked) {
              button.classList.add(...this.parseClasses(options.activeClass));
              button.classList.add(...this.parseClasses(input.dataset.colorClass));
              button.classList.remove(...this.parseClasses(options.color.default));
            }
          });
        }
        parseClasses() {
          for (var _len = arguments.length, className = new Array(_len), _key = 0; _key < _len; _key++) {
            className[_key] = arguments[_key];
          }
          className = className.join(' ');
          return className.split(' ').filter(t => t !== '');
        }
      });
    }
  };
});
//# sourceMappingURL=button-radio.js.map
