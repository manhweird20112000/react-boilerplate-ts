import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import HttpModule from './module'

vi.mock('axios', async () => {
  const actual = await vi.importActual('axios')
  const mockInstance = vi.fn().mockReturnValue({
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn() }
    },
    defaults: { headers: { common: {}, get: {}, post: {}, put: {}, patch: {}, delete: {} } },
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    request: vi.fn()
  }) as any
  
  // Also add methods to the function object because axios instance has them
  mockInstance.interceptors = {
    request: { use: vi.fn(), eject: vi.fn() },
    response: { use: vi.fn(), eject: vi.fn() }
  }
  mockInstance.defaults = { headers: { common: {}, get: {}, post: {}, put: {}, patch: {}, delete: {} } }
  mockInstance.get = vi.fn()
  mockInstance.post = vi.fn()
  mockInstance.put = vi.fn()
  mockInstance.patch = vi.fn()
  mockInstance.delete = vi.fn()
  mockInstance.request = vi.fn()

  return {
    default: {
      create: vi.fn().mockReturnValue(mockInstance)
    },
    isAxiosError: actual.isAxiosError
  }
})

describe('HttpModule', () => {
  let module: HttpModule
  let mockInstance: any

  beforeEach(() => {
    vi.clearAllMocks()
    module = new HttpModule('https://api.example.com')
    mockInstance = module.getInstance()
  })

  it('should initialize with baseURL and timeout', () => {
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://api.example.com',
      timeout: 50000,
      withCredentials: true
    })
  })

  it('should set Content-Type to application/json for non-FormData requests', () => {
    const requestInterceptor = vi.mocked(mockInstance.interceptors.request.use).mock.calls[0][0]
    const config = { headers: new Map(), data: { foo: 'bar' } } as any
    
    // Polyfill headers.set if missing in test env
    config.headers.set = vi.fn()
    
    requestInterceptor(config)
    expect(config.headers.set).toHaveBeenCalledWith('Content-Type', 'application/json')
  })

  it('should remove Content-Type for FormData requests', () => {
    const requestInterceptor = vi.mocked(mockInstance.interceptors.request.use).mock.calls[0][0]
    
    // Mock FormData if it doesn't exist in environment
    const MockFormData = class {}
    ;(globalThis as any).FormData = MockFormData as any
    
    const config = { headers: new Map(), data: new MockFormData() } as any
    config.headers.delete = vi.fn()
    
    requestInterceptor(config)
    expect(config.headers.delete).toHaveBeenCalledWith('Content-Type')
  })

  describe('Response Interceptor (Error handling)', () => {
    let responseErrorInterceptor: any

    beforeEach(() => {
      responseErrorInterceptor = vi.mocked(mockInstance.interceptors.response.use).mock.calls[0][1]
    })

    it('should attempt refresh token on 401 error', async () => {
      const refreshTokenHandler = vi.fn().mockResolvedValue(undefined)
      module.setRefreshTokenHandler(refreshTokenHandler)

      const originalRequest = { url: '/data', _retry: false, headers: new Map() } as any
      originalRequest.headers.delete = vi.fn()
      
      const error = {
        response: { status: 401 },
        config: originalRequest
      } as any

      // We need to mock the instance call itself since HttpModule calls this.instance(originalRequest)
      vi.mocked(mockInstance).mockResolvedValue({ data: 'refreshed' })

      const resultPromise = responseErrorInterceptor(error)
      
      await expect(resultPromise).resolves.toEqual({ data: 'refreshed' })
      expect(refreshTokenHandler).toHaveBeenCalled()
      expect(originalRequest._retry).toBe(true)
    })

    it('should not refresh token if status is not 401', async () => {
      const refreshTokenHandler = vi.fn()
      module.setRefreshTokenHandler(refreshTokenHandler)

      const error = {
        response: { status: 500 },
        config: { url: '/data' }
      } as any

      await expect(responseErrorInterceptor(error)).rejects.toEqual(error)
      expect(refreshTokenHandler).not.toHaveBeenCalled()
    })

    it('should redirect to error pages for GET requests', async () => {
      // Mock window.location
      const originalLocation = window.location
      const locationMock = { href: '' }
      vi.stubGlobal('location', locationMock)

      const testCases = [
        { status: 403, expected: '/403' },
        { status: 404, expected: '/404' },
        { status: 500, expected: '/500' }
      ]

      for (const { status, expected } of testCases) {
        const error = {
          response: { status },
          config: { method: 'get', url: '/data' }
        } as any

        await expect(responseErrorInterceptor(error)).rejects.toEqual(error)
        expect(window.location.href).toBe(expected)
      }

      vi.stubGlobal('location', originalLocation)
    })
  })
})
