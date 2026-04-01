import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

import HttpModule from "./module";

/**
 * Interface for HTTP adapter with common HTTP methods
 */
abstract class IHttpAdapter<T = unknown> {
  abstract readonly client: T;

  abstract setHeaders(headers: AxiosRequestConfig["headers"]): void;

  abstract get<TParams = unknown, TResponse = AxiosResponse>(
    url: string,
    params?: TParams
  ): Promise<TResponse>;

  abstract post<TData = unknown, TResponse = AxiosResponse>(
    url: string,
    data?: TData,
    options?: AxiosRequestConfig
  ): Promise<TResponse>;

  abstract put<TData = unknown, TResponse = AxiosResponse>(
    url: string,
    data?: TData
  ): Promise<TResponse>;

  abstract patch<TData = unknown, TResponse = AxiosResponse>(
    url: string,
    data?: TData
  ): Promise<TResponse>;

  abstract delete<TResponse = AxiosResponse>(url: string): Promise<TResponse>;
}

class HttpAxiosService implements IHttpAdapter<AxiosInstance> {
  readonly client: AxiosInstance;

  constructor(baseUrl = import.meta.env["VITE_API_URL"] || "") {
    this.client = new HttpModule(baseUrl).getInstance();
  }

  setHeaders(headers: AxiosRequestConfig["headers"]): void {
    if (headers) {
      Object.assign(this.client.defaults.headers, headers);
    }
  }

  get<TParams = unknown, TResponse = AxiosResponse>(
    url: string,
    params?: TParams
  ): Promise<TResponse> {
    return this.client.get(url, { params });
  }

  delete<TResponse = AxiosResponse>(url: string): Promise<TResponse> {
    return this.client.delete(url);
  }

  patch<TData = unknown, TResponse = AxiosResponse>(
    url: string,
    data?: TData
  ): Promise<TResponse> {
    return this.client.patch(url, data);
  }

  post<TData = unknown, TResponse = AxiosResponse>(
    url: string,
    data?: TData,
    options?: AxiosRequestConfig
  ): Promise<TResponse> {
    return this.client.post(url, data, options);
  }

  put<TData = unknown, TResponse = AxiosResponse>(
    url: string,
    data?: TData
  ): Promise<TResponse> {
    return this.client.put(url, data);
  }
}

export const HttpService = new HttpAxiosService();
