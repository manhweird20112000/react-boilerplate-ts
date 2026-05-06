import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

import HttpModule, { type RefreshTokenHandler } from './module'
import { IHttpAdapter } from './http-adapter'
import { NetworkRetryPolicy } from './retry/network-retry-policy'
import { RetryingHttpAdapter } from './retry/retrying-http-adapter'

const DEFAULT_API_URL = ''

function getApiBaseUrl(): string {
  return import.meta.env.VITE_API_URL ?? DEFAULT_API_URL
}

class AxiosHttpAdapter implements IHttpAdapter<AxiosInstance> {
  public readonly client: AxiosInstance
  private readonly module: HttpModule

  public constructor(baseUrl: string = getApiBaseUrl()) {
    this.module = new HttpModule(baseUrl)
    this.client = this.module.getInstance()
  }

  public setHeaders(headers: AxiosRequestConfig['headers']): void {
    if (!headers) {
      return
    }
    Object.assign(this.client.defaults.headers, headers)
  }

  public setRefreshTokenHandler(handler: RefreshTokenHandler): void {
    this.module.setRefreshTokenHandler(handler)
  }

  public get<TParams = unknown, TResponse = AxiosResponse>(
    url: string,
    params?: TParams
  ): Promise<TResponse> {
    return this.client.get(url, { params })
  }

  public delete<TData = unknown, TResponse = AxiosResponse>(
    url: string,
    data?: TData
  ): Promise<TResponse> {
    return this.client.delete(url, { data })
  }

  public patch<TData = unknown, TResponse = AxiosResponse>(
    url: string,
    data?: TData
  ): Promise<TResponse> {
    return this.client.patch(url, data)
  }

  public post<TData = unknown, TResponse = AxiosResponse>(
    url: string,
    data?: TData,
    options?: AxiosRequestConfig
  ): Promise<TResponse> {
    return this.client.post(url, data, options)
  }

  public put<TData = unknown, TResponse = AxiosResponse>(
    url: string,
    data?: TData
  ): Promise<TResponse> {
    return this.client.put(url, data)
  }
}

const httpAxiosService: AxiosHttpAdapter = new AxiosHttpAdapter()
const retryPolicy: NetworkRetryPolicy = new NetworkRetryPolicy()

export const HttpService = new RetryingHttpAdapter(httpAxiosService, retryPolicy)
