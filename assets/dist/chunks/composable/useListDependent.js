async function useListDependent(element, dependent, options = {}) {
  const module = await import("../module/list-dependent.js");
  await module.ready;
  if (element) {
    const { ListDependent } = module;
    return ListDependent.handle(element, dependent ?? void 0, options);
  }
  return module;
}
export {
  useListDependent as u
};
