import { i as s, z as c, _ as u, d as f, k as m, a as g } from "../chunks/unicorn-Dap6NpVD.js";
import v from "sortablejs";
import { b as _, a as S, i as b, c as E, d as O, g as P, k as q } from "../chunks/_getPrototype-C1QTIEnq.js";
import { b as T, a as w } from "../chunks/_baseRest-7FsGZDVI.js";
import { b as C, d as x, i as R, S as $, e as A, c as M, f as U } from "../chunks/isArguments-B1y5d3Sj.js";
class H {
  createCallback(l, r, n) {
    switch (l) {
      // case 'tag':
      //   return () => {
      //
      //   };
      case "list":
        return (e) => {
          const t = document.querySelector(r);
          t.querySelector(`[data-value="${e.value}"]`) ? alert(u("unicorn.field.modal.already.selected")) : (t.appendItem(e, !0), s(n).close());
        };
      case "single":
      default:
        return (e) => {
          const t = document.querySelector(r), a = t.querySelector("[data-role=image]"), i = t.querySelector("[data-role=title]"), o = t.querySelector("[data-role=value]");
          a && e.image && (a.style.backgroundImage = `url(${e.image});`), i.value = e.title || "", o.value = e.value || "", o.dispatchEvent(new CustomEvent("change")), s(n).close(), c(i);
        };
    }
  }
}
export {
  H as ModalSelect
};
