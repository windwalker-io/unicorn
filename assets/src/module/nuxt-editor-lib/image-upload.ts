import { defineComponent, h, ref, watch } from 'vue';
import { trans } from '../../service/lang';
import type { UploadImage } from './types';
import { fileNameFromUrl } from './upload';

// The `imageUpload` placeholder node (a dropzone that uploads the file, then replaces itself with an image)
// and the custom `uploadImage` handler used by the toolbar and slash menu to insert it.
export function createImageUpload(deps: {
  Node: any;
  mergeAttributes: any;
  VueNodeViewRenderer: any;
  NodeViewWrapper: any;
  nodeViewProps: any;
  UFileUpload: any;
  UAvatar: any;
  uploadImage: UploadImage;
}) {
  const { Node, mergeAttributes, VueNodeViewRenderer, NodeViewWrapper, nodeViewProps, UFileUpload, UAvatar, uploadImage } = deps;

  const ImageUploadView = defineComponent({
    props: nodeViewProps,
    setup(props: any) {
      const file = ref<File | null>(null);
      const loading = ref(false);

      watch(file, async (newFile) => {
        if (!newFile) {
          return;
        }

        loading.value = true;

        try {
          const src = await uploadImage(newFile);
          const pos = props.getPos();

          if (typeof pos === 'number') {
            props.editor
              .chain()
              .focus()
              .deleteRange({ from: pos, to: pos + 1 })
              .setImage({ src, alt: fileNameFromUrl(src) })
              .run();
          }
        } catch (e) {
          file.value = null;
        } finally {
          loading.value = false;
        }
      });

      return () => h(NodeViewWrapper, null, () =>
        h(UFileUpload, {
          modelValue: file.value,
          'onUpdate:modelValue': (v: File | null) => {
            file.value = v;
          },
          accept: 'image/*',
          label: trans('unicorn.nuxt.editor.action.upload.image'),
          description: 'SVG, PNG, JPG or GIF',
          preview: false,
          class: 'min-h-48',
        }, {
          leading: () => h(UAvatar, {
            icon: loading.value ? 'i-lucide-loader-circle' : 'i-lucide-image',
            size: 'xl',
            ui: { icon: [loading.value && 'animate-spin'] },
          }),
        }));
    },
  });

  // Block-level placeholder node that holds the upload dropzone (the docs' "+ Image" panel).
  const ImageUpload = Node.create({
    name: 'imageUpload',
    group: 'block',
    atom: true,
    draggable: true,
    parseHTML: () => [{ tag: 'div[data-type="image-upload"]' }],
    renderHTML: ({ HTMLAttributes }: any) =>
      ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'image-upload' })],
    addNodeView: () => VueNodeViewRenderer(ImageUploadView),
  });

  const customHandlers = {
    uploadImage: {
      canExecute: (ed: any) => ed.can().insertContent({ type: 'imageUpload' }),
      execute: (ed: any) => ed.chain().focus().insertContent({ type: 'imageUpload' }),
      isActive: (ed: any) => ed.isActive('imageUpload'),
      isDisabled: undefined,
    },
  };

  return { ImageUpload, customHandlers };
}
