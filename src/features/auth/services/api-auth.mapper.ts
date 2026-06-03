import type { AuthResponse, AuthUser } from '../types'
import type { AdminMeApiResponse, ApiEnvelope, GoogleCallbackApiResponse } from '../types/api.types'
import type { AxiosResponse } from 'axios'
import type { ResponseData } from '@/shared/types/common'
import { resolveOAuthRedirectPath } from '../utils/oauth-redirect'

export function mapAdminToAuthUser(admin: AdminMeApiResponse): AuthUser {
  return {
    id: admin.id,
    email: admin.email,
    name: admin.name ?? '',
    avatar: admin.avatar_url,
    role: admin.role,
    permissions: []
  }
}

export function toAuthResponseEnvelope(
  response: AxiosResponse<ApiEnvelope<AdminMeApiResponse>>
): AxiosResponse<ResponseData<AuthResponse>> {
  const admin = response.data.data
  if (!admin) {
    throw new Error('Missing admin profile in response')
  }
  return {
    ...response,
    data: {
      success: true,
      message: '',
      data: {
        // Keep the rest of the auth layer independent from admin API shape.
        user: mapAdminToAuthUser(admin)
      }
    }
  }
}

export function toGoogleLoginUrlEnvelope(
  response: AxiosResponse<ApiEnvelope<{ url: string }>>
): AxiosResponse<ResponseData<{ url: string }>> {
  const url = response.data.data?.url
  if (!url) {
    throw new Error('Missing Google login URL in response')
  }
  return {
    ...response,
    data: {
      success: true,
      message: '',
      data: { url }
    }
  }
}

export function toGoogleCallbackRedirectPath(
  response: AxiosResponse<ApiEnvelope<GoogleCallbackApiResponse>>
): string {
  const payload = response.data.data
  if (!payload?.verified) {
    throw new Error('Google OAuth verification failed')
  }
  if (!payload.redirect_url) {
    throw new Error('Missing redirect URL in OAuth callback response')
  }
  return resolveOAuthRedirectPath(payload.redirect_url)
}
