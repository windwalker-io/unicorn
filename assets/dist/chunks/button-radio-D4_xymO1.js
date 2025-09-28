import { d as useUniDirective, A as getBoundedInstance, a as selectOne, m as mergeDeep, w as h, s as selectAll, l as data } from "./unicorn-D5cXQeSK.js";
const defaultOptions = {
  selector: ".btn-group .radio",
  buttonClass: "btn",
  activeClass: "active",
  color: {
    "default": "btn-default btn-outline-secondary",
    green: "btn-success",
    red: "btn-danger",
    blue: "btn-primary"
  }
};
class ButtonRadio {
  wrapper;
  element;
  radios = [];
  inputs = [];
  buttons = [];
  colors = [];
  options;
  static handle(el, options = {}) {
    return getBoundedInstance(el, "button-radio", (el2) => {
      return new this(el2, options);
    });
  }
  constructor(selector, options = {}) {
    this.element = selectOne(selector);
    this.options = mergeDeep({}, defaultOptions, options);
    let wrapper;
    if (this.element.dataset.fieldInput != null) {
      wrapper = this.element;
    } else {
      wrapper = this.element.querySelector("[data-field-input]");
    }
    this.wrapper = wrapper;
    let inputGroup = wrapper.querySelector(".btn-group");
    const exists = inputGroup != null;
    if (!inputGroup) {
      inputGroup = h("div", { class: "btn-group" });
    }
    this.radios = selectAll(wrapper.querySelectorAll(".radio"));
    this.radios.forEach((radio) => {
      const button = this.prepareButton(radio, exists);
      if (!exists) {
        inputGroup.appendChild(button);
      }
    });
    this.syncState();
    wrapper.insertBefore(inputGroup, wrapper.firstChild);
    wrapper.dispatchEvent(new Event("button-radio.loaded"));
    this.colors = [...new Set(this.colors)];
  }
  prepareButton(radio, exists = false) {
    const options = this.options;
    const input = radio.querySelector("input");
    const label = radio.querySelector("label");
    let button;
    if (exists) {
      button = this.wrapper.querySelector(`[data-for="${input.id}"]`);
      button.classList.add(...this.parseClasses(`${options.buttonClass} ${options.color["default"]}`));
    } else {
      button = h(
        "button",
        {
          type: "button",
          class: `${options.buttonClass} ${options.color["default"]}`,
          "data-value": input.value
        },
        `<span>${label.innerHTML}</span>`
      );
    }
    data(button, "input", input);
    this.inputs.push(input);
    this.buttons.push(button);
    radio.style.display = "none";
    let color = input.dataset.colorClass || "";
    if (!color) {
      switch (input.value) {
        case "":
          color = options.color.blue;
          break;
        case "0":
          color = options.color.red;
          break;
        default:
          color = options.color.green;
          break;
      }
      input.dataset.colorClass = color;
    }
    this.colors.push(color);
    if (input.disabled || input.getAttribute("readonly") != null) {
      button.classList.add("disabled");
      button.disabled = true;
    }
    if (input.getAttribute("readonly") != null) {
      button.classList.add("readonly");
    }
    button.addEventListener("click", () => {
      if (input.getAttribute("disabled") || input.getAttribute("readonly")) {
        return;
      }
      const changed = !input.checked;
      if (changed) {
        this.inputs.forEach((ele) => {
          ele.checked = false;
        });
        input.checked = true;
        input.dispatchEvent(new Event("change"));
        input.dispatchEvent(new Event("input"));
      }
    });
    input.addEventListener("change", () => {
      this.syncState();
    });
    return button;
  }
  syncState() {
    const options = this.options;
    this.buttons.forEach((button) => {
      const input = data(button, "input");
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
    const classNameStr = className.join(" ");
    return classNameStr.split(" ").filter((t) => t !== "");
  }
}
const ready = /* @__PURE__ */ useUniDirective("button-radio", {
  mounted(el, { value }) {
    JSON.parse(value || "{}");
    ButtonRadio.handle(el, value || {});
  }
});
export {
  ButtonRadio,
  ready
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLXJhZGlvLUQ0X3h5bU8xLmpzIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYm9vdHN0cmFwL2J1dHRvbi1yYWRpby50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1c2VVbmlEaXJlY3RpdmUgfSBmcm9tICcuLi9jb21wb3NhYmxlJztcbmltcG9ydCB7IGRhdGEgfSBmcm9tICcuLi9kYXRhJztcbmltcG9ydCB7IGdldEJvdW5kZWRJbnN0YW5jZSwgaCwgc2VsZWN0QWxsLCBzZWxlY3RPbmUgfSBmcm9tICcuLi9zZXJ2aWNlJztcbmltcG9ydCB7IG1lcmdlRGVlcCB9IGZyb20gJy4uL3V0aWxpdGllcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQnV0dG9uUmFkaW9PcHRpb25zIHtcbiAgc2VsZWN0b3I/OiBzdHJpbmc7XG4gIGJ1dHRvbkNsYXNzPzogc3RyaW5nO1xuICBhY3RpdmVDbGFzcz86IHN0cmluZztcbiAgY29sb3I/OiB7XG4gICAgJ2RlZmF1bHQnPzogc3RyaW5nO1xuICAgIGdyZWVuPzogc3RyaW5nO1xuICAgIHJlZD86IHN0cmluZztcbiAgICBibHVlPzogc3RyaW5nO1xuICB9O1xufVxuXG5jb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgc2VsZWN0b3I6ICcuYnRuLWdyb3VwIC5yYWRpbycsXG4gIGJ1dHRvbkNsYXNzOiAnYnRuJyxcbiAgYWN0aXZlQ2xhc3M6ICdhY3RpdmUnLFxuICBjb2xvcjoge1xuICAgICdkZWZhdWx0JzogJ2J0bi1kZWZhdWx0IGJ0bi1vdXRsaW5lLXNlY29uZGFyeScsXG4gICAgZ3JlZW46ICdidG4tc3VjY2VzcycsXG4gICAgcmVkOiAnYnRuLWRhbmdlcicsXG4gICAgYmx1ZTogJ2J0bi1wcmltYXJ5J1xuICB9XG59O1xuXG5leHBvcnQgY2xhc3MgQnV0dG9uUmFkaW8ge1xuICB3cmFwcGVyOiBIVE1MRWxlbWVudDtcbiAgZWxlbWVudDogSFRNTEVsZW1lbnQ7XG4gIHJhZGlvczogSFRNTElucHV0RWxlbWVudFtdID0gW107XG4gIGlucHV0czogSFRNTElucHV0RWxlbWVudFtdID0gW107XG4gIGJ1dHRvbnM6IEhUTUxCdXR0b25FbGVtZW50W10gPSBbXTtcbiAgY29sb3JzOiBzdHJpbmdbXSA9IFtdO1xuICBvcHRpb25zOiBCdXR0b25SYWRpb09wdGlvbnM7XG5cbiAgc3RhdGljIGhhbmRsZShlbDogSFRNTEVsZW1lbnQgfCBzdHJpbmcsIG9wdGlvbnM6IEJ1dHRvblJhZGlvT3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIGdldEJvdW5kZWRJbnN0YW5jZShlbCwgJ2J1dHRvbi1yYWRpbycsIChlbDogSFRNTEVsZW1lbnQpID0+IHtcbiAgICAgIHJldHVybiBuZXcgdGhpcyhlbCwgb3B0aW9ucyk7XG4gICAgfSk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihzZWxlY3RvcjogSFRNTEVsZW1lbnQgfCBzdHJpbmcsIG9wdGlvbnM6IEJ1dHRvblJhZGlvT3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5lbGVtZW50ID0gc2VsZWN0T25lKHNlbGVjdG9yKTtcbiAgICB0aGlzLm9wdGlvbnMgPSBtZXJnZURlZXAoe30sIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICBsZXQgd3JhcHBlcjogSFRNTEVsZW1lbnQ7XG5cbiAgICAvLyBUdXJuIHJhZGlvcyBpbnRvIGJ0bi1ncm91cFxuXG4gICAgaWYgKHRoaXMuZWxlbWVudC5kYXRhc2V0LmZpZWxkSW5wdXQgIT0gbnVsbCkge1xuICAgICAgd3JhcHBlciA9IHRoaXMuZWxlbWVudDtcbiAgICB9IGVsc2Uge1xuICAgICAgd3JhcHBlciA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1maWVsZC1pbnB1dF0nKSE7XG4gICAgfVxuXG4gICAgdGhpcy53cmFwcGVyID0gd3JhcHBlcjtcbiAgICBsZXQgaW5wdXRHcm91cCA9IHdyYXBwZXIucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJy5idG4tZ3JvdXAnKSE7XG4gICAgY29uc3QgZXhpc3RzID0gaW5wdXRHcm91cCAhPSBudWxsO1xuXG4gICAgaWYgKCFpbnB1dEdyb3VwKSB7XG4gICAgICBpbnB1dEdyb3VwID0gaCgnZGl2JywgeyBjbGFzczogJ2J0bi1ncm91cCcgfSlcbiAgICB9XG5cbiAgICB0aGlzLnJhZGlvcyA9IHNlbGVjdEFsbCh3cmFwcGVyLnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTElucHV0RWxlbWVudD4oJy5yYWRpbycpKTtcblxuICAgIHRoaXMucmFkaW9zLmZvckVhY2gocmFkaW8gPT4ge1xuICAgICAgY29uc3QgYnV0dG9uID0gdGhpcy5wcmVwYXJlQnV0dG9uKHJhZGlvLCBleGlzdHMpO1xuXG4gICAgICBpZiAoIWV4aXN0cykge1xuICAgICAgICBpbnB1dEdyb3VwLmFwcGVuZENoaWxkKGJ1dHRvbik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLnN5bmNTdGF0ZSgpO1xuXG4gICAgd3JhcHBlci5pbnNlcnRCZWZvcmUoaW5wdXRHcm91cCwgd3JhcHBlci5maXJzdENoaWxkKTtcblxuICAgIHdyYXBwZXIuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2J1dHRvbi1yYWRpby5sb2FkZWQnKSk7XG5cbiAgICAvLyBNYWtlIGNvbG9yIGVsZW1lbnRzIHVuaXF1ZVxuICAgIHRoaXMuY29sb3JzID0gWy4uLm5ldyBTZXQodGhpcy5jb2xvcnMpXTtcbiAgfVxuXG4gIHByZXBhcmVCdXR0b24ocmFkaW86IEhUTUxJbnB1dEVsZW1lbnQsIGV4aXN0cyA9IGZhbHNlKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblxuICAgIGNvbnN0IGlucHV0ID0gcmFkaW8ucXVlcnlTZWxlY3RvcignaW5wdXQnKSE7XG4gICAgY29uc3QgbGFiZWwgPSByYWRpby5xdWVyeVNlbGVjdG9yKCdsYWJlbCcpITtcblxuICAgIGxldCBidXR0b246IEhUTUxCdXR0b25FbGVtZW50O1xuXG4gICAgaWYgKGV4aXN0cykge1xuICAgICAgYnV0dG9uID0gdGhpcy53cmFwcGVyLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWZvcj1cIiR7aW5wdXQuaWR9XCJdYCkhO1xuICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoLi4udGhpcy5wYXJzZUNsYXNzZXMoYCR7b3B0aW9ucy5idXR0b25DbGFzc30gJHtvcHRpb25zLmNvbG9yWydkZWZhdWx0J119YCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBidXR0b24gPSBoKFxuICAgICAgICAnYnV0dG9uJyxcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6ICdidXR0b24nLFxuICAgICAgICAgIGNsYXNzOiBgJHtvcHRpb25zLmJ1dHRvbkNsYXNzfSAke29wdGlvbnMuY29sb3JbJ2RlZmF1bHQnXX1gLFxuICAgICAgICAgICdkYXRhLXZhbHVlJzogaW5wdXQudmFsdWUsXG4gICAgICAgIH0sXG4gICAgICAgIGA8c3Bhbj4ke2xhYmVsLmlubmVySFRNTH08L3NwYW4+YFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBkYXRhKGJ1dHRvbiwgJ2lucHV0JywgaW5wdXQpO1xuICAgIHRoaXMuaW5wdXRzLnB1c2goaW5wdXQpO1xuICAgIHRoaXMuYnV0dG9ucy5wdXNoKGJ1dHRvbik7XG5cbiAgICByYWRpby5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXG4gICAgLy8gUHJlcGFyZSBjb2xvciBzY2hlbWFcbiAgICBsZXQgY29sb3IgPSBpbnB1dC5kYXRhc2V0LmNvbG9yQ2xhc3MgfHwgJyc7XG5cbiAgICBpZiAoIWNvbG9yKSB7XG4gICAgICBzd2l0Y2ggKGlucHV0LnZhbHVlKSB7XG4gICAgICAgIGNhc2UgJyc6XG4gICAgICAgICAgY29sb3IgPSBvcHRpb25zLmNvbG9yLmJsdWU7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnMCc6XG4gICAgICAgICAgY29sb3IgPSBvcHRpb25zLmNvbG9yLnJlZDtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGNvbG9yID0gb3B0aW9ucy5jb2xvci5ncmVlbjtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgaW5wdXQuZGF0YXNldC5jb2xvckNsYXNzID0gY29sb3I7XG4gICAgfVxuICAgIFxuICAgIHRoaXMuY29sb3JzLnB1c2goY29sb3IpO1xuXG4gICAgaWYgKGlucHV0LmRpc2FibGVkIHx8IGlucHV0LmdldEF0dHJpYnV0ZSgncmVhZG9ubHknKSAhPSBudWxsKSB7XG4gICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnZGlzYWJsZWQnKTtcbiAgICAgIGJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGlucHV0LmdldEF0dHJpYnV0ZSgncmVhZG9ubHknKSAhPSBudWxsKSB7XG4gICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgncmVhZG9ubHknKTtcbiAgICB9XG5cbiAgICAvLyBCaW5kIGV2ZW50XG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgaWYgKGlucHV0LmdldEF0dHJpYnV0ZSgnZGlzYWJsZWQnKSB8fCBpbnB1dC5nZXRBdHRyaWJ1dGUoJ3JlYWRvbmx5JykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjaGFuZ2VkID0gIWlucHV0LmNoZWNrZWQ7XG5cbiAgICAgIGlmIChjaGFuZ2VkKSB7XG4gICAgICAgIHRoaXMuaW5wdXRzLmZvckVhY2goKGVsZSkgPT4ge1xuICAgICAgICAgIGVsZS5jaGVja2VkID0gZmFsc2U7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlucHV0LmNoZWNrZWQgPSB0cnVlO1xuXG4gICAgICAgIGlucHV0LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdjaGFuZ2UnKSk7XG4gICAgICAgIGlucHV0LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdpbnB1dCcpKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsICgpID0+IHtcbiAgICAgIHRoaXMuc3luY1N0YXRlKCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gYnV0dG9uO1xuICB9XG5cbiAgc3luY1N0YXRlKCkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG5cbiAgICB0aGlzLmJ1dHRvbnMuZm9yRWFjaCgoYnV0dG9uKSA9PiB7XG4gICAgICBjb25zdCBpbnB1dDogSFRNTElucHV0RWxlbWVudCA9IGRhdGEoYnV0dG9uLCAnaW5wdXQnKTtcblxuICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoLi4udGhpcy5wYXJzZUNsYXNzZXMob3B0aW9ucy5jb2xvci5kZWZhdWx0KSk7XG4gICAgICBidXR0b24uY2xhc3NMaXN0LnJlbW92ZSguLi50aGlzLnBhcnNlQ2xhc3NlcyhvcHRpb25zLmFjdGl2ZUNsYXNzKSk7XG4gICAgICBidXR0b24uY2xhc3NMaXN0LnJlbW92ZSguLi50aGlzLnBhcnNlQ2xhc3NlcyguLi50aGlzLmNvbG9ycykpO1xuXG4gICAgICBpZiAoaW5wdXQuY2hlY2tlZCkge1xuICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCguLi50aGlzLnBhcnNlQ2xhc3NlcyhvcHRpb25zLmFjdGl2ZUNsYXNzKSk7XG4gICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKC4uLnRoaXMucGFyc2VDbGFzc2VzKGlucHV0LmRhdGFzZXQuY29sb3JDbGFzcykpO1xuICAgICAgICBidXR0b24uY2xhc3NMaXN0LnJlbW92ZSguLi50aGlzLnBhcnNlQ2xhc3NlcyhvcHRpb25zLmNvbG9yLmRlZmF1bHQpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHBhcnNlQ2xhc3NlcyguLi5jbGFzc05hbWU6IHN0cmluZ1tdKSB7XG4gICAgY29uc3QgY2xhc3NOYW1lU3RyID0gY2xhc3NOYW1lLmpvaW4oJyAnKTtcbiAgICByZXR1cm4gY2xhc3NOYW1lU3RyLnNwbGl0KCcgJykuZmlsdGVyKHQgPT4gdCAhPT0gJycpO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCByZWFkeSA9IHVzZVVuaURpcmVjdGl2ZSgnYnV0dG9uLXJhZGlvJywge1xuICBtb3VudGVkKGVsLCB7IHZhbHVlIH0pIHtcbiAgICBjb25zdCBvcHRpb25zOiBCdXR0b25SYWRpb09wdGlvbnMgPSBKU09OLnBhcnNlKHZhbHVlIHx8ICd7fScpO1xuICAgIEJ1dHRvblJhZGlvLmhhbmRsZShlbCwgdmFsdWUgfHwge30pO1xuICB9XG59KTtcblxuZXhwb3J0IGludGVyZmFjZSBCdXR0b25SYWRpb01vZHVsZSB7XG4gIEJ1dHRvblJhZGlvOiB0eXBlb2YgQnV0dG9uUmFkaW87XG4gIHJlYWR5OiB0eXBlb2YgcmVhZHk7XG59XG4iXSwibmFtZXMiOlsiZWwiXSwibWFwcGluZ3MiOiI7QUFpQkEsTUFBTSxpQkFBaUI7QUFBQSxFQUNyQixVQUFVO0FBQUEsRUFDVixhQUFhO0FBQUEsRUFDYixhQUFhO0FBQUEsRUFDYixPQUFPO0FBQUEsSUFDTCxXQUFXO0FBQUEsSUFDWCxPQUFPO0FBQUEsSUFDUCxLQUFLO0FBQUEsSUFDTCxNQUFNO0FBQUEsRUFBQTtBQUVWO0FBRU8sTUFBTSxZQUFZO0FBQUEsRUFDdkI7QUFBQSxFQUNBO0FBQUEsRUFDQSxTQUE2QixDQUFBO0FBQUEsRUFDN0IsU0FBNkIsQ0FBQTtBQUFBLEVBQzdCLFVBQStCLENBQUE7QUFBQSxFQUMvQixTQUFtQixDQUFBO0FBQUEsRUFDbkI7QUFBQSxFQUVBLE9BQU8sT0FBTyxJQUEwQixVQUE4QixJQUFJO0FBQ3hFLFdBQU8sbUJBQW1CLElBQUksZ0JBQWdCLENBQUNBLFFBQW9CO0FBQ2pFLGFBQU8sSUFBSSxLQUFLQSxLQUFJLE9BQU87QUFBQSxJQUM3QixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBRUEsWUFBWSxVQUFnQyxVQUE4QixJQUFJO0FBQzVFLFNBQUssVUFBVSxVQUFVLFFBQVE7QUFDakMsU0FBSyxVQUFVLFVBQVUsQ0FBQSxHQUFJLGdCQUFnQixPQUFPO0FBQ3BELFFBQUk7QUFJSixRQUFJLEtBQUssUUFBUSxRQUFRLGNBQWMsTUFBTTtBQUMzQyxnQkFBVSxLQUFL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
