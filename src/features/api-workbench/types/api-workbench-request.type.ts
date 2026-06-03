import type { ApiWorkbenchAuth } from './api-workbench-auth.type'
import type { ApiWorkbenchId } from './api-workbench-id.type'
import type { ApiWorkbenchKeyValue } from './api-workbench-key-value.type'

export type ApiWorkbenchHttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS'

export type ApiWorkbenchBodyMode = 'none' | 'raw' | 'form-data' | 'urlencoded'

export type ApiWorkbenchRawBodyLanguage = 'json' | 'text' | 'xml' | 'html'

export type ApiWorkbenchRequestBody =
  | {
      readonly mode: 'none'
    }
  | {
      readonly mode: 'raw'
      readonly raw: string
      readonly language: ApiWorkbenchRawBodyLanguage
    }
  | {
      readonly mode: 'form-data'
      readonly items: readonly ApiWorkbenchKeyValue[]
    }
  | {
      readonly mode: 'urlencoded'
      readonly items: readonly ApiWorkbenchKeyValue[]
    }

export interface ApiWorkbenchRequest {
  readonly id: ApiWorkbenchId
  readonly name: string
  readonly method: ApiWorkbenchHttpMethod
  readonly url: string
  readonly params: readonly ApiWorkbenchKeyValue[]
  readonly headers: readonly ApiWorkbenchKeyValue[]
  readonly auth: ApiWorkbenchAuth
  readonly body: ApiWorkbenchRequestBody
  readonly timeoutMs?: number
  readonly createdAt: string
  readonly updatedAt: string
}

export type ApiWorkbenchUnsavedRequest = Omit<
  ApiWorkbenchRequest,
  'id' | 'createdAt' | 'updatedAt'
>

