import { createApp, defineComponent, h, onBeforeUnmount, ref, shallowRef, watch, type App } from 'vue';
import { useHttpClient, useStack } from '../composable';
import { selectOne } from '../service';
import { mergeDeep } from '../utilities';
// Resolved by the host Vite (@nuxt/ui/vite + Tailwind). Do not bundle here.
// @ts-ignore
import css from '@windwalker-io/unicorn-next/src/css/nuxt-editor.css?inline';

/**
 * How to customize a toolbar:
 * - `false`: hide it.
 * - array: replace the default items.
 * - function: receive the default items and return the new ones (add / remove / reorder).
 * Items are Nuxt UI `UEditorToolbar` items (`kind`, `onClick`, `slot`...), so functions are only
 * available from JS; PHP can only pass plain-data arrays or `false` (it is JSON).
 */
export type NuxtEditorToolbarOverride =
  | false
  | any[]
  | ((defaults: any[], ctx: { editor: any; options: NuxtEditorOptions }) => any[] | void);

export interface NuxtEditorToolbars {
  /** Fixed toolbar above the editor. */
  fixed?: NuxtEditorToolbarOverride;
  /** Floating toolbar on text selection. */
  textBubble?: NuxtEditorToolbarOverride;
  /** Floating toolbar of a selected image. */
  imageBubble?: NuxtEditorToolbarOverride;
  /** The "/" slash menu (grouped items). */
  slash?: NuxtEditorToolbarOverride;
  /** The drag handle's block menu. */
  blockMenu?: NuxtEditorToolbarOverride;
}

export interface NuxtEditorOptions {
  toolbars?: NuxtEditorToolbars;
  props?: Record<string, any>;
  format?: 'html' | 'markdown' | 'json';
  locale?: string;
  readonly?: boolean;
  imageUploadUrl?: string;
  captionSyncAttrs?: string[];
  captionLive?: boolean;
  unicorn?: { stack_name?: string };
  [key: string]: any;
}

export interface NuxtEditorController {
  element: HTMLTextAreaElement;
  options: NuxtEditorOptions;
  readonly editor: any;
  getValue(): string;
  setValue(value: string): void;
  insert(content: string): void;
  setEditable(editable: boolean): void;
  destroy(): void;
}

export interface NuxtEditorModule {
  get(selector: string | HTMLElement, options?: NuxtEditorOptions): Promise<NuxtEditorController>;
  create(selector: string | HTMLElement, options?: NuxtEditorOptions): Promise<NuxtEditorController>;
  destroy(selector: string | HTMLElement): void;
}

// textarea element -> controller, so one textarea only has one editor.
const instances = new WeakMap<HTMLElement, NuxtEditorController>();

// Global toolbar overrides applied to every editor (per-editor `options.toolbars` win). Set via `configure()`.
const globalToolbars: NuxtEditorToolbars = {};

// Register global overrides, e.g. from a script loaded before the editors are created.
export function configure(options: { toolbars?: NuxtEditorToolbars }) {
  Object.assign(globalToolbars, options.toolbars);
}

// Return the existing editor of the textarea, or create a new one.
export async function get(selector: string | HTMLElement, options: NuxtEditorOptions = {}) {
  const element = selectOne<HTMLTextAreaElement>(selector as any);

  if (!element) {
    throw new Error(`Nuxt editor element: ${selector} not found.`);
  }

  return instances.get(element) ?? create(element, options);
}

// Always (re)create the editor, destroying the previous one first.
export async function create(selector: string | HTMLElement, options: NuxtEditorOptions = {}) {
  const element = selectOne<HTMLTextAreaElement>(selector as any);

  if (!element) {
    throw new Error(`Nuxt editor element: ${selector} not found.`);
  }

  instances.get(element)?.destroy();

  const controller = await mount(element, options);
  instances.set(element, controller);

  return controller;
}

export function destroy(selector: string | HTMLElement) {
  const element = selectOne<HTMLTextAreaElement>(selector as any);

  if (element) {
    instances.get(element)?.destroy();
    instances.delete(element);
  }
}

