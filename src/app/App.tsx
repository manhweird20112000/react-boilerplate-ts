import { Component, type ErrorInfo, type ReactElement, type ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'

import { AppRoutes } from './routes'

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

function App(): ReactElement {
  return (
    <BrowserRouter>
      <AppErrorBoundary>
        <AppRoutes />
      </AppErrorBoundary>
    </BrowserRouter>
  )
}

export default App
