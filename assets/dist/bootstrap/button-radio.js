System.register([], function (exports_1, context_1) {
    "use strict";
    var u, defaultOptions, ButtonRadio;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            // @ts-ignore
            u = window.u;
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
            ButtonRadio = class ButtonRadio {
                static handle(el, options = {}) {
                    return u.getBoundedInstance(el, 'button-radio', (el) => {
                        return new this(el, options);
                    });
                }
                constructor(selector, options = {}) {
                    Object.defineProperty(this, "wrapper", {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: void 0
                    });
                    Object.defineProperty(this, "element", {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: void 0
                    });
                    Object.defineProperty(this, "radios", {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: []
                    });
                    Object.defineProperty(this, "inputs", {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: []
                    });
                    Object.defineProperty(this, "buttons", {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: []
                    });
                    Object.defineProperty(this, "colors", {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: []
                    });
                    Object.defineProperty(this, "options", {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: {}
                    });
                    this.element = u.selectOne(selector);
                    this.options = options = u.defaultsDeep({}, options, defaultOptions);
                    let wrapper;
                    // Turn radios into btn-group
                    if (this.element.dataset.fieldInput != null) {
                        wrapper = this.element;
                    }
                    else {
                        wrapper = this.element.querySelector('[data-field-input]');
                    }
                    this.wrapper = wrapper;
                    let inputGroup = wrapper.querySelector('.btn-group');
                    const exists = inputGroup != null;
                    if (!inputGroup) {
                        inputGroup = u.h('div', { class: 'btn-group' });
                    }
                    this.radios = u.selectAll(wrapper.querySelectorAll('.radio'));
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
                    let button;
                    if (exists) {
                        button = this.wrapper.querySelector(`[data-for="${input.id}"]`);
                        button.classList.add(...this.parseClasses(`${options.buttonClass} ${options.color['default']}`));
                    }
                    else {
                        button = u.h('button', {
                            type: 'button',
                            class: `${options.buttonClass} ${options.color['default']}`,
                            'data-value': input.value,
                        }, `<span>${label.innerHTML}</span>`);
                    }
                    u.$helper.set(button, '__unicorn.input', input);
                    this.inputs.push(input);
                    this.buttons.push(button);
                    radio.style.display = 'none';
                    // Prepare color schema
                    let color = input.dataset.colorClass || '';
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
                    const classNameStr = className.join(' ');
                    return classNameStr.split(' ').filter(t => t !== '');
                }
            };
            exports_1("ButtonRadio", ButtonRadio);
        }
    };
});

//# sourceMappingURL=button-radio.js.map
