async function useIframeModal() {
  const module = await import("../module/iframe-modal.js");
  await module.ready;
  return module;
}
export {
  useIframeModal as u
};
