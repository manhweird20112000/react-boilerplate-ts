import type { ReactElement, ReactNode } from 'react'

import { TanstackQueryProvider } from '@/infra/tanstack-query/tanstack-query-provider'

export type ProtectedAppProvidersProps = {
  readonly children: ReactNode
}

export function ProtectedAppProviders(props: ProtectedAppProvidersProps): ReactElement {
  return <TanstackQueryProvider>{props.children}</TanstackQueryProvider>
}
