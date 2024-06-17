// @ts-ignore
const u = window.u;

export class CheckboxesMultiSelect {
  defaultOptions = {
    duration: 100,
    inputSelector: 'input[type=checkbox][data-role=grid-checkbox]'
  }

  $element: HTMLElement;
  options: any;
  boxes: NodeListOf<HTMLInputElement>;
  last: HTMLInputElement | false = false;

  static handle(selector: any, options: any = {}) {
    return u.selectAll(selector, (ele) => {
      return new this(ele, options);
    });
  }

  constructor(selector: any, options = {}) {
    this.$element = u.selectOne<HTMLElement>(selector)!;
    this.options = Object.assign({}, this.defaultOptions, options);
    this.boxes = this.$element.querySelectorAll(this.options.inputSelector);
    this.last = false;

    u.selectAll(this.boxes, (box) => {
      box.addEventListener('click', (e) => {
        this.select(box, e);
      });
    });
  }

  select(box: HTMLInputElement, event: MouseEvent) {
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

      [].forEach.call(chs, (ele: HTMLInputElement, i) => {
        ele.checked = (this.last as HTMLInputElement).checked;
      });
    }

    this.last = box;
  }
}
