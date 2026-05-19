import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios'

function isFormData(value: unknown): value is FormData {
  return typeof FormData !== 'undefined' && value instanceof FormData
}

function setContentTypeHeader(config: InternalAxiosRequestConfig, value: string): void {
  if (typeof config.headers?.set === 'function') {
    config.headers.set('Content-Type', value)
    return
  }
  ;(config.headers as Record<string, unknown>)['Content-Type'] = value
}

function deleteContentTypeHeader(config: InternalAxiosRequestConfig): void {
  if (typeof config.headers?.delete === 'function') {
    config.headers.delete('Content-Type')
    return
  }
  delete (config.headers as Record<string, unknown>)['Content-Type']
}

function deleteAuthorizationHeader(config: InternalAxiosRequestConfig): void {
  if (typeof config.headers?.delete === 'function') {
    config.headers.delete('Authorization')
    return
  }
  delete (config.headers as Record<string, unknown>)['Authorization']
}

export type RefreshTokenHandler = () => Promise<void>

class HttpModule {
  private readonly instance: AxiosInstance
  private refreshTokenHandler: RefreshTokenHandler | null = null
  private isRefreshing = false
  private failedQueue: Array<{
    resolve: () => void
    reject: (error: unknown) => void
    config: InternalAxiosRequestConfig & { _retry?: boolean }
  }> = []

  constructor(baseURL: string, timeout: number = 50000) {
    this.instance = axios.create({
      baseURL,
      timeout
    })

    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        if (!isFormData(config.data)) {
          setContentTypeHeader(config, 'application/json')
        } else {
          deleteContentTypeHeader(config)
        }
        return config
      },
      (error: AxiosError) => Promise.reject(error)
    )

    this.instance.interceptors.response.use(
      (response: AxiosResponse): AxiosResponse => {
        return response
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

        // If error is 401 and we have a refresh handler and we haven't retried yet
        if (
          error.response?.status === 401 &&
          this.refreshTokenHandler &&
          !originalRequest._retry &&
          !originalRequest.url?.includes('/auth/token-refresh') // Don't refresh on refresh endpoint failure
        ) {
          if (this.isRefreshing) {
            originalRequest._retry = true
            return new Promise<void>((resolve, reject) => {
              this.failedQueue.push({ resolve, reject, config: originalRequest })
            })
              .then(() => {
                deleteAuthorizationHeader(originalRequest)
                return this.instance(originalRequest)
              })
              .catch((err) => {
                return Promise.reject(err)
              })
          }

          originalRequest._retry = true
          this.isRefreshing = true

          try {
            await this.refreshTokenHandler()
            this.processQueue(null)
            deleteAuthorizationHeader(originalRequest)
            return this.instance(originalRequest)
          } catch (refreshError) {
            this.processQueue(refreshError as Error)
            return Promise.reject(refreshError)
          } finally {
            this.isRefreshing = false
          }
        }

        if (originalRequest?.method?.toLowerCase() === 'get') {
          const status = error.response?.status
          if (status === 403) {
            window.location.href = '/403'
          } else if (status === 404) {
            window.location.href = '/404'
          } else if (status && status >= 500) {
            window.location.href = '/500'
          }
        }

        return Promise.reject(error)
      }
    )
  }

  public setRefreshTokenHandler(handler: RefreshTokenHandler | null): void {
    this.refreshTokenHandler = handler
  }

  private processQueue(error: Error | null): void {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error)
      } else {
        deleteAuthorizationHeader(prom.config)
        prom.resolve()
      }
    })
    this.failedQueue = []
  }

  getInstance(): AxiosInstance {
    return this.instance
  }
}

export default HttpModule
