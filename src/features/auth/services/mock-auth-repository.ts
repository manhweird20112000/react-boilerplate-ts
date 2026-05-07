import type { Future } from '@/shared/types/common'
import { HttpService } from '@/infra/api/http-service'
import type { AuthResponse } from '../types'
import type { ForgotPasswordRequest, LoginCredentials, RegisterRequest } from '../schemas/auth.schema'
import { AuthRepository } from './repository'

/**
 * MockAuthRepository now delegates calls to HttpService.
 * This allows MSW to intercept the requests and provide mock data globally.
 * 
 * @deprecated Use HttpAuthRepository instead, as MSW will intercept its calls anyway.
 */
export class MockAuthRepository extends AuthRepository {
  public async login(credentials: LoginCredentials): Future<AuthResponse> {
    return HttpService.post('/auth/login', credentials)
  }

  public async register(data: RegisterRequest): Future<AuthResponse> {
    return HttpService.post('/auth/register', data)
  }

  public async forgotPassword(data: ForgotPasswordRequest): Future<void> {
    return HttpService.post('/auth/forgot-password', data)
  }

  public async logout(): Future<void> {
    return HttpService.post('/auth/logout', {})
  }

  public async me(): Future<AuthResponse> {
    return HttpService.get('/auth/me')
  }

  public async refresh(): Future<AuthResponse> {
    return HttpService.post('/auth/token-refresh', {})
  }
}
