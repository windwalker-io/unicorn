export class CheckboxesMultiSelect {
  defaultOptions = {
    duration: 100,
    inputSelector: 'input[type=checkbox][data-role=grid-checkbox]'
  }

  static handle(selector, options = {}) {
    return u.selectAll(selector, (ele) => {
      return new this(ele, options);
    });
  }

  constructor(selector, options = {}) {
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
      const start = [].indexOf.call(this.boxes, box);
      const end = [].indexOf.call(this.boxes, this.last);

      const chs = [].slice.call(this.boxes, Math.min(start, end), Math.max(start, end) + 1);

      [].forEach.call(chs, (ele, i) => {
        ele.checked = this.last.checked;
      });
    }

    this.last = box;
  }
}
