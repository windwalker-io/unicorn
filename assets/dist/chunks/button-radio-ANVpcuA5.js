import { g as d, i as u, m as p, h as n, p as h, d as o } from "./unicorn-Dap6NpVD.js";
const b = {
  selector: ".btn-group .radio",
  buttonClass: "btn",
  activeClass: "active",
  color: {
    default: "btn-default btn-outline-secondary",
    green: "btn-success",
    red: "btn-danger",
    blue: "btn-primary"
  }
};
class y {
  wrapper;
  element;
  radios = [];
  inputs = [];
  buttons = [];
  colors = [];
  options = {};
  static handle(a, s = {}) {
    return d(a, "button-radio", (e) => new this(e, s));
  }
  constructor(a, s = {}) {
    this.element = u(a), this.options = s = p({}, b, s);
    let e;
    this.element.dataset.fieldInput != null ? e = this.element : e = this.element.querySelector("[data-field-input]"), this.wrapper = e;
    let t = e.querySelector(".btn-group");
    const i = t != null;
    t || (t = n("div", { class: "btn-group" })), this.radios = h(e.querySelectorAll(".radio")), this.radios.forEach((l) => {
      const r = this.prepareButton(l, i);
      i || t.appendChild(r);
    }), this.syncState(), e.insertBefore(t, e.firstChild), e.dispatchEvent(new Event("button-radio.loaded")), this.colors = [...new Set(this.colors)];
  }
  prepareButton(a, s = !1) {
    const e = this.options, t = a.querySelector("input"), i = a.querySelector("label");
    let l;
    s ? (l = this.wrapper.querySelector(`[data-for="${t.id}"]`), l.classList.add(...this.parseClasses(`${e.buttonClass} ${e.color.default}`))) : l = n(
      "button",
      {
        type: "button",
        class: `${e.buttonClass} ${e.color.default}`,
        "data-value": t.value
      },
      `<span>${i.innerHTML}</span>`
    ), o(l, "input", t), this.inputs.push(t), this.buttons.push(l), a.style.display = "none";
    let r = t.dataset.colorClass || "";
    if (!r) {
      switch (t.value) {
        case "":
          r = e.color.blue;
          break;
        case "0":
          r = e.color.red;
          break;
        default:
          r = e.color.green;
          break;
      }
      t.dataset.colorClass = r;
    }
    return this.colors.push(r), (t.disabled || t.getAttribute("readonly") != null) && (l.classList.add("disabled"), l.disabled = !0), t.getAttribute("readonly") != null && l.classList.add("readonly"), l.addEventListener("click", () => {
      if (t.getAttribute("disabled") || t.getAttribute("readonly"))
        return;
      !t.checked && (this.inputs.forEach((c) => {
        c.checked = !1;
      }), t.checked = !0, t.dispatchEvent(new Event("change")), t.dispatchEvent(new Event("input")));
    }), t.addEventListener("change", () => {
      this.syncState();
    }), l;
  }
  syncState() {
    const a = this.options;
    this.buttons.forEach((s) => {
      const e = o(s, "input");
      s.classList.add(...this.parseClasses(a.color.default)), s.classList.remove(...this.parseClasses(a.activeClass)), s.classList.remove(...this.parseClasses(...this.colors)), e.checked && (s.classList.add(...this.parseClasses(a.activeClass)), s.classList.add(...this.parseClasses(e.dataset.colorClass)), s.classList.remove(...this.parseClasses(a.color.default)));
    });
  }
  parseClasses(...a) {
    return a.join(" ").split(" ").filter((e) => e !== "");
  }
}
export {
  y as ButtonRadio
};
