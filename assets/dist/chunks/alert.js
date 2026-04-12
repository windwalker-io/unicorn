import { t as AlertAdapter } from "./alert-adapter.js";
//#region ../../../../node_modules/@lyrasoft/ts-toolkit/src/generic/alert.ts
async function simpleAlert(title, text = "", icon, extra) {
	return AlertAdapter.alert(title, text, icon, extra);
}
async function simpleConfirm(title, text = "", icon, extra) {
	return AlertAdapter.confirm(title, text, icon, extra);
}
async function deleteConfirm(title, text = "", icon, extra) {
	return AlertAdapter.deleteConfirm(title, text, icon, extra);
}
async function simpleNotify(title, text = "", type, extra) {
	return AlertAdapter.notify(title, text, type, extra);
}
async function clearNotifies() {
	return AlertAdapter.clearNotifies();
}
//#endregion
export { simpleNotify as a, simpleConfirm as i, deleteConfirm as n, simpleAlert as r, clearNotifies as t };

//# sourceMappingURL=alert.js.map