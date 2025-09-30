import { e as fadeIn, f as fadeOut } from "../service/ui.js";
import { i as difference } from "../composable/useQueue.js";
import { u as useUniDirective } from "../composable/useUniDirective.js";
import { m as module, s as selectOne, a as selectAll } from "../service/dom.js";
class ShowOn {
  el;
  input;
  conditions = {};
  targets = {};
  readonly = false;
  initialDisplay;
  constructor(el, conditions) {
    this.el = el;
    this.input = this.el.querySelector(
      this.el.dataset.inputSelector || "[data-field-input]"
    );
    this.conditions = conditions;
    this.init();
  }
  init() {
    this.initialDisplay = window.getComputedStyle(this.el).display || "block";
    for (const selector in this.conditions) {
      const value = this.conditions[selector];
      const target = selectOne(selector);
      if (this.input) {
        this.readonly = this.input.hasAttribute("readonly");
      }
      let listenTarget;
      if (target.nodeName === "DIV") {
        listenTarget = Array.from(target.querySelectorAll("input, select, textarea"));
      } else {
        listenTarget = [target];
      }
      selectAll(listenTarget, (ele) => {
        ele.addEventListener("change", () => {
          this.updateShowState(target, value);
        });
      });
      this.updateShowState(target, value, 1);
    }
  }
  updateShowState(target, value, duration = 300) {
    const matched = this.isValueMatched(target, value);
    if (matched) {
      setTimeout(() => {
        fadeIn(this.el, duration, this.initialDisplay);
      }, duration + 30);
    } else {
      fadeOut(this.el, duration);
    }
    if (this.input) {
      if (matched) {
        this.input.removeAttribute("readonly");
      } else {
        this.input.setAttribute("readonly", "readonly");
      }
    }
  }
  isValueMatched(target, value) {
    let targetValue = null;
    const type = this.nodeType(target);
    switch (type) {
      case "input":
      case "textarea":
        targetValue = target.value;
        break;
      case "select":
        if (!target.multiple) {
          targetValue = target.value;
        } else {
          targetValue = selectAll(target.querySelectorAll("option")).filter((option) => option.selected).map((option) => option.value);
        }
        break;
      case "checkbox":
        targetValue = target.checked ? target.value : null;
        break;
      case "radio":
        targetValue = target.querySelector("input[type=radio]:checked")?.value;
        break;
    }
    if (Array.isArray(value)) {
      if (Array.isArray(targetValue)) {
        return difference(value, targetValue).length === 0;
      }
      return value.indexOf(targetValue) !== -1;
    }
    if (targetValue && Array.isArray(targetValue)) {
      return targetValue.indexOf(value) !== -1;
    }
    return value == targetValue;
  }
  /**
   * @see https://github.com/nickjackson/val/blob/master/index.js#L55
   * @param el
   * @returns {string}
   */
  nodeType(el) {
    var node = el.nodeName.toLowerCase();
    var type = el.type;
    if (node === "select") {
      return "select";
    }
    if (node === "textarea") {
      return "textarea";
    }
    if (node === "input") {
      if (type === "checkbox") {
        return "checkbox";
      }
      return "input";
    }
    if (node === "div") {
      if (el.querySelector("input[type=radio]")) {
        return "radio";
      }
    }
    return "input";
  }
}
const ready = /* @__PURE__ */ useUniDirective("show-on", {
  mounted(el, { value }) {
    module(el, "show.on", (el2) => {
      return new ShowOn(el2, JSON.parse(value));
    });
  }
});
export {
  ShowOn,
  ready
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hvdy1vbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL21vZHVsZS9zaG93LW9uLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlxyXG5pbXBvcnQgeyB1c2VVbmlEaXJlY3RpdmUgfSBmcm9tICcuLi9jb21wb3NhYmxlJztcclxuaW1wb3J0IHsgZmFkZUluLCBmYWRlT3V0LCBzZWxlY3RBbGwsIHNlbGVjdE9uZSwgbW9kdWxlIH0gZnJvbSAnLi4vc2VydmljZSc7XHJcbmltcG9ydCB7IGRpZmZlcmVuY2UgfSBmcm9tICdsb2Rhc2gtZXMnO1xyXG5cclxudHlwZSBIVE1MSW5wdXRUeXBlcyA9IEhUTUxJbnB1dEVsZW1lbnQgfCBIVE1MU2VsZWN0RWxlbWVudCB8IEhUTUxUZXh0QXJlYUVsZW1lbnQ7XHJcbnR5cGUgQ29uZGl0aW9ucyA9IFJlY29yZDxzdHJpbmcsIGFueT47XHJcblxyXG5leHBvcnQgY2xhc3MgU2hvd09uIHtcclxuICBlbCE6IEhUTUxFbGVtZW50O1xyXG4gIGlucHV0ITogSFRNTElucHV0VHlwZXM7XHJcbiAgY29uZGl0aW9uczogQ29uZGl0aW9ucyA9IHt9O1xyXG4gIHRhcmdldHMgPSB7fTtcclxuICByZWFkb25seSA9IGZhbHNlO1xyXG4gIGluaXRpYWxEaXNwbGF5ITogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3RvcihlbDogSFRNTEVsZW1lbnQsIGNvbmRpdGlvbnM6IENvbmRpdGlvbnMpIHtcclxuICAgIHRoaXMuZWwgPSBlbDtcclxuICAgIHRoaXMuaW5wdXQgPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3I8SFRNTElucHV0VHlwZXM+KFxyXG4gICAgICB0aGlzLmVsLmRhdGFzZXQuaW5wdXRTZWxlY3RvciB8fCAnW2RhdGEtZmllbGQtaW5wdXRdJ1xyXG4gICAgKSE7XHJcbiAgICB0aGlzLmNvbmRpdGlvbnMgPSBjb25kaXRpb25zO1xyXG5cclxuICAgIHRoaXMuaW5pdCgpO1xyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIHRoaXMuaW5pdGlhbERpc3BsYXkgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVsKS5kaXNwbGF5IHx8ICdibG9jayc7XHJcblxyXG4gICAgZm9yIChjb25zdCBzZWxlY3RvciBpbiB0aGlzLmNvbmRpdGlvbnMpIHtcclxuICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmNvbmRpdGlvbnNbc2VsZWN0b3JdO1xyXG5cclxuICAgICAgY29uc3QgdGFyZ2V0ID0gc2VsZWN0T25lPEhUTUxFbGVtZW50PihzZWxlY3RvcikhO1xyXG5cclxuICAgICAgaWYgKHRoaXMuaW5wdXQpIHtcclxuICAgICAgICB0aGlzLnJlYWRvbmx5ID0gdGhpcy5pbnB1dC5oYXNBdHRyaWJ1dGUoJ3JlYWRvbmx5Jyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBsaXN0ZW5UYXJnZXQ6IEhUTUxJbnB1dFR5cGVzW107XHJcblxyXG4gICAgICBpZiAodGFyZ2V0Lm5vZGVOYW1lID09PSAnRElWJykge1xyXG4gICAgICAgIGxpc3RlblRhcmdldCA9IEFycmF5LmZyb20odGFyZ2V0LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTElucHV0VHlwZXM+KCdpbnB1dCwgc2VsZWN0LCB0ZXh0YXJlYScpKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsaXN0ZW5UYXJnZXQgPSBbdGFyZ2V0IGFzIEhUTUxJbnB1dFR5cGVzXTtcclxuICAgICAgfVxyXG5cclxuICAgICAgc2VsZWN0QWxsKGxpc3RlblRhcmdldCwgKGVsZSkgPT4ge1xyXG4gICAgICAgIGVsZS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnVwZGF0ZVNob3dTdGF0ZSh0YXJnZXQsIHZhbHVlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLnVwZGF0ZVNob3dTdGF0ZSh0YXJnZXQsIHZhbHVlLCAxKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHVwZGF0ZVNob3dTdGF0ZSh0YXJnZXQ6IEhUTUxFbGVtZW50LCB2YWx1ZTogYW55LCBkdXJhdGlvbiA9IDMwMCkge1xyXG4gICAgY29uc3QgbWF0Y2hlZCA9IHRoaXMuaXNWYWx1ZU1hdGNoZWQodGFyZ2V0LCB2YWx1ZSk7XHJcblxyXG4gICAgaWYgKG1hdGNoZWQpIHtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgZmFkZUluKHRoaXMuZWwsIGR1cmF0aW9uLCB0aGlzLmluaXRpYWxEaXNwbGF5KTtcclxuICAgICAgfSwgZHVyYXRpb24gKyAzMCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBmYWRlT3V0KHRoaXMuZWwsIGR1cmF0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5pbnB1dCkge1xyXG4gICAgICBpZiAobWF0Y2hlZCkge1xyXG4gICAgICAgIHRoaXMuaW5wdXQucmVtb3ZlQXR0cmlidXRlKCdyZWFkb25seScpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuaW5wdXQuc2V0QXR0cmlidXRlKCdyZWFkb25seScsICdyZWFkb25seScpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpc1ZhbHVlTWF0Y2hlZCh0YXJnZXQ6IEhUTUxFbGVtZW50LCB2YWx1ZTogYW55KSB7XHJcbiAgICBsZXQgdGFyZ2V0VmFsdWU6IGFueSA9IG51bGw7XHJcblxyXG4gICAgY29uc3QgdHlwZSA9IHRoaXMubm9kZVR5cGUodGFyZ2V0KTtcclxuXHJcbiAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgY2FzZSAnaW5wdXQnOlxyXG4gICAgICBjYXNlICd0ZXh0YXJlYSc6XHJcbiAgICAgICAgdGFyZ2V0VmFsdWUgPSAodGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdzZWxlY3QnOlxyXG4gICAgICAgIGlmICghKHRhcmdldCBhcyBIVE1MU2VsZWN0RWxlbWVudCkubXVsdGlwbGUpIHtcclxuICAgICAgICAgIHRhcmdldFZhbHVlID0gKHRhcmdldCBhcyBIVE1MU2VsZWN0RWxlbWVudCkudmFsdWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRhcmdldFZhbHVlID0gc2VsZWN0QWxsKHRhcmdldC5xdWVyeVNlbGVjdG9yQWxsKCdvcHRpb24nKSlcclxuICAgICAgICAgICAgLmZpbHRlcihvcHRpb24gPT4gb3B0aW9uLnNlbGVjdGVkKVxyXG4gICAgICAgICAgICAubWFwKG9wdGlvbiA9PiBvcHRpb24udmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIGNhc2UgJ2NoZWNrYm94JzpcclxuICAgICAgICB0YXJnZXRWYWx1ZSA9ICh0YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkuY2hlY2tlZCA/ICh0YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUgOiBudWxsO1xyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgY2FzZSAncmFkaW8nOlxyXG4gICAgICAgIHRhcmdldFZhbHVlID0gdGFyZ2V0LnF1ZXJ5U2VsZWN0b3I8SFRNTElucHV0RWxlbWVudD4oJ2lucHV0W3R5cGU9cmFkaW9dOmNoZWNrZWQnKT8udmFsdWU7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XHJcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHRhcmdldFZhbHVlKSkge1xyXG4gICAgICAgIHJldHVybiBkaWZmZXJlbmNlKHZhbHVlLCB0YXJnZXRWYWx1ZSkubGVuZ3RoID09PSAwO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdmFsdWUuaW5kZXhPZih0YXJnZXRWYWx1ZSkgIT09IC0xO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0YXJnZXRWYWx1ZSAmJiBBcnJheS5pc0FycmF5KHRhcmdldFZhbHVlKSkge1xyXG4gICAgICByZXR1cm4gdGFyZ2V0VmFsdWUuaW5kZXhPZih2YWx1ZSkgIT09IC0xO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB2YWx1ZSA9PSB0YXJnZXRWYWx1ZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL25pY2tqYWNrc29uL3ZhbC9ibG9iL21hc3Rlci9pbmRleC5qcyNMNTVcclxuICAgKiBAcGFyYW0gZWxcclxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxyXG4gICAqL1xyXG4gIG5vZGVUeXBlKGVsOiBIVE1MRWxlbWVudCk6IFwic2VsZWN0XCIgfCBcInRleHRhcmVhXCIgfCBcImNoZWNrYm94XCIgfCBcImlucHV0XCIgfCBcInJhZGlvXCIge1xyXG4gICAgdmFyIG5vZGUgPSBlbC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgdmFyIHR5cGUgPSAoZWwgYXMgSFRNTElucHV0RWxlbWVudCkudHlwZTtcclxuXHJcbiAgICBpZiAobm9kZSA9PT0gJ3NlbGVjdCcpIHtcclxuICAgICAgcmV0dXJuICdzZWxlY3QnO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChub2RlID09PSAndGV4dGFyZWEnKSB7XHJcbiAgICAgIHJldHVybiAndGV4dGFyZWEnO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChub2RlID09PSAnaW5wdXQnKSB7XHJcbiAgICAgIGlmICh0eXBlID09PSAnY2hlY2tib3gnKSB7XHJcbiAgICAgICAgcmV0dXJuICdjaGVja2JveCc7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiAnaW5wdXQnO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChub2RlID09PSAnZGl2Jykge1xyXG4gICAgICBpZiAoZWwucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1yYWRpb10nKSkge1xyXG4gICAgICAgIHJldHVybiAncmFkaW8nO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuICdpbnB1dCc7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgcmVhZHkgPSB1c2VVbmlEaXJlY3RpdmUoJ3Nob3ctb24nLCB7XHJcbiAgbW91bnRlZChlbCwgeyB2YWx1ZSB9KSB7XHJcbiAgICBtb2R1bGU8SFRNTEVsZW1lbnQsIEhUTUxFbGVtZW50PihlbCwgJ3Nob3cub24nLCAoZWwpID0+IHtcclxuICAgICAgcmV0dXJuIG5ldyBTaG93T24oZWwsIEpTT04ucGFyc2UodmFsdWUpKTtcclxuICAgIH0pO1xyXG4gIH1cclxufSk7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFNob3dPbk1vZHVsZSB7XHJcbiAgU2hvd09uOiB0eXBlb2YgU2hvd09uO1xyXG4gIHJlYWR5OiB0eXBlb2YgcmVhZHk7XHJcbn1cclxuIl0sIm5hbWVzIjpbImVsIl0sIm1hcHBpbmdzIjoiOzs7O0FBUU8sTUFBTSxPQUFPO0FBQUEsRUFDbEI7QUFBQSxFQUNBO0FBQUEsRUFDQSxhQUF5QixDQUFBO0FBQUEsRUFDekIsVUFBVSxDQUFBO0FBQUEsRUFDVixXQUFXO0FBQUEsRUFDWDtBQUFBLEVBRUEsWUFBWSxJQUFpQixZQUF3QjtBQUNuRCxTQUFLLEtBQUs7QUFDVixTQUFLLFFBQVEsS0FBSyxHQUFHO0FBQUEsTUFDbkIsS0FBSyxHQUFHLFFBQVEsaUJBQWlCO0FBQUEsSUFBQTtBQUVuQyxTQUFLLGFBQWE7QUFFbEIsU0FBSyxLQUFBO0FBQUEsRUFDUDtBQUFBLEVBRUEsT0FBTztBQUNMLFNBQUssaUJBQWlCLE9BQU8saUJBQWlCLEtBQUssRUFBRSxFQUFFLFdBQVc7QUFFbEUsZUFBVyxZQUFZLEtBQUssWUFBWTtBQUN0QyxZQUFNLFFBQVEsS0FBSyxXQUFXLFFBQVE7QUFFdEMsWUFBTSxTQUFTLFVBQXVCLFFBQVE7QUFFOUMsVUFBSSxLQUFLLE9BQU87QUFDZCxhQUFLLFdBQVcsS0FBSyxNQUFNLGFBQWEsVUFBVTtBQUFBLE1BQ3BEO0FBRUEsVUFBSTtBQUVKLFVBQUksT0FBTyxhQUFhLE9BQU87QUFDN0IsdUJBQWUsTUFBTSxLQUFLLE9BQU8saUJBQWlDLHlCQUF5QixDQUFDO0FB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
