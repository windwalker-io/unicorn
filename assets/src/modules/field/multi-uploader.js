/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

class MultiUploader extends HTMLElement {
  static is = 'multi-uploader';

  connectedCallback() {
    const options = JSON.parse(
      this.getAttribute('options') || '{}'
    );

    this.modalElement = this.querySelector('.modal');

    u.import('@vue')
      .then(() => u.import('@unicorn/vue/vue-drag-uploader.js', '@sortablejs', '@vuedraggable'))
      .then(() => {
        const app = Vue.createApp({ name: 'multi-uploader-field' });
        app.component('app', createAppInstance(options, document.querySelector('#multi-uploader-field-tmpl').innerHTML));
        app.component('draggable', vuedraggable);
        app.component('vue-drag-uploader', VueDragUploader);
        app.mount(this);

        this.vm = app;
      });
  }
}

customElements.define(MultiUploader.is, MultiUploader);

function createAppInstance(data, tmpl) {
  const { nextTick, onMounted, reactive, ref, toRefs } = Vue;

  return {
    name: 'multi-uploader-field-app',
    template: tmpl,
    setup(props, ctx) {
      const state = reactive({
        ...data,
        current: null,
        currentIndex: null,
        loading: false
      });
      const dragarea = ref(null);
      const modal = ref(null);
      const app = ref(null);

      function openFile(item) {
        if (state.openFileHandler) {
          state.openFileHandler(item);
        } else {
          window.open(item.download_url || item.url);
        }
      }

      function test() {
        state.current = {foo: 123};
      }

      function itemClick(item, i, event) {
        state.current = item;
        state.currentIndex = i;

        nextTick().then(() => {
          new bootstrap.Modal(modal.value).show();
        });
        // this.$options.metaModal.modal('show');
      }

      function metaSave() {
        state.current = null;
        state.currentIndex = null;

        nextTick().then(() => {
          // new bootstrap.Modal(modal.value).hide();
        });
        // this.$options.metaModal.modal('hide');
      }

      function isImage(url) {
        const ext = url.split('.').pop().split('?').shift();
        const allow = ['png', 'jpeg', 'jpg', 'gif', 'bmp', 'webp'];

        return allow.indexOf(ext) !== -1;
      }

      function dragover(e) {
        if (!state.canReplace) {
          return;
        }

        dragarea.value.style.opacity = 0.75;
      }

      function dragleave(e) {
        if (!state.canReplace) {
          return;
        }

        dragarea.value.style.opacity = 1;
      }

      function drop(event) {
        if (!state.canReplace) {
          return;
        }

        dragarea.value.style.opacity = 1;
        const item = state.current;
        const file = event.dataTransfer.files[0];

        app.value.checkFile(file);

        if (!app.value.canUpload) {
          return;
        }

        const reader = new FileReader();

        item.file = file;

        const itemComponent = app.value.$refs[item.key];

        state.loading = true;

        itemComponent.upload().finally(() => {
          state.loading = false;
        });
      }

      return {
        app,
        modal,
        state,
        dragarea,
        ...toRefs(state),

        test,
        openFile,
        itemClick,
        metaSave,
        isImage,
        dragover,
        dragleave,
        drop
      };
    }
  };
}
