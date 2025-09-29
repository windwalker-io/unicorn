import { defineComponent, inject, ref, useTemplateRef, onMounted, onUnmounted, computed, provide, watch } from "vue";
import { Modal } from "bootstrap";
import { T as TreeItem } from "./TreeItem.js";
import { f as forceArray } from "../../../service/helper.js";
import { u as useHttpClient } from "../../../composable/useHttp.js";
import { f as flattenChildren } from "../../../utilities/tree.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "TreeModal",
  props: {
    open: { type: Boolean },
    id: {},
    name: {},
    types: {},
    title: {},
    disabled: { type: Boolean },
    readonly: { type: Boolean },
    value: {},
    branchSelectable: { type: Boolean, default: false },
    source: {},
    searchText: {}
  },
  emits: ["change", "input", "selected", "hide"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emits = __emit;
    const valueGetter = inject("valueGetter");
    const titleGetter = inject("titleGetter");
    const searchMatcher = inject("searchMatcher");
    const loading = ref(false);
    const multiple = inject("multiple", false);
    const modalElement = useTemplateRef("modal");
    let $modal;
    onMounted(() => {
      $modal = Modal.getOrCreateInstance(modalElement.value);
      modalElement.value.addEventListener("show.bs.modal", onShow);
      modalElement.value.addEventListener("hide.bs.modal", onHide);
    });
    onUnmounted(() => {
      modalElement.value.removeEventListener("show.bs.modal", onShow);
      modalElement.value.removeEventListener("hide.bs.modal", onHide);
    });
    const nodes = ref([]);
    const selectedNodes = ref([]);
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
    provide("selectedValues", selectedValues);
    watch(() => selectedValues, () => {
      emits("change", selectedValues.value);
      emits("input", selectedValues.value);
      emits("selected", selectedNodes.value);
    });
    const canModify = computed(() => {
      return !props.readonly && !props.disabled;
    });
    const q = ref("");
    const searchEnabled = computed(() => q.value !== "");
    const searchedItems = computed(() => {
      if (q.value === "") {
        return [];
      }
      return flatNodes.value.filter((item) => {
        return searchMatcher(item.value, q.value);
      });
    });
    async function loadItems() {
      loading.value = true;
      const http = await useHttpClient();
      try {
        let src = props.source;
        if (typeof src === "string") {
          const res = await http.get(src);
          nodes.value = res.data.data;
        } else if (typeof src === "function") {
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
      q.value = "";
      emits("hide");
    }
    function updateSelectedItemsByValue() {
      const values = forceArray(props.value);
      selectedNodes.value = flatNodes.value.filter((item) => {
        return values.includes(valueGetter(item.value));
      });
    }
    watch(
      () => props.value,
      () => updateSelectedItemsByValue(),
      { immediate: true, deep: true }
    );
    const __returned__ = { props, emits, valueGetter, titleGetter, searchMatcher, loading, multiple, modalElement, get $modal() {
      return $modal;
    }, set $modal(v) {
      $modal = v;
    }, nodes, selectedNodes, displayNodes, flatNodes, selectedValues, canModify, q, searchEnabled, searchedItems, loadItems, onShow, onHide, updateSelectedItemsByValue, TreeItem };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
export {
  _sfc_main as _
};
