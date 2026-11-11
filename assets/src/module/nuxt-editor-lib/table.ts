import { createColorMenu, resolveColors, toBackground } from './colors';
import type { Editor } from '../../vue/components/NuxtEditor/types';

// Table commands exposed as custom `kind` handlers, so toolbars/menus can reference them by name.
const commands = {
  insertTable: (ed: Editor) => ed.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }),
  addRowBefore: (ed: Editor) => ed.chain().focus().addRowBefore(),
  addRowAfter: (ed: Editor) => ed.chain().focus().addRowAfter(),
  deleteRow: (ed: Editor) => ed.chain().focus().deleteRow(),
  addColumnBefore: (ed: Editor) => ed.chain().focus().addColumnBefore(),
  addColumnAfter: (ed: Editor) => ed.chain().focus().addColumnAfter(),
  deleteColumn: (ed: Editor) => ed.chain().focus().deleteColumn(),
  toggleHeaderRow: (ed: Editor) => ed.chain().focus().toggleHeaderRow(),
  mergeCells: (ed: Editor) => ed.chain().focus().mergeCells(),
  splitCell: (ed: Editor) => ed.chain().focus().splitCell(),
  deleteTable: (ed: Editor) => ed.chain().focus().deleteTable(),
};

type Scope = 'cell' | 'row' | 'column';

