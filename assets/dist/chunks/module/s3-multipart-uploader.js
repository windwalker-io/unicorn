import { M as Mixin } from "../app.js";
import { E as EventMixin } from "../events.js";
import { h as createQueue } from "../composable/useQueue.js";
import { m as mergeDeep } from "../utilities/arr.js";
import { u as useHttpClient } from "../composable/useHttp.js";
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
      this.trigger("success", url);
      return { url };
    } catch (e) {
      await this.abort(id, path);
      throw e;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiczMtbXVsdGlwYXJ0LXVwbG9hZGVyLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbW9kdWxlL3MzLW11bHRpcGFydC11cGxvYWRlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBeGlvc1Byb2dyZXNzRXZlbnQsIEF4aW9zUmVzcG9uc2VIZWFkZXJzIH0gZnJvbSAnYXhpb3MnO1xyXG5pbXBvcnQgeyBNaXhpbiB9IGZyb20gJ3RzLW1peGVyJztcclxuaW1wb3J0IHsgY3JlYXRlUXVldWUsIHVzZUh0dHBDbGllbnQgfSBmcm9tICcuLi9jb21wb3NhYmxlJztcclxuaW1wb3J0IHsgRXZlbnRIYW5kbGVyLCBFdmVudE1peGluIH0gZnJvbSAnLi4vZXZlbnRzJztcclxuaW1wb3J0IHR5cGUgeyBNYXliZVByb21pc2UgfSBmcm9tICcuLi90eXBlcyc7XHJcbmltcG9ydCB7IG1lcmdlRGVlcCB9IGZyb20gJy4uL3V0aWxpdGllcyc7XHJcbmltcG9ydCB7IEFwaVJldHVybiB9IGZyb20gJy4vaHR0cC1jbGllbnQnO1xyXG5cclxuZGVjbGFyZSB0eXBlIFJvdXRpbmdPcHRpb25zID0ge1xyXG4gIGluaXQ6IHN0cmluZztcclxuICBzaWduOiBzdHJpbmc7XHJcbiAgY29tcGxldGU6IHN0cmluZztcclxuICBhYm9ydDogc3RyaW5nO1xyXG59IHwgKChhY3Rpb246IFJvdXRlQWN0aW9ucykgPT4gTWF5YmVQcm9taXNlPHN0cmluZz4pO1xyXG5cclxuZGVjbGFyZSB0eXBlIFJvdXRlQWN0aW9ucyA9ICdpbml0JyB8ICdzaWduJyB8ICdjb21wbGV0ZScgfCAnYWJvcnQnO1xyXG5kZWNsYXJlIHR5cGUgUmVxdWVzdEhhbmRsZXIgPSA8VCA9IFJlY29yZDxzdHJpbmcsIGFueT4+KGFjdGlvbjogUm91dGVBY3Rpb25zLCBkYXRhOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSA9PiBQcm9taXNlPFQ+O1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBTM011bHRpcGFydFVwbG9hZGVyT3B0aW9ucyB7XHJcbiAgcHJvZmlsZT86IHN0cmluZztcclxuICBjaHVua1NpemU6IG51bWJlcjtcclxuICBjb25jdXJyZW5jeTogbnVtYmVyO1xyXG4gIHJvdXRlczogUm91dGluZ09wdGlvbnM7XHJcbiAgcmVxdWVzdEhhbmRsZXI/OiBSZXF1ZXN0SGFuZGxlcjtcclxuICBvblByb2dyZXNzPzogUHJvZ3Jlc3NFdmVudEhhbmRsZXI7XHJcbiAgQUNMPzogc3RyaW5nO1xyXG4gIGV4dHJhPzogUmVjb3JkPHN0cmluZywgYW55PjtcclxuXHJcbiAgLy8gbWF4UmV0cmllcz86IG51bWJlcjtcclxuICAvLyBlbmRwb2ludDogc3RyaW5nO1xyXG4gIC8vIHN1YmZvbGRlcj86IHN0cmluZztcclxufVxyXG5cclxuY29uc3QgZGVmYXVsdE9wdGlvbnM6IFBhcnRpYWw8UzNNdWx0aXBhcnRVcGxvYWRlck9wdGlvbnM+ID0ge1xyXG4gIGNodW5rU2l6ZTogNSAqIDEwMjQgKiAxMDI0LCAvLyA1TUJcclxuICBjb25jdXJyZW5jeTogMixcclxufTtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUzNNdWx0aXBhcnRVcGxvYWRlclJlcXVlc3RPcHRpb25zIHtcclxuICBvblByb2dyZXNzPzogUHJvZ3Jlc3NFdmVudEhhbmRsZXI7XHJcbiAgZmlsZW5hbWU/OiBzdHJpbmc7XHJcbiAgQ29udGVudFR5cGU/OiBzdHJpbmc7XHJcbiAgQ29udGVudERpc3Bvc2l0aW9uPzogc3RyaW5nO1xyXG4gIEFDTD86IHN0cmluZztcclxuICBleHRyYT86IFJlY29yZDxzdHJpbmcsIGFueT47XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTM011bHRpcGFydFVwbG9hZGVyIGV4dGVuZHMgTWl4aW4oRXZlbnRNaXhpbikge1xyXG4gIG9wdGlvbnM6IFMzTXVsdGlwYXJ0VXBsb2FkZXJPcHRpb25zO1xyXG5cclxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBQYXJ0aWFsPFMzTXVsdGlwYXJ0VXBsb2FkZXJPcHRpb25zPikge1xyXG4gICAgc3VwZXIoKTtcclxuICAgIHRoaXMub3B0aW9ucyA9IG1lcmdlRGVlcCh7fSwgZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgdXBsb2FkKFxyXG4gICAgZmlsZTogc3RyaW5nIHwgRmlsZSB8IEJsb2IsXHJcbiAgICBwYXRoOiBzdHJpbmcsXHJcbiAgICBvcHRpb25zOiBTM011bHRpcGFydFVwbG9hZGVyUmVxdWVzdE9wdGlvbnMgPSB7fVxyXG4gICk6IFByb21pc2U8eyB1cmw6IHN0cmluZzsgfT4ge1xyXG4gICAgY29uc3QgZXh0cmE6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7IC4uLih0aGlzLm9wdGlvbnMuZXh0cmEgPz8ge30pLCAuLi4ob3B0aW9ucy5leHRyYSA/PyB7fSkgfTtcclxuXHJcbiAgICBpZiAodHlwZW9mIGZpbGUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIGZpbGUgPSBuZXcgQmxvYihbZmlsZV0sIHsgdHlwZTogb3B0aW9uc1snQ29udGVudFR5cGUnXSB8fCAndGV4dC9wbGFpbicgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGZpbGUgaW5zdGFuY2VvZiBCbG9iICYmICEoZmlsZSBpbnN0YW5jZW9mIEZpbGUpKSB7XHJcbiAgICAgIGlmIChwYXRoLmVuZHNXaXRoKCcue2V4dH0nKSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSWYgdXNpbmcgQmxvYiBvciBmaWxlIGRhdGEgc3RyaW5nLCB5b3UgbXVzdCBwcm92aWRlIGEgdmFsaWQgZmlsZSBleHRlbnNpb24gaW4gdGhlIHBhdGguJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZpbGUgPSBuZXcgRmlsZShbZmlsZV0sICdibG9iJywgeyB0eXBlOiBmaWxlLnR5cGUgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGZpbGUgaW5zdGFuY2VvZiBGaWxlKSB7XHJcbiAgICAgIGV4dHJhWydDb250ZW50VHlwZSddID0gb3B0aW9uc1snQ29udGVudFR5cGUnXSB8fCBmaWxlLnR5cGU7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG9wdGlvbnMuQUNMIHx8IHRoaXMub3B0aW9ucy5BQ0wpIHtcclxuICAgICAgZXh0cmEuQUNMID0gb3B0aW9ucy5BQ0wgfHwgdGhpcy5vcHRpb25zLkFDTDtcclxuICAgIH1cclxuXHJcbiAgICBwYXRoID0gdGhpcy5yZXBsYWNlRXh0KHBhdGgsIGZpbGUpO1xyXG5cclxuICAgIGNvbnN0IGluaXREYXRhOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0geyBleHRyYSwgcGF0aCwgcHJvZmlsZTogdGhpcy5vcHRpb25zLnByb2ZpbGUgfTtcclxuXHJcbiAgICBpZiAob3B0aW9uc1snZmlsZW5hbWUnXSkge1xyXG4gICAgICBpbml0RGF0YVsnZmlsZW5hbWUnXSA9IG9wdGlvbnNbJ2ZpbGVuYW1lJ107XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy50cmlnZ2VyKCdzdGFydCcsIGZpbGUsIGluaXREYXRhKTtcclxuXHJcbiAgICAvLyBAUmVxdWVzdCBzaWduXHJcbiAgICBjb25zdCB7IGlkIH0gPSBhd2FpdCB0aGlzLnJlcXVlc3Q8eyBpZDogc3RyaW5nOyB9PihcclxuICAgICAgJ2luaXQnLFxyXG4gICAgICBpbml0RGF0YVxyXG4gICAgKTtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBjaHVua1NpemUgPSB0aGlzLm9wdGlvbnMuY2h1bmtTaXplO1xyXG4gICAgICBjb25zdCBjaHVua3MgPSBNYXRoLmNlaWwoZmlsZS5zaXplIC8gY2h1bmtTaXplKTtcclxuXHJcbiAgICAgIGxldCB1cGxvYWRlZEJ5dGVzID0gMDtcclxuICAgICAgbGV0IHBhcnRzOiB7IEVUYWc6IHN0cmluZywgUGFydE51bWJlcjogbnVtYmVyIH1bXSA9IFtdO1xyXG4gICAgICBsZXQgY3VycmVudFBhcnQgPSAxO1xyXG4gICAgICBjb25zdCBxdWV1ZSA9IGNyZWF0ZVF1ZXVlKHRoaXMub3B0aW9ucy5jb25jdXJyZW5jeSk7XHJcbiAgICAgIGNvbnN0IHByb21pc2VzID0gW107XHJcbiAgICAgIGNvbnN0IHBhcnRzVXBsb2FkZWQ6IFJlY29yZDxudW1iZXIsIG51bWJlcj4gPSB7fTtcclxuXHJcbiAgICAgIC8vIExvb3AgZnJvbSAxIHRvIGNodW5rc1xyXG4gICAgICB3aGlsZSAoY3VycmVudFBhcnQgPD0gY2h1bmtzKSB7XHJcbiAgICAgICAgY29uc3QgcGFydE51bWJlciA9IGN1cnJlbnRQYXJ0O1xyXG5cclxuICAgICAgICAvLyBQdXNoIHRvIHF1ZXVlXHJcbiAgICAgICAgY29uc3QgcCA9IHF1ZXVlLnB1c2goYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgeyBibG9iLCBldGFnIH0gPSBhd2FpdCB0aGlzLnVwbG9hZFBhcnQoXHJcbiAgICAgICAgICAgIGZpbGUgYXMgRmlsZSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGlkLFxyXG4gICAgICAgICAgICAgIHBhdGgsXHJcbiAgICAgICAgICAgICAgcGFydE51bWJlcixcclxuICAgICAgICAgICAgICBjaHVua1NpemUsXHJcbiAgICAgICAgICAgICAgb25VcGxvYWRQcm9ncmVzczogKGUpID0+IHtcclxuICAgICAgICAgICAgICAgIHBhcnRzVXBsb2FkZWRbcGFydE51bWJlcl0gPSBlLmxvYWRlZDtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCB1cGxvYWRlZCA9IE9iamVjdC52YWx1ZXMocGFydHNVcGxvYWRlZCkucmVkdWNlKChzdW0sIGEpID0+IHN1bSArIGEsIDApO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUHJvZ3Jlc3ModXBsb2FkZWQsIGZpbGUuc2l6ZSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgIHVwbG9hZGVkQnl0ZXMgKz0gYmxvYi5zaXplO1xyXG5cclxuICAgICAgICAgIHRoaXMudXBkYXRlUHJvZ3Jlc3ModXBsb2FkZWRCeXRlcywgZmlsZS5zaXplLCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgICBwYXJ0cy5wdXNoKHsgRVRhZzogZXRhZywgUGFydE51bWJlcjogcGFydE51bWJlciB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcHJvbWlzZXMucHVzaChwKTtcclxuXHJcbiAgICAgICAgY3VycmVudFBhcnQrKztcclxuICAgICAgfVxyXG5cclxuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xyXG5cclxuICAgICAgLy8gQFJlcXVlc3Qgc2lnblxyXG4gICAgICBjb25zdCB7IHVybCB9ID0gYXdhaXQgdGhpcy5yZXF1ZXN0PHsgdXJsOiBzdHJpbmcgfT4oXHJcbiAgICAgICAgJ2NvbXBsZXRlJyxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZCxcclxuICAgICAgICAgIHBhdGgsXHJcbiAgICAgICAgICBwYXJ0czogcGFydHMuc29ydCgoYSwgYikgPT4gYS5QYXJ0TnVtYmVyIC0gYi5QYXJ0TnVtYmVyKSxcclxuICAgICAgICAgIHByb2ZpbGU6IHRoaXMub3B0aW9ucy5wcm9maWxlLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICk7XHJcblxyXG4gICAgICB0aGlzLnRyaWdnZXIoJ3N1Y2Nlc3MnLCB1cmwpO1xyXG5cclxuICAgICAgcmV0dXJuIHsgdXJsIH07XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIGF3YWl0IHRoaXMuYWJvcnQoaWQsIHBhdGgpO1xyXG5cclxuICAgICAgdGhyb3cgZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBhc3luYyB1cGxvYWRQYXJ0KFxyXG4gICAgZmlsZTogRmlsZSxcclxuICAgIHBheWxvYWQ6IHtcclxuICAgICAgaWQ6IHN0cmluZztcclxuICAgICAgcGF0aDogc3RyaW5nO1xyXG4gICAgICBwYXJ0TnVtYmVyOiBudW1iZXI7XHJcbiAgICAgIGNodW5rU2l6ZTogbnVtYmVyO1xyXG4gICAgICBvblVwbG9hZFByb2dyZXNzOiAoZTogQXhpb3NQcm9ncmVzc0V2ZW50KSA9PiB2b2lkO1xyXG4gICAgfVxyXG4gICkge1xyXG4gICAgY29uc3QgaHR0cCA9IGF3YWl0IHVzZUh0dHBDbGllbnQoKTtcclxuICAgIGNvbnN0IHsgaWQsIHBhdGgsIHBhcnROdW1iZXIsIGNodW5rU2l6ZSwgb25VcGxvYWRQcm9ncmVzcyB9ID0gcGF5bG9hZDtcclxuXHJcbiAgICBjb25zdCBzdGFydCA9IChwYXJ0TnVtYmVyIC0gMSkgKiBjaHVua1NpemU7XHJcbiAgICBjb25zdCBlbmQgPSBNYXRoLm1pbihwYXJ0TnVtYmVyICogY2h1bmtTaXplLCBmaWxlLnNpemUpO1xyXG5cclxuICAgIGNvbnN0IGJsb2IgPSBmaWxlLnNsaWNlKHN0YXJ0LCBlbmQpO1xyXG5cclxuICAgIC8vIEBSZXF1ZXN0IHNpZ25cclxuICAgIGNvbnN0IHsgdXJsIH0gPSBhd2FpdCB0aGlzLnJlcXVlc3Q8eyB1cmw6IHN0cmluZzsgfT4oXHJcbiAgICAgICdzaWduJyxcclxuICAgICAge1xyXG4gICAgICAgIGlkLFxyXG4gICAgICAgIHBhdGgsXHJcbiAgICAgICAgcGFydE51bWJlcixcclxuICAgICAgICBwcm9maWxlOiB0aGlzLm9wdGlvbnMucHJvZmlsZSxcclxuICAgICAgfVxyXG4gICAgKTtcclxuXHJcbiAgICAvLyBQVVQgdG8gUzNcclxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGh0dHAucHV0KFxyXG4gICAgICB1cmwsXHJcbiAgICAgIGJsb2IsXHJcbiAgICAgIHtcclxuICAgICAgICBvblVwbG9hZFByb2dyZXNzLFxyXG4gICAgICB9XHJcbiAgICApO1xyXG5cclxuICAgIGNvbnN0IGV0YWcgPSBTdHJpbmcoKHJlcy5oZWFkZXJzIGFzIEF4aW9zUmVzcG9uc2VIZWFkZXJzKS5nZXQoJ0VUYWcnKSB8fCAnJyk7XHJcblxyXG4gICAgcmV0dXJuIHsgYmxvYiwgZXRhZyB9O1xyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIGFzeW5jIHJlcXVlc3Q8VCA9IFJlY29yZDxzdHJpbmcsIGFueT4+KGFjdGlvbjogUm91dGVBY3Rpb25zLCBib2R5OiBSZWNvcmQ8c3RyaW5nLCBhbnk+KTogUHJvbWlzZTxUPiB7XHJcbiAgICBpZiAodGhpcy5vcHRpb25zLnJlcXVlc3RIYW5kbGVyKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMucmVxdWVzdEhhbmRsZXI8VD4oYWN0aW9uLCBib2R5KTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBodHRwID0gYXdhaXQgdXNlSHR0cENsaWVudCgpO1xyXG5cclxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGh0dHAucG9zdDxBcGlSZXR1cm48VD4+KGF3YWl0IHRoaXMucmVzb2x2ZVJvdXRlKGFjdGlvbiksIGJvZHkpO1xyXG5cclxuICAgIHJldHVybiByZXMuZGF0YS5kYXRhO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgYWJvcnQoaWQ6IHN0cmluZywgcGF0aDogc3RyaW5nKSB7XHJcbiAgICBhd2FpdCB0aGlzLnJlcXVlc3QoXHJcbiAgICAgICdhYm9ydCcsXHJcbiAgICAgIHtcclxuICAgICAgICBpZCxcclxuICAgICAgICBwYXRoLFxyXG4gICAgICAgIHByb2ZpbGU6IHRoaXMub3B0aW9ucy5wcm9maWxlLFxyXG4gICAgICB9XHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlUHJvZ3Jlc3MobG9hZGVkOiBudW1iZXIsIHRvdGFsOiBudW1iZXIsIG9wdGlvbnM6IFMzTXVsdGlwYXJ0VXBsb2FkZXJSZXF1ZXN0T3B0aW9ucykge1xyXG4gICAgY29uc3QgcGVyY2VudGFnZSA9IChsb2FkZWQgLyB0b3RhbCkgKiAxMDA7XHJcblxyXG4gICAgY29uc3QgZXZlbnQ6IFByb2dyZXNzRXZlbnQgPSB7IHBlcmNlbnRhZ2UsIGxvYWRlZCwgdG90YWwgfTtcclxuXHJcbiAgICB0aGlzLnRyaWdnZXIoJ3Byb2dyZXNzJywgZXZlbnQpO1xyXG5cclxuICAgIHRoaXMub3B0aW9ucy5vblByb2dyZXNzPy4oZXZlbnQpO1xyXG5cclxuICAgIGlmIChvcHRpb25zLm9uUHJvZ3Jlc3MpIHtcclxuICAgICAgb3B0aW9ucy5vblByb2dyZXNzKGV2ZW50KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFzeW5jIHJlc29sdmVSb3V0ZShhY3Rpb246IFJvdXRlQWN0aW9ucyk6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5yb3V0ZXMgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5yb3V0ZXMoYWN0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLnJvdXRlc1thY3Rpb25dO1xyXG4gIH1cclxuXHJcbiAgc2V0Q2h1bmtTaXplKHNpemU6IG51bWJlcik6IHRoaXMge1xyXG4gICAgdGhpcy5vcHRpb25zLmNodW5rU2l6ZSA9IHNpemU7XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBzZXRDaHVua1NpemVJbk1pQihzaXplOiBudW1iZXIpOiB0aGlzIHtcclxuICAgIHRoaXMub3B0aW9ucy5jaHVua1NpemUgPSBzaXplICogMTAyNCAqIDEwMjQ7XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICByZXBsYWNlRXh0KHBhdGg6IHN0cmluZywgZmlsZTogRmlsZSB8IEJsb2IpOiBzdHJpbmcge1xyXG4gICAgaWYgKGZpbGUgaW5zdGFuY2VvZiBGaWxlKSB7XHJcbiAgICAgIGNvbnN0IGZpbGVFeHQgPSBmaWxlLm5hbWUuc3BsaXQoJy4nKS5wb3AoKTtcclxuXHJcbiAgICAgIGlmIChwYXRoLmVuZHNXaXRoKCcue2V4dH0nKSkge1xyXG4gICAgICAgIHJldHVybiBwYXRoLnJlcGxhY2UoL1xcLntleHR9JC8sIGZpbGVFeHQgPyAnLicgKyBmaWxlRXh0IDogJycpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHBhdGg7XHJcbiAgfVxyXG5cclxuICBvbihcclxuICAgIGV2ZW50OiAnc3RhcnQnLFxyXG4gICAgaGFuZGxlcjogKGZpbGU6IEZpbGUsIGRhdGE6IHsgcGF0aDogc3RyaW5nOyBleHRyYTogUmVjb3JkPHN0cmluZywgYW55PjsgW25hbWU6IHN0cmluZ106IGFueTsgfSkgPT4gdm9pZFxyXG4gICk6IHRoaXM7XHJcbiAgb24oZXZlbnQ6ICdzdWNjZXNzJywgaGFuZGxlcjogKHVybDogc3RyaW5nKSA9PiB2b2lkKTogdGhpcztcclxuICBvbihldmVudDogJ3Byb2dyZXNzJywgaGFuZGxlcjogKGV2ZW50OiBQcm9ncmVzc0V2ZW50KSA9PiB2b2lkKTogdGhpcztcclxuICBvbihldmVudDogc3RyaW5nIHwgc3RyaW5nW10sIGhhbmRsZXI6IEV2ZW50SGFuZGxlcik6IHRoaXMge1xyXG4gICAgcmV0dXJuIHN1cGVyLm9uKGV2ZW50LCBoYW5kbGVyKTtcclxuICB9XHJcbn1cclxuXHJcbnR5cGUgUHJvZ3Jlc3NFdmVudCA9IHtcclxuICBwZXJjZW50YWdlOiBudW1iZXI7XHJcbiAgbG9hZGVkOiBudW1iZXI7XHJcbiAgdG90YWw6IG51bWJlcjtcclxufTtcclxudHlwZSBQcm9ncmVzc0V2ZW50SGFuZGxlciA9IChlOiBQcm9ncmVzc0V2ZW50KSA9PiB2b2lkO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBTM011bHRpcGFydFVwbG9hZGVyTW9kdWxlIHtcclxuICBTM011bHRpcGFydFVwbG9hZGVyOiB0eXBlb2YgUzNNdWx0aXBhcnRVcGxvYWRlcjtcclxufVxyXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFpQ0EsTUFBTSxpQkFBc0Q7QUFBQSxFQUMxRCxXQUFXLElBQUksT0FBTztBQUFBO0FBQUEsRUFDdEIsYUFBYTtBQUNmO0FBV08sTUFBTSw2QkFBNEIsc0JBQU0sVUFBVSxHQUFFO0FBQUEsRUFDekQ7QUFBQSxFQUVBLFlBQVksU0FBOEM7QUFDeEQsVUFBQTtBQUNBLFNBQUssVUFBVSxVQUFVLENBQUEsR0FBSSxnQkFBZ0IsT0FBTztBQUFBLEVBQ3REO0FBQUEsRUFF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
