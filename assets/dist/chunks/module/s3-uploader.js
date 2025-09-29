import { d as data } from "../data.js";
import { E as EventMixin } from "../events.js";
import { M as Mixin } from "../app.js";
import { m as mergeDeep } from "../utilities/arr.js";
import { u as useHttpClient } from "../composable/useHttp.js";
const instances = {};
function get(name, options = {}) {
  return instances[name] ??= create(name, options);
}
function create(name, options = {}) {
  return new S3Uploader(name, options);
}
function destroy(name) {
  delete instances[name];
}
const defaultOptions = {
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
class S3Uploader extends (/* @__PURE__ */ Mixin(EventMixin)) {
  constructor(name, options = {}) {
    super();
    this.name = name;
    const awsOptions = data("@s3.uploader." + name) || {};
    this.options = mergeDeep({}, defaultOptions, awsOptions, options);
  }
  options;
  http;
  async getHttpClient() {
    return this.http ??= await useHttpClient();
  }
  /**
   * Do upload.
   */
  async upload(file, path, options = {}) {
    const httpClient = await this.getHttpClient();
    const fileData = new FormData();
    const inputs = mergeDeep({}, this.options.formInputs, options.formInputs || {});
    if (typeof file === "string") {
      file = new Blob([file], { type: options["Content-Type"] || "text/plain" });
    }
    if (file instanceof Blob && path.endsWith(".{ext}")) {
      throw new Error("If using Blob or file data string, you must provide a valid file extension in the path.");
    }
    if (file instanceof Blob || file instanceof File) {
      options["Content-Type"] = options["Content-Type"] || file.type;
    }
    if (options["filename"]) {
      const filename = this.replaceExt(options["filename"], file);
      options["Content-Disposition"] = "attachment; filename*=UTF-8''" + encodeURIComponent(filename);
    }
    path = this.replaceExt(path, file);
    options["key"] = trimSlashes(this.options.subfolder || "") + "/" + trimSlashes(path);
    options["key"] = trimSlashes(options["key"]);
    options["Content-Type"] = options["Content-Type"] || void 0;
    options["Content-Disposition"] = options["Content-Disposition"] || void 0;
    for (let key in inputs) {
      fileData.set(key, inputs[key]);
    }
    for (let key of Object.keys(this.options.starts_with)) {
      if (options[key]) {
        fileData.set(key, options[key]);
      }
    }
    fileData.append("file", file);
    this.trigger("start", fileData);
    try {
      let res = await httpClient.post(
        this.options.endpoint || "",
        fileData,
        {
          onUploadProgress: (e) => {
            if (options.onUploadProgress) {
              options.onUploadProgress(e);
            }
            this.trigger("upload-progress", e);
            if (e.total != null) {
              this.trigger("progress", e.loaded / e.total, e);
            }
          }
        }
      );
      const url = this.options.viewerHost + "/" + trimSlashes(path);
      this.trigger("success", url, res);
      res.url = url;
      return res;
    } finally {
      this.trigger("end");
    }
  }
  replaceExt(path, file) {
    if (file instanceof File) {
      const fileExt = file.name.split(".").pop();
      if (path.endsWith(".{ext}")) {
        return path.replace(/\.{ext}$/, fileExt ? "." + fileExt : "");
      }
    }
    return path;
  }
  on(event, handler) {
    return super.on(event, handler);
  }
  onStart(handler) {
    return this.on("start", handler);
  }
  onSuccess(handler) {
    return this.on("success", handler);
  }
  onEnd(handler) {
    return this.on("end", handler);
  }
  onProgress(handler) {
    return this.on("upload-progress", handler);
  }
  onProgressWithTotal(handler) {
    return this.on("progress", handler);
  }
}
function trimSlashes(str) {
  return str.replace(/^\/+|\/+$/g, "");
}
export {
  S3Uploader,
  create,
  destroy,
  get
};
