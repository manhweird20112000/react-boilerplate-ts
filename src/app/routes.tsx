import { lazy, Suspense, type ReactElement } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthGuard, GuestGuard } from '~/features/auth/components/guards'

const AuthLayout = lazy(() =>
  import('~/features/auth/pages/auth-layout').then((m) => ({ default: m.AuthLayout }))
)
const LoginPage = lazy(() =>
  import('~/features/auth/pages/login-page').then((m) => ({ default: m.LoginPage }))
)
const RegisterPage = lazy(() =>
  import('~/features/auth/pages/register-page').then((m) => ({ default: m.RegisterPage }))
)
const ForgotPasswordPage = lazy(() =>
  import('~/features/auth/pages/forgot-password-page').then((m) => ({
    default: m.ForgotPasswordPage
  }))
)

/**
 * Application route tree; lazy-loaded feature pages stay in their modules.
 */
export function AppRoutes(): ReactElement {
  return (
    <Suspense fallback={null}>
      <Routes>
        {/* Public Auth Routes */}
        <Route element={<GuestGuard />}>
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
          </Route>
        </Route>

        {/* Protected Routes */}
        <Route element={<AuthGuard />}>
          <Route path="/dashboard" element={<div>Dashboard (Placeholder)</div>} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
