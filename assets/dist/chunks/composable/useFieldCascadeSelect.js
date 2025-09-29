async function useFieldCascadeSelect() {
  const module = await import("../module/field-cascade-select.js");
  await module.ready;
  return module;
}
export {
  useFieldCascadeSelect as u
};
