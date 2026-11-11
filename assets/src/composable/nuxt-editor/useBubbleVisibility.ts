// `shouldShow` predicates of the floating (bubble) toolbars of the Nuxt editor.
import type { BubbleShouldShowProps } from '../../vue/components/NuxtEditor/types';

export function useBubbleVisibility() {
  const text = ({ editor, view, state }: BubbleShouldShowProps) =>
    view.hasFocus()
    && !state.selection.empty
    && !editor.isActive('image')
    && !editor.isActive('imageUpload')
    && !editor.isActive('videoEmbed')
    && !editor.isActive('codeBlock');

  // Keep the link bar open while its own input has the focus (the editor view loses it then).
  const link = ({ editor, view, state }: BubbleShouldShowProps) =>
    (view.hasFocus() || !!(view.dom.getRootNode() as Document | ShadowRoot).activeElement?.closest('[data-link-bar]'))
    && state.selection.empty
    && editor.isActive('link')
    && !(editor as any).storage.videoEmbed?.key.getState(state);

  const image = ({ editor, view }: BubbleShouldShowProps) => editor.isActive('image') && view.hasFocus();

  const video = ({ editor, view }: BubbleShouldShowProps) =>
    editor.isActive('videoEmbed') && !!(editor.state.selection as any).node?.attrs.src
    && (view.hasFocus() || !!(view.dom.getRootNode() as Document | ShadowRoot).activeElement?.closest('[data-video-source]'));

  // Pasted video URL waiting for the "embed?" answer.
  const videoPrompt = ({ editor }: BubbleShouldShowProps) =>
    !!(editor as any).storage.videoEmbed?.key.getState(editor.state);

  return { text, link, image, video, videoPrompt };
}
