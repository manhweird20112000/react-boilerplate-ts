import type { Future } from '@/shared/types/common'
import { HttpService } from '@/infra/api/http-service'
import type { AuthResponse } from '../types'
import type { ForgotPasswordRequest, LoginCredentials, RegisterRequest } from '../schemas/auth.schema'
import { AuthRepository } from './repository'

export class HttpAuthRepository extends AuthRepository {
  public login(credentials: LoginCredentials): Future<AuthResponse> {
    return HttpService.post('/auth/login', credentials)
  }

  public register(data: RegisterRequest): Future<AuthResponse> {
    return HttpService.post('/auth/register', data)
  }

  public forgotPassword(data: ForgotPasswordRequest): Future<void> {
    return HttpService.post('/auth/forgot-password', data)
  }

  public logout(): Future<void> {
    return HttpService.post('/auth/logout', {})
  }

  public me(): Future<AuthResponse> {
    return HttpService.get('/auth/me')
  }

  public refresh(): Future<AuthResponse> {
    return HttpService.post('/auth/token-refresh', {})
  }
}
