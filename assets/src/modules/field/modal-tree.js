import { createApp, nextTick, onMounted, reactive, ref, toRefs } from 'vue';
import ModalTreeApp from '../../vue/components/modal-tree/modal-tree.vue';

u.importCSS('@vue-animate');

const app = createApp({
  name: 'modal-tree',
  components: {
    ModalTreeApp
  }
});
app.config.globalProperties.$u = u;

class ModalTreeElement extends HTMLElement {
  static is = 'modal-tree';

  connectedCallback() {
    if (!this.vm) {
      app.mount(this);

      this.vm = app;
    }
  }
}

u.defineCustomElement(ModalTreeElement.is, ModalTreeElement);
