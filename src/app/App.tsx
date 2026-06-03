import { lazy, Suspense, useEffect, useState, type ReactElement } from 'react'
import { BrowserRouter } from 'react-router-dom'

import { TooltipProvider } from '@/shared/components/ui/tooltip'

import { AppRoutes } from './routes'

const LazyToaster = lazy(() => import('sonner').then((m) => ({ default: m.Toaster })))

type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number
  cancelIdleCallback?: (handle: number) => void
}

function IdleToaster(): ReactElement | null {
  const [isIdle, setIsIdle] = useState(false)

  useEffect(() => {
    const idleWindow = window as IdleWindow

    if (idleWindow.requestIdleCallback) {
      const handle = idleWindow.requestIdleCallback(() => setIsIdle(true), { timeout: 3000 })

      return () => idleWindow.cancelIdleCallback?.(handle)
    }

    const handle = window.setTimeout(() => setIsIdle(true), 1000)

    return () => window.clearTimeout(handle)
  }, [])

  if (!isIdle) {
    return null
  }

  return (
    <Suspense fallback={null}>
      <LazyToaster />
    </Suspense>
  )
}

function App(): ReactElement {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <AppRoutes />
        <IdleToaster />
      </TooltipProvider>
    </BrowserRouter>
  )
}

export default App
