import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

import HttpModule from "~/infra/api/module";

/**
 * Interface for HTTP adapter with common HTTP methods
 */
export abstract class IHttpAdapter<T = unknown> {
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

/**
 * Axios implementation of the HTTP adapter interface
 */
class HttpAxiosService implements IHttpAdapter<AxiosInstance> {
  readonly client: AxiosInstance;

  constructor(baseUrl = import.meta.env["VITE_API_URL"] || "") {
    this.client = new HttpModule(baseUrl).getInstance();
  }

  setHeaders(headers: AxiosRequestConfig["headers"]): void {
    this.client.defaults.headers = headers as any;
  }

  /**
   * Makes a GET request
   * @param url - Endpoint URL
   * @param params - Query parameters
   * @returns Promise with the response
   */
  get<TParams = unknown, TResponse = AxiosResponse>(
    url: string,
    params?: TParams
  ): Promise<TResponse> {
    return this.client.get(url, { params });
  }

  /**
   * Makes a DELETE request
   * @param url - Endpoint URL
   * @returns Promise with the response
   */
  delete<TResponse = AxiosResponse>(url: string): Promise<TResponse> {
    return this.client.delete(url);
  }

  /**
   * Makes a PATCH request
   * @param url - Endpoint URL
   * @param data - Request payload
   * @returns Promise with the response
   */
  patch<TData = unknown, TResponse = AxiosResponse>(
    url: string,
    data?: TData
  ): Promise<TResponse> {
    return this.client.patch(url, data);
  }

  /**
   * Makes a POST request
   * @param url - Endpoint URL
   * @param data - Request payload
   * @returns Promise with the response
   */
  post<TData = unknown, TResponse = AxiosResponse>(
    url: string,
    data?: TData,
    options?: AxiosRequestConfig
  ): Promise<TResponse> {
    return this.client.post(url, data, options);
  }

  /**
   * Makes a PUT request
   * @param url - Endpoint URL
   * @param data - Request payload
   * @returns Promise with the response
   */
  put<TData = unknown, TResponse = AxiosResponse>(
    url: string,
    data?: TData
  ): Promise<TResponse> {
    return this.client.put(url, data);
  }
}

export const HttpService = new HttpAxiosService();
