import type { Future } from '@/shared/types/common'
import type { AuthResponse } from '../types'
import type { ForgotPasswordRequest, LoginCredentials, RegisterRequest } from '../schemas/auth.schema'

export abstract class AuthRepository {
  abstract login(credentials: LoginCredentials): Future<AuthResponse>
  abstract register(data: RegisterRequest): Future<AuthResponse>
  abstract forgotPassword(data: ForgotPasswordRequest): Future<void>
  abstract logout(): Future<void>
  abstract me(): Future<AuthResponse>
  abstract refresh(): Future<AuthResponse>
}
