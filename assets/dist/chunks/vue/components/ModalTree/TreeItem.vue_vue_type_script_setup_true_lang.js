import { defineComponent, ref, computed, h, Transition, withDirectives, mergeProps, vShow, unref, inject, watch, onBeforeUpdate, nextTick, onMounted } from "vue";
import { T as TreeItem } from "./TreeItem.js";
import { f as flattenChildren } from "../../../utilities/tree.js";
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
const _sfc_main = /* @__PURE__ */ defineComponent({
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
export {
  _sfc_main as _
};
