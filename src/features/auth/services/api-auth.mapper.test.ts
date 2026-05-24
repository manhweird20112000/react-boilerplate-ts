import { describe, it, expect } from 'vitest'
import type { AxiosResponse } from 'axios'
import type { ApiEnvelope, GoogleCallbackApiResponse } from '../types/api.types'
import { toGoogleCallbackRedirectPath } from './api-auth.mapper'

function createCallbackResponse(
  data: GoogleCallbackApiResponse | undefined
): AxiosResponse<ApiEnvelope<GoogleCallbackApiResponse>> {
  return {
    data: { data },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as AxiosResponse['config']
  }
}

describe('toGoogleCallbackRedirectPath', () => {
  it('should return external redirect url when target origin differs', () => {
    const actualPath = toGoogleCallbackRedirectPath(
      createCallbackResponse({
        verified: true,
        redirect_url: 'https://example.com/admin?role=super_admin'
      })
    )

    expect(actualPath).toBe('https://example.com/admin?role=super_admin')
  })

  it('should return same-origin path when redirect url matches current origin', () => {
    const actualPath = toGoogleCallbackRedirectPath(
      createCallbackResponse({
        verified: true,
        redirect_url: `${window.location.origin}/dashboard`
      })
    )

    expect(actualPath).toBe('/dashboard')
  })

  it('should throw when verification fails', () => {
    expect(() =>
      toGoogleCallbackRedirectPath(
        createCallbackResponse({
          verified: false,
          redirect_url: '/dashboard'
        })
      )
    ).toThrow('Google OAuth verification failed')
  })
})
