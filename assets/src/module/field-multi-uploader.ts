import { Modal } from 'bootstrap';
import type { Options } from 'sortablejs';
import {
  type ComponentPublicInstance,
  computed,
  createApp,
  defineComponent,
  getCurrentInstance,
  nextTick,
  onMounted,
  PropType,
  ref,
  useTemplateRef
} from 'vue';
import { VueDraggable } from 'vue-draggable-plus';
import {
  createItem,
  ItemCard,
  ItemCardPlaceholder,
  MultiUploader,
  MultiUploaderComposableInstance,
  MultiUploaderOptions,
  UploaderItem
} from 'vue-multi-uploader';
import css from 'vue-multi-uploader/src/vue-multi-uploader.scss?inline';
import { useStack } from '../composable';
import { data } from '../data';
import { forceArray, injectCssToDocument } from '../service';
import { mergeDeep } from '../utilities';

export type UniMultiUploaderOptions = {
  value?: any[];
  uploadUrl: string;
  maxFiles?: number;
  maxConcurrent?: number;
  thumbSize?: number;
  accept?: string;
  readonly: boolean;
  disabled: boolean;
  fieldName?: string;
  fieldFullName?: string;
  tmplSelector: string;
  canReplace: false;
  openFileHandler?: (item: UploaderItem) => void;
}

const defaultOptions = {
  readonly: false,
  disabled: false,
  sortable: false,
  thumbSize: 150,
  maxConcurrent: 5,
  canReplace: false,
  tmplSelector: '#multi-uploader-field-tmpl',
};

export class MultiUploaderElement extends HTMLElement {
  static is = 'uni-multi-uploader';

  modalElement!: HTMLDivElement;
  vm!: ComponentPublicInstance;

  async connectedCallback() {
    let options: Partial<UniMultiUploaderOptions> = JSON.parse(
      this.getAttribute('options') || '{}'
    );

    const resolvedOptions: UniMultiUploaderOptions = mergeDeep({}, defaultOptions, options);

    // Make some default options since PHP will send NULL
    resolvedOptions.thumbSize ??= 150;

    this.modalElement = this.querySelector<HTMLDivElement>('.modal')!;

    const tmplSelector = resolvedOptions.tmplSelector;

    const app = createApp(
      createAppInstance(resolvedOptions, document.querySelector(tmplSelector)!.innerHTML, this)
    );

    this.vm = app.mount(this);
  }
}

async function init() {
  injectCssToDocument(css);
  customElements.define(MultiUploaderElement.is, MultiUploaderElement);
}
export const ready = init();

export interface MultiUploaderModule {
  MultiUploaderElement: typeof MultiUploaderElement;
  ready: typeof ready;
}

