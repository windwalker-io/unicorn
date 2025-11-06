import { af as Mixin, a7 as mergeDeep, ah as createQueue, u as useHttpClient, ag as EventMixin } from "./unicorn.js";
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
    if (file instanceof Blob && !(file instanceof File)) {
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
    const beforeUnloadHandler = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    if (this.options.leaveAlert === true) {
      window.addEventListener("beforeunload", beforeUnloadHandler);
    }
    const { id } = await this.request(
      "init",
      initData
    );
    this.trigger("inited", { id, path });
    try {
      const chunkSize = this.options.chunkSize;
      const chunks = Math.ceil(file.size / chunkSize);
      let uploadedBytes = 0;
      let parts = [];
      let currentPart = 1;
      const queue = createQueue(this.options.concurrency);
      const promises = [];
      const partsUploaded = {};
      while (currentPart <= chunks) {
        const partNumber = currentPart;
        const p = queue.push(async () => {
          const { blob, etag } = await this.uploadPart(
            file,
            {
              id,
              path,
              partNumber,
              chunkSize,
              onUploadProgress: (e) => {
                partsUploaded[partNumber] = e.loaded;
                const uploaded = Object.values(partsUploaded).reduce((sum, a) => sum + a, 0);
                this.updateProgress(uploaded, file.size, options);
              }
            }
          );
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
      this.trigger("success", { id, path, url });
      return { url, id, path };
    } catch (e) {
      await this.abort(id, path);
      this.trigger("failure", { error: e, id, path });
      throw e;
    } finally {
      if (this.options.leaveAlert === true) {
        window.removeEventListener("beforeunload", beforeUnloadHandler);
      }
    }
  }
  async uploadPart(file, payload) {
    const http = await useHttpClient();
    const { id, path, partNumber, chunkSize, onUploadProgress } = payload;
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
    const res = await http.put(
      url,
      blob,
      {
        onUploadProgress
      }
    );
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
  // protected async abortBeacon(id: string, path: string): Promise<void> {
  //   const data = new FormData();
  //   data.append('id', id);
  //   data.append('path', path);
  //   data.append('profile', this.options.profile || '');
  //
  //   await navigator.sendBeacon(route(await this.resolveRoute('abort')), data);
  // }
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
    const percentage = loaded / total * 100;
    const event = { percentage, loaded, total };
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
  setChunkSize(size) {
    this.options.chunkSize = size;
    return this;
  }
  setChunkSizeInMiB(size) {
    this.options.chunkSize = size * 1024 * 1024;
    return this;
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
//# sourceMappingURL=s3-multipart-uploader.js.map
