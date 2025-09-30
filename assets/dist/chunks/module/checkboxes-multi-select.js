import { a as selectAll, s as selectOne } from "../service/dom.js";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tib3hlcy1tdWx0aS1zZWxlY3QuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tb2R1bGUvY2hlY2tib3hlcy1tdWx0aS1zZWxlY3QudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgc2VsZWN0QWxsLCBzZWxlY3RPbmUgfSBmcm9tICcuLi9zZXJ2aWNlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBDaGVja2JveGVzTXVsdGlTZWxlY3Qge1xyXG4gIGRlZmF1bHRPcHRpb25zID0ge1xyXG4gICAgZHVyYXRpb246IDEwMCxcclxuICAgIGlucHV0U2VsZWN0b3I6ICdpbnB1dFt0eXBlPWNoZWNrYm94XVtkYXRhLXJvbGU9Z3JpZC1jaGVja2JveF0nXHJcbiAgfVxyXG5cclxuICAkZWxlbWVudDogSFRNTEVsZW1lbnQ7XHJcbiAgb3B0aW9uczogYW55O1xyXG4gIGJveGVzOiBIVE1MSW5wdXRFbGVtZW50W107XHJcbiAgbGFzdDogSFRNTElucHV0RWxlbWVudCB8IGZhbHNlID0gZmFsc2U7XHJcblxyXG4gIHN0YXRpYyBoYW5kbGUoc2VsZWN0b3I6IGFueSwgb3B0aW9uczogYW55ID0ge30pIHtcclxuICAgIHJldHVybiBzZWxlY3RBbGwoc2VsZWN0b3IsIChlbGU6IGFueSkgPT4gbmV3IHRoaXMoZWxlLCBvcHRpb25zKSk7XHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3RvcihzZWxlY3RvcjogYW55LCBvcHRpb25zID0ge30pIHtcclxuICAgIHRoaXMuJGVsZW1lbnQgPSBzZWxlY3RPbmU8SFRNTEVsZW1lbnQ+KHNlbGVjdG9yKSE7XHJcbiAgICB0aGlzLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcclxuICAgIHRoaXMuYm94ZXMgPSBBcnJheS5mcm9tKHRoaXMuJGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCh0aGlzLm9wdGlvbnMuaW5wdXRTZWxlY3RvcikpO1xyXG4gICAgdGhpcy5sYXN0ID0gZmFsc2U7XHJcblxyXG4gICAgc2VsZWN0QWxsKHRoaXMuYm94ZXMsIChib3g6IEhUTUxJbnB1dEVsZW1lbnQpID0+IHtcclxuICAgICAgYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGU6IE1vdXNlRXZlbnQpID0+IHtcclxuICAgICAgICB0aGlzLnNlbGVjdChib3gsIGUpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2VsZWN0KGJveDogSFRNTElucHV0RWxlbWVudCwgZXZlbnQ6IE1vdXNlRXZlbnQpIHtcclxuICAgIGlmICghdGhpcy5sYXN0KSB7XHJcbiAgICAgIHRoaXMubGFzdCA9IGJveDtcclxuXHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZXZlbnQuc2hpZnRLZXkpIHtcclxuICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICBjb25zdCBzdGFydCA9IFtdLmluZGV4T2YuY2FsbCh0aGlzLmJveGVzLCBib3gpO1xyXG5cclxuICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICBjb25zdCBlbmQgPSBbXS5pbmRleE9mLmNhbGwodGhpcy5ib3hlcywgdGhpcy5sYXN0KTtcclxuXHJcbiAgICAgIGNvbnN0IGNocyA9IFtdLnNsaWNlLmNhbGwodGhpcy5ib3hlcywgTWF0aC5taW4oc3RhcnQsIGVuZCksIE1hdGgubWF4KHN0YXJ0LCBlbmQpICsgMSk7XHJcblxyXG4gICAgICBbXS5mb3JFYWNoLmNhbGwoY2hzLCAoZWxlOiBIVE1MSW5wdXRFbGVtZW50LCBpKSA9PiB7XHJcbiAgICAgICAgZWxlLmNoZWNrZWQgPSAodGhpcy5sYXN0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmNoZWNrZWQ7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubGFzdCA9IGJveDtcclxuICB9XHJcbn1cclxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFTyxNQUFNLHNCQUFzQjtBQUFBLEVBQ2pDLGlCQUFpQjtBQUFBLElBQ2YsVUFBVTtBQUFBLElBQ1YsZUFBZTtBQUFBLEVBQUE7QUFBQSxFQUdqQjtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQSxPQUFpQztBQUFBLEVBRWpDLE9BQU8sT0FBTyxVQUFlLFVBQWUsSUFBSTtBQUM5QyxXQUFPLFVBQVUsVUFBVSxDQUFDLFFBQWEsSUFBSSxLQUFLLEtBQUssT0FBTyxDQUFDO0FBQUEsRUFDakU7QUFBQSxFQUVBLFlBQVksVUFBZSxVQUFVLElBQUk7QUFDdkMsU0FBSyxXQUFXLFVBQXVCLFFBQVE7QUFDL0MsU0FBSyxVQUFVLE9BQU8sT0FBTyxDQUFBLEdBQUksS0FBSyxnQkFBZ0IsT0FBTztBQUM3RCxTQUFLLFFBQVEsTUFBTSxLQUFLLEtBQUssU0FBUyxpQkFBaUIsS0FBSyxRQUFRLGFBQWEsQ0FBQztBQUNsRixTQUFLLE9BQU87QUFFWixjQUFVLEtBQUssT0FBTyxDQUFDLFFBQTBCO0FBQy9DLFVBQUksaUJBQWlCLFNBQVMsQ0FBQyxNQUFrQjtBQUMvQyxhQUFLLE9BQU8sS0FBSyxDQUFDO0FBQUEsTUFDcEIsQ0FBQztBQUFBLElBQ0gsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUVBLE9BQU8sS0FBdUIsT0FBbUI7QUFDL0MsUUFBSSxDQUFDLEtBQUssTUFBTTtBQUNkLFdBQUssT0FBTztBQUVaO0FBQUEsSUFDRjtBQUVBLFFBQUksTUFBTSxVQUFVO0FBRWxCLFlBQU0sUUFBUSxDQUFBLEVBQUcsUUFBUSxLQUFLLEtBQUssT0FBTyxHQUFHO0FBRzdDLFlBQU0sTUFBTSxDQUFBLEVBQUcsUUFBUSxLQUFLLEtBQUssT0FBTyxLQUFLLElBQUk7QUFFakQsWUFBTSxNQUFNLENBQUEsRUFBRyxNQUFNLEtBQUssS0FBSyxPQUFPLEtBQUssSUFBSSxPQUFPLEdBQUcsR0FBRyxLQUFLLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQztBQUVwRixPQUFBLEVBQUcsUUFBUSxLQUFLLEtBQUssQ0FBQyxLQUF1QixNQUFNO0FBQ2pELFlBQUksVUFBVyxLQUFLLEtBQTBCO0FBQUEsTUFDaEQsQ0FBQztBQUFBLElBQ0g7QUFFQSxTQUFLLE9BQU87QUFBQSxFQUNkO0FBQ0Y7In0=
