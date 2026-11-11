<script setup lang="ts">
// @ts-ignore
import UButton from '@nuxt/ui/components/Button.vue';
// @ts-ignore
import UDropdownMenu from '@nuxt/ui/components/DropdownMenu.vue';
// @ts-ignore
import UEditorDragHandle from '@nuxt/ui/components/EditorDragHandle.vue';

import type { EditorHandlers } from '@nuxt/ui';
import type { DragHandleNode, Editor, NuxtEditorItems } from './types';

// Left-side handle: "+" opens the suggestion menu, grip opens the block menu (and drags).
const props = defineProps<{
  editor: Editor;
  handlers: EditorHandlers;
  blockMenuItems: NuxtEditorItems['blockMenu'];
}>();

const emit = defineEmits<{
  'node-change': [node: DragHandleNode];
}>();

function addBlock(e: Event, onClick: () => DragHandleNode | undefined) {
  e.stopPropagation();
  const selected = onClick();
  props.handlers.suggestion?.execute(props.editor, { pos: selected?.pos }).run();
}

function lockHandle(open: boolean) {
  props.editor.chain().setMeta('lockDragHandle', open).run();
}
</script>

<template>
  <UEditorDragHandle :editor="editor" @node-change="emit('node-change', $event)">
    <template #default="{ ui, onClick }">
      <UButton
        icon="i-lucide-plus"
        color="neutral"
        variant="ghost"
        size="sm"
        :class="ui.handle()"
        @click="addBlock($event, onClick)"
      />
      <UDropdownMenu
        :modal="false"
        :items="blockMenuItems(editor)"
        :content="{ side: 'left' }"
        :ui="{ content: 'w-48' }"
        @update:open="lockHandle"
      >
        <template #default="{ open }">
          <UButton
            icon="i-lucide-grip-vertical"
            color="neutral"
            variant="ghost"
            active-variant="soft"
            size="sm"
            :active="open"
            :class="ui.handle()"
          />
        </template>
      </UDropdownMenu>
    </template>
  </UEditorDragHandle>
</template>
