import { l as loadAlpine, Q as slideDown, P as slideUp, A as h, _ as __, F as simpleConfirm, a8 as deleteConfirm, G as simpleAlert } from "./unicorn-G5leHO5V.js";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC1fMnFSMGJUaS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21vZHVsZS9ncmlkLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IF9fLCBkZWxldGVDb25maXJtLCBoLCBsb2FkQWxwaW5lLCBzaW1wbGVBbGVydCwgc2ltcGxlQ29uZmlybSwgc2xpZGVEb3duLCBzbGlkZVVwIH0gZnJvbSAnLi4vc2VydmljZSc7XHJcbmltcG9ydCB7IE51bGxhYmxlIH0gZnJvbSAnLi4vdHlwZXMnO1xyXG5pbXBvcnQgdHlwZSB7IFVuaWNvcm5Gb3JtRWxlbWVudCB9IGZyb20gJy4vZm9ybSc7XHJcblxyXG5leHBvcnQgY2xhc3MgVW5pY29ybkdyaWRFbGVtZW50IHtcclxuICBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xyXG4gIG9yZGVyaW5nID0gJyc7XHJcbiAgc3RhdGUgPSB7fTtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBzZWxlY3Rvcjogc3RyaW5nLFxyXG4gICAgcHVibGljIGVsZW1lbnQ6IEhUTUxFbGVtZW50LFxyXG4gICAgcHVibGljIGZvcm06IFVuaWNvcm5Gb3JtRWxlbWVudCxcclxuICAgIG9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fVxyXG4gICkge1xyXG4gICAgdGhpcy5vcHRpb25zID0geyAuLi5vcHRpb25zIH07XHJcblxyXG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XHJcbiAgfVxyXG5cclxuICBiaW5kRXZlbnRzKCkge1xyXG4gICAgY29uc3QgaW5wdXRzID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTElucHV0RWxlbWVudD4oJ2lucHV0W2RhdGEtcm9sZT1ncmlkLWNoZWNrYm94XScpO1xyXG5cclxuICAgIGZvciAoY29uc3QgY2ggb2YgaW5wdXRzKSB7XHJcbiAgICAgIGNoLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgIGNoLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdjaGFuZ2UnKSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBjaC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ3VuaWNvcm46Y2hlY2tlZCcsIHtcclxuICAgICAgICAgIGRldGFpbDogeyBncmlkOiB0aGlzIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5mb3JtLmVsZW1lbnQ/LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGluaXRDb21wb25lbnQoc3RvcmUgPSAnZ3JpZCcsIGN1c3RvbTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9KSB7XHJcbiAgICB0aGlzLm9yZGVyaW5nID0gdGhpcy5lbGVtZW50Py5kYXRhc2V0Py5vcmRlcmluZyB8fCAnJztcclxuXHJcbiAgICBpZiAodGhpcy5vcmRlcmluZykge1xyXG4gICAgICBpZiAoIXRoaXMub3JkZXJpbmcudG9Mb3dlckNhc2UoKS5lbmRzV2l0aCgnIGFzYycpXHJcbiAgICAgICAgJiYgIXRoaXMub3JkZXJpbmcudG9Mb3dlckNhc2UoKS5lbmRzV2l0aCgnIGRlc2MnKSkge1xyXG4gICAgICAgIHRoaXMub3JkZXJpbmcgKz0gJyBBU0MnO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGxvYWRBbHBpbmUoKEFscGluZSkgPT4ge1xyXG4gICAgICBBbHBpbmUuc3RvcmUoc3RvcmUsIHRoaXMudXNlU3RhdGUoY3VzdG9tKSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVzZVN0YXRlKHRoaXM6IGFueSwgY3VzdG9tOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge30pIHtcclxuICAgIGNvbnN0IHN0YXRlOiBQYXJ0aWFsPFJlY29yZDxzdHJpbmcsIGFueT4+ID0ge1xyXG4gICAgICBmb3JtOiB0aGlzLmZvcm0udXNlU3RhdGUoY3VzdG9tKSxcclxuICAgIH07XHJcblxyXG4gICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoT2JqZWN0LmdldFByb3RvdHlwZU9mKHRoaXMpKVxyXG4gICAgICAubWFwKGl0ZW0gPT4ge1xyXG4gICAgICAgIGNvbnN0IHByb3AgPSB0aGlzW2l0ZW1dO1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIHByb3AgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgIHJldHVybiBzdGF0ZVtpdGVtXSA9IHRoaXNbaXRlbV0uYmluZCh0aGlzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihcclxuICAgICAgc3RhdGUsXHJcbiAgICAgIGN1c3RvbVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGdldEVsZW1lbnQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50O1xyXG4gIH1cclxuXHJcbiAgc2VuZEZpbHRlcigkZXZlbnQ/OiBFdmVudCwgbWV0aG9kPzogc3RyaW5nKSB7XHJcbiAgICBpZiAoJGV2ZW50KSB7XHJcbiAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZm9ybS5zdWJtaXQobnVsbCwgbnVsbCwgbWV0aG9kKTtcclxuICB9XHJcblxyXG4gIGNsZWFyRmlsdGVycyhlbGVtZW50OiBIVE1MRWxlbWVudCwgbWV0aG9kPzogTnVsbGFibGU8c3RyaW5nPik6IHZvaWQge1xyXG4gICAgZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCwgdGV4dGFyZWEsIHNlbGVjdCcpLmZvckVhY2goKGVsZSkgPT4ge1xyXG4gICAgICAoZWxlIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlID0gJyc7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmZvcm0uc3VibWl0KG51bGwsIG51bGwsIG1ldGhvZCk7XHJcbiAgfVxyXG5cclxuICBhc3luYyB0b2dnbGVGaWx0ZXJzKG9wZW46IGJvb2xlYW4sIGZpbHRlckZvcm06IEhUTUxFbGVtZW50KSB7XHJcbiAgICBpZiAob3Blbikge1xyXG4gICAgICBhd2FpdCBzbGlkZURvd24oZmlsdGVyRm9ybSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBhd2FpdCBzbGlkZVVwKGZpbHRlckZvcm0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc29ydCgkZWw6IEhUTUxFbGVtZW50KTogYm9vbGVhbiB7XHJcbiAgICBjb25zdCBkaXIgPSB0aGlzLmdldERpcmVjdGlvbigkZWwpO1xyXG5cclxuICAgIGNvbnN0IGZpZWxkID0gJGVsLmRhdGFzZXQuZmllbGQ7XHJcbiAgICBsZXQgYXNjID0gJGVsLmRhdGFzZXQuYXNjO1xyXG4gICAgbGV0IGRlc2MgPSAkZWwuZGF0YXNldC5kZXNjO1xyXG5cclxuICAgIGlmIChmaWVsZCkge1xyXG4gICAgICBhc2MgPSBmaWVsZCArICcgQVNDJztcclxuICAgICAgZGVzYyA9IGZpZWxkICsgJyBERVNDJztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZGlyID09PSAnQVNDJykge1xyXG4gICAgICByZXR1cm4gdGhpcy5zb3J0QnkoZGVzYyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuc29ydEJ5KGFzYyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTb3J0IHR3byBpdGVtcy5cclxuICAgKi9cclxuICBzb3J0Qnkob3JkZXJpbmc6IE51bGxhYmxlPHN0cmluZz4pOiBib29sZWFuIHtcclxuICAgIGlmICghb3JkZXJpbmcpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBvcmRlcmluZ0lucHV0ID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTElucHV0RWxlbWVudD4oJ2lucHV0W25hbWU9bGlzdF9vcmRlcmluZ10nKTtcclxuXHJcbiAgICBpZiAoIW9yZGVyaW5nSW5wdXQpIHtcclxuICAgICAgb3JkZXJpbmdJbnB1dCA9IGgoJ2lucHV0JywgeyBuYW1lOiAnbGlzdF9vcmRlcmluZycsIHR5cGU6ICdoaWRkZW4nLCB2YWx1ZTogJycgfSk7XHJcblxyXG4gICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQob3JkZXJpbmdJbnB1dCk7XHJcbiAgICB9XHJcblxyXG4gICAgb3JkZXJpbmdJbnB1dC52YWx1ZSA9IG9yZGVyaW5nO1xyXG5cclxuICAgIHJldHVybiB0aGlzLmZvcm0ucHV0KCk7XHJcbiAgfVxyXG5cclxuICBpc1NvcnRBY3RpdmUoJGVsOiBIVE1MRWxlbWVudCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuZ2V0RGlyZWN0aW9uKCRlbCkgIT0gbnVsbDtcclxuICB9XHJcblxyXG4gIGdldERpcmVjdGlvbigkZWw6IEhUTUxFbGVtZW50KTogXCJBU0NcIiB8IFwiREVTQ1wiIHwgbnVsbCB7XHJcbiAgICBjb25zdCBmaWVsZCA9ICRlbC5kYXRhc2V0LmZpZWxkO1xyXG4gICAgbGV0IGFzYyA9ICRlbC5kYXRhc2V0LmFzYztcclxuICAgIGxldCBkZXNjID0gJGVsLmRhdGFzZXQuZGVzYztcclxuXHJcbiAgICBpZiAoZmllbGQpIHtcclxuICAgICAgYXNjID0gZmllbGQgKyAnIEFTQyc7XHJcbiAgICAgIGRlc2MgPSBmaWVsZCArICcgREVTQyc7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMub3JkZXJpbmdFcXVhbHMoYXNjLCB0aGlzLm9yZGVyaW5nKSkge1xyXG4gICAgICByZXR1cm4gJ0FTQyc7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMub3JkZXJpbmdFcXVhbHMoZGVzYywgdGhpcy5vcmRlcmluZykpIHtcclxuICAgICAgcmV0dXJuICdERVNDJztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIG9yZGVyaW5nRXF1YWxzKGE6IE51bGxhYmxlPHN0cmluZz4sIGI6IE51bGxhYmxlPHN0cmluZz4pOiBib29sZWFuIHtcclxuICAgIGEgPSBhIHx8ICcnO1xyXG4gICAgYiA9IGIgfHwgJyc7XHJcblxyXG4gICAgYSA9IGEucmVwbGFjZSgvXFxzKy9nLCAnICcpLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgYiA9IGIucmVwbGFjZSgvXFxzKy9nLCAnICcpLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xyXG5cclxuICAgIHJldHVybiBhID09PSBiO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2hlY2sgYSByb3cncyBjaGVja2JveC5cclxuICAgKi9cclxuICBjaGVja1Jvdyhyb3c6IG51bWJlciwgdmFsdWUgPSB0cnVlKTogdm9pZCB7XHJcbiAgICBjb25zdCBjaCA9IHRoaXMuZ2V0Q2hlY2tib3hCeVJvdyhyb3cpO1xyXG5cclxuICAgIGlmICghY2gpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDaGVja2JveCBvZiByb3c6ICcgKyByb3cgKyAnIG5vdCBmb3VuZC4nKTtcclxuICAgIH1cclxuXHJcbiAgICBjaC5jaGVja2VkID0gdmFsdWU7XHJcbiAgICBjaC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnaW5wdXQnKSk7XHJcbiAgICBjaC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnY2hhbmdlJykpO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q2hlY2tib3hCeVJvdyhyb3c6IG51bWJlcik6IE51bGxhYmxlPEhUTUxJbnB1dEVsZW1lbnQ+IHtcclxuICAgIHJldHVybiB0aGlzLmZvcm0uZWxlbWVudD8ucXVlcnlTZWxlY3RvcjxIVE1MSW5wdXRFbGVtZW50PihcclxuICAgICAgYGlucHV0W2RhdGEtcm9sZT1ncmlkLWNoZWNrYm94XVtkYXRhLXJvdy1udW1iZXI9XCIke3Jvd31cIl1gXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVXBkYXRlIGEgcm93LlxyXG4gICAqL1xyXG4gIHVwZGF0ZVJvdyhyb3c6IG51bWJlciwgdXJsPzogTnVsbGFibGU8c3RyaW5nPiwgZGF0YT86IE51bGxhYmxlPFJlY29yZDxzdHJpbmcsIGFueT4+KSB7XHJcbiAgICBjb25zdCBjaCA9IHRoaXMuZ2V0Q2hlY2tib3hCeVJvdyhyb3cpO1xyXG5cclxuICAgIGlmICghY2gpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLnVwZGF0ZUl0ZW0oY2gudmFsdWUsIHVybCwgZGF0YSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBVcGRhdGUgYW4gaXRlbSBieSBpZC5cclxuICAgKi9cclxuICB1cGRhdGVJdGVtKGlkOiBzdHJpbmcgfCBudW1iZXIsIHVybD86IE51bGxhYmxlPHN0cmluZz4sIGRhdGE/OiBOdWxsYWJsZTxSZWNvcmQ8c3RyaW5nLCBhbnk+Pik6IGJvb2xlYW4ge1xyXG4gICAgdGhpcy50b2dnbGVBbGwoZmFsc2UpO1xyXG5cclxuICAgIHRoaXMuZGlzYWJsZUFsbENoZWNrYm94ZXMoKTtcclxuXHJcbiAgICB0aGlzLmZvcm0uaW5qZWN0SW5wdXQoJ2lkW10nLCBpZCk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuZm9ybS5wYXRjaCh1cmwsIGRhdGEpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVXBkYXRlIGEgaXRlbSB3aXRoIGJhdGNoIHRhc2suXHJcbiAgICovXHJcbiAgdXBkYXRlSXRlbUJ5VGFzayhcclxuICAgIHRhc2s6IHN0cmluZyxcclxuICAgIGlkOiBzdHJpbmcgfCBudW1iZXIsXHJcbiAgICB1cmw/OiBOdWxsYWJsZTxzdHJpbmc+LFxyXG4gICAgZGF0YT86IE51bGxhYmxlPFJlY29yZDxzdHJpbmcsIGFueT4+XHJcbiAgKTogYm9vbGVhbiB7XHJcbiAgICBkYXRhID0gZGF0YSB8fCB7fTtcclxuICAgIGRhdGEudGFzayA9IHRhc2s7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMudXBkYXRlSXRlbShpZCwgdXJsLCBkYXRhKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFVwZGF0ZSBhIHJvdyB3aXRoIGJhdGNoIHRhc2suXHJcbiAgICovXHJcbiAgdXBkYXRlUm93QnlUYXNrKHRhc2s6IHN0cmluZywgcm93OiBudW1iZXIsIHVybD86IE51bGxhYmxlPHN0cmluZz4sIGRhdGE/OiBOdWxsYWJsZTxSZWNvcmQ8c3RyaW5nLCBhbnk+Pik6IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgY2ggPSB0aGlzLmdldENoZWNrYm94QnlSb3cocm93KTtcclxuXHJcbiAgICBpZiAoIWNoKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy51cGRhdGVJdGVtQnlUYXNrKHRhc2ssIGNoLnZhbHVlLCB1cmwsIGRhdGEpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQmF0Y2ggdXBkYXRlIGl0ZW1zLlxyXG4gICAqL1xyXG4gIHVwZGF0ZUxpc3RCeVRhc2sodGFzazogc3RyaW5nLCB1cmw/OiBOdWxsYWJsZTxzdHJpbmc+LCBkYXRhPzogTnVsbGFibGU8UmVjb3JkPHN0cmluZywgYW55Pj4pOiBib29sZWFuIHtcclxuICAgIGRhdGEgPSBkYXRhIHx8IHt9O1xyXG4gICAgZGF0YS50YXNrID0gdGFzaztcclxuXHJcbiAgICByZXR1cm4gdGhpcy5mb3JtLnBhdGNoKHVybCwgZGF0YSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDb3B5IGEgcm93LlxyXG4gICAqL1xyXG4gIGNvcHlJdGVtKGlkOiBzdHJpbmcgfCBudW1iZXIsIHVybD86IE51bGxhYmxlPHN0cmluZz4sIGRhdGE/OiBOdWxsYWJsZTxSZWNvcmQ8c3RyaW5nLCBhbnk+Pik6IGJvb2xlYW4ge1xyXG4gICAgdGhpcy50b2dnbGVBbGwoZmFsc2UpO1xyXG5cclxuICAgIHRoaXMuZGlzYWJsZUFsbENoZWNrYm94ZXMoKTtcclxuXHJcbiAgICB0aGlzLmZvcm0uaW5qZWN0SW5wdXQoJ2lkW10nLCBpZCk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuZm9ybS5wb3N0KHVybCwgZGF0YSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDb3B5IGEgcm93LlxyXG4gICAqL1xyXG4gIGNvcHlSb3cocm93OiBudW1iZXIsIHVybD86IE51bGxhYmxlPHN0cmluZz4sIGRhdGE/OiBOdWxsYWJsZTxSZWNvcmQ8c3RyaW5nLCBhbnk+Pik6IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgY2ggPSB0aGlzLmdldENoZWNrYm94QnlSb3cocm93KTtcclxuXHJcbiAgICBpZiAoIWNoKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5jb3B5SXRlbShjaC52YWx1ZSwgdXJsLCBkYXRhKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIERlbGV0ZSBjaGVja2VkIGl0ZW1zLlxyXG4gICAqL1xyXG4gIGRlbGV0ZUxpc3QoXHJcbiAgICBtZXNzYWdlPzogTnVsbGFibGU8c3RyaW5nPiB8IGZhbHNlLFxyXG4gICAgdXJsPzogTnVsbGFibGU8c3RyaW5nPixcclxuICAgIGRhdGE/OiBOdWxsYWJsZTxSZWNvcmQ8c3RyaW5nLCBhbnk+PlxyXG4gICk6IGJvb2xlYW4ge1xyXG4gICAgaWYgKCF0aGlzLnZhbGlkYXRlQ2hlY2tlZCgpKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBtZXNzYWdlID0gbWVzc2FnZSA9PSBudWxsID8gX18oJ3VuaWNvcm4ubWVzc2FnZS5kZWxldGUuY29uZmlybScpIDogbWVzc2FnZTtcclxuXHJcbiAgICBpZiAobWVzc2FnZSAhPT0gZmFsc2UpIHtcclxuICAgICAgc2ltcGxlQ29uZmlybShtZXNzYWdlKS50aGVuKGlzQ29uZmlybSA9PiB7XHJcbiAgICAgICAgaWYgKGlzQ29uZmlybSkge1xyXG4gICAgICAgICAgdGhpcy5mb3JtLmRlbGV0ZSh1cmwsIGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmZvcm0uZGVsZXRlKHVybCwgZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBEZWxldGUgYW4gaXRlbSBieSByb3cuXHJcbiAgICovXHJcbiAgYXN5bmMgZGVsZXRlUm93KHJvdzogbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICBtc2c/OiBOdWxsYWJsZTxzdHJpbmc+LFxyXG4gICAgICAgICAgICAgICAgICB1cmw/OiBOdWxsYWJsZTxzdHJpbmc+LFxyXG4gICAgICAgICAgICAgICAgICBkYXRhPzogTnVsbGFibGU8UmVjb3JkPHN0cmluZywgYW55Pj4pOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgIGNvbnN0IGNoID0gdGhpcy5nZXRDaGVja2JveEJ5Um93KHJvdyk7XHJcblxyXG4gICAgaWYgKCFjaCkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuZGVsZXRlSXRlbShjaC52YWx1ZSwgbXNnLCB1cmwsIGRhdGEpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRGVsZXRlIGFuIGl0ZW0uXHJcbiAgICovXHJcbiAgYXN5bmMgZGVsZXRlSXRlbShpZDogc3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgICAgbXNnPzogTnVsbGFibGU8c3RyaW5nPixcclxuICAgICAgICAgICAgICAgICAgIHVybD86IE51bGxhYmxlPHN0cmluZz4sXHJcbiAgICAgICAgICAgICAgICAgICBkYXRhPzogTnVsbGFibGU8UmVjb3JkPHN0cmluZywgYW55Pj4pOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgIG1zZyA9IG1zZyB8fCBfXygndW5pY29ybi5tZXNzYWdlLmRlbGV0ZS5jb25maXJtJyk7XHJcblxyXG4gICAgY29uc3QgaXNDb25maXJtID0gYXdhaXQgZGVsZXRlQ29uZmlybShtc2cpO1xyXG5cclxuICAgIGlmIChpc0NvbmZpcm0pIHtcclxuICAgICAgLy8gdGhpcy50b2dnbGVBbGwoZmFsc2UpO1xyXG4gICAgICAvLyB0aGlzLmNoZWNrUm93KHJvdyk7XHJcbiAgICAgIGRhdGEgPSBkYXRhIHx8IHt9O1xyXG5cclxuICAgICAgZGF0YS5pZCA9IGlkO1xyXG5cclxuICAgICAgdGhpcy5mb3JtLmRlbGV0ZSh1cmwsIGRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBpc0NvbmZpcm07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUb2dnbGUgYWxsIGNoZWNrYm94ZXMuXHJcbiAgICovXHJcbiAgdG9nZ2xlQWxsKHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICBBcnJheS5mcm9tKFxyXG4gICAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MSW5wdXRFbGVtZW50PignaW5wdXRbZGF0YS1yb2xlPWdyaWQtY2hlY2tib3hdW3R5cGU9Y2hlY2tib3hdJylcclxuICAgIClcclxuICAgICAgLmZvckVhY2goKGlucHV0KSA9PiB7XHJcbiAgICAgICAgaW5wdXQuY2hlY2tlZCA9IHZhbHVlO1xyXG5cclxuICAgICAgICBpbnB1dC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnaW5wdXQnKSk7XHJcbiAgICAgICAgaW5wdXQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2NoYW5nZScpKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBkaXNhYmxlQWxsQ2hlY2tib3hlcygpIHtcclxuICAgIEFycmF5LmZyb20oXHJcbiAgICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxJbnB1dEVsZW1lbnQ+KCdpbnB1dFtkYXRhLXJvbGU9Z3JpZC1jaGVja2JveF1bdHlwZT1jaGVja2JveF0nKVxyXG4gICAgKVxyXG4gICAgICAuZm9yRWFjaCgoaW5wdXQpID0+IHtcclxuICAgICAgICBpbnB1dC5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ291bnQgY2hlY2tlZCBjaGVja2JveGVzLlxyXG4gICAqL1xyXG4gIGNvdW50Q2hlY2tlZCgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuZ2V0Q2hlY2tlZCgpLmxlbmd0aDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBDaGVja2VkIGJveGVzLlxyXG4gICAqL1xyXG4gIGdldENoZWNrZWQoKTogSFRNTElucHV0RWxlbWVudFtdIHtcclxuICAgIHJldHVybiBBcnJheS5mcm9tKFxyXG4gICAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MSW5wdXRFbGVtZW50PignaW5wdXRbZGF0YS1yb2xlPWdyaWQtY2hlY2tib3hdW3R5cGU9Y2hlY2tib3hdOmNoZWNrZWQnKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGdldENoZWNrZWRWYWx1ZXMoKTogc3RyaW5nW10ge1xyXG4gICAgcmV0dXJuIHRoaXMuZ2V0Q2hlY2tlZCgpLm1hcChpbnB1dCA9PiBpbnB1dC52YWx1ZSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBWYWxpZGF0ZSB0aGVyZSBoYXMgb25lIG9yIG1vcmUgY2hlY2tlZCBib3hlcy5cclxuICAgKi9cclxuICB2YWxpZGF0ZUNoZWNrZWQoZXZlbnQ/OiBFdmVudCwgY2FsbGJhY2s/OiAoZ3JpZDogVW5pY29ybkdyaWRFbGVtZW50KSA9PiBhbnksIG1zZz86IHN0cmluZyk6IHRoaXMge1xyXG4gICAgbXNnID0gbXNnIHx8IF9fKCd1bmljb3JuLm1lc3NhZ2UuZ3JpZC5jaGVja2VkJyk7XHJcblxyXG4gICAgaWYgKCF0aGlzLmhhc0NoZWNrZWQoKSkge1xyXG4gICAgICBpZiAobXNnICE9PSAnJykge1xyXG4gICAgICAgIHNpbXBsZUFsZXJ0KG1zZyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChldmVudCkge1xyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChjYWxsYmFjaykge1xyXG4gICAgICBjYWxsYmFjayh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIGhhc0NoZWNrZWQoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5jb3VudENoZWNrZWQoKSA+IDA7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZW9yZGVyIGFsbC5cclxuICAgKi9cclxuICByZW9yZGVyQWxsKHVybD86IE51bGxhYmxlPHN0cmluZz4sIGRhdGE/OiBOdWxsYWJsZTxSZWNvcmQ8c3RyaW5nLCBhbnk+Pikge1xyXG4gICAgcmV0dXJuIHRoaXMudXBkYXRlTGlzdEJ5VGFzaygncmVvcmRlcicsIHVybCwgZGF0YSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZW9yZGVyIGl0ZW1zLlxyXG4gICAqL1xyXG4gIG1vdmVJdGVtKGlkOiBudW1iZXIgfCBzdHJpbmcsIGRlbHRhOiBudW1iZXIsIHVybD86IE51bGxhYmxlPHN0cmluZz4sIGRhdGE/OiBOdWxsYWJsZTxSZWNvcmQ8c3RyaW5nLCBhbnk+Pik6IGJvb2xlYW4ge1xyXG4gICAgZGF0YSA9IGRhdGEgfHwge307XHJcbiAgICBkYXRhLmRlbHRhID0gZGVsdGE7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMudXBkYXRlSXRlbUJ5VGFzaygnbW92ZScsIGlkLCB1cmwsIGRhdGEpO1xyXG4gIH1cclxuXHJcbiAgbW92ZVVwKGlkOiBzdHJpbmcgfCBudW1iZXIsIHVybD86IE51bGxhYmxlPHN0cmluZz4sIGRhdGE/OiBOdWxsYWJsZTxSZWNvcmQ8c3RyaW5nLCBhbnk+Pik6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMubW92ZUl0ZW0oaWQsIC0xLCB1cmwsIGRhdGEpO1xyXG4gIH1cclxuXHJcbiAgbW92ZURvd24oaWQ6IHN0cmluZyB8IG51bWJlciwgdXJsPzogTnVsbGFibGU8c3RyaW5nPiwgZGF0YT86IE51bGxhYmxlPFJlY29yZDxzdHJpbmcsIGFueT4+KTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5tb3ZlSXRlbShpZCwgMSwgdXJsLCBkYXRhKTtcclxuICB9XHJcblxyXG4gIGdldElkKHN1ZmZpeCA9ICcnKSB7XHJcbiAgICByZXR1cm4gdGhpcy5mb3JtLmVsZW1lbnQ/LmlkICsgc3VmZml4O1xyXG4gIH1cclxufVxyXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUlPLE1BQU0sbUJBQW1CO0FBQUEsRUFLOUIsWUFDRSxVQUNPLFNBQ0EsTUFDUCxVQUErQixDQUFBLEdBQy9CO0FBSE8sU0FBQSxVQUFBO0FBQ0EsU0FBQSxPQUFBO0FBR1AsU0FBSyxVQUFVLEVBQUUsR0FBRyxRQUFBO0FBRXBCLFNBQUssV0FBQTtBQUFBLEVBQ1A7QUFBQSxFQWJBO0FBQUEsRUFDQSxXQUFXO0FBQUEsRUFDWCxRQUFRLENBQUE7QUFBQSxFQWFSLGFBQWE7QUFDWCxVQUFNLFNBQVMsS0FBSyxRQUFRLGlCQUFtQyxnQ0FBZ0M7QUFFL0YsZUFBVyxNQUFNLFFBQVE7QUFDdkIsU0FBRyxpQkFBaUIsU0FBUyxNQUFNO0FBQ2pDLFdBQUcsY0FBYyxJQUFJLFlBQVksUUFBUSxDQUFDO0FBQUEsTUFDNUMsQ0FBQztBQUNELFNBQUcsaUJBQWlCLFVBQVUsTUFBTTtBQUNsQyxjQUFNLFFBQVEsSUFBSSxZQUFZLG1CQUFtQjtBQUFBLFVBQy9DLFFBQVEsRUFBRSxNQUFNLEtBQUE7QUFBQSxRQUFLLENBQ3RCO0FBRUQsYUFBSyxLQUFLLFNBQVMsY0FBYyxLQUFLO0FBQUEsTUFDeEMsQ0FBQztBQUFBLElBQ0g7QUFBQSxFQUNGO0FBQUEsRUFFQSxjQUFjLFFBQVEsUUFBUSxTQUFpQyxDQUFBLEdBQUk7QUFDakUsU0FBSyxXQUFXLEtBQUssU0FBUyxTQUFTLFlBQVk7QUFFbkQsUUFBSSxLQUFLLFVBQVU7QUFDakIsVUFBSSxDQUFDLEtBQUssU0FBUyxZQUFBLEVBQWMsU0FB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
