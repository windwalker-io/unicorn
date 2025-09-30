import type { UnicornHttpClient } from '../module/http-client';
import type { AxiosInstance, CreateAxiosDefaults } from 'axios';

export async function useHttpClient(config?: CreateAxiosDefaults | AxiosInstance): Promise<UnicornHttpClient> {
  const { createHttpClient } = await import('../module/http-client');

  return createHttpClient(config as CreateAxiosDefaults | undefined);
}
