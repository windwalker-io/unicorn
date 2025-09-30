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
const ModalTreeApp = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-22fa7050"], ["__file", "ModalTreeApp.vue"]]);
export {
  ModalTreeApp as M,
  _export_sfc as _
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9kYWxUcmVlQXBwLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvdnVlL2NvbXBvbmVudHMvTW9kYWxUcmVlL01vZGFsVHJlZUFwcC52dWUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdCBsYW5nPVwidHNcIiBzZXR1cD5cclxuaW1wb3J0IHsgY2xvbmVEZWVwIH0gZnJvbSAnbG9kYXNoLWVzJztcclxuaW1wb3J0IHsgY29tcHV0ZWQsIHByb3ZpZGUsIHJlZiwgd2F0Y2ggfSBmcm9tICd2dWUnO1xyXG5pbXBvcnQgeyBmb3JjZUFycmF5IH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZSc7XHJcbmltcG9ydCB7XHJcbiAgVmFsdWVHZXR0ZXIsXHJcbiAgTW9kYWxUcmVlU291cmNlLFxyXG4gIFRpdGxlR2V0dGVyLFxyXG4gIFRyZWVOb2RlLFxyXG4gIFNlYXJjaE1hdGNoZXIsXHJcbiAgTWF5YmVBcnJheSxcclxuICBNYXliZVByb21pc2VcclxufSBmcm9tICcuLi8uLi8uLi90eXBlcyc7XHJcbmltcG9ydCBUcmVlTW9kYWwgZnJvbSAnLi9UcmVlTW9kYWwudnVlJztcclxuXHJcbmNvbnN0IHByb3BzID0gd2l0aERlZmF1bHRzKFxyXG4gIGRlZmluZVByb3BzPHtcclxuICAgIGlkPzogc3RyaW5nO1xyXG4gICAgbmFtZT86IHN0cmluZztcclxuICAgIHRpdGxlPzogc3RyaW5nO1xyXG4gICAgZGlzYWJsZWQ/OiBib29sZWFuO1xyXG4gICAgcmVhZG9ubHk/OiBib29sZWFuO1xyXG4gICAgdmFsdWU/OiBNYXliZUFycmF5PHN0cmluZyB8IG51bWJlcj47XHJcbiAgICBzb3VyY2U/OiBNb2RhbFRyZWVTb3VyY2U7XHJcbiAgICBpdGVtcz86IE1heWJlQXJyYXk8VHJlZU5vZGU+IHwgKCgpID0+IE1heWJlUHJvbWlzZTxNYXliZUFycmF5PFRyZWVOb2RlPj4pO1xyXG4gICAgdmFsdWVHZXR0ZXI/OiBWYWx1ZUdldHRlcjtcclxuICAgIHRpdGxlR2V0dGVyPzogVGl0bGVHZXR0ZXI7XHJcbiAgICBzZWFyY2hNYXRjaGVyPzogU2VhcmNoTWF0Y2hlcjtcclxuICAgIG1vZGFsVGl0bGU/OiBzdHJpbmc7XHJcbiAgICB2ZXJ0aWNhbD86IGJvb2xlYW47XHJcbiAgICBicmFuY2hTZWxlY3RhYmxlPzogYm9vbGVhbjtcclxuICAgIHNlbGVjdEFsbENoaWxkcmVuPzogYm9vbGVhbjtcclxuICAgIHBsYWNlaG9sZGVyPzogc3RyaW5nO1xyXG4gICAgbXVsdGlwbGU/OiBib29sZWFuO1xyXG4gICAgYnV0dG9uVGV4dD86IHN0cmluZztcclxuICAgIGl0ZW1DbGFzcz86IHN0cmluZztcclxuICAgIHNlYXJjaFRleHQ/OiBzdHJpbmc7XHJcbiAgfT4oKSxcclxuICB7XHJcbiAgICBicmFuY2hTZWxlY3RhYmxlOiBmYWxzZSxcclxuICAgIHNlbGVjdEFsbENoaWxkcmVuOiBmYWxzZSxcclxuICAgIHBsYWNlaG9sZGVyOiAnLSBObyBzZWxlY3RlZCAtJyxcclxuICAgIG11bHRpcGxlOiBmYWxzZSxcclxuICAgIGJ1dHRvblRleHQ6ICdTZWxlY3QnLFxyXG4gICAgaXRlbUNsYXNzOiAnYmFkZ2UgYmctcHJpbWFyeSBiYWRnZS1waWxsJyxcclxuICAgIHNlYXJjaFRleHQ6ICdTZWFyY2gnLFxyXG4gICAgdmFsdWVHZXR0ZXI6IChpdGVtOiBhbnkpID0+IGl0ZW0uaWQsXHJcbiAgICB0aXRsZUdldHRlcjogKGl0ZW06IGFueSkgPT4gaXRlbS50aXRsZSxcclxuICB9XHJcbik7XHJcblxyXG5wcm92aWRlKCdpZCcsIHByb3BzLmlkKTtcclxucHJvdmlkZSgnbmFtZScsIHByb3BzLm5hbWUpO1xyXG5wcm92aWRlKCdtdWx0aXBsZScsIHByb3BzLm11bHRpcGxlKTtcclxucHJvdmlkZSgndmFsdWVHZXR0ZXInLCBwcm9wcy52YWx1ZUdldHRlcik7XHJcbnByb3ZpZGUoJ3RpdGxlR2V0dGVyJywgcHJvcHMudGl0bGVHZXR0ZXIpO1xyXG5wcm92aWRlKCdzZWFyY2hNYXRjaGVyJywgcHJvcHMuc2VhcmNoTWF0Y2hlciA/PyBkZWZhdWx0U2VhcmNoTWF0Y2hlcik7XHJcblxyXG5mdW5jdGlvbiBkZWZhdWx0U2VhcmNoTWF0Y2hlcihpdGVtOiBhbnksIHE6IHN0cmluZykge1xyXG4gIHJldHVybiBwcm9wcy50aXRsZUdldHRlcihpdGVtKS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHEudG9Mb3dlckNhc2UoKSk7XHJcbn1cclxuXHJcbmNvbnN0IHNlbGVjdGVkID0gcmVmPFRyZWVOb2RlW10+KFtdKTtcclxuY29uc3QgdmFsdWUgPSByZWY8KHN0cmluZ3xudW1iZXIpW10+KGZvcmNlQXJyYXkocHJvcHMudmFsdWUpKTtcclxuXHJcbi8vIE1vZGFsXHJcbmNvbnN0IHRyZWVNb2RhbE9wZW4gPSByZWYoZmFsc2UpO1xyXG5cclxuZnVuY3Rpb24gb3BlblNlbGVjdG9yKCkge1xyXG4gIHRyZWVNb2RhbE9wZW4udmFsdWUgPSB0cnVlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkZWxldGVJdGVtKGk6IG51bWJlciwgbm9kZTogVHJlZU5vZGUpIHtcclxuICBzZWxlY3RlZC52YWx1ZSA9IHNlbGVjdGVkLnZhbHVlLmZpbHRlcigoaXQ6IFRyZWVOb2RlKSA9PiBwcm9wcy52YWx1ZUdldHRlcihpdC52YWx1ZSkgIT09IHByb3BzLnZhbHVlR2V0dGVyKG5vZGUudmFsdWUpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlU2VsZWN0ZWQoaXRlbXM6IGFueVtdKSB7XHJcbiAgc2VsZWN0ZWQudmFsdWUgPSBjbG9uZURlZXAoaXRlbXMpO1xyXG59XHJcblxyXG53YXRjaCgoKSA9PiBwcm9wcy5pdGVtcywgYXN5bmMgKHYpID0+IHtcclxuICBpZiAodHlwZW9mIHYgPT09ICdmdW5jdGlvbicpIHtcclxuICAgIHYgPSBhd2FpdCB2KCk7XHJcbiAgfVxyXG5cclxuICBzZWxlY3RlZC52YWx1ZSA9IGZvcmNlQXJyYXkodikuZmlsdGVyKChub2RlOiBUcmVlTm9kZSkgPT4ge1xyXG4gICAgcmV0dXJuIHZhbHVlLnZhbHVlLmluY2x1ZGVzKHByb3BzLnZhbHVlR2V0dGVyKG5vZGUudmFsdWUpKTtcclxuICB9KTtcclxufSwgeyBpbW1lZGlhdGU6IHRydWUgfSk7XHJcblxyXG5jb25zdCBzZWxlY3RlZFZhbHVlcyA9IGNvbXB1dGVkKCgpID0+IHtcclxuICByZXR1cm4gc2VsZWN0ZWQudmFsdWUubWFwKG5vZGUgPT4gcHJvcHMudmFsdWVHZXR0ZXIobm9kZS52YWx1ZSkpO1xyXG59KTtcclxuXHJcbmNvbnN0IGNhbk1vZGlmeSA9IGNvbXB1dGVkKCgpID0+IHtcclxuICByZXR1cm4gIXByb3BzLnJlYWRvbmx5ICYmICFwcm9wcy5kaXNhYmxlZDtcclxufSk7XHJcblxyXG48L3NjcmlwdD5cclxuXHJcbjx0ZW1wbGF0ZT5cclxuICA8ZGl2IGNsYXNzPVwiYy1tb2RhbC10cmVlXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwiYy1tb2RhbC10cmVlX19jb250YWluZXIgcC0yIGQtZmxleCBmbGV4LWNvbHVtblwiXHJcbiAgICAgIDpjbGFzcz1cIlsgdmVydGljYWwgPyAnJyA6ICdmbGV4LW1kLXJvdycgXVwiPlxyXG4gICAgICA8ZGl2IHYtaWY9XCJjYW5Nb2RpZnlcIiBjbGFzcz1cIm1lLTIgbWItMlwiXHJcbiAgICAgICAgOmNsYXNzPVwieyAnbWItbWQtMCc6ICF2ZXJ0aWNhbCB9XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiPlxyXG4gICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tc2Vjb25kYXJ5IGJ0bi1zbSBidG4tcm91bmRlZCB0ZXh0LW5vd3JhcFwiIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICBAY2xpY2s9XCJvcGVuU2VsZWN0b3JcIj5cclxuICAgICAgICAgICAge3sgYnV0dG9uVGV4dCB9fVxyXG4gICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1zZWNvbmRhcnkgYnRuLXNtIGJ0bi1yb3VuZGVkXCIgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgIEBjbGljaz1cInNlbGVjdGVkID0gW11cIj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJmYSBmYS10aW1lc1wiPjwvc3Bhbj5cclxuICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxkaXYgdi1pZj1cInNlbGVjdGVkLmxlbmd0aCA+IDBcIj5cclxuICAgICAgICA8VHJhbnNpdGlvbkdyb3VwIG5hbWU9XCJmYWRlXCI+XHJcbiAgICAgICAgICA8c3BhbiB2LWZvcj1cIihub2RlLCBpKSBvZiBzZWxlY3RlZFwiXHJcbiAgICAgICAgICAgIGNsYXNzPVwibWUtMiBtYi0yIGMtaXRlbVwiXHJcbiAgICAgICAgICAgIDpjbGFzcz1cIml0ZW1DbGFzc1wiXHJcbiAgICAgICAgICAgIDprZXk9XCJ2YWx1ZUdldHRlcihub2RlLnZhbHVlKVwiXHJcbiAgICAgICAgICAgIHN0eWxlPVwiYW5pbWF0aW9uLWR1cmF0aW9uOiAuM3NcIj5cclxuICAgICAgICAgICAgPHNwYW4+e3sgdGl0bGVHZXR0ZXIobm9kZS52YWx1ZSkgfX08L3NwYW4+XHJcbiAgICAgICAgICAgIDxzcGFuIHR5cGU9XCJidXR0b25cIiB2LWlmPVwiY2FuTW9kaWZ5XCJcclxuICAgICAgICAgICAgICBAY2xpY2sucHJldmVudD1cImRlbGV0ZUl0ZW0oaSwgbm9kZSlcIiBjbGFzcz1cIm1zLTJcIiBzdHlsZT1cImN1cnNvcjogcG9pbnRlclwiPlxyXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZmEgZmEtdGltZXNcIj48L3NwYW4+XHJcbiAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICA8L1RyYW5zaXRpb25Hcm91cD5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgdi1lbHNlIGNsYXNzPVwidGV4dC1tdXRlZFwiPlxyXG4gICAgICAgIHt7IHBsYWNlaG9sZGVyIH19XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcblxyXG4gICAgPHNlbGVjdCBtdWx0aXBsZVxyXG4gICAgICBzdHlsZT1cImRpc3BsYXk6IG5vbmU7XCJcclxuICAgICAgcmVmPVwiaW5wdXRcIlxyXG4gICAgICA6aWQ9XCJpZFwiXHJcbiAgICAgIDpuYW1lPVwibmFtZVwiXHJcbiAgICAgIDpkaXNhYmxlZD1cImRpc2FibGVkXCJcclxuICAgICAgOnJlYWRvbmx5PVwicmVhZG9ubHlcIlxyXG4gICAgICB2LWJpbmQ9XCIkYXR0cnNcIlxyXG4gICAgPlxyXG4gICAgICA8b3B0aW9uIHYtZm9yPVwiaWQgb2Ygc2VsZWN0ZWRWYWx1ZXNcIiA6dmFsdWU9XCJpZFwiIDpzZWxlY3RlZD1cInRydWVcIj57eyBpZCB9fTwvb3B0aW9uPlxyXG4gICAgPC9zZWxlY3Q+XHJcblxyXG4gICAgPFRyZWVNb2RhbFxyXG4gICAgICA6b3Blbj1cInRyZWVNb2RhbE9wZW5cIlxyXG4gICAgICBAaGlkZT1cInRyZWVNb2RhbE9wZW4gPSBmYWxzZVwiXHJcbiAgICAgIDppZD1cImlkXCJcclxuICAgICAgOnRpdGxlPVwibW9kYWxUaXRsZVwiXHJcbiAgICAgIDpzb3VyY2U9XCJzb3VyY2VcIlxyXG4gICAgICA6dmFsdWU9XCJzZWxlY3RlZFZhbHVlc1wiXHJcbiAgICAgIDpicmFuY2hTZWxlY3RhYmxlXHJcbiAgICAgIHYtYmluZD1cIiRhdHRyc1wiXHJcbiAgICAgIDpkaXNhYmxlZD1cImRpc2FibGVkXCJcclxuICAgICAgOnJlYWRvbmx5PVwicmVhZG9ubHlcIlxyXG4gICAgICA6c2VhcmNoLXRleHQ9XCJzZWFyY2hUZXh0XCJcclxuICAgICAgQHNlbGVjdGVkPVwiaGFuZGxlU2VsZWN0ZWRcIlxyXG4gICAgLz5cclxuICA8L2Rpdj5cclxuPC90ZW1wbGF0ZT5cclxuXHJcbjxzdHlsZSBzY29wZWQ+XHJcbi5jLWl0ZW0ge1xyXG4gIHBhZGRpbmctbGVmdDogLjc1cmVtO1xyXG4gIHBhZGRpbmctcmlnaHQ6IC43NXJlbTtcclxuICBwYWRkaW5nLXRvcDogLjVyZW07XHJcbiAgcGFkZGluZy1ib3R0b206IC41cmVtO1xyXG59XHJcbjwvc3R5bGU+XHJcbiJdLCJuYW1lcyI6WyJfb3BlbkJsb2NrIiwiX2NyZWF0ZUVsZW1lbnRCbG9jayIsIl9jcmVhdGVFbGVtZW50Vk5vZGUiLCJfbm9ybWFsaXplQ2xhc3MiLCJfdG9EaXNwbGF5U3RyaW5nIiwiX2NyZWF0ZVZOb2RlIiwiX1RyYW5zaXRpb25Hcm91cCIsIl93aXRoQ3R4IiwiX0ZyYWdtZW50IiwiX3JlbmRlckxpc3QiLCJfd2l0aE1vZGlmaWVycyIsIl9jcmVhdGVDb21tZW50Vk5vZGUiLCJfbWVyZ2VQcm9wcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQXFHTyxNQUFBLGFBQUEsRUFBQSxPQUFNLGVBQUE7QUFLQSxNQUFBLGFBQUEsRUFBQSxPQUFNLFlBQUE7Ozs7O0VBMkJELE9BQU07Ozs7O0FBaEN0QixTQUFBQSxVQUFBLEdBQUFDLG1CQStETSxPQS9ETixZQStETTtBQUFBLElBOURKQyxtQkFrQ00sT0FBQTtBQUFBLE1BbENELE9BQUtDLGVBQUEsQ0FBQyxrREFBZ0QsQ0FDL0MsT0FBQSxXQUFRLEtBQUEsYUFBQSxDQUFBLENBQUE7QUFBQSxJQUFBLEdBQUE7QUFBQSxNQUNQLE9BQUEsYUFBQUgsYUFBWEMsbUJBWU0sT0FBQTtBQUFBLFFBQUEsS0FBQTtBQUFBLFFBWmdCLE9BQUtFLGVBQUEsQ0FBQyxhQUFXLEVBQUEsV0FBQSxDQUNmLE9BQUEsVUFBUSxDQUFBO0FBQUEsTUFBQSxHQUFBO0FBQUEsUUFDOUJELG1CQVNNLE9BVE4sWUFTTTtBQUFBLFVBUkpBLG1CQUdTLFVBQUE7QUFBQSxZQUhELE9BQU07QUFBQSxZQUFtRCxNQUFLO0FBQUEsWUFDbkUsU0FBTyxPQUFBO0FBQUEsVUFBQSxHQUFBRSxnQkFDTCxPQUFBLFVBQVUsR0FBQSxDQUFBO0FBQUEsVUFFZkYsbUJBR1MsVUFBQTtBQUFBLFlBSEQsT0FBTTtBQUFBLFlBQXVDLE1B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
