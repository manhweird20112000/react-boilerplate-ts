import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { App } from 'antd'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import type { AuthUser } from '../types'
import { GOOGLE_CALLBACK_ROUTE } from '../constants/admin-auth.paths'
import { AuthContext } from './auth-context'
import { getApiErrorMessage } from '../utils/api-error'

async function loadAuthRepo() {
  const { authRepo } = await import('../services/factory')

  return authRepo
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isMountedRef = useRef(false)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { message } = App.useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const isOAuthCallbackRoute = location.pathname === GOOGLE_CALLBACK_ROUTE

  useEffect(() => {
    isMountedRef.current = true

    return () => {
      isMountedRef.current = false
    }
  }, [])

  const syncUserFromSession = useCallback(async (): Promise<AuthUser | null> => {
    try {
      const authRepo = await loadAuthRepo()
      const { data: res } = await authRepo.me()
      if (isMountedRef.current) {
        setUser(res.data.user)
      }
      return res.data.user
    } catch {
      if (isMountedRef.current) {
        setUser(null)
      }
      return null
    }
  }, [])

  const checkMe = useCallback(async () => {
    await syncUserFromSession()
    if (isMountedRef.current) {
      setIsLoading(false)
    }
  }, [syncUserFromSession])

  const refresh = useCallback(async () => {
    await checkMe()
  }, [checkMe])

  useEffect(() => {
    if (isOAuthCallbackRoute) {
      if (isMountedRef.current) {
        setIsLoading(false)
      }
      return
    }
    void checkMe()
  }, [checkMe, isOAuthCallbackRoute])

  const loginWithGoogle = useCallback(async () => {
    try {
      const authRepo = await loadAuthRepo()
      const { data: res } = await authRepo.getGoogleLoginUrl()
      window.location.assign(res.data.url)
    } catch (error: unknown) {
      message.error(getApiErrorMessage(error, 'Google sign-in failed'))
      throw error
    }
  }, [message])

  const completeGoogleLogin = useCallback(async (params: { code: string; state: string }): Promise<string> => {
    const authRepo = await loadAuthRepo()
    const redirectTo = await authRepo.completeGoogleLogin(params)
    await syncUserFromSession()
    return redirectTo
  }, [syncUserFromSession])

  const logout = useCallback(async () => {
    try {
      const authRepo = await loadAuthRepo()
      await authRepo.logout()
      message.success(t('auth.logout_success', 'Signed out successfully'))
    } catch (error: unknown) {
      message.error(getApiErrorMessage(error, t('auth.logout_failed', 'Sign out failed')))
    } finally {
      if (isMountedRef.current) {
        setUser(null)
      }
      navigate('/auth/login', { replace: true })
    }
  }, [message, navigate, t])

  const contextValue = useMemo(
    () => ({ user, isLoading, loginWithGoogle, completeGoogleLogin, logout, refresh }),
    [user, isLoading, loginWithGoogle, completeGoogleLogin, logout, refresh]
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
