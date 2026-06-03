import type { ApiWorkbenchCollection } from './api-workbench-collection.type'
import type { ApiWorkbenchEnvironment } from './api-workbench-environment.type'
import type { ApiWorkbenchHistoryEntry } from './api-workbench-history.type'
import type { ApiWorkbenchId } from './api-workbench-id.type'

export interface ApiWorkbenchWorkspaceSettings {
  readonly historyLimit: number
  readonly defaultTimeoutMs: number
}

export interface ApiWorkbenchWorkspace {
  readonly schemaVersion: 1
  readonly id: ApiWorkbenchId
  readonly name: string
  readonly activeEnvironmentId?: ApiWorkbenchId
  readonly collections: readonly ApiWorkbenchCollection[]
  readonly environments: readonly ApiWorkbenchEnvironment[]
  readonly history: readonly ApiWorkbenchHistoryEntry[]
  readonly settings: ApiWorkbenchWorkspaceSettings
  readonly createdAt: string
  readonly updatedAt: string
}

