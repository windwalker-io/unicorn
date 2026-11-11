import { useHttpClient, useStack } from '../../composable';
import type { NuxtEditorOptions, UploadImage } from './types';

// File name (without query / hash) of an uploaded URL, used as the default alt text.
export function fileNameFromUrl(src: string): string {
  const path = src.split(/[?#]/)[0];

  try {
    return decodeURIComponent(path.substring(path.lastIndexOf('/') + 1));
  } catch (e) {
    return path.substring(path.lastIndexOf('/') + 1);
  }
}

// Build the uploader: POST the file to `imageUploadUrl`, show the unicorn loading stack, return the uploaded URL.
export function createUploadImage(element: HTMLElement, opts: NuxtEditorOptions): UploadImage {
  return async (file: File) => {
    const url = opts.imageUploadUrl;

    if (!url) {
      throw new Error('imageUploadUrl is not configured.');
    }

    element.dispatchEvent(new CustomEvent('upload-start'));

    const formData = new FormData();
    formData.append('file', file, file.name);

    const stack = useStack(opts.unicorn?.stack_name);
    stack.push(true);

    const { post } = await useHttpClient();

    try {
      const res = await post(url, formData, { withCredentials: false });
      element.dispatchEvent(new CustomEvent('upload-success'));

      return res.data.data.url;
    } catch (e) {
      element.dispatchEvent(new CustomEvent('upload-error', { detail: e }));
      console.error(e);
      throw e;
    } finally {
      element.dispatchEvent(new CustomEvent('upload-complete'));
      stack.pop();
    }
  };
}

// Ask the backend to download a remote image (the browser cannot: cross-origin images have no CORS access).
export function createFetchImage(element: HTMLElement, opts: NuxtEditorOptions) {
  return async (imageUrl: string): Promise<string> => {
    element.dispatchEvent(new CustomEvent('upload-start'));

    const stack = useStack(opts.unicorn?.stack_name);
    stack.push(true);

    const { post } = await useHttpClient();

    try {
      const res = await post(opts.imageFetchUrl!, { url: imageUrl }, { withCredentials: false });
      element.dispatchEvent(new CustomEvent('upload-success'));

      return res.data.data.url;
    } catch (e) {
      element.dispatchEvent(new CustomEvent('upload-error', { detail: e }));
      console.error(e);
      throw e;
    } finally {
      element.dispatchEvent(new CustomEvent('upload-complete'));
      stack.pop();
    }
  };
}

const IMAGE_URL_RE = /^https?:\/\/\S+\.(png|jpe?g|gif|webp|svg|avif)(\?\S*)?$/i;

// Paste / drop image files: upload them and insert as images.
// Pasted remote images from non-own hosts are re-hosted through `imageFetchUrl` when configured.
function createPasteDropPlugins(
  ed: any,
  { Plugin, key, Decoration, DecorationSet }: Record<string, any>,
  uploadImage: UploadImage,
  opts: NuxtEditorOptions = {},
  fetchImage?: (url: string) => Promise<string>,
) {
  const ownHosts = opts.imageOwnHosts?.length ? opts.imageOwnHosts : [location.host];

  const isExternal = (src: string) => {
    try {
      const u = new URL(src, location.href);

      return /^https?:$/.test(u.protocol) && !ownHosts.includes(u.host) && !ownHosts.includes(u.hostname);
    } catch (e) {
      return false;
    }
  };

  // Fetch every external <img> of the HTML; a failed one keeps its original src.
  const rehostHtml = async (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const imgs = Array.from(doc.querySelectorAll('img')).filter((img) => isExternal(img.getAttribute('src') || ''));

    await Promise.all(imgs.map(async (img) => {
      try {
        img.setAttribute('src', await fetchImage!(img.getAttribute('src')!));
      } catch (e) {
        // keep the original
      }
    }));

    return doc.body.innerHTML;
  };

  const handleRemotePaste = (event: ClipboardEvent) => {
    if (!fetchImage) {
      return false;
    }

    const html = event.clipboardData?.getData('text/html') || '';
    const text = (event.clipboardData?.getData('text/plain') || '').trim();

    if (html && /<img\b/i.test(html)) {
      const hasExternal = Array.from(new DOMParser().parseFromString(html, 'text/html').querySelectorAll('img'))
        .some((img) => isExternal(img.getAttribute('src') || ''));

      if (!hasExternal) {
        return false;
      }

      rehostHtml(html).then((newHtml) => ed.chain().focus().insertContent(newHtml).run());

      return true;
    }

    if (IMAGE_URL_RE.test(text) && isExternal(text)) {
      fetchImage(text)
        .then((src) => ed.chain().focus().setImage({ src, alt: fileNameFromUrl(src) }).run())
        .catch(() => ed.chain().focus().insertContent(text).run());

      return true;
    }

    return false;
  };

  const insertFiles = (files: File[], pos?: number) => {
    const images = files.filter((f) => f.type.startsWith('image/'));

    if (!images.length) {
      return false;
    }

    (async () => {
      for (const file of images) {
        const id = {};
        const at = pos ?? ed.state.selection.from;

        ed.view.dispatch(ed.state.tr.setMeta(key, { add: { id, pos: at } }));

        const findPlaceholder = () => key.getState(ed.state).find(undefined, undefined, (s: any) => s.id === id)[0]?.from;

        try {
          const src = await uploadImage(file);
          const where = findPlaceholder();

          ed.view.dispatch(ed.state.tr.setMeta(key, { remove: id }));

          if (where != null) {
            ed.chain().focus().insertContentAt(where, { type: 'image', attrs: { src, alt: fileNameFromUrl(src) } }).run();
          }
        } catch (e) {
          ed.view.dispatch(ed.state.tr.setMeta(key, { remove: id }));
        }
      }
    })();

    return true;
  };

  return [
    new Plugin({
      key,
      state: {
        init: () => DecorationSet.empty,
        apply(tr: any, set: any) {
          set = set.map(tr.mapping, tr.doc);
          const meta = tr.getMeta(key);

          if (meta?.add) {
            const el = document.createElement('div');
            el.className = 'nuxt-upload-placeholder';
            el.setAttribute('contenteditable', 'false');
            el.innerHTML = '<span class="nuxt-upload-placeholder__icon"><svg width="24" height="24" viewBox="0 0 24 24" '
              + 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-6.2-8.55">'
              + '<animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" '
              + 'dur="1s" repeatCount="indefinite"/></path></svg></span>'
              + '<span class="nuxt-upload-placeholder__label">Uploading...</span>';

            set = set.add(tr.doc, [Decoration.widget(meta.add.pos, el, { id: meta.add.id, side: -1 })]);
          }

          if (meta?.remove) {
            set = set.remove(set.find(undefined, undefined, (s: any) => s.id === meta.remove));
          }

          return set;
        },
      },
      props: {
        decorations: (state: any) => key.getState(state),
        handlePaste: (_view: any, event: ClipboardEvent) =>
          insertFiles(Array.from(event.clipboardData?.files ?? [])) || handleRemotePaste(event),
        handleDrop: (view: any, event: DragEvent) => {
          const files = Array.from(event.dataTransfer?.files ?? []);
          const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos;

          return insertFiles(files, pos) && (event.preventDefault(), true);
        },
      },
    }),
  ];
}

// A TipTap extension (not `setOptions`, which UEditor overrides) wiring paste / drop of images.
export function createImagePasteDrop(
  { Extension, Plugin, PluginKey, Decoration, DecorationSet }: Record<string, any>,
  uploadImage: UploadImage,
  opts: NuxtEditorOptions = {},
  fetchImage?: (url: string) => Promise<string>,
) {
  const key = new PluginKey('imagePasteDrop');

  return Extension.create({
    name: 'imagePasteDrop',
    addProseMirrorPlugins() {
      return createPasteDropPlugins(this.editor, { Plugin, key, Decoration, DecorationSet }, uploadImage, opts, fetchImage);
    },
  });
}
