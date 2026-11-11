<script setup lang="ts">
// @ts-ignore
import UApp from '@nuxt/ui/components/App.vue';
// @ts-ignore
import UEditor from '@nuxt/ui/components/Editor.vue';
import { useLinkAutoSelect } from '../../../composable/nuxt-editor/useLinkAutoSelect';
import EditorDragHandle from './EditorDragHandle.vue';
import EditorToolbars from './EditorToolbars.vue';

// Root of the Nuxt editor: UApp > UEditor, with toolbars and the drag handle in the editor slot.
defineProps<{
  modelValue: any;
  format: string;
  editable: boolean;
  locale: any;
  portal: any;
  extensions: any[];
  handlers: Record<string, any>;
  editorProps?: Record<string, any>;
  items: {
    fixed: (editor: any) => any[];
    text: (editor: any) => any[];
    image: (editor: any) => any[];
    slash: (editor: any) => any[];
    blockMenu: (editor: any) => any[];
  };
}>();

const emit = defineEmits<{
  'update:modelValue': [value: any];
  'create': [editor: any];
  'node-change': [node: any];
}>();

const linkAutoSelect = useLinkAutoSelect();

function onCreate({ editor }: any) {
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
          :image-items="items.image(editor)"
          :slash-items="items.slash(editor)"
        />
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
