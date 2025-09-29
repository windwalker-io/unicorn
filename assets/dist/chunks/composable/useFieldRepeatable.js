async function useFieldRepeatable() {
  const module = await import("../module/field-repeatable.js");
  await module.ready;
  return module;
}
export {
  useFieldRepeatable as u
};
