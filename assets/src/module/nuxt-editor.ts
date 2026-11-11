import { createApp, h, ref, shallowRef, type App } from 'vue';
import { selectOne } from '../service';
import { mergeDeep } from '../utilities';
import { createCaptionImage } from './nuxt-editor-lib/caption-image';
import { useBlockMenu } from '../composable/nuxt-editor/useBlockMenu';
import { useEditorSync } from '../composable/nuxt-editor/useEditorSync';
import { createImageUpload } from './nuxt-editor-lib/image-upload';
import { createShadowHost } from './nuxt-editor-lib/shadow';
import { createItemsResolver, createToolbars } from './nuxt-editor-lib/toolbars';
import type { NuxtEditorOptions, NuxtEditorToolbars } from './nuxt-editor-lib/types';
import type { DragHandleNode, Editor } from '../vue/components/NuxtEditor/types';
import { createCodeBlock } from './nuxt-editor-lib/code-block';
import { createTable } from './nuxt-editor-lib/table';
import { createFetchImage, createImagePasteDrop, createUploadImage } from './nuxt-editor-lib/upload';
// Resolved by the host Vite (@nuxt/ui/vite + Tailwind). Do not bundle here.
// @ts-ignore
import css from '@windwalker-io/unicorn-next/src/css/nuxt-editor.css?inline';

export type { NuxtEditorOptions, NuxtEditorToolbars, NuxtEditorToolbarOverride } from './nuxt-editor-lib/types';

export interface NuxtEditorController {
  element: HTMLTextAreaElement;
  options: NuxtEditorOptions;
  readonly editor: Editor | null;
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
  // Hide the textarea right away and show a simple loading box while the heavy modules are fetched.
  element.style.display = 'none';

  const loader = document.createElement('div');
  loader.className = 'nuxt-editor-loading';
  loader.style.cssText = 'display:flex;align-items:center;justify-content:center;gap:.5rem;min-height:8rem;'
    + 'border:1px solid var(--bs-border-color,#dee2e6);border-radius:.375rem;color:var(--bs-secondary-color,#6c757d);font-size:.875rem;';
  loader.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
    + 'stroke-linecap="round"><path d="M21 12a9 9 0 1 1-6.2-8.55"><animateTransform attributeName="transform" type="rotate" '
    + 'from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/></path></svg><span>Loading editor...</span>';
  element.after(loader);

  // Lazy-load Nuxt UI components, TipTap and the locale/plugin, so they are only fetched when an editor is used.
  const [
    { default: UFileUpload },
    { default: UAvatar },
    { Node, Extension, mergeAttributes },
    { Plugin, PluginKey },
    { Decoration, DecorationSet },
    { TextAlign },
    { default: TiptapHighlight },
    { TextStyle, Color, BackgroundColor },
    { default: TiptapImage },
    { default: TiptapCodeBlock },
    tableExt,
    pmTables,
    pmModel,
    { VueNodeViewRenderer, NodeViewWrapper, nodeViewProps },
    { mapEditorItems },
    { default: ui },
    locales,
  ] = await Promise.all([
    // @ts-ignore
    import('@nuxt/ui/components/FileUpload.vue'),
    // @ts-ignore
    import('@nuxt/ui/components/Avatar.vue'),
    // @ts-ignore
    import('@tiptap/core'),
    // @ts-ignore
    import('@tiptap/pm/state'),
    // @ts-ignore
    import('@tiptap/pm/view'),
    // @ts-ignore
    import('@tiptap/extension-text-align'),
    // @ts-ignore
    import('@tiptap/extension-highlight'),
    // @ts-ignore
    import('@tiptap/extension-text-style'),
    // @ts-ignore
    import('@tiptap/extension-image'),
    // @ts-ignore
    import('@tiptap/extension-code-block'),
    // @ts-ignore
    import('@tiptap/extension-table'),
    // @ts-ignore
    import('@tiptap/pm/tables'),
    // @ts-ignore
    import('@tiptap/pm/model'),
    // @ts-ignore
    import('@tiptap/vue-3'),
    // @ts-ignore
    import('@nuxt/ui/utils/editor'),
    // @ts-ignore
    import('@nuxt/ui/vue-plugin'),
    import('@nuxt/ui/locale'),
  ]).catch((e) => {
    loader.remove();
    element.style.display = '';
    element.style.visibility = '';
    throw e;
  }) as any;

