import type { ApiWorkbenchHttpMethod } from './api-workbench-request.type'

export interface ApiWorkbenchResponseHeader {
  readonly key: string
  readonly value: string
}

export interface ApiWorkbenchResponseSuccess {
  readonly type: 'success'
  readonly url: string
  readonly method: ApiWorkbenchHttpMethod
  readonly status: number
  readonly statusText: string
  readonly headers: readonly ApiWorkbenchResponseHeader[]
  readonly body: string
  readonly bodySizeBytes?: number
  readonly durationMs: number
  readonly receivedAt: string
}

export interface ApiWorkbenchResponseFailure {
  readonly type: 'failure'
  readonly url: string
  readonly method: ApiWorkbenchHttpMethod
  readonly errorType: 'network' | 'timeout' | 'cancelled' | 'invalid-request' | 'unknown'
  readonly message: string
  readonly durationMs?: number
  readonly receivedAt: string
}

export type ApiWorkbenchResponse = ApiWorkbenchResponseSuccess | ApiWorkbenchResponseFailure

