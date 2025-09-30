import { f as cloneDeep, d as uid } from "../composable/useQueue.js";
import { q as prepareAlpineDefer, i as initAlpineComponent } from "../service/ui.js";
import { u as useCssImport } from "../service/loader.js";
import { m as mergeDeep } from "../utilities/arr.js";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGQtcmVwZWF0YWJsZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL21vZHVsZS9maWVsZC1yZXBlYXRhYmxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNsb25lRGVlcCB9IGZyb20gJ2xvZGFzaC1lcyc7XHJcbmltcG9ydCB7IGluaXRBbHBpbmVDb21wb25lbnQsIHByZXBhcmVBbHBpbmVEZWZlciwgdWlkLCB1c2VDc3NJbXBvcnQgfSBmcm9tICcuLi9zZXJ2aWNlJztcclxuaW1wb3J0IHsgbWVyZ2VEZWVwIH0gZnJvbSAnLi4vdXRpbGl0aWVzJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUmVwZWF0YWJsZU9wdGlvbnMge1xyXG4gIGlkPzogc3RyaW5nO1xyXG4gIGZpZWxkTmFtZT86IHN0cmluZztcclxuICBzb3J0YWJsZT86IGJvb2xlYW47XHJcbiAgaGFzS2V5PzogYm9vbGVhbjtcclxuICBzaW5nbGVBcnJheT86IGJvb2xlYW47XHJcbiAgZW5zdXJlRmlyc3RSb3c/OiBib29sZWFuO1xyXG4gIG1heD86IG51bWJlciB8IG51bGw7XHJcbn1cclxuXHJcbmNvbnN0IGRlZmF1bHRPcHRpb25zOiBSZXBlYXRhYmxlT3B0aW9ucyA9IHtcclxuICBpZDogJycsXHJcbiAgZmllbGROYW1lOiAnJyxcclxuICBzb3J0YWJsZTogZmFsc2UsXHJcbiAgaGFzS2V5OiBmYWxzZSxcclxuICBzaW5nbGVBcnJheTogZmFsc2UsXHJcbiAgZW5zdXJlRmlyc3RSb3c6IGZhbHNlLFxyXG4gIG1heDogbnVsbCxcclxufTtcclxuXHJcbmZ1bmN0aW9uIHByZXBhcmVJdGVtKGl0ZW06IGFueSkge1xyXG4gIGlmIChpdGVtLnVpZCA9PSBudWxsKSB7XHJcbiAgICBpdGVtLnVpZCA9IHVpZCgpO1xyXG4gIH1cclxuICByZXR1cm4gaXRlbTtcclxufVxyXG5cclxudHlwZSBSZXBlYXRhYmxlUGFyYW1zID0ge1xyXG4gIGl0ZW1zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W107XHJcbiAgZGVmYXVsdFZhbHVlczogYW55O1xyXG4gIGF0dHJzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xyXG59O1xyXG5cclxuYXN5bmMgZnVuY3Rpb24gaW5pdCgpIHtcclxuICBhd2FpdCBwcmVwYXJlQWxwaW5lRGVmZXIoYXN5bmMgKEFscGluZSkgPT4ge1xyXG4gICAgdXNlQ3NzSW1wb3J0KCdAdnVlLWFuaW1hdGUnKTtcclxuXHJcbiAgICBBbHBpbmUuZGF0YSgnUmVwZWF0YWJsZUZpZWxkJywgKHsgaXRlbXMsIGRlZmF1bHRWYWx1ZXMsIGF0dHJzIH06IFJlcGVhdGFibGVQYXJhbXMsIG9wdGlvbnM6IFJlcGVhdGFibGVPcHRpb25zKSA9PiAoe1xyXG4gICAgICBpdGVtcyxcclxuICAgICAgZGVmYXVsdFZhbHVlcyxcclxuICAgICAgYXR0cnMsXHJcbiAgICAgIG9wdGlvbnM6IG1lcmdlRGVlcDxSZXBlYXRhYmxlT3B0aW9ucz4oZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpLFxyXG4gICAgICBpbml0KCkge1xyXG4gICAgICAgIC8vIHRoaXMuaXRlbXMgPSB0aGlzLml0ZW1zLmZpbHRlcigoaXRlbSkgPT4gaXRlbSAhPT0gJ19fRU1QVFlfQVJSQVlfXycpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNvcnRhYmxlKSB7XHJcbiAgICAgICAgICAvLyBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbHBpbmVqcy9hbHBpbmUvZGlzY3Vzc2lvbnMvMTYzNVxyXG4gICAgICAgICAgaW1wb3J0KCdzb3J0YWJsZWpzJykudGhlbigoeyBkZWZhdWx0OiBTb3J0YWJsZSB9KSA9PiB7XHJcbiAgICAgICAgICAgIFNvcnRhYmxlLmNyZWF0ZSh0aGlzLiRyZWZzLnRib2R5LCB7XHJcbiAgICAgICAgICAgICAgaGFuZGxlOiAnLmgtaGFuZGxlJyxcclxuICAgICAgICAgICAgICBhbmltYXRpb246IDMwMCxcclxuICAgICAgICAgICAgICBvbkVuZDogKGV2ZW50OiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIFYzIGhlbHBlciB0byB1bndyYXAgdGhlIHByb3h5XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtcyA9IEFscGluZS5yYXcodGhpcy5pdGVtcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gc3BsaWNlIG11dGF0ZXMgdGhlIG9yaWdpbmFsIG9iamVjdCwgd2hpY2hcclxuICAgICAgICAgICAgICAgIC8vIHlvdSB3YW50IHRvIGF2b2lkLiBJbiB0aGlzIGNhc2UgaXQgd29ya3MgYmVjYXVzZSB3ZVxyXG4gICAgICAgICAgICAgICAgLy8gY3JlYXRlZCBhIHRlbXBvcmFyeSBvYmplY3QgdGhhdCB3ZSBjYW4gY29udHJvbFxyXG4gICAgICAgICAgICAgICAgLy8gVGhhdCB3YXkgd2Uga25vdyB0aGVyZSBhcmUgbm8gc2lkZSBlZmZlY3RzXHJcbiAgICAgICAgICAgICAgICBjb25zdCBkcm9wcGVkQXRJdGVtID0gaXRlbXMuc3BsaWNlKGV2ZW50Lm9sZEluZGV4LCAxKVswXTtcclxuICAgICAgICAgICAgICAgIGl0ZW1zLnNwbGljZShldmVudC5uZXdJbmRleCwgMCwgZHJvcHBlZEF0SXRlbSk7XHJcbiAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgLy8gLy8gQWxwaW5lIHdpbGwgdXBkYXRlIHdoZW4geW91IG1vZGlmeSB0aGUgc3RhdGUsXHJcbiAgICAgICAgICAgICAgICAvLyAvLyBzbyB3ZSBuZWVkIHRvIHNldCBpdCBiYWNrIHRvIG91ciBuZXcgc3RhdGVcclxuICAgICAgICAgICAgICAgIHRoaXMuaXRlbXMgPSBpdGVtcztcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBIQUNLIHVwZGF0ZSBwcmV2S2V5cyB0byBuZXcgc29ydCBvcmRlclxyXG4gICAgICAgICAgICAgICAgbGV0IGtleXMgPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgaXRlbXMpIHtcclxuICAgICAgICAgICAgICAgICAga2V5cy5wdXNoKGl0ZW0udWlkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBIQUNLIHVwZGF0ZSBpbmRleCBvZiBkYXRhU3RhY2tcclxuICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICAgICAgICAgIHRoaXMuJHJlZnMuc3RlcHNfdGVtcGxhdGUuX3hfcHJldktleXMgPSBrZXlzO1xyXG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICAgICAgY29uc3QgZWxlbWVudHMgPSB0aGlzLiRyZWZzLnN0ZXBzX3RlbXBsYXRlXHJcbiAgICAgICAgICAgICAgICAgIC5wYXJlbnRFbGVtZW50XHJcbiAgICAgICAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCd0cicpO1xyXG5cclxuICAgICAgICAgICAgICAgIFtdLnNsaWNlLmNhbGwoZWxlbWVudHMpLmZvckVhY2goKGVsZSwgaSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICAgIGlmIChlbGU/Ll94X2RhdGFTdGFja1swXT8uaSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICAgICAgICAgIGVsZS5feF9kYXRhU3RhY2tbMF0uaSA9IGk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaXRlbXMuZm9yRWFjaChwcmVwYXJlSXRlbSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZW5zdXJlRmlyc3RSb3cpIHtcclxuICAgICAgICAgIHRoaXMuZW5zdXJlRmlyc3RSb3coKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBhZGRJdGVtKGk6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IGl0ZW0gPSBwcmVwYXJlSXRlbSh0aGlzLmdldEVtcHR5SXRlbSgpKTtcclxuXHJcbiAgICAgICAgdGhpcy5pdGVtcy5zcGxpY2UoaSArIDEsIDAsIGl0ZW0pO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgZGVsSXRlbShpOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBlbCA9IHRoaXMuZ2V0SXRlbUVsZW1lbnRCeVVJRCh0aGlzLml0ZW1zW2ldLnVpZCk7XHJcbiAgICAgICAgbGV0IGhhc0FuaW1hdGUgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgZWw/LmFkZEV2ZW50TGlzdGVuZXIoJ2FuaW1hdGlvbnN0YXJ0JywgKCkgPT4ge1xyXG4gICAgICAgICAgaGFzQW5pbWF0ZSA9IHRydWU7XHJcbiAgICAgICAgfSwgeyBvbmNlOiB0cnVlIH0pO1xyXG5cclxuICAgICAgICBlbD8uY2xhc3NMaXN0LmFkZCgnYW5pbWF0ZV9fZmFkZU91dCcpO1xyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgIGlmICghaGFzQW5pbWF0ZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9yZW1vdmVJdGVtKGkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sIDEwMCk7XHJcblxyXG4gICAgICAgIGVsPy5hZGRFdmVudExpc3RlbmVyKCdhbmltYXRpb25lbmQnLCAoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLl9yZW1vdmVJdGVtKGkpO1xyXG4gICAgICAgIH0sIHsgb25jZTogdHJ1ZSB9KTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9yZW1vdmVJdGVtKGk6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuaXRlbXMuc3BsaWNlKGksIDEpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmVuc3VyZUZpcnN0Um93KSB7XHJcbiAgICAgICAgICB0aGlzLmVuc3VyZUZpcnN0Um93KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgZW5zdXJlRmlyc3RSb3coKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXRlbXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICB0aGlzLml0ZW1zLnB1c2gocHJlcGFyZUl0ZW0odGhpcy5nZXRFbXB0eUl0ZW0oKSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGdldEl0ZW1FbGVtZW50QnlVSUQodWlkOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy4kcm9vdC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1pdGVtPVwiJHt1aWR9XCJdYCk7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBnZXRJZChpOiBudW1iZXIsIGl0ZW06IGFueSwgZmllbGQ6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiBgJHt0aGlzLmlkfS0ke2l0ZW0udWlkfS0ke2ZpZWxkfWA7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBnZXROYW1lKGk6IG51bWJlciwgaXRlbTogYW55LCBmaWVsZDogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zaW5nbGVBcnJheSkge1xyXG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5oYXNLZXkpIHtcclxuICAgICAgICAgICAgaWYgKGZpZWxkID09PSAna2V5Jykge1xyXG4gICAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXMuZmllbGROYW1lfVske2l0ZW0ua2V5fV1gO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHJldHVybiBgJHt0aGlzLmZpZWxkTmFtZX1bXWA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYCR7dGhpcy5maWVsZE5hbWV9WyR7aX1dWyR7ZmllbGR9XWA7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBnZXRFbXB0eUl0ZW0oKSB7XHJcbiAgICAgICAgcmV0dXJuIGNsb25lRGVlcCh0aGlzLmRlZmF1bHRWYWx1ZXMpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgZ2V0IGNhbkFkZCgpIHtcclxuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5tYXgpIHtcclxuICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5tYXggPiB0aGlzLml0ZW1zLmxlbmd0aDtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGdldCBjYW5Nb2RpZnkoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXR0cnMuZGlzYWJsZWQgPT0gbnVsbCAmJiB0aGlzLmF0dHJzLnJlYWRvbmx5ID09IG51bGw7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBnZXQgZmllbGROYW1lKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZmllbGROYW1lO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgZ2V0IGlkKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuaWQ7XHJcbiAgICAgIH1cclxuICAgIH0pKTtcclxuICB9KTtcclxuXHJcbiAgYXdhaXQgaW5pdEFscGluZUNvbXBvbmVudCgnZGF0YS1yZXBlYXRhYmxlJyk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCByZWFkeSA9IGluaXQoKTtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUmVwZWF0YWJsZU1vZHVsZSB7XHJcbiAgcmVhZHk6IHR5cGVvZiByZWFkeTtcclxufVxyXG4iXSwibmFtZXMiOlsiaXRlbXMiLCJ1aWQiXSwibWFwcGluZ3MiOiI7Ozs7QUFjQSxNQUFNLGlCQUFvQztBQUFBLEVBQ3hDLElBQUk7QUFBQSxFQUNKLFdBQVc7QUFBQSxFQUNYLFVBQVU7QUFBQSxFQUNWLFFBQVE7QUFBQSxFQUNSLGFBQWE7QUFBQSxFQUNiLGdCQUFnQjtBQUFBLEVBQ2hCLEtBQUs7QUFDUDtBQUVBLFNBQVMsWUFBWSxNQUFXO0FB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
