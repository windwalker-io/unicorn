import { a7 as forceArray, u as useHttpClient, a5 as useCssImport, a6 as data } from "./unicorn-G5leHO5V.js";
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
const TreeItem = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__scopeId", "data-v-8a4ae0be"], ["__file", "TreeItem.vue"]]);
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
const ModalTreeApp = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-22fa7050"], ["__file", "ModalTreeApp.vue"]]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGQtbW9kYWwtdHJlZS1CS29HSEZ0Sy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxpdGllcy90cmVlLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZTMtc2xpZGUtdXAtZG93bi9kaXN0L3Z1ZTMtc2xpZGUtdXAtZG93bi5qcyIsIi4uLy4uL3NyYy92dWUvY29tcG9uZW50cy9Nb2RhbFRyZWUvVHJlZUl0ZW0udnVlIiwiLi4vLi4vc3JjL3Z1ZS9jb21wb25lbnRzL01vZGFsVHJlZS9UcmVlSXRlbS52dWUiLCIuLi8uLi9zcmMvdnVlL2NvbXBvbmVudHMvTW9kYWxUcmVlL1RyZWVNb2RhbC52dWUiLCIuLi8uLi9zcmMvdnVlL2NvbXBvbmVudHMvTW9kYWxUcmVlL1RyZWVNb2RhbC52dWUiLCIuLi8uLi9zcmMvdnVlL2NvbXBvbmVudHMvTW9kYWxUcmVlL01vZGFsVHJlZUFwcC52dWUiLCIuLi8uLi9zcmMvdnVlL2NvbXBvbmVudHMvTW9kYWxUcmVlL01vZGFsVHJlZUFwcC52dWUiLCIuLi8uLi9zcmMvbW9kdWxlL2ZpZWxkLW1vZGFsLXRyZWUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVHJlZU5vZGUgfSBmcm9tICcuLi90eXBlcyc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZmxhdHRlbkNoaWxkcmVuKGNoaWxkcmVuOiBUcmVlTm9kZVtdKSB7XHJcbiAgY29uc3QgZmxhdDogVHJlZU5vZGVbXSA9IFtdO1xyXG5cclxuICBmdW5jdGlvbiBsb29wQ2hpbGRyZW4oY2hpbGRyZW46IFRyZWVOb2RlW10pIHtcclxuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgY2hpbGRyZW4pIHtcclxuICAgICAgaWYgKGNoaWxkLmNoaWxkcmVuLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIGZsYXQucHVzaChjaGlsZCk7XHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxvb3BDaGlsZHJlbihjaGlsZC5jaGlsZHJlbik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBsb29wQ2hpbGRyZW4oY2hpbGRyZW4pO1xyXG4gIHJldHVybiBmbGF0O1xyXG59XHJcblxyXG4iLCJpbXBvcnQgeyBkZWZpbmVDb21wb25lbnQgYXMgQywgcmVmIGFzIEUsIGNvbXB1dGVkIGFzIGgsIGggYXMgcCwgVHJhbnNpdGlvbiBhcyBXLCB3aXRoRGlyZWN0aXZlcyBhcyBGLCBtZXJnZVByb3BzIGFzIEwsIHZTaG93IGFzIGssIHVucmVmIGFzIGIgfSBmcm9tIFwidnVlXCI7XG5mdW5jdGlvbiB5KHQpIHtcbiAgcmV0dXJuIHtcbiAgICBoZWlnaHQ6IHQuc3R5bGUuaGVpZ2h0LFxuICAgIHdpZHRoOiB0LnN0eWxlLndpZHRoLFxuICAgIHBvc2l0aW9uOiB0LnN0eWxlLnBvc2l0aW9uLFxuICAgIHZpc2liaWxpdHk6IHQuc3R5bGUudmlzaWJpbGl0eSxcbiAgICBvdmVyZmxvdzogdC5zdHlsZS5vdmVyZmxvdyxcbiAgICBwYWRkaW5nVG9wOiB0LnN0eWxlLnBhZGRpbmdUb3AsXG4gICAgcGFkZGluZ0JvdHRvbTogdC5zdHlsZS5wYWRkaW5nQm90dG9tLFxuICAgIGJvcmRlclRvcFdpZHRoOiB0LnN0eWxlLmJvcmRlclRvcFdpZHRoLFxuICAgIGJvcmRlckJvdHRvbVdpZHRoOiB0LnN0eWxlLmJvcmRlckJvdHRvbVdpZHRoLFxuICAgIG1hcmdpblRvcDogdC5zdHlsZS5tYXJnaW5Ub3AsXG4gICAgbWFyZ2luQm90dG9tOiB0LnN0eWxlLm1hcmdpbkJvdHRvbVxuICB9O1xufVxuZnVuY3Rpb24gVih0LCBvLCBpKSB7XG4gIGNvbnN0IGUgPSBiKHQpLCB7IHdpZHRoOiBuIH0gPSBnZXRDb21wdXRlZFN0eWxlKG8pO1xuICBvLnN0eWxlLndpZHRoID0gbiwgby5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIiwgby5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIiwgby5zdHlsZS5oZWlnaHQgPSBcIlwiO1xuICBjb25zdCB7IGhlaWdodDogcyB9ID0gZ2V0Q29tcHV0ZWRTdHlsZShvKTtcbiAgcmV0dXJuIG8uc3R5bGUud2lkdGggPSBpLndpZHRoLCBvLnN0eWxlLnBvc2l0aW9uID0gaS5wb3NpdGlvbiwgby5zdHlsZS52aXNpYmlsaXR5ID0gaS52aXNpYmlsaXR5LCBvLnN0eWxlLmhlaWdodCA9IGUsIG8uc3R5bGUub3ZlcmZsb3cgPSBcImhpZGRlblwiLCBpLmhlaWdodCAmJiBpLmhlaWdodCAhPSBlID8gaS5oZWlnaHQgOiBzO1xufVxuZnVuY3Rpb24gZih0LCBvLCBpLCBlLCBuKSB7XG4gIGNvbnN0IHMgPSB0LmFuaW1hdGUoZSwgbik7XG4gIHQuc3R5bGUuaGVpZ2h0ID0gby5oZWlnaHQsIHMub25maW5pc2ggPSAoKSA9PiB7XG4gICAgdC5zdHlsZS5vdmVyZmxvdyA9IG8ub3ZlcmZsb3csIGkoKTtcbiAgfTtcbn1cbmZ1bmN0aW9uIG0odCwgbywgaSwgZSkge1xuICBjb25zdCBuID0gYihvKTtcbiAgcmV0dXJuIFtcbiAgICB7XG4gICAgICBoZWlnaHQ6IG4sXG4gICAgICBvcGFjaXR5OiB0Lm9wYWNpdHlDbG9zZWQsXG4gICAgICBwYWRkaW5nVG9wOiBuLFxuICAgICAgcGFkZGluZ0JvdHRvbTogbixcbiAgICAgIGJvcmRlclRvcFdpZHRoOiBuLFxuICAgICAgYm9yZGVyQm90dG9tV2lkdGg6IG4sXG4gICAgICBtYXJnaW5Ub3A6IG4sXG4gICAgICBtYXJnaW5Cb3R0b206IG5cbiAgICB9LFxuICAgIHtcbiAgICAgIGhlaWdodDogaSxcbiAgICAgIG9wYWNpdHk6IHQub3BhY2l0eU9wZW4sXG4gICAgICBwYWRkaW5nVG9wOiBlLnBhZGRpbmdUb3AgfHwgMCxcbiAgICAgIHBhZGRpbmdCb3R0b206IGUucGFkZGluZ0JvdHRvbSB8fCAwLFxuICAgICAgYm9yZGVyVG9wV2lkdGg6IGUuYm9yZGVyVG9wV2lkdGggfHwgMCxcbiAgICAgIGJvcmRlckJvdHRvbVdpZHRoOiBlLmJvcmRlckJvdHRvbVdpZHRoIHx8IDAsXG4gICAgICBtYXJnaW5Ub3A6IGUubWFyZ2luVG9wIHx8IDAsXG4gICAgICBtYXJnaW5Cb3R0b206IGUubWFyZ2luQm90dG9tIHx8IDBcbiAgICB9XG4gIF07XG59XG5jb25zdCB4ID0gQyh7XG4gIHByb3BzOiB7XG4gICAgbW9kZWxWYWx1ZToge1xuICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgIGRlZmF1bHQ6ICExXG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBUaW1lIGluIG1pbGxpc2Vjb25kcyBmb3IgdGhlIHNsaWRlIGR1cmF0aW9uXG4gICAgICovXG4gICAgZHVyYXRpb246IHtcbiAgICAgIHR5cGU6IE51bWJlcixcbiAgICAgIGRlZmF1bHQ6IDUwMFxuICAgIH0sXG4gICAgLyoqXG4gICAgICogVGltaW5nIGZ1bmN0aW9uIGZvciB0aGUgYW5pbWF0aW9uXG4gICAgICovXG4gICAgdGltaW5nRnVuY3Rpb246IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6IFwiZWFzZS1pbi1vdXRcIlxuICAgIH0sXG4gICAgLyoqXG4gICAgICogSW5kZXBlbmRlbnQgdGltaW5nIGZ1bmN0aW9uIGZvciB0aGUgYW5pbWF0aW9uIHdoZW4gZW50ZXJpbmdcbiAgICAgKi9cbiAgICB0aW1pbmdGdW5jdGlvbkVudGVyOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiBudWxsXG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBJbmRlcGVuZGVudCB0aW1pbmcgZnVuY3Rpb24gZm9yIHRoZSBhbmltYXRpb24gd2hlbiBsZWF2aW5nXG4gICAgICovXG4gICAgdGltaW5nRnVuY3Rpb25MZWF2ZToge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogbnVsbFxuICAgIH0sXG4gICAgLyoqXG4gICAgICogT3BhY2l0eSB2YWx1ZSBmcm9tIDAgLSAxIG9mIHRoZSBlbGVtZW50IHdoZW4gb3BlblxuICAgICAqL1xuICAgIG9wYWNpdHlPcGVuOiB7XG4gICAgICB0eXBlOiBOdW1iZXIsXG4gICAgICBkZWZhdWx0OiAxXG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBPcGFjaXR5IHZhbHVlIGZyb20gMCAtIDEgb2YgdGhlIGVsZW1lbnQgd2hlbiBjbG9zZWRcbiAgICAgKi9cbiAgICBvcGFjaXR5Q2xvc2VkOiB7XG4gICAgICB0eXBlOiBOdW1iZXIsXG4gICAgICBkZWZhdWx0OiAwXG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBIVE1MIHRhZyB0byB1c2UgZm9yIHRoZSBvdXRlciBjb250YWluZXJcbiAgICAgKi9cbiAgICB0YWc6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6IFwiZGl2XCJcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEFsd2F5cyByZW5kZXIgdGhlIGVsZW1lbnQgaW5zaWRlIHRoZSBzbGlkZSBjb250YWluZXJcbiAgICAgKi9cbiAgICBlYWdlcjoge1xuICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgIGRlZmF1bHQ6ICExXG4gICAgfVxuICB9LFxuICBlbWl0czogW1widXBkYXRlOm1vZGVsVmFsdWVcIiwgXCJvcGVuLXN0YXJ0XCIsIFwib3Blbi1lbmRcIiwgXCJjbG9zZS1zdGFydFwiLCBcImNsb3NlLWVuZFwiXSxcbiAgc2V0dXAodCwgeyBzbG90czogbywgYXR0cnM6IGksIGVtaXQ6IGUgfSkge1xuICAgIGNvbnN0IG4gPSBFKFwiMHB4XCIpLCBzID0gaCgoKSA9PiB0LnRpbWluZ0Z1bmN0aW9uRW50ZXIgfHwgdC50aW1pbmdGdW5jdGlvbiksIHYgPSBoKCgpID0+IHQudGltaW5nRnVuY3Rpb25MZWF2ZSB8fCB0LnRpbWluZ0Z1bmN0aW9uKTtcbiAgICBmdW5jdGlvbiBUKGcsIGwpIHtcbiAgICAgIGNvbnN0IGQgPSBnLCBhID0geShkKSwgciA9IFYobiwgZCwgYSksIHUgPSBtKHQsIG4sIHIsIGEpLCBjID0geyBkdXJhdGlvbjogdC5kdXJhdGlvbiwgZWFzaW5nOiBzLnZhbHVlIH07XG4gICAgICBmKGQsIGEsICgpID0+IHtcbiAgICAgICAgbCgpLCBlKFwib3Blbi1lbmRcIik7XG4gICAgICB9LCB1LCBjKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gQihnLCBsKSB7XG4gICAgICBjb25zdCBkID0gZywgYSA9IHkoZCksIHsgaGVpZ2h0OiByIH0gPSBnZXRDb21wdXRlZFN0eWxlKGQpO1xuICAgICAgZC5zdHlsZS5oZWlnaHQgPSByLCBkLnN0eWxlLm92ZXJmbG93ID0gXCJoaWRkZW5cIjtcbiAgICAgIGNvbnN0IHUgPSBtKHQsIG4sIHIsIGEpLnJldmVyc2UoKSwgYyA9IHsgZHVyYXRpb246IHQuZHVyYXRpb24sIGVhc2luZzogdi52YWx1ZSB9O1xuICAgICAgZihkLCBhLCAoKSA9PiB7XG4gICAgICAgIGwoKSwgZShcImNsb3NlLWVuZFwiKTtcbiAgICAgIH0sIHUsIGMpO1xuICAgIH1cbiAgICByZXR1cm4gKCkgPT4gcChcbiAgICAgIFcsXG4gICAgICB7XG4gICAgICAgIGNzczogITEsXG4gICAgICAgIHBlcnNpc3RlZDogdC5lYWdlcixcbiAgICAgICAgb25CZWZvcmVFbnRlcjogKCkgPT4gZShcIm9wZW4tc3RhcnRcIiksXG4gICAgICAgIG9uRW50ZXI6IFQsXG4gICAgICAgIG9uQmVmb3JlTGVhdmU6ICgpID0+IGUoXCJjbG9zZS1zdGFydFwiKSxcbiAgICAgICAgb25MZWF2ZTogQlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZGVmYXVsdDogKCkgPT4gdC5tb2RlbFZhbHVlIHx8IHQuZWFnZXIgPyBGKFxuICAgICAgICAgIHAoXG4gICAgICAgICAgICB0LnRhZyxcbiAgICAgICAgICAgIEwoaSwge1xuICAgICAgICAgICAgICBjbGFzczogXCJzbGlkZS11cC1kb3duX19jb250YWluZXJcIlxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBvXG4gICAgICAgICAgKSxcbiAgICAgICAgICBbdC5lYWdlciA/IFtrLCB0Lm1vZGVsVmFsdWUgPT09ICEwXSA6IFtudWxsXV1cbiAgICAgICAgKSA6IG51bGxcbiAgICAgIH1cbiAgICApO1xuICB9XG59KTtcbmV4cG9ydCB7XG4gIHggYXMgVnVlM1NsaWRlVXBEb3duXG59O1xuIiwiPHNjcmlwdCBzZXR1cCBsYW5nPVwidHNcIj5cclxuaW1wb3J0IHsgdHlwZSBDb21wb25lbnRQdWJsaWNJbnN0YW5jZSwgdHlwZSBDb21wdXRlZFJlZiwgY29tcHV0ZWQsIGluamVjdCwgbmV4dFRpY2ssIG9uQmVmb3JlVXBkYXRlLCBvbk1vdW50ZWQsIHJlZiwgd2F0Y2ggfSBmcm9tICd2dWUnO1xyXG5pbXBvcnQgeyBWdWUzU2xpZGVVcERvd24gfSBmcm9tICd2dWUzLXNsaWRlLXVwLWRvd24nO1xyXG5pbXBvcnQgeyBUaXRsZUdldHRlciwgVHJlZU5vZGUsIFZhbHVlR2V0dGVyIH0gZnJvbSAnLi4vLi4vLi4vdHlwZXMnO1xyXG5pbXBvcnQgeyBmbGF0dGVuQ2hpbGRyZW4gfSBmcm9tICcuLi8uLi8uLi91dGlsaXRpZXMnO1xyXG5pbXBvcnQgVHJlZUl0ZW0gZnJvbSAnLi9UcmVlSXRlbS52dWUnO1xyXG5cclxuY29uc3QgcHJvcHMgPSB3aXRoRGVmYXVsdHMoXHJcbiAgZGVmaW5lUHJvcHM8e1xyXG4gICAgbm9kZTogVHJlZU5vZGU7XHJcbiAgICBsZXZlbD86IG51bWJlcjtcclxuICAgIGJyYW5jaFNlbGVjdGFibGU/OiBib29sZWFuO1xyXG4gIH0+KCksXHJcbiAge1xyXG4gICAgbGV2ZWw6IDEsXHJcbiAgICBicmFuY2hTZWxlY3RhYmxlOiBmYWxzZSxcclxuICB9XHJcbik7XHJcblxyXG5jb25zdCBlbWl0ID0gZGVmaW5lRW1pdHM8e1xyXG4gIGNoYW5nZTogW2NoZWNrZWQ6IGJvb2xlYW5dO1xyXG4gIGlucHV0OiBbY2hlY2tlZDogYm9vbGVhbl07XHJcbn0+KCk7XHJcblxyXG5jb25zdCBub2RlID0gcmVmPFRyZWVOb2RlPihwcm9wcy5ub2RlKTtcclxuLy8gY29uc3Qgc2VsZWN0Tm9kZSA9IGluamVjdDwobm9kZTogVHJlZU5vZGUsIHNlbGVjdDogYm9vbGVhbikgPT4gYW55Pignc2VsZWN0Tm9kZScpO1xyXG5jb25zdCBzZWxlY3RlZFZhbHVlcyA9IGluamVjdDxDb21wdXRlZFJlZjwoc3RyaW5nIHwgbnVtYmVyKVtdPj4oJ3NlbGVjdGVkVmFsdWVzJyk7XHJcbmNvbnN0IGlkID0gaW5qZWN0KCdpZCcpO1xyXG5jb25zdCBtdWx0aXBsZSA9IGluamVjdCgnbXVsdGlwbGUnKTtcclxuY29uc3QgdmFsdWVHZXR0ZXIgPSBpbmplY3Q8VmFsdWVHZXR0ZXI+KCd2YWx1ZUdldHRlcicpO1xyXG5jb25zdCB0aXRsZUdldHRlciA9IGluamVjdDxUaXRsZUdldHRlcj4oJ3RpdGxlR2V0dGVyJyk7XHJcblxyXG5jb25zdCBzZWxlY3RlZCA9IHJlZihmYWxzZSk7XHJcbmNvbnN0IGluZGV0ZXJtaW5hdGUgPSBjb21wdXRlZCgoKSA9PiAhIXByb3BzLm5vZGUuaW5kZXRlcm1pbmF0ZSk7XHJcbmNvbnN0IHN0b3BXYXRjaCA9IHJlZihmYWxzZSk7XHJcbmNvbnN0IG9wZW4gPSByZWYoZmFsc2UpO1xyXG5jb25zdCBjaGlsZHJlbkNvbXBvbmVudHMgPSByZWY8Q29tcG9uZW50UHVibGljSW5zdGFuY2U8dHlwZW9mIFRyZWVJdGVtPltdPihbXSk7XHJcblxyXG53YXRjaCgoKSA9PiBwcm9wcy5ub2RlLCAoKSA9PiB7XHJcbiAgc2VsZWN0ZWQudmFsdWUgPSAhIXByb3BzLm5vZGUuc2VsZWN0ZWQ7XHJcbn0sIHsgZGVlcDogdHJ1ZSB9KTtcclxuXHJcbmZ1bmN0aW9uIHNldENoaWxkcmVuQ29tcG9uZW50KGNoaWxkOiBDb21wb25lbnRQdWJsaWNJbnN0YW5jZTx0eXBlb2YgVHJlZUl0ZW0+KSB7XHJcbiAgY2hpbGRyZW5Db21wb25lbnRzLnZhbHVlLnB1c2goY2hpbGQpO1xyXG59XHJcblxyXG5vbkJlZm9yZVVwZGF0ZSgoKSA9PiB7XHJcbiAgY2hpbGRyZW5Db21wb25lbnRzLnZhbHVlID0gW107XHJcbn0pO1xyXG5cclxuY29uc3QgaW5kZW50UHggPSBjb21wdXRlZCgoKSA9PiB7XHJcbiAgcmV0dXJuIChwcm9wcy5sZXZlbCAtIDEpICogMTU7XHJcbn0pO1xyXG5cclxuY29uc3QgaXNCcmFuY2ggPSBjb21wdXRlZCgoKSA9PiB7XHJcbiAgcmV0dXJuIHByb3BzLm5vZGUuY2hpbGRyZW4ubGVuZ3RoID4gMDtcclxufSk7XHJcblxyXG5jb25zdCBpc0xlYWYgPSBjb21wdXRlZCgoKSA9PiB7XHJcbiAgcmV0dXJuICFpc0JyYW5jaC52YWx1ZTtcclxufSk7XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVTZWxlY3RlZCgpIHtcclxuICBpZiAoaXNCcmFuY2gudmFsdWUpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIG5vZGUudmFsdWUuc2VsZWN0ZWQgPSBzZWxlY3RlZFZhbHVlcy52YWx1ZS5pbmNsdWRlcyh2YWx1ZUdldHRlcihwcm9wcy5ub2RlLnZhbHVlKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNlbGVjdChzZWxlY3Q6IGJvb2xlYW4pIHtcclxuICBpZiAoc2VsZWN0ZWQudmFsdWUgPT09IHNlbGVjdCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgbm9kZS52YWx1ZS5zZWxlY3RlZCA9IHNlbGVjdDtcclxuXHJcbiAgY2hlY2tib3hDaGFuZ2VkKHNlbGVjdCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNoZWNrYm94Q2hhbmdlZCh2OiBib29sZWFuKSB7XHJcbiAgaWYgKGlzQnJhbmNoLnZhbHVlKSB7XHJcbiAgICBub2RlLnZhbHVlLnNlbGVjdGVkID0gdjtcclxuXHJcbiAgICBpZiAobXVsdGlwbGUpIHtcclxuICAgICAgc3RvcFdhdGNoVGhlbigoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZmxhdENoaWxkcmVuID0gZmxhdHRlbkNoaWxkcmVuKG5vZGUudmFsdWUuY2hpbGRyZW4pO1xyXG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgZmxhdENoaWxkcmVuKSB7XHJcbiAgICAgICAgICBjaGlsZC5zZWxlY3RlZCA9IHY7XHJcbiAgICAgICAgICBjaGlsZC5pbmRldGVybWluYXRlID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgLy8gc3luY0NoaWxkcmVuU3RhdHVzKCk7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIG5leHRUaWNrKCgpID0+IHtcclxuICAgICAgbm9kZS52YWx1ZS5zZWxlY3RlZCA9IHY7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgZW1pdCgnY2hhbmdlJywgdik7XHJcbiAgZW1pdCgnaW5wdXQnLCB2KTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2hpbGRDaGFuZ2VkKHY6IGJvb2xlYW4pIHtcclxuICBpZiAoaXNMZWFmLnZhbHVlIHx8IHN0b3BXYXRjaC52YWx1ZSkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBpZiAoIWNoaWxkcmVuQ29tcG9uZW50cy52YWx1ZSkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBpZiAoY2hpbGRyZW5Db21wb25lbnRzLnZhbHVlLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBzeW5jQ2hpbGRyZW5TdGF0dXMoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gc3luY0NoaWxkcmVuU3RhdHVzKCkge1xyXG4gIGlmIChpc0xlYWYudmFsdWUpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgbGV0IHNlbGVjdGVkQ291bnQgPSAwO1xyXG4gIGxldCB1bnNlbGVjdENvdW50ID0gMDtcclxuICBsZXQgaW5kZXRlcm1pbmF0ZUlubmVyID0gMDtcclxuICBjb25zdCBvbGRJbmRldGVybWluYXRlID0gaW5kZXRlcm1pbmF0ZS52YWx1ZTtcclxuICBjb25zdCBvbGRTZWxlY3RlZCA9IHNlbGVjdGVkLnZhbHVlO1xyXG4gIFxyXG4gIGZvciAoY29uc3QgY2hpbGQgb2YgZmxhdHRlbkNoaWxkcmVuKHByb3BzLm5vZGUuY2hpbGRyZW4pKSB7XHJcbiAgICBpZiAoY2hpbGQuc2VsZWN0ZWQpIHtcclxuICAgICAgc2VsZWN0ZWRDb3VudCsrO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdW5zZWxlY3RDb3VudCsrO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChjaGlsZC5pbmRldGVybWluYXRlKSB7XHJcbiAgICAgIGluZGV0ZXJtaW5hdGVJbm5lcisrO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gZm9yIChjb25zdCBjaGlsZENvbXBvbmVudCBvZiBjaGlsZHJlbkNvbXBvbmVudHMudmFsdWUpIHtcclxuICAvLyAgIGlmIChjaGlsZENvbXBvbmVudC5zZWxlY3RlZCkge1xyXG4gIC8vICAgICBjaGVja2VkKys7XHJcbiAgLy8gICB9IGVsc2Uge1xyXG4gIC8vICAgICB1bmNoZWNrZWQrKztcclxuICAvLyAgIH1cclxuICAvLyAgIGlmIChjaGlsZENvbXBvbmVudC5pbmRldGVybWluYXRlKSB7XHJcbiAgLy8gICAgIGluZGV0ZXJtaW5hdGVJbm5lcisrO1xyXG4gIC8vICAgfVxyXG4gIC8vIH1cclxuXHJcbiAgaWYgKChzZWxlY3RlZENvdW50ICE9PSAwICYmIHVuc2VsZWN0Q291bnQgIT09IDApIHx8IGluZGV0ZXJtaW5hdGVJbm5lciA+IDApIHtcclxuICAgIG5vZGUudmFsdWUuaW5kZXRlcm1pbmF0ZSA9IHRydWU7XHJcbiAgfSBlbHNlIHtcclxuICAgIG5vZGUudmFsdWUuc2VsZWN0ZWQgPSB1bnNlbGVjdENvdW50ID09PSAwO1xyXG4gICAgbm9kZS52YWx1ZS5pbmRldGVybWluYXRlID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBpZiAoXHJcbiAgICBzZWxlY3RlZC52YWx1ZSAhPT0gb2xkU2VsZWN0ZWRcclxuICAgIHx8IGluZGV0ZXJtaW5hdGUudmFsdWUgIT09IG9sZEluZGV0ZXJtaW5hdGVcclxuICApIHtcclxuICAgIGVtaXQoJ2NoYW5nZScsIHNlbGVjdGVkLnZhbHVlKTtcclxuICAgIGVtaXQoJ2lucHV0Jywgc2VsZWN0ZWQudmFsdWUpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gc3RvcFdhdGNoVGhlbihjYWxsYmFjazogKCkgPT4gYW55KSB7XHJcbiAgc3RvcFdhdGNoLnZhbHVlID0gdHJ1ZTtcclxuICBjYWxsYmFjaygpO1xyXG4gIHN0b3BXYXRjaC52YWx1ZSA9IGZhbHNlO1xyXG59XHJcblxyXG53YXRjaCgoKSA9PiBzZWxlY3RlZFZhbHVlcywgYXN5bmMgKCkgPT4ge1xyXG4gIGlmICghaXNCcmFuY2gudmFsdWUpIHtcclxuICAgIHVwZGF0ZVNlbGVjdGVkKCk7XHJcbiAgfVxyXG4gIGF3YWl0IG5leHRUaWNrKCk7XHJcblxyXG4gIHN5bmNDaGlsZHJlblN0YXR1cygpO1xyXG59LCB7IGRlZXA6IHRydWUgfSk7XHJcblxyXG53YXRjaChzZWxlY3RlZCwgKHYpID0+IHtcclxufSk7XHJcblxyXG51cGRhdGVTZWxlY3RlZCgpO1xyXG5cclxub25Nb3VudGVkKCgpID0+IHtcclxuICBzeW5jQ2hpbGRyZW5TdGF0dXMoKTtcclxufSk7XHJcblxyXG5kZWZpbmVFeHBvc2Uoe1xyXG4gIHNlbGVjdCxcclxuICBzZWxlY3RlZCxcclxuICBpbmRldGVybWluYXRlXHJcbn0pO1xyXG48L3NjcmlwdD5cclxuXHJcbjx0ZW1wbGF0ZT5cclxuICA8ZGl2IGNsYXNzPVwiYy10cmVlLWl0ZW1cIlxyXG4gICAgOmNsYXNzPVwiWyBpc0JyYW5jaCA/ICdjLXRyZWUtaXRlbS0tYnJhbmNoJyA6ICdjLXRyZWUtaXRlbS0tbGVhZicgXVwiPlxyXG4gICAgPGRpdiBjbGFzcz1cImQtZmxleCBjLXRyZWUtaXRlbV9fdGl0bGVcIlxyXG4gICAgICA6c3R5bGU9XCJ7ICdwYWRkaW5nLWxlZnQnOiBpbmRlbnRQeCArICdweCcgfVwiXHJcbiAgICAgIDpjbGFzcz1cIlsgaXNCcmFuY2ggPyAnYmctbGlnaHQgJyA6ICcnIF1cIj5cclxuICAgICAgPGRpdiBjbGFzcz1cInAtMiBtcy0yXCI+XHJcbiAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICA6dHlwZT1cIm11bHRpcGxlID8gJ2NoZWNrYm94JyA6ICdyYWRpbydcIlxyXG4gICAgICAgICAgY2xhc3M9XCJmb3JtLWNoZWNrLWlucHV0XCJcclxuICAgICAgICAgIHYtaWY9XCJpc0xlYWYgfHwgKGJyYW5jaFNlbGVjdGFibGUgJiYgbXVsdGlwbGUpXCJcclxuICAgICAgICAgIDppZD1cImlkICsgJ19faXRlbS0nICsgdmFsdWVHZXR0ZXIobm9kZS52YWx1ZSlcIlxyXG4gICAgICAgICAgdi1tb2RlbD1cInNlbGVjdGVkXCJcclxuICAgICAgICAgIDp2YWx1ZT1cInRydWVcIlxyXG4gICAgICAgICAgOnVuY2hlY2tlZC12YWx1ZT1cImZhbHNlXCJcclxuICAgICAgICAgIDppbmRldGVybWluYXRlLnN5bmM9XCJpbmRldGVybWluYXRlXCJcclxuICAgICAgICAgIEBjaGFuZ2U9XCJjaGVja2JveENoYW5nZWQoKCRldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkuY2hlY2tlZClcIlxyXG4gICAgICAgIC8+XHJcbiAgICAgICAgPGlucHV0IHYtZWxzZVxyXG4gICAgICAgICAgOnR5cGU9XCJtdWx0aXBsZSA/ICdjaGVja2JveCcgOiAncmFkaW8nXCJcclxuICAgICAgICAgIGNsYXNzPVwiZm9ybS1jaGVjay1pbnB1dFwiXHJcbiAgICAgICAgICBkaXNhYmxlZFxyXG4gICAgICAgICAgOmNoZWNrZWQ9XCJpbmRldGVybWluYXRlXCIgOmluZGV0ZXJtaW5hdGUuc3luYz1cImluZGV0ZXJtaW5hdGVcIiAvPlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGEgY2xhc3M9XCJjLXRyZWUtaXRlbV9fdGV4dCBkLWZsZXggYWxpZ24taXRlbXMtY2VudGVyIGZsZXgtZ3Jvdy0xIHB5LTIgdGV4dC1kZWNvcmF0aW9uLW5vbmVcIlxyXG4gICAgICAgIHN0eWxlPVwiY3Vyc29yOiBwb2ludGVyO1wiXHJcbiAgICAgICAgOmRhdGEtbGV2ZWw9XCJsZXZlbFwiXHJcbiAgICAgICAgZGF0YS1icy10b2dnbGU9XCJjb2xsYXBzZVwiXHJcbiAgICAgICAgQGNsaWNrLnByZXZlbnQ9XCJpc0xlYWYgPyBzZWxlY3QoIXNlbGVjdGVkKSA6IG9wZW4gPSAhb3BlblwiPlxyXG4gICAgICAgIDxzcGFuIGNsYXNzPVwibWUtMiBmYVwiIDpjbGFzcz1cIlsgaXNMZWFmID8gJ2ZhLXRhZycgOiAnZmEtZm9sZGVyJyBdXCI+PC9zcGFuPlxyXG5cclxuICAgICAgICB7eyBub2RlLnZhbHVlLnRpdGxlIH19XHJcblxyXG4gICAgICAgIDxzcGFuIHYtaWY9XCJpc0JyYW5jaFwiIGNsYXNzPVwibXMtYXV0byBtZS0zXCI+XHJcbiAgICAgICAgICA8c3BhbiA6Y2xhc3M9XCJbIG9wZW4gPyAnZmEgZmEtY2hldnJvbi11cCcgOiAnZmEgZmEtY2hldnJvbi1kb3duJyBdXCI+PC9zcGFuPlxyXG4gICAgICAgIDwvc3Bhbj5cclxuICAgICAgPC9hPlxyXG4gICAgPC9kaXY+XHJcblxyXG4gICAgPFZ1ZTNTbGlkZVVwRG93blxyXG4gICAgICB2LWlmPVwibm9kZS5jaGlsZHJlbi5sZW5ndGggPiAwXCJcclxuICAgICAgdi1tb2RlbD1cIm9wZW5cIlxyXG4gICAgICA6ZHVyYXRpb249XCIzMDBcIlxyXG4gICAgICBjbGFzcz1cImMtdHJlZS1pdGVtX19jaGlsZHJlblwiXHJcbiAgICA+XHJcbiAgICAgIDxUcmVlSXRlbSB2LWZvcj1cIihjaGlsZCwgaSkgb2Ygbm9kZS5jaGlsZHJlblwiXHJcbiAgICAgICAgOm5vZGU9XCJjaGlsZFwiXHJcbiAgICAgICAgOmtleT1cInZhbHVlR2V0dGVyKGNoaWxkLnZhbHVlKVwiXHJcbiAgICAgICAgOmxldmVsPVwibGV2ZWwgKyAxXCJcclxuICAgICAgICA6YnJhbmNoLXNlbGVjdGFibGU9XCJicmFuY2hTZWxlY3RhYmxlXCJcclxuICAgICAgICA6cmVmPVwic2V0Q2hpbGRyZW5Db21wb25lbnRcIlxyXG4gICAgICAgIEBjaGFuZ2U9XCJjaGlsZENoYW5nZWRcIlxyXG4gICAgICAvPlxyXG4gICAgPC9WdWUzU2xpZGVVcERvd24+XHJcbiAgPC9kaXY+XHJcbjwvdGVtcGxhdGU+XHJcblxyXG48c3R5bGUgc2NvcGVkIGxhbmc9XCJzY3NzXCI+XHJcbi5jLXRyZWUtaXRlbSB7XHJcbiAgJl9fdGl0bGUge1xyXG4gICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNkZGQ7XHJcbiAgfVxyXG5cclxuICBjdXJzb3I6IHBvaW50ZXI7XHJcbn1cclxuPC9zdHlsZT5cclxuIiwiPHNjcmlwdCBzZXR1cCBsYW5nPVwidHNcIj5cclxuaW1wb3J0IHsgdHlwZSBDb21wb25lbnRQdWJsaWNJbnN0YW5jZSwgdHlwZSBDb21wdXRlZFJlZiwgY29tcHV0ZWQsIGluamVjdCwgbmV4dFRpY2ssIG9uQmVmb3JlVXBkYXRlLCBvbk1vdW50ZWQsIHJlZiwgd2F0Y2ggfSBmcm9tICd2dWUnO1xyXG5pbXBvcnQgeyBWdWUzU2xpZGVVcERvd24gfSBmcm9tICd2dWUzLXNsaWRlLXVwLWRvd24nO1xyXG5pbXBvcnQgeyBUaXRsZUdldHRlciwgVHJlZU5vZGUsIFZhbHVlR2V0dGVyIH0gZnJvbSAnLi4vLi4vLi4vdHlwZXMnO1xyXG5pbXBvcnQgeyBmbGF0dGVuQ2hpbGRyZW4gfSBmcm9tICcuLi8uLi8uLi91dGlsaXRpZXMnO1xyXG5pbXBvcnQgVHJlZUl0ZW0gZnJvbSAnLi9UcmVlSXRlbS52dWUnO1xyXG5cclxuY29uc3QgcHJvcHMgPSB3aXRoRGVmYXVsdHMoXHJcbiAgZGVmaW5lUHJvcHM8e1xyXG4gICAgbm9kZTogVHJlZU5vZGU7XHJcbiAgICBsZXZlbD86IG51bWJlcjtcclxuICAgIGJyYW5jaFNlbGVjdGFibGU/OiBib29sZWFuO1xyXG4gIH0+KCksXHJcbiAge1xyXG4gICAgbGV2ZWw6IDEsXHJcbiAgICBicmFuY2hTZWxlY3RhYmxlOiBmYWxzZSxcclxuICB9XHJcbik7XHJcblxyXG5jb25zdCBlbWl0ID0gZGVmaW5lRW1pdHM8e1xyXG4gIGNoYW5nZTogW2NoZWNrZWQ6IGJvb2xlYW5dO1xyXG4gIGlucHV0OiBbY2hlY2tlZDogYm9vbGVhbl07XHJcbn0+KCk7XHJcblxyXG5jb25zdCBub2RlID0gcmVmPFRyZWVOb2RlPihwcm9wcy5ub2RlKTtcclxuLy8gY29uc3Qgc2VsZWN0Tm9kZSA9IGluamVjdDwobm9kZTogVHJlZU5vZGUsIHNlbGVjdDogYm9vbGVhbikgPT4gYW55Pignc2VsZWN0Tm9kZScpO1xyXG5jb25zdCBzZWxlY3RlZFZhbHVlcyA9IGluamVjdDxDb21wdXRlZFJlZjwoc3RyaW5nIHwgbnVtYmVyKVtdPj4oJ3NlbGVjdGVkVmFsdWVzJyk7XHJcbmNvbnN0IGlkID0gaW5qZWN0KCdpZCcpO1xyXG5jb25zdCBtdWx0aXBsZSA9IGluamVjdCgnbXVsdGlwbGUnKTtcclxuY29uc3QgdmFsdWVHZXR0ZXIgPSBpbmplY3Q8VmFsdWVHZXR0ZXI+KCd2YWx1ZUdldHRlcicpO1xyXG5jb25zdCB0aXRsZUdldHRlciA9IGluamVjdDxUaXRsZUdldHRlcj4oJ3RpdGxlR2V0dGVyJyk7XHJcblxyXG5jb25zdCBzZWxlY3RlZCA9IHJlZihmYWxzZSk7XHJcbmNvbnN0IGluZGV0ZXJtaW5hdGUgPSBjb21wdXRlZCgoKSA9PiAhIXByb3BzLm5vZGUuaW5kZXRlcm1pbmF0ZSk7XHJcbmNvbnN0IHN0b3BXYXRjaCA9IHJlZihmYWxzZSk7XHJcbmNvbnN0IG9wZW4gPSByZWYoZmFsc2UpO1xyXG5jb25zdCBjaGlsZHJlbkNvbXBvbmVudHMgPSByZWY8Q29tcG9uZW50UHVibGljSW5zdGFuY2U8dHlwZW9mIFRyZWVJdGVtPltdPihbXSk7XHJcblxyXG53YXRjaCgoKSA9PiBwcm9wcy5ub2RlLCAoKSA9PiB7XHJcbiAgc2VsZWN0ZWQudmFsdWUgPSAhIXByb3BzLm5vZGUuc2VsZWN0ZWQ7XHJcbn0sIHsgZGVlcDogdHJ1ZSB9KTtcclxuXHJcbmZ1bmN0aW9uIHNldENoaWxkcmVuQ29tcG9uZW50KGNoaWxkOiBDb21wb25lbnRQdWJsaWNJbnN0YW5jZTx0eXBlb2YgVHJlZUl0ZW0+KSB7XHJcbiAgY2hpbGRyZW5Db21wb25lbnRzLnZhbHVlLnB1c2goY2hpbGQpO1xyXG59XHJcblxyXG5vbkJlZm9yZVVwZGF0ZSgoKSA9PiB7XHJcbiAgY2hpbGRyZW5Db21wb25lbnRzLnZhbHVlID0gW107XHJcbn0pO1xyXG5cclxuY29uc3QgaW5kZW50UHggPSBjb21wdXRlZCgoKSA9PiB7XHJcbiAgcmV0dXJuIChwcm9wcy5sZXZlbCAtIDEpICogMTU7XHJcbn0pO1xyXG5cclxuY29uc3QgaXNCcmFuY2ggPSBjb21wdXRlZCgoKSA9PiB7XHJcbiAgcmV0dXJuIHByb3BzLm5vZGUuY2hpbGRyZW4ubGVuZ3RoID4gMDtcclxufSk7XHJcblxyXG5jb25zdCBpc0xlYWYgPSBjb21wdXRlZCgoKSA9PiB7XHJcbiAgcmV0dXJuICFpc0JyYW5jaC52YWx1ZTtcclxufSk7XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVTZWxlY3RlZCgpIHtcclxuICBpZiAoaXNCcmFuY2gudmFsdWUpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIG5vZGUudmFsdWUuc2VsZWN0ZWQgPSBzZWxlY3RlZFZhbHVlcy52YWx1ZS5pbmNsdWRlcyh2YWx1ZUdldHRlcihwcm9wcy5ub2RlLnZhbHVlKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNlbGVjdChzZWxlY3Q6IGJvb2xlYW4pIHtcclxuICBpZiAoc2VsZWN0ZWQudmFsdWUgPT09IHNlbGVjdCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgbm9kZS52YWx1ZS5zZWxlY3RlZCA9IHNlbGVjdDtcclxuXHJcbiAgY2hlY2tib3hDaGFuZ2VkKHNlbGVjdCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNoZWNrYm94Q2hhbmdlZCh2OiBib29sZWFuKSB7XHJcbiAgaWYgKGlzQnJhbmNoLnZhbHVlKSB7XHJcbiAgICBub2RlLnZhbHVlLnNlbGVjdGVkID0gdjtcclxuXHJcbiAgICBpZiAobXVsdGlwbGUpIHtcclxuICAgICAgc3RvcFdhdGNoVGhlbigoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZmxhdENoaWxkcmVuID0gZmxhdHRlbkNoaWxkcmVuKG5vZGUudmFsdWUuY2hpbGRyZW4pO1xyXG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgZmxhdENoaWxkcmVuKSB7XHJcbiAgICAgICAgICBjaGlsZC5zZWxlY3RlZCA9IHY7XHJcbiAgICAgICAgICBjaGlsZC5pbmRldGVybWluYXRlID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgLy8gc3luY0NoaWxkcmVuU3RhdHVzKCk7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIG5leHRUaWNrKCgpID0+IHtcclxuICAgICAgbm9kZS52YWx1ZS5zZWxlY3RlZCA9IHY7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgZW1pdCgnY2hhbmdlJywgdik7XHJcbiAgZW1pdCgnaW5wdXQnLCB2KTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2hpbGRDaGFuZ2VkKHY6IGJvb2xlYW4pIHtcclxuICBpZiAoaXNMZWFmLnZhbHVlIHx8IHN0b3BXYXRjaC52YWx1ZSkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBpZiAoIWNoaWxkcmVuQ29tcG9uZW50cy52YWx1ZSkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBpZiAoY2hpbGRyZW5Db21wb25lbnRzLnZhbHVlLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBzeW5jQ2hpbGRyZW5TdGF0dXMoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gc3luY0NoaWxkcmVuU3RhdHVzKCkge1xyXG4gIGlmIChpc0xlYWYudmFsdWUpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgbGV0IHNlbGVjdGVkQ291bnQgPSAwO1xyXG4gIGxldCB1bnNlbGVjdENvdW50ID0gMDtcclxuICBsZXQgaW5kZXRlcm1pbmF0ZUlubmVyID0gMDtcclxuICBjb25zdCBvbGRJbmRldGVybWluYXRlID0gaW5kZXRlcm1pbmF0ZS52YWx1ZTtcclxuICBjb25zdCBvbGRTZWxlY3RlZCA9IHNlbGVjdGVkLnZhbHVlO1xyXG4gIFxyXG4gIGZvciAoY29uc3QgY2hpbGQgb2YgZmxhdHRlbkNoaWxkcmVuKHByb3BzLm5vZGUuY2hpbGRyZW4pKSB7XHJcbiAgICBpZiAoY2hpbGQuc2VsZWN0ZWQpIHtcclxuICAgICAgc2VsZWN0ZWRDb3VudCsrO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdW5zZWxlY3RDb3VudCsrO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChjaGlsZC5pbmRldGVybWluYXRlKSB7XHJcbiAgICAgIGluZGV0ZXJtaW5hdGVJbm5lcisrO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gZm9yIChjb25zdCBjaGlsZENvbXBvbmVudCBvZiBjaGlsZHJlbkNvbXBvbmVudHMudmFsdWUpIHtcclxuICAvLyAgIGlmIChjaGlsZENvbXBvbmVudC5zZWxlY3RlZCkge1xyXG4gIC8vICAgICBjaGVja2VkKys7XHJcbiAgLy8gICB9IGVsc2Uge1xyXG4gIC8vICAgICB1bmNoZWNrZWQrKztcclxuICAvLyAgIH1cclxuICAvLyAgIGlmIChjaGlsZENvbXBvbmVudC5pbmRldGVybWluYXRlKSB7XHJcbiAgLy8gICAgIGluZGV0ZXJtaW5hdGVJbm5lcisrO1xyXG4gIC8vICAgfVxyXG4gIC8vIH1cclxuXHJcbiAgaWYgKChzZWxlY3RlZENvdW50ICE9PSAwICYmIHVuc2VsZWN0Q291bnQgIT09IDApIHx8IGluZGV0ZXJtaW5hdGVJbm5lciA+IDApIHtcclxuICAgIG5vZGUudmFsdWUuaW5kZXRlcm1pbmF0ZSA9IHRydWU7XHJcbiAgfSBlbHNlIHtcclxuICAgIG5vZGUudmFsdWUuc2VsZWN0ZWQgPSB1bnNlbGVjdENvdW50ID09PSAwO1xyXG4gICAgbm9kZS52YWx1ZS5pbmRldGVybWluYXRlID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBpZiAoXHJcbiAgICBzZWxlY3RlZC52YWx1ZSAhPT0gb2xkU2VsZWN0ZWRcclxuICAgIHx8IGluZGV0ZXJtaW5hdGUudmFsdWUgIT09IG9sZEluZGV0ZXJtaW5hdGVcclxuICApIHtcclxuICAgIGVtaXQoJ2NoYW5nZScsIHNlbGVjdGVkLnZhbHVlKTtcclxuICAgIGVtaXQoJ2lucHV0Jywgc2VsZWN0ZWQudmFsdWUpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gc3RvcFdhdGNoVGhlbihjYWxsYmFjazogKCkgPT4gYW55KSB7XHJcbiAgc3RvcFdhdGNoLnZhbHVlID0gdHJ1ZTtcclxuICBjYWxsYmFjaygpO1xyXG4gIHN0b3BXYXRjaC52YWx1ZSA9IGZhbHNlO1xyXG59XHJcblxyXG53YXRjaCgoKSA9PiBzZWxlY3RlZFZhbHVlcywgYXN5bmMgKCkgPT4ge1xyXG4gIGlmICghaXNCcmFuY2gudmFsdWUpIHtcclxuICAgIHVwZGF0ZVNlbGVjdGVkKCk7XHJcbiAgfVxyXG4gIGF3YWl0IG5leHRUaWNrKCk7XHJcblxyXG4gIHN5bmNDaGlsZHJlblN0YXR1cygpO1xyXG59LCB7IGRlZXA6IHRydWUgfSk7XHJcblxyXG53YXRjaChzZWxlY3RlZCwgKHYpID0+IHtcclxufSk7XHJcblxyXG51cGRhdGVTZWxlY3RlZCgpO1xyXG5cclxub25Nb3VudGVkKCgpID0+IHtcclxuICBzeW5jQ2hpbGRyZW5TdGF0dXMoKTtcclxufSk7XHJcblxyXG5kZWZpbmVFeHBvc2Uoe1xyXG4gIHNlbGVjdCxcclxuICBzZWxlY3RlZCxcclxuICBpbmRldGVybWluYXRlXHJcbn0pO1xyXG48L3NjcmlwdD5cclxuXHJcbjx0ZW1wbGF0ZT5cclxuICA8ZGl2IGNsYXNzPVwiYy10cmVlLWl0ZW1cIlxyXG4gICAgOmNsYXNzPVwiWyBpc0JyYW5jaCA/ICdjLXRyZWUtaXRlbS0tYnJhbmNoJyA6ICdjLXRyZWUtaXRlbS0tbGVhZicgXVwiPlxyXG4gICAgPGRpdiBjbGFzcz1cImQtZmxleCBjLXRyZWUtaXRlbV9fdGl0bGVcIlxyXG4gICAgICA6c3R5bGU9XCJ7ICdwYWRkaW5nLWxlZnQnOiBpbmRlbnRQeCArICdweCcgfVwiXHJcbiAgICAgIDpjbGFzcz1cIlsgaXNCcmFuY2ggPyAnYmctbGlnaHQgJyA6ICcnIF1cIj5cclxuICAgICAgPGRpdiBjbGFzcz1cInAtMiBtcy0yXCI+XHJcbiAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICA6dHlwZT1cIm11bHRpcGxlID8gJ2NoZWNrYm94JyA6ICdyYWRpbydcIlxyXG4gICAgICAgICAgY2xhc3M9XCJmb3JtLWNoZWNrLWlucHV0XCJcclxuICAgICAgICAgIHYtaWY9XCJpc0xlYWYgfHwgKGJyYW5jaFNlbGVjdGFibGUgJiYgbXVsdGlwbGUpXCJcclxuICAgICAgICAgIDppZD1cImlkICsgJ19faXRlbS0nICsgdmFsdWVHZXR0ZXIobm9kZS52YWx1ZSlcIlxyXG4gICAgICAgICAgdi1tb2RlbD1cInNlbGVjdGVkXCJcclxuICAgICAgICAgIDp2YWx1ZT1cInRydWVcIlxyXG4gICAgICAgICAgOnVuY2hlY2tlZC12YWx1ZT1cImZhbHNlXCJcclxuICAgICAgICAgIDppbmRldGVybWluYXRlLnN5bmM9XCJpbmRldGVybWluYXRlXCJcclxuICAgICAgICAgIEBjaGFuZ2U9XCJjaGVja2JveENoYW5nZWQoKCRldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkuY2hlY2tlZClcIlxyXG4gICAgICAgIC8+XHJcbiAgICAgICAgPGlucHV0IHYtZWxzZVxyXG4gICAgICAgICAgOnR5cGU9XCJtdWx0aXBsZSA/ICdjaGVja2JveCcgOiAncmFkaW8nXCJcclxuICAgICAgICAgIGNsYXNzPVwiZm9ybS1jaGVjay1pbnB1dFwiXHJcbiAgICAgICAgICBkaXNhYmxlZFxyXG4gICAgICAgICAgOmNoZWNrZWQ9XCJpbmRldGVybWluYXRlXCIgOmluZGV0ZXJtaW5hdGUuc3luYz1cImluZGV0ZXJtaW5hdGVcIiAvPlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGEgY2xhc3M9XCJjLXRyZWUtaXRlbV9fdGV4dCBkLWZsZXggYWxpZ24taXRlbXMtY2VudGVyIGZsZXgtZ3Jvdy0xIHB5LTIgdGV4dC1kZWNvcmF0aW9uLW5vbmVcIlxyXG4gICAgICAgIHN0eWxlPVwiY3Vyc29yOiBwb2ludGVyO1wiXHJcbiAgICAgICAgOmRhdGEtbGV2ZWw9XCJsZXZlbFwiXHJcbiAgICAgICAgZGF0YS1icy10b2dnbGU9XCJjb2xsYXBzZVwiXHJcbiAgICAgICAgQGNsaWNrLnByZXZlbnQ9XCJpc0xlYWYgPyBzZWxlY3QoIXNlbGVjdGVkKSA6IG9wZW4gPSAhb3BlblwiPlxyXG4gICAgICAgIDxzcGFuIGNsYXNzPVwibWUtMiBmYVwiIDpjbGFzcz1cIlsgaXNMZWFmID8gJ2ZhLXRhZycgOiAnZmEtZm9sZGVyJyBdXCI+PC9zcGFuPlxyXG5cclxuICAgICAgICB7eyBub2RlLnZhbHVlLnRpdGxlIH19XHJcblxyXG4gICAgICAgIDxzcGFuIHYtaWY9XCJpc0JyYW5jaFwiIGNsYXNzPVwibXMtYXV0byBtZS0zXCI+XHJcbiAgICAgICAgICA8c3BhbiA6Y2xhc3M9XCJbIG9wZW4gPyAnZmEgZmEtY2hldnJvbi11cCcgOiAnZmEgZmEtY2hldnJvbi1kb3duJyBdXCI+PC9zcGFuPlxyXG4gICAgICAgIDwvc3Bhbj5cclxuICAgICAgPC9hPlxyXG4gICAgPC9kaXY+XHJcblxyXG4gICAgPFZ1ZTNTbGlkZVVwRG93blxyXG4gICAgICB2LWlmPVwibm9kZS5jaGlsZHJlbi5sZW5ndGggPiAwXCJcclxuICAgICAgdi1tb2RlbD1cIm9wZW5cIlxyXG4gICAgICA6ZHVyYXRpb249XCIzMDBcIlxyXG4gICAgICBjbGFzcz1cImMtdHJlZS1pdGVtX19jaGlsZHJlblwiXHJcbiAgICA+XHJcbiAgICAgIDxUcmVlSXRlbSB2LWZvcj1cIihjaGlsZCwgaSkgb2Ygbm9kZS5jaGlsZHJlblwiXHJcbiAgICAgICAgOm5vZGU9XCJjaGlsZFwiXHJcbiAgICAgICAgOmtleT1cInZhbHVlR2V0dGVyKGNoaWxkLnZhbHVlKVwiXHJcbiAgICAgICAgOmxldmVsPVwibGV2ZWwgKyAxXCJcclxuICAgICAgICA6YnJhbmNoLXNlbGVjdGFibGU9XCJicmFuY2hTZWxlY3RhYmxlXCJcclxuICAgICAgICA6cmVmPVwic2V0Q2hpbGRyZW5Db21wb25lbnRcIlxyXG4gICAgICAgIEBjaGFuZ2U9XCJjaGlsZENoYW5nZWRcIlxyXG4gICAgICAvPlxyXG4gICAgPC9WdWUzU2xpZGVVcERvd24+XHJcbiAgPC9kaXY+XHJcbjwvdGVtcGxhdGU+XHJcblxyXG48c3R5bGUgc2NvcGVkIGxhbmc9XCJzY3NzXCI+XHJcbi5jLXRyZWUtaXRlbSB7XHJcbiAgJl9fdGl0bGUge1xyXG4gICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNkZGQ7XHJcbiAgfVxyXG5cclxuICBjdXJzb3I6IHBvaW50ZXI7XHJcbn1cclxuPC9zdHlsZT5cclxuIiwiPHNjcmlwdCBsYW5nPVwidHNcIiBzZXR1cD5cclxuaW1wb3J0IHsgTW9kYWwgfSBmcm9tICdib290c3RyYXAnO1xyXG5pbXBvcnQgeyBjb21wdXRlZCwgZ2V0Q3VycmVudEluc3RhbmNlLCBpbmplY3QsIG9uTW91bnRlZCwgb25Vbm1vdW50ZWQsIHByb3ZpZGUsIHJlZiwgdXNlVGVtcGxhdGVSZWYsIHdhdGNoIH0gZnJvbSAndnVlJztcclxuaW1wb3J0IHsgdXNlSHR0cENsaWVudCB9IGZyb20gJy4uLy4uLy4uL2NvbXBvc2FibGUnO1xyXG5pbXBvcnQgeyBmb3JjZUFycmF5IH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZSc7XHJcbmltcG9ydCB7IE1heWJlQXJyYXksIE1vZGFsVHJlZVNvdXJjZSwgU2VhcmNoTWF0Y2hlciwgVGl0bGVHZXR0ZXIsIFRyZWVOb2RlLCBWYWx1ZUdldHRlciB9IGZyb20gJy4uLy4uLy4uL3R5cGVzJztcclxuaW1wb3J0IHsgZmxhdHRlbkNoaWxkcmVuIH0gZnJvbSAnLi4vLi4vLi4vdXRpbGl0aWVzJztcclxuaW1wb3J0IFRyZWVJdGVtIGZyb20gJy4vVHJlZUl0ZW0udnVlJztcclxuXHJcbmNvbnN0IHByb3BzID0gd2l0aERlZmF1bHRzKFxyXG4gIGRlZmluZVByb3BzPHtcclxuICAgIG9wZW4/OiBib29sZWFuO1xyXG4gICAgaWQ/OiBzdHJpbmc7XHJcbiAgICBuYW1lPzogc3RyaW5nO1xyXG4gICAgdHlwZXM/OiBzdHJpbmdbXTtcclxuICAgIHRpdGxlPzogc3RyaW5nO1xyXG4gICAgZGlzYWJsZWQ/OiBib29sZWFuO1xyXG4gICAgcmVhZG9ubHk/OiBib29sZWFuO1xyXG4gICAgdmFsdWU/OiBNYXliZUFycmF5PHN0cmluZyB8IG51bWJlcj47XHJcbiAgICBicmFuY2hTZWxlY3RhYmxlPzogYm9vbGVhbjtcclxuICAgIHNvdXJjZT86IE1vZGFsVHJlZVNvdXJjZTtcclxuICAgIHNlYXJjaFRleHQ/OiBzdHJpbmc7XHJcbiAgfT4oKSxcclxuICB7XHJcbiAgICBicmFuY2hTZWxlY3RhYmxlOiBmYWxzZSxcclxuICB9XHJcbik7XHJcblxyXG5jb25zdCBlbWl0cyA9IGRlZmluZUVtaXRzPHtcclxuICBjaGFuZ2U6IFt2YWx1ZTogYW55XTtcclxuICBpbnB1dDogW3ZhbHVlOiBhbnldO1xyXG4gIHNlbGVjdGVkOiBbaXRlbXM6IGFueVtdXTtcclxuICBoaWRlOiBbXTtcclxufT4oKTtcclxuXHJcbi8vIHByb3ZpZGUoJ3NlbGVjdE5vZGUnLCBzZWxlY3ROb2RlKTtcclxuXHJcbmNvbnN0IHZhbHVlR2V0dGVyID0gaW5qZWN0PFZhbHVlR2V0dGVyPigndmFsdWVHZXR0ZXInKTtcclxuY29uc3QgdGl0bGVHZXR0ZXIgPSBpbmplY3Q8VGl0bGVHZXR0ZXI+KCd0aXRsZUdldHRlcicpO1xyXG5jb25zdCBzZWFyY2hNYXRjaGVyID0gaW5qZWN0PFNlYXJjaE1hdGNoZXI+KCdzZWFyY2hNYXRjaGVyJyk7XHJcblxyXG5jb25zdCBsb2FkaW5nID0gcmVmKGZhbHNlKTtcclxuY29uc3QgbXVsdGlwbGUgPSBpbmplY3Q8Ym9vbGVhbj4oJ211bHRpcGxlJywgZmFsc2UpO1xyXG5jb25zdCBtb2RhbEVsZW1lbnQgPSB1c2VUZW1wbGF0ZVJlZjxIVE1MRGl2RWxlbWVudD4oJ21vZGFsJylcclxuXHJcbmxldCAkbW9kYWw6IE1vZGFsO1xyXG5cclxub25Nb3VudGVkKCgpID0+IHtcclxuICAkbW9kYWwgPSBNb2RhbC5nZXRPckNyZWF0ZUluc3RhbmNlKG1vZGFsRWxlbWVudC52YWx1ZSEpO1xyXG4gIG1vZGFsRWxlbWVudC52YWx1ZSEuYWRkRXZlbnRMaXN0ZW5lcignc2hvdy5icy5tb2RhbCcsIG9uU2hvdyk7XHJcbiAgbW9kYWxFbGVtZW50LnZhbHVlIS5hZGRFdmVudExpc3RlbmVyKCdoaWRlLmJzLm1vZGFsJywgb25IaWRlKTtcclxufSk7XHJcblxyXG5vblVubW91bnRlZCgoKSA9PiB7XHJcbiAgbW9kYWxFbGVtZW50LnZhbHVlIS5yZW1vdmVFdmVudExpc3RlbmVyKCdzaG93LmJzLm1vZGFsJywgb25TaG93KTtcclxuICBtb2RhbEVsZW1lbnQudmFsdWUhLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2hpZGUuYnMubW9kYWwnLCBvbkhpZGUpO1xyXG59KTtcclxuXHJcbi8vIEl0ZW1zXHJcbmNvbnN0IG5vZGVzID0gcmVmPFRyZWVOb2RlW10+KFtdKTtcclxuY29uc3Qgc2VsZWN0ZWROb2RlcyA9IHJlZjxUcmVlTm9kZVtdPihbXSk7XHJcblxyXG5jb25zdCBkaXNwbGF5Tm9kZXMgPSBjb21wdXRlZCgoKSA9PiB7XHJcbiAgaWYgKHNlYXJjaEVuYWJsZWQudmFsdWUpIHtcclxuICAgIHJldHVybiBzZWFyY2hlZEl0ZW1zLnZhbHVlO1xyXG4gIH1cclxuICByZXR1cm4gbm9kZXMudmFsdWU7XHJcbn0pO1xyXG5cclxuY29uc3QgZmxhdE5vZGVzID0gY29tcHV0ZWQoKCkgPT4gZmxhdHRlbkNoaWxkcmVuKG5vZGVzLnZhbHVlKSk7XHJcblxyXG5jb25zdCBzZWxlY3RlZFZhbHVlcyA9IGNvbXB1dGVkKCgpID0+IHtcclxuICByZXR1cm4gZmxhdE5vZGVzLnZhbHVlLmZpbHRlcigobm9kZSkgPT4gbm9kZS5zZWxlY3RlZCkubWFwKChub2RlKSA9PiB2YWx1ZUdldHRlcihub2RlLnZhbHVlKSk7XHJcbn0pO1xyXG5cclxucHJvdmlkZSgnc2VsZWN0ZWRWYWx1ZXMnLCBzZWxlY3RlZFZhbHVlcyk7XHJcblxyXG53YXRjaCgoKSA9PiBzZWxlY3RlZFZhbHVlcywgKCkgPT4ge1xyXG4gIGVtaXRzKCdjaGFuZ2UnLCBzZWxlY3RlZFZhbHVlcy52YWx1ZSk7XHJcbiAgZW1pdHMoJ2lucHV0Jywgc2VsZWN0ZWRWYWx1ZXMudmFsdWUpO1xyXG4gIGVtaXRzKCdzZWxlY3RlZCcsIHNlbGVjdGVkTm9kZXMudmFsdWUpO1xyXG59KTtcclxuXHJcbi8vIGZ1bmN0aW9uIHNlbGVjdE5vZGUobm9kZTogVHJlZU5vZGUsIHNlbGVjdDogYm9vbGVhbikge1xyXG4vLyAgIG5vZGUuc2VsZWN0ZWQgPSBzZWxlY3Q7XHJcbi8vXHJcbi8vICAgLy8gaWYgKHNlbGVjdCkge1xyXG4vLyAgIC8vICAgaWYgKCFtdWx0aXBsZSkge1xyXG4vLyAgIC8vICAgICBzZWxlY3RlZE5vZGVzLnZhbHVlID0gW107XHJcbi8vICAgLy8gICB9XHJcbi8vICAgLy8gICBpZiAoIXNlbGVjdGVkVmFsdWVzLnZhbHVlLmluY2x1ZGVzKHZhbHVlR2V0dGVyKG5vZGUudmFsdWUpKSkge1xyXG4vLyAgIC8vICAgICBzZWxlY3RlZE5vZGVzLnZhbHVlLnB1c2gobm9kZSk7XHJcbi8vICAgLy8gICB9XHJcbi8vICAgLy8gfSBlbHNlIHtcclxuLy8gICAvLyAgIHNlbGVjdGVkTm9kZXMudmFsdWUgPSBzZWxlY3RlZE5vZGVzLnZhbHVlLmZpbHRlcihcclxuLy8gICAvLyAgICAgKHNlbGVjdGVkTm9kZTogVHJlZU5vZGUpID0+IHZhbHVlR2V0dGVyKHNlbGVjdGVkTm9kZS52YWx1ZSkgIT09IHZhbHVlR2V0dGVyKG5vZGUudmFsdWUpXHJcbi8vICAgLy8gICApO1xyXG4vLyAgIC8vIH1cclxuLy8gICBlbWl0cygnY2hhbmdlJywgc2VsZWN0ZWRWYWx1ZXMudmFsdWUpO1xyXG4vLyAgIGVtaXRzKCdpbnB1dCcsIHNlbGVjdGVkVmFsdWVzLnZhbHVlKTtcclxuLy8gICBlbWl0cygnc2VsZWN0ZWQnLCBzZWxlY3RlZE5vZGVzLnZhbHVlKTtcclxuLy8gfVxyXG5cclxuY29uc3QgY2FuTW9kaWZ5ID0gY29tcHV0ZWQoKCkgPT4ge1xyXG4gIHJldHVybiAhcHJvcHMucmVhZG9ubHkgJiYgIXByb3BzLmRpc2FibGVkO1xyXG59KTtcclxuXHJcbi8vIFNlYXJjaFxyXG5jb25zdCBxID0gcmVmKCcnKTtcclxuY29uc3Qgc2VhcmNoRW5hYmxlZCA9IGNvbXB1dGVkKCgpID0+IHEudmFsdWUgIT09ICcnKTtcclxuXHJcbmNvbnN0IHNlYXJjaGVkSXRlbXMgPSBjb21wdXRlZCgoKSA9PiB7XHJcbiAgaWYgKHEudmFsdWUgPT09ICcnKSB7XHJcbiAgICByZXR1cm4gW107XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZmxhdE5vZGVzLnZhbHVlLmZpbHRlcigoaXRlbTogVHJlZU5vZGUpID0+IHtcclxuICAgIHJldHVybiBzZWFyY2hNYXRjaGVyKGl0ZW0udmFsdWUsIHEudmFsdWUpO1xyXG4gIH0pO1xyXG59KTtcclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGxvYWRJdGVtcygpIHtcclxuICBsb2FkaW5nLnZhbHVlID0gdHJ1ZTtcclxuICBjb25zdCBodHRwID0gYXdhaXQgdXNlSHR0cENsaWVudCgpO1xyXG4gIHRyeSB7XHJcbiAgICBsZXQgc3JjID0gcHJvcHMuc291cmNlO1xyXG5cclxuICAgIGlmICh0eXBlb2Ygc3JjID09PSAnc3RyaW5nJykge1xyXG4gICAgICBjb25zdCByZXMgPSBhd2FpdCBodHRwLmdldChzcmMpO1xyXG4gICAgICBub2Rlcy52YWx1ZSA9IHJlcy5kYXRhLmRhdGE7XHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBzcmMgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgbm9kZXMudmFsdWUgPSBhd2FpdCBzcmMoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShzcmMpKSB7XHJcbiAgICAgICAgc3JjID0gc3JjLmNoaWxkcmVuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBub2Rlcy52YWx1ZSA9IHNyYztcclxuICAgIH1cclxuICB9IGZpbmFsbHkge1xyXG4gICAgbG9hZGluZy52YWx1ZSA9IGZhbHNlO1xyXG4gIH1cclxufVxyXG5cclxuLy8gTW9kYWwgQ29udHJvbFxyXG53YXRjaCgoKSA9PiBwcm9wcy5vcGVuLCAodikgPT4ge1xyXG4gIGlmICh2KSB7XHJcbiAgICAkbW9kYWwuc2hvdygpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICAkbW9kYWwuaGlkZSgpO1xyXG4gIH1cclxufSk7XHJcblxyXG5hc3luYyBmdW5jdGlvbiBvblNob3coKSB7XHJcbiAgYXdhaXQgbG9hZEl0ZW1zKCk7XHJcbiAgdXBkYXRlU2VsZWN0ZWRJdGVtc0J5VmFsdWUoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gb25IaWRlKCkge1xyXG4gIG5vZGVzLnZhbHVlID0gW107XHJcbiAgcS52YWx1ZSA9ICcnO1xyXG4gIGVtaXRzKCdoaWRlJyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZVNlbGVjdGVkSXRlbXNCeVZhbHVlKCkge1xyXG4gIGNvbnN0IHZhbHVlcyA9IGZvcmNlQXJyYXkocHJvcHMudmFsdWUpO1xyXG5cclxuICBzZWxlY3RlZE5vZGVzLnZhbHVlID0gZmxhdE5vZGVzLnZhbHVlXHJcbiAgICAuZmlsdGVyKChpdGVtOiBUcmVlTm9kZSkgPT4ge1xyXG4gICAgICByZXR1cm4gdmFsdWVzLmluY2x1ZGVzKHZhbHVlR2V0dGVyKGl0ZW0udmFsdWUpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG53YXRjaChcclxuICAoKSA9PiBwcm9wcy52YWx1ZSxcclxuICAoKSA9PiB1cGRhdGVTZWxlY3RlZEl0ZW1zQnlWYWx1ZSgpLFxyXG4gIHsgaW1tZWRpYXRlOiB0cnVlLCBkZWVwOiB0cnVlIH1cclxuKTtcclxuXHJcbjwvc2NyaXB0PlxyXG5cclxuPHRlbXBsYXRlPlxyXG4gIDxkaXYgcmVmPVwibW9kYWxcIiBjbGFzcz1cIm1vZGFsIGZhZGVcIiA6aWQ9XCJgJHtpZH1fX21vZGFsYFwiIHRhYmluZGV4PVwiLTFcIiByb2xlPVwiZGlhbG9nXCIgYXJpYS1sYWJlbGxlZGJ5PVwiLW1vZGFsLWxhYmVsXCJcclxuICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxyXG4gICAgPGRpdiBjbGFzcz1cIm1vZGFsLWRpYWxvZ1wiIHJvbGU9XCJkb2N1bWVudFwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1oZWFkZXJcIj5cclxuICAgICAgICAgIDxoNCBjbGFzcz1cIm1vZGFsLXRpdGxlXCIgOmlkPVwiYCR7aWR9X19tb2RhbC1sYWJlbGBcIj5cclxuICAgICAgICAgICAge3sgdGl0bGUgfX1cclxuICAgICAgICAgIDwvaDQ+XHJcbiAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNsb3NlIGJ0bi1jbG9zZVwiIGRhdGEtYnMtZGlzbWlzcz1cIm1vZGFsXCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj5cclxuICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCIgY2xhc3M9XCJ2aXN1YWxseS1oaWRkZW5cIj4mdGltZXM7PC9zcGFuPlxyXG4gICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5IHAtMFwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cInN0ZC1mb3JtIGJveC1saXN0IG0tM1wiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwic2VhcmNoXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiA6cGxhY2Vob2xkZXI9XCJzZWFyY2hUZXh0XCJcclxuICAgICAgICAgICAgICAgIHYtbW9kZWw9XCJxXCIgLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICA8ZGl2IHYtaWY9XCIhbG9hZGluZ1wiIGNsYXNzPVwiYm94LWxpc3RfX2l0ZW1zXCI+XHJcbiAgICAgICAgICAgIDxUcmVlSXRlbSB2LWZvcj1cIm5vZGUgb2YgZGlzcGxheU5vZGVzXCJcclxuICAgICAgICAgICAgICA6bm9kZVxyXG4gICAgICAgICAgICAgIDprZXk9XCJ2YWx1ZUdldHRlcihub2RlLnZhbHVlKVwiXHJcbiAgICAgICAgICAgICAgOmxldmVsPVwiMVwiXHJcbiAgICAgICAgICAgICAgOmJyYW5jaFNlbGVjdGFibGVcclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiB2LWVsc2U+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkLWZsZXgganVzdGlmeS1jb250ZW50LWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzcGlubmVyLWJvcmRlciBzcGlubmVyLWJvcmRlci1zbSBteS0zXCI+PC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcbjwvdGVtcGxhdGU+XHJcblxyXG48c3R5bGUgc2NvcGVkPlxyXG5cclxuPC9zdHlsZT5cclxuIiwiPHNjcmlwdCBsYW5nPVwidHNcIiBzZXR1cD5cclxuaW1wb3J0IHsgTW9kYWwgfSBmcm9tICdib290c3RyYXAnO1xyXG5pbXBvcnQgeyBjb21wdXRlZCwgZ2V0Q3VycmVudEluc3RhbmNlLCBpbmplY3QsIG9uTW91bnRlZCwgb25Vbm1vdW50ZWQsIHByb3ZpZGUsIHJlZiwgdXNlVGVtcGxhdGVSZWYsIHdhdGNoIH0gZnJvbSAndnVlJztcclxuaW1wb3J0IHsgdXNlSHR0cENsaWVudCB9IGZyb20gJy4uLy4uLy4uL2NvbXBvc2FibGUnO1xyXG5pbXBvcnQgeyBmb3JjZUFycmF5IH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZSc7XHJcbmltcG9ydCB7IE1heWJlQXJyYXksIE1vZGFsVHJlZVNvdXJjZSwgU2VhcmNoTWF0Y2hlciwgVGl0bGVHZXR0ZXIsIFRyZWVOb2RlLCBWYWx1ZUdldHRlciB9IGZyb20gJy4uLy4uLy4uL3R5cGVzJztcclxuaW1wb3J0IHsgZmxhdHRlbkNoaWxkcmVuIH0gZnJvbSAnLi4vLi4vLi4vdXRpbGl0aWVzJztcclxuaW1wb3J0IFRyZWVJdGVtIGZyb20gJy4vVHJlZUl0ZW0udnVlJztcclxuXHJcbmNvbnN0IHByb3BzID0gd2l0aERlZmF1bHRzKFxyXG4gIGRlZmluZVByb3BzPHtcclxuICAgIG9wZW4/OiBib29sZWFuO1xyXG4gICAgaWQ/OiBzdHJpbmc7XHJcbiAgICBuYW1lPzogc3RyaW5nO1xyXG4gICAgdHlwZXM/OiBzdHJpbmdbXTtcclxuICAgIHRpdGxlPzogc3RyaW5nO1xyXG4gICAgZGlzYWJsZWQ/OiBib29sZWFuO1xyXG4gICAgcmVhZG9ubHk/OiBib29sZWFuO1xyXG4gICAgdmFsdWU/OiBNYXliZUFycmF5PHN0cmluZyB8IG51bWJlcj47XHJcbiAgICBicmFuY2hTZWxlY3RhYmxlPzogYm9vbGVhbjtcclxuICAgIHNvdXJjZT86IE1vZGFsVHJlZVNvdXJjZTtcclxuICAgIHNlYXJjaFRleHQ/OiBzdHJpbmc7XHJcbiAgfT4oKSxcclxuICB7XHJcbiAgICBicmFuY2hTZWxlY3RhYmxlOiBmYWxzZSxcclxuICB9XHJcbik7XHJcblxyXG5jb25zdCBlbWl0cyA9IGRlZmluZUVtaXRzPHtcclxuICBjaGFuZ2U6IFt2YWx1ZTogYW55XTtcclxuICBpbnB1dDogW3ZhbHVlOiBhbnldO1xyXG4gIHNlbGVjdGVkOiBbaXRlbXM6IGFueVtdXTtcclxuICBoaWRlOiBbXTtcclxufT4oKTtcclxuXHJcbi8vIHByb3ZpZGUoJ3NlbGVjdE5vZGUnLCBzZWxlY3ROb2RlKTtcclxuXHJcbmNvbnN0IHZhbHVlR2V0dGVyID0gaW5qZWN0PFZhbHVlR2V0dGVyPigndmFsdWVHZXR0ZXInKTtcclxuY29uc3QgdGl0bGVHZXR0ZXIgPSBpbmplY3Q8VGl0bGVHZXR0ZXI+KCd0aXRsZUdldHRlcicpO1xyXG5jb25zdCBzZWFyY2hNYXRjaGVyID0gaW5qZWN0PFNlYXJjaE1hdGNoZXI+KCdzZWFyY2hNYXRjaGVyJyk7XHJcblxyXG5jb25zdCBsb2FkaW5nID0gcmVmKGZhbHNlKTtcclxuY29uc3QgbXVsdGlwbGUgPSBpbmplY3Q8Ym9vbGVhbj4oJ211bHRpcGxlJywgZmFsc2UpO1xyXG5jb25zdCBtb2RhbEVsZW1lbnQgPSB1c2VUZW1wbGF0ZVJlZjxIVE1MRGl2RWxlbWVudD4oJ21vZGFsJylcclxuXHJcbmxldCAkbW9kYWw6IE1vZGFsO1xyXG5cclxub25Nb3VudGVkKCgpID0+IHtcclxuICAkbW9kYWwgPSBNb2RhbC5nZXRPckNyZWF0ZUluc3RhbmNlKG1vZGFsRWxlbWVudC52YWx1ZSEpO1xyXG4gIG1vZGFsRWxlbWVudC52YWx1ZSEuYWRkRXZlbnRMaXN0ZW5lcignc2hvdy5icy5tb2RhbCcsIG9uU2hvdyk7XHJcbiAgbW9kYWxFbGVtZW50LnZhbHVlIS5hZGRFdmVudExpc3RlbmVyKCdoaWRlLmJzLm1vZGFsJywgb25IaWRlKTtcclxufSk7XHJcblxyXG5vblVubW91bnRlZCgoKSA9PiB7XHJcbiAgbW9kYWxFbGVtZW50LnZhbHVlIS5yZW1vdmVFdmVudExpc3RlbmVyKCdzaG93LmJzLm1vZGFsJywgb25TaG93KTtcclxuICBtb2RhbEVsZW1lbnQudmFsdWUhLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2hpZGUuYnMubW9kYWwnLCBvbkhpZGUpO1xyXG59KTtcclxuXHJcbi8vIEl0ZW1zXHJcbmNvbnN0IG5vZGVzID0gcmVmPFRyZWVOb2RlW10+KFtdKTtcclxuY29uc3Qgc2VsZWN0ZWROb2RlcyA9IHJlZjxUcmVlTm9kZVtdPihbXSk7XHJcblxyXG5jb25zdCBkaXNwbGF5Tm9kZXMgPSBjb21wdXRlZCgoKSA9PiB7XHJcbiAgaWYgKHNlYXJjaEVuYWJsZWQudmFsdWUpIHtcclxuICAgIHJldHVybiBzZWFyY2hlZEl0ZW1zLnZhbHVlO1xyXG4gIH1cclxuICByZXR1cm4gbm9kZXMudmFsdWU7XHJcbn0pO1xyXG5cclxuY29uc3QgZmxhdE5vZGVzID0gY29tcHV0ZWQoKCkgPT4gZmxhdHRlbkNoaWxkcmVuKG5vZGVzLnZhbHVlKSk7XHJcblxyXG5jb25zdCBzZWxlY3RlZFZhbHVlcyA9IGNvbXB1dGVkKCgpID0+IHtcclxuICByZXR1cm4gZmxhdE5vZGVzLnZhbHVlLmZpbHRlcigobm9kZSkgPT4gbm9kZS5zZWxlY3RlZCkubWFwKChub2RlKSA9PiB2YWx1ZUdldHRlcihub2RlLnZhbHVlKSk7XHJcbn0pO1xyXG5cclxucHJvdmlkZSgnc2VsZWN0ZWRWYWx1ZXMnLCBzZWxlY3RlZFZhbHVlcyk7XHJcblxyXG53YXRjaCgoKSA9PiBzZWxlY3RlZFZhbHVlcywgKCkgPT4ge1xyXG4gIGVtaXRzKCdjaGFuZ2UnLCBzZWxlY3RlZFZhbHVlcy52YWx1ZSk7XHJcbiAgZW1pdHMoJ2lucHV0Jywgc2VsZWN0ZWRWYWx1ZXMudmFsdWUpO1xyXG4gIGVtaXRzKCdzZWxlY3RlZCcsIHNlbGVjdGVkTm9kZXMudmFsdWUpO1xyXG59KTtcclxuXHJcbi8vIGZ1bmN0aW9uIHNlbGVjdE5vZGUobm9kZTogVHJlZU5vZGUsIHNlbGVjdDogYm9vbGVhbikge1xyXG4vLyAgIG5vZGUuc2VsZWN0ZWQgPSBzZWxlY3Q7XHJcbi8vXHJcbi8vICAgLy8gaWYgKHNlbGVjdCkge1xyXG4vLyAgIC8vICAgaWYgKCFtdWx0aXBsZSkge1xyXG4vLyAgIC8vICAgICBzZWxlY3RlZE5vZGVzLnZhbHVlID0gW107XHJcbi8vICAgLy8gICB9XHJcbi8vICAgLy8gICBpZiAoIXNlbGVjdGVkVmFsdWVzLnZhbHVlLmluY2x1ZGVzKHZhbHVlR2V0dGVyKG5vZGUudmFsdWUpKSkge1xyXG4vLyAgIC8vICAgICBzZWxlY3RlZE5vZGVzLnZhbHVlLnB1c2gobm9kZSk7XHJcbi8vICAgLy8gICB9XHJcbi8vICAgLy8gfSBlbHNlIHtcclxuLy8gICAvLyAgIHNlbGVjdGVkTm9kZXMudmFsdWUgPSBzZWxlY3RlZE5vZGVzLnZhbHVlLmZpbHRlcihcclxuLy8gICAvLyAgICAgKHNlbGVjdGVkTm9kZTogVHJlZU5vZGUpID0+IHZhbHVlR2V0dGVyKHNlbGVjdGVkTm9kZS52YWx1ZSkgIT09IHZhbHVlR2V0dGVyKG5vZGUudmFsdWUpXHJcbi8vICAgLy8gICApO1xyXG4vLyAgIC8vIH1cclxuLy8gICBlbWl0cygnY2hhbmdlJywgc2VsZWN0ZWRWYWx1ZXMudmFsdWUpO1xyXG4vLyAgIGVtaXRzKCdpbnB1dCcsIHNlbGVjdGVkVmFsdWVzLnZhbHVlKTtcclxuLy8gICBlbWl0cygnc2VsZWN0ZWQnLCBzZWxlY3RlZE5vZGVzLnZhbHVlKTtcclxuLy8gfVxyXG5cclxuY29uc3QgY2FuTW9kaWZ5ID0gY29tcHV0ZWQoKCkgPT4ge1xyXG4gIHJldHVybiAhcHJvcHMucmVhZG9ubHkgJiYgIXByb3BzLmRpc2FibGVkO1xyXG59KTtcclxuXHJcbi8vIFNlYXJjaFxyXG5jb25zdCBxID0gcmVmKCcnKTtcclxuY29uc3Qgc2VhcmNoRW5hYmxlZCA9IGNvbXB1dGVkKCgpID0+IHEudmFsdWUgIT09ICcnKTtcclxuXHJcbmNvbnN0IHNlYXJjaGVkSXRlbXMgPSBjb21wdXRlZCgoKSA9PiB7XHJcbiAgaWYgKHEudmFsdWUgPT09ICcnKSB7XHJcbiAgICByZXR1cm4gW107XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZmxhdE5vZGVzLnZhbHVlLmZpbHRlcigoaXRlbTogVHJlZU5vZGUpID0+IHtcclxuICAgIHJldHVybiBzZWFyY2hNYXRjaGVyKGl0ZW0udmFsdWUsIHEudmFsdWUpO1xyXG4gIH0pO1xyXG59KTtcclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGxvYWRJdGVtcygpIHtcclxuICBsb2FkaW5nLnZhbHVlID0gdHJ1ZTtcclxuICBjb25zdCBodHRwID0gYXdhaXQgdXNlSHR0cENsaWVudCgpO1xyXG4gIHRyeSB7XHJcbiAgICBsZXQgc3JjID0gcHJvcHMuc291cmNlO1xyXG5cclxuICAgIGlmICh0eXBlb2Ygc3JjID09PSAnc3RyaW5nJykge1xyXG4gICAgICBjb25zdCByZXMgPSBhd2FpdCBodHRwLmdldChzcmMpO1xyXG4gICAgICBub2Rlcy52YWx1ZSA9IHJlcy5kYXRhLmRhdGE7XHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBzcmMgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgbm9kZXMudmFsdWUgPSBhd2FpdCBzcmMoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShzcmMpKSB7XHJcbiAgICAgICAgc3JjID0gc3JjLmNoaWxkcmVuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBub2Rlcy52YWx1ZSA9IHNyYztcclxuICAgIH1cclxuICB9IGZpbmFsbHkge1xyXG4gICAgbG9hZGluZy52YWx1ZSA9IGZhbHNlO1xyXG4gIH1cclxufVxyXG5cclxuLy8gTW9kYWwgQ29udHJvbFxyXG53YXRjaCgoKSA9PiBwcm9wcy5vcGVuLCAodikgPT4ge1xyXG4gIGlmICh2KSB7XHJcbiAgICAkbW9kYWwuc2hvdygpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICAkbW9kYWwuaGlkZSgpO1xyXG4gIH1cclxufSk7XHJcblxyXG5hc3luYyBmdW5jdGlvbiBvblNob3coKSB7XHJcbiAgYXdhaXQgbG9hZEl0ZW1zKCk7XHJcbiAgdXBkYXRlU2VsZWN0ZWRJdGVtc0J5VmFsdWUoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gb25IaWRlKCkge1xyXG4gIG5vZGVzLnZhbHVlID0gW107XHJcbiAgcS52YWx1ZSA9ICcnO1xyXG4gIGVtaXRzKCdoaWRlJyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZVNlbGVjdGVkSXRlbXNCeVZhbHVlKCkge1xyXG4gIGNvbnN0IHZhbHVlcyA9IGZvcmNlQXJyYXkocHJvcHMudmFsdWUpO1xyXG5cclxuICBzZWxlY3RlZE5vZGVzLnZhbHVlID0gZmxhdE5vZGVzLnZhbHVlXHJcbiAgICAuZmlsdGVyKChpdGVtOiBUcmVlTm9kZSkgPT4ge1xyXG4gICAgICByZXR1cm4gdmFsdWVzLmluY2x1ZGVzKHZhbHVlR2V0dGVyKGl0ZW0udmFsdWUpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG53YXRjaChcclxuICAoKSA9PiBwcm9wcy52YWx1ZSxcclxuICAoKSA9PiB1cGRhdGVTZWxlY3RlZEl0ZW1zQnlWYWx1ZSgpLFxyXG4gIHsgaW1tZWRpYXRlOiB0cnVlLCBkZWVwOiB0cnVlIH1cclxuKTtcclxuXHJcbjwvc2NyaXB0PlxyXG5cclxuPHRlbXBsYXRlPlxyXG4gIDxkaXYgcmVmPVwibW9kYWxcIiBjbGFzcz1cIm1vZGFsIGZhZGVcIiA6aWQ9XCJgJHtpZH1fX21vZGFsYFwiIHRhYmluZGV4PVwiLTFcIiByb2xlPVwiZGlhbG9nXCIgYXJpYS1sYWJlbGxlZGJ5PVwiLW1vZGFsLWxhYmVsXCJcclxuICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxyXG4gICAgPGRpdiBjbGFzcz1cIm1vZGFsLWRpYWxvZ1wiIHJvbGU9XCJkb2N1bWVudFwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1oZWFkZXJcIj5cclxuICAgICAgICAgIDxoNCBjbGFzcz1cIm1vZGFsLXRpdGxlXCIgOmlkPVwiYCR7aWR9X19tb2RhbC1sYWJlbGBcIj5cclxuICAgICAgICAgICAge3sgdGl0bGUgfX1cclxuICAgICAgICAgIDwvaDQ+XHJcbiAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNsb3NlIGJ0bi1jbG9zZVwiIGRhdGEtYnMtZGlzbWlzcz1cIm1vZGFsXCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj5cclxuICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCIgY2xhc3M9XCJ2aXN1YWxseS1oaWRkZW5cIj4mdGltZXM7PC9zcGFuPlxyXG4gICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5IHAtMFwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cInN0ZC1mb3JtIGJveC1saXN0IG0tM1wiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwic2VhcmNoXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiA6cGxhY2Vob2xkZXI9XCJzZWFyY2hUZXh0XCJcclxuICAgICAgICAgICAgICAgIHYtbW9kZWw9XCJxXCIgLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICA8ZGl2IHYtaWY9XCIhbG9hZGluZ1wiIGNsYXNzPVwiYm94LWxpc3RfX2l0ZW1zXCI+XHJcbiAgICAgICAgICAgIDxUcmVlSXRlbSB2LWZvcj1cIm5vZGUgb2YgZGlzcGxheU5vZGVzXCJcclxuICAgICAgICAgICAgICA6bm9kZVxyXG4gICAgICAgICAgICAgIDprZXk9XCJ2YWx1ZUdldHRlcihub2RlLnZhbHVlKVwiXHJcbiAgICAgICAgICAgICAgOmxldmVsPVwiMVwiXHJcbiAgICAgICAgICAgICAgOmJyYW5jaFNlbGVjdGFibGVcclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiB2LWVsc2U+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkLWZsZXgganVzdGlmeS1jb250ZW50LWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzcGlubmVyLWJvcmRlciBzcGlubmVyLWJvcmRlci1zbSBteS0zXCI+PC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcbjwvdGVtcGxhdGU+XHJcblxyXG48c3R5bGUgc2NvcGVkPlxyXG5cclxuPC9zdHlsZT5cclxuIiwiPHNjcmlwdCBsYW5nPVwidHNcIiBzZXR1cD5cclxuaW1wb3J0IHsgY2xvbmVEZWVwIH0gZnJvbSAnbG9kYXNoLWVzJztcclxuaW1wb3J0IHsgY29tcHV0ZWQsIHByb3ZpZGUsIHJlZiwgd2F0Y2ggfSBmcm9tICd2dWUnO1xyXG5pbXBvcnQgeyBmb3JjZUFycmF5IH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZSc7XHJcbmltcG9ydCB7XHJcbiAgVmFsdWVHZXR0ZXIsXHJcbiAgTW9kYWxUcmVlU291cmNlLFxyXG4gIFRpdGxlR2V0dGVyLFxyXG4gIFRyZWVOb2RlLFxyXG4gIFNlYXJjaE1hdGNoZXIsXHJcbiAgTWF5YmVBcnJheSxcclxuICBNYXliZVByb21pc2VcclxufSBmcm9tICcuLi8uLi8uLi90eXBlcyc7XHJcbmltcG9ydCBUcmVlTW9kYWwgZnJvbSAnLi9UcmVlTW9kYWwudnVlJztcclxuXHJcbmNvbnN0IHByb3BzID0gd2l0aERlZmF1bHRzKFxyXG4gIGRlZmluZVByb3BzPHtcclxuICAgIGlkPzogc3RyaW5nO1xyXG4gICAgbmFtZT86IHN0cmluZztcclxuICAgIHRpdGxlPzogc3RyaW5nO1xyXG4gICAgZGlzYWJsZWQ/OiBib29sZWFuO1xyXG4gICAgcmVhZG9ubHk/OiBib29sZWFuO1xyXG4gICAgdmFsdWU/OiBNYXliZUFycmF5PHN0cmluZyB8IG51bWJlcj47XHJcbiAgICBzb3VyY2U/OiBNb2RhbFRyZWVTb3VyY2U7XHJcbiAgICBpdGVtcz86IE1heWJlQXJyYXk8VHJlZU5vZGU+IHwgKCgpID0+IE1heWJlUHJvbWlzZTxNYXliZUFycmF5PFRyZWVOb2RlPj4pO1xyXG4gICAgdmFsdWVHZXR0ZXI/OiBWYWx1ZUdldHRlcjtcclxuICAgIHRpdGxlR2V0dGVyPzogVGl0bGVHZXR0ZXI7XHJcbiAgICBzZWFyY2hNYXRjaGVyPzogU2VhcmNoTWF0Y2hlcjtcclxuICAgIG1vZGFsVGl0bGU/OiBzdHJpbmc7XHJcbiAgICB2ZXJ0aWNhbD86IGJvb2xlYW47XHJcbiAgICBicmFuY2hTZWxlY3RhYmxlPzogYm9vbGVhbjtcclxuICAgIHNlbGVjdEFsbENoaWxkcmVuPzogYm9vbGVhbjtcclxuICAgIHBsYWNlaG9sZGVyPzogc3RyaW5nO1xyXG4gICAgbXVsdGlwbGU/OiBib29sZWFuO1xyXG4gICAgYnV0dG9uVGV4dD86IHN0cmluZztcclxuICAgIGl0ZW1DbGFzcz86IHN0cmluZztcclxuICAgIHNlYXJjaFRleHQ/OiBzdHJpbmc7XHJcbiAgfT4oKSxcclxuICB7XHJcbiAgICBicmFuY2hTZWxlY3RhYmxlOiBmYWxzZSxcclxuICAgIHNlbGVjdEFsbENoaWxkcmVuOiBmYWxzZSxcclxuICAgIHBsYWNlaG9sZGVyOiAnLSBObyBzZWxlY3RlZCAtJyxcclxuICAgIG11bHRpcGxlOiBmYWxzZSxcclxuICAgIGJ1dHRvblRleHQ6ICdTZWxlY3QnLFxyXG4gICAgaXRlbUNsYXNzOiAnYmFkZ2UgYmctcHJpbWFyeSBiYWRnZS1waWxsJyxcclxuICAgIHNlYXJjaFRleHQ6ICdTZWFyY2gnLFxyXG4gICAgdmFsdWVHZXR0ZXI6IChpdGVtOiBhbnkpID0+IGl0ZW0uaWQsXHJcbiAgICB0aXRsZUdldHRlcjogKGl0ZW06IGFueSkgPT4gaXRlbS50aXRsZSxcclxuICB9XHJcbik7XHJcblxyXG5wcm92aWRlKCdpZCcsIHByb3BzLmlkKTtcclxucHJvdmlkZSgnbmFtZScsIHByb3BzLm5hbWUpO1xyXG5wcm92aWRlKCdtdWx0aXBsZScsIHByb3BzLm11bHRpcGxlKTtcclxucHJvdmlkZSgndmFsdWVHZXR0ZXInLCBwcm9wcy52YWx1ZUdldHRlcik7XHJcbnByb3ZpZGUoJ3RpdGxlR2V0dGVyJywgcHJvcHMudGl0bGVHZXR0ZXIpO1xyXG5wcm92aWRlKCdzZWFyY2hNYXRjaGVyJywgcHJvcHMuc2VhcmNoTWF0Y2hlciA/PyBkZWZhdWx0U2VhcmNoTWF0Y2hlcik7XHJcblxyXG5mdW5jdGlvbiBkZWZhdWx0U2VhcmNoTWF0Y2hlcihpdGVtOiBhbnksIHE6IHN0cmluZykge1xyXG4gIHJldHVybiBwcm9wcy50aXRsZUdldHRlcihpdGVtKS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHEudG9Mb3dlckNhc2UoKSk7XHJcbn1cclxuXHJcbmNvbnN0IHNlbGVjdGVkID0gcmVmPFRyZWVOb2RlW10+KFtdKTtcclxuY29uc3QgdmFsdWUgPSByZWY8KHN0cmluZ3xudW1iZXIpW10+KGZvcmNlQXJyYXkocHJvcHMudmFsdWUpKTtcclxuXHJcbi8vIE1vZGFsXHJcbmNvbnN0IHRyZWVNb2RhbE9wZW4gPSByZWYoZmFsc2UpO1xyXG5cclxuZnVuY3Rpb24gb3BlblNlbGVjdG9yKCkge1xyXG4gIHRyZWVNb2RhbE9wZW4udmFsdWUgPSB0cnVlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkZWxldGVJdGVtKGk6IG51bWJlciwgbm9kZTogVHJlZU5vZGUpIHtcclxuICBzZWxlY3RlZC52YWx1ZSA9IHNlbGVjdGVkLnZhbHVlLmZpbHRlcigoaXQ6IFRyZWVOb2RlKSA9PiBwcm9wcy52YWx1ZUdldHRlcihpdC52YWx1ZSkgIT09IHByb3BzLnZhbHVlR2V0dGVyKG5vZGUudmFsdWUpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlU2VsZWN0ZWQoaXRlbXM6IGFueVtdKSB7XHJcbiAgc2VsZWN0ZWQudmFsdWUgPSBjbG9uZURlZXAoaXRlbXMpO1xyXG59XHJcblxyXG53YXRjaCgoKSA9PiBwcm9wcy5pdGVtcywgYXN5bmMgKHYpID0+IHtcclxuICBpZiAodHlwZW9mIHYgPT09ICdmdW5jdGlvbicpIHtcclxuICAgIHYgPSBhd2FpdCB2KCk7XHJcbiAgfVxyXG5cclxuICBzZWxlY3RlZC52YWx1ZSA9IGZvcmNlQXJyYXkodikuZmlsdGVyKChub2RlOiBUcmVlTm9kZSkgPT4ge1xyXG4gICAgcmV0dXJuIHZhbHVlLnZhbHVlLmluY2x1ZGVzKHByb3BzLnZhbHVlR2V0dGVyKG5vZGUudmFsdWUpKTtcclxuICB9KTtcclxufSwgeyBpbW1lZGlhdGU6IHRydWUgfSk7XHJcblxyXG5jb25zdCBzZWxlY3RlZFZhbHVlcyA9IGNvbXB1dGVkKCgpID0+IHtcclxuICByZXR1cm4gc2VsZWN0ZWQudmFsdWUubWFwKG5vZGUgPT4gcHJvcHMudmFsdWVHZXR0ZXIobm9kZS52YWx1ZSkpO1xyXG59KTtcclxuXHJcbmNvbnN0IGNhbk1vZGlmeSA9IGNvbXB1dGVkKCgpID0+IHtcclxuICByZXR1cm4gIXByb3BzLnJlYWRvbmx5ICYmICFwcm9wcy5kaXNhYmxlZDtcclxufSk7XHJcblxyXG48L3NjcmlwdD5cclxuXHJcbjx0ZW1wbGF0ZT5cclxuICA8ZGl2IGNsYXNzPVwiYy1tb2RhbC10cmVlXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwiYy1tb2RhbC10cmVlX19jb250YWluZXIgcC0yIGQtZmxleCBmbGV4LWNvbHVtblwiXHJcbiAgICAgIDpjbGFzcz1cIlsgdmVydGljYWwgPyAnJyA6ICdmbGV4LW1kLXJvdycgXVwiPlxyXG4gICAgICA8ZGl2IHYtaWY9XCJjYW5Nb2RpZnlcIiBjbGFzcz1cIm1lLTIgbWItMlwiXHJcbiAgICAgICAgOmNsYXNzPVwieyAnbWItbWQtMCc6ICF2ZXJ0aWNhbCB9XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiPlxyXG4gICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tc2Vjb25kYXJ5IGJ0bi1zbSBidG4tcm91bmRlZCB0ZXh0LW5vd3JhcFwiIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICBAY2xpY2s9XCJvcGVuU2VsZWN0b3JcIj5cclxuICAgICAgICAgICAge3sgYnV0dG9uVGV4dCB9fVxyXG4gICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1zZWNvbmRhcnkgYnRuLXNtIGJ0bi1yb3VuZGVkXCIgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgIEBjbGljaz1cInNlbGVjdGVkID0gW11cIj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJmYSBmYS10aW1lc1wiPjwvc3Bhbj5cclxuICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxkaXYgdi1pZj1cInNlbGVjdGVkLmxlbmd0aCA+IDBcIj5cclxuICAgICAgICA8VHJhbnNpdGlvbkdyb3VwIG5hbWU9XCJmYWRlXCI+XHJcbiAgICAgICAgICA8c3BhbiB2LWZvcj1cIihub2RlLCBpKSBvZiBzZWxlY3RlZFwiXHJcbiAgICAgICAgICAgIGNsYXNzPVwibWUtMiBtYi0yIGMtaXRlbVwiXHJcbiAgICAgICAgICAgIDpjbGFzcz1cIml0ZW1DbGFzc1wiXHJcbiAgICAgICAgICAgIDprZXk9XCJ2YWx1ZUdldHRlcihub2RlLnZhbHVlKVwiXHJcbiAgICAgICAgICAgIHN0eWxlPVwiYW5pbWF0aW9uLWR1cmF0aW9uOiAuM3NcIj5cclxuICAgICAgICAgICAgPHNwYW4+e3sgdGl0bGVHZXR0ZXIobm9kZS52YWx1ZSkgfX08L3NwYW4+XHJcbiAgICAgICAgICAgIDxzcGFuIHR5cGU9XCJidXR0b25cIiB2LWlmPVwiY2FuTW9kaWZ5XCJcclxuICAgICAgICAgICAgICBAY2xpY2sucHJldmVudD1cImRlbGV0ZUl0ZW0oaSwgbm9kZSlcIiBjbGFzcz1cIm1zLTJcIiBzdHlsZT1cImN1cnNvcjogcG9pbnRlclwiPlxyXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZmEgZmEtdGltZXNcIj48L3NwYW4+XHJcbiAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICA8L1RyYW5zaXRpb25Hcm91cD5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgdi1lbHNlIGNsYXNzPVwidGV4dC1tdXRlZFwiPlxyXG4gICAgICAgIHt7IHBsYWNlaG9sZGVyIH19XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcblxyXG4gICAgPHNlbGVjdCBtdWx0aXBsZVxyXG4gICAgICBzdHlsZT1cImRpc3BsYXk6IG5vbmU7XCJcclxuICAgICAgcmVmPVwiaW5wdXRcIlxyXG4gICAgICA6aWQ9XCJpZFwiXHJcbiAgICAgIDpuYW1lPVwibmFtZVwiXHJcbiAgICAgIDpkaXNhYmxlZD1cImRpc2FibGVkXCJcclxuICAgICAgOnJlYWRvbmx5PVwicmVhZG9ubHlcIlxyXG4gICAgICB2LWJpbmQ9XCIkYXR0cnNcIlxyXG4gICAgPlxyXG4gICAgICA8b3B0aW9uIHYtZm9yPVwiaWQgb2Ygc2VsZWN0ZWRWYWx1ZXNcIiA6dmFsdWU9XCJpZFwiIDpzZWxlY3RlZD1cInRydWVcIj57eyBpZCB9fTwvb3B0aW9uPlxyXG4gICAgPC9zZWxlY3Q+XHJcblxyXG4gICAgPFRyZWVNb2RhbFxyXG4gICAgICA6b3Blbj1cInRyZWVNb2RhbE9wZW5cIlxyXG4gICAgICBAaGlkZT1cInRyZWVNb2RhbE9wZW4gPSBmYWxzZVwiXHJcbiAgICAgIDppZD1cImlkXCJcclxuICAgICAgOnRpdGxlPVwibW9kYWxUaXRsZVwiXHJcbiAgICAgIDpzb3VyY2U9XCJzb3VyY2VcIlxyXG4gICAgICA6dmFsdWU9XCJzZWxlY3RlZFZhbHVlc1wiXHJcbiAgICAgIDpicmFuY2hTZWxlY3RhYmxlXHJcbiAgICAgIHYtYmluZD1cIiRhdHRyc1wiXHJcbiAgICAgIDpkaXNhYmxlZD1cImRpc2FibGVkXCJcclxuICAgICAgOnJlYWRvbmx5PVwicmVhZG9ubHlcIlxyXG4gICAgICA6c2VhcmNoLXRleHQ9XCJzZWFyY2hUZXh0XCJcclxuICAgICAgQHNlbGVjdGVkPVwiaGFuZGxlU2VsZWN0ZWRcIlxyXG4gICAgLz5cclxuICA8L2Rpdj5cclxuPC90ZW1wbGF0ZT5cclxuXHJcbjxzdHlsZSBzY29wZWQ+XHJcbi5jLWl0ZW0ge1xyXG4gIHBhZGRpbmctbGVmdDogLjc1cmVtO1xyXG4gIHBhZGRpbmctcmlnaHQ6IC43NXJlbTtcclxuICBwYWRkaW5nLXRvcDogLjVyZW07XHJcbiAgcGFkZGluZy1ib3R0b206IC41cmVtO1xyXG59XHJcbjwvc3R5bGU+XHJcbiIsIjxzY3JpcHQgbGFuZz1cInRzXCIgc2V0dXA+XHJcbmltcG9ydCB7IGNsb25lRGVlcCB9IGZyb20gJ2xvZGFzaC1lcyc7XHJcbmltcG9ydCB7IGNvbXB1dGVkLCBwcm92aWRlLCByZWYsIHdhdGNoIH0gZnJvbSAndnVlJztcclxuaW1wb3J0IHsgZm9yY2VBcnJheSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2UnO1xyXG5pbXBvcnQge1xyXG4gIFZhbHVlR2V0dGVyLFxyXG4gIE1vZGFsVHJlZVNvdXJjZSxcclxuICBUaXRsZUdldHRlcixcclxuICBUcmVlTm9kZSxcclxuICBTZWFyY2hNYXRjaGVyLFxyXG4gIE1heWJlQXJyYXksXHJcbiAgTWF5YmVQcm9taXNlXHJcbn0gZnJvbSAnLi4vLi4vLi4vdHlwZXMnO1xyXG5pbXBvcnQgVHJlZU1vZGFsIGZyb20gJy4vVHJlZU1vZGFsLnZ1ZSc7XHJcblxyXG5jb25zdCBwcm9wcyA9IHdpdGhEZWZhdWx0cyhcclxuICBkZWZpbmVQcm9wczx7XHJcbiAgICBpZD86IHN0cmluZztcclxuICAgIG5hbWU/OiBzdHJpbmc7XHJcbiAgICB0aXRsZT86IHN0cmluZztcclxuICAgIGRpc2FibGVkPzogYm9vbGVhbjtcclxuICAgIHJlYWRvbmx5PzogYm9vbGVhbjtcclxuICAgIHZhbHVlPzogTWF5YmVBcnJheTxzdHJpbmcgfCBudW1iZXI+O1xyXG4gICAgc291cmNlPzogTW9kYWxUcmVlU291cmNlO1xyXG4gICAgaXRlbXM/OiBNYXliZUFycmF5PFRyZWVOb2RlPiB8ICgoKSA9PiBNYXliZVByb21pc2U8TWF5YmVBcnJheTxUcmVlTm9kZT4+KTtcclxuICAgIHZhbHVlR2V0dGVyPzogVmFsdWVHZXR0ZXI7XHJcbiAgICB0aXRsZUdldHRlcj86IFRpdGxlR2V0dGVyO1xyXG4gICAgc2VhcmNoTWF0Y2hlcj86IFNlYXJjaE1hdGNoZXI7XHJcbiAgICBtb2RhbFRpdGxlPzogc3RyaW5nO1xyXG4gICAgdmVydGljYWw/OiBib29sZWFuO1xyXG4gICAgYnJhbmNoU2VsZWN0YWJsZT86IGJvb2xlYW47XHJcbiAgICBzZWxlY3RBbGxDaGlsZHJlbj86IGJvb2xlYW47XHJcbiAgICBwbGFjZWhvbGRlcj86IHN0cmluZztcclxuICAgIG11bHRpcGxlPzogYm9vbGVhbjtcclxuICAgIGJ1dHRvblRleHQ/OiBzdHJpbmc7XHJcbiAgICBpdGVtQ2xhc3M/OiBzdHJpbmc7XHJcbiAgICBzZWFyY2hUZXh0Pzogc3RyaW5nO1xyXG4gIH0+KCksXHJcbiAge1xyXG4gICAgYnJhbmNoU2VsZWN0YWJsZTogZmFsc2UsXHJcbiAgICBzZWxlY3RBbGxDaGlsZHJlbjogZmFsc2UsXHJcbiAgICBwbGFjZWhvbGRlcjogJy0gTm8gc2VsZWN0ZWQgLScsXHJcbiAgICBtdWx0aXBsZTogZmFsc2UsXHJcbiAgICBidXR0b25UZXh0OiAnU2VsZWN0JyxcclxuICAgIGl0ZW1DbGFzczogJ2JhZGdlIGJnLXByaW1hcnkgYmFkZ2UtcGlsbCcsXHJcbiAgICBzZWFyY2hUZXh0OiAnU2VhcmNoJyxcclxuICAgIHZhbHVlR2V0dGVyOiAoaXRlbTogYW55KSA9PiBpdGVtLmlkLFxyXG4gICAgdGl0bGVHZXR0ZXI6IChpdGVtOiBhbnkpID0+IGl0ZW0udGl0bGUsXHJcbiAgfVxyXG4pO1xyXG5cclxucHJvdmlkZSgnaWQnLCBwcm9wcy5pZCk7XHJcbnByb3ZpZGUoJ25hbWUnLCBwcm9wcy5uYW1lKTtcclxucHJvdmlkZSgnbXVsdGlwbGUnLCBwcm9wcy5tdWx0aXBsZSk7XHJcbnByb3ZpZGUoJ3ZhbHVlR2V0dGVyJywgcHJvcHMudmFsdWVHZXR0ZXIpO1xyXG5wcm92aWRlKCd0aXRsZUdldHRlcicsIHByb3BzLnRpdGxlR2V0dGVyKTtcclxucHJvdmlkZSgnc2VhcmNoTWF0Y2hlcicsIHByb3BzLnNlYXJjaE1hdGNoZXIgPz8gZGVmYXVsdFNlYXJjaE1hdGNoZXIpO1xyXG5cclxuZnVuY3Rpb24gZGVmYXVsdFNlYXJjaE1hdGNoZXIoaXRlbTogYW55LCBxOiBzdHJpbmcpIHtcclxuICByZXR1cm4gcHJvcHMudGl0bGVHZXR0ZXIoaXRlbSkudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhxLnRvTG93ZXJDYXNlKCkpO1xyXG59XHJcblxyXG5jb25zdCBzZWxlY3RlZCA9IHJlZjxUcmVlTm9kZVtdPihbXSk7XHJcbmNvbnN0IHZhbHVlID0gcmVmPChzdHJpbmd8bnVtYmVyKVtdPihmb3JjZUFycmF5KHByb3BzLnZhbHVlKSk7XHJcblxyXG4vLyBNb2RhbFxyXG5jb25zdCB0cmVlTW9kYWxPcGVuID0gcmVmKGZhbHNlKTtcclxuXHJcbmZ1bmN0aW9uIG9wZW5TZWxlY3RvcigpIHtcclxuICB0cmVlTW9kYWxPcGVuLnZhbHVlID0gdHJ1ZTtcclxufVxyXG5cclxuZnVuY3Rpb24gZGVsZXRlSXRlbShpOiBudW1iZXIsIG5vZGU6IFRyZWVOb2RlKSB7XHJcbiAgc2VsZWN0ZWQudmFsdWUgPSBzZWxlY3RlZC52YWx1ZS5maWx0ZXIoKGl0OiBUcmVlTm9kZSkgPT4gcHJvcHMudmFsdWVHZXR0ZXIoaXQudmFsdWUpICE9PSBwcm9wcy52YWx1ZUdldHRlcihub2RlLnZhbHVlKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhhbmRsZVNlbGVjdGVkKGl0ZW1zOiBhbnlbXSkge1xyXG4gIHNlbGVjdGVkLnZhbHVlID0gY2xvbmVEZWVwKGl0ZW1zKTtcclxufVxyXG5cclxud2F0Y2goKCkgPT4gcHJvcHMuaXRlbXMsIGFzeW5jICh2KSA9PiB7XHJcbiAgaWYgKHR5cGVvZiB2ID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICB2ID0gYXdhaXQgdigpO1xyXG4gIH1cclxuXHJcbiAgc2VsZWN0ZWQudmFsdWUgPSBmb3JjZUFycmF5KHYpLmZpbHRlcigobm9kZTogVHJlZU5vZGUpID0+IHtcclxuICAgIHJldHVybiB2YWx1ZS52YWx1ZS5pbmNsdWRlcyhwcm9wcy52YWx1ZUdldHRlcihub2RlLnZhbHVlKSk7XHJcbiAgfSk7XHJcbn0sIHsgaW1tZWRpYXRlOiB0cnVlIH0pO1xyXG5cclxuY29uc3Qgc2VsZWN0ZWRWYWx1ZXMgPSBjb21wdXRlZCgoKSA9PiB7XHJcbiAgcmV0dXJuIHNlbGVjdGVkLnZhbHVlLm1hcChub2RlID0+IHByb3BzLnZhbHVlR2V0dGVyKG5vZGUudmFsdWUpKTtcclxufSk7XHJcblxyXG5jb25zdCBjYW5Nb2RpZnkgPSBjb21wdXRlZCgoKSA9PiB7XHJcbiAgcmV0dXJuICFwcm9wcy5yZWFkb25seSAmJiAhcHJvcHMuZGlzYWJsZWQ7XHJcbn0pO1xyXG5cclxuPC9zY3JpcHQ+XHJcblxyXG48dGVtcGxhdGU+XHJcbiAgPGRpdiBjbGFzcz1cImMtbW9kYWwtdHJlZVwiPlxyXG4gICAgPGRpdiBjbGFzcz1cImMtbW9kYWwtdHJlZV9fY29udGFpbmVyIHAtMiBkLWZsZXggZmxleC1jb2x1bW5cIlxyXG4gICAgICA6Y2xhc3M9XCJbIHZlcnRpY2FsID8gJycgOiAnZmxleC1tZC1yb3cnIF1cIj5cclxuICAgICAgPGRpdiB2LWlmPVwiY2FuTW9kaWZ5XCIgY2xhc3M9XCJtZS0yIG1iLTJcIlxyXG4gICAgICAgIDpjbGFzcz1cInsgJ21iLW1kLTAnOiAhdmVydGljYWwgfVwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJidG4tZ3JvdXBcIj5cclxuICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLXNlY29uZGFyeSBidG4tc20gYnRuLXJvdW5kZWQgdGV4dC1ub3dyYXBcIiB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgQGNsaWNrPVwib3BlblNlbGVjdG9yXCI+XHJcbiAgICAgICAgICAgIHt7IGJ1dHRvblRleHQgfX1cclxuICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tc2Vjb25kYXJ5IGJ0bi1zbSBidG4tcm91bmRlZFwiIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICBAY2xpY2s9XCJzZWxlY3RlZCA9IFtdXCI+XHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZmEgZmEtdGltZXNcIj48L3NwYW4+XHJcbiAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICA8ZGl2IHYtaWY9XCJzZWxlY3RlZC5sZW5ndGggPiAwXCI+XHJcbiAgICAgICAgPFRyYW5zaXRpb25Hcm91cCBuYW1lPVwiZmFkZVwiPlxyXG4gICAgICAgICAgPHNwYW4gdi1mb3I9XCIobm9kZSwgaSkgb2Ygc2VsZWN0ZWRcIlxyXG4gICAgICAgICAgICBjbGFzcz1cIm1lLTIgbWItMiBjLWl0ZW1cIlxyXG4gICAgICAgICAgICA6Y2xhc3M9XCJpdGVtQ2xhc3NcIlxyXG4gICAgICAgICAgICA6a2V5PVwidmFsdWVHZXR0ZXIobm9kZS52YWx1ZSlcIlxyXG4gICAgICAgICAgICBzdHlsZT1cImFuaW1hdGlvbi1kdXJhdGlvbjogLjNzXCI+XHJcbiAgICAgICAgICAgIDxzcGFuPnt7IHRpdGxlR2V0dGVyKG5vZGUudmFsdWUpIH19PC9zcGFuPlxyXG4gICAgICAgICAgICA8c3BhbiB0eXBlPVwiYnV0dG9uXCIgdi1pZj1cImNhbk1vZGlmeVwiXHJcbiAgICAgICAgICAgICAgQGNsaWNrLnByZXZlbnQ9XCJkZWxldGVJdGVtKGksIG5vZGUpXCIgY2xhc3M9XCJtcy0yXCIgc3R5bGU9XCJjdXJzb3I6IHBvaW50ZXJcIj5cclxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImZhIGZhLXRpbWVzXCI+PC9zcGFuPlxyXG4gICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgPC9UcmFuc2l0aW9uR3JvdXA+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2IHYtZWxzZSBjbGFzcz1cInRleHQtbXV0ZWRcIj5cclxuICAgICAgICB7eyBwbGFjZWhvbGRlciB9fVxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG5cclxuICAgIDxzZWxlY3QgbXVsdGlwbGVcclxuICAgICAgc3R5bGU9XCJkaXNwbGF5OiBub25lO1wiXHJcbiAgICAgIHJlZj1cImlucHV0XCJcclxuICAgICAgOmlkPVwiaWRcIlxyXG4gICAgICA6bmFtZT1cIm5hbWVcIlxyXG4gICAgICA6ZGlzYWJsZWQ9XCJkaXNhYmxlZFwiXHJcbiAgICAgIDpyZWFkb25seT1cInJlYWRvbmx5XCJcclxuICAgICAgdi1iaW5kPVwiJGF0dHJzXCJcclxuICAgID5cclxuICAgICAgPG9wdGlvbiB2LWZvcj1cImlkIG9mIHNlbGVjdGVkVmFsdWVzXCIgOnZhbHVlPVwiaWRcIiA6c2VsZWN0ZWQ9XCJ0cnVlXCI+e3sgaWQgfX08L29wdGlvbj5cclxuICAgIDwvc2VsZWN0PlxyXG5cclxuICAgIDxUcmVlTW9kYWxcclxuICAgICAgOm9wZW49XCJ0cmVlTW9kYWxPcGVuXCJcclxuICAgICAgQGhpZGU9XCJ0cmVlTW9kYWxPcGVuID0gZmFsc2VcIlxyXG4gICAgICA6aWQ9XCJpZFwiXHJcbiAgICAgIDp0aXRsZT1cIm1vZGFsVGl0bGVcIlxyXG4gICAgICA6c291cmNlPVwic291cmNlXCJcclxuICAgICAgOnZhbHVlPVwic2VsZWN0ZWRWYWx1ZXNcIlxyXG4gICAgICA6YnJhbmNoU2VsZWN0YWJsZVxyXG4gICAgICB2LWJpbmQ9XCIkYXR0cnNcIlxyXG4gICAgICA6ZGlzYWJsZWQ9XCJkaXNhYmxlZFwiXHJcbiAgICAgIDpyZWFkb25seT1cInJlYWRvbmx5XCJcclxuICAgICAgOnNlYXJjaC10ZXh0PVwic2VhcmNoVGV4dFwiXHJcbiAgICAgIEBzZWxlY3RlZD1cImhhbmRsZVNlbGVjdGVkXCJcclxuICAgIC8+XHJcbiAgPC9kaXY+XHJcbjwvdGVtcGxhdGU+XHJcblxyXG48c3R5bGUgc2NvcGVkPlxyXG4uYy1pdGVtIHtcclxuICBwYWRkaW5nLWxlZnQ6IC43NXJlbTtcclxuICBwYWRkaW5nLXJpZ2h0OiAuNzVyZW07XHJcbiAgcGFkZGluZy10b3A6IC41cmVtO1xyXG4gIHBhZGRpbmctYm90dG9tOiAuNXJlbTtcclxufVxyXG48L3N0eWxlPlxyXG4iLCJpbXBvcnQgeyBkYXRhIH0gZnJvbSAnLi4vZGF0YSc7XHJcbmltcG9ydCB7IHVzZUNzc0ltcG9ydCB9IGZyb20gJy4uL3NlcnZpY2UnO1xyXG5pbXBvcnQgeyBjcmVhdGVBcHAgfSBmcm9tICd2dWUnO1xyXG5pbXBvcnQgTW9kYWxUcmVlQXBwIGZyb20gJy4uL3Z1ZS9jb21wb25lbnRzL01vZGFsVHJlZS9Nb2RhbFRyZWVBcHAudnVlJztcclxudXNlQ3NzSW1wb3J0KCdAdnVlLWFuaW1hdGUnKTtcclxuXHJcbmNvbnN0IGFwcCA9IGNyZWF0ZUFwcCh7XHJcbiAgbmFtZTogJ21vZGFsLXRyZWUnLFxyXG4gIGNvbXBvbmVudHM6IHtcclxuICAgIE1vZGFsVHJlZUFwcFxyXG4gIH1cclxufSk7XHJcbmFwcC5jb25maWcuZ2xvYmFsUHJvcGVydGllcy4kZ2V0RGF0YSA9IGRhdGE7XHJcblxyXG5jbGFzcyBNb2RhbFRyZWVFbGVtZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xyXG4gIHN0YXRpYyBpcyA9ICdtb2RhbC10cmVlJztcclxuXHJcbiAgdm06IGFueTtcclxuXHJcbiAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XHJcbiAgICBpZiAoIXRoaXMudm0pIHtcclxuICAgICAgdGhpcy52bSA9IGFwcC5tb3VudCh0aGlzKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmN1c3RvbUVsZW1lbnRzLmRlZmluZShNb2RhbFRyZWVFbGVtZW50LmlzLCBNb2RhbFRyZWVFbGVtZW50KTtcclxuIl0sIm5hbWVzIjpbImNoaWxkcmVuIiwiYiIsIkMiLCJFIiwiaCIsInAiLCJXIiwiRiIsIkwiLCJrIiwic2VsZWN0IiwiX2hvaXN0ZWRfMSIsIl9jcmVhdGVFbGVtZW50QmxvY2siLCJfbm9ybWFsaXplQ2xhc3MiLCJfY3JlYXRlRWxlbWVudFZOb2RlIiwiX25vcm1hbGl6ZVN0eWxlIiwiX3dpdGhEaXJlY3RpdmVzIiwiX29wZW5CbG9jayIsIl9ob2lzdGVkXzIiLCJfaG9pc3RlZF8zIiwiX2NyZWF0ZVRleHRWTm9kZSIsIl90b0Rpc3BsYXlTdHJpbmciLCJfaG9pc3RlZF81IiwiX2NyZWF0ZUJsb2NrIiwiX0ZyYWdtZW50IiwiX3JlbmRlckxpc3QiLCJfaG9pc3RlZF80IiwiX2hvaXN0ZWRfNiIsIl9ob2lzdGVkXzciLCJfY3JlYXRlVk5vZGUiLCJfVHJhbnNpdGlvbkdyb3VwIiwiX3dpdGhDdHgiLCJfd2l0aE1vZGlmaWVycyIsIl9jcmVhdGVDb21tZW50Vk5vZGUiLCJfbWVyZ2VQcm9wcyJdLCJtYXBwaW5ncyI6Ijs7OztBQUVPLFNBQVMsZ0JBQWdCLFVBQXNCO0FBQ3BELFFBQU0sT0FBbUIsQ0FBQTtBQUV6QixXQUFTLGFBQWFBLFdBQXNCO0FBQzFDLGVBQVcsU0FBU0EsV0FBVTtBQUM1QixVQUFJLE1BQU0sU0FBUyxXQUFXLEdBQUc7QUFDL0IsYUFBSyxLQUFLLEtBQUs7QUFDZjtBQUFBLE1BQ0Y7QUFFQSxtQkFBYSxNQUFNLFFBQVE7QUFBQSxJQUM3QjtBQUFBLEVBQ0Y7QUFFQSxlQUFhLFFBQVE7QUFDckIsU0FBTztBQUNUO0FDakJBLFNBQVMsRUFBRSxHQUFHO0FBQ1osU0FBTztBQUFBLElBQ0wsUUFBUSxFQUFFLE1BQU07QUFBQSxJQUNoQixPQUFPLEVBQUUsTUFBTTtBQUFBLElBQ2YsVUFBVSxFQUFFLE1BQU07QUFBQSxJQUNsQixZQUFZLEVBQUUsTUFBTTtBQUFBLElBQ3BCLFVBQVUsRUFBRSxNQUFNO0FBQUEsSUFDbEIsWUFBWSxFQUFFLE1BQU07QUFBQSxJQUNwQixlQUFlLEVBQUUsTUFBTTtBQUFBLElBQ3ZCLGdCQUFnQixFQUFFLE1BQU07QUFBQSxJQUN4QixtQkFBbUIsRUFBRSxNQUFNO0FBQUEsSUFDM0IsV0FBVyxFQUFFLE1BQU07QUFBQSxJQUNuQixjQUFjLEVBQUUsTUFBTTtBQUFBLEVBQzFCO0FBQ0E7QUFDQSxTQUFTLEVBQUUsR0FBRyxHQUFHLEdBQUc7QUFDbEIsUUFBTSxJQUFJQyxNQUFFLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBQyxJQUFLLGlCQUFpQixDQUFDO0FBQ2pELElBQUUsTUFBTSxRQUFRLEdBQUcsRUFBRSxNQUFNLFdBQVcsWUFBWSxFQUFFLE1BQU0sYUFBYSxVQUFVLEVBQUUsTUFBTSxT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
