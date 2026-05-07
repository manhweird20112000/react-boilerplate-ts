import { describe, it, expect, beforeEach, vi } from 'vitest'
import { MockAuthRepository } from './mock-auth-repository'

describe('MockAuthRepository', () => {
  let repository: MockAuthRepository

  beforeEach(() => {
    vi.useFakeTimers()
    repository = new MockAuthRepository()
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should login with correct credentials', async () => {
    const promise = repository.login({
      email: 'admin@example.com',
      password: 'password',
    })
    vi.runAllTimers()
    const response = await promise

    expect(response.data.success).toBe(true)
    expect(response.data.data?.user.email).toBe('admin@example.com')
    expect(localStorage.getItem('mock_auth_token')).toBe('mock_token')
  })

  it('should throw error with incorrect credentials', async () => {
    const promise = repository.login({
      email: 'wrong@example.com',
      password: 'wrong',
    })
    vi.runAllTimers()
    await expect(promise).rejects.toThrow('Invalid credentials')
  })

  it('should register successfully', async () => {
    const promise = repository.register({
      email: 'new@example.com',
      name: 'New User',
      password: 'password',
      confirmPassword: 'password',
    })
    vi.runAllTimers()
    const response = await promise

    expect(response.data.success).toBe(true)
    expect(response.data.data?.user.email).toBe('new@example.com')
    expect(localStorage.getItem('mock_auth_token')).toBe('mock_token')
  })

  it('should get current user when token exists', async () => {
    localStorage.setItem('mock_auth_token', 'mock_token')
    const promise = repository.me()
    vi.runAllTimers()
    const response = await promise

    expect(response.data.success).toBe(true)
    expect(response.data.data?.user.id).toBe('1')
  })

  it('should throw error on me() when no token exists', async () => {
    const promise = repository.me()
    vi.runAllTimers()
    await expect(promise).rejects.toThrow('Unauthorized')
  })

  it('should logout and remove token', async () => {
    localStorage.setItem('mock_auth_token', 'mock_token')
    const promise = repository.logout()
    vi.runAllTimers()
    await promise
    expect(localStorage.getItem('mock_auth_token')).toBeNull()
  })
})
