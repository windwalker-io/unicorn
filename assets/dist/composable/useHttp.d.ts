import { UnicornHttpClient } from '../module/http-client';
import { AxiosInstance, CreateAxiosDefaults } from 'axios';
export declare function useHttpClient(config?: CreateAxiosDefaults | AxiosInstance): Promise<UnicornHttpClient>;
export declare function useLoadedHttpClient(config?: CreateAxiosDefaults): Promise<UnicornHttpClient>;
