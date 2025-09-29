import { a9 as Mixin, aa as EventMixin, a1 as mergeDeep, ab as createQueue, u as useHttpClient } from "./unicorn-DFzPUtbL.js";
const defaultOptions = {
  chunkSize: 5 * 1024 * 1024,
  // 5MB
  concurrency: 2
};
class S3MultipartUploader extends (/* @__PURE__ */ Mixin(EventMixin)) {
  options;
  constructor(options) {
    super();
    this.options = mergeDeep({}, defaultOptions, options);
  }
  async upload(file, path, options = {}) {
    const extra = { ...this.options.extra ?? {}, ...options.extra ?? {} };
    if (typeof file === "string") {
      file = new Blob([file], { type: options["ContentType"] || "text/plain" });
    }
    if (file instanceof Blob) {
      if (path.endsWith(".{ext}")) {
        throw new Error("If using Blob or file data string, you must provide a valid file extension in the path.");
      }
      file = new File([file], "blob", { type: file.type });
    }
    if (file instanceof File) {
      extra["ContentType"] = options["ContentType"] || file.type;
    }
    if (options.ACL || this.options.ACL) {
      extra.ACL = options.ACL || this.options.ACL;
    }
    path = this.replaceExt(path, file);
    const initData = { extra, path, profile: this.options.profile };
    if (options["filename"]) {
      initData["filename"] = options["filename"];
    }
    this.trigger("start", file, initData);
    const { id } = await this.request(
      "init",
      initData
    );
    try {
      const chunkSize = this.options.chunkSize;
      const chunks = Math.ceil(file.size / chunkSize);
      let uploadedBytes = 0;
      let parts = [];
      let currentPart = 1;
      const queue = createQueue(this.options.concurrency);
      const promises = [];
      while (currentPart <= chunks) {
        const partNumber = currentPart;
        const p = queue.push(async () => {
          const { blob, etag } = await this.uploadPart(file, { id, path, partNumber, chunkSize });
          uploadedBytes += blob.size;
          this.updateProgress(uploadedBytes, file.size, options);
          parts.push({ ETag: etag, PartNumber: partNumber });
        });
        promises.push(p);
        currentPart++;
      }
      await Promise.all(promises);
      const { url } = await this.request(
        "complete",
        {
          id,
          path,
          parts: parts.sort((a, b) => a.PartNumber - b.PartNumber),
          profile: this.options.profile
        }
      );
      this.trigger("success", url);
      return { url };
    } catch (e) {
      await this.abort(id, path);
      throw e;
    }
  }
  async uploadPart(file, payload) {
    const http = await useHttpClient();
    const { id, path, partNumber, chunkSize } = payload;
    const start = (partNumber - 1) * chunkSize;
    const end = Math.min(partNumber * chunkSize, file.size);
    const blob = file.slice(start, end);
    const { url } = await this.request(
      "sign",
      {
        id,
        path,
        partNumber,
        profile: this.options.profile
      }
    );
    const res = await http.put(url, blob);
    const etag = String(res.headers.get("ETag") || "");
    return { blob, etag };
  }
  async request(action, body) {
    if (this.options.requestHandler) {
      return this.options.requestHandler(action, body);
    }
    const http = await useHttpClient();
    const res = await http.post(await this.resolveRoute(action), body);
    return res.data.data;
  }
  async abort(id, path) {
    await this.request(
      "abort",
      {
        id,
        path,
        profile: this.options.profile
      }
    );
  }
  updateProgress(loaded, total, options) {
    const percent = loaded / total * 100;
    const event = { percent, loaded, total };
    this.trigger("progress", event);
    this.options.onProgress?.(event);
    if (options.onProgress) {
      options.onProgress(event);
    }
  }
  async resolveRoute(action) {
    if (typeof this.options.routes === "function") {
      return this.options.routes(action);
    }
    return this.options.routes[action];
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
}
export {
  S3MultipartUploader
};
