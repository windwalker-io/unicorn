import { convertUrlToEmbedUrl, getProviderFromUrl } from '@social-embed/lib';

export interface VideoSource {
  type: 'iframe' | 'video';
  src: string;
  /** Height as a percentage of the width (padding-bottom box). Default 56.25 (16:9). */
  ratio?: number | null;
  /** Fixed height in px, used instead of `ratio` (e.g. a Spotify player). */
  height?: number | null;
  title?: string | null;
}

const FILE_RE = /\.(mp4|webm|ogv|ogg|mov|m4v)$/i;
const DEFAULT_RATIO = 56.25;

const num = (v: string | null) => (v && /^\d+(\.\d+)?(px)?$/.test(v.trim()) ? parseFloat(v) : null);

// Parse pasted `<iframe ...></iframe>` code into a safe source: only http(s) `src`, size, title are kept
// (srcdoc, sandbox, event handlers and any other attribute are dropped). Returns null when it is not a lone iframe.
export function parseIframeCode(input: string): VideoSource | null {
  const text = input.trim();

  if (!/^<iframe[\s>]/i.test(text)) {
    return null;
  }

  const body = new DOMParser().parseFromString(text, 'text/html').body;
  const el = body.childNodes.length === 1 ? body.firstElementChild : null;

  if (el?.tagName !== 'IFRAME') {
    return null;
  }

  let src: URL;

  try {
    src = new URL(el.getAttribute('src') || '', 'https://placeholder.invalid');
  } catch {
    return null;
  }

  if (!/^https?:$/.test(src.protocol) || src.hostname === 'placeholder.invalid') {
    return null;
  }

  const width = num(el.getAttribute('width'));
  const height = num(el.getAttribute('height'));
  const ratio = width && height ? Math.round((height / width) * 10000) / 100 : null;

  return {
    type: 'iframe',
    src: src.href,
    ratio: ratio ?? (height ? null : DEFAULT_RATIO),
    height: ratio ? null : height,
    title: el.getAttribute('title'),
  };
}

// Accepts a video page URL, a direct video file URL or `<iframe>` embed code.
export function parseEmbedInput(input: string): VideoSource | null {
  return parseIframeCode(input) ?? parseVideoUrl(input);
}

