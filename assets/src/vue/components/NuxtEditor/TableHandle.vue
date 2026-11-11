<script setup lang="ts">
// @ts-ignore
import UIcon from '@nuxt/ui/components/Icon.vue';
// @ts-ignore
import UDropdownMenu from '@nuxt/ui/components/DropdownMenu.vue';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import type { Editor, NuxtEditorItems } from './types';

// Floating handle on the cell that holds the cursor; opens the table operations menu.
const props = defineProps<{
  editor: Editor;
  menuItems: NuxtEditorItems['tableMenu'];
}>();

interface Rects {
  cell: DOMRect;
  table: DOMRect;
}

const rects = ref<Rects | null>(null);

function update() {
  const { editor } = props;

  if (!editor || editor.isDestroyed || !editor.isEditable || !editor.isActive('table')) {
    rects.value = null;
    return;
  }

  const dom = editor.view.domAtPos(editor.state.selection.from).node;
  const el = dom instanceof Element ? dom : dom.parentElement;
  const cell = el?.closest('td, th');
  const table = cell?.closest('table');

  rects.value = cell && table
    ? { cell: cell.getBoundingClientRect(), table: table.getBoundingClientRect() }
    : null;
}

onMounted(() => {
  props.editor.on('transaction', update);
  window.addEventListener('scroll', update, true);
  window.addEventListener('resize', update);
  update();
});

onBeforeUnmount(() => {
  props.editor.off('transaction', update);
  window.removeEventListener('scroll', update, true);
  window.removeEventListener('resize', update);
});
</script>

<template>
  <div
    v-if="rects"
    class="nuxt-editor-table-handle"
    style="position: fixed; inset: 0; pointer-events: none; z-index: 5"
  >
    <div
      class="absolute box-border border-2 border-primary"
      :style="{ top: `${rects.cell.top}px`, left: `${rects.cell.left}px`, width: `${rects.cell.width}px`, height: `${rects.cell.height}px` }"
    />

    <UDropdownMenu
      :modal="false"
      :items="menuItems(editor, 'column')"
      :content="{ side: 'bottom', align: 'start' }"
      :ui="{ content: 'w-48 z-50 max-h-72 overflow-y-auto' }"
    >
      <button
        type="button"
        class="pointer-events-auto absolute flex items-center justify-center rounded-t bg-accented text-muted hover:bg-elevated cursor-pointer"
        :style="{ top: `${rects.table.top - 16}px`, left: `${rects.cell.left}px`, width: `${rects.cell.width}px`, height: '16px' }"
        @mousedown.prevent
      >
        <UIcon name="i-lucide-ellipsis" class="size-3.5" />
      </button>
      <template #swatch-leading="{ item }">
        <span class="size-4 shrink-0 rounded-full border border-default" :style="{ background: (item as any).swatch }" />
      </template>
      <template #textSwatch-leading="{ item }">
        <span class="size-4 shrink-0 text-center text-sm font-bold leading-4" :style="{ color: (item as any).swatch }">A</span>
      </template>
    </UDropdownMenu>

    <UDropdownMenu
      :modal="false"
      :items="menuItems(editor, 'row')"
      :content="{ side: 'right', align: 'start' }"
      :ui="{ content: 'w-48 z-50 max-h-72 overflow-y-auto' }"
    >
      <button
        type="button"
        class="pointer-events-auto absolute flex items-center justify-center rounded-l bg-accented text-muted hover:bg-elevated cursor-pointer"
        :style="{ top: `${rects.cell.top}px`, left: `${rects.table.left - 16}px`, width: '16px', height: `${rects.cell.height}px` }"
        @mousedown.prevent
      >
        <UIcon name="i-lucide-ellipsis" class="size-3.5 rotate-90" />
      </button>
      <template #swatch-leading="{ item }">
        <span class="size-4 shrink-0 rounded-full border border-default" :style="{ background: (item as any).swatch }" />
      </template>
      <template #textSwatch-leading="{ item }">
        <span class="size-4 shrink-0 text-center text-sm font-bold leading-4" :style="{ color: (item as any).swatch }">A</span>
      </template>
    </UDropdownMenu>

    <UDropdownMenu
      :modal="false"
      :items="menuItems(editor, 'cell')"
      :content="{ side: 'bottom', align: 'end' }"
      :ui="{ content: 'w-48 z-50 max-h-72 overflow-y-auto' }"
    >
      <button
        type="button"
        class="pointer-events-auto absolute flex size-4 items-center justify-center rounded-full bg-primary text-inverted cursor-pointer"
        :style="{ top: `${rects.cell.top + rects.cell.height / 2 - 8}px`, left: `${rects.cell.right - 8}px` }"
        @mousedown.prevent
      >
        <UIcon name="i-lucide-ellipsis-vertical" class="size-3" />
      </button>
      <template #swatch-leading="{ item }">
        <span class="size-4 shrink-0 rounded-full border border-default" :style="{ background: (item as any).swatch }" />
      </template>
      <template #textSwatch-leading="{ item }">
        <span class="size-4 shrink-0 text-center text-sm font-bold leading-4" :style="{ color: (item as any).swatch }">A</span>
      </template>
    </UDropdownMenu>
  </div>
</template>
