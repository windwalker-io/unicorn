<script lang="ts" setup>
import { Modal } from 'bootstrap';
import { computed, getCurrentInstance, inject, onMounted, onUnmounted, provide, ref, useTemplateRef, watch } from 'vue';
import { useHttpClient } from '../../../composable';
import { forceArray } from '../../../service';
import { MaybeArray, ModalTreeSource, SearchMatcher, TitleGetter, TreeNode, ValueGetter } from '../../../types';
import { flattenChildren } from '../../../utilities';
import TreeItem from './TreeItem.vue';

const props = withDefaults(
  defineProps<{
    open?: boolean;
    id?: string;
    name?: string;
    types?: string[];
    title?: string;
    disabled?: boolean;
    readonly?: boolean;
    value?: MaybeArray<string | number>;
    branchSelectable?: boolean;
    source?: ModalTreeSource;
    searchText?: string;
  }>(),
  {
    branchSelectable: false,
  }
);

const emits = defineEmits<{
  change: [value: any];
  input: [value: any];
  selected: [items: any[]];
  hide: [];
}>();

// provide('selectNode', selectNode);

const valueGetter = inject<ValueGetter>('valueGetter');
const titleGetter = inject<TitleGetter>('titleGetter');
const searchMatcher = inject<SearchMatcher>('searchMatcher');

const loading = ref(false);
const multiple = inject<boolean>('multiple', false);
const modalElement = useTemplateRef<HTMLDivElement>('modal')

let $modal: Modal;

onMounted(() => {
  $modal = Modal.getOrCreateInstance(modalElement.value!);
  modalElement.value!.addEventListener('show.bs.modal', onShow);
  modalElement.value!.addEventListener('hide.bs.modal', onHide);
});

onUnmounted(() => {
  modalElement.value!.removeEventListener('show.bs.modal', onShow);
  modalElement.value!.removeEventListener('hide.bs.modal', onHide);
});

// Items
const nodes = ref<TreeNode[]>([]);
const selectedNodes = ref<TreeNode[]>([]);

const displayNodes = computed(() => {
  if (searchEnabled.value) {
    return searchedItems.value;
  }
  return nodes.value;
});

const flatNodes = computed(() => flattenChildren(nodes.value));

const selectedValues = computed(() => {
  return flatNodes.value.filter((node) => node.selected).map((node) => valueGetter(node.value));
});

provide('selectedValues', selectedValues);

watch(() => selectedValues, () => {
  emits('change', selectedValues.value);
  emits('input', selectedValues.value);
  emits('selected', selectedNodes.value);
});

// function selectNode(node: TreeNode, select: boolean) {
//   node.selected = select;
//
//   // if (select) {
//   //   if (!multiple) {
//   //     selectedNodes.value = [];
//   //   }
//   //   if (!selectedValues.value.includes(valueGetter(node.value))) {
//   //     selectedNodes.value.push(node);
//   //   }
//   // } else {
//   //   selectedNodes.value = selectedNodes.value.filter(
//   //     (selectedNode: TreeNode) => valueGetter(selectedNode.value) !== valueGetter(node.value)
//   //   );
//   // }
//   emits('change', selectedValues.value);
//   emits('input', selectedValues.value);
//   emits('selected', selectedNodes.value);
// }

const canModify = computed(() => {
  return !props.readonly && !props.disabled;
});

// Search
const q = ref('');
const searchEnabled = computed(() => q.value !== '');

const searchedItems = computed(() => {
  if (q.value === '') {
    return [];
  }

  return flatNodes.value.filter((item: TreeNode) => {
    return searchMatcher(item.value, q.value);
  });
});

async function loadItems() {
  loading.value = true;
  const http = await useHttpClient();
  try {
    let src = props.source;

    if (typeof src === 'string') {
      const res = await http.get(src);
      nodes.value = res.data.data;
    } else if (typeof src === 'function') {
      nodes.value = await src();
    } else {
      if (!Array.isArray(src)) {
        src = src.children;
      }

      nodes.value = src;
    }
  } finally {
    loading.value = false;
  }
}

// Modal Control
watch(() => props.open, (v) => {
  if (v) {
    $modal.show();
  } else {
    $modal.hide();
  }
});

async function onShow() {
  await loadItems();
  updateSelectedItemsByValue();
}

function onHide() {
  nodes.value = [];
  q.value = '';
  emits('hide');
}

function updateSelectedItemsByValue() {
  const values = forceArray(props.value);

  selectedNodes.value = flatNodes.value
    .filter((item: TreeNode) => {
      return values.includes(valueGetter(item.value));
    });
}

watch(
  () => props.value,
  () => updateSelectedItemsByValue(),
  { immediate: true, deep: true }
);

</script>

<template>
  <div ref="modal" class="modal fade" :id="`${id}__modal`" tabindex="-1" role="dialog" aria-labelledby="-modal-label"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" :id="`${id}__modal-label`">
            {{ title }}
          </h4>
          <button type="button" class="close btn-close" data-bs-dismiss="modal" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true" class="visually-hidden">&times;</span>
          </button>
        </div>

        <div class="modal-body p-0">
          <div class="std-form box-list m-3">
            <div class="form-group">
              <input type="search" class="form-control" :placeholder="searchText"
                v-model="q" />
            </div>
          </div>

          <div v-if="!loading" class="box-list__items">
            <TreeItem v-for="node of displayNodes"
              :node
              :key="valueGetter(node.value)"
              :level="1"
              :branchSelectable
            />
          </div>
          <div v-else>
            <div class="d-flex justify-content-center">
              <div class="spinner-border spinner-border-sm my-3"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
