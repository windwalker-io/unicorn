import { g as getBoundedInstance } from "../service/dom.js";
async function useFormValidation(selector) {
  const module = await import("../module/validation.js");
  await module.ready;
  if (!selector) {
    return module;
  }
  return useFormValidationSync(selector);
}
function useFormValidationSync(selector) {
  return getBoundedInstance(selector, "form.validation");
}
function useFieldValidationSync(selector) {
  return getBoundedInstance(selector, "field.validation");
}
async function addGlobalValidator(name, validator, options = {}) {
  const { UnicornFormValidation } = await useFormValidation();
  UnicornFormValidation.addGlobalValidator(name, validator, options);
}
export {
  addGlobalValidator as a,
  useFieldValidationSync as b,
  useFormValidationSync as c,
  useFormValidation as u
};
