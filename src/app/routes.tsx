import { type ReactElement } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

/**
 * Application route tree; lazy-loaded feature pages stay in their modules.
 */
export function AppRoutes(): ReactElement {
  return (
    <Routes>
      <Route path="/dashboard" element={<div>Dashboard (Placeholder)</div>} />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
