<script setup lang="ts">
// @ts-ignore
import UButton from '@nuxt/ui/components/Button.vue';
// @ts-ignore
import UDropdownMenu from '@nuxt/ui/components/DropdownMenu.vue';
// @ts-ignore
import UTooltip from '@nuxt/ui/components/Tooltip.vue';

// Toolbar "Colors" button: Text Colors / Background Colors submenus.
defineProps<{
  items: any[];
  icon: string;
  tooltip?: { text: string };
}>();

const emit = defineEmits<{ open: [] }>();
</script>

<template>
  <UDropdownMenu
    :modal="false"
    :items="items"
    :content="{ align: 'start' }"
    :ui="{ content: 'w-48 max-h-72 overflow-y-auto' }"
    @update:open="(open: boolean) => open && emit('open')"
  >
    <UTooltip :text="tooltip?.text" :disabled="!tooltip">
      <UButton :icon="icon" color="neutral" variant="ghost" size="sm" :aria-label="tooltip?.text" />
    </UTooltip>
    <template #swatch-leading="{ item }">
      <span class="size-4 shrink-0 rounded-full border border-default" :style="{ background: (item as any).swatch }" />
    </template>
    <template #textSwatch-leading="{ item }">
      <span class="size-4 shrink-0 text-center text-sm font-bold leading-4" :style="{ color: (item as any).swatch }">A</span>
    </template>
  </UDropdownMenu>
</template>
