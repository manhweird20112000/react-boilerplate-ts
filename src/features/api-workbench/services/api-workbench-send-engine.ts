import type { ApiWorkbenchRequest, ApiWorkbenchResponse } from '../types'

export interface ApiWorkbenchSendOptions {
  readonly signal?: AbortSignal
}

export abstract class ApiWorkbenchSendEngine {
  abstract send(
    request: ApiWorkbenchRequest,
    options?: ApiWorkbenchSendOptions
  ): Promise<ApiWorkbenchResponse>
}

