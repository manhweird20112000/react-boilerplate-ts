import type { AxiosResponse } from 'axios'
import type { Future } from '@/shared/types/common'
import { HttpService } from '@/infra/api/http-service'
import type { AuthResponse } from '../types'
import type { AdminMeApiResponse, ApiEnvelope, GoogleCallbackApiResponse, GoogleCallbackParams } from '../types/api.types'
import { ADMIN_AUTH_PATHS } from '../constants/admin-auth.paths'
import { AuthRepository } from './repository'
import {
  toAuthResponseEnvelope,
  toGoogleCallbackRedirectPath,
  toGoogleLoginUrlEnvelope
} from './api-auth.mapper'

export class HttpAuthRepository extends AuthRepository {
  public getGoogleLoginUrl(): Future<{ url: string }> {
    // Starts Google SSO. The API is responsible for creating/verifying the
    // OAuth state cookie; the frontend only redirects to the returned URL.
    return HttpService.get<unknown, AxiosResponse<ApiEnvelope<{ url: string }>>>(
      ADMIN_AUTH_PATHS.googleUrl
    ).then(toGoogleLoginUrlEnvelope)
  }

  public completeGoogleLogin(params: { code: string; state: string }): Promise<string> {
    // Exchanges the provider callback params for the admin session cookie and a
    // post-login redirect path.
    return HttpService.get<
      GoogleCallbackParams,
      AxiosResponse<ApiEnvelope<GoogleCallbackApiResponse>>
    >(ADMIN_AUTH_PATHS.googleCallback, params).then(toGoogleCallbackRedirectPath)
  }

  public logout(): Promise<void> {
    // Successful logout returns 204 and clears the session cookie server-side.
    return HttpService.post(ADMIN_AUTH_PATHS.logout, {}, {
      validateStatus: (status) => status === 204
    }).then(() => undefined)
  }

  public me(): Future<AuthResponse> {
    // Session source of truth. A 401 means no valid cookie/session exists.
    return HttpService.get<unknown, AxiosResponse<ApiEnvelope<AdminMeApiResponse>>>(
      ADMIN_AUTH_PATHS.me
    ).then(toAuthResponseEnvelope)
  }
}
