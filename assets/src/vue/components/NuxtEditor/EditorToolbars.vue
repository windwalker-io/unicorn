<script setup lang="ts">
// @ts-ignore
import UEditorToolbar from '@nuxt/ui/components/EditorToolbar.vue';
// @ts-ignore
import UEditorSuggestionMenu from '@nuxt/ui/components/EditorSuggestionMenu.vue';
import { useBubbleVisibility } from '../../../composable/nuxt-editor/useBubbleVisibility';
import { ref } from 'vue';
import { createColorMenu, resolveColors, toBackground } from '../../../module/nuxt-editor-lib/colors';
import ColorsDropdown from './ColorsDropdown.vue';
import LinkBar from './LinkBar.vue';
import LinkPopover from './LinkPopover.vue';
import VideoPopover from './VideoPopover.vue';
import VideoSourcePopover from './VideoSourcePopover.vue';
import VideoPastePrompt from './VideoPastePrompt.vue';
import type { Editor, NuxtEditorItems, ToolbarItems } from './types';

// Fixed toolbar, slash menu and the floating toolbars (text selection, link bar, selected image / video).
const props = defineProps<{
  editor: Editor;
  fixedItems: ToolbarItems;
  textItems: ToolbarItems;
  videoItems: ToolbarItems;
  imageItems: ToolbarItems;
  slashItems: ReturnType<NuxtEditorItems['slash']>;
}>();

const shouldShow = useBubbleVisibility();
const linkBarItems = [[{ slot: 'linkbar' }]];
const videoPromptItems = [[{ slot: 'videoprompt' }]];

// Rebuilt on each open so the "Recent colors" section is current.
const menuTick = ref(0);
const colorMenu = (item: any) => {
  void menuTick.value;
  const ed = props.editor as any;

  const menu = createColorMenu(resolveColors(item.colors), (kind, color) => {
    const chain = ed.chain().focus();

    if (kind === 'text') {
      (color ? chain.setColor(color) : chain.unsetColor()).run();
    } else {
      (color ? chain.setBackgroundColor(toBackground(color)) : chain.unsetBackgroundColor()).run();
    }
  });

  return menu[item.colorKind === 'text' ? 0 : 1].children;
};
</script>

<template>
  <UEditorToolbar
    v-if="fixedItems.length"
    :editor="editor"
    :items="fixedItems"
    class="border-b border-default py-2 overflow-x-auto"
  >
    <template #link><LinkPopover :editor="editor" /></template>
    <template #video><VideoPopover :editor="editor" /></template>
    <template #colors="{ item }"><ColorsDropdown :items="colorMenu(item)" :tooltip="item.tooltip" :icon="item.icon" @open="menuTick++" /></template>
  </UEditorToolbar>

  <UEditorSuggestionMenu v-if="slashItems.length" :editor="editor" :items="slashItems" />

  <UEditorToolbar
    v-if="textItems.length"
    :editor="editor"
    :items="textItems"
    layout="bubble"
    :should-show="shouldShow.text"
  >
    <template #link><LinkPopover :editor="editor" /></template>
    <template #colors="{ item }"><ColorsDropdown :items="colorMenu(item)" :tooltip="item.tooltip" :icon="item.icon" @open="menuTick++" /></template>
  </UEditorToolbar>

  <UEditorToolbar
    v-if="videoItems.length"
    :editor="editor"
    :items="videoItems"
    layout="bubble"
    :should-show="shouldShow.video"
  >
    <template #videosource><VideoSourcePopover :editor="editor" /></template>
  </UEditorToolbar>

  <UEditorToolbar :editor="editor" :items="videoPromptItems" layout="bubble" :should-show="shouldShow.videoPrompt">
    <template #videoprompt><VideoPastePrompt :editor="editor" /></template>
  </UEditorToolbar>

  <!-- Link bar: URL field with apply / open / remove, shown when the caret is inside a link. -->
  <UEditorToolbar :editor="editor" :items="linkBarItems" layout="bubble" :should-show="shouldShow.link">
    <template #linkbar><LinkBar :editor="editor" /></template>
  </UEditorToolbar>

  <UEditorToolbar
    v-if="imageItems.length"
    :editor="editor"
    :items="imageItems"
    layout="bubble"
    :should-show="shouldShow.image"
  />
</template>
