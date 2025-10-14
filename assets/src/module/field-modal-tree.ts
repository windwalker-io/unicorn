import { data } from '../data';
import { useCssImport } from '../service';
import { createApp } from 'vue';
import ModalTreeApp from '../vue/components/ModalTree/ModalTreeApp.vue';

const app = createApp({
  name: 'modal-tree',
  components: {
    ModalTreeApp
  }
});
app.config.globalProperties.$getData = data;

class ModalTreeElement extends HTMLElement {
  static is = 'modal-tree';

  vm: any;

  connectedCallback() {
    if (!this.vm) {
      this.vm = app.mount(this);
    }
  }
}

async function init() {
  customElements.define(ModalTreeElement.is, ModalTreeElement);
  await useCssImport('@vue-animate');
}

export const ready = init();