  const { default: NuxtEditorApp } = await import('../vue/components/NuxtEditor/NuxtEditorApp.vue');

  const opts: NuxtEditorOptions = mergeDeep({ format: 'html', props: {}, unicorn: {} }, options);
  const format = opts.format!;

  const { host, root, portal } = createShadowHost(css as string);

  // The original textarea stays hidden (it remains in the form as the submitted value).
  loader.replaceWith(host);

  // Reactive state: editor content (synced with the textarea), the TipTap instance and the editable flag.
  const { content, update, set } = useEditorSync(element, format, parseValue);
  const editor = shallowRef<Editor | null>(null);
  const editable = ref(!(opts.readonly || element.readOnly || element.disabled));

  const resolveItems = createItemsResolver({ ...globalToolbars, ...options.toolbars }, opts);

  const uploadImage = createUploadImage(element, opts);
  const { toolbarItems, textBubbleItems, imageBubbleItems, suggestionItems, blockMenuItems: defaultBlockMenu } = createToolbars(opts, uploadImage);
  const CaptionImage = createCaptionImage(TiptapImage, mergeAttributes, opts);
  const CodeBlock = createCodeBlock(TiptapCodeBlock, opts);
  const { ImageUpload, customHandlers } = createImageUpload({
    Node, mergeAttributes, VueNodeViewRenderer, NodeViewWrapper, nodeViewProps, UFileUpload, UAvatar, uploadImage,
  });

  const table = createTable(tableExt, pmTables, pmModel, { colors: opts.tableColors });
  const handlers = { ...customHandlers, ...table.handlers };

  const { selectedNode, items: blockMenuItems } = useBlockMenu(resolveItems, defaultBlockMenu, mapEditorItems);

  // Pick the Nuxt UI locale from options, fallback to English.
  const localeKey = (opts.locale || '').replace('-', '_');
  const locale = locales[localeKey] ?? locales.en;

  const extensions = [
    CaptionImage,
    CodeBlock,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    TiptapHighlight,
    TextStyle,
    Color,
    BackgroundColor,
    ...table.extensions,
    ...(opts.imageUploadUrl ? [ImageUpload, createImagePasteDrop(
      { Extension, Plugin, PluginKey, Decoration, DecorationSet },
      uploadImage,
      opts,
      opts.imageFetchUrl ? createFetchImage(element, opts) : undefined,
    )] : []),
  ];

  const items = {
    fixed: (ed: any) => resolveItems('fixed', [...toolbarItems(), table.toolbarGroup()], ed),
    text: (ed: any) => resolveItems('textBubble', textBubbleItems(), ed),
    image: (ed: any) => resolveItems('imageBubble', imageBubbleItems(ed), ed),
    slash: (ed: any) => resolveItems('slash', suggestionItems, ed),
    blockMenu: blockMenuItems,
    tableMenu: table.menuItems as any,
  };

  // Root Vue app: the NuxtEditorApp SFC, reactive to the state above.
  const app: App = createApp({
    setup() {
      return () => h(NuxtEditorApp, {
        modelValue: content.value,
        format,
        editable: editable.value,
        locale,
        portal,
        extensions,
        handlers,
        editorProps: opts.props,
        items,
        'onUpdate:modelValue': update,
        onNodeChange: (node: DragHandleNode) => {
          selectedNode.value = node;
        },
        onCreate: (ed: Editor) => {
          editor.value = ed;
          element.dispatchEvent(new CustomEvent('nuxt-editor:create', { detail: ed }));
        },
      });
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
      set(value);
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
      element.style.visibility = '';
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
