import { u as useUITheme } from "../service/ui.js";
async function useUIBootstrap5(install = false, pushToGlobal = false) {
  const { UIBootstrap5 } = await import("../module/ui-bootstrap5.js");
  const theme = UIBootstrap5.get();
  if (install) {
    useUITheme(theme);
    if (pushToGlobal) {
      theme.pushBootstrapToGlobal();
    }
  }
  return theme;
}
async function useBs5Tooltip(selector = '[data-bs-toggle="tooltip"]', config = {}) {
  const bs5 = await useUIBootstrap5();
  return bs5.tooltip(selector, config);
}
const useBs5KeepTab = async (selector, options = {}) => {
  const bs5 = await useUIBootstrap5();
  return bs5.keepTab(selector, options);
};
const useBs5ButtonRadio = async (selector, options = {}) => {
  const bs5 = await useUIBootstrap5();
  return bs5.buttonRadio(selector, options);
};
export {
  useUIBootstrap5 as a,
  useBs5KeepTab as b,
  useBs5ButtonRadio as c,
  useBs5Tooltip as u
};
