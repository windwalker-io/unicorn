//#region ../../../../node_modules/@lyrasoft/ts-toolkit/src/generic/alert-adapter.ts
var AlertAdapter = class {
	static alert = async (title, text) => {
		if (text) title += " | " + text;
		return window.alert(title);
	};
	static confirm = async (title, text) => {
		return new Promise((resolve) => {
			if (text) title += " | " + text;
			resolve(confirm(title));
		});
	};
	static deleteConfirm = async (title, text) => this.confirm(title, text);
	static notify = async (title, text, type = "log") => {
		if (text) title += " | " + text;
		if (type === "error") console.error(title);
		else if (type === "warn") console.warn(title);
		else console.log(title);
		return async () => {};
	};
	static clearNotifies = async () => {};
	static confirmText = () => "OK";
	static cancelText = () => "Cancel";
	static deleteText = () => "Delete";
};
//#endregion
export { AlertAdapter as t };

//# sourceMappingURL=alert-adapter.js.map