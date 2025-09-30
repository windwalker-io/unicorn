import { _ as _sfc_main } from "./TreeItem.vue_vue_type_script_setup_true_lang.js";
import { createElementBlock, openBlock, normalizeClass, createElementVNode, createBlock, createCommentVNode, normalizeStyle, withDirectives, vModelDynamic, withModifiers, createTextVNode, toDisplayString, withCtx, Fragment, renderList } from "vue";
/* empty css                                                         */
import { _ as _export_sfc } from "./ModalTreeApp.js";
const _hoisted_1 = { class: "p-2 ms-2" };
const _hoisted_2 = ["type", "id", "indeterminate"];
const _hoisted_3 = ["type", "checked", "indeterminate"];
const _hoisted_4 = ["data-level"];
const _hoisted_5 = {
  key: 0,
  class: "ms-auto me-3"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["c-tree-item", [$setup.isBranch ? "c-tree-item--branch" : "c-tree-item--leaf"]])
  }, [
    createElementVNode("div", {
      class: normalizeClass(["d-flex c-tree-item__title", [$setup.isBranch ? "bg-light " : ""]]),
      style: normalizeStyle({ "padding-left": $setup.indentPx + "px" })
    }, [
      createElementVNode("div", _hoisted_1, [
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
        }, null, 40, _hoisted_2)), [
          [vModelDynamic, $setup.selected]
        ]) : (openBlock(), createElementBlock("input", {
          key: 1,
          type: $setup.multiple ? "checkbox" : "radio",
          class: "form-check-input",
          disabled: "",
          checked: $setup.indeterminate,
          indeterminate: $setup.indeterminate
        }, null, 8, _hoisted_3))
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
        $setup.isBranch ? (openBlock(), createElementBlock("span", _hoisted_5, [
          createElementVNode("span", {
            class: normalizeClass([$setup.open ? "fa fa-chevron-up" : "fa fa-chevron-down"])
          }, null, 2)
        ])) : createCommentVNode("", true)
      ], 8, _hoisted_4)
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
const TreeItem = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-8a4ae0be"], ["__file", "TreeItem.vue"]]);
export {
  TreeItem as T
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHJlZUl0ZW0uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy92dWUvY29tcG9uZW50cy9Nb2RhbFRyZWUvVHJlZUl0ZW0udnVlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQgc2V0dXAgbGFuZz1cInRzXCI+XHJcbmltcG9ydCB7IHR5cGUgQ29tcG9uZW50UHVibGljSW5zdGFuY2UsIHR5cGUgQ29tcHV0ZWRSZWYsIGNvbXB1dGVkLCBpbmplY3QsIG5leHRUaWNrLCBvbkJlZm9yZVVwZGF0ZSwgb25Nb3VudGVkLCByZWYsIHdhdGNoIH0gZnJvbSAndnVlJztcclxuaW1wb3J0IHsgVnVlM1NsaWRlVXBEb3duIH0gZnJvbSAndnVlMy1zbGlkZS11cC1kb3duJztcclxuaW1wb3J0IHsgVGl0bGVHZXR0ZXIsIFRyZWVOb2RlLCBWYWx1ZUdldHRlciB9IGZyb20gJy4uLy4uLy4uL3R5cGVzJztcclxuaW1wb3J0IHsgZmxhdHRlbkNoaWxkcmVuIH0gZnJvbSAnLi4vLi4vLi4vdXRpbGl0aWVzJztcclxuaW1wb3J0IFRyZWVJdGVtIGZyb20gJy4vVHJlZUl0ZW0udnVlJztcclxuXHJcbmNvbnN0IHByb3BzID0gd2l0aERlZmF1bHRzKFxyXG4gIGRlZmluZVByb3BzPHtcclxuICAgIG5vZGU6IFRyZWVOb2RlO1xyXG4gICAgbGV2ZWw/OiBudW1iZXI7XHJcbiAgICBicmFuY2hTZWxlY3RhYmxlPzogYm9vbGVhbjtcclxuICB9PigpLFxyXG4gIHtcclxuICAgIGxldmVsOiAxLFxyXG4gICAgYnJhbmNoU2VsZWN0YWJsZTogZmFsc2UsXHJcbiAgfVxyXG4pO1xyXG5cclxuY29uc3QgZW1pdCA9IGRlZmluZUVtaXRzPHtcclxuICBjaGFuZ2U6IFtjaGVja2VkOiBib29sZWFuXTtcclxuICBpbnB1dDogW2NoZWNrZWQ6IGJvb2xlYW5dO1xyXG59PigpO1xyXG5cclxuY29uc3Qgbm9kZSA9IHJlZjxUcmVlTm9kZT4ocHJvcHMubm9kZSk7XHJcbi8vIGNvbnN0IHNlbGVjdE5vZGUgPSBpbmplY3Q8KG5vZGU6IFRyZWVOb2RlLCBzZWxlY3Q6IGJvb2xlYW4pID0+IGFueT4oJ3NlbGVjdE5vZGUnKTtcclxuY29uc3Qgc2VsZWN0ZWRWYWx1ZXMgPSBpbmplY3Q8Q29tcHV0ZWRSZWY8KHN0cmluZyB8IG51bWJlcilbXT4+KCdzZWxlY3RlZFZhbHVlcycpO1xyXG5jb25zdCBpZCA9IGluamVjdCgnaWQnKTtcclxuY29uc3QgbXVsdGlwbGUgPSBpbmplY3QoJ211bHRpcGxlJyk7XHJcbmNvbnN0IHZhbHVlR2V0dGVyID0gaW5qZWN0PFZhbHVlR2V0dGVyPigndmFsdWVHZXR0ZXInKTtcclxuY29uc3QgdGl0bGVHZXR0ZXIgPSBpbmplY3Q8VGl0bGVHZXR0ZXI+KCd0aXRsZUdldHRlcicpO1xyXG5cclxuY29uc3Qgc2VsZWN0ZWQgPSByZWYoZmFsc2UpO1xyXG5jb25zdCBpbmRldGVybWluYXRlID0gY29tcHV0ZWQoKCkgPT4gISFwcm9wcy5ub2RlLmluZGV0ZXJtaW5hdGUpO1xyXG5jb25zdCBzdG9wV2F0Y2ggPSByZWYoZmFsc2UpO1xyXG5jb25zdCBvcGVuID0gcmVmKGZhbHNlKTtcclxuY29uc3QgY2hpbGRyZW5Db21wb25lbnRzID0gcmVmPENvbXBvbmVudFB1YmxpY0luc3RhbmNlPHR5cGVvZiBUcmVlSXRlbT5bXT4oW10pO1xyXG5cclxud2F0Y2goKCkgPT4gcHJvcHMubm9kZSwgKCkgPT4ge1xyXG4gIHNlbGVjdGVkLnZhbHVlID0gISFwcm9wcy5ub2RlLnNlbGVjdGVkO1xyXG59LCB7IGRlZXA6IHRydWUgfSk7XHJcblxyXG5mdW5jdGlvbiBzZXRDaGlsZHJlbkNvbXBvbmVudChjaGlsZDogQ29tcG9uZW50UHVibGljSW5zdGFuY2U8dHlwZW9mIFRyZWVJdGVtPikge1xyXG4gIGNoaWxkcmVuQ29tcG9uZW50cy52YWx1ZS5wdXNoKGNoaWxkKTtcclxufVxyXG5cclxub25CZWZvcmVVcGRhdGUoKCkgPT4ge1xyXG4gIGNoaWxkcmVuQ29tcG9uZW50cy52YWx1ZSA9IFtdO1xyXG59KTtcclxuXHJcbmNvbnN0IGluZGVudFB4ID0gY29tcHV0ZWQoKCkgPT4ge1xyXG4gIHJldHVybiAocHJvcHMubGV2ZWwgLSAxKSAqIDE1O1xyXG59KTtcclxuXHJcbmNvbnN0IGlzQnJhbmNoID0gY29tcHV0ZWQoKCkgPT4ge1xyXG4gIHJldHVybiBwcm9wcy5ub2RlLmNoaWxkcmVuLmxlbmd0aCA+IDA7XHJcbn0pO1xyXG5cclxuY29uc3QgaXNMZWFmID0gY29tcHV0ZWQoKCkgPT4ge1xyXG4gIHJldHVybiAhaXNCcmFuY2gudmFsdWU7XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gdXBkYXRlU2VsZWN0ZWQoKSB7XHJcbiAgaWYgKGlzQnJhbmNoLnZhbHVlKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICBub2RlLnZhbHVlLnNlbGVjdGVkID0gc2VsZWN0ZWRWYWx1ZXMudmFsdWUuaW5jbHVkZXModmFsdWVHZXR0ZXIocHJvcHMubm9kZS52YWx1ZSkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzZWxlY3Qoc2VsZWN0OiBib29sZWFuKSB7XHJcbiAgaWYgKHNlbGVjdGVkLnZhbHVlID09PSBzZWxlY3QpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIG5vZGUudmFsdWUuc2VsZWN0ZWQgPSBzZWxlY3Q7XHJcblxyXG4gIGNoZWNrYm94Q2hhbmdlZChzZWxlY3QpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjaGVja2JveENoYW5nZWQodjogYm9vbGVhbikge1xyXG4gIGlmIChpc0JyYW5jaC52YWx1ZSkge1xyXG4gICAgbm9kZS52YWx1ZS5zZWxlY3RlZCA9IHY7XHJcblxyXG4gICAgaWYgKG11bHRpcGxlKSB7XHJcbiAgICAgIHN0b3BXYXRjaFRoZW4oKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGZsYXRDaGlsZHJlbiA9IGZsYXR0ZW5DaGlsZHJlbihub2RlLnZhbHVlLmNoaWxkcmVuKTtcclxuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGZsYXRDaGlsZHJlbikge1xyXG4gICAgICAgICAgY2hpbGQuc2VsZWN0ZWQgPSB2O1xyXG4gICAgICAgICAgY2hpbGQuaW5kZXRlcm1pbmF0ZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIC8vIHN5bmNDaGlsZHJlblN0YXR1cygpO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICBuZXh0VGljaygoKSA9PiB7XHJcbiAgICAgIG5vZGUudmFsdWUuc2VsZWN0ZWQgPSB2O1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGVtaXQoJ2NoYW5nZScsIHYpO1xyXG4gIGVtaXQoJ2lucHV0Jywgdik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNoaWxkQ2hhbmdlZCh2OiBib29sZWFuKSB7XHJcbiAgaWYgKGlzTGVhZi52YWx1ZSB8fCBzdG9wV2F0Y2gudmFsdWUpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgaWYgKCFjaGlsZHJlbkNvbXBvbmVudHMudmFsdWUpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgaWYgKGNoaWxkcmVuQ29tcG9uZW50cy52YWx1ZS5sZW5ndGggPT09IDApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgc3luY0NoaWxkcmVuU3RhdHVzKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHN5bmNDaGlsZHJlblN0YXR1cygpIHtcclxuICBpZiAoaXNMZWFmLnZhbHVlKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIGxldCBzZWxlY3RlZENvdW50ID0gMDtcclxuICBsZXQgdW5zZWxlY3RDb3VudCA9IDA7XHJcbiAgbGV0IGluZGV0ZXJtaW5hdGVJbm5lciA9IDA7XHJcbiAgY29uc3Qgb2xkSW5kZXRlcm1pbmF0ZSA9IGluZGV0ZXJtaW5hdGUudmFsdWU7XHJcbiAgY29uc3Qgb2xkU2VsZWN0ZWQgPSBzZWxlY3RlZC52YWx1ZTtcclxuICBcclxuICBmb3IgKGNvbnN0IGNoaWxkIG9mIGZsYXR0ZW5DaGlsZHJlbihwcm9wcy5ub2RlLmNoaWxkcmVuKSkge1xyXG4gICAgaWYgKGNoaWxkLnNlbGVjdGVkKSB7XHJcbiAgICAgIHNlbGVjdGVkQ291bnQrKztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHVuc2VsZWN0Q291bnQrKztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoY2hpbGQuaW5kZXRlcm1pbmF0ZSkge1xyXG4gICAgICBpbmRldGVybWluYXRlSW5uZXIrKztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIGZvciAoY29uc3QgY2hpbGRDb21wb25lbnQgb2YgY2hpbGRyZW5Db21wb25lbnRzLnZhbHVlKSB7XHJcbiAgLy8gICBpZiAoY2hpbGRDb21wb25lbnQuc2VsZWN0ZWQpIHtcclxuICAvLyAgICAgY2hlY2tlZCsrO1xyXG4gIC8vICAgfSBlbHNlIHtcclxuICAvLyAgICAgdW5jaGVja2VkKys7XHJcbiAgLy8gICB9XHJcbiAgLy8gICBpZiAoY2hpbGRDb21wb25lbnQuaW5kZXRlcm1pbmF0ZSkge1xyXG4gIC8vICAgICBpbmRldGVybWluYXRlSW5uZXIrKztcclxuICAvLyAgIH1cclxuICAvLyB9XHJcblxyXG4gIGlmICgoc2VsZWN0ZWRDb3VudCAhPT0gMCAmJiB1bnNlbGVjdENvdW50ICE9PSAwKSB8fCBpbmRldGVybWluYXRlSW5uZXIgPiAwKSB7XHJcbiAgICBub2RlLnZhbHVlLmluZGV0ZXJtaW5hdGUgPSB0cnVlO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBub2RlLnZhbHVlLnNlbGVjdGVkID0gdW5zZWxlY3RDb3VudCA9PT0gMDtcclxuICAgIG5vZGUudmFsdWUuaW5kZXRlcm1pbmF0ZSA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgaWYgKFxyXG4gICAgc2VsZWN0ZWQudmFsdWUgIT09IG9sZFNlbGVjdGVkXHJcbiAgICB8fCBpbmRldGVybWluYXRlLnZhbHVlICE9PSBvbGRJbmRldGVybWluYXRlXHJcbiAgKSB7XHJcbiAgICBlbWl0KCdjaGFuZ2UnLCBzZWxlY3RlZC52YWx1ZSk7XHJcbiAgICBlbWl0KCdpbnB1dCcsIHNlbGVjdGVkLnZhbHVlKTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHN0b3BXYXRjaFRoZW4oY2FsbGJhY2s6ICgpID0+IGFueSkge1xyXG4gIHN0b3BXYXRjaC52YWx1ZSA9IHRydWU7XHJcbiAgY2FsbGJhY2soKTtcclxuICBzdG9wV2F0Y2gudmFsdWUgPSBmYWxzZTtcclxufVxyXG5cclxud2F0Y2goKCkgPT4gc2VsZWN0ZWRWYWx1ZXMsIGFzeW5jICgpID0+IHtcclxuICBpZiAoIWlzQnJhbmNoLnZhbHVlKSB7XHJcbiAgICB1cGRhdGVTZWxlY3RlZCgpO1xyXG4gIH1cclxuICBhd2FpdCBuZXh0VGljaygpO1xyXG5cclxuICBzeW5jQ2hpbGRyZW5TdGF0dXMoKTtcclxufSwgeyBkZWVwOiB0cnVlIH0pO1xyXG5cclxud2F0Y2goc2VsZWN0ZWQsICh2KSA9PiB7XHJcbn0pO1xyXG5cclxudXBkYXRlU2VsZWN0ZWQoKTtcclxuXHJcbm9uTW91bnRlZCgoKSA9PiB7XHJcbiAgc3luY0NoaWxkcmVuU3RhdHVzKCk7XHJcbn0pO1xyXG5cclxuZGVmaW5lRXhwb3NlKHtcclxuICBzZWxlY3QsXHJcbiAgc2VsZWN0ZWQsXHJcbiAgaW5kZXRlcm1pbmF0ZVxyXG59KTtcclxuPC9zY3JpcHQ+XHJcblxyXG48dGVtcGxhdGU+XHJcbiAgPGRpdiBjbGFzcz1cImMtdHJlZS1pdGVtXCJcclxuICAgIDpjbGFzcz1cIlsgaXNCcmFuY2ggPyAnYy10cmVlLWl0ZW0tLWJyYW5jaCcgOiAnYy10cmVlLWl0ZW0tLWxlYWYnIF1cIj5cclxuICAgIDxkaXYgY2xhc3M9XCJkLWZsZXggYy10cmVlLWl0ZW1fX3RpdGxlXCJcclxuICAgICAgOnN0eWxlPVwieyAncGFkZGluZy1sZWZ0JzogaW5kZW50UHggKyAncHgnIH1cIlxyXG4gICAgICA6Y2xhc3M9XCJbIGlzQnJhbmNoID8gJ2JnLWxpZ2h0ICcgOiAnJyBdXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJwLTIgbXMtMlwiPlxyXG4gICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgOnR5cGU9XCJtdWx0aXBsZSA/ICdjaGVja2JveCcgOiAncmFkaW8nXCJcclxuICAgICAgICAgIGNsYXNzPVwiZm9ybS1jaGVjay1pbnB1dFwiXHJcbiAgICAgICAgICB2LWlmPVwiaXNMZWFmIHx8IChicmFuY2hTZWxlY3RhYmxlICYmIG11bHRpcGxlKVwiXHJcbiAgICAgICAgICA6aWQ9XCJpZCArICdfX2l0ZW0tJyArIHZhbHVlR2V0dGVyKG5vZGUudmFsdWUpXCJcclxuICAgICAgICAgIHYtbW9kZWw9XCJzZWxlY3RlZFwiXHJcbiAgICAgICAgICA6dmFsdWU9XCJ0cnVlXCJcclxuICAgICAgICAgIDp1bmNoZWNrZWQtdmFsdWU9XCJmYWxzZVwiXHJcbiAgICAgICAgICA6aW5kZXRlcm1pbmF0ZS5zeW5jPVwiaW5kZXRlcm1pbmF0ZVwiXHJcbiAgICAgICAgICBAY2hhbmdlPVwiY2hlY2tib3hDaGFuZ2VkKCgkZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmNoZWNrZWQpXCJcclxuICAgICAgICAvPlxyXG4gICAgICAgIDxpbnB1dCB2LWVsc2VcclxuICAgICAgICAgIDp0eXBlPVwibXVsdGlwbGUgPyAnY2hlY2tib3gnIDogJ3JhZGlvJ1wiXHJcbiAgICAgICAgICBjbGFzcz1cImZvcm0tY2hlY2staW5wdXRcIlxyXG4gICAgICAgICAgZGlzYWJsZWRcclxuICAgICAgICAgIDpjaGVja2VkPVwiaW5kZXRlcm1pbmF0ZVwiIDppbmRldGVybWluYXRlLnN5bmM9XCJpbmRldGVybWluYXRlXCIgLz5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxhIGNsYXNzPVwiYy10cmVlLWl0ZW1fX3RleHQgZC1mbGV4IGFsaWduLWl0ZW1zLWNlbnRlciBmbGV4LWdyb3ctMSBweS0yIHRleHQtZGVjb3JhdGlvbi1ub25lXCJcclxuICAgICAgICBzdHlsZT1cImN1cnNvcjogcG9pbnRlcjtcIlxyXG4gICAgICAgIDpkYXRhLWxldmVsPVwibGV2ZWxcIlxyXG4gICAgICAgIGRhdGEtYnMtdG9nZ2xlPVwiY29sbGFwc2VcIlxyXG4gICAgICAgIEBjbGljay5wcmV2ZW50PVwiaXNMZWFmID8gc2VsZWN0KCFzZWxlY3RlZCkgOiBvcGVuID0gIW9wZW5cIj5cclxuICAgICAgICA8c3BhbiBjbGFzcz1cIm1lLTIgZmFcIiA6Y2xhc3M9XCJbIGlzTGVhZiA/ICdmYS10YWcnIDogJ2ZhLWZvbGRlcicgXVwiPjwvc3Bhbj5cclxuXHJcbiAgICAgICAge3sgbm9kZS52YWx1ZS50aXRsZSB9fVxyXG5cclxuICAgICAgICA8c3BhbiB2LWlmPVwiaXNCcmFuY2hcIiBjbGFzcz1cIm1zLWF1dG8gbWUtM1wiPlxyXG4gICAgICAgICAgPHNwYW4gOmNsYXNzPVwiWyBvcGVuID8gJ2ZhIGZhLWNoZXZyb24tdXAnIDogJ2ZhIGZhLWNoZXZyb24tZG93bicgXVwiPjwvc3Bhbj5cclxuICAgICAgICA8L3NwYW4+XHJcbiAgICAgIDwvYT5cclxuICAgIDwvZGl2PlxyXG5cclxuICAgIDxWdWUzU2xpZGVVcERvd25cclxuICAgICAgdi1pZj1cIm5vZGUuY2hpbGRyZW4ubGVuZ3RoID4gMFwiXHJcbiAgICAgIHYtbW9kZWw9XCJvcGVuXCJcclxuICAgICAgOmR1cmF0aW9uPVwiMzAwXCJcclxuICAgICAgY2xhc3M9XCJjLXRyZWUtaXRlbV9fY2hpbGRyZW5cIlxyXG4gICAgPlxyXG4gICAgICA8VHJlZUl0ZW0gdi1mb3I9XCIoY2hpbGQsIGkpIG9mIG5vZGUuY2hpbGRyZW5cIlxyXG4gICAgICAgIDpub2RlPVwiY2hpbGRcIlxyXG4gICAgICAgIDprZXk9XCJ2YWx1ZUdldHRlcihjaGlsZC52YWx1ZSlcIlxyXG4gICAgICAgIDpsZXZlbD1cImxldmVsICsgMVwiXHJcbiAgICAgICAgOmJyYW5jaC1zZWxlY3RhYmxlPVwiYnJhbmNoU2VsZWN0YWJsZVwiXHJcbiAgICAgICAgOnJlZj1cInNldENoaWxkcmVuQ29tcG9uZW50XCJcclxuICAgICAgICBAY2hhbmdlPVwiY2hpbGRDaGFuZ2VkXCJcclxuICAgICAgLz5cclxuICAgIDwvVnVlM1NsaWRlVXBEb3duPlxyXG4gIDwvZGl2PlxyXG48L3RlbXBsYXRlPlxyXG5cclxuPHN0eWxlIHNjb3BlZCBsYW5nPVwic2Nzc1wiPlxyXG4uYy10cmVlLWl0ZW0ge1xyXG4gICZfX3RpdGxlIHtcclxuICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZGRkO1xyXG4gIH1cclxuXHJcbiAgY3Vyc29yOiBwb2ludGVyO1xyXG59XHJcbjwvc3R5bGU+XHJcbiJdLCJuYW1lcyI6WyJfY3JlYXRlRWxlbWVudEJsb2NrIiwiX25vcm1hbGl6ZUNsYXNzIiwiX2NyZWF0ZUVsZW1lbnRWTm9kZSIsIl9ub3JtYWxpemVTdHlsZSIsIl93aXRoRGlyZWN0aXZlcyIsIl9vcGVuQmxvY2siLCJfY3JlYXRlVGV4dFZOb2RlIiwiX3RvRGlzcGxheVN0cmluZyIsIl9jcmVhdGVCbG9jayIsIl9GcmFnbWVudCIsIl9yZW5kZXJMaXN0Il0sIm1hcHBpbmdzIjoiOzs7O0FBME1XLE1BQUEsYUFBQSxFQUFBLE9BQU0sV0FBQTs7Ozs7O0VBMkJhLE9BQU07OztzQkFoQ2xDQSxtQkFxRE0sT0FBQTtBQUFBLElBckRELE9BQUtDLGVBQUEsQ0FBQyxlQUFhLENBQ1osT0FBQSxXQUFRLHdCQUFBLG1CQUFBLENBQUEsQ0FBQTtBQUFBLEVBQUEsR0FBQTtBQUFBLElBQ2xCQyxtQkFrQ00sT0FBQTtBQUFBLE1BbENELE9BQUtELGVBQUEsQ0FBQyw2QkFBMkIsQ0FFMUIsT0FBQSxXQUFRLGNBQUEsRUFBQSxDQUFBLENBQUE7QUFBQSxNQURqQixPQUFLRSxpQ0FBb0IsT0FBQSxXQUFRLEtBQUEsQ0FBQTtBQUFBLElBQUEsR0FBQTtBQUFBLE1BRWxDRCxtQkFpQk0sT0FqQk4sWUFpQk07QUFBQSxRQWJJLE9BQUEsVUFBVyxPQUFBLG9CQUFvQixPQUFBLFdBQUFFLGdCQUFBQyxVQUFBLEdBSHZDTCxtQkFVRSxTQUFBO0FBQUEsVUFBQSxLQUFBO0FBQUEsVUFUQyxNQUFNLE9BQUEsV0FBUSxhQUFBO0FBQUEsVUFDZixPQUFNO0FBQUEsVUFFTCxJQUFJLE9BQUEsS0FBRSxZQUFlLE9BQUEsWUFBWSxZQUFLLEtBQUs7QUFBQSxVQUFBLHVCQUFBLE9BQUEsQ0FBQSxNQUFBLE9BQUEsQ0FBQSxJQUFBLENBQUEsV0FDbkMsT0FBQSxXQUFRO0FBQUEsVUFDaEIsT0FBTztBQUFBLFVBQ1AsbUJBQWlCO0FBQUEsVUFDakIsZUFBb0IsT0FBQTtBQUFBLFVBQ3BCLFVBQU0sT0FBQSxDQUFBLE1BQUEsT0FBQSxDQUFBLElBQUEsQ0FBQSxXQUFFLE9BQUEsZ0JBQWlCLE9BQU8sT0FBNEIsT0FBTztBQUFBLFFBQUEsR0FBQSxNQUFBLElBQUEsVUFBQSxJQUFBO0FBQUEsMEJBSjNELE9BQUEsUUFBUTtBQUFBLFFBQUEsQ0FBQSxLQUFBSyxVQUFBLEdBTW5CTCxtQkFJaUUsU0FBQTtBQUFBLFVBQUEsS0FBQTtBQUFBLFVBSDlELE1BQU0sT0FBQSxXQUFRLGFBQUE7QUFBQSxVQUNmLE9BQU07QUFBQSxVQUNOLFVBQUE7QUFBQSxVQUNDLFNBQVMsT0FBQTtBQUFBLFVBQWdCLGVBQW9CLE9BQUE7QUFBQSxRQUFBLEdBQUEsTUFBQSxHQUFBLFVBQUE7QUFBQTtNQUVsREUsbUJBWUksS0FBQTtBQUFBLFFBWkQsT0FBTTtBQUFBLFFBQ1AsT0FBQSxFQUFBLFVBQUEsVUFBQTtBQUFBLFFBQ0MsY0FBWSxPQUFBO0FBQUEsUUFDYixrQkFBZTtBQUFBLFFBQ2QsU0FBSyxvREFBVSxPQUFBLFNBQVMsT0FBQSxPQUFNLENBQUUsT0FBQSxRQUFRLElBQUksT0FBQSxPQUFJLENBQUksT0FBQSxNQUFJLENBQUEsU0FBQSxDQUFBO0FBQUEsTUFBQSxHQUFBO0FBQUEsUUFDekRBLG1CQUEwRSxRQUFBO0FBQUEsVUFBcEUsT0FBS0QsZUFBQSxDQUFDLFdBQVMsQ0FBVyxPQUFBLFNBQU0sV0FBQSxXQUFBLENBQUEsQ0FBQTtBQUFBLFFBQUEsR0FBQSxNQUFBLENBQUE7QUFBQSxRQUFvQ0ssZ0JBQUEsTUFFMUVDLGdCQUFHLE9BQUEsS0FBSyxNQUFNLEtBQUssSUFBRyxLQUV0QixDQUFBO0FBQUEsUUFBWSxPQUFBLFlBQUFGLFVBQUEsR0FBWkwsbUJBRU8sUUFGUCxZQUVPO0FBQUEsVUFETEUsbUJBQTJFLFFBQUE7QUFBQSxZQUFwRSxPQUFLRCxnQkFBSSxPQUFBLE9BQUkscUJBQUEsb0JBQUEsQ0FBQTtBQUFBLFVBQUEsR0FBQSxNQUFBLENBQUE7QUFBQTs7O0lBTWxCLE9BQUEsS0FBSyxTQUFTLFNBQU0sS0FBQUksVUFBQSxHQUQ1QkcsWUFja0IsT0FBQSxpQkFBQSxHQUFBO0FBQUEsTUFBQSxLQUFBO0FBQUEsTUFaUCxZQUFBLE9BQUE7QUFBQSxNQUFBLHVCQUFBLE9BQUEsQ0FBQSxNQUFBLE9BQUEsQ0FBQSxJQUFBLENBQUEsV0FBQSxPQUFBLE9BQUk7QUFBQSxNQUNaLFVBQVU7QUFBQSxNQUNYLE9BQU07QUFBQSxJQUFBLEdBQUE7QUFBQSx1QkFFSSxNQUFtQztBQUFBLFNBQUFILFVBQUEsSUFBQSxHQUE3Q0wsbUJBT0VTLFVBQUEsTUFBQUMsV0FQNkIsT0FBQSxLQUFLLFVBQVEsQ0FBMUIsT0FBTyxNQUFDOzhCQUExQkYsWUFPRSxPQUFBLFVBQUEsR0FBQTtBQUFBLFlBTkMsTUFBTTtBQUFBLFlBQ04sS0FBSyxPQUFBLFlBQVksTUFBTSxLQUFLO0FBQUEsWUFDNUIsT0FBTyxPQUFBLFFBQUs7QUFBQSxZQUNaLHFCQUFtQixPQUFBO0FBQUEsWUFBQSxTQUFBO0FBQUEsWUFDbkIsS0FBSyxPQUFBO0FBQUEsWUFDTCxVQUFRLE9BQUE7QUFBQSxVQUFBLEdBQUEsTUFBQSxHQUFBLENBQUEsUUFBQSxTQUFBLG1CQUFBLENBQUE7QUFBQTs7Ozs7OzsifQ==
