import { ref } from 'vue';
import type { Content } from '@tiptap/core';

// Keep the editor content and the original textarea in sync (the textarea is what the form submits).
export function useEditorSync(
  element: HTMLTextAreaElement,
  format: string,
  parse: (value: string, format: string) => Content,
) {
  const content = ref<Content>(parse(element.value, format));

  function serialize(value: Content): string {
    return format === 'json' ? JSON.stringify(value) : ((value as string) ?? '');
  }

  // Write editor content back to the textarea and fire input/change for form listeners.
  function update(value: Content) {
    content.value = value;
    element.value = serialize(value);
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function set(value: string) {
    content.value = parse(value, format);
    element.value = value;
  }

  return { content, update, set };
}
