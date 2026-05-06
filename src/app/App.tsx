import { Suspense, type ReactElement } from 'react'
import { BrowserRouter } from 'react-router-dom'

import { AppRoutes } from './routes'
import { Toaster } from 'sonner'

function App(): ReactElement {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <AppRoutes />
        <Toaster />
      </Suspense>
    </BrowserRouter>
  )
}

export default App
