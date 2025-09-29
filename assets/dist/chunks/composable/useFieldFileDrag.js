async function useFieldFileDrag() {
  const module = await import("../module/field-file-drag.js");
  await module.ready;
  return module;
}
export {
  useFieldFileDrag as u
};
