// Like Nuxt: on mouse up, a caret inside a link focuses the URL field with its text selected;
// a drag that makes a range selection keeps the normal bubble toolbar.
export function useLinkAutoSelect() {
  function bind(editor: any) {
    editor.view.dom.addEventListener('mouseup', () => {
      let tries = 0;

      const tick = () => {
        if (!editor.state.selection.empty || !editor.isActive('link')) {
          return;
        }

        const root = editor.view.dom.getRootNode() as Document | ShadowRoot;
        const el = (root.querySelector('[data-link-bar] input') ?? document.querySelector('[data-link-bar] input')) as HTMLInputElement | null;

        if (el) {
          el.focus();
          el.select();
        } else if (++tries < 15) {
          setTimeout(tick, 50);
        }
      };

      setTimeout(tick, 50);
    });
  }

  return { bind };
}
