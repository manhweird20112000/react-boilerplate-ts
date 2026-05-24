import { describe, it, expect } from 'vitest'
import { isAbsoluteRedirectUrl, resolveOAuthRedirectPath } from './oauth-redirect'

describe('resolveOAuthRedirectPath', () => {
  it('should return dashboard when location header is missing', () => {
    expect(resolveOAuthRedirectPath(undefined)).toBe('/dashboard')
  })

  it('should return same-origin path from absolute location header', () => {
    expect(resolveOAuthRedirectPath(`${window.location.origin}/orders?tab=1`)).toBe('/orders?tab=1')
  })

  it('should return relative path as-is', () => {
    expect(resolveOAuthRedirectPath('/dashboard')).toBe('/dashboard')
  })

  it('should return external url when location points to another origin', () => {
    expect(resolveOAuthRedirectPath('https://other.example.com/welcome')).toBe(
      'https://other.example.com/welcome'
    )
  })
})

describe('isAbsoluteRedirectUrl', () => {
  it('should detect absolute http urls', () => {
    expect(isAbsoluteRedirectUrl('http://localhost:8080/dashboard')).toBe(true)
  })

  it('should treat app paths as relative', () => {
    expect(isAbsoluteRedirectUrl('/dashboard')).toBe(false)
  })
})
