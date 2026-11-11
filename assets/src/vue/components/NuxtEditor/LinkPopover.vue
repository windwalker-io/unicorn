<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
// @ts-ignore
import UButton from '@nuxt/ui/components/Button.vue';
// @ts-ignore
import UInput from '@nuxt/ui/components/Input.vue';
// @ts-ignore
import UPopover from '@nuxt/ui/components/Popover.vue';
// @ts-ignore
import USeparator from '@nuxt/ui/components/Separator.vue';
// @ts-ignore
import UTooltip from '@nuxt/ui/components/Tooltip.vue';

// Link button + popover (port of the docs' EditorLinkPopover): set, open and remove a link on the selection.
import { trans } from '../../../service/lang';
import type { Editor } from './types';

const props = defineProps<{ editor: Editor }>();

const open = ref(false);
const url = ref('');

const tick = ref(0);

const syncUrl = () => {
  tick.value++;
  url.value = props.editor.getAttributes('link').href || '';
};

props.editor.on('transaction', syncUrl);
onBeforeUnmount(() => props.editor.off('transaction', syncUrl));
syncUrl();

function setLink() {
  if (!url.value) {
    return;
  }

  const empty = props.editor.state.selection.empty;
  let chain = props.editor.chain().focus();

  if (props.editor.isActive('code') && !empty) {
    chain = chain.extendMarkRange('code').setLink({ href: url.value });
  } else {
    chain = chain.extendMarkRange('link').setLink({ href: url.value });

    if (empty) {
      chain = chain.insertContent({ type: 'text', text: url.value });
    }
  }

  chain.run();
  open.value = false;
}

function removeLink() {
  props.editor.chain().focus().extendMarkRange('link').unsetLink().setMeta('preventAutolink', true).run();
  url.value = '';
  open.value = false;
}

function openLink() {
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
    setLink();
  }
}
</script>

<template>
  <UPopover v-model:open="open" :ui="{ content: 'p-0.5' }">
    <UTooltip :text="trans('unicorn.nuxt.editor.action.link')">
      <UButton
        icon="i-lucide-link"
        color="neutral"
        active-color="primary"
        variant="ghost"
        active-variant="soft"
        size="sm"
        :active="(tick, editor.isActive('link'))"
        :disabled="(tick, !editor.isEditable || (editor.state.selection.empty && !editor.isActive('link')))"
      />
    </UTooltip>

    <template #content>
      <UInput
        v-model="url"
        autofocus
        type="url"
        variant="none"
        :placeholder="trans('unicorn.nuxt.editor.field.link.placeholder')"
        @focusin="onFocusIn"
        @keydown="onKeydown"
      >
        <div class="flex items-center mr-0.5">
          <UButton
            icon="i-lucide-corner-down-left" :title="trans('unicorn.nuxt.editor.action.apply.link')" color="neutral" variant="ghost" size="sm"
            :disabled="!url && !editor.isActive('link')" @click="setLink"
          />
          <USeparator orientation="vertical" class="h-6 mx-1" />
          <UButton
            icon="i-lucide-external-link" :title="trans('unicorn.nuxt.editor.action.open.in.new.window')" color="neutral" variant="ghost" size="sm"
            :disabled="!url && !editor.isActive('link')" @click="openLink"
          />
          <UButton
            icon="i-lucide-unlink" :title="trans('unicorn.nuxt.editor.action.unlink')" color="neutral" variant="ghost" size="sm"
            :disabled="!url && !editor.isActive('link')" @click="removeLink"
          />
        </div>
      </UInput>
    </template>
  </UPopover>
</template>
