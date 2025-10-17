import { ad as forceArray, u as useHttpClient, ab as useCssImport, ac as data } from "./unicorn.js";
import { defineComponent, ref, computed, h, Transition, withDirectives, mergeProps, vShow, unref, inject, watch, onBeforeUpdate, nextTick, onMounted, createElementBlock, openBlock, normalizeClass, createElementVNode, createBlock, createCommentVNode, normalizeStyle, vModelDynamic, withModifiers, createTextVNode, toDisplayString, withCtx, Fragment, renderList, useTemplateRef, onUnmounted, provide, vModelText, createVNode, TransitionGroup, createApp } from "vue";
import { Modal } from "bootstrap";
import { c as cloneDeep } from "./cloneDeep.js";
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
async function init() {
  customElements.define(ModalTreeElement.is, ModalTreeElement);
  await useCssImport("@vue-animate");
}
const ready = /* @__PURE__ */ init();
export {
  ready
};
//# sourceMappingURL=field-modal-tree.js.map
