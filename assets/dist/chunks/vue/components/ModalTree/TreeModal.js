import { _ as _sfc_main } from "./TreeModal.vue_vue_type_script_setup_true_lang.js";
import { createElementBlock, openBlock, createElementVNode, toDisplayString, withDirectives, vModelText, Fragment, renderList, createBlock } from "vue";
import { _ as _export_sfc } from "./ModalTreeApp.js";
const _hoisted_1 = ["id"];
const _hoisted_2 = {
  class: "modal-dialog",
  role: "document"
};
const _hoisted_3 = { class: "modal-content" };
const _hoisted_4 = { class: "modal-header" };
const _hoisted_5 = ["id"];
const _hoisted_6 = { class: "modal-body p-0" };
const _hoisted_7 = { class: "std-form box-list m-3" };
const _hoisted_8 = { class: "form-group" };
const _hoisted_9 = ["placeholder"];
const _hoisted_10 = {
  key: 0,
  class: "box-list__items"
};
const _hoisted_11 = { key: 1 };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    ref: "modal",
    class: "modal fade",
    id: `${$props.id}__modal`,
    tabindex: "-1",
    role: "dialog",
    "aria-labelledby": "-modal-label",
    "aria-hidden": "true"
  }, [
    createElementVNode("div", _hoisted_2, [
      createElementVNode("div", _hoisted_3, [
        createElementVNode("div", _hoisted_4, [
          createElementVNode("h4", {
            class: "modal-title",
            id: `${$props.id}__modal-label`
          }, toDisplayString($props.title), 9, _hoisted_5),
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
        createElementVNode("div", _hoisted_6, [
          createElementVNode("div", _hoisted_7, [
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
  ], 8, _hoisted_1);
}
const TreeModal = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "TreeModal.vue"]]);
export {
  TreeModal as T
};
