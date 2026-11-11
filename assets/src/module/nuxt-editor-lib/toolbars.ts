import type { NuxtEditorOptions, NuxtEditorToolbars, UploadImage } from './types';
import { fileNameFromUrl } from './upload';

// Build the default toolbar / menu items (same layout as the Nuxt UI editor example).
export function createToolbars(opts: NuxtEditorOptions, uploadImage: UploadImage) {
  const headingLevels = [1, 2, 3, 4];
  const marksGroup = [
    { kind: 'mark', mark: 'bold', icon: 'i-lucide-bold', tooltip: { text: 'Bold' } },
    { kind: 'mark', mark: 'italic', icon: 'i-lucide-italic', tooltip: { text: 'Italic' } },
    { kind: 'mark', mark: 'underline', icon: 'i-lucide-underline', tooltip: { text: 'Underline' } },
    { kind: 'mark', mark: 'strike', icon: 'i-lucide-strikethrough', tooltip: { text: 'Strikethrough' } },
    { kind: 'mark', mark: 'code', icon: 'i-lucide-code', tooltip: { text: 'Code' } },
    { kind: 'mark', mark: 'highlight', icon: 'i-lucide-highlighter', tooltip: { text: 'Highlight' } },
  ];
  // Rendered by the `colors` slot of EditorToolbars.vue.
  const colorsButton = () => [
    { slot: 'colors', colorKind: 'text', icon: 'i-lucide-baseline', tooltip: { text: 'Text Colors' }, colors: opts.tableColors },
    { slot: 'colors', colorKind: 'background', icon: 'i-lucide-paint-bucket', tooltip: { text: 'Background Colors' }, colors: opts.tableColors },
  ];
  const imageButton = () => opts.imageUploadUrl
    ? [{ kind: 'uploadImage', icon: 'i-lucide-image', tooltip: { text: 'Image' } }]
    : [];
  const alignButtons = (['left', 'center', 'right', 'justify'] as const).map((align) => ({
    kind: 'textAlign',
    align,
    icon: `i-lucide-align-${align}`,
    tooltip: { text: `Align ${align[0].toUpperCase()}${align.slice(1)}` },
  }));

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
      [...marksGroup, ...colorsButton()],
      [{ slot: 'link', icon: 'i-lucide-link' }, ...imageButton()],
      alignButtons,
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
      [...marksGroup, ...colorsButton()],
      [{ slot: 'link', icon: 'i-lucide-link' }, ...imageButton()],
      alignButtons,
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
        { icon: 'i-lucide-external-link', tooltip: { text: 'Open in new window' }, onClick: () => window.open(node?.attrs?.src, '_blank', 'noopener,noreferrer') },
        { icon: 'i-lucide-download', tooltip: { text: 'Download' }, onClick: download },
      ],
      ...(opts.imageUploadUrl
        ? [[{ icon: 'i-lucide-replace', tooltip: { text: 'Replace' }, onClick: replace }]]
        : []),
      [{ icon: 'i-lucide-trash', color: 'error', tooltip: { text: 'Delete' }, onClick: () => ed.chain().focus().deleteSelection().run() }],
    ];
  }

  // Items of the "/" slash menu, grouped by their labels.
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
    { kind: 'insertTable', label: 'Table', icon: 'i-lucide-table' },
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
  function blockMenuItems(sel: { node: any, pos: number } | undefined) {
    if (!sel?.node?.type) {
      return [];
    }

    const pos = sel.pos;

    return [[
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
      { kind: 'clearFormatting', pos, label: 'Clear formatting', icon: 'i-lucide-remove-formatting' },
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
    ]];
  }

  return { toolbarItems, textBubbleItems, imageBubbleItems, suggestionItems, blockMenuItems };
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
