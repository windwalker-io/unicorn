import { t as data } from "./data.js";
import { o as route } from "./router.js";
import AxiosStatic, { AxiosError, isAxiosError, isCancel } from "axios";
//#region ../../../../node_modules/url-template/lib/url-template.js
function encodeReserved(str) {
	return str.split(/(%[0-9A-Fa-f]{2})/g).map(function(part) {
		if (!/%[0-9A-Fa-f]/.test(part)) part = encodeURI(part).replace(/%5B/g, "[").replace(/%5D/g, "]");
		return part;
	}).join("");
}
function encodeUnreserved(str) {
	return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
		return "%" + c.charCodeAt(0).toString(16).toUpperCase();
	});
}
function encodeValue(operator, value, key) {
	value = operator === "+" || operator === "#" ? encodeReserved(value) : encodeUnreserved(value);
	if (key) return encodeUnreserved(key) + "=" + value;
	else return value;
}
function isDefined(value) {
	return value !== void 0 && value !== null;
}
function isKeyOperator(operator) {
	return operator === ";" || operator === "&" || operator === "?";
}
function getValues(context, operator, key, modifier) {
	var value = context[key], result = [];
	if (isDefined(value) && value !== "") if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
		value = value.toString();
		if (modifier && modifier !== "*") value = value.substring(0, parseInt(modifier, 10));
		result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : null));
	} else if (modifier === "*") if (Array.isArray(value)) value.filter(isDefined).forEach(function(value) {
		result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : null));
	});
	else Object.keys(value).forEach(function(k) {
		if (isDefined(value[k])) result.push(encodeValue(operator, value[k], k));
	});
	else {
		var tmp = [];
		if (Array.isArray(value)) value.filter(isDefined).forEach(function(value) {
			tmp.push(encodeValue(operator, value));
		});
		else Object.keys(value).forEach(function(k) {
			if (isDefined(value[k])) {
				tmp.push(encodeUnreserved(k));
				tmp.push(encodeValue(operator, value[k].toString()));
			}
		});
		if (isKeyOperator(operator)) result.push(encodeUnreserved(key) + "=" + tmp.join(","));
		else if (tmp.length !== 0) result.push(tmp.join(","));
	}
	else if (operator === ";") {
		if (isDefined(value)) result.push(encodeUnreserved(key));
	} else if (value === "" && (operator === "&" || operator === "?")) result.push(encodeUnreserved(key) + "=");
	else if (value === "") result.push("");
	return result;
}
function parseTemplate(template) {
	var operators = [
		"+",
		"#",
		".",
		"/",
		";",
		"?",
		"&"
	];
	return { expand: function(context) {
		return template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function(_, expression, literal) {
			if (expression) {
				var operator = null, values = [];
				if (operators.indexOf(expression.charAt(0)) !== -1) {
					operator = expression.charAt(0);
					expression = expression.substr(1);
				}
				expression.split(/,/g).forEach(function(variable) {
					var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
					values.push.apply(values, getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
				});
				if (operator && operator !== "+") {
					var separator = ",";
					if (operator === "?") separator = "&";
					else if (operator !== "#") separator = operator;
					return (values.length !== 0 ? operator : "") + values.join(separator);
				} else return values.join(",");
			} else return encodeReserved(literal);
		});
	} };
}
//#endregion
//#region src/module/http-client.ts
function prepareAxios(axios) {
	axios.interceptors.request.use((config) => {
		config.headers["X-CSRF-Token"] = data("csrf-token");
		if (config.url && config.url.startsWith("@")) config.url = route(config.url);
		if (config?.vars && config.url) config.url = parseTemplate(config.url).expand(config.vars || {});
		if (config.methodSimulate) {
			if (config.methodSimulateByHeader) config.headers["X-HTTP-Method-Override"] = config;
			else if (typeof config.data === "object") config.data["_method"] = config.method;
			else if (typeof config.data === "string") if (config.data.includes("?")) config.data += "&_method=" + config.method;
			else config.data += "?_method=" + config.method;
			if (config.method?.toLowerCase() !== "get") config.method = "POST";
		}
		return config;
	});
	return axios;
}
function createHttpClient(config) {
	const axios = config && "interceptors" in config ? config : AxiosStatic.create(config ?? {});
	prepareAxios(axios);
	function requestMiddleware(callback) {
		return axios.interceptors.request.use(callback);
	}
	function responseMiddleware(callback) {
		return axios.interceptors.response.use(callback);
	}
	/**
	* Send a GET request.
	*/
	async function get(url, options = {}) {
		options.url = url;
		options.method = "GET";
		return request(options);
	}
	/**
	* Send a POST request.
	*/
	async function post(url, data, options = {}) {
		options.url = url;
		options.method = "POST";
		options.data = data;
		return request(options);
	}
	/**
	* Send a PUT request.
	*
	* @param {string} url
	* @param {any} data
	* @param {AxiosRequestConfig} options
	*
	* @returns {Promise<AxiosResponse>}
	*/
	async function put(url, data, options = {}) {
		options.url = url;
		options.method = "PUT";
		options.data = data;
		return request(options);
	}
	/**
	* Send a PATCH request.
	*
	* @param {string} url
	* @param {any} data
	* @param {AxiosRequestConfig} options
	*
	* @returns {Promise<AxiosResponse>}
	*/
	async function patch(url, data, options = {}) {
		options.url = url;
		options.method = "PATCH";
		options.data = data;
		return request(options);
	}
	/**
	* Send a DELETE request.
	*
	* @param {string} url
	* @param {any} data
	* @param {AxiosRequestConfig} options
	*
	* @returns {Promise<AxiosResponse>}
	*/
	async function deletes(url, data, options = {}) {
		options.url = url;
		options.method = "DELETE";
		options.data = data;
		return request(options);
	}
	/**
	* Send a HEAD request.
	*
	* @param {string} url
	* @param {AxiosRequestConfig} options
	*
	* @returns {Promise<AxiosResponse>}
	*/
	async function head(url, options = {}) {
		options.url = url;
		options.method = "HEAD";
		return request(options);
	}
	/**
	* Send a OPTIONS request.
	*
	* @param {string} url
	* @param {AxiosRequestConfig} options
	*
	* @returns {Promise<AxiosResponse>}
	*/
	async function options(url, options = {}) {
		options.url = url;
		options.method = "OPTIONS";
		return request(options);
	}
	/**
	* Send request.
	*/
	async function request(options) {
		try {
			return await axios(options);
		} catch (e) {
			e.originMessage = e.message;
			const err = e;
			if (err.response?.data?.message) err.message = err.response.data.message;
			throw err;
		}
	}
	return {
		axios,
		request,
		get,
		post,
		put,
		patch,
		delete: deletes,
		head,
		options,
		requestMiddleware,
		responseMiddleware,
		isCancel,
		AxiosError,
		isAxiosError
	};
}
//#endregion
export { createHttpClient };

//# sourceMappingURL=http-client.js.map