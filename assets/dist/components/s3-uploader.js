import { M as f, E as g, d as h, m as c, j as y } from "../chunks/unicorn-Dap6NpVD.js";
const u = {};
function D(s, e = {}) {
  return u[s] ??= m(s, e);
}
function m(s, e = {}) {
  return new w(s, e);
}
function b(s) {
  delete u[s];
}
const C = {
  endpoint: "",
  subfolder: "",
  viewerHost: "",
  starts_with: [],
  formInputs: {
    acl: "",
    bucket: "",
    key: "",
    Policy: "",
    "X-Amz-Algorithm": "",
    "X-Amz-Credential": "",
    "X-Amz-Date": "",
    "X-Amz-Signature": ""
  }
};
class w extends (/* @__PURE__ */ f(g)) {
  constructor(e, o = {}) {
    super(), this.name = e;
    const t = h("@s3.uploader." + e) || {};
    this.options = c({}, C, t, o);
  }
  options;
  http;
  async getHttpClient() {
    return this.http ??= await y();
  }
  /**
   * Do upload.
   */
  async upload(e, o, t = {}) {
    const d = await this.getHttpClient(), i = new FormData(), l = c({}, this.options.formInputs, t.formInputs || {});
    typeof e == "string" && (e = new Blob([e], { type: t["Content-Type"] || "text/plain" })), (e instanceof Blob || e instanceof File) && (t["Content-Type"] = t["Content-Type"] || e.type), t.filename && (t["Content-Disposition"] = "attachment; filename*=UTF-8''" + encodeURIComponent(t.filename)), t.key = a(this.options.subfolder || "") + "/" + a(o), t.key = a(t.key), t["Content-Type"] = t["Content-Type"] || void 0, t["Content-Disposition"] = t["Content-Disposition"] || void 0;
    for (let n in l)
      i.set(n, l[n]);
    for (let n of Object.keys(this.options.starts_with))
      t[n] && i.set(n, t[n]);
    i.append("file", e), this.trigger("start", i);
    try {
      let n = await d.post(
        this.options.endpoint || "",
        i,
        {
          onUploadProgress: (r) => {
            t.onUploadProgress && t.onUploadProgress(r), this.trigger("upload-progress", r), r.total != null && this.trigger("progress", r.loaded / r.total, r);
          }
        }
      );
      const p = this.options.viewerHost + "/" + a(o);
      return this.trigger("success", p, n), n.url = p, n;
    } finally {
      this.trigger("end");
    }
  }
}
function a(s) {
  return s.replace(/^\/+|\/+$/g, "");
}
export {
  w as S3Uploader,
  m as create,
  b as destroy,
  D as get
};
