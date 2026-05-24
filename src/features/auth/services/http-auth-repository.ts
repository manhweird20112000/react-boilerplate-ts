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
    return HttpService.get<unknown, AxiosResponse<ApiEnvelope<{ url: string }>>>(
      ADMIN_AUTH_PATHS.googleUrl
    ).then(toGoogleLoginUrlEnvelope)
  }

  public completeGoogleLogin(params: { code: string; state: string }): Promise<string> {
    return HttpService.get<
      GoogleCallbackParams,
      AxiosResponse<ApiEnvelope<GoogleCallbackApiResponse>>
    >(ADMIN_AUTH_PATHS.googleCallback, params).then(toGoogleCallbackRedirectPath)
  }

  public logout(): Promise<void> {
    return HttpService.post(ADMIN_AUTH_PATHS.logout, {}, {
      validateStatus: (status) => status === 204
    }).then(() => undefined)
  }

  public me(): Future<AuthResponse> {
    return HttpService.get<unknown, AxiosResponse<ApiEnvelope<AdminMeApiResponse>>>(
      ADMIN_AUTH_PATHS.me
    ).then(toAuthResponseEnvelope)
  }
}
