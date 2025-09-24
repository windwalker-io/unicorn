import { p as l, i as h } from "../chunks/unicorn-Dap6NpVD.js";
class d {
  defaultOptions = {
    duration: 100,
    inputSelector: "input[type=checkbox][data-role=grid-checkbox]"
  };
  $element;
  options;
  boxes;
  last = !1;
  static handle(t, s = {}) {
    return l(t, (e) => new this(e, s));
  }
  constructor(t, s = {}) {
    this.$element = h(t), this.options = Object.assign({}, this.defaultOptions, s), this.boxes = Array.from(this.$element.querySelectorAll(this.options.inputSelector)), this.last = !1, l(this.boxes, (e) => {
      e.addEventListener("click", (i) => {
        this.select(e, i);
      });
    });
  }
  select(t, s) {
    if (!this.last) {
      this.last = t;
      return;
    }
    if (s.shiftKey) {
      const e = [].indexOf.call(this.boxes, t), i = [].indexOf.call(this.boxes, this.last), c = [].slice.call(this.boxes, Math.min(e, i), Math.max(e, i) + 1);
      [].forEach.call(c, (a, n) => {
        a.checked = this.last.checked;
      });
    }
    this.last = t;
  }
}
export {
  d as CheckboxesMultiSelect
};
