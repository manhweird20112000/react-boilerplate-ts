import type { ApiWorkbenchId } from './api-workbench-id.type'
import type { ApiWorkbenchRequest } from './api-workbench-request.type'
import type { ApiWorkbenchResponse } from './api-workbench-response.type'

export type ApiWorkbenchRunnerStatus = 'idle' | 'running' | 'stopped' | 'completed' | 'failed'

export interface ApiWorkbenchRunnerRequestResult {
  readonly id: ApiWorkbenchId
  readonly request: ApiWorkbenchRequest
  readonly response: ApiWorkbenchResponse
  readonly startedAt: string
  readonly completedAt: string
}

export interface ApiWorkbenchRunnerSummary {
  readonly total: number
  readonly completed: number
  readonly failed: number
  readonly durationMs: number
}

export interface ApiWorkbenchRunnerResult {
  readonly id: ApiWorkbenchId
  readonly status: ApiWorkbenchRunnerStatus
  readonly collectionId: ApiWorkbenchId
  readonly environmentId?: ApiWorkbenchId
  readonly results: readonly ApiWorkbenchRunnerRequestResult[]
  readonly summary: ApiWorkbenchRunnerSummary
  readonly startedAt: string
  readonly completedAt?: string
}

