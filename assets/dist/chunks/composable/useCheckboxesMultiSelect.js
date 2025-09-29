async function useCheckboxesMultiSelect(selector, options = {}) {
  const m = await import("../module/checkboxes-multi-select.js");
  if (selector) {
    m.CheckboxesMultiSelect.handle(selector, options);
  }
  return m;
}
export {
  useCheckboxesMultiSelect as u
};
