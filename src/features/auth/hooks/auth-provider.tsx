import React, { useEffect, useState, useCallback } from 'react'
import { App } from 'antd'
import { authRepo } from '../services/factory'
import type { AuthUser } from '../types'
import type { LoginCredentials, RegisterRequest } from '../schemas/auth.schema'
import { HttpService } from '@/infra/api/http-service'
import { AuthContext } from './auth-context'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { message } = App.useApp()

  const refresh = useCallback(async () => {
    try {
      const { data: res } = await authRepo.refresh()
      setUser(res.data.user)
    } catch (error) {
      setUser(null)
      throw error
    }
  }, [])

  useEffect(() => {
    HttpService.setRefreshTokenHandler(refresh)
  }, [refresh])

  const checkMe = async () => {
    try {
      const { data: res } = await authRepo.me()
      setUser(res.data.user)
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkMe()
  }, [])

  const login = async (credentials: LoginCredentials) => {
    try {
      const { data: res } = await authRepo.login(credentials)
      setUser(res.data.user)
      if (res.message) message.success(res.message)
    } catch (error: any) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message)
      } else {
        message.error('Login failed')
      }
      throw error
    }
  }

  const register = async (data: RegisterRequest) => {
    try {
      const { data: res } = await authRepo.register(data)
      setUser(res.data.user)
      if (res.message) message.success(res.message)
    } catch (error: any) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message)
      } else {
        message.error('Registration failed')
      }
      throw error
    }
  }

  const logout = async () => {
    try {
      await authRepo.logout()
      setUser(null)
    } catch (error) {
      console.error('Logout error', error)
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}
