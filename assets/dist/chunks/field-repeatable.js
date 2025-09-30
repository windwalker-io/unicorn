import { c as cloneDeep } from "./cloneDeep.js";
import { a4 as prepareAlpineDefer, a9 as useCssImport, a5 as mergeDeep, f as initAlpineComponent, K as uid } from "./unicorn.js";
const defaultOptions = {
  id: "",
  fieldName: "",
  sortable: false,
  hasKey: false,
  singleArray: false,
  ensureFirstRow: false,
  max: null
};
function prepareItem(item) {
  if (item.uid == null) {
    item.uid = uid();
  }
  return item;
}
async function init() {
  await prepareAlpineDefer(async (Alpine) => {
    useCssImport("@vue-animate");
    Alpine.data("RepeatableField", ({ items, defaultValues, attrs }, options) => ({
      items,
      defaultValues,
      attrs,
      options: mergeDeep(defaultOptions, options),
      init() {
        if (this.options.sortable) {
          import("sortablejs").then(({ default: Sortable }) => {
            Sortable.create(this.$refs.tbody, {
              handle: ".h-handle",
              animation: 300,
              onEnd: (event) => {
                const items2 = Alpine.raw(this.items);
                const droppedAtItem = items2.splice(event.oldIndex, 1)[0];
                items2.splice(event.newIndex, 0, droppedAtItem);
                this.items = items2;
                let keys = [];
                for (let item of items2) {
                  keys.push(item.uid);
                }
                this.$refs.steps_template._x_prevKeys = keys;
                const elements = this.$refs.steps_template.parentElement.querySelectorAll("tr");
                [].slice.call(elements).forEach((ele, i) => {
                  if (ele?._x_dataStack[0]?.i != null) {
                    ele._x_dataStack[0].i = i;
                  }
                });
              }
            });
          });
        }
        this.items.forEach(prepareItem);
        if (this.options.ensureFirstRow) {
          this.ensureFirstRow();
        }
      },
      addItem(i) {
        const item = prepareItem(this.getEmptyItem());
        this.items.splice(i + 1, 0, item);
      },
      delItem(i) {
        const el = this.getItemElementByUID(this.items[i].uid);
        let hasAnimate = false;
        el?.addEventListener("animationstart", () => {
          hasAnimate = true;
        }, { once: true });
        el?.classList.add("animate__fadeOut");
        setTimeout(() => {
          if (!hasAnimate) {
            this._removeItem(i);
          }
        }, 100);
        el?.addEventListener("animationend", () => {
          this._removeItem(i);
        }, { once: true });
      },
      _removeItem(i) {
        this.items.splice(i, 1);
        if (this.options.ensureFirstRow) {
          this.ensureFirstRow();
        }
      },
      ensureFirstRow() {
        if (this.items.length === 0) {
          this.items.push(prepareItem(this.getEmptyItem()));
        }
      },
      getItemElementByUID(uid2) {
        return this.$root.querySelector(`[data-item="${uid2}"]`);
      },
      getId(i, item, field) {
        return `${this.id}-${item.uid}-${field}`;
      },
      getName(i, item, field) {
        if (this.options.singleArray) {
          if (this.options.hasKey) {
            if (field === "key") {
              return "";
            }
            return `${this.fieldName}[${item.key}]`;
          }
          return `${this.fieldName}[]`;
        }
        return `${this.fieldName}[${i}][${field}]`;
      },
      getEmptyItem() {
        return cloneDeep(this.defaultValues);
      },
      get canAdd() {
        if (!this.options.max) {
          return true;
        }
        return this.options.max > this.items.length;
      },
      get canModify() {
        return this.attrs.disabled == null && this.attrs.readonly == null;
      },
      get fieldName() {
        return this.options.fieldName;
      },
      get id() {
        return this.options.id;
      }
    }));
  });
  await initAlpineComponent("data-repeatable");
}
const ready = /* @__PURE__ */ init();
export {
  ready
};
//# sourceMappingURL=field-repeatable.js.map
