<script setup lang="ts">
import { ref, watch } from 'vue';
// @ts-ignore
import UButton from '@nuxt/ui/components/Button.vue';
// @ts-ignore
import UInput from '@nuxt/ui/components/Input.vue';
// @ts-ignore
import UPopover from '@nuxt/ui/components/Popover.vue';
// @ts-ignore
import UTooltip from '@nuxt/ui/components/Tooltip.vue';
import { attrsOf, parseEmbedInput } from '../../../module/nuxt-editor-lib/video-embed';
import { trans } from '../../../service/lang';
import type { Editor } from './types';

// Button in the selected-video bubble: pops up a URL / iframe field to change the source of the video.
const props = defineProps<{ editor: Editor }>();

const open = ref(false);
const url = ref('');
const invalid = ref(false);

watch(open, (v) => {
  if (v) {
    url.value = (props.editor.state.selection as any).node?.attrs.src || '';
    invalid.value = false;
  }
});

function apply() {
  const source = parseEmbedInput(url.value);
  const { selection } = props.editor.state as any;

  if (!source || !selection.node) {
    invalid.value = true;

    return;
  }

  const { state, view } = props.editor as any;

  view.dispatch(state.tr.setNodeMarkup(selection.from, undefined, attrsOf(source)));
  open.value = false;
  props.editor.commands.focus();
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault();
    apply();
  }
}

function onFocusIn(e: FocusEvent) {
  if (e.target instanceof HTMLInputElement) {
    e.target.select();
  }
}
</script>

<template>
  <UPopover v-model:open="open" :ui="{ content: 'p-0.5 w-[28rem] max-w-[90vw]' }">
    <UTooltip :text="trans('unicorn.nuxt.editor.action.change.source')">
      <UButton icon="i-lucide-pencil" color="neutral" variant="ghost" size="sm" :aria-label="trans('unicorn.nuxt.editor.action.change.source')" />
    </UTooltip>

    <template #content>
      <div data-video-source>
        <UInput
          v-model="url"
          autofocus
          type="url"
          variant="none"
          class="w-full"
          :color="invalid ? 'error' : undefined"
          :placeholder="invalid ? trans('unicorn.nuxt.editor.message.video.unsupported') : trans('unicorn.nuxt.editor.field.video.placeholder')"
          @input="invalid = false"
          @focusin="onFocusIn"
          @keydown="onKeydown"
        >
          <div class="flex items-center mr-0.5">
            <UButton
              icon="i-lucide-corner-down-left" :title="trans('unicorn.nuxt.editor.action.apply')" color="neutral" variant="ghost" size="sm"
              :disabled="!url" @click="apply"
            />
          </div>
        </UInput>
      </div>
    </template>
  </UPopover>
</template>
