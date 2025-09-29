async function useTinymce(selector, options = {}) {
  const module = await import("../module/tinymce.js");
  if (selector) {
    return module.get(selector, options);
  }
  return module;
}
export {
  useTinymce as u
};