// Build the Vue app (Nuxt UI UEditor) next to the textarea and keep both in sync.
async function mount(element: HTMLTextAreaElement, options: NuxtEditorOptions): Promise<NuxtEditorController> {
  // Lazy-load Nuxt UI components, TipTap and the locale/plugin, so they are only fetched when an editor is used.
  const [
    { default: UApp },
    { default: UEditor },
    { default: UEditorToolbar },
    { default: UEditorDragHandle },
    { default: UEditorSuggestionMenu },
    { default: UDropdownMenu },
    { default: UButton },
    { default: UFileUpload },
    { default: UAvatar },
    { default: UPopover },
    { default: UTooltip },
    { default: UInput },
    { default: USeparator },
    { Node, mergeAttributes },
    { TextAlign },
    { default: TiptapImage },
    { VueNodeViewRenderer, NodeViewWrapper, nodeViewProps },
    { mapEditorItems },
    { default: ui },
    locales,
  ] = await Promise.all([
    // @ts-ignore
    import('@nuxt/ui/components/App.vue'),
    // @ts-ignore
    import('@nuxt/ui/components/Editor.vue'),
    // @ts-ignore
    import('@nuxt/ui/components/EditorToolbar.vue'),
    // @ts-ignore
    import('@nuxt/ui/components/EditorDragHandle.vue'),
    // @ts-ignore
    import('@nuxt/ui/components/EditorSuggestionMenu.vue'),
    // @ts-ignore
    import('@nuxt/ui/components/DropdownMenu.vue'),
    // @ts-ignore
    import('@nuxt/ui/components/Button.vue'),
    // @ts-ignore
    import('@nuxt/ui/components/FileUpload.vue'),
    // @ts-ignore
    import('@nuxt/ui/components/Avatar.vue'),
    // @ts-ignore
    import('@nuxt/ui/components/Popover.vue'),
    // @ts-ignore
    import('@nuxt/ui/components/Tooltip.vue'),
    // @ts-ignore
    import('@nuxt/ui/components/Input.vue'),
    // @ts-ignore
    import('@nuxt/ui/components/Separator.vue'),
    // @ts-ignore
    import('@tiptap/core'),
    // @ts-ignore
    import('@tiptap/extension-text-align'),
    // @ts-ignore
    import('@tiptap/extension-image'),
    // @ts-ignore
    import('@tiptap/vue-3'),
    // @ts-ignore
    import('@nuxt/ui/utils/editor'),
    // @ts-ignore
    import('@nuxt/ui/vue-plugin'),
    import('@nuxt/ui/locale'),
  ]) as any;

  const opts: NuxtEditorOptions = mergeDeep({ format: 'html', props: {}, unicorn: {} }, options);
  const format = opts.format!;

  // Host + shadow root: isolate Tailwind from Bootstrap
  const host = document.createElement('div');
  host.className = 'c-nuxt-editor';
  const shadow = host.attachShadow({ mode: 'open' });

  const sheet = new CSSStyleSheet();
  sheet.replaceSync(css as string);
  shadow.adoptedStyleSheets = [sheet];

  // `@property` rules are ignored inside shadow roots, hoist them to document.
  const properties = Array.from(sheet.cssRules)
    .flatMap((r) => collectProperties(r))
    .join('\n');

  if (properties && !document.getElementById('nuxt-editor-properties')) {
    const style = document.createElement('style');
    style.id = 'nuxt-editor-properties';
    style.textContent = properties;
    document.head.appendChild(style);
  }

  // `root` hosts the Vue app; `portal` receives popovers/menus so they also live inside the shadow root.
  const portal = document.createElement('div');
  const root = document.createElement('div');
  root.className = 'nuxt-ui-root';
  shadow.append(root, portal);

  // Hide the original textarea (it stays in the form as the submitted value).
  element.style.display = 'none';
  element.after(host);

  // Reactive state: editor content, the TipTap instance and the editable flag.
  const content = ref<any>(parseValue(element.value, format));
  const editor = shallowRef<any>(null);
  const editable = ref(!(opts.readonly || element.readOnly || element.disabled));

  // Apply the user's toolbar override (hide / replace / transform) to the default items of `key`.
  const toolbars: NuxtEditorToolbars = { ...globalToolbars, ...options.toolbars };
  const resolveItems = (key: keyof NuxtEditorToolbars, defaults: any[], ed: any): any[] => {
    const override = toolbars[key];

    if (override === false) {
      return [];
    }

    if (Array.isArray(override)) {
      return override;
    }

    if (typeof override === 'function') {
      return override(defaults, { editor: ed, options: opts }) ?? defaults;
    }

    return defaults;
  };

  const syncing = { value: false };

  // Convert editor content to the string stored in the textarea.
  function serialize(value: any): string {
    return format === 'json' ? JSON.stringify(value) : (value ?? '');
  }

  // Write editor content back to the textarea and fire input/change for form listeners.
  function onUpdate() {
    syncing.value = true;
    element.value = serialize(content.value);
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    syncing.value = false;
  }

  // POST the file to `imageUploadUrl`, show the unicorn loading stack, and return the uploaded URL.
  async function uploadImage(file: File): Promise<string> {
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
  }

  // Shared toolbar pieces (same layout as the Nuxt UI editor example).
  const headingLevels = [1, 2, 3, 4];
  const marksGroup = [
    { kind: 'mark', mark: 'bold', icon: 'i-lucide-bold', tooltip: { text: 'Bold' } },
    { kind: 'mark', mark: 'italic', icon: 'i-lucide-italic', tooltip: { text: 'Italic' } },
    { kind: 'mark', mark: 'underline', icon: 'i-lucide-underline', tooltip: { text: 'Underline' } },
    { kind: 'mark', mark: 'strike', icon: 'i-lucide-strikethrough', tooltip: { text: 'Strikethrough' } },
    { kind: 'mark', mark: 'code', icon: 'i-lucide-code', tooltip: { text: 'Code' } },
  ];
  const imageButton = () => opts.imageUploadUrl
    ? [{ kind: 'uploadImage', icon: 'i-lucide-image', tooltip: { text: 'Image' } }]
    : [];
  const alignDropdown = {
    icon: 'i-lucide-align-justify',
    tooltip: { text: 'Text Align' },
    content: { align: 'end' },
    items: (['left', 'center', 'right', 'justify'] as const).map((align) => ({
      kind: 'textAlign',
      align,
      icon: `i-lucide-align-${align}`,
      label: `Align ${align[0].toUpperCase()}${align.slice(1)}`,
    })),
  };

  // Fixed toolbar above the editor: history, block types, marks, link/image, text align.
  function toolbarItems() {
    return [
      [
        { kind: 'undo', icon: 'i-lucide-undo', tooltip: { text: 'Undo' } },
        { kind: 'redo', icon: 'i-lucide-redo', tooltip: { text: 'Redo' } },
      ],
      [
        {
          icon: 'i-lucide-heading',
          tooltip: { text: 'Headings' },
          content: { align: 'start' },
          items: headingLevels.map((level) => ({
            kind: 'heading', level, icon: `i-lucide-heading-${level}`, label: `Heading ${level}`,
          })),
        },
        {
          icon: 'i-lucide-list',
          tooltip: { text: 'Lists' },
          content: { align: 'start' },
          items: [
            { kind: 'bulletList', icon: 'i-lucide-list', label: 'Bullet List' },
            { kind: 'orderedList', icon: 'i-lucide-list-ordered', label: 'Ordered List' },
          ],
        },
        { kind: 'blockquote', icon: 'i-lucide-text-quote', tooltip: { text: 'Blockquote' } },
        { kind: 'codeBlock', icon: 'i-lucide-square-code', tooltip: { text: 'Code Block' } },
        { kind: 'horizontalRule', icon: 'i-lucide-separator-horizontal', tooltip: { text: 'Horizontal Rule' } },
      ],
      marksGroup,
      [{ slot: 'link', icon: 'i-lucide-link' }, ...imageButton()],
      [alignDropdown],
    ];
  }

  // Bubble toolbar shown on a text selection: "Turn into", marks, link/image, text align.
  function textBubbleItems() {
    return [
      [{
        label: 'Turn into',
        trailingIcon: 'i-lucide-chevron-down',
        activeColor: 'neutral',
        activeVariant: 'ghost',
        tooltip: { text: 'Turn into' },
        content: { align: 'start' },
        ui: { label: 'text-xs' },
        items: [
          { type: 'label', label: 'Turn into' },
          { kind: 'paragraph', label: 'Paragraph', icon: 'i-lucide-type' },
          ...headingLevels.map((level) => ({
            kind: 'heading', level, icon: `i-lucide-heading-${level}`, label: `Heading ${level}`,
          })),
          { kind: 'bulletList', icon: 'i-lucide-list', label: 'Bullet List' },
          { kind: 'orderedList', icon: 'i-lucide-list-ordered', label: 'Ordered List' },
          { kind: 'blockquote', icon: 'i-lucide-text-quote', label: 'Blockquote' },
          { kind: 'codeBlock', icon: 'i-lucide-square-code', label: 'Code Block' },
        ],
      }],
      marksGroup,
      [{ slot: 'link', icon: 'i-lucide-link' }, ...imageButton()],
      [alignDropdown],
    ];
  }

  // Bubble toolbar shown when an image is selected: caption, download, replace, delete.
  function imageBubbleItems(ed: any) {
    const node = ed.state.doc.nodeAt(ed.state.selection.from);

    // The caption is stored in the image `caption` attribute (see CaptionImage).
    // Focus the caption input rendered under the selected image.
    const editCaption = () => {
      const pos = ed.state.selection.from;
      const input = (ed.view.nodeDOM(pos) as HTMLElement | null)?.querySelector?.('input.nuxt-editor-caption') as HTMLInputElement | null;
      input?.focus();
    };

    const download = () => {
      const a = document.createElement('a');
      a.href = node?.attrs?.src;
      a.download = '';
      a.click();
    };

    // Pick a new file, upload it, and swap the `src` of the selected image.
    const replace = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async () => {
        const file = input.files?.[0];

        if (file) {
          const src = await uploadImage(file);
          ed.chain().focus().updateAttributes('image', { src }).run();
        }
      };
      input.click();
    };

    return [
      [
        { icon: 'i-lucide-text-cursor-input', tooltip: { text: 'Caption' }, onClick: editCaption },
        { icon: 'i-lucide-external-link', tooltip: { text: 'Open in new window' }, onClick: () => window.open(node?.attrs?.src, '_blank', 'noopener,noreferrer') },
        { icon: 'i-lucide-download', tooltip: { text: 'Download' }, onClick: download },
        ...(opts.imageUploadUrl
          ? [{ icon: 'i-lucide-replace', tooltip: { text: 'Replace' }, onClick: replace }]
          : []),
      ],
      [{ icon: 'i-lucide-trash', color: 'error', tooltip: { text: 'Delete' }, onClick: () => ed.chain().focus().deleteSelection().run() }],
    ];
  }

  // The block the drag handle currently points at, used by the block menu.
  const selectedNode = shallowRef<{ node: any, pos: number } | undefined>();

  // Items of the "/" slash menu.
  const suggestionItems = [
    { type: 'label', label: 'Style' },
    { kind: 'paragraph', label: 'Paragraph', icon: 'i-lucide-type' },
    ...[1, 2, 3].map((level) => ({
      kind: 'heading', level, label: `Heading ${level}`, icon: `i-lucide-heading-${level}`,
    })),
    { kind: 'bulletList', label: 'Bullet List', icon: 'i-lucide-list' },
    { kind: 'orderedList', label: 'Numbered List', icon: 'i-lucide-list-ordered' },
    { kind: 'blockquote', label: 'Blockquote', icon: 'i-lucide-text-quote' },
    { kind: 'codeBlock', label: 'Code Block', icon: 'i-lucide-square-code' },
    { type: 'label', label: 'Insert' },
    ...(opts.imageUploadUrl
      ? [{ kind: 'uploadImage', label: 'Image', icon: 'i-lucide-image' }]
      : []),
    { kind: 'horizontalRule', label: 'Horizontal Rule', icon: 'i-lucide-separator-horizontal' },
  ].reduce<any[][]>((groups, item: any) => {
    if (item.type === 'label') {
      groups.push([item]);
    } else {
      groups[groups.length - 1].push(item);
    }

    return groups;
  }, []);

  // Dropdown of the drag handle's grip button: turn into, reset, duplicate, move, delete the current block.
  function blockMenuItems(ed: any) {
    const sel = selectedNode.value;

    if (!sel?.node?.type) {
      return [];
    }

    const pos = sel.pos;

    return mapEditorItems(ed, resolveItems('blockMenu', [[
      {
        label: 'Turn into',
        icon: 'i-lucide-repeat-2',
        children: [
          { kind: 'paragraph', label: 'Paragraph', icon: 'i-lucide-type' },
          ...[1, 2, 3, 4].map((level) => ({
            kind: 'heading', level, label: `Heading ${level}`, icon: `i-lucide-heading-${level}`,
          })),
          { kind: 'bulletList', label: 'Bullet List', icon: 'i-lucide-list' },
          { kind: 'orderedList', label: 'Ordered List', icon: 'i-lucide-list-ordered' },
          { kind: 'blockquote', label: 'Blockquote', icon: 'i-lucide-text-quote' },
          { kind: 'codeBlock', label: 'Code Block', icon: 'i-lucide-square-code' },
        ],
      },
      { kind: 'clearFormatting', pos, label: 'Reset formatting', icon: 'i-lucide-rotate-ccw' },
    ], [
      { kind: 'duplicate', pos, label: 'Duplicate', icon: 'i-lucide-copy' },
      {
        label: 'Copy to clipboard',
        icon: 'i-lucide-clipboard',
        onSelect: () => navigator.clipboard.writeText(sel.node.textContent),
      },
    ], [
      { kind: 'moveUp', pos, label: 'Move up', icon: 'i-lucide-arrow-up' },
      { kind: 'moveDown', pos, label: 'Move down', icon: 'i-lucide-arrow-down' },
    ], [
      { kind: 'delete', pos, label: 'Delete', icon: 'i-lucide-trash' },
    ]], ed));
  }

  // Node view of the `imageUpload` placeholder: a dropzone that uploads the file,
  // then replaces itself with a real image node.
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
              .setImage({ src, alt: newFile.name })
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
          label: 'Upload an image',
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

  // Link button + popover (port of the docs' EditorLinkPopover): set, open and remove a link on the selection.
  const LinkPopover = defineComponent({
    props: { editor: { type: Object, required: true } },
    setup(props: any) {
      const open = ref(false);
      const url = ref('');

      const syncUrl = () => {
        url.value = props.editor.getAttributes('link').href || '';
      };

      props.editor.on('selectionUpdate', syncUrl);
      onBeforeUnmount(() => props.editor.off('selectionUpdate', syncUrl));
      syncUrl();

      const setLink = () => {
        if (!url.value) {
          return;
        }

        const empty = props.editor.state.selection.empty;
        let chain = props.editor.chain().focus();

        if (props.editor.isActive('code') && !empty) {
          chain = chain.extendMarkRange('code').setLink({ href: url.value });
        } else {
          chain = chain.extendMarkRange('link').setLink({ href: url.value });

          if (empty) {
            chain = chain.insertContent({ type: 'text', text: url.value });
          }
        }

        chain.run();
        open.value = false;
      };

      const removeLink = () => {
        props.editor.chain().focus().extendMarkRange('link').unsetLink().setMeta('preventAutolink', true).run();
        url.value = '';
        open.value = false;
      };

      const btn = (icon: string, title: string, onClick: () => void) => h(UButton, {
        icon, title, onClick, color: 'neutral', variant: 'ghost', size: 'sm',
        disabled: !url.value && !props.editor.isActive('link'),
      });

      return () => {
        const active = props.editor.isActive('link');
        const disabled = !props.editor.isEditable || (props.editor.state.selection.empty && !active);

        return h(UPopover, { open: open.value, 'onUpdate:open': (v: boolean) => (open.value = v), ui: { content: 'p-0.5' } }, {
          default: () => h(UTooltip, { text: 'Link' }, () => h(UButton, {
            icon: 'i-lucide-link', color: 'neutral', activeColor: 'primary', variant: 'ghost',
            activeVariant: 'soft', size: 'sm', active, disabled,
          })),
          content: () => h(UInput, {
            modelValue: url.value,
            'onUpdate:modelValue': (v: string) => (url.value = v),
            autofocus: true,
            type: 'url',
            variant: 'none',
            placeholder: 'Paste a link...',
            onKeydown: (e: KeyboardEvent) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                setLink();
              }
            },
          }, {
            default: () => h('div', { class: 'flex items-center mr-0.5' }, [
              btn('i-lucide-corner-down-left', 'Apply link', setLink),
              h(USeparator, { orientation: 'vertical', class: 'h-6 mx-1' }),
              btn('i-lucide-external-link', 'Open in new window', () => window.open(url.value, '_blank', 'noopener,noreferrer')),
              btn('i-lucide-trash', 'Remove link', removeLink),
            ]),
          }),
        });
      };
    },
  });

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

  // Overridable through the `captionSyncAttrs` / `captionLive` options.
  const captionOptions = {
    // Image attrs that mirror the caption text.
    syncAttrs: (opts.captionSyncAttrs ?? ['alt', 'title']) as string[],
    // Reflect typing into the output HTML immediately (true) or on blur/Enter (false).
    live: opts.captionLive ?? true,
  };

  // Image whose caption is output as <figure><img><figcaption>, plus an editable caption input under it.
  // Wraps TipTap's resizable node view so resize handles keep working.
  const CaptionImage = TiptapImage.extend({
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

      if (!node.attrs.caption) {
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
        let current = props.node;

        input.className = 'nuxt-editor-caption';
        input.placeholder = 'Add a caption...';
        input.value = current.attrs.caption || '';

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

        // live: update the HTML on every keystroke; otherwise only when the input loses focus / Enter.
        input.addEventListener(captionOptions.live ? 'input' : 'change', commit);
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

            current = node;

            if (document.activeElement !== input) {
              input.value = node.attrs.caption || '';
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

  // Custom `kind: 'uploadImage'` handler, used by the toolbar and slash menu to insert the placeholder.
  const customHandlers = {
    uploadImage: {
      canExecute: (ed: any) => ed.can().insertContent({ type: 'imageUpload' }),
      execute: (ed: any) => ed.chain().focus().insertContent({ type: 'imageUpload' }),
      isActive: (ed: any) => ed.isActive('imageUpload'),
      isDisabled: undefined,
    },
  };

  // Pick the Nuxt UI locale from options, fallback to English.
  const localeKey = (opts.locale || '').replace('-', '_');
  const locale = locales[localeKey] ?? locales.en;

  // Root Vue app: UApp > UEditor, with toolbar / slash menu / drag handle in the default slot.
  const app: App = createApp({
    setup() {
      return () => h(UApp, { locale, portal }, () =>
        h(UEditor, {
          modelValue: content.value,
          'onUpdate:modelValue': (v: any) => {
            content.value = v;
            onUpdate();
          },
          contentType: format,
          handlers: customHandlers,
          image: false,
          extensions: [
            CaptionImage,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            ...(opts.imageUploadUrl ? [ImageUpload] : []),
          ],
          placeholder: "Write, type '/' for commands...",
          editable: editable.value,
          class: 'w-full',
          ui: { base: 'p-4 pl-16 sm:p-4 sm:pl-16 min-h-48 border border-default rounded-md' },
          onCreate: ({ editor: ed }: any) => {
            editor.value = ed;

            // Paste / drop image files: upload them and insert as images.
            if (opts.imageUploadUrl) {
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
                      chain.insertContentAt(pos, { type: 'image', attrs: { src, alt: file.name } });
                    } else {
                      chain.setImage({ src, alt: file.name });
                    }

                    chain.run();
                  }
                })();

                return true;
              };

              ed.setOptions({
                editorProps: {
                  handlePaste: (_view: any, event: ClipboardEvent) =>
                    insertFiles(Array.from(event.clipboardData?.files ?? [])),
                  handleDrop: (view: any, event: DragEvent) => {
                    const files = Array.from(event.dataTransfer?.files ?? []);
                    const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos;

                    return insertFiles(files, pos) && (event.preventDefault(), true);
                  },
                },
              });
            }

            element.dispatchEvent(new CustomEvent('nuxt-editor:create', { detail: ed }));
          },
          ...opts.props,
        }, {
          default: ({ editor: ed, handlers }: any) => {
            if (!editable.value) {
              return null;
            }

            const fixedItems = resolveItems('fixed', toolbarItems(), ed);
            const textItems = resolveItems('textBubble', textBubbleItems(), ed);
            const imageItems = resolveItems('imageBubble', imageBubbleItems(ed), ed);
            const slashItems = resolveItems('slash', suggestionItems, ed);

            return [
                fixedItems.length && h(UEditorToolbar, {
                  editor: ed,
                  items: fixedItems,
                  class: 'border-b border-default py-2 overflow-x-auto',
                }, { link: () => h(LinkPopover, { editor: ed }) }),
                slashItems.length && h(UEditorSuggestionMenu, { editor: ed, items: slashItems }),
                // Floating toolbars: text selection and selected image.
                textItems.length && h(UEditorToolbar, {
                  editor: ed,
                  items: textItems,
                  layout: 'bubble',
                  shouldShow: ({ editor: e, view, state }: any) =>
                    view.hasFocus() && !state.selection.empty && !e.isActive('image') && !e.isActive('imageUpload') && !e.isActive('codeBlock'),
                }, { link: () => h(LinkPopover, { editor: ed }) }),
                imageItems.length && h(UEditorToolbar, {
                  editor: ed,
                  items: imageItems,
                  layout: 'bubble',
                  shouldShow: ({ editor: e, view }: any) => e.isActive('image') && view.hasFocus(),
                }),
                // Left-side handle: "+" opens the suggestion menu, grip opens the block menu (and drags).
                h(UEditorDragHandle, {
                  editor: ed,
                  onNodeChange: (node: any) => {
                    selectedNode.value = node;
                  },
                }, {
                  default: ({ ui: handleUi, onClick }: any) => [
                    h(UButton, {
                      icon: 'i-lucide-plus',
                      color: 'neutral',
                      variant: 'ghost',
                      size: 'sm',
                      class: handleUi.handle(),
                      onClick: (e: Event) => {
                        e.stopPropagation();
                        const selected = onClick();
                        handlers.suggestion?.execute(ed, { pos: selected?.pos }).run();
                      },
                    }),
                    h(UDropdownMenu, {
                      modal: false,
                      items: blockMenuItems(ed),
                      content: { side: 'left' },
                      ui: { content: 'w-48' },
                      'onUpdate:open': (open: boolean) => ed.chain().setMeta('lockDragHandle', open).run(),
                    }, {
                      default: ({ open }: any) => h(UButton, {
                        icon: 'i-lucide-grip-vertical',
                        color: 'neutral',
                        variant: 'ghost',
                        activeVariant: 'soft',
                        size: 'sm',
                        active: open,
                        class: handleUi.handle(),
                      }),
                    }),
                  ],
                }),
            ];
          },
        }));
    },
  });

  app.use(ui);
  app.mount(root);

  // Public API returned to callers (also used by the PHP adapter).
  const controller: NuxtEditorController = {
    element,
    options: opts,
    get editor() {
      return editor.value;
    },
    getValue() {
      return element.value;
    },
    setValue(value: string) {
      content.value = parseValue(value, format);
      element.value = value;
    },
    insert(html: string) {
      editor.value?.chain().focus().insertContent(html).run();
    },
    setEditable(value: boolean) {
      editable.value = value;
    },
    destroy() {
      app.unmount();
      host.remove();
      element.style.display = '';
      instances.delete(element);
    },
  };

  return controller;
}

// JSON format needs parsing; html/markdown values are used as-is.
function parseValue(value: string, format: string) {
  if (format === 'json') {
    try {
      return value ? JSON.parse(value) : '';
    } catch {
      return '';
    }
  }

  return value;
}

// Recursively collect `@property` rules (they must live in the document, not a shadow root).
function collectProperties(rule: CSSRule): string[] {
  if (rule instanceof CSSPropertyRule) {
    return [rule.cssText];
  }

  const children = (rule as any).cssRules as CSSRuleList | undefined;

  return children ? Array.from(children).flatMap(collectProperties) : [];
}
