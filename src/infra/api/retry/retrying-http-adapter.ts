import type { AxiosRequestConfig, AxiosResponse } from 'axios'

import type { IHttpAdapter } from '../http-adapter'
import type { RefreshTokenHandler } from '../module'
import type { RetryDecision, RetryOptions } from './retry.types'
import type { RetryPolicy } from './retry-policy'
import { sleep } from './sleep'

type RequestOptions = {
  readonly retry?: RetryOptions
}

/**
 * HTTP adapter decorator adding retry behavior.
 */
export class RetryingHttpAdapter<TClient = unknown> implements IHttpAdapter<TClient> {
  public readonly client: TClient
  private readonly inner: IHttpAdapter<TClient>
  private readonly retryPolicy: RetryPolicy

  public constructor(inner: IHttpAdapter<TClient>, retryPolicy: RetryPolicy) {
    this.inner = inner
    this.retryPolicy = retryPolicy
    this.client = inner.client
  }

  public setHeaders(headers: AxiosRequestConfig['headers']): void {
    this.inner.setHeaders(headers)
  }

  public setRefreshTokenHandler(handler: RefreshTokenHandler): void {
    this.inner.setRefreshTokenHandler(handler)
  }

  public get<TParams = unknown, TResponse = AxiosResponse>(
    url: string,
    params?: TParams,
    options?: RequestOptions
  ): Promise<TResponse> {
    return this.executeWithRetry({
      execute: () => this.inner.get<TParams, TResponse>(url, params),
      retry: options?.retry
    })
  }

  public delete<TData = unknown, TResponse = AxiosResponse>(
    url: string,
    data?: TData,
    options?: RequestOptions
  ): Promise<TResponse> {
    return this.executeWithRetry({
      execute: () => this.inner.delete<TData, TResponse>(url, data),
      retry: options?.retry
    })
  }

  public patch<TData = unknown, TResponse = AxiosResponse>(
    url: string,
    data?: TData,
    options?: RequestOptions
  ): Promise<TResponse> {
    return this.executeWithRetry({
      execute: () => this.inner.patch<TData, TResponse>(url, data),
      retry: options?.retry
    })
  }

  public post<TData = unknown, TResponse = AxiosResponse>(
    url: string,
    data?: TData,
    axiosOptions?: AxiosRequestConfig,
    options?: RequestOptions
  ): Promise<TResponse> {
    return this.executeWithRetry({
      execute: () => this.inner.post<TData, TResponse>(url, data, axiosOptions),
      retry: options?.retry
    })
  }

  public put<TData = unknown, TResponse = AxiosResponse>(
    url: string,
    data?: TData,
    options?: RequestOptions
  ): Promise<TResponse> {
    return this.executeWithRetry({
      execute: () => this.inner.put<TData, TResponse>(url, data),
      retry: options?.retry
    })
  }

  private async executeWithRetry<TResponse>(input: {
    readonly execute: () => Promise<TResponse>
    readonly retry: RetryOptions | undefined
  }): Promise<TResponse> {
    if (!input.retry) {
      return await input.execute()
    }
    for (let attempt: number = 1; ; attempt += 1) {
      try {
        return await input.execute()
      } catch (err: unknown) {
        const decision: RetryDecision = this.retryPolicy.decide({
          attempt,
          err,
          options: input.retry
        })
        if (!decision.shouldRetry) {
          throw err
        }
        await sleep(decision.delayMs)
      }
    }
  }
}
