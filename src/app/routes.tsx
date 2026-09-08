import { DashboardPage } from '@/features/dashboard/pages'
import { Suspense, type ReactElement } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

function ErrorPage({ title }: { readonly title: string }): ReactElement {
  return <div>{title}</div>
}

function RouteFallback(): ReactElement {
  return (
    <div
      style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#6f43fd]" />
    </div>
  )
}

/**
 * Application route tree; lazy-loaded feature pages stay in their modules.
 */
export function AppRoutes(): ReactElement {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/" element={<DashboardPage />} />

        {/* Protected Routes */}

        <Route path="/403" element={<ErrorPage title="Forbidden" />} />
        <Route path="/404" element={<ErrorPage title="Not found" />} />
        <Route path="/500" element={<ErrorPage title="Server error" />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  )
}