// Convert a video page URL into its embeddable source: providers (YouTube, Vimeo, Loom, Dailymotion...) are
// resolved by @social-embed/lib; Bilibili and direct video files are handled here.
// Returns null when the URL is not supported.
export function parseVideoUrl(input: string): VideoSource | null {
  let url: URL;

  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }

  if (!/^https?:$/.test(url.protocol)) {
    return null;
  }

  if (FILE_RE.test(url.pathname)) {
    return { type: 'video', src: url.href };
  }

  const host = url.hostname.replace(/^(www|m)\./, '');

  if (host === 'bilibili.com') {
    const bvid = url.pathname.split('/').find((p) => /^BV\w+$/i.test(p));

    return bvid ? { type: 'iframe', src: `https://player.bilibili.com/player.html?bvid=${bvid}&autoplay=0` } : null;
  }

  let src = convertUrlToEmbedUrl(url.href);

  if (!src) {
    return null;
  }

  const start = url.searchParams.get('t') || url.searchParams.get('start');

  if (getProviderFromUrl(url.href)?.name === 'YouTube' && start && /^\d+s?$/.test(start)) {
    src += `?start=${parseInt(start, 10)}`;
  }

  return { type: 'iframe', src };
}
// Block node `videoEmbed` (video URLs and pasted <iframe> code). Output:
// <p data-video-embed style="box"><iframe|video></p> (an iframe is phrasing content, so it is valid inside <p>).
export function createVideoEmbed(
  { Node, mergeAttributes, Plugin, PluginKey }: Record<string, any>,
) {
  const box = (ratio?: number | null, height?: number | null) => 'position:relative;width:100%;overflow:hidden;'
    + (height ? `height:${height}px;` : `padding-bottom:${ratio || DEFAULT_RATIO}%;height:0;`);
  const FILL = 'position:absolute;top:0;left:0;width:100%;height:100%;border:0;';
  const ALLOW = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';

  const mediaAttrs = (a: Record<string, any>) => a.type === 'video'
    ? { src: a.src, controls: '', style: FILL }
    : {
      src: a.src,
      style: FILL,
      allowfullscreen: '',
      loading: 'lazy',
      allow: ALLOW,
      ...(a.title ? { title: a.title } : {}),
    };

  const build = (a: Record<string, any>) => {
    const el = document.createElement(a.type === 'video' ? 'video' : 'iframe');

    Object.entries(mediaAttrs(a)).forEach(([k, v]) => el.setAttribute(k, v as string));

    return el;
  };

  const parseBox = (el: HTMLElement) => {
    const media = el.querySelector('iframe, video');

    return media
      ? {
        src: media.getAttribute('src'),
        type: media.tagName === 'VIDEO' ? 'video' : 'iframe',
        title: media.getAttribute('title'),
        ratio: num(el.getAttribute('data-ratio')),
        height: num(el.getAttribute('data-height')),
      }
      : false;
  };

  return Node.create({
    name: 'videoEmbed',
    group: 'block',
    atom: true,
    draggable: true,
    selectable: true,

    addAttributes() {
      return {
        src: { default: null, rendered: false },
        type: { default: 'iframe', rendered: false },
        ratio: { default: null, rendered: false },
        height: { default: null, rendered: false },
        title: { default: null, rendered: false },
      };
    },

    // `p` must outrank the paragraph rule; `div` keeps content saved by older versions loadable.
    parseHTML() {
      return [
        { tag: 'p[data-video-embed]', priority: 100, getAttrs: parseBox },
        { tag: 'div[data-video-embed]', getAttrs: parseBox },
      ];
    },

    renderHTML({ node, HTMLAttributes }: any) {
      const a = node.attrs;
      const extra: Record<string, any> = { 'data-video-embed': '', style: box(a.ratio, a.height) + 'margin:0 0 1rem;' };

      if (a.height) {
        extra['data-height'] = a.height;
      } else if (a.ratio) {
        extra['data-ratio'] = a.ratio;
      }

      return ['p', mergeAttributes(HTMLAttributes, extra), [a.type === 'video' ? 'video' : 'iframe', mediaAttrs(a)]];
    },

    // The overlay keeps the iframe from swallowing clicks, so the block can be selected and dragged.
    addNodeView() {
      return ({ node }: any) => {
        const dom = document.createElement('div');
        dom.setAttribute('data-video-embed', '');
        dom.setAttribute('style', box(node.attrs.ratio, node.attrs.height) + 'margin:1rem 0;background:#000;border-radius:.375rem;');
        dom.append(build(node.attrs));

        const overlay = document.createElement('div');
        overlay.setAttribute('style', 'position:absolute;inset:0;cursor:grab;');
        dom.append(overlay);

        return {
          dom,
          selectNode: () => { dom.style.outline = '2px solid var(--ui-primary, #3b82f6)'; },
          deselectNode: () => { dom.style.outline = ''; },
        };
      };
    },

    addCommands() {
      return {
        setVideoEmbed: (input: string) => ({ commands }: any) => {
          const source = parseEmbedInput(input);

          return source
            ? commands.insertContent({ type: this.name, attrs: attrsOf(source) })
            : false;
        },
      };
    },

    addStorage() {
      return { key: new PluginKey('videoEmbedPaste') };
    },

    // Pasting a bare video URL or <iframe> code into an empty paragraph keeps the pasted text, then offers
    // (plugin state `{ from, to, source }`, shown by the paste prompt) to turn it into the embed.
    addProseMirrorPlugins() {
      const key = this.storage.key;
      let pending: { text: string; source: VideoSource } | null = null;

      return [new Plugin({
        key,
        state: {
          init: () => null,
          apply(tr: any, value: any) {
            const meta = tr.getMeta(key);

            if (meta !== undefined) {
              return meta;
            }

            if (value && (tr.docChanged || tr.selection.from !== value.to)) {
              return null;
            }

            return value;
          },
        },
        // Picks up the text the default paste just inserted, in the same update (a meta-only transaction would
        // not make the bubble menu re-evaluate).
        appendTransaction(_trs: any, _old: any, state: any) {
          if (!pending) {
            return null;
          }

          const { text, source } = pending;
          const { $from, empty } = state.selection;

          if (!empty || $from.parent.textContent !== text || $from.parentOffset !== text.length) {
            return null;
          }

          pending = null;

          return state.tr.setMeta(key, { from: $from.start(), to: $from.pos, source });
        },
        props: {
          // A DOM handler (not handlePaste) so it still runs when the Link extension handles the paste itself.
          handleDOMEvents: {
            paste(view: any, event: ClipboardEvent) {
              const text = event.clipboardData?.getData('text/plain')?.trim();
              const source = text ? parseEmbedInput(text) : null;
              const { $from, empty } = view.state.selection;

              pending = null;

              if (source && text && empty && $from.parent.type.name === 'paragraph' && !$from.parent.content.size) {
                pending = { text, source };
                setTimeout(() => { pending = null; }, 0);
              }

              return false;
            },
          },
        },
      })];
    },
  });
}

export const attrsOf = (s: VideoSource) => ({
  src: s.src, type: s.type, ratio: s.ratio ?? null, height: s.height ?? null, title: s.title ?? null,
});
