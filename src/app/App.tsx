import { Suspense, type ReactElement } from 'react'
import { BrowserRouter } from 'react-router-dom'

import { AppRoutes } from './routes'
import { Toaster } from 'sonner'

import { AuthProvider } from '~/features/auth/hooks/auth-provider'

function App(): ReactElement {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
        <Toaster />
      </Suspense>
    </BrowserRouter>
  )
}

export default App
