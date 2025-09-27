import { M as Mixin, E as EventMixin, n as data, m as mergeDeep, r as useHttpClient } from "./unicorn-CR0afSsW.js";
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
    if (file instanceof Blob || file instanceof File) {
      options["Content-Type"] = options["Content-Type"] || file.type;
    }
    if (options["filename"]) {
      options["Content-Disposition"] = "attachment; filename*=UTF-8''" + encodeURIComponent(options["filename"]);
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiczMtdXBsb2FkZXItQ281ZjFYQ0EuanMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2R1bGUvczMtdXBsb2FkZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlSHR0cENsaWVudCB9IGZyb20gJy4uL2NvbXBvc2FibGUnO1xuaW1wb3J0IHsgZGF0YSB9IGZyb20gJy4uL2RhdGEnO1xuaW1wb3J0IHsgRXZlbnRBd2FyZUludGVyZmFjZSwgRXZlbnRNaXhpbiB9IGZyb20gJy4uL2V2ZW50cyc7XG5pbXBvcnQgdHlwZSB7IFVuaWNvcm5IdHRwQ2xpZW50IH0gZnJvbSAnLi9odHRwLWNsaWVudCc7XG5pbXBvcnQgeyBtZXJnZURlZXAgfSBmcm9tICcuLi91dGlsaXRpZXMnO1xuaW1wb3J0IHsgQXhpb3NQcm9ncmVzc0V2ZW50LCBBeGlvc1Jlc3BvbnNlIH0gZnJvbSAnYXhpb3MnO1xuaW1wb3J0IHsgTWl4aW4gfSBmcm9tICd0cy1taXhlcic7XG5cbmNvbnN0IGluc3RhbmNlczogUmVjb3JkPHN0cmluZywgUzNVcGxvYWRlcj4gPSB7fTtcbmV4cG9ydCBmdW5jdGlvbiBnZXQobmFtZTogc3RyaW5nLCBvcHRpb25zPzogUGFydGlhbDxTM1VwbG9hZGVyR2xvYmFsT3B0aW9ucz4pOiBTM1VwbG9hZGVyO1xuZXhwb3J0IGZ1bmN0aW9uIGdldChcbiAgbmFtZTogc3RyaW5nLFxuICBvcHRpb25zOiBQYXJ0aWFsPFMzVXBsb2FkZXJHbG9iYWxPcHRpb25zPiA9IHt9XG4pOiBTM1VwbG9hZGVyIHwgdm9pZCB7XG4gIHJldHVybiBpbnN0YW5jZXNbbmFtZV0gPz89IGNyZWF0ZShuYW1lLCBvcHRpb25zKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZShuYW1lOiBzdHJpbmcsIG9wdGlvbnM6IFBhcnRpYWw8UzNVcGxvYWRlckdsb2JhbE9wdGlvbnM+ID0ge30pOiBTM1VwbG9hZGVyIHtcbiAgcmV0dXJuIG5ldyBTM1VwbG9hZGVyKG5hbWUsIG9wdGlvbnMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVzdHJveShuYW1lOiBzdHJpbmcpIHtcbiAgZGVsZXRlIGluc3RhbmNlc1tuYW1lXTtcbn1cblxuY29uc3QgZGVmYXVsdE9wdGlvbnM6IFMzVXBsb2FkZXJHbG9iYWxPcHRpb25zID0ge1xuICBlbmRwb2ludDogJycsXG4gIHN1YmZvbGRlcjogJycsXG4gIHZpZXdlckhvc3Q6ICcnLFxuICBzdGFydHNfd2l0aDogW10sXG4gIGZvcm1JbnB1dHM6IHtcbiAgICBhY2w6ICcnLFxuICAgIGJ1Y2tldDogJycsXG4gICAga2V5OiAnJyxcbiAgICBQb2xpY3k6ICcnLFxuICAgICdYLUFtei1BbGdvcml0aG0nOiAnJyxcbiAgICAnWC1BbXotQ3JlZGVudGlhbCc6ICcnLFxuICAgICdYLUFtei1EYXRlJzogJycsXG4gICAgJ1gtQW16LVNpZ25hdHVyZSc6ICcnLFxuICB9XG59O1xuXG5leHBvcnQgY2xhc3MgUzNVcGxvYWRlciBleHRlbmRzIE1peGluKEV2ZW50TWl4aW4pIGltcGxlbWVudHMgRXZlbnRBd2FyZUludGVyZmFjZSB7XG4gIG9wdGlvbnM6IFMzVXBsb2FkZXJHbG9iYWxPcHRpb25zO1xuICBodHRwPzogVW5pY29ybkh0dHBDbGllbnQ7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIG5hbWU6IHN0cmluZywgb3B0aW9uczogUGFydGlhbDxTM1VwbG9hZGVyR2xvYmFsT3B0aW9ucz4gPSB7fSkge1xuICAgIHN1cGVyKCk7XG5cbiAgICBjb25zdCBhd3NPcHRpb25zID0gZGF0YSgnQHMzLnVwbG9hZGVyLicgKyBuYW1lKSB8fCB7fTtcblxuICAgIHRoaXMub3B0aW9ucyA9IG1lcmdlRGVlcDxTM1VwbG9hZGVyR2xvYmFsT3B0aW9ucz4oe30sIGRlZmF1bHRPcHRpb25zLCBhd3NPcHRpb25zLCBvcHRpb25zKTtcbiAgfVxuXG4gIGFzeW5jIGdldEh0dHBDbGllbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaHR0cCA/Pz0gYXdhaXQgdXNlSHR0cENsaWVudCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIERvIHVwbG9hZC5cbiAgICovXG4gIGFzeW5jIHVwbG9hZChcbiAgICBmaWxlOiBzdHJpbmcgfCBGaWxlIHwgQmxvYixcbiAgICBwYXRoOiBzdHJpbmcsXG4gICAgb3B0aW9uczogUGFydGlhbDxTM1VwbG9hZGVyUmVxdWVzdE9wdGlvbnM+ID0ge31cbiAgKTogUHJvbWlzZTxTM1VwbG9hZGVyUmVzcG9uc2U+IHtcbiAgICBjb25zdCBodHRwQ2xpZW50ID0gYXdhaXQgdGhpcy5nZXRIdHRwQ2xpZW50KCk7XG5cbiAgICBjb25zdCBmaWxlRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICAgIGNvbnN0IGlucHV0cyA9IG1lcmdlRGVlcCh7fSwgdGhpcy5vcHRpb25zLmZvcm1JbnB1dHMsIG9wdGlvbnMuZm9ybUlucHV0cyB8fCB7fSk7XG5cbiAgICBpZiAodHlwZW9mIGZpbGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICBmaWxlID0gbmV3IEJsb2IoW2ZpbGVdLCB7IHR5cGU6IG9wdGlvbnNbJ0NvbnRlbnQtVHlwZSddIHx8ICd0ZXh0L3BsYWluJyB9KTtcbiAgICB9XG5cbiAgICBpZiAoKGZpbGUgaW5zdGFuY2VvZiBCbG9iKSB8fCAoZmlsZSBhcyBhbnkpIGluc3RhbmNlb2YgRmlsZSkge1xuICAgICAgb3B0aW9uc1snQ29udGVudC1UeXBlJ10gPSBvcHRpb25zWydDb250ZW50LVR5cGUnXSB8fCBmaWxlLnR5cGU7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnNbJ2ZpbGVuYW1lJ10pIHtcbiAgICAgIG9wdGlvbnNbJ0NvbnRlbnQtRGlzcG9zaXRpb24nXSA9ICdhdHRhY2htZW50OyBmaWxlbmFtZSo9VVRGLThcXCdcXCcnICsgZW5jb2RlVVJJQ29tcG9uZW50KG9wdGlvbnNbJ2ZpbGVuYW1lJ10pO1xuICAgIH1cblxuICAgIG9wdGlvbnNbJ2tleSddID0gdHJpbVNsYXNoZXModGhpcy5vcHRpb25zLnN1YmZvbGRlciB8fCAnJykgKyAnLydcbiAgICAgICsgdHJpbVNsYXNoZXMocGF0aCk7XG4gICAgb3B0aW9uc1sna2V5J10gPSB0cmltU2xhc2hlcyhvcHRpb25zWydrZXknXSk7XG4gICAgb3B0aW9uc1snQ29udGVudC1UeXBlJ10gPSBvcHRpb25zWydDb250ZW50LVR5cGUnXSB8fCB1bmRlZmluZWQ7XG4gICAgb3B0aW9uc1snQ29udGVudC1EaXNwb3NpdGlvbiddID0gb3B0aW9uc1snQ29udGVudC1EaXNwb3NpdGlvbiddIHx8IHVuZGVmaW5lZDtcblxuICAgIC8vIFByZXBhcmUgcHJlLXNpZ25lZCBkYXRhXG4gICAgZm9yIChsZXQga2V5IGluIGlucHV0cykge1xuICAgICAgZmlsZURhdGEuc2V0KGtleSwgaW5wdXRzW2tleV0pO1xuICAgIH1cblxuICAgIC8vIFByZXBhcmUgY3VzdG9tIGRhdGFcbiAgICBmb3IgKGxldCBrZXkgb2YgT2JqZWN0LmtleXModGhpcy5vcHRpb25zLnN0YXJ0c193aXRoKSkge1xuICAgICAgaWYgKG9wdGlvbnNba2V5XSkge1xuICAgICAgICBmaWxlRGF0YS5zZXQoa2V5LCBvcHRpb25zW2tleV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZpbGVEYXRhLmFwcGVuZCgnZmlsZScsIGZpbGUpO1xuXG4gICAgdGhpcy50cmlnZ2VyKCdzdGFydCcsIGZpbGVEYXRhKTtcblxuICAgIHRyeSB7XG4gICAgICBsZXQgcmVzID0gYXdhaXQgaHR0cENsaWVudC5wb3N0KFxuICAgICAgICB0aGlzLm9wdGlvbnMuZW5kcG9pbnQgfHwgJycsXG4gICAgICAgIGZpbGVEYXRhLFxuICAgICAgICB7XG4gICAgICAgICAgb25VcGxvYWRQcm9ncmVzczogKGUpID0+IHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLm9uVXBsb2FkUHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgICAgb3B0aW9ucy5vblVwbG9hZFByb2dyZXNzKGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnRyaWdnZXIoJ3VwbG9hZC1wcm9ncmVzcycsIGUpO1xuXG4gICAgICAgICAgICBpZiAoZS50b3RhbCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgIHRoaXMudHJpZ2dlcigncHJvZ3Jlc3MnLCBlLmxvYWRlZCAvIGUudG90YWwsIGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgKSBhcyBTM1VwbG9hZGVyUmVzcG9uc2U7XG5cbiAgICAgIGNvbnN0IHVybCA9IHRoaXMub3B0aW9ucy52aWV3ZXJIb3N0ICsgJy8nXG4gICAgICAgICsgdHJpbVNsYXNoZXMocGF0aCk7XG5cbiAgICAgIHRoaXMudHJpZ2dlcignc3VjY2VzcycsIHVybCwgcmVzKTtcblxuICAgICAgcmVzLnVybCA9IHVybDtcblxuICAgICAgcmV0dXJuIHJlcztcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy50cmlnZ2VyKCdlbmQnKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gdHJpbVNsYXNoZXMoc3RyOiBzdHJpbmcpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFwvK3xcXC8rJC9nLCAnJyk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUzNVcGxvYWRlclJlc3BvbnNlIGV4dGVuZHMgQXhpb3NSZXNwb25zZSB7XG4gIHVybDogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFMzVXBsb2FkZXJHbG9iYWxPcHRpb25zIHtcbiAgZW5kcG9pbnQ/OiBzdHJpbmc7XG4gIHN1YmZvbGRlcj86IHN0cmluZztcbiAgdmlld2VySG9zdD86IHN0cmluZztcbiAgc3RhcnRzX3dpdGg6IGFueVtdO1xuICBmb3JtSW5wdXRzPzoge1xuICAgIGFjbDogc3RyaW5nO1xuICAgIGJ1Y2tldDogc3RyaW5nO1xuICAgIGtleTogc3RyaW5nO1xuICAgIFBvbGljeTogc3RyaW5nO1xuICAgICdYLUFtei1BbGdvcml0aG0nOiBzdHJpbmc7XG4gICAgJ1gtQW16LUNyZWRlbnRpYWwnOiBzdHJpbmc7XG4gICAgJ1gtQW16LURhdGUnOiBzdHJpbmc7XG4gICAgJ1gtQW16LVNpZ25hdHVyZSc6IHN0cmluZztcbiAgICBbbmFtZTogc3RyaW5nXTogYW55XG4gIH0sXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUzNVcGxvYWRlclJlcXVlc3RPcHRpb25zIHtcbiAgZm9ybUlucHV0cz86IHsgW25hbWU6IHN0cmluZ106IGFueSB9O1xuICBvblVwbG9hZFByb2dyZXNzPzogKGU6IEF4aW9zUHJvZ3Jlc3NFdmVudCkgPT4gdm9pZDtcbiAgJ0NvbnRlbnQtVHlwZSc/OiBzdHJpbmc7XG4gICdDb250ZW50LURpc3Bvc2l0aW9uJz86IHN0cmluZztcbiAga2V5Pzogc3RyaW5nO1xuXG4gIFtuYW1lOiBzdHJpbmddOiBhbnk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUzNVcGxvYWRlck1vZHVsZSB7XG4gIGdldChuYW1lOiBzdHJpbmcsIG9wdGlvbnM/OiBQYXJ0aWFsPFMzVXBsb2FkZXJHbG9iYWxPcHRpb25zPik6IFMzVXBsb2FkZXI7XG4gIGNyZWF0ZShuYW1lOiBzdHJpbmcsIG9wdGlvbnM/OiBQYXJ0aWFsPFMzVXBsb2FkZXJHbG9iYWxPcHRpb25zPik6IFMzVXBsb2FkZXI7XG4gIGRlc3Ryb3kobmFtZTogc3RyaW5nKTogdm9pZDtcbiAgUzNVcGxvYWRlcjogdHlwZW9mIFMzVXBsb2FkZXI7XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQVFBLE1BQU0sWUFBd0MsQ0FBQTtBQUV2QyxTQUFTLElBQ2QsTUFDQSxVQUE0QyxJQUN6QjtBQUNuQixTQUFPLFVBQVUsSUFBSSxNQUFNLE9BQU8sTUFBTSxPQUFPO0FBQ2pEO0FBRU8sU0FBUyxPQUFPLE1BQWMsVUFBNEMsSUFBZ0I7QUFDL0YsU0FBTyxJQUFJLFdBQVcsTUFBTSxPQUFPO0FBQ3JDO0FBRU8sU0FBUyxRQUFRLE1BQWM7QUFDcEMsU0FBTyxVQUFVLElBQUk7QUFDdkI7QUFFQSxNQUFNLGlCQUEwQztBQUFBLEVBQzlDLFVBQVU7QUFBQSxFQUNWLFdBQVc7QUFBQSxFQUNYLFlBQVk7QUFBQSxFQUNaLGFB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
