import type { ApiWorkbenchId } from './api-workbench-id.type'
import type { ApiWorkbenchRequest } from './api-workbench-request.type'

export interface ApiWorkbenchFolder {
  readonly id: ApiWorkbenchId
  readonly name: string
  readonly folders: readonly ApiWorkbenchFolder[]
  readonly requests: readonly ApiWorkbenchRequest[]
  readonly createdAt: string
  readonly updatedAt: string
}

export interface ApiWorkbenchCollection {
  readonly id: ApiWorkbenchId
  readonly name: string
  readonly description?: string
  readonly folders: readonly ApiWorkbenchFolder[]
  readonly requests: readonly ApiWorkbenchRequest[]
  readonly createdAt: string
  readonly updatedAt: string
}

