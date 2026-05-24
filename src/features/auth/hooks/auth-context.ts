import { createContext } from 'react'
import type { AuthUser } from '../types'

export interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  loginWithGoogle: () => Promise<void>
  completeGoogleLogin: (params: { code: string; state: string }) => Promise<string>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