function createAppInstance(opt: UniMultiUploaderOptions, tmpl: string, el: MultiUploaderElement) {
  return defineComponent({
    name: 'MultiUploaderFieldApp',
    template: tmpl,
    components: {
      VueDraggable,
      MultiUploader,
      ItemCard,
      ItemCardPlaceholder,
    },
    props: {
      stackName: String as PropType<string>,
    },
    setup(props, { expose }) {
      const options = ref<UniMultiUploaderOptions>(opt);
      const current = ref<UploaderItem>();
      const currentIndex = ref<number>();
      const loading = ref(false);
      const dragarea = ref<HTMLDivElement>();
      const modal = ref<HTMLDivElement>();
      const app = getCurrentInstance();
      const uploader = useTemplateRef<typeof MultiUploader>('uploader');
      const canModify = computed(() => !options.value.disabled && !options.value.readonly);
      const instance = ref<MultiUploaderComposableInstance>();

      onMounted(() => {
        instance.value = uploader.value!.instance;

        domEmit('multi-uploader:mounted', { app, uploader });
      });

      const items = ref<UploaderItem[]>([]);

      for (let item of forceArray(options.value.value)) {
        if (typeof item === 'string') {
          item = {
            url: item
          };
        }

        const uploadItem = createItem({
          url: item.url || '',
          thumbUrl: item.thumbUrl || item.thumb_url || item.url || '',
          data: item
        });

        items.value.push(uploadItem);
      }

      const uploadUrl = options.value.uploadUrl;
      const value = items.value;
      const uploaderOptions = ref<MultiUploaderOptions>({
        maxFiles: () => options.value.maxFiles,
        readonly: () => options.value.readonly,
        disabled: () => options.value.disabled,
        accept: () => options.value.accept,
        maxConcurrent: () => options.value.maxConcurrent,
        prepareXhr(xhr) {
          xhr.setRequestHeader(
            'X-CSRF-TOKEN',
            data('csrf-token')
          );
        },
        onItemUploadSuccess(item, xhr) {
          const res = JSON.parse(xhr.responseText);
          item.url = res.data.url;
          item.thumbUrl = res.data.thumbUrl || res.data.thumb_url || res.data.url;
          item.data = res.data;
          item.data.title ??= item.url.split('/').pop()?.split('?').shift() || '';
        }
      });
      const draggableOptions: Options = {
        draggable: '.c-drag-item',
        animation: 300,
        disabled: !canModify.value,
      };

      function openFile(item: UploaderItem) {
        if (options.value.openFileHandler) {
          options.value.openFileHandler(item);
        } else {
          window.open(item.download_url || item.url);
        }
      }

      async function itemClick(item: UploaderItem, i: number, event: MouseEvent) {
        current.value = item;
        currentIndex.value = i;

        domEmit('item-click', { item, i });

        nextTick().then(() => {
          Modal.getOrCreateInstance(modal.value!).show();
        });
        // this.$options.metaModal.modal('show');
      }

      function metaSave() {
        current.value = undefined;
        currentIndex.value = undefined;

        // nextTick().then(() => {
        // new bootstrap.Modal(modal.value).hide();
        // });
        // this.$options.metaModal.modal('hide');
      }

      function isImage(url: string) {
        const ext = url.split('.').pop()!.split('?').shift() || '';
        const allow = ['png', 'jpeg', 'jpg', 'gif', 'bmp', 'webp'];

        return allow.indexOf(ext.toLowerCase()) !== -1;
      }

      function dragover(e: DragEvent) {
        if (!options.value.canReplace) {
          return;
        }

        dragarea.value!.style.opacity = '0.75';
      }

      function dragleave(e: DragEvent) {
        if (!options.value.canReplace) {
          return;
        }

        dragarea.value!.style.opacity = '1';
      }

      function drop(event: DragEvent) {
        if (!options.value.canReplace) {
          return;
        }

        dragarea.value!.style.opacity = '1';
        const item = current.value;
        const file = event.dataTransfer?.files[0] || null;

        if (!file) {
          return;
        }

        instance.value!.checkFile(file);

        if (instance.value!.isReadonly) {
          return;
        }

        item!.file = file;

        loading.value = true;

        try {
          instance.value!.uploadFile(item!);
        } finally {
          loading.value = false;
        }
      }

      function uploading() {
        useStack(props.stackName).push(true);

        domEmit('uploading');
      }

      function uploaded() {
        useStack(props.stackName).pop();

        domEmit('uploaded');
      }

      function onChange(item: UploaderItem) {
        domEmit('change', item);
      }

      function domEmit(event: string, detail?: any) {
        el.dispatchEvent(new CustomEvent(event, { detail }));
      }

      const foo = ref<string>();

      foo.value = 'Bar';

      const icons = ref<Record<string, string>>({
        default: 'fas fa-file',
        pdf: 'fas fa-file-pdf text-danger',
        xls: 'fas fa-file-excel text-success',
        xlsx: 'fas fa-file-excel text-success',
        doc: 'fas fa-file-word text-primary',
        docx: 'fas fa-file-word text-primary',
        ppt: 'fas fa-file-powerpoint text-warning',
        pptx: 'fas fa-file-powerpoint text-warning',
        zip: 'fas fa-file-archive text-dark',
        '7z': 'fas fa-file-archive text-dark',
        rar: 'fas fa-file-archive text-dark',
        mp4: 'fas fa-file-video text-dark',
        avi: 'fas fa-file-video text-dark',
        flv: 'fas fa-file-video text-dark',
        mov: 'fas fa-file-video text-dark',
        ogg: 'fas fa-file-video text-dark',
        webm: 'fas fa-file-video text-dark',
        mpg: 'fas fa-file-video text-dark',
        mp3: 'fas fa-file-audio text-dark',
        acc: 'fas fa-file-audio text-dark',
        wav: 'fas fa-file-audio text-dark',
      });

      function setIcons(newIcons: Record<string, string>, merge = true) {
        if (merge) {
          icons.value = { ...icons.value, ...newIcons };
          return;
        }

        icons.value = newIcons;
      }

      expose({
        uploader,
        instance,
        value,
        canModify,
        openFile,
        itemClick,
        isImage,
        setIcons,
      });

      function fileIcon(item: UploaderItem) {
        let path = item.file ? item.file.name : item.url;

        // strip query
        path = String(path).split('?')[0];

        // Get extension
        const ext = path.split('.').pop() || '';

        const def = 'default' in icons ? icons.default : 'fas fa-file';

        return icons[String(ext || 'default').toLowerCase() as keyof typeof icons] || def;
      }

      return {
        uploader,
        uploadUrl,
        value,
        uploaderOptions,
        draggableOptions,
        modal,
        dragarea,
        options,
        current,
        currentIndex,
        loading,
        instance,
        canModify,

        openFile,
        itemClick,
        metaSave,
        isImage,
        dragover,
        dragleave,
        drop,
        uploading,
        uploaded,
        onChange,
        domEmit,
        fileIcon,
      };
    }
  });
}
