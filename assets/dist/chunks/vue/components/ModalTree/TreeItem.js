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
const TreeItem = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-897596f4"], ["__file", "TreeItem.vue"]]);
export {
  TreeItem as T
};
