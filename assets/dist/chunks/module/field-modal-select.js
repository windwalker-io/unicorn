import { d as data } from "../data.js";
import { h as highlight, s as slideUp } from "../service/ui.js";
import { e as template } from "../composable/useQueue.js";
import { s as selectOne, c as html } from "../service/dom.js";
import { _ as __ } from "../service/lang.js";
function createCallback(type, selector, modalSelector) {
  switch (type) {
    // case 'tag':
    //   return () => {
    //
    //   };
    case "list":
      return (item) => {
        const modalList = document.querySelector(selector);
        if (!modalList.querySelector(`[data-value="${item.value}"]`)) {
          modalList.appendItem(item, true);
          selectOne(modalSelector)?.close();
        } else {
          alert(__("unicorn.field.modal.already.selected"));
        }
      };
    case "single":
    default:
      return (item) => {
        const element = document.querySelector(selector);
        const image = element.querySelector("[data-role=image]");
        const title = element.querySelector("[data-role=title]");
        const store = element.querySelector("[data-role=value]");
        if (image && item.image) {
          image.style.backgroundImage = `url(${item.image});`;
        }
        title.value = item.title || "";
        store.value = item.value || "";
        store.dispatchEvent(new CustomEvent("change"));
        selectOne(modalSelector)?.close();
        highlight(title);
      };
  }
}
class ModalListSelectElement extends HTMLElement {
  static is = "uni-modal-list";
  itemTemplate;
  options;
  get listContainer() {
    return this.querySelector("[data-role=list-container]");
  }
  get modal() {
    return document.querySelector(this.options.modalSelector);
  }
  get items() {
    return Array.from(this.listContainer.children);
  }
  connectedCallback() {
    this.options = JSON.parse(this.getAttribute("options") || "{}");
    this.itemTemplate = template(document.querySelector(this.options.itemTemplate).innerHTML);
    const emptyInput = this.querySelector("[data-role=empty]");
    if (emptyInput) {
      emptyInput.name = emptyInput.dataset.name || "";
    }
    if (this.options.sortable) {
      import("sortablejs").then(({ default: Sortable }) => {
        new Sortable(this.listContainer, { handle: ".h-drag-handle", animation: 150 });
      });
    }
    const selectButton = this.querySelector("[data-role=select]");
    selectButton.addEventListener("click", (e) => {
      this.open(e);
    });
    this.querySelector("[data-role=clear]")?.addEventListener("click", () => {
      this.items.forEach((item) => {
        item.querySelector("[data-role=remove]")?.click();
      });
    });
    selectButton.style.pointerEvents = "";
    this.render();
  }
  render() {
    const items = data("unicorn.modal-field")[this.options.dataKey] || [];
    items.forEach((item) => {
      this.appendItem(item);
    });
  }
  appendItem(item, highlights = false) {
    const itemHtml = html(this.itemTemplate({ item }));
    itemHtml.dataset.value = item.value;
    itemHtml.querySelector("[data-role=remove]")?.addEventListener("click", () => {
      slideUp(itemHtml).then(() => {
        itemHtml.remove();
        this.toggleRequired();
      });
    });
    this.listContainer.appendChild(itemHtml);
    this.toggleRequired();
    if (highlights) {
      highlight(itemHtml);
    }
  }
  toggleRequired() {
    const placeholder = this.querySelector("[data-role=validation-placeholder]");
    if (placeholder) {
      placeholder.disabled = this.listContainer.children.length !== 0;
    }
  }
  open(event) {
    event.preventDefault();
    event.stopPropagation();
    const max = this.options.max;
    const target = event.target;
    if (!max) {
      this.modal?.open(target.href, { size: "modal-xl" });
      return;
    }
    if (this.listContainer.children.length >= max) {
      alert(
        __("unicorn.field.modal.max.selected", max)
      );
      return;
    }
    this.modal?.open(target.href, { size: "modal-xl" });
  }
}
/* @__PURE__ */ customElements.define(/* @__PURE__ */ (() => ModalListSelectElement.is)(), ModalListSelectElement);
export {
  createCallback
};
