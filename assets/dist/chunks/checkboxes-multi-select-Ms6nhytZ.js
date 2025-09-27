import { s as selectAll, a as selectOne } from "./unicorn-CR0afSsW.js";
class CheckboxesMultiSelect {
  defaultOptions = {
    duration: 100,
    inputSelector: "input[type=checkbox][data-role=grid-checkbox]"
  };
  $element;
  options;
  boxes;
  last = false;
  static handle(selector, options = {}) {
    return selectAll(selector, (ele) => new this(ele, options));
  }
  constructor(selector, options = {}) {
    this.$element = selectOne(selector);
    this.options = Object.assign({}, this.defaultOptions, options);
    this.boxes = Array.from(this.$element.querySelectorAll(this.options.inputSelector));
    this.last = false;
    selectAll(this.boxes, (box) => {
      box.addEventListener("click", (e) => {
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
export {
  CheckboxesMultiSelect
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tib3hlcy1tdWx0aS1zZWxlY3QtTXM2bmh5dFouanMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2R1bGUvY2hlY2tib3hlcy1tdWx0aS1zZWxlY3QudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgc2VsZWN0QWxsLCBzZWxlY3RPbmUgfSBmcm9tICcuLi9zZXJ2aWNlJztcblxuZXhwb3J0IGNsYXNzIENoZWNrYm94ZXNNdWx0aVNlbGVjdCB7XG4gIGRlZmF1bHRPcHRpb25zID0ge1xuICAgIGR1cmF0aW9uOiAxMDAsXG4gICAgaW5wdXRTZWxlY3RvcjogJ2lucHV0W3R5cGU9Y2hlY2tib3hdW2RhdGEtcm9sZT1ncmlkLWNoZWNrYm94XSdcbiAgfVxuXG4gICRlbGVtZW50OiBIVE1MRWxlbWVudDtcbiAgb3B0aW9uczogYW55O1xuICBib3hlczogSFRNTElucHV0RWxlbWVudFtdO1xuICBsYXN0OiBIVE1MSW5wdXRFbGVtZW50IHwgZmFsc2UgPSBmYWxzZTtcblxuICBzdGF0aWMgaGFuZGxlKHNlbGVjdG9yOiBhbnksIG9wdGlvbnM6IGFueSA9IHt9KSB7XG4gICAgcmV0dXJuIHNlbGVjdEFsbChzZWxlY3RvciwgKGVsZTogYW55KSA9PiBuZXcgdGhpcyhlbGUsIG9wdGlvbnMpKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHNlbGVjdG9yOiBhbnksIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuJGVsZW1lbnQgPSBzZWxlY3RPbmU8SFRNTEVsZW1lbnQ+KHNlbGVjdG9yKSE7XG4gICAgdGhpcy5vcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG4gICAgdGhpcy5ib3hlcyA9IEFycmF5LmZyb20odGhpcy4kZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMub3B0aW9ucy5pbnB1dFNlbGVjdG9yKSk7XG4gICAgdGhpcy5sYXN0ID0gZmFsc2U7XG5cbiAgICBzZWxlY3RBbGwodGhpcy5ib3hlcywgKGJveDogSFRNTElucHV0RWxlbWVudCkgPT4ge1xuICAgICAgYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy5zZWxlY3QoYm94LCBlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgc2VsZWN0KGJveDogSFRNTElucHV0RWxlbWVudCwgZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICBpZiAoIXRoaXMubGFzdCkge1xuICAgICAgdGhpcy5sYXN0ID0gYm94O1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBjb25zdCBzdGFydCA9IFtdLmluZGV4T2YuY2FsbCh0aGlzLmJveGVzLCBib3gpO1xuXG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBjb25zdCBlbmQgPSBbXS5pbmRleE9mLmNhbGwodGhpcy5ib3hlcywgdGhpcy5sYXN0KTtcblxuICAgICAgY29uc3QgY2hzID0gW10uc2xpY2UuY2FsbCh0aGlzLmJveGVzLCBNYXRoLm1pbihzdGFydCwgZW5kKSwgTWF0aC5tYXgoc3RhcnQsIGVuZCkgKyAxKTtcblxuICAgICAgW10uZm9yRWFjaC5jYWxsKGNocywgKGVsZTogSFRNTElucHV0RWxlbWVudCwgaSkgPT4ge1xuICAgICAgICBlbGUuY2hlY2tlZCA9ICh0aGlzLmxhc3QgYXMgSFRNTElucHV0RWxlbWVudCkuY2hlY2tlZDtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMubGFzdCA9IGJveDtcbiAgfVxufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFTyxNQUFNLHNCQUFzQjtBQUFBLEVBQ2pDLGlCQUFpQjtBQUFBLElBQ2YsVUFBVTtBQUFBLElBQ1YsZUFBZTtBQUFBLEVBQUE7QUFBQSxFQUdqQjtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQSxPQUFpQztBQUFBLEVBRWpDLE9BQU8sT0FBTyxVQUFlLFVBQWUsSUFBSTtBQUM5QyxXQUFPLFVBQVUsVUFBVSxDQUFDLFFBQWEsSUFBSSxLQUFLLEtBQUssT0FBTyxDQUFDO0FBQUEsRUFDakU7QUFBQSxFQUVBLFlBQVksVUFBZSxVQUFVLElBQUk7QUFDdkMsU0FBSyxXQUFXLFVBQXVCLFFBQVE7QUFDL0MsU0FBSyxVQUFVLE9BQU8sT0FBTyxDQUFBLEdBQUksS0FBSyxnQkFBZ0IsT0FBTztBQUM3RCxTQUFLLFFBQVEsTUFBTSxLQUFLLEtBQUssU0FBUyxpQkFBaUIsS0FBSyxRQUFRLGFBQWEsQ0FBQztBQUNsRixTQUFLLE9BQU87QUFFWixjQUFVLEtBQUssT0FBTyxDQUFDLFFBQTBCO0FBQy9DLFVBQUksaUJBQWlCLFNBQVMsQ0FBQyxNQUFrQjtBQUMvQyxhQUFLLE9BQU8sS0FBSyxDQUFDO0FBQUEsTUFDcEIsQ0FBQztBQUFBLElBQ0gsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUVBLE9BQU8sS0FBdUIsT0FBbUI7QUFDL0MsUUFBSSxDQUFDLEtBQUssTUFBTTtBQUNkLFdBQUssT0FBTztBQUVaO0FBQUEsSUFDRjtBQUVBLFFBQUksTUFBTSxVQUFVO0FBRWxCLFlBQU0sUUFBUSxDQUFBLEVBQUcsUUFBUSxLQUFLLEtBQUssT0FBTyxHQUFHO0FBRzdDLFlBQU0sTUFBTSxDQUFBLEVBQUcsUUFBUSxLQUFLLEtBQUssT0FBTyxLQUFLLElBQUk7QUFFakQsWUFBTSxNQUFNLENBQUEsRUFBRyxNQUFNLEtBQUssS0FBSyxPQUFPLEtBQUssSUFBSSxPQUFPLEdBQUcsR0FBRyxLQUFLLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQztBQUVwRixPQUFBLEVBQUcsUUFBUSxLQUFLLEtBQUssQ0FBQyxLQUF1QixNQUFNO0FBQ2pELFlBQUksVUFBVyxLQUFLLEtBQTBCO0FBQUEsTUFDaEQsQ0FBQztBQUFBLElBQ0g7QUFFQSxTQUFLLE9BQU87QUFBQSxFQUNkO0FBQ0Y7In0=
