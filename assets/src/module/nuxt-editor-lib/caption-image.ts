import { trans } from '../../service/lang';
import type { NuxtEditorOptions } from './types';

// Built-in TipTap Image extension options (passed to UEditor's `image` prop):
// `resize` enables TipTap's ResizableNodeView with left/right edge handles (keeps aspect ratio),
// and the style centers the <img> in both the editor and the saved HTML.
const imageOptions = {
  resize: {
    enabled: true,
    directions: ['left', 'right'],
    minWidth: 50,
    alwaysPreserveAspectRatio: true,
  },
  HTMLAttributes: {
    style: 'display:block;margin-left:auto;margin-right:auto;max-width:100%;height:auto;',
  },
};

// Image whose caption is output as <figure><img><figcaption>, plus an editable caption input under it.
// Wraps TipTap's resizable node view so resize handles keep working.
export function createCaptionImage(TiptapImage: any, mergeAttributes: any, opts: NuxtEditorOptions) {
  // Overridable through the `captionSyncAttrs` / `captionFigure` options.
  const captionOptions = {
    // Image attrs that mirror the caption text.
    syncAttrs: (opts.captionSyncAttrs ?? ['alt', 'title']) as string[],
    // Output the caption as <figure><figcaption> (true), or only save it into the synced attrs (false).
    figure: opts.captionFigure ?? false,
  };

  // When editing, always prefer the title, then the figcaption caption, then the other synced attrs.
  // An alt auto-filled from the file name is not a caption.
  const isAutoAlt = (node: any, value: string) => {
    const src = String(node.attrs.src || '').split(/[?#]/)[0];
    const name = decodeURIComponent(src.split('/').pop() || '');

    return value === name || value === name.replace(/\.[^.]+$/, '');
  };

  const readCaption = (node: any): string =>
    node.attrs.title
    || node.attrs.caption
    || (captionOptions.syncAttrs
      .map((a) => node.attrs[a])
      .find((v) => v && !isAutoAlt(node, String(v))) ?? '');

  return TiptapImage.extend({
    addAttributes() {
      return { ...(this as any).parent?.(), caption: { default: null, rendered: false } };
    },
    parseHTML() {
      return [
        {
          tag: 'figure',
          priority: 60,
          getAttrs: (el: HTMLElement) => {
            const img = el.querySelector('img');

            if (!img) {
              return false;
            }

            return {
              src: img.getAttribute('src'),
              alt: img.getAttribute('alt'),
              title: img.getAttribute('title'),
              width: img.getAttribute('width'),
              height: img.getAttribute('height'),
              caption: el.querySelector('figcaption')?.textContent || null,
            };
          },
        },
        ...((this as any).parent?.() ?? []),
      ];
    },
    renderHTML({ node, HTMLAttributes }: any) {
      const img = ['img', mergeAttributes((this as any).options.HTMLAttributes, HTMLAttributes)];

      if (!captionOptions.figure || !node.attrs.caption) {
        return img;
      }

      return [
        'figure',
        { style: 'margin:1em auto;text-align:center;' },
        img,
        ['figcaption', { style: 'font-size:.875em;color:var(--bs-secondary-color,#6c757d);margin-top:.25rem;' }, node.attrs.caption],
      ];
    },
    addNodeView() {
      const parent = (this as any).parent?.();

      if (!parent) {
        return null;
      }

      return (props: any) => {
        const inner = parent(props);
        const wrap = document.createElement('div');
        const input = document.createElement('input');

        input.className = 'nuxt-editor-caption';
        input.placeholder = trans('unicorn.nuxt.editor.field.caption.placeholder');
        input.value = readCaption(props.node);

        const toggle = (selected = false) => {
          input.style.display = selected || input.value ? '' : 'none';
        };

        // Write the caption (and the mirrored attrs) into the node. An empty caption keeps alt/title untouched.
        const commit = () => {
          const pos = props.getPos();

          if (typeof pos !== 'number') {
            return;
          }

          const tr = props.view.state.tr.setNodeAttribute(pos, 'caption', input.value || null);

          if (input.value) {
            for (const attr of captionOptions.syncAttrs) {
              tr.setNodeAttribute(pos, attr, input.value);
            }
          }

          props.view.dispatch(tr);
        };

        input.addEventListener('input', commit);
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            props.editor.commands.focus();
          }
        });

        wrap.append(inner.dom, input);
        toggle();

        return {
          dom: wrap,
          update(node: any, ...rest: any[]) {
            if (!inner.update(node, ...rest)) {
              return false;
            }

            if (document.activeElement !== input) {
              input.value = readCaption(node);
            }

            return true;
          },
          selectNode() {
            inner.selectNode?.();
            toggle(true);
          },
          deselectNode() {
            inner.deselectNode?.();
            toggle();
          },
          stopEvent: (e: Event) => e.target === input || !!inner.stopEvent?.(e),
          ignoreMutation: (m: any) => !inner.dom.contains(m.target) || !!inner.ignoreMutation?.(m),
          destroy: () => inner.destroy?.(),
        };
      };
    },
  }).configure(imageOptions);
}
