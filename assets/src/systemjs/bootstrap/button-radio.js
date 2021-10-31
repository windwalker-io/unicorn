/**
 * Part of unicorn project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

const defaultOptions = {
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

export class ButtonRadio {
  wrapper = null;
  radios = [];
  inputs = [];
  buttons = [];
  colors = [];

  static handle(el, options = {}) {
    return u.getBoundedInstance(el, 'button-radio', (el) => {
      return new this(el, options);
    });
  }

  constructor(selector, options) {
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
      inputGroup = u.h('div', { class: 'btn-group' })
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

  prepareButton(radio, exists = false) {
    const options = this.options;

    const input = radio.querySelector('input');
    const label = radio.querySelector('label');

    let button = null;

    if (exists) {
      button = this.wrapper.querySelector(`[data-for="${input.id}"]`);
      button.classList.add(...this.parseClasses(`${options.buttonClass} ${options.color['default']}`));
    } else {
      button = u.h(
        'button',
        {
          type: 'button',
          class: `${options.buttonClass} ${options.color['default']}`,
          'data-value': input.value,
        },
        `<span>${label.innerHTML}</span>`
      );
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
        this.inputs.forEach((ele) => {
          ele.checked = false;
        });

        input.checked = true;

        this.syncState();

        input.dispatchEvent(new Event('change'));
        input.dispatchEvent(new Event('input'));
      }
    });

    return button;
  }

  syncState() {
    const options = this.options;

    this.buttons.forEach((button) => {
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

  parseClasses(...className) {
    className = className.join(' ');
    return className.split(' ').filter(t => t !== '');
  }
}
