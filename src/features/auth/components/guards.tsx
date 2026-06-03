import React from 'react'
import { Spin } from 'antd'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/use-auth'

function AuthLoadingScreen(): React.ReactElement {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spin size="large" />
    </div>
  )
}

export const AuthGuard: React.FC = () => {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <AuthLoadingScreen />
  }

  if (!user) {
    // Preserve the blocked destination so GuestGuard can return the user there
    // after a successful login.
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

export const GuestGuard: React.FC = () => {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <AuthLoadingScreen />
  }

  if (user) {
    // Auth pages are guest-only; authenticated users go back to the original
    // protected route when available, otherwise the app default route.
    const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/'
    return <Navigate to={from} replace />
  }

  return <Outlet />
}
