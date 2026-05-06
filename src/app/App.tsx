import { Suspense, type ReactElement } from 'react'
import { BrowserRouter } from 'react-router-dom'

import { ParallaxBackground } from '@/shared/components/ui/parallax-background'
import { Spinner } from '@/shared/components/ui/spinner'

import { AppRoutes } from './routes'
import { Toaster } from 'sonner'

function App(): ReactElement {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <ParallaxBackground className="h-screen">
            <div className="flex h-full items-center justify-center">
              <Spinner className="size-10 text-primary" />
            </div>
          </ParallaxBackground>
        }
      >
        <AppRoutes />
        <Toaster />
      </Suspense>
    </BrowserRouter>
  )
}

export default App
