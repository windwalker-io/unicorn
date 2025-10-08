import { l as loadAlpine, Q as slideDown, P as slideUp, A as h, _ as __, F as simpleConfirm, ae as deleteConfirm, G as simpleAlert } from "./unicorn.js";
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
//# sourceMappingURL=grid.js.map
