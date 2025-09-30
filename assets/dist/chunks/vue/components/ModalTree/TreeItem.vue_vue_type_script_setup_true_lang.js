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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHJlZUl0ZW0udnVlX3Z1ZV90eXBlX3NjcmlwdF9zZXR1cF90cnVlX2xhbmcuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy92dWUzLXNsaWRlLXVwLWRvd24vZGlzdC92dWUzLXNsaWRlLXVwLWRvd24uanMiLCIuLi8uLi8uLi8uLi8uLi9zcmMvdnVlL2NvbXBvbmVudHMvTW9kYWxUcmVlL1RyZWVJdGVtLnZ1ZSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBkZWZpbmVDb21wb25lbnQgYXMgQywgcmVmIGFzIEUsIGNvbXB1dGVkIGFzIGgsIGggYXMgcCwgVHJhbnNpdGlvbiBhcyBXLCB3aXRoRGlyZWN0aXZlcyBhcyBGLCBtZXJnZVByb3BzIGFzIEwsIHZTaG93IGFzIGssIHVucmVmIGFzIGIgfSBmcm9tIFwidnVlXCI7XG5mdW5jdGlvbiB5KHQpIHtcbiAgcmV0dXJuIHtcbiAgICBoZWlnaHQ6IHQuc3R5bGUuaGVpZ2h0LFxuICAgIHdpZHRoOiB0LnN0eWxlLndpZHRoLFxuICAgIHBvc2l0aW9uOiB0LnN0eWxlLnBvc2l0aW9uLFxuICAgIHZpc2liaWxpdHk6IHQuc3R5bGUudmlzaWJpbGl0eSxcbiAgICBvdmVyZmxvdzogdC5zdHlsZS5vdmVyZmxvdyxcbiAgICBwYWRkaW5nVG9wOiB0LnN0eWxlLnBhZGRpbmdUb3AsXG4gICAgcGFkZGluZ0JvdHRvbTogdC5zdHlsZS5wYWRkaW5nQm90dG9tLFxuICAgIGJvcmRlclRvcFdpZHRoOiB0LnN0eWxlLmJvcmRlclRvcFdpZHRoLFxuICAgIGJvcmRlckJvdHRvbVdpZHRoOiB0LnN0eWxlLmJvcmRlckJvdHRvbVdpZHRoLFxuICAgIG1hcmdpblRvcDogdC5zdHlsZS5tYXJnaW5Ub3AsXG4gICAgbWFyZ2luQm90dG9tOiB0LnN0eWxlLm1hcmdpbkJvdHRvbVxuICB9O1xufVxuZnVuY3Rpb24gVih0LCBvLCBpKSB7XG4gIGNvbnN0IGUgPSBiKHQpLCB7IHdpZHRoOiBuIH0gPSBnZXRDb21wdXRlZFN0eWxlKG8pO1xuICBvLnN0eWxlLndpZHRoID0gbiwgby5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIiwgby5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIiwgby5zdHlsZS5oZWlnaHQgPSBcIlwiO1xuICBjb25zdCB7IGhlaWdodDogcyB9ID0gZ2V0Q29tcHV0ZWRTdHlsZShvKTtcbiAgcmV0dXJuIG8uc3R5bGUud2lkdGggPSBpLndpZHRoLCBvLnN0eWxlLnBvc2l0aW9uID0gaS5wb3NpdGlvbiwgby5zdHlsZS52aXNpYmlsaXR5ID0gaS52aXNpYmlsaXR5LCBvLnN0eWxlLmhlaWdodCA9IGUsIG8uc3R5bGUub3ZlcmZsb3cgPSBcImhpZGRlblwiLCBpLmhlaWdodCAmJiBpLmhlaWdodCAhPSBlID8gaS5oZWlnaHQgOiBzO1xufVxuZnVuY3Rpb24gZih0LCBvLCBpLCBlLCBuKSB7XG4gIGNvbnN0IHMgPSB0LmFuaW1hdGUoZSwgbik7XG4gIHQuc3R5bGUuaGVpZ2h0ID0gby5oZWlnaHQsIHMub25maW5pc2ggPSAoKSA9PiB7XG4gICAgdC5zdHlsZS5vdmVyZmxvdyA9IG8ub3ZlcmZsb3csIGkoKTtcbiAgfTtcbn1cbmZ1bmN0aW9uIG0odCwgbywgaSwgZSkge1xuICBjb25zdCBuID0gYihvKTtcbiAgcmV0dXJuIFtcbiAgICB7XG4gICAgICBoZWlnaHQ6IG4sXG4gICAgICBvcGFjaXR5OiB0Lm9wYWNpdHlDbG9zZWQsXG4gICAgICBwYWRkaW5nVG9wOiBuLFxuICAgICAgcGFkZGluZ0JvdHRvbTogbixcbiAgICAgIGJvcmRlclRvcFdpZHRoOiBuLFxuICAgICAgYm9yZGVyQm90dG9tV2lkdGg6IG4sXG4gICAgICBtYXJnaW5Ub3A6IG4sXG4gICAgICBtYXJnaW5Cb3R0b206IG5cbiAgICB9LFxuICAgIHtcbiAgICAgIGhlaWdodDogaSxcbiAgICAgIG9wYWNpdHk6IHQub3BhY2l0eU9wZW4sXG4gICAgICBwYWRkaW5nVG9wOiBlLnBhZGRpbmdUb3AgfHwgMCxcbiAgICAgIHBhZGRpbmdCb3R0b206IGUucGFkZGluZ0JvdHRvbSB8fCAwLFxuICAgICAgYm9yZGVyVG9wV2lkdGg6IGUuYm9yZGVyVG9wV2lkdGggfHwgMCxcbiAgICAgIGJvcmRlckJvdHRvbVdpZHRoOiBlLmJvcmRlckJvdHRvbVdpZHRoIHx8IDAsXG4gICAgICBtYXJnaW5Ub3A6IGUubWFyZ2luVG9wIHx8IDAsXG4gICAgICBtYXJnaW5Cb3R0b206IGUubWFyZ2luQm90dG9tIHx8IDBcbiAgICB9XG4gIF07XG59XG5jb25zdCB4ID0gQyh7XG4gIHByb3BzOiB7XG4gICAgbW9kZWxWYWx1ZToge1xuICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgIGRlZmF1bHQ6ICExXG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBUaW1lIGluIG1pbGxpc2Vjb25kcyBmb3IgdGhlIHNsaWRlIGR1cmF0aW9uXG4gICAgICovXG4gICAgZHVyYXRpb246IHtcbiAgICAgIHR5cGU6IE51bWJlcixcbiAgICAgIGRlZmF1bHQ6IDUwMFxuICAgIH0sXG4gICAgLyoqXG4gICAgICogVGltaW5nIGZ1bmN0aW9uIGZvciB0aGUgYW5pbWF0aW9uXG4gICAgICovXG4gICAgdGltaW5nRnVuY3Rpb246IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6IFwiZWFzZS1pbi1vdXRcIlxuICAgIH0sXG4gICAgLyoqXG4gICAgICogSW5kZXBlbmRlbnQgdGltaW5nIGZ1bmN0aW9uIGZvciB0aGUgYW5pbWF0aW9uIHdoZW4gZW50ZXJpbmdcbiAgICAgKi9cbiAgICB0aW1pbmdGdW5jdGlvbkVudGVyOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiBudWxsXG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBJbmRlcGVuZGVudCB0aW1pbmcgZnVuY3Rpb24gZm9yIHRoZSBhbmltYXRpb24gd2hlbiBsZWF2aW5nXG4gICAgICovXG4gICAgdGltaW5nRnVuY3Rpb25MZWF2ZToge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogbnVsbFxuICAgIH0sXG4gICAgLyoqXG4gICAgICogT3BhY2l0eSB2YWx1ZSBmcm9tIDAgLSAxIG9mIHRoZSBlbGVtZW50IHdoZW4gb3BlblxuICAgICAqL1xuICAgIG9wYWNpdHlPcGVuOiB7XG4gICAgICB0eXBlOiBOdW1iZXIsXG4gICAgICBkZWZhdWx0OiAxXG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBPcGFjaXR5IHZhbHVlIGZyb20gMCAtIDEgb2YgdGhlIGVsZW1lbnQgd2hlbiBjbG9zZWRcbiAgICAgKi9cbiAgICBvcGFjaXR5Q2xvc2VkOiB7XG4gICAgICB0eXBlOiBOdW1iZXIsXG4gICAgICBkZWZhdWx0OiAwXG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBIVE1MIHRhZyB0byB1c2UgZm9yIHRoZSBvdXRlciBjb250YWluZXJcbiAgICAgKi9cbiAgICB0YWc6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6IFwiZGl2XCJcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEFsd2F5cyByZW5kZXIgdGhlIGVsZW1lbnQgaW5zaWRlIHRoZSBzbGlkZSBjb250YWluZXJcbiAgICAgKi9cbiAgICBlYWdlcjoge1xuICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgIGRlZmF1bHQ6ICExXG4gICAgfVxuICB9LFxuICBlbWl0czogW1widXBkYXRlOm1vZGVsVmFsdWVcIiwgXCJvcGVuLXN0YXJ0XCIsIFwib3Blbi1lbmRcIiwgXCJjbG9zZS1zdGFydFwiLCBcImNsb3NlLWVuZFwiXSxcbiAgc2V0dXAodCwgeyBzbG90czogbywgYXR0cnM6IGksIGVtaXQ6IGUgfSkge1xuICAgIGNvbnN0IG4gPSBFKFwiMHB4XCIpLCBzID0gaCgoKSA9PiB0LnRpbWluZ0Z1bmN0aW9uRW50ZXIgfHwgdC50aW1pbmdGdW5jdGlvbiksIHYgPSBoKCgpID0+IHQudGltaW5nRnVuY3Rpb25MZWF2ZSB8fCB0LnRpbWluZ0Z1bmN0aW9uKTtcbiAgICBmdW5jdGlvbiBUKGcsIGwpIHtcbiAgICAgIGNvbnN0IGQgPSBnLCBhID0geShkKSwgciA9IFYobiwgZCwgYSksIHUgPSBtKHQsIG4sIHIsIGEpLCBjID0geyBkdXJhdGlvbjogdC5kdXJhdGlvbiwgZWFzaW5nOiBzLnZhbHVlIH07XG4gICAgICBmKGQsIGEsICgpID0+IHtcbiAgICAgICAgbCgpLCBlKFwib3Blbi1lbmRcIik7XG4gICAgICB9LCB1LCBjKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gQihnLCBsKSB7XG4gICAgICBjb25zdCBkID0gZywgYSA9IHkoZCksIHsgaGVpZ2h0OiByIH0gPSBnZXRDb21wdXRlZFN0eWxlKGQpO1xuICAgICAgZC5zdHlsZS5oZWlnaHQgPSByLCBkLnN0eWxlLm92ZXJmbG93ID0gXCJoaWRkZW5cIjtcbiAgICAgIGNvbnN0IHUgPSBtKHQsIG4sIHIsIGEpLnJldmVyc2UoKSwgYyA9IHsgZHVyYXRpb246IHQuZHVyYXRpb24sIGVhc2luZzogdi52YWx1ZSB9O1xuICAgICAgZihkLCBhLCAoKSA9PiB7XG4gICAgICAgIGwoKSwgZShcImNsb3NlLWVuZFwiKTtcbiAgICAgIH0sIHUsIGMpO1xuICAgIH1cbiAgICByZXR1cm4gKCkgPT4gcChcbiAgICAgIFcsXG4gICAgICB7XG4gICAgICAgIGNzczogITEsXG4gICAgICAgIHBlcnNpc3RlZDogdC5lYWdlcixcbiAgICAgICAgb25CZWZvcmVFbnRlcjogKCkgPT4gZShcIm9wZW4tc3RhcnRcIiksXG4gICAgICAgIG9uRW50ZXI6IFQsXG4gICAgICAgIG9uQmVmb3JlTGVhdmU6ICgpID0+IGUoXCJjbG9zZS1zdGFydFwiKSxcbiAgICAgICAgb25MZWF2ZTogQlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZGVmYXVsdDogKCkgPT4gdC5tb2RlbFZhbHVlIHx8IHQuZWFnZXIgPyBGKFxuICAgICAgICAgIHAoXG4gICAgICAgICAgICB0LnRhZyxcbiAgICAgICAgICAgIEwoaSwge1xuICAgICAgICAgICAgICBjbGFzczogXCJzbGlkZS11cC1kb3duX19jb250YWluZXJcIlxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBvXG4gICAgICAgICAgKSxcbiAgICAgICAgICBbdC5lYWdlciA/IFtrLCB0Lm1vZGVsVmFsdWUgPT09ICEwXSA6IFtudWxsXV1cbiAgICAgICAgKSA6IG51bGxcbiAgICAgIH1cbiAgICApO1xuICB9XG59KTtcbmV4cG9ydCB7XG4gIHggYXMgVnVlM1NsaWRlVXBEb3duXG59O1xuIiwiPHNjcmlwdCBzZXR1cCBsYW5nPVwidHNcIj5cclxuaW1wb3J0IHsgdHlwZSBDb21wb25lbnRQdWJsaWNJbnN0YW5jZSwgdHlwZSBDb21wdXRlZFJlZiwgY29tcHV0ZWQsIGluamVjdCwgbmV4dFRpY2ssIG9uQmVmb3JlVXBkYXRlLCBvbk1vdW50ZWQsIHJlZiwgd2F0Y2ggfSBmcm9tICd2dWUnO1xyXG5pbXBvcnQgeyBWdWUzU2xpZGVVcERvd24gfSBmcm9tICd2dWUzLXNsaWRlLXVwLWRvd24nO1xyXG5pbXBvcnQgeyBUaXRsZUdldHRlciwgVHJlZU5vZGUsIFZhbHVlR2V0dGVyIH0gZnJvbSAnLi4vLi4vLi4vdHlwZXMnO1xyXG5pbXBvcnQgeyBmbGF0dGVuQ2hpbGRyZW4gfSBmcm9tICcuLi8uLi8uLi91dGlsaXRpZXMnO1xyXG5pbXBvcnQgVHJlZUl0ZW0gZnJvbSAnLi9UcmVlSXRlbS52dWUnO1xyXG5cclxuY29uc3QgcHJvcHMgPSB3aXRoRGVmYXVsdHMoXHJcbiAgZGVmaW5lUHJvcHM8e1xyXG4gICAgbm9kZTogVHJlZU5vZGU7XHJcbiAgICBsZXZlbD86IG51bWJlcjtcclxuICAgIGJyYW5jaFNlbGVjdGFibGU/OiBib29sZWFuO1xyXG4gIH0+KCksXHJcbiAge1xyXG4gICAgbGV2ZWw6IDEsXHJcbiAgICBicmFuY2hTZWxlY3RhYmxlOiBmYWxzZSxcclxuICB9XHJcbik7XHJcblxyXG5jb25zdCBlbWl0ID0gZGVmaW5lRW1pdHM8e1xyXG4gIGNoYW5nZTogW2NoZWNrZWQ6IGJvb2xlYW5dO1xyXG4gIGlucHV0OiBbY2hlY2tlZDogYm9vbGVhbl07XHJcbn0+KCk7XHJcblxyXG5jb25zdCBub2RlID0gcmVmPFRyZWVOb2RlPihwcm9wcy5ub2RlKTtcclxuLy8gY29uc3Qgc2VsZWN0Tm9kZSA9IGluamVjdDwobm9kZTogVHJlZU5vZGUsIHNlbGVjdDogYm9vbGVhbikgPT4gYW55Pignc2VsZWN0Tm9kZScpO1xyXG5jb25zdCBzZWxlY3RlZFZhbHVlcyA9IGluamVjdDxDb21wdXRlZFJlZjwoc3RyaW5nIHwgbnVtYmVyKVtdPj4oJ3NlbGVjdGVkVmFsdWVzJyk7XHJcbmNvbnN0IGlkID0gaW5qZWN0KCdpZCcpO1xyXG5jb25zdCBtdWx0aXBsZSA9IGluamVjdCgnbXVsdGlwbGUnKTtcclxuY29uc3QgdmFsdWVHZXR0ZXIgPSBpbmplY3Q8VmFsdWVHZXR0ZXI+KCd2YWx1ZUdldHRlcicpO1xyXG5jb25zdCB0aXRsZUdldHRlciA9IGluamVjdDxUaXRsZUdldHRlcj4oJ3RpdGxlR2V0dGVyJyk7XHJcblxyXG5jb25zdCBzZWxlY3RlZCA9IHJlZihmYWxzZSk7XHJcbmNvbnN0IGluZGV0ZXJtaW5hdGUgPSBjb21wdXRlZCgoKSA9PiAhIXByb3BzLm5vZGUuaW5kZXRlcm1pbmF0ZSk7XHJcbmNvbnN0IHN0b3BXYXRjaCA9IHJlZihmYWxzZSk7XHJcbmNvbnN0IG9wZW4gPSByZWYoZmFsc2UpO1xyXG5jb25zdCBjaGlsZHJlbkNvbXBvbmVudHMgPSByZWY8Q29tcG9uZW50UHVibGljSW5zdGFuY2U8dHlwZW9mIFRyZWVJdGVtPltdPihbXSk7XHJcblxyXG53YXRjaCgoKSA9PiBwcm9wcy5ub2RlLCAoKSA9PiB7XHJcbiAgc2VsZWN0ZWQudmFsdWUgPSAhIXByb3BzLm5vZGUuc2VsZWN0ZWQ7XHJcbn0sIHsgZGVlcDogdHJ1ZSB9KTtcclxuXHJcbmZ1bmN0aW9uIHNldENoaWxkcmVuQ29tcG9uZW50KGNoaWxkOiBDb21wb25lbnRQdWJsaWNJbnN0YW5jZTx0eXBlb2YgVHJlZUl0ZW0+KSB7XHJcbiAgY2hpbGRyZW5Db21wb25lbnRzLnZhbHVlLnB1c2goY2hpbGQpO1xyXG59XHJcblxyXG5vbkJlZm9yZVVwZGF0ZSgoKSA9PiB7XHJcbiAgY2hpbGRyZW5Db21wb25lbnRzLnZhbHVlID0gW107XHJcbn0pO1xyXG5cclxuY29uc3QgaW5kZW50UHggPSBjb21wdXRlZCgoKSA9PiB7XHJcbiAgcmV0dXJuIChwcm9wcy5sZXZlbCAtIDEpICogMTU7XHJcbn0pO1xyXG5cclxuY29uc3QgaXNCcmFuY2ggPSBjb21wdXRlZCgoKSA9PiB7XHJcbiAgcmV0dXJuIHByb3BzLm5vZGUuY2hpbGRyZW4ubGVuZ3RoID4gMDtcclxufSk7XHJcblxyXG5jb25zdCBpc0xlYWYgPSBjb21wdXRlZCgoKSA9PiB7XHJcbiAgcmV0dXJuICFpc0JyYW5jaC52YWx1ZTtcclxufSk7XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVTZWxlY3RlZCgpIHtcclxuICBpZiAoaXNCcmFuY2gudmFsdWUpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIG5vZGUudmFsdWUuc2VsZWN0ZWQgPSBzZWxlY3RlZFZhbHVlcy52YWx1ZS5pbmNsdWRlcyh2YWx1ZUdldHRlcihwcm9wcy5ub2RlLnZhbHVlKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNlbGVjdChzZWxlY3Q6IGJvb2xlYW4pIHtcclxuICBpZiAoc2VsZWN0ZWQudmFsdWUgPT09IHNlbGVjdCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgbm9kZS52YWx1ZS5zZWxlY3RlZCA9IHNlbGVjdDtcclxuXHJcbiAgY2hlY2tib3hDaGFuZ2VkKHNlbGVjdCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNoZWNrYm94Q2hhbmdlZCh2OiBib29sZWFuKSB7XHJcbiAgaWYgKGlzQnJhbmNoLnZhbHVlKSB7XHJcbiAgICBub2RlLnZhbHVlLnNlbGVjdGVkID0gdjtcclxuXHJcbiAgICBpZiAobXVsdGlwbGUpIHtcclxuICAgICAgc3RvcFdhdGNoVGhlbigoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZmxhdENoaWxkcmVuID0gZmxhdHRlbkNoaWxkcmVuKG5vZGUudmFsdWUuY2hpbGRyZW4pO1xyXG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgZmxhdENoaWxkcmVuKSB7XHJcbiAgICAgICAgICBjaGlsZC5zZWxlY3RlZCA9IHY7XHJcbiAgICAgICAgICBjaGlsZC5pbmRldGVybWluYXRlID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgLy8gc3luY0NoaWxkcmVuU3RhdHVzKCk7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIG5leHRUaWNrKCgpID0+IHtcclxuICAgICAgbm9kZS52YWx1ZS5zZWxlY3RlZCA9IHY7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgZW1pdCgnY2hhbmdlJywgdik7XHJcbiAgZW1pdCgnaW5wdXQnLCB2KTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2hpbGRDaGFuZ2VkKHY6IGJvb2xlYW4pIHtcclxuICBpZiAoaXNMZWFmLnZhbHVlIHx8IHN0b3BXYXRjaC52YWx1ZSkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBpZiAoIWNoaWxkcmVuQ29tcG9uZW50cy52YWx1ZSkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBpZiAoY2hpbGRyZW5Db21wb25lbnRzLnZhbHVlLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBzeW5jQ2hpbGRyZW5TdGF0dXMoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gc3luY0NoaWxkcmVuU3RhdHVzKCkge1xyXG4gIGlmIChpc0xlYWYudmFsdWUpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgbGV0IHNlbGVjdGVkQ291bnQgPSAwO1xyXG4gIGxldCB1bnNlbGVjdENvdW50ID0gMDtcclxuICBsZXQgaW5kZXRlcm1pbmF0ZUlubmVyID0gMDtcclxuICBjb25zdCBvbGRJbmRldGVybWluYXRlID0gaW5kZXRlcm1pbmF0ZS52YWx1ZTtcclxuICBjb25zdCBvbGRTZWxlY3RlZCA9IHNlbGVjdGVkLnZhbHVlO1xyXG4gIFxyXG4gIGZvciAoY29uc3QgY2hpbGQgb2YgZmxhdHRlbkNoaWxkcmVuKHByb3BzLm5vZGUuY2hpbGRyZW4pKSB7XHJcbiAgICBpZiAoY2hpbGQuc2VsZWN0ZWQpIHtcclxuICAgICAgc2VsZWN0ZWRDb3VudCsrO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdW5zZWxlY3RDb3VudCsrO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChjaGlsZC5pbmRldGVybWluYXRlKSB7XHJcbiAgICAgIGluZGV0ZXJtaW5hdGVJbm5lcisrO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gZm9yIChjb25zdCBjaGlsZENvbXBvbmVudCBvZiBjaGlsZHJlbkNvbXBvbmVudHMudmFsdWUpIHtcclxuICAvLyAgIGlmIChjaGlsZENvbXBvbmVudC5zZWxlY3RlZCkge1xyXG4gIC8vICAgICBjaGVja2VkKys7XHJcbiAgLy8gICB9IGVsc2Uge1xyXG4gIC8vICAgICB1bmNoZWNrZWQrKztcclxuICAvLyAgIH1cclxuICAvLyAgIGlmIChjaGlsZENvbXBvbmVudC5pbmRldGVybWluYXRlKSB7XHJcbiAgLy8gICAgIGluZGV0ZXJtaW5hdGVJbm5lcisrO1xyXG4gIC8vICAgfVxyXG4gIC8vIH1cclxuXHJcbiAgaWYgKChzZWxlY3RlZENvdW50ICE9PSAwICYmIHVuc2VsZWN0Q291bnQgIT09IDApIHx8IGluZGV0ZXJtaW5hdGVJbm5lciA+IDApIHtcclxuICAgIG5vZGUudmFsdWUuaW5kZXRlcm1pbmF0ZSA9IHRydWU7XHJcbiAgfSBlbHNlIHtcclxuICAgIG5vZGUudmFsdWUuc2VsZWN0ZWQgPSB1bnNlbGVjdENvdW50ID09PSAwO1xyXG4gICAgbm9kZS52YWx1ZS5pbmRldGVybWluYXRlID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBpZiAoXHJcbiAgICBzZWxlY3RlZC52YWx1ZSAhPT0gb2xkU2VsZWN0ZWRcclxuICAgIHx8IGluZGV0ZXJtaW5hdGUudmFsdWUgIT09IG9sZEluZGV0ZXJtaW5hdGVcclxuICApIHtcclxuICAgIGVtaXQoJ2NoYW5nZScsIHNlbGVjdGVkLnZhbHVlKTtcclxuICAgIGVtaXQoJ2lucHV0Jywgc2VsZWN0ZWQudmFsdWUpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gc3RvcFdhdGNoVGhlbihjYWxsYmFjazogKCkgPT4gYW55KSB7XHJcbiAgc3RvcFdhdGNoLnZhbHVlID0gdHJ1ZTtcclxuICBjYWxsYmFjaygpO1xyXG4gIHN0b3BXYXRjaC52YWx1ZSA9IGZhbHNlO1xyXG59XHJcblxyXG53YXRjaCgoKSA9PiBzZWxlY3RlZFZhbHVlcywgYXN5bmMgKCkgPT4ge1xyXG4gIGlmICghaXNCcmFuY2gudmFsdWUpIHtcclxuICAgIHVwZGF0ZVNlbGVjdGVkKCk7XHJcbiAgfVxyXG4gIGF3YWl0IG5leHRUaWNrKCk7XHJcblxyXG4gIHN5bmNDaGlsZHJlblN0YXR1cygpO1xyXG59LCB7IGRlZXA6IHRydWUgfSk7XHJcblxyXG53YXRjaChzZWxlY3RlZCwgKHYpID0+IHtcclxufSk7XHJcblxyXG51cGRhdGVTZWxlY3RlZCgpO1xyXG5cclxub25Nb3VudGVkKCgpID0+IHtcclxuICBzeW5jQ2hpbGRyZW5TdGF0dXMoKTtcclxufSk7XHJcblxyXG5kZWZpbmVFeHBvc2Uoe1xyXG4gIHNlbGVjdCxcclxuICBzZWxlY3RlZCxcclxuICBpbmRldGVybWluYXRlXHJcbn0pO1xyXG48L3NjcmlwdD5cclxuXHJcbjx0ZW1wbGF0ZT5cclxuICA8ZGl2IGNsYXNzPVwiYy10cmVlLWl0ZW1cIlxyXG4gICAgOmNsYXNzPVwiWyBpc0JyYW5jaCA/ICdjLXRyZWUtaXRlbS0tYnJhbmNoJyA6ICdjLXRyZWUtaXRlbS0tbGVhZicgXVwiPlxyXG4gICAgPGRpdiBjbGFzcz1cImQtZmxleCBjLXRyZWUtaXRlbV9fdGl0bGVcIlxyXG4gICAgICA6c3R5bGU9XCJ7ICdwYWRkaW5nLWxlZnQnOiBpbmRlbnRQeCArICdweCcgfVwiXHJcbiAgICAgIDpjbGFzcz1cIlsgaXNCcmFuY2ggPyAnYmctbGlnaHQgJyA6ICcnIF1cIj5cclxuICAgICAgPGRpdiBjbGFzcz1cInAtMiBtcy0yXCI+XHJcbiAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICA6dHlwZT1cIm11bHRpcGxlID8gJ2NoZWNrYm94JyA6ICdyYWRpbydcIlxyXG4gICAgICAgICAgY2xhc3M9XCJmb3JtLWNoZWNrLWlucHV0XCJcclxuICAgICAgICAgIHYtaWY9XCJpc0xlYWYgfHwgKGJyYW5jaFNlbGVjdGFibGUgJiYgbXVsdGlwbGUpXCJcclxuICAgICAgICAgIDppZD1cImlkICsgJ19faXRlbS0nICsgdmFsdWVHZXR0ZXIobm9kZS52YWx1ZSlcIlxyXG4gICAgICAgICAgdi1tb2RlbD1cInNlbGVjdGVkXCJcclxuICAgICAgICAgIDp2YWx1ZT1cInRydWVcIlxyXG4gICAgICAgICAgOnVuY2hlY2tlZC12YWx1ZT1cImZhbHNlXCJcclxuICAgICAgICAgIDppbmRldGVybWluYXRlLnN5bmM9XCJpbmRldGVybWluYXRlXCJcclxuICAgICAgICAgIEBjaGFuZ2U9XCJjaGVja2JveENoYW5nZWQoKCRldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkuY2hlY2tlZClcIlxyXG4gICAgICAgIC8+XHJcbiAgICAgICAgPGlucHV0IHYtZWxzZVxyXG4gICAgICAgICAgOnR5cGU9XCJtdWx0aXBsZSA/ICdjaGVja2JveCcgOiAncmFkaW8nXCJcclxuICAgICAgICAgIGNsYXNzPVwiZm9ybS1jaGVjay1pbnB1dFwiXHJcbiAgICAgICAgICBkaXNhYmxlZFxyXG4gICAgICAgICAgOmNoZWNrZWQ9XCJpbmRldGVybWluYXRlXCIgOmluZGV0ZXJtaW5hdGUuc3luYz1cImluZGV0ZXJtaW5hdGVcIiAvPlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGEgY2xhc3M9XCJjLXRyZWUtaXRlbV9fdGV4dCBkLWZsZXggYWxpZ24taXRlbXMtY2VudGVyIGZsZXgtZ3Jvdy0xIHB5LTIgdGV4dC1kZWNvcmF0aW9uLW5vbmVcIlxyXG4gICAgICAgIHN0eWxlPVwiY3Vyc29yOiBwb2ludGVyO1wiXHJcbiAgICAgICAgOmRhdGEtbGV2ZWw9XCJsZXZlbFwiXHJcbiAgICAgICAgZGF0YS1icy10b2dnbGU9XCJjb2xsYXBzZVwiXHJcbiAgICAgICAgQGNsaWNrLnByZXZlbnQ9XCJpc0xlYWYgPyBzZWxlY3QoIXNlbGVjdGVkKSA6IG9wZW4gPSAhb3BlblwiPlxyXG4gICAgICAgIDxzcGFuIGNsYXNzPVwibWUtMiBmYVwiIDpjbGFzcz1cIlsgaXNMZWFmID8gJ2ZhLXRhZycgOiAnZmEtZm9sZGVyJyBdXCI+PC9zcGFuPlxyXG5cclxuICAgICAgICB7eyBub2RlLnZhbHVlLnRpdGxlIH19XHJcblxyXG4gICAgICAgIDxzcGFuIHYtaWY9XCJpc0JyYW5jaFwiIGNsYXNzPVwibXMtYXV0byBtZS0zXCI+XHJcbiAgICAgICAgICA8c3BhbiA6Y2xhc3M9XCJbIG9wZW4gPyAnZmEgZmEtY2hldnJvbi11cCcgOiAnZmEgZmEtY2hldnJvbi1kb3duJyBdXCI+PC9zcGFuPlxyXG4gICAgICAgIDwvc3Bhbj5cclxuICAgICAgPC9hPlxyXG4gICAgPC9kaXY+XHJcblxyXG4gICAgPFZ1ZTNTbGlkZVVwRG93blxyXG4gICAgICB2LWlmPVwibm9kZS5jaGlsZHJlbi5sZW5ndGggPiAwXCJcclxuICAgICAgdi1tb2RlbD1cIm9wZW5cIlxyXG4gICAgICA6ZHVyYXRpb249XCIzMDBcIlxyXG4gICAgICBjbGFzcz1cImMtdHJlZS1pdGVtX19jaGlsZHJlblwiXHJcbiAgICA+XHJcbiAgICAgIDxUcmVlSXRlbSB2LWZvcj1cIihjaGlsZCwgaSkgb2Ygbm9kZS5jaGlsZHJlblwiXHJcbiAgICAgICAgOm5vZGU9XCJjaGlsZFwiXHJcbiAgICAgICAgOmtleT1cInZhbHVlR2V0dGVyKGNoaWxkLnZhbHVlKVwiXHJcbiAgICAgICAgOmxldmVsPVwibGV2ZWwgKyAxXCJcclxuICAgICAgICA6YnJhbmNoLXNlbGVjdGFibGU9XCJicmFuY2hTZWxlY3RhYmxlXCJcclxuICAgICAgICA6cmVmPVwic2V0Q2hpbGRyZW5Db21wb25lbnRcIlxyXG4gICAgICAgIEBjaGFuZ2U9XCJjaGlsZENoYW5nZWRcIlxyXG4gICAgICAvPlxyXG4gICAgPC9WdWUzU2xpZGVVcERvd24+XHJcbiAgPC9kaXY+XHJcbjwvdGVtcGxhdGU+XHJcblxyXG48c3R5bGUgc2NvcGVkIGxhbmc9XCJzY3NzXCI+XHJcbi5jLXRyZWUtaXRlbSB7XHJcbiAgJl9fdGl0bGUge1xyXG4gICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNkZGQ7XHJcbiAgfVxyXG5cclxuICBjdXJzb3I6IHBvaW50ZXI7XHJcbn1cclxuPC9zdHlsZT5cclxuIl0sIm5hbWVzIjpbImIiLCJDIiwiRSIsImgiLCJwIiwiVyIsIkYiLCJMIiwiayIsInNlbGVjdCJdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsU0FBUyxFQUFFLEdBQUc7QUFDWixTQUFPO0FBQUEsSUFDTCxRQUFRLEVBQUUsTUFBTTtBQUFBLElBQ2hCLE9BQU8sRUFBRSxNQUFNO0FBQUEsSUFDZixVQUFVLEVBQUUsTUFBTTtBQUFBLElBQ2xCLFlBQVksRUFBRSxNQUFNO0FBQUEsSUFDcEIsVUFBVSxFQUFFLE1BQU07QUFBQSxJQUNsQixZQUFZLEVBQUUsTUFBTTtBQUFBLElBQ3BCLGVBQWUsRUFBRSxNQUFNO0FBQUEsSUFDdkIsZ0JBQWdCLEVBQUUsTUFBTTtBQUFBLElBQ3hCLG1CQUFtQixFQUFFLE1BQU07QUFBQSxJQUMzQixXQUFXLEVBQUUsTUFBTTtBQUFBLElBQ25CLGNBQWMsRUFBRSxNQUFNO0FBQUEsRUFDMUI7QUFDQTtBQUNBLFNBQVMsRUFBRSxHQUFHLEdBQUcsR0FBRztBQUNsQixRQUFNLElBQUlBLE1BQUUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFDLElBQUssaUJBQWlCLENBQUM7QUFDakQsSUFBRSxNQUFNLFFBQVEsR0FBRyxFQUFFLE1BQU0sV0FBVyxZQUFZLEVBQUUsTUFBTSxhQUFhLFVBQVUsRUFBRSxNQUFNLFNBQVM7QUFDbEcs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
