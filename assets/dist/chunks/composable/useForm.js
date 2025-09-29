import { s as selectOne, m as module } from "../service/dom.js";
let formElement;
async function useFormAsync(ele, options = {}) {
  const { UnicornFormElement } = await import("../module/form.js");
  formElement ??= UnicornFormElement;
  return useForm(ele, options);
}
function useForm(ele, options = {}) {
  if (ele == null) {
    return new formElement(void 0, void 0, options);
  }
  const selector = typeof ele === "string" ? ele : void 0;
  const el = selectOne(ele);
  if (!el) {
    throw new Error(`Form element of: ${selector} not found.`);
  }
  return module(
    el,
    "unicorn.form",
    () => new formElement(selector, el, options)
  );
}
async function useFormComponent(ele, options = {}) {
  const form = await useFormAsync(ele, options);
  await form?.initComponent();
  return form;
}
export {
  useForm as a,
  useFormComponent as b,
  useFormAsync as u
};
