<template>
  <div class="modal fade" :id="`${id}__modal`" tabindex="-1" role="dialog" aria-labelledby="-modal-label"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" :id="`${id}__modal-label`">
            {{ modalTitle }}
          </h4>
          <button type="button" class="close btn-close" data-bs-dismiss="modal" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true" class="visually-hidden">&times;</span>
          </button>
        </div>

        <div class="modal-body p-0">
          <div class="std-form box-list m-3">
            <div class="form-group">
              <input type="search" class="form-control" :placeholder="modalSearchPlaceholder"
                v-model="search.q" />
            </div>
          </div>

          <div v-if="!loading" class="box-list__items">
            <tree-item v-for="item of items"
              :item="item"
              :key="item.value.id"
              :level="1"
              :actives="selectedValues"
              :branch-selectable="branchSelectable"
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

<script>
import { computed, defineComponent, onMounted, ref, toRefs, watch, reactive, inject } from 'vue';
import { each } from 'lodash-es';
import TreeItem from './tree-item';

export default defineComponent({
  name: 'tree-modal',
  components: { TreeItem },
  provide() {
    return {
      root: this,
    };
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    id: String,
    name: String,
    types: Array,
    title: String,
    disabled: null,
    readonly: null,
    value: Array,
    branchSelectable: {
      type: Boolean,
      default: true,
    },
    source: [String, Object, Array, Function],
    searchText: String
  },
  setup(props, ctx) {
    const multiple = inject('multiple');
    const modalId = `${props.id}__modal`;
    let $modal;

    onMounted(() => {
      $modal = u.$ui.bootstrap.modal('#' + modalId);
      $modal._element.addEventListener('show.bs.modal', onShow);
      $modal._element.addEventListener('hide.bs.modal', onHide);
    });

    const {
      id,
      name,
      types,
      title,
      disabled,
      readonly,
      value,
      branchSelectable,
      source,
    } = toRefs(props);

    const loading = ref(false);

    const search = reactive({
      q: '',
      enabled: false,
    });

    const selected = reactive({
      items: [],
      values: [],
    });

    const allItems = ref(null);

    const selectedValues = computed(() => {
      return selected.items.map((item) => item.id);
    });

    const canModify = computed(() => {
      return readonly.value == null && disabled.value == null;
    });

    const selectedItems = computed(() => {
      return flatItems.value.filter(
        (item) => selected.values.indexOf(item.value.id) !== -1
      );
    });

    const flatItems = computed(() => {
      const items = [];
      function loopChildren(children) {
        each(children, (child) => {
          if (child.children.length === 0) {
            items.push(child);
            return;
          }
          loopChildren(child.children);
        });
      };
      loopChildren(allItems.value);
      return items;
    });

    const searchItems = computed(() => {
      return flatItems.value.filter((item) => {
        return (
          item.value.title.indexOf(search.q) !== -1 ||
          (typeof item.value.alias === 'string' &&
            item.value.alias.indexOf(search.q) !== -1)
        );
      });
    });

    const items = computed(() => {
      if (search.enabled) {
        return searchItems.value;
      }
      return allItems.value;
    });

    const modalTitle = computed(() => {
      return title.value;
    });

    const modalSearchPlaceholder = props.searchText;

    async function loadItems() {
      loading.value = true;
      try {
        if (typeof source.value === 'string') {
          const res = await u.$http.get(source.value);
          allItems.value = res.data.data;
        } else if (typeof source.value === 'function') {
          allItems.value = await Promise.resolve(source.value());
        } else {
          allItems.value = source.value;
        }
      } finally {
        loading.value = false;
      }
    };

    function show() {
      $modal.show();
    };

    function hide() {
      $modal.hide();
    };

    function checkItem(item, v) {
      if (v) {
        if (!multiple) {
          selected.items = [];
        }

        if (selectedValues.value.indexOf(item.value.id) === -1) {
          selected.items.push(item.value);
        }
      } else {
        selected.items = selected.items.filter(
          (tag) => tag.id !== item.value.id
        );
      }
      ctx.emit('change', selectedValues.value);
      ctx.emit('input', selectedValues.value);
      ctx.emit('selected', selected.items);
    };

    async function onShow() {
      await loadItems();
      updateSelectedItems();
    };

    function onHide() {
      allItems.value = [];
      search.enabled = false;
      search.q = '';
    };

    function updateSelectedItems() {
      selected.items = flatItems.value
        .filter((item) => {
          return selected.values.indexOf(item.value.id) !== -1;
        })
        .map((item) => item.value);
    };

    watch(
      value,
      (v) => {
        selected.values = JSON.parse(JSON.stringify(v));
        updateSelectedItems();
      },
      { immediate: true, deep: true }
    );
    
    watch(items, () => {
    });
    
    watch(() => search.q, (q) => {
      search.enabled = q !== '';
    });
    
    onMounted(async () => {
    });
    
    return {
      loading,
      search,
      selected,
      allItems,
      selectedValues,
      canModify,
      selectedItems,
      flatItems,
      searchItems,
      items,
      modalTitle,
      modalSearchPlaceholder,
      loadItems,
      show,
      hide,
      checkItem,
      updateSelectedItems,
    };
  },
});
</script>

<style scoped>

</style>
