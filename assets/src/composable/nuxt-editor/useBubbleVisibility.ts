// `shouldShow` predicates of the floating (bubble) toolbars of the Nuxt editor.
import type { BubbleShouldShowProps } from '../../vue/components/NuxtEditor/types';

export function useBubbleVisibility() {
  const text = ({ editor, view, state }: BubbleShouldShowProps) =>
    view.hasFocus()
    && !state.selection.empty
    && !editor.isActive('image')
    && !editor.isActive('imageUpload')
    && !editor.isActive('codeBlock');

  // Keep the link bar open while its own input has the focus (the editor view loses it then).
  const link = ({ editor, view, state }: BubbleShouldShowProps) =>
    (view.hasFocus() || !!(view.dom.getRootNode() as Document | ShadowRoot).activeElement?.closest('[data-link-bar]'))
    && state.selection.empty
    && editor.isActive('link');

  const image = ({ editor, view }: BubbleShouldShowProps) => editor.isActive('image') && view.hasFocus();

  return { text, link, image };
}
