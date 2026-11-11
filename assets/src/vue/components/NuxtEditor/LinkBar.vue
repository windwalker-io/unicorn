<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
// @ts-ignore
import UButton from '@nuxt/ui/components/Button.vue';
// @ts-ignore
import UInput from '@nuxt/ui/components/Input.vue';
// @ts-ignore
import USeparator from '@nuxt/ui/components/Separator.vue';

// Inline link editor shown in a bubble while the caret is inside a link: URL field, apply, open, remove.
import type { Editor } from './types';

const props = defineProps<{ editor: Editor }>();

const url = ref('');

const sync = () => {
  url.value = props.editor.getAttributes('link').href || '';
};

props.editor.on('selectionUpdate', sync);
onBeforeUnmount(() => props.editor.off('selectionUpdate', sync));
sync();

function apply() {
  if (url.value) {
    props.editor.chain().focus().extendMarkRange('link').setLink({ href: url.value }).run();
  }
}

function remove() {
  props.editor.chain().focus().extendMarkRange('link').unsetLink().setMeta('preventAutolink', true).run();
}

function open() {
  window.open(url.value, '_blank', 'noopener,noreferrer');
}

function onFocusIn(e: FocusEvent) {
  if (e.target instanceof HTMLInputElement) {
    e.target.select();
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault();
    apply();
  } else if (e.key === 'Escape') {
    props.editor.commands.focus();
  }
}
</script>

<template>
  <UInput
    v-model="url"
    data-link-bar
    type="url"
    variant="none"
    placeholder="Paste a link..."
    class="min-w-72"
    @focusin="onFocusIn"
    @keydown="onKeydown"
  >
    <div class="flex items-center mr-0.5">
      <UButton icon="i-lucide-corner-down-left" title="Apply link" color="neutral" variant="ghost" size="sm" @click="apply" />
      <USeparator orientation="vertical" class="h-6 mx-1" />
      <UButton icon="i-lucide-external-link" title="Open in new window" color="neutral" variant="ghost" size="sm" @click="open" />
      <UButton icon="i-lucide-trash" title="Remove link" color="neutral" variant="ghost" size="sm" @click="remove" />
    </div>
  </UInput>
</template>
