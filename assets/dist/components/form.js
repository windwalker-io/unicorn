import { d as p, l as f } from "../chunks/unicorn-Dap6NpVD.js";
function d(o, e) {
  return m.get()[o](e);
}
function u(o) {
  return p("unicorn.uri")[o];
}
class m extends URL {
  static instance;
  static get() {
    return this.instance ??= new this(u("full"));
  }
  path(e = "") {
    return u("path") + e;
  }
  root(e = "") {
    return u("root") + e;
  }
  current() {
    return u("current") || "";
  }
  full() {
    return u("full") || "";
  }
  route() {
    return u("route") || "";
  }
  script() {
    return u("script") || "";
  }
  routeWithQuery() {
    const e = this.route(), t = this.searchParams.toString();
    return t ? `${e}?${t}` : e;
  }
  routeAndQuery() {
    const e = this.route(), t = this.searchParams.toString();
    return [e, t];
  }
}
class a {
  element;
  options;
  constructor(e, t, r = {}) {
    if (!t) {
      t = document.createElement("form"), typeof e == "string" && e.startsWith("#") && (t.setAttribute("id", e.substring(1)), t.setAttribute("name", e.substring(1))), t.setAttribute("method", "post"), t.setAttribute("enctype", "multipart/form-data"), t.setAttribute("novalidate", "true"), t.setAttribute("action", d("full")), t.setAttribute("style", "display: none;");
      const i = document.createElement("input");
      i.setAttribute("type", "hidden"), i.setAttribute("name", p("csrf-token")), i.setAttribute("value", "1"), t.appendChild(i), document.body.appendChild(t);
    }
    this.element = t, this.options = { ...r };
  }
  initComponent(e = "form", t = {}) {
    return f(() => {
      Alpine.store(e, this.useState(t));
    });
  }
  useState(e = {}) {
    const t = {};
    return Object.getOwnPropertyNames(Object.getPrototypeOf(this)).map((r) => t[r] = this[r].bind(this)), Object.assign(
      t,
      e
    );
  }
  getElement() {
    return this.element;
  }
  submit(e, t, r, i) {
    const s = this.element;
    if (i) {
      let n = s.querySelector('input[name="_method"]');
      n ? n.value = i : (n = document.createElement("input"), n.setAttribute("name", "_method"), n.setAttribute("type", "hidden"), n.value = i, s.appendChild(n));
    }
    if (t) {
      const n = a.flattenObject(t);
      for (const c in n) {
        const l = n[c], h = a.buildFieldName(c);
        this.injectInput(h, l);
      }
    }
    return e && s.setAttribute("action", e), r && s.setAttribute("method", r), s.requestSubmit(), !0;
  }
  injectInput(e, t) {
    let r = this.element.querySelector(`input[name="${e}"]`);
    return r || (r = document.createElement("input"), r.setAttribute("name", e), r.setAttribute("type", "hidden"), r.setAttribute("data-role", "temp-input"), this.element.appendChild(r)), r.value = t, r;
  }
  /**
   * Make a GET request.
   */
  get(e, t, r) {
    return this.submit(e, t, "GET", r);
  }
  /**
   * Post form.
   */
  post(e, t, r) {
    return r = r || "POST", this.submit(e, t, "POST", r);
  }
  /**
   * Make a PUT request.
   */
  put(e, t) {
    return this.post(e, t, "PUT");
  }
  /**
   * Make a PATCH request.
   */
  patch(e, t) {
    return this.post(e, t, "PATCH");
  }
  /**
   * Make a DELETE request.
   */
  delete(e, t) {
    return this.post(e, t, "DELETE");
  }
  /**
   * @see https://stackoverflow.com/a/53739792
   *
   * @param {Object} ob
   * @returns {Object}
   */
  static flattenObject(e) {
    const t = {};
    for (let r in e)
      if (e.hasOwnProperty(r))
        if (typeof e[r] == "object" && e[r] != null) {
          const i = this.flattenObject(e[r]);
          for (let s in i)
            i.hasOwnProperty(s) && (t[r + "/" + s] = i[s]);
        } else
          t[r] = e[r];
    return t;
  }
  static buildFieldName(e) {
    const t = e.split("/");
    return t.shift() + t.map((i) => `[${i}]`).join("");
  }
}
export {
  a as UnicornFormElement
};
