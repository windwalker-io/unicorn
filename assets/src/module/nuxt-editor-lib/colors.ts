// Color palette, recent colors and the "Text Colors / Background Colors" menu shared by the table and text toolbars.

export const DEFAULT_COLORS: Record<string, string> = {
  Primary: 'var(--bs-primary)',
  Secondary: 'var(--bs-secondary)',
  Success: 'var(--bs-success)',
  Danger: 'var(--bs-danger)',
  Warning: 'var(--bs-warning)',
  Info: 'var(--bs-info)',
  Gray: '#6b7280',
  Red: '#ef4444',
  Orange: '#f97316',
  Yellow: '#eab308',
  Green: '#22c55e',
  Blue: '#3b82f6',
  Purple: '#a855f7',
  Pink: '#ec4899',
};

const RECENT_KEY = 'nuxt-editor:table-recent-colors';
const RECENT_LIMIT = 3;

export type ColorKind = 'text' | 'background';
type RecentColor = { kind: ColorKind; color: string };

export const resolveColors = (colors?: Record<string, string>) =>
  colors && Object.keys(colors).length ? colors : DEFAULT_COLORS;

// A 6-digit hex becomes a translucent background so text stays readable in light and dark themes.
// `var(--bs-xxx)` uses Bootstrap's `--bs-xxx-rgb` companion variable for the same effect.
export const toBackground = (color: string) => {
  if (/^#[0-9a-f]{6}$/i.test(color)) {
    return `${color}33`;
  }

  const bs = color.match(/^var\(--bs-([\w-]+)\)$/);

  return bs ? `rgba(var(--bs-${bs[1]}-rgb), .2)` : color;
};

function getRecentColors(): RecentColor[] {
  try {
    const list = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function pushRecentColor(recent: RecentColor) {
  const others = getRecentColors().filter((r) => r.kind !== recent.kind);
  const same = getRecentColors().filter((r) => r.kind === recent.kind && r.color !== recent.color);
  const list = [...others, recent, ...same.slice(0, RECENT_LIMIT - 1)];

  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch {
    // Storage may be unavailable; recent colors are optional.
  }
}

/**
 * Two submenu items (Text Colors, Background Colors). `apply(kind, color)` receives the raw palette
 * color, or null for "Default"; recent colors are recorded here.
 */
export function createColorMenu(
  colors: Record<string, string>,
  apply: (kind: ColorKind, color: string | null) => void,
) {
  const select = (kind: ColorKind, color: string | null) => {
    apply(kind, color);

    if (color) {
      pushRecentColor({ kind, color });
    }
  };

  const colorItem = (kind: ColorKind, label: string, color: string) => ({
    label,
    slot: kind === 'text' ? 'textSwatch' : 'swatch',
    swatch: color,
    onSelect: () => { select(kind, color); },
  });

  const palette = (kind: ColorKind) => {
    const recent = getRecentColors().filter((r) => r.kind === kind).map(({ color }) => colorItem(
      kind,
      Object.entries(colors).find(([, v]) => v === color)?.[0] ?? color,
      color,
    ));

    return [
      ...(recent.length ? [[{ type: 'label', label: 'Recent colors' }, ...recent]] : []),
      [
        { icon: 'i-lucide-ban', label: 'Default', onSelect: () => { select(kind, null); } },
        ...Object.entries(colors).map(([label, color]) => colorItem(kind, label, color)),
      ],
    ];
  };

  return [
    { icon: 'i-lucide-baseline', label: 'Text Colors', children: palette('text') },
    { icon: 'i-lucide-paint-bucket', label: 'Background Colors', children: palette('background') },
  ];
}
