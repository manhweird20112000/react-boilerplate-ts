import type { Future } from '@/shared/types/common'
import type { AuthResponse } from '../types'

export abstract class AuthRepository {
  abstract getGoogleLoginUrl(): Future<{ url: string }>
  abstract completeGoogleLogin(params: { code: string; state: string }): Promise<string>
  abstract logout(): Promise<void>
  abstract me(): Future<AuthResponse>
}
