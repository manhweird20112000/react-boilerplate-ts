import { QueryClientProvider } from '@tanstack/react-query'
import type { ReactElement, ReactNode } from 'react'

import { queryClient } from './query-client'

export type TanstackQueryProviderProps = {
  readonly children: ReactNode
}

export function TanstackQueryProvider(props: TanstackQueryProviderProps): ReactElement {
  return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
}

