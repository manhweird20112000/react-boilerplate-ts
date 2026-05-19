import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import type { RefreshTokenHandler } from './module'

/**
 * Contract for an HTTP adapter with common methods.
 * This enables composition (e.g. retry decorators) without binding callers to Axios directly.
 */
export abstract class IHttpAdapter<TClient = unknown> {
  public abstract readonly client: TClient

  public abstract setHeaders(headers: AxiosRequestConfig['headers']): void
  public abstract setRefreshTokenHandler(handler: RefreshTokenHandler | null): void

  public abstract get<TParams = unknown, TResponse = AxiosResponse>(
    url: string,
    params?: TParams
  ): Promise<TResponse>

  public abstract post<TData = unknown, TResponse = AxiosResponse>(
    url: string,
    data?: TData,
    options?: AxiosRequestConfig
  ): Promise<TResponse>

  public abstract put<TData = unknown, TResponse = AxiosResponse>(
    url: string,
    data?: TData
  ): Promise<TResponse>

  public abstract patch<TData = unknown, TResponse = AxiosResponse>(
    url: string,
    data?: TData
  ): Promise<TResponse>

  public abstract delete<TData = unknown, TResponse = AxiosResponse>(
    url: string,
    data?: TData
  ): Promise<TResponse>
}
