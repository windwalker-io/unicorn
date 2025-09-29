import { a as stack } from "./useQueue.js";
const stacks = {};
function useStack(name = "default", store = []) {
  return stacks[name] ??= createStack(store);
}
function createStack(store = []) {
  return stack(store);
}
export {
  createStack as c,
  useStack as u
};
