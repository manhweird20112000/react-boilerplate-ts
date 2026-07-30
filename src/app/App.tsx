import { Component, lazy, Suspense, useEffect, useState, type ErrorInfo, type ReactElement, type ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'

import { AppRoutes } from './routes'

import { AuthProvider } from '~/features/auth/hooks/auth-provider'

const LazyToaster = lazy(() => import('sonner').then((m) => ({ default: m.Toaster })))

type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number
  cancelIdleCallback?: (handle: number) => void
}

type AppErrorBoundaryProps = {
  readonly children: ReactNode
}

type AppErrorBoundaryState = {
  readonly hasError: boolean
}

class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  public state: AppErrorBoundaryState = { hasError: false }

  public static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('App render failed', error, info)
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return <div>Something went wrong.</div>
    }
    return this.props.children
  }
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
      <AppErrorBoundary>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </AppErrorBoundary>
      <IdleToaster />
    </BrowserRouter>
  )
}

export default App
