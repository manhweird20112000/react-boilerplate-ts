import { Suspense, type ReactElement } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { ApiWorkbenchPage } from '@/features/api-workbench'

function ErrorPage({ title }: { readonly title: string }): ReactElement {
  return <div>{title}</div>
}

/**
 * Application route tree; lazy-loaded feature pages stay in their modules.
 */
export function AppRoutes(): ReactElement {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Navigate to="/workbench" replace />} />
        <Route path="/workbench" element={<ApiWorkbenchPage />} />

        <Route path="/403" element={<ErrorPage title="Forbidden" />} />
        <Route path="/404" element={<ErrorPage title="Not found" />} />
        <Route path="/500" element={<ErrorPage title="Server error" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
