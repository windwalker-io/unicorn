<script setup lang="ts">
// @ts-ignore
import UButton from '@nuxt/ui/components/Button.vue';
import { attrsOf } from '../../../module/nuxt-editor-lib/video-embed';
import { trans } from '../../../service/lang';
import type { Editor } from './types';

// Shown after a video URL / iframe code is pasted into an empty line: ask whether to embed it.
const props = defineProps<{ editor: Editor }>();

const state = () => {
  const ed = props.editor as any;

  return ed.storage.videoEmbed.key.getState(ed.state) as null | { from: number; to: number; source: any };
};

const clear = () => {
  const ed = props.editor as any;

  ed.view.dispatch(ed.state.tr.setMeta(ed.storage.videoEmbed.key, null));
};

function embed() {
  const prompt = state();
  const ed = props.editor as any;

  if (!prompt) {
    return;
  }

  const $pos = ed.state.doc.resolve(prompt.from);
  const type = ed.state.schema.nodes.videoEmbed;

  ed.view.dispatch(ed.state.tr.replaceWith($pos.before(), $pos.after(), type.create(attrsOf(prompt.source))));
  ed.commands.focus();
}

function dismiss() {
  clear();
  props.editor.commands.focus();
}

</script>

<template>
  <div class="flex flex-col min-w-40 p-1">
    <div class="px-2 py-1 text-xs font-medium text-muted"    >{{ trans('unicorn.nuxt.editor.text.paste.as') }}</div>
        <UButton icon="i-lucide-video" :label="trans('unicorn.nuxt.editor.action.embed')" color="neutral" variant="ghost" size="sm" class="justify-start" @click="embed" />
        <UButton icon="i-lucide-link" :label="trans('unicorn.nuxt.editor.action.link')" color="neutral" variant="ghost" size="sm" class="justify-start" @click="dismiss" />
      </div>
    </template>