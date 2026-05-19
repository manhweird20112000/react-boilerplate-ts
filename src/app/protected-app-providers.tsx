import { Provider } from 'react-redux'
import type { ReactElement, ReactNode } from 'react'

import { store } from './store'
import { TanstackQueryProvider } from '@/infra/tanstack-query/tanstack-query-provider'

export type ProtectedAppProvidersProps = {
  readonly children: ReactNode
}

export function ProtectedAppProviders(props: ProtectedAppProvidersProps): ReactElement {
  return (
    <TanstackQueryProvider>
      <Provider store={store}>{props.children}</Provider>
    </TanstackQueryProvider>
  )
}
