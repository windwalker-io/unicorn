import { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosStatic, CreateAxiosDefaults, AxiosError } from 'axios';
declare global {
    let axios: AxiosStatic;
}
declare module 'axios' {
    interface AxiosRequestConfig {
        vars?: Record<string, any>;
        methodSimulate?: string;
        methodSimulateByHeader?: boolean;
    }
    interface CreateAxiosDefaults {
    }
}
export declare class UnicornHttpClient {
    protected config?: CreateAxiosDefaults;
    static axiosStatic?: Promise<AxiosStatic>;
    axios?: AxiosInstance;
    constructor(config?: CreateAxiosDefaults);
    static importAxios(): Promise<any>;
    static getAxiosStatic(): Promise<AxiosStatic>;
    createHttp(): Promise<AxiosInstance>;
    getAxiosInstance(): Promise<AxiosInstance>;
    prepareAxios(axios: AxiosInstance): AxiosInstance;
    requestMiddleware(callback: Parameters<AxiosInstance['interceptors']['request']['use']>[0]): Promise<number>;
    responseMiddleware(callback: Parameters<AxiosInstance['interceptors']['response']['use']>[0]): Promise<number>;
    /**
     * Send a GET request.
     */
    get<T = any, D = any>(url: string, options?: Partial<AxiosRequestConfig>): Promise<AxiosResponse<T, D>>;
    /**
     * Send a POST request.
     */
    post<T = any, D = any>(url: string, data?: any, options?: Partial<AxiosRequestConfig>): Promise<AxiosResponse<T, D>>;
    /**
     * Send a PUT request.
     *
     * @param {string} url
     * @param {any} data
     * @param {AxiosRequestConfig} options
     *
     * @returns {Promise<AxiosResponse>}
     */
    put<T = any, D = any>(url: string, data?: any, options?: Partial<AxiosRequestConfig>): Promise<AxiosResponse<T, D>>;
    /**
     * Send a PATCH request.
     *
     * @param {string} url
     * @param {any} data
     * @param {AxiosRequestConfig} options
     *
     * @returns {Promise<AxiosResponse>}
     */
    patch<T = any, D = any>(url: string, data?: any, options?: Partial<AxiosRequestConfig>): Promise<AxiosResponse<T, D>>;
    /**
     * Send a DELETE request.
     *
     * @param {string} url
     * @param {any} data
     * @param {AxiosRequestConfig} options
     *
     * @returns {Promise<AxiosResponse>}
     */
    delete<T = any, D = any>(url: string, data?: any, options?: Partial<AxiosRequestConfig>): Promise<AxiosResponse<T, D>>;
    /**
     * Send a HEAD request.
     *
     * @param {string} url
     * @param {AxiosRequestConfig} options
     *
     * @returns {Promise<AxiosResponse>}
     */
    head<T = any, D = any>(url: string, options?: Partial<AxiosRequestConfig>): Promise<AxiosResponse<T, D>>;
    /**
     * Send a OPTIONS request.
     *
     * @param {string} url
     * @param {AxiosRequestConfig} options
     *
     * @returns {Promise<AxiosResponse>}
     */
    options<T = any, D = any>(url: string, options?: Partial<AxiosRequestConfig>): Promise<AxiosResponse<T, D>>;
    isCancel(cancel: any): cancel is import('axios').CanceledError<any>;
    /**
     * Send request.
     */
    request<T = any, D = any>(options: AxiosRequestConfig): Promise<AxiosResponse<T, D>>;
    errorClass(): Promise<typeof AxiosError>;
}
