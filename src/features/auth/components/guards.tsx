import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/use-auth'
import { Spin } from 'antd'

export const AuthGuard: React.FC = () => {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div
        style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Spin size="large" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

export const GuestGuard: React.FC = () => {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div
        style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Spin size="large" />
      </div>
    )
  }

  if (user) {
    const from = (location.state as any)?.from?.pathname || '/'
    return <Navigate to={from} replace />
  }

  return <Outlet />
}
