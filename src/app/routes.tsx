import { type ReactElement } from 'react'
import { Route, Routes } from 'react-router-dom'

/**
 * Application route tree; lazy-loaded feature pages stay in their modules.
 */
export function AppRoutes(): ReactElement {
  return (
    <Routes>
      <Route path="/" element={<div>Hello World</div>} />
    </Routes>
  )
}
