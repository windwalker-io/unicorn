import { d as data } from "../data.js";
import { createApp } from "vue";
import { M as ModalTreeApp } from "../vue/components/ModalTree/ModalTreeApp.js";
import { u as useCssImport } from "../service/loader.js";
/* @__PURE__ */ useCssImport("@vue-animate");
const app = /* @__PURE__ */ createApp({
  name: "modal-tree",
  components: {
    ModalTreeApp
  }
});
app.config.globalProperties.$getData = data;
class ModalTreeElement extends HTMLElement {
  static is = "modal-tree";
  vm;
  connectedCallback() {
    if (!this.vm) {
      this.vm = app.mount(this);
    }
  }
}
/* @__PURE__ */ customElements.define(/* @__PURE__ */ (() => ModalTreeElement.is)(), ModalTreeElement);
