import { t as loadAlpine, v as slideDown, n as slideUp, w as h, _ as __, x as simpleConfirm, y as deleteConfirm, e as simpleAlert } from "./unicorn-D5cXQeSK.js";
class UnicornGridElement {
  constructor(selector, element, form, options = {}) {
    this.element = element;
    this.form = form;
    this.options = { ...options };
    if (!this.form) {
      throw new Error("UnicornGrid is depends on UnicornForm");
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC1fTkZSeVhKVi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21vZHVsZS9ncmlkLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IF9fLCBkZWxldGVDb25maXJtLCBoLCBsb2FkQWxwaW5lLCBzaW1wbGVBbGVydCwgc2ltcGxlQ29uZmlybSwgc2xpZGVEb3duLCBzbGlkZVVwIH0gZnJvbSAnLi4vc2VydmljZSc7XG5pbXBvcnQgeyBOdWxsYWJsZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB0eXBlIHsgVW5pY29ybkZvcm1FbGVtZW50IH0gZnJvbSAnLi9mb3JtJztcblxuZXhwb3J0IGNsYXNzIFVuaWNvcm5HcmlkRWxlbWVudCB7XG4gIG9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT47XG4gIG9yZGVyaW5nID0gJyc7XG4gIHN0YXRlID0ge307XG5cbiAgY29uc3RydWN0b3IoXG4gICAgc2VsZWN0b3I6IHN0cmluZyxcbiAgICBwdWJsaWMgZWxlbWVudDogSFRNTEVsZW1lbnQsXG4gICAgcHVibGljIGZvcm06IFVuaWNvcm5Gb3JtRWxlbWVudCxcbiAgICBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge31cbiAgKSB7XG4gICAgdGhpcy5vcHRpb25zID0geyAuLi5vcHRpb25zIH07XG5cbiAgICBpZiAoIXRoaXMuZm9ybSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmljb3JuR3JpZCBpcyBkZXBlbmRzIG9uIFVuaWNvcm5Gb3JtJyk7XG4gICAgfVxuXG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XG4gIH1cblxuICBiaW5kRXZlbnRzKCkge1xuICAgIGNvbnN0IGlucHV0cyA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxJbnB1dEVsZW1lbnQ+KCdpbnB1dFtkYXRhLXJvbGU9Z3JpZC1jaGVja2JveF0nKTtcblxuICAgIGZvciAoY29uc3QgY2ggb2YgaW5wdXRzKSB7XG4gICAgICBjaC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgY2guZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2NoYW5nZScpKTtcbiAgICAgIH0pO1xuICAgICAgY2guYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBldmVudCA9IG5ldyBDdXN0b21FdmVudCgndW5pY29ybjpjaGVja2VkJywge1xuICAgICAgICAgIGRldGFpbDogeyBncmlkOiB0aGlzIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5mb3JtLmVsZW1lbnQ/LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgaW5pdENvbXBvbmVudChzdG9yZSA9ICdncmlkJywgY3VzdG9tOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge30pIHtcbiAgICB0aGlzLm9yZGVyaW5nID0gdGhpcy5lbGVtZW50Py5kYXRhc2V0Py5vcmRlcmluZyB8fCAnJztcblxuICAgIGlmICh0aGlzLm9yZGVyaW5nKSB7XG4gICAgICBpZiAoIXRoaXMub3JkZXJpbmcudG9Mb3dlckNhc2UoKS5lbmRzV2l0aCgnIGFzYycpXG4gICAgICAgICYmICF0aGlzLm9yZGVyaW5nLnRvTG93ZXJDYXNlKCkuZW5kc1dpdGgoJyBkZXNjJykpIHtcbiAgICAgICAgdGhpcy5vcmRlcmluZyArPSAnIEFTQyc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGxvYWRBbHBpbmUoKEFscGluZSkgPT4ge1xuICAgICAgQWxwaW5lLnN0b3JlKHN0b3JlLCB0aGlzLnVzZVN0YXRlKGN1c3RvbSkpO1xuICAgIH0pO1xuICB9XG5cbiAgdXNlU3RhdGUodGhpczogYW55LCBjdXN0b206IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fSkge1xuICAgIGNvbnN0IHN0YXRlOiBQYXJ0aWFsPFJlY29yZDxzdHJpbmcsIGFueT4+ID0ge1xuICAgICAgZm9ybTogdGhpcy5mb3JtLnVzZVN0YXRlKGN1c3RvbSksXG4gICAgfTtcblxuICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKE9iamVjdC5nZXRQcm90b3R5cGVPZih0aGlzKSlcbiAgICAgIC5tYXAoaXRlbSA9PiB7XG4gICAgICAgIGNvbnN0IHByb3AgPSB0aGlzW2l0ZW1dO1xuXG4gICAgICAgIGlmICh0eXBlb2YgcHJvcCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHJldHVybiBzdGF0ZVtpdGVtXSA9IHRoaXNbaXRlbV0uYmluZCh0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgfSk7XG5cbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihcbiAgICAgIHN0YXRlLFxuICAgICAgY3VzdG9tXG4gICAgKTtcbiAgfVxuXG4gIGdldEVsZW1lbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudDtcbiAgfVxuXG4gIHNlbmRGaWx0ZXIoJGV2ZW50PzogRXZlbnQsIG1ldGhvZD86IHN0cmluZykge1xuICAgIGlmICgkZXZlbnQpIHtcbiAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIHRoaXMuZm9ybS5zdWJtaXQobnVsbCwgbnVsbCwgbWV0aG9kKTtcbiAgfVxuXG4gIGNsZWFyRmlsdGVycyhlbGVtZW50OiBIVE1MRWxlbWVudCwgbWV0aG9kPzogTnVsbGFibGU8c3RyaW5nPik6IHZvaWQge1xuICAgIGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQsIHRleHRhcmVhLCBzZWxlY3QnKS5mb3JFYWNoKChlbGUpID0+IHtcbiAgICAgIChlbGUgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUgPSAnJztcbiAgICB9KTtcblxuICAgIHRoaXMuZm9ybS5zdWJtaXQobnVsbCwgbnVsbCwgbWV0aG9kKTtcbiAgfVxuXG4gIGFzeW5jIHRvZ2dsZUZpbHRlcnMob3BlbjogYm9vbGVhbiwgZmlsdGVyRm9ybTogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiAob3Blbikge1xuICAgICAgYXdhaXQgc2xpZGVEb3duKGZpbHRlckZvcm0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBhd2FpdCBzbGlkZVVwKGZpbHRlckZvcm0pO1xuICAgIH1cbiAgfVxuXG4gIHNvcnQoJGVsOiBIVE1MRWxlbWVudCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGRpciA9IHRoaXMuZ2V0RGlyZWN0aW9uKCRlbCk7XG5cbiAgICBjb25zdCBmaWVsZCA9ICRlbC5kYXRhc2V0LmZpZWxkO1xuICAgIGxldCBhc2MgPSAkZWwuZGF0YXNldC5hc2M7XG4gICAgbGV0IGRlc2MgPSAkZWwuZGF0YXNldC5kZXNjO1xuXG4gICAgaWYgKGZpZWxkKSB7XG4gICAgICBhc2MgPSBmaWVsZCArICcgQVNDJztcbiAgICAgIGRlc2MgPSBmaWVsZCArICcgREVTQyc7XG4gICAgfVxuXG4gICAgaWYgKGRpciA9PT0gJ0FTQycpIHtcbiAgICAgIHJldHVybiB0aGlzLnNvcnRCeShkZXNjKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zb3J0QnkoYXNjKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTb3J0IHR3byBpdGVtcy5cbiAgICovXG4gIHNvcnRCeShvcmRlcmluZzogTnVsbGFibGU8c3RyaW5nPik6IGJvb2xlYW4ge1xuICAgIGlmICghb3JkZXJpbmcpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBsZXQgb3JkZXJpbmdJbnB1dCA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yPEhUTUxJbnB1dEVsZW1lbnQ+KCdpbnB1dFtuYW1lPWxpc3Rfb3JkZXJpbmddJyk7XG5cbiAgICBpZiAoIW9yZGVyaW5nSW5wdXQpIHtcbiAgICAgIG9yZGVyaW5nSW5wdXQgPSBoKCdpbnB1dCcsIHsgbmFtZTogJ2xpc3Rfb3JkZXJpbmcnLCB0eXBlOiAnaGlkZGVuJywgdmFsdWU6ICcnIH0pO1xuXG4gICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQob3JkZXJpbmdJbnB1dCk7XG4gICAgfVxuXG4gICAgb3JkZXJpbmdJbnB1dC52YWx1ZSA9IG9yZGVyaW5nO1xuXG4gICAgcmV0dXJuIHRoaXMuZm9ybS5wdXQoKTtcbiAgfVxuXG4gIGlzU29ydEFjdGl2ZSgkZWw6IEhUTUxFbGVtZW50KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0RGlyZWN0aW9uKCRlbCkgIT0gbnVsbDtcbiAgfVxuXG4gIGdldERpcmVjdGlvbigkZWw6IEhUTUxFbGVtZW50KTogXCJBU0NcIiB8IFwiREVTQ1wiIHwgbnVsbCB7XG4gICAgY29uc3QgZmllbGQgPSAkZWwuZGF0YXNldC5maWVsZDtcbiAgICBsZXQgYXNjID0gJGVsLmRhdGFzZXQuYXNjO1xuICAgIGxldCBkZXNjID0gJGVsLmRhdGFzZXQuZGVzYztcblxuICAgIGlmIChmaWVsZCkge1xuICAgICAgYXNjID0gZmllbGQgKyAnIEFTQyc7XG4gICAgICBkZXNjID0gZmllbGQgKyAnIERFU0MnO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9yZGVyaW5nRXF1YWxzKGFzYywgdGhpcy5vcmRlcmluZykpIHtcbiAgICAgIHJldHVybiAnQVNDJztcbiAgICB9IGVsc2UgaWYgKHRoaXMub3JkZXJpbmdFcXVhbHMoZGVzYywgdGhpcy5vcmRlcmluZykpIHtcbiAgICAgIHJldHVybiAnREVTQyc7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBvcmRlcmluZ0VxdWFscyhhOiBOdWxsYWJsZTxzdHJpbmc+LCBiOiBOdWxsYWJsZTxzdHJpbmc+KTogYm9vbGVhbiB7XG4gICAgYSA9IGEgfHwgJyc7XG4gICAgYiA9IGIgfHwgJyc7XG5cbiAgICBhID0gYS5yZXBsYWNlKC9cXHMrL2csICcgJykudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG4gICAgYiA9IGIucmVwbGFjZSgvXFxzKy9nLCAnICcpLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgcmV0dXJuIGEgPT09IGI7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgYSByb3cncyBjaGVja2JveC5cbiAgICovXG4gIGNoZWNrUm93KHJvdzogbnVtYmVyLCB2YWx1ZSA9IHRydWUpOiB2b2lkIHtcbiAgICBjb25zdCBjaCA9IHRoaXMuZ2V0Q2hlY2tib3hCeVJvdyhyb3cpO1xuXG4gICAgaWYgKCFjaCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDaGVja2JveCBvZiByb3c6ICcgKyByb3cgKyAnIG5vdCBmb3VuZC4nKTtcbiAgICB9XG5cbiAgICBjaC5jaGVja2VkID0gdmFsdWU7XG4gICAgY2guZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2lucHV0JykpO1xuICAgIGNoLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdjaGFuZ2UnKSk7XG4gIH1cblxuICBnZXRDaGVja2JveEJ5Um93KHJvdzogbnVtYmVyKTogTnVsbGFibGU8SFRNTElucHV0RWxlbWVudD4ge1xuICAgIHJldHVybiB0aGlzLmZvcm0uZWxlbWVudD8ucXVlcnlTZWxlY3RvcjxIVE1MSW5wdXRFbGVtZW50PihcbiAgICAgIGBpbnB1dFtkYXRhLXJvbGU9Z3JpZC1jaGVja2JveF1bZGF0YS1yb3ctbnVtYmVyPVwiJHtyb3d9XCJdYFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIGEgcm93LlxuICAgKi9cbiAgdXBkYXRlUm93KHJvdzogbnVtYmVyLCB1cmw/OiBOdWxsYWJsZTxzdHJpbmc+LCBkYXRhPzogTnVsbGFibGU8UmVjb3JkPHN0cmluZywgYW55Pj4pIHtcbiAgICBjb25zdCBjaCA9IHRoaXMuZ2V0Q2hlY2tib3hCeVJvdyhyb3cpO1xuXG4gICAgaWYgKCFjaCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnVwZGF0ZUl0ZW0oY2gudmFsdWUsIHVybCwgZGF0YSk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIGFuIGl0ZW0gYnkgaWQuXG4gICAqL1xuICB1cGRhdGVJdGVtKGlkOiBzdHJpbmcgfCBudW1iZXIsIHVybD86IE51bGxhYmxlPHN0cmluZz4sIGRhdGE/OiBOdWxsYWJsZTxSZWNvcmQ8c3RyaW5nLCBhbnk+Pik6IGJvb2xlYW4ge1xuICAgIHRoaXMudG9nZ2xlQWxsKGZhbHNlKTtcblxuICAgIHRoaXMuZGlzYWJsZUFsbENoZWNrYm94ZXMoKTtcblxuICAgIHRoaXMuZm9ybS5pbmplY3RJbnB1dCgnaWRbXScsIGlkKTtcblxuICAgIHJldHVybiB0aGlzLmZvcm0ucGF0Y2godXJsLCBkYXRhKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgYSBpdGVtIHdpdGggYmF0Y2ggdGFzay5cbiAgICovXG4gIHVwZGF0ZUl0ZW1CeVRhc2soXG4gICAgdGFzazogc3RyaW5nLFxuICAgIGlkOiBzdHJpbmcgfCBudW1iZXIsXG4gICAgdXJsPzogTnVsbGFibGU8c3RyaW5nPixcbiAgICBkYXRhPzogTnVsbGFibGU8UmVjb3JkPHN0cmluZywgYW55Pj5cbiAgKTogYm9vbGVhbiB7XG4gICAgZGF0YSA9IGRhdGEgfHwge307XG4gICAgZGF0YS50YXNrID0gdGFzaztcblxuICAgIHJldHVybiB0aGlzLnVwZGF0ZUl0ZW0oaWQsIHVybCwgZGF0YSk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIGEgcm93IHdpdGggYmF0Y2ggdGFzay5cbiAgICovXG4gIHVwZGF0ZVJvd0J5VGFzayh0YXNrOiBzdHJpbmcsIHJvdzogbnVtYmVyLCB1cmw/OiBOdWxsYWJsZTxzdHJpbmc+LCBkYXRhPzogTnVsbGFibGU8UmVjb3JkPHN0cmluZywgYW55Pj4pOiBib29sZWFuIHtcbiAgICBjb25zdCBjaCA9IHRoaXMuZ2V0Q2hlY2tib3hCeVJvdyhyb3cpO1xuXG4gICAgaWYgKCFjaCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnVwZGF0ZUl0ZW1CeVRhc2sodGFzaywgY2gudmFsdWUsIHVybCwgZGF0YSk7XG4gIH1cblxuICAvKipcbiAgICogQmF0Y2ggdXBkYXRlIGl0ZW1zLlxuICAgKi9cbiAgdXBkYXRlTGlzdEJ5VGFzayh0YXNrOiBzdHJpbmcsIHVybD86IE51bGxhYmxlPHN0cmluZz4sIGRhdGE/OiBOdWxsYWJsZTxSZWNvcmQ8c3RyaW5nLCBhbnk+Pik6IGJvb2xlYW4ge1xuICAgIGRhdGEgPSBkYXRhIHx8IHt9O1xuICAgIGRhdGEudGFzayA9IHRhc2s7XG5cbiAgICByZXR1cm4gdGhpcy5mb3JtLnBhdGNoKHVybCwgZGF0YSk7XG4gIH1cblxuICAvKipcbiAgICogQ29weSBhIHJvdy5cbiAgICovXG4gIGNvcHlJdGVtKGlkOiBzdHJpbmcgfCBudW1iZXIsIHVybD86IE51bGxhYmxlPHN0cmluZz4sIGRhdGE/OiBOdWxsYWJsZTxSZWNvcmQ8c3RyaW5nLCBhbnk+Pik6IGJvb2xlYW4ge1xuICAgIHRoaXMudG9nZ2xlQWxsKGZhbHNlKTtcblxuICAgIHRoaXMuZGlzYWJsZUFsbENoZWNrYm94ZXMoKTtcblxuICAgIHRoaXMuZm9ybS5pbmplY3RJbnB1dCgnaWRbXScsIGlkKTtcblxuICAgIHJldHVybiB0aGlzLmZvcm0ucG9zdCh1cmwsIGRhdGEpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvcHkgYSByb3cuXG4gICAqL1xuICBjb3B5Um93KHJvdzogbnVtYmVyLCB1cmw/OiBOdWxsYWJsZTxzdHJpbmc+LCBkYXRhPzogTnVsbGFibGU8UmVjb3JkPHN0cmluZywgYW55Pj4pOiBib29sZWFuIHtcbiAgICBjb25zdCBjaCA9IHRoaXMuZ2V0Q2hlY2tib3hCeVJvdyhyb3cpO1xuXG4gICAgaWYgKCFjaCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmNvcHlJdGVtKGNoLnZhbHVlLCB1cmwsIGRhdGEpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlbGV0ZSBjaGVja2VkIGl0ZW1zLlxuICAgKi9cbiAgZGVsZXRlTGlzdChcbiAgICBtZXNzYWdlPzogTnVsbGFibGU8c3RyaW5nPiB8IGZhbHNlLFxuICAgIHVybD86IE51bGxhYmxlPHN0cmluZz4sXG4gICAgZGF0YT86IE51bGxhYmxlPFJlY29yZDxzdHJpbmcsIGFueT4+XG4gICk6IGJvb2xlYW4ge1xuICAgIGlmICghdGhpcy52YWxpZGF0ZUNoZWNrZWQoKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIG1lc3NhZ2UgPSBtZXNzYWdlID09IG51bGwgPyBfXygndW5pY29ybi5tZXNzYWdlLmRlbGV0ZS5jb25maXJtJykgOiBtZXNzYWdlO1xuXG4gICAgaWYgKG1lc3NhZ2UgIT09IGZhbHNlKSB7XG4gICAgICBzaW1wbGVDb25maXJtKG1lc3NhZ2UpLnRoZW4oaXNDb25maXJtID0+IHtcbiAgICAgICAgaWYgKGlzQ29uZmlybSkge1xuICAgICAgICAgIHRoaXMuZm9ybS5kZWxldGUodXJsLCBkYXRhKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZm9ybS5kZWxldGUodXJsLCBkYXRhKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGUgYW4gaXRlbSBieSByb3cuXG4gICAqL1xuICBhc3luYyBkZWxldGVSb3cocm93OiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICBtc2c/OiBOdWxsYWJsZTxzdHJpbmc+LFxuICAgICAgICAgICAgICAgICAgdXJsPzogTnVsbGFibGU8c3RyaW5nPixcbiAgICAgICAgICAgICAgICAgIGRhdGE/OiBOdWxsYWJsZTxSZWNvcmQ8c3RyaW5nLCBhbnk+Pik6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IGNoID0gdGhpcy5nZXRDaGVja2JveEJ5Um93KHJvdyk7XG5cbiAgICBpZiAoIWNoKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZGVsZXRlSXRlbShjaC52YWx1ZSwgbXNnLCB1cmwsIGRhdGEpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlbGV0ZSBhbiBpdGVtLlxuICAgKi9cbiAgYXN5bmMgZGVsZXRlSXRlbShpZDogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgIG1zZz86IE51bGxhYmxlPHN0cmluZz4sXG4gICAgICAgICAgICAgICAgICAgdXJsPzogTnVsbGFibGU8c3RyaW5nPixcbiAgICAgICAgICAgICAgICAgICBkYXRhPzogTnVsbGFibGU8UmVjb3JkPHN0cmluZywgYW55Pj4pOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBtc2cgPSBtc2cgfHwgX18oJ3VuaWNvcm4ubWVzc2FnZS5kZWxldGUuY29uZmlybScpO1xuXG4gICAgY29uc3QgaXNDb25maXJtID0gYXdhaXQgZGVsZXRlQ29uZmlybShtc2cpO1xuXG4gICAgaWYgKGlzQ29uZmlybSkge1xuICAgICAgLy8gdGhpcy50b2dnbGVBbGwoZmFsc2UpO1xuICAgICAgLy8gdGhpcy5jaGVja1Jvdyhyb3cpO1xuICAgICAgZGF0YSA9IGRhdGEgfHwge307XG5cbiAgICAgIGRhdGEuaWQgPSBpZDtcblxuICAgICAgdGhpcy5mb3JtLmRlbGV0ZSh1cmwsIGRhdGEpO1xuICAgIH1cblxuICAgIHJldHVybiBpc0NvbmZpcm07XG4gIH1cblxuICAvKipcbiAgICogVG9nZ2xlIGFsbCBjaGVja2JveGVzLlxuICAgKi9cbiAgdG9nZ2xlQWxsKHZhbHVlOiBib29sZWFuKSB7XG4gICAgQXJyYXkuZnJvbShcbiAgICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxJbnB1dEVsZW1lbnQ+KCdpbnB1dFtkYXRhLXJvbGU9Z3JpZC1jaGVja2JveF1bdHlwZT1jaGVja2JveF0nKVxuICAgIClcbiAgICAgIC5mb3JFYWNoKChpbnB1dCkgPT4ge1xuICAgICAgICBpbnB1dC5jaGVja2VkID0gdmFsdWU7XG5cbiAgICAgICAgaW5wdXQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2lucHV0JykpO1xuICAgICAgICBpbnB1dC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnY2hhbmdlJykpO1xuICAgICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGRpc2FibGVBbGxDaGVja2JveGVzKCkge1xuICAgIEFycmF5LmZyb20oXG4gICAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MSW5wdXRFbGVtZW50PignaW5wdXRbZGF0YS1yb2xlPWdyaWQtY2hlY2tib3hdW3R5cGU9Y2hlY2tib3hdJylcbiAgICApXG4gICAgICAuZm9yRWFjaCgoaW5wdXQpID0+IHtcbiAgICAgICAgaW5wdXQuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ291bnQgY2hlY2tlZCBjaGVja2JveGVzLlxuICAgKi9cbiAgY291bnRDaGVja2VkKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0Q2hlY2tlZCgpLmxlbmd0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgQ2hlY2tlZCBib3hlcy5cbiAgICovXG4gIGdldENoZWNrZWQoKTogSFRNTElucHV0RWxlbWVudFtdIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShcbiAgICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxJbnB1dEVsZW1lbnQ+KCdpbnB1dFtkYXRhLXJvbGU9Z3JpZC1jaGVja2JveF1bdHlwZT1jaGVja2JveF06Y2hlY2tlZCcpXG4gICAgKTtcbiAgfVxuXG4gIGdldENoZWNrZWRWYWx1ZXMoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLmdldENoZWNrZWQoKS5tYXAoaW5wdXQgPT4gaW5wdXQudmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlIHRoZXJlIGhhcyBvbmUgb3IgbW9yZSBjaGVja2VkIGJveGVzLlxuICAgKi9cbiAgdmFsaWRhdGVDaGVja2VkKGV2ZW50PzogRXZlbnQsIGNhbGxiYWNrPzogKGdyaWQ6IFVuaWNvcm5HcmlkRWxlbWVudCkgPT4gYW55LCBtc2c/OiBzdHJpbmcpOiB0aGlzIHtcbiAgICBtc2cgPSBtc2cgfHwgX18oJ3VuaWNvcm4ubWVzc2FnZS5ncmlkLmNoZWNrZWQnKTtcblxuICAgIGlmICghdGhpcy5oYXNDaGVja2VkKCkpIHtcbiAgICAgIGlmIChtc2cgIT09ICcnKSB7XG4gICAgICAgIHNpbXBsZUFsZXJ0KG1zZyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChldmVudCkge1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICBjYWxsYmFjayh0aGlzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGhhc0NoZWNrZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY291bnRDaGVja2VkKCkgPiAwO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlb3JkZXIgYWxsLlxuICAgKi9cbiAgcmVvcmRlckFsbCh1cmw/OiBOdWxsYWJsZTxzdHJpbmc+LCBkYXRhPzogTnVsbGFibGU8UmVjb3JkPHN0cmluZywgYW55Pj4pIHtcbiAgICByZXR1cm4gdGhpcy51cGRhdGVMaXN0QnlUYXNrKCdyZW9yZGVyJywgdXJsLCBkYXRhKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW9yZGVyIGl0ZW1zLlxuICAgKi9cbiAgbW92ZUl0ZW0oaWQ6IG51bWJlciB8IHN0cmluZywgZGVsdGE6IG51bWJlciwgdXJsPzogTnVsbGFibGU8c3RyaW5nPiwgZGF0YT86IE51bGxhYmxlPFJlY29yZDxzdHJpbmcsIGFueT4+KTogYm9vbGVhbiB7XG4gICAgZGF0YSA9IGRhdGEgfHwge307XG4gICAgZGF0YS5kZWx0YSA9IGRlbHRhO1xuXG4gICAgcmV0dXJuIHRoaXMudXBkYXRlSXRlbUJ5VGFzaygnbW92ZScsIGlkLCB1cmwsIGRhdGEpO1xuICB9XG5cbiAgbW92ZVVwKGlkOiBzdHJpbmcgfCBudW1iZXIsIHVybD86IE51bGxhYmxlPHN0cmluZz4sIGRhdGE/OiBOdWxsYWJsZTxSZWNvcmQ8c3RyaW5nLCBhbnk+Pik6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm1vdmVJdGVtKGlkLCAtMSwgdXJsLCBkYXRhKTtcbiAgfVxuXG4gIG1vdmVEb3duKGlkOiBzdHJpbmcgfCBudW1iZXIsIHVybD86IE51bGxhYmxlPHN0cmluZz4sIGRhdGE/OiBOdWxsYWJsZTxSZWNvcmQ8c3RyaW5nLCBhbnk+Pik6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm1vdmVJdGVtKGlkLCAxLCB1cmwsIGRhdGEpO1xuICB9XG5cbiAgZ2V0SWQoc3VmZml4ID0gJycpIHtcbiAgICByZXR1cm4gdGhpcy5mb3JtLmVsZW1lbnQ/LmlkICsgc3VmZml4O1xuICB9XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUlPLE1BQU0sbUJBQW1CO0FBQUEsRUFLOUIsWUFDRSxVQUNPLFNBQ0EsTUFDUCxVQUErQixDQUFBLEdBQy9CO0FBSE8sU0FBQSxVQUFBO0FBQ0EsU0FBQSxPQUFBO0FBR1AsU0FBSyxVQUFVLEVBQUUsR0FBRyxRQUFBO0FBRXBCLFFBQUksQ0FBQyxLQUFLLE1BQU07QUFDZCxZQUFNLElBQUksTUFBTSx1Q0FBdUM7QUFBQSxJQUN6RDtBQUVBLFNBQUssV0FBQTtBQUFBLEVBQ1A7QUFBQSxFQWpCQTtBQUFBLEVBQ0EsV0FBVztBQUFBLEVBQ1gsUUFBUSxDQUFBO0FBQUEsRUFpQlIsYUFBYTtBQUNYLFVBQU0sU0FBUyxLQUFLLFFBQVEsaUJBQW1DLGdDQUFnQztBQUUvRixlQUFXLE1BQU0sUUFBUTtBQUN2QixTQUFHLGlCQUFpQixTQUFTLE1BQU07QUFDakMsV0FBRyxjQUFjLElBQUksWUFBWSxRQUFRLENBQUM7QUFBQSxNQUM1QyxDQUFDO0FBQ0QsU0FBRyxpQkFBaUIsVUFBVSxNQUFNO0FBQ2xDLGNBQU0sUUFBUSxJQUFJLFlBQVksbUJBQW1CO0FBQUEsVUFDL0MsUUFBUSxFQUFFLE1BQU0sS0FBQTtBQUFBLFFBQUssQ0FDdEI7QUFFRCxhQUFLLEtBQUssU0FBUyxjQUFjLEtBQUs7QUFBQSxNQUN4QyxDQUFDO0FBQUEsSUFDSDtB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
