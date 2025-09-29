import { d as data } from "../data.js";
function useSystemUri(type, path) {
  const uri2 = UnicornSystemUri.get();
  if (type) {
    return uri2[type](path);
  }
  return uri2;
}
function useAssetUri(type, path) {
  const asset2 = UnicornAssetUri.get();
  if (type) {
    return asset2[type](path);
  }
  return asset2;
}
function uri(type) {
  return data("unicorn.uri")[type];
}
function asset(type) {
  return uri("asset")[type];
}
function addUriBase(uri2, type = "path") {
  if (uri2.substring(0, 2) === "//" || uri2.substring(0, 4) === "http") {
    return uri2;
  }
  return asset(type) + "/" + uri2;
}
class UnicornSystemUri extends URL {
  static instance;
  static get() {
    return this.instance ??= new this(uri("full"));
  }
  path(path = "") {
    return uri("path") + path;
  }
  root(path = "") {
    return uri("root") + path;
  }
  current() {
    return uri("current") || "";
  }
  full() {
    return uri("full") || "";
  }
  route() {
    return uri("route") || "";
  }
  script() {
    return uri("script") || "";
  }
  routeWithQuery() {
    const route = this.route();
    const query = this.searchParams.toString();
    return query ? `${route}?${query}` : route;
  }
  routeAndQuery() {
    const route = this.route();
    const query = this.searchParams.toString();
    return [route, query];
  }
}
class UnicornAssetUri {
  static instance;
  static get() {
    return this.instance ??= new this();
  }
  path(path = "") {
    return asset("path") + path;
  }
  root(path = "") {
    return asset("root") + path;
  }
}
export {
  UnicornSystemUri as U,
  useAssetUri as a,
  addUriBase as b,
  UnicornAssetUri as c,
  useSystemUri as u
};
