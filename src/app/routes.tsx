import { lazy, type ReactElement } from 'react'
import { Route, Routes } from 'react-router-dom'

const NotFoundPage = lazy(() => import('~/features/errors/pages'))
const ForbiddenPage = lazy(() => import('~/features/errors/pages/forbidden-page'))
const ServerErrorPage = lazy(() => import('~/features/errors/pages/server-error-page'))
/**
 * Application route tree; lazy-loaded feature pages stay in their modules.
 */
export function AppRoutes(): ReactElement {
  return (
    <Routes>
      <Route path="/403" element={<ForbiddenPage />} />
      <Route path="/500" element={<ServerErrorPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
