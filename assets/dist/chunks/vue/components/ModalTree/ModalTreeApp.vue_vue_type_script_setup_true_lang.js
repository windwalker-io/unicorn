import { defineComponent, provide, ref, watch, computed } from "vue";
import { T as TreeModal } from "./TreeModal.js";
import { f as cloneDeep } from "../../../composable/useQueue.js";
import { f as forceArray } from "../../../service/helper.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ModalTreeApp",
  props: {
    id: {},
    name: {},
    title: {},
    disabled: { type: Boolean },
    readonly: { type: Boolean },
    value: {},
    source: {},
    items: {},
    valueGetter: { type: Function, default: (item) => item.id },
    titleGetter: { type: Function, default: (item) => item.title },
    searchMatcher: {},
    modalTitle: {},
    vertical: { type: Boolean },
    branchSelectable: { type: Boolean, default: false },
    selectAllChildren: { type: Boolean, default: false },
    placeholder: { default: "- No selected -" },
    multiple: { type: Boolean, default: false },
    buttonText: { default: "Select" },
    itemClass: { default: "badge bg-primary badge-pill" },
    searchText: { default: "Search" }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    provide("id", props.id);
    provide("name", props.name);
    provide("multiple", props.multiple);
    provide("valueGetter", props.valueGetter);
    provide("titleGetter", props.titleGetter);
    provide("searchMatcher", props.searchMatcher ?? defaultSearchMatcher);
    function defaultSearchMatcher(item, q) {
      return props.titleGetter(item).toLowerCase().includes(q.toLowerCase());
    }
    const selected = ref([]);
    const value = ref(forceArray(props.value));
    const treeModalOpen = ref(false);
    function openSelector() {
      treeModalOpen.value = true;
    }
    function deleteItem(i, node) {
      selected.value = selected.value.filter((it) => props.valueGetter(it.value) !== props.valueGetter(node.value));
    }
    function handleSelected(items) {
      selected.value = cloneDeep(items);
    }
    watch(() => props.items, async (v) => {
      if (typeof v === "function") {
        v = await v();
      }
      selected.value = forceArray(v).filter((node) => {
        return value.value.includes(props.valueGetter(node.value));
      });
    }, { immediate: true });
    const selectedValues = computed(() => {
      return selected.value.map((node) => props.valueGetter(node.value));
    });
    const canModify = computed(() => {
      return !props.readonly && !props.disabled;
    });
    const __returned__ = { props, defaultSearchMatcher, selected, value, treeModalOpen, openSelector, deleteItem, handleSelected, selectedValues, canModify, TreeModal };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
export {
  _sfc_main as _
};
