import { _ as _sfc_main } from "./ModalTreeApp.vue_vue_type_script_setup_true_lang.js";
import { createElementBlock, openBlock, createElementVNode, createVNode, normalizeClass, createCommentVNode, toDisplayString, TransitionGroup, withCtx, Fragment, renderList, withModifiers, mergeProps } from "vue";
/* empty css                                                             */
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
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
export {
  ModalTreeApp as M,
  _export_sfc as _
};
