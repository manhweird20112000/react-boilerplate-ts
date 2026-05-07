import { describe, it, expect, vi, beforeEach } from 'vitest'
import { RetryingHttpAdapter } from './retrying-http-adapter'
import type { IHttpAdapter } from '../http-adapter'
import type { RetryPolicy } from './retry-policy'

describe('RetryingHttpAdapter', () => {
  let innerAdapter: IHttpAdapter<any>
  let retryPolicy: RetryPolicy
  let adapter: RetryingHttpAdapter<any>

  beforeEach(() => {
    innerAdapter = {
      client: {},
      setHeaders: vi.fn(),
      setRefreshTokenHandler: vi.fn(),
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn()
    }
    retryPolicy = {
      decide: vi.fn()
    }
    adapter = new RetryingHttpAdapter(innerAdapter, retryPolicy)
    
    // Mock sleep to avoid waiting in tests
    vi.mock('./sleep', () => ({
      sleep: vi.fn().mockResolvedValue(undefined)
    }))
  })

  it('should call inner adapter and return result on success', async () => {
    const expectedResponse = { data: 'success' }
    vi.mocked(innerAdapter.get).mockResolvedValue(expectedResponse)

    const result = await adapter.get('/test')

    expect(innerAdapter.get).toHaveBeenCalledWith('/test', undefined)
    expect(result).toBe(expectedResponse)
  })

  it('should not retry if retry options are not provided', async () => {
    const error = new Error('Network error')
    vi.mocked(innerAdapter.get).mockRejectedValue(error)

    await expect(adapter.get('/test')).rejects.toThrow(error)
    expect(innerAdapter.get).toHaveBeenCalledTimes(1)
    expect(retryPolicy.decide).not.toHaveBeenCalled()
  })

  it('should retry if policy allows it', async () => {
    const error = new Error('Network error')
    const expectedResponse = { data: 'success' }
    
    vi.mocked(innerAdapter.get)
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce(expectedResponse)

    vi.mocked(retryPolicy.decide).mockReturnValue({ shouldRetry: true, delayMs: 10 })

    const result = await adapter.get('/test', undefined, { retry: { maxAttempts: 2 } })

    expect(innerAdapter.get).toHaveBeenCalledTimes(2)
    expect(retryPolicy.decide).toHaveBeenCalledWith({
      attempt: 1,
      err: error,
      options: { maxAttempts: 2 }
    })
    expect(result).toBe(expectedResponse)
  })

  it('should throw error if policy denies retry', async () => {
    const error = new Error('Network error')
    vi.mocked(innerAdapter.get).mockRejectedValue(error)
    vi.mocked(retryPolicy.decide).mockReturnValue({ shouldRetry: false, delayMs: 0 })

    await expect(adapter.get('/test', undefined, { retry: { maxAttempts: 2 } })).rejects.toThrow(error)
    
    expect(innerAdapter.get).toHaveBeenCalledTimes(1)
    expect(retryPolicy.decide).toHaveBeenCalled()
  })

  it('should propagate headers and refresh handler calls', () => {
    const headers = { Authorization: 'Bearer token' }
    adapter.setHeaders(headers)
    expect(innerAdapter.setHeaders).toHaveBeenCalledWith(headers)

    const handler = () => Promise.resolve()
    adapter.setRefreshTokenHandler(handler)
    expect(innerAdapter.setRefreshTokenHandler).toHaveBeenCalledWith(handler)
  })
})
