import { o as forceArray, q as useHttpClient, j as useCssImport, l as data } from "./unicorn-D5cXQeSK.js";
import { defineComponent, ref, computed, h, Transition, withDirectives, mergeProps, vShow, unref, inject, watch, onBeforeUpdate, nextTick, onMounted, createElementBlock, openBlock, normalizeClass, createElementVNode, createBlock, createCommentVNode, normalizeStyle, vModelDynamic, withModifiers, createTextVNode, toDisplayString, withCtx, Fragment, renderList, useTemplateRef, onUnmounted, provide, vModelText, createVNode, TransitionGroup, createApp } from "vue";
import { Modal } from "bootstrap";
import { c as cloneDeep } from "./cloneDeep-DfgAhaa3.js";
function flattenChildren(children) {
  const flat = [];
  function loopChildren(children2) {
    for (const child of children2) {
      if (child.children.length === 0) {
        flat.push(child);
        continue;
      }
      loopChildren(child.children);
    }
  }
  loopChildren(children);
  return flat;
}
function y(t) {
  return {
    height: t.style.height,
    width: t.style.width,
    position: t.style.position,
    visibility: t.style.visibility,
    overflow: t.style.overflow,
    paddingTop: t.style.paddingTop,
    paddingBottom: t.style.paddingBottom,
    borderTopWidth: t.style.borderTopWidth,
    borderBottomWidth: t.style.borderBottomWidth,
    marginTop: t.style.marginTop,
    marginBottom: t.style.marginBottom
  };
}
function V(t, o, i) {
  const e = unref(t), { width: n } = getComputedStyle(o);
  o.style.width = n, o.style.position = "absolute", o.style.visibility = "hidden", o.style.height = "";
  const { height: s } = getComputedStyle(o);
  return o.style.width = i.width, o.style.position = i.position, o.style.visibility = i.visibility, o.style.height = e, o.style.overflow = "hidden", i.height && i.height != e ? i.height : s;
}
function f(t, o, i, e, n) {
  const s = t.animate(e, n);
  t.style.height = o.height, s.onfinish = () => {
    t.style.overflow = o.overflow, i();
  };
}
function m(t, o, i, e) {
  const n = unref(o);
  return [
    {
      height: n,
      opacity: t.opacityClosed,
      paddingTop: n,
      paddingBottom: n,
      borderTopWidth: n,
      borderBottomWidth: n,
      marginTop: n,
      marginBottom: n
    },
    {
      height: i,
      opacity: t.opacityOpen,
      paddingTop: e.paddingTop || 0,
      paddingBottom: e.paddingBottom || 0,
      borderTopWidth: e.borderTopWidth || 0,
      borderBottomWidth: e.borderBottomWidth || 0,
      marginTop: e.marginTop || 0,
      marginBottom: e.marginBottom || 0
    }
  ];
}
const x = /* @__PURE__ */ defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    /**
     * Time in milliseconds for the slide duration
     */
    duration: {
      type: Number,
      default: 500
    },
    /**
     * Timing function for the animation
     */
    timingFunction: {
      type: String,
      default: "ease-in-out"
    },
    /**
     * Independent timing function for the animation when entering
     */
    timingFunctionEnter: {
      type: String,
      default: null
    },
    /**
     * Independent timing function for the animation when leaving
     */
    timingFunctionLeave: {
      type: String,
      default: null
    },
    /**
     * Opacity value from 0 - 1 of the element when open
     */
    opacityOpen: {
      type: Number,
      default: 1
    },
    /**
     * Opacity value from 0 - 1 of the element when closed
     */
    opacityClosed: {
      type: Number,
      default: 0
    },
    /**
     * HTML tag to use for the outer container
     */
    tag: {
      type: String,
      default: "div"
    },
    /**
     * Always render the element inside the slide container
     */
    eager: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:modelValue", "open-start", "open-end", "close-start", "close-end"],
  setup(t, { slots: o, attrs: i, emit: e }) {
    const n = ref("0px"), s = computed(() => t.timingFunctionEnter || t.timingFunction), v = computed(() => t.timingFunctionLeave || t.timingFunction);
    function T(g, l) {
      const d = g, a = y(d), r = V(n, d, a), u = m(t, n, r, a), c = { duration: t.duration, easing: s.value };
      f(d, a, () => {
        l(), e("open-end");
      }, u, c);
    }
    function B(g, l) {
      const d = g, a = y(d), { height: r } = getComputedStyle(d);
      d.style.height = r, d.style.overflow = "hidden";
      const u = m(t, n, r, a).reverse(), c = { duration: t.duration, easing: v.value };
      f(d, a, () => {
        l(), e("close-end");
      }, u, c);
    }
    return () => h(
      Transition,
      {
        css: false,
        persisted: t.eager,
        onBeforeEnter: () => e("open-start"),
        onEnter: T,
        onBeforeLeave: () => e("close-start"),
        onLeave: B
      },
      {
        default: () => t.modelValue || t.eager ? withDirectives(
          h(
            t.tag,
            mergeProps(i, {
              class: "slide-up-down__container"
            }),
            o
          ),
          [t.eager ? [vShow, t.modelValue === true] : [null]]
        ) : null
      }
    );
  }
});
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "TreeItem",
  props: {
    node: {},
    level: { default: 1 },
    branchSelectable: { type: Boolean, default: false }
  },
  emits: ["change", "input"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const node = ref(props.node);
    const selectedValues = inject("selectedValues");
    const id = inject("id");
    const multiple = inject("multiple");
    const valueGetter = inject("valueGetter");
    const titleGetter = inject("titleGetter");
    const selected = ref(false);
    const indeterminate = computed(() => !!props.node.indeterminate);
    const stopWatch = ref(false);
    const open = ref(false);
    const childrenComponents = ref([]);
    watch(() => props.node, () => {
      selected.value = !!props.node.selected;
    }, { deep: true });
    function setChildrenComponent(child) {
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
    function select(select2) {
      if (selected.value === select2) {
        return;
      }
      node.value.selected = select2;
      checkboxChanged(select2);
    }
    function checkboxChanged(v) {
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
        }
      } else {
        nextTick(() => {
          node.value.selected = v;
        });
      }
      emit("change", v);
      emit("input", v);
    }
    function childChanged(v) {
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
      if (selectedCount !== 0 && unselectCount !== 0 || indeterminateInner > 0) {
        node.value.indeterminate = true;
      } else {
        node.value.selected = unselectCount === 0;
        node.value.indeterminate = false;
      }
      if (selected.value !== oldSelected || indeterminate.value !== oldIndeterminate) {
        emit("change", selected.value);
        emit("input", selected.value);
      }
    }
    function stopWatchThen(callback) {
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
    __expose({
      select,
      selected,
      indeterminate
    });
    const __returned__ = { props, emit, node, selectedValues, id, multiple, valueGetter, titleGetter, selected, indeterminate, stopWatch, open, childrenComponents, setChildrenComponent, indentPx, isBranch, isLeaf, updateSelected, select, checkboxChanged, childChanged, syncChildrenStatus, stopWatchThen, get Vue3SlideUpDown() {
      return x;
    }, TreeItem };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _hoisted_1$2 = { class: "p-2 ms-2" };
const _hoisted_2$2 = ["type", "id", "indeterminate"];
const _hoisted_3$2 = ["type", "checked", "indeterminate"];
const _hoisted_4$2 = ["data-level"];
const _hoisted_5$2 = {
  key: 0,
  class: "ms-auto me-3"
};
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["c-tree-item", [$setup.isBranch ? "c-tree-item--branch" : "c-tree-item--leaf"]])
  }, [
    createElementVNode("div", {
      class: normalizeClass(["d-flex c-tree-item__title", [$setup.isBranch ? "bg-light " : ""]]),
      style: normalizeStyle({ "padding-left": $setup.indentPx + "px" })
    }, [
      createElementVNode("div", _hoisted_1$2, [
        $setup.isLeaf || $props.branchSelectable && $setup.multiple ? withDirectives((openBlock(), createElementBlock("input", {
          key: 0,
          type: $setup.multiple ? "checkbox" : "radio",
          class: "form-check-input",
          id: $setup.id + "__item-" + $setup.valueGetter($setup.node.value),
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.selected = $event),
          value: true,
          "unchecked-value": false,
          indeterminate: $setup.indeterminate,
          onChange: _cache[1] || (_cache[1] = ($event) => $setup.checkboxChanged($event.target.checked))
        }, null, 40, _hoisted_2$2)), [
          [vModelDynamic, $setup.selected]
        ]) : (openBlock(), createElementBlock("input", {
          key: 1,
          type: $setup.multiple ? "checkbox" : "radio",
          class: "form-check-input",
          disabled: "",
          checked: $setup.indeterminate,
          indeterminate: $setup.indeterminate
        }, null, 8, _hoisted_3$2))
      ]),
      createElementVNode("a", {
        class: "c-tree-item__text d-flex align-items-center flex-grow-1 py-2 text-decoration-none",
        style: { "cursor": "pointer" },
        "data-level": $props.level,
        "data-bs-toggle": "collapse",
        onClick: _cache[2] || (_cache[2] = withModifiers(($event) => $setup.isLeaf ? $setup.select(!$setup.selected) : $setup.open = !$setup.open, ["prevent"]))
      }, [
        createElementVNode("span", {
          class: normalizeClass(["me-2 fa", [$setup.isLeaf ? "fa-tag" : "fa-folder"]])
        }, null, 2),
        createTextVNode(" " + toDisplayString($setup.node.value.title) + " ", 1),
        $setup.isBranch ? (openBlock(), createElementBlock("span", _hoisted_5$2, [
          createElementVNode("span", {
            class: normalizeClass([$setup.open ? "fa fa-chevron-up" : "fa fa-chevron-down"])
          }, null, 2)
        ])) : createCommentVNode("", true)
      ], 8, _hoisted_4$2)
    ], 6),
    $setup.node.children.length > 0 ? (openBlock(), createBlock($setup["Vue3SlideUpDown"], {
      key: 0,
      modelValue: $setup.open,
      "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.open = $event),
      duration: 300,
      class: "c-tree-item__children"
    }, {
      default: withCtx(() => [
        (openBlock(true), createElementBlock(Fragment, null, renderList($setup.node.children, (child, i) => {
          return openBlock(), createBlock($setup["TreeItem"], {
            node: child,
            key: $setup.valueGetter(child.value),
            level: $props.level + 1,
            "branch-selectable": $props.branchSelectable,
            ref_for: true,
            ref: $setup.setChildrenComponent,
            onChange: $setup.childChanged
          }, null, 8, ["node", "level", "branch-selectable"]);
        }), 128))
      ]),
      _: 1
    }, 8, ["modelValue"])) : createCommentVNode("", true)
  ], 2);
}
const TreeItem = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__scopeId", "data-v-897596f4"], ["__file", "TreeItem.vue"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
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
const _hoisted_1$1 = ["id"];
const _hoisted_2$1 = {
  class: "modal-dialog",
  role: "document"
};
const _hoisted_3$1 = { class: "modal-content" };
const _hoisted_4$1 = { class: "modal-header" };
const _hoisted_5$1 = ["id"];
const _hoisted_6$1 = { class: "modal-body p-0" };
const _hoisted_7$1 = { class: "std-form box-list m-3" };
const _hoisted_8 = { class: "form-group" };
const _hoisted_9 = ["placeholder"];
const _hoisted_10 = {
  key: 0,
  class: "box-list__items"
};
const _hoisted_11 = { key: 1 };
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    ref: "modal",
    class: "modal fade",
    id: `${$props.id}__modal`,
    tabindex: "-1",
    role: "dialog",
    "aria-labelledby": "-modal-label",
    "aria-hidden": "true"
  }, [
    createElementVNode("div", _hoisted_2$1, [
      createElementVNode("div", _hoisted_3$1, [
        createElementVNode("div", _hoisted_4$1, [
          createElementVNode("h4", {
            class: "modal-title",
            id: `${$props.id}__modal-label`
          }, toDisplayString($props.title), 9, _hoisted_5$1),
          _cache[1] || (_cache[1] = createElementVNode("button", {
            type: "button",
            class: "close btn-close",
            "data-bs-dismiss": "modal",
            "data-dismiss": "modal",
            "aria-label": "Close"
          }, [
            createElementVNode("span", {
              "aria-hidden": "true",
              class: "visually-hidden"
            }, "×")
          ], -1))
        ]),
        createElementVNode("div", _hoisted_6$1, [
          createElementVNode("div", _hoisted_7$1, [
            createElementVNode("div", _hoisted_8, [
              withDirectives(createElementVNode("input", {
                type: "search",
                class: "form-control",
                placeholder: $props.searchText,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.q = $event)
              }, null, 8, _hoisted_9), [
                [vModelText, $setup.q]
              ])
            ])
          ]),
          !$setup.loading ? (openBlock(), createElementBlock("div", _hoisted_10, [
            (openBlock(true), createElementBlock(Fragment, null, renderList($setup.displayNodes, (node) => {
              return openBlock(), createBlock($setup["TreeItem"], {
                node,
                key: $setup.valueGetter(node.value),
                level: 1,
                branchSelectable: $props.branchSelectable
              }, null, 8, ["node", "branchSelectable"]);
            }), 128))
          ])) : (openBlock(), createElementBlock("div", _hoisted_11, [..._cache[2] || (_cache[2] = [
            createElementVNode("div", { class: "d-flex justify-content-center" }, [
              createElementVNode("div", { class: "spinner-border spinner-border-sm my-3" })
            ], -1)
          ])]))
        ])
      ])
    ])
  ], 8, _hoisted_1$1);
}
const TreeModal = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__file", "TreeModal.vue"]]);
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
const _hoisted_1 = { class: "c-modal-tree" };
const _hoisted_2 = { class: "btn-group" };
const _hoisted_3 = { key: 1 };
const _hoisted_4 = ["onClick"];
const _hoisted_5 = {
  key: 2,
  class: "text-muted"
};
const _hoisted_6 = ["id", "name", "disabled", "readonly"];
const _hoisted_7 = ["value"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1, [
    createElementVNode("div", {
      class: normalizeClass(["c-modal-tree__container p-2 d-flex flex-column", [$props.vertical ? "" : "flex-md-row"]])
    }, [
      $setup.canModify ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass(["me-2 mb-2", { "mb-md-0": !$props.vertical }])
      }, [
        createElementVNode("div", _hoisted_2, [
          createElementVNode("button", {
            class: "btn btn-secondary btn-sm btn-rounded text-nowrap",
            type: "button",
            onClick: $setup.openSelector
          }, toDisplayString($props.buttonText), 1),
          createElementVNode("button", {
            class: "btn btn-secondary btn-sm btn-rounded",
            type: "button",
            onClick: _cache[0] || (_cache[0] = ($event) => $setup.selected = [])
          }, [..._cache[2] || (_cache[2] = [
            createElementVNode("span", { class: "fa fa-times" }, null, -1)
          ])])
        ])
      ], 2)) : createCommentVNode("", true),
      $setup.selected.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_3, [
        createVNode(TransitionGroup, { name: "fade" }, {
          default: withCtx(() => [
            (openBlock(true), createElementBlock(Fragment, null, renderList($setup.selected, (node, i) => {
              return openBlock(), createElementBlock("span", {
                class: normalizeClass(["me-2 mb-2 c-item", $props.itemClass]),
                key: $props.valueGetter(node.value),
                style: { "animation-duration": ".3s" }
              }, [
                createElementVNode("span", null, toDisplayString($props.titleGetter(node.value)), 1),
                $setup.canModify ? (openBlock(), createElementBlock("span", {
                  key: 0,
                  type: "button",
                  onClick: withModifiers(($event) => $setup.deleteItem(i, node), ["prevent"]),
                  class: "ms-2",
                  style: { "cursor": "pointer" }
                }, [..._cache[3] || (_cache[3] = [
                  createElementVNode("span", { class: "fa fa-times" }, null, -1)
                ])], 8, _hoisted_4)) : createCommentVNode("", true)
              ], 2);
            }), 128))
          ]),
          _: 1
        })
      ])) : (openBlock(), createElementBlock("div", _hoisted_5, toDisplayString($props.placeholder), 1))
    ], 2),
    createElementVNode("select", mergeProps({
      multiple: "",
      style: { "display": "none" },
      ref: "input",
      id: $props.id,
      name: $props.name,
      disabled: $props.disabled,
      readonly: $props.readonly
    }, _ctx.$attrs), [
      (openBlock(true), createElementBlock(Fragment, null, renderList($setup.selectedValues, (id) => {
        return openBlock(), createElementBlock("option", {
          value: id,
          selected: true
        }, toDisplayString(id), 9, _hoisted_7);
      }), 256))
    ], 16, _hoisted_6),
    createVNode($setup["TreeModal"], mergeProps({
      open: $setup.treeModalOpen,
      onHide: _cache[1] || (_cache[1] = ($event) => $setup.treeModalOpen = false),
      id: $props.id,
      title: $props.modalTitle,
      source: $props.source,
      value: $setup.selectedValues,
      branchSelectable: $props.branchSelectable
    }, _ctx.$attrs, {
      disabled: $props.disabled,
      readonly: $props.readonly,
      "search-text": $props.searchText,
      onSelected: $setup.handleSelected
    }), null, 16, ["open", "id", "title", "source", "value", "branchSelectable", "disabled", "readonly", "search-text"])
  ]);
}
const ModalTreeApp = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-f21c791b"], ["__file", "ModalTreeApp.vue"]]);
/* @__PURE__ */ useCssImport("@vue-animate");
const app = /* @__PURE__ */ createApp({
  name: "modal-tree",
  components: {
    ModalTreeApp
  }
});
app.config.globalProperties.$getData = data;
class ModalTreeElement extends HTMLElement {
  static is = "modal-tree";
  vm;
  connectedCallback() {
    if (!this.vm) {
      this.vm = app.mount(this);
    }
  }
}
/* @__PURE__ */ customElements.define(/* @__PURE__ */ (() => ModalTreeElement.is)(), ModalTreeElement);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGQtbW9kYWwtdHJlZS1DYklWN0pQRy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxpdGllcy90cmVlLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZTMtc2xpZGUtdXAtZG93bi9kaXN0L3Z1ZTMtc2xpZGUtdXAtZG93bi5qcyIsIi4uLy4uL3NyYy92dWUvY29tcG9uZW50cy9Nb2RhbFRyZWUvVHJlZUl0ZW0udnVlIiwiLi4vLi4vc3JjL3Z1ZS9jb21wb25lbnRzL01vZGFsVHJlZS9UcmVlTW9kYWwudnVlIiwiLi4vLi4vc3JjL3Z1ZS9jb21wb25lbnRzL01vZGFsVHJlZS9Nb2RhbFRyZWVBcHAudnVlIiwiLi4vLi4vc3JjL21vZHVsZS9maWVsZC1tb2RhbC10cmVlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRyZWVOb2RlIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gZmxhdHRlbkNoaWxkcmVuKGNoaWxkcmVuOiBUcmVlTm9kZVtdKSB7XG4gIGNvbnN0IGZsYXQ6IFRyZWVOb2RlW10gPSBbXTtcblxuICBmdW5jdGlvbiBsb29wQ2hpbGRyZW4oY2hpbGRyZW46IFRyZWVOb2RlW10pIHtcbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGNoaWxkcmVuKSB7XG4gICAgICBpZiAoY2hpbGQuY2hpbGRyZW4ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGZsYXQucHVzaChjaGlsZCk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBsb29wQ2hpbGRyZW4oY2hpbGQuY2hpbGRyZW4pO1xuICAgIH1cbiAgfVxuXG4gIGxvb3BDaGlsZHJlbihjaGlsZHJlbik7XG4gIHJldHVybiBmbGF0O1xufVxuXG4iLCJpbXBvcnQgeyBkZWZpbmVDb21wb25lbnQgYXMgQywgcmVmIGFzIEUsIGNvbXB1dGVkIGFzIGgsIGggYXMgcCwgVHJhbnNpdGlvbiBhcyBXLCB3aXRoRGlyZWN0aXZlcyBhcyBGLCBtZXJnZVByb3BzIGFzIEwsIHZTaG93IGFzIGssIHVucmVmIGFzIGIgfSBmcm9tIFwidnVlXCI7XG5mdW5jdGlvbiB5KHQpIHtcbiAgcmV0dXJuIHtcbiAgICBoZWlnaHQ6IHQuc3R5bGUuaGVpZ2h0LFxuICAgIHdpZHRoOiB0LnN0eWxlLndpZHRoLFxuICAgIHBvc2l0aW9uOiB0LnN0eWxlLnBvc2l0aW9uLFxuICAgIHZpc2liaWxpdHk6IHQuc3R5bGUudmlzaWJpbGl0eSxcbiAgICBvdmVyZmxvdzogdC5zdHlsZS5vdmVyZmxvdyxcbiAgICBwYWRkaW5nVG9wOiB0LnN0eWxlLnBhZGRpbmdUb3AsXG4gICAgcGFkZGluZ0JvdHRvbTogdC5zdHlsZS5wYWRkaW5nQm90dG9tLFxuICAgIGJvcmRlclRvcFdpZHRoOiB0LnN0eWxlLmJvcmRlclRvcFdpZHRoLFxuICAgIGJvcmRlckJvdHRvbVdpZHRoOiB0LnN0eWxlLmJvcmRlckJvdHRvbVdpZHRoLFxuICAgIG1hcmdpblRvcDogdC5zdHlsZS5tYXJnaW5Ub3AsXG4gICAgbWFyZ2luQm90dG9tOiB0LnN0eWxlLm1hcmdpbkJvdHRvbVxuICB9O1xufVxuZnVuY3Rpb24gVih0LCBvLCBpKSB7XG4gIGNvbnN0IGUgPSBiKHQpLCB7IHdpZHRoOiBuIH0gPSBnZXRDb21wdXRlZFN0eWxlKG8pO1xuICBvLnN0eWxlLndpZHRoID0gbiwgby5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIiwgby5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIiwgby5zdHlsZS5oZWlnaHQgPSBcIlwiO1xuICBjb25zdCB7IGhlaWdodDogcyB9ID0gZ2V0Q29tcHV0ZWRTdHlsZShvKTtcbiAgcmV0dXJuIG8uc3R5bGUud2lkdGggPSBpLndpZHRoLCBvLnN0eWxlLnBvc2l0aW9uID0gaS5wb3NpdGlvbiwgby5zdHlsZS52aXNpYmlsaXR5ID0gaS52aXNpYmlsaXR5LCBvLnN0eWxlLmhlaWdodCA9IGUsIG8uc3R5bGUub3ZlcmZsb3cgPSBcImhpZGRlblwiLCBpLmhlaWdodCAmJiBpLmhlaWdodCAhPSBlID8gaS5oZWlnaHQgOiBzO1xufVxuZnVuY3Rpb24gZih0LCBvLCBpLCBlLCBuKSB7XG4gIGNvbnN0IHMgPSB0LmFuaW1hdGUoZSwgbik7XG4gIHQuc3R5bGUuaGVpZ2h0ID0gby5oZWlnaHQsIHMub25maW5pc2ggPSAoKSA9PiB7XG4gICAgdC5zdHlsZS5vdmVyZmxvdyA9IG8ub3ZlcmZsb3csIGkoKTtcbiAgfTtcbn1cbmZ1bmN0aW9uIG0odCwgbywgaSwgZSkge1xuICBjb25zdCBuID0gYihvKTtcbiAgcmV0dXJuIFtcbiAgICB7XG4gICAgICBoZWlnaHQ6IG4sXG4gICAgICBvcGFjaXR5OiB0Lm9wYWNpdHlDbG9zZWQsXG4gICAgICBwYWRkaW5nVG9wOiBuLFxuICAgICAgcGFkZGluZ0JvdHRvbTogbixcbiAgICAgIGJvcmRlclRvcFdpZHRoOiBuLFxuICAgICAgYm9yZGVyQm90dG9tV2lkdGg6IG4sXG4gICAgICBtYXJnaW5Ub3A6IG4sXG4gICAgICBtYXJnaW5Cb3R0b206IG5cbiAgICB9LFxuICAgIHtcbiAgICAgIGhlaWdodDogaSxcbiAgICAgIG9wYWNpdHk6IHQub3BhY2l0eU9wZW4sXG4gICAgICBwYWRkaW5nVG9wOiBlLnBhZGRpbmdUb3AgfHwgMCxcbiAgICAgIHBhZGRpbmdCb3R0b206IGUucGFkZGluZ0JvdHRvbSB8fCAwLFxuICAgICAgYm9yZGVyVG9wV2lkdGg6IGUuYm9yZGVyVG9wV2lkdGggfHwgMCxcbiAgICAgIGJvcmRlckJvdHRvbVdpZHRoOiBlLmJvcmRlckJvdHRvbVdpZHRoIHx8IDAsXG4gICAgICBtYXJnaW5Ub3A6IGUubWFyZ2luVG9wIHx8IDAsXG4gICAgICBtYXJnaW5Cb3R0b206IGUubWFyZ2luQm90dG9tIHx8IDBcbiAgICB9XG4gIF07XG59XG5jb25zdCB4ID0gQyh7XG4gIHByb3BzOiB7XG4gICAgbW9kZWxWYWx1ZToge1xuICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgIGRlZmF1bHQ6ICExXG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBUaW1lIGluIG1pbGxpc2Vjb25kcyBmb3IgdGhlIHNsaWRlIGR1cmF0aW9uXG4gICAgICovXG4gICAgZHVyYXRpb246IHtcbiAgICAgIHR5cGU6IE51bWJlcixcbiAgICAgIGRlZmF1bHQ6IDUwMFxuICAgIH0sXG4gICAgLyoqXG4gICAgICogVGltaW5nIGZ1bmN0aW9uIGZvciB0aGUgYW5pbWF0aW9uXG4gICAgICovXG4gICAgdGltaW5nRnVuY3Rpb246IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6IFwiZWFzZS1pbi1vdXRcIlxuICAgIH0sXG4gICAgLyoqXG4gICAgICogSW5kZXBlbmRlbnQgdGltaW5nIGZ1bmN0aW9uIGZvciB0aGUgYW5pbWF0aW9uIHdoZW4gZW50ZXJpbmdcbiAgICAgKi9cbiAgICB0aW1pbmdGdW5jdGlvbkVudGVyOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiBudWxsXG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBJbmRlcGVuZGVudCB0aW1pbmcgZnVuY3Rpb24gZm9yIHRoZSBhbmltYXRpb24gd2hlbiBsZWF2aW5nXG4gICAgICovXG4gICAgdGltaW5nRnVuY3Rpb25MZWF2ZToge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogbnVsbFxuICAgIH0sXG4gICAgLyoqXG4gICAgICogT3BhY2l0eSB2YWx1ZSBmcm9tIDAgLSAxIG9mIHRoZSBlbGVtZW50IHdoZW4gb3BlblxuICAgICAqL1xuICAgIG9wYWNpdHlPcGVuOiB7XG4gICAgICB0eXBlOiBOdW1iZXIsXG4gICAgICBkZWZhdWx0OiAxXG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBPcGFjaXR5IHZhbHVlIGZyb20gMCAtIDEgb2YgdGhlIGVsZW1lbnQgd2hlbiBjbG9zZWRcbiAgICAgKi9cbiAgICBvcGFjaXR5Q2xvc2VkOiB7XG4gICAgICB0eXBlOiBOdW1iZXIsXG4gICAgICBkZWZhdWx0OiAwXG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBIVE1MIHRhZyB0byB1c2UgZm9yIHRoZSBvdXRlciBjb250YWluZXJcbiAgICAgKi9cbiAgICB0YWc6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6IFwiZGl2XCJcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEFsd2F5cyByZW5kZXIgdGhlIGVsZW1lbnQgaW5zaWRlIHRoZSBzbGlkZSBjb250YWluZXJcbiAgICAgKi9cbiAgICBlYWdlcjoge1xuICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgIGRlZmF1bHQ6ICExXG4gICAgfVxuICB9LFxuICBlbWl0czogW1widXBkYXRlOm1vZGVsVmFsdWVcIiwgXCJvcGVuLXN0YXJ0XCIsIFwib3Blbi1lbmRcIiwgXCJjbG9zZS1zdGFydFwiLCBcImNsb3NlLWVuZFwiXSxcbiAgc2V0dXAodCwgeyBzbG90czogbywgYXR0cnM6IGksIGVtaXQ6IGUgfSkge1xuICAgIGNvbnN0IG4gPSBFKFwiMHB4XCIpLCBzID0gaCgoKSA9PiB0LnRpbWluZ0Z1bmN0aW9uRW50ZXIgfHwgdC50aW1pbmdGdW5jdGlvbiksIHYgPSBoKCgpID0+IHQudGltaW5nRnVuY3Rpb25MZWF2ZSB8fCB0LnRpbWluZ0Z1bmN0aW9uKTtcbiAgICBmdW5jdGlvbiBUKGcsIGwpIHtcbiAgICAgIGNvbnN0IGQgPSBnLCBhID0geShkKSwgciA9IFYobiwgZCwgYSksIHUgPSBtKHQsIG4sIHIsIGEpLCBjID0geyBkdXJhdGlvbjogdC5kdXJhdGlvbiwgZWFzaW5nOiBzLnZhbHVlIH07XG4gICAgICBmKGQsIGEsICgpID0+IHtcbiAgICAgICAgbCgpLCBlKFwib3Blbi1lbmRcIik7XG4gICAgICB9LCB1LCBjKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gQihnLCBsKSB7XG4gICAgICBjb25zdCBkID0gZywgYSA9IHkoZCksIHsgaGVpZ2h0OiByIH0gPSBnZXRDb21wdXRlZFN0eWxlKGQpO1xuICAgICAgZC5zdHlsZS5oZWlnaHQgPSByLCBkLnN0eWxlLm92ZXJmbG93ID0gXCJoaWRkZW5cIjtcbiAgICAgIGNvbnN0IHUgPSBtKHQsIG4sIHIsIGEpLnJldmVyc2UoKSwgYyA9IHsgZHVyYXRpb246IHQuZHVyYXRpb24sIGVhc2luZzogdi52YWx1ZSB9O1xuICAgICAgZihkLCBhLCAoKSA9PiB7XG4gICAgICAgIGwoKSwgZShcImNsb3NlLWVuZFwiKTtcbiAgICAgIH0sIHUsIGMpO1xuICAgIH1cbiAgICByZXR1cm4gKCkgPT4gcChcbiAgICAgIFcsXG4gICAgICB7XG4gICAgICAgIGNzczogITEsXG4gICAgICAgIHBlcnNpc3RlZDogdC5lYWdlcixcbiAgICAgICAgb25CZWZvcmVFbnRlcjogKCkgPT4gZShcIm9wZW4tc3RhcnRcIiksXG4gICAgICAgIG9uRW50ZXI6IFQsXG4gICAgICAgIG9uQmVmb3JlTGVhdmU6ICgpID0+IGUoXCJjbG9zZS1zdGFydFwiKSxcbiAgICAgICAgb25MZWF2ZTogQlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZGVmYXVsdDogKCkgPT4gdC5tb2RlbFZhbHVlIHx8IHQuZWFnZXIgPyBGKFxuICAgICAgICAgIHAoXG4gICAgICAgICAgICB0LnRhZyxcbiAgICAgICAgICAgIEwoaSwge1xuICAgICAgICAgICAgICBjbGFzczogXCJzbGlkZS11cC1kb3duX19jb250YWluZXJcIlxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBvXG4gICAgICAgICAgKSxcbiAgICAgICAgICBbdC5lYWdlciA/IFtrLCB0Lm1vZGVsVmFsdWUgPT09ICEwXSA6IFtudWxsXV1cbiAgICAgICAgKSA6IG51bGxcbiAgICAgIH1cbiAgICApO1xuICB9XG59KTtcbmV4cG9ydCB7XG4gIHggYXMgVnVlM1NsaWRlVXBEb3duXG59O1xuIiwiPHNjcmlwdCBzZXR1cCBsYW5nPVwidHNcIj5cbmltcG9ydCB7IHR5cGUgQ29tcG9uZW50UHVibGljSW5zdGFuY2UsIHR5cGUgQ29tcHV0ZWRSZWYsIGNvbXB1dGVkLCBpbmplY3QsIG5leHRUaWNrLCBvbkJlZm9yZVVwZGF0ZSwgb25Nb3VudGVkLCByZWYsIHdhdGNoIH0gZnJvbSAndnVlJztcbmltcG9ydCB7IFZ1ZTNTbGlkZVVwRG93biB9IGZyb20gJ3Z1ZTMtc2xpZGUtdXAtZG93bic7XG5pbXBvcnQgeyBUaXRsZUdldHRlciwgVHJlZU5vZGUsIFZhbHVlR2V0dGVyIH0gZnJvbSAnLi4vLi4vLi4vdHlwZXMnO1xuaW1wb3J0IHsgZmxhdHRlbkNoaWxkcmVuIH0gZnJvbSAnLi4vLi4vLi4vdXRpbGl0aWVzJztcbmltcG9ydCBUcmVlSXRlbSBmcm9tICcuL1RyZWVJdGVtLnZ1ZSc7XG5cbmNvbnN0IHByb3BzID0gd2l0aERlZmF1bHRzKFxuICBkZWZpbmVQcm9wczx7XG4gICAgbm9kZTogVHJlZU5vZGU7XG4gICAgbGV2ZWw/OiBudW1iZXI7XG4gICAgYnJhbmNoU2VsZWN0YWJsZT86IGJvb2xlYW47XG4gIH0+KCksXG4gIHtcbiAgICBsZXZlbDogMSxcbiAgICBicmFuY2hTZWxlY3RhYmxlOiBmYWxzZSxcbiAgfVxuKTtcblxuY29uc3QgZW1pdCA9IGRlZmluZUVtaXRzPHtcbiAgY2hhbmdlOiBbY2hlY2tlZDogYm9vbGVhbl07XG4gIGlucHV0OiBbY2hlY2tlZDogYm9vbGVhbl07XG59PigpO1xuXG5jb25zdCBub2RlID0gcmVmPFRyZWVOb2RlPihwcm9wcy5ub2RlKTtcbi8vIGNvbnN0IHNlbGVjdE5vZGUgPSBpbmplY3Q8KG5vZGU6IFRyZWVOb2RlLCBzZWxlY3Q6IGJvb2xlYW4pID0+IGFueT4oJ3NlbGVjdE5vZGUnKTtcbmNvbnN0IHNlbGVjdGVkVmFsdWVzID0gaW5qZWN0PENvbXB1dGVkUmVmPChzdHJpbmcgfCBudW1iZXIpW10+Pignc2VsZWN0ZWRWYWx1ZXMnKTtcbmNvbnN0IGlkID0gaW5qZWN0KCdpZCcpO1xuY29uc3QgbXVsdGlwbGUgPSBpbmplY3QoJ211bHRpcGxlJyk7XG5jb25zdCB2YWx1ZUdldHRlciA9IGluamVjdDxWYWx1ZUdldHRlcj4oJ3ZhbHVlR2V0dGVyJyk7XG5jb25zdCB0aXRsZUdldHRlciA9IGluamVjdDxUaXRsZUdldHRlcj4oJ3RpdGxlR2V0dGVyJyk7XG5cbmNvbnN0IHNlbGVjdGVkID0gcmVmKGZhbHNlKTtcbmNvbnN0IGluZGV0ZXJtaW5hdGUgPSBjb21wdXRlZCgoKSA9PiAhIXByb3BzLm5vZGUuaW5kZXRlcm1pbmF0ZSk7XG5jb25zdCBzdG9wV2F0Y2ggPSByZWYoZmFsc2UpO1xuY29uc3Qgb3BlbiA9IHJlZihmYWxzZSk7XG5jb25zdCBjaGlsZHJlbkNvbXBvbmVudHMgPSByZWY8Q29tcG9uZW50UHVibGljSW5zdGFuY2U8dHlwZW9mIFRyZWVJdGVtPltdPihbXSk7XG5cbndhdGNoKCgpID0+IHByb3BzLm5vZGUsICgpID0+IHtcbiAgc2VsZWN0ZWQudmFsdWUgPSAhIXByb3BzLm5vZGUuc2VsZWN0ZWQ7XG59LCB7IGRlZXA6IHRydWUgfSk7XG5cbmZ1bmN0aW9uIHNldENoaWxkcmVuQ29tcG9uZW50KGNoaWxkOiBDb21wb25lbnRQdWJsaWNJbnN0YW5jZTx0eXBlb2YgVHJlZUl0ZW0+KSB7XG4gIGNoaWxkcmVuQ29tcG9uZW50cy52YWx1ZS5wdXNoKGNoaWxkKTtcbn1cblxub25CZWZvcmVVcGRhdGUoKCkgPT4ge1xuICBjaGlsZHJlbkNvbXBvbmVudHMudmFsdWUgPSBbXTtcbn0pO1xuXG5jb25zdCBpbmRlbnRQeCA9IGNvbXB1dGVkKCgpID0+IHtcbiAgcmV0dXJuIChwcm9wcy5sZXZlbCAtIDEpICogMTU7XG59KTtcblxuY29uc3QgaXNCcmFuY2ggPSBjb21wdXRlZCgoKSA9PiB7XG4gIHJldHVybiBwcm9wcy5ub2RlLmNoaWxkcmVuLmxlbmd0aCA+IDA7XG59KTtcblxuY29uc3QgaXNMZWFmID0gY29tcHV0ZWQoKCkgPT4ge1xuICByZXR1cm4gIWlzQnJhbmNoLnZhbHVlO1xufSk7XG5cbmZ1bmN0aW9uIHVwZGF0ZVNlbGVjdGVkKCkge1xuICBpZiAoaXNCcmFuY2gudmFsdWUpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBub2RlLnZhbHVlLnNlbGVjdGVkID0gc2VsZWN0ZWRWYWx1ZXMudmFsdWUuaW5jbHVkZXModmFsdWVHZXR0ZXIocHJvcHMubm9kZS52YWx1ZSkpO1xufVxuXG5mdW5jdGlvbiBzZWxlY3Qoc2VsZWN0OiBib29sZWFuKSB7XG4gIGlmIChzZWxlY3RlZC52YWx1ZSA9PT0gc2VsZWN0KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgbm9kZS52YWx1ZS5zZWxlY3RlZCA9IHNlbGVjdDtcblxuICBjaGVja2JveENoYW5nZWQoc2VsZWN0KTtcbn1cblxuZnVuY3Rpb24gY2hlY2tib3hDaGFuZ2VkKHY6IGJvb2xlYW4pIHtcbiAgaWYgKGlzQnJhbmNoLnZhbHVlKSB7XG4gICAgbm9kZS52YWx1ZS5zZWxlY3RlZCA9IHY7XG5cbiAgICBpZiAobXVsdGlwbGUpIHtcbiAgICAgIHN0b3BXYXRjaFRoZW4oKCkgPT4ge1xuICAgICAgICBjb25zdCBmbGF0Q2hpbGRyZW4gPSBmbGF0dGVuQ2hpbGRyZW4obm9kZS52YWx1ZS5jaGlsZHJlbik7XG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgZmxhdENoaWxkcmVuKSB7XG4gICAgICAgICAgY2hpbGQuc2VsZWN0ZWQgPSB2O1xuICAgICAgICAgIGNoaWxkLmluZGV0ZXJtaW5hdGUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICAvLyBzeW5jQ2hpbGRyZW5TdGF0dXMoKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgbmV4dFRpY2soKCkgPT4ge1xuICAgICAgbm9kZS52YWx1ZS5zZWxlY3RlZCA9IHY7XG4gICAgfSk7XG4gIH1cbiAgZW1pdCgnY2hhbmdlJywgdik7XG4gIGVtaXQoJ2lucHV0Jywgdik7XG59XG5cbmZ1bmN0aW9uIGNoaWxkQ2hhbmdlZCh2OiBib29sZWFuKSB7XG4gIGlmIChpc0xlYWYudmFsdWUgfHwgc3RvcFdhdGNoLnZhbHVlKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmICghY2hpbGRyZW5Db21wb25lbnRzLnZhbHVlKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChjaGlsZHJlbkNvbXBvbmVudHMudmFsdWUubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHN5bmNDaGlsZHJlblN0YXR1cygpO1xufVxuXG5mdW5jdGlvbiBzeW5jQ2hpbGRyZW5TdGF0dXMoKSB7XG4gIGlmIChpc0xlYWYudmFsdWUpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgbGV0IHNlbGVjdGVkQ291bnQgPSAwO1xuICBsZXQgdW5zZWxlY3RDb3VudCA9IDA7XG4gIGxldCBpbmRldGVybWluYXRlSW5uZXIgPSAwO1xuICBjb25zdCBvbGRJbmRldGVybWluYXRlID0gaW5kZXRlcm1pbmF0ZS52YWx1ZTtcbiAgY29uc3Qgb2xkU2VsZWN0ZWQgPSBzZWxlY3RlZC52YWx1ZTtcbiAgXG4gIGZvciAoY29uc3QgY2hpbGQgb2YgZmxhdHRlbkNoaWxkcmVuKHByb3BzLm5vZGUuY2hpbGRyZW4pKSB7XG4gICAgaWYgKGNoaWxkLnNlbGVjdGVkKSB7XG4gICAgICBzZWxlY3RlZENvdW50Kys7XG4gICAgfSBlbHNlIHtcbiAgICAgIHVuc2VsZWN0Q291bnQrKztcbiAgICB9XG5cbiAgICBpZiAoY2hpbGQuaW5kZXRlcm1pbmF0ZSkge1xuICAgICAgaW5kZXRlcm1pbmF0ZUlubmVyKys7XG4gICAgfVxuICB9XG5cbiAgLy8gZm9yIChjb25zdCBjaGlsZENvbXBvbmVudCBvZiBjaGlsZHJlbkNvbXBvbmVudHMudmFsdWUpIHtcbiAgLy8gICBpZiAoY2hpbGRDb21wb25lbnQuc2VsZWN0ZWQpIHtcbiAgLy8gICAgIGNoZWNrZWQrKztcbiAgLy8gICB9IGVsc2Uge1xuICAvLyAgICAgdW5jaGVja2VkKys7XG4gIC8vICAgfVxuICAvLyAgIGlmIChjaGlsZENvbXBvbmVudC5pbmRldGVybWluYXRlKSB7XG4gIC8vICAgICBpbmRldGVybWluYXRlSW5uZXIrKztcbiAgLy8gICB9XG4gIC8vIH1cblxuICBpZiAoKHNlbGVjdGVkQ291bnQgIT09IDAgJiYgdW5zZWxlY3RDb3VudCAhPT0gMCkgfHwgaW5kZXRlcm1pbmF0ZUlubmVyID4gMCkge1xuICAgIG5vZGUudmFsdWUuaW5kZXRlcm1pbmF0ZSA9IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgbm9kZS52YWx1ZS5zZWxlY3RlZCA9IHVuc2VsZWN0Q291bnQgPT09IDA7XG4gICAgbm9kZS52YWx1ZS5pbmRldGVybWluYXRlID0gZmFsc2U7XG4gIH1cblxuICBpZiAoXG4gICAgc2VsZWN0ZWQudmFsdWUgIT09IG9sZFNlbGVjdGVkXG4gICAgfHwgaW5kZXRlcm1pbmF0ZS52YWx1ZSAhPT0gb2xkSW5kZXRlcm1pbmF0ZVxuICApIHtcbiAgICBlbWl0KCdjaGFuZ2UnLCBzZWxlY3RlZC52YWx1ZSk7XG4gICAgZW1pdCgnaW5wdXQnLCBzZWxlY3RlZC52YWx1ZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gc3RvcFdhdGNoVGhlbihjYWxsYmFjazogKCkgPT4gYW55KSB7XG4gIHN0b3BXYXRjaC52YWx1ZSA9IHRydWU7XG4gIGNhbGxiYWNrKCk7XG4gIHN0b3BXYXRjaC52YWx1ZSA9IGZhbHNlO1xufVxuXG53YXRjaCgoKSA9PiBzZWxlY3RlZFZhbHVlcywgYXN5bmMgKCkgPT4ge1xuICBpZiAoIWlzQnJhbmNoLnZhbHVlKSB7XG4gICAgdXBkYXRlU2VsZWN0ZWQoKTtcbiAgfVxuICBhd2FpdCBuZXh0VGljaygpO1xuXG4gIHN5bmNDaGlsZHJlblN0YXR1cygpO1xufSwgeyBkZWVwOiB0cnVlIH0pO1xuXG53YXRjaChzZWxlY3RlZCwgKHYpID0+IHtcbn0pO1xuXG51cGRhdGVTZWxlY3RlZCgpO1xuXG5vbk1vdW50ZWQoKCkgPT4ge1xuICBzeW5jQ2hpbGRyZW5TdGF0dXMoKTtcbn0pO1xuXG5kZWZpbmVFeHBvc2Uoe1xuICBzZWxlY3QsXG4gIHNlbGVjdGVkLFxuICBpbmRldGVybWluYXRlXG59KTtcbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxkaXYgY2xhc3M9XCJjLXRyZWUtaXRlbVwiXG4gICAgOmNsYXNzPVwiWyBpc0JyYW5jaCA/ICdjLXRyZWUtaXRlbS0tYnJhbmNoJyA6ICdjLXRyZWUtaXRlbS0tbGVhZicgXVwiPlxuICAgIDxkaXYgY2xhc3M9XCJkLWZsZXggYy10cmVlLWl0ZW1fX3RpdGxlXCJcbiAgICAgIDpzdHlsZT1cInsgJ3BhZGRpbmctbGVmdCc6IGluZGVudFB4ICsgJ3B4JyB9XCJcbiAgICAgIDpjbGFzcz1cIlsgaXNCcmFuY2ggPyAnYmctbGlnaHQgJyA6ICcnIF1cIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJwLTIgbXMtMlwiPlxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICA6dHlwZT1cIm11bHRpcGxlID8gJ2NoZWNrYm94JyA6ICdyYWRpbydcIlxuICAgICAgICAgIGNsYXNzPVwiZm9ybS1jaGVjay1pbnB1dFwiXG4gICAgICAgICAgdi1pZj1cImlzTGVhZiB8fCAoYnJhbmNoU2VsZWN0YWJsZSAmJiBtdWx0aXBsZSlcIlxuICAgICAgICAgIDppZD1cImlkICsgJ19faXRlbS0nICsgdmFsdWVHZXR0ZXIobm9kZS52YWx1ZSlcIlxuICAgICAgICAgIHYtbW9kZWw9XCJzZWxlY3RlZFwiXG4gICAgICAgICAgOnZhbHVlPVwidHJ1ZVwiXG4gICAgICAgICAgOnVuY2hlY2tlZC12YWx1ZT1cImZhbHNlXCJcbiAgICAgICAgICA6aW5kZXRlcm1pbmF0ZS5zeW5jPVwiaW5kZXRlcm1pbmF0ZVwiXG4gICAgICAgICAgQGNoYW5nZT1cImNoZWNrYm94Q2hhbmdlZCgoJGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS5jaGVja2VkKVwiXG4gICAgICAgIC8+XG4gICAgICAgIDxpbnB1dCB2LWVsc2VcbiAgICAgICAgICA6dHlwZT1cIm11bHRpcGxlID8gJ2NoZWNrYm94JyA6ICdyYWRpbydcIlxuICAgICAgICAgIGNsYXNzPVwiZm9ybS1jaGVjay1pbnB1dFwiXG4gICAgICAgICAgZGlzYWJsZWRcbiAgICAgICAgICA6Y2hlY2tlZD1cImluZGV0ZXJtaW5hdGVcIiA6aW5kZXRlcm1pbmF0ZS5zeW5jPVwiaW5kZXRlcm1pbmF0ZVwiIC8+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxhIGNsYXNzPVwiYy10cmVlLWl0ZW1fX3RleHQgZC1mbGV4IGFsaWduLWl0ZW1zLWNlbnRlciBmbGV4LWdyb3ctMSBweS0yIHRleHQtZGVjb3JhdGlvbi1ub25lXCJcbiAgICAgICAgc3R5bGU9XCJjdXJzb3I6IHBvaW50ZXI7XCJcbiAgICAgICAgOmRhdGEtbGV2ZWw9XCJsZXZlbFwiXG4gICAgICAgIGRhdGEtYnMtdG9nZ2xlPVwiY29sbGFwc2VcIlxuICAgICAgICBAY2xpY2sucHJldmVudD1cImlzTGVhZiA/IHNlbGVjdCghc2VsZWN0ZWQpIDogb3BlbiA9ICFvcGVuXCI+XG4gICAgICAgIDxzcGFuIGNsYXNzPVwibWUtMiBmYVwiIDpjbGFzcz1cIlsgaXNMZWFmID8gJ2ZhLXRhZycgOiAnZmEtZm9sZGVyJyBdXCI+PC9zcGFuPlxuXG4gICAgICAgIHt7IG5vZGUudmFsdWUudGl0bGUgfX1cblxuICAgICAgICA8c3BhbiB2LWlmPVwiaXNCcmFuY2hcIiBjbGFzcz1cIm1zLWF1dG8gbWUtM1wiPlxuICAgICAgICAgIDxzcGFuIDpjbGFzcz1cIlsgb3BlbiA/ICdmYSBmYS1jaGV2cm9uLXVwJyA6ICdmYSBmYS1jaGV2cm9uLWRvd24nIF1cIj48L3NwYW4+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvYT5cbiAgICA8L2Rpdj5cblxuICAgIDxWdWUzU2xpZGVVcERvd25cbiAgICAgIHYtaWY9XCJub2RlLmNoaWxkcmVuLmxlbmd0aCA+IDBcIlxuICAgICAgdi1tb2RlbD1cIm9wZW5cIlxuICAgICAgOmR1cmF0aW9uPVwiMzAwXCJcbiAgICAgIGNsYXNzPVwiYy10cmVlLWl0ZW1fX2NoaWxkcmVuXCJcbiAgICA+XG4gICAgICA8VHJlZUl0ZW0gdi1mb3I9XCIoY2hpbGQsIGkpIG9mIG5vZGUuY2hpbGRyZW5cIlxuICAgICAgICA6bm9kZT1cImNoaWxkXCJcbiAgICAgICAgOmtleT1cInZhbHVlR2V0dGVyKGNoaWxkLnZhbHVlKVwiXG4gICAgICAgIDpsZXZlbD1cImxldmVsICsgMVwiXG4gICAgICAgIDpicmFuY2gtc2VsZWN0YWJsZT1cImJyYW5jaFNlbGVjdGFibGVcIlxuICAgICAgICA6cmVmPVwic2V0Q2hpbGRyZW5Db21wb25lbnRcIlxuICAgICAgICBAY2hhbmdlPVwiY2hpbGRDaGFuZ2VkXCJcbiAgICAgIC8+XG4gICAgPC9WdWUzU2xpZGVVcERvd24+XG4gIDwvZGl2PlxuPC90ZW1wbGF0ZT5cblxuPHN0eWxlIHNjb3BlZCBsYW5nPVwic2Nzc1wiPlxuLmMtdHJlZS1pdGVtIHtcbiAgJl9fdGl0bGUge1xuICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZGRkO1xuICB9XG5cbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuPC9zdHlsZT5cbiIsIjxzY3JpcHQgbGFuZz1cInRzXCIgc2V0dXA+XG5pbXBvcnQgeyBNb2RhbCB9IGZyb20gJ2Jvb3RzdHJhcCc7XG5pbXBvcnQgeyBjb21wdXRlZCwgZ2V0Q3VycmVudEluc3RhbmNlLCBpbmplY3QsIG9uTW91bnRlZCwgb25Vbm1vdW50ZWQsIHByb3ZpZGUsIHJlZiwgdXNlVGVtcGxhdGVSZWYsIHdhdGNoIH0gZnJvbSAndnVlJztcbmltcG9ydCB7IHVzZUh0dHBDbGllbnQgfSBmcm9tICcuLi8uLi8uLi9jb21wb3NhYmxlJztcbmltcG9ydCB7IGZvcmNlQXJyYXkgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlJztcbmltcG9ydCB7IE1heWJlQXJyYXksIE1vZGFsVHJlZVNvdXJjZSwgU2VhcmNoTWF0Y2hlciwgVGl0bGVHZXR0ZXIsIFRyZWVOb2RlLCBWYWx1ZUdldHRlciB9IGZyb20gJy4uLy4uLy4uL3R5cGVzJztcbmltcG9ydCB7IGZsYXR0ZW5DaGlsZHJlbiB9IGZyb20gJy4uLy4uLy4uL3V0aWxpdGllcyc7XG5pbXBvcnQgVHJlZUl0ZW0gZnJvbSAnLi9UcmVlSXRlbS52dWUnO1xuXG5jb25zdCBwcm9wcyA9IHdpdGhEZWZhdWx0cyhcbiAgZGVmaW5lUHJvcHM8e1xuICAgIG9wZW4/OiBib29sZWFuO1xuICAgIGlkPzogc3RyaW5nO1xuICAgIG5hbWU/OiBzdHJpbmc7XG4gICAgdHlwZXM/OiBzdHJpbmdbXTtcbiAgICB0aXRsZT86IHN0cmluZztcbiAgICBkaXNhYmxlZD86IGJvb2xlYW47XG4gICAgcmVhZG9ubHk/OiBib29sZWFuO1xuICAgIHZhbHVlPzogTWF5YmVBcnJheTxzdHJpbmcgfCBudW1iZXI+O1xuICAgIGJyYW5jaFNlbGVjdGFibGU/OiBib29sZWFuO1xuICAgIHNvdXJjZT86IE1vZGFsVHJlZVNvdXJjZTtcbiAgICBzZWFyY2hUZXh0Pzogc3RyaW5nO1xuICB9PigpLFxuICB7XG4gICAgYnJhbmNoU2VsZWN0YWJsZTogZmFsc2UsXG4gIH1cbik7XG5cbmNvbnN0IGVtaXRzID0gZGVmaW5lRW1pdHM8e1xuICBjaGFuZ2U6IFt2YWx1ZTogYW55XTtcbiAgaW5wdXQ6IFt2YWx1ZTogYW55XTtcbiAgc2VsZWN0ZWQ6IFtpdGVtczogYW55W11dO1xuICBoaWRlOiBbXTtcbn0+KCk7XG5cbi8vIHByb3ZpZGUoJ3NlbGVjdE5vZGUnLCBzZWxlY3ROb2RlKTtcblxuY29uc3QgdmFsdWVHZXR0ZXIgPSBpbmplY3Q8VmFsdWVHZXR0ZXI+KCd2YWx1ZUdldHRlcicpO1xuY29uc3QgdGl0bGVHZXR0ZXIgPSBpbmplY3Q8VGl0bGVHZXR0ZXI+KCd0aXRsZUdldHRlcicpO1xuY29uc3Qgc2VhcmNoTWF0Y2hlciA9IGluamVjdDxTZWFyY2hNYXRjaGVyPignc2VhcmNoTWF0Y2hlcicpO1xuXG5jb25zdCBsb2FkaW5nID0gcmVmKGZhbHNlKTtcbmNvbnN0IG11bHRpcGxlID0gaW5qZWN0PGJvb2xlYW4+KCdtdWx0aXBsZScsIGZhbHNlKTtcbmNvbnN0IG1vZGFsRWxlbWVudCA9IHVzZVRlbXBsYXRlUmVmPEhUTUxEaXZFbGVtZW50PignbW9kYWwnKVxuXG5sZXQgJG1vZGFsOiBNb2RhbDtcblxub25Nb3VudGVkKCgpID0+IHtcbiAgJG1vZGFsID0gTW9kYWwuZ2V0T3JDcmVhdGVJbnN0YW5jZShtb2RhbEVsZW1lbnQudmFsdWUhKTtcbiAgbW9kYWxFbGVtZW50LnZhbHVlIS5hZGRFdmVudExpc3RlbmVyKCdzaG93LmJzLm1vZGFsJywgb25TaG93KTtcbiAgbW9kYWxFbGVtZW50LnZhbHVlIS5hZGRFdmVudExpc3RlbmVyKCdoaWRlLmJzLm1vZGFsJywgb25IaWRlKTtcbn0pO1xuXG5vblVubW91bnRlZCgoKSA9PiB7XG4gIG1vZGFsRWxlbWVudC52YWx1ZSEucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2hvdy5icy5tb2RhbCcsIG9uU2hvdyk7XG4gIG1vZGFsRWxlbWVudC52YWx1ZSEucmVtb3ZlRXZlbnRMaXN0ZW5lcignaGlkZS5icy5tb2RhbCcsIG9uSGlkZSk7XG59KTtcblxuLy8gSXRlbXNcbmNvbnN0IG5vZGVzID0gcmVmPFRyZWVOb2RlW10+KFtdKTtcbmNvbnN0IHNlbGVjdGVkTm9kZXMgPSByZWY8VHJlZU5vZGVbXT4oW10pO1xuXG5jb25zdCBkaXNwbGF5Tm9kZXMgPSBjb21wdXRlZCgoKSA9PiB7XG4gIGlmIChzZWFyY2hFbmFibGVkLnZhbHVlKSB7XG4gICAgcmV0dXJuIHNlYXJjaGVkSXRlbXMudmFsdWU7XG4gIH1cbiAgcmV0dXJuIG5vZGVzLnZhbHVlO1xufSk7XG5cbmNvbnN0IGZsYXROb2RlcyA9IGNvbXB1dGVkKCgpID0+IGZsYXR0ZW5DaGlsZHJlbihub2Rlcy52YWx1ZSkpO1xuXG5jb25zdCBzZWxlY3RlZFZhbHVlcyA9IGNvbXB1dGVkKCgpID0+IHtcbiAgcmV0dXJuIGZsYXROb2Rlcy52YWx1ZS5maWx0ZXIoKG5vZGUpID0+IG5vZGUuc2VsZWN0ZWQpLm1hcCgobm9kZSkgPT4gdmFsdWVHZXR0ZXIobm9kZS52YWx1ZSkpO1xufSk7XG5cbnByb3ZpZGUoJ3NlbGVjdGVkVmFsdWVzJywgc2VsZWN0ZWRWYWx1ZXMpO1xuXG53YXRjaCgoKSA9PiBzZWxlY3RlZFZhbHVlcywgKCkgPT4ge1xuICBlbWl0cygnY2hhbmdlJywgc2VsZWN0ZWRWYWx1ZXMudmFsdWUpO1xuICBlbWl0cygnaW5wdXQnLCBzZWxlY3RlZFZhbHVlcy52YWx1ZSk7XG4gIGVtaXRzKCdzZWxlY3RlZCcsIHNlbGVjdGVkTm9kZXMudmFsdWUpO1xufSk7XG5cbi8vIGZ1bmN0aW9uIHNlbGVjdE5vZGUobm9kZTogVHJlZU5vZGUsIHNlbGVjdDogYm9vbGVhbikge1xuLy8gICBub2RlLnNlbGVjdGVkID0gc2VsZWN0O1xuLy9cbi8vICAgLy8gaWYgKHNlbGVjdCkge1xuLy8gICAvLyAgIGlmICghbXVsdGlwbGUpIHtcbi8vICAgLy8gICAgIHNlbGVjdGVkTm9kZXMudmFsdWUgPSBbXTtcbi8vICAgLy8gICB9XG4vLyAgIC8vICAgaWYgKCFzZWxlY3RlZFZhbHVlcy52YWx1ZS5pbmNsdWRlcyh2YWx1ZUdldHRlcihub2RlLnZhbHVlKSkpIHtcbi8vICAgLy8gICAgIHNlbGVjdGVkTm9kZXMudmFsdWUucHVzaChub2RlKTtcbi8vICAgLy8gICB9XG4vLyAgIC8vIH0gZWxzZSB7XG4vLyAgIC8vICAgc2VsZWN0ZWROb2Rlcy52YWx1ZSA9IHNlbGVjdGVkTm9kZXMudmFsdWUuZmlsdGVyKFxuLy8gICAvLyAgICAgKHNlbGVjdGVkTm9kZTogVHJlZU5vZGUpID0+IHZhbHVlR2V0dGVyKHNlbGVjdGVkTm9kZS52YWx1ZSkgIT09IHZhbHVlR2V0dGVyKG5vZGUudmFsdWUpXG4vLyAgIC8vICAgKTtcbi8vICAgLy8gfVxuLy8gICBlbWl0cygnY2hhbmdlJywgc2VsZWN0ZWRWYWx1ZXMudmFsdWUpO1xuLy8gICBlbWl0cygnaW5wdXQnLCBzZWxlY3RlZFZhbHVlcy52YWx1ZSk7XG4vLyAgIGVtaXRzKCdzZWxlY3RlZCcsIHNlbGVjdGVkTm9kZXMudmFsdWUpO1xuLy8gfVxuXG5jb25zdCBjYW5Nb2RpZnkgPSBjb21wdXRlZCgoKSA9PiB7XG4gIHJldHVybiAhcHJvcHMucmVhZG9ubHkgJiYgIXByb3BzLmRpc2FibGVkO1xufSk7XG5cbi8vIFNlYXJjaFxuY29uc3QgcSA9IHJlZignJyk7XG5jb25zdCBzZWFyY2hFbmFibGVkID0gY29tcHV0ZWQoKCkgPT4gcS52YWx1ZSAhPT0gJycpO1xuXG5jb25zdCBzZWFyY2hlZEl0ZW1zID0gY29tcHV0ZWQoKCkgPT4ge1xuICBpZiAocS52YWx1ZSA9PT0gJycpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICByZXR1cm4gZmxhdE5vZGVzLnZhbHVlLmZpbHRlcigoaXRlbTogVHJlZU5vZGUpID0+IHtcbiAgICByZXR1cm4gc2VhcmNoTWF0Y2hlcihpdGVtLnZhbHVlLCBxLnZhbHVlKTtcbiAgfSk7XG59KTtcblxuYXN5bmMgZnVuY3Rpb24gbG9hZEl0ZW1zKCkge1xuICBsb2FkaW5nLnZhbHVlID0gdHJ1ZTtcbiAgY29uc3QgaHR0cCA9IGF3YWl0IHVzZUh0dHBDbGllbnQoKTtcbiAgdHJ5IHtcbiAgICBsZXQgc3JjID0gcHJvcHMuc291cmNlO1xuXG4gICAgaWYgKHR5cGVvZiBzcmMgPT09ICdzdHJpbmcnKSB7XG4gICAgICBjb25zdCByZXMgPSBhd2FpdCBodHRwLmdldChzcmMpO1xuICAgICAgbm9kZXMudmFsdWUgPSByZXMuZGF0YS5kYXRhO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHNyYyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgbm9kZXMudmFsdWUgPSBhd2FpdCBzcmMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHNyYykpIHtcbiAgICAgICAgc3JjID0gc3JjLmNoaWxkcmVuO1xuICAgICAgfVxuXG4gICAgICBub2Rlcy52YWx1ZSA9IHNyYztcbiAgICB9XG4gIH0gZmluYWxseSB7XG4gICAgbG9hZGluZy52YWx1ZSA9IGZhbHNlO1xuICB9XG59XG5cbi8vIE1vZGFsIENvbnRyb2xcbndhdGNoKCgpID0+IHByb3BzLm9wZW4sICh2KSA9PiB7XG4gIGlmICh2KSB7XG4gICAgJG1vZGFsLnNob3coKTtcbiAgfSBlbHNlIHtcbiAgICAkbW9kYWwuaGlkZSgpO1xuICB9XG59KTtcblxuYXN5bmMgZnVuY3Rpb24gb25TaG93KCkge1xuICBhd2FpdCBsb2FkSXRlbXMoKTtcbiAgdXBkYXRlU2VsZWN0ZWRJdGVtc0J5VmFsdWUoKTtcbn1cblxuZnVuY3Rpb24gb25IaWRlKCkge1xuICBub2Rlcy52YWx1ZSA9IFtdO1xuICBxLnZhbHVlID0gJyc7XG4gIGVtaXRzKCdoaWRlJyk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVNlbGVjdGVkSXRlbXNCeVZhbHVlKCkge1xuICBjb25zdCB2YWx1ZXMgPSBmb3JjZUFycmF5KHByb3BzLnZhbHVlKTtcblxuICBzZWxlY3RlZE5vZGVzLnZhbHVlID0gZmxhdE5vZGVzLnZhbHVlXG4gICAgLmZpbHRlcigoaXRlbTogVHJlZU5vZGUpID0+IHtcbiAgICAgIHJldHVybiB2YWx1ZXMuaW5jbHVkZXModmFsdWVHZXR0ZXIoaXRlbS52YWx1ZSkpO1xuICAgIH0pO1xufVxuXG53YXRjaChcbiAgKCkgPT4gcHJvcHMudmFsdWUsXG4gICgpID0+IHVwZGF0ZVNlbGVjdGVkSXRlbXNCeVZhbHVlKCksXG4gIHsgaW1tZWRpYXRlOiB0cnVlLCBkZWVwOiB0cnVlIH1cbik7XG5cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxkaXYgcmVmPVwibW9kYWxcIiBjbGFzcz1cIm1vZGFsIGZhZGVcIiA6aWQ9XCJgJHtpZH1fX21vZGFsYFwiIHRhYmluZGV4PVwiLTFcIiByb2xlPVwiZGlhbG9nXCIgYXJpYS1sYWJlbGxlZGJ5PVwiLW1vZGFsLWxhYmVsXCJcbiAgICBhcmlhLWhpZGRlbj1cInRydWVcIj5cbiAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZGlhbG9nXCIgcm9sZT1cImRvY3VtZW50XCI+XG4gICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtaGVhZGVyXCI+XG4gICAgICAgICAgPGg0IGNsYXNzPVwibW9kYWwtdGl0bGVcIiA6aWQ9XCJgJHtpZH1fX21vZGFsLWxhYmVsYFwiPlxuICAgICAgICAgICAge3sgdGl0bGUgfX1cbiAgICAgICAgICA8L2g0PlxuICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2UgYnRuLWNsb3NlXCIgZGF0YS1icy1kaXNtaXNzPVwibW9kYWxcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPlxuICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCIgY2xhc3M9XCJ2aXN1YWxseS1oaWRkZW5cIj4mdGltZXM7PC9zcGFuPlxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtYm9keSBwLTBcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwic3RkLWZvcm0gYm94LWxpc3QgbS0zXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxuICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInNlYXJjaFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgOnBsYWNlaG9sZGVyPVwic2VhcmNoVGV4dFwiXG4gICAgICAgICAgICAgICAgdi1tb2RlbD1cInFcIiAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IHYtaWY9XCIhbG9hZGluZ1wiIGNsYXNzPVwiYm94LWxpc3RfX2l0ZW1zXCI+XG4gICAgICAgICAgICA8VHJlZUl0ZW0gdi1mb3I9XCJub2RlIG9mIGRpc3BsYXlOb2Rlc1wiXG4gICAgICAgICAgICAgIDpub2RlXG4gICAgICAgICAgICAgIDprZXk9XCJ2YWx1ZUdldHRlcihub2RlLnZhbHVlKVwiXG4gICAgICAgICAgICAgIDpsZXZlbD1cIjFcIlxuICAgICAgICAgICAgICA6YnJhbmNoU2VsZWN0YWJsZVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IHYtZWxzZT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkLWZsZXgganVzdGlmeS1jb250ZW50LWNlbnRlclwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic3Bpbm5lci1ib3JkZXIgc3Bpbm5lci1ib3JkZXItc20gbXktM1wiPjwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuPC90ZW1wbGF0ZT5cblxuPHN0eWxlIHNjb3BlZD5cblxuPC9zdHlsZT5cbiIsIjxzY3JpcHQgbGFuZz1cInRzXCIgc2V0dXA+XG5pbXBvcnQgeyBjbG9uZURlZXAgfSBmcm9tICdsb2Rhc2gtZXMnO1xuaW1wb3J0IHsgY29tcHV0ZWQsIHByb3ZpZGUsIHJlZiwgd2F0Y2ggfSBmcm9tICd2dWUnO1xuaW1wb3J0IHsgZm9yY2VBcnJheSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2UnO1xuaW1wb3J0IHtcbiAgVmFsdWVHZXR0ZXIsXG4gIE1vZGFsVHJlZVNvdXJjZSxcbiAgVGl0bGVHZXR0ZXIsXG4gIFRyZWVOb2RlLFxuICBTZWFyY2hNYXRjaGVyLFxuICBNYXliZUFycmF5LFxuICBNYXliZVByb21pc2Vcbn0gZnJvbSAnLi4vLi4vLi4vdHlwZXMnO1xuaW1wb3J0IFRyZWVNb2RhbCBmcm9tICcuL1RyZWVNb2RhbC52dWUnO1xuXG5jb25zdCBwcm9wcyA9IHdpdGhEZWZhdWx0cyhcbiAgZGVmaW5lUHJvcHM8e1xuICAgIGlkPzogc3RyaW5nO1xuICAgIG5hbWU/OiBzdHJpbmc7XG4gICAgdGl0bGU/OiBzdHJpbmc7XG4gICAgZGlzYWJsZWQ/OiBib29sZWFuO1xuICAgIHJlYWRvbmx5PzogYm9vbGVhbjtcbiAgICB2YWx1ZT86IE1heWJlQXJyYXk8c3RyaW5nIHwgbnVtYmVyPjtcbiAgICBzb3VyY2U/OiBNb2RhbFRyZWVTb3VyY2U7XG4gICAgaXRlbXM/OiBNYXliZUFycmF5PFRyZWVOb2RlPiB8ICgoKSA9PiBNYXliZVByb21pc2U8TWF5YmVBcnJheTxUcmVlTm9kZT4+KTtcbiAgICB2YWx1ZUdldHRlcj86IFZhbHVlR2V0dGVyO1xuICAgIHRpdGxlR2V0dGVyPzogVGl0bGVHZXR0ZXI7XG4gICAgc2VhcmNoTWF0Y2hlcj86IFNlYXJjaE1hdGNoZXI7XG4gICAgbW9kYWxUaXRsZT86IHN0cmluZztcbiAgICB2ZXJ0aWNhbD86IGJvb2xlYW47XG4gICAgYnJhbmNoU2VsZWN0YWJsZT86IGJvb2xlYW47XG4gICAgc2VsZWN0QWxsQ2hpbGRyZW4/OiBib29sZWFuO1xuICAgIHBsYWNlaG9sZGVyPzogc3RyaW5nO1xuICAgIG11bHRpcGxlPzogYm9vbGVhbjtcbiAgICBidXR0b25UZXh0Pzogc3RyaW5nO1xuICAgIGl0ZW1DbGFzcz86IHN0cmluZztcbiAgICBzZWFyY2hUZXh0Pzogc3RyaW5nO1xuICB9PigpLFxuICB7XG4gICAgYnJhbmNoU2VsZWN0YWJsZTogZmFsc2UsXG4gICAgc2VsZWN0QWxsQ2hpbGRyZW46IGZhbHNlLFxuICAgIHBsYWNlaG9sZGVyOiAnLSBObyBzZWxlY3RlZCAtJyxcbiAgICBtdWx0aXBsZTogZmFsc2UsXG4gICAgYnV0dG9uVGV4dDogJ1NlbGVjdCcsXG4gICAgaXRlbUNsYXNzOiAnYmFkZ2UgYmctcHJpbWFyeSBiYWRnZS1waWxsJyxcbiAgICBzZWFyY2hUZXh0OiAnU2VhcmNoJyxcbiAgICB2YWx1ZUdldHRlcjogKGl0ZW06IGFueSkgPT4gaXRlbS5pZCxcbiAgICB0aXRsZUdldHRlcjogKGl0ZW06IGFueSkgPT4gaXRlbS50aXRsZSxcbiAgfVxuKTtcblxucHJvdmlkZSgnaWQnLCBwcm9wcy5pZCk7XG5wcm92aWRlKCduYW1lJywgcHJvcHMubmFtZSk7XG5wcm92aWRlKCdtdWx0aXBsZScsIHByb3BzLm11bHRpcGxlKTtcbnByb3ZpZGUoJ3ZhbHVlR2V0dGVyJywgcHJvcHMudmFsdWVHZXR0ZXIpO1xucHJvdmlkZSgndGl0bGVHZXR0ZXInLCBwcm9wcy50aXRsZUdldHRlcik7XG5wcm92aWRlKCdzZWFyY2hNYXRjaGVyJywgcHJvcHMuc2VhcmNoTWF0Y2hlciA/PyBkZWZhdWx0U2VhcmNoTWF0Y2hlcik7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZWFyY2hNYXRjaGVyKGl0ZW06IGFueSwgcTogc3RyaW5nKSB7XG4gIHJldHVybiBwcm9wcy50aXRsZUdldHRlcihpdGVtKS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHEudG9Mb3dlckNhc2UoKSk7XG59XG5cbmNvbnN0IHNlbGVjdGVkID0gcmVmPFRyZWVOb2RlW10+KFtdKTtcbmNvbnN0IHZhbHVlID0gcmVmPChzdHJpbmd8bnVtYmVyKVtdPihmb3JjZUFycmF5KHByb3BzLnZhbHVlKSk7XG5cbi8vIE1vZGFsXG5jb25zdCB0cmVlTW9kYWxPcGVuID0gcmVmKGZhbHNlKTtcblxuZnVuY3Rpb24gb3BlblNlbGVjdG9yKCkge1xuICB0cmVlTW9kYWxPcGVuLnZhbHVlID0gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gZGVsZXRlSXRlbShpOiBudW1iZXIsIG5vZGU6IFRyZWVOb2RlKSB7XG4gIHNlbGVjdGVkLnZhbHVlID0gc2VsZWN0ZWQudmFsdWUuZmlsdGVyKChpdDogVHJlZU5vZGUpID0+IHByb3BzLnZhbHVlR2V0dGVyKGl0LnZhbHVlKSAhPT0gcHJvcHMudmFsdWVHZXR0ZXIobm9kZS52YWx1ZSkpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVTZWxlY3RlZChpdGVtczogYW55W10pIHtcbiAgc2VsZWN0ZWQudmFsdWUgPSBjbG9uZURlZXAoaXRlbXMpO1xufVxuXG53YXRjaCgoKSA9PiBwcm9wcy5pdGVtcywgYXN5bmMgKHYpID0+IHtcbiAgaWYgKHR5cGVvZiB2ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdiA9IGF3YWl0IHYoKTtcbiAgfVxuXG4gIHNlbGVjdGVkLnZhbHVlID0gZm9yY2VBcnJheSh2KS5maWx0ZXIoKG5vZGU6IFRyZWVOb2RlKSA9PiB7XG4gICAgcmV0dXJuIHZhbHVlLnZhbHVlLmluY2x1ZGVzKHByb3BzLnZhbHVlR2V0dGVyKG5vZGUudmFsdWUpKTtcbiAgfSk7XG59LCB7IGltbWVkaWF0ZTogdHJ1ZSB9KTtcblxuY29uc3Qgc2VsZWN0ZWRWYWx1ZXMgPSBjb21wdXRlZCgoKSA9PiB7XG4gIHJldHVybiBzZWxlY3RlZC52YWx1ZS5tYXAobm9kZSA9PiBwcm9wcy52YWx1ZUdldHRlcihub2RlLnZhbHVlKSk7XG59KTtcblxuY29uc3QgY2FuTW9kaWZ5ID0gY29tcHV0ZWQoKCkgPT4ge1xuICByZXR1cm4gIXByb3BzLnJlYWRvbmx5ICYmICFwcm9wcy5kaXNhYmxlZDtcbn0pO1xuXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8ZGl2IGNsYXNzPVwiYy1tb2RhbC10cmVlXCI+XG4gICAgPGRpdiBjbGFzcz1cImMtbW9kYWwtdHJlZV9fY29udGFpbmVyIHAtMiBkLWZsZXggZmxleC1jb2x1bW5cIlxuICAgICAgOmNsYXNzPVwiWyB2ZXJ0aWNhbCA/ICcnIDogJ2ZsZXgtbWQtcm93JyBdXCI+XG4gICAgICA8ZGl2IHYtaWY9XCJjYW5Nb2RpZnlcIiBjbGFzcz1cIm1lLTIgbWItMlwiXG4gICAgICAgIDpjbGFzcz1cInsgJ21iLW1kLTAnOiAhdmVydGljYWwgfVwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwXCI+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tc2Vjb25kYXJ5IGJ0bi1zbSBidG4tcm91bmRlZCB0ZXh0LW5vd3JhcFwiIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgQGNsaWNrPVwib3BlblNlbGVjdG9yXCI+XG4gICAgICAgICAgICB7eyBidXR0b25UZXh0IH19XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tc2Vjb25kYXJ5IGJ0bi1zbSBidG4tcm91bmRlZFwiIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgQGNsaWNrPVwic2VsZWN0ZWQgPSBbXVwiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJmYSBmYS10aW1lc1wiPjwvc3Bhbj5cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPGRpdiB2LWlmPVwic2VsZWN0ZWQubGVuZ3RoID4gMFwiPlxuICAgICAgICA8VHJhbnNpdGlvbkdyb3VwIG5hbWU9XCJmYWRlXCI+XG4gICAgICAgICAgPHNwYW4gdi1mb3I9XCIobm9kZSwgaSkgb2Ygc2VsZWN0ZWRcIlxuICAgICAgICAgICAgY2xhc3M9XCJtZS0yIG1iLTIgYy1pdGVtXCJcbiAgICAgICAgICAgIDpjbGFzcz1cIml0ZW1DbGFzc1wiXG4gICAgICAgICAgICA6a2V5PVwidmFsdWVHZXR0ZXIobm9kZS52YWx1ZSlcIlxuICAgICAgICAgICAgc3R5bGU9XCJhbmltYXRpb24tZHVyYXRpb246IC4zc1wiPlxuICAgICAgICAgICAgPHNwYW4+e3sgdGl0bGVHZXR0ZXIobm9kZS52YWx1ZSkgfX08L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiB0eXBlPVwiYnV0dG9uXCIgdi1pZj1cImNhbk1vZGlmeVwiXG4gICAgICAgICAgICAgIEBjbGljay5wcmV2ZW50PVwiZGVsZXRlSXRlbShpLCBub2RlKVwiIGNsYXNzPVwibXMtMlwiIHN0eWxlPVwiY3Vyc29yOiBwb2ludGVyXCI+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZmEgZmEtdGltZXNcIj48L3NwYW4+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICA8L1RyYW5zaXRpb25Hcm91cD5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiB2LWVsc2UgY2xhc3M9XCJ0ZXh0LW11dGVkXCI+XG4gICAgICAgIHt7IHBsYWNlaG9sZGVyIH19XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cblxuICAgIDxzZWxlY3QgbXVsdGlwbGVcbiAgICAgIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIlxuICAgICAgcmVmPVwiaW5wdXRcIlxuICAgICAgOmlkPVwiaWRcIlxuICAgICAgOm5hbWU9XCJuYW1lXCJcbiAgICAgIDpkaXNhYmxlZD1cImRpc2FibGVkXCJcbiAgICAgIDpyZWFkb25seT1cInJlYWRvbmx5XCJcbiAgICAgIHYtYmluZD1cIiRhdHRyc1wiXG4gICAgPlxuICAgICAgPG9wdGlvbiB2LWZvcj1cImlkIG9mIHNlbGVjdGVkVmFsdWVzXCIgOnZhbHVlPVwiaWRcIiA6c2VsZWN0ZWQ9XCJ0cnVlXCI+e3sgaWQgfX08L29wdGlvbj5cbiAgICA8L3NlbGVjdD5cblxuICAgIDxUcmVlTW9kYWxcbiAgICAgIDpvcGVuPVwidHJlZU1vZGFsT3BlblwiXG4gICAgICBAaGlkZT1cInRyZWVNb2RhbE9wZW4gPSBmYWxzZVwiXG4gICAgICA6aWQ9XCJpZFwiXG4gICAgICA6dGl0bGU9XCJtb2RhbFRpdGxlXCJcbiAgICAgIDpzb3VyY2U9XCJzb3VyY2VcIlxuICAgICAgOnZhbHVlPVwic2VsZWN0ZWRWYWx1ZXNcIlxuICAgICAgOmJyYW5jaFNlbGVjdGFibGVcbiAgICAgIHYtYmluZD1cIiRhdHRyc1wiXG4gICAgICA6ZGlzYWJsZWQ9XCJkaXNhYmxlZFwiXG4gICAgICA6cmVhZG9ubHk9XCJyZWFkb25seVwiXG4gICAgICA6c2VhcmNoLXRleHQ9XCJzZWFyY2hUZXh0XCJcbiAgICAgIEBzZWxlY3RlZD1cImhhbmRsZVNlbGVjdGVkXCJcbiAgICAvPlxuICA8L2Rpdj5cbjwvdGVtcGxhdGU+XG5cbjxzdHlsZSBzY29wZWQ+XG4uYy1pdGVtIHtcbiAgcGFkZGluZy1sZWZ0OiAuNzVyZW07XG4gIHBhZGRpbmctcmlnaHQ6IC43NXJlbTtcbiAgcGFkZGluZy10b3A6IC41cmVtO1xuICBwYWRkaW5nLWJvdHRvbTogLjVyZW07XG59XG48L3N0eWxlPlxuIiwiaW1wb3J0IHsgZGF0YSB9IGZyb20gJy4uL2RhdGEnO1xuaW1wb3J0IHsgdXNlQ3NzSW1wb3J0IH0gZnJvbSAnLi4vc2VydmljZSc7XG5pbXBvcnQgeyBjcmVhdGVBcHAgfSBmcm9tICd2dWUnO1xuaW1wb3J0IE1vZGFsVHJlZUFwcCBmcm9tICcuLi92dWUvY29tcG9uZW50cy9Nb2RhbFRyZWUvTW9kYWxUcmVlQXBwLnZ1ZSc7XG51c2VDc3NJbXBvcnQoJ0B2dWUtYW5pbWF0ZScpO1xuXG5jb25zdCBhcHAgPSBjcmVhdGVBcHAoe1xuICBuYW1lOiAnbW9kYWwtdHJlZScsXG4gIGNvbXBvbmVudHM6IHtcbiAgICBNb2RhbFRyZWVBcHBcbiAgfVxufSk7XG5hcHAuY29uZmlnLmdsb2JhbFByb3BlcnRpZXMuJGdldERhdGEgPSBkYXRhO1xuXG5jbGFzcyBNb2RhbFRyZWVFbGVtZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICBzdGF0aWMgaXMgPSAnbW9kYWwtdHJlZSc7XG5cbiAgdm06IGFueTtcblxuICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICBpZiAoIXRoaXMudm0pIHtcbiAgICAgIHRoaXMudm0gPSBhcHAubW91bnQodGhpcyk7XG4gICAgfVxuICB9XG59XG5cbmN1c3RvbUVsZW1lbnRzLmRlZmluZShNb2RhbFRyZWVFbGVtZW50LmlzLCBNb2RhbFRyZWVFbGVtZW50KTtcbiJdLCJuYW1lcyI6WyJjaGlsZHJlbiIsImIiLCJDIiwiRSIsImgiLCJwIiwiVyIsIkYiLCJMIiwiayIsInNlbGVjdCIsIl9ob2lzdGVkXzEiLCJfY3JlYXRlRWxlbWVudEJsb2NrIiwiX25vcm1hbGl6ZUNsYXNzIiwiX2NyZWF0ZUVsZW1lbnRWTm9kZSIsIl9ub3JtYWxpemVTdHlsZSIsIl93aXRoRGlyZWN0aXZlcyIsIl9vcGVuQmxvY2siLCJfaG9pc3RlZF8yIiwiX2hvaXN0ZWRfMyIsIl9jcmVhdGVUZXh0Vk5vZGUiLCJfdG9EaXNwbGF5U3RyaW5nIiwiX2hvaXN0ZWRfNSIsIl9jcmVhdGVCbG9jayIsIl9GcmFnbWVudCIsIl9yZW5kZXJMaXN0IiwiX2hvaXN0ZWRfNCIsIl9ob2lzdGVkXzYiLCJfaG9pc3RlZF83IiwiX2NyZWF0ZVZOb2RlIiwiX1RyYW5zaXRpb25Hcm91cCIsIl93aXRoQ3R4IiwiX3dpdGhNb2RpZmllcnMiLCJfY3JlYXRlQ29tbWVudFZOb2RlIiwiX21lcmdlUHJvcHMiXSwibWFwcGlu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QUFBLElBQUEsSUFBQTtBQUFBOzs7OzswQkFLakNyQixtQkFFTSxPQUZOLFlBRU1TLGdCQURELE9BQUEsV0FBVyxHQUFBLENBQUE7QUFBQSxJQUFBLEdBQUEsQ0FBQTtBQUFBLElBSWxCUCxtQkFVUyxVQVZUb0IsV0FVUztBQUFBLE1BVkQsVUFBQTtBQUFBLE1BQ04sT0FBQSxFQUFBLFdBQUEsT0FBQTtBQUFBLE1BQ0EsS0FBSTtBQUFBLE1BQ0gsSUFBSSxPQUFBO0FBQUEsTUFDSixNQUFNLE9BQUE7QUFBQSxNQUNOLFVBQVUsT0FBQTtBQUFBLE1BQ1YsVUFBVSxPQUFBO0FBQUEsSUFBQSxHQUNILEtBQUEsTUFBTSxHQUFBO0FBQUEsT0FBQWpCLFVBQUEsSUFBQSxHQUVkTCxtQkFBbUZZLFVBQUEsTUFBQUMsV0FBOUQsT0FBQSxnQkFBYyxDQUFwQixPQUFFOzRCQUFqQmIsbUJBQW1GLFVBQUE7QUFBQSxVQUE3QyxPQUFPO0FBQUEsVUFBSyxVQUFVO0FBQUEsUUFBQSxHQUFBUyxnQkFBUyxFQUFFLEdBQUEsR0FBQSxVQUFBO0FBQUEsTUFBQSxDQUFBLEdBQUEsR0FBQTtBQUFBO0lBR3pFUSxZQWFFLHFCQWJGSyxXQWFFO0FBQUEsTUFaQyxNQUFNLE9BQUE7QUFBQSxNQUNOLFFBQUksc0NBQUUsT0FBQSxnQkFBYTtBQUFBLE1BQ25CLElBQUksT0FBQTtBQUFBLE1BQ0osT0FBTyxPQUFBO0FBQUEsTUFDUCxRQUFRLE9BQUE7QUFBQSxNQUNSLE9BQU8sT0FBQTtBQUFBLE1BQ1Asa0JBQUEsT0FBQTtBQUFBLElBQUEsR0FDTyxLQUFBLFFBQU07QUFBQSxNQUNiLFVBQVUsT0FBQTtBQUFBLE1BQ1YsVUFBVSxPQUFBO0FBQUEsTUFDVixlQUFhLE9BQUE7QUFBQSxNQUNiLFlBQVUsT0FBQTtBQUFBLElBQUEsQ0FBQSxHQUFBLE1BQUEsSUFBQSxDQUFBLFFBQUEsTUFBQSxTQUFBLFVBQUEsU0FBQSxvQkFBQSxZQUFBLFlBQUEsYUFBQSxDQUFBO0FBQUE7OztBQzlKakIsNkJBQWEsY0FBYztBQUUzQixNQUFNLE1BQU0sMEJBQVU7QUFBQSxFQUNwQixNQUFNO0FBQUEsRUFDTixZQUFZO0FBQUEsSUFDVjtBQUFBLEVBQUE7QUFFSixDQUFDO0FBQ0QsSUFBSSxPQUFPLGlCQUFpQixXQUFXO0FBRXZDLE1BQU0seUJBQXlCLFlBQVk7QUFBQSxFQUN6QyxPQUFPLEtBQUs7QUFBQSxFQUVaO0FBQUEsRUFFQSxvQkFBb0I7QUFDbEIsUUFBSSxDQUFDLEtBQUssSUFBSTtBQUNaLFdBQUssS0FBSyxJQUFJLE1BQU0sSUFBSTtBQUFBLElBQzFCO0FBQUEsRUFDRjtBQUNGO0FBRUEsK0JBQWUsT0FBQSx1QkFBTyxpQkFBaUIsSUFBQSxHQUFJLGdCQUFnQjsiLCJ4X2dvb2dsZV9pZ25vcmVMaXN0IjpbMV19
