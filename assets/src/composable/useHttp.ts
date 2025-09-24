import type { UnicornHttpClient } from '@/components/http-client';
import type { AxiosInstance, CreateAxiosDefaults } from 'axios';

export async function useHttpClient(config?: CreateAxiosDefaults | AxiosInstance): Promise<UnicornHttpClient> {
  const { UnicornHttpClient } = await import('@/components/http-client');

  if ('interceptors' in config) {
    const axios = config as AxiosInstance;

    const http = new UnicornHttpClient();

    http.axios = axios;

    return http;
  }

  return new UnicornHttpClient(config);
}

export async function useLoadedHttpClient(config?: CreateAxiosDefaults): Promise<UnicornHttpClient> {
  const http = await useHttpClient(config);

  // Load and cache axios
  await http.getAxiosInstance();

  return http;
}
