import { f as c, y as p, m as u, _ as f, w as h, k as g, e as b } from "../chunks/unicorn-Dap6NpVD.js";
const m = /* @__PURE__ */ c("file-drag-field", {
  mounted(l) {
    const e = l.querySelector("input[type=file]"), t = l.querySelector("[data-role=placeholder]"), n = l.querySelector(".c-file-drag-preview");
    if (n) {
      const r = n.querySelector(".c-file-drag-preview__link"), i = n.querySelector(".c-file-drag-preview__delete");
      let a = r.textContent, s = t.value, o = e.required;
      t.value && (e.required = !1), i.addEventListener("click", () => {
        i.classList.contains("active") ? (r.textContent = a, t.value = s, i.classList.remove("active"), e.required = !1) : (r.textContent = "", t.value = "", i.classList.add("active"), e.required = o);
      });
    }
  }
});
export {
  m as ready
};
