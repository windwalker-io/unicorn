import { a as useUniDirective, x as getBoundedInstance, v as selectOne, a1 as mergeDeep, A as h, w as selectAll, a6 as data } from "./unicorn-G5leHO5V.js";
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
          color = options.color.blue || "";
          break;
        case "0":
          color = options.color.red || "";
          break;
        default:
          color = options.color.green || "";
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
      button.classList.add(...this.parseClasses(options.color.default || ""));
      button.classList.remove(...this.parseClasses(options.activeClass));
      button.classList.remove(...this.parseClasses(...this.colors));
      if (input.checked) {
        button.classList.add(...this.parseClasses(options.activeClass));
        button.classList.add(...this.parseClasses(input.dataset.colorClass || ""));
        button.classList.remove(...this.parseClasses(options.color.default || ""));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLXJhZGlvLUNZM3NnakxvLmpzIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYm9vdHN0cmFwL2J1dHRvbi1yYWRpby50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1c2VVbmlEaXJlY3RpdmUgfSBmcm9tICcuLi9jb21wb3NhYmxlJztcclxuaW1wb3J0IHsgZGF0YSB9IGZyb20gJy4uL2RhdGEnO1xyXG5pbXBvcnQgeyBnZXRCb3VuZGVkSW5zdGFuY2UsIGgsIHNlbGVjdEFsbCwgc2VsZWN0T25lIH0gZnJvbSAnLi4vc2VydmljZSc7XHJcbmltcG9ydCB7IG1lcmdlRGVlcCB9IGZyb20gJy4uL3V0aWxpdGllcyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEJ1dHRvblJhZGlvT3B0aW9ucyB7XHJcbiAgc2VsZWN0b3I/OiBzdHJpbmc7XHJcbiAgYnV0dG9uQ2xhc3M/OiBzdHJpbmc7XHJcbiAgYWN0aXZlQ2xhc3M/OiBzdHJpbmc7XHJcbiAgY29sb3I/OiB7XHJcbiAgICAnZGVmYXVsdCc/OiBzdHJpbmc7XHJcbiAgICBncmVlbj86IHN0cmluZztcclxuICAgIHJlZD86IHN0cmluZztcclxuICAgIGJsdWU/OiBzdHJpbmc7XHJcbiAgfTtcclxufVxyXG5cclxuY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XHJcbiAgc2VsZWN0b3I6ICcuYnRuLWdyb3VwIC5yYWRpbycsXHJcbiAgYnV0dG9uQ2xhc3M6ICdidG4nLFxyXG4gIGFjdGl2ZUNsYXNzOiAnYWN0aXZlJyxcclxuICBjb2xvcjoge1xyXG4gICAgJ2RlZmF1bHQnOiAnYnRuLWRlZmF1bHQgYnRuLW91dGxpbmUtc2Vjb25kYXJ5JyxcclxuICAgIGdyZWVuOiAnYnRuLXN1Y2Nlc3MnLFxyXG4gICAgcmVkOiAnYnRuLWRhbmdlcicsXHJcbiAgICBibHVlOiAnYnRuLXByaW1hcnknXHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGNsYXNzIEJ1dHRvblJhZGlvIHtcclxuICB3cmFwcGVyOiBIVE1MRWxlbWVudDtcclxuICBlbGVtZW50OiBIVE1MRWxlbWVudDtcclxuICByYWRpb3M6IEhUTUxJbnB1dEVsZW1lbnRbXSA9IFtdO1xyXG4gIGlucHV0czogSFRNTElucHV0RWxlbWVudFtdID0gW107XHJcbiAgYnV0dG9uczogSFRNTEJ1dHRvbkVsZW1lbnRbXSA9IFtdO1xyXG4gIGNvbG9yczogc3RyaW5nW10gPSBbXTtcclxuICBvcHRpb25zOiBSZXF1aXJlZDxCdXR0b25SYWRpb09wdGlvbnM+O1xyXG5cclxuICBzdGF0aWMgaGFuZGxlKGVsOiBIVE1MRWxlbWVudCB8IHN0cmluZywgb3B0aW9uczogQnV0dG9uUmFkaW9PcHRpb25zID0ge30pIHtcclxuICAgIHJldHVybiBnZXRCb3VuZGVkSW5zdGFuY2UoZWwsICdidXR0b24tcmFkaW8nLCAoZWw6IEhUTUxFbGVtZW50KSA9PiB7XHJcbiAgICAgIHJldHVybiBuZXcgdGhpcyhlbCwgb3B0aW9ucyk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNvbnN0cnVjdG9yKHNlbGVjdG9yOiBIVE1MRWxlbWVudCB8IHN0cmluZywgb3B0aW9uczogQnV0dG9uUmFkaW9PcHRpb25zID0ge30pIHtcclxuICAgIHRoaXMuZWxlbWVudCA9IHNlbGVjdE9uZTxIVE1MRWxlbWVudD4oc2VsZWN0b3IpITtcclxuICAgIHRoaXMub3B0aW9ucyA9IG1lcmdlRGVlcCh7fSwgZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xyXG4gICAgbGV0IHdyYXBwZXI6IEhUTUxFbGVtZW50O1xyXG5cclxuICAgIC8vIFR1cm4gcmFkaW9zIGludG8gYnRuLWdyb3VwXHJcblxyXG4gICAgaWYgKHRoaXMuZWxlbWVudC5kYXRhc2V0LmZpZWxkSW5wdXQgIT0gbnVsbCkge1xyXG4gICAgICB3cmFwcGVyID0gdGhpcy5lbGVtZW50O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgd3JhcHBlciA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1maWVsZC1pbnB1dF0nKSE7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy53cmFwcGVyID0gd3JhcHBlcjtcclxuICAgIGxldCBpbnB1dEdyb3VwID0gd3JhcHBlci5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignLmJ0bi1ncm91cCcpITtcclxuICAgIGNvbnN0IGV4aXN0cyA9IGlucHV0R3JvdXAgIT0gbnVsbDtcclxuXHJcbiAgICBpZiAoIWlucHV0R3JvdXApIHtcclxuICAgICAgaW5wdXRHcm91cCA9IGgoJ2RpdicsIHsgY2xhc3M6ICdidG4tZ3JvdXAnIH0pXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5yYWRpb3MgPSBzZWxlY3RBbGwod3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsPEhUTUxJbnB1dEVsZW1lbnQ+KCcucmFkaW8nKSk7XHJcblxyXG4gICAgdGhpcy5yYWRpb3MuZm9yRWFjaChyYWRpbyA9PiB7XHJcbiAgICAgIGNvbnN0IGJ1dHRvbiA9IHRoaXMucHJlcGFyZUJ1dHRvbihyYWRpbywgZXhpc3RzKTtcclxuXHJcbiAgICAgIGlmICghZXhpc3RzKSB7XHJcbiAgICAgICAgaW5wdXRHcm91cC5hcHBlbmRDaGlsZChidXR0b24pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLnN5bmNTdGF0ZSgpO1xyXG5cclxuICAgIHdyYXBwZXIuaW5zZXJ0QmVmb3JlKGlucHV0R3JvdXAsIHdyYXBwZXIuZmlyc3RDaGlsZCk7XHJcblxyXG4gICAgd3JhcHBlci5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnYnV0dG9uLXJhZGlvLmxvYWRlZCcpKTtcclxuXHJcbiAgICAvLyBNYWtlIGNvbG9yIGVsZW1lbnRzIHVuaXF1ZVxyXG4gICAgdGhpcy5jb2xvcnMgPSBbLi4ubmV3IFNldCh0aGlzLmNvbG9ycyldO1xyXG4gIH1cclxuXHJcbiAgcHJlcGFyZUJ1dHRvbihyYWRpbzogSFRNTElucHV0RWxlbWVudCwgZXhpc3RzID0gZmFsc2UpIHtcclxuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XHJcblxyXG4gICAgY29uc3QgaW5wdXQgPSByYWRpby5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpITtcclxuICAgIGNvbnN0IGxhYmVsID0gcmFkaW8ucXVlcnlTZWxlY3RvcignbGFiZWwnKSE7XHJcblxyXG4gICAgbGV0IGJ1dHRvbjogSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcblxyXG4gICAgaWYgKGV4aXN0cykge1xyXG4gICAgICBidXR0b24gPSB0aGlzLndyYXBwZXIucXVlcnlTZWxlY3RvcihgW2RhdGEtZm9yPVwiJHtpbnB1dC5pZH1cIl1gKSE7XHJcbiAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKC4uLnRoaXMucGFyc2VDbGFzc2VzKGAke29wdGlvbnMuYnV0dG9uQ2xhc3N9ICR7b3B0aW9ucy5jb2xvclsnZGVmYXVsdCddfWApKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGJ1dHRvbiA9IGgoXHJcbiAgICAgICAgJ2J1dHRvbicsXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdHlwZTogJ2J1dHRvbicsXHJcbiAgICAgICAgICBjbGFzczogYCR7b3B0aW9ucy5idXR0b25DbGFzc30gJHtvcHRpb25zLmNvbG9yWydkZWZhdWx0J119YCxcclxuICAgICAgICAgICdkYXRhLXZhbHVlJzogaW5wdXQudmFsdWUsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBgPHNwYW4+JHtsYWJlbC5pbm5lckhUTUx9PC9zcGFuPmBcclxuICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBkYXRhKGJ1dHRvbiwgJ2lucHV0JywgaW5wdXQpO1xyXG4gICAgdGhpcy5pbnB1dHMucHVzaChpbnB1dCk7XHJcbiAgICB0aGlzLmJ1dHRvbnMucHVzaChidXR0b24pO1xyXG5cclxuICAgIHJhZGlvLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcblxyXG4gICAgLy8gUHJlcGFyZSBjb2xvciBzY2hlbWFcclxuICAgIGxldCBjb2xvciA9IGlucHV0LmRhdGFzZXQuY29sb3JDbGFzcyB8fCAnJztcclxuXHJcbiAgICBpZiAoIWNvbG9yKSB7XHJcbiAgICAgIHN3aXRjaCAoaW5wdXQudmFsdWUpIHtcclxuICAgICAgICBjYXNlICcnOlxyXG4gICAgICAgICAgY29sb3IgPSBvcHRpb25zLmNvbG9yLmJsdWUgfHwgJyc7XHJcbiAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgY2FzZSAnMCc6XHJcbiAgICAgICAgICBjb2xvciA9IG9wdGlvbnMuY29sb3IucmVkIHx8ICcnO1xyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBjb2xvciA9IG9wdGlvbnMuY29sb3IuZ3JlZW4gfHwgJyc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgICAgaW5wdXQuZGF0YXNldC5jb2xvckNsYXNzID0gY29sb3I7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHRoaXMuY29sb3JzLnB1c2goY29sb3IpO1xyXG5cclxuICAgIGlmIChpbnB1dC5kaXNhYmxlZCB8fCBpbnB1dC5nZXRBdHRyaWJ1dGUoJ3JlYWRvbmx5JykgIT0gbnVsbCkge1xyXG4gICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnZGlzYWJsZWQnKTtcclxuICAgICAgYnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaW5wdXQuZ2V0QXR0cmlidXRlKCdyZWFkb25seScpICE9IG51bGwpIHtcclxuICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3JlYWRvbmx5Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQmluZCBldmVudFxyXG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICBpZiAoaW5wdXQuZ2V0QXR0cmlidXRlKCdkaXNhYmxlZCcpIHx8IGlucHV0LmdldEF0dHJpYnV0ZSgncmVhZG9ubHknKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgY2hhbmdlZCA9ICFpbnB1dC5jaGVja2VkO1xyXG5cclxuICAgICAgaWYgKGNoYW5nZWQpIHtcclxuICAgICAgICB0aGlzLmlucHV0cy5mb3JFYWNoKChlbGUpID0+IHtcclxuICAgICAgICAgIGVsZS5jaGVja2VkID0gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlucHV0LmNoZWNrZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICBpbnB1dC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnY2hhbmdlJykpO1xyXG4gICAgICAgIGlucHV0LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdpbnB1dCcpKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKCkgPT4ge1xyXG4gICAgICB0aGlzLnN5bmNTdGF0ZSgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIGJ1dHRvbjtcclxuICB9XHJcblxyXG4gIHN5bmNTdGF0ZSgpIHtcclxuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XHJcblxyXG4gICAgdGhpcy5idXR0b25zLmZvckVhY2goKGJ1dHRvbikgPT4ge1xyXG4gICAgICBjb25zdCBpbnB1dDogSFRNTElucHV0RWxlbWVudCA9IGRhdGEoYnV0dG9uLCAnaW5wdXQnKTtcclxuXHJcbiAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKC4uLnRoaXMucGFyc2VDbGFzc2VzKG9wdGlvbnMuY29sb3IuZGVmYXVsdCB8fCAnJykpO1xyXG4gICAgICBidXR0b24uY2xhc3NMaXN0LnJlbW92ZSguLi50aGlzLnBhcnNlQ2xhc3NlcyhvcHRpb25zLmFjdGl2ZUNsYXNzKSk7XHJcbiAgICAgIGJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKC4uLnRoaXMucGFyc2VDbGFzc2VzKC4uLnRoaXMuY29sb3JzKSk7XHJcblxyXG4gICAgICBpZiAoaW5wdXQuY2hlY2tlZCkge1xyXG4gICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKC4uLnRoaXMucGFyc2VDbGFzc2VzKG9wdGlvbnMuYWN0aXZlQ2xhc3MpKTtcclxuICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCguLi50aGlzLnBhcnNlQ2xhc3NlcyhpbnB1dC5kYXRhc2V0LmNvbG9yQ2xhc3MgfHwgJycpKTtcclxuICAgICAgICBidXR0b24uY2xhc3NMaXN0LnJlbW92ZSguLi50aGlzLnBhcnNlQ2xhc3NlcyhvcHRpb25zLmNvbG9yLmRlZmF1bHQgfHwgJycpKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwYXJzZUNsYXNzZXMoLi4uY2xhc3NOYW1lOiBzdHJpbmdbXSkge1xyXG4gICAgY29uc3QgY2xhc3NOYW1lU3RyID0gY2xhc3NOYW1lLmpvaW4oJyAnKTtcclxuICAgIHJldHVybiBjbGFzc05hbWVTdHIuc3BsaXQoJyAnKS5maWx0ZXIodCA9PiB0ICE9PSAnJyk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgcmVhZHkgPSB1c2VVbmlEaXJlY3RpdmUoJ2J1dHRvbi1yYWRpbycsIHtcclxuICBtb3VudGVkKGVsLCB7IHZhbHVlIH0pIHtcclxuICAgIGNvbnN0IG9wdGlvbnM6IEJ1dHRvblJhZGlvT3B0aW9ucyA9IEpTT04ucGFyc2UodmFsdWUgfHwgJ3t9Jyk7XHJcbiAgICBCdXR0b25SYWRpby5oYW5kbGUoZWwsIHZhbHVlIHx8IHt9KTtcclxuICB9XHJcbn0pO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBCdXR0b25SYWRpb01vZHVsZSB7XHJcbiAgQnV0dG9uUmFkaW86IHR5cGVvZiBCdXR0b25SYWRpbztcclxuICByZWFkeTogdHlwZW9mIHJlYWR5O1xyXG59XHJcbiJdLCJuYW1lcyI6WyJlbCJdLCJtYXBwaW5ncyI6IjtBQWlCQSxNQUFNLGlCQUFpQjtBQUFBLEVBQ3JCLFVBQVU7QUFBQSxFQUNWLGFBQWE7QUFBQSxFQUNiLGFBQWE7QUFBQSxFQUNiLE9BQU87QUFBQSxJQUNMLFdBQVc7QUFBQSxJQUNYLE9BQU87QUFBQSxJQUNQLEtBQUs7QUFBQSxJQUNMLE1BQU07QUFBQSxFQUFBO0FBRVY7QUFFTyxNQUFNLFlBQVk7QUFBQSxFQUN2QjtBQUFBLEVBQ0E7QUFBQSxFQUNBLFNBQTZCLENBQUE7QUFBQSxFQUM3QixTQUE2QixDQUFBO0FBQUEsRUFDN0IsVUFBK0IsQ0FBQTtBQUFBLEVBQy9CLFNBQW1CLENBQUE7QUFBQSxFQUNuQjtBQUFBLEVBRUEsT0FBTyxPQUFPLElBQTBCLFVBQThCLElBQUk7QUFDeEUsV0FBTyxtQkFBbUIsSUFBSSxnQkFBZ0IsQ0FBQ0EsUUFBb0I7QUFDakUsYUFBTyxJQUFJLEtBQUtBLEtBQUksT0FBTztBQUFBLElBQzdCLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFFQSxZQUFZLFVBQWdDLFVBQThCLElBQUk7QUFDNUUsU0FBSyxVQUFVLFVBQXVCLFFBQVE7QUFDOUMsU0FBSyxVQUFVLFVBQVUsQ0FBQSxHQUFJLGdCQUFnQixPQUFPO0FBQ3BELFFBQUk7QUFJSixRQUFJLEtBQUssUUFBUSxRQUFRLGNBQWMsTUFBTTtBQUMzQyxnQkFBVSxLQUFLO0FBQUEsSUFDakIsT0FBTztBQUNMLGdCQUFVLEtBQUssUUFBUSxjQUFjLG9CQUFvQjtBQUFBLElBQzNEO0FBRUEsU0FBSyxVQUFVO0FBQ2YsUUFBSSxhQUFhLFFBQVEsY0FBMkIsWUFBWTtBQUNoRSxVQUFNLFNBQVMsY0FBYztBQUU3QixRQUFJLENBQUMsWUFBWTtBQUNmLG1CQUFhLEVBQUUsT0FBTyxFQUFFLE9BQU8sYUFBYTtBQUFBLElBQzlDO0FBRUEsU0FBSyxTQUFTLFVBQVUsUUFBUSxpQkFBbUMsUUFBUSxDQUFDO0FBRTVFLFNBQUssT0FBTyxRQUFRLENBQUEsVUFBUztBQUMzQixZQUFNLFNBQVMsS0FBSyxjQUFjLE9BQU8sTUFBTTtBQUUvQyxVQUFJLENBQUMsUUFBUTtBQUNYLG1CQUFXLFlBQVksTUFBTTtBQUFBLE1BQy9CO0FBQUEsSUFDRixDQUFDO0FBRUQsU0FBSyxVQUFBO0FBRUwsWUFBUSxhQUFhLFlBQVksUUFBUSxVQUFVO0FBRW5ELFlBQVEsY0FBYyxJQUFJLE1BQU0scUJBQXFCLENBQUM7QUFHdEQsU0FBSyxTQUFTLENBQUMsR0FBRyxJQUFJLElBQUksS0FBSyxNQUFNLENBQUM7QUFBQSxFQUN4QztBQUFBLEVBRUEsY0FBYyxPQUF5QixTQUFTLE9BQU87QUFDckQsVUFBTSxVQUFVLEtBQUs7QUFFckIsVUFBTSxRQUFRLE1BQU0sY0FBYyxPQUFPO0FBQ3pDLFVBQU0sUUFBUSxNQUFNLGNBQWMsT0FBTztBQUV6QyxRQUFJO0FBRUosUUFBSSxRQUFRO0FBQ1YsZUFBUyxLQUFLLFFBQVEsY0FBYyxjQUFjLE1BQU0sRUFBRSxJQUFJO0FBQzlELGFBQU8sVUFBVSxJQUFJLEdBQUcsS0FBSyxhQUFhLEdBQUcsUUFBUSxXQUFXLElBQUksUUFBUSxNQUFNLFNBQVMsQ0FBQyxFQUFFLENBQUM7QUFBQSxJQUNqRyxPQUFPO0FBQ0wsZUFBUztBQUFBLFFBQ1A7QUFBQSxRQUNBO0FBQUEsVUFDRSxNQUFNO0FBQUEsVUFDTixPQUFPLEdBQUcsUUFBUSxXQUFXLElBQUksUUFBUSxNQUFNLFNBQVMsQ0FBQztBQUFBLFVBQ3pELGNBQWMsTUFBTTtBQUFBLFFBQUE7QUFBQSxRQUV0QixTQUFTLE1BQU0sU0FBUztBQUFBLE1BQUE7QUFBQSxJQUU1QjtBQUVBLFNBQUssUUFBUSxTQUFTLEtBQUs7QUFDM0IsU0FBSyxPQUFPLEtBQUssS0FBSztBQUN0QixTQUFLLFFBQVEsS0FBSyxNQUFNO0FBRXhCLFVBQU0sTUFBTSxVQUFVO0FBR3RCLFFBQUksUUFBUSxNQUFNLFFBQVEsY0FBYztBQUV4QyxRQUFJLENBQUMsT0FBTztBQUNWLGNBQVEsTUFBTSxPQUFBO0FBQUEsUUFDWixLQUFLO0FBQ0gsa0JBQVEsUUFBUSxNQUFNLFFBQVE7QUFDOUI7QUFBQSxRQUVGLEtBQUs7QUFDSCxrQkFBUSxRQUFRLE1BQU0sT0FBTztBQUM3QjtBQUFBLFFBRUY7QUFDRSxrQkFBUSxRQUFRLE1BQU0sU0FBUztBQUMvQjtBQUFBLE1BQUE7QUFHSixZQUFNLFFBQVEsYUFBYTtBQUFBLElBQzdCO0FBRUEsU0FBSyxPQUFPLEtBQUssS0FBSztBQUV0QixRQUFJLE1BQU0sWUFBWSxNQUFNLGFBQWEsVUFBVSxLQUFLLE1BQU07QUFDNUQsYUFBTyxVQUFVLElBQUksVUFBVTtBQUMvQixhQUFPLFdBQVc7QUFBQSxJQUNwQjtBQUVBLFFBQUksTUFBTSxhQUFhLFVBQVUsS0FBSyxNQUFNO0FBQzFDLGFBQU8sVUFBVSxJQUFJLFVBQVU7QUFBQSxJQUNqQztBQUdBLFdBQU8saUJBQWlCLFNBQVMsTUFBTTtBQUNyQyxVQUFJLE1BQU0sYUFBYSxVQUFVLEtBQUssTUFBTSxhQUFhLFVBQVUsR0FBRztBQUNwRTtBQUFBLE1BQ0Y7QUFFQSxZQUFNLFVBQVUsQ0FBQyxNQUFNO0FBRXZCLFVBQUksU0FBUztBQUNYLGFBQUssT0FBTyxRQUFRLENBQUMsUUFBUTtBQUMzQixjQUFJLFVBQVU7QUFBQSxRQUNoQixDQUFDO0FBRUQsY0FBTSxVQUFVO0FBRWhCLGNBQU0sY0FBYyxJQUFJLE1BQU0sUUFBUSxDQUFDO0FBQ3ZDLGNBQU0sY0FBYyxJQUFJLE1BQU0sT0FBTyxDQUFDO0FBQUEsTUFDeEM7QUFBQSxJQUNGLENBQUM7QUFFRCxVQUFNLGlCQUFpQixVQUFVLE1BQU07QUFDckMsV0FBSyxVQUFBO0FBQUEsSUFDUCxDQUFDO0FBRUQsV0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUVBLFlBQVk7QUFDVixVQUFNLFVBQVUsS0FBSztBQUVyQixTQUFLLFFBQVEsUUFBUSxDQUFDLFdBQVc7QUFDL0IsWUFBTSxRQUEwQixLQUFLLFFBQVEsT0FBTztBQUVwRCxhQUFPLFVBQVUsSUFBSSxHQUFHLEtBQUssYUFBYSxRQUFRLE1BQU0sV0FBVyxFQUFFLENBQUM7QUFDdEUsYUFBTyxVQUFVLE9BQU8sR0FBRyxLQUFLLGFBQWEsUUFBUSxXQUFXLENBQUM7QUFDakUsYUFBTyxVQUFVLE9BQU8sR0FBRyxLQUFLLGFBQWEsR0FBRyxLQUFLLE1BQU0sQ0FBQztBQUU1RCxVQUFJLE1BQU0sU0FBUztBQUNqQixlQUFPLFVBQVUsSUFBSSxHQUFHLEtBQUssYUFBYSxRQUFRLFdBQVcsQ0FBQztBQUM5RCxlQUFPLFVBQVUsSUFBSSxHQUFHLEtBQUssYUFBYSxNQUFNLFFBQVEsY0FBYyxFQUFFLENBQUM7QUFDekUsZUFBTyxVQUFVLE9BQU8sR0FBRyxLQUFLLGFBQWEsUUFBUSxNQUFNLFdBQVcsRUFBRSxDQUFDO0FBQUEsTUFDM0U7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFFQSxnQkFBZ0IsV0FBcUI7QUFDbkMsVUFBTSxlQUFlLFVBQVUsS0FBSyxHQUFHO0FBQ3ZDLFdBQU8sYUFBYSxNQUFNLEdBQUcsRUFBRSxPQUFPLENBQUEsTUFBSyxNQUFNLEVBQUU7QUFBQSxFQUNyRDtBQUNGO0FBRU8sTUFBTSxRQUFRLGdDQUFnQixnQkFBZ0I7QUFBQSxFQUNuRCxRQUFRLElBQUksRUFBRSxTQUFTO0FBQ2UsU0FBSyxNQUFNLFNBQVMsSUFBSTtBQUM1RCxnQkFBWSxPQUFPLElBQUksU0FBUyxDQUFBLENBQUU7QUFBQSxFQUNwQztBQUNGLENBQUM7In0=
