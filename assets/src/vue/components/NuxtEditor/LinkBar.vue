<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
// @ts-ignore
import UButton from '@nuxt/ui/components/Button.vue';
// @ts-ignore
import UInput from '@nuxt/ui/components/Input.vue';
// @ts-ignore
import USeparator from '@nuxt/ui/components/Separator.vue';

// Inline link editor shown in a bubble while the caret is inside a link: URL field, apply, open, remove.
import { trans } from '../../../service/lang';
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

const copied = ref(false);

async function copy() {
  if (!url.value) {
    return;
  }

  await navigator.clipboard.writeText(url.value);
  copied.value = true;
  setTimeout(() => (copied.value = false), 1500);
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
    :placeholder="trans('unicorn.nuxt.editor.field.link.placeholder')"
    class="min-w-72"
    @focusin="onFocusIn"
    @keydown="onKeydown"
  >
    <div class="flex items-center mr-0.5">
      <UButton icon="i-lucide-corner-down-left" :title="trans('unicorn.nuxt.editor.action.apply.link')" color="neutral" variant="ghost" size="sm" @click="apply" />
      <USeparator orientation="vertical" class="h-6 mx-1" />
      <UButton :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'" :title="trans('unicorn.nuxt.editor.action.copy.link')" color="neutral" variant="ghost" size="sm" @click="copy" />
      <UButton icon="i-lucide-external-link" :title="trans('unicorn.nuxt.editor.action.open.in.new.window')" color="neutral" variant="ghost" size="sm" @click="open" />
      <UButton icon="i-lucide-unlink" :title="trans('unicorn.nuxt.editor.action.unlink')" color="neutral" variant="ghost" size="sm" @click="remove" />
    </div>
  </UInput>
</template>
