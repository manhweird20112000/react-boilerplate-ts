import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios'

const AUTH_NO_REFRESH_PATHS = [
  '/auth/token-refresh',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password'
] as const

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

function isAuthNoRefreshUrl(url: string | undefined): boolean {
  if (!url) {
    return false
  }
  return AUTH_NO_REFRESH_PATHS.some((path) => url.includes(path))
}

export type RefreshTokenHandler = () => Promise<void>

class HttpModule {
  private readonly instance: AxiosInstance
  private refreshTokenHandler: RefreshTokenHandler | null = null
  private refreshPromise: Promise<void> | null = null

  constructor(baseURL: string, timeout: number = 50000) {
    this.instance = axios.create({
      baseURL,
      timeout,
      withCredentials: true
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

        if (
          error.response?.status === 401 &&
          this.refreshTokenHandler &&
          !originalRequest._retry &&
          !isAuthNoRefreshUrl(originalRequest.url)
        ) {
          originalRequest._retry = true
          try {
            await this.executeRefresh()
            deleteAuthorizationHeader(originalRequest)
            return this.instance(originalRequest)
          } catch (refreshError) {
            return Promise.reject(refreshError)
          }
        }

        return Promise.reject(error)
      }
    )
  }

  public setRefreshTokenHandler(handler: RefreshTokenHandler | null): void {
    this.refreshTokenHandler = handler
  }

  private executeRefresh(): Promise<void> {
    if (this.refreshPromise) {
      return this.refreshPromise
    }
    const handler: RefreshTokenHandler | null = this.refreshTokenHandler
    if (!handler) {
      return Promise.reject(new Error('Refresh token handler is not configured'))
    }
    this.refreshPromise = handler().finally(() => {
      this.refreshPromise = null
    })
    return this.refreshPromise
  }

  getInstance(): AxiosInstance {
    return this.instance
  }
}

export default HttpModule
