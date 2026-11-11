import type { NuxtEditorOptions, NuxtEditorToolbars, UploadImage } from './types';
import { trans } from '../../service/lang';
import { fileNameFromUrl } from './upload';

// Build the default toolbar / menu items (same layout as the Nuxt UI editor example).
export function createToolbars(opts: NuxtEditorOptions, uploadImage: UploadImage) {
  const headingLevels = [1, 2, 3, 4];
  const headingLabel = (level: number) => trans('unicorn.nuxt.editor.action.heading', level);
  const marksGroup = [
    { kind: 'mark', mark: 'bold', icon: 'i-lucide-bold', tooltip: { text: trans('unicorn.nuxt.editor.action.bold') } },
    { kind: 'mark', mark: 'italic', icon: 'i-lucide-italic', tooltip: { text: trans('unicorn.nuxt.editor.action.italic') } },
    { kind: 'mark', mark: 'underline', icon: 'i-lucide-underline', tooltip: { text: trans('unicorn.nuxt.editor.action.underline') } },
    { kind: 'mark', mark: 'strike', icon: 'i-lucide-strikethrough', tooltip: { text: trans('unicorn.nuxt.editor.action.strikethrough') } },
    { kind: 'mark', mark: 'code', icon: 'i-lucide-code', tooltip: { text: trans('unicorn.nuxt.editor.action.code') } },
    { kind: 'mark', mark: 'highlight', icon: 'i-lucide-highlighter', tooltip: { text: trans('unicorn.nuxt.editor.action.highlight') } },
  ];
  // Rendered by the `colors` slot of EditorToolbars.vue.
  const colorsButton = () => [
    { slot: 'colors', colorKind: 'text', icon: 'i-lucide-baseline', tooltip: { text: trans('unicorn.nuxt.editor.action.text.colors') }, colors: opts.tableColors },
    { slot: 'colors', colorKind: 'background', icon: 'i-lucide-paint-bucket', tooltip: { text: trans('unicorn.nuxt.editor.action.background.colors') }, colors: opts.tableColors },
  ];
  const imageButton = () => opts.imageUploadUrl
    ? [{ kind: 'uploadImage', icon: 'i-lucide-image', tooltip: { text: trans('unicorn.nuxt.editor.action.image') } }]
    : [];
  const alignButtons = [
    { kind: 'textAlign', align: 'left', icon: 'i-lucide-align-left', tooltip: { text: trans('unicorn.nuxt.editor.action.align.left') } },
    { kind: 'textAlign', align: 'center', icon: 'i-lucide-align-center', tooltip: { text: trans('unicorn.nuxt.editor.action.align.center') } },
    { kind: 'textAlign', align: 'right', icon: 'i-lucide-align-right', tooltip: { text: trans('unicorn.nuxt.editor.action.align.right') } },
    { kind: 'textAlign', align: 'justify', icon: 'i-lucide-align-justify', tooltip: { text: trans('unicorn.nuxt.editor.action.align.justify') } },
  ];

  // Fixed toolbar above the editor: history, block types, marks, link/image, text align.
  function toolbarItems() {
    return [
      [
        { kind: 'undo', icon: 'i-lucide-undo', tooltip: { text: trans('unicorn.nuxt.editor.action.undo') } },
        { kind: 'redo', icon: 'i-lucide-redo', tooltip: { text: trans('unicorn.nuxt.editor.action.redo') } },
      ],
      [
        {
          icon: 'i-lucide-heading',
          tooltip: { text: trans('unicorn.nuxt.editor.action.headings') },
          content: { align: 'start' },
          items: headingLevels.map((level) => ({
            kind: 'heading', level, icon: `i-lucide-heading-${level}`, label: headingLabel(level),
          })),
        },
        {
          icon: 'i-lucide-list',
          tooltip: { text: trans('unicorn.nuxt.editor.action.lists') },
          content: { align: 'start' },
          items: [
            { kind: 'bulletList', icon: 'i-lucide-list', label: trans('unicorn.nuxt.editor.action.bullet.list') },
            { kind: 'orderedList', icon: 'i-lucide-list-ordered', label: trans('unicorn.nuxt.editor.action.ordered.list') },
          ],
        },
        { kind: 'blockquote', icon: 'i-lucide-text-quote', tooltip: { text: trans('unicorn.nuxt.editor.action.blockquote') } },
        { kind: 'codeBlock', icon: 'i-lucide-square-code', tooltip: { text: trans('unicorn.nuxt.editor.action.code.block') } },
        { kind: 'horizontalRule', icon: 'i-lucide-separator-horizontal', tooltip: { text: trans('unicorn.nuxt.editor.action.horizontal.rule') } },
      ],
      [...marksGroup, ...colorsButton()],
      [{ slot: 'link', icon: 'i-lucide-link' }, ...imageButton(), { slot: 'video', icon: 'i-lucide-video' }],
      alignButtons,
    ];
  }

  // Bubble toolbar shown on a text selection: "Turn into", marks, link/image, text align.
  function textBubbleItems() {
    return [
      [{
        label: trans('unicorn.nuxt.editor.action.turn.into'),
        trailingIcon: 'i-lucide-chevron-down',
        activeColor: 'neutral',
        activeVariant: 'ghost',
        tooltip: { text: trans('unicorn.nuxt.editor.action.turn.into') },
        content: { align: 'start' },
        ui: { label: 'text-xs' },
        items: [
          { type: 'label', label: trans('unicorn.nuxt.editor.action.turn.into') },
          { kind: 'paragraph', label: trans('unicorn.nuxt.editor.action.paragraph'), icon: 'i-lucide-type' },
          ...headingLevels.map((level) => ({
            kind: 'heading', level, icon: `i-lucide-heading-${level}`, label: headingLabel(level),
          })),
          { kind: 'bulletList', icon: 'i-lucide-list', label: trans('unicorn.nuxt.editor.action.bullet.list') },
          { kind: 'orderedList', icon: 'i-lucide-list-ordered', label: trans('unicorn.nuxt.editor.action.ordered.list') },
          { kind: 'blockquote', icon: 'i-lucide-text-quote', label: trans('unicorn.nuxt.editor.action.blockquote') },
          { kind: 'codeBlock', icon: 'i-lucide-square-code', label: trans('unicorn.nuxt.editor.action.code.block') },
        ],
      }],
      [...marksGroup, ...colorsButton()],
      [{ slot: 'link', icon: 'i-lucide-link' }, ...imageButton()],
      alignButtons,
    ];
  }

  // Bubble toolbar shown when a video embed is selected: open, change the source, delete.
  function videoBubbleItems(ed: any) {
    const src = (ed.state.selection as any).node?.attrs?.src;

    return [
      [
        { icon: 'i-lucide-external-link', tooltip: { text: trans('unicorn.nuxt.editor.action.open.in.new.window') }, onClick: () => window.open(src, '_blank', 'noopener,noreferrer') },
        { slot: 'videosource', icon: 'i-lucide-pencil' },
      ],
      [{ icon: 'i-lucide-trash', color: 'error', tooltip: { text: trans('unicorn.nuxt.editor.action.delete') }, onClick: () => ed.chain().focus().deleteSelection().run() }],
    ];
  }

  // Bubble toolbar shown when an image is selected: open, download, replace, delete.
  function imageBubbleItems(ed: any) {
    const node = ed.state.doc.nodeAt(ed.state.selection.from);

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
          const attrs: Record<string, string> = { src };

          if (!node?.attrs?.title && !node?.attrs?.caption) {
            attrs.alt = fileNameFromUrl(src);
          }

          ed.chain().focus().updateAttributes('image', attrs).run();
        }
      };
      input.click();
    };

    return [
      [
        { icon: 'i-lucide-external-link', tooltip: { text: trans('unicorn.nuxt.editor.action.open.in.new.window') }, onClick: () => window.open(node?.attrs?.src, '_blank', 'noopener,noreferrer') },
        { icon: 'i-lucide-download', tooltip: { text: trans('unicorn.nuxt.editor.action.download') }, onClick: download },
      ],
      ...(opts.imageUploadUrl
        ? [[{ icon: 'i-lucide-replace', tooltip: { text: trans('unicorn.nuxt.editor.action.replace') }, onClick: replace }]]
        : []),
      [{ icon: 'i-lucide-trash', color: 'error', tooltip: { text: trans('unicorn.nuxt.editor.action.delete') }, onClick: () => ed.chain().focus().deleteSelection().run() }],
    ];
  }

  // Items of the "/" slash menu, grouped by their labels.
  const suggestionItems = [
    { type: 'label', label: trans('unicorn.nuxt.editor.text.style') },
    { kind: 'paragraph', label: trans('unicorn.nuxt.editor.action.paragraph'), icon: 'i-lucide-type' },
    ...[1, 2, 3].map((level) => ({
      kind: 'heading', level, label: headingLabel(level), icon: `i-lucide-heading-${level}`,
    })),
    { kind: 'bulletList', label: trans('unicorn.nuxt.editor.action.bullet.list'), icon: 'i-lucide-list' },
    { kind: 'orderedList', label: trans('unicorn.nuxt.editor.action.numbered.list'), icon: 'i-lucide-list-ordered' },
    { kind: 'blockquote', label: trans('unicorn.nuxt.editor.action.blockquote'), icon: 'i-lucide-text-quote' },
    { kind: 'codeBlock', label: trans('unicorn.nuxt.editor.action.code.block'), icon: 'i-lucide-square-code' },
    { type: 'label', label: trans('unicorn.nuxt.editor.text.insert') },
    ...(opts.imageUploadUrl
      ? [{ kind: 'uploadImage', label: trans('unicorn.nuxt.editor.action.image'), icon: 'i-lucide-image' }]
      : []),
    { kind: 'insertTable', label: trans('unicorn.nuxt.editor.action.table'), icon: 'i-lucide-table' },

    { kind: 'horizontalRule', label: trans('unicorn.nuxt.editor.action.horizontal.rule'), icon: 'i-lucide-separator-horizontal' },
  ].reduce<any[][]>((groups, item: any) => {
    if (item.type === 'label') {
      groups.push([item]);
    } else {
      groups[groups.length - 1].push(item);
    }

    return groups;
  }, []);

  // Dropdown of the drag handle's grip button: turn into, reset, duplicate, move, delete the current block.
  function blockMenuItems(sel: { node: any, pos: number } | undefined) {
    if (!sel?.node?.type) {
      return [];
    }

    const pos = sel.pos;

    return [[
      {
        label: trans('unicorn.nuxt.editor.action.turn.into'),
        icon: 'i-lucide-repeat-2',
        children: [
          { kind: 'paragraph', label: trans('unicorn.nuxt.editor.action.paragraph'), icon: 'i-lucide-type' },
          ...[1, 2, 3, 4].map((level) => ({
            kind: 'heading', level, label: headingLabel(level), icon: `i-lucide-heading-${level}`,
          })),
          { kind: 'bulletList', label: trans('unicorn.nuxt.editor.action.bullet.list'), icon: 'i-lucide-list' },
          { kind: 'orderedList', label: trans('unicorn.nuxt.editor.action.ordered.list'), icon: 'i-lucide-list-ordered' },
          { kind: 'blockquote', label: trans('unicorn.nuxt.editor.action.blockquote'), icon: 'i-lucide-text-quote' },
          { kind: 'codeBlock', label: trans('unicorn.nuxt.editor.action.code.block'), icon: 'i-lucide-square-code' },
        ],
      },
      { kind: 'clearFormatting', pos, label: trans('unicorn.nuxt.editor.action.clear.formatting'), icon: 'i-lucide-remove-formatting' },
    ], [
      { kind: 'duplicate', pos, label: trans('unicorn.nuxt.editor.action.duplicate'), icon: 'i-lucide-copy' },
      {
        label: trans('unicorn.nuxt.editor.action.copy.to.clipboard'),
        icon: 'i-lucide-clipboard',
        onSelect: () => navigator.clipboard.writeText(sel.node.textContent),
      },
    ], [
      { kind: 'moveUp', pos, label: trans('unicorn.nuxt.editor.action.move.up'), icon: 'i-lucide-arrow-up' },
      { kind: 'moveDown', pos, label: trans('unicorn.nuxt.editor.action.move.down'), icon: 'i-lucide-arrow-down' },
    ], [
      { kind: 'delete', pos, label: trans('unicorn.nuxt.editor.action.delete'), icon: 'i-lucide-trash' },
    ]];
  }

  return { toolbarItems, textBubbleItems, videoBubbleItems, imageBubbleItems, suggestionItems, blockMenuItems };
}

// Apply the user's toolbar override (hide / replace / transform) to the default items of `key`.
export function createItemsResolver(toolbars: NuxtEditorToolbars, opts: NuxtEditorOptions) {
  return (key: keyof NuxtEditorToolbars, defaults: any[], ed: any): any[] => {
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
}
