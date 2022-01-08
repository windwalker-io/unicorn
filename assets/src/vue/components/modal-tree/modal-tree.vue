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
            @click="selected.items = []">
            <span class="fa fa-times"></span>
          </button>
        </div>
      </div>

      <div v-if="selectedItems.length > 0">
        <transition-group name="fade">
          <span v-for="(item, i) of selectedItems"
            class="me-2 mb-2 c-item"
            :class="itemClass"
            :key="item.id"
            style="animation-duration: .3s">
          {{ item.title }}
          <span type="button" v-if="canModify"
            @click.prevent="deleteItem(i, item)" class="ms-2" style="cursor: pointer">
            <span class="fa fa-times"></span>
          </span>
        </span>
        </transition-group>
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
      <option v-for="id of selectedValues" :value="id" selected="selected">{{ id }}</option>
    </select>

    <tree-modal
      ref="modal"
      :id="id"
      :title="modalTitle"
      :source="source"
      :value="selectedValues"
      @selected="handleSelected"
      v-bind="$attrs"
      :disabled="disabled"
      :readonly="readonly"
      :search-text="searchText"
    />
  </div>
</template>

<script>
import { cloneDeep } from 'lodash-es';
import { reactive, ref, toRefs, watch } from 'vue';
import { computed, provide } from 'vue-demi';
import TreeItem from './tree-item';
import TreeModal from './tree-modal';

export default {
  name: 'modal-tree',
  components: { TreeModal, TreeItem  },
  provide() {
    return {
      app: this
    };
  },
  data() {
    return {
      search: {
        q: '',
        enabled: false
      },
      selected: {
        items: [],
      },
    }
  },
  props: {
    id: String,
    name: String,
    title: String,
    disabled: null,
    readonly: null,
    value: null,
    source: [String, Object, Array, Function],
    items: [Array, Function],
    modalTitle: String,
    vertical: Boolean,
    branchSelectable: {
      type: Boolean,
      default: false
    },
    selectAllChildren: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '- No selected -'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    buttonText: {
      type: String,
      default: 'Select'
    },
    itemClass: {
      type: String,
      default: 'badge bg-primary badge-pill'
    },
    searchText: {
      type: String,
      default: 'Search'
    }
  },
  setup(props) {
    const state = reactive({
      search: {
        q: '',
        enabled: false
      },
      selected: {
        items: [],
      },
      currentValue: props.value
    });
    const modal = ref(null);

    if (!Array.isArray(state.currentValue)) {
      state.currentValue = [state.currentValue];
    }

    provide('id', props.id);
    provide('name', props.name);
    provide('multiple', props.multiple);

    function openSelector() {
      modal.value.show();
    }

    function show() {
      modal.value.show();
    }

    function hide() {
      modal.value.hide();
    }

    function deleteItem(i, item) {
      state.selected.items = state.selected.items.filter(it => it.id !== item.id);
    }

    function handleSelected(items) {
      items = cloneDeep(items);
      state.selected.items = items;
    }

    watch(() => props.items, async (v) => {
      if (typeof v === 'function') {
        v = await Promise.resolve(v());
      }

      if (!Array.isArray(v)) {
        v = [v];
      }

      state.selected.items = v.filter((item) => {
        return state.currentValue.indexOf(Number(item.id)) !== -1
          || state.currentValue.indexOf(item.id) !== -1;
      });
    }, { immediate: true });

    const selectedValues = computed(() => {
      return state.selected.items.map(item => item.id);
    });

    const selectedItems = computed(() => state.selected.items);

    const canModify = computed(() => {
      return !props.readonly && !props.disabled;
    });

    return {
      ...toRefs(state),
      modal,
      selectedValues,
      selectedItems,
      canModify,

      openSelector,
      show,
      hide,
      deleteItem,
      handleSelected,
    }
  },
};
</script>

<style scoped>
.c-item {
  padding-left: .75rem;
  padding-right: .75rem;
  padding-top: .5rem;
  padding-bottom: .5rem;
}
</style>
