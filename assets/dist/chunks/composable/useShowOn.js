async function useShowOn() {
  const module = await import("../module/show-on.js");
  await module.ready;
  return module;
}
export {
  useShowOn as u
};
