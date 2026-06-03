import type { ApiWorkbenchId } from './api-workbench-id.type'

export interface ApiWorkbenchKeyValue {
  readonly id: ApiWorkbenchId
  readonly key: string
  readonly value: string
  readonly enabled: boolean
  readonly description?: string
}

