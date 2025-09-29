async function useS3Uploader(name, options = {}) {
  const module = await import("../module/s3-uploader.js");
  if (!name) {
    return module;
  }
  const { get } = module;
  return get(name, options);
}
async function useS3MultipartUploader(options) {
  const module = await import("../module/s3-multipart-uploader.js");
  if (options != null) {
    return new module.S3MultipartUploader(options);
  }
  return module;
}
export {
  useS3MultipartUploader as a,
  useS3Uploader as u
};
