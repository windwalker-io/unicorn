import { l as loadAlpine, b as slideDown, s as slideUp } from "../service/ui.js";
import { h } from "../service/dom.js";
import { b as simpleConfirm, g as deleteConfirm, c as simpleAlert } from "../composable/useQueue.js";
import { _ as __ } from "../service/lang.js";
class UnicornGridElement {
  constructor(selector, element, form, options = {}) {
    this.element = element;
    this.form = form;
    this.options = { ...options };
    this.bindEvents();
  }
  options;
  ordering = "";
  state = {};
  bindEvents() {
    const inputs = this.element.querySelectorAll("input[data-role=grid-checkbox]");
    for (const ch of inputs) {
      ch.addEventListener("click", () => {
        ch.dispatchEvent(new CustomEvent("change"));
      });
      ch.addEventListener("change", () => {
        const event = new CustomEvent("unicorn:checked", {
          detail: { grid: this }
        });
        this.form.element?.dispatchEvent(event);
      });
    }
  }
  initComponent(store = "grid", custom = {}) {
    this.ordering = this.element?.dataset?.ordering || "";
    if (this.ordering) {
      if (!this.ordering.toLowerCase().endsWith(" asc") && !this.ordering.toLowerCase().endsWith(" desc")) {
        this.ordering += " ASC";
      }
    }
    return loadAlpine((Alpine) => {
      Alpine.store(store, this.useState(custom));
    });
  }
  useState(custom = {}) {
    const state = {
      form: this.form.useState(custom)
    };
    Object.getOwnPropertyNames(Object.getPrototypeOf(this)).map((item) => {
      const prop = this[item];
      if (typeof prop === "function") {
        return state[item] = this[item].bind(this);
      }
      return item;
    });
    return Object.assign(
      state,
      custom
    );
  }
  getElement() {
    return this.element;
  }
  sendFilter($event, method) {
    if ($event) {
      $event.preventDefault();
    }
    this.form.submit(null, null, method);
  }
  clearFilters(element, method) {
    element.querySelectorAll("input, textarea, select").forEach((ele) => {
      ele.value = "";
    });
    this.form.submit(null, null, method);
  }
  async toggleFilters(open, filterForm) {
    if (open) {
      await slideDown(filterForm);
    } else {
      await slideUp(filterForm);
    }
  }
  sort($el) {
    const dir = this.getDirection($el);
    const field = $el.dataset.field;
    let asc = $el.dataset.asc;
    let desc = $el.dataset.desc;
    if (field) {
      asc = field + " ASC";
      desc = field + " DESC";
    }
    if (dir === "ASC") {
      return this.sortBy(desc);
    }
    return this.sortBy(asc);
  }
  /**
   * Sort two items.
   */
  sortBy(ordering) {
    if (!ordering) {
      return false;
    }
    let orderingInput = this.element.querySelector("input[name=list_ordering]");
    if (!orderingInput) {
      orderingInput = h("input", { name: "list_ordering", type: "hidden", value: "" });
      this.element.appendChild(orderingInput);
    }
    orderingInput.value = ordering;
    return this.form.put();
  }
  isSortActive($el) {
    return this.getDirection($el) != null;
  }
  getDirection($el) {
    const field = $el.dataset.field;
    let asc = $el.dataset.asc;
    let desc = $el.dataset.desc;
    if (field) {
      asc = field + " ASC";
      desc = field + " DESC";
    }
    if (this.orderingEquals(asc, this.ordering)) {
      return "ASC";
    } else if (this.orderingEquals(desc, this.ordering)) {
      return "DESC";
    }
    return null;
  }
  orderingEquals(a, b) {
    a = a || "";
    b = b || "";
    a = a.replace(/\s+/g, " ").trim().toLowerCase();
    b = b.replace(/\s+/g, " ").trim().toLowerCase();
    return a === b;
  }
  /**
   * Check a row's checkbox.
   */
  checkRow(row, value = true) {
    const ch = this.getCheckboxByRow(row);
    if (!ch) {
      throw new Error("Checkbox of row: " + row + " not found.");
    }
    ch.checked = value;
    ch.dispatchEvent(new Event("input"));
    ch.dispatchEvent(new Event("change"));
  }
  getCheckboxByRow(row) {
    return this.form.element?.querySelector(
      `input[data-role=grid-checkbox][data-row-number="${row}"]`
    );
  }
  /**
   * Update a row.
   */
  updateRow(row, url, data) {
    const ch = this.getCheckboxByRow(row);
    if (!ch) {
      return false;
    }
    return this.updateItem(ch.value, url, data);
  }
  /**
   * Update an item by id.
   */
  updateItem(id, url, data) {
    this.toggleAll(false);
    this.disableAllCheckboxes();
    this.form.injectInput("id[]", id);
    return this.form.patch(url, data);
  }
  /**
   * Update a item with batch task.
   */
  updateItemByTask(task, id, url, data) {
    data = data || {};
    data.task = task;
    return this.updateItem(id, url, data);
  }
  /**
   * @deprecated  Use updateItemByTask() instead.
   */
  doTask(task, id, url, data) {
    return this.updateItemByTask(task, id, url, data);
  }
  /**
   * Update a row with batch task.
   */
  updateRowByTask(task, row, url, data) {
    const ch = this.getCheckboxByRow(row);
    if (!ch) {
      return false;
    }
    return this.updateItemByTask(task, ch.value, url, data);
  }
  /**
   * Batch update items.
   */
  updateListByTask(task, url, data) {
    data = data || {};
    data.task = task;
    return this.form.patch(url, data);
  }
  /**
   * Copy a row.
   */
  copyItem(id, url, data) {
    this.toggleAll(false);
    this.disableAllCheckboxes();
    this.form.injectInput("id[]", id);
    return this.form.post(url, data);
  }
  /**
   * Copy a row.
   */
  copyRow(row, url, data) {
    const ch = this.getCheckboxByRow(row);
    if (!ch) {
      return false;
    }
    return this.copyItem(ch.value, url, data);
  }
  /**
   * Delete checked items.
   */
  deleteList(message, url, data) {
    if (!this.validateChecked()) {
      return false;
    }
    message = message == null ? __("unicorn.message.delete.confirm") : message;
    if (message !== false) {
      simpleConfirm(message).then((isConfirm) => {
        if (isConfirm) {
          this.form.delete(url, data);
        }
      });
    } else {
      this.form.delete(url, data);
    }
    return true;
  }
  /**
   * Delete an item by row.
   */
  async deleteRow(row, msg, url, data) {
    const ch = this.getCheckboxByRow(row);
    if (!ch) {
      return false;
    }
    return this.deleteItem(ch.value, msg, url, data);
  }
  /**
   * Delete an item.
   */
  async deleteItem(id, msg, url, data) {
    msg = msg || __("unicorn.message.delete.confirm");
    const isConfirm = await deleteConfirm(msg);
    if (isConfirm) {
      data = data || {};
      data.id = id;
      this.form.delete(url, data);
    }
    return isConfirm;
  }
  /**
   * Toggle all checkboxes.
   */
  toggleAll(value) {
    Array.from(
      this.element.querySelectorAll("input[data-role=grid-checkbox][type=checkbox]")
    ).forEach((input) => {
      input.checked = value;
      input.dispatchEvent(new CustomEvent("input"));
      input.dispatchEvent(new CustomEvent("change"));
    });
    return this;
  }
  disableAllCheckboxes() {
    Array.from(
      this.element.querySelectorAll("input[data-role=grid-checkbox][type=checkbox]")
    ).forEach((input) => {
      input.disabled = true;
    });
  }
  /**
   * Count checked checkboxes.
   */
  countChecked() {
    return this.getChecked().length;
  }
  /**
   * Get Checked boxes.
   */
  getChecked() {
    return Array.from(
      this.element.querySelectorAll("input[data-role=grid-checkbox][type=checkbox]:checked")
    );
  }
  getCheckedValues() {
    return this.getChecked().map((input) => input.value);
  }
  /**
   * Validate there has one or more checked boxes.
   */
  validateChecked(event, callback, msg) {
    msg = msg || __("unicorn.message.grid.checked");
    if (!this.hasChecked()) {
      if (msg !== "") {
        simpleAlert(msg);
      }
      if (event) {
        event.stopPropagation();
        event.preventDefault();
      }
      return this;
    }
    if (callback) {
      callback(this);
    }
    return this;
  }
  hasChecked() {
    return this.countChecked() > 0;
  }
  /**
   * Reorder all.
   */
  reorderAll(url, data) {
    return this.updateListByTask("reorder", url, data);
  }
  /**
   * Reorder items.
   */
  moveItem(id, delta, url, data) {
    data = data || {};
    data.delta = delta;
    return this.updateItemByTask("move", id, url, data);
  }
  moveUp(id, url, data) {
    return this.moveItem(id, -1, url, data);
  }
  moveDown(id, url, data) {
    return this.moveItem(id, 1, url, data);
  }
  getId(suffix = "") {
    return this.form.element?.id + suffix;
  }
}
export {
  UnicornGridElement
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL21vZHVsZS9ncmlkLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IF9fLCBkZWxldGVDb25maXJtLCBoLCBsb2FkQWxwaW5lLCBzaW1wbGVBbGVydCwgc2ltcGxlQ29uZmlybSwgc2xpZGVEb3duLCBzbGlkZVVwIH0gZnJvbSAnLi4vc2VydmljZSc7XHJcbmltcG9ydCB7IE51bGxhYmxlIH0gZnJvbSAnLi4vdHlwZXMnO1xyXG5pbXBvcnQgdHlwZSB7IFVuaWNvcm5Gb3JtRWxlbWVudCB9IGZyb20gJy4vZm9ybSc7XHJcblxyXG5leHBvcnQgY2xhc3MgVW5pY29ybkdyaWRFbGVtZW50IHtcclxuICBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xyXG4gIG9yZGVyaW5nID0gJyc7XHJcbiAgc3RhdGUgPSB7fTtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBzZWxlY3Rvcjogc3RyaW5nLFxyXG4gICAgcHVibGljIGVsZW1lbnQ6IEhUTUxFbGVtZW50LFxyXG4gICAgcHVibGljIGZvcm06IFVuaWNvcm5Gb3JtRWxlbWVudCxcclxuICAgIG9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fVxyXG4gICkge1xyXG4gICAgdGhpcy5vcHRpb25zID0geyAuLi5vcHRpb25zIH07XHJcblxyXG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XHJcbiAgfVxyXG5cclxuICBiaW5kRXZlbnRzKCkge1xyXG4gICAgY29uc3QgaW5wdXRzID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTElucHV0RWxlbWVudD4oJ2lucHV0W2RhdGEtcm9sZT1ncmlkLWNoZWNrYm94XScpO1xyXG5cclxuICAgIGZvciAoY29uc3QgY2ggb2YgaW5wdXRzKSB7XHJcbiAgICAgIGNoLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgIGNoLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdjaGFuZ2UnKSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBjaC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ3VuaWNvcm46Y2hlY2tlZCcsIHtcclxuICAgICAgICAgIGRldGFpbDogeyBncmlkOiB0aGlzIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5mb3JtLmVsZW1lbnQ/LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGluaXRDb21wb25lbnQoc3RvcmUgPSAnZ3JpZCcsIGN1c3RvbTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9KSB7XHJcbiAgICB0aGlzLm9yZGVyaW5nID0gdGhpcy5lbGVtZW50Py5kYXRhc2V0Py5vcmRlcmluZyB8fCAnJztcclxuXHJcbiAgICBpZiAodGhpcy5vcmRlcmluZykge1xyXG4gICAgICBpZiAoIXRoaXMub3JkZXJpbmcudG9Mb3dlckNhc2UoKS5lbmRzV2l0aCgnIGFzYycpXHJcbiAgICAgICAgJiYgIXRoaXMub3JkZXJpbmcudG9Mb3dlckNhc2UoKS5lbmRzV2l0aCgnIGRlc2MnKSkge1xyXG4gICAgICAgIHRoaXMub3JkZXJpbmcgKz0gJyBBU0MnO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGxvYWRBbHBpbmUoKEFscGluZSkgPT4ge1xyXG4gICAgICBBbHBpbmUuc3RvcmUoc3RvcmUsIHRoaXMudXNlU3RhdGUoY3VzdG9tKSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVzZVN0YXRlKHRoaXM6IGFueSwgY3VzdG9tOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge30pIHtcclxuICAgIGNvbnN0IHN0YXRlOiBQYXJ0aWFsPFJlY29yZDxzdHJpbmcsIGFueT4+ID0ge1xyXG4gICAgICBmb3JtOiB0aGlzLmZvcm0udXNlU3RhdGUoY3VzdG9tKSxcclxuICAgIH07XHJcblxyXG4gICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoT2JqZWN0LmdldFByb3RvdHlwZU9mKHRoaXMpKVxyXG4gICAgICAubWFwKGl0ZW0gPT4ge1xyXG4gICAgICAgIGNvbnN0IHByb3AgPSB0aGlzW2l0ZW1dO1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIHByb3AgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgIHJldHVybiBzdGF0ZVtpdGVtXSA9IHRoaXNbaXRlbV0uYmluZCh0aGlzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihcclxuICAgICAgc3RhdGUsXHJcbiAgICAgIGN1c3RvbVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGdldEVsZW1lbnQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50O1xyXG4gIH1cclxuXHJcbiAgc2VuZEZpbHRlcigkZXZlbnQ/OiBFdmVudCwgbWV0aG9kPzogc3RyaW5nKSB7XHJcbiAgICBpZiAoJGV2ZW50KSB7XHJcbiAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZm9ybS5zdWJtaXQobnVsbCwgbnVsbCwgbWV0aG9kKTtcclxuICB9XHJcblxyXG4gIGNsZWFyRmlsdGVycyhlbGVtZW50OiBIVE1MRWxlbWVudCwgbWV0aG9kPzogTnVsbGFibGU8c3RyaW5nPik6IHZvaWQge1xyXG4gICAgZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCwgdGV4dGFyZWEsIHNlbGVjdCcpLmZvckVhY2goKGVsZSkgPT4ge1xyXG4gICAgICAoZWxlIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlID0gJyc7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmZvcm0uc3VibWl0KG51bGwsIG51bGwsIG1ldGhvZCk7XHJcbiAgfVxyXG5cclxuICBhc3luYyB0b2dnbGVGaWx0ZXJzKG9wZW46IGJvb2xlYW4sIGZpbHRlckZvcm06IEhUTUxFbGVtZW50KSB7XHJcbiAgICBpZiAob3Blbikge1xyXG4gICAgICBhd2FpdCBzbGlkZURvd24oZmlsdGVyRm9ybSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBhd2FpdCBzbGlkZVVwKGZpbHRlckZvcm0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc29ydCgkZWw6IEhUTUxFbGVtZW50KTogYm9vbGVhbiB7XHJcbiAgICBjb25zdCBkaXIgPSB0aGlzLmdldERpcmVjdGlvbigkZWwpO1xyXG5cclxuICAgIGNvbnN0IGZpZWxkID0gJGVsLmRhdGFzZXQuZmllbGQ7XHJcbiAgICBsZXQgYXNjID0gJGVsLmRhdGFzZXQuYXNjO1xyXG4gICAgbGV0IGRlc2MgPSAkZWwuZGF0YXNldC5kZXNjO1xyXG5cclxuICAgIGlmIChmaWVsZCkge1xyXG4gICAgICBhc2MgPSBmaWVsZCArICcgQVNDJztcclxuICAgICAgZGVzYyA9IGZpZWxkICsgJyBERVNDJztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZGlyID09PSAnQVNDJykge1xyXG4gICAgICByZXR1cm4gdGhpcy5zb3J0QnkoZGVzYyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuc29ydEJ5KGFzYyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTb3J0IHR3byBpdGVtcy5cclxuICAgKi9cclxuICBzb3J0Qnkob3JkZXJpbmc6IE51bGxhYmxlPHN0cmluZz4pOiBib29sZWFuIHtcclxuICAgIGlmICghb3JkZXJpbmcpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBvcmRlcmluZ0lucHV0ID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTElucHV0RWxlbWVudD4oJ2lucHV0W25hbWU9bGlzdF9vcmRlcmluZ10nKTtcclxuXHJcbiAgICBpZiAoIW9yZGVyaW5nSW5wdXQpIHtcclxuICAgICAgb3JkZXJpbmdJbnB1dCA9IGgoJ2lucHV0JywgeyBuYW1lOiAnbGlzdF9vcmRlcmluZycsIHR5cGU6ICdoaWRkZW4nLCB2YWx1ZTogJycgfSk7XHJcblxyXG4gICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQob3JkZXJpbmdJbnB1dCk7XHJcbiAgICB9XHJcblxyXG4gICAgb3JkZXJpbmdJbnB1dC52YWx1ZSA9IG9yZGVyaW5nO1xyXG5cclxuICAgIHJldHVybiB0aGlzLmZvcm0ucHV0KCk7XHJcbiAgfVxyXG5cclxuICBpc1NvcnRBY3RpdmUoJGVsOiBIVE1MRWxlbWVudCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuZ2V0RGlyZWN0aW9uKCRlbCkgIT0gbnVsbDtcclxuICB9XHJcblxyXG4gIGdldERpcmVjdGlvbigkZWw6IEhUTUxFbGVtZW50KTogXCJBU0NcIiB8IFwiREVTQ1wiIHwgbnVsbCB7XHJcbiAgICBjb25zdCBmaWVsZCA9ICRlbC5kYXRhc2V0LmZpZWxkO1xyXG4gICAgbGV0IGFzYyA9ICRlbC5kYXRhc2V0LmFzYztcclxuICAgIGxldCBkZXNjID0gJGVsLmRhdGFzZXQuZGVzYztcclxuXHJcbiAgICBpZiAoZmllbGQpIHtcclxuICAgICAgYXNjID0gZmllbGQgKyAnIEFTQyc7XHJcbiAgICAgIGRlc2MgPSBmaWVsZCArICcgREVTQyc7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMub3JkZXJpbmdFcXVhbHMoYXNjLCB0aGlzLm9yZGVyaW5nKSkge1xyXG4gICAgICByZXR1cm4gJ0FTQyc7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMub3JkZXJpbmdFcXVhbHMoZGVzYywgdGhpcy5vcmRlcmluZykpIHtcclxuICAgICAgcmV0dXJuICdERVNDJztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIG9yZGVyaW5nRXF1YWxzKGE6IE51bGxhYmxlPHN0cmluZz4sIGI6IE51bGxhYmxlPHN0cmluZz4pOiBib29sZWFuIHtcclxuICAgIGEgPSBhIHx8ICcnO1xyXG4gICAgYiA9IGIgfHwgJyc7XHJcblxyXG4gICAgYSA9IGEucmVwbGFjZSgvXFxzKy9nLCAnICcpLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgYiA9IGIucmVwbGFjZSgvXFxzKy9nLCAnICcpLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xyXG5cclxuICAgIHJldHVybiBhID09PSBiO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2hlY2sgYSByb3cncyBjaGVja2JveC5cclxuICAgKi9cclxuICBjaGVja1Jvdyhyb3c6IG51bWJlciwgdmFsdWUgPSB0cnVlKTogdm9pZCB7XHJcbiAgICBjb25zdCBjaCA9IHRoaXMuZ2V0Q2hlY2tib3hCeVJvdyhyb3cpO1xyXG5cclxuICAgIGlmICghY2gpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDaGVja2JveCBvZiByb3c6ICcgKyByb3cgKyAnIG5vdCBmb3VuZC4nKTtcclxuICAgIH1cclxuXHJcbiAgICBjaC5jaGVja2VkID0gdmFsdWU7XHJcbiAgICBjaC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnaW5wdXQnKSk7XHJcbiAgICBjaC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnY2hhbmdlJykpO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q2hlY2tib3hCeVJvdyhyb3c6IG51bWJlcik6IE51bGxhYmxlPEhUTUxJbnB1dEVsZW1lbnQ+IHtcclxuICAgIHJldHVybiB0aGlzLmZvcm0uZWxlbWVudD8ucXVlcnlTZWxlY3RvcjxIVE1MSW5wdXRFbGVtZW50PihcclxuICAgICAgYGlucHV0W2RhdGEtcm9sZT1ncmlkLWNoZWNrYm94XVtkYXRhLXJvdy1udW1iZXI9XCIke3Jvd31cIl1gXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVXBkYXRlIGEgcm93LlxyXG4gICAqL1xyXG4gIHVwZGF0ZVJvdyhyb3c6IG51bWJlciwgdXJsPzogTnVsbGFibGU8c3RyaW5nPiwgZGF0YT86IE51bGxhYmxlPFJlY29yZDxzdHJpbmcsIGFueT4+KSB7XHJcbiAgICBjb25zdCBjaCA9IHRoaXMuZ2V0Q2hlY2tib3hCeVJvdyhyb3cpO1xyXG5cclxuICAgIGlmICghY2gpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLnVwZGF0ZUl0ZW0oY2gudmFsdWUsIHVybCwgZGF0YSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBVcGRhdGUgYW4gaXRlbSBieSBpZC5cclxuICAgKi9cclxuICB1cGRhdGVJdGVtKGlkOiBzdHJpbmcgfCBudW1iZXIsIHVybD86IE51bGxhYmxlPHN0cmluZz4sIGRhdGE/OiBOdWxsYWJsZTxSZWNvcmQ8c3RyaW5nLCBhbnk+Pik6IGJvb2xlYW4ge1xyXG4gICAgdGhpcy50b2dnbGVBbGwoZmFsc2UpO1xyXG5cclxuICAgIHRoaXMuZGlzYWJsZUFsbENoZWNrYm94ZXMoKTtcclxuXHJcbiAgICB0aGlzLmZvcm0uaW5qZWN0SW5wdXQoJ2lkW10nLCBpZCk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuZm9ybS5wYXRjaCh1cmwsIGRhdGEpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVXBkYXRlIGEgaXRlbSB3aXRoIGJhdGNoIHRhc2suXHJcbiAgICovXHJcbiAgdXBkYXRlSXRlbUJ5VGFzayhcclxuICAgIHRhc2s6IHN0cmluZyxcclxuICAgIGlkOiBzdHJpbmcgfCBudW1iZXIsXHJcbiAgICB1cmw/OiBOdWxsYWJsZTxzdHJpbmc+LFxyXG4gICAgZGF0YT86IE51bGxhYmxlPFJlY29yZDxzdHJpbmcsIGFueT4+XHJcbiAgKTogYm9vbGVhbiB7XHJcbiAgICBkYXRhID0gZGF0YSB8fCB7fTtcclxuICAgIGRhdGEudGFzayA9IHRhc2s7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMudXBkYXRlSXRlbShpZCwgdXJsLCBkYXRhKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEBkZXByZWNhdGVkICBVc2UgdXBkYXRlSXRlbUJ5VGFzaygpIGluc3RlYWQuXHJcbiAgICovXHJcbiAgZG9UYXNrKHRhc2s6IHN0cmluZywgaWQ6IG51bWJlciB8IHN0cmluZywgdXJsPzogTnVsbGFibGU8c3RyaW5nPiwgZGF0YT86IE51bGxhYmxlPFJlY29yZDxzdHJpbmcsIGFueT4+KTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy51cGRhdGVJdGVtQnlUYXNrKHRhc2ssIGlkLCB1cmwsIGRhdGEpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVXBkYXRlIGEgcm93IHdpdGggYmF0Y2ggdGFzay5cclxuICAgKi9cclxuICB1cGRhdGVSb3dCeVRhc2sodGFzazogc3RyaW5nLCByb3c6IG51bWJlciwgdXJsPzogTnVsbGFibGU8c3RyaW5nPiwgZGF0YT86IE51bGxhYmxlPFJlY29yZDxzdHJpbmcsIGFueT4+KTogYm9vbGVhbiB7XHJcbiAgICBjb25zdCBjaCA9IHRoaXMuZ2V0Q2hlY2tib3hCeVJvdyhyb3cpO1xyXG5cclxuICAgIGlmICghY2gpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLnVwZGF0ZUl0ZW1CeVRhc2sodGFzaywgY2gudmFsdWUsIHVybCwgZGF0YSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBCYXRjaCB1cGRhdGUgaXRlbXMuXHJcbiAgICovXHJcbiAgdXBkYXRlTGlzdEJ5VGFzayh0YXNrOiBzdHJpbmcsIHVybD86IE51bGxhYmxlPHN0cmluZz4sIGRhdGE/OiBOdWxsYWJsZTxSZWNvcmQ8c3RyaW5nLCBhbnk+Pik6IGJvb2xlYW4ge1xyXG4gICAgZGF0YSA9IGRhdGEgfHwge307XHJcbiAgICBkYXRhLnRhc2sgPSB0YXNrO1xyXG5cclxuICAgIHJldHVybiB0aGlzLmZvcm0ucGF0Y2godXJsLCBkYXRhKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENvcHkgYSByb3cuXHJcbiAgICovXHJcbiAgY29weUl0ZW0oaWQ6IHN0cmluZyB8IG51bWJlciwgdXJsPzogTnVsbGFibGU8c3RyaW5nPiwgZGF0YT86IE51bGxhYmxlPFJlY29yZDxzdHJpbmcsIGFueT4+KTogYm9vbGVhbiB7XHJcbiAgICB0aGlzLnRvZ2dsZUFsbChmYWxzZSk7XHJcblxyXG4gICAgdGhpcy5kaXNhYmxlQWxsQ2hlY2tib3hlcygpO1xyXG5cclxuICAgIHRoaXMuZm9ybS5pbmplY3RJbnB1dCgnaWRbXScsIGlkKTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5mb3JtLnBvc3QodXJsLCBkYXRhKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENvcHkgYSByb3cuXHJcbiAgICovXHJcbiAgY29weVJvdyhyb3c6IG51bWJlciwgdXJsPzogTnVsbGFibGU8c3RyaW5nPiwgZGF0YT86IE51bGxhYmxlPFJlY29yZDxzdHJpbmcsIGFueT4+KTogYm9vbGVhbiB7XHJcbiAgICBjb25zdCBjaCA9IHRoaXMuZ2V0Q2hlY2tib3hCeVJvdyhyb3cpO1xyXG5cclxuICAgIGlmICghY2gpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLmNvcHlJdGVtKGNoLnZhbHVlLCB1cmwsIGRhdGEpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRGVsZXRlIGNoZWNrZWQgaXRlbXMuXHJcbiAgICovXHJcbiAgZGVsZXRlTGlzdChcclxuICAgIG1lc3NhZ2U/OiBOdWxsYWJsZTxzdHJpbmc+IHwgZmFsc2UsXHJcbiAgICB1cmw/OiBOdWxsYWJsZTxzdHJpbmc+LFxyXG4gICAgZGF0YT86IE51bGxhYmxlPFJlY29yZDxzdHJpbmcsIGFueT4+XHJcbiAgKTogYm9vbGVhbiB7XHJcbiAgICBpZiAoIXRoaXMudmFsaWRhdGVDaGVja2VkKCkpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIG1lc3NhZ2UgPSBtZXNzYWdlID09IG51bGwgPyBfXygndW5pY29ybi5tZXNzYWdlLmRlbGV0ZS5jb25maXJtJykgOiBtZXNzYWdlO1xyXG5cclxuICAgIGlmIChtZXNzYWdlICE9PSBmYWxzZSkge1xyXG4gICAgICBzaW1wbGVDb25maXJtKG1lc3NhZ2UpLnRoZW4oaXNDb25maXJtID0+IHtcclxuICAgICAgICBpZiAoaXNDb25maXJtKSB7XHJcbiAgICAgICAgICB0aGlzLmZvcm0uZGVsZXRlKHVybCwgZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuZm9ybS5kZWxldGUodXJsLCBkYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIERlbGV0ZSBhbiBpdGVtIGJ5IHJvdy5cclxuICAgKi9cclxuICBhc3luYyBkZWxldGVSb3cocm93OiBudW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgIG1zZz86IE51bGxhYmxlPHN0cmluZz4sXHJcbiAgICAgICAgICAgICAgICAgIHVybD86IE51bGxhYmxlPHN0cmluZz4sXHJcbiAgICAgICAgICAgICAgICAgIGRhdGE/OiBOdWxsYWJsZTxSZWNvcmQ8c3RyaW5nLCBhbnk+Pik6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgY29uc3QgY2ggPSB0aGlzLmdldENoZWNrYm94QnlSb3cocm93KTtcclxuXHJcbiAgICBpZiAoIWNoKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5kZWxldGVJdGVtKGNoLnZhbHVlLCBtc2csIHVybCwgZGF0YSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBEZWxldGUgYW4gaXRlbS5cclxuICAgKi9cclxuICBhc3luYyBkZWxldGVJdGVtKGlkOiBzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICAgICBtc2c/OiBOdWxsYWJsZTxzdHJpbmc+LFxyXG4gICAgICAgICAgICAgICAgICAgdXJsPzogTnVsbGFibGU8c3RyaW5nPixcclxuICAgICAgICAgICAgICAgICAgIGRhdGE/OiBOdWxsYWJsZTxSZWNvcmQ8c3RyaW5nLCBhbnk+Pik6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgbXNnID0gbXNnIHx8IF9fKCd1bmljb3JuLm1lc3NhZ2UuZGVsZXRlLmNvbmZpcm0nKTtcclxuXHJcbiAgICBjb25zdCBpc0NvbmZpcm0gPSBhd2FpdCBkZWxldGVDb25maXJtKG1zZyk7XHJcblxyXG4gICAgaWYgKGlzQ29uZmlybSkge1xyXG4gICAgICAvLyB0aGlzLnRvZ2dsZUFsbChmYWxzZSk7XHJcbiAgICAgIC8vIHRoaXMuY2hlY2tSb3cocm93KTtcclxuICAgICAgZGF0YSA9IGRhdGEgfHwge307XHJcblxyXG4gICAgICBkYXRhLmlkID0gaWQ7XHJcblxyXG4gICAgICB0aGlzLmZvcm0uZGVsZXRlKHVybCwgZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGlzQ29uZmlybTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRvZ2dsZSBhbGwgY2hlY2tib3hlcy5cclxuICAgKi9cclxuICB0b2dnbGVBbGwodmFsdWU6IGJvb2xlYW4pIHtcclxuICAgIEFycmF5LmZyb20oXHJcbiAgICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxJbnB1dEVsZW1lbnQ+KCdpbnB1dFtkYXRhLXJvbGU9Z3JpZC1jaGVja2JveF1bdHlwZT1jaGVja2JveF0nKVxyXG4gICAgKVxyXG4gICAgICAuZm9yRWFjaCgoaW5wdXQpID0+IHtcclxuICAgICAgICBpbnB1dC5jaGVja2VkID0gdmFsdWU7XHJcblxyXG4gICAgICAgIGlucHV0LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdpbnB1dCcpKTtcclxuICAgICAgICBpbnB1dC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnY2hhbmdlJykpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIGRpc2FibGVBbGxDaGVja2JveGVzKCkge1xyXG4gICAgQXJyYXkuZnJvbShcclxuICAgICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTElucHV0RWxlbWVudD4oJ2lucHV0W2RhdGEtcm9sZT1ncmlkLWNoZWNrYm94XVt0eXBlPWNoZWNrYm94XScpXHJcbiAgICApXHJcbiAgICAgIC5mb3JFYWNoKChpbnB1dCkgPT4ge1xyXG4gICAgICAgIGlucHV0LmRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDb3VudCBjaGVja2VkIGNoZWNrYm94ZXMuXHJcbiAgICovXHJcbiAgY291bnRDaGVja2VkKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5nZXRDaGVja2VkKCkubGVuZ3RoO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IENoZWNrZWQgYm94ZXMuXHJcbiAgICovXHJcbiAgZ2V0Q2hlY2tlZCgpOiBIVE1MSW5wdXRFbGVtZW50W10ge1xyXG4gICAgcmV0dXJuIEFycmF5LmZyb20oXHJcbiAgICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxJbnB1dEVsZW1lbnQ+KCdpbnB1dFtkYXRhLXJvbGU9Z3JpZC1jaGVja2JveF1bdHlwZT1jaGVja2JveF06Y2hlY2tlZCcpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q2hlY2tlZFZhbHVlcygpOiBzdHJpbmdbXSB7XHJcbiAgICByZXR1cm4gdGhpcy5nZXRDaGVja2VkKCkubWFwKGlucHV0ID0+IGlucHV0LnZhbHVlKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFZhbGlkYXRlIHRoZXJlIGhhcyBvbmUgb3IgbW9yZSBjaGVja2VkIGJveGVzLlxyXG4gICAqL1xyXG4gIHZhbGlkYXRlQ2hlY2tlZChldmVudD86IEV2ZW50LCBjYWxsYmFjaz86IChncmlkOiBVbmljb3JuR3JpZEVsZW1lbnQpID0+IGFueSwgbXNnPzogc3RyaW5nKTogdGhpcyB7XHJcbiAgICBtc2cgPSBtc2cgfHwgX18oJ3VuaWNvcm4ubWVzc2FnZS5ncmlkLmNoZWNrZWQnKTtcclxuXHJcbiAgICBpZiAoIXRoaXMuaGFzQ2hlY2tlZCgpKSB7XHJcbiAgICAgIGlmIChtc2cgIT09ICcnKSB7XHJcbiAgICAgICAgc2ltcGxlQWxlcnQobXNnKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGV2ZW50KSB7XHJcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgIGNhbGxiYWNrKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgaGFzQ2hlY2tlZCgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLmNvdW50Q2hlY2tlZCgpID4gMDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlb3JkZXIgYWxsLlxyXG4gICAqL1xyXG4gIHJlb3JkZXJBbGwodXJsPzogTnVsbGFibGU8c3RyaW5nPiwgZGF0YT86IE51bGxhYmxlPFJlY29yZDxzdHJpbmcsIGFueT4+KSB7XHJcbiAgICByZXR1cm4gdGhpcy51cGRhdGVMaXN0QnlUYXNrKCdyZW9yZGVyJywgdXJsLCBkYXRhKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlb3JkZXIgaXRlbXMuXHJcbiAgICovXHJcbiAgbW92ZUl0ZW0oaWQ6IG51bWJlciB8IHN0cmluZywgZGVsdGE6IG51bWJlciwgdXJsPzogTnVsbGFibGU8c3RyaW5nPiwgZGF0YT86IE51bGxhYmxlPFJlY29yZDxzdHJpbmcsIGFueT4+KTogYm9vbGVhbiB7XHJcbiAgICBkYXRhID0gZGF0YSB8fCB7fTtcclxuICAgIGRhdGEuZGVsdGEgPSBkZWx0YTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy51cGRhdGVJdGVtQnlUYXNrKCdtb3ZlJywgaWQsIHVybCwgZGF0YSk7XHJcbiAgfVxyXG5cclxuICBtb3ZlVXAoaWQ6IHN0cmluZyB8IG51bWJlciwgdXJsPzogTnVsbGFibGU8c3RyaW5nPiwgZGF0YT86IE51bGxhYmxlPFJlY29yZDxzdHJpbmcsIGFueT4+KTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5tb3ZlSXRlbShpZCwgLTEsIHVybCwgZGF0YSk7XHJcbiAgfVxyXG5cclxuICBtb3ZlRG93bihpZDogc3RyaW5nIHwgbnVtYmVyLCB1cmw/OiBOdWxsYWJsZTxzdHJpbmc+LCBkYXRhPzogTnVsbGFibGU8UmVjb3JkPHN0cmluZywgYW55Pj4pOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLm1vdmVJdGVtKGlkLCAxLCB1cmwsIGRhdGEpO1xyXG4gIH1cclxuXHJcbiAgZ2V0SWQoc3VmZml4ID0gJycpIHtcclxuICAgIHJldHVybiB0aGlzLmZvcm0uZWxlbWVudD8uaWQgKyBzdWZmaXg7XHJcbiAgfVxyXG59XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBSU8sTUFBTSxtQkFBbUI7QUFBQSxFQUs5QixZQUNFLFVBQ08sU0FDQSxNQUNQLFVBQStCLENBQUEsR0FDL0I7QUFITyxTQUFBLFVBQUE7QUFDQSxTQUFBLE9BQUE7QUFHUCxTQUFLLFVBQVUsRUFBRSxHQUFHLFFBQUE7QUFFcEIsU0FBSyxXQUFBO0FBQUEsRUFDUDtBQUFBLEVBYkE7QUFBQSxFQUNBLFdBQVc7QUFBQSxFQUNYLFFBQVEsQ0FBQTtBQUFBLEVBYVIsYUFBYTtBQUNYLFVBQU0sU0FBUyxLQUFLLFFBQVEsaUJBQW1DLGdDQUFnQztBQUUvRixlQUFXLE1BQU0sUUFBUTtBQUN2QixTQUFHLGlCQUFpQixTQUFTLE1BQU07QUFDakMsV0FBRyxjQUFjLElBQUksWUFBWSxRQUFRLENBQUM7QUFBQSxNQUM1QyxDQUFDO0FBQ0QsU0FBRyxpQkFBaUIsVUFBVSxNQUFNO0FBQ2xDLGNBQU0sUUFBUSxJQUFJLFlBQVks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
