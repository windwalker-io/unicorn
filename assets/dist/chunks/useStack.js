import { stack } from "@lyrasoft/ts-toolkit/generic";
//#region src/composable/useStack.ts
var stacks = {};
function useStack(name = "default", store = []) {
	return stacks[name] ??= createStack(store);
}
function createStack(store = []) {
	return stack(store);
}
//#endregion
export { useStack as n, createStack as t };

//# sourceMappingURL=useStack.js.map