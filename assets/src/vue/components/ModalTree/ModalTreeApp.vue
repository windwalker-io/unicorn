<script lang="ts" setup>
import { cloneDeep } from 'lodash-es';
import { computed, provide, ref, watch } from 'vue';
import { forceArray } from '../../../service';
import {
  ValueGetter,
  ModalTreeSource,
  TitleGetter,
  TreeNode,
  SearchMatcher,
  MaybeArray,
  MaybePromise
} from '../../../types';
import TreeModal from './TreeModal.vue';

const props = withDefaults(
  defineProps<{
    id?: string;
    name?: string;
    title?: string;
    disabled?: boolean;
    readonly?: boolean;
    value?: MaybeArray<string | number>;
    source?: ModalTreeSource;
    items?: MaybeArray<TreeNode> | (() => MaybePromise<MaybeArray<TreeNode>>);
    valueGetter?: ValueGetter;
    titleGetter?: TitleGetter;
    searchMatcher?: SearchMatcher;
    modalTitle?: string;
    vertical?: boolean;
    branchSelectable?: boolean;
    selectAllChildren?: boolean;
    placeholder?: string;
    multiple?: boolean;
    buttonText?: string;
    itemClass?: string;
    searchText?: string;
  }>(),
  {
    branchSelectable: false,
    selectAllChildren: false,
    placeholder: '- No selected -',
    multiple: false,
    buttonText: 'Select',
    itemClass: 'badge bg-primary badge-pill',
    searchText: 'Search',
    valueGetter: (item: any) => item.id,
    titleGetter: (item: any) => item.title,
  }
);

provide('id', props.id);
provide('name', props.name);
provide('multiple', props.multiple);
provide('valueGetter', props.valueGetter);
provide('titleGetter', props.titleGetter);
provide('searchMatcher', props.searchMatcher ?? defaultSearchMatcher);

function defaultSearchMatcher(item: any, q: string) {
  return props.titleGetter(item).toLowerCase().includes(q.toLowerCase());
}

const selected = ref<TreeNode[]>([]);
const value = ref<(string|number)[]>(forceArray(props.value));

// Modal
const treeModalOpen = ref(false);

function openSelector() {
  treeModalOpen.value = true;
}

function deleteItem(i: number, node: TreeNode) {
  selected.value = selected.value.filter((it: TreeNode) => props.valueGetter(it.value) !== props.valueGetter(node.value));
}

function handleSelected(items: any[]) {
  selected.value = cloneDeep(items);
}

watch(() => props.items, async (v) => {
  if (typeof v === 'function') {
    v = await v();
  }

  selected.value = forceArray(v).filter((node: TreeNode) => {
    return value.value.includes(props.valueGetter(node.value));
  });
}, { immediate: true });

const selectedValues = computed(() => {
  return selected.value.map(node => props.valueGetter(node.value));
});

const canModify = computed(() => {
  return !props.readonly && !props.disabled;
});

</script>

<template>
  <div class="c-modal-tree">
    <div class="c-modal-tree__container p-2 d-flex flex-column"
      :class="[ vertical ? '' : 'flex-md-row' ]">
      <div v-if="canModify" class="me-2 mb-2"
        :class="{ 'mb-md-0': !vertical }">
        <div class="btn-group">
          <button class="btn btn-secondary btn-sm btn-rounded text-nowrap" type="button"
            @click="openSelector">
            {{ buttonText }}
          </button>
          <button class="btn btn-secondary btn-sm btn-rounded" type="button"
            @click="selected = []">
            <span class="fa fa-times"></span>
          </button>
        </div>
      </div>

      <div v-if="selected.length > 0">
        <TransitionGroup name="fade">
          <span v-for="(node, i) of selected"
            class="me-2 mb-2 c-item"
            :class="itemClass"
            :key="valueGetter(node.value)"
            style="animation-duration: .3s">
            <span>{{ titleGetter(node.value) }}</span>
            <span type="button" v-if="canModify"
              @click.prevent="deleteItem(i, node)" class="ms-2" style="cursor: pointer">
              <span class="fa fa-times"></span>
            </span>
          </span>
        </TransitionGroup>
      </div>
      <div v-else class="text-muted">
        {{ placeholder }}
      </div>
    </div>

    <select multiple
      style="display: none;"
      ref="input"
      :id="id"
      :name="name"
      :disabled="disabled"
      :readonly="readonly"
      v-bind="$attrs"
    >
      <option v-for="id of selectedValues" :value="id" :selected="true">{{ id }}</option>
    </select>

    <TreeModal
      :open="treeModalOpen"
      @hide="treeModalOpen = false"
      :id="id"
      :title="modalTitle"
      :source="source"
      :value="selectedValues"
      :branchSelectable
      v-bind="$attrs"
      :disabled="disabled"
      :readonly="readonly"
      :search-text="searchText"
      @selected="handleSelected"
    />
  </div>
</template>

<style scoped>
.c-item {
  padding-left: .75rem;
  padding-right: .75rem;
  padding-top: .5rem;
  padding-bottom: .5rem;
}
</style>
