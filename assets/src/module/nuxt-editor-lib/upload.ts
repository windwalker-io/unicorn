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
    const stack = useStack(opts.unicorn?.stack_name);
    stack.push(true);

    const { post } = await useHttpClient();

    try {
      const res = await post(opts.imageFetchUrl!, { url: imageUrl }, { withCredentials: false });

      return res.data.data.url;
    } catch (e) {
      element.dispatchEvent(new CustomEvent('upload-error', { detail: e }));
      console.error(e);
      throw e;
    } finally {
      stack.pop();
    }
  };
}

const IMAGE_URL_RE = /^https?:\/\/\S+\.(png|jpe?g|gif|webp|svg|avif)(\?\S*)?$/i;

// Paste / drop image files: upload them and insert as images.
// Pasted remote images from non-own hosts are re-hosted through `imageFetchUrl` when configured.
export function setupImagePasteDrop(
  ed: any,
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
        const src = await uploadImage(file);
        const chain = ed.chain().focus();

        if (pos != null) {
          chain.insertContentAt(pos, { type: 'image', attrs: { src, alt: fileNameFromUrl(src) } });
        } else {
          chain.setImage({ src, alt: fileNameFromUrl(src) });
        }

        chain.run();
      }
    })();

    return true;
  };

  ed.setOptions({
    editorProps: {
      handlePaste: (_view: any, event: ClipboardEvent) =>
        insertFiles(Array.from(event.clipboardData?.files ?? [])) || handleRemotePaste(event),
      handleDrop: (view: any, event: DragEvent) => {
        const files = Array.from(event.dataTransfer?.files ?? []);
        const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos;

        return insertFiles(files, pos) && (event.preventDefault(), true);
      },
    },
  });
}
