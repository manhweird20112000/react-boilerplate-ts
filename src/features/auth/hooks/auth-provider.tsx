import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { App } from 'antd'
import type { AuthUser } from '../types'
import type { LoginCredentials, RegisterRequest } from '../schemas/auth.schema'
import { AuthContext } from './auth-context'

async function loadAuthRepo() {
  const { authRepo } = await import('../services/factory')

  return authRepo
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isMountedRef = useRef(false)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { message } = App.useApp()

  useEffect(() => {
    isMountedRef.current = true

    return () => {
      isMountedRef.current = false
    }
  }, [])

  const refresh = useCallback(async () => {
    try {
      const authRepo = await loadAuthRepo()
      const { data: res } = await authRepo.refresh()
      if (isMountedRef.current) {
        setUser(res.data.user)
      }
    } catch (error) {
      if (isMountedRef.current) {
        setUser(null)
      }
      throw error
    }
  }, [])

  useEffect(() => {
    let isActive = true

    void import('@/infra/api/http-service')
      .then(({ HttpService }) => {
        if (isActive) {
          HttpService.setRefreshTokenHandler(refresh)
        }
      })
      .catch((error: unknown) => {
        console.error('Failed to load HTTP service', error)
      })

    return () => {
      isActive = false
      void import('@/infra/api/http-service')
        .then(({ HttpService }) => {
          HttpService.setRefreshTokenHandler(null)
        })
        .catch((error: unknown) => {
          console.error('Failed to clear HTTP refresh handler', error)
        })
    }
  }, [refresh])

  const checkMe = useCallback(async () => {
    try {
      const authRepo = await loadAuthRepo()
      const { data: res } = await authRepo.me()
      if (isMountedRef.current) {
        setUser(res.data.user)
      }
    } catch {
      if (isMountedRef.current) {
        setUser(null)
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    void checkMe()
  }, [checkMe])

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        const authRepo = await loadAuthRepo()
        const { data: res } = await authRepo.login(credentials)
        if (isMountedRef.current) {
          setUser(res.data.user)
        }
        if (res.message) message.success(res.message)
      } catch (error: any) {
        if (error.response?.data?.message) {
          message.error(error.response.data.message)
        } else {
          message.error('Login failed')
        }
        throw error
      }
    },
    [message]
  )

  const register = useCallback(
    async (data: RegisterRequest) => {
      try {
        const authRepo = await loadAuthRepo()
        const { data: res } = await authRepo.register(data)
        if (isMountedRef.current) {
          setUser(res.data.user)
        }
        if (res.message) message.success(res.message)
      } catch (error: any) {
        if (error.response?.data?.message) {
          message.error(error.response.data.message)
        } else {
          message.error('Registration failed')
        }
        throw error
      }
    },
    [message]
  )

  const logout = useCallback(async () => {
    try {
      const authRepo = await loadAuthRepo()
      await authRepo.logout()
      if (isMountedRef.current) {
        setUser(null)
      }
    } catch (error) {
      console.error('Logout error', error)
      if (isMountedRef.current) {
        setUser(null)
      }
    }
  }, [])

  const contextValue = useMemo(
    () => ({ user, isLoading, login, register, logout, refresh }),
    [user, isLoading, login, register, logout, refresh]
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
