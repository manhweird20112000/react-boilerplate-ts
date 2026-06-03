import {
  API_WORKBENCH_DEFAULT_HISTORY_LIMIT,
  API_WORKBENCH_DEFAULT_TIMEOUT_MS,
  API_WORKBENCH_DEFAULT_WORKSPACE_NAME,
  API_WORKBENCH_SCHEMA_VERSION
} from '../constants/api-workbench-storage'
import type { ApiWorkbenchWorkspace } from '../types'
import { createApiWorkbenchId } from './api-workbench-id'

export function createEmptyApiWorkbenchWorkspace(input?: {
  readonly name?: string
  readonly now?: string
}): ApiWorkbenchWorkspace {
  const now = input?.now ?? new Date().toISOString()

  return {
    schemaVersion: API_WORKBENCH_SCHEMA_VERSION,
    id: createApiWorkbenchId(),
    name: input?.name ?? API_WORKBENCH_DEFAULT_WORKSPACE_NAME,
    collections: [],
    environments: [],
    history: [],
    settings: {
      historyLimit: API_WORKBENCH_DEFAULT_HISTORY_LIMIT,
      defaultTimeoutMs: API_WORKBENCH_DEFAULT_TIMEOUT_MS
    },
    createdAt: now,
    updatedAt: now
  }
}

