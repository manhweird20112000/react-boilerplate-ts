import type { ApiWorkbenchId } from './api-workbench-id.type'
import type { ApiWorkbenchRequest } from './api-workbench-request.type'
import type { ApiWorkbenchResponse } from './api-workbench-response.type'

export interface ApiWorkbenchHistoryEntry {
  readonly id: ApiWorkbenchId
  readonly request: ApiWorkbenchRequest
  readonly response: ApiWorkbenchResponse
  readonly sentAt: string
}

