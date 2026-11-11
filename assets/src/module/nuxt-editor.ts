import { createApp, h, ref, shallowRef, type App } from 'vue';
import { selectOne } from '../service';
import { mergeDeep } from '../utilities';
import { createCaptionImage } from './nuxt-editor-lib/caption-image';
import { createImageUpload } from './nuxt-editor-lib/image-upload';
import { createLinkBar, createLinkPopover } from './nuxt-editor-lib/link-popover';
import { createShadowHost } from './nuxt-editor-lib/shadow';
import { createItemsResolver, createToolbars } from './nuxt-editor-lib/toolbars';
import type { NuxtEditorOptions, NuxtEditorToolbars } from './nuxt-editor-lib/types';
import { createCodeBlock } from './nuxt-editor-lib/code-block';
import { createFetchImage, createImagePasteDrop, createUploadImage } from './nuxt-editor-lib/upload';
// Resolved by the host Vite (@nuxt/ui/vite + Tailwind). Do not bundle here.
// @ts-ignore
import css from '@windwalker-io/unicorn-next/src/css/nuxt-editor.css?inline';

export type { NuxtEditorOptions, NuxtEditorToolbars, NuxtEditorToolbarOverride } from './nuxt-editor-lib/types';

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
    { Node, Extension, mergeAttributes },
    { Plugin, PluginKey },
    { Decoration, DecorationSet },
    { TextAlign },
    { default: TiptapHighlight },
    { default: TiptapImage },
    { default: TiptapCodeBlock },
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
    import('@tiptap/pm/state'),
    // @ts-ignore
    import('@tiptap/pm/view'),
    // @ts-ignore
    import('@tiptap/extension-text-align'),
    // @ts-ignore
    import('@tiptap/extension-highlight'),
    // @ts-ignore
    import('@tiptap/extension-image'),
    // @ts-ignore
    import('@tiptap/extension-code-block'),
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

  const opts: NuxtEditorOptions = mergeDeep({ format: 'html', props: {}, unicorn: {} }, options);
  const format = opts.format!;

  const { host, root, portal } = createShadowHost(css as string);

  // The original textarea stays hidden (it remains in the form as the submitted value).
  loader.replaceWith(host);

  // Reactive state: editor content, the TipTap instance and the editable flag.
  const content = ref<any>(parseValue(element.value, format));
  const editor = shallowRef<any>(null);
  const editable = ref(!(opts.readonly || element.readOnly || element.disabled));

  const resolveItems = createItemsResolver({ ...globalToolbars, ...options.toolbars }, opts);

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

  const uploadImage = createUploadImage(element, opts);
  const { toolbarItems, textBubbleItems, imageBubbleItems, suggestionItems, blockMenuItems: defaultBlockMenu } = createToolbars(opts, uploadImage);
  const LinkPopover = createLinkPopover({ UButton, UPopover, UTooltip, UInput, USeparator });
  const LinkBar = createLinkBar({ UButton, UInput, USeparator });
  const CaptionImage = createCaptionImage(TiptapImage, mergeAttributes, opts);
  const CodeBlock = createCodeBlock(TiptapCodeBlock, opts);
  const { ImageUpload, customHandlers } = createImageUpload({
    Node, mergeAttributes, VueNodeViewRenderer, NodeViewWrapper, nodeViewProps, UFileUpload, UAvatar, uploadImage,
  });

  // The block the drag handle currently points at, used by the block menu.
  const selectedNode = shallowRef<{ node: any, pos: number } | undefined>();

  const blockMenuItems = (ed: any) => selectedNode.value?.node?.type
    ? mapEditorItems(ed, resolveItems('blockMenu', defaultBlockMenu(selectedNode.value), ed))
    : [];
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
          starterKit: { codeBlock: false },
          extensions: [
            CaptionImage,
            CodeBlock,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            TiptapHighlight,
            ...(opts.imageUploadUrl ? [ImageUpload, createImagePasteDrop(
              { Extension, Plugin, PluginKey, Decoration, DecorationSet },
              uploadImage,
              opts,
              opts.imageFetchUrl ? createFetchImage(element, opts) : undefined,
            )] : []),
          ],
          placeholder: "Write, type '/' for commands...",
          editable: editable.value,
          class: 'w-full',
          ui: { base: 'p-4 pl-16 sm:p-4 sm:pl-16 min-h-48 border border-default rounded-md' },
          onCreate: ({ editor: ed }: any) => {
            editor.value = ed;

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
                // Link bar: URL field with apply / open / remove, shown when the caret is inside a link.
                h(UEditorToolbar, {
                  editor: ed,
                  items: [[{ slot: 'linkbar' }]],
                  layout: 'bubble',
                  shouldShow: ({ editor: e, view, state }: any) =>
                    (view.hasFocus() || !!(view.dom.getRootNode() as any).activeElement?.closest?.('[data-link-bar]'))
                    && state.selection.empty && e.isActive('link'),
                }, { linkbar: () => h(LinkBar, { editor: ed }) }),
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
