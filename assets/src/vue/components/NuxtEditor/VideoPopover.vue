<script setup lang="ts">
import { ref } from 'vue';
// @ts-ignore
import UButton from '@nuxt/ui/components/Button.vue';
// @ts-ignore
import UInput from '@nuxt/ui/components/Input.vue';
// @ts-ignore
import UPopover from '@nuxt/ui/components/Popover.vue';
// @ts-ignore
import UTooltip from '@nuxt/ui/components/Tooltip.vue';
import { parseEmbedInput } from '../../../module/nuxt-editor-lib/video-embed';
import { trans } from '../../../service/lang';
import type { Editor } from './types';

// Toolbar button + popover: paste a video URL (YouTube / Vimeo / Bilibili / mp4...) to embed it.
const props = defineProps<{ editor: Editor }>();

const open = ref(false);
const url = ref('');
const invalid = ref(false);

function insert() {
  if (!parseEmbedInput(url.value)) {
    invalid.value = true;

    return;
  }

  (props.editor.chain().focus() as any).setVideoEmbed(url.value).run();
  url.value = '';
  invalid.value = false;
  open.value = false;
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault();
    insert();
  }
}
</script>

<template>
  <UPopover v-model:open="open" :ui="{ content: 'p-0.5 w-[28rem] max-w-[90vw]' }">
    <UTooltip :text="trans('unicorn.nuxt.editor.action.video')">
      <UButton
        icon="i-lucide-video" color="neutral" variant="ghost" size="sm" :aria-label="trans('unicorn.nuxt.editor.action.video')"
        :disabled="!editor.isEditable"
      />
    </UTooltip>

    <template #content>
      <UInput
        v-model="url"
        autofocus
        type="url"
        variant="none"
        class="w-full"
        :color="invalid ? 'error' : undefined"
        :placeholder="invalid ? trans('unicorn.nuxt.editor.message.video.unsupported') : trans('unicorn.nuxt.editor.field.video.placeholder')"
        @input="invalid = false"
        @keydown="onKeydown"
      >
        <div class="flex items-center mr-0.5">
          <UButton
            icon="i-lucide-corner-down-left" :title="trans('unicorn.nuxt.editor.action.embed.video')" color="neutral" variant="ghost" size="sm"
            :disabled="!url" @click="insert"
          />
        </div>
      </UInput>
    </template>
  </UPopover>
</template>
