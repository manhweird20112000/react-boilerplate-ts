import type { AxiosResponse } from 'axios'
import type { Future, ResponseData } from '@/shared/types/common'
import type { AuthResponse } from '../types'
import type { ForgotPasswordRequest, LoginCredentials, RegisterRequest } from '../schemas/auth.schema'
import { AuthRepository } from './repository'

const MOCK_USER = {
  id: '1',
  email: 'admin@example.com',
  name: 'Admin User',
  role: 'admin',
  permissions: ['*'],
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const wrapResponse = <T>(data: T, message = 'Success'): AxiosResponse<ResponseData<T>> => ({
  data: {
    success: true,
    message,
    data,
  },
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {} as any,
})

export class MockAuthRepository extends AuthRepository {
  public async login(credentials: LoginCredentials): Future<AuthResponse> {
    await sleep(1000)
    if (credentials.email === MOCK_USER.email && credentials.password === 'password') {
      localStorage.setItem('mock_auth_token', 'mock_token')
      return wrapResponse({ user: MOCK_USER })
    }
    throw new Error('Invalid credentials')
  }

  public async register(data: RegisterRequest): Future<AuthResponse> {
    await sleep(1000)
    localStorage.setItem('mock_auth_token', 'mock_token')
    return wrapResponse({ user: { ...MOCK_USER, email: data.email, name: data.name } })
  }

  public async forgotPassword(data: ForgotPasswordRequest): Future<void> {
    console.log('Mock forgot password for:', data.email)
    await sleep(1000)
    return wrapResponse(undefined, 'Recovery email sent')
  }

  public async logout(): Future<void> {
    await sleep(500)
    localStorage.removeItem('mock_auth_token')
    return wrapResponse(undefined)
  }

  public async me(): Future<AuthResponse> {
    await sleep(500)
    const token = localStorage.getItem('mock_auth_token')
    if (token) {
      return wrapResponse({ user: MOCK_USER })
    }
    throw new Error('Unauthorized')
  }

  public async refresh(): Future<AuthResponse> {
    await sleep(500)
    return wrapResponse({ user: MOCK_USER })
  }
}
