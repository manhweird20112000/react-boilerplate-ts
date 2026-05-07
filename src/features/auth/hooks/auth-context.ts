import { createContext } from 'react'
import type { AuthUser } from '../types'
import type { LoginCredentials, RegisterRequest } from '../schemas/auth.schema'

export interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
