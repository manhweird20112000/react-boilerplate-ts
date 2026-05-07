import { describe, it, expect, beforeEach } from 'vitest'
import { MockAuthRepository } from './mock-auth-repository'

describe('MockAuthRepository (Powered by MSW)', () => {
  let repository: MockAuthRepository

  beforeEach(() => {
    repository = new MockAuthRepository()
  })

  it('should login with correct credentials', async () => {
    const response = await repository.login({
      email: 'admin@example.com',
      password: 'password',
    })

    expect(response.data.success).toBe(true)
    expect(response.data.data?.user.email).toBe('admin@example.com')
  })

  it('should return error with incorrect credentials', async () => {
    try {
      await repository.login({
        email: 'wrong@example.com',
        password: 'wrong',
      })
    } catch (error: any) {
      expect(error.response.status).toBe(401)
      expect(error.response.data.success).toBe(false)
    }
  })

  it('should register successfully', async () => {
    const response = await repository.register({
      email: 'new@example.com',
      name: 'New User',
      password: 'password',
      password_confirmation: 'password',
    })

    expect(response.data.success).toBe(true)
    expect(response.data.data?.user.email).toBe('new@example.com')
  })

  it('should get current user info', async () => {
    const response = await repository.me()
    expect(response.data.success).toBe(true)
    expect(response.data.data?.user).toBeDefined()
  })

  it('should logout successfully', async () => {
    const response = await repository.logout()
    expect(response.data.success).toBe(true)
  })
})