export function createTable(tableExt: any, pmTables: any, pmModel: any, tableOptions: { colors?: Record<string, string> } = {}) {
  const colors = resolveColors(tableOptions.colors);

  const { TableKit, TableCell, TableHeader } = tableExt;
  const { selectedRect } = pmTables;
  const { Fragment } = pmModel;

  const styleAttr = (attr: string, css: string) => ({
    default: null,
    parseHTML: (el: HTMLElement) => el.style.getPropertyValue(css) || null,
    renderHTML: (attrs: Record<string, any>) => attrs[attr] ? { style: `${css}: ${attrs[attr]}` } : {},
  });

  const withCellAttrs = (Base: any) => Base.extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        backgroundColor: styleAttr('backgroundColor', 'background-color'),
        textColor: styleAttr('textColor', 'color'),
        textAlign: styleAttr('textAlign', 'text-align'),
        verticalAlign: styleAttr('verticalAlign', 'vertical-align'),
      };
    },
  });

  // Table context of the current selection, or null when the selection is outside a table.
  const getContext = (state: any) => {
    let rect;
    try {
      rect = selectedRect(state);
    } catch {
      return null;
    }

    const rows: any[] = [];
    let spanned = false;

    rect.table.forEach((row: any) => {
      rows.push(row);
      row.forEach((cell: any) => {
        spanned ||= cell.attrs.colspan > 1 || cell.attrs.rowspan > 1;
      });
    });

    return { rect, rows, spanned };
  };

  const rowCells = (row: any) => {
    const cells: any[] = [];
    row.forEach((cell: any) => cells.push(cell));
    return cells;
  };

  type Ctx = NonNullable<ReturnType<typeof getContext>>;
  type Result = { rows: any[]; row: number; col: number } | null;

  const swap = (list: any[], a: number, b: number) => {
    [list[a], list[b]] = [list[b], list[a]];
    return list;
  };

  const mapColumns = ({ rows }: Ctx, fn: (cells: any[]) => any[]) =>
    rows.map((row) => row.copy(Fragment.from(fn(rowCells(row)))));

  // Row/column move & duplicate. Merged cells make index math ambiguous, so they are disabled for those tables.
  const custom: Record<string, (c: Ctx) => Result> = {
    moveRowUp: (c) => c.spanned || c.rect.top < 1 ? null
      : { rows: swap([...c.rows], c.rect.top, c.rect.top - 1), row: c.rect.top - 1, col: c.rect.left },
    moveRowDown: (c) => c.spanned || c.rect.top >= c.rows.length - 1 ? null
      : { rows: swap([...c.rows], c.rect.top, c.rect.top + 1), row: c.rect.top + 1, col: c.rect.left },
    duplicateRow: (c) => {
      if (c.spanned) {
        return null;
      }
      const rows = [...c.rows];
      rows.splice(c.rect.top + 1, 0, rows[c.rect.top]);
      return { rows, row: c.rect.top + 1, col: c.rect.left };
    },
    moveColumnLeft: (c) => c.spanned || c.rect.left < 1 ? null
      : { rows: mapColumns(c, (cells) => swap(cells, c.rect.left, c.rect.left - 1)), row: c.rect.top, col: c.rect.left - 1 },
    moveColumnRight: (c) => c.spanned || c.rect.left >= c.rect.map.width - 1 ? null
      : { rows: mapColumns(c, (cells) => swap(cells, c.rect.left, c.rect.left + 1)), row: c.rect.top, col: c.rect.left + 1 },
    duplicateColumn: (c) => c.spanned ? null : {
      rows: mapColumns(c, (cells) => {
        cells.splice(c.rect.left + 1, 0, cells[c.rect.left]);
        return cells;
      }),
      row: c.rect.top,
      col: c.rect.left + 1,
    },
  };

  const runCustom = (ed: Editor, kind: string) => ed.chain().focus().command(({ state, tr, dispatch }: any) => {
    const ctx = getContext(state);
    const result = ctx && custom[kind](ctx);

    if (!ctx || !result) {
      return false;
    }

    if (dispatch) {
      const { table, tableStart } = ctx.rect;
      const newTable = table.copy(Fragment.from(result.rows));

      tr.replaceWith(tableStart - 1, tableStart - 1 + table.nodeSize, newTable);

      // Put the cursor back in the cell that was moved/duplicated.
      let pos = tableStart;
      for (let i = 0; i < result.row; i++) {
        pos += newTable.child(i).nodeSize;
      }
      const row = newTable.child(result.row);
      pos += 1;
      for (let i = 0; i < result.col; i++) {
        pos += row.child(i).nodeSize;
      }
      tr.setSelection((tr.selection.constructor as any).near(tr.doc.resolve(pos + 1)));
    }

    return true;
  }).run();

  const setCellAttrs = (ed: Editor, scope: Scope, attrs: Record<string, any>) =>
    ed.chain().focus().command(({ state, tr }: any) => {
      const ctx = getContext(state);

      if (!ctx) {
        return false;
      }

      const { map, tableStart, top, left, bottom, right } = ctx.rect;
      const area = scope === 'row' ? { left: 0, right: map.width, top, bottom: top + 1 }
        : scope === 'column' ? { left, right: left + 1, top: 0, bottom: map.height }
          : { left, right, top, bottom };

      map.cellsInRect(area).forEach((offset: number) => {
        const node = tr.doc.nodeAt(tableStart + offset);
        tr.setNodeMarkup(tableStart + offset, undefined, { ...node.attrs, ...attrs });
      });

      return true;
    }).run();

  const handlers = Object.fromEntries(
    Object.entries(commands).map(([kind, run]) => [
      kind,
      {
        canExecute: (ed: Editor) => canRun(ed, kind),
        execute: (ed: Editor) => run(ed),
        isActive: (ed: Editor) => kind === 'insertTable' ? ed.isActive('table') : false,
        isDisabled: undefined,
      },
    ]),
  );

  const toolbarGroup = () => [
    { kind: 'insertTable', icon: 'i-lucide-table', tooltip: { text: 'Insert Table' } },
    {
      icon: 'i-lucide-table-properties',
      tooltip: { text: 'Table' },
      content: { align: 'start' },
      items: [
        { kind: 'addRowBefore', icon: 'i-lucide-arrow-up-from-line', label: 'Add row above' },
        { kind: 'addRowAfter', icon: 'i-lucide-arrow-down-from-line', label: 'Add row below' },
        { kind: 'deleteRow', icon: 'i-lucide-table-rows-split', label: 'Delete row' },
        { kind: 'addColumnBefore', icon: 'i-lucide-arrow-left-from-line', label: 'Add column before' },
        { kind: 'addColumnAfter', icon: 'i-lucide-arrow-right-from-line', label: 'Add column after' },
        { kind: 'deleteColumn', icon: 'i-lucide-table-columns-split', label: 'Delete column' },
        { kind: 'toggleHeaderRow', icon: 'i-lucide-heading', label: 'Toggle header row' },
        { kind: 'mergeCells', icon: 'i-lucide-table-cells-merge', label: 'Merge cells' },
        { kind: 'splitCell', icon: 'i-lucide-table-cells-split', label: 'Split cell' },
        { kind: 'deleteTable', icon: 'i-lucide-trash', label: 'Delete table', color: 'error' },
      ],
    },
  ];

  // Menu for the floating cell handle; groups are separated by dividers.
  const menuGroups: [string, string, string, boolean?][][] = [
    [
      ['addRowBefore', 'i-lucide-arrow-up-from-line', 'Add row above'],
      ['addRowAfter', 'i-lucide-arrow-down-from-line', 'Add row below'],
      ['deleteRow', 'i-lucide-table-rows-split', 'Delete row'],
      ['toggleHeaderRow', 'i-lucide-heading', 'Toggle header row'],
    ],
    [
      ['addColumnBefore', 'i-lucide-arrow-left-from-line', 'Add column before'],
      ['addColumnAfter', 'i-lucide-arrow-right-from-line', 'Add column after'],
      ['deleteColumn', 'i-lucide-table-columns-split', 'Delete column'],
    ],
    [
      ['mergeCells', 'i-lucide-table-cells-merge', 'Merge cells'],
      ['splitCell', 'i-lucide-table-cells-split', 'Split cell'],
    ],
    [['deleteTable', 'i-lucide-trash', 'Delete table', true]],
  ];

  const scopes = { cell: [2], row: [0], column: [1] };

  const customGroups: Record<'row' | 'column', [string, string, string][]> = {
    row: [
      ['moveRowUp', 'i-lucide-move-up', 'Move row up'],
      ['moveRowDown', 'i-lucide-move-down', 'Move row down'],
      ['duplicateRow', 'i-lucide-copy-plus', 'Duplicate row'],
    ],
    column: [
      ['moveColumnLeft', 'i-lucide-move-left', 'Move column left'],
      ['moveColumnRight', 'i-lucide-move-right', 'Move column right'],
      ['duplicateColumn', 'i-lucide-copy-plus', 'Duplicate column'],
    ],
  };

  const alignmentMenu = (ed: Editor) => ({
    icon: 'i-lucide-align-center',
    label: 'Alignment',
    children: [
      [
        ['left', 'i-lucide-align-left', 'Align left'],
        ['center', 'i-lucide-align-center', 'Align center'],
        ['right', 'i-lucide-align-right', 'Align right'],
      ].map(([value, icon, label]) => ({
        icon, label, onSelect: () => { setCellAttrs(ed, 'cell', { textAlign: value }); },
      })),
      [
        ['top', 'i-lucide-align-vertical-justify-start', 'Align top'],
        ['middle', 'i-lucide-align-vertical-justify-center', 'Align middle'],
        ['bottom', 'i-lucide-align-vertical-justify-end', 'Align bottom'],
      ].map(([value, icon, label]) => ({
        icon, label, onSelect: () => { setCellAttrs(ed, 'cell', { verticalAlign: value }); },
      })),
    ],
  });

  const colorsMenu = (ed: Editor, scope: Scope) => createColorMenu(colors, (kind, color) => {
    setCellAttrs(ed, scope, kind === 'text'
      ? { textColor: color }
      : { backgroundColor: color && toBackground(color) });
  });
  const toItems = (ed: Editor, group: [string, string, string, boolean?][]) =>
    group.map(([kind, icon, label, danger]) => ({
      icon,
      label,
      color: danger ? 'error' : undefined,
      disabled: kind in custom ? !canCustom(ed, kind) : !canRun(ed, kind),
      onSelect: () => {
        if (kind in custom) {
          runCustom(ed, kind);
        } else {
          commands[kind as keyof typeof commands](ed).run();
        }
      },
    }));

  const canCustom = (ed: Editor, kind: string) => {
    const ctx = getContext(ed.state);
    return !!ctx && !!custom[kind](ctx);
  };

  const menuItems = (ed: Editor, scope: Scope = 'cell') => {
    const groups = scopes[scope].map((i) => toItems(ed, menuGroups[i]));

    if (scope === 'cell') {
      return [
        ...groups,
        [alignmentMenu(ed), ...colorsMenu(ed, 'cell')],
        toItems(ed, menuGroups[3]),
      ];
    }

    return [...groups, toItems(ed, customGroups[scope]), colorsMenu(ed, scope)];
  };

  return {
    extensions: [
      TableKit.configure({ table: { resizable: true }, tableCell: false, tableHeader: false }),
      withCellAttrs(TableCell),
      withCellAttrs(TableHeader),
    ],
    handlers,
    toolbarGroup,
    menuItems,
  };
}

function canRun(ed: Editor, kind: string): boolean {
  const can = ed.can() as any;

  return kind === 'insertTable'
    ? can.insertTable({ rows: 3, cols: 3, withHeaderRow: true })
    : can[kind]();
}
