async function useHttpClient(config) {
  const { UnicornHttpClient } = await import("../module/http-client.js");
  if (config && "interceptors" in config) {
    const axios = config;
    const http = new UnicornHttpClient();
    http.axios = axios;
    return http;
  }
  return new UnicornHttpClient(config);
}
async function useLoadedHttpClient(config) {
  const http = await useHttpClient(config);
  await http.getAxiosInstance();
  return http;
}
export {
  useLoadedHttpClient as a,
  useHttpClient as u
};
