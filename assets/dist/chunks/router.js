import { t as data } from "./data.js";
//#region ../../../../node_modules/qss/dist/qss.mjs
function encode(obj, pfx) {
	var k, i, tmp, str = "";
	for (k in obj) if ((tmp = obj[k]) !== void 0) if (Array.isArray(tmp)) for (i = 0; i < tmp.length; i++) {
		str && (str += "&");
		str += encodeURIComponent(k) + "=" + encodeURIComponent(tmp[i]);
	}
	else {
		str && (str += "&");
		str += encodeURIComponent(k) + "=" + encodeURIComponent(tmp);
	}
	return (pfx || "") + str;
}
function toValue(mix) {
	if (!mix) return "";
	var str = decodeURIComponent(mix);
	if (str === "false") return false;
	if (str === "true") return true;
	return +str * 0 === 0 ? +str : str;
}
function decode(str) {
	var tmp, k, out = {}, arr = str.split("&");
	while (tmp = arr.shift()) {
		tmp = tmp.split("=");
		k = tmp.shift();
		if (out[k] !== void 0) out[k] = [].concat(out[k], toValue(tmp.shift()));
		else out[k] = toValue(tmp.shift());
	}
	return out;
}
//#endregion
//#region src/service/router.ts
/**
* Add a route.
*/
function addRoute(route, url) {
	const routes = data("unicorn.routes") || {};
	routes[route] = url;
	data("unicorn.routes", routes);
}
/**
* Get route.
*/
function route(route, query) {
	const source = route;
	const extract = extractRoute(source);
	route = extract.route;
	let path = extract.path;
	const routes = data("unicorn.routes") || {};
	let url = routes[route];
	if (url == null) if (!route.startsWith("@")) route = "@" + route;
	else route = route.substring(1);
	url = routes[route];
	if (url == null) throw new Error(`Route: "${source}" not found`);
	if (path) {
		const { route: u1, path: u1q } = extractRoute(url, "?");
		const { route: u2, path: u2q } = extractRoute(path, "?");
		url = u1 + "/" + u2;
		if (u1q || u2q) {
			const q = [u1q, u2q].filter((u) => u).join("&");
			url += "?" + q;
		}
	}
	return addQuery(url, query);
}
function extractRoute(route, sep = "/") {
	if (route.indexOf(sep) === -1) return {
		route,
		path: ""
	};
	const segments = route.split(sep);
	route = segments.shift() || "";
	const path = segments.join(sep);
	return {
		route,
		path
	};
}
function hasRoute(route) {
	return void 0 !== data("unicorn.routes")[route];
}
function addQuery(url, query) {
	if (query == null) return url;
	for (let k in query) {
		const v = query[k];
		const placeholder = `{${k}}`;
		if (url.indexOf(placeholder) !== -1) {
			url = url.replace(new RegExp(`${placeholder}`, "g"), v);
			delete query[k];
		}
		const encodedPlaceholder = encodeURIComponent(`{${k}}`);
		if (url.indexOf(encodedPlaceholder) !== -1) {
			url = url.replace(new RegExp(`${encodedPlaceholder}`, "g"), v);
			delete query[k];
		}
	}
	if (Object.keys(query).length === 0) return url;
	const queryString = encode(query);
	return url + (/\?/.test(url) ? `&${queryString}` : `?${queryString}`);
}
function parseQuery(queryString) {
	return decode(queryString);
}
function buildQuery(query) {
	return encode(query);
}
//#endregion
export { parseQuery as a, hasRoute as i, addRoute as n, route as o, buildQuery as r, addQuery as t };

//# sourceMappingURL=router.js.map