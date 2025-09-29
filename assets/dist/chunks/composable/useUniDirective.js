let instances = {};
async function useWebDirective(name = "unicorn", options = {}) {
  return instances[name] ??= await createWebDirective(Object.assign({}, options, { prefix: "uni-" }));
}
async function useUniDirective(name, handler, wdInstance = "unicorn") {
  const wd = typeof wdInstance === "string" ? await useWebDirective(wdInstance) : wdInstance;
  wd.register(name, handler);
}
async function createWebDirective(options = {}) {
  const WebDirective = (await import("web-directive")).default;
  const wd = new WebDirective(options);
  wd.listen();
  return wd;
}
export {
  useWebDirective as a,
  useUniDirective as u
};
