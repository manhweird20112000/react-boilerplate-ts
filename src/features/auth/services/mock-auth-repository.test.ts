import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { ADMIN_AUTH_COOKIES } from '../constants/admin-auth.paths'
import { MockAuthRepository } from './mock-auth-repository'

describe('MockAuthRepository (Powered by MSW)', () => {
  let repository: MockAuthRepository

  beforeEach(() => {
    repository = new MockAuthRepository()
  })

  afterEach(() => {
    document.cookie = `${ADMIN_AUTH_COOKIES.session}=; Path=/; Max-Age=0`
  })

  it('should return Google login URL', async () => {
    const response = await repository.getGoogleLoginUrl()

    expect(response.data.data?.url).toContain('accounts.google.com')
  })

  it('should reject me when session cookie is missing', async () => {
    await expect(repository.me()).rejects.toMatchObject({
      response: { status: 401 }
    })
  })

  it('should get current admin info when session cookie exists', async () => {
    document.cookie = `${ADMIN_AUTH_COOKIES.session}=mock-token; Path=/`

    const response = await repository.me()

    expect(response.data.data?.user.email).toBe('admin@example.com')
  })

  it('should logout successfully', async () => {
    await expect(repository.logout()).resolves.toBeUndefined()
  })
})
