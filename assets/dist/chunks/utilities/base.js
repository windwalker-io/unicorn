import { a as selectAll } from "../service/dom.js";
function removeCloak() {
  if (globalThis.document == null) {
    return;
  }
  selectAll("[uni-cloak]", (el) => el.removeAttribute("uni-cloak"));
}
export {
  removeCloak as r
};
