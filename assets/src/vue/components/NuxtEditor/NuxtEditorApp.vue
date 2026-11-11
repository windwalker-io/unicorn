<script setup lang="ts">
// @ts-ignore
import UApp from '@nuxt/ui/components/App.vue';
// @ts-ignore
import UEditor from '@nuxt/ui/components/Editor.vue';
import { useLinkAutoSelect } from '../../../composable/nuxt-editor/useLinkAutoSelect';
import EditorDragHandle from './EditorDragHandle.vue';
import EditorToolbars from './EditorToolbars.vue';
import TableHandle from './TableHandle.vue';
import type { AnyExtension, Content } from '@tiptap/core';
import type { EditorCustomHandlers } from '@nuxt/ui';
import type { DragHandleNode, Editor, Locale, NuxtEditorItems } from './types';

// Root of the Nuxt editor: UApp > UEditor, with toolbars and the drag handle in the editor slot.
defineProps<{
  modelValue: Content;
  format: 'html' | 'markdown' | 'json';
  editable: boolean;
  locale: Locale;
  portal: boolean | string | HTMLElement;
  extensions: AnyExtension[];
  handlers: EditorCustomHandlers;
  editorProps?: Record<string, any>;
  items: NuxtEditorItems;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: Content];
  'create': [editor: Editor];
  'node-change': [node: DragHandleNode];
}>();

const linkAutoSelect = useLinkAutoSelect();

function onCreate({ editor }: { editor: Editor }) {
  linkAutoSelect.bind(editor);
  emit('create', editor);
}
</script>

<template>
  <UApp :locale="locale" :portal="portal">
    <UEditor
      v-slot="{ editor, handlers: editorHandlers }"
      :model-value="modelValue"
      :content-type="format"
      :handlers="handlers"
      :image="false"
      :starter-kit="{ codeBlock: false }"
      :extensions="extensions"
      placeholder="Write, type '/' for commands..."
      :editable="editable"
      class="w-full"
      :ui="{ base: 'p-4 pl-16 sm:p-4 sm:pl-16 min-h-48 border border-default rounded-md' }"
      v-bind="editorProps"
      @update:model-value="emit('update:modelValue', $event)"
      @create="onCreate"
    >
      <template v-if="editable">
        <EditorToolbars
          :editor="editor"
          :fixed-items="items.fixed(editor)"
          :text-items="items.text(editor)"
          :video-items="items.video(editor)"
          :image-items="items.image(editor)"
          :slash-items="items.slash(editor)"
        />
        <TableHandle :editor="editor" :menu-items="items.tableMenu" />
        <EditorDragHandle
          :editor="editor"
          :handlers="editorHandlers"
          :block-menu-items="items.blockMenu"
          @node-change="emit('node-change', $event)"
        />
      </template>
    </UEditor>
  </UApp>
</template>
