// `shouldShow` predicates of the floating (bubble) toolbars of the Nuxt editor.
export function useBubbleVisibility() {
  const text = ({ editor, view, state }: any) =>
    view.hasFocus()
    && !state.selection.empty
    && !editor.isActive('image')
    && !editor.isActive('imageUpload')
    && !editor.isActive('codeBlock');

  // Keep the link bar open while its own input has the focus (the editor view loses it then).
  const link = ({ editor, view, state }: any) =>
    (view.hasFocus() || !!(view.dom.getRootNode() as any).activeElement?.closest?.('[data-link-bar]'))
    && state.selection.empty
    && editor.isActive('link');

  const image = ({ editor, view }: any) => editor.isActive('image') && view.hasFocus();

  return { text, link, image };
}
