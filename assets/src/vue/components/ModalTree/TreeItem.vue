<script setup lang="ts">
import { type ComponentPublicInstance, type ComputedRef, computed, inject, nextTick, onBeforeUpdate, onMounted, ref, watch } from 'vue';
import { Vue3SlideUpDown } from 'vue3-slide-up-down';
import { TitleGetter, TreeNode, ValueGetter } from '../../../types';
import { flattenChildren } from '../../../utilities';
import TreeItem from './TreeItem.vue';

const props = withDefaults(
  defineProps<{
    node: TreeNode;
    level?: number;
    branchSelectable?: boolean;
  }>(),
  {
    level: 1,
    branchSelectable: false,
  }
);

const emit = defineEmits<{
  change: [checked: boolean];
  input: [checked: boolean];
}>();

const node = ref<TreeNode>(props.node);
// const selectNode = inject<(node: TreeNode, select: boolean) => any>('selectNode');
const selectedValues = inject<ComputedRef<(string | number)[]>>('selectedValues');
const id = inject('id');
const multiple = inject('multiple');
const valueGetter = inject<ValueGetter>('valueGetter');
const titleGetter = inject<TitleGetter>('titleGetter');

const selected = ref(false);
const indeterminate = computed(() => !!props.node.indeterminate);
const stopWatch = ref(false);
const open = ref(false);
const childrenComponents = ref<ComponentPublicInstance<typeof TreeItem>[]>([]);

watch(() => props.node, () => {
  selected.value = !!props.node.selected;
}, { deep: true });

function setChildrenComponent(child: ComponentPublicInstance<typeof TreeItem>) {
  childrenComponents.value.push(child);
}

onBeforeUpdate(() => {
  childrenComponents.value = [];
});

const indentPx = computed(() => {
  return (props.level - 1) * 15;
});

const isBranch = computed(() => {
  return props.node.children.length > 0;
});

const isLeaf = computed(() => {
  return !isBranch.value;
});

function updateSelected() {
  if (isBranch.value) {
    return;
  }

  node.value.selected = selectedValues.value.includes(valueGetter(props.node.value));
}

function select(select: boolean) {
  if (selected.value === select) {
    return;
  }

  node.value.selected = select;

  checkboxChanged(select);
}

function checkboxChanged(v: boolean) {
  if (isBranch.value) {
    node.value.selected = v;

    if (multiple) {
      stopWatchThen(() => {
        const flatChildren = flattenChildren(node.value.children);
        for (const child of flatChildren) {
          child.selected = v;
          child.indeterminate = false;
        }
      });
      // syncChildrenStatus();
    }
  } else {
    nextTick(() => {
      node.value.selected = v;
    });
  }
  emit('change', v);
  emit('input', v);
}

function childChanged(v: boolean) {
  if (isLeaf.value || stopWatch.value) {
    return;
  }
  if (!childrenComponents.value) {
    return;
  }
  if (childrenComponents.value.length === 0) {
    return;
  }
  syncChildrenStatus();
}

function syncChildrenStatus() {
  if (isLeaf.value) {
    return;
  }
  let selectedCount = 0;
  let unselectCount = 0;
  let indeterminateInner = 0;
  const oldIndeterminate = indeterminate.value;
  const oldSelected = selected.value;
  
  for (const child of flattenChildren(props.node.children)) {
    if (child.selected) {
      selectedCount++;
    } else {
      unselectCount++;
    }

    if (child.indeterminate) {
      indeterminateInner++;
    }
  }

  // for (const childComponent of childrenComponents.value) {
  //   if (childComponent.selected) {
  //     checked++;
  //   } else {
  //     unchecked++;
  //   }
  //   if (childComponent.indeterminate) {
  //     indeterminateInner++;
  //   }
  // }

  if ((selectedCount !== 0 && unselectCount !== 0) || indeterminateInner > 0) {
    node.value.indeterminate = true;
  } else {
    node.value.selected = unselectCount === 0;
    node.value.indeterminate = false;
  }

  if (
    selected.value !== oldSelected
    || indeterminate.value !== oldIndeterminate
  ) {
    emit('change', selected.value);
    emit('input', selected.value);
  }
}

function stopWatchThen(callback: () => any) {
  stopWatch.value = true;
  callback();
  stopWatch.value = false;
}

watch(() => selectedValues, async () => {
  if (!isBranch.value) {
    updateSelected();
  }
  await nextTick();

  syncChildrenStatus();
}, { deep: true });

watch(selected, (v) => {
});

updateSelected();

onMounted(() => {
  syncChildrenStatus();
});

defineExpose({
  select,
  selected,
  indeterminate
});
</script>

<template>
  <div class="c-tree-item"
    :class="[ isBranch ? 'c-tree-item--branch' : 'c-tree-item--leaf' ]">
    <div class="d-flex c-tree-item__title"
      :style="{ 'padding-left': indentPx + 'px' }"
      :class="[ isBranch ? 'bg-light ' : '' ]">
      <div class="p-2 ms-2">
        <input
          :type="multiple ? 'checkbox' : 'radio'"
          class="form-check-input"
          v-if="isLeaf || (branchSelectable && multiple)"
          :id="id + '__item-' + valueGetter(node.value)"
          v-model="selected"
          :value="true"
          :unchecked-value="false"
          :indeterminate.sync="indeterminate"
          @change="checkboxChanged(($event.target as HTMLInputElement).checked)"
        />
        <input v-else
          :type="multiple ? 'checkbox' : 'radio'"
          class="form-check-input"
          disabled
          :checked="indeterminate" :indeterminate.sync="indeterminate" />
      </div>
      <a class="c-tree-item__text d-flex align-items-center flex-grow-1 py-2 text-decoration-none"
        style="cursor: pointer;"
        :data-level="level"
        data-bs-toggle="collapse"
        @click.prevent="isLeaf ? select(!selected) : open = !open">
        <span class="me-2 fa" :class="[ isLeaf ? 'fa-tag' : 'fa-folder' ]"></span>

        {{ node.value.title }}

        <span v-if="isBranch" class="ms-auto me-3">
          <span :class="[ open ? 'fa fa-chevron-up' : 'fa fa-chevron-down' ]"></span>
        </span>
      </a>
    </div>

    <Vue3SlideUpDown
      v-if="node.children.length > 0"
      v-model="open"
      :duration="300"
      class="c-tree-item__children"
    >
      <TreeItem v-for="(child, i) of node.children"
        :node="child"
        :key="valueGetter(child.value)"
        :level="level + 1"
        :branch-selectable="branchSelectable"
        :ref="setChildrenComponent"
        @change="childChanged"
      />
    </Vue3SlideUpDown>
  </div>
</template>

<style scoped lang="scss">
.c-tree-item {
  &__title {
    border-bottom: 1px solid #ddd;
  }

  cursor: pointer;
}
</style>
