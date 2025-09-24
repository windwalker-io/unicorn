import { l as o, s as h, a as c, h as l, _ as n, b as a, c as u, e as d } from "../chunks/unicorn-Dap6NpVD.js";
class p {
  constructor(e, t, r, i = {}) {
    if (this.element = t, this.form = r, this.element = t, this.options = { ...i }, !this.form)
      throw new Error("UnicornGrid is depends on UnicornForm");
    this.bindEvents();
  }
  options;
  ordering = "";
  state = {};
  bindEvents() {
    const e = this.element.querySelectorAll("input[data-role=grid-checkbox]");
    for (const t of e)
      t.addEventListener("click", () => {
        t.dispatchEvent(new CustomEvent("change"));
      }), t.addEventListener("change", () => {
        const r = new CustomEvent("unicorn:checked", {
          detail: { grid: this }
        });
        this.form.element?.dispatchEvent(r);
      });
  }
  initComponent(e = "grid", t = {}) {
    return this.ordering = this.element?.dataset?.ordering || "", this.ordering && !this.ordering.toLowerCase().endsWith(" asc") && !this.ordering.toLowerCase().endsWith(" desc") && (this.ordering += " ASC"), o(() => {
      Alpine.store(e, this.useState(t));
    });
  }
  useState(e = {}) {
    const t = {
      form: this.form.useState(e)
    };
    return Object.getOwnPropertyNames(Object.getPrototypeOf(this)).map((r) => typeof this[r] == "function" ? t[r] = this[r].bind(this) : r), Object.assign(
      t,
      e
    );
  }
  getElement() {
    return this.element;
  }
  sendFilter(e, t) {
    e && e.preventDefault(), this.form.submit(null, null, t);
  }
  clearFilters(e, t) {
    e.querySelectorAll("input, textarea, select").forEach((r) => {
      r.value = "";
    }), this.form.submit(null, null, t);
  }
  async toggleFilters(e, t) {
    e ? await h(t) : await c(t);
  }
  sort(e) {
    const t = this.getDirection(e), r = e.dataset.field;
    let i = e.dataset.asc, s = e.dataset.desc;
    return r && (i = r + " ASC", s = r + " DESC"), t === "ASC" ? this.sortBy(s) : this.sortBy(i);
  }
  /**
   * Sort two items.
   */
  sortBy(e) {
    if (!e)
      return !1;
    let t = this.element.querySelector("input[name=list_ordering]");
    return t || (t = l("input", { name: "list_ordering", type: "hidden", value: "" }), this.element.appendChild(t)), t.value = e, this.form.put();
  }
  isSortActive(e) {
    return this.getDirection(e) != null;
  }
  getDirection(e) {
    const t = e.dataset.field;
    let r = e.dataset.asc, i = e.dataset.desc;
    return t && (r = t + " ASC", i = t + " DESC"), this.orderingEquals(r, this.ordering) ? "ASC" : this.orderingEquals(i, this.ordering) ? "DESC" : null;
  }
  orderingEquals(e, t) {
    return e = e || "", t = t || "", e = e.replace(/\s+/g, " ").trim().toLowerCase(), t = t.replace(/\s+/g, " ").trim().toLowerCase(), e === t;
  }
  /**
   * Check a row's checkbox.
   */
  checkRow(e, t = !0) {
    const r = this.getCheckboxByRow(e);
    if (!r)
      throw new Error("Checkbox of row: " + e + " not found.");
    r.checked = t, r.dispatchEvent(new Event("input")), r.dispatchEvent(new Event("change"));
  }
  getCheckboxByRow(e) {
    return this.form.element?.querySelector(
      `input[data-role=grid-checkbox][data-row-number="${e}"]`
    );
  }
  /**
   * Update a row.
   */
  updateRow(e, t, r) {
    const i = this.getCheckboxByRow(e);
    return i ? this.updateItem(i.value, t, r) : !1;
  }
  /**
   * Update an item by id.
   */
  updateItem(e, t, r) {
    return this.toggleAll(!1), this.disableAllCheckboxes(), this.form.injectInput("id[]", e), this.form.patch(t, r);
  }
  /**
   * Update a item with batch task.
   */
  updateItemByTask(e, t, r, i) {
    return i = i || {}, i.task = e, this.updateItem(t, r, i);
  }
  /**
   * Update a row with batch task.
   */
  updateRowByTask(e, t, r, i) {
    const s = this.getCheckboxByRow(t);
    return s ? this.updateItemByTask(e, s.value, r, i) : !1;
  }
  /**
   * Batch update items.
   */
  updateListByTask(e, t, r) {
    return r = r || {}, r.task = e, this.form.patch(t, r);
  }
  /**
   * Copy a row.
   */
  copyItem(e, t, r) {
    return this.toggleAll(!1), this.disableAllCheckboxes(), this.form.injectInput("id[]", e), this.form.post(t, r);
  }
  /**
   * Copy a row.
   */
  copyRow(e, t, r) {
    const i = this.getCheckboxByRow(e);
    return i ? this.copyItem(i.value, t, r) : !1;
  }
  /**
   * Delete checked items.
   */
  deleteList(e, t, r) {
    return this.validateChecked() ? (e = e ?? n("unicorn.message.delete.confirm"), e !== !1 ? a(e).then((i) => {
      i && this.form.delete(t, r);
    }) : this.form.delete(t, r), !0) : !1;
  }
  /**
   * Delete an item by row.
   */
  async deleteRow(e, t, r, i) {
    const s = this.getCheckboxByRow(e);
    return s ? this.deleteItem(s.value, t, r, i) : !1;
  }
  /**
   * Delete an item.
   */
  async deleteItem(e, t, r, i) {
    t = t || n("unicorn.message.delete.confirm");
    const s = await u(t);
    return s && (i = i || {}, i.id = e, this.form.delete(r, i)), s;
  }
  /**
   * Toggle all checkboxes.
   */
  toggleAll(e) {
    return Array.from(
      this.element.querySelectorAll("input[data-role=grid-checkbox][type=checkbox]")
    ).forEach((t) => {
      t.checked = e, t.dispatchEvent(new CustomEvent("input")), t.dispatchEvent(new CustomEvent("change"));
    }), this;
  }
  disableAllCheckboxes() {
    Array.from(
      this.element.querySelectorAll("input[data-role=grid-checkbox][type=checkbox]")
    ).forEach((e) => {
      e.disabled = !0;
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
    return this.getChecked().map((e) => e.value);
  }
  /**
   * Validate there has one or more checked boxes.
   */
  validateChecked(e, t, r) {
    return r = r || n("unicorn.message.grid.checked"), this.hasChecked() ? (t && t(this), this) : (r !== "" && d(r), e && (e.stopPropagation(), e.preventDefault()), this);
  }
  hasChecked() {
    return this.countChecked() > 0;
  }
  /**
   * Reorder all.
   */
  reorderAll(e, t) {
    return this.updateListByTask("reorder", e, t);
  }
  /**
   * Reorder items.
   */
  moveItem(e, t, r, i) {
    return i = i || {}, i.delta = t, this.updateItemByTask("move", e, r, i);
  }
  moveUp(e, t, r) {
    return this.moveItem(e, -1, t, r);
  }
  moveDown(e, t, r) {
    return this.moveItem(e, 1, t, r);
  }
  getId(e = "") {
    return this.form.element?.id + e;
  }
}
export {
  p as UnicornGridElement
};
