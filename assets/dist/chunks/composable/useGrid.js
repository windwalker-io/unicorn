import { u as useFormAsync, a as useForm } from "./useForm.js";
import { s as selectOne, m as module } from "../service/dom.js";
let gridElement;
async function useGridAsync(ele, options = {}) {
  await useFormAsync();
  const { UnicornGridElement } = await import("../module/grid.js");
  gridElement ??= UnicornGridElement;
  if (!ele) {
    return null;
  }
  return useGrid(ele, options);
}
function useGrid(ele, options = {}) {
  const selector = typeof ele === "string" ? ele : "";
  const element = selectOne(ele);
  if (!element) {
    throw new Error("Element is empty");
  }
  const form = useForm(selector || element);
  if (!form) {
    throw new Error("UnicornGrid is depends on UnicornForm");
  }
  return module(
    element,
    "grid.plugin",
    () => new gridElement(selector, element, form, options)
  );
}
async function useGridComponent(ele, options = {}) {
  const grid = await useGridAsync(ele, options);
  await grid?.initComponent();
  return grid;
}
export {
  useGrid as a,
  useGridComponent as b,
  useGridAsync as u
};
