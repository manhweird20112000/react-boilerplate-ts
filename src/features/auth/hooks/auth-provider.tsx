import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { App } from 'antd'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import type { AuthUser } from '../types'
import { GOOGLE_CALLBACK_ROUTE } from '../constants/admin-auth.paths'
import { AuthContext } from './auth-context'
import { getApiErrorMessage } from '../utils/api-error'

async function loadAuthRepo() {
  // Keep auth repository lazy so public auth pages do not eagerly load all API code.
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
    // Async auth calls can resolve after route changes/unmount; guard state updates.
    isMountedRef.current = true

    return () => {
      isMountedRef.current = false
    }
  }, [])

  const syncUserFromSession = useCallback(async (): Promise<AuthUser | null> => {
    try {
      const authRepo = await loadAuthRepo()
      // The backend owns the admin session through cookies. The client only asks
      // /admin/me to hydrate user state; it does not store access tokens.
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
      // The callback page must exchange code/state first. Calling /admin/me here
      // would race before the API has created the session cookie.
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
      // API returns the provider URL and sets/verifies OAuth state server-side.
      const { data: res } = await authRepo.getGoogleLoginUrl()
      window.location.assign(res.data.url)
    } catch (error: unknown) {
      message.error(getApiErrorMessage(error, 'Google sign-in failed'))
      throw error
    }
  }, [message])

  const completeGoogleLogin = useCallback(async (params: { code: string; state: string }): Promise<string> => {
    const authRepo = await loadAuthRepo()
    // Callback verification creates the cookie session, then we immediately
    // hydrate React auth state from /admin/me before redirecting.
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
