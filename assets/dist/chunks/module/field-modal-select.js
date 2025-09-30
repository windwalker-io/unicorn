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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGQtbW9kYWwtc2VsZWN0LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbW9kdWxlL2ZpZWxkLW1vZGFsLXNlbGVjdC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IElGcmFtZU1vZGFsRWxlbWVudCB9IGZyb20gJy4vaWZyYW1lLW1vZGFsJztcclxuaW1wb3J0IHsgZGF0YSB9IGZyb20gJy4uL2RhdGEnO1xyXG5pbXBvcnQgeyBfXywgaGlnaGxpZ2h0LCBodG1sLCBzZWxlY3RPbmUsIHNsaWRlVXAgfSBmcm9tICcuLi9zZXJ2aWNlJztcclxuaW1wb3J0IHsgdGVtcGxhdGUgfSBmcm9tICdsb2Rhc2gtZXMnO1xyXG5cclxuZXhwb3J0IHR5cGUgTW9kYWxTZWxlY3RDYWxsYmFjayA9IChpdGVtOiBhbnkpID0+IHZvaWQ7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQ2FsbGJhY2sodHlwZTogJ2xpc3QnIHwgJ3NpbmdsZScsIHNlbGVjdG9yOiBzdHJpbmcsIG1vZGFsU2VsZWN0b3I6IHN0cmluZyk6IE1vZGFsU2VsZWN0Q2FsbGJhY2sge1xyXG4gIHN3aXRjaCAodHlwZSkge1xyXG4gICAgLy8gY2FzZSAndGFnJzpcclxuICAgIC8vICAgcmV0dXJuICgpID0+IHtcclxuICAgIC8vXHJcbiAgICAvLyAgIH07XHJcbiAgICBjYXNlICdsaXN0JzpcclxuICAgICAgcmV0dXJuIChpdGVtOiBhbnkpID0+IHtcclxuICAgICAgICBjb25zdCBtb2RhbExpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKSBhcyBhbnkgYXMgTW9kYWxMaXN0U2VsZWN0RWxlbWVudDtcclxuXHJcbiAgICAgICAgaWYgKCFtb2RhbExpc3QucXVlcnlTZWxlY3RvcihgW2RhdGEtdmFsdWU9XCIke2l0ZW0udmFsdWV9XCJdYCkpIHtcclxuICAgICAgICAgIG1vZGFsTGlzdC5hcHBlbmRJdGVtKGl0ZW0sIHRydWUpO1xyXG5cclxuICAgICAgICAgIHNlbGVjdE9uZTxJRnJhbWVNb2RhbEVsZW1lbnQ+KG1vZGFsU2VsZWN0b3IpPy5jbG9zZSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBhbGVydChfXygndW5pY29ybi5maWVsZC5tb2RhbC5hbHJlYWR5LnNlbGVjdGVkJykpO1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuXHJcbiAgICBjYXNlICdzaW5nbGUnOlxyXG4gICAgZGVmYXVsdDpcclxuICAgICAgcmV0dXJuIChpdGVtKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTERpdkVsZW1lbnQ+KHNlbGVjdG9yKSE7XHJcblxyXG4gICAgICAgIGNvbnN0IGltYWdlID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yPEhUTUxEaXZFbGVtZW50PignW2RhdGEtcm9sZT1pbWFnZV0nKSE7XHJcbiAgICAgICAgY29uc3QgdGl0bGUgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTElucHV0RWxlbWVudD4oJ1tkYXRhLXJvbGU9dGl0bGVdJykhO1xyXG4gICAgICAgIGNvbnN0IHN0b3JlID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yPEhUTUxJbnB1dEVsZW1lbnQ+KCdbZGF0YS1yb2xlPXZhbHVlXScpITtcclxuXHJcbiAgICAgICAgaWYgKGltYWdlICYmIGl0ZW0uaW1hZ2UpIHtcclxuICAgICAgICAgIGltYWdlLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoJHtpdGVtLmltYWdlfSk7YDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRpdGxlLnZhbHVlID0gaXRlbS50aXRsZSB8fCAnJztcclxuICAgICAgICBzdG9yZS52YWx1ZSA9IGl0ZW0udmFsdWUgfHwgJyc7XHJcblxyXG4gICAgICAgIHN0b3JlLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdjaGFuZ2UnKSk7XHJcblxyXG4gICAgICAgIHNlbGVjdE9uZTxJRnJhbWVNb2RhbEVsZW1lbnQ+KG1vZGFsU2VsZWN0b3IpPy5jbG9zZSgpO1xyXG5cclxuICAgICAgICBoaWdobGlnaHQodGl0bGUpO1xyXG4gICAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuaW50ZXJmYWNlIE1vZGFsTGlzdE9wdGlvbnMge1xyXG4gIG1vZGFsU2VsZWN0b3I6IHN0cmluZztcclxuICBpdGVtVGVtcGxhdGU6IHN0cmluZztcclxuICBzb3J0YWJsZTogYm9vbGVhbjtcclxuICBkYXRhS2V5OiBzdHJpbmc7XHJcbiAgbWF4OiBudW1iZXI7XHJcbn1cclxuXHJcbmNsYXNzIE1vZGFsTGlzdFNlbGVjdEVsZW1lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XHJcbiAgc3RhdGljIGlzID0gJ3VuaS1tb2RhbC1saXN0JztcclxuXHJcbiAgaXRlbVRlbXBsYXRlITogUmV0dXJuVHlwZTx0eXBlb2YgdGVtcGxhdGU+O1xyXG4gIG9wdGlvbnMhOiBNb2RhbExpc3RPcHRpb25zO1xyXG5cclxuICBnZXQgbGlzdENvbnRhaW5lcigpIHtcclxuICAgIHJldHVybiB0aGlzLnF1ZXJ5U2VsZWN0b3I8SFRNTERpdkVsZW1lbnQ+KCdbZGF0YS1yb2xlPWxpc3QtY29udGFpbmVyXScpITtcclxuICB9XHJcblxyXG4gIGdldCBtb2RhbCgpIHtcclxuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPElGcmFtZU1vZGFsRWxlbWVudD4odGhpcy5vcHRpb25zLm1vZGFsU2VsZWN0b3IpO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGl0ZW1zKCk6IEVsZW1lbnRbXSB7XHJcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLmxpc3RDb250YWluZXIuY2hpbGRyZW4pO1xyXG4gIH1cclxuXHJcbiAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XHJcbiAgICB0aGlzLm9wdGlvbnMgPSBKU09OLnBhcnNlKHRoaXMuZ2V0QXR0cmlidXRlKCdvcHRpb25zJykgfHwgJ3t9Jyk7XHJcbiAgICB0aGlzLml0ZW1UZW1wbGF0ZSA9IHRlbXBsYXRlKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5vcHRpb25zLml0ZW1UZW1wbGF0ZSkhLmlubmVySFRNTCk7XHJcblxyXG4gICAgY29uc3QgZW1wdHlJbnB1dCA9IHRoaXMucXVlcnlTZWxlY3RvcjxIVE1MSW5wdXRFbGVtZW50PignW2RhdGEtcm9sZT1lbXB0eV0nKTtcclxuXHJcbiAgICBpZiAoZW1wdHlJbnB1dCkge1xyXG4gICAgICBlbXB0eUlucHV0Lm5hbWUgPSBlbXB0eUlucHV0LmRhdGFzZXQubmFtZSB8fCAnJztcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5vcHRpb25zLnNvcnRhYmxlKSB7XHJcbiAgICAgIGltcG9ydCgnc29ydGFibGVqcycpLnRoZW4oKHsgZGVmYXVsdDogU29ydGFibGUgfSkgPT4ge1xyXG4gICAgICAgIG5ldyBTb3J0YWJsZSh0aGlzLmxpc3RDb250YWluZXIsIHsgaGFuZGxlOiAnLmgtZHJhZy1oYW5kbGUnLCBhbmltYXRpb246IDE1MCB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgc2VsZWN0QnV0dG9uID0gdGhpcy5xdWVyeVNlbGVjdG9yPEhUTUxCdXR0b25FbGVtZW50PignW2RhdGEtcm9sZT1zZWxlY3RdJykhO1xyXG4gICAgc2VsZWN0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgdGhpcy5vcGVuKGUpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5xdWVyeVNlbGVjdG9yKCdbZGF0YS1yb2xlPWNsZWFyXScpPy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgdGhpcy5pdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgICAgICAgaXRlbS5xdWVyeVNlbGVjdG9yPEhUTUxCdXR0b25FbGVtZW50PignW2RhdGEtcm9sZT1yZW1vdmVdJyk/LmNsaWNrKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgc2VsZWN0QnV0dG9uLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnJztcclxuXHJcbiAgICB0aGlzLnJlbmRlcigpO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgY29uc3QgaXRlbXM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IGRhdGEoJ3VuaWNvcm4ubW9kYWwtZmllbGQnKVt0aGlzLm9wdGlvbnMuZGF0YUtleV0gfHwgW107XHJcblxyXG4gICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICB0aGlzLmFwcGVuZEl0ZW0oaXRlbSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGFwcGVuZEl0ZW0oaXRlbTogUmVjb3JkPHN0cmluZywgYW55PiwgaGlnaGxpZ2h0cyA9IGZhbHNlKSB7XHJcbiAgICBjb25zdCBpdGVtSHRtbCA9IGh0bWwodGhpcy5pdGVtVGVtcGxhdGUoeyBpdGVtIH0pKTtcclxuXHJcbiAgICBpdGVtSHRtbC5kYXRhc2V0LnZhbHVlID0gaXRlbS52YWx1ZTtcclxuICAgIGl0ZW1IdG1sLnF1ZXJ5U2VsZWN0b3I8SFRNTEJ1dHRvbkVsZW1lbnQ+KCdbZGF0YS1yb2xlPXJlbW92ZV0nKT8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgIHNsaWRlVXAoaXRlbUh0bWwpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIGl0ZW1IdG1sLnJlbW92ZSgpO1xyXG4gICAgICAgIHRoaXMudG9nZ2xlUmVxdWlyZWQoKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmxpc3RDb250YWluZXIuYXBwZW5kQ2hpbGQoaXRlbUh0bWwpO1xyXG4gICAgdGhpcy50b2dnbGVSZXF1aXJlZCgpO1xyXG5cclxuICAgIGlmIChoaWdobGlnaHRzKSB7XHJcbiAgICAgIGhpZ2hsaWdodChpdGVtSHRtbCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB0b2dnbGVSZXF1aXJlZCgpIHtcclxuICAgIGNvbnN0IHBsYWNlaG9sZGVyID0gdGhpcy5xdWVyeVNlbGVjdG9yPEhUTUxJbnB1dEVsZW1lbnQ+KCdbZGF0YS1yb2xlPXZhbGlkYXRpb24tcGxhY2Vob2xkZXJdJyk7XHJcblxyXG4gICAgaWYgKHBsYWNlaG9sZGVyKSB7XHJcbiAgICAgIHBsYWNlaG9sZGVyLmRpc2FibGVkID0gdGhpcy5saXN0Q29udGFpbmVyLmNoaWxkcmVuLmxlbmd0aCAhPT0gMDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9wZW4oZXZlbnQ6IEV2ZW50KSB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgY29uc3QgbWF4ID0gdGhpcy5vcHRpb25zLm1heDtcclxuXHJcbiAgICBjb25zdCB0YXJnZXQgPSBldmVudC50YXJnZXQgYXMgSFRNTEFuY2hvckVsZW1lbnQ7XHJcblxyXG4gICAgaWYgKCFtYXgpIHtcclxuICAgICAgdGhpcy5tb2RhbD8ub3Blbih0YXJnZXQuaHJlZiwgeyBzaXplOiAnbW9kYWwteGwnIH0pO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMubGlzdENvbnRhaW5lci5jaGlsZHJlbi5sZW5ndGggPj0gbWF4KSB7XHJcbiAgICAgIGFsZXJ0KFxyXG4gICAgICAgIF9fKCd1bmljb3JuLmZpZWxkLm1vZGFsLm1heC5zZWxlY3RlZCcsIG1heClcclxuICAgICAgKTtcclxuXHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm1vZGFsPy5vcGVuKHRhcmdldC5ocmVmLCB7IHNpemU6ICdtb2RhbC14bCcgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoTW9kYWxMaXN0U2VsZWN0RWxlbWVudC5pcywgTW9kYWxMaXN0U2VsZWN0RWxlbWVudCk7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIE1vZGFsU2VsZWN0TW9kdWxlIHtcclxuICBjcmVhdGVDYWxsYmFjazogdHlwZW9mIGNyZWF0ZUNhbGxi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
