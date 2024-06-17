System.register([], function (exports_1, context_1) {
    "use strict";
    var u, CheckboxesMultiSelect;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            // @ts-ignore
            u = window.u;
            CheckboxesMultiSelect = class CheckboxesMultiSelect {
                static handle(selector, options = {}) {
                    return u.selectAll(selector, (ele) => {
                        return new this(ele, options);
                    });
                }
                constructor(selector, options = {}) {
                    Object.defineProperty(this, "defaultOptions", {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: {
                            duration: 100,
                            inputSelector: 'input[type=checkbox][data-role=grid-checkbox]'
                        }
                    });
                    Object.defineProperty(this, "$element", {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: void 0
                    });
                    Object.defineProperty(this, "options", {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: void 0
                    });
                    Object.defineProperty(this, "boxes", {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: void 0
                    });
                    Object.defineProperty(this, "last", {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: false
                    });
                    this.$element = u.selectOne(selector);
                    this.options = Object.assign({}, this.defaultOptions, options);
                    this.boxes = this.$element.querySelectorAll(this.options.inputSelector);
                    this.last = false;
                    u.selectAll(this.boxes, (box) => {
                        box.addEventListener('click', (e) => {
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
                        // @ts-ignore
                        const start = [].indexOf.call(this.boxes, box);
                        // @ts-ignore
                        const end = [].indexOf.call(this.boxes, this.last);
                        const chs = [].slice.call(this.boxes, Math.min(start, end), Math.max(start, end) + 1);
                        [].forEach.call(chs, (ele, i) => {
                            ele.checked = this.last.checked;
                        });
                    }
                    this.last = box;
                }
            };
            exports_1("CheckboxesMultiSelect", CheckboxesMultiSelect);
        }
    };
});

//# sourceMappingURL=checkboxes-multi-select.js.map
