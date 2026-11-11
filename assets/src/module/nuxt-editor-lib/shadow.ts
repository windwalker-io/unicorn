// Host + shadow root: isolate Tailwind from Bootstrap.
// `root` hosts the Vue app; `portal` receives popovers/menus so they also live inside the shadow root.
export function createShadowHost(css: string) {
  const host = document.createElement('div');
  host.className = 'c-nuxt-editor';
  const shadow = host.attachShadow({ mode: 'open' });

  const sheet = new CSSStyleSheet();
  sheet.replaceSync(css);
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

  const portal = document.createElement('div');
  const root = document.createElement('div');
  root.className = 'nuxt-ui-root';
  shadow.append(root, portal);

  // Page-level key listeners (e.g. the Evernote Web Clipper's "`" shortcut) see the shadow host as the event
  // target, which is not editable, so they would fire. Keep the backtick inside the editor.
  const stopBacktick = (e: KeyboardEvent) => {
    if (e.key === '`' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.stopPropagation();
    }
  };

  for (const target of [root, portal]) {
    for (const type of ['keydown', 'keypress', 'keyup'] as const) {
      target.addEventListener(type, stopBacktick);
    }
  }

  return { host, root, portal };
}

// Recursively collect `@property` rules (they must live in the document, not a shadow root).
function collectProperties(rule: CSSRule): string[] {
  if (rule instanceof CSSPropertyRule) {
    return [rule.cssText];
  }

  const children = (rule as any).cssRules as CSSRuleList | undefined;

  return children ? Array.from(children).flatMap(collectProperties) : [];
}
